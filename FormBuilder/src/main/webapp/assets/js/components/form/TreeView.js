import React, {Component, PropTypes} from 'react';
import {Button} from 'react-bootstrap';
import EVENTS from '../../constants/EVENTS';
import {formChannel} from '../../channels/radioChannels';
import List from '../common/List';

export default class TreeView extends Component {
	constructor(props){
		super(props);
		/* Consider moving dispatching/Backbone radio functionality to FormLayout and notifying FormLayout via callbacks passed through props */
		this.dispatchCreateModule = this.dispatchCreateModule.bind(this);
		this.dispatchNavigateFormMetadata = this.dispatchNavigateFormMetadata.bind(this);
		this.dispatchNavigateToModule = this.dispatchNavigateToModule.bind(this);
		/*
		this.showNavFormMetadataButton = this.showNavFormMetadataButton.bind(this);
		 */
	}

	dispatchCreateModule(){
		formChannel.request(EVENTS.FORM.CREATE_MODULE, {action: 'createModule'});
	}

	dispatchNavigateToModule(id){
		formChannel.request(EVENTS.FORM.VIEW_MODULE, id);
	}

	dispatchNavigateFormMetadata(){
		formChannel.request(EVENTS.FORM.SET_FORM_LAYOUT, {action: 'editFormMetadata'});
	}

	/*
	showNavFormMetadataButton(){
		if(this.props.shouldShowFormMeatadataLink){
			return (
				<li>
					<Button onClick={this.dispatchNavigateFormMetadata} className="button-link">Form Details</Button>
				</li>
			);
		}
	 }*/
	render(){
		return (
			<div className="bordered-container tall-min-height panel">
				<ul className="list-unstyled">
					<li className="panel-header">
						<span className="panel-header-link">Form Map</span>
					</li>
					<li>
						<span className="panel-link panel-item">View Full Form</span>
						<span onClick={this.dispatchNavigateFormMetadata} className="panel-link panel-item">Form Details</span>
						<hr className="panel-divider"/>
						<p className="panel-subtitle">Modules</p>
					</li>
					<li>
						<List onClickCallback={this.dispatchNavigateToModule} itemKey={"id"} className="panel-item panel-list" itemTextKey={"longName"} data={this.props.list}/>
					</li>
					<li className="short-bottom-spacing">
						<button disabled={!this.props.canCreateModule} onClick={this.dispatchCreateModule} className="btn btn-link panel-link--success">Create New Module</button>
					</li>

				</ul>

			</div>
		);
	}
}

TreeView.propTypes = {
	shouldShowFormMeatadataLink: PropTypes.bool,
	canCreateModule:             PropTypes.bool,
	children:                    PropTypes.element
};
