package gov.nih.nci.cadsr.model.jaxb;

import java.util.List;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlTransient;

@XmlRootElement(name = "item")
public class JaxbDataElement extends JaxbBaseObject{

	String idSeq;
	String longcdename;
	String preferreddefinition;
	String contextname;
	String conteIdseq;
	String registrationstatus;
	String preferredname;
	String workflow;
	String version;
	boolean isPublished;
	List<JaxbContext> jaxbContext;
	String vdIdseq;
	String usingContexts;
	String deIdseq;
	String dateadded;
	JaxbValueDomain valueDomain;

	public String getIdSeq() {
		return idSeq;
	}

	@XmlElement(name = "idseq")
	public void setIdSeq(String idSeq) {
		this.idSeq = idSeq;
	}

	public String getLongcdename() {
		return longcdename;
	}

	@XmlElement(name = "long-cDEName")
	public void setLongcdename(String longcdename) {
		this.longcdename = longcdename;
	}

	public String getPreferreddefinition() {
		return preferreddefinition;
	}

	@XmlElement(name = "preferred-definition")
	public void setPreferreddefinition(String preferredDefinition) {
		this.preferreddefinition = preferredDefinition;
	}

	public String getContextname() {
		return contextname;
	}

	@XmlElement(name = "context-name")
	public void setContextname(String contextName) {
		this.contextname = contextName;
	}

	public String getConteIdseq() {
		return conteIdseq;
	}

	@XmlElement(name = "conte-idseq")
	public void setConteIdseq(String conteIdseq) {
		this.conteIdseq = conteIdseq;
	}

	public void setPublished(boolean isPublished) {
		this.isPublished = isPublished;
	}

	public String getRegistrationstatus() {
		return registrationstatus;
	}

	@XmlElement(name = "registration-status")
	public void setRegistrationstatus(String registrationStatus) {
		this.registrationstatus = registrationStatus;
	}

	public String getPreferredname() {
		return preferredname;
	}

	@XmlElement(name = "preferred-name")
	public void setPreferredname(String preferredname) {
		this.preferredname = preferredname;
	}

	public String getWorkflow() {
		return workflow;
	}

	@XmlElement(name = "asl-name")
	public void setWorkflow(String aslName) {
		this.workflow = aslName;
	}

	public String getVersion() {
		return version;
	}

	@XmlElement(name = "version")
	public void setVersion(String version) {
		this.version = version;
	}

	public boolean getIsPublished() {
		return isPublished;
	}
	@XmlElement(name = "is-published")
	public void setIsPublished(boolean isPublished) {
		this.isPublished = isPublished;
	}

	public String getVdIdseq() {
		return vdIdseq;
	}
	@XmlElement(name = "vd-idseq")
	public void setVdIdseq(String vdIdseq) {
		this.vdIdseq = vdIdseq;
	}

	public String getUsingContexts() {
		return usingContexts;
	}
	@XmlElement(name = "using-contexts")
	public void setUsingContexts(String usingContexts) {
		this.usingContexts = usingContexts;
	}

	public String getDeIdseq() {
		return deIdseq;
	}
	@XmlElement(name = "de-idseq")
	public void setDeIdseq(String deIdseq) {
		this.deIdseq = deIdseq;
	}

	public List<JaxbContext> getContext() {
		return jaxbContext;
	}
	@XmlElement(name="context")
	public void setContext(List<JaxbContext> jaxbContext) {
		this.jaxbContext = jaxbContext;
	}

	public String getDateadded() {
		return dateadded;
	}
	@XmlTransient
	public void setDateadded(String dateAdded) {
		this.dateadded = dateAdded;
	}

	public JaxbValueDomain getValueDomain() {
		return valueDomain;
	}

	@XmlElement(name="value-domain")
	public void setValueDomain(JaxbValueDomain valueDomain) {
		this.valueDomain = valueDomain;
	}
	

}
