import {Router} from 'backbone';
import EVENTS from '../constants/EVENTS';
import ROUTES from '../constants/ROUTES';
import {cartsChannel} from '../channels/radioChannels';

const CartsRouter = Router.extend({});
const cartsRouter = new CartsRouter;
export default cartsRouter;