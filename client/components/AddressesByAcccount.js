import React  from 'react'
import {MetaCollection} from "meteor/doichain:doichain-meteor-api"
import {useSubscription,useTracker} from "react-meteor-hooks"

const AddressesByAccount = () => {
  const loading = useSubscription('meta');
  const meta = useTracker(() => MetaCollection.find({key:'addresses_by_account'}).fetch());

  if(!loading){
    const addresses = meta.length>0?Object.keys(meta[0].value):['empty']
      
    
    const AddressItems = () => (
          <select size={20}>
            {
             addresses?addresses.map(function(item) {
              return <option key={item}>{item}</option>;
            }):null //return <option key={item}>{item}</option>;
            }
          </select>
      );
      return (<AddressItems/>)
  }else return null

}

export default AddressesByAccount