
export const getCdeCartCollectionPojo = (cdeCollection) => {
	return cdeCollection.models.map(model =>{
		return Object.assign({}, model.attributes.dataElement, {id: model.cid});
	});
};

export const getFormCartCollectionPojo = (formCartCollection) => {
	return formCartCollection.models.map(model =>{
		return Object.assign({}, model.attributes, {cid: model.cid, contextName: model.get('context').name, protocolLongName: model.get('protocols')[0].longName});
	});
};

export const getModuleCartCollectionPojo = (formCartCollection) => {
	return formCartCollection.models.map(model =>{
		return {};
	});
};