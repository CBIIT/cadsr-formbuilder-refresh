import React, {Component, PropTypes} from 'react';
import {Col, Row} from 'react-bootstrap';
import {Input, Textarea} from 'formsy-react-components';
import EVENTS from '../../../constants/EVENTS';
import {formChannel} from '../../../channels/radioChannels';
import Form from '../../common/Form';

export class ValidValueEditable extends Component{
	constructor(props){
		super(props);
		this.handleValidValueChanged = this.handleValidValueChanged.bind(this);
		this.state = {
			validatePristine: false,
			activeQuestionAccordion:  '1'
		};
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
					<Col sm={12}>
						<Form onChange={this.handleValidValueChanged}>
							<fieldset name={this.props.validValue.longName}>
								<legend className="sr-only">{this.props.validValue.longName}</legend>
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
									<li>
										<Textarea rows={1} name="instruction" label="Instructions" value={(this.props.validValue.instructions !== null ? this.props.validValue.instructions : "")}/>
									</li>
								</ul>
							</fieldset>
						</Form>
					</Col>
				</Row>
			);
		};
	}

ValidValueEditable.propTypes = {
};

export default ValidValueEditable;