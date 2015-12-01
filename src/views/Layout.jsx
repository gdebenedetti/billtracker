/**
 * Module Dependencies
 */

import React, { Component } from 'react'
import { IndexLink } from 'react-router'

export default class Layout extends Component {
  render() {
    return <div>
            <div className="top-bar" id="realEstateMenu">
               <div className="top-bar-left">
                  <ul className="menu" data-responsive-menu="accordion">
                    <li className="menu-text">
                      <IndexLink to="/">Billtracker</IndexLink>
                    </li>
                  </ul>
               </div>
               <div className="top-bar-right">
                  <ul className="menu">
                     <li><a className="button">Login</a></li>
                  </ul>
               </div>
            </div>
            <br />
            {this.props.children}
            <footer>
               <div className="row">
                  <div className="medium-6 columns">
                     <ul className="menu">
                        <li><a href="#">Términos y condiciones</a></li>
                     </ul>
                  </div>
                  <div className="medium-6 columns">
                     <ul className="menu float-right">
                        <li className="menu-text">Democracia en Red</li>
                        <li className="menu-text">Directorio Legislativo</li>
                     </ul>
                  </div>
               </div>
            </footer>
          </div>;
  }
}