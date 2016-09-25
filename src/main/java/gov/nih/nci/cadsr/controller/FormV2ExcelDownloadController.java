package gov.nih.nci.cadsr.controller;

import java.io.FileOutputStream;

import java.util.Iterator;
import java.util.List;

import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFFont;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;

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

import gov.nih.nci.cadsr.manager.FormV2ExcelDownloadManger;
import gov.nih.nci.ncicb.cadsr.common.dto.FormElementTransferObject;
import gov.nih.nci.ncicb.cadsr.common.dto.FormV2TransferObject;
import gov.nih.nci.ncicb.cadsr.common.exception.FatalException;

import gov.nih.nci.ncicb.cadsr.common.resource.DataElement;

import gov.nih.nci.ncicb.cadsr.common.resource.FormV2;
import gov.nih.nci.ncicb.cadsr.common.resource.FormValidValue;
import gov.nih.nci.ncicb.cadsr.common.resource.Module;
import gov.nih.nci.ncicb.cadsr.common.resource.Protocol;
import gov.nih.nci.ncicb.cadsr.common.resource.Question;
import gov.nih.nci.ncicb.cadsr.common.resource.ValueDomain;

import gov.nih.nci.ncicb.cadsr.common.util.logging.Log;
import gov.nih.nci.ncicb.cadsr.common.util.logging.LogFactory;
import gov.nih.nci.ncicb.cadsr.formbuilder.ejb.service.FormBuilderService;
import gov.nih.nci.ncicb.cadsr.formbuilder.struts.common.FormBuilderUtil;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import gov.nih.nci.ncicb.cadsr.formbuilder.struts.common.FormJspUtil;

@RestController

public class FormV2ExcelDownloadController {

	private static Log log = LogFactory.getLog(FormV2ExcelDownloadController.class.getName());

	@Autowired
	FormV2ExcelDownloadManger formV2ExcelDownloadManger;

	@RequestMapping(value = "/formDownloadExcel", method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity<ByteArrayResource> downloadFormExcel(@RequestParam(value = "formIdSeq") String formIdSeq,
			HttpServletRequest request) {
		final byte[] resource = formV2ExcelDownloadManger.downloadExcel(formIdSeq, request);
		final ByteArrayResource byteResource = new ByteArrayResource(resource);

		HttpHeaders responseHeaders = new HttpHeaders();
		responseHeaders.setContentType(new MediaType("application", "xls"));
		// responseHeaders.setContentType(new MediaType("application/vnd.ms-excel","xls"));

		responseHeaders.setContentDispositionFormData("attachment", "FormV2_" + formIdSeq + ".xls");

		ResponseEntity response = new ResponseEntity(byteResource, responseHeaders, HttpStatus.OK);

		return response;
	}
}
