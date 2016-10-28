package gov.nih.nci.cadsr.controller;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import gov.nih.nci.cadsr.model.frontend.FEContext;
import gov.nih.nci.cadsr.model.frontend.FEUser;
import gov.nih.nci.ncicb.cadsr.common.dto.ContextTransferObject;
import gov.nih.nci.ncicb.cadsr.common.dto.NCIUserTransferObject;
import gov.nih.nci.ncicb.cadsr.common.persistence.dao.AbstractDAOFactoryFB;
import gov.nih.nci.ncicb.cadsr.common.persistence.dao.ContextDAO;
import gov.nih.nci.ncicb.cadsr.common.persistence.dao.UserManagerDAO;

@RestController
@RequestMapping(value = "/users")
public class UserController {
	
	@Autowired
	AbstractDAOFactoryFB daoFactory;
	
//	@Autowired
//	private UserManagerDAO userManagerDAO;
	
	@RequestMapping(value = { "/login/{username}/{password}" }, method = RequestMethod.GET)
	@ResponseBody
	public Boolean login(@PathVariable String username, @PathVariable String password) {
		//TODO Probably should use header auth creds instead
		
		UserManagerDAO userManagerDAO = daoFactory.getUserManagerDAO();
		
		Boolean isUserValid = false;
        isUserValid = userManagerDAO.validUser(username, password);
        return isUserValid;
		
	}
	
	@RequestMapping(value = { "/{username}" }, method = RequestMethod.GET)
	@ResponseBody
	public FEUser getUser(@PathVariable String username) {
		
		UserManagerDAO userManagerDAO = daoFactory.getUserManagerDAO();
		ContextDAO contextDao = daoFactory.getContextDAO();
		
        NCIUserTransferObject userTO = (NCIUserTransferObject)userManagerDAO.getNCIUser(username);
        Collection contextAdminContexts;
        contextAdminContexts = userTO.getContextsByRoleAccess("CONTEXT_ADMIN");
        
        FEUser bbuser = new FEUser();
        List<FEContext> contexts = new ArrayList<FEContext>();
        
        //TODO: add TEST and Training contexts manually
        ContextTransferObject testContext = (ContextTransferObject)contextDao.getContextByName("TEST");
//        ContextTransferObject trainingContext = (ContextTransferObject)contextDao.getContextByName("Training");
        
        FEContext fetestContext = new FEContext();
//        FEContext fetrainingContext = new FEContext();
        
        fetestContext.setName(testContext.getName());
        fetestContext.setConteIdseq(testContext.getConteIdseq());
        
//        fetrainingContext.setName(trainingContext.getName());
//        fetrainingContext.setConteIdseq(trainingContext.getConteIdseq());
        
        contexts.add(fetestContext);
//        contexts.add(fetrainingContext);
        
        if(contextAdminContexts != null){
	        for(Object adminContext : contextAdminContexts){
//        	for(Object adminContext : userTO.getContextsByRole().values()){
	        	ContextTransferObject cto = (ContextTransferObject)adminContext;
	        	FEContext context = new FEContext();
	        	context.setConteIdseq(cto.getConteIdseq());
	        	context.setName(cto.getName());
	        	
	        	contexts.add(context);
	        }
        }
        
        bbuser.setUsername(username);
        bbuser.setEmailAddress(userTO.getEmailAddress());
        bbuser.setPhoneNumber(userTO.getPhoneNumber());
        bbuser.setContexts(contexts);
        
        return bbuser;
		
	}

}
