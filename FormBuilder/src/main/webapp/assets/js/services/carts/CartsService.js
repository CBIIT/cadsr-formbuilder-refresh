import Marionette from "backbone.marionette";
import React from 'react';
import {render} from 'react-dom';
import cartsRouter from  "../../routers/CartsRouter";
import ENDPOINT_URLS from '../../constants/ENDPOINT_URLS';
import EVENTS from '../../constants/EVENTS';
import cartActions from '../../constants/cartActions';
import CartPageStateModel from '../../models/carts/CartPageStateModel';
import {appChannel, cartChannel} from '../../channels/radioChannels';
import CDECollection from '../../models/carts/CDECollection';
import FormCollection from '../../models/carts/FormCollection';
import ModuleCollection from '../../models/carts/ModuleCollection';
import CartLayout from '../../components/carts/CartLayout';

/**
 * This is a service object that maintains the state of the CDE Cart, Module Cart, and Form Cart.
 * If/when we decide to remove Marionette, we can just turn this into a basic class/object, but try to avoid adding BB radio channels/events onto the radioRequests/radioEvents class property and instead add via initialize() to make refactoring easier later
 */
/*TODO move common methods out into a mixin/HOF or baseController/baseService */
const CartsService = Marionette.Object.extend({
	initialize() {
		const cartsRouter = cartsRouter;
		this.cartPageStateModel = CartPageStateModel;

		cartChannel.reply(EVENTS.CARTS.SET_LAYOUT, (options) => this.dispatchLayout(options));
		cartChannel.reply(EVENTS.CARTS.GET_DOWNLOAD_XLS, (options) => this.handleDownloadXLS(options));
		cartChannel.reply(EVENTS.CARTS.GET_DOWNLOAD_XML, (options) => this.handleDownloadXML(options));
		cartChannel.reply(EVENTS.CARTS.REMOVE_CART_ITEM, (options) => this.handleRemoveCartItem(options));
		cartChannel.reply(EVENTS.CARTS.SET_LAST_CART_SORTED_BY, (options) => this.handleCartSortedBy(options));
		this.setupModels();
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
		render(
			<CartLayout cartPageStateModel={this.cartPageStateModel} data={data} cart={cart}/>, document.getElementById('main'));

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
	fetchCarts({name}) {
		let dataCollection;

		if(name === 'cdeCart'){
			dataCollection = this.cdeCartCollection;
		}
		else if(name === 'moduleCart'){
			dataCollection = this.moduleCartCollection;
		}
		else{
			dataCollection = this.formCartCollection;
		}

		/* TODO refactor to handle array of carts */
		const p = new Promise(
			(resolve, reject) =>{
				dataCollection.fetch().then(() =>{
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
	handleCartSortedBy ({sortKey, sortOrder}){
		const action = this.cartPageStateModel.get("actionMode");
		switch(action){
			case cartActions.VIEW_CDE_CART_PAGE:
				this.cartPageStateModel.set({CDECartUIState: {
					lastSortedByKey: sortKey,
					lastSortOrder: sortOrder
				}});
				break;
			case cartActions.VIEW_FORM_CART_PAGE:
				this.cartPageStateModel.set({FormCartUIState: {
					lastSortedByKey: sortKey,
					lastSortOrder: sortOrder
				}});
				break;
			case cartActions.VIEW_MODULE_CART_PAGE:
				this.cartPageStateModel.set({ModuleCartUIState: {
					lastSortedByKey: sortKey,
					lastSortOrder: sortOrder
				}});
				break;
			default:
				console.error("no valid action provided");
		}

	},
	handleDownloadXLS() {

	},
	handleDownloadXML() {

	},
	handleRemoveCartItem({itemsToRemove}) {
		const action = this.cartPageStateModel.get("actionMode");
		switch(action){
			case cartActions.VIEW_CDE_CART_PAGE:
				this.cdeCartCollection.remove(itemsToRemove);
				this.saveCart({cart: this.cdeCartCollection, successMessage: "CDE Cart Saved"});
				break;
			case cartActions.VIEW_FORM_CART_PAGE:
				this.formCartCollection.remove(itemsToRemove);
				this.saveCart({cart: this.formCartCollection, successMessage: "Form Cart Saved"});
				break;
			case cartActions.VIEW_MODULE_CART_PAGE:
				this.moduleCartCollection.remove(itemsToRemove);
				this.saveCart({cart: this.moduleCartCollection, successMessage: "Module Cart Saved"});
				break;
			default:
				console.error("no valid action provided");
		}
	},
	saveCart({cart, successMessage} = {}) {
		const p = new Promise(
			(resolve, reject) =>{
				cart.save(null, {
					dataType: 'text'
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
	},
	setupModels() {
		this.cdeCartCollection = new CDECollection({
			url: `${ENDPOINT_URLS.CDE_CART}`
		});
		this.formCartCollection = new FormCollection({
			url: `${ENDPOINT_URLS.FORM_CART}`
		});
		this.moduleCartCollection = new ModuleCollection({
			url: `${ENDPOINT_URLS.MODULE_CART}`
		});
	}
});

export default CartsService;