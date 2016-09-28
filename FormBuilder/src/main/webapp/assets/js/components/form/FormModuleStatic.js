import React, {Component, PropTypes} from 'react';
import {Row, Col} from 'react-bootstrap';

const formModuleStatic = (props) =>{
	return (
		<Row className="bordered top-margin bottom-margin"> <Col md={12}> <Row> <Col md={12}>
			<h4>{props.longName}</h4>
		</Col> </Row> <Row> <Col md={12}> <span className="h5">Instructions:</span> {props.instructions}
		</Col> </Row> <Row> <Col lg={12}>
			<h5>Questions:</h5>
			<pre style={{height: "100px", whiteSpace: "normal"}}>{props.questions}</pre>
		</Col> </Row> </Col> </Row>
	);
};

export default formModuleStatic;