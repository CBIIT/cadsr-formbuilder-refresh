import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import userService from  "../../services/user/UserService";

class Header extends Component {
  constructor(props) {
    super(props);
    this.renderUser = this.renderUser.bind(this);
    this.state = {
		userName: ""
	};
  }
  
	componentDidMount() {
		userService.getUserName().then((username) =>{
			if (username == "") {
				console.log("user is not logged in");
				this.setState({
					userName: ""
				});
			}
			else {
				this.setState({
					userName: username
				});
			}
		});
	}
	
	renderUser() {
		if (this.state.userName == "") {
			return (
				<li id="nav-signIn">
					<Link to="/spring_security_login" className="footer_link">Sign In</Link>
				</li>
			);
		}
		else {
			return (
				<li id="nav-signIn">
					Welcome, {this.state.userName}
				</li>
			);
		}
	}
  
  render(){
    return (
        <header id="header" className="navbar navbar-static-top">
        <div className="app-nav banner">
          <div className="container">
            <nav className="nav">
              <div className="navbar-header">
                <Link className="application-logo logo-image" aria-hidden="true" to="/">NIH</Link>
              </div>
              <div className="navbar-subheader">
                <ul>
                  <li id="nav-access" />
                  {this.renderUser()}
                </ul>
              </div>
            </nav>
          </div>
        </div>
      </header>
    );
  }
}


Header.propTypes = {
};

export default Header;

