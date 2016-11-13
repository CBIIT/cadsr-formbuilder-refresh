package gov.nih.nci.ncicb.cadsr.formbuilder.struts.actions;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import org.apache.struts.action.DynaActionForm;

import gov.nih.nci.ncicb.cadsr.common.formbuilder.struts.common.FormConstants;
import gov.nih.nci.ncicb.cadsr.common.resource.Form;
import gov.nih.nci.ncicb.cadsr.common.resource.TriggerActionChanges;
import gov.nih.nci.ncicb.cadsr.formbuilder.ejb.service.FormBuilderService;
import gov.nih.nci.ncicb.cadsr.formbuilder.struts.common.FormActionUtil;


public class ManageClassificationsAction
  extends FormBuilderSecureBaseDispatchAction {
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
  public ActionForward getClassifications(
    ActionMapping mapping,
    ActionForm form,
    HttpServletRequest request,
    HttpServletResponse response) throws IOException, ServletException {
    try {
     // DynaActionForm dynaForm = (DynaActionForm) form;

      String formId = "";  //(String) dynaForm.get(FORM_ID_SEQ);

      Form crf = (Form) getSessionObject(request, CRF);
      if (crf != null)
    	  formId = crf.getFormIdseq();

      if ((crf == null) || !crf.getFormIdseq().equals(formId)) {
        setFormForAction(form, request);
      }

      FormBuilderService service = getFormBuilderService(request);

      Collection classifications = service.retrieveFormClassifications(formId);

      setSessionObject(request, CLASSIFICATIONS, classifications);
    }
    catch (Exception exp) {
      if (log.isErrorEnabled()) {
        log.error("Exception on getClassifications ", exp);
      }

      //saveMessage(exp.getErrorCode(), request);
      saveMessage("cadsr.formbuilder.classification.fetch.failure", request);
    }

    return mapping.findForward("success");
  }

  public ActionForward gotoAddClassifications(
    ActionMapping mapping,
    ActionForm form,
    HttpServletRequest request,
    HttpServletResponse response) throws IOException, ServletException {
    return mapping.findForward("success");
  }

  public ActionForward addClassifications(
    ActionMapping mapping,
    ActionForm form,
    HttpServletRequest request,
    HttpServletResponse response) throws IOException, ServletException {
    DynaActionForm dynaForm = (DynaActionForm) form;

    String[] ids = (String[]) dynaForm.get(CS_CSI_ID);
    String classifyCDEIndicator = (String)dynaForm.get(CLASSIFY_CDE_ON_FORM);
    boolean csCDEIndicator = "true".equalsIgnoreCase(classifyCDEIndicator);
                
    boolean success = true;
    try {
      Form crf = (Form) getSessionObject(request, CRF);
      FormBuilderService service = getFormBuilderService(request);

      //get form Id and CDE Id if it is to classify CDE as well.

      //get classifications
      List csCsiIdList = new ArrayList();
      for (int i = 0; i < ids.length; i++) {
        String id = ids[i];
        if (id!=null && id.length() > 0){
            csCsiIdList.add(id); 
        }
      }  
      
      //get AC including the form and the CDE if CLASSIFY_CDE_ON_FORM is selected
       List acIdList = new ArrayList();
       acIdList.add(crf.getFormIdseq());
      
      if (csCDEIndicator) {
        List CDEList = crf.getCDEIdList();
        if (CDEList != null)
        	acIdList.addAll(CDEList);
      }
    
      try {
             service.assignFormClassification(acIdList, csCsiIdList);
      }catch (Exception exp) {
            if (log.isErrorEnabled()) {
              log.error("Exception on addClassification ", exp);
            }

        //saveMessage(exp.getErrorCode(), request);
	    saveMessage("cadsr.formbuilder.classification.add.failure", request);
	    
	    success = false;
       }// end of try-catch

      Collection classifications =
        service.retrieveFormClassifications(crf.getFormIdseq());

      setSessionObject(request, CLASSIFICATIONS, classifications);
    }
    catch (Exception exp) {
      if (log.isErrorEnabled()) {
        log.error("Exception on addClassification ", exp);
      }

      //saveMessage(exp.getErrorCode(), request);
      saveMessage("cadsr.formbuilder.classification.add.failure", request);

      return mapping.findForward("failure");
    }

    if(success && !csCDEIndicator)
      saveMessage("cadsr.formbuilder.classification.add.success", request);
    if (success && csCDEIndicator){
      saveMessage("cadsr.formbuilder.classification.add.form.and.cde.success", request);
    }

    return mapping.findForward("success");
  }

  public ActionForward removeClassification(
    ActionMapping mapping,
    ActionForm form,
    HttpServletRequest request,
    HttpServletResponse response) throws IOException, ServletException {
    DynaActionForm dynaForm = (DynaActionForm) form;

    /*String[] ids = (String[]) dynaForm.get(AC_CS_CSI_ID);//ascsiId
    String acCsiId = ids[0];
    */
    String[] cscsiIds = (String[]) dynaForm.get(CS_CSI_ID);
    String cscsiId = cscsiIds[0];

    try {
      Form crf = (Form) getSessionObject(request, CRF);

      //check skip pattern
      List<TriggerActionChanges> triggerChangesList = 
                FormActionUtil.findFormSkipPatternForByClassificiation(crf, cscsiId);
      if (triggerChangesList!=null && !triggerChangesList.isEmpty()){
          setSessionObject(request, CLASSIFICATION_ASSOCIATED_TRIGGERS, triggerChangesList);
          request.setAttribute(FormConstants.REMOVED_CLASSIFICATION_ID, cscsiId);
          return mapping.findForward("hasSkipPattern");          
      }

      FormBuilderService service = getFormBuilderService(request);
      service.removeFFormClassification(cscsiId, crf.getFormIdseq());
      
      Collection classifications =
        service.retrieveFormClassifications(crf.getFormIdseq());

      //make sure there is no left-over triggers.
      removeSessionObject(request, CLASSIFICATION_ASSOCIATED_TRIGGERS);
      setSessionObject(request, CLASSIFICATIONS, classifications);
    }
    catch (Exception exp) {
      if (log.isErrorEnabled()) {
        log.error("Exception on removeClassification ", exp);
      }
      //saveMessage(exp.getErrorCode(), request);
      saveMessage("cadsr.formbuilder.classification.delete.failure", request);
      
      return mapping.findForward("failure");
    }

    saveMessage("cadsr.formbuilder.classification.delete.success", request);

    return mapping.findForward("success");
  }
    

    public ActionForward updateSkipPatternForCSI(
      ActionMapping mapping,
      ActionForm form,
      HttpServletRequest request,
      HttpServletResponse response) throws IOException, ServletException {
      
      DynaActionForm formBean = (DynaActionForm)form;
      String choice = (String)formBean.get("choice");//TODO: need to update the CRF for display
      String cscsiId = (String)formBean.get(FormConstants.REMOVED_CLASSIFICATION_ID);
      Form crf = (Form)getSessionObject(request, CRF);
      try{
          if ("yes".equalsIgnoreCase(choice)){
              FormBuilderService service = getFormBuilderService(request);
              List<TriggerActionChanges> triggerChangesList = (List<TriggerActionChanges>)
                        getSessionObject(request,CLASSIFICATION_ASSOCIATED_TRIGGERS);
              service.removeFormClassificationUpdateTriggerActions(cscsiId,  crf.getFormIdseq(), triggerChangesList, getLoggedInUsername(request));
              
              //update CRF in session
              removeSessionObject(request, CRF);
              String formId = crf.getFormIdseq();
              crf = service.getFormDetails(formId);  
              
              Collection classifications = service.retrieveFormClassifications(formId);
              setSessionObject(request, CLASSIFICATIONS, classifications);
              setSessionObject(request, CRF, crf);
          }
          removeSessionObject(request,CLASSIFICATION_ASSOCIATED_TRIGGERS);
      }catch(Exception e){
          if (log.isErrorEnabled()) {
            log.error("Exception on updateSkipPatternForCSI ", e);
          }
          saveMessage("cadsr.formbuilder.classification.updateSkipPattern.failure", request);
          removeSessionObject(request,CLASSIFICATION_ASSOCIATED_TRIGGERS);
          return mapping.findForward("failure");
      }
      return mapping.findForward(SUCCESS);
      }
}
