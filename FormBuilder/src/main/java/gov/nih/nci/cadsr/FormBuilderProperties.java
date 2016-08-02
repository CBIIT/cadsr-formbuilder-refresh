package gov.nih.nci.cadsr;

import org.springframework.beans.factory.annotation.Value;

public class FormBuilderProperties {
	
	private static final String DEFAULT_LOCAL_SERVICE_HOST = "http://localhost:8080/";
	private static final String DEFAULT_REMOTE_SERVICE_HOST = "http://localhost:8080/";
	
	
	@Value("#{applicationProperties['formbuilder.api.url']}")
	private String formBuilderApiUrl;
	
	@Value("#{applicationProperties['formservice.api.url']}")
	private String formServiceApiUrl;
	
	
	public String getFormBuilderApiUrl() {

		if (formBuilderApiUrl == null || formBuilderApiUrl.isEmpty()) {
			return DEFAULT_LOCAL_SERVICE_HOST;
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

}
