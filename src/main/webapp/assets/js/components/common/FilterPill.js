import React, {Component, PropTypes} from 'react';
import {Glyphicon} from 'react-bootstrap';

export default class FilterPill extends Component {
	constructor(props) {
		super(props);
		this.closeCallback = this.closeCallback.bind(this);
	}
	
	closeCallback() {
		let callbackData = this.props.text;
		if (this.props.item) {
			callbackData = this.props.item;
		}
		this.props.closeButtonCallback(callbackData);
	}
	
	renderText() {
		if (this.props.clickCallback) {
			return (
					<div className="filterPillText">
						<button type="button" onClick={this.props.clickCallback} className="btn btn-link">{this.props.text}</button>
					</div>
			);
		}
		else {
			return (
					<div className="filterPillText">
						{this.props.text}
					</div>
			);
		}
	}
	
	render() {
		if (this.props.text) {
			return (
				<div className="filterPill">
					{
						this.renderText()
					}
					<button type="button" onClick={this.closeCallback} className="btn btn-link btn-remove">
						<Glyphicon glyph="remove"/>
					</button>
					<div className="clearfix" />
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

FilterPill.propTypes = {
	text:					PropTypes.string,
	item:					PropTypes.object,
	clickCallback: 			PropTypes.func,
	closeButtonCallback:	PropTypes.func
};