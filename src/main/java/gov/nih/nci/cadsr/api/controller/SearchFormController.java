package gov.nih.nci.cadsr.api.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import gov.nih.nci.cadsr.FormBuilderConstants;
import gov.nih.nci.cadsr.FormBuilderProperties;
/**
 * 
 * @author rtromb
 *
 *
 * Test for Anthill Continuous Integration Hook
 *
 */


@RestController
public class SearchFormController {

	@Autowired
	private FormBuilderProperties props;

	@RequestMapping(value = "/forms", method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity<String> searchForm(
			@RequestParam(value = "formLongName", required = false) String formLongName,
			@RequestParam(value = "protocolIdSeq", required = false) String protocolIdSeq,
			@RequestParam(value = "contextIdSeq", required = false) String contextIdSeq,
			@RequestParam(value = "workflow", required = false) String workflow,
			@RequestParam(value = "categoryName", required = false) String categoryName,
			@RequestParam(value = "type", required = false) String type,
			@RequestParam(value = "classificationIdSeq", required = false) String classificationIdSeq,
			@RequestParam(value = "publicId", required = false) String publicId,
			@RequestParam(value = "version", required = false) String version,
			@RequestParam(value = "moduleLongName", required = false) String moduleLongName,
			@RequestParam(value = "cdePublicId", required = false) String cdePublicId,
			@RequestParam(value = "contextRestriction", required = false) String contextRestriction)
			throws RuntimeException {

		String base_uri = props.getFormServiceApiUrl() + FormBuilderConstants.FORMSERVICE_BASE_URL
				+ FormBuilderConstants.FORMSERVICE_SEARCH_FORM;

		StringBuilder sb = new StringBuilder();
		sb.append(base_uri);
		boolean first_element = true;

		if (formLongName != null && !formLongName.isEmpty()) {
			sb.append("?");
			first_element = false;
			sb.append("formLongName=" + formLongName);
		}
		if (protocolIdSeq != null && !protocolIdSeq.isEmpty()) {
			if (first_element) {
				sb.append("?");
				first_element = false;
			} else {
				sb.append("&");
			}

			sb.append("protocolIdSeq=" + protocolIdSeq);
		}
		if (contextIdSeq != null && !contextIdSeq.isEmpty()) {
			if (first_element) {
				sb.append("?");
				first_element = false;
			} else {
				sb.append("&");
			}

			sb.append("contextIdSeq=" + contextIdSeq);
		}
		if (workflow != null && !workflow.isEmpty()) {
			if (first_element) {
				sb.append("?");
				first_element = false;
			} else {
				sb.append("&");
			}

			sb.append("workflow=" + workflow);
		}
		if (categoryName != null && !categoryName.isEmpty()) {
			if (first_element) {
				sb.append("?");
				first_element = false;
			} else {
				sb.append("&");
			}

			sb.append("categoryName=" + categoryName);
		}
		if (type != null && !type.isEmpty()) {
			if (first_element) {
				sb.append("?");
				first_element = false;
			} else {
				sb.append("&");
			}

			sb.append("type=" + type);
		}
		if (classificationIdSeq != null && !classificationIdSeq.isEmpty()) {
			if (first_element) {
				sb.append("?");
				first_element = false;
			} else {
				sb.append("&");
			}

			sb.append("classificationIdSeq=" + classificationIdSeq);
		}
		if (publicId != null && !publicId.isEmpty()) {
			if (first_element) {
				sb.append("?");
				first_element = false;
			} else {
				sb.append("&");
			}

			sb.append("publicId=" + publicId);
		}
		if (version != null && !version.isEmpty()) {
			if (first_element) {
				sb.append("?");
				first_element = false;
			} else {
				sb.append("&");
			}

			sb.append("version=" + version);
		}
		if (moduleLongName != null && !moduleLongName.isEmpty()) {
			if (first_element) {
				sb.append("?");
				first_element = false;
			} else {
				sb.append("&");
			}

			sb.append("moduleLongName=" + moduleLongName);
		}
		if (cdePublicId != null && !cdePublicId.isEmpty()) {
			if (first_element) {
				sb.append("?");
				first_element = false;
			} else {
				sb.append("&");
			}

			sb.append("cdePublicId=" + cdePublicId);
		}
		if (contextRestriction != null && !contextRestriction.isEmpty()) {
			if (first_element) {
				sb.append("?");
				first_element = false;
			} else {
				sb.append("&");
			}

			sb.append("contextRestriction=" + contextRestriction);
		}

		RestTemplate restTemplate = new RestTemplate();
		ResponseEntity<String> response = restTemplate.getForEntity(sb.toString(), String.class);

		return response;

	}

	@RequestMapping(value = "/contexts", method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity getAllContexts() throws RuntimeException {
		String uri = props.getFormServiceApiUrl() + FormBuilderConstants.FORMSERVICE_BASE_URL
				+ FormBuilderConstants.FORMSERVICE_CONTEXTS;

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
	
	@RequestMapping(value = "/props", method = RequestMethod.GET)
	@ResponseBody
	public String getProps() throws RuntimeException {
		return "Builder Address: " + props.getFormBuilderApiUrl() + " Service Address: " + props.getFormServiceApiUrl();
	}

}
