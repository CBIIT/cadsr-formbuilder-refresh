import React, {Component, PropTypes} from 'react';
import {Col, Row} from 'react-bootstrap';
import ButtonsGroup from '../common/ButtonsGroup';

import EVENTS from '../../constants/EVENTS';
import {formChannel} from '../../channels/radioChannels';

export default class FormGlobalToolbar extends Component {
	constructor(props){
		super(props);
		this.getToolbarItems = this.getToolbarItems.bind(this);
		this.dispatchCancelButtonClicked = this.dispatchCancelButtonClicked.bind(this);
		this.dispatchEditFormClicked = this.dispatchEditFormClicked.bind(this);
	}

	getToolbarItems(){
		if(this.props.shouldShowFormEditControls){
			return [
				{
					name:    "Cancel",
					onClick: "dispatchCancelButtonClicked"
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
					className: (this.props.actionMode === "viewFormFullView") ? 'hidden' : ""
				},
			];
		}
	}

	dispatchCancelButtonClicked(){
		formChannel.request(EVENTS.FORM.CANCEL_EDIT_FORM);
	}

	dispatchEditFormClicked(){
		formChannel.request(EVENTS.FORM.EDIT_FORM);
	}

	dispatchNavigateFullFormView(){
		formChannel.request(EVENTS.FORM.SET_FORM_LAYOUT, {action: 'viewFormFullView'});
	}

	render(){
		return (
			<Row> <Col lg={9}></Col>
				<Col lg={3}><ButtonsGroup dispatchCancelButtonClicked={this.dispatchCancelButtonClicked} dispatchEditFormClicked={this.dispatchEditFormClicked} dispatchNavigateFullFormView={this.dispatchNavigateFullFormView} buttons={this.getToolbarItems()}/></Col>
			</Row>
		);
	}
}
