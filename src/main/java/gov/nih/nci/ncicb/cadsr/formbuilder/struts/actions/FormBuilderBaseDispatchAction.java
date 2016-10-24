package gov.nih.nci.ncicb.cadsr.formbuilder.struts.actions;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.Iterator;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.struts.Globals;
import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import org.apache.struts.action.ActionMessage;
import org.apache.struts.action.ActionMessages;
import org.apache.struts.action.DynaActionForm;
import org.springframework.context.ApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import gov.nih.nci.ncicb.cadsr.common.CaDSRConstants;
import gov.nih.nci.ncicb.cadsr.common.cdebrowser.DataElementSearchBean;
import gov.nih.nci.ncicb.cadsr.common.exception.FatalException;
import gov.nih.nci.ncicb.cadsr.common.formbuilder.common.FormBuilderConstants;
import gov.nih.nci.ncicb.cadsr.common.formbuilder.struts.common.FormConstants;
import gov.nih.nci.ncicb.cadsr.common.formbuilder.struts.common.NavigationConstants;
import gov.nih.nci.ncicb.cadsr.common.resource.Context;
import gov.nih.nci.ncicb.cadsr.common.resource.Form;
import gov.nih.nci.ncicb.cadsr.common.resource.NCIUser;
import gov.nih.nci.ncicb.cadsr.common.struts.common.BaseDispatchAction;
import gov.nih.nci.ncicb.cadsr.formbuilder.common.FormBuilderException;
import gov.nih.nci.ncicb.cadsr.formbuilder.ejb.impl.FormBuilderServiceImpl;
import gov.nih.nci.ncicb.cadsr.formbuilder.ejb.service.FormBuilderService;
import gov.nih.nci.ncicb.cadsr.formbuilder.struts.common.FormBuilderUtil;


/**
 * Base DispatchAction for all formbuilder DispatchActions
 */
public class FormBuilderBaseDispatchAction extends BaseDispatchAction
   implements FormConstants, NavigationConstants,FormBuilderConstants
   {
  protected static Log log = LogFactory.getLog(FormBuilderBaseDispatchAction.class.getName());

  private FormBuilderService formBuilderService;
  
  public FormBuilderService getFormBuilderService(HttpServletRequest request) {
	  if (formBuilderService == null)
	  {
		  ApplicationContext context =  WebApplicationContextUtils.getWebApplicationContext(request.getSession().getServletContext());
		  formBuilderService = (FormBuilderService) context.getBean("formBuilderService");
	  }
	  return formBuilderService;
  }

  public void setFormBuilderService(FormBuilderService formBuilderService) {
	  this.formBuilderService = formBuilderService;
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
   * Remove a session object based on the request and the attribute name.
   */
  protected void removeSessionObject(
    HttpServletRequest req,
    String attrName) {
    HttpSession session = req.getSession(false);

    if (session != null) {
      session.removeAttribute(attrName);
    }
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

  /**
   * Add an object to session based on the request and the attribute name.
   * Reset praram label the attribute to be removed when logged out or system
   * error
   */
  protected void setSessionObject(
    HttpServletRequest req,
    String attrName,
    Object sessionObject,
    boolean clear) {
    HttpSession session = req.getSession(false);

    if (session != null) {
      session.setAttribute(attrName, sessionObject);

      if (clear) {
        setObjectsForClear(session,attrName);
      }
      else {
        setSessionObject(req, attrName, sessionObject);
      }
    }
  }

  /**
   * Gets the ServiceDelegateFactory form the application scope and
   * instantiates a FormBuilderServiceDelegate from the factory
   *
   * @return FormBuilderServiceDelegate
   *
   * @throws ServiceStartupException
   */
  //Service will be injected through Spring
  /*protected FormBuilderServiceDelegate getFormBuilderService()
    throws ServiceStartupException {
    FormBuilderServiceDelegate svcDelegate = null;
    ServiceDelegateFactory svcFactory =
      (ServiceDelegateFactory) getApplicationObject(
        FormBuilderConstants.SERVICE_DELEGATE_FACTORY_KEY);
    //svcDelegate = svcFactory.createService();
    svcDelegate = svcFactory.findService();

    return svcDelegate;
  }*/

  /**
   * Initializes the lookupvalues(contexts,categories,workflows into session)
   *
   * @return ActionForward
   *
   * @throws Exception
   */
  protected void setInitLookupValues(HttpServletRequest req) {
    Object obj = getSessionObject(req, ALL_CONTEXTS);    
    if (obj == null)
    	getExcludedContexts(req, null);

    obj = getSessionObject(req, ALL_WORKFLOWS);
    if (obj == null) {
      Collection workflows =
        formBuilderService.getStatusesForACType(FORM_ADMIN_COMPONENT_TYPE);
      setSessionObject(req, ALL_WORKFLOWS, workflows);
    }

    obj = getSessionObject(req, ALL_FORM_CATEGORIES);

    if (obj == null) {
      Collection categories = getFormBuilderService(req).getAllFormCategories();
      setSessionObject(req, ALL_FORM_CATEGORIES, categories);
    }
    
    obj = getSessionObject(req, ALL_REFDOC_TYPES);

    if (obj == null) {
      Collection refDocTypes = getFormBuilderService(req).getAllDocumentTypes();
      setSessionObject(req, ALL_REFDOC_TYPES, refDocTypes);
    }
    

    obj = getSessionObject(req, ALL_FORM_TYPES);

    if (obj == null) {
      Collection types = Arrays.asList(FORM_TYPE_VALUES);
      setSessionObject(req, ALL_FORM_TYPES, types);
    }

    obj = getSessionObject(req, USER_CONTEXTS);

    if (obj == null) {
      NCIUser nciUser = (NCIUser) getSessionObject(req, USER_KEY);
      //Change order Context Admin Check
      Collection contexts =nciUser.getContextsByRoleAccess(CDE_MANAGER);
      setSessionObject(req, USER_CONTEXTS, contexts);
    }
   
    //Set the forms to be cleared if logedout or syserror
    setObjectsForClear(req.getSession(),"searchForm");
    setObjectsForClear(req.getSession(),"moduleEditForm");
    setObjectsForClear(req.getSession(),"formEditForm");

  }

  private DataElementSearchBean initSearchPreferences(HttpServletRequest request)
  {
      DataElementSearchBean searchBean = new DataElementSearchBean();
      searchBean.initDefaultContextPreferences();
      setSessionObject(request,"desb", searchBean);
  	  return searchBean;  	  
  }
  
  public void getExcludedContexts(HttpServletRequest request, DataElementSearchBean excludeBean)
  {
	  if (excludeBean == null)
		  excludeBean = initSearchPreferences(request);
	  String excludeList = excludeBean.getExcludeContextList();
	  //get all contexts from the database
	  Collection<Context> contexts = getFormBuilderService(request).getAllContexts();
	  if (!excludeList.equals(""))
	  {
		  Collection<Context> exContexts = new ArrayList<Context>();
	      for (Context context: contexts) {
	          // if this context is not excluded by user preference
	          if (excludeList.contains(context.getName()))
	        	  exContexts.add(context);
	      }
	      if (!exContexts.isEmpty())
	    	  contexts.removeAll(exContexts);
	  }	  
	  setSessionObject(request,this.ALL_CONTEXTS, contexts);
  }
  
  /**
   * If a iconForm(DynaForm) exist then get the FormDetails for the formIdSeq
   * is retrived.
   *
   * @param form The optional ActionForm bean for this request.
   * @param request The HTTP Request we are processing.
   */
  protected Form setFormForAction(
    ActionForm form,
    HttpServletRequest request) throws FormBuilderException {
    FormBuilderService service = getFormBuilderService(request);
    DynaActionForm hrefCRFForm = (DynaActionForm) form;
    Form crf = null;

    String showCached = (String)request.getAttribute("showCached");

    if(showCached!=null&&showCached.equalsIgnoreCase(CaDSRConstants.YES))
    {
      crf = (Form) getSessionObject(request, CRF);
    }
    else if (hrefCRFForm != null) {
      String formIdSeq = (String) hrefCRFForm.get(FORM_ID_SEQ);
      
      if (!FormBuilderUtil.validateIdSeqRequestParameter(formIdSeq))
    	  throw new FatalException("Invalid formId parameters.", new Exception("Invalid formId parameters."));
		
      //Added to support tree
      if ("".equals(formIdSeq)) {
        formIdSeq = request.getParameter("P_IDSEQ");
        if (formIdSeq==null || formIdSeq.length() == 0){        
            formIdSeq = (String)request.getAttribute("P_IDSEQ");
        }    
        hrefCRFForm.set(FORM_ID_SEQ,formIdSeq);
      }
      if ((formIdSeq != null) && (formIdSeq.length() > 0)) {
        crf = service.getFormDetails(formIdSeq);
        setSessionObject(request, CRF, crf);
      }
      else {
        crf = (Form) getSessionObject(request, CRF);
      }
       // end of else
    }

    return crf;
  }


  protected void saveMessage(
    String key,
    HttpServletRequest request) {
    if (key != null) {
      ActionMessage message = new ActionMessage(key);
      ActionMessages messages = null;
      messages = (ActionMessages)request.getAttribute(Globals.MESSAGE_KEY);
      if(messages==null)
        messages = new ActionMessages();

      messages.add(messages.GLOBAL_MESSAGE, message);
      saveMessages(request, messages);
    }
  }
  
    protected void saveMessage(
      String key,
      HttpServletRequest request, String arg0) {
      if (key != null) {
        ActionMessage message = new ActionMessage(key,arg0);
        ActionMessages messages = null;
        messages = (ActionMessages)request.getAttribute(Globals.MESSAGE_KEY);
        if(messages==null)
          messages = new ActionMessages();

        messages.add(messages.GLOBAL_MESSAGE, message);
        saveMessages(request, messages);
      }
    }
    
    protected void saveMessage(
      String key,
      HttpServletRequest request, String arg0, String arg1) {
      if (key != null) {
        ActionMessage message = new ActionMessage(key,arg0, arg1);
        ActionMessages messages = null;
        messages = (ActionMessages)request.getAttribute(Globals.MESSAGE_KEY);
        if(messages==null)
          messages = new ActionMessages();

        messages.add(messages.GLOBAL_MESSAGE, message);
        saveMessages(request, messages);
      }
    }    

  /**
   * This Action forwards to the default formbuilder home.
   *
   * @param mapping The ActionMapping used to select this instance.
   * @param form The optional ActionForm bean for this request.
   * @param request The HTTP Request we are processing.
   * @param response The HTTP Response we are processing.
   *
   * @return
   *
   * @throws IOException
   * @throws ServletException
   */
  public ActionForward sendHome(
    ActionMapping mapping,
    ActionForm form,
    HttpServletRequest request,
    HttpServletResponse response) throws IOException, ServletException {
    setInitLookupValues(request);

    return mapping.findForward(DEFAULT_HOME);
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
    if ((name == null) || name.equals("")) {
      name = DEFAULT_METHOD;
    }

    try {
      return super.dispatchMethod(mapping, form, request, response, name);
    }
    catch (Throwable throwable) {
      HttpSession session = request.getSession();
      String userName = request.getRemoteUser();
      if(userName==null)
        userName="";
      Collection keys = (Collection)session.getAttribute(this.CLEAR_SESSION_KEYS);
      if(keys!=null)
      {
        Iterator it  = keys.iterator();
        while(it.hasNext())
        {
          session.removeAttribute((String)it.next());
        }
      }
      if(log.isFatalEnabled())
      {
        log.fatal(userName+": Exception in dispatchMethod in method "+name,throwable);
      }
      saveMessage(ERROR_FATAL, request);
      throw new FatalException(throwable);
    }
  }
  /**
   * Used by the action to check if a input form field has a value
   * @param str
   * @return
   */
  protected boolean hasValue(String str)
  {
    if(str==null)
      return false;
    if(str.equals(""))
      return false;
    return true;
  }
  
  private void setObjectsForClear(HttpSession session, String attrName)
  {
        Collection keys =
          (Collection) session.getAttribute(
            FormBuilderConstants.CLEAR_SESSION_KEYS);

        if (keys == null) {
          keys = new ArrayList();
        }

        keys.add(attrName);
        session.setAttribute(FormBuilderConstants.CLEAR_SESSION_KEYS, keys);

  }
  
  public void logSessionData(String action, String form, HttpSession session){
	  log.info("============ action " + action + " form " + form);
	  ArrayList<String> names = Collections.list(session.getAttributeNames());
	  for (String name : names) 
		  log.info(name);
	  log.info("============ *** ======== " + form);	  
  }
}
