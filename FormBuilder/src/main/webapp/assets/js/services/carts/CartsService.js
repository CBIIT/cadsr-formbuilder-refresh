import Marionette from "backbone.marionette";
import ENDPOINT_URLS from '../../constants/ENDPOINT_URLS';
import EVENTS from '../../constants/EVENTS';
import userMessagesText from '../../constants/userMessagesText';
import urlHelpers from '../../helpers/urlHelpers';
import {ajaxDownloadFile, fetchSecure} from '../../helpers/ajaXHelpers';
import cartActions from '../../constants/cartActions';
import ModuleModel from '../../models/carts/ModuleModel';
import backboneModelHelpers from '../../helpers/backboneModelHelpers';
import CartsStateModel from '../../models/carts/CartsStateModel';
import {appChannel, cartChannel, formChannel} from '../../channels/radioChannels';
import CDECollection from '../../models/carts/CDECollection';
import FormCollection from '../../models/carts/FormCollection';
import ModuleCollection from '../../models/carts/ModuleCollection';
//import $ from 'jquery';

/**
 * This is a service object that maintains the state of the CDE Cart, Module Cart, and Form Cart.
 * If/when we decide to remove Marionette, we can just turn this into a basic class/object, but try to avoid adding BB radio channels/events onto the radioRequests/radioEvents class property and instead add via initialize() to make refactoring easier later
 */
