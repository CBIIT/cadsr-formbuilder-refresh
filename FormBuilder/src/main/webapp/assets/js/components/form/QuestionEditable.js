import React, {Component, PropTypes} from 'react';
import {Col, Row} from 'react-bootstrap';
import {Input, Textarea, RadioGroup, Checkbox, Select} from 'formsy-react-components';
import EVENTS from '../../constants/EVENTS';
import formActions from '../../constants/formActions';
import {formChannel} from '../../channels/radioChannels';
import Form from '../common/Form';

const QuestionEditable = (props) => {
	return (
		<Row>
			<Col sm={12}>
					<fieldset name={props.question.preferredQuestionText}>
						<legend className="h5">{props.question.preferredQuestionText}</legend>
						<Textarea rows={3} cols={40} name="instructions" label="Instructions" value={props.question.instructions}/>
							<Input name="longName" id="longName" value={props.question.mandatory} label="Answer is Mandatory" type="text" help="This is a required text input." required/>
						<RadioGroup
							name="checkbox1"
							value={props.question.mandatory}
							label="Answer is Mandatory"
							options={[
								{value: true, label: 'Yes'},
								{value: false, label: 'No'},
							]}
						/>
						<Checkbox
							name="checkbox1"
							value={props.question.editable}
							label="Answer is Editable"
							rowLabel="Checkbox (single)"
						/>
						<ul className="list-unstyled">
							<li>
								Long Name: {props.question.longName}
							</li>
							<li>
								Data Type: {props.question.dataType}
							</li>
							<li>
								Unit of Measure: {props.question.unitOfMeasure}
							</li>
							<li>
								Display Format: {props.question.displayFormat}
							</li>
							<li>
								Concepts: {props.question.concepts}
							</li>
						</ul>
					</fieldset>

			</Col>
		</Row>
	);
};

QuestionEditable.propTypes = {
};

export default QuestionEditable;