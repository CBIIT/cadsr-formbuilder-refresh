package gov.nih.nci.cadsr.manager.impl;

import java.util.Collection;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import gov.nih.nci.cadsr.manager.WorkFlowManager;
import gov.nih.nci.ncicb.cadsr.common.persistence.dao.AbstractDAOFactoryFB;

@Service
public class WorkFlowManagerImpl implements WorkFlowManager {
	private static final Logger logger = Logger.getLogger(WorkFlowManagerImpl.class);

	@Autowired
	AbstractDAOFactoryFB daoFactory;
	/* private WorkFlowDao workFlowDao; */

	/*
	 * public List<WorkFlow> getAllWorkflow() {
	 * 
	 * return workFlowDao.getAllWorkFlow(); }
	 */
	public Collection getStatusesForACType(String acType) {

		long startTimer = System.currentTimeMillis();
		Collection workflow = daoFactory.getWorkFlowStatusDAO().getWorkFlowStatusesForACType(acType);
		long endTimer = System.currentTimeMillis();
		logger.info("----------DAO call took " + (endTimer - startTimer) + " ms.");
		logger.info("----------# to get Workflow Results to service: " + workflow.size());
		return workflow;

	}

}
