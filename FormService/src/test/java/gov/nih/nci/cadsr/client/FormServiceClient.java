package gov.nih.nci.cadsr.client;

import java.util.ArrayList;
import java.util.HashMap;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.client.RestTemplate;

import gov.nih.nci.cadsr.model.CurrentForm;
import gov.nih.nci.cadsr.model.FormMetaData;
import gov.nih.nci.ncicb.cadsr.common.dto.FormInstructionChangesTransferObject;
import gov.nih.nci.ncicb.cadsr.common.dto.ModuleTransferObject;

public class FormServiceClient {
	
	private static final String DEFAULT_REMOTE_SERVICE_HOST = "http://localhost:8080/";
	public static final String FORMSERVICE_BASE_URL = "FormService3/api/v1/";
	public static final String FORMSERVICE_FORMS = "forms";
	
	public static String saveTestForm(){
		
		/**
		 * Populating the Wrapper object used to track changes to a Form
		 * This object will be sent from the FormBuilder Adapter Api.
		 * Interface fields cannot be passed from client to server.
		 */
		CurrentForm form = new CurrentForm();
		
		FormMetaData formMeta = new FormMetaData();
		formMeta.setFormIdseq("B12D4AAC-4D6B-BCFF-E040-BB89AD434BE0");
		form.setFormHeader(formMeta);
		form.getFormHeader().setLongName("TEST LONG NAME");
		ModuleTransferObject m1 = new ModuleTransferObject();
		ModuleTransferObject m2 = new ModuleTransferObject();
		
		m1.setConteIdseq("29A8FB18-0AB1-11D6-A42F-0010A4C1E842");
		m1.setLongName("mod1");
		m1.setVersion(1F);
		m1.setPreferredDefinition("HEY this is def");
		m1.setAslName("DRAFT NEW");
		m1.setCreatedBy("guest");
		m1.setDisplayOrder(1);
		
		m2.setConteIdseq("29A8FB18-0AB1-11D6-A42F-0010A4C1E842");
		m2.setLongName("mod2");
		m2.setVersion(2F);
		m2.setPreferredDefinition("HEY this is def 2");
		m2.setAslName("DRAFT NEW");
		m2.setCreatedBy("guest");
		m2.setDisplayOrder(2);
		
		form.setAddedModules(new ArrayList<ModuleTransferObject>());
		form.getAddedModules().add(m1);
		form.getAddedModules().add(m2);
		
		FormInstructionChangesTransferObject instrChan = new FormInstructionChangesTransferObject();
		instrChan.setFormHeaderInstructionChanges(new HashMap());
		instrChan.setFormFooterInstructionChanges(new HashMap());
		
		form.setInstructionChanges(instrChan);
		
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
		System.out.println(saveTestForm());
	}

}
