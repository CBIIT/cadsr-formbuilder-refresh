import React, {Component, PropTypes} from 'react';
import {Col, Row, Button, FormGroup, ControlLabel, FormControl} from 'react-bootstrap';
import ROUTES from '../../constants/ROUTES';
import formRouter from '../../routers/FormRouter';
import EVENTS from '../../constants/EVENTS';
import {formChannel} from '../../channels/radioChannels';
import List from '../common/List';

export default class TreeView extends Component {
	constructor(props){
		super(props);
		this.dispatchCreateModule = this.dispatchCreateModule.bind(this);
		this.dispatchNavigateToModule = this.dispatchNavigateToModule.bind(this);
		this.showNewModuleButton = this.showNewModuleButton.bind(this);
	}

	dispatchCreateModule(){
		formRouter.navigate(ROUTES.FORM.CREATE_MODULE, {trigger: true});
	}

	dispatchNavigateToModule(id){
		formChannel.request(EVENTS.FORM.VIEW_MODULE, id);
	}

	showNewModuleButton(){
		if(this.props.canCreateModule){
			return (
				<Button onClick={this.dispatchCreateModule} className="btn btn-primary" type="submit">New Module</Button>
			);
		}
	}

	render(){
		return (
			<div className="bordered-container tall-min-height">
				<p>{this.props.formName}</p>                {this.showNewModuleButton()}                <p>Modules</p>
				<List onClickCallback={this.dispatchNavigateToModule} itemKey={"id"} itemTextKey={"longName"} data={this.props.list}/>
			</div>
		);
	}
}

TreeView.propTypes = {
	canCreateModule: PropTypes.bool,
	children:        PropTypes.element
};
