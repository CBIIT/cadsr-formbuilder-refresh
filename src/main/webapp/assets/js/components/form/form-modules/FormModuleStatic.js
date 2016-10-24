import React, {Component, PropTypes} from 'react';
import {Col, Row, PanelGroup, Panel} from 'react-bootstrap';
import QuestionStatic from './QuestionStatic';

export default class FormModuleStatic extends Component {
	/* TODO move dupliated methods in FormModuleForm into reusable component */
	static getQuestions (items) {
		if(items && items.length){
			const mapQuestions = (item, index) =>{
				return (
					<Panel header={item.longName} key={index} eventKey={index}>
						<QuestionStatic question={item}/>
					</Panel>
				);
			};
			return (
				<PanelGroup accordion onSelect={this.handleSelectQuestionAccordion}>{items.map(mapQuestions)}</PanelGroup>
			);
		}

	}
	render (){
		return (
			<Row className="top-margin bottom-margin module">
				{/*<Col md={1}>
				 <div className="module-side">
				 </div>
				 </Col>\*/}
				<Col md={12}>
					<h4>{this.props.longName}</h4>
					<p className="h5">Instructions:</p>
					{this.props.instructions}
					<div>
						{FormModuleStatic.getQuestions(this.props.questions)}
					</div>
				</Col>
			</Row>
		);
	}
};