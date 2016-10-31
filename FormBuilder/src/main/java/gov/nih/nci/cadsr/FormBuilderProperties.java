package gov.nih.nci.cadsr;

import org.springframework.beans.factory.annotation.Value;

public class FormBuilderProperties {
	
	private static final String DEFAULT_REMOTE_SERVICE_HOST = "http://locahost:8080/";
	private static final String DEFAULT_SALT = "12345678abcdefgh";
	private static final String DEFAULT_OBJECT_CART_URL = "http://objcart2-dev.nci.nih.gov/objcart10";
	
	@Value("#{propertyConfigurer['formbuilder.api.url']}")
	private String formBuilderApiUrl;
	
	@Value("#{propertyConfigurer['formservice.api.url']}")
	private String formServiceApiUrl;
	
	@Value("#{propertyConfigurer['formbuilder.auth.salt']}")
	private String formBuilderSalt;
	
	@Value("#{propertyConfigurer['formbuilder.local.mode']}")
	private String formBuilderLocalMode;
	
	@Value("#{propertyConfigurer['object.cart.url']}")
	private String objectCartUrl;
	
	public String getFormBuilderApiUrl() {

		if (formBuilderApiUrl == null || formBuilderApiUrl.isEmpty()) {
			return DEFAULT_REMOTE_SERVICE_HOST;
		} else {
			return formBuilderApiUrl;

		}
	}
	
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
	
	public String getObjectCartUrl(){
		if (objectCartUrl == null || objectCartUrl.isEmpty()) {
			return DEFAULT_OBJECT_CART_URL;
		}
		else{
			return objectCartUrl;
		}
	}
}
