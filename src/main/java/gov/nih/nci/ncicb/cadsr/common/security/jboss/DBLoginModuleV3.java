package gov.nih.nci.ncicb.cadsr.common.security.jboss;

import java.io.IOException;
import java.security.Principal;
import java.security.acl.Group;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.security.auth.Subject;
import javax.security.auth.callback.Callback;
import javax.security.auth.callback.CallbackHandler;
import javax.security.auth.callback.NameCallback;
import javax.security.auth.callback.PasswordCallback;
import javax.security.auth.callback.UnsupportedCallbackException;
import javax.security.auth.login.FailedLoginException;
import javax.security.auth.login.LoginException;
import javax.sql.DataSource;

import org.apache.commons.dbcp.BasicDataSource;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.jboss.security.SimpleGroup;
import org.jboss.security.SimplePrincipal;
import org.jboss.security.auth.spi.AbstractServerLoginModule;

import gov.nih.nci.ncicb.cadsr.common.persistence.dao.UserManagerDAO;
import gov.nih.nci.ncicb.cadsr.common.persistence.dao.jdbc.JDBCUserManagerDAOFB;

public class DBLoginModuleV3 extends AbstractServerLoginModule
{
    protected Log logger;
    private Principal identity;
    private char credential[];
    
    private UserManagerDAO userManagerDAO;
    private String appUserName;
    private String appPassword;
    private static String _jndiName = "java:jboss/datasources/FormBuilderDS";
    
    public DBLoginModuleV3()
    {
        logger = LogFactory.getLog(DBLoginModuleV3.class.getName());
        
        userManagerDAO = null;
        appUserName = null;
        appPassword = null;
    }

    public void initialize(Subject p0, CallbackHandler p1, Map p2, Map p3)
    {
        try
        {
            super.initialize(p0, p1, p2, p3);
            for(Iterator it = p3.entrySet().iterator(); it.hasNext(); logger.info((new StringBuilder()).append("Option: ").append(it.next().toString()).toString()));
            appUserName = (String)p3.get("applicationUserName");
            appPassword = (String)p3.get("applicationPassword");
            if(userManagerDAO == null)
            {
            	JDBCUserManagerDAOFB umDao = new JDBCUserManagerDAOFB();
            	Context envContext = new InitialContext();
                BasicDataSource ds = (BasicDataSource)envContext.lookup(_jndiName);
            	umDao.setDataSource(ds);
                userManagerDAO = umDao;
            }
        }
        catch(Exception le)
        {
            logger.error("error at initialize : ", le);
        }
    }

    public boolean login()
        throws LoginException
    {
        String info[];
        try
        {
            logger.info("In another login");
            if(super.login())
            {
                Object username = sharedState.get("javax.security.auth.login.name");
                if(username instanceof Principal)
                {
                    identity = (Principal)username;
                } else
                {
                    String name = username.toString();
                    try
                    {
                        identity = createIdentity(name);
                    }
                    catch(Exception e)
                    {
                        throw new LoginException((new StringBuilder()).append("Failed to create principal: ").append(e.getMessage()).toString());
                    }
                }
                Object password = sharedState.get("javax.security.auth.login.password");
                if(password instanceof char[])
                    credential = (char[])(char[])password;
                else
                if(password != null)
                {
                    String tmp = password.toString();
                    credential = tmp.toCharArray();
                }
                return true;
            }
        }
        catch(LoginException le)
        {
            logger.error("error at login : ", le);
            throw le;
        }
        super.loginOk = false;
        info = getUsernameAndPassword();
        String username = info[0];
        String password = info[1];
        if(username == null && password == null)
            identity = unauthenticatedIdentity;
        if(identity == null)
        {
            try
            {
                identity = createIdentity(username);
            }
            catch(Exception e)
            {
                throw new LoginException((new StringBuilder()).append("Failed to create principal: ").append(e.getMessage()).toString());
            }
            String errMsg = userCredential(username.toUpperCase(), password);
            if(!errMsg.equals(""))
                throw new FailedLoginException(errMsg);
        }
        if(getUseFirstPass())
        {
            sharedState.put("javax.security.auth.login.name", username);
            sharedState.put("javax.security.auth.login.password", credential);
        }
        super.loginOk = true;
        logger.debug((new StringBuilder()).append("loginOk=").append(loginOk).toString());
        return true;
    }

    protected Group[] getRoleSets()
        throws LoginException
    {
        SimpleGroup grp = new SimpleGroup("Roles");
        Group groups[] = {
            grp
        };
        try
        {
            Map rolesAndContexts = userManagerDAO.getContextsForAllRoles(getUsername(), "QUEST_CONTENT");
            Set roles = rolesAndContexts.keySet();
            String role;
            for(Iterator it = roles.iterator(); it.hasNext(); logger.debug((new StringBuilder()).append("Role: ").append(role).append(getUsername()).toString()))
            {
                role = (String)it.next();
                grp.addMember(new SimplePrincipal(role));
            }

            logger.debug((new StringBuilder()).append("Groups : ").append(groups).toString());
        }
        catch(Exception le)
        {
            logger.error("error at getRoleSets : ", le);
        }
        return groups;
    }

    protected Principal getIdentity()
    {
        return identity;
    }

    protected String[] getUsernameAndPassword()
        throws LoginException
    {
        String info[] = {
            null, null
        };
        if(callbackHandler == null)
            throw new LoginException("Error: no CallbackHandler available to collect authentication information");
        NameCallback nc = new NameCallback("User name: ", "guest");
        PasswordCallback pc = new PasswordCallback("Password: ", false);
        Callback callbacks[] = {
            nc, pc
        };
        String username = null;
        String password = null;
        try
        {
            callbackHandler.handle(callbacks);
            username = nc.getName();
            char tmpPassword[] = pc.getPassword();
            if(tmpPassword != null)
            {
                credential = new char[tmpPassword.length];
                System.arraycopy(tmpPassword, 0, credential, 0, tmpPassword.length);
                pc.clearPassword();
                password = new String(credential);
            }
        }
        catch(IOException ioe)
        {
            throw new LoginException(ioe.toString());
        }
        catch(UnsupportedCallbackException uce)
        {
            throw new LoginException((new StringBuilder()).append("CallbackHandler does not support: ").append(uce.getCallback()).toString());
        }
        info[0] = username;
        info[1] = password;
        logger.debug((new StringBuilder()).append("Username=").append(username).toString());
        return info;
    }

    protected boolean authenticateUser(String username, String password)
    {
        boolean isUserValid = false;
        isUserValid = userManagerDAO.validUser(username, password);
        return isUserValid;
    }

    protected String getUsername()
    {
        String username = null;
        if(getIdentity() != null)
            username = getIdentity().getName();
        return username;
    }

    protected Principal createIdentity(String p0)
        throws Exception
    {
        return new SimplePrincipal(p0);
    }

    protected String userCredential(String loginUserid, String loginPswd)
    {
        CaDsrUserCredentialsV3 uc = new CaDsrUserCredentialsV3();
        try
        {
            if(appUserName != null)
                uc.validateCredentials(appUserName, appPassword, loginUserid, loginPswd);
        }
        catch(Exception ex)
        {
            logger.error((new StringBuilder()).append("Failed credential validation, code is ").append(uc.getCheckCode()).toString(), ex);
            return (new StringBuilder()).append("Failed credential validation, code is ").append(uc.getCheckCode()).toString();
        }
        return "";
    }
    
}