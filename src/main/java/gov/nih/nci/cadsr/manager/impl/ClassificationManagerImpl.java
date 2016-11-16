package gov.nih.nci.cadsr.manager.impl;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import gov.nih.nci.cadsr.dao.ClassificationTrDao;
import gov.nih.nci.cadsr.manager.ClassificationManager;
import gov.nih.nci.cadsr.manager.ContextsManager;
import gov.nih.nci.cadsr.model.Tree;
import gov.nih.nci.cadsr.model.TreeClassification;
import gov.nih.nci.cadsr.model.TreeContext;
import gov.nih.nci.ncicb.cadsr.common.dto.ContextTransferObject;
import gov.nih.nci.ncicb.cadsr.common.persistence.dao.AbstractDAOFactoryFB;
import gov.nih.nci.ncicb.cadsr.common.resource.ClassSchemeItem;
import gov.nih.nci.ncicb.cadsr.common.resource.ClassificationScheme;

@Service
public class ClassificationManagerImpl implements ClassificationManager {
	@Autowired
	private ClassificationTrDao classificationTrDao;
    
	@Autowired
	AbstractDAOFactoryFB daoFactory;
	
	@Autowired
	ContextsManager contextsManager;

	@Override
	public List<ClassSchemeItem> getClassification(String keyword) {

		return classificationTrDao.getClassification(keyword);
	}

	@Override
	public Collection<ClassificationScheme> getRootClassificationSchemes(String conteIdseq) {
		return daoFactory.getClassificationSchemeDAO().getRootClassificationSchemes(conteIdseq);

	}

	public Tree getTree() {
		String test = "'Training','TEST'";

		Tree tree = new Tree();
		List<TreeContext> TreeContexts = new ArrayList<>();

		List<ContextTransferObject> contexts = (List<ContextTransferObject>) contextsManager
				.getAllContextsExcludeTest(test);
		for (ContextTransferObject context : contexts) {

			TreeContext treeContext = new TreeContext();
			List<TreeClassification> treeClassifications = new ArrayList<TreeClassification>();

			if (context != null) {

				Collection<ClassificationScheme> classifications = daoFactory.getClassificationSchemeDAO()
						.getRootClassificationSchemes(context.getConteIdseq());

				for (ClassificationScheme classificationScheme : classifications) {
					if (classificationScheme != null) {
						TreeClassification treeClassification = new TreeClassification(
								classificationScheme.getPreferredName(), classificationScheme.getCsIdseq());
						treeClassifications.add(treeClassification);
					}
				}
			}

			treeContext.setTreeClassification(treeClassifications);
			treeContext.setConteIdseq(context.getConteIdseq());
			treeContext.setDescription(context.getDescription());
			treeContext.setName(context.getName());
			TreeContexts.add(treeContext);
		}

		tree.setTreeContext(TreeContexts);
		return tree;

	}
}
