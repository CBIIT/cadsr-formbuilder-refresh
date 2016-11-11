package gov.nih.nci.cadsr.manager.impl;

import java.util.Collection;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import gov.nih.nci.cadsr.manager.CategoryManager;
import gov.nih.nci.ncicb.cadsr.common.persistence.dao.AbstractDAOFactoryFB;

@Service
public class CategoryManagerImpl implements CategoryManager {

	@Autowired
	AbstractDAOFactoryFB daoFactory;
	private static final Logger logger = Logger.getLogger(CategoryManagerImpl.class);

	public Collection getAllFormCategories() {
		long startTimer = System.currentTimeMillis();
		Collection cat = daoFactory.getFormCategoryDAO().getAllCategories();
		long endTimer = System.currentTimeMillis();
		logger.info("----------DAO call took " + (endTimer - startTimer) + " ms.");
		logger.info("----------# to get category Results to service: " + cat.size());
		return cat;
	}

	// @Override
	/*
	 * public List<Category> getAllCategory() {
	 * 
	 * return categoryDao.getAllCategory(); }
	 */

}
