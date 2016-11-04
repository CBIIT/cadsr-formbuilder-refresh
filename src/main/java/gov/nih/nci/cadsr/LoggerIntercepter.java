package gov.nih.nci.cadsr;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import gov.nih.nci.cadsr.authentication.AuthUtils;

public class LoggerIntercepter extends HandlerInterceptorAdapter {

	@Autowired
	AuthUtils authUtils;

	public boolean preHandle(HttpServletRequest request,

			HttpServletResponse response, Object handler) throws Exception {

		long startTime = System.currentTimeMillis();

		request.setAttribute("startTime", startTime);
		// if returned false, we need to make sure 'response' is sent
		return true;

	}

	public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler,
			ModelAndView modelAndView) {
		
		String userName;
		if (authUtils.getLoggedIn()) {

			userName = authUtils.getloggedinuser().getUsername();

		} else {
			userName = " Anonymous User";
		}
		
		long startTime = Long.valueOf(request.getAttribute("startTime").toString());

		System.out.println(("Request URL::" + request.getRequestURL().toString() + " | Time Taken::"
				+ (System.currentTimeMillis() - startTime)) + " ms | User Name:: " + userName);
		

	}
	/*
	 * public void afterCompletion(HttpServletRequest request,
	 * HttpServletResponse response, Object handler, Exception ex) throws
	 * Exception {
	 * 
	 * long startTime = (Long) request.getAttribute("startTime");
	 * System.out.println(("Request URL::" + request.getRequestURL().toString()
	 * + ":: End Time=" + System.currentTimeMillis())); System.out.println((
	 * "Request URL::" + request.getRequestURL().toString() + ":: Time Taken=" +
	 * (System.currentTimeMillis() - startTime))+" ms"); }
	 */

}
