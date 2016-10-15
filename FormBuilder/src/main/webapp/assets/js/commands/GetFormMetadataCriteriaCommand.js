import Marionette from "backbone.marionette";
import {formChannel, appChannel} from '../channels/radioChannels';
import ENDPOINT_URLS from '../constants/ENDPOINT_URLS';
import EVENTS from '../constants/EVENTS';

const GetFormMetadataCriteriaCommand = Marionette.Object.extend({
	initialize({model, userName}) {
		this.model = model;
		this.userName = userName;
	},
	execute() {
		const fetchCollectionData = (collection, url)=>{
			return new Promise(
				(resolve, reject) =>{
					collection.fetch({
						url: url
					}).then(() =>{
						resolve();
					}).catch((error) =>{
						reject(error);
					});
				}
			);
		};

		const collectionsToFetch = [
			[this.model.get("contexts"), ENDPOINT_URLS.CONTEXTS],
			[this.model.get("formCategories"), ENDPOINT_URLS.CATEGORIES],
			[this.model.get("formTypes"), ENDPOINT_URLS.TYPES],
			[this.model.get("workflows"), ENDPOINT_URLS.WORKFLOWS]
		];

		Promise.all(collectionsToFetch.map((collection) =>{
				if(!collection[0].length){
					fetchCollectionData(collection[0], collection[1]);
				}
			}
		)).then(() =>{
			formChannel.trigger(EVENTS.FORM.GET_FORM_CORE_DETAILS_CRITERIA);
		}).catch(function(error){
			console.log(error);
			appChannel.trigger('request:fail', error);
		});
	}

});

export default GetFormMetadataCriteriaCommand;
