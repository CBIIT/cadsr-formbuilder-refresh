import React, {Component, PropTypes} from 'react';
import {Col, Row} from 'react-bootstrap';
import FormLayoutMain from './FormLayoutMain';
import backboneReact from 'backbone-react-component';
import TreeView from './TreeView';
import SidePanel from './SidePanel';

export default class FormLayout extends Component {
	constructor(props){
		super(props);
		this.canCreateModule = this.canCreateModule.bind(this);
		this.getCartList = this.getCartList.bind(this);
		this.getFormModel = this.getFormModel.bind(this);
		this.getFormModules = this.getFormModules.bind(this);
		this.getActionMode = this.getActionMode.bind(this);
		this.getEditItems = this.getEditItems.bind(this);
		this.showTreeNav = this.showTreeNav.bind(this);
		this.showCartsPanel = this.showCartsPanel.bind(this);
	}

	componentWillMount(){
		/* watch for changes on these backbone models/collections and re-render */
		backboneReact.on(this, {
			models:      {
				formUIState: this.props.formUIState,
			},
			collections: {
				formModules: this.props.formModel.formModules
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
		return this.shouldShowFormEditControls() === true && this.getActionMode() !== 'createModule';
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

	/* TODO maybe get rid of "edit items" because whatever item you're viewing inside FormLayoutMain is editable, if "edit mode" is turned on */
	getEditItems(){
		return this.state.formUIState.editItem;
	}

	getCartList({name}){
		if(this.props[name]){
			return this.props[name].models.map(model =>{
				return Object.assign({}, model.attributes, {id: model.id});
			});
		}
	}

	getFormModules(){
		/* Return list of modules with its backbone model's cid included */
		return this.getFormModel().formModules.models.map(model =>{
			/* Getting cid vs moduleIdseq because new modules don't have a moduleIdseq */
			return Object.assign({}, model.attributes, {cid: model.cid});
		});
	}

	showCartsPanel(){
		if(this.getActionMode() !== "createForm"){
			return (
				<SidePanel cdeList={this.getCartList({name: "cdeCartCollection"})}/>
			);
		}

	}

	showTreeNav(){
		const actionMode = this.getActionMode();
		if(actionMode !== "createForm"){
			const activeModuleId = actionMode == "editModule" && this.getEditItems() ? this.getEditItems().id : null;
			const formMetadataLinkIsActive = actionMode == "editFormMetadata";
			return (
				<TreeView formMetadataLinkIsActive={formMetadataLinkIsActive} activeModuleId={activeModuleId} list={this.getFormModules()} formIdSeq={this.getFormModel().formIdseq} formName={this.getFormMetaData().longName} canCreateModule={this.canCreateModule()}/>
			);
		}
	}

	render(){
		return (
			<Row className="eq-height-wrapper"> <Col lg={3} className="eq-height-item">
				{this.showTreeNav()}
			</Col> <Col lg={6} className="eq-height-item panel-lg">
				<FormLayoutMain uiDropDownOptionsModel={this.props.uiDropDownOptionsModel} shouldShowFormEditControls={this.shouldShowFormEditControls()} actionMode={this.getActionMode()} formMetadata={this.getFormMetaData()} editItems={this.getEditItems()} formModules={this.getFormModules()}/>
			</Col> <Col lg={3} className="eq-height-item">
				{this.showCartsPanel()}

			</Col> </Row>
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
