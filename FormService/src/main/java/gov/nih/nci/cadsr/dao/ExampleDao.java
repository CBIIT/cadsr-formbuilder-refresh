package gov.nih.nci.cadsr.dao;

import org.springframework.stereotype.Repository;

@Repository
public class ExampleDao {
	
	private static final String GREETING_PREFIX = "Hello ";
	
	public String retrieveGreeting(String name){
		
		return GREETING_PREFIX + name;
	}

}
