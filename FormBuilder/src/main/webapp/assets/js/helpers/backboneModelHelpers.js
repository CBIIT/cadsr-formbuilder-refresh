const backboneModelHelpers = {
	/**
	 * Recursively run toJSON on a backbone model or backbone collection
	 * @param model
	 */
	getDeepModelPojo(model){
		let json = _.clone(model.attributes);
		function checkKeys(json) {
			for(let attr in json) {
				if((json[attr].attributes) || (json[attr].models)) {
					json[attr] = json[attr].toJSON();
					checkKeys(json[attr]);
				}
				/*TODO Fix hardcoding of validValues here*/
				else if (json[attr].validValues) {
					json[attr].validValues = json[attr].validValues.toJSON();
				}
			}
		}
		checkKeys(json);
		return json;

	}
};

export default backboneModelHelpers;