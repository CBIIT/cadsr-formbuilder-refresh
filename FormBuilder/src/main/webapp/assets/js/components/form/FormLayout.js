import React, {Component, PropTypes} from 'react';
import {Col, Row} from 'react-bootstrap';
import FormLayoutMain from './FormLayoutMain';
import backboneReact from 'backbone-react-component';
import TreeView from './TreeView';
import SidePanel from './SidePanel';
import formActions from '../../constants/formActions';
import backboneModelHelpers from "../../helpers/backboneModelHelpers";

export default class FormLayout extends Component {
	constructor(props){
		super(props);
		this.canCreateModule = this.canCreateModule.bind(this);
		this.getCartList = this.getCartList.bind(this);
		this.getFormModules = this.getFormModules.bind(this);
		this.getActionMode = this.getActionMode.bind(this);
		this.getEditItems = this.getEditItems.bind(this);
		this.showTreeNav = this.showTreeNav.bind(this);
		this.showCartsPanel = this.showCartsPanel.bind(this);
	}

	componentWillMount(){
		/* backboneReact will pass these models/collections through setState, creating this.state.*
		It listens to specific events on them and reflects the change in this.state (and therefore a re-render)  */
		backboneReact.on(this, {
			models:      {
				formUIState: this.props.formUIState
			},
			collections: {
				formModules: this.props.formModules
			}
		});
		this.getFormModules();

	}
	componentWillUnmount(){
		backboneReact.off(this);
	}
	componentWillUpdate(nextProps, nextState) {
		this.getFormModules();
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
		return this.props.formMetadata;
	}

	/* TODO maybe get rid of "edit items" because whatever item you're viewing inside FormLayoutMain is editable, if "edit mode" is turned on */
	getEditItems(){
		return _.findWhere( this.formModules,{cid: this.state.formUIState.moduleViewingId});
	}

	getCartList({name}){
		if(this.props[name]){
			return this.props[name].models.map(model =>{
				return Object.assign({}, model.attributes.dataElement, {id: model.id});
			});
		}
	}

	getFormModules(){
		/* Store a local copy of list of modules as POJOs with its backbone model's cid included
		 Getting cid vs moduleIdseq because new modules don't have a moduleIdseq */
		this.formModules = this.props.formModules.models.map(model =>{
			return Object.assign({}, backboneModelHelpers.getDeepModelPojo(model), {cid: model.cid});
		});
	}

	showCartsPanel(){
		if(this.getActionMode() !== formActions.CREATE_FORM){
			return (
				<SidePanel cdeList={this.getCartList({name: "cdeCartCollection"})}/>
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
					<FormLayoutMain uiDropDownOptionsModel={this.props.uiDropDownOptionsModel} shouldShowFormEditControls={this.shouldShowFormEditControls()} actionMode={this.getActionMode()} formMetadata={this.getFormMetaData()} editItems={this.getEditItems()} formModules={this.formModules}/>
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
