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
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.oxm.XmlMappingException;
import org.springframework.security.core.context.SecurityContextHolder;
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
import gov.nih.nci.cadsr.authentication.CadsrUserDetails;
import gov.nih.nci.cadsr.model.frontend.FEContext;
import gov.nih.nci.cadsr.model.frontend.FEDataElement;
import gov.nih.nci.cadsr.model.frontend.FEFormMetaData;
import gov.nih.nci.cadsr.model.frontend.FEModule;
import gov.nih.nci.cadsr.model.frontend.FEProtocol;
import gov.nih.nci.cadsr.model.frontend.FEQuestion;
import gov.nih.nci.cadsr.model.frontend.FEValidValue;
import gov.nih.nci.cadsr.model.jaxb.CartObjectNew;
import gov.nih.nci.cadsr.model.jaxb.Field;
import gov.nih.nci.cadsr.model.jaxb.FormV2NewWrapper;
import gov.nih.nci.cadsr.model.jaxb.HttpQuery;
import gov.nih.nci.cadsr.model.jaxb.Item;
import gov.nih.nci.cadsr.model.jaxb.JaxbValidValue;

//import gov.nih.nci.cadsr.model.XMLConverter;

import gov.nih.nci.ncicb.cadsr.common.dto.FormTransferObject;
//import gov.nih.nci.ncicb.cadsr.formbuilder.ejb.impl.ReferenceDocument;
//import gov.nih.nci.ncicb.cadsr.formbuilder.ejb.impl.ReferenceDocumentDAO;
import gov.nih.nci.objectCart.domain.Cart;

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

	@RequestMapping(value = "/modulecart", method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity getModuleCart() {
		
		try{
			
		return new ResponseEntity(this.getUserDetails().getModuleCart(), HttpStatus.OK);
		
		} catch(NullPointerException npe){
			return new ResponseEntity("No authenticated user could be found. Unable to return module cart.",HttpStatus.NOT_FOUND);
		}

	}

	@RequestMapping(value = "/cdecart", method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity getCDECart(@RequestParam(value = "username", required = false) String username, @RequestParam(value = "cache", required = false) boolean cache) throws XmlMappingException, IOException, SAXException, ParserConfigurationException, JAXBException, XMLStreamException {

		if(username == null){
			username = this.getUserName();
		}
		
		if(cache){
			try{
				
				return new ResponseEntity(this.getUserDetails().getCdeCart(), HttpStatus.OK);
				
			} catch(NullPointerException npe){
				return new ResponseEntity("No authenticated user could be found. Unable to return CDE cart.",HttpStatus.NOT_FOUND);
			}
		}
		else{
			return this.loadCDECart(username);
		}
		
	}

	@RequestMapping(value = "/formcart", method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity getFormCart(@RequestParam(value = "username", required = false) String username, @RequestParam(value = "cache", required = false) boolean cache) throws XmlMappingException, IOException, SAXException, ParserConfigurationException, JAXBException, XMLStreamException {

		if(username == null){
			username = this.getUserName();
		}
		
		if(cache){
			try{
				
				return new ResponseEntity(this.getUserDetails().getFormCart(), HttpStatus.OK);
				
			}catch(NullPointerException npe){
				return new ResponseEntity("No authenticated user could be found. Unable to return form cart.",HttpStatus.NOT_FOUND);
			}
		}
		else{
			return this.loadFormV2Cart(username);
		}

	}

	private ResponseEntity loadCDECart(String username) throws XmlMappingException, IOException,
			SAXException, ParserConfigurationException, JAXBException, XMLStreamException {

		if (props.getFormBuilderLocalMode()) {
			return getDummyCdeCart("guest");
		}

		String ocURL = props.getObjectCartUrl();

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
		
		List<CartObjectNew> cartContents = new ArrayList<CartObjectNew>();

		try{
			
			cartContents = query.getQueryResponse().getCartContents();
			
		} catch(NullPointerException npe){
			return new ResponseEntity(new ArrayList<FEQuestion>(),HttpStatus.OK);
		}

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

		List<FEQuestion> questions = new ArrayList<FEQuestion>();
		for (Item item : items) {
			FEQuestion question = new FEQuestion();
			FEDataElement element = new FEDataElement();
			BeanUtils.copyProperties(item, element);

			question.setDeIdseq(item.getIdSeq());
			question.setVersion(Float.valueOf(item.getVersion()));
//			question.setPreferredQuestionText(item.getLongcdename());
			question.setValueDomainLongName(item.getLongcdename());
			question.setLongName(item.getLongname());
			question.setMandatory(false);
			question.setEditable(true);
			question.setDeDerived(true);
			question.setDataType(item.getValueDomain().getDataType());
			question.setUnitOfMeasure(item.getValueDomain().getUnitOfMeasure());
			question.setDisplayFormat(item.getValueDomain().getDisplayFormat());
			question.setDataElement(element);
			
			if(item.getValueDomain() != null){
				for(JaxbValidValue jaxbvv : item.getValueDomain().getValidValues()){
					FEValidValue bbval = new FEValidValue();
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

		try{
			this.getUserDetails().setCdeCart(questions);
		} catch(Exception e){
			e.printStackTrace();
		}
		return new ResponseEntity(questions, HttpStatus.OK);

	}

	private ResponseEntity loadFormV2Cart(String username) throws XmlMappingException, IOException,
			SAXException, ParserConfigurationException, JAXBException, XMLStreamException {

		if (props.getFormBuilderLocalMode()) {
			return getDummyCdeCart("guest");
		}

		String ocURL = props.getObjectCartUrl();

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

		List<CartObjectNew> cartContents = new ArrayList<CartObjectNew>();

		try{
			
			cartContents = query.getQueryResponse().getCartContents();
			
		} catch(NullPointerException npe){
			return new ResponseEntity(new ArrayList<FEFormMetaData>(),HttpStatus.OK);
		}

		List<FormV2NewWrapper> forms = new ArrayList<FormV2NewWrapper>();
		List<FEFormMetaData> feForms = new ArrayList<FEFormMetaData>();
		if (!cartContents.isEmpty()) {
			String date = null;
			String idseq = null;
			for (CartObjectNew cartObj : cartContents) {
				FormV2NewWrapper form = null;
				for (Field field : cartObj.getFields()) {

					if (field.getName().equalsIgnoreCase("dateAdded")) {
						date = field.getValue();

					}
					else if (field.getName().equalsIgnoreCase("nativeid")){
						idseq = field.getValue();
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
				
				FEFormMetaData feForm = new FEFormMetaData();
				BeanUtils.copyProperties(form, feForm);
				
				feForm.setFormIdseq(idseq);
				feForm.setWorkflow(form.getWorkflowStatusName());
				FEContext context = new FEContext();
				context.setName(form.getContext());
				feForm.setContext(context);
				feForm.setPersisted(true);
				feForms.add(feForm);
			}

		}
		
		try{
			this.getUserDetails().setFormCart(feForms);
		} catch(Exception e){
			e.printStackTrace();
		}
		
		return new ResponseEntity(feForms, HttpStatus.OK);
	}

	@RequestMapping(value = "/objcart/formcart/{username}", method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity loadFormCart(@RequestParam(value = "username", required = true) String username) {

		if (props.getFormBuilderLocalMode()) {
			return getDummyFormCart("guest");
		}

		return new ResponseEntity(this.getUserDetails().getFormCart(), HttpStatus.OK);

	}

	@RequestMapping(value = "/modules", method = RequestMethod.POST)
	@ResponseBody
	public ResponseEntity saveToModuleCart(@RequestBody FEModule module) {

		this.getUserDetails().getModuleCart().add(module);

		return null;
	}

	@RequestMapping(value = "/forms", method = RequestMethod.POST)
	@ResponseBody
	public ResponseEntity saveToFormCart(@RequestBody FEFormMetaData form) {

		this.getUserDetails().getFormCart().add(form);

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
	public ResponseEntity removeFromModuleCart(@RequestBody FEModule module) {

		this.getUserDetails().getModuleCart().remove(module);

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

		List<FEDataElement> dataElements = new ArrayList<FEDataElement>();

		for (int i = 0; i < 15; i++) {
			dataElements.add(createDummyCDE());
		}

		return new ResponseEntity(dataElements, HttpStatus.OK);
	}

	@RequestMapping(value = "/dummy/objcart/modulecart/{username}", method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity getDummyModuleCart(@PathVariable String username) {

		List<FEModule> modules = new ArrayList<FEModule>();

		for (int i = 0; i < 15; i++) {
			modules.add(createDummyModule(i));
		}

		return new ResponseEntity(modules, HttpStatus.OK);
	}

	@RequestMapping(value = "/dummy/objcart/formcart/{username}", method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity getDummyFormCart(@PathVariable String username) {

		List<FEFormMetaData> forms = new ArrayList<FEFormMetaData>();

		for (int i = 0; i < 15; i++) {
			forms.add(createDummyForm(i));
		}

		return new ResponseEntity(forms, HttpStatus.OK);
	}

	private FEDataElement createDummyCDE() {

		FEDataElement cde = new FEDataElement();
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

	private FEModule createDummyModule(int i) {

		FEModule mod = new FEModule();
		FEFormMetaData form = new FEFormMetaData();

		mod.setLongName("Test Module Long Name _ " + i);
		mod.setInstructions("These are Instructions");
		mod.setDispOrder(i);
		mod.setModuleIdseq("A123123-B234-C456-567567567");
		
		List<FEQuestion> questions = new ArrayList<FEQuestion>();
		for(int j=0; j<3; j++){
			questions.add(new FEQuestion());
		}
		
		mod.setQuestions(questions);
		
		form.setLongName("ParentFormLongName_" + i);
		form.setPublicId(12345 + i);
		form.setVersion(1F);
		
		mod.setForm(form);

		return mod;
	}

	private FEFormMetaData createDummyForm(int i) {

		FEFormMetaData form = new FEFormMetaData();

		form.setLongName("Test Form Long Name_ " + i);
		form.setWorkflow("Draft New");
		form.setPublicId(123456);
		form.setCreatedBy("Guest 9/10/2011");
		form.setVersion(1F);

		FEContext c = new FEContext("123abc", "TEST", "testdesc");

		form.setContext(c);

		List<FEProtocol> prots = new ArrayList<FEProtocol>();
		FEProtocol p = new FEProtocol();
		p.setLongName("Test Protocol Long Name");
		prots.add(p);

		form.setProtocols(prots);

		return form;
	}
	
	private CadsrUserDetails getUserDetails(){
		CadsrUserDetails userDetails =
				 (CadsrUserDetails)SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		
		return userDetails;
	}
	
	private String getUserName(){
		return SecurityContextHolder.getContext().getAuthentication().getName();
	}
	
	/*private List<ReferenceDocument> getReferenceDocuments(String acIdseq)
    {
        ReferenceDocumentDAO myDAO = (ReferenceDocumentDAO)daoFactory.getReferenceDocumentDAO();
        List refDocs = myDAO.getAllReferenceDocuments(acIdseq, 
                        null);
        return refDocs;        
    }*/

}
