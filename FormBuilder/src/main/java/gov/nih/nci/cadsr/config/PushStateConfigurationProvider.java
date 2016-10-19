package gov.nih.nci.cadsr.config;

import javax.servlet.ServletContext;

import org.ocpsoft.logging.Logger.Level;
import org.ocpsoft.rewrite.annotation.RewriteConfiguration;
import org.ocpsoft.rewrite.config.Configuration;
import org.ocpsoft.rewrite.config.ConfigurationBuilder;
import org.ocpsoft.rewrite.config.Direction;
import org.ocpsoft.rewrite.config.Log;
import org.ocpsoft.rewrite.servlet.config.Forward;
import org.ocpsoft.rewrite.servlet.config.HttpConfigurationProvider;
import org.ocpsoft.rewrite.servlet.config.Path;
import org.ocpsoft.rewrite.servlet.config.Resource;
import org.ocpsoft.rewrite.servlet.config.ServletMapping;

@RewriteConfiguration
public class PushStateConfigurationProvider extends HttpConfigurationProvider
{
    @Override
    public Configuration getConfiguration(final ServletContext context)
    {
    	
        return ConfigurationBuilder.begin()
            .addRule()
            .when(Direction.isInbound().and(Path.matches("/{path}"))
            		.andNot(Resource.exists("/{path}"))
                    .andNot(ServletMapping.includes("/{path}"))
            		.andNot(Path.matches("/index.jsp"))
                )
            .perform((Log.message(Level.INFO, "Forwarding to index.jsp from {path}").and(Forward.to("/index.jsp"))))
            .where("path").matches(".*");
    }

    @Override
    public int priority()
    {
        /* This provides ordering if you have multiple configurations */
        return 10; 
    } 
}