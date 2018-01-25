import { Recipients } from '../api/recipients.js';
import { Sois } from './sois.js';

var Api = new Restivus({
  apiPath: 'api/',
  version: 'v1',
  useDefaultAuth: true,
  prettyJson: true
});

Api.addRoute('sois', {authRequired: true}, {
  post: {
    authRequired: true,
    roleRequired: ['admin'],
    action: function() {
      let params = this.queryParams;
      if(params.recipient && params.sender) {
        let recipient = getRecipient(params.recipient);
        console.log(recipient);
        return {status: 'success', data: {message: 'SOI added'}};
      } else return {
        statusCode: 422,
        body: {status: 'fail', message: 'Wrong parameters. Parameters: recipient, sender [, data_json]'}
      };
    }
  }
});

function getRecipient(email) {
  let recipient = Recipients.findOne({email: email});
  if(!recipient) {
    console.log(this.userId);
    Meteor.call('recipients.insert', email);
  }
  return recipient;
}
