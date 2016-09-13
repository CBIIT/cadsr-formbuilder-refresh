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

FormLayoutMain.propTypes = {
	router:      PropTypes.shape({
		routes: PropTypes.object.isRequired
	}),
	formModel:   PropTypes.shape({
		formMetaData: PropTypes.object.isRequired,
		formModules:  PropTypes.object.isRequired

	}),
	formUIState: PropTypes.shape({
		actionMode: PropTypes.string.isRequired
	})
};
