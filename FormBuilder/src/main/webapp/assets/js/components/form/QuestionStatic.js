import React, {Component, PropTypes} from 'react';
import {Row, Col} from 'react-bootstrap';

const QuestionStatic = (props) =>{
	return (
		<Row className="top-margin bottom-margin bordered">
			{/*<Col md={1}>
			 <div className="module-side">
			 </div>
			 </Col>\*/}
			<Col md={12}>
				<h5>{props.question.preferredQuestionText}</h5>
				<ul className="list-unstyled">
					<li>
						Answer is Mandatory: {props.question.mandatory ? "Yes" : "No"}
					</li>
					<li>
						Answer is Editable: {props.question.editable ? "Yes" : "No"}
					</li>
					<li>
						<p className="bold short-top-spacing">Value Domain Details</p>
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
					</li>
				</ul>
			</Col>
		</Row>
	);
};

export default QuestionStatic;