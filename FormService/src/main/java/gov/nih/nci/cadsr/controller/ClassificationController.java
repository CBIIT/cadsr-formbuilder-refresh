package gov.nih.nci.cadsr.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import gov.nih.nci.cadsr.manager.ClassificationManager;
import gov.nih.nci.ncicb.cadsr.common.dto.ProtocolTransferObject;
import gov.nih.nci.ncicb.cadsr.common.dto.bc4j.BC4JClassificationsTransferObject;
import gov.nih.nci.ncicb.cadsr.common.resource.ClassSchemeItem;

@RestController
public class ClassificationController {

	@Autowired
	private ClassificationManager classificationManager;

	@RequestMapping(value = "/classification", method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity<List<ClassSchemeItem>> getClassification(
			@RequestParam(value = "csLongName", required = false) String csLongName,
			@RequestParam(value = "csName", required = false) String csName,
			@RequestParam(value = "checked", required = false) Boolean checked) {
		List<ClassSchemeItem> classificationList = classificationManager.getClassification(csLongName, csName, checked);
		ResponseEntity<List<ClassSchemeItem>> response = createSuccessResponse(classificationList);

		return response;
	}

	private ResponseEntity<List<ClassSchemeItem>> createSuccessResponse(
			final List<ClassSchemeItem> classificationList) {

		return new ResponseEntity<List<ClassSchemeItem>>(classificationList, HttpStatus.OK);
	}

}
