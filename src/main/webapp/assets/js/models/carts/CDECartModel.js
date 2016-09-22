import {Model} from 'backbone';
import CDECollection from './CDECollection';

const CDECartModel = Model.extend({
	name: "cdeCart",

	parse(response){
		const returnedResponse = typeof response === "string" ? JSON.parse(response) : response;
		/*marshalling nested objects/arrays into it's own collection to map to Backbone's nested model/collection  */
		const model = new CDECollection(returnedResponse);
		return returnedResponse;
	}
});

export default CDECartModel;