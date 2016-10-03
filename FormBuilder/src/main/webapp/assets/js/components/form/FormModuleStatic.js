import React, {Component, PropTypes} from 'react';
import {Row, Col} from 'react-bootstrap';
import QuestionStatic from './QuestionStatic';

const formModuleStatic = (props) =>{
	const getQuestions = (questionsCollection) =>{
		const mapQuestions = (questionModel, index) =>{
			const question = Object.assign({}, questionModel);
			return (
				<QuestionStatic key={index} question={question}/>
			);

		};
		if(questionsCollection && questionsCollection.length){
			return (
				<ul className={"list-unstyled"}>{questionsCollection.map(mapQuestions)}</ul>
			);
		}
	};

	return (
		<Row className="top-margin bottom-margin module">
			{/*<Col md={1}>
			 <div className="module-side">
			 </div>
			 </Col>\*/}
			<Col md={12}>
				<h4>{props.longName}</h4>
				<p className="h5">Instructions:</p>
				{props.instructions}
				<div>
					{getQuestions(props.questions)}
				</div>
			</Col>
		</Row>
	);
};

export default formModuleStatic;