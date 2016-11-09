package gov.nih.nci.cadsr.model;

public class TreeClassification {
	private String csIdseq;
	private String preferredName;

	public TreeClassification(String csIdseq, String preferredName) {
		super();
		this.csIdseq = csIdseq;
		this.preferredName = preferredName;
	}

	public String getCsIdseq() {
		return csIdseq;
	}

	public void setCsIdseq(String csIdseq) {
		this.csIdseq = csIdseq;
	}

	public String getPreferredName() {
		return preferredName;
	}

	public void setPreferredName(String preferredName) {
		this.preferredName = preferredName;
	}

}
