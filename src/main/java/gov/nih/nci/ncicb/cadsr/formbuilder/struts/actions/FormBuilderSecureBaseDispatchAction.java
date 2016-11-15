package gov.nih.nci.ncicb.cadsr.formbuilder.struts.actions;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import org.apache.struts.action.DynaActionForm;
import org.owasp.esapi.ESAPI;
import org.owasp.esapi.codecs.Codec;
import org.owasp.esapi.codecs.OracleCodec;
import org.springframework.context.ApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import gov.nih.nci.ncicb.cadsr.common.exception.FatalException;
import gov.nih.nci.ncicb.cadsr.common.exception.InvalidUserException;
import gov.nih.nci.ncicb.cadsr.common.formbuilder.common.FormElementLocker;
import gov.nih.nci.ncicb.cadsr.common.formbuilder.struts.common.FormConstants;
import gov.nih.nci.ncicb.cadsr.common.persistence.dao.AbstractDAOFactoryFB;
import gov.nih.nci.ncicb.cadsr.common.persistence.dao.UserManagerDAO;
import gov.nih.nci.ncicb.cadsr.common.persistence.dao.jdbc.JDBCDAOFactoryFB;
import gov.nih.nci.ncicb.cadsr.common.resource.Form;
import gov.nih.nci.ncicb.cadsr.common.resource.NCIUser;


/**
 * Base DispatchAction for all formbuilder DispatchActions
 */
public class FormBuilderSecureBaseDispatchAction extends FormBuilderBaseDispatchAction
{
  protected static Log log = LogFactory.getLog(FormAction.class.getName());
  
  //@Autowired
  AbstractDAOFactoryFB daoFactory;

  public AbstractDAOFactoryFB getDaoFactory() {
	  return daoFactory;
  }
  
  public void setDaoFactory(AbstractDAOFactoryFB daoFactory) {
	  this.daoFactory = daoFactory;
  }
  
  public void initPostConstruct(HttpServletRequest request)
  {
	  if (daoFactory == null)
	  {
		  ApplicationContext context =  WebApplicationContextUtils.getWebApplicationContext(request.getSession().getServletContext());
		  daoFactory = (AbstractDAOFactoryFB) context.getBean("daoFactory", JDBCDAOFactoryFB.class);
	  }
  }
  
/**
   * Sets default method name if no method is specified
   *
   * @return ActionForward
   *
   * @throws Exception
   */
  protected ActionForward dispatchMethod(
    ActionMapping mapping,
    ActionForm form,
    HttpServletRequest request,
    HttpServletResponse response,
    String name) throws Exception {
	  
    initPostConstruct(request);
    try {
      String username = getLoggedInUsername(request);
      if ((username == null) || username.equals("")) {
        throw new InvalidUserException("Null username");
      }
      else {
        NCIUser currentuser =
          (NCIUser) request.getSession().getAttribute(USER_KEY);
  
        if (currentuser != null) {
          if (!currentuser.getUsername().equalsIgnoreCase(username)) {
            throw new InvalidUserException("Invalid user state");
          }
        }
        else {
          setApplictionUser(username, request);
        }
      }
      
//// GF29128  D.An, 20130729.    
      request.getSession().setAttribute("myUsername", username);
System.out.println( request.getSession().getAttribute("myUsername") );

      return super.dispatchMethod(mapping, form, request, response, name);
    }
    catch(InvalidUserException userExp)
    {
      request.getSession().invalidate();
      if(log.isErrorEnabled())
      {
        log.error("Inconsistant user",userExp);
      }
      throw userExp;
    }
    catch (Throwable throwable) {
      if (log.isFatalEnabled()) {
        NCIUser user = (NCIUser) getSessionObject(request, USER_KEY);

        if (user != null) {
          if(log.isFatalEnabled())
          {
            log.fatal(user.getUsername(), throwable);
          }          
        }
        else
        {
          if(log.isFatalEnabled())
          {
            log.fatal("Null User", throwable);
          }
        }
      }
      saveMessage(ERROR_FATAL, request);
      throw new FatalException(throwable);      
    }
  }
  protected void setApplictionUser(
    String username,
    HttpServletRequest request) {
    NCIUser newuser = getNCIUser(username);
    request.getSession().setAttribute(this.USER_KEY, newuser);
  }
  
    /**This method returns the login user information in NCIUser object
     * */
     protected NCIUser getApplictionUser(HttpServletRequest request){      
      return (NCIUser)(request.getSession().getAttribute(this.USER_KEY));
    }

  protected NCIUser getNCIUser(String username) {
    UserManagerDAO dao = daoFactory.getUserManagerDAO();
    NCIUser user = dao.getNCIUser(username);

    if (log.isInfoEnabled()) {
      log.info("getNCIUser()=" + user);
    }

    return user;
  }

  protected String getLoggedInUsername(HttpServletRequest request) {
    
    String debugLogin = servlet.getInitParameter("debugLogin");
      if(debugLogin!=null&&debugLogin.equalsIgnoreCase("Y"))
      {
        String username =  servlet.getInitParameter("debugUsername");
        log.info("debugUser=" + username);
        return username;
      }
      else
      {
        return request.getRemoteUser();
      }  
  }
  
    public  boolean isFormLocked(String formIdSeq,
                                       String userId) {
        return getApplicationServiceLocator().findLockingService().isFormLocked(formIdSeq, userId);                                   
    }

    public  boolean lockForm(String formIdSeq, NCIUser user, String sessionId) {
       return getApplicationServiceLocator().findLockingService().lockForm(formIdSeq, user, sessionId);
    }

    public  void unlockForm(String formIdSeq,
                                  String userId) {
        getApplicationServiceLocator().findLockingService().unlockForm(formIdSeq, userId);
        return;
    }  
    
    public  void unlockCRFInSession(HttpServletRequest request){
        Form crf = (Form)getSessionObject(request, CRF);
        unlockForm(crf.getIdseq(), request.getRemoteUser());
        return;
    }
    
    public NCIUser getFormLockedBy(String formIdSeq, HttpServletRequest request){
        FormElementLocker locker = getApplicationServiceLocator().findLockingService().getFormLocker(formIdSeq);
        return locker.getNciUser();
    }
    
    protected String getOracleValue(String value) {
    	if (value == null) return null;
    	
    	Codec ORACLE_CODEC = new OracleCodec();
    	return ESAPI.encoder().encodeForSQL(ORACLE_CODEC, value);
    }
    
    protected boolean validate(ActionForm form,
		    HttpServletRequest request,
		    HttpServletResponse response) {
	  
	  List<String> formTypes = (List<String>) request.getSession().getAttribute(FormConstants.ALL_FORM_TYPES);
	  List<String> origFormCategories = (List<String>) request.getSession().getAttribute(FormConstants.ALL_FORM_CATEGORIES);
	  List<String> formCategories = new ArrayList<String>(origFormCategories);
	  formCategories.add("");
	  
	  DynaActionForm dynaForm = (DynaActionForm)form;
	  String formType = (String)dynaForm.get(FORM_TYPE);
	  String formCategory = "";
	  
	  try {
		  formCategory = (String)dynaForm.get(FORM_CATEGORY);
	  } catch (Exception e) {
		  formCategory = (String)dynaForm.get(CATEGORY_NAME);
	  }
	  
	  if (!formTypes.contains(formType)) {
		  log.debug("The form type of the form ["+formType+"] is not one of the standard form types");
		  return false;
	  }
	  
	  if (!formCategories.contains(formCategory)) {
		  log.debug("The form category of the form ["+formCategory+"] is not one of the standard form types");
		  return false;
	  }
	  
	  String frmVer = request.getParameter(FORM_VERSION);
	  if (frmVer != null) {
		  try {
		  Float.parseFloat(frmVer);
		  } catch (Exception e) {
			  log.debug("The version of the form ["+frmVer+"] is not numeric");
			  return false;
		  }
	  }
	  
	  
	  StringBuffer sb = new StringBuffer();
	  //sb.append((String)dynaForm.get(FORM_LONG_NAME));
	  //sb.append((String)dynaForm.get(PREFERRED_DEFINITION));
	  sb.append((String)dynaForm.get(CONTEXT_ID_SEQ));
	  //sb.append((String)dynaForm.get(PROTOCOLS_LOV_NAME_FIELD));
	  sb.append((String)dynaForm.get(PROTOCOLS_LOV_ID_FIELD));
	  //sb.append((String)dynaForm.get(FORM_HEADER_INSTRUCTION));
	  //sb.append((String)dynaForm.get(FORM_FOOTER_INSTRUCTION));
	  
	  String toCheck = sb.toString();
	  
	  char[] restrictedChars = {'\'','\"',';','(',')','*'};
	  
	  if (toCheck != null) {
		  for (char c: restrictedChars) {
			  if (toCheck.indexOf(c) != -1) {
				  log.debug("Either the context or the protocol id is invalid");
				  return false;
			  }
		  }
	  }
	  return true;
  }
    
}
