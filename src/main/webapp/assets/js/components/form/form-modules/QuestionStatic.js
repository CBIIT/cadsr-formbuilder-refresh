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
		this.renderValidValueHeader = this.renderValidValueHeader.bind(this);
		this.handleSelectValidValueAccordion = this.handleSelectValidValueAccordion.bind(this);
		this.state = {
			validValuesOpen: true
		};
	}
	dispatchRemoveQuestion() {
		formChannel.request(EVENTS.FORM.REMOVE_QUESTION, {
			moduleId: this.props.moduleId,
			questionId:  this.props.question.cid
		});
	}
	
	handleSelectValidValueAccordion(eventKey, e) {
		this.setState({
			validValuesOpen: !this.state.validValuesOpen
		});
	}
	
	renderValidValueHeader() {
		 if (this.state.validValuesOpen) {
			 return (
				 <div className="validValuesHeader">
				 	<span className="questionExpandCollapse glyphicon glyphicon-minus"></span>
				 	VALID VALUES
				 </div>
			 );
		 }
		 else {
			 return (
				 <div className="validValuesHeader">
				 	<span className="questionExpandCollapse glyphicon glyphicon-plus"></span>
				 	VALID VALUES
				 </div>
			 );
		 }
	}
	
	getValidValues(){
		if(this.props.question.validValues && this.props.question.validValues.length){
			const mapValidValues = (item, index) =>{
				return (
					<ValidValueStatic shouldDisplayRemoveItem={this.props.shouldDisplayRemoveItem} moduleId={this.props.moduleId} questionId={this.props.question.cid} key={index} validValue={item}/>
				);
			};
			return (
				<PanelGroup defaultActiveKey="1" accordion onSelect={this.handleSelectValidValueAccordion} expanded={this.state.validValuesOpen}>
					<Panel header="VALID VALUES" eventKey="1">
						<ul className={"list-unstyled"}>
							{this.props.question.validValues.map(mapValidValues)}
						</ul>
					</Panel>
				</PanelGroup>
			);
		}
	}
	render(){
		return (
			<Row className="top-margin bottom-margin">
				<Col md={12}>
					<Row>
						<Col md={12}>
							<div className="center-v-spread-h">
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
								layout="elementOnly"
							/>

						</Col>
						<Col md={6}>
							<Checkbox
								name="editable"
								value={this.props.question.editable}
								label="Answer is Editable"
								disabled={true}
								layout="elementOnly"
							/>
						</Col>
					</Row>
				</Form>
					<Row>
						<Col md={12}>
							<p className="bold short-top-spacing">VALUE DOMAIN DETAILS</p>
						</Col>
					</Row>
					<Row className="metaDataLabel">
						<Col md={6}>
							<ControlLabel>LONG NAME</ControlLabel>
						</Col>
						<Col md={6}>
							<ControlLabel>DATA TYPE</ControlLabel>
						</Col>
					</Row>
					<Row className="metaDataContent">
						<Col md={6}>
							{this.props.question.valueDomainLongName}
						</Col>
						<Col md={6}>
							{this.props.question.dataType}
						</Col>
					</Row>
					
					<Row className="metaDataLabel">
						<Col md={6}>
							<ControlLabel>UNIT OF MEASURE</ControlLabel>
						</Col>
						<Col md={6}>
							<ControlLabel>DISPLAY FORMAT</ControlLabel>
						</Col>
					</Row>
					<Row className="metaDataContent">
						<Col md={6}>
							{this.props.question.unitOfMeasure}
						</Col>
						<Col md={6}>
							{this.props.question.displayFormat}
						</Col>
					</Row>

					<Row className="metaDataLabel">
						<Col md={12}>
							<ControlLabel>CONCEPTS</ControlLabel>
						</Col>
					</Row>
					<Row className="metaDataContent">
						<Col md={6}>
						{this.props.question.concepts}
						</Col>
					</Row>
					
					<div>
						{this.getValidValues()}
					</div>
				</Col>
			</Row>
		);
	}
}

QuestionStatic.protypes = {
	moduleId: PropTypes.string,
	shouldDisplayRemoveItem: PropTypes.bool
};