package gov.nih.nci.cadsr.controller;

import java.sql.SQLException;
import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import gov.nih.nci.cadsr.FormServiceProperties;
import gov.nih.nci.cadsr.manager.FormManager;
import gov.nih.nci.cadsr.domain.Form;

@RestController
public class FormController {

	private static final Logger logger = Logger.getLogger(FormController.class);

	@Autowired
	private FormServiceProperties props;

	@Autowired
	private FormManager formManager;

	@RequestMapping(value = "/helloworld", method = RequestMethod.GET)
	public String getGreeting() {
		String result = "Hello World!";
		logger.info("calling hello world");
		return result;
	}

	/*
	 * @RequestMapping(value = "/getproperty", method = RequestMethod.GET)
	 * public String getProperty() { String result = props.getTestProp();
	 * logger.info("calling get property"); return result; }
	 */

	/*
	 * @RequestMapping(value = "/forms", method = RequestMethod.GET)
	 * public @ResponseBody List<Form> searchForms(
	 * 
	 * @RequestParam(value = "formLongName", required = false) String
	 * formLongName,
	 * 
	 * @RequestParam(value = "protocolIdSeq", required = false) String
	 * protocolIdSeq, // @RequestParam(value = "contextIdSeq", required = false)
	 * String contextIdSeq,
	 * 
	 * @RequestParam(value = "workflow", required = false) String workflow,
	 * 
	 * @RequestParam(value = "categoryName", required = false) String
	 * categoryName,
	 * 
	 * @RequestParam(value = "type", required = false) String type,
	 * 
	 * @RequestParam(value = "classificationIdSeq", required = false) String
	 * classificationIdSeq,
	 * 
	 * @RequestParam(value = "publicId", required = false) String publicId,
	 * 
	 * @RequestParam(value = "version", required = false) String version,
	 * // @RequestParam(value = "moduleLongName", required = false) String
	 * moduleLongName, // @RequestParam(value = "cdePublicId", required = false)
	 * String cdePublicId, // @RequestParam(value = "user", required = false)
	 * NCIUser user,
	 * 
	 * @RequestParam(value = "contextRestriction", required = false) String
	 * contextRestriction) {
	 * 
	 * List<Form> forms = new ArrayList<Form>();
	 * 
	 * 
	 * 
	 * logger.info("Long Name: " + formLongName + " publicId: " + publicId);
	 * 
	 * Form form = new Form(); form.setId(123L); form.setLongName(formLongName);
	 * form.setPublicId(publicId); form.setType("Type Value");
	 * form.setWorkflow("DRAFT");
	 * 
	 * Form form2 = new Form(); form2.setId(123L);
	 * form2.setLongName(formLongName); form2.setPublicId(publicId);
	 * form2.setType("Type Value"); form2.setWorkflow("DRAFT");
	 * 
	 * forms.add(form); forms.add(form2);
	 * 
	 * return forms;
	 * 
	 * }
	 */

	@RequestMapping(value = "/forms", method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity searchForm(
			@RequestParam(value = "formLongName", required = false) String formLongName,
			@RequestParam(value = "protocolIdSeq", required = false) String protocolIdSeq,
			// @RequestParam(value = "contextIdSeq", required = false) String
			// contextIdSeq,
			@RequestParam(value = "workflow", required = false) String workflow,
			@RequestParam(value = "category", required = false) String category,
			@RequestParam(value = "type", required = false) String type,
			@RequestParam(value = "classificationIdSeq", required = false) String classificationIdSeq,
			@RequestParam(value = "publicId", required = false) String publicId,
			@RequestParam(value = "version", required = false) String version,
			// @RequestParam(value = "moduleLongName", required = false) String
			// moduleLongName,
			// @RequestParam(value = "cdePublicId", required = false) String
			// cdePublicId,
			// @RequestParam(value = "user", required = false) NCIUser user,
			@RequestParam(value = "contextRestriction", required = false) String contextRestriction) throws SQLException {
		{
			logger.info("Long Name: " + formLongName + " publicId: " + publicId);
			try{
			List<Form> FormList = formManager.searchForm(formLongName, protocolIdSeq, workflow, category, type,
					classificationIdSeq, publicId, version);

			ResponseEntity<List<Form>> response = createSuccessResponse(FormList);
			logger.info(response.toString());
			return response;
			}
		 catch (SQLException e) {
//			throw new RuntimeException(e);
			return createErrorResponse(e);
			
		}
			
			}
	}

	private ResponseEntity<List<Form>> createSuccessResponse(final List<Form> form) {

		return new ResponseEntity<List<Form>>(form, HttpStatus.OK);
	}
	private ResponseEntity <String> createErrorResponse(final Exception badReq) {

		return new ResponseEntity<String>(badReq.getMessage(), HttpStatus.BAD_REQUEST);
	}
}
