import {Collection} from 'backbone';
import CDEModel from './CDEModel';

const CDECollection = Collection.extend({
	model: CDEModel,
	initialize({baseUrl}) {
		this.baseUrl = baseUrl;
	}
});

export default CDECollection;