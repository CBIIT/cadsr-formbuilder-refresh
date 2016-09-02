package gov.nih.nci.cadsr.dao.impl;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Iterator;
import java.util.List;

import org.springframework.jdbc.object.MappingSqlQuery;
import org.springframework.stereotype.Repository;

import gov.nih.nci.cadsr.dao.ProtocolTrDao;
import gov.nih.nci.ncicb.cadsr.common.dto.ProtocolTransferObject;
import gov.nih.nci.ncicb.cadsr.common.persistence.dao.jdbc.JDBCBaseDAOFB;;

@Repository
public class ProtocolTrDaoImpl extends JDBCBaseDAOFB implements ProtocolTrDao {

	public List<ProtocolTransferObject> getProtocol(String longName, String PreferedName, Boolean checked) {
		ProtocolQueryNew query = new ProtocolQueryNew();
		query.setDataSource(getDataSource());

		query.setSql(longName, PreferedName, checked);

		List<ProtocolTransferObject> protocols = query.execute();
		return protocols;

	}

	class ProtocolQueryNew extends MappingSqlQuery {

		ProtocolQueryNew() {
			super();
		}

		public void setSql(String longName, String preferedName, boolean checked) {

			String where = "";
			if (longName != null) {
				String lName = longName.trim();
				if (lName.length() > 0) {
					where += (where.equals("")) ? " WHERE " : " AND ";
					if (checked) {
						where += "LONG_NAME = '" + lName + "'";
					} else {
						where += "LONG_NAME like '%" + lName + "%'";
					}
				}
			}

			if (preferedName != null) {
				String pName = preferedName.trim();
				if (pName.length() > 0) {
					where += (where.equals("")) ? " WHERE " : " AND ";
					if (checked) {
						where += "preferred_name = '" + pName + "'";
					} else {
						where += "preferred_name like '%" + pName + "%'";
					}
				}
			}
			String sql = "SELECT preferred_name pn, preferred_definition pd, LONG_NAME pln from protocols_view_ext"
					+ where;

			super.setSql(sql);

		}

		@Override
		protected Object mapRow(ResultSet rs, int rowNum) throws SQLException {

			ProtocolTransferObject protocol = new ProtocolTransferObject();

			protocol.setPreferredName(rs.getString("pn"));
			protocol.setLongName(rs.getString("pln"));
			protocol.setPreferredDefinition(rs.getString("pd"));

			return protocol;
		}

	}

}
