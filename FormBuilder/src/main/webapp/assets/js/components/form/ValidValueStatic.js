import React, {Component, PropTypes} from 'react';
import {Row, Col} from 'react-bootstrap';

const ValidValueStatic = (props) =>{

	return (
		<Row className="top-margin bottom-margin bordered">
			{/*<Col md={1}>
			 <div className="module-side">
			 </div>
			 </Col>\*/}
			<Col md={12}>
				<h5>{props.validValue.longName}</h5>
				<ul className="list-unstyled">
					<li>
						Form Value Meaning Text: {props.validValue.formValueMeaningText}
					</li>
					<li>
						Form Value Meaning Public ID Version: {props.validValue.formValueMeaningIdVersion}
					</li>
					<li>
						Form Value Meaning Desc: {props.validValue.formValueMeaningDesc}
					</li>
				</ul>

			</Col>
		</Row>
	);
};

export default ValidValueStatic;