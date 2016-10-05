import React from 'react';
import {Table as Reactable, Thead, Th, Tr, Td} from 'reactable';

export default class FormTable extends React.Component{

	constructor(props){
		super(props);
		console.log(this.props);
		this.state = {
			data: [
				{ Name: 'Griffin Smith', Age: '18', Position: 'BA', Id: '1', Selected: false },
				{ Age: '23',  Name: 'Lee Salminen', Position: 'Cashier', Id: '2', Selected: false },
				{ Age: '28', Position: 'Assistant Director', Name: 'Skinner', Id: '3', Selected: false },
				{ Name: 'Griffin Smith', Age: '18', Position:'Designer', Id: '4', Selected: false },
				{ Age: '30',  Name: 'Test Person', Position: 'QA', Id: '5', Selected: false},
				{ Name: 'Another Test', Age: '26', Position: 'Developer', Id: '6', Selected: false },
				{ Name: 'Third Test', Age: '19', Position: 'Salesperson', Id: '7', Selected: false },
				{ Age: '23',  Name: 'End of this Pge', Position: 'CEO1', Id: '8', Selected: false },
				{ Age: '25',  Name: 'End of tage', Position: 'CE231O', Id: '9', Selected: false },
				{ Age: '23',  Name: 'End of ts Page', Position: 'C3O', Id: '10', Selected: false },
				{ Age: '67',  Name: 'E of this Pae', Position: 'CE2', Id: '11', Selected: false },
				{ Age: '53',  Name: 'Ed  this Page', Position: 'CE1', Id: '12', Selected: false }
			]
		}
		if(this.props.pagination){
			this.state.currentPage = 2;
			this.totalPages = Math.ceil(this.state.data.length / this.props.perPage);
		}
		this.selectAllRows = this.selectAllRows.bind(this);
		this.addPagination = this.addPagination.bind(this);
		this.createPageItem = this.createPageItem.bind(this);
		this.changePage = this.changePage.bind(this);
	}

	selectAllRows(e){
		let data = this.state.data;

		for(let item of data){
			item.Selected = e.target.checked;
		}

		this.setState({data: data});
	}

	addPagination(){
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


	createPageItem(){
		let pagesArr = [(<li className="reactTable-pagination-item" key={'left'} aria-hidden="true">
			<button  onClick={()=>{this.changePage(this.state.currentPage - 1);}}
			         className={(this.state.currentPage == 1)? " reactTable-pagination-control disabled": "reactTable-pagination-control"}>PREV</button>
		</li>)];
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
		pagesArr.push((<li className="reactTable-pagination-item" key={'right'} aria-hidden="true">
			<button onClick={() =>{this.changePage(this.state.currentPage + 1);}}
			        className={(this.state.currentPage == this.totalPages)? " reactTable-pagination-control disabled": "reactTable-pagination-control"}
			>NEXT</button>
		</li>));
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
						<Th column='Id'>
							<input type='checkbox' onChange={this.selectAllRows}/>
						</Th>
						<Th column='Name'>Name <span className="icon icon-carrot-up-down"></span></Th>
						<Th column='Age'>Age <span className="icon icon-carrot-up-down"></span></Th>
						<Th column='Position'>Position <span className="icon icon-carrot-up-down"></span></Th>
					</Thead>
					{
						data.map( (item) => {
							return (
								<Tr key={item.Id}>
									<Td column='Id'>
										<input type="checkbox" value={item.Id} checked={item.Selected}/>
									</Td>
									<Td column='Name'>
										{item.Name}
									</Td>
									<Td column='Age'>
										{item.Age}
									</Td>
									<Td column='Position'>
										{item.Position}
									</Td>
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