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
import gov.nih.nci.cadsr.model.Customer;

@Repository
public class ExampleDaoImpl implements ExampleDao {
	
	private static final Logger logger = Logger.getLogger(ExampleDaoImpl.class);

	@Autowired
	@Qualifier("oracleDataSource")
	private DataSource oracleDataSource;
	
	@Autowired
	@Qualifier("mysqlDataSource")
	private DataSource mysqlDataSource;
	
	@Autowired
	@Qualifier("localDataSource")
	private DataSource localDataSource;
	
	@Autowired
	private JdbcTemplate jdbcTemplate;
	
//	@Autowired
//	public void setDataSource(@Qualifier("oracleDataSource")BasicDataSource dataSource) {
//		this.dataSource = dataSource;
//	}
	
	private static final String GREETING_PREFIX = "Hello ";
	
	public String retrieveGreeting(String name){
		
		return GREETING_PREFIX + name;
	}
	
	@Override
	public String pingDb(String db) {
		
		String result = "";
		Connection conn = null;
		
		try {
			if(db.equals("oracle")){
				conn = oracleDataSource.getConnection();
			}
			else if (db.equals("mysql")){
				conn = mysqlDataSource.getConnection();
			}
			else if (db.equals("local")){
				conn = ((DataSource) jdbcTemplate).getConnection();
			}
			
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
	
	@Override 
	public void insert(Customer customer){
		
		String sql = "INSERT INTO CUSTOMER " +
				"(CUST_ID, NAME, AGE) VALUES (?, ?, ?)";
		Connection conn = null;
		
		
		
		try {
			System.out.println("before");
			conn=localDataSource.getConnection();
			System.out.println("after");
			PreparedStatement ps = conn.prepareStatement(sql);
			ps.setInt(1, 1);
			ps.setString(2, "Name");
			ps.setInt(3, 2);
			ps.executeUpdate();
			ps.close();
//			dataSource.getConnection().prepareStatement(sql);
			//jdbcTemplate.update(sql);
			/*conn = jdbcTemplate.getDataSource().getConnection();
			PreparedStatement ps = conn.prepareStatement(sql);
			ps.setInt(1, customer.getCustId());
			ps.setString(2, customer.getName());
			ps.setInt(3, customer.getAge());
			ps.executeUpdate();
			ps.close();*/
			
		}
		catch(Exception e) {
			System.out.println("Error Beyyt**********************" + e.getMessage());
			e.printStackTrace();
		}
/*		catch (SQLException e) {
			throw new RuntimeException(e);
			
		}*/ finally {
			if (conn != null) {
				try {
					conn.close();
				} catch (SQLException e) {}
			}
		}
	}
	@Override 
	public Customer findByCustomerId(int custId){
		
		String sql = "SELECT * FROM CUSTOMER WHERE CUST_ID = ?";
		
		Connection conn = null;
		
		try {
			conn = ((DataSource) jdbcTemplate).getConnection();
			PreparedStatement ps = conn.prepareStatement(sql);
			ps.setInt(1, custId);
			Customer customer = null;
			ResultSet rs = ps.executeQuery();
			if (rs.next()) {
				customer = new Customer(
						rs.getInt("CUST_ID"),
						rs.getString("NAME"), 
						rs.getInt("Age")
				);
			}
			rs.close();
			ps.close();
			return customer;
			
		} catch (SQLException e) {
			throw new RuntimeException(e);
		} finally {
			if (conn != null) {
				try {
				conn.close();
				} catch (SQLException e) {}
			}
		}

			
	
	}

}
