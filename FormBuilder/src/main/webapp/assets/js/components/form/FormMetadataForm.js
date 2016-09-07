import React, {Component, PropTypes} from 'react';
import {Col, Row, Button, FormGroup, ControlLabel, FormControl} from 'react-bootstrap';
import {Input, Textarea, Select} from 'formsy-react-components';
import EVENTS from '../../constants/EVENTS';
import {formChannel} from '../../channels/radioChannels';
import Form from '../common/Form';

export default class FormMetadataForm extends Component {
	constructor(props){
		super(props);
		this.getOptions = this.getOptions.bind(this);
		this.dispatchData = this.dispatchData.bind(this);
		// Default state
		this.state = {
			validatePristine: false,
			disabled:         false
		};
	}

	dispatchData(data){
		formChannel.request(EVENTS.FORM.SET_CORE_FORM_DETAILS, data);
	}

	/* TODO Move this out to a util */
	getOptions({options, optionKey}){
		let mappedOptions = options.map((item) =>{
			return {value: item.get(optionKey) || item.get("name"), label: item.get("name")};
		});

		/* Add a default item */
		mappedOptions.unshift({value: '', label: 'Select...'});
		return mappedOptions;
	}

	render(){
		return (
			<Row>
				<Form onSubmit={this.dispatchData} validatePristine={this.state.validatePristine} disabled={this.state.disabled} ref="formMetata">
					<fieldset name="Module Metadata">
						<legend>Form Details</legend>
						<Row> <Col sm={6}> <Input name="longName" id="longName" value="" label="
Long Name" type="text" required/>
							<Textarea rows={3} cols={40} name="preferredDefinition" label="Preferred Definition" required/>
							<Textarea rows={3} cols={40} name="headerInstructions" label="Header Instructions"/>
							<Textarea rows={3} cols={40} name="footerInstructions" label="
Footer Instructions"/> </Col> <Col sm={6}>

							<FormGroup> <ControlLabel>Workflow</ControlLabel>
								<FormControl.Static>{this.props.formMetadata.workflow}</FormControl.Static>
							</FormGroup>

							<Select name="conteIdseq" label="Context" options={this.getOptions({
								options:   this.props.uiDropDownOptionsModel.contexts,
								optionKey: 'contextIdSeq'
							})} required/> <Select name="formCategory" label="Category" options={this.getOptions({
							options: this.props.uiDropDownOptionsModel.formCategories
						})} required/> <Select name="formType" label="Type" options={this.getOptions({
							options: this.props.uiDropDownOptionsModel.formTypes
						})} required/> <FormGroup> <ControlLabel>Version</ControlLabel>
							<FormControl.Static>{this.props.formMetadata.version}</FormControl.Static>
						</FormGroup> </Col> </Row>

					</fieldset>
					<Button className="btn btn-primary" type="submit">Save</Button>

				</Form> </Row>
		);
	}
}

FormMetadataForm.propTypes = {
	formMetadata: PropTypes.object.isRequired,
	uiDropDownOptionsModel: PropTypes.object.isRequired
};



