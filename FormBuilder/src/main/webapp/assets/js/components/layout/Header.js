import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';
import userService from  "../../services/user/UserService";

class Header extends Component {
  constructor(props) {
    super(props);
    this.renderUser = this.renderUser.bind(this);
    this.renderReturnButton = this.renderReturnButton.bind(this);
    this.renderCarts = this.renderCarts.bind(this);
    this.renderTools = this.renderTools.bind(this);
    this.state = {
		userName: ""
	};
  }
  
	componentDidMount() {
		userService.getUserName().then((username) =>{
			if (username == "") {
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

	renderReturnButton() {
		if (this.props.location != "/") {
			return (
				<Link to="/" className="footer_link">RETURN TO SEARCH</Link>
			);
		}
		else {
			return (
				<span />
			);
		}
	}
	
	renderCarts() {
		return (
			<div className="dropdown" id="cartsDropdown">
			  <span>CARTS <span className="glyphicon glyphicon-chevron-down"></span></span>
			  <div className="dropdown-content">
			  	<Link to="/carts/cdecart">CDE Cart</Link>
			  	<Link to="/carts/modulecart">Module Cart</Link>
			  	<Link to="/carts/formcart">Form Cart</Link>
			  </div>
			</div>
		);
	}
	
	renderTools() {
		return (
			<div className="dropdown" id="toolsDropdown">
			  <span>TOOLS <span className="glyphicon glyphicon-chevron-down"></span></span>
			  <div className="dropdown-content">
			  <a href={externalDomains.cdeBrowser} target="_blank">CDE Browser</a>
			  	<a href={externalDomains.cdeCurate} target="_blank">Curation Tool</a>
			  	<a href={externalDomains.cadsrsentinel} target="_blank">Sentinel Tool</a>
			  	<a href={externalDomains.cadsradmintool} target="_blank">Admin Tool</a>
			  	<a href={externalDomains.terminology} target="_blank">NCI Terminology Server</a>
                <a href={externalDomains.metaThesaurus} target="_blank">NCI Metathesaurus</a>
			  </div>
			</div>
		);
	}
	
	renderUser() {
		if (this.state.userName == "") {
			return (
				<div className="navbar-links-account">
					<span id="nav-access">
						<a href={externalDomains.contact}>Request Access</a>
					</span>
					
					<span id="nav-signIn">
						<a href="/FormBuilder/spring_security_login" className="">Sign In</a>
					</span>
				</div>
			);
		}
		else {
			return (
				<div className="navbar-links-account">
					<span id="welcome">
						Welcome, {this.state.userName}
					</span>
					
					<span id="welcome-divider">
					|
					</span>
					
					<span id="signOut">
						<a href="/FormBuilder/perform_logout" className="">Sign Out</a>
					</span>
				</div>
			);
		}
	}
  
  render(){
    return (
        <header id="header" className="navbar navbar-static-top">
        <div className="app-nav banner">
          <div className="container">
            <nav className="nav">
              <div className="header center-v-spread-h">
                <Link className="application-logo logo-image" aria-hidden="true" to="/">NIH</Link>
                <div className="navbar-links">
	              	{this.renderUser()}
                </div>
              </div>
              <div className="navbar-subheader">
              	<div className="navbar-subheader-links">
              		{this.renderReturnButton()}
              		{this.renderCarts()}
              		{this.renderTools()}
              	</div>
              </div>
            </nav>
          </div>
        </div>
      </header>
    );
  }
}


Header.propTypes = {
	location: PropTypes.string
};

export default Header;

