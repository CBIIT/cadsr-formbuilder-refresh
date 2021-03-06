import React, {Component, PropTypes} from 'react';
import FormModuleForm from './form-modules/FormModuleForm';
import ButtonsGroup from '../common/ButtonsGroup';
import FormMetadataForm from './FormMetadataForm';
import FormMetadataStatic from './FormMetadataStatic';
import FormModuleStatic from './form-modules/FormModuleStatic';
import FormGlobalToolbar from './FormGlobalToolbar';
import EVENTS from '../../constants/EVENTS';
import {formChannel} from '../../channels/radioChannels';
import formActions from '../../constants/formActions';
import {Link} from 'react-router';

export default class FormLayoutMain extends Component {
	constructor(props){
		super(props);
		this.getMainPanelComponents = this.getMainPanelComponents.bind(this);
		this.dispatchSaveFormClicked = this.dispatchSaveFormClicked.bind(this);
		this.showGlobalToolbar = this.showGlobalToolbar.bind(this);
		this.cancelCreation = this.cancelCreation.bind(this);
	}

	componentDidMount() {
		window.scrollTo(0,0);
	}

	dispatchSaveFormClicked(){
		formChannel.request(EVENTS.FORM.SAVE_FORM, {persistToDB: true});
	}

	cancelCreation(){
		window.location = window.history.back();
	}

	getMainPanelComponents(){
		const actionMode = this.props.actionMode;
		if(actionMode === formActions.VIEW_FULL_FORM){
			return (
				<div>
					<FormMetadataStatic formMetadata={this.props.formMetadata}/>
					<hr className="panel-divider"/>
					<p className="panel-subtitle"/>
					<h3>MODULES</h3>
					<div className="module-wrap">
						{this.props.formModules.map((moduleModel, index) =>(
							<FormModuleStatic shouldDisplayCopyItem={this.props.userIsLoggedIn} shouldShowRemoveModuleBtn={this.props.shouldShowFormEditControls} longName={moduleModel.longName} moduleId={moduleModel.cid} questions={moduleModel.questions} key={index} instructions={moduleModel.instructions}/>))}
					</div>
				</div>
			);
		}
		else if(actionMode === formActions.CREATE_FORM){
			const metaDataFormHeadingTitle = actionMode === formActions.CREATE_FORM ? 'FormBuilder | Create New Form' : 'Edit Form';
			return (
				<div>
					<FormMetadataForm actionMode={actionMode} formMetadata={this.props.formMetadata} mainHeadingTitle={metaDataFormHeadingTitle}>
						<div className="pull-right">
							<Link to="/" className="btn btn-default">CANCEL</Link>
							<button type="submit" className="btn btn-primary">SAVE</button>
						</div>
					</FormMetadataForm>
				</div>
			);
		}
		else if(actionMode === formActions.VIEW_FORM_METADATA && this.props.shouldShowFormEditControls){
			return (
					<FormMetadataForm actionMode={actionMode} formMetadata={this.props.formMetadata} mainHeadingTitle="Edit Form" />
			);
		}
		else if(actionMode === formActions.VIEW_FORM_METADATA && !this.props.shouldShowFormEditControls){
			return (
				<FormMetadataStatic formMetadata={this.props.formMetadata}/>
			);
		}
		else if(actionMode === formActions.CREATE_MODULE){
			const buttons = [
				{
					name: "ADD",
					type: "submit",
					className: "btn btn-primary no-margin"
				}
			];
			return (
				<FormModuleForm actionMode={actionMode} mainHeadingTitle="Create Module">
					<ButtonsGroup containerClassName="pull-right" buttons={buttons}/> </FormModuleForm>
			);
		}
		else if(actionMode === formActions.VIEW_MODULE && this.props.shouldShowFormEditControls){
			const moduleEditing = this.props.editItems;
			/*Passing in moduleId here might not be necessary but currently the most straightforward way I can think of when there will be an array of modules (parent module, repetition) to edit and gather each one's id from the form when saving */
			return (
				<FormModuleForm disabled={!this.props.shouldShowFormEditControls} moduleId={moduleEditing.cid} longName={moduleEditing.longName} instructions={moduleEditing.instructions} questions={moduleEditing.questions} actionMode={actionMode} mainHeadingTitle="Module"/>
			);
		}
		else if(actionMode === formActions.VIEW_MODULE && !this.props.shouldShowFormEditControls){
			const moduleEditing = this.props.editItems;
			if(typeof moduleEditing ===  "object"){
				return (
					<FormModuleStatic moduleId={moduleEditing.cid} longName={moduleEditing.longName} instructions={moduleEditing.instructions} questions={moduleEditing.questions} actionMode={actionMode} mainHeadingTitle="Module"/>
				);
			}
		}
	}

	showGlobalToolbar(){
		const displayFullFormViewButton = this.props.actionMode !== formActions.VIEW_FULL_FORM;
		if(this.props.actionMode !== formActions.CREATE_FORM){
			return (
				<FormGlobalToolbar formMetadata={this.props.formMetadata} actionMode={this.props.actionMode} displayFullFormViewButton={displayFullFormViewButton} shouldShowFormEditControls={this.props.shouldShowFormEditControls} userIsLoggedIn={this.props.userIsLoggedIn}/>
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
	userIsLoggedIn: PropTypes.bool.isRequired,
	children:       PropTypes.node
};
