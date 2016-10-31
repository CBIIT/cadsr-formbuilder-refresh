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
                      <a href="https://cadsradmintool-stage.nci.nih.gov" className="footer_link">Admin Tool</a>
                    </div>
                    <div className="_footer_menu_item">
                      <a href="https://cdecurate-stage.nci.nih.gov/cdecurate/" className="footer_link">Curation Tool</a>
                    </div>
                    <div className="_footer_menu_item">
                      <a href="https://cadsrsentinel-stage.nci.nih.gov/cadsrsentinel/" className="footer_link">Sentinel Tool</a>
                    </div>
                  </div>
                  <div className="_footer_menubar">
                    <div className="_footer_menu_item">
                      <a href="https://ncim.nci.nih.gov/ncimbrowser/" className="footer_link">NCI Metathesaurus</a>
                    </div>
                    <div className="_footer_menu_item">
                      <a href="https://ncit.nci.nih.gov/ncitbrowser/pages/multiple_search.jsf;jsessionid=8FF581BFE2062B8D2F01C46783615729?nav_type=terminologies" className="footer_link">NCI Terminology <br /> Server</a>
                    </div>
                    <div className="_footer_menu_item">
                      <a href="https://cdebrowser-stage.nci.nih.gov/cdebrowserClient/cdeBrowser.html#/search" className="footer_link">CDE Browser</a>
                    </div>
                  </div>
                  <div className="_footer_menubar">
                    <div className="_footer_menu_item">
                      <a href="https://wiki.nci.nih.gov/display/caDSR/Form+Builder+User+Guide;WIKISESSIONID=8A5414E4B37FA20BFCED9448A038C30E" className="footer_link">Help</a>
                    </div>
                    <div className="_footer_menu_item">
                      <a href="mailto:ncicbiit@mail.nih.gov" className="footer_link">Feedback</a>
                    </div>
                    <div className="_footer_menu_item">
                      <a href="ncicbiit@mail.nih.gov" className="footer_link">Contact Us</a>
                    </div>
                  </div>
                  <div className="_footer_menubar">
                    <div className="_footer_menu_item">
                      <a href="https://wiki.nci.nih.gov/display/caDSR/caDSR+Form+Builder" className="footer_link">About</a>
                    </div>
                    <div className="_footer_menu_item">
                      <a href="https://wiki.nci.nih.gov/display/caDSR/caDSR+Privacy+Policy+Statement" className="footer_link">Privacy Policy</a>
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
