import Marionette from 'backbone.marionette';
import EVENTS from '../../constants/EVENTS';
import {searchChannel} from '../../channels/radioChannels';
import ProtocolCollection from '../../models/search/modals/ProtocolCollection';
import ClassificationCollection from '../../models/search/modals/ClassificationCollection';
import ENDPOINT_URLS from '../../constants/ENDPOINT_URLS';

/**
 * Service for server/browser IO for Protocol and Classification lists.  Flow is as follows:
 * * User enters a keyword in the search panel and cliks GO
 * * backbone.radio sends request to here - handled by this.handleProtocolSearchGo()
 *   or this.handleClassificationSearchGo()
 * * Those functions send the request to server with Backbone.Collection.fetch() with reset
 * * The reset event is captured by Backbone event handling (@see this.initialize()) to call
 *   this.dispatchProtocolList() or this.dispatchClassificationList()
 * * Those functions call a channel request which notifies my Modals with the
 *   EVENTS.SEARCH.PROTOCOLS_COLLECTION_RESET or EVENTS.SEARCH.CLASSIFICATIONS_COLLECTION_RESET
 *   events
 * * Those events are handled to display the data
 */
const ModalsService = Marionette.Object.extend({
	channelName: 'search',
	
	radioRequests: {
		[EVENTS.SEARCH.PROTOCOLS_SEARCH_INPUTS]: 'handleProtocolSearchGo',
		[EVENTS.SEARCH.CLASSIFICATIONS_SEARCH_INPUTS]: 'handleClassificationSearchGo',
	},
	
	initialize() {
		this.protocolCollection = new ProtocolCollection();
		this.listenTo(this.protocolCollection, 'reset', this.dispatchProtocolResults);
		
		this.classificationCollection = new ClassificationCollection();
		this.listenTo(this.classificationCollection, 'reset', this.dispatchClassificationResults);
	},
	
	dispatchProtocolResults() {
		searchChannel.request(EVENTS.SEARCH.PROTOCOLS_COLLECTION_RESET, this.protocolCollection);
	},
	
	dispatchClassificationResults() {
		searchChannel.request(EVENTS.SEARCH.CLASSIFICATION_COLLECTION_RESET, this.classificationCollection);
	},
	
	handleProtocolSearchGo(data) {
		const url = ENDPOINT_URLS.PROTOCOLS + "/" + data.protocolKeyword;
		this.protocolCollection.fetch({
			url: url,
			reset: true, 
			/*Fix addition of square brackets added to query by jQuery
			See http://stackoverflow.com/questions/18492127/backbone-js-fetch-method-with-data-option-is-passing-url-params-with-square-brac
			 */
			traditional: true
		});
	},
	
	handleClassificationSearchGo(data) {
		const url = ENDPOINT_URLS.CLASSIFICATIONS + "/" + data.classificationKeyword;
		this.classificationCollection.fetch({
			url: url,
			reset: true, 
			/*Fix addition of square brackets added to query by jQuery
			See http://stackoverflow.com/questions/18492127/backbone-js-fetch-method-with-data-option-is-passing-url-params-with-square-brac
			 */
			traditional: true
		});
	},
	
	transformToProtocolTable(collection) {
		return collection.toJSON().map(function(model) {
			return {
				longName:		model.longName,
				id:				model.publicId,
				shortName:		model.preferredName,
				context:		model.context,
				definition:		model.preferredDefinition
			};
		});
	},
	
	transformToClassificationsTable(collection) {
		// TODO: this mapping is wrong for classifications: need an example of mapped data
		return collection.toJSON().map(function(model) {
			return {
				longName:		model.longName,
				id:				model.publicId,
				shortName:		model.preferredName,
				context:		model.context,
				definition:		model.definition
			};
		});
	}
	
	
});

const modalsService = new ModalsService();
export default modalsService; 