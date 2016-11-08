import React, {Component, PropTypes} from 'react';
import cartsService from  "../../services/carts/CartsService";
import EVENTS from '../../constants/EVENTS';
import {appChannel} from '../../channels/radioChannels';
import Datatable from '../tables/Datatable';
import {getFormCartCollectionPojo} from '../../helpers/CartDataHelpers';
import TABLECONFIG from '../../constants/TABLE_CONFIGS';

export default class FormCartPage extends Component {
	constructor(props){
		super(props);
		this.massageCartData = this.massageCartData.bind(this);
		this.state = {
			tableData: []
		};
	}

	componentDidMount(){
		appChannel.on(EVENTS.CARTS.FORM_CART_UPDATED, () =>{
			const tableData = this.massageCartData(cartsService.formCartCollection);
			this.setState({tableData: tableData});
		});
	}

	componentWillUnmount(){
		appChannel.off(EVENTS.CARTS.FORM_CART_UPDATED);
	}

	massageCartData(cartData){
		return getFormCartCollectionPojo(cartData);
	}
	render(){
		let pageName = "Form"; //page name used to display title and configure which columns to display
		//collection of titles and model properties derived from the TABLECONFIG constant
		const	columnConfig = TABLECONFIG.FORM;
		if(this.state.tableData.length){
			return (
				<div>
					<h1 className="text--bold">Form Builder | {pageName} Cart</h1>
					<Datatable pagination={true} perPage={100} pageName={pageName} columnTitles={columnConfig} data={this.state.tableData} />
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
};

FormCartPage.propTypes = {
};

