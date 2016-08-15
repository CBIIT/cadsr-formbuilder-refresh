package gov.nih.nci.ncicb.cadsr.formbuilder.struts.actions;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;

import gov.nih.nci.ncicb.cadsr.common.CaDSRConstants;
import gov.nih.nci.ncicb.cadsr.common.resource.Form;
import gov.nih.nci.ncicb.cadsr.common.resource.FormV2;
import gov.nih.nci.ncicb.cadsr.common.struts.formbeans.CDECartFormBean;
import gov.nih.nci.ncicb.cadsr.formbuilder.ejb.service.FormBuilderService;
import gov.nih.nci.ncicb.cadsr.formbuilder.struts.actions.cadsrutil_ext.CDECartOCImplExtension;
import gov.nih.nci.ncicb.cadsr.formbuilder.struts.actions.cadsrutil_ext.FormDisplayCartOCIImpl;
import gov.nih.nci.ncicb.cadsr.formbuilder.struts.common.FormConverterUtil;
import gov.nih.nci.ncicb.cadsr.objectCart.CDECart;
import gov.nih.nci.ncicb.cadsr.objectCart.CDECartItem;
import gov.nih.nci.ncicb.cadsr.objectCart.FormDisplayCartTransferObject;
import gov.nih.nci.objectCart.domain.CartObject;


public class SecureFormsCartAction extends FormBuilderSecureBaseDispatchActionWithCarts {

