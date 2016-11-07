package gov.nih.nci.cadsr.manager;

import java.util.Collection;

import gov.nih.nci.cadsr.model.frontend.FEForm;
import gov.nih.nci.cadsr.model.frontend.FEFormMetaData;
import gov.nih.nci.ncicb.cadsr.common.dto.FormTransferObject;
import gov.nih.nci.ncicb.cadsr.common.dto.FormV2TransferObject;
import gov.nih.nci.ncicb.cadsr.common.dto.InstructionTransferObject;
import gov.nih.nci.ncicb.cadsr.common.persistence.dao.FormDAO;
import gov.nih.nci.ncicb.cadsr.common.resource.Form;
import gov.nih.nci.ncicb.cadsr.common.resource.NCIUser;

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

	public FEFormMetaData createFormComponent(FEFormMetaData form, InstructionTransferObject headerInstruction, InstructionTransferObject footerInstruction);
	
	public FormTransferObject getFullForm(String formIdSeq);
	public FormV2TransferObject getFullFormV2(String formIdSeq);
	public FormTransferObject getFormRow(String formIdSeq);
	
	public InstructionTransferObject buildHeaderInstructions(FEFormMetaData form);
	
	public InstructionTransferObject buildFooterInstructions(FEFormMetaData form);
	
	public String updateForm(FEForm form, FEForm oldForm);
	
	public FEForm testTranslateDBFormToBBForm(FormTransferObject fullForm);
	
	/**
	 * 
	 * Performance Test Methods
	 * 
	 */
	
	public String getFormPerformanceTest(String formIdSeq);
	 public String copyForm(String sourceFormPK, Form newForm);
	 
	 public int deleteForm(String formPK);
	    
	
}
