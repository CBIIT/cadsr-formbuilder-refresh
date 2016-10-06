import {Router} from 'backbone';
import EVENTS from '../constants/EVENTS';
import ROUTES from '../constants/ROUTES';
import cartActions from '../constants/cartActions';
import {cartChannel} from '../channels/radioChannels';

const CartsRouter = Router.extend({
	routes: {
		[ROUTES.CART.VIEW_CDE_CART_PAGE]: 'setViewCDEPage'
	},
	setViewCDEPage () {
		cartChannel.request(EVENTS.CARTS.SET_LAYOUT, {action: cartActions.VIEW_CDE_CART_PAGE});
	}
});
const cartsRouter = new CartsRouter;
export default cartsRouter;