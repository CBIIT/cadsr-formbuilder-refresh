package gov.nih.nci.cadsr.api.controller;

import javax.net.ssl.SSLEngineResult.Status;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.client.RestTemplate;

import gov.nih.nci.cadsr.FormBuilderConstants;
import gov.nih.nci.cadsr.FormBuilderProperties;
import gov.nih.nci.cadsr.model.session.CurrentForm;

public abstract class BaseAdapterController {

	@Autowired
	private FormBuilderProperties props;

	public String getBaseUrl() {
		return props.getFormServiceApiUrl() + FormBuilderConstants.FORMSERVICE_BASE_URL;
	}

	public String getBaseFormsUrl() {
		return props.getFormServiceApiUrl() + FormBuilderConstants.FORMSERVICE_BASE_URL
				+ FormBuilderConstants.FORMSERVICE_FORMS;
	}

	public ResponseEntity get(String url) {

		RestTemplate restTemplate = new RestTemplate();
		ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);

		return response;
	}

	public ResponseEntity post(String url, Object object) {

		Class<? extends Object> entityClass = object.getClass();

		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);

		HttpEntity<? extends Object> entity = new HttpEntity<Object>(object, headers);
		ResponseEntity response = null;

		RestTemplate restTemplate = new RestTemplate();
		restTemplate.getMessageConverters().add(new MappingJackson2HttpMessageConverter());
		response = restTemplate.postForEntity(url, entity, entityClass);

		return response;
	}
	
	public ResponseEntity put(String url, Object object) {

		Class<? extends Object> entityClass = object.getClass();

		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);

		HttpEntity<? extends Object> entity = new HttpEntity<Object>(object, headers);

		RestTemplate restTemplate = new RestTemplate();
		restTemplate.getMessageConverters().add(new MappingJackson2HttpMessageConverter());
		restTemplate.put(url, entity);
		
		ResponseEntity response = new ResponseEntity("Success", HttpStatus.OK);

		return response;
	}
	
	public ResponseEntity delete(String url, String id){
		return null;
	}

}
