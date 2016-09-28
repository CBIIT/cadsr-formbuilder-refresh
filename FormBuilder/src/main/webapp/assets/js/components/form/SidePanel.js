import React, {Component, PropTypes} from 'react';
import List from '../common/List';

export default class SidePanel extends Component {
	constructor(props){
		super(props);
	}

	render(){
		return (
			<div>
				<div className="bordered-container panel panel-half">
					<p className="panel-header">
						<span className="panel-header-link">CDE Cart</span>
					</p>
					<div class="panel-content">
						<List itemKey={"deIdseq"} className="panel-list-cart panel-item" itemTextKey={"longcdename"} data={this.props.cdeList}/>
					</div>
				</div>
				<div className="bordered-container panel panel-half">
					<p className="panel-header">
					<span className="panel-header-link">Module Cart</span>
					</p>
					<div className="panel-content">
						<p className="panel-temp"><em>Coming Soon...</em></p>
					</div>
				</div>
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
