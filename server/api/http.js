import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http'

//Wrapping the HTTP.get method is not neccessary, it calls the function syncronous if there is no callback function anyway.
//wrapping instead caused problems when calling php-files
//TODO: remove unneccessary wrapping


//Don't use this!
//export function getHttpGETerror(url, query) {
//  const syncFunc = Meteor.wrapAsync(_get);
//  return syncFunc(url, query);
//}


//This is only a temporary fix
export function getHttpGET(url, query) {
    return HTTP.get(url, {query: query});
}

export function getHttpGETdata(url, data) {
    const syncFunc = Meteor.wrapAsync(_getData);
    return syncFunc(url, data);
}

export function getHttpPOST(url, data) {
    const syncFunc = Meteor.wrapAsync(_post);
    return syncFunc(url, data);
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

function _getData(url, data, callback) {
    const ourUrl = url;
    const ourData = data;
    HTTP.get(ourUrl, ourData, function(err, ret) {
        callback(err, ret);
    });
}

function _post(url, data, callback) {
    const ourUrl = url;
    const ourData =  data;

    HTTP.post(ourUrl, ourData, function(err, ret) {
        callback(err, ret);
    });
}

function _put(url, updateData, callback) {
    const ourUrl = url;
    const ourData = {
        data: updateData
    }

    HTTP.put(ourUrl, ourData, function(err, ret) {
      callback(err, ret);
    });
}
