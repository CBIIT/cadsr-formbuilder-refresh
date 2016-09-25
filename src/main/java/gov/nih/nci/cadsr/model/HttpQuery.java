package gov.nih.nci.cadsr.model;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlType;

@XmlRootElement(namespace="http://www.w3.org/1999/xlink")
public class HttpQuery {
	
	private QueryResponse queryResponse;

	public QueryResponse getQueryResponse() {
		return queryResponse;
	}

	@XmlElement(name="queryResponse")
	public void setQueryResponse(QueryResponse queryResponse) {
		this.queryResponse = queryResponse;
	}
	
	
	

}
