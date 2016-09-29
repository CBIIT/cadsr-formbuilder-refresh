package gov.nih.nci.cadsr.model;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement(name="CDECartItemTransferObject")
public class CartCDE{

	private Item item;
	
	private Long id;

	public Item getItem() {
		return item;
	}

	@XmlElement(name="item",namespace="http://www.w3.org/2001/XMLSchema-instance")
	public void setItem(Item item) {
		this.item = item;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}
	
	
}