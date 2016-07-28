package gov.nih.nci.cadsr.manager.impl;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;
import gov.nih.nci.cadsr.manager.TypeManager;
import gov.nih.nci.ncicb.cadsr.common.persistence.PersistenceConstants;

@Service

public class TypeManagerImpl implements TypeManager {
	private static final Logger logger = Logger.getLogger(TypeManagerImpl.class);

	@Override
	public String[] getAllType() {
		long startTimer = System.currentTimeMillis();
		String[] type = PersistenceConstants.FORM_TYPE_VALUES;
		long endTimer = System.currentTimeMillis();
		logger.info("----------DAO call took " + (endTimer - startTimer) + " ms.");
		logger.info("----------# to get Type Results to service: " + type.length);
		return type;

	}

}
