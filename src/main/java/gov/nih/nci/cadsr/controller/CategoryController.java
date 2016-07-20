package gov.nih.nci.cadsr.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import gov.nih.nci.cadsr.manager.CategoryManager;
import gov.nih.nci.cadsr.model.Category;

@RestController
public class CategoryController {

	@Autowired
	private CategoryManager categoryManager;

	@RequestMapping(value = "/category", method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity<List<Category>> getAllCategory() {

		List<Category> category = categoryManager.getAllCategory();
		ResponseEntity<List<Category>> response = createSuccessResponse(category);

		return response;
	}

	private ResponseEntity<List<Category>> createSuccessResponse(List<Category> category) {
		return new ResponseEntity<List<Category>>(category, HttpStatus.OK);
	}

}
