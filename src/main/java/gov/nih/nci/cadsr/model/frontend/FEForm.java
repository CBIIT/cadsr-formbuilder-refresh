package gov.nih.nci.cadsr.model.frontend;

import java.util.List;

public class FEForm implements FEBaseObject{
	
	private FEFormMetaData formMetadata;
	private List<FEModule> formModules;
	
	
	public FEFormMetaData getFormMetadata() {
		return formMetadata;
	}
	public void setFormMetadata(FEFormMetaData formMetadata) {
		this.formMetadata = formMetadata;
	}
	public List<FEModule> getFormModules() {
		return formModules;
	}
	public void setFormModules(List<FEModule> formModules) {
		this.formModules = formModules;
	}
	

}
