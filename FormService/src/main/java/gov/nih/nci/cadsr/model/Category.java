package gov.nih.nci.cadsr.model;

public class Category {
	/*
	 * COMMENTS,COMMON,DEMOGRAPHIC,ELIGIBLITY,FLOWSHEET,FOLOOWUP,LAB,
	 * OFFTREATEMENT,ONSTUDY,PATHOLOGY,PRESTUDY,QUALITYOFLIFE,REGISTARTION,
	 * RESPONSE,RTSUBMISSION,TOXICITY,TRANSMITTAL,TREATEMENT
	 */

	private String name;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Category() {
		super();
	}
	

}
