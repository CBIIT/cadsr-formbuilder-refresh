package gov.nih.nci.cadsr.model;

public class BBValidValue {

	// private String vdIdSeq;
	private String vpIdseq;
	private String valueIdseq;
	// private String shortMeaning;
	// private String shortMeaningDescription;
	// private String shortMeaningValue;
	// private String description;
	// private Integer vmId;
	private Float vmVersion;
	// private String beginDate;
	// private String endDate;
	// private String context;
	// private String workflowstatus;
	// private String instructions;
	// ConceptDerivationRule?
	// ValueMeaning?
	
	private boolean isEdited = true;
	private boolean isDeleted = false;

	private String longName;
	private String formValueMeaningText;
	private String formValueMeaningIdVersion;
	private String formValueMeaningDesc;

	// public String getVdIdSeq() {
	// return vdIdSeq;
	// }
	// public void setVdIdSeq(String vdIdSeq) {
	// this.vdIdSeq = vdIdSeq;
	// }
	public String getVpIdseq() {
		return vpIdseq;
	}

	public void setVpIdseq(String vpIdseq) {
		this.vpIdseq = vpIdseq;
	}

	public String getValueIdseq() {
		return valueIdseq;
	}

	public void setValueIdseq(String valueIdseq) {
		this.valueIdseq = valueIdseq;
	}

	// public String getShortMeaning() {
	// return shortMeaning;
	// }
	// public void setShortMeaning(String shortMeaning) {
	// this.shortMeaning = shortMeaning;
	// }
	// public String getShortMeaningDescription() {
	// return shortMeaningDescription;
	// }
	// public void setShortMeaningDescription(String shortMeaningDescription) {
	// this.shortMeaningDescription = shortMeaningDescription;
	// }
	// public String getShortMeaningValue() {
	// return shortMeaningValue;
	// }
	// public void setShortMeaningValue(String shortMeaningValue) {
	// this.shortMeaningValue = shortMeaningValue;
	// }
	// public String getDescription() {
	// return description;
	// }
	// public void setDescription(String description) {
	// this.description = description;
	// }
	// public Integer getVmId() {
	// return vmId;
	// }
	// public void setVmId(Integer vmId) {
	// this.vmId = vmId;
	// }
	public Float getVmVersion() {
		return vmVersion;
	}

	public void setVmVersion(Float vmVersion) {
		this.vmVersion = vmVersion;
	}

	// public String getBeginDate() {
	// return beginDate;
	// }
	// public void setBeginDate(String beginDate) {
	// this.beginDate = beginDate;
	// }
	// public String getEndDate() {
	// return endDate;
	// }
	// public void setEndDate(String endDate) {
	// this.endDate = endDate;
	// }
	// public String getContext() {
	// return context;
	// }
	// public void setContext(String context) {
	// this.context = context;
	// }
	// public String getWorkflowstatus() {
	// return workflowstatus;
	// }
	// public void setWorkflowstatus(String workflowstatus) {
	// this.workflowstatus = workflowstatus;
	// }
	// public String getInstructions() {
	// return instructions;
	// }
	// public void setInstructions(String instructions) {
	// this.instructions = instructions;
	// }
	public String getLongName() {
		return longName;
	}

	public void setLongName(String longName) {
		this.longName = longName;
	}

	public String getFormValueMeaningText() {
		return formValueMeaningText;
	}

	public void setFormValueMeaningText(String formValueMeaningText) {
		this.formValueMeaningText = formValueMeaningText;
	}

	public String getFormValueMeaningIdVersion() {
		return formValueMeaningIdVersion;
	}

	public void setFormValueMeaningIdVersion(String formValueMeaningIdVersion) {
		this.formValueMeaningIdVersion = formValueMeaningIdVersion;
	}

	public String getFormValueMeaningDesc() {
		return formValueMeaningDesc;
	}

	public void setFormValueMeaningDesc(String formValueMeaningDesc) {
		this.formValueMeaningDesc = formValueMeaningDesc;
	}

	public boolean isEdited() {
		return isEdited;
	}

	public void setEdited(boolean isEdited) {
		this.isEdited = isEdited;
	}

	public boolean isDeleted() {
		return isDeleted;
	}

	public void setDeleted(boolean isDeleted) {
		this.isDeleted = isDeleted;
	}

}
