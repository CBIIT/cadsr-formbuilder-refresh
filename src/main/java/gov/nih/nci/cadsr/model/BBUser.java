package gov.nih.nci.cadsr.model;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class BBUser {
	
	private String username;
	private List<BBContext> contexts = new ArrayList<BBContext>();
	private String emailAddress;
	private String phoneNumber;
	
	
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public List<BBContext> getContexts() {
		return contexts;
	}
	public void setContexts(List<BBContext> contexts) {
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
