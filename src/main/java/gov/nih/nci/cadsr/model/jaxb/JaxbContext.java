package gov.nih.nci.cadsr.model.jaxb;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlValue;

@XmlRootElement(name = "context")
public class JaxbContext extends JaxbBaseObject{
	
	
	String conteIdseq;

	public String getConteIdseq() {
		return conteIdseq;
	}
	@XmlElement(name="conte-idseq")
	public void setConteIdseq(String conteIdseq) {
		this.conteIdseq = conteIdseq;
	}

	
}
