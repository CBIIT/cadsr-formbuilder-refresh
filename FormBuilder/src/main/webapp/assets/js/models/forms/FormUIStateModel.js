import {Model} from 'backbone';
import EVENTS from '../../constants/EVENTS';
import {formChannel} from '../../channels/radioChannels';
/**
 * maintains the state of the form layout UI and is passed into Form Layout React component as a prop.
 */
const FormUIStateModel = Model.extend({
	defaults: {
		/*determines whether the user can add new modules, reorder the modules, edit form details, etc FormLayout.shouldShowFormEditControls uses this a lot */
		isEditing:        false,
		/**
		 * The action the user is performing on the form when viewOnly: false,
		 */
		/* TODO add validate method that only allows for certain actions on set()  */
		actionMode:       null,
		cdeCartPopulated: false
	},
	initialize() {
		formChannel.reply(EVENTS.FORM.GET_FORM_ACTION_MODE, () =>{
			return this.attributes.actionMode;
		});
	}
});

const formUIStateModel = new FormUIStateModel();
export default formUIStateModel;