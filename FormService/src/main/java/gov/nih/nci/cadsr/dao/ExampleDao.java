package gov.nih.nci.cadsr.dao;

import gov.nih.nci.cadsr.domain.Customer;

public interface ExampleDao {
	
	public String retrieveGreeting(String name);
	
	public String pingDb(String db);
	
	public void insert(Customer customer);
	
	public Customer findByCustomerId(int custId);

}
