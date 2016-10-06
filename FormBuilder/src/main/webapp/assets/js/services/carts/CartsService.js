import Marionette from "backbone.marionette";
import React from 'react';
import {render} from 'react-dom';
import cartsRouter from  "../../routers/CartsRouter";
import ENDPOINT_URLS from '../../constants/ENDPOINT_URLS';
import EVENTS from '../../constants/EVENTS';
import cartActions from '../../constants/cartActions';
import {appChannel, cartChannel} from '../../channels/radioChannels';
import CDECollection from '../../models/carts/CDECollection';
import CartLayout from '../../components/carts/CartLayout';

/**
 * This is a service object that maintains the state of the CDE Cart, Module Cart, and Form Cart.
 * If/when we decide to remove Marionette, we can just turn this into a basic class/object, but try to avoid adding BB radio channels/events onto the radioRequests/radioEvents class property and instead add via initialize() to make refactoring easier later
 */
/*TODO move common methods out into a mixin/HOF or baseController/baseService */
const CartsService = Marionette.Object.extend({
	initialize() {
		const cartsRouter = cartsRouter;
		 cartChannel.reply(EVENTS.CARTS.SET_LAYOUT, (options) => this.dispatchLayout(options));
		this.setupModels();
	},
	constructLayout(){
		/*Entry point for React. Backbone Views Keep Out
		 * Once React is the top level view currently handled by Marionette (i.e.  AppLayoutView,js), we can render CartLayout from there instead  */
		render(
			<CartLayout cdeCartCollection={this.cdeCartCollection} />, document.getElementById('main'));

	},
	dispatchLayout({action}) {
		switch(action){
			case cartActions.VIEW_CDE_CART_PAGE:
				this.fetchCarts({name: "cdeCart"});
				this.constructLayout();
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
		const cdeCartCollection = this.cdeCartCollection;
		/* TODO refactor to handle array of carts */
		const p = new Promise(
			(resolve, reject) =>{
				cdeCartCollection.fetch().then(() =>{
					resolve(cdeCartCollection);
				}).catch((error) =>{
					console.log(error);
				});
			}
		);
		return p.then((name)=>{
			return name;
		}).catch((error)=>{
			console.log(error);
		});
	},
	setupModels() {
		const user = appChannel.request(EVENTS.USER.GET_USERNAME);

		this.cdeCartCollection = new CDECollection({
			url: `${ENDPOINT_URLS.CDE_CART}/${user}`
		});
	}
});

export default CartsService;