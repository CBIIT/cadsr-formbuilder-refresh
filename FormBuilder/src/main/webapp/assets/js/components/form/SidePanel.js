import React, {Component, PropTypes} from 'react';
import List from '../common/List';

export default class SidePanel extends Component {
	constructor(props){
		super(props);
	}

	render(){
		return (
			<div className="bordered-container tall-min-height">
				<p>CDE Cart</p>
				<div className="bordered-container">
					<List itemKey={"deIdseq"} itemTextKey={"longcdename"} data={this.props.cdeList}/>
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
