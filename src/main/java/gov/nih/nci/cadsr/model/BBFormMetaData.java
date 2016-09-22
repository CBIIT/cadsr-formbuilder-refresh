package gov.nih.nci.cadsr.model;

import java.util.List;

public class BBFormMetaData {
	
	private String formIdseq;
	private String createdBy;
	private String longName;
	private String preferredDefinition;
	private BBContext context;
	private List<BBProtocol> protocols;
	private String workflow;
	private String formCategory;
	private String formType;
	private Float version;
	private String headerInstructions;
	private String footerInstructions;
	
	
	public String getFormIdseq() {
		return formIdseq;
	}
	public void setFormIdseq(String formIdseq) {
		this.formIdseq = formIdseq;
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
	public BBContext getContext() {
		return context;
	}
	public void setContext(BBContext context) {
		this.context = context;
	}
	public List<BBProtocol> getProtocols() {
		return protocols;
	}
	public void setProtocols(List<BBProtocol> protocols) {
		this.protocols = protocols;
	}
	public String getWorkflow() {
		return workflow;
	}
	public void setWorkflow(String workflow) {
		this.workflow = workflow;
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
	public Float getVersion() {
		return version;
	}
	public void setVersion(Float version) {
		this.version = version;
	}
	public String getHeaderInstructions() {
		return headerInstructions;
	}
	public void setHeaderInstructions(String headerInstructions) {
		this.headerInstructions = headerInstructions;
	}
	public String getFooterInstructions() {
		return footerInstructions;
	}
	public void setFooterInstructions(String footerInstructions) {
		this.footerInstructions = footerInstructions;
	}

}
