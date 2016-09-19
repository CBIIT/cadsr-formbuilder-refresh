package gov.nih.nci.cadsr.model;

import java.util.List;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlTransient;

@XmlRootElement(name = "item")
public class Item {

	String idSeq;
	String longCDEName;
	String preferredDefinition;
	String contextName;
	String registrationStatus;
	String prefferdName;
	String aslName;
	String version;
	boolean isPublished;
	List<Context> context;
	String vdIdseq;
	String usingContexts;
	String deIdseq;
	String dateAdded;

	public String getIdSeq() {
		return idSeq;
	}

	@XmlElement(name = "idseq")
	public void setIdSeq(String idSeq) {
		this.idSeq = idSeq;
	}

	public String getLongCDEName() {
		return longCDEName;
	}

	@XmlElement(name = "long-cDEName")
	public void setLongCDEName(String longCDEName) {
		this.longCDEName = longCDEName;
	}

	public String getPreferredDefinition() {
		return preferredDefinition;
	}

	@XmlElement(name = "preferred-definition")
	public void setPreferredDefinition(String preferredDefinition) {
		this.preferredDefinition = preferredDefinition;
	}

	public String getContextName() {
		return contextName;
	}

	@XmlElement(name = "context-name")
	public void setContextName(String contextName) {
		this.contextName = contextName;
	}

	public String getRegistrationStatus() {
		return registrationStatus;
	}

	@XmlElement(name = "registration-status")
	public void setRegistrationStatus(String registrationStatus) {
		this.registrationStatus = registrationStatus;
	}

	public String getPrefferdName() {
		return prefferdName;
	}

	@XmlElement(name = "preferred-name")
	public void setPrefferdName(String prefferdName) {
		this.prefferdName = prefferdName;
	}

	public String getAslName() {
		return aslName;
	}

	@XmlElement(name = "asl-name")
	public void setAslName(String aslName) {
		this.aslName = aslName;
	}

	public String getVersion() {
		return version;
	}

	@XmlElement(name = "version")
	public void setVersion(String version) {
		this.version = version;
	}

	public boolean isPublished() {
		return isPublished;
	}
	@XmlElement(name = "is-published")
	public void setPublished(boolean isPublished) {
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

	public List<Context> getContext() {
		return context;
	}
	@XmlElement(name="context")
	public void setContext(List<Context> context) {
		this.context = context;
	}

	public String getDateAdded() {
		return dateAdded;
	}
	@XmlTransient
	public void setDateAdded(String dateAdded) {
		this.dateAdded = dateAdded;
	}
	

}
