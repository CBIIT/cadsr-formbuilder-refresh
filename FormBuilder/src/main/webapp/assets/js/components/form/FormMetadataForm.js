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
			validatePristine: false
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
				<Form onSubmit={this.dispatchData} validatePristine={this.state.validatePristine} disabled={this.props.disabled} ref="formMetata">
					<fieldset name={this.props.mainHeadingTitle}>
						<legend>{this.props.mainHeadingTitle}</legend>
						<Row> <Col sm={6}>
							<Input value={this.props.formMetadata.longName} name="longName" id="longName" label="
Long Name" type="text" required/>
							<Textarea value={this.props.formMetadata.preferredDefinition} rows={3} cols={40} name="preferredDefinition" label="Preferred Definition" required/>
							<Textarea value={this.props.formMetadata.headerInstructions} rows={3} cols={40} name="headerInstructions" label="Header Instructions"/>
							<Textarea value={this.props.formMetadata.footerInstructions} rows={3} cols={40} name="footerInstructions" label="
Footer Instructions"/> </Col> <Col sm={6}>

							<FormGroup> <ControlLabel>Workflow</ControlLabel>
								<FormControl.Static>{this.props.formMetadata.workflow}</FormControl.Static> </FormGroup>

							<Select name="conteIdseq" label="Context" options={this.getOptions({
								options:   this.props.uiDropDownOptionsModel.contexts,
								optionKey: 'contextIdSeq'
							})} value={this.props.formMetadata.context.conteIdseq} required/>
							<Select name="formCategory" label="Category" options={this.getOptions({
							options: this.props.uiDropDownOptionsModel.formCategories
							})} value={this.props.formMetadata.formCategory}/>
							<Select name="formType" label="Type" options={this.getOptions({
							options: this.props.uiDropDownOptionsModel.formTypes
						})} value={this.props.formMetadata.formType} required/> <FormGroup>
							<ControlLabel>Version</ControlLabel>
							<FormControl.Static>{this.props.formMetadata.version}</FormControl.Static> </FormGroup>
						</Col> </Row>

					</fieldset>
					{this.props.children}

				</Form> </Row>
		);
	}
}

FormMetadataForm.defaultProps = {
	mainHeadingTitle: "Edit Form"
};

FormMetadataForm.propTypes = {
	mainHeadingTitle:       PropTypes.string.isRequired,
	children:               PropTypes.node,
	actionMode:             PropTypes.string,
	formMetadata:           PropTypes.object.isRequired,
	uiDropDownOptionsModel: PropTypes.object.isRequired
};



