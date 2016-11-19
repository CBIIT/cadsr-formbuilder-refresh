import {Collection} from 'backbone';
import ClassificationModel from './ClassificationModel';
import ENDPOINT_URLS from '../../../constants/ENDPOINT_URLS';

const ClassificationCollection = Collection.extend({
	model : ClassificationModel,
	baseUrl: ENDPOINT_URLS.CLASSIFICATIONS,
	state: {
		pageSize: 50
	},
	mode: "client"
});

export default ClassificationCollection;