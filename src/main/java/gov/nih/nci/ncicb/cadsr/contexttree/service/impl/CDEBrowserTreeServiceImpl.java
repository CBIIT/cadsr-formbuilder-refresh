package gov.nih.nci.ncicb.cadsr.contexttree.service.impl;

import gov.nih.nci.ncicb.cadsr.common.dto.CSITransferObject;
import gov.nih.nci.ncicb.cadsr.common.dto.ContextHolderTransferObject;
import gov.nih.nci.ncicb.cadsr.common.persistence.dao.*;
import gov.nih.nci.ncicb.cadsr.common.resource.*;
import gov.nih.nci.ncicb.cadsr.common.util.CDEBrowserParams;
import gov.nih.nci.ncicb.cadsr.contexttree.*;
import gov.nih.nci.ncicb.cadsr.contexttree.service.CDEBrowserTreeService;
import gov.nih.nci.ncicb.webtree.*;
import java.net.URLEncoder;
import java.util.*;
import javax.swing.tree.DefaultMutableTreeNode;
import org.apache.commons.lang.StringEscapeUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service("treeService")
public class CDEBrowserTreeServiceImpl implements CDEBrowserTreeService
{

	@Autowired
	private AbstractDAOFactoryFB daoFactory;

	public CDEBrowserTreeServiceImpl()
	{
	}

	public List getContextNodeHolders(TreeFunctions treeFunctions, TreeIdGenerator idGen, String excludeList)
			throws Exception
	{
		ContextDAO dao = daoFactory.getContextDAO();
		List contexts = dao.getAllContexts(excludeList);
		ListIterator it = contexts.listIterator();
		List holders = new ArrayList();
		ContextHolder holder;
		for(; it.hasNext(); holders.add(holder))
		{
			Context context = (Context)it.next();
			holder = new ContextHolderTransferObject();
			holder.setContext(context);
			holder.setNode(getContextNode(idGen.getNewId(), context, treeFunctions));
		}

		return holders;
	}

	public List getAllContextProtocolNodes(TreeFunctions treeFunctions, TreeIdGenerator idGen)
			throws Exception
	{
		Map protoCSMap = getFormClassificationNodes(treeFunctions, idGen, "FOLDER", "Form Type");
		Map treeNodeMap = new HashMap();
		Map allFormsWithProtocol = new HashMap();
		Map allFormsWithNoProtocol = new HashMap();
		FormDAO dao = daoFactory.getFormDAO();
		List forms = dao.getAllFormsOrderByContextProtocol();
		Map protocolHolder = new HashMap();
		Iterator iter = forms.iterator();
		do
		{
			if(!iter.hasNext())
				break;
			Form currForm = (Form)iter.next();
			String currContextId = null;
			if(currForm.getProtocols() != null && currForm.getProtocols().size() > 0)
				currContextId = ((Protocol)currForm.getProtocols().get(0)).getConteIdseq();
			if(currContextId == null)
				currContextId = currForm.getContext().getConteIdseq();
			Map currCSMap = (Map)protoCSMap.get(currContextId);
			String currProtoIdSeq = null;
			if(currForm.getProtocols() != null && currForm.getProtocols().size() > 0)
				currProtoIdSeq = ((Protocol)currForm.getProtocols().get(0)).getProtoIdseq();
			DefaultMutableTreeNode formNode = getFormNode(idGen.getNewId(), currForm, treeFunctions, false);
			if(currProtoIdSeq != null && !currProtoIdSeq.equals(""))
			{
				List protocolList = (List)allFormsWithProtocol.get(currContextId);
				if(protocolList == null)
				{
					protocolList = new ArrayList();
					allFormsWithProtocol.put(currContextId, protocolList);
				}
				DefaultMutableTreeNode protoNode = (DefaultMutableTreeNode)protocolHolder.get(currProtoIdSeq);
				if(protoNode == null)
				{
					protoNode = getProtocolNode(idGen.getNewId(), (Protocol)currForm.getProtocols().get(0), currContextId, treeFunctions);
					protocolHolder.put(currProtoIdSeq, protoNode);
					protocolList.add(protoNode);
					treeNodeMap.clear();
				}
				if(currForm.getClassifications() == null || currForm.getClassifications().size() == 0)
					protoNode.add(formNode);
				else
					copyCSTree(currForm, currCSMap, treeNodeMap, formNode, protoNode, idGen);
			}
		} while(true);
		List resultList = new ArrayList();
		resultList.add(0, allFormsWithNoProtocol);
		resultList.add(1, allFormsWithProtocol);
		return resultList;
	}

	public Map getAllContextTemplateNodes(TreeFunctions treeFunctions, TreeIdGenerator idGen)
			throws Exception
	{
		Map allTemplatesByContext = new HashMap();
		Map protoCSMap = getFormClassificationNodes(treeFunctions, idGen, "FOLDER", "Template Type");
		Map treeNodeMap = new HashMap();
		FormDAO dao = daoFactory.getFormDAO();
		List templates = dao.getAllTemplatesOrderByContext();
		for(Iterator iter = templates.iterator(); iter.hasNext();)
		{
			Form currTemplate = (Form)iter.next();
			String currContextId = currTemplate.getContext().getConteIdseq();
			Map currCSMap = (Map)protoCSMap.get(currContextId);
			DefaultMutableTreeNode tmpNode = getTemplateNode(idGen.getNewId(), currTemplate, treeFunctions);
			DefaultMutableTreeNode tmpLabelNode = (DefaultMutableTreeNode)allTemplatesByContext.get(currContextId);
			if(tmpLabelNode == null)
			{
				tmpLabelNode = getWebNode("Protocol Form Templates", idGen.getNewId());
				treeNodeMap.clear();
			}
			allTemplatesByContext.put(currContextId, tmpLabelNode);
			if(currTemplate.getClassifications() == null || currTemplate.getClassifications().size() == 0)
				tmpLabelNode.add(tmpNode);
			else
				copyCSTree(currTemplate, currCSMap, treeNodeMap, tmpNode, tmpLabelNode, idGen);
		}

		return allTemplatesByContext;
	}

