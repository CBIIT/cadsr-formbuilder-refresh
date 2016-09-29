import Marionette from "backbone.marionette";
import cartsRouter from  "../../routers/CartsRouter";
import ENDPOINT_URLS from '../../constants/ENDPOINT_URLS';
import EVENTS from '../../constants/EVENTS';
import {appChannel} from '../../channels/radioChannels';
import CDECollection from '../../models/carts/CDECollection';
/**
 * This is a service object that maintains the state of the CDE Cart, Module Cart, and Form Cart.
 */
/*TODO move common methods out into a mixin/HOF or baseController/baseService */
const CartsService = Marionette.Object.extend({
	channelName: 'carts',
	initialize(user) {
		const cartsRouter = cartsRouter;
		/*
		 appChannel.on(EVENTS.USER.LOGIN_SUCCESS, () => this.setupModels());
		 */
		this.setupModels();
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