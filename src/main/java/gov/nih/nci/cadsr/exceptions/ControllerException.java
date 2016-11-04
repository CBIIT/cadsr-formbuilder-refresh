package gov.nih.nci.cadsr.exceptions;

public class ControllerException extends RuntimeException {
	private static final long serialVersionUID = 1L;
	String message;

	public ControllerException(final String message) {

		super(message);

	}

	public ControllerException(final String message, final Throwable throwable) {
		super(message, throwable);
	}
}
