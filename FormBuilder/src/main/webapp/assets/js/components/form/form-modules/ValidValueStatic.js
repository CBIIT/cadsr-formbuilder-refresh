import React, {Component, PropTypes} from 'react';
import {Row, Col} from 'react-bootstrap';
import EVENTS from '../../../constants/EVENTS';
import {formChannel} from '../../../channels/radioChannels';
import FormItemToolbar from './FormItemToolbar';

export default class ValidValueStatic extends Component{
	constructor(props){
		super(props);
		this.dispatchRemoveValidValue = this.dispatchRemoveValidValue.bind(this);
	}
	dispatchRemoveValidValue() {
		formChannel.request(EVENTS.FORM.REMOVE_VALID_VALUE, {
			moduleId: this.props.moduleId,
			questionId:  this.props.questionId,
			validValueId:this.props.validValue.cid,
		});
	}
	render() {
		return (
			<Row className="top-margin bottom-margin bordered-bottom">
				{/*<Col md={1}>
				 <div className="module-side">
				 </div>
				 </Col>\*/}
				<Col md={12}>
					<div className="center-v-spread-h">
						<h4 className="bold">{this.props.validValue.longName}</h4>
						<FormItemToolbar itemType="Valid Value" dispatchRemoveItem={this.dispatchRemoveValidValue} shouldDisplayRemoveItem={this.props.shouldDisplayRemoveItem} />
					</div>
					<ul className="list-unstyled">
						<li>
							<label className="validValueStaticWidth">Meaning Text</label> {this.props.validValue.formValueMeaningText}
						</li>
						<li>
							<label className="validValueStaticWidth">Meaning Public ID Version</label> {this.props.validValue.formValueMeaningIdVersion}
						</li>
						<li>
							<label className="validValueStaticWidth">Meaning Desc</label> {this.props.validValue.formValueMeaningDesc}
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