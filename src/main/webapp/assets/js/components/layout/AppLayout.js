import React, {Component, PropTypes} from 'react';
import Header from './Header';
import Footer from './Footer';
export default class AppLayout extends Component {
  constructor(props){
    super(props);
  }
  render(){
    return (
        <div id="page-wrapper">
          <Header />

            <main id="main" className="container-fluid">
              {/* components from matched route are inserted here  */}
              {this.props.children}
          </main>

          <Footer />

        </div>
    );
  }
}

AppLayout.propTypes = {
  children: PropTypes.element
};
