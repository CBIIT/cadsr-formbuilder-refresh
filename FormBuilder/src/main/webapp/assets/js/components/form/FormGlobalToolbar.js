import React, {Component, PropTypes} from 'react';
import {Col, Row} from 'react-bootstrap';
import ExitFormModal from '../modals/ExitFormModal';
import ButtonsGroup from '../common/ButtonsGroup';
import formActions from '../../constants/formActions';
import EVENTS from '../../constants/EVENTS';
import {formChannel} from '../../channels/radioChannels';

export default class FormGlobalToolbar extends Component {
	constructor(props){
		super(props);
		this.closeExitFormModal = this.closeExitFormModal.bind(this);
		this.getToolbarItems = this.getToolbarItems.bind(this);
		this.dispatchCancelEditForm = this.dispatchCancelEditForm.bind(this);
		this.dispatchEditFormClicked = this.dispatchEditFormClicked.bind(this);
		this.handleCancelButtonClicked = this.handleCancelButtonClicked.bind(this);
		this.handleLeaveForm = this.handleLeaveForm.bind(this);
		this.moreActionsGo = this.moreActionsGo.bind(this);
		this.renderEditingIndicator = this.renderEditingIndicator.bind(this);
		this.renderMoreFormActions = this.renderMoreFormActions.bind(this);
		this.state = {
			exitFormModalOpen: false
		};
	}

	closeExitFormModal(){
		this.setState({
			exitFormModalOpen: false
		});
	}

	getToolbarItems(){
		const buttons = [];
		const shouldShowFullFormViewButton = this.props.actionMode !== formActions.VIEW_FULL_FORM;

		/*They have permission and the form isn't already in edit mode */
		const shouldShowEditFormButton = this.props.formMetadata.curatorialPermission && !this.props.shouldShowFormEditControls;
		const userIsEditingForm = this.props.shouldShowFormEditControls;

		if(shouldShowEditFormButton){
			buttons.push({
				name:      "EDIT FORM",
				onClick:   "dispatchEditFormClicked",
				className: "btn-link pull-right"
			});
		}
		else if(userIsEditingForm){
			buttons.push({
				name:      "Cancel",
				onClick:   "handleCancelButtonClicked",
				className: "btn-link pull-right"
			});
			buttons.push({
				name:      "Save",
				className: "btn-link pull-right"
			});
		}
		if(shouldShowFullFormViewButton) {
			buttons.push({
				name:      "View Full Form",
				className: "btn-link pull-right"
			});
		}

		return (
			<Col md={4} className="formCenterV">
				<div>
					<ButtonsGroup containerClassName="buttonsGroup pull-right" handleCancelButtonClicked={this.handleCancelButtonClicked} dispatchEditFormClicked={this.dispatchEditFormClicked} dispatchNavigateFullFormView={this.dispatchNavigateFullFormView} buttons={buttons}/>

				</div>
			</Col>
		);
	}

	renderEditingIndicator(){
		if(this.props.shouldShowFormEditControls){
			return (
				<div className="editingIndicator">
					<span className="glyphicon glyphicon-edit"/>
					<span className="editingIndicatorText">YOU ARE EDITING THIS FORM</span>
				</div>
			);
		}
		else{
			return (<div />);
		}
	}

	renderMoreFormActions() {
		if(!this.props.shouldShowFormEditControls){
			return (
				<Col md={4}>
					<Row>
						<Col md={9}>
							<select id="moreActions" name="moreActions" className="form-control">
								<option value="">MORE FORM ACTIONS</option>
								<option value="carts/forms">  ADD FORM TO CART</option>
								<option value="forms/xls">  DOWNLOAD XLS</option>
								<option value="forms/xml">  DOWNLOAD XML</option>
								<option value="forms/copy">  COPY FORM</option>
								<option value="carts/forms">  DELETE FORM</option>
							</select>
						</Col>
						<Col md={3} className="formCenterV">
							<button type="button" className="btn-link">GO</button>
						</Col>
					</Row>
				</Col>
			);
		}
	}

	dispatchCancelEditForm(){
		formChannel.request(EVENTS.FORM.CANCEL_EDIT_FORM, {action: formActions.VIEW_FULL_FORM});
	}

	dispatchEditFormClicked(){
		formChannel.request(EVENTS.FORM.EDIT_FORM);
	}

	dispatchNavigateFullFormView(){
		formChannel.request(EVENTS.FORM.SET_FORM_LAYOUT, {action: formActions.VIEW_FULL_FORM});
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

	moreActionsGo() {

	}

	render(){
		return (
			<div className="panel-header container-fluid">
				<Row>
					<Col md={2} className="formCenterV">
						Public ID: {this.props.formMetadata.publicId}
					</Col>
					<Col md={2} className="formCenterV">
						V: {this.props.formMetadata.version}
					</Col>
					{this.getToolbarItems()}
					{this.renderMoreFormActions()}
				</Row>
				{this.renderEditingIndicator()}
				<ExitFormModal leaveFormCLicked={this.handleLeaveForm} goBackButtonClicked={this.closeExitFormModal} isOpen={this.state.exitFormModalOpen}/>
			</div>
		);
	}
}
FormGlobalToolbar.PropTypes = {
	formMetadata:   PropTypes.object.required,
	userIsLoggedIn: PropTypes.bool.required
};

