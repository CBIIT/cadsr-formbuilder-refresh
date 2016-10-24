package gov.nih.nci.cadsr.manager;

import java.util.Collection;
import java.util.List;
import gov.nih.nci.cadsr.model.Tree;
import gov.nih.nci.ncicb.cadsr.common.resource.ClassSchemeItem;
import gov.nih.nci.ncicb.cadsr.common.resource.ClassificationScheme;

public interface ClassificationManager {

	public List<ClassSchemeItem> getClassification(String keyword);

	public Collection<ClassificationScheme> getRootClassificationSchemes(String conteIdseq);

	public Tree getTree();

}
