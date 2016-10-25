export const getCdeCartCollectionPojo = (cdeCollection) =>{
	return cdeCollection.models.map(model =>{
		return Object.assign({}, model.attributes.dataElement, {
			parentQuestionModelId: model.id,
			id: model.attributes.deIdseq});
	});
};

export const getFormCartCollectionPojo = (formCartCollection) =>{
	return formCartCollection.models.map(model =>{
		return Object.assign({}, model.attributes, {
			id:    model.attributes.formIdseq,
			contextName:      (model.get('context')) ? model.get('context').name : '',
			protocolLongName: (model.get('protocols')) ? model.get('protocols')[0].longName : ''
		});
	});
};

export const getModuleCartCollectionPojo = (moduleCartCollection) =>{
	return moduleCartCollection.models.map(model =>{
		return {
			longName:           model.attributes.longName,
			instructions:       model.attributes.instructions,
			id:                 model.attributes.moduleIdseq,
			numQuestions:       model.attributes.numQuestions,
			originFormLongName: model.attributes.form.longName,
			originFormContext:  model.attributes.form.context,
			originFormPublicId: model.attributes.form.publicId,
			originFormVersion:  model.attributes.form.version
		};
	});
};