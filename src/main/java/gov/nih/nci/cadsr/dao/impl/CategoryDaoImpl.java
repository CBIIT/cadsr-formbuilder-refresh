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

import gov.nih.nci.cadsr.dao.CategoryDao;
import gov.nih.nci.cadsr.model.Category;

@Repository
public class CategoryDaoImpl implements CategoryDao {
	@Autowired
	private JdbcTemplate jdbcTemplate;

	public JdbcTemplate getJdbcTemplate() {
		return jdbcTemplate;
	}

	public void setJdbcTemplate(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}

	@Override
	public List<Category> getAllCategory() {

		String sql = "SELECT * FROM CATEGORY";

		return jdbcTemplate.query(sql, new ResultSetExtractor<List<Category>>() {

			@Override
			public List<Category> extractData(ResultSet rs) throws SQLException, DataAccessException {
				List<Category> categoryList = new ArrayList<Category>();
				while (rs.next()) {
					Category category = new Category();
					category.setName(rs.getString("NAME"));

					categoryList.add(category);
				}
				return categoryList;
			}

		});

	}

}
