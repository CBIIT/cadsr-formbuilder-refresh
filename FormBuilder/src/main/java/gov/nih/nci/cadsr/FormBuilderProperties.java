package gov.nih.nci.cadsr;

import org.springframework.beans.factory.annotation.Value;

public class FormBuilderProperties {
	
	private static final String DEFAULT_TEST_VALUE = "default test property";
	
	@Value("#{applicationProperties['test.value']}")
	private String rExecutablePath;
	
	public String getRExecutablePath() {

		if (rExecutablePath == null || rExecutablePath.isEmpty()) {
			return DEFAULT_TEST_VALUE;
		} else {
			return rExecutablePath;

		}
	}

}
