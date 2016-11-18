package gov.nih.nci.cadsr.dao.impl;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import javax.sql.DataSource;

import org.apache.commons.dbcp.BasicDataSource;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import gov.nih.nci.cadsr.dao.ExampleDao;

@Repository
public class ExampleDaoImpl implements ExampleDao {
	
	private static final Logger logger = Logger.getLogger(ExampleDaoImpl.class);

	@Autowired
	@Qualifier("dataSource")
	private DataSource oracleDataSource;
	
/*	@Autowired
	@Qualifier("mysqlDataSource")
	private DataSource mysqlDataSource;
	
	@Autowired
	@Qualifier("localDataSource")
	private DataSource localDataSource;
	
	@Autowired
	private JdbcTemplate jdbcTemplate;*/
	
	
	private static final String GREETING_PREFIX = "Hello ";
	
	public String retrieveGreeting(String name){
		
		return GREETING_PREFIX + name;
	}
	
	public String pingDb(String db) {
		
		String result = "";
		Connection conn = null;
		
		try {
			if(db.equals("oracle")){
				conn = oracleDataSource.getConnection();
			}
			/*else if (db.equals("mysql")){
				conn = mysqlDataSource.getConnection();
			}
			else if (db.equals("local")){
				conn = ((DataSource) jdbcTemplate).getConnection();
			}*/
			
			if(conn != null){
				result = "Success";
			}
			else{
				result =  "Failure";
			}
			
		} catch (SQLException e) {
			logger.error(e.getMessage());
			
			result = e.getMessage();
		}
		finally{
			
			return result;
		}
		
	}
	
}
