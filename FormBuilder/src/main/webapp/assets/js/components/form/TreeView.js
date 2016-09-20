import React, {Component, PropTypes} from 'react';
import {Col, Row, Button, FormGroup, ControlLabel, FormControl} from 'react-bootstrap';
import EVENTS from '../../constants/EVENTS';
import {formChannel} from '../../channels/radioChannels';
import List from '../common/List';

export default class TreeView extends Component {
	constructor(props){
		super(props);
		/* Consider moving dispatching/Backbone radio functionality to FormLayout and notifying FormLayout via callbacks passed through props */
		this.dispatchCreateModule = this.dispatchCreateModule.bind(this);
		this.dispatchNavigateFullFormView = this.dispatchNavigateFullFormView.bind(this);
		this.dispatchNavigateToModule = this.dispatchNavigateToModule.bind(this);
		this.showNewModuleButton = this.showNewModuleButton.bind(this);
	}

	dispatchCreateModule(){
		formChannel.request(EVENTS.FORM.CREATE_MODULE, {action: 'createModule'});
	}

	dispatchNavigateToModule(id){
		formChannel.request(EVENTS.FORM.VIEW_MODULE, id);
	}

	dispatchNavigateFullFormView(){
		formChannel.request(EVENTS.FORM.SET_FORM_LAYOUT, {action: 'viewFormFullView'});
	}

	showNewModuleButton(){
		if(this.props.canCreateModule){
			return (
				<Button onClick={this.dispatchCreateModule} className="btn btn-primary" type="submit">New Module</Button>
			);
		}
	}

	render(){
		return (
			<div className="bordered-container tall-min-height">
				<Button onClick={this.dispatchNavigateFullFormView} className="button-link">View Full Form</Button>
				<p>Modules</p>				{this.showNewModuleButton()}
				<List onClickCallback={this.dispatchNavigateToModule} itemKey={"id"} itemTextKey={"longName"} data={this.props.list}/>
			</div>
		);
	}
}

TreeView.propTypes = {
	canCreateModule: PropTypes.bool,
	children:        PropTypes.element
};
