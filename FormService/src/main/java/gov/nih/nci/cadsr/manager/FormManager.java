package gov.nih.nci.cadsr.manager;

import java.util.Collection;

import gov.nih.nci.ncicb.cadsr.common.dto.InstructionTransferObject;
import gov.nih.nci.ncicb.cadsr.common.resource.NCIUser;
import gov.nih.nci.cadsr.domain.Instruction;
import gov.nih.nci.cadsr.model.CurrentForm;
import gov.nih.nci.cadsr.model.FormWrapper;

public interface FormManager {
	/*
	 * public List<Form> searchForm(String formLongName, String protocolIdSeq,
	 * String workflow, String category, String type, String
	 * classificationIdSeq, String publicId, String version) throws
	 * SQLException;
	 */
	public Collection getAllForms(String formLongName, String protocolIdSeq, String contextIdSeq, String workflow,
			String categoryName, String type, String classificationIdSeq, String publicId, String version,
			String moduleLongName, String cdePublicId, NCIUser user, String contextRestriction);

	public void createFormComponent(FormWrapper form, InstructionTransferObject headerInstruction, InstructionTransferObject footerInstruction);
	
	public void updateForm(String formIdSeq, CurrentForm form);

}
