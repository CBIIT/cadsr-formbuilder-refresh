package gov.nih.nci.cadsr.manager.impl;

import java.lang.reflect.InvocationTargetException;
import java.util.Collection;

import org.apache.commons.beanutils.BeanUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import gov.nih.nci.cadsr.manager.FormManager;
import gov.nih.nci.cadsr.model.CurrentForm;
import gov.nih.nci.cadsr.model.FormWrapper;
import gov.nih.nci.cadsr.model.ModuleChangesWrapper;
import gov.nih.nci.ncicb.cadsr.common.dto.ContextTransferObject;
import gov.nih.nci.ncicb.cadsr.common.dto.FormTransferObject;
import gov.nih.nci.ncicb.cadsr.common.dto.InstructionTransferObject;
import gov.nih.nci.ncicb.cadsr.common.dto.ModuleChangesTransferObject;
import gov.nih.nci.ncicb.cadsr.common.dto.ModuleTransferObject;
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
	public void createFormComponent(FormWrapper form, InstructionTransferObject headerInstruction, InstructionTransferObject footerInstruction) {
		FormDAO fdao = daoFactory.getFormDAO();
		FormTransferObject formTransferObject = new FormTransferObject();
		

		formTransferObject.setCreatedBy(form.getCreatedBy());
		formTransferObject.setLongName(form.getLongName());
		formTransferObject.setPreferredDefinition(form.getPreferredDefinition());
		formTransferObject.setContext(form.getContext());
		formTransferObject.setAslName(form.getAslName());
		formTransferObject.setFormCategory(form.getFormCategory());
		formTransferObject.setFormType(form.getFormType());
		formTransferObject.setVersion(form.getVersion());
		formTransferObject.setProtocols(form.getProtocolTransferObjects());
		String id = fdao.createFormComponent(formTransferObject);
		//throw new RuntimeException("******" + formTransferObject.getFormIdseq());
		
		if (headerInstruction != null)
        {
            FormInstructionDAO fidao1 = daoFactory.getFormInstructionDAO();
            fidao1.createInstruction(headerInstruction, id);
        }

        if (footerInstruction != null)
        {
            FormInstructionDAO fidao2 = daoFactory.getFormInstructionDAO();
            fidao2
            .createFooterInstruction(footerInstruction, id);
        }
		
		form.setFormIdseq(id);

	}
	
	public void updateForm(String formIdSeq, CurrentForm form){
		prepareModules(formIdSeq, form);
		
		/**
		 * updateForm() method expects generic Collections.
		 * Converting Lists to Collections.
		 * Also very hacky.
		 */
		Collection upMods = form.getUpdatedModules();
		Collection delMods = form.getDeletedModules();
		Collection addMods = form.getAddedModules();
		Collection addProts = form.getAddedProtocols();
		Collection delProts = form.getDeletedProtocols();
		Collection protTrigs = form.getProtocolTriggerActionChanges();
		
		String username = form.getFormHeader().getCreatedBy();
		
		Form resultForm = service.updateForm(formIdSeq, null, upMods, delMods, addMods, addProts, delProts, protTrigs, form.getInstructionChanges(), username);

		/**
		 * The updateForm() method only updates changed modules' display order, and does not seem to address questions at all.
		 * For these updates to occur for Modules and their child Questions, the updateModule() method must be called,
		 * currently found in FormBuilderService.updateModule(moduleIdSeq, moduleChanges, username).
		 * This method can either be called for each updated Modules after the updateForm, or the 
		 * updateForm() method may be altered to include this call for each update Module (more efficient).
		 */
//		for(ModuleChangesTransferObject mod : form.getUpdatedModules()){
//			service.updateModule(mod.getModuleId(), mod, username);
//		}
		
	}
	
	public FormTransferObject getFullForm(String formIdSeq){
		Form form = service.getFormDetails(formIdSeq);
		
		FormTransferObject fto = (FormTransferObject)form;
		
		return fto;
	}
	
	/**
	 * Hacky solution for populating Module child-objects.
	 * They can't be passed from client as they are interfaces (even in ModuleTransferObject).
	 * This must occur for at least all added Modules, perhaps also needed for the updatedModules and deletedModules,
	 * not sure. Would have to check for needed fields in queries in deleteModule and updateModule.
	 * This logic should be isolated to its own utility method.
	 * @throws InvocationTargetException 
	 * @throws IllegalAccessException 
	 */
	private void prepareModules(String formIdSeq, CurrentForm form){
		try{
			
			if(!form.getFormHeader().getLongName().isEmpty()){
				FormTransferObject fto = new FormTransferObject();
				BeanUtils.copyProperties(fto, form.getFormHeader());
			}
			
			for(ModuleTransferObject mod : form.getAddedModules()){
				FormTransferObject f = new FormTransferObject();
				ContextTransferObject c = new ContextTransferObject();
				
				c.setConteIdseq(mod.getConteIdseq());
				f.setContext(c);
				f.setFormIdseq(formIdSeq);
				
				mod.setForm(f);
			}
			
			/*for(ModuleWrapper mod : form.getAddedModules()){
				ModuleTransferObject mto = new ModuleTransferObject();
				BeanUtils.copyProperties(mto, mod);
			}*/
			
			for(ModuleChangesWrapper mod : form.getUpdatedModules()){
				ModuleChangesTransferObject mto = new ModuleChangesTransferObject();
				BeanUtils.copyProperties(mto, mod);
				
			}
		
		} catch(Exception e){
			e.printStackTrace();
		}
	}


}
