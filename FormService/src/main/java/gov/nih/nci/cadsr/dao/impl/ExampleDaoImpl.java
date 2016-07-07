package gov.nih.nci.cadsr.dao.impl;

import org.springframework.stereotype.Repository;

import gov.nih.nci.cadsr.dao.ExampleDao;

@Repository
public class ExampleDaoImpl implements ExampleDao {
	
	private static final String GREETING_PREFIX = "Hello ";
	
	public String retrieveGreeting(String name){
		
		return GREETING_PREFIX + name;
	}

}
