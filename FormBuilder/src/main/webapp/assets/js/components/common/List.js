import React, {Component, PropTypes} from 'react';
import {Button} from 'react-bootstrap';

const List = (props) =>{
	const createListItem = (item, index) => {
		const activeItem = props.activeItem === item[props.itemKey];
		return (
			<li key={index}>
				<Button bsClass={`${(activeItem ? props.activeButtonClass : props.buttonItemClassName)}`} onClick={() =>{
					props.onClickCallback(item.cid);
				}}>{item[props.itemTextKey]}</Button>
			</li>
		);
	};
	return <ul className={props.className + " list-unstyled"}>{props.data.map(createListItem)}</ul>;

};

export default List;

List.defaultProps = {
	activeItemId:        '',
	buttonItemClassName: "button-link"
};

List.propTypes = {
	activeListItemClass: PropTypes.string,
	activeButtonClass:   PropTypes.string,
	buttonItemClassName: PropTypes.string,
	lisItemClassName:    PropTypes.string,
	onClickCallback:     PropTypes.func,
	className:           PropTypes.string,
	data:                PropTypes.array
};

