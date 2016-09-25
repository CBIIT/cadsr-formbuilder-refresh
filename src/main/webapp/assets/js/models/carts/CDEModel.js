import {Model} from 'backbone';

const CDEModel = Model.extend({
	/* TODO uncomment when each cde returned from server has a unique cdeid. Reomving this for now allows more that one cde with the same cdeId to be added to the cdeCollection */
	//idAttribute: "cdeid",
	defaults:    {
		longname:            "",
		/*TODO DO we need this on the front end?*/
		longcdename:         "",
		publicid:            "",
		contextname:         "",
		/*TODO DO we need this on the front end?*/
		deIdseq:             "",
		/*TODO DO we need this on the front end? Will contexztname suffice? */
		conteIdseq:          "",
		version:             "",
		registrationstatus:  "",
		/*TODO DO we need this on the front end?*/
		preferredname:       "",
		preferreddefinition: "",
		workflow:            "",
		dateadded:           ""
	}
});

export default CDEModel;