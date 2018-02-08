import { Meteor } from 'meteor/meteor';
import dns from 'dns';

export function resolveTxt(key, domain) {
  const syncFunc = Meteor.wrapAsync(dns_resolveTxt);
  try {
    return syncFunc(key, domain);
  } catch(error) {
    if(error.message.startsWith("queryTxt ENODATA") ||
        error.message.startsWith("queryTxt ENOTFOUND")) return undefined;
    else throw error;
  }
}

function dns_resolveTxt(key, domain, callback) {
  dns.resolveTxt(key+"."+domain, (err, records) => {
    callback(err, records);
  });
}
