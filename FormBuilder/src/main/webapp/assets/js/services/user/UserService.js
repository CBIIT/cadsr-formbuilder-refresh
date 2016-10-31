import Marionette from "backbone.marionette";
import {Model} from "backbone";
import ENDPOINT_URLS from '../../constants/ENDPOINT_URLS';
import {appChannel} from '../../channels/radioChannels';
import EVENTS from '../../constants/EVENTS';
import {fetchSecure} from '../../helpers/ajaXHelpers';

/**
 * This is service that maintains the state of user details and auth
 */
/*TODO move common methods out into a mixin/HOF or baseController/baseService */
const UserService = Marionette.Object.extend({
	channelName:   'user',
	radioRequests: {
		'isLoggedIn': 'isUserLoggedIn'
	},
	initialize() {
		const UserModel = Model.extend({});
		this.userModel = new UserModel();
		appChannel.reply(EVENTS.USER.GET_USERNAME, this.getUserName);
	},
	getUserName () {
		/* just a placeholer. will get from a model */
		return 'guest';
	},
	isUserLoggedIn(){
		return new Promise(
			(resolve) =>{
				fetchSecure({url: ENDPOINT_URLS.USERS.IS_USER_LOGGED_IN}).then((data) =>{
					resolve(data);
				});
			});
	}
});

const userService = new UserService();
export default userService;