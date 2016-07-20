package gov.nih.nci.cadsr.manager.impl;

import java.sql.SQLException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import gov.nih.nci.cadsr.dao.FormDao;
import gov.nih.nci.cadsr.manager.FormManager;
import gov.nih.nci.cadsr.model.Form;

@Service
public class FormManagerImpl implements FormManager {

	@Autowired
	private FormDao formDao;

	@Override
	public List<Form> searchForm(String formLongName, String protocolIdSeq, String workflow, String category,
			String type, String classificationIdSeq, String publicId, String version) throws SQLException {
		return formDao.searchForm(formLongName, protocolIdSeq, workflow, category, type, classificationIdSeq,
				publicId, version);

	}
}
