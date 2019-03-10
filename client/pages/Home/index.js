import React, { Component, Fragment } from "react"
import PropTypes from "prop-types"
import AccountsBox from "/client/components/AccountsBox"
import User from "../User"

class Home extends Component {

  render () {
    const {
      user,
      theme
    } = this.props

    return (
      <Fragment>
        {!user ?
          <AccountsBox theme={theme} />
        : <User user={user} theme={theme} />
        }
      </Fragment>
    )
  }

}

Home.propTypes = {
  theme: PropTypes.string.isRequired
}

export default Home
