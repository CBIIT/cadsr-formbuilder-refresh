package gov.nih.nci.ncicb.cadsr.formbuilder.struts.actions.cadsrutil_ext;

// This class extends the previous objectCart code from cadsrutil and provides additional functionality needed for V2 forms
// Since getForms was only used for display, an alternate mechanism providing display objects for V2 forms is provided 
// Caching is provided for the display objects so repeated calls are more efficient
// Note: There is no automatic mechanism for ensuring the cache is in sync with the forms.
// setFormDisplayObjects should be explicitly called before displaying the cart.

import gov.nih.nci.ncicb.cadsr.common.dto.FormV2TransferObject;
import gov.nih.nci.ncicb.cadsr.objectCart.CDECart;
import gov.nih.nci.objectCart.client.ObjectCartClient;
import gov.nih.nci.objectCart.client.ObjectCartException;
import gov.nih.nci.objectCart.domain.CartObject;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import gov.nih.nci.ncicb.cadsr.common.resource.FormV2;
import gov.nih.nci.ncicb.cadsr.common.util.logging.Log;
import gov.nih.nci.ncicb.cadsr.common.util.logging.LogFactory;

import org.exolab.castor.xml.Unmarshaller;
import org.exolab.castor.xml.MarshalException;
import org.exolab.castor.xml.ValidationException;

import javax.xml.transform.*;
import javax.xml.transform.stream.*;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.StringReader;

import gov.nih.nci.ncicb.cadsr.formbuilder.struts.common.FormCartDisplayObjectPersisted;
import gov.nih.nci.ncicb.cadsr.formbuilder.struts.common.FormConverterUtil;
import gov.nih.nci.ncicb.cadsr.formbuilder.common.FormBuilderException;
import gov.nih.nci.ncicb.cadsr.formbuilder.common.FormCartOptionsUtil;
import gov.nih.nci.ncicb.cadsr.formbuilder.ejb.service.FormBuilderService;
import gov.nih.nci.ncicb.cadsr.formbuilder.struts.common.FormCartDisplayObject;

public class CDECartOCImplExtension extends gov.nih.nci.ncicb.cadsr.objectCart.impl.CDECartOCImpl implements CDECart, Serializable  {

	private static Log log = LogFactory.getLog(CDECartOCImplExtension.class.getName());

	public static final String transformToConvertCartToDisplayObject = "/transforms/ConvertFormCartV2ToDisplayObject.xsl";
	public static final String formNotInDatabaseLongNamePrefix = "NOT IN DATABASE: "; 
	
	protected FormBuilderService formBuilderService;
	protected Collection formDisplayObjects;
	
	// This holds V2 forms temporarily until the user is ready to
	// save the forms. Once the user is ready to save the contents
	// in this cart will be added to the contents of the oCart. - Sula
	private Map formCartV2;
	
	public CDECartOCImplExtension(ObjectCartClient client, String uid, String cName, FormBuilderService formBuilderService) {
		super(client, uid, cName);
		//formBuilderService = formBuilderServiceDelegate;
		formCartV2 = new HashMap();
	}

	
	public void setFormDisplayObjects() {
		log.debug("setFormDisplayObjects");
		log.debug("cartClient " + cartClient + " oCart " + oCart);
		log.debug("cart id " + oCart.getId());
		try {
			Collection<CartObject> newFormCartElements = cartClient.getObjectsByType(oCart, FormConverterUtil.instance().getCartObjectType());
			log.debug("newFormCartElements has " + newFormCartElements.size() + " elements");
			
			log.debug("Form Cart has " + formCartV2.size() + " new elements");

			List itemList = new ArrayList();

			// create the transformer 
			InputStream xslStream = this.getClass().getResourceAsStream(transformToConvertCartToDisplayObject);
						
			StreamSource xslSource = new StreamSource(xslStream);
			Transformer transformer = null;
			try {
				transformer = net.sf.saxon.TransformerFactoryImpl.newInstance().newTransformer(xslSource);
			} catch (TransformerException e) {
				log.error("TransformerException creating transformer", e);
			}	
			log.debug("created transformer");

			for (CartObject f: newFormCartElements) {

				// exception handling is arranged so loading will continue for other objects if there are bad objects
				try {
					// read the new format XML from the cart object and convert to (partial) old cart XML (i.e. serialized FormTransferObject)
					if (FormCartOptionsUtil.instance().dumpXMLDuringDebug())
						log.debug("XML from cart: " + f.getData());
					Source xmlInput = new StreamSource(new StringReader(f.getData()));	
					ByteArrayOutputStream xmlOutputStream = new ByteArrayOutputStream();  
					Result xmlOutput = new StreamResult(xmlOutputStream);
					transformer.transform(xmlInput, xmlOutput);
					if (FormCartOptionsUtil.instance().dumpXMLDuringDebug())
						log.debug("Converted XML: " + xmlOutputStream.toString());
	
					// convert the serialized FormCartDisplayObject into an actual FormCartDisplayObject
					Object pOb = new Object();
					StringReader reader = new StringReader(xmlOutputStream.toString());
					pOb = Unmarshaller.unmarshal(FormCartDisplayObject.class, reader);		
	
					log.debug("Trying to convert object pointer to FormCartDisplayObject...");		
					FormCartDisplayObject FCDO = (FormCartDisplayObject)pOb;
					if (FormCartOptionsUtil.instance().dumpXMLDuringDebug())
						log.debug("FormCartDisplayObject: " + FCDO.toString());
	
					// new form cart data doesn't include idseq, get it from the cart native id
					String idseq = f.getNativeId();
					FCDO.setIdseq(idseq);
					// check whether the form exists in database and show a warning prefix on the name if it doesn't 
					String databaseidseq = formBuilderService.getIdseq(FCDO.getPublicId(), FCDO.getVersion());
					if (databaseidseq.length() == 0) {
			    		log.info("Form " + FCDO.getPublicId() + " " + FCDO.getVersion() + " in cart not found in database");
			    		FCDO.setLongName(formNotInDatabaseLongNamePrefix + FCDO.getLongName());   		
					}
					FCDO.setProtocols(formBuilderService.getFormDetailsV2(FCDO.getIdseq()).getProtocols());
					itemList.add(new FormCartDisplayObjectPersisted(FCDO, true));
					log.debug("Loaded " + FCDO.getIdseq());
					
				} catch (TransformerException e) {
					log.error("TransformerException loading forms", e);
				} catch (MarshalException e) {
					log.error("MarshalException loading forms", e);	
				} catch (ValidationException e) {
					log.error("ValidationException loading forms", e);	
				} catch (Exception e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
				
			}
			
			for (Object crf: formCartV2.values()) {
				FormCartDisplayObject FCDO = new FormCartDisplayObject();
				FormV2 formVersion2 = ((FormV2)crf);
				FCDO.setAslName(formVersion2.getAslName());
				FCDO.setContextName(formVersion2.getContext().getName());
				FCDO.setFormType(formVersion2.getFormType());
				FCDO.setIdseq(formVersion2.getIdseq());
				FCDO.setLongName(formVersion2.getLongName());
				FCDO.setProtocols(formVersion2.getProtocols());
				FCDO.setPublicId(formVersion2.getPublicId());
				FCDO.setVersion(formVersion2.getVersion());
				itemList.add(new FormCartDisplayObjectPersisted(FCDO, false));
			}

			formDisplayObjects = itemList;		

		} catch (ObjectCartException oce) {
			oce.printStackTrace();
			throw new RuntimeException("getForms: Error loading forms", oce);
		}
//		for (Object each: formDisplayObjects)
//		{
//			System.out.println(" print form display object "+((FormCartDisplayObjectPersisted)each).getIsPersisted());
//		}
	}
	
	public Collection getFormDisplayObjects() {
		log.debug("getFormDisplayObjects " + formDisplayObjects.size() + " objects");		
		return formDisplayObjects;
	}
	
	// need access to some generic (non-typed, non-POJO) cart functions 
	public void addObjectCollection(Collection<CartObject> cartObjects) throws gov.nih.nci.objectCart.client.ObjectCartException {
		oCart = cartClient.storeObjectCollection(oCart, cartObjects);		
	}
	
	public void addFormsV2(Collection forms) {
		Iterator itemIter = forms.iterator();
		while (itemIter.hasNext()) {
		    addForm((FormV2TransferObject)itemIter.next());
		}
	}
	
	public void addForm(Object form) {
		if (!formCartV2.containsKey(((FormV2TransferObject)form).getIdseq()))
			formCartV2.put(((FormV2TransferObject)form).getIdseq(), form);
	}

	
	public void removeFormV2(Object form) {
			formCartV2.remove(form);
	}
	
	public void clearFormV2()
		{
			formCartV2.clear();
		}

	public Map getFormCartV2() {
		return formCartV2;
	}

	public void setFormCartV2(Map formCartV2) {
		this.formCartV2 = formCartV2;
	}

	
	
}
