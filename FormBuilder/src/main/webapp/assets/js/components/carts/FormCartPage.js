import React, {Component, PropTypes} from 'react';
import {withRouter} from 'react-router';
import backboneReact from 'backbone-react-component';
import cartsService from  "../../services/carts/CartsService";
import EVENTS from '../../constants/EVENTS';
import {appChannel} from '../../channels/radioChannels';
import Datatable from '../tables/Datatable';
import {getFormCartCollectionPojo} from '../../helpers/CartDataHelpers';
import TABLECONFIG from '../../constants/TABLE_CONFIGS';

class FormCartPage extends Component {
	constructor(props){
		super(props);
		this.massageCartData = this.massageCartData.bind(this);
		this.state = {
			tableData: []
		};
	}

	massageCartData(cartData){
		return getFormCartCollectionPojo(cartData);
	}

	componentDidMount(){
		/* WHen the route chagnes/user leaves cart page, call routerWillLeave */
		this.props.router.setRouteLeaveHook(this.props.route, this.routerWillLeave);

		if(cartsService[this.props.route.cartData]){
			const tableData = this.massageCartData(cartsService[this.props.route.cartData]);
			this.setState({tableData: tableData});
		}
		appChannel.on(EVENTS.CARTS.FORM_CART_UPDATED, () =>{
			const tableData = this.massageCartData(cartsService[this.props.route.cartData]);
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
		appChannel.off(EVENTS.CARTS.FORM_CART_UPDATED);
	}
	render(){
		let pageName = "Form"; //page name used to display title and configure which columns to display
		//collection of titles and model properties derived from the TABLECONFIG constant
		const	columnConfig = TABLECONFIG.FORM;
		const	cartLastSortedState = this.state.cartPageStateModel.FormCartUIState;
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
					<p>Your cart is empty</p>
				</div>
			);
		}
	}
}

FormCartPage.defaultProps = {
	cartLastSortedState: {}
};

FormCartPage.propTypes = {
	cartLastSortedState: PropTypes.object
};

export default withRouter(FormCartPage);

