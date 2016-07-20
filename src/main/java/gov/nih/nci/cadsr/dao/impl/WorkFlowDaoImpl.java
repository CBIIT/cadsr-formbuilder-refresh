package gov.nih.nci.cadsr.dao.impl;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.stereotype.Repository;

import gov.nih.nci.cadsr.dao.WorkFlowDao;
import gov.nih.nci.cadsr.model.WorkFlow;

@Repository
public class WorkFlowDaoImpl implements WorkFlowDao {
	@Autowired
	private JdbcTemplate jdbcTemplate;

	public JdbcTemplate getJdbcTemplate() {
		return jdbcTemplate;
	}

	public void setJdbcTemplate(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}

	@Override
	public List<WorkFlow> getAllWorkFlow() {
		String sql = "SELECT * FROM WORKFLOW";

		return jdbcTemplate.query(sql, new ResultSetExtractor<List<WorkFlow>>() {

			@Override
			public List<WorkFlow> extractData(ResultSet rs) throws SQLException, DataAccessException {
				List<WorkFlow> workFlowList = new ArrayList<WorkFlow>();
				while (rs.next()) {
					WorkFlow workFlow = new WorkFlow();
					workFlow.setName(rs.getString("NAME"));

					workFlowList.add(workFlow);
				}
				return workFlowList;
			}

		});

	}
}
