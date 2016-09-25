package gov.nih.nci.cadsr.manager.impl;

import java.util.Collection;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import gov.nih.nci.cadsr.manager.ModuleManger;
import gov.nih.nci.cadsr.model.ModuleWrapper;
import gov.nih.nci.ncicb.cadsr.common.dto.ModuleTransferObject;
import gov.nih.nci.ncicb.cadsr.common.persistence.dao.AbstractDAOFactoryFB;
import gov.nih.nci.ncicb.cadsr.common.persistence.dao.FormDAO;
import gov.nih.nci.ncicb.cadsr.common.persistence.dao.ModuleDAO;
import gov.nih.nci.ncicb.cadsr.common.resource.Module;

@Service
public class ModuleMangerImpl implements ModuleManger {
	@Autowired

	AbstractDAOFactoryFB daoFactory;


	public void createModuleComponent(ModuleWrapper module) {
		
		ModuleDAO mdao = daoFactory.getModuleDAO();
		ModuleTransferObject moduleTransferObject =new ModuleTransferObject();
		moduleTransferObject.setLongName(module.getLongName());
		//moduleTransferObject.setIdseq(module.getIdSeq());
		/*moduleTransferObject.setConteIdseq(module.getConteIdseq());
		moduleTransferObject.setDisplayOrder(module.getDispOrder());
		moduleTransferObject.setModuleIdseq(module.getModuleIdseq());
		moduleTransferObject.setModifiedBy(module.getModifiedBy());
		moduleTransferObject.setAslName(module.getAslName());
		moduleTransferObject.setConteIdseq(module.getConteIdseq());
		moduleTransferObject.setCreatedBy(module.getCreatedBy());
		moduleTransferObject.setForm(module.getForm());
		moduleTransferObject.setQuestions(module.getQuestions());
		moduleTransferObject.setContext(module.getContext());
		*/
		//moduleTransferObject1.setForm(module.getForm());
		//moduleTransferObject1.setQuestions(module.getQuestions());
		//moduleTransferObject1.setDisplayOrder(module.getDispOrder());
		//moduleTransferObject1.setNumberOfRepeats(module.getNumberOfRepeats());
	String id = mdao.createModuleComponent(moduleTransferObject);
	//throw new RuntimeException("******" + moduleTransferObject.getLongName());
	module.setModuleIdseq(id);
	
		
		
	}


	@Override
	public Collection getModulesInAForm(String formId) {
		FormDAO dao = daoFactory.getFormDAO();
		
		return dao.getModulesInAForm(formId);
	}
	

}
