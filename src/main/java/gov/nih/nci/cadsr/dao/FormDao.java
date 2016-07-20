package gov.nih.nci.cadsr.dao;

import java.sql.SQLException;
import java.util.List;

import gov.nih.nci.cadsr.model.Form;

public interface FormDao {
	public List<Form> searchForm(String formLongName, String protocolIdSeq, String workflow, String category, String type,
			String classificationIdSeq, String publicId, String version) throws SQLException;

}
