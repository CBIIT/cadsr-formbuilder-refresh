/**
 * Created by nmilos on 10/14/16.
 */
import React, {Component, PropTypes} from 'react';
import {Input, Select, Checkbox} from 'formsy-react-components';
import ROUTES from '../../constants/ROUTES';
import formRouter from  "../../routers/FormRouter";
import ENDPOINT_URLS from '../../constants/ENDPOINT_URLS';
import Form from '../common/Form';
import EVENTS from '../../constants/EVENTS';
import {searchChannel} from '../../channels/radioChannels';

export default class SearchLayout extends Component {
	constructor(props){
		super(props);
		this.dispatchCreateForm = this.dispatchCreateForm.bind(this);
		this.dispatchFormData = this.dispatchFormData.bind(this);
		this.renderLeft = this.renderLeft.bind(this);
		this.renderMiddle = this.renderMiddle.bind(this);
		this.renderFormItems = this.renderFormItems.bind(this);
		this.getOptions = this.getOptions.bind(this);
		this.resetForm = this.resetForm.bind(this);
		this.state = {
			contexts: [],
			workflows: [],
			categories: [],
			types: [],
			selectedWorkflow: '',
			selectedCategory: '',
			selectedType: '',
			selectedContextID: '',
			validatePristine: false,
			excludeTest: false,
			latestVersions: false,
			excludeTraining: false
		};
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

	}
	componentWillReceiveProps(nextProps){
		console.log('WillReceiveProps');
	}
	componentWillUpdate(nextProps, nextState) {

	}
	componentWillUnmount(){
		//backboneReact.off(this);
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

	dispatchCreateForm () {
		formRouter.navigate(ROUTES.FORM.CREATE_FORM, {trigger: true});
	}

	dispatchFormData(data){
		searchChannel.request(EVENTS.SEARCH.SEND_SEARCH_INPUTS, data);
	}
	resetForm(){
		this.refs.form.refs.form.reset(); //javascript is fun
	}

	renderFormItems(){
		return(
		<Form id="searchForm" ref="form" onSubmit={this.dispatchFormData} validatePristine={this.state.validatePristine} className="search-form">
			<div className="formItem">
				<Input name="longName" id="longName"
				       label="FORM LONG NAME" type="text"
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
						<Input name="classification" id="classification"
						       label="CS / CSI" type="text"
						/>
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
						<Input name="protocolLongName" id="protocolLongName"
						       label="PROTOCOL" type="text"
						/>
					</div>
					<div className="formItem">
						<Select name="categoryName" label="CATEGORY" options={this.getOptions(
							this.state.categories
						)} value={this.state.selectedCategory}/>
					</div>
					<div className="formItem">
						<Select name="WorkFlows" label="TYPE" options={this.getOptions(
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
					<button type="button" onClick={ () =>{ this.resetForm()}} className="btn btn-link">CLEAR ALL</button>
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
			<div id="search-form-wrapper" className="search-middle">

				<h3 className="search-subtitle">FORM SEARCH</h3>
				<p className="search-desc">
					Form Search to find and view forms. The Wildcard character is " * ".
				</p>
				{
					this.renderFormItems()
				}

			</div>
		);
	}

	render(){
		return (
			<div id="search">
				<div className="clearfix">
					<h2 className="search-title">FormBuilder</h2>
					<button className="create-new-form-button btn btn-primary" type="button" onClick={
						() =>{
							this.dispatchCreateForm();
						}
					}>
						Create a New Form
					</button>

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
				</div>
			</div>
		);
	}
}

SearchLayout.propTypes = {
};
