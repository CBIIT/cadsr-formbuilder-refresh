package gov.nih.nci.cadsr.api.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController

public class TestController {

	@RequestMapping(value = "/test", method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity<String> test() {
		String message = "testcontoller";

		return new ResponseEntity("message", HttpStatus.OK);

	}

	@RequestMapping(value = "/error", method = {

			RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT,

			RequestMethod.DELETE }, produces = { "application/json" })

	public ResponseEntity<String> getErrorMsg() {

		String message = "not allowed Edit Form because other user is editing the Form ";
		return new ResponseEntity(message, HttpStatus.OK);

	}

}
