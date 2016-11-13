package gov.nih.nci.cadsr.authentication;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.session.SessionDestroyedEvent;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import gov.nih.nci.cadsr.FormBuilderConstants;
import gov.nih.nci.cadsr.FormBuilderProperties;

@Component
public class LogoutListener implements ApplicationListener<SessionDestroyedEvent> {
	
	@Autowired
	private FormBuilderProperties props;

    @Override
    public void onApplicationEvent(SessionDestroyedEvent event)
    {
        List<SecurityContext> lstSecurityContext = event.getSecurityContexts();
        CadsrUserDetails ud;
        
        for (SecurityContext securityContext : lstSecurityContext)
        {
            ud = (CadsrUserDetails) securityContext.getAuthentication().getPrincipal();
            // ...release all locks
            
            String lock_uri = props.getFormBuilderApiUrl() + FormBuilderConstants.FORMBUILDER_BASE_URL + 
					"lock/all/" + ud.getUsername();
			
            RestTemplate restTemplate = new RestTemplate();
			restTemplate.delete(lock_uri);
            
        }
    }

}