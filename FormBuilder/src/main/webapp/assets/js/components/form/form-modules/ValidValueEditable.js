import React, {Component, PropTypes} from 'react';
import {Col, Row} from 'react-bootstrap';
import {Input, Textarea} from 'formsy-react-components';

const ValidValueEditable = (props) => {
	return (
		<Row>
			<Col sm={12}>
				<fieldset name={props.validValue.longName}>
					<legend className="sr-only">{props.validValue.longName}</legend>
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
						<li>
							<Textarea rows={1} name="instruction" label="Instructions" value={(props.validValue.instructions !== null ? props.validValue.instructions : "")}/>
						</li>
					</ul>
				</fieldset>
			</Col>
		</Row>
	);
};

ValidValueEditable.propTypes = {
};

export default ValidValueEditable;