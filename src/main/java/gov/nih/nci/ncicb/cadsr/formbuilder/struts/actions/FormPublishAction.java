package gov.nih.nci.ncicb.cadsr.formbuilder.struts.actions;

import java.io.IOException;
import java.util.Collection;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;

import gov.nih.nci.ncicb.cadsr.common.resource.Context;
import gov.nih.nci.ncicb.cadsr.common.resource.Form;
import gov.nih.nci.ncicb.cadsr.common.util.ContextUtils;
import gov.nih.nci.ncicb.cadsr.formbuilder.ejb.service.FormBuilderService;


public class FormPublishAction extends FormBuilderSecureBaseDispatchAction {
  /**
   * Publish form.
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
  public ActionForward publishForm(
    ActionMapping mapping,
    ActionForm form,
    HttpServletRequest request,
    HttpServletResponse response) throws IOException, ServletException {
    

    try {

      Form aForm = (Form) getSessionObject(request, CRF);
      FormBuilderService service = getFormBuilderService(request);
      Collection contexts = (Collection)getSessionObject(request, ALL_CONTEXTS);

      //Context currContext = ContextUtils.getContextByName(contexts,CONTEXT_CABIG); 
      Context currContext = ContextUtils.getContextByName(contexts, CONTEXT_NCIP);     
      service.publishForm(aForm.getIdseq(),aForm.getFormType(),currContext.getConteIdseq());
      setSessionObject(request,TREE_REFRESH_INDICATOR,YES,true);
    }
    catch (Exception exp) {
      if (log.isErrorEnabled()) {
        log.error("Exception while publishing the form "+form , exp);
      }
      saveMessage(ERROR_FORM_PUBLISH, request);

      return mapping.findForward(SUCCESS);
    }
    saveMessage("cadsr.formbuilder.form.publish.success", request);
    return mapping.findForward(SUCCESS);
  }

  /**
   * unpublish form.
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
  public ActionForward unpublishForm(
    ActionMapping mapping,
    ActionForm form,
    HttpServletRequest request,
    HttpServletResponse response) throws IOException, ServletException {
    

    try {

      Form aForm = (Form) getSessionObject(request, CRF);
      FormBuilderService service = getFormBuilderService(request);
      Collection contexts = (Collection)getSessionObject(request, ALL_CONTEXTS);

      //Context currContext = ContextUtils.getContextByName(contexts,CONTEXT_CABIG);  
      Context currContext = ContextUtils.getContextByName(contexts,CONTEXT_NCIP);  
      service.unpublishForm(aForm.getIdseq(),aForm.getFormType(),currContext.getConteIdseq());
      setSessionObject(request,TREE_REFRESH_INDICATOR,YES,true);
    }
    catch (Exception exp) {
      if (log.isErrorEnabled()) {
        log.error("Exception while unpublishing the form "+form , exp);
      }
      saveMessage(ERROR_FORM_UNPUBLISH, request);

      return mapping.findForward(FAILURE);
    }
    saveMessage("cadsr.formbuilder.form.unpublish.success", request);
    return mapping.findForward(SUCCESS);
  }

}
