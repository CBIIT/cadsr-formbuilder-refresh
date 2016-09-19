package gov.nih.nci.ncicb.cadsr.formbuilder.struts.actions;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;

import gov.nih.nci.ncicb.cadsr.common.CaDSRConstants;


public class CancelAction extends FormBuilderSecureBaseDispatchAction {
    public ActionForward getModuleToEdit(ActionMapping mapping,
        ActionForm form, HttpServletRequest request,
        HttpServletResponse response) throws IOException, ServletException {
        

       String questionIndexStr = (String)request.getParameter(QUESTION_INDEX);
       int questionIndex = 0;
       if(questionIndexStr!=null)
        questionIndex = Integer.parseInt(questionIndexStr);
    // Jump to the update location on the screen
      request.setAttribute(CaDSRConstants.ANCHOR,"Q"+questionIndex);
      
      String moduleIndexStr = (String)request.getParameter(MODULE_INDEX);
      
      if(moduleIndexStr !=null)
          Integer.parseInt(moduleIndexStr);
      
      request.setAttribute("questionIndex", questionIndexStr);
      request.setAttribute("moduleIndex", moduleIndexStr);
      
        return mapping.findForward("backToModuleEdit");
    }

    public ActionForward getFormToEdit(ActionMapping mapping, ActionForm form,
        HttpServletRequest request, HttpServletResponse response)
        throws IOException, ServletException {
        
       String displayOrderStr = (String)request.getParameter(DISPLAY_ORDER);
       int displayOrder = 0;
       if(displayOrderStr!=null)
        displayOrder = Integer.parseInt(displayOrderStr);
    // Jump to the update location on the screen
      request.setAttribute(CaDSRConstants.ANCHOR,"M"+displayOrder);

        
        return mapping.findForward("gotoFormEdit");
    }

    public ActionForward gotoSearch(ActionMapping mapping, ActionForm form,
        HttpServletRequest request, HttpServletResponse response)
        throws IOException, ServletException {

//         ((DynaActionForm]) form).set(METHOD_PARAM, GET_ALL_FORMS_METHOD);

        return mapping.findForward("gotoSearch");
    }

    public ActionForward gotoManageClassifications(ActionMapping mapping, ActionForm form,
        HttpServletRequest request, HttpServletResponse response)
        throws IOException, ServletException {

//         ((DynaActionForm]) form).set(METHOD_PARAM, GET_ALL_FORMS_METHOD);

        return mapping.findForward("gotoManageClassifications");
    }
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
    public ActionForward cancelSkipEdit(
     ActionMapping mapping,
     ActionForm form,
     HttpServletRequest request,
     HttpServletResponse response) throws IOException, ServletException {

       removeSessionObject(request,SKIP_PATTERN);
       removeSessionObject(request,SKIP_PATTERN_CLONE);
       removeSessionObject(request,SKIP_TARGET_FORM);
     return mapping.findForward("backToModuleEdit");
   }


}
