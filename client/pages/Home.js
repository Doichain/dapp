import React, { Fragment } from "react"
import PropTypes from "prop-types"
import AccountsBox from "../components/AccountsBox"
import {useCurrentUser} from "react-meteor-hooks"
import User from "./User";

const Home = props => {
    return (
      <Fragment>
        {!useCurrentUser() ?
          <AccountsBox theme={props.theme} />
        : <User theme={props.theme} />
        }
      </Fragment>
    )
}

export default Home
