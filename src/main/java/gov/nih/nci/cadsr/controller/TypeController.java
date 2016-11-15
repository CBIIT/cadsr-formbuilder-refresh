package gov.nih.nci.cadsr.controller;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import gov.nih.nci.cadsr.manager.TypeManager;

@RestController
public class TypeController {
	private static final Logger logger = Logger.getLogger(CategoryController.class);

	@Autowired
	TypeManager typeManager;

	@RequestMapping(value = "/types", method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity<String[]> getAllTypes() throws RuntimeException {

		long startTimer = System.currentTimeMillis();

		String[] type = typeManager.getAllType();
		ResponseEntity<String[]> response = createSuccessResponse(type);

		long endTimer = System.currentTimeMillis();
		logger.info("----------EJB query took " + (endTimer - startTimer) + " ms.");
		logger.info("----------# of type Results: " + type.length);
		return response;
	}

	private ResponseEntity<String[]> createSuccessResponse(String[] type) {

		return new ResponseEntity<String[]>(type, HttpStatus.OK);

	}

}
