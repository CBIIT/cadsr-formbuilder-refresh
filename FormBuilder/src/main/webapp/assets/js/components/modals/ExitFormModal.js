import React, {Component, PropTypes} from 'react';
import {Modal, Button} from 'react-bootstrap';

export default class ExitFormModal extends Component {
	constructor(props){
		super(props);
	}

	render(){
		return (
			<div>
				<Modal show={this.props.isOpen} onHide={this.close} aria-labelledby="modal-cancel-edit-form">
					<Modal.Header>
						<Modal.Title bsClass="h2 no-margin " id="modal-cancel-edit-form">Warning:</Modal.Title>
						<p>By selecting the cancel option, the changes you have made will NOT be saved.</p>
						<p>Select Return to continue editing your Form, or Confirm to leave edit mode.</p>
					</Modal.Header> <Modal.Body>

				</Modal.Body> <Modal.Footer> <Button onClick={this.props.goBackButtonClicked}>Return</Button>
					<Button onClick={this.props.leaveFormCLicked}>Confirm</Button> </Modal.Footer> </Modal>
			</div>
		);
	}
}

ExitFormModal.propTypes = {
	goBackButtonClicked: PropTypes.func,
	isOpen:              PropTypes.bool,
	leaveFormCLicked:    PropTypes.func
};