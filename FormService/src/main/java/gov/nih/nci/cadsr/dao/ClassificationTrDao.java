package gov.nih.nci.cadsr.dao;

import java.util.List;

import gov.nih.nci.ncicb.cadsr.common.resource.ClassSchemeItem;

public interface ClassificationTrDao {

	//public List<ClassSchemeItem> getClassification(String csLongName, String csName, Boolean checked);


	public List<ClassSchemeItem> getClassification(String keyword);

}
