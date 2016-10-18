import React, {Component, PropTypes} from 'react';

class Header extends Component {
  constructor(props) {
    super(props);
  }
  render(){
    return (
        <div className="app-nav banner">
          <div className="container">
            <nav className="nav">
              <div className="navbar-header">
                <a className="application-logo logo-image" aria-hidden="true" href="#">NIH</a>
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
    );
  }
}


Header.propTypes = {
};

export default Header;

