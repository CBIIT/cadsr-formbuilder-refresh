import React, {Component, PropTypes} from 'react';
import {Col, Row, Button} from 'react-bootstrap';

export default class FormLayoutMain extends Component {
	constructor(props){
		super(props);

		this.state = {
			clicked: false
		};
	}


	render(){
		return (
			<section>
				{this.props.children}
			</section>
		);
	}
}

FormLayoutMain.propTypes= {
	children: PropTypes.node
};
