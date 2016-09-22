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

import gov.nih.nci.cadsr.model.BBContext;
import gov.nih.nci.cadsr.model.BBUser;
import gov.nih.nci.ncicb.cadsr.common.dto.ContextTransferObject;
import gov.nih.nci.ncicb.cadsr.common.dto.NCIUserTransferObject;
import gov.nih.nci.ncicb.cadsr.common.persistence.dao.AbstractDAOFactoryFB;
import gov.nih.nci.ncicb.cadsr.common.persistence.dao.FormDAO;
import gov.nih.nci.ncicb.cadsr.common.persistence.dao.UserManagerDAO;
import gov.nih.nci.ncicb.cadsr.common.resource.NCIUser;

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
	public BBUser getUser(@PathVariable String username) {
		
		UserManagerDAO userManagerDAO = daoFactory.getUserManagerDAO();
		
        NCIUserTransferObject userTO = (NCIUserTransferObject)userManagerDAO.getNCIUser(username);
        Collection contextAdminContexts = userTO.getContextsByRoleAccess("CONTEXT_ADMIN");
        
        BBUser bbuser = new BBUser();
        List<BBContext> contexts = new ArrayList<BBContext>();
        
        for(Object adminContext : contextAdminContexts){
        	ContextTransferObject cto = (ContextTransferObject)adminContext;
        	BBContext context = new BBContext();
        	context.setConteIdseq(cto.getConteIdseq());
        	context.setName(cto.getName());
        	
        	contexts.add(context);
        }
        
        bbuser.setUsername(username);
        bbuser.setEmailAddress(userTO.getEmailAddress());
        bbuser.setPhoneNumber(userTO.getPhoneNumber());
        bbuser.setContexts(contexts);
        
        return bbuser;
		
	}

}
