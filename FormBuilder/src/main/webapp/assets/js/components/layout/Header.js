import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import userService from  "../../services/user/UserService";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
		userName: ""
	};
  }
  
	componentDidMount() {
		userService.getUserName().then((username) =>{
			if (username == "") {
				console.log("user is not logged in");
				this.setState({
					userName: "Guest"
				});
			}
			else {
				this.setState({
					userName: username
				});
			}
		});
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
                  <li id="nav-signIn">Welcome, {this.state.userName}</li>
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

