package gov.nih.nci.cadsr.model.jaxb;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement(name = "protocol")
public class JaxbProtocol extends JaxbBaseObject{

	private String longName;
	private String protocolID;

	public String getLongName() {
		return longName;
	}

	@XmlElement(name = "longName")
	public void setLongName(String longName) {
		this.longName = longName;
	}

	public String getProtocolID() {
		return protocolID;
	}

	@XmlElement(name = "protocolID")
	public void setProtocolID(String protocolID) {
		this.protocolID = protocolID;
	}

}
