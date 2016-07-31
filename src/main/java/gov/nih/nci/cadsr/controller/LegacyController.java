package gov.nih.nci.cadsr.controller;

import java.util.Collection;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import gov.nih.nci.ncicb.cadsr.common.persistence.PersistenceConstants;
import gov.nih.nci.ncicb.cadsr.common.resource.NCIUser;
import gov.nih.nci.ncicb.cadsr.formbuilder.ejb.impl.FormBuilderServiceImpl;

@CrossOrigin(maxAge = 3600)
@RestController
@RequestMapping(path = "/legacy")
public class LegacyController {
	
	private static final Logger logger = Logger.getLogger(LegacyController.class);

	@Autowired
	private FormBuilderServiceImpl formBuilderService;


	@RequestMapping(value = "/forms", method = RequestMethod.GET, produces = "application/json")
	public @ResponseBody Collection searchForms(@RequestParam(value = "formLongName", required = false) String formLongName,
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
			@RequestParam(value = "contextRestriction", required = false) String contextRestriction) {
		
		Collection forms = null;

		long startTimer = System.currentTimeMillis();
		
		forms = formBuilderService.getAllForms(formLongName, protocolIdSeq, contextIdSeq, workflow, categoryName, type,
				classificationIdSeq, publicId, version, moduleLongName, cdePublicId, user, contextRestriction);
		
		long endTimer = System.currentTimeMillis();
		
		logger.info("----------EJB query took " + (endTimer - startTimer) + " ms.");
		logger.info("----------# of Form Results: " + forms.size());

		return forms;

	}
	
	@RequestMapping(value = "/workflows", method = RequestMethod.GET)
	public @ResponseBody Collection getAllWorkflows(){
		
		return formBuilderService.getStatusesForACType(PersistenceConstants.FORM_ADMIN_COMPONENT_TYPE);
		
	}
	
	@RequestMapping(value = "/contexts", method = RequestMethod.GET)
	public @ResponseBody Collection getAllContexts(){
		
		return formBuilderService.getAllContexts();
		
	}

	@RequestMapping(value = "/categories", method = RequestMethod.GET)
	public @ResponseBody Collection getAllCategories(){
		
		return formBuilderService.getAllFormCategories();
		
	}

	@RequestMapping(value = "/types", method = RequestMethod.GET)
	public @ResponseBody String[] getAllTypes(){
		
		return PersistenceConstants.FORM_TYPE_VALUES;
		
	}
	
	@RequestMapping(value = "/protocols", method = RequestMethod.GET)
	public @ResponseBody Collection searchProtocols(@RequestParam(value = "keyword", required = false) String keyword,
			@RequestParam(value = "contextFilter", required = false) boolean contextFilter){
		
		return null;
		
	}
	
	@RequestMapping(value = "/classifications", method = RequestMethod.GET)
	public @ResponseBody Collection searchClassifications(@RequestParam(value = "longName", required = false) String longName,
			@RequestParam(value = "version", required = false) String version,
			@RequestParam(value = "name", required = false) String name,
			@RequestParam(value = "contextFilter", required = false) boolean contextFilter){
		
		return null;
		
	}
}
