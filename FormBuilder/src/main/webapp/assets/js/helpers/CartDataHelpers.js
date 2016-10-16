
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
		return {
			longName: model.attributes.longName,
			instructions: model.attributes.instructions,
			moduleIdseq: model.attributes.moduleIdseq,
			numQuestions:  model.attributes.questions.length,
			originFormLongName: model.attributes.form.longName,
			originFormContext: model.attributes.form.context,
			originFormPublicId: model.attributes.form.publicId,
			originFormVersion: model.attributes.form.version
		};
	});
};