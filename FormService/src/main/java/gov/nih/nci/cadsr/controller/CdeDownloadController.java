package gov.nih.nci.cadsr.controller;

import java.io.ByteArrayOutputStream;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.lang.reflect.InvocationTargetException;
import java.util.Collection;
import java.util.HashSet;

import javax.naming.OperationNotSupportedException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.struts.actions.DownloadAction.StreamInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import gov.nih.nci.cadsr.dao.impl.CdeDownloadRepo;
import gov.nih.nci.cadsr.manager.GetExcelDownLoadManager;
import gov.nih.nci.ncicb.cadsr.common.CaDSRConstants;
import gov.nih.nci.ncicb.cadsr.common.downloads.GetExcelDownload;
import gov.nih.nci.ncicb.cadsr.common.downloads.impl.GetExcelDownloadImpl;
import gov.nih.nci.ncicb.cadsr.common.util.ContentTypeHelper;
import gov.nih.nci.ncicb.cadsr.common.util.DBUtil;
import gov.nih.nci.ncicb.cadsr.objectCart.CDECart;
import gov.nih.nci.ncicb.cadsr.objectCart.CDECartItem;
import gov.nih.nci.ncicb.cadsr.objectCart.CDECartItemTransferObject;
import gov.nih.nci.ncicb.cadsr.objectCart.CDECartTransferObject;

@RestController
public class CdeDownloadController {
	@Autowired
	private CdeDownloadRepo dw;
	@Autowired
	private GetExcelDownLoadManager excelDownload;

	@RequestMapping(value = "/cdexmlDownload", method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity downloadFormXML(HttpServletRequest request, HttpServletResponse response) throws Exception {

		throw new OperationNotSupportedException();
/*
			CDECart cart = new CDECartTransferObject();

			String fileName = null;
			// String type = request.getParameter("type");
			DBUtil util = new DBUtil();
			
			 * String jndiName = util.getJNDIProperty(); if (jndiName !=null &&
			 * !jndiName.equals("")) jndiName = "java:comp/env/jdbc/" +
			 * jndiName;
			 
			Collection items = new HashSet();
			CDECartItem item1 = new CDECartItemTransferObject();
			item1.setId("99BA9DC8-29C9-4E69-E034-080020C9C0E0");
			items.add(item1);

			CDECart sessionCart = new CDECartTransferObject();
			sessionCart.setDataElements(items);
			// GetXMLDownload xmlDown = new GetXMLDownloadImpl();
			dw.generateXMLForCDECart(sessionCart, "cdeCart");
			// xmlDown.generateXMLForCDECart(sessionCart, "cdeCart", jndiName);
			// fileName = xmlDown.getFileName("");
			fileName = dw.getFileName("");


			final String downFileName = fileName;
			response.setHeader("Content-Disposition", "attachment; filename=" + fileName);

			StreamInfo info = new StreamInfo() {
				public String getContentType() {
					return ContentTypeHelper.getContentType(downFileName);
				}

				public InputStream getInputStream() throws IOException {
					FileInputStream fis = new FileInputStream(downFileName);
					return fis;
				}
			};

		

		return new ResponseEntity(HttpStatus.OK);
	*/
		}

	@RequestMapping(value = "/cdexlsDownload", method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity<byte[]> downloadCdeXls(@RequestParam(value = "cdeId") String cdeId, HttpServletRequest request) throws Exception {
		
		String str = cdeId;
		String[] ids = str.split(",");
		
		String fileName = null;
		
		Collection items = new HashSet();
		
		for(String id : ids){
			CDECartItem cart = new CDECartItemTransferObject();
			cart.setId(id);
			items.add(cart);
		}
		
		
		CDECart sessionCart = new CDECartTransferObject();
		sessionCart.setDataElements(items);
		
		HSSFWorkbook hSSFWorkbook = excelDownload.generateExcelForCDECart(sessionCart, "cdeCart");
		ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
		hSSFWorkbook.write(byteArrayOutputStream);
		byte[] resource = byteArrayOutputStream.toByteArray();
		fileName = excelDownload.getFileName();
		final String downFileName = fileName;
		
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.parseMediaType("application/vnd.ms-excel"));
		headers.setContentDispositionFormData("attachment", downFileName + ".xls");
		
		ResponseEntity response = new ResponseEntity(resource, headers, HttpStatus.OK);
		return response;
	}
}