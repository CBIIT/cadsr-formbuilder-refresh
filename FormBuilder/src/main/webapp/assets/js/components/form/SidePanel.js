import React, {Component, PropTypes} from 'react';

export default class NavigationMenu extends Component {
	constructor(props){
		super(props);
	}

	render(){
		return (
			<div className="bordered-container">
				<h4>Placeholder Carts Panel heading</h4>
			</div>
		);
	}
}

NavigationMenu.propTypes = {
	children: PropTypes.element
};
