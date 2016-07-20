package gov.nih.nci.cadsr.manager.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import gov.nih.nci.cadsr.dao.WorkFlowDao;
import gov.nih.nci.cadsr.domain.WorkFlow;
import gov.nih.nci.cadsr.manager.WorkFlowManager;

@Service
public class WorkFlowManagerImpl implements WorkFlowManager {
@Autowired
private WorkFlowDao workFlowDao;
	
	public List<WorkFlow> getAllWorkflow() {
		
		return workFlowDao.getAllWorkFlow();
	}
	
	
	

}
