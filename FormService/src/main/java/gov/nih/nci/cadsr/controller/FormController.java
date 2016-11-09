package gov.nih.nci.cadsr.controller;

import java.io.File;
import java.io.IOException;
import java.io.StringReader;
import java.net.URL;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import javax.annotation.Resource;
import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBElement;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Unmarshaller;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.stream.XMLInputFactory;
import javax.xml.stream.XMLStreamException;
import javax.xml.stream.XMLStreamReader;

import org.apache.log4j.Logger;
import org.apache.struts.action.DynaActionForm;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.Cache.ValueWrapper;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.oxm.XmlMappingException;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.xml.sax.SAXException;

import com.fasterxml.jackson.core.JsonGenerationException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import gov.nih.nci.cadsr.FormServiceProperties;
import gov.nih.nci.cadsr.manager.FormManager;
import gov.nih.nci.cadsr.model.frontend.FEForm;
import gov.nih.nci.cadsr.model.frontend.FEFormMetaData;
import gov.nih.nci.ncicb.cadsr.common.dto.DataElementTransferObject;
import gov.nih.nci.ncicb.cadsr.common.dto.FormTransferObject;
import gov.nih.nci.ncicb.cadsr.common.dto.FormV2TransferObject;
import gov.nih.nci.ncicb.cadsr.common.dto.InstructionTransferObject;
import gov.nih.nci.ncicb.cadsr.common.dto.ModuleTransferObject;
import gov.nih.nci.ncicb.cadsr.common.dto.QuestionTransferObject;
import gov.nih.nci.ncicb.cadsr.common.dto.ReferenceDocumentTransferObject;
import gov.nih.nci.ncicb.cadsr.common.resource.FormV2;

import gov.nih.nci.ncicb.cadsr.common.resource.NCIUser;
import gov.nih.nci.ncicb.cadsr.formbuilder.ejb.impl.FormBuilderServiceImpl;
import gov.nih.nci.ncicb.cadsr.formbuilder.struts.common.FormConverterUtil;
import gov.nih.nci.objectCart.client.ObjectCartClient;
import gov.nih.nci.objectCart.client.ObjectCartException;
import gov.nih.nci.objectCart.domain.Cart;
import gov.nih.nci.objectCart.domain.CartObject;

@RestController
public class FormController {

	private static final Logger logger = Logger.getLogger(FormController.class);

	@Autowired
	private FormServiceProperties props;

	@Autowired
	private FormBuilderServiceImpl service;

	@Autowired
	private FormManager formManager;

//	@Resource(name = "cacheManager")
	@Autowired
	private CacheManager cacheManager;

	@RequestMapping(value = "/forms", method = RequestMethod.GET)
	@ResponseBody

	public ResponseEntity searchForm(@RequestParam(value = "formLongName", required = false) String formLongName,
			@RequestParam(value = "protocolIdSeq", required = false) String protocolIdSeq,
			@RequestParam(value = "contextIdSeq", required = false) String contextIdSeq,
			@RequestParam(value = "workflow", required = false) String workflow,
			@RequestParam(value = "categoryName", required = false) String categoryName,
			@RequestParam(value = "type", required = false) String type,
			@RequestParam(value = "classificationIdSeq", required = false) String classificationIdSeq,
			@RequestParam(value = "publicId", required = false) String publicId,
			@RequestParam(value = "version", required = false) String version,
			@RequestParam(value = "moduleLongName", required = false) String moduleLongName,
			@RequestParam(value = "cdePublicId", required = false) String cdePublicId,
			@RequestParam(value = "user", required = false) NCIUser user,
			@RequestParam(value = "contextRestriction", required = false) String contextRestriction)
			throws RuntimeException {

		long startTimer = System.currentTimeMillis();
		ResponseEntity<Collection> response = null;

		Collection FormList;

		FormList = formManager.getAllForms(formLongName, protocolIdSeq, contextIdSeq, workflow, categoryName, type,
				classificationIdSeq, publicId, version, moduleLongName, cdePublicId, user, contextRestriction);

		response = createSuccessResponse(FormList);
		logger.info(response.toString());
		long endTimer = System.currentTimeMillis();

		logger.info("----------EJB query took " + (endTimer - startTimer) + " ms.");
		logger.info("----------# of Form Results: " + FormList.size());

		return response;

	}

	@RequestMapping(value = "/forms/copy/{formIdSeq}", method = RequestMethod.POST, consumes = "application/json")
	@ResponseBody
	public ResponseEntity<String> copyForm(@PathVariable String formIdSeq) {

		FormTransferObject fullForm = formManager.getFullForm(formIdSeq);
		String id = formManager.copyForm(formIdSeq, fullForm);

		return new ResponseEntity(id, HttpStatus.OK);
	}

	@RequestMapping(value = { "/forms/{formIdSeq}" }, method = RequestMethod.PUT, consumes = "application/json")
	@CachePut(value = "products", key = "#form.formMetadata.formIdseq")
	public FEForm updateForm(@PathVariable String formIdSeq, @RequestBody FEForm form) {
		FEForm oldForm = new FEForm();

		try {

			oldForm = (FEForm)cacheManager.getCache("products").get(formIdSeq).get();
			System.out.println("OldForm Prots: " + oldForm.getFormMetadata().getProtocols());
			System.out.println("OldForm Prots size: " + oldForm.getFormMetadata().getProtocols().size());
			
			String response = formManager.updateForm(form, oldForm);

			return form;

		} catch (Exception e) {
			e.printStackTrace();
			return oldForm;
		}

	}

	@RequestMapping(value = "/forms", method = RequestMethod.POST, consumes = "application/json")
	@ResponseBody
	public ResponseEntity<FEFormMetaData> createForm(@RequestBody FEFormMetaData form) {

		InstructionTransferObject headerInstruction = new InstructionTransferObject();
		InstructionTransferObject footerInstruction = new InstructionTransferObject();

		// assemble a new form instruction for having form header.
		int dispOrder = 0;
		if (form.getHeaderInstructions() != null) {

			headerInstruction = formManager.buildHeaderInstructions(form);

		}
		if (form.getFooterInstructions() != null) {

			footerInstruction = formManager.buildFooterInstructions(form);
		}

		FEFormMetaData newForm = formManager.createFormComponent(form, headerInstruction, footerInstruction);

		ResponseEntity<FEFormMetaData> response = new ResponseEntity(newForm, HttpStatus.OK);

		return response;
	}

	@RequestMapping(value = { "/forms/{formIdSeq}" }, method = RequestMethod.GET)
	@Cacheable(value = "products", key = "#formIdSeq")
	public FEForm testTranslateDBFormToBBForm(@PathVariable String formIdSeq) {

		FormTransferObject fullForm = formManager.getFullFormV2(formIdSeq);

		return formManager.testTranslateDBFormToBBForm(fullForm);
	}

	@RequestMapping(value = { "/forms/db/{formIdSeq}/{modInd}/{quesInd}" }, method = RequestMethod.GET)
	public QuestionTransferObject getDBForm(@PathVariable String formIdSeq, @PathVariable String modInd,
			@PathVariable String quesInd) {

		List<ReferenceDocumentTransferObject> refdocs = new ArrayList<ReferenceDocumentTransferObject>();

		FormTransferObject fullForm = formManager.getFullForm(formIdSeq);

		// QuestionTransferObject qto = new QuestionTransferObject();
		// qto =
		// ((QuestionTransferObject)((ModuleTransferObject)fullForm.getModules().get(0)).getQuestions().get(0));

		// ReferenceDocumentTransferObject rdto = new
		// ReferenceDocumentTransferObject();
		// rdto =
		// ((ReferenceDocumentTransferObject)qto.getRefereceDocs().get(0));

		// List<ModuleTransferObject> modlist =
		// (List<ModuleTransferObject>)fullForm.getModules();

		return ((QuestionTransferObject) ((ModuleTransferObject) fullForm.getModules().get(Integer.valueOf(modInd)))
				.getQuestions().get(Integer.valueOf(quesInd)));

		// for(QuestionTransferObject qto : queslist){
		//// qto.setReferenceDocs((List<ReferenceDocumentTransferObject>)qto.getRefereceDocs());
		// if(qto.getRefereceDocs() != null){
		// refdocs.addAll((List<ReferenceDocumentTransferObject>)qto.getRefereceDocs());
		// }
		// }

		// for(ModuleTransferObject mod : modlist){
		// mod.setQuestions(queslist);
		// }

		// fullForm.setModules(modlist);
		// List<ReferenceDocumentTransferObject> reflist =
		// (List<ReferenceDocumentTransferObject>)qto.getRefereceDocs();

		// return queslist;

	}

	private ResponseEntity<Collection> createSuccessResponse(final Collection formList) {

		return new ResponseEntity<Collection>(formList, HttpStatus.OK);
	}

	/**
	 * 
	 * Performance Test Methods
	 * 
	 */

	/*
	 * @RequestMapping(value = "/forms/performancetest", method =
	 * RequestMethod.GET)
	 * 
	 * @ResponseBody public ResponseEntity<String> getFormsTest() {
	 * 
	 * Collection FormList; List<String> formids = new ArrayList<String>();
	 * StringBuilder sb = new StringBuilder();
	 * 
	 * FormList = formManager.getAllForms("*", null, null, null, null, null,
	 * null, null, null, null, null, null, null); for(Object form : FormList){
	 * FormTransferObject fto = (FormTransferObject)form;
	 * formids.add(fto.getFormIdseq()); }
	 * 
	 * for(String id : formids){
	 * sb.append(formManager.getFormPerformanceTest(id)); }
	 * 
	 * return new ResponseEntity(sb.toString(), HttpStatus.OK); }
	 */

	@RequestMapping(value = "/forms/performancetest/{formIdSeq}", method = RequestMethod.GET)
	@ResponseBody

	public ResponseEntity<String> getFormTest(@PathVariable String formIdSeq) {
		// long startTimer = System.currentTimeMillis();

		String testResult = formManager.getFormPerformanceTest(formIdSeq);

		// long endTimer = System.currentTimeMillis();
		// String transportTime = "" + (endTimer - startTimer);
		//
		// StringBuilder sb = new StringBuilder(testResult);
		//
		// sb.append("Time(ms) for full transport to front-end: " +
		// transportTime);
		// sb.append("-----------------------------END-------------------------------\n\n");
		//
		// logger.info(sb.toString());
		return new ResponseEntity(testResult, HttpStatus.OK);
	}

	/*
	 * private ResponseEntity<FormWrapper> createSuccessFormResponse(final
	 * FormWrapper formList) {
	 * 
	 * return new ResponseEntity<FormWrapper>(formList, HttpStatus.OK); }
	 */
	@RequestMapping(value = "/forms/objcart/{username}/{formIdSeq}", method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity<Cart> saveFormToOC(@PathVariable String username, @PathVariable String formIdSeq)
			throws ObjectCartException {

		ObjectCartClient cartClient = new ObjectCartClient();

		String str = formIdSeq;
		String[] id = str.split(",");

		Cart cart = cartClient.createCart(username, "formCartV2");

		// TODO:Get the FormV2 version of a Form and translate it to a
		// CartObject that can be saved.
		CartObject cObject = new CartObject();
		for (String i : id) {
			FormV2 formV2 = formManager.getFullFormV2(i);
			try {

				cObject = translateCartObject(formV2);
				cartClient.storeObject(cart, cObject);

			} catch (Exception e1) {
				e1.printStackTrace();
				return new ResponseEntity(e1.getMessage(), HttpStatus.BAD_REQUEST);
			}
		}

		ResponseEntity<Cart> response = new ResponseEntity(cart, HttpStatus.OK);
		return response;
	}

	@RequestMapping(value = "/forms/deleteFormv2/{username}/{formIdSeq}", method = RequestMethod.DELETE)
	@ResponseBody
	public ResponseEntity<Cart> DeletFormFromOC(@PathVariable String username, @PathVariable String formIdSeq)
			throws ObjectCartException {

		ObjectCartClient cartClient = new ObjectCartClient();
		String str = formIdSeq;
		String[] id = str.split(",");
		Cart cart = cartClient.retrieveCart(username, "formCartV2");
		Collection<CartObject> cObject = cart.getCartObjectCollection();
		for (String i : id) {
			try {

				for (CartObject co : cObject) {
					if(co.getNativeId().equals(i)){
						cartClient.removeObject(cart, co);
					}
				}
			} catch (Exception e1) {
				return new ResponseEntity(e1.getMessage(), HttpStatus.BAD_REQUEST);
			}
		}
		ResponseEntity<Cart> response = new ResponseEntity(cart, HttpStatus.OK);
		return response;

	}

	@RequestMapping(value = "/forms/deleteCde/{username}/{formIdSeq}", method = RequestMethod.DELETE)
	@ResponseBody
	public ResponseEntity<Cart> DeletCdeFromOC(@PathVariable String username, @PathVariable String cdeId)
			throws ObjectCartException {

		ObjectCartClient cartClient = new ObjectCartClient();
		String str = cdeId;
		String[] id = str.split(",");
		Cart cart = cartClient.retrieveCart(username, "cdeCart");
		Collection<CartObject> cObject = cart.getCartObjectCollection();
		for (String i : id) {
			try {

				for (CartObject co : cObject) {
					cartClient.removeObject(cart, co);
				}
			} catch (Exception e1) {
				e1.printStackTrace();
				return new ResponseEntity(e1.getMessage(), HttpStatus.BAD_REQUEST);
			}
		}
		ResponseEntity<Cart> response = new ResponseEntity(cart, HttpStatus.OK);
		return response;

	}

	@RequestMapping(value = "/objcart/cdecart/{username}", method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity loadCDECart(@PathVariable String username) throws ObjectCartException {

		List<DataElementTransferObject> elements = new ArrayList<DataElementTransferObject>();

		ObjectCartClient cartClient = new ObjectCartClient();
		Cart cart = cartClient.retrieveCart(username, "cdeCart");

		Collection coll = cartClient.getPOJOCollection(DataElementTransferObject.class, cart.getCartObjectCollection());

		for (Object obj : coll) {
			DataElementTransferObject element = (DataElementTransferObject) obj;

			elements.add(element);

			// element.getCDEId();
			// element.getVersion();
			// element.getPreferredName();
			// element.getLongName();
			// element.getValueDomain().getDatatype();
			// element.getValueDomain().getUnitOfMeasure();
			// element.getValueDomain().getDisplayFormat();
			// element.getDataElementConcept()

		}

		return new ResponseEntity(elements, HttpStatus.OK);
	}

	@RequestMapping(value = "/objcart/formcart/{username}", method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity loadFormCart(@PathVariable String username) throws ObjectCartException {

		List<FormV2TransferObject> forms = new ArrayList<FormV2TransferObject>();

		ObjectCartClient cartClient = new ObjectCartClient();
		Cart cart = cartClient.retrieveCart(username, "formCartV2");

		Collection coll = cartClient.getPOJOCollection(FormV2TransferObject.class, cart.getCartObjectCollection());

		for (Object obj : coll) {
			FormV2TransferObject form = (FormV2TransferObject) obj;

			forms.add(form);
		}

		return new ResponseEntity(forms, HttpStatus.OK);
	}

	public ResponseEntity<String> getFormTest1(@PathVariable String formIdSeq) {
		// long startTimer = System.currentTimeMillis();

		String testResult = formManager.getFormPerformanceTest(formIdSeq);

		// long endTimer = System.currentTimeMillis();
		// String transportTime = "" + (endTimer - startTimer);
		//
		// StringBuilder sb = new StringBuilder(testResult);
		//
		// sb.append("Time(ms) for full transport to front-end: " +
		// transportTime);
		// sb.append("-----------------------------END-------------------------------\n\n");
		//
		// logger.info(sb.toString());
		return new ResponseEntity(testResult, HttpStatus.OK);

	}

	private CartObject translateCartObject(FormV2 crf) throws Exception {
		CartObject ob = new CartObject();
		ob.setType(FormConverterUtil.instance().getCartObjectType());
		ob.setDisplayText(Integer.toString(crf.getPublicId()) + "v" + Float.toString(crf.getVersion()));
		ob.setNativeId(crf.getFormIdseq());

		String convertedForm = FormConverterUtil.instance().convertFormToV2(crf);
		ob.setData(convertedForm);
		return ob;
	}

	@RequestMapping(value = { "/forms/{formIdSeq}" }, method = RequestMethod.DELETE)
	public ResponseEntity deleteForm(@PathVariable String formIdSeq) {
		int response = formManager.deleteForm(formIdSeq);

		return new ResponseEntity(response, HttpStatus.OK);
	}

	/*
	 * private ResponseEntity<FormWrapper> createSuccessFormResponse(final
	 * FormWrapper formList) {
	 * 
	 * return new ResponseEntity<FormWrapper>(formList, HttpStatus.OK); }
	 */

}
