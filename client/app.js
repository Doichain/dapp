import React, { Component, Fragment } from "react"
import { BrowserRouter as Router, Route } from "react-router-dom"
import { withTracker } from "meteor/react-meteor-data"


/* Includes */

import Navbar from "./includes/Navbar"
import Footer from "./includes/Footer"

/* Pages */

import Home from "./pages/Home"
import Auth from "./pages/Auth"

class App extends Component {

  state = {
    theme : "material-ui"
  }

  render () {
    const { user }  = this.props
    const { theme } = this.state

    return (
      <Fragment>
        <Navbar
          user={user}
        />
        <Router>
          <Fragment>

            <div id='content'>
              <Route exact path='/' render={props => (
                <Home
                  user={user}
                  theme={theme}
                  {...props}
                />
              )} />

              <Auth
                theme={theme}
              />
            </div>
            <Route path='*' component={Footer} />
          </Fragment>
        </Router>
      </Fragment>
    )
  }
}

export default withTracker(() => {
  return {
    user: Meteor.user()
  }
})(App)
