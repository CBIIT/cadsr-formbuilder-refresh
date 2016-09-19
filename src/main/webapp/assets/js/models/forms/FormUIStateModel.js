import {Model} from 'backbone';

/**
 * maintains the state of the form layout UI and is passed into Form Layout React component as a prop.
 */
const FormUIStateModel = Model.extend({
	defaults: {
		/* TODO add validate methlod that only allows for certain strings */
		actionMode: null
	}
});

const formUIStateModel = new FormUIStateModel();
export default formUIStateModel;