import {Model} from 'backbone';
import DropDownOptionsCollection from '../../forms/DropDownOptionsCollection';

const FormSearchModel = Model.extend({
	defaults: {
		contextRestriction: ['TEST', 'Training'],
		formLongName:  '',
		protocolIdSeq: '',
		protocolLongName: '',
		moduleLongName: '',
		cdePublicId: '',
		contexts: new DropDownOptionsCollection(),
		context: '',
		contextIdSeq: '',
		selectedContext: null,
		workflows: new DropDownOptionsCollection(),
		workflow: '',
		selectedWorflow: null,
		categories: new DropDownOptionsCollection(),
		categoryName: '',
		selectedCategory: '',
		types: new DropDownOptionsCollection(),
		type: '',
		selectedType: null,
		classification: '',
		selectedClassification: null,
		publicId: '',
		latestVersion: false
	}
});

export default FormSearchModel;