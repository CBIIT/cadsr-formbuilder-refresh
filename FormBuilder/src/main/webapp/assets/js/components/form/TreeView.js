import React, {Component, PropTypes} from 'react';
import {Button} from 'react-bootstrap';
import EVENTS from '../../constants/EVENTS';
import {formChannel} from '../../channels/radioChannels';
import formActions from '../../constants/formActions';
import ButtonList from '../common/ButtonList';

export default class TreeView extends Component {
	constructor(props){
		super(props);
		/* Consider moving dispatching/Backbone radio functionality to FormLayout and notifying FormLayout via callbacks passed through props */
		this.dispatchCreateModule = this.dispatchCreateModule.bind(this);
		this.dispatchNavigateFormMetadata = this.dispatchNavigateFormMetadata.bind(this);
		this.dispatchNavigateToModule = this.dispatchNavigateToModule.bind(this);
	}

	dispatchCreateModule(){
		formChannel.request(EVENTS.FORM.CREATE_MODULE, {action: formActions.CREATE_MODULE});
	}

	dispatchNavigateToModule(id){
		formChannel.request(EVENTS.FORM.VIEW_MODULE, id);
	}

	dispatchNavigateFormMetadata(){
		formChannel.request(EVENTS.FORM.SET_FORM_LAYOUT, {action: formActions.VIEW_FORM_METADATA});
	}
	render(){


		return (
			<div className="bordered-container tall-min-height panel">
				<ul className="list-unstyled">
					<li className="panel-header center-v-spread-h">
						<span className="panel-header-heading">ALL MODULES</span>
						<button disabled={!this.props.canCreateModule} onClick={this.dispatchCreateModule} className="btn btn-link panel-link--success">Create New Module</button>
					</li>
					<li>

						<button onClick={this.dispatchNavigateFormMetadata} className={"panel-link panel-item btn btn-link " + (this.props.formMetadataLinkIsActive ? "panel-link--accent" : "")}>Form Details</button>
						<hr className="panel-divider"/>
						<p className="panel-subtitle" />
					</li>
					<li>
						<ButtonList activeItem={this.props.activeModuleId} buttonItemClassName={"panel-link panel-item btn btn-link no-margin"} activeButtonClass={" panel-link panel-item btn btn-link no-margin panel-link--accent"} onClickCallback={this.dispatchNavigateToModule} itemKey={"cid"} className="panel-item panel-list" itemTextKey={"longName"} data={this.props.list}/>
					</li>
				</ul>

			</div>
		);
	}
}

TreeView.propTypes = {
	formMetadataLinkIsActive:    PropTypes.bool,
	activeModuleId:              PropTypes.string,
	shouldShowFormMeatadataLink: PropTypes.bool,
	canCreateModule:             PropTypes.bool,
	children:                    PropTypes.element
};
