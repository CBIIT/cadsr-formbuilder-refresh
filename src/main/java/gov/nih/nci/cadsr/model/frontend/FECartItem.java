package gov.nih.nci.cadsr.model.frontend;

public class FECartItem {
	
	private String dateAdded;
	private boolean isPersisted;
	
	
	public FECartItem(){
		dateAdded = "";
		isPersisted = false;
	}
	
	public String getDateAdded() {
		return dateAdded;
	}
	public void setDateAdded(String dateAdded) {
		this.dateAdded = dateAdded;
	}
	public boolean getIsPersisted() {
		return isPersisted;
	}
	public void setPersisted(boolean isPersisted) {
		this.isPersisted = isPersisted;
	}

}
