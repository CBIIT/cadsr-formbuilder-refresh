import React, {Component, PropTypes} from 'react';
import {Col, Row} from 'react-bootstrap';
import {Input, Textarea, RadioGroup, Checkbox, Select} from 'formsy-react-components';
import ValidValueEditable from './ValidValueEditable';
import {getOptions} from '../../helpers/uiInputHelpers';

const getItems = (items) =>{
	if(items && items.length){
		return (
			<ul className={"list-unstyled"}>{items.map( (item, index) => (
				<ValidValueEditable key={index} validValue={item}/>
			))}</ul>
		);
	}
};

const QuestionEditable = (props) => {
	const getDefaultValueField = (value, validValues) =>{
		if(validValues.length){
			return (
				<Select name="defaultValue" label="Default value" options={getOptions({
					options: validValues,
					optionKey: "longName",
					labelKey: "longName",
					addDefaultSelect: true
				})} value={value}/>
			);
		}
		else {
			return (
				<Input name="defaultValue" id="defaultValue" value={value} label="Default value" type="text"  />
			);
		}
	};
	return (
		<Row>
			<Col sm={12}>
					<fieldset name={props.question.longName}>
						<legend className="h5">{props.question.longName}</legend>
						<Textarea rows={3} cols={40} name="instructions" label="Instructions" value={props.question.instructions}/>
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
							label="Answer is Editable"/>
						{getDefaultValueField(props.question.defaultValue, props.question.validValues)}
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
						<div>
							{getItems(props.question.validValues)}
						</div>
					</fieldset>

			</Col>
		</Row>
	);
};

QuestionEditable.propTypes = {
};

export default QuestionEditable;