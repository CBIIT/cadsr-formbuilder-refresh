package gov.nih.nci.ncicb.cadsr.formbuilder.struts.actions;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import org.apache.struts.action.DynaActionForm;

import gov.nih.nci.ncicb.cadsr.common.formbuilder.struts.common.FormConstants;
import gov.nih.nci.ncicb.cadsr.common.formbuilder.struts.common.NavigationConstants;
import gov.nih.nci.ncicb.cadsr.common.resource.Form;
import gov.nih.nci.ncicb.cadsr.common.resource.Protocol;
import gov.nih.nci.ncicb.cadsr.common.resource.TriggerActionChanges;
import gov.nih.nci.ncicb.cadsr.common.struts.formbeans.GenericDynaFormBean;
import gov.nih.nci.ncicb.cadsr.formbuilder.ejb.service.FormBuilderService;
import gov.nih.nci.ncicb.cadsr.formbuilder.struts.common.FormActionUtil;


public class ManageProtocolsAction
  extends FormBuilderSecureBaseDispatchAction {
  
  public ActionForward manageProtocols(
    ActionMapping mapping,
    ActionForm form,
    HttpServletRequest request,
    HttpServletResponse response) throws IOException, ServletException {
    
        return mapping.findForward("success");
    }
    
    
  

  public ActionForward gotoAddProtocols(
    ActionMapping mapping,
    ActionForm form,
    HttpServletRequest request,
    HttpServletResponse response) throws IOException, ServletException {
    return mapping.findForward("success");
  }

    public ActionForward doneProtocol(
      ActionMapping mapping,
      ActionForm form,
      HttpServletRequest request,
      HttpServletResponse response) throws IOException, ServletException {
      
      GenericDynaFormBean bean = (GenericDynaFormBean)form;
      Form crf = (Form)getSessionObject(request, FormConstants.CRF); 
      bean.set(FormConstants.PROTOCOLS_LOV_NAME_FIELD, crf.getDelimitedProtocolLongNames());
      
      String backTo = (String)getSessionObject(request, "backTo");
      removeSessionObject(request, "backTo");
      if (backTo.equals(NavigationConstants.FORM_COPY)){
          return mapping.findForward("successGotoFormCopy");
      }
      if (backTo.equals(NavigationConstants.FORM_COPY)){
          return mapping.findForward("successGotoFormEdit");
      }
      //request.setAttribute("showCached", CaDSRConstants.YES); //TODO
      return mapping.findForward(SUCCESS);
    }

  public ActionForward addProtocol(
    ActionMapping mapping,
    ActionForm form,
    HttpServletRequest request,
    HttpServletResponse response) throws IOException, ServletException {

        DynaActionForm dynaForm = (DynaActionForm) form;    
        String id = (String)dynaForm.get("protocolIdSeq");
        if (id.length()==0){
           saveMessage("cadsr.formbuilder.form.edit.form.manageProtocol.protocol", request);
           return mapping.findForward(FAILURE);
         }
         
        Form crf = (Form) getSessionObject(request, CRF);
        List oldList = crf.getProtocols();

        FormBuilderService service = getFormBuilderService(request);
        try{
            if (!alreadyExist(oldList, id)){
                Protocol p = service.getProtocolByPK(id);                
                oldList.add(p);
            }
            crf.setProtocols(oldList);
            setSessionObject(request, CRF, crf);
            
       }catch(Exception exp){
           if (log.isDebugEnabled()) {
             log.debug("Exception on getting protocol by PK  " + exp);
           }
           //saveMessage(exp.getErrorCode(), request);
           saveMessage("cadsr.formbuilder.form.read.failure", request);
           return mapping.findForward(FAILURE);
       }
    return mapping.findForward(SUCCESS);
  }

  public ActionForward removeProtocol(
    ActionMapping mapping,
    ActionForm form,
    HttpServletRequest request,
    HttpServletResponse response) throws IOException, ServletException {
    DynaActionForm dynaForm = (DynaActionForm) form;

    String id = (String) dynaForm.get(FormConstants.PROTOCOL_ID_SEQ);

      Form crf = (Form) getSessionObject(request, CRF);
      
      List protocols = crf.getProtocols();
      if (protocols == null || protocols.isEmpty()){
          log.info("Nothing to remove. There is no existing protocols.");
          return mapping.findForward("success"); 
      }
      
      /*
      Iterator it = protocols.iterator();
      List removed = new ArrayList();;
      while (it.hasNext()){
        Protocol p = (Protocol)it.next();
        if (p.getProtoIdseq().equals(id)){
            removed.add(p);
        }
      }
      protocols.removeAll(removed);
      //removed from crf.
      crf.setProtocols(protocols);
      setSessionObject(request, CRF, crf);
      */
      //check the skip pattern
      List<TriggerActionChanges> triggerChangesList = FormActionUtil.findFormSkipPatternByProtocol(crf, id);
      if (triggerChangesList!=null && !triggerChangesList.isEmpty()){
        setSessionObject(request, PROTOCOL_ASSOCIATED_TRIGGERS, triggerChangesList);
        request.setAttribute("removedProtocolId", id);
        return mapping.findForward("hasSkipPattern");          
      }
      
      Iterator it = protocols.iterator();
      List removed = new ArrayList();;
      while (it.hasNext()){
        Protocol p = (Protocol)it.next();
        if (p.getProtoIdseq().equals(id)){
            removed.add(p);
        }
      }
      protocols.removeAll(removed);
      //removed from crf.
      crf.setProtocols(protocols);
      setSessionObject(request, CRF, crf);

      removeSessionObject(request, PROTOCOL_ASSOCIATED_TRIGGERS);
      return mapping.findForward(SUCCESS);
  }
    
    public ActionForward updateSkipPattern(
      ActionMapping mapping,
      ActionForm form,
      HttpServletRequest request,
      HttpServletResponse response) throws IOException, ServletException {
      
      DynaActionForm formBean = (DynaActionForm)form;
      String choice = (String)formBean.get("choice");//TODO: need to update the CRF for display
      String id = (String)formBean.get("removedProtocolId");
      Form crf = (Form)getSessionObject(request, CRF);
      if ("yes".equalsIgnoreCase(choice)){
          //remove protocol
          List protocols = crf.getProtocols();
           Iterator it = protocols.iterator();
           List removed = new ArrayList();;
           while (it.hasNext()){
             Protocol p = (Protocol)it.next();
             if (p.getProtoIdseq().equals(id)){
                 removed.add(p);
             }
           }
           protocols.removeAll(removed);
           //removed from crf.
           crf.setProtocols(protocols);
           setSessionObject(request, CRF, crf);

          
          //update skip pattern
          List<TriggerActionChanges> updateTriggers = (List<TriggerActionChanges>)getSessionObject(request, UPDATE_SKIP_PATTERN_TRIGGERS);
          List<TriggerActionChanges> associatedTriggers = (List<TriggerActionChanges>)getSessionObject(request, PROTOCOL_ASSOCIATED_TRIGGERS);
          FormActionUtil.updateSkipPatternInSession((Form)getSessionObject(request, CRF), associatedTriggers);
          if (updateTriggers !=null){
            if (associatedTriggers!=null)
              updateTriggers.addAll(associatedTriggers);          
          }else{
              updateTriggers = associatedTriggers;
          }
          setSessionObject(request, UPDATE_SKIP_PATTERN_TRIGGERS, updateTriggers);
          removeSessionObject(request,PROTOCOL_ASSOCIATED_TRIGGERS);          
      }
      return mapping.findForward(SUCCESS);
      }


    private boolean alreadyExist(List old, String newId){
        for (int i=0; i<old.size(); i++){
            Protocol p = (Protocol)old.get(i);
            if (p.getProtoIdseq().equals(newId)){
                return true;
            }
        }
        return false;
    }
    
    
    private boolean validValueHasSkipPattern(){
        boolean ret = false;
        return ret;
    }
    
}
