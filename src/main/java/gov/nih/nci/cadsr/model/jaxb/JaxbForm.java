package gov.nih.nci.cadsr.model.jaxb;

import java.util.ArrayList;
import java.util.List;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlTransient;

@XmlRootElement(name = "form")
public class JaxbForm extends JaxbBaseObject{

	private String createdBy;
	private String dateCreated;
	private String longName;
	private String preferredDefinition;
	private String dateadded;
	private String context;
	private String publicID;
	private String workflowStatusName;
	private String dateModified;
	private String version;
	List<JaxbProtocol> Protocol = new ArrayList<JaxbProtocol>();

	public String getCreatedBy() {
		return createdBy;
	}

	@XmlElement(name = "createdBy")
	public void setCreatedBy(String createdBy) {
		this.createdBy = createdBy;
	}

	public String getDateCreated() {
		return dateCreated;
	}

	@XmlElement(name = "dateCreated")
	public void setDateCreated(String dateCreated) {
		this.dateCreated = dateCreated;
	}

	public String getLongName() {
		return longName;
	}

	@XmlElement(name = "longName")
	public void setLongName(String longName) {
		this.longName = longName;
	}

	public String getPreferredDefinition() {
		return preferredDefinition;
	}

	@XmlElement(name = "preferredDefinition")
	public void setPreferredDefinition(String preferredDefinition) {
		this.preferredDefinition = preferredDefinition;
	}

	public String getDateadded() {
		return dateadded;
	}

	@XmlTransient
	public void setDateadded(String dateAdded) {
		this.dateadded = dateAdded;
	}

	public String getContext() {
		return context;
	}

	@XmlElement(name = "context")
	public void setContext(String context) {
		this.context = context;
	}

	public String getPublicID() {
		return publicID;
	}

	@XmlElement(name = "publicID")
	public void setPublicID(String publicID) {
		this.publicID = publicID;
	}

	public String getWorkflowStatusName() {
		return workflowStatusName;
	}

	@XmlElement(name = "workflowStatusName")
	public void setWorkflowStatusName(String workflowStatusName) {
		this.workflowStatusName = workflowStatusName;
	}

	public String getDateModified() {
		return dateModified;
	}

	@XmlElement(name = "dateModified")
	public void setDateModified(String dateModified) {
		this.dateModified = dateModified;
	}

	public String getVersion() {
		return version;
	}

	@XmlElement(name = "version")
	public void setVersion(String version) {
		this.version = version;
	}

	public List<JaxbProtocol> getProtocol() {
		return Protocol;
	}

	@XmlElement(name = "protocol")
	public void setProtocol(List<JaxbProtocol> protocol) {
		Protocol = protocol;
	}

}
