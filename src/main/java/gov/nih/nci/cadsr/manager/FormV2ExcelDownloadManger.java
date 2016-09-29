package gov.nih.nci.cadsr.manager;

import javax.servlet.http.HttpServletRequest;

import org.apache.poi.hssf.usermodel.HSSFWorkbook;

public interface FormV2ExcelDownloadManger {
	public HSSFWorkbook downloadExcel(String formIdSeq, HttpServletRequest request);

}
