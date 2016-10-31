import React, {Component, PropTypes} from 'react';
import {Col, Row} from 'react-bootstrap';
import FormLayoutMain from './FormLayoutMain';
import userService from  "../../services/user/UserService";
import backboneReact from 'backbone-react-component';
import TreeView from './TreeView';
import SidePanel from './SidePanel';
import EVENTS from '../../constants/EVENTS';
import {appChannel} from '../../channels/radioChannels';
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
		this.showTreeNav = this.showTreeNav.bind(this);
		this.showCartsPanel = this.showCartsPanel.bind(this);

		this.state = {
			userIsLoggedIn: false,
			cdeCartCollection: [],
			moduleCartCollection: []
		};
	}
	componentWillMount(){
		/* backboneReact will pass these models/collections through setState, creating this.state.*
		 It listens to specific events on them and reflects the change in this.state (and therefore a re-render)  */
		backboneReact.on(this, {
			models:      {
				formUIState: Application.formService.formUIStateModel
			},
			collections: {
				formModules: Application.formService.formModel.attributes.formModules
			}
		});
		this.getFormModules();


	}
	componentDidMount() {
		userService.isUserLoggedIn().then((data) => {
			this.setState({userIsLoggedIn: data});
		});
		if(Application.cartsService.cdeCartCollection){
			this.setState({cdeCartCollection: getCdeCartCollectionPojo(Application.cartsService.cdeCartCollection)});
		}
		appChannel.on(EVENTS.CARTS.CDE_CART_UPDATED, () => {
			this.setState({cdeCartCollection: getCdeCartCollectionPojo(Application.cartsService.cdeCartCollection)});
		});
		if(Application.cartsService.moduleCartCollection){
			this.setState({moduleCartCollection: getModuleCartCollectionPojo(Application.cartsService.moduleCartCollection)});
		}
		appChannel.on(EVENTS.CARTS.MODULE_CART_UPDATED, () => {
			this.setState({moduleCartCollection: getModuleCartCollectionPojo(Application.cartsService.moduleCartCollection)});
		});
	}
	
	componentWillUpdate(nextProps, nextState){
		this.getFormModules();
		console.log("FormLayout componentWillUpdate");
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
		return this.state.cdeCartCollection;
	}

	getModuleCart(){
		return this.state.moduleCartCollection;
	}

	getFormModules(){
		/* Store a local copy of list of modules as POJOs with its backbone model's cid included
		 Getting cid vs moduleIdseq because new modules don't have a moduleIdseq */
			this.formModules = Application.formService.formModel.attributes.formModules.models.map(model =>{
				return Object.assign({}, backboneModelHelpers.getDeepModelPojo(model), {cid: model.cid});
			});
	}

	showCartsPanel(){
		const actionMode = this.getActionMode();
		const activeModuleId = actionMode == formActions.VIEW_MODULE && this.getEditItems() ? this.getEditItems().cid : null;
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
			const activeModuleId = actionMode == formActions.VIEW_MODULE && this.getEditItems() ? this.getEditItems().cid : null;
			const formMetadataLinkIsActive = actionMode === formActions.VIEW_FORM_METADATA;
			const viewFullFormLinkIsActive = actionMode === formActions.VIEW_FULL_FORM;
			return (
				<TreeView viewFullFormLinkIsActive={viewFullFormLinkIsActive} formMetadataLinkIsActive={formMetadataLinkIsActive} activeModuleId={activeModuleId} list={this.formModules} formIdSeq={this.props.formIdseq} formName={this.getFormMetaData().longName} canCreateModule={this.canCreateModule()}/>
			);
		}
	}

	render(){
		let columnConfig = {
			left: {
				colWidth: 3
			},
			center: {
				colWidth: 6
			},
			right: {
				colWidth: 3
			}
		};
		const actionMode = this.getActionMode();
		if (actionMode === formActions.CREATE_FORM) {
			columnConfig.left.colWidth = 2;
			columnConfig.center.colWidth = 8;
			columnConfig.right.colWidth = 2;
		}
		
		return (
			<div>
				<Row className="eq-height-wrapper"> <Col lg={columnConfig.left.colWidth} className="eq-height-item">
				{this.showTreeNav()}
				</Col> <Col lg={columnConfig.center.colWidth} className="eq-height-item panel-lg">
					<FormLayoutMain userIsLoggedIn={this.state.userIsLoggedIn} shouldShowFormEditControls={this.shouldShowFormEditControls()} actionMode={this.getActionMode()} formMetadata={this.getFormMetaData()} editItems={this.getEditItems()} formModules={this.formModules}/>
				</Col> <Col lg={columnConfig.right.colWidth} className="eq-height-item">
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
	formModel:              PropTypes.shape({
		formMetaData: PropTypes.object.isRequired,
		formModules:  PropTypes.object.isRequired
	})
};
