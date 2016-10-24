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
                      <Link className="footer_link" to="/carts/cdecart">CDE Cart</Link>
                    </div>
                    <div className="_footer_menu_item">
                      <Link className="footer_link" to="/carts/modulecart">Module Cart</Link>
                    </div>
                    <div className="_footer_menu_item">
                      <Link className="footer_link" to="/carts/formcart">Form Cart</Link>
                    </div>
                  </div>
                  <div className="_footer_menubar">
                    <div className="_footer_menu_item">
                      Admin Tool
                    </div>
                    <div className="_footer_menu_item">
                      Curation Tool
                    </div>
                    <div className="_footer_menu_item">
                      Sentinel Tool
                    </div>
                  </div>
                  <div className="_footer_menubar">
                    <div className="_footer_menu_item">
                      NCI Metathesaurus
                    </div>
                    <div className="_footer_menu_item">
                      NCI Terminology <br /> Server
                    </div>
                    <div className="_footer_menu_item">
                      CDE Browser
                    </div>
                  </div>
                  <div className="_footer_menubar">
                    <div className="_footer_menu_item">
                      Help
                    </div>
                    <div className="_footer_menu_item">
                      Feedback
                    </div>
                    <div className="_footer_menu_item">
                      Contact Us
                    </div>
                  </div>
                  <div className="_footer_menubar">
                    <div className="_footer_menu_item">
                      About
                    </div>
                    <div className="_footer_menu_item">
                      Privacy Policy
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
