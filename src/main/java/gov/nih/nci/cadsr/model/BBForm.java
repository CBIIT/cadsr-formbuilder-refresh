package gov.nih.nci.cadsr.model;

import java.util.List;

public class BBForm {
	
	private BBFormMetaData formMetadata;
	private List<BBModule> formModules;
	
	
	public BBFormMetaData getFormMetadata() {
		return formMetadata;
	}
	public void setFormMetadata(BBFormMetaData formMetadata) {
		this.formMetadata = formMetadata;
	}
	public List<BBModule> getFormModules() {
		return formModules;
	}
	public void setFormModules(List<BBModule> formModules) {
		this.formModules = formModules;
	}
	

}
