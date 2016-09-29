package gov.nih.nci.cadsr.api.controller;


import java.io.File;
import java.io.IOException;
import java.util.Scanner;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.ByteArrayHttpMessageConverter;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import gov.nih.nci.cadsr.FormBuilderConstants;
import gov.nih.nci.cadsr.FormBuilderProperties;
import gov.nih.nci.cadsr.model.BBForm;
import gov.nih.nci.cadsr.model.session.SessionObject;

/**
 * 
 * @author trombadorera
 *
 *         This controller class provides an API to the FormBuilder for
 *         retrieving Forms, manipulating and interacting with the current
 *         working Form in session, and saving Form changes to the database.
 */
@RestController
@RequestMapping(value = "/forms")
public class FormAdapterController {
	
	@Autowired
	private FormBuilderProperties props;
	
	@Autowired
	private SessionObject sessionObject;

	@RequestMapping(method = RequestMethod.GET)
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
				+ FormBuilderConstants.FORMSERVICE_FORMS;

		UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(base_uri);

		if (formLongName != null && !formLongName.isEmpty()) {
			builder.queryParam("formLongName", formLongName);
		}
		if (protocolIdSeq != null && !protocolIdSeq.isEmpty()) {
			builder.queryParam("protocolIdSeq", protocolIdSeq);
		}
		if (contextIdSeq != null && !contextIdSeq.isEmpty()) {
			builder.queryParam("contextIdSeq", contextIdSeq);
		}
		if (workflow != null && !workflow.isEmpty()) {
			builder.queryParam("workflow", workflow);
		}
		if (categoryName != null && !categoryName.isEmpty()) {
			builder.queryParam("categoryName", categoryName);
		}
		if (type != null && !type.isEmpty()) {
			builder.queryParam("type", type);
		}
		if (classificationIdSeq != null && !classificationIdSeq.isEmpty()) {
			builder.queryParam("classificationIdSeq", classificationIdSeq);
		}
		if (publicId != null && !publicId.isEmpty()) {
			builder.queryParam("publicId", publicId);
		}
		if (version != null && !version.isEmpty()) {
			builder.queryParam("version", version);
		}
		if (moduleLongName != null && !moduleLongName.isEmpty()) {
			builder.queryParam("moduleLongName", moduleLongName);
		}
		if (cdePublicId != null && !cdePublicId.isEmpty()) {
			builder.queryParam("cdePublicId", cdePublicId);
		}
		if (contextRestriction != null && !contextRestriction.isEmpty()) {
			builder.queryParam("contextRestriction", contextRestriction);
		}

		RestTemplate restTemplate = new RestTemplate();
		ResponseEntity<String> response = restTemplate.getForEntity(builder.build().encode().toUri(), String.class);

		return response;
	}

	@RequestMapping(value = "/{formIdSeq}", method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity getFullForm(@PathVariable String formIdSeq) {
		
		if(props.getFormBuilderLocalMode()){
			
			String content = "";
			content = getFile("enrollment_dummy_form.json");
			
			return new ResponseEntity(content, HttpStatus.OK);
		}

		String base_uri = props.getFormServiceApiUrl() + FormBuilderConstants.FORMSERVICE_BASE_URL
				+ FormBuilderConstants.FORMSERVICE_FORMS + "/" + formIdSeq;

		RestTemplate restTemplate = new RestTemplate();
		ResponseEntity<String> response = restTemplate.getForEntity(base_uri, String.class);

		return response;
	}

	@RequestMapping(method = RequestMethod.POST, consumes = "application/json")
	@ResponseBody
	public ResponseEntity createForm(@RequestBody String form) {

		String uri = props.getFormServiceApiUrl() + FormBuilderConstants.FORMSERVICE_BASE_URL
				+ FormBuilderConstants.FORMSERVICE_FORMS;

		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);

		HttpEntity<String> entity = new HttpEntity<String>(form, headers);

		RestTemplate restTemplate = new RestTemplate();
		ResponseEntity<String> response = restTemplate.postForEntity(uri, entity, String.class);

		return response;
	}
	
	@RequestMapping(value = { "/{formIdSeq}" }, method = RequestMethod.PUT, consumes = "application/json")
	@ResponseBody
	public ResponseEntity saveForm(@PathVariable String formIdSeq, @RequestBody String form) {
		
		String uri = props.getFormServiceApiUrl() + FormBuilderConstants.FORMSERVICE_BASE_URL
				+ FormBuilderConstants.FORMSERVICE_FORMS + "/" + formIdSeq;

		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);

		HttpEntity<String> entity = new HttpEntity<String>(form, headers);

		RestTemplate restTemplate = new RestTemplate();
		
		ResponseEntity<String> response = restTemplate.exchange(uri, HttpMethod.PUT, entity, String.class);

		return response;
	}
	
	@RequestMapping(value = "/xml/{formIdSeq}", method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity downloadFormXml(@PathVariable String formIdSeq) {
		
		String uri = props.getFormServiceApiUrl() + FormBuilderConstants.FORMSERVICE_BASE_URL
				+ "formDownload" + "?formIdSeq=" + formIdSeq;
		

		RestTemplate restTemplate = new RestTemplate();
		restTemplate.getMessageConverters().add(new ByteArrayHttpMessageConverter()); 
		return restTemplate.getForEntity(uri, ByteArrayResource.class);
		
	}
	
	@RequestMapping(value = "/xls/{formIdSeq}", method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity downloadFormXls(@PathVariable String formIdSeq) {
		
		String uri = props.getFormServiceApiUrl() + FormBuilderConstants.FORMSERVICE_BASE_URL
				+ "formDownloadExcel" + "?formIdSeq=" + formIdSeq;
		
		RestTemplate restTemplate = new RestTemplate();
		return restTemplate.getForEntity(uri, byte[].class);
		
	}
	
	@RequestMapping(value = { "/workingCopy" }, method = RequestMethod.POST, consumes = "application/json")
	@ResponseBody
	public ResponseEntity loadWorkingCopy(@RequestBody BBForm workingCopy){
		
		sessionObject.setWorkingCopy(workingCopy);
		
		return new ResponseEntity(HttpStatus.OK);
		
	}
	
	@RequestMapping(value = { "/workingCopy" }, method = RequestMethod.GET, consumes = "application/json")
	@ResponseBody
	public ResponseEntity<BBForm> getWorkingCopy(){
		return new ResponseEntity(sessionObject.getWorkingCopy(), HttpStatus.OK);
	}

	/**
	 * 
	 * Performance Test Methods
	 * 
	 */
	
	/*@RequestMapping(value = "/performancetest", method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity<String> getFormsTest() {

		String base_uri = props.getFormServiceApiUrl() + FormBuilderConstants.FORMSERVICE_BASE_URL
				+ FormBuilderConstants.FORMSERVICE_FORMS + "/" + FormBuilderConstants.FORMSERVICE_FORMS_PERFORMANCE;

		RestTemplate restTemplate = new RestTemplate();
		ResponseEntity<String> response = restTemplate.getForEntity(base_uri, String.class);

		return response;
	}*/
	
	@RequestMapping(value = "/performancetest/{formIdSeq}", method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity<String> getFormTest(@PathVariable String formIdSeq) {

		String base_uri = props.getFormServiceApiUrl() + FormBuilderConstants.FORMSERVICE_BASE_URL
				+ FormBuilderConstants.FORMSERVICE_FORMS + "/" + FormBuilderConstants.FORMSERVICE_FORMS_PERFORMANCE + "/" + formIdSeq;

		RestTemplate restTemplate = new RestTemplate();
		
		long startTimer = System.currentTimeMillis();
		
		ResponseEntity<String> response = restTemplate.getForEntity(base_uri, String.class);
		
		long endTimer = System.currentTimeMillis();
		String transportTime = "" + (endTimer - startTimer);
		
		StringBuilder sb = new StringBuilder(response.getBody());
		
		sb.append("Time(ms) for full transport to front-end: " + transportTime);
		sb.append("-----------------------------END-------------------------------\n\n");

		return new ResponseEntity(sb.toString(), HttpStatus.OK);
	}
	
	private String getFile(String fileName) {

		StringBuilder result = new StringBuilder("");

		//Get file from resources folder
		ClassLoader classLoader = getClass().getClassLoader();
		File file = new File(classLoader.getResource(fileName).getFile());

		try (Scanner scanner = new Scanner(file)) {

			while (scanner.hasNextLine()) {
				String line = scanner.nextLine();
				result.append(line).append("\n");
			}

			scanner.close();

		} catch (IOException e) {
			e.printStackTrace();
		}

		return result.toString();

	  }


}
