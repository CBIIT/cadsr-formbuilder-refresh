package gov.nih.nci.cadsr.dao.impl;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

import org.springframework.jdbc.object.MappingSqlQuery;
import org.springframework.stereotype.Repository;

import gov.nih.nci.cadsr.dao.ClassificationTrDao;
import gov.nih.nci.cadsr.dao.impl.ProtocolTrDaoImpl.ProtocolQueryNew;
import gov.nih.nci.ncicb.cadsr.common.dto.CSITransferObject;
import gov.nih.nci.ncicb.cadsr.common.dto.ProtocolTransferObject;
import gov.nih.nci.ncicb.cadsr.common.dto.bc4j.BC4JClassificationsTransferObject;
import gov.nih.nci.ncicb.cadsr.common.persistence.dao.jdbc.JDBCBaseDAOFB;
import gov.nih.nci.ncicb.cadsr.common.resource.ClassSchemeItem;
import gov.nih.nci.ncicb.cadsr.common.util.StringUtils;

@Repository
public class ClassificationTrDaoImpl extends JDBCBaseDAOFB implements ClassificationTrDao {

	@Override
	public List<ClassSchemeItem> getClassification(String csLongName, String csName, Boolean checked) {

		ClassificationQueryNew query = new ClassificationQueryNew();
		query.setDataSource(getDataSource());

		query.setSql(csLongName, csName, checked);

		List<ClassSchemeItem> classifications = query.execute();
		return classifications;
	}

	class ClassificationQueryNew extends MappingSqlQuery {
		ClassificationQueryNew() {
			super();
		}

		public void setSql(String csLongName, String csName, Boolean checked) {

			String where = "accsi.cs_csi_idseq = cscsi.cs_csi_idseq " + " AND cscsi.csi_idseq = csi.csi_idseq "
					+ " AND cscsi.cs_idseq = cs.cs_idseq";
			if (csLongName != null) {
				String cName = csLongName.trim();
				if (cName.length() > 0) {
					
					String temp = StringUtils.strReplace(cName, "*", "%");
					temp = StringUtils.strReplace(temp, "'", "''");
					
					where += (where.equals("")) ? " WHERE " : " AND ";
					where += "cs.LONG_NAME like '%" + temp + "%'";
				}
			}

			if (csName != null) {
				String Name = csName.trim();
				if (Name.length() > 0) {
					
					String temp = StringUtils.strReplace(Name, "*", "%");
					temp = StringUtils.strReplace(temp, "'", "''");
					
					where += (where.equals("")) ? " WHERE " : " AND ";
					where += "csi.LONG_NAME like '%" + temp + "%'";
				}
			}

			String sql = "select csi.LONG_NAME ln, cs.LONG_NAME csn FROM sbr.ac_csi_view accsi, sbr.cs_csi_view cscsi, "
					+ "sbr.cs_items_view csi, sbr.classification_schemes_view cs where " + where;
			super.setSql(sql);

		}

		@Override
		protected Object mapRow(ResultSet rs, int rowNum) throws SQLException {
			ClassSchemeItem csiTO = new CSITransferObject();

			csiTO.setClassSchemeLongName(rs.getString("csn"));

			csiTO.setClassSchemeItemName(rs.getString("ln"));

			return csiTO;

		}
	}

}
