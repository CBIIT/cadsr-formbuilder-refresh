package gov.nih.nci.cadsr.manager;

import javax.servlet.http.HttpServletRequest;

public interface FormV2ExcelDownloadManger {
	public byte[] downloadExcel(String formIdSeq, HttpServletRequest request);

}
