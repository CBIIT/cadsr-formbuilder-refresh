package gov.nih.nci.cadsr;

import org.springframework.beans.factory.annotation.Value;

public class FormBuilderProperties {
	
	private static final String DEFAULT_REMOTE_SERVICE_HOST = "http://localhost:8080/";
	
	@Value("#{propertyConfigurer['formservice.api.url']}")
	private String formServiceApiUrl;
	
	
	public String getFormServiceApiUrl() {

		if (formServiceApiUrl == null || formServiceApiUrl.isEmpty()) {
			return DEFAULT_REMOTE_SERVICE_HOST;
		} else {
			return formServiceApiUrl;

		}
	}
}
