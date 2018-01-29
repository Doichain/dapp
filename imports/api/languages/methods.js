import { ValidatedMethod } from 'meteor/mdg:validated-method';
import getLanguages from '../../modules/server/languages/get.js';

const getAllLanguages = new ValidatedMethod({
  name: 'languages.getAll',
  validate: null,
  run() {
    return getLanguages();
  },
});
