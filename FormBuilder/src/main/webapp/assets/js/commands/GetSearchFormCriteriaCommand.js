import Marionette from "backbone.marionette";
import {searchChannel, appChannel} from '../channels/radioChannels';
import ENDPOINT_URLS from '../constants/ENDPOINT_URLS';

/**
 * Fetch data necessary to populate the search form (e.g. select element options)
 */
const GetSearchFormCriteriaCommand = Marionette.Object.extend({
	initialize(options) {
		this.model = options.model;
	},
	execute() {
		/* TODO instead of chaining requests, figure out how to make calls in parallel and somehow use a promise to know that all requests were successful */
		this.model.get("contexts").fetch({
			url: ENDPOINT_URLS.CONTEXTS
		}).then(() =>{
			this.model.get("categories").fetch({
				url: ENDPOINT_URLS.CATEGORIES
			}).then(() =>{
				this.model.get("types").fetch({
					url: ENDPOINT_URLS.TYPES
				}).then(() =>{
					this.model.get("workflows").fetch({
						url: ENDPOINT_URLS.WORKFLOWS
					}).then(() =>{
						searchChannel.trigger('model:getDropDownOptionsSuccess');
					}).fail((error) =>{
						console.log(error);
						appChannel.trigger('request:fail');
					})
				})
			})
		});

		/*
		 const fetchCollectionData = (collection, url) =>{
		 collection.fetch({
		 url: url
		 });
		 };

		 const collectionsToFetch = [
		 [this.model.get("contexts"), ENDPOINT_URLS.CONTEXTS],
		 [this.model.get("categories"), ENDPOINT_URLS.CATEGORIES],
		 [this.model.get("types"), ENDPOINT_URLS.TYPES],
		 [this.model.get("workflows"), ENDPOINT_URLS.WORKFLOWS]
		 ];
		 */

		/*/!* When all requests are successful, trigger success *!/
		 Promise.all(collectionsToFetch).then(() =>{
		 console.log("request success");
		 searchChannel.trigger('model:getDropDownOptionsSuccess');
		 }).catch(function(error){
		 /!*catch any errors for all requests *!/
		 console.log(error);
		 appChannel.trigger('request:fail');
		 });*/
		/*
		 Promise.all(collectionsToFetch.map(collection =>
		 fetchCollectionData(collection[0],collection[1])
		 )).then(reponse => {
		 console.log("request success");
		 searchChannel.trigger('model:getDropDownOptionsSuccess');
		 })*/

		/*let promises = collectionsToFetch.map(collection => fetchCollectionData(collection[0],collection[1]));
		 Promise.all(promises).then(results => {
		 console.log("request success");
		 searchChannel.trigger('model:getDropDownOptionsSuccess');
		 });*/
	}

});

export default GetSearchFormCriteriaCommand;
