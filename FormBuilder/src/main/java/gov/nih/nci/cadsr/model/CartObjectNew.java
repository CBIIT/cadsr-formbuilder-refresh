package gov.nih.nci.cadsr.model;

import java.util.List;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlValue;

@XmlRootElement(name = "class")
public class CartObjectNew {

	private List<Field> fields;
	

	// private CartCDE CDE; //Note, this will be mentioned later.

	public List<Field> getFields() {
		return fields;
	}

	@XmlElement(name = "field")
	public void setFields(List<Field> fields) {
		this.fields = fields;
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
