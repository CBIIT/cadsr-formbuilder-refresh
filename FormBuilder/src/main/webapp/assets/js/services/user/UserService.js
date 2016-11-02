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
		if(userModel.attributes.username){
			return Promise.resolve(userModel.attributes.username);
		}
		else{
			return fetchSecure({url: ENDPOINT_URLS.USERS.USER, swallowErrors:false, dataType:"json"}).then((data) =>{
				let username = "";
				if (data != null) {
					userModel.set(data);
					username = data.username;
				}
				return Promise.resolve(username);
			});
		}
	},
	
	isUserLoggedIn(){
		const that = this;
		return new Promise(
			(resolve) =>{
				that.getUserName().then((data) =>{
					const IsLoggedIn = Boolean(data);
					resolve(IsLoggedIn);
				});
		});
	}
});

const userService = new UserService();
export default userService;