export const getCdeCartCollectionPojo = (cdeCollection) =>{
	return cdeCollection.models.map(model =>{
		return Object.assign({}, model.attributes.dataElement, {id: model.attributes.deIdseq});
	});
};

export const getFormCartCollectionPojo = (formCartCollection) =>{
	return formCartCollection.models.map(model =>{
		return Object.assign({}, model.attributes, {
			id:               model.cid,
			contextName:      (model.get('context')) ? model.get('context').name : '',
			protocolLongName: (model.get('protocols')) ? model.get('protocols')[0].longName : ''
		});
	});
};

export const getModuleCartCollectionPojo = (formCartCollection) =>{
	return formCartCollection.models.map(model =>{
		return {
			longName:           model.attributes.longName,
			instructions:       model.attributes.instructions,
			id:                 model.attributes.moduleIdseq,
			numQuestions:       model.attributes.questions.length,
			originFormLongName: model.attributes.form.longName,
			originFormContext:  model.attributes.form.context,
			originFormPublicId: model.attributes.form.publicId,
			originFormVersion:  model.attributes.form.version
		};
	});
};