package gov.nih.nci.cadsr.model.frontend;

import java.io.Serializable;

public class FEProtocol implements FEBaseObject,Serializable{
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 123456789L;
	private String protoIdseq;
	private String longName;
	
	
	public String getProtoIdseq() {
		return protoIdseq;
	}
	public void setProtoIdseq(String protoIdseq) {
		this.protoIdseq = protoIdseq;
	}
	public String getLongName() {
		return longName;
	}
	public void setLongName(String longName) {
		this.longName = longName;
	}

}
