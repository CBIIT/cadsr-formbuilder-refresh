package gov.nih.nci.ncicb.cadsr.formbuilder.struts.actions;

import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.struts.action.Action;
import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import gov.nih.nci.ncicb.cadsr.common.CommonNavigationConstants;
import gov.nih.nci.ncicb.cadsr.common.exception.FatalException;
import gov.nih.nci.ncicb.cadsr.common.formbuilder.struts.common.FormConstants;
import gov.nih.nci.ncicb.cadsr.common.resource.FormV2;
import gov.nih.nci.ncicb.cadsr.common.util.CDEBrowserParams;
import gov.nih.nci.ncicb.cadsr.common.util.logging.Log;
import gov.nih.nci.ncicb.cadsr.common.util.logging.LogFactory;
import gov.nih.nci.ncicb.cadsr.formbuilder.ejb.service.FormBuilderService;
import gov.nih.nci.ncicb.cadsr.formbuilder.struts.common.FormBuilderUtil;
import gov.nih.nci.ncicb.cadsr.formbuilder.struts.common.FormConverterUtil;

public class FormDownloadXMLAction extends Action {
	private static Log log = LogFactory.getLog(FormDownloadXMLAction.class.getName());
	
	@Autowired
	FormBuilderService formBuilderService;

	public FormBuilderService getFormBuilderService(HttpServletRequest request) {
		if (formBuilderService == null)
		{
			ApplicationContext context =  WebApplicationContextUtils.getWebApplicationContext(request.getSession().getServletContext());
			formBuilderService = (FormBuilderService) context.getBean("formBuilderService");
		}
		return formBuilderService;
	}

	public void setFormBuilderService(FormBuilderService formBuilderService) {
		this.formBuilderService = formBuilderService;
	}

	public ActionForward execute(ActionMapping mapping, ActionForm form, HttpServletRequest request,
			HttpServletResponse response) throws IOException, ServletException {

		String formIdSeq = (String)request.getParameter(FormConstants.FORM_ID_SEQ);

		FormBuilderService service = getFormBuilderService(request);
		FormV2 crf = null;

		try {
			if (!FormBuilderUtil.validateIdSeqRequestParameter(formIdSeq))
				throw new FatalException("Invalid form download parameters.", new Exception("Invalid form download parameters."));
			crf = service.getFormDetailsV2(formIdSeq);
		} catch (Exception exp) {
			log.error("Exception getting CRF", exp);
			return mapping.findForward(CommonNavigationConstants.FAILURE);
		}

		try {
			String convertedForm = FormConverterUtil.instance().convertFormToV2(crf);  

			CDEBrowserParams params = CDEBrowserParams.getInstance();
			String xmlFilename ="Form"  + crf.getPublicId() + "_v" + crf.getVersion();
			xmlFilename = xmlFilename.replace('/', '_').replace('.', '_');
			xmlFilename = params.getXMLDownloadDir() + xmlFilename + ".xml";

			FileOutputStream fileOut = new FileOutputStream(xmlFilename);
			byte[] xmlBytes = convertedForm.getBytes();
			fileOut.write(xmlBytes);
			fileOut.flush();
			fileOut.close();

			request.setAttribute("fileName", xmlFilename);
		} catch (Exception exp) {
			log.error("Exception converting CRF", exp);
			return mapping.findForward(CommonNavigationConstants.FAILURE);
		}

		return mapping.findForward("downloadSuccess");
	}

}
