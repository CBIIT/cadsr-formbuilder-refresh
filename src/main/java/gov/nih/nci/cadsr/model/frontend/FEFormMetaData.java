package gov.nih.nci.cadsr.model.frontend;

import java.io.Serializable;
import java.util.List;

public class FEFormMetaData extends FECartItem implements FEBaseObject,Serializable{
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1234567L;
	private String formIdseq;
	private String createdBy;
	private String longName;
	private String preferredDefinition;
	private FEContext context;
	private List<FEProtocol> protocols;
	private List<FEClassification> classifications;
	private String workflow;
	private String formCategory;
	private String formType;
	private Float version;
	private String headerInstructions;
	private String footerInstructions;
	private int publicId;
	
	private boolean isLocked = false;
	private boolean curatorialPermission = false;
	
	
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
	public FEContext getContext() {
		return context;
	}
	public void setContext(FEContext context) {
		this.context = context;
	}
	public List<FEProtocol> getProtocols() {
		return protocols;
	}
	public void setProtocols(List<FEProtocol> protocols) {
		this.protocols = protocols;
	}
	public List<FEClassification> getClassifications() {
		return classifications;
	}
	public void setClassifications(List<FEClassification> classifications) {
		this.classifications = classifications;
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
	public int getPublicId() {
		return publicId;
	}
	public void setPublicId(int publicId) {
		this.publicId = publicId;
	}
	public boolean isLocked() {
		return isLocked;
	}
	public void setLocked(boolean isLocked) {
		this.isLocked = isLocked;
	}
	public boolean isCuratorialPermission() {
		return curatorialPermission;
	}
	public void setCuratorialPermission(boolean curatorialPermission) {
		this.curatorialPermission = curatorialPermission;
	}

}
