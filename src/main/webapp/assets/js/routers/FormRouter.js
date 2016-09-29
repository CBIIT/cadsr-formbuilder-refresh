import {Router} from 'backbone';
import EVENTS from '../constants/EVENTS';
import ROUTES from '../constants/ROUTES';
import {formChannel} from '../channels/radioChannels';

const FormRouter = Router.extend({
	routes: {
		[ROUTES.FORM.VIEW_FORM]:   'setViewFormLayout',
		[ROUTES.FORM.CREATE_FORM]: 'setCreateFormLayout'
	},
	setViewFormLayout (formIdseq) {
		formChannel.request(EVENTS.FORM.SET_FORM_LAYOUT, {action: "viewFormFullView", formIdseq});
	},
	setCreateFormLayout () {
		formChannel.request(EVENTS.FORM.SET_FORM_LAYOUT, {action:'createForm'});
	}
});
const formRouter = new FormRouter;
export default formRouter;