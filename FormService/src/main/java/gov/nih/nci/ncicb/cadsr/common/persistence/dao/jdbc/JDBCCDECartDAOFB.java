package gov.nih.nci.ncicb.cadsr.common.persistence.dao.jdbc;

import gov.nih.nci.ncicb.cadsr.common.dto.DataElementTransferObject;
import gov.nih.nci.ncicb.cadsr.common.dto.ValueDomainTransferObject;
import gov.nih.nci.ncicb.cadsr.common.exception.DMLException;
import gov.nih.nci.ncicb.cadsr.common.persistence.dao.CDECartDAO;
import gov.nih.nci.ncicb.cadsr.common.persistence.dao.ValueDomainDAO;
import gov.nih.nci.ncicb.cadsr.common.resource.DataElement;
import gov.nih.nci.ncicb.cadsr.common.resource.ValueDomain;
import gov.nih.nci.ncicb.cadsr.objectCart.CDECart;
import gov.nih.nci.ncicb.cadsr.objectCart.CDECartItem;
import gov.nih.nci.ncicb.cadsr.objectCart.CDECartItemTransferObject;
import gov.nih.nci.ncicb.cadsr.objectCart.impl.CDECartImpl;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;

import javax.annotation.PostConstruct;
import javax.sql.DataSource;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.jdbc.core.SqlParameter;
import org.springframework.jdbc.object.MappingSqlQuery;
import org.springframework.jdbc.object.SqlUpdate;
import org.springframework.stereotype.Component;

@Component("cDECartDAO")
public class JDBCCDECartDAOFB extends JDBCBaseDAOFB implements CDECartDAO
{
	private DataElementsInCartQuery deCartQuery;
	private FormsInCartQuery frmCartQuery;
	private ValueDomainDAO vdDAO;
	private DeleteCartItem  deleteItemQuery;
	private InsertCartItem  insertItemQuery;

	public JDBCCDECartDAOFB() {
		super();
	}
	
	@PostConstruct
	public void init()
	{
		deCartQuery = new DataElementsInCartQuery(getDataSource());
		frmCartQuery = new FormsInCartQuery(getDataSource());
		deleteItemQuery  = new DeleteCartItem(getDataSource());
		insertItemQuery  = new InsertCartItem (getDataSource());
	}

	public CDECart findCDECart(String username) {
		//CDECart cart = new CDECartTransferObject();
		CDECart cart = new CDECartImpl();
		List deList = deCartQuery.execute(username.toUpperCase());
		cart.setDataElements(deList);
		//List formList = frmCartQuery.execute(username);
		//cart.setForms(formList);
		return cart;
	}

	public int insertCartItem(CDECartItem item) {
		int res = 0;
		try {
			String ccmIdseq = generateGUID(); 
			res = insertItemQuery.createItem(item, ccmIdseq);
		} 
		catch (DataIntegrityViolationException dex) {
			log.info("Unique constraint voilated in creating cart item", dex);
		}
		return res;
	}

	public int deleteCartItem(String itemId, String username) {
		int res = deleteItemQuery.deleteItem(itemId,username.toUpperCase());
		if (res != 1) {
			DMLException dmlExp = new DMLException("Did not succeed in deleting  the " + 
					" cde_cart_items table.");
			dmlExp.setErrorCode(ERROR_DELETING_CART_ITEM);
			throw dmlExp;         
		}
		return 1;
	}

	/**
	 * Inner class
	 */
	class DataElementsInCartQuery extends MappingSqlQuery {
		DataElementsInCartQuery(DataSource ds) {
			super(ds,"SELECT * FROM FB_CART_DE_VIEW where UA_NAME = ? ");
			declareParameter(new SqlParameter("ua_name", Types.VARCHAR));
		}

