import React, {Component, PropTypes} from 'react';
import {withRouter} from 'react-router';
import backboneReact from 'backbone-react-component';
import cartsService from  "../../services/carts/CartsService";
import cartActions from '../../constants/cartActions';
import EVENTS from '../../constants/EVENTS';
import {appChannel} from '../../channels/radioChannels';
import Datatable from '../tables/Datatable';
import {getCdeCartCollectionPojo,getModuleCartCollectionPojo,getFormCartCollectionPojo} from '../../helpers/CartDataHelpers';
import TABLECONFIG from '../../constants/TABLE_CONFIGS';

class CartLayout extends Component {
	constructor(props){
		super(props);
		this.massageCartData = this.massageCartData.bind(this);
		this.state = {
			tableData: []
		};
	}

	massageCartData(cartData){
		const actionMode = this.state.cartPageStateModel.actionMode;
		if(actionMode === cartActions.VIEW_CDE_CART_PAGE){
			return getCdeCartCollectionPojo(cartData);
		}
		else if(actionMode === cartActions.VIEW_FORM_CART_PAGE){
			return getFormCartCollectionPojo(cartData);
		}
		else if(actionMode === cartActions.VIEW_MODULE_CART_PAGE){
			return getModuleCartCollectionPojo(cartData);
		}
	}

	componentDidMount(){
		/* WHen the route chagnes/user leaves cart page, call routerWillLeave */
		this.props.router.setRouteLeaveHook(this.props.route, this.routerWillLeave);

		if(cartsService[this.props.route.cartData]){
			const tableData = this.massageCartData(cartsService[this.props.route.cartData]);
			this.setState({tableData: tableData});
		}
		appChannel.on(EVENTS.CARTS.CDE_CART_UPDATED, () =>{
			const tableData = this.massageCartData(cartsService[this.props.route.cartData]);
			this.setState({tableData: tableData});
		});
		appChannel.on(EVENTS.CARTS.MODULE_CART_UPDATED, () =>{
			const tableData = this.massageCartData(cartsService[this.props.route.cartData]);
			this.setState({tableData: tableData});
		});
		appChannel.on(EVENTS.CARTS.FORM_CART_UPDATED, () =>{
			const tableData = this.massageCartData(cartsService[this.props.route.cartData]);
			this.setState({tableData: tableData});
		});
	}

	routerWillLeave(nextLocation){
		console.log("user left cart page");
	}

	componentWillMount(){
		/*
		 this.cartPageFetchedData = cartsService[this.props.route.cartData];
		 */
		const cartPageStateModel = cartsService.cartPageStateModel;
		/* watch for changes on these backbone models/collections and re-render */
		backboneReact.on(this, {
			models: {
				cartPageStateModel: cartPageStateModel
			}/*,
			 collections: {
			 data: cartsService[this.props.route.cartData]
			 }*/
		});
	}

	componentWillReceiveProps(nextProps){
		if(nextProps.location.pathname !== this.props.location.pathname){
			/* reassign cartPageFetchedData if route has changed */
			/*
			 this.cartPageFetchedData = cartsService[nextProps.route.cartData];
			 */
		}
	}

	componentWillUpdate(nextProps, nextState){
		//	this.massageCartData(this.cartPageFetchedData);
	}

	componentWillUnmount(){
		backboneReact.off(this);
		appChannel.off(EVENTS.CARTS.CDE_CART_UPDATED);
		appChannel.off(EVENTS.CARTS.MODULE_CART_UPDATED);
		appChannel.off(EVENTS.CARTS.FORM_CART_UPDATED);
	}

	/**
	 *
	 * @returns {boolean}
	 */
	render(){

		const actionMode = this.state.cartPageStateModel.actionMode;
		let pageName = this.props.route.pageName; //page name used to display title and configure which columns to display
		let columnConfig = {}; //collection of titles and model properties derived from the TABLECONFIG constant
		let cartLastSortedState = {};
		//determine which page to use based on cartActions object
		if(actionMode === cartActions.VIEW_CDE_CART_PAGE){
			columnConfig = TABLECONFIG.CDE;
			cartLastSortedState = this.state.cartPageStateModel.CDECartUIState;
		}
		else if(actionMode === cartActions.VIEW_FORM_CART_PAGE){
			columnConfig = TABLECONFIG.FORM;
			cartLastSortedState = this.state.cartPageStateModel.FormCartUIState;
		}
		else if(actionMode === cartActions.VIEW_MODULE_CART_PAGE){
			columnConfig = TABLECONFIG.MODULE;
			cartLastSortedState = this.state.cartPageStateModel.ModuleCartUIState;
		}
		if(this.state.tableData.length){
			return (
				<div>
					<h1 className="text--bold">Form Builder | {pageName} Cart</h1>
					<Datatable cartLastSortedState={cartLastSortedState} pagination={true} perPage={100} pageName={pageName} columnTitles={columnConfig} data={this.state.tableData}></Datatable>
				</div>
			);
		}
		else{
			return (
			<div>
				<h1 className="text--bold">Form Builder | {pageName} Cart</h1>
				<p>Loading</p>
			</div>
			);
		}
	}
}

CartLayout.defaultProps = {
	cartLastSortedState: {}
};

CartLayout.propTypes = {
	cartLastSortedState: PropTypes.object
};

export default withRouter(CartLayout);

