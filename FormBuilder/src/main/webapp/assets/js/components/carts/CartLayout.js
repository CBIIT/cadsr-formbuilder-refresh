import React, {Component, PropTypes} from 'react';
import {Col, Row} from 'react-bootstrap';
import FormTable from '../formTable/formTable';

export default class CartLayout extends Component {
	constructor(props){
		super(props);
	}

	/*componentWillMount(){
		/!* watch for changes on these backbone models/collections and re-render *!/
		backboneReact.on(this, {
			models:      {
			},
			collections: {
			}
		});
	}*/

	/*componentWillUnmount(){
		backboneReact.off(this);
	}*/
	/**
	 *
	 * @returns {boolean}
	 */
	render(){
		return (
			<div>
				<FormTable pagination={true} perPage={2}></FormTable>
			</div>
		);
	}
}

CartLayout.propTypes = {
};
