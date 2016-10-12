/**
 * Created by nmilos on 10/11/16.
 */
import {Model} from 'backbone';

const FormModel = Model.extend({
	/* TODO uncomment when each cde returned from server has a unique cdeid. Reomving this for now allows more that one cde with the same cdeId to be added to the cdeCollection */
	//idAttribute: "cdeid",
	defaults:    {
	}
});

export default FormModel;