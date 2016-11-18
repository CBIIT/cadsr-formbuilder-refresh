import React, {Component, PropTypes} from 'react';
import {Col, Row, PanelGroup, Panel} from 'react-bootstrap';

export const MakeFormModule = (Module, QuestionComponent) => class extends Component {
	constructor(props){
		super(props);
	}

	getQuestions(items){
		if(items && items.length){
			const activeQuestionAccordion = this.state.activeQuestionAccordion;
			const mapQuestions = (item, index) =>{
				return (
					<Panel header={item.longName} key={index} eventKey={index}>
						<QuestionComponent panelIsExpanded={activeQuestionAccordion === index} question={item}/>
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
			<Module  {...this.props} {...this.state} />
		);
	}
};