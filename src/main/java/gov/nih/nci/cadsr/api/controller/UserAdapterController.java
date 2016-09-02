package gov.nih.nci.cadsr.api.controller;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

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

	@RequestMapping(value = { "/username" }, method = RequestMethod.GET)
	@ResponseBody
	public String getloggedinuser() {
		return SecurityContextHolder.getContext().getAuthentication().getName();
	}

}
