import React, {Component, PropTypes, cloneElement} from 'react';
import userService from '../../services/user/UserService';
import Header from './Header';
import Footer from './Footer';
export default class AppLayout extends Component {
	constructor(props){
		super(props);
		this.checkUserIsLoggedIn = this.checkUserIsLoggedIn.bind(this);
		this.state = {
			userIsLoggedIn: false
		};
	}
	componentDidMount(){
		this.checkUserIsLoggedIn();
	}
	/* Most likely cause is that a new route was entered */
	componentWillReceiveProps(){
		this.checkUserIsLoggedIn();
	}
	checkUserIsLoggedIn(){
		userService.isUserLoggedIn().then(data =>{
			this.setState({
				userIsLoggedIn: data
			});
		});
	}

	render(){
		return (
			<div id="page-wrapper">
				<Header />

				<main id="main" className="container-fluid">
					{/* components from matched route are inserted here, pass in extra props to them */} {this.props.children && cloneElement(this.props.children, {userIsLoggedIn: this.state.userIsLoggedIn})};
				</main>

				<Footer />

			</div>
		);
	}
}

AppLayout.propTypes = {
	children: PropTypes.element
};
