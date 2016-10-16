package gov.nih.nci.cadsr.model.session;

import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Component;

import gov.nih.nci.cadsr.authentication.AuthUtils;
import gov.nih.nci.cadsr.model.frontend.FEForm;
import gov.nih.nci.cadsr.model.frontend.FEUser;

@Component
@Scope(proxyMode=ScopedProxyMode.TARGET_CLASS, value="session")
public class SessionObject {
	
//	private String currentUser = "";
//	private String sessionValue = "";
	private boolean loggedIn = false;
//	private String token = "";
	private FEUser user;
	private FEForm workingCopy;
	
	
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
	public FEUser getUser() {
		return user;
	}
	public void setUser(FEUser user) {
		this.user = user;
	}
	public FEForm getWorkingCopy() {
		return workingCopy;
	}
	public void setWorkingCopy(FEForm workingCopy) {
		this.workingCopy = workingCopy;
	}
	
	/*public void generateToken(String password){
		AuthUtils util = new AuthUtils();
		
		this.setToken(util.md5(password));
	}*/

}
