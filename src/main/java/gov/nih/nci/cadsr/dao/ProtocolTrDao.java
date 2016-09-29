package gov.nih.nci.cadsr.dao;

import java.util.List;

import gov.nih.nci.ncicb.cadsr.common.dto.ProtocolTransferObject;

public interface ProtocolTrDao {
	public List<ProtocolTransferObject> getProtocol(String longName, String PreferedName, Boolean checked);

}
