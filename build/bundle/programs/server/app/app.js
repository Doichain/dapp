var require = meteorInstall({"imports":{"api":{"opt-ins":{"server":{"publications.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// imports/api/opt-ins/server/publications.js                                                                         //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let Roles;
module.link("meteor/alanning:roles", {
  Roles(v) {
    Roles = v;
  }

}, 1);
let OptIns;
module.link("../opt-ins.js", {
  OptIns(v) {
    OptIns = v;
  }

}, 2);
Meteor.publish('opt-ins.all', function OptInsAll() {
  if (!this.userId) {
    return this.ready();
  }

  if (!Roles.userIsInRole(this.userId, ['admin'])) {
    return OptIns.find({
      ownerId: this.userId
    }, {
      fields: OptIns.publicFields
    });
  }

  return OptIns.find({}, {
    fields: OptIns.publicFields
  });
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"methods.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// imports/api/opt-ins/methods.js                                                                                     //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let DDPRateLimiter;
module.link("meteor/ddp-rate-limiter", {
  DDPRateLimiter(v) {
    DDPRateLimiter = v;
  }

}, 1);
let i18n;
module.link("meteor/universe:i18n", {
  _i18n(v) {
    i18n = v;
  }

}, 2);
let ValidatedMethod;
module.link("meteor/mdg:validated-method", {
  ValidatedMethod(v) {
    ValidatedMethod = v;
  }

}, 3);
let Roles;
module.link("meteor/alanning:roles", {
  Roles(v) {
    Roles = v;
  }

}, 4);

let _;

module.link("meteor/underscore", {
  _(v) {
    _ = v;
  }

}, 5);
let addOptIn;
module.link("../../modules/server/opt-ins/add_and_write_to_blockchain.js", {
  default(v) {
    addOptIn = v;
  }

}, 6);
const add = new ValidatedMethod({
  name: 'opt-ins.add',
  validate: null,

  run({
    recipientMail,
    senderMail,
    data
  }) {
    if (!this.userId || !Roles.userIsInRole(this.userId, ['admin'])) {
      const error = "api.opt-ins.add.accessDenied";
      throw new Meteor.Error(error, i18n.__(error));
    }

    const optIn = {
      "recipient_mail": recipientMail,
      "sender_mail": senderMail,
      data
    };
    addOptIn(optIn);
  }

}); // Get list of all method names on opt-ins

const OPTIONS_METHODS = _.pluck([add], 'name');

if (Meteor.isServer) {
  // Only allow 5 opt-in operations per connection per second
  DDPRateLimiter.addRule({
    name(name) {
      return _.contains(OPTIONS_METHODS, name);
    },

    // Rate limit per connection ID
    connectionId() {
      return true;
    }

  }, 5, 1000);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"opt-ins.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// imports/api/opt-ins/opt-ins.js                                                                                     //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  OptIns: () => OptIns
});
let Mongo;
module.link("meteor/mongo", {
  Mongo(v) {
    Mongo = v;
  }

}, 0);
let SimpleSchema;
module.link("simpl-schema", {
  default(v) {
    SimpleSchema = v;
  }

}, 1);

class OptInsCollection extends Mongo.Collection {
  insert(optIn, callback) {
    const ourOptIn = optIn;
    ourOptIn.recipient_sender = ourOptIn.recipient + ourOptIn.sender;
    ourOptIn.createdAt = ourOptIn.createdAt || new Date();
    const result = super.insert(ourOptIn, callback);
    return result;
  }

  update(selector, modifier) {
    const result = super.update(selector, modifier);
    return result;
  }

  remove(selector) {
    const result = super.remove(selector);
    return result;
  }

}

const OptIns = new OptInsCollection('opt-ins');
// Deny all client-side updates since we will be using methods to manage this collection
OptIns.deny({
  insert() {
    return true;
  },

  update() {
    return true;
  },

  remove() {
    return true;
  }

});
OptIns.schema = new SimpleSchema({
  _id: {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  recipient: {
    type: String,
    optional: true,
    denyUpdate: true
  },
  sender: {
    type: String,
    optional: true,
    denyUpdate: true
  },
  data: {
    type: String,
    optional: true,
    denyUpdate: false
  },
  index: {
    type: SimpleSchema.Integer,
    optional: true,
    denyUpdate: false
  },
  nameId: {
    type: String,
    optional: true,
    denyUpdate: false
  },
  txId: {
    type: String,
    optional: true,
    denyUpdate: false
  },
  masterDoi: {
    type: String,
    optional: true,
    denyUpdate: false
  },
  createdAt: {
    type: Date,
    denyUpdate: true
  },
  confirmedAt: {
    type: Date,
    optional: true,
    denyUpdate: false
  },
  confirmedBy: {
    type: String,
    regEx: SimpleSchema.RegEx.IP,
    optional: true,
    denyUpdate: false
  },
  confirmationToken: {
    type: String,
    optional: true,
    denyUpdate: false
  },
  ownerId: {
    type: String,
    optional: true,
    regEx: SimpleSchema.RegEx.Id
  },
  error: {
    type: String,
    optional: true,
    denyUpdate: false
  }
});
OptIns.attachSchema(OptIns.schema); // This represents the keys from Opt-In objects that should be published
// to the client. If we add secret properties to Opt-In objects, don't list
// them here to keep them private to the server.

OptIns.publicFields = {
  _id: 1,
  recipient: 1,
  sender: 1,
  data: 1,
  index: 1,
  nameId: 1,
  txId: 1,
  masterDoi: 1,
  createdAt: 1,
  confirmedAt: 1,
  confirmedBy: 1,
  ownerId: 1,
  error: 1
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"recipients":{"server":{"publications.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// imports/api/recipients/server/publications.js                                                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let Roles;
module.link("meteor/alanning:roles", {
  Roles(v) {
    Roles = v;
  }

}, 1);
let Recipients;
module.link("../recipients.js", {
  Recipients(v) {
    Recipients = v;
  }

}, 2);
Meteor.publish('recipients.all', function recipientsAll() {
  if (!this.userId || !Roles.userIsInRole(this.userId, ['admin'])) {
    return this.ready();
  }

  return Recipients.find({}, {
    fields: Recipients.publicFields
  });
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"recipients.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// imports/api/recipients/recipients.js                                                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  Recipients: () => Recipients
});
let Mongo;
module.link("meteor/mongo", {
  Mongo(v) {
    Mongo = v;
  }

}, 0);
let SimpleSchema;
module.link("simpl-schema", {
  default(v) {
    SimpleSchema = v;
  }

}, 1);

class RecipientsCollection extends Mongo.Collection {
  insert(recipient, callback) {
    const ourRecipient = recipient;
    ourRecipient.createdAt = ourRecipient.createdAt || new Date();
    const result = super.insert(ourRecipient, callback);
    return result;
  }

  update(selector, modifier) {
    const result = super.update(selector, modifier);
    return result;
  }

  remove(selector) {
    const result = super.remove(selector);
    return result;
  }

}

const Recipients = new RecipientsCollection('recipients');
// Deny all client-side updates since we will be using methods to manage this collection
Recipients.deny({
  insert() {
    return true;
  },

  update() {
    return true;
  },

  remove() {
    return true;
  }

});
Recipients.schema = new SimpleSchema({
  _id: {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  email: {
    type: String,
    index: true,
    denyUpdate: true
  },
  privateKey: {
    type: String,
    unique: true,
    denyUpdate: true
  },
  publicKey: {
    type: String,
    unique: true,
    denyUpdate: true
  },
  createdAt: {
    type: Date,
    denyUpdate: true
  }
});
Recipients.attachSchema(Recipients.schema); // This represents the keys from Recipient objects that should be published
// to the client. If we add secret properties to Recipient objects, don't list
// them here to keep them private to the server.

Recipients.publicFields = {
  _id: 1,
  email: 1,
  publicKey: 1,
  createdAt: 1
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"doichain":{"entries.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// imports/api/doichain/entries.js                                                                                    //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  DoichainEntries: () => DoichainEntries
});
let Mongo;
module.link("meteor/mongo", {
  Mongo(v) {
    Mongo = v;
  }

}, 0);
let SimpleSchema;
module.link("simpl-schema", {
  default(v) {
    SimpleSchema = v;
  }

}, 1);

class DoichainEntriesCollection extends Mongo.Collection {
  insert(entry, callback) {
    const result = super.insert(entry, callback);
    return result;
  }

  update(selector, modifier) {
    const result = super.update(selector, modifier);
    return result;
  }

  remove(selector) {
    const result = super.remove(selector);
    return result;
  }

}

const DoichainEntries = new DoichainEntriesCollection('doichain-entries');
// Deny all client-side updates since we will be using methods to manage this collection
DoichainEntries.deny({
  insert() {
    return true;
  },

  update() {
    return true;
  },

  remove() {
    return true;
  }

});
DoichainEntries.schema = new SimpleSchema({
  _id: {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  name: {
    type: String,
    index: true,
    denyUpdate: true
  },
  value: {
    type: String,
    denyUpdate: false
  },
  address: {
    type: String,
    denyUpdate: false
  },
  masterDoi: {
    type: String,
    optional: true,
    index: true,
    denyUpdate: true
  },
  index: {
    type: SimpleSchema.Integer,
    optional: true,
    denyUpdate: true
  },
  txId: {
    type: String,
    denyUpdate: false
  }
});
DoichainEntries.attachSchema(DoichainEntries.schema); // This represents the keys from Entry objects that should be published
// to the client. If we add secret properties to Entry objects, don't list
// them here to keep them private to the server.

DoichainEntries.publicFields = {
  _id: 1,
  name: 1,
  value: 1,
  address: 1,
  masterDoi: 1,
  index: 1,
  txId: 1
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"methods.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// imports/api/doichain/methods.js                                                                                    //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
let ValidatedMethod;
module.link("meteor/mdg:validated-method", {
  ValidatedMethod(v) {
    ValidatedMethod = v;
  }

}, 0);
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 1);
let DDPRateLimiter;
module.link("meteor/ddp-rate-limiter", {
  DDPRateLimiter(v) {
    DDPRateLimiter = v;
  }

}, 2);
let getKeyPairM;
module.link("../../modules/server/doichain/get_key-pair.js", {
  default(v) {
    getKeyPairM = v;
  }

}, 3);
let getBalanceM;
module.link("../../modules/server/doichain/get_balance.js", {
  default(v) {
    getBalanceM = v;
  }

}, 4);
const getKeyPair = new ValidatedMethod({
  name: 'doichain.getKeyPair',
  validate: null,

  run() {
    return getKeyPairM();
  }

});
const getBalance = new ValidatedMethod({
  name: 'doichain.getBalance',
  validate: null,

  run() {
    const logVal = getBalanceM();
    return logVal;
  }

}); // Get list of all method names on doichain

const OPTINS_METHODS = _.pluck([getKeyPair, getBalance], 'name');

if (Meteor.isServer) {
  // Only allow 5 opt-in operations per connection per second
  DDPRateLimiter.addRule({
    name(name) {
      return _.contains(OPTINS_METHODS, name);
    },

    // Rate limit per connection ID
    connectionId() {
      return true;
    }

  }, 5, 1000);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"languages":{"methods.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// imports/api/languages/methods.js                                                                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let DDPRateLimiter;
module.link("meteor/ddp-rate-limiter", {
  DDPRateLimiter(v) {
    DDPRateLimiter = v;
  }

}, 1);
let ValidatedMethod;
module.link("meteor/mdg:validated-method", {
  ValidatedMethod(v) {
    ValidatedMethod = v;
  }

}, 2);
let getLanguages;
module.link("../../modules/server/languages/get.js", {
  default(v) {
    getLanguages = v;
  }

}, 3);
const getAllLanguages = new ValidatedMethod({
  name: 'languages.getAll',
  validate: null,

  run() {
    return getLanguages();
  }

}); // Get list of all method names on languages

const OPTINS_METHODS = _.pluck([getAllLanguages], 'name');

if (Meteor.isServer) {
  // Only allow 5 opt-in operations per connection per second
  DDPRateLimiter.addRule({
    name(name) {
      return _.contains(OPTINS_METHODS, name);
    },

    // Rate limit per connection ID
    connectionId() {
      return true;
    }

  }, 5, 1000);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"meta":{"meta.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// imports/api/meta/meta.js                                                                                           //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  Meta: () => Meta
});
let Mongo;
module.link("meteor/mongo", {
  Mongo(v) {
    Mongo = v;
  }

}, 0);
let SimpleSchema;
module.link("simpl-schema", {
  default(v) {
    SimpleSchema = v;
  }

}, 1);

class MetaCollection extends Mongo.Collection {
  insert(data, callback) {
    const ourData = data;
    const result = super.insert(ourData, callback);
    return result;
  }

  update(selector, modifier) {
    const result = super.update(selector, modifier);
    return result;
  }

  remove(selector) {
    const result = super.remove(selector);
    return result;
  }

}

const Meta = new MetaCollection('meta');
// Deny all client-side updates since we will be using methods to manage this collection
Meta.deny({
  insert() {
    return true;
  },

  update() {
    return true;
  },

  remove() {
    return true;
  }

});
Meta.schema = new SimpleSchema({
  _id: {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  key: {
    type: String,
    index: true,
    denyUpdate: true
  },
  value: {
    type: String
  }
});
Meta.attachSchema(Meta.schema); // This represents the keys from Meta objects that should be published
// to the client. If we add secret properties to Meta objects, don't list
// them here to keep them private to the server.

Meta.publicFields = {};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"senders":{"senders.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// imports/api/senders/senders.js                                                                                     //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  Senders: () => Senders
});
let Mongo;
module.link("meteor/mongo", {
  Mongo(v) {
    Mongo = v;
  }

}, 0);
let SimpleSchema;
module.link("simpl-schema", {
  default(v) {
    SimpleSchema = v;
  }

}, 1);

class SendersCollection extends Mongo.Collection {
  insert(sender, callback) {
    const ourSender = sender;
    ourSender.createdAt = ourSender.createdAt || new Date();
    const result = super.insert(ourSender, callback);
    return result;
  }

  update(selector, modifier) {
    const result = super.update(selector, modifier);
    return result;
  }

  remove(selector) {
    const result = super.remove(selector);
    return result;
  }

}

const Senders = new SendersCollection('senders');
// Deny all client-side updates since we will be using methods to manage this collection
Senders.deny({
  insert() {
    return true;
  },

  update() {
    return true;
  },

  remove() {
    return true;
  }

});
Senders.schema = new SimpleSchema({
  _id: {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  email: {
    type: String,
    index: true,
    denyUpdate: true
  },
  createdAt: {
    type: Date,
    denyUpdate: true
  }
});
Senders.attachSchema(Senders.schema); // This represents the keys from Sender objects that should be published
// to the client. If we add secret properties to Sender objects, don't list
// them here to keep them private to the server.

Senders.publicFields = {
  email: 1,
  createdAt: 1
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},"modules":{"server":{"dapps":{"export_dois.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// imports/modules/server/dapps/export_dois.js                                                                        //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let SimpleSchema;
module.link("simpl-schema", {
  default(v) {
    SimpleSchema = v;
  }

}, 1);
let DOI_MAIL_FETCH_URL;
module.link("../../../startup/server/email-configuration.js", {
  DOI_MAIL_FETCH_URL(v) {
    DOI_MAIL_FETCH_URL = v;
  }

}, 2);
let logSend;
module.link("../../../startup/server/log-configuration", {
  logSend(v) {
    logSend = v;
  }

}, 3);
let OptIns;
module.link("../../../api/opt-ins/opt-ins", {
  OptIns(v) {
    OptIns = v;
  }

}, 4);
const ExportDoisDataSchema = new SimpleSchema({
  status: {
    type: String,
    optional: true
  },
  role: {
    type: String
  },
  userid: {
    type: String,
    regEx: SimpleSchema.RegEx.id,
    optional: true
  }
}); //TODO add sender and recipient email address to export

const exportDois = data => {
  try {
    const ourData = data;
    ExportDoisDataSchema.validate(ourData);
    let pipeline = [{
      $match: {
        "confirmedAt": {
          $exists: true,
          $ne: null
        }
      }
    }];

    if (ourData.role != 'admin' || ourData.userid != undefined) {
      pipeline.push({
        $redact: {
          $cond: {
            if: {
              $cmp: ["$ownerId", ourData.userid]
            },
            then: "$$PRUNE",
            else: "$$KEEP"
          }
        }
      });
    }

    pipeline.concat([{
      $lookup: {
        from: "recipients",
        localField: "recipient",
        foreignField: "_id",
        as: "RecipientEmail"
      }
    }, {
      $lookup: {
        from: "senders",
        localField: "sender",
        foreignField: "_id",
        as: "SenderEmail"
      }
    }, {
      $unwind: "$SenderEmail"
    }, {
      $unwind: "$RecipientEmail"
    }, {
      $project: {
        "_id": 1,
        "createdAt": 1,
        "confirmedAt": 1,
        "nameId": 1,
        "SenderEmail.email": 1,
        "RecipientEmail.email": 1
      }
    }]); //if(ourData.status==1) query = {"confirmedAt": { $exists: true, $ne: null }}

    let optIns = OptIns.aggregate(pipeline);
    let exportDoiData;

    try {
      exportDoiData = optIns;
      logSend('exportDoi url:', DOI_MAIL_FETCH_URL, JSON.stringify(exportDoiData));
      return exportDoiData;
    } catch (error) {
      throw "Error while exporting dois: " + error;
    }
  } catch (exception) {
    throw new Meteor.Error('dapps.exportDoi.exception', exception);
  }
};

module.exportDefault(exportDois);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"fetch_doi-mail-data.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// imports/modules/server/dapps/fetch_doi-mail-data.js                                                                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let SimpleSchema;
module.link("simpl-schema", {
  default(v) {
    SimpleSchema = v;
  }

}, 1);
let DOI_FETCH_ROUTE, DOI_CONFIRMATION_ROUTE, API_PATH, VERSION;
module.link("../../../../server/api/rest/rest.js", {
  DOI_FETCH_ROUTE(v) {
    DOI_FETCH_ROUTE = v;
  },

  DOI_CONFIRMATION_ROUTE(v) {
    DOI_CONFIRMATION_ROUTE = v;
  },

  API_PATH(v) {
    API_PATH = v;
  },

  VERSION(v) {
    VERSION = v;
  }

}, 2);
let getUrl;
module.link("../../../startup/server/dapp-configuration.js", {
  getUrl(v) {
    getUrl = v;
  }

}, 3);
let CONFIRM_CLIENT, CONFIRM_ADDRESS;
module.link("../../../startup/server/doichain-configuration.js", {
  CONFIRM_CLIENT(v) {
    CONFIRM_CLIENT = v;
  },

  CONFIRM_ADDRESS(v) {
    CONFIRM_ADDRESS = v;
  }

}, 4);
let getHttpGET;
module.link("../../../../server/api/http.js", {
  getHttpGET(v) {
    getHttpGET = v;
  }

}, 5);
let signMessage;
module.link("../../../../server/api/doichain.js", {
  signMessage(v) {
    signMessage = v;
  }

}, 6);
let OptIns;
module.link("../../../../imports/api/opt-ins/opt-ins.js", {
  OptIns(v) {
    OptIns = v;
  }

}, 7);
let parseTemplate;
module.link("../emails/parse_template.js", {
  default(v) {
    parseTemplate = v;
  }

}, 8);
let generateDoiToken;
module.link("../opt-ins/generate_doi-token.js", {
  default(v) {
    generateDoiToken = v;
  }

}, 9);
let generateDoiHash;
module.link("../emails/generate_doi-hash.js", {
  default(v) {
    generateDoiHash = v;
  }

}, 10);
let addOptIn;
module.link("../opt-ins/add.js", {
  default(v) {
    addOptIn = v;
  }

}, 11);
let addSendMailJob;
module.link("../jobs/add_send_mail.js", {
  default(v) {
    addSendMailJob = v;
  }

}, 12);
let logConfirm, logError;
module.link("../../../startup/server/log-configuration", {
  logConfirm(v) {
    logConfirm = v;
  },

  logError(v) {
    logError = v;
  }

}, 13);
const FetchDoiMailDataSchema = new SimpleSchema({
  name: {
    type: String
  },
  domain: {
    type: String
  }
});

const fetchDoiMailData = data => {
  try {
    const ourData = data;
    FetchDoiMailDataSchema.validate(ourData);
    const url = ourData.domain + API_PATH + VERSION + "/" + DOI_FETCH_ROUTE;
    const signature = signMessage(CONFIRM_CLIENT, CONFIRM_ADDRESS, ourData.name);
    const query = "name_id=" + encodeURIComponent(ourData.name) + "&signature=" + encodeURIComponent(signature);
    logConfirm('calling for doi-email-template:' + url + ' query:', query);
    /**
      TODO when running Send-dApp in Testnet behind NAT this URL will not be accessible from the internet
      but even when we use the URL from localhost verify andn others will fails.
     */

    const response = getHttpGET(url, query);
    if (response === undefined || response.data === undefined) throw "Bad response";
    const responseData = response.data;
    logConfirm('response while getting getting email template from URL:', response.data.status);

    if (responseData.status !== "success") {
      if (responseData.error === undefined) throw "Bad response";

      if (responseData.error.includes("Opt-In not found")) {
        //Do nothing and don't throw error so job is done
        logError('response data from Send-dApp:', responseData.error);
        return;
      }

      throw responseData.error;
    }

    logConfirm('DOI Mail data fetched.');
    const optInId = addOptIn({
      name: ourData.name
    });
    const optIn = OptIns.findOne({
      _id: optInId
    });
    logConfirm('opt-in found:', optIn);
    if (optIn.confirmationToken !== undefined) return;
    const token = generateDoiToken({
      id: optIn._id
    });
    logConfirm('generated confirmationToken:', token);
    const confirmationHash = generateDoiHash({
      id: optIn._id,
      token: token,
      redirect: responseData.data.redirect
    });
    logConfirm('generated confirmationHash:', confirmationHash);
    const confirmationUrl = getUrl() + API_PATH + VERSION + "/" + DOI_CONFIRMATION_ROUTE + "/" + encodeURIComponent(confirmationHash);
    logConfirm('confirmationUrl:' + confirmationUrl);
    const template = parseTemplate({
      template: responseData.data.content,
      data: {
        confirmation_url: confirmationUrl
      }
    }); //logConfirm('we are using this template:',template);

    logConfirm('sending email to peter for confirmation over bobs dApp');
    addSendMailJob({
      to: responseData.data.recipient,
      subject: responseData.data.subject,
      message: template,
      returnPath: responseData.data.returnPath
    });
  } catch (exception) {
    throw new Meteor.Error('dapps.fetchDoiMailData.exception', exception);
  }
};

module.exportDefault(fetchDoiMailData);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"get_doi-mail-data.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// imports/modules/server/dapps/get_doi-mail-data.js                                                                  //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let SimpleSchema;
module.link("simpl-schema", {
  default(v) {
    SimpleSchema = v;
  }

}, 1);
let OptIns;
module.link("../../../api/opt-ins/opt-ins.js", {
  OptIns(v) {
    OptIns = v;
  }

}, 2);
let Recipients;
module.link("../../../api/recipients/recipients.js", {
  Recipients(v) {
    Recipients = v;
  }

}, 3);
let getOptInProvider;
module.link("../dns/get_opt-in-provider.js", {
  default(v) {
    getOptInProvider = v;
  }

}, 4);
let getOptInKey;
module.link("../dns/get_opt-in-key.js", {
  default(v) {
    getOptInKey = v;
  }

}, 5);
let verifySignature;
module.link("../doichain/verify_signature.js", {
  default(v) {
    verifySignature = v;
  }

}, 6);
let getHttpGET;
module.link("../../../../server/api/http.js", {
  getHttpGET(v) {
    getHttpGET = v;
  }

}, 7);
let DOI_MAIL_FETCH_URL;
module.link("../../../startup/server/email-configuration.js", {
  DOI_MAIL_FETCH_URL(v) {
    DOI_MAIL_FETCH_URL = v;
  }

}, 8);
let logSend;
module.link("../../../startup/server/log-configuration", {
  logSend(v) {
    logSend = v;
  }

}, 9);
let Accounts;
module.link("meteor/accounts-base", {
  Accounts(v) {
    Accounts = v;
  }

}, 10);
const GetDoiMailDataSchema = new SimpleSchema({
  name_id: {
    type: String
  },
  signature: {
    type: String
  }
});
const userProfileSchema = new SimpleSchema({
  subject: {
    type: String,
    optional: true
  },
  redirect: {
    type: String,
    regEx: "@(https?|ftp)://(-\\.)?([^\\s/?\\.#-]+\\.?)+(/[^\\s]*)?$@",
    optional: true
  },
  returnPath: {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
    optional: true
  },
  templateURL: {
    type: String,
    regEx: "@(https?|ftp)://(-\\.)?([^\\s/?\\.#-]+\\.?)+(/[^\\s]*)?$@",
    optional: true
  }
});

const getDoiMailData = data => {
  try {
    const ourData = data;
    GetDoiMailDataSchema.validate(ourData);
    const optIn = OptIns.findOne({
      nameId: ourData.name_id
    });
    if (optIn === undefined) throw "Opt-In with name_id: " + ourData.name_id + " not found";
    logSend('Opt-In found', optIn);
    const recipient = Recipients.findOne({
      _id: optIn.recipient
    });
    if (recipient === undefined) throw "Recipient not found";
    logSend('Recipient found', recipient);
    const parts = recipient.email.split("@");
    const domain = parts[parts.length - 1];
    let publicKey = getOptInKey({
      domain: domain
    });

    if (!publicKey) {
      const provider = getOptInProvider({
        domain: ourData.domain
      });
      logSend("using doichain provider instead of directly configured publicKey:", {
        provider: provider
      });
      publicKey = getOptInKey({
        domain: provider
      }); //get public key from provider or fallback if publickey was not set in dns
    }

    logSend('queried data: (parts, domain, provider, publicKey)', '(' + parts + ',' + domain + ',' + publicKey + ')'); //TODO: Only allow access one time
    // Possible solution:
    // 1. Provider (confirm dApp) request the data
    // 2. Provider receive the data
    // 3. Provider sends confirmation "I got the data"
    // 4. Send dApp lock the data for this opt in

    logSend('verifying signature...');

    if (!verifySignature({
      publicKey: publicKey,
      data: ourData.name_id,
      signature: ourData.signature
    })) {
      throw "signature incorrect - access denied";
    }

    logSend('signature verified'); //TODO: Query for language

    let doiMailData;

    try {
      doiMailData = getHttpGET(DOI_MAIL_FETCH_URL, "").data;
      let defaultReturnData = {
        "recipient": recipient.email,
        "content": doiMailData.data.content,
        "redirect": doiMailData.data.redirect,
        "subject": doiMailData.data.subject,
        "returnPath": doiMailData.data.returnPath
      };
      let returnData = defaultReturnData;

      try {
        let owner = Accounts.users.findOne({
          _id: optIn.ownerId
        });
        let mailTemplate = owner.profile.mailTemplate;
        userProfileSchema.validate(mailTemplate);
        returnData["redirect"] = mailTemplate["redirect"] || defaultReturnData["redirect"];
        returnData["subject"] = mailTemplate["subject"] || defaultReturnData["subject"];
        returnData["returnPath"] = mailTemplate["returnPath"] || defaultReturnData["returnPath"];
        returnData["content"] = mailTemplate["templateURL"] ? getHttpGET(mailTemplate["templateURL"], "").content || defaultReturnData["content"] : defaultReturnData["content"];
      } catch (error) {
        returnData = defaultReturnData;
      }

      logSend('doiMailData and url:', DOI_MAIL_FETCH_URL, returnData);
      return returnData;
    } catch (error) {
      throw "Error while fetching mail content: " + error;
    }
  } catch (exception) {
    throw new Meteor.Error('dapps.getDoiMailData.exception', exception);
  }
};

module.exportDefault(getDoiMailData);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"dns":{"get_opt-in-key.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// imports/modules/server/dns/get_opt-in-key.js                                                                       //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let SimpleSchema;
module.link("simpl-schema", {
  default(v) {
    SimpleSchema = v;
  }

}, 1);
let resolveTxt;
module.link("../../../../server/api/dns.js", {
  resolveTxt(v) {
    resolveTxt = v;
  }

}, 2);
let FALLBACK_PROVIDER;
module.link("../../../startup/server/dns-configuration.js", {
  FALLBACK_PROVIDER(v) {
    FALLBACK_PROVIDER = v;
  }

}, 3);
let isRegtest, isTestnet;
module.link("../../../startup/server/dapp-configuration", {
  isRegtest(v) {
    isRegtest = v;
  },

  isTestnet(v) {
    isTestnet = v;
  }

}, 4);
let logSend;
module.link("../../../startup/server/log-configuration", {
  logSend(v) {
    logSend = v;
  }

}, 5);
const OPT_IN_KEY = "doichain-opt-in-key";
const OPT_IN_KEY_TESTNET = "doichain-testnet-opt-in-key";
const GetOptInKeySchema = new SimpleSchema({
  domain: {
    type: String
  }
});

const getOptInKey = data => {
  try {
    const ourData = data;
    GetOptInKeySchema.validate(ourData);
    let ourOPT_IN_KEY = OPT_IN_KEY;

    if (isRegtest() || isTestnet()) {
      ourOPT_IN_KEY = OPT_IN_KEY_TESTNET;
      logSend('Using RegTest:' + isRegtest() + " Testnet: " + isTestnet() + " ourOPT_IN_KEY", ourOPT_IN_KEY);
    }

    const key = resolveTxt(ourOPT_IN_KEY, ourData.domain);
    logSend('DNS TXT configured public key of recipient email domain and confirmation dapp', {
      foundKey: key,
      domain: ourData.domain,
      dnskey: ourOPT_IN_KEY
    });
    if (key === undefined) return useFallback(ourData.domain);
    return key;
  } catch (exception) {
    throw new Meteor.Error('dns.getOptInKey.exception', exception);
  }
};

const useFallback = domain => {
  if (domain === FALLBACK_PROVIDER) throw new Meteor.Error("Fallback has no key defined!");
  logSend("Key not defined. Using fallback: ", FALLBACK_PROVIDER);
  return getOptInKey({
    domain: FALLBACK_PROVIDER
  });
};

module.exportDefault(getOptInKey);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"get_opt-in-provider.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// imports/modules/server/dns/get_opt-in-provider.js                                                                  //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let SimpleSchema;
module.link("simpl-schema", {
  default(v) {
    SimpleSchema = v;
  }

}, 1);
let resolveTxt;
module.link("../../../../server/api/dns.js", {
  resolveTxt(v) {
    resolveTxt = v;
  }

}, 2);
let FALLBACK_PROVIDER;
module.link("../../../startup/server/dns-configuration.js", {
  FALLBACK_PROVIDER(v) {
    FALLBACK_PROVIDER = v;
  }

}, 3);
let logSend;
module.link("../../../startup/server/log-configuration", {
  logSend(v) {
    logSend = v;
  }

}, 4);
let isRegtest, isTestnet;
module.link("../../../startup/server/dapp-configuration", {
  isRegtest(v) {
    isRegtest = v;
  },

  isTestnet(v) {
    isTestnet = v;
  }

}, 5);
const PROVIDER_KEY = "doichain-opt-in-provider";
const PROVIDER_KEY_TESTNET = "doichain-testnet-opt-in-provider";
const GetOptInProviderSchema = new SimpleSchema({
  domain: {
    type: String
  }
});

const getOptInProvider = data => {
  try {
    const ourData = data;
    GetOptInProviderSchema.validate(ourData);
    let ourPROVIDER_KEY = PROVIDER_KEY;

    if (isRegtest() || isTestnet()) {
      ourPROVIDER_KEY = PROVIDER_KEY_TESTNET;
      logSend('Using RegTest:' + isRegtest() + " : Testnet:" + isTestnet() + " PROVIDER_KEY", {
        providerKey: ourPROVIDER_KEY,
        domain: ourData.domain
      });
    }

    const provider = resolveTxt(ourPROVIDER_KEY, ourData.domain);
    if (provider === undefined) return useFallback();
    logSend('opt-in-provider from dns - server of mail recipient: (TXT):', provider);
    return provider;
  } catch (exception) {
    throw new Meteor.Error('dns.getOptInProvider.exception', exception);
  }
};

const useFallback = () => {
  logSend('Provider not defined. Fallback ' + FALLBACK_PROVIDER + ' is used');
  return FALLBACK_PROVIDER;
};

module.exportDefault(getOptInProvider);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"doichain":{"add_entry_and_fetch_data.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// imports/modules/server/doichain/add_entry_and_fetch_data.js                                                        //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let SimpleSchema;
module.link("simpl-schema", {
  default(v) {
    SimpleSchema = v;
  }

}, 1);
let CONFIRM_CLIENT, CONFIRM_ADDRESS;
module.link("../../../startup/server/doichain-configuration.js", {
  CONFIRM_CLIENT(v) {
    CONFIRM_CLIENT = v;
  },

  CONFIRM_ADDRESS(v) {
    CONFIRM_ADDRESS = v;
  }

}, 2);
let getWif;
module.link("../../../../server/api/doichain.js", {
  getWif(v) {
    getWif = v;
  }

}, 3);
let DoichainEntries;
module.link("../../../api/doichain/entries.js", {
  DoichainEntries(v) {
    DoichainEntries = v;
  }

}, 4);
let addFetchDoiMailDataJob;
module.link("../jobs/add_fetch-doi-mail-data.js", {
  default(v) {
    addFetchDoiMailDataJob = v;
  }

}, 5);
let getPrivateKeyFromWif;
module.link("./get_private-key_from_wif.js", {
  default(v) {
    getPrivateKeyFromWif = v;
  }

}, 6);
let decryptMessage;
module.link("./decrypt_message.js", {
  default(v) {
    decryptMessage = v;
  }

}, 7);
let logConfirm, logSend;
module.link("../../../startup/server/log-configuration", {
  logConfirm(v) {
    logConfirm = v;
  },

  logSend(v) {
    logSend = v;
  }

}, 8);
const AddDoichainEntrySchema = new SimpleSchema({
  name: {
    type: String
  },
  value: {
    type: String
  },
  address: {
    type: String
  },
  txId: {
    type: String
  }
});
/**
 * Inserts
 *
 * @param entry
 * @returns {*}
 */

const addDoichainEntry = entry => {
  try {
    const ourEntry = entry;
    logConfirm('adding DoichainEntry on Bob...', ourEntry.name);
    AddDoichainEntrySchema.validate(ourEntry);
    const ety = DoichainEntries.findOne({
      name: ourEntry.name
    });

    if (ety !== undefined) {
      logSend('returning locally saved entry with _id:' + ety._id);
      return ety._id;
    }

    const value = JSON.parse(ourEntry.value); //logSend("value:",value);

    if (value.from === undefined) throw "Wrong blockchain entry"; //TODO if from is missing but value is there, it is probably allready handeled correctly anyways this is not so cool as it seems.

    const wif = getWif(CONFIRM_CLIENT, CONFIRM_ADDRESS);
    const privateKey = getPrivateKeyFromWif({
      wif: wif
    });
    logSend('got private key (will not show it here)');
    const domain = decryptMessage({
      privateKey: privateKey,
      message: value.from
    });
    logSend('decrypted message from domain: ', domain);
    const namePos = ourEntry.name.indexOf('-'); //if this is not a co-registration fetch mail.

    logSend('namePos:', namePos);
    const masterDoi = namePos != -1 ? ourEntry.name.substring(0, namePos) : undefined;
    logSend('masterDoi:', masterDoi);
    const index = masterDoi ? ourEntry.name.substring(namePos + 1) : undefined;
    logSend('index:', index);
    const id = DoichainEntries.insert({
      name: ourEntry.name,
      value: ourEntry.value,
      address: ourEntry.address,
      masterDoi: masterDoi,
      index: index,
      txId: ourEntry.txId,
      expiresIn: ourEntry.expiresIn,
      expired: ourEntry.expired
    });
    logSend('DoichainEntry added on Bob:', {
      id: id,
      name: ourEntry.name,
      masterDoi: masterDoi,
      index: index
    });

    if (!masterDoi) {
      addFetchDoiMailDataJob({
        name: ourEntry.name,
        domain: domain
      });
      logSend('New entry added: \n' + 'NameId=' + ourEntry.name + "\n" + 'Address=' + ourEntry.address + "\n" + 'TxId=' + ourEntry.txId + "\n" + 'Value=' + ourEntry.value);
    } else {
      logSend('This transaction belongs to co-registration', masterDoi);
    }

    return id;
  } catch (exception) {
    throw new Meteor.Error('doichain.addEntryAndFetchData.exception', exception);
  }
};

module.exportDefault(addDoichainEntry);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"check_new_transactions.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// imports/modules/server/doichain/check_new_transactions.js                                                          //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let listSinceBlock, nameShow, getRawTransaction;
module.link("../../../../server/api/doichain.js", {
  listSinceBlock(v) {
    listSinceBlock = v;
  },

  nameShow(v) {
    nameShow = v;
  },

  getRawTransaction(v) {
    getRawTransaction = v;
  }

}, 1);
let CONFIRM_CLIENT, CONFIRM_ADDRESS;
module.link("../../../startup/server/doichain-configuration.js", {
  CONFIRM_CLIENT(v) {
    CONFIRM_CLIENT = v;
  },

  CONFIRM_ADDRESS(v) {
    CONFIRM_ADDRESS = v;
  }

}, 2);
let addDoichainEntry;
module.link("./add_entry_and_fetch_data.js", {
  default(v) {
    addDoichainEntry = v;
  }

}, 3);
let Meta;
module.link("../../../api/meta/meta.js", {
  Meta(v) {
    Meta = v;
  }

}, 4);
let addOrUpdateMeta;
module.link("../meta/addOrUpdate.js", {
  default(v) {
    addOrUpdateMeta = v;
  }

}, 5);
let logConfirm;
module.link("../../../startup/server/log-configuration", {
  logConfirm(v) {
    logConfirm = v;
  }

}, 6);
const TX_NAME_START = "e/";
const LAST_CHECKED_BLOCK_KEY = "lastCheckedBlock";

const checkNewTransaction = (txid, job) => {
  try {
    if (!txid) {
      logConfirm("checkNewTransaction triggered when starting node - checking all confirmed blocks since last check for doichain address", CONFIRM_ADDRESS);

      try {
        var lastCheckedBlock = Meta.findOne({
          key: LAST_CHECKED_BLOCK_KEY
        });
        if (lastCheckedBlock !== undefined) lastCheckedBlock = lastCheckedBlock.value;
        logConfirm("lastCheckedBlock", lastCheckedBlock);
        const ret = listSinceBlock(CONFIRM_CLIENT, lastCheckedBlock);
        if (ret === undefined || ret.transactions === undefined) return;
        const txs = ret.transactions;
        lastCheckedBlock = ret.lastblock;

        if (!ret || !txs || !txs.length === 0) {
          logConfirm("transactions do not contain nameOp transaction details or transaction not found.", lastCheckedBlock);
          addOrUpdateMeta({
            key: LAST_CHECKED_BLOCK_KEY,
            value: lastCheckedBlock
          });
          return;
        }

        logConfirm("listSinceBlock", ret);
        const addressTxs = txs.filter(tx => tx.address === CONFIRM_ADDRESS && tx.name !== undefined //since name_show cannot be read without confirmations
        && tx.name.startsWith("doi: " + TX_NAME_START) //here 'doi: e/xxxx' is already written in the block
        );
        addressTxs.forEach(tx => {
          logConfirm("tx:", tx);
          var txName = tx.name.substring(("doi: " + TX_NAME_START).length);
          logConfirm("excuting name_show in order to get value of nameId:", txName);
          const ety = nameShow(CONFIRM_CLIENT, txName);
          logConfirm("nameShow: value", ety);

          if (!ety) {
            logConfirm("couldn't find name - obviously not (yet?!) confirmed in blockchain:", ety);
            return;
          }

          addTx(txName, ety.value, tx.address, tx.txid); //TODO ety.value.from is maybe NOT existing because of this its  (maybe) ont working...
        });
        addOrUpdateMeta({
          key: LAST_CHECKED_BLOCK_KEY,
          value: lastCheckedBlock
        });
        logConfirm("Transactions updated - lastCheckedBlock:", lastCheckedBlock);
        job.done();
      } catch (exception) {
        throw new Meteor.Error('namecoin.checkNewTransactions.exception', exception);
      }
    } else {
      logConfirm("txid: " + txid + " was triggered by walletnotify for address:", CONFIRM_ADDRESS);
      const ret = getRawTransaction(CONFIRM_CLIENT, txid);
      const txs = ret.vout;

      if (!ret || !txs || !txs.length === 0) {
        logConfirm("txid " + txid + ' does not contain transaction details or transaction not found.');
        return;
      } // logConfirm('now checking raw transactions with filter:',txs);


      const addressTxs = txs.filter(tx => tx.scriptPubKey !== undefined && tx.scriptPubKey.nameOp !== undefined && tx.scriptPubKey.nameOp.op === "name_doi" //  && tx.scriptPubKey.addresses[0] === CONFIRM_ADDRESS //only own transaction should arrive here. - so check on own address unneccesary
      && tx.scriptPubKey.nameOp.name !== undefined && tx.scriptPubKey.nameOp.name.startsWith(TX_NAME_START)); //logConfirm("found name_op transactions:", addressTxs);

      addressTxs.forEach(tx => {
        addTx(tx.scriptPubKey.nameOp.name, tx.scriptPubKey.nameOp.value, tx.scriptPubKey.addresses[0], txid);
      });
    }
  } catch (exception) {
    throw new Meteor.Error('doichain.checkNewTransactions.exception', exception);
  }

  return true;
};

function addTx(name, value, address, txid) {
  const txName = name.substring(TX_NAME_START.length);
  addDoichainEntry({
    name: txName,
    value: value,
    address: address,
    txId: txid
  });
}

module.exportDefault(checkNewTransaction);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"decrypt_message.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// imports/modules/server/doichain/decrypt_message.js                                                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let SimpleSchema;
module.link("simpl-schema", {
  default(v) {
    SimpleSchema = v;
  }

}, 1);
let crypto;
module.link("crypto", {
  default(v) {
    crypto = v;
  }

}, 2);
let ecies;
module.link("standard-ecies", {
  default(v) {
    ecies = v;
  }

}, 3);
const DecryptMessageSchema = new SimpleSchema({
  privateKey: {
    type: String
  },
  message: {
    type: String
  }
});

const decryptMessage = data => {
  try {
    const ourData = data;
    DecryptMessageSchema.validate(ourData);
    const privateKey = Buffer.from(ourData.privateKey, 'hex');
    const ecdh = crypto.createECDH('secp256k1');
    ecdh.setPrivateKey(privateKey);
    const message = Buffer.from(ourData.message, 'hex');
    return ecies.decrypt(ecdh, message).toString('utf8');
  } catch (exception) {
    throw new Meteor.Error('doichain.decryptMessage.exception', exception);
  }
};

module.exportDefault(decryptMessage);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"encrypt_message.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// imports/modules/server/doichain/encrypt_message.js                                                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let SimpleSchema;
module.link("simpl-schema", {
  default(v) {
    SimpleSchema = v;
  }

}, 1);
let ecies;
module.link("standard-ecies", {
  default(v) {
    ecies = v;
  }

}, 2);
const EncryptMessageSchema = new SimpleSchema({
  publicKey: {
    type: String
  },
  message: {
    type: String
  }
});

const encryptMessage = data => {
  try {
    const ourData = data;
    EncryptMessageSchema.validate(ourData);
    const publicKey = Buffer.from(ourData.publicKey, 'hex');
    const message = Buffer.from(ourData.message);
    return ecies.encrypt(publicKey, message).toString('hex');
  } catch (exception) {
    throw new Meteor.Error('doichain.encryptMessage.exception', exception);
  }
};

module.exportDefault(encryptMessage);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"generate_name-id.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// imports/modules/server/doichain/generate_name-id.js                                                                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let SimpleSchema;
module.link("simpl-schema", {
  default(v) {
    SimpleSchema = v;
  }

}, 1);
let OptIns;
module.link("../../../api/opt-ins/opt-ins.js", {
  OptIns(v) {
    OptIns = v;
  }

}, 2);
let getKeyPair;
module.link("./get_key-pair.js", {
  default(v) {
    getKeyPair = v;
  }

}, 3);
let logSend;
module.link("../../../startup/server/log-configuration", {
  logSend(v) {
    logSend = v;
  }

}, 4);
const GenerateNameIdSchema = new SimpleSchema({
  id: {
    type: String
  },
  masterDoi: {
    type: String,
    optional: true
  },
  index: {
    type: SimpleSchema.Integer,
    optional: true
  }
});

const generateNameId = optIn => {
  try {
    const ourOptIn = optIn;
    GenerateNameIdSchema.validate(ourOptIn);
    let nameId;

    if (optIn.masterDoi) {
      nameId = ourOptIn.masterDoi + "-" + ourOptIn.index;
      logSend("used master_doi as nameId index " + optIn.index + "storage:", nameId);
    } else {
      nameId = getKeyPair().privateKey;
      logSend("generated nameId for doichain storage:", nameId);
    }

    OptIns.update({
      _id: ourOptIn.id
    }, {
      $set: {
        nameId: nameId
      }
    });
    return nameId;
  } catch (exception) {
    throw new Meteor.Error('doichain.generateNameId.exception', exception);
  }
};

module.exportDefault(generateNameId);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"get_address.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// imports/modules/server/doichain/get_address.js                                                                     //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let SimpleSchema;
module.link("simpl-schema", {
  default(v) {
    SimpleSchema = v;
  }

}, 1);
let CryptoJS;
module.link("crypto-js", {
  default(v) {
    CryptoJS = v;
  }

}, 2);
let Base58;
module.link("bs58", {
  default(v) {
    Base58 = v;
  }

}, 3);
let isRegtest;
module.link("../../../startup/server/dapp-configuration.js", {
  isRegtest(v) {
    isRegtest = v;
  }

}, 4);
let isTestnet;
module.link("../../../startup/server/dapp-configuration", {
  isTestnet(v) {
    isTestnet = v;
  }

}, 5);
const VERSION_BYTE = 0x34;
const VERSION_BYTE_REGTEST = 0x6f;
const GetAddressSchema = new SimpleSchema({
  publicKey: {
    type: String
  }
});

const getAddress = data => {
  try {
    const ourData = data;
    GetAddressSchema.validate(ourData);
    return _getAddress(ourData.publicKey);
  } catch (exception) {
    throw new Meteor.Error('doichain.getAddress.exception', exception);
  }
};

function _getAddress(publicKey) {
  const pubKey = CryptoJS.lib.WordArray.create(Buffer.from(publicKey, 'hex'));
  let key = CryptoJS.SHA256(pubKey);
  key = CryptoJS.RIPEMD160(key);
  let versionByte = VERSION_BYTE;
  if (isRegtest() || isTestnet()) versionByte = VERSION_BYTE_REGTEST;
  let address = Buffer.concat([Buffer.from([versionByte]), Buffer.from(key.toString(), 'hex')]);
  key = CryptoJS.SHA256(CryptoJS.lib.WordArray.create(address));
  key = CryptoJS.SHA256(key);
  let checksum = key.toString().substring(0, 8);
  address = new Buffer(address.toString('hex') + checksum, 'hex');
  address = Base58.encode(address);
  return address;
}

module.exportDefault(getAddress);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"get_balance.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// imports/modules/server/doichain/get_balance.js                                                                     //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let getBalance;
module.link("../../../../server/api/doichain.js", {
  getBalance(v) {
    getBalance = v;
  }

}, 1);
let CONFIRM_CLIENT;
module.link("../../../startup/server/doichain-configuration.js", {
  CONFIRM_CLIENT(v) {
    CONFIRM_CLIENT = v;
  }

}, 2);

const get_Balance = () => {
  try {
    const bal = getBalance(CONFIRM_CLIENT);
    return bal;
  } catch (exception) {
    throw new Meteor.Error('doichain.getBalance.exception', exception);
  }

  return true;
};

module.exportDefault(get_Balance);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"get_data-hash.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// imports/modules/server/doichain/get_data-hash.js                                                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let CryptoJS;
module.link("crypto-js", {
  default(v) {
    CryptoJS = v;
  }

}, 1);
let SimpleSchema;
module.link("simpl-schema", {
  default(v) {
    SimpleSchema = v;
  }

}, 2);
const GetDataHashSchema = new SimpleSchema({
  data: {
    type: String
  }
});

const getDataHash = data => {
  try {
    const ourData = data;
    GetDataHashSchema.validate(ourData);
    const hash = CryptoJS.SHA256(ourData).toString();
    return hash;
  } catch (exception) {
    throw new Meteor.Error('doichain.getDataHash.exception', exception);
  }
};

module.exportDefault(getDataHash);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"get_key-pair.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// imports/modules/server/doichain/get_key-pair.js                                                                    //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let randomBytes;
module.link("crypto", {
  randomBytes(v) {
    randomBytes = v;
  }

}, 1);
let secp256k1;
module.link("secp256k1", {
  default(v) {
    secp256k1 = v;
  }

}, 2);

const getKeyPair = () => {
  try {
    let privKey;

    do {
      privKey = randomBytes(32);
    } while (!secp256k1.privateKeyVerify(privKey));

    const privateKey = privKey;
    const publicKey = secp256k1.publicKeyCreate(privateKey);
    return {
      privateKey: privateKey.toString('hex').toUpperCase(),
      publicKey: publicKey.toString('hex').toUpperCase()
    };
  } catch (exception) {
    throw new Meteor.Error('doichain.getKeyPair.exception', exception);
  }
};

module.exportDefault(getKeyPair);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"get_private-key_from_wif.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// imports/modules/server/doichain/get_private-key_from_wif.js                                                        //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let SimpleSchema;
module.link("simpl-schema", {
  default(v) {
    SimpleSchema = v;
  }

}, 1);
let Base58;
module.link("bs58", {
  default(v) {
    Base58 = v;
  }

}, 2);
const GetPrivateKeyFromWifSchema = new SimpleSchema({
  wif: {
    type: String
  }
});

const getPrivateKeyFromWif = data => {
  try {
    const ourData = data;
    GetPrivateKeyFromWifSchema.validate(ourData);
    return _getPrivateKeyFromWif(ourData.wif);
  } catch (exception) {
    throw new Meteor.Error('doichain.getPrivateKeyFromWif.exception', exception);
  }
};

function _getPrivateKeyFromWif(wif) {
  var privateKey = Base58.decode(wif).toString('hex');
  privateKey = privateKey.substring(2, privateKey.length - 8);

  if (privateKey.length === 66 && privateKey.endsWith("01")) {
    privateKey = privateKey.substring(0, privateKey.length - 2);
  }

  return privateKey;
}

module.exportDefault(getPrivateKeyFromWif);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"get_publickey_and_address_by_domain.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// imports/modules/server/doichain/get_publickey_and_address_by_domain.js                                             //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
let SimpleSchema;
module.link("simpl-schema", {
  default(v) {
    SimpleSchema = v;
  }

}, 0);
let logSend;
module.link("../../../startup/server/log-configuration", {
  logSend(v) {
    logSend = v;
  }

}, 1);
let getOptInKey;
module.link("../dns/get_opt-in-key", {
  default(v) {
    getOptInKey = v;
  }

}, 2);
let getOptInProvider;
module.link("../dns/get_opt-in-provider", {
  default(v) {
    getOptInProvider = v;
  }

}, 3);
let getAddress;
module.link("./get_address", {
  default(v) {
    getAddress = v;
  }

}, 4);
const GetPublicKeySchema = new SimpleSchema({
  domain: {
    type: String
  }
});

const getPublicKeyAndAddress = data => {
  const ourData = data;
  GetPublicKeySchema.validate(ourData);
  let publicKey = getOptInKey({
    domain: ourData.domain
  });

  if (!publicKey) {
    const provider = getOptInProvider({
      domain: ourData.domain
    });
    logSend("using doichain provider instead of directly configured publicKey:", {
      provider: provider
    });
    publicKey = getOptInKey({
      domain: provider
    }); //get public key from provider or fallback if publickey was not set in dns
  }

  const destAddress = getAddress({
    publicKey: publicKey
  });
  logSend('publicKey and destAddress ', {
    publicKey: publicKey,
    destAddress: destAddress
  });
  return {
    publicKey: publicKey,
    destAddress: destAddress
  };
};

module.exportDefault(getPublicKeyAndAddress);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"get_signature.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// imports/modules/server/doichain/get_signature.js                                                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let SimpleSchema;
module.link("simpl-schema", {
  default(v) {
    SimpleSchema = v;
  }

}, 1);
let bitcore;
module.link("bitcore-lib", {
  default(v) {
    bitcore = v;
  }

}, 2);
let Message;
module.link("bitcore-message", {
  default(v) {
    Message = v;
  }

}, 3);
const GetSignatureSchema = new SimpleSchema({
  message: {
    type: String
  },
  privateKey: {
    type: String
  }
});

const getSignature = data => {
  try {
    const ourData = data;
    GetSignatureSchema.validate(ourData);
    const signature = Message(ourData.message).sign(new bitcore.PrivateKey(ourData.privateKey));
    return signature;
  } catch (exception) {
    throw new Meteor.Error('doichain.getSignature.exception', exception);
  }
};

module.exportDefault(getSignature);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"insert.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// imports/modules/server/doichain/insert.js                                                                          //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let SimpleSchema;
module.link("simpl-schema", {
  default(v) {
    SimpleSchema = v;
  }

}, 1);
let SEND_CLIENT;
module.link("../../../startup/server/doichain-configuration.js", {
  SEND_CLIENT(v) {
    SEND_CLIENT = v;
  }

}, 2);
let encryptMessage;
module.link("./encrypt_message", {
  default(v) {
    encryptMessage = v;
  }

}, 3);
let getUrl;
module.link("../../../startup/server/dapp-configuration", {
  getUrl(v) {
    getUrl = v;
  }

}, 4);
let logBlockchain, logSend;
module.link("../../../startup/server/log-configuration", {
  logBlockchain(v) {
    logBlockchain = v;
  },

  logSend(v) {
    logSend = v;
  }

}, 5);
let feeDoi, nameDoi;
module.link("../../../../server/api/doichain", {
  feeDoi(v) {
    feeDoi = v;
  },

  nameDoi(v) {
    nameDoi = v;
  }

}, 6);
let OptIns;
module.link("../../../api/opt-ins/opt-ins", {
  OptIns(v) {
    OptIns = v;
  }

}, 7);
let getPublicKeyAndAddress;
module.link("./get_publickey_and_address_by_domain", {
  default(v) {
    getPublicKeyAndAddress = v;
  }

}, 8);
const InsertSchema = new SimpleSchema({
  nameId: {
    type: String
  },
  signature: {
    type: String
  },
  dataHash: {
    type: String
  },
  domain: {
    type: String
  },
  soiDate: {
    type: Date
  }
});

const insert = data => {
  const ourData = data;

  try {
    InsertSchema.validate(ourData);
    logSend("domain:", ourData.domain);
    const publicKeyAndAddress = getPublicKeyAndAddress({
      domain: ourData.domain
    });
    const from = encryptMessage({
      publicKey: publicKeyAndAddress.publicKey,
      message: getUrl()
    });
    logSend('encrypted url for use ad from in doichain value:', getUrl(), from);
    const nameValue = JSON.stringify({
      signature: ourData.signature,
      dataHash: ourData.dataHash,
      from: from
    }); //TODO (!) this must be replaced in future by "atomic name trading example" https://wiki.namecoin.info/?title=Atomic_Name-Trading

    logBlockchain('sending a fee to bob so he can pay the doi storage (destAddress):', publicKeyAndAddress.destAddress);
    const feeDoiTx = feeDoi(SEND_CLIENT, publicKeyAndAddress.destAddress);
    logBlockchain('fee send txid to destaddress', feeDoiTx, publicKeyAndAddress.destAddress);
    logBlockchain('adding data to blockchain via name_doi (nameId,value,destAddress):', ourData.nameId, nameValue, publicKeyAndAddress.destAddress);
    const nameDoiTx = nameDoi(SEND_CLIENT, ourData.nameId, nameValue, publicKeyAndAddress.destAddress);
    logBlockchain('name_doi added blockchain. txid:', nameDoiTx);
    OptIns.update({
      nameId: ourData.nameId
    }, {
      $set: {
        txId: nameDoiTx
      }
    });
    logBlockchain('updating OptIn locally with:', {
      nameId: ourData.nameId,
      txId: nameDoiTx
    });
  } catch (exception) {
    OptIns.update({
      nameId: ourData.nameId
    }, {
      $set: {
        error: JSON.stringify(exception.message)
      }
    });
    throw new Meteor.Error('doichain.insert.exception', exception); //TODO update opt-in in local db to inform user about the error! e.g. Insufficient funds etc.
  }
};

module.exportDefault(insert);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"update.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// imports/modules/server/doichain/update.js                                                                          //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let SimpleSchema;
module.link("simpl-schema", {
  default(v) {
    SimpleSchema = v;
  }

}, 1);
let CONFIRM_CLIENT;
module.link("../../../startup/server/doichain-configuration.js", {
  CONFIRM_CLIENT(v) {
    CONFIRM_CLIENT = v;
  }

}, 2);
let getWif, signMessage, getTransaction, nameDoi, nameShow;
module.link("../../../../server/api/doichain", {
  getWif(v) {
    getWif = v;
  },

  signMessage(v) {
    signMessage = v;
  },

  getTransaction(v) {
    getTransaction = v;
  },

  nameDoi(v) {
    nameDoi = v;
  },

  nameShow(v) {
    nameShow = v;
  }

}, 3);
let API_PATH, DOI_CONFIRMATION_NOTIFY_ROUTE, VERSION;
module.link("../../../../server/api/rest/rest", {
  API_PATH(v) {
    API_PATH = v;
  },

  DOI_CONFIRMATION_NOTIFY_ROUTE(v) {
    DOI_CONFIRMATION_NOTIFY_ROUTE = v;
  },

  VERSION(v) {
    VERSION = v;
  }

}, 4);
let CONFIRM_ADDRESS;
module.link("../../../startup/server/doichain-configuration", {
  CONFIRM_ADDRESS(v) {
    CONFIRM_ADDRESS = v;
  }

}, 5);
let getHttpPUT;
module.link("../../../../server/api/http", {
  getHttpPUT(v) {
    getHttpPUT = v;
  }

}, 6);
let logConfirm;
module.link("../../../startup/server/log-configuration", {
  logConfirm(v) {
    logConfirm = v;
  }

}, 7);
let getPrivateKeyFromWif;
module.link("./get_private-key_from_wif", {
  default(v) {
    getPrivateKeyFromWif = v;
  }

}, 8);
let decryptMessage;
module.link("./decrypt_message", {
  default(v) {
    decryptMessage = v;
  }

}, 9);
let OptIns;
module.link("../../../api/opt-ins/opt-ins", {
  OptIns(v) {
    OptIns = v;
  }

}, 10);
const UpdateSchema = new SimpleSchema({
  nameId: {
    type: String
  },
  value: {
    type: String
  },
  host: {
    type: String,
    optional: true
  },
  fromHostUrl: {
    type: String
  }
});

const update = (data, job) => {
  try {
    const ourData = data;
    UpdateSchema.validate(ourData); //stop this update until this name as at least 1 confirmation

    const name_data = nameShow(CONFIRM_CLIENT, ourData.nameId);

    if (name_data === undefined) {
      rerun(job);
      logConfirm('name not visible - delaying name update', ourData.nameId);
      return;
    }

    const our_transaction = getTransaction(CONFIRM_CLIENT, name_data.txid);

    if (our_transaction.confirmations === 0) {
      rerun(job);
      logConfirm('transaction has 0 confirmations - delaying name update', JSON.parse(ourData.value));
      return;
    }

    logConfirm('updating blockchain with doiSignature:', JSON.parse(ourData.value));
    const wif = getWif(CONFIRM_CLIENT, CONFIRM_ADDRESS);
    const privateKey = getPrivateKeyFromWif({
      wif: wif
    });
    logConfirm('got private key (will not show it here) in order to decrypt Send-dApp host url from value:', ourData.fromHostUrl);
    const ourfromHostUrl = decryptMessage({
      privateKey: privateKey,
      message: ourData.fromHostUrl
    });
    logConfirm('decrypted fromHostUrl', ourfromHostUrl);
    const url = ourfromHostUrl + API_PATH + VERSION + "/" + DOI_CONFIRMATION_NOTIFY_ROUTE;
    logConfirm('creating signature with ADDRESS' + CONFIRM_ADDRESS + " nameId:", ourData.value);
    const signature = signMessage(CONFIRM_CLIENT, CONFIRM_ADDRESS, ourData.nameId); //TODO why here over nameID?

    logConfirm('signature created:', signature);
    const updateData = {
      nameId: ourData.nameId,
      signature: signature,
      host: ourData.host
    };

    try {
      const txid = nameDoi(CONFIRM_CLIENT, ourData.nameId, ourData.value, null);
      logConfirm('update transaction txid:', txid);
    } catch (exception) {
      //
      logConfirm('this nameDOI doesn´t have a block yet and will be updated with the next block and with the next queue start:', ourData.nameId);

      if (exception.toString().indexOf("there is already a registration for this doi name") == -1) {
        OptIns.update({
          nameId: ourData.nameId
        }, {
          $set: {
            error: JSON.stringify(exception.message)
          }
        });
      }

      throw new Meteor.Error('doichain.update.exception', exception); //}else{
      //    logConfirm('this nameDOI doesn´t have a block yet and will be updated with the next block and with the next queue start:',ourData.nameId);
      //}
    }

    const response = getHttpPUT(url, updateData);
    logConfirm('informed send dApp about confirmed doi on url:' + url + ' with updateData' + JSON.stringify(updateData) + " response:", response.data);
    job.done();
  } catch (exception) {
    throw new Meteor.Error('doichain.update.exception', exception);
  }
};

function rerun(job) {
  logConfirm('rerunning txid in 10sec - canceling old job', '');
  job.cancel();
  logConfirm('restart blockchain doi update', '');
  job.restart({//repeats: 600,   // Only repeat this once
    // This is the default
    // wait: 10000   // Wait 10 sec between repeats
    // Default is previous setting
  }, function (err, result) {
    if (result) {
      logConfirm('rerunning txid in 10sec:', result);
    }
  });
}

module.exportDefault(update);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"verify_signature.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// imports/modules/server/doichain/verify_signature.js                                                                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let SimpleSchema;
module.link("simpl-schema", {
  default(v) {
    SimpleSchema = v;
  }

}, 1);
let bitcore;
module.link("bitcore-lib", {
  default(v) {
    bitcore = v;
  }

}, 2);
let Message;
module.link("bitcore-message", {
  default(v) {
    Message = v;
  }

}, 3);
let logError, logVerify;
module.link("../../../startup/server/log-configuration", {
  logError(v) {
    logError = v;
  },

  logVerify(v) {
    logVerify = v;
  }

}, 4);
const NETWORK = bitcore.Networks.add({
  name: 'doichain',
  alias: 'doichain',
  pubkeyhash: 0x34,
  privatekey: 0xB4,
  scripthash: 13,
  networkMagic: 0xf9beb4fe
});
const VerifySignatureSchema = new SimpleSchema({
  data: {
    type: String
  },
  publicKey: {
    type: String
  },
  signature: {
    type: String
  }
});

const verifySignature = data => {
  try {
    const ourData = data;
    logVerify('verifySignature:', ourData);
    VerifySignatureSchema.validate(ourData);
    const address = bitcore.Address.fromPublicKey(new bitcore.PublicKey(ourData.publicKey), NETWORK);

    try {
      return Message(ourData.data).verify(address, ourData.signature);
    } catch (error) {
      logError(error);
    }

    return false;
  } catch (exception) {
    throw new Meteor.Error('doichain.verifySignature.exception', exception);
  }
};

module.exportDefault(verifySignature);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"write_to_blockchain.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// imports/modules/server/doichain/write_to_blockchain.js                                                             //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let SimpleSchema;
module.link("simpl-schema", {
  default(v) {
    SimpleSchema = v;
  }

}, 1);
let OptIns;
module.link("../../../api/opt-ins/opt-ins.js", {
  OptIns(v) {
    OptIns = v;
  }

}, 2);
let Senders;
module.link("../../../api/senders/senders.js", {
  Senders(v) {
    Senders = v;
  }

}, 3);
let Recipients;
module.link("../../../api/recipients/recipients.js", {
  Recipients(v) {
    Recipients = v;
  }

}, 4);
let generateNameId;
module.link("./generate_name-id.js", {
  default(v) {
    generateNameId = v;
  }

}, 5);
let getSignature;
module.link("./get_signature.js", {
  default(v) {
    getSignature = v;
  }

}, 6);
let getDataHash;
module.link("./get_data-hash.js", {
  default(v) {
    getDataHash = v;
  }

}, 7);
let addInsertBlockchainJob;
module.link("../jobs/add_insert_blockchain.js", {
  default(v) {
    addInsertBlockchainJob = v;
  }

}, 8);
let logSend;
module.link("../../../startup/server/log-configuration", {
  logSend(v) {
    logSend = v;
  }

}, 9);
const WriteToBlockchainSchema = new SimpleSchema({
  id: {
    type: String
  }
});

const writeToBlockchain = data => {
  try {
    const ourData = data;
    WriteToBlockchainSchema.validate(ourData);
    const optIn = OptIns.findOne({
      _id: data.id
    });
    const recipient = Recipients.findOne({
      _id: optIn.recipient
    });
    const sender = Senders.findOne({
      _id: optIn.sender
    });
    logSend("optIn data:", {
      index: ourData.index,
      optIn: optIn,
      recipient: recipient,
      sender: sender
    });
    const nameId = generateNameId({
      id: data.id,
      index: optIn.index,
      masterDoi: optIn.masterDoi
    });
    const signature = getSignature({
      message: recipient.email + sender.email,
      privateKey: recipient.privateKey
    });
    logSend("generated signature from email recipient and sender:", signature);
    let dataHash = "";

    if (optIn.data) {
      dataHash = getDataHash({
        data: optIn.data
      });
      logSend("generated datahash from given data:", dataHash);
    }

    const parts = recipient.email.split("@");
    const domain = parts[parts.length - 1];
    logSend("email domain for publicKey request is:", domain);
    addInsertBlockchainJob({
      nameId: nameId,
      signature: signature,
      dataHash: dataHash,
      domain: domain,
      soiDate: optIn.createdAt
    });
  } catch (exception) {
    throw new Meteor.Error('doichain.writeToBlockchain.exception', exception);
  }
};

module.exportDefault(writeToBlockchain);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"emails":{"decode_doi-hash.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// imports/modules/server/emails/decode_doi-hash.js                                                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let SimpleSchema;
module.link("simpl-schema", {
  default(v) {
    SimpleSchema = v;
  }

}, 1);
let HashIds;
module.link("../../../startup/server/email-configuration.js", {
  HashIds(v) {
    HashIds = v;
  }

}, 2);
const DecodeDoiHashSchema = new SimpleSchema({
  hash: {
    type: String
  }
});

const decodeDoiHash = hash => {
  try {
    const ourHash = hash;
    DecodeDoiHashSchema.validate(ourHash);
    const hex = HashIds.decodeHex(ourHash.hash);
    if (!hex || hex === '') throw "Wrong hash";

    try {
      const obj = JSON.parse(Buffer(hex, 'hex').toString('ascii'));
      return obj;
    } catch (exception) {
      throw "Wrong hash";
    }
  } catch (exception) {
    throw new Meteor.Error('emails.decode_doi-hash.exception', exception);
  }
};

module.exportDefault(decodeDoiHash);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"generate_doi-hash.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// imports/modules/server/emails/generate_doi-hash.js                                                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let SimpleSchema;
module.link("simpl-schema", {
  default(v) {
    SimpleSchema = v;
  }

}, 1);
let HashIds;
module.link("../../../startup/server/email-configuration.js", {
  HashIds(v) {
    HashIds = v;
  }

}, 2);
const GenerateDoiHashSchema = new SimpleSchema({
  id: {
    type: String
  },
  token: {
    type: String
  },
  redirect: {
    type: String
  }
});

const generateDoiHash = optIn => {
  try {
    const ourOptIn = optIn;
    GenerateDoiHashSchema.validate(ourOptIn);
    const json = JSON.stringify({
      id: ourOptIn.id,
      token: ourOptIn.token,
      redirect: ourOptIn.redirect
    });
    const hex = Buffer(json).toString('hex');
    const hash = HashIds.encodeHex(hex);
    return hash;
  } catch (exception) {
    throw new Meteor.Error('emails.generate_doi-hash.exception', exception);
  }
};

module.exportDefault(generateDoiHash);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"parse_template.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// imports/modules/server/emails/parse_template.js                                                                    //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let SimpleSchema;
module.link("simpl-schema", {
  default(v) {
    SimpleSchema = v;
  }

}, 1);
let logConfirm;
module.link("../../../startup/server/log-configuration", {
  logConfirm(v) {
    logConfirm = v;
  }

}, 2);
const PLACEHOLDER_REGEX = /\${([\w]*)}/g;
const ParseTemplateSchema = new SimpleSchema({
  template: {
    type: String
  },
  data: {
    type: Object,
    blackbox: true
  }
});

const parseTemplate = data => {
  try {
    const ourData = data; //logConfirm('parseTemplate:',ourData);

    ParseTemplateSchema.validate(ourData);
    logConfirm('ParseTemplateSchema validated');

    var _match;

    var template = ourData.template; //logConfirm('doing some regex with template:',template);

    do {
      _match = PLACEHOLDER_REGEX.exec(template);
      if (_match) template = _replacePlaceholder(template, _match, ourData.data[_match[1]]);
    } while (_match);

    return template;
  } catch (exception) {
    throw new Meteor.Error('emails.parseTemplate.exception', exception);
  }
};

function _replacePlaceholder(template, _match, replace) {
  var rep = replace;
  if (replace === undefined) rep = "";
  return template.substring(0, _match.index) + rep + template.substring(_match.index + _match[0].length);
}

module.exportDefault(parseTemplate);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"send.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// imports/modules/server/emails/send.js                                                                              //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let SimpleSchema;
module.link("simpl-schema", {
  default(v) {
    SimpleSchema = v;
  }

}, 1);
let logConfirm;
module.link("../../../startup/server/log-configuration", {
  logConfirm(v) {
    logConfirm = v;
  }

}, 2);
let DOI_MAIL_DEFAULT_EMAIL_FROM;
module.link("../../../startup/server/email-configuration.js", {
  DOI_MAIL_DEFAULT_EMAIL_FROM(v) {
    DOI_MAIL_DEFAULT_EMAIL_FROM = v;
  }

}, 3);
const SendMailSchema = new SimpleSchema({
  from: {
    type: String,
    regEx: SimpleSchema.RegEx.Email
  },
  to: {
    type: String,
    regEx: SimpleSchema.RegEx.Email
  },
  subject: {
    type: String
  },
  message: {
    type: String
  },
  returnPath: {
    type: String,
    regEx: SimpleSchema.RegEx.Email
  }
});

const sendMail = mail => {
  try {
    mail.from = DOI_MAIL_DEFAULT_EMAIL_FROM;
    const ourMail = mail;
    logConfirm('sending email with data:', {
      to: mail.to,
      subject: mail.subject
    });
    SendMailSchema.validate(ourMail); //TODO: Text fallback

    Email.send({
      from: mail.from,
      to: mail.to,
      subject: mail.subject,
      html: mail.message,
      headers: {
        'Return-Path': mail.returnPath
      }
    });
  } catch (exception) {
    throw new Meteor.Error('emails.send.exception', exception);
  }
};

module.exportDefault(sendMail);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"jobs":{"add_check_new_transactions.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// imports/modules/server/jobs/add_check_new_transactions.js                                                          //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let Job;
module.link("meteor/vsivsi:job-collection", {
  Job(v) {
    Job = v;
  }

}, 1);
let BlockchainJobs;
module.link("../../../../server/api/blockchain_jobs.js", {
  BlockchainJobs(v) {
    BlockchainJobs = v;
  }

}, 2);

const addCheckNewTransactionsBlockchainJob = () => {
  try {
    const job = new Job(BlockchainJobs, 'checkNewTransaction', {});
    job.retry({
      retries: 60,
      wait: 15 * 1000
    }).save({
      cancelRepeats: true
    });
  } catch (exception) {
    throw new Meteor.Error('jobs.addCheckNewTransactionsBlockchain.exception', exception);
  }
};

module.exportDefault(addCheckNewTransactionsBlockchainJob);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"add_fetch-doi-mail-data.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// imports/modules/server/jobs/add_fetch-doi-mail-data.js                                                             //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let SimpleSchema;
module.link("simpl-schema", {
  default(v) {
    SimpleSchema = v;
  }

}, 1);
let Job;
module.link("meteor/vsivsi:job-collection", {
  Job(v) {
    Job = v;
  }

}, 2);
let DAppJobs;
module.link("../../../../server/api/dapp_jobs.js", {
  DAppJobs(v) {
    DAppJobs = v;
  }

}, 3);
const AddFetchDoiMailDataJobSchema = new SimpleSchema({
  name: {
    type: String
  },
  domain: {
    type: String
  }
});

const addFetchDoiMailDataJob = data => {
  try {
    const ourData = data;
    AddFetchDoiMailDataJobSchema.validate(ourData);
    const job = new Job(DAppJobs, 'fetchDoiMailData', ourData);
    job.retry({
      retries: 5,
      wait: 1 * 10 * 1000
    }).save(); //check every 10 secs 5 times
  } catch (exception) {
    throw new Meteor.Error('jobs.addFetchDoiMailData.exception', exception);
  }
};

module.exportDefault(addFetchDoiMailDataJob);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"add_insert_blockchain.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// imports/modules/server/jobs/add_insert_blockchain.js                                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let Job;
module.link("meteor/vsivsi:job-collection", {
  Job(v) {
    Job = v;
  }

}, 1);
let SimpleSchema;
module.link("simpl-schema", {
  default(v) {
    SimpleSchema = v;
  }

}, 2);
let BlockchainJobs;
module.link("../../../../server/api/blockchain_jobs.js", {
  BlockchainJobs(v) {
    BlockchainJobs = v;
  }

}, 3);
const AddInsertBlockchainJobSchema = new SimpleSchema({
  nameId: {
    type: String
  },
  signature: {
    type: String
  },
  dataHash: {
    type: String,
    optional: true
  },
  domain: {
    type: String
  },
  soiDate: {
    type: Date
  }
});

const addInsertBlockchainJob = entry => {
  try {
    const ourEntry = entry;
    AddInsertBlockchainJobSchema.validate(ourEntry);
    const job = new Job(BlockchainJobs, 'insert', ourEntry);
    job.retry({
      retries: 10,
      wait: 3 * 60 * 1000
    }).save(); //check every 10sec for 1h
  } catch (exception) {
    throw new Meteor.Error('jobs.addInsertBlockchain.exception', exception);
  }
};

module.exportDefault(addInsertBlockchainJob);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"add_send_mail.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// imports/modules/server/jobs/add_send_mail.js                                                                       //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let Job;
module.link("meteor/vsivsi:job-collection", {
  Job(v) {
    Job = v;
  }

}, 1);
let SimpleSchema;
module.link("simpl-schema", {
  default(v) {
    SimpleSchema = v;
  }

}, 2);
let MailJobs;
module.link("../../../../server/api/mail_jobs.js", {
  MailJobs(v) {
    MailJobs = v;
  }

}, 3);
const AddSendMailJobSchema = new SimpleSchema({
  /*from: {
    type: String,
    regEx: SimpleSchema.RegEx.Email
  },*/
  to: {
    type: String,
    regEx: SimpleSchema.RegEx.Email
  },
  subject: {
    type: String
  },
  message: {
    type: String
  },
  returnPath: {
    type: String,
    regEx: SimpleSchema.RegEx.Email
  }
});

const addSendMailJob = mail => {
  try {
    const ourMail = mail;
    AddSendMailJobSchema.validate(ourMail);
    const job = new Job(MailJobs, 'send', ourMail);
    job.retry({
      retries: 5,
      wait: 60 * 1000
    }).save();
  } catch (exception) {
    throw new Meteor.Error('jobs.addSendMail.exception', exception);
  }
};

module.exportDefault(addSendMailJob);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"add_update_blockchain.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// imports/modules/server/jobs/add_update_blockchain.js                                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let SimpleSchema;
module.link("simpl-schema", {
  default(v) {
    SimpleSchema = v;
  }

}, 1);
let Job;
module.link("meteor/vsivsi:job-collection", {
  Job(v) {
    Job = v;
  }

}, 2);
let BlockchainJobs;
module.link("../../../../server/api/blockchain_jobs.js", {
  BlockchainJobs(v) {
    BlockchainJobs = v;
  }

}, 3);
const AddUpdateBlockchainJobSchema = new SimpleSchema({
  nameId: {
    type: String
  },
  value: {
    type: String
  },
  fromHostUrl: {
    type: String
  },
  host: {
    type: String
  }
});

const addUpdateBlockchainJob = entry => {
  try {
    const ourEntry = entry;
    AddUpdateBlockchainJobSchema.validate(ourEntry);
    const job = new Job(BlockchainJobs, 'update', ourEntry);
    job.retry({
      retries: 360,
      wait: 1 * 10 * 1000
    }).save();
  } catch (exception) {
    throw new Meteor.Error('jobs.addUpdateBlockchain.exception', exception);
  }
};

module.exportDefault(addUpdateBlockchainJob);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"languages":{"get.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// imports/modules/server/languages/get.js                                                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let i18n;
module.link("meteor/universe:i18n", {
  default(v) {
    i18n = v;
  }

}, 1);

// universe:i18n only bundles the default language on the client side.
// To get a list of all avialble languages with at least one translation,
// i18n.getLanguages() must be called server side.
const getLanguages = () => {
  try {
    return i18n.getLanguages();
  } catch (exception) {
    throw new Meteor.Error('languages.get.exception', exception);
  }
};

module.exportDefault(getLanguages);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"meta":{"addOrUpdate.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// imports/modules/server/meta/addOrUpdate.js                                                                         //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let SimpleSchema;
module.link("simpl-schema", {
  default(v) {
    SimpleSchema = v;
  }

}, 1);
let Meta;
module.link("../../../api/meta/meta.js", {
  Meta(v) {
    Meta = v;
  }

}, 2);
const AddOrUpdateMetaSchema = new SimpleSchema({
  key: {
    type: String
  },
  value: {
    type: String
  }
});

const addOrUpdateMeta = data => {
  try {
    const ourData = data;
    AddOrUpdateMetaSchema.validate(ourData);
    const meta = Meta.findOne({
      key: ourData.key
    });
    if (meta !== undefined) Meta.update({
      _id: meta._id
    }, {
      $set: {
        value: ourData.value
      }
    });else return Meta.insert({
      key: ourData.key,
      value: ourData.value
    });
  } catch (exception) {
    throw new Meteor.Error('meta.addOrUpdate.exception', exception);
  }
};

module.exportDefault(addOrUpdateMeta);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"opt-ins":{"add.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// imports/modules/server/opt-ins/add.js                                                                              //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let SimpleSchema;
module.link("simpl-schema", {
  default(v) {
    SimpleSchema = v;
  }

}, 1);
let OptIns;
module.link("../../../api/opt-ins/opt-ins.js", {
  OptIns(v) {
    OptIns = v;
  }

}, 2);
const AddOptInSchema = new SimpleSchema({
  name: {
    type: String
  }
});

const addOptIn = optIn => {
  try {
    const ourOptIn = optIn;
    AddOptInSchema.validate(ourOptIn);
    const optIns = OptIns.find({
      nameId: ourOptIn.name
    }).fetch();
    if (optIns.length > 0) return optIns[0]._id;
    const optInId = OptIns.insert({
      nameId: ourOptIn.name
    });
    return optInId;
  } catch (exception) {
    throw new Meteor.Error('opt-ins.add.exception', exception);
  }
};

module.exportDefault(addOptIn);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"add_and_write_to_blockchain.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// imports/modules/server/opt-ins/add_and_write_to_blockchain.js                                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let SimpleSchema;
module.link("simpl-schema", {
  default(v) {
    SimpleSchema = v;
  }

}, 1);
let addRecipient;
module.link("../recipients/add.js", {
  default(v) {
    addRecipient = v;
  }

}, 2);
let addSender;
module.link("../senders/add.js", {
  default(v) {
    addSender = v;
  }

}, 3);
let OptIns;
module.link("../../../api/opt-ins/opt-ins.js", {
  OptIns(v) {
    OptIns = v;
  }

}, 4);
let writeToBlockchain;
module.link("../doichain/write_to_blockchain.js", {
  default(v) {
    writeToBlockchain = v;
  }

}, 5);
let logError, logSend;
module.link("../../../startup/server/log-configuration", {
  logError(v) {
    logError = v;
  },

  logSend(v) {
    logSend = v;
  }

}, 6);
const AddOptInSchema = new SimpleSchema({
  recipient_mail: {
    type: String,
    regEx: SimpleSchema.RegEx.Email
  },
  sender_mail: {
    type: String,
    regEx: SimpleSchema.RegEx.Email
  },
  data: {
    type: String,
    optional: true
  },
  master_doi: {
    type: String,
    optional: true
  },
  index: {
    type: SimpleSchema.Integer,
    optional: true
  },
  ownerId: {
    type: String,
    regEx: SimpleSchema.RegEx.id
  }
});

const addOptIn = optIn => {
  try {
    const ourOptIn = optIn;
    AddOptInSchema.validate(ourOptIn);
    const recipient = {
      email: ourOptIn.recipient_mail
    };
    const recipientId = addRecipient(recipient);
    const sender = {
      email: ourOptIn.sender_mail
    };
    const senderId = addSender(sender);
    const optIns = OptIns.find({
      recipient: recipientId,
      sender: senderId
    }).fetch();
    if (optIns.length > 0) return optIns[0]._id; //TODO when SOI already exists resend email?

    if (ourOptIn.data !== undefined) {
      try {
        JSON.parse(ourOptIn.data);
      } catch (error) {
        logError("ourOptIn.data:", ourOptIn.data);
        throw "Invalid data json ";
      }
    }

    const optInId = OptIns.insert({
      recipient: recipientId,
      sender: senderId,
      index: ourOptIn.index,
      masterDoi: ourOptIn.master_doi,
      data: ourOptIn.data,
      ownerId: ourOptIn.ownerId
    });
    logSend("optIn (index:" + ourOptIn.index + " added to local db with optInId", optInId);
    writeToBlockchain({
      id: optInId
    });
    return optInId;
  } catch (exception) {
    throw new Meteor.Error('opt-ins.addAndWriteToBlockchain.exception', exception);
  }
};

module.exportDefault(addOptIn);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"confirm.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// imports/modules/server/opt-ins/confirm.js                                                                          //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let SimpleSchema;
module.link("simpl-schema", {
  default(v) {
    SimpleSchema = v;
  }

}, 1);
let CONFIRM_CLIENT, CONFIRM_ADDRESS;
module.link("../../../startup/server/doichain-configuration.js", {
  CONFIRM_CLIENT(v) {
    CONFIRM_CLIENT = v;
  },

  CONFIRM_ADDRESS(v) {
    CONFIRM_ADDRESS = v;
  }

}, 2);
let OptIns;
module.link("../../../api/opt-ins/opt-ins.js", {
  OptIns(v) {
    OptIns = v;
  }

}, 3);
let DoichainEntries;
module.link("../../../api/doichain/entries.js", {
  DoichainEntries(v) {
    DoichainEntries = v;
  }

}, 4);
let decodeDoiHash;
module.link("../emails/decode_doi-hash.js", {
  default(v) {
    decodeDoiHash = v;
  }

}, 5);
let signMessage;
module.link("../../../../server/api/doichain.js", {
  signMessage(v) {
    signMessage = v;
  }

}, 6);
let addUpdateBlockchainJob;
module.link("../jobs/add_update_blockchain.js", {
  default(v) {
    addUpdateBlockchainJob = v;
  }

}, 7);
let logConfirm;
module.link("../../../startup/server/log-configuration", {
  logConfirm(v) {
    logConfirm = v;
  }

}, 8);
const ConfirmOptInSchema = new SimpleSchema({
  host: {
    type: String
  },
  hash: {
    type: String
  }
});

const confirmOptIn = request => {
  try {
    const ourRequest = request;
    ConfirmOptInSchema.validate(ourRequest);
    const decoded = decodeDoiHash({
      hash: request.hash
    });
    const optIn = OptIns.findOne({
      _id: decoded.id
    });
    if (optIn === undefined || optIn.confirmationToken !== decoded.token) throw "Invalid hash";
    const confirmedAt = new Date();
    OptIns.update({
      _id: optIn._id
    }, {
      $set: {
        confirmedAt: confirmedAt,
        confirmedBy: ourRequest.host
      },
      $unset: {
        confirmationToken: ""
      }
    }); //TODO here find all DoichainEntries in the local database  and blockchain with the same masterDoi

    const entries = DoichainEntries.find({
      $or: [{
        name: optIn.nameId
      }, {
        masterDoi: optIn.nameId
      }]
    });
    if (entries === undefined) throw "Doichain entry/entries not found";
    entries.forEach(entry => {
      logConfirm('confirming DoiChainEntry:', entry);
      const value = JSON.parse(entry.value);
      logConfirm('getSignature (only of value!)', value);
      const doiSignature = signMessage(CONFIRM_CLIENT, CONFIRM_ADDRESS, value.signature);
      logConfirm('got doiSignature:', doiSignature);
      const fromHostUrl = value.from;
      delete value.from;
      value.doiTimestamp = confirmedAt.toISOString();
      value.doiSignature = doiSignature;
      const jsonValue = JSON.stringify(value);
      logConfirm('updating Doichain nameId:' + optIn.nameId + ' with value:', jsonValue);
      addUpdateBlockchainJob({
        nameId: entry.name,
        value: jsonValue,
        fromHostUrl: fromHostUrl,
        host: ourRequest.host
      });
    });
    logConfirm('redirecting user to:', decoded.redirect);
    return decoded.redirect;
  } catch (exception) {
    throw new Meteor.Error('opt-ins.confirm.exception', exception);
  }
};

module.exportDefault(confirmOptIn);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"generate_doi-token.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// imports/modules/server/opt-ins/generate_doi-token.js                                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let SimpleSchema;
module.link("simpl-schema", {
  default(v) {
    SimpleSchema = v;
  }

}, 1);
let randomBytes;
module.link("crypto", {
  randomBytes(v) {
    randomBytes = v;
  }

}, 2);
let OptIns;
module.link("../../../api/opt-ins/opt-ins.js", {
  OptIns(v) {
    OptIns = v;
  }

}, 3);
const GenerateDoiTokenSchema = new SimpleSchema({
  id: {
    type: String
  }
});

const generateDoiToken = optIn => {
  try {
    const ourOptIn = optIn;
    GenerateDoiTokenSchema.validate(ourOptIn);
    const token = randomBytes(32).toString('hex');
    OptIns.update({
      _id: ourOptIn.id
    }, {
      $set: {
        confirmationToken: token
      }
    });
    return token;
  } catch (exception) {
    throw new Meteor.Error('opt-ins.generate_doi-token.exception', exception);
  }
};

module.exportDefault(generateDoiToken);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"update_status.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// imports/modules/server/opt-ins/update_status.js                                                                    //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let SimpleSchema;
module.link("simpl-schema", {
  default(v) {
    SimpleSchema = v;
  }

}, 1);
let OptIns;
module.link("../../../api/opt-ins/opt-ins.js", {
  OptIns(v) {
    OptIns = v;
  }

}, 2);
let Recipients;
module.link("../../../api/recipients/recipients.js", {
  Recipients(v) {
    Recipients = v;
  }

}, 3);
let verifySignature;
module.link("../doichain/verify_signature.js", {
  default(v) {
    verifySignature = v;
  }

}, 4);
let logSend;
module.link("../../../startup/server/log-configuration", {
  logSend(v) {
    logSend = v;
  }

}, 5);
let getPublicKeyAndAddress;
module.link("../doichain/get_publickey_and_address_by_domain", {
  default(v) {
    getPublicKeyAndAddress = v;
  }

}, 6);
const UpdateOptInStatusSchema = new SimpleSchema({
  nameId: {
    type: String
  },
  signature: {
    type: String
  },
  host: {
    type: String,
    optional: true
  }
});

const updateOptInStatus = data => {
  try {
    const ourData = data;
    logSend('confirm dApp confirms optIn:', JSON.stringify(data));
    UpdateOptInStatusSchema.validate(ourData);
    const optIn = OptIns.findOne({
      nameId: ourData.nameId
    });
    if (optIn === undefined) throw "Opt-In not found";
    logSend('confirm dApp confirms optIn:', ourData.nameId);
    const recipient = Recipients.findOne({
      _id: optIn.recipient
    });
    if (recipient === undefined) throw "Recipient not found";
    const parts = recipient.email.split("@");
    const domain = parts[parts.length - 1];
    const publicKeyAndAddress = getPublicKeyAndAddress({
      domain: domain
    }); //TODO getting information from Bob that a certain nameId (DOI) got confirmed.

    if (!verifySignature({
      publicKey: publicKeyAndAddress.publicKey,
      data: ourData.nameId,
      signature: ourData.signature
    })) {
      throw "Access denied";
    }

    logSend('signature valid for publicKey', publicKeyAndAddress.publicKey);
    OptIns.update({
      _id: optIn._id
    }, {
      $set: {
        confirmedAt: new Date(),
        confirmedBy: ourData.host
      }
    });
  } catch (exception) {
    throw new Meteor.Error('dapps.send.updateOptInStatus.exception', exception);
  }
};

module.exportDefault(updateOptInStatus);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"verify.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// imports/modules/server/opt-ins/verify.js                                                                           //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let SimpleSchema;
module.link("simpl-schema", {
  default(v) {
    SimpleSchema = v;
  }

}, 1);
let VERIFY_CLIENT;
module.link("../../../startup/server/doichain-configuration.js", {
  VERIFY_CLIENT(v) {
    VERIFY_CLIENT = v;
  }

}, 2);
let nameShow;
module.link("../../../../server/api/doichain.js", {
  nameShow(v) {
    nameShow = v;
  }

}, 3);
let getOptInProvider;
module.link("../dns/get_opt-in-provider.js", {
  default(v) {
    getOptInProvider = v;
  }

}, 4);
let getOptInKey;
module.link("../dns/get_opt-in-key.js", {
  default(v) {
    getOptInKey = v;
  }

}, 5);
let verifySignature;
module.link("../doichain/verify_signature.js", {
  default(v) {
    verifySignature = v;
  }

}, 6);
let logVerify;
module.link("../../../startup/server/log-configuration", {
  logVerify(v) {
    logVerify = v;
  }

}, 7);
let getPublicKeyAndAddress;
module.link("../doichain/get_publickey_and_address_by_domain", {
  default(v) {
    getPublicKeyAndAddress = v;
  }

}, 8);
const VerifyOptInSchema = new SimpleSchema({
  recipient_mail: {
    type: String,
    regEx: SimpleSchema.RegEx.Email
  },
  sender_mail: {
    type: String,
    regEx: SimpleSchema.RegEx.Email
  },
  name_id: {
    type: String
  },
  recipient_public_key: {
    type: String
  }
});

const verifyOptIn = data => {
  try {
    const ourData = data;
    VerifyOptInSchema.validate(ourData);
    const entry = nameShow(VERIFY_CLIENT, ourData.name_id);
    if (entry === undefined) return false;
    const entryData = JSON.parse(entry.value);
    const firstCheck = verifySignature({
      data: ourData.recipient_mail + ourData.sender_mail,
      signature: entryData.signature,
      publicKey: ourData.recipient_public_key
    });
    if (!firstCheck) return {
      firstCheck: false
    };
    const parts = ourData.recipient_mail.split("@"); //TODO put this into getPublicKeyAndAddress

    const domain = parts[parts.length - 1];
    const publicKeyAndAddress = getPublicKeyAndAddress({
      domain: domain
    });
    const secondCheck = verifySignature({
      data: entryData.signature,
      signature: entryData.doiSignature,
      publicKey: publicKeyAndAddress.publicKey
    });
    if (!secondCheck) return {
      secondCheck: false
    };
    return true;
  } catch (exception) {
    throw new Meteor.Error('opt-ins.verify.exception', exception);
  }
};

module.exportDefault(verifyOptIn);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"recipients":{"add.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// imports/modules/server/recipients/add.js                                                                           //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let SimpleSchema;
module.link("simpl-schema", {
  default(v) {
    SimpleSchema = v;
  }

}, 1);
let Recipients;
module.link("../../../api/recipients/recipients.js", {
  Recipients(v) {
    Recipients = v;
  }

}, 2);
let getKeyPair;
module.link("../doichain/get_key-pair.js", {
  default(v) {
    getKeyPair = v;
  }

}, 3);
const AddRecipientSchema = new SimpleSchema({
  email: {
    type: String,
    regEx: SimpleSchema.RegEx.Email
  }
});

const addRecipient = recipient => {
  try {
    const ourRecipient = recipient;
    AddRecipientSchema.validate(ourRecipient);
    const recipients = Recipients.find({
      email: recipient.email
    }).fetch();
    if (recipients.length > 0) return recipients[0]._id;
    const keyPair = getKeyPair();
    return Recipients.insert({
      email: ourRecipient.email,
      privateKey: keyPair.privateKey,
      publicKey: keyPair.publicKey
    });
  } catch (exception) {
    throw new Meteor.Error('recipients.add.exception', exception);
  }
};

module.exportDefault(addRecipient);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"senders":{"add.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// imports/modules/server/senders/add.js                                                                              //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let SimpleSchema;
module.link("simpl-schema", {
  default(v) {
    SimpleSchema = v;
  }

}, 1);
let Senders;
module.link("../../../api/senders/senders.js", {
  Senders(v) {
    Senders = v;
  }

}, 2);
const AddSenderSchema = new SimpleSchema({
  email: {
    type: String,
    regEx: SimpleSchema.RegEx.Email
  }
});

const addSender = sender => {
  try {
    const ourSender = sender;
    AddSenderSchema.validate(ourSender);
    const senders = Senders.find({
      email: sender.email
    }).fetch();
    if (senders.length > 0) return senders[0]._id;
    return Senders.insert({
      email: ourSender.email
    });
  } catch (exception) {
    throw new Meteor.Error('senders.add.exception', exception);
  }
};

module.exportDefault(addSender);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}},"startup":{"server":{"dapp-configuration.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// imports/startup/server/dapp-configuration.js                                                                       //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  isDebug: () => isDebug,
  isRegtest: () => isRegtest,
  isTestnet: () => isTestnet,
  getUrl: () => getUrl
});
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);

function isDebug() {
  if (Meteor.settings !== undefined && Meteor.settings.app !== undefined && Meteor.settings.app.debug !== undefined) return Meteor.settings.app.debug;
  return false;
}

function isRegtest() {
  if (Meteor.settings !== undefined && Meteor.settings.app !== undefined && Meteor.settings.app.regtest !== undefined) return Meteor.settings.app.regtest;
  return false;
}

function isTestnet() {
  if (Meteor.settings !== undefined && Meteor.settings.app !== undefined && Meteor.settings.app.testnet !== undefined) return Meteor.settings.app.testnet;
  return false;
}

function getUrl() {
  if (Meteor.settings !== undefined && Meteor.settings.app !== undefined && Meteor.settings.app.host !== undefined) {
    let port = 3000;
    if (Meteor.settings.app.port !== undefined) port = Meteor.settings.app.port;
    return "http://" + Meteor.settings.app.host + ":" + port + "/";
  }

  return Meteor.absoluteUrl();
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"dns-configuration.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// imports/startup/server/dns-configuration.js                                                                        //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  FALLBACK_PROVIDER: () => FALLBACK_PROVIDER
});
const FALLBACK_PROVIDER = "doichain.org";
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"doichain-configuration.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// imports/startup/server/doichain-configuration.js                                                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  SEND_CLIENT: () => SEND_CLIENT,
  CONFIRM_CLIENT: () => CONFIRM_CLIENT,
  CONFIRM_ADDRESS: () => CONFIRM_ADDRESS,
  VERIFY_CLIENT: () => VERIFY_CLIENT
});
let namecoin;
module.link("namecoin", {
  default(v) {
    namecoin = v;
  }

}, 0);
let SEND_APP, CONFIRM_APP, VERIFY_APP, isAppType;
module.link("./type-configuration.js", {
  SEND_APP(v) {
    SEND_APP = v;
  },

  CONFIRM_APP(v) {
    CONFIRM_APP = v;
  },

  VERIFY_APP(v) {
    VERIFY_APP = v;
  },

  isAppType(v) {
    isAppType = v;
  }

}, 1);
var sendSettings = Meteor.settings.send;
var sendClient = undefined;

if (isAppType(SEND_APP)) {
  if (!sendSettings || !sendSettings.doichain) throw new Meteor.Error("config.send.doichain", "Send app doichain settings not found");
  sendClient = createClient(sendSettings.doichain);
}

const SEND_CLIENT = sendClient;
var confirmSettings = Meteor.settings.confirm;
var confirmClient = undefined;
var confirmAddress = undefined;

if (isAppType(CONFIRM_APP)) {
  if (!confirmSettings || !confirmSettings.doichain) throw new Meteor.Error("config.confirm.doichain", "Confirm app doichain settings not found");
  confirmClient = createClient(confirmSettings.doichain);
  confirmAddress = confirmSettings.doichain.address;
}

const CONFIRM_CLIENT = confirmClient;
const CONFIRM_ADDRESS = confirmAddress;
var verifySettings = Meteor.settings.verify;
var verifyClient = undefined;

if (isAppType(VERIFY_APP)) {
  if (!verifySettings || !verifySettings.doichain) throw new Meteor.Error("config.verify.doichain", "Verify app doichain settings not found");
  verifyClient = createClient(verifySettings.doichain);
}

const VERIFY_CLIENT = verifyClient;

function createClient(settings) {
  return new namecoin.Client({
    host: settings.host,
    port: settings.port,
    user: settings.username,
    pass: settings.password
  });
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"email-configuration.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// imports/startup/server/email-configuration.js                                                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  HashIds: () => HashIds,
  DOI_MAIL_FETCH_URL: () => DOI_MAIL_FETCH_URL,
  DOI_MAIL_DEFAULT_EMAIL_FROM: () => DOI_MAIL_DEFAULT_EMAIL_FROM
});
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let SEND_APP, CONFIRM_APP, isAppType;
module.link("./type-configuration.js", {
  SEND_APP(v) {
    SEND_APP = v;
  },

  CONFIRM_APP(v) {
    CONFIRM_APP = v;
  },

  isAppType(v) {
    isAppType = v;
  }

}, 1);
let Hashids;
module.link("hashids", {
  default(v) {
    Hashids = v;
  }

}, 2);
let logConfirm;
module.link("./log-configuration", {
  logConfirm(v) {
    logConfirm = v;
  }

}, 3);
const HashIds = new Hashids('0xugmLe7Nyee6vk1iF88(6CmwpqoG4hQ*-T74tjYw^O2vOO(Xl-91wA8*nCg_lX$');
var sendSettings = Meteor.settings.send;
var doiMailFetchUrl = undefined;

if (isAppType(SEND_APP)) {
  if (!sendSettings || !sendSettings.doiMailFetchUrl) throw new Meteor.Error("config.send.email", "Settings not found");
  doiMailFetchUrl = sendSettings.doiMailFetchUrl;
}

const DOI_MAIL_FETCH_URL = doiMailFetchUrl;
var defaultFrom = undefined;

if (isAppType(CONFIRM_APP)) {
  var confirmSettings = Meteor.settings.confirm;
  if (!confirmSettings || !confirmSettings.smtp) throw new Meteor.Error("config.confirm.smtp", "Confirm app email smtp settings not found");
  if (!confirmSettings.smtp.defaultFrom) throw new Meteor.Error("config.confirm.defaultFrom", "Confirm app email defaultFrom not found");
  defaultFrom = confirmSettings.smtp.defaultFrom;
  logConfirm('sending with defaultFrom:', defaultFrom);
  Meteor.startup(() => {
    if (confirmSettings.smtp.username === undefined) {
      process.env.MAIL_URL = 'smtp://' + encodeURIComponent(confirmSettings.smtp.server) + ':' + confirmSettings.smtp.port;
    } else {
      process.env.MAIL_URL = 'smtp://' + encodeURIComponent(confirmSettings.smtp.username) + ':' + encodeURIComponent(confirmSettings.smtp.password) + '@' + encodeURIComponent(confirmSettings.smtp.server) + ':' + confirmSettings.smtp.port;
    }

    logConfirm('using MAIL_URL:', process.env.MAIL_URL);
    if (confirmSettings.smtp.NODE_TLS_REJECT_UNAUTHORIZED !== undefined) process.env.NODE_TLS_REJECT_UNAUTHORIZED = confirmSettings.smtp.NODE_TLS_REJECT_UNAUTHORIZED; //0
  });
}

const DOI_MAIL_DEFAULT_EMAIL_FROM = defaultFrom;
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"fixtures.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// imports/startup/server/fixtures.js                                                                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let Roles;
module.link("meteor/alanning:roles", {
  Roles(v) {
    Roles = v;
  }

}, 1);
Meteor.startup(() => {
  if (Meteor.users.find().count() === 0) {
    const id = Accounts.createUser({
      username: 'admin',
      email: 'admin@sendeffect.de',
      password: 'password'
    });
    Roles.addUsersToRoles(id, 'admin');
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"index.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// imports/startup/server/index.js                                                                                    //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.link("./log-configuration.js");
module.link("./dapp-configuration.js");
module.link("./type-configuration.js");
module.link("./dns-configuration.js");
module.link("./doichain-configuration.js");
module.link("./fixtures.js");
module.link("./register-api.js");
module.link("./useraccounts-configuration.js");
module.link("./security.js");
module.link("./email-configuration.js");
module.link("./jobs.js");
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"jobs.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// imports/startup/server/jobs.js                                                                                     //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let MailJobs;
module.link("../../../server/api/mail_jobs.js", {
  MailJobs(v) {
    MailJobs = v;
  }

}, 1);
let BlockchainJobs;
module.link("../../../server/api/blockchain_jobs.js", {
  BlockchainJobs(v) {
    BlockchainJobs = v;
  }

}, 2);
let DAppJobs;
module.link("../../../server/api/dapp_jobs.js", {
  DAppJobs(v) {
    DAppJobs = v;
  }

}, 3);
let CONFIRM_APP, isAppType;
module.link("./type-configuration.js", {
  CONFIRM_APP(v) {
    CONFIRM_APP = v;
  },

  isAppType(v) {
    isAppType = v;
  }

}, 4);
let addCheckNewTransactionsBlockchainJob;
module.link("../../modules/server/jobs/add_check_new_transactions.js", {
  default(v) {
    addCheckNewTransactionsBlockchainJob = v;
  }

}, 5);
Meteor.startup(() => {
  MailJobs.startJobServer();
  BlockchainJobs.startJobServer();
  DAppJobs.startJobServer();
  if (isAppType(CONFIRM_APP)) addCheckNewTransactionsBlockchainJob();
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"log-configuration.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// imports/startup/server/log-configuration.js                                                                        //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  console: () => console,
  sendModeTagColor: () => sendModeTagColor,
  confirmModeTagColor: () => confirmModeTagColor,
  verifyModeTagColor: () => verifyModeTagColor,
  blockchainModeTagColor: () => blockchainModeTagColor,
  testingModeTagColor: () => testingModeTagColor,
  logSend: () => logSend,
  logConfirm: () => logConfirm,
  logVerify: () => logVerify,
  logBlockchain: () => logBlockchain,
  logMain: () => logMain,
  logError: () => logError,
  testLogging: () => testLogging
});
let isDebug;
module.link("./dapp-configuration", {
  isDebug(v) {
    isDebug = v;
  }

}, 0);

require('scribe-js')();

const console = process.console;
const sendModeTagColor = {
  msg: 'send-mode',
  colors: ['yellow', 'inverse']
};
const confirmModeTagColor = {
  msg: 'confirm-mode',
  colors: ['blue', 'inverse']
};
const verifyModeTagColor = {
  msg: 'verify-mode',
  colors: ['green', 'inverse']
};
const blockchainModeTagColor = {
  msg: 'blockchain-mode',
  colors: ['white', 'inverse']
};
const testingModeTagColor = {
  msg: 'testing-mode',
  colors: ['orange', 'inverse']
};

function logSend(message, param) {
  if (isDebug()) {
    console.time().tag(sendModeTagColor).log(message, param ? param : '');
  }
}

function logConfirm(message, param) {
  if (isDebug()) {
    console.time().tag(confirmModeTagColor).log(message, param ? param : '');
  }
}

function logVerify(message, param) {
  if (isDebug()) {
    console.time().tag(verifyModeTagColor).log(message, param ? param : '');
  }
}

function logBlockchain(message, param) {
  if (isDebug()) {
    console.time().tag(blockchainModeTagColor).log(message, param ? param : '');
  }
}

function logMain(message, param) {
  if (isDebug()) {
    console.time().tag(blockchainModeTagColor).log(message, param ? param : '');
  }
}

function logError(message, param) {
  if (isDebug()) {
    console.time().tag(blockchainModeTagColor).error(message, param ? param : '');
  }
}

function testLogging(message, param) {
  if (isDebug()) {
    console.time().tag(testingModeTagColor).log(message, param ? param : '');
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"register-api.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// imports/startup/server/register-api.js                                                                             //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.link("../../api/languages/methods.js");
module.link("../../api/doichain/methods.js");
module.link("../../api/recipients/server/publications.js");
module.link("../../api/opt-ins/methods.js");
module.link("../../api/opt-ins/server/publications.js");
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"security.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// imports/startup/server/security.js                                                                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let DDPRateLimiter;
module.link("meteor/ddp-rate-limiter", {
  DDPRateLimiter(v) {
    DDPRateLimiter = v;
  }

}, 1);

let _;

module.link("meteor/underscore", {
  _(v) {
    _ = v;
  }

}, 2);
// Don't let people write arbitrary data to their 'profile' field from the client
Meteor.users.deny({
  update() {
    return true;
  }

}); // Get a list of all accounts methods by running `Meteor.server.method_handlers` in meteor shell

const AUTH_METHODS = ['login', 'logout', 'logoutOtherClients', 'getNewToken', 'removeOtherTokens', 'configureLoginService', 'changePassword', 'forgotPassword', 'resetPassword', 'verifyEmail', 'createUser', 'ATRemoveService', 'ATCreateUserServer', 'ATResendVerificationEmail'];

if (Meteor.isServer) {
  // Only allow 2 login attempts per connection per 5 seconds
  DDPRateLimiter.addRule({
    name(name) {
      return _.contains(AUTH_METHODS, name);
    },

    // Rate limit per connection ID
    connectionId() {
      return true;
    }

  }, 2, 5000);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"type-configuration.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// imports/startup/server/type-configuration.js                                                                       //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  SEND_APP: () => SEND_APP,
  CONFIRM_APP: () => CONFIRM_APP,
  VERIFY_APP: () => VERIFY_APP,
  isAppType: () => isAppType
});
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
const SEND_APP = "send";
const CONFIRM_APP = "confirm";
const VERIFY_APP = "verify";

function isAppType(type) {
  if (Meteor.settings === undefined || Meteor.settings.app === undefined) throw "No settings found!";
  const types = Meteor.settings.app.types;
  if (types !== undefined) return types.includes(type);
  return false;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"useraccounts-configuration.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// imports/startup/server/useraccounts-configuration.js                                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
let Accounts;
module.link("meteor/accounts-base", {
  Accounts(v) {
    Accounts = v;
  }

}, 0);
Accounts.config({
  sendVerificationEmail: true,
  forbidClientAccountCreation: false
});
Accounts.emailTemplates.from = 'doichain@le-space.de';
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}},"server":{"api":{"rest":{"imports":{"confirm.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// server/api/rest/imports/confirm.js                                                                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
let Api, DOI_WALLETNOTIFY_ROUTE, DOI_CONFIRMATION_ROUTE;
module.link("../rest.js", {
  Api(v) {
    Api = v;
  },

  DOI_WALLETNOTIFY_ROUTE(v) {
    DOI_WALLETNOTIFY_ROUTE = v;
  },

  DOI_CONFIRMATION_ROUTE(v) {
    DOI_CONFIRMATION_ROUTE = v;
  }

}, 0);
let confirmOptIn;
module.link("../../../../imports/modules/server/opt-ins/confirm.js", {
  default(v) {
    confirmOptIn = v;
  }

}, 1);
let checkNewTransaction;
module.link("../../../../imports/modules/server/doichain/check_new_transactions", {
  default(v) {
    checkNewTransaction = v;
  }

}, 2);
let logConfirm;
module.link("../../../../imports/startup/server/log-configuration", {
  logConfirm(v) {
    logConfirm = v;
  }

}, 3);
//doku of meteor-restivus https://github.com/kahmali/meteor-restivus
Api.addRoute(DOI_CONFIRMATION_ROUTE + '/:hash', {
  authRequired: false
}, {
  get: {
    action: function () {
      const hash = this.urlParams.hash;

      try {
        let ip = this.request.headers['x-forwarded-for'] || this.request.connection.remoteAddress || this.request.socket.remoteAddress || (this.request.connection.socket ? this.request.connection.socket.remoteAddress : null);
        if (ip.indexOf(',') != -1) ip = ip.substring(0, ip.indexOf(','));
        logConfirm('REST opt-in/confirm :', {
          hash: hash,
          host: ip
        });
        const redirect = confirmOptIn({
          host: ip,
          hash: hash
        });
        return {
          statusCode: 303,
          headers: {
            'Content-Type': 'text/plain',
            'Location': redirect
          },
          body: 'Location: ' + redirect
        };
      } catch (error) {
        return {
          statusCode: 500,
          body: {
            status: 'fail',
            message: error.message
          }
        };
      }
    }
  }
});
Api.addRoute(DOI_WALLETNOTIFY_ROUTE, {
  get: {
    authRequired: false,
    action: function () {
      const params = this.queryParams;
      const txid = params.tx;

      try {
        checkNewTransaction(txid);
        return {
          status: 'success',
          data: 'txid:' + txid + ' was read from blockchain'
        };
      } catch (error) {
        return {
          status: 'fail',
          error: error.message
        };
      }
    }
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"debug.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// server/api/rest/imports/debug.js                                                                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
let Api;
module.link("../rest.js", {
  Api(v) {
    Api = v;
  }

}, 0);
Api.addRoute('debug/mail', {
  authRequired: false
}, {
  get: {
    action: function () {
      const data = {
        "from": "noreply@doichain.org",
        "subject": "Doichain.org Newsletter Bestätigung",
        "redirect": "https://www.doichain.org/vielen-dank/",
        "returnPath": "noreply@doichain.org",
        "content": "<style type='text/css' media='screen'>\n" + "* {\n" + "\tline-height: inherit;\n" + "}\n" + ".ExternalClass * {\n" + "\tline-height: 100%;\n" + "}\n" + "body, p {\n" + "\tmargin: 0;\n" + "\tpadding: 0;\n" + "\tmargin-bottom: 0;\n" + "\t-webkit-text-size-adjust: none;\n" + "\t-ms-text-size-adjust: none;\n" + "}\n" + "img {\n" + "\tline-height: 100%;\n" + "\toutline: none;\n" + "\ttext-decoration: none;\n" + "\t-ms-interpolation-mode: bicubic;\n" + "}\n" + "a img {\n" + "\tborder: none;\n" + "}\n" + "#backgroundTable {\n" + "\tmargin: 0;\n" + "\tpadding: 0;\n" + "\twidth: 100% !important;\n" + "}\n" + "a, a:link, .no-detect-local a, .appleLinks a {\n" + "\tcolor: #5555ff !important;\n" + "\ttext-decoration: underline;\n" + "}\n" + ".ExternalClass {\n" + "\tdisplay: block !important;\n" + "\twidth: 100%;\n" + "}\n" + ".ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div {\n" + "\tline-height: inherit;\n" + "}\n" + "table td {\n" + "\tborder-collapse: collapse;\n" + "\tmso-table-lspace: 0pt;\n" + "\tmso-table-rspace: 0pt;\n" + "}\n" + "sup {\n" + "\tposition: relative;\n" + "\ttop: 4px;\n" + "\tline-height: 7px !important;\n" + "\tfont-size: 11px !important;\n" + "}\n" + ".mobile_link a[href^='tel'], .mobile_link a[href^='sms'] {\n" + "\ttext-decoration: default;\n" + "\tcolor: #5555ff !important;\n" + "\tpointer-events: auto;\n" + "\tcursor: default;\n" + "}\n" + ".no-detect a {\n" + "\ttext-decoration: none;\n" + "\tcolor: #5555ff;\n" + "\tpointer-events: auto;\n" + "\tcursor: default;\n" + "}\n" + "{\n" + "color: #5555ff;\n" + "}\n" + "span {\n" + "\tcolor: inherit;\n" + "\tborder-bottom: none;\n" + "}\n" + "span:hover {\n" + "\tbackground-color: transparent;\n" + "}\n" + ".nounderline {\n" + "\ttext-decoration: none !important;\n" + "}\n" + "h1, h2, h3 {\n" + "\tmargin: 0;\n" + "\tpadding: 0;\n" + "}\n" + "p {\n" + "\tMargin: 0px !important;\n" + "}\n" + "table[class='email-root-wrapper'] {\n" + "\twidth: 600px !important;\n" + "}\n" + "body {\n" + "}\n" + "body {\n" + "\tmin-width: 280px;\n" + "\twidth: 100%;\n" + "}\n" + "td[class='pattern'] .c112p20r {\n" + "\twidth: 20%;\n" + "}\n" + "td[class='pattern'] .c336p60r {\n" + "\twidth: 60.000000000000256%;\n" + "}\n" + "</style>\n" + "<style>\n" + "@media only screen and (max-width: 599px), only screen and (max-device-width: 599px), only screen and (max-width: 400px), only screen and (max-device-width: 400px) {\n" + ".email-root-wrapper {\n" + "\twidth: 100% !important;\n" + "}\n" + ".full-width {\n" + "\twidth: 100% !important;\n" + "\theight: auto !important;\n" + "\ttext-align: center;\n" + "}\n" + ".fullwidthhalfleft {\n" + "\twidth: 100% !important;\n" + "}\n" + ".fullwidthhalfright {\n" + "\twidth: 100% !important;\n" + "}\n" + ".fullwidthhalfinner {\n" + "\twidth: 100% !important;\n" + "\tmargin: 0 auto !important;\n" + "\tfloat: none !important;\n" + "\tmargin-left: auto !important;\n" + "\tmargin-right: auto !important;\n" + "\tclear: both !important;\n" + "}\n" + ".hide {\n" + "\tdisplay: none !important;\n" + "\twidth: 0px !important;\n" + "\theight: 0px !important;\n" + "\toverflow: hidden;\n" + "}\n" + ".desktop-hide {\n" + "\tdisplay: block !important;\n" + "\twidth: 100% !important;\n" + "\theight: auto !important;\n" + "\toverflow: hidden;\n" + "\tmax-height: inherit !important;\n" + "}\n" + ".c112p20r {\n" + "\twidth: 100% !important;\n" + "\tfloat: none;\n" + "}\n" + ".c336p60r {\n" + "\twidth: 100% !important;\n" + "\tfloat: none;\n" + "}\n" + "}\n" + "</style>\n" + "<style>\n" + "@media only screen and (min-width: 600px) {\n" + "td[class='pattern'] .c112p20r {\n" + "\twidth: 112px !important;\n" + "}\n" + "td[class='pattern'] .c336p60r {\n" + "\twidth: 336px !important;\n" + "}\n" + "}\n" + "\n" + "@media only screen and (max-width: 599px), only screen and (max-device-width: 599px), only screen and (max-width: 400px), only screen and (max-device-width: 400px) {\n" + "table[class='email-root-wrapper'] {\n" + "\twidth: 100% !important;\n" + "}\n" + "td[class='wrap'] .full-width {\n" + "\twidth: 100% !important;\n" + "\theight: auto !important;\n" + "}\n" + "td[class='wrap'] .fullwidthhalfleft {\n" + "\twidth: 100% !important;\n" + "}\n" + "td[class='wrap'] .fullwidthhalfright {\n" + "\twidth: 100% !important;\n" + "}\n" + "td[class='wrap'] .fullwidthhalfinner {\n" + "\twidth: 100% !important;\n" + "\tmargin: 0 auto !important;\n" + "\tfloat: none !important;\n" + "\tmargin-left: auto !important;\n" + "\tmargin-right: auto !important;\n" + "\tclear: both !important;\n" + "}\n" + "td[class='wrap'] .hide {\n" + "\tdisplay: none !important;\n" + "\twidth: 0px;\n" + "\theight: 0px;\n" + "\toverflow: hidden;\n" + "}\n" + "td[class='pattern'] .c112p20r {\n" + "\twidth: 100% !important;\n" + "}\n" + "td[class='pattern'] .c336p60r {\n" + "\twidth: 100% !important;\n" + "}\n" + "}\n" + "\n" + "@media yahoo {\n" + "table {\n" + "\tfloat: none !important;\n" + "\theight: auto;\n" + "}\n" + "table[align='left'] {\n" + "\tfloat: left !important;\n" + "}\n" + "td[align='left'] {\n" + "\tfloat: left !important;\n" + "\theight: auto;\n" + "}\n" + "table[align='center'] {\n" + "\tmargin: 0 auto;\n" + "}\n" + "td[align='center'] {\n" + "\tmargin: 0 auto;\n" + "\theight: auto;\n" + "}\n" + "table[align='right'] {\n" + "\tfloat: right !important;\n" + "}\n" + "td[align='right'] {\n" + "\tfloat: right !important;\n" + "\theight: auto;\n" + "}\n" + "}\n" + "</style>\n" + "\n" + "<!--[if (gte IE 7) & (vml)]>\n" + "<style type='text/css'>\n" + "html, body {margin:0 !important; padding:0px !important;}\n" + "img.full-width { position: relative !important; }\n" + "\n" + ".img240x30 { width: 240px !important; height: 30px !important;}\n" + ".img20x20 { width: 20px !important; height: 20px !important;}\n" + "\n" + "</style>\n" + "<![endif]-->\n" + "\n" + "<!--[if gte mso 9]>\n" + "<style type='text/css'>\n" + ".mso-font-fix-arial { font-family: Arial, sans-serif;}\n" + ".mso-font-fix-georgia { font-family: Georgia, sans-serif;}\n" + ".mso-font-fix-tahoma { font-family: Tahoma, sans-serif;}\n" + ".mso-font-fix-times_new_roman { font-family: 'Times New Roman', sans-serif;}\n" + ".mso-font-fix-trebuchet_ms { font-family: 'Trebuchet MS', sans-serif;}\n" + ".mso-font-fix-verdana { font-family: Verdana, sans-serif;}\n" + "</style>\n" + "<![endif]-->\n" + "\n" + "<!--[if gte mso 9]>\n" + "<style type='text/css'>\n" + "table, td {\n" + "border-collapse: collapse !important;\n" + "mso-table-lspace: 0px !important;\n" + "mso-table-rspace: 0px !important;\n" + "}\n" + "\n" + ".email-root-wrapper { width 600px !important;}\n" + ".imglink { font-size: 0px; }\n" + ".edm_button { font-size: 0px; }\n" + "</style>\n" + "<![endif]-->\n" + "\n" + "<!--[if gte mso 15]>\n" + "<style type='text/css'>\n" + "table {\n" + "font-size:0px;\n" + "mso-margin-top-alt:0px;\n" + "}\n" + "\n" + ".fullwidthhalfleft {\n" + "width: 49% !important;\n" + "float:left !important;\n" + "}\n" + "\n" + ".fullwidthhalfright {\n" + "width: 50% !important;\n" + "float:right !important;\n" + "}\n" + "</style>\n" + "<![endif]-->\n" + "<style type='text/css' media='(pointer) and (min-color-index:0)'>\n" + "html, body {\n" + "\tbackground-image: none !important;\n" + "\tbackground-color: #ebebeb !important;\n" + "\tmargin: 0 !important;\n" + "\tpadding: 0 !important;\n" + "}\n" + "</style>\n" + "</head>\n" + "<body leftmargin='0' marginwidth='0' topmargin='0' marginheight='0' offset='0' background=\"\" bgcolor='#ebebeb' style='font-family:Arial, sans-serif; font-size:0px;margin:0;padding:0; '>\n" + "<!--[if t]><![endif]--><!--[if t]><![endif]--><!--[if t]><![endif]--><!--[if t]><![endif]--><!--[if t]><![endif]--><!--[if t]><![endif]-->\n" + "<table align='center' border='0' cellpadding='0' cellspacing='0' background=\"\"  height='100%' width='100%' id='backgroundTable'>\n" + "  <tr>\n" + "    <td class='wrap' align='center' valign='top' width='100%'>\n" + "\t\t<center>\n" + "        <!-- content -->\n" + "        \t<div style='padding: 0px;'>\n" + "        \t  <table cellpadding='0' cellspacing='0' border='0' width='100%' bgcolor='#ebebeb'>\n" + "           \t\t <tr>\n" + "            \t\t  <td valign='top' style='padding: 0px;'>\n" + "\t\t\t\t\t\t  <table cellpadding='0' cellspacing='0' width='600' align='center' style='max-width: 600px;min-width: 240px;margin: 0 auto;' class='email-root-wrapper'>\n" + "                 \t\t \t\t<tr>\n" + "                   \t\t\t\t\t <td valign='top' style='padding: 0px;'>\n" + "\t\t\t\t\t\t\t\t \t\t<table cellpadding='0' cellspacing='0' border='0' width='100%' bgcolor='#FFFFFF' style='border: 0px none;background-color: #FFFFFF;'>\n" + "                       \t\t\t\t\t\t <tr>\n" + "                       \t\t\t  \t\t\t\t <td valign='top' style='padding-top: 30px;padding-right: 20px;padding-bottom: 35px;padding-left: 20px;'>\n" + "\t\t\t\t\t\t\t\t\t   \t\t\t\t\n" + "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<table cellpadding='0'\n" + "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tcellspacing='0' border='0' align='center' width='240'  style='border: 0px none;height: auto;' class='full-width'>\n" + "                                         \t \t\t\t\t\t\t\t\t\t<tr>\n" + "                                            \t\t\t\t\t\t\t\t\t\t<td valign='top' style='padding: 0px;'><img src='https://sf26.sendsfx.com/admin/temp/user/17/doichain_100h.png' width='240' height='30' alt=\"\" border='0' style='display: block;width: 100%;height: auto;' class='full-width img240x30' /></td>\n" + "                                         \t \t\t\t\t\t\t\t\t\t</tr>\n" + "                                        \t\t\t\t\t\t\t\t\t</table>\n" + "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\n" + "\t\t\t\t\t\t\t\t\t\t\t\t</td>\n" + "                      \t\t  \t\t\t\t</tr>\n" + "                      \t\t\t\t\t</table>\n" + "\t\t\t\t\t\t\t\t \n" + "\t\t\t\t\t\t\t\t \n" + "                      <table cellpadding='0' cellspacing='0' border='0' width='100%' bgcolor='#0071aa' style='border: 0px none;background-color: #0071aa;background-image: url('https://sf26.sendsfx.com/admin/temp/user/17/blue-bg.jpg');background-repeat: no-repeat ;background-position: center;'>\n" + "                        <tr>\n" + "                          <td valign='top' style='padding-top: 40px;padding-right: 20px;padding-bottom: 45px;padding-left: 20px;'><table cellpadding='0' cellspacing='0' width='100%'>\n" + "                              <tr>\n" + "                                <td style='padding: 0px;' class='pattern'><table cellpadding='0' cellspacing='0' border='0' width='100%'>\n" + "                                    <tr>\n" + "                                      <td valign='top' style='padding-bottom: 10px;'><div style='text-align: left;font-family: arial;font-size: 20px;color: #ffffff;line-height: 30px;mso-line-height: exactly;mso-text-raise: 5px;'>\n" + "                                          <p\n" + "style='padding: 0; margin: 0;text-align: center;'>Bitte bestätigen Sie Ihre Anmeldung</p>\n" + "                                        </div></td>\n" + "                                    </tr>\n" + "                                  </table>\n" + "                                  <table cellpadding='0' cellspacing='0' border='0' width='100%'>\n" + "                                    <tr>\n" + "                                      <td valign='top' style='padding: 0;mso-cellspacing: 0in;'><table cellpadding='0' cellspacing='0' border='0' align='left' width='112'  style='float: left;' class='c112p20r'>\n" + "                                          <tr>\n" + "                                            <td valign='top' style='padding: 0px;'><table cellpadding='0' cellspacing='0' border='0' width='100%' style='border: 0px none;' class='hide'>\n" + "                                                <tr>\n" + "                                                  <td valign='top' style='padding: 0px;'><table cellpadding='0' cellspacing='0' width='100%'>\n" + "                                                      <tr>\n" + "                                                        <td style='padding: 0px;'><table cellpadding='0' cellspacing='0' width='100%'>\n" + "                                                            <tr>\n" + "                                                              <td align='center' style='padding: 0px;'><table cellpadding='0' cellspacing='0' border='0' align='center' width='20'  style='border: 0px none;height: auto;'>\n" + "                                                                  <tr>\n" + "                                                                    <td valign='top' style='padding: 0px;'><img\n" + "src='https://sf26.sendsfx.com/admin/temp/user/17/img_89837318.png' width='20' height='20' alt=\"\" border='0' style='display: block;' class='img20x20' /></td>\n" + "                                                                  </tr>\n" + "                                                                </table></td>\n" + "                                                            </tr>\n" + "                                                          </table></td>\n" + "                                                      </tr>\n" + "                                                    </table></td>\n" + "                                                </tr>\n" + "                                              </table></td>\n" + "                                          </tr>\n" + "                                        </table>\n" + "                                        \n" + "                                        <!--[if gte mso 9]></td><td valign='top' style='padding:0;'><![endif]-->\n" + "                                        \n" + "                                        <table cellpadding='0' cellspacing='0' border='0' align='left' width='336'  style='float: left;' class='c336p60r'>\n" + "                                          <tr>\n" + "                                            <td valign='top' style='padding: 0px;'><table cellpadding='0' cellspacing='0' border='0' width='100%'>\n" + "                                                <tr>\n" + "                                                  <td valign='top' style='padding-bottom: 30px;'><table cellpadding='0' cellspacing='0' width='100%'>\n" + "                                                      <tr>\n" + "                                                        <td style='padding: 0px;'><table cellpadding='0' cellspacing='0' border='0' width='100%' style='border-top: 2px solid #ffffff;'>\n" + "                                                            <tr>\n" + "                                                              <td valign='top'><table cellpadding='0' cellspacing='0' width='100%'>\n" + "                                                                  <tr>\n" + "                                                                    <td style='padding: 0px;'></td>\n" + "                                                                  </tr>\n" + "                                                                </table></td>\n" + "                                                            </tr>\n" + "                                                          </table></td>\n" + "                                                      </tr>\n" + "                                                    </table></td>\n" + "                                                </tr>\n" + "                                              </table></td>\n" + "                                          </tr>\n" + "                                        </table>\n" + "                                        \n" + "                                        <!--[if gte mso 9]></td><td valign='top' style='padding:0;'><![endif]-->\n" + "                                        \n" + "                                        <table cellpadding='0' cellspacing='0' border='0' align='left' width='112'  style='float: left;' class='c112p20r'>\n" + "                                          <tr>\n" + "                                            <td valign='top' style='padding: 0px;'><table cellpadding='0' cellspacing='0' border='0' width='100%' style='border: 0px none;' class='hide'>\n" + "                                                <tr>\n" + "                                                  <td valign='top' style='padding: 0px;'><table cellpadding='0' cellspacing='0' width='100%'>\n" + "                                                      <tr>\n" + "                                                        <td style='padding: 0px;'><table cellpadding='0' cellspacing='0' width='100%'>\n" + "                                                            <tr>\n" + "                                                              <td align='center' style='padding: 0px;'><table cellpadding='0' cellspacing='0' border='0' align='center' width='20'  style='border: 0px none;height: auto;'>\n" + "                                                                  <tr>\n" + "                                                                    <td valign='top' style='padding: 0px;'><img src='https://sf26.sendsfx.com/admin/temp/user/17/img_89837318.png' width='20' height='20' alt=\"\" border='0' style='display: block;' class='img20x20'\n" + "/></td>\n" + "                                                                  </tr>\n" + "                                                                </table></td>\n" + "                                                            </tr>\n" + "                                                          </table></td>\n" + "                                                      </tr>\n" + "                                                    </table></td>\n" + "                                                </tr>\n" + "                                              </table></td>\n" + "                                          </tr>\n" + "                                        </table></td>\n" + "                                    </tr>\n" + "                                  </table>\n" + "                                  <table cellpadding='0' cellspacing='0' border='0' width='100%'>\n" + "                                    <tr>\n" + "                                      <td valign='top' style='padding-bottom: 20px;'><div style='text-align: left;font-family: arial;font-size: 16px;color: #ffffff;line-height: 26px;mso-line-height: exactly;mso-text-raise: 5px;'>\n" + "                                          <p style='padding: 0; margin: 0;text-align: center;'>Vielen Dank, dass Sie sich für unseren Newsletter angemeldet haben.</p>\n" + "                                          <p style='padding: 0; margin: 0;text-align: center;'>Um diese E-Mail-Adresse und Ihre kostenlose Anmeldung zu bestätigen, klicken Sie bitte jetzt auf den folgenden Button:</p>\n" + "                                        </div></td>\n" + "                                    </tr>\n" + "                                  </table>\n" + "                                  <table cellpadding='0' cellspacing='0' width='100%'>\n" + "                                    <tr>\n" + "                                      <td align='center' style='padding: 0px;'><table cellpadding='0' cellspacing='0' border='0' align='center' style='text-align: center;color: #000;' class='full-width'>\n" + "                                          <tr>\n" + "                                            <td valign='top' align='center' style='padding-right: 10px;padding-bottom: 30px;padding-left: 10px;'><table cellpadding='0' cellspacing='0' border='0' bgcolor='#85ac1c' style='border: 0px none;border-radius: 5px;border-collapse: separate !important;background-color: #85ac1c;' class='full-width'>\n" + "                                                <tr>\n" + "                                                  <td valign='top' align='center' style='padding: 12px;'><a href='${confirmation_url}' target='_blank' style='text-decoration: none;' class='edm_button'><span style='font-family: arial;font-size: 18px;color: #ffffff;line-height: 28px;text-decoration: none;'><span\n" + "style='font-size: 18px;'>Jetzt Anmeldung best&auml;tigen</span></span> </a></td>\n" + "                                                </tr>\n" + "                                              </table></td>\n" + "                                          </tr>\n" + "                                        </table></td>\n" + "                                    </tr>\n" + "                                  </table>\n" + "                                  <div style='text-align: left;font-family: arial;font-size: 12px;color: #ffffff;line-height: 22px;mso-line-height: exactly;mso-text-raise: 5px;'>\n" + "                                    <p style='padding: 0; margin: 0;text-align: center;'>Wenn Sie ihre E-Mail-Adresse nicht bestätigen, können keine Newsletter zugestellt werden. Ihr Einverständnis können Sie selbstverständlich jederzeit widerrufen. Sollte es sich bei der Anmeldung um ein Versehen handeln oder wurde der Newsletter nicht in Ihrem Namen bestellt, können Sie diese E-Mail einfach ignorieren. Ihnen werden keine weiteren Nachrichten zugeschickt.</p>\n" + "                                  </div></td>\n" + "                              </tr>\n" + "                            </table></td>\n" + "                        </tr>\n" + "                      </table>\n" + "                      <table cellpadding='0' cellspacing='0' border='0' width='100%' bgcolor='#ffffff' style='border: 0px none;background-color: #ffffff;'>\n" + "                        <tr>\n" + "                          <td valign='top' style='padding-top: 30px;padding-right: 20px;padding-bottom: 35px;padding-left: 20px;'><table cellpadding='0' cellspacing='0' width='100%'>\n" + "                              <tr>\n" + "                                <td style='padding: 0px;'><table cellpadding='0' cellspacing='0' border='0' width='100%'>\n" + "                                    <tr>\n" + "                                      <td valign='top' style='padding-bottom: 25px;'><div style='text-align: left;font-family: arial;font-size: 12px;color: #333333;line-height: 22px;mso-line-height: exactly;mso-text-raise: 5px;'>\n" + "                                          <p style='padding: 0; margin: 0;text-align: center;'><span style='line-height: 3;'><strong>Kontakt</strong></span><br>\n" + "                                            service@sendeffect.de<br>\n" + "                                            www.sendeffect.de<br>\n" + "                                            Telefon: +49 (0) 8571 - 97 39 - 69-0</p>\n" + "                                        </div></td>\n" + "                                    </tr>\n" + "                                  </table>\n" + "                                  <div style='text-align: left;font-family: arial;font-size: 12px;color: #333333;line-height: 22px;mso-line-height: exactly;mso-text-raise: 5px;'>\n" + "                                    <p style='padding: 0; margin: 0;text-align: center;'><span style='line-height: 3;'><strong>Impressum</strong></span><br>\n" + "                                      Anschrift: Schulgasse 5, D-84359 Simbach am Inn, eMail: service@sendeffect.de<br>\n" + "                                      Betreiber: WEBanizer AG, Registergericht: Amtsgericht Landshut HRB 5177, UstId.: DE 2068 62 070<br>\n" + "                                      Vorstand: Ottmar Neuburger, Aufsichtsrat: Tobias Neuburger</p>\n" + "                                  </div></td>\n" + "                              </tr>\n" + "                            </table></td>\n" + "                        </tr>\n" + "                      </table></td>\n" + "                  </tr>\n" + "                </table></td>\n" + "            </tr>\n" + "          </table>\n" + "        </div>\n" + "        <!-- content end -->\n" + "      </center></td>\n" + "  </tr>\n" + "</table>"
      };
      return {
        "status": "success",
        "data": data
      };
    }
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"send.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// server/api/rest/imports/send.js                                                                                    //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

let Api, DOI_FETCH_ROUTE, DOI_CONFIRMATION_NOTIFY_ROUTE;
module.link("../rest.js", {
  Api(v) {
    Api = v;
  },

  DOI_FETCH_ROUTE(v) {
    DOI_FETCH_ROUTE = v;
  },

  DOI_CONFIRMATION_NOTIFY_ROUTE(v) {
    DOI_CONFIRMATION_NOTIFY_ROUTE = v;
  }

}, 0);
let addOptIn;
module.link("../../../../imports/modules/server/opt-ins/add_and_write_to_blockchain.js", {
  default(v) {
    addOptIn = v;
  }

}, 1);
let updateOptInStatus;
module.link("../../../../imports/modules/server/opt-ins/update_status.js", {
  default(v) {
    updateOptInStatus = v;
  }

}, 2);
let getDoiMailData;
module.link("../../../../imports/modules/server/dapps/get_doi-mail-data.js", {
  default(v) {
    getDoiMailData = v;
  }

}, 3);
let logError, logSend;
module.link("../../../../imports/startup/server/log-configuration", {
  logError(v) {
    logError = v;
  },

  logSend(v) {
    logSend = v;
  }

}, 4);
let DOI_EXPORT_ROUTE;
module.link("../rest", {
  DOI_EXPORT_ROUTE(v) {
    DOI_EXPORT_ROUTE = v;
  }

}, 5);
let exportDois;
module.link("../../../../imports/modules/server/dapps/export_dois", {
  default(v) {
    exportDois = v;
  }

}, 6);
let OptIns;
module.link("../../../../imports/api/opt-ins/opt-ins", {
  OptIns(v) {
    OptIns = v;
  }

}, 7);
let Roles;
module.link("meteor/alanning:roles", {
  Roles(v) {
    Roles = v;
  }

}, 8);
//doku of meteor-restivus https://github.com/kahmali/meteor-restivus
Api.addRoute(DOI_CONFIRMATION_NOTIFY_ROUTE, {
  post: {
    authRequired: true,
    //roleRequired: ['admin'],
    action: function () {
      const qParams = this.queryParams;
      const bParams = this.bodyParams;
      let params = {};
      if (qParams !== undefined) params = (0, _objectSpread2.default)({}, qParams);
      if (bParams !== undefined) params = (0, _objectSpread2.default)({}, params, bParams);
      const uid = this.userId;

      if (!Roles.userIsInRole(uid, 'admin') || //if its not an admin always use uid as ownerId
      Roles.userIsInRole(uid, 'admin') && (params["ownerId"] == null || params["ownerId"] == undefined)) {
        //if its an admin only use uid in case no ownerId was given
        params["ownerId"] = uid;
      }

      logSend('parameter received from browser:', params);

      if (params.sender_mail.constructor === Array) {
        //this is a SOI with co-sponsors first email is main sponsor
        return prepareCoDOI(params);
      } else {
        return prepareAdd(params);
      }
    }
  },
  put: {
    authRequired: false,
    action: function () {
      const qParams = this.queryParams;
      const bParams = this.bodyParams;
      logSend('qParams:', qParams);
      logSend('bParams:', bParams);
      let params = {};
      if (qParams !== undefined) params = (0, _objectSpread2.default)({}, qParams);
      if (bParams !== undefined) params = (0, _objectSpread2.default)({}, params, bParams);

      try {
        const val = updateOptInStatus(params);
        logSend('opt-In status updated', val);
        return {
          status: 'success',
          data: {
            message: 'Opt-In status updated'
          }
        };
      } catch (error) {
        return {
          statusCode: 500,
          body: {
            status: 'fail',
            message: error.message
          }
        };
      }
    }
  }
});
Api.addRoute(DOI_FETCH_ROUTE, {
  authRequired: false
}, {
  get: {
    action: function () {
      const params = this.queryParams;

      try {
        logSend('rest api - DOI_FETCH_ROUTE called by bob to request email template', JSON.stringify(params));
        const data = getDoiMailData(params);
        logSend('got doi-mail-data (including templalte) returning to bob', {
          subject: data.subject,
          recipient: data.recipient
        });
        return {
          status: 'success',
          data
        };
      } catch (error) {
        logError('error while getting DoiMailData', error);
        return {
          status: 'fail',
          error: error.message
        };
      }
    }
  }
});
Api.addRoute(DOI_EXPORT_ROUTE, {
  get: {
    authRequired: true,
    //roleRequired: ['admin'],
    action: function () {
      let params = this.queryParams;
      const uid = this.userId;

      if (!Roles.userIsInRole(uid, 'admin')) {
        params = {
          userid: uid,
          role: 'user'
        };
      } else {
        params = (0, _objectSpread2.default)({}, params, {
          role: 'admin'
        });
      }

      try {
        logSend('rest api - DOI_EXPORT_ROUTE called', JSON.stringify(params));
        const data = exportDois(params);
        logSend('got dois from database', JSON.stringify(data));
        return {
          status: 'success',
          data
        };
      } catch (error) {
        logError('error while exporting confirmed dois', error);
        return {
          status: 'fail',
          error: error.message
        };
      }
    }
  }
});

function prepareCoDOI(params) {
  logSend('is array ', params.sender_mail);
  const senders = params.sender_mail;
  const recipient_mail = params.recipient_mail;
  const data = params.data;
  const ownerID = params.ownerId;
  let currentOptInId;
  let retResponse = [];
  let master_doi;
  senders.forEach((sender, index) => {
    const ret_response = prepareAdd({
      sender_mail: sender,
      recipient_mail: recipient_mail,
      data: data,
      master_doi: master_doi,
      index: index,
      ownerId: ownerID
    });
    logSend('CoDOI:', ret_response);
    if (ret_response.status === undefined || ret_response.status === "failed") throw "could not add co-opt-in";
    retResponse.push(ret_response);
    currentOptInId = ret_response.data.id;

    if (index === 0) {
      logSend('main sponsor optInId:', currentOptInId);
      const optIn = OptIns.findOne({
        _id: currentOptInId
      });
      master_doi = optIn.nameId;
      logSend('main sponsor nameId:', master_doi);
    }
  });
  logSend(retResponse);
  return retResponse;
}

function prepareAdd(params) {
  try {
    const val = addOptIn(params);
    logSend('opt-In added ID:', val);
    return {
      status: 'success',
      data: {
        id: val,
        status: 'success',
        message: 'Opt-In added.'
      }
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: {
        status: 'fail',
        message: error.message
      }
    };
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"user.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// server/api/rest/imports/user.js                                                                                    //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

let Api;
module.link("../rest.js", {
  Api(v) {
    Api = v;
  }

}, 0);
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 1);
let Accounts;
module.link("meteor/accounts-base", {
  Accounts(v) {
    Accounts = v;
  }

}, 2);
let SimpleSchema;
module.link("simpl-schema", {
  default(v) {
    SimpleSchema = v;
  }

}, 3);
let Roles;
module.link("meteor/alanning:roles", {
  Roles(v) {
    Roles = v;
  }

}, 4);
let logMain;
module.link("../../../../imports/startup/server/log-configuration", {
  logMain(v) {
    logMain = v;
  }

}, 5);
const mailTemplateSchema = new SimpleSchema({
  subject: {
    type: String,
    optional: true
  },
  redirect: {
    type: String,
    regEx: "@(https?|ftp)://(-\\.)?([^\\s/?\\.#-]+\\.?)+(/[^\\s]*)?$@",
    optional: true
  },
  returnPath: {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
    optional: true
  },
  templateURL: {
    type: String,
    regEx: "@(https?|ftp)://(-\\.)?([^\\s/?\\.#-]+\\.?)+(/[^\\s]*)?$@",
    optional: true
  }
});
const createUserSchema = new SimpleSchema({
  username: {
    type: String,
    regEx: "^[A-Z,a-z,0-9,!,_,$,#]{4,24}$" //Only usernames between 4-24 characters from A-Z,a-z,0-9,!,_,$,# allowed

  },
  email: {
    type: String,
    regEx: SimpleSchema.RegEx.Email
  },
  password: {
    type: String,
    regEx: "^[A-Z,a-z,0-9,!,_,$,#]{8,24}$" //Only passwords between 8-24 characters from A-Z,a-z,0-9,!,_,$,# allowed

  },
  mailTemplate: {
    type: mailTemplateSchema,
    optional: true
  }
});
const updateUserSchema = new SimpleSchema({
  mailTemplate: {
    type: mailTemplateSchema
  }
}); //TODO: collection options separate

const collectionOptions = {
  path: "users",
  routeOptions: {
    authRequired: true //,roleRequired : "admin"

  },
  excludedEndpoints: ['patch', 'deleteAll'],
  endpoints: {
    delete: {
      roleRequired: "admin"
    },
    post: {
      roleRequired: "admin",
      action: function () {
        const qParams = this.queryParams;
        const bParams = this.bodyParams;
        let params = {};
        if (qParams !== undefined) params = (0, _objectSpread2.default)({}, qParams);
        if (bParams !== undefined) params = (0, _objectSpread2.default)({}, params, bParams);

        try {
          let userId;
          createUserSchema.validate(params);
          logMain('validated', params);

          if (params.mailTemplate !== undefined) {
            userId = Accounts.createUser({
              username: params.username,
              email: params.email,
              password: params.password,
              profile: {
                mailTemplate: params.mailTemplate
              }
            });
          } else {
            userId = Accounts.createUser({
              username: params.username,
              email: params.email,
              password: params.password,
              profile: {}
            });
          }

          return {
            status: 'success',
            data: {
              userid: userId
            }
          };
        } catch (error) {
          return {
            statusCode: 400,
            body: {
              status: 'fail',
              message: error.message
            }
          };
        }
      }
    },
    put: {
      action: function () {
        const qParams = this.queryParams;
        const bParams = this.bodyParams;
        let params = {};
        let uid = this.userId;
        const paramId = this.urlParams.id;
        if (qParams !== undefined) params = (0, _objectSpread2.default)({}, qParams);
        if (bParams !== undefined) params = (0, _objectSpread2.default)({}, params, bParams);

        try {
          //TODO this is not necessary here and can probably go right into the definition of the REST METHOD next to put (!?!)
          if (!Roles.userIsInRole(uid, 'admin')) {
            if (uid !== paramId) {
              throw Error("No Permission");
            }
          }

          updateUserSchema.validate(params);

          if (!Meteor.users.update(this.urlParams.id, {
            $set: {
              "profile.mailTemplate": params.mailTemplate
            }
          })) {
            throw Error("Failed to update user");
          }

          return {
            status: 'success',
            data: {
              userid: this.urlParams.id,
              mailTemplate: params.mailTemplate
            }
          };
        } catch (error) {
          return {
            statusCode: 400,
            body: {
              status: 'fail',
              message: error.message
            }
          };
        }
      }
    }
  }
};
Api.addCollection(Meteor.users, collectionOptions);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"verify.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// server/api/rest/imports/verify.js                                                                                  //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

let Api;
module.link("../rest.js", {
  Api(v) {
    Api = v;
  }

}, 0);
let verifyOptIn;
module.link("../../../../imports/modules/server/opt-ins/verify.js", {
  default(v) {
    verifyOptIn = v;
  }

}, 1);
Api.addRoute('opt-in/verify', {
  authRequired: true
}, {
  get: {
    authRequired: false,
    action: function () {
      const qParams = this.queryParams;
      const bParams = this.bodyParams;
      let params = {};
      if (qParams !== undefined) params = (0, _objectSpread2.default)({}, qParams);
      if (bParams !== undefined) params = (0, _objectSpread2.default)({}, params, bParams);

      try {
        const val = verifyOptIn(params);
        return {
          status: "success",
          data: {
            val
          }
        };
      } catch (error) {
        return {
          statusCode: 500,
          body: {
            status: 'fail',
            message: error.message
          }
        };
      }
    }
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"rest.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// server/api/rest/rest.js                                                                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  DOI_CONFIRMATION_ROUTE: () => DOI_CONFIRMATION_ROUTE,
  DOI_CONFIRMATION_NOTIFY_ROUTE: () => DOI_CONFIRMATION_NOTIFY_ROUTE,
  DOI_WALLETNOTIFY_ROUTE: () => DOI_WALLETNOTIFY_ROUTE,
  DOI_FETCH_ROUTE: () => DOI_FETCH_ROUTE,
  DOI_EXPORT_ROUTE: () => DOI_EXPORT_ROUTE,
  USERS_COLLECTION_ROUTE: () => USERS_COLLECTION_ROUTE,
  API_PATH: () => API_PATH,
  VERSION: () => VERSION,
  Api: () => Api
});
let Restivus;
module.link("meteor/nimble:restivus", {
  Restivus(v) {
    Restivus = v;
  }

}, 0);
let isDebug;
module.link("../../../imports/startup/server/dapp-configuration.js", {
  isDebug(v) {
    isDebug = v;
  }

}, 1);
let SEND_APP, CONFIRM_APP, VERIFY_APP, isAppType;
module.link("../../../imports/startup/server/type-configuration.js", {
  SEND_APP(v) {
    SEND_APP = v;
  },

  CONFIRM_APP(v) {
    CONFIRM_APP = v;
  },

  VERIFY_APP(v) {
    VERIFY_APP = v;
  },

  isAppType(v) {
    isAppType = v;
  }

}, 2);
const DOI_CONFIRMATION_ROUTE = "opt-in/confirm";
const DOI_CONFIRMATION_NOTIFY_ROUTE = "opt-in";
const DOI_WALLETNOTIFY_ROUTE = "walletnotify";
const DOI_FETCH_ROUTE = "doi-mail";
const DOI_EXPORT_ROUTE = "export";
const USERS_COLLECTION_ROUTE = "users";
const API_PATH = "api/";
const VERSION = "v1";
const Api = new Restivus({
  apiPath: API_PATH,
  version: VERSION,
  useDefaultAuth: true,
  prettyJson: true
});
if (isDebug()) require('./imports/debug.js');
if (isAppType(SEND_APP)) require('./imports/send.js');
if (isAppType(CONFIRM_APP)) require('./imports/confirm.js');
if (isAppType(VERIFY_APP)) require('./imports/verify.js');

require('./imports/user.js');
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"blockchain_jobs.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// server/api/blockchain_jobs.js                                                                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  BlockchainJobs: () => BlockchainJobs
});
let JobCollection, Job;
module.link("meteor/vsivsi:job-collection", {
  JobCollection(v) {
    JobCollection = v;
  },

  Job(v) {
    Job = v;
  }

}, 0);
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 1);
let insert;
module.link("../../imports/modules/server/doichain/insert.js", {
  default(v) {
    insert = v;
  }

}, 2);
let update;
module.link("../../imports/modules/server/doichain/update.js", {
  default(v) {
    update = v;
  }

}, 3);
let checkNewTransaction;
module.link("../../imports/modules/server/doichain/check_new_transactions.js", {
  default(v) {
    checkNewTransaction = v;
  }

}, 4);
let CONFIRM_APP, isAppType;
module.link("../../imports/startup/server/type-configuration.js", {
  CONFIRM_APP(v) {
    CONFIRM_APP = v;
  },

  isAppType(v) {
    isAppType = v;
  }

}, 5);
let logMain;
module.link("../../imports/startup/server/log-configuration", {
  logMain(v) {
    logMain = v;
  }

}, 6);
const BlockchainJobs = JobCollection('blockchain');
BlockchainJobs.processJobs('insert', {
  workTimeout: 30 * 1000
}, function (job, cb) {
  try {
    const entry = job.data;
    insert(entry);
    job.done();
  } catch (exception) {
    job.fail();
    throw new Meteor.Error('jobs.blockchain.insert.exception', exception);
  } finally {
    cb();
  }
});
BlockchainJobs.processJobs('update', {
  workTimeout: 30 * 1000
}, function (job, cb) {
  try {
    const entry = job.data;
    update(entry, job);
  } catch (exception) {
    job.fail();
    throw new Meteor.Error('jobs.blockchain.update.exception', exception);
  } finally {
    cb();
  }
});
BlockchainJobs.processJobs('checkNewTransaction', {
  workTimeout: 30 * 1000
}, function (job, cb) {
  try {
    if (!isAppType(CONFIRM_APP)) {
      job.pause();
      job.cancel();
      job.remove();
    } else {//checkNewTransaction(null,job);
    }
  } catch (exception) {
    job.fail();
    throw new Meteor.Error('jobs.blockchain.checkNewTransactions.exception', exception);
  } finally {
    cb();
  }
});
new Job(BlockchainJobs, 'cleanup', {}).repeat({
  schedule: BlockchainJobs.later.parse.text("every 5 minutes")
}).save({
  cancelRepeats: true
});
let q = BlockchainJobs.processJobs('cleanup', {
  pollInterval: false,
  workTimeout: 60 * 1000
}, function (job, cb) {
  const current = new Date();
  current.setMinutes(current.getMinutes() - 5);
  const ids = BlockchainJobs.find({
    status: {
      $in: Job.jobStatusRemovable
    },
    updated: {
      $lt: current
    }
  }, {
    fields: {
      _id: 1
    }
  });
  logMain('found  removable blockchain jobs:', ids);
  BlockchainJobs.removeJobs(ids);

  if (ids.length > 0) {
    job.done("Removed #{ids.length} old jobs");
  }

  cb();
});
BlockchainJobs.find({
  type: 'jobType',
  status: 'ready'
}).observe({
  added: function () {
    q.trigger();
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"dapp_jobs.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// server/api/dapp_jobs.js                                                                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  DAppJobs: () => DAppJobs
});
let JobCollection, Job;
module.link("meteor/vsivsi:job-collection", {
  JobCollection(v) {
    JobCollection = v;
  },

  Job(v) {
    Job = v;
  }

}, 0);
let fetchDoiMailData;
module.link("../../imports/modules/server/dapps/fetch_doi-mail-data.js", {
  default(v) {
    fetchDoiMailData = v;
  }

}, 1);
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 2);
let logMain;
module.link("../../imports/startup/server/log-configuration", {
  logMain(v) {
    logMain = v;
  }

}, 3);
let BlockchainJobs;
module.link("./blockchain_jobs", {
  BlockchainJobs(v) {
    BlockchainJobs = v;
  }

}, 4);
const DAppJobs = JobCollection('dapp');
DAppJobs.processJobs('fetchDoiMailData', function (job, cb) {
  try {
    const data = job.data;
    fetchDoiMailData(data);
    job.done();
  } catch (exception) {
    job.fail();
    throw new Meteor.Error('jobs.dapp.fetchDoiMailData.exception', exception);
  } finally {
    cb();
  }
});
new Job(DAppJobs, 'cleanup', {}).repeat({
  schedule: DAppJobs.later.parse.text("every 5 minutes")
}).save({
  cancelRepeats: true
});
let q = DAppJobs.processJobs('cleanup', {
  pollInterval: false,
  workTimeout: 60 * 1000
}, function (job, cb) {
  const current = new Date();
  current.setMinutes(current.getMinutes() - 5);
  const ids = DAppJobs.find({
    status: {
      $in: Job.jobStatusRemovable
    },
    updated: {
      $lt: current
    }
  }, {
    fields: {
      _id: 1
    }
  });
  logMain('found  removable blockchain jobs:', ids);
  DAppJobs.removeJobs(ids);

  if (ids.length > 0) {
    job.done("Removed #{ids.length} old jobs");
  }

  cb();
});
DAppJobs.find({
  type: 'jobType',
  status: 'ready'
}).observe({
  added: function () {
    q.trigger();
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"dns.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// server/api/dns.js                                                                                                  //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  resolveTxt: () => resolveTxt
});
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let dns;
module.link("dns", {
  default(v) {
    dns = v;
  }

}, 1);
let logSend;
module.link("../../imports/startup/server/log-configuration", {
  logSend(v) {
    logSend = v;
  }

}, 2);

function resolveTxt(key, domain) {
  const syncFunc = Meteor.wrapAsync(dns_resolveTxt);

  try {
    const records = syncFunc(key, domain);
    if (records === undefined) return undefined;
    let value = undefined;
    records.forEach(record => {
      if (record[0].startsWith(key)) {
        const val = record[0].substring(key.length + 1);
        value = val.trim();
      }
    });
    return value;
  } catch (error) {
    if (error.message.startsWith("queryTxt ENODATA") || error.message.startsWith("queryTxt ENOTFOUND")) return undefined;else throw error;
  }
}

function dns_resolveTxt(key, domain, callback) {
  logSend("resolving dns txt attribute: ", {
    key: key,
    domain: domain
  });
  dns.resolveTxt(domain, (err, records) => {
    callback(err, records);
  });
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"doichain.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// server/api/doichain.js                                                                                             //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  getWif: () => getWif,
  getAddressesByAccount: () => getAddressesByAccount,
  getNewAddress: () => getNewAddress,
  signMessage: () => signMessage,
  nameShow: () => nameShow,
  feeDoi: () => feeDoi,
  nameDoi: () => nameDoi,
  listSinceBlock: () => listSinceBlock,
  getTransaction: () => getTransaction,
  getRawTransaction: () => getRawTransaction,
  getBalance: () => getBalance
});
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let logBlockchain, logConfirm, logError;
module.link("../../imports/startup/server/log-configuration", {
  logBlockchain(v) {
    logBlockchain = v;
  },

  logConfirm(v) {
    logConfirm = v;
  },

  logError(v) {
    logError = v;
  }

}, 1);
const NAMESPACE = 'e/';

function getWif(client, address) {
  if (!address) {
    address = getAddressesByAccount("")[0];
    logBlockchain('address was not defined so getting the first existing one of the wallet:', address);
  }

  if (!address) {
    address = getNewAddress("");
    logBlockchain('address was never defined  at all generated new address for this wallet:', address);
  }

  const syncFunc = Meteor.wrapAsync(doichain_dumpprivkey);
  return syncFunc(client, address);
}

function doichain_dumpprivkey(client, address, callback) {
  const ourAddress = address;
  client.cmd('dumpprivkey', ourAddress, function (err, data) {
    if (err) logError('doichain_dumpprivkey:', err);
    callback(err, data);
  });
}

function getAddressesByAccount(client, accout) {
  const syncFunc = Meteor.wrapAsync(doichain_getaddressesbyaccount);
  return syncFunc(client, accout);
}

function doichain_getaddressesbyaccount(client, account, callback) {
  const ourAccount = account;
  client.cmd('getaddressesbyaccount', ourAccount, function (err, data) {
    if (err) logError('getaddressesbyaccount:', err);
    callback(err, data);
  });
}

function getNewAddress(client, accout) {
  const syncFunc = Meteor.wrapAsync(doichain_getnewaddress);
  return syncFunc(client, accout);
}

function doichain_getnewaddress(client, account, callback) {
  const ourAccount = account;
  client.cmd('getnewaddresss', ourAccount, function (err, data) {
    if (err) logError('getnewaddresss:', err);
    callback(err, data);
  });
}

function signMessage(client, address, message) {
  const syncFunc = Meteor.wrapAsync(doichain_signMessage);
  return syncFunc(client, address, message);
}

function doichain_signMessage(client, address, message, callback) {
  const ourAddress = address;
  const ourMessage = message;
  client.cmd('signmessage', ourAddress, ourMessage, function (err, data) {
    callback(err, data);
  });
}

function nameShow(client, id) {
  const syncFunc = Meteor.wrapAsync(doichain_nameShow);
  return syncFunc(client, id);
}

function doichain_nameShow(client, id, callback) {
  const ourId = checkId(id);
  logConfirm('doichain-cli name_show :', ourId);
  client.cmd('name_show', ourId, function (err, data) {
    if (err !== undefined && err !== null && err.message.startsWith("name not found")) {
      err = undefined, data = undefined;
    }

    callback(err, data);
  });
}

function feeDoi(client, address) {
  const syncFunc = Meteor.wrapAsync(doichain_feeDoi);
  return syncFunc(client, address);
}

function doichain_feeDoi(client, address, callback) {
  const destAddress = address;
  client.cmd('sendtoaddress', destAddress, '0.02', function (err, data) {
    callback(err, data);
  });
}

function nameDoi(client, name, value, address) {
  const syncFunc = Meteor.wrapAsync(doichain_nameDoi);
  return syncFunc(client, name, value, address);
}

function doichain_nameDoi(client, name, value, address, callback) {
  const ourName = checkId(name);
  const ourValue = value;
  const destAddress = address;

  if (!address) {
    client.cmd('name_doi', ourName, ourValue, function (err, data) {
      callback(err, data);
    });
  } else {
    client.cmd('name_doi', ourName, ourValue, destAddress, function (err, data) {
      callback(err, data);
    });
  }
}

function listSinceBlock(client, block) {
  const syncFunc = Meteor.wrapAsync(doichain_listSinceBlock);
  var ourBlock = block;
  if (ourBlock === undefined) ourBlock = null;
  return syncFunc(client, ourBlock);
}

function doichain_listSinceBlock(client, block, callback) {
  var ourBlock = block;
  if (ourBlock === null) client.cmd('listsinceblock', function (err, data) {
    callback(err, data);
  });else client.cmd('listsinceblock', ourBlock, function (err, data) {
    callback(err, data);
  });
}

function getTransaction(client, txid) {
  const syncFunc = Meteor.wrapAsync(doichain_gettransaction);
  return syncFunc(client, txid);
}

function doichain_gettransaction(client, txid, callback) {
  logConfirm('doichain_gettransaction:', txid);
  client.cmd('gettransaction', txid, function (err, data) {
    if (err) logError('doichain_gettransaction:', err);
    callback(err, data);
  });
}

function getRawTransaction(client, txid) {
  const syncFunc = Meteor.wrapAsync(doichain_getrawtransaction);
  return syncFunc(client, txid);
}

function doichain_getrawtransaction(client, txid, callback) {
  logBlockchain('doichain_getrawtransaction:', txid);
  client.cmd('getrawtransaction', txid, 1, function (err, data) {
    if (err) logError('doichain_getrawtransaction:', err);
    callback(err, data);
  });
}

function getBalance(client) {
  const syncFunc = Meteor.wrapAsync(doichain_getbalance);
  return syncFunc(client);
}

function doichain_getbalance(client, callback) {
  client.cmd('getbalance', function (err, data) {
    if (err) {
      logError('doichain_getbalance:', err);
    }

    callback(err, data);
  });
}

function checkId(id) {
  const DOI_PREFIX = "doi: ";
  let ret_val = id; //default value

  if (id.startsWith(DOI_PREFIX)) ret_val = id.substring(DOI_PREFIX.length); //in case it starts with doi: cut  this away

  if (!id.startsWith(NAMESPACE)) ret_val = NAMESPACE + id; //in case it doesn't start with e/ put it in front now.

  return ret_val;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"http.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// server/api/http.js                                                                                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  getHttpGET: () => getHttpGET,
  getHttpGETdata: () => getHttpGETdata,
  getHttpPOST: () => getHttpPOST,
  getHttpPUT: () => getHttpPUT
});
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let HTTP;
module.link("meteor/http", {
  HTTP(v) {
    HTTP = v;
  }

}, 1);

function getHttpGET(url, query) {
  const syncFunc = Meteor.wrapAsync(_get);
  return syncFunc(url, query);
}

function getHttpGETdata(url, data) {
  const syncFunc = Meteor.wrapAsync(_getData);
  return syncFunc(url, data);
}

function getHttpPOST(url, data) {
  const syncFunc = Meteor.wrapAsync(_post);
  return syncFunc(url, data);
}

function getHttpPUT(url, data) {
  const syncFunc = Meteor.wrapAsync(_put);
  return syncFunc(url, data);
}

function _get(url, query, callback) {
  const ourUrl = url;
  const ourQuery = query;
  HTTP.get(ourUrl, {
    query: ourQuery
  }, function (err, ret) {
    callback(err, ret);
  });
}

function _getData(url, data, callback) {
  const ourUrl = url;
  const ourData = data;
  HTTP.get(ourUrl, ourData, function (err, ret) {
    callback(err, ret);
  });
}

function _post(url, data, callback) {
  const ourUrl = url;
  const ourData = data;
  HTTP.post(ourUrl, ourData, function (err, ret) {
    callback(err, ret);
  });
}

function _put(url, updateData, callback) {
  const ourUrl = url;
  const ourData = {
    data: updateData
  };
  HTTP.put(ourUrl, ourData, function (err, ret) {
    callback(err, ret);
  });
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"index.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// server/api/index.js                                                                                                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.link("./mail_jobs.js");
module.link("./doichain.js");
module.link("./blockchain_jobs.js");
module.link("./dapp_jobs.js");
module.link("./dns.js");
module.link("./rest/rest.js");
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"mail_jobs.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// server/api/mail_jobs.js                                                                                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  MailJobs: () => MailJobs
});
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let JobCollection, Job;
module.link("meteor/vsivsi:job-collection", {
  JobCollection(v) {
    JobCollection = v;
  },

  Job(v) {
    Job = v;
  }

}, 1);
let sendMail;
module.link("../../imports/modules/server/emails/send.js", {
  default(v) {
    sendMail = v;
  }

}, 2);
let logMain;
module.link("../../imports/startup/server/log-configuration", {
  logMain(v) {
    logMain = v;
  }

}, 3);
let BlockchainJobs;
module.link("./blockchain_jobs", {
  BlockchainJobs(v) {
    BlockchainJobs = v;
  }

}, 4);
const MailJobs = JobCollection('emails');
MailJobs.processJobs('send', function (job, cb) {
  try {
    const email = job.data;
    sendMail(email);
    job.done();
  } catch (exception) {
    job.fail();
    throw new Meteor.Error('jobs.mail.send.exception', exception);
  } finally {
    cb();
  }
});
new Job(MailJobs, 'cleanup', {}).repeat({
  schedule: MailJobs.later.parse.text("every 5 minutes")
}).save({
  cancelRepeats: true
});
let q = MailJobs.processJobs('cleanup', {
  pollInterval: false,
  workTimeout: 60 * 1000
}, function (job, cb) {
  const current = new Date();
  current.setMinutes(current.getMinutes() - 5);
  const ids = MailJobs.find({
    status: {
      $in: Job.jobStatusRemovable
    },
    updated: {
      $lt: current
    }
  }, {
    fields: {
      _id: 1
    }
  });
  logMain('found  removable blockchain jobs:', ids);
  MailJobs.removeJobs(ids);

  if (ids.length > 0) {
    job.done("Removed #{ids.length} old jobs");
  }

  cb();
});
MailJobs.find({
  type: 'jobType',
  status: 'ready'
}).observe({
  added: function () {
    q.trigger();
  }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"main.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// server/main.js                                                                                                     //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.link("/imports/startup/server");
module.link("./api/index.js");
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"i18n":{"de.i18n.json.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// i18n/de.i18n.json.js                                                                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
Package['universe:i18n'].i18n.addTranslations('de','',{"components":{"userMenu":{"logout":"Ausloggen","login":"Einloggen","join":"Beitreten","change":"Passwort ändern","entries":{"home":{"name":"Startseite"},"key-generator":{"name":"Key Generator"},"balance":{"name":"Guthaben"},"recipients":{"name":"Empfänger"},"opt-ins":{"name":"Opt-Ins"}}},"keyGenerator":{"privateKey":"Privater Schlüssel","publicKey":"Öffentlicher Schlüssel","generateButton":"Generieren"},"balance":{},"connectionNotification":{"tryingToConnect":"Versuche zu verbinden","connectionIssue":"Es scheint ein Verbindungsproblem zu geben"},"mobileMenu":{"showMenu":"Zeige Menü"}},"pages":{"startPage":{"title":"doichain","infoText":"Doichain - die Blockchain basierte Anti-Email-Spam Lösung","joinNow":"Jetzt anmelden!"},"keyGeneratorPage":{"title":"Key Generator"},"balancePage":{"title":"Guthaben"},"recipientsPage":{"title":"Empfänger","noRecipients":"Keine Empfänger hier","loading":"Lade Empfänger...","id":"ID","email":"Email","publicKey":"Public Key","createdAt":"Erstellt am"},"optInsPage":{"title":"Opt-Ins","noOptIns":"Keine Opt-Ins hier","loading":"Lade Opt-Ins...","id":"ID","recipient":"Empfänger","sender":"Versender","data":"Daten","nameId":"NameId","createdAt":"Erstellt am","confirmedAt":"Bestätigt am","confirmedBy":"Bestätigt von","error":"Fehler"},"authPageSignIn":{"emailRequired":"Email benötigt","passwordRequired":"Passwort benötigt","signIn":"Einloggen.","signInReason":"Einloggen erlaubt dir opt-ins hinzuzufügen","yourEmail":"Deine Email","password":"Passwort","signInButton":"Einloggen","needAccount":"Keinen Account? Jetzt beitreten."},"notFoundPage":{"pageNotFound":"Seite nicht gefunden"}},"api":{"opt-ins":{"add":{"accessDenied":"Keine Berechtigung um Opt-Ins hinzuzufügen"}}}});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"en.i18n.json.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// i18n/en.i18n.json.js                                                                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
Package['universe:i18n'].i18n.addTranslations('en','',{"components":{"userMenu":{"logout":"Logout","login":"Login","join":"Sign-up","change":"Change password","entries":{"home":{"name":"Home"},"key-generator":{"name":"Key Generator"},"balance":{"name":"Balance"},"recipients":{"name":"Recipients"},"opt-ins":{"name":"Opt-Ins"}}},"keyGenerator":{"privateKey":"Private key","publicKey":"Public key","generateButton":"Generate"},"balance":{},"connectionNotification":{"tryingToConnect":"Trying to connect","connectionIssue":"There seems to be a connection issue"},"mobileMenu":{"showMenu":"Show Menu"}},"pages":{"startPage":{"title":"doichain","infoText":"This is Doichain - A blockchain based email anti-spam","joinNow":"Join now!"},"keyGeneratorPage":{"title":"Key Generator"},"balancePage":{"title":"Balance"},"recipientsPage":{"title":"Recipients","noRecipients":"No recipients here","loading":"Loading recipients...","id":"ID","email":"Email","publicKey":"Public Key","createdAt":"Created At"},"optInsPage":{"title":"Opt-Ins","noOptIns":"No opt-ins here","loading":"Loading opt-ins...","id":"ID","recipient":"Recipient","sender":"Sender","data":"Data","nameId":"NameId","createdAt":"Created At","confirmedAt":"Confirmed At","confirmedBy":"Confirmed By","error":"Error"},"authPageSignIn":{"emailRequired":"Email required","passwordRequired":"Password required","signIn":"Sign In.","signInReason":"Signing in allows you to add opt-ins","yourEmail":"Your Email","password":"Password","signInButton":"Sign in","needAccount":"Need an account? Join Now."},"notFoundPage":{"pageNotFound":"Page not found"}},"api":{"opt-ins":{"add":{"accessDenied":"Cannot add opt-ins without permissions"}}}});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},{
  "extensions": [
    ".js",
    ".json",
    ".i18n.json"
  ]
});

require("/server/api/rest/rest.js");
require("/server/api/blockchain_jobs.js");
require("/server/api/dapp_jobs.js");
require("/server/api/dns.js");
require("/server/api/doichain.js");
require("/server/api/http.js");
require("/server/api/index.js");
require("/server/api/mail_jobs.js");
require("/i18n/de.i18n.json.js");
require("/i18n/en.i18n.json.js");
require("/server/main.js");
//# sourceURL=meteor://💻app/app/app.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9hcGkvb3B0LWlucy9zZXJ2ZXIvcHVibGljYXRpb25zLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL2FwaS9vcHQtaW5zL21ldGhvZHMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvYXBpL29wdC1pbnMvb3B0LWlucy5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9hcGkvcmVjaXBpZW50cy9zZXJ2ZXIvcHVibGljYXRpb25zLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL2FwaS9yZWNpcGllbnRzL3JlY2lwaWVudHMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvYXBpL2RvaWNoYWluL2VudHJpZXMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvYXBpL2RvaWNoYWluL21ldGhvZHMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvYXBpL2xhbmd1YWdlcy9tZXRob2RzLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL2FwaS9tZXRhL21ldGEuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvYXBpL3NlbmRlcnMvc2VuZGVycy5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9kYXBwcy9leHBvcnRfZG9pcy5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9kYXBwcy9mZXRjaF9kb2ktbWFpbC1kYXRhLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2RhcHBzL2dldF9kb2ktbWFpbC1kYXRhLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2Rucy9nZXRfb3B0LWluLWtleS5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9kbnMvZ2V0X29wdC1pbi1wcm92aWRlci5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9kb2ljaGFpbi9hZGRfZW50cnlfYW5kX2ZldGNoX2RhdGEuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvZG9pY2hhaW4vY2hlY2tfbmV3X3RyYW5zYWN0aW9ucy5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9kb2ljaGFpbi9kZWNyeXB0X21lc3NhZ2UuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvZG9pY2hhaW4vZW5jcnlwdF9tZXNzYWdlLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2RvaWNoYWluL2dlbmVyYXRlX25hbWUtaWQuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvZG9pY2hhaW4vZ2V0X2FkZHJlc3MuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvZG9pY2hhaW4vZ2V0X2JhbGFuY2UuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvZG9pY2hhaW4vZ2V0X2RhdGEtaGFzaC5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9kb2ljaGFpbi9nZXRfa2V5LXBhaXIuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvZG9pY2hhaW4vZ2V0X3ByaXZhdGUta2V5X2Zyb21fd2lmLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2RvaWNoYWluL2dldF9wdWJsaWNrZXlfYW5kX2FkZHJlc3NfYnlfZG9tYWluLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2RvaWNoYWluL2dldF9zaWduYXR1cmUuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvZG9pY2hhaW4vaW5zZXJ0LmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2RvaWNoYWluL3VwZGF0ZS5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9kb2ljaGFpbi92ZXJpZnlfc2lnbmF0dXJlLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2RvaWNoYWluL3dyaXRlX3RvX2Jsb2NrY2hhaW4uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvZW1haWxzL2RlY29kZV9kb2ktaGFzaC5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9lbWFpbHMvZ2VuZXJhdGVfZG9pLWhhc2guanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvZW1haWxzL3BhcnNlX3RlbXBsYXRlLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2VtYWlscy9zZW5kLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2pvYnMvYWRkX2NoZWNrX25ld190cmFuc2FjdGlvbnMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvam9icy9hZGRfZmV0Y2gtZG9pLW1haWwtZGF0YS5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9qb2JzL2FkZF9pbnNlcnRfYmxvY2tjaGFpbi5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9qb2JzL2FkZF9zZW5kX21haWwuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvam9icy9hZGRfdXBkYXRlX2Jsb2NrY2hhaW4uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvbGFuZ3VhZ2VzL2dldC5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9tZXRhL2FkZE9yVXBkYXRlLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL21vZHVsZXMvc2VydmVyL29wdC1pbnMvYWRkLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL21vZHVsZXMvc2VydmVyL29wdC1pbnMvYWRkX2FuZF93cml0ZV90b19ibG9ja2NoYWluLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL21vZHVsZXMvc2VydmVyL29wdC1pbnMvY29uZmlybS5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9vcHQtaW5zL2dlbmVyYXRlX2RvaS10b2tlbi5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9vcHQtaW5zL3VwZGF0ZV9zdGF0dXMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvb3B0LWlucy92ZXJpZnkuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvcmVjaXBpZW50cy9hZGQuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvc2VuZGVycy9hZGQuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvc3RhcnR1cC9zZXJ2ZXIvZGFwcC1jb25maWd1cmF0aW9uLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL3N0YXJ0dXAvc2VydmVyL2Rucy1jb25maWd1cmF0aW9uLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL3N0YXJ0dXAvc2VydmVyL2RvaWNoYWluLWNvbmZpZ3VyYXRpb24uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvc3RhcnR1cC9zZXJ2ZXIvZW1haWwtY29uZmlndXJhdGlvbi5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9zdGFydHVwL3NlcnZlci9maXh0dXJlcy5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9zdGFydHVwL3NlcnZlci9pbmRleC5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9zdGFydHVwL3NlcnZlci9qb2JzLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL3N0YXJ0dXAvc2VydmVyL2xvZy1jb25maWd1cmF0aW9uLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL3N0YXJ0dXAvc2VydmVyL3JlZ2lzdGVyLWFwaS5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9zdGFydHVwL3NlcnZlci9zZWN1cml0eS5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9zdGFydHVwL3NlcnZlci90eXBlLWNvbmZpZ3VyYXRpb24uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvc3RhcnR1cC9zZXJ2ZXIvdXNlcmFjY291bnRzLWNvbmZpZ3VyYXRpb24uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9hcGkvcmVzdC9pbXBvcnRzL2NvbmZpcm0uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9hcGkvcmVzdC9pbXBvcnRzL2RlYnVnLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvYXBpL3Jlc3QvaW1wb3J0cy9zZW5kLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvYXBpL3Jlc3QvaW1wb3J0cy91c2VyLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvYXBpL3Jlc3QvaW1wb3J0cy92ZXJpZnkuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9hcGkvcmVzdC9yZXN0LmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvYXBpL2Jsb2NrY2hhaW5fam9icy5qcyIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL2FwaS9kYXBwX2pvYnMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9hcGkvZG5zLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvYXBpL2RvaWNoYWluLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvYXBpL2h0dHAuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9hcGkvaW5kZXguanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9hcGkvbWFpbF9qb2JzLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWFpbi5qcyJdLCJuYW1lcyI6WyJNZXRlb3IiLCJtb2R1bGUiLCJsaW5rIiwidiIsIlJvbGVzIiwiT3B0SW5zIiwicHVibGlzaCIsIk9wdEluc0FsbCIsInVzZXJJZCIsInJlYWR5IiwidXNlcklzSW5Sb2xlIiwiZmluZCIsIm93bmVySWQiLCJmaWVsZHMiLCJwdWJsaWNGaWVsZHMiLCJERFBSYXRlTGltaXRlciIsImkxOG4iLCJfaTE4biIsIlZhbGlkYXRlZE1ldGhvZCIsIl8iLCJhZGRPcHRJbiIsImRlZmF1bHQiLCJhZGQiLCJuYW1lIiwidmFsaWRhdGUiLCJydW4iLCJyZWNpcGllbnRNYWlsIiwic2VuZGVyTWFpbCIsImRhdGEiLCJlcnJvciIsIkVycm9yIiwiX18iLCJvcHRJbiIsIk9QVElPTlNfTUVUSE9EUyIsInBsdWNrIiwiaXNTZXJ2ZXIiLCJhZGRSdWxlIiwiY29udGFpbnMiLCJjb25uZWN0aW9uSWQiLCJleHBvcnQiLCJNb25nbyIsIlNpbXBsZVNjaGVtYSIsIk9wdEluc0NvbGxlY3Rpb24iLCJDb2xsZWN0aW9uIiwiaW5zZXJ0IiwiY2FsbGJhY2siLCJvdXJPcHRJbiIsInJlY2lwaWVudF9zZW5kZXIiLCJyZWNpcGllbnQiLCJzZW5kZXIiLCJjcmVhdGVkQXQiLCJEYXRlIiwicmVzdWx0IiwidXBkYXRlIiwic2VsZWN0b3IiLCJtb2RpZmllciIsInJlbW92ZSIsImRlbnkiLCJzY2hlbWEiLCJfaWQiLCJ0eXBlIiwiU3RyaW5nIiwicmVnRXgiLCJSZWdFeCIsIklkIiwib3B0aW9uYWwiLCJkZW55VXBkYXRlIiwiaW5kZXgiLCJJbnRlZ2VyIiwibmFtZUlkIiwidHhJZCIsIm1hc3RlckRvaSIsImNvbmZpcm1lZEF0IiwiY29uZmlybWVkQnkiLCJJUCIsImNvbmZpcm1hdGlvblRva2VuIiwiYXR0YWNoU2NoZW1hIiwiUmVjaXBpZW50cyIsInJlY2lwaWVudHNBbGwiLCJSZWNpcGllbnRzQ29sbGVjdGlvbiIsIm91clJlY2lwaWVudCIsImVtYWlsIiwicHJpdmF0ZUtleSIsInVuaXF1ZSIsInB1YmxpY0tleSIsIkRvaWNoYWluRW50cmllcyIsIkRvaWNoYWluRW50cmllc0NvbGxlY3Rpb24iLCJlbnRyeSIsInZhbHVlIiwiYWRkcmVzcyIsImdldEtleVBhaXJNIiwiZ2V0QmFsYW5jZU0iLCJnZXRLZXlQYWlyIiwiZ2V0QmFsYW5jZSIsImxvZ1ZhbCIsIk9QVElOU19NRVRIT0RTIiwiZ2V0TGFuZ3VhZ2VzIiwiZ2V0QWxsTGFuZ3VhZ2VzIiwiTWV0YSIsIk1ldGFDb2xsZWN0aW9uIiwib3VyRGF0YSIsImtleSIsIlNlbmRlcnMiLCJTZW5kZXJzQ29sbGVjdGlvbiIsIm91clNlbmRlciIsIkRPSV9NQUlMX0ZFVENIX1VSTCIsImxvZ1NlbmQiLCJFeHBvcnREb2lzRGF0YVNjaGVtYSIsInN0YXR1cyIsInJvbGUiLCJ1c2VyaWQiLCJpZCIsImV4cG9ydERvaXMiLCJwaXBlbGluZSIsIiRtYXRjaCIsIiRleGlzdHMiLCIkbmUiLCJ1bmRlZmluZWQiLCJwdXNoIiwiJHJlZGFjdCIsIiRjb25kIiwiaWYiLCIkY21wIiwidGhlbiIsImVsc2UiLCJjb25jYXQiLCIkbG9va3VwIiwiZnJvbSIsImxvY2FsRmllbGQiLCJmb3JlaWduRmllbGQiLCJhcyIsIiR1bndpbmQiLCIkcHJvamVjdCIsIm9wdElucyIsImFnZ3JlZ2F0ZSIsImV4cG9ydERvaURhdGEiLCJKU09OIiwic3RyaW5naWZ5IiwiZXhjZXB0aW9uIiwiZXhwb3J0RGVmYXVsdCIsIkRPSV9GRVRDSF9ST1VURSIsIkRPSV9DT05GSVJNQVRJT05fUk9VVEUiLCJBUElfUEFUSCIsIlZFUlNJT04iLCJnZXRVcmwiLCJDT05GSVJNX0NMSUVOVCIsIkNPTkZJUk1fQUREUkVTUyIsImdldEh0dHBHRVQiLCJzaWduTWVzc2FnZSIsInBhcnNlVGVtcGxhdGUiLCJnZW5lcmF0ZURvaVRva2VuIiwiZ2VuZXJhdGVEb2lIYXNoIiwiYWRkU2VuZE1haWxKb2IiLCJsb2dDb25maXJtIiwibG9nRXJyb3IiLCJGZXRjaERvaU1haWxEYXRhU2NoZW1hIiwiZG9tYWluIiwiZmV0Y2hEb2lNYWlsRGF0YSIsInVybCIsInNpZ25hdHVyZSIsInF1ZXJ5IiwiZW5jb2RlVVJJQ29tcG9uZW50IiwicmVzcG9uc2UiLCJyZXNwb25zZURhdGEiLCJpbmNsdWRlcyIsIm9wdEluSWQiLCJmaW5kT25lIiwidG9rZW4iLCJjb25maXJtYXRpb25IYXNoIiwicmVkaXJlY3QiLCJjb25maXJtYXRpb25VcmwiLCJ0ZW1wbGF0ZSIsImNvbnRlbnQiLCJjb25maXJtYXRpb25fdXJsIiwidG8iLCJzdWJqZWN0IiwibWVzc2FnZSIsInJldHVyblBhdGgiLCJnZXRPcHRJblByb3ZpZGVyIiwiZ2V0T3B0SW5LZXkiLCJ2ZXJpZnlTaWduYXR1cmUiLCJBY2NvdW50cyIsIkdldERvaU1haWxEYXRhU2NoZW1hIiwibmFtZV9pZCIsInVzZXJQcm9maWxlU2NoZW1hIiwiRW1haWwiLCJ0ZW1wbGF0ZVVSTCIsImdldERvaU1haWxEYXRhIiwicGFydHMiLCJzcGxpdCIsImxlbmd0aCIsInByb3ZpZGVyIiwiZG9pTWFpbERhdGEiLCJkZWZhdWx0UmV0dXJuRGF0YSIsInJldHVybkRhdGEiLCJvd25lciIsInVzZXJzIiwibWFpbFRlbXBsYXRlIiwicHJvZmlsZSIsInJlc29sdmVUeHQiLCJGQUxMQkFDS19QUk9WSURFUiIsImlzUmVndGVzdCIsImlzVGVzdG5ldCIsIk9QVF9JTl9LRVkiLCJPUFRfSU5fS0VZX1RFU1RORVQiLCJHZXRPcHRJbktleVNjaGVtYSIsIm91ck9QVF9JTl9LRVkiLCJmb3VuZEtleSIsImRuc2tleSIsInVzZUZhbGxiYWNrIiwiUFJPVklERVJfS0VZIiwiUFJPVklERVJfS0VZX1RFU1RORVQiLCJHZXRPcHRJblByb3ZpZGVyU2NoZW1hIiwib3VyUFJPVklERVJfS0VZIiwicHJvdmlkZXJLZXkiLCJnZXRXaWYiLCJhZGRGZXRjaERvaU1haWxEYXRhSm9iIiwiZ2V0UHJpdmF0ZUtleUZyb21XaWYiLCJkZWNyeXB0TWVzc2FnZSIsIkFkZERvaWNoYWluRW50cnlTY2hlbWEiLCJhZGREb2ljaGFpbkVudHJ5Iiwib3VyRW50cnkiLCJldHkiLCJwYXJzZSIsIndpZiIsIm5hbWVQb3MiLCJpbmRleE9mIiwic3Vic3RyaW5nIiwiZXhwaXJlc0luIiwiZXhwaXJlZCIsImxpc3RTaW5jZUJsb2NrIiwibmFtZVNob3ciLCJnZXRSYXdUcmFuc2FjdGlvbiIsImFkZE9yVXBkYXRlTWV0YSIsIlRYX05BTUVfU1RBUlQiLCJMQVNUX0NIRUNLRURfQkxPQ0tfS0VZIiwiY2hlY2tOZXdUcmFuc2FjdGlvbiIsInR4aWQiLCJqb2IiLCJsYXN0Q2hlY2tlZEJsb2NrIiwicmV0IiwidHJhbnNhY3Rpb25zIiwidHhzIiwibGFzdGJsb2NrIiwiYWRkcmVzc1R4cyIsImZpbHRlciIsInR4Iiwic3RhcnRzV2l0aCIsImZvckVhY2giLCJ0eE5hbWUiLCJhZGRUeCIsImRvbmUiLCJ2b3V0Iiwic2NyaXB0UHViS2V5IiwibmFtZU9wIiwib3AiLCJhZGRyZXNzZXMiLCJjcnlwdG8iLCJlY2llcyIsIkRlY3J5cHRNZXNzYWdlU2NoZW1hIiwiQnVmZmVyIiwiZWNkaCIsImNyZWF0ZUVDREgiLCJzZXRQcml2YXRlS2V5IiwiZGVjcnlwdCIsInRvU3RyaW5nIiwiRW5jcnlwdE1lc3NhZ2VTY2hlbWEiLCJlbmNyeXB0TWVzc2FnZSIsImVuY3J5cHQiLCJHZW5lcmF0ZU5hbWVJZFNjaGVtYSIsImdlbmVyYXRlTmFtZUlkIiwiJHNldCIsIkNyeXB0b0pTIiwiQmFzZTU4IiwiVkVSU0lPTl9CWVRFIiwiVkVSU0lPTl9CWVRFX1JFR1RFU1QiLCJHZXRBZGRyZXNzU2NoZW1hIiwiZ2V0QWRkcmVzcyIsIl9nZXRBZGRyZXNzIiwicHViS2V5IiwibGliIiwiV29yZEFycmF5IiwiY3JlYXRlIiwiU0hBMjU2IiwiUklQRU1EMTYwIiwidmVyc2lvbkJ5dGUiLCJjaGVja3N1bSIsImVuY29kZSIsImdldF9CYWxhbmNlIiwiYmFsIiwiR2V0RGF0YUhhc2hTY2hlbWEiLCJnZXREYXRhSGFzaCIsImhhc2giLCJyYW5kb21CeXRlcyIsInNlY3AyNTZrMSIsInByaXZLZXkiLCJwcml2YXRlS2V5VmVyaWZ5IiwicHVibGljS2V5Q3JlYXRlIiwidG9VcHBlckNhc2UiLCJHZXRQcml2YXRlS2V5RnJvbVdpZlNjaGVtYSIsIl9nZXRQcml2YXRlS2V5RnJvbVdpZiIsImRlY29kZSIsImVuZHNXaXRoIiwiR2V0UHVibGljS2V5U2NoZW1hIiwiZ2V0UHVibGljS2V5QW5kQWRkcmVzcyIsImRlc3RBZGRyZXNzIiwiYml0Y29yZSIsIk1lc3NhZ2UiLCJHZXRTaWduYXR1cmVTY2hlbWEiLCJnZXRTaWduYXR1cmUiLCJzaWduIiwiUHJpdmF0ZUtleSIsIlNFTkRfQ0xJRU5UIiwibG9nQmxvY2tjaGFpbiIsImZlZURvaSIsIm5hbWVEb2kiLCJJbnNlcnRTY2hlbWEiLCJkYXRhSGFzaCIsInNvaURhdGUiLCJwdWJsaWNLZXlBbmRBZGRyZXNzIiwibmFtZVZhbHVlIiwiZmVlRG9pVHgiLCJuYW1lRG9pVHgiLCJnZXRUcmFuc2FjdGlvbiIsIkRPSV9DT05GSVJNQVRJT05fTk9USUZZX1JPVVRFIiwiZ2V0SHR0cFBVVCIsIlVwZGF0ZVNjaGVtYSIsImhvc3QiLCJmcm9tSG9zdFVybCIsIm5hbWVfZGF0YSIsInJlcnVuIiwib3VyX3RyYW5zYWN0aW9uIiwiY29uZmlybWF0aW9ucyIsIm91cmZyb21Ib3N0VXJsIiwidXBkYXRlRGF0YSIsImNhbmNlbCIsInJlc3RhcnQiLCJlcnIiLCJsb2dWZXJpZnkiLCJORVRXT1JLIiwiTmV0d29ya3MiLCJhbGlhcyIsInB1YmtleWhhc2giLCJwcml2YXRla2V5Iiwic2NyaXB0aGFzaCIsIm5ldHdvcmtNYWdpYyIsIlZlcmlmeVNpZ25hdHVyZVNjaGVtYSIsIkFkZHJlc3MiLCJmcm9tUHVibGljS2V5IiwiUHVibGljS2V5IiwidmVyaWZ5IiwiYWRkSW5zZXJ0QmxvY2tjaGFpbkpvYiIsIldyaXRlVG9CbG9ja2NoYWluU2NoZW1hIiwid3JpdGVUb0Jsb2NrY2hhaW4iLCJIYXNoSWRzIiwiRGVjb2RlRG9pSGFzaFNjaGVtYSIsImRlY29kZURvaUhhc2giLCJvdXJIYXNoIiwiaGV4IiwiZGVjb2RlSGV4Iiwib2JqIiwiR2VuZXJhdGVEb2lIYXNoU2NoZW1hIiwianNvbiIsImVuY29kZUhleCIsIlBMQUNFSE9MREVSX1JFR0VYIiwiUGFyc2VUZW1wbGF0ZVNjaGVtYSIsIk9iamVjdCIsImJsYWNrYm94IiwiX21hdGNoIiwiZXhlYyIsIl9yZXBsYWNlUGxhY2Vob2xkZXIiLCJyZXBsYWNlIiwicmVwIiwiRE9JX01BSUxfREVGQVVMVF9FTUFJTF9GUk9NIiwiU2VuZE1haWxTY2hlbWEiLCJzZW5kTWFpbCIsIm1haWwiLCJvdXJNYWlsIiwic2VuZCIsImh0bWwiLCJoZWFkZXJzIiwiSm9iIiwiQmxvY2tjaGFpbkpvYnMiLCJhZGRDaGVja05ld1RyYW5zYWN0aW9uc0Jsb2NrY2hhaW5Kb2IiLCJyZXRyeSIsInJldHJpZXMiLCJ3YWl0Iiwic2F2ZSIsImNhbmNlbFJlcGVhdHMiLCJEQXBwSm9icyIsIkFkZEZldGNoRG9pTWFpbERhdGFKb2JTY2hlbWEiLCJBZGRJbnNlcnRCbG9ja2NoYWluSm9iU2NoZW1hIiwiTWFpbEpvYnMiLCJBZGRTZW5kTWFpbEpvYlNjaGVtYSIsIkFkZFVwZGF0ZUJsb2NrY2hhaW5Kb2JTY2hlbWEiLCJhZGRVcGRhdGVCbG9ja2NoYWluSm9iIiwiQWRkT3JVcGRhdGVNZXRhU2NoZW1hIiwibWV0YSIsIkFkZE9wdEluU2NoZW1hIiwiZmV0Y2giLCJhZGRSZWNpcGllbnQiLCJhZGRTZW5kZXIiLCJyZWNpcGllbnRfbWFpbCIsInNlbmRlcl9tYWlsIiwibWFzdGVyX2RvaSIsInJlY2lwaWVudElkIiwic2VuZGVySWQiLCJDb25maXJtT3B0SW5TY2hlbWEiLCJjb25maXJtT3B0SW4iLCJyZXF1ZXN0Iiwib3VyUmVxdWVzdCIsImRlY29kZWQiLCIkdW5zZXQiLCJlbnRyaWVzIiwiJG9yIiwiZG9pU2lnbmF0dXJlIiwiZG9pVGltZXN0YW1wIiwidG9JU09TdHJpbmciLCJqc29uVmFsdWUiLCJHZW5lcmF0ZURvaVRva2VuU2NoZW1hIiwiVXBkYXRlT3B0SW5TdGF0dXNTY2hlbWEiLCJ1cGRhdGVPcHRJblN0YXR1cyIsIlZFUklGWV9DTElFTlQiLCJWZXJpZnlPcHRJblNjaGVtYSIsInJlY2lwaWVudF9wdWJsaWNfa2V5IiwidmVyaWZ5T3B0SW4iLCJlbnRyeURhdGEiLCJmaXJzdENoZWNrIiwic2Vjb25kQ2hlY2siLCJBZGRSZWNpcGllbnRTY2hlbWEiLCJyZWNpcGllbnRzIiwia2V5UGFpciIsIkFkZFNlbmRlclNjaGVtYSIsInNlbmRlcnMiLCJpc0RlYnVnIiwic2V0dGluZ3MiLCJhcHAiLCJkZWJ1ZyIsInJlZ3Rlc3QiLCJ0ZXN0bmV0IiwicG9ydCIsImFic29sdXRlVXJsIiwibmFtZWNvaW4iLCJTRU5EX0FQUCIsIkNPTkZJUk1fQVBQIiwiVkVSSUZZX0FQUCIsImlzQXBwVHlwZSIsInNlbmRTZXR0aW5ncyIsInNlbmRDbGllbnQiLCJkb2ljaGFpbiIsImNyZWF0ZUNsaWVudCIsImNvbmZpcm1TZXR0aW5ncyIsImNvbmZpcm0iLCJjb25maXJtQ2xpZW50IiwiY29uZmlybUFkZHJlc3MiLCJ2ZXJpZnlTZXR0aW5ncyIsInZlcmlmeUNsaWVudCIsIkNsaWVudCIsInVzZXIiLCJ1c2VybmFtZSIsInBhc3MiLCJwYXNzd29yZCIsIkhhc2hpZHMiLCJkb2lNYWlsRmV0Y2hVcmwiLCJkZWZhdWx0RnJvbSIsInNtdHAiLCJzdGFydHVwIiwicHJvY2VzcyIsImVudiIsIk1BSUxfVVJMIiwic2VydmVyIiwiTk9ERV9UTFNfUkVKRUNUX1VOQVVUSE9SSVpFRCIsImNvdW50IiwiY3JlYXRlVXNlciIsImFkZFVzZXJzVG9Sb2xlcyIsInN0YXJ0Sm9iU2VydmVyIiwiY29uc29sZSIsInNlbmRNb2RlVGFnQ29sb3IiLCJjb25maXJtTW9kZVRhZ0NvbG9yIiwidmVyaWZ5TW9kZVRhZ0NvbG9yIiwiYmxvY2tjaGFpbk1vZGVUYWdDb2xvciIsInRlc3RpbmdNb2RlVGFnQ29sb3IiLCJsb2dNYWluIiwidGVzdExvZ2dpbmciLCJyZXF1aXJlIiwibXNnIiwiY29sb3JzIiwicGFyYW0iLCJ0aW1lIiwidGFnIiwibG9nIiwiQVVUSF9NRVRIT0RTIiwidHlwZXMiLCJjb25maWciLCJzZW5kVmVyaWZpY2F0aW9uRW1haWwiLCJmb3JiaWRDbGllbnRBY2NvdW50Q3JlYXRpb24iLCJlbWFpbFRlbXBsYXRlcyIsIkFwaSIsIkRPSV9XQUxMRVROT1RJRllfUk9VVEUiLCJhZGRSb3V0ZSIsImF1dGhSZXF1aXJlZCIsImdldCIsImFjdGlvbiIsInVybFBhcmFtcyIsImlwIiwiY29ubmVjdGlvbiIsInJlbW90ZUFkZHJlc3MiLCJzb2NrZXQiLCJzdGF0dXNDb2RlIiwiYm9keSIsInBhcmFtcyIsInF1ZXJ5UGFyYW1zIiwiRE9JX0VYUE9SVF9ST1VURSIsInBvc3QiLCJxUGFyYW1zIiwiYlBhcmFtcyIsImJvZHlQYXJhbXMiLCJ1aWQiLCJjb25zdHJ1Y3RvciIsIkFycmF5IiwicHJlcGFyZUNvRE9JIiwicHJlcGFyZUFkZCIsInB1dCIsInZhbCIsIm93bmVySUQiLCJjdXJyZW50T3B0SW5JZCIsInJldFJlc3BvbnNlIiwicmV0X3Jlc3BvbnNlIiwibWFpbFRlbXBsYXRlU2NoZW1hIiwiY3JlYXRlVXNlclNjaGVtYSIsInVwZGF0ZVVzZXJTY2hlbWEiLCJjb2xsZWN0aW9uT3B0aW9ucyIsInBhdGgiLCJyb3V0ZU9wdGlvbnMiLCJleGNsdWRlZEVuZHBvaW50cyIsImVuZHBvaW50cyIsImRlbGV0ZSIsInJvbGVSZXF1aXJlZCIsInBhcmFtSWQiLCJhZGRDb2xsZWN0aW9uIiwiVVNFUlNfQ09MTEVDVElPTl9ST1VURSIsIlJlc3RpdnVzIiwiYXBpUGF0aCIsInZlcnNpb24iLCJ1c2VEZWZhdWx0QXV0aCIsInByZXR0eUpzb24iLCJKb2JDb2xsZWN0aW9uIiwicHJvY2Vzc0pvYnMiLCJ3b3JrVGltZW91dCIsImNiIiwiZmFpbCIsInBhdXNlIiwicmVwZWF0Iiwic2NoZWR1bGUiLCJsYXRlciIsInRleHQiLCJxIiwicG9sbEludGVydmFsIiwiY3VycmVudCIsInNldE1pbnV0ZXMiLCJnZXRNaW51dGVzIiwiaWRzIiwiJGluIiwiam9iU3RhdHVzUmVtb3ZhYmxlIiwidXBkYXRlZCIsIiRsdCIsInJlbW92ZUpvYnMiLCJvYnNlcnZlIiwiYWRkZWQiLCJ0cmlnZ2VyIiwiZG5zIiwic3luY0Z1bmMiLCJ3cmFwQXN5bmMiLCJkbnNfcmVzb2x2ZVR4dCIsInJlY29yZHMiLCJyZWNvcmQiLCJ0cmltIiwiZ2V0QWRkcmVzc2VzQnlBY2NvdW50IiwiZ2V0TmV3QWRkcmVzcyIsIk5BTUVTUEFDRSIsImNsaWVudCIsImRvaWNoYWluX2R1bXBwcml2a2V5Iiwib3VyQWRkcmVzcyIsImNtZCIsImFjY291dCIsImRvaWNoYWluX2dldGFkZHJlc3Nlc2J5YWNjb3VudCIsImFjY291bnQiLCJvdXJBY2NvdW50IiwiZG9pY2hhaW5fZ2V0bmV3YWRkcmVzcyIsImRvaWNoYWluX3NpZ25NZXNzYWdlIiwib3VyTWVzc2FnZSIsImRvaWNoYWluX25hbWVTaG93Iiwib3VySWQiLCJjaGVja0lkIiwiZG9pY2hhaW5fZmVlRG9pIiwiZG9pY2hhaW5fbmFtZURvaSIsIm91ck5hbWUiLCJvdXJWYWx1ZSIsImJsb2NrIiwiZG9pY2hhaW5fbGlzdFNpbmNlQmxvY2siLCJvdXJCbG9jayIsImRvaWNoYWluX2dldHRyYW5zYWN0aW9uIiwiZG9pY2hhaW5fZ2V0cmF3dHJhbnNhY3Rpb24iLCJkb2ljaGFpbl9nZXRiYWxhbmNlIiwiRE9JX1BSRUZJWCIsInJldF92YWwiLCJnZXRIdHRwR0VUZGF0YSIsImdldEh0dHBQT1NUIiwiSFRUUCIsIl9nZXQiLCJfZ2V0RGF0YSIsIl9wb3N0IiwiX3B1dCIsIm91clVybCIsIm91clF1ZXJ5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLElBQUlB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RSxHQUFyQyxDQUFQO0FBQ0F6SyxVQUFRLENBQUM4SyxVQUFULENBQW9CTCxHQUFwQjs7QUFDQSxNQUFHQSxHQUFHLENBQUNuWCxNQUFKLEdBQWEsQ0FBaEIsRUFBa0I7QUFDZGdELE9BQUcsQ0FBQ2EsSUFBSixDQUFTLGdDQUFUO0FBQ0g7O0FBQ0QwUyxJQUFFO0FBQ0wsQ0FmTyxDQUFSO0FBaUJBN0osUUFBUSxDQUFDN1gsSUFBVCxDQUFjO0FBQUVpRCxNQUFJLEVBQUUsU0FBUjtBQUFtQmdELFFBQU0sRUFBRTtBQUEzQixDQUFkLEVBQ0syYyxPQURMLENBQ2E7QUFDTEMsT0FBSyxFQUFFLFlBQVk7QUFBRVosS0FBQyxDQUFDYSxPQUFGO0FBQWM7QUFEOUIsQ0FEYixFOzs7Ozs7Ozs7OztBQzVDQXhqQixNQUFNLENBQUNDLElBQVAsQ0FBWSx5QkFBWjtBQUF1Q0QsTUFBTSxDQUFDQyxJQUFQLENBQVksZ0JBQVosRSIsImZpbGUiOiIvYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgeyBSb2xlcyB9IGZyb20gJ21ldGVvci9hbGFubmluZzpyb2xlcyc7XG5cbmltcG9ydCB7IE9wdElucyB9IGZyb20gJy4uL29wdC1pbnMuanMnO1xuXG5NZXRlb3IucHVibGlzaCgnb3B0LWlucy5hbGwnLCBmdW5jdGlvbiBPcHRJbnNBbGwoKSB7XG4gIGlmKCF0aGlzLnVzZXJJZCkge1xuICAgIHJldHVybiB0aGlzLnJlYWR5KCk7XG4gIH1cbiAgaWYoIVJvbGVzLnVzZXJJc0luUm9sZSh0aGlzLnVzZXJJZCwgWydhZG1pbiddKSl7XG4gICAgcmV0dXJuIE9wdElucy5maW5kKHtvd25lcklkOnRoaXMudXNlcklkfSwge1xuICAgICAgZmllbGRzOiBPcHRJbnMucHVibGljRmllbGRzLFxuICAgIH0pO1xuICB9XG4gIFxuXG4gIHJldHVybiBPcHRJbnMuZmluZCh7fSwge1xuICAgIGZpZWxkczogT3B0SW5zLnB1YmxpY0ZpZWxkcyxcbiAgfSk7XG59KTtcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IHsgRERQUmF0ZUxpbWl0ZXIgfSBmcm9tICdtZXRlb3IvZGRwLXJhdGUtbGltaXRlcic7XG5pbXBvcnQgeyBfaTE4biBhcyBpMThuIH0gZnJvbSAnbWV0ZW9yL3VuaXZlcnNlOmkxOG4nO1xuaW1wb3J0IHsgVmFsaWRhdGVkTWV0aG9kIH0gZnJvbSAnbWV0ZW9yL21kZzp2YWxpZGF0ZWQtbWV0aG9kJztcbmltcG9ydCB7IFJvbGVzIH0gZnJvbSAnbWV0ZW9yL2FsYW5uaW5nOnJvbGVzJztcbmltcG9ydCB7IF8gfSBmcm9tICdtZXRlb3IvdW5kZXJzY29yZSc7XG5pbXBvcnQgYWRkT3B0SW4gZnJvbSAnLi4vLi4vbW9kdWxlcy9zZXJ2ZXIvb3B0LWlucy9hZGRfYW5kX3dyaXRlX3RvX2Jsb2NrY2hhaW4uanMnO1xuXG5jb25zdCBhZGQgPSBuZXcgVmFsaWRhdGVkTWV0aG9kKHtcbiAgbmFtZTogJ29wdC1pbnMuYWRkJyxcbiAgdmFsaWRhdGU6IG51bGwsXG4gIHJ1bih7IHJlY2lwaWVudE1haWwsIHNlbmRlck1haWwsIGRhdGEgfSkge1xuICAgIGlmKCF0aGlzLnVzZXJJZCB8fCAhUm9sZXMudXNlcklzSW5Sb2xlKHRoaXMudXNlcklkLCBbJ2FkbWluJ10pKSB7XG4gICAgICBjb25zdCBlcnJvciA9IFwiYXBpLm9wdC1pbnMuYWRkLmFjY2Vzc0RlbmllZFwiO1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcihlcnJvciwgaTE4bi5fXyhlcnJvcikpO1xuICAgIH1cblxuICAgIGNvbnN0IG9wdEluID0ge1xuICAgICAgXCJyZWNpcGllbnRfbWFpbFwiOiByZWNpcGllbnRNYWlsLFxuICAgICAgXCJzZW5kZXJfbWFpbFwiOiBzZW5kZXJNYWlsLFxuICAgICAgZGF0YVxuICAgIH1cblxuICAgIGFkZE9wdEluKG9wdEluKVxuICB9LFxufSk7XG5cbi8vIEdldCBsaXN0IG9mIGFsbCBtZXRob2QgbmFtZXMgb24gb3B0LWluc1xuY29uc3QgT1BUSU9OU19NRVRIT0RTID0gXy5wbHVjayhbXG4gIGFkZFxuXSwgJ25hbWUnKTtcblxuaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAvLyBPbmx5IGFsbG93IDUgb3B0LWluIG9wZXJhdGlvbnMgcGVyIGNvbm5lY3Rpb24gcGVyIHNlY29uZFxuICBERFBSYXRlTGltaXRlci5hZGRSdWxlKHtcbiAgICBuYW1lKG5hbWUpIHtcbiAgICAgIHJldHVybiBfLmNvbnRhaW5zKE9QVElPTlNfTUVUSE9EUywgbmFtZSk7XG4gICAgfSxcblxuICAgIC8vIFJhdGUgbGltaXQgcGVyIGNvbm5lY3Rpb24gSURcbiAgICBjb25uZWN0aW9uSWQoKSB7IHJldHVybiB0cnVlOyB9LFxuICB9LCA1LCAxMDAwKTtcbn1cbiIsImltcG9ydCB7IE1vbmdvIH0gZnJvbSAnbWV0ZW9yL21vbmdvJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcblxuY2xhc3MgT3B0SW5zQ29sbGVjdGlvbiBleHRlbmRzIE1vbmdvLkNvbGxlY3Rpb24ge1xuICBpbnNlcnQob3B0SW4sIGNhbGxiYWNrKSB7XG4gICAgY29uc3Qgb3VyT3B0SW4gPSBvcHRJbjtcbiAgICBvdXJPcHRJbi5yZWNpcGllbnRfc2VuZGVyID0gb3VyT3B0SW4ucmVjaXBpZW50K291ck9wdEluLnNlbmRlcjtcbiAgICBvdXJPcHRJbi5jcmVhdGVkQXQgPSBvdXJPcHRJbi5jcmVhdGVkQXQgfHwgbmV3IERhdGUoKTtcbiAgICBjb25zdCByZXN1bHQgPSBzdXBlci5pbnNlcnQob3VyT3B0SW4sIGNhbGxiYWNrKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIHVwZGF0ZShzZWxlY3RvciwgbW9kaWZpZXIpIHtcbiAgICBjb25zdCByZXN1bHQgPSBzdXBlci51cGRhdGUoc2VsZWN0b3IsIG1vZGlmaWVyKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIHJlbW92ZShzZWxlY3Rvcikge1xuICAgIGNvbnN0IHJlc3VsdCA9IHN1cGVyLnJlbW92ZShzZWxlY3Rvcik7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgT3B0SW5zID0gbmV3IE9wdEluc0NvbGxlY3Rpb24oJ29wdC1pbnMnKTtcblxuLy8gRGVueSBhbGwgY2xpZW50LXNpZGUgdXBkYXRlcyBzaW5jZSB3ZSB3aWxsIGJlIHVzaW5nIG1ldGhvZHMgdG8gbWFuYWdlIHRoaXMgY29sbGVjdGlvblxuT3B0SW5zLmRlbnkoe1xuICBpbnNlcnQoKSB7IHJldHVybiB0cnVlOyB9LFxuICB1cGRhdGUoKSB7IHJldHVybiB0cnVlOyB9LFxuICByZW1vdmUoKSB7IHJldHVybiB0cnVlOyB9LFxufSk7XG5cbk9wdElucy5zY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgX2lkOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIHJlZ0V4OiBTaW1wbGVTY2hlbWEuUmVnRXguSWQsXG4gIH0sXG4gIHJlY2lwaWVudDoge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICBvcHRpb25hbDogdHJ1ZSxcbiAgICBkZW55VXBkYXRlOiB0cnVlLFxuICB9LFxuICBzZW5kZXI6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgb3B0aW9uYWw6IHRydWUsXG4gICAgZGVueVVwZGF0ZTogdHJ1ZSxcbiAgfSxcbiAgZGF0YToge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICBvcHRpb25hbDogdHJ1ZSxcbiAgICBkZW55VXBkYXRlOiBmYWxzZSxcbiAgfSxcbiAgaW5kZXg6IHtcbiAgICB0eXBlOiBTaW1wbGVTY2hlbWEuSW50ZWdlcixcbiAgICBvcHRpb25hbDogdHJ1ZSxcbiAgICBkZW55VXBkYXRlOiBmYWxzZSxcbiAgfSxcbiAgbmFtZUlkOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIG9wdGlvbmFsOiB0cnVlLFxuICAgIGRlbnlVcGRhdGU6IGZhbHNlLFxuICB9LFxuICB0eElkOiB7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICBvcHRpb25hbDogdHJ1ZSxcbiAgICAgIGRlbnlVcGRhdGU6IGZhbHNlLFxuICB9LFxuICBtYXN0ZXJEb2k6IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIG9wdGlvbmFsOiB0cnVlLFxuICAgICAgZGVueVVwZGF0ZTogZmFsc2UsXG4gIH0sXG4gIGNyZWF0ZWRBdDoge1xuICAgIHR5cGU6IERhdGUsXG4gICAgZGVueVVwZGF0ZTogdHJ1ZSxcbiAgfSxcbiAgY29uZmlybWVkQXQ6IHtcbiAgICB0eXBlOiBEYXRlLFxuICAgIG9wdGlvbmFsOiB0cnVlLFxuICAgIGRlbnlVcGRhdGU6IGZhbHNlLFxuICB9LFxuICBjb25maXJtZWRCeToge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICByZWdFeDogU2ltcGxlU2NoZW1hLlJlZ0V4LklQLFxuICAgIG9wdGlvbmFsOiB0cnVlLFxuICAgIGRlbnlVcGRhdGU6IGZhbHNlXG4gIH0sXG4gIGNvbmZpcm1hdGlvblRva2VuOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIG9wdGlvbmFsOiB0cnVlLFxuICAgIGRlbnlVcGRhdGU6IGZhbHNlXG4gIH0sXG4gIG93bmVySWQ6e1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICBvcHRpb25hbDogdHJ1ZSxcbiAgICByZWdFeDogU2ltcGxlU2NoZW1hLlJlZ0V4LklkXG4gIH0sXG4gIGVycm9yOntcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIG9wdGlvbmFsOiB0cnVlLFxuICAgICAgZGVueVVwZGF0ZTogZmFsc2VcbiAgfVxufSk7XG5cbk9wdElucy5hdHRhY2hTY2hlbWEoT3B0SW5zLnNjaGVtYSk7XG5cbi8vIFRoaXMgcmVwcmVzZW50cyB0aGUga2V5cyBmcm9tIE9wdC1JbiBvYmplY3RzIHRoYXQgc2hvdWxkIGJlIHB1Ymxpc2hlZFxuLy8gdG8gdGhlIGNsaWVudC4gSWYgd2UgYWRkIHNlY3JldCBwcm9wZXJ0aWVzIHRvIE9wdC1JbiBvYmplY3RzLCBkb24ndCBsaXN0XG4vLyB0aGVtIGhlcmUgdG8ga2VlcCB0aGVtIHByaXZhdGUgdG8gdGhlIHNlcnZlci5cbk9wdElucy5wdWJsaWNGaWVsZHMgPSB7XG4gIF9pZDogMSxcbiAgcmVjaXBpZW50OiAxLFxuICBzZW5kZXI6IDEsXG4gIGRhdGE6IDEsXG4gIGluZGV4OiAxLFxuICBuYW1lSWQ6IDEsXG4gIHR4SWQ6IDEsXG4gIG1hc3RlckRvaTogMSxcbiAgY3JlYXRlZEF0OiAxLFxuICBjb25maXJtZWRBdDogMSxcbiAgY29uZmlybWVkQnk6IDEsXG4gIG93bmVySWQ6IDEsXG4gIGVycm9yOiAxXG59O1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgeyBSb2xlcyB9IGZyb20gJ21ldGVvci9hbGFubmluZzpyb2xlcyc7XG5cbmltcG9ydCB7IFJlY2lwaWVudHMgfSBmcm9tICcuLi9yZWNpcGllbnRzLmpzJztcblxuTWV0ZW9yLnB1Ymxpc2goJ3JlY2lwaWVudHMuYWxsJywgZnVuY3Rpb24gcmVjaXBpZW50c0FsbCgpIHtcbiAgaWYoIXRoaXMudXNlcklkIHx8ICFSb2xlcy51c2VySXNJblJvbGUodGhpcy51c2VySWQsIFsnYWRtaW4nXSkpIHtcbiAgICByZXR1cm4gdGhpcy5yZWFkeSgpO1xuICB9XG5cbiAgcmV0dXJuIFJlY2lwaWVudHMuZmluZCh7fSwge1xuICAgIGZpZWxkczogUmVjaXBpZW50cy5wdWJsaWNGaWVsZHMsXG4gIH0pO1xufSk7XG4iLCJpbXBvcnQgeyBNb25nbyB9IGZyb20gJ21ldGVvci9tb25nbyc7XG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XG5cbmNsYXNzIFJlY2lwaWVudHNDb2xsZWN0aW9uIGV4dGVuZHMgTW9uZ28uQ29sbGVjdGlvbiB7XG4gIGluc2VydChyZWNpcGllbnQsIGNhbGxiYWNrKSB7XG4gICAgY29uc3Qgb3VyUmVjaXBpZW50ID0gcmVjaXBpZW50O1xuICAgIG91clJlY2lwaWVudC5jcmVhdGVkQXQgPSBvdXJSZWNpcGllbnQuY3JlYXRlZEF0IHx8IG5ldyBEYXRlKCk7XG4gICAgY29uc3QgcmVzdWx0ID0gc3VwZXIuaW5zZXJ0KG91clJlY2lwaWVudCwgY2FsbGJhY2spO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgdXBkYXRlKHNlbGVjdG9yLCBtb2RpZmllcikge1xuICAgIGNvbnN0IHJlc3VsdCA9IHN1cGVyLnVwZGF0ZShzZWxlY3RvciwgbW9kaWZpZXIpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgcmVtb3ZlKHNlbGVjdG9yKSB7XG4gICAgY29uc3QgcmVzdWx0ID0gc3VwZXIucmVtb3ZlKHNlbGVjdG9yKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG5cbmV4cG9ydCBjb25zdCBSZWNpcGllbnRzID0gbmV3IFJlY2lwaWVudHNDb2xsZWN0aW9uKCdyZWNpcGllbnRzJyk7XG5cbi8vIERlbnkgYWxsIGNsaWVudC1zaWRlIHVwZGF0ZXMgc2luY2Ugd2Ugd2lsbCBiZSB1c2luZyBtZXRob2RzIHRvIG1hbmFnZSB0aGlzIGNvbGxlY3Rpb25cblJlY2lwaWVudHMuZGVueSh7XG4gIGluc2VydCgpIHsgcmV0dXJuIHRydWU7IH0sXG4gIHVwZGF0ZSgpIHsgcmV0dXJuIHRydWU7IH0sXG4gIHJlbW92ZSgpIHsgcmV0dXJuIHRydWU7IH0sXG59KTtcblxuUmVjaXBpZW50cy5zY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgX2lkOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIHJlZ0V4OiBTaW1wbGVTY2hlbWEuUmVnRXguSWQsXG4gIH0sXG4gIGVtYWlsOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIGluZGV4OiB0cnVlLFxuICAgIGRlbnlVcGRhdGU6IHRydWUsXG4gIH0sXG4gIHByaXZhdGVLZXk6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgdW5pcXVlOiB0cnVlLFxuICAgIGRlbnlVcGRhdGU6IHRydWUsXG4gIH0sXG4gIHB1YmxpY0tleToge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICB1bmlxdWU6IHRydWUsXG4gICAgZGVueVVwZGF0ZTogdHJ1ZSxcbiAgfSxcbiAgY3JlYXRlZEF0OiB7XG4gICAgdHlwZTogRGF0ZSxcbiAgICBkZW55VXBkYXRlOiB0cnVlLFxuICB9XG59KTtcblxuUmVjaXBpZW50cy5hdHRhY2hTY2hlbWEoUmVjaXBpZW50cy5zY2hlbWEpO1xuXG4vLyBUaGlzIHJlcHJlc2VudHMgdGhlIGtleXMgZnJvbSBSZWNpcGllbnQgb2JqZWN0cyB0aGF0IHNob3VsZCBiZSBwdWJsaXNoZWRcbi8vIHRvIHRoZSBjbGllbnQuIElmIHdlIGFkZCBzZWNyZXQgcHJvcGVydGllcyB0byBSZWNpcGllbnQgb2JqZWN0cywgZG9uJ3QgbGlzdFxuLy8gdGhlbSBoZXJlIHRvIGtlZXAgdGhlbSBwcml2YXRlIHRvIHRoZSBzZXJ2ZXIuXG5SZWNpcGllbnRzLnB1YmxpY0ZpZWxkcyA9IHtcbiAgX2lkOiAxLFxuICBlbWFpbDogMSxcbiAgcHVibGljS2V5OiAxLFxuICBjcmVhdGVkQXQ6IDFcbn07XG4iLCJpbXBvcnQgeyBNb25nbyB9IGZyb20gJ21ldGVvci9tb25nbyc7XG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XG5cbmNsYXNzIERvaWNoYWluRW50cmllc0NvbGxlY3Rpb24gZXh0ZW5kcyBNb25nby5Db2xsZWN0aW9uIHtcbiAgaW5zZXJ0KGVudHJ5LCBjYWxsYmFjaykge1xuICAgIGNvbnN0IHJlc3VsdCA9IHN1cGVyLmluc2VydChlbnRyeSwgY2FsbGJhY2spO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgdXBkYXRlKHNlbGVjdG9yLCBtb2RpZmllcikge1xuICAgIGNvbnN0IHJlc3VsdCA9IHN1cGVyLnVwZGF0ZShzZWxlY3RvciwgbW9kaWZpZXIpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgcmVtb3ZlKHNlbGVjdG9yKSB7XG4gICAgY29uc3QgcmVzdWx0ID0gc3VwZXIucmVtb3ZlKHNlbGVjdG9yKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG5cbmV4cG9ydCBjb25zdCBEb2ljaGFpbkVudHJpZXMgPSBuZXcgRG9pY2hhaW5FbnRyaWVzQ29sbGVjdGlvbignZG9pY2hhaW4tZW50cmllcycpO1xuXG4vLyBEZW55IGFsbCBjbGllbnQtc2lkZSB1cGRhdGVzIHNpbmNlIHdlIHdpbGwgYmUgdXNpbmcgbWV0aG9kcyB0byBtYW5hZ2UgdGhpcyBjb2xsZWN0aW9uXG5Eb2ljaGFpbkVudHJpZXMuZGVueSh7XG4gIGluc2VydCgpIHsgcmV0dXJuIHRydWU7IH0sXG4gIHVwZGF0ZSgpIHsgcmV0dXJuIHRydWU7IH0sXG4gIHJlbW92ZSgpIHsgcmV0dXJuIHRydWU7IH0sXG59KTtcblxuRG9pY2hhaW5FbnRyaWVzLnNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICBfaWQ6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgcmVnRXg6IFNpbXBsZVNjaGVtYS5SZWdFeC5JZCxcbiAgfSxcbiAgbmFtZToge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICBpbmRleDogdHJ1ZSxcbiAgICBkZW55VXBkYXRlOiB0cnVlXG4gIH0sXG4gIHZhbHVlOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIGRlbnlVcGRhdGU6IGZhbHNlXG4gIH0sXG4gIGFkZHJlc3M6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgZGVueVVwZGF0ZTogZmFsc2VcbiAgfSxcbiAgbWFzdGVyRG9pOiB7XG4gICAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgICAgb3B0aW9uYWw6IHRydWUsXG4gICAgICAgIGluZGV4OiB0cnVlLFxuICAgICAgICBkZW55VXBkYXRlOiB0cnVlXG4gIH0sXG4gIGluZGV4OiB7XG4gICAgICAgIHR5cGU6IFNpbXBsZVNjaGVtYS5JbnRlZ2VyLFxuICAgICAgICBvcHRpb25hbDogdHJ1ZSxcbiAgICAgICAgZGVueVVwZGF0ZTogdHJ1ZVxuICB9LFxuICB0eElkOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIGRlbnlVcGRhdGU6IGZhbHNlXG4gIH1cbn0pO1xuXG5Eb2ljaGFpbkVudHJpZXMuYXR0YWNoU2NoZW1hKERvaWNoYWluRW50cmllcy5zY2hlbWEpO1xuXG4vLyBUaGlzIHJlcHJlc2VudHMgdGhlIGtleXMgZnJvbSBFbnRyeSBvYmplY3RzIHRoYXQgc2hvdWxkIGJlIHB1Ymxpc2hlZFxuLy8gdG8gdGhlIGNsaWVudC4gSWYgd2UgYWRkIHNlY3JldCBwcm9wZXJ0aWVzIHRvIEVudHJ5IG9iamVjdHMsIGRvbid0IGxpc3Rcbi8vIHRoZW0gaGVyZSB0byBrZWVwIHRoZW0gcHJpdmF0ZSB0byB0aGUgc2VydmVyLlxuRG9pY2hhaW5FbnRyaWVzLnB1YmxpY0ZpZWxkcyA9IHtcbiAgX2lkOiAxLFxuICBuYW1lOiAxLFxuICB2YWx1ZTogMSxcbiAgYWRkcmVzczogMSxcbiAgbWFzdGVyRG9pOiAxLFxuICBpbmRleDogMSxcbiAgdHhJZDogMVxufTtcbiIsImltcG9ydCB7IFZhbGlkYXRlZE1ldGhvZCB9IGZyb20gJ21ldGVvci9tZGc6dmFsaWRhdGVkLW1ldGhvZCc7XG5pbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCB7IEREUFJhdGVMaW1pdGVyIH0gZnJvbSAnbWV0ZW9yL2RkcC1yYXRlLWxpbWl0ZXInO1xuaW1wb3J0IGdldEtleVBhaXJNIGZyb20gJy4uLy4uL21vZHVsZXMvc2VydmVyL2RvaWNoYWluL2dldF9rZXktcGFpci5qcyc7XG5pbXBvcnQgZ2V0QmFsYW5jZU0gZnJvbSAnLi4vLi4vbW9kdWxlcy9zZXJ2ZXIvZG9pY2hhaW4vZ2V0X2JhbGFuY2UuanMnO1xuXG5cbmNvbnN0IGdldEtleVBhaXIgPSBuZXcgVmFsaWRhdGVkTWV0aG9kKHtcbiAgbmFtZTogJ2RvaWNoYWluLmdldEtleVBhaXInLFxuICB2YWxpZGF0ZTogbnVsbCxcbiAgcnVuKCkge1xuICAgIHJldHVybiBnZXRLZXlQYWlyTSgpO1xuICB9LFxufSk7XG5cbmNvbnN0IGdldEJhbGFuY2UgPSBuZXcgVmFsaWRhdGVkTWV0aG9kKHtcbiAgbmFtZTogJ2RvaWNoYWluLmdldEJhbGFuY2UnLFxuICB2YWxpZGF0ZTogbnVsbCxcbiAgcnVuKCkge1xuICAgIGNvbnN0IGxvZ1ZhbCA9IGdldEJhbGFuY2VNKCk7XG4gICAgcmV0dXJuIGxvZ1ZhbDtcbiAgfSxcbn0pO1xuXG5cbi8vIEdldCBsaXN0IG9mIGFsbCBtZXRob2QgbmFtZXMgb24gZG9pY2hhaW5cbmNvbnN0IE9QVElOU19NRVRIT0RTID0gXy5wbHVjayhbXG4gIGdldEtleVBhaXJcbixnZXRCYWxhbmNlXSwgJ25hbWUnKTtcblxuaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAvLyBPbmx5IGFsbG93IDUgb3B0LWluIG9wZXJhdGlvbnMgcGVyIGNvbm5lY3Rpb24gcGVyIHNlY29uZFxuICBERFBSYXRlTGltaXRlci5hZGRSdWxlKHtcbiAgICBuYW1lKG5hbWUpIHtcbiAgICAgIHJldHVybiBfLmNvbnRhaW5zKE9QVElOU19NRVRIT0RTLCBuYW1lKTtcbiAgICB9LFxuXG4gICAgLy8gUmF0ZSBsaW1pdCBwZXIgY29ubmVjdGlvbiBJRFxuICAgIGNvbm5lY3Rpb25JZCgpIHsgcmV0dXJuIHRydWU7IH0sXG4gIH0sIDUsIDEwMDApO1xufVxuIiwiaW1wb3J0IHsgTWV0ZW9yfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCB7IEREUFJhdGVMaW1pdGVyIH0gZnJvbSAnbWV0ZW9yL2RkcC1yYXRlLWxpbWl0ZXInO1xuaW1wb3J0IHsgVmFsaWRhdGVkTWV0aG9kIH0gZnJvbSAnbWV0ZW9yL21kZzp2YWxpZGF0ZWQtbWV0aG9kJztcbmltcG9ydCBnZXRMYW5ndWFnZXMgZnJvbSAnLi4vLi4vbW9kdWxlcy9zZXJ2ZXIvbGFuZ3VhZ2VzL2dldC5qcyc7XG5cbmNvbnN0IGdldEFsbExhbmd1YWdlcyA9IG5ldyBWYWxpZGF0ZWRNZXRob2Qoe1xuICBuYW1lOiAnbGFuZ3VhZ2VzLmdldEFsbCcsXG4gIHZhbGlkYXRlOiBudWxsLFxuICBydW4oKSB7XG4gICAgcmV0dXJuIGdldExhbmd1YWdlcygpO1xuICB9LFxufSk7XG5cbi8vIEdldCBsaXN0IG9mIGFsbCBtZXRob2QgbmFtZXMgb24gbGFuZ3VhZ2VzXG5jb25zdCBPUFRJTlNfTUVUSE9EUyA9IF8ucGx1Y2soW1xuICBnZXRBbGxMYW5ndWFnZXNcbl0sICduYW1lJyk7XG5cbmlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgLy8gT25seSBhbGxvdyA1IG9wdC1pbiBvcGVyYXRpb25zIHBlciBjb25uZWN0aW9uIHBlciBzZWNvbmRcbiAgRERQUmF0ZUxpbWl0ZXIuYWRkUnVsZSh7XG4gICAgbmFtZShuYW1lKSB7XG4gICAgICByZXR1cm4gXy5jb250YWlucyhPUFRJTlNfTUVUSE9EUywgbmFtZSk7XG4gICAgfSxcblxuICAgIC8vIFJhdGUgbGltaXQgcGVyIGNvbm5lY3Rpb24gSURcbiAgICBjb25uZWN0aW9uSWQoKSB7IHJldHVybiB0cnVlOyB9LFxuICB9LCA1LCAxMDAwKTtcbn1cbiIsImltcG9ydCB7IE1vbmdvIH0gZnJvbSAnbWV0ZW9yL21vbmdvJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcblxuY2xhc3MgTWV0YUNvbGxlY3Rpb24gZXh0ZW5kcyBNb25nby5Db2xsZWN0aW9uIHtcbiAgaW5zZXJ0KGRhdGEsIGNhbGxiYWNrKSB7XG4gICAgY29uc3Qgb3VyRGF0YSA9IGRhdGE7XG4gICAgY29uc3QgcmVzdWx0ID0gc3VwZXIuaW5zZXJ0KG91ckRhdGEsIGNhbGxiYWNrKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIHVwZGF0ZShzZWxlY3RvciwgbW9kaWZpZXIpIHtcbiAgICBjb25zdCByZXN1bHQgPSBzdXBlci51cGRhdGUoc2VsZWN0b3IsIG1vZGlmaWVyKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIHJlbW92ZShzZWxlY3Rvcikge1xuICAgIGNvbnN0IHJlc3VsdCA9IHN1cGVyLnJlbW92ZShzZWxlY3Rvcik7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgTWV0YSA9IG5ldyBNZXRhQ29sbGVjdGlvbignbWV0YScpO1xuXG4vLyBEZW55IGFsbCBjbGllbnQtc2lkZSB1cGRhdGVzIHNpbmNlIHdlIHdpbGwgYmUgdXNpbmcgbWV0aG9kcyB0byBtYW5hZ2UgdGhpcyBjb2xsZWN0aW9uXG5NZXRhLmRlbnkoe1xuICBpbnNlcnQoKSB7IHJldHVybiB0cnVlOyB9LFxuICB1cGRhdGUoKSB7IHJldHVybiB0cnVlOyB9LFxuICByZW1vdmUoKSB7IHJldHVybiB0cnVlOyB9LFxufSk7XG5cbk1ldGEuc2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIF9pZDoge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICByZWdFeDogU2ltcGxlU2NoZW1hLlJlZ0V4LklkLFxuICB9LFxuICBrZXk6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgaW5kZXg6IHRydWUsXG4gICAgZGVueVVwZGF0ZTogdHJ1ZVxuICB9LFxuICB2YWx1ZToge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9XG59KTtcblxuTWV0YS5hdHRhY2hTY2hlbWEoTWV0YS5zY2hlbWEpO1xuXG4vLyBUaGlzIHJlcHJlc2VudHMgdGhlIGtleXMgZnJvbSBNZXRhIG9iamVjdHMgdGhhdCBzaG91bGQgYmUgcHVibGlzaGVkXG4vLyB0byB0aGUgY2xpZW50LiBJZiB3ZSBhZGQgc2VjcmV0IHByb3BlcnRpZXMgdG8gTWV0YSBvYmplY3RzLCBkb24ndCBsaXN0XG4vLyB0aGVtIGhlcmUgdG8ga2VlcCB0aGVtIHByaXZhdGUgdG8gdGhlIHNlcnZlci5cbk1ldGEucHVibGljRmllbGRzID0ge1xufTtcbiIsImltcG9ydCB7IE1vbmdvIH0gZnJvbSAnbWV0ZW9yL21vbmdvJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcblxuY2xhc3MgU2VuZGVyc0NvbGxlY3Rpb24gZXh0ZW5kcyBNb25nby5Db2xsZWN0aW9uIHtcbiAgaW5zZXJ0KHNlbmRlciwgY2FsbGJhY2spIHtcbiAgICBjb25zdCBvdXJTZW5kZXIgPSBzZW5kZXI7XG4gICAgb3VyU2VuZGVyLmNyZWF0ZWRBdCA9IG91clNlbmRlci5jcmVhdGVkQXQgfHwgbmV3IERhdGUoKTtcbiAgICBjb25zdCByZXN1bHQgPSBzdXBlci5pbnNlcnQob3VyU2VuZGVyLCBjYWxsYmFjayk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICB1cGRhdGUoc2VsZWN0b3IsIG1vZGlmaWVyKSB7XG4gICAgY29uc3QgcmVzdWx0ID0gc3VwZXIudXBkYXRlKHNlbGVjdG9yLCBtb2RpZmllcik7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICByZW1vdmUoc2VsZWN0b3IpIHtcbiAgICBjb25zdCByZXN1bHQgPSBzdXBlci5yZW1vdmUoc2VsZWN0b3IpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IFNlbmRlcnMgPSBuZXcgU2VuZGVyc0NvbGxlY3Rpb24oJ3NlbmRlcnMnKTtcblxuLy8gRGVueSBhbGwgY2xpZW50LXNpZGUgdXBkYXRlcyBzaW5jZSB3ZSB3aWxsIGJlIHVzaW5nIG1ldGhvZHMgdG8gbWFuYWdlIHRoaXMgY29sbGVjdGlvblxuU2VuZGVycy5kZW55KHtcbiAgaW5zZXJ0KCkgeyByZXR1cm4gdHJ1ZTsgfSxcbiAgdXBkYXRlKCkgeyByZXR1cm4gdHJ1ZTsgfSxcbiAgcmVtb3ZlKCkgeyByZXR1cm4gdHJ1ZTsgfSxcbn0pO1xuXG5TZW5kZXJzLnNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICBfaWQ6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgcmVnRXg6IFNpbXBsZVNjaGVtYS5SZWdFeC5JZCxcbiAgfSxcbiAgZW1haWw6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgaW5kZXg6IHRydWUsXG4gICAgZGVueVVwZGF0ZTogdHJ1ZSxcbiAgfSxcbiAgY3JlYXRlZEF0OiB7XG4gICAgdHlwZTogRGF0ZSxcbiAgICBkZW55VXBkYXRlOiB0cnVlLFxuICB9XG59KTtcblxuU2VuZGVycy5hdHRhY2hTY2hlbWEoU2VuZGVycy5zY2hlbWEpO1xuXG4vLyBUaGlzIHJlcHJlc2VudHMgdGhlIGtleXMgZnJvbSBTZW5kZXIgb2JqZWN0cyB0aGF0IHNob3VsZCBiZSBwdWJsaXNoZWRcbi8vIHRvIHRoZSBjbGllbnQuIElmIHdlIGFkZCBzZWNyZXQgcHJvcGVydGllcyB0byBTZW5kZXIgb2JqZWN0cywgZG9uJ3QgbGlzdFxuLy8gdGhlbSBoZXJlIHRvIGtlZXAgdGhlbSBwcml2YXRlIHRvIHRoZSBzZXJ2ZXIuXG5TZW5kZXJzLnB1YmxpY0ZpZWxkcyA9IHtcbiAgZW1haWw6IDEsXG4gIGNyZWF0ZWRBdDogMVxufTtcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tICdzaW1wbC1zY2hlbWEnO1xuaW1wb3J0IHsgRE9JX01BSUxfRkVUQ0hfVVJMIH0gZnJvbSAnLi4vLi4vLi4vc3RhcnR1cC9zZXJ2ZXIvZW1haWwtY29uZmlndXJhdGlvbi5qcyc7XG5pbXBvcnQge2xvZ1NlbmR9IGZyb20gXCIuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9sb2ctY29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHtPcHRJbnN9IGZyb20gXCIuLi8uLi8uLi9hcGkvb3B0LWlucy9vcHQtaW5zXCI7XG5cbmNvbnN0IEV4cG9ydERvaXNEYXRhU2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIHN0YXR1czoge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICBvcHRpb25hbDogdHJ1ZSxcbiAgfSxcbiAgcm9sZTp7XG4gICAgdHlwZTpTdHJpbmdcbiAgfSxcbiAgdXNlcmlkOntcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgcmVnRXg6IFNpbXBsZVNjaGVtYS5SZWdFeC5pZCxcbiAgICBvcHRpb25hbDp0cnVlIFxuICB9XG59KTtcblxuLy9UT0RPIGFkZCBzZW5kZXIgYW5kIHJlY2lwaWVudCBlbWFpbCBhZGRyZXNzIHRvIGV4cG9ydFxuXG5jb25zdCBleHBvcnREb2lzID0gKGRhdGEpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBvdXJEYXRhID0gZGF0YTtcbiAgICBFeHBvcnREb2lzRGF0YVNjaGVtYS52YWxpZGF0ZShvdXJEYXRhKTtcbiAgICBsZXQgcGlwZWxpbmU9W3sgJG1hdGNoOiB7XCJjb25maXJtZWRBdFwiOnsgJGV4aXN0czogdHJ1ZSwgJG5lOiBudWxsIH19IH1dO1xuICAgIFxuICAgIGlmKG91ckRhdGEucm9sZSE9J2FkbWluJ3x8b3VyRGF0YS51c2VyaWQhPXVuZGVmaW5lZCl7XG4gICAgICBwaXBlbGluZS5wdXNoKHsgJHJlZGFjdDp7XG4gICAgICAgICRjb25kOiB7XG4gICAgICAgICAgaWY6IHsgJGNtcDogWyBcIiRvd25lcklkXCIsIG91ckRhdGEudXNlcmlkIF0gfSxcbiAgICAgICAgICB0aGVuOiBcIiQkUFJVTkVcIixcbiAgICAgICAgICBlbHNlOiBcIiQkS0VFUFwiIH19fSk7XG4gICAgfVxuICAgIHBpcGVsaW5lLmNvbmNhdChbXG4gICAgICAgIHsgJGxvb2t1cDogeyBmcm9tOiBcInJlY2lwaWVudHNcIiwgbG9jYWxGaWVsZDogXCJyZWNpcGllbnRcIiwgZm9yZWlnbkZpZWxkOiBcIl9pZFwiLCBhczogXCJSZWNpcGllbnRFbWFpbFwiIH0gfSxcbiAgICAgICAgeyAkbG9va3VwOiB7IGZyb206IFwic2VuZGVyc1wiLCBsb2NhbEZpZWxkOiBcInNlbmRlclwiLCBmb3JlaWduRmllbGQ6IFwiX2lkXCIsIGFzOiBcIlNlbmRlckVtYWlsXCIgfSB9LFxuICAgICAgICB7ICR1bndpbmQ6IFwiJFNlbmRlckVtYWlsXCJ9LFxuICAgICAgICB7ICR1bndpbmQ6IFwiJFJlY2lwaWVudEVtYWlsXCJ9LFxuICAgICAgICB7ICRwcm9qZWN0OiB7XCJfaWRcIjoxLFwiY3JlYXRlZEF0XCI6MSwgXCJjb25maXJtZWRBdFwiOjEsXCJuYW1lSWRcIjoxLCBcIlNlbmRlckVtYWlsLmVtYWlsXCI6MSxcIlJlY2lwaWVudEVtYWlsLmVtYWlsXCI6MX19XG4gICAgXSk7XG4gICAgLy9pZihvdXJEYXRhLnN0YXR1cz09MSkgcXVlcnkgPSB7XCJjb25maXJtZWRBdFwiOiB7ICRleGlzdHM6IHRydWUsICRuZTogbnVsbCB9fVxuXG4gICAgbGV0IG9wdElucyA9ICBPcHRJbnMuYWdncmVnYXRlKHBpcGVsaW5lKTtcbiAgICBsZXQgZXhwb3J0RG9pRGF0YTtcbiAgICB0cnkge1xuICAgICAgICBleHBvcnREb2lEYXRhID0gb3B0SW5zO1xuICAgICAgICBsb2dTZW5kKCdleHBvcnREb2kgdXJsOicsRE9JX01BSUxfRkVUQ0hfVVJMLEpTT04uc3RyaW5naWZ5KGV4cG9ydERvaURhdGEpKTtcbiAgICAgIHJldHVybiBleHBvcnREb2lEYXRhXG5cbiAgICB9IGNhdGNoKGVycm9yKSB7XG4gICAgICB0aHJvdyBcIkVycm9yIHdoaWxlIGV4cG9ydGluZyBkb2lzOiBcIitlcnJvcjtcbiAgICB9XG5cbiAgfSBjYXRjaCAoZXhjZXB0aW9uKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZGFwcHMuZXhwb3J0RG9pLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGV4cG9ydERvaXM7XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcbmltcG9ydCB7IERPSV9GRVRDSF9ST1VURSwgRE9JX0NPTkZJUk1BVElPTl9ST1VURSwgQVBJX1BBVEgsIFZFUlNJT04gfSBmcm9tICcuLi8uLi8uLi8uLi9zZXJ2ZXIvYXBpL3Jlc3QvcmVzdC5qcyc7XG5pbXBvcnQgeyBnZXRVcmwgfSBmcm9tICcuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9kYXBwLWNvbmZpZ3VyYXRpb24uanMnO1xuaW1wb3J0IHsgQ09ORklSTV9DTElFTlQsIENPTkZJUk1fQUREUkVTUyB9IGZyb20gJy4uLy4uLy4uL3N0YXJ0dXAvc2VydmVyL2RvaWNoYWluLWNvbmZpZ3VyYXRpb24uanMnO1xuaW1wb3J0IHsgZ2V0SHR0cEdFVCB9IGZyb20gJy4uLy4uLy4uLy4uL3NlcnZlci9hcGkvaHR0cC5qcyc7XG5pbXBvcnQgeyBzaWduTWVzc2FnZSB9IGZyb20gJy4uLy4uLy4uLy4uL3NlcnZlci9hcGkvZG9pY2hhaW4uanMnO1xuaW1wb3J0IHsgT3B0SW5zIH0gZnJvbSAnLi4vLi4vLi4vLi4vaW1wb3J0cy9hcGkvb3B0LWlucy9vcHQtaW5zLmpzJztcbmltcG9ydCBwYXJzZVRlbXBsYXRlIGZyb20gJy4uL2VtYWlscy9wYXJzZV90ZW1wbGF0ZS5qcyc7XG5pbXBvcnQgZ2VuZXJhdGVEb2lUb2tlbiBmcm9tICcuLi9vcHQtaW5zL2dlbmVyYXRlX2RvaS10b2tlbi5qcyc7XG5pbXBvcnQgZ2VuZXJhdGVEb2lIYXNoIGZyb20gJy4uL2VtYWlscy9nZW5lcmF0ZV9kb2ktaGFzaC5qcyc7XG5pbXBvcnQgYWRkT3B0SW4gZnJvbSAnLi4vb3B0LWlucy9hZGQuanMnO1xuaW1wb3J0IGFkZFNlbmRNYWlsSm9iIGZyb20gJy4uL2pvYnMvYWRkX3NlbmRfbWFpbC5qcyc7XG5pbXBvcnQge2xvZ0NvbmZpcm0sIGxvZ0Vycm9yfSBmcm9tIFwiLi4vLi4vLi4vc3RhcnR1cC9zZXJ2ZXIvbG9nLWNvbmZpZ3VyYXRpb25cIjtcblxuY29uc3QgRmV0Y2hEb2lNYWlsRGF0YVNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICBuYW1lOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH0sXG4gIGRvbWFpbjoge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9XG59KTtcblxuXG5jb25zdCBmZXRjaERvaU1haWxEYXRhID0gKGRhdGEpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBvdXJEYXRhID0gZGF0YTtcbiAgICBGZXRjaERvaU1haWxEYXRhU2NoZW1hLnZhbGlkYXRlKG91ckRhdGEpO1xuICAgIGNvbnN0IHVybCA9IG91ckRhdGEuZG9tYWluK0FQSV9QQVRIK1ZFUlNJT04rXCIvXCIrRE9JX0ZFVENIX1JPVVRFO1xuICAgIGNvbnN0IHNpZ25hdHVyZSA9IHNpZ25NZXNzYWdlKENPTkZJUk1fQ0xJRU5ULCBDT05GSVJNX0FERFJFU1MsIG91ckRhdGEubmFtZSk7XG4gICAgY29uc3QgcXVlcnkgPSBcIm5hbWVfaWQ9XCIrZW5jb2RlVVJJQ29tcG9uZW50KG91ckRhdGEubmFtZSkrXCImc2lnbmF0dXJlPVwiK2VuY29kZVVSSUNvbXBvbmVudChzaWduYXR1cmUpO1xuICAgIGxvZ0NvbmZpcm0oJ2NhbGxpbmcgZm9yIGRvaS1lbWFpbC10ZW1wbGF0ZTonK3VybCsnIHF1ZXJ5OicsIHF1ZXJ5KTtcblxuICAgIC8qKlxuICAgICAgVE9ETyB3aGVuIHJ1bm5pbmcgU2VuZC1kQXBwIGluIFRlc3RuZXQgYmVoaW5kIE5BVCB0aGlzIFVSTCB3aWxsIG5vdCBiZSBhY2Nlc3NpYmxlIGZyb20gdGhlIGludGVybmV0XG4gICAgICBidXQgZXZlbiB3aGVuIHdlIHVzZSB0aGUgVVJMIGZyb20gbG9jYWxob3N0IHZlcmlmeSBhbmRuIG90aGVycyB3aWxsIGZhaWxzLlxuICAgICAqL1xuICAgIGNvbnN0IHJlc3BvbnNlID0gZ2V0SHR0cEdFVCh1cmwsIHF1ZXJ5KTtcbiAgICBpZihyZXNwb25zZSA9PT0gdW5kZWZpbmVkIHx8IHJlc3BvbnNlLmRhdGEgPT09IHVuZGVmaW5lZCkgdGhyb3cgXCJCYWQgcmVzcG9uc2VcIjtcbiAgICBjb25zdCByZXNwb25zZURhdGEgPSByZXNwb25zZS5kYXRhO1xuICAgIGxvZ0NvbmZpcm0oJ3Jlc3BvbnNlIHdoaWxlIGdldHRpbmcgZ2V0dGluZyBlbWFpbCB0ZW1wbGF0ZSBmcm9tIFVSTDonLHJlc3BvbnNlLmRhdGEuc3RhdHVzKTtcblxuICAgIGlmKHJlc3BvbnNlRGF0YS5zdGF0dXMgIT09IFwic3VjY2Vzc1wiKSB7XG4gICAgICBpZihyZXNwb25zZURhdGEuZXJyb3IgPT09IHVuZGVmaW5lZCkgdGhyb3cgXCJCYWQgcmVzcG9uc2VcIjtcbiAgICAgIGlmKHJlc3BvbnNlRGF0YS5lcnJvci5pbmNsdWRlcyhcIk9wdC1JbiBub3QgZm91bmRcIikpIHtcbiAgICAgICAgLy9EbyBub3RoaW5nIGFuZCBkb24ndCB0aHJvdyBlcnJvciBzbyBqb2IgaXMgZG9uZVxuICAgICAgICAgIGxvZ0Vycm9yKCdyZXNwb25zZSBkYXRhIGZyb20gU2VuZC1kQXBwOicscmVzcG9uc2VEYXRhLmVycm9yKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdGhyb3cgcmVzcG9uc2VEYXRhLmVycm9yO1xuICAgIH1cbiAgICBsb2dDb25maXJtKCdET0kgTWFpbCBkYXRhIGZldGNoZWQuJyk7XG5cbiAgICBjb25zdCBvcHRJbklkID0gYWRkT3B0SW4oe25hbWU6IG91ckRhdGEubmFtZX0pO1xuICAgIGNvbnN0IG9wdEluID0gT3B0SW5zLmZpbmRPbmUoe19pZDogb3B0SW5JZH0pO1xuICAgIGxvZ0NvbmZpcm0oJ29wdC1pbiBmb3VuZDonLG9wdEluKTtcbiAgICBpZihvcHRJbi5jb25maXJtYXRpb25Ub2tlbiAhPT0gdW5kZWZpbmVkKSByZXR1cm47XG5cbiAgICBjb25zdCB0b2tlbiA9IGdlbmVyYXRlRG9pVG9rZW4oe2lkOiBvcHRJbi5faWR9KTtcbiAgICBsb2dDb25maXJtKCdnZW5lcmF0ZWQgY29uZmlybWF0aW9uVG9rZW46Jyx0b2tlbik7XG4gICAgY29uc3QgY29uZmlybWF0aW9uSGFzaCA9IGdlbmVyYXRlRG9pSGFzaCh7aWQ6IG9wdEluLl9pZCwgdG9rZW46IHRva2VuLCByZWRpcmVjdDogcmVzcG9uc2VEYXRhLmRhdGEucmVkaXJlY3R9KTtcbiAgICBsb2dDb25maXJtKCdnZW5lcmF0ZWQgY29uZmlybWF0aW9uSGFzaDonLGNvbmZpcm1hdGlvbkhhc2gpO1xuICAgIGNvbnN0IGNvbmZpcm1hdGlvblVybCA9IGdldFVybCgpK0FQSV9QQVRIK1ZFUlNJT04rXCIvXCIrRE9JX0NPTkZJUk1BVElPTl9ST1VURStcIi9cIitlbmNvZGVVUklDb21wb25lbnQoY29uZmlybWF0aW9uSGFzaCk7XG4gICAgbG9nQ29uZmlybSgnY29uZmlybWF0aW9uVXJsOicrY29uZmlybWF0aW9uVXJsKTtcblxuICAgIGNvbnN0IHRlbXBsYXRlID0gcGFyc2VUZW1wbGF0ZSh7dGVtcGxhdGU6IHJlc3BvbnNlRGF0YS5kYXRhLmNvbnRlbnQsIGRhdGE6IHtcbiAgICAgIGNvbmZpcm1hdGlvbl91cmw6IGNvbmZpcm1hdGlvblVybFxuICAgIH19KTtcblxuICAgIC8vbG9nQ29uZmlybSgnd2UgYXJlIHVzaW5nIHRoaXMgdGVtcGxhdGU6Jyx0ZW1wbGF0ZSk7XG5cbiAgICBsb2dDb25maXJtKCdzZW5kaW5nIGVtYWlsIHRvIHBldGVyIGZvciBjb25maXJtYXRpb24gb3ZlciBib2JzIGRBcHAnKTtcbiAgICBhZGRTZW5kTWFpbEpvYih7XG4gICAgICB0bzogcmVzcG9uc2VEYXRhLmRhdGEucmVjaXBpZW50LFxuICAgICAgc3ViamVjdDogcmVzcG9uc2VEYXRhLmRhdGEuc3ViamVjdCxcbiAgICAgIG1lc3NhZ2U6IHRlbXBsYXRlLFxuICAgICAgcmV0dXJuUGF0aDogcmVzcG9uc2VEYXRhLmRhdGEucmV0dXJuUGF0aFxuICAgIH0pO1xuICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdkYXBwcy5mZXRjaERvaU1haWxEYXRhLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGZldGNoRG9pTWFpbERhdGE7XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcbmltcG9ydCB7IE9wdElucyB9IGZyb20gJy4uLy4uLy4uL2FwaS9vcHQtaW5zL29wdC1pbnMuanMnO1xuaW1wb3J0IHsgUmVjaXBpZW50cyB9IGZyb20gJy4uLy4uLy4uL2FwaS9yZWNpcGllbnRzL3JlY2lwaWVudHMuanMnO1xuaW1wb3J0IGdldE9wdEluUHJvdmlkZXIgZnJvbSAnLi4vZG5zL2dldF9vcHQtaW4tcHJvdmlkZXIuanMnO1xuaW1wb3J0IGdldE9wdEluS2V5IGZyb20gJy4uL2Rucy9nZXRfb3B0LWluLWtleS5qcyc7XG5pbXBvcnQgdmVyaWZ5U2lnbmF0dXJlIGZyb20gJy4uL2RvaWNoYWluL3ZlcmlmeV9zaWduYXR1cmUuanMnO1xuaW1wb3J0IHsgZ2V0SHR0cEdFVCB9IGZyb20gJy4uLy4uLy4uLy4uL3NlcnZlci9hcGkvaHR0cC5qcyc7XG5pbXBvcnQgeyBET0lfTUFJTF9GRVRDSF9VUkwgfSBmcm9tICcuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9lbWFpbC1jb25maWd1cmF0aW9uLmpzJztcbmltcG9ydCB7IGxvZ1NlbmQgfSBmcm9tIFwiLi4vLi4vLi4vc3RhcnR1cC9zZXJ2ZXIvbG9nLWNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IEFjY291bnRzIH0gZnJvbSAnbWV0ZW9yL2FjY291bnRzLWJhc2UnXG5cbmNvbnN0IEdldERvaU1haWxEYXRhU2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIG5hbWVfaWQ6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfSxcbiAgc2lnbmF0dXJlOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH1cbn0pO1xuXG5jb25zdCB1c2VyUHJvZmlsZVNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICBzdWJqZWN0OiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIG9wdGlvbmFsOnRydWVcbiAgfSxcbiAgcmVkaXJlY3Q6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgcmVnRXg6IFwiQChodHRwcz98ZnRwKTovLygtXFxcXC4pPyhbXlxcXFxzLz9cXFxcLiMtXStcXFxcLj8pKygvW15cXFxcc10qKT8kQFwiLFxuICAgIG9wdGlvbmFsOnRydWVcbiAgfSxcbiAgcmV0dXJuUGF0aDoge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICByZWdFeDogU2ltcGxlU2NoZW1hLlJlZ0V4LkVtYWlsLFxuICAgIG9wdGlvbmFsOnRydWVcbiAgfSxcbiAgdGVtcGxhdGVVUkw6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgcmVnRXg6IFwiQChodHRwcz98ZnRwKTovLygtXFxcXC4pPyhbXlxcXFxzLz9cXFxcLiMtXStcXFxcLj8pKygvW15cXFxcc10qKT8kQFwiLFxuICAgIG9wdGlvbmFsOnRydWVcbiAgfVxufSk7XG5cbmNvbnN0IGdldERvaU1haWxEYXRhID0gKGRhdGEpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBvdXJEYXRhID0gZGF0YTtcbiAgICBHZXREb2lNYWlsRGF0YVNjaGVtYS52YWxpZGF0ZShvdXJEYXRhKTtcbiAgICBjb25zdCBvcHRJbiA9IE9wdElucy5maW5kT25lKHtuYW1lSWQ6IG91ckRhdGEubmFtZV9pZH0pO1xuICAgIGlmKG9wdEluID09PSB1bmRlZmluZWQpIHRocm93IFwiT3B0LUluIHdpdGggbmFtZV9pZDogXCIrb3VyRGF0YS5uYW1lX2lkK1wiIG5vdCBmb3VuZFwiO1xuICAgIGxvZ1NlbmQoJ09wdC1JbiBmb3VuZCcsb3B0SW4pO1xuXG4gICAgY29uc3QgcmVjaXBpZW50ID0gUmVjaXBpZW50cy5maW5kT25lKHtfaWQ6IG9wdEluLnJlY2lwaWVudH0pO1xuICAgIGlmKHJlY2lwaWVudCA9PT0gdW5kZWZpbmVkKSB0aHJvdyBcIlJlY2lwaWVudCBub3QgZm91bmRcIjtcbiAgICBsb2dTZW5kKCdSZWNpcGllbnQgZm91bmQnLCByZWNpcGllbnQpO1xuXG4gICAgY29uc3QgcGFydHMgPSByZWNpcGllbnQuZW1haWwuc3BsaXQoXCJAXCIpO1xuICAgIGNvbnN0IGRvbWFpbiA9IHBhcnRzW3BhcnRzLmxlbmd0aC0xXTtcblxuICAgIGxldCBwdWJsaWNLZXkgPSBnZXRPcHRJbktleSh7IGRvbWFpbjogZG9tYWlufSk7XG5cbiAgICBpZighcHVibGljS2V5KXtcbiAgICAgIGNvbnN0IHByb3ZpZGVyID0gZ2V0T3B0SW5Qcm92aWRlcih7ZG9tYWluOiBvdXJEYXRhLmRvbWFpbiB9KTtcbiAgICAgIGxvZ1NlbmQoXCJ1c2luZyBkb2ljaGFpbiBwcm92aWRlciBpbnN0ZWFkIG9mIGRpcmVjdGx5IGNvbmZpZ3VyZWQgcHVibGljS2V5OlwiLCB7IHByb3ZpZGVyOiBwcm92aWRlciB9KTtcbiAgICAgIHB1YmxpY0tleSA9IGdldE9wdEluS2V5KHsgZG9tYWluOiBwcm92aWRlcn0pOyAvL2dldCBwdWJsaWMga2V5IGZyb20gcHJvdmlkZXIgb3IgZmFsbGJhY2sgaWYgcHVibGlja2V5IHdhcyBub3Qgc2V0IGluIGRuc1xuICAgIH1cblxuICAgIGxvZ1NlbmQoJ3F1ZXJpZWQgZGF0YTogKHBhcnRzLCBkb21haW4sIHByb3ZpZGVyLCBwdWJsaWNLZXkpJywgJygnK3BhcnRzKycsJytkb21haW4rJywnK3B1YmxpY0tleSsnKScpO1xuXG4gICAgLy9UT0RPOiBPbmx5IGFsbG93IGFjY2VzcyBvbmUgdGltZVxuICAgIC8vIFBvc3NpYmxlIHNvbHV0aW9uOlxuICAgIC8vIDEuIFByb3ZpZGVyIChjb25maXJtIGRBcHApIHJlcXVlc3QgdGhlIGRhdGFcbiAgICAvLyAyLiBQcm92aWRlciByZWNlaXZlIHRoZSBkYXRhXG4gICAgLy8gMy4gUHJvdmlkZXIgc2VuZHMgY29uZmlybWF0aW9uIFwiSSBnb3QgdGhlIGRhdGFcIlxuICAgIC8vIDQuIFNlbmQgZEFwcCBsb2NrIHRoZSBkYXRhIGZvciB0aGlzIG9wdCBpblxuICAgIGxvZ1NlbmQoJ3ZlcmlmeWluZyBzaWduYXR1cmUuLi4nKTtcbiAgICBpZighdmVyaWZ5U2lnbmF0dXJlKHtwdWJsaWNLZXk6IHB1YmxpY0tleSwgZGF0YTogb3VyRGF0YS5uYW1lX2lkLCBzaWduYXR1cmU6IG91ckRhdGEuc2lnbmF0dXJlfSkpIHtcbiAgICAgIHRocm93IFwic2lnbmF0dXJlIGluY29ycmVjdCAtIGFjY2VzcyBkZW5pZWRcIjtcbiAgICB9XG4gICAgXG4gICAgbG9nU2VuZCgnc2lnbmF0dXJlIHZlcmlmaWVkJyk7XG5cbiAgICAvL1RPRE86IFF1ZXJ5IGZvciBsYW5ndWFnZVxuICAgIGxldCBkb2lNYWlsRGF0YTtcbiAgICB0cnkge1xuXG4gICAgICBkb2lNYWlsRGF0YSA9IGdldEh0dHBHRVQoRE9JX01BSUxfRkVUQ0hfVVJMLCBcIlwiKS5kYXRhO1xuICAgICAgbGV0IGRlZmF1bHRSZXR1cm5EYXRhID0ge1xuICAgICAgICBcInJlY2lwaWVudFwiOiByZWNpcGllbnQuZW1haWwsXG4gICAgICAgIFwiY29udGVudFwiOiBkb2lNYWlsRGF0YS5kYXRhLmNvbnRlbnQsXG4gICAgICAgIFwicmVkaXJlY3RcIjogZG9pTWFpbERhdGEuZGF0YS5yZWRpcmVjdCxcbiAgICAgICAgXCJzdWJqZWN0XCI6IGRvaU1haWxEYXRhLmRhdGEuc3ViamVjdCxcbiAgICAgICAgXCJyZXR1cm5QYXRoXCI6IGRvaU1haWxEYXRhLmRhdGEucmV0dXJuUGF0aFxuICAgICAgfVxuXG4gICAgbGV0IHJldHVybkRhdGEgPSBkZWZhdWx0UmV0dXJuRGF0YTtcblxuICAgIHRyeXtcbiAgICAgIGxldCBvd25lciA9IEFjY291bnRzLnVzZXJzLmZpbmRPbmUoe19pZDogb3B0SW4ub3duZXJJZH0pO1xuICAgICAgbGV0IG1haWxUZW1wbGF0ZSA9IG93bmVyLnByb2ZpbGUubWFpbFRlbXBsYXRlO1xuICAgICAgdXNlclByb2ZpbGVTY2hlbWEudmFsaWRhdGUobWFpbFRlbXBsYXRlKTtcblxuICAgICAgcmV0dXJuRGF0YVtcInJlZGlyZWN0XCJdID0gbWFpbFRlbXBsYXRlW1wicmVkaXJlY3RcIl0gfHwgZGVmYXVsdFJldHVybkRhdGFbXCJyZWRpcmVjdFwiXTtcbiAgICAgIHJldHVybkRhdGFbXCJzdWJqZWN0XCJdID0gbWFpbFRlbXBsYXRlW1wic3ViamVjdFwiXSB8fCBkZWZhdWx0UmV0dXJuRGF0YVtcInN1YmplY3RcIl07XG4gICAgICByZXR1cm5EYXRhW1wicmV0dXJuUGF0aFwiXSA9IG1haWxUZW1wbGF0ZVtcInJldHVyblBhdGhcIl0gfHwgZGVmYXVsdFJldHVybkRhdGFbXCJyZXR1cm5QYXRoXCJdO1xuICAgICAgcmV0dXJuRGF0YVtcImNvbnRlbnRcIl0gPSBtYWlsVGVtcGxhdGVbXCJ0ZW1wbGF0ZVVSTFwiXSA/IChnZXRIdHRwR0VUKG1haWxUZW1wbGF0ZVtcInRlbXBsYXRlVVJMXCJdLCBcIlwiKS5jb250ZW50IHx8IGRlZmF1bHRSZXR1cm5EYXRhW1wiY29udGVudFwiXSkgOiBkZWZhdWx0UmV0dXJuRGF0YVtcImNvbnRlbnRcIl07XG4gICAgICBcbiAgICB9XG4gICAgY2F0Y2goZXJyb3IpIHtcbiAgICAgIHJldHVybkRhdGE9ZGVmYXVsdFJldHVybkRhdGE7XG4gICAgfVxuXG4gICAgICBsb2dTZW5kKCdkb2lNYWlsRGF0YSBhbmQgdXJsOicsIERPSV9NQUlMX0ZFVENIX1VSTCwgcmV0dXJuRGF0YSk7XG5cbiAgICAgIHJldHVybiByZXR1cm5EYXRhXG5cbiAgICB9IGNhdGNoKGVycm9yKSB7XG4gICAgICB0aHJvdyBcIkVycm9yIHdoaWxlIGZldGNoaW5nIG1haWwgY29udGVudDogXCIrZXJyb3I7XG4gICAgfVxuXG4gIH0gY2F0Y2goZXhjZXB0aW9uKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZGFwcHMuZ2V0RG9pTWFpbERhdGEuZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgZ2V0RG9pTWFpbERhdGE7XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcbmltcG9ydCB7IHJlc29sdmVUeHQgfSBmcm9tICcuLi8uLi8uLi8uLi9zZXJ2ZXIvYXBpL2Rucy5qcyc7XG5pbXBvcnQgeyBGQUxMQkFDS19QUk9WSURFUiB9IGZyb20gJy4uLy4uLy4uL3N0YXJ0dXAvc2VydmVyL2Rucy1jb25maWd1cmF0aW9uLmpzJztcbmltcG9ydCB7aXNSZWd0ZXN0LCBpc1Rlc3RuZXR9IGZyb20gXCIuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9kYXBwLWNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7bG9nU2VuZH0gZnJvbSBcIi4uLy4uLy4uL3N0YXJ0dXAvc2VydmVyL2xvZy1jb25maWd1cmF0aW9uXCI7XG5cbmNvbnN0IE9QVF9JTl9LRVkgPSBcImRvaWNoYWluLW9wdC1pbi1rZXlcIjtcbmNvbnN0IE9QVF9JTl9LRVlfVEVTVE5FVCA9IFwiZG9pY2hhaW4tdGVzdG5ldC1vcHQtaW4ta2V5XCI7XG5cbmNvbnN0IEdldE9wdEluS2V5U2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIGRvbWFpbjoge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9XG59KTtcblxuXG5jb25zdCBnZXRPcHRJbktleSA9IChkYXRhKSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3Qgb3VyRGF0YSA9IGRhdGE7XG4gICAgR2V0T3B0SW5LZXlTY2hlbWEudmFsaWRhdGUob3VyRGF0YSk7XG5cbiAgICBsZXQgb3VyT1BUX0lOX0tFWT1PUFRfSU5fS0VZO1xuXG4gICAgaWYoaXNSZWd0ZXN0KCkgfHwgaXNUZXN0bmV0KCkpe1xuICAgICAgICBvdXJPUFRfSU5fS0VZID0gT1BUX0lOX0tFWV9URVNUTkVUO1xuICAgICAgICBsb2dTZW5kKCdVc2luZyBSZWdUZXN0OicraXNSZWd0ZXN0KCkrXCIgVGVzdG5ldDogXCIraXNUZXN0bmV0KCkrXCIgb3VyT1BUX0lOX0tFWVwiLG91ck9QVF9JTl9LRVkpO1xuICAgIH1cbiAgICBjb25zdCBrZXkgPSByZXNvbHZlVHh0KG91ck9QVF9JTl9LRVksIG91ckRhdGEuZG9tYWluKTtcbiAgICBsb2dTZW5kKCdETlMgVFhUIGNvbmZpZ3VyZWQgcHVibGljIGtleSBvZiByZWNpcGllbnQgZW1haWwgZG9tYWluIGFuZCBjb25maXJtYXRpb24gZGFwcCcse2ZvdW5kS2V5OmtleSwgZG9tYWluOm91ckRhdGEuZG9tYWluLCBkbnNrZXk6b3VyT1BUX0lOX0tFWX0pO1xuXG4gICAgaWYoa2V5ID09PSB1bmRlZmluZWQpIHJldHVybiB1c2VGYWxsYmFjayhvdXJEYXRhLmRvbWFpbik7XG4gICAgcmV0dXJuIGtleTtcbiAgfSBjYXRjaCAoZXhjZXB0aW9uKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZG5zLmdldE9wdEluS2V5LmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH1cbn07XG5cbmNvbnN0IHVzZUZhbGxiYWNrID0gKGRvbWFpbikgPT4ge1xuICBpZihkb21haW4gPT09IEZBTExCQUNLX1BST1ZJREVSKSB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFwiRmFsbGJhY2sgaGFzIG5vIGtleSBkZWZpbmVkIVwiKTtcbiAgICBsb2dTZW5kKFwiS2V5IG5vdCBkZWZpbmVkLiBVc2luZyBmYWxsYmFjazogXCIsRkFMTEJBQ0tfUFJPVklERVIpO1xuICByZXR1cm4gZ2V0T3B0SW5LZXkoe2RvbWFpbjogRkFMTEJBQ0tfUFJPVklERVJ9KTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGdldE9wdEluS2V5O1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XG5pbXBvcnQgeyByZXNvbHZlVHh0IH0gZnJvbSAnLi4vLi4vLi4vLi4vc2VydmVyL2FwaS9kbnMuanMnO1xuaW1wb3J0IHsgRkFMTEJBQ0tfUFJPVklERVIgfSBmcm9tICcuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9kbnMtY29uZmlndXJhdGlvbi5qcyc7XG5pbXBvcnQge2xvZ1NlbmR9IGZyb20gXCIuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9sb2ctY29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHtpc1JlZ3Rlc3QsIGlzVGVzdG5ldH0gZnJvbSBcIi4uLy4uLy4uL3N0YXJ0dXAvc2VydmVyL2RhcHAtY29uZmlndXJhdGlvblwiO1xuXG5jb25zdCBQUk9WSURFUl9LRVkgPSBcImRvaWNoYWluLW9wdC1pbi1wcm92aWRlclwiO1xuY29uc3QgUFJPVklERVJfS0VZX1RFU1RORVQgPSBcImRvaWNoYWluLXRlc3RuZXQtb3B0LWluLXByb3ZpZGVyXCI7XG5cbmNvbnN0IEdldE9wdEluUHJvdmlkZXJTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgZG9tYWluOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH1cbn0pO1xuXG5cbmNvbnN0IGdldE9wdEluUHJvdmlkZXIgPSAoZGF0YSkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IG91ckRhdGEgPSBkYXRhO1xuICAgIEdldE9wdEluUHJvdmlkZXJTY2hlbWEudmFsaWRhdGUob3VyRGF0YSk7XG5cbiAgICBsZXQgb3VyUFJPVklERVJfS0VZPVBST1ZJREVSX0tFWTtcbiAgICBpZihpc1JlZ3Rlc3QoKSB8fCBpc1Rlc3RuZXQoKSl7XG4gICAgICAgIG91clBST1ZJREVSX0tFWSA9IFBST1ZJREVSX0tFWV9URVNUTkVUO1xuICAgICAgICBsb2dTZW5kKCdVc2luZyBSZWdUZXN0OicraXNSZWd0ZXN0KCkrXCIgOiBUZXN0bmV0OlwiK2lzVGVzdG5ldCgpK1wiIFBST1ZJREVSX0tFWVwiLHtwcm92aWRlcktleTpvdXJQUk9WSURFUl9LRVksIGRvbWFpbjpvdXJEYXRhLmRvbWFpbn0pO1xuICAgIH1cblxuICAgIGNvbnN0IHByb3ZpZGVyID0gcmVzb2x2ZVR4dChvdXJQUk9WSURFUl9LRVksIG91ckRhdGEuZG9tYWluKTtcbiAgICBpZihwcm92aWRlciA9PT0gdW5kZWZpbmVkKSByZXR1cm4gdXNlRmFsbGJhY2soKTtcblxuICAgIGxvZ1NlbmQoJ29wdC1pbi1wcm92aWRlciBmcm9tIGRucyAtIHNlcnZlciBvZiBtYWlsIHJlY2lwaWVudDogKFRYVCk6Jyxwcm92aWRlcik7XG4gICAgcmV0dXJuIHByb3ZpZGVyO1xuICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdkbnMuZ2V0T3B0SW5Qcm92aWRlci5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9XG59O1xuXG5jb25zdCB1c2VGYWxsYmFjayA9ICgpID0+IHtcbiAgbG9nU2VuZCgnUHJvdmlkZXIgbm90IGRlZmluZWQuIEZhbGxiYWNrICcrRkFMTEJBQ0tfUFJPVklERVIrJyBpcyB1c2VkJyk7XG4gIHJldHVybiBGQUxMQkFDS19QUk9WSURFUjtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGdldE9wdEluUHJvdmlkZXI7XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcbmltcG9ydCB7IENPTkZJUk1fQ0xJRU5ULCBDT05GSVJNX0FERFJFU1MgfSBmcm9tICcuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9kb2ljaGFpbi1jb25maWd1cmF0aW9uLmpzJztcbmltcG9ydCB7IGdldFdpZiB9IGZyb20gJy4uLy4uLy4uLy4uL3NlcnZlci9hcGkvZG9pY2hhaW4uanMnO1xuaW1wb3J0IHsgRG9pY2hhaW5FbnRyaWVzIH0gZnJvbSAnLi4vLi4vLi4vYXBpL2RvaWNoYWluL2VudHJpZXMuanMnO1xuaW1wb3J0IGFkZEZldGNoRG9pTWFpbERhdGFKb2IgZnJvbSAnLi4vam9icy9hZGRfZmV0Y2gtZG9pLW1haWwtZGF0YS5qcyc7XG5pbXBvcnQgZ2V0UHJpdmF0ZUtleUZyb21XaWYgZnJvbSAnLi9nZXRfcHJpdmF0ZS1rZXlfZnJvbV93aWYuanMnO1xuaW1wb3J0IGRlY3J5cHRNZXNzYWdlIGZyb20gJy4vZGVjcnlwdF9tZXNzYWdlLmpzJztcbmltcG9ydCB7bG9nQ29uZmlybSwgbG9nU2VuZH0gZnJvbSBcIi4uLy4uLy4uL3N0YXJ0dXAvc2VydmVyL2xvZy1jb25maWd1cmF0aW9uXCI7XG5cbmNvbnN0IEFkZERvaWNoYWluRW50cnlTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgbmFtZToge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9LFxuICB2YWx1ZToge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9LFxuICBhZGRyZXNzOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH0sXG4gIHR4SWQ6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfVxufSk7XG5cbi8qKlxuICogSW5zZXJ0c1xuICpcbiAqIEBwYXJhbSBlbnRyeVxuICogQHJldHVybnMgeyp9XG4gKi9cbmNvbnN0IGFkZERvaWNoYWluRW50cnkgPSAoZW50cnkpID0+IHtcbiAgdHJ5IHtcblxuICAgIGNvbnN0IG91ckVudHJ5ID0gZW50cnk7XG4gICAgbG9nQ29uZmlybSgnYWRkaW5nIERvaWNoYWluRW50cnkgb24gQm9iLi4uJyxvdXJFbnRyeS5uYW1lKTtcbiAgICBBZGREb2ljaGFpbkVudHJ5U2NoZW1hLnZhbGlkYXRlKG91ckVudHJ5KTtcblxuICAgIGNvbnN0IGV0eSA9IERvaWNoYWluRW50cmllcy5maW5kT25lKHtuYW1lOiBvdXJFbnRyeS5uYW1lfSk7XG4gICAgaWYoZXR5ICE9PSB1bmRlZmluZWQpe1xuICAgICAgICBsb2dTZW5kKCdyZXR1cm5pbmcgbG9jYWxseSBzYXZlZCBlbnRyeSB3aXRoIF9pZDonK2V0eS5faWQpO1xuICAgICAgICByZXR1cm4gZXR5Ll9pZDtcbiAgICB9XG5cbiAgICBjb25zdCB2YWx1ZSA9IEpTT04ucGFyc2Uob3VyRW50cnkudmFsdWUpO1xuICAgIC8vbG9nU2VuZChcInZhbHVlOlwiLHZhbHVlKTtcbiAgICBpZih2YWx1ZS5mcm9tID09PSB1bmRlZmluZWQpIHRocm93IFwiV3JvbmcgYmxvY2tjaGFpbiBlbnRyeVwiOyAvL1RPRE8gaWYgZnJvbSBpcyBtaXNzaW5nIGJ1dCB2YWx1ZSBpcyB0aGVyZSwgaXQgaXMgcHJvYmFibHkgYWxscmVhZHkgaGFuZGVsZWQgY29ycmVjdGx5IGFueXdheXMgdGhpcyBpcyBub3Qgc28gY29vbCBhcyBpdCBzZWVtcy5cbiAgICBjb25zdCB3aWYgPSBnZXRXaWYoQ09ORklSTV9DTElFTlQsIENPTkZJUk1fQUREUkVTUyk7XG4gICAgY29uc3QgcHJpdmF0ZUtleSA9IGdldFByaXZhdGVLZXlGcm9tV2lmKHt3aWY6IHdpZn0pO1xuICAgIGxvZ1NlbmQoJ2dvdCBwcml2YXRlIGtleSAod2lsbCBub3Qgc2hvdyBpdCBoZXJlKScpO1xuXG4gICAgY29uc3QgZG9tYWluID0gZGVjcnlwdE1lc3NhZ2Uoe3ByaXZhdGVLZXk6IHByaXZhdGVLZXksIG1lc3NhZ2U6IHZhbHVlLmZyb219KTtcbiAgICBsb2dTZW5kKCdkZWNyeXB0ZWQgbWVzc2FnZSBmcm9tIGRvbWFpbjogJyxkb21haW4pO1xuXG4gICAgY29uc3QgbmFtZVBvcyA9IG91ckVudHJ5Lm5hbWUuaW5kZXhPZignLScpOyAvL2lmIHRoaXMgaXMgbm90IGEgY28tcmVnaXN0cmF0aW9uIGZldGNoIG1haWwuXG4gICAgbG9nU2VuZCgnbmFtZVBvczonLG5hbWVQb3MpO1xuICAgIGNvbnN0IG1hc3RlckRvaSA9IChuYW1lUG9zIT0tMSk/b3VyRW50cnkubmFtZS5zdWJzdHJpbmcoMCxuYW1lUG9zKTp1bmRlZmluZWQ7XG4gICAgbG9nU2VuZCgnbWFzdGVyRG9pOicsbWFzdGVyRG9pKTtcbiAgICBjb25zdCBpbmRleCA9IG1hc3RlckRvaT9vdXJFbnRyeS5uYW1lLnN1YnN0cmluZyhuYW1lUG9zKzEpOnVuZGVmaW5lZDtcbiAgICBsb2dTZW5kKCdpbmRleDonLGluZGV4KTtcblxuICAgIGNvbnN0IGlkID0gRG9pY2hhaW5FbnRyaWVzLmluc2VydCh7XG4gICAgICAgIG5hbWU6IG91ckVudHJ5Lm5hbWUsXG4gICAgICAgIHZhbHVlOiBvdXJFbnRyeS52YWx1ZSxcbiAgICAgICAgYWRkcmVzczogb3VyRW50cnkuYWRkcmVzcyxcbiAgICAgICAgbWFzdGVyRG9pOiBtYXN0ZXJEb2ksXG4gICAgICAgIGluZGV4OiBpbmRleCxcbiAgICAgICAgdHhJZDogb3VyRW50cnkudHhJZCxcbiAgICAgICAgZXhwaXJlc0luOiBvdXJFbnRyeS5leHBpcmVzSW4sXG4gICAgICAgIGV4cGlyZWQ6IG91ckVudHJ5LmV4cGlyZWRcbiAgICB9KTtcblxuICAgIGxvZ1NlbmQoJ0RvaWNoYWluRW50cnkgYWRkZWQgb24gQm9iOicsIHtpZDppZCxuYW1lOm91ckVudHJ5Lm5hbWUsbWFzdGVyRG9pOm1hc3RlckRvaSxpbmRleDppbmRleH0pO1xuXG4gICAgaWYoIW1hc3RlckRvaSl7XG4gICAgICAgIGFkZEZldGNoRG9pTWFpbERhdGFKb2Ioe1xuICAgICAgICAgICAgbmFtZTogb3VyRW50cnkubmFtZSxcbiAgICAgICAgICAgIGRvbWFpbjogZG9tYWluXG4gICAgICAgIH0pO1xuICAgICAgICBsb2dTZW5kKCdOZXcgZW50cnkgYWRkZWQ6IFxcbicrXG4gICAgICAgICAgICAnTmFtZUlkPScrb3VyRW50cnkubmFtZStcIlxcblwiK1xuICAgICAgICAgICAgJ0FkZHJlc3M9JytvdXJFbnRyeS5hZGRyZXNzK1wiXFxuXCIrXG4gICAgICAgICAgICAnVHhJZD0nK291ckVudHJ5LnR4SWQrXCJcXG5cIitcbiAgICAgICAgICAgICdWYWx1ZT0nK291ckVudHJ5LnZhbHVlKTtcblxuICAgIH1lbHNle1xuICAgICAgICBsb2dTZW5kKCdUaGlzIHRyYW5zYWN0aW9uIGJlbG9uZ3MgdG8gY28tcmVnaXN0cmF0aW9uJywgbWFzdGVyRG9pKTtcbiAgICB9XG5cbiAgICByZXR1cm4gaWQ7XG4gIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2RvaWNoYWluLmFkZEVudHJ5QW5kRmV0Y2hEYXRhLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGFkZERvaWNoYWluRW50cnk7XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCB7IGxpc3RTaW5jZUJsb2NrLCBuYW1lU2hvdywgZ2V0UmF3VHJhbnNhY3Rpb259IGZyb20gJy4uLy4uLy4uLy4uL3NlcnZlci9hcGkvZG9pY2hhaW4uanMnO1xuaW1wb3J0IHsgQ09ORklSTV9DTElFTlQsIENPTkZJUk1fQUREUkVTUyB9IGZyb20gJy4uLy4uLy4uL3N0YXJ0dXAvc2VydmVyL2RvaWNoYWluLWNvbmZpZ3VyYXRpb24uanMnO1xuaW1wb3J0IGFkZERvaWNoYWluRW50cnkgZnJvbSAnLi9hZGRfZW50cnlfYW5kX2ZldGNoX2RhdGEuanMnXG5pbXBvcnQgeyBNZXRhIH0gZnJvbSAnLi4vLi4vLi4vYXBpL21ldGEvbWV0YS5qcyc7XG5pbXBvcnQgYWRkT3JVcGRhdGVNZXRhIGZyb20gJy4uL21ldGEvYWRkT3JVcGRhdGUuanMnO1xuaW1wb3J0IHtsb2dDb25maXJtfSBmcm9tIFwiLi4vLi4vLi4vc3RhcnR1cC9zZXJ2ZXIvbG9nLWNvbmZpZ3VyYXRpb25cIjtcblxuY29uc3QgVFhfTkFNRV9TVEFSVCA9IFwiZS9cIjtcbmNvbnN0IExBU1RfQ0hFQ0tFRF9CTE9DS19LRVkgPSBcImxhc3RDaGVja2VkQmxvY2tcIjtcblxuY29uc3QgY2hlY2tOZXdUcmFuc2FjdGlvbiA9ICh0eGlkLCBqb2IpID0+IHtcbiAgdHJ5IHtcblxuICAgICAgaWYoIXR4aWQpe1xuICAgICAgICAgIGxvZ0NvbmZpcm0oXCJjaGVja05ld1RyYW5zYWN0aW9uIHRyaWdnZXJlZCB3aGVuIHN0YXJ0aW5nIG5vZGUgLSBjaGVja2luZyBhbGwgY29uZmlybWVkIGJsb2NrcyBzaW5jZSBsYXN0IGNoZWNrIGZvciBkb2ljaGFpbiBhZGRyZXNzXCIsQ09ORklSTV9BRERSRVNTKTtcblxuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIHZhciBsYXN0Q2hlY2tlZEJsb2NrID0gTWV0YS5maW5kT25lKHtrZXk6IExBU1RfQ0hFQ0tFRF9CTE9DS19LRVl9KTtcbiAgICAgICAgICAgICAgaWYobGFzdENoZWNrZWRCbG9jayAhPT0gdW5kZWZpbmVkKSBsYXN0Q2hlY2tlZEJsb2NrID0gbGFzdENoZWNrZWRCbG9jay52YWx1ZTtcbiAgICAgICAgICAgICAgbG9nQ29uZmlybShcImxhc3RDaGVja2VkQmxvY2tcIixsYXN0Q2hlY2tlZEJsb2NrKTtcbiAgICAgICAgICAgICAgY29uc3QgcmV0ID0gbGlzdFNpbmNlQmxvY2soQ09ORklSTV9DTElFTlQsIGxhc3RDaGVja2VkQmxvY2spO1xuICAgICAgICAgICAgICBpZihyZXQgPT09IHVuZGVmaW5lZCB8fCByZXQudHJhbnNhY3Rpb25zID09PSB1bmRlZmluZWQpIHJldHVybjtcblxuICAgICAgICAgICAgICBjb25zdCB0eHMgPSByZXQudHJhbnNhY3Rpb25zO1xuICAgICAgICAgICAgICBsYXN0Q2hlY2tlZEJsb2NrID0gcmV0Lmxhc3RibG9jaztcbiAgICAgICAgICAgICAgaWYoIXJldCB8fCAhdHhzIHx8ICF0eHMubGVuZ3RoPT09MCl7XG4gICAgICAgICAgICAgICAgICBsb2dDb25maXJtKFwidHJhbnNhY3Rpb25zIGRvIG5vdCBjb250YWluIG5hbWVPcCB0cmFuc2FjdGlvbiBkZXRhaWxzIG9yIHRyYW5zYWN0aW9uIG5vdCBmb3VuZC5cIiwgbGFzdENoZWNrZWRCbG9jayk7XG4gICAgICAgICAgICAgICAgICBhZGRPclVwZGF0ZU1ldGEoe2tleTogTEFTVF9DSEVDS0VEX0JMT0NLX0tFWSwgdmFsdWU6IGxhc3RDaGVja2VkQmxvY2t9KTtcbiAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIGxvZ0NvbmZpcm0oXCJsaXN0U2luY2VCbG9ja1wiLHJldCk7XG5cbiAgICAgICAgICAgICAgY29uc3QgYWRkcmVzc1R4cyA9IHR4cy5maWx0ZXIodHggPT5cbiAgICAgICAgICAgICAgICAgIHR4LmFkZHJlc3MgPT09IENPTkZJUk1fQUREUkVTU1xuICAgICAgICAgICAgICAgICAgJiYgdHgubmFtZSAhPT0gdW5kZWZpbmVkIC8vc2luY2UgbmFtZV9zaG93IGNhbm5vdCBiZSByZWFkIHdpdGhvdXQgY29uZmlybWF0aW9uc1xuICAgICAgICAgICAgICAgICAgJiYgdHgubmFtZS5zdGFydHNXaXRoKFwiZG9pOiBcIitUWF9OQU1FX1NUQVJUKSAgLy9oZXJlICdkb2k6IGUveHh4eCcgaXMgYWxyZWFkeSB3cml0dGVuIGluIHRoZSBibG9ja1xuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICBhZGRyZXNzVHhzLmZvckVhY2godHggPT4ge1xuICAgICAgICAgICAgICAgICAgbG9nQ29uZmlybShcInR4OlwiLHR4KTtcbiAgICAgICAgICAgICAgICAgIHZhciB0eE5hbWUgPSB0eC5uYW1lLnN1YnN0cmluZygoXCJkb2k6IFwiK1RYX05BTUVfU1RBUlQpLmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgICBsb2dDb25maXJtKFwiZXhjdXRpbmcgbmFtZV9zaG93IGluIG9yZGVyIHRvIGdldCB2YWx1ZSBvZiBuYW1lSWQ6XCIsIHR4TmFtZSk7XG4gICAgICAgICAgICAgICAgICBjb25zdCBldHkgPSBuYW1lU2hvdyhDT05GSVJNX0NMSUVOVCwgdHhOYW1lKTtcbiAgICAgICAgICAgICAgICAgIGxvZ0NvbmZpcm0oXCJuYW1lU2hvdzogdmFsdWVcIixldHkpO1xuICAgICAgICAgICAgICAgICAgaWYoIWV0eSl7XG4gICAgICAgICAgICAgICAgICAgICAgbG9nQ29uZmlybShcImNvdWxkbid0IGZpbmQgbmFtZSAtIG9idmlvdXNseSBub3QgKHlldD8hKSBjb25maXJtZWQgaW4gYmxvY2tjaGFpbjpcIiwgZXR5KTtcbiAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICBhZGRUeCh0eE5hbWUsIGV0eS52YWx1ZSx0eC5hZGRyZXNzLHR4LnR4aWQpOyAvL1RPRE8gZXR5LnZhbHVlLmZyb20gaXMgbWF5YmUgTk9UIGV4aXN0aW5nIGJlY2F1c2Ugb2YgdGhpcyBpdHMgIChtYXliZSkgb250IHdvcmtpbmcuLi5cbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIGFkZE9yVXBkYXRlTWV0YSh7a2V5OiBMQVNUX0NIRUNLRURfQkxPQ0tfS0VZLCB2YWx1ZTogbGFzdENoZWNrZWRCbG9ja30pO1xuICAgICAgICAgICAgICBsb2dDb25maXJtKFwiVHJhbnNhY3Rpb25zIHVwZGF0ZWQgLSBsYXN0Q2hlY2tlZEJsb2NrOlwiLGxhc3RDaGVja2VkQmxvY2spO1xuICAgICAgICAgICAgICBqb2IuZG9uZSgpO1xuICAgICAgICAgIH0gY2F0Y2goZXhjZXB0aW9uKSB7XG4gICAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ25hbWVjb2luLmNoZWNrTmV3VHJhbnNhY3Rpb25zLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gICAgICAgICAgfVxuXG4gICAgICB9ZWxzZXtcbiAgICAgICAgICBsb2dDb25maXJtKFwidHhpZDogXCIrdHhpZCtcIiB3YXMgdHJpZ2dlcmVkIGJ5IHdhbGxldG5vdGlmeSBmb3IgYWRkcmVzczpcIixDT05GSVJNX0FERFJFU1MpO1xuXG4gICAgICAgICAgY29uc3QgcmV0ID0gZ2V0UmF3VHJhbnNhY3Rpb24oQ09ORklSTV9DTElFTlQsIHR4aWQpO1xuICAgICAgICAgIGNvbnN0IHR4cyA9IHJldC52b3V0O1xuXG4gICAgICAgICAgaWYoIXJldCB8fCAhdHhzIHx8ICF0eHMubGVuZ3RoPT09MCl7XG4gICAgICAgICAgICAgIGxvZ0NvbmZpcm0oXCJ0eGlkIFwiK3R4aWQrJyBkb2VzIG5vdCBjb250YWluIHRyYW5zYWN0aW9uIGRldGFpbHMgb3IgdHJhbnNhY3Rpb24gbm90IGZvdW5kLicpO1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAvLyBsb2dDb25maXJtKCdub3cgY2hlY2tpbmcgcmF3IHRyYW5zYWN0aW9ucyB3aXRoIGZpbHRlcjonLHR4cyk7XG5cbiAgICAgICAgICBjb25zdCBhZGRyZXNzVHhzID0gdHhzLmZpbHRlcih0eCA9PlxuICAgICAgICAgICAgICB0eC5zY3JpcHRQdWJLZXkgIT09IHVuZGVmaW5lZFxuICAgICAgICAgICAgICAmJiB0eC5zY3JpcHRQdWJLZXkubmFtZU9wICE9PSB1bmRlZmluZWRcbiAgICAgICAgICAgICAgJiYgdHguc2NyaXB0UHViS2V5Lm5hbWVPcC5vcCA9PT0gXCJuYW1lX2RvaVwiXG4gICAgICAgICAgICAvLyAgJiYgdHguc2NyaXB0UHViS2V5LmFkZHJlc3Nlc1swXSA9PT0gQ09ORklSTV9BRERSRVNTIC8vb25seSBvd24gdHJhbnNhY3Rpb24gc2hvdWxkIGFycml2ZSBoZXJlLiAtIHNvIGNoZWNrIG9uIG93biBhZGRyZXNzIHVubmVjY2VzYXJ5XG4gICAgICAgICAgICAgICYmIHR4LnNjcmlwdFB1YktleS5uYW1lT3AubmFtZSAhPT0gdW5kZWZpbmVkXG4gICAgICAgICAgICAgICYmIHR4LnNjcmlwdFB1YktleS5uYW1lT3AubmFtZS5zdGFydHNXaXRoKFRYX05BTUVfU1RBUlQpXG4gICAgICAgICAgKTtcblxuICAgICAgICAgIC8vbG9nQ29uZmlybShcImZvdW5kIG5hbWVfb3AgdHJhbnNhY3Rpb25zOlwiLCBhZGRyZXNzVHhzKTtcblxuICAgICAgICAgIGFkZHJlc3NUeHMuZm9yRWFjaCh0eCA9PiB7XG4gICAgICAgICAgICAgIGFkZFR4KHR4LnNjcmlwdFB1YktleS5uYW1lT3AubmFtZSwgdHguc2NyaXB0UHViS2V5Lm5hbWVPcC52YWx1ZSx0eC5zY3JpcHRQdWJLZXkuYWRkcmVzc2VzWzBdLHR4aWQpO1xuICAgICAgICAgIH0pO1xuICAgICAgfVxuXG5cblxuICB9IGNhdGNoKGV4Y2VwdGlvbikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2RvaWNoYWluLmNoZWNrTmV3VHJhbnNhY3Rpb25zLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59O1xuXG5cbmZ1bmN0aW9uIGFkZFR4KG5hbWUsIHZhbHVlLCBhZGRyZXNzLCB0eGlkKSB7XG4gICAgY29uc3QgdHhOYW1lID0gbmFtZS5zdWJzdHJpbmcoVFhfTkFNRV9TVEFSVC5sZW5ndGgpO1xuXG4gICAgYWRkRG9pY2hhaW5FbnRyeSh7XG4gICAgICAgIG5hbWU6IHR4TmFtZSxcbiAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICBhZGRyZXNzOiBhZGRyZXNzLFxuICAgICAgICB0eElkOiB0eGlkXG4gICAgfSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNoZWNrTmV3VHJhbnNhY3Rpb247XG5cbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tICdzaW1wbC1zY2hlbWEnO1xuaW1wb3J0IGNyeXB0byBmcm9tICdjcnlwdG8nO1xuaW1wb3J0IGVjaWVzIGZyb20gJ3N0YW5kYXJkLWVjaWVzJztcblxuY29uc3QgRGVjcnlwdE1lc3NhZ2VTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgcHJpdmF0ZUtleToge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9LFxuICBtZXNzYWdlOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH1cbn0pO1xuXG5jb25zdCBkZWNyeXB0TWVzc2FnZSA9IChkYXRhKSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3Qgb3VyRGF0YSA9IGRhdGE7XG4gICAgRGVjcnlwdE1lc3NhZ2VTY2hlbWEudmFsaWRhdGUob3VyRGF0YSk7XG4gICAgY29uc3QgcHJpdmF0ZUtleSA9IEJ1ZmZlci5mcm9tKG91ckRhdGEucHJpdmF0ZUtleSwgJ2hleCcpO1xuICAgIGNvbnN0IGVjZGggPSBjcnlwdG8uY3JlYXRlRUNESCgnc2VjcDI1NmsxJyk7XG4gICAgZWNkaC5zZXRQcml2YXRlS2V5KHByaXZhdGVLZXkpO1xuICAgIGNvbnN0IG1lc3NhZ2UgPSBCdWZmZXIuZnJvbShvdXJEYXRhLm1lc3NhZ2UsICdoZXgnKTtcbiAgICByZXR1cm4gZWNpZXMuZGVjcnlwdChlY2RoLCBtZXNzYWdlKS50b1N0cmluZygndXRmOCcpO1xuICB9IGNhdGNoKGV4Y2VwdGlvbikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2RvaWNoYWluLmRlY3J5cHRNZXNzYWdlLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGRlY3J5cHRNZXNzYWdlO1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XG5pbXBvcnQgZWNpZXMgZnJvbSAnc3RhbmRhcmQtZWNpZXMnO1xuXG5jb25zdCBFbmNyeXB0TWVzc2FnZVNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICBwdWJsaWNLZXk6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfSxcbiAgbWVzc2FnZToge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9XG59KTtcblxuY29uc3QgZW5jcnlwdE1lc3NhZ2UgPSAoZGF0YSkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IG91ckRhdGEgPSBkYXRhO1xuICAgIEVuY3J5cHRNZXNzYWdlU2NoZW1hLnZhbGlkYXRlKG91ckRhdGEpO1xuICAgIGNvbnN0IHB1YmxpY0tleSA9IEJ1ZmZlci5mcm9tKG91ckRhdGEucHVibGljS2V5LCAnaGV4Jyk7XG4gICAgY29uc3QgbWVzc2FnZSA9IEJ1ZmZlci5mcm9tKG91ckRhdGEubWVzc2FnZSk7XG4gICAgcmV0dXJuIGVjaWVzLmVuY3J5cHQocHVibGljS2V5LCBtZXNzYWdlKS50b1N0cmluZygnaGV4Jyk7XG4gIH0gY2F0Y2goZXhjZXB0aW9uKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZG9pY2hhaW4uZW5jcnlwdE1lc3NhZ2UuZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgZW5jcnlwdE1lc3NhZ2U7XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcbmltcG9ydCB7IE9wdElucyB9IGZyb20gJy4uLy4uLy4uL2FwaS9vcHQtaW5zL29wdC1pbnMuanMnO1xuaW1wb3J0IGdldEtleVBhaXIgZnJvbSAnLi9nZXRfa2V5LXBhaXIuanMnO1xuaW1wb3J0IHtsb2dTZW5kfSBmcm9tIFwiLi4vLi4vLi4vc3RhcnR1cC9zZXJ2ZXIvbG9nLWNvbmZpZ3VyYXRpb25cIjtcblxuY29uc3QgR2VuZXJhdGVOYW1lSWRTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgaWQ6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfSxcbiAgbWFzdGVyRG9pOiB7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICBvcHRpb25hbDogdHJ1ZVxuICB9LFxuICBpbmRleDoge1xuICAgICAgdHlwZTogU2ltcGxlU2NoZW1hLkludGVnZXIsXG4gICAgICBvcHRpb25hbDogdHJ1ZVxuICB9XG59KTtcblxuY29uc3QgZ2VuZXJhdGVOYW1lSWQgPSAob3B0SW4pID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBvdXJPcHRJbiA9IG9wdEluO1xuICAgIEdlbmVyYXRlTmFtZUlkU2NoZW1hLnZhbGlkYXRlKG91ck9wdEluKTtcbiAgICBsZXQgbmFtZUlkO1xuICAgIGlmKG9wdEluLm1hc3RlckRvaSl7XG4gICAgICAgIG5hbWVJZCA9IG91ck9wdEluLm1hc3RlckRvaStcIi1cIitvdXJPcHRJbi5pbmRleDtcbiAgICAgICAgbG9nU2VuZChcInVzZWQgbWFzdGVyX2RvaSBhcyBuYW1lSWQgaW5kZXggXCIrb3B0SW4uaW5kZXgrXCJzdG9yYWdlOlwiLG5hbWVJZCk7XG4gICAgfVxuICAgIGVsc2V7XG4gICAgICAgIG5hbWVJZCA9IGdldEtleVBhaXIoKS5wcml2YXRlS2V5O1xuICAgICAgICBsb2dTZW5kKFwiZ2VuZXJhdGVkIG5hbWVJZCBmb3IgZG9pY2hhaW4gc3RvcmFnZTpcIixuYW1lSWQpO1xuICAgIH1cblxuICAgIE9wdElucy51cGRhdGUoe19pZCA6IG91ck9wdEluLmlkfSwgeyRzZXQ6e25hbWVJZDogbmFtZUlkfX0pO1xuXG4gICAgcmV0dXJuIG5hbWVJZDtcbiAgfSBjYXRjaChleGNlcHRpb24pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdkb2ljaGFpbi5nZW5lcmF0ZU5hbWVJZC5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBnZW5lcmF0ZU5hbWVJZDtcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tICdzaW1wbC1zY2hlbWEnO1xuaW1wb3J0IENyeXB0b0pTIGZyb20gJ2NyeXB0by1qcyc7XG5pbXBvcnQgQmFzZTU4IGZyb20gJ2JzNTgnO1xuaW1wb3J0IHsgaXNSZWd0ZXN0IH0gZnJvbSAnLi4vLi4vLi4vc3RhcnR1cC9zZXJ2ZXIvZGFwcC1jb25maWd1cmF0aW9uLmpzJztcbmltcG9ydCB7aXNUZXN0bmV0fSBmcm9tIFwiLi4vLi4vLi4vc3RhcnR1cC9zZXJ2ZXIvZGFwcC1jb25maWd1cmF0aW9uXCI7XG5cbmNvbnN0IFZFUlNJT05fQllURSA9IDB4MzQ7XG5jb25zdCBWRVJTSU9OX0JZVEVfUkVHVEVTVCA9IDB4NmY7XG5jb25zdCBHZXRBZGRyZXNzU2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIHB1YmxpY0tleToge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9XG59KTtcblxuY29uc3QgZ2V0QWRkcmVzcyA9IChkYXRhKSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3Qgb3VyRGF0YSA9IGRhdGE7XG4gICAgR2V0QWRkcmVzc1NjaGVtYS52YWxpZGF0ZShvdXJEYXRhKTtcbiAgICByZXR1cm4gX2dldEFkZHJlc3Mob3VyRGF0YS5wdWJsaWNLZXkpO1xuICB9IGNhdGNoKGV4Y2VwdGlvbikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2RvaWNoYWluLmdldEFkZHJlc3MuZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgfVxufTtcblxuZnVuY3Rpb24gX2dldEFkZHJlc3MocHVibGljS2V5KSB7XG4gIGNvbnN0IHB1YktleSA9IENyeXB0b0pTLmxpYi5Xb3JkQXJyYXkuY3JlYXRlKEJ1ZmZlci5mcm9tKHB1YmxpY0tleSwgJ2hleCcpKTtcbiAgbGV0IGtleSA9IENyeXB0b0pTLlNIQTI1NihwdWJLZXkpO1xuICBrZXkgPSBDcnlwdG9KUy5SSVBFTUQxNjAoa2V5KTtcbiAgbGV0IHZlcnNpb25CeXRlID0gVkVSU0lPTl9CWVRFO1xuICBpZihpc1JlZ3Rlc3QoKSB8fCBpc1Rlc3RuZXQoKSkgdmVyc2lvbkJ5dGUgPSBWRVJTSU9OX0JZVEVfUkVHVEVTVDtcbiAgbGV0IGFkZHJlc3MgPSBCdWZmZXIuY29uY2F0KFtCdWZmZXIuZnJvbShbdmVyc2lvbkJ5dGVdKSwgQnVmZmVyLmZyb20oa2V5LnRvU3RyaW5nKCksICdoZXgnKV0pO1xuICBrZXkgPSBDcnlwdG9KUy5TSEEyNTYoQ3J5cHRvSlMubGliLldvcmRBcnJheS5jcmVhdGUoYWRkcmVzcykpO1xuICBrZXkgPSBDcnlwdG9KUy5TSEEyNTYoa2V5KTtcbiAgbGV0IGNoZWNrc3VtID0ga2V5LnRvU3RyaW5nKCkuc3Vic3RyaW5nKDAsIDgpO1xuICBhZGRyZXNzID0gbmV3IEJ1ZmZlcihhZGRyZXNzLnRvU3RyaW5nKCdoZXgnKStjaGVja3N1bSwnaGV4Jyk7XG4gIGFkZHJlc3MgPSBCYXNlNTguZW5jb2RlKGFkZHJlc3MpO1xuICByZXR1cm4gYWRkcmVzcztcbn1cblxuZXhwb3J0IGRlZmF1bHQgZ2V0QWRkcmVzcztcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IHsgZ2V0QmFsYW5jZSB9IGZyb20gJy4uLy4uLy4uLy4uL3NlcnZlci9hcGkvZG9pY2hhaW4uanMnO1xuaW1wb3J0IHsgQ09ORklSTV9DTElFTlR9IGZyb20gJy4uLy4uLy4uL3N0YXJ0dXAvc2VydmVyL2RvaWNoYWluLWNvbmZpZ3VyYXRpb24uanMnO1xuXG5cbmNvbnN0IGdldF9CYWxhbmNlID0gKCkgPT4ge1xuICAgIFxuICB0cnkge1xuICAgIGNvbnN0IGJhbD1nZXRCYWxhbmNlKENPTkZJUk1fQ0xJRU5UKTtcbiAgICByZXR1cm4gYmFsO1xuICAgIFxuICB9IGNhdGNoKGV4Y2VwdGlvbikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2RvaWNoYWluLmdldEJhbGFuY2UuZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGdldF9CYWxhbmNlO1xuXG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCBDcnlwdG9KUyBmcm9tICdjcnlwdG8tanMnO1xuaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tICdzaW1wbC1zY2hlbWEnO1xuXG5jb25zdCBHZXREYXRhSGFzaFNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICBkYXRhOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH1cbn0pO1xuXG5jb25zdCBnZXREYXRhSGFzaCA9IChkYXRhKSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3Qgb3VyRGF0YSA9IGRhdGE7XG4gICAgICBHZXREYXRhSGFzaFNjaGVtYS52YWxpZGF0ZShvdXJEYXRhKTtcbiAgICBjb25zdCBoYXNoID0gQ3J5cHRvSlMuU0hBMjU2KG91ckRhdGEpLnRvU3RyaW5nKCk7XG4gICAgcmV0dXJuIGhhc2g7XG4gIH0gY2F0Y2goZXhjZXB0aW9uKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZG9pY2hhaW4uZ2V0RGF0YUhhc2guZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgZ2V0RGF0YUhhc2g7XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCB7IHJhbmRvbUJ5dGVzIH0gZnJvbSAnY3J5cHRvJztcbmltcG9ydCBzZWNwMjU2azEgZnJvbSAnc2VjcDI1NmsxJztcblxuY29uc3QgZ2V0S2V5UGFpciA9ICgpID0+IHtcbiAgdHJ5IHtcbiAgICBsZXQgcHJpdktleVxuICAgIGRvIHtwcml2S2V5ID0gcmFuZG9tQnl0ZXMoMzIpfSB3aGlsZSghc2VjcDI1NmsxLnByaXZhdGVLZXlWZXJpZnkocHJpdktleSkpXG4gICAgY29uc3QgcHJpdmF0ZUtleSA9IHByaXZLZXk7XG4gICAgY29uc3QgcHVibGljS2V5ID0gc2VjcDI1NmsxLnB1YmxpY0tleUNyZWF0ZShwcml2YXRlS2V5KTtcbiAgICByZXR1cm4ge1xuICAgICAgcHJpdmF0ZUtleTogcHJpdmF0ZUtleS50b1N0cmluZygnaGV4JykudG9VcHBlckNhc2UoKSxcbiAgICAgIHB1YmxpY0tleTogcHVibGljS2V5LnRvU3RyaW5nKCdoZXgnKS50b1VwcGVyQ2FzZSgpXG4gICAgfVxuICB9IGNhdGNoKGV4Y2VwdGlvbikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2RvaWNoYWluLmdldEtleVBhaXIuZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgZ2V0S2V5UGFpcjtcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tICdzaW1wbC1zY2hlbWEnO1xuaW1wb3J0IEJhc2U1OCBmcm9tICdiczU4JztcblxuY29uc3QgR2V0UHJpdmF0ZUtleUZyb21XaWZTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgd2lmOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH1cbn0pO1xuXG5jb25zdCBnZXRQcml2YXRlS2V5RnJvbVdpZiA9IChkYXRhKSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3Qgb3VyRGF0YSA9IGRhdGE7XG4gICAgR2V0UHJpdmF0ZUtleUZyb21XaWZTY2hlbWEudmFsaWRhdGUob3VyRGF0YSk7XG4gICAgcmV0dXJuIF9nZXRQcml2YXRlS2V5RnJvbVdpZihvdXJEYXRhLndpZik7XG4gIH0gY2F0Y2goZXhjZXB0aW9uKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZG9pY2hhaW4uZ2V0UHJpdmF0ZUtleUZyb21XaWYuZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgfVxufTtcblxuZnVuY3Rpb24gX2dldFByaXZhdGVLZXlGcm9tV2lmKHdpZikge1xuICB2YXIgcHJpdmF0ZUtleSA9IEJhc2U1OC5kZWNvZGUod2lmKS50b1N0cmluZygnaGV4Jyk7XG4gIHByaXZhdGVLZXkgPSBwcml2YXRlS2V5LnN1YnN0cmluZygyLCBwcml2YXRlS2V5Lmxlbmd0aCAtIDgpO1xuICBpZihwcml2YXRlS2V5Lmxlbmd0aCA9PT0gNjYgJiYgcHJpdmF0ZUtleS5lbmRzV2l0aChcIjAxXCIpKSB7XG4gICAgcHJpdmF0ZUtleSA9IHByaXZhdGVLZXkuc3Vic3RyaW5nKDAsIHByaXZhdGVLZXkubGVuZ3RoIC0gMik7XG4gIH1cbiAgcmV0dXJuIHByaXZhdGVLZXk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGdldFByaXZhdGVLZXlGcm9tV2lmO1xuIiwiaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tICdzaW1wbC1zY2hlbWEnO1xuaW1wb3J0IHtsb2dTZW5kfSBmcm9tIFwiLi4vLi4vLi4vc3RhcnR1cC9zZXJ2ZXIvbG9nLWNvbmZpZ3VyYXRpb25cIjtcblxuaW1wb3J0IGdldE9wdEluS2V5IGZyb20gXCIuLi9kbnMvZ2V0X29wdC1pbi1rZXlcIjtcbmltcG9ydCBnZXRPcHRJblByb3ZpZGVyIGZyb20gXCIuLi9kbnMvZ2V0X29wdC1pbi1wcm92aWRlclwiO1xuaW1wb3J0IGdldEFkZHJlc3MgZnJvbSBcIi4vZ2V0X2FkZHJlc3NcIjtcblxuY29uc3QgR2V0UHVibGljS2V5U2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gICAgZG9tYWluOiB7XG4gICAgICAgIHR5cGU6IFN0cmluZ1xuICAgIH1cbn0pO1xuXG5jb25zdCBnZXRQdWJsaWNLZXlBbmRBZGRyZXNzID0gKGRhdGEpID0+IHtcblxuICAgIGNvbnN0IG91ckRhdGEgPSBkYXRhO1xuICAgIEdldFB1YmxpY0tleVNjaGVtYS52YWxpZGF0ZShvdXJEYXRhKTtcblxuICAgIGxldCBwdWJsaWNLZXkgPSBnZXRPcHRJbktleSh7ZG9tYWluOiBvdXJEYXRhLmRvbWFpbn0pO1xuICAgIGlmKCFwdWJsaWNLZXkpe1xuICAgICAgICBjb25zdCBwcm92aWRlciA9IGdldE9wdEluUHJvdmlkZXIoe2RvbWFpbjogb3VyRGF0YS5kb21haW59KTtcbiAgICAgICAgbG9nU2VuZChcInVzaW5nIGRvaWNoYWluIHByb3ZpZGVyIGluc3RlYWQgb2YgZGlyZWN0bHkgY29uZmlndXJlZCBwdWJsaWNLZXk6XCIse3Byb3ZpZGVyOnByb3ZpZGVyfSk7XG4gICAgICAgIHB1YmxpY0tleSA9IGdldE9wdEluS2V5KHtkb21haW46IHByb3ZpZGVyfSk7IC8vZ2V0IHB1YmxpYyBrZXkgZnJvbSBwcm92aWRlciBvciBmYWxsYmFjayBpZiBwdWJsaWNrZXkgd2FzIG5vdCBzZXQgaW4gZG5zXG4gICAgfVxuICAgIGNvbnN0IGRlc3RBZGRyZXNzID0gIGdldEFkZHJlc3Moe3B1YmxpY0tleTogcHVibGljS2V5fSk7XG4gICAgbG9nU2VuZCgncHVibGljS2V5IGFuZCBkZXN0QWRkcmVzcyAnLCB7cHVibGljS2V5OnB1YmxpY0tleSxkZXN0QWRkcmVzczpkZXN0QWRkcmVzc30pO1xuICAgIHJldHVybiB7cHVibGljS2V5OnB1YmxpY0tleSxkZXN0QWRkcmVzczpkZXN0QWRkcmVzc307XG59O1xuXG5leHBvcnQgZGVmYXVsdCBnZXRQdWJsaWNLZXlBbmRBZGRyZXNzOyIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tICdzaW1wbC1zY2hlbWEnO1xuaW1wb3J0IGJpdGNvcmUgZnJvbSAnYml0Y29yZS1saWInO1xuaW1wb3J0IE1lc3NhZ2UgZnJvbSAnYml0Y29yZS1tZXNzYWdlJztcblxuY29uc3QgR2V0U2lnbmF0dXJlU2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIG1lc3NhZ2U6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfSxcbiAgcHJpdmF0ZUtleToge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9XG59KTtcblxuY29uc3QgZ2V0U2lnbmF0dXJlID0gKGRhdGEpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBvdXJEYXRhID0gZGF0YTtcbiAgICBHZXRTaWduYXR1cmVTY2hlbWEudmFsaWRhdGUob3VyRGF0YSk7XG4gICAgY29uc3Qgc2lnbmF0dXJlID0gTWVzc2FnZShvdXJEYXRhLm1lc3NhZ2UpLnNpZ24obmV3IGJpdGNvcmUuUHJpdmF0ZUtleShvdXJEYXRhLnByaXZhdGVLZXkpKTtcbiAgICByZXR1cm4gc2lnbmF0dXJlO1xuICB9IGNhdGNoKGV4Y2VwdGlvbikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2RvaWNoYWluLmdldFNpZ25hdHVyZS5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBnZXRTaWduYXR1cmU7XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcbmltcG9ydCB7IFNFTkRfQ0xJRU5UIH0gZnJvbSAnLi4vLi4vLi4vc3RhcnR1cC9zZXJ2ZXIvZG9pY2hhaW4tY29uZmlndXJhdGlvbi5qcyc7XG5pbXBvcnQgZW5jcnlwdE1lc3NhZ2UgZnJvbSBcIi4vZW5jcnlwdF9tZXNzYWdlXCI7XG5pbXBvcnQge2dldFVybH0gZnJvbSBcIi4uLy4uLy4uL3N0YXJ0dXAvc2VydmVyL2RhcHAtY29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHtsb2dCbG9ja2NoYWluLCBsb2dTZW5kfSBmcm9tIFwiLi4vLi4vLi4vc3RhcnR1cC9zZXJ2ZXIvbG9nLWNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7ZmVlRG9pLG5hbWVEb2l9IGZyb20gXCIuLi8uLi8uLi8uLi9zZXJ2ZXIvYXBpL2RvaWNoYWluXCI7XG5pbXBvcnQge09wdEluc30gZnJvbSBcIi4uLy4uLy4uL2FwaS9vcHQtaW5zL29wdC1pbnNcIjtcbmltcG9ydCBnZXRQdWJsaWNLZXlBbmRBZGRyZXNzIGZyb20gXCIuL2dldF9wdWJsaWNrZXlfYW5kX2FkZHJlc3NfYnlfZG9tYWluXCI7XG5cblxuY29uc3QgSW5zZXJ0U2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIG5hbWVJZDoge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9LFxuICBzaWduYXR1cmU6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfSxcbiAgZGF0YUhhc2g6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfSxcbiAgZG9tYWluOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH0sXG4gIHNvaURhdGU6IHtcbiAgICB0eXBlOiBEYXRlXG4gIH1cbn0pO1xuXG5jb25zdCBpbnNlcnQgPSAoZGF0YSkgPT4ge1xuICBjb25zdCBvdXJEYXRhID0gZGF0YTtcbiAgdHJ5IHtcbiAgICBJbnNlcnRTY2hlbWEudmFsaWRhdGUob3VyRGF0YSk7XG4gICAgbG9nU2VuZChcImRvbWFpbjpcIixvdXJEYXRhLmRvbWFpbik7XG5cbiAgICBjb25zdCBwdWJsaWNLZXlBbmRBZGRyZXNzID0gZ2V0UHVibGljS2V5QW5kQWRkcmVzcyh7ZG9tYWluOm91ckRhdGEuZG9tYWlufSk7XG4gICAgY29uc3QgZnJvbSA9IGVuY3J5cHRNZXNzYWdlKHtwdWJsaWNLZXk6IHB1YmxpY0tleUFuZEFkZHJlc3MucHVibGljS2V5LCBtZXNzYWdlOiBnZXRVcmwoKX0pO1xuICAgIGxvZ1NlbmQoJ2VuY3J5cHRlZCB1cmwgZm9yIHVzZSBhZCBmcm9tIGluIGRvaWNoYWluIHZhbHVlOicsZ2V0VXJsKCksZnJvbSk7XG5cbiAgICBjb25zdCBuYW1lVmFsdWUgPSBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgIHNpZ25hdHVyZTogb3VyRGF0YS5zaWduYXR1cmUsXG4gICAgICAgIGRhdGFIYXNoOiBvdXJEYXRhLmRhdGFIYXNoLFxuICAgICAgICBmcm9tOiBmcm9tXG4gICAgfSk7XG5cbiAgICAvL1RPRE8gKCEpIHRoaXMgbXVzdCBiZSByZXBsYWNlZCBpbiBmdXR1cmUgYnkgXCJhdG9taWMgbmFtZSB0cmFkaW5nIGV4YW1wbGVcIiBodHRwczovL3dpa2kubmFtZWNvaW4uaW5mby8/dGl0bGU9QXRvbWljX05hbWUtVHJhZGluZ1xuICAgIGxvZ0Jsb2NrY2hhaW4oJ3NlbmRpbmcgYSBmZWUgdG8gYm9iIHNvIGhlIGNhbiBwYXkgdGhlIGRvaSBzdG9yYWdlIChkZXN0QWRkcmVzcyk6JywgcHVibGljS2V5QW5kQWRkcmVzcy5kZXN0QWRkcmVzcyk7XG4gICAgY29uc3QgZmVlRG9pVHggPSBmZWVEb2koU0VORF9DTElFTlQsIHB1YmxpY0tleUFuZEFkZHJlc3MuZGVzdEFkZHJlc3MpO1xuICAgIGxvZ0Jsb2NrY2hhaW4oJ2ZlZSBzZW5kIHR4aWQgdG8gZGVzdGFkZHJlc3MnLCBmZWVEb2lUeCwgcHVibGljS2V5QW5kQWRkcmVzcy5kZXN0QWRkcmVzcyk7XG5cbiAgICBsb2dCbG9ja2NoYWluKCdhZGRpbmcgZGF0YSB0byBibG9ja2NoYWluIHZpYSBuYW1lX2RvaSAobmFtZUlkLHZhbHVlLGRlc3RBZGRyZXNzKTonLCBvdXJEYXRhLm5hbWVJZCxuYW1lVmFsdWUscHVibGljS2V5QW5kQWRkcmVzcy5kZXN0QWRkcmVzcyk7XG4gICAgY29uc3QgbmFtZURvaVR4ID0gbmFtZURvaShTRU5EX0NMSUVOVCwgb3VyRGF0YS5uYW1lSWQsIG5hbWVWYWx1ZSwgcHVibGljS2V5QW5kQWRkcmVzcy5kZXN0QWRkcmVzcyk7XG4gICAgbG9nQmxvY2tjaGFpbignbmFtZV9kb2kgYWRkZWQgYmxvY2tjaGFpbi4gdHhpZDonLCBuYW1lRG9pVHgpO1xuXG4gICAgT3B0SW5zLnVwZGF0ZSh7bmFtZUlkOiBvdXJEYXRhLm5hbWVJZH0sIHskc2V0OiB7dHhJZDpuYW1lRG9pVHh9fSk7XG4gICAgbG9nQmxvY2tjaGFpbigndXBkYXRpbmcgT3B0SW4gbG9jYWxseSB3aXRoOicsIHtuYW1lSWQ6IG91ckRhdGEubmFtZUlkLCB0eElkOiBuYW1lRG9pVHh9KTtcblxuICB9IGNhdGNoKGV4Y2VwdGlvbikge1xuICAgICAgT3B0SW5zLnVwZGF0ZSh7bmFtZUlkOiBvdXJEYXRhLm5hbWVJZH0sIHskc2V0OiB7ZXJyb3I6SlNPTi5zdHJpbmdpZnkoZXhjZXB0aW9uLm1lc3NhZ2UpfX0pO1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2RvaWNoYWluLmluc2VydC5leGNlcHRpb24nLCBleGNlcHRpb24pOyAvL1RPRE8gdXBkYXRlIG9wdC1pbiBpbiBsb2NhbCBkYiB0byBpbmZvcm0gdXNlciBhYm91dCB0aGUgZXJyb3IhIGUuZy4gSW5zdWZmaWNpZW50IGZ1bmRzIGV0Yy5cbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgaW5zZXJ0O1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XG5pbXBvcnQgeyBDT05GSVJNX0NMSUVOVCB9IGZyb20gJy4uLy4uLy4uL3N0YXJ0dXAvc2VydmVyL2RvaWNoYWluLWNvbmZpZ3VyYXRpb24uanMnO1xuaW1wb3J0IHtnZXRXaWYsIHNpZ25NZXNzYWdlLCBnZXRUcmFuc2FjdGlvbiwgbmFtZURvaSwgbmFtZVNob3d9IGZyb20gXCIuLi8uLi8uLi8uLi9zZXJ2ZXIvYXBpL2RvaWNoYWluXCI7XG5pbXBvcnQge0FQSV9QQVRILCBET0lfQ09ORklSTUFUSU9OX05PVElGWV9ST1VURSwgVkVSU0lPTn0gZnJvbSBcIi4uLy4uLy4uLy4uL3NlcnZlci9hcGkvcmVzdC9yZXN0XCI7XG5pbXBvcnQge0NPTkZJUk1fQUREUkVTU30gZnJvbSBcIi4uLy4uLy4uL3N0YXJ0dXAvc2VydmVyL2RvaWNoYWluLWNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7Z2V0SHR0cFBVVH0gZnJvbSBcIi4uLy4uLy4uLy4uL3NlcnZlci9hcGkvaHR0cFwiO1xuaW1wb3J0IHtsb2dDb25maXJtfSBmcm9tIFwiLi4vLi4vLi4vc3RhcnR1cC9zZXJ2ZXIvbG9nLWNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCBnZXRQcml2YXRlS2V5RnJvbVdpZiBmcm9tIFwiLi9nZXRfcHJpdmF0ZS1rZXlfZnJvbV93aWZcIjtcbmltcG9ydCBkZWNyeXB0TWVzc2FnZSBmcm9tIFwiLi9kZWNyeXB0X21lc3NhZ2VcIjtcbmltcG9ydCB7T3B0SW5zfSBmcm9tIFwiLi4vLi4vLi4vYXBpL29wdC1pbnMvb3B0LWluc1wiO1xuXG5jb25zdCBVcGRhdGVTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgbmFtZUlkOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH0sXG4gIHZhbHVlOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH0sXG4gIGhvc3QgOiB7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICBvcHRpb25hbDogdHJ1ZSxcbiAgfSxcbiAgZnJvbUhvc3RVcmwgOiB7XG4gICAgICB0eXBlOiBTdHJpbmdcbiAgfVxufSk7XG5cbmNvbnN0IHVwZGF0ZSA9IChkYXRhLCBqb2IpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBvdXJEYXRhID0gZGF0YTtcblxuICAgIFVwZGF0ZVNjaGVtYS52YWxpZGF0ZShvdXJEYXRhKTtcblxuICAgIC8vc3RvcCB0aGlzIHVwZGF0ZSB1bnRpbCB0aGlzIG5hbWUgYXMgYXQgbGVhc3QgMSBjb25maXJtYXRpb25cbiAgICBjb25zdCBuYW1lX2RhdGEgPSBuYW1lU2hvdyhDT05GSVJNX0NMSUVOVCxvdXJEYXRhLm5hbWVJZCk7XG4gICAgaWYobmFtZV9kYXRhID09PSB1bmRlZmluZWQpe1xuICAgICAgICByZXJ1bihqb2IpO1xuICAgICAgICBsb2dDb25maXJtKCduYW1lIG5vdCB2aXNpYmxlIC0gZGVsYXlpbmcgbmFtZSB1cGRhdGUnLG91ckRhdGEubmFtZUlkKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBvdXJfdHJhbnNhY3Rpb24gPSBnZXRUcmFuc2FjdGlvbihDT05GSVJNX0NMSUVOVCxuYW1lX2RhdGEudHhpZCk7XG4gICAgaWYob3VyX3RyYW5zYWN0aW9uLmNvbmZpcm1hdGlvbnM9PT0wKXtcbiAgICAgICAgcmVydW4oam9iKTtcbiAgICAgICAgbG9nQ29uZmlybSgndHJhbnNhY3Rpb24gaGFzIDAgY29uZmlybWF0aW9ucyAtIGRlbGF5aW5nIG5hbWUgdXBkYXRlJyxKU09OLnBhcnNlKG91ckRhdGEudmFsdWUpKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBsb2dDb25maXJtKCd1cGRhdGluZyBibG9ja2NoYWluIHdpdGggZG9pU2lnbmF0dXJlOicsSlNPTi5wYXJzZShvdXJEYXRhLnZhbHVlKSk7XG4gICAgY29uc3Qgd2lmID0gZ2V0V2lmKENPTkZJUk1fQ0xJRU5ULCBDT05GSVJNX0FERFJFU1MpO1xuICAgIGNvbnN0IHByaXZhdGVLZXkgPSBnZXRQcml2YXRlS2V5RnJvbVdpZih7d2lmOiB3aWZ9KTtcbiAgICBsb2dDb25maXJtKCdnb3QgcHJpdmF0ZSBrZXkgKHdpbGwgbm90IHNob3cgaXQgaGVyZSkgaW4gb3JkZXIgdG8gZGVjcnlwdCBTZW5kLWRBcHAgaG9zdCB1cmwgZnJvbSB2YWx1ZTonLG91ckRhdGEuZnJvbUhvc3RVcmwpO1xuICAgIGNvbnN0IG91cmZyb21Ib3N0VXJsID0gZGVjcnlwdE1lc3NhZ2Uoe3ByaXZhdGVLZXk6IHByaXZhdGVLZXksIG1lc3NhZ2U6IG91ckRhdGEuZnJvbUhvc3RVcmx9KTtcbiAgICBsb2dDb25maXJtKCdkZWNyeXB0ZWQgZnJvbUhvc3RVcmwnLG91cmZyb21Ib3N0VXJsKTtcbiAgICBjb25zdCB1cmwgPSBvdXJmcm9tSG9zdFVybCtBUElfUEFUSCtWRVJTSU9OK1wiL1wiK0RPSV9DT05GSVJNQVRJT05fTk9USUZZX1JPVVRFO1xuXG4gICAgbG9nQ29uZmlybSgnY3JlYXRpbmcgc2lnbmF0dXJlIHdpdGggQUREUkVTUycrQ09ORklSTV9BRERSRVNTK1wiIG5hbWVJZDpcIixvdXJEYXRhLnZhbHVlKTtcbiAgICBjb25zdCBzaWduYXR1cmUgPSBzaWduTWVzc2FnZShDT05GSVJNX0NMSUVOVCwgQ09ORklSTV9BRERSRVNTLCBvdXJEYXRhLm5hbWVJZCk7IC8vVE9ETyB3aHkgaGVyZSBvdmVyIG5hbWVJRD9cbiAgICBsb2dDb25maXJtKCdzaWduYXR1cmUgY3JlYXRlZDonLHNpZ25hdHVyZSk7XG5cbiAgICBjb25zdCB1cGRhdGVEYXRhID0ge1xuICAgICAgICBuYW1lSWQ6IG91ckRhdGEubmFtZUlkLFxuICAgICAgICBzaWduYXR1cmU6IHNpZ25hdHVyZSxcbiAgICAgICAgaG9zdDogb3VyRGF0YS5ob3N0XG4gICAgfTtcblxuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHR4aWQgPSBuYW1lRG9pKENPTkZJUk1fQ0xJRU5ULCBvdXJEYXRhLm5hbWVJZCwgb3VyRGF0YS52YWx1ZSwgbnVsbCk7XG4gICAgICAgIGxvZ0NvbmZpcm0oJ3VwZGF0ZSB0cmFuc2FjdGlvbiB0eGlkOicsdHhpZCk7XG4gICAgfWNhdGNoKGV4Y2VwdGlvbil7XG4gICAgICAgIC8vXG4gICAgICAgIGxvZ0NvbmZpcm0oJ3RoaXMgbmFtZURPSSBkb2VzbsK0dCBoYXZlIGEgYmxvY2sgeWV0IGFuZCB3aWxsIGJlIHVwZGF0ZWQgd2l0aCB0aGUgbmV4dCBibG9jayBhbmQgd2l0aCB0aGUgbmV4dCBxdWV1ZSBzdGFydDonLG91ckRhdGEubmFtZUlkKTtcbiAgICAgICAgaWYoZXhjZXB0aW9uLnRvU3RyaW5nKCkuaW5kZXhPZihcInRoZXJlIGlzIGFscmVhZHkgYSByZWdpc3RyYXRpb24gZm9yIHRoaXMgZG9pIG5hbWVcIik9PS0xKSB7XG4gICAgICAgICAgICBPcHRJbnMudXBkYXRlKHtuYW1lSWQ6IG91ckRhdGEubmFtZUlkfSwgeyRzZXQ6IHtlcnJvcjogSlNPTi5zdHJpbmdpZnkoZXhjZXB0aW9uLm1lc3NhZ2UpfX0pO1xuICAgICAgICB9XG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2RvaWNoYWluLnVwZGF0ZS5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICAgICAgICAvL31lbHNle1xuICAgICAgICAvLyAgICBsb2dDb25maXJtKCd0aGlzIG5hbWVET0kgZG9lc27CtHQgaGF2ZSBhIGJsb2NrIHlldCBhbmQgd2lsbCBiZSB1cGRhdGVkIHdpdGggdGhlIG5leHQgYmxvY2sgYW5kIHdpdGggdGhlIG5leHQgcXVldWUgc3RhcnQ6JyxvdXJEYXRhLm5hbWVJZCk7XG4gICAgICAgIC8vfVxuICAgIH1cblxuICAgIGNvbnN0IHJlc3BvbnNlID0gZ2V0SHR0cFBVVCh1cmwsIHVwZGF0ZURhdGEpO1xuICAgIGxvZ0NvbmZpcm0oJ2luZm9ybWVkIHNlbmQgZEFwcCBhYm91dCBjb25maXJtZWQgZG9pIG9uIHVybDonK3VybCsnIHdpdGggdXBkYXRlRGF0YScrSlNPTi5zdHJpbmdpZnkodXBkYXRlRGF0YSkrXCIgcmVzcG9uc2U6XCIscmVzcG9uc2UuZGF0YSk7XG4gICAgam9iLmRvbmUoKTtcbiAgfSBjYXRjaChleGNlcHRpb24pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdkb2ljaGFpbi51cGRhdGUuZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgfVxufTtcblxuZnVuY3Rpb24gcmVydW4oam9iKXtcbiAgICBsb2dDb25maXJtKCdyZXJ1bm5pbmcgdHhpZCBpbiAxMHNlYyAtIGNhbmNlbGluZyBvbGQgam9iJywnJyk7XG4gICAgam9iLmNhbmNlbCgpO1xuICAgIGxvZ0NvbmZpcm0oJ3Jlc3RhcnQgYmxvY2tjaGFpbiBkb2kgdXBkYXRlJywnJyk7XG4gICAgam9iLnJlc3RhcnQoXG4gICAgICAgIHtcbiAgICAgICAgICAgIC8vcmVwZWF0czogNjAwLCAgIC8vIE9ubHkgcmVwZWF0IHRoaXMgb25jZVxuICAgICAgICAgICAgLy8gVGhpcyBpcyB0aGUgZGVmYXVsdFxuICAgICAgICAgICAvLyB3YWl0OiAxMDAwMCAgIC8vIFdhaXQgMTAgc2VjIGJldHdlZW4gcmVwZWF0c1xuICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBEZWZhdWx0IGlzIHByZXZpb3VzIHNldHRpbmdcbiAgICAgICAgfSxcbiAgICAgICAgZnVuY3Rpb24gKGVyciwgcmVzdWx0KSB7XG4gICAgICAgICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgbG9nQ29uZmlybSgncmVydW5uaW5nIHR4aWQgaW4gMTBzZWM6JyxyZXN1bHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgdXBkYXRlO1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XG5pbXBvcnQgYml0Y29yZSBmcm9tICdiaXRjb3JlLWxpYic7XG5pbXBvcnQgTWVzc2FnZSBmcm9tICdiaXRjb3JlLW1lc3NhZ2UnO1xuaW1wb3J0IHtsb2dFcnJvciwgbG9nVmVyaWZ5fSBmcm9tIFwiLi4vLi4vLi4vc3RhcnR1cC9zZXJ2ZXIvbG9nLWNvbmZpZ3VyYXRpb25cIjtcbmNvbnN0IE5FVFdPUksgPSBiaXRjb3JlLk5ldHdvcmtzLmFkZCh7XG4gIG5hbWU6ICdkb2ljaGFpbicsXG4gIGFsaWFzOiAnZG9pY2hhaW4nLFxuICBwdWJrZXloYXNoOiAweDM0LFxuICBwcml2YXRla2V5OiAweEI0LFxuICBzY3JpcHRoYXNoOiAxMyxcbiAgbmV0d29ya01hZ2ljOiAweGY5YmViNGZlLFxufSk7XG5cbmNvbnN0IFZlcmlmeVNpZ25hdHVyZVNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICBkYXRhOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH0sXG4gIHB1YmxpY0tleToge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9LFxuICBzaWduYXR1cmU6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfVxufSk7XG5cbmNvbnN0IHZlcmlmeVNpZ25hdHVyZSA9IChkYXRhKSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3Qgb3VyRGF0YSA9IGRhdGE7XG4gICAgbG9nVmVyaWZ5KCd2ZXJpZnlTaWduYXR1cmU6JyxvdXJEYXRhKTtcbiAgICBWZXJpZnlTaWduYXR1cmVTY2hlbWEudmFsaWRhdGUob3VyRGF0YSk7XG4gICAgY29uc3QgYWRkcmVzcyA9IGJpdGNvcmUuQWRkcmVzcy5mcm9tUHVibGljS2V5KG5ldyBiaXRjb3JlLlB1YmxpY0tleShvdXJEYXRhLnB1YmxpY0tleSksIE5FVFdPUkspO1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gTWVzc2FnZShvdXJEYXRhLmRhdGEpLnZlcmlmeShhZGRyZXNzLCBvdXJEYXRhLnNpZ25hdHVyZSk7XG4gICAgfSBjYXRjaChlcnJvcikgeyBsb2dFcnJvcihlcnJvcil9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9IGNhdGNoKGV4Y2VwdGlvbikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2RvaWNoYWluLnZlcmlmeVNpZ25hdHVyZS5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCB2ZXJpZnlTaWduYXR1cmU7XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcbmltcG9ydCB7IE9wdElucyB9IGZyb20gJy4uLy4uLy4uL2FwaS9vcHQtaW5zL29wdC1pbnMuanMnO1xuaW1wb3J0IHsgU2VuZGVycyB9IGZyb20gJy4uLy4uLy4uL2FwaS9zZW5kZXJzL3NlbmRlcnMuanMnO1xuaW1wb3J0IHsgUmVjaXBpZW50cyB9IGZyb20gJy4uLy4uLy4uL2FwaS9yZWNpcGllbnRzL3JlY2lwaWVudHMuanMnO1xuaW1wb3J0IGdlbmVyYXRlTmFtZUlkIGZyb20gJy4vZ2VuZXJhdGVfbmFtZS1pZC5qcyc7XG5pbXBvcnQgZ2V0U2lnbmF0dXJlIGZyb20gJy4vZ2V0X3NpZ25hdHVyZS5qcyc7XG5pbXBvcnQgZ2V0RGF0YUhhc2ggZnJvbSAnLi9nZXRfZGF0YS1oYXNoLmpzJztcbmltcG9ydCBhZGRJbnNlcnRCbG9ja2NoYWluSm9iIGZyb20gJy4uL2pvYnMvYWRkX2luc2VydF9ibG9ja2NoYWluLmpzJztcbmltcG9ydCB7bG9nU2VuZH0gZnJvbSBcIi4uLy4uLy4uL3N0YXJ0dXAvc2VydmVyL2xvZy1jb25maWd1cmF0aW9uXCI7XG5cbmNvbnN0IFdyaXRlVG9CbG9ja2NoYWluU2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIGlkOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH1cbn0pO1xuXG5jb25zdCB3cml0ZVRvQmxvY2tjaGFpbiA9IChkYXRhKSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3Qgb3VyRGF0YSA9IGRhdGE7XG4gICAgV3JpdGVUb0Jsb2NrY2hhaW5TY2hlbWEudmFsaWRhdGUob3VyRGF0YSk7XG5cbiAgICBjb25zdCBvcHRJbiA9IE9wdElucy5maW5kT25lKHtfaWQ6IGRhdGEuaWR9KTtcbiAgICBjb25zdCByZWNpcGllbnQgPSBSZWNpcGllbnRzLmZpbmRPbmUoe19pZDogb3B0SW4ucmVjaXBpZW50fSk7XG4gICAgY29uc3Qgc2VuZGVyID0gU2VuZGVycy5maW5kT25lKHtfaWQ6IG9wdEluLnNlbmRlcn0pO1xuICAgIGxvZ1NlbmQoXCJvcHRJbiBkYXRhOlwiLHtpbmRleDpvdXJEYXRhLmluZGV4LCBvcHRJbjpvcHRJbixyZWNpcGllbnQ6cmVjaXBpZW50LHNlbmRlcjogc2VuZGVyfSk7XG5cblxuICAgIGNvbnN0IG5hbWVJZCA9IGdlbmVyYXRlTmFtZUlkKHtpZDogZGF0YS5pZCxpbmRleDpvcHRJbi5pbmRleCxtYXN0ZXJEb2k6b3B0SW4ubWFzdGVyRG9pIH0pO1xuICAgIGNvbnN0IHNpZ25hdHVyZSA9IGdldFNpZ25hdHVyZSh7bWVzc2FnZTogcmVjaXBpZW50LmVtYWlsK3NlbmRlci5lbWFpbCwgcHJpdmF0ZUtleTogcmVjaXBpZW50LnByaXZhdGVLZXl9KTtcbiAgICBsb2dTZW5kKFwiZ2VuZXJhdGVkIHNpZ25hdHVyZSBmcm9tIGVtYWlsIHJlY2lwaWVudCBhbmQgc2VuZGVyOlwiLHNpZ25hdHVyZSk7XG5cbiAgICBsZXQgZGF0YUhhc2ggPSBcIlwiO1xuXG4gICAgaWYob3B0SW4uZGF0YSkge1xuICAgICAgZGF0YUhhc2ggPSBnZXREYXRhSGFzaCh7ZGF0YTogb3B0SW4uZGF0YX0pO1xuICAgICAgbG9nU2VuZChcImdlbmVyYXRlZCBkYXRhaGFzaCBmcm9tIGdpdmVuIGRhdGE6XCIsZGF0YUhhc2gpO1xuICAgIH1cblxuICAgIGNvbnN0IHBhcnRzID0gcmVjaXBpZW50LmVtYWlsLnNwbGl0KFwiQFwiKTtcbiAgICBjb25zdCBkb21haW4gPSBwYXJ0c1twYXJ0cy5sZW5ndGgtMV07XG4gICAgbG9nU2VuZChcImVtYWlsIGRvbWFpbiBmb3IgcHVibGljS2V5IHJlcXVlc3QgaXM6XCIsZG9tYWluKTtcbiAgICBhZGRJbnNlcnRCbG9ja2NoYWluSm9iKHtcbiAgICAgIG5hbWVJZDogbmFtZUlkLFxuICAgICAgc2lnbmF0dXJlOiBzaWduYXR1cmUsXG4gICAgICBkYXRhSGFzaDogZGF0YUhhc2gsXG4gICAgICBkb21haW46IGRvbWFpbixcbiAgICAgIHNvaURhdGU6IG9wdEluLmNyZWF0ZWRBdFxuICAgIH0pXG4gIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2RvaWNoYWluLndyaXRlVG9CbG9ja2NoYWluLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IHdyaXRlVG9CbG9ja2NoYWluXG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcbmltcG9ydCB7IEhhc2hJZHMgfSBmcm9tICcuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9lbWFpbC1jb25maWd1cmF0aW9uLmpzJztcblxuY29uc3QgRGVjb2RlRG9pSGFzaFNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICBoYXNoOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH1cbn0pO1xuXG5jb25zdCBkZWNvZGVEb2lIYXNoID0gKGhhc2gpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBvdXJIYXNoID0gaGFzaDtcbiAgICBEZWNvZGVEb2lIYXNoU2NoZW1hLnZhbGlkYXRlKG91ckhhc2gpO1xuICAgIGNvbnN0IGhleCA9IEhhc2hJZHMuZGVjb2RlSGV4KG91ckhhc2guaGFzaCk7XG4gICAgaWYoIWhleCB8fCBoZXggPT09ICcnKSB0aHJvdyBcIldyb25nIGhhc2hcIjtcbiAgICB0cnkge1xuICAgICAgY29uc3Qgb2JqID0gSlNPTi5wYXJzZShCdWZmZXIoaGV4LCAnaGV4JykudG9TdHJpbmcoJ2FzY2lpJykpO1xuICAgICAgcmV0dXJuIG9iajtcbiAgICB9IGNhdGNoKGV4Y2VwdGlvbikge3Rocm93IFwiV3JvbmcgaGFzaFwiO31cbiAgfSBjYXRjaCAoZXhjZXB0aW9uKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZW1haWxzLmRlY29kZV9kb2ktaGFzaC5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBkZWNvZGVEb2lIYXNoO1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XG5pbXBvcnQgeyBIYXNoSWRzIH0gZnJvbSAnLi4vLi4vLi4vc3RhcnR1cC9zZXJ2ZXIvZW1haWwtY29uZmlndXJhdGlvbi5qcyc7XG5cbmNvbnN0IEdlbmVyYXRlRG9pSGFzaFNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICBpZDoge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9LFxuICB0b2tlbjoge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9LFxuICByZWRpcmVjdDoge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9XG59KTtcblxuY29uc3QgZ2VuZXJhdGVEb2lIYXNoID0gKG9wdEluKSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3Qgb3VyT3B0SW4gPSBvcHRJbjtcbiAgICBHZW5lcmF0ZURvaUhhc2hTY2hlbWEudmFsaWRhdGUob3VyT3B0SW4pO1xuXG4gICAgY29uc3QganNvbiA9IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgIGlkOiBvdXJPcHRJbi5pZCxcbiAgICAgIHRva2VuOiBvdXJPcHRJbi50b2tlbixcbiAgICAgIHJlZGlyZWN0OiBvdXJPcHRJbi5yZWRpcmVjdFxuICAgIH0pO1xuXG4gICAgY29uc3QgaGV4ID0gQnVmZmVyKGpzb24pLnRvU3RyaW5nKCdoZXgnKTtcbiAgICBjb25zdCBoYXNoID0gSGFzaElkcy5lbmNvZGVIZXgoaGV4KTtcbiAgICByZXR1cm4gaGFzaDtcbiAgfSBjYXRjaCAoZXhjZXB0aW9uKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZW1haWxzLmdlbmVyYXRlX2RvaS1oYXNoLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGdlbmVyYXRlRG9pSGFzaDtcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tICdzaW1wbC1zY2hlbWEnO1xuaW1wb3J0IHtsb2dDb25maXJtfSBmcm9tIFwiLi4vLi4vLi4vc3RhcnR1cC9zZXJ2ZXIvbG9nLWNvbmZpZ3VyYXRpb25cIjtcblxuY29uc3QgUExBQ0VIT0xERVJfUkVHRVggPSAvXFwkeyhbXFx3XSopfS9nO1xuY29uc3QgUGFyc2VUZW1wbGF0ZVNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICB0ZW1wbGF0ZToge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgfSxcbiAgZGF0YToge1xuICAgIHR5cGU6IE9iamVjdCxcbiAgICBibGFja2JveDogdHJ1ZVxuICB9XG59KTtcblxuY29uc3QgcGFyc2VUZW1wbGF0ZSA9IChkYXRhKSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3Qgb3VyRGF0YSA9IGRhdGE7XG4gICAgLy9sb2dDb25maXJtKCdwYXJzZVRlbXBsYXRlOicsb3VyRGF0YSk7XG5cbiAgICBQYXJzZVRlbXBsYXRlU2NoZW1hLnZhbGlkYXRlKG91ckRhdGEpO1xuICAgIGxvZ0NvbmZpcm0oJ1BhcnNlVGVtcGxhdGVTY2hlbWEgdmFsaWRhdGVkJyk7XG5cbiAgICB2YXIgX21hdGNoO1xuICAgIHZhciB0ZW1wbGF0ZSA9IG91ckRhdGEudGVtcGxhdGU7XG4gICAvL2xvZ0NvbmZpcm0oJ2RvaW5nIHNvbWUgcmVnZXggd2l0aCB0ZW1wbGF0ZTonLHRlbXBsYXRlKTtcblxuICAgIGRvIHtcbiAgICAgIF9tYXRjaCA9IFBMQUNFSE9MREVSX1JFR0VYLmV4ZWModGVtcGxhdGUpO1xuICAgICAgaWYoX21hdGNoKSB0ZW1wbGF0ZSA9IF9yZXBsYWNlUGxhY2Vob2xkZXIodGVtcGxhdGUsIF9tYXRjaCwgb3VyRGF0YS5kYXRhW19tYXRjaFsxXV0pO1xuICAgIH0gd2hpbGUgKF9tYXRjaCk7XG4gICAgcmV0dXJuIHRlbXBsYXRlO1xuICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlbWFpbHMucGFyc2VUZW1wbGF0ZS5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9XG59O1xuXG5mdW5jdGlvbiBfcmVwbGFjZVBsYWNlaG9sZGVyKHRlbXBsYXRlLCBfbWF0Y2gsIHJlcGxhY2UpIHtcbiAgdmFyIHJlcCA9IHJlcGxhY2U7XG4gIGlmKHJlcGxhY2UgPT09IHVuZGVmaW5lZCkgcmVwID0gXCJcIjtcbiAgcmV0dXJuIHRlbXBsYXRlLnN1YnN0cmluZygwLCBfbWF0Y2guaW5kZXgpK3JlcCt0ZW1wbGF0ZS5zdWJzdHJpbmcoX21hdGNoLmluZGV4K19tYXRjaFswXS5sZW5ndGgpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBwYXJzZVRlbXBsYXRlO1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XG5pbXBvcnQge2xvZ0NvbmZpcm19IGZyb20gXCIuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9sb2ctY29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgRE9JX01BSUxfREVGQVVMVF9FTUFJTF9GUk9NIH0gZnJvbSAnLi4vLi4vLi4vc3RhcnR1cC9zZXJ2ZXIvZW1haWwtY29uZmlndXJhdGlvbi5qcyc7XG5cbmNvbnN0IFNlbmRNYWlsU2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIGZyb206IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgcmVnRXg6IFNpbXBsZVNjaGVtYS5SZWdFeC5FbWFpbFxuICB9LFxuICB0bzoge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICByZWdFeDogU2ltcGxlU2NoZW1hLlJlZ0V4LkVtYWlsXG4gIH0sXG4gIHN1YmplY3Q6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gIH0sXG4gIG1lc3NhZ2U6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gIH0sXG4gIHJldHVyblBhdGg6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgcmVnRXg6IFNpbXBsZVNjaGVtYS5SZWdFeC5FbWFpbFxuICB9XG59KTtcblxuY29uc3Qgc2VuZE1haWwgPSAobWFpbCkgPT4ge1xuICB0cnkge1xuXG4gICAgbWFpbC5mcm9tID0gRE9JX01BSUxfREVGQVVMVF9FTUFJTF9GUk9NO1xuXG4gICAgY29uc3Qgb3VyTWFpbCA9IG1haWw7XG4gICAgbG9nQ29uZmlybSgnc2VuZGluZyBlbWFpbCB3aXRoIGRhdGE6Jyx7dG86bWFpbC50bywgc3ViamVjdDptYWlsLnN1YmplY3R9KTtcbiAgICBTZW5kTWFpbFNjaGVtYS52YWxpZGF0ZShvdXJNYWlsKTtcbiAgICAvL1RPRE86IFRleHQgZmFsbGJhY2tcbiAgICBFbWFpbC5zZW5kKHtcbiAgICAgIGZyb206IG1haWwuZnJvbSxcbiAgICAgIHRvOiBtYWlsLnRvLFxuICAgICAgc3ViamVjdDogbWFpbC5zdWJqZWN0LFxuICAgICAgaHRtbDogbWFpbC5tZXNzYWdlLFxuICAgICAgaGVhZGVyczoge1xuICAgICAgICAnUmV0dXJuLVBhdGgnOiBtYWlsLnJldHVyblBhdGgsXG4gICAgICB9XG4gICAgfSk7XG5cbiAgfSBjYXRjaCAoZXhjZXB0aW9uKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZW1haWxzLnNlbmQuZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgc2VuZE1haWw7XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCB7IEpvYiB9IGZyb20gJ21ldGVvci92c2l2c2k6am9iLWNvbGxlY3Rpb24nO1xuaW1wb3J0IHsgQmxvY2tjaGFpbkpvYnMgfSBmcm9tICcuLi8uLi8uLi8uLi9zZXJ2ZXIvYXBpL2Jsb2NrY2hhaW5fam9icy5qcyc7XG5cbmNvbnN0IGFkZENoZWNrTmV3VHJhbnNhY3Rpb25zQmxvY2tjaGFpbkpvYiA9ICgpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBqb2IgPSBuZXcgSm9iKEJsb2NrY2hhaW5Kb2JzLCAnY2hlY2tOZXdUcmFuc2FjdGlvbicsIHt9KTtcbiAgICBqb2IucmV0cnkoe3JldHJpZXM6IDYwLCB3YWl0OiAxNSoxMDAwIH0pLnNhdmUoe2NhbmNlbFJlcGVhdHM6IHRydWV9KTtcbiAgfSBjYXRjaCAoZXhjZXB0aW9uKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignam9icy5hZGRDaGVja05ld1RyYW5zYWN0aW9uc0Jsb2NrY2hhaW4uZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgYWRkQ2hlY2tOZXdUcmFuc2FjdGlvbnNCbG9ja2NoYWluSm9iO1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XG5pbXBvcnQgeyBKb2IgfSBmcm9tICdtZXRlb3IvdnNpdnNpOmpvYi1jb2xsZWN0aW9uJztcbmltcG9ydCB7IERBcHBKb2JzIH0gZnJvbSAnLi4vLi4vLi4vLi4vc2VydmVyL2FwaS9kYXBwX2pvYnMuanMnO1xuXG5jb25zdCBBZGRGZXRjaERvaU1haWxEYXRhSm9iU2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIG5hbWU6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfSxcbiAgZG9tYWluOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH1cbn0pO1xuXG5jb25zdCBhZGRGZXRjaERvaU1haWxEYXRhSm9iID0gKGRhdGEpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBvdXJEYXRhID0gZGF0YTtcbiAgICBBZGRGZXRjaERvaU1haWxEYXRhSm9iU2NoZW1hLnZhbGlkYXRlKG91ckRhdGEpO1xuICAgIGNvbnN0IGpvYiA9IG5ldyBKb2IoREFwcEpvYnMsICdmZXRjaERvaU1haWxEYXRhJywgb3VyRGF0YSk7XG4gICAgam9iLnJldHJ5KHtyZXRyaWVzOiA1LCB3YWl0OiAxKjEwKjEwMDAgfSkuc2F2ZSgpOyAvL2NoZWNrIGV2ZXJ5IDEwIHNlY3MgNSB0aW1lc1xuICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdqb2JzLmFkZEZldGNoRG9pTWFpbERhdGEuZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgYWRkRmV0Y2hEb2lNYWlsRGF0YUpvYjtcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IHsgSm9iIH0gZnJvbSAnbWV0ZW9yL3ZzaXZzaTpqb2ItY29sbGVjdGlvbic7XG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XG5pbXBvcnQgeyBCbG9ja2NoYWluSm9icyB9IGZyb20gJy4uLy4uLy4uLy4uL3NlcnZlci9hcGkvYmxvY2tjaGFpbl9qb2JzLmpzJztcblxuY29uc3QgQWRkSW5zZXJ0QmxvY2tjaGFpbkpvYlNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICBuYW1lSWQ6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfSxcbiAgc2lnbmF0dXJlOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH0sXG4gIGRhdGFIYXNoOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIG9wdGlvbmFsOnRydWVcbiAgfSxcbiAgZG9tYWluOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH0sXG4gIHNvaURhdGU6IHtcbiAgICB0eXBlOiBEYXRlXG4gIH1cbn0pO1xuXG5jb25zdCBhZGRJbnNlcnRCbG9ja2NoYWluSm9iID0gKGVudHJ5KSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3Qgb3VyRW50cnkgPSBlbnRyeTtcbiAgICBBZGRJbnNlcnRCbG9ja2NoYWluSm9iU2NoZW1hLnZhbGlkYXRlKG91ckVudHJ5KTtcbiAgICBjb25zdCBqb2IgPSBuZXcgSm9iKEJsb2NrY2hhaW5Kb2JzLCAnaW5zZXJ0Jywgb3VyRW50cnkpO1xuICAgIGpvYi5yZXRyeSh7cmV0cmllczogMTAsIHdhaXQ6IDMqNjAqMTAwMCB9KS5zYXZlKCk7IC8vY2hlY2sgZXZlcnkgMTBzZWMgZm9yIDFoXG4gIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2pvYnMuYWRkSW5zZXJ0QmxvY2tjaGFpbi5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBhZGRJbnNlcnRCbG9ja2NoYWluSm9iO1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgeyBKb2IgfSBmcm9tICdtZXRlb3IvdnNpdnNpOmpvYi1jb2xsZWN0aW9uJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcbmltcG9ydCB7IE1haWxKb2JzIH0gZnJvbSAnLi4vLi4vLi4vLi4vc2VydmVyL2FwaS9tYWlsX2pvYnMuanMnO1xuXG5jb25zdCBBZGRTZW5kTWFpbEpvYlNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICAvKmZyb206IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgcmVnRXg6IFNpbXBsZVNjaGVtYS5SZWdFeC5FbWFpbFxuICB9LCovXG4gIHRvOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIHJlZ0V4OiBTaW1wbGVTY2hlbWEuUmVnRXguRW1haWxcbiAgfSxcbiAgc3ViamVjdDoge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgfSxcbiAgbWVzc2FnZToge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgfSxcbiAgcmV0dXJuUGF0aDoge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICByZWdFeDogU2ltcGxlU2NoZW1hLlJlZ0V4LkVtYWlsXG4gIH1cbn0pO1xuXG5jb25zdCBhZGRTZW5kTWFpbEpvYiA9IChtYWlsKSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3Qgb3VyTWFpbCA9IG1haWw7XG4gICAgQWRkU2VuZE1haWxKb2JTY2hlbWEudmFsaWRhdGUob3VyTWFpbCk7XG4gICAgY29uc3Qgam9iID0gbmV3IEpvYihNYWlsSm9icywgJ3NlbmQnLCBvdXJNYWlsKTtcbiAgICBqb2IucmV0cnkoe3JldHJpZXM6IDUsIHdhaXQ6IDYwKjEwMDAgfSkuc2F2ZSgpO1xuICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdqb2JzLmFkZFNlbmRNYWlsLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGFkZFNlbmRNYWlsSm9iO1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XG5pbXBvcnQgeyBKb2IgfSBmcm9tICdtZXRlb3IvdnNpdnNpOmpvYi1jb2xsZWN0aW9uJztcbmltcG9ydCB7IEJsb2NrY2hhaW5Kb2JzIH0gZnJvbSAnLi4vLi4vLi4vLi4vc2VydmVyL2FwaS9ibG9ja2NoYWluX2pvYnMuanMnO1xuXG5jb25zdCBBZGRVcGRhdGVCbG9ja2NoYWluSm9iU2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIG5hbWVJZDoge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9LFxuICB2YWx1ZToge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9LFxuICBmcm9tSG9zdFVybDoge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9LFxuICBob3N0OiB7XG4gICAgICB0eXBlOiBTdHJpbmdcbiAgfVxufSk7XG5cbmNvbnN0IGFkZFVwZGF0ZUJsb2NrY2hhaW5Kb2IgPSAoZW50cnkpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBvdXJFbnRyeSA9IGVudHJ5O1xuICAgIEFkZFVwZGF0ZUJsb2NrY2hhaW5Kb2JTY2hlbWEudmFsaWRhdGUob3VyRW50cnkpO1xuICAgIGNvbnN0IGpvYiA9IG5ldyBKb2IoQmxvY2tjaGFpbkpvYnMsICd1cGRhdGUnLCBvdXJFbnRyeSk7XG4gICAgam9iLnJldHJ5KHtyZXRyaWVzOiAzNjAsIHdhaXQ6IDEqMTAqMTAwMCB9KS5zYXZlKCk7XG4gIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2pvYnMuYWRkVXBkYXRlQmxvY2tjaGFpbi5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBhZGRVcGRhdGVCbG9ja2NoYWluSm9iO1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgaTE4biBmcm9tICdtZXRlb3IvdW5pdmVyc2U6aTE4bic7XG5cbi8vIHVuaXZlcnNlOmkxOG4gb25seSBidW5kbGVzIHRoZSBkZWZhdWx0IGxhbmd1YWdlIG9uIHRoZSBjbGllbnQgc2lkZS5cbi8vIFRvIGdldCBhIGxpc3Qgb2YgYWxsIGF2aWFsYmxlIGxhbmd1YWdlcyB3aXRoIGF0IGxlYXN0IG9uZSB0cmFuc2xhdGlvbixcbi8vIGkxOG4uZ2V0TGFuZ3VhZ2VzKCkgbXVzdCBiZSBjYWxsZWQgc2VydmVyIHNpZGUuXG5jb25zdCBnZXRMYW5ndWFnZXMgPSAoKSA9PiB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGkxOG4uZ2V0TGFuZ3VhZ2VzKCk7XG4gIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2xhbmd1YWdlcy5nZXQuZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgZ2V0TGFuZ3VhZ2VzO1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XG5pbXBvcnQgeyBNZXRhIH0gZnJvbSAnLi4vLi4vLi4vYXBpL21ldGEvbWV0YS5qcyc7XG5cbmNvbnN0IEFkZE9yVXBkYXRlTWV0YVNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICBrZXk6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfSxcbiAgdmFsdWU6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfVxufSk7XG5cbmNvbnN0IGFkZE9yVXBkYXRlTWV0YSA9IChkYXRhKSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3Qgb3VyRGF0YSA9IGRhdGE7XG4gICAgQWRkT3JVcGRhdGVNZXRhU2NoZW1hLnZhbGlkYXRlKG91ckRhdGEpO1xuICAgIGNvbnN0IG1ldGEgPSBNZXRhLmZpbmRPbmUoe2tleTogb3VyRGF0YS5rZXl9KTtcbiAgICBpZihtZXRhICE9PSB1bmRlZmluZWQpIE1ldGEudXBkYXRlKHtfaWQgOiBtZXRhLl9pZH0sIHskc2V0OiB7XG4gICAgICB2YWx1ZTogb3VyRGF0YS52YWx1ZVxuICAgIH19KTtcbiAgICBlbHNlIHJldHVybiBNZXRhLmluc2VydCh7XG4gICAgICBrZXk6IG91ckRhdGEua2V5LFxuICAgICAgdmFsdWU6IG91ckRhdGEudmFsdWVcbiAgICB9KVxuICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdtZXRhLmFkZE9yVXBkYXRlLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGFkZE9yVXBkYXRlTWV0YTtcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tICdzaW1wbC1zY2hlbWEnO1xuaW1wb3J0IHsgT3B0SW5zIH0gZnJvbSAnLi4vLi4vLi4vYXBpL29wdC1pbnMvb3B0LWlucy5qcyc7XG5cbmNvbnN0IEFkZE9wdEluU2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIG5hbWU6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfVxufSk7XG5cbmNvbnN0IGFkZE9wdEluID0gKG9wdEluKSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3Qgb3VyT3B0SW4gPSBvcHRJbjtcbiAgICBBZGRPcHRJblNjaGVtYS52YWxpZGF0ZShvdXJPcHRJbik7XG4gICAgY29uc3Qgb3B0SW5zID0gT3B0SW5zLmZpbmQoe25hbWVJZDogb3VyT3B0SW4ubmFtZX0pLmZldGNoKCk7XG4gICAgaWYob3B0SW5zLmxlbmd0aCA+IDApIHJldHVybiBvcHRJbnNbMF0uX2lkO1xuICAgIGNvbnN0IG9wdEluSWQgPSBPcHRJbnMuaW5zZXJ0KHtcbiAgICAgIG5hbWVJZDogb3VyT3B0SW4ubmFtZVxuICAgIH0pO1xuICAgIHJldHVybiBvcHRJbklkO1xuICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdvcHQtaW5zLmFkZC5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBhZGRPcHRJbjtcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tICdzaW1wbC1zY2hlbWEnO1xuaW1wb3J0IGFkZFJlY2lwaWVudCBmcm9tICcuLi9yZWNpcGllbnRzL2FkZC5qcyc7XG5pbXBvcnQgYWRkU2VuZGVyIGZyb20gJy4uL3NlbmRlcnMvYWRkLmpzJztcbmltcG9ydCB7IE9wdElucyB9IGZyb20gJy4uLy4uLy4uL2FwaS9vcHQtaW5zL29wdC1pbnMuanMnO1xuaW1wb3J0IHdyaXRlVG9CbG9ja2NoYWluIGZyb20gJy4uL2RvaWNoYWluL3dyaXRlX3RvX2Jsb2NrY2hhaW4uanMnO1xuaW1wb3J0IHtsb2dFcnJvciwgbG9nU2VuZH0gZnJvbSBcIi4uLy4uLy4uL3N0YXJ0dXAvc2VydmVyL2xvZy1jb25maWd1cmF0aW9uXCI7XG5cblxuY29uc3QgQWRkT3B0SW5TY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgcmVjaXBpZW50X21haWw6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgcmVnRXg6IFNpbXBsZVNjaGVtYS5SZWdFeC5FbWFpbFxuICB9LFxuICBzZW5kZXJfbWFpbDoge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICByZWdFeDogU2ltcGxlU2NoZW1hLlJlZ0V4LkVtYWlsXG4gIH0sXG4gIGRhdGE6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgb3B0aW9uYWw6IHRydWVcbiAgfSxcbiAgbWFzdGVyX2RvaToge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgb3B0aW9uYWw6IHRydWVcbiAgfSxcbiAgaW5kZXg6IHtcbiAgICAgIHR5cGU6IFNpbXBsZVNjaGVtYS5JbnRlZ2VyLFxuICAgICAgb3B0aW9uYWw6IHRydWVcbiAgfSxcbiAgb3duZXJJZDoge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICByZWdFeDogU2ltcGxlU2NoZW1hLlJlZ0V4LmlkXG4gIH1cbn0pO1xuXG5jb25zdCBhZGRPcHRJbiA9IChvcHRJbikgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IG91ck9wdEluID0gb3B0SW47XG4gICAgQWRkT3B0SW5TY2hlbWEudmFsaWRhdGUob3VyT3B0SW4pO1xuXG4gICAgY29uc3QgcmVjaXBpZW50ID0ge1xuICAgICAgZW1haWw6IG91ck9wdEluLnJlY2lwaWVudF9tYWlsXG4gICAgfVxuICAgIGNvbnN0IHJlY2lwaWVudElkID0gYWRkUmVjaXBpZW50KHJlY2lwaWVudCk7XG4gICAgY29uc3Qgc2VuZGVyID0ge1xuICAgICAgZW1haWw6IG91ck9wdEluLnNlbmRlcl9tYWlsXG4gICAgfVxuICAgIGNvbnN0IHNlbmRlcklkID0gYWRkU2VuZGVyKHNlbmRlcik7XG4gICAgXG4gICAgY29uc3Qgb3B0SW5zID0gT3B0SW5zLmZpbmQoe3JlY2lwaWVudDogcmVjaXBpZW50SWQsIHNlbmRlcjogc2VuZGVySWR9KS5mZXRjaCgpO1xuICAgIGlmKG9wdElucy5sZW5ndGggPiAwKSByZXR1cm4gb3B0SW5zWzBdLl9pZDsgLy9UT0RPIHdoZW4gU09JIGFscmVhZHkgZXhpc3RzIHJlc2VuZCBlbWFpbD9cblxuICAgIGlmKG91ck9wdEluLmRhdGEgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgSlNPTi5wYXJzZShvdXJPcHRJbi5kYXRhKTtcbiAgICAgIH0gY2F0Y2goZXJyb3IpIHtcbiAgICAgICAgbG9nRXJyb3IoXCJvdXJPcHRJbi5kYXRhOlwiLG91ck9wdEluLmRhdGEpO1xuICAgICAgICB0aHJvdyBcIkludmFsaWQgZGF0YSBqc29uIFwiO1xuICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBjb25zdCBvcHRJbklkID0gT3B0SW5zLmluc2VydCh7XG4gICAgICByZWNpcGllbnQ6IHJlY2lwaWVudElkLFxuICAgICAgc2VuZGVyOiBzZW5kZXJJZCxcbiAgICAgIGluZGV4OiBvdXJPcHRJbi5pbmRleCxcbiAgICAgIG1hc3RlckRvaSA6IG91ck9wdEluLm1hc3Rlcl9kb2ksXG4gICAgICBkYXRhOiBvdXJPcHRJbi5kYXRhLFxuICAgICAgb3duZXJJZDogb3VyT3B0SW4ub3duZXJJZFxuICAgIH0pO1xuICAgIGxvZ1NlbmQoXCJvcHRJbiAoaW5kZXg6XCIrb3VyT3B0SW4uaW5kZXgrXCIgYWRkZWQgdG8gbG9jYWwgZGIgd2l0aCBvcHRJbklkXCIsb3B0SW5JZCk7XG5cbiAgICB3cml0ZVRvQmxvY2tjaGFpbih7aWQ6IG9wdEluSWR9KTtcbiAgICByZXR1cm4gb3B0SW5JZDtcbiAgfSBjYXRjaCAoZXhjZXB0aW9uKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignb3B0LWlucy5hZGRBbmRXcml0ZVRvQmxvY2tjaGFpbi5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBhZGRPcHRJbjtcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tICdzaW1wbC1zY2hlbWEnO1xuaW1wb3J0IHsgQ09ORklSTV9DTElFTlQsIENPTkZJUk1fQUREUkVTUyB9IGZyb20gJy4uLy4uLy4uL3N0YXJ0dXAvc2VydmVyL2RvaWNoYWluLWNvbmZpZ3VyYXRpb24uanMnO1xuaW1wb3J0IHsgT3B0SW5zIH0gZnJvbSAnLi4vLi4vLi4vYXBpL29wdC1pbnMvb3B0LWlucy5qcyc7XG5pbXBvcnQgeyBEb2ljaGFpbkVudHJpZXMgfSBmcm9tICcuLi8uLi8uLi9hcGkvZG9pY2hhaW4vZW50cmllcy5qcyc7XG5pbXBvcnQgZGVjb2RlRG9pSGFzaCBmcm9tICcuLi9lbWFpbHMvZGVjb2RlX2RvaS1oYXNoLmpzJztcbmltcG9ydCB7IHNpZ25NZXNzYWdlIH0gZnJvbSAnLi4vLi4vLi4vLi4vc2VydmVyL2FwaS9kb2ljaGFpbi5qcyc7XG5pbXBvcnQgYWRkVXBkYXRlQmxvY2tjaGFpbkpvYiBmcm9tICcuLi9qb2JzL2FkZF91cGRhdGVfYmxvY2tjaGFpbi5qcyc7XG5pbXBvcnQge2xvZ0NvbmZpcm19IGZyb20gXCIuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9sb2ctY29uZmlndXJhdGlvblwiO1xuXG5jb25zdCBDb25maXJtT3B0SW5TY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgaG9zdDoge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9LFxuICBoYXNoOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH1cbn0pO1xuXG5jb25zdCBjb25maXJtT3B0SW4gPSAocmVxdWVzdCkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IG91clJlcXVlc3QgPSByZXF1ZXN0O1xuICAgIENvbmZpcm1PcHRJblNjaGVtYS52YWxpZGF0ZShvdXJSZXF1ZXN0KTtcbiAgICBjb25zdCBkZWNvZGVkID0gZGVjb2RlRG9pSGFzaCh7aGFzaDogcmVxdWVzdC5oYXNofSk7XG4gICAgY29uc3Qgb3B0SW4gPSBPcHRJbnMuZmluZE9uZSh7X2lkOiBkZWNvZGVkLmlkfSk7XG4gICAgaWYob3B0SW4gPT09IHVuZGVmaW5lZCB8fCBvcHRJbi5jb25maXJtYXRpb25Ub2tlbiAhPT0gZGVjb2RlZC50b2tlbikgdGhyb3cgXCJJbnZhbGlkIGhhc2hcIjtcbiAgICBjb25zdCBjb25maXJtZWRBdCA9IG5ldyBEYXRlKCk7XG5cbiAgICBPcHRJbnMudXBkYXRlKHtfaWQgOiBvcHRJbi5faWR9LHskc2V0Ontjb25maXJtZWRBdDogY29uZmlybWVkQXQsIGNvbmZpcm1lZEJ5OiBvdXJSZXF1ZXN0Lmhvc3R9LCAkdW5zZXQ6IHtjb25maXJtYXRpb25Ub2tlbjogXCJcIn19KTtcblxuICAgIC8vVE9ETyBoZXJlIGZpbmQgYWxsIERvaWNoYWluRW50cmllcyBpbiB0aGUgbG9jYWwgZGF0YWJhc2UgIGFuZCBibG9ja2NoYWluIHdpdGggdGhlIHNhbWUgbWFzdGVyRG9pXG4gICAgY29uc3QgZW50cmllcyA9IERvaWNoYWluRW50cmllcy5maW5kKHskb3I6IFt7bmFtZTogb3B0SW4ubmFtZUlkfSwge21hc3RlckRvaTogb3B0SW4ubmFtZUlkfV19KTtcbiAgICBpZihlbnRyaWVzID09PSB1bmRlZmluZWQpIHRocm93IFwiRG9pY2hhaW4gZW50cnkvZW50cmllcyBub3QgZm91bmRcIjtcblxuICAgIGVudHJpZXMuZm9yRWFjaChlbnRyeSA9PiB7XG4gICAgICAgIGxvZ0NvbmZpcm0oJ2NvbmZpcm1pbmcgRG9pQ2hhaW5FbnRyeTonLGVudHJ5KTtcblxuICAgICAgICBjb25zdCB2YWx1ZSA9IEpTT04ucGFyc2UoZW50cnkudmFsdWUpO1xuICAgICAgICBsb2dDb25maXJtKCdnZXRTaWduYXR1cmUgKG9ubHkgb2YgdmFsdWUhKScsIHZhbHVlKTtcblxuICAgICAgICBjb25zdCBkb2lTaWduYXR1cmUgPSBzaWduTWVzc2FnZShDT05GSVJNX0NMSUVOVCwgQ09ORklSTV9BRERSRVNTLCB2YWx1ZS5zaWduYXR1cmUpO1xuICAgICAgICBsb2dDb25maXJtKCdnb3QgZG9pU2lnbmF0dXJlOicsZG9pU2lnbmF0dXJlKTtcbiAgICAgICAgY29uc3QgZnJvbUhvc3RVcmwgPSB2YWx1ZS5mcm9tO1xuXG4gICAgICAgIGRlbGV0ZSB2YWx1ZS5mcm9tO1xuICAgICAgICB2YWx1ZS5kb2lUaW1lc3RhbXAgPSBjb25maXJtZWRBdC50b0lTT1N0cmluZygpO1xuICAgICAgICB2YWx1ZS5kb2lTaWduYXR1cmUgPSBkb2lTaWduYXR1cmU7XG4gICAgICAgIGNvbnN0IGpzb25WYWx1ZSA9IEpTT04uc3RyaW5naWZ5KHZhbHVlKTtcbiAgICAgICAgbG9nQ29uZmlybSgndXBkYXRpbmcgRG9pY2hhaW4gbmFtZUlkOicrb3B0SW4ubmFtZUlkKycgd2l0aCB2YWx1ZTonLGpzb25WYWx1ZSk7XG5cbiAgICAgICAgYWRkVXBkYXRlQmxvY2tjaGFpbkpvYih7XG4gICAgICAgICAgICBuYW1lSWQ6IGVudHJ5Lm5hbWUsXG4gICAgICAgICAgICB2YWx1ZToganNvblZhbHVlLFxuICAgICAgICAgICAgZnJvbUhvc3RVcmw6IGZyb21Ib3N0VXJsLFxuICAgICAgICAgICAgaG9zdDogb3VyUmVxdWVzdC5ob3N0XG4gICAgICAgIH0pO1xuICAgIH0pO1xuICAgIGxvZ0NvbmZpcm0oJ3JlZGlyZWN0aW5nIHVzZXIgdG86JyxkZWNvZGVkLnJlZGlyZWN0KTtcbiAgICByZXR1cm4gZGVjb2RlZC5yZWRpcmVjdDtcbiAgfSBjYXRjaCAoZXhjZXB0aW9uKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignb3B0LWlucy5jb25maXJtLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNvbmZpcm1PcHRJblxuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XG5pbXBvcnQgeyByYW5kb21CeXRlcyB9IGZyb20gJ2NyeXB0byc7XG5pbXBvcnQgeyBPcHRJbnMgfSBmcm9tICcuLi8uLi8uLi9hcGkvb3B0LWlucy9vcHQtaW5zLmpzJztcblxuY29uc3QgR2VuZXJhdGVEb2lUb2tlblNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICBpZDoge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9XG59KTtcblxuY29uc3QgZ2VuZXJhdGVEb2lUb2tlbiA9IChvcHRJbikgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IG91ck9wdEluID0gb3B0SW47XG4gICAgR2VuZXJhdGVEb2lUb2tlblNjaGVtYS52YWxpZGF0ZShvdXJPcHRJbik7XG4gICAgY29uc3QgdG9rZW4gPSByYW5kb21CeXRlcygzMikudG9TdHJpbmcoJ2hleCcpO1xuICAgIE9wdElucy51cGRhdGUoe19pZCA6IG91ck9wdEluLmlkfSx7JHNldDp7Y29uZmlybWF0aW9uVG9rZW46IHRva2VufX0pO1xuICAgIHJldHVybiB0b2tlbjtcbiAgfSBjYXRjaCAoZXhjZXB0aW9uKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignb3B0LWlucy5nZW5lcmF0ZV9kb2ktdG9rZW4uZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgZ2VuZXJhdGVEb2lUb2tlblxuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XG5pbXBvcnQgeyBPcHRJbnMgfSBmcm9tICcuLi8uLi8uLi9hcGkvb3B0LWlucy9vcHQtaW5zLmpzJztcbmltcG9ydCB7IFJlY2lwaWVudHMgfSBmcm9tICcuLi8uLi8uLi9hcGkvcmVjaXBpZW50cy9yZWNpcGllbnRzLmpzJztcbmltcG9ydCB2ZXJpZnlTaWduYXR1cmUgZnJvbSAnLi4vZG9pY2hhaW4vdmVyaWZ5X3NpZ25hdHVyZS5qcyc7XG5pbXBvcnQge2xvZ1NlbmR9IGZyb20gXCIuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9sb2ctY29uZmlndXJhdGlvblwiO1xuaW1wb3J0IGdldFB1YmxpY0tleUFuZEFkZHJlc3MgZnJvbSBcIi4uL2RvaWNoYWluL2dldF9wdWJsaWNrZXlfYW5kX2FkZHJlc3NfYnlfZG9tYWluXCI7XG5cbmNvbnN0IFVwZGF0ZU9wdEluU3RhdHVzU2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIG5hbWVJZDoge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9LFxuICBzaWduYXR1cmU6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfSxcbiAgaG9zdDoge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgb3B0aW9uYWw6IHRydWVcbiAgfVxufSk7XG5cblxuY29uc3QgdXBkYXRlT3B0SW5TdGF0dXMgPSAoZGF0YSkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IG91ckRhdGEgPSBkYXRhO1xuICAgIGxvZ1NlbmQoJ2NvbmZpcm0gZEFwcCBjb25maXJtcyBvcHRJbjonLEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcbiAgICBVcGRhdGVPcHRJblN0YXR1c1NjaGVtYS52YWxpZGF0ZShvdXJEYXRhKTtcbiAgICBjb25zdCBvcHRJbiA9IE9wdElucy5maW5kT25lKHtuYW1lSWQ6IG91ckRhdGEubmFtZUlkfSk7XG4gICAgaWYob3B0SW4gPT09IHVuZGVmaW5lZCkgdGhyb3cgXCJPcHQtSW4gbm90IGZvdW5kXCI7XG4gICAgbG9nU2VuZCgnY29uZmlybSBkQXBwIGNvbmZpcm1zIG9wdEluOicsb3VyRGF0YS5uYW1lSWQpO1xuXG4gICAgY29uc3QgcmVjaXBpZW50ID0gUmVjaXBpZW50cy5maW5kT25lKHtfaWQ6IG9wdEluLnJlY2lwaWVudH0pO1xuICAgIGlmKHJlY2lwaWVudCA9PT0gdW5kZWZpbmVkKSB0aHJvdyBcIlJlY2lwaWVudCBub3QgZm91bmRcIjtcbiAgICBjb25zdCBwYXJ0cyA9IHJlY2lwaWVudC5lbWFpbC5zcGxpdChcIkBcIik7XG4gICAgY29uc3QgZG9tYWluID0gcGFydHNbcGFydHMubGVuZ3RoLTFdO1xuICAgIGNvbnN0IHB1YmxpY0tleUFuZEFkZHJlc3MgPSBnZXRQdWJsaWNLZXlBbmRBZGRyZXNzKHtkb21haW46ZG9tYWlufSk7XG5cbiAgICAvL1RPRE8gZ2V0dGluZyBpbmZvcm1hdGlvbiBmcm9tIEJvYiB0aGF0IGEgY2VydGFpbiBuYW1lSWQgKERPSSkgZ290IGNvbmZpcm1lZC5cbiAgICBpZighdmVyaWZ5U2lnbmF0dXJlKHtwdWJsaWNLZXk6IHB1YmxpY0tleUFuZEFkZHJlc3MucHVibGljS2V5LCBkYXRhOiBvdXJEYXRhLm5hbWVJZCwgc2lnbmF0dXJlOiBvdXJEYXRhLnNpZ25hdHVyZX0pKSB7XG4gICAgICB0aHJvdyBcIkFjY2VzcyBkZW5pZWRcIjtcbiAgICB9XG4gICAgbG9nU2VuZCgnc2lnbmF0dXJlIHZhbGlkIGZvciBwdWJsaWNLZXknLCBwdWJsaWNLZXlBbmRBZGRyZXNzLnB1YmxpY0tleSk7XG5cbiAgICBPcHRJbnMudXBkYXRlKHtfaWQgOiBvcHRJbi5faWR9LHskc2V0Ontjb25maXJtZWRBdDogbmV3IERhdGUoKSwgY29uZmlybWVkQnk6IG91ckRhdGEuaG9zdH19KTtcbiAgfSBjYXRjaCAoZXhjZXB0aW9uKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZGFwcHMuc2VuZC51cGRhdGVPcHRJblN0YXR1cy5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCB1cGRhdGVPcHRJblN0YXR1cztcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tICdzaW1wbC1zY2hlbWEnO1xuaW1wb3J0IHsgVkVSSUZZX0NMSUVOVCB9IGZyb20gJy4uLy4uLy4uL3N0YXJ0dXAvc2VydmVyL2RvaWNoYWluLWNvbmZpZ3VyYXRpb24uanMnO1xuaW1wb3J0IHsgbmFtZVNob3cgfSBmcm9tICcuLi8uLi8uLi8uLi9zZXJ2ZXIvYXBpL2RvaWNoYWluLmpzJztcbmltcG9ydCBnZXRPcHRJblByb3ZpZGVyIGZyb20gJy4uL2Rucy9nZXRfb3B0LWluLXByb3ZpZGVyLmpzJztcbmltcG9ydCBnZXRPcHRJbktleSBmcm9tICcuLi9kbnMvZ2V0X29wdC1pbi1rZXkuanMnO1xuaW1wb3J0IHZlcmlmeVNpZ25hdHVyZSBmcm9tICcuLi9kb2ljaGFpbi92ZXJpZnlfc2lnbmF0dXJlLmpzJztcbmltcG9ydCB7bG9nVmVyaWZ5fSBmcm9tIFwiLi4vLi4vLi4vc3RhcnR1cC9zZXJ2ZXIvbG9nLWNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCBnZXRQdWJsaWNLZXlBbmRBZGRyZXNzIGZyb20gXCIuLi9kb2ljaGFpbi9nZXRfcHVibGlja2V5X2FuZF9hZGRyZXNzX2J5X2RvbWFpblwiO1xuXG5jb25zdCBWZXJpZnlPcHRJblNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICByZWNpcGllbnRfbWFpbDoge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICByZWdFeDogU2ltcGxlU2NoZW1hLlJlZ0V4LkVtYWlsXG4gIH0sXG4gIHNlbmRlcl9tYWlsOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIHJlZ0V4OiBTaW1wbGVTY2hlbWEuUmVnRXguRW1haWxcbiAgfSxcbiAgbmFtZV9pZDoge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9LFxuICByZWNpcGllbnRfcHVibGljX2tleToge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9XG59KTtcblxuY29uc3QgdmVyaWZ5T3B0SW4gPSAoZGF0YSkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IG91ckRhdGEgPSBkYXRhO1xuICAgIFZlcmlmeU9wdEluU2NoZW1hLnZhbGlkYXRlKG91ckRhdGEpO1xuICAgIGNvbnN0IGVudHJ5ID0gbmFtZVNob3coVkVSSUZZX0NMSUVOVCwgb3VyRGF0YS5uYW1lX2lkKTtcbiAgICBpZihlbnRyeSA9PT0gdW5kZWZpbmVkKSByZXR1cm4gZmFsc2U7XG4gICAgY29uc3QgZW50cnlEYXRhID0gSlNPTi5wYXJzZShlbnRyeS52YWx1ZSk7XG4gICAgY29uc3QgZmlyc3RDaGVjayA9IHZlcmlmeVNpZ25hdHVyZSh7XG4gICAgICBkYXRhOiBvdXJEYXRhLnJlY2lwaWVudF9tYWlsK291ckRhdGEuc2VuZGVyX21haWwsXG4gICAgICBzaWduYXR1cmU6IGVudHJ5RGF0YS5zaWduYXR1cmUsXG4gICAgICBwdWJsaWNLZXk6IG91ckRhdGEucmVjaXBpZW50X3B1YmxpY19rZXlcbiAgICB9KVxuXG4gICAgaWYoIWZpcnN0Q2hlY2spIHJldHVybiB7Zmlyc3RDaGVjazogZmFsc2V9O1xuICAgIGNvbnN0IHBhcnRzID0gb3VyRGF0YS5yZWNpcGllbnRfbWFpbC5zcGxpdChcIkBcIik7IC8vVE9ETyBwdXQgdGhpcyBpbnRvIGdldFB1YmxpY0tleUFuZEFkZHJlc3NcbiAgICBjb25zdCBkb21haW4gPSBwYXJ0c1twYXJ0cy5sZW5ndGgtMV07XG4gICAgY29uc3QgcHVibGljS2V5QW5kQWRkcmVzcyA9IGdldFB1YmxpY0tleUFuZEFkZHJlc3Moe2RvbWFpbjogZG9tYWlufSk7XG5cbiAgICBjb25zdCBzZWNvbmRDaGVjayA9IHZlcmlmeVNpZ25hdHVyZSh7XG4gICAgICBkYXRhOiBlbnRyeURhdGEuc2lnbmF0dXJlLFxuICAgICAgc2lnbmF0dXJlOiBlbnRyeURhdGEuZG9pU2lnbmF0dXJlLFxuICAgICAgcHVibGljS2V5OiBwdWJsaWNLZXlBbmRBZGRyZXNzLnB1YmxpY0tleVxuICAgIH0pXG5cbiAgICBpZighc2Vjb25kQ2hlY2spIHJldHVybiB7c2Vjb25kQ2hlY2s6IGZhbHNlfTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBjYXRjaCAoZXhjZXB0aW9uKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignb3B0LWlucy52ZXJpZnkuZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgdmVyaWZ5T3B0SW5cbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tICdzaW1wbC1zY2hlbWEnO1xuaW1wb3J0IHsgUmVjaXBpZW50cyB9IGZyb20gJy4uLy4uLy4uL2FwaS9yZWNpcGllbnRzL3JlY2lwaWVudHMuanMnO1xuaW1wb3J0IGdldEtleVBhaXIgZnJvbSAnLi4vZG9pY2hhaW4vZ2V0X2tleS1wYWlyLmpzJztcblxuY29uc3QgQWRkUmVjaXBpZW50U2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIGVtYWlsOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIHJlZ0V4OiBTaW1wbGVTY2hlbWEuUmVnRXguRW1haWxcbiAgfVxufSk7XG5cbmNvbnN0IGFkZFJlY2lwaWVudCA9IChyZWNpcGllbnQpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBvdXJSZWNpcGllbnQgPSByZWNpcGllbnQ7XG4gICAgQWRkUmVjaXBpZW50U2NoZW1hLnZhbGlkYXRlKG91clJlY2lwaWVudCk7XG4gICAgY29uc3QgcmVjaXBpZW50cyA9IFJlY2lwaWVudHMuZmluZCh7ZW1haWw6IHJlY2lwaWVudC5lbWFpbH0pLmZldGNoKCk7XG4gICAgaWYocmVjaXBpZW50cy5sZW5ndGggPiAwKSByZXR1cm4gcmVjaXBpZW50c1swXS5faWQ7XG4gICAgY29uc3Qga2V5UGFpciA9IGdldEtleVBhaXIoKTtcbiAgICByZXR1cm4gUmVjaXBpZW50cy5pbnNlcnQoe1xuICAgICAgZW1haWw6IG91clJlY2lwaWVudC5lbWFpbCxcbiAgICAgIHByaXZhdGVLZXk6IGtleVBhaXIucHJpdmF0ZUtleSxcbiAgICAgIHB1YmxpY0tleToga2V5UGFpci5wdWJsaWNLZXlcbiAgICB9KVxuICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdyZWNpcGllbnRzLmFkZC5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBhZGRSZWNpcGllbnQ7XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcbmltcG9ydCB7IFNlbmRlcnMgfSBmcm9tICcuLi8uLi8uLi9hcGkvc2VuZGVycy9zZW5kZXJzLmpzJztcblxuY29uc3QgQWRkU2VuZGVyU2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIGVtYWlsOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIHJlZ0V4OiBTaW1wbGVTY2hlbWEuUmVnRXguRW1haWxcbiAgfVxufSk7XG5cbmNvbnN0IGFkZFNlbmRlciA9IChzZW5kZXIpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBvdXJTZW5kZXIgPSBzZW5kZXI7XG4gICAgQWRkU2VuZGVyU2NoZW1hLnZhbGlkYXRlKG91clNlbmRlcik7XG4gICAgY29uc3Qgc2VuZGVycyA9IFNlbmRlcnMuZmluZCh7ZW1haWw6IHNlbmRlci5lbWFpbH0pLmZldGNoKCk7XG4gICAgaWYoc2VuZGVycy5sZW5ndGggPiAwKSByZXR1cm4gc2VuZGVyc1swXS5faWQ7XG4gICAgcmV0dXJuIFNlbmRlcnMuaW5zZXJ0KHtcbiAgICAgIGVtYWlsOiBvdXJTZW5kZXIuZW1haWxcbiAgICB9KVxuICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdzZW5kZXJzLmFkZC5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBhZGRTZW5kZXI7XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcblxuZXhwb3J0IGZ1bmN0aW9uIGlzRGVidWcoKSB7XG4gIGlmKE1ldGVvci5zZXR0aW5ncyAhPT0gdW5kZWZpbmVkICYmXG4gICAgIE1ldGVvci5zZXR0aW5ncy5hcHAgIT09IHVuZGVmaW5lZCAmJlxuICAgICBNZXRlb3Iuc2V0dGluZ3MuYXBwLmRlYnVnICE9PSB1bmRlZmluZWQpIHJldHVybiBNZXRlb3Iuc2V0dGluZ3MuYXBwLmRlYnVnXG4gIHJldHVybiBmYWxzZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzUmVndGVzdCgpIHtcbiAgaWYoTWV0ZW9yLnNldHRpbmdzICE9PSB1bmRlZmluZWQgJiZcbiAgICAgTWV0ZW9yLnNldHRpbmdzLmFwcCAhPT0gdW5kZWZpbmVkICYmXG4gICAgIE1ldGVvci5zZXR0aW5ncy5hcHAucmVndGVzdCAhPT0gdW5kZWZpbmVkKSByZXR1cm4gTWV0ZW9yLnNldHRpbmdzLmFwcC5yZWd0ZXN0XG4gIHJldHVybiBmYWxzZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzVGVzdG5ldCgpIHtcbiAgICBpZihNZXRlb3Iuc2V0dGluZ3MgIT09IHVuZGVmaW5lZCAmJlxuICAgICAgICBNZXRlb3Iuc2V0dGluZ3MuYXBwICE9PSB1bmRlZmluZWQgJiZcbiAgICAgICAgTWV0ZW9yLnNldHRpbmdzLmFwcC50ZXN0bmV0ICE9PSB1bmRlZmluZWQpIHJldHVybiBNZXRlb3Iuc2V0dGluZ3MuYXBwLnRlc3RuZXRcbiAgICByZXR1cm4gZmFsc2U7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRVcmwoKSB7XG4gIGlmKE1ldGVvci5zZXR0aW5ncyAhPT0gdW5kZWZpbmVkICYmXG4gICAgIE1ldGVvci5zZXR0aW5ncy5hcHAgIT09IHVuZGVmaW5lZCAmJlxuICAgICBNZXRlb3Iuc2V0dGluZ3MuYXBwLmhvc3QgIT09IHVuZGVmaW5lZCkge1xuICAgICAgIGxldCBwb3J0ID0gMzAwMDtcbiAgICAgICBpZihNZXRlb3Iuc2V0dGluZ3MuYXBwLnBvcnQgIT09IHVuZGVmaW5lZCkgcG9ydCA9IE1ldGVvci5zZXR0aW5ncy5hcHAucG9ydFxuICAgICAgIHJldHVybiBcImh0dHA6Ly9cIitNZXRlb3Iuc2V0dGluZ3MuYXBwLmhvc3QrXCI6XCIrcG9ydCtcIi9cIjtcbiAgfVxuICByZXR1cm4gTWV0ZW9yLmFic29sdXRlVXJsKCk7XG59XG4iLCJleHBvcnQgY29uc3QgRkFMTEJBQ0tfUFJPVklERVIgPSBcImRvaWNoYWluLm9yZ1wiO1xuIiwiaW1wb3J0IG5hbWVjb2luIGZyb20gJ25hbWVjb2luJztcbmltcG9ydCB7IFNFTkRfQVBQLCBDT05GSVJNX0FQUCwgVkVSSUZZX0FQUCwgaXNBcHBUeXBlIH0gZnJvbSAnLi90eXBlLWNvbmZpZ3VyYXRpb24uanMnO1xuXG52YXIgc2VuZFNldHRpbmdzID0gTWV0ZW9yLnNldHRpbmdzLnNlbmQ7XG52YXIgc2VuZENsaWVudCA9IHVuZGVmaW5lZDtcbmlmKGlzQXBwVHlwZShTRU5EX0FQUCkpIHtcbiAgaWYoIXNlbmRTZXR0aW5ncyB8fCAhc2VuZFNldHRpbmdzLmRvaWNoYWluKVxuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoXCJjb25maWcuc2VuZC5kb2ljaGFpblwiLCBcIlNlbmQgYXBwIGRvaWNoYWluIHNldHRpbmdzIG5vdCBmb3VuZFwiKVxuICBzZW5kQ2xpZW50ID0gY3JlYXRlQ2xpZW50KHNlbmRTZXR0aW5ncy5kb2ljaGFpbik7XG59XG5leHBvcnQgY29uc3QgU0VORF9DTElFTlQgPSBzZW5kQ2xpZW50O1xuXG52YXIgY29uZmlybVNldHRpbmdzID0gTWV0ZW9yLnNldHRpbmdzLmNvbmZpcm07XG52YXIgY29uZmlybUNsaWVudCA9IHVuZGVmaW5lZDtcbnZhciBjb25maXJtQWRkcmVzcyA9IHVuZGVmaW5lZDtcbmlmKGlzQXBwVHlwZShDT05GSVJNX0FQUCkpIHtcbiAgaWYoIWNvbmZpcm1TZXR0aW5ncyB8fCAhY29uZmlybVNldHRpbmdzLmRvaWNoYWluKVxuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoXCJjb25maWcuY29uZmlybS5kb2ljaGFpblwiLCBcIkNvbmZpcm0gYXBwIGRvaWNoYWluIHNldHRpbmdzIG5vdCBmb3VuZFwiKVxuICBjb25maXJtQ2xpZW50ID0gY3JlYXRlQ2xpZW50KGNvbmZpcm1TZXR0aW5ncy5kb2ljaGFpbik7XG4gIGNvbmZpcm1BZGRyZXNzID0gY29uZmlybVNldHRpbmdzLmRvaWNoYWluLmFkZHJlc3M7XG59XG5leHBvcnQgY29uc3QgQ09ORklSTV9DTElFTlQgPSBjb25maXJtQ2xpZW50O1xuZXhwb3J0IGNvbnN0IENPTkZJUk1fQUREUkVTUyA9IGNvbmZpcm1BZGRyZXNzO1xuXG52YXIgdmVyaWZ5U2V0dGluZ3MgPSBNZXRlb3Iuc2V0dGluZ3MudmVyaWZ5O1xudmFyIHZlcmlmeUNsaWVudCA9IHVuZGVmaW5lZDtcbmlmKGlzQXBwVHlwZShWRVJJRllfQVBQKSkge1xuICBpZighdmVyaWZ5U2V0dGluZ3MgfHwgIXZlcmlmeVNldHRpbmdzLmRvaWNoYWluKVxuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoXCJjb25maWcudmVyaWZ5LmRvaWNoYWluXCIsIFwiVmVyaWZ5IGFwcCBkb2ljaGFpbiBzZXR0aW5ncyBub3QgZm91bmRcIilcbiAgdmVyaWZ5Q2xpZW50ID0gY3JlYXRlQ2xpZW50KHZlcmlmeVNldHRpbmdzLmRvaWNoYWluKTtcbn1cbmV4cG9ydCBjb25zdCBWRVJJRllfQ0xJRU5UID0gdmVyaWZ5Q2xpZW50O1xuXG5mdW5jdGlvbiBjcmVhdGVDbGllbnQoc2V0dGluZ3MpIHtcbiAgcmV0dXJuIG5ldyBuYW1lY29pbi5DbGllbnQoe1xuICAgIGhvc3Q6IHNldHRpbmdzLmhvc3QsXG4gICAgcG9ydDogc2V0dGluZ3MucG9ydCxcbiAgICB1c2VyOiBzZXR0aW5ncy51c2VybmFtZSxcbiAgICBwYXNzOiBzZXR0aW5ncy5wYXNzd29yZFxuICB9KTtcbn1cbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IHsgU0VORF9BUFAsIENPTkZJUk1fQVBQLCBpc0FwcFR5cGUgfSBmcm9tICcuL3R5cGUtY29uZmlndXJhdGlvbi5qcyc7XG5pbXBvcnQgSGFzaGlkcyBmcm9tICdoYXNoaWRzJztcbi8vY29uc3QgSGFzaGlkcyA9IHJlcXVpcmUoJ2hhc2hpZHMnKS5kZWZhdWx0O1xuaW1wb3J0IHtsb2dDb25maXJtfSBmcm9tIFwiLi9sb2ctY29uZmlndXJhdGlvblwiO1xuXG5leHBvcnQgY29uc3QgSGFzaElkcyA9IG5ldyBIYXNoaWRzKCcweHVnbUxlN055ZWU2dmsxaUY4OCg2Q213cHFvRzRoUSotVDc0dGpZd15PMnZPTyhYbC05MXdBOCpuQ2dfbFgkJyk7XG5cbnZhciBzZW5kU2V0dGluZ3MgPSBNZXRlb3Iuc2V0dGluZ3Muc2VuZDtcbnZhciBkb2lNYWlsRmV0Y2hVcmwgPSB1bmRlZmluZWQ7XG5cbmlmKGlzQXBwVHlwZShTRU5EX0FQUCkpIHtcbiAgaWYoIXNlbmRTZXR0aW5ncyB8fCAhc2VuZFNldHRpbmdzLmRvaU1haWxGZXRjaFVybClcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFwiY29uZmlnLnNlbmQuZW1haWxcIiwgXCJTZXR0aW5ncyBub3QgZm91bmRcIik7XG4gIGRvaU1haWxGZXRjaFVybCA9IHNlbmRTZXR0aW5ncy5kb2lNYWlsRmV0Y2hVcmw7XG59XG5leHBvcnQgY29uc3QgRE9JX01BSUxfRkVUQ0hfVVJMID0gZG9pTWFpbEZldGNoVXJsO1xuXG52YXIgZGVmYXVsdEZyb20gPSB1bmRlZmluZWQ7XG5pZihpc0FwcFR5cGUoQ09ORklSTV9BUFApKSB7XG4gIHZhciBjb25maXJtU2V0dGluZ3MgPSBNZXRlb3Iuc2V0dGluZ3MuY29uZmlybTtcblxuICBpZighY29uZmlybVNldHRpbmdzIHx8ICFjb25maXJtU2V0dGluZ3Muc210cClcbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcihcImNvbmZpZy5jb25maXJtLnNtdHBcIiwgXCJDb25maXJtIGFwcCBlbWFpbCBzbXRwIHNldHRpbmdzIG5vdCBmb3VuZFwiKVxuXG4gIGlmKCFjb25maXJtU2V0dGluZ3Muc210cC5kZWZhdWx0RnJvbSlcbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcihcImNvbmZpZy5jb25maXJtLmRlZmF1bHRGcm9tXCIsIFwiQ29uZmlybSBhcHAgZW1haWwgZGVmYXVsdEZyb20gbm90IGZvdW5kXCIpXG5cbiAgZGVmYXVsdEZyb20gID0gIGNvbmZpcm1TZXR0aW5ncy5zbXRwLmRlZmF1bHRGcm9tO1xuXG4gIGxvZ0NvbmZpcm0oJ3NlbmRpbmcgd2l0aCBkZWZhdWx0RnJvbTonLGRlZmF1bHRGcm9tKTtcblxuICBNZXRlb3Iuc3RhcnR1cCgoKSA9PiB7XG5cbiAgIGlmKGNvbmZpcm1TZXR0aW5ncy5zbXRwLnVzZXJuYW1lID09PSB1bmRlZmluZWQpe1xuICAgICAgIHByb2Nlc3MuZW52Lk1BSUxfVVJMID0gJ3NtdHA6Ly8nICtcbiAgICAgICAgICAgZW5jb2RlVVJJQ29tcG9uZW50KGNvbmZpcm1TZXR0aW5ncy5zbXRwLnNlcnZlcikgK1xuICAgICAgICAgICAnOicgK1xuICAgICAgICAgICBjb25maXJtU2V0dGluZ3Muc210cC5wb3J0O1xuICAgfWVsc2V7XG4gICAgICAgcHJvY2Vzcy5lbnYuTUFJTF9VUkwgPSAnc210cDovLycgK1xuICAgICAgICAgICBlbmNvZGVVUklDb21wb25lbnQoY29uZmlybVNldHRpbmdzLnNtdHAudXNlcm5hbWUpICtcbiAgICAgICAgICAgJzonICsgZW5jb2RlVVJJQ29tcG9uZW50KGNvbmZpcm1TZXR0aW5ncy5zbXRwLnBhc3N3b3JkKSArXG4gICAgICAgICAgICdAJyArIGVuY29kZVVSSUNvbXBvbmVudChjb25maXJtU2V0dGluZ3Muc210cC5zZXJ2ZXIpICtcbiAgICAgICAgICAgJzonICtcbiAgICAgICAgICAgY29uZmlybVNldHRpbmdzLnNtdHAucG9ydDtcbiAgIH1cblxuICAgbG9nQ29uZmlybSgndXNpbmcgTUFJTF9VUkw6Jyxwcm9jZXNzLmVudi5NQUlMX1VSTCk7XG5cbiAgIGlmKGNvbmZpcm1TZXR0aW5ncy5zbXRwLk5PREVfVExTX1JFSkVDVF9VTkFVVEhPUklaRUQhPT11bmRlZmluZWQpXG4gICAgICAgcHJvY2Vzcy5lbnYuTk9ERV9UTFNfUkVKRUNUX1VOQVVUSE9SSVpFRCA9IGNvbmZpcm1TZXR0aW5ncy5zbXRwLk5PREVfVExTX1JFSkVDVF9VTkFVVEhPUklaRUQ7IC8vMFxuICB9KTtcbn1cbmV4cG9ydCBjb25zdCBET0lfTUFJTF9ERUZBVUxUX0VNQUlMX0ZST00gPSBkZWZhdWx0RnJvbTtcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IHsgUm9sZXMgfSBmcm9tICdtZXRlb3IvYWxhbm5pbmc6cm9sZXMnO1xuXG5NZXRlb3Iuc3RhcnR1cCgoKSA9PiB7XG4gIGlmKE1ldGVvci51c2Vycy5maW5kKCkuY291bnQoKSA9PT0gMCkge1xuICAgIGNvbnN0IGlkID0gQWNjb3VudHMuY3JlYXRlVXNlcih7XG4gICAgICB1c2VybmFtZTogJ2FkbWluJyxcbiAgICAgIGVtYWlsOiAnYWRtaW5Ac2VuZGVmZmVjdC5kZScsXG4gICAgICBwYXNzd29yZDogJ3Bhc3N3b3JkJ1xuICAgIH0pO1xuICAgIFJvbGVzLmFkZFVzZXJzVG9Sb2xlcyhpZCwgJ2FkbWluJyk7XG4gIH1cbn0pO1xuIiwiaW1wb3J0ICcuL2xvZy1jb25maWd1cmF0aW9uLmpzJztcbmltcG9ydCAnLi9kYXBwLWNvbmZpZ3VyYXRpb24uanMnO1xuaW1wb3J0ICcuL3R5cGUtY29uZmlndXJhdGlvbi5qcyc7XG5pbXBvcnQgJy4vZG5zLWNvbmZpZ3VyYXRpb24uanMnO1xuaW1wb3J0ICcuL2RvaWNoYWluLWNvbmZpZ3VyYXRpb24uanMnO1xuaW1wb3J0ICcuL2ZpeHR1cmVzLmpzJztcbmltcG9ydCAnLi9yZWdpc3Rlci1hcGkuanMnO1xuaW1wb3J0ICcuL3VzZXJhY2NvdW50cy1jb25maWd1cmF0aW9uLmpzJztcbmltcG9ydCAnLi9zZWN1cml0eS5qcyc7XG5pbXBvcnQgJy4vZW1haWwtY29uZmlndXJhdGlvbi5qcyc7XG5pbXBvcnQgJy4vam9icy5qcyc7XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCB7IE1haWxKb2JzIH0gZnJvbSAnLi4vLi4vLi4vc2VydmVyL2FwaS9tYWlsX2pvYnMuanMnO1xuaW1wb3J0IHsgQmxvY2tjaGFpbkpvYnMgfSBmcm9tICcuLi8uLi8uLi9zZXJ2ZXIvYXBpL2Jsb2NrY2hhaW5fam9icy5qcyc7XG5pbXBvcnQgeyBEQXBwSm9icyB9IGZyb20gJy4uLy4uLy4uL3NlcnZlci9hcGkvZGFwcF9qb2JzLmpzJztcbmltcG9ydCB7IENPTkZJUk1fQVBQLCBpc0FwcFR5cGUgfSBmcm9tICcuL3R5cGUtY29uZmlndXJhdGlvbi5qcyc7XG5pbXBvcnQgYWRkQ2hlY2tOZXdUcmFuc2FjdGlvbnNCbG9ja2NoYWluSm9iIGZyb20gJy4uLy4uL21vZHVsZXMvc2VydmVyL2pvYnMvYWRkX2NoZWNrX25ld190cmFuc2FjdGlvbnMuanMnO1xuXG5NZXRlb3Iuc3RhcnR1cCgoKSA9PiB7XG4gIE1haWxKb2JzLnN0YXJ0Sm9iU2VydmVyKCk7XG4gIEJsb2NrY2hhaW5Kb2JzLnN0YXJ0Sm9iU2VydmVyKCk7XG4gIERBcHBKb2JzLnN0YXJ0Sm9iU2VydmVyKCk7XG4gIGlmKGlzQXBwVHlwZShDT05GSVJNX0FQUCkpIGFkZENoZWNrTmV3VHJhbnNhY3Rpb25zQmxvY2tjaGFpbkpvYigpO1xufSk7XG4iLCJpbXBvcnQge2lzRGVidWd9IGZyb20gXCIuL2RhcHAtY29uZmlndXJhdGlvblwiO1xuXG5yZXF1aXJlKCdzY3JpYmUtanMnKSgpO1xuXG5leHBvcnQgY29uc3QgY29uc29sZSA9IHByb2Nlc3MuY29uc29sZTtcbmV4cG9ydCBjb25zdCBzZW5kTW9kZVRhZ0NvbG9yID0ge21zZyA6ICdzZW5kLW1vZGUnLCBjb2xvcnMgOiBbJ3llbGxvdycsICdpbnZlcnNlJ119O1xuZXhwb3J0IGNvbnN0IGNvbmZpcm1Nb2RlVGFnQ29sb3IgPSB7bXNnIDogJ2NvbmZpcm0tbW9kZScsIGNvbG9ycyA6IFsnYmx1ZScsICdpbnZlcnNlJ119O1xuZXhwb3J0IGNvbnN0IHZlcmlmeU1vZGVUYWdDb2xvciA9IHttc2cgOiAndmVyaWZ5LW1vZGUnLCBjb2xvcnMgOiBbJ2dyZWVuJywgJ2ludmVyc2UnXX07XG5leHBvcnQgY29uc3QgYmxvY2tjaGFpbk1vZGVUYWdDb2xvciA9IHttc2cgOiAnYmxvY2tjaGFpbi1tb2RlJywgY29sb3JzIDogWyd3aGl0ZScsICdpbnZlcnNlJ119O1xuZXhwb3J0IGNvbnN0IHRlc3RpbmdNb2RlVGFnQ29sb3IgPSB7bXNnIDogJ3Rlc3RpbmctbW9kZScsIGNvbG9ycyA6IFsnb3JhbmdlJywgJ2ludmVyc2UnXX07XG5cbmV4cG9ydCBmdW5jdGlvbiBsb2dTZW5kKG1lc3NhZ2UscGFyYW0pIHtcbiAgICBpZihpc0RlYnVnKCkpIHtjb25zb2xlLnRpbWUoKS50YWcoc2VuZE1vZGVUYWdDb2xvcikubG9nKG1lc3NhZ2UscGFyYW0/cGFyYW06JycpO31cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxvZ0NvbmZpcm0obWVzc2FnZSxwYXJhbSkge1xuICAgIGlmKGlzRGVidWcoKSkge2NvbnNvbGUudGltZSgpLnRhZyhjb25maXJtTW9kZVRhZ0NvbG9yKS5sb2cobWVzc2FnZSwgcGFyYW0/cGFyYW06JycpO31cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxvZ1ZlcmlmeShtZXNzYWdlLCBwYXJhbSkge1xuICAgIGlmKGlzRGVidWcoKSkge2NvbnNvbGUudGltZSgpLnRhZyh2ZXJpZnlNb2RlVGFnQ29sb3IpLmxvZyhtZXNzYWdlLCBwYXJhbT9wYXJhbTonJyk7fVxufVxuXG5leHBvcnQgZnVuY3Rpb24gbG9nQmxvY2tjaGFpbihtZXNzYWdlLCBwYXJhbSkge1xuICAgIGlmKGlzRGVidWcoKSl7Y29uc29sZS50aW1lKCkudGFnKGJsb2NrY2hhaW5Nb2RlVGFnQ29sb3IpLmxvZyhtZXNzYWdlLCBwYXJhbT9wYXJhbTonJyk7fVxufVxuXG5leHBvcnQgZnVuY3Rpb24gbG9nTWFpbihtZXNzYWdlLCBwYXJhbSkge1xuICAgIGlmKGlzRGVidWcoKSl7Y29uc29sZS50aW1lKCkudGFnKGJsb2NrY2hhaW5Nb2RlVGFnQ29sb3IpLmxvZyhtZXNzYWdlLCBwYXJhbT9wYXJhbTonJyk7fVxufVxuXG5leHBvcnQgZnVuY3Rpb24gbG9nRXJyb3IobWVzc2FnZSwgcGFyYW0pIHtcbiAgICBpZihpc0RlYnVnKCkpe2NvbnNvbGUudGltZSgpLnRhZyhibG9ja2NoYWluTW9kZVRhZ0NvbG9yKS5lcnJvcihtZXNzYWdlLCBwYXJhbT9wYXJhbTonJyk7fVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdGVzdExvZ2dpbmcobWVzc2FnZSwgcGFyYW0pIHtcbiAgICBpZihpc0RlYnVnKCkpe2NvbnNvbGUudGltZSgpLnRhZyh0ZXN0aW5nTW9kZVRhZ0NvbG9yKS5sb2cobWVzc2FnZSwgcGFyYW0/cGFyYW06JycpO31cbn0iLCJpbXBvcnQgJy4uLy4uL2FwaS9sYW5ndWFnZXMvbWV0aG9kcy5qcyc7XG5pbXBvcnQgJy4uLy4uL2FwaS9kb2ljaGFpbi9tZXRob2RzLmpzJztcbmltcG9ydCAnLi4vLi4vYXBpL3JlY2lwaWVudHMvc2VydmVyL3B1YmxpY2F0aW9ucy5qcyc7XG5pbXBvcnQgJy4uLy4uL2FwaS9vcHQtaW5zL21ldGhvZHMuanMnO1xuaW1wb3J0ICcuLi8uLi9hcGkvb3B0LWlucy9zZXJ2ZXIvcHVibGljYXRpb25zLmpzJztcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IHsgRERQUmF0ZUxpbWl0ZXIgfSBmcm9tICdtZXRlb3IvZGRwLXJhdGUtbGltaXRlcic7XG5pbXBvcnQgeyBfIH0gZnJvbSAnbWV0ZW9yL3VuZGVyc2NvcmUnO1xuXG4vLyBEb24ndCBsZXQgcGVvcGxlIHdyaXRlIGFyYml0cmFyeSBkYXRhIHRvIHRoZWlyICdwcm9maWxlJyBmaWVsZCBmcm9tIHRoZSBjbGllbnRcbk1ldGVvci51c2Vycy5kZW55KHtcbiAgdXBkYXRlKCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9LFxufSk7XG5cbi8vIEdldCBhIGxpc3Qgb2YgYWxsIGFjY291bnRzIG1ldGhvZHMgYnkgcnVubmluZyBgTWV0ZW9yLnNlcnZlci5tZXRob2RfaGFuZGxlcnNgIGluIG1ldGVvciBzaGVsbFxuY29uc3QgQVVUSF9NRVRIT0RTID0gW1xuICAnbG9naW4nLFxuICAnbG9nb3V0JyxcbiAgJ2xvZ291dE90aGVyQ2xpZW50cycsXG4gICdnZXROZXdUb2tlbicsXG4gICdyZW1vdmVPdGhlclRva2VucycsXG4gICdjb25maWd1cmVMb2dpblNlcnZpY2UnLFxuICAnY2hhbmdlUGFzc3dvcmQnLFxuICAnZm9yZ290UGFzc3dvcmQnLFxuICAncmVzZXRQYXNzd29yZCcsXG4gICd2ZXJpZnlFbWFpbCcsXG4gICdjcmVhdGVVc2VyJyxcbiAgJ0FUUmVtb3ZlU2VydmljZScsXG4gICdBVENyZWF0ZVVzZXJTZXJ2ZXInLFxuICAnQVRSZXNlbmRWZXJpZmljYXRpb25FbWFpbCcsXG5dO1xuXG5pZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIC8vIE9ubHkgYWxsb3cgMiBsb2dpbiBhdHRlbXB0cyBwZXIgY29ubmVjdGlvbiBwZXIgNSBzZWNvbmRzXG4gIEREUFJhdGVMaW1pdGVyLmFkZFJ1bGUoe1xuICAgIG5hbWUobmFtZSkge1xuICAgICAgcmV0dXJuIF8uY29udGFpbnMoQVVUSF9NRVRIT0RTLCBuYW1lKTtcbiAgICB9LFxuXG4gICAgLy8gUmF0ZSBsaW1pdCBwZXIgY29ubmVjdGlvbiBJRFxuICAgIGNvbm5lY3Rpb25JZCgpIHsgcmV0dXJuIHRydWU7IH0sXG4gIH0sIDIsIDUwMDApO1xufVxuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5leHBvcnQgY29uc3QgU0VORF9BUFAgPSBcInNlbmRcIjtcbmV4cG9ydCBjb25zdCBDT05GSVJNX0FQUCA9IFwiY29uZmlybVwiO1xuZXhwb3J0IGNvbnN0IFZFUklGWV9BUFAgPSBcInZlcmlmeVwiO1xuZXhwb3J0IGZ1bmN0aW9uIGlzQXBwVHlwZSh0eXBlKSB7XG4gIGlmKE1ldGVvci5zZXR0aW5ncyA9PT0gdW5kZWZpbmVkIHx8IE1ldGVvci5zZXR0aW5ncy5hcHAgPT09IHVuZGVmaW5lZCkgdGhyb3cgXCJObyBzZXR0aW5ncyBmb3VuZCFcIlxuICBjb25zdCB0eXBlcyA9IE1ldGVvci5zZXR0aW5ncy5hcHAudHlwZXM7XG4gIGlmKHR5cGVzICE9PSB1bmRlZmluZWQpIHJldHVybiB0eXBlcy5pbmNsdWRlcyh0eXBlKTtcbiAgcmV0dXJuIGZhbHNlO1xufVxuIiwiaW1wb3J0IHsgQWNjb3VudHMgfSBmcm9tICdtZXRlb3IvYWNjb3VudHMtYmFzZSc7XG5BY2NvdW50cy5jb25maWcoe1xuICAgIHNlbmRWZXJpZmljYXRpb25FbWFpbDogdHJ1ZSxcbiAgICBmb3JiaWRDbGllbnRBY2NvdW50Q3JlYXRpb246IGZhbHNlXG59KTtcblxuXG5cbkFjY291bnRzLmVtYWlsVGVtcGxhdGVzLmZyb209J2RvaWNoYWluQGxlLXNwYWNlLmRlJzsiLCJpbXBvcnQgeyBBcGksIERPSV9XQUxMRVROT1RJRllfUk9VVEUsIERPSV9DT05GSVJNQVRJT05fUk9VVEUgfSBmcm9tICcuLi9yZXN0LmpzJztcbmltcG9ydCBjb25maXJtT3B0SW4gZnJvbSAnLi4vLi4vLi4vLi4vaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9vcHQtaW5zL2NvbmZpcm0uanMnXG5pbXBvcnQgY2hlY2tOZXdUcmFuc2FjdGlvbiBmcm9tIFwiLi4vLi4vLi4vLi4vaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9kb2ljaGFpbi9jaGVja19uZXdfdHJhbnNhY3Rpb25zXCI7XG5pbXBvcnQge2xvZ0NvbmZpcm19IGZyb20gXCIuLi8uLi8uLi8uLi9pbXBvcnRzL3N0YXJ0dXAvc2VydmVyL2xvZy1jb25maWd1cmF0aW9uXCI7XG4vL2Rva3Ugb2YgbWV0ZW9yLXJlc3RpdnVzIGh0dHBzOi8vZ2l0aHViLmNvbS9rYWhtYWxpL21ldGVvci1yZXN0aXZ1c1xuQXBpLmFkZFJvdXRlKERPSV9DT05GSVJNQVRJT05fUk9VVEUrJy86aGFzaCcsIHthdXRoUmVxdWlyZWQ6IGZhbHNlfSwge1xuICBnZXQ6IHtcbiAgICBhY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgaGFzaCA9IHRoaXMudXJsUGFyYW1zLmhhc2g7XG4gICAgICB0cnkge1xuICAgICAgICBsZXQgaXAgPSB0aGlzLnJlcXVlc3QuaGVhZGVyc1sneC1mb3J3YXJkZWQtZm9yJ10gfHxcbiAgICAgICAgICB0aGlzLnJlcXVlc3QuY29ubmVjdGlvbi5yZW1vdGVBZGRyZXNzIHx8XG4gICAgICAgICAgdGhpcy5yZXF1ZXN0LnNvY2tldC5yZW1vdGVBZGRyZXNzIHx8XG4gICAgICAgICAgKHRoaXMucmVxdWVzdC5jb25uZWN0aW9uLnNvY2tldCA/IHRoaXMucmVxdWVzdC5jb25uZWN0aW9uLnNvY2tldC5yZW1vdGVBZGRyZXNzOiBudWxsKTtcblxuICAgICAgICAgIGlmKGlwLmluZGV4T2YoJywnKSE9LTEpaXA9aXAuc3Vic3RyaW5nKDAsaXAuaW5kZXhPZignLCcpKTtcblxuICAgICAgICAgIGxvZ0NvbmZpcm0oJ1JFU1Qgb3B0LWluL2NvbmZpcm0gOicse2hhc2g6aGFzaCwgaG9zdDppcH0pO1xuICAgICAgICAgIGNvbnN0IHJlZGlyZWN0ID0gY29uZmlybU9wdEluKHtob3N0OiBpcCwgaGFzaDogaGFzaH0pO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgc3RhdHVzQ29kZTogMzAzLFxuICAgICAgICAgIGhlYWRlcnM6IHsnQ29udGVudC1UeXBlJzogJ3RleHQvcGxhaW4nLCAnTG9jYXRpb24nOiByZWRpcmVjdH0sXG4gICAgICAgICAgYm9keTogJ0xvY2F0aW9uOiAnK3JlZGlyZWN0XG4gICAgICAgIH07XG4gICAgICB9IGNhdGNoKGVycm9yKSB7XG4gICAgICAgIHJldHVybiB7c3RhdHVzQ29kZTogNTAwLCBib2R5OiB7c3RhdHVzOiAnZmFpbCcsIG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2V9fTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn0pO1xuXG5BcGkuYWRkUm91dGUoRE9JX1dBTExFVE5PVElGWV9ST1VURSwge1xuICAgIGdldDoge1xuICAgICAgICBhdXRoUmVxdWlyZWQ6IGZhbHNlLFxuICAgICAgICBhY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY29uc3QgcGFyYW1zID0gdGhpcy5xdWVyeVBhcmFtcztcbiAgICAgICAgICAgIGNvbnN0IHR4aWQgPSBwYXJhbXMudHg7XG5cbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY2hlY2tOZXdUcmFuc2FjdGlvbih0eGlkKTtcbiAgICAgICAgICAgICAgICByZXR1cm4ge3N0YXR1czogJ3N1Y2Nlc3MnLCAgZGF0YTondHhpZDonK3R4aWQrJyB3YXMgcmVhZCBmcm9tIGJsb2NrY2hhaW4nfTtcbiAgICAgICAgICAgIH0gY2F0Y2goZXJyb3IpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4ge3N0YXR1czogJ2ZhaWwnLCBlcnJvcjogZXJyb3IubWVzc2FnZX07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59KTtcbiIsImltcG9ydCB7IEFwaSB9IGZyb20gJy4uL3Jlc3QuanMnO1xuQXBpLmFkZFJvdXRlKCdkZWJ1Zy9tYWlsJywge2F1dGhSZXF1aXJlZDogZmFsc2V9LCB7XG4gIGdldDoge1xuICAgIGFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBkYXRhID0ge1xuICAgICAgICBcImZyb21cIjogXCJub3JlcGx5QGRvaWNoYWluLm9yZ1wiLFxuICAgICAgICBcInN1YmplY3RcIjogXCJEb2ljaGFpbi5vcmcgTmV3c2xldHRlciBCZXN0w6R0aWd1bmdcIixcbiAgICAgICAgXCJyZWRpcmVjdFwiOiBcImh0dHBzOi8vd3d3LmRvaWNoYWluLm9yZy92aWVsZW4tZGFuay9cIixcbiAgICAgICAgXCJyZXR1cm5QYXRoXCI6IFwibm9yZXBseUBkb2ljaGFpbi5vcmdcIixcbiAgICAgICAgXCJjb250ZW50XCI6XCI8c3R5bGUgdHlwZT0ndGV4dC9jc3MnIG1lZGlhPSdzY3JlZW4nPlxcblwiICtcbiAgICAgICAgICAgIFwiKiB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRsaW5lLWhlaWdodDogaW5oZXJpdDtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcIi5FeHRlcm5hbENsYXNzICoge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0bGluZS1oZWlnaHQ6IDEwMCU7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCJib2R5LCBwIHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdG1hcmdpbjogMDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdHBhZGRpbmc6IDA7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRtYXJnaW4tYm90dG9tOiAwO1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0LXdlYmtpdC10ZXh0LXNpemUtYWRqdXN0OiBub25lO1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0LW1zLXRleHQtc2l6ZS1hZGp1c3Q6IG5vbmU7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCJpbWcge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0bGluZS1oZWlnaHQ6IDEwMCU7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRvdXRsaW5lOiBub25lO1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0dGV4dC1kZWNvcmF0aW9uOiBub25lO1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0LW1zLWludGVycG9sYXRpb24tbW9kZTogYmljdWJpYztcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcImEgaW1nIHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGJvcmRlcjogbm9uZTtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcIiNiYWNrZ3JvdW5kVGFibGUge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0bWFyZ2luOiAwO1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0cGFkZGluZzogMDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdHdpZHRoOiAxMDAlICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCJhLCBhOmxpbmssIC5uby1kZXRlY3QtbG9jYWwgYSwgLmFwcGxlTGlua3MgYSB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRjb2xvcjogIzU1NTVmZiAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0dGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmU7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCIuRXh0ZXJuYWxDbGFzcyB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRkaXNwbGF5OiBibG9jayAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0d2lkdGg6IDEwMCU7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCIuRXh0ZXJuYWxDbGFzcywgLkV4dGVybmFsQ2xhc3MgcCwgLkV4dGVybmFsQ2xhc3Mgc3BhbiwgLkV4dGVybmFsQ2xhc3MgZm9udCwgLkV4dGVybmFsQ2xhc3MgdGQsIC5FeHRlcm5hbENsYXNzIGRpdiB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRsaW5lLWhlaWdodDogaW5oZXJpdDtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcInRhYmxlIHRkIHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGJvcmRlci1jb2xsYXBzZTogY29sbGFwc2U7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRtc28tdGFibGUtbHNwYWNlOiAwcHQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRtc28tdGFibGUtcnNwYWNlOiAwcHQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCJzdXAge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0cG9zaXRpb246IHJlbGF0aXZlO1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0dG9wOiA0cHg7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRsaW5lLWhlaWdodDogN3B4ICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRmb250LXNpemU6IDExcHggIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcIi5tb2JpbGVfbGluayBhW2hyZWZePSd0ZWwnXSwgLm1vYmlsZV9saW5rIGFbaHJlZl49J3NtcyddIHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdHRleHQtZGVjb3JhdGlvbjogZGVmYXVsdDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGNvbG9yOiAjNTU1NWZmICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRwb2ludGVyLWV2ZW50czogYXV0bztcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGN1cnNvcjogZGVmYXVsdDtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcIi5uby1kZXRlY3QgYSB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHR0ZXh0LWRlY29yYXRpb246IG5vbmU7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRjb2xvcjogIzU1NTVmZjtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdHBvaW50ZXItZXZlbnRzOiBhdXRvO1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0Y3Vyc29yOiBkZWZhdWx0O1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwie1xcblwiICtcbiAgICAgICAgICAgIFwiY29sb3I6ICM1NTU1ZmY7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCJzcGFuIHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGNvbG9yOiBpbmhlcml0O1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0Ym9yZGVyLWJvdHRvbTogbm9uZTtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcInNwYW46aG92ZXIge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0YmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCIubm91bmRlcmxpbmUge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0dGV4dC1kZWNvcmF0aW9uOiBub25lICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCJoMSwgaDIsIGgzIHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdG1hcmdpbjogMDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdHBhZGRpbmc6IDA7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCJwIHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdE1hcmdpbjogMHB4ICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCJ0YWJsZVtjbGFzcz0nZW1haWwtcm9vdC13cmFwcGVyJ10ge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0d2lkdGg6IDYwMHB4ICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCJib2R5IHtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcImJvZHkge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0bWluLXdpZHRoOiAyODBweDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdHdpZHRoOiAxMDAlO1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwidGRbY2xhc3M9J3BhdHRlcm4nXSAuYzExMnAyMHIge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0d2lkdGg6IDIwJTtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcInRkW2NsYXNzPSdwYXR0ZXJuJ10gLmMzMzZwNjByIHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdHdpZHRoOiA2MC4wMDAwMDAwMDAwMDAyNTYlO1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwiPC9zdHlsZT5cXG5cIiArXG4gICAgICAgICAgICBcIjxzdHlsZT5cXG5cIiArXG4gICAgICAgICAgICBcIkBtZWRpYSBvbmx5IHNjcmVlbiBhbmQgKG1heC13aWR0aDogNTk5cHgpLCBvbmx5IHNjcmVlbiBhbmQgKG1heC1kZXZpY2Utd2lkdGg6IDU5OXB4KSwgb25seSBzY3JlZW4gYW5kIChtYXgtd2lkdGg6IDQwMHB4KSwgb25seSBzY3JlZW4gYW5kIChtYXgtZGV2aWNlLXdpZHRoOiA0MDBweCkge1xcblwiICtcbiAgICAgICAgICAgIFwiLmVtYWlsLXJvb3Qtd3JhcHBlciB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHR3aWR0aDogMTAwJSAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwiLmZ1bGwtd2lkdGgge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0d2lkdGg6IDEwMCUgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGhlaWdodDogYXV0byAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0dGV4dC1hbGlnbjogY2VudGVyO1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwiLmZ1bGx3aWR0aGhhbGZsZWZ0IHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdHdpZHRoOiAxMDAlICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCIuZnVsbHdpZHRoaGFsZnJpZ2h0IHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdHdpZHRoOiAxMDAlICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCIuZnVsbHdpZHRoaGFsZmlubmVyIHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdHdpZHRoOiAxMDAlICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRtYXJnaW46IDAgYXV0byAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0ZmxvYXQ6IG5vbmUgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdG1hcmdpbi1sZWZ0OiBhdXRvICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRtYXJnaW4tcmlnaHQ6IGF1dG8gIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGNsZWFyOiBib3RoICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCIuaGlkZSB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRkaXNwbGF5OiBub25lICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHR3aWR0aDogMHB4ICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRoZWlnaHQ6IDBweCAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0b3ZlcmZsb3c6IGhpZGRlbjtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcIi5kZXNrdG9wLWhpZGUge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0ZGlzcGxheTogYmxvY2sgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdHdpZHRoOiAxMDAlICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRoZWlnaHQ6IGF1dG8gIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdG92ZXJmbG93OiBoaWRkZW47XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRtYXgtaGVpZ2h0OiBpbmhlcml0ICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCIuYzExMnAyMHIge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0d2lkdGg6IDEwMCUgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGZsb2F0OiBub25lO1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwiLmMzMzZwNjByIHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdHdpZHRoOiAxMDAlICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRmbG9hdDogbm9uZTtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcIjwvc3R5bGU+XFxuXCIgK1xuICAgICAgICAgICAgXCI8c3R5bGU+XFxuXCIgK1xuICAgICAgICAgICAgXCJAbWVkaWEgb25seSBzY3JlZW4gYW5kIChtaW4td2lkdGg6IDYwMHB4KSB7XFxuXCIgK1xuICAgICAgICAgICAgXCJ0ZFtjbGFzcz0ncGF0dGVybiddIC5jMTEycDIwciB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHR3aWR0aDogMTEycHggIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcInRkW2NsYXNzPSdwYXR0ZXJuJ10gLmMzMzZwNjByIHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdHdpZHRoOiAzMzZweCAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwiXFxuXCIgK1xuICAgICAgICAgICAgXCJAbWVkaWEgb25seSBzY3JlZW4gYW5kIChtYXgtd2lkdGg6IDU5OXB4KSwgb25seSBzY3JlZW4gYW5kIChtYXgtZGV2aWNlLXdpZHRoOiA1OTlweCksIG9ubHkgc2NyZWVuIGFuZCAobWF4LXdpZHRoOiA0MDBweCksIG9ubHkgc2NyZWVuIGFuZCAobWF4LWRldmljZS13aWR0aDogNDAwcHgpIHtcXG5cIiArXG4gICAgICAgICAgICBcInRhYmxlW2NsYXNzPSdlbWFpbC1yb290LXdyYXBwZXInXSB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHR3aWR0aDogMTAwJSAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwidGRbY2xhc3M9J3dyYXAnXSAuZnVsbC13aWR0aCB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHR3aWR0aDogMTAwJSAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0aGVpZ2h0OiBhdXRvICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCJ0ZFtjbGFzcz0nd3JhcCddIC5mdWxsd2lkdGhoYWxmbGVmdCB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHR3aWR0aDogMTAwJSAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwidGRbY2xhc3M9J3dyYXAnXSAuZnVsbHdpZHRoaGFsZnJpZ2h0IHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdHdpZHRoOiAxMDAlICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCJ0ZFtjbGFzcz0nd3JhcCddIC5mdWxsd2lkdGhoYWxmaW5uZXIge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0d2lkdGg6IDEwMCUgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdG1hcmdpbjogMCBhdXRvICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRmbG9hdDogbm9uZSAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0bWFyZ2luLWxlZnQ6IGF1dG8gIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdG1hcmdpbi1yaWdodDogYXV0byAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0Y2xlYXI6IGJvdGggIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcInRkW2NsYXNzPSd3cmFwJ10gLmhpZGUge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0ZGlzcGxheTogbm9uZSAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0d2lkdGg6IDBweDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGhlaWdodDogMHB4O1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0b3ZlcmZsb3c6IGhpZGRlbjtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcInRkW2NsYXNzPSdwYXR0ZXJuJ10gLmMxMTJwMjByIHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdHdpZHRoOiAxMDAlICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCJ0ZFtjbGFzcz0ncGF0dGVybiddIC5jMzM2cDYwciB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHR3aWR0aDogMTAwJSAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwiXFxuXCIgK1xuICAgICAgICAgICAgXCJAbWVkaWEgeWFob28ge1xcblwiICtcbiAgICAgICAgICAgIFwidGFibGUge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0ZmxvYXQ6IG5vbmUgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGhlaWdodDogYXV0bztcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcInRhYmxlW2FsaWduPSdsZWZ0J10ge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0ZmxvYXQ6IGxlZnQgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcInRkW2FsaWduPSdsZWZ0J10ge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0ZmxvYXQ6IGxlZnQgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGhlaWdodDogYXV0bztcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcInRhYmxlW2FsaWduPSdjZW50ZXInXSB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRtYXJnaW46IDAgYXV0bztcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcInRkW2FsaWduPSdjZW50ZXInXSB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRtYXJnaW46IDAgYXV0bztcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGhlaWdodDogYXV0bztcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcInRhYmxlW2FsaWduPSdyaWdodCddIHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGZsb2F0OiByaWdodCAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwidGRbYWxpZ249J3JpZ2h0J10ge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0ZmxvYXQ6IHJpZ2h0ICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRoZWlnaHQ6IGF1dG87XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCI8L3N0eWxlPlxcblwiICtcbiAgICAgICAgICAgIFwiXFxuXCIgK1xuICAgICAgICAgICAgXCI8IS0tW2lmIChndGUgSUUgNykgJiAodm1sKV0+XFxuXCIgK1xuICAgICAgICAgICAgXCI8c3R5bGUgdHlwZT0ndGV4dC9jc3MnPlxcblwiICtcbiAgICAgICAgICAgIFwiaHRtbCwgYm9keSB7bWFyZ2luOjAgIWltcG9ydGFudDsgcGFkZGluZzowcHggIWltcG9ydGFudDt9XFxuXCIgK1xuICAgICAgICAgICAgXCJpbWcuZnVsbC13aWR0aCB7IHBvc2l0aW9uOiByZWxhdGl2ZSAhaW1wb3J0YW50OyB9XFxuXCIgK1xuICAgICAgICAgICAgXCJcXG5cIiArXG4gICAgICAgICAgICBcIi5pbWcyNDB4MzAgeyB3aWR0aDogMjQwcHggIWltcG9ydGFudDsgaGVpZ2h0OiAzMHB4ICFpbXBvcnRhbnQ7fVxcblwiICtcbiAgICAgICAgICAgIFwiLmltZzIweDIwIHsgd2lkdGg6IDIwcHggIWltcG9ydGFudDsgaGVpZ2h0OiAyMHB4ICFpbXBvcnRhbnQ7fVxcblwiICtcbiAgICAgICAgICAgIFwiXFxuXCIgK1xuICAgICAgICAgICAgXCI8L3N0eWxlPlxcblwiICtcbiAgICAgICAgICAgIFwiPCFbZW5kaWZdLS0+XFxuXCIgK1xuICAgICAgICAgICAgXCJcXG5cIiArXG4gICAgICAgICAgICBcIjwhLS1baWYgZ3RlIG1zbyA5XT5cXG5cIiArXG4gICAgICAgICAgICBcIjxzdHlsZSB0eXBlPSd0ZXh0L2Nzcyc+XFxuXCIgK1xuICAgICAgICAgICAgXCIubXNvLWZvbnQtZml4LWFyaWFsIHsgZm9udC1mYW1pbHk6IEFyaWFsLCBzYW5zLXNlcmlmO31cXG5cIiArXG4gICAgICAgICAgICBcIi5tc28tZm9udC1maXgtZ2VvcmdpYSB7IGZvbnQtZmFtaWx5OiBHZW9yZ2lhLCBzYW5zLXNlcmlmO31cXG5cIiArXG4gICAgICAgICAgICBcIi5tc28tZm9udC1maXgtdGFob21hIHsgZm9udC1mYW1pbHk6IFRhaG9tYSwgc2Fucy1zZXJpZjt9XFxuXCIgK1xuICAgICAgICAgICAgXCIubXNvLWZvbnQtZml4LXRpbWVzX25ld19yb21hbiB7IGZvbnQtZmFtaWx5OiAnVGltZXMgTmV3IFJvbWFuJywgc2Fucy1zZXJpZjt9XFxuXCIgK1xuICAgICAgICAgICAgXCIubXNvLWZvbnQtZml4LXRyZWJ1Y2hldF9tcyB7IGZvbnQtZmFtaWx5OiAnVHJlYnVjaGV0IE1TJywgc2Fucy1zZXJpZjt9XFxuXCIgK1xuICAgICAgICAgICAgXCIubXNvLWZvbnQtZml4LXZlcmRhbmEgeyBmb250LWZhbWlseTogVmVyZGFuYSwgc2Fucy1zZXJpZjt9XFxuXCIgK1xuICAgICAgICAgICAgXCI8L3N0eWxlPlxcblwiICtcbiAgICAgICAgICAgIFwiPCFbZW5kaWZdLS0+XFxuXCIgK1xuICAgICAgICAgICAgXCJcXG5cIiArXG4gICAgICAgICAgICBcIjwhLS1baWYgZ3RlIG1zbyA5XT5cXG5cIiArXG4gICAgICAgICAgICBcIjxzdHlsZSB0eXBlPSd0ZXh0L2Nzcyc+XFxuXCIgK1xuICAgICAgICAgICAgXCJ0YWJsZSwgdGQge1xcblwiICtcbiAgICAgICAgICAgIFwiYm9yZGVyLWNvbGxhcHNlOiBjb2xsYXBzZSAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwibXNvLXRhYmxlLWxzcGFjZTogMHB4ICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJtc28tdGFibGUtcnNwYWNlOiAwcHggIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcIlxcblwiICtcbiAgICAgICAgICAgIFwiLmVtYWlsLXJvb3Qtd3JhcHBlciB7IHdpZHRoIDYwMHB4ICFpbXBvcnRhbnQ7fVxcblwiICtcbiAgICAgICAgICAgIFwiLmltZ2xpbmsgeyBmb250LXNpemU6IDBweDsgfVxcblwiICtcbiAgICAgICAgICAgIFwiLmVkbV9idXR0b24geyBmb250LXNpemU6IDBweDsgfVxcblwiICtcbiAgICAgICAgICAgIFwiPC9zdHlsZT5cXG5cIiArXG4gICAgICAgICAgICBcIjwhW2VuZGlmXS0tPlxcblwiICtcbiAgICAgICAgICAgIFwiXFxuXCIgK1xuICAgICAgICAgICAgXCI8IS0tW2lmIGd0ZSBtc28gMTVdPlxcblwiICtcbiAgICAgICAgICAgIFwiPHN0eWxlIHR5cGU9J3RleHQvY3NzJz5cXG5cIiArXG4gICAgICAgICAgICBcInRhYmxlIHtcXG5cIiArXG4gICAgICAgICAgICBcImZvbnQtc2l6ZTowcHg7XFxuXCIgK1xuICAgICAgICAgICAgXCJtc28tbWFyZ2luLXRvcC1hbHQ6MHB4O1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwiXFxuXCIgK1xuICAgICAgICAgICAgXCIuZnVsbHdpZHRoaGFsZmxlZnQge1xcblwiICtcbiAgICAgICAgICAgIFwid2lkdGg6IDQ5JSAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwiZmxvYXQ6bGVmdCAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwiXFxuXCIgK1xuICAgICAgICAgICAgXCIuZnVsbHdpZHRoaGFsZnJpZ2h0IHtcXG5cIiArXG4gICAgICAgICAgICBcIndpZHRoOiA1MCUgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcImZsb2F0OnJpZ2h0ICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCI8L3N0eWxlPlxcblwiICtcbiAgICAgICAgICAgIFwiPCFbZW5kaWZdLS0+XFxuXCIgK1xuICAgICAgICAgICAgXCI8c3R5bGUgdHlwZT0ndGV4dC9jc3MnIG1lZGlhPScocG9pbnRlcikgYW5kIChtaW4tY29sb3ItaW5kZXg6MCknPlxcblwiICtcbiAgICAgICAgICAgIFwiaHRtbCwgYm9keSB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRiYWNrZ3JvdW5kLWltYWdlOiBub25lICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRiYWNrZ3JvdW5kLWNvbG9yOiAjZWJlYmViICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRtYXJnaW46IDAgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdHBhZGRpbmc6IDAgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcIjwvc3R5bGU+XFxuXCIgK1xuICAgICAgICAgICAgXCI8L2hlYWQ+XFxuXCIgK1xuICAgICAgICAgICAgXCI8Ym9keSBsZWZ0bWFyZ2luPScwJyBtYXJnaW53aWR0aD0nMCcgdG9wbWFyZ2luPScwJyBtYXJnaW5oZWlnaHQ9JzAnIG9mZnNldD0nMCcgYmFja2dyb3VuZD1cXFwiXFxcIiBiZ2NvbG9yPScjZWJlYmViJyBzdHlsZT0nZm9udC1mYW1pbHk6QXJpYWwsIHNhbnMtc2VyaWY7IGZvbnQtc2l6ZTowcHg7bWFyZ2luOjA7cGFkZGluZzowOyAnPlxcblwiICtcbiAgICAgICAgICAgIFwiPCEtLVtpZiB0XT48IVtlbmRpZl0tLT48IS0tW2lmIHRdPjwhW2VuZGlmXS0tPjwhLS1baWYgdF0+PCFbZW5kaWZdLS0+PCEtLVtpZiB0XT48IVtlbmRpZl0tLT48IS0tW2lmIHRdPjwhW2VuZGlmXS0tPjwhLS1baWYgdF0+PCFbZW5kaWZdLS0+XFxuXCIgK1xuICAgICAgICAgICAgXCI8dGFibGUgYWxpZ249J2NlbnRlcicgYm9yZGVyPScwJyBjZWxscGFkZGluZz0nMCcgY2VsbHNwYWNpbmc9JzAnIGJhY2tncm91bmQ9XFxcIlxcXCIgIGhlaWdodD0nMTAwJScgd2lkdGg9JzEwMCUnIGlkPSdiYWNrZ3JvdW5kVGFibGUnPlxcblwiICtcbiAgICAgICAgICAgIFwiICA8dHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgPHRkIGNsYXNzPSd3cmFwJyBhbGlnbj0nY2VudGVyJyB2YWxpZ249J3RvcCcgd2lkdGg9JzEwMCUnPlxcblwiICtcbiAgICAgICAgICAgIFwiXFx0XFx0PGNlbnRlcj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgPCEtLSBjb250ZW50IC0tPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICBcXHQ8ZGl2IHN0eWxlPSdwYWRkaW5nOiAwcHg7Jz5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgXFx0ICA8dGFibGUgY2VsbHBhZGRpbmc9JzAnIGNlbGxzcGFjaW5nPScwJyBib3JkZXI9JzAnIHdpZHRoPScxMDAlJyBiZ2NvbG9yPScjZWJlYmViJz5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgXFx0XFx0IDx0cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgIFxcdFxcdCAgPHRkIHZhbGlnbj0ndG9wJyBzdHlsZT0ncGFkZGluZzogMHB4Oyc+XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRcXHRcXHRcXHRcXHRcXHQgIDx0YWJsZSBjZWxscGFkZGluZz0nMCcgY2VsbHNwYWNpbmc9JzAnIHdpZHRoPSc2MDAnIGFsaWduPSdjZW50ZXInIHN0eWxlPSdtYXgtd2lkdGg6IDYwMHB4O21pbi13aWR0aDogMjQwcHg7bWFyZ2luOiAwIGF1dG87JyBjbGFzcz0nZW1haWwtcm9vdC13cmFwcGVyJz5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgXFx0XFx0IFxcdFxcdDx0cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICBcXHRcXHRcXHRcXHRcXHQgPHRkIHZhbGlnbj0ndG9wJyBzdHlsZT0ncGFkZGluZzogMHB4Oyc+XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHQgXFx0XFx0PHRhYmxlIGNlbGxwYWRkaW5nPScwJyBjZWxsc3BhY2luZz0nMCcgYm9yZGVyPScwJyB3aWR0aD0nMTAwJScgYmdjb2xvcj0nI0ZGRkZGRicgc3R5bGU9J2JvcmRlcjogMHB4IG5vbmU7YmFja2dyb3VuZC1jb2xvcjogI0ZGRkZGRjsnPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICBcXHRcXHRcXHRcXHRcXHRcXHQgPHRyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICBcXHRcXHRcXHQgIFxcdFxcdFxcdFxcdCA8dGQgdmFsaWduPSd0b3AnIHN0eWxlPSdwYWRkaW5nLXRvcDogMzBweDtwYWRkaW5nLXJpZ2h0OiAyMHB4O3BhZGRpbmctYm90dG9tOiAzNXB4O3BhZGRpbmctbGVmdDogMjBweDsnPlxcblwiICtcbiAgICAgICAgICAgIFwiXFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0ICAgXFx0XFx0XFx0XFx0XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHQ8dGFibGUgY2VsbHBhZGRpbmc9JzAnXFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRjZWxsc3BhY2luZz0nMCcgYm9yZGVyPScwJyBhbGlnbj0nY2VudGVyJyB3aWR0aD0nMjQwJyAgc3R5bGU9J2JvcmRlcjogMHB4IG5vbmU7aGVpZ2h0OiBhdXRvOycgY2xhc3M9J2Z1bGwtd2lkdGgnPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcXHQgXFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0PHRyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHQ8dGQgdmFsaWduPSd0b3AnIHN0eWxlPSdwYWRkaW5nOiAwcHg7Jz48aW1nIHNyYz0naHR0cHM6Ly9zZjI2LnNlbmRzZnguY29tL2FkbWluL3RlbXAvdXNlci8xNy9kb2ljaGFpbl8xMDBoLnBuZycgd2lkdGg9JzI0MCcgaGVpZ2h0PSczMCcgYWx0PVxcXCJcXFwiIGJvcmRlcj0nMCcgc3R5bGU9J2Rpc3BsYXk6IGJsb2NrO3dpZHRoOiAxMDAlO2hlaWdodDogYXV0bzsnIGNsYXNzPSdmdWxsLXdpZHRoIGltZzI0MHgzMCcgLz48L3RkPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcXHQgXFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0PC90cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHQ8L3RhYmxlPlxcblwiICtcbiAgICAgICAgICAgIFwiXFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHQ8L3RkPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgIFxcdFxcdCAgXFx0XFx0XFx0XFx0PC90cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICBcXHRcXHRcXHRcXHRcXHQ8L3RhYmxlPlxcblwiICtcbiAgICAgICAgICAgIFwiXFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0IFxcblwiICtcbiAgICAgICAgICAgIFwiXFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0IFxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgIDx0YWJsZSBjZWxscGFkZGluZz0nMCcgY2VsbHNwYWNpbmc9JzAnIGJvcmRlcj0nMCcgd2lkdGg9JzEwMCUnIGJnY29sb3I9JyMwMDcxYWEnIHN0eWxlPSdib3JkZXI6IDBweCBub25lO2JhY2tncm91bmQtY29sb3I6ICMwMDcxYWE7YmFja2dyb3VuZC1pbWFnZTogdXJsKCdodHRwczovL3NmMjYuc2VuZHNmeC5jb20vYWRtaW4vdGVtcC91c2VyLzE3L2JsdWUtYmcuanBnJyk7YmFja2dyb3VuZC1yZXBlYXQ6IG5vLXJlcGVhdCA7YmFja2dyb3VuZC1wb3NpdGlvbjogY2VudGVyOyc+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCB2YWxpZ249J3RvcCcgc3R5bGU9J3BhZGRpbmctdG9wOiA0MHB4O3BhZGRpbmctcmlnaHQ6IDIwcHg7cGFkZGluZy1ib3R0b206IDQ1cHg7cGFkZGluZy1sZWZ0OiAyMHB4Oyc+PHRhYmxlIGNlbGxwYWRkaW5nPScwJyBjZWxsc3BhY2luZz0nMCcgd2lkdGg9JzEwMCUnPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgc3R5bGU9J3BhZGRpbmc6IDBweDsnIGNsYXNzPSdwYXR0ZXJuJz48dGFibGUgY2VsbHBhZGRpbmc9JzAnIGNlbGxzcGFjaW5nPScwJyBib3JkZXI9JzAnIHdpZHRoPScxMDAlJz5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIHZhbGlnbj0ndG9wJyBzdHlsZT0ncGFkZGluZy1ib3R0b206IDEwcHg7Jz48ZGl2IHN0eWxlPSd0ZXh0LWFsaWduOiBsZWZ0O2ZvbnQtZmFtaWx5OiBhcmlhbDtmb250LXNpemU6IDIwcHg7Y29sb3I6ICNmZmZmZmY7bGluZS1oZWlnaHQ6IDMwcHg7bXNvLWxpbmUtaGVpZ2h0OiBleGFjdGx5O21zby10ZXh0LXJhaXNlOiA1cHg7Jz5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwXFxuXCIgK1xuICAgICAgICAgICAgXCJzdHlsZT0ncGFkZGluZzogMDsgbWFyZ2luOiAwO3RleHQtYWxpZ246IGNlbnRlcjsnPkJpdHRlIGJlc3TDpHRpZ2VuIFNpZSBJaHJlIEFubWVsZHVuZzwvcD5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj48L3RkPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RhYmxlPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0YWJsZSBjZWxscGFkZGluZz0nMCcgY2VsbHNwYWNpbmc9JzAnIGJvcmRlcj0nMCcgd2lkdGg9JzEwMCUnPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgdmFsaWduPSd0b3AnIHN0eWxlPSdwYWRkaW5nOiAwO21zby1jZWxsc3BhY2luZzogMGluOyc+PHRhYmxlIGNlbGxwYWRkaW5nPScwJyBjZWxsc3BhY2luZz0nMCcgYm9yZGVyPScwJyBhbGlnbj0nbGVmdCcgd2lkdGg9JzExMicgIHN0eWxlPSdmbG9hdDogbGVmdDsnIGNsYXNzPSdjMTEycDIwcic+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCB2YWxpZ249J3RvcCcgc3R5bGU9J3BhZGRpbmc6IDBweDsnPjx0YWJsZSBjZWxscGFkZGluZz0nMCcgY2VsbHNwYWNpbmc9JzAnIGJvcmRlcj0nMCcgd2lkdGg9JzEwMCUnIHN0eWxlPSdib3JkZXI6IDBweCBub25lOycgY2xhc3M9J2hpZGUnPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgdmFsaWduPSd0b3AnIHN0eWxlPSdwYWRkaW5nOiAwcHg7Jz48dGFibGUgY2VsbHBhZGRpbmc9JzAnIGNlbGxzcGFjaW5nPScwJyB3aWR0aD0nMTAwJSc+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBzdHlsZT0ncGFkZGluZzogMHB4Oyc+PHRhYmxlIGNlbGxwYWRkaW5nPScwJyBjZWxsc3BhY2luZz0nMCcgd2lkdGg9JzEwMCUnPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgYWxpZ249J2NlbnRlcicgc3R5bGU9J3BhZGRpbmc6IDBweDsnPjx0YWJsZSBjZWxscGFkZGluZz0nMCcgY2VsbHNwYWNpbmc9JzAnIGJvcmRlcj0nMCcgYWxpZ249J2NlbnRlcicgd2lkdGg9JzIwJyAgc3R5bGU9J2JvcmRlcjogMHB4IG5vbmU7aGVpZ2h0OiBhdXRvOyc+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCB2YWxpZ249J3RvcCcgc3R5bGU9J3BhZGRpbmc6IDBweDsnPjxpbWdcXG5cIiArXG4gICAgICAgICAgICBcInNyYz0naHR0cHM6Ly9zZjI2LnNlbmRzZnguY29tL2FkbWluL3RlbXAvdXNlci8xNy9pbWdfODk4MzczMTgucG5nJyB3aWR0aD0nMjAnIGhlaWdodD0nMjAnIGFsdD1cXFwiXFxcIiBib3JkZXI9JzAnIHN0eWxlPSdkaXNwbGF5OiBibG9jazsnIGNsYXNzPSdpbWcyMHgyMCcgLz48L3RkPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RhYmxlPjwvdGQ+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGFibGU+PC90ZD5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90YWJsZT48L3RkPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RhYmxlPjwvdGQ+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGFibGU+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPCEtLVtpZiBndGUgbXNvIDldPjwvdGQ+PHRkIHZhbGlnbj0ndG9wJyBzdHlsZT0ncGFkZGluZzowOyc+PCFbZW5kaWZdLS0+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRhYmxlIGNlbGxwYWRkaW5nPScwJyBjZWxsc3BhY2luZz0nMCcgYm9yZGVyPScwJyBhbGlnbj0nbGVmdCcgd2lkdGg9JzMzNicgIHN0eWxlPSdmbG9hdDogbGVmdDsnIGNsYXNzPSdjMzM2cDYwcic+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCB2YWxpZ249J3RvcCcgc3R5bGU9J3BhZGRpbmc6IDBweDsnPjx0YWJsZSBjZWxscGFkZGluZz0nMCcgY2VsbHNwYWNpbmc9JzAnIGJvcmRlcj0nMCcgd2lkdGg9JzEwMCUnPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgdmFsaWduPSd0b3AnIHN0eWxlPSdwYWRkaW5nLWJvdHRvbTogMzBweDsnPjx0YWJsZSBjZWxscGFkZGluZz0nMCcgY2VsbHNwYWNpbmc9JzAnIHdpZHRoPScxMDAlJz5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIHN0eWxlPSdwYWRkaW5nOiAwcHg7Jz48dGFibGUgY2VsbHBhZGRpbmc9JzAnIGNlbGxzcGFjaW5nPScwJyBib3JkZXI9JzAnIHdpZHRoPScxMDAlJyBzdHlsZT0nYm9yZGVyLXRvcDogMnB4IHNvbGlkICNmZmZmZmY7Jz5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIHZhbGlnbj0ndG9wJz48dGFibGUgY2VsbHBhZGRpbmc9JzAnIGNlbGxzcGFjaW5nPScwJyB3aWR0aD0nMTAwJSc+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBzdHlsZT0ncGFkZGluZzogMHB4Oyc+PC90ZD5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90YWJsZT48L3RkPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RhYmxlPjwvdGQ+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGFibGU+PC90ZD5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90YWJsZT48L3RkPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RhYmxlPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwhLS1baWYgZ3RlIG1zbyA5XT48L3RkPjx0ZCB2YWxpZ249J3RvcCcgc3R5bGU9J3BhZGRpbmc6MDsnPjwhW2VuZGlmXS0tPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0YWJsZSBjZWxscGFkZGluZz0nMCcgY2VsbHNwYWNpbmc9JzAnIGJvcmRlcj0nMCcgYWxpZ249J2xlZnQnIHdpZHRoPScxMTInICBzdHlsZT0nZmxvYXQ6IGxlZnQ7JyBjbGFzcz0nYzExMnAyMHInPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgdmFsaWduPSd0b3AnIHN0eWxlPSdwYWRkaW5nOiAwcHg7Jz48dGFibGUgY2VsbHBhZGRpbmc9JzAnIGNlbGxzcGFjaW5nPScwJyBib3JkZXI9JzAnIHdpZHRoPScxMDAlJyBzdHlsZT0nYm9yZGVyOiAwcHggbm9uZTsnIGNsYXNzPSdoaWRlJz5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIHZhbGlnbj0ndG9wJyBzdHlsZT0ncGFkZGluZzogMHB4Oyc+PHRhYmxlIGNlbGxwYWRkaW5nPScwJyBjZWxsc3BhY2luZz0nMCcgd2lkdGg9JzEwMCUnPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgc3R5bGU9J3BhZGRpbmc6IDBweDsnPjx0YWJsZSBjZWxscGFkZGluZz0nMCcgY2VsbHNwYWNpbmc9JzAnIHdpZHRoPScxMDAlJz5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIGFsaWduPSdjZW50ZXInIHN0eWxlPSdwYWRkaW5nOiAwcHg7Jz48dGFibGUgY2VsbHBhZGRpbmc9JzAnIGNlbGxzcGFjaW5nPScwJyBib3JkZXI9JzAnIGFsaWduPSdjZW50ZXInIHdpZHRoPScyMCcgIHN0eWxlPSdib3JkZXI6IDBweCBub25lO2hlaWdodDogYXV0bzsnPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgdmFsaWduPSd0b3AnIHN0eWxlPSdwYWRkaW5nOiAwcHg7Jz48aW1nIHNyYz0naHR0cHM6Ly9zZjI2LnNlbmRzZnguY29tL2FkbWluL3RlbXAvdXNlci8xNy9pbWdfODk4MzczMTgucG5nJyB3aWR0aD0nMjAnIGhlaWdodD0nMjAnIGFsdD1cXFwiXFxcIiBib3JkZXI9JzAnIHN0eWxlPSdkaXNwbGF5OiBibG9jazsnIGNsYXNzPSdpbWcyMHgyMCdcXG5cIiArXG4gICAgICAgICAgICBcIi8+PC90ZD5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90YWJsZT48L3RkPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RhYmxlPjwvdGQ+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGFibGU+PC90ZD5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90YWJsZT48L3RkPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RhYmxlPjwvdGQ+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGFibGU+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRhYmxlIGNlbGxwYWRkaW5nPScwJyBjZWxsc3BhY2luZz0nMCcgYm9yZGVyPScwJyB3aWR0aD0nMTAwJSc+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCB2YWxpZ249J3RvcCcgc3R5bGU9J3BhZGRpbmctYm90dG9tOiAyMHB4Oyc+PGRpdiBzdHlsZT0ndGV4dC1hbGlnbjogbGVmdDtmb250LWZhbWlseTogYXJpYWw7Zm9udC1zaXplOiAxNnB4O2NvbG9yOiAjZmZmZmZmO2xpbmUtaGVpZ2h0OiAyNnB4O21zby1saW5lLWhlaWdodDogZXhhY3RseTttc28tdGV4dC1yYWlzZTogNXB4Oyc+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cCBzdHlsZT0ncGFkZGluZzogMDsgbWFyZ2luOiAwO3RleHQtYWxpZ246IGNlbnRlcjsnPlZpZWxlbiBEYW5rLCBkYXNzIFNpZSBzaWNoIGbDvHIgdW5zZXJlbiBOZXdzbGV0dGVyIGFuZ2VtZWxkZXQgaGFiZW4uPC9wPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHAgc3R5bGU9J3BhZGRpbmc6IDA7IG1hcmdpbjogMDt0ZXh0LWFsaWduOiBjZW50ZXI7Jz5VbSBkaWVzZSBFLU1haWwtQWRyZXNzZSB1bmQgSWhyZSBrb3N0ZW5sb3NlIEFubWVsZHVuZyB6dSBiZXN0w6R0aWdlbiwga2xpY2tlbiBTaWUgYml0dGUgamV0enQgYXVmIGRlbiBmb2xnZW5kZW4gQnV0dG9uOjwvcD5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj48L3RkPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RhYmxlPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0YWJsZSBjZWxscGFkZGluZz0nMCcgY2VsbHNwYWNpbmc9JzAnIHdpZHRoPScxMDAlJz5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIGFsaWduPSdjZW50ZXInIHN0eWxlPSdwYWRkaW5nOiAwcHg7Jz48dGFibGUgY2VsbHBhZGRpbmc9JzAnIGNlbGxzcGFjaW5nPScwJyBib3JkZXI9JzAnIGFsaWduPSdjZW50ZXInIHN0eWxlPSd0ZXh0LWFsaWduOiBjZW50ZXI7Y29sb3I6ICMwMDA7JyBjbGFzcz0nZnVsbC13aWR0aCc+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCB2YWxpZ249J3RvcCcgYWxpZ249J2NlbnRlcicgc3R5bGU9J3BhZGRpbmctcmlnaHQ6IDEwcHg7cGFkZGluZy1ib3R0b206IDMwcHg7cGFkZGluZy1sZWZ0OiAxMHB4Oyc+PHRhYmxlIGNlbGxwYWRkaW5nPScwJyBjZWxsc3BhY2luZz0nMCcgYm9yZGVyPScwJyBiZ2NvbG9yPScjODVhYzFjJyBzdHlsZT0nYm9yZGVyOiAwcHggbm9uZTtib3JkZXItcmFkaXVzOiA1cHg7Ym9yZGVyLWNvbGxhcHNlOiBzZXBhcmF0ZSAhaW1wb3J0YW50O2JhY2tncm91bmQtY29sb3I6ICM4NWFjMWM7JyBjbGFzcz0nZnVsbC13aWR0aCc+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCB2YWxpZ249J3RvcCcgYWxpZ249J2NlbnRlcicgc3R5bGU9J3BhZGRpbmc6IDEycHg7Jz48YSBocmVmPScke2NvbmZpcm1hdGlvbl91cmx9JyB0YXJnZXQ9J19ibGFuaycgc3R5bGU9J3RleHQtZGVjb3JhdGlvbjogbm9uZTsnIGNsYXNzPSdlZG1fYnV0dG9uJz48c3BhbiBzdHlsZT0nZm9udC1mYW1pbHk6IGFyaWFsO2ZvbnQtc2l6ZTogMThweDtjb2xvcjogI2ZmZmZmZjtsaW5lLWhlaWdodDogMjhweDt0ZXh0LWRlY29yYXRpb246IG5vbmU7Jz48c3BhblxcblwiICtcbiAgICAgICAgICAgIFwic3R5bGU9J2ZvbnQtc2l6ZTogMThweDsnPkpldHp0IEFubWVsZHVuZyBiZXN0JmF1bWw7dGlnZW48L3NwYW4+PC9zcGFuPiA8L2E+PC90ZD5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90YWJsZT48L3RkPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RhYmxlPjwvdGQ+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGFibGU+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT0ndGV4dC1hbGlnbjogbGVmdDtmb250LWZhbWlseTogYXJpYWw7Zm9udC1zaXplOiAxMnB4O2NvbG9yOiAjZmZmZmZmO2xpbmUtaGVpZ2h0OiAyMnB4O21zby1saW5lLWhlaWdodDogZXhhY3RseTttc28tdGV4dC1yYWlzZTogNXB4Oyc+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cCBzdHlsZT0ncGFkZGluZzogMDsgbWFyZ2luOiAwO3RleHQtYWxpZ246IGNlbnRlcjsnPldlbm4gU2llIGlocmUgRS1NYWlsLUFkcmVzc2UgbmljaHQgYmVzdMOkdGlnZW4sIGvDtm5uZW4ga2VpbmUgTmV3c2xldHRlciB6dWdlc3RlbGx0IHdlcmRlbi4gSWhyIEVpbnZlcnN0w6RuZG5pcyBrw7ZubmVuIFNpZSBzZWxic3R2ZXJzdMOkbmRsaWNoIGplZGVyemVpdCB3aWRlcnJ1ZmVuLiBTb2xsdGUgZXMgc2ljaCBiZWkgZGVyIEFubWVsZHVuZyB1bSBlaW4gVmVyc2VoZW4gaGFuZGVsbiBvZGVyIHd1cmRlIGRlciBOZXdzbGV0dGVyIG5pY2h0IGluIElocmVtIE5hbWVuIGJlc3RlbGx0LCBrw7ZubmVuIFNpZSBkaWVzZSBFLU1haWwgZWluZmFjaCBpZ25vcmllcmVuLiBJaG5lbiB3ZXJkZW4ga2VpbmUgd2VpdGVyZW4gTmFjaHJpY2h0ZW4genVnZXNjaGlja3QuPC9wPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PjwvdGQ+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGFibGU+PC90ZD5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgPC90YWJsZT5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICA8dGFibGUgY2VsbHBhZGRpbmc9JzAnIGNlbGxzcGFjaW5nPScwJyBib3JkZXI9JzAnIHdpZHRoPScxMDAlJyBiZ2NvbG9yPScjZmZmZmZmJyBzdHlsZT0nYm9yZGVyOiAwcHggbm9uZTtiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmZmZmOyc+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCB2YWxpZ249J3RvcCcgc3R5bGU9J3BhZGRpbmctdG9wOiAzMHB4O3BhZGRpbmctcmlnaHQ6IDIwcHg7cGFkZGluZy1ib3R0b206IDM1cHg7cGFkZGluZy1sZWZ0OiAyMHB4Oyc+PHRhYmxlIGNlbGxwYWRkaW5nPScwJyBjZWxsc3BhY2luZz0nMCcgd2lkdGg9JzEwMCUnPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgc3R5bGU9J3BhZGRpbmc6IDBweDsnPjx0YWJsZSBjZWxscGFkZGluZz0nMCcgY2VsbHNwYWNpbmc9JzAnIGJvcmRlcj0nMCcgd2lkdGg9JzEwMCUnPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgdmFsaWduPSd0b3AnIHN0eWxlPSdwYWRkaW5nLWJvdHRvbTogMjVweDsnPjxkaXYgc3R5bGU9J3RleHQtYWxpZ246IGxlZnQ7Zm9udC1mYW1pbHk6IGFyaWFsO2ZvbnQtc2l6ZTogMTJweDtjb2xvcjogIzMzMzMzMztsaW5lLWhlaWdodDogMjJweDttc28tbGluZS1oZWlnaHQ6IGV4YWN0bHk7bXNvLXRleHQtcmFpc2U6IDVweDsnPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHAgc3R5bGU9J3BhZGRpbmc6IDA7IG1hcmdpbjogMDt0ZXh0LWFsaWduOiBjZW50ZXI7Jz48c3BhbiBzdHlsZT0nbGluZS1oZWlnaHQ6IDM7Jz48c3Ryb25nPktvbnRha3Q8L3N0cm9uZz48L3NwYW4+PGJyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXJ2aWNlQHNlbmRlZmZlY3QuZGU8YnI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHd3dy5zZW5kZWZmZWN0LmRlPGJyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBUZWxlZm9uOiArNDkgKDApIDg1NzEgLSA5NyAzOSAtIDY5LTA8L3A+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+PC90ZD5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90YWJsZT5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPSd0ZXh0LWFsaWduOiBsZWZ0O2ZvbnQtZmFtaWx5OiBhcmlhbDtmb250LXNpemU6IDEycHg7Y29sb3I6ICMzMzMzMzM7bGluZS1oZWlnaHQ6IDIycHg7bXNvLWxpbmUtaGVpZ2h0OiBleGFjdGx5O21zby10ZXh0LXJhaXNlOiA1cHg7Jz5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwIHN0eWxlPSdwYWRkaW5nOiAwOyBtYXJnaW46IDA7dGV4dC1hbGlnbjogY2VudGVyOyc+PHNwYW4gc3R5bGU9J2xpbmUtaGVpZ2h0OiAzOyc+PHN0cm9uZz5JbXByZXNzdW08L3N0cm9uZz48L3NwYW4+PGJyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBBbnNjaHJpZnQ6IFNjaHVsZ2Fzc2UgNSwgRC04NDM1OSBTaW1iYWNoIGFtIElubiwgZU1haWw6IHNlcnZpY2VAc2VuZGVmZmVjdC5kZTxicj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQmV0cmVpYmVyOiBXRUJhbml6ZXIgQUcsIFJlZ2lzdGVyZ2VyaWNodDogQW10c2dlcmljaHQgTGFuZHNodXQgSFJCIDUxNzcsIFVzdElkLjogREUgMjA2OCA2MiAwNzA8YnI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFZvcnN0YW5kOiBPdHRtYXIgTmV1YnVyZ2VyLCBBdWZzaWNodHNyYXQ6IFRvYmlhcyBOZXVidXJnZXI8L3A+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+PC90ZD5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90YWJsZT48L3RkPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICA8L3RhYmxlPjwvdGQ+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICA8L3RyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgIDwvdGFibGU+PC90ZD5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgIDwvdHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgPC90YWJsZT5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgPC9kaXY+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgIDwhLS0gY29udGVudCBlbmQgLS0+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICA8L2NlbnRlcj48L3RkPlxcblwiICtcbiAgICAgICAgICAgIFwiICA8L3RyPlxcblwiICtcbiAgICAgICAgICAgIFwiPC90YWJsZT5cIlxuICAgICAgfVxuXG4gICAgICByZXR1cm4ge1wic3RhdHVzXCI6IFwic3VjY2Vzc1wiLCBcImRhdGFcIjogZGF0YX07XG4gICAgfVxuICB9XG59KTtcbiIsImltcG9ydCB7IEFwaSwgRE9JX0ZFVENIX1JPVVRFLCBET0lfQ09ORklSTUFUSU9OX05PVElGWV9ST1VURSB9IGZyb20gJy4uL3Jlc3QuanMnO1xuaW1wb3J0IGFkZE9wdEluIGZyb20gJy4uLy4uLy4uLy4uL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvb3B0LWlucy9hZGRfYW5kX3dyaXRlX3RvX2Jsb2NrY2hhaW4uanMnO1xuaW1wb3J0IHVwZGF0ZU9wdEluU3RhdHVzIGZyb20gJy4uLy4uLy4uLy4uL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvb3B0LWlucy91cGRhdGVfc3RhdHVzLmpzJztcbmltcG9ydCBnZXREb2lNYWlsRGF0YSBmcm9tICcuLi8uLi8uLi8uLi9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2RhcHBzL2dldF9kb2ktbWFpbC1kYXRhLmpzJztcbmltcG9ydCB7bG9nRXJyb3IsIGxvZ1NlbmR9IGZyb20gXCIuLi8uLi8uLi8uLi9pbXBvcnRzL3N0YXJ0dXAvc2VydmVyL2xvZy1jb25maWd1cmF0aW9uXCI7XG5pbXBvcnQge0RPSV9FWFBPUlRfUk9VVEV9IGZyb20gXCIuLi9yZXN0XCI7XG5pbXBvcnQgZXhwb3J0RG9pcyBmcm9tIFwiLi4vLi4vLi4vLi4vaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9kYXBwcy9leHBvcnRfZG9pc1wiO1xuaW1wb3J0IHtPcHRJbnN9IGZyb20gXCIuLi8uLi8uLi8uLi9pbXBvcnRzL2FwaS9vcHQtaW5zL29wdC1pbnNcIjtcbmltcG9ydCB7Um9sZXN9IGZyb20gXCJtZXRlb3IvYWxhbm5pbmc6cm9sZXNcIjtcblxuLy9kb2t1IG9mIG1ldGVvci1yZXN0aXZ1cyBodHRwczovL2dpdGh1Yi5jb20va2FobWFsaS9tZXRlb3ItcmVzdGl2dXNcblxuQXBpLmFkZFJvdXRlKERPSV9DT05GSVJNQVRJT05fTk9USUZZX1JPVVRFLCB7XG4gIHBvc3Q6IHtcbiAgICBhdXRoUmVxdWlyZWQ6IHRydWUsXG4gICAgLy9yb2xlUmVxdWlyZWQ6IFsnYWRtaW4nXSxcbiAgICBhY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgcVBhcmFtcyA9IHRoaXMucXVlcnlQYXJhbXM7XG4gICAgICBjb25zdCBiUGFyYW1zID0gdGhpcy5ib2R5UGFyYW1zO1xuICAgICAgbGV0IHBhcmFtcyA9IHt9XG4gICAgICBpZihxUGFyYW1zICE9PSB1bmRlZmluZWQpIHBhcmFtcyA9IHsuLi5xUGFyYW1zfVxuICAgICAgaWYoYlBhcmFtcyAhPT0gdW5kZWZpbmVkKSBwYXJhbXMgPSB7Li4ucGFyYW1zLCAuLi5iUGFyYW1zfVxuXG4gICAgICBjb25zdCB1aWQgPSB0aGlzLnVzZXJJZDtcblxuICAgICAgaWYoIVJvbGVzLnVzZXJJc0luUm9sZSh1aWQsICdhZG1pbicpIHx8IC8vaWYgaXRzIG5vdCBhbiBhZG1pbiBhbHdheXMgdXNlIHVpZCBhcyBvd25lcklkXG4gICAgICAgICAgKFJvbGVzLnVzZXJJc0luUm9sZSh1aWQsICdhZG1pbicpICYmIChwYXJhbXNbXCJvd25lcklkXCJdPT1udWxsIHx8IHBhcmFtc1tcIm93bmVySWRcIl09PXVuZGVmaW5lZCkpKSB7ICAvL2lmIGl0cyBhbiBhZG1pbiBvbmx5IHVzZSB1aWQgaW4gY2FzZSBubyBvd25lcklkIHdhcyBnaXZlblxuICAgICAgICAgIHBhcmFtc1tcIm93bmVySWRcIl0gPSB1aWQ7XG4gICAgICB9XG5cbiAgICAgIGxvZ1NlbmQoJ3BhcmFtZXRlciByZWNlaXZlZCBmcm9tIGJyb3dzZXI6JyxwYXJhbXMpO1xuICAgICAgaWYocGFyYW1zLnNlbmRlcl9tYWlsLmNvbnN0cnVjdG9yID09PSBBcnJheSl7IC8vdGhpcyBpcyBhIFNPSSB3aXRoIGNvLXNwb25zb3JzIGZpcnN0IGVtYWlsIGlzIG1haW4gc3BvbnNvclxuICAgICAgICAgIHJldHVybiBwcmVwYXJlQ29ET0kocGFyYW1zKTtcbiAgICAgIH1lbHNle1xuICAgICAgICAgcmV0dXJuIHByZXBhcmVBZGQocGFyYW1zKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIHB1dDoge1xuICAgIGF1dGhSZXF1aXJlZDogZmFsc2UsXG4gICAgYWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IHFQYXJhbXMgPSB0aGlzLnF1ZXJ5UGFyYW1zO1xuICAgICAgY29uc3QgYlBhcmFtcyA9IHRoaXMuYm9keVBhcmFtcztcblxuICAgICAgbG9nU2VuZCgncVBhcmFtczonLHFQYXJhbXMpO1xuICAgICAgbG9nU2VuZCgnYlBhcmFtczonLGJQYXJhbXMpO1xuXG4gICAgICBsZXQgcGFyYW1zID0ge31cbiAgICAgIGlmKHFQYXJhbXMgIT09IHVuZGVmaW5lZCkgcGFyYW1zID0gey4uLnFQYXJhbXN9XG4gICAgICBpZihiUGFyYW1zICE9PSB1bmRlZmluZWQpIHBhcmFtcyA9IHsuLi5wYXJhbXMsIC4uLmJQYXJhbXN9XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCB2YWwgPSB1cGRhdGVPcHRJblN0YXR1cyhwYXJhbXMpO1xuICAgICAgICBsb2dTZW5kKCdvcHQtSW4gc3RhdHVzIHVwZGF0ZWQnLHZhbCk7XG4gICAgICAgIHJldHVybiB7c3RhdHVzOiAnc3VjY2VzcycsIGRhdGE6IHttZXNzYWdlOiAnT3B0LUluIHN0YXR1cyB1cGRhdGVkJ319O1xuICAgICAgfSBjYXRjaChlcnJvcikge1xuICAgICAgICByZXR1cm4ge3N0YXR1c0NvZGU6IDUwMCwgYm9keToge3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiBlcnJvci5tZXNzYWdlfX07XG4gICAgICB9XG4gICAgfVxuICB9XG59KTtcblxuQXBpLmFkZFJvdXRlKERPSV9GRVRDSF9ST1VURSwge2F1dGhSZXF1aXJlZDogZmFsc2V9LCB7XG4gIGdldDoge1xuICAgIGFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBwYXJhbXMgPSB0aGlzLnF1ZXJ5UGFyYW1zO1xuICAgICAgdHJ5IHtcbiAgICAgICAgICBsb2dTZW5kKCdyZXN0IGFwaSAtIERPSV9GRVRDSF9ST1VURSBjYWxsZWQgYnkgYm9iIHRvIHJlcXVlc3QgZW1haWwgdGVtcGxhdGUnLEpTT04uc3RyaW5naWZ5KHBhcmFtcykpO1xuICAgICAgICAgIGNvbnN0IGRhdGEgPSBnZXREb2lNYWlsRGF0YShwYXJhbXMpO1xuICAgICAgICAgIGxvZ1NlbmQoJ2dvdCBkb2ktbWFpbC1kYXRhIChpbmNsdWRpbmcgdGVtcGxhbHRlKSByZXR1cm5pbmcgdG8gYm9iJyx7c3ViamVjdDpkYXRhLnN1YmplY3QsIHJlY2lwaWVudDpkYXRhLnJlY2lwaWVudH0pO1xuICAgICAgICByZXR1cm4ge3N0YXR1czogJ3N1Y2Nlc3MnLCBkYXRhfTtcbiAgICAgIH0gY2F0Y2goZXJyb3IpIHtcbiAgICAgICAgbG9nRXJyb3IoJ2Vycm9yIHdoaWxlIGdldHRpbmcgRG9pTWFpbERhdGEnLGVycm9yKTtcbiAgICAgICAgcmV0dXJuIHtzdGF0dXM6ICdmYWlsJywgZXJyb3I6IGVycm9yLm1lc3NhZ2V9O1xuICAgICAgfVxuICAgIH1cbiAgfVxufSk7XG5cbkFwaS5hZGRSb3V0ZShET0lfRVhQT1JUX1JPVVRFLCB7XG4gICAgZ2V0OiB7XG4gICAgICAgIGF1dGhSZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgLy9yb2xlUmVxdWlyZWQ6IFsnYWRtaW4nXSxcbiAgICAgICAgYWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGxldCBwYXJhbXMgPSB0aGlzLnF1ZXJ5UGFyYW1zO1xuICAgICAgICAgICAgY29uc3QgdWlkID0gdGhpcy51c2VySWQ7XG4gICAgICAgICAgICBpZighUm9sZXMudXNlcklzSW5Sb2xlKHVpZCwgJ2FkbWluJykpe1xuICAgICAgICAgICAgICAgIHBhcmFtcyA9IHt1c2VyaWQ6dWlkLHJvbGU6J3VzZXInfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgcGFyYW1zID0gey4uLnBhcmFtcyxyb2xlOidhZG1pbid9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGxvZ1NlbmQoJ3Jlc3QgYXBpIC0gRE9JX0VYUE9SVF9ST1VURSBjYWxsZWQnLEpTT04uc3RyaW5naWZ5KHBhcmFtcykpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBleHBvcnREb2lzKHBhcmFtcyk7XG4gICAgICAgICAgICAgICAgbG9nU2VuZCgnZ290IGRvaXMgZnJvbSBkYXRhYmFzZScsSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xuICAgICAgICAgICAgICAgIHJldHVybiB7c3RhdHVzOiAnc3VjY2VzcycsIGRhdGF9O1xuICAgICAgICAgICAgfSBjYXRjaChlcnJvcikge1xuICAgICAgICAgICAgICAgIGxvZ0Vycm9yKCdlcnJvciB3aGlsZSBleHBvcnRpbmcgY29uZmlybWVkIGRvaXMnLGVycm9yKTtcbiAgICAgICAgICAgICAgICByZXR1cm4ge3N0YXR1czogJ2ZhaWwnLCBlcnJvcjogZXJyb3IubWVzc2FnZX07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59KTtcblxuZnVuY3Rpb24gcHJlcGFyZUNvRE9JKHBhcmFtcyl7XG5cbiAgICBsb2dTZW5kKCdpcyBhcnJheSAnLHBhcmFtcy5zZW5kZXJfbWFpbCk7XG5cbiAgICBjb25zdCBzZW5kZXJzID0gcGFyYW1zLnNlbmRlcl9tYWlsO1xuICAgIGNvbnN0IHJlY2lwaWVudF9tYWlsID0gcGFyYW1zLnJlY2lwaWVudF9tYWlsO1xuICAgIGNvbnN0IGRhdGEgPSBwYXJhbXMuZGF0YTtcbiAgICBjb25zdCBvd25lcklEID0gcGFyYW1zLm93bmVySWQ7XG5cbiAgICBsZXQgY3VycmVudE9wdEluSWQ7XG4gICAgbGV0IHJldFJlc3BvbnNlID0gW107XG4gICAgbGV0IG1hc3Rlcl9kb2k7XG4gICAgc2VuZGVycy5mb3JFYWNoKChzZW5kZXIsaW5kZXgpID0+IHtcblxuICAgICAgICBjb25zdCByZXRfcmVzcG9uc2UgPSBwcmVwYXJlQWRkKHtzZW5kZXJfbWFpbDpzZW5kZXIscmVjaXBpZW50X21haWw6cmVjaXBpZW50X21haWwsZGF0YTpkYXRhLCBtYXN0ZXJfZG9pOm1hc3Rlcl9kb2ksIGluZGV4OiBpbmRleCwgb3duZXJJZDpvd25lcklEfSk7XG4gICAgICAgIGxvZ1NlbmQoJ0NvRE9JOicscmV0X3Jlc3BvbnNlKTtcbiAgICAgICAgaWYocmV0X3Jlc3BvbnNlLnN0YXR1cyA9PT0gdW5kZWZpbmVkIHx8IHJldF9yZXNwb25zZS5zdGF0dXM9PT1cImZhaWxlZFwiKSB0aHJvdyBcImNvdWxkIG5vdCBhZGQgY28tb3B0LWluXCI7XG4gICAgICAgIHJldFJlc3BvbnNlLnB1c2gocmV0X3Jlc3BvbnNlKTtcbiAgICAgICAgY3VycmVudE9wdEluSWQgPSByZXRfcmVzcG9uc2UuZGF0YS5pZDtcblxuICAgICAgICBpZihpbmRleD09PTApXG4gICAgICAgIHtcbiAgICAgICAgICAgIGxvZ1NlbmQoJ21haW4gc3BvbnNvciBvcHRJbklkOicsY3VycmVudE9wdEluSWQpO1xuICAgICAgICAgICAgY29uc3Qgb3B0SW4gPSBPcHRJbnMuZmluZE9uZSh7X2lkOiBjdXJyZW50T3B0SW5JZH0pO1xuICAgICAgICAgICAgbWFzdGVyX2RvaSA9IG9wdEluLm5hbWVJZDtcbiAgICAgICAgICAgIGxvZ1NlbmQoJ21haW4gc3BvbnNvciBuYW1lSWQ6JyxtYXN0ZXJfZG9pKTtcbiAgICAgICAgfVxuXG4gICAgfSk7XG5cbiAgICBsb2dTZW5kKHJldFJlc3BvbnNlKTtcblxuICAgIHJldHVybiByZXRSZXNwb25zZTtcbn1cblxuZnVuY3Rpb24gcHJlcGFyZUFkZChwYXJhbXMpe1xuXG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgdmFsID0gYWRkT3B0SW4ocGFyYW1zKTtcbiAgICAgICAgbG9nU2VuZCgnb3B0LUluIGFkZGVkIElEOicsdmFsKTtcbiAgICAgICAgcmV0dXJuIHtzdGF0dXM6ICdzdWNjZXNzJywgZGF0YToge2lkOiB2YWwsIHN0YXR1czogJ3N1Y2Nlc3MnLCBtZXNzYWdlOiAnT3B0LUluIGFkZGVkLid9fTtcbiAgICB9IGNhdGNoKGVycm9yKSB7XG4gICAgICAgIHJldHVybiB7c3RhdHVzQ29kZTogNTAwLCBib2R5OiB7c3RhdHVzOiAnZmFpbCcsIG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2V9fTtcbiAgICB9XG59IiwiaW1wb3J0IHsgQXBpIH0gZnJvbSAnLi4vcmVzdC5qcyc7XG5pbXBvcnQge01ldGVvcn0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQge0FjY291bnRzfSBmcm9tICdtZXRlb3IvYWNjb3VudHMtYmFzZSdcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcbmltcG9ydCB7Um9sZXN9IGZyb20gXCJtZXRlb3IvYWxhbm5pbmc6cm9sZXNcIjtcbmltcG9ydCB7bG9nTWFpbn0gZnJvbSBcIi4uLy4uLy4uLy4uL2ltcG9ydHMvc3RhcnR1cC9zZXJ2ZXIvbG9nLWNvbmZpZ3VyYXRpb25cIjtcblxuY29uc3QgbWFpbFRlbXBsYXRlU2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gICAgc3ViamVjdDoge1xuICAgICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICAgIG9wdGlvbmFsOnRydWUgXG4gICAgfSxcbiAgICByZWRpcmVjdDoge1xuICAgICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICAgIHJlZ0V4OiBcIkAoaHR0cHM/fGZ0cCk6Ly8oLVxcXFwuKT8oW15cXFxccy8/XFxcXC4jLV0rXFxcXC4/KSsoL1teXFxcXHNdKik/JEBcIixcbiAgICAgICAgb3B0aW9uYWw6dHJ1ZSBcbiAgICB9LFxuICAgIHJldHVyblBhdGg6IHtcbiAgICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgICByZWdFeDogU2ltcGxlU2NoZW1hLlJlZ0V4LkVtYWlsLFxuICAgICAgICBvcHRpb25hbDp0cnVlIFxuICAgIH0sXG4gICAgdGVtcGxhdGVVUkw6e1xuICAgICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICAgIHJlZ0V4OiBcIkAoaHR0cHM/fGZ0cCk6Ly8oLVxcXFwuKT8oW15cXFxccy8/XFxcXC4jLV0rXFxcXC4/KSsoL1teXFxcXHNdKik/JEBcIixcbiAgICAgICAgb3B0aW9uYWw6dHJ1ZSBcbiAgICB9XG59KTtcblxuY29uc3QgY3JlYXRlVXNlclNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICAgIHVzZXJuYW1lOiB7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICByZWdFeDogXCJeW0EtWixhLXosMC05LCEsXywkLCNdezQsMjR9JFwiICAvL09ubHkgdXNlcm5hbWVzIGJldHdlZW4gNC0yNCBjaGFyYWN0ZXJzIGZyb20gQS1aLGEteiwwLTksISxfLCQsIyBhbGxvd2VkXG4gICAgfSxcbiAgICBlbWFpbDoge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgcmVnRXg6IFNpbXBsZVNjaGVtYS5SZWdFeC5FbWFpbFxuICAgIH0sXG4gICAgcGFzc3dvcmQ6IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIHJlZ0V4OiBcIl5bQS1aLGEteiwwLTksISxfLCQsI117OCwyNH0kXCIgLy9Pbmx5IHBhc3N3b3JkcyBiZXR3ZWVuIDgtMjQgY2hhcmFjdGVycyBmcm9tIEEtWixhLXosMC05LCEsXywkLCMgYWxsb3dlZFxuICAgIH0sXG4gICAgbWFpbFRlbXBsYXRlOntcbiAgICAgICAgdHlwZTogbWFpbFRlbXBsYXRlU2NoZW1hLFxuICAgICAgICBvcHRpb25hbDp0cnVlIFxuICAgIH1cbiAgfSk7XG4gIGNvbnN0IHVwZGF0ZVVzZXJTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgICBtYWlsVGVtcGxhdGU6e1xuICAgICAgICB0eXBlOiBtYWlsVGVtcGxhdGVTY2hlbWFcbiAgICB9XG59KTtcblxuLy9UT0RPOiBjb2xsZWN0aW9uIG9wdGlvbnMgc2VwYXJhdGVcbmNvbnN0IGNvbGxlY3Rpb25PcHRpb25zID1cbiAge1xuICAgIHBhdGg6XCJ1c2Vyc1wiLFxuICAgIHJvdXRlT3B0aW9uczpcbiAgICB7XG4gICAgICAgIGF1dGhSZXF1aXJlZCA6IHRydWVcbiAgICAgICAgLy8scm9sZVJlcXVpcmVkIDogXCJhZG1pblwiXG4gICAgfSxcbiAgICBleGNsdWRlZEVuZHBvaW50czogWydwYXRjaCcsJ2RlbGV0ZUFsbCddLFxuICAgIGVuZHBvaW50czpcbiAgICB7XG4gICAgICAgIGRlbGV0ZTp7cm9sZVJlcXVpcmVkIDogXCJhZG1pblwifSxcbiAgICAgICAgcG9zdDpcbiAgICAgICAge1xuICAgICAgICAgICAgcm9sZVJlcXVpcmVkIDogXCJhZG1pblwiLFxuICAgICAgICAgICAgYWN0aW9uOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIGNvbnN0IHFQYXJhbXMgPSB0aGlzLnF1ZXJ5UGFyYW1zO1xuICAgICAgICAgICAgICAgIGNvbnN0IGJQYXJhbXMgPSB0aGlzLmJvZHlQYXJhbXM7XG4gICAgICAgICAgICAgICAgbGV0IHBhcmFtcyA9IHt9O1xuICAgICAgICAgICAgICAgIGlmKHFQYXJhbXMgIT09IHVuZGVmaW5lZCkgcGFyYW1zID0gey4uLnFQYXJhbXN9XG4gICAgICAgICAgICAgICAgaWYoYlBhcmFtcyAhPT0gdW5kZWZpbmVkKSBwYXJhbXMgPSB7Li4ucGFyYW1zLCAuLi5iUGFyYW1zfVxuICAgICAgICAgICAgICAgIHRyeXtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHVzZXJJZDtcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlVXNlclNjaGVtYS52YWxpZGF0ZShwYXJhbXMpO1xuICAgICAgICAgICAgICAgICAgICBsb2dNYWluKCd2YWxpZGF0ZWQnLHBhcmFtcyk7XG4gICAgICAgICAgICAgICAgICAgIGlmKHBhcmFtcy5tYWlsVGVtcGxhdGUgIT09IHVuZGVmaW5lZCl7XG4gICAgICAgICAgICAgICAgICAgICAgICB1c2VySWQgPSBBY2NvdW50cy5jcmVhdGVVc2VyKHt1c2VybmFtZTpwYXJhbXMudXNlcm5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW1haWw6cGFyYW1zLmVtYWlsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhc3N3b3JkOnBhcmFtcy5wYXNzd29yZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9maWxlOnttYWlsVGVtcGxhdGU6cGFyYW1zLm1haWxUZW1wbGF0ZX19KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgICAgICAgICAgdXNlcklkID0gQWNjb3VudHMuY3JlYXRlVXNlcih7dXNlcm5hbWU6cGFyYW1zLnVzZXJuYW1lLGVtYWlsOnBhcmFtcy5lbWFpbCxwYXNzd29yZDpwYXJhbXMucGFzc3dvcmQsIHByb2ZpbGU6e319KTtcbiAgICAgICAgICAgICAgICAgICAgfSAgICBcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtzdGF0dXM6ICdzdWNjZXNzJywgZGF0YToge3VzZXJpZDogdXNlcklkfX07XG4gICAgICAgICAgICAgICAgfSBjYXRjaChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIHtzdGF0dXNDb2RlOiA0MDAsIGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogZXJyb3IubWVzc2FnZX19O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgcHV0OlxuICAgICAgICB7XG4gICAgICAgICAgICBhY3Rpb246IGZ1bmN0aW9uKCl7ICAgICAgXG4gICAgICAgICAgICAgICAgY29uc3QgcVBhcmFtcyA9IHRoaXMucXVlcnlQYXJhbXM7XG4gICAgICAgICAgICAgICAgY29uc3QgYlBhcmFtcyA9IHRoaXMuYm9keVBhcmFtcztcbiAgICAgICAgICAgICAgICBsZXQgcGFyYW1zID0ge307XG4gICAgICAgICAgICAgICAgbGV0IHVpZD10aGlzLnVzZXJJZDtcbiAgICAgICAgICAgICAgICBjb25zdCBwYXJhbUlkPXRoaXMudXJsUGFyYW1zLmlkO1xuICAgICAgICAgICAgICAgIGlmKHFQYXJhbXMgIT09IHVuZGVmaW5lZCkgcGFyYW1zID0gey4uLnFQYXJhbXN9XG4gICAgICAgICAgICAgICAgaWYoYlBhcmFtcyAhPT0gdW5kZWZpbmVkKSBwYXJhbXMgPSB7Li4ucGFyYW1zLCAuLi5iUGFyYW1zfVxuXG4gICAgICAgICAgICAgICAgdHJ5eyAvL1RPRE8gdGhpcyBpcyBub3QgbmVjZXNzYXJ5IGhlcmUgYW5kIGNhbiBwcm9iYWJseSBnbyByaWdodCBpbnRvIHRoZSBkZWZpbml0aW9uIG9mIHRoZSBSRVNUIE1FVEhPRCBuZXh0IHRvIHB1dCAoIT8hKVxuICAgICAgICAgICAgICAgICAgICBpZighUm9sZXMudXNlcklzSW5Sb2xlKHVpZCwgJ2FkbWluJykpe1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYodWlkIT09cGFyYW1JZCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJObyBQZXJtaXNzaW9uXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZVVzZXJTY2hlbWEudmFsaWRhdGUocGFyYW1zKTtcbiAgICAgICAgICAgICAgICAgICAgaWYoIU1ldGVvci51c2Vycy51cGRhdGUodGhpcy51cmxQYXJhbXMuaWQseyRzZXQ6e1wicHJvZmlsZS5tYWlsVGVtcGxhdGVcIjpwYXJhbXMubWFpbFRlbXBsYXRlfX0pKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IEVycm9yKFwiRmFpbGVkIHRvIHVwZGF0ZSB1c2VyXCIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7c3RhdHVzOiAnc3VjY2VzcycsIGRhdGE6IHt1c2VyaWQ6IHRoaXMudXJsUGFyYW1zLmlkLCBtYWlsVGVtcGxhdGU6cGFyYW1zLm1haWxUZW1wbGF0ZX19O1xuICAgICAgICAgICAgICAgIH0gY2F0Y2goZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiB7c3RhdHVzQ29kZTogNDAwLCBib2R5OiB7c3RhdHVzOiAnZmFpbCcsIG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2V9fTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5BcGkuYWRkQ29sbGVjdGlvbihNZXRlb3IudXNlcnMsY29sbGVjdGlvbk9wdGlvbnMpOyIsImltcG9ydCB7IEFwaSB9IGZyb20gJy4uL3Jlc3QuanMnO1xuaW1wb3J0IHZlcmlmeU9wdEluIGZyb20gJy4uLy4uLy4uLy4uL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvb3B0LWlucy92ZXJpZnkuanMnO1xuXG5BcGkuYWRkUm91dGUoJ29wdC1pbi92ZXJpZnknLCB7YXV0aFJlcXVpcmVkOiB0cnVlfSwge1xuICBnZXQ6IHtcbiAgICBhdXRoUmVxdWlyZWQ6IGZhbHNlLFxuICAgIGFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnN0IHFQYXJhbXMgPSB0aGlzLnF1ZXJ5UGFyYW1zO1xuICAgICAgICBjb25zdCBiUGFyYW1zID0gdGhpcy5ib2R5UGFyYW1zO1xuICAgICAgICBsZXQgcGFyYW1zID0ge31cbiAgICAgICAgaWYocVBhcmFtcyAhPT0gdW5kZWZpbmVkKSBwYXJhbXMgPSB7Li4ucVBhcmFtc31cbiAgICAgICAgaWYoYlBhcmFtcyAhPT0gdW5kZWZpbmVkKSBwYXJhbXMgPSB7Li4ucGFyYW1zLCAuLi5iUGFyYW1zfVxuXG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCB2YWwgPSB2ZXJpZnlPcHRJbihwYXJhbXMpO1xuICAgICAgICByZXR1cm4ge3N0YXR1czogXCJzdWNjZXNzXCIsIGRhdGE6IHt2YWx9fTtcbiAgICAgIH0gY2F0Y2goZXJyb3IpIHtcbiAgICAgICAgcmV0dXJuIHtzdGF0dXNDb2RlOiA1MDAsIGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogZXJyb3IubWVzc2FnZX19O1xuICAgICAgfVxuICAgIH1cbiAgfVxufSk7XG4iLCJpbXBvcnQgeyBSZXN0aXZ1cyB9IGZyb20gJ21ldGVvci9uaW1ibGU6cmVzdGl2dXMnO1xuaW1wb3J0IHsgaXNEZWJ1ZyB9IGZyb20gJy4uLy4uLy4uL2ltcG9ydHMvc3RhcnR1cC9zZXJ2ZXIvZGFwcC1jb25maWd1cmF0aW9uLmpzJztcbmltcG9ydCB7IFNFTkRfQVBQLCBDT05GSVJNX0FQUCwgVkVSSUZZX0FQUCwgaXNBcHBUeXBlIH0gZnJvbSAnLi4vLi4vLi4vaW1wb3J0cy9zdGFydHVwL3NlcnZlci90eXBlLWNvbmZpZ3VyYXRpb24uanMnO1xuXG5leHBvcnQgY29uc3QgRE9JX0NPTkZJUk1BVElPTl9ST1VURSA9IFwib3B0LWluL2NvbmZpcm1cIjtcbmV4cG9ydCBjb25zdCBET0lfQ09ORklSTUFUSU9OX05PVElGWV9ST1VURSA9IFwib3B0LWluXCI7XG5leHBvcnQgY29uc3QgRE9JX1dBTExFVE5PVElGWV9ST1VURSA9IFwid2FsbGV0bm90aWZ5XCI7XG5leHBvcnQgY29uc3QgRE9JX0ZFVENIX1JPVVRFID0gXCJkb2ktbWFpbFwiO1xuZXhwb3J0IGNvbnN0IERPSV9FWFBPUlRfUk9VVEUgPSBcImV4cG9ydFwiO1xuZXhwb3J0IGNvbnN0IFVTRVJTX0NPTExFQ1RJT05fUk9VVEUgPSBcInVzZXJzXCJcbmV4cG9ydCBjb25zdCBBUElfUEFUSCA9IFwiYXBpL1wiO1xuZXhwb3J0IGNvbnN0IFZFUlNJT04gPSBcInYxXCI7XG5cbmV4cG9ydCBjb25zdCBBcGkgPSBuZXcgUmVzdGl2dXMoe1xuICBhcGlQYXRoOiBBUElfUEFUSCxcbiAgdmVyc2lvbjogVkVSU0lPTixcbiAgdXNlRGVmYXVsdEF1dGg6IHRydWUsXG4gIHByZXR0eUpzb246IHRydWVcbn0pO1xuXG5pZihpc0RlYnVnKCkpIHJlcXVpcmUoJy4vaW1wb3J0cy9kZWJ1Zy5qcycpO1xuaWYoaXNBcHBUeXBlKFNFTkRfQVBQKSkgcmVxdWlyZSgnLi9pbXBvcnRzL3NlbmQuanMnKTtcbmlmKGlzQXBwVHlwZShDT05GSVJNX0FQUCkpIHJlcXVpcmUoJy4vaW1wb3J0cy9jb25maXJtLmpzJyk7XG5pZihpc0FwcFR5cGUoVkVSSUZZX0FQUCkpIHJlcXVpcmUoJy4vaW1wb3J0cy92ZXJpZnkuanMnKTtcbnJlcXVpcmUoJy4vaW1wb3J0cy91c2VyLmpzJyk7XG4iLCJcbmltcG9ydCB7IEpvYkNvbGxlY3Rpb24sSm9iIH0gZnJvbSAnbWV0ZW9yL3ZzaXZzaTpqb2ItY29sbGVjdGlvbic7XG5leHBvcnQgY29uc3QgQmxvY2tjaGFpbkpvYnMgPSBKb2JDb2xsZWN0aW9uKCdibG9ja2NoYWluJyk7XG5pbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCBpbnNlcnQgZnJvbSAnLi4vLi4vaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9kb2ljaGFpbi9pbnNlcnQuanMnO1xuaW1wb3J0IHVwZGF0ZSBmcm9tICcuLi8uLi9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2RvaWNoYWluL3VwZGF0ZS5qcyc7XG4vKiBlc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtdmFycyAqLyAvL1RPRE8gcmUtZW5hYmxlIHRoaXMhXG5pbXBvcnQgY2hlY2tOZXdUcmFuc2FjdGlvbiBmcm9tICcuLi8uLi9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2RvaWNoYWluL2NoZWNrX25ld190cmFuc2FjdGlvbnMuanMnO1xuaW1wb3J0IHsgQ09ORklSTV9BUFAsIGlzQXBwVHlwZSB9IGZyb20gJy4uLy4uL2ltcG9ydHMvc3RhcnR1cC9zZXJ2ZXIvdHlwZS1jb25maWd1cmF0aW9uLmpzJztcbmltcG9ydCB7bG9nTWFpbn0gZnJvbSBcIi4uLy4uL2ltcG9ydHMvc3RhcnR1cC9zZXJ2ZXIvbG9nLWNvbmZpZ3VyYXRpb25cIjtcblxuQmxvY2tjaGFpbkpvYnMucHJvY2Vzc0pvYnMoJ2luc2VydCcsIHt3b3JrVGltZW91dDogMzAqMTAwMH0sZnVuY3Rpb24gKGpvYiwgY2IpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCBlbnRyeSA9IGpvYi5kYXRhO1xuICAgIGluc2VydChlbnRyeSk7XG4gICAgam9iLmRvbmUoKTtcbiAgfSBjYXRjaChleGNlcHRpb24pIHtcbiAgICBqb2IuZmFpbCgpO1xuXG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdqb2JzLmJsb2NrY2hhaW4uaW5zZXJ0LmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH0gZmluYWxseSB7XG4gICAgY2IoKTtcbiAgfVxufSk7XG5cbkJsb2NrY2hhaW5Kb2JzLnByb2Nlc3NKb2JzKCd1cGRhdGUnLCB7d29ya1RpbWVvdXQ6IDMwKjEwMDB9LGZ1bmN0aW9uIChqb2IsIGNiKSB7XG4gIHRyeSB7XG4gICAgY29uc3QgZW50cnkgPSBqb2IuZGF0YTtcbiAgICB1cGRhdGUoZW50cnksam9iKTtcbiAgfSBjYXRjaChleGNlcHRpb24pIHtcbiAgICBqb2IuZmFpbCgpO1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2pvYnMuYmxvY2tjaGFpbi51cGRhdGUuZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgfSBmaW5hbGx5IHtcbiAgICBjYigpO1xuICB9XG59KTtcblxuQmxvY2tjaGFpbkpvYnMucHJvY2Vzc0pvYnMoJ2NoZWNrTmV3VHJhbnNhY3Rpb24nLCB7d29ya1RpbWVvdXQ6IDMwKjEwMDB9LGZ1bmN0aW9uIChqb2IsIGNiKSB7XG4gIHRyeSB7XG4gICAgaWYoIWlzQXBwVHlwZShDT05GSVJNX0FQUCkpIHtcbiAgICAgIGpvYi5wYXVzZSgpO1xuICAgICAgam9iLmNhbmNlbCgpO1xuICAgICAgam9iLnJlbW92ZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvL2NoZWNrTmV3VHJhbnNhY3Rpb24obnVsbCxqb2IpO1xuICAgIH1cbiAgfSBjYXRjaChleGNlcHRpb24pIHtcbiAgICBqb2IuZmFpbCgpO1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2pvYnMuYmxvY2tjaGFpbi5jaGVja05ld1RyYW5zYWN0aW9ucy5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9IGZpbmFsbHkge1xuICAgIGNiKCk7XG4gIH1cbn0pO1xuXG5uZXcgSm9iKEJsb2NrY2hhaW5Kb2JzLCAnY2xlYW51cCcsIHt9KVxuICAgIC5yZXBlYXQoeyBzY2hlZHVsZTogQmxvY2tjaGFpbkpvYnMubGF0ZXIucGFyc2UudGV4dChcImV2ZXJ5IDUgbWludXRlc1wiKSB9KVxuICAgIC5zYXZlKHtjYW5jZWxSZXBlYXRzOiB0cnVlfSk7XG5cbmxldCBxID0gQmxvY2tjaGFpbkpvYnMucHJvY2Vzc0pvYnMoJ2NsZWFudXAnLHsgcG9sbEludGVydmFsOiBmYWxzZSwgd29ya1RpbWVvdXQ6IDYwKjEwMDAgfSAsZnVuY3Rpb24gKGpvYiwgY2IpIHtcbiAgY29uc3QgY3VycmVudCA9IG5ldyBEYXRlKClcbiAgICBjdXJyZW50LnNldE1pbnV0ZXMoY3VycmVudC5nZXRNaW51dGVzKCkgLSA1KTtcblxuICBjb25zdCBpZHMgPSBCbG9ja2NoYWluSm9icy5maW5kKHtcbiAgICAgICAgICBzdGF0dXM6IHskaW46IEpvYi5qb2JTdGF0dXNSZW1vdmFibGV9LFxuICAgICAgICAgIHVwZGF0ZWQ6IHskbHQ6IGN1cnJlbnR9fSxcbiAgICAgICAgICB7ZmllbGRzOiB7IF9pZDogMSB9fSk7XG5cbiAgICBsb2dNYWluKCdmb3VuZCAgcmVtb3ZhYmxlIGJsb2NrY2hhaW4gam9iczonLGlkcyk7XG4gICAgQmxvY2tjaGFpbkpvYnMucmVtb3ZlSm9icyhpZHMpO1xuICAgIGlmKGlkcy5sZW5ndGggPiAwKXtcbiAgICAgIGpvYi5kb25lKFwiUmVtb3ZlZCAje2lkcy5sZW5ndGh9IG9sZCBqb2JzXCIpO1xuICAgIH1cbiAgICBjYigpO1xufSk7XG5cbkJsb2NrY2hhaW5Kb2JzLmZpbmQoeyB0eXBlOiAnam9iVHlwZScsIHN0YXR1czogJ3JlYWR5JyB9KVxuICAgIC5vYnNlcnZlKHtcbiAgICAgICAgYWRkZWQ6IGZ1bmN0aW9uICgpIHsgcS50cmlnZ2VyKCk7IH1cbiAgICB9KTtcbiIsImltcG9ydCB7IEpvYkNvbGxlY3Rpb24sIEpvYiB9IGZyb20gJ21ldGVvci92c2l2c2k6am9iLWNvbGxlY3Rpb24nO1xuaW1wb3J0IGZldGNoRG9pTWFpbERhdGEgZnJvbSAnLi4vLi4vaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9kYXBwcy9mZXRjaF9kb2ktbWFpbC1kYXRhLmpzJztcbmltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IHtsb2dNYWlufSBmcm9tIFwiLi4vLi4vaW1wb3J0cy9zdGFydHVwL3NlcnZlci9sb2ctY29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHtCbG9ja2NoYWluSm9ic30gZnJvbSBcIi4vYmxvY2tjaGFpbl9qb2JzXCI7XG5cbmV4cG9ydCBjb25zdCBEQXBwSm9icyA9IEpvYkNvbGxlY3Rpb24oJ2RhcHAnKTtcblxuREFwcEpvYnMucHJvY2Vzc0pvYnMoJ2ZldGNoRG9pTWFpbERhdGEnLCBmdW5jdGlvbiAoam9iLCBjYikge1xuICB0cnkge1xuICAgIGNvbnN0IGRhdGEgPSBqb2IuZGF0YTtcbiAgICBmZXRjaERvaU1haWxEYXRhKGRhdGEpO1xuICAgIGpvYi5kb25lKCk7XG4gIH0gY2F0Y2goZXhjZXB0aW9uKSB7XG4gICAgam9iLmZhaWwoKTtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdqb2JzLmRhcHAuZmV0Y2hEb2lNYWlsRGF0YS5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9IGZpbmFsbHkge1xuICAgIGNiKCk7XG4gIH1cbn0pO1xuXG5cbm5ldyBKb2IoREFwcEpvYnMsICdjbGVhbnVwJywge30pXG4gICAgLnJlcGVhdCh7IHNjaGVkdWxlOiBEQXBwSm9icy5sYXRlci5wYXJzZS50ZXh0KFwiZXZlcnkgNSBtaW51dGVzXCIpIH0pXG4gICAgLnNhdmUoe2NhbmNlbFJlcGVhdHM6IHRydWV9KTtcblxubGV0IHEgPSBEQXBwSm9icy5wcm9jZXNzSm9icygnY2xlYW51cCcseyBwb2xsSW50ZXJ2YWw6IGZhbHNlLCB3b3JrVGltZW91dDogNjAqMTAwMCB9ICxmdW5jdGlvbiAoam9iLCBjYikge1xuICAgIGNvbnN0IGN1cnJlbnQgPSBuZXcgRGF0ZSgpXG4gICAgY3VycmVudC5zZXRNaW51dGVzKGN1cnJlbnQuZ2V0TWludXRlcygpIC0gNSk7XG5cbiAgICBjb25zdCBpZHMgPSBEQXBwSm9icy5maW5kKHtcbiAgICAgICAgICAgIHN0YXR1czogeyRpbjogSm9iLmpvYlN0YXR1c1JlbW92YWJsZX0sXG4gICAgICAgICAgICB1cGRhdGVkOiB7JGx0OiBjdXJyZW50fX0sXG4gICAgICAgIHtmaWVsZHM6IHsgX2lkOiAxIH19KTtcblxuICAgIGxvZ01haW4oJ2ZvdW5kICByZW1vdmFibGUgYmxvY2tjaGFpbiBqb2JzOicsaWRzKTtcbiAgICBEQXBwSm9icy5yZW1vdmVKb2JzKGlkcyk7XG4gICAgaWYoaWRzLmxlbmd0aCA+IDApe1xuICAgICAgICBqb2IuZG9uZShcIlJlbW92ZWQgI3tpZHMubGVuZ3RofSBvbGQgam9ic1wiKTtcbiAgICB9XG4gICAgY2IoKTtcbn0pO1xuXG5EQXBwSm9icy5maW5kKHsgdHlwZTogJ2pvYlR5cGUnLCBzdGF0dXM6ICdyZWFkeScgfSlcbiAgICAub2JzZXJ2ZSh7XG4gICAgICAgIGFkZGVkOiBmdW5jdGlvbiAoKSB7IHEudHJpZ2dlcigpOyB9XG4gICAgfSk7XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCBkbnMgZnJvbSAnZG5zJztcbmltcG9ydCB7bG9nU2VuZH0gZnJvbSBcIi4uLy4uL2ltcG9ydHMvc3RhcnR1cC9zZXJ2ZXIvbG9nLWNvbmZpZ3VyYXRpb25cIjtcblxuZXhwb3J0IGZ1bmN0aW9uIHJlc29sdmVUeHQoa2V5LCBkb21haW4pIHtcbiAgY29uc3Qgc3luY0Z1bmMgPSBNZXRlb3Iud3JhcEFzeW5jKGRuc19yZXNvbHZlVHh0KTtcbiAgdHJ5IHtcbiAgICBjb25zdCByZWNvcmRzID0gc3luY0Z1bmMoa2V5LCBkb21haW4pO1xuICAgIGlmKHJlY29yZHMgPT09IHVuZGVmaW5lZCkgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICBsZXQgdmFsdWUgPSB1bmRlZmluZWQ7XG4gICAgcmVjb3Jkcy5mb3JFYWNoKHJlY29yZCA9PiB7XG4gICAgICBpZihyZWNvcmRbMF0uc3RhcnRzV2l0aChrZXkpKSB7XG4gICAgICAgIGNvbnN0IHZhbCA9IHJlY29yZFswXS5zdWJzdHJpbmcoa2V5Lmxlbmd0aCsxKTtcbiAgICAgICAgdmFsdWUgPSB2YWwudHJpbSgpO1xuXG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9IGNhdGNoKGVycm9yKSB7XG4gICAgaWYoZXJyb3IubWVzc2FnZS5zdGFydHNXaXRoKFwicXVlcnlUeHQgRU5PREFUQVwiKSB8fFxuICAgICAgICBlcnJvci5tZXNzYWdlLnN0YXJ0c1dpdGgoXCJxdWVyeVR4dCBFTk9URk9VTkRcIikpIHJldHVybiB1bmRlZmluZWQ7XG4gICAgZWxzZSB0aHJvdyBlcnJvcjtcbiAgfVxufVxuXG5mdW5jdGlvbiBkbnNfcmVzb2x2ZVR4dChrZXksIGRvbWFpbiwgY2FsbGJhY2spIHtcbiAgICBsb2dTZW5kKFwicmVzb2x2aW5nIGRucyB0eHQgYXR0cmlidXRlOiBcIiwge2tleTprZXksZG9tYWluOmRvbWFpbn0pO1xuICAgIGRucy5yZXNvbHZlVHh0KGRvbWFpbiwgKGVyciwgcmVjb3JkcykgPT4ge1xuICAgIGNhbGxiYWNrKGVyciwgcmVjb3Jkcyk7XG4gIH0pO1xufVxuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQge2xvZ0Jsb2NrY2hhaW4sIGxvZ0NvbmZpcm0sIGxvZ0Vycm9yfSBmcm9tIFwiLi4vLi4vaW1wb3J0cy9zdGFydHVwL3NlcnZlci9sb2ctY29uZmlndXJhdGlvblwiO1xuXG5cbmNvbnN0IE5BTUVTUEFDRSA9ICdlLyc7XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFdpZihjbGllbnQsIGFkZHJlc3MpIHtcbiAgaWYoIWFkZHJlc3Mpe1xuICAgICAgICBhZGRyZXNzID0gZ2V0QWRkcmVzc2VzQnlBY2NvdW50KFwiXCIpWzBdO1xuICAgICAgICBsb2dCbG9ja2NoYWluKCdhZGRyZXNzIHdhcyBub3QgZGVmaW5lZCBzbyBnZXR0aW5nIHRoZSBmaXJzdCBleGlzdGluZyBvbmUgb2YgdGhlIHdhbGxldDonLGFkZHJlc3MpO1xuICB9XG4gIGlmKCFhZGRyZXNzKXtcbiAgICAgICAgYWRkcmVzcyA9IGdldE5ld0FkZHJlc3MoXCJcIik7XG4gICAgICAgIGxvZ0Jsb2NrY2hhaW4oJ2FkZHJlc3Mgd2FzIG5ldmVyIGRlZmluZWQgIGF0IGFsbCBnZW5lcmF0ZWQgbmV3IGFkZHJlc3MgZm9yIHRoaXMgd2FsbGV0OicsYWRkcmVzcyk7XG4gIH1cbiAgY29uc3Qgc3luY0Z1bmMgPSBNZXRlb3Iud3JhcEFzeW5jKGRvaWNoYWluX2R1bXBwcml2a2V5KTtcbiAgcmV0dXJuIHN5bmNGdW5jKGNsaWVudCwgYWRkcmVzcyk7XG59XG5cbmZ1bmN0aW9uIGRvaWNoYWluX2R1bXBwcml2a2V5KGNsaWVudCwgYWRkcmVzcywgY2FsbGJhY2spIHtcbiAgY29uc3Qgb3VyQWRkcmVzcyA9IGFkZHJlc3M7XG4gIGNsaWVudC5jbWQoJ2R1bXBwcml2a2V5Jywgb3VyQWRkcmVzcywgZnVuY3Rpb24oZXJyLCBkYXRhKSB7XG4gICAgaWYoZXJyKSAgbG9nRXJyb3IoJ2RvaWNoYWluX2R1bXBwcml2a2V5OicsZXJyKTtcbiAgICBjYWxsYmFjayhlcnIsIGRhdGEpO1xuICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEFkZHJlc3Nlc0J5QWNjb3VudChjbGllbnQsIGFjY291dCkge1xuICAgIGNvbnN0IHN5bmNGdW5jID0gTWV0ZW9yLndyYXBBc3luYyhkb2ljaGFpbl9nZXRhZGRyZXNzZXNieWFjY291bnQpO1xuICAgIHJldHVybiBzeW5jRnVuYyhjbGllbnQsIGFjY291dCk7XG59XG5cbmZ1bmN0aW9uIGRvaWNoYWluX2dldGFkZHJlc3Nlc2J5YWNjb3VudChjbGllbnQsIGFjY291bnQsIGNhbGxiYWNrKSB7XG4gICAgY29uc3Qgb3VyQWNjb3VudCA9IGFjY291bnQ7XG4gICAgY2xpZW50LmNtZCgnZ2V0YWRkcmVzc2VzYnlhY2NvdW50Jywgb3VyQWNjb3VudCwgZnVuY3Rpb24oZXJyLCBkYXRhKSB7XG4gICAgICAgIGlmKGVycikgIGxvZ0Vycm9yKCdnZXRhZGRyZXNzZXNieWFjY291bnQ6JyxlcnIpO1xuICAgICAgICBjYWxsYmFjayhlcnIsIGRhdGEpO1xuICAgIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0TmV3QWRkcmVzcyhjbGllbnQsIGFjY291dCkge1xuICAgIGNvbnN0IHN5bmNGdW5jID0gTWV0ZW9yLndyYXBBc3luYyhkb2ljaGFpbl9nZXRuZXdhZGRyZXNzKTtcbiAgICByZXR1cm4gc3luY0Z1bmMoY2xpZW50LCBhY2NvdXQpO1xufVxuZnVuY3Rpb24gZG9pY2hhaW5fZ2V0bmV3YWRkcmVzcyhjbGllbnQsIGFjY291bnQsIGNhbGxiYWNrKSB7XG4gICAgY29uc3Qgb3VyQWNjb3VudCA9IGFjY291bnQ7XG4gICAgY2xpZW50LmNtZCgnZ2V0bmV3YWRkcmVzc3MnLCBvdXJBY2NvdW50LCBmdW5jdGlvbihlcnIsIGRhdGEpIHtcbiAgICAgICAgaWYoZXJyKSAgbG9nRXJyb3IoJ2dldG5ld2FkZHJlc3NzOicsZXJyKTtcbiAgICAgICAgY2FsbGJhY2soZXJyLCBkYXRhKTtcbiAgICB9KTtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gc2lnbk1lc3NhZ2UoY2xpZW50LCBhZGRyZXNzLCBtZXNzYWdlKSB7XG4gICAgY29uc3Qgc3luY0Z1bmMgPSBNZXRlb3Iud3JhcEFzeW5jKGRvaWNoYWluX3NpZ25NZXNzYWdlKTtcbiAgICByZXR1cm4gc3luY0Z1bmMoY2xpZW50LCBhZGRyZXNzLCBtZXNzYWdlKTtcbn1cblxuZnVuY3Rpb24gZG9pY2hhaW5fc2lnbk1lc3NhZ2UoY2xpZW50LCBhZGRyZXNzLCBtZXNzYWdlLCBjYWxsYmFjaykge1xuICAgIGNvbnN0IG91ckFkZHJlc3MgPSBhZGRyZXNzO1xuICAgIGNvbnN0IG91ck1lc3NhZ2UgPSBtZXNzYWdlO1xuICAgIGNsaWVudC5jbWQoJ3NpZ25tZXNzYWdlJywgb3VyQWRkcmVzcywgb3VyTWVzc2FnZSwgZnVuY3Rpb24oZXJyLCBkYXRhKSB7XG4gICAgICAgIGNhbGxiYWNrKGVyciwgZGF0YSk7XG4gICAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBuYW1lU2hvdyhjbGllbnQsIGlkKSB7XG4gIGNvbnN0IHN5bmNGdW5jID0gTWV0ZW9yLndyYXBBc3luYyhkb2ljaGFpbl9uYW1lU2hvdyk7XG4gIHJldHVybiBzeW5jRnVuYyhjbGllbnQsIGlkKTtcbn1cblxuZnVuY3Rpb24gZG9pY2hhaW5fbmFtZVNob3coY2xpZW50LCBpZCwgY2FsbGJhY2spIHtcbiAgY29uc3Qgb3VySWQgPSBjaGVja0lkKGlkKTtcbiAgbG9nQ29uZmlybSgnZG9pY2hhaW4tY2xpIG5hbWVfc2hvdyA6JyxvdXJJZCk7XG4gIGNsaWVudC5jbWQoJ25hbWVfc2hvdycsIG91cklkLCBmdW5jdGlvbihlcnIsIGRhdGEpIHtcbiAgICBpZihlcnIgIT09IHVuZGVmaW5lZCAmJiBlcnIgIT09IG51bGwgJiYgZXJyLm1lc3NhZ2Uuc3RhcnRzV2l0aChcIm5hbWUgbm90IGZvdW5kXCIpKSB7XG4gICAgICBlcnIgPSB1bmRlZmluZWQsXG4gICAgICBkYXRhID0gdW5kZWZpbmVkXG4gICAgfVxuICAgIGNhbGxiYWNrKGVyciwgZGF0YSk7XG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZmVlRG9pKGNsaWVudCwgYWRkcmVzcykge1xuICAgIGNvbnN0IHN5bmNGdW5jID0gTWV0ZW9yLndyYXBBc3luYyhkb2ljaGFpbl9mZWVEb2kpO1xuICAgIHJldHVybiBzeW5jRnVuYyhjbGllbnQsIGFkZHJlc3MpO1xufVxuXG5mdW5jdGlvbiBkb2ljaGFpbl9mZWVEb2koY2xpZW50LCBhZGRyZXNzLCBjYWxsYmFjaykge1xuICAgIGNvbnN0IGRlc3RBZGRyZXNzID0gYWRkcmVzcztcbiAgICBjbGllbnQuY21kKCdzZW5kdG9hZGRyZXNzJywgZGVzdEFkZHJlc3MsICcwLjAyJywgZnVuY3Rpb24oZXJyLCBkYXRhKSB7XG4gICAgICAgIGNhbGxiYWNrKGVyciwgZGF0YSk7XG4gICAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBuYW1lRG9pKGNsaWVudCwgbmFtZSwgdmFsdWUsIGFkZHJlc3MpIHtcbiAgICBjb25zdCBzeW5jRnVuYyA9IE1ldGVvci53cmFwQXN5bmMoZG9pY2hhaW5fbmFtZURvaSk7XG4gICAgcmV0dXJuIHN5bmNGdW5jKGNsaWVudCwgbmFtZSwgdmFsdWUsIGFkZHJlc3MpO1xufVxuXG5mdW5jdGlvbiBkb2ljaGFpbl9uYW1lRG9pKGNsaWVudCwgbmFtZSwgdmFsdWUsIGFkZHJlc3MsIGNhbGxiYWNrKSB7XG4gICAgY29uc3Qgb3VyTmFtZSA9IGNoZWNrSWQobmFtZSk7XG4gICAgY29uc3Qgb3VyVmFsdWUgPSB2YWx1ZTtcbiAgICBjb25zdCBkZXN0QWRkcmVzcyA9IGFkZHJlc3M7XG4gICAgaWYoIWFkZHJlc3MpIHtcbiAgICAgICAgY2xpZW50LmNtZCgnbmFtZV9kb2knLCBvdXJOYW1lLCBvdXJWYWx1ZSwgZnVuY3Rpb24gKGVyciwgZGF0YSkge1xuICAgICAgICAgICAgY2FsbGJhY2soZXJyLCBkYXRhKTtcbiAgICAgICAgfSk7XG4gICAgfWVsc2V7XG4gICAgICAgIGNsaWVudC5jbWQoJ25hbWVfZG9pJywgb3VyTmFtZSwgb3VyVmFsdWUsIGRlc3RBZGRyZXNzLCBmdW5jdGlvbihlcnIsIGRhdGEpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKGVyciwgZGF0YSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxpc3RTaW5jZUJsb2NrKGNsaWVudCwgYmxvY2spIHtcbiAgICBjb25zdCBzeW5jRnVuYyA9IE1ldGVvci53cmFwQXN5bmMoZG9pY2hhaW5fbGlzdFNpbmNlQmxvY2spO1xuICAgIHZhciBvdXJCbG9jayA9IGJsb2NrO1xuICAgIGlmKG91ckJsb2NrID09PSB1bmRlZmluZWQpIG91ckJsb2NrID0gbnVsbDtcbiAgICByZXR1cm4gc3luY0Z1bmMoY2xpZW50LCBvdXJCbG9jayk7XG59XG5cbmZ1bmN0aW9uIGRvaWNoYWluX2xpc3RTaW5jZUJsb2NrKGNsaWVudCwgYmxvY2ssIGNhbGxiYWNrKSB7XG4gICAgdmFyIG91ckJsb2NrID0gYmxvY2s7XG4gICAgaWYob3VyQmxvY2sgPT09IG51bGwpIGNsaWVudC5jbWQoJ2xpc3RzaW5jZWJsb2NrJywgZnVuY3Rpb24oZXJyLCBkYXRhKSB7XG4gICAgICAgIGNhbGxiYWNrKGVyciwgZGF0YSk7XG4gICAgfSk7XG4gICAgZWxzZSBjbGllbnQuY21kKCdsaXN0c2luY2VibG9jaycsIG91ckJsb2NrLCBmdW5jdGlvbihlcnIsIGRhdGEpIHtcbiAgICAgICAgY2FsbGJhY2soZXJyLCBkYXRhKTtcbiAgICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFRyYW5zYWN0aW9uKGNsaWVudCwgdHhpZCkge1xuICAgIGNvbnN0IHN5bmNGdW5jID0gTWV0ZW9yLndyYXBBc3luYyhkb2ljaGFpbl9nZXR0cmFuc2FjdGlvbik7XG4gICAgcmV0dXJuIHN5bmNGdW5jKGNsaWVudCwgdHhpZCk7XG59XG5cbmZ1bmN0aW9uIGRvaWNoYWluX2dldHRyYW5zYWN0aW9uKGNsaWVudCwgdHhpZCwgY2FsbGJhY2spIHtcbiAgICBsb2dDb25maXJtKCdkb2ljaGFpbl9nZXR0cmFuc2FjdGlvbjonLHR4aWQpO1xuICAgIGNsaWVudC5jbWQoJ2dldHRyYW5zYWN0aW9uJywgdHhpZCwgZnVuY3Rpb24oZXJyLCBkYXRhKSB7XG4gICAgICAgIGlmKGVycikgIGxvZ0Vycm9yKCdkb2ljaGFpbl9nZXR0cmFuc2FjdGlvbjonLGVycik7XG4gICAgICAgIGNhbGxiYWNrKGVyciwgZGF0YSk7XG4gICAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRSYXdUcmFuc2FjdGlvbihjbGllbnQsIHR4aWQpIHtcbiAgICBjb25zdCBzeW5jRnVuYyA9IE1ldGVvci53cmFwQXN5bmMoZG9pY2hhaW5fZ2V0cmF3dHJhbnNhY3Rpb24pO1xuICAgIHJldHVybiBzeW5jRnVuYyhjbGllbnQsIHR4aWQpO1xufVxuXG5mdW5jdGlvbiBkb2ljaGFpbl9nZXRyYXd0cmFuc2FjdGlvbihjbGllbnQsIHR4aWQsIGNhbGxiYWNrKSB7XG4gICAgbG9nQmxvY2tjaGFpbignZG9pY2hhaW5fZ2V0cmF3dHJhbnNhY3Rpb246Jyx0eGlkKTtcbiAgICBjbGllbnQuY21kKCdnZXRyYXd0cmFuc2FjdGlvbicsIHR4aWQsIDEsIGZ1bmN0aW9uKGVyciwgZGF0YSkge1xuICAgICAgICBpZihlcnIpICBsb2dFcnJvcignZG9pY2hhaW5fZ2V0cmF3dHJhbnNhY3Rpb246JyxlcnIpO1xuICAgICAgICBjYWxsYmFjayhlcnIsIGRhdGEpO1xuICAgIH0pO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGdldEJhbGFuY2UoY2xpZW50KSB7XG4gICAgY29uc3Qgc3luY0Z1bmMgPSBNZXRlb3Iud3JhcEFzeW5jKGRvaWNoYWluX2dldGJhbGFuY2UpO1xuICAgIHJldHVybiBzeW5jRnVuYyhjbGllbnQpO1xufVxuXG5mdW5jdGlvbiBkb2ljaGFpbl9nZXRiYWxhbmNlKGNsaWVudCwgY2FsbGJhY2spIHtcbiAgICBjbGllbnQuY21kKCdnZXRiYWxhbmNlJywgZnVuY3Rpb24oZXJyLCBkYXRhKSB7XG4gICAgICAgIGlmKGVycikgeyBsb2dFcnJvcignZG9pY2hhaW5fZ2V0YmFsYW5jZTonLGVycik7fVxuICAgICAgICBjYWxsYmFjayhlcnIsIGRhdGEpO1xuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBjaGVja0lkKGlkKSB7XG4gICAgY29uc3QgRE9JX1BSRUZJWCA9IFwiZG9pOiBcIjtcbiAgICBsZXQgcmV0X3ZhbCA9IGlkOyAvL2RlZmF1bHQgdmFsdWVcblxuICAgIGlmKGlkLnN0YXJ0c1dpdGgoRE9JX1BSRUZJWCkpIHJldF92YWwgPSBpZC5zdWJzdHJpbmcoRE9JX1BSRUZJWC5sZW5ndGgpOyAvL2luIGNhc2UgaXQgc3RhcnRzIHdpdGggZG9pOiBjdXQgIHRoaXMgYXdheVxuICAgIGlmKCFpZC5zdGFydHNXaXRoKE5BTUVTUEFDRSkpIHJldF92YWwgPSBOQU1FU1BBQ0UraWQ7IC8vaW4gY2FzZSBpdCBkb2Vzbid0IHN0YXJ0IHdpdGggZS8gcHV0IGl0IGluIGZyb250IG5vdy5cbiAgcmV0dXJuIHJldF92YWw7XG59XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCB7IEhUVFAgfSBmcm9tICdtZXRlb3IvaHR0cCdcblxuZXhwb3J0IGZ1bmN0aW9uIGdldEh0dHBHRVQodXJsLCBxdWVyeSkge1xuICBjb25zdCBzeW5jRnVuYyA9IE1ldGVvci53cmFwQXN5bmMoX2dldCk7XG4gIHJldHVybiBzeW5jRnVuYyh1cmwsIHF1ZXJ5KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEh0dHBHRVRkYXRhKHVybCwgZGF0YSkge1xuICAgIGNvbnN0IHN5bmNGdW5jID0gTWV0ZW9yLndyYXBBc3luYyhfZ2V0RGF0YSk7XG4gICAgcmV0dXJuIHN5bmNGdW5jKHVybCwgZGF0YSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRIdHRwUE9TVCh1cmwsIGRhdGEpIHtcbiAgICBjb25zdCBzeW5jRnVuYyA9IE1ldGVvci53cmFwQXN5bmMoX3Bvc3QpO1xuICAgIHJldHVybiBzeW5jRnVuYyh1cmwsIGRhdGEpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0SHR0cFBVVCh1cmwsIGRhdGEpIHtcbiAgICBjb25zdCBzeW5jRnVuYyA9IE1ldGVvci53cmFwQXN5bmMoX3B1dCk7XG4gICAgcmV0dXJuIHN5bmNGdW5jKHVybCwgZGF0YSk7XG59XG5cbmZ1bmN0aW9uIF9nZXQodXJsLCBxdWVyeSwgY2FsbGJhY2spIHtcbiAgY29uc3Qgb3VyVXJsID0gdXJsO1xuICBjb25zdCBvdXJRdWVyeSA9IHF1ZXJ5O1xuICBIVFRQLmdldChvdXJVcmwsIHtxdWVyeTogb3VyUXVlcnl9LCBmdW5jdGlvbihlcnIsIHJldCkge1xuICAgIGNhbGxiYWNrKGVyciwgcmV0KTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIF9nZXREYXRhKHVybCwgZGF0YSwgY2FsbGJhY2spIHtcbiAgICBjb25zdCBvdXJVcmwgPSB1cmw7XG4gICAgY29uc3Qgb3VyRGF0YSA9IGRhdGE7XG4gICAgSFRUUC5nZXQob3VyVXJsLCBvdXJEYXRhLCBmdW5jdGlvbihlcnIsIHJldCkge1xuICAgICAgICBjYWxsYmFjayhlcnIsIHJldCk7XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIF9wb3N0KHVybCwgZGF0YSwgY2FsbGJhY2spIHtcbiAgICBjb25zdCBvdXJVcmwgPSB1cmw7XG4gICAgY29uc3Qgb3VyRGF0YSA9ICBkYXRhO1xuXG4gICAgSFRUUC5wb3N0KG91clVybCwgb3VyRGF0YSwgZnVuY3Rpb24oZXJyLCByZXQpIHtcbiAgICAgICAgY2FsbGJhY2soZXJyLCByZXQpO1xuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBfcHV0KHVybCwgdXBkYXRlRGF0YSwgY2FsbGJhY2spIHtcbiAgICBjb25zdCBvdXJVcmwgPSB1cmw7XG4gICAgY29uc3Qgb3VyRGF0YSA9IHtcbiAgICAgICAgZGF0YTogdXBkYXRlRGF0YVxuICAgIH1cblxuICAgIEhUVFAucHV0KG91clVybCwgb3VyRGF0YSwgZnVuY3Rpb24oZXJyLCByZXQpIHtcbiAgICAgIGNhbGxiYWNrKGVyciwgcmV0KTtcbiAgICB9KTtcbn1cbiIsImltcG9ydCAnLi9tYWlsX2pvYnMuanMnO1xuaW1wb3J0ICcuL2RvaWNoYWluLmpzJztcbmltcG9ydCAnLi9ibG9ja2NoYWluX2pvYnMuanMnO1xuaW1wb3J0ICcuL2RhcHBfam9icy5qcyc7XG5pbXBvcnQgJy4vZG5zLmpzJztcbmltcG9ydCAnLi9yZXN0L3Jlc3QuanMnO1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgeyBKb2JDb2xsZWN0aW9uLCBKb2IgfSBmcm9tICdtZXRlb3IvdnNpdnNpOmpvYi1jb2xsZWN0aW9uJztcbmV4cG9ydCBjb25zdCBNYWlsSm9icyA9IEpvYkNvbGxlY3Rpb24oJ2VtYWlscycpO1xuaW1wb3J0IHNlbmRNYWlsIGZyb20gJy4uLy4uL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvZW1haWxzL3NlbmQuanMnO1xuaW1wb3J0IHtsb2dNYWlufSBmcm9tIFwiLi4vLi4vaW1wb3J0cy9zdGFydHVwL3NlcnZlci9sb2ctY29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHtCbG9ja2NoYWluSm9ic30gZnJvbSBcIi4vYmxvY2tjaGFpbl9qb2JzXCI7XG5cblxuXG5NYWlsSm9icy5wcm9jZXNzSm9icygnc2VuZCcsIGZ1bmN0aW9uIChqb2IsIGNiKSB7XG4gIHRyeSB7XG4gICAgY29uc3QgZW1haWwgPSBqb2IuZGF0YTtcbiAgICBzZW5kTWFpbChlbWFpbCk7XG4gICAgam9iLmRvbmUoKTtcbiAgfSBjYXRjaChleGNlcHRpb24pIHtcbiAgICBqb2IuZmFpbCgpO1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2pvYnMubWFpbC5zZW5kLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH0gZmluYWxseSB7XG4gICAgY2IoKTtcbiAgfVxufSk7XG5cblxubmV3IEpvYihNYWlsSm9icywgJ2NsZWFudXAnLCB7fSlcbiAgICAucmVwZWF0KHsgc2NoZWR1bGU6IE1haWxKb2JzLmxhdGVyLnBhcnNlLnRleHQoXCJldmVyeSA1IG1pbnV0ZXNcIikgfSlcbiAgICAuc2F2ZSh7Y2FuY2VsUmVwZWF0czogdHJ1ZX0pXG5cbmxldCBxID0gTWFpbEpvYnMucHJvY2Vzc0pvYnMoJ2NsZWFudXAnLHsgcG9sbEludGVydmFsOiBmYWxzZSwgd29ya1RpbWVvdXQ6IDYwKjEwMDAgfSAsZnVuY3Rpb24gKGpvYiwgY2IpIHtcbiAgICBjb25zdCBjdXJyZW50ID0gbmV3IERhdGUoKVxuICAgIGN1cnJlbnQuc2V0TWludXRlcyhjdXJyZW50LmdldE1pbnV0ZXMoKSAtIDUpO1xuXG4gICAgY29uc3QgaWRzID0gTWFpbEpvYnMuZmluZCh7XG4gICAgICAgICAgICBzdGF0dXM6IHskaW46IEpvYi5qb2JTdGF0dXNSZW1vdmFibGV9LFxuICAgICAgICAgICAgdXBkYXRlZDogeyRsdDogY3VycmVudH19LFxuICAgICAgICB7ZmllbGRzOiB7IF9pZDogMSB9fSk7XG5cbiAgICBsb2dNYWluKCdmb3VuZCAgcmVtb3ZhYmxlIGJsb2NrY2hhaW4gam9iczonLGlkcyk7XG4gICAgTWFpbEpvYnMucmVtb3ZlSm9icyhpZHMpO1xuICAgIGlmKGlkcy5sZW5ndGggPiAwKXtcbiAgICAgICAgam9iLmRvbmUoXCJSZW1vdmVkICN7aWRzLmxlbmd0aH0gb2xkIGpvYnNcIik7XG4gICAgfVxuICAgIGNiKCk7XG59KTtcblxuTWFpbEpvYnMuZmluZCh7IHR5cGU6ICdqb2JUeXBlJywgc3RhdHVzOiAncmVhZHknIH0pXG4gICAgLm9ic2VydmUoe1xuICAgICAgICBhZGRlZDogZnVuY3Rpb24gKCkgeyBxLnRyaWdnZXIoKTsgfVxuICAgIH0pO1xuXG4iLCJpbXBvcnQgJy9pbXBvcnRzL3N0YXJ0dXAvc2VydmVyJztcbmltcG9ydCAnLi9hcGkvaW5kZXguanMnO1xuIl19
