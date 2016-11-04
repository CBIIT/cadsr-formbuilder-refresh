package gov.nih.nci.ncicb.cadsr.formbuilder.struts.actions;


import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import org.apache.struts.action.DynaActionForm;

import gov.nih.nci.ncicb.cadsr.common.CaDSRConstants;
import gov.nih.nci.ncicb.cadsr.common.formbuilder.struts.common.FormConstants;
import gov.nih.nci.ncicb.cadsr.common.resource.Form;
import gov.nih.nci.ncicb.cadsr.common.resource.Version;
import gov.nih.nci.ncicb.cadsr.formbuilder.ejb.service.FormBuilderService;


public class FormVersionAction
  extends FormBuilderSecureBaseDispatchAction {
  /**
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
  public ActionForward getFormVersions(
    ActionMapping mapping,
    ActionForm form,
    HttpServletRequest request,
    HttpServletResponse response) throws IOException, ServletException {

    Form crf = (Form)getSessionObject(request, CRF);
     
    if (crf == null){
        return mapping.findForward("failure");
    }
    
    try{
        int publicId = crf.getPublicId();
        FormBuilderService service = getFormBuilderService(request);
        List formVersions = service.getFormVersions(publicId);
        if (formVersions.size() <1 ){
            return mapping.findForward("gotoCreateNewVersion");
        }
        
        setSessionObject(request, FormConstants.FORM_VERSION_LIST, formVersions);        
        for (int i=0; i<formVersions.size(); i++){
            Version aVersion = (Version)formVersions.get(i);
            if (aVersion.isLatestVersionIndicator()){
                setSessionObject(request, OLD_LATEST_VERSION, aVersion);
                break;
            }    
        }//end of for
        return mapping.findForward("success");
    }catch (Exception ex){
        if (log.isErrorEnabled()) {
          log.error("Exception on getFormVersions ", ex);
        }

        //saveMessage(ex.getErrorCode(), request);
        saveMessage("cadsr.formbuilder.form.version.read.failure", request);
        ActionForward forward =  mapping.findForward("failure");
        return forward;
    }
  }


    public ActionForward saveLatestVersion(
      ActionMapping mapping,
      ActionForm form,
      HttpServletRequest request,
      HttpServletResponse response) throws IOException, ServletException {

      DynaActionForm dynaForm = (DynaActionForm) form;
      String latestVersionId = (String) dynaForm.get(LATEST_VERSION_ID);
      String[] formIds = (String[]) dynaForm.get("id");

      //changeNote is a String[];
      String[] changeNotes = (String[])dynaForm.get(CHANGE_NOTE);
      
      Version newVersion = new Version();
      newVersion.setId(latestVersionId);
      newVersion.setLatestVersionIndicator(true);

      //get the oldVersion into session
      Version oldVersion = (Version)getSessionObject(request, OLD_LATEST_VERSION);
      
      
      List oldVersionList = (List)getSessionObject(request, FORM_VERSION_LIST);
        
      List changedNoteList = new ArrayList();
      boolean changed = false;
      
      for (int i=0; i<formIds.length; i++){
          Version existingVersion = (Version)oldVersionList.get(i);
          String existingChangeNote = existingVersion.getChangeNote()==null? "":existingVersion.getChangeNote();
            
          if (formIds[i].equals(latestVersionId) ){
              newVersion.setId(formIds[i]);
              newVersion.setChangeNote(changeNotes[i]);
              changed = true;
              continue;
          }
          if ((oldVersion!=null) && (formIds[i].equals(oldVersion.getId()))){
              oldVersion.setChangeNote(changeNotes[i]);
              changed = true;
              continue;
          }
          if ( !existingChangeNote.equals(changeNotes[i])){
              Version aVersion = new Version();
              aVersion.setId(formIds[i]);
              aVersion.setChangeNote(changeNotes[i]);
              changedNoteList.add(aVersion);
              changed = true;
          }
      }
      

      try{ 
          FormBuilderService service = getFormBuilderService(request);

          if (changed){
              service.setLatestVersion(oldVersion, newVersion, changedNoteList, getLoggedInUsername(request));
              //reload the form.
              Form newCRF = service.getFormDetails(newVersion.getId());
              setSessionObject(request, CRF, newCRF);    
              request.setAttribute("showCached", CaDSRConstants.YES);
              saveMessage("cadsr.formbuilder.latest.version.change.success", request);
          }else{
              saveMessage("cadsr.formbuilder.latest.version.nochange", request);
          }    

          removeSessionObject(request, FormConstants.OLD_LATEST_VERSION);

          return mapping.findForward("success");
      }catch (Exception ex){
          if (log.isErrorEnabled()) {
            log.error("Exception on saveLatestVersion ", ex);
          }

          saveMessage("cadsr.formbuilder.latest.version.change.fail", request);
          ActionForward forward =  mapping.findForward("failure");
          return forward;
      }
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
      public ActionForward gotoCreateNewVersion(
        ActionMapping mapping,
        ActionForm form,
        HttpServletRequest request,
        HttpServletResponse response) throws IOException, ServletException {
        Form crf = (Form)getSessionObject(request, CRF);
        try{
            FormBuilderService service = getFormBuilderService(request);            
            Float maxVersion = service.getMaxFormVersion(crf.getPublicId());

            DynaActionForm dynaForm = (DynaActionForm) form;
            dynaForm.set(FormConstants.FORM_MAX_VERSION, maxVersion.toString());
            request.setAttribute(FormConstants.FORM_MAX_VERSION, maxVersion);
            return mapping.findForward(SUCCESS);
        }catch (Exception fbe){
            if (log.isErrorEnabled()) {
              log.error("Could not get the maximum version by form public Id= " + crf.getPublicId(), fbe);
            }
            saveMessage("cadsr.formbuilder.create.version.fail", request);
            return mapping.findForward(FAILURE);
        }
      }
      
      
  public ActionForward saveNewVersion(
    ActionMapping mapping,
    ActionForm form,
    HttpServletRequest request,
    HttpServletResponse response) throws IOException, ServletException {

    try{
        DynaActionForm dynaForm = (DynaActionForm) form;
        Form crf = (Form)getSessionObject(request, CRF);
        
         DynaActionForm dFrom = (DynaActionForm)form;
         String maxVersionStr = (String)dFrom.get(FormConstants.FORM_MAX_VERSION);
         
        if (crf == null || !validateVersion(dynaForm, request)){
            request.setAttribute(FormConstants.FORM_MAX_VERSION, maxVersionStr);             
            return mapping.findForward("failure");
        }
        
        String editNewFormStr = (String) dynaForm.get(EDIT_FORM_INDICATOR);
        Float newVersionNumber = (Float) dynaForm.get(NEW_VERSION_NUMBER);
        String changeNote = (String)dynaForm.get(CHANGE_NOTE);
        boolean editNewFormIndicator = "true".equalsIgnoreCase(editNewFormStr);

        FormBuilderService service = getFormBuilderService(request);
        String newFormIdSeq = service.createNewFormVersion(crf.getFormIdseq(), newVersionNumber, changeNote, getLoggedInUsername(request));
        saveMessage("cadsr.formbuilder.create.version.success", request);
        
        Form newCRF = service.getFormDetails(newFormIdSeq);
        setSessionObject(request, CRF, newCRF);    
        request.setAttribute("showCached", CaDSRConstants.YES);
        if (editNewFormIndicator){
            return mapping.findForward("successEditNew");            
        }else{
            return mapping.findForward("successViewNew");
        }
      }
      catch (Exception exp) {
        if (log.isErrorEnabled()) {
          log.error("Exception on saveNewVersion ", exp);
        }

        saveMessage("cadsr.formbuilder.create.version.fail", request);
        ActionForward forward =  mapping.findForward("failure");
        return forward;
      }
      
  }



  public ActionForward  cancelNewVersion(
    ActionMapping mapping,
    ActionForm form,
    HttpServletRequest request,
    HttpServletResponse response) throws IOException, ServletException {
    return mapping.findForward("cancel");
  }
  
    public ActionForward  cancelLatestVersion(
      ActionMapping mapping,
      ActionForm form,
      HttpServletRequest request,
      HttpServletResponse response) throws IOException, ServletException {

      removeSessionObject(request, FormConstants.OLD_LATEST_VERSION);
      return mapping.findForward("success");
    }

    //validate the new version number
    private boolean validateVersion(DynaActionForm dynaForm, HttpServletRequest request){
        
        Float newVersionNumber = (Float) dynaForm.get(NEW_VERSION_NUMBER);
        String maxVersionStr = (String)dynaForm.get(FormConstants.FORM_MAX_VERSION);
        Float maxVersion = 0f;
        try{
            maxVersion = new Float(maxVersionStr);
        }catch (Exception e){ //should never happen.
            log.warn("maxVersion is not a valid float");
            return false;
        }

        if (newVersionNumber.compareTo(maxVersion)>0){
            return true;
        }else{
            saveMessage("cadsr.formbuilder.create.version.validation_fail", request);
            return false;
        }
    }//end of validateVersion
}
