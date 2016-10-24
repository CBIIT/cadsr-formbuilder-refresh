package gov.nih.nci.cadsr.model.session;

import java.util.ArrayList;
import java.util.List;

import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Component;

import gov.nih.nci.ncicb.cadsr.common.dto.DataElementTransferObject;
import gov.nih.nci.ncicb.cadsr.common.dto.FormTransferObject;
import gov.nih.nci.ncicb.cadsr.common.dto.ModuleTransferObject;

@Component
@Scope(proxyMode=ScopedProxyMode.TARGET_CLASS, value="session")
public class SessionCarts {

	private List<ModuleTransferObject> moduleCart;
	private List<DataElementTransferObject> cdeCart;
	private List<FormTransferObject> formCart;
	
	
	public SessionCarts(){
		moduleCart = new ArrayList<ModuleTransferObject>();
		cdeCart = new ArrayList<DataElementTransferObject>();
		formCart = new ArrayList<FormTransferObject>();
	}
	
	
	public List<ModuleTransferObject> getModuleCart() {
		return moduleCart;
	}
	public void setModuleCart(List<ModuleTransferObject> moduleCart) {
		this.moduleCart = moduleCart;
	}
	public List<DataElementTransferObject> getCdeCart() {
		return cdeCart;
	}
	public void setCdeCart(List<DataElementTransferObject> cdeCart) {
		this.cdeCart = cdeCart;
	}
	public List<FormTransferObject> getFormCart() {
		return formCart;
	}
	public void setFormCart(List<FormTransferObject> formCart) {
		this.formCart = formCart;
	}
	
}
