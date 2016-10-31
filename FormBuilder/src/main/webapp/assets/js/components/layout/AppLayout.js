import React, {Component, PropTypes, cloneElement} from 'react';
import userService from '../../services/user/UserService';
import Header from './Header';
import Footer from './Footer';
export default class AppLayout extends Component {
	constructor(props){
		super(props);
		this.state = {
			userIsLoggedIn: false
		};
	}

	componentDidMount(){
		userService.isUserLoggedIn();
	}

	/* Most likely cause is that a new route was entered */
	componentWillReceiveProps(nextProps){
		/* check if user is logged in if the page/route changed (via react router) */
		if(nextProps.location.pathname !== this.props.location.pathname){
			userService.isUserLoggedIn();
		}
	}

	render(){
		return (
			<div id="page-wrapper">
				<Header />

				<main id="main" className="container-fluid">
					{/* components from matched route are inserted here, pass in extra props to them */} {this.props.children}
				</main>

				<Footer />

			</div>
		);
	}
}

AppLayout.propTypes = {
	children: PropTypes.element
};
