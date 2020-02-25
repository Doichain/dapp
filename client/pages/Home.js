import React, { Fragment } from "react"
import PropTypes from 'prop-types'
import AccountsBox from "../components/AccountsBox"
import {useCurrentUser} from "react-meteor-hooks"
import Wallet from "./Wallet"

const Home = props => {
    return (
      <Fragment>
        {!useCurrentUser() ?
          <AccountsBox theme={props.theme} />
        : <Wallet theme={props.theme} />
        }
      </Fragment>
    )
}
Home.propTypes = {
  theme: PropTypes.string.isRequired
}
export default Home
