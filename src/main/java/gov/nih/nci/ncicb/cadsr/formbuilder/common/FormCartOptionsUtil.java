package gov.nih.nci.ncicb.cadsr.formbuilder.common;

import java.io.*;
import java.util.Properties;

import gov.nih.nci.ncicb.cadsr.common.util.logging.Log;
import gov.nih.nci.ncicb.cadsr.common.util.logging.LogFactory;

public class FormCartOptionsUtil
{
	private static Log log = LogFactory.getLog(FormCartOptionsUtil.class.getName());

	static private FormCartOptionsUtil _instance = null;

	// notes:
	// Writing V2 format cart is now automatic and not an option. Writing old format cart is done in addition if set via the property.
	// xsd location is provided as reference to users in the type attribute of the cart object.
	//  The type attribute also affects validation on loading. The xsd location should beging with 
	//  "http://" to avoid validation (which will fail). See gov.nih.nci.objectCart.util.xml.Validator

	// defaults provide "normal" behavior, but xsdLocation property should be set to the actual location
	private boolean writeV1Format = false;
	private String xsdLocation = "http://www.w3.org/2001/XMLSchema";

	private boolean dumpXMLDuringDebug = false;

	public static final String propertyFile= "/FormCart.properties";


	public boolean writeInV1Format()
	{
		return writeV1Format;
	}

	public String xsdLocation()
	{
		return xsdLocation;
	}

	public boolean dumpXMLDuringDebug()
	{
		return dumpXMLDuringDebug;
	}

	protected FormCartOptionsUtil(){
		try{
			InputStream propertyFileStream = this.getClass().getResourceAsStream(propertyFile) ;
			Properties props = new Properties();
			props.load(propertyFileStream);
			String value1 = props.getProperty("writeV1Format");
			String value4 = props.getProperty("xsdLocation");
			String value5 = props.getProperty("dumpXMLDuringDebug");

			if (value1 != null) 
				writeV1Format = Boolean.valueOf(value1);
			if (value4 != null)
				xsdLocation = value4;
			if (value5 != null)
				dumpXMLDuringDebug = Boolean.valueOf(value5);

		} 
		catch(Exception e){
			System.out.println("FormCartOptionsUtil error loading properties: " + e);
			log.debug("FormCartOptionsUtil error loading properties: " + e);
		}	 

		log.debug("writeInV1Format() " + writeInV1Format());
		log.debug("xsdLocation() " + xsdLocation());
		log.debug("dumpXMLDuringDebug() " + dumpXMLDuringDebug());
	}
	 
	static public FormCartOptionsUtil instance(){
		if (_instance == null) {
			_instance = new FormCartOptionsUtil();
		}

		return _instance;
	}
}

