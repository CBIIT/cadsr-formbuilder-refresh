package gov.nih.nci.cadsr.model.frontend;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

public class FEModule extends FECartItem implements FEBaseObject,Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = 13456L;
	private String moduleIdseq;
	private String longName;
	private String instructions;
	private int repetitions;
	private int dispOrder;
	private List<FEQuestion> questions;
	private int numQuestions;
	
	private FEFormMetaData form;
	
	private boolean isEdited = false;
	private boolean isDeleted = false;
	
	public FEModule(){
		moduleIdseq = "";
		longName = "";
		instructions = "";
		repetitions = 0;
		dispOrder = 0;
		questions = new ArrayList<FEQuestion>();
		isEdited = false;
	}
	
	
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
	public List<FEQuestion> getQuestions() {
		return questions;
	}
	public void setQuestions(List<FEQuestion> questions) {
		this.questions = questions;
	}
	public FEFormMetaData getForm() {
		return form;
	}


	public void setForm(FEFormMetaData form) {
		this.form = form;
	}


	public boolean getIsEdited() {
		return isEdited;
	}
	public void setEdited(boolean isEdited) {
		this.isEdited = isEdited;
	}


	public boolean getIsDeleted() {
		return isDeleted;
	}


	public void setDeleted(boolean isDeleted) {
		this.isDeleted = isDeleted;
	}


	public int getNumQuestions() {
		
		if(this.questions == null){
			return 0;
		}
		else{
			return this.questions.size();
		}
	}
	
	public void setNumQuestions(){
		if(this.questions == null){
			this.numQuestions = 0;
		}
		else{
			this.numQuestions = this.questions.size();
		}
	}
	
	@Override
	public boolean equals(Object obj){
		if (obj == null){
			return false;
		}
		if(!FEModule.class.isAssignableFrom(obj.getClass())){
			return false;
		}
		final FEModule other = (FEModule) obj;
		
		if(this.getModuleIdseq().equals(other.getModuleIdseq())){
			return true;
		}
		
		return false;
	}
	
}
