package gov.nih.nci.ncicb.cadsr.formbuilder.struts.actions;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import org.apache.struts.action.DynaActionForm;

import gov.nih.nci.ncicb.cadsr.common.CaDSRConstants;
import gov.nih.nci.ncicb.cadsr.common.dto.QuestionTransferObject;
import gov.nih.nci.ncicb.cadsr.common.resource.DataElement;
import gov.nih.nci.ncicb.cadsr.common.resource.Form;
import gov.nih.nci.ncicb.cadsr.common.resource.Module;
import gov.nih.nci.ncicb.cadsr.common.resource.NCIUser;
import gov.nih.nci.ncicb.cadsr.common.resource.Question;
import gov.nih.nci.ncicb.cadsr.common.struts.formbeans.CDECartFormBean;
import gov.nih.nci.ncicb.cadsr.common.util.CDEBrowserParams;
import gov.nih.nci.ncicb.cadsr.common.util.DTOTransformer;
import gov.nih.nci.ncicb.cadsr.formbuilder.ejb.service.FormBuilderService;
import gov.nih.nci.ncicb.cadsr.formbuilder.struts.common.FormActionUtil;
import gov.nih.nci.ncicb.cadsr.objectCart.CDECart;
import gov.nih.nci.ncicb.cadsr.objectCart.CDECartItem;
import gov.nih.nci.ncicb.cadsr.objectCart.impl.CDECartOCImpl;
import gov.nih.nci.objectCart.client.ObjectCartClient;


public class SecureCDECartAction extends FormBuilderSecureBaseDispatchAction {

  public ActionForward gotoChangeDEAssociation (
    ActionMapping mapping,
    ActionForm form,
    HttpServletRequest request,
    HttpServletResponse response) throws IOException, ServletException {

    DynaActionForm dynaForm = (DynaActionForm) form;
    int questionIndex =
      Integer.parseInt((String) dynaForm.get("questionIndex"));
    List questions =
      ((Module) getSessionObject(request, MODULE)).getQuestions();
    Question q = (Question) questions.get(questionIndex);

    if(q.getDataElement() == null) 
      request.setAttribute("removeButton", "no");

    return displayCDECart(mapping, form, request, response);
  }

