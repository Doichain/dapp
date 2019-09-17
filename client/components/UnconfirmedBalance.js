import React  from 'react'
import {MetaCollection} from "meteor/doichain:doichain-meteor-api"
import {useSubscription,useTracker} from "react-meteor-hooks"

const UnconfirmedBalance = props => {
  const loading = useSubscription('meta');
  const meta = useTracker(() => MetaCollection.find({key:'unconfirmed_balance'}).fetch());
  //console.log(meta)
  return (meta.length>0?JSON.parse(meta[0].value?meta[0].value:0):'0');
}

export default UnconfirmedBalance