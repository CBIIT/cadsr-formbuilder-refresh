package gov.nih.nci.cadsr.Manger;

import java.io.StringReader;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBElement;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Unmarshaller;
import javax.xml.stream.XMLInputFactory;
import javax.xml.stream.XMLStreamException;
import javax.xml.stream.XMLStreamReader;

import org.springframework.stereotype.Service;

import gov.nih.nci.cadsr.model.jaxb.CartObjectNew;
import gov.nih.nci.cadsr.model.jaxb.Field;
import gov.nih.nci.cadsr.model.jaxb.FormV2NewWrapper;
import gov.nih.nci.cadsr.model.jaxb.HttpQuery;


@Service
public class CartAdapterManger {
	public List<FormV2NewWrapper> loadFormV2Cart(String username) throws JAXBException, MalformedURLException, XMLStreamException{
		

		String ocURL = "http://objcart2-dev.nci.nih.gov/objcart103";

		String xmlURL = "GetXML";

		String cartName = "formCartV2";

		String uri = ocURL + "/" + xmlURL + "?" + "query=CartObject&Cart[@name=" + cartName + "][@userId=" + username
				+ "]&roleName=cartObjectCollection";

		/**
		 * This model should directly translate to the xml "data" field in the
		 * xml response. Converting from the xml "data" fields in the response
		 * should produce a list of CDECartItemTransferObject
		 */

		JAXBContext jaxbContext = JAXBContext.newInstance(HttpQuery.class);
		URL url = new URL(uri);
		Unmarshaller jaxbUnmarshaller = jaxbContext.createUnmarshaller();
		HttpQuery query = (HttpQuery) jaxbUnmarshaller.unmarshal(url);

		List<CartObjectNew> cartContents = query.getQueryResponse().getCartContents();

		List<FormV2NewWrapper> forms = new ArrayList<FormV2NewWrapper>();
		
		if (!cartContents.isEmpty()) {
			String date = null;
			for (CartObjectNew cartObj : cartContents) {
				FormV2NewWrapper form = null;
				for (Field field : cartObj.getFields()) {

					if (field.getName().equalsIgnoreCase("dateAdded")) {
						date = field.getValue();

					}

					if (field.getName().equalsIgnoreCase("Data")) {
						XMLInputFactory xif = XMLInputFactory.newInstance();
						XMLStreamReader xsr = xif.createXMLStreamReader(new StringReader(field.getValue()));
						JAXBContext jc = JAXBContext.newInstance(FormV2NewWrapper.class);
						Unmarshaller unmarshaller = jc.createUnmarshaller();
						JAXBElement<FormV2NewWrapper> je = unmarshaller.unmarshal(xsr, FormV2NewWrapper.class);
						form = je.getValue();

					}
				}
				form.setDateadded(date);
				forms.add(form);
			}

		}
		return forms;
	}
		
	}
	
	


