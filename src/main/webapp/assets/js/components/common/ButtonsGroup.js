import React, {Component, PropTypes} from 'react';
import {Button} from 'react-bootstrap';

const ButtonsGroup = (props) =>{
	const createButton = ({type = "button", className = "btn btn-primary", name, onClick =""}, index) =>{
		return <Button onClick={onClick ? props[onClick] :''} type={type} className={className} key={index}>{name}</Button>;
	};

	return (
		<div>{props.buttons.map(createButton)}</div>
	);

};

export default ButtonsGroup;

Button.propTypes = {
	onClick: PropTypes.string
};

ButtonsGroup.propTypes = {
	buttons: PropTypes.arrayOf(React.PropTypes.shape({
		name:      PropTypes.string.isRequired,
		type:      PropTypes.string,
		className: PropTypes.string,
		onClick:   PropTypes.string
	})).isRequired
};