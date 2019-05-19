import React, { Component, Fragment, useState } from "react"
import { BrowserRouter as Router, Route } from "react-router-dom"
/* Includes */

import Navbar from "./includes/Navbar"
import Footer from "./includes/Footer"

/* Pages */

import Home from "./pages/Home"
import Auth from "./pages/Auth"

const App = props => {

    const [state, setState] = useState({
        theme : "material-ui"
    });
    return (
      <Fragment>
        <Navbar />
        <Router>
          <Fragment>

            <div id='content'>
              <Route exact path='/' render={props => (
                <Home
                  theme={state.theme}
                  {...props}
                />
              )} />

              <Auth
                theme={state.theme}
              />
            </div>
            <Route path='*' component={Footer} />
          </Fragment>
        </Router>
      </Fragment>
    )
}

export default App;