import React, {Component, propTypes} from 'react';
import {Col, Row, Button} from 'react-bootstrap';
import {Input, Textarea} from 'formsy-react-components';
import EVENTS from '../../constants/EVENTS';
import {formChannel} from '../../channels/radioChannels';
import Form from '../common/Form';

export default class FormModuleForm extends Component {
	constructor(props){
		super(props);
		this.dispatchSave = this.dispatchSave.bind(this);
		// Default state
		this.state = {
			validatePristine: false,
			disabled:         false
		};
	}
	dispatchSave(data){
		formChannel.trigger(EVENTS.FORM.CREATE_MODULE, data);
	}

	render(){
		return (
			<Row>
				<Form onSubmit={this.submitForm} layout={this.state.layout} validatePristine={this.state.validatePristine} disabled={this.state.disabled} ref="myform">
					<fieldset name="Module Metadata">
						<legend>Module Metadata</legend>
						<Input name="name" id="name" value="" label="Module Name" type="text" help="This is a required text input." required/>
						<Textarea rows={3} cols={40} name="instructions" label="Instructions" placeholder="This field requires 3 characters." validations="minLength:3" validationErrors={{
							minLength: 'Please provide at least 3 characters.'
						}}/>
{/*
						<List data={this.props.data} />
*/}
					</fieldset>
					<Button className="btn btn-primary" type="submit">Save</Button>

				</Form> </Row>
		);
	}
}