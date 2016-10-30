import React, {Component, PropTypes} from 'react';
import {Checkbox} from 'formsy-react-components';
import {Col, Row, PanelGroup, Panel, ControlLabel} from 'react-bootstrap';
import ValidValueStatic from './ValidValueStatic';
import FormItemToolbar from './FormItemToolbar';
import EVENTS from '../../../constants/EVENTS';
import {formChannel} from '../../../channels/radioChannels';
import Form from '../../common/Form';

export default class QuestionStatic extends Component {
	constructor(props){
		super(props);
		this.dispatchRemoveQuestion = this.dispatchRemoveQuestion.bind(this);
		this.getValidValues = this.getValidValues.bind(this);
	}
	dispatchRemoveQuestion() {
		formChannel.request(EVENTS.FORM.REMOVE_QUESTION, {
			moduleId: this.props.moduleId,
			questionId:  this.props.question.cid
		});
	}
	getValidValues(){
		if(this.props.question.validValues && this.props.question.validValues.length){
			const mapValidValues = (item, index) =>{
				return (
					<ValidValueStatic shouldDisplayRemoveItem={this.props.shouldDisplayRemoveItem} key={index} validValue={item}/>
				);
			};
			return (
				<PanelGroup defaultActiveKey="1" accordion> <Panel header="Valid Values" eventKey="1">
					<ul className={"list-unstyled"}>
						{this.props.question.validValues.map(mapValidValues)}
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
				 </Col>\*/}
				<Col md={1} />
				<Col md={12}>
					<Row>
						<Col md={12}>
							<div className="center-v-spread-h">
								<h5>{this.props.question.preferredQuestionText}</h5>
								<FormItemToolbar itemType="Question" dispatchRemoveItem={this.dispatchRemoveQuestion} shouldDisplayRemoveItem={this.props.shouldDisplayRemoveItem} />
							</div>
						</Col>
					</Row>
				<Form>
					<Row>
						<Col md={6}>
							<Checkbox
								name="mandatory"
								value={this.props.question.mandatory}
								label="Answer is Mandatory"
								disabled={true}
							/>

						</Col>
						<Col md={6}>
							<Checkbox
								name="editable"
								value={this.props.question.editable}
								label="Answer is Editable"
								disabled={true}
							/>
						</Col>
					</Row>
				</Form>
					<Row>
						<Col md={12}>
							<p className="bold short-top-spacing">VALUE DOMAIN DETAILS</p>
						</Col>
					</Row>
					<Row>
						<Col md={6}>
							<ControlLabel>LONG NAME</ControlLabel>
						</Col>
						<Col md={6}>
							<ControlLabel>DATA TYPE</ControlLabel>
						</Col>
					</Row>
					<Row>
						<Col md={6}>
							{this.props.question.valueDomainLongName}
						</Col>
						<Col md={6}>
							{this.props.question.dataType}
						</Col>
					</Row>

					<Row>
						<Col md={6}>
							<ControlLabel>UNIT OF MEASURE</ControlLabel>
						</Col>
						<Col md={6}>
							<ControlLabel>DISPLAY FORMAT</ControlLabel>
						</Col>
					</Row>
					<Row>
						<Col md={6}>
							{this.props.question.unitOfMeasure}
						</Col>
						<Col md={6}>
							{this.props.question.displayFormat}
						</Col>
					</Row>

					<Row>
						<Col md={12}>
							<ControlLabel>CONCEPTS</ControlLabel>
						</Col>
					</Row>
					<Row>
						<Col md={6}>
						{this.props.question.concepts}
						</Col>
					</Row>

					<div>
						{this.getValidValues()}
					</div>
				</Col>
				<Col md={1} />
			</Row>
		);
	}
}

QuestionStatic.protypes = {
	moduleId: PropTypes.string,
	shouldDisplayRemoveItem: PropTypes.bool
};