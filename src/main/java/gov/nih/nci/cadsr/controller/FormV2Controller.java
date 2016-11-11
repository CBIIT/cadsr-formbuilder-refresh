package gov.nih.nci.cadsr.controller;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

import javax.servlet.http.HttpServletRequest;

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
import gov.nih.nci.cadsr.manager.FormV2Manager;
import gov.nih.nci.ncicb.cadsr.common.dto.FormV2TransferObject;
import gov.nih.nci.ncicb.cadsr.common.resource.FormV2;
import gov.nih.nci.ncicb.cadsr.formbuilder.ejb.service.FormBuilderService;

@RestController
public class FormV2Controller {

	@Autowired
	FormV2Manager formV2Manager;

	@Autowired
	FormV2ExcelDownloadManger formV2ExcelDownloadManger;

	@Autowired
	FormBuilderService formBuilderService;

	@RequestMapping(value = "/formDownloadXml", method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity<ByteArrayResource> downloadFormXML(@RequestParam(value = "formIdSeq") String formIdSeq,
			HttpServletRequest request

	) {

		final byte[] resource = formV2Manager.download(formIdSeq, request);
		final ByteArrayResource byteResource = new ByteArrayResource(resource);

		HttpHeaders responseHeaders = new HttpHeaders();
		responseHeaders.setContentType(MediaType.APPLICATION_XML);
		responseHeaders.setContentDispositionFormData("attachment", "FormV2_" + formIdSeq + ".xml");

		ResponseEntity response = new ResponseEntity(byteResource, responseHeaders, HttpStatus.OK);
		return response;

	}

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
