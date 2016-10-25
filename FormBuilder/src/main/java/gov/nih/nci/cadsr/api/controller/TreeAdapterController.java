package gov.nih.nci.cadsr.api.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import gov.nih.nci.cadsr.FormBuilderConstants;
import gov.nih.nci.cadsr.FormBuilderProperties;

@RestController
class TreeAdapterController {

	@Autowired
	private FormBuilderProperties props;

	@RequestMapping(value = "/tree", method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity getTree() {
		String base_uri = props.getFormServiceApiUrl() + FormBuilderConstants.FORMSERVICE_BASE_URL
				+ FormBuilderConstants.TREE_SERVICE;
		RestTemplate restTemplate = new RestTemplate();
		ResponseEntity<String> response = restTemplate.getForEntity(base_uri, String.class);

		return response;

	}

}