/*TODO move common methods out into a mixin/HOF or baseController/baseService */
const CartsService = Marionette.Object.extend({
	initialize() {
		this.cartsStateModel = CartsStateModel;
		this.addInitialListeners();
		this.setupModels();
	},
	addInitialListeners() {
		cartChannel.reply(EVENTS.CARTS.SET_LAYOUT, (options) => this.dispatchLayout(options));
		cartChannel.reply(EVENTS.CARTS.GET_DOWNLOAD_XLS, (options) => this.handleDownloadXLS(options));
		cartChannel.reply(EVENTS.CARTS.GET_DOWNLOAD_XML, (options) => this.handleDownloadXML(options));
		cartChannel.reply(EVENTS.CARTS.REMOVE_CART_ITEM, (options) => this.handleRemoveCartItem(options));
		cartChannel.reply(EVENTS.CARTS.SET_LAST_CART_SORTED_BY, (options) => this.handleCartSortedBy(options));
		cartChannel.reply(EVENTS.CARTS.ADD_FORM, (options) => this.handleAddFormToCart(options));
		cartChannel.reply(EVENTS.CARTS.SAVE_TO_OBJECTCART, (options) => this.handleSaveToObjectCart(options));

		appChannel.reply(EVENTS.CARTS.GET_QUESTION_MODEL, (options) => this.getQuestionModelFromCDECartById(options));
		appChannel.reply(EVENTS.CARTS.GET_MODULE_MODEL, (options) => this.getQuestionModuleFromModuleCartById(options));
		appChannel.reply(EVENTS.APP.ADD_MODULE_FROM_FORM_TO_CART, (options) => this.handleAddModuleToModuleCart(options));

	},
	dispatchLayout({action}) {
		switch(action){
			case cartActions.VIEW_CDE_CART_PAGE:
				this.cartsStateModel.set({actionMode: action});
				this.fetchCarts({collection: this.cdeCartCollection});
				break;
			case cartActions.VIEW_FORM_CART_PAGE:
				this.cartsStateModel.set({actionMode: action});
				this.fetchCarts({collection: this.formCartCollection});
				break;
			case cartActions.VIEW_MODULE_CART_PAGE:
				this.cartsStateModel.set({actionMode: action});
				this.fetchCarts({collection: this.moduleCartCollection});
				break;
			default:
				console.error("no valid action provided");
		}
	},
	/**
	 *
	 * @param collection
	 * @param collectionName
	 * @param getCached
	 * @returns {Promise.<TResult>}
	 */
	fetchCarts({collection, collectionName, getCached = false}) {
		const urlQueryParams = {
			cached:   getCached
		};

		/*FormSerivce passes in a name prop that's a string. might want to have it pass the actual collection instead */
		collection = collection || this[collectionName];
		/* TODO refactor to handle array of carts */
		const p = new Promise(
			(resolve, reject) =>{
				collection.fetch({
					url: urlHelpers.buildUrl(collection.urlForFetch, urlQueryParams)
				}).then((model, results) =>{
					resolve(collection);
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
	/*TODO modules in the module colleciton don't current have an idAttribute set, so I'm specifically getting by the moduleSeqId */
	getQuestionModuleFromModuleCartById(id) {
		return this.moduleCartCollection.get(id);
	},
	getQuestionModelFromCDECartById(id) {
		return this.cdeCartCollection.get(id);
	},
	handleAddModuleToModuleCart({id}) {
		const moduleModelFromForm = formChannel.request(EVENTS.FORM.GET_MODULE, id);
		const modulePojo = backboneModelHelpers.getDeepModelPojo(moduleModelFromForm, false);
		delete modulePojo.isEdited;
		/*TODO is this still needed? */
		if(modulePojo.moduleIdseq){
			delete modulePojo.moduleIdseq;
		}
		const newModuleModel = this.moduleCartCollection.add(new ModuleModel(modulePojo));
		newModuleModel.save();
	},
	/*TODO Incomplete */
	handleCartSortedBy (cartUIState){
		this.cartsStateModel.set(cartUIState);
	},

	handleDownloadXML({itemsIds}) {
		const idsString = itemsIds.join();
		const action = this.cartsStateModel.get("actionMode");
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
		const action = this.cartsStateModel.get("actionMode");
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
		const action = this.cartsStateModel.get("actionMode");
		switch(action){
			case cartActions.VIEW_CDE_CART_PAGE:
				this.destroyCartItems({collection: this.cdeCartCollection, itemsToRemove: itemsToRemove});
				break;
			case cartActions.VIEW_FORM_CART_PAGE:
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
	listenToCartCollections() {
		this.listenTo(this.cdeCartCollection, "update", () =>{
			appChannel.trigger(EVENTS.CARTS.CDE_CART_UPDATED);
		});
		this.listenTo(this.moduleCartCollection, "update", () =>{
			appChannel.trigger(EVENTS.CARTS.MODULE_CART_UPDATED);
		});
		this.listenTo(this.formCartCollection, "update", () =>{
			appChannel.trigger(EVENTS.CARTS.FORM_CART_UPDATED);
		});
	},
	setupModels() {
		this.cdeCartCollection = new CDECollection();
		/*Setting in init didn't seem to work */
		this.cdeCartCollection.urlForFetch = ENDPOINT_URLS.CDE_CART_FETCH;
		this.cdeCartCollection.url = ENDPOINT_URLS.CDE_CART_PERSIST;

		this.formCartCollection = new FormCollection();
		/*Setting in init didn't seem to work */
		this.formCartCollection.urlForFetch = ENDPOINT_URLS.FORM_CART_FETCH;
		this.formCartCollection.url = ENDPOINT_URLS.FORM_CART_PERSIST;

		this.moduleCartCollection = new ModuleCollection();
		/*Setting in init didn't seem to work */
		this.moduleCartCollection.urlForFetch = ENDPOINT_URLS.MODULE_CART_FETCH;
		this.moduleCartCollection.url = ENDPOINT_URLS.MODULE_CART_PERSIST;

		this.listenToCartCollections();
	},

	handleAddFormToCart(formMetadata, callback) {
		fetchSecure({
				url: `${ENDPOINT_URLS.CARTS.ADD_FORM}`,
				method: "POST",
				data: JSON.stringify(formMetadata),
				dataType: 'none',
				swallowErrors: false
			}
		).then((data) => {
			appChannel.request(EVENTS.APP.SHOW_USER_MESSAGE,{
				message: "The Form has been added to the Form Cart successfully",
				level: "success"
			});
		}).catch(() => {
			appChannel.request(EVENTS.APP.SHOW_USER_MESSAGE,{
				message: "The Form failed adding to the Form Cart",
				level: "error"
			});
		});
	},
	handleSaveToObjectCart({selectedItems}) {
		const idsString = selectedItems.join();

		fetchSecure({
				url: `${ENDPOINT_URLS.CARTS.FORM_CART_PERSIST_OBJECTCART}/${idsString}`
		}
		).then(() => {
			appChannel.request(EVENTS.APP.SHOW_USER_MESSAGE,{
				message: userMessagesText.CARTS.SAVE_OBJECT_CART_SUCCESS,
				level: "success"
			});
		}).catch(() => {
			appChannel.request(EVENTS.APP.SHOW_USER_MESSAGE,{
				message: userMessagesText.CARTS.SAVE_OBJECT_CART_FAIL,
				level: "error"
			});
		});
	}
});

const cartsService = new CartsService();
Object.freeze(cartsService);
export default cartsService;