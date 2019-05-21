import React  from 'react'
import {MetaCollection} from "meteor/doichain:doichain-meteor-api"
import {useSubscription,useTracker} from "react-meteor-hooks"

const Difficulty = props => {

    const loading = useSubscription('meta')
    const meta = useTracker(() => MetaCollection.find({key:'network'}).fetch());
    return (meta.length>0?(JSON.parse(meta[0].value).difficulty):'not available');
}

export default Difficulty;