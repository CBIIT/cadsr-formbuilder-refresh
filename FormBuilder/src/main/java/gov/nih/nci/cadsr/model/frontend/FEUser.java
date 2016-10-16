package gov.nih.nci.cadsr.model.frontend;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class FEUser implements FEBaseObject {
	
	private String username;
	private List<FEContext> contexts = new ArrayList<FEContext>();
	private String emailAddress;
	private String phoneNumber;
	
	
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public List<FEContext> getContexts() {
		return contexts;
	}
	public void setContexts(List<FEContext> contexts) {
		this.contexts = contexts;
	}
	public String getEmailAddress() {
		return emailAddress;
	}
	public void setEmailAddress(String emailAddress) {
		this.emailAddress = emailAddress;
	}
	public String getPhoneNumber() {
		return phoneNumber;
	}
	public void setPhoneNumber(String phoneNumber) {
		this.phoneNumber = phoneNumber;
	}

}
