import {Collection} from 'backbone';
import ModuleModel from './ModuleModel';
import ENDPOINT_URLS from '../../constants/ENDPOINT_URLS';

const ModuleCollection = Collection.extend({
	model: ModuleModel,
	initialize({urlForFetch}) {
		this.urlForFetch = urlForFetch;
	},
	/*Models will use this when CRUDing themselves */
	url: ENDPOINT_URLS.MODULE_CART_PERSIST
});

export default ModuleCollection;