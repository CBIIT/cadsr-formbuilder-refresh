package gov.nih.nci.cadsr.manager.impl;

import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.InvalidDataAccessApiUsageException;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;

import gov.nih.nci.cadsr.manager.FormManager;
import gov.nih.nci.cadsr.model.frontend.FEClassification;
import gov.nih.nci.cadsr.model.frontend.FEContext;
import gov.nih.nci.cadsr.model.frontend.FEForm;
import gov.nih.nci.cadsr.model.frontend.FEFormMetaData;
import gov.nih.nci.cadsr.model.frontend.FEModule;
import gov.nih.nci.cadsr.model.frontend.FEProtocol;
import gov.nih.nci.cadsr.model.frontend.FEQuestion;
import gov.nih.nci.cadsr.model.frontend.FEValidValue;
import gov.nih.nci.ncicb.cadsr.common.dto.CSITransferObject;
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
import gov.nih.nci.ncicb.cadsr.common.persistence.dao.ClassificationSchemeDAO;
import gov.nih.nci.ncicb.cadsr.common.persistence.dao.ContextDAO;
import gov.nih.nci.ncicb.cadsr.common.persistence.dao.DataElementDAO;
import gov.nih.nci.ncicb.cadsr.common.persistence.dao.FormDAO;
import gov.nih.nci.ncicb.cadsr.common.persistence.dao.FormInstructionDAO;
import gov.nih.nci.ncicb.cadsr.common.persistence.dao.FormValidValueInstructionDAO;
import gov.nih.nci.ncicb.cadsr.common.persistence.dao.ModuleInstructionDAO;
import gov.nih.nci.ncicb.cadsr.common.persistence.dao.ProtocolDAO;
import gov.nih.nci.ncicb.cadsr.common.persistence.dao.QuestionDAO;
import gov.nih.nci.ncicb.cadsr.common.persistence.dao.QuestionInstructionDAO;
import gov.nih.nci.ncicb.cadsr.common.persistence.dao.jdbc.JDBCFormDAOFB;
import gov.nih.nci.ncicb.cadsr.common.resource.Form;
import gov.nih.nci.ncicb.cadsr.common.resource.FormInstructionChanges;
import gov.nih.nci.ncicb.cadsr.common.resource.FormV2;
import gov.nih.nci.ncicb.cadsr.common.resource.Instruction;
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

		// Testing new CI Build

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
	public FEFormMetaData createFormComponent(FEFormMetaData form, InstructionTransferObject headerInstruction,
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
		for (FEProtocol bbprot : form.getProtocols()) {
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

		// return full form that's been newly created from the DB
		FEFormMetaData newForm = testTranslateDBFormToBBForm(getFullForm(id)).getFormMetadata();

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

	public InstructionTransferObject buildHeaderInstructions(FEFormMetaData form) {

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

	public InstructionTransferObject buildFooterInstructions(FEFormMetaData form) {

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

	public String updateForm(FEForm form, FEForm oldForm) {

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

			adaptProtocols(form, oldForm, addedProts, deletedProts);

			adaptModels(form, formHeader, addedMods, updatedMods, deletedMods, addedProts, deletedProts, protTrigs,
					instChanges, username, formIdSeq, oldForm);

		} catch (IllegalAccessException | InvocationTargetException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		System.out.println("addedProts Size: " + addedProts.size());
		System.out.println("deletedProts Size: " + deletedProts.size());
		Form resultForm = service.updateForm(formIdSeq, formHeader, updatedMods, deletedMods, addedMods, addedProts,
				deletedProts, protTrigs, instChanges, username);

		if (form.getFormMetadata().getClassifications().size() > 0) {
			updateFormClassifications(form);
		}

		updateModules(updatedMods, oldForm);

		if (addedMods.size() > 0) {
			return ((ModuleTransferObject) addedMods.iterator().next()).getModuleIdseq();
		}

		return "SUCCESS";
	}

	private void adaptModels(FEForm form, FormTransferObject formHeader, Collection addedMods, Collection updatedMods,
			Collection deletedMods, Collection addedProts, Collection deletedProts, Collection protTrigs,
			FormInstructionChangesTransferObject instChanges, String username, String formIdSeq, FEForm oldForm)
			throws IllegalAccessException, InvocationTargetException {
		FormDAO fdao = daoFactory.getFormDAO();
		ModuleInstructionDAO moduleInstrDao = daoFactory.getModuleInstructionDAO();
		ProtocolDAO protocolDao = daoFactory.getProtocolDAO();
		FormValidValueInstructionDAO vvInstrDao = daoFactory.getFormValidValueInstructionDAO();


		formIdSeq = form.getFormMetadata().getFormIdseq();
		username = form.getFormMetadata().getCreatedBy();

		// List oldModules = (List)fdao.getModulesInAForm(formIdSeq); //TODO:
		// Need to confirm this is correct
		BeanUtils.copyProperties(form.getFormMetadata(), formHeader, "context", "protocols", "classifications");
		ContextTransferObject formContext = new ContextTransferObject();
		formContext.setConteIdseq(form.getFormMetadata().getContext().getConteIdseq());
		formHeader.setContext(formContext);
		formHeader.setAslName(form.getFormMetadata().getWorkflow());
		if (formHeader.getPreferredName() == null) {
			formHeader.setPreferredName(form.getFormMetadata().getLongName());
		}

		// fdao.getpro
		/*
		 * for(FEProtocol prot : form.getFormMetadata().getProtocols()){
		 * fdao.get }
		 */

		int i = 0;
		
		for (FEModule module : form.getFormModules()) {
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
			if (dbinstructions.size() > 0) {
				m.setInstructions(dbinstructions);
				instr = (InstructionTransferObject) m.getInstruction();
			} else {
				instr.setVersion(form.getFormMetadata().getVersion());
				instr.setLongName(form.getFormMetadata().getLongName());
				instr.setAslName(form.getFormMetadata().getWorkflow());
				instr.setDisplayOrder(1);
			}
			// BeanUtils.copyProperties(module.getInstructions(), instr,
			// "context");
			instr.setContext(c);
			instr.setCreatedBy(username);
			if (module.getInstructions() == null || module.getInstructions().equals("")) {
				instr.setPreferredDefinition(" ");
			} else {
				instr.setPreferredDefinition(module.getInstructions());
			}
			m.setInstruction(instr);
			System.out.println(m.getInstruction().getIdseq());
			m.setNumberOfRepeats(module.getRepetitions());
//			m.setDisplayOrder(module.getDispOrder());
			m.setQuestions(module.getQuestions());

			m.setForm(f);
			m.setModuleIdseq(module.getModuleIdseq());
			m.setVersion(form.getFormMetadata().getVersion());
			m.setPreferredName("preff-name");
			m.setPreferredDefinition(form.getFormMetadata().getPreferredDefinition());
			m.setAslName(form.getFormMetadata().getWorkflow());
			m.setCreatedBy(form.getFormMetadata().getCreatedBy());
			m.setContext(c);
			
			m.setDisplayOrder(i);
			System.out.println("MODULE ORDER # " + m.getDisplayOrder());

			if (module.getModuleIdseq() == null || module.getModuleIdseq() == "") {
				
				List<QuestionTransferObject> qtos = new ArrayList<QuestionTransferObject>();

				for (Object obj : m.getQuestions()) {
					FEQuestion ques = (FEQuestion) obj;

					QuestionTransferObject qto = new QuestionTransferObject();
					qto.setDataElement(new DataElementTransferObject());
					qto.getDataElement().setValueDomain(new ValueDomainTransferObject());
					qto.getDataElement().setDeIdseq(ques.getDeIdseq());

					qto.setModule(m);

					qto.setQuesIdseq(ques.getQuesIdseq());
					qto.setVersion(ques.getVersion());
					qto.setPreferredDefinition(ques.getLongName()); // XXX: is
																	// correct?
					qto.setMandatory(ques.isMandatory());
					qto.setEditable(ques.isEditable());
					qto.setDeDerived(ques.isDeDerived());
					qto.setLongName(ques.getLongName());
					qto.getDataElement().getValueDomain().setDatatype(ques.getDataType());
					qto.getDataElement().getValueDomain().setUnitOfMeasure(ques.getUnitOfMeasure());
					qto.setAslName(m.getAslName());
					qto.setContext(m.getContext());
					qto.setCreatedBy(m.getCreatedBy());
					qto.setDisplayOrder(ques.getDisplayOrder());

					qto.setDefaultValue(ques.getDefaultValue());

					InstructionTransferObject minstr = new InstructionTransferObject();

					minstr.setLongName(ques.getLongName());
					minstr.setAslName(m.getAslName());
					minstr.setDisplayOrder(1);
					minstr.setVersion(1F);
					minstr.setContext(m.getForm().getContext());
					minstr.setCreatedBy(m.getForm().getCreatedBy());

					if (ques.getInstructions() == null || ques.getInstructions().equals("")) {
						minstr.setPreferredDefinition(" ");
					} else {
						minstr.setPreferredDefinition(ques.getInstructions());
					}

					qto.setInstruction(minstr);
					qto.setValidValues(new ArrayList());
					
					for (FEValidValue bbVV : ques.getValidValues()) {

						System.out.println("HEY! Translating valid values");
						ValidValueTransferObject vvto = new ValidValueTransferObject();
						FormValidValueTransferObject fvto = new FormValidValueTransferObject();
						BeanUtils.copyProperties(bbVV, vvto);
						BeanUtils.copyProperties(bbVV, fvto, "instructions");

						InstructionTransferObject vvinstr = new InstructionTransferObject();
						List vvInstructions = vvInstrDao.getInstructions(vvto.getVdIdseq());
						if (vvInstructions.size() > 0) {
							fvto.setInstructions(vvInstructions);
						}

						vvinstr.setLongName(ques.getLongName());
						vvinstr.setAslName(m.getAslName());
						vvinstr.setDisplayOrder(1);
						vvinstr.setVersion(1F);
						vvinstr.setContext(m.getForm().getContext());
						vvinstr.setCreatedBy(m.getForm().getCreatedBy());

						if (bbVV.getInstructions() == null || bbVV.getInstructions().equals("")) {
							vvinstr.setPreferredDefinition(" ");
						} else {
							vvinstr.setPreferredDefinition(ques.getInstructions());
						}

						vvInstructions.add(vvinstr);
						fvto.setInstructions(vvInstructions);
						fvto.setVersion(1F);
//						fvto.setLongName(ques.getLongName());
						fvto.setPreferredDefinition(m.getPreferredDefinition());
						fvto.setContext(c);
						fvto.setAslName(m.getAslName());
						fvto.setCreatedBy(username);
						

//						qto.getDataElement().getValueDomain().getValidValues().add(vvto);
						qto.getValidValues().add(fvto);

					}

					qtos.add(qto);
				}
				
				m.setQuestions(qtos);
				
				addedMods.add(m);
				
			} else if (module.getIsEdited()) {
				updatedMods.add(m);
			}
			//Temp fix: Counter for maintaining Module order for newly created modules
			i++;
		}

		for (FEModule oldModule : oldForm.getFormModules()) {
			if (!form.getFormModules().contains(oldModule)) {
				System.out.println("DELETING MODULE: " + oldModule.getLongName());
				ModuleTransferObject deleteMod = new ModuleTransferObject();
				deleteMod.setModuleIdseq(oldModule.getModuleIdseq());
				deletedMods.add(deleteMod);
			}
		}

		FormInstructionDAO formInstrDao = daoFactory.getFormInstructionDAO();

		List headers = formInstrDao.getInstructions(formIdSeq);
		List footers = formInstrDao.getFooterInstructions(formIdSeq);

		Instruction header = new InstructionTransferObject();
		Instruction footer = new InstructionTransferObject();

		if (headers.size() > 0) {
			header = (InstructionTransferObject) headers.get(0);
		} else {
			header = null;
		}
		if (footers.size() > 0) {
			footer = (InstructionTransferObject) footers.get(0);
		} else {
			footer = null;
		}

		// header.setPreferredDefinition(form.getFormMetadata().getHeaderInstructions());
		// footer.setPreferredDefinition(form.getFormMetadata().getFooterInstructions());

		String headerInsterStr = form.getFormMetadata().getHeaderInstructions();
		FormInstructionChanges instrChanges = new FormInstructionChangesTransferObject();
		Map headerInstrChanges = getInstructionChanges(instrChanges.getFormHeaderInstructionChanges(), headerInsterStr,
				header, formHeader, form.getFormMetadata().getLongName());
		// instrChanges.setFormHeaderInstructionChanges(headerInstrChanges);

		String footerInsterStr = form.getFormMetadata().getFooterInstructions();
		Map footerInstrChanges = getInstructionChanges(instrChanges.getFormFooterInstructionChanges(), footerInsterStr,
				footer, formHeader, form.getFormMetadata().getLongName());
		// instrChanges.setFormFooterInstructionChanges(footerInstrChanges);

		instChanges.setFormHeaderInstructionChanges(headerInstrChanges);
		instChanges.setFormFooterInstructionChanges(footerInstrChanges);

	}

	private void updateModules(Collection mods, FEForm oldForm) {
		System.out.println("IN MANAGER UPDATE MODULES");

		FormDAO myDAO = daoFactory.getFormDAO();
		QuestionInstructionDAO questionInstrDao = daoFactory.getQuestionInstructionDAO();
		QuestionDAO questionDao = daoFactory.getQuestionDAO();
		FormValidValueInstructionDAO vvInstrDao = daoFactory.getFormValidValueInstructionDAO();
		DataElementDAO DEDao = daoFactory.getDataElementDAO();

		for (Object mod : mods) {
			ModuleTransferObject mto = (ModuleTransferObject) mod;

			ModuleChangesTransferObject modChange = new ModuleChangesTransferObject();

			modChange.setDeletedQuestions(new ArrayList());
			modChange.setUpdatedQuestions(new ArrayList());
			modChange.setNewQuestions(new ArrayList());

			modChange.setModuleId(mto.getModuleIdseq());
			modChange.setUpdatedModule(mto);
			modChange.setInstructionChanges(new InstructionChangesTransferObject());
			if (mto.getInstruction().getIdseq() == null) {
				modChange.getInstructionChanges().setNewInstruction(mto.getInstruction());
			} else {
				modChange.getInstructionChanges().setUpdatedInstruction(mto.getInstruction());
			}

			modChange.getInstructionChanges().setParentId(mto.getModuleIdseq());

			// handle removal of questions
			for (FEModule oldMod : oldForm.getFormModules()) {
				if (oldMod.getModuleIdseq().equals(mto.getModuleIdseq())) {

					for (FEQuestion oldQues : oldMod.getQuestions()) {
						if (!mto.getQuestions().contains(oldQues)) {

							QuestionTransferObject deleteQuestion = new QuestionTransferObject();
							deleteQuestion.setQuesIdseq(oldQues.getQuesIdseq());
							modChange.getDeletedQuestions().add(deleteQuestion);
							System.out.println("DELETING QUESTION: " + oldQues.getLongName());
						}
					}

				}
			}

			for (Object obj : mto.getQuestions()) {
				FEQuestion ques = (FEQuestion) obj;

				QuestionTransferObject qto = new QuestionTransferObject();
//				qto.setDataElement(DEDao.);
				qto.setDataElement(new DataElementTransferObject());
				qto.getDataElement().setValueDomain(new ValueDomainTransferObject());
				qto.getDataElement().setDeIdseq(ques.getDeIdseq());

				qto.setModule(mto);

				qto.setQuesIdseq(ques.getQuesIdseq());
				qto.setVersion(ques.getVersion());
				qto.setPreferredDefinition(ques.getLongName()); // XXX: is
																// correct?
				qto.setMandatory(ques.isMandatory());
				qto.setEditable(ques.isEditable());
				qto.setDeDerived(ques.isDeDerived());
				qto.setLongName(ques.getLongName());
				qto.getDataElement().getValueDomain().setDatatype(ques.getDataType());
				qto.getDataElement().getValueDomain().setUnitOfMeasure(ques.getUnitOfMeasure());
				qto.setAslName(mto.getAslName());
				qto.setContext(mto.getContext());
				qto.setCreatedBy(mto.getCreatedBy());
				qto.setDisplayOrder(ques.getDisplayOrder());

				qto.setDefaultValue(ques.getDefaultValue());

				InstructionTransferObject instr = new InstructionTransferObject();
				List dbinstructions = questionInstrDao.getInstructions(ques.getQuesIdseq());
				System.out.println("TEST # of instructions for " + ques.getLongName() + ": " + dbinstructions.size());
				if (dbinstructions.size() > 0) {
					qto.setInstructions(dbinstructions);
					instr = (InstructionTransferObject) qto.getInstruction();
				} else {
					// instr.setVersion(mto.getForm().getVersion());
					// instr.setLongName(ques.getLongName());
					// instr.setAslName(mto.getAslName());
					// instr.setDisplayOrder(1);
					// context
					// createdby
				}

				instr.setLongName(ques.getLongName());
				instr.setAslName(mto.getAslName());
				instr.setDisplayOrder(1);
				instr.setVersion(1F);
				instr.setContext(mto.getForm().getContext());
				instr.setCreatedBy(mto.getForm().getCreatedBy());

				if (ques.getInstructions() == null || ques.getInstructions().equals("")) {
					instr.setPreferredDefinition(" ");
				} else {
					instr.setPreferredDefinition(ques.getInstructions());
				}

				dbinstructions.add(instr);
				qto.setInstructions(dbinstructions);

				if (ques.getQuesIdseq() == null || ques.getQuesIdseq() == "") {
					
					for (FEValidValue bbVV : ques.getValidValues()) {

						System.out.println("HEY! Translating valid values");
						ValidValueTransferObject vvto = new ValidValueTransferObject();
						BeanUtils.copyProperties(bbVV, vvto);

						InstructionTransferObject vvinstr = new InstructionTransferObject();
						List vvInstructions = vvInstrDao.getInstructions(vvto.getVdIdseq());
						if (vvInstructions.size() > 0) {
							vvto.setInstructions(vvInstructions);
						}

						vvinstr.setLongName(ques.getLongName());
						vvinstr.setAslName(mto.getAslName());
						vvinstr.setDisplayOrder(1);
						vvinstr.setVersion(1F);
						vvinstr.setContext(mto.getForm().getContext());
						vvinstr.setCreatedBy(mto.getForm().getCreatedBy());

						if (bbVV.getInstructions() == null || bbVV.getInstructions().equals("")) {
							vvinstr.setPreferredDefinition(" ");
						} else {
							vvinstr.setPreferredDefinition(ques.getInstructions());
						}

						vvInstructions.add(vvinstr);
						vvto.setInstructions(vvInstructions);

//						qto.getDataElement().getValueDomain().getValidValues().add(vvto);
						qto.getValidValues().add(vvto);

					}
					
					modChange.getNewQuestions().add(qto);
					
					System.out.println("# of question vv's 2: " + qto.getValidValues().size());
					System.out.println("ADDING QUESTION: " + qto.getLongName());
				} else if (ques.getIsEdited()) {

					QuestionChangeTransferObject quesChange = new QuestionChangeTransferObject();

					quesChange.setUpdatedQuestion(qto);

					quesChange.setInstructionChanges(new InstructionChangesTransferObject());
					quesChange.getInstructionChanges().setParentId(ques.getQuesIdseq());
					if (qto.getInstruction().getIdseq() == null) {
						quesChange.getInstructionChanges().setNewInstruction(qto.getInstruction());
					} else {
						quesChange.getInstructionChanges().setUpdatedInstruction(qto.getInstruction());
					}

					FormValidValueChangesTransferObject validValueChange = new FormValidValueChangesTransferObject();

					validValueChange.setDeletedValidValues(new ArrayList());
					validValueChange.setNewValidValues(new ArrayList());
					validValueChange.setUpdatedValidValues(new ArrayList());

					for (FEModule oldMod : oldForm.getFormModules()) {
						if (oldMod.getModuleIdseq().equals(mto.getModuleIdseq())) {

							for (FEQuestion oldQues : oldMod.getQuestions()) {
								if (oldQues.getQuesIdseq().equals(qto.getQuesIdseq())) {

									for (FEValidValue oldValue : oldQues.getValidValues()) {
										if (!qto.getValidValues().contains(oldValue)) {
//											ValidValueTransferObject deleteValue = new ValidValueTransferObject();
											FormValidValueTransferObject deleteValue = new FormValidValueTransferObject();
											deleteValue.setValueIdseq(oldValue.getValueIdseq());
											validValueChange.getDeletedValidValues().add(deleteValue);
										}
									}
								}
							}
						}
					}

					for (FEValidValue bbVV : ques.getValidValues()) {

						ValidValueTransferObject vvto = new ValidValueTransferObject();
						BeanUtils.copyProperties(bbVV, vvto);

						InstructionTransferObject vvinstr = new InstructionTransferObject();
						List vvInstructions = vvInstrDao.getInstructions(vvto.getVdIdseq());
						if (vvInstructions.size() > 0) {
							vvto.setInstructions(vvInstructions);
						}

						vvinstr.setLongName(ques.getLongName());
						vvinstr.setAslName(mto.getAslName());
						vvinstr.setDisplayOrder(1);
						vvinstr.setVersion(1F);
						vvinstr.setContext(mto.getForm().getContext());
						vvinstr.setCreatedBy(mto.getForm().getCreatedBy());

						if (bbVV.getInstructions() == null || bbVV.getInstructions().equals("")) {
							vvinstr.setPreferredDefinition(" ");
						} else {
							vvinstr.setPreferredDefinition(ques.getInstructions());
						}

						vvInstructions.add(vvinstr);
						vvto.setInstructions(vvInstructions);

						if (bbVV.getIsEdited()) {
							validValueChange.getUpdatedValidValues().add(vvto);
						} /*else if (bbVV.getIsDeleted()) {
							validValueChange.getDeletedValidValues().add(vvto);
						}*/ else if (bbVV.getValueIdseq().isEmpty()) {
							validValueChange.getNewValidValues().add(vvto);
						}

					}

					quesChange.setFormValidValueChanges(validValueChange);

					modChange.getUpdatedQuestions().add(quesChange);
				}
			}

			service.updateModule(mto.getModuleIdseq(), modChange, mto.getCreatedBy());

		}
	}

	public FEForm testTranslateDBFormToBBForm(FormTransferObject fullform) {
		FEForm bbform = new FEForm();
		FEFormMetaData bbmeta = new FEFormMetaData();
		// FormTransferObject fullform = getFullForm(formIdSeq);

		long startTime = System.currentTimeMillis();

		BeanUtils.copyProperties(fullform, bbform);
		BeanUtils.copyProperties(fullform, bbmeta, "context", "protocols", "classifications");

		FEContext bbcontext = new FEContext();
		bbcontext.setConteIdseq(fullform.getConteIdseq());
		bbcontext.setName(fullform.getContextName());
		bbcontext.setDescription(fullform.getContext().getDescription());

		List<FEProtocol> bbprotocols = new ArrayList<FEProtocol>();
		for (Object obj : fullform.getProtocols()) {
			ProtocolTransferObject protocol = (ProtocolTransferObject) obj;

			FEProtocol bbprotocol = new FEProtocol();
			bbprotocol.setLongName(protocol.getLongName());
			bbprotocol.setProtoIdseq(protocol.getProtoIdseq());

			bbprotocols.add(bbprotocol);

		}
		bbmeta.setProtocols(bbprotocols);

		List<FEClassification> classifications = new ArrayList<FEClassification>();
		if (fullform.getClassifications() != null) {
			for (Object obj : fullform.getClassifications()) {
				CSITransferObject cto = (CSITransferObject) obj;

				FEClassification classification = new FEClassification();
				BeanUtils.copyProperties(cto, classification);

				classifications.add(classification);
			}

			bbmeta.setClassifications(classifications);
		}

		bbmeta.setWorkflow(fullform.getAslName());
		bbmeta.setContext(bbcontext);

		if (fullform.getInstruction() != null) {
			bbmeta.setHeaderInstructions(fullform.getInstruction().getPreferredDefinition());
		} else {
			bbmeta.setHeaderInstructions("");
		}
		if (fullform.getFooterInstruction() != null) {
			bbmeta.setFooterInstructions(fullform.getFooterInstruction().getPreferredDefinition());
		} else {
			bbmeta.setFooterInstructions("");
		}

		bbform.setFormMetadata(bbmeta);
		bbform.setFormModules(new ArrayList<FEModule>());

		for (Object module : fullform.getModules()) {
			ModuleTransferObject mto = (ModuleTransferObject) module;
			FEModule bbmod = new FEModule();
			BeanUtils.copyProperties(mto, bbmod, "instructions");

			// BBInstructions bbinst = new BBInstructions();
			// if(mto.getInstruction() != null){
			// BeanUtils.copyProperties(mto.getInstruction(), bbinst,
			// "context");
			// }
			if (mto.getInstruction() != null) {
				bbmod.setInstructions(mto.getInstruction().getPreferredDefinition());
			}
			
			bbmod.setDispOrder(mto.getDisplayOrder());

			bbmod.setForm(bbmeta);

			bbform.getFormModules().add(bbmod);

			bbmod.setQuestions(new ArrayList<FEQuestion>());

			for (Object question : mto.getQuestions()) {
				QuestionTransferObject qto = (QuestionTransferObject) question;
				FEQuestion bbques = new FEQuestion();
				BeanUtils.copyProperties(qto, bbques);

				bbques.setVersion(qto.getVersion());
				bbques.setMandatory(qto.isMandatory());
				bbques.setEditable(qto.isEditable());
				bbques.setDeDerived(qto.isDeDerived());
				bbques.setLongName(qto.getLongName());

				if (qto.getInstruction() != null) {
					bbques.setInstructions(qto.getInstruction().getPreferredDefinition());
				}
				if (qto.getDefaultValue() != null) {
					bbques.setDefaultValue(qto.getDefaultValue());
				}

				if (qto.getDataElement() != null) {
					bbques.setDeIdseq(qto.getDataElement().getIdseq());
					bbques.setValueDomainLongName(qto.getDataElement().getValueDomain().getLongName());
					bbques.setDataType(qto.getDataElement().getValueDomain().getDatatype());
					bbques.setUnitOfMeasure(qto.getDataElement().getValueDomain().getUnitOfMeasure());
					bbques.setDisplayFormat(qto.getDataElement().getValueDomain().getDisplayFormat());
					// bbques.setConcepts(qto.getDataElement().getValueDomain().getConceptDerivationRule().getComponentConcepts().toString());

					List<String> altQuestionTexts = new ArrayList<String>();

					for (Object obj : qto.getDataElement().getRefereceDocs()) {
						ReferenceDocumentTransferObject refDoc = (ReferenceDocumentTransferObject) obj;

						if (refDoc.getDocType().equals("Preferred Question Text")) {
							bbques.setPreferredQuestionText(refDoc.getDocText());
						} else if (refDoc.getDocType().equals("Alternate Question Text")) {
							String altQuestionText = refDoc.getDocText();

							altQuestionTexts.add(altQuestionText);
						}
					}
					
					bbques.setAlternativeQuestionText(altQuestionTexts);
					// TODO: need to translate dataelement as well and set in
					// question
				}

				bbmod.getQuestions().add(bbques);

				bbques.setValidValues(new ArrayList<FEValidValue>());

				for (Object validVal : qto.getValidValues()) {
					FormValidValueTransferObject vvto = (FormValidValueTransferObject) validVal;
					FEValidValue bbval = new FEValidValue();
					BeanUtils.copyProperties(vvto, bbval);

					if (vvto.getInstruction() != null) {
						bbval.setInstructions(vvto.getInstruction().getPreferredDefinition());
					}

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

		FEForm simpleForm = this.testTranslateDBFormToBBForm(fullForm);

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
		 * long startTimer3 = System.currentTimeMillis();
		 * 
		 * FormV2TransferObject fullFormV2 =
		 * formManager.getFullFormV2(formIdSeq);
		 * 
		 * long endTimer3 = System.currentTimeMillis(); String
		 * retrieveV2FromDBTime = "" + (endTimer3 - startTimer3);
		 * 
		 * long startTimer4 = System.currentTimeMillis();
		 * 
		 * FormTransferObject formRow = this.getFormRow(formIdSeq);
		 * 
		 * long endTimer4 = System.currentTimeMillis(); String
		 * retrieveRowFromDBTime = "" + (endTimer4 - startTimer4);
		 */

		// sb.append("Time(ms) to retrieve V2 from DB: " + retrieveV2FromDBTime
		// + "\n");
		sb.append("Time(ms) to retrieve V2 from DB: N/A \n");
		// sb.append("Time(ms) to retrieve header-only (metadata) from DB: " +
		// retrieveRowFromDBTime + "\n");
		sb.append("Time(ms) to retrieve header-only (metadata) from DB: N/A \n");
		sb.append("-------------------------------------------------------------------\n\n");

		return sb.toString();
	}

	private Map getInstructionChanges(Map mainMap, String currInstrStr, Instruction orgInstr, Form parent,
			String currNameStr) {
		if (mainMap == null)
			mainMap = new HashMap();
		if (currInstrStr == null && orgInstr != null) {
			List toDelete = (List) mainMap.get(FormInstructionChanges.DELETED_INSTRUCTIONS);
			if (toDelete == null) {
				toDelete = new ArrayList();
			}
			toDelete.add(orgInstr);
			mainMap.put(FormInstructionChanges.DELETED_INSTRUCTIONS, toDelete);
			return mainMap;
		}
		if (currInstrStr != null && orgInstr == null) {
			if (!currInstrStr.trim().equals("")) {
				Instruction instr = new InstructionTransferObject();
				instr.setLongName(currNameStr);
				instr.setDisplayOrder(0);
				instr.setVersion(new Float(1));
				instr.setAslName("DRAFT NEW");
				instr.setContext(parent.getContext());
				instr.setPreferredDefinition(currInstrStr);

				Map newInstrs = (Map) mainMap.get(FormInstructionChanges.NEW_INSTRUCTION_MAP);
				if (newInstrs == null) {
					newInstrs = new HashMap();
				}
				newInstrs.put(parent.getFormIdseq(), instr);
				mainMap.put(FormInstructionChanges.NEW_INSTRUCTION_MAP, newInstrs);
				return mainMap;
			}
		}
		if (currInstrStr != null && orgInstr != null) {
			if (!currInstrStr.equals(orgInstr.getPreferredDefinition()) && !currInstrStr.trim().equals("")) {
				List updatedInstrs = (List) mainMap.get(FormInstructionChanges.UPDATED_INSTRUCTIONS);
				if (updatedInstrs == null) {
					updatedInstrs = new ArrayList();
				}
				orgInstr.setLongName(currNameStr);
				orgInstr.setPreferredDefinition(currInstrStr);
				updatedInstrs.add(orgInstr);
				mainMap.put(FormInstructionChanges.UPDATED_INSTRUCTIONS, updatedInstrs);
				return mainMap;
			} else if (!currInstrStr.equals(orgInstr.getPreferredDefinition()) && currInstrStr.trim().equals("")) {
				List toDelete = (List) mainMap.get(FormInstructionChanges.DELETED_INSTRUCTIONS);
				if (toDelete == null) {
					toDelete = new ArrayList();
				}
				toDelete.add(orgInstr);
				mainMap.put(FormInstructionChanges.DELETED_INSTRUCTIONS, toDelete);
				return mainMap;
			}
		}
		return mainMap;
	}

	public String copyForm(String sourceFormPK, Form newForm) {
		Form resultForm = null;
		FormDAO myDAO = daoFactory.getFormDAO();
		String resultFormPK = myDAO.copyForm(sourceFormPK, newForm);
		// resultForm = this.getFormDetails(resultFormPK);
		return resultFormPK;
	}

	public int deleteForm(String formPK) {
		FormDAO fdao = daoFactory.getFormDAO();

		return fdao.deleteForm(formPK);
	}

	private void updateFormClassifications(FEForm form) {
		ClassificationSchemeDAO classDao = daoFactory.getClassificationSchemeDAO();

		String formIdseq = form.getFormMetadata().getFormIdseq();
		
		Collection oldClassifications;

		try{
			oldClassifications = classDao.retrieveClassifications(formIdseq);
		}
		catch(InvalidDataAccessApiUsageException e){
			oldClassifications = new ArrayList<>();
		}

		List<String> formid = new ArrayList<String>();
		List<String> cscsiIds = new ArrayList<String>();

		for (FEClassification feclassification : form.getFormMetadata().getClassifications()) {
			formid.add(formIdseq);
			cscsiIds.add(feclassification.getCsCsiIdseq());
		}

		for (Object obj : oldClassifications) {
			CSITransferObject oldClass = (CSITransferObject) obj;
			if (!cscsiIds.contains(oldClass.getCsCsiIdseq())) {
				service.removeFFormClassification(oldClass.getCsCsiIdseq(), formIdseq);
			}
		}

		service.assignFormClassification(formid, cscsiIds);
	}

	private void adaptProtocols(FEForm form, FEForm oldForm, Collection addedProts, Collection deletedProts) {

		List<FEProtocol> protocols = form.getFormMetadata().getProtocols();
		List<FEProtocol> oldProtocols = oldForm.getFormMetadata().getProtocols();

		for (FEProtocol protocol : protocols) {
			System.out.println("prot: " + protocol.getProtoIdseq());
			if (!oldProtocols.contains(protocol)) {
				System.out.println("ADDED: " + protocol.getProtoIdseq());
				addedProts.add(protocol.getProtoIdseq());
			}
		}

		for (FEProtocol oldProtocol : oldProtocols) {
			System.out.println("oldProt: " + oldProtocol.getProtoIdseq());
			if (!protocols.contains(oldProtocol)) {
				System.out.println("DELETED: " + oldProtocol.getProtoIdseq());
				deletedProts.add(oldProtocol.getProtoIdseq());
			}
		}

	}
	
//	public List<FEValidValue> getValidValuesForCDE(String deIdSeq){
//		
//	}

}
