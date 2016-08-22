import Marionette from "backbone.marionette";
import {formChannel, appChannel} from '../channels/radioChannels';
import ENDPOINT_URLS from '../constants/ENDPOINT_URLS';
import EVENTS from '../constants/EVENTS';

const GetCoreFormDetailsCriteriaCommand = Marionette.Object.extend({
	initialize(options) {
		this.model = options.model;
		this.userName = options.userName;
	},
	execute() {
		this.model.get("contexts").fetch({
			url: `${ENDPOINT_URLS.CONTEXTS}/${this.userName}`
		}).then(() =>{
			this.model.get("formCategories").fetch({
				url: ENDPOINT_URLS.TYPES
			}).then(() =>{
				this.model.get("formTypes").fetch({
					url: ENDPOINT_URLS.WORKFLOWS
				}).then(() =>{
					formChannel.trigger(EVENTS.FORM.GET_FORM_CORE_DETAILS_CRITERIA);
				}).fail((error) =>{
					console.log(error);
					appChannel.trigger('request:fail');
				})
			})
		});

		/*
	const fetchCollectionData = (collection, url)=>{
		 return new Promise(
		 function(){
		 collection.fetch({
		 url: url
		 });
		 }
		 )
		 };

		 const collectionsToFetch = [
		 [this.model.get("contexts"), ENDPOINT_URLS.CONTEXTS],
		 [this.model.get("formCategories"), ENDPOINT_URLS.CATEGORIES],
		 [this.model.get("formTypes"), ENDPOINT_URLS.TYPES],
		 ];

		 Promise.all(collectionsToFetch.map(collection =>
		 fetchCollectionData(collection[0], collection[1])
		 )).then(reponse =>{
		 console.log("request success");
		 formChannel.trigger('model:getDropDownOptionsSuccess');
		 }).catch(function(error){
		 console.log(error);
		 appChannel.trigger('request:fail');
		 });
		 */
	}

});

export default GetCoreFormDetailsCriteriaCommand;
