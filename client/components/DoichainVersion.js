import React  from 'react'
import Typography from "@material-ui/core/Typography"
import {MetaCollection} from "meteor/doichain:doichain-meteor-api"
import {useTracker} from "react-meteor-hooks"

const DoichainVersion = () => {

    const meta = useTracker(() => MetaCollection.find({key:'version'}).fetch());
    return (
        <Typography variant="subtitle1" color="inherit">
           Doichain Version: {meta.length>0?JSON.parse(meta[0].value).version+
            ' ('+JSON.parse(meta[0].value).timestamp+')': ''}
        </Typography>
    );
}

export default DoichainVersion;