package gov.nih.nci.cadsr.controller;

import java.io.BufferedInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Iterator;
import java.util.List;

import org.apache.poi.hssf.model.Workbook;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFFont;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.util.IOUtils;
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
import org.springframework.web.servlet.ModelAndView;

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
import javax.ws.rs.core.Response;

import gov.nih.nci.ncicb.cadsr.formbuilder.struts.common.FormJspUtil;

@RestController

public class FormV2ExcelDownloadController {

	private static Log log = LogFactory.getLog(FormV2ExcelDownloadController.class.getName());

	@Autowired
	FormV2ExcelDownloadManger formV2ExcelDownloadManger;
	@Autowired
	FormBuilderService formBuilderService;

	@RequestMapping(value = "/formDownloadExcel", method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity<byte[]> downloadFormExcel(@RequestParam(value = "formIdSeq") String formIdSeq,
			HttpServletRequest request) throws IOException {

		FormV2 crf = new FormV2TransferObject();
		crf = formBuilderService.getFormDetailsV2(formIdSeq);
		String excelFilename = "Form" + crf.getPublicId() + "_v" + crf.getVersion();
		excelFilename = excelFilename.replace('/', '_').replace('.', '_');

		HSSFWorkbook hSSFWorkbook = formV2ExcelDownloadManger.downloadExcel(formIdSeq, request);
		ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
		hSSFWorkbook.write(byteArrayOutputStream);
		byte[] resource = byteArrayOutputStream.toByteArray();

		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.parseMediaType("application/vnd.ms-excel"));
		headers.setContentDispositionFormData("attachment", excelFilename + ".xls");

		ResponseEntity response = new ResponseEntity(resource, headers, HttpStatus.OK);
		return response;
	}
}
