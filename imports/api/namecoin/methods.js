import { ValidatedMethod } from 'meteor/mdg:validated-method';
import getKeyPair from '../../modules/server/namecoin/get_key-pair.js';

const getKeyPair = new ValidatedMethod({
  name: 'namecoin.getKeyPair',
  validate: null,
  run() {
    return getKeyPair();
  },
});
