package gov.nih.nci.cadsr.model.util;

import java.util.List;

import gov.nih.nci.cadsr.model.frontend.FEForm;
import gov.nih.nci.cadsr.model.frontend.FEFormMetaData;
import gov.nih.nci.cadsr.model.frontend.FEModule;
import gov.nih.nci.cadsr.model.frontend.FEQuestion;
import gov.nih.nci.cadsr.model.frontend.FEValidValue;
import gov.nih.nci.cadsr.model.frontend.FEBaseObject;
import gov.nih.nci.ncicb.cadsr.common.dto.AdminComponentTransferObject;
import gov.nih.nci.ncicb.cadsr.common.dto.FormTransferObject;
import gov.nih.nci.ncicb.cadsr.common.dto.FormValidValueChangeTransferObject;
import gov.nih.nci.ncicb.cadsr.common.dto.InstructionChangesTransferObject;
import gov.nih.nci.ncicb.cadsr.common.dto.ModuleChangesTransferObject;
import gov.nih.nci.ncicb.cadsr.common.dto.ModuleTransferObject;
import gov.nih.nci.ncicb.cadsr.common.dto.QuestionChangeTransferObject;
import gov.nih.nci.ncicb.cadsr.common.dto.QuestionTransferObject;
import gov.nih.nci.ncicb.cadsr.common.dto.ValidValueTransferObject;

public class ModelTranslatorUtil {
	
	public void convertTransferObjectToFEObject(AdminComponentTransferObject source, FEBaseObject target){
		
		if(source instanceof FormTransferObject){
			
		}
		else if(source instanceof ModuleTransferObject){
			
		}
		else if(source instanceof QuestionTransferObject){
			
		}
		
	}
	
	public void convertFEObjectToTransferObject(FEBaseObject source, AdminComponentTransferObject target){
		
		if(source instanceof FEForm){
			
		}
		else if(source instanceof FEFormMetaData){
			
		}
		else if(source instanceof FEModule){
			
		}
		else if(source instanceof FEQuestion){
			
		}
		else if(source instanceof FEValidValue){
			
		}
			
	}
	
	public void createModuleChangesObject(ModuleChangesTransferObject modulechanges, List<FEModule> modules){
		
	}
	
	public void createQuestionChangesObject(QuestionChangeTransferObject questionchanges, List<FEQuestion> questions){
		
	}
	
	public void createValidValueChangesObject(FormValidValueChangeTransferObject validvaluechanges, List<FEValidValue> validvalues){
		
	}
	
	public void createInstructionChangesObject(InstructionChangesTransferObject instructionchanges, List<String> instructions){
		
	}

}
