import React, {Component, PropTypes} from 'react';
import {Col, Row} from 'react-bootstrap';
import FormLayoutMain from './FormLayoutMain';
import backboneReact from 'backbone-react-component';

export default class FormLayout extends Component {
	constructor(props){
		super(props);
	}
	componentWillMount(){
		/* watch for changes on these backbone models/collections and re-render */
		backboneReact.on(this, {
			models: {
				formUIState: this.props.formUIState}
		});
	}
	componentWillUnmount () {
		backboneReact.off(this);
	}

	render(){
		return (
			<div>
				<FormLayoutMain formUIState={this.state.formUIState} formModel={this.props.formModel.toJSON()} uiDropDownOptionsModel={this.props.uiDropDownOptionsModel}/>
			</div>
		);
	}
}

FormLayout.propTypes = {
	formUIState: PropTypes.object.isRequired,
	uiDropDownOptionsModel: PropTypes.object.isRequired
};
