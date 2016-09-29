package gov.nih.nci.cadsr.authentication;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.client.RestTemplate;

import gov.nih.nci.cadsr.FormBuilderConstants;
import gov.nih.nci.cadsr.FormBuilderProperties;
import gov.nih.nci.cadsr.model.BBUser;
import gov.nih.nci.cadsr.model.session.SessionObject;
import gov.nih.nci.ncicb.cadsr.common.dto.NCIUserTransferObject;
import gov.nih.nci.ncicb.cadsr.common.resource.NCIUser;

public class CadsrUserDetailsService implements UserDetailsService{
	
	@Autowired
	private FormBuilderProperties props;
	
	@Autowired
	SessionObject sessionObject;

	public CadsrUserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		
		String base_uri = props.getFormServiceApiUrl() + FormBuilderConstants.FORMSERVICE_BASE_URL
				+ FormBuilderConstants.FORMSERVICE_USERS + "/" + username;

		RestTemplate restTemplate = new RestTemplate();
		BBUser user = restTemplate.getForObject(base_uri, BBUser.class);
		
		CadsrUserDetails details = new CadsrUserDetails();
		details.setUser(user);
		details.setUsername(username);
		
		return details;
	}

}
