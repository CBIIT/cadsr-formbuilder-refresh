package gov.nih.nci.ncicb.cadsr.formbuilder.struts.actions;

//import gov.nih.nci.ncicb.cadsr.formbuilder.service.FormBuilderServiceDelegate;
import gov.nih.nci.ncicb.cadsr.common.ProcessConstants;
import gov.nih.nci.ncicb.cadsr.common.formbuilder.common.FormBuilderConstants;
import gov.nih.nci.ncicb.cadsr.common.lov.ClassificationsLOVBean;
import gov.nih.nci.ncicb.cadsr.common.lov.ProtocolsLOVBean;
import gov.nih.nci.ncicb.cadsr.common.resource.Context;
import gov.nih.nci.ncicb.cadsr.common.util.DBUtil;

import java.io.IOException;
import java.util.Collection;
import java.util.Iterator;
import java.util.regex.Pattern;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import org.apache.struts.action.DynaActionForm;


public class FormBuilderLOVAction extends FormBuilderBaseDispatchAction {
	private static final Pattern ALPHA_PATTERN = Pattern.compile("[a-zA-Z]*");
	private static final Pattern ALPHA_NUMERIC_PATTERN = Pattern.compile("[a-zA-Z0-9]*");
	private static final Pattern INT_PATTERN = Pattern.compile("[0-9]*");
	private static final Pattern ID_PATTERN = Pattern.compile("[a-zA-Z0-9-]*");
	private static final Pattern ALPHA_NUMERIC_ARRAY_PATTERN = Pattern.compile("[a-zA-Z0-9\\[\\]]*");
  /**
   * Returns all forms for the given criteria.
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
  public ActionForward getProtocolsLOV(
				       ActionMapping mapping,
				       ActionForm form,
    HttpServletRequest request,
    HttpServletResponse response) throws IOException, ServletException {
	  
	  if (!validate(form, request, response)) {
		  response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Invalid input");
		  return null;
	  }
    //FormBuilderServiceDelegate service = getFormBuilderService();
    DynaActionForm searchForm = (DynaActionForm) form;
    String protocolLongName =
      (String) searchForm.get(this.PROTOCOLS_LOV_PROTO_LONG_NAME);

    String contextIdSeq = request.getParameter(CONTEXT_ID_SEQ);

    String performQuery = request.getParameter(this.PERFORM_QUERY_FIELD);

    request.setAttribute(CONTEXT_ID_SEQ, contextIdSeq);

    String chk = (String)searchForm.get(PROTOCOLS_LOV_CONTEXT_CHECK);

    String[] contexts = null;


    if(chk.equals("true")) {
      Collection coll = (Collection)getSessionObject(request, USER_CONTEXTS);
      contexts = new String[coll.size()];
      int i=0;
      for(Iterator it = coll.iterator(); it.hasNext(); i++)
	contexts[i] = ((Context)it.next()).getConteIdseq();
      request.setAttribute(PROTOCOLS_LOV_CONTEXT_CHECK, chk);
    } else {
      if ((contextIdSeq != null) && (contextIdSeq.length() > 0)) {
	contexts = new String[1];
	contexts[0] = contextIdSeq;
      } else
	contexts = new String[0];
    }


    // build additional query filters
    String additionalWhere = "";
    if(contexts.length > 0)
	additionalWhere +=
	    " and (upper(nvl(proto_conte.conte_idseq,'%')) like upper ( '%" +
	    contexts[0] + "%') ";

    for(int i=1; i<contexts.length; i++) {
      additionalWhere +=
	" or upper(nvl(proto_conte.conte_idseq,'%')) like upper ( '%" +
	contexts[i] + "%') ";
    }
    if(contexts.length > 0)
	additionalWhere += ")";

    DBUtil dbUtil = new DBUtil();
    ProtocolsLOVBean plb;

    try {
//      TabInfoBean tib = new TabInfoBean("cdebrowser_lov_tabs");
//      tib.processRequest(request);
//
//      if (tib.getMainTabNum() != 0) {
//        tib.setMainTabNum(0);
//      }
//      setSessionObject(request, this.PROTOCOLS_LOV_TAB_BEAN, tib);
//      CDEBrowserParams params = CDEBrowserParams.getInstance();
      //String dsName = params.getSbrDSN();
      dbUtil.getConnectionFromContainer(request);

      if (performQuery == null) {
        plb = new ProtocolsLOVBean(request, dbUtil, additionalWhere);
        setSessionObject(request, FormBuilderConstants.PROTOCOLS_LOV_BEAN, plb);
      }
      else {
        plb =
          (ProtocolsLOVBean) getSessionObject(request, FormBuilderConstants.PROTOCOLS_LOV_BEAN);
        plb.getCommonLOVBean().resetRequest(request);
      }
    }
    catch (Exception ex) {
      ex.printStackTrace();
    }
    finally {
      try {
        dbUtil.returnConnection();
      }
      catch (Exception ex) {
        ex.printStackTrace();
      }
    }

    return mapping.findForward(SUCCESS);
  }

  /**
   * Returns all forms for the given criteria.
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
  public ActionForward getClassificationsLOV(
				       ActionMapping mapping,
				       ActionForm form,
    HttpServletRequest request,
    HttpServletResponse response) throws IOException, ServletException {
	  
	  if (!validate(form, request, response)) {
		  response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Invalid input");
	  }
	  
    //FormBuilderServiceDelegate service = getFormBuilderService();
    DynaActionForm searchForm = (DynaActionForm) form;
    DBUtil dbUtil = new DBUtil();

    try {
        String contextIdSeq = request.getParameter(CONTEXT_ID_SEQ);
        request.setAttribute(CONTEXT_ID_SEQ, contextIdSeq);
        String performQuery = request.getParameter("performQuery");
        String chk = (String)searchForm.get("chkContext");
        ClassificationsLOVBean clb;

//	    TabInfoBean tib = new TabInfoBean("cdebrowser_lov_tabs");
//	    tib.processRequest(request);
//	
//	    if (tib.getMainTabNum() != 0) {
//	        tib.setMainTabNum(0);
//	    }
//	    setSessionObject(request, "tib", tib);
	
	    dbUtil.getConnectionFromContainer(request);
	    if (performQuery == null) {
	    	  clb = new ClassificationsLOVBean(request, dbUtil, chk, contextIdSeq);
	        setSessionObject(request, ProcessConstants.CS_LOV, clb);
	    }
	    else {
	    	  clb =
	          (ClassificationsLOVBean) getSessionObject(request, ProcessConstants.CS_LOV);
	    	  clb.getCommonLOVBean().resetRequest(request);
	    }
    }
    catch (Exception ex) {
      ex.printStackTrace();
    }
    finally {
      try {
        dbUtil.returnConnection();
      }
      catch (Exception ex) {
        ex.printStackTrace();
      }
    }

    return mapping.findForward(SUCCESS);
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
    return mapping.findForward(DEFAULT_HOME);
  }
  
  private boolean validate(ActionForm form,
    HttpServletRequest request,
    HttpServletResponse response) {
	  String[] searchStrs = (String[])request.getParameterValues("SEARCH");
	  String nameVar = request.getParameter("nameVar");
	  String pageId = request.getParameter("PageId");
	  String idVar = request.getParameter("idVar");
	  String classificationsLOV = request.getParameter("classificationsLOV");
	  String contextIdSeq = request.getParameter("contextIdSeq");
	  String performQuery = request.getParameter("performQuery");
	  
	  DynaActionForm searchForm = (DynaActionForm) form;
	  String ckhContext = (String)searchForm.get(PROTOCOLS_LOV_CONTEXT_CHECK);

	  boolean valid = true;
	  
	  if (searchStrs != null) { 
		  for (String searchStr: searchStrs) {
			  if (!searchStr.trim().equals("")) {
				  valid = Pattern.matches("[a-zA-Z0-9.*-_]*", searchStr);
			  }
			  if (!valid) {
				  break;
			  }
		  }
		  
	  }
	  if (nameVar != null && valid) {
		  valid = ALPHA_NUMERIC_PATTERN.matcher(nameVar).matches();
	  }
	  if (pageId != null && valid) {
		  valid = ALPHA_PATTERN.matcher(pageId).matches();
	  }
	  if (idVar != null && valid) {
		  valid = ALPHA_NUMERIC_ARRAY_PATTERN.matcher(idVar).matches();
	  }
	  if (classificationsLOV != null && valid) {
		  valid = INT_PATTERN.matcher(classificationsLOV).matches();
	  }
	  if (contextIdSeq != null && valid) {
		  valid = ID_PATTERN.matcher(contextIdSeq).matches();
	  }
	  if (performQuery != null && valid) {
		  valid = ALPHA_PATTERN.matcher(performQuery).matches();
	  }
	  if (ckhContext != null && valid) {
		  valid = ALPHA_PATTERN.matcher(ckhContext).matches();
	  }
	  
	  return valid;
  }
}
