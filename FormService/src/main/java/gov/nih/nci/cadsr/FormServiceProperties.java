package gov.nih.nci.cadsr;

import org.springframework.beans.factory.annotation.Value;

public class FormServiceProperties {

	private static final String DEFAULT_TEST_VALUE = "default test property";

	@Value("${oracle.url}")
	private String oracleUrl;

	public String getOracleUrl() {
		return oracleUrl;
	}
	
	@Value("#{appProperties['testEnv']}")
	private String testEnv;
	
	public String getTestEnv() {
		return testEnv;
	}

}
