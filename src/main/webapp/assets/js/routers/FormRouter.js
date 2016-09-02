import {Router} from 'backbone';
import EVENTS from '../constants/EVENTS';
import ROUTES from '../constants/ROUTES';
import {formChannel} from '../channels/radioChannels';

const FormRouter = Router.extend({
	routes: {
		[ROUTES.FORM.VIEW_FORM]: 'setViewFormLayout',
		[ROUTES.FORM.CREATE_FORM]: 'setCreateFormLayout',
		[ROUTES.FORM.CREATE_MODULE]: 'setCreateModule'

	},
	setViewFormLayout (idSeq) {
		formChannel.request(EVENTS.FORM.SET_FORM_LAYOUT, {idSeq});
	},
	setCreateFormLayout () {
		formChannel.request(EVENTS.FORM.SET_FORM_LAYOUT, {action:'createForm'});
	},
	setCreateModule(idSeq) {
		formChannel.request(EVENTS.FORM.SET_FORM_LAYOUT, {idSeq, action:'createModule'});
	}
});
const formRouter = new FormRouter;
export default formRouter;