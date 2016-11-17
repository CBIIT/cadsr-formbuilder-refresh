package gov.nih.nci.cadsr.authentication;

//import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import gov.nih.nci.cadsr.model.frontend.FEUser;

public class AuthUtils {

	public String md5(String password) {
		// return DigestUtils.md5Hex(password);
		return "token";
	}

	public boolean getLoggedIn() {

		if (SecurityContextHolder.getContext().getAuthentication() != null
				&& SecurityContextHolder.getContext().getAuthentication().isAuthenticated()
				&& !(SecurityContextHolder.getContext().getAuthentication() instanceof AnonymousAuthenticationToken)) {

			return true;
		} else {
			return false;
		}

	}

	public FEUser getloggedinuser() {

		if (this.getLoggedIn()) {
			CadsrUserDetails userDetails = (CadsrUserDetails) SecurityContextHolder.getContext().getAuthentication()
					.getPrincipal();

			return userDetails.getUser();
		}

		return null;
	}

}
