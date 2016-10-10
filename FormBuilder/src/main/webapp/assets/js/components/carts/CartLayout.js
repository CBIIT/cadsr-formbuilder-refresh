import React, {Component, PropTypes} from 'react';
import {Col, Row} from 'react-bootstrap';
import FormTable from '../formTable/formTable';
import TABLECONFIG from '../../constants/TABLE_CONFIGS';

export default class CartLayout extends Component {
	constructor(props){
		super(props);
		this.data= [
			{"longname":"Lab Collection Time","longcdename":"Time","publicid":"2003580","contextname":"CCR","deIdseq":"A56E8150-8EAC-1CC3-E034-080020C9C0E0","conteIdseq":"A5599257-A08F-41D1-E034-080020C9C0E0","version":"3","registrationstatus":"Standard","preferredname":"LAB_COLL_TM","preferreddefinition":"The time whe a sample for a lab test was collected.","workflow":"RELEASED","dateadded":"06-28-2016","usingContexts":null,"cdeid":"2003580","published":false},{"longname":"Lab Collection Time","longcdename":"Time","publicid":"2003580","contextname":"CCR","deIdseq":"A56E8150-8EAC-1CC3-E034-080020C9C0E0","conteIdseq":"A5599257-A08F-41D1-E034-080020C9C0E0","version":"3","registrationstatus":"Standard","preferredname":"LAB_COLL_TM","preferreddefinition":"The time whe a sample for a lab test was collected.","workflow":"RELEASED","dateadded":"06-28-2016","usingContexts":null,"cdeid":"2003580","published":false},{"longname":"Lab Collection Time","longcdename":"Time","publicid":"2003580","contextname":"CCR","deIdseq":"A56E8150-8EAC-1CC3-E034-080020C9C0E0","conteIdseq":"A5599257-A08F-41D1-E034-080020C9C0E0","version":"3","registrationstatus":"Standard","preferredname":"LAB_COLL_TM","preferreddefinition":"The time whe a sample for a lab test was collected.","workflow":"RELEASED","dateadded":"06-28-2016","usingContexts":null,"cdeid":"2003580","published":false},{"longname":"Lab Collection Time","longcdename":"Time","publicid":"2003580","contextname":"CCR","deIdseq":"A56E8150-8EAC-1CC3-E034-080020C9C0E0","conteIdseq":"A5599257-A08F-41D1-E034-080020C9C0E0","version":"3","registrationstatus":"Standard","preferredname":"LAB_COLL_TM","preferreddefinition":"The time whe a sample for a lab test was collected.","workflow":"RELEASED","dateadded":"06-28-2016","usingContexts":null,"cdeid":"2003580","published":false},{"longname":"Lab Collection Time","longcdename":"Time","publicid":"2003580","contextname":"CCR","deIdseq":"A56E8150-8EAC-1CC3-E034-080020C9C0E0","conteIdseq":"A5599257-A08F-41D1-E034-080020C9C0E0","version":"3","registrationstatus":"Standard","preferredname":"LAB_COLL_TM","preferreddefinition":"The time whe a sample for a lab test was collected.","workflow":"RELEASED","dateadded":"06-28-2016","usingContexts":null,"cdeid":"2003580","published":false},{"longname":"Lab Collection Time","longcdename":"Time","publicid":"2003580","contextname":"CCR","deIdseq":"A56E8150-8EAC-1CC3-E034-080020C9C0E0","conteIdseq":"A5599257-A08F-41D1-E034-080020C9C0E0","version":"3","registrationstatus":"Standard","preferredname":"LAB_COLL_TM","preferreddefinition":"The time whe a sample for a lab test was collected.","workflow":"RELEASED","dateadded":"06-28-2016","usingContexts":null,"cdeid":"2003580","published":false},{"longname":"Lab Collection Time","longcdename":"Time","publicid":"2003580","contextname":"CCR","deIdseq":"A56E8150-8EAC-1CC3-E034-080020C9C0E0","conteIdseq":"A5599257-A08F-41D1-E034-080020C9C0E0","version":"3","registrationstatus":"Standard","preferredname":"LAB_COLL_TM","preferreddefinition":"The time whe a sample for a lab test was collected.","workflow":"RELEASED","dateadded":"06-28-2016","usingContexts":null,"cdeid":"2003580","published":false},{"longname":"Lab Collection Time","longcdename":"Time","publicid":"2003580","contextname":"CCR","deIdseq":"A56E8150-8EAC-1CC3-E034-080020C9C0E0","conteIdseq":"A5599257-A08F-41D1-E034-080020C9C0E0","version":"3","registrationstatus":"Standard","preferredname":"LAB_COLL_TM","preferreddefinition":"The time whe a sample for a lab test was collected.","workflow":"RELEASED","dateadded":"06-28-2016","usingContexts":null,"cdeid":"2003580","published":false},{"longname":"Lab Collection Time","longcdename":"Time","publicid":"2003580","contextname":"CCR","deIdseq":"A56E8150-8EAC-1CC3-E034-080020C9C0E0","conteIdseq":"A5599257-A08F-41D1-E034-080020C9C0E0","version":"3","registrationstatus":"Standard","preferredname":"LAB_COLL_TM","preferreddefinition":"The time whe a sample for a lab test was collected.","workflow":"RELEASED","dateadded":"06-28-2016","usingContexts":null,"cdeid":"2003580","published":false},{"longname":"Lab Collection Time","longcdename":"Time","publicid":"2003580","contextname":"CCR","deIdseq":"A56E8150-8EAC-1CC3-E034-080020C9C0E0","conteIdseq":"A5599257-A08F-41D1-E034-080020C9C0E0","version":"3","registrationstatus":"Standard","preferredname":"LAB_COLL_TM","preferreddefinition":"The time whe a sample for a lab test was collected.","workflow":"RELEASED","dateadded":"06-28-2016","usingContexts":null,"cdeid":"2003580","published":false},{"longname":"Lab Collection Time","longcdename":"Time","publicid":"2003580","contextname":"CCR","deIdseq":"A56E8150-8EAC-1CC3-E034-080020C9C0E0","conteIdseq":"A5599257-A08F-41D1-E034-080020C9C0E0","version":"3","registrationstatus":"Standard","preferredname":"LAB_COLL_TM","preferreddefinition":"The time whe a sample for a lab test was collected.","workflow":"RELEASED","dateadded":"06-28-2016","usingContexts":null,"cdeid":"2003580","published":false},{"longname":"Lab Collection Time","longcdename":"Time","publicid":"2003580","contextname":"CCR","deIdseq":"A56E8150-8EAC-1CC3-E034-080020C9C0E0","conteIdseq":"A5599257-A08F-41D1-E034-080020C9C0E0","version":"3","registrationstatus":"Standard","preferredname":"LAB_COLL_TM","preferreddefinition":"The time whe a sample for a lab test was collected.","workflow":"RELEASED","dateadded":"06-28-2016","usingContexts":null,"cdeid":"2003580","published":false},{"longname":"Lab Collection Time","longcdename":"Time","publicid":"2003580","contextname":"CCR","deIdseq":"A56E8150-8EAC-1CC3-E034-080020C9C0E0","conteIdseq":"A5599257-A08F-41D1-E034-080020C9C0E0","version":"3","registrationstatus":"Standard","preferredname":"LAB_COLL_TM","preferreddefinition":"The time whe a sample for a lab test was collected.","workflow":"RELEASED","dateadded":"06-28-2016","usingContexts":null,"cdeid":"2003580","published":false},{"longname":"Lab Collection Time","longcdename":"Time","publicid":"2003580","contextname":"CCR","deIdseq":"A56E8150-8EAC-1CC3-E034-080020C9C0E0","conteIdseq":"A5599257-A08F-41D1-E034-080020C9C0E0","version":"3","registrationstatus":"Standard","preferredname":"LAB_COLL_TM","preferreddefinition":"The time whe a sample for a lab test was collected.","workflow":"RELEASED","dateadded":"06-28-2016","usingContexts":null,"cdeid":"2003580","published":false},{"longname":"Lab Collection Time","longcdename":"Time","publicid":"2003580","contextname":"CCR","deIdseq":"A56E8150-8EAC-1CC3-E034-080020C9C0E0","conteIdseq":"A5599257-A08F-41D1-E034-080020C9C0E0","version":"3","registrationstatus":"Standard","preferredname":"LAB_COLL_TM","preferreddefinition":"The time whe a sample for a lab test was collected.","workflow":"RELEASED","dateadded":"06-28-2016","usingContexts":null,"cdeid":"2003580","published":false}];
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
				<h1 className="text--bold">Form Builder | CDE Cart</h1>
				<FormTable pagination={true} perPage={100} columnTitles={TABLECONFIG.CDE} data={this.data}></FormTable>
			</div>
		);
	}
}

CartLayout.propTypes = {
};
