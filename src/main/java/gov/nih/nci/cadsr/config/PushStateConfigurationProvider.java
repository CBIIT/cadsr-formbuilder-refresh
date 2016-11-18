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
            		.andNot(Path.matches("/{path2}/dist/style.css"))
            		.andNot(Path.matches("/{path2}/dist/bundle.js"))
            		.andNot(Path.matches("/{path2}/dist/style.css.map"))
            		.andNot(Path.matches("/{path2}/dist/bundle.js.map"))
            		.andNot(Path.matches("/{path2}/assets/**"))
                )
            .perform(Forward.to("/index.jsp"))
            .where("path").matches(".*")
            
            .addRule()
            .when(Direction.isInbound().and(Path.matches("/{path2}/dist/style.css"))
            		.andNot(Path.matches("/dist/style.css")))
            .perform(Forward.to("/dist/style.css"))
            
            .addRule()
            .when(Direction.isInbound().and(Path.matches("/{path2}/dist/bundle.js"))
            		.andNot(Path.matches("/dist/bundle.js")))
            .perform(Forward.to("/dist/bundle.js"))
        
            .addRule()
            .when(Direction.isInbound().and(Path.matches("/{path2}/dist/style.css.map"))
            		.andNot(Path.matches("/dist/style.css.map")))
            .perform(Forward.to("/dist/style.css.map"))
            
	        .addRule()
	        .when(Direction.isInbound().and(Path.matches("/{path2}/dist/bundle.js.map"))
	        		.andNot(Path.matches("/dist/bundle.js.map")))
	        .perform(Forward.to("/dist/bundle.js.map"))
	        
	        .addRule()
	        .when(Direction.isInbound().and(Path.matches("/{path2}/assets/{path3}"))
	        		.andNot(Path.matches("/assets/{path3}")))
	        .perform(Forward.to("/assets/{path3}"));
        
    }

    @Override
    public int priority()
    {
        return 10; 
    } 
}