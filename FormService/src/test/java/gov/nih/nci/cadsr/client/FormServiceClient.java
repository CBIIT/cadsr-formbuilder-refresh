package gov.nih.nci.cadsr.client;

import java.util.ArrayList;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.client.RestTemplate;

import gov.nih.nci.cadsr.model.CurrentForm;
import gov.nih.nci.cadsr.model.FormMetaData;
import gov.nih.nci.ncicb.cadsr.common.dto.ModuleTransferObject;

public class FormServiceClient {
	
	private static final String DEFAULT_REMOTE_SERVICE_HOST = "http://localhost:8080/";
	public static final String FORMSERVICE_BASE_URL = "FormService/api/v1/";
	public static final String FORMSERVICE_FORMS = "forms";
	
	public static String saveTestForm(){
		
		CurrentForm form = new CurrentForm();
		form.setFormHeader(new FormMetaData());
		form.getFormHeader().setLongName("TEST LONG NAME");
		ModuleTransferObject m1 = new ModuleTransferObject();
		ModuleTransferObject m2 = new ModuleTransferObject();
		m1.setLongName("mod1");
		m2.setLongName("mod2");
		form.setAddedModules(new ArrayList<ModuleTransferObject>());
		form.getAddedModules().add(m1);
		form.getAddedModules().add(m2);
		
		String uri = DEFAULT_REMOTE_SERVICE_HOST + FORMSERVICE_BASE_URL
				+ FORMSERVICE_FORMS + "/testPassForm";
		
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);

		HttpEntity<CurrentForm> entity = new HttpEntity<CurrentForm>(form, headers);
		
		RestTemplate restTemplate = new RestTemplate();
		restTemplate.getMessageConverters().add(new MappingJackson2HttpMessageConverter());
		String response = restTemplate.postForObject(uri, entity, String.class);
		
		return response;
	}
	
	public static void main(String args[]){
		saveTestForm();
	}

}
