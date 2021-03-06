// This class provides utility functions for supporting the new form cart format

package gov.nih.nci.ncicb.cadsr.formbuilder.struts.common;

import gov.nih.nci.ncicb.cadsr.common.resource.FormV2;
import gov.nih.nci.ncicb.cadsr.common.util.logging.Log;
import gov.nih.nci.ncicb.cadsr.common.util.logging.LogFactory;
import gov.nih.nci.ncicb.cadsr.formbuilder.common.FormCartOptionsUtil;

import java.io.BufferedWriter;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.StringReader;
import java.io.StringWriter;
import java.net.URL;

import javax.xml.transform.Result;
import javax.xml.transform.Source;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerException;
import javax.xml.transform.stream.StreamResult;
import javax.xml.transform.stream.StreamSource;

import org.apache.xalan.transformer.TransformerIdentityImpl;
import org.exolab.castor.xml.MarshalException;
import org.exolab.castor.xml.Marshaller;
import org.exolab.castor.xml.ValidationException;


public class FormConverterUtil {
	private static Log log = LogFactory.getLog(FormConverterUtil.class.getName());
	
	static private FormConverterUtil _instance = null;
	//Stop using ConvertFormCartV1ExtendedToV2.xsl to be in syn with what GS has
	public static final String V1ExtendedToV2XSL = "/transforms/FinalFormCartTransformv33.xsl";
	//public static final String V1ExtendedToV2XSL = "/transforms/ConvertFormCartV1ExtendedToV2.xsl";
	
	public static final String stripEmptyNodesXSL = "/transforms/remove-empty-nodes.xsl";
	
	protected Transformer transformerV1ToV2 = new TransformerIdentityImpl();
	protected Transformer transformerStripEmpty = new TransformerIdentityImpl();
	

	public String getCartObjectType() {
		return FormCartOptionsUtil.instance().xsdLocation();
	}

	private String convertToV2(FormV2 crf) throws MarshalException, ValidationException, TransformerException
		{
			// Start with our standard conversion to xml (in V1 format)
			StringWriter writer = new StringWriter();
			try {
				Marshaller.marshal(crf, writer);
			} catch (MarshalException ex) {
				log.info("FormV2 " + crf);
				throw ex;
			} catch (ValidationException ex) {
				// need exception handling	
				log.info("FormV2 " + crf);
				throw ex;
			}
			
			try {
				 
				String content = writer.toString();
	 
				File file = new File("downloanv1-20140602.xml");
	 
				// if file doesnt exists, then create it
				if (!file.exists()) {
					file.createNewFile();
				}
	 
				FileWriter fw = new FileWriter(file.getAbsoluteFile());
				BufferedWriter bw = new BufferedWriter(fw);
				bw.write(content);
				bw.close();
	 
				System.out.println("Done");
	 
			} catch (IOException e) {
				e.printStackTrace();
			}
			
			// Now use our transformer to create V2 format
			Source xmlInput = new StreamSource(new StringReader(writer.toString()));
			ByteArrayOutputStream xmlOutputStream = new ByteArrayOutputStream();  
			Result xmlOutput = new StreamResult(xmlOutputStream);
			try {
				transformerV1ToV2.transform(xmlInput, xmlOutput);
			} catch (TransformerException e) {
				log.info(writer.toString());
				throw e;
			}	
			
			String V2XML = xmlOutputStream.toString();
			return V2XML;
		}
	
	public String convertFormToV2 (FormV2 crf) throws MarshalException, ValidationException, TransformerException 
		{
			Source xmlInputV2Forms = new StreamSource(new StringReader(convertToV2(crf)));
			ByteArrayOutputStream xmlOutputStreamStripEmpty = new ByteArrayOutputStream();  
			Result xmlOutputStripEmpty = new StreamResult(xmlOutputStreamStripEmpty);
			
			try {
				// Strip empty nodes from the transformed v2 form xml file
				transformerStripEmpty.transform(xmlInputV2Forms, xmlOutputStripEmpty);
			} catch (TransformerException e) {
				log.info(xmlInputV2Forms.toString());
				throw e;
			}	
					
			String V2XML = xmlOutputStreamStripEmpty.toString();
			return V2XML;
		}
		
	protected FormConverterUtil() {
		
		StreamSource xslSource = null;
		StreamSource xslSourceStripEmpty = null;
		try {
			
			final URL resource = this.getClass().getResource(V1ExtendedToV2XSL);
			final URL resource2 = this.getClass().getResource(stripEmptyNodesXSL);

			final InputStream xslStream = resource.openStream();
			final InputStream xslStreamRemoveEmptyNodes = resource2.openStream();
			
//			ClassLoader classLoader = getClass().getClassLoader();
//			InputStream xslStream = classLoader.getResourceAsStream(V1ExtendedToV2XSL);
			xslSource = new StreamSource(xslStream);
			
//			InputStream xslStreamRemoveEmptyNodes = classLoader.getResourceAsStream(stripEmptyNodesXSL);
			xslSourceStripEmpty = new StreamSource(xslStreamRemoveEmptyNodes);
		}
		catch(Exception e) {
			System.out.println("FormConverterUtil error loading conversion xsl: " + V1ExtendedToV2XSL + " OR " + stripEmptyNodesXSL + " exc: "+ e);
		}
		
		try {
			log.info("creating transformerV1ToV2");			
			transformerV1ToV2 = net.sf.saxon.TransformerFactoryImpl.newInstance().newTransformer(xslSource);
			log.info("creating transformerStripEmpty");
			transformerStripEmpty  = net.sf.saxon.TransformerFactoryImpl.newInstance().newTransformer(xslSourceStripEmpty);
		} catch (TransformerException e) {
			log.info("transformerV1ToV2 exception: " + e.toString());
			log.info("transformerV1ToV2 exception: " + e.getMessage());
		}	
	} 
	 
	 
	static public FormConverterUtil instance(){
		if (_instance == null) {
			_instance = new FormConverterUtil();
		}
		return _instance;
	}
  
}