package gov.nih.nci.cadsr.controller;

import java.util.Collection;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import gov.nih.nci.cadsr.manager.CategoryManager;

@RestController
public class CategoryController {
	private static final Logger logger = Logger.getLogger(CategoryController.class);
	@Autowired
	private CategoryManager categoryManager;

	@RequestMapping(value = "/categories", method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity<Collection> getAllCategories() throws RuntimeException {

		long startTimer = System.currentTimeMillis();
		Collection category = categoryManager.getAllFormCategories();

		ResponseEntity<Collection> response = createSuccessResponse(category);
		long endTimer = System.currentTimeMillis();
		logger.info("----------EJB query took " + (endTimer - startTimer) + " ms.");
		logger.info("----------# of category Results: " + category.size());

		return response;

	}

	/*
	 * @RequestMapping(value = "/category", method = RequestMethod.GET)
	 * 
	 * @ResponseBody public ResponseEntity<List<Category>> getAllCategory() {
	 * 
	 * List<Category> category = categoryManager.getAllCategory();
	 * ResponseEntity<List<Category>> response =
	 * createSuccessResponse(category);
	 * 
	 * return response; }
	 */

	private ResponseEntity<Collection> createSuccessResponse(Collection category) {
		return new ResponseEntity<Collection>(category, HttpStatus.OK);
	}

}
