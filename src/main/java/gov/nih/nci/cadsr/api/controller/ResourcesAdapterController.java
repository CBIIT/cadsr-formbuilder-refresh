package gov.nih.nci.cadsr.api.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import gov.nih.nci.cadsr.FormBuilderConstants;
import gov.nih.nci.cadsr.FormBuilderProperties;

/**
 * 
 * @author trombadorera
 *
 *         This controller class provides and API to FormBuilder for retrieving
 *         resources necessary to build views, such as contexts, workflows, and
 *         Form types.
 */
@RestController
public class ResourcesAdapterController {

	@Autowired
	private FormBuilderProperties props;

	@RequestMapping(value = { "/contexts", "/contexts/{username}" }, method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity getAllContexts(@PathVariable Optional<String> username) throws RuntimeException {
		String uri = props.getFormServiceApiUrl() + FormBuilderConstants.FORMSERVICE_BASE_URL
				+ FormBuilderConstants.FORMSERVICE_CONTEXTS;

		if (username != null && !username.equals("")) {
			uri = uri + "/" + username;
		}

		RestTemplate restTemplate = new RestTemplate();
		ResponseEntity<String> response = restTemplate.getForEntity(uri, String.class);

		return response;

	}

	@RequestMapping(value = "/categories", method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity getAllCategories() throws RuntimeException {
		String uri = props.getFormServiceApiUrl() + FormBuilderConstants.FORMSERVICE_BASE_URL
				+ FormBuilderConstants.FORMSERVICE_CATEGORIES;

		RestTemplate restTemplate = new RestTemplate();
		ResponseEntity<String> response = restTemplate.getForEntity(uri, String.class);

		return response;

	}

	@RequestMapping(value = "/types", method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity getAllTypes() throws RuntimeException {
		String uri = props.getFormServiceApiUrl() + FormBuilderConstants.FORMSERVICE_BASE_URL
				+ FormBuilderConstants.FORMSERVICE_TYPES;

		RestTemplate restTemplate = new RestTemplate();
		ResponseEntity<String> response = restTemplate.getForEntity(uri, String.class);

		return response;

	}

	@RequestMapping(value = "/workflows", method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity getAllWorkflow() throws RuntimeException {
		String uri = props.getFormServiceApiUrl() + FormBuilderConstants.FORMSERVICE_BASE_URL
				+ FormBuilderConstants.FORMSERVICE_WORKFLOWS;

		RestTemplate restTemplate = new RestTemplate();
		ResponseEntity<String> response = restTemplate.getForEntity(uri, String.class);

		return response;
	}

}
