import {MetaCollection} from "meteor/doichain:doichain-meteor-api"
import {useTracker} from "react-meteor-hooks"

const Blocks = () => {
    const meta = useTracker(() => MetaCollection.find({key:'blocks'}).fetch());
    return (meta.length>0?JSON.parse(meta[0].value):'not available');
}

export default Blocks;