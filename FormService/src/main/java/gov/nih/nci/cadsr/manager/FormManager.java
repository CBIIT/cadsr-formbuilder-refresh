package gov.nih.nci.cadsr.manager;

import java.sql.SQLException;
import java.util.List;

import gov.nih.nci.cadsr.domain.Form;

public interface FormManager {

	public List<Form> searchForm(String formLongName, String protocolIdSeq, String workflow, String category,
			String type, String classificationIdSeq, String publicId, String version) throws SQLException;

}
