package gov.nih.nci.cadsr.model;

import java.io.Serializable;
import java.util.List;

import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Component;

import gov.nih.nci.cadsr.model.FormMetaData;
import gov.nih.nci.ncicb.cadsr.common.dto.FormInstructionChangesTransferObject;
import gov.nih.nci.ncicb.cadsr.common.dto.ModuleChangesTransferObject;
import gov.nih.nci.ncicb.cadsr.common.dto.ModuleTransferObject;
import gov.nih.nci.ncicb.cadsr.common.dto.ProtocolTransferObject;
import gov.nih.nci.ncicb.cadsr.common.dto.TriggerActionChangesTransferObject;

@Component
public class CurrentForm implements Serializable {
	
	private FormMetaData formHeader;
	private List<ProtocolTransferObject> addedProtocols;
	private List<String> deletedProtocols;
	private List<ModuleTransferObject> addedModules;
	private List<ModuleChangesTransferObject> updatedModules;
	private List<String> deletedModules;
	private List<FormInstructionChangesTransferObject> instructionChanges;
	private List<TriggerActionChangesTransferObject> protocolTriggerActionChanges; //XXX: These are skip patterns?
	public FormMetaData getFormHeader() {
		return formHeader;
	}
	public void setFormHeader(FormMetaData formHeader) {
		this.formHeader = formHeader;
	}
	public List<ProtocolTransferObject> getAddedProtocols() {
		return addedProtocols;
	}
	public void setAddedProtocols(List<ProtocolTransferObject> addedProtocols) {
		this.addedProtocols = addedProtocols;
	}
	public List<String> getDeletedProtocols() {
		return deletedProtocols;
	}
	public void setDeletedProtocols(List<String> deletedProtocols) {
		this.deletedProtocols = deletedProtocols;
	}
	public List<ModuleTransferObject> getAddedModules() {
		return addedModules;
	}
	public void setAddedModules(List<ModuleTransferObject> addedModules) {
		this.addedModules = addedModules;
	}
	public List<ModuleChangesTransferObject> getUpdatedModules() {
		return updatedModules;
	}
	public void setUpdatedModules(List<ModuleChangesTransferObject> updatedModules) {
		this.updatedModules = updatedModules;
	}
	public List<String> getDeletedModules() {
		return deletedModules;
	}
	public void setDeletedModules(List<String> deletedModules) {
		this.deletedModules = deletedModules;
	}
	public List<FormInstructionChangesTransferObject> getInstructionChanges() {
		return instructionChanges;
	}
	public void setInstructionChanges(List<FormInstructionChangesTransferObject> instructionChanges) {
		this.instructionChanges = instructionChanges;
	}
	public List<TriggerActionChangesTransferObject> getProtocolTriggerActionChanges() {
		return protocolTriggerActionChanges;
	}
	public void setProtocolTriggerActionChanges(List<TriggerActionChangesTransferObject> protocolTriggerActionChanges) {
		this.protocolTriggerActionChanges = protocolTriggerActionChanges;
	}

}
