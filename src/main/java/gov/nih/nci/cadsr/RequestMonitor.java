package gov.nih.nci.cadsr;



	
    import java.io.IOException;

    import javax.servlet.Filter;
    import javax.servlet.FilterChain;
    import javax.servlet.FilterConfig;
    import javax.servlet.ServletException;
    import javax.servlet.ServletRequest;
    import javax.servlet.ServletResponse;
    import javax.servlet.http.HttpServletRequest;

    public class RequestMonitor implements Filter {

                    @Override
                    public void destroy() {
                                    // ...
                    }

                    @Override
                    public void init(FilterConfig filterConfig) throws ServletException {
                                    //
                    }

                    @Override
                    public void doFilter(ServletRequest request,
                   ServletResponse response, FilterChain chain)
                                    throws IOException, ServletException {

                                    try {
                                                    long start = System.currentTimeMillis();
                                                    chain.doFilter(request, response);
                                                    long finish = System.currentTimeMillis();
                                                    
                                                    if(request instanceof HttpServletRequest) {
                                                                    HttpServletRequest httpRequest = (HttpServletRequest) request;
                                                                    
                                                                    String requestPath = httpRequest.getScheme() + "://" +
                                                                 httpRequest.getServerName() + 
                                                                 ("http".equals(httpRequest.getScheme()) && httpRequest.getServerPort() == 80 || "https".equals(httpRequest.getScheme()) && httpRequest.getServerPort() == 443 ? "" : ":" + httpRequest.getServerPort() ) +
                                                                 httpRequest.getRequestURI() +
                                                                (httpRequest.getQueryString() != null ? "?" + httpRequest.getQueryString() : "");
                                                                    
                                                                    System.out.println("Served Request ["+(finish-start)+" ms] "+ requestPath);
                                                    }

                                                    
                                    } catch (Exception ex) {
                                                    request.setAttribute("errorMessage", ex);
                                                    request.getRequestDispatcher("/WEB-INF/views/jsp/error.jsp")
                                   .forward(request, response);
                                    }

                    }

    }

