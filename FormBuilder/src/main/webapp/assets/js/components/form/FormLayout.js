import React, {Component, PropTypes} from 'react';
import {Col, Row} from 'react-bootstrap';
import FormLayoutMain from './FormLayoutMain';
import backboneReact from 'backbone-react-component';
import TreeView from './TreeView';
import SidePanel from './SidePanel';
import formActions from '../../constants/formActions';
import {getCdeCartCollectionPojo, getModuleCartCollectionPojo} from '../../helpers/CartDataHelpers';
import backboneModelHelpers from "../../helpers/backboneModelHelpers";

export default class FormLayout extends Component {
	constructor(props){
		super(props);
		this.canCreateModule = this.canCreateModule.bind(this);
		this.getCDECart = this.getCDECart.bind(this);
		this.getFormModules = this.getFormModules.bind(this);
		this.getActionMode = this.getActionMode.bind(this);
		this.getEditItems = this.getEditItems.bind(this);
		this.getModuleCart = this.getModuleCart.bind(this);
		this.getUIDropDownOptions = this.getUIDropDownOptions.bind(this);
		this.showTreeNav = this.showTreeNav.bind(this);
		this.showCartsPanel = this.showCartsPanel.bind(this);
	}

	componentWillMount(){
		/* backboneReact will pass these models/collections through setState, creating this.state.*
		It listens to specific events on them and reflects the change in this.state (and therefore a re-render)  */

		/*
		formIdseq={this.formModel.attributes.formIdseq}
		formMetadata={this.formModel.attributes.formMetadata.attributes}
		formModules={this.formModel.attributes.formModules}
		moduleCartCollection={this.app.cartsService.moduleCartCollection}
		cdeCartCollection={this.app.cartsService.cdeCartCollection}
		uiDropDownOptionsModel={this.uiDropDownOptionsModel}
		formUIState={this.formUIStateModel}
		*/
		backboneReact.on(this, {
			models:      {
				formUIState: Application.formService.formUIStateModel,
				uiDropDownOptionsModel: Application.formService.uiDropDownOptionsModel
			},
			collections: {
				formModules: Application.formService.formModel.attributes.formModules
			}
		});
		this.getFormModules();

	}
	componentWillUnmount(){
		backboneReact.off(this);
	}
	componentWillUpdate(nextProps, nextState) {
		this.getFormModules();
		this.getUIDropDownOptions(nextState.uiDropDownOptionsModel);
		console.log("FormLayout componentWillUpdate");
	}
	/**
	 *
	 * @returns {boolean}
	 */
	canCreateModule(){
		/*TODO come up with a more reliable way to check for this */
		return this.shouldShowFormEditControls() === true && this.getActionMode() !== formActions.CREATE_MODULE;
	}

	shouldShowFormEditControls(){
		return this.state.formUIState.isEditing === true;
	}

	getActionMode(){
		return this.state.formUIState.actionMode;
	}

	getFormMetaData(){
		return Application.formService.formModel.attributes.formMetadata.attributes;
	}

	/* TODO maybe get rid of "edit items" because whatever item you're viewing inside FormLayoutMain is editable, if "edit mode" is turned on */
	getEditItems(){
		return _.findWhere( this.formModules,{cid: this.state.formUIState.moduleViewingId});
	}

	getCDECart(){
		if(Application.cartsService.cdeCartCollection){
			return getCdeCartCollectionPojo(Application.cartsService.cdeCartCollection);
		}
	}

	getModuleCart(){
		if(Application.cartsService.moduleCartCollection){
			return getModuleCartCollectionPojo(Application.cartsService.moduleCartCollection);
		}
	}
	getUIDropDownOptions(uiDropDownOptionsModel) {
		uiDropDownOptionsModel = uiDropDownOptionsModel || this.state.uiDropDownOptionsModel;
		return {
			contexts: uiDropDownOptionsModel.contexts.toJSON(),
			formCategories: uiDropDownOptionsModel.formCategories.toJSON(),
			formTypes: uiDropDownOptionsModel.formTypes.toJSON(),
			workflows: uiDropDownOptionsModel.workflows.toJSON()
		};
	}
	getFormModules(){
		/* Store a local copy of list of modules as POJOs with its backbone model's cid included
		 Getting cid vs moduleIdseq because new modules don't have a moduleIdseq */
			this.formModules = Application.formService.formModel.attributes.formModules.models.map(model =>{
				return Object.assign({}, backboneModelHelpers.getDeepModelPojo(model), {cid: model.cid});
			});
	}

	showCartsPanel(){
		if(this.getActionMode() !== formActions.CREATE_FORM){
			return (
				<SidePanel cdeCartList={this.getCDECart()}/>
			);
		}

	}

	showTreeNav(){
		const actionMode = this.getActionMode();
		if(actionMode !== formActions.CREATE_FORM){
			const activeModuleId = actionMode == formActions.VIEW_MODULE && this.getEditItems() ? this.getEditItems().cid : null;
			const formMetadataLinkIsActive = actionMode === formActions.VIEW_FORM_METADATA;
			return (
				<TreeView formMetadataLinkIsActive={formMetadataLinkIsActive} activeModuleId={activeModuleId} list={this.formModules} formIdSeq={this.props.formIdseq} formName={this.getFormMetaData().longName} canCreateModule={this.canCreateModule()}/>
			);
		}
	}

	render(){
		let columnConfig = [];
		return (
			<div>
				<Row className="eq-height-wrapper"> <Col lg={3} className="eq-height-item">
				{this.showTreeNav()}
				</Col> <Col lg={6} className="eq-height-item panel-lg">
					<FormLayoutMain uiDropDownOptionsModel={Application.formService.uiDropDownOptionsModel.toJSON()} shouldShowFormEditControls={this.shouldShowFormEditControls()} actionMode={this.getActionMode()} formMetadata={this.getFormMetaData()} editItems={this.getEditItems()} formModules={this.formModules}/>
				</Col> <Col lg={3} className="eq-height-item">
					{this.showCartsPanel()}

				</Col> </Row>
			</div>
		);
	}
}

FormLayout.propTypes = {
	/*formUIState:            PropTypes.shape({
	TODO: needs to be formUIState.attributes.actionMode
		actionMode: PropTypes.string.isRequired
	}),*/
	uiDropDownOptionsModel: PropTypes.object.isRequired,
	formModel:              PropTypes.shape({
		formMetaData: PropTypes.object.isRequired,
		formModules:  PropTypes.object.isRequired
	})
};
