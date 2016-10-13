import {Model} from 'backbone';
import QuestionsCollection from './QuestionsCollection';

const FormModuleModel = Model.extend({
	idAttribute: "moduleIdseq",
	defaults:    {
		longName:     "",
		instructions: "",
		questions:    new QuestionsCollection(),
		/* isEdited used for letting the backend know whether this has changed */
		isEdited:     false
	},
	initialize() {
		const questionsCollection = this.get("questions");
		/*Bubble up changes (BUT NOT Adding or Removing) to questions and validValues collection here, so BackboneReact in FormLayout triggers a state change (and a re-render) when a change to the modules collection occurs
		 * See http://backbonejs.org/#Events-catalog */
		this.listenTo(questionsCollection, 'change', this.triggerThisUpdate);
		this.listenTo(questionsCollection.get("validValues"), 'change', this.triggerThisUpdate);

	},
	triggerThisUpdate (model, options) {
		this.trigger("update");
	},
	constructor(attributes, options) {
		/* Pass any questions into new QuestionsCollection so each nested object becomes a QuestionsModel */
		if(attributes.questions) {
			attributes.questions = new QuestionsCollection(attributes.questions);
		}
		Model.apply(this, arguments);
	}
});

export default FormModuleModel;