package gov.nih.nci.ncicb.cadsr.common.persistence.dao.jdbc;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Collection;

import org.springframework.jdbc.object.MappingSqlQuery;
import org.springframework.stereotype.Component;

import gov.nih.nci.ncicb.cadsr.common.persistence.dao.WorkFlowStatusDAO;

@Component("workFlowStatusDAO")
public class JDBCWorkFlowStatusDAOFB extends JDBCBaseDAOFB implements WorkFlowStatusDAO
{
	public JDBCWorkFlowStatusDAOFB() {
		super();
	}

	/**
	 * Gets the workflow statuses for a particular admin component type. This
	 * info is maintained in Table: ASL_ACTL_VIEW_EXT Columns: ASL_NAME, ACTL_NAME
	 *
	 * @param <b>adminComponentType</b> Indicates the admin component type
	 */
	public Collection getWorkFlowStatusesForACType(String adminComponentType) {
		Collection col = new ArrayList();
		WorkflowQuery query = new WorkflowQuery();
		query.setDataSource(getDataSource());
		query.setSql(adminComponentType, "");
		// returns all rows
		return query.execute();
	}

	public static void main(String[] args) {

		JDBCWorkFlowStatusDAOFB test = new JDBCWorkFlowStatusDAOFB();

		Collection coll = test.getWorkFlowStatusesForACType("QUEST_CONTENT");
		System.out.println(coll);
		/*
    for (Iterator it = coll.iterator(); it.hasNext();) {
      Object anObject = it.next();
      //System.out.println( "workflow status display = " + anObject ); 
    }
		 */
	}

	/**
	 * Inner class that accesses database to get the workflow statuses for a
	 * particular admin component type.
	 */
	class WorkflowQuery extends MappingSqlQuery {
		WorkflowQuery() {
			super();
		}

		public void setSql(
				String adminComponentType,
				String dummy) {
			String sqlStmt =
					"select ASL_NAME from ASL_ACTL_VIEW_EXT " + " where ACTL_NAME = '" +
							adminComponentType + "' " + "   and ASL_NAME != 'RETIRED DELETED' ";
			super.setSql(sqlStmt);
		}

		protected Object mapRow(
				ResultSet rs,
				int rownum) throws SQLException {
			// handles only one row
			return rs.getString("ASL_NAME");
		}
	}
}
