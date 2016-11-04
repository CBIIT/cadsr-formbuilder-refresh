import React, {Component, PropTypes} from 'react';
import cartsService from  "../../services/carts/CartsService";
import EVENTS from '../../constants/EVENTS';
import {appChannel, cartChannel} from '../../channels/radioChannels';
import Datatable from '../tables/Datatable';
import {getModuleCartCollectionPojo} from '../../helpers/CartDataHelpers';
import TABLECONFIG from '../../constants/TABLE_CONFIGS';

export default class ModuleCartPage extends Component {
	constructor(props){
		super(props);
		this.massageCartData = this.massageCartData.bind(this);
		this.dispatchCartTableSortState = this.dispatchCartTableSortState.bind(this);
		this.state = {
			tableData: []
		};
	}

	componentDidMount(){
		appChannel.on(EVENTS.CARTS.MODULE_CART_UPDATED, () =>{
			const tableData = this.massageCartData(cartsService.moduleCartCollection);
			this.setState({tableData: tableData});
		});
	}

	componentWillUnmount(){
		appChannel.off(EVENTS.CARTS.MODULE_CART_UPDATED);
	}

	dispatchCartTableSortState({sortKey, sortOrder}){
		cartChannel.request(EVENTS.CARTS.SET_LAST_CART_SORTED_BY,
			{ModuleCartUIState: {sortKey: sortKey, sortOrder: sortOrder}});
	}

	/*TODO use shared logic among cart pages and FormLayout, possibly with an HOC */
	massageCartData(cartCollection){

		const ModuleCartUIState = cartsService.cartsStateModel.attributes.ModuleCartUIState;
		const sortKey = ModuleCartUIState.sortKey;
		const sortOrder = ModuleCartUIState.sortOrder;
		let CartItems = getModuleCartCollectionPojo(cartCollection);
		if(sortKey && sortOrder !== 'desc'){
			CartItems = _.sortBy(CartItems, sortKey);
		}
		else if(sortKey && sortOrder === 'desc'){
			CartItems = _.sortBy(CartItems, sortKey).reverse();
		}

		return CartItems;
	}

	render(){
		let pageName = "Module"; //page name used to display title and configure which columns to display
		const columnConfig = TABLECONFIG.MODULE; //collection of titles and model properties derived from the TABLECONFIG constant

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

ModuleCartPage.defaultProps = {
	cartLastSortedState: {}
};

ModuleCartPage.propTypes = {
	cartLastSortedState: PropTypes.object
};

