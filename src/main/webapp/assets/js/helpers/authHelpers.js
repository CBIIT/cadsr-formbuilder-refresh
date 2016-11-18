import userService from  "../services/user/UserService";


/**
 * Calls endpoint to check whether a user is logged in or not. If so executes callback passed in by React Router. If not, navigates the user to the login page.
 * @param nextState
 * @param replace
 * @param callback
 * @returns {*|Promise.<TResult>}
 */
export const RedirectToLoginIfNotLoggedIn = (nextState, replace, callback) => {
	userService.isUserLoggedIn().then(data =>{
		if (data === true) {
			callback();
		}
		else {
			/*Refreshing the page instead of telling react router to redirect to this, because the login page isn't in the SPA */
			window.location.href = "/FormBuilder/spring_security_login";
		}
	});
};