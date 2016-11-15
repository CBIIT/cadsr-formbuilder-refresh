import React, {Component, PropTypes} from 'react';
import {Col, Row} from 'react-bootstrap';
import FormLayoutMain from './FormLayoutMain';
import cartsService from  "../../services/carts/CartsService";
import formService from  "../../services/form/FormService";
import backboneReact from 'backbone-react-component';
import {withRouter} from 'react-router';
import TreeView from './TreeView';
import SidePanel from './SidePanel';
import EVENTS from '../../constants/EVENTS';
import {appChannel, formChannel} from '../../channels/radioChannels';
import formActions from '../../constants/formActions';
import {getCdeCartCollectionPojo, getModuleCartCollectionPojo} from '../../helpers/CartDataHelpers';
import backboneModelHelpers from "../../helpers/backboneModelHelpers";

class FormLayout extends Component {
	constructor(props){
		super(props);
		this.canCreateModule = this.canCreateModule.bind(this);
		this.getCDECart = this.getCDECart.bind(this);
		this.getFormModules = this.getFormModules.bind(this);
		this.getActionMode = this.getActionMode.bind(this);
		this.getEditItems = this.getEditItems.bind(this);
		this.getModuleCart = this.getModuleCart.bind(this);
		this.showTreeNav = this.showTreeNav.bind(this);
		this.showCartsPanel = this.showCartsPanel.bind(this);
		this.setCdeCartState = this.setCdeCartState.bind(this);
		this.setModuleCartState = this.setModuleCartState.bind(this);

		this.state = {
			cdeCartCollection:    [],
			moduleCartCollection: []
		};
	}

	componentWillMount(){
		/* backboneReact will pass these models/collections through setState, creating this.state.*
		 It listens to specific events on them and reflects the change in this.state (and therefore a re-render)  */
		backboneReact.on(this, {
			models:      {
				formUIState: formService.formUIStateModel
			},
			collections: {
				formModules: formService.formModel.attributes.formModules
			}
		});
		this.getFormModules();
	}

	/*TODO use shared logic among cart pages and FormLayout, possibly with an HOC */
	setCdeCartState(){
		const CDECartUIState = cartsService.cartsStateModel.attributes.CDECartUIState;
		const sortKey = CDECartUIState.sortKey;
		const sortOrder = CDECartUIState.sortOrder;
		let cdeCartItems = getCdeCartCollectionPojo(cartsService.cdeCartCollection);
		if(sortKey && sortOrder !== 'desc'){
			cdeCartItems = _.sortBy(cdeCartItems, sortKey);
		}
		else if(sortKey && sortOrder === 'desc'){
			cdeCartItems = _.sortBy(cdeCartItems, sortKey).reverse();
		}
		this.setState({cdeCartCollection: cdeCartItems});
	}

	/*TODO use shared logic among cart pages and FormLayout, possibly with an HOC */
	setModuleCartState(){
		const ModuleCartUIState = cartsService.cartsStateModel.attributes.ModuleCartUIState;
		const sortKey = ModuleCartUIState.sortKey;
		const sortOrder = ModuleCartUIState.sortOrder;
		let cartItems = getModuleCartCollectionPojo(cartsService.moduleCartCollection);
		if(sortKey && sortOrder !== 'desc'){
			cartItems = _.sortBy(cartItems, sortKey);
		}
		else if(sortKey && sortOrder === 'desc'){
			cartItems = _.sortBy(cartItems, sortKey).reverse();
		}
		this.setState({moduleCartCollection: cartItems});
	}

	componentDidMount(){
		if(cartsService.cdeCartCollection){
			this.setCdeCartState();
		}
		appChannel.on(EVENTS.CARTS.CDE_CART_UPDATED, () =>{
			this.setCdeCartState();
		});
		if(cartsService.moduleCartCollection){
			this.setModuleCartState();
		}
		appChannel.on(EVENTS.CARTS.MODULE_CART_UPDATED, () =>{
			this.setModuleCartState();
		});

		formChannel.on(EVENTS.FORM.SET_MODULE_TO_VIEW,() => {
			this.getEditItems();
		});

	}

	componentWillUpdate(nextProps, nextState){
		this.getFormModules();
		this.getEditItems();
	}

	componentWillUnmount(){
		/*Destroy listeners for BB events/radio so  setState() doesnt't get called on this component (per browser console errors) */
		backboneReact.off(this);
		appChannel.off(EVENTS.CARTS.CDE_CART_UPDATED);
		appChannel.off(EVENTS.CARTS.MODULE_CART_UPDATED);
		appChannel.off(EVENTS.FORM.SET_MODULE_TO_VIEW);
	}

