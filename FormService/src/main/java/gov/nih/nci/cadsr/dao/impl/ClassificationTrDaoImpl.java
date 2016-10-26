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
	public List<ClassSchemeItem> getClassification(String keyword) {

		ClassificationQueryNew query = new ClassificationQueryNew();
		query.setDataSource(getDataSource());

		query.setSql(keyword);

		List<ClassSchemeItem> classifications = query.execute();
		return classifications;
	}
	

	class ClassificationQueryNew extends MappingSqlQuery {
		ClassificationQueryNew() {
			super();
		}

		public void setSql(String keyword) {

			String where = "accsi.cs_csi_idseq = cscsi.cs_csi_idseq " + " AND cscsi.csi_idseq = csi.csi_idseq "
					+ " AND cscsi.cs_idseq = cs.cs_idseq";
			if (keyword != null) {
				String cName = keyword.trim();
				if (cName.length() > 0) {
					
					String temp = StringUtils.strReplace(cName, "*", "%");
					temp = StringUtils.strReplace(temp, "'", "''");
					
					where += (where.equals("")) ?" ":" AND ";
					where += "(cs.LONG_NAME like '%"+temp+"%'or csi.LONG_NAME like '%"+temp+"%') ";
				}
			}

			/*if (csName != null) {
				String Name = csName.trim();
				if (Name.length() > 0) {
					
					String temp = StringUtils.strReplace(Name, "*", "%");
					temp = StringUtils.strReplace(temp, "'", "''");
					
					where += (where.equals("")) ? " WHERE " : " or ";
					where += "csi.LONG_NAME like '%"+temp+"%'";
				}
			}*/

			String sql = "select cscsi.cs_csi_idseq cscsiID, csi.csi_idseq csid,cs.preferred_definition csDefination,cs.version csVersion,cs.cs_id csPublicId, csi.csi_id csiPublicId,csi.LONG_NAME csiName,"
					+ " cs.LONG_NAME csLongName FROM sbr.ac_csi_view accsi, sbr.cs_csi_view cscsi, "
					+ "sbr.cs_items_view csi, sbr.classification_schemes_view cs where " + where;
			super.setSql(sql);
			

		}

		@Override
		protected Object mapRow(ResultSet rs, int rowNum) throws SQLException {
			CSITransferObject csiTO = new CSITransferObject();
			csiTO.setCsiIdseq(rs.getString("csid"));
			csiTO.setCsCsiIdseq(rs.getString("cscsiID"));
			csiTO.setClassSchemeLongName(rs.getString("csLongName"));
			csiTO.setClassSchemeItemName(rs.getString("csiName"));
			csiTO.setCsVersion(rs.getFloat("csVersion"));
			csiTO.setCsID(rs.getString("csPublicId"));
			csiTO.setClassSchemeDefinition(rs.getString("csDefination"));
			csiTO.setCsiId(rs.getInt("csiPublicId"));
			//csiTO.setCsContext(csContext);
			

			return csiTO;

		}

	}
	


}
