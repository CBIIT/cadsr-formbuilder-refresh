package gov.nih.nci.cadsr.model;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Component;

import gov.nih.nci.cadsr.model.FormMetaData;
import gov.nih.nci.cadsr.model.ModuleChangesWrapper;
import gov.nih.nci.ncicb.cadsr.common.dto.FormInstructionChangesTransferObject;
import gov.nih.nci.ncicb.cadsr.common.dto.FormTransferObject;
import gov.nih.nci.ncicb.cadsr.common.dto.ModuleTransferObject;
import gov.nih.nci.ncicb.cadsr.common.dto.ProtocolTransferObject;
import gov.nih.nci.ncicb.cadsr.common.dto.TriggerActionChangesTransferObject;

@Component
//@Scope(proxyMode=ScopedProxyMode.TARGET_CLASS, value="session")
public class CurrentForm implements Serializable {
	
	private FormMetaData formHeader;
	private FormTransferObject fullForm;
	private List<ProtocolTransferObject> addedProtocols;
	private List<String> deletedProtocols;
	private List<ModuleTransferObject> addedModules;
	private List<ModuleChangesWrapper> updatedModules;
	private List<String> deletedModules;
	private FormInstructionChangesTransferObject instructionChanges;
	private List<TriggerActionChangesTransferObject> protocolTriggerActionChanges; //XXX: These are skip patterns?
	
	public CurrentForm(){
		formHeader = new FormMetaData();
		addedProtocols = new ArrayList<ProtocolTransferObject>();
		deletedProtocols = new ArrayList<String>();
		addedModules = new ArrayList<ModuleTransferObject>();
		updatedModules = new ArrayList<ModuleChangesWrapper>();
		deletedModules = new ArrayList<String>();
		instructionChanges = new FormInstructionChangesTransferObject();
		instructionChanges.setFormHeaderInstructionChanges(new HashMap());
		instructionChanges.setFormFooterInstructionChanges(new HashMap());
		protocolTriggerActionChanges = new ArrayList<TriggerActionChangesTransferObject>();
	}
	
	public FormMetaData getFormHeader() {
		return formHeader;
	}
	public void setFormHeader(FormMetaData formHeader) {
		this.formHeader = formHeader;
	}
	public FormTransferObject getFullForm() {
		return fullForm;
	}

	public void setFullForm(FormTransferObject fullForm) {
		this.fullForm = fullForm;
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
	public List<ModuleChangesWrapper> getUpdatedModules() {
		return updatedModules;
	}
	public void setUpdatedModules(List<ModuleChangesWrapper> updatedModules) {
		this.updatedModules = updatedModules;
	}
	public List<String> getDeletedModules() {
		return deletedModules;
	}
	public void setDeletedModules(List<String> deletedModules) {
		this.deletedModules = deletedModules;
	}
	public FormInstructionChangesTransferObject getInstructionChanges() {
		return instructionChanges;
	}
	public void setInstructionChanges(FormInstructionChangesTransferObject instructionChanges) {
		this.instructionChanges = instructionChanges;
	}
	public List<TriggerActionChangesTransferObject> getProtocolTriggerActionChanges() {
		return protocolTriggerActionChanges;
	}
	public void setProtocolTriggerActionChanges(List<TriggerActionChangesTransferObject> protocolTriggerActionChanges) {
		this.protocolTriggerActionChanges = protocolTriggerActionChanges;
	}

}
