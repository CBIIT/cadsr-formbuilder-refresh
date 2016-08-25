import Marionette from "backbone.marionette";
import {Model, Collection} from "backbone";
import EVENTS from '../../constants/EVENTS';
import ROUTES from '../../constants/ROUTES';
import {appChannel, formChannel, userChannel} from '../../channels/radioChannels';
import FormModel from '../../models/forms/FormModel';
import FormRouter from  "../../routers/FormRouter";
import DropDownOptionsCollection from '../../models/forms/DropDownOptionsCollection';
import GetCoreFormDetailsCriteriaCommand from '../../commands/GetCoreFormDetailsCriteriaCommand';
import FormLayoutView from '../../views/forms/FormLayoutView';

/**
 * This is a service that maintains the state of a form
 */
/*TODO move common methods out into a mixin/HOF or baseController/baseService */

const FormService = Marionette.Object.extend({
	channelName: 'form',
	radioRequests: {
		[EVENTS.FORM.SET_FORM_LAYOUT]: 'dispatchLayout',
		[EVENTS.FORM.CREATE_FORM]: 'navigateToFormLayout'
	},
	initialize(options = {}) {
		this.router  = new FormRouter();
		this.setupModels();

		formChannel.on(EVENTS.FORM.SET_CORE_FORM_DETAILS, (data) =>{
			this.handleCoreFormDetailsSubmitData(data);
		});
	},
	dispatchLayout(idSeq = '') {
		formChannel.on(EVENTS.FORM.GET_FORM_CORE_DETAILS_CRITERIA, () =>{
			appChannel.request(EVENTS.APP.SET_MAIN_CONTENT_LAYOUT, this.constructLayout());
		});

		new GetCoreFormDetailsCriteriaCommand({
			model:    this.uiDropDownOptionsModel,
			userName: userChannel.request(EVENTS.USER.GET_USERNAME)
		}).execute();
	},
	constructLayout(){
		return new FormLayoutView(
			{
				formModel:              this.formModel,
				uiDropDownOptionsModel: this.uiDropDownOptionsModel
			}
		);
	},
	handleCoreFormDetailsSubmitData(data) {
		/*TODO handle context a better way. */
		let context = data.conteIdseq;
		delete data.conteIdseq;

		this.formModel.get('coreFormDetails').set(data);
		this.formModel.get('coreFormDetails').set({
			context:   {conteIdseq: context},
			createdBy: userChannel.request(EVENTS.USER.GET_USERNAME)
		});

		this.formModel.get('coreFormDetails').save(null, {
			success: function (model) {
				let formIdseq = model.get("formIdseq");
				alert("Form created. formIdseq is: " + formIdseq);
			},
			error: function (model, response) {
				/*TODO: of course this is too basic. Improve error handling */
				alert("error");
			}
		});
	},
	navigateToFormLayout () {
		this.router.navigate(ROUTES.FORM.CREATE_FORM, {trigger: true});
	},
	setupModels() {
		/* Should only contain data to populate the form UI's immutable data */
		const UIDropDownOptionsModel = Model.extend({
			defaults: {
				contexts:       new DropDownOptionsCollection(),
				formCategories: new DropDownOptionsCollection(),
				formTypes:      new DropDownOptionsCollection()
			}
		});
		this.uiDropDownOptionsModel = new UIDropDownOptionsModel();
		this.formModel = new FormModel();
	}
});

export default FormService;