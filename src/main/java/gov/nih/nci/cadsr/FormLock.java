package gov.nih.nci.cadsr;

import java.util.HashMap;
import java.util.Map;

public class FormLock {
	
	private Map<String, String> lockedForms;
	
	public FormLock(){
		setLockedForms(new HashMap<String, String>());
	}

	public Map<String, String> getLockedForms() {
		return lockedForms;
	}

	public void setLockedForms(Map<String, String> lockedForms) {
		this.lockedForms = lockedForms;
	}

}
