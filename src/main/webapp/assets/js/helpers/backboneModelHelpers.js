const backboneModelHelpers = {
	/**
	 * Recursively run toJSON on a backbone model or backbone collection and optionally include the model's cid
	 * @param model
	 * @param includeCid
	 */
	getDeepModelPojo(model, includeCid = true){
		let json = _.clone(model.attributes);

		function checkKeys(json){
			for(let attr in json){

				if(json[attr] && (json[attr].attributes || json[attr].models)){
					if(json[attr].attributes){
						json[attr] = Object.assign({}, json[attr].attributes, (includeCid ? {cid: json[attr].cid} : {}));
					}
					else if(json[attr].models){
						json[attr] = json[attr].models.map((model) =>{
							return Object.assign({}, model.attributes, (includeCid ? {cid: model.cid} : {}));
						});
					}
					checkKeys(json[attr]);
				}
				/*TODO Fix hardcoding of validValues here*/
				else if(json[attr] && json[attr].validValues){
					json[attr].validValues = json[attr].validValues.models.map((model) =>{
						return Object.assign({}, model.attributes, (includeCid ? {cid: model.cid} : {}));
					});
				}
			}
		}

		checkKeys(json);
		return json;

	},
	setCollectionModelsComparatorValue ({collection, comparator, increment, otherAttrsToSet}) {
		comparator = comparator || collection.comparator;
		collection.models.forEach((model) =>{
			const modelIndex = model.attributes[comparator];
			const newModelIndex = modelIndex + increment;
			if(typeof otherAttrsToSet === "object"){
				model.set(Object.assign({}, {[comparator]: newModelIndex}, otherAttrsToSet));
			}
			else{
				model.set({[comparator]: newModelIndex});
			}
		});
	}
};

export default backboneModelHelpers;