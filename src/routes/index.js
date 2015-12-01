/**
 * Module Dependencies
 */

import React from 'react'
import { Router, Route, IndexRoute } from 'react-router'
import createBrowserHistory from 'history/lib/createBrowserHistory'
import Homepage from 'src/views/Homepage'
import Layout from 'src/views/Layout'
import LawMainView from 'src/views/LawMainView'

export default class Routes extends React.Component {
  render() {
    return <Router history={createBrowserHistory()}>
        <Route path="/" component={Layout}>
          <IndexRoute component={Homepage} />
          <Route path="/leyes/:slug" component={LawMainView} />
        </Route>
      </Router>
  }
}
