package gov.nih.nci.cadsr.dao;

import gov.nih.nci.cadsr.model.Customer;

public interface ExampleDao {
	
	public String retrieveGreeting(String name);
	
	public String pingDb(String db);
	
}
