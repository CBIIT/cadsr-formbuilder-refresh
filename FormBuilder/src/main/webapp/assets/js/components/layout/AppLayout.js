import React, {Component, PropTypes, cloneElement} from 'react';
import {withRouter} from 'react-router';
import userService from '../../services/user/UserService';
import Header from './Header';
import Footer from './Footer';

class AppLayout extends Component {
	constructor(props){
		super(props);
		this.state = {
			userIsLoggedIn: false
		};
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
	}

	/* Most likely cause is that a new route was entered */
	componentWillReceiveProps(nextProps){
		/* check if user is logged in if the page/route changed (via react router) */
		if(nextProps.location.pathname !== this.props.location.pathname){
			this.checkUserIsLoggedIn();
		}
	}

	render(){
		return (
			<div id="page-wrapper">
				<Header />

				<main id="main" className="container-fluid">
					{/* components from matched route are inserted here, pass in extra props to them */} {this.props.children && cloneElement(this.props.children, {userIsLoggedIn: this.state.userIsLoggedIn})}
				</main>

				<Footer />

			</div>
		);
	}
}

export default withRouter(AppLayout);

AppLayout.propTypes = {
	children: PropTypes.element
};
