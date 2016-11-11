package gov.nih.nci.cadsr.manager;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;

import org.apache.poi.hssf.usermodel.HSSFWorkbook;

public interface FormV2ExcelDownloadManger {
	public byte[] downloadExcel(String formIdSeq, HttpServletRequest request) throws IOException;

}
