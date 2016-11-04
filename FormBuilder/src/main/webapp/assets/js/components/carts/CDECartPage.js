import React, {Component, PropTypes} from 'react';
import cartsService from  "../../services/carts/CartsService";
import EVENTS from '../../constants/EVENTS';
import {appChannel, cartChannel} from '../../channels/radioChannels';
import Datatable from '../tables/Datatable';
import {getCdeCartCollectionPojo} from '../../helpers/CartDataHelpers';
import TABLECONFIG from '../../constants/TABLE_CONFIGS';

export default class CDECartPage extends Component {
	constructor(props){
		super(props);
		this.massageCartData = this.massageCartData.bind(this);
		this.dispatchCartTableSortState = this.dispatchCartTableSortState.bind(this);
		this.state = {
			tableData: []
		};
	}

	componentDidMount(){
		appChannel.on(EVENTS.CARTS.CDE_CART_UPDATED, () =>{
			const tableData = this.massageCartData(cartsService.cdeCartCollection);
			this.setState({tableData: tableData});
		});
	}

	componentWillUnmount(){
		appChannel.off(EVENTS.CARTS.CDE_CART_UPDATED);
	}

	dispatchCartTableSortState({sortKey, sortOrder}){
		cartChannel.request(EVENTS.CARTS.SET_LAST_CART_SORTED_BY,
			{CDECartUIState: {sortKey: sortKey, sortOrder: sortOrder}});
	}
	/*TODO use shared logic among cart pages and FormLayout, possibly with an HOC */
	massageCartData(cartCollection){
		const CDECartUIState = cartsService.cartsStateModel.attributes.CDECartUIState;
		const sortKey = CDECartUIState.sortKey;
		const sortOrder = CDECartUIState.sortOrder;
		let cdeCartItems = getCdeCartCollectionPojo(cartCollection);
		if(sortKey && sortOrder !== 'desc'){
			cdeCartItems = _.sortBy(cdeCartItems, sortKey);
		}
		else if(sortKey && sortOrder === 'desc'){
			cdeCartItems = _.sortBy(cdeCartItems, sortKey).reverse();
		}

		return cdeCartItems;
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

