import { Meteor } from 'meteor/meteor';
import { getBalance } from '../../../../server/api/doichain.js';
import { CONFIRM_CLIENT} from '../../../startup/server/doichain-configuration.js';


const get_Balance = () => {
    
  try {
    console.log("and this");
    const bal=getBalance(CONFIRM_CLIENT);
    console.log(bal);
    return bal;
    
  } catch(exception) {
    throw new Meteor.Error('doichain.getBalance.exception', exception);
  }
  return true;
};

export default get_Balance;

