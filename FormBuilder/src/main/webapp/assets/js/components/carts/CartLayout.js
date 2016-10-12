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
		this.massageFormCartData();
	}

	massageFormCartData(){
		/* Store a local copy of list of modules as POJOs with its backbone model's cid included
		 Getting cid vs moduleIdseq because new modules don't have a moduleIdseq */
		console.log('data', this.props.data);
		let formModules = this.props.data.models.map(model =>{
			console.log('single model', model);
			//return Object.assign({}, backboneModelHelpers.getDeepModelPojo(model), {cid: model.cid, contextname:
			// model.context.name});
		});
		//console.log(formModules);
	}

	componentWillMount(){
		/* watch for changes on these backbone models/collections and re-render */
		backboneReact.on(this, {
			models:      {
				cartPageStateModel: this.props.cartPageStateModel
			}/*,
			collections: {
			}*/
		});
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
		let pageName = "";
		if(actionMode === cartActions.VIEW_CDE_CART_PAGE) {
			 pageName = "CDE Cart";
		}
		else if (actionMode === cartActions.VIEW_FORM_CART_PAGE) {
			pageName = "Form Cart";
		}
		else if (actionMode === cartActions.VIEW_MODULE_CART_PAGE) {
			pageName = "Module Cart";

		}
		return (
			<div>
				<h1 className="text--bold">Form Builder | {pageName}</h1>
				<FormTable pagination={true} perPage={5} columnTitles={TABLECONFIG.CDE} data={this.props.data}></FormTable>
			</div>
		);
	}
}

CartLayout.propTypes = {
};
