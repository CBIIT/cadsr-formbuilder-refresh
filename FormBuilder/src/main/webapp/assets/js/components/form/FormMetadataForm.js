import React, {Component, PropTypes} from 'react';
import {Grid, Col, Row, FormGroup, ControlLabel, FormControl} from 'react-bootstrap';
import {Input, Textarea, Select, RadioGroup} from 'formsy-react-components';
import EVENTS from '../../constants/EVENTS';
import formActions from '../../constants/formActions';
import {formChannel} from '../../channels/radioChannels';
import Form from '../common/Form';
import {GetFormMetadataCriteriaInputOptions} from '../../commands/GetFormMetadataCriteriaCommand';
import ProtocolSelectModal from '../modals/ProtocolSelectModal';
import ClassificationSelectModal from '../modals/ClassificationSelectModal';
import FilterPill from '../common/FilterPill';

export default class FormMetadataForm extends Component {
	constructor(props){
		super(props);
		this.handleValueChanged = this.handleValueChanged.bind(this);
		this.getOptions = this.getOptions.bind(this);
		this.dispatchData = this.dispatchData.bind(this);
		this.closeProtocolsModal = this.closeProtocolsModal.bind(this);
		this.closeProtocolsModal = this.closeProtocolsModal.bind(this);
		this.selectProtocolCallback = this.selectProtocolCallback.bind(this);
		this.removeProtocolPill = this.removeProtocolPill.bind(this);
		this.renderProtocolPills = this.renderProtocolPills.bind(this);
		this.openClassificationModal = this.openClassificationModal.bind(this);
		this.closeClassificationModal = this.closeClassificationModal.bind(this);
		this.selectClassificationCallback = this.selectClassificationCallback.bind(this);
		this.removeClassificationPill = this.removeClassificationPill.bind(this);
		this.renderClassificationPills = this.renderClassificationPills.bind(this);

		// Default state
		this.state = {
			validatePristine:        false,
			contexts:                [],
			categories:              [],
			types:                   [],
			workflows:               [],
			protocolModalOpen:       false,
			selectedProtocol:        [],		// array of objects of form: {name: "", seqId: ""}
			classificationModalOpen: false,
			selectedClassifications:  []	// array of objects of form: {name: "", seqId: ""}
		};
	}

	componentWillMount(){
		if(this.props.formMetadata.protocols != null && this.props.formMetadata.protocols.length > 0){
			let loadProtocols = this.props.formMetadata.protocols;
			this.setState({
				selectedProtocols: loadProtocols
			});
		}
		if(this.props.formMetadata.classifications != null && this.props.formMetadata.classifications.length > 0){
			let loadClassifications = this.props.formMetadata.classifications;
			this.setState({
				selectedClassifications: loadClassifications
			});
		}
	}

	componentDidMount(){
		GetFormMetadataCriteriaInputOptions().then((formMetaDataDropdownOptions) =>{
			this.setState({
				contexts:   formMetaDataDropdownOptions.contexts,
				categories: formMetaDataDropdownOptions.categories,
				types:      formMetaDataDropdownOptions.types,
				workflows:  formMetaDataDropdownOptions.workflows
			});
		});
	}
	/**
	 *
	 * @param formInputData - data already captured by another method, or grab the html form input values in cases where
	 * dispatchData isn't called in
	 * response to a submit or input value change
	 * @param selectedProtocols
	 * @param selectedClassifications
	 */
	dispatchData({formInputData = this.refs.formMetata.refs.form.getModel(), selectedProtocols = this.state.selectedProtocols, selectedClassifications = this.state.selectedClassifications}){

		/* We need to get both conteIdseq and name of the context object */
		const context = _.find(this.state.contexts, (item) =>{
			return item.conteIdseq === formInputData.conteIdseq;
		});
		const newData = Object.assign({}, _.omit(formInputData, "conteIdseq"), {
			context:         _.omit(context, "description"),
			protocols:       selectedProtocols,
			classifications: selectedClassifications
		});

		formChannel.request(EVENTS.FORM.SET_CORE_FORM_DETAILS, newData);
	}

	handleValueChanged(currentValues, isChanged){
		/* We're not saving to model onChange when create a form. That happens only onSubmit */
		if(this.props.actionMode === formActions.VIEW_FORM_METADATA && isChanged){
			this.dispatchData({formInputData: currentValues});
		}
	}

