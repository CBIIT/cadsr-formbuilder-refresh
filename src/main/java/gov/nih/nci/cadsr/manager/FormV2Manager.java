package gov.nih.nci.cadsr.manager;

import javax.servlet.http.HttpServletRequest;

public interface FormV2Manager {
	
	
	public byte[] download(String formIdSeq, HttpServletRequest request) ;

}
