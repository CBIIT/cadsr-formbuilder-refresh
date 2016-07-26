package gov.nih.nci.cadsr.manager.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import gov.nih.nci.cadsr.dao.CategoryDao;
import gov.nih.nci.cadsr.manager.CategoryManager;
import gov.nih.nci.cadsr.model.Category;

@Service
public class CategoryManagerImpl implements CategoryManager {

	@Autowired
	private CategoryDao categoryDao;

	@Override
	public List<Category> getAllCategory() {

		return categoryDao.getAllCategory();
	}

}