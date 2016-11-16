import React, {Component} from 'react';
import {Link} from 'react-router';

export default class Footer extends Component {

  render(){
    return (

        <footer className="footer_mc">
          <div className="_footer ">
            <div className="container-fluid banner">
              <div className="container">
              </div>
            </div>
            {/* START Main Footer Navigation */}
            <div className="_footer_menu_mc">
              <div className="container">
                <div className="_footer_menu">
                  <div className="_footer_menubar">
                    <div className="_footer_menu_item">
                      <a href={externalDomains.feedback} className="footer_link">Feedback</a>
                    </div>
                    <div className="_footer_menu_item">
                      <a href={externalDomains.help} className="footer_link" target="_blank">Help</a>
                    </div>
                  </div>
                  <div className="_footer_menubar">
                    <div className="_footer_menu_item">
                      <a href={externalDomains.about} className="footer_link" target="_blank">About</a>
                    </div>
                    <div className="_footer_menu_item">
                      <a href={externalDomains.contact} className="footer_link">Contact Us</a>
                    </div>
                  </div>
                  <div className="_footer_menubar">
                    <div className="_footer_menu_item">
                      <a href={externalDomains.privacy} className="footer_link" target="_blank">Privacy Policy</a>
                    </div>
                    <div className="_footer_menu_item">
                      Versions 5.0.0
                    </div>
                  </div>
                </div>
              </div>
            </div>{/* END Main Footer Navigation */}
          </div>
        </footer>
    );
  }
}
