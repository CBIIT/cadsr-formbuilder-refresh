package gov.nih.nci.cadsr.model;



import java.util.List;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;


@XmlRootElement(name="queryResponse")
public class QueryResponse {

	
	int recordCounter;

	List<CartObjectNew> cartContents;

	public int getRecordCounter() {
		return recordCounter;
	}

	public void setRecordCounter(int recordCounter) {
		this.recordCounter = recordCounter;
	}

	public List<CartObjectNew> getCartContents() {
		return cartContents;
	}
	

	@XmlElement(name="class")
	public void setCartContents(List<CartObjectNew> cartContents) {
		this.cartContents = cartContents;
	}

}




