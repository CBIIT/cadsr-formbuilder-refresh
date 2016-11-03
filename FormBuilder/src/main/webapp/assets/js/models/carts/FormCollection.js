import {Collection} from 'backbone';
import FormModel from './FormModel';

const FormCollection = Collection.extend({
	model: FormModel/*,
	initialize({urlForFetch}) {
		this.urlForFetch = urlForFetch;
	}*/
});

export default FormCollection;