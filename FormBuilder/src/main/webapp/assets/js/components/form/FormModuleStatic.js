import React, {Component, PropTypes} from 'react';
import {Row, Col} from 'react-bootstrap';

const formModuleStatic = (props) =>{
	return (
		<div>
			<Row> <Col md={12}>
				<h4>{props.longName}</h4>
			</Col> </Row> <Row> <Col md={12}>
			<h5>Instructions:</h5>					{props.instructions}
		</Col> </Row> <Row> <Col lg={12}>
			<h5>Questions:</h5>
			<pre style={{height: "100px", whiteSpace: "normal"}}>{props.questions}</pre>
		</Col> </Row>
		</div>
	);
};

export default formModuleStatic;