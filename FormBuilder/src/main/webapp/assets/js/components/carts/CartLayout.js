import React, {Component, PropTypes} from 'react';
import backboneReact from 'backbone-react-component';
import cartActions from '../../constants/cartActions';
import Datatable from '../tables/Datatable';
import {getCdeCartCollectionPojo, getModuleCartCollectionPojo, getFormCartCollectionPojo} from '../../helpers/CartDataHelpers';
import TABLECONFIG from '../../constants/TABLE_CONFIGS';

export default class CartLayout extends Component {
	constructor(props){
		super(props);
		this.massageCartData = this.massageCartData.bind(this);
		this.data = [];
	}

	massageCartData(nextProps){
		const props = nextProps || this.props;
		const actionMode = this.state.cartPageStateModel.actionMode;
		if(actionMode === cartActions.VIEW_CDE_CART_PAGE) {
			this.data = getCdeCartCollectionPojo(props.data);
		}
		else if (actionMode === cartActions.VIEW_FORM_CART_PAGE) {
			this.data = getFormCartCollectionPojo(props.data);
		}
		else if (actionMode === cartActions.VIEW_MODULE_CART_PAGE) {
			this.data = getModuleCartCollectionPojo(props.data);
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
	componentWillReceiveProps(nextProps) {
		this.massageCartData(nextProps);
	}
	componentWillUpdate(nextProps, nextState) {
		this.massageCartData(nextProps);
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
		let cartLastSortedState ={};
		//determine which page to use based on cartActions object
		if(actionMode === cartActions.VIEW_CDE_CART_PAGE) {
			 pageName = "CDE";
			columnConfig = TABLECONFIG.CDE;
			cartLastSortedState = this.state.cartPageStateModel.CDECartUIState;
		}
		else if (actionMode === cartActions.VIEW_FORM_CART_PAGE) {
			pageName = "Form";
			columnConfig = TABLECONFIG.FORM;
			cartLastSortedState = this.state.cartPageStateModel.FormCartUIState;
		}
		else if (actionMode === cartActions.VIEW_MODULE_CART_PAGE) {
			pageName = "Module";
			columnConfig = TABLECONFIG.MODULE;
			cartLastSortedState = this.state.cartPageStateModel.ModuleCartUIState;
		}
		if(this.data.length) {
			return (
				<div>
					<h1 className="text--bold">Form Builder | {pageName} Cart</h1>
					<Datatable cartLastSortedState={cartLastSortedState} pagination={true} perPage={10} pageName={pageName} columnTitles={columnConfig} data={this.data}></Datatable>
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

CartLayout.defaultProps = {
	cartLastSortedState: {}
};

CartLayout.propTypes = {
	cartLastSortedState: PropTypes.object
};
