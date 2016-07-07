package gov.nih.nci.cadsr.controller;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import gov.nih.nci.cadsr.FormServiceProperties;

@RestController
public class FormController {
	
	private static final Logger logger = Logger.getLogger(FormController.class);
	
	@Autowired
	private FormServiceProperties props;

	@RequestMapping(value = "/helloworld", method = RequestMethod.GET)
	public String getGreeting() {
		String result = "Hello World!";
		logger.error("calling hello world");
		return result;
	}
	
	@RequestMapping(value = "/getproperty", method = RequestMethod.GET)
	public String getProperty() {
		String result = props.getTestProp();
		logger.error("calling get property");
		return result;
	}
	
}
