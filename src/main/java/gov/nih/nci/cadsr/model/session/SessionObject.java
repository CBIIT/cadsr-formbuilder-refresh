package gov.nih.nci.cadsr.model.session;

import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Component;

import gov.nih.nci.cadsr.authentication.AuthUtils;
import gov.nih.nci.cadsr.model.BBForm;
import gov.nih.nci.cadsr.model.BBUser;
import gov.nih.nci.ncicb.cadsr.common.resource.NCIUser;

@Component
@Scope(proxyMode=ScopedProxyMode.TARGET_CLASS, value="session")
public class SessionObject {
	
//	private String currentUser = "";
//	private String sessionValue = "";
	private boolean loggedIn = false;
//	private String token = "";
	private BBUser user;
	private BBForm workingCopy;
	
	
	/*public String getCurrentUser() {
		return currentUser;
	}
	public void setCurrentUser(String currentUser) {
		this.currentUser = currentUser;
	}
	public String getSessionValue() {
		return sessionValue;
	}
	public void setSessionValue(String sessionValue) {
		this.sessionValue = sessionValue;
	}*/
	public boolean isLoggedIn() {
		return loggedIn;
	}
	public void setLoggedIn(boolean loggedIn) {
		this.loggedIn = loggedIn;
	}
	/*public String getToken() {
		return token;
	}
	public void setToken(String token) {
		this.token = token;
	}*/
	public BBUser getUser() {
		return user;
	}
	public void setUser(BBUser user) {
		this.user = user;
	}
	public BBForm getWorkingCopy() {
		return workingCopy;
	}
	public void setWorkingCopy(BBForm workingCopy) {
		this.workingCopy = workingCopy;
	}
	
	/*public void generateToken(String password){
		AuthUtils util = new AuthUtils();
		
		this.setToken(util.md5(password));
	}*/

}
