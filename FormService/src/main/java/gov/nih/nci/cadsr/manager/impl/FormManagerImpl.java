package gov.nih.nci.cadsr.manager.impl;

import java.util.Collection;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import gov.nih.nci.cadsr.domain.Instruction;
import gov.nih.nci.cadsr.manager.FormManager;
import gov.nih.nci.cadsr.model.FormWrapper;
import gov.nih.nci.ncicb.cadsr.common.dto.FormTransferObject;
import gov.nih.nci.ncicb.cadsr.common.dto.InstructionTransferObject;
import gov.nih.nci.ncicb.cadsr.common.exception.DMLException;
import gov.nih.nci.ncicb.cadsr.common.persistence.dao.AbstractDAOFactoryFB;
import gov.nih.nci.ncicb.cadsr.common.persistence.dao.ContextDAO;
import gov.nih.nci.ncicb.cadsr.common.persistence.dao.FormDAO;
import gov.nih.nci.ncicb.cadsr.common.persistence.dao.FormInstructionDAO;
import gov.nih.nci.ncicb.cadsr.common.persistence.dao.jdbc.JDBCFormDAOFB;
import gov.nih.nci.ncicb.cadsr.common.resource.NCIUser;

@Service
public class FormManagerImpl implements FormManager {
	private static final Logger logger = Logger.getLogger(FormManagerImpl.class);
	@Autowired
	AbstractDAOFactoryFB daoFactory;
	@Autowired
	private JDBCFormDAOFB jd;

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

	// @Override
	// public void createFormComponent(FormTransferObject form) {
	// FormDAO fdao = daoFactory.getFormDAO();
	//
	// FormTransferObject fn = new FormTransferObject();
	//
	// ContextTransferObject contextTransferObject = new
	// ContextTransferObject();
	// ProtocolTransferObject protocolTransferObject =new
	// ProtocolTransferObject();
	// contextTransferObject.setConteIdseq(form.getConteIdseq());
	//
	// fn.setContext(contextTransferObject);
	// form.setContext(contextTransferObject);
	//
	// fdao.createFormComponent(form);
	//
	// }

	/*
	 * @Autowired private FormDao formDao;
	 */

	// @Override
	/*
	 * public List<Form> searchForm(String formLongName, String protocolIdSeq,
	 * String workflow, String category, String type, String
	 * classificationIdSeq, String publicId, String version) throws SQLException
	 * { return formDao.searchForm(formLongName, protocolIdSeq, workflow,
	 * category, type, classificationIdSeq, publicId, version);
	 */
	// }

}
