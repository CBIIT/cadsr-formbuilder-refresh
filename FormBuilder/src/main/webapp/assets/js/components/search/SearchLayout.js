/**
 * Created by nmilos on 10/14/16.
 */
import React, {Component, PropTypes} from 'react';
import {Input, Select, Checkbox} from 'formsy-react-components';
import {Link} from 'react-router';
import ENDPOINT_URLS from '../../constants/ENDPOINT_URLS';
import Form from '../common/Form';
import EVENTS from '../../constants/EVENTS';
import {searchChannel} from '../../channels/radioChannels';
import ProtocolSelectModal from '../modals/ProtocolSelectModal';
import ClassificationSelectModal from '../modals/ClassificationSelectModal';
import SearchResultsCollection from '../../models/search/form-search/SearchResultsCollection';
import TABLECONFIG from '../../constants/TABLE_CONFIGS';
import Datatable from '../tables/Datatable';
import FilterPill from '../common/FilterPill.js';

export default class SearchLayout extends Component {
	constructor(props){
		super(props);
		this.dispatchFormData = this.dispatchFormData.bind(this);
		this.renderLeft = this.renderLeft.bind(this);
		this.renderMiddle = this.renderMiddle.bind(this);
		this.renderResults = this.renderResults.bind(this);
		this.renderFormItems = this.renderFormItems.bind(this);
		this.getOptions = this.getOptions.bind(this);
		this.resetForm = this.resetForm.bind(this);
		this.openProtocolsModal = this.openProtocolsModal.bind(this);
		this.closeProtocolsModal = this.closeProtocolsModal.bind(this);
		this.openClassificationModal = this.openClassificationModal.bind(this);
		this.closeClassificationModal = this.closeClassificationModal.bind(this);
		this.selectProtocolCallback = this.selectProtocolCallback.bind(this);
		this.selectClassificationCallback = this.selectClassificationCallback.bind(this);
		this.removeProtocolPill = this.removeProtocolPill.bind(this);
		this.removeClassificationPill = this.removeClassificationPill.bind(this);
		this.state = {
			contexts: [],
			workflows: [],
			categories: [],
			types: [],
			tableData : [],
			selectedWorkflow: '',
			selectedCategory: '',
			selectedType: '',
			selectedContextID: '',
			validatePristine: false,
			excludeTest: true,
			latestVersions: true,
			excludeTraining: true,
			protocolModalOpen: false,
			classificationModalOpen: false,
			selectedProtocol: "",
			selectedClassification: ""
		};
	}

	componentDidMount(){
		const urls = [ENDPOINT_URLS.CATEGORIES, ENDPOINT_URLS.CONTEXTS, ENDPOINT_URLS.TYPES, ENDPOINT_URLS.WORKFLOWS];
		let promises = urls.map(url => fetch(url).then(response => response.json()));
		Promise.all(promises).then(results => {
			this.setState({
				contexts: results[1],
				categories: results[0],
				types: results[2],
				workflows: results[3]
			});
		});
		
		searchChannel.reply(EVENTS.SEARCH.RESULTS_COLLECTION_RESET, function(searchResultsCollection) {
			this.showResults(searchResultsCollection);
		}, this);

	}
	componentWillReceiveProps(nextProps){
		//console.log('WillReceiveProps');
	}
	componentWillUpdate(nextProps, nextState) {

	}
	componentWillUnmount(){
		//backboneReact.off(this);
	}
	
	updateCheckBoxes(which){
		if(which == 'training'){
			this.setState({
				excludeTraining : !this.state.excludeTraining
			});
		}
		else if(which == 'latest'){
			this.setState({
				latestVersions : !this.state.latestVersions
			});
		}
		else{
			this.setState({
				excludeTest : !this.state.excludeTest
			});
		}
	}
	
	getOptions(options, optionKey){

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
		mappedOptions.unshift({value: '', label: 'Select...'});
		return mappedOptions;
	}
	dispatchFormData(data){
		searchChannel.request(EVENTS.SEARCH.SEND_SEARCH_INPUTS, data);
	}
	
	showResults(collection) {
		this.setState({
			tableData: collection.toJSON()
		});
	}
	
	openProtocolsModal() {
		this.setState({
			protocolModalOpen: true
		});
	}
	
	closeProtocolsModal() {
		this.setState({
			protocolModalOpen: false
		});
	}
	
	openClassificationModal() {
		this.setState({
			classificationModalOpen: true
		});
	}
	
	closeClassificationModal() {
		this.setState({
			classificationModalOpen: false
		});
	}
	
	resetForm(){
		this.refs.form.refs.form.reset(); //javascript is fun
	}
	
	selectProtocolCallback(itemRow) {
		this.setState({
			selectedProtocol: itemRow
		});
	}
	
	selectClassificationCallback(itemRow) {
		this.setState({
			selectedClassification: itemRow
		});
	}
	
	removeProtocolPill() {
		this.setState({
			selectedProtocol: ""
		});
	}
	
	removeClassificationPill() {
		this.setState({
			selectedClassification: ""
		});
	}

	renderFormItems(){
		return(
		<Form id="searchForm" ref="form" onSubmit={this.dispatchFormData} validatePristine={this.state.validatePristine} className="search-form">
			<div className="formItem">
				<Input name="formLongName" id="longName"
					label="FORM LONG NAME" type="text" value=""
				/>
			</div>
			<div className="clearfix formColumns">
				<div className="pull-left formColumn">
					<div className="formItem">
						<Input name="publicId" id="publicId"
							label="PUBLIC ID" type="text"
						/>
					</div>
					<div className="formItem">
						<Input name="classificationIdSeq" 
							id="classification"
							label="CS / CSI" 
							type="text" 
							onClick={this.openClassificationModal}  


							value={this.state.selectedClassification.csCsiIdseq}
							className="hidden"
							readOnly="readOnly"
						/>
						<FilterPill text={this.state.selectedClassification.csName} closeButtonCallback={this.removeClassificationPill} />
						<div className="clearfix" />
						<button type="button" onClick={() =>{this.openClassificationModal();}} className="btn btn-link align-left">SEARCH FOR CLASSIFICATION</button>
					</div>
					<div className="formItem">
						<Select name="contextIdSeq" label="CONTEXT" options={this.getOptions(
							this.state.contexts, 'key'
						)} value={this.state.selectedContextID}/>
					</div>
					<div className="formItem">
						<Select name="workflow" label="WORKFLOW STATUS" options={this.getOptions(
							this.state.workflows
						)} value={this.state.selectedWorkflow}/>
					</div>
				</div>
				<div className="pull-right formColumn">
					<div className="formItem">
						<Input name="cdePublicId" id="cdePublicId"
							label="CDE Public ID" type="text"
						/>
					</div>
					<div className="formItem">
						<Input name="protocolIdSeq" 
							id="protocolLongName"
							label="PROTOCOL" 
							type="text"
							onClick={this.openProtocolsModal} 
							value={this.state.selectedProtocol.protoIdseq}
							className="hidden"
							readOnly="readOnly"
						/>
						<FilterPill text={this.state.selectedProtocol.longName} closeButtonCallback={this.removeProtocolPill} />
						<div className="clearfix" />
						<button type="button" onClick={() =>{this.openProtocolsModal();}} className="btn btn-link align-left">SEARCH FOR PROTOCOL</button>
					</div>
					<div className="formItem">
						<Select name="categoryName" label="CATEGORY" options={this.getOptions(
							this.state.categories
						)} value={this.state.selectedCategory}/>
					</div>
					<div className="formItem">
						<Select name="type" label="TYPE" options={this.getOptions(
							this.state.types
						)} value={this.state.selectedType}/>
					</div>
				</div>
			</div>
			<div className="formItem">
				<Input name="moduleLongName" id="moduleLongName"
					label="MODULE INPUT" type="text"
				/>
			</div>
			<div className="formItem searchActions">
				<div className="formItem--row">
					{/*<input type="checkbox"
					       onClick={ () => {this.updateCheckBoxes('latest')}}
					       checked={this.state.latestVersions}
					       className="formItem-input"
					       id="Latest"/>
					<label for="Latest" className="formItem-label">LATEST VERSIONS ONLY</label>*/}
					<Checkbox
						name="latestVersion"
						value={this.state.latestVersions}
						label="LATEST VERSIONS ONLY"
					/>
				</div>
				<div className="formItem--row">
					{/*<input type="checkbox"
					       checked={this.state.excludeTest}
					       className="formItem-input"
					       onClick={ () => {this.updateCheckBoxes('test')}}
					       id="Test"/>
					<label for="Test" className="formItem-label">EXCLUDE TEST</label>*/}
					<Checkbox
						name="TEST"
						value={this.state.excludeTest}
						label="EXCLUDE TEST"
						/>
				</div>
				<div className="formItem--row">
					{/*<input type="checkbox"
					       checked={this.state.excludeTraining}
					       onClick={ () => {this.updateCheckBoxes('training')}}
					       className="formItem-input"
					       id="Training"/>
					<label for="Training" className="formItem-label">EXCLUDE TRAINING</label>*/}
					<Checkbox
						name="Training"
						value={this.state.excludeTraining}
						label="EXCLUDE TRAINING"
					/>
				</div>
				<div className="formItem--row formItem-reset">
					<button type="button" onClick={() =>{this.resetForm();}} className="btn btn-link">CLEAR ALL</button>
				</div>
				<div className="formItem--row formItem-submit">
					<button type="submit" value="Submit" id="search-button" className="btn btn-primary">SEARCH</button>
				</div>
			</div>
		</Form>
		);
	}

	/**
	 *
	 * @returns {boolean}
	 */
	renderLeft(){
		return(
			<div className="search-left">
				<h3 className="search-subtitle">FORM DIRECTORY</h3>
				<p className="search-desc">
					Use the Form Directory to browse and view all existing forms in the database.
				</p>
				<div className="panel">
					<p className="panel-temp">
						<em>Coming soon...</em>
					</p>
				</div>
			</div>
		);
	}
	renderMiddle(){
		return(
			<div>
				<div id="search-form-wrapper" className="search-middle">
	
					<h3 className="search-subtitle">FORM SEARCH</h3>
					<p className="search-desc">
						Form Search to find and view forms. The Wildcard character is " * ".
					</p>
					{
						this.renderFormItems()
					}
	
				</div>
				<div className="clearfix" />
			</div>
		);
	}
	renderResults(){
		
		let pageName = "Search Results";
		let columnConfig = TABLECONFIG.SEARCH_FORM;
		let resultsText = "TOTAL RESULTS: ";
		
		if(this.state.tableData.length) {
			return (
				<div>
					<h1 className="text--bold">{pageName}</h1>
					<Datatable pagination={true} perPage={100} pageName={pageName} resultsText={resultsText} displayControls={false} showCheckboxes={false} columnTitles={columnConfig} data={this.state.tableData}></Datatable>
				</div>
			);
		}
	}

	render(){
		return (
			<div id="search">
				<div className="clearfix">
					<h2 className="search-title">FormBuilder</h2>
					<Link className="create-new-form-button btn btn-primary" to="/form/create">Create a New Form</Link>
				</div>
				<hr className="panel-divider"/>
				<div className="clearFix">
					{
						this.renderLeft()
					}
					{
						this.renderMiddle()
					}
				</div>

				<div id="search-results-wrapper">
					{
						this.renderResults()
					}
				</div>
				<ProtocolSelectModal isOpen={this.state.protocolModalOpen} closeButtonClicked={this.closeProtocolsModal} data={[]} selectionCallback={this.selectProtocolCallback} />
				<ClassificationSelectModal isOpen={this.state.classificationModalOpen} closeButtonClicked={this.closeClassificationModal} data={[]} selectionCallback={this.selectClassificationCallback} />
			</div>
		);
	}
}

SearchLayout.propTypes = {
};
