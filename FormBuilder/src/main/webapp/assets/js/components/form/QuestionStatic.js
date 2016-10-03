import React, {Component, PropTypes} from 'react';
import {Row, Col} from 'react-bootstrap';

const QuestionStatic = (props) =>{
	return (
		<Row className="top-margin bottom-margin module">
			{/*<Col md={1}>
				<div className="module-side">
				</div>
			</Col>\*/}
			<Col md={12}>
				<Row>
					<Col md={12}>
						<h5>{props.question.longName}</h5>
						<ul className="list-unstyled">
							<li>
								Answer is Mandatory: {props.question.mandatory ? "Yes":  "No"}
							</li>
							<li>
								Answer is Mandatory: {props.question.editable ? "Yes":  "No"}
							</li>
						</ul>

					</Col>
				</Row>
			</Col>
		</Row>
	);
};

export default QuestionStatic;