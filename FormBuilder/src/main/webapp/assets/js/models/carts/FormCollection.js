import {Collection} from 'backbone';
import FormModel from './FormModel';

const FormCollection = Collection.extend({
	model: FormModel,
	initialize({baseUrl}) {
		this.baseUrl = baseUrl;
	}
});

export default FormCollection;