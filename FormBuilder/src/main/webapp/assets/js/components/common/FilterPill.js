import React, {Component, PropTypes} from 'react';
import {Glyphicon} from 'react-bootstrap';

export default class FilterPill extends Component {
	constructor(props) {
		super(props);
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
		if (this.props.text != "") {
			return (
				<div className="filterPill">
					{
						this.renderText()
					}
					<button type="button" onClick={this.props.closeButtonCallback} className="btn btn-link btn-remove">
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
	clickCallback: 			PropTypes.func,
	closeButtonCallback:	PropTypes.func
};