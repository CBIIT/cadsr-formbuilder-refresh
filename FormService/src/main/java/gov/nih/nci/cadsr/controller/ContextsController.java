package gov.nih.nci.cadsr.controller;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import gov.nih.nci.cadsr.manager.ClassificationManager;
import gov.nih.nci.cadsr.manager.ContextsManager;
import gov.nih.nci.cadsr.model.Tree;
import gov.nih.nci.cadsr.model.TreeClassification;
import gov.nih.nci.cadsr.model.TreeContext;
import gov.nih.nci.ncicb.cadsr.common.dto.ContextTransferObject;
import gov.nih.nci.ncicb.cadsr.common.dto.jdbc.ClassSchemeValueObject;
import gov.nih.nci.ncicb.cadsr.common.resource.ClassSchemeItem;
import gov.nih.nci.ncicb.cadsr.common.resource.ClassificationScheme;

@RestController
public class ContextsController {
	private static final Logger logger = Logger.getLogger(ContextsController.class);

	@Autowired
	ContextsManager contextsManager;
	@Autowired
	ClassificationManager classificationManager;

	@RequestMapping(value = { "/contexts", "/contexts/{username}" }, method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity<Collection> getAllContexts(@PathVariable Optional<String> username) throws RuntimeException {

		long startTimer = System.currentTimeMillis();
		Collection contexts = contextsManager.getAllContexts();

		ResponseEntity<Collection> response = createSuccessResponse(contexts);
		long endTimer = System.currentTimeMillis();
		logger.info("----------EJB query took " + (endTimer - startTimer) + " ms.");
		logger.info("----------# of contexts Results: " + contexts.size());

		return response;

	}

	private ResponseEntity<Collection> createSuccessResponse(Collection contexts) {
		return new ResponseEntity<Collection>(contexts, HttpStatus.OK);
	}

	@RequestMapping(value = { "/tree" }, method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity<Tree> getTree() throws RuntimeException {
		long startTimer = System.currentTimeMillis();
		
		Tree tree = classificationManager.getTree();
		
		ResponseEntity<Tree> response = createSuccessResponse(tree);
		long endTimer = System.currentTimeMillis();
		logger.info("----------EJB query took " + (endTimer - startTimer) + " ms.");

		return response;
	}

	private ResponseEntity<Tree> createSuccessResponse(Tree tree) {
        return new ResponseEntity<Tree>(tree, HttpStatus.OK);
	}
}

