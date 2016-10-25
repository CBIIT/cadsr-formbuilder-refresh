import Marionette from "backbone.marionette";
import ENDPOINT_URLS from '../../constants/ENDPOINT_URLS';
import EVENTS from '../../constants/EVENTS';
import urlHelpers from '../../helpers/urlHelpers';
import {ajaxDownloadFile} from '../../helpers/ajaXHelpers';
import cartActions from '../../constants/cartActions';
import CartPageStateModel from '../../models/carts/CartPageStateModel';
import {appChannel, cartChannel} from '../../channels/radioChannels';
import CDECollection from '../../models/carts/CDECollection';
import FormCollection from '../../models/carts/FormCollection';
import ModuleCollection from '../../models/carts/ModuleCollection';

/**
 * This is a service object that maintains the state of the CDE Cart, Module Cart, and Form Cart.
 * If/when we decide to remove Marionette, we can just turn this into a basic class/object, but try to avoid adding BB radio channels/events onto the radioRequests/radioEvents class property and instead add via initialize() to make refactoring easier later
 */
/*TODO move common methods out into a mixin/HOF or baseController/baseService */
const CartsService = Marionette.Object.extend({
	initialize() {
		const cartsRouter = cartsRouter;
		this.cartPageStateModel = CartPageStateModel;
		this.addInitialListeners();
		this.setupModels();
	},
	addInitialListeners() {
		cartChannel.reply(EVENTS.CARTS.SET_LAYOUT, (options) => this.dispatchLayout(options));
		cartChannel.reply(EVENTS.CARTS.GET_DOWNLOAD_XLS, (options) => this.handleDownloadXLS(options));
		cartChannel.reply(EVENTS.CARTS.GET_DOWNLOAD_XML, (options) => this.handleDownloadXML(options));
		cartChannel.reply(EVENTS.CARTS.REMOVE_CART_ITEM, (options) => this.handleRemoveCartItem(options));
		cartChannel.reply(EVENTS.CARTS.SET_LAST_CART_SORTED_BY, (options) => this.handleCartSortedBy(options));

		appChannel.reply(EVENTS.CARTS.GET_QUESTION_MODEL, (options) => this.getQuestionModelFromCDECartById(options));

	},
	constructLayout(cart){
		/*Entry point for React. Backbone Views Keep Out
		 * Once React is the top level view currently handled by Marionette (i.e.  AppLayoutView,js), we can render CartLayout from there instead  */
		let data = '';
		if(cart === 'Module'){
			data = this.moduleCartCollection;
		}
		else if(cart === 'Form'){
			data = this.formCartCollection;
		}
		else{
			data = this.cdeCartCollection;
		}
		return {
			cartPageStateModel: this.cartPageStateModel,
			data: data,
			cart: cart
		}

	},
	dispatchLayout({action}) {
		switch(action){
			case cartActions.VIEW_CDE_CART_PAGE:
				this.cartPageStateModel.set({actionMode: action});
				this.fetchCarts({name: "cdeCart"});
				this.constructLayout('CDE');
				break;
			case cartActions.VIEW_FORM_CART_PAGE:
				this.cartPageStateModel.set({actionMode: action});
				this.fetchCarts({name: "formCart"});
				this.constructLayout('Form');
				break;
			case cartActions.VIEW_MODULE_CART_PAGE:
				this.cartPageStateModel.set({actionMode: action});
				this.fetchCarts({name: "moduleCart"});
				this.constructLayout('Module');
				break;
			default:
				console.error("no valid action provided");
		}
	},
	/**
	 *
	 * @returns {Promise.<TResult>}
	 */
	fetchCarts({name, getCached = false}) {
		const userName = appChannel.request(EVENTS.USER.GET_USERNAME);
		let dataCollection,
			urlQueryParams;

		if(name === 'cdeCart'){
			dataCollection = this.cdeCartCollection;
			urlQueryParams = {
				cached:   getCached,
				username: userName
			};
		}
		else if(name === 'moduleCart'){
			dataCollection = this.moduleCartCollection;
		}
		else{
			dataCollection = this.formCartCollection;
			urlQueryParams = {
				cached:   getCached,
				username: userName
			};
		}

		/* TODO refactor to handle array of carts */
		const p = new Promise(
			(resolve, reject) =>{
				dataCollection.fetch({
					url: urlHelpers.buildUrl(dataCollection.baseUrl, urlQueryParams)
				}).then(() =>{
					resolve(dataCollection);
				}).catch((error) =>{
					console.log(error);
				});
			}
		);
		return p.then((collection)=>{
			return collection;
		}).catch((error)=>{
			console.log(error);
		});
	},
	getQuestionModelFromCDECartById(id) {
		return this.cdeCartCollection.get(id);
	},
	handleCartSortedBy ({sortKey, sortOrder}){
		const action = this.cartPageStateModel.get("actionMode");
		switch(action){
			case cartActions.VIEW_CDE_CART_PAGE:
				this.cartPageStateModel.set({
					CDECartUIState: {
						lastSortedByKey: sortKey,
						lastSortOrder:   sortOrder
					}
				});
				break;
			case cartActions.VIEW_FORM_CART_PAGE:
				this.cartPageStateModel.set({
					FormCartUIState: {
						lastSortedByKey: sortKey,
						lastSortOrder:   sortOrder
					}
				});
				break;
			case cartActions.VIEW_MODULE_CART_PAGE:
				this.cartPageStateModel.set({
					ModuleCartUIState: {
						lastSortedByKey: sortKey,
						lastSortOrder:   sortOrder
					}
				});
				break;
			default:
				console.error("no valid action provided");
		}

	},

	handleDownloadXML({itemsIds}) {
		const idsString = itemsIds.join();
		const action = this.cartPageStateModel.get("actionMode");
		switch(action){
			case cartActions.VIEW_CDE_CART_PAGE:
				ajaxDownloadFile(`${ENDPOINT_URLS.CDE_DOWNLOAD_XML}/${idsString}`, 'xml');
				break;
			case cartActions.VIEW_FORM_CART_PAGE:
				ajaxDownloadFile(`${ENDPOINT_URLS.FORM_DOWNLOAD_XML}/${idsString}`, 'xml');
				break;
			default:
				console.error("no valid action provided");
		}

	},
	handleDownloadXLS({itemsIds}) {
		const idsString = itemsIds.join();
		const action = this.cartPageStateModel.get("actionMode");
		switch(action){
			case cartActions.VIEW_CDE_CART_PAGE:
				ajaxDownloadFile(`${ENDPOINT_URLS.CDE_DOWNLOAD_XLS}/${idsString}`, 'xls');
				break;
			case cartActions.VIEW_FORM_CART_PAGE:
				ajaxDownloadFile(`${ENDPOINT_URLS.FORM_DOWNLOAD_XLS}/${idsString}`, 'xls');
				break;
			default:
				console.error("no valid action provided");
		}
	},
	handleRemoveCartItem({itemsToRemove}) {
		const action = this.cartPageStateModel.get("actionMode");
		switch(action){
			case cartActions.VIEW_CDE_CART_PAGE:
				this.cdeCartCollection.url = this.cdeCartCollection.baseUrl;
				this.destroyCartItems({collection: this.cdeCartCollection, itemsToRemove: itemsToRemove});
				break;
			case cartActions.VIEW_FORM_CART_PAGE:
				this.cdeCartCollection.url = this.formCartCollection.baseUrl;
				this.destroyCartItems({collection: this.formCartCollection, itemsToRemove: itemsToRemove});
				break;
			case cartActions.VIEW_MODULE_CART_PAGE:
				this.destroyCartItems({collection: this.moduleCartCollection, itemsToRemove: itemsToRemove});
				break;
			default:
				console.error("no valid action provided");
		}
	},
	destroyCartItems({collection, itemsToRemove}) {
		itemsToRemove.forEach((item) =>{
			collection.get(item).destroy();
		});
	},
	/*TODO to be removed once sure we're not saving entire cart arrays */
	/*saveCart({cart, successMessage} = {}) {
	 const userName = appChannel.request(EVENTS.USER.GET_USERNAME);
	 let urlQueryParams;
	 switch(cart){
	 case this.cdeCartCollection:
	 urlQueryParams = {username: userName};
	 break;
	 case this.moduleCartCollection:
	 break;
	 case this.formCartCollection:
	 urlQueryParams = {username: userName};
	 break;
	 default:
	 console.error("no valid action provided");
	 }
	 cart.url = urlHelpers.buildUrl(cart.baseUrl, urlQueryParams);
	 const p = new Promise(
	 (resolve, reject) =>{
	 cart.sync({"DELETE"
	 }).then(() =>{
	 resolve();
	 }).catch((error) =>{
	 reject(error);
	 });
	 }
	 );
	 return p.then(()=>{
	 if(successMessage) alert(successMessage);
	 }).catch((error)=>{
	 alert("error");
	 console.log(error);
	 });
	 },*/
	setupModels() {
		this.cdeCartCollection = new CDECollection({
			baseUrl: `${ENDPOINT_URLS.CDE_CART}`
		});
		this.formCartCollection = new FormCollection({
			baseUrl: `${ENDPOINT_URLS.FORM_CART}`
		});
		this.moduleCartCollection = new ModuleCollection({
			baseUrl: `${ENDPOINT_URLS.MODULE_CART}`
		});
	}
});

const cartsService = new CartsService();
Object.freeze(cartsService);
export default cartsService;