import React, {Component, PropTypes} from 'react';
import {Col, Row} from 'react-bootstrap';
import FormLayoutMain from './FormLayoutMain';
import backboneReact from 'backbone-react-component';
import TreeView from './TreeView';
import SidePanel from './SidePanel';
import FormModuleForm from './FormModuleForm';
import ButtonsGroup from '../common/ButtonsGroup';
import FormMetadataForm from './FormMetadataForm';
import EVENTS from '../../constants/EVENTS';
import {formChannel} from '../../channels/radioChannels';

export default class FormLayout extends Component {
	constructor(props){
		super(props);
		this.canCreateModule = this.canCreateModule.bind(this);
		this.getFormModel = this.getFormModel.bind(this);
		this.getFormModules = this.getFormModules.bind(this);
		this.getActionMode = this.getActionMode.bind(this);
		this.getEditItems = this.getEditItems.bind(this);
		this.getMainPanelComponents = this.getMainPanelComponents.bind(this);
		this.handleFormSaveClicked = this.handleFormSaveClicked.bind(this);
	}

	componentWillMount(){
		/* watch for changes on these backbone models/collections and re-render */
		backboneReact.on(this, {
			models: {
				formUIState: this.props.formUIState
			}
		});
	}

	componentWillUnmount(){
		backboneReact.off(this);
	}

	/**
	 *
	 * @returns {boolean}
	 */
	canCreateModule(){
		/*TODO come up with a more reliable way to check for this */
		return this.getActionMode() === "editForm" || this.getActionMode() === 'viewFormFullView';
	}

	getActionMode(){
		return this.state.formUIState.actionMode;
	}

	getFormMetaData(){
		return this.props.formModel.formMetadata.attributes;
	}

	getFormModel(){
		return this.props.formModel;
	}

	getEditItems(){
		return this.state.formUIState.editItem;
	}
	getFormModules(){
		return this.getFormModel().formModules.models;
	}
	handleFormSaveClicked () {
		formChannel.request(EVENTS.FORM.SAVE_FORM);
	}
	getMainPanelComponents(){
		const actionMode = this.getActionMode();
		if(actionMode === "viewFormFullView"){
			const buttons = [
					{
						name: "Save",
						type: "submit",
						onClick: "handleFormSaveClicked"
					}
				];
			return (
				<div>
					<FormMetadataForm actionMode={actionMode} formMetadata={this.props.formModel.formMetadata.attributes} uiDropDownOptionsModel={this.props.uiDropDownOptionsModel}> </FormMetadataForm> {this.getFormModules().map((moduleModel, index) =>(
					<FormModuleForm key={index} longName={moduleModel.get("longName")} instructions={moduleModel.get("instructions")}/>))}
					<ButtonsGroup handleFormSaveClicked={this.handleFormSaveClicked} buttons={buttons}/>
				</div>
			);
		}
		else if(actionMode === 'createForm' || actionMode === "editForm"){
			const metaDataFormHeadingTitle = actionMode === 'createForm' ? 'Create New Form' : 'Edit Form',
				submitButtonText = (actionMode === 'createForm') ? 'Create Form' : 'Save Form';
			const buttons = [
				{
					name: submitButtonText,
					type: "submit"
				}
			];
			return (
				<div>
					<FormMetadataForm actionMode={actionMode} formMetadata={this.props.formModel.formMetadata.attributes} uiDropDownOptionsModel={this.props.uiDropDownOptionsModel} mainHeadingTitle={metaDataFormHeadingTitle}>
						<ButtonsGroup buttons={buttons}/> </FormMetadataForm>
				</div>
			);
		}
		else if(actionMode === 'createModule'){
			const buttons = [
				{
					name: "Create Module",
					type: "submit"
				}
			];
			return (
				<FormModuleForm actionMode={actionMode} mainHeadingTitle="Create Module">
					<ButtonsGroup buttons={buttons}/> </FormModuleForm>
			);
		}
		else if(actionMode === 'editModule'){
			const moduleEditing = this.getEditItems();
			const buttons = [
				{
					name: "Save",
					type: "submit"
				}
			];
			/*Passing in moduleId here might not be necessary but currently the most straightforward way I can think of when there will be an array of modules (parent module, repetition) to edit and gather each one's id from the form when saving */
			return (
				<FormModuleForm moduleId={moduleEditing.id} longName={moduleEditing.longName} instructions={moduleEditing.longName} actionMode={actionMode} mainHeadingTitle="Edit Module">
					<ButtonsGroup buttons={buttons}/> </FormModuleForm>
			);
		}
	}

	render(){
		return (
			<Row className="eq-height-wrapper"> <Col lg={2} className="eq-height-item">
				<TreeView list={this.getFormModules()} formName={this.getFormMetaData().longName} canCreateModule={this.canCreateModule()}/>
			</Col> <Col lg={8} className="eq-height-item"> <FormLayoutMain>
				{this.getMainPanelComponents()}
			</FormLayoutMain> </Col> <Col lg={2} className="eq-height-item"> <SidePanel /> </Col> </Row>
		);
	}
}

FormLayout.propTypes = {
	formUIState: PropTypes.shape({
		actionMode: PropTypes.string.isRequired
	}),
	uiDropDownOptionsModel: PropTypes.object.isRequired,
	formModel:   PropTypes.shape({
		formMetaData: PropTypes.object.isRequired,
		formModules:  PropTypes.object.isRequired
	})
};
