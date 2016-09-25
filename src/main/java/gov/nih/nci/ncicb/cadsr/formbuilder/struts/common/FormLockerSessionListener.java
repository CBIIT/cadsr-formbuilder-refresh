package gov.nih.nci.ncicb.cadsr.formbuilder.struts.common;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpSessionEvent;
import javax.servlet.http.HttpSessionListener;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import gov.nih.nci.ncicb.cadsr.common.CaDSRConstants;
import gov.nih.nci.ncicb.cadsr.common.formbuilder.service.LockingService;
import gov.nih.nci.ncicb.cadsr.common.servicelocator.ApplicationServiceLocator;
import gov.nih.nci.ncicb.cadsr.common.servicelocator.ServiceLocatorException;
import gov.nih.nci.ncicb.cadsr.common.util.CDEBrowserParams;


public class FormLockerSessionListener implements HttpSessionListener{

    protected static Log log = LogFactory.getLog(FormLockerSessionListener.class.getName());

    public void sessionCreated(HttpSessionEvent se) {
        if (log.isDebugEnabled()){
            log.debug("New session " + se.getSession().getId() + " is created");
        }
        //CDEBrowserParams.reloadInstance();
        CDEBrowserParams.getToolInstance(CaDSRConstants.FORMBUILDER, se.getSession().getServletContext());
        return;
    }

    public void sessionDestroyed(HttpSessionEvent se) {
    	if (log.isDebugEnabled()){
    		log.debug("Session " + se.getSession().getId() + " is about to be destroyed.");
    	}
    	ApplicationContext context =  WebApplicationContextUtils.getWebApplicationContext(se.getSession().getServletContext());
    	LockingService lockingService = (LockingService) context.getBean("lockingService");
    	lockingService.unlockFormBySession(se.getSession().getId());
    }
    
    
    protected ApplicationServiceLocator getApplicationServiceLocator(ServletContext sc)
      throws ServiceLocatorException {
      ApplicationServiceLocator appServiceLocator =
        (ApplicationServiceLocator) sc.getAttribute(
          ApplicationServiceLocator.APPLICATION_SERVICE_LOCATOR_CLASS_KEY);
      if(appServiceLocator==null)
        throw new ServiceLocatorException("Could no find ApplicationServiceLocator with key ="+ ApplicationServiceLocator.APPLICATION_SERVICE_LOCATOR_CLASS_KEY);
      return appServiceLocator;
    } 
        

}
