import {Model} from 'backbone';

/**
 * maintains the state of the Cart page UI and is passed into CartLayout React component as a prop. Shouldn't be associated with the quick carts view in the Form Layout
 */
const CartPageStateModel = Model.extend({
	defaults: {
		actionMode:       null
	}
});

const cartPageStateModel = new CartPageStateModel();
export default cartPageStateModel;