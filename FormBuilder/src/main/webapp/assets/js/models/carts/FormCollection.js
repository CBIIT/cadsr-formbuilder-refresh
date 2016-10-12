/**
 * Created by nmilos on 10/11/16.
 */
import {Collection} from 'backbone';
import ModuleModel from './ModuleModel';

const FormCollection = Collection.extend({
	model: ModuleModel,
	initialize({url}) {
		this.url = url;
	}
});

export default FormCollection;