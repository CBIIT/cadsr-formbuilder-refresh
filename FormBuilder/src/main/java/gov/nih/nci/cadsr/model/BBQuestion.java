package gov.nih.nci.cadsr.model;

import java.util.List;

public class BBQuestion {
	
	private String quesIdseq;
	private List<BBValidValue> validValues;
	private int order;
	private String deIdseq;
	private BBDataElement dataElement;
	private String instructions;
	private String defaultValue;
	private List<BBQuestionRepetition> questionRepetitions;
	private boolean mandatory;
	private boolean editable;
	private boolean deDerived;
	
	
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
	public int getOrder() {
		return order;
	}
	public void setOrder(int order) {
		this.order = order;
	}
	public String getDeIdseq() {
		return deIdseq;
	}
	public void setDeIdseq(String deIdseq) {
		this.deIdseq = deIdseq;
	}
	public BBDataElement getDataElement() {
		return dataElement;
	}
	public void setDataElement(BBDataElement dataElement) {
		this.dataElement = dataElement;
	}
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
	public List<BBQuestionRepetition> getQuestionRepetitions() {
		return questionRepetitions;
	}
	public void setQuestionRepetitions(List<BBQuestionRepetition> questionRepetitions) {
		this.questionRepetitions = questionRepetitions;
	}
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

}
