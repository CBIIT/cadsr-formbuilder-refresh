import React, {Component, PropTypes} from 'react';
import {Col, Row, Button} from 'react-bootstrap';
import FormModuleForm from './FormModuleForm';
import ButtonsGroup from '../common/ButtonsGroup';
import FormMetadataForm from './FormMetadataForm';
import FormMetadataStatic from './FormMetadataStatic';
import EVENTS from '../../constants/EVENTS';
import {formChannel} from '../../channels/radioChannels';

export default class FormLayoutMain extends Component {
	constructor(props){
		super(props);
		this.getMainPanelComponents = this.getMainPanelComponents.bind(this);
		this.dispatchCancelButtonClicked = this.dispatchCancelButtonClicked.bind(this);
		this.dispatchEditFormClicked = this.dispatchEditFormClicked.bind(this);
		this.dispatchSaveFormClicked = this.dispatchSaveFormClicked.bind(this);
		this.getToolbarItems = this.getToolbarItems.bind(this);

		this.state = {
			clicked: false
		};
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

	dispatchSaveFormClicked(){
		formChannel.request(EVENTS.FORM.SAVE_FORM, {persistToDB: true});
	}

	getMainPanelComponents(){
		const actionMode = this.props.actionMode;
		if(actionMode === "viewFormFullView" && !this.props.shouldShowFormEditControls){
			return (
				<div>
					<FormMetadataStatic formMetadata={this.props.formMetadata}/> {this.props.formModules.map((moduleModel, index) =>(
					<FormModuleForm questions={JSON.stringify(moduleModel.questions)} disabled={true} key={index} longName={moduleModel.longName} instructions={moduleModel.instructions}/>))}

				</div>
			);
		}
		else if(actionMode === "viewFormFullView" && this.props.shouldShowFormEditControls){
			return (
				<div>
					<FormMetadataStatic formMetadata={this.props.formMetadata}/> {this.props.formModules.map((moduleModel, index) =>(
					<FormModuleForm disabled={true} key={index} questions={JSON.stringify(moduleModel.questions)} longName={moduleModel.longName} instructions={moduleModel.instructions}/>))}

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
			const metaDataFormHeadingTitle = actionMode === 'createForm' ? 'Create New Form' : 'Edit Form',
				submitButtonText = (actionMode === 'createForm') ? 'Create Form' : 'Save';
			const buttons = [
				{
					name: submitButtonText,
					type: "submit"
				}
			];
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
		else if(actionMode === 'editModule'){
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
	}

	getToolbarItems(){
		if(this.props.shouldShowFormEditControls){
			return [
				{
					name:    "Cancel",
					onClick: "dispatchCancelButtonClicked"
				},
				{
					name:    "View Full Form",
					onClick: "dispatchNavigateFullFormView"
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
					name:    "View Full Form",
					onClick: "dispatchNavigateFullFormView"
				},
			];
		}
	}
	render(){
		return (
			<section>
				<Row> <Col lg={9}></Col>
					<Col lg={3}><ButtonsGroup dispatchCancelButtonClicked={this.dispatchCancelButtonClicked} dispatchEditFormClicked={this.dispatchEditFormClicked} dispatchNavigateFullFormView={this.dispatchNavigateFullFormView} buttons={this.getToolbarItems()}/></Col>
				</Row> {this.getMainPanelComponents()}
			</section>
		);
	}
}

FormLayoutMain.propTypes= {
	children: PropTypes.node
};
