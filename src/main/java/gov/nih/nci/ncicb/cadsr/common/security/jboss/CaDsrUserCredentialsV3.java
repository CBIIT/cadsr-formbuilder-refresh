package gov.nih.nci.ncicb.cadsr.common.security.jboss;

import java.sql.*;
import javax.naming.*;
import javax.sql.DataSource;
import org.apache.log4j.Logger;

public class CaDsrUserCredentialsV3
{

    public static final int CC_OK = 0;
    public static final int CC_LOCKED = 1;
    public static final int CC_INVALID = 2;
    public static final int CC_CONFIGURATION = 3;
    public static final int CC_DATABASE = 4;
    public static final int CC_OTHER = 5;
    private Connection _conn;
    private PreparedStatement _pstmt;
    private ResultSet _rs;
    private String _applUser;
    private String _applPswd;
    private int _checkCode;
    private Logger _logger;
    private static String _jndiName = "java:jboss/datasources/FormBuilderDS";
    private static final String CHECKOPTIONS = "select COUNT(*) from sbrext.tool_options_view_ext where tool_name = 'caDSR' and property in ('LOCKOUT.TIMER', 'LOCKOUT.THRESHOLD')";
    private static final String RESETLOCK = "update sbrext.users_lockout_view set LOCKOUT_COUNT = 0, VALIDATION_TIME = SYSDATE where ua_name = ? and LOCKOUT_COUNT > 0 and VALIDATION_TIME < (SYSDATE - ( select to_number(value)/1440 from sbrext.tool_options_view_ext where tool_name = 'caDSR' and property = 'LOCKOUT.TIMER'))";
    private static final String CHECKLOCK = "select 'User is currently Locked' from sbrext.users_lockout_view where ua_name = ? and LOCKOUT_COUNT >= ( select to_number(value) from sbrext.tool_options_view_ext where tool_name = 'caDSR' and property = 'LOCKOUT.THRESHOLD') union all select 'User does not exist in sbr.user_accounts' from dual where ? not in (select ua_name from sbr.user_accounts_view) union all select 'User disabled in sbr.user_accounts' from sbr.user_accounts_view where ua_name = ? and enabled_ind <> 'Yes' ";
    private static final String INCLOCK = "update sbrext.users_lockout_view set LOCKOUT_COUNT = LOCKOUT_COUNT + 1, VALIDATION_TIME = SYSDATE where ua_name = ?";
    private static final String CLEARLOCK = "update sbrext.users_lockout_view set LOCKOUT_COUNT = 0, VALIDATION_TIME = SYSDATE where ua_name = ?";
    private static final String INSLOCK = "insert into sbrext.users_lockout_view (ua_name, LOCKOUT_COUNT, VALIDATION_TIME) values (?, 1, SYSDATE)";

    class DBActionSetLock extends DBAction
    {

        public void execute()
            throws SQLException
        {
            _pstmt = _conn.prepareStatement(_sql);
            _pstmt.setString(1, _localUser);
            _pstmt.execute();
            _failed = _pstmt.getUpdateCount() == 0;
        }

        public void failure()
        {
            _failed = true;
        }

        public boolean failed()
        {
            return _failed;
        }

        public void trySql(String insert_)
        {
            _sql = insert_;
            _failed = false;
        }

        private String _localUser;
        private String _sql;
        private boolean _failed;
        final CaDsrUserCredentialsV3 this$0;

        DBActionSetLock(String update_, String user_)
        {
        	super();
            this$0 = CaDsrUserCredentialsV3.this;
            _localUser = user_;
            _sql = update_;
            _failed = false;
        }
    }

    class DBActionValidateCreds extends DBAction
    {

        public void execute()
            throws SQLException
        {
            _valid = true;
        }

        public String getConnectionUser()
        {
            return _localUser;
        }

        public String getConnectionPswd()
        {
            return _localPswd;
        }

        public void failure()
        {
            _valid = false;
        }

        public boolean isValid()
        {
            return _valid;
        }

        private String _localUser;
        private String _localPswd;
        private boolean _valid;
        final CaDsrUserCredentialsV3 this$0;

        DBActionValidateCreds(String user_, String pswd_)
        {
            super();
            this$0 = CaDsrUserCredentialsV3.this;
            _localUser = user_;
            _localPswd = pswd_;
        }
    }

    class DBActionLockCheck extends DBAction
    {

        public void execute()
            throws SQLException
        {
            _pstmt = _conn.prepareStatement("update sbrext.users_lockout_view set LOCKOUT_COUNT = 0, VALIDATION_TIME = SYSDATE where ua_name = ? and LOCKOUT_COUNT > 0 and VALIDATION_TIME < (SYSDATE - ( select to_number(value)/1440 from sbrext.tool_options_view_ext where tool_name = 'caDSR' and property = 'LOCKOUT.TIMER'))");
            _pstmt.setString(1, _localUser);
            _pstmt.execute();
            _pstmt.close();
            _pstmt = _conn.prepareStatement("select 'User is currently Locked' from sbrext.users_lockout_view where ua_name = ? and LOCKOUT_COUNT >= ( select to_number(value) from sbrext.tool_options_view_ext where tool_name = 'caDSR' and property = 'LOCKOUT.THRESHOLD') union all select 'User does not exist in sbr.user_accounts' from dual where ? not in (select ua_name from sbr.user_accounts_view) union all select 'User disabled in sbr.user_accounts' from sbr.user_accounts_view where ua_name = ? and enabled_ind <> 'Yes' ");
            _pstmt.setString(1, _localUser);
            _pstmt.setString(2, _localUser);
            _pstmt.setString(3, _localUser);
            _rs = _pstmt.executeQuery();
            _locked = _rs.next();
            if(_locked)
                _logger.warn((new StringBuilder()).append(_rs.getString(1)).append(" ").append(_localUser).toString());
        }

        public boolean getLock()
        {
            return _locked;
        }

        private String _localUser;
        private boolean _locked;
        final CaDsrUserCredentialsV3 this$0;

        DBActionLockCheck(String user_)
        {
            super();
            this$0 = CaDsrUserCredentialsV3.this;
             _localUser = user_;
            _locked = true;
        }
    }

    abstract class DBAction
    {

        public abstract void execute()
            throws SQLException;

        public String getConnectionUser()
        {
            return _applUser;
        }

        public String getConnectionPswd()
        {
            return _applPswd;
        }

        public void failure()
        {
        }

        final CaDsrUserCredentialsV3 this$0;

        DBAction()
        {
        	super();
        	this$0 = CaDsrUserCredentialsV3.this;
        }
    }


    public CaDsrUserCredentialsV3()
    {
        _logger = Logger.getLogger(CaDsrUserCredentialsV3.class.getName());
    }

    public void validateCredentials(String applUser_, String applPswd_, String localUser_, String localPswd_)
        throws Exception
    {
        initialize(applUser_, applPswd_);
        if(!isValidCredentials(localUser_, localPswd_))
        {
            incLock(localUser_);
            String msg = (new StringBuilder()).append("User is invalid ").append(localUser_).toString();
            _logger.info(msg);
            throw new Exception(msg);
        } else
        {
            clearLock(localUser_);
            return;
        }
    }

    public void initialize(String applUser_, String applPswd_)
        throws Exception
    {
        _applUser = applUser_;
        _applPswd = applPswd_;
        _checkCode = 0;
        try
        {
            Context envContext = new InitialContext();
            DataSource ds = (DataSource)envContext.lookup(_jndiName);
            _conn = ds.getConnection(_applUser, _applPswd);
            _pstmt = _conn.prepareStatement("select COUNT(*) from sbrext.tool_options_view_ext where tool_name = 'caDSR' and property in ('LOCKOUT.TIMER', 'LOCKOUT.THRESHOLD')");
            _rs = _pstmt.executeQuery();
            String msg = null;
            if(_rs.next())
            {
                int count = _rs.getInt(1);
                _checkCode = 3;
                switch(count)
                {
                case 0: // '\0'
                    msg = "Missing 'LOCKOUT.TIMER' and 'LOCKOUT.THRESHOLD' configuration values.";
                    break;

                case 1: // '\001'
                    msg = "Missing 'LOCKOUT.TIMER' or 'LOCKOUT.THRESHOLD' configuration values.";
                    break;

                case 2: // '\002'
                    msg = null;
                    _checkCode = 0;
                    break;

                default:
                    msg = "Too many 'LOCKOUT.TIMER' and 'LOCKOUT.THRESHOLD' configuration values.";
                    break;
                }
            } else
            {
                msg = (new StringBuilder()).append("Problem with database connection using ").append(_jndiName).toString();
                _checkCode = 4;
            }
            if(msg != null)
            {
                _logger.error(msg);
                throw new Exception(msg);
            }
        }
        catch(Exception ex)
        {
            _checkCode = 5;
            closeConn();
            throw ex;
        }
    }

    private void closeConn()
    {
        if(_rs != null)
        {
            try
            {
                _rs.close();
            }
            catch(Exception ex) { }
            _rs = null;
        }
        if(_pstmt != null)
        {
            try
            {
                _pstmt.close();
            }
            catch(Exception ex) { }
            _pstmt = null;
        }
        if(_conn != null)
        {
            try
            {
                _conn.close();
            }
            catch(Exception ex) { }
            _conn = null;
        }
    }

    private void doSQL(DBAction obj_)
    {        
        try
        {
            // Establish connection
            Context envContext = new InitialContext();
            DataSource ds = (DataSource)envContext.lookup(_jndiName);
            _conn = ds.getConnection(obj_.getConnectionUser(), obj_.getConnectionPswd());
            
            // Execute the SQL provided by the Work object.
            obj_.execute();
        }
        catch (SQLException ex)
        {
            exceptionMessage(obj_, ex, null);
        }
        catch (NamingException ex)
        {
            exceptionMessage(obj_, ex, "Can not establish a connection using " + _jndiName + " ");
        }
        catch (Exception ex)
        {
            exceptionMessage(obj_, ex, null);
        }
        finally
        {
            closeConn();
        }
    }

    private void exceptionMessage(DBAction obj_, Exception ex_, String msg_)
    {
        if(msg_ == null)
            _logger.error((new StringBuilder()).append(obj_.getClass().getName()).append(": ").append(exceptionMessage(ex_)).toString());
        else
            _logger.error((new StringBuilder()).append(obj_.getClass().getName()).append(": ").append(msg_).append(exceptionMessage(ex_)).toString());
        obj_.failure();
    }

    private String exceptionMessage(Exception ex_)
    {
        StackTraceElement ste[] = ex_.getStackTrace();
        StackTraceElement arr$[] = ste;
        int len$ = arr$.length;
        for(int i$ = 0; i$ < len$; i$++)
        {
            StackTraceElement element = arr$[i$];
            if(element.getClassName().startsWith(getClass().getName()))
                return (new StringBuilder()).append(ex_.toString()).append("\n").append(element.toString()).toString();
        }

        return "(could not locate class in stack trace)";
    }

    public boolean isLocked(String user_)
    {
        DBActionLockCheck lw = new DBActionLockCheck(user_);
        doSQL(lw);
        boolean flag = lw.getLock();
        if(flag)
            _checkCode = 1;
        return flag;
    }

    public boolean isValidCredentials(String user_, String pswd_)
    {
        DBActionValidateCreds vw = new DBActionValidateCreds(user_, pswd_);
        doSQL(vw);
        boolean flag = vw.isValid();
        if(flag)
            _checkCode = 2;
        return flag;
    }

    public void incLock(String user_)
    {
        _checkCode = 5;
        DBActionSetLock uw = new DBActionSetLock("update sbrext.users_lockout_view set LOCKOUT_COUNT = LOCKOUT_COUNT + 1, VALIDATION_TIME = SYSDATE where ua_name = ?", user_);
        doSQL(uw);
        if(uw.failed())
        {
            uw.trySql("insert into sbrext.users_lockout_view (ua_name, LOCKOUT_COUNT, VALIDATION_TIME) values (?, 1, SYSDATE)");
            doSQL(uw);
            if(!uw.failed())
                _checkCode = 0;
        } else
        {
            _checkCode = 0;
        }
    }

    public void clearLock(String user_)
    {
        DBActionSetLock iw = new DBActionSetLock("update sbrext.users_lockout_view set LOCKOUT_COUNT = 0, VALIDATION_TIME = SYSDATE where ua_name = ?", user_);
        doSQL(iw);
        if(iw.failed())
            _checkCode = 5;
        else
            _checkCode = 0;
    }

    public int getCheckCode()
    {
        return _checkCode;
    }

    public static void setJndiName(String jndi_)
    {
        if(jndi_.indexOf(':') > -1)
            _jndiName = jndi_;
        else
            _jndiName = (new StringBuilder()).append("java:/").append(jndi_).toString();
    }

}