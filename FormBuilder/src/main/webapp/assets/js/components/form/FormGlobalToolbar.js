import React, {Component, PropTypes} from 'react';
import {Col, Row} from 'react-bootstrap';
import ButtonsGroup from '../common/ButtonsGroup';
import ExitFormModal from '../modals/ExitFormModal';

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
		if(this.props.shouldShowFormEditControls){
			return [
				{
					name:    "Cancel",
					onClick: "handleCancelButtonClicked"
				},
				{
					name:      "View Full Form",
					onClick:   "dispatchNavigateFullFormView",
					className: (this.props.actionMode === "viewFormFullView") ? 'hidden' : ""
				},
			];
		}
		else{

			return [
				{
					name:    "Edit Form",
					onClick: "dispatchEditFormClicked"
				},
				{
					name:      "View Full Form",
					onClick:   "dispatchNavigateFullFormView",
					className: (this.props.actionMode === "viewFormFullView") ? 'hidden' : ""
				},
			];
		}
	}

	dispatchCancelEditForm(){
		formChannel.request(EVENTS.FORM.CANCEL_EDIT_FORM);
	}

	dispatchEditFormClicked(){
		formChannel.request(EVENTS.FORM.EDIT_FORM);
	}

	dispatchNavigateFullFormView(){
		formChannel.request(EVENTS.FORM.SET_FORM_LAYOUT, {action: 'viewFormFullView'});
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

	render(){
		return (
			<Row> <Col lg={9}></Col> <Col lg={3}>
				<ExitFormModal leaveFormCLicked={this.handleLeaveForm} goBackButtonClicked={this.closeExitFormModal} isOpen={this.state.exitFormModalOpen}/>
				<ButtonsGroup handleCancelButtonClicked={this.handleCancelButtonClicked} dispatchEditFormClicked={this.dispatchEditFormClicked} dispatchNavigateFullFormView={this.dispatchNavigateFullFormView} buttons={this.getToolbarItems()}/></Col>
			</Row>
		);
	}
}
