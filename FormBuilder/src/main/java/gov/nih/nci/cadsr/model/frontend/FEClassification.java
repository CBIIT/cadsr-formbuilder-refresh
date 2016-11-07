package gov.nih.nci.cadsr.model.frontend;

import java.io.Serializable;

public class FEClassification implements FEBaseObject,Serializable{
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 179432L;
	private String csCsiIdseq;
	private String classSchemeLongName;
	private String classSchemePrefName;
	
	
	public String getCsCsiIdseq() {
		return csCsiIdseq;
	}
	public void setCsCsiIdseq(String csCsiIdseq) {
		this.csCsiIdseq = csCsiIdseq;
	}
	public String getClassSchemeLongName() {
		return classSchemeLongName;
	}
	public void setClassSchemeLongName(String classSchemeLongName) {
		this.classSchemeLongName = classSchemeLongName;
	}
	public String getClassSchemePrefName() {
		return classSchemePrefName;
	}
	public void setClassSchemePrefName(String classSchemePrefName) {
		this.classSchemePrefName = classSchemePrefName;
	}

}
