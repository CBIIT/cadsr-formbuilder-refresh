package gov.nih.nci.cadsr.model.frontend;

public class FEProtocol implements FEBaseObject{
	
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
