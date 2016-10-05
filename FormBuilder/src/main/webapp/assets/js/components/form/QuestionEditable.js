import React, {Component, PropTypes} from 'react';
import {Col, Row} from 'react-bootstrap';
import {Input, Textarea} from 'formsy-react-components';
import EVENTS from '../../constants/EVENTS';
import formActions from '../../constants/formActions';
import {formChannel} from '../../channels/radioChannels';
import Form from '../common/Form';

const QuestionEditable = (props) => {
	return (
		<Row>
			<Col sm={12}>
					<fieldset name="Module Metadata">
						<legend className="sr-only">{this.props.mainHeadingTitle}</legend>
						<Input name="longName" id="longName" value={this.props.longName} label="Module Name" type="text" help="This is a required text input." required/>
						<Textarea rows={3} cols={40} name="instructions" label="Instructions" value={this.props.instructions}/>
					</fieldset>
			</Col>
		</Row>
	);
};

QuestionEditable.propTypes = {
};

export default QuestionEditable;