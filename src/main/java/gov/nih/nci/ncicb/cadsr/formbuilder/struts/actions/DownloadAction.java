package gov.nih.nci.ncicb.cadsr.formbuilder.struts.actions;

import gov.nih.nci.ncicb.cadsr.common.CaDSRConstants;
import gov.nih.nci.ncicb.cadsr.common.downloads.GetExcelDownload;
import gov.nih.nci.ncicb.cadsr.common.downloads.GetXMLDownload;
import gov.nih.nci.ncicb.cadsr.common.downloads.impl.GetExcelDownloadImpl;
import gov.nih.nci.ncicb.cadsr.common.downloads.impl.GetXMLDownloadImpl;
import gov.nih.nci.ncicb.cadsr.common.util.ContentTypeHelper;
import gov.nih.nci.ncicb.cadsr.common.util.logging.Log;
import gov.nih.nci.ncicb.cadsr.common.util.logging.LogFactory;
import gov.nih.nci.ncicb.cadsr.objectCart.CDECart;
import gov.nih.nci.ncicb.cadsr.common.util.DBUtil;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionMapping;

/**
 * Action class for downloading data from the CDE cart in either xml or excel format
 * 
 * @author Ashwin Mathur
 * @version 1.0
 * @see org.apache.struts.actions.DownloadAction
 *
 */
public class DownloadAction extends org.apache.struts.actions.DownloadAction {
	private static Log log = LogFactory.getLog(DownloadAction.class.getName());
	@Override
	protected StreamInfo getStreamInfo(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response) throws Exception {

		String fileName = null;
		String type = request.getParameter("type");
		DBUtil util = new DBUtil();
		String jndiName = util.getJNDIProperty();
		if (jndiName !=null && !jndiName.equals(""))
			jndiName = "java:comp/env/jdbc/" + jndiName;
		if (type.equalsIgnoreCase("xml")) {
			CDECart sessionCart = (CDECart) this.getSessionObject(request, CaDSRConstants.CDE_CART);
		    GetXMLDownload xmlDown = new GetXMLDownloadImpl();
		    xmlDown.generateXMLForCDECart(sessionCart, "cdeCart", jndiName);
		    fileName = xmlDown.getFileName("");
		}
		else if (type.equalsIgnoreCase("excel")) {
			CDECart sessionCart = (CDECart) this.getSessionObject(request, CaDSRConstants.CDE_CART);
		      GetExcelDownload excelDown = new GetExcelDownloadImpl();
		      excelDown.generateExcelForCDECart(sessionCart, "cdeCart", jndiName);
		      fileName = excelDown.getFileName();
		}
		else if (type.equalsIgnoreCase("form"))
			fileName = (String)request.getAttribute("fileName");
		else return null;
		
		final String downFileName = fileName;
	    response.setHeader("Content-Disposition", "attachment; filename="+fileName);

		StreamInfo info = new StreamInfo() {
			public String getContentType() {
				return ContentTypeHelper.getContentType(downFileName);
			}
			public InputStream getInputStream() throws IOException {
				FileInputStream fis = new FileInputStream(downFileName);
				return fis;
			}
		};
		return info;
	}

	/**
	   * Retrieve a session object based on the request and the attribute name.
	   */
	  protected Object getSessionObject(
	    HttpServletRequest req,
	    String attrName) {
	    Object sessionObj = null;
	    HttpSession session = req.getSession(false);

	    if (session != null) {
	      sessionObj = session.getAttribute(attrName);
	    }

	    return sessionObj;
	  }
}
