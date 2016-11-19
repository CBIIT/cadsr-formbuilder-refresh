package gov.nih.nci.cadsr.dao.impl;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.DataOutputStream;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.sql.Connection;
import java.util.Collection;
import java.util.Iterator;
import java.util.Vector;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Repository;

import gov.nih.nci.ncicb.cadsr.common.util.CDEBrowserParams;
import gov.nih.nci.ncicb.cadsr.common.util.ConnectionHelper;
import gov.nih.nci.ncicb.cadsr.common.util.DBUtil;
import gov.nih.nci.ncicb.cadsr.common.xml.XMLGeneratorBean;
import gov.nih.nci.ncicb.cadsr.objectCart.CDECart;
import gov.nih.nci.ncicb.cadsr.objectCart.CDECartItem;

@Repository
public class CdeDownloadRepo {

	@Autowired
	@Qualifier("dataSource")
	private DataSource oracleDataSource;

	private String where;
	private String source;
	private Connection jndiName;
	private String fileName = "";
	static final int BUFFER = 2048;

	public void generateXMLForCDECart(CDECart cart, String src) throws Exception {
		Connection conn = oracleDataSource.getConnection();
		if (conn == null) {
			throw new Exception("JNDI name cannot be null");
		}

		Collection items = cart.getDataElements();
		CDECartItem item = null;
		boolean firstOne = true;
		StringBuffer whereBuffer = new StringBuffer("");
		Iterator itemsIt = items.iterator();

		while (itemsIt.hasNext()) {
			item = (CDECartItem) itemsIt.next();

			if (firstOne) {
				whereBuffer.append("'" + item.getId() + "'");

				firstOne = false;
			} else {
				whereBuffer.append(",'" + item.getId() + "'");
			}
		}

		where = whereBuffer.toString();
		source = src;
		jndiName = conn;
		generateXMLFile();
	}

	private String getSQLStatement() {
		String stmt = " SELECT PublicId " + ", LongName " + ",  PreferredName  " + ",  PreferredDefinition  "
				+ ",  Version  " + ",  WorkflowStatus  " + ",  ContextName  " + ",  ContextVersion  " + ",  Origin  "
				+ ",  RegistrationStatus  " + ",  DataElementConcept  " + ",  ValueDomain  "
				+ ",  ReferenceDocumentsList  " + ",  ClassificationsList  " + ",  AlternateNameList  "
				+ ",  DataElementDerivation  " + " FROM sbrext.DE_XML_GENERATOR_VIEW ";

		stmt += "WHERE DE_IDSEQ IN " + " ( " + where + " )  ";
		return stmt;
	}

	private void generateXMLFile() throws Exception {
		XMLGeneratorBean xmlBean = null;
		Connection cn = null;

		try {
			String xmlString = null;

			xmlBean = new XMLGeneratorBean();
			xmlBean.setQuery(getSQLStatement());

			xmlBean.setRowsetTag("DataElementsList");
			xmlBean.setRowTag("DataElement");
			xmlBean.displayNulls(true);
			// String mrec =
			// CDEBrowserParams.getInstance().getXMLFileMaxRecords();
			int maxRecords = 10;
			cn = oracleDataSource.getConnection();
			/*
			 * if (mrec != null && !mrec.equals("")) maxRecords =
			 * Integer.parseInt(mrec);
			 */

			/*
			 * CDEBrowserParams.getInstance().getXMLPaginationFlag() is giving
			 * me null exception and' give paginate = "yes"
			 * 
			 */

			String paginate = null;// CDEBrowserParams.getInstance().getXMLPaginationFlag();
			if (paginate == null)
				paginate = "no";
			paginate = "yes";
			/*
			 * ConnectionHelper connHelper = new ConnectionHelper(jndiName); cn
			 * = connHelper.getConnection();
			 */

			if (cn == null) {
				throw new Exception("Cannot get the connection for the JNDI name [" + jndiName + "]");
			}

			fileName = getFileName("xml");
			if (paginate.equals("yes")) {
				Vector zipFileVec = new Vector(10);
				xmlBean.setMaxRowSize(maxRecords);
				xmlBean.setConnection(cn);
				xmlBean.createOracleXMLQuery();

				while ((xmlString = xmlBean.getNextPage()) != null) {
					fileName = getFileName("xml");
					writeToFile(xmlString, fileName);
					zipFileVec.addElement(fileName);
					// get a new file
					fileName = "";
				}
				if (zipFileVec.size() > 0)
					createZipFile(zipFileVec, getFileName("zip"));
			} else {
				xmlString = xmlBean.getXMLString(cn);
				writeToFile(xmlString, fileName);
			}

			xmlString = null;
		} catch (Exception ex) {

			throw ex;
		} finally {
			try {
				if (cn != null) {
					cn.close();
				}
			} catch (Exception e) {

			}
		}
	}

	public String getFileName(String prefix) {
		Connection cn = null;

		try {
			if (fileName.equals("")) {
				DBUtil dbutil = new DBUtil();

				/*
				 * ConnectionHelper connHelper = new ConnectionHelper(jndiName);
				 * cn = connHelper.getConnection();
				 */
				cn = oracleDataSource.getConnection();

				if (cn == null) {
					throw new Exception("Cannot get the connection for the JNDI name [" + jndiName + "]");
				}

				String zipFileSuffix = dbutil.getUniqueId(cn, "SBREXT.XML_FILE_SEQ.NEXTVAL");

				String downLoadDir = "C:\\Users\\bbirha\\Downloads\\";
				if (prefix.equals(""))
					prefix = ".xml";
				fileName = downLoadDir + "DataElements" + "_" + zipFileSuffix + "." + prefix;
			}
		} catch (Exception e) {

		} finally {
			if (cn != null) {
				try {
					cn.close();
				} catch (Exception e) {
				}
			}
		}
		return fileName;
	}

	private void writeToFile(String xmlStr, String fn) throws Exception {
		FileOutputStream newFos = null;
		DataOutputStream newDos = null;

		try {
			newFos = new FileOutputStream(fn);
			newDos = new DataOutputStream(newFos);
			newDos.writeBytes(xmlStr + "\n");
			// setResult("FILE_NAME", fn);
		} catch (Exception e) {

		} finally {
			if (newDos != null)
				newDos.close();
		}
	}

	private void createZipFile(Vector fileList, String zipFilename) throws Exception {
		BufferedInputStream origin = null;
		FileOutputStream dest = null;
		ZipOutputStream out = null;

		try {
			dest = new FileOutputStream(zipFilename);
			out = new ZipOutputStream(new BufferedOutputStream(dest));

			byte[] data = new byte[BUFFER];

			for (int i = 0; i < fileList.size(); i++) {
				FileInputStream fi = new FileInputStream((String) fileList.elementAt(i));
				origin = new BufferedInputStream(fi, BUFFER);

				ZipEntry entry = new ZipEntry((String) fileList.elementAt(i));
				out.putNextEntry(entry);

				int count;

				while ((count = origin.read(data, 0, BUFFER)) != -1) {
					out.write(data, 0, count);
				}

				origin.close();
			}
		} catch (Exception ex) {

			throw ex;
		} finally {
			if (out != null)
				out.close();
		}
	}

}
