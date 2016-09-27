import {Model} from 'backbone';

/**
 * maintains the state of the form layout UI and is passed into Form Layout React component as a prop.
 */
const FormUIStateModel = Model.extend({
	defaults: {
		/*determines whether the user can add new modules, reorder the modules, edit form details, etc */
		isEditing:        false,
		/**
		 * The action the user is performing on the form when viewOnly: false,
		 */
		/* TODO add validate method that only allows for certain actions  */
		actionMode:       null,
		cdeCartPopulated: false
	}
});

const formUIStateModel = new FormUIStateModel();
export default formUIStateModel;