import {Collection} from 'backbone';
import FormModuleModel from './FormModuleModel';

const FormModulesCollection = Collection.extend({
	comparator: "dispOrder",
	model: FormModuleModel
});

export default FormModulesCollection;