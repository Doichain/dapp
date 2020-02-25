import {MetaCollection} from "meteor/doichain:doichain-meteor-api"
import {useTracker} from "react-meteor-hooks"

const Difficulty = () => {
    const meta = useTracker(() => MetaCollection.find({key:'difficulty'}).fetch());
    return (meta.length>0?(JSON.parse(meta[0].value)):'not available');
}

export default Difficulty;