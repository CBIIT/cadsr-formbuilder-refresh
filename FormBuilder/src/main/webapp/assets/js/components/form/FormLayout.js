import React, {Component, PropTypes} from 'react';
import {Col, Row} from 'react-bootstrap';
import FormLayoutMain from './FormLayoutMain';
import backboneReact from 'backbone-react-component';
import TreeView from './TreeView';
import SidePanel from './SidePanel';
import FormModuleForm from './FormModuleForm';
import ButtonsGroup from '../common/ButtonsGroup';
import FormMetadataForm from './FormMetadataForm';
import FormMetadataStatic from './FormMetadataStatic';
import EVENTS from '../../constants/EVENTS';
import {formChannel} from '../../channels/radioChannels';

export default class FormLayout extends Component {
	constructor(props){
		super(props);
		this.canCreateModule = this.canCreateModule.bind(this);
		this.dispatchCancelButtonClicked = this.dispatchCancelButtonClicked.bind(this);
		this.dispatchEditFormClicked = this.dispatchEditFormClicked.bind(this);
		this.dispatchSaveFormClicked = this.dispatchSaveFormClicked.bind(this);
		this.getFormModel = this.getFormModel.bind(this);
		this.getFormModules = this.getFormModules.bind(this);
		this.getActionMode = this.getActionMode.bind(this);
		this.getEditItems = this.getEditItems.bind(this);
		this.getMainPanelComponents = this.getMainPanelComponents.bind(this);
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
		return this.shouldShowFormEditControls() === true && this.getActionMode() === 'viewFormFullView';
	}

	shouldShowFormEditControls(){
		return this.state.formUIState.isEditing === true;
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
		/* Return list of modules with its backbone model's cid included */
		return this.getFormModel().formModules.models.map(model =>{
			return Object.assign({}, model.attributes, {cid: model.cid});
		});
	}

	dispatchCancelButtonClicked(){
		console.log("cancel button clicked");
	}

	dispatchEditFormClicked(){
		formChannel.request(EVENTS.FORM.EDIT_FORM);
	}

	dispatchSaveFormClicked(){
		formChannel.request(EVENTS.FORM.SAVE_FORM);
	}

	getMainPanelComponents(){
		const actionMode = this.getActionMode();
		if(actionMode === "viewFormFullView" && !this.shouldShowFormEditControls()){
			const buttons = [
				{
					name:    "Edit Form",
					onClick: "dispatchEditFormClicked"
				}
			];
			return (
				<div>
					<Row><Col lg={9}></Col>
						<Col lg={3}><ButtonsGroup dispatchEditFormClicked={this.dispatchEditFormClicked} buttons={buttons}/></Col>
					</Row>

					<FormMetadataStatic formMetadata={this.getFormMetaData()}/> {this.getFormModules().map((moduleModel, index) =>(
					<FormModuleForm questions={JSON.stringify(moduleModel.questions)} disabled={true} key={index} longName={moduleModel.longName} instructions={moduleModel.instructions}/>))}

				</div>
			);
		}
		else if(actionMode === "viewFormFullView" && this.shouldShowFormEditControls()){
			const buttons = [
				{
					name:    "Cancel",
					onClick: "dispatchCancelButtonClicked"
				},
				{
					name:    "Update",
					onClick: "dispatchSaveFormClicked"
				}
			];
			return (
				<div>
					<Row> <Col lg={9}><p>Viewing Full Form</p>
					</Col><Col lg={3}><ButtonsGroup dispatchCancelButtonClicked={this.dispatchCancelButtonClicked()} dispatchSaveFormClicked={this.dispatchSaveFormClicked} buttons={buttons}/></Col>
					</Row>

					<FormMetadataStatic formMetadata={this.getFormMetaData()}/> {this.getFormModules().map((moduleModel, index) =>(
					<FormModuleForm disabled={true} key={index} questions={JSON.stringify(moduleModel.questions)} longName={moduleModel.longName} instructions={moduleModel.instructions}/>))}

				</div>
			);
		}
		else if(actionMode === 'createForm'){
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
					<FormMetadataForm actionMode={actionMode} formMetadata={this.getFormMetaData()} uiDropDownOptionsModel={this.props.uiDropDownOptionsModel} mainHeadingTitle={metaDataFormHeadingTitle}>
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
				<FormModuleForm moduleId={moduleEditing.id} longName={moduleEditing.longName} instructions={moduleEditing.instructions} actionMode={actionMode} mainHeadingTitle="Edit Module">
					<ButtonsGroup buttons={buttons}/> </FormModuleForm>
			);
		}
	}

	render(){
		return (
			<Row className="eq-height-wrapper"> <Col lg={2} className="eq-height-item">
				<TreeView list={this.getFormModules()} formIdSeq={this.getFormModel().formIdseq} formName={this.getFormMetaData().longName} canCreateModule={this.canCreateModule()}/>
			</Col> <Col lg={8} className="eq-height-item"> <FormLayoutMain>
				{this.getMainPanelComponents()}
			</FormLayoutMain> </Col> <Col lg={2} className="eq-height-item"> <SidePanel /> </Col> </Row>
		);
	}
}

FormLayout.propTypes = {
	formUIState:            PropTypes.shape({
		actionMode: PropTypes.string.isRequired
	}),
	uiDropDownOptionsModel: PropTypes.object.isRequired,
	formModel:              PropTypes.shape({
		formMetaData: PropTypes.object.isRequired,
		formModules:  PropTypes.object.isRequired
	})
};
