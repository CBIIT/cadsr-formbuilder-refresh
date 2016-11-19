package gov.nih.nci.cadsr.authentication;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import gov.nih.nci.cadsr.model.frontend.FEFormMetaData;
import gov.nih.nci.cadsr.model.frontend.FEModule;
import gov.nih.nci.cadsr.model.frontend.FEQuestion;
import gov.nih.nci.cadsr.model.frontend.FEUser;

public class CadsrUserDetails implements UserDetails{

	private FEUser user;
	private String password;
	private String username;
	private String token;
	
	private List<FEQuestion> cdeCart;
	private List<FEModule> moduleCart;
	private List<FEFormMetaData> formCart;
	
	public CadsrUserDetails(){
		user = new FEUser();
		password = "";
		username = "";
		token = "";
		cdeCart = new ArrayList<FEQuestion>();
		moduleCart = new ArrayList<FEModule>();
		formCart = new ArrayList<FEFormMetaData>();
	}
	
	public FEUser getUser() {
		return user;
	}

	public void setUser(FEUser user) {
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

	public List<FEQuestion> getCdeCart() {
		return cdeCart;
	}

	public void setCdeCart(List<FEQuestion> cdeCart) {
		this.cdeCart = cdeCart;
	}

	public List<FEModule> getModuleCart() {
		return moduleCart;
	}

	public void setModuleCart(List<FEModule> moduleCart) {
		this.moduleCart = moduleCart;
	}

	public List<FEFormMetaData> getFormCart() {
		return formCart;
	}

	public void setFormCart(List<FEFormMetaData> formCart) {
		this.formCart = formCart;
	}

	public String toString(){
		return getUsername() + ":" + getToken() + ":" + getUser().getContexts().toString();
	}

}
