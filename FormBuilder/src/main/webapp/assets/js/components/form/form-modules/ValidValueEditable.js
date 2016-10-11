import React, {Component, PropTypes} from 'react';
import {Col, Row} from 'react-bootstrap';
import {Input, Textarea} from 'formsy-react-components';
import Form from '../../common/Form';

export class ValidValueEditable extends Component{
	constructor(props){
		super(props);
		this.state = {
			validatePristine: false,
			activeQuestionAccordion:  '1'
		};
	}
	handleValidValueChanged(currentValues, isChanged) {
		if(isChanged) {
			this.props.handleValidValueChanged({validValueId:  this.props.id, currentValues});
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
	handleValueChanged: PropTypes.func
};

export default ValidValueEditable;