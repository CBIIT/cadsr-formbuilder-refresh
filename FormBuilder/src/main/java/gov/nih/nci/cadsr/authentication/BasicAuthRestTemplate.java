package gov.nih.nci.cadsr.authentication;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpRequest;
import org.springframework.http.client.ClientHttpRequestExecution;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.http.client.InterceptingClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

import gov.nih.nci.cadsr.FormBuilderProperties;

import java.io.IOException;
import java.util.Base64;
import java.util.Collections;
import java.util.List;

/**
 * {@code RestTemplate} supporting Basic Authentication.
 * 
 * Simply extract the Basic Authentication feature from {@code TestRestTemplate}.
 * 
 * Created by izeye on 15. 7. 1..
 */
public class BasicAuthRestTemplate extends RestTemplate {
	
	@Autowired
	private FormBuilderProperties props;
	
	public BasicAuthRestTemplate(String username, String password) {
		addAuthentication(username, password);
	}
	
	public BasicAuthRestTemplate() {
		
//		addAuthentication(props.getServiceUsername(), props.getServicePassword());
		addAuthentication("F0RMBU1LD3R", "F0RMBU1LD3R");
	}

	private void addAuthentication(String username, String password) {
		if (username == null) {
			return;
		}
		List<ClientHttpRequestInterceptor> interceptors = Collections
				.<ClientHttpRequestInterceptor> singletonList(
						new BasicAuthorizationInterceptor(username, password));
		setRequestFactory(new InterceptingClientHttpRequestFactory(getRequestFactory(),
				interceptors));
	}

	private static class BasicAuthorizationInterceptor implements
			ClientHttpRequestInterceptor {

		private final String username;

		private final String password;

		public BasicAuthorizationInterceptor(String username, String password) {
			this.username = username;
			this.password = (password == null ? "" : password);
		}

		@Override
		public ClientHttpResponse intercept(HttpRequest request, byte[] body,
				ClientHttpRequestExecution execution) throws IOException {
			byte[] token = Base64.getEncoder().encode(
					(this.username + ":" + this.password).getBytes());
			request.getHeaders().add("Authorization", "Basic " + new String(token));
			return execution.execute(request, body);
		}

	}
	
}
