package gov.nih.nci.cadsr.manager.impl;

import java.util.Collection;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import gov.nih.nci.cadsr.manager.ContextsManager;
import gov.nih.nci.ncicb.cadsr.common.persistence.dao.AbstractDAOFactoryFB;

@Service
public class ContextsManagerImpl implements ContextsManager {
	private static final Logger logger = Logger.getLogger(ContextsManagerImpl.class);

	@Autowired
	AbstractDAOFactoryFB daoFactory;

	@Override
	public Collection getAllContexts() {

		long startTimer = System.currentTimeMillis();
		Collection cont = daoFactory.getContextDAO().getAllContexts();
		long endTimer = System.currentTimeMillis();
		logger.info("----------DAO call took " + (endTimer - startTimer) + " ms.");
		logger.info("----------# to get Contexts Results to service: " + cont.size());
		return cont;

	}

}