	public List getAllTemplateNodesForCTEP(TreeFunctions treeFunctions, TreeIdGenerator idGen, Context currContext)
			throws Exception
	{
		List allTemplatesForCtep = new ArrayList();
		Map disCscsiHolder = new HashMap();
		Map phaseCscsiHolder = new HashMap();
		DefaultMutableTreeNode phaseNode = getWebNode("Phase", idGen.getNewId());
		DefaultMutableTreeNode diseaseNode = getWebNode("Disease", idGen.getNewId());
		allTemplatesForCtep.add(phaseNode);
		allTemplatesForCtep.add(diseaseNode);
		FormDAO dao = daoFactory.getFormDAO();
		List templateTypes = dao.getAllTemplateTypes(currContext.getConteIdseq());
		Collection csiList = dao.getCSIForContextId(currContext.getConteIdseq());
		Map cscsiMap = new HashMap();
		List phaseCsCsiList = new ArrayList();
		List diseaseCsCsiList = new ArrayList();
		Iterator iter = csiList.iterator();
		do
		{
			if(!iter.hasNext())
				break;
			CSITransferObject csiTO = (CSITransferObject)iter.next();
			cscsiMap.put(csiTO.getCsCsiIdseq(), csiTO);
			if(csiTO.getClassSchemeLongName().equals("CRF_DISEASE"))
				diseaseCsCsiList.add(csiTO.getCsCsiIdseq());
			if(csiTO.getClassSchemeLongName().equals("Phase"))
				phaseCsCsiList.add(csiTO.getCsCsiIdseq());
		} while(true);
		Collection templates = dao.getAllTemplatesForContextId(currContext.getConteIdseq());
		String currContextId = currContext.getConteIdseq();
		addAllcscsiNodes(phaseCsCsiList, cscsiMap, currContextId, phaseNode, templateTypes, phaseCscsiHolder, idGen);
		addAllcscsiNodes(diseaseCsCsiList, cscsiMap, currContextId, diseaseNode, templateTypes, disCscsiHolder, idGen);
		iter = templates.iterator();
		do
		{
			if(!iter.hasNext())
				break;
			Form currTemplate = (Form)iter.next();
			Collection csColl = currTemplate.getClassifications();
			String currCsCsiIdseq = null;
			Iterator csIter = csColl.iterator();
			if(csIter.hasNext())
			{
				ClassSchemeItem currCsi = (ClassSchemeItem)csIter.next();
				currCsCsiIdseq = currCsi.getCsCsiIdseq();
			}
			String currCategory = currTemplate.getFormCategory();
			if(currCategory != null && !currCategory.equals("") && currCsCsiIdseq != null)
			{
				ClassSchemeItem currcscsi = (ClassSchemeItem)cscsiMap.get(currCsCsiIdseq);
				if(currcscsi != null)
					if(phaseCsCsiList.contains(currCsCsiIdseq))
					{
						CsCsiCategorytHolder cscsiCategoryHolder = (CsCsiCategorytHolder)phaseCscsiHolder.get(currCsCsiIdseq);
						Map categoryHolder = cscsiCategoryHolder.getCategoryHolder();
						DefaultMutableTreeNode categoryNode = (DefaultMutableTreeNode)categoryHolder.get(currCategory);
						DefaultMutableTreeNode templateNode = getTemplateNode(idGen.getNewId(), currTemplate, currcscsi, currContext, treeFunctions);
						categoryNode.add(templateNode);
					} else
						if(diseaseCsCsiList.contains(currCsCsiIdseq))
						{
							CsCsiCategorytHolder cscsiCategoryHolder = (CsCsiCategorytHolder)disCscsiHolder.get(currCsCsiIdseq);
							Map categoryHolder = cscsiCategoryHolder.getCategoryHolder();
							DefaultMutableTreeNode categoryNode = (DefaultMutableTreeNode)categoryHolder.get(currCategory);
							DefaultMutableTreeNode templateNode = getTemplateNode(idGen.getNewId(), currTemplate, currcscsi, currContext, treeFunctions);
							categoryNode.add(templateNode);
						}
			}
		} while(true);
		return allTemplatesForCtep;
	}

	public Map getAllPublishingNode(TreeFunctions treeFunctions, TreeIdGenerator idGen, boolean showFormsAlphebetically)
			throws Exception
	{
		CSITransferObject publishFormCSI = null;
		CSITransferObject publishTemplateCSI = null;
		DefaultMutableTreeNode publishNode = null;
		Map formPublishCSCSIMap = new HashMap();
		Map templatePublishCSCSIMap = new HashMap();
		Map publishNodeByContextMap = new HashMap();
		Map formCSMap = getFormClassificationNodes(treeFunctions, idGen, "FOLDER", "Form Type");
		Map templateCSMap = getFormClassificationNodes(treeFunctions, idGen, "FOLDER", "Template Type");
		FormDAO dao = daoFactory.getFormDAO();
		List formCSIs = dao.getAllPublishingCSCSIsForForm();
		for(Iterator formIter = formCSIs.iterator(); formIter.hasNext(); formPublishCSCSIMap.put(publishFormCSI.getCsConteIdseq(), publishFormCSI))
			publishFormCSI = (CSITransferObject)formIter.next();

		List templateCSIs = dao.getAllPublishingCSCSIsForTemplate();
		for(Iterator templateIter = templateCSIs.iterator(); templateIter.hasNext(); templatePublishCSCSIMap.put(publishTemplateCSI.getCsConteIdseq(), publishTemplateCSI))
			publishTemplateCSI = (CSITransferObject)templateIter.next();

		Collection formPublishingContexts = formPublishCSCSIMap.keySet();
		Iterator contextIter = formPublishingContexts.iterator();
		Map treeNodeMap = new HashMap();
		do
		{
			if(!contextIter.hasNext())
				break;
			String currContextId = (String)contextIter.next();
			treeNodeMap.clear();
			publishFormCSI = (CSITransferObject)formPublishCSCSIMap.get(currContextId);
			publishNode = new DefaultMutableTreeNode(new WebNode(idGen.getNewId(), publishFormCSI.getClassSchemeLongName()));
			publishNodeByContextMap.put(currContextId, publishNode);
			List publishedProtocols = null;
			List publishedForms = null;
			publishedProtocols = dao.getAllProtocolsForPublishedForms(currContextId);
			publishedForms = new ArrayList();
			if(showFormsAlphebetically)
				publishedForms = dao.getAllPublishedForms(currContextId);
			if(!publishedProtocols.isEmpty() || !publishedForms.isEmpty())
			{
				DefaultMutableTreeNode publishFormNode = new DefaultMutableTreeNode(new WebNode(idGen.getNewId(), publishFormCSI.getClassSchemeItemName()));
				publishNode.add(publishFormNode);
				if(!publishedForms.isEmpty() && showFormsAlphebetically)
				{
					DefaultMutableTreeNode listedAlphabetically = new DefaultMutableTreeNode(new WebNode(idGen.getNewId(), "Listed Alphabetically"));
					Form currForm;
					for(Iterator formsIt = publishedForms.iterator(); formsIt.hasNext(); listedAlphabetically.add(getFormNode(idGen.getNewId(), currForm, treeFunctions, true)))
						currForm = (Form)formsIt.next();

					publishFormNode.add(listedAlphabetically);
				}
				if(!publishedProtocols.isEmpty())
				{
					DefaultMutableTreeNode listedByProtocol = new DefaultMutableTreeNode(new WebNode(idGen.getNewId(), "Listed by Protocol"));
					Iterator protocolIt = publishedProtocols.iterator();
					while(protocolIt.hasNext()) 
					{
						Protocol currProto = (Protocol)protocolIt.next();
						DefaultMutableTreeNode currProtoNode = getProtocolNode(idGen.getNewId(), currProto, currContextId, treeFunctions);
						List formsForProtocol = dao.getAllPublishedFormsForProtocol(currProto.getIdseq());
						for(Iterator protocolFormsIt = formsForProtocol.iterator(); protocolFormsIt.hasNext(); listedByProtocol.add(currProtoNode))
						{
							Form currProtocolForm = (Form)protocolFormsIt.next();
							Collection formCSes = currProtocolForm.getClassifications();
							if(formCSes == null || formCSes.size() == 0)
							{
								currProtoNode.add(getFormNode(idGen.getNewId(), currProtocolForm, treeFunctions, true));
								continue;
							}
							Map currCSMap;
							for(Iterator csIter = formCSes.iterator(); csIter.hasNext(); copyCSTree(currProtocolForm, currCSMap, treeNodeMap, getFormNode(idGen.getNewId(), currProtocolForm, treeFunctions, true), currProtoNode, idGen))
							{
								ClassSchemeItem currCSI = (ClassSchemeItem)csIter.next();
								currCSMap = (Map)formCSMap.get(currCSI.getCsConteIdseq());
							}

						}

						publishFormNode.add(listedByProtocol);
					}
				}
			}
		} while(true);
		Collection templatePublishingContexts = templatePublishCSCSIMap.keySet();
		contextIter = templatePublishingContexts.iterator();
		do
		{
			if(!contextIter.hasNext())
				break;
			List publishedTemplates = null;
			treeNodeMap.clear();
			String currContextId = (String)contextIter.next();
			publishTemplateCSI = (CSITransferObject)templatePublishCSCSIMap.get(currContextId);
			publishNode = (DefaultMutableTreeNode)publishNodeByContextMap.get(currContextId);
			if(publishNode == null)
			{
				publishNode = new DefaultMutableTreeNode(new WebNode(idGen.getNewId(), publishTemplateCSI.getClassSchemeLongName()));
				publishNodeByContextMap.put(currContextId, publishNode);
			}
			publishedTemplates = dao.getAllPublishedTemplates(currContextId);
			if(publishedTemplates != null && !publishedTemplates.isEmpty())
			{
				DefaultMutableTreeNode publishTemplateNode = new DefaultMutableTreeNode(new WebNode(idGen.getNewId(), publishTemplateCSI.getClassSchemeItemName()));
				for(Iterator templateIt = publishedTemplates.iterator(); templateIt.hasNext();)
				{
					Form currTemplate = (Form)templateIt.next();
					if(currTemplate.getClassifications() == null || currTemplate.getClassifications().size() == 0)
					{
						publishTemplateNode.add(getTemplateNode(idGen.getNewId(), currTemplate, treeFunctions));
					} else
					{
						Iterator csIter = currTemplate.getClassifications().iterator();
						while(csIter.hasNext()) 
						{
							ClassSchemeItem currCSI = (ClassSchemeItem)csIter.next();
							Map currCSMap = (Map)templateCSMap.get(currCSI.getCsConteIdseq());
							copyCSTree(currTemplate, currCSMap, treeNodeMap, getTemplateNode(idGen.getNewId(), currTemplate, treeFunctions), publishTemplateNode, idGen);
						}
					}
				}

				publishNode.add(publishTemplateNode);
			}
		} while(true);
		return publishNodeByContextMap;
	}

	public Map getAllClassificationNodes(TreeFunctions treeFunctions, TreeIdGenerator idGen)
			throws Exception
	{
		Map csNodeByContextMap = new HashMap();
		FormDAO dao = daoFactory.getFormDAO();
		List allCscsi = dao.getCSCSIHierarchy();
		CDEBrowserParams params = CDEBrowserParams.getInstance();
		String regStatusArr[] = params.getCsTypeRegStatus().split(",");
		Map csMap = new HashMap();
		Map csiMap = new HashMap();
		Map regStatusMapByCsId = new HashMap();
		Map csiMapByRegStatus = new HashMap();
		for(int i = 0; i < regStatusArr.length; i++)
			csiMapByRegStatus.put(regStatusArr[i], new HashMap());

		Iterator iter = allCscsi.iterator();
		do
		{
			if(!iter.hasNext())
				break;
			ClassSchemeItem cscsi = (ClassSchemeItem)iter.next();
			String csContextId = cscsi.getCsConteIdseq();
			DefaultMutableTreeNode classifcationNode = (DefaultMutableTreeNode)csNodeByContextMap.get(csContextId);
			if(classifcationNode == null)
			{
				classifcationNode = getWebNode("Classifications", idGen.getNewId());
				csNodeByContextMap.put(csContextId, classifcationNode);
				csiMap.clear();
				csMap.clear();
			}
			String csId = cscsi.getCsIdseq();
			DefaultMutableTreeNode csNode = (DefaultMutableTreeNode)csMap.get(csId);
			if(csNode == null)
			{
				csNode = getClassificationSchemeNode(idGen.getNewId(), cscsi, treeFunctions);
				classifcationNode.add(csNode);
				csMap.put(csId, csNode);
				if(cscsi.getClassSchemeType().equalsIgnoreCase(params.getRegStatusCsTree()))
				{
					Map regStatusMap = new HashMap();
					for(int i = 0; i < regStatusArr.length; i++)
					{
						DefaultMutableTreeNode regNode = getRegStatusNode(idGen.getNewId(), regStatusArr[i], csContextId, csId, treeFunctions);
						csNode.add(regNode);
						regStatusMap.put(regStatusArr[i], regNode);
					}

					regStatusMapByCsId.put(csId, regStatusMap);
				}
			}
			String parentId = cscsi.getParentCscsiId();
			DefaultMutableTreeNode parentNode = null;
			DefaultMutableTreeNode csiNode = null;
			if(!cscsi.getClassSchemeType().equalsIgnoreCase(params.getRegStatusCsTree()))
			{
				csiNode = getClassificationSchemeItemNode(idGen.getNewId(), cscsi, treeFunctions);
				if(parentId != null)
					parentNode = (DefaultMutableTreeNode)csiMap.get(parentId);
				else
					parentNode = csNode;
				parentNode.add(csiNode);
				csiMap.put(cscsi.getCsCsiIdseq(), csiNode);
			} else
				if(parentId == null)
				{
					Map regStatusNodesMap = (Map)regStatusMapByCsId.get(csId);
					for(int i = 0; i < regStatusArr.length; i++)
						if(dao.hasRegisteredAC(cscsi.getCsCsiIdseq(), regStatusArr[i]))
						{
							csiNode = getRegStatusCSINode(idGen.getNewId(), cscsi, regStatusArr[i], treeFunctions);
							((DefaultMutableTreeNode)regStatusNodesMap.get(regStatusArr[i])).add(csiNode);
							((Map)csiMapByRegStatus.get(regStatusArr[i])).put(cscsi.getCsCsiIdseq(), csiNode);
						}

				} else
				{
					for(int i = 0; i < regStatusArr.length; i++)
						if(dao.hasRegisteredAC(cscsi.getCsCsiIdseq(), regStatusArr[i]))
						{
							csiNode = getRegStatusCSINode(idGen.getNewId(), cscsi, regStatusArr[i], treeFunctions);
							((DefaultMutableTreeNode)((Map)csiMapByRegStatus.get(regStatusArr[i])).get(parentId)).add(csiNode);
							((Map)csiMapByRegStatus.get(regStatusArr[i])).put(cscsi.getCsCsiIdseq(), csiNode);
						}

				}
			if(treeFunctions.getTreeType().equals("deTree") && cscsi.getClassSchemeItemType().equals("DISEASE_TYPE") && cscsi.getClassSchemePrefName().equals("DISEASE"))
			{
				csiNode.add(getDiseaseSubNode(idGen.getNewId(), cscsi, treeFunctions, "Core Data Set"));
				csiNode.add(getDiseaseSubNode(idGen.getNewId(), cscsi, treeFunctions, "Non-Core Data Set"));
			}
		} while(true);
		return csNodeByContextMap;
	}

	private DefaultMutableTreeNode getClassificationSchemeNode(String nodeId, ClassSchemeItem csi, TreeFunctions treeFunctions)
			throws Exception
	{
		return new DefaultMutableTreeNode(new WebNode(nodeId, csi.getClassSchemeLongName(), (new StringBuilder()).append("javascript:").append(treeFunctions.getJsFunctionName()).append("('P_PARAM_TYPE=CLASSIFICATION&P_IDSEQ=").append(csi.getCsIdseq()).append("&P_CONTE_IDSEQ=").append(csi.getCsConteIdseq()).append(treeFunctions.getExtraURLParameters()).append("')").toString(), csi.getClassSchemeDefinition()));
	}

	private DefaultMutableTreeNode getClassificationSchemeItemNode(String nodeId, ClassSchemeItem csi, TreeFunctions treeFunctions)
			throws Exception
	{
		return new DefaultMutableTreeNode(new WebNode(nodeId, csi.getClassSchemeItemName(), (new StringBuilder()).append("javascript:").append(treeFunctions.getJsFunctionName()).append("('P_PARAM_TYPE=CSI&P_IDSEQ=").append(csi.getCsCsiIdseq()).append("&P_CONTE_IDSEQ=").append(csi.getCsConteIdseq()).append(treeFunctions.getExtraURLParameters()).append("')").toString(), csi.getCsiDescription()));
	}

	private DefaultMutableTreeNode getRegStatusCSINode(String nodeId, ClassSchemeItem csi, String regStatus, TreeFunctions treeFunctions)
			throws Exception
	{
		return new DefaultMutableTreeNode(new WebNode(nodeId, csi.getClassSchemeItemName(), (new StringBuilder()).append("javascript:").append(treeFunctions.getJsFunctionName()).append("('P_PARAM_TYPE=REGCSI&P_IDSEQ=").append(csi.getCsCsiIdseq()).append("&P_CONTE_IDSEQ=").append(csi.getCsConteIdseq()).append("&P_REGSTATUS=").append(regStatus).append(treeFunctions.getExtraURLParameters()).append("')").toString(), csi.getCsiDescription()));
	}

	private DefaultMutableTreeNode getContextNode(String nodeId, Context context, TreeFunctions treeFunctions)
			throws Exception
	{
		String currContextId = context.getConteIdseq();
		String name = context.getName();
		String desc = context.getDescription();
		DefaultMutableTreeNode contextNode = new DefaultMutableTreeNode(new WebNode(nodeId, (new StringBuilder()).append(name).append(" (").append(desc).append(")").toString(), (new StringBuilder()).append("javascript:").append(treeFunctions.getJsFunctionName()).append("('P_PARAM_TYPE=CONTEXT&P_IDSEQ=").append(currContextId).append("&P_CONTE_IDSEQ=").append(currContextId).append(treeFunctions.getExtraURLParameters()).append("')").toString(), (new StringBuilder()).append(desc).append(" (").append(name).append(")").toString()));
		return contextNode;
	}

	private DefaultMutableTreeNode getDiseaseSubNode(String nodeId, ClassSchemeItem csi, TreeFunctions treeFunctions, String nodeName)
			throws Exception
	{
		int firstSpace = nodeName.indexOf(" ");
		String nodeType = nodeName.substring(0, firstSpace).toUpperCase();
		return new DefaultMutableTreeNode(new WebNode(nodeId, nodeName, (new StringBuilder()).append("javascript:").append(treeFunctions.getJsFunctionName()).append("('P_PARAM_TYPE=").append(nodeType).append("&P_IDSEQ=").append(csi.getCsiIdseq()).append("&P_CONTE_IDSEQ=").append(csi.getCsConteIdseq()).append("&P_CS_CSI_IDSEQ=").append(csi.getCsCsiIdseq()).append("&diseaseName=").append(URLEncoder.encode(csi.getClassSchemeItemName())).append("&csName=").append(URLEncoder.encode(csi.getClassSchemeLongName())).append(treeFunctions.getExtraURLParameters()).append("')").toString(), nodeName));
	}

	private DefaultMutableTreeNode getFormNode(String nodeId, Form form, TreeFunctions treeFunctions, boolean showContextName)
			throws Exception
	{
		String formIdseq = form.getFormIdseq();
		String displayName = form.getLongName();
		String preferred_definition = form.getPreferredDefinition();
		String currContextId = form.getConteIdseq();
		String contextName = "";
		String formLongName = "";
		if(form.getLongName() != null)
			formLongName = URLEncoder.encode(form.getLongName());
		if(form.getContext() != null)
			contextName = form.getContext().getName();
		if(contextName != null)
			contextName = URLEncoder.encode(contextName);
		if(showContextName)
			displayName = (new StringBuilder()).append(displayName).append(" (").append(contextName).append(")").toString();
		String protocolId = "";
		DefaultMutableTreeNode formNode = new DefaultMutableTreeNode(new WebNode(nodeId, displayName, (new StringBuilder()).append("javascript:").append(treeFunctions.getFormJsFunctionName()).append("('P_PARAM_TYPE=CRF&P_IDSEQ=").append(formIdseq).append("&P_CONTE_IDSEQ=").append(currContextId).append("&P_PROTO_IDSEQ=").append(protocolId).append(treeFunctions.getExtraURLParameters()).append("')").toString(), preferred_definition));
		return formNode;
	}

	private DefaultMutableTreeNode getTemplateNode(String nodeId, Form template, TreeFunctions treeFunctions)
			throws Exception
	{
		String templateIdseq = template.getFormIdseq();
		String longName = template.getLongName();
		String preferred_definition = template.getPreferredDefinition();
		String contextName = template.getContext().getName();
		String currContextId = template.getContext().getConteIdseq();
		DefaultMutableTreeNode tmpNode = new DefaultMutableTreeNode(new WebNode(nodeId, longName, (new StringBuilder()).append("javascript:").append(treeFunctions.getFormJsFunctionName()).append("('P_PARAM_TYPE=TEMPLATE&P_IDSEQ=").append(templateIdseq).append("&P_CONTE_IDSEQ=").append(currContextId).append("&templateName=").append(URLEncoder.encode(longName)).append("&contextName=").append(URLEncoder.encode(contextName)).append(treeFunctions.getExtraURLParameters()).append("')").toString(), preferred_definition));
		return tmpNode;
	}

	private DefaultMutableTreeNode getRegStatusNode(String nodeId, String regStatus, String contextIdseq, String csIdseq, TreeFunctions treeFunctions)
			throws Exception
	{
		DefaultMutableTreeNode regStatusNode = new DefaultMutableTreeNode(new WebNode(nodeId, regStatus, (new StringBuilder()).append("javascript:").append(treeFunctions.getFormJsFunctionName()).append("('P_PARAM_TYPE=REGCS&P_IDSEQ=").append(csIdseq).append("&P_CONTE_IDSEQ=").append(contextIdseq).append("&P_REGSTATUS=").append(regStatus).append(treeFunctions.getExtraURLParameters()).append("')").toString(), regStatus));
		return regStatusNode;
	}

	private DefaultMutableTreeNode getTemplateNode(String nodeId, Form template, ClassSchemeItem csi, Context currContext, TreeFunctions treeFunctions)
			throws Exception
	{
		String templateIdseq = template.getFormIdseq();
		String longName = template.getLongName();
		String prefferedDefinition = template.getPreferredDefinition();
		DefaultMutableTreeNode tmpNode = new DefaultMutableTreeNode(new WebNode(nodeId, longName, (new StringBuilder()).append("javascript:").append(treeFunctions.getFormJsFunctionName()).append("('P_PARAM_TYPE=TEMPLATE&P_IDSEQ=").append(templateIdseq).append("&P_CONTE_IDSEQ=").append(currContext.getConteIdseq()).append("&csName=").append(URLEncoder.encode(csi.getClassSchemeLongName())).append("&diseaseName=").append(URLEncoder.encode(csi.getClassSchemeItemName())).append("&templateType=").append(URLEncoder.encode(template.getFormCategory())).append("&templateName=").append(URLEncoder.encode(longName)).append("&contextName=").append(URLEncoder.encode(currContext.getName())).append(treeFunctions.getExtraURLParameters()).append("')").toString(), prefferedDefinition));
		return tmpNode;
	}

	private DefaultMutableTreeNode getProtocolNode(String nodeId, Protocol protocol, String currContextId, TreeFunctions treeFunctions)
			throws Exception
	{
		String protoIdseq = protocol.getProtoIdseq();
		String longName = protocol.getLongName();
		String preferred_definition = protocol.getPreferredDefinition();
		DefaultMutableTreeNode protocolNode = new DefaultMutableTreeNode(new WebNode(nodeId, longName, (new StringBuilder()).append("javascript:").append(treeFunctions.getJsFunctionName()).append("('P_PARAM_TYPE=PROTOCOL&P_IDSEQ=").append(protoIdseq).append("&P_CONTE_IDSEQ=").append(currContextId).append("&protocolLongName=").append(longName).append(treeFunctions.getExtraURLParameters()).append("')").toString(), preferred_definition));
		return protocolNode;
	}

	private DefaultMutableTreeNode getWebNode(String name, String id)
	{
		return new DefaultMutableTreeNode(new WebNode(id, name));
	}

	private Map addInitialCategoryNodes(DefaultMutableTreeNode cscsiNode, String uniqueIdPrefix, List templateTypes)
	{
		if(templateTypes == null)
			return new HashMap();
		Map holderMap = new HashMap();
		String type;
		DefaultMutableTreeNode node;
		for(ListIterator it = templateTypes.listIterator(); it.hasNext(); holderMap.put(type, node))
		{
			type = (String)it.next();
			node = getWebNode(type, (new StringBuilder()).append(uniqueIdPrefix).append(type).toString());
			cscsiNode.add(node);
		}

		return holderMap;
	}

	private void addAllcscsiNodes(List cscsiList, Map cscsiMap, String contextId, DefaultMutableTreeNode csNode, List templateTypes, Map cscsiholderMap, TreeIdGenerator idGen)
	{
		if(cscsiList == null || cscsiMap == null || csNode == null || cscsiholderMap == null)
			return;
		String cscsiId;
		CsCsiCategorytHolder cscsiCatHolder;
		for(ListIterator it = cscsiList.listIterator(); it.hasNext(); cscsiholderMap.put(cscsiId, cscsiCatHolder))
		{
			cscsiId = (String)it.next();
			ClassSchemeItem cscsi = (ClassSchemeItem)cscsiMap.get(cscsiId);
			String aUniquesId = (new StringBuilder()).append(contextId).append(cscsi.getCsCsiIdseq()).append(System.currentTimeMillis()).toString();
			DefaultMutableTreeNode node = getWebNode(cscsi.getClassSchemeItemName(), aUniquesId);
			csNode.add(node);
			aUniquesId = idGen.getNewId();
			Map categoryMap = addInitialCategoryNodes(node, aUniquesId, templateTypes);
			cscsiCatHolder = new CsCsiCategorytHolder();
			cscsiCatHolder.setNode(node);
			cscsiCatHolder.setCategoryHolder(categoryMap);
		}

	}

	private Map getFormClassificationNodes(TreeFunctions treeFunctions, TreeIdGenerator idGen, String csType, String csiType)
			throws Exception
	{
		Map csiByContextMap = new HashMap();
		FormDAO dao = daoFactory.getFormDAO();
		List allCscsi = dao.getCSCSIHierarchyByType(csType, csiType);
		Map csMap = new HashMap();
		Map csiMap = new HashMap();
		ClassSchemeItem cscsi;
		DefaultMutableTreeNode csiNode;
		for(Iterator iter = allCscsi.iterator(); iter.hasNext(); csiMap.put(cscsi.getCsCsiIdseq(), csiNode))
		{
			cscsi = (ClassSchemeItem)iter.next();
			String csContextId = cscsi.getCsConteIdseq();
			Map currentCsiMap = (Map)csiByContextMap.get(csContextId);
			if(currentCsiMap == null)
			{
				csiMap = new HashMap();
				csiByContextMap.put(csContextId, csiMap);
				csMap.clear();
			}
			String csId = cscsi.getCsIdseq();
			DefaultMutableTreeNode csNode = (DefaultMutableTreeNode)csMap.get(csId);
			if(csNode == null)
			{
				csNode = getClassificationSchemeNode(idGen.getNewId(), cscsi, treeFunctions);
				csMap.put(csId, csNode);
			}
			csiNode = getClassificationSchemeItemNode(idGen.getNewId(), cscsi, treeFunctions);
			String parentId = cscsi.getParentCscsiId();
			DefaultMutableTreeNode parentNode = null;
			if(parentId != null)
				parentNode = (DefaultMutableTreeNode)csiMap.get(parentId);
			else
				parentNode = csNode;
			if(parentNode != null)
				parentNode.add(csiNode);
		}

		return csiByContextMap;
	}

	private void copyCSTree(Form currForm, Map currCSMap, Map treeNodeMap, DefaultMutableTreeNode newNode, DefaultMutableTreeNode rootNode, TreeIdGenerator idGen)
	{
		if(currCSMap == null)
		{
			rootNode.add(newNode);
		} else
		{
			DefaultMutableTreeNode cTreeNode;
			for(Iterator csIter = currForm.getClassifications().iterator(); csIter.hasNext(); rootNode.add(cTreeNode))
			{
				String cscsiId = ((ClassSchemeItem)csIter.next()).getCsCsiIdseq();
				DefaultMutableTreeNode origTreeNode = (DefaultMutableTreeNode)currCSMap.get(cscsiId);
				WebNode origWebNode = (WebNode)origTreeNode.getUserObject();
				DefaultMutableTreeNode treeNodeCopy = (DefaultMutableTreeNode)treeNodeMap.get(origWebNode.getId());
				if(treeNodeCopy == null)
				{
					treeNodeCopy = new DefaultMutableTreeNode(origWebNode.copy(idGen.getNewId()));
					treeNodeMap.put(origWebNode.getId(), treeNodeCopy);
				}
				treeNodeCopy.add(newNode);
				DefaultMutableTreeNode pTreeNode = origTreeNode;
				cTreeNode = treeNodeCopy;
				while(pTreeNode.getParent() != null) 
				{
					DefaultMutableTreeNode parentTreeNode = (DefaultMutableTreeNode)pTreeNode.getParent();
					WebNode pWebNode = (WebNode)parentTreeNode.getUserObject();
					DefaultMutableTreeNode pNodeCopy = (DefaultMutableTreeNode)treeNodeMap.get(pWebNode.getId());
					if(pNodeCopy == null)
					{
						pNodeCopy = new DefaultMutableTreeNode(pWebNode.copy(idGen.getNewId()));
						treeNodeMap.put(pWebNode.getId(), pNodeCopy);
						pNodeCopy.add(cTreeNode);
						pTreeNode = parentTreeNode;
						cTreeNode = pNodeCopy;
					} else
					{
						pNodeCopy.add(cTreeNode);
						return;
					}
				}
			}

		}
	}

	public void setDaoFactory(AbstractDAOFactoryFB daoFactory)
	{
		this.daoFactory = daoFactory;
	}

	public AbstractDAOFactoryFB getDaoFactory()
	{
		return daoFactory;
	}

	public List getAllTemplateNodesForCTEP(String currContextIdseq)
			throws Exception
	{
		List allTemplatesForCtep = new ArrayList();
		Map disCscsiHolder = new HashMap();
		Map phaseCscsiHolder = new HashMap();
		LazyActionTreeNode phaseNode = new LazyActionTreeNode("Folder", "Phase", false);
		LazyActionTreeNode diseaseNode = new LazyActionTreeNode("Folder", "Disease", false);
		allTemplatesForCtep.add(phaseNode);
		allTemplatesForCtep.add(diseaseNode);
		FormDAO dao = daoFactory.getFormDAO();
		List templateTypes = dao.getAllTemplateTypes(currContextIdseq);
		Collection csiList = dao.getCSIForContextId(currContextIdseq);
		Map cscsiMap = new HashMap();
		List phaseCsCsiList = new ArrayList();
		List diseaseCsCsiList = new ArrayList();
		Iterator iter = csiList.iterator();
		do
		{
			if(!iter.hasNext())
				break;
			CSITransferObject csiTO = (CSITransferObject)iter.next();
			cscsiMap.put(csiTO.getCsCsiIdseq(), csiTO);
			if(csiTO.getClassSchemeLongName().equals("CRF_DISEASE"))
				diseaseCsCsiList.add(csiTO.getCsCsiIdseq());
			if(csiTO.getClassSchemeLongName().equals("Phase"))
				phaseCsCsiList.add(csiTO.getCsCsiIdseq());
		} while(true);
		Collection templates = dao.getAllTemplatesForContextId(currContextIdseq);
		addAllcscsiNodes(phaseCsCsiList, cscsiMap, currContextIdseq, phaseNode, templateTypes, phaseCscsiHolder);
		addAllcscsiNodes(diseaseCsCsiList, cscsiMap, currContextIdseq, diseaseNode, templateTypes, disCscsiHolder);
		iter = templates.iterator();
		do
		{
			if(!iter.hasNext())
				break;
			Form currTemplate = (Form)iter.next();
			Collection csColl = currTemplate.getClassifications();
			String currCsCsiIdseq = null;
			Iterator csIter = csColl.iterator();
			if(csIter.hasNext())
			{
				ClassSchemeItem currCsi = (ClassSchemeItem)csIter.next();
				currCsCsiIdseq = currCsi.getCsCsiIdseq();
			}
			String currCategory = currTemplate.getFormCategory();
			if(currCategory != null && !currCategory.equals("") && currCsCsiIdseq != null)
			{
				ClassSchemeItem currcscsi = (ClassSchemeItem)cscsiMap.get(currCsCsiIdseq);
				if(currcscsi != null)
					if(phaseCsCsiList.contains(currCsCsiIdseq))
					{
						CsCSICatetegoryHolder cscsiCategoryHolder = (CsCSICatetegoryHolder)phaseCscsiHolder.get(currCsCsiIdseq);
						Map categoryHolder = cscsiCategoryHolder.getCategoryHolder();
						LazyActionTreeNode categoryNode = (LazyActionTreeNode)categoryHolder.get(currCategory);
						LazyActionTreeNode templateNode = getTemplateNode(currTemplate, currcscsi, currContextIdseq, "CTEP");
						categoryNode.addLeaf(templateNode);
					} else
						if(diseaseCsCsiList.contains(currCsCsiIdseq))
						{
							CsCSICatetegoryHolder cscsiCategoryHolder = (CsCSICatetegoryHolder)disCscsiHolder.get(currCsCsiIdseq);
							Map categoryHolder = cscsiCategoryHolder.getCategoryHolder();
							LazyActionTreeNode categoryNode = (LazyActionTreeNode)categoryHolder.get(currCategory);
							LazyActionTreeNode templateNode = getTemplateNode(currTemplate, currcscsi, currContextIdseq, "CTEP");
							categoryNode.addLeaf(templateNode);
						}
			}
		} while(true);
		return allTemplatesForCtep;
	}

	private void addAllcscsiNodes(List cscsiList, Map cscsiMap, String contextId, LazyActionTreeNode csNode, List templateTypes, Map cscsiholderMap)
	{
		if(cscsiList == null || cscsiMap == null || csNode == null || cscsiholderMap == null)
			return;
		String cscsiId;
		CsCSICatetegoryHolder cscsiCatHolder;
		for(ListIterator it = cscsiList.listIterator(); it.hasNext(); cscsiholderMap.put(cscsiId, cscsiCatHolder))
		{
			cscsiId = (String)it.next();
			ClassSchemeItem cscsi = (ClassSchemeItem)cscsiMap.get(cscsiId);
			LazyActionTreeNode node = new LazyActionTreeNode("Folder", cscsi.getClassSchemeItemName(), false);
			csNode.addLeaf(node);
			Map categoryMap = addInitialCategoryNodes(node, templateTypes);
			cscsiCatHolder = new CsCSICatetegoryHolder();
			cscsiCatHolder.setNode(node);
			cscsiCatHolder.setCategoryHolder(categoryMap);
		}

	}

	private Map addInitialCategoryNodes(LazyActionTreeNode cscsiNode, List templateTypes)
	{
		if(templateTypes == null)
			return new HashMap();
		Map holderMap = new HashMap();
		String type;
		LazyActionTreeNode node;
		for(ListIterator it = templateTypes.listIterator(); it.hasNext(); holderMap.put(type, node))
		{
			type = (String)it.next();
			node = new LazyActionTreeNode("Folder", type, false);
			cscsiNode.addLeaf(node);
		}

		return holderMap;
	}

	private LazyActionTreeNode getTemplateNode(Form template, ClassSchemeItem csi, String contextIdseq, String contextName)
			throws Exception
	{
		String templateIdseq = template.getFormIdseq();
		String longName = template.getLongName();
		LazyActionTreeNode tmpNode = new LazyActionTreeNode("Template", longName, (new StringBuilder()).append("javascript:performFormAction('P_PARAM_TYPE=TEMPLATE&P_IDSEQ=").append(templateIdseq).append("&P_CONTE_IDSEQ=").append(contextIdseq).append("&csName=").append(URLEncoder.encode(csi.getClassSchemeLongName())).append("&diseaseName=").append(URLEncoder.encode(csi.getClassSchemeItemName())).append("&templateType=").append(URLEncoder.encode(template.getFormCategory())).append("&templateName=").append(URLEncoder.encode(longName)).append("&contextName=").append(URLEncoder.encode(contextName)).append(StringEscapeUtils.escapeHtml("&PageId=DataElementsGroup&NOT_FIRST_DISPLAY=1&performQuery=yes&")).append(csi.getClassSchemeItemName()).append(">>").append(longName).append("')").toString(), templateIdseq, true);
		return tmpNode;
	}

	public void addClassificationNode(LazyActionTreeNode pNode, String contextId)
			throws Exception
	{
		CDEBrowserParams params = CDEBrowserParams.getInstance();
		ClassificationSchemeDAO csDao = daoFactory.getClassificationSchemeDAO();
		Collection rootCS = csDao.getRootClassificationSchemes(contextId);
		for(Iterator csIter = rootCS.iterator(); csIter.hasNext();)
		{
			ClassificationScheme cs = (ClassificationScheme)csIter.next();
			if(cs.getClassSchemeType().equalsIgnoreCase(params.getRegStatusCsTree()))
			{
				ClassSchemeNode csNode = getClassificationSchemeNode(cs);
				pNode.addChild(csNode);
				String regStatusArr[] = params.getCsTypeRegStatus().split(",");
				for(int i = 0; i < regStatusArr.length; i++)
				{
					ClassSchemeRegStatusNode regNode = getRegStatusNode(regStatusArr[i], contextId, cs.getCsIdseq());
					csNode.addChild(regNode);
					regNode.setLoaded(false);
					regNode.setExpanded(false);
				}

				csNode.setLoaded(false);
				csNode.setExpanded(false);
			} else
				if(cs.getClassSchemeType().equalsIgnoreCase(params.getCsTypeContainer()))
					pNode.addChild(getClassificationSchemeContainerNode(cs));
				else
					pNode.addChild(getClassificationSchemeNode(cs));
		}

	}

	public void loadCSContainerNodes(ClassSchemeContainerNode pNode, String csId)
			throws Exception
	{
		CDEBrowserParams params = CDEBrowserParams.getInstance();
		ClassificationSchemeDAO csDao = daoFactory.getClassificationSchemeDAO();
		Collection childrenCS = csDao.getChildrenClassificationSchemes(csId);
		for(Iterator cIter = childrenCS.iterator(); cIter.hasNext();)
		{
			ClassificationScheme cs = (ClassificationScheme)cIter.next();
			if(cs.getClassSchemeType().equalsIgnoreCase(params.getCsTypeContainer()))
				pNode.addChild(getClassificationSchemeContainerNode(cs));
			else
				pNode.addChild(getClassificationSchemeNode(cs));
		}

	}

	public void loadCSNodes(ClassSchemeNode pNode, String csId)
			throws Exception
	{
		ClassificationSchemeDAO csDao = daoFactory.getClassificationSchemeDAO();
		List allCscsi = csDao.getFirstLevelCSIByCS(csId);
		Iterator iter = allCscsi.iterator();
		do
		{
			if(!iter.hasNext())
				break;
			ClassSchemeItem cscsi = (ClassSchemeItem)iter.next();
			ClassSchemeItemNode csiNode = getClassificationSchemeItemNode(cscsi);
			pNode.addChild(csiNode);
			if(cscsi.getClassSchemeItemType().equals("DISEASE_TYPE") && cscsi.getClassSchemePrefName().equals("DISEASE"))
			{
				csiNode.addChild(getDiseaseSubNode(cscsi, "Core Data Set"));
				csiNode.addChild(getDiseaseSubNode(cscsi, "Non-Core Data Set"));
				csiNode.setLoaded(false);
				csiNode.setExpanded(false);
			}
		} while(true);
	}

	public void loadRegStatusCSNodes(LazyActionTreeNode pNode)
			throws Exception
	{
		String csId = pNode.getIdentifier();
		ClassificationSchemeDAO csDao = daoFactory.getClassificationSchemeDAO();
		List allCscsi = csDao.getFirstLevelCSIByCS(csId);
		Iterator iter = allCscsi.iterator();
		do
		{
			if(!iter.hasNext())
				break;
			ClassSchemeItem cscsi = (ClassSchemeItem)iter.next();
			if(csDao.hasRegisteredAC(cscsi.getCsCsiIdseq(), pNode.getDescription()))
			{
				CSIRegStatusNode csiNode = getRegStatusCSINode(cscsi, pNode.getDescription());
				pNode.addChild(csiNode);
			}
		} while(true);
	}

	public void loadCSINodes(ClassSchemeItemNode pNode)
			throws Exception
	{
		String csiId = pNode.getIdentifier();
		ClassificationSchemeDAO csDao = daoFactory.getClassificationSchemeDAO();
		List allCscsi = csDao.getChildrenCSI(csiId);
		ClassSchemeItemNode csiNode;
		for(Iterator iter = allCscsi.iterator(); iter.hasNext(); pNode.addChild(csiNode))
		{
			ClassSchemeItem cscsi = (ClassSchemeItem)iter.next();
			csiNode = getClassificationSchemeItemNode(cscsi);
		}

	}

	public void loadCSIRegStatusNodes(CSIRegStatusNode pNode)
			throws Exception
	{
		String csiId = pNode.getIdentifier();
		ClassificationSchemeDAO csDao = daoFactory.getClassificationSchemeDAO();
		List allCscsi = csDao.getChildrenCSI(csiId);
		CSIRegStatusNode csiNode;
		for(Iterator iter = allCscsi.iterator(); iter.hasNext(); pNode.addChild(csiNode))
		{
			ClassSchemeItem cscsi = (ClassSchemeItem)iter.next();
			csiNode = getRegStatusCSINode(cscsi, pNode.getToolTip());
		}

	}

	private LazyActionTreeNode getClassificationSchemeNode(ClassSchemeItem csi)
			throws Exception
	{
		String extraURLParameters = StringEscapeUtils.escapeHtml("&PageId=DataElementsGroup&NOT_FIRST_DISPLAY=1&performQuery=yes");
		LazyActionTreeNode csNode = new LazyActionTreeNode("Classifications", csi.getClassSchemeLongName(), (new StringBuilder()).append("javascript:performAction('P_PARAM_TYPE=CLASSIFICATION&P_IDSEQ=").append(csi.getCsIdseq()).append("&P_CONTE_IDSEQ=").append(csi.getCsConteIdseq()).append(extraURLParameters).append("')").toString(), csi.getCsiIdseq(), false);
		csNode.setToolTip(csi.getClassSchemeDefinition());
		return csNode;
	}

	private ClassSchemeNode getClassificationSchemeNode(ClassificationScheme cs)
			throws Exception
	{
		String extraURLParameters = StringEscapeUtils.escapeHtml("&PageId=DataElementsGroup&NOT_FIRST_DISPLAY=1&performQuery=yes");
		ClassSchemeNode csNode = new ClassSchemeNode("Classifications", cs.getLongName(), (new StringBuilder()).append("javascript:performAction('P_PARAM_TYPE=CLASSIFICATION&P_IDSEQ=").append(cs.getCsIdseq()).append("&P_CONTE_IDSEQ=").append(cs.getConteIdseq()).append(extraURLParameters).append("')").toString(), cs.getCsIdseq(), false);
		csNode.setToolTip(cs.getPreferredDefinition());
		return csNode;
	}

	private ClassSchemeContainerNode getClassificationSchemeContainerNode(ClassificationScheme cs)
			throws Exception
	{
		String extraURLParameters = StringEscapeUtils.escapeHtml("&PageId=DataElementsGroup&NOT_FIRST_DISPLAY=1&performQuery=yes");
		ClassSchemeContainerNode csNode = new ClassSchemeContainerNode("Container", cs.getLongName(), (new StringBuilder()).append("javascript:performAction('P_PARAM_TYPE=CSCONTAINER&P_IDSEQ=").append(cs.getCsIdseq()).append("&P_CONTE_IDSEQ=").append(cs.getConteIdseq()).append(extraURLParameters).append("')").toString(), cs.getCsIdseq(), false);
		csNode.setToolTip(cs.getPreferredDefinition());
		return csNode;
	}

	private ClassSchemeRegStatusNode getRegStatusNode(String regStatus, String contextIdseq, String csIdseq)
			throws Exception
	{
		String extraURLParameters = StringEscapeUtils.escapeHtml("&PageId=DataElementsGroup&NOT_FIRST_DISPLAY=1&performQuery=yes");
		ClassSchemeRegStatusNode regStatusNode = new ClassSchemeRegStatusNode("Registration Status", regStatus, (new StringBuilder()).append("javascript:performAction('P_PARAM_TYPE=REGCS&P_IDSEQ=").append(csIdseq).append("&P_CONTE_IDSEQ=").append(contextIdseq).append("&P_REGSTATUS=").append(regStatus).append(extraURLParameters).append("')").toString(), csIdseq, false);
		return regStatusNode;
	}

	private ClassSchemeItemNode getClassificationSchemeItemNode(ClassSchemeItem csi)
			throws Exception
	{
		String extraURLParameters = StringEscapeUtils.escapeHtml("&PageId=DataElementsGroup&NOT_FIRST_DISPLAY=1&performQuery=yes");
		ClassSchemeItemNode csiNode = new ClassSchemeItemNode("Classification Scheme Item", csi.getClassSchemeItemName(), (new StringBuilder()).append("javascript:performAction('P_PARAM_TYPE=CSI&P_IDSEQ=").append(csi.getCsCsiIdseq()).append("&P_CONTE_IDSEQ=").append(csi.getCsConteIdseq()).append(extraURLParameters).append("')").toString(), csi.getCsCsiIdseq(), false);
		csiNode.setToolTip(csi.getCsiDescription());
		return csiNode;
	}

	private CSIRegStatusNode getRegStatusCSINode(ClassSchemeItem csi, String regStatus)
			throws Exception
	{
		String extraURLParameters = StringEscapeUtils.escapeHtml("&PageId=DataElementsGroup&NOT_FIRST_DISPLAY=1&performQuery=yes");
		CSIRegStatusNode csiRSNode = new CSIRegStatusNode("Classification Scheme Item", csi.getClassSchemeItemName(), (new StringBuilder()).append("javascript:performAction('P_PARAM_TYPE=REGCSI&P_IDSEQ=").append(csi.getCsCsiIdseq()).append("&P_CONTE_IDSEQ=").append(csi.getCsConteIdseq()).append("&P_REGSTATUS=").append(regStatus).append(extraURLParameters).append("')").toString(), csi.getCsCsiIdseq(), false);
		csiRSNode.setToolTip(regStatus);
		return csiRSNode;
	}

	private LazyActionTreeNode getDiseaseSubNode(ClassSchemeItem csi, String nodeName)
			throws Exception
	{
		int firstSpace = nodeName.indexOf(" ");
		String extraURLParameters = StringEscapeUtils.escapeHtml("&PageId=DataElementsGroup&NOT_FIRST_DISPLAY=1&performQuery=yes");
		String nodeType = nodeName.substring(0, firstSpace).toUpperCase();
		return new LazyActionTreeNode("Classification Scheme Item", nodeName, (new StringBuilder()).append("javascript:performAction('P_PARAM_TYPE=").append(nodeType).append("&P_IDSEQ=").append(csi.getCsiIdseq()).append("&P_CONTE_IDSEQ=").append(csi.getCsConteIdseq()).append("&P_CS_CSI_IDSEQ=").append(csi.getCsCsiIdseq()).append("&diseaseName=").append(URLEncoder.encode(csi.getClassSchemeItemName())).append("&csName=").append(URLEncoder.encode(csi.getClassSchemeLongName())).append(extraURLParameters).append("')").toString(), false);
	}

	public void addProtocolNodes(LazyActionTreeNode pNode, String contextIdseq)
			throws Exception
	{
		Map cSMap = null;
		Map treeNodeMap = new HashMap();
		FormDAO dao = daoFactory.getFormDAO();
		List forms = dao.getFormsOrderByProtocol(contextIdseq);
		if(forms == null || forms.size() == 0)
			return;
		Map protocolHolder = new HashMap();
		Iterator iter = forms.iterator();
		do
		{
			if(!iter.hasNext())
				break;
			Form currForm = (Form)iter.next();
			String currProtoIdSeq = null;
			if(currForm.getProtocols() != null && currForm.getProtocols().size() > 0)
				currProtoIdSeq = ((Protocol)currForm.getProtocols().get(0)).getProtoIdseq();
			LazyActionTreeNode formNode = getFormNode(currForm, false);
			if(currProtoIdSeq != null && !currProtoIdSeq.equals(""))
			{
				LazyActionTreeNode protoNode = (LazyActionTreeNode)protocolHolder.get(currProtoIdSeq);
				if(protoNode == null)
				{
					protoNode = getProtocolNode((Protocol)currForm.getProtocols().get(0), contextIdseq);
					pNode.addChild(protoNode);
					protocolHolder.put(currProtoIdSeq, protoNode);
					treeNodeMap.clear();
				}
				if(currForm.getClassifications() == null || currForm.getClassifications().size() == 0)
				{
					protoNode.addLeaf(formNode);
					protoNode.addChild(formNode);
					protoNode.setLoaded(false);
					protoNode.setExpanded(false);
				} else
					if(cSMap == null)
						cSMap = getFormClassificationNodesByContext("FOLDER", "Form Type", contextIdseq);
			}
		} while(true);
	}

	private Map getFormClassificationNodesByContext(String csType, String csiType, String contextId)
			throws Exception
	{
		FormDAO dao = daoFactory.getFormDAO();
		List allCscsi = dao.getCSCSIHierarchyByTypeAndContext(csType, csiType, contextId);
		Map csMap = new HashMap();
		Map csiMap = new HashMap();
		ClassSchemeItem cscsi;
		LazyActionTreeNode csiNode;
		for(Iterator iter = allCscsi.iterator(); iter.hasNext(); csiMap.put(cscsi.getCsCsiIdseq(), csiNode))
		{
			cscsi = (ClassSchemeItem)iter.next();
			String csId = cscsi.getCsIdseq();
			LazyActionTreeNode csNode = (LazyActionTreeNode)csMap.get(csId);
			if(csNode == null)
			{
				csNode = getClassificationSchemeNode(cscsi);
				csMap.put(csId, csNode);
			}
			csiNode = getClassificationSchemeItemNode(cscsi);
			String parentId = cscsi.getParentCscsiId();
			LazyActionTreeNode parentNode = null;
			if(parentId != null)
				parentNode = (LazyActionTreeNode)csiMap.get(parentId);
			else
				parentNode = csNode;
			if(parentNode != null)
			{
				parentNode.addChild(csiNode);
				parentNode.setLoaded(false);
				parentNode.setExpanded(false);
			}
		}

		return csiMap;
	}

	private LazyActionTreeNode getFormNode(Form form, boolean showContextName)
			throws Exception
	{
		String formIdseq = form.getFormIdseq();
		String extraURLParameters = StringEscapeUtils.escapeHtml("&PageId=DataElementsGroup&NOT_FIRST_DISPLAY=1&performQuery=yes");
		String displayName = form.getLongName();
		String preferred_definition = form.getPreferredDefinition();
		String currContextId = form.getConteIdseq();
		String contextName = "";
		String formLongName = "";
		if(form.getLongName() != null)
			formLongName = URLEncoder.encode(form.getLongName());
		if(form.getContext() != null)
			contextName = form.getContext().getName();
		if(contextName != null)
			contextName = URLEncoder.encode(contextName);
		if(showContextName)
			displayName = (new StringBuilder()).append(displayName).append(" (").append(contextName).append(")").toString();
		String protocolId = "";
		LazyActionTreeNode formNode = new LazyActionTreeNode("Form", displayName, (new StringBuilder()).append("javascript:performFormAction('P_PARAM_TYPE=CRF&P_IDSEQ=").append(formIdseq).append("&P_CONTE_IDSEQ=").append(currContextId).append("&P_PROTO_IDSEQ=").append(protocolId).append(extraURLParameters).append("')").toString(), true);
		return formNode;
	}

	private LazyActionTreeNode getProtocolNode(Protocol protocol, String contextId)
			throws Exception
	{
		String protoIdseq = protocol.getProtoIdseq();
		String extraURLParameters = StringEscapeUtils.escapeHtml("&PageId=DataElementsGroup&NOT_FIRST_DISPLAY=1&performQuery=yes");
		String longName = protocol.getLongName();
		LazyActionTreeNode protocolNode = new LazyActionTreeNode("Protocol", longName, (new StringBuilder()).append("javascript:performAction('P_PARAM_TYPE=PROTOCOL&P_IDSEQ=").append(protoIdseq).append("&P_CONTE_IDSEQ=").append(contextId).append("&protocolLongName=").append(longName).append(extraURLParameters).append("')").toString(), protoIdseq, false);
		return protocolNode;
	}

	private ProtocolFormNode getLazyProtocolNode(Protocol protocol, String contextId)
			throws Exception
	{
		String protoIdseq = protocol.getProtoIdseq();
		String extraURLParameters = StringEscapeUtils.escapeHtml("&PageId=DataElementsGroup&NOT_FIRST_DISPLAY=1&performQuery=yes");
		String longName = protocol.getLongName();
		ProtocolFormNode protocolNode = new ProtocolFormNode("Protocol", longName, (new StringBuilder()).append("javascript:performAction('P_PARAM_TYPE=PROTOCOL&P_IDSEQ=").append(protoIdseq).append("&P_CONTE_IDSEQ=").append(contextId).append("&protocolLongName=").append(longName).append(extraURLParameters).append("')").toString(), false);
		protocolNode.setIdentifier(protoIdseq);
		return protocolNode;
	}

	public void addPublishedFormbyAlphaNode(LazyActionTreeNode pNode, String contextId)
			throws Exception
	{
		FormDAO dao = daoFactory.getFormDAO();
		List publishedForms = dao.getAllPublishedForms(contextId);
		Form currForm;
		for(Iterator formsIt = publishedForms.iterator(); formsIt.hasNext(); pNode.addLeaf(getFormNode(currForm, true)))
			currForm = (Form)formsIt.next();

	}

	public void addPublishedFormbyProtocolNode(LazyActionTreeNode pNode, String contextId)
			throws Exception
	{
		FormDAO dao = daoFactory.getFormDAO();
		List publishedProtocols = null;
		publishedProtocols = dao.getAllProtocolsForPublishedForms(contextId);
		Protocol currProto;
		for(Iterator protocolIt = publishedProtocols.iterator(); protocolIt.hasNext(); pNode.addLeaf(getLazyProtocolNode(currProto, contextId)))
			currProto = (Protocol)protocolIt.next();

	}

	public void addPublishedFormNodesByProtocol(LazyActionTreeNode pNode, String protocolId)
			throws Exception
	{
		FormDAO dao = daoFactory.getFormDAO();
		List formsForProtocol = dao.getAllPublishedFormsForProtocol(protocolId);
		Form currForm;
		for(Iterator formIt = formsForProtocol.iterator(); formIt.hasNext(); pNode.addLeaf(getFormNode(currForm, true)))
			currForm = (Form)formIt.next();

	}

	public void addPublishedTemplates(LazyActionTreeNode pNode, String contextId)
			throws Exception
	{
		FormDAO dao = daoFactory.getFormDAO();
		List publishedTemplates = dao.getAllPublishedTemplates(contextId);
		Form currTemplate;
		for(Iterator templateIt = publishedTemplates.iterator(); templateIt.hasNext(); pNode.addLeaf(getTemplateNode(currTemplate, contextId)))
			currTemplate = (Form)templateIt.next();

	}

	private LazyActionTreeNode getTemplateNode(Form template, String contextIdseq)
			throws Exception
	{
		String templateIdseq = template.getFormIdseq();
		String extraURLParameters = StringEscapeUtils.escapeHtml("&PageId=DataElementsGroup&NOT_FIRST_DISPLAY=1&performQuery=yes");
		String currContextId = template.getConteIdseq();
		String contextName = "";
		String templateLongName = "";
		if(template.getLongName() != null)
			templateLongName = URLEncoder.encode(template.getLongName());
		if(template.getContext() != null)
			contextName = template.getContext().getName();
		if(contextName != null)
			contextName = URLEncoder.encode(contextName);
		String displayName = (new StringBuilder()).append(templateLongName).append(" (").append(contextName).append(")").toString();
		LazyActionTreeNode tmpNode = new LazyActionTreeNode("Template", template.getLongName(), (new StringBuilder()).append("javascript:performFormAction('P_PARAM_TYPE=TEMPLATE&P_IDSEQ=").append(templateIdseq).append("&P_CONTE_IDSEQ=").append(template.getConteIdseq()).append("&templateName=").append(templateLongName).append("&contextName=").append(contextName).append(extraURLParameters).append("')").toString(), templateIdseq, true);
		return tmpNode;
	}
}
