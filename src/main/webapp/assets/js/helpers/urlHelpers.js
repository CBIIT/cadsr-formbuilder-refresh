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

		const concatedParams = addParams(baseUrl, data);

		return (concatedParams.endsWith("&")) ? concatedParams.slice(0, -1) : concatedParams;
	}
};

export default urlHelpers;