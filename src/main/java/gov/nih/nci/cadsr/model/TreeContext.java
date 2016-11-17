package gov.nih.nci.cadsr.model;

import java.util.List;

public class TreeContext {
	private String name;
	private String description;
	private String conteIdseq;
	private List<TreeClassification> treeClassification;

	public TreeContext(String name, String description, String conteIdseq,
			List<TreeClassification> treeClassification) {
		super();
		this.name = name;
		this.description = description;
		this.conteIdseq = conteIdseq;
		this.treeClassification = treeClassification;
	}

	public TreeContext() {
	}

	public TreeContext(String name2, String description2, String conteIdseq2) {
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getConteIdseq() {
		return conteIdseq;
	}

	public void setConteIdseq(String conteIdseq) {
		this.conteIdseq = conteIdseq;
	}

	public List<TreeClassification> getTreeClassification() {
		return treeClassification;
	}

	public void setTreeClassification(List<TreeClassification> treeClassification) {
		this.treeClassification = treeClassification;
	}

}
