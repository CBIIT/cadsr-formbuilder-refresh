package gov.nih.nci.cadsr.model;

import java.util.ArrayList;
import java.util.List;

import gov.nih.nci.ncicb.cadsr.common.dto.ContextTransferObject;
import gov.nih.nci.ncicb.cadsr.common.dto.ProtocolTransferObject;

public class FormMetaData {
	
	private String formIdseq;
	private String createdBy;
	private String longName;
	private String preferredDefinition;
	private ContextTransferObject context;
	private List<ProtocolTransferObject> protocolTransferObjects;
	private String aslName;
	private String formCategory;
	private String formType;
	private float version;

	public String getFormIdseq() {
		return formIdseq;
	}

	public void setFormIdseq(String formIdseq) {
		this.formIdseq = formIdseq;
	}

	public List<ProtocolTransferObject> getProtocolTransferObjects() {
		return protocolTransferObjects;
	}

	public void setProtocolTransferObjects(List<ProtocolTransferObject> protocolTransferObjects) {
		this.protocolTransferObjects = protocolTransferObjects;
	}

	public void setProtocolTransferObjects(ArrayList<ProtocolTransferObject> protocolTransferObjects) {
		this.protocolTransferObjects = protocolTransferObjects;
	}

	public String getCreatedBy() {
		return createdBy;

	}

	public void setCreatedBy(String createdBy) {
		this.createdBy = createdBy;
	}

	public String getLongName() {
		return longName;
	}

	public void setLongName(String longName) {
		this.longName = longName;
	}

	public String getPreferredDefinition() {
		return preferredDefinition;
	}

	public void setPreferredDefinition(String preferredDefinition) {
		this.preferredDefinition = preferredDefinition;
	}

	public ContextTransferObject getContext() {
		return context;
	}

	public void setContext(ContextTransferObject context) {
		this.context = context;
	}

	public String getAslName() {
		return aslName;
	}

	public void setAslName(String aslName) {
		this.aslName = aslName;
	}

	public String getFormCategory() {
		return formCategory;
	}

	public void setFormCategory(String formCategory) {
		this.formCategory = formCategory;
	}

	public String getFormType() {
		return formType;
	}

	public void setFormType(String formType) {
		this.formType = formType;
	}

	public float getVersion() {
		return version;
	}

	public void setVersion(float version) {
		this.version = version;
	}

}
