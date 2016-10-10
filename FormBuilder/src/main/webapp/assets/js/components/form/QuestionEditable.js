import React, {Component, PropTypes} from 'react';
import {Col, Row, PanelGroup, Panel} from 'react-bootstrap';
import {Input, Textarea, RadioGroup, Checkbox, Select} from 'formsy-react-components';
import ValidValueEditable from './ValidValueEditable';
import {getOptions} from '../../helpers/uiInputHelpers';

export default class QuestionEditable extends Component {
	constructor(props){
		super(props);
	}
	static getValidValues (items){
		if(items && items.length){
			const mapValidValues = (item, index) =>{
				return (
					<ValidValueEditable key={index} validValue={item}/>
				);
			};
			return (
				<PanelGroup defaultActiveKey="1"
				            accordion>
					<Panel header="Valid Values"
					       ventKey="1">
						<ul className={"list-unstyled"}>
							{items.map(mapValidValues)}
						</ul>
					</Panel>
				</PanelGroup>
			);
		}
	}
	static getDefaultValueField (value = "", validValues) {
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
	}
	render() {
		if(this.props.panelIsExpanded) {
			return (
				<Row>
					<Col sm={12}>
							<Textarea rows={3} cols={40} name="instructions" label="Instructions" value={this.props.question.instructions !== null ? this.props.question.instructions : ""}/>
							<RadioGroup
								name="isMandatory"
								value={this.props.question.mandatory}
								label="Answer is Mandatory"
								options={[
									{value: true, label: 'Yes'},
									{value: false, label: 'No'},
								]}
							/>
							<Checkbox
								name="isEditable"
								disabled={!this.props.question.defaultValue}
								value={this.props.question.editable}
								label="Answer is Editable"/>
							{QuestionEditable.getDefaultValueField(this.props.question.defaultValue, this.props.question.validValues)}
							<ul className="list-unstyled">
								<li>
									Long Name: {this.props.question.longName}
								</li>
								<li>
									Data Type: {this.props.question.dataType}
								</li>
								<li>
									Unit of Measure: {this.props.question.unitOfMeasure}
								</li>
								<li>
									Display Format: {this.props.question.displayFormat}
								</li>
								<li>
									Concepts: {this.props.question.concepts}
								</li>
							</ul>
							<div>
								{QuestionEditable.getValidValues(this.props.question.validValues)}
							</div>
					</Col>
				</Row>
			);
		}
		else {
			return (
				<div></div>
			);
		}
	}
};

QuestionEditable.propTypes = {
	/*We don't render form inputs unless panelIsExpanded = true to limit the number of form inputs renderd to reduce the chance of a performance hit. */
	panelIsExpanded: PropTypes.bool
};
