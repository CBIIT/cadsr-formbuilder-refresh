package gov.nih.nci.cadsr.manager.impl;

import java.io.FileOutputStream;
import java.util.Iterator;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFFont;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import gov.nih.nci.cadsr.controller.FormV2ExcelDownloadController;
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
import gov.nih.nci.ncicb.cadsr.formbuilder.struts.common.FormJspUtil;

@Service

public class FormV2ExcelDownloadMangerImpl implements FormV2ExcelDownloadManger {
	private static Log log = LogFactory.getLog(FormV2ExcelDownloadMangerImpl.class.getName());

	@Autowired
	FormBuilderService formBuilderService;

	@Override
	public byte[] downloadExcel(String formIdSeq, HttpServletRequest request) {

		FormV2 crf = new FormV2TransferObject();

		try {
			if (!FormBuilderUtil.validateIdSeqRequestParameter(formIdSeq))
				throw new FatalException("Invalid form download parameters.",
						new Exception("Invalid form download parameters."));
			crf = formBuilderService.getFormDetailsV2(formIdSeq);
		} catch (Exception exp) {
			log.error("Exception getting CRF", exp);

		}
		byte[] body = null;
		try {

			// create a new excel workbook
			HSSFWorkbook wb = new HSSFWorkbook();
			HSSFSheet sheet = wb.createSheet();
			int rowNumber = 0;

			// create bold cell style
			HSSFCellStyle boldCellStyle = wb.createCellStyle();
			HSSFFont font = wb.createFont();
			font.setBoldweight(HSSFFont.BOLDWEIGHT_BOLD);
			boldCellStyle.setFont(font);
			boldCellStyle.setAlignment(HSSFCellStyle.ALIGN_GENERAL);

			// Create a row and put some cells in it. Rows are 0 based.
			HSSFRow row = sheet.createRow(rowNumber++);
			HSSFCell cell = row.createCell((short) 0);
			cell.setCellValue("Long Name");
			cell.setCellStyle(boldCellStyle);
			row.createCell((short) 1).setCellValue(crf.getLongName());

			row = sheet.createRow(rowNumber++);
			cell = row.createCell((short) 0);
			cell.setCellValue("Definition");
			cell.setCellStyle(boldCellStyle);
			row.createCell((short) 1).setCellValue(crf.getPreferredDefinition());

			row = sheet.createRow(rowNumber++);
			cell = row.createCell((short) 0);
			cell.setCellValue("Context");
			cell.setCellStyle(boldCellStyle);
			row.createCell((short) 1).setCellValue(crf.getContext().getName());

			// for multiple protocols.
			List protocols = crf.getProtocols();
			if (protocols != null && !protocols.isEmpty()) {
				Iterator it = protocols.iterator();
				while (it.hasNext()) {
					Protocol p = (Protocol) it.next();
					row = sheet.createRow(rowNumber++);
					cell = row.createCell((short) 0);
					cell.setCellValue("Protocol Long Name");
					cell.setCellStyle(boldCellStyle);
					row.createCell((short) 1).setCellValue(p.getLongName());
				}
			}

			row = sheet.createRow(rowNumber++);
			cell = row.createCell((short) 0);
			cell.setCellValue("Workflow");
			cell.setCellStyle(boldCellStyle);
			row.createCell((short) 1).setCellValue(crf.getAslName());

			row = sheet.createRow(rowNumber++);
			cell = row.createCell((short) 0);
			cell.setCellValue("Type");
			cell.setCellStyle(boldCellStyle);
			row.createCell((short) 1).setCellValue(crf.getFormType());

			row = sheet.createRow(rowNumber++);
			cell = row.createCell((short) 0);
			cell.setCellValue("caDSR RAI");
			cell.setCellStyle(boldCellStyle);
			row.createCell((short) 1).setCellValue(((FormElementTransferObject) crf).getRegistryId());

			row = sheet.createRow(rowNumber++);
			cell = row.createCell((short) 0);
			cell.setCellValue("Public ID");
			cell.setCellStyle(boldCellStyle);
			row.createCell((short) 1).setCellValue(crf.getPublicId());

			row = sheet.createRow(rowNumber++);
			cell = row.createCell((short) 0);
			cell.setCellValue("Version");
			cell.setCellStyle(boldCellStyle);
			row.createCell((short) 1).setCellValue(crf.getVersion().toString());

			if (crf.getInstruction() != null) {
				row = sheet.createRow(rowNumber++);

				cell = row.createCell((short) 0);
				cell.setCellValue("Header Instruction");
				cell.setCellStyle(boldCellStyle);
				row.createCell((short) 1).setCellValue(crf.getInstruction().getPreferredDefinition());
			}

			if (crf.getFooterInstruction() != null) {
				row = sheet.createRow(rowNumber++);

				cell = row.createCell((short) 0);
				cell.setCellValue("Footer Instruction");
				cell.setCellStyle(boldCellStyle);
				row.createCell((short) 1).setCellValue(crf.getFooterInstruction().getPreferredDefinition());
			}

			// export module related info
			List modules = crf.getModules();

			if (modules.size() > 0) {
				// add a blank line
				short colNumber = 0;

				row = sheet.createRow(rowNumber++);
				row = sheet.createRow(rowNumber++);
				cell = row.createCell(colNumber++);
				cell.setCellValue("Module Long Name");
				cell.setCellStyle(boldCellStyle);

				cell = row.createCell(colNumber++);
				cell.setCellValue("Module Instructions");
				cell.setCellStyle(boldCellStyle);

				cell = row.createCell(colNumber++);
				cell.setCellValue("Number of Repetitions");
				cell.setCellStyle(boldCellStyle);

				cell = row.createCell(colNumber++);
				cell.setCellValue("Question");
				cell.setCellStyle(boldCellStyle);
				cell = row.createCell(colNumber++);
				cell.setCellValue("CDE");
				cell.setCellStyle(boldCellStyle);
				cell = row.createCell(colNumber++);
				cell.setCellValue("CDE Public ID");
				cell.setCellStyle(boldCellStyle);
				cell = row.createCell(colNumber++);
				cell.setCellValue("CDE Version");
				cell.setCellStyle(boldCellStyle);
				cell = row.createCell(colNumber++);
				cell.setCellValue("Question Instructions");
				cell.setCellStyle(boldCellStyle);

				// question mandatory
				cell = row.createCell(colNumber++);
				cell.setCellValue("Answer is Mandatory");
				cell.setCellStyle(boldCellStyle);

				// question default value
				cell = row.createCell(colNumber++);
				cell.setCellValue("Question Default Value");
				cell.setCellStyle(boldCellStyle);

				// value domain details
				cell = row.createCell(colNumber++);
				cell.setCellValue("Value Domain Long Name");
				cell.setCellStyle(boldCellStyle);
				cell = row.createCell(colNumber++);
				cell.setCellValue("Value Domain Data Type");
				cell.setCellStyle(boldCellStyle);
				cell = row.createCell(colNumber++);
				cell.setCellValue("Value Domain Unit of Measure");
				cell.setCellStyle(boldCellStyle);
				cell = row.createCell(colNumber++);
				cell.setCellValue("Display Format");
				cell.setCellStyle(boldCellStyle);
				cell = row.createCell(colNumber++);
				cell.setCellValue("Concepts");
				cell.setCellStyle(boldCellStyle);

				cell = row.createCell(colNumber++);
				cell.setCellValue("Valid Value");
				cell.setCellStyle(boldCellStyle);
				cell = row.createCell(colNumber++);
				cell.setCellValue("Form Value Meaning Text");
				cell.setCellStyle(boldCellStyle);
				cell = row.createCell(colNumber++);
				cell.setCellValue("Form Value Meaning Public ID Version");
				cell.setCellStyle(boldCellStyle);
				cell = row.createCell(colNumber++);
				cell.setCellValue("Form Value Meaning Desc.");
				cell.setCellStyle(boldCellStyle);
				cell = row.createCell(colNumber++);
				cell.setCellValue("Valid Value Instructions");
				cell.setCellStyle(boldCellStyle);

				cell = row.createCell(colNumber++);
				cell.setCellValue("Module Preferred Name");
				cell.setCellStyle(boldCellStyle);
				cell = row.createCell(colNumber++);
				cell.setCellValue("Module Preferred Definition");
				cell.setCellStyle(boldCellStyle);
				cell = row.createCell(colNumber++);
				cell.setCellValue("Module Public Id");
				cell.setCellStyle(boldCellStyle);
				cell = row.createCell(colNumber++);
				cell.setCellValue("Module Version");
				cell.setCellStyle(boldCellStyle);
				cell = row.createCell(colNumber++);
				cell.setCellValue("Module Display Order");
				cell.setCellStyle(boldCellStyle);

				for (int i = 0; i < modules.size(); i++) {
					Module module = (Module) modules.get(i);

					row = sheet.createRow(rowNumber++);
					row.createCell((short) 0).setCellValue(module.getLongName());

					if (module.getInstruction() != null)
						row.createCell((short) 1).setCellValue(module.getInstruction().getPreferredDefinition());

					row.createCell((short) 2).setCellValue("" + module.getNumberOfRepeats());

					row.createCell((short) 20).setCellValue(module.getPreferredName());
					row.createCell((short) 21).setCellValue(module.getPreferredDefinition());
					row.createCell((short) 22).setCellValue(module.getPublicId());
					row.createCell((short) 23).setCellValue(module.getVersion());
					row.createCell((short) 24).setCellValue(module.getDisplayOrder());

					// export question related info
					List questions = module.getQuestions();

					for (int iQues = 0; iQues < questions.size(); iQues++) {
						row = sheet.createRow(rowNumber++);

						Question question = (Question) questions.get(iQues);
						DataElement cde = question.getDataElement();

						colNumber = 3;
						String longName = FormJspUtil.updateDataForSpecialCharacters(question.getLongName());
						row.createCell(colNumber++).setCellValue(longName);
						// row.createCell(colNumber++).setCellValue("test
						// special character < 7*minutes Superscript: (x2) x
						// Subscript: (x2) x\u2082(\u03BB)Plus-minus: ()Alpha:
						// (\u03B1)Gamma: (\u03B3)Delta: (\u03B4)");

						if (cde != null) {
							row.createCell(colNumber++).setCellValue(cde.getLongName());
							row.createCell(colNumber++).setCellValue(cde.getCDEId());
							row.createCell(colNumber++).setCellValue(cde.getVersion().toString());
						} else
							colNumber += 3;

						if (question.getInstruction() != null)
							row.createCell(colNumber++)
									.setCellValue(question.getInstruction().getPreferredDefinition());
						else
							colNumber++;

						if (question.isMandatory())
							row.createCell(colNumber++).setCellValue("Yes");
						else
							row.createCell(colNumber++).setCellValue("No");

						// question default value
						String questionDefaultValue = question.getDefaultValue();
						if (questionDefaultValue == null || questionDefaultValue.length() == 0) {
							FormValidValue fvv = question.getDefaultValidValue();
							if (fvv != null && fvv.getLongName() != null) {
								questionDefaultValue = fvv.getLongName();
							}
						}

						row.createCell(colNumber++)
								.setCellValue(FormJspUtil.updateDataForSpecialCharacters(questionDefaultValue));
						String vdLongName = "";
						String vdDataType = "";
						String vdUnitOfMeasure = "";
						String vdDisplayFormat = "";
						String vdConcepts = "";

						DataElement de = question.getDataElement();
						if (de != null) {
							ValueDomain vd = de.getValueDomain();
							if (vd != null) {
								vdLongName = vd.getLongName();
								vdDataType = vd.getDatatype();
								vdDisplayFormat = vd.getDisplayFormat();
								vdUnitOfMeasure = vd.getUnitOfMeasure();
								/*
								 * vdConcepts =
								 * CDEDetailsUtils.getConceptCodesUrl(
								 * vd.getConceptDerivationRule(),
								 * CDEBrowserParams.getInstance(),"link",",");
								 */
							}
						}

						row.createCell(colNumber++).setCellValue(vdLongName);
						row.createCell(colNumber++).setCellValue(vdDataType);
						row.createCell(colNumber++).setCellValue(vdUnitOfMeasure);
						row.createCell(colNumber++).setCellValue(vdDisplayFormat);
						// row.createCell(colNumber++).setCellValue(vdConcepts);

						// export valid value related info
						List validValues = question.getValidValues();

						if (validValues.size() > 0) {
							short vvColNum = colNumber;

							for (int iVVs = 0; iVVs < validValues.size(); iVVs++) {
								FormValidValue validValue = (FormValidValue) validValues.get(iVVs);

								row = sheet.createRow(rowNumber++);
								colNumber = vvColNum;
								longName = FormJspUtil.updateDataForSpecialCharacters(validValue.getLongName());
								row.createCell(colNumber++).setCellValue(longName);
								row.createCell(colNumber++).setCellValue(validValue.getFormValueMeaningText());
								row.createCell(colNumber++).setCellValue(validValue.getFormValueMeaningIdVersion());
								row.createCell(colNumber++).setCellValue(validValue.getFormValueMeaningDesc());

								if (validValue.getInstruction() != null)
									row.createCell(colNumber++)
											.setCellValue(validValue.getInstruction().getPreferredDefinition());
							}
						}
					}
				}
			}

			// CDEBrowserParams params = CDEBrowserParams.getInstance();
			String excelFilename = "Form" + crf.getPublicId() + "_v" + crf.getVersion();
			excelFilename = excelFilename.replace('/', '_').replace('.', '_');
			// excelFilename="C:\\Users\\bbirha\\Downloads\\"+excelFilename+".xls";
			// excelFilename = params.getXMLDownloadDir() + excelFilename+
			// ".xls";
			body = wb.getBytes();
			FileOutputStream fileOut = new FileOutputStream(excelFilename);
			wb.write(fileOut);
			fileOut.close();

			request.setAttribute("fileName", excelFilename);
		} catch (Exception exp) {
			log.error("Exception downolad Excel", exp);

		}
		return body;
	}
}
