package gov.nih.nci.cadsr.model.jaxb;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement(name = "valid-values")
public class JaxbValidValue extends JaxbBaseObject{
	
	private String contextName;
	private String vmId;
	private String shortMeaningValue;
	private String beginDate;
	private String workflow;
	private String shortMeaning;
	private String endDate;
	private String vmVersion;
	private JaxbConcept concept;
	private String description;
	private String vpIdseq;
	
	
	public String getContextName() {
		return contextName;
	}
	
	@XmlElement(name="context")
	public void setContextName(String contextName) {
		this.contextName = contextName;
	}
	
	public String getVmId() {
		return vmId;
	}
	
	@XmlElement(name="vm-id")
	public void setVmId(String vmId) {
		this.vmId = vmId;
	}
	
	public String getShortMeaningValue() {
		return shortMeaningValue;
	}
	
	@XmlElement(name="short-meaning-value")
	public void setShortMeaningValue(String shortMeaningValue) {
		this.shortMeaningValue = shortMeaningValue;
	}
	public String getBeginDate() {
		return beginDate;
	}
	
	@XmlElement(name="begin-date")
	public void setBeginDate(String beginDate) {
		this.beginDate = beginDate;
	}
	public String getWorkflow() {
		return workflow;
	}
	
	@XmlElement(name="workflowstatus")
	public void setWorkflow(String workflow) {
		this.workflow = workflow;
	}
	public String getShortMeaning() {
		return shortMeaning;
	}
	
	@XmlElement(name="short-meaning")
	public void setShortMeaning(String shortMeaning) {
		this.shortMeaning = shortMeaning;
	}
	public String getEndDate() {
		return endDate;
	}
	
	@XmlElement(name="end-date")
	public void setEndDate(String endDate) {
		this.endDate = endDate;
	}
	public String getVmVersion() {
		return vmVersion;
	}
	
	@XmlElement(name="vm-version")
	public void setVmVersion(String vmVersion) {
		this.vmVersion = vmVersion;
	}
	public JaxbConcept getConcept() {
		return concept;
	}
	
	@XmlElement(name="concept-derivation-rule")
	public void setConcept(JaxbConcept concept) {
		this.concept = concept;
	}
	public String getDescription() {
		return description;
	}
	
	@XmlElement(name="description")
	public void setDescription(String description) {
		this.description = description;
	}
	public String getVpIdseq() {
		return vpIdseq;
	}
	
	@XmlElement(name="vp-idseq")
	public void setVpIdseq(String vpIdseq) {
		this.vpIdseq = vpIdseq;
	}

}
