package gov.nih.nci.cadsr.controller;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import gov.nih.nci.cadsr.FormServiceProperties;
import gov.nih.nci.cadsr.service.ExampleService;

@RestController
@RequestMapping(path="/example")
public class ExampleController {
	
	private static final Logger logger = Logger.getLogger(ExampleController.class);
	
	@Autowired
	private ExampleService exService;
	
	@Autowired
	private FormServiceProperties props;

	
	@RequestMapping(value = "/hello{name}", method = RequestMethod.GET)
	public String getName(@PathVariable String name) {
		String result = exService.printName(name);
		logger.error("calling test hello name");
		return result;
	}
	
}
