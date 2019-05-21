import React  from 'react'
import {MetaCollection} from "meteor/doichain:doichain-meteor-api"
import {useSubscription,useTracker} from "react-meteor-hooks"

const Blocks = props => {
    const loading = useSubscription('meta');
    const meta = useTracker(() => MetaCollection.find({key:'blocks'}).fetch());
    return (meta.length>0?JSON.parse(meta[0].value).blocks:'not available');
}

export default Blocks;