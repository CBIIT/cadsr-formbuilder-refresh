package gov.nih.nci.cadsr.api.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import gov.nih.nci.cadsr.FormBuilderConstants;
import gov.nih.nci.cadsr.FormBuilderProperties;
import gov.nih.nci.cadsr.authentication.AuthUtils;
import gov.nih.nci.cadsr.authentication.CadsrUserDetails;
import gov.nih.nci.cadsr.model.frontend.FEContext;
import gov.nih.nci.cadsr.model.frontend.FEUser;
import gov.nih.nci.cadsr.model.session.SessionObject;

/**
 * 
 * @author trombadorera
 *
 *         This controller class provides an API to the FormBuilder to retrieve
 *         information about the user in session.
 */
@RestController
@RequestMapping(value = "/users")
public class UserAdapterController {
	
	@Autowired
	private FormBuilderProperties props;
	
	@Autowired
	private AuthUtils authUtil;
	
	@Autowired
	SessionObject sessionObject;
	
	@RequestMapping(value = { "/login/{username}/{password}" }, method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity login(@PathVariable String username, @PathVariable String password) {
		String base_uri = props.getFormServiceApiUrl() + FormBuilderConstants.FORMSERVICE_BASE_URL
				+ FormBuilderConstants.FORMSERVICE_USERS + "/login";

		RestTemplate restTemplate = new RestTemplate();
		ResponseEntity<Boolean> response = restTemplate.getForEntity(base_uri, Boolean.class);
		
		return response;
	}
	
	@RequestMapping(value = { "/loggedIn" }, method = RequestMethod.GET)
	@ResponseBody
	public boolean getLoggedIn() {
		return authUtil.getLoggedIn();
	}

	@RequestMapping(value = { "/username" }, method = RequestMethod.GET)
	@ResponseBody
	public String getloggedinusername() {
		
		return authUtil.getloggedinuser().getUsername();
	}
	
	@RequestMapping(value = { "/details" }, method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity getloggedinuserdetails() {
		CadsrUserDetails userDetails =
				 (CadsrUserDetails)SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		
		return new ResponseEntity(userDetails, HttpStatus.OK);
	}
	
	@RequestMapping(value = { "/user" }, method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity getloggedinuser() {
		
		if(authUtil.getLoggedIn()){
//			CadsrUserDetails userDetails =
//					 (CadsrUserDetails)SecurityContextHolder.getContext().getAuthentication().getPrincipal();
//			
//			FEUser user = userDetails.getUser();
			FEUser user = authUtil.getloggedinuser();
			
			return new ResponseEntity(user, HttpStatus.OK);
		}
		
		return new ResponseEntity(HttpStatus.UNAUTHORIZED);
	}
	
	@RequestMapping(value = { "/contexts" }, method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity getCuratorContexts() {
		
		if(authUtil.getLoggedIn()){
			CadsrUserDetails userDetails =
					 (CadsrUserDetails)SecurityContextHolder.getContext().getAuthentication().getPrincipal();
			
			return new ResponseEntity(userDetails.getUser().getContexts(), HttpStatus.OK);
		}
		
		return new ResponseEntity(HttpStatus.UNAUTHORIZED);
		
	}
	
	
	/*@RequestMapping(value = { "/session/username" }, method = RequestMethod.GET)
	@ResponseBody
	public String getloggedinSessionUser() {
		return sessionObject.getCurrentUser();
	}
	
	@RequestMapping(value = { "/session/value" }, method = RequestMethod.GET)
	@ResponseBody
	public String getSessionValue() {
		return sessionObject.getSessionValue();
	}
	
	@RequestMapping(value = { "/session/delay/value" }, method = RequestMethod.GET)
	@ResponseBody
	public String getDelaySessionValue() throws InterruptedException {
		
		TimeUnit.SECONDS.sleep(30);
		
		return sessionObject.getSessionValue();
	}
	
	@RequestMapping(value = { "/session/value/{value}" }, method = RequestMethod.GET)
	@ResponseBody
	public String setSessionValue(@PathVariable String value) {
		sessionObject.setSessionValue(value);
		return sessionObject.getSessionValue();
	}*/
	
	@RequestMapping(value = { "/session" }, method = RequestMethod.GET)
	@ResponseBody
	public SessionObject getSessionObject() {
		return sessionObject;
	}
	
	@RequestMapping(value = { "/session/user" }, method = RequestMethod.GET)
	@ResponseBody
	public FEUser getUser() {
		return sessionObject.getUser();
	}

}
