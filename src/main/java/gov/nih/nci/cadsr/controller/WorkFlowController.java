package gov.nih.nci.cadsr.controller;

import java.util.Collection;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import gov.nih.nci.cadsr.manager.WorkFlowManager;
import gov.nih.nci.ncicb.cadsr.common.persistence.PersistenceConstants;

@RestController
public class WorkFlowController {

	@Autowired
	private WorkFlowManager workFlowManager;

	@RequestMapping(value = "/workFlow", method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity<Collection> getAllWorkflow() throws RuntimeException {

		Collection workFlow = workFlowManager.getStatusesForACType(PersistenceConstants.FORM_ADMIN_COMPONENT_TYPE);
		ResponseEntity<Collection> response = createSuccessResponse(workFlow);

		return response;
	}

	private ResponseEntity<Collection> createSuccessResponse(Collection workFlow) {
		return new ResponseEntity<Collection>(workFlow, HttpStatus.OK);
	}

}
