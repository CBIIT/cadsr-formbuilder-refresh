import React from 'react';
import {Table as Reactable, Thead, Th, Tr, Td} from 'reactable';

export default class FormTable extends React.Component{

	constructor(props){
		super(props);

		this.selectAllRows = this.selectAllRows.bind(this);
		this.formatData = this.formatData.bind(this);
		this.addPagination = this.addPagination.bind(this);
		this.createPageItem = this.createPageItem.bind(this);
		this.changePage = this.changePage.bind(this);
		this.selectRow = this.selectRow.bind(this);

		this.state = {
			data: this.formatData(this.props.data, this.props.columnTitles),
			selectedRows: []
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

	addPagination(){ //actually renders pagination
		if(this.props.pagination){
			return (
				<div>
					<ul className="reactTable-pagination">
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

	render(){
		const data = this.state.data;

		return(
			<section>
				{
					this.addPagination()
				}
				<Reactable id="table" className="table reactTable">
					<Thead>
						<Th column="checkbox">
							<input type='checkbox' onChange={this.selectAllRows}/>
						</Th>
						{
							this.props.columnTitles.map( (title) =>{
								return(
									<Th key={title.name} column={title.name}>{title.name} <span className="icon icon-carrot-up-down"></span></Th>
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
				{
					this.addPagination()
				}
			</section>
		);
	}
};