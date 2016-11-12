import React, {Component, PropTypes} from 'react';
import {Modal, Glyphicon} from 'react-bootstrap';
import {searchChannel} from '../../channels/radioChannels';
import EVENTS from '../../constants/EVENTS';
import TABLECONFIG from '../../constants/TABLE_CONFIGS';
import Datatable from '../tables/Datatable';

/* TODO Make reusable component for ProtocolSelectModal and this to remove need for two separate ones */
export default class ProtocolSelectModal extends Component {
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
			protocolKeyword: ""
		});
	}
	
	componentDidMount() {
		searchChannel.reply(EVENTS.SEARCH.PROTOCOLS_COLLECTION_RESET, function(protocolCollection) {
			this.showResults(protocolCollection);
		}, this);
	}
	
	componentWillReceiveProps() {
		if (!this.props.isOpen) {
			this.setState({
				tableData: [],
				protocolKeyword: ""
			});
		}
	}
	
	dispatchFormData(event){
		let data = {
			protocolKeyword: this.state.protocolKeyword
		};
		searchChannel.request(EVENTS.SEARCH.PROTOCOLS_SEARCH_INPUTS, data);
		event.preventDefault();
	}
	
	handleFormChange(event) {
		this.setState({protocolKeyword: event.target.value});
	}
	
	showResults(protocolCollection) {
		this.setState({
			tableData: protocolCollection
		});
	}
	
	dispatchSelection(title, item) {
		this.props.closeButtonClicked();
		this.props.selectionCallback(item);
	}
	
	render(){
		let pageName = "Protocol"; //page name used to display title and configure which columns to display
		let columnConfig = TABLECONFIG.SEARCH_PROTOCOL;
		
		return (
			<div>
				<Modal show={this.props.isOpen} aria-labelledby="modal-cancel-edit-form" dialogClassName="modal-xl modal-dialog">
					<Modal.Header>
					<div>
					<form id="protocolForm" ref="form" onSubmit={this.dispatchFormData} className="search-form">
						<div>
							<div className="col-md-3">
								<label className="control-label" data-required="false" htmlFor="protocolKeyword">
									PROTOCOL
								</label>
							</div>
							<div className="col-md-7">
								<input type="text" value={this.state.protocolKeyword} onChange={this.handleFormChange} id="protocolKeyword" className="form-control" name="protocolKeyword" placeholder="Search by Long and Short Name" />
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

ProtocolSelectModal.propTypes = {
	closeButtonClicked: PropTypes.func,
	isOpen:              PropTypes.bool,
	resultCount: 		PropTypes.number,
	selectionCallback:	PropTypes.func
};