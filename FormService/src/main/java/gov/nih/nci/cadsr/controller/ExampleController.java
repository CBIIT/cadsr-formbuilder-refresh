package gov.nih.nci.cadsr.controller;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import gov.nih.nci.cadsr.manager.ExampleManager;

@RestController
@RequestMapping(path="/example")
public class ExampleController {
	
	private static final Logger logger = Logger.getLogger(ExampleController.class);
	
	@Autowired
	private ExampleManager exManager;
	
	
	@RequestMapping(value = "/hello{name}", method = RequestMethod.GET)
	public String getName(@PathVariable String name) {
		String result = exManager.printName(name);
		logger.info("calling test hello name");
		return result;
	}
	
	@RequestMapping(value = "/ping/{db}", method = RequestMethod.GET)
	public String pingDb(@PathVariable String db) {
		String result = exManager.pingDb(db);
		return result;
	}
	
}
