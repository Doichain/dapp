import React, { Component } from 'react'
import { AccountsReact } from 'meteor/meteoreact:accounts'
import DoichainVersion from "../../components/DoichainVersion";
class Footer extends Component {

  render () {
    const loggedIn = Meteor.userId()

    return (
      <footer>
        <DoichainVersion />
      </footer>
    )
  }
}
const isAuthRoute = (match, { pathname }) => {
  const { mapStateToRoute } = AccountsReact.config
  return Object.values(mapStateToRoute).find(route => route === pathname)
}
export default Footer
