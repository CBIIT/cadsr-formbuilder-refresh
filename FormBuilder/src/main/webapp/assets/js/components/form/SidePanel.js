import React, {Component, PropTypes} from 'react';
import EVENTS from '../../constants/EVENTS';
import {formChannel} from '../../channels/radioChannels';
import formActions from '../../constants/formActions';
import ButtonList from '../common/ButtonList';
import {Link} from 'react-router';

export default class SidePanel extends Component {
	constructor(props){
		super(props);

		this.dispatchAddModuleFromModuleCart = this.dispatchAddModuleFromModuleCart.bind(this);
		this.dispatchAddQuestionFromCDE = this.dispatchAddQuestionFromCDE.bind(this);
		this.showCDECart = this.showCDECart.bind(this);
		this.showModuleCart = this.showModuleCart.bind(this);

	}
	dispatchAddModuleFromModuleCart(id){
		formChannel.request(EVENTS.FORM.ADD_MODULE_FROM_CART, {
			moduleId:    id});
	}
	dispatchAddQuestionFromCDE(id){
		formChannel.request(EVENTS.FORM.CREATE_QUESTION_FROM_CDE, {
			action:         formActions.CREATE_QUESTION,
			questionCid:    id,
			activeModuleId: this.props.activeModuleId
		});
	}

	showCDECart(){
		const extraButtonListProps = {};
		if(this.props.permitAddQuestionFromCde){
			extraButtonListProps.onClickCallback = this.dispatchAddQuestionFromCDE;
		}
		return (
			<div className="bordered-container panel panel-half">
				<p className="panel-header center-v-spread-h">
					<span className="panel-header-heading">CDE Cart</span>
					<Link to="/">GET MORE</Link>
				</p>
				<div className="panel-content">
					<ButtonList  {...extraButtonListProps} itemKey={"parentQuestionModelId"} className={"panel-list-cart panel-item"} buttonItemClassName={"button-link button-link-default " + (this.props.permitAddQuestionFromCde ? "add-text" : "")} itemTextKey={"longcdename"} data={this.props.cdeCartList}/>
				</div>
			</div>
		);
	}
	showModuleCart(){
		const extraButtonListProps = {};
		if(this.props.canAddModuleFromCart){
			extraButtonListProps.onClickCallback = this.dispatchAddModuleFromModuleCart;
		}
		return (
			<div className="bordered-container panel panel-half">
				<p className="panel-header center-v-spread-h">
					<span className="panel-header-heading">Module Cart</span>
					<a href="https://cdebrowser-stage.nci.nih.gov/cdebrowserClient/cdeBrowser.html#/search" target="_blank">GET MORE</a>
				</p>
				<div className="panel-content">
					<ButtonList  {...extraButtonListProps} itemKey={"id"} className={"panel-list-cart panel-item"} buttonItemClassName={"button-link button-link-default " + (this.props.canAddModuleFromCart ? "add-text center-v-spread-h" : "")} itemTextKey={"longName"} data={this.props.moduleCartList}/>
				</div>
			</div>
		);
	}

	render(){
		return (
			<div>
				{this.showCDECart()}
				{this.showModuleCart()}
			</div>

		);
	}
}

SidePanel.defaultProps = {
	cdeCartList:                  [],
	permitAddQuestionFromCde: false
};

SidePanel.propTypes = {
	permitAddQuestionFromCde: PropTypes.bool,
	cdeCartList:                  PropTypes.array
};
