package gov.nih.nci.cadsr;

import org.springframework.beans.factory.annotation.Value;

public class FormServiceProperties {
	
	private static final String DEFAULT_TEST_VALUE = "default test property";
	
	@Value("#{applicationProperties['test.value']}")
	private String testProperty;
	
	public String getTestProp() {

		if (testProperty == null || testProperty.isEmpty()) {
			return DEFAULT_TEST_VALUE;
		} else {
			return testProperty;

		}
	}

}