  /**
   * Displays Form Cart.
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
  public ActionForward displayFormsCartV1(
    ActionMapping mapping,
    ActionForm form,
    HttpServletRequest request,
    HttpServletResponse response) throws IOException, ServletException {
     
    return mapping.findForward(retrieveItems(mapping, form, request, response));
  }

  public String retrieveItems(
	    ActionMapping mapping,
	    ActionForm form,
	    HttpServletRequest request,
	    HttpServletResponse response) throws IOException, ServletException {
	     
	    try {	    	
	    	ensureSessionCarts(request);
	    	FormDisplayCartOCIImpl displayCart = (FormDisplayCartOCIImpl)this.getSessionObject(request, CaDSRConstants.FORMS_DISPLAY_CART);
	    	displayCart.setFormDisplayObjects();
	    	this.setSessionObject(request, CaDSRConstants.DISPLAY_CART1, CaDSRConstants.FORMS_DISPLAY_CART);
	    	this.removeSessionObject(request, CaDSRConstants.DISPLAY_CART2);
	    }
	    catch (Exception exp) {
	      if (log.isErrorEnabled()) {
	        log.error("Exception on displayFormCart", exp);
	      }
	      saveMessage(exp.getMessage(), request);
	      return FAILURE;
	    }
	    //return SUCCESS;
	    return "displayV1cart";

  	}
  
  public ActionForward displayFormsCartV2(
		    ActionMapping mapping,
		    ActionForm form,
		    HttpServletRequest request,
		    HttpServletResponse response) throws IOException, ServletException {
		     
		    return mapping.findForward(retrieveItemsV2(mapping, form, request, response));
		  }

  public String retrieveItemsV2(
	    ActionMapping mapping,
	    ActionForm form,
	    HttpServletRequest request,
	    HttpServletResponse response) throws IOException, ServletException {
	     
	    try {	    	
	    	ensureSessionCarts(request);
	    	FormDisplayCartOCIImpl displayCart = (FormDisplayCartOCIImpl)this.getSessionObject(request, CaDSRConstants.FORMS_DISPLAY_CART2);
	    	displayCart.setFormDisplayObjects();
	    	this.setSessionObject(request, CaDSRConstants.DISPLAY_CART2, CaDSRConstants.FORMS_DISPLAY_CART2);
	    	this.removeSessionObject(request, CaDSRConstants.DISPLAY_CART1);
	    	
	    	
	    }
	    catch (Exception exp) {
	      if (log.isErrorEnabled()) {
	        log.error("Exception on displayFormCart", exp);
	      }
	      saveMessage(exp.getMessage(), request);
	      return FAILURE;
	    }
	    //return SUCCESS;
	    return "displayV2cart";
  	}
  
	public FormDisplayCartTransferObject convertToDisplayItem(Form crf)
	{
		FormDisplayCartTransferObject displayObject = new FormDisplayCartTransferObject();
		displayObject.setAslName(crf.getAslName());
		displayObject.setContextName(crf.getContext().getName());
		displayObject.setFormType(crf.getFormType());
		displayObject.setIdseq(crf.getIdseq());
		displayObject.setLongName(crf.getLongName());
		displayObject.setProtocols(crf.getProtocols());
		displayObject.setPublicId(crf.getPublicId());
		displayObject.setVersion(crf.getVersion());
		return displayObject;
	}
  
  /**
   * Adds items to Form Cart.
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
	
	
	
  public ActionForward addItemsV2(
		    ActionMapping mapping,
		    ActionForm form,
		    HttpServletRequest request,
		    HttpServletResponse response) throws IOException, ServletException {
	  return addItems(mapping, form, request, response, CaDSRConstants.FORMS_DISPLAY_CART2, CaDSRConstants.FORMS_CART_V2);
  }
	
  public ActionForward addItemsV1(
		    ActionMapping mapping,
		    ActionForm form,
		    HttpServletRequest request,
		    HttpServletResponse response) throws IOException, ServletException {
	  return addItems(mapping, form, request, response, CaDSRConstants.FORMS_DISPLAY_CART, CaDSRConstants.FORMS_CART);
  }

	
  public ActionForward addItems(
    ActionMapping mapping,
    ActionForm form,
    HttpServletRequest request,
    HttpServletResponse response,
    String displayCartId,
    String formCartId) throws IOException, ServletException {
	     
   FormBuilderService service = getFormBuilderService(request);
	
   log.info("add forms in memeory to the cart");
   CDECartFormBean myForm = (CDECartFormBean) form;
   String[] selectedSaveItems = myForm.getSelectedSaveItems();
   
   int formsInQueue = 0;
   
    try {  	
		CDECart sessionCart = (CDECart) this.getSessionObject(request, formCartId);
		FormDisplayCartOCIImpl userFormDisplayCart = (FormDisplayCartOCIImpl) this.getSessionObject(request, displayCartId);
		
		if (selectedSaveItems != null) {

				if (formCartId.equals(CaDSRConstants.FORMS_CART))
					{
						Collection itemsToMerge = new ArrayList();
						Collection displayItemsToMerge = new ArrayList();
						for (Object version1FormId : selectedSaveItems) {
	
							Form crf = service.getFormDetails((String)version1FormId);
							log.debug("adding V1 form objects to cart (No Save)");
							itemsToMerge.add(crf);
							displayItemsToMerge.add(convertToDisplayItem(crf));
						}
	
							log.debug("merging V1 form objects");
							sessionCart.mergeElements(itemsToMerge);
							log.debug("done merging V1 form objects");
							
							log.debug("merging display form objects");
							userFormDisplayCart.mergeElements(displayItemsToMerge);
							log.debug("done merging display form objects");

						
						// Remove the saved forms from cart in memory
						for (Object version2FormId : selectedSaveItems) {
							userFormDisplayCart.removeFormDisplayCart((String)version2FormId);
						}
					}
				else if (formCartId.equals(CaDSRConstants.FORMS_CART_V2))
					{
						Collection itemsToRemove = new ArrayList();
						Collection itemsToAdd = new ArrayList();
						Collection displayItemsToMerge = new ArrayList();
						for (Object version2FormId : selectedSaveItems) {
							itemsToRemove.add((String)version2FormId);
							FormV2 crf = service.getFormDetailsV2((String)version2FormId);
							itemsToAdd.add(translateCartObject((FormV2) crf));
							// TODO add saving to FormDisplayCart as well
							displayItemsToMerge.add(convertToDisplayItem(crf));
						}

						// remove from cart before adding (so that we'll update), removing non-existent doesn't hurt
						// (wonder if that is really needed)
						log.debug("removing re-used objects");
						((CDECartOCImplExtension)sessionCart).removeDataElements(itemsToRemove);
						// (removeDataElements works on native id and doesn't care
						// about element type)
						log.debug("adding new objects");
						((CDECartOCImplExtension)sessionCart).addObjectCollection(itemsToAdd);
						log.debug("done");
						
						log.debug("merging display form objects");
						userFormDisplayCart.mergeElements(displayItemsToMerge);
						log.debug("done merging display form objects");

					
						// Remove the saved forms from cart in memory
						for (Object version2FormId : selectedSaveItems) {
							userFormDisplayCart.removeFormDisplayCart((String)version2FormId);
						}
						
						// Remove the saved forms from cart in memory
						for (Object version2FormId : selectedSaveItems) {
							((CDECartOCImplExtension)sessionCart).removeFormV2((String)version2FormId);
						}
						formsInQueue = ((CDECartOCImplExtension)sessionCart).getFormCartV2().size();
					}
				this.setSessionObject(request, formCartId, sessionCart);
				this.setSessionObject(request, displayCartId, userFormDisplayCart);
		}

		
	    request.getSession().setAttribute("myFormCartInfo", new Integer(formsInQueue).toString());
	    System.out.println( "Forms Queued in Cart : " + request.getSession().getAttribute("myFormCartInfo") );
		saveMessage("cadsr.common.formcart.save.success",request);
	}
    catch (Exception exp) {
      if (log.isErrorEnabled()) {
        log.error("Exception on addItems " , exp);
      }
    }

    if (formCartId.equals(CaDSRConstants.FORMS_CART))
	    {
	    	return mapping.findForward("addDeleteSuccessV1");
	    }
    else  if (formCartId.equals(CaDSRConstants.FORMS_CART_V2))
	    {
	    	return mapping.findForward("addDeleteSuccessV2");
	    }
    else
    	return mapping.findForward("addDeleteSuccessV2");
  }
  
  

  
  private CartObject translateCartObject(FormV2 crf) throws Exception {
		CartObject ob = new CartObject();
		ob.setType(FormConverterUtil.instance().getCartObjectType());
		ob.setDisplayText(Integer.toString(crf.getPublicId()) + "v" + Float.toString(crf.getVersion()));
		ob.setNativeId(crf.getFormIdseq());
		
		String convertedForm = FormConverterUtil.instance().convertFormToV2(crf);		
		ob.setData(convertedForm);
		return ob;	  
}
  

  /**
   * Delete items from the Form Cart.
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
  
  
	public ActionForward removeItemsV2(
			    ActionMapping mapping,
			    ActionForm form,
			    HttpServletRequest request,
			    HttpServletResponse response) throws IOException, ServletException {
		return removeItems(mapping, form, request, response, CaDSRConstants.FORMS_DISPLAY_CART2, CaDSRConstants.FORMS_CART_V2);
	}
		
	public ActionForward removeItemsV1(
			    ActionMapping mapping,
			    ActionForm form,
			    HttpServletRequest request,
			    HttpServletResponse response) throws IOException, ServletException {
		return removeItems(mapping, form, request, response, CaDSRConstants.FORMS_DISPLAY_CART, CaDSRConstants.FORMS_CART);
	}
  
  
  public ActionForward removeItems(
    ActionMapping mapping,
    ActionForm form,
    HttpServletRequest request,
    HttpServletResponse response,
    String displayCartId,
    String formCartId) throws IOException, ServletException {
    try {
      CDECartFormBean myForm = (CDECartFormBean) form;
      String[] selectedDeleteItems = myForm.getSelectedDeleteItems();
      Collection savedItems = new ArrayList();

      //Collection unsavedItems = new ArrayList();
      FormBuilderService service = getFormBuilderService(request);
      
	  FormDisplayCartOCIImpl userFormDisplayCart = (FormDisplayCartOCIImpl) this
				.getSessionObject(request, displayCartId);
	  CDECart sessionCart =
			  (CDECart) this.getSessionObject(request, formCartId);
 
      if (formCartId.equals(CaDSRConstants.FORMS_CART))
		{
    	  try {
    		  Collection items = new ArrayList();
       		  Collection displayItemsToRemove = new ArrayList();
    		  CDECartItem item = null;


    		  for (int i = 0; i < selectedDeleteItems.length; i++) {
    			  items.add(selectedDeleteItems[i]);
    			  userFormDisplayCart.removeFormDisplayCart(selectedDeleteItems[i]);
    		  }
    		  sessionCart.removeDataElements(items);  // (removeDataElements works on native id and doesn't care about element type)
    		  userFormDisplayCart.removeDataElements(items);
    	  }
    	  catch (Exception exp) {
    		  log.error("Exception on removeItems from " + formCartId + " ", exp);
    	  }
      }
      else if (formCartId.equals(CaDSRConstants.FORMS_CART_V2)){ // we always write the formCartV2 cart now
    	  try {
    		  Collection items = new ArrayList();
    		  Collection displayItemsToRemove = new ArrayList();
    		  CDECartItem item = null;
    		  
    		  for (int i = 0; i < selectedDeleteItems.length; i++) {
    			  items.add(selectedDeleteItems[i]);
    		  }
	  		  for (Object version1FormId : selectedDeleteItems) {
					//Form crf = service.getFormDetails((String)version1FormId);
					//displayItemsToRemove.add(convertToDisplayItem(crf));
					userFormDisplayCart.removeFormDisplayCart((String)version1FormId);
			  }
    		  sessionCart.removeDataElements(items);  // (removeDataElements works on native id and doesn't care about element type)
    		  userFormDisplayCart.removeDataElements(items);
    	  }
    	  catch (Exception exp) {
    		  log.error("Exception on removeItems from " + formCartId + " ", exp);
    	  }
    		  
      }      

      saveMessage("cadsr.common.formcart.delete.success",request);
    }
    catch (Exception exp) {
      if (log.isErrorEnabled()) {
        log.error("Exception on removeItems " , exp);
      }
    }

    if (formCartId.equals(CaDSRConstants.FORMS_CART))
	    {
	    	return mapping.findForward("addDeleteSuccessV1");
	    }
	else  if (formCartId.equals(CaDSRConstants.FORMS_CART_V2))
	    {
	    	return mapping.findForward("addDeleteSuccessV2");
	    }
	else
		return mapping.findForward("addDeleteSuccessV2");
  }  
}
