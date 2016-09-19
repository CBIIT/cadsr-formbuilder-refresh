package gov.nih.nci.cadsr.model;

public class Form {
	private int publicId;
	private String longName;
	private Context context;
	private Type type;
	private String prtocolName;
	private WorkFlow workflow;
	private String version;
	private Category category;

	public String getVersion() {
		return version;
	}

	public void setVersion(String version) {
		this.version = version;
	}

	public int getPublicId() {
		return publicId;
	}

	public void setPublicId(int publicId) {
		this.publicId = publicId;
	}

	public String getLongName() {
		return longName;
	}

	public void setLongName(String longName) {
		this.longName = longName;
	}

	public Context getContext() {
		return context;
	}

	public void setContext(Context context) {
		this.context = context;
	}

	public Type getType() {
		return type;
	}

	public void setType(Type type) {
		this.type = type;
	}

	public String getPrtocolName() {
		return prtocolName;
	}

	public void setPrtocolName(String prtocolName) {
		this.prtocolName = prtocolName;
	}

	public WorkFlow getWorkflow() {
		return workflow;
	}

	public void setWorkflow(WorkFlow workflow) {
		this.workflow = workflow;
	}

	public Form() {
		category = new Category();
		type = new Type();
		workflow = new WorkFlow();
		context = new Context();
	}

	public Category getCategory() {
		return category;
	}

	public void setCategory(Category category) {
		this.category = category;
	}

}
