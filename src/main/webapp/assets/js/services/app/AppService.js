import Marionette from "backbone.marionette";
import {Model} from "backbone";
import {appChannel} from '../../channels/radioChannels';
import EVENTS from '../../constants/EVENTS';

/**
 * This is a service object that maintains app-wide state, like an isBusy state conveying whether network operations are in progress. Other services currently aren't nested/initialized from this, but it's an option for the future if that helps.
 *
 * If/when we decide to remove Marionette, we can just turn this into a basic class/object, so try to avoid adding BB radio channels/events onto the radioRequests/radioEvents class property and instead add via initialize() to make refactoring easier later
 */
const AppService = Marionette.Object.extend({
	initialize() {
		const AppStateModel = Model.extend({});
		this.appStateModel = new AppStateModel();
		appChannel.reply(EVENTS.APP.SET_NETWORK_IS_IDLE, (options) => this.setNetworkIdleStatus(options));
	},
	setNetworkIdleStatus({networkIsIdle}) {
		/* Don't set state if it's not any different */
		if(networkIsIdle !== this.appStateModel.attributes.networkIsIdle) {
			this.appStateModel.set({networkIsIdle: networkIsIdle});
			appChannel.request(EVENTS.APP.NETWORK_IDLE_STATUS_CHANGED, {networkIsIdle: networkIsIdle});
		}
	}
});

const appService = new AppService();
export default appService;