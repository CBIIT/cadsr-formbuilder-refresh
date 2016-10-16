import React, {Component, PropTypes} from 'react';
import backboneReact from 'backbone-react-component';
import cartActions from '../../constants/cartActions';
import DataTable from '../formTable/DataTable';
import {getCdeCartCollectionPojo, getModuleCartCollectionPojo, getFormCartCollectionPojo} from '../../helpers/CartDataHelpers';
import TABLECONFIG from '../../constants/TABLE_CONFIGS';

export default class CartLayout extends Component {
	constructor(props){
		super(props);
		this.massageCartData = this.massageCartData.bind(this);
		this.data = [];
	}

	massageCartData(){
		const actionMode = this.state.cartPageStateModel.actionMode;
		if(actionMode === cartActions.VIEW_CDE_CART_PAGE) {
			this.data = getCdeCartCollectionPojo(this.props.data);
		}
		else if (actionMode === cartActions.VIEW_FORM_CART_PAGE) {
			this.data = getFormCartCollectionPojo(this.props.data);
		}
		else if (actionMode === cartActions.VIEW_MODULE_CART_PAGE) {
			this.data = getModuleCartCollectionPojo(this.props.data);
		}
	}

	componentWillMount(){
		/* watch for changes on these backbone models/collections and re-render */
		backboneReact.on(this, {
			models: {
				cartPageStateModel: this.props.cartPageStateModel
			},
			collections: {
				data: this.props.data
			}
		});
	}
	componentWillUpdate(nextProps, nextState) {
		this.massageCartData();
	}
	componentWillUnmount(){
		backboneReact.off(this);
	}
	/**
	 *
	 * @returns {boolean}
	 */
	render(){

		const actionMode = this.state.cartPageStateModel.actionMode;
		let pageName = ""; //page name used to display title and configure which columns to display
		let columnConfig = {}; //collection of titles and model properties derived from the TABLECONFIG constant
		//determine which page to use based on cartActions object
		if(actionMode === cartActions.VIEW_CDE_CART_PAGE) {
			 pageName = "CDE Cart";
			columnConfig = TABLECONFIG.CDE;
		}
		else if (actionMode === cartActions.VIEW_FORM_CART_PAGE) {
			pageName = "Form Cart";
			columnConfig = TABLECONFIG.FORM;
		}
		else if (actionMode === cartActions.VIEW_MODULE_CART_PAGE) {
			pageName = "Module Cart";
			columnConfig = TABLECONFIG.MODULE;
		}
		if(this.data.length) {
			return (
				<div>
					<h1 className="text--bold">Form Builder | {pageName}</h1>
					<DataTable pagination={true} perPage={100} pageName={pageName} columnTitles={columnConfig} data={this.data}></DataTable>
				</div>
			);
		}
		else {
			return (
				<p>Loading</p>
			);
		}
	}
}

CartLayout.propTypes = {
};
