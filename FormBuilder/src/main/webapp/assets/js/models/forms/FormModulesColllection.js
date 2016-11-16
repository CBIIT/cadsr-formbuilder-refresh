import {Collection} from 'backbone';
import FormModuleModel from './FormModuleModel';
import EVENTS from '../../constants/EVENTS';
import {formChannel} from '../../channels/radioChannels';

const FormModulesCollection = Collection.extend({
	comparator: "dispOrder",
	model: FormModuleModel,
	initialize() {
		this.on("update change sort reset", () => {
			console.log("modules collection updated");
			formChannel.trigger(EVENTS.FORM.MODULES_UPDATED);
		});
	}
});

export default FormModulesCollection;