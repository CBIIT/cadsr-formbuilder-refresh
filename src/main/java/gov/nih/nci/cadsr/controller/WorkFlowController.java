package gov.nih.nci.cadsr.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import gov.nih.nci.cadsr.manager.WorkFlowManager;
import gov.nih.nci.cadsr.model.WorkFlow;

@RestController
public class WorkFlowController {
	
	
	@Autowired
	private WorkFlowManager workFlowManager;
	
	
	@RequestMapping(value = "/workFlow", method = RequestMethod.GET)
	 @ResponseBody
	    public ResponseEntity<List<WorkFlow>> getAllWorkflow()
	             {
	        
	        List<WorkFlow> workFlow = workFlowManager.getAllWorkflow();
	        ResponseEntity<List<WorkFlow>> response = createSuccessResponse(workFlow);
	        
	        return response;
	    }
	
	
	
	
private ResponseEntity<List<WorkFlow>> createSuccessResponse(List<WorkFlow> workFlow) {
		return new ResponseEntity<List<WorkFlow>>(workFlow, HttpStatus.OK);
	}
	

}
