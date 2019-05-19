import React  from 'react'
import Typography from "@material-ui/core/Typography"
import {MetaCollection} from "meteor/doichain:doichain-meteor-api"
import {useSubscription,useTracker} from "react-meteor-hooks"

const DoichainVersion = props => {

    const loading = useSubscription('meta');
    const meta = useTracker(() => MetaCollection.find({key:'version'}).fetch());
    return (
        <Typography variant="subtitle1" color="inherit">
           Version: {meta.length>0?JSON.parse(meta[0].value).version+
            ' ('+JSON.parse(meta[0].value).timestamp+')': ''}
        </Typography>
    );
}

export default DoichainVersion;