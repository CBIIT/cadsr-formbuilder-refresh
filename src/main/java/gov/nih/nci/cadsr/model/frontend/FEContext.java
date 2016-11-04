package gov.nih.nci.cadsr.model.frontend;

import java.io.Serializable;

public class FEContext implements FEBaseObject,Serializable{
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1234561L;
	private String conteIdseq;
	private String name;
	private String description;
	
	public FEContext(){
		this.conteIdseq = "";
		this.name = "";
		this.description = "";
	}
	
	public FEContext(String conteIdseq, String name, String description){
		this.conteIdseq = conteIdseq;
		this.name = name;
		this.description = description;
	}
	
	public String getConteIdseq() {
		return conteIdseq;
	}
	public void setConteIdseq(String conteIdseq) {
		this.conteIdseq = conteIdseq;
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

	@Override
	public boolean equals(Object obj){
		if (obj == null){
			return false;
		}
		if(!FEContext.class.isAssignableFrom(obj.getClass())){
			return false;
		}
		final FEContext other = (FEContext) obj;
		
		if(this.getConteIdseq().equals(other.getConteIdseq())){
			return true;
		}
		
		return false;
	}
	
}
