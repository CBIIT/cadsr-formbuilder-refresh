import React, {Component, PropTypes} from 'react';
import {withRouter} from 'react-router';
import backboneReact from 'backbone-react-component';
import cartsService from  "../../services/carts/CartsService";
import EVENTS from '../../constants/EVENTS';
import {appChannel, cartChannel} from '../../channels/radioChannels';
import Datatable from '../tables/Datatable';
import {getCdeCartCollectionPojo} from '../../helpers/CartDataHelpers';
import TABLECONFIG from '../../constants/TABLE_CONFIGS';

class CDECartPage extends Component {
	constructor(props){
		super(props);
		this.massageCartData = this.massageCartData.bind(this);
		this.dispatchCartTableSortState = this.dispatchCartTableSortState.bind(this);
		this.state = {
			tableData: []
		};
	}

	dispatchCartTableSortState({sortKey, sortOrder}){
		cartChannel.request(EVENTS.CARTS.SET_LAST_CART_SORTED_BY,
			{sortKey: sortKey, sortOrder: sortOrder});
	}

	massageCartData(cartCollection){
		const CDECartUIState = cartsService.cartsStateModel.attributes.CDECartUIState;
		const lastSortedByKey = CDECartUIState.lastSortedByKey;
		const lastSortOrder = CDECartUIState.lastSortOrder;
		let cdeCartItems = getCdeCartCollectionPojo(cartCollection);
		if(lastSortedByKey && lastSortOrder !== 'desc'){
			cdeCartItems = _.sortBy(cdeCartItems, lastSortedByKey);
		}
		else if(lastSortedByKey && lastSortOrder === 'desc'){
			cdeCartItems = _.sortBy(cdeCartItems, lastSortedByKey).reverse();
		}

		return cdeCartItems;
	}

	componentDidMount(){
		/* WHen the route chagnes/user leaves cart page, call routerWillLeave */
		this.props.router.setRouteLeaveHook(this.props.route, this.routerWillLeave);

		appChannel.on(EVENTS.CARTS.CDE_CART_UPDATED, () =>{
			const tableData = this.massageCartData(cartsService.cdeCartCollection);
			this.setState({tableData: tableData});
		});
	}

	routerWillLeave(nextLocation){
		console.log("user left cart page");
	}

	componentWillMount(){
		const cartsStateModel = cartsService.cartsStateModel;
		/* watch for changes on these backbone models/collections and re-render */
		backboneReact.on(this, {
			models: {
				cartsStateModel: cartsStateModel
			}
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

	componentWillUnmount(){
		backboneReact.off(this);
		appChannel.off(EVENTS.CARTS.CDE_CART_UPDATED);
	}

	render(){
		let pageName = "CDE"; //page name used to display title and configure which columns to display
		const columnConfig = TABLECONFIG.CDE; //collection of titles and model properties derived from the TABLECONFIG constant

		if(this.state.tableData.length){
			return (
				<div>
					<h1 className="text--bold">Form Builder | {pageName} Cart</h1>
					<Datatable pagination={true} perPage={100} pageName={pageName} columnTitles={columnConfig} data={this.state.tableData} dispatchSortedState={this.dispatchCartTableSortState}/>
				</div>
			);
		}
		else{
			return (
				<div>
					<h1 className="text--bold">Form Builder | {pageName} Cart</h1>
					<p>Your cart is empty</p>
				</div>
			);
		}
	}
}

CDECartPage.defaultProps = {
	cartLastSortedState: {}
};

CDECartPage.propTypes = {
	cartLastSortedState: PropTypes.object
};

export default withRouter(CDECartPage);

