package gov.nih.nci.cadsr.manager.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import gov.nih.nci.cadsr.dao.ClassificationTrDao;
import gov.nih.nci.cadsr.manager.ClassificationManager;
import gov.nih.nci.ncicb.cadsr.common.dto.bc4j.BC4JClassificationsTransferObject;
import gov.nih.nci.ncicb.cadsr.common.resource.ClassSchemeItem;

@Service
public class ClassificationManagerImpl implements ClassificationManager{
	@Autowired
	private ClassificationTrDao classificationTrDao;

	@Override
	public List<ClassSchemeItem> getClassification(String csLongName, String csName,Boolean checked) {
		
		return classificationTrDao.getClassification(csLongName,csName,checked);
	}

}
