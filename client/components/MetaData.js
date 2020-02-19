import {MetaCollection} from "meteor/doichain:doichain-meteor-api"
import {useTracker} from "react-meteor-hooks"


const MetaData = props => {
    const meta = useTracker(() => MetaCollection.find({key:props.metakey}).fetch());
    return ((meta.length>0)?meta[0].value:'not available');
}

export default MetaData;