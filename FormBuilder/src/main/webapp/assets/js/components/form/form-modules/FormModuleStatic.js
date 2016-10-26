import React, {Component, PropTypes} from 'react';
import {Col, Row, PanelGroup, Panel, Button} from 'react-bootstrap';
import QuestionStatic from './QuestionStatic';
import EVENTS from '../../../constants/EVENTS';
import formActions from '../../../constants/formActions';
import {formChannel, appChannel} from '../../../channels/radioChannels';

export default class FormModuleStatic extends Component {
	constructor(props) {
		super(props);
		this.dispatchCopyModuleToCart = this.dispatchCopyModuleToCart.bind(this);
		this.getToolbarItems = this.getToolbarItems.bind(this);

	}
	dispatchCopyModuleToCart() {
		appChannel.request(EVENTS.APP.ADD_MODULE_FROM_FORM_TO_CART, {
			id: this.props.moduleId
		});
	}
	/* TODO move dupliated methods in FormModuleForm into reusable component */
	static getQuestions (items) {
		if(items && items.length){
			const mapQuestions = (item, index) =>{
				return (
					<Panel header={item.longName} key={index} eventKey={index}>
						<QuestionStatic question={item}/>
					</Panel>
				);
			};
			return (
				<PanelGroup accordion onSelect={this.handleSelectQuestionAccordion}>{items.map(mapQuestions)}</PanelGroup>
			);
		}

	}
	getToolbarItems() {
		const actionMode = 	formChannel.request(EVENTS.FORM.GET_FORM_ACTION_MODE);
		if(actionMode === formActions.VIEW_FULL_FORM) {
			return (
				<div>
					<Button className="button-link" onClick={this.dispatchCopyModuleToCart}>Copy Module to Cart</Button>
				</div>
			);
		}
	}
	render (){
		return (
			<div className="top-margin bottom-margin module">
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
					</Col>
				</Row>
				<Row>
					<Col md={12}>
						<p className="h5">Instructions:</p>
						{this.props.instructions}
						<div>
							{FormModuleStatic.getQuestions(this.props.questions)}
						</div>
					</Col>
				</Row>
			</div>
		);
	}
};

FormModuleStatic.PropTypes = {
	moduleId: PropTypes.string.isRequired
};