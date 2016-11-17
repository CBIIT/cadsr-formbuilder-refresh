package gov.nih.nci.cadsr.dao.impl;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Iterator;
import java.util.List;

import org.springframework.jdbc.object.MappingSqlQuery;
import org.springframework.stereotype.Repository;

import gov.nih.nci.cadsr.dao.ProtocolTrDao;
import gov.nih.nci.ncicb.cadsr.common.dto.ContextTransferObject;
import gov.nih.nci.ncicb.cadsr.common.dto.ProtocolTransferObject;
import gov.nih.nci.ncicb.cadsr.common.persistence.dao.jdbc.JDBCBaseDAOFB;

import gov.nih.nci.ncicb.cadsr.common.resource.Context;
import gov.nih.nci.ncicb.cadsr.common.util.StringUtils;;

@Repository
public class ProtocolTrDaoImpl extends JDBCBaseDAOFB implements ProtocolTrDao {

	public List<ProtocolTransferObject> getProtocol(String KeyWord) {
		ProtocolQueryNew query = new ProtocolQueryNew();
		query.setDataSource(getDataSource());

		query.setSql(KeyWord);

		List<ProtocolTransferObject> protocols = query.execute();
		return protocols;

	}

	class ProtocolQueryNew extends MappingSqlQuery {

		ProtocolQueryNew() {
			super();
		}

		public void setSql(String KeyWord) {

			String where = " WHERE p.conte_idseq = c.conte_idseq ";
			if (KeyWord != null) {
				String lName = KeyWord.trim();
				if (lName.length() > 0) {

					String temp = StringUtils.strReplace(KeyWord, "*", "%");
					temp = StringUtils.strReplace(temp, "'", "''");

					where += (where.equals("")) ? " WHERE " : " AND ";
					where += "(UPPER(LONG_NAME) like UPPER('%" + temp + "%')or UPPER(preferred_name) like UPPER('%" + temp + "%')) ";
				}
			}

			String sql = "SELECT distinct p.proto_idseq idseq,p.preferred_name pn, p.preferred_definition pd, p.LONG_NAME pln, "
					+ "p.PROTO_ID publicId,p.conte_idseq contextId,c.name contextname "
					+ " from protocols_view_ext p,sbr.contexts_view c"
					+ where;

			// System.out.println("Executing searchProtocol query: " + sql);
			super.setSql(sql);

		}

		@Override
		protected Object mapRow(ResultSet rs, int rowNum) throws SQLException {

			ProtocolTransferObject protocol = new ProtocolTransferObject();
			
            protocol.setProtoIdseq(rs.getString("idseq"));
			protocol.setPreferredName(rs.getString("pn"));
			protocol.setLongName(rs.getString("pln"));
			protocol.setPreferredDefinition(rs.getString("pd"));

			protocol.setPublicId(rs.getInt("publicId"));
			String contextName = rs.getString("contextname");

			Context context = new ContextTransferObject();
			context.setConteIdseq(rs.getString("contextId"));
			context.setName(contextName);
			protocol.setContext(context);

			return protocol;
		}

	}

}
