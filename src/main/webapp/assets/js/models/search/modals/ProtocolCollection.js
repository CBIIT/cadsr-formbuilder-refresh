import PageableCollection from 'backbone.paginator';
import ProtocolModel from './ProtocolModel';
import ENDPOINT_URLS from '../../../constants/ENDPOINT_URLS';

const ProtocolCollection = PageableCollection.extend({
	model: ProtocolModel,
	baseUrl: ENDPOINT_URLS.PROTOCOLS,
	state: {
		pageSize: 50
	},
	mode: "client"
});

export default ProtocolCollection;