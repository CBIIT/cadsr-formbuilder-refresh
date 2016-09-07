import React, {Component, PropTypes} from 'react';
import {Col, Row, Button} from 'react-bootstrap';
import FormMetadataForm from './FormMetadataForm';
import ROUTES from '../../constants/ROUTES';
import {formChannel} from '../../channels/radioChannels';
import formRouter from '../../routers/FormRouter';
import FormModuleForm from './FormModuleForm';

export default class FormLayoutMain extends Component {
	constructor(props){
		super(props);
		this.dispatchCreate = this.dispatchCreate.bind(this);
		this.showChildComponents = this.showChildComponents.bind(this);
		this.showFormActionButtons = this.showFormActionButtons.bind(this);
		this.getActionMode = this.getActionMode.bind(this);
		this.state = {
			clicked: false
		};
	}
	getActionMode() {
		return this.props.formUIState.actionMode;
	}
	showChildComponents(){
		const actionMode = this.getActionMode();
		if(actionMode === "fullFormView"){
		const FormModulesCollection = this.props.formModel.formModules;
			return (
				FormModulesCollection.map((moduleModel, index) =>{
					return <FormModuleForm key={index} name={moduleModel.get("name")} instructions={moduleModel.get("name")}/>;
				})
			);
		}
		else if (actionMode ===  'createForm' || actionMode === "editForm"){
			return (
				<div>
					<FormMetadataForm actionMode={actionMode} formMetadata={this.props.formModel.formMetadata.attributes} uiDropDownOptionsModel={this.props.uiDropDownOptionsModel} title="Crate New Form">
						{this.showFormActionButtons(actionMode)}
					</FormMetadataForm>
				</div>
			);
		}
		else if(actionMode === 'createModule'){
			return (
				<FormModuleForm title="Create Module" />
			);
		}
	}

	/**
	 *
	 * @param itemToCreate
	 */
	dispatchCreate(itemToCreate){
		switch(itemToCreate){
			case "module":
				formRouter.navigate(ROUTES.FORM.CREATE_MODULE, {trigger: true});
				break;
			default:
				console.error("itemToCreate doesn't work");
		}
	}
	/**
	 * Buttons based on the actionMode passed into the rendered form
	 * @param actionModel
	 * @returns {XML}
	 */
	showFormActionButtons(actionModel) {
		switch(actionModel){
			case "createForm":
				return (
					<Button className="btn btn-primary" type="submit">Save</Button>
				);
			default:
				return (
					<Button disabled className="btn btn-primary" type="submit">Save</Button>
				);
		}
	}
	render(){
		return (
			<section>
				{this.showChildComponents()}
			</section>
		);
	}
}

FormLayoutMain.propTypes = {
	router:      PropTypes.shape({
		routes: PropTypes.object.isRequired
	}),
	formModel: PropTypes.shape({
		formMetaData: PropTypes.object.isRequired,
		formModules: PropTypes.object.isRequired

	}),
	formUIState: PropTypes.shape({
		actionMode: PropTypes.string.isRequired
	})
};
