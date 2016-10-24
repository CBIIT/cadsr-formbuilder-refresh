package gov.nih.nci.ncicb.cadsr.formbuilder.struts.common;

public class FormCartDisplayObjectPersisted extends FormCartDisplayObject{
	protected boolean isPersisted;
	
	public FormCartDisplayObjectPersisted(FormCartDisplayObject displayObject, boolean inDB)
	{
		super(displayObject);
		isPersisted = inDB;
	}
	
	public boolean getIsPersisted() {
		return isPersisted;
	}

	public void setIsPersisted(boolean isPersisted) {
		this.isPersisted = isPersisted;
	}
}
