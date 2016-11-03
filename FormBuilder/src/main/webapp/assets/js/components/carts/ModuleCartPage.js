import React, {Component, PropTypes} from 'react';
import {withRouter} from 'react-router';
import backboneReact from 'backbone-react-component';
import cartsService from  "../../services/carts/CartsService";
import EVENTS from '../../constants/EVENTS';
import {appChannel} from '../../channels/radioChannels';
import Datatable from '../tables/Datatable';
import {getModuleCartCollectionPojo} from '../../helpers/CartDataHelpers';
import TABLECONFIG from '../../constants/TABLE_CONFIGS';

class ModuleCartPage extends Component {
	constructor(props){
		super(props);
		this.massageCartData = this.massageCartData.bind(this);
		this.state = {
			tableData: []
		};
	}

	massageCartData(cartData){
		return getModuleCartCollectionPojo(cartData);
	}

	componentDidMount(){
		/* WHen the route chagnes/user leaves cart page, call routerWillLeave */
		this.props.router.setRouteLeaveHook(this.props.route, this.routerWillLeave);

		if(cartsService.moduleCartCollection){
			const tableData = this.massageCartData(cartsService.moduleCartCollection);
			this.setState({tableData: tableData});
		}
		appChannel.on(EVENTS.CARTS.MODULE_CART_UPDATED, () =>{
			const tableData = this.massageCartData(cartsService.moduleCartCollection);
			this.setState({tableData: tableData});
		});
	}

	routerWillLeave(nextLocation){
		console.log("user left cart page");
	}

	componentWillMount(){
		const cartPageStateModel = cartsService.cartPageStateModel;
		/* watch for changes on these backbone models/collections and re-render */
		backboneReact.on(this, {
			models: {
				cartPageStateModel: cartPageStateModel
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
		appChannel.off(EVENTS.CARTS.MODULE_CART_UPDATED);
	}

	/**
	 *
	 * @returns {boolean}
	 */
	render(){
		let pageName = "Module"; //page name used to display title and configure which columns to display
		const columnConfig = TABLECONFIG.MODULE //collection of titles and model properties derived from the TABLECONFIG constant
		const cartLastSortedState = this.state.cartPageStateModel.ModuleCartUIState;
		//determine which page to use based on cartActions object

		if(this.state.tableData.length){
			return (
				<div>
					<h1 className="text--bold">Form Builder | {pageName} Cart</h1>
					<Datatable cartLastSortedState={cartLastSortedState} pagination={true} perPage={100} pageName={pageName} columnTitles={columnConfig} data={this.state.tableData} />
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

ModuleCartPage.defaultProps = {
	cartLastSortedState: {}
};

ModuleCartPage.propTypes = {
	cartLastSortedState: PropTypes.object
};

export default withRouter(ModuleCartPage);

