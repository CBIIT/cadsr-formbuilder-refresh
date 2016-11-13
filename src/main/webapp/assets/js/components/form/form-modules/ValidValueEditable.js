import React, {Component, PropTypes} from 'react';
import {Col, Row} from 'react-bootstrap';
import {Textarea} from 'formsy-react-components';
import FormItemToolbar from './FormItemToolbar';
import EVENTS from '../../../constants/EVENTS';
import {formChannel} from '../../../channels/radioChannels';
import Form from '../../common/Form';

export class ValidValueEditable extends Component{
	constructor(props){
		super(props);
		this.handleValidValueChanged = this.handleValidValueChanged.bind(this);
		this.dispatchRemoveValidValue = this.dispatchRemoveValidValue.bind(this);
		this.state = {
			validatePristine: false
		};
	}
	dispatchRemoveValidValue() {
		formChannel.request(EVENTS.FORM.REMOVE_VALID_VALUE, {
			moduleId: this.props.moduleId,
			questionId:  this.props.questionId,
			validValueId:this.props.validValue.cid,
		});
	}
	handleValidValueChanged(currentValues, isChanged) {
		if(isChanged) {
			/* BE AWARE: Form.onChange returns true unexpectedly. Using isChanged as guard */
			formChannel.trigger(EVENTS.FORM.SET_VALID_VALUE,
				{
					moduleId: this.props.moduleId,
					questionId:  this.props.questionId,
					validValueId:this.props.validValue.cid,
					validValueData: currentValues}
				);
		}
	}
	render() {
			return (
				<Row>
					<Col sm={12} className="medium-bottom-spacing">
						<div className="center-v-spread-h">
							<p className="bold">{this.props.validValue.longName}</p>
							<FormItemToolbar itemType="Valid Value" dispatchRemoveItem={this.dispatchRemoveValidValue} shouldDisplayRemoveItem={this.props.shouldDisplayRemoveItem} />
						</div>
						<Form onChange={this.handleValidValueChanged}>
							<ul className="list-unstyled">
									<li>
										Meaning Text: {this.props.validValue.formValueMeaningText}
									</li>
									<li>
										Meaning Public ID Version: {this.props.validValue.formValueMeaningIdVersion}
									</li>
									<li>
										Meaning Desc: {this.props.validValue.formValueMeaningDesc}
									</li>
									<li>
										<Textarea rows={1} name="instructions" label="Instructions" value={(this.props.validValue.instructions !== null ? this.props.validValue.instructions : "")}/>
									</li>
								</ul>
						</Form>
					</Col>
				</Row>
			);
		}
	}

ValidValueEditable.propTypes = {
	shouldDisplayRemoveItem: PropTypes.bool.isRequired,
	moduleId: PropTypes.string.isRequired,
	questionId: PropTypes.string.isRequired,
	validValue:      PropTypes.shape({
		cid: PropTypes.string.isRequired,
		longName: PropTypes.string,
		formValueMeaningText: PropTypes.string,
		formValueMeaningIdVersion: PropTypes.string,
		formValueMeaningDesc: PropTypes.string,
		instructions: PropTypes.string
	})
};

export default ValidValueEditable;