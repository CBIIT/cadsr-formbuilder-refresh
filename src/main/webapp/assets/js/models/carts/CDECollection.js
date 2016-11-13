import {Collection} from 'backbone';
import CDEModel from './CDEModel';

const CDECollection = Collection.extend({
	model: CDEModel/*,
	initialize({urlForFetch}) {
		this.urlForFetch = urlForFetch;
	}*/
});

export default CDECollection;