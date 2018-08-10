import { Meteor } from 'meteor/meteor';
import dns from 'dns';
import {logSend} from "../../imports/startup/server/log-configuration";

export function resolveTxt(key, domain) {
  const syncFunc = Meteor.wrapAsync(dns_resolveTxt);
  try {
    const records = syncFunc(key, domain);
    if(records === undefined) return undefined;
    let value = undefined;
    records.forEach(record => {
      if(record[0].startsWith(key)) {
        const val = record[0].substring(key.length+1);
        value = val.trim();

      }
    });
    return value;
  } catch(error) {
    if(error.message.startsWith("queryTxt ENODATA") ||
        error.message.startsWith("queryTxt ENOTFOUND")) return undefined;
    else throw error;
  }
}

function dns_resolveTxt(key, domain, callback) {
    logSend("resolving dns txt attribute: ", {key:key,domain:domain});
    dns.resolveTxt(domain, (err, records) => {
    callback(err, records);
  });
}
