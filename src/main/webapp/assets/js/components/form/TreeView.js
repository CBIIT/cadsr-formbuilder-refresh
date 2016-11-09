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
		this.dispatchNavigateFullFormView = this.dispatchNavigateFullFormView.bind(this);
		this.dispatchNavigateToModule = this.dispatchNavigateToModule.bind(this);
		this.renderCreateModuleLink = this.renderCreateModuleLink.bind(this);
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

	dispatchNavigateFullFormView(){
		formChannel.request(EVENTS.FORM.SET_FORM_LAYOUT, {action: 'viewFormFullView'});
	}

	renderCreateModuleLink(){
		if(this.props.canCreateModule){
			return (
				<button onClick={this.dispatchCreateModule} className="btn-link">Create Module</button>
			);
		}
	}
	render(){
		return (
			<div className="bordered-container tall-min-height panel treeView">
				<ul className="list-unstyled moduleListHeader">
					<li className="panel-header center-v-spread-h">
						<span className="panel-header-heading">ALL MODULES</span>
						{this.renderCreateModuleLink()}
					</li>
					<li className="center-v-spread-h">
						<button onClick={this.dispatchNavigateFullFormView} className={"panel-link panel-item btn-link " + (this.props.viewFullFormLinkIsActive ? "panel-link--accent" : "")}>
							VIEW FULL FORM
						</button>
						<button onClick={this.dispatchNavigateFormMetadata} className={"panel-link panel-item btn-link " + (this.props.formMetadataLinkIsActive ? "panel-link--accent" : "")}>
							Form Details
						</button>
					</li>
					<li>
						<hr className="panel-divider"/>
						<p className="panel-subtitle"/>
					</li>
				</ul>
				<ul className="list-unstyled moduleList">
					<li>
						<ButtonList activeItem={this.props.activeModuleId} buttonItemClassName={"panel-link panel-item btn-link no-margin"} activeButtonClass={" panel-link panel-item btn btn-link no-margin"} onClickCallback={this.dispatchNavigateToModule} itemKey={"cid"} className="panel-item panel-list" itemTextKey={"longName"} data={this.props.list}/>
					</li>
				</ul>

			</div>
		);
	}
}

TreeView.propTypes = {
	viewFullFormLinkIsActive:    PropTypes.bool,
	formMetadataLinkIsActive:    PropTypes.bool,
	activeModuleId:              PropTypes.string,
	shouldShowFormMeatadataLink: PropTypes.bool,
	canCreateModule:             PropTypes.bool,
	children:                    PropTypes.element
};
