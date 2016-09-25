import React, {Component, PropTypes} from 'react';
import {Col, Row} from 'react-bootstrap';
import FormLayoutMain from './FormLayoutMain';
import backboneReact from 'backbone-react-component';
import TreeView from './TreeView';
import SidePanel from './SidePanel';

export default class FormLayout extends Component {
	constructor(props){
		super(props);
		this.canCreateModule = this.canCreateModule.bind(this);
		this.getCartList = this.getCartList.bind(this);
		this.getFormModel = this.getFormModel.bind(this);
		this.getFormModules = this.getFormModules.bind(this);
		this.getActionMode = this.getActionMode.bind(this);
		this.getEditItems = this.getEditItems.bind(this);
	}

	componentWillMount(){
		/* watch for changes on these backbone models/collections and re-render */
		backboneReact.on(this, {
			models: {
				formUIState: this.props.formUIState
			}
		});
	}

	componentWillUnmount(){
		backboneReact.off(this);
	}

	/**
	 *
	 * @returns {boolean}
	 */
	canCreateModule(){
		/*TODO come up with a more reliable way to check for this */
		return this.shouldShowFormEditControls() === true && this.getActionMode() !== 'createModule';
	}

	shouldShowFormEditControls(){
		return this.state.formUIState.isEditing === true;
	}

	getActionMode(){
		return this.state.formUIState.actionMode;
	}

	getFormMetaData(){
		return this.props.formModel.formMetadata.attributes;
	}

	getFormModel(){
		return this.props.formModel;
	}

	getEditItems(){
		return this.state.formUIState.editItem;
	}

	getCartList({name}){
		if(this.props.carts[name]){
			return this.props.carts[name].models.map(model =>{
				return Object.assign({}, model.attributes, {id: model.id});
			});
		}
	}

	getFormModules(){
		/* Return list of modules with its backbone model's cid included */
		return this.getFormModel().formModules.models.map(model =>{
			/* Getting cid vs moduleIdseq becauswe new modules don't have a moduleIdseq */
			return Object.assign({}, model.attributes, {cid: model.cid});
		});
	}
	render(){
		return (
			<Row className="eq-height-wrapper"> <Col lg={2} className="eq-height-item">
				<TreeView list={this.getFormModules()} formIdSeq={this.getFormModel().formIdseq} formName={this.getFormMetaData().longName} canCreateModule={this.canCreateModule()}/>
			</Col> <Col lg={8} className="eq-height-item">
				<FormLayoutMain uiDropDownOptionsModel={this.props.uiDropDownOptionsModel} shouldShowFormEditControls={this.shouldShowFormEditControls()} actionMode={this.getActionMode()} formMetadata={this.getFormMetaData()} editItems={this.getEditItems()} formModules={this.getFormModules()}/>
			</Col> <Col lg={2} className="eq-height-item">
				<SidePanel cdeList={this.getCartList({name: "cdeCartCollection"})}/></Col> </Row>
		);
	}
}

FormLayout.propTypes = {
	formUIState:            PropTypes.shape({
		actionMode: PropTypes.string.isRequired
	}),
	uiDropDownOptionsModel: PropTypes.object.isRequired,
	formModel:              PropTypes.shape({
		formMetaData: PropTypes.object.isRequired,
		formModules:  PropTypes.object.isRequired
	})
};
