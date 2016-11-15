import React, {Component, PropTypes} from 'react';
import {Col, Row, PanelGroup, Panel, ControlLabel, FormGroup, FormControl, Button} from 'react-bootstrap';
import EVENTS from '../../../constants/EVENTS';
import {formChannel} from '../../../channels/radioChannels';
import Form from '../../common/Form';
import FormItemToolbar from './FormItemToolbar';
import {Input, Textarea, RadioGroup, Checkbox, Select} from 'formsy-react-components';
import ValidValueEditable from './ValidValueEditable';
import {getOptions} from '../../../helpers/uiInputHelpers';

export default class QuestionEditable extends Component {
	constructor(props){
		super(props);
		this.dispatchRemoveQuestion = this.dispatchRemoveQuestion.bind(this);
		this.dispatchQuestionData = this.dispatchQuestionData.bind(this);
		this.handleQuestionChanged = this.handleQuestionChanged.bind(this);
		this.getAlternativeQuestionText = this.getAlternativeQuestionText.bind(this);
		this.getPreferredQuestionTextInput = this.getPreferredQuestionTextInput.bind(this);
		this.dispatchSetLongNameAsPreferredText = this.dispatchSetLongNameAsPreferredText.bind(this);
		this.state = {
			validatePristine: false,
			/*the expanded accordion*/
			activeQuestionAccordion:  '1'
		};
	}
	 getValidValues (items){
		if(items && items.length){
			const mapValidValues = (item, index) =>{
				return (
					<ValidValueEditable shouldDisplayRemoveItem={this.props.shouldDisplayRemoveItem} moduleId={this.props.moduleId} questionId={this.props.question.cid} key={item.valueIdseq} validValue={item}/>
				);
			};
			return (
				<PanelGroup defaultActiveKey="1"
				            accordion>
					<Panel header="Valid Values"
					       eventKey="1">
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
	dispatchRemoveQuestion() {
		formChannel.request(EVENTS.FORM.REMOVE_QUESTION, {
			moduleId: this.props.moduleId,
			questionId:  this.props.question.cid
		});
	}
	getAlternativeQuestionText () {
		if(this.props.question.alternativeQuestionText.length){
			const alternativeQuestionTextItems = this.props.question.alternativeQuestionText.map(((item)=> {
				return {
					value: item,
					label: item
				};
			}));
			return (
				<Select name="alternativeQuestionTextSelector" label="Alternate Question Text" options={alternativeQuestionTextItems} />
			);
		}
		else {
			return null;
		}
	}
	getPreferredQuestionTextInput () {
		if(this.props.question.preferredQuestionText){
			return (
				<FormGroup>
					<ControlLabel>Preferred Question Text</ControlLabel>
					<FormControl.Static><span className="block pull-left">{this.props.question.preferredQuestionText}</span><Button onClick={this.dispatchSetLongNameAsPreferredText} bsClass="btn-link pull-right">Use Text</Button></FormControl.Static>

				</FormGroup>
			);
		}
		else {
			return null;
		}
	}
	handleQuestionChanged(currentValues, isChanged) {
		/* BE AWARE: Form.onChange returns true unexpectedly. Using isChanged as guard */
		if(isChanged) {
			/*TODO Move this somewhere more reusable: Sets the string "true" back to boolean for BE */
			currentValues.mandatory = currentValues.mandatory === "true";
			/* currentValues.alternativeQuestionTextSelector here is the selected alternativeQuestionTexts dropdonw value, not the array of props.question.alternativeQuestionText */
			if(currentValues.alternativeQuestionTextSelector !== undefined && (currentValues.alternativeQuestionTextSelector !== this.props.question.longName)) {
				this.dispatchQuestionData({questionData: {longName: currentValues.alternativeQuestionTextSelector}});
			}
			else {
				this.dispatchQuestionData({questionData: currentValues});
			}
		}
	}
	dispatchSetLongNameAsPreferredText() {
		this.dispatchQuestionData({questionData: {longName: this.props.question.preferredQuestionText}});
	}
	dispatchQuestionData({questionData}) {
		/* the select elem for alternativeQuestionText has a name attrib of that value and Formsy camputures it. exlcuding it sow it doesn't overrwite alternativeQuestionText */
		const newQuestionData = _.omit(questionData, "alternativeQuestionTextSelectorValue");
		formChannel.trigger(EVENTS.FORM.SET_QUESTION,
			{moduleId: this.props.moduleId,
				questionData: newQuestionData,
				questionId:  this.props.question.cid
			});
	}
	render() {
		if(this.props.panelIsExpanded) {
			return (
				<Row>
					<Col sm={12}>
						<div className="center-v-spread-h">
							<FormItemToolbar itemType="Question" dispatchRemoveItem={this.dispatchRemoveQuestion} shouldDisplayRemoveItem={this.props.shouldDisplayRemoveItem} />
						</div>
						<Form onChange={this.handleQuestionChanged} validatePristine={this.state.validatePristine}>
							<Textarea rows={3} cols={40} name="instructions" label="Instructions" value={this.props.question.instructions !== null ? this.props.question.instructions : ""}/>



							{this.getPreferredQuestionTextInput()}
							{this.getAlternativeQuestionText()}

							<RadioGroup
								name="mandatory"
								value={this.props.question.mandatory}
								label="Answer is Mandatory"
								options={[
									{value: true, label: 'Yes'},
									{value: false, label: 'No'},
								]}
							/>
							<Checkbox
								name="editable"
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
						</Form>
							<div>
								{this.getValidValues(this.props.question.validValues)}
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
	panelIsExpanded: PropTypes.bool,
	question: PropTypes.object,
	dispatchSetQuestion: PropTypes.func
};
