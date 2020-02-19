import {MetaCollection} from "meteor/doichain:doichain-meteor-api"
import {useTracker} from "react-meteor-hooks"
import {BLOCKCHAIN_INFO_VAL_CHAIN} from "meteor/doichain:doichain-meteor-api";

const Chain = () => {
    const meta = useTracker(() => MetaCollection.find({key:BLOCKCHAIN_INFO_VAL_CHAIN}).fetch());
    return ((meta.length>0)?meta[0].value:'not available');

}

export default Chain;