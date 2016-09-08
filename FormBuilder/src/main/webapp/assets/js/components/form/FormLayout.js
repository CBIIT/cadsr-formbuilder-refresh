import React, {Component, PropTypes} from 'react';
import {Col, Row} from 'react-bootstrap';
import FormLayoutMain from './FormLayoutMain';
import backboneReact from 'backbone-react-component';
import TreeView from './TreeView';
import SidePanel from './SidePanel';


export default class FormLayout extends Component {
	constructor(props){
		super(props);
		this.canCreateModule = this.canCreateModule.bind(this);
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

	/**
	 *
	 * @returns {boolean}
	 */
	canCreateModule() {
		/*TODO come up with a more reliable way to check for this */
		return this.state.formUIState.actionMode === "editForm" || this.state.formUIState.actionMode === 'viewFormFullView';
	}
	render(){
		return (
			<Row className="eq-height-wrapper">
				<Col lg={2} className="eq-height-item">
					<TreeView canCreateModule={this.canCreateModule()}/>
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
