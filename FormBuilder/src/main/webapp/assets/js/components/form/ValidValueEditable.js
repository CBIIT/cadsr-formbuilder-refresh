import React, {Component, PropTypes} from 'react';
import {Col, Row} from 'react-bootstrap';
import {Input, Textarea, RadioGroup, Checkbox, Select} from 'formsy-react-components';
import {getOptions} from '../../helpers/uiInputHelpers';

const ValidValueEditable = (props) => {
	const getDefaultValueField = (value, validValues) =>{
		if(validValues.length){
			return (
				<Select name="defaultValue" label="Default value" options={getOptions({
					options: validValues,
					labelKey: "shortMeaning"
				})} value={value}/>
			);
		}
		else {
			return (
				<Input name="defaultValue" id="defaultValue" value={value} label="Default value" type="text"  required/>
			);
		}
	};
	return (
		<Row>
			<Col sm={12}>
					<fieldset name={props.question.longName}>
						<legend className="h5">{props.question.longName}</legend>
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
						{getDefaultValueField(props.question.defaultValue, props.question.validValues)}

					</fieldset>

			</Col>
		</Row>
	);
};

ValidValueEditable.propTypes = {
};

export default ValidValueEditable;