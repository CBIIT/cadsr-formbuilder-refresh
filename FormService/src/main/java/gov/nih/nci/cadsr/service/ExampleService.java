package gov.nih.nci.cadsr.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import gov.nih.nci.cadsr.dao.ExampleDao;

@Service
public class ExampleService {
	
	@Autowired
	private ExampleDao exDao;
	
	public String printName(String name){
		
		return exDao.retrieveGreeting(name);
	}

}
