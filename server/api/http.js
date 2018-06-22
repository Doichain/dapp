import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http'

export function getHttpGET(url, query) {
  const syncFunc = Meteor.wrapAsync(_get);
  return syncFunc(url, query);
}

export function getHttpPUT(url, data) {
    const syncFunc = Meteor.wrapAsync(_put);
    return syncFunc(url, data);
}

function _get(url, query, callback) {
  const ourUrl = url;
  const ourQuery = query;
  HTTP.get(ourUrl, {query: ourQuery}, function(err, ret) {
    callback(err, ret);
  });
}

function _put(url, updateData, callback) {
    const ourUrl = url;
    const ourData = updateData;
    HTTP.put(ourUrl, ourData, function(err, ret) {
      callback(err, ret);
    });
}
