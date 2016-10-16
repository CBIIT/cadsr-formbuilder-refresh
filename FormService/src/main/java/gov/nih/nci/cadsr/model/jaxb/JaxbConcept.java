package gov.nih.nci.cadsr.model.jaxb;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement(name = "concept-derivation-rule")
public class JaxbConcept extends JaxbBaseObject {
	
	private String idseq;
	private String methods;
	private String name;
	private String type;
	private String rule;
	private String concatenationChar;
	
	
	public String getIdseq() {
		return idseq;
	}
	
	@XmlElement(name="idseq")
	public void setIdseq(String idseq) {
		this.idseq = idseq;
	}
	public String getMethods() {
		return methods;
	}
	@XmlElement(name="methods")
	public void setMethods(String methods) {
		this.methods = methods;
	}
	public String getName() {
		return name;
	}
	@XmlElement(name="name")
	public void setName(String name) {
		this.name = name;
	}
	public String getType() {
		return type;
	}
	@XmlElement(name="type")
	public void setType(String type) {
		this.type = type;
	}
	public String getRule() {
		return rule;
	}
	@XmlElement(name="rule")
	public void setRule(String rule) {
		this.rule = rule;
	}
	public String getConcatenationChar() {
		return concatenationChar;
	}
	@XmlElement(name="concatenation-char")
	public void setConcatenationChar(String concatenationChar) {
		this.concatenationChar = concatenationChar;
	}

}
