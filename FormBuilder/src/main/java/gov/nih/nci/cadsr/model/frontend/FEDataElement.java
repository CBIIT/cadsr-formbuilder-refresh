package gov.nih.nci.cadsr.model.frontend;

public class FEDataElement implements FEBaseObject{
	
	private String longname;
	private String longcdename;
	private String publicid;
	private String contextname;
	private String deIdseq;
	private String CDEId;
	private String conteIdseq;
	private String version;
	private String registrationstatus;
	private String preferredname;
	private String preferreddefinition;
	private String workflow;
	private String dateadded;
	private String usingContexts;
	private boolean isPublished;
	
	public String getLongname() {
		return longname;
	}
	public void setLongname(String longname) {
		this.longname = longname;
	}
	public String getLongcdename() {
		return longcdename;
	}
	public void setLongcdename(String longcdename) {
		this.longcdename = longcdename;
	}
	public String getPublicid() {
		return publicid;
	}
	public void setPublicid(String publicid) {
		this.publicid = publicid;
	}
	public String getContextname() {
		return contextname;
	}
	public void setContextname(String contextname) {
		this.contextname = contextname;
	}
	public String getDeIdseq() {
		return deIdseq;
	}
	public void setDeIdseq(String deIdseq) {
		this.deIdseq = deIdseq;
	}
	public String getCDEId() {
		return CDEId;
	}
	public void setCDEId(String cDEId) {
		CDEId = cDEId;
	}
	public String getConteIdseq() {
		return conteIdseq;
	}
	public void setConteIdseq(String conteIdseq) {
		this.conteIdseq = conteIdseq;
	}
	public String getVersion() {
		return version;
	}
	public void setVersion(String version) {
		this.version = version;
	}
	public String getRegistrationstatus() {
		return registrationstatus;
	}
	public void setRegistrationstatus(String registrationstatus) {
		this.registrationstatus = registrationstatus;
	}
	public String getPreferredname() {
		return preferredname;
	}
	public void setPreferredname(String preferredname) {
		this.preferredname = preferredname;
	}
	public String getPreferreddefinition() {
		return preferreddefinition;
	}
	public void setPreferreddefinition(String preferreddefinition) {
		this.preferreddefinition = preferreddefinition;
	}
	public String getWorkflow() {
		return workflow;
	}
	public void setWorkflow(String workflow) {
		this.workflow = workflow;
	}
	public String getDateadded() {
		return dateadded;
	}
	public void setDateadded(String dateadded) {
		this.dateadded = dateadded;
	}
	public String getUsingContexts() {
		return usingContexts;
	}
	public void setUsingContexts(String usingContexts) {
		this.usingContexts = usingContexts;
	}
	public boolean isPublished() {
		return isPublished;
	}
	public void setPublished(boolean isPublished) {
		this.isPublished = isPublished;
	}

}
