package gov.nih.nci.cadsr.manager;

import java.util.Collection;

public interface WorkFlowManager {

	// public List<WorkFlow> getAllWorkflow();
	public Collection getStatusesForACType(String acType);

}
