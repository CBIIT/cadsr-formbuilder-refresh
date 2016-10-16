package gov.nih.nci.cadsr.model.jaxb;

import java.util.ArrayList;
import java.util.List;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement(name = "value-domain")
public class JaxbValueDomain {
	
	private String vdIdseq;
	private String dataType;
	private String unitOfMeasure;
	private String displayFormat;
	private List<JaxbValidValue> validValues = new ArrayList<JaxbValidValue>();
	
	
	public String getVdIdseq() {
		return vdIdseq;
	}
	
	@XmlElement(name="vd-idseq")
	public void setVdIdseq(String vdIdseq) {
		this.vdIdseq = vdIdseq;
	}
	
	public String getDataType() {
		return dataType;
	}

	public void setDataType(String dataType) {
		this.dataType = dataType;
	}

	public String getUnitOfMeasure() {
		return unitOfMeasure;
	}

	public void setUnitOfMeasure(String unitOfMeasure) {
		this.unitOfMeasure = unitOfMeasure;
	}

	public String getDisplayFormat() {
		return displayFormat;
	}

	public void setDisplayFormat(String displayFormat) {
		this.displayFormat = displayFormat;
	}

	public List<JaxbValidValue> getValidValues() {
		return validValues;
	}
	
	@XmlElement(name="valid-values")
	public void setValidValues(List<JaxbValidValue> validValues) {
		this.validValues = validValues;
	}

}
