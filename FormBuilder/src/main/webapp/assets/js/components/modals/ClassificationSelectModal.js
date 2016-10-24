import React, {Component, PropTypes} from 'react';
import {Modal, Button} from 'react-bootstrap';
import Form from '../common/Form';
import {Input} from 'formsy-react-components';
import {searchChannel} from '../../channels/radioChannels';
import EVENTS from '../../constants/EVENTS';
import TABLECONFIG from '../../constants/TABLE_CONFIGS';
import Datatable from '../tables/Datatable';

export default class ClassificationSelectModal extends Component {
	constructor(props){
		super(props);
		
		this.dispatchFormData = this.dispatchFormData.bind(this);
		
		this.state = {
			tableData : []
		};
	}
	
	componentDidMount() {
		searchChannel.reply(EVENTS.SEARCH.CLASSIFICATION_COLLECTION_RESET, function(classificationCollection) {
			this.showResults(classificationCollection);
		}, this);
	}
	
	dispatchFormData(data){
		searchChannel.request(EVENTS.SEARCH.CLASSIFICATIONS_SEARCH_INPUTS, data);
	}
	
	showResults(collection) {
		this.setState({
			tableData: collection.toJSON()
		});
	}

	render(){
		let pageName = "Classification"; //page name used to display title and configure which columns to display
		let columnConfig = TABLECONFIG.SEARCH_CLASSIFICATION;
		
		return (
			<div>
				<Modal show={this.props.isOpen} onHide={this.close} aria-labelledby="modal-cancel-edit-form" bsSize="large">
					<Modal.Header>
					<div>
					<Form id="classificationForm" ref="form" onSubmit={this.dispatchFormData} className="search-form">
						<div>
							<Input 
								name="classificationKeyword" 
								id="classificationKeyword" 
								type="text"
								label="CLASSIFICATIONS" 
								placeholder="Search by CS, CSI Name and Definition"
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
					<Datatable pagination={true} perPage={100} pageName={pageName} columnTitles={columnConfig} data={this.state.tableData} displayControls={false} showCheckboxes={false} />
					</Modal.Body> 
					<Modal.Footer> 
						<div>
							RESULTS: {this.state.tableData.length}
						</div>
						<Button onClick={this.props.closeButtonClicked}>close</Button>
					</Modal.Footer> </Modal>
			</div>
		);
	}

}

ClassificationSelectModal.propTypes = {
	closeButtonClicked: PropTypes.func,
	isOpen:              PropTypes.bool,
	resultCount: 		PropTypes.number
};