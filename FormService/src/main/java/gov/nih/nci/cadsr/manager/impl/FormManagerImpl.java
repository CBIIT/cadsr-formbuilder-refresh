package gov.nih.nci.cadsr.manager.impl;

import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import gov.nih.nci.cadsr.manager.FormManager;
import gov.nih.nci.cadsr.model.BBForm;
import gov.nih.nci.cadsr.model.BBFormMetaData;
import gov.nih.nci.cadsr.model.BBModule;
import gov.nih.nci.cadsr.model.BBProtocol;
import gov.nih.nci.cadsr.model.BBQuestion;
import gov.nih.nci.cadsr.model.BBValidValue;
import gov.nih.nci.cadsr.model.ModuleChangesWrapper;
import gov.nih.nci.ncicb.cadsr.common.dto.ContextTransferObject;
import gov.nih.nci.ncicb.cadsr.common.dto.FormInstructionChangesTransferObject;
import gov.nih.nci.ncicb.cadsr.common.dto.FormTransferObject;
import gov.nih.nci.ncicb.cadsr.common.dto.FormValidValueTransferObject;
import gov.nih.nci.ncicb.cadsr.common.dto.InstructionTransferObject;
import gov.nih.nci.ncicb.cadsr.common.dto.ModuleChangesTransferObject;
import gov.nih.nci.ncicb.cadsr.common.dto.ModuleTransferObject;
import gov.nih.nci.ncicb.cadsr.common.dto.ProtocolTransferObject;
import gov.nih.nci.ncicb.cadsr.common.dto.QuestionTransferObject;
import gov.nih.nci.ncicb.cadsr.common.dto.TriggerActionChangesTransferObject;
import gov.nih.nci.ncicb.cadsr.common.exception.DMLException;
import gov.nih.nci.ncicb.cadsr.common.persistence.dao.AbstractDAOFactoryFB;
import gov.nih.nci.ncicb.cadsr.common.persistence.dao.ContextDAO;
import gov.nih.nci.ncicb.cadsr.common.persistence.dao.FormDAO;
import gov.nih.nci.ncicb.cadsr.common.persistence.dao.FormInstructionDAO;
import gov.nih.nci.ncicb.cadsr.common.persistence.dao.jdbc.JDBCFormDAOFB;
import gov.nih.nci.ncicb.cadsr.common.resource.Form;
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

		form.setFormIdseq(id);
		
		return form;

	}


	public FormTransferObject getFullForm(String formIdSeq) {
		Form form = service.getFormDetails(formIdSeq);

		FormTransferObject fto = (FormTransferObject) form;

		return fto;
	}

	/**
	 * Hacky solution for populating Module child-objects. They can't be passed
	 * from client as they are interfaces (even in ModuleTransferObject). This
	 * must occur for at least all added Modules, perhaps also needed for the
	 * updatedModules and deletedModules, not sure. Would have to check for
	 * needed fields in queries in deleteModule and updateModule. This logic
	 * should be isolated to its own utility method.
	 * 
	 * @throws InvocationTargetException
	 * @throws IllegalAccessException
	 */
	/*private void prepareModules(String formIdSeq, CurrentForm form) {
		try {

			if (!form.getFormHeader().getLongName().isEmpty()) {
				FormTransferObject fto = new FormTransferObject();
				BeanUtils.copyProperties(form.getFormHeader(), fto);
			}

			for (ModuleTransferObject mod : form.getAddedModules()) {
				FormTransferObject f = new FormTransferObject();
				ContextTransferObject c = new ContextTransferObject();

				c.setConteIdseq(mod.getConteIdseq());
				f.setContext(c);
				f.setFormIdseq(formIdSeq);

				mod.setForm(f);
			}

			
			 * for(ModuleWrapper mod : form.getAddedModules()){
			 * ModuleTransferObject mto = new ModuleTransferObject();
			 * BeanUtils.copyProperties(mto, mod); }
			 

			for (ModuleChangesWrapper mod : form.getUpdatedModules()) {
				ModuleChangesTransferObject mto = new ModuleChangesTransferObject();
				BeanUtils.copyProperties(mod, mto);

			}

		} catch (Exception e) {
			e.printStackTrace();
		}
	}*/

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

		return "SUCCESS";
	}

	private void adaptModels(BBForm form, FormTransferObject formHeader, Collection addedMods, Collection updatedMods,
			Collection deletedMods, Collection addedProts, Collection deletedProts, Collection protTrigs,
			FormInstructionChangesTransferObject instChanges, String username, String formIdSeq)
			throws IllegalAccessException, InvocationTargetException {
		FormDAO fdao = daoFactory.getFormDAO();

		formIdSeq = form.getFormMetadata().getFormIdseq();
		username = form.getFormMetadata().getCreatedBy();

		// List oldModules = (List)fdao.getModulesInAForm(formIdSeq); //TODO:
		// Need to confirm this is correct
		BeanUtils.copyProperties(form.getFormMetadata(), formHeader, "context", "protocols");
		System.out.println("HEY TEST ME!" + form.getFormMetadata().getFormType());
		System.out.println("HEY TEST ME!2" + formHeader.getFormType());
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
			instr.setVersion(form.getFormMetadata().getVersion());
			instr.setLongName(form.getFormMetadata().getLongName());
			instr.setAslName(form.getFormMetadata().getWorkflow());
			instr.setContext(c);
			instr.setCreatedBy(username);
			instr.setPreferredDefinition(module.getInstructions());
			m.setInstruction(instr);
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

			if (module.getModuleIdseq() != null || module.getModuleIdseq() != "") {
				addedMods.add(m);
			} else if (module.isEdited() && !module.getModuleIdseq().isEmpty()) {
				updatedMods.add(m);
			}
			// else if(!oldModules.contains(m)){
			// deletedMods.add(m);
			// }
		}

		instChanges.setFormHeaderInstructionChanges(new HashMap());
		instChanges.setFormFooterInstructionChanges(new HashMap());

	}

	public BBForm testTranslateDBFormToBBForm(String formIdSeq) {
		BBForm bbform = new BBForm();
		BBFormMetaData bbmeta = new BBFormMetaData();
		FormTransferObject fullform = getFullForm(formIdSeq);

		long startTime = System.currentTimeMillis();

		BeanUtils.copyProperties(fullform, bbform);
		BeanUtils.copyProperties(fullform, bbmeta, "context", "protocols");
		bbform.setFormMetadata(bbmeta);
		bbform.setFormModules(new ArrayList<BBModule>());

		for (Object module : fullform.getModules()) {
			ModuleTransferObject mto = (ModuleTransferObject) module;
			BBModule bbmod = new BBModule();
			BeanUtils.copyProperties(mto, bbmod);

			bbform.getFormModules().add(bbmod);

			bbmod.setQuestions(new ArrayList<BBQuestion>());

			for (Object question : mto.getQuestions()) {
				QuestionTransferObject qto = (QuestionTransferObject) question;
				BBQuestion bbques = new BBQuestion();
				BeanUtils.copyProperties(qto, bbques);

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

}
