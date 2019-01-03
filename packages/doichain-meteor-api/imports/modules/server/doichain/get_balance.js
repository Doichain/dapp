import { Meteor } from 'meteor/meteor';
import { getBalance } from '../../../../server/api/doichain.js';
import { CONFIRM_CLIENT} from '../../../startup/server/doichain-configuration.js';


const get_Balance = () => {
    
  try {
    const bal=getBalance(CONFIRM_CLIENT);
    return bal;
    
  } catch(exception) {
    throw new Meteor.Error('doichain.getBalance.exception', exception);
  }
  return true;
};

export default get_Balance;

