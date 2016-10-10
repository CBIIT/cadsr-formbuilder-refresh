package gov.nih.nci.cadsr.manager;

import java.util.Collection;

public interface ContextsManager {

	public Collection getAllContexts();
	
	public Collection getContextsByUser(String username);

}
