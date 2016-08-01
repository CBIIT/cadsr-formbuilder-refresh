const urlHelpers = {
	buildUrl(baseUrl, data){
		baseUrl = baseUrl + "?";
		function addParams(baseUrl, object){
			for(let index in object){
				let paramName = index;
				let paramValue = object[index];
				if(paramValue){
					baseUrl += `${paramName}=${paramValue}&`;
				}
			}
			return baseUrl;
		}
		return addParams(baseUrl, data);
	}
};

export default urlHelpers;