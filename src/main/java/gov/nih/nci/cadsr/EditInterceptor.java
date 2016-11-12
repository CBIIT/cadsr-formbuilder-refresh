package gov.nih.nci.cadsr;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

public class EditInterceptor extends HandlerInterceptorAdapter {

	@Override

	public boolean preHandle(HttpServletRequest request,

			HttpServletResponse response, Object handler) throws Exception {
		if (EditInterceptorCount.count == 0) {

			EditInterceptorCount.count++;
			return true;

		}

		String redirectUrl = request.getContextPath() + "/api/v1/error";

		response.sendRedirect(redirectUrl);

		return false;

	}

	public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler,
			ModelAndView modelAndView) {

		EditInterceptorCount.count = 0;
		System.out.println("i am post");
	}

}
