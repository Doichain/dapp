import React, { Fragment, useState } from "react"
import { BrowserRouter as Router, Route } from "react-router-dom"
/* Includes */

import Navbar from "./includes/Navbar"
import Footer from "./includes/Footer"

/* Pages */
import Home from "./pages/Home"
import Auth from "./pages/Auth"
import DoichainDrawer from "./includes/DoichainDrawer";
import Wallet from "./pages/Wallet";
import ConfirmationsPage from "./pages/ConfirmationsPage";
import User from "./pages/User";
import Settings from "./pages/Settings";

const App = () => {

    const [state] = useState({
        theme : "material-ui"
    });
    // <Route path='/permissions' component={PermissionsPage} />
    return (
      <Fragment>
        <Router>
          <Fragment>
              <DoichainDrawer />
              <Navbar />
              <div id='content'>
                  <Route exact path='/' render={props => (
                    <Home
                      {...props}
                    />
                  )} />

                    <Route path='/wallet' component={Wallet} />

                    <Route path='/confirmations' component={ConfirmationsPage} />
                    <Route path='/users' component={User} />
                    <Route path='/settings' component={Settings} />

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

