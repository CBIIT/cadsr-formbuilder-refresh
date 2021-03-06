package gov.nih.nci.ncicb.cadsr.common.persistence.dao.jdbc;

import gov.nih.nci.ncicb.cadsr.common.dto.ContextTransferObject;
import gov.nih.nci.ncicb.cadsr.common.dto.NCIUserTransferObject;
import gov.nih.nci.ncicb.cadsr.common.persistence.dao.UserManagerDAO;
import gov.nih.nci.ncicb.cadsr.common.resource.Context;
import gov.nih.nci.ncicb.cadsr.common.resource.NCIUser;
import gov.nih.nci.ncicb.cadsr.common.util.StringUtils;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;


import org.apache.commons.dbcp.BasicDataSource;
import org.apache.commons.dbcp.BasicDataSourceFactory;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.core.RowCallbackHandler;
import org.springframework.jdbc.core.SqlOutParameter;
import org.springframework.jdbc.core.SqlParameter;
import org.springframework.jdbc.object.MappingSqlQuery;
import org.springframework.jdbc.object.StoredProcedure;
import org.springframework.stereotype.Component;

@Component("userManagerDAO")
public class JDBCUserManagerDAOFB extends JDBCBaseDAOFB implements UserManagerDAO
{
	
	@Autowired
	@Qualifier("authDataSource")
	BasicDataSource authDataSource;

	protected Log log =  LogFactory.getLog(JDBCUserManagerDAOFB.class.getName());

	public JDBCUserManagerDAOFB() {
		super();
	}

	public boolean userInGroup(
			String username,
			String groupName) {
		UserGroupQuery query = new UserGroupQuery(getDataSource());
		String[] params = new String[2];
		params[0] = username;
		params[1] = groupName;

		Integer result = (Integer) query.findObject(params);

		if (result.intValue() < 1) {
			return false;
		}
		else {
			return true;
		}
	}
	/**
	 * The retun map has key value as action:map
	 * Each value itself is map with key value formtype:Map
	 * Each e value it
	 * @return 
	 */
	public Map getPermissionsByAction()
	{
		return null;
	}  

	public boolean validUser(
			String userName,
			String password) {
		boolean validUser = false;
		Connection conn = null;
		try {
			authDataSource.setUsername(userName);
			authDataSource.setPassword(password);
			conn = authDataSource.getConnection();

			// The Query below is to make sure connection db is established
			// In some case it was noticed that just making the connection did
			// not make a call to the db

			conn.getMetaData();
			UserEnabledQuery enabledQuery = new UserEnabledQuery((getDataSource()));
			//Check if the user account is enabled
			validUser = ((Boolean)enabledQuery.findObject(userName)).booleanValue();
		}
		catch (Exception e) {
			e.printStackTrace();
			validUser = false;
		}
		finally
		{
			try{
				if(conn!=null)
					conn.close();
				
				authDataSource.close();
				authDataSource.removeConnectionProperty("username");
				authDataSource.removeConnectionProperty("password");
			}
			catch(Exception exp)
			{
				exp.printStackTrace();
				validUser = false;
			}
		}
		return validUser;
	}

	public NCIUser getNCIUser(String username) {
		UserQuery userQuery = new UserQuery(getDataSource());
		NCIUser user = (NCIUser) userQuery.findObject(username);
		if(user!=null)
			user.setContextsByRole(this.getContextsForAllRoles(user.getUsername(),"QUEST_CONTENT"));
		return user;
	}

	public Map getContextsForAllRoles(
			String username,
			String acType) {
		Map out = new HashMap();
		ContextsQuery qry = new ContextsQuery(this.getDataSource());
		out = qry.getContexts(username, acType);

		return out;
	}

	// inner class
	class UserGroupQuery extends MappingSqlQuery {
		UserGroupQuery(BasicDataSource ds) {
			super(
					ds,
					"SELECT COUNT(*) from USER_BR_VIEW_EXT where UA_NAME=UPPER(?) AND BRL_NAME=UPPER(?)");
			declareParameter(new SqlParameter("UA_NAME", Types.VARCHAR));
			declareParameter(new SqlParameter("BRL_NAME", Types.VARCHAR));
			compile();
		}

		protected Object mapRow(
				ResultSet rs,
				int rownum) throws SQLException {
			return new Integer(rs.getInt(1));
		}
	}

	// inner class end    
	// inner class
	class UserQuery extends MappingSqlQuery {
		UserQuery(BasicDataSource ds) {
			super(ds, "SELECT *  from USER_ACCOUNTS_VIEW where UA_NAME=UPPER(?)");
			declareParameter(new SqlParameter("UA_NAME", Types.VARCHAR));
			compile();
		}

		protected Object mapRow(
				ResultSet rs,
				int rownum) throws SQLException {
			NCIUserTransferObject user =
					new NCIUserTransferObject(rs.getString("UA_NAME"));

			//added for GF1224 - lock the form
			user.setEmailAddress(rs.getString("electronic_mail_address"));
			user.setPhoneNumber(rs.getString("PHONE_NUMBER"));
			return user;
		}
	}
	//Check if the user is enable
	class UserEnabledQuery extends MappingSqlQuery {
		UserEnabledQuery(BasicDataSource ds) {
			super(ds, "SELECT ENABLED_IND  from USER_ACCOUNTS_VIEW where UA_NAME like UPPER(?)");
			declareParameter(new SqlParameter("UA_NAME", Types.VARCHAR));
			compile();
		}

		protected Object mapRow(
				ResultSet rs,
				int rownum) throws SQLException {

			return new Boolean(StringUtils.toBoolean((String)rs.getString(1)));
		}
	}  

	// inner class end    
	private class ContextsQuery extends StoredProcedure {
		Map out = new HashMap();
		List results = new ArrayList();

		public ContextsQuery(BasicDataSource ds) {
			super(ds, "cadsr_security_util.get_contexts_list");
			declareParameter(new SqlParameter("p_ua_name", Types.VARCHAR));
			declareParameter(new SqlParameter("p_actl_name", Types.VARCHAR));
			declareParameter(
					new SqlOutParameter(
							"p_contexts", oracle.jdbc.OracleTypes.CURSOR,
							new RowCallbackHandlerImpl()));
			compile();
		}

		public Map getContexts(
				String username,
				String acType) {
			Map in = new HashMap();
			in.put("p_ua_name", username);
			in.put("p_actl_name", acType);
			execute(in);

			Iterator it = results.iterator();
			Map mp = new HashMap();
			String roleName;
			Context conte;

			while (it.hasNext()) {
				mp = (Map) it.next();
				roleName = (String) mp.get("BusinessRole");
				conte = new ContextTransferObject();
				conte.setConteIdseq((String) mp.get("ConteIdseq"));
				conte.setName((String) mp.get("ConteName"));
				if (out.containsKey(roleName)) {
					List availList = (List) out.get(roleName);
					//availList.add((String) mp.get("ConteIdseq"));
					availList.add(conte);
				}
				else {
					List contextsList = new ArrayList();
					//contextsList.add((String) mp.get("ConteIdseq"));
					contextsList.add(conte);
					out.put(roleName, contextsList);
				}
			}

			return out;
		}

		private class RowCallbackHandlerImpl implements RowCallbackHandler {
			public void processRow(ResultSet rs) throws SQLException {
				Map row = new HashMap();
				row.put("ConteIdseq", (String) rs.getString(1));
				row.put("ConteName", (String) rs.getString(2));
				row.put("BusinessRole", (String) rs.getString(3));
				results.add(row);
			}
		}
	}
}