  public ActionForward addQuestion(
    ActionMapping mapping,
    ActionForm form,
    HttpServletRequest request,
    HttpServletResponse response) throws IOException, ServletException {
    DynaActionForm dynaForm = (DynaActionForm) form;
    String[] selectedItems = (String[]) dynaForm.get(SELECTED_ITEMS);

    CDECart sessionCart =
      (CDECart) this.getSessionObject(request, CaDSRConstants.CDE_CART);

    Form crf = (Form) getSessionObject(request, CRF);
    Module module = (Module) getSessionObject(request, MODULE);
    List questions = module.getQuestions();   
    List newQuestions = new ArrayList(selectedItems.length);

    //int display = Integer.parseInt((String) dynaForm.get(QUESTION_INDEX));    
    Integer qindex = (Integer) this.getSessionObject(request, QUESTION_INDEX);
    int displayOrder = 	qindex.intValue();	//Integer.parseInt(qindex);

    Collection col = sessionCart.getDataElements();
    ArrayList al = new ArrayList(col);

    //for getting reference docs
    FormBuilderService service = getFormBuilderService(request);
    List refDocs = null;
    
    int length = selectedItems.length;
    List deIdList = new ArrayList(length);
    List vdIdList = new ArrayList(length);
    DataElement de = null;   
    for (int i = 0; i < selectedItems.length; i++) {
        de =
            (DataElement) ((CDECartItem) al.get(Integer.parseInt(selectedItems[i]))).getItem();
        deIdList.add(de.getDeIdseq());
        if (de.getValueDomain()!=null && de.getValueDomain().getVdIdseq()!=null){
            vdIdList.add(de.getValueDomain().getVdIdseq());            
        }    
    }
    
    try {
    Map vvMap = service.getValidValues(vdIdList);
    for (int i = 0; i < selectedItems.length; i++) {      
      de = (DataElement) ((CDECartItem) al.get(Integer.parseInt(selectedItems[i]))).getItem();      
      String vdIdSeq = de.getValueDomain().getVdIdseq();
      //may refactor the following code for better performance 
            refDocs = service.getRreferenceDocuments(de.getDeIdseq());
            de.setReferenceDocs(refDocs);
      String questionLongName = de.getLongCDEName();
      if (!isValidCDE(de)){
         saveMessage("cadsr.formbuilder.form.question.add.badCDE", request, de.getLongName());
         questionLongName = "Data Element " + de.getLongName() + " does not have Preferred Question Text";         
          //user can still continue
         //return mapping.findForward(FAILURE);
      }
    
      boolean isDEDerived = service.isDEDerived(de.getIdseq());
      Question q = new QuestionTransferObject();
      module.setForm(crf);
      q.setModule(module);

      //set valid value
      List values = (List)vvMap.get(vdIdSeq);
      de.getValueDomain().setValidValues(values);
      List newValidValues = DTOTransformer.toFormValidValueList(values, q);
      q.setQuesIdseq(new Date().getTime() + "" + i);
      q.setValidValues(newValidValues);
      q.setDataElement(de);
      q.setLongName(questionLongName);

      q.setVersion(crf.getVersion());
      q.setAslName(crf.getAslName());
      q.setPreferredDefinition(de.getPreferredDefinition());
      q.setContext(crf.getContext());

      q.setDisplayOrder(displayOrder);
      q.setDeDerived(isDEDerived);
      
      if (!isDEDerived) {
    	  q.setEditable(true);
      }

      newQuestions.add(q);        
    }//end of for
    }catch (Exception exp){
            if (log.isErrorEnabled()) {
              log.error("Exception on getting reference documents or Permissible values for the Data Element de Idseq=" + de.getIdseq() , exp);
            }
            //saveMessage(exp.getErrorCode(), request);
            saveMessage("cadsr.formbuilder.form.read.failure", request);
            
            return mapping.findForward(FAILURE);
    }       
        
    
    //only when all CDE are valid to be added to a form then add new questions to form.module.questions
    if (displayOrder < questions.size()) {
        questions.addAll(displayOrder, newQuestions);
    }else{
        questions.addAll(newQuestions);
    }
    FormActionUtil.setInitDisplayOrders(questions); //This is done to set display order in a sequential order 
                                      // in case  they are  incorrect in database
                                            
    // Jump to the update location on the screen
    request.setAttribute(CaDSRConstants.ANCHOR,"Q"+displayOrder);    
        
    saveMessage("cadsr.formbuilder.question.add.success",request);
    return mapping.findForward("success");
  }

  public ActionForward changeAssociation(
    ActionMapping mapping,
    ActionForm form,
    HttpServletRequest request,
    HttpServletResponse response) throws IOException, ServletException {

    DynaActionForm dynaForm = (DynaActionForm) form;
    String selectedText = (String) dynaForm.get("selectedText");

    DataElement de = null;
    List newValidValues = null;

 //   String qindex = (String) this.getSessionObject(request, QUESTION_INDEX);
 //   int questionIndex = Integer.parseInt(qindex);
    Integer qindex = (Integer) this.getSessionObject(request, QUESTION_INDEX);
    int questionIndex = qindex.intValue();	

    List questions =
      ((Module) getSessionObject(request, MODULE)).getQuestions();
    CDECart sessionCart =
      (CDECart) this.getSessionObject(request, CaDSRConstants.CDE_CART);
    Question q = (Question) questions.get(questionIndex);

    if ((selectedText == null) | (selectedText.indexOf(",") == -1)) {
      // this is the remove association case
      saveMessage("cadsr.formbuilder.question.changeAssociation.remove",request);
    }
    else {
      int ind = selectedText.indexOf(',');
      int deIndex = Integer.parseInt(selectedText.substring(0, ind).trim());
      String newLongName = "";

      if (selectedText.length() > ind) {
        newLongName = selectedText.substring(ind + 1).trim();
      }

      Collection col = sessionCart.getDataElements();
      ArrayList al = new ArrayList(col);

      de = (DataElement) ((CDECartItem) al.get(deIndex)).getItem();
      if (newLongName==null || "null".equals(newLongName) || newLongName.length()==0){
          //newLongName = "";
           newLongName = "Data Element " + de.getLongName() + " does not have Preferred Question Text";
      }

      //get reference docs
      FormBuilderService service = getFormBuilderService(request);
      List refDocs = null;
      
      try {
          refDocs = service.getRreferenceDocuments(de.getDeIdseq());          
          de.setReferenceDocs(refDocs);
       }catch (Exception exp){
           if (log.isErrorEnabled()) {
             log.error("Exception on getting reference documents for the Data Element " , exp);
           }
           //saveMessage(exp.getErrorCode(), request);
           saveMessage("cadsr.formbuilder.form.read.failure", request);
           return mapping.findForward(FAILURE);
       }       
        
      if (!isValidCDE(de)){
          saveMessage("cadsr.formbuilder.form.question.add.badCDE", request, de.getLongName());
          //return mapping.findForward(FAILURE);
          //user can still continue
      }
      
      //set valid values with value meaning
      List vdIdList = new ArrayList();
      try{
          if (de.getValueDomain()!=null && de.getValueDomain().getVdIdseq()!=null ){
              String vdIdSeq = de.getValueDomain().getVdIdseq();
              vdIdList.add(vdIdSeq);
              Map vvMap = service.getValidValues(vdIdList);
              List vvList = (List)vvMap.get(vdIdSeq);
              de.getValueDomain().setValidValues(vvList);
              newValidValues = DTOTransformer.toFormValidValueList(vvList, q);
          }    
          
      }catch (Exception fbe){
          log.error("Exception on getting valid values for the Data Element Value Doamin , vdIdSeq=" 
                                +  de.getValueDomain().getVdIdseq(), fbe);
          saveMessage("cadsr.formbuilder.question.changeAssociation.newAssociation.fail", request);
          return mapping.findForward(FAILURE);
      }
      
      q.setLongName(newLongName);
      
      q.setValidValues(newValidValues);
      saveMessage("cadsr.formbuilder.question.changeAssociation.newAssociation",request);
    }

    q.setDataElement(de);
    //clear out the default value
    q.setDefaultValidValue(null);
    q.setDefaultValue("");

    // Jump to the update location on the screen
    request.setAttribute(CaDSRConstants.ANCHOR,"Q"+questionIndex);     

    return mapping.findForward("success");
  }

  /**
   * Displays CDE Cart.
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
  public ActionForward displayCDECart(
    ActionMapping mapping,
    ActionForm form,
    HttpServletRequest request,
    HttpServletResponse response) throws IOException, ServletException {
     
    return mapping.findForward(retrieveItems(mapping, form, request, response));
  }

  public String retrieveItems(
	    ActionMapping mapping,
	    ActionForm form,
	    HttpServletRequest request,
	    HttpServletResponse response) throws IOException, ServletException {
	     
	    try {
	      NCIUser user =
	        (NCIUser) this.getSessionObject(request, CaDSRConstants.USER_KEY);
	      CDEBrowserParams params = CDEBrowserParams.getInstance();
	      String ocURL = params.getObjectCartUrl();
	      //Get the cart in the session
	      ObjectCartClient cartClient = null;
	      
		  if (!ocURL.equals(""))
			  cartClient = new ObjectCartClient(ocURL);
		  else
	    	  cartClient = new ObjectCartClient();
	      
	      CDECart userCart = new CDECartOCImpl(cartClient, user.getUsername(),CaDSRConstants.CDE_CART);
	      
	      this.setSessionObject(request, CaDSRConstants.CDE_CART, userCart);
	    }
	    catch (Exception exp) {
	      if (log.isErrorEnabled()) {
	        log.error("Exception on displayCDECart", exp);
	      }
	      saveMessage(exp.getMessage(), request);
	      return FAILURE;
	    }
	    return SUCCESS;
  	}
  
  /**
   * Adds items to CDE Cart.
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
  public ActionForward addItems(
    ActionMapping mapping,
    ActionForm form,
    HttpServletRequest request,
    HttpServletResponse response) throws IOException, ServletException {
    try {
      CDECart cart =
        (CDECart) this.getSessionObject(request, CaDSRConstants.CDE_CART);
      saveMessage("cadsr.common.cdecart.save.success",request);
    }
    catch (Exception exp) {
      if (log.isErrorEnabled()) {
        log.error("Exception on addItems " , exp);
      }
    }

    return mapping.findForward("addDeleteSuccess");
  }

  /**
   * Delete items from the CDE Cart.
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
  public ActionForward removeItems(
    ActionMapping mapping,
    ActionForm form,
    HttpServletRequest request,
    HttpServletResponse response) throws IOException, ServletException {
    try {
      CDECartFormBean myForm = (CDECartFormBean) form;
      String[] selectedDeleteItems = myForm.getSelectedDeleteItems();
      Collection savedItems = new ArrayList();

      //Collection unsavedItems = new ArrayList();
      Collection items = new ArrayList();

      //Get the cart in the session
      CDECart sessionCart =
        (CDECart) this.getSessionObject(request, CaDSRConstants.CDE_CART);
      CDECartItem item = null;

      for (int i = 0; i < selectedDeleteItems.length; i++) {
        items.add(selectedDeleteItems[i]);
      }
      
      sessionCart.removeDataElements(items);
      saveMessage("cadsr.common.cdecart.delete.success",request);
    }
    catch (Exception exp) {
      if (log.isErrorEnabled()) {
        log.error("Exception on removeItems " , exp);
      }
    }

    return mapping.findForward("addDeleteSuccess");
  }
 
 
  public ActionForward subsetQuestionValidValues(
    ActionMapping mapping,
    ActionForm form,
    HttpServletRequest request,
    HttpServletResponse response) throws IOException, ServletException {
    DynaActionForm dynaForm = (DynaActionForm) form;
    String[] selectedItems = (String[]) dynaForm.get(SELECTED_ITEMS);

    CDECart sessionCart =
      (CDECart) this.getSessionObject(request, CaDSRConstants.CDE_CART);

    Form crf = (Form) getSessionObject(request, CRF);
    Module module = (Module) getSessionObject(request, MODULE);
    List selectedDataElements = new ArrayList();

    Collection col = sessionCart.getDataElements();
    ArrayList al = new ArrayList(col);

    int displayOrder = Integer.parseInt((String) dynaForm.get(QUESTION_INDEX));

    for (int i = 0; i < selectedItems.length; i++) {
      DataElement de =
        (DataElement) ((CDECartItem) al.get(Integer.parseInt(selectedItems[i]))).getItem();
      selectedDataElements.add(de);
    }
    
    this.setSessionObject(request,SELECTED_DATAELEMENTS,selectedDataElements,true);
    return mapping.findForward(SUBSET_VALIDVALUES);
  }
 
  public ActionForward addSubsettedValidValuesQuestion(
    ActionMapping mapping,
    ActionForm form,
    HttpServletRequest request,
    HttpServletResponse response) throws IOException, ServletException {
    DynaActionForm dynaForm = (DynaActionForm) form;
    
    saveMessage("cadsr.formbuilder.question.add.success",request);
    return mapping.findForward("success");
  } 
  
  
  public ActionForward cancelAddSubsettedValidValuesQuestion(
    ActionMapping mapping,
    ActionForm form,
    HttpServletRequest request,
    HttpServletResponse response) throws IOException, ServletException {
    DynaActionForm dynaForm = (DynaActionForm) form;
    
    removeSessionObject(request,SELECTED_DATAELEMENTS);
    return mapping.findForward(CANCEL);
  }
  
  public ActionForward retrieveAssociateCDEs(
		    ActionMapping mapping,
		    ActionForm form,
		    HttpServletRequest request,
		    HttpServletResponse response) throws IOException, ServletException {
		    
	    	DynaActionForm dynaForm = (DynaActionForm) form;
		    String action = retrieveItems(mapping, form, request, response);
		    return mapping.findForward("retrieveCDEs");
		  }
		  
  public ActionForward retrieveQuestionCDEs(
		    ActionMapping mapping,
		    ActionForm form,
		    HttpServletRequest request,
		    HttpServletResponse response) throws IOException, ServletException {
		    
	    	String action = retrieveItems(mapping, form, request, response);
	    	return mapping.findForward("retrieveCDEs");
  }
		  
  private boolean  isValidCDE(DataElement de){
    if (de.getLongCDEName()==null || de.getLongCDEName().length()==0){
         if (log.isDebugEnabled()) {
           log.debug("User is trying to add a CDE without Preferred Question Text. The Data Element deIdseq=" + de.getIdseq());
         }
        return false;
    }
    return true;
  }  
  
}
