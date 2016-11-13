package gov.nih.nci.cadsr.api.controller;

import javax.naming.OperationNotSupportedException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import gov.nih.nci.cadsr.FormBuilderConstants;
import gov.nih.nci.cadsr.FormBuilderProperties;

@RestController
@RequestMapping(value = "/cde")
public class CDEAdapterController {
	
	@Autowired
	private FormBuilderProperties props;
	
	@RequestMapping(value = "/xls/{cdeId}", method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity downloadCdeXls(@PathVariable String cdeId) {
		
		String uri = props.getFormServiceApiUrl() + FormBuilderConstants.FORMSERVICE_BASE_URL
				+ "cdexlsDownload" + "?cdeId=" + cdeId;
		
		RestTemplate restTemplate = new RestTemplate();
		return restTemplate.getForEntity(uri, byte[].class);
		
	}
	
	@RequestMapping(value = "/xml/{cdeId}", method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity downloadCdeXml(@PathVariable String cdeId) throws OperationNotSupportedException {
		
		throw new OperationNotSupportedException();
		
	}

}
