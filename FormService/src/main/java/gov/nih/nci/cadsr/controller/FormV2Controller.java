package gov.nih.nci.cadsr.controller;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.core.io.ByteArrayResource;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import gov.nih.nci.cadsr.manager.FormV2Manager;


@RestController
public class FormV2Controller {

	@Autowired

	FormV2Manager formV2Manager;

	@RequestMapping(value = "/formDowload", method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity<ByteArrayResource> downloadFormXML(@RequestParam(value = "formIdSeq") String formIdSeq,
			HttpServletRequest request

	) {

		final byte[] resource = formV2Manager.download(formIdSeq, request);
		final ByteArrayResource byteResource = new ByteArrayResource(resource);

		return ResponseEntity.ok().contentType(MediaType.APPLICATION_OCTET_STREAM).body(byteResource);

	}

}
