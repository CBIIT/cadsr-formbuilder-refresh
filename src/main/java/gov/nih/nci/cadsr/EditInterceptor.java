package gov.nih.nci.cadsr;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

public class EditInterceptor extends HandlerInterceptorAdapter {

	@Override

	public boolean preHandle(HttpServletRequest request,

			HttpServletResponse response, Object handler) throws Exception {
		if (Test.count == 0) {

			Test.count++;
		
		
			return true;
			

		}
		
		int x=Test.count;
		System.out.println("i am x"+x);
String redirectUrl =request.getContextPath()+"/api/v1/example/error";

		response.sendRedirect(redirectUrl);

		return false;

	}

	public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler,
			ModelAndView modelAndView) {

	Test.count = 0;
		System.out.println("i am post");
	}

}
