import {Collection} from 'backbone';
import ModuleModel from './ModuleModel';

const ModuleCollection = Collection.extend({
	model: ModuleModel,
	initialize({urlForFetch}) {
		this.urlForFetch = urlForFetch;
	}
});

export default ModuleCollection;