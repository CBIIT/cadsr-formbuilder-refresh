import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';

class Header extends Component {
  constructor(props) {
    super(props);
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
                  <li id="nav-signIn">Welcome, Guest</li>
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

