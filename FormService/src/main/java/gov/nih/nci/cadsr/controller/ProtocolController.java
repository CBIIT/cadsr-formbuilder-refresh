package gov.nih.nci.cadsr.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import gov.nih.nci.cadsr.manager.ProtocolManager;
import gov.nih.nci.ncicb.cadsr.common.dto.ProtocolTransferObject;
import gov.nih.nci.ncicb.cadsr.common.resource.NCIUser;

@RestController
public class ProtocolController {

	@Autowired
	private ProtocolManager protocolManager;

	@RequestMapping(value = "/protocols/{keyword}", method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity<List<ProtocolTransferObject>> getProtocol(
			@PathVariable String keyword) {
	
		List<ProtocolTransferObject> protocolList = protocolManager.getProtocol(keyword);
		ResponseEntity<List<ProtocolTransferObject>> response = createSuccessResponse(protocolList);
		System.out.println("getting prots: " + protocolList.size());
		return response;

	}

	@RequestMapping(value = "Protocol/{id}", method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity<ProtocolTransferObject> getProtocolByPK(@PathVariable("id") String protocoldIdseq) {

		ProtocolTransferObject protoco = protocolManager.getProtocolByPK(protocoldIdseq);

		ResponseEntity<ProtocolTransferObject> response = createSuccessResponse(protoco);

		return response;
	}

	private ResponseEntity<ProtocolTransferObject> createSuccessResponse(final ProtocolTransferObject protoco) {

		return new ResponseEntity<ProtocolTransferObject>(protoco, HttpStatus.OK);
	}

	private ResponseEntity<List<ProtocolTransferObject>> createSuccessResponse(
			final List<ProtocolTransferObject> protocolList) {

		return new ResponseEntity<List<ProtocolTransferObject>>(protocolList, HttpStatus.OK);
	}

}
