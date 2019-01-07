import React from 'react'
import ReactDOM from 'react-dom'
import App from './app.js'
import '/imports/both/startup'
import { AccountsReact } from 'meteor/meteoreact:accounts'

Meteor.startup(() => {
  AccountsReact.style(Package['inspiraluna:useraccounts-react-material-ui'], true)

  const sub = Meteor.subscribe('users.user')

  const interval = setInterval(() => {
    if (sub.ready()) {
      clearInterval(interval)
      ReactDOM.render(
        <App />,
        document.getElementById('root')
      )
    }
  }, 333)
})
