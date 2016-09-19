package gov.nih.nci.cadsr.model;

import java.util.List;

public class BBModule {

	private String moduleIdseq;
	private String longName;
	private String instructions;
	private int repetitions;
	private int dispOrder;
	private List<BBQuestion> questions;
	private boolean isEdited = false;
	
	
	public String getModuleIdseq() {
		return moduleIdseq;
	}
	public void setModuleIdseq(String moduleIdseq) {
		this.moduleIdseq = moduleIdseq;
	}
	public String getLongName() {
		return longName;
	}
	public void setLongName(String longName) {
		this.longName = longName;
	}
	public String getInstructions() {
		return instructions;
	}
	public void setInstructions(String instructions) {
		this.instructions = instructions;
	}
	public int getRepetitions() {
		return repetitions;
	}
	public void setRepetitions(int repetitions) {
		this.repetitions = repetitions;
	}
	public int getDispOrder() {
		return dispOrder;
	}
	public void setDispOrder(int dispOrder) {
		this.dispOrder = dispOrder;
	}
	public List<BBQuestion> getQuestions() {
		return questions;
	}
	public void setQuestions(List<BBQuestion> questions) {
		this.questions = questions;
	}
	public boolean isEdited() {
		return isEdited;
	}
	public void setEdited(boolean isEdited) {
		this.isEdited = isEdited;
	}
	
}
