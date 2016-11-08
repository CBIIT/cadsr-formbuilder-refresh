package gov.nih.nci.cadsr.model.jaxb;

import java.util.List;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlValue;

@XmlRootElement(name = "class")
public class JaxbCartObject extends JaxbBaseObject{

	private List<JaxbField> jaxbFields;
	

	// private CartCDE CDE; //Note, this will be mentioned later.

	public List<JaxbField> getFields() {
		return jaxbFields;
	}

	@XmlElement(name = "field")
	public void setFields(List<JaxbField> jaxbFields) {
		this.jaxbFields = jaxbFields;
	}
	/*
	 * public List<Item> getItems() { return items; } public void
	 * setItems(List<Item> items) { this.items = items; }
	 */

	/*
	 * public CartCDE getCDE() { return CDE; }
	 * 
	 * public void setCDE(CartCDE cDE) { CDE = cDE; }
	 */

}
