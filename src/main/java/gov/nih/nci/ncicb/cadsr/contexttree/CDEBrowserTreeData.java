package gov.nih.nci.ncicb.cadsr.contexttree;

import java.io.Serializable;
import java.util.Collection;
import java.util.Iterator;

import javax.faces.context.FacesContext;
import javax.servlet.http.HttpSession;

import org.apache.commons.lang.StringEscapeUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.myfaces.custom.tree2.TreeModelBase;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Component;
import org.springframework.web.context.support.WebApplicationContextUtils;

import gov.nih.nci.ncicb.cadsr.common.cdebrowser.DataElementSearchBean;
import gov.nih.nci.ncicb.cadsr.common.persistence.dao.AbstractDAOFactoryFB;
import gov.nih.nci.ncicb.cadsr.common.persistence.dao.ContextDAO;
import gov.nih.nci.ncicb.cadsr.common.persistence.dao.jdbc.JDBCDAOFactoryFB;
import gov.nih.nci.ncicb.cadsr.common.resource.Context;
import gov.nih.nci.ncicb.cadsr.common.util.SessionHelper;
import gov.nih.nci.ncicb.webtree.ContextNode;
import gov.nih.nci.ncicb.webtree.LazyActionTreeModel;
import gov.nih.nci.ncicb.webtree.LazyActionTreeNode;

@Component("treeData")
public class CDEBrowserTreeData implements Serializable
{
	private static final long serialVersionUID = 1L;
	protected Log log;

	@Autowired
	private AbstractDAOFactoryFB daoFactory;
	
	LazyActionTreeNode treeData;
	TreeModelBase treeModel;

	public CDEBrowserTreeData()
	{
		log = LogFactory.getLog(CDEBrowserTreeData.class.getName());
		treeData = null;
	}

	public CDEBrowserTreeData(TreeModelBase treeMdl)
	{
		log = LogFactory.getLog(CDEBrowserTreeData.class.getName());
		treeData = null;
		treeModel = treeMdl;
	}
	
	private void initSpringObjects(HttpSession session)
	{
		if (daoFactory == null)
		{
			ApplicationContext context =  WebApplicationContextUtils.getWebApplicationContext(session.getServletContext());
			daoFactory = (AbstractDAOFactoryFB) context.getBean("daoFactory", JDBCDAOFactoryFB.class);
		}
	}

	private LazyActionTreeNode buildTree()
	{
		log.info("Building CDE Browser tree start ....");
		LazyActionTreeNode contextFolder = new LazyActionTreeNode("Context Folder", "caDSR Contexts", "javascript:performAction('P_PARAM_TYPE=CONTEXT&NOT_FIRST_DISPLAY=1&performQuery=yes')", false);
		contextFolder.setParent(null);
		contextFolder.setTreeModel(new LazyActionTreeModel(contextFolder));
		boolean excludeTraining = true;
		boolean excludeTest = true;
		boolean noBuildException = true;
		try
		{
			FacesContext facesContext = FacesContext.getCurrentInstance();
			HttpSession session = (HttpSession)facesContext.getExternalContext().getSession(false);
			initSpringObjects(session);
			Collection contexts = (Collection)session.getAttribute("allContexts");
			if(contexts == null || contexts.size() < 1)
			{
				ContextDAO dao = daoFactory.getContextDAO();
				contexts = dao.getAllContexts();
				DataElementSearchBean desb = (DataElementSearchBean)(DataElementSearchBean)SessionHelper.getInfoBean(session, "desb");
				if(desb == null)
				{
					desb = new DataElementSearchBean();
					desb.initDefaultContextPreferences();
				}
				desb.getContextsList(contexts);
			}
			LazyActionTreeNode contextNode;
			for(Iterator iter = contexts.iterator(); iter.hasNext(); contextFolder.addLeaf(contextNode))
			{
				Context context = (Context)iter.next();
				contextNode = new ContextNode("Context Folder", (new StringBuilder()).append(context.getName()).append(" (").append(context.getDescription()).append(")").toString(), (new StringBuilder()).append("javascript:performAction('P_PARAM_TYPE=CONTEXT&P_IDSEQ=").append(context.getConteIdseq()).append("&P_CONTE_IDSEQ=").append(context.getConteIdseq()).append(StringEscapeUtils.escapeHtml("&PageId=DataElementsGroup&NOT_FIRST_DISPLAY=1&performQuery=yes")).append("')").toString(), context.getConteIdseq(), false);
			}

		}
		catch(Exception e)
		{
			noBuildException = false;
			log.error("Exception caught when building the tree", e);
			throw new RuntimeException(e);
		}
		contextFolder.setLoaded(noBuildException);
		contextFolder.setExpanded(noBuildException);
		log.info("Finished Building CDE Browser tree");
		return contextFolder;
	}

	public void refreshTree()
	{
		setTreeData(buildTree());
	}

	public synchronized void setTreeData(LazyActionTreeNode treeData)
	{
		this.treeData = treeData;
	}

	public LazyActionTreeNode getTreeData()
	{
		if(treeData == null)
			setTreeData(buildTree());
		return treeData;
	}

	public void setDaoFactory(AbstractDAOFactoryFB daoFactory)
	{
		this.daoFactory = daoFactory;
	}

	public AbstractDAOFactoryFB getDaoFactory()
	{
		return daoFactory;
	}

}
