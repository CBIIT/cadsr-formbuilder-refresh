import {Router} from 'backbone';
import EVENTS from '../constants/EVENTS';
import ROUTES from '../constants/ROUTES';
import {formChannel} from '../channels/radioChannels';

const FormRouter = Router.extend({
	routes: {
		[ROUTES.FORM.VIEW_FORM]: 'formLayout',
		[ROUTES.FORM.CREATE_FORM]: 'formLayout'
	},
	formLayout (idSeq) {
		formChannel.request(EVENTS.FORM.SET_FORM_LAYOUT, idSeq ='');
	}
});

export default FormRouter;