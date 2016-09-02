package gov.nih.nci.cadsr.api.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import gov.nih.nci.cadsr.FormBuilderProperties;
import gov.nih.nci.cadsr.model.session.SessionCarts;
import gov.nih.nci.ncicb.cadsr.common.dto.FormTransferObject;
import gov.nih.nci.ncicb.cadsr.common.dto.ModuleTransferObject;
import gov.nih.nci.ncicb.cadsr.common.dto.QuestionTransferObject;

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

		return null;
	}

	@RequestMapping(value = "/formcart/{username}", method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity getFormCart(@RequestParam(value = "username", required = true) String username) {

		return null;
	}

	@RequestMapping(value = "/questions/{cdeid}", method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity<QuestionTransferObject> getQuestionFromCDE(
			@RequestParam(value = "cdeid", required = true) String cdeid) {

		return null;
	}

	@RequestMapping(value = "/modules", method = RequestMethod.POST)
	@ResponseBody
	public ResponseEntity saveModuleToCart(@RequestBody ModuleTransferObject module) {

		carts.getModuleCart().add(module);

		return null;
	}

	@RequestMapping(value = "/forms", method = RequestMethod.POST)
	@ResponseBody
	public ResponseEntity saveFormToCart(@RequestBody FormTransferObject form) {

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
