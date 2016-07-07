package gov.nih.nci.cadsr.manager.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import gov.nih.nci.cadsr.dao.impl.ExampleDaoImpl;
import gov.nih.nci.cadsr.manager.ExampleManager;

@Service
public class ExampleManagerImpl implements ExampleManager {
	
	@Autowired
	private ExampleDaoImpl exDao;
	
	public String printName(String name){
		
		return exDao.retrieveGreeting(name);
	}

}
