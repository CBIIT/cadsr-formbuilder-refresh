export const getOptions = ({options, optionKey = "name", labelKey, addDefaultSelect = false}) =>{
	let mappedOptions = options.map((item) =>{
		return {value: item[optionKey], label: item[labelKey]};
	});

	/* Add a default item */
	if(addDefaultSelect) {
		mappedOptions.unshift({value: '', label: 'Select...'});
	}
	return mappedOptions;
};