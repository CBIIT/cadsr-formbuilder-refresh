import React, {Component, PropTypes} from 'react';
import {Modal, Button} from 'react-bootstrap';
import EVENTS from '../../constants/EVENTS';
import {appChannel} from '../../channels/radioChannels';

export default class MessageModal extends Component {
	constructor(props){
		super(props);
		this.renderButton = this.renderButton.bind(this);
		this.close = this.close.bind(this);
		
//		this.setState({
//			heading: "",
//			message: "",
//			isOpen: false,
//			button: {
//				label: "",
//				callback: function() {}
//			}
//		});
	}
	
	componentDidMount() {
		appChannel.reply(EVENTS.APP.SHOW_USER_MODAL_MESSAGE, function(config) {
			// merge the button config early so we can wrap the callback
			let buttonConfig = {};
			if (config.button) {
				buttonConfig.label = config.button.label;
				buttonConfig.callback = () => {
					config.button.callback();
					this.close();
				};
			}
			else {
				buttonConfig = null;
			}

			this.setState({
				heading: config.heading || "",
				message: config.message || "",
				isOpen: true,
				button: buttonConfig
			});
		}, this);
		appChannel.reply(EVENTS.APP.HIDE_USER_MODAL_MESSAGE, function() {
			this.close();
		}, this);
	}
	
	renderButton() {
		let button = this.state.button;
		if (!button) {
			return (
				<div />
			);
		}
		else {
			return (
				<Button onClick={this.state.button.callback}>{this.state.button.label}</Button>
			);
		}
		
		
	}
	
	close() {
		this.setState({
			isOpen: false
		});
	}

	render(){
		if (this.state) {
			return (
				<div>
					<Modal show={this.state.isOpen} onHide={this.close} aria-labelledby="modal-cancel-edit-form">
						<Modal.Header>
							<h3>
								{this.state.heading}
							</h3>
						</Modal.Header> 
						<Modal.Body>
							{this.state.message}
						</Modal.Body> 
						<Modal.Footer> 
							{this.renderButton()}
						</Modal.Footer> 
					</Modal>
				</div>
			);
		}
		else {
			return (
				<div />
			);
		}
	}
}

MessageModal.propTypes = {

};