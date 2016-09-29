package gov.nih.nci.ncicb.cadsr.formbuilder.struts.actions;

import gov.nih.nci.ncicb.cadsr.common.resource.AdminComponentType;
import gov.nih.nci.ncicb.cadsr.common.resource.ComponentType;
import gov.nih.nci.ncicb.cadsr.formbuilder.ejb.service.FormBuilderService;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import org.apache.struts.action.DynaActionForm;

public class ValidValuesDisplayAction extends
		FormBuilderBaseDispatchAction {

	public ActionForward displayValidValues(
		      ActionMapping mapping,
		      ActionForm form,
		      HttpServletRequest request,
		      HttpServletResponse response) throws Exception {
		DynaActionForm frm = (DynaActionForm)form;

		String publicId = (String)frm.get("publicId");
		String version = (String)frm.get("version");
		
		if (publicId == null || publicId.trim().equals("") || version == null || version.trim().equals("")) {
			return mapping.findForward("error");
		}
		
		try{
			Integer.parseInt(publicId);
			Float.parseFloat(version);
		}
		catch (NumberFormatException nfe)
		{
			nfe.printStackTrace();
			return mapping.findForward("error");
		}
		
		FormBuilderService service = getFormBuilderService(request);
		AdminComponentType adminCompType = service.getComponentType(publicId, version);
		Map pvMap = null;
		
		if (adminCompType != null) {
			List<String> idSeqs = new ArrayList<String>();
			idSeqs.add(adminCompType.getIdseq());
			ComponentType compType = adminCompType.getComponentType();

			if (compType == ComponentType.CDE) {
				pvMap = service.getCDEPermissibleValues(idSeqs);
			}
			else if (compType == ComponentType.VD) {
				pvMap = service.getVDPermissibleValues(idSeqs);
			}
			else if (compType == ComponentType.FORMELEMENT) {
				pvMap = service.getQuestionValidValues(idSeqs);
			}
			
			if (pvMap != null && pvMap.size() > 0) {
				Map resp = new HashMap();
				if (!pvMap.values().isEmpty()) {
					Object vals = pvMap.values().iterator().next();
					resp.put(adminCompType, vals);
				}
				else {
					resp.put(adminCompType, new ArrayList());
				}
				
				request.setAttribute("pvMap", resp);
			}
		}		
		
		return mapping.findForward("success");
	}
}
