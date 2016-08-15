import {Model} from 'backbone';
import DropDownOptionsCollection from '../../forms/DropDownOptionsCollection';
/*
import formCategoriesCollection from '../../forms/FormCategoriesCollection';
*/


const FormSearchModel = Model.extend({
	defaults: {
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
		latestVersionOnly: false
	}
});

export default FormSearchModel;