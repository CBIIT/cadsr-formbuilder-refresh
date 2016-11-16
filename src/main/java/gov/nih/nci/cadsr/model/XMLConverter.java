/*package gov.nih.nci.cadsr.model;

import java.io.FileInputStream;
import java.io.IOException;

import javax.xml.transform.stream.StreamSource;

import org.springframework.oxm.Marshaller;
import org.springframework.oxm.Unmarshaller;

public class XMLConverter {

	  private Marshaller marshaller;
	  private Unmarshaller unmarshaller;
	public Marshaller getMarshaller() {
		return marshaller;
	}
	public void setMarshaller(Marshaller marshaller) {
		this.marshaller = marshaller;
	}
	public Unmarshaller getUnmarshaller() {
		return unmarshaller;
	}
	public void setUnmarshaller(Unmarshaller unmarshaller) {
		this.unmarshaller = unmarshaller;
	}


		  public Object convertFromXMLToObject(String xmlfile) throws IOException {

		    FileInputStream is = null;
		    try {
		      is = new FileInputStream(xmlfile);
		      return getUnmarshaller().unmarshal(new StreamSource(is));
		    } finally {
		      if (is != null) {
		        is.close();
		      }
		    }
		  }
	  

}
*/