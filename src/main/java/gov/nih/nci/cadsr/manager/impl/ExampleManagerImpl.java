package gov.nih.nci.cadsr.manager.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import gov.nih.nci.cadsr.dao.ExampleDao;
import gov.nih.nci.cadsr.manager.ExampleManager;

@Service
public class ExampleManagerImpl implements ExampleManager {
	
	@Autowired
	private ExampleDao exDao;
	
	public String printName(String name){
		
		return exDao.retrieveGreeting(name);
		
	}
	
	public String pingDb(String db){
		
		return exDao.pingDb(db);
	}

}
