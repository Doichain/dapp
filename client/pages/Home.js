import React, { Fragment } from "react"
import PropTypes from "prop-types"
import AccountsBox from "../components/AccountsBox"
import {useCurrentUser} from "react-meteor-hooks"
import User from "./User";

const Home = props => {
    console.log("theme",props)
    return (
      <Fragment>
        {!useCurrentUser() ?
          <AccountsBox theme={props.theme} />
        : <User theme={props.theme} />
        }
      </Fragment>
    )
}

Home.propTypes = {
  theme: PropTypes.string.isRequired
}

export default Home
