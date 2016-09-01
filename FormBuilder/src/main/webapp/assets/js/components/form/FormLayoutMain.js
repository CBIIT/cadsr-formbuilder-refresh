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
		this.shouldShowFormMetaData = this.shouldShowFormMetaData.bind(this);
		this.showChildComponents = this.showChildComponents.bind(this);
		this.showCreateButton = this.showCreateButton.bind(this);
		this.getActionMode = this.getActionMode.bind(this);
		this.state = {
			clicked: false
		};
	}
	getActionMode() {
		return this.props.formUIState.actionMode;
	}
	showChildComponents(){
		if(this.getActionMode() === "editForm"){
		const FormModulesCollection = this.props.formModel.formModules;
			return (
				FormModulesCollection.map((moduleModel, index) =>{
					return <FormModuleForm key={index} name={moduleModel.get("name")} instructions={moduleModel.get("name")}/>;
				})
			);
		}
	}
	dispatchCreate(itemToCreate){
		switch(itemToCreate){
			case "module":
				formRouter.navigate(ROUTES.FORM.CREATE_MODULE, {trigger: true});
				break;
			default:
				console.error("itemToCreate doesn't work");
		}
	}
	showCreateButton() {
		if(this.getActionMode()  === "editForm"){
			return (
				<Button onClick={()=>this.dispatchCreate("module")} className="btn btn-primary" type="submit">Create Module</Button>
			);
		}
	}
	shouldShowFormMetaData(){
		if(this.getActionMode() ===  'createForm' || this.getActionMode() === "editForm"){
			return (
				<div>
					<FormMetadataForm naFormme="formMetadata" formMetadata={this.props.formModel.formMetaData} uiDropDownOptionsModel={this.props.uiDropDownOptionsModel} title="Crate New Form"/>
					<div>
						{this.showCreateButton()}
					</div>
				</div>
			);
		}
	}

	render(){
		return (
			<section>
				{this.shouldShowFormMetaData()}

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
