import React, {Component, PropTypes} from 'react';
import {Col, Row, PanelGroup, Panel} from 'react-bootstrap';
import {Input, Textarea} from 'formsy-react-components';
import EVENTS from '../../constants/EVENTS';
import formActions from '../../constants/formActions';
import {formChannel} from '../../channels/radioChannels';
import Form from '../common/Form';
import QuestionEditable from './QuestionEditable';

export default class FormModuleForm extends Component {
	constructor(props){
		super(props);
		this.dispatchData = this.dispatchData.bind(this);
		this.getQuestions = this.getQuestions.bind(this);
		this.handleSelectQuestionAccordion = this.handleSelectQuestionAccordion.bind(this);
		this.state = {
			validatePristine: false,
			activeQuestionAccordion:  '1'
		};
	}

	dispatchData(data){
		const actionMode = this.props.actionMode;
		if(actionMode === formActions.VIEW_MODULE){
			const newData = Object.assign({}, data, {id: this.props.moduleId});
			formChannel.request(EVENTS.FORM.SET_MODULE, newData);
		}
		else if(actionMode === formActions.CREATE_MODULE){
			formChannel.request(EVENTS.FORM.SET_NEW_MODULE, data);
		}
	}
	handleSelectQuestionAccordion(activeKey) {
		this.setState({ activeQuestionAccordion: activeKey });
	}
	getQuestions (items) {
		if(items && items.length){
			const activeQuestionAccordion = this.state.activeQuestionAccordion;
			const mapQuestions = (item, index) =>{
				return (
					<Panel header={item.longName} key={index} eventKey={index}>
						<QuestionEditable panelIsExpanded={activeQuestionAccordion=== index}  question={item}/>
					</Panel>
				);
			};
			return (
				<PanelGroup accordion activeKey={activeQuestionAccordion} onSelect={this.handleSelectQuestionAccordion}>{items.map(mapQuestions)}</PanelGroup>
			);
		}

	}
	render(){
		return (
			<Row>
				<Col sm={12}>
					<Form onSubmit={this.dispatchData} validatePristine={this.state.validatePristine} disabled={this.props.disabled} ref="formModuleForm">
						<fieldset name="Module Metadata">
							<legend className="sr-only">{this.props.mainHeadingTitle}</legend>
							<Input name="longName" id="longName" value={this.props.longName} label="Module Name" type="text" help="This is a required text input." required/>
							<Textarea rows={3} cols={40} name="instructions" label="Instructions" value={this.props.instructions}/>
						</fieldset>
						<div>
							{this.getQuestions(this.props.questions)}
						</div>
						{this.props.children}
					</Form>
				</Col>
			</Row>
		);
	}
}

FormModuleForm.defaultProps = {
	longName:     "",
	instructions: ""
};

FormModuleForm.propTypes = {
	longName:         PropTypes.string,
	instructions:     PropTypes.string,
	mainHeadingTitle: PropTypes.string
};