		protected Object mapRow(
				ResultSet rs,
				int rownum) throws SQLException {
			CDECartItem item = new CDECartItemTransferObject();
			DataElement de = new DataElementTransferObject();
			//Getting Value Domain Information
			ValueDomain vd = new ValueDomainTransferObject();
			Collection vdColl = new ArrayList(1);
			vdColl.add(rs.getString(13));
			Map hm = vdDAO.getValidValues(vdColl);
			List values = (List)hm.get(rs.getString(13)) ;
			vd.setValidValues(values);
			vd.setVdIdseq(rs.getString(13));
			vd.setPublicId(rs.getInt(14));
			vd.setPreferredName(rs.getString(16));
			vd.setLongName(rs.getString(17));
			//Getting Data Element Information
			de.setDeIdseq((String)rs.getString(3));
			de.setPublicId(rs.getInt(4));
			de.setVersion(new Float(rs.getFloat(5)));
			de.setContextName(rs.getString(6));
			de.setAslName(rs.getString(8));
			de.setPreferredName(rs.getString(9));
			de.setLongName(rs.getString(10));
			de.setPreferredDefinition(rs.getString(11));
			de.setLongCDEName(rs.getString(12));
			de.setValueDomain(vd);
			de.setRegistrationStatus(rs.getString(27));
			item.setPersistedInd(true);
			item.setDeletedInd(false);
			item.setItem(de);
			return item;
		}
	}

	/**
	 * Inner class
	 */
	class FormsInCartQuery extends MappingSqlQuery {
		FormsInCartQuery(DataSource ds) {
			super(ds,"SELECT * FROM FB_FORM_CART_VIEW where UA_NAME = ? ");
			declareParameter(new SqlParameter("ua_name", Types.VARCHAR));
		}

		protected Object mapRow(
				ResultSet rs,
				int rownum) throws SQLException {
			CDECartItem item = new CDECartItemTransferObject();
			return item;
		}
	}

	/**
	 * Inner class that accesses database to create a cart item
	 */
	private class InsertCartItem extends SqlUpdate {
		public InsertCartItem(DataSource ds) {
			String itemInsertSql = 
					" INSERT INTO cde_cart_items " + 
							" (ccm_idseq, ac_idseq, ua_name, actl_name,created_by,date_created) " +
							" VALUES " +
							" (?, ?, ?, ?, ?, ?) ";

			this.setDataSource(ds);
			this.setSql(itemInsertSql);
			declareParameter(new SqlParameter("p_ccm_idseq", Types.VARCHAR));
			declareParameter(new SqlParameter("p_ac_idseq", Types.VARCHAR));
			declareParameter(new SqlParameter("p_ua_name", Types.VARCHAR));
			declareParameter(new SqlParameter("p_actl_name", Types.VARCHAR));
			declareParameter(new SqlParameter("p_created_by", Types.VARCHAR));
			declareParameter(new SqlParameter("p_date_created", Types.TIMESTAMP));
			compile();
		}
		protected int createItem (CDECartItem sm, String ccmIdseq) 
		{
			Object [] obj = 
					new Object[]
							{ccmIdseq, 
									sm.getId(),
									sm.getCreatedBy().toUpperCase(),
									sm.getType(),
									sm.getCreatedBy(),
									sm.getCreatedDate()
							};

			int res = update(obj);
			return res;
		}
	}

	/**
	 * Inner class that accesses database to delete an item.
	 */
	private class DeleteCartItem extends SqlUpdate {
		public DeleteCartItem(DataSource ds) {
			String itemDeleteSql = 
					" DELETE FROM cde_cart_items " +
							" WHERE ac_idseq = ? " +
							" AND   ua_name = ? ";

			this.setDataSource(ds);
			this.setSql(itemDeleteSql);
			declareParameter(new SqlParameter("p_ac_idseq", Types.VARCHAR));
			declareParameter(new SqlParameter("p_user", Types.VARCHAR));
			compile();
		}
		protected int deleteItem (String ccmIdseq,String username) 
		{
			Object [] obj = 
					new Object[]
							{ccmIdseq,
									username
							};

			int res = update(obj);
			return res;
		}
	}
}
