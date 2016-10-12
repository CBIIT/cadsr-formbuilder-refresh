const backboneModelHelpers = {
	/**
	 * Recursively run toJSON on a backbone model or backbone collection
	 * @param model
	 */
	getDeepModelPojo(model){
		let json = _.clone(model.attributes);

		function checkKeys(json){
			for(let attr in json){
				if(json[attr] && (json[attr].attributes) || (json[attr].models)){
					if(json[attr].attributes){
						json[attr] = Object.assign({}, json[attr].attributes, json[attr].cid);
					}
					else if(json[attr].models){
						json[attr] = json[attr].models.map((model) =>{
							return Object.assign({}, model.attributes, {cid: model.cid});
						});
					}
					checkKeys(json[attr]);
				}
				/*TODO Fix hardcoding of validValues here*/
				else if(json[attr].validValues){
					json[attr].validValues = json[attr].validValues.models.map((model) =>{
						return Object.assign({}, model.attributes,  {cid: model.cid});
					});
				}
			}
		}

		checkKeys(json);
		return json;

	}
};

export default backboneModelHelpers;