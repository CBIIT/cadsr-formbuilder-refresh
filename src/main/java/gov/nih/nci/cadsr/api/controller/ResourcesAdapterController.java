package gov.nih.nci.cadsr.api.controller;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import gov.nih.nci.cadsr.FormBuilderConstants;
import gov.nih.nci.cadsr.FormBuilderProperties;
import gov.nih.nci.cadsr.model.BBContext;

/**
 * 
 * @author trombadorera
 *
 *         This controller class provides and API to FormBuilder for retrieving
 *         resources necessary to build views, such as contexts, workflows, and
 *         Form types.
 */
@RestController
public class ResourcesAdapterController {

	@Autowired
	private FormBuilderProperties props;

	/*@RequestMapping(value = { "/contexts", "/contexts/{username}" }, method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity getAllContexts(@PathVariable Optional<String> username) throws RuntimeException {
		String uri = props.getFormServiceApiUrl() + FormBuilderConstants.FORMSERVICE_BASE_URL
				+ FormBuilderConstants.FORMSERVICE_CONTEXTS;

		if (username != null && !username.equals("")) {
			uri = uri + "/" + username;
		}

		RestTemplate restTemplate = new RestTemplate();
		ResponseEntity<String> response = restTemplate.getForEntity(uri, String.class);

		return response;

	}*/
	
