import React, {Component, PropTypes} from 'react';
import {Button} from 'react-bootstrap';

const ButtonList = (props) =>{
	const createListItem = (item, index) => {
		const activeItem = props.activeItem === item[props.itemKey];
		const itemId = item[props.itemKey] || item.cid;
		return (
			<li key={index}>
				<Button bsClass={`${(activeItem ? props.activeButtonClass : props.buttonItemClassName)}`} onClick={() =>{
					props.onClickCallback(itemId);
				}}>{item[props.itemTextKey]}
				</Button>
			</li>
		);
	};
	return <ul className={props.className + " list-unstyled"}>{props.data.map(createListItem)}</ul>;

};

export default ButtonList;

ButtonList.defaultProps = {
	activeItemId:        '',
	buttonItemClassName: "button-link"
};
Button.propTypes = {
	onClick: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.func
	])
};

ButtonList.propTypes = {
	activeListItemClass: PropTypes.string,
	activeButtonClass:   PropTypes.string,
	buttonItemClassName: PropTypes.string,
	lisItemClassName:    PropTypes.string,
	onClickCallback:     PropTypes.func,
	className:           PropTypes.string,
	data:                PropTypes.array
};

