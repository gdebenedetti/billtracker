/**
 * Module Dependencies
 */

import '!style!css!foundation-sites/dist/foundation.css'
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import AppRoutes from 'src/routes'

const app = document.createElement('div');
document.body.appendChild(app);

class Root extends Component {
  render() {
    return <AppRoutes />
  }
}

ReactDOM.render(<Root />, app);
