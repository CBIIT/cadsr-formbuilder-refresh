package gov.nih.nci.cadsr.controller;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import gov.nih.nci.cadsr.FormServiceProperties;
import gov.nih.nci.cadsr.manager.FormManager;
import gov.nih.nci.cadsr.model.BBForm;
import gov.nih.nci.cadsr.model.BBFormMetaData;
import gov.nih.nci.ncicb.cadsr.common.dto.FormTransferObject;
import gov.nih.nci.ncicb.cadsr.common.dto.FormV2TransferObject;
import gov.nih.nci.ncicb.cadsr.common.dto.InstructionTransferObject;

import gov.nih.nci.ncicb.cadsr.common.resource.FormV2;

import gov.nih.nci.ncicb.cadsr.common.resource.NCIUser;
import gov.nih.nci.ncicb.cadsr.formbuilder.ejb.impl.FormBuilderServiceImpl;
import gov.nih.nci.ncicb.cadsr.formbuilder.struts.common.FormConverterUtil;
import gov.nih.nci.objectCart.client.ObjectCartClient;
import gov.nih.nci.objectCart.client.ObjectCartException;
import gov.nih.nci.objectCart.domain.Cart;
import gov.nih.nci.objectCart.domain.CartObject;

@RestController
public class FormController {

	private static final Logger logger = Logger.getLogger(FormController.class);

	@Autowired
	private FormServiceProperties props;

	@Autowired
	private FormBuilderServiceImpl service;

	@Autowired
	private FormManager formManager;

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

	@RequestMapping(value = { "/forms/{formIdSeq}" }, method = RequestMethod.PUT, consumes = "application/json")
	public ResponseEntity updateForm(@RequestBody BBForm form) {
		// adapt object model

		try {

			return new ResponseEntity(formManager.updateForm(form), HttpStatus.OK);

		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity(e.toString() + " : " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
		}

	}

	@RequestMapping(value = "/forms", method = RequestMethod.POST, consumes = "application/json")
	@ResponseBody
	public ResponseEntity<BBFormMetaData> createForm(@RequestBody BBFormMetaData form) {

		InstructionTransferObject headerInstruction = new InstructionTransferObject();
		InstructionTransferObject footerInstruction = new InstructionTransferObject();

		// assemble a new form instruction for having form header.
		int dispOrder = 0;
		if (form.getHeaderInstructions() != null) {

			headerInstruction = formManager.buildHeaderInstructions(form);

		}
		if (form.getFooterInstructions() != null) {

			footerInstruction = formManager.buildFooterInstructions(form);
		}

		BBFormMetaData newForm = formManager.createFormComponent(form, headerInstruction, footerInstruction);

		ResponseEntity<BBFormMetaData> response = new ResponseEntity(newForm, HttpStatus.OK);

		return response;
	}

	@RequestMapping(value = { "/forms/{formIdSeq}" }, method = RequestMethod.GET)
	public BBForm testTranslateDBFormToBBForm(@PathVariable String formIdSeq) {

		FormTransferObject fullForm = formManager.getFullForm(formIdSeq);

		return formManager.testTranslateDBFormToBBForm(fullForm);
	}

	private ResponseEntity<Collection> createSuccessResponse(final Collection formList) {

		return new ResponseEntity<Collection>(formList, HttpStatus.OK);
	}

	/**
	 * 
	 * Performance Test Methods
	 * 
	 */
	
	/*@RequestMapping(value = "/forms/performancetest", method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity<String> getFormsTest() {
		
		Collection FormList;
		List<String> formids = new ArrayList<String>();
		StringBuilder sb = new StringBuilder();

		FormList = formManager.getAllForms("*", null, null, null, null, null,
				null, null, null, null, null, null, null);
		for(Object form : FormList){
			FormTransferObject fto = (FormTransferObject)form;
			formids.add(fto.getFormIdseq());
		}
		
		for(String id : formids){
			sb.append(formManager.getFormPerformanceTest(id));
		}

		return new ResponseEntity(sb.toString(), HttpStatus.OK);
	}*/

	@RequestMapping(value = "/forms/performancetest/{formIdSeq}", method = RequestMethod.GET)
	@ResponseBody

	public ResponseEntity<String> getFormTest(@PathVariable String formIdSeq) {
//		long startTimer = System.currentTimeMillis();
		
		String testResult = formManager.getFormPerformanceTest(formIdSeq);
		
//		long endTimer = System.currentTimeMillis();
//		String transportTime = "" + (endTimer - startTimer);
//		
//		StringBuilder sb = new StringBuilder(testResult);
//		
//		sb.append("Time(ms) for full transport to front-end: " + transportTime);
//		sb.append("-----------------------------END-------------------------------\n\n");
//
//		logger.info(sb.toString());
		return new ResponseEntity(testResult, HttpStatus.OK);
	}

	/*
	 * private ResponseEntity<FormWrapper> createSuccessFormResponse(final
	 * FormWrapper formList) {
	 * 
	 * return new ResponseEntity<FormWrapper>(formList, HttpStatus.OK); }
	 */
	@RequestMapping(value = "/forms/{cartId}/{formIdSeq}", method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity<Cart> saveFormToOC(@PathVariable String cartId, @PathVariable String formIdSeq)
			throws ObjectCartException {
		ObjectCartClient cartClient = new ObjectCartClient();
		String str = formIdSeq;
		String[] id = str.split(",");
		Cart cart = cartClient.createCart("betty", "formCart");
		// TODO:Get the FormV2 version of a Form and translate it to a
		// CartObject that can be saved.
		CartObject cObject = new CartObject();
		for (String i : id) {
			FormV2 formV2 = formManager.getFullFormV2(i);
			try {
				cObject = translateCartObject(formV2);
				cartClient.storeObject(cart, cObject);
			} catch (Exception e1) {
				e1.printStackTrace();
			}
		}
		// TODO:Actually save the Form to the ObjectCart
		ResponseEntity<Cart> response = new ResponseEntity(cart, HttpStatus.OK);
		return response;
	}

	public ResponseEntity<String> getFormTest1(@PathVariable String formIdSeq) {
//		long startTimer = System.currentTimeMillis();
		
		String testResult = formManager.getFormPerformanceTest(formIdSeq);
		
//		long endTimer = System.currentTimeMillis();
//		String transportTime = "" + (endTimer - startTimer);
//		
//		StringBuilder sb = new StringBuilder(testResult);
//		
//		sb.append("Time(ms) for full transport to front-end: " + transportTime);
//		sb.append("-----------------------------END-------------------------------\n\n");
//
//		logger.info(sb.toString());
		return new ResponseEntity(testResult, HttpStatus.OK);

	}
		  private CartObject translateCartObject(FormV2 crf) throws Exception {
				CartObject ob = new CartObject();
				ob.setType(FormConverterUtil.instance().getCartObjectType());
				ob.setDisplayText(Integer.toString(crf.getPublicId()) + "v" + Float.toString(crf.getVersion()));
				ob.setNativeId(crf.getFormIdseq());
				
				String convertedForm = FormConverterUtil.instance().convertFormToV2(crf);		
				ob.setData(convertedForm);
				return ob;	  
		  }

	/*
	 * private ResponseEntity<FormWrapper> createSuccessFormResponse(final
	 * FormWrapper formList) {
	 * 
	 * return new ResponseEntity<FormWrapper>(formList, HttpStatus.OK); }
	 */


}
