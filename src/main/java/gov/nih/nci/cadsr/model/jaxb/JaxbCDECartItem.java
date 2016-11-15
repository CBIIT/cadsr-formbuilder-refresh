package gov.nih.nci.cadsr.model.jaxb;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement(name="CDECartItemTransferObject")
public class JaxbCDECartItem extends JaxbBaseObject{

	private JaxbDataElement item;
	
	private Long id;

	public JaxbDataElement getItem() {
		return item;
	}

	@XmlElement(name="item",namespace="http://www.w3.org/2001/XMLSchema-instance")
	public void setItem(JaxbDataElement item) {
		this.item = item;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}
	
	
}