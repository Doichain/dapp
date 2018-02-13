import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http'

export function getHttp(url, query) {
  const syncFunc = Meteor.wrapAsync(_get);
  return syncFunc(url, query);
}

function _get(url, query, callback) {
  const ourUrl = url;
  const ourQuery = query;
  HTTP.get(url, {query: ourQuery}, function(err, ret) {
    callback(err, ret);
  });
}
