import React, {PropTypes} from 'react';
import {Button} from 'react-bootstrap';

const ButtonsGroup = (props) =>{
	/* We can use the Rest operator for adding attibutes instead of specifying each one
	 * http://stackoverflow.com/questions/29103096/dynamic-attribute-in-reactjs#answer-39543045
	 * */
	const createButton = ({type = "button", className = "btn btn-primary", name, onClick = "", disabled = false}, index) =>{
		return (
			<Button disabled={disabled} onClick={onClick ? props[onClick] : ''} type={type} className={className} key={index}>{name}</Button>
		);
	};

	return (
		<div className={props.containerClassName}>{props.buttons.map(createButton)}</div>
	);

};

export default ButtonsGroup;

Button.propTypes = {
	onClick: PropTypes.string
};

ButtonsGroup.defaultProps = {
	containerClassName : "buttonsGroup"
};

ButtonsGroup.propTypes = {
	buttons: PropTypes.arrayOf(React.PropTypes.shape({
		name:      PropTypes.string.isRequired,
		type:      PropTypes.string,
		className: PropTypes.string,
		onClick:   PropTypes.string
	})).isRequired
};