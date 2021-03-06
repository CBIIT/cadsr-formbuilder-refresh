package gov.nih.nci.ncicb.cadsr.common.persistence.dao.jdbc;

import gov.nih.nci.ncicb.cadsr.common.dto.DataElementDerivationTransferObject;
import gov.nih.nci.ncicb.cadsr.common.dto.DataElementDerivationTypeTransferObject;
import gov.nih.nci.ncicb.cadsr.common.dto.DataElementTransferObject;
import gov.nih.nci.ncicb.cadsr.common.dto.DerivedDataElementTransferObject;
import gov.nih.nci.ncicb.cadsr.common.persistence.dao.DerivedDataElementDAO;
import gov.nih.nci.ncicb.cadsr.common.resource.DataElementDerivationType;
import gov.nih.nci.ncicb.cadsr.common.resource.DerivedDataElement;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;

import java.util.List;

import javax.annotation.PostConstruct;
import javax.sql.DataSource;

import org.springframework.jdbc.core.SqlParameter;
import org.springframework.jdbc.object.MappingSqlQuery;
import org.springframework.stereotype.Component;

@Component("derivedDataElementDAO")
public class JDBCDerivedDataElementDAOFB extends JDBCBaseDAOFB implements DerivedDataElementDAO
{
  private DerivedDataElementQuery ddeQuery;
  private DataElementDerivationQuery dedQuery;

  public JDBCDerivedDataElementDAOFB() {
    super();
  }
  
  @PostConstruct
  public void init()
  {
	  ddeQuery = new DerivedDataElementQuery(this.getDataSource());
	  dedQuery = new DataElementDerivationQuery(this.getDataSource());
  }

  public DerivedDataElement findDerivedDataElement(String deIdSeq) {
    //CDECart cart = new CDECartTransferObject();
    DerivedDataElement dde = new DerivedDataElementTransferObject();
    List ddeList = ddeQuery.execute(deIdSeq);
    if (ddeList.size() > 0) {
      dde = (DerivedDataElement) ddeList.get(0);
    
      List dedList = dedQuery.execute(deIdSeq);
      dde.setDataElementDerivation(dedList);
      return dde;
    }
    else 
      return null;
  }

  public static void main(String[] args) {
    JDBCDerivedDataElementDAOFB cTest = new JDBCDerivedDataElementDAOFB();

    cTest.findDerivedDataElement("A1811695-2950-73DF-E034-080020C9C0E0");
    /*
    try {
      CDECartItem newItem = new CDECartItemTransferObject();

      int res = cTest.deleteCartItem("D5378537-60EA-2B2C-E034-0003BA0B1A09","SBREXT");
      System.out.println("\n*****Create Item Result 1: " + res);
    }
    catch (DMLException de) {
      System.out.println("******Printing DMLException*******");
      de.printStackTrace();
      System.out.println("******Finishing printing DMLException*******");
    }


    /*
    try {
      int res = formTest.deleteForm("D4700045-2FD0-0DAA-E034-0003BA0B1A09");
      System.out.println("\n*****Delete Form Result 1: " + res);
    }
    catch (DMLException de) {
      System.out.println("******Printing DMLException*******");
      de.printStackTrace();
      System.out.println("******Finishing printing DMLException*******");
    }
    */
  }


  /**
   * Inner class
   */
  class DerivedDataElementQuery extends MappingSqlQuery {
    DerivedDataElementQuery(DataSource ds) {
      super(ds,"SELECT * FROM SBR.COMPLEX_DATA_ELEMENTS_VIEW where P_DE_IDSEQ = ? ");
      declareParameter(new SqlParameter("p_de_idseq", Types.VARCHAR));
    }

    protected Object mapRow(
      ResultSet rs,
      int rownum) throws SQLException {
      DerivedDataElementTransferObject dde = new DerivedDataElementTransferObject();
      DataElementDerivationType dedt = new DataElementDerivationTypeTransferObject();
      dde.setDdeIdSeq(rs.getString("P_DE_IDSEQ"));
      dde.setMethods(rs.getString("METHODS"));
      dde.setRule(rs.getString("RULE"));
      dde.setConcatenationCharacter(rs.getString("CONCAT_CHAR"));
      dde.setDateModified(rs.getTimestamp("DATE_MODIFIED"));
      dde.setDateCreated(rs.getTimestamp("DATE_CREATED"));
      dde.setModifiedBy(rs.getString("MODIFIED_BY"));
      dde.setCreatedBy(rs.getString("CREATED_BY"));
      dedt.setName(rs.getString("CRTL_NAME"));
      dde.setType(dedt);

      return dde;
    }
  }

  class DataElementDerivationQuery extends MappingSqlQuery {
    DataElementDerivationQuery(DataSource ds) {
    
      String dedSql = "select cdr.cdr_idseq, cdr.c_de_idseq, de.long_name, "
       + "de.CDE_ID, de.ASL_NAME, de.VERSION, cdr.display_order, ct.NAME" +
      " from sbr.contexts_view ct, sbr.complex_de_rel_view cdr, sbr.data_elements_view de " +
      " where de.CONTE_IDSEQ = ct.CONTE_IDSEQ and cdr.c_de_idseq = de.de_idseq and p_de_idseq= ? " +
      "order by cdr.display_order";

      this.setDataSource(ds);
      this.setSql(dedSql);
      
      declareParameter(new SqlParameter("p_de_idseq", Types.VARCHAR));
    }

    protected Object mapRow(
      ResultSet rs,
      int rownum) throws SQLException {
      DataElementDerivationTransferObject ded = new DataElementDerivationTransferObject();
      DataElementTransferObject de = new DataElementTransferObject();
      ded.setCdrIdSeq(rs.getString(1));
      de.setIdseq(rs.getString(2));
      de.setLongName(rs.getString(3));
      de.setCDEId(rs.getString(4));
      de.setAslName(rs.getString(5));
      de.setVersion(new Float(rs.getFloat(6)));
      ded.setDisplayOrder(rs.getInt(7));
      de.setContextName(rs.getString(8));
      ded.setDerivedDataElement(de);
      return ded;
    }
  }
}
