import {Model} from 'backbone';
import CoreFormDetails from './CoreFormDetailsModel';

const FormModel = Model.extend({
	defaults: {
		coreFormDetails: new CoreFormDetails()
	}
});

export default FormModel;