	/* TODO Update uiInputHelpers.getOptions to use this API, and  use uiInputHelpers instead */
	getOptions(options, optionKey, includeSelect){
		let mappedOptions = [];
		if(typeof optionKey === 'undefined'){
			mappedOptions = options.map((item) =>{
				return {value: item, label: item};
			});
		}
		else{
			mappedOptions = options.map((item) =>{
				return {value: item.conteIdseq, label: item.name};
			});
		}
		/* Add a default item */
		if(typeof includeSelect === "undefined" || includeSelect){
			mappedOptions.unshift({value: '', label: 'Select...'});
		}
		return mappedOptions;
	}

	openProtocolsModal(){
		this.setState({
			protocolModalOpen: true
		});
	}

	closeProtocolsModal(){
		this.setState({
			protocolModalOpen: false
		});
	}

	selectProtocolCallback(itemRow){
		const selectedItem = {
			protoIdseq: itemRow.protoIdseq,
			longName:   itemRow.longName
		};
		const currentSelectedItemsList = this.state.selectedProtocols;
		const newSelectedItemsList = currentSelectedItemsList.concat(selectedItem);
		this.setState({
			selectedProtocols: newSelectedItemsList
		});
		this.dispatchData({selectedProtocols: newSelectedItemsList});
	}
	removeProtocolPill(item){
		let index = this.findProtocolInSelected(item);
		if(index > -1){
			let newData = this.state.selectedProtocols.slice();
			newData.splice(index, 1);
			this.setState({
				selectedProtocols: newData
			});
			this.dispatchData({selectedProtocols: newData});
		}
	}
	findProtocolInSelected(item){
		let set = this.state.selectedProtocols;
		let length = set.length;
		for(let i = 0; i < length; i++){
			if(set[i].protoIdseq == item.protoIdseq){
				return i;
			}
		}
		return -1;
	}

	getWorFlowField(){
		if(this.props.actionMode === formActions.CREATE_FORM){
			return (
				<FormGroup> <ControlLabel>WORKFLOW STATUS</ControlLabel>
					<FormControl.Static>{this.props.formMetadata.workflow}</FormControl.Static> </FormGroup>
			);
		}
		else{
			return (
				<Select name="workflow" label="WORKFLOW STATUS" options={this.getOptions(
					this.state.workflows
				)} value={this.props.formMetadata.workflow}/>
			);
		}
	}

	renderProtocolPills(){
		let set = this.state.selectedProtocols;
		let length = set.length;
		let output = [];

		for(let i = 0; i < length; i++){
			output.push(
				<FilterPill key={i} item={set[i]} text={set[i].longName} closeButtonCallback={this.removeProtocolPill}/>
			);
		}

		return output;
	}

	openClassificationModal(){
		this.setState({
			classificationModalOpen: true
		});
	}

	closeClassificationModal(){
		this.setState({
			classificationModalOpen: false
		});
	}
	selectClassificationCallback(itemRow){
		const selectedItem = {
			csCsiIdseq:          itemRow.csCsiIdseq,
			classSchemeLongName: itemRow.csName
		};
		const currentSelectedItemsList = this.state.selectedClassifications;
		const newSelectedItemsList = currentSelectedItemsList.concat(selectedItem);
		this.setState({
			selectedClassifications: newSelectedItemsList
		});
		this.dispatchData({selectedClassifications: newSelectedItemsList});
	}
	removeClassificationPill(item){
		let index = this.findClassificationInSelected(item);
		if(index > -1){
			let newData = this.state.selectedClassifications.slice();
			newData.splice(index, 1);
			this.setState({
				selectedClassifications: newData
			});
			this.dispatchData({selectedClassifications: newData});
		}
	}
	findClassificationInSelected(item){
		let set = this.state.selectedClassifications;
		let length = set.length;
		for(let i = 0; i < length; i++){
			if(set[i].classSchemeLongName == item.classSchemeLongName){
				return i;
			}
		}
		return -1;
	}

	renderClassificationPills(){
		let set = this.state.selectedClassifications;
		let length = set.length;
		let output = [];
		for(let i = 0; i < length; i++){
			output.push(
				<FilterPill key={i} item={set[i]} text={set[i].classSchemeLongName} closeButtonCallback={this.removeClassificationPill}/>
			);
		}
		return output;
	}

	renderClassifications(){
		if(this.props.actionMode !== formActions.CREATE_FORM){
			return (
				<Row> <Col sm={12} className="hideFormGroup">
					<ControlLabel>CLASSIFICATIONS</ControlLabel> {this.renderClassificationPills()}
					<button type="button" onClick={() =>{
						this.openClassificationModal();
					}} className="btn-link align-left">SEARCH FOR CLASSIFICATION
					</button>
				</Col> </Row>
			);
		}
	}

	render(){
		if(this.state.contexts.length){
			return (
				<Grid fluid={true}> <Row>
					<Form onChange={this.handleValueChanged} onSubmit={this.dispatchData} id="editForm" validatePristine={this.state.validatePristine} disabled={this.props.disabled} ref="formMetata" layout="vertical">
						<fieldset name={this.props.mainHeadingTitle}>
							<legend>{this.props.mainHeadingTitle}</legend>
							<Row> <Col sm={10}>
								<Input value={this.props.formMetadata.longName} name="longName" id="longName" label="LONG NAME" type="text" placeholder="This field is required." required/>
							</Col> <Col sm={2}> <FormGroup> <ControlLabel>VERSION</ControlLabel>
								<FormControl.Static>{this.props.formMetadata.version}</FormControl.Static> </FormGroup>
							</Col> </Row> <Row> <Col sm={12} className="hideFormGroup">
							<ControlLabel>PROTOCOL</ControlLabel>
							<div className="pillContainer">
								{this.renderProtocolPills()}
							</div>
							<div className="clearfix"/>
							<button type="button" onClick={() =>{
								this.openProtocolsModal();
							}} className="btn-link align-left">SEARCH FOR PROTOCOL
							</button>
						</Col> </Row>

							{this.renderClassifications()}

							<Row> <Col sm={12}>
								<Textarea value={this.props.formMetadata.preferredDefinition} rows={3} cols={40} name="preferredDefinition" label="DEFINITION" placeholder="This field is required." required/>
							</Col> </Row> <Row> <Col sm={6}>
							<Select name="conteIdseq" label="CONTEXT" options={this.getOptions(this.state.contexts, 'key')} value={this.props.formMetadata.context.conteIdseq} required/>
						</Col> <Col sm={6}>
							<Select name="formCategory" label="CATEGORY" options={this.getOptions(this.state.categories)} value={this.props.formMetadata.formCategory}/>
						</Col> </Row> <Row> <Col sm={6}>
							{this.getWorFlowField()}
						</Col> <Col sm={6}>
							<RadioGroup name="formType" label="TYPE" options={this.getOptions(this.state.types, undefined, false)} value={this.props.formMetadata.formType} type="inline" required/>
						</Col> </Row> <Row> <Col sm={12}>
							<Textarea value={this.props.formMetadata.headerInstructions} rows={3} cols={40} name="headerInstructions" label="HEADER INSTRUCTION"/>
						</Col> </Row> <Row> <Col sm={12}>
							<Textarea value={this.props.formMetadata.footerInstructions} rows={3} cols={40} name="footerInstructions" label="FOOTER INSTRUCTION"/>
						</Col> </Row>

						</fieldset>
						{this.props.children}
					</Form>
					<ProtocolSelectModal isOpen={this.state.protocolModalOpen} closeButtonClicked={this.closeProtocolsModal} data={[]} selectionCallback={this.selectProtocolCallback}/>
					<ClassificationSelectModal isOpen={this.state.classificationModalOpen} closeButtonClicked={this.closeClassificationModal} data={[]} selectionCallback={this.selectClassificationCallback}/>
				</Row> </Grid>
			);
		}
		else return (
			<div />
		);
	}
}

FormMetadataForm.defaultProps = {
	mainHeadingTitle: "Edit Form"
};

FormMetadataForm.propTypes = {
	disabled:         PropTypes.bool,
	mainHeadingTitle: PropTypes.string.isRequired,
	children:         PropTypes.node,
	actionMode:       PropTypes.string,
	formMetadata:     PropTypes.object.isRequired
};
