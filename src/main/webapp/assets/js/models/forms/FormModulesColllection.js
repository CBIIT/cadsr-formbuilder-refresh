import {Collection} from 'backbone';
import FormModuleModel from './FormModuleModel';

const FormModulesCollection = Collection.extend({
	model: FormModuleModel
});

export default FormModulesCollection;