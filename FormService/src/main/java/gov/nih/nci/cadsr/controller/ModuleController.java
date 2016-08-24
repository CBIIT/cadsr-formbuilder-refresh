package gov.nih.nci.cadsr.controller;

import java.util.Collection;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import gov.nih.nci.cadsr.manager.ModuleManger;
import gov.nih.nci.cadsr.model.ModuleWrapper;
import gov.nih.nci.ncicb.cadsr.common.dto.ModuleTransferObject;

@RestController
public class ModuleController {
	@Autowired
	private ModuleManger moduleManger;
	
	@RequestMapping(value = "/module", method = RequestMethod.POST, consumes = "application/json")
	@ResponseBody
	public ResponseEntity<ModuleWrapper> createModule(@RequestBody ModuleWrapper module) {
		
		moduleManger.createModuleComponent(module);
		
		//Moduletr newModule = new ModuleWrapper();
		//newModule.setModuleIdseq(module.getModuleIdseq());
		ResponseEntity<ModuleWrapper> response = createSuccessModuleResponse(module);
		return response;
	}
	@RequestMapping(value = "form/{id}", method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity getModulesInAForm(@PathVariable("id") String formId) {

		ResponseEntity<Collection> response = null;

		Collection moduleList;
		moduleList = moduleManger.getModulesInAForm(formId);

		response = createSuccessResponse(moduleList);
		return response;
	}
	
	

	private ResponseEntity<Collection> createSuccessResponse(final Collection modules) {

		return new ResponseEntity<Collection>(modules, HttpStatus.OK);
	}
	private ResponseEntity<ModuleWrapper> createSuccessModuleResponse(final ModuleWrapper moduleList) {
		
		return new ResponseEntity<ModuleWrapper>(moduleList, HttpStatus.OK);
	}
	
	

}
