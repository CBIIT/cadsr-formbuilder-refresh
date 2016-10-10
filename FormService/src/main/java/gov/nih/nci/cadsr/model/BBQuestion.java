package gov.nih.nci.cadsr.model;

import java.util.List;

public class BBQuestion {
	
	private String quesIdseq;
	private List<BBValidValue> validValues;
	private int displayOrder;
	private String deIdseq;
//	private BBDataElement bbdataElement;
	private String instructions;
	private String defaultValue;
//	private List<BBQuestionRepetition> questionRepetitions;
	private boolean mandatory;
	private boolean editable;
	private boolean deDerived;
	private Float version;
	
	private String preferredQuestionText;
	private List<String> alternativeQuestionText;
	private String longName;
	private String dataType;
	private String unitOfMeasure;
	private String displayFormat;
	private String concepts;
	
	private boolean isEdited = false;
	private boolean isDeleted = false;
	
	
	
	public String getQuesIdseq() {
		return quesIdseq;
	}
	public void setQuesIdseq(String quesIdseq) {
		this.quesIdseq = quesIdseq;
	}
	public List<BBValidValue> getValidValues() {
		return validValues;
	}
	public void setValidValues(List<BBValidValue> validValues) {
		this.validValues = validValues;
	}
	public int getDisplayOrder() {
		return displayOrder;
	}
	public void setDisplayOrder(int displayOrder) {
		this.displayOrder = displayOrder;
	}
	public String getDeIdseq() {
		return deIdseq;
	}
	public void setDeIdseq(String deIdseq) {
		this.deIdseq = deIdseq;
	}
//	public BBDataElement getbbDataElement() {
//		return bbdataElement;
//	}
//	public void setbbDataElement(BBDataElement bbdataElement) {
//		this.bbdataElement = bbdataElement;
//	}
	public String getInstructions() {
		return instructions;
	}
	public void setInstructions(String instructions) {
		this.instructions = instructions;
	}
	public String getDefaultValue() {
		return defaultValue;
	}
	public void setDefaultValue(String defaultValue) {
		this.defaultValue = defaultValue;
	}
//	public List<BBQuestionRepetition> getQuestionRepetitions() {
//		return questionRepetitions;
//	}
//	public void setQuestionRepetitions(List<BBQuestionRepetition> questionRepetitions) {
//		this.questionRepetitions = questionRepetitions;
//	}
	public boolean isMandatory() {
		return mandatory;
	}
	public void setMandatory(boolean mandatory) {
		this.mandatory = mandatory;
	}
	public boolean isEditable() {
		return editable;
	}
	public void setEditable(boolean editable) {
		this.editable = editable;
	}
	public boolean isDeDerived() {
		return deDerived;
	}
	public void setDeDerived(boolean deDerived) {
		this.deDerived = deDerived;
	}
//	public BBDataElement getBbdataElement() {
//		return bbdataElement;
//	}
//	public void setBbdataElement(BBDataElement bbdataElement) {
//		this.bbdataElement = bbdataElement;
//	}
	public Float getVersion() {
		return version;
	}
	public void setVersion(Float version) {
		this.version = version;
	}
	public String getPreferredQuestionText() {
		return preferredQuestionText;
	}
	public void setPreferredQuestionText(String preferredQuestionText) {
		this.preferredQuestionText = preferredQuestionText;
	}
	public List<String> getAlternativeQuestionText() {
		return alternativeQuestionText;
	}
	public void setAlternativeQuestionText(List<String> alternativeQuestionText) {
		this.alternativeQuestionText = alternativeQuestionText;
	}
	public String getLongName() {
		return longName;
	}
	public void setLongName(String longName) {
		this.longName = longName;
	}
	public String getDataType() {
		return dataType;
	}
	public void setDataType(String dataType) {
		this.dataType = dataType;
	}
	public String getUnitOfMeasure() {
		return unitOfMeasure;
	}
	public void setUnitOfMeasure(String unitOfMeasure) {
		this.unitOfMeasure = unitOfMeasure;
	}
	public String getDisplayFormat() {
		return displayFormat;
	}
	public void setDisplayFormat(String displayFormat) {
		this.displayFormat = displayFormat;
	}
	public String getConcepts() {
		return concepts;
	}
	public void setConcepts(String concepts) {
		this.concepts = concepts;
	}
	public boolean isEdited() {
		return isEdited;
	}
	public void setEdited(boolean isEdited) {
		this.isEdited = isEdited;
	}
	public boolean isDeleted() {
		return isDeleted;
	}
	public void setDeleted(boolean isDeleted) {
		this.isDeleted = isDeleted;
	}

}
