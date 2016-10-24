import React, {Component, PropTypes} from 'react';
import {Col, Row, PanelGroup, Panel} from 'react-bootstrap';
import EVENTS from '../../../constants/EVENTS';
import formActions from '../../../constants/formActions';
import {formChannel} from '../../../channels/radioChannels';
import ModuleMetadataEditable from './ModuleMetadataEditable';
import QuestionEditable from './QuestionEditable';

export default class FormModuleForm extends Component {
	constructor(props){
		super(props);
		this.dispatchModuleMetadata = this.dispatchModuleMetadata.bind(this);
		this.getQuestions = this.getQuestions.bind(this);
		this.handleSelectQuestionAccordion = this.handleSelectQuestionAccordion.bind(this);
		this.state = {
			validatePristine: false,
			activeQuestionAccordion:  '1'
		};
	}

	/**
	 * "onChange" triggers when setValue is called on your form elements. It is also triggered when dynamic form elements have been added to the form. The "currentValues" is an object where the key is the name of the input and the value is the current value. The second argument states if the forms initial values actually has changed.
	 * @param currentValues
	 * @param isChanged
	 */
	dispatchModuleMetadata(data){
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
						<QuestionEditable moduleId={this.props.moduleId} panelIsExpanded={activeQuestionAccordion=== index}  question={item}/>
					</Panel>
				);
			};
			return (
				<PanelGroup accordion onSelect={this.handleSelectQuestionAccordion}>{items.map(mapQuestions)}</PanelGroup>
			);
		}
	}
	render(){
		return (
			<Row>
				<Col sm={12}>
					<ModuleMetadataEditable actionMode={this.props.actionMode} dispatchModuleMetadata={this.dispatchModuleMetadata} longName={this.props.longName} instructions={this.props.instructions}>{this.props.children}</ModuleMetadataEditable>
					<div>
						{this.getQuestions(this.props.questions)}
					</div>
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