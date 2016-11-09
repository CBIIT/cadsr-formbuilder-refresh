package gov.nih.nci.cadsr.manager;

import org.apache.poi.hssf.usermodel.HSSFWorkbook;

import gov.nih.nci.ncicb.cadsr.objectCart.CDECart;

public interface GetExcelDownLoadManager {
	
		public HSSFWorkbook generateExcelForCDECart(CDECart cart, String src) throws Exception ;
		
		public void generateExcelForDESearch(String sWhere, String src) throws Exception;
		
		public String getFileName();
		
		public void setFileName(String sfile);
	}


