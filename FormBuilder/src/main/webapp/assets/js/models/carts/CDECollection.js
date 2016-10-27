import {Collection} from 'backbone';
import CDEModel from './CDEModel';
import ENDPOINT_URLS from '../../constants/ENDPOINT_URLS';

const CDECollection = Collection.extend({
	model: CDEModel,
	initialize({urlForFetch}) {
		this.urlForFetch = urlForFetch;
	},
	/*Models will use this when CRUDing themselves */
	url: ENDPOINT_URLS.MODULE_CART_PERSIST
});

export default CDECollection;