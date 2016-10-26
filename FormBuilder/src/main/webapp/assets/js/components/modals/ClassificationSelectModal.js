import React, {Component, PropTypes} from 'react';
import {Modal, Glyphicon} from 'react-bootstrap';
import {searchChannel} from '../../channels/radioChannels';
import EVENTS from '../../constants/EVENTS';
import TABLECONFIG from '../../constants/TABLE_CONFIGS';
import Datatable from '../tables/Datatable';

export default class ClassificationSelectModal extends Component {
	constructor(props){
		super(props);
		
		this.dispatchFormData = this.dispatchFormData.bind(this);
		this.dispatchSelection = this.dispatchSelection.bind(this);
		this.handleFormChange = this.handleFormChange.bind(this);
		
		this.state = {
			tableData : []
		};
	}
	
	componentWillMount() {
		this.setState({
			classificationKeyword: ""
		});
	}
	
	componentDidMount() {
		searchChannel.reply(EVENTS.SEARCH.CLASSIFICATION_COLLECTION_RESET, function(classificationCollection) {
			this.showResults(classificationCollection);
		}, this);
	}
	
	componentWillReceiveProps() {
		this.setState({
			tableData: [],
			classificationKeyword: ""
		});
	}
	
	dispatchFormData(event){
		let data = {
			classificationKeyword: this.state.classificationKeyword
		};
		searchChannel.request(EVENTS.SEARCH.CLASSIFICATIONS_SEARCH_INPUTS, data);
		event.preventDefault();
	}
	
	handleFormChange(event) {
		this.setState({classificationKeyword: event.target.value});
	}
	
	showResults(collection) {
		this.setState({
			tableData: collection
		});
	}
	
	dispatchSelection(title, id) {
		this.props.closeButtonClicked();
		this.props.selectionCallback(id);
	}

	render(){
		let pageName = "Classification"; //page name used to display title and configure which columns to display
		let columnConfig = TABLECONFIG.SEARCH_CLASSIFICATION;
		
		return (
			<div>
				<Modal show={this.props.isOpen} onHide={this.close} aria-labelledby="modal-cancel-edit-form" dialogClassName="modal-xl modal-dialog">
					<Modal.Header>
					<div>
					<form id="classificationForm" ref="form" onSubmit={this.dispatchFormData} className="search-form">
						<div>
							<div className="col-md-3">
								<label className="control-label" data-required="false" htmlFor="classificationKeyword">
									CLASSIFICATION
								</label>
							</div>
							<div className="col-md-7">
								<input type="text" value={this.state.classificationKeyword} onChange={this.handleFormChange} id="classificationKeyword" className="form-control" name="classificationKeyword" placeholder="Search by CS, CSI Name and Definition" />
							</div>
							<div className="col-md-2 nopadding">
								<button type="submit" className="btn btn-primary">GO</button>
							</div>
						</div>
						<div className="clearfix">
							The Wildcard character is " * ".
						</div>
					</form>
					</div>	
					</Modal.Header> 
					<Modal.Body>
					<Datatable pagination={true} perPage={100} pageName={pageName} columnTitles={columnConfig} data={this.state.tableData} displayControls={false} showCheckboxes={false} clickCallback={this.dispatchSelection} resultsText="RESULTS:" />
					</Modal.Body> 
					<Modal.Footer> 
						<button className="btn btn-link btn-modal-close" onClick={this.props.closeButtonClicked}>
							<Glyphicon glyph="remove" />
						</button>
					</Modal.Footer> </Modal>
			</div>
		);
	}

}

ClassificationSelectModal.propTypes = {
	closeButtonClicked: PropTypes.func,
	isOpen:              PropTypes.bool,
	resultCount: 		PropTypes.number,
	selectionCallback:	PropTypes.func
};