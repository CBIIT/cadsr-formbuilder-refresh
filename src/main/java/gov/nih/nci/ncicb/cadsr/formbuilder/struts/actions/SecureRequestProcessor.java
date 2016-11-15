package gov.nih.nci.ncicb.cadsr.formbuilder.struts.actions;

import java.io.IOException;

import javax.annotation.PostConstruct;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.struts.action.Action;
import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import org.apache.struts.action.RequestProcessor;
import org.springframework.beans.factory.annotation.Autowired;

import gov.nih.nci.ncicb.cadsr.common.CaDSRConstants;
import gov.nih.nci.ncicb.cadsr.common.exception.InvalidUserException;
import gov.nih.nci.ncicb.cadsr.common.persistence.dao.AbstractDAOFactoryFB;
import gov.nih.nci.ncicb.cadsr.common.persistence.dao.UserManagerDAO;
import gov.nih.nci.ncicb.cadsr.common.resource.NCIUser;
import gov.nih.nci.ncicb.cadsr.common.servicelocator.spring.SpringObjectLocatorImpl;


public class SecureRequestProcessor extends RequestProcessor
implements CaDSRConstants {
	protected Log log = LogFactory.getLog(SecureRequestProcessor.class.getName());

	@Autowired
	AbstractDAOFactoryFB daoFactory;

	public AbstractDAOFactoryFB getDaoFactory() {
		return daoFactory;
	}

	public void setDaoFactory(AbstractDAOFactoryFB daoFactory) {
		this.daoFactory = daoFactory;
	}

	public SecureRequestProcessor() {
		super();
	}

	@PostConstruct
	public void initPostConstruct()
	{
		SpringObjectLocatorImpl beanLocator = new SpringObjectLocatorImpl();
		daoFactory = (AbstractDAOFactoryFB) beanLocator.findObject("daoFactory");
	}

	protected ActionForward processActionPerform(
			HttpServletRequest request,
			HttpServletResponse response,
			Action action,
			ActionForm form,
			ActionMapping mapping) throws IOException, ServletException {
		String username = getLoggedInUsername(request);

		if ((username == null) || username.equals("")) {
			//throw new InvalidUserException("Null username");
		}
		else {
			NCIUser currentuser =
					(NCIUser) request.getSession().getAttribute(USER_KEY);

			if (currentuser != null) {
				if (!currentuser.getUsername().equals(username)) {
					;
				}

				setApplictionUser(username, request);
			}
			else {
				setApplictionUser(username, request);
			}
		}

		return super.processActionPerform(request, response, action, form, mapping);
	}

	protected void setApplictionUser(
			String username,
			HttpServletRequest request) {
		NCIUser newuser = getNCIUser(username);

		if (newuser == null) {
			throw new InvalidUserException("Null User");
		}

		request.getSession().setAttribute(this.USER_KEY, newuser);
	}

	protected NCIUser getNCIUser(String username) {
		UserManagerDAO dao = daoFactory.getUserManagerDAO();
		NCIUser user = dao.getNCIUser(username);

		if (log.isInfoEnabled()) {
			log.info("getNCIUser()=" + user);
		}

		return user;
	}

	protected String getLoggedInUsername(HttpServletRequest request) {
		return request.getRemoteUser();
	}
}
