import React, {Component, PropTypes} from 'react';
import {Col, Row, Button} from 'react-bootstrap';
import {Input, Textarea} from 'formsy-react-components';
import EVENTS from '../../constants/EVENTS';
import {formChannel} from '../../channels/radioChannels';
import Form from '../common/Form';

export default class FormModuleForm extends Component {
	constructor(props){
		super(props);
		this.dispatchData = this.dispatchData.bind(this);
		// Default state
		this.state = {
			disabled: false
		};
	}

	dispatchData(data){
		const actionMode = this.props.actionMode;
		if(actionMode === "editModule"){
			const newData = Object.assign({}, data, {id: this.props.moduleId});
			formChannel.request(EVENTS.FORM.SET_MODULE, newData);
		}
		else if(actionMode === "createModule"){
			formChannel.request(EVENTS.FORM.SET_NEW_MODULE, data);
		}
	}

	render(){
		return (
			<Row> <Col sm={12}>
				<Form onSubmit={this.dispatchData} validatePristine={this.state.validatePristine} disabled={this.props.disabled} ref="formModuleForm">
					<fieldset name="Module Metadata">
						<legend>{this.props.mainHeadingTitle}</legend>
						<Input name="longName" id="longName" value={this.props.longName} label="Module Name" type="text" help="This is a required text input." required/>
						<Textarea rows={3} cols={40} name="instructions" label="Instructions" value={this.props.instructions}/>
						<div></div>
					</fieldset>
					<div><p>Questions</p>
						<div>
							<pre style={{height: "100px", whiteSpace: "normal"}}>
								{this.props.questions}
							</pre>
						</div>
					</div>
					{this.props.children}

				</Form> </Col> </Row>
		);
	}
}

FormModuleForm.defaultProps = {
	longName:     "",
	instructions: ""
};

FormModuleForm.propTypes = {
	longName:         PropTypes.string,
	instructions:     PropTypes.string,
	mainHeadingTitle: PropTypes.string
};