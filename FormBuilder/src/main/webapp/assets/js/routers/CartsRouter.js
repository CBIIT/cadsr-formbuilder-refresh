import {Router} from 'backbone';
import EVENTS from '../constants/EVENTS';
import ROUTES from '../constants/ROUTES';
import cartActions from '../constants/cartActions';
import {cartChannel} from '../channels/radioChannels';

const CartsRouter = Router.extend({
	routes: {
		[ROUTES.CART.VIEW_CDE_CART_PAGE]:    'setViewCDECartPage',
		[ROUTES.CART.VIEW_FORM_CART_PAGE]:   'setViewFormCartPage',
		[ROUTES.CART.VIEW_MODULE_CART_PAGE]: 'setViewModuleCartPage'
	},
	setViewCDECartPage () {
		cartChannel.request(EVENTS.CARTS.SET_LAYOUT, {action: cartActions.VIEW_CDE_CART_PAGE});
	},
	setViewFormCartPage() {
		cartChannel.request(EVENTS.CARTS.SET_LAYOUT, {action: cartActions.VIEW_FORM_CART_PAGE});
	},
	setViewModuleCartPage() {
		cartChannel.request(EVENTS.CARTS.SET_LAYOUT, {action: cartActions.VIEW_MODULE_CART_PAGE});
	}
});
const cartsRouter = new CartsRouter;
export default cartsRouter;