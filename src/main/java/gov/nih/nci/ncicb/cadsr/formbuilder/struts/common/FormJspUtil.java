package gov.nih.nci.ncicb.cadsr.formbuilder.struts.common;

import gov.nih.nci.ncicb.cadsr.common.resource.ClassSchemeItem;
import gov.nih.nci.ncicb.cadsr.common.resource.Form;
import gov.nih.nci.ncicb.cadsr.common.resource.FormElement;
import gov.nih.nci.ncicb.cadsr.common.resource.Module;
import gov.nih.nci.ncicb.cadsr.common.resource.Question;
import gov.nih.nci.ncicb.cadsr.common.resource.FormValidValue;
import gov.nih.nci.ncicb.cadsr.common.resource.Protocol;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.Enumeration;
import java.util.Iterator;
import java.util.List;
import java.util.Properties;

public class FormJspUtil
{
    public static final String FORM = "form";
    public static final String MODULE = "module";
    public static final String QUESTION = "question";
    public static final String VALIDVALUE = "validvalue";

    public FormJspUtil()
    {
    }

    public static String getFormElementType(FormElement obj)
    {
        if(obj instanceof Form)
            return FORM;
        if(obj instanceof Module)
            return MODULE;
        if(obj instanceof Question)
            return QUESTION;
        if(obj instanceof FormValidValue)
            return VALIDVALUE;
        return " ";
    }

    public static String  getDelimitedProtocolLongNames(List protocols, String delimiter){

          if (protocols==null || protocols.isEmpty()){
              return "";
          }

          StringBuffer sbuf = new StringBuffer();
          String delimtedProtocolLongName = null;
          Iterator it = protocols.iterator();
          while (it.hasNext()){
              Protocol  p = (Protocol)it.next();
               sbuf.append(delimiter).append(p.getLongName());
          }
          //System.out.println("subString = "  + sbuf.substring(1) );
          return sbuf.substring(delimiter.length());
        }

    public static String  getDelimitedCSILongNames(List classSchemeItems, String delimiter){

          if (classSchemeItems==null || classSchemeItems.isEmpty()){
              return "";
          }

          StringBuffer sbuf = new StringBuffer();
          String delimtedProtocolLongName = null;
          Iterator it = classSchemeItems.iterator();
          while (it.hasNext()){
              ClassSchemeItem  csi = (ClassSchemeItem)it.next();
               sbuf.append(delimiter).append(csi.getClassSchemeItemName());
          }

          return sbuf.substring(delimiter.length());
        }

    public static String getDefaultValue(Question question)
    {
        if(question.getDefaultValidValue()!=null && question.getDefaultValidValue().getLongName()!=null)
            return question.getDefaultValidValue().getLongName();
        if(question.getDefaultValue()!=null)
            return question.getDefaultValue();
        return "No Default Value";
    }

    public static boolean hasModuleRepetition(Form form)
    {
       if(form.getModules()==null)
        return false;
       List modules = form.getModules();
       Iterator it = form.getModules().iterator();
       while(it.hasNext())
       {
           Module module =(Module)it.next();
           if(module.getNumberOfRepeats()>0)
            return true;
       }
       return false;
    }
    
	public static String updateDataForSpecialCharacters(String name) {
		 if( name == null ) {
			 return name;
		 }
			 
		 name = name.replace("&#8322;", "\u2082");  //Subscript 2
		 name = name.replace("&#945;", "\u03B1"); // Alpha
		 name = name.replace("&#946;", "\u03B2"); // Beta
		 name = name.replace("&#947;", "\u03B3"); // Gamma
		 name = name.replace("&#948;", "\u03B4"); // Delta
		 name = name.replace("&#178;", "\u00B2"); // Superscript 2
		 name = name.replace("&#176;", "\u00B0"); // Degree
		 name = name.replace("&#181;", "\u00B5"); // Micro
		 name = name.replace("&#955;", "\u03BB"); // lambda
		 name = name.replace("&#8805;", "\u2265"); // Greater than or equal to
		 name = name.replace("&#8804;", "\u2264"); // Less than or equal to
		 name = name.replace("&#177;", "\u00B1"); // Plus-Minus sign
		 name = name.replace("&#954;", "\u03BA"); // Kappa Small
		 name = name.replace("&#8495;", "\u212F"); // Small Exponent
		 name = name.replace("&#922;", "\u03BA"); // Kappa Big
		 
		 return name;
	}
	
	public static String updateDataForSpecialCharactersWithFile(String name) throws IOException {
		Properties specialCharProperties = new Properties();
		
		FileInputStream in = new FileInputStream("/local/content/formbuilder/config/specialChar.properties");
		specialCharProperties.load(in);
		
		Enumeration eProps = specialCharProperties.propertyNames();
		while (eProps.hasMoreElements()) { 
		    String key = (String) eProps.nextElement(); 
		    String value = specialCharProperties.getProperty(key); 
		    name = name.replace(key, value);
		}
		 
		 return name;
	}	
}
