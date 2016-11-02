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
	initialize() {
		const UserModel = Model.extend({});
		this.userModel = new UserModel();
	},
	getUserName() {
		const userModel = this.userModel;
		return new Promise(
				(resolve) =>{
					if(userModel.attributes.username){
						resolve(userModel.attributes.username);
					}
					else{
						fetchSecure({url: ENDPOINT_URLS.USERS.USER, swallowErrors:false, dataType:"text"}).then((data) =>{
							let username = "";
							if (data.status != 401) {
								username = data.text;
								userModel.set(username);
							}
							resolve(username);
						});
					}
				}
			);
	},
	isUserLoggedIn(){
		const that = this;
		return new Promise(
			(resolve) =>{
				that.getUserName().then((data) =>{
					const IsLoggedIn = Boolean(data);
					resolve(IsLoggedIn);
				});
				/*fetchSecure({url: ENDPOINT_URLS.USERS.IS_USER_LOGGED_IN}).then((data) =>{
				 resolve(data);
				 });*/
		});
	}
});

const userService = new UserService();
export default userService;