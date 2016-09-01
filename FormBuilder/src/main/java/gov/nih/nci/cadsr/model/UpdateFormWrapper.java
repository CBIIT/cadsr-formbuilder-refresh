package gov.nih.nci.cadsr.model;

import java.util.List;

import gov.nih.nci.ncicb.cadsr.common.dto.FormInstructionChangesTransferObject;
import gov.nih.nci.ncicb.cadsr.common.dto.ModuleChangesTransferObject;
import gov.nih.nci.ncicb.cadsr.common.dto.ModuleTransferObject;
import gov.nih.nci.ncicb.cadsr.common.dto.ProtocolTransferObject;
import gov.nih.nci.ncicb.cadsr.common.dto.TriggerActionChangesTransferObject;

public class UpdateFormWrapper {
	
	private FormWrapper formHeader;
	private List<ProtocolTransferObject> addedProtocols;
	private List<String> deletedProtocols;
	private List<ModuleTransferObject> addedModules;
	private List<ModuleChangesTransferObject> updatedModules;
	private List<String> deletedModules;
	private List<FormInstructionChangesTransferObject> instructionChanges;
	private List<TriggerActionChangesTransferObject> protocolTriggerActionChanges; //XXX: These are skip patterns?

}
