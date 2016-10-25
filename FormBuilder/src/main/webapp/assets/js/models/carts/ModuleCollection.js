import {Collection} from 'backbone';
import ModuleModel from './ModuleModel';
import ENDPOINT_URLS from '../../constants/ENDPOINT_URLS';

const ModuleCollection = Collection.extend({
	model: ModuleModel,
	url: ENDPOINT_URLS.MODULE_CART
});

export default ModuleCollection;