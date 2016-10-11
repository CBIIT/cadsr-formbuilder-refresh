import React, {Component, PropTypes} from 'react';
import {Col, Row, PanelGroup, Panel} from 'react-bootstrap';
import ValidValueStatic from './ValidValueStatic';

export default class QuestionStatic extends Component {
	static getValidValues(items){
		if(items && items.length){
			const mapValidValues = (item, index) =>{
				return (
					<ValidValueStatic key={index} validValue={item}/>
				);
			};
			return (
				<PanelGroup defaultActiveKey="1" accordion> <Panel header="Valid Values" ventKey="1">
					<ul className={"list-unstyled"}>
						{items.map(mapValidValues)}
					</ul>
				</Panel> </PanelGroup>
			);
		}
	}
	render(){
		return (
			<Row className="top-margin bottom-margin bordered">
				{/*<Col md={1}>
				 <div className="module-side">
				 </div>
				 </Col>\*/} <Col md={12}>
				<h5>{this.props.question.preferredQuestionText}</h5>
				<ul className="list-unstyled">
					<li>
						Answer is Mandatory: {this.props.question.mandatory ? "Yes" : "No"}
					</li>
					<li>
						Answer is Editable: {this.props.question.editable ? "Yes" : "No"}
					</li>
					<li>
						<p className="bold short-top-spacing">Value Domain Details</p>
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
					</li>
				</ul>
				<div>
					{QuestionStatic.getValidValues(this.props.question.validValues)}
				</div>
			</Col> </Row>
		);
	}
}