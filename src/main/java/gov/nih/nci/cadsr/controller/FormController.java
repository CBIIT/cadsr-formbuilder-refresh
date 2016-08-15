package gov.nih.nci.cadsr.controller;

import java.io.File;
import java.io.IOException;
import java.util.Collection;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonGenerationException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import gov.nih.nci.cadsr.FormServiceProperties;
import gov.nih.nci.cadsr.manager.FormManager;
import gov.nih.nci.cadsr.model.FormWrapper;
import gov.nih.nci.ncicb.cadsr.common.dto.FormTransferObject;
import gov.nih.nci.ncicb.cadsr.common.resource.Form;
import gov.nih.nci.ncicb.cadsr.common.resource.NCIUser;

@RestController
public class FormController {

	private static final Logger logger = Logger.getLogger(FormController.class);

	@Autowired
	private FormServiceProperties props;

	@Autowired
	private FormManager formManager;

	@RequestMapping(value = "/helloworld", method = RequestMethod.GET)
	public String getGreeting() throws RuntimeException {
		ObjectMapper mapper = new ObjectMapper();
		Form obj = new FormTransferObject();

		// Object to JSON in file
		try {
			mapper.writeValue(new File("c:\\file2.json"), obj);
		} catch (JsonGenerationException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (JsonMappingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		String result = "";
		if (result.isEmpty()) {
			throw new RuntimeException();
		} else {
			logger.info("calling hello world");
			return result;
		}

	}

	@RequestMapping(value = "/forms", method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity searchForm(@RequestParam(value = "formLongName", required = false) String formLongName,
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
			@RequestParam(value = "user", required = false) NCIUser user,
			@RequestParam(value = "contextRestriction", required = false) String contextRestriction)
			throws RuntimeException {

		long startTimer = System.currentTimeMillis();
		ResponseEntity<Collection> response = null;

		Collection FormList;

		FormList = formManager.getAllForms(formLongName, protocolIdSeq, contextIdSeq, workflow, categoryName, type,
				classificationIdSeq, publicId, version, moduleLongName, cdePublicId, user, contextRestriction);

		response = createSuccessResponse(FormList);
		logger.info(response.toString());
		long endTimer = System.currentTimeMillis();

		logger.info("----------EJB query took " + (endTimer - startTimer) + " ms.");
		logger.info("----------# of Form Results: " + FormList.size());

		return response;

	}

	@RequestMapping(value = "/forms", method = RequestMethod.POST, consumes = "application/json")
	@ResponseBody
	public ResponseEntity<FormWrapper> createForm(@RequestBody FormWrapper form) {
	
		formManager.createFormComponent(form);
		FormWrapper newForm = new FormWrapper();
		newForm.setFormIdseq(form.getFormIdseq());
		newForm.setAslName(form.getAslName());
		newForm.setContext(form.getContext());
		newForm.setCreatedBy(form.getCreatedBy());
		newForm.setFormType(form.getFormType());
		newForm.setProtocolTransferObjects(form.getProtocolTransferObjects());
		ResponseEntity<FormWrapper> response = createSuccessFormResponse(newForm);

		return response;
	}

	private ResponseEntity<Collection> createSuccessResponse(final Collection formList) {

		return new ResponseEntity<Collection>(formList, HttpStatus.OK);
	}

	private ResponseEntity<FormWrapper> createSuccessFormResponse(final FormWrapper formList) {

		return new ResponseEntity<FormWrapper>(formList, HttpStatus.OK);
	}

}
