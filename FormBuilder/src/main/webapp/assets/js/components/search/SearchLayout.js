/**
 * Created by nmilos on 10/14/16.
 */
import React, {Component, PropTypes} from 'react';
import backboneReact from 'backbone-react-component';
import ROUTES from '../../constants/ROUTES';
import formRouter from  "../../routers/FormRouter";
//import cartActions from '../../constants/cartActions';
//import FormTable from '../formTable/formTable';
//import TABLECONFIG from '../../constants/TABLE_CONFIGS';
import backboneModelHelpers from "../../helpers/backboneModelHelpers";

export default class SearchLayout extends Component {
	constructor(props){
		super(props);
		this.dispatchCreateForm = this.dispatchCreateForm.bind(this);
		this.renderLeft = this.renderLeft.bind(this);
		this.renderMiddle = this.renderMiddle.bind(this);
		this.renderFormItems = this.renderFormItems.bind(this);
	}

	/*componentWillMount(){
		/* watch for changes on these backbone models/collections and re-render
		backboneReact.on(this, {
			models: {
				searchPageStateModel: this.props.searchPageStateModel
			},
			collections: {
				data: this.props.data
			}
		});
	}*/
	componentWillUpdate(nextProps, nextState) {

	}
	componentWillUnmount(){
		//backboneReact.off(this);
	}

	dispatchCreateForm () {
		formRouter.navigate(ROUTES.FORM.CREATE_FORM, {trigger: true});
	}

	renderFormItems(){
		return(
		<form className="search-form">
			<div className="formItem">
				<label for="Long Name" className="formItem-label">FORM LONG NAME</label>
				<input type="text" className="formItem-input" id="Long Name"/>
			</div>
			<div className="clearfix formColumns">
				<div className="pull-left formColumn">
					<div className="formItem">
						<label for="Public ID" className="formItem-label">PUBLIC ID</label>
						<input type="text" className="formItem-input" id="Public ID"/>
					</div>
					<div className="formItem">
						<label for="CSI" className="formItem-label">CS / CSI</label>
						<input type="text" className="formItem-input" id="CSI"/>
					</div>
				</div>
				<div className="pull-right formColumn">
					<div className="formItem">
						<label for="CDE Public ID" className="formItem-label">CDE PUBLIC ID</label>
						<input type="text" className="formItem-input" id="CDE Public ID"/>
					</div>
					<div className="formItem">
						<label for="Protocol" className="formItem-label">PROTOCOL</label>
						<input type="text" className="formItem-input" id="Protocol"/>
					</div>
				</div>
			</div>
			<div className="formItem">
				<label for="Module Input" className="formItem-label">Module</label>
				<input type="text" className="formItem-input" id="Module Input"/>
			</div>
			<div className="formItem">
				<div className="formItem--row">
					<input type="checkbox" className="formItem-input" id="Latest"/>
					<label for="Latest" className="formItem-label">LATEST VERSIONS ONLY</label>
				</div>
				<div className="formItem--row">
					<input type="checkbox" className="formItem-input" id="Test"/>
					<label for="Test" className="formItem-label">EXCLUDE TEST</label>
				</div>
				<div className="formItem--row">
					<input type="checkbox" className="formItem-input" id="Training"/>
					<label for="Training" className="formItem-label">EXCLUDE TRAINING</label>
				</div>
				<div className="formItem--row formItem-reset">
					<button type="reset" className="btn btn-link">CLEAR ALL</button>
				</div>
				<div className="formItem--row formItem-submit">
					<button type="reset" value="Submit" id="search-button" className="btn btn-primary">SEARCH</button>
				</div>
			</div>
			<div className="button-group">
				<input type="submit" className="btn btn-primary" id="search-button" value="Submit"/>
			</div>
		</form>
		);
	}

	/**
	 *
	 * @returns {boolean}
	 */
	renderLeft(){
		return(
			<div className="search-left">
				<h3 className="search-subtitle">FORM DIRECTORY</h3>
				<div className="panel">
					<p className="panel-temp">
						<em>Coming soon...</em>
					</p>
				</div>
			</div>
		);
	}
	renderMiddle(){
		return(
			<div id="search-form-wrapper" className="search-middle">
				<div className="clearfix">
					<h3 className="search-subtitle">FORM SEARCH</h3>
					<div className="search-desc-wrap">
						<p className="search-desc">
						Not sure what you're looking for? Use the Form Directory to browse and view all existing forms in the database.
						</p>
						<p className="search-desc">
							Alternatively, use Form Search to find and view forms. The Wildcard character is " * ".
						</p>
					</div>
				</div>
				{
					this.renderFormItems()
				}

			</div>
		);
	}

	render(){
		return (
			<div id="search">
				<div className="clearfix">
					<h2 className="search-title">FormBuilder</h2>
					<button className="create-new-form-button btn btn-primary" type="button" onClick={
						() =>{
							this.dispatchCreateForm();
						}
					}>
						Create a New Form
					</button>

				</div>
				<hr className="panel-divider"/>
				<div className="clearFix">
					{
						this.renderLeft()
					}
					{
						this.renderMiddle()
					}
				</div>

				<div id="search-results-wrapper">
				</div>
			</div>
		);
	}
}

SearchLayout.propTypes = {
};
