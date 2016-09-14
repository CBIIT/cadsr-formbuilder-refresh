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
	}
	dispatchCreateModule(){
		formRouter.navigate(ROUTES.FORM.CREATE_MODULE, {trigger: true});
	}
	dispatchNavigateToModule(id){
		formChannel.request(EVENTS.FORM.VIEW_MODULE, id);
	}
	render(){
		return (
			<div className="bordered-container tall-min-height">
				<p>{this.props.formName}</p>
				<Button onClick={this.dispatchCreateModule} disabled={!this.props.canCreateModule} className="btn btn-primary" type="submit">New Module</Button>
				<p>Modules</p>
				<List onClickCallback={this.dispatchNavigateToModule} itemKey={"id"} itemTextKey={"longName"} data={this.props.list} />
			</div>
		);
	}
}

TreeView.propTypes = {
	canCreateModule: PropTypes.bool,
	children:        PropTypes.element
};
