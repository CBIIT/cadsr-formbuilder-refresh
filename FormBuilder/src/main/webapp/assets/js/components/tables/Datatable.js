import React, {Component, PropTypes} from 'react';
import EVENTS from '../../constants/EVENTS';
import {cartChannel} from '../../channels/radioChannels';
import {Table as Reactable, Thead, Th, Tr, Td} from 'reactable';
import {Glyphicon, DropdownButton, MenuItem} from 'react-bootstrap';

/*
Props:
	data (arr),
	columnTitles (arr),
	pagination (bool),
	perPage (int),
	pageName (string)
 */

/*
	State:
	data (arr): complete collection of modules,
	displayedData (arr): shortened collection of models that are only supposed to show for a given page
	selectedRows (arr): copies of models that have their checkbox checked. Could be used for the download functionality
	columnTitles (arr): collection of objects that represent the columns to display for the table. { name: 'column
	                    name, key: 'key_in_the_model'}
	 currentPage (int): reference for the current page being displayed in the table

 */

/*
	Class properties:
	this.totalPages (int): calculation for the amount of pages the table will display

 */
export default class Datatable extends React.Component{

	constructor(props){
		super(props);
		//function bindings
		this.selectAllRows = this.selectAllRows.bind(this);
		this.formatData = this.formatData.bind(this);
		this.addPagination = this.addPagination.bind(this);
		this.createPageItem = this.createPageItem.bind(this);
		this.changePage = this.changePage.bind(this);
		this.selectRow = this.selectRow.bind(this);
		this.addControls = this.addControls.bind(this);
		this.sortColumn = this.sortColumn.bind(this);
		this.makeArrows = this.makeArrows.bind(this);
		this.renderToolbarDropdown = this.renderToolbarDropdown.bind(this);
		this.setInitialState = this.setInitialState.bind(this);
		this.updateState = this.updateState.bind(this);
		//initial state setup. This may need to be moved into another function other than the constructor
		this.setInitialState();

		this.dispatchDownloadXML = this.dispatchDownloadXML.bind(this);
		this.dispatchDownloadXLS = this.dispatchDownloadXLS.bind(this);
/*
		this.dispatchLastSortedByKey = this.dispatchLastSortedByKey.bind(this);
*/
		this.dispatchRemoveSelectedFromCart = this.dispatchRemoveSelectedFromCart.bind(this);
		this.getSelectedItemIds = this.getSelectedItemIds.bind(this);
	}

	componentWillReceiveProps(nextProps){
		this.updateState(nextProps);
	}
	componentWillUpdate(){
		console.log('will update table');
	}
	getSelectedItemIds() {
		let selectedItemIds = [];
		this.state.displayedData.forEach((item) => {
			if (item.selected){
				selectedItemIds.push(item.id);
			}
		});
		return selectedItemIds;
	}
	dispatchDownloadXLS() {
		const itemsIds = this.getSelectedItemIds();
		cartChannel.request(EVENTS.CARTS.GET_DOWNLOAD_XLS,
			{itemsIds: itemsIds});
	}
	dispatchDownloadXML() {
		const itemsIds = this.getSelectedItemIds();
		cartChannel.request(EVENTS.CARTS.GET_DOWNLOAD_XML,
			{itemsIds: itemsIds});
	}
	/**
	 * Consider this a temporary hack until we can use ComponentWillUnMount or React-Router's NavigateFrom to communicate the last way the collection was sorted before leaving the page. This currently does it every time the user sorts.
	 */
	/*dispatchLastSortedByKey({sortKey, sortOrder}) {
		cartChannel.request(EVENTS.CARTS.SET_LAST_CART_SORTED_BY,
			{sortKey:sortKey, sortOrder:sortOrder});
	}*/
	dispatchRemoveSelectedFromCart() {
		const itemsToRemove = this.getSelectedItemIds();
		cartChannel.request(EVENTS.CARTS.REMOVE_CART_ITEM,
			{itemsToRemove: itemsToRemove});
	}
	setInitialState() {
		const shouldHavePagination = this.props.pagination;
		const initialState = {
			data: this.formatData(this.props.data, this.props.columnTitles),
			selectedRows: [],
			columnTitles : this.props.columnTitles
		};

		if(shouldHavePagination){
			initialState.currentPage = 1;
			initialState.displayedData = initialState.data.slice(0, this.props.perPage);
		}
		else{
			initialState.displayedData = initialState.data;
		}
		this.totalPages = Math.ceil(initialState.data.length / this.props.perPage);
		/*Set initial state at once*/
		this.state = initialState;
	}
	updateState(nextProps) {
		const shouldHavePagination = nextProps.pagination;
		const newState = {
			data: this.formatData(nextProps.data, nextProps.columnTitles),
			selectedRows: [],
			columnTitles : nextProps.columnTitles,
			displayedData: (shouldHavePagination) ? nextProps.data.slice(0, nextProps.perPage) : nextProps.data
		};
		if(shouldHavePagination){
			newState.currentPage = 1;
			this.totalPages = Math.ceil(nextProps.data.length / nextProps.perPage);
		}
		this.setState(newState);
	}
	formatData(dataCollection, columnCollection){
		/*massages data property to map each item to a key within the column collection

			Example:

			dataCollection: [ { 'name': 'Bob', 'age': 12, 'color': 'green' }, { 'name': 'Kim', 'age': 16, 'color':
			 'orange' }];

			columnCollection: [ {'name': 'Name', 'key': 'name'}, {'name': 'Favorite Color', 'key': 'color'}];

			newCollection: [{'name': 'Bob', 'color': 'green'}, {'name': 'Kim', 'color': 'orange'}];

			**returns newCollection**

			In this example, the dataCollection array is mapped against the columnCollection. For each item in the
			 columnCollection, the respective key is then found within the dataCollection and put into a new array
			  to be returned. Since there is no 'age' column, that property for each person is ignored. The table
			   will then render two columns: one that says Name and one that says Favorite Color.

			It is very important to ensure the key property in the columnCollection matches up to an expected key in
			 the dataCollection.

			This function also adds a new property called 'selected' to each item. This is used to render the state
			 of the checkboxes.
		*/
		var newDataCollection = [];
		dataCollection.map( (dataItem, index) =>{
			let newItem = {};
			for(let i=0; i < columnCollection.length; i++){
				newItem[columnCollection[i].key] = dataItem[columnCollection[i].key];
			}
			newItem.selected = false; //set this to false so all of them are unselected at the start.
			newItem.id = dataItem.id;
			newDataCollection.push(newItem);
		});
		return newDataCollection;
	}

	selectAllRows(e){ //select all the rows at once and add (or remove) each row to / from the selectedRows collection.
		let selectAllIsChecked = e.target.checked;
		let data = this.state.data,
			selectedRows = [];

		for(let item of data){
			item.selected = selectAllIsChecked;
		}
		if(selectAllIsChecked){
			selectedRows = data;
		}
		else{
			selectedRows = [];
		}
		let displayedData = this.getCurrentDisplayData(data);

		this.setState({data: data, selectedRows: selectedRows, displayedData: displayedData});
	}

	selectRow(e){ //ensures a row is selected when a checkbox is clicked
		let data = this.state.data;
		let selectedRows = this.state.selectedRows;
		let index = data.findIndex( (element)=>{
			return element.id === e;
		});
		data[index].selected = !data[index].selected;
		if(data[index].selected){
			//selected a row, so add it to the collection
			selectedRows.push(data[e]);
		}
		else if(selectedRows.length === 1){
			//if you're deselecting the only item, make it an empty collection
			selectedRows = [];
		}
		else{
			//remove the selected row from the collection if it is being deselected
			selectedRows = selectedRows.filter( (row) => {
				return (row.id != e);
			});
		}
		let displayedData = this.getCurrentDisplayData(data);
		this.setState({data : data, selectedRows : selectedRows, displayedData: displayedData });

	}

	addPagination(top){ //actually renders pagination
		if(this.props.pagination){
			return (
				<div className="clearfix">
					<ul className={ (top)?"reactTable-pagination reactTable-pagination--top" : "reactTable-pagination"}>
						{
							this.createPageItem().map( (item) =>{
								return (item);
							})
						}
					</ul>
				</div>
			);
		}
	}


	createPageItem(){ //creates the pagination buttons
		//pagesArr is an array of JSX <li> elements that represent each page button
		//By default, a button that says "Previous" should be added to the first spot in the array
		let pagesArr = [(<li className="reactTable-pagination-item" key={'left'} aria-hidden="true">
			<button onClick={()=>{this.changePage(this.state.currentPage - 1);}} className={(this.state.currentPage == 1)? " reactTable-pagination-control disabled": "reactTable-pagination-control"}>PREV</button>
		</li>)];
		if(this.totalPages === 1){
			//If there is only one page, remove that first button
			pagesArr = [];
		}
		//this next section is figuring out where to start the first number.
		let index = 0;
		if(this.totalPages < 10){
			index = 1;
		}
		else{
			if(this.state.currentPage > this.totalPages-7){
				index = this.totalPages - 7;
			}
			else{
				index = this.state.currentPage;
			}
		}
		//Add buttons for each page starting from the first index
		for(let i = index; i <= this.totalPages; i++){
			if(this.totalPages > 10 && i <= this.totalPages - 4){
				//if there are more than 10 pages and you are currently more than 4 pages away from the end
				if(i > this.state.currentPage + 3){
					//if there are more than 10 pages and you are more than 3 pages away from the last page,
					//bring the index back by one and add in an ellipsis button
					i = this.totalPages - 1;
					pagesArr.push(<li className="reactTable-pagination-item" key={'ellip'} aria-hidden="true">…</li>);

				}
				pagesArr.push(<li className="reactTable-pagination-item" key={i}>
					<button onClick={()=>{this.changePage(i);}} className={(this.state.currentPage == i)? "active" : ""}>{i}</button>
				</li>);
			}
			//If you are less than 4 pages from the end or there are less than 10 pages
			else if(i !== this.totalPages){
				//if you're not the last page, add a button
				pagesArr.push(<li className="reactTable-pagination-item" key={i}>
					<button onClick={()=>{this.changePage(i)}} className={(this.state.currentPage == i)? "active" : ""}>{i}</button>
				</li>);
			}
			else{
				pagesArr.push(<li className="reactTable-pagination-item" key={i}>
					<button onClick={()=>{this.changePage(i);}} className={(this.state.currentPage == i)? "active" : ""}>{i}</button>
				</li>);
			}
		}
		if(this.totalPages !== 1){
			//add a next button if there is more than one page
			pagesArr.push((<li className="reactTable-pagination-item" key={'right'} aria-hidden="true">
				<button onClick={() =>{
					this.changePage(this.state.currentPage + 1);
				}} className={(this.state.currentPage == this.totalPages) ? " reactTable-pagination-control disabled" : "reactTable-pagination-control"}>NEXT
				</button>
			</li>));
		}
		//return the array of <li>s to be rendered
		return pagesArr;
	}

	changePage(pageNum){
		//adjusts the current selected page
		if(pageNum < 1){
			return; //can't have a page 0;
		}
		if(pageNum > this.totalPages){
			return; //can't go past the last page either
		}
		let perPage = this.props.perPage,
			startNum = perPage * (pageNum-1),
			endNum =  perPage * pageNum,
			collection = this.state.data,
			displayedData = collection.slice(startNum, endNum);
		this.setState({currentPage: pageNum, displayedData: displayedData}); //update state to rerender
	}

	getCurrentDisplayData(collection){
		//determines which chunk of models should be show in the table based on the current page
		let perPage = this.props.perPage,
			page = this.state.currentPage,
			startNum = perPage * (page-1),
			endNum =  perPage * page,
			displayedData = collection.slice(startNum, endNum);
		return displayedData;
	}
	addControls(){
		//adds the blue bar to the top fo the table. This currently doesn't do anything
		return(
			<div className="reactTable-controlPanel">
				<ul className="controlPanel-list">
					<li>{this.state.selectedRows.length} {this.props.pageName}(s) Selected</li>
					<li>
						<button onClick={this.dispatchRemoveSelectedFromCart} className="controlPanel-btn"> REMOVE FROM CART <Glyphicon glyph="trash"/></button>
					</li>
					{this.renderToolbarDropdown()}
				</ul>
			</div>
		);
	}
	renderToolbarDropdown () {
		if (this.props.pageName === 'CDE' || this.props.pageName === 'FORM') {
			return (
				<li>
					<DropdownButton className="controlPanel-btn" title="DOWNLOAD">
						<MenuItem onClick={this.dispatchDownloadXLS} eventKey="1"><i className="controlPanel-icon fa fa-file-excel-o"></i> DOWNLOAD EXCEL</MenuItem>
						<MenuItem onClick={this.dispatchDownloadXML} eventKey="2"><i className="controlPanel-icon fa fa-file-code-o"></i> DOWNLOAD XML</MenuItem>
					</DropdownButton>
				</li>
			);
		}
	}
	sortColumn(columnName, elem){
		//sorts column based on which title was clicked
		let data = this.state.data;
		let columnTitles = this.state.columnTitles;
		let columnSort = this.state.columnTitles.filter( (title)=>{
			return title.name === columnName;
		}); //find which column you're sorting by
		//set arrows to be the right direction
		if(columnSort[0].sort === ''){
			for(let i of columnTitles){
				//reset collection because this is a new sort
				i.sort = '';
			}
			columnSort[0].sort = 'asc'; //default to ascending for selected column
		}
		else if(columnSort[0].sort === 'asc'){
			columnSort[0].sort = 'desc'; //flip sorting to descending
		}
		else{
			columnSort[0].sort = 'asc'; //flip to ascending
		}

		data = _.sortBy( data, (item) => { //lodash's sortBy function based on new sort column
			return item[columnSort[0].key];
		});
		if(columnSort[0].sort === 'desc'){
			data = data.reverse();
		}

		let index = this.props.columnTitles.findIndex( (element)=>{
			return element.key === columnSort[0].key;
		});
		columnTitles[index] = columnSort[0]; //set the newly changed column object to be at the same index in the state
		let displayedData = this.getCurrentDisplayData(data); //re-calculate which data to display with new order
		this.setState({data : data, columnTitles: columnTitles, displayedData: displayedData}); //update state
		/*this.dispatchLastSortedByKey({sortKey: columnSort[0].key, sortOrder: columnSort[0].sort});*/
	}

	makeArrows(title){
		//logic to determine which arrow should be displayed
		if(title.sort === 'asc'){
			return (<span className="icon icon-carrot-down reactTable-control"></span>);
		}
		else if(title.sort === 'desc'){
			return (<span className="icon icon-carrot-up reactTable-control"></span>);
		}
		else{
			return (<span className="icon icon-carrot-up-down reactTable-control"></span>);
		}
	}

	render(){
		const displayedData = this.state.displayedData;

		return(
			<section>
				{
					this.addControls()
				}
				{
					this.addPagination(true)
				}
				<span className="reactTable-total">TOTAL ITEMS IN CART: {this.state.data.length}</span>
				<div className="reactTable-wrap">
					<Reactable id="table" className="table reactTable">
						<Thead>
							<Th column="checkbox">
								<input type='checkbox' onChange={this.selectAllRows}/>
							</Th>
							{
								this.state.columnTitles.map( (title) =>{
									return(
										<Th key={title.name} column={title.name}>
											<span
											      onClick={ (e)=>{ this.sortColumn(title.name, e.target)}}
											>
												{
													title.name
												}
												{
													this.makeArrows(title)
												}
											</span>
										</Th>
									);
								})
							}
						</Thead>
						{
							displayedData.map( (item) => {
								return (
									<Tr key={item.id}>
										<Td key={'checkbox'} column="checkbox">
											<input type="checkbox" value={item.id}
										       onChange={() =>{ this.selectRow(item.id);}}
											   checked={item.selected}/>
										</Td>
										{
											this.props.columnTitles.map( (title, index) => {
												return(
													<Td key={ title+index} column={title.name}>
														{item[title.key]}
													</Td>
												);
											})
										}
									</Tr>
								);
							})
						}
					</Reactable>
					</div>
				<span className="reactTable-total reactTable-total--bottom">TOTAL ITEMS IN CART: {this.state.data.length}</span>
				{
					this.addPagination()
				}
			</section>
		);
	}
};

Datatable.propTypes = {
	data: PropTypes.array,
	columnTitles: PropTypes.array,
	pagination: PropTypes.bool,
	perPage: PropTypes.number,
	pageName: PropTypes.string
};