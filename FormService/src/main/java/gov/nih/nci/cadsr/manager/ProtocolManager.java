package gov.nih.nci.cadsr.manager;

import java.util.Collection;
import java.util.List;

import gov.nih.nci.ncicb.cadsr.common.dto.ProtocolTransferObject;
import gov.nih.nci.ncicb.cadsr.common.resource.Protocol;

public interface ProtocolManager {
	

	public List<ProtocolTransferObject> getProtocol(String KeyWord);
	public ProtocolTransferObject getProtocolByPK(String protocoldIdseq);

}
