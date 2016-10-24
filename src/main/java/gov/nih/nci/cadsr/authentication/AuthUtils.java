package gov.nih.nci.cadsr.authentication;

//import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.beans.factory.annotation.Autowired;

import gov.nih.nci.cadsr.FormBuilderProperties;

public class AuthUtils {
	
	@Autowired
	private FormBuilderProperties props;
	
	public String md5(String password){
//		return DigestUtils.md5Hex(password);
		return "token";
	}

}
