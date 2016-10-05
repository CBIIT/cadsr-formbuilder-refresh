import React, {Component, PropTypes} from 'react';
import {Row, Col} from 'react-bootstrap';
import QuestionStatic from './QuestionStatic';

const formModuleStatic = (props) =>{
	const getItems = (items) =>{
		if(items && items.length){
			return (
				<ul className={"list-unstyled"}>{items.map( (item, index) => (
						<QuestionStatic key={index} question={item}/>
					))}</ul>
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
					{getItems(props.questions)}
				</div>
			</Col>
		</Row>
	);
};

export default formModuleStatic;