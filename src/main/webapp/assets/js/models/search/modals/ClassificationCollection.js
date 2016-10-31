import PageableCollection from 'backbone.paginator';
import ClassificationModel from './ClassificationModel';
import ENDPOINT_URLS from '../../../constants/ENDPOINT_URLS';

const ClassificationCollection = PageableCollection.extend({
	model : ClassificationModel,
	baseUrl: ENDPOINT_URLS.CLASSIFICATIONS,
	state: {
		pageSize: 50
	},
	mode: "client"
});

export default ClassificationCollection;