	//temporary fix for Bug CADSRFBTR-248. revert to previous method after updating search UI to React.
	@RequestMapping(value = { "/contexts", "/contexts/{username}" }, method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity getAllContexts(@PathVariable Optional<String> username) throws RuntimeException {
		
		List<BBContext> contexts = new ArrayList<BBContext>();
		contexts.add(new BBContext("F6117C06-C689-F9FD-E040-BB89AD432E40","ABTC",""));
		contexts.add(new BBContext("D8D849BC-68CF-10AA-E040-BB89AD430348","AECC",""));
		contexts.add(new BBContext("E73A2559-FDAF-96CB-E040-BB89AD431DD5","Alliance",""));
		contexts.add(new BBContext("2DB947EE-DAEC-E767-E050-BB89AD43388C","BBRB",""));
		contexts.add(new BBContext("E3D98FAA-4194-FE1E-E040-BB89AD432060","BOLD",""));
		contexts.add(new BBContext("5D003B18-1A08-6BD4-E044-0003BA3F9857","BRIDG",""));
		contexts.add(new BBContext("AA4E4AEC-5422-3E11-E034-0003BA12F5E7","caCORE",""));
		contexts.add(new BBContext("A5599257-A08F-41D1-E034-080020C9C0E0","CCR",""));
		contexts.add(new BBContext("A89C651A-180D-1166-E040-BB89AD43308E","CDC/PHIN",""));
		contexts.add(new BBContext("E2538C9F-E9E7-3303-E034-0003BA12F5E7","CDISC",""));
		contexts.add(new BBContext("99BA9DC8-2094-4E69-E034-080020C9C0E0","CIP",""));
		contexts.add(new BBContext("DCC52CE8-A028-A908-E040-BB89AD435412","CITN",""));
		contexts.add(new BBContext("EB011825-878C-E0E9-E040-BB89AD437FDD","COG",""));
		contexts.add(new BBContext("24D81062-1815-AA55-E050-BB89AD430FFA","CTD-2",""));
		contexts.add(new BBContext("99BA9DC8-2095-4E69-E034-080020C9C0E0","CTEP",""));
		contexts.add(new BBContext("DED02F08-8D34-D3EA-E040-BB89AD43785C","DCI",""));
		contexts.add(new BBContext("A932C6E7-82EE-67C2-E034-0003BA12F5E7","DCP",""));
		contexts.add(new BBContext("A7CF3B35-74D1-8852-E040-BB89AD435FAB","ECOG-ACRIN",""));
		contexts.add(new BBContext("9FDD834A-802F-1221-E034-080020C9C0E0","EDRN",""));
		contexts.add(new BBContext("2C8BAF10-7E19-B797-E050-BB89AD43619C","GDC",""));
		contexts.add(new BBContext("15849FD6-F176-2FF9-E050-BB89AD4362B4","iCaRe2",""));
		contexts.add(new BBContext("D8D849BC-6955-10AA-E040-BB89AD430348","LCC",""));
		contexts.add(new BBContext("32BA9603-A1A2-61BB-E050-007F01003592","MCL",""));
		contexts.add(new BBContext("D9344734-8CAF-4378-E034-0003BA12F5E7","NCIP",""));
		contexts.add(new BBContext("6BDC8E1A-E021-BC44-E040-BB89AD4365F6","NCIP CDE Data Standards",""));
		contexts.add(new BBContext("DCC52A25-A107-42D4-E040-BB89AD4346A7","NHC-NCI",""));
		contexts.add(new BBContext("EDA90DE9-80D9-1E28-E034-0003BA3F9857","NHLBI",""));
		contexts.add(new BBContext("726AD4F3-13C8-7001-E040-BB89AD430AA8","NICHD",""));
		contexts.add(new BBContext("A89C651A-17CA-1166-E040-BB89AD43308E","NIDA",""));
		contexts.add(new BBContext("F5E94686-5C79-2E5A-E034-0003BA3F9857","NIDCR",""));
		contexts.add(new BBContext("8F119EA6-BC32-2319-E040-BB89AD431E26","NINDS",""));
		contexts.add(new BBContext("2DB947EE-DB2F-E767-E050-BB89AD43388C","NRDS",""));
		contexts.add(new BBContext("E1D35591-F639-B5F8-E040-BB89AD437255","NRG",""));
		contexts.add(new BBContext("15849FE1-0778-3496-E050-BB89AD4363CC","OCCAM",""));
		contexts.add(new BBContext("DCC54A60-45E6-51EF-E040-BB89AD4336DC","OHSU Knight",""));
		contexts.add(new BBContext("F6141DD3-5081-EC4B-E040-BB89AD435D8B","ONC SDC Project",""));
		contexts.add(new BBContext("DCC52B9A-C60D-1CD4-E040-BB89AD434F2D","PBTC",""));
		contexts.add(new BBContext("26A4BBBE-35B8-55F4-E050-BB89AD43750D","PhenX",""));
		contexts.add(new BBContext("C70EECD5-9998-2C9B-E034-0003BA12F5E7","PS&CC",""));
		contexts.add(new BBContext("99BA9DC8-2096-4E69-E034-080020C9C0E0","SPOREs",""));
		contexts.add(new BBContext("DC9F92F1-33F1-63FE-E040-BB89AD431DA1","SWOG",""));
		contexts.add(new BBContext("29A8FB18-0AB1-11D6-A42F-0010A4C1E842","TEST",""));
		contexts.add(new BBContext("E593F10C-3186-508C-E040-BB89AD4324A0","Theradex",""));
		contexts.add(new BBContext("E5CA1CEF-E2C6-3073-E034-0003BA3F9857","Training",""));
		contexts.add(new BBContext("D8D849BC-6912-10AA-E040-BB89AD430348","USC/NCCC",""));
		
		ResponseEntity response = new ResponseEntity(contexts, HttpStatus.OK);

		return response;

	}

	/*@RequestMapping(value = "/categories", method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity getAllCategories() throws RuntimeException {
		String uri = props.getFormServiceApiUrl() + FormBuilderConstants.FORMSERVICE_BASE_URL
				+ FormBuilderConstants.FORMSERVICE_CATEGORIES;

		RestTemplate restTemplate = new RestTemplate();
		ResponseEntity<String> response = restTemplate.getForEntity(uri, String.class);

		return response;

	}*/
	
	//temporary fix for Bug CADSRFBTR-248. revert to previous method after updating search UI to React.
	@RequestMapping(value = "/categories", method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity getAllCategories() throws RuntimeException {
		
		List<String> categories = Arrays.asList("Comments","COMMON","Demographic","Eligibility","Flow Sheet","Follow-Up","Lab","Off Treatment","On-Study","Pathology","Pre-Study","Quality of Life","Registration","Response","RT Submission","Toxicity","Transmittal","Treatment");
		
		
		ResponseEntity<String> response = new ResponseEntity(categories, HttpStatus.OK);

		return response;

	}

	/*@RequestMapping(value = "/types", method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity getAllTypes() throws RuntimeException {
		String uri = props.getFormServiceApiUrl() + FormBuilderConstants.FORMSERVICE_BASE_URL
				+ FormBuilderConstants.FORMSERVICE_TYPES;

		RestTemplate restTemplate = new RestTemplate();
		ResponseEntity<String> response = restTemplate.getForEntity(uri, String.class);

		return response;

	}*/
	
	//temporary fix for Bug CADSRFBTR-248. revert to previous method after updating search UI to React.
	@RequestMapping(value = "/types", method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity getAllTypes() throws RuntimeException {

		List<String> types = Arrays.asList("CRF","TEMPLATE");
		
		ResponseEntity<String> response = new ResponseEntity(types, HttpStatus.OK);

		return response;

	}

	/*@RequestMapping(value = "/workflows", method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity getAllWorkflow() throws RuntimeException {
		String uri = props.getFormServiceApiUrl() + FormBuilderConstants.FORMSERVICE_BASE_URL
				+ FormBuilderConstants.FORMSERVICE_WORKFLOWS;

		RestTemplate restTemplate = new RestTemplate();
		ResponseEntity<String> response = restTemplate.getForEntity(uri, String.class);

		return response;
	}*/
	
	//temporary fix for Bug CADSRFBTR-248. revert to previous method after updating search UI to React.
	@RequestMapping(value = "/workflows", method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity getAllWorkflow() throws RuntimeException {

		List<String> workflows = Arrays.asList("APPRVD FOR TRIAL USE","CRF DE TO GROUP","CRF GROUP RV DONE","CRF MATCH EXISTING","CRF NOT APPROVED","CRF RELOAD","CRF TEMPLATE","DATA QUAL REV DONE","DRAFT MOD","DRAFT NEW","EXACT MATCH","GRP REVIEW COMP","NEW TERM SUBMTD","NEW VERS SUBMTD","PROTOCOL TO GRP REV","RECOMM TERM USED","RECOMMENDED TERM","RELEASED","RETIRED PHASED OUT","RETIRED UNLOADED","RETIRED WITHDRAWN","UNASSIGNED","UNDER DEVELOPMENT");
		
		ResponseEntity<String> response = new ResponseEntity(workflows, HttpStatus.OK);

		return response;
	}

}
