import React, {PropTypes} from 'react';
import ButtonsGroup from '../../common/ButtonsGroup';

const FormItemToolbar = (props) =>{
	const buttonClassName = 'button-link toolbar-button';
	const buttons = [];

	if (props.shouldDisplayCopyItem) {
		buttons.push({
			name: `Copy ${props.itemType} to Cart`,
			onClick: "dispatchCopyItem",
			className: buttonClassName
		});
	}
	if (props.shouldDisplayRemoveItem) {
		buttons.push({
			name: `Remove ${props.itemType}`,
			onClick: "handleRemoveItemClicked",
			className: buttonClassName
		});
	}

	return (
		<div>
			<ButtonsGroup dispatchCopyItem={props.dispatchCopyItem} handleRemoveItemClicked={props.dispatchRemoveItem} buttons={buttons}/>
		</div>
	);
};

export default FormItemToolbar;

FormItemToolbar.PropTypes = {
	itemType: PropTypes.string,
	shouldDisplayCopyItem: PropTypes.bool,
	shouldDisplayRemoveItem: PropTypes.bool,
	dispatchRemoveItem: PropTypes.func,
	dispatchCopyItem: PropTypes.func
};