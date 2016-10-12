/**
 * Created by nmilos on 10/11/16.
 */
import React, {Component, PropTypes} from 'react';
import {Col, Row} from 'react-bootstrap';
import FormTable from '../formTable/formTable';
import TABLECONFIG from '../../constants/TABLE_CONFIGS';

export default class CartLayout extends Component {
	constructor(props){
		super(props);

		this.data= [{"formIdseq":null,"createdBy":"Guest 9/10/2011","longName":"Test Form Long Name_ 0","preferredDefinition":null,"context":{"conteIdseq":"123abc","name":"TEST","description":"testdesc"},"protocols":[{"protoIdseq":null,"longName":"Test Protocol Long Name"}],"workflow":"Draft New","formCategory":null,"formType":null,"version":1.0,"headerInstructions":null,"footerInstructions":null,"publicId":123456},{"formIdseq":null,"createdBy":"Guest 9/10/2011","longName":"Test Form Long Name_ 1","preferredDefinition":null,"context":{"conteIdseq":"123abc","name":"TEST","description":"testdesc"},"protocols":[{"protoIdseq":null,"longName":"Test Protocol Long Name"}],"workflow":"Draft New","formCategory":null,"formType":null,"version":1.0,"headerInstructions":null,"footerInstructions":null,"publicId":123456},{"formIdseq":null,"createdBy":"Guest 9/10/2011","longName":"Test Form Long Name_ 2","preferredDefinition":null,"context":{"conteIdseq":"123abc","name":"TEST","description":"testdesc"},"protocols":[{"protoIdseq":null,"longName":"Test Protocol Long Name"}],"workflow":"Draft New","formCategory":null,"formType":null,"version":1.0,"headerInstructions":null,"footerInstructions":null,"publicId":123456},{"formIdseq":null,"createdBy":"Guest 9/10/2011","longName":"Test Form Long Name_ 3","preferredDefinition":null,"context":{"conteIdseq":"123abc","name":"TEST","description":"testdesc"},"protocols":[{"protoIdseq":null,"longName":"Test Protocol Long Name"}],"workflow":"Draft New","formCategory":null,"formType":null,"version":1.0,"headerInstructions":null,"footerInstructions":null,"publicId":123456},{"formIdseq":null,"createdBy":"Guest 9/10/2011","longName":"Test Form Long Name_ 4","preferredDefinition":null,"context":{"conteIdseq":"123abc","name":"TEST","description":"testdesc"},"protocols":[{"protoIdseq":null,"longName":"Test Protocol Long Name"}],"workflow":"Draft New","formCategory":null,"formType":null,"version":1.0,"headerInstructions":null,"footerInstructions":null,"publicId":123456},{"formIdseq":null,"createdBy":"Guest 9/10/2011","longName":"Test Form Long Name_ 5","preferredDefinition":null,"context":{"conteIdseq":"123abc","name":"TEST","description":"testdesc"},"protocols":[{"protoIdseq":null,"longName":"Test Protocol Long Name"}],"workflow":"Draft New","formCategory":null,"formType":null,"version":1.0,"headerInstructions":null,"footerInstructions":null,"publicId":123456},{"formIdseq":null,"createdBy":"Guest 9/10/2011","longName":"Test Form Long Name_ 6","preferredDefinition":null,"context":{"conteIdseq":"123abc","name":"TEST","description":"testdesc"},"protocols":[{"protoIdseq":null,"longName":"Test Protocol Long Name"}],"workflow":"Draft New","formCategory":null,"formType":null,"version":1.0,"headerInstructions":null,"footerInstructions":null,"publicId":123456},{"formIdseq":null,"createdBy":"Guest 9/10/2011","longName":"Test Form Long Name_ 7","preferredDefinition":null,"context":{"conteIdseq":"123abc","name":"TEST","description":"testdesc"},"protocols":[{"protoIdseq":null,"longName":"Test Protocol Long Name"}],"workflow":"Draft New","formCategory":null,"formType":null,"version":1.0,"headerInstructions":null,"footerInstructions":null,"publicId":123456},{"formIdseq":null,"createdBy":"Guest 9/10/2011","longName":"Test Form Long Name_ 8","preferredDefinition":null,"context":{"conteIdseq":"123abc","name":"TEST","description":"testdesc"},"protocols":[{"protoIdseq":null,"longName":"Test Protocol Long Name"}],"workflow":"Draft New","formCategory":null,"formType":null,"version":1.0,"headerInstructions":null,"footerInstructions":null,"publicId":123456},{"formIdseq":null,"createdBy":"Guest 9/10/2011","longName":"Test Form Long Name_ 9","preferredDefinition":null,"context":{"conteIdseq":"123abc","name":"TEST","description":"testdesc"},"protocols":[{"protoIdseq":null,"longName":"Test Protocol Long Name"}],"workflow":"Draft New","formCategory":null,"formType":null,"version":1.0,"headerInstructions":null,"footerInstructions":null,"publicId":123456},{"formIdseq":null,"createdBy":"Guest 9/10/2011","longName":"Test Form Long Name_ 10","preferredDefinition":null,"context":{"conteIdseq":"123abc","name":"TEST","description":"testdesc"},"protocols":[{"protoIdseq":null,"longName":"Test Protocol Long Name"}],"workflow":"Draft New","formCategory":null,"formType":null,"version":1.0,"headerInstructions":null,"footerInstructions":null,"publicId":123456},{"formIdseq":null,"createdBy":"Guest 9/10/2011","longName":"Test Form Long Name_ 11","preferredDefinition":null,"context":{"conteIdseq":"123abc","name":"TEST","description":"testdesc"},"protocols":[{"protoIdseq":null,"longName":"Test Protocol Long Name"}],"workflow":"Draft New","formCategory":null,"formType":null,"version":1.0,"headerInstructions":null,"footerInstructions":null,"publicId":123456},{"formIdseq":null,"createdBy":"Guest 9/10/2011","longName":"Test Form Long Name_ 12","preferredDefinition":null,"context":{"conteIdseq":"123abc","name":"TEST","description":"testdesc"},"protocols":[{"protoIdseq":null,"longName":"Test Protocol Long Name"}],"workflow":"Draft New","formCategory":null,"formType":null,"version":1.0,"headerInstructions":null,"footerInstructions":null,"publicId":123456},{"formIdseq":null,"createdBy":"Guest 9/10/2011","longName":"Test Form Long Name_ 13","preferredDefinition":null,"context":{"conteIdseq":"123abc","name":"TEST","description":"testdesc"},"protocols":[{"protoIdseq":null,"longName":"Test Protocol Long Name"}],"workflow":"Draft New","formCategory":null,"formType":null,"version":1.0,"headerInstructions":null,"footerInstructions":null,"publicId":123456},{"formIdseq":null,"createdBy":"Guest 9/10/2011","longName":"Test Form Long Name_ 14","preferredDefinition":null,"context":{"conteIdseq":"123abc","name":"TEST","description":"testdesc"},"protocols":[{"protoIdseq":null,"longName":"Test Protocol Long Name"}],"workflow":"Draft New","formCategory":null,"formType":null,"version":1.0,"headerInstructions":null,"footerInstructions":null,"publicId":123456}];
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
				<h1 className="text--bold">Form Builder | Form Cart</h1>
				<FormTable pagination={true} perPage={100} columnTitles={TABLECONFIG.FORM} data={this.data}></FormTable>
			</div>
		);
	}
}

CartLayout.propTypes = {
};
