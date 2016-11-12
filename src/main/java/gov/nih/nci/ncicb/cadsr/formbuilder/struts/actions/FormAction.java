package gov.nih.nci.ncicb.cadsr.formbuilder.struts.actions;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.ListIterator;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.struts.Globals;
import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import org.apache.struts.action.ActionMessage;
import org.apache.struts.action.ActionMessages;
import org.apache.struts.action.DynaActionForm;

import gov.nih.nci.ncicb.cadsr.common.CaDSRConstants;
import gov.nih.nci.ncicb.cadsr.common.cdebrowser.DataElementSearchBean;
import gov.nih.nci.ncicb.cadsr.common.dto.FormTransferObject;
import gov.nih.nci.ncicb.cadsr.common.dto.FormV2TransferObject;
import gov.nih.nci.ncicb.cadsr.common.exception.FatalException;
import gov.nih.nci.ncicb.cadsr.common.formbuilder.struts.common.FormConstants;
import gov.nih.nci.ncicb.cadsr.common.jsp.bean.PaginationBean;
import gov.nih.nci.ncicb.cadsr.common.resource.Context;
import gov.nih.nci.ncicb.cadsr.common.resource.Form;
import gov.nih.nci.ncicb.cadsr.common.resource.FormV2;
import gov.nih.nci.ncicb.cadsr.common.resource.NCIUser;
import gov.nih.nci.ncicb.cadsr.common.struts.formbeans.GenericDynaFormBean;
import gov.nih.nci.ncicb.cadsr.common.util.StringPropertyComparator;
import gov.nih.nci.ncicb.cadsr.common.util.StringUtils;
import gov.nih.nci.ncicb.cadsr.formbuilder.common.FormBuilderException;
import gov.nih.nci.ncicb.cadsr.formbuilder.common.FormCartOptionsUtil;
import gov.nih.nci.ncicb.cadsr.formbuilder.ejb.service.FormBuilderService;
import gov.nih.nci.ncicb.cadsr.formbuilder.struts.actions.cadsrutil_ext.CDECartOCImplExtension;
import gov.nih.nci.ncicb.cadsr.formbuilder.struts.actions.cadsrutil_ext.FormDisplayCartOCIImpl;
import gov.nih.nci.ncicb.cadsr.formbuilder.struts.common.FormBuilderUtil;
import gov.nih.nci.ncicb.cadsr.formbuilder.struts.common.FormConverterUtil;
import gov.nih.nci.ncicb.cadsr.objectCart.CDECart;
import gov.nih.nci.ncicb.cadsr.objectCart.FormDisplayCartTransferObject;
import gov.nih.nci.objectCart.domain.CartObject;


public class FormAction extends FormBuilderSecureBaseDispatchActionWithCarts {

    /**
     * set a session object.
     * @param mapping
     * @param form
     * @param request
     * @param response
     * @param name
     * @return
     * @throws Exception
     */
    protected ActionForward dispatchMethod(
      ActionMapping mapping,
      ActionForm form,
      HttpServletRequest request,
      HttpServletResponse response,
      String name) throws Exception {
          ActionForward forward = super.dispatchMethod(mapping, form, request, response, name);
          request.getSession().setAttribute("Initialized", "true");
      return forward;
      } 
    
    public static boolean isHtmlAndScriptClean( List<String> s)
    {
    	for( String str: s )
    	{
    		if(str != null && str.matches( "^.*(%|<|>).*$" ))
    		{
    			return false;
    		}
    	}
    	return true;
    }

    public boolean isValidParmeter(DynaActionForm searchForm)
    {
    	List<String> strList = new ArrayList<String>();
    	strList.add((String) searchForm.get(SEARCH_FORM_NAME));
    	strList.add((String) searchForm.get(SEARCH_PROTO_IDSEQ));
    	strList.add((String)searchForm.get(PROTOCOLS_LOV_NAME_FIELD));
    	strList.add((String) searchForm.get(SEARCH_CONTEXT_IDSEQ));
    	strList.add((String) searchForm.get(SEARCH_WORKFLOW));
    	strList.add((String) searchForm.get(SEARCH_CATEGORY_NAME));
    	strList.add((String) searchForm.get(SEARCH_FORM_TYPE));
    	strList.add((String) searchForm.get(CS_CSI_ID));
    	strList.add((String) searchForm.get(CS_ID));
    	strList.add((String)searchForm.get(SEARCH_FORM_PUBLICID));
    	strList.add((String)searchForm.get(LATEST_VERSION_INDICATOR));
    	strList.add((String)searchForm.get(MODULE_LONG_NAME));
    	strList.add((String)searchForm.get(CDE_PUBLIC_ID)); 
    	boolean isValid = isHtmlAndScriptClean(strList);
    	
    	return isValid;
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
  public ActionForward getAllForms(
    ActionMapping mapping,
    ActionForm form,
    HttpServletRequest request,
    HttpServletResponse response) throws IOException, ServletException {
	//this.logSessionData("getAllForms ", form.toString(), request.getSession());
    //Set the lookup values in the session
    setInitLookupValues(request);

    FormBuilderService service = getFormBuilderService(request);
    DynaActionForm searchForm = (DynaActionForm) form;
    String formLongName = (String) searchForm.get(SEARCH_FORM_NAME);
    String protocolIdSeq = (String) searchForm.get(SEARCH_PROTO_IDSEQ);
    String proptocolName = (String)searchForm.get(PROTOCOLS_LOV_NAME_FIELD);
    String contextIdSeq = (String) searchForm.get(SEARCH_CONTEXT_IDSEQ);
    String workflow = (String) searchForm.get(SEARCH_WORKFLOW);
    String categoryName = (String) searchForm.get(SEARCH_CATEGORY_NAME);
    String type = (String) searchForm.get(SEARCH_FORM_TYPE);
    String csCsiIdSeq = (String) searchForm.get(CS_CSI_ID);
    String csIdseq = (String) searchForm.get(CS_ID);
    String publicId = (String)searchForm.get(SEARCH_FORM_PUBLICID);
    String version = (String)searchForm.get(LATEST_VERSION_INDICATOR);
    String moduleLongName = (String)searchForm.get(MODULE_LONG_NAME);
    String cdePublicId = (String)searchForm.get(CDE_PUBLIC_ID); 

    if (!isValidParmeter(searchForm))
    	throw new FatalException("Invalid search parameters.", new Exception("Invalid search parameters"));
   //Set the Context Name
   
   List contexts = (List)this.getSessionObject(request,ALL_CONTEXTS);
   Context currContext = getContextForId(contexts,contextIdSeq);
   if(currContext!=null)
    searchForm.set(SEARCH_CONTEXT_NAME,currContext.getName());
   
   Collection forms = null;
   String nodeType = request.getParameter("P_PARAM_TYPE");
    if(nodeType!=null&&nodeType.equals("CLASSIFICATION"))
    {
      forms = service.getAllFormsForClassification(csIdseq);
    }
    else if(nodeType!=null&&nodeType.equals("PUBLISHING_PROTOCOL"))
    {
      forms = service.getAllPublishedFormsForProtocol(protocolIdSeq);
    }
    else
    {
    	String exContexts = "";    	
    	DataElementSearchBean searchBean  = (DataElementSearchBean)getSessionObject(request,"desb");
    	if (searchBean != null)
    		exContexts = searchBean.getExcludeContextList();  //this.getExcludeList(searchBean);
    	
    forms =
      service.getAllForms(
        formLongName, protocolIdSeq, contextIdSeq, workflow, categoryName, type,
        csCsiIdSeq,
        publicId, version, moduleLongName,cdePublicId,
        (NCIUser)getSessionObject(request,this.USER_KEY), exContexts);
    }
    setSessionObject(request, this.FORM_SEARCH_RESULTS, forms,true);    
    //Initialize and add the PagenationBean to the Session
    PaginationBean pb = new PaginationBean();

    if (forms != null) {
      pb.setListSize(forms.size());
    }
    Form aForm = null;
    if(forms.size()>0)
    {
      Object[] formArr = forms.toArray();
      aForm=(Form)formArr[0];
      StringPropertyComparator comparator = new StringPropertyComparator(aForm.getClass());
      comparator.setPrimary("longName");
      comparator.setOrder(comparator.ASCENDING);
      Collections.sort((List)forms,comparator);
      setSessionObject(request,FORM_SEARCH_RESULT_COMPARATOR,comparator);      
    }
      
    setSessionObject(request, FORM_SEARCH_RESULTS_PAGINATION, pb,true);
    setSessionObject(request, ANCHOR, "results",true); 
    
	//this.logSessionData("getAllForms ", form.toString(), request.getSession());   
    return mapping.findForward(SUCCESS);
  }

  /**
   * Clear the cache for a new search.
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
  public ActionForward newSearch(
    ActionMapping mapping,
    ActionForm form,
    HttpServletRequest request,
    HttpServletResponse response) throws IOException, ServletException {
    //Set the lookup values in the session
    setInitLookupValues(request);
    DynaActionForm searchForm = (DynaActionForm) form;
    GenericDynaFormBean formBean  = (GenericDynaFormBean)form;
    formBean.clear();
    removeSessionObject(request, this.FORM_SEARCH_RESULTS);
    removeSessionObject(request, this.FORM_SEARCH_RESULTS_PAGINATION);
    return mapping.findForward(SUCCESS);
  }
  
    /**
   * Sorts search results by fieldName
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
  public ActionForward sortResult(
    ActionMapping mapping,
    ActionForm form,
    HttpServletRequest request,
    HttpServletResponse response) throws IOException, ServletException {
    //Set the lookup values in the session
    setInitLookupValues(request);
    DynaActionForm searchForm = (DynaActionForm) form;
    String sortField = (String) searchForm.get("sortField");
    Integer sortOrder = (Integer) searchForm.get("sortOrder");
    
    List<String> strList = new ArrayList<String>();
    strList.add(sortField);
    if (!isHtmlAndScriptClean(strList))
    	throw new FatalException("Invalid sortField parameter.", new Exception("Invalid sortField parameter"));
    	
    List forms = (List)getSessionObject(request,FORM_SEARCH_RESULTS);
    StringPropertyComparator comparator = (StringPropertyComparator)getSessionObject(request,FORM_SEARCH_RESULT_COMPARATOR);
    comparator.setRelativePrimary(sortField);
    comparator.setOrder(sortOrder.intValue());
    //Initialize and add the PagenationBean to the Session
    PaginationBean pb = new PaginationBean();
    if (forms != null) {
      pb.setListSize(forms.size());
    }
    Collections.sort(forms,comparator);
    setSessionObject(request, FORM_SEARCH_RESULTS_PAGINATION, pb,true);
    setSessionObject(request, ANCHOR, "results",true);  
    return mapping.findForward(SUCCESS);
  }
  
  /**
   * Sets the parameters into a map. This action method need to called before
   * forwarding framed jsps since each frame has its own request object.
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
  public ActionForward initMessageKeys(
    ActionMapping mapping,
    ActionForm form,
    HttpServletRequest request,
    HttpServletResponse response) throws IOException, ServletException {
    Enumeration names = request.getAttributeNames();
    Map params = new HashMap();
    ActionMessages messages =
      (ActionMessages) request.getAttribute(Globals.MESSAGE_KEY);

  //  ActionErrors errors =
  //    (ActionErrors) request.getAttribute(Globals.ERROR_KEY);

    if ((messages != null) && !messages.isEmpty()) {
      Iterator mesgIt = messages.get(ActionMessages.GLOBAL_MESSAGE);
      StringBuffer strBuff = new StringBuffer();

      while (mesgIt.hasNext()) {
        ActionMessage mesg = (ActionMessage) mesgIt.next();
        strBuff.append(mesg.getKey());

        if (mesgIt.hasNext()) {
          strBuff.append(",");
        }
      }      
     params.put(ActionMessages.GLOBAL_MESSAGE, strBuff.toString());
    }
 /*   if ((errors != null) && !errors.isEmpty()) {
      Iterator errorIt = errors.get(ActionErrors.GLOBAL_MESSAGE);
      StringBuffer strBuff = new StringBuffer();

      while (errorIt.hasNext()) {
        ActionMessage error = (ActionMessage)errorIt.next();
        strBuff.append(error.getKey());

        if (errorIt.hasNext()) {
          strBuff.append(",");
        }
      }      

      params.put(ActionErrors.GLOBAL_MESSAGE, strBuff.toString());
    }
    */
    request.setAttribute("requestMap", params);

    return mapping.findForward(SUCCESS);
  }

  /**
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
  public ActionForward setMessagesFormKeys(
    ActionMapping mapping,
    ActionForm form,
    HttpServletRequest request,
    HttpServletResponse response) throws IOException, ServletException {

    Map params = new HashMap();
    String stringMessages = request.getParameter(ActionMessages.GLOBAL_MESSAGE);
    if ((stringMessages != null) && !stringMessages.equals("")) {
      String[] mesgArr = StringUtils.tokenizeCSVList(stringMessages);
  
      for (int i = 0; i < mesgArr.length; i++) {
        this.saveMessage(mesgArr[i], request);
        log.debug(" message " + mesgArr[i]);
      }
    }
/*
    String stringErrors = request.getParameter(ActionErrors.GLOBAL_MESSAGE);
    if ((stringErrors != null) && !stringErrors.equals("")) {
      String[] errorArr = StringUtils.tokenizeCSVList(stringErrors);
  
      for (int i = 0; i < errorArr.length; i++) {
        this.saveMessage(errorArr[i], request);
        log.debug(" error " + errorArr[i]);
      }
    }
*/
    return mapping.findForward(SUCCESS);
  }

  /**
   * Returns Complete form given an Id.
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
  public ActionForward getFormDetails(
    ActionMapping mapping,
    ActionForm form,
    HttpServletRequest request,
    HttpServletResponse response) throws IOException, ServletException {
    setInitLookupValues(request);
    try {
       Object displayOrderToCopy = getSessionObject(request,MODULE_DISPLAY_ORDER_TO_COPY);
       
       if (displayOrderToCopy != null) {
          return mapping.findForward("setModuleCopyForm");
       }
      setFormForAction(form, request);

    }
    catch (FormBuilderException exp) {
      if (log.isErrorEnabled()) {
        log.error("Exception getting CRF", exp);
      }      
      saveMessage(ERROR_FORM_RETRIEVE, request);
      saveMessage(ERROR_FORM_DOES_NOT_EXIST, request);
      return mapping.findForward(FAILURE);
    }

    return mapping.findForward(SUCCESS);
  }

  /**
   * Returns Complete form given an Id for Copy.
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
  public ActionForward getPrinterVersion(
    ActionMapping mapping,
    ActionForm form,
    HttpServletRequest request,
    HttpServletResponse response) throws IOException, ServletException {
    try {
      Form crf = (Form) this.getSessionObject(request, CRF);

      if (form == null) {
        setFormForAction(form, request);
      }
    }
    catch (FormBuilderException exp) {
      saveMessage(ERROR_FORM_RETRIEVE, request);
      saveMessage(ERROR_FORM_DOES_NOT_EXIST, request);
      if (log.isErrorEnabled()) {
        log.error("Exception on getFormForEdit ", exp);
      }
    }

    return mapping.findForward(SUCCESS);
  }

  /**
   * Returns all forms for the search criteria specified by clicking on a tree
   * node.
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
  public ActionForward getAllFormsForTreeNode(
    ActionMapping mapping,
    ActionForm form,
    HttpServletRequest request,
    HttpServletResponse response) throws IOException, ServletException {
    String protocolIdSeq = "";
    String protocolLongName = "";
    String formIdSeq = "";
    String csCsiIdSeq = "";
    String csIdseq = "";    
    String nodeType = request.getParameter("P_PARAM_TYPE");
    String nodeIdSeq = request.getParameter("P_IDSEQ");
    String contextIdSeq = request.getParameter("P_CONTE_IDSEQ");
    if (contextIdSeq == null) contextIdSeq = "";
    String csiName = "";

    if (!FormBuilderUtil.validateIdSeqRequestParameter(nodeIdSeq) || !FormBuilderUtil.validateIdSeqRequestParameter(contextIdSeq))
    	throw new FatalException("Invalid nodeId/contextId parameters.", new Exception("Invalid nodeId/contextId parameters."));
    	
    
    if ("PROTOCOL".equals(nodeType)||"PUBLISHING_PROTOCOL".equals(nodeType)) {
      protocolIdSeq = nodeIdSeq;
      protocolLongName = request.getParameter("protocolLongName");
    }
    else if ("CRF".equals(nodeType) || "TEMPLATE".equals(nodeType))
      formIdSeq = nodeIdSeq;
    else if ("CSI".equals(nodeType)) {
      csCsiIdSeq = nodeIdSeq;
      csiName = request.getParameter("csiName");
      //Publishing Change Order
      contextIdSeq = "";
    }
    //Publish Change Order
    else if("CLASSIFICATION".equals(nodeType))
    {
      csIdseq=nodeIdSeq;
      contextIdSeq = "";
    }

    GenericDynaFormBean searchForm = (GenericDynaFormBean) form;
    searchForm.clear();
    searchForm.set(this.SEARCH_PROTO_IDSEQ, protocolIdSeq);
    searchForm.set(this.PROTOCOLS_LOV_NAME_FIELD, protocolLongName);
    searchForm.set(this.SEARCH_CONTEXT_IDSEQ, contextIdSeq);
    searchForm.set(this.FORM_ID_SEQ,formIdSeq);
    searchForm.set("jspClassification",csCsiIdSeq);
    searchForm.set("txtClassSchemeItem",csiName);
    //Publish Change Order
    searchForm.set(this.CS_ID,nodeIdSeq);
    
    setSessionObject(request, ANCHOR, "results",true);  
    
    if ("CRF".equals(nodeType) || "TEMPLATE".equals(nodeType))
      return this.getFormDetails(mapping, form, request, response);
    else
      return this.getAllForms(mapping, form, request, response);
      
    
  }
  
  /**
   * Clear the screen for a new Search
   * Clears the struts form and also the resultSet of the previous search
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
  public ActionForward clearFormSearch(
    ActionMapping mapping,
    ActionForm form,
    HttpServletRequest request,
    HttpServletResponse response) throws IOException, ServletException {
    
    GenericDynaFormBean formBean  = (GenericDynaFormBean)form;
    formBean.clear();
    formBean.set(FormConstants.LATEST_VERSION_INDICATOR, FormConstants.LATEST_VERSION);  //default 
    removeSessionObject(request,FORM_SEARCH_RESULTS);
    return mapping.findForward(SUCCESS);
    }
  
	public ActionForward saveFormInQueue(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws IOException, ServletException {
		
		   FormBuilderService service = getFormBuilderService(request);
		   CDECartOCImplExtension sessionCartV2 = (CDECartOCImplExtension) this
					.getSessionObject(request, CaDSRConstants.FORMS_CART_V2);
		   Collection selectedSaveItems = sessionCartV2.getFormCartV2().values();
		   int formsInQueue = 0;
		   
		    try {  	
				if (FormCartOptionsUtil.instance().writeInV1Format()) {
					Collection itemsToMerge = new ArrayList();
					CDECart sessionCart = (CDECart) this.getSessionObject(request,
							CaDSRConstants.FORMS_CART);
					
					if (selectedSaveItems != null) {
						for (Object version2Form : selectedSaveItems) {
							Form crf = service.getFormDetails(((FormV2TransferObject)version2Form).getFormIdseq());
							log.debug("adding V1 form objects to cart (No Save)");
							itemsToMerge.add(crf);
						}
						log.debug("merging V1 form objects");
						sessionCart.mergeElements(itemsToMerge);
						log.debug("done merging V1 form objects");
					}
					this.setSessionObject(request, CaDSRConstants.FORMS_CART, sessionCart);
				}

				if (true) { // we always write the formCartV2 cart now
					log.debug("Starting new add-to-cart - creating objects");
					Collection itemsToRemove = new ArrayList();
					Collection itemsToAdd = new ArrayList();
					
					if (selectedSaveItems != null) {
						for (Object version2Form : selectedSaveItems) {
							itemsToRemove.add(((FormV2TransferObject)version2Form).getFormIdseq());
							FormV2 crf = service.getFormDetailsV2(((FormV2TransferObject)version2Form).getFormIdseq());
							itemsToAdd.add(translateCartObject((FormV2) crf));
						}
	
						// remove from cart before adding (so that we'll update), removing non-existent doesn't hurt
						// (wonder if that is really needed)
						log.debug("removing re-used objects");
						sessionCartV2.removeDataElements(itemsToRemove);
						// (removeDataElements works on native id and doesn't care
						// about element type)
						log.debug("adding new objects");
						sessionCartV2.addObjectCollection(itemsToAdd);
						log.debug("done");
						
						// Remove the saved forms from cart in memory
						formsInQueue = sessionCartV2.getFormCartV2().size();
						selectedSaveItems.clear();
						sessionCartV2.clearFormV2();
					}
					this.setSessionObject(request, CaDSRConstants.FORMS_CART_V2, sessionCartV2);
				}
			//// GF32932  D.An, 20130825.    
			      request.getSession().setAttribute("myFormCartInfo", new Integer(formsInQueue).toString());
System.out.println( "Forms Queued in Cart : " + request.getSession().getAttribute("myFormCartInfo") );
			      saveMessage("cadsr.common.formqueue.save.success",request, new Integer(formsInQueue).toString());
			      //saveMessage("cadsr.common.formqueue.save.success",request);

				}
		    catch (Exception exp) {
		        if (log.isErrorEnabled()) {
		          log.error("Exception on addItems " , exp);
		        }
		      }
		    


		return mapping.findForward("success");
	}
  
	public FormDisplayCartTransferObject convertToDisplayItem(FormV2 crf)
	{
		FormDisplayCartTransferObject displayObject = new FormDisplayCartTransferObject();
		displayObject.setAslName(crf.getAslName());
		displayObject.setContextName(crf.getContext().getName());
		displayObject.setFormType(crf.getFormType());
		displayObject.setIdseq(crf.getIdseq());
		displayObject.setLongName(crf.getLongName());
		displayObject.setProtocols(crf.getProtocols());
		displayObject.setPublicId(crf.getPublicId());
		displayObject.setVersion(crf.getVersion());
		return displayObject;
	}
	
	public FormDisplayCartTransferObject getSelectedForm(String formId, List forms)
		{
			FormDisplayCartTransferObject displayObject = new FormDisplayCartTransferObject();
			for (Object eachform : forms)
			{
				FormTransferObject item = ((FormTransferObject)eachform);
				if (formId.equals(item.getIdseq()))
				{
					displayObject.setAslName(item.getAslName());
					displayObject.setContextName(item.getContext().getName());
					displayObject.setFormType(item.getFormType());
					displayObject.setIdseq(item.getIdseq());
					displayObject.setLongName(item.getLongName());
					displayObject.setProtocols(item.getProtocols());
					displayObject.setPublicId(item.getPublicId());
					displayObject.setVersion(item.getVersion());
					return displayObject;
				}
			}
	
			return displayObject;  // return empty object
		}
	
	
	public ActionForward addFormToCart(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response)
			throws IOException, ServletException {

		FormBuilderService service = getFormBuilderService(request);
		int formsInQueue = 0;
		
		try {

			ensureSessionCarts(request);

			DynaActionForm dynaBean = (DynaActionForm) form;
			boolean clearCheckedFormIds = false;
			List forms = (List)getSessionObject(request,this.FORM_SEARCH_RESULTS);

			if (true) { 

				log.debug("add-to-cart in memory - creating objects");
				Collection itemsToAdd = new ArrayList();
				Collection displayItemsToAdd = new ArrayList();

				CDECartOCImplExtension sessionCart = (CDECartOCImplExtension) this
						.getSessionObject(request, CaDSRConstants.FORMS_CART_V2);
				
				// add to form display cart now
				FormDisplayCartOCIImpl userFormDisplayCart = (FormDisplayCartOCIImpl) this
						.getSessionObject(request, CaDSRConstants.FORMS_DISPLAY_CART);
				
				FormDisplayCartOCIImpl userFormDisplayCartV2 = (FormDisplayCartOCIImpl) this
						.getSessionObject(request, CaDSRConstants.FORMS_DISPLAY_CART2);

				String[] formIds = (String[]) dynaBean.get("checkedFormIds");
								
				if (formIds != null) {
					for (String formId : formIds) {
						
						if (!FormBuilderUtil.validateIdSeqRequestParameter(formId))
							throw new FatalException("Invalid formId parameters.", new Exception("Invalid formId parameters."));
							
						//FormV2 crf = service.getFormDetailsV2(formId);
						//itemsToAdd.add(crf);
						//displayItemsToAdd.add(convertToDisplayItem(crf));
						displayItemsToAdd.add(getSelectedForm(formId, forms));
					}
					//sessionCart.addFormsV2(itemsToAdd);
					// create FormDisplayCartTransferObject for this cart
					userFormDisplayCart.addDisplayForms(displayItemsToAdd);
					userFormDisplayCartV2.addDisplayForms(displayItemsToAdd);
					log.debug("done");
					
					clearCheckedFormIds = true;
				}
				//this.setSessionObject(request, CaDSRConstants.FORMS_CART_V2, sessionCart);
				this.setSessionObject(request, CaDSRConstants.FORMS_DISPLAY_CART, userFormDisplayCart);
				this.setSessionObject(request, CaDSRConstants.FORMS_DISPLAY_CART2, userFormDisplayCartV2);
				//formsInQueue = sessionCart.getFormCartV2().size();
				formsInQueue = userFormDisplayCart.getFormDisplayCart().size();
			}
//// GF32932  D.An, 20130825.    
		      request.getSession().setAttribute("myFormCartInfo", new Integer(formsInQueue).toString());
		      request.getSession().setAttribute("myFormAdded", "Y");
System.out.println( "Forms Queued in Cart : " + request.getSession().getAttribute("myFormCartInfo") );
System.out.println( "Forms Added : " + request.getSession().getAttribute("myFormAdded") );
			
			saveMessage("cadsr.common.formcart.add.success", request, new Integer(formsInQueue).toString());


			dynaBean.set("cartAddFormId", "");
			if (clearCheckedFormIds)
				dynaBean.set("checkedFormIds", new String[] {});
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return mapping.findForward("success");
	}

  
  private CartObject translateCartObject(FormV2 crf) throws Exception {
		CartObject ob = new CartObject();
		ob.setType(FormConverterUtil.instance().getCartObjectType());
		ob.setDisplayText(Integer.toString(crf.getPublicId()) + "v" + Float.toString(crf.getVersion()));
		ob.setNativeId(crf.getFormIdseq());
		
		String convertedForm = FormConverterUtil.instance().convertFormToV2(crf);		
		ob.setData(convertedForm);
		return ob;	  
  }



  
  private Context getContextForId(List contexts,String contextIdSeq)
  {
    if(contexts==null||contextIdSeq==null)
      return null;
    ListIterator listIt = contexts.listIterator();
    while(listIt.hasNext())
    {
      Context currContext = (Context)listIt.next();
      if(currContext.getConteIdseq().equals(contextIdSeq))
      {
        return currContext;
      }
    }
    return null;
  }
}
  
