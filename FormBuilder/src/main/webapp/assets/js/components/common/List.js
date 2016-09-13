import React, {Component, PropTypes} from 'react';
import {Button} from 'react-bootstrap';

const List = (props) =>{
	const createListItem = (item, index) => {
		return (
			<li key={index}>
				<Button onClick={() => {props.onClickCallback(item.cid)}}>{item[props.itemTextKey]}</Button>
			</li>
		);
	};
	return <ul className={props.className + " list-unstyled"}>{props.data.map(createListItem)}</ul>;

};

export default List;

List.propTypes = {
	onClickCallback: PropTypes.func,
	reversKeyValueOrder: PropTypes.bool,
	className:           PropTypes.string,
	data:                PropTypes.array
};

