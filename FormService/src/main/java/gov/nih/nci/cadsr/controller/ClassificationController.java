package gov.nih.nci.cadsr.controller;

import java.util.List;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import gov.nih.nci.cadsr.dao.impl.ClassificationTrDaoImpl;
import gov.nih.nci.cadsr.manager.ClassificationManager;
import gov.nih.nci.ncicb.cadsr.common.resource.ClassSchemeItem;

@RestController
public class ClassificationController {

	@Autowired
	private ClassificationManager classificationManager;
	

	@RequestMapping(value = "/classifications/{keyword}", method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity<List<ClassSchemeItem>> getClassification(@PathVariable String keyword) {
		
		List<ClassSchemeItem> classificationList = classificationManager.getClassification(keyword);
		ResponseEntity<List<ClassSchemeItem>> response = createSuccessResponse(classificationList);
		
		return response;
	}

	private ResponseEntity<List<ClassSchemeItem>> createSuccessResponse(
			final List<ClassSchemeItem> classificationList) {

		return new ResponseEntity<List<ClassSchemeItem>>(classificationList, HttpStatus.OK);
	}

}
