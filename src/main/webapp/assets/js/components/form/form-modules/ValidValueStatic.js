import React, {Component, PropTypes} from 'react';
import {Row, Col} from 'react-bootstrap';
import FormItemToolbar from './FormItemToolbar';

export default class ValidValueStatic extends Component{
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<Row className="top-margin bottom-margin bordered">
				{/*<Col md={1}>
				 <div className="module-side">
				 </div>
				 </Col>\*/}
				<Col md={12}>
					<div className="center-v-spread-h">
						<h5>{this.props.validValue.longName}</h5>
						<FormItemToolbar itemType="Valid Value" dispatchRemoveItem={this.dispatchRemoveValidValue} shouldDisplayRemoveItem={this.props.shouldDisplayRemoveItem} />
					</div>
					<ul className="list-unstyled">
						<li>
							Form Value Meaning Text: {this.props.validValue.formValueMeaningText}
						</li>
						<li>
							Form Value Meaning Public ID Version: {this.props.validValue.formValueMeaningIdVersion}
						</li>
						<li>
							Form Value Meaning Desc: {this.props.validValue.formValueMeaningDesc}
						</li>
					</ul>
				</Col>
			</Row>
		);
	}
};


ValidValueStatic.protypes = {
	validValue: PropTypes.object,
	shouldDisplayRemoveItem: PropTypes.bool
};