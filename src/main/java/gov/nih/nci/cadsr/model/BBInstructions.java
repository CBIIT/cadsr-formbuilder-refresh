package gov.nih.nci.cadsr.model;

import gov.nih.nci.cadsr.model.frontend.FEContext;

public class BBInstructions {
	
	public Float version;
	public String longName;
	public String aslName;
	public FEContext context;
	public String createdBy;
	public String idseq;
	
	
	public Float getVersion() {
		return version;
	}
	public void setVersion(Float version) {
		this.version = version;
	}
	public String getLongName() {
		return longName;
	}
	public void setLongName(String longName) {
		this.longName = longName;
	}
	public String getAslName() {
		return aslName;
	}
	public void setAslName(String aslName) {
		this.aslName = aslName;
	}
	public FEContext getContext() {
		return context;
	}
	public void setContext(FEContext context) {
		this.context = context;
	}
	public String getCreatedBy() {
		return createdBy;
	}
	public void setCreatedBy(String createdBy) {
		this.createdBy = createdBy;
	}
	public String getIdseq() {
		return idseq;
	}
	public void setIdseq(String idseq) {
		this.idseq = idseq;
	}
	
}
