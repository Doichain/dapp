import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import { AccountsReact } from 'meteor/meteoreact:accounts'

class Footer extends Component {

  render () {
    const loggedIn = Meteor.userId()

    return (
      <footer>
        <ul className='options'>
          {!loggedIn && (
            <li>
              <NavLink exact to='/sign-in' activeClassName='hide' isActive={isAuthRoute}>
                Try with react-router
              </NavLink>
            </li>)}
          {!loggedIn && <li><NavLink exact to='/' activeClassName='hide'>Try without react-router</NavLink></li>}
        </ul>
        <ul className='links'>
          <li className='icon'>
            <a target='__blank' href='https://github.com/royGil/useraccounts-react'>
              <i className='fab fa-github' />
            </a>
          </li>
        </ul>
      </footer>
    )
  }
}

const isAuthRoute = (match, { pathname }) => {
  const { mapStateToRoute } = AccountsReact.config
  return Object.values(mapStateToRoute).find(route => route === pathname)
}

export default Footer
