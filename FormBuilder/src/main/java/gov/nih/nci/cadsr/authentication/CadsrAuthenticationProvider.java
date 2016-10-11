package gov.nih.nci.cadsr.authentication;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.client.RestTemplate;

import gov.nih.nci.cadsr.FormBuilderConstants;
import gov.nih.nci.cadsr.FormBuilderProperties;
import gov.nih.nci.cadsr.api.controller.CartAdapterController;
import gov.nih.nci.cadsr.model.BBContext;
import gov.nih.nci.cadsr.model.BBFormMetaData;
import gov.nih.nci.cadsr.model.BBQuestion;
import gov.nih.nci.cadsr.model.session.SessionObject;

public class CadsrAuthenticationProvider implements AuthenticationProvider{
	
	@Autowired
	private FormBuilderProperties props;
	
	@Autowired
	private CadsrUserDetailsService userService;
	
	public Authentication authenticate(Authentication arg0) throws AuthenticationException {
		
		String username = arg0.getPrincipal().toString();
		String password = arg0.getCredentials().toString();
		CadsrUserDetails userDetails = new CadsrUserDetails();

		String base_uri = props.getFormServiceApiUrl() + FormBuilderConstants.FORMSERVICE_BASE_URL
				+ FormBuilderConstants.FORMSERVICE_USERS + "/login/" + username + "/" + password;

		RestTemplate restTemplate = new RestTemplate();
		Boolean response = restTemplate.getForObject(base_uri, Boolean.class);
		
		if(response){
			userDetails = userService.loadUserByUsername(username);
			AuthUtils util = new AuthUtils();
			userDetails.setToken(util.md5(username + password));
			
			CartAdapterController cartCont = new CartAdapterController();
			try{
				userDetails.setCdeCart((List<BBQuestion>)cartCont.loadCDECart(username).getBody());
				userDetails.setFormCart((List<BBFormMetaData>)cartCont.loadFormV2Cart(username).getBody());
			} catch(Exception e){
				e.printStackTrace();
			}
			//XXX: load user carts here?
			//Session may not exist yet?
			//Add Carts to userDetails object? Use this as primary session object?
			
		}
		
		List<GrantedAuthority> grantedAuths = new ArrayList();
//        grantedAuths.add(new SimpleGrantedAuthority("ROLE_USER"));
        
        for(BBContext context : userDetails.getUser().getContexts()){
        	grantedAuths.add(new SimpleGrantedAuthority(context.getName()));
        }
        
        return new UsernamePasswordAuthenticationToken(userDetails, password, grantedAuths);

		
	}

	public boolean supports(Class<?> arg0) {

		return (UsernamePasswordAuthenticationToken.class.isAssignableFrom(arg0));
		
	}

}
