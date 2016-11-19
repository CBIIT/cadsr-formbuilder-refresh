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
import gov.nih.nci.ncicb.cadsr.common.dto.InstructionTransferObject;
import gov.nih.nci.ncicb.cadsr.common.dto.ModuleTransferObject;
import gov.nih.nci.ncicb.cadsr.common.resource.Form;
import gov.nih.nci.ncicb.cadsr.common.resource.Instruction;
import gov.nih.nci.ncicb.cadsr.common.resource.Module;
import gov.nih.nci.ncicb.cadsr.common.util.StringUtils;
import gov.nih.nci.ncicb.cadsr.formbuilder.struts.common.FormActionUtil;


public class ModuleCreateAction extends FormBuilderSecureBaseDispatchAction {


  /**
   * Prepares the Create Module page
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
  public ActionForward goToCreateModule(
    ActionMapping mapping,
    ActionForm form,
    HttpServletRequest request,
    HttpServletResponse response) throws IOException, ServletException {

    DynaActionForm dynaForm = (DynaActionForm)form;

    return mapping.findForward("toCreateModule");

  }


  /**
   * Create a module
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
  public ActionForward createModule(
    ActionMapping mapping,
    ActionForm form,
    HttpServletRequest request,
    HttpServletResponse response) throws IOException, ServletException {

    DynaActionForm dynaForm = (DynaActionForm)form;
    Module newModule = new ModuleTransferObject();
    Form crf = (Form) getSessionObject(request, CRF);
    
    int displayOrder = ((Integer)getSessionObject(request,MODULE_DISPLAY_ORDER_TO_COPY)).intValue();  //((Integer)dynaForm.get(DISPLAY_ORDER)).intValue();

    Form f = (Form)getSessionObject(request, CRF);

    newModule.setForm(f);
    newModule.setLongName((String)dynaForm.get(MODULE_LONG_NAME));
    newModule.setPreferredDefinition(newModule.getLongName());
    newModule.setAslName("DRAFT NEW");
    newModule.setVersion(new Float(1.0));
    newModule.setCreatedBy(request.getRemoteUser());
    newModule.setDisplayOrder(displayOrder);
    newModule.setQuestions(new ArrayList());

    String modInstrStr = (String)dynaForm.get(MODULE_INSTRUCTION);
    if (StringUtils.doesValueExist(modInstrStr)){
      Instruction newModHdrInst = new InstructionTransferObject();
      newModHdrInst.setLongName(newModule.getLongName());
      newModHdrInst.setPreferredDefinition(modInstrStr);
      newModHdrInst.setContext(crf.getContext());
      newModHdrInst.setAslName("DRAFT NEW");
      newModHdrInst.setVersion(new Float(1.0));
      newModHdrInst.setCreatedBy(request.getRemoteUser());
      newModHdrInst.setDisplayOrder(1);
      newModule.setInstruction(newModHdrInst);
    }
    
    List modules = crf.getModules();
                                      
    if(modules == null) {
      modules = new ArrayList();
      crf.setModules(modules);
    }

    if(displayOrder < modules.size()) {
      modules.add(displayOrder, newModule);
      //FormActionUtil.incrementDisplayOrder(modules, displayOrder + 1);
    } else {
      modules.add(newModule);
    }
    FormActionUtil.setInitDisplayOrders(modules); //This is done to set display order in a sequential order 
                                                    
    // Jump to the update location on the screen
    request.setAttribute(CaDSRConstants.ANCHOR,"M"+displayOrder);
        
    saveMessage("cadsr.formbuilder.module.add.success", request);
    
    removeSessionObject(request, MODULE_DISPLAY_ORDER_TO_COPY);
    removeSessionObject(request,IN_PROCESS);
    
    return mapping.findForward("toFormEdit");

  }

}

