/**
 * Created by nmilos on 10/11/16.
 */
import {Collection} from 'backbone';
import ModuleModel from './ModuleModel';

const ModuleCollection = Collection.extend({
	model: ModuleModel,
	initialize({baseUrl}) {
		this.baseUrl = baseUrl;
	}
});

export default ModuleCollection;