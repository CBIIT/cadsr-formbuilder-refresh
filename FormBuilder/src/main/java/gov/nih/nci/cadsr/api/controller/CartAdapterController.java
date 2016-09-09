package gov.nih.nci.cadsr.api.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import gov.nih.nci.cadsr.FormBuilderConstants;
import gov.nih.nci.cadsr.FormBuilderProperties;
import gov.nih.nci.cadsr.model.session.SessionCarts;
import gov.nih.nci.ncicb.cadsr.common.CaDSRConstants;
import gov.nih.nci.ncicb.cadsr.common.dto.FormTransferObject;
import gov.nih.nci.ncicb.cadsr.common.dto.ModuleTransferObject;
import gov.nih.nci.ncicb.cadsr.common.dto.QuestionTransferObject;
import gov.nih.nci.ncicb.cadsr.common.resource.NCIUser;
import gov.nih.nci.ncicb.cadsr.common.util.CDEBrowserParams;
import gov.nih.nci.ncicb.cadsr.objectCart.CDECart;
import gov.nih.nci.ncicb.cadsr.objectCart.CDECartItemTransferObject;
import gov.nih.nci.ncicb.cadsr.objectCart.impl.CDECartOCImpl;
import gov.nih.nci.objectCart.client.ObjectCartClient;

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

	@RequestMapping(value = "/moduleCart/{username}", method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity getModuleCart(@RequestParam(value = "username", required = true) String username) {

		return new ResponseEntity(carts.getModuleCart(), HttpStatus.OK);

	}

	@RequestMapping(value = "/cdecart/{username}", method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity getCDECart(@RequestParam(value = "username", required = true) String username) {

		return new ResponseEntity(carts.getCdeCart(), HttpStatus.OK);
		
	}

	@RequestMapping(value = "/formcart/{username}", method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity getFormCart(@RequestParam(value = "username", required = true) String username) {

		return new ResponseEntity(carts.getFormCart(), HttpStatus.OK);
		
	}
	
/*	@RequestMapping(value = "/objcart/cdecart/{username}", method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity loadCDECart(@PathVariable String username) {

//		      CDEBrowserParams params = CDEBrowserParams.getInstance();
//		      String ocURL = params.getObjectCartUrl();
				String ocURL = "http://objcart2-dev.nci.nih.gov/objcart103";
		      //Get the cart in the session
		      ObjectCartClient cartClient = null;
		      
		      try{
				  if (!ocURL.equals(""))
					  cartClient = new ObjectCartClient(ocURL);
				  else
			    	  cartClient = new ObjectCartClient();
			      
			      CDECart userCart = new CDECartOCImpl(cartClient, username,CaDSRConstants.CDE_CART);
			      
					return new ResponseEntity(userCart.getDataElements(), HttpStatus.OK);

			      
		      } catch(Exception e){
		    	  e.printStackTrace();
		    	  return new ResponseEntity(e.toString() + e.getMessage(), HttpStatus.OK);
		      }
		      
//		      this.setSessionObject(request, CaDSRConstants.CDE_CART, userCart);
		
//		return null;
		
	}*/
	
	@RequestMapping(value = "/objcart/cdecart2/{username}", method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity loadCDECart2(@PathVariable String username) {

		String ocURL = "http://objcart2-dev.nci.nih.gov/objcart103";
		
		String xmlURL = "GetXML";
		
		String cartName = "cdeCart";
		
		String uri = ocURL + "/" + xmlURL + "?" + "query=CartObject&Cart[@name=" + cartName + "][@userId=" + username + "]&roleName=cartObjectCollection";
		
		/**
		 * This model should directly translate to the xml "data" field in the xml response.
		 * Converting from the xml "data" fields in the response should produce a list of
		 * CDECartItemTransferObject
		 */
		CDECartItemTransferObject cde = new CDECartItemTransferObject();
		
		RestTemplate restTemplate = new RestTemplate();
		ResponseEntity<String> response = restTemplate.getForEntity(uri, String.class);
		
		return response;
	}

	@RequestMapping(value = "/objcart/formcart/{username}", method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity loadFormCart(@RequestParam(value = "username", required = true) String username) {

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

}
