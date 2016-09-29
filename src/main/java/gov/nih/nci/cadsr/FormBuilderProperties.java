package gov.nih.nci.cadsr;

import org.springframework.beans.factory.annotation.Value;

public class FormBuilderProperties {
	
	private static final String DEFAULT_REMOTE_SERVICE_HOST = "http://localhost:8080/";
	private static final String DEFAULT_SALT = "12345678abcdefgh";
	
	@Value("#{propertyConfigurer['formservice.api.url']}")
	private String formServiceApiUrl;
	
	@Value("#{propertyConfigurer['formbuilder.auth.salt']}")
	private String formBuilderSalt;
	
	@Value("#{propertyConfigurer['formbuilder.local.mode']}")
	private String formBuilderLocalMode;
	
	public String getFormServiceApiUrl() {

		if (formServiceApiUrl == null || formServiceApiUrl.isEmpty()) {
			return DEFAULT_REMOTE_SERVICE_HOST;
		} else {
			return formServiceApiUrl;

		}
	}
	
	public String getFormBuilderSalt(){
		if (formBuilderSalt == null || formBuilderSalt.isEmpty()) {
			return DEFAULT_SALT;
		}
		else{
			return formBuilderSalt;
		}
	}
	
	public Boolean getFormBuilderLocalMode(){
		if (formBuilderLocalMode == null || formBuilderLocalMode == "") {
			return Boolean.FALSE;
		}
		else{
			return Boolean.valueOf(formBuilderLocalMode);
		}
	}
}