	/**
	 *
	 * @returns {boolean}
	 */
	canCreateModule(){
		return this.shouldShowFormEditControls() === true && this.getActionMode() !== formActions.CREATE_MODULE && this.props.userIsLoggedIn;
	}

	shouldShowFormEditControls(){
		return this.state.formUIState.isEditing === true;
	}

	getActionMode(){
		return this.state.formUIState.actionMode;
	}

	getFormMetaData(){
		return formService.formModel.attributes.formMetadata.attributes;
	}

	/* TODO maybe get rid of "edit items" because whatever item you're viewing inside FormLayoutMain is editable, if "edit mode" is turned on. Note this also applies to a module being viewed, not just being editing */
	getEditItems(){
		if(this.getActionMode() === formActions.VIEW_MODULE) {
			this.editItems = _.findWhere(this.getFormModules({returnModules: true}), {cid: this.state.formUIState.moduleViewingId});
		}
	}

	getCDECart(){
		return this.state.cdeCartCollection;
	}

	getModuleCart(){
		return this.state.moduleCartCollection;
	}

	getFormModules({returnModules= false} = {}){
		/* Store a local copy of list of modules as POJOs with its backbone model's cid included
		 Getting cid vs moduleIdseq because new modules don't have a moduleIdseq */
		this.formModules = formService.formModel.attributes.formModules.models.map(model =>{
			return Object.assign({}, backboneModelHelpers.getDeepModelPojo(model), {cid: model.cid});
		});
		if(returnModules) {
			return this.formModules;
		}
	}

	showCartsPanel(){
		const actionMode = this.getActionMode();
		const activeModuleId = actionMode == formActions.VIEW_MODULE && this.editItems ? this.editItems.cid : null;
		const permitAddQuestionFromCde = actionMode === formActions.VIEW_MODULE && this.shouldShowFormEditControls();
		const canAddModuleFromCart = actionMode === formActions.VIEW_FULL_FORM && this.shouldShowFormEditControls();
		if(this.getActionMode() !== formActions.CREATE_FORM){
			return (
				<SidePanel canAddModuleFromCart={canAddModuleFromCart} permitAddQuestionFromCde={permitAddQuestionFromCde} activeModuleId={activeModuleId} moduleCartList={this.getModuleCart()} cdeCartList={this.getCDECart()}/>
			);
		}

	}

	showTreeNav(){
		const actionMode = this.getActionMode();
		if(actionMode !== formActions.CREATE_FORM){
			const activeModuleId = actionMode == formActions.VIEW_MODULE && this.editItems ? this.editItems.cid : null;
			const formMetadataLinkIsActive = actionMode === formActions.VIEW_FORM_METADATA;
			const viewFullFormLinkIsActive = actionMode === formActions.VIEW_FULL_FORM;
			return (
				<TreeView viewFullFormLinkIsActive={viewFullFormLinkIsActive} formMetadataLinkIsActive={formMetadataLinkIsActive} activeModuleId={activeModuleId} list={this.formModules} formIdSeq={this.props.formIdseq} formName={this.getFormMetaData().longName} canCreateModule={this.canCreateModule()}/>
			);
		}
	}

	render(){
		let columnConfig = {
			left:   {
				colWidth: 3
			},
			center: {
				colWidth: 6
			},
			right:  {
				colWidth: 3
			}
		};
		const actionMode = this.getActionMode();
		if(actionMode === formActions.CREATE_FORM){
			columnConfig.left.colWidth = 2;
			columnConfig.center.colWidth = 8;
			columnConfig.right.colWidth = 2;
		}
		const editItems = (actionMode === formActions.VIEW_MODULE) ? this.editItems : null;

		return (
			<div>
				<Row className="eq-height-wrapper"> <Col lg={columnConfig.left.colWidth} className="eq-height-item">
					{this.showTreeNav()}
				</Col> <Col lg={columnConfig.center.colWidth} className="eq-height-item panel-lg">
					<FormLayoutMain userIsLoggedIn={this.props.userIsLoggedIn} shouldShowFormEditControls={this.shouldShowFormEditControls()} actionMode={this.getActionMode()} formMetadata={this.getFormMetaData()} editItems={editItems} formModules={this.formModules}/>
				</Col> <Col lg={columnConfig.right.colWidth} className="eq-height-item">
					{this.showCartsPanel()}

				</Col> </Row>
			</div>
		);
	}
}

export default withRouter(FormLayout);

FormLayout.propTypes = {
	userIsLoggedIn: PropTypes.bool,
	/*formUIState:            PropTypes.shape({
	 TODO: needs to be formUIState.attributes.actionMode
	 actionMode: PropTypes.string.isRequired
	 }),*/
	formModel:      PropTypes.shape({
		formMetaData: PropTypes.object.isRequired,
		formModules:  PropTypes.object.isRequired
	})
};
