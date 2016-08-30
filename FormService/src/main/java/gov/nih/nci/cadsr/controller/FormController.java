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
import gov.nih.nci.cadsr.model.CurrentForm;
import gov.nih.nci.cadsr.model.FormWrapper;
import gov.nih.nci.ncicb.cadsr.common.dto.ContextTransferObject;
import gov.nih.nci.ncicb.cadsr.common.dto.FormTransferObject;
import gov.nih.nci.ncicb.cadsr.common.dto.InstructionTransferObject;
import gov.nih.nci.ncicb.cadsr.common.dto.ModuleChangesTransferObject;
import gov.nih.nci.ncicb.cadsr.common.dto.ModuleTransferObject;
import gov.nih.nci.ncicb.cadsr.common.resource.Form;
import gov.nih.nci.ncicb.cadsr.common.resource.NCIUser;
import gov.nih.nci.ncicb.cadsr.common.util.StringUtils;
import gov.nih.nci.ncicb.cadsr.formbuilder.ejb.impl.FormBuilderServiceImpl;

@RestController
public class FormController {

	private static final Logger logger = Logger.getLogger(FormController.class);

	@Autowired
	private FormServiceProperties props;
	
	@Autowired
	private FormBuilderServiceImpl service;

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
		
    	InstructionTransferObject headerInstruction = new InstructionTransferObject();
    	InstructionTransferObject footerInstruction = new InstructionTransferObject();

		// assemble a new form instruction for having form header.
	    int dispOrder = 0;
	    if (StringUtils.doesValueExist(form.getHeaderInstructions())){
	    	headerInstruction.setLongName(form.getLongName());
	    	headerInstruction.setPreferredDefinition(form.getHeaderInstructions());
	    	headerInstruction.setContext(form.getContext());
	    	headerInstruction.setAslName("DRAFT NEW");
	    	headerInstruction.setVersion(new Float(1.0));
	    	headerInstruction.setCreatedBy(form.getCreatedBy());
	    	headerInstruction.setDisplayOrder(1);
	    }
	    if (StringUtils.doesValueExist(form.getFooterInstructions())){
	    	footerInstruction.setLongName(form.getLongName());
	    	footerInstruction.setPreferredDefinition(form.getFooterInstructions());
	    	footerInstruction.setContext(form.getContext());
	    	footerInstruction.setAslName("DRAFT NEW");
	    	footerInstruction.setVersion(new Float(1.0));
	    	footerInstruction.setCreatedBy(form.getCreatedBy());
	    	footerInstruction.setDisplayOrder(1);
	    }

	    Form createdForm = null;

		formManager.createFormComponent(form, headerInstruction, footerInstruction);
		FormWrapper newForm = new FormWrapper();
		newForm.setFormIdseq(form.getFormIdseq());
		newForm.setAslName(form.getAslName());
		newForm.setContext(form.getContext());
		newForm.setCreatedBy(form.getCreatedBy());
		newForm.setFormType(form.getFormType());
		newForm.setProtocolTransferObjects(form.getProtocolTransferObjects());
		newForm.setLongName(form.getLongName());
		newForm.setVersion(form.getVersion());
		newForm.setFormCategory(form.getFormCategory());
		newForm.setPreferredDefinition(form.getPreferredDefinition());
		ResponseEntity<FormWrapper> response = createSuccessFormResponse(newForm);
		return response;
	}
	
	@RequestMapping(value = "/forms/testPassForm", method = RequestMethod.POST, consumes = "application/json")
	@ResponseBody
	public String testPassForm(@RequestBody CurrentForm form) {
		
		/** 
		 * This value is where the form id will be stored.
		 */
		String formIdseq = form.getFormHeader().getFormIdseq();
		
		/**
		 * Hacky solution for populating Module child-objects.
		 * They can't be passed from client as they are interfaces (even in ModuleTransferObject).
		 * This must occur for at least all added Modules, perhaps also needed for the updatedModules and deletedModules,
		 * not sure. Would have to check for needed fields in queries in deleteModule and updateModule.
		 * This logic should be isolated to its own utility method.
		 */
		for(ModuleTransferObject mod : form.getAddedModules()){
			FormTransferObject f = new FormTransferObject();
			ContextTransferObject c = new ContextTransferObject();
			c.setConteIdseq(mod.getConteIdseq());
			f.setContext(c);
			f.setIdseq(form.getFormHeader().getFormIdseq());
			f.setFormIdseq(form.getFormHeader().getFormIdseq());
			mod.setForm(f);
		}
		
		/**
		 * If changes are made to the FormMetaData,
		 * load all fields into a FormTransferObject and pass to updateForm() method.
		 * Otherwise, if no changes, null may be passed.
		 */
		FormTransferObject formtr = new FormTransferObject();
		
		/**
		 * updateForm() method expects generic Collections.
		 * Converting Lists to Collections.
		 * Also very hacky.
		 */
		Collection upMods = form.getUpdatedModules();
		Collection delMods = form.getDeletedModules();
		Collection addMods = form.getAddedModules();
		Collection addProts = form.getAddedProtocols();
		Collection delProts = form.getDeletedProtocols();
		Collection protTrigs = form.getProtocolTriggerActionChanges();
		
		
		/**
		 * This can all be moved into a service class.
		 */
		service.updateForm(formIdseq, null, upMods, delMods, addMods, addProts, delProts, protTrigs, form.getInstructionChanges(), "guest");
		
		
		//TODO: execute module change updates for all updated modules. This should address all Question changes as well
		/**
		 * The updateForm() method only updates changed modules' display order, and does not seem to address questions at all.
		 * For these updates to occur for Modules and their child Questions, the updateModule() method must be called,
		 * currently found in FormBuilderService.updateModule(moduleIdSeq, moduleChanges, username).
		 * This method can either be called for each updated Modules after the updateForm, or the 
		 * updateForm() method may be altered to include this call for each update Module (more efficient).
		 */
		for(ModuleChangesTransferObject mod : form.getUpdatedModules()){
//			service.updateModule(moduleIdSeq, moduleChanges, username);
		}
		
		
		return "SUCCESS";
	}

	private ResponseEntity<Collection> createSuccessResponse(final Collection formList) {

		return new ResponseEntity<Collection>(formList, HttpStatus.OK);
	}

	private ResponseEntity<FormWrapper> createSuccessFormResponse(final FormWrapper formList) {

		return new ResponseEntity<FormWrapper>(formList, HttpStatus.OK);
	}

}
