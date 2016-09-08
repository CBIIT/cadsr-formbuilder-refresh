import React, {Component, PropTypes} from 'react';
import {Col, Row, Button, FormGroup, ControlLabel, FormControl} from 'react-bootstrap';


export default class TreeView extends Component {
	constructor(props){
		super(props);
		this.dispatchCreate = this.dispatchCreate.bind(this);
	}
	dispatchCreate(actionModel = "module"){
		switch(actionModel){
			case "module":
				formRouter.navigate(ROUTES.FORM.CREATE_MODULE, {trigger: true});
				break;
			default:
		}
	}
	getActionMode() {
		return this.props.formUIState.actionMode;
	}
	render(){
		return (
			<div className="bordered-container full-height">

			</div>
		);
	}
}

TreeView.propTypes = {
	children: PropTypes.element
};
