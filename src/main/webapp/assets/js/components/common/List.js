import React, {Component, PropTypes} from 'react';

const List = (props) =>{
	const createListItem = (item, index) => {
		if(props.displayAsLinks){
			return <li key={index}>{item.attributes.longName}</li>;
		}
	};

	return <ul className={props.className + " list-unstyled"}>{props.data.map(createListItem)}</ul>;

};

export default List;

List.defaultProps = {
	reversKeyValueOrder: false,
	data:                [{
		itemName: "itemValue"
	}],
	className:           ""
};

List.propTypes = {
	reversKeyValueOrder: PropTypes.bool,
	className:           PropTypes.string,
	data:                PropTypes.array
};

