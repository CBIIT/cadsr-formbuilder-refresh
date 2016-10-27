import {Collection} from 'backbone';
import FormModel from './FormModel';
import ENDPOINT_URLS from '../../constants/ENDPOINT_URLS';

const FormCollection = Collection.extend({
	model: FormModel,
	initialize({urlForFetch}) {
		this.urlForFetch = urlForFetch;
	},
	/*Models will use this when CRUDing themselves */
	url: ENDPOINT_URLS.MODULE_CART_PERSIST
});

export default FormCollection;