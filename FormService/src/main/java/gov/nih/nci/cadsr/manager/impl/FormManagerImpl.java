package gov.nih.nci.cadsr.manager.impl;

import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;

import gov.nih.nci.cadsr.manager.FormManager;
import gov.nih.nci.cadsr.model.BBContext;
import gov.nih.nci.cadsr.model.BBForm;
import gov.nih.nci.cadsr.model.BBFormMetaData;
import gov.nih.nci.cadsr.model.BBModule;
import gov.nih.nci.cadsr.model.BBProtocol;
import gov.nih.nci.cadsr.model.BBQuestion;
import gov.nih.nci.cadsr.model.BBValidValue;
import gov.nih.nci.ncicb.cadsr.common.dto.ContextTransferObject;
import gov.nih.nci.ncicb.cadsr.common.dto.DataElementTransferObject;
import gov.nih.nci.ncicb.cadsr.common.dto.FormInstructionChangesTransferObject;
import gov.nih.nci.ncicb.cadsr.common.dto.FormTransferObject;
import gov.nih.nci.ncicb.cadsr.common.dto.FormV2TransferObject;
import gov.nih.nci.ncicb.cadsr.common.dto.FormValidValueChangesTransferObject;
import gov.nih.nci.ncicb.cadsr.common.dto.FormValidValueTransferObject;
import gov.nih.nci.ncicb.cadsr.common.dto.InstructionChangesTransferObject;
import gov.nih.nci.ncicb.cadsr.common.dto.InstructionTransferObject;
import gov.nih.nci.ncicb.cadsr.common.dto.ModuleChangesTransferObject;
import gov.nih.nci.ncicb.cadsr.common.dto.ModuleTransferObject;
import gov.nih.nci.ncicb.cadsr.common.dto.ProtocolTransferObject;
import gov.nih.nci.ncicb.cadsr.common.dto.QuestionChangeTransferObject;
import gov.nih.nci.ncicb.cadsr.common.dto.QuestionTransferObject;
import gov.nih.nci.ncicb.cadsr.common.dto.ReferenceDocumentTransferObject;
import gov.nih.nci.ncicb.cadsr.common.dto.TriggerActionChangesTransferObject;
import gov.nih.nci.ncicb.cadsr.common.dto.ValidValueTransferObject;
import gov.nih.nci.ncicb.cadsr.common.dto.ValueDomainTransferObject;
import gov.nih.nci.ncicb.cadsr.common.exception.DMLException;
import gov.nih.nci.ncicb.cadsr.common.persistence.dao.AbstractDAOFactoryFB;
import gov.nih.nci.ncicb.cadsr.common.persistence.dao.ContextDAO;
import gov.nih.nci.ncicb.cadsr.common.persistence.dao.FormDAO;
import gov.nih.nci.ncicb.cadsr.common.persistence.dao.FormInstructionDAO;
import gov.nih.nci.ncicb.cadsr.common.persistence.dao.ModuleInstructionDAO;
import gov.nih.nci.ncicb.cadsr.common.persistence.dao.QuestionInstructionDAO;
import gov.nih.nci.ncicb.cadsr.common.persistence.dao.jdbc.JDBCFormDAOFB;
import gov.nih.nci.ncicb.cadsr.common.resource.Form;
import gov.nih.nci.ncicb.cadsr.common.resource.FormV2;
import gov.nih.nci.ncicb.cadsr.common.resource.NCIUser;
import gov.nih.nci.ncicb.cadsr.formbuilder.ejb.impl.FormBuilderServiceImpl;

@Service
public class FormManagerImpl implements FormManager {
	private static final Logger logger = Logger.getLogger(FormManagerImpl.class);
	@Autowired
	AbstractDAOFactoryFB daoFactory;
	@Autowired
	private JDBCFormDAOFB jd;
	@Autowired
	private FormBuilderServiceImpl service;

	@Override
	public Collection getAllForms(String formLongName, String protocolIdSeq, String contextIdSeq, String workflow,
			String categoryName, String type, String classificationIdSeq, String publicId, String version,
			String moduleLongName, String cdePublicId, NCIUser user, String contextRestriction) {
		long startTimer = System.currentTimeMillis();
		
		//Testing new CI Build

		FormDAO dao = daoFactory.getFormDAO();
		ContextDAO contextDao = daoFactory.getContextDAO();

		Collection forms = null;

		try {
			// String contextRestriction = null;
			/**
			 * TT 1892 Context ctep = contextDao.getContextByName(Context.CTEP);
			 * 
			 * if((user!=null&&!user.hasRoleAccess(CaDSRConstants.CDE_MANAGER,
			 * ctep))&&
			 * (user!=null&&!user.hasRoleAccess(CaDSRConstants.CONTEXT_ADMIN,
			 * ctep))) { contextRestriction= ctep.getConteIdseq(); }
			 **/
			forms = dao.getAllForms(formLongName, protocolIdSeq, contextIdSeq, workflow, categoryName, type,
					classificationIdSeq, contextRestriction, publicId, version, moduleLongName, cdePublicId);

		} catch (Exception ex) {
			throw new DMLException("Cannot get Forms", ex);
		}

		long endTimer = System.currentTimeMillis();
		logger.info("----------DAO query took " + (endTimer - startTimer) + " ms.");
		logger.info("----------# to get FormSearch Results to service: " + forms.size());

		return forms;
	}

	@Override
	public BBFormMetaData createFormComponent(BBFormMetaData form, InstructionTransferObject headerInstruction,
			InstructionTransferObject footerInstruction) {
		FormDAO fdao = daoFactory.getFormDAO();
		FormTransferObject formTransferObject = new FormTransferObject();

		formTransferObject.setCreatedBy(form.getCreatedBy());
		formTransferObject.setLongName(form.getLongName());
		formTransferObject.setPreferredDefinition(form.getPreferredDefinition());
		ContextTransferObject c = new ContextTransferObject();
		c.setConteIdseq(form.getContext().getConteIdseq());
		formTransferObject.setContext(c);
		formTransferObject.setAslName(form.getWorkflow());
		formTransferObject.setFormCategory(form.getFormCategory());
		formTransferObject.setFormType(form.getFormType());
		formTransferObject.setVersion(form.getVersion());
		List<ProtocolTransferObject> protocols = new ArrayList<ProtocolTransferObject>();
		for(BBProtocol bbprot : form.getProtocols()){
			ProtocolTransferObject pto = new ProtocolTransferObject();
			pto.setProtoIdseq(bbprot.getProtoIdseq());
			protocols.add(pto);
		}
		formTransferObject.setProtocols(protocols);
		
		String id = fdao.createFormComponent(formTransferObject);
		
		if (headerInstruction.getPreferredDefinition() != null && headerInstruction.getPreferredDefinition() != "") {
			FormInstructionDAO fidao1 = daoFactory.getFormInstructionDAO();
			fidao1.createInstruction(headerInstruction, id);
		}

		if (footerInstruction.getPreferredDefinition() != null && footerInstruction.getPreferredDefinition() != "") {
			FormInstructionDAO fidao2 = daoFactory.getFormInstructionDAO();
			fidao2.createFooterInstruction(footerInstruction, id);
		}

		//return full form that's been newly created from the DB
		BBFormMetaData newForm = testTranslateDBFormToBBForm(getFullForm(id)).getFormMetadata();
		
		
		return newForm;

	}


	public FormTransferObject getFullForm(String formIdSeq) {
		Form form = service.getFormDetails(formIdSeq);

		FormTransferObject fto = (FormTransferObject) form;

		return fto;
	}
	
	public FormV2TransferObject getFullFormV2(String formIdSeq) {
		FormV2 formv2 = service.getFormDetailsV2(formIdSeq);

		FormV2TransferObject fto = (FormV2TransferObject) formv2;

		return fto;
	}
	
	public FormTransferObject getFormRow(String formIdSeq) {
		Form formRow = service.getFormRow(formIdSeq);

		FormTransferObject fto = (FormTransferObject) formRow;

		return fto;
	}


	public InstructionTransferObject buildHeaderInstructions(BBFormMetaData form) {

		InstructionTransferObject instruction = new InstructionTransferObject();

		instruction.setLongName(form.getLongName());
		instruction.setPreferredDefinition(form.getHeaderInstructions());
		ContextTransferObject c = new ContextTransferObject();
		c.setConteIdseq(form.getContext().getConteIdseq());
		instruction.setContext(c);
		instruction.setAslName("DRAFT NEW");
		instruction.setVersion(new Float(1.0));
		instruction.setCreatedBy(form.getCreatedBy());
		instruction.setDisplayOrder(1);

		return instruction;

	}

	public InstructionTransferObject buildFooterInstructions(BBFormMetaData form) {

		InstructionTransferObject instruction = new InstructionTransferObject();

		instruction.setLongName(form.getLongName());
		instruction.setPreferredDefinition(form.getFooterInstructions());
		ContextTransferObject c = new ContextTransferObject();
		c.setConteIdseq(form.getContext().getConteIdseq());
		instruction.setContext(c);
		instruction.setAslName("DRAFT NEW");
		instruction.setVersion(new Float(1.0));
		instruction.setCreatedBy(form.getCreatedBy());
		instruction.setDisplayOrder(2);

		return instruction;

	}

	public String updateForm(BBForm form) {

		// FormTransferObject formHeader = adaptFormHeader(form);

		// List<ModuleTransferObject> addedMods
		FormTransferObject formHeader = new FormTransferObject();
		Collection addedMods = new ArrayList<ModuleTransferObject>();
		Collection updatedMods = new ArrayList<ModuleTransferObject>();
		Collection deletedMods = new ArrayList<ModuleTransferObject>();
		Collection addedProts = new ArrayList<ProtocolTransferObject>();
		Collection deletedProts = new ArrayList<ProtocolTransferObject>();
		Collection protTrigs = new ArrayList<TriggerActionChangesTransferObject>();
		FormInstructionChangesTransferObject instChanges = new FormInstructionChangesTransferObject();
		String username = "";
		String formIdSeq = form.getFormMetadata().getFormIdseq();

		try {

			adaptModels(form, formHeader, addedMods, updatedMods, deletedMods, addedProts, deletedProts, protTrigs,
					instChanges, username, formIdSeq);

		} catch (IllegalAccessException | InvocationTargetException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		Form resultForm = service.updateForm(formIdSeq, formHeader, updatedMods, deletedMods, addedMods, addedProts,
				deletedProts, protTrigs, instChanges, username);
		
		updateModules(updatedMods);
		
		if(addedMods.size() > 0){
			return ((ModuleTransferObject)addedMods.iterator().next()).getModuleIdseq();
		}

		return "SUCCESS";
	}

	private void adaptModels(BBForm form, FormTransferObject formHeader, Collection addedMods, Collection updatedMods,
			Collection deletedMods, Collection addedProts, Collection deletedProts, Collection protTrigs,
			FormInstructionChangesTransferObject instChanges, String username, String formIdSeq)
			throws IllegalAccessException, InvocationTargetException {
		FormDAO fdao = daoFactory.getFormDAO();
		ModuleInstructionDAO moduleInstrDao = daoFactory.getModuleInstructionDAO();

		formIdSeq = form.getFormMetadata().getFormIdseq();
		username = form.getFormMetadata().getCreatedBy();

		// List oldModules = (List)fdao.getModulesInAForm(formIdSeq); //TODO:
		// Need to confirm this is correct
		BeanUtils.copyProperties(form.getFormMetadata(), formHeader, "context", "protocols");
		ContextTransferObject formContext = new ContextTransferObject();
		formContext.setConteIdseq(form.getFormMetadata().getContext().getConteIdseq());
		formHeader.setContext(formContext);
		formHeader.setAslName(form.getFormMetadata().getWorkflow());
		if(formHeader.getPreferredName() == null){
			formHeader.setPreferredName(form.getFormMetadata().getLongName());
		}
		
		
		for (BBModule module : form.getFormModules()) {
			ModuleTransferObject m = new ModuleTransferObject();
			FormTransferObject f = new FormTransferObject();
			ContextTransferObject c = new ContextTransferObject();

			c.setConteIdseq(form.getFormMetadata().getContext().getConteIdseq());
			f.setContext(c);
			f.setFormIdseq(formIdSeq);

			// BeanUtils.copyProperties(m, module); //XXX:setInstructions
			// doesn't match
			m.setModuleIdseq(module.getModuleIdseq());
			m.setLongName(module.getLongName());
			InstructionTransferObject instr = new InstructionTransferObject();
			List dbinstructions = moduleInstrDao.getInstructions(module.getModuleIdseq());
			System.out.println("TEST # of instructions for " + module.getLongName() + ": " + dbinstructions.size());
			if(dbinstructions.size() > 0){
				m.setInstructions(dbinstructions);
				instr = (InstructionTransferObject)m.getInstruction();
			}
			else{
				instr.setVersion(form.getFormMetadata().getVersion());
				instr.setLongName(form.getFormMetadata().getLongName());
				instr.setAslName(form.getFormMetadata().getWorkflow());
				instr.setDisplayOrder(1);
			}
//			BeanUtils.copyProperties(module.getInstructions(), instr, "context");
			instr.setContext(c);
			instr.setCreatedBy(username);
			if(module.getInstructions() == null || module.getInstructions().equals("")){
				instr.setPreferredDefinition(" ");
			}
			else{
				instr.setPreferredDefinition(module.getInstructions());
			}
			m.setInstruction(instr);
			System.out.println(m.getInstruction().getIdseq());
			m.setNumberOfRepeats(module.getRepetitions());
			m.setDisplayOrder(module.getDispOrder());
			m.setQuestions(module.getQuestions());

			m.setForm(f);
			m.setModuleIdseq(module.getModuleIdseq());
			m.setVersion(form.getFormMetadata().getVersion());
			m.setPreferredName("preff-name");
			m.setPreferredDefinition(form.getFormMetadata().getPreferredDefinition());
			m.setAslName(form.getFormMetadata().getWorkflow());
			m.setCreatedBy(form.getFormMetadata().getCreatedBy());
			m.setContext(c);
			
//			for(BBQuestion ques : module.getQuestions()){
				
//				QuestionTransferObject qto = new QuestionTransferObject();
//				qto.setDataElement(new DataElementTransferObject());
//				qto.getDataElement().setValueDomain(new ValueDomainTransferObject());
//				
//				qto.setVersion(ques.getVersion());
//				qto.setPreferredDefinition(ques.getPreferredQuestionText()); //XXX: is correct?
//				qto.setMandatory(ques.isMandatory());
//				qto.setEditable(ques.isEditable());
//				qto.setDeDerived(ques.isDeDerived());
//				qto.setLongName(ques.getLongName());
//				qto.getDataElement().getValueDomain().setDatatype(ques.getDataType());
//				qto.getDataElement().getValueDomain().setUnitOfMeasure(ques.getUnitOfMeasure());
				
//				bbques.setDeIdseq(qto.getDataElement().getIdseq());
//				bbques.setVersion(qto.getVersion());
//				bbques.setPreferredQuestionText(qto.getPreferredDefinition());//XXX: is correct?
//				bbques.setMandatory(false);
//				bbques.setEditable(true);
//				bbques.setDeDerived(true);
//				bbques.setLongName(qto.getLongName());
//				bbques.setDataType(qto.getDataElement().getValueDomain().getDatatype());
//				bbques.setUnitOfMeasure(qto.getDataElement().getValueDomain().getUnitOfMeasure());
//				bbques.setDisplayFormat(qto.getDataElement().getValueDomain().getDisplayFormat());
				
//			}

			if (module.getModuleIdseq() == null || module.getModuleIdseq() == "") {
				System.out.println("This is a new module! name=" + module.getLongName() + " id=" + module.getModuleIdseq());
				addedMods.add(m);
			} else if (module.getIsEdited()) {
				System.out.println("THIS MOD IS EDITABLE: " + module.getLongName());
				updatedMods.add(m);
			} /*else if(module.getIsDeleted()){
				deletedMods.add(m.getModuleIdseq());
			}*/
		}

		instChanges.setFormHeaderInstructionChanges(new HashMap());
		instChanges.setFormFooterInstructionChanges(new HashMap());

	}
	
	private void updateModules(Collection mods){
		System.out.println("IN MANAGER UPDATE MODULES");
		
		QuestionInstructionDAO questionInstrDao = daoFactory.getQuestionInstructionDAO();
		
		for(Object mod : mods){
			ModuleTransferObject mto = (ModuleTransferObject)mod;
			
			ModuleChangesTransferObject modChange = new ModuleChangesTransferObject();
			
			modChange.setDeletedQuestions(new ArrayList());
			modChange.setUpdatedQuestions(new ArrayList());
			modChange.setNewQuestions(new ArrayList());
			
			modChange.setModuleId(mto.getModuleIdseq());
			modChange.setUpdatedModule(mto);
			modChange.setInstructionChanges(new InstructionChangesTransferObject());
			if(mto.getInstruction().getIdseq() == null){
				modChange.getInstructionChanges().setNewInstruction(mto.getInstruction());
			}
			else{
				modChange.getInstructionChanges().setUpdatedInstruction(mto.getInstruction());
			}
			
			modChange.getInstructionChanges().setParentId(mto.getModuleIdseq());
			
			for(Object obj : mto.getQuestions()){
				BBQuestion ques = (BBQuestion)obj;
				
				QuestionTransferObject qto = new QuestionTransferObject();
				qto.setDataElement(new DataElementTransferObject());
				qto.getDataElement().setValueDomain(new ValueDomainTransferObject());
				
				qto.setQuesIdseq(ques.getQuesIdseq());
				qto.setVersion(ques.getVersion());
				qto.setPreferredDefinition(ques.getPreferredQuestionText()); //XXX: is correct?
				qto.setMandatory(ques.isMandatory());
				qto.setEditable(ques.isEditable());
				qto.setDeDerived(ques.isDeDerived());
				qto.setLongName(ques.getLongName());
				qto.getDataElement().getValueDomain().setDatatype(ques.getDataType());
				qto.getDataElement().getValueDomain().setUnitOfMeasure(ques.getUnitOfMeasure());
				
				InstructionTransferObject instr = new InstructionTransferObject();
				List dbinstructions = questionInstrDao.getInstructions(ques.getQuesIdseq());
				System.out.println("TEST # of instructions for " + ques.getLongName() + ": " + dbinstructions.size());
				if(dbinstructions.size() > 0){
					qto.setInstructions(dbinstructions);
					instr = (InstructionTransferObject)qto.getInstruction();
				}
				else{
//					instr.setVersion(mto.getForm().getVersion());
//					instr.setLongName(ques.getLongName());
//					instr.setAslName(mto.getAslName());
//					instr.setDisplayOrder(1);
					//context
					//createdby
				}
				
				instr.setLongName(ques.getLongName());
				instr.setAslName(mto.getAslName());
				instr.setDisplayOrder(1);
				instr.setVersion(1F);
				instr.setContext(mto.getForm().getContext());
				instr.setCreatedBy(mto.getForm().getCreatedBy());
				
				if(ques.getInstructions() == null || ques.getInstructions().equals("")){
					instr.setPreferredDefinition(" ");
				}
				else{
					instr.setPreferredDefinition(ques.getInstructions());
				}
				
				dbinstructions.add(instr);
				qto.setInstructions(dbinstructions);
				
				
				
				if(ques.getIsDeleted()){
					modChange.getDeletedQuestions().add(qto);
				}
				else if(ques.getIsEdited()){
					
					QuestionChangeTransferObject quesChange = new QuestionChangeTransferObject();
					
					quesChange.setUpdatedQuestion(qto);
					
					quesChange.setInstructionChanges(new InstructionChangesTransferObject());
					quesChange.getInstructionChanges().setParentId(ques.getQuesIdseq());
					if(qto.getInstruction().getIdseq() == null){
						quesChange.getInstructionChanges().setNewInstruction(qto.getInstruction());
					}
					else{
						quesChange.getInstructionChanges().setUpdatedInstruction(qto.getInstruction());
					}
					
					FormValidValueChangesTransferObject validValueChange = new FormValidValueChangesTransferObject();
					
					validValueChange.setDeletedValidValues(new ArrayList());
					validValueChange.setNewValidValues(new ArrayList());
					validValueChange.setUpdatedValidValues(new ArrayList());
					
					for(BBValidValue bbVV : ques.getValidValues()){
						
						ValidValueTransferObject vvto = new ValidValueTransferObject();
						BeanUtils.copyProperties(bbVV, vvto);
						
						if(bbVV.getIsEdited()){
							validValueChange.getUpdatedValidValues().add(vvto);
						}
						else if(bbVV.getIsDeleted()){
							validValueChange.getDeletedValidValues().add(vvto);
						}
						else if(bbVV.getValueIdseq().isEmpty()){
							validValueChange.getNewValidValues().add(vvto);
						}
						
					}
					
					quesChange.setFormValidValueChanges(validValueChange);
					
					modChange.getUpdatedQuestions().add(quesChange);
				}
				else if(ques.getQuesIdseq().isEmpty()){
					modChange.getNewQuestions().add(qto);
				}
			}
			
			service.updateModule(mto.getModuleIdseq(), modChange, mto.getCreatedBy());
			
		}
	}

	public BBForm testTranslateDBFormToBBForm(FormTransferObject fullform) {
		BBForm bbform = new BBForm();
		BBFormMetaData bbmeta = new BBFormMetaData();
//		FormTransferObject fullform = getFullForm(formIdSeq);

		long startTime = System.currentTimeMillis();

		BeanUtils.copyProperties(fullform, bbform);
		BeanUtils.copyProperties(fullform, bbmeta, "context", "protocols");
		
		BBContext bbcontext = new BBContext();
		bbcontext.setConteIdseq(fullform.getConteIdseq());
		bbcontext.setName(fullform.getContextName());
		bbcontext.setDescription(fullform.getContext().getDescription());
		
		List<BBProtocol> bbprotocols = new ArrayList<BBProtocol>();
		for(Object obj : fullform.getProtocols()){
			ProtocolTransferObject protocol = (ProtocolTransferObject)obj;
			
			BBProtocol bbprotocol = new BBProtocol();
			bbprotocol.setLongName(protocol.getLongName());
			bbprotocol.setProtoIdseq(protocol.getProtoIdseq());
			
			bbprotocols.add(bbprotocol);
			
		}
		
		bbmeta.setProtocols(bbprotocols);
		bbmeta.setWorkflow(fullform.getAslName());
		bbmeta.setContext(bbcontext);
		
		if(fullform.getInstruction() != null){
			bbmeta.setHeaderInstructions(fullform.getInstruction().getPreferredDefinition());
		}
		else{
			bbmeta.setHeaderInstructions("");
		}
		if(fullform.getFooterInstruction() != null){
			bbmeta.setFooterInstructions(fullform.getFooterInstruction().getPreferredDefinition());
		}
		else{
			bbmeta.setFooterInstructions("");
		}
		
		bbform.setFormMetadata(bbmeta);
		bbform.setFormModules(new ArrayList<BBModule>());

		for (Object module : fullform.getModules()) {
			ModuleTransferObject mto = (ModuleTransferObject) module;
			BBModule bbmod = new BBModule();
			BeanUtils.copyProperties(mto, bbmod, "instructions");
			
//			BBInstructions bbinst = new BBInstructions();
//			if(mto.getInstruction() != null){
//				BeanUtils.copyProperties(mto.getInstruction(), bbinst, "context");
//			}
			if(mto.getInstruction() != null){
				bbmod.setInstructions(mto.getInstruction().getPreferredDefinition());
			}
			
			bbmod.setForm(bbmeta);
			
			bbform.getFormModules().add(bbmod);

			bbmod.setQuestions(new ArrayList<BBQuestion>());

			for (Object question : mto.getQuestions()) {
				QuestionTransferObject qto = (QuestionTransferObject) question;
				BBQuestion bbques = new BBQuestion();
				BeanUtils.copyProperties(qto, bbques);
				
				bbques.setVersion(qto.getVersion());
				bbques.setPreferredQuestionText(qto.getPreferredDefinition());//XXX: is correct?
				bbques.setMandatory(false);
				bbques.setEditable(true);
				bbques.setDeDerived(true);
				bbques.setLongName(qto.getLongName());
				
				if(qto.getDataElement() != null){
					bbques.setDeIdseq(qto.getDataElement().getIdseq());
					bbques.setDataType(qto.getDataElement().getValueDomain().getDatatype());
					bbques.setUnitOfMeasure(qto.getDataElement().getValueDomain().getUnitOfMeasure());
					bbques.setDisplayFormat(qto.getDataElement().getValueDomain().getDisplayFormat());
	//				bbques.setConcepts(qto.getDataElement().getValueDomain().getConceptDerivationRule().getComponentConcepts().toString());
					
					List<String> altQuestionTexts = new ArrayList<String>();
					
					for(Object obj : qto.getDataElement().getRefereceDocs()){
						ReferenceDocumentTransferObject refDoc = (ReferenceDocumentTransferObject)obj;
						
						String altQuestionText = refDoc.getDocText();
						
						altQuestionTexts.add(altQuestionText);
					}
					
					bbques.setAlternativeQuestionText(altQuestionTexts);
				}
				
				
				
				bbmod.getQuestions().add(bbques);

				bbques.setValidValues(new ArrayList<BBValidValue>());

				for (Object validVal : qto.getValidValues()) {
					FormValidValueTransferObject vvto = (FormValidValueTransferObject) validVal;
					BBValidValue bbval = new BBValidValue();
					BeanUtils.copyProperties(vvto, bbval);
					
					bbques.getValidValues().add(bbval);
				}
			}
		}

		long endTime = System.currentTimeMillis();
		System.out.println("Translation Time: " + (endTime - startTime));

		return bbform;

	}
	
	/**
	 * 
	 * Performance Test Methods
	 * 
	 */
	
	public String getFormPerformanceTest(@PathVariable String formIdSeq) {

		long startTimer1 = System.currentTimeMillis();

		FormTransferObject fullForm = this.getFullForm(formIdSeq);

		long endTimer1 = System.currentTimeMillis();
		String retrieveFromDBTime = "" + (endTimer1 - startTimer1);

		String numModules = "" + fullForm.getModules().size();
		String numCdes = "" + fullForm.getCDEIdList().size();

		long startTimer2 = System.currentTimeMillis();

		BBForm simpleForm = this.testTranslateDBFormToBBForm(fullForm);

		long endTimer2 = System.currentTimeMillis();
		String translateObjectTime = "" + (endTimer2 - startTimer2);

		StringBuilder sb = new StringBuilder();
		sb.append("Form ID: " + fullForm.getFormIdseq() + "\n");
		sb.append("Form Long Name: " + fullForm.getLongName() + "\n");
		sb.append("\t# of Modules: " + numModules + "\n");
		sb.append("\t# of CDE's: " + numCdes + "\n");
		sb.append("Time(ms) to retrieve from DB: " + retrieveFromDBTime + "\n");
		sb.append("Time(ms) to translate to simple object: " + translateObjectTime + "\n");
		
		/*
		long startTimer3 = System.currentTimeMillis();

		FormV2TransferObject fullFormV2 = formManager.getFullFormV2(formIdSeq);

		long endTimer3 = System.currentTimeMillis();
		String retrieveV2FromDBTime = "" + (endTimer3 - startTimer3);
		
		long startTimer4 = System.currentTimeMillis();

		FormTransferObject formRow = this.getFormRow(formIdSeq);

		long endTimer4 = System.currentTimeMillis();
		String retrieveRowFromDBTime = "" + (endTimer4 - startTimer4);
		*/
		
//		sb.append("Time(ms) to retrieve V2 from DB: " + retrieveV2FromDBTime + "\n");
		sb.append("Time(ms) to retrieve V2 from DB: N/A \n");
//		sb.append("Time(ms) to retrieve header-only (metadata) from DB: " + retrieveRowFromDBTime + "\n");
		sb.append("Time(ms) to retrieve header-only (metadata) from DB: N/A \n");
		sb.append("-------------------------------------------------------------------\n\n");

		return sb.toString();
	}

}
