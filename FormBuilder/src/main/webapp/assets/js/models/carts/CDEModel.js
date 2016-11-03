import {Model} from 'backbone';
import ValidValuesCollection from './../forms/ValidValuesCollection';

const CDEModel = Model.extend({
	idAttribute: "deIdseq",
	constructor(attributes, options) {
		/* Pass any validValues into new ValidValuesCollection so each nested object becomes a ValidValueModel */
		if(attributes.validValues) {
			attributes.validValues = new ValidValuesCollection(attributes.validValues);
		}
		Model.apply(this, arguments);
	}
});
export default CDEModel;