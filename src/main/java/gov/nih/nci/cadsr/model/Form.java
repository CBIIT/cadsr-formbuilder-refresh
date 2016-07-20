package gov.nih.nci.cadsr.model;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "form_tbl")
public class Form implements Serializable{

	private static final long serialVersionUID = 5720004843807447638L;
	
	private long id;
	private String longName;
	private String context;
	private String type;
	private String protocol;
	private String workflow;
	private String publicId;
	private double version;
	
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	public long getId() {
		return id;
	}
	public void setId(long id) {
		this.id = id;
	}
	
	@Column(name = "long_name")
	public String getLongName() {
		return longName;
	}
	public void setLongName(String longName) {
		this.longName = longName;
	}
	
	@Column(name = "context")
	public String getContext() {
		return context;
	}
	public void setContext(String context) {
		this.context = context;
	}
	
	@Column(name = "type")
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	
	@Column(name = "protocol")
	public String getProtocol() {
		return protocol;
	}
	public void setProtocol(String protocol) {
		this.protocol = protocol;
	}
	
	@Column(name = "workflow")
	public String getWorkflow() {
		return workflow;
	}
	public void setWorkflow(String workflow) {
		this.workflow = workflow;
	}
	
	@Column(name = "public_id")
	public String getPublicId() {
		return publicId;
	}
	public void setPublicId(String publicId) {
		this.publicId = publicId;
	}
	
	@Column(name = "version")
	public double getVersion() {
		return version;
	}
	public void setVersion(double version) {
		this.version = version;
	}

}
