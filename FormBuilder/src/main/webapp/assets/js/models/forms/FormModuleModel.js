import {Model} from 'backbone';
import QuestionsCollection from './QuestionsCollection';

const FormModuleModel = Model.extend({
	idAttribute: "moduleIdseq",
	defaults ()   {
		return {
			longName:     "",
			instructions: "",
			questions:    new QuestionsCollection(),
			/* Used for letting the backend know whether this has changed */
			isEdited:     false
		};
	},
	initialize() {
		/*Bubble up changes to questions collection here, so BackboneReact in FormLayout triggers a state change (and a re-render) when these events to the modules collection fre
		 * See http://backbonejs.org/#Events-catalog */
		this.listenTo(this.get("questions"), 'change add remove', this.triggerThisUpdate);
	},
	triggerThisUpdate (model, options) {
		/*If a question or valid value has been edited, the module containing it should also be marked as isEdited for the BE */
		this.set({isEdited: true});
		this.trigger("update");
	},
	constructor(attributes, options) {
		/* Pass any questions into new QuestionsCollection so each nested object becomes a QuestionsModel */
		if(attributes.questions){
			attributes.questions = new QuestionsCollection(attributes.questions);
		}
		Model.apply(this, arguments);
	}
});

export default FormModuleModel;