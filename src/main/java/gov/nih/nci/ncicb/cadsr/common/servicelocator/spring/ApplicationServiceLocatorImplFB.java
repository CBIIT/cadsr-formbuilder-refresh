package gov.nih.nci.ncicb.cadsr.common.servicelocator.spring;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import gov.nih.nci.ncicb.cadsr.common.cdebrowser.service.CDEBrowserService;
import gov.nih.nci.ncicb.cadsr.common.formbuilder.service.LockingService;
import gov.nih.nci.ncicb.cadsr.common.ocbrowser.service.OCBrowserService;
import gov.nih.nci.ncicb.cadsr.common.servicelocator.ApplicationServiceLocator;
import gov.nih.nci.ncicb.cadsr.common.servicelocator.ServiceLocatorException;
import gov.nih.nci.ncicb.cadsr.contexttree.service.CDEBrowserTreeService;

@Component("appServiceLocator")
public class ApplicationServiceLocatorImplFB implements ApplicationServiceLocator
{
	private OCBrowserService ocBrowserService;
	
	@Autowired
    private CDEBrowserTreeService treeService;
	
	@Autowired
    private CDEBrowserService cDEBrowserService;
    
    private LockingService lockingService;
    
    public ApplicationServiceLocatorImplFB()
    {
        ocBrowserService = null;
        //treeService = null;
        //cdebrowserService = null;
        lockingService = null;
    }

    public OCBrowserService findOCBrowserService()
        throws ServiceLocatorException
    {
        if(ocBrowserService == null)
            try
            {
                Object obj = (new SpringObjectLocatorImpl()).findObject("OCBrowserService");
                ocBrowserService = (OCBrowserService)(OCBrowserService)obj;
            }
            catch(Exception e)
            {
                throw new ServiceLocatorException("Exp while locating oc serice", e);
            }
        return ocBrowserService;
    }

    public CDEBrowserTreeService findTreeService() throws ServiceLocatorException
    {
       /* if(treeService == null)
            try
            {
                Object obj = (new SpringObjectLocatorImpl()).findObject("treeService");
                treeService = (CDEBrowserTreeService)(CDEBrowserTreeService)obj;
            }
            catch(Exception e)
            {
                throw new ServiceLocatorException("Exp while locating tree serice", e);
            }
        return treeService;*/
    	
    	return getTreeService();
    }

    public CDEBrowserService findCDEBrowserService()
        throws ServiceLocatorException
    {
/*        if(cDEBrowserService == null)
            try
            {
                Object obj = (new SpringObjectLocatorImpl()).findObject("CDEBrowserService");
                cDEBrowserService = (CDEBrowserService)(CDEBrowserService)obj;
            }
            catch(Exception e)
            {
                throw new ServiceLocatorException("Exp while locating cdebrowserService service", e);
            }
        return cDEBrowserService;*/
    	
    	return getCDEBrowserService();
    }

    public LockingService findLockingService()
        throws ServiceLocatorException
    {
        if(lockingService == null)
            try
            {
                Object obj = (new SpringObjectLocatorImpl()).findObject("lockingService");
                lockingService = (LockingService)(LockingService)obj;
            }
            catch(Exception e)
            {
                throw new ServiceLocatorException("Exp while locating lockingService ", e);
            }
        return lockingService;
    }

	public CDEBrowserTreeService getTreeService() {
		return treeService;
	}

	public void setTreeService(CDEBrowserTreeService treeService) {
		this.treeService = treeService;
	}

	public CDEBrowserService getCDEBrowserService() {
		return cDEBrowserService;
	}

	public void setCDEBrowserService(CDEBrowserService cDEBrowserService) {
		this.cDEBrowserService = cDEBrowserService;
	}
    
}
