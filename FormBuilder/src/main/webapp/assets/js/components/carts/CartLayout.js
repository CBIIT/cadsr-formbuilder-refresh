import React, {Component, PropTypes} from 'react';
import backboneReact from 'backbone-react-component';
import cartActions from '../../constants/cartActions';
import FormTable from '../formTable/formTable';
import TABLECONFIG from '../../constants/TABLE_CONFIGS';
import backboneModelHelpers from "../../helpers/backboneModelHelpers";

export default class CartLayout extends Component {
	constructor(props){
		super(props);
		this.massageFormCartData = this.massageFormCartData.bind(this);
		this.data = [];
	}

	massageFormCartData(){
		/* Store a local copy of list of modules as POJOs with its backbone model's cid included
		 Getting cid vs moduleIdseq because new modules don't have a moduleIdseq */
		let formData = this.props.data.models.map(model =>{
			return Object.assign({}, model.attributes, {cid: model.cid, contextName:
			 model.get('context').name, protocolLongName: model.get('protocols')[0].longName});
		});
		this.data = formData;
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
		this.massageFormCartData();
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
		return (
			<div>

				<h1 className="text--bold">Form Builder | {pageName}</h1>
				<FormTable pagination={true} perPage={100} pageName={pageName} columnTitles={columnConfig} data={this.data}></FormTable>
			</div>
		);
	}
}

CartLayout.propTypes = {
};
