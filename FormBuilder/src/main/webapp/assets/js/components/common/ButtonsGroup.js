import React, {Component, PropTypes} from 'react';
import {Button} from 'react-bootstrap';

const ButtonsGroup = (props) =>{
	const createButton = ({type = "button", className = "btn btn-primary", name}, index) =>{
		return <Button  type={type} className={className} key={index}>{name}</Button>;
	};

	return (
		<div>{props.buttons.map(createButton)}</div>
	);

};

export default ButtonsGroup;
