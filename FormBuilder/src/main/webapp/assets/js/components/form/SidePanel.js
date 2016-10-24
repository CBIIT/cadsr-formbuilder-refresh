import React, {Component, PropTypes} from 'react';
import EVENTS from '../../constants/EVENTS';
import {formChannel} from '../../channels/radioChannels';
import formActions from '../../constants/formActions';
import ButtonList from '../common/ButtonList';

export default class SidePanel extends Component {
	constructor(props){
		super(props);

		this.dispatchAddQuestionFromCDE = this.dispatchAddQuestionFromCDE.bind(this);
		this.showCDECar = this.showCDECar.bind(this);
	}

	dispatchAddQuestionFromCDE(id){
		formChannel.request(EVENTS.FORM.CREATE_QUESTION_FROM_CDE, {
			action:         formActions.CREATE_QUESTION,
			questionCid:    id,
			activeModuleId: this.props.activeModuleId
		});
	}

	showCDECar(){
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
					<ButtonList  {...extraButtonListProps} itemKey={"parentQuestionModelId"} className="panel-list-cart panel-item" itemTextKey={"longcdename"} data={this.props.cdeCartList}/>
				</div>
			</div>
		);
	}

	render(){
		return (
			<div>
				{this.showCDECar()}
				<div className="bordered-container panel panel-half">
					<p className="panel-header">
						<span className="panel-header-heading">Module Cart</span>
					</p>
					<div className="panel-content">
						{/*<ButtonList itemKey={"deIdseq"} className="panel-list-cart panel-item" itemTextKey={"longcdename"} data={this.props.moduleCartList}/>*/}
					</div>
					<div className="panel-content">
						<p className="panel-temp"><em>Coming Soon...</em></p>
					</div>
				</div>
			</div>

		);
	}
}

SidePanel.defaultProps = {
	cdeList:                  [],
	permitAddQuestionFromCde: false
};

SidePanel.propTypes = {
	permitAddQuestionFromCde: PropTypes.bool,
	cdeList:                  PropTypes.array
};
