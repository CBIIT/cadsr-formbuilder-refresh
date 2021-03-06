import React, {Component, PropTypes} from 'react';
import {Col, Row, PanelGroup, Panel, Button} from 'react-bootstrap';
import QuestionStatic from './QuestionStatic';
import FormItemToolbar from './FormItemToolbar';
import EVENTS from '../../../constants/EVENTS';
import formActions from '../../../constants/formActions';

import {formChannel, appChannel} from '../../../channels/radioChannels';

export default class FormModuleStatic extends Component {
	constructor(props){
		super(props);
		this.dispatchCopyModuleToCart = this.dispatchCopyModuleToCart.bind(this);
		this.getToolbarItems = this.getToolbarItems.bind(this);
		this.getQuestions = this.getQuestions.bind(this);
		this.dispatchRemoveModule = this.dispatchRemoveModule.bind(this);
		this.renderQuestionHeader = this.renderQuestionHeader.bind(this);
		this.handleSelectQuestionAccordion = this.handleSelectQuestionAccordion.bind(this);
		
		this.state = {
			activeQuestionAccordion : "",
			panelOpen: false
		};
	}

	dispatchCopyModuleToCart(){
		appChannel.request(EVENTS.APP.ADD_MODULE_FROM_FORM_TO_CART, {
			id: this.props.moduleId
		});
	}
	dispatchRemoveModule(){
		formChannel.request(EVENTS.FORM.REMOVE_MODULE, {id: this.props.moduleId});
	}
	
	renderQuestionHeader(item, index) {
		 if (this.state.activeQuestionAccordion === index && this.state.panelOpen) {
			 return (
				 <div className="questionHeader">
				 	<span className="questionExpandCollapse glyphicon glyphicon-minus"></span>
				 	{item.longName}
				 </div>
			 );
		 }
		 else {
			 return (
				 <div className="questionHeader">
				 	<span className="questionExpandCollapse glyphicon glyphicon-plus"></span>
				 	{item.longName}
				 </div>
			 );
		 }
	}
	
	handleSelectQuestionAccordion(eventKey, e) {
		let panelOpen = true;
		if (eventKey === this.state.activeQuestionAccordion) {
			// closing the one that was already open
			panelOpen = false;
		}
		this.setState({
			activeQuestionAccordion: eventKey,
			panelOpen: panelOpen
		});
	}
	
	/* TODO move dupliated methods in FormModuleForm into reusable component */
	getQuestions(){
		if(this.props.questions && this.props.questions.length){
			const mapQuestions = (item, index) =>{
				return (
					<Panel header={this.renderQuestionHeader(item, index)} key={index} eventKey={index} expanded={this.state.activeQuestionAccordion === index}>
						<QuestionStatic shouldDisplayRemoveItem={this.props.shouldShowRemoveModuleBtn} dispatchRemoveQuestion={this.dispatchRemoveQuestion}  moduleId={this.props.moduleId} question={item}/>
					</Panel>
				);
			};
			return (
				<PanelGroup accordion onSelect={this.handleSelectQuestionAccordion}>{this.props.questions.map(mapQuestions)}</PanelGroup>
			);
		}

	}

	getToolbarItems(){
		const actionMode = formChannel.request(EVENTS.FORM.GET_FORM_ACTION_MODE);

		return (
			<FormItemToolbar itemType="Module" dispatchRemoveItem={this.dispatchRemoveModule} dispatchCopyItem={this.dispatchCopyModuleToCart} shouldDisplayRemoveItem={this.props.shouldShowRemoveModuleBtn} shouldDisplayCopyItem={this.props.shouldDisplayCopyItem}/> );

	}

	render(){
		return (
			<div className="top-margin bottom-margin module container-fluid">
				<Row>
					{/*<Col md={1}>
					 <div className="module-side">
					 </div>
					 </Col>\*/}
					<Col md={12}>
						<div className="center-v-spread-h">
							<h4>{this.props.longName}</h4>
							{this.getToolbarItems()}
						</div>
						<hr className="panel-divider"/>
					</Col>
				</Row>
				<Row>
					<Col md={12}>
						<p className="h5">Instructions:</p>
						{this.props.instructions}
						<div>
							{this.getQuestions()}
						</div>
					</Col>
				</Row>
			</div>
		);
	}
}

FormModuleStatic.PropTypes = {
	shouldShowRemoveModuleBtn: PropTypes.bool,
	moduleId: PropTypes.string.isRequired
};