import React, {Component, PropTypes} from 'react';
import List from '../common/List';

export default class SidePanel extends Component {
	constructor(props){
		super(props);
	}

	render(){
		return (
			<div className="bordered-container tall-min-height panel">
				<p className="panel-header">
					<span className="panel-header-link">CDE Cart</span>
				</p>
				<List itemKey={"deIdseq"} className="panel-list-cart panel-item" itemTextKey={"longcdename"} data={this.props.cdeList}/>

			</div>
		);
	}
}

SidePanel.defaultProps = {
	cdeList: []
};

SidePanel.propTypes = {
	cdeList: PropTypes.array
};
