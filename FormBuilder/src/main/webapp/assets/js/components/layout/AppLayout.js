import React, {Component, PropTypes, cloneElement} from 'react';
import {withRouter} from 'react-router';
import NotificationSystem from 'react-notification-system';
import userService from '../../services/user/UserService';
import {appChannel} from '../../channels/radioChannels';
import MessageModal from '../modals/MessageModal';
import EVENTS from '../../constants/EVENTS';
import Header from './Header';
import Footer from './Footer';

class AppLayout extends Component {
	constructor(props){
		super(props);
		this.showUserMessage = this.showUserMessage.bind(this);
		this.hideUserMessage = this.hideUserMessage.bind(this);
		this.state = {
			userIsLoggedIn:       false,
			showLoadingIndicator: false
		};
		this._notificationSystem = null;
	}

	checkUserIsLoggedIn(){
		userService.isUserLoggedIn().then(data =>{
			this.setState({
				userIsLoggedIn: data
			});
		});
	}

	componentDidMount(){
		this.checkUserIsLoggedIn();
		appChannel.reply(EVENTS.APP.SHOW_USER_MESSAGE, function(config){
			return this.showUserMessage(config);
		}, this);
		appChannel.reply(EVENTS.APP.HIDE_USER_MESSAGE, function(uid){
			this.hideUserMessage(uid);
		}, this);
		appChannel.reply(EVENTS.APP.NETWORK_IDLE_STATUS_CHANGED, ({networkIsIdle}) =>{
			this.setState({showLoadingIndicator: !networkIsIdle});
		});
		this._notificationSystem = this.refs.notificationSystem;
	}

	/* Most likely cause is that a new route was entered */
	componentWillReceiveProps(nextProps){
		/* check if user is logged in if the page/route changed (via react router) */
		if(nextProps.location.pathname !== this.props.location.pathname){
			this.checkUserIsLoggedIn();
		}
	}

	showUserMessage(config) {
		return this._notificationSystem.addNotification(config);
	}

	hideUserMessage(uid) {
		this._notificationSystem.removeNotification(uid);
	}

	render(){
		return (
			<div id="page-wrapper">
				<Header location={this.props.location.pathname} />

				<main id="main" className="container-fluid">
					{/* components from matched route are inserted here, pass in extra props to them */} {this.props.children && cloneElement(this.props.children, {userIsLoggedIn: this.state.userIsLoggedIn})}
				</main>

				<Footer />
				<NotificationSystem ref="notificationSystem" />
				<MessageModal />
				<div id="page-busy-indicator" className={(this.state.showLoadingIndicator ? "" : "hidden")} />
			</div>
		);
	}
}

export default withRouter(AppLayout);

AppLayout.propTypes = {
	children: PropTypes.element
};
