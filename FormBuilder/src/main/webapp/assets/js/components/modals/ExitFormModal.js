import React, {Component, PropTypes} from 'react';
import {Modal, Button} from 'react-bootstrap';

export default class ExitFormModal extends Component {
	constructor(props){
		super(props);
	}

	render(){
		return (
			<div>
				<Modal show={this.props.isOpen} onHide={this.close} aria-labelledby="contained-modal-title" dialogClassName="date-range-modal">
					<Modal.Header>
						<Modal.Title bsClass="h2 no-margin " id="contained-modal-data-range">Exit Form Creation?</Modal.Title>
						<p>If you leave this page, your form will not be saved. When returning to form creation, you will have to fill out the form details again and restart the form creation process.</p>
						<p>Are you sure you want to leave this page?</p>
					</Modal.Header> <Modal.Body>

				</Modal.Body> <Modal.Footer> <Button onClick={this.props.goBackButtonClicked}>Go Back</Button>
					<Button onClick={this.props.leaveFormCLicked}>Leave Form</Button> </Modal.Footer> </Modal>
			</div>
		);
	}
}

ExitFormModal.propTypes = {
	goBackButtonClicked: PropTypes.func,
	isOpen:              PropTypes.bool,
	leaveFormCLicked:    PropTypes.func
};