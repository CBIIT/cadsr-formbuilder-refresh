package gov.nih.nci.cadsr.exceptions;

import org.apache.log4j.Logger;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@ControllerAdvice(annotations = RestController.class)
public class ExceptionControllerAdvice {
	private static final Logger logger = Logger.getLogger(ExceptionControllerAdvice.class);

	/*@ExceptionHandler(RuntimeException.class)
	@ResponseBody
	private ResponseEntity<ErrorResponse> createErrorResponse(final Exception badReq) {
		ErrorResponse error = new ErrorResponse();
		error.setErrorCode(HttpStatus.INTERNAL_SERVER_ERROR.value());
		error.setMessage(badReq.getMessage());
		logger.error("Exception occured :", badReq);
		return new ResponseEntity<ErrorResponse>(error, HttpStatus.BAD_REQUEST);
	}*/

}
