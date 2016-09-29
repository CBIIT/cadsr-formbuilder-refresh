package gov.nih.nci.cadsr.model;

import java.util.List;

import gov.nih.nci.ncicb.cadsr.common.dto.ContextTransferObject;
import gov.nih.nci.ncicb.cadsr.common.dto.FormTransferObject;
import gov.nih.nci.ncicb.cadsr.common.dto.QuestionTransferObject;

public class ModuleWrapper {
	
	private String createdBy;
	private String modifiedBy ;
	private String preferredDefinition;
	private String longName ;
	private String aslName;
	private long version;
	private String conteIdseq;
	private ContextTransferObject context;
	private FormTransferObject form;
	//private List terms;
	  private String moduleIdseq;
	  private int dispOrder;
	  //private List instructions;
	  private int numberOfRepeats;
	  private List<QuestionTransferObject> questions;
	  
	  
	
	public FormTransferObject getForm() {
		return form;
	}
	public void setForm(FormTransferObject form) {
		this.form = form;
	}
	public String getModuleIdseq() {
		return moduleIdseq;
	}
	public void setModuleIdseq(String moduleIdseq) {
		this.moduleIdseq = moduleIdseq;
	}
	public int getDispOrder() {
		return dispOrder;
	}
	public void setDispOrder(int dispOrder) {
		this.dispOrder = dispOrder;
	}
	public int getNumberOfRepeats() {
		return numberOfRepeats;
	}
	public void setNumberOfRepeats(int numberOfRepeats) {
		this.numberOfRepeats = numberOfRepeats;
	}
	public List<QuestionTransferObject> getQuestions() {
		return questions;
	}
	public void setQuestions(List<QuestionTransferObject> questions) {
		this.questions = questions;
	}
	public String getCreatedBy() {
		return createdBy;
	}
	public void setCreatedBy(String createdBy) {
		this.createdBy = createdBy;
	}
	public String getModifiedBy() {
		return modifiedBy;
	}
	public void setModifiedBy(String modifiedBy) {
		this.modifiedBy = modifiedBy;
	}
	public String getPreferredDefinition() {
		return preferredDefinition;
	}
	public void setPreferredDefinition(String preferredDefinition) {
		this.preferredDefinition = preferredDefinition;
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
	public long getVersion() {
		return version;
	}
	public void setVersion(long version) {
		this.version = version;
	}
	public String getConteIdseq() {
		return conteIdseq;
	}
	public void setConteIdseq(String conteIdseq) {
		this.conteIdseq = conteIdseq;
	}
	public ContextTransferObject getContext() {
		return context;
	}
	public void setContext(ContextTransferObject context) {
		this.context = context;
	}
	
	  

}
