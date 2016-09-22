import {Collection} from 'backbone';
import CDEModel from './CDEModel';

const CDECollection = Collection.extend({
	model: CDEModel,
	initialize({url}) {
		this.url = url;
	}
});

export default CDECollection;