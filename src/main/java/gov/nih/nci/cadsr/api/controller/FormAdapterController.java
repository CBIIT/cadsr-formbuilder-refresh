package gov.nih.nci.cadsr.api.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.security.core.context.SecurityContextHolder;
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
import gov.nih.nci.cadsr.model.FormMetaData;
import gov.nih.nci.cadsr.model.FormWrapper;
import gov.nih.nci.cadsr.model.ModuleChangesWrapper;
import gov.nih.nci.cadsr.model.UpdateFormWrapper;
import gov.nih.nci.cadsr.model.session.CurrentForm;
import gov.nih.nci.ncicb.cadsr.common.dto.ContextTransferObject;
import gov.nih.nci.ncicb.cadsr.common.dto.FormInstructionChangesTransferObject;
import gov.nih.nci.ncicb.cadsr.common.dto.FormTransferObject;
import gov.nih.nci.ncicb.cadsr.common.dto.ModuleChangesTransferObject;
import gov.nih.nci.ncicb.cadsr.common.dto.ModuleTransferObject;
import gov.nih.nci.ncicb.cadsr.common.dto.QuestionTransferObject;
import gov.nih.nci.ncicb.cadsr.common.resource.Context;
import gov.nih.nci.ncicb.cadsr.common.resource.Form;

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
	private CurrentForm currentForm;

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

	@RequestMapping(value = "/forms/{formIdSeq}", method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity getFullForm(@PathVariable String formIdSeq) {

		String base_uri = props.getFormServiceApiUrl() + FormBuilderConstants.FORMSERVICE_BASE_URL
				+ FormBuilderConstants.FORMSERVICE_FORMS + "/" + formIdSeq;

		RestTemplate restTemplate = new RestTemplate();
		ResponseEntity<String> response = restTemplate.getForEntity(base_uri, String.class);

		return response;
	}

	@RequestMapping(value = "/forms/{formIdSeq}/currentform", method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity loadFullForm(@PathVariable String formIdSeq) {

		String base_uri = props.getFormServiceApiUrl() + FormBuilderConstants.FORMSERVICE_BASE_URL
				+ FormBuilderConstants.FORMSERVICE_FORMS + "/" + formIdSeq;

		RestTemplate restTemplate = new RestTemplate();
		FormTransferObject fto = restTemplate.getForObject(base_uri, FormTransferObject.class);

		currentForm.setFullForm(fto);

		return new ResponseEntity<FormTransferObject>(fto, HttpStatus.OK);
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

	@RequestMapping(value = { "/{formIdSeq}" }, method = RequestMethod.PUT)
	@ResponseBody
	public String saveForm(@PathVariable String formIdSeq) {

		CurrentForm form = currentForm;

		String uri = props.getFormServiceApiUrl() + FormBuilderConstants.FORMSERVICE_BASE_URL
				+ FormBuilderConstants.FORMSERVICE_FORMS + "/" + formIdSeq;

		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);

		HttpEntity<CurrentForm> entity = new HttpEntity<CurrentForm>(form, headers);

		RestTemplate restTemplate = new RestTemplate();
		restTemplate.put(uri, entity);

		return "SUCCESS";
	}

	@RequestMapping(value = { "/sendCurr" }, method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity testsendCurr() {
		try {
			CurrentForm form = currentForm;

			String uri = props.getFormServiceApiUrl() + FormBuilderConstants.FORMSERVICE_BASE_URL
					+ FormBuilderConstants.FORMSERVICE_FORMS + "/sendCurr";

			HttpHeaders headers = new HttpHeaders();
			headers.setContentType(MediaType.APPLICATION_JSON);

			HttpEntity<CurrentForm> entity = new HttpEntity<CurrentForm>(form, headers);

			RestTemplate restTemplate = new RestTemplate();
			return restTemplate.postForEntity(uri, entity, CurrentForm.class);
		} catch (Exception e) {
			return new ResponseEntity<String>(e.toString() + e.getMessage(), HttpStatus.OK);

		}

	}

	@RequestMapping(value = { "/setCurr" }, method = RequestMethod.GET)
	@ResponseBody
	public void testSetCurr() {
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

		currentForm = form;
	}

	@RequestMapping(value = { "/currForm" }, method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity testGetCurr() {
		try {
			return new ResponseEntity<String>(currentForm.getFormHeader().getLongName(), HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<String>(e.toString() + e.getMessage(), HttpStatus.OK);

		}
	}

	@RequestMapping(value = { "/{formIdSeq}/details" }, method = RequestMethod.PUT)
	public ResponseEntity updateFormDetails(FormMetaData formDetails) {

		currentForm.setFormHeader(formDetails);

		return null;
	}

	@RequestMapping(value = { "/{formIdSeq}/modules" }, method = RequestMethod.POST)
	public ResponseEntity addModule(ModuleTransferObject module) {

		FormTransferObject parentForm = currentForm.getFullForm();

		/**
		 * Inherit parent form attributes.
		 */
		module.setAslName(parentForm.getAslName());
		module.setConteIdseq(parentForm.getContext().getConteIdseq());
		module.setCreatedBy(parentForm.getCreatedBy());
		module.setLongName(parentForm.getLongName());
		module.setPreferredDefinition(parentForm.getPreferredDefinition());
		module.setPreferredName(parentForm.getPreferredName());
		module.setVersion(1F);

		currentForm.getAddedModules().add(module);

		return null;
	}

	@RequestMapping(value = { "/{formIdSeq}/modules/{moduleIdSeq}" }, method = RequestMethod.PUT)
	public ResponseEntity updateModule(ModuleTransferObject module) {
		boolean updated = false;

		for (ModuleChangesWrapper modWrap : currentForm.getUpdatedModules()) {
			if (modWrap.getModuleId().equals(module.getModuleIdseq())) {
				modWrap.setUpdatedModule(module);// TODO: only set updateable
													// fields via FormBuilder
				updated = true;
			}
		}

		if (!updated) {
			ModuleChangesWrapper modWrap = new ModuleChangesWrapper();

			modWrap.setModuleId(module.getModuleIdseq());
			modWrap.setUpdatedModule(module);// TODO: only set updateable fields
												// via FormBuilder

			currentForm.getUpdatedModules().add(modWrap);
		}

		return null;
	}

	@RequestMapping(value = { "/{formIdSeq}/modules/{moduleIdSeq}" }, method = RequestMethod.DELETE)
	public ResponseEntity deleteModule(@PathVariable String moduleIdSeq) {

		boolean moduleFound = false;

		int index = -1;

		for (Object mod : currentForm.getFullForm().getModules()) {
			if (((ModuleTransferObject) mod).getModuleIdseq().equals(moduleIdSeq)) {
				index = currentForm.getFullForm().getModules().indexOf(mod);
				moduleFound = true;
			}
		}

		if (index >= 0) {
			currentForm.getFullForm().getModules().remove(index);
			return new ResponseEntity("Module removed successfully", HttpStatus.OK);
		}

		if (!moduleFound) {
			int newindex = -1;

			for (ModuleTransferObject mod : currentForm.getAddedModules()) {
				if (mod.getModuleIdseq().equals(moduleIdSeq)) {
					newindex = currentForm.getAddedModules().indexOf(mod);
				}
			}

			if (newindex >= 0) {
				currentForm.getAddedModules().remove(newindex);
				return new ResponseEntity("Module removed successfully", HttpStatus.OK);
			}
		}

		return new ResponseEntity("Module not found", HttpStatus.NOT_FOUND);
	}

	@RequestMapping(value = { "/{formIdSeq}/modules/{moduleIdSeq}/questions" }, method = RequestMethod.POST)
	public ResponseEntity addQuestion(QuestionTransferObject question) {

		throw new UnsupportedOperationException("Question functions not supported yet.");

	}

	@RequestMapping(value = {
			"/{formIdSeq}/modules/{moduleIdSeq}/questions/{questionIdSeq}" }, method = RequestMethod.PUT)
	public ResponseEntity updateQuestion(QuestionTransferObject question) {

		throw new UnsupportedOperationException("Question functions not supported yet.");

	}

	@RequestMapping(value = {
			"/{formIdSeq}/modules/{moduleIdSeq}/questions/{questionIdSeq}" }, method = RequestMethod.DELETE)
	public ResponseEntity deleteQuestion(String questionId) {

		throw new UnsupportedOperationException("Question functions not supported yet.");

	}

	@RequestMapping(value = { "/username" }, method = RequestMethod.GET)
	@ResponseBody
	public String getloggedinuser() {
		return SecurityContextHolder.getContext().getAuthentication().getName();
	}

	@RequestMapping(value = { "/test" }, method = RequestMethod.GET)
	@ResponseBody
	public String saveTestForm() {
		String response;
		try {
			CurrentForm form = new CurrentForm();
			form.setFormHeader(new FormMetaData());
			form.getFormHeader().setLongName("TEST LONG NAME");
			ModuleTransferObject m1 = new ModuleTransferObject();
			ModuleTransferObject m2 = new ModuleTransferObject();
			m1.setLongName("mod1");
			m2.setLongName("mod2");
			form.setAddedModules(new ArrayList<ModuleTransferObject>());
			// Form f1 = new FormTransferObject();
			// Form f2 = new FormTransferObject();
			// Context c1 = new ContextTransferObject();
			// Context c2 = new ContextTransferObject();
			// c1.setConteIdseq("29A8FB18-0AB1-11D6-A42F-0010A4C1E842");
			// c2.setConteIdseq("29A8FB18-0AB1-11D6-A42F-0010A4C1E842");
			// f1.setContext(c1);
			// f2.setContext(c2);
			// f1.setContextName("TEST");
			// f2.setContextName("TEST");
			// m1.setForm(f1);
			// m2.setForm(f2);
			form.getAddedModules().add(m1);
			form.getAddedModules().add(m2);

			String uri = props.getFormServiceApiUrl() + FormBuilderConstants.FORMSERVICE_BASE_URL
					+ FormBuilderConstants.FORMSERVICE_FORMS + "/testPassForm";

			HttpHeaders headers = new HttpHeaders();
			headers.setContentType(MediaType.APPLICATION_JSON);

			HttpEntity<CurrentForm> entity = new HttpEntity<CurrentForm>(form, headers);

			RestTemplate restTemplate = new RestTemplate();
			restTemplate.getMessageConverters().add(new MappingJackson2HttpMessageConverter());
			response = restTemplate.postForObject(uri, entity, String.class);
		} catch (Exception e) {
			return e.toString() + e.getMessage();
		}

		return response;
	}
}
