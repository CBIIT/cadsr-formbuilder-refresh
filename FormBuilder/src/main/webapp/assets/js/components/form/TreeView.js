import React, {Component, PropTypes} from 'react';
import {Col, Row, Button, FormGroup, ControlLabel, FormControl} from 'react-bootstrap';
import ROUTES from '../../constants/ROUTES';
import formRouter from '../../routers/FormRouter';
import List from '../common/List';


export default class TreeView extends Component {
	constructor(props){
		super(props);
		this.dispatchCreateModule = this.dispatchCreateModule.bind(this);
	}

	dispatchCreateModule(){
		formRouter.navigate(ROUTES.FORM.CREATE_MODULE, {trigger: true});
	}

	render(){
		return (
			<div className="bordered-container tall-min-height">
				<p>{this.props.formName}</p>
				<Button onClick={this.dispatchCreateModule} disabled={!this.props.canCreateModule} className="btn btn-primary" type="submit">New Module</Button>
				<List displayAsLinks={true} itemTextKey={"attributes.longName"} data={this.props.list}/>
			</div>
		);
	}
}

TreeView.propTypes = {
	canCreateModule: PropTypes.bool,
	children:        PropTypes.element
};
