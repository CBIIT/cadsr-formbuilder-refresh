import React, {Component, PropTypes} from 'react';
import {Col, Row} from 'react-bootstrap';
import ExitFormModal from '../modals/ExitFormModal';
import ButtonsGroup from '../common/ButtonsGroup';
import formActions from '../../constants/formActions';
import EVENTS from '../../constants/EVENTS';
import {formChannel, cartChannel, appChannel} from '../../channels/radioChannels';

export default class FormGlobalToolbar extends Component {
	constructor(props){
		super(props);
		this.closeExitFormModal = this.closeExitFormModal.bind(this);
		this.getToolbarItems = this.getToolbarItems.bind(this);
		this.dispatchCancelEditForm = this.dispatchCancelEditForm.bind(this);
		this.dispatchEditFormClicked = this.dispatchEditFormClicked.bind(this);
		this.handleCancelButtonClicked = this.handleCancelButtonClicked.bind(this);
		this.handleSaveButtonClicked = this.handleSaveButtonClicked.bind(this);
		this.handleLeaveForm = this.handleLeaveForm.bind(this);
		this.moreActionsGo = this.moreActionsGo.bind(this);
		this.renderEditingIndicator = this.renderEditingIndicator.bind(this);
		this.renderFormLockedIndicator = this.renderFormLockedIndicator.bind(this);
		this.renderMoreFormActions = this.renderMoreFormActions.bind(this);
		this.moreActionsGo = this.moreActionsGo.bind(this);
		this.handleMoreActionsChanged = this.handleMoreActionsChanged.bind(this);
		this.state = {
			exitFormModalOpen: false,
			moreActionsSelected: ""
		};
	}

	componentDidMount() {

	}

	closeExitFormModal(){
		this.setState({
			exitFormModalOpen: false
		});
	}

	handleMoreActionsChanged(event) {
		let temp = event.target.value;
		this.setState({
			moreActionsSelected: temp
		});
	}

	dispatchCancelEditForm(){
		formChannel.request(EVENTS.FORM.CANCEL_EDIT_FORM, {action: formActions.VIEW_FULL_FORM});
	}

	dispatchEditFormClicked(){
		formChannel.request(EVENTS.FORM.EDIT_FORM);
	}

	handleCancelButtonClicked(){
		this.setState({
			exitFormModalOpen: true
		});
	}

	handleLeaveForm(){
		this.closeExitFormModal();
		this.dispatchCancelEditForm();
	}
	handleSaveButtonClicked() {
		formChannel.request(EVENTS.FORM.SAVE_FORM);
	}

	moreActionsGo() {
		let value = this.state.moreActionsSelected;
		let formIdseq = Application.formService.formModel.get("formIdseq");
		if (value === "addFormToCart") {
			cartChannel.request(EVENTS.CARTS.ADD_FORM, this.props.formMetadata);
		}
		else if (value === "downloadXls") {
			formChannel.request(EVENTS.FORM.GET_DOWNLOAD_XLS, formIdseq);
		}
		else if (value === "downloadXml") {
			formChannel.request(EVENTS.FORM.GET_DOWNLOAD_XML, formIdseq);
		}
		else if (value === "copyForm") {
			formChannel.request(EVENTS.FORM.CREATE_COPY, formIdseq);
		}
		else if (value === "deleteForm") {
			appChannel.request(EVENTS.APP.SHOW_USER_MODAL_MESSAGE, {
				heading: "",
				message: "ARE YOU SURE YOU WANT TO DELETE THIS FORM?",
				button:  {
					label:    "DELETE",
					callback: () =>{
						formChannel.request(EVENTS.FORM.DELETE, formIdseq);
					}
				}
			});
			
			
			
			
			
		}
		// else do nothing
	}
	
	getToolbarItems(){
		const buttons = [];
		/*They have curatorialPermission, it's not locked by another user and the form isn't already in edit mode */
		const shouldShowEditFormButton = (this.props.formMetadata.curatorialPermission === true && this.props.formMetadata.locked === false && this.props.userIsLoggedIn === true) && !this.props.shouldShowFormEditControls;
		const userIsEditingForm = this.props.shouldShowFormEditControls;

		if(shouldShowEditFormButton){
			buttons.push({
				name:      "EDIT FORM",
				onClick:   "dispatchEditFormClicked",
				className: "btn-link"
			});
		}
		else if(userIsEditingForm){
			buttons.push({
				name:      "CANCEL",
				onClick:   "handleCancelButtonClicked",
				className: "btn-link"
			});
			buttons.push({
				name:      "SAVE",
				onClick:   "handleSaveButtonClicked",
				className: "btn-link"
			});
		}

		return (
			<ButtonsGroup containerClassName="buttonsGroup" handleCancelButtonClicked={this.handleCancelButtonClicked} handleSaveButtonClicked={this.handleSaveButtonClicked} dispatchEditFormClicked={this.dispatchEditFormClicked}  buttons={buttons}/>
		);
	}
	
	renderEditingIndicator() {
		if(this.props.shouldShowFormEditControls){
			return (
				<div className="editingIndicator">
					<span className="glyphicon glyphicon-edit" />
					<span className="editingIndicatorText">YOU ARE EDITING THIS FORM</span>
				</div>
			);
		}
		else {
			return (<div />);
		}
	}
	renderFormLockedIndicator(){
		if(this.props.formMetadata.locked === true && this.props.formMetadata.curatorialPermission === true){
			return (
				<div className="editingIndicator">
					<span className="glyphicon glyphicon-lock"/>
					<span className="editingIndicatorText">Another user is editing this form. Please contact the editor or try again later.</span>
				</div>
			);
		}
		else{
			return (<div />);
		}
	}
	renderMoreFormActions() {
		if(!this.props.formMetadata.locked === true && !this.props.shouldShowFormEditControls){
			
			let options = "";
			if (this.props.formMetadata.curatorialPermission) {
				return (
						<div className="formCenterV">
							<select id="moreActions" name="moreActions" className="form-control"  value={this.state.moreActionsSelected} onChange={this.handleMoreActionsChanged}>
								<option value="">MORE FORM ACTIONS</option>
								<option value="addFormToCart">  ADD FORM TO CART</option>
								<option value="downloadXls">  DOWNLOAD XLS</option>
								<option value="downloadXml">  DOWNLOAD XML</option>
								<option value="copyForm">  COPY FORM</option>
								<option value="deleteForm">  DELETE FORM</option>
							</select>
							<button type="button" className="btn-link" onClick={this.moreActionsGo}>GO</button>
						</div>
					);
			}
			else {
				return (
						<div className="formCenterV">
							<select id="moreActions" name="moreActions" className="form-control"  value={this.state.moreActionsSelected} onChange={this.handleMoreActionsChanged}>
								<option value="">MORE FORM ACTIONS</option>
								<option value="downloadXls">  DOWNLOAD XLS</option>
								<option value="downloadXml">  DOWNLOAD XML</option>
							</select>
							<button type="button" className="btn-link" onClick={this.moreActionsGo}>GO</button>
						</div>
					);
			}
			
			
			return (
				<div className="formCenterV">
					<select id="moreActions" name="moreActions" className="form-control"  value={this.state.moreActionsSelected} onChange={this.handleMoreActionsChanged}>
						<option value="">MORE FORM ACTIONS</option>
						<option value="addFormToCart">  ADD FORM TO CART</option>
						<option value="downloadXls">  DOWNLOAD XLS</option>
						<option value="downloadXml">  DOWNLOAD XML</option>
						<option value="copyForm">  COPY FORM</option>
						<option value="deleteForm">  DELETE FORM</option>
					</select>
					<button type="button" className="btn-link" onClick={this.moreActionsGo}>GO</button>
				</div>
			);
		}
	}

	render(){
		return (
			<div>
				<div className="panel-header center-v-spread-h formGlobalToolbar">
					<div className="formCenterV">
						Public ID: {this.props.formMetadata.publicId} V: {this.props.formMetadata.version}
					</div>
					<div className="formCenterV ">
						{this.getToolbarItems()}
						{this.renderMoreFormActions()}
					</div>
				</div>
				{this.renderEditingIndicator()}
				{this.renderFormLockedIndicator()}
				<ExitFormModal leaveFormCLicked={this.handleLeaveForm} goBackButtonClicked={this.closeExitFormModal} isOpen={this.state.exitFormModalOpen}/>
			</div>
		);
	}
}
FormGlobalToolbar.PropTypes = {
	locked: PropTypes.bool,
	curatorialPermission: PropTypes.bool,
	formMetadata:   PropTypes.object.required,
	userIsLoggedIn: PropTypes.bool.required
};

