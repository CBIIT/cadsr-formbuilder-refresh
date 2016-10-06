package gov.nih.nci.cadsr.api.controller;

import java.io.IOException;
import java.io.StringReader;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBElement;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Unmarshaller;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.stream.XMLInputFactory;
import javax.xml.stream.XMLStreamException;
import javax.xml.stream.XMLStreamReader;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.oxm.XmlMappingException;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.xml.sax.SAXException;

import gov.nih.nci.cadsr.FormBuilderConstants;
import gov.nih.nci.cadsr.FormBuilderProperties;
import gov.nih.nci.cadsr.model.CartObjectNew;
import gov.nih.nci.cadsr.model.Field;
import gov.nih.nci.cadsr.model.FormV2NewWrapper;
import gov.nih.nci.cadsr.model.HttpQuery;
import gov.nih.nci.cadsr.model.Item;
import gov.nih.nci.cadsr.model.JaxbValidValue;
import gov.nih.nci.cadsr.model.BBContext;
import gov.nih.nci.cadsr.model.BBDataElement;
import gov.nih.nci.cadsr.model.BBFormMetaData;
import gov.nih.nci.cadsr.model.BBModule;
import gov.nih.nci.cadsr.model.BBProtocol;
import gov.nih.nci.cadsr.model.BBQuestion;
import gov.nih.nci.cadsr.model.BBValidValue;
import gov.nih.nci.cadsr.model.session.SessionCarts;

//import gov.nih.nci.cadsr.model.XMLConverter;

import gov.nih.nci.ncicb.cadsr.common.dto.FormTransferObject;
import gov.nih.nci.ncicb.cadsr.common.dto.ModuleTransferObject;
import gov.nih.nci.ncicb.cadsr.common.dto.QuestionTransferObject;
import gov.nih.nci.objectCart.client.ObjectCartClient;
import gov.nih.nci.objectCart.client.ObjectCartException;
import gov.nih.nci.objectCart.domain.Cart;
import gov.nih.nci.objectCart.domain.CartObject;

/**
 * 
 * @author trombadorera
 *
 *         The purpose of this class is to provide the FormBuilder frontend an
 *         API for interacting with the Object Cart API service and
 *         session-based lists of cart contents.
 */
@RestController
@RequestMapping(value = "/carts")
public class CartAdapterController {

	@Autowired
	private FormBuilderProperties props;

	@Autowired
	private SessionCarts carts;

	/*
	 * @Autowired private XMLConverter xmlConverter;
	 */

	@RequestMapping(value = "/moduleCart/{username}", method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity getModuleCart(@RequestParam(value = "username", required = true) String username) {

		return new ResponseEntity(carts.getModuleCart(), HttpStatus.OK);

	}

	@RequestMapping(value = "/cdecart/{username}", method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity getCDECart(@PathVariable String username) {

		return new ResponseEntity(carts.getCdeCart(), HttpStatus.OK);

	}

	@RequestMapping(value = "/formcart/{username}", method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity getFormCart(@RequestParam(value = "username", required = true) String username) {

		return new ResponseEntity(carts.getFormCart(), HttpStatus.OK);

	}

	@RequestMapping(value = "/objcart/cdecart/{username}", method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity loadCDECart(@PathVariable String username) throws XmlMappingException, IOException,
			SAXException, ParserConfigurationException, JAXBException, XMLStreamException {

		if (props.getFormBuilderLocalMode()) {
			return getDummyCdeCart("guest");
		}

		String ocURL = "http://objcart.nci.nih.gov/objcart10";

		String xmlURL = "GetXML";

		String cartName = "cdeCart";

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

		List<Item> items = new ArrayList<Item>();
		if (!cartContents.isEmpty()) {
			String date = null;
			for (CartObjectNew cartObj : cartContents) {
				Item item = null;
				for (Field field : cartObj.getFields()) {

					if (field.getName().equalsIgnoreCase("dateAdded")) {
						date = field.getValue();

					}

					if (field.getName().equalsIgnoreCase("Data")) {
						XMLInputFactory xif = XMLInputFactory.newInstance();
						XMLStreamReader xsr = xif.createXMLStreamReader(new StringReader(field.getValue()));
						xsr.nextTag(); // Advance to CDECartItemTransferObject
						xsr.nextTag(); // Advance to item tag
						JAXBContext jc = JAXBContext.newInstance(Item.class);
						Unmarshaller unmarshaller = jc.createUnmarshaller();
						JAXBElement<Item> je = unmarshaller.unmarshal(xsr, Item.class);
						item = je.getValue();

					}
				}
				item.setDateadded(date);
				items.add(item);
			}

		}

		List<BBQuestion> questions = new ArrayList<BBQuestion>();
		for (Item item : items) {
			BBQuestion question = new BBQuestion();
			BBDataElement element = new BBDataElement();
			BeanUtils.copyProperties(item, element);

			question.setDeIdseq(item.getIdSeq());
			question.setVersion(Float.valueOf(item.getVersion()));
			question.setPreferredQuestionText(item.getPreferredname());
			question.setMandatory(false);
			question.setEditable(true);
			question.setDeDerived(true);
			question.setLongName(item.getLongcdename());
			question.setDataType(item.getValueDomain().getDataType());
			question.setUnitOfMeasure(item.getValueDomain().getUnitOfMeasure());
			question.setDisplayFormat(item.getValueDomain().getDisplayFormat());
			question.setDataElement(element);
			
			if(item.getValueDomain() != null){
				for(JaxbValidValue jaxbvv : item.getValueDomain().getValidValues()){
					BBValidValue bbval = new BBValidValue();
					BeanUtils.copyProperties(jaxbvv, bbval);
					
					bbval.setFormValueMeaningText(jaxbvv.getShortMeaning());
					bbval.setFormValueMeaningIdVersion(jaxbvv.getShortMeaningValue());
					bbval.setFormValueMeaningDesc(jaxbvv.getDescription());
					bbval.setVmVersion(Float.valueOf(jaxbvv.getVmVersion()));
					bbval.setVpIdseq(jaxbvv.getVpIdseq());
	//				bbval.setValueIdseq(jaxbvv.get);
					
					question.getValidValues().add(bbval);
				}
			}
			
			questions.add(question);
		}

		return new ResponseEntity(questions, HttpStatus.OK);

	}

	@RequestMapping(value = "/objcart/formV2/{username}", method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity loadFormV2Cart(@PathVariable String username) throws XmlMappingException, IOException,
			SAXException, ParserConfigurationException, JAXBException, XMLStreamException {

		if (props.getFormBuilderLocalMode()) {
			return getDummyCdeCart("guest");
		}

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
		return new ResponseEntity(forms, HttpStatus.OK);
	}

	@RequestMapping(value = "/objcart/formcart/{username}", method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity loadFormCart(@RequestParam(value = "username", required = true) String username) {

		if (props.getFormBuilderLocalMode()) {
			return getDummyFormCart("guest");
		}

		return new ResponseEntity(carts.getFormCart(), HttpStatus.OK);

	}

	@RequestMapping(value = "/questions/{cdeid}", method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity<QuestionTransferObject> getQuestionFromCDE(
			@RequestParam(value = "cdeid", required = true) String cdeid) {

		return null;
	}

	@RequestMapping(value = "/modules", method = RequestMethod.POST)
	@ResponseBody
	public ResponseEntity saveToModuleCart(@RequestBody ModuleTransferObject module) {

		carts.getModuleCart().add(module);

		return null;
	}

	@RequestMapping(value = "/forms", method = RequestMethod.POST)
	@ResponseBody
	public ResponseEntity saveToFormCart(@RequestBody FormTransferObject form) {

		carts.getFormCart().add(form);

		return null;
	}

	@RequestMapping(value = "/forms/{username}/{formIdseq}", method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity saveFormToOC(@PathVariable String username, @PathVariable String formIdseq) {

		String uri = props.getFormServiceApiUrl() + FormBuilderConstants.FORMSERVICE_BASE_URL
				+ FormBuilderConstants.FORMSERVICE_FORMS + "/objcart" + "/" + username + "/" + formIdseq;

		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);

		RestTemplate restTemplate = new RestTemplate();
		ResponseEntity<Cart> response = restTemplate.getForEntity(uri, Cart.class);

		return response;

	}

	@RequestMapping(value = "/modules", method = RequestMethod.DELETE)
	@ResponseBody
	public ResponseEntity removeFromModuleCart(@RequestBody ModuleTransferObject module) {

		carts.getModuleCart().remove(module);

		return null;
	}

	@RequestMapping(value = "/forms", method = RequestMethod.DELETE)
	@ResponseBody
	public ResponseEntity removeFromFormCart(@RequestBody FormTransferObject form) {

		return null;
	}

	@RequestMapping(value = "/dummy/objcart/cdecart/{username}", method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity getDummyCdeCart(@PathVariable String username) {

		List<BBDataElement> dataElements = new ArrayList<BBDataElement>();

		for (int i = 0; i < 15; i++) {
			dataElements.add(createDummyCDE());
		}

		return new ResponseEntity(dataElements, HttpStatus.OK);
	}

	@RequestMapping(value = "/dummy/objcart/modulecart/{username}", method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity getDummyModuleCart(@PathVariable String username) {

		List<BBModule> modules = new ArrayList<BBModule>();

		for (int i = 0; i < 15; i++) {
			modules.add(createDummyModule(i));
		}

		return new ResponseEntity(modules, HttpStatus.OK);
	}

	@RequestMapping(value = "/dummy/objcart/formcart/{username}", method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity getDummyFormCart(@PathVariable String username) {

		List<BBFormMetaData> forms = new ArrayList<BBFormMetaData>();

		for (int i = 0; i < 15; i++) {
			forms.add(createDummyForm(i));
		}

		return new ResponseEntity(forms, HttpStatus.OK);
	}

	private BBDataElement createDummyCDE() {

		BBDataElement cde = new BBDataElement();
		cde.setDeIdseq("A56E8150-8EAC-1CC3-E034-080020C9C0E0");
		cde.setLongcdename("Time");
		cde.setLongname("Lab Collection Time");
		cde.setContextname("CCR");
		cde.setConteIdseq("A5599257-A08F-41D1-E034-080020C9C0E0");
		cde.setVersion("3");
		cde.setCDEId("2003580");
		cde.setRegistrationstatus("Standard");
		cde.setWorkflow("RELEASED");
		cde.setPreferredname("LAB_COLL_TM");
		cde.setPreferreddefinition("The time whe a sample for a lab test was collected.");
		cde.setPublicid("2003580");
		cde.setDateadded("06-28-2016");

		return cde;
	}

	private BBModule createDummyModule(int i) {

		BBModule mod = new BBModule();

		mod.setLongName("Test Module Long Name _ " + i);
		mod.setInstructions("These are Instructions");
		mod.setDispOrder(i);
		mod.setModuleIdseq("A123123-B234-C456-567567567");

		return mod;
	}

	private BBFormMetaData createDummyForm(int i) {

		BBFormMetaData form = new BBFormMetaData();

		form.setLongName("Test Form Long Name_ " + i);
		form.setWorkflow("Draft New");
		form.setPublicId(123456);
		form.setCreatedBy("Guest");
		form.setVersion(1F);

		BBContext c = new BBContext("123abc", "TEST", "testdesc");

		form.setContext(c);

		List<BBProtocol> prots = new ArrayList<BBProtocol>();
		BBProtocol p = new BBProtocol();
		p.setLongName("Test Protocol Long Name");
		prots.add(p);

		form.setProtocols(prots);

		return form;
	}

}
