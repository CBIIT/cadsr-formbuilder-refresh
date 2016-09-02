package gov.nih.nci.cadsr.manager;

import java.util.List;

import gov.nih.nci.ncicb.cadsr.common.dto.bc4j.BC4JClassificationsTransferObject;
import gov.nih.nci.ncicb.cadsr.common.resource.ClassSchemeItem;

public interface ClassificationManager {

	public List<ClassSchemeItem> getClassification(String csLongName, String csName,Boolean checked);

}
