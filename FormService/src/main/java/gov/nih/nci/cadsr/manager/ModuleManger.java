package gov.nih.nci.cadsr.manager;

import java.util.Collection;

import gov.nih.nci.cadsr.model.ModuleWrapper;
import gov.nih.nci.ncicb.cadsr.common.dto.ModuleTransferObject;

public interface ModuleManger {

	public void createModuleComponent(ModuleWrapper module);

	public Collection getModulesInAForm(String formId);

}
