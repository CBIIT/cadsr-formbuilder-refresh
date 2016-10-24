import React, {Component, PropTypes} from 'react';
import {Modal, Button} from 'react-bootstrap';
import Form from '../common/Form';
import {Input} from 'formsy-react-components';
import {searchChannel} from '../../channels/radioChannels';
import EVENTS from '../../constants/EVENTS';
import TABLECONFIG from '../../constants/TABLE_CONFIGS';
import Datatable from '../tables/Datatable';

export default class ProtocolSelectModal extends Component {
	constructor(props){
		super(props);
		
		this.dispatchFormData = this.dispatchFormData.bind(this);
		
		this.state = {
			tableData : []
		};
	}
	
	componentDidMount() {
		searchChannel.reply(EVENTS.SEARCH.PROTOCOLS_COLLECTION_RESET, function(protocolCollection) {
			this.showResults(protocolCollection);
		}, this);
	}
	
	dispatchFormData(data){
		searchChannel.request(EVENTS.SEARCH.PROTOCOLS_SEARCH_INPUTS, data);
	}
	
	showResults(protocolCollection) {
		this.setState({
			tableData: protocolCollection.toJSON()
		});
	}
	
	render(){
		let pageName = "Protocol"; //page name used to display title and configure which columns to display
		let columnConfig = TABLECONFIG.SEARCH_PROTOCOL;
		
		return (
			<div>
				<Modal show={this.props.isOpen} onHide={this.close} aria-labelledby="modal-cancel-edit-form" bsSize="lg">
					<Modal.Header>
					<div>
					<Form id="protocolForm" ref="form" onSubmit={this.dispatchFormData} className="search-form">
						<div>
							<Input 
								name="protocolKeyword" 
								id="protocolKeyword" 
								type="text"
								label="PROTOCOL" 
								placeholder="Search by Long and Short Name"
							/>
							<button type="submit" className="btn btn-primary">GO</button>
						</div>
						<div>
							RESULTS: {this.state.tableData.length}
						</div>
						<div>
							The Wildcard character is " * ".
						</div>
					</Form>
					</div>	
					</Modal.Header> 
					<Modal.Body>
						<Datatable pagination={true} perPage={100} pageName={pageName} columnTitles={columnConfig} data={this.state.tableData} displayControls={false} />
					</Modal.Body> 
					<Modal.Footer> 
						<Button onClick={this.props.closeButtonClicked}>close</Button>
					</Modal.Footer> </Modal>
			</div>
		);
	}
}

ProtocolSelectModal.propTypes = {
	closeButtonClicked: PropTypes.func,
	isOpen:              PropTypes.bool,
	resultCount: 		PropTypes.number
};