import {Collection} from 'backbone';
import ProtocolModel from './ProtocolModel';
import ENDPOINT_URLS from '../../../constants/ENDPOINT_URLS';

const ProtocolCollection = Collection.extend({
	model: ProtocolModel,
	baseUrl: ENDPOINT_URLS.PROTOCOLS,
	state: {
		pageSize: 50
	},
	mode: "client"
});

export default ProtocolCollection;