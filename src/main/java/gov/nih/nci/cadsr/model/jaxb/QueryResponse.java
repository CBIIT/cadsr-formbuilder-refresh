package gov.nih.nci.cadsr.model.jaxb;



import java.util.List;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;


@XmlRootElement(name="queryResponse")
public class QueryResponse extends JaxbBaseObject{

	
	int recordCounter;

	List<JaxbCartObject> cartContents;

	public int getRecordCounter() {
		return recordCounter;
	}

	public void setRecordCounter(int recordCounter) {
		this.recordCounter = recordCounter;
	}

	public List<JaxbCartObject> getCartContents() {
		return cartContents;
	}
	

	@XmlElement(name="class")
	public void setCartContents(List<JaxbCartObject> cartContents) {
		this.cartContents = cartContents;
	}

}




