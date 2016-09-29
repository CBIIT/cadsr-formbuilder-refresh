package gov.nih.nci.cadsr.authentication;

import java.util.Collection;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import gov.nih.nci.cadsr.model.BBUser;
import gov.nih.nci.ncicb.cadsr.common.resource.NCIUser;

public class CadsrUserDetails implements UserDetails{

	private BBUser user;
	private String password;
	private String username;
	private String token;
	
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

	public String toString(){
		return getUsername() + ":" + getToken() + ":" + getUser().getContexts().toString();
	}

}
