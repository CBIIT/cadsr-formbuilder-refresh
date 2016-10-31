package gov.nih.nci.ncicb.cadsr.formbuilder.struts.actions;

import java.io.IOException;
import java.sql.SQLException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;
import org.apache.struts.action.DynaActionForm;

import gov.nih.nci.ncicb.cadsr.common.cdebrowser.DataElementSearchBean;
import gov.nih.nci.ncicb.cadsr.common.util.CDEBrowserParams;
import gov.nih.nci.ncicb.cadsr.common.util.SessionHelper;


public class FormSearchPrefAction
 extends FormBuilderBaseDispatchAction {



 /**
 *
 *
 * @param mapping The ActionMapping used to select this instance.
 * @param form The optional ActionForm bean for this request.
 * @param request The HTTP Request we are processing.
 * @param response The HTTP Response we are processing.
 *
 * @return
 *
 * @throws IOException
 * @throws ServletException
 */
 public ActionForward gotoFormSearchPref(ActionMapping mapping, ActionForm form, HttpServletRequest request,
                                          HttpServletResponse response) throws IOException, ServletException {
    DynaActionForm prefForm = (DynaActionForm)form;
    
    DataElementSearchBean searchBean  = (DataElementSearchBean)getSessionObject(request,"desb");
    if (searchBean == null)
    	searchBean = this.initSearchPreferences(request);   	

    prefForm.set("excludeTestContext", new Boolean(searchBean.isExcludeTestContext()).toString());
    prefForm.set("excludeTrainingContext", new Boolean(searchBean.isExcludeTrainingContext()).toString());
    prefForm.set("isPreferencesDefault", new Boolean(isPreferencesDefault(searchBean)).toString());
    
    return mapping.findForward("prefPage");
 }

 /**
  *
  *
  * @param mapping The ActionMapping used to select this instance.
  * @param form The optional ActionForm bean for this request.
  * @param request The HTTP Request we are processing.
  * @param response The HTTP Response we are processing.
  *
  * @return
  *
  * @throws IOException
  * @throws ServletException
  */
 public ActionForward saveFormSearchPref(ActionMapping mapping, ActionForm form, HttpServletRequest request,
                                               HttpServletResponse response) throws IOException, ServletException {
     try{
        DynaActionForm prefForm = (DynaActionForm)form;
        
        String excludeTestContext = (String)prefForm.get("excludeTestContext");
        String excludeTrainingContext = (String)prefForm.get("excludeTrainingContext");
        
        DataElementSearchBean searchBean  = (DataElementSearchBean)getSessionObject(request,"desb");
        if(excludeTestContext.equals("true"))
        {
            searchBean.setExcludeTestContext(true);
            prefForm.set("excludeTestContext","true");
        }
        else
        {
            searchBean.setExcludeTestContext(false);
            prefForm.set("excludeTestContext","false");
        }
        
        if(excludeTrainingContext.equals("true"))
        {
            searchBean.setExcludeTrainingContext(true);
            prefForm.set("excludeTrainingContext","true");
        }
        else
        {
            searchBean.setExcludeTrainingContext(false);
            prefForm.set("excludeTrainingContext","false");
        }
        
        prefForm.set("isPreferencesDefault",new Boolean(isPreferencesDefault(searchBean)).toString());
        setSessionObject(request,"desb", searchBean);
        SessionHelper.putValue(request,"desb",searchBean);
        this.getExcludedContexts(request, searchBean);
        setSessionObject(request,TREE_REFRESH_INDICATOR,YES,true);
    }
    catch(Exception exp)
    {
    //Add message later
        saveMessage("cadsr.cdebrowser.cde.search.pref.save.error", request);
        return mapping.findForward("prefPage");
    }
    
    //saveMessage("cadsr.cdebrowser.cde.search.pref.save.success", request);
    return mapping.findForward("searchPage");
 }

	 /**
	*
	*
	* @param mapping The ActionMapping used to select this instance.
	* @param form The optional ActionForm bean for this request.
	* @param request The HTTP Request we are processing.
	* @param response The HTTP Response we are processing.
	*
	* @return
	*
	* @throws IOException
	* @throws ServletException
	*/
	 public ActionForward cancelFormSearchPref(ActionMapping mapping, ActionForm form, HttpServletRequest request,
	                                     HttpServletResponse response) throws IOException, ServletException {
	                                     
	  setSessionObject(request,TREE_REFRESH_INDICATOR,YES,true);
	  return mapping.findForward("searchPage");
	 }
	

	 /**
	*
	*
	* @param mapping The ActionMapping used to select this instance.
	* @param form The optional ActionForm bean for this request.
	* @param request The HTTP Request we are processing.
	* @param response The HTTP Response we are processing.
	*
	* @return
	*
	* @throws IOException
	* @throws ServletException
	*/
	 public ActionForward setDefaultFormSearchPref(ActionMapping mapping, ActionForm form, HttpServletRequest request,
	                                     HttpServletResponse response) throws IOException, ServletException {
	                                     
		  DynaActionForm prefForm = (DynaActionForm)form;
		  DataElementSearchBean searchBean  = (DataElementSearchBean)getSessionObject(request,"desb");
		  
		  try{
		      searchBean.initSearchPreferences();
		  }
		  catch(Exception exp)
		  {
		      saveMessage("cadsr.cdebrowser.cde.search.pref.default.error", request);
		      return mapping.findForward("prefPage");
		  }
		  prefForm.set("excludeTestContext",new Boolean(searchBean.isExcludeTestContext()).toString());
		  prefForm.set("excludeTrainingContext",new Boolean(searchBean.isExcludeTestContext()).toString());
		  prefForm.set("isPreferencesDefault",new Boolean(isPreferencesDefault(searchBean)).toString());  
		  saveMessage("cadsr.cdebrowser.cde.search.pref.default.success", request);  
		  setSessionObject(request,TREE_REFRESH_INDICATOR,YES,true);
		  return mapping.findForward("prefPage");
	 }

    /**
     * Check if the user have changed from the defaults
     */
    private boolean isPreferencesDefault(DataElementSearchBean searchBean)
    {
      
        CDEBrowserParams params = CDEBrowserParams.getInstance();

        boolean excludeTestContext = new Boolean(params.getExcludeTestContext()).booleanValue();
        
        if(!searchBean.isExcludeTestContext()==excludeTestContext)
        {
          return false;
        }
        boolean excludeTrainingContext = new Boolean(params.getExcludeTrainingContext()).booleanValue();
        
        if(!searchBean.isExcludeTrainingContext()==excludeTrainingContext)
        {
          return false;
        }
        
        return true;
    }
    
    private DataElementSearchBean initSearchPreferences(HttpServletRequest request)
    {
        DataElementSearchBean searchBean = null;
        try {
			// Initialize Search Preference Values
			boolean excludeTestContext = new Boolean("true").booleanValue();
			boolean excludeTrainingContext = new Boolean("true").booleanValue();
			searchBean = new DataElementSearchBean(request);
			searchBean.setExcludeTestContext(excludeTestContext);
			searchBean.setExcludeTrainingContext(excludeTrainingContext);
			setSessionObject(request,"desb", searchBean);
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
    	return searchBean;
    }
}
