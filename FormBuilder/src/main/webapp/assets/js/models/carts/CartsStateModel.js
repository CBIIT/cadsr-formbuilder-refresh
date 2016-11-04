import {Model} from 'backbone';

/**
 * maintains the state of the Cart page UI and is passed into CartLayout React component as a prop. Shouldn't be associated with the quick carts view in the Form Layout
 */
const CartsStateModel = Model.extend({
	defaults: {
		actionMode:       null,
		CDECartUIState: {},
		FormCartUIState: {},
		ModuleCartUIState: {}
	}
});

const cartsStateModel = new CartsStateModel();
export default cartsStateModel;