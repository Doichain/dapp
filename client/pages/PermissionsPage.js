import React  from 'react'
import {MetaCollection} from "meteor/doichain:doichain-meteor-api"
import {useSubscription,useTracker} from "react-meteor-hooks"
import Permissions from "../components/Permissions";

const PermissionsPage = props => {

    return (
        <React.Fragment>
            <Permissions/>
        </React.Fragment>
    )
}

export default PermissionsPage;