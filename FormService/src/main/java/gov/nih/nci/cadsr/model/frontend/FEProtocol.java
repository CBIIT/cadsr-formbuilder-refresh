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
	
	@Override
	public boolean equals(Object obj){
		if (obj == null){
			return false;
		}
		if(!FEProtocol.class.isAssignableFrom(obj.getClass())){
			return false;
		}
		final FEProtocol other = (FEProtocol) obj;
		
		if(this.getProtoIdseq().equals(other.getProtoIdseq())){
			return true;
		}
		
		return false;
	}

}
