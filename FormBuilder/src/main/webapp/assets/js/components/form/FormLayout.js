import React, {Component, PropTypes} from 'react';
import {Col, Row} from 'react-bootstrap';
import FormLayoutMain from './FormLayoutMain';
import backboneReact from 'backbone-react-component';
import TreeView from './TreeView';
import SidePanel from './SidePanel';


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
			<Row className="eq-height-wrapper">
				<Col lg={2} className="eq-height-item">
					<TreeView/>
				</Col>
				<Col lg={8} className="eq-height-item">
					<FormLayoutMain formUIState={this.state.formUIState} formModel={this.props.formModel.toJSON()} uiDropDownOptionsModel={this.props.uiDropDownOptionsModel}/>
				</Col>
				<Col lg={2} className="eq-height-item">
					<SidePanel />
				</Col>
			</Row>
		);
	}
}

FormLayout.propTypes = {
	formUIState: PropTypes.object.isRequired,
	uiDropDownOptionsModel: PropTypes.object.isRequired
};
