package gov.nih.nci.cadsr.authentication;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.web.client.RestTemplate;

import gov.nih.nci.cadsr.FormBuilderConstants;
import gov.nih.nci.cadsr.FormBuilderProperties;
import gov.nih.nci.cadsr.api.controller.CartAdapterController;
import gov.nih.nci.cadsr.model.frontend.FEContext;
import gov.nih.nci.cadsr.model.frontend.FEFormMetaData;
import gov.nih.nci.cadsr.model.frontend.FEQuestion;

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
				+ FormBuilderConstants.FORMSERVICE_USERS + "/login";

		BasicAuthRestTemplate restTemplate = new BasicAuthRestTemplate(username, password);
		Boolean response = restTemplate.getForObject(base_uri, Boolean.class);
		
		if(response){
			userDetails = userService.loadUserByUsername(username);
			AuthUtils util = new AuthUtils();
			userDetails.setToken(util.md5(username + password));
			
			try{
				
				RestTemplate restTemplate2 = new RestTemplate();
				
				String cdecart_uri = props.getFormBuilderApiUrl() + "/FormBuilder/api/v1/carts/cdecart?username=" + username + "&cache=false";
				
				ParameterizedTypeReference<List<FEQuestion>> cderesponseType = new ParameterizedTypeReference<List<FEQuestion>>() {};
				ResponseEntity<List<FEQuestion>> cderesp = restTemplate2.exchange(cdecart_uri, HttpMethod.GET, null, cderesponseType);
				List<FEQuestion> cdelist = cderesp.getBody();
				
				String formcart_uri = props.getFormBuilderApiUrl() + "/FormBuilder/api/v1/carts/formcart?username=" + username + "&cache=false";
				
				ParameterizedTypeReference<List<FEFormMetaData>> formresponseType = new ParameterizedTypeReference<List<FEFormMetaData>>() {};
				ResponseEntity<List<FEFormMetaData>> formresp = restTemplate2.exchange(cdecart_uri, HttpMethod.GET, null, formresponseType);
				List<FEFormMetaData> formlist = formresp.getBody();
				
				userDetails.setCdeCart(cdelist);
				userDetails.setFormCart(formlist);
				
			} catch(Exception e){
				e.printStackTrace();
				return null;
			}
			
		}
		else{
			return null;
		}
		
		List<GrantedAuthority> grantedAuths = new ArrayList();
        
		if(userDetails.getUser() != null){
			grantedAuths.add(new SimpleGrantedAuthority("ROLE_USER"));
	        for(FEContext context : userDetails.getUser().getContexts()){
	        	grantedAuths.add(new SimpleGrantedAuthority(context.getName()));
	        }
		}
        
        return new UsernamePasswordAuthenticationToken(userDetails, password, grantedAuths);
		
	}

	public boolean supports(Class<?> arg0) {

		return (UsernamePasswordAuthenticationToken.class.isAssignableFrom(arg0));
		
	}

}
