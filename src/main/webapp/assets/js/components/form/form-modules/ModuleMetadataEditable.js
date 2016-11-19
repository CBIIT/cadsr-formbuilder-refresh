import React, {Component, PropTypes} from 'react';
import {Input, Textarea} from 'formsy-react-components';
import EVENTS from '../../../constants/EVENTS';
import formActions from '../../../constants/formActions';
import {formChannel} from '../../../channels/radioChannels';
import Form from '../../common/Form';

export default class ModuleMetadataEditable extends Component {
	constructor(props){
		super(props);
		this.dispatchData = this.dispatchData.bind(this);
		this.handleValueChanged = this.handleValueChanged.bind(this);
		this.state = {
			validatePristine: false
		};
	}
	handleValueChanged(currentValues, isChanged) {
		/* BE AWARE: Form.onChange returns true unexpectedly. Using isChanged as guard */
/*
		console.log("a ModuleMetadataEditable metadata form changed");
*/
		if(this.props.actionMode === formActions.VIEW_MODULE && isChanged) {
			this.dispatchData(currentValues);
		}
	}
	dispatchData(data){
			this.props.dispatchModuleMetadata(data);
	}
	render(){
		return (
			<Form  onChange={this.handleValueChanged}  onSubmit={this.dispatchData} validatePristine={this.state.validatePristine} ref="formModuleForm">
				<Input name="longName" id="longName" value={this.props.longName} label="MODULE NAME" type="text" help="This is a required text input." required/>
				<Textarea rows={3} cols={40} name="instructions" label="INSTRUCTIONS" value={this.props.instructions}/>
				{this.props.children}
			</Form>
		);
	}
}

ModuleMetadataEditable.defaultProps = {
	longName:     "",
	instructions: ""
};

ModuleMetadataEditable.propTypes = {
	dispatchModuleMetadata: PropTypes.func,
	longName:         PropTypes.string,
	instructions:     PropTypes.string,
	mainHeadingTitle: PropTypes.string
};