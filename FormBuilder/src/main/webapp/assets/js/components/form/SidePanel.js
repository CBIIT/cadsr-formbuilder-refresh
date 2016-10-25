import React, {Component, PropTypes} from 'react';
import EVENTS from '../../constants/EVENTS';
import {formChannel} from '../../channels/radioChannels';
import formActions from '../../constants/formActions';
import ButtonList from '../common/ButtonList';

export default class SidePanel extends Component {
	constructor(props){
		super(props);

		this.dispatchAddModuleFromModuleCart = this.dispatchAddModuleFromModuleCart.bind(this);
		this.dispatchAddQuestionFromCDE = this.dispatchAddQuestionFromCDE.bind(this);
		this.showCDECart = this.showCDECart.bind(this);
		this.showModuleCart = this.showModuleCart.bind(this);

	}
	dispatchAddModuleFromModuleCart(id){
		formChannel.request(EVENTS.FORM.CREATE_QUESTION_FROM_CDE, {
			action:         formActions.CREATE_QUESTION,
			questionCid:    id,
			activeModuleId: this.props.activeModuleId
		});
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
				<p className="panel-header">
					<span className="panel-header-heading">CDE Cart</span>
				</p>
				<div className="panel-content">
					<ButtonList  {...extraButtonListProps} itemKey={"parentQuestionModelId"} className={"panel-list-cart panel-item"} buttonItemClassName={"button-link button-link-default " + (this.props.permitAddQuestionFromCde ? "add-text center-v-spread-h" : "")} itemTextKey={"longcdename"} data={this.props.cdeCartList}/>
				</div>
			</div>
		);
	}
	showModuleCart(){
		const extraButtonListProps = {};
		if(this.props.canAddModuleFromCart){
			extraButtonListProps.canAddModuleFromCart = this.dispatchAddModuleFromModuleCart;
		}
		return (
			<div className="bordered-container panel panel-half">
				<p className="panel-header">
					<span className="panel-header-heading">Module Cart</span>
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
