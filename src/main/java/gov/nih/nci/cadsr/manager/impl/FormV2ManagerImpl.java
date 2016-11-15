package gov.nih.nci.cadsr.manager.impl;

import java.io.FileOutputStream;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;

import gov.nih.nci.cadsr.manager.FormV2Manager;
import gov.nih.nci.ncicb.cadsr.common.dto.FormV2TransferObject;
import gov.nih.nci.ncicb.cadsr.common.exception.FatalException;
import gov.nih.nci.ncicb.cadsr.common.resource.FormV2;

import gov.nih.nci.ncicb.cadsr.common.util.logging.Log;
import gov.nih.nci.ncicb.cadsr.common.util.logging.LogFactory;
import gov.nih.nci.ncicb.cadsr.formbuilder.ejb.service.FormBuilderService;
import gov.nih.nci.ncicb.cadsr.formbuilder.struts.common.FormBuilderUtil;
import gov.nih.nci.ncicb.cadsr.formbuilder.struts.common.FormConverterUtil;

@Service
public class FormV2ManagerImpl implements FormV2Manager{
	private static Log log = LogFactory.getLog(FormV2ManagerImpl.class.getName());
	@Autowired
	FormBuilderService formBuilderService;

	public byte[] download(String formIdSeq, HttpServletRequest request) {

		FormV2 crf = new FormV2TransferObject();

		try {
			if (!FormBuilderUtil.validateIdSeqRequestParameter(formIdSeq))
				throw new FatalException("Invalid form download parameters.",
						new Exception("Invalid form download parameters."));
			crf = formBuilderService.getFormDetailsV2(formIdSeq);
		} catch (Exception exp) {
			log.error("Exception getting CRF", exp);

		}
		byte[] xmlBytes = null;

		try {

			String convertedForm = FormConverterUtil.instance().convertFormToV2(crf);

			// CDEBrowserParams params = CDEBrowserParams.getInstance();
			String xmlFilename = "Form" + crf.getPublicId() + "_v" + crf.getVersion();
			xmlFilename = xmlFilename.replace('/', '_').replace('.', '_');
			// xmlFilename = params.getXMLDownloadDir() + xmlFilename + ".xml";
			// xmlFilename="C:\\Users\\bbirha\\Downloads\\"+xmlFilename+".xml";
			FileOutputStream fileOut = new FileOutputStream(xmlFilename);
			xmlBytes = convertedForm.getBytes();

			fileOut.write(xmlBytes);
			fileOut.flush();
			fileOut.close();

			request.setAttribute("fileName", xmlFilename);
		} catch (Exception exp) {
			log.error("Exception converting CRF", exp);

		}
		return xmlBytes;
	}

}
