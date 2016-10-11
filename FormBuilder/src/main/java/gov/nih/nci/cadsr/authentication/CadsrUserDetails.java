package gov.nih.nci.cadsr.authentication;

import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import gov.nih.nci.cadsr.model.BBFormMetaData;
import gov.nih.nci.cadsr.model.BBModule;
import gov.nih.nci.cadsr.model.BBQuestion;
import gov.nih.nci.cadsr.model.BBUser;

public class CadsrUserDetails implements UserDetails{

	private BBUser user;
	private String password;
	private String username;
	private String token;
	
	private List<BBQuestion> cdeCart;
	private List<BBModule> moduleCart;
	private List<BBFormMetaData> formCart;
	
	public BBUser getUser() {
		return user;
	}

	public void setUser(BBUser user) {
		this.user = user;
	}

	public Collection<? extends GrantedAuthority> getAuthorities() {
		// TODO Auto-generated method stub
		return null;
	}

	public String getPassword() {
		return password;
	}
	
	public void setPassword(String password){
		this.password = password;
	}

	public String getUsername() {
		return username;
	}
	
	public void setUsername(String username){
		this.username = username;
	}

	public boolean isAccountNonExpired() {
		// TODO Auto-generated method stub
		return false;
	}

	public boolean isAccountNonLocked() {
		// TODO Auto-generated method stub
		return false;
	}

	public boolean isCredentialsNonExpired() {
		// TODO Auto-generated method stub
		return false;
	}

	public boolean isEnabled() {
		// TODO Auto-generated method stub
		return false;
	}
	
	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}

	public List<BBQuestion> getCdeCart() {
		return cdeCart;
	}

	public void setCdeCart(List<BBQuestion> cdeCart) {
		this.cdeCart = cdeCart;
	}

	public List<BBModule> getModuleCart() {
		return moduleCart;
	}

	public void setModuleCart(List<BBModule> moduleCart) {
		this.moduleCart = moduleCart;
	}

	public List<BBFormMetaData> getFormCart() {
		return formCart;
	}

	public void setFormCart(List<BBFormMetaData> formCart) {
		this.formCart = formCart;
	}

	public String toString(){
		return getUsername() + ":" + getToken() + ":" + getUser().getContexts().toString();
	}

}
