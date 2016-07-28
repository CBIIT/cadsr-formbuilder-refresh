/*package gov.nih.nci.cadsr.dao.impl;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.stereotype.Repository;
import gov.nih.nci.cadsr.dao.FormDao;
import gov.nih.nci.cadsr.model.Form;

@Repository
public class FormDaoImpl implements FormDao {

	@Autowired
	private JdbcTemplate jdbcTemplate;

	public JdbcTemplate getJdbcTemplate() {
		return jdbcTemplate;
	}

	public void setJdbcTemplate(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}

	@Override
	public List<Form> searchForm(String formLongName, String protocolIdSeq, String workflow, String category,
			String type, String classificationIdSeq, String publicId, String version)throws SQLException {
		String where = "f.category_Id=cat.Id and f.context_Id=c.Id and f.type_Id= t.Id and f.workflow_Id=w.Id";

		
		 * ObjectMapper mapper = new ObjectMapper(); Form user = new Form();
		 * 
		 * //Object to JSON in file try { mapper.writeValue(new
		 * File("c:\\user.json"), user); } catch (JsonGenerationException e1) {
		 * // TODO Auto-generated catch block e1.printStackTrace(); } catch
		 * (JsonMappingException e1) { // TODO Auto-generated catch block
		 * e1.printStackTrace(); } catch (IOException e1) { // TODO
		 * Auto-generated catch block e1.printStackTrace(); }
		 

		if (formLongName != null) {
			String formName = formLongName.trim();
			if (formName.length() > 0) {
				where += (where == "") ? " WHERE " : " AND ";
				where += "f.form_long_name = '" + formName + "'";
			}
		}
		if (protocolIdSeq != null) {
			String protocol = protocolIdSeq.trim();
			if (protocol.length() > 0) {
				where += (where == "") ? " WHERE " : " AND ";
				where += "f.Protocol_long_name = '" + protocol + "'";
			}
		}
		if (workflow != null) {
			String workFlow = workflow.trim();
			if (workFlow.length() > 0) {
				where += (where == "") ? " WHERE " : " AND ";
				where += "w.name =" + workFlow ;
			}
		}
		if (publicId != null) {
			where += (where == "") ? " WHERE " : " AND ";
			where += "f.PUBLICID =" + publicId;

		}

		if (category != null) {
			String cate = category.trim();
			if (cate.length() > 0) {
				where += (where == "") ? " WHERE " : " AND ";
				where += "cat.name =" + cate;
			}
		}

		if (type != null) {
			String t = type.trim();
			if (t.length() > 0) {
				where += (where == "") ? " WHERE " : " AND ";
				where += "t.name =" + t;
			}
		}
		if (version != null) {

			where += (where == "") ? " WHERE " : " AND ";
			where += "f.version =" + version;
		}

		String sql = "SELECT f.form_long_name fn,f.publicid p,f.Protocol_long_name pn,f.version ver,cat.name ct,"
				+ "c.name cn,w.name wn,t.name tn from Form f,Context c,Type t,Workflow w,Category cat where " + where;

		return jdbcTemplate.query(sql, new ResultSetExtractor<List<Form>>() {

			@Override
			public List<Form> extractData(ResultSet rs) throws SQLException, DataAccessException {
				List<Form> formList = new ArrayList<Form>();
				while (rs.next()) {
					Form form = new Form();

					form.setLongName(rs.getString("fn"));
					form.setPublicId(rs.getInt("p"));
					form.setPrtocolName(rs.getString("pn"));
					form.setVersion(rs.getString("ver"));
					form.getCategory().setName(rs.getString("ct").toUpperCase());
					form.getContext().setName(rs.getString("cn").toUpperCase());
					form.getWorkflow().setName(rs.getString("wn").toUpperCase());
					form.getType().setName(rs.getString("tn").toUpperCase());

					formList.add(form);
				}
				return formList;
			}

		});

	}
}
*/