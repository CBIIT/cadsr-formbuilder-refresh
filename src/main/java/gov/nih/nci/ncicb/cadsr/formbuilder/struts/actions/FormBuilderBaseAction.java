package gov.nih.nci.ncicb.cadsr.formbuilder.struts.actions;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.struts.action.Action;
import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;

import gov.nih.nci.ncicb.cadsr.common.CaDSRConstants;
import gov.nih.nci.ncicb.cadsr.common.formbuilder.common.FormBuilderConstants;
import gov.nih.nci.ncicb.cadsr.common.formbuilder.struts.common.FormConstants;
import gov.nih.nci.ncicb.cadsr.common.formbuilder.struts.common.NavigationConstants;
import gov.nih.nci.ncicb.cadsr.common.persistence.PersistenceConstants;


public abstract class FormBuilderBaseAction extends Action 
  implements FormConstants, NavigationConstants, PersistenceConstants,
    FormBuilderConstants, CaDSRConstants {
  
  protected static Log log = LogFactory.getLog(FormAction.class.getName());
  
  /*@Autowired
  private FormBuilderService formBuilderService;
  
  public FormBuilderService getFormBuilderService() {
	  return formBuilderService;
  }

  public void setFormBuilderService(FormBuilderService formBuilderService) {
	  this.formBuilderService = formBuilderService;
  }*/
  
  /**
   * This is the main action called from the Struts framework.
   *
   * @param mapping The ActionMapping used to select this instance.
   * @param form The optional ActionForm bean for this request.
   * @param request The HTTP Request we are processing.
   * @param response The HTTP Response we are processing.
   */
  public ActionForward execute(
    ActionMapping mapping,
    ActionForm form,
    HttpServletRequest request,
    HttpServletResponse response) throws IOException, ServletException {
    //return mapping.findForward("success");
    return executeCommand(mapping, form, request, response);
  }

  /**
   * Concrete sub-classes have to provide implementation for this method
   *
   * @param mapping The ActionMapping used to select this instance.
   * @param form The optional ActionForm bean for this request.
   * @param request The HTTP Request we are processing.
   * @param response The HTTP Response we are processing.
   */
  public abstract ActionForward executeCommand(
    ActionMapping mapping,
    ActionForm form,
    HttpServletRequest request,
    HttpServletResponse response) throws IOException, ServletException;

  /**
   * Checks if the user executing the current request is logged in
   */
  protected boolean isLoggedIn(HttpServletRequest request) {
    boolean userStatus = false;

    return userStatus;
  }

  /**
   * Retrieve an object from the application scope by its name. This is a
   * convience method.
   */
  protected Object getApplicationObject(String attrName) {
    return servlet.getServletContext().getAttribute(attrName);
  }

  /**
   * Retrieve a session object based on the request and the attribute name.
   */
  protected Object getSessionObject(
    HttpServletRequest req,
    String attrName) {
    Object sessionObj = null;
    HttpSession session = req.getSession(false);

    if (session != null) {
      sessionObj = session.getAttribute(attrName);
    }

    return sessionObj;
  }

  /**
   * Add an object to session based on the request and the attribute name.
   */
  protected void setSessionObject(
    HttpServletRequest req,
    String attrName,
    Object sessionObject) {
    HttpSession session = req.getSession(false);

    if (session != null) {
      session.setAttribute(attrName, sessionObject);
    }
  }

  protected void setLoginToken(
    HttpServletRequest req,
    String path) {
    HttpSession session = req.getSession();

    if (session != null) {
      session.setAttribute(FormBuilderConstants.LOGIN_TOKEN_KEY, path);
    }
  }

}
