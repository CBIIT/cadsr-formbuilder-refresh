import React, {Component, PropTypes} from 'react';
import {Col, Row, Button} from 'react-bootstrap';
import FormModuleForm from './FormModuleForm';
import ButtonsGroup from '../common/ButtonsGroup';
import FormMetadataForm from './FormMetadataForm';
import FormMetadataStatic from './FormMetadataStatic';
import FormModuleStatic from './FormModuleStatic';
import FormGlobalToolbar from './FormGlobalToolbar';
import EVENTS from '../../constants/EVENTS';
import {formChannel} from '../../channels/radioChannels';

export default class FormLayoutMain extends Component {
	constructor(props){
		super(props);
		this.getMainPanelComponents = this.getMainPanelComponents.bind(this);

		this.dispatchSaveFormClicked = this.dispatchSaveFormClicked.bind(this);
		this.showGlobalToolbar = this.showGlobalToolbar.bind(this);

		this.state = {
			clicked: false
		};
	}


	dispatchSaveFormClicked(){
		formChannel.request(EVENTS.FORM.SAVE_FORM, {persistToDB: true});
	}

	getMainPanelComponents(){
		const actionMode = this.props.actionMode;
		if(actionMode === "viewFormFullView"){
			return (
				<div>
					<FormMetadataStatic formMetadata={this.props.formMetadata}/>
					<hr className="panel-divider"/>
					<p className="panel-subtitle">Modules</p>
					<div className="module-wrap">
						{this.props.formModules.map((moduleModel, index) =>(
						<FormModuleStatic questions={JSON.stringify(moduleModel.questions)} key={index} longName={moduleModel.longName} instructions={moduleModel.instructions}/>))}
					</div>
				</div>
			);
		}
		else if(actionMode === 'createForm' || (actionMode === 'editFormMetadata' && this.props.shouldShowFormEditControls)){
			const metaDataFormHeadingTitle = actionMode === 'createForm' ? 'Create New Form' : 'Edit Form',
				submitButtonText = (actionMode === 'createForm') ? 'Create Form' : 'Save';
			const buttons = [
				{
					name: submitButtonText,
					type: "submit"
				}
			];
			return (
				<div>
					<FormMetadataForm actionMode={actionMode} formMetadata={this.props.formMetadata} uiDropDownOptionsModel={this.props.uiDropDownOptionsModel} mainHeadingTitle={metaDataFormHeadingTitle}>
						<ButtonsGroup buttons={buttons}/> </FormMetadataForm>
				</div>
			);
		}
		else if(actionMode === 'editFormMetadata' && !this.props.shouldShowFormEditControls){
			return (
				<FormMetadataStatic formMetadata={this.props.formMetadata}/>
			);
		}
		else if(actionMode === 'createModule'){
			const buttons = [
				{
					name: "Save",
					type: "submit"
				}
			];
			return (
				<FormModuleForm actionMode={actionMode} mainHeadingTitle="Create Module">
					<ButtonsGroup buttons={buttons}/> </FormModuleForm>
			);
		}
		else if(actionMode === 'editModule' && this.props.shouldShowFormEditControls){
			const moduleEditing = this.props.editItems;
			const buttons = [
				{
					name:     "Save",
					type:     "submit",
					disabled: !this.props.shouldShowFormEditControls
				}
			];
			/*Passing in moduleId here might not be necessary but currently the most straightforward way I can think of when there will be an array of modules (parent module, repetition) to edit and gather each one's id from the form when saving */
			return (
				<FormModuleForm disabled={!this.props.shouldShowFormEditControls} moduleId={moduleEditing.id} longName={moduleEditing.longName} instructions={moduleEditing.instructions} questions={JSON.stringify(moduleEditing.questions)} actionMode={actionMode} mainHeadingTitle="Module">
					<ButtonsGroup buttons={buttons}/> </FormModuleForm>
			);
		}
		else if(actionMode === 'editModule' && !this.props.shouldShowFormEditControls){
			const moduleEditing = this.props.editItems;
			/*Passing in moduleId here might not be necessary but currently the most straightforward way I can think of when there will be an array of modules (parent module, repetition) to edit and gather each one's id from the form when saving */
			return (
				<FormModuleStatic moduleId={moduleEditing.id} longName={moduleEditing.longName} instructions={moduleEditing.instructions} questions={JSON.stringify(moduleEditing.questions)} actionMode={actionMode} mainHeadingTitle="Module"/>
			);
		}
	}

	showGlobalToolbar(){
		const displayFullFormViewButton = this.props.actionMode !== "viewFormFullView";
		if(this.props.actionMode !== "createForm"){
			return (
				<FormGlobalToolbar formLongName={this.props.formMetadata.longName} actionMode={this.props.actionMode} displayFullFormViewButton={displayFullFormViewButton} shouldShowFormEditControls={this.props.shouldShowFormEditControls}/>
			);
		}
	}

	render(){
		return (
			<section className="panel">
				{this.showGlobalToolbar()}
				<div className="panel-content">
					{this.getMainPanelComponents()}
				</div>
			</section>
		);
	}
}

FormLayoutMain.propTypes = {
	children: PropTypes.node
};
