import React, { Component } from "react";
import PropTypes from 'prop-types'
import { AccountsReactComponent } from "meteor/meteoreact:accounts";

class AccountsBox extends Component {

  render () {
      const {
        theme,
      state
    } = this.props

    return (
        <div id="accounts-wrapper" className={theme}>
            <AccountsReactComponent key={theme} state={state} />
        </div>
    )
  }

}

AccountsBox.propTypes = {
  theme: PropTypes.string,
  state: PropTypes.object
}
export default AccountsBox
