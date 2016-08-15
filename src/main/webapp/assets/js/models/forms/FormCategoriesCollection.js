import {Collection} from 'backbone';
import ENDPOINT_URLS from '../../constants/ENDPOINT_URLS'
import DropDownOptionModel from './DropDownOptionModel';

const FormCategoriesCollection = Collection.extend({
	url: ENDPOINT_URLS.categoriesEndPointUrl,
	model: DropDownOptionModel,
	initialize() {
		this.fetch();
	}
});

const formCategoriesCollection = new FormCategoriesCollection();

export default formCategoriesCollection;