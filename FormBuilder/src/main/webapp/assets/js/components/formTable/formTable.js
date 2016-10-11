import React from 'react';
import {Table as Reactable, Thead, Th, Tr, Td} from 'reactable';
import {Glyphicon, DropdownButton, MenuItem} from 'react-bootstrap';

/*
Props:
data (arr),
columnTitles (arr),
pagination (bool),
perPage (int)
 */
export default class FormTable extends React.Component{

	constructor(props){
		super(props);

		this.selectAllRows = this.selectAllRows.bind(this);
		this.formatData = this.formatData.bind(this);
		this.addPagination = this.addPagination.bind(this);
		this.createPageItem = this.createPageItem.bind(this);
		this.changePage = this.changePage.bind(this);
		this.selectRow = this.selectRow.bind(this);
		this.addControls = this.addControls.bind(this);
		this.sortColumn = this.sortColumn.bind(this);
		this.makeArrows = this.makeArrows.bind(this);

		this.state = {
			data: this.formatData(this.props.data, this.props.columnTitles),
			selectedRows: [],
			columnTitles : this.props.columnTitles
		};

		if(this.props.pagination){
			this.state.currentPage = 1;
			this.totalPages = Math.ceil(this.state.data.length / this.props.perPage);
		}
	}

	formatData(dataCollection, columnCollection){
		var newDataCollection = [];
		dataCollection.map( (dataItem, index) =>{
			let newItem = {};
			for(let i=0; i < columnCollection.length; i++){
				newItem[columnCollection[i].key] = dataItem[columnCollection[i].key];
			}
			newItem.selected = false;
			newItem.id = index;
			newDataCollection.push(newItem);
		});
		return newDataCollection;
	}

	selectAllRows(e){ //select all the rows at once
		let data = this.state.data,
			selectedRows = [];

		for(let item of data){
			item.selected = e.target.checked;
		}
		if(e.target.checked){
			selectedRows = data;
		}
		else{
			selectedRows = [];
		}

		this.setState({data: data, selectedRows: selectedRows});
	}

	selectRow(e){ //ensures a row is selected when a checkbox is clicked
		let data = this.state.data;
		let selectedRows = this.state.selectedRows;
		data[e].selected = !data[e].selected;
		if(data[e].selected){
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
		this.setState({data : data, selectedRows : selectedRows });

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
		let pagesArr = [(<li className="reactTable-pagination-item" key={'left'} aria-hidden="true">
			<button  onClick={()=>{this.changePage(this.state.currentPage - 1);}}
			         className={(this.state.currentPage == 1)? " reactTable-pagination-control disabled": "reactTable-pagination-control"}>PREV</button>
		</li>)];
		if(this.totalPages === 1){
			pagesArr = [];
		}
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
		for(let i = index; i <= this.totalPages; i++){
			if(this.totalPages > 10 && i <= this.totalPages - 4){
				if(i > this.state.currentPage + 3){
					i = this.totalPages - 1;
					pagesArr.push(<li className="reactTable-pagination-item" key={'ellip'} aria-hidden="true">…</li>);

				}
				pagesArr.push(<li className="reactTable-pagination-item" key={i}>
					<button onClick={()=>{this.changePage(i);}} className={(this.state.currentPage == i)? "active" : ""}>{i}</button>
				</li>);
			}
			else if(i !== this.totalPages){
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
			pagesArr.push((<li className="reactTable-pagination-item" key={'right'} aria-hidden="true">
				<button onClick={() =>{
					this.changePage(this.state.currentPage + 1);
				}} className={(this.state.currentPage == this.totalPages) ? " reactTable-pagination-control disabled" : "reactTable-pagination-control"}>NEXT
				</button>
			</li>));
		}
		return pagesArr;
	}

	changePage(pageNum){
		if(pageNum < 1){
			return; //can't have a page 0;
		}
		if(pageNum > this.totalPages){
			return; //can't go past the last page either
		}
		this.setState({currentPage: pageNum});
	}

	addControls(){
		return(
			<div className="reactTable-controlPanel">
				<ul className="controlPanel-list">
					<li>
						{ this.state.selectedRows.length } CDE(s) SELECTED
					</li>
					<li>
						<button className="controlPanel-btn"> REMOVE FROM CART <Glyphicon glyph="trash"/></button>
					</li>
					<li>
						<DropdownButton className="controlPanel-btn" title="CHOOSE TYPE">
							<MenuItem eventKey="1">DOWNLOAD EXCEL</MenuItem>
							<MenuItem eventKey="2">DOWNLOAD XML</MenuItem>
						</DropdownButton>
					</li>
				</ul>
			</div>
		);
	}

	sortColumn(columnName, elem){
		let data = this.state.data;
		let columnTitles = this.state.columnTitles;
		let columnSort = this.state.columnTitles.filter( (title)=>{
			return title.name === columnName;
		});
		//set arrows to be the right direction
		if(columnSort[0].sort === ''){
			for(let i of columnTitles){
				//reset collection
				i.sort = '';
			}
			columnSort[0].sort = 'asc';
		}
		else if(columnSort[0].sort === 'asc'){
			columnSort[0].sort = 'desc';
		}
		else{
			columnSort[0].sort = 'asc';
		}

		data = _.sortBy( data, (item) => {
			return item[columnSort[0].key];
		});
		if(columnSort[0].sort === 'desc'){
			data = data.reverse();
		}

		let index = this.props.columnTitles.findIndex( (element)=>{
			return element.key === columnSort[0].key;
		});
		columnTitles[index] = columnSort[0];
		this.setState({data : data, columnTitles: columnTitles});

	}
	makeArrows(title){
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
		const data = this.state.data;

		return(
			<section>
				{
					this.addControls()
				}
				{
					this.addPagination(true)
				}
				<span className="reactTable-total">TOTAL ITEMS IN CART: {this.state.data.length}</span>
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
						data.map( (item) => {
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
				<span className="reactTable-total reactTable-total--bottom">TOTAL ITEMS IN CART: {this.state.data.length}</span>
				{
					this.addPagination()
				}
			</section>
		);
	}
};