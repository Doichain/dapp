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
let OptIns;
module.link("../../opt-ins/opt-ins.js", {
  OptIns(v) {
    OptIns = v;
  }

}, 3);
Meteor.publish('recipients.byOwner', function recipientGet() {
  let pipeline = [];

  if (!Roles.userIsInRole(this.userId, ['admin'])) {
    pipeline.push({
      $redact: {
        $cond: {
          if: {
            $cmp: ["$ownerId", this.userId]
          },
          then: "$$PRUNE",
          else: "$$KEEP"
        }
      }
    });
  }

  pipeline.push({
    $lookup: {
      from: "recipients",
      localField: "recipient",
      foreignField: "_id",
      as: "RecipientEmail"
    }
  });
  pipeline.push({
    $unwind: "$RecipientEmail"
  });
  pipeline.push({
    $project: {
      "RecipientEmail._id": 1
    }
  });
  const result = OptIns.aggregate(pipeline);
  let rIds = [];
  result.forEach(element => {
    rIds.push(element.RecipientEmail._id);
  });
  return Recipients.find({
    "_id": {
      "$in": rIds
    }
  }, {
    fields: Recipients.publicFields
  });
});
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
let Meta;
module.link("../../api/meta/meta.js", {
  Meta(v) {
    Meta = v;
  }

}, 2);
Meteor.startup(() => {
  let version = Assets.getText("version.json");

  if (Meta.find({
    key: "version"
  }).count() > 0) {
    Meta.remove({
      key: "version"
    });
  }

  Meta.insert({
    key: "version",
    value: version
  });

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
  forbidClientAccountCreation: true
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

},"status.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// server/api/rest/imports/status.js                                                                                  //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
let Api;
module.link("../rest.js", {
  Api(v) {
    Api = v;
  }

}, 0);
let getInfo;
module.link("../../doichain", {
  getInfo(v) {
    getInfo = v;
  }

}, 1);
let CONFIRM_CLIENT, SEND_CLIENT;
module.link("../../../../imports/startup/server/doichain-configuration", {
  CONFIRM_CLIENT(v) {
    CONFIRM_CLIENT = v;
  },

  SEND_CLIENT(v) {
    SEND_CLIENT = v;
  }

}, 2);
Api.addRoute('status', {
  authRequired: false
}, {
  get: {
    action: function () {
      try {
        const data = getInfo(SEND_CLIENT ? SEND_CLIENT : CONFIRM_CLIENT);
        return {
          "status": "success",
          "data": data
        };
      } catch (ex) {
        return {
          "status": "failed",
          "data": ex.toString()
        };
      }
    }
  }
});
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

require('./imports/status.js');
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
    logSend("error while asking dns servers from ", dns.getServers());
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
  getBalance: () => getBalance,
  getInfo: () => getInfo
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

function getInfo(client) {
  const syncFunc = Meteor.wrapAsync(doichain_getinfo);
  return syncFunc(client);
}

function doichain_getinfo(client, callback) {
  client.cmd('getblockchaininfo', function (err, data) {
    if (err) {
      logError('doichain-getinfo:', err);
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
Package['universe:i18n'].i18n.addTranslations('de','',{"components":{"userMenu":{"logout":"Ausloggen","login":"Einloggen","join":"Beitreten","change":"Passwort ändern","entries":{"home":{"name":"Startseite"},"key-generator":{"name":"Key Generator"},"balance":{"name":"Guthaben"},"recipients":{"name":"Empfänger"},"opt-ins":{"name":"Opt-Ins"}}},"keyGenerator":{"privateKey":"Privater Schlüssel","publicKey":"Öffentlicher Schlüssel","generateButton":"Generieren"},"balance":{},"connectionNotification":{"tryingToConnect":"Versuche zu verbinden","connectionIssue":"Es scheint ein Verbindungsproblem zu geben"},"mobileMenu":{"showMenu":"Zeige Menü"},"ImageElement":{"toggle":"Anzeigen"}},"pages":{"startPage":{"title":"doichain","infoText":"Doichain - die Blockchain basierte Anti-Email-Spam Lösung","joinNow":"Jetzt anmelden!"},"keyGeneratorPage":{"title":"Key Generator"},"balancePage":{"title":"Guthaben"},"recipientsPage":{"title":"Empfänger","noRecipients":"Keine Empfänger hier","loading":"Lade Empfänger...","id":"ID","email":"Email","publicKey":"Public Key","createdAt":"Erstellt am"},"optInsPage":{"title":"Opt-Ins","noOptIns":"Keine Opt-Ins hier","loading":"Lade Opt-Ins...","id":"ID","recipient":"Empfänger","sender":"Versender","data":"Daten","screenshot":"Screenshot","nameId":"NameId","createdAt":"Erstellt am","confirmedAt":"Bestätigt am","confirmedBy":"Bestätigt von","txId":"Transaktions-Id","error":"Fehler"},"authPageSignIn":{"emailRequired":"Email benötigt","passwordRequired":"Passwort benötigt","signIn":"Einloggen.","signInReason":"Einloggen erlaubt dir opt-ins hinzuzufügen","yourEmail":"Deine Email","password":"Passwort","signInButton":"Einloggen","needAccount":"Keinen Account? Jetzt beitreten."},"notFoundPage":{"pageNotFound":"Seite nicht gefunden"}},"api":{"opt-ins":{"add":{"accessDenied":"Keine Berechtigung um Opt-Ins hinzuzufügen"}}}});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"en.i18n.json.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// i18n/en.i18n.json.js                                                                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
Package['universe:i18n'].i18n.addTranslations('en','',{"components":{"userMenu":{"logout":"Logout","login":"Login","join":"Sign-up","change":"Change password","entries":{"home":{"name":"Home"},"key-generator":{"name":"Key Generator"},"balance":{"name":"Balance"},"recipients":{"name":"Recipients"},"opt-ins":{"name":"Opt-Ins"}}},"keyGenerator":{"privateKey":"Private key","publicKey":"Public key","generateButton":"Generate"},"balance":{},"connectionNotification":{"tryingToConnect":"Trying to connect","connectionIssue":"There seems to be a connection issue"},"mobileMenu":{"showMenu":"Show Menu"},"ImageElement":{"toggle":"Display"}},"pages":{"startPage":{"title":"doichain","infoText":"This is Doichain - A blockchain based email anti-spam","joinNow":"Join now!"},"keyGeneratorPage":{"title":"Key Generator"},"balancePage":{"title":"Balance"},"recipientsPage":{"title":"Recipients","noRecipients":"No recipients here","loading":"Loading recipients...","id":"ID","email":"Email","publicKey":"Public Key","createdAt":"Created At"},"optInsPage":{"title":"Opt-Ins","noOptIns":"No opt-ins here","loading":"Loading opt-ins...","id":"ID","recipient":"Recipient","sender":"Sender","data":"Data","screenshot":"Screenshot","nameId":"NameId","createdAt":"Created At","confirmedAt":"Confirmed At","confirmedBy":"Confirmed By","txId":"Transaction-Id","error":"Error"},"authPageSignIn":{"emailRequired":"Email required","passwordRequired":"Password required","signIn":"Sign In.","signInReason":"Signing in allows you to add opt-ins","yourEmail":"Your Email","password":"Password","signInButton":"Sign in","needAccount":"Need an account? Join Now."},"notFoundPage":{"pageNotFound":"Page not found"}},"api":{"opt-ins":{"add":{"accessDenied":"Cannot add opt-ins without permissions"}}}});
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9hcGkvb3B0LWlucy9zZXJ2ZXIvcHVibGljYXRpb25zLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL2FwaS9vcHQtaW5zL21ldGhvZHMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvYXBpL29wdC1pbnMvb3B0LWlucy5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9hcGkvcmVjaXBpZW50cy9zZXJ2ZXIvcHVibGljYXRpb25zLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL2FwaS9yZWNpcGllbnRzL3JlY2lwaWVudHMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvYXBpL2RvaWNoYWluL2VudHJpZXMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvYXBpL2RvaWNoYWluL21ldGhvZHMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvYXBpL2xhbmd1YWdlcy9tZXRob2RzLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL2FwaS9tZXRhL21ldGEuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvYXBpL3NlbmRlcnMvc2VuZGVycy5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9kYXBwcy9leHBvcnRfZG9pcy5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9kYXBwcy9mZXRjaF9kb2ktbWFpbC1kYXRhLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2RhcHBzL2dldF9kb2ktbWFpbC1kYXRhLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2Rucy9nZXRfb3B0LWluLWtleS5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9kbnMvZ2V0X29wdC1pbi1wcm92aWRlci5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9kb2ljaGFpbi9hZGRfZW50cnlfYW5kX2ZldGNoX2RhdGEuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvZG9pY2hhaW4vY2hlY2tfbmV3X3RyYW5zYWN0aW9ucy5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9kb2ljaGFpbi9kZWNyeXB0X21lc3NhZ2UuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvZG9pY2hhaW4vZW5jcnlwdF9tZXNzYWdlLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2RvaWNoYWluL2dlbmVyYXRlX25hbWUtaWQuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvZG9pY2hhaW4vZ2V0X2FkZHJlc3MuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvZG9pY2hhaW4vZ2V0X2JhbGFuY2UuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvZG9pY2hhaW4vZ2V0X2RhdGEtaGFzaC5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9kb2ljaGFpbi9nZXRfa2V5LXBhaXIuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvZG9pY2hhaW4vZ2V0X3ByaXZhdGUta2V5X2Zyb21fd2lmLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2RvaWNoYWluL2dldF9wdWJsaWNrZXlfYW5kX2FkZHJlc3NfYnlfZG9tYWluLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2RvaWNoYWluL2dldF9zaWduYXR1cmUuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvZG9pY2hhaW4vaW5zZXJ0LmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2RvaWNoYWluL3VwZGF0ZS5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9kb2ljaGFpbi92ZXJpZnlfc2lnbmF0dXJlLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2RvaWNoYWluL3dyaXRlX3RvX2Jsb2NrY2hhaW4uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvZW1haWxzL2RlY29kZV9kb2ktaGFzaC5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9lbWFpbHMvZ2VuZXJhdGVfZG9pLWhhc2guanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvZW1haWxzL3BhcnNlX3RlbXBsYXRlLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2VtYWlscy9zZW5kLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2pvYnMvYWRkX2NoZWNrX25ld190cmFuc2FjdGlvbnMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvam9icy9hZGRfZmV0Y2gtZG9pLW1haWwtZGF0YS5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9qb2JzL2FkZF9pbnNlcnRfYmxvY2tjaGFpbi5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9qb2JzL2FkZF9zZW5kX21haWwuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvam9icy9hZGRfdXBkYXRlX2Jsb2NrY2hhaW4uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvbGFuZ3VhZ2VzL2dldC5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9tZXRhL2FkZE9yVXBkYXRlLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL21vZHVsZXMvc2VydmVyL29wdC1pbnMvYWRkLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL21vZHVsZXMvc2VydmVyL29wdC1pbnMvYWRkX2FuZF93cml0ZV90b19ibG9ja2NoYWluLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL21vZHVsZXMvc2VydmVyL29wdC1pbnMvY29uZmlybS5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9vcHQtaW5zL2dlbmVyYXRlX2RvaS10b2tlbi5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9vcHQtaW5zL3VwZGF0ZV9zdGF0dXMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvb3B0LWlucy92ZXJpZnkuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvcmVjaXBpZW50cy9hZGQuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvc2VuZGVycy9hZGQuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvc3RhcnR1cC9zZXJ2ZXIvZGFwcC1jb25maWd1cmF0aW9uLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL3N0YXJ0dXAvc2VydmVyL2Rucy1jb25maWd1cmF0aW9uLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL3N0YXJ0dXAvc2VydmVyL2RvaWNoYWluLWNvbmZpZ3VyYXRpb24uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvc3RhcnR1cC9zZXJ2ZXIvZW1haWwtY29uZmlndXJhdGlvbi5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9zdGFydHVwL3NlcnZlci9maXh0dXJlcy5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9zdGFydHVwL3NlcnZlci9pbmRleC5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9zdGFydHVwL3NlcnZlci9qb2JzLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL3N0YXJ0dXAvc2VydmVyL2xvZy1jb25maWd1cmF0aW9uLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL3N0YXJ0dXAvc2VydmVyL3JlZ2lzdGVyLWFwaS5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9zdGFydHVwL3NlcnZlci9zZWN1cml0eS5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9zdGFydHVwL3NlcnZlci90eXBlLWNvbmZpZ3VyYXRpb24uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvc3RhcnR1cC9zZXJ2ZXIvdXNlcmFjY291bnRzLWNvbmZpZ3VyYXRpb24uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9hcGkvcmVzdC9pbXBvcnRzL2NvbmZpcm0uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9hcGkvcmVzdC9pbXBvcnRzL2RlYnVnLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvYXBpL3Jlc3QvaW1wb3J0cy9zZW5kLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvYXBpL3Jlc3QvaW1wb3J0cy9zdGF0dXMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9hcGkvcmVzdC9pbXBvcnRzL3VzZXIuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9hcGkvcmVzdC9pbXBvcnRzL3ZlcmlmeS5qcyIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL2FwaS9yZXN0L3Jlc3QuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9hcGkvYmxvY2tjaGFpbl9qb2JzLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvYXBpL2RhcHBfam9icy5qcyIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL2FwaS9kbnMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9hcGkvZG9pY2hhaW4uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9hcGkvaHR0cC5qcyIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL2FwaS9pbmRleC5qcyIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL2FwaS9tYWlsX2pvYnMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tYWluLmpzIl0sIm5hbWVzIjpbIk1ldGVvciIsIm1vZHVsZSIsImxpbmsiLCJ2IiwiUm9sZXMiLCJPcHRJbnMiLCJwdWJsaXNoIiwiT3B0SW5zQWxsIiwidXNlcklkIiwicmVhZHkiLCJ1c2VySXNJblJvbGUiLCJmaW5kIiwib3duZXJJZCIsImZpZWxkcyIsInB1YmxpY0ZpZWxkcyIsIkREUFJhdGVMaW1pdGVyIiwiaTE4biIsIl9pMThuIiwiVmFsaWRhdGVkTWV0aG9kIiwiXyIsImFkZE9wdEluIiwiZGVmYXVsdCIsImFkZCIsIm5hbWUiLCJ2YWxpZGF0ZSIsInJ1biIsInJlY2lwaWVudE1haWwiLCJzZW5kZXJNYWlsIiwiZGF0YSIsImVycm9yIiwiRXJyb3IiLCJfXyIsIm9wdEluIiwiT1BUSU9OU19NRVRIT0RTIiwicGx1Y2siLCJpc1NlcnZlciIsImFkZFJ1bGUiLCJjb250YWlucyIsImNvbm5lY3Rpb25JZCIsImV4cG9ydCIsIk1vbmdvIiwiU2ltcGxlU2NoZW1hIiwiT3B0SW5zQ29sbGVjdGlvbiIsIkNvbGxlY3Rpb24iLCJpbnNlcnQiLCJjYWxsYmFjayIsIm91ck9wdEluIiwicmVjaXBpZW50X3NlbmRlciIsInJlY2lwaWVudCIsInNlbmRlciIsImNyZWF0ZWRBdCIsIkRhdGUiLCJyZXN1bHQiLCJ1cGRhdGUiLCJzZWxlY3RvciIsIm1vZGlmaWVyIiwicmVtb3ZlIiwiZGVueSIsInNjaGVtYSIsIl9pZCIsInR5cGUiLCJTdHJpbmciLCJyZWdFeCIsIlJlZ0V4IiwiSWQiLCJvcHRpb25hbCIsImRlbnlVcGRhdGUiLCJpbmRleCIsIkludGVnZXIiLCJuYW1lSWQiLCJ0eElkIiwibWFzdGVyRG9pIiwiY29uZmlybWVkQXQiLCJjb25maXJtZWRCeSIsIklQIiwiY29uZmlybWF0aW9uVG9rZW4iLCJhdHRhY2hTY2hlbWEiLCJSZWNpcGllbnRzIiwicmVjaXBpZW50R2V0IiwicGlwZWxpbmUiLCJwdXNoIiwiJHJlZGFjdCIsIiRjb25kIiwiaWYiLCIkY21wIiwidGhlbiIsImVsc2UiLCIkbG9va3VwIiwiZnJvbSIsImxvY2FsRmllbGQiLCJmb3JlaWduRmllbGQiLCJhcyIsIiR1bndpbmQiLCIkcHJvamVjdCIsImFnZ3JlZ2F0ZSIsInJJZHMiLCJmb3JFYWNoIiwiZWxlbWVudCIsIlJlY2lwaWVudEVtYWlsIiwicmVjaXBpZW50c0FsbCIsIlJlY2lwaWVudHNDb2xsZWN0aW9uIiwib3VyUmVjaXBpZW50IiwiZW1haWwiLCJwcml2YXRlS2V5IiwidW5pcXVlIiwicHVibGljS2V5IiwiRG9pY2hhaW5FbnRyaWVzIiwiRG9pY2hhaW5FbnRyaWVzQ29sbGVjdGlvbiIsImVudHJ5IiwidmFsdWUiLCJhZGRyZXNzIiwiZ2V0S2V5UGFpck0iLCJnZXRCYWxhbmNlTSIsImdldEtleVBhaXIiLCJnZXRCYWxhbmNlIiwibG9nVmFsIiwiT1BUSU5TX01FVEhPRFMiLCJnZXRMYW5ndWFnZXMiLCJnZXRBbGxMYW5ndWFnZXMiLCJNZXRhIiwiTWV0YUNvbGxlY3Rpb24iLCJvdXJEYXRhIiwia2V5IiwiU2VuZGVycyIsIlNlbmRlcnNDb2xsZWN0aW9uIiwib3VyU2VuZGVyIiwiRE9JX01BSUxfRkVUQ0hfVVJMIiwibG9nU2VuZCIsIkV4cG9ydERvaXNEYXRhU2NoZW1hIiwic3RhdHVzIiwicm9sZSIsInVzZXJpZCIsImlkIiwiZXhwb3J0RG9pcyIsIiRtYXRjaCIsIiRleGlzdHMiLCIkbmUiLCJ1bmRlZmluZWQiLCJjb25jYXQiLCJvcHRJbnMiLCJleHBvcnREb2lEYXRhIiwiSlNPTiIsInN0cmluZ2lmeSIsImV4Y2VwdGlvbiIsImV4cG9ydERlZmF1bHQiLCJET0lfRkVUQ0hfUk9VVEUiLCJET0lfQ09ORklSTUFUSU9OX1JPVVRFIiwiQVBJX1BBVEgiLCJWRVJTSU9OIiwiZ2V0VXJsIiwiQ09ORklSTV9DTElFTlQiLCJDT05GSVJNX0FERFJFU1MiLCJnZXRIdHRwR0VUIiwic2lnbk1lc3NhZ2UiLCJwYXJzZVRlbXBsYXRlIiwiZ2VuZXJhdGVEb2lUb2tlbiIsImdlbmVyYXRlRG9pSGFzaCIsImFkZFNlbmRNYWlsSm9iIiwibG9nQ29uZmlybSIsImxvZ0Vycm9yIiwiRmV0Y2hEb2lNYWlsRGF0YVNjaGVtYSIsImRvbWFpbiIsImZldGNoRG9pTWFpbERhdGEiLCJ1cmwiLCJzaWduYXR1cmUiLCJxdWVyeSIsImVuY29kZVVSSUNvbXBvbmVudCIsInJlc3BvbnNlIiwicmVzcG9uc2VEYXRhIiwiaW5jbHVkZXMiLCJvcHRJbklkIiwiZmluZE9uZSIsInRva2VuIiwiY29uZmlybWF0aW9uSGFzaCIsInJlZGlyZWN0IiwiY29uZmlybWF0aW9uVXJsIiwidGVtcGxhdGUiLCJjb250ZW50IiwiY29uZmlybWF0aW9uX3VybCIsInRvIiwic3ViamVjdCIsIm1lc3NhZ2UiLCJyZXR1cm5QYXRoIiwiZ2V0T3B0SW5Qcm92aWRlciIsImdldE9wdEluS2V5IiwidmVyaWZ5U2lnbmF0dXJlIiwiQWNjb3VudHMiLCJHZXREb2lNYWlsRGF0YVNjaGVtYSIsIm5hbWVfaWQiLCJ1c2VyUHJvZmlsZVNjaGVtYSIsIkVtYWlsIiwidGVtcGxhdGVVUkwiLCJnZXREb2lNYWlsRGF0YSIsInBhcnRzIiwic3BsaXQiLCJsZW5ndGgiLCJwcm92aWRlciIsImRvaU1haWxEYXRhIiwiZGVmYXVsdFJldHVybkRhdGEiLCJyZXR1cm5EYXRhIiwib3duZXIiLCJ1c2VycyIsIm1haWxUZW1wbGF0ZSIsInByb2ZpbGUiLCJyZXNvbHZlVHh0IiwiRkFMTEJBQ0tfUFJPVklERVIiLCJpc1JlZ3Rlc3QiLCJpc1Rlc3RuZXQiLCJPUFRfSU5fS0VZIiwiT1BUX0lOX0tFWV9URVNUTkVUIiwiR2V0T3B0SW5LZXlTY2hlbWEiLCJvdXJPUFRfSU5fS0VZIiwiZm91bmRLZXkiLCJkbnNrZXkiLCJ1c2VGYWxsYmFjayIsIlBST1ZJREVSX0tFWSIsIlBST1ZJREVSX0tFWV9URVNUTkVUIiwiR2V0T3B0SW5Qcm92aWRlclNjaGVtYSIsIm91clBST1ZJREVSX0tFWSIsInByb3ZpZGVyS2V5IiwiZ2V0V2lmIiwiYWRkRmV0Y2hEb2lNYWlsRGF0YUpvYiIsImdldFByaXZhdGVLZXlGcm9tV2lmIiwiZGVjcnlwdE1lc3NhZ2UiLCJBZGREb2ljaGFpbkVudHJ5U2NoZW1hIiwiYWRkRG9pY2hhaW5FbnRyeSIsIm91ckVudHJ5IiwiZXR5IiwicGFyc2UiLCJ3aWYiLCJuYW1lUG9zIiwiaW5kZXhPZiIsInN1YnN0cmluZyIsImV4cGlyZXNJbiIsImV4cGlyZWQiLCJsaXN0U2luY2VCbG9jayIsIm5hbWVTaG93IiwiZ2V0UmF3VHJhbnNhY3Rpb24iLCJhZGRPclVwZGF0ZU1ldGEiLCJUWF9OQU1FX1NUQVJUIiwiTEFTVF9DSEVDS0VEX0JMT0NLX0tFWSIsImNoZWNrTmV3VHJhbnNhY3Rpb24iLCJ0eGlkIiwiam9iIiwibGFzdENoZWNrZWRCbG9jayIsInJldCIsInRyYW5zYWN0aW9ucyIsInR4cyIsImxhc3RibG9jayIsImFkZHJlc3NUeHMiLCJmaWx0ZXIiLCJ0eCIsInN0YXJ0c1dpdGgiLCJ0eE5hbWUiLCJhZGRUeCIsImRvbmUiLCJ2b3V0Iiwic2NyaXB0UHViS2V5IiwibmFtZU9wIiwib3AiLCJhZGRyZXNzZXMiLCJjcnlwdG8iLCJlY2llcyIsIkRlY3J5cHRNZXNzYWdlU2NoZW1hIiwiQnVmZmVyIiwiZWNkaCIsImNyZWF0ZUVDREgiLCJzZXRQcml2YXRlS2V5IiwiZGVjcnlwdCIsInRvU3RyaW5nIiwiRW5jcnlwdE1lc3NhZ2VTY2hlbWEiLCJlbmNyeXB0TWVzc2FnZSIsImVuY3J5cHQiLCJHZW5lcmF0ZU5hbWVJZFNjaGVtYSIsImdlbmVyYXRlTmFtZUlkIiwiJHNldCIsIkNyeXB0b0pTIiwiQmFzZTU4IiwiVkVSU0lPTl9CWVRFIiwiVkVSU0lPTl9CWVRFX1JFR1RFU1QiLCJHZXRBZGRyZXNzU2NoZW1hIiwiZ2V0QWRkcmVzcyIsIl9nZXRBZGRyZXNzIiwicHViS2V5IiwibGliIiwiV29yZEFycmF5IiwiY3JlYXRlIiwiU0hBMjU2IiwiUklQRU1EMTYwIiwidmVyc2lvbkJ5dGUiLCJjaGVja3N1bSIsImVuY29kZSIsImdldF9CYWxhbmNlIiwiYmFsIiwiR2V0RGF0YUhhc2hTY2hlbWEiLCJnZXREYXRhSGFzaCIsImhhc2giLCJyYW5kb21CeXRlcyIsInNlY3AyNTZrMSIsInByaXZLZXkiLCJwcml2YXRlS2V5VmVyaWZ5IiwicHVibGljS2V5Q3JlYXRlIiwidG9VcHBlckNhc2UiLCJHZXRQcml2YXRlS2V5RnJvbVdpZlNjaGVtYSIsIl9nZXRQcml2YXRlS2V5RnJvbVdpZiIsImRlY29kZSIsImVuZHNXaXRoIiwiR2V0UHVibGljS2V5U2NoZW1hIiwiZ2V0UHVibGljS2V5QW5kQWRkcmVzcyIsImRlc3RBZGRyZXNzIiwiYml0Y29yZSIsIk1lc3NhZ2UiLCJHZXRTaWduYXR1cmVTY2hlbWEiLCJnZXRTaWduYXR1cmUiLCJzaWduIiwiUHJpdmF0ZUtleSIsIlNFTkRfQ0xJRU5UIiwibG9nQmxvY2tjaGFpbiIsImZlZURvaSIsIm5hbWVEb2kiLCJJbnNlcnRTY2hlbWEiLCJkYXRhSGFzaCIsInNvaURhdGUiLCJwdWJsaWNLZXlBbmRBZGRyZXNzIiwibmFtZVZhbHVlIiwiZmVlRG9pVHgiLCJuYW1lRG9pVHgiLCJnZXRUcmFuc2FjdGlvbiIsIkRPSV9DT05GSVJNQVRJT05fTk9USUZZX1JPVVRFIiwiZ2V0SHR0cFBVVCIsIlVwZGF0ZVNjaGVtYSIsImhvc3QiLCJmcm9tSG9zdFVybCIsIm5hbWVfZGF0YSIsInJlcnVuIiwib3VyX3RyYW5zYWN0aW9uIiwiY29uZmlybWF0aW9ucyIsIm91cmZyb21Ib3N0VXJsIiwidXBkYXRlRGF0YSIsImNhbmNlbCIsInJlc3RhcnQiLCJlcnIiLCJsb2dWZXJpZnkiLCJORVRXT1JLIiwiTmV0d29ya3MiLCJhbGlhcyIsInB1YmtleWhhc2giLCJwcml2YXRla2V5Iiwic2NyaXB0aGFzaCIsIm5ldHdvcmtNYWdpYyIsIlZlcmlmeVNpZ25hdHVyZVNjaGVtYSIsIkFkZHJlc3MiLCJmcm9tUHVibGljS2V5IiwiUHVibGljS2V5IiwidmVyaWZ5IiwiYWRkSW5zZXJ0QmxvY2tjaGFpbkpvYiIsIldyaXRlVG9CbG9ja2NoYWluU2NoZW1hIiwid3JpdGVUb0Jsb2NrY2hhaW4iLCJIYXNoSWRzIiwiRGVjb2RlRG9pSGFzaFNjaGVtYSIsImRlY29kZURvaUhhc2giLCJvdXJIYXNoIiwiaGV4IiwiZGVjb2RlSGV4Iiwib2JqIiwiR2VuZXJhdGVEb2lIYXNoU2NoZW1hIiwianNvbiIsImVuY29kZUhleCIsIlBMQUNFSE9MREVSX1JFR0VYIiwiUGFyc2VUZW1wbGF0ZVNjaGVtYSIsIk9iamVjdCIsImJsYWNrYm94IiwiX21hdGNoIiwiZXhlYyIsIl9yZXBsYWNlUGxhY2Vob2xkZXIiLCJyZXBsYWNlIiwicmVwIiwiRE9JX01BSUxfREVGQVVMVF9FTUFJTF9GUk9NIiwiU2VuZE1haWxTY2hlbWEiLCJzZW5kTWFpbCIsIm1haWwiLCJvdXJNYWlsIiwic2VuZCIsImh0bWwiLCJoZWFkZXJzIiwiSm9iIiwiQmxvY2tjaGFpbkpvYnMiLCJhZGRDaGVja05ld1RyYW5zYWN0aW9uc0Jsb2NrY2hhaW5Kb2IiLCJyZXRyeSIsInJldHJpZXMiLCJ3YWl0Iiwic2F2ZSIsImNhbmNlbFJlcGVhdHMiLCJEQXBwSm9icyIsIkFkZEZldGNoRG9pTWFpbERhdGFKb2JTY2hlbWEiLCJBZGRJbnNlcnRCbG9ja2NoYWluSm9iU2NoZW1hIiwiTWFpbEpvYnMiLCJBZGRTZW5kTWFpbEpvYlNjaGVtYSIsIkFkZFVwZGF0ZUJsb2NrY2hhaW5Kb2JTY2hlbWEiLCJhZGRVcGRhdGVCbG9ja2NoYWluSm9iIiwiQWRkT3JVcGRhdGVNZXRhU2NoZW1hIiwibWV0YSIsIkFkZE9wdEluU2NoZW1hIiwiZmV0Y2giLCJhZGRSZWNpcGllbnQiLCJhZGRTZW5kZXIiLCJyZWNpcGllbnRfbWFpbCIsInNlbmRlcl9tYWlsIiwibWFzdGVyX2RvaSIsInJlY2lwaWVudElkIiwic2VuZGVySWQiLCJDb25maXJtT3B0SW5TY2hlbWEiLCJjb25maXJtT3B0SW4iLCJyZXF1ZXN0Iiwib3VyUmVxdWVzdCIsImRlY29kZWQiLCIkdW5zZXQiLCJlbnRyaWVzIiwiJG9yIiwiZG9pU2lnbmF0dXJlIiwiZG9pVGltZXN0YW1wIiwidG9JU09TdHJpbmciLCJqc29uVmFsdWUiLCJHZW5lcmF0ZURvaVRva2VuU2NoZW1hIiwiVXBkYXRlT3B0SW5TdGF0dXNTY2hlbWEiLCJ1cGRhdGVPcHRJblN0YXR1cyIsIlZFUklGWV9DTElFTlQiLCJWZXJpZnlPcHRJblNjaGVtYSIsInJlY2lwaWVudF9wdWJsaWNfa2V5IiwidmVyaWZ5T3B0SW4iLCJlbnRyeURhdGEiLCJmaXJzdENoZWNrIiwic2Vjb25kQ2hlY2siLCJBZGRSZWNpcGllbnRTY2hlbWEiLCJyZWNpcGllbnRzIiwia2V5UGFpciIsIkFkZFNlbmRlclNjaGVtYSIsInNlbmRlcnMiLCJpc0RlYnVnIiwic2V0dGluZ3MiLCJhcHAiLCJkZWJ1ZyIsInJlZ3Rlc3QiLCJ0ZXN0bmV0IiwicG9ydCIsImFic29sdXRlVXJsIiwibmFtZWNvaW4iLCJTRU5EX0FQUCIsIkNPTkZJUk1fQVBQIiwiVkVSSUZZX0FQUCIsImlzQXBwVHlwZSIsInNlbmRTZXR0aW5ncyIsInNlbmRDbGllbnQiLCJkb2ljaGFpbiIsImNyZWF0ZUNsaWVudCIsImNvbmZpcm1TZXR0aW5ncyIsImNvbmZpcm0iLCJjb25maXJtQ2xpZW50IiwiY29uZmlybUFkZHJlc3MiLCJ2ZXJpZnlTZXR0aW5ncyIsInZlcmlmeUNsaWVudCIsIkNsaWVudCIsInVzZXIiLCJ1c2VybmFtZSIsInBhc3MiLCJwYXNzd29yZCIsIkhhc2hpZHMiLCJkb2lNYWlsRmV0Y2hVcmwiLCJkZWZhdWx0RnJvbSIsInNtdHAiLCJzdGFydHVwIiwicHJvY2VzcyIsImVudiIsIk1BSUxfVVJMIiwic2VydmVyIiwiTk9ERV9UTFNfUkVKRUNUX1VOQVVUSE9SSVpFRCIsInZlcnNpb24iLCJBc3NldHMiLCJnZXRUZXh0IiwiY291bnQiLCJjcmVhdGVVc2VyIiwiYWRkVXNlcnNUb1JvbGVzIiwic3RhcnRKb2JTZXJ2ZXIiLCJjb25zb2xlIiwic2VuZE1vZGVUYWdDb2xvciIsImNvbmZpcm1Nb2RlVGFnQ29sb3IiLCJ2ZXJpZnlNb2RlVGFnQ29sb3IiLCJibG9ja2NoYWluTW9kZVRhZ0NvbG9yIiwidGVzdGluZ01vZGVUYWdDb2xvciIsImxvZ01haW4iLCJ0ZXN0TG9nZ2luZyIsInJlcXVpcmUiLCJtc2ciLCJjb2xvcnMiLCJwYXJhbSIsInRpbWUiLCJ0YWciLCJsb2ciLCJBVVRIX01FVEhPRFMiLCJ0eXBlcyIsImNvbmZpZyIsInNlbmRWZXJpZmljYXRpb25FbWFpbCIsImZvcmJpZENsaWVudEFjY291bnRDcmVhdGlvbiIsImVtYWlsVGVtcGxhdGVzIiwiQXBpIiwiRE9JX1dBTExFVE5PVElGWV9ST1VURSIsImFkZFJvdXRlIiwiYXV0aFJlcXVpcmVkIiwiZ2V0IiwiYWN0aW9uIiwidXJsUGFyYW1zIiwiaXAiLCJjb25uZWN0aW9uIiwicmVtb3RlQWRkcmVzcyIsInNvY2tldCIsInN0YXR1c0NvZGUiLCJib2R5IiwicGFyYW1zIiwicXVlcnlQYXJhbXMiLCJET0lfRVhQT1JUX1JPVVRFIiwicG9zdCIsInFQYXJhbXMiLCJiUGFyYW1zIiwiYm9keVBhcmFtcyIsInVpZCIsImNvbnN0cnVjdG9yIiwiQXJyYXkiLCJwcmVwYXJlQ29ET0kiLCJwcmVwYXJlQWRkIiwicHV0IiwidmFsIiwib3duZXJJRCIsImN1cnJlbnRPcHRJbklkIiwicmV0UmVzcG9uc2UiLCJyZXRfcmVzcG9uc2UiLCJnZXRJbmZvIiwiZXgiLCJtYWlsVGVtcGxhdGVTY2hlbWEiLCJjcmVhdGVVc2VyU2NoZW1hIiwidXBkYXRlVXNlclNjaGVtYSIsImNvbGxlY3Rpb25PcHRpb25zIiwicGF0aCIsInJvdXRlT3B0aW9ucyIsImV4Y2x1ZGVkRW5kcG9pbnRzIiwiZW5kcG9pbnRzIiwiZGVsZXRlIiwicm9sZVJlcXVpcmVkIiwicGFyYW1JZCIsImFkZENvbGxlY3Rpb24iLCJSZXN0aXZ1cyIsImFwaVBhdGgiLCJ1c2VEZWZhdWx0QXV0aCIsInByZXR0eUpzb24iLCJKb2JDb2xsZWN0aW9uIiwicHJvY2Vzc0pvYnMiLCJ3b3JrVGltZW91dCIsImNiIiwiZmFpbCIsInBhdXNlIiwicmVwZWF0Iiwic2NoZWR1bGUiLCJsYXRlciIsInRleHQiLCJxIiwicG9sbEludGVydmFsIiwiY3VycmVudCIsInNldE1pbnV0ZXMiLCJnZXRNaW51dGVzIiwiaWRzIiwiJGluIiwiam9iU3RhdHVzUmVtb3ZhYmxlIiwidXBkYXRlZCIsIiRsdCIsInJlbW92ZUpvYnMiLCJvYnNlcnZlIiwiYWRkZWQiLCJ0cmlnZ2VyIiwiZG5zIiwic3luY0Z1bmMiLCJ3cmFwQXN5bmMiLCJkbnNfcmVzb2x2ZVR4dCIsInJlY29yZHMiLCJyZWNvcmQiLCJ0cmltIiwiZ2V0U2VydmVycyIsImdldEFkZHJlc3Nlc0J5QWNjb3VudCIsImdldE5ld0FkZHJlc3MiLCJOQU1FU1BBQ0UiLCJjbGllbnQiLCJkb2ljaGFpbl9kdW1wcHJpdmtleSIsIm91ckFkZHJlc3MiLCJjbWQiLCJhY2NvdXQiLCJkb2ljaGFpbl9nZXRhZGRyZXNzZXNieWFjY291bnQiLCJhY2NvdW50Iiwib3VyQWNjb3VudCIsImRvaWNoYWluX2dldG5ld2FkZHJlc3MiLCJkb2ljaGFpbl9zaWduTWVzc2FnZSIsIm91ck1lc3NhZ2UiLCJkb2ljaGFpbl9uYW1lU2hvdyIsIm91cklkIiwiY2hlY2tJZCIsImRvaWNoYWluX2ZlZURvaSIsImRvaWNoYWluX25hbWVEb2kiLCJvdXJOYW1lIiwib3VyVmFsdWUiLCJibG9jayIsImRvaWNoYWluX2xpc3RTaW5jZUJsb2NrIiwib3VyQmxvY2siLCJkb2ljaGFpbl9nZXR0cmFuc2FjdGlvbiIsImRvaWNoYWluX2dldHJhd3RyYW5zYWN0aW9uIiwiZG9pY2hhaW5fZ2V0YmFsYW5jZSIsImRvaWNoYWluX2dldGluZm8iLCJET0lfUFJFRklYIiwicmV0X3ZhbCIsImdldEh0dHBHRVRkYXRhIiwiZ2V0SHR0cFBPU1QiLCJIVFRQIiwiX2dldCIsIl9nZXREYXRhIiwiX3Bvc3QiLCJfcHV0Iiwib3VyVXJsIiwib3VyUXVlcnkiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUEsSUFBSUEsTUFBSjtBQUFXQyxNQUFNLENBQUNDLElBQVAsQ0FBWSxlQUFaLEVBQTRCO0FBQUNGLFFBQU0sQ0FBQ0csQ0FBRCxFQUFHO0FBQUNILFVBQU0sR0FBQ0csQ0FBUDtBQUFTOztBQUFwQixDQUE1QixFQUFrRCxDQUFsRDtBQUFxRCxJQUFJQyxLQUFKO0FBQVVILE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLHVCQUFaLEVBQW9DO0FBQUNFLE9BQUssQ0FBQ0QsQ0FBRCxFQUFHO0FBQUNDLFNBQUssR0FBQ0QsQ0FBTjtBQUFROztBQUFsQixDQUFwQyxFQUF3RCxDQUF4RDtBQUEyRCxJQUFJRSxNQUFKO0FBQVdKLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGVBQVosRUFBNEI7QUFBQ0csUUFBTSxDQUFDRixDQUFELEVBQUc7QUFBQ0UsVUFBTSxHQUFDRixDQUFQO0FBQVM7O0FBQXBCLENBQTVCLEVBQWtELENBQWxEO0FBS2hKSCxNQUFNLENBQUNNLE9BQVAsQ0FBZSxhQUFmLEVBQThCLFNBQVNDLFNBQVQsR0FBcUI7QUFDakQsTUFBRyxDQUFDLEtBQUtDLE1BQVQsRUFBaUI7QUFDZixXQUFPLEtBQUtDLEtBQUwsRUFBUDtBQUNEOztBQUNELE1BQUcsQ0FBQ0wsS0FBSyxDQUFDTSxZQUFOLENBQW1CLEtBQUtGLE1BQXhCLEVBQWdDLENBQUMsT0FBRCxDQUFoQyxDQUFKLEVBQStDO0FBQzdDLFdBQU9ILE1BQU0sQ0FBQ00sSUFBUCxDQUFZO0FBQUNDLGFBQU8sRUFBQyxLQUFLSjtBQUFkLEtBQVosRUFBbUM7QUFDeENLLFlBQU0sRUFBRVIsTUFBTSxDQUFDUztBQUR5QixLQUFuQyxDQUFQO0FBR0Q7O0FBR0QsU0FBT1QsTUFBTSxDQUFDTSxJQUFQLENBQVksRUFBWixFQUFnQjtBQUNyQkUsVUFBTSxFQUFFUixNQUFNLENBQUNTO0FBRE0sR0FBaEIsQ0FBUDtBQUdELENBZEQsRTs7Ozs7Ozs7Ozs7QUNMQSxJQUFJZCxNQUFKO0FBQVdDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGVBQVosRUFBNEI7QUFBQ0YsUUFBTSxDQUFDRyxDQUFELEVBQUc7QUFBQ0gsVUFBTSxHQUFDRyxDQUFQO0FBQVM7O0FBQXBCLENBQTVCLEVBQWtELENBQWxEO0FBQXFELElBQUlZLGNBQUo7QUFBbUJkLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLHlCQUFaLEVBQXNDO0FBQUNhLGdCQUFjLENBQUNaLENBQUQsRUFBRztBQUFDWSxrQkFBYyxHQUFDWixDQUFmO0FBQWlCOztBQUFwQyxDQUF0QyxFQUE0RSxDQUE1RTtBQUErRSxJQUFJYSxJQUFKO0FBQVNmLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLHNCQUFaLEVBQW1DO0FBQUNlLE9BQUssQ0FBQ2QsQ0FBRCxFQUFHO0FBQUNhLFFBQUksR0FBQ2IsQ0FBTDtBQUFPOztBQUFqQixDQUFuQyxFQUFzRCxDQUF0RDtBQUF5RCxJQUFJZSxlQUFKO0FBQW9CakIsTUFBTSxDQUFDQyxJQUFQLENBQVksNkJBQVosRUFBMEM7QUFBQ2dCLGlCQUFlLENBQUNmLENBQUQsRUFBRztBQUFDZSxtQkFBZSxHQUFDZixDQUFoQjtBQUFrQjs7QUFBdEMsQ0FBMUMsRUFBa0YsQ0FBbEY7QUFBcUYsSUFBSUMsS0FBSjtBQUFVSCxNQUFNLENBQUNDLElBQVAsQ0FBWSx1QkFBWixFQUFvQztBQUFDRSxPQUFLLENBQUNELENBQUQsRUFBRztBQUFDQyxTQUFLLEdBQUNELENBQU47QUFBUTs7QUFBbEIsQ0FBcEMsRUFBd0QsQ0FBeEQ7O0FBQTJELElBQUlnQixDQUFKOztBQUFNbEIsTUFBTSxDQUFDQyxJQUFQLENBQVksbUJBQVosRUFBZ0M7QUFBQ2lCLEdBQUMsQ0FBQ2hCLENBQUQsRUFBRztBQUFDZ0IsS0FBQyxHQUFDaEIsQ0FBRjtBQUFJOztBQUFWLENBQWhDLEVBQTRDLENBQTVDO0FBQStDLElBQUlpQixRQUFKO0FBQWFuQixNQUFNLENBQUNDLElBQVAsQ0FBWSw2REFBWixFQUEwRTtBQUFDbUIsU0FBTyxDQUFDbEIsQ0FBRCxFQUFHO0FBQUNpQixZQUFRLEdBQUNqQixDQUFUO0FBQVc7O0FBQXZCLENBQTFFLEVBQW1HLENBQW5HO0FBUXBkLE1BQU1tQixHQUFHLEdBQUcsSUFBSUosZUFBSixDQUFvQjtBQUM5QkssTUFBSSxFQUFFLGFBRHdCO0FBRTlCQyxVQUFRLEVBQUUsSUFGb0I7O0FBRzlCQyxLQUFHLENBQUM7QUFBRUMsaUJBQUY7QUFBaUJDLGNBQWpCO0FBQTZCQztBQUE3QixHQUFELEVBQXNDO0FBQ3ZDLFFBQUcsQ0FBQyxLQUFLcEIsTUFBTixJQUFnQixDQUFDSixLQUFLLENBQUNNLFlBQU4sQ0FBbUIsS0FBS0YsTUFBeEIsRUFBZ0MsQ0FBQyxPQUFELENBQWhDLENBQXBCLEVBQWdFO0FBQzlELFlBQU1xQixLQUFLLEdBQUcsOEJBQWQ7QUFDQSxZQUFNLElBQUk3QixNQUFNLENBQUM4QixLQUFYLENBQWlCRCxLQUFqQixFQUF3QmIsSUFBSSxDQUFDZSxFQUFMLENBQVFGLEtBQVIsQ0FBeEIsQ0FBTjtBQUNEOztBQUVELFVBQU1HLEtBQUssR0FBRztBQUNaLHdCQUFrQk4sYUFETjtBQUVaLHFCQUFlQyxVQUZIO0FBR1pDO0FBSFksS0FBZDtBQU1BUixZQUFRLENBQUNZLEtBQUQsQ0FBUjtBQUNEOztBQWhCNkIsQ0FBcEIsQ0FBWixDLENBbUJBOztBQUNBLE1BQU1DLGVBQWUsR0FBR2QsQ0FBQyxDQUFDZSxLQUFGLENBQVEsQ0FDOUJaLEdBRDhCLENBQVIsRUFFckIsTUFGcUIsQ0FBeEI7O0FBSUEsSUFBSXRCLE1BQU0sQ0FBQ21DLFFBQVgsRUFBcUI7QUFDbkI7QUFDQXBCLGdCQUFjLENBQUNxQixPQUFmLENBQXVCO0FBQ3JCYixRQUFJLENBQUNBLElBQUQsRUFBTztBQUNULGFBQU9KLENBQUMsQ0FBQ2tCLFFBQUYsQ0FBV0osZUFBWCxFQUE0QlYsSUFBNUIsQ0FBUDtBQUNELEtBSG9COztBQUtyQjtBQUNBZSxnQkFBWSxHQUFHO0FBQUUsYUFBTyxJQUFQO0FBQWM7O0FBTlYsR0FBdkIsRUFPRyxDQVBILEVBT00sSUFQTjtBQVFELEM7Ozs7Ozs7Ozs7O0FDMUNEckMsTUFBTSxDQUFDc0MsTUFBUCxDQUFjO0FBQUNsQyxRQUFNLEVBQUMsTUFBSUE7QUFBWixDQUFkO0FBQW1DLElBQUltQyxLQUFKO0FBQVV2QyxNQUFNLENBQUNDLElBQVAsQ0FBWSxjQUFaLEVBQTJCO0FBQUNzQyxPQUFLLENBQUNyQyxDQUFELEVBQUc7QUFBQ3FDLFNBQUssR0FBQ3JDLENBQU47QUFBUTs7QUFBbEIsQ0FBM0IsRUFBK0MsQ0FBL0M7QUFBa0QsSUFBSXNDLFlBQUo7QUFBaUJ4QyxNQUFNLENBQUNDLElBQVAsQ0FBWSxjQUFaLEVBQTJCO0FBQUNtQixTQUFPLENBQUNsQixDQUFELEVBQUc7QUFBQ3NDLGdCQUFZLEdBQUN0QyxDQUFiO0FBQWU7O0FBQTNCLENBQTNCLEVBQXdELENBQXhEOztBQUdoSCxNQUFNdUMsZ0JBQU4sU0FBK0JGLEtBQUssQ0FBQ0csVUFBckMsQ0FBZ0Q7QUFDOUNDLFFBQU0sQ0FBQ1osS0FBRCxFQUFRYSxRQUFSLEVBQWtCO0FBQ3RCLFVBQU1DLFFBQVEsR0FBR2QsS0FBakI7QUFDQWMsWUFBUSxDQUFDQyxnQkFBVCxHQUE0QkQsUUFBUSxDQUFDRSxTQUFULEdBQW1CRixRQUFRLENBQUNHLE1BQXhEO0FBQ0FILFlBQVEsQ0FBQ0ksU0FBVCxHQUFxQkosUUFBUSxDQUFDSSxTQUFULElBQXNCLElBQUlDLElBQUosRUFBM0M7QUFDQSxVQUFNQyxNQUFNLEdBQUcsTUFBTVIsTUFBTixDQUFhRSxRQUFiLEVBQXVCRCxRQUF2QixDQUFmO0FBQ0EsV0FBT08sTUFBUDtBQUNEOztBQUNEQyxRQUFNLENBQUNDLFFBQUQsRUFBV0MsUUFBWCxFQUFxQjtBQUN6QixVQUFNSCxNQUFNLEdBQUcsTUFBTUMsTUFBTixDQUFhQyxRQUFiLEVBQXVCQyxRQUF2QixDQUFmO0FBQ0EsV0FBT0gsTUFBUDtBQUNEOztBQUNESSxRQUFNLENBQUNGLFFBQUQsRUFBVztBQUNmLFVBQU1GLE1BQU0sR0FBRyxNQUFNSSxNQUFOLENBQWFGLFFBQWIsQ0FBZjtBQUNBLFdBQU9GLE1BQVA7QUFDRDs7QUFmNkM7O0FBa0J6QyxNQUFNL0MsTUFBTSxHQUFHLElBQUlxQyxnQkFBSixDQUFxQixTQUFyQixDQUFmO0FBRVA7QUFDQXJDLE1BQU0sQ0FBQ29ELElBQVAsQ0FBWTtBQUNWYixRQUFNLEdBQUc7QUFBRSxXQUFPLElBQVA7QUFBYyxHQURmOztBQUVWUyxRQUFNLEdBQUc7QUFBRSxXQUFPLElBQVA7QUFBYyxHQUZmOztBQUdWRyxRQUFNLEdBQUc7QUFBRSxXQUFPLElBQVA7QUFBYzs7QUFIZixDQUFaO0FBTUFuRCxNQUFNLENBQUNxRCxNQUFQLEdBQWdCLElBQUlqQixZQUFKLENBQWlCO0FBQy9Ca0IsS0FBRyxFQUFFO0FBQ0hDLFFBQUksRUFBRUMsTUFESDtBQUVIQyxTQUFLLEVBQUVyQixZQUFZLENBQUNzQixLQUFiLENBQW1CQztBQUZ2QixHQUQwQjtBQUsvQmhCLFdBQVMsRUFBRTtBQUNUWSxRQUFJLEVBQUVDLE1BREc7QUFFVEksWUFBUSxFQUFFLElBRkQ7QUFHVEMsY0FBVSxFQUFFO0FBSEgsR0FMb0I7QUFVL0JqQixRQUFNLEVBQUU7QUFDTlcsUUFBSSxFQUFFQyxNQURBO0FBRU5JLFlBQVEsRUFBRSxJQUZKO0FBR05DLGNBQVUsRUFBRTtBQUhOLEdBVnVCO0FBZS9CdEMsTUFBSSxFQUFFO0FBQ0pnQyxRQUFJLEVBQUVDLE1BREY7QUFFSkksWUFBUSxFQUFFLElBRk47QUFHSkMsY0FBVSxFQUFFO0FBSFIsR0FmeUI7QUFvQi9CQyxPQUFLLEVBQUU7QUFDTFAsUUFBSSxFQUFFbkIsWUFBWSxDQUFDMkIsT0FEZDtBQUVMSCxZQUFRLEVBQUUsSUFGTDtBQUdMQyxjQUFVLEVBQUU7QUFIUCxHQXBCd0I7QUF5Qi9CRyxRQUFNLEVBQUU7QUFDTlQsUUFBSSxFQUFFQyxNQURBO0FBRU5JLFlBQVEsRUFBRSxJQUZKO0FBR05DLGNBQVUsRUFBRTtBQUhOLEdBekJ1QjtBQThCL0JJLE1BQUksRUFBRTtBQUNGVixRQUFJLEVBQUVDLE1BREo7QUFFRkksWUFBUSxFQUFFLElBRlI7QUFHRkMsY0FBVSxFQUFFO0FBSFYsR0E5QnlCO0FBbUMvQkssV0FBUyxFQUFFO0FBQ1BYLFFBQUksRUFBRUMsTUFEQztBQUVQSSxZQUFRLEVBQUUsSUFGSDtBQUdQQyxjQUFVLEVBQUU7QUFITCxHQW5Db0I7QUF3Qy9CaEIsV0FBUyxFQUFFO0FBQ1RVLFFBQUksRUFBRVQsSUFERztBQUVUZSxjQUFVLEVBQUU7QUFGSCxHQXhDb0I7QUE0Qy9CTSxhQUFXLEVBQUU7QUFDWFosUUFBSSxFQUFFVCxJQURLO0FBRVhjLFlBQVEsRUFBRSxJQUZDO0FBR1hDLGNBQVUsRUFBRTtBQUhELEdBNUNrQjtBQWlEL0JPLGFBQVcsRUFBRTtBQUNYYixRQUFJLEVBQUVDLE1BREs7QUFFWEMsU0FBSyxFQUFFckIsWUFBWSxDQUFDc0IsS0FBYixDQUFtQlcsRUFGZjtBQUdYVCxZQUFRLEVBQUUsSUFIQztBQUlYQyxjQUFVLEVBQUU7QUFKRCxHQWpEa0I7QUF1RC9CUyxtQkFBaUIsRUFBRTtBQUNqQmYsUUFBSSxFQUFFQyxNQURXO0FBRWpCSSxZQUFRLEVBQUUsSUFGTztBQUdqQkMsY0FBVSxFQUFFO0FBSEssR0F2RFk7QUE0RC9CdEQsU0FBTyxFQUFDO0FBQ05nRCxRQUFJLEVBQUVDLE1BREE7QUFFTkksWUFBUSxFQUFFLElBRko7QUFHTkgsU0FBSyxFQUFFckIsWUFBWSxDQUFDc0IsS0FBYixDQUFtQkM7QUFIcEIsR0E1RHVCO0FBaUUvQm5DLE9BQUssRUFBQztBQUNGK0IsUUFBSSxFQUFFQyxNQURKO0FBRUZJLFlBQVEsRUFBRSxJQUZSO0FBR0ZDLGNBQVUsRUFBRTtBQUhWO0FBakV5QixDQUFqQixDQUFoQjtBQXdFQTdELE1BQU0sQ0FBQ3VFLFlBQVAsQ0FBb0J2RSxNQUFNLENBQUNxRCxNQUEzQixFLENBRUE7QUFDQTtBQUNBOztBQUNBckQsTUFBTSxDQUFDUyxZQUFQLEdBQXNCO0FBQ3BCNkMsS0FBRyxFQUFFLENBRGU7QUFFcEJYLFdBQVMsRUFBRSxDQUZTO0FBR3BCQyxRQUFNLEVBQUUsQ0FIWTtBQUlwQnJCLE1BQUksRUFBRSxDQUpjO0FBS3BCdUMsT0FBSyxFQUFFLENBTGE7QUFNcEJFLFFBQU0sRUFBRSxDQU5ZO0FBT3BCQyxNQUFJLEVBQUUsQ0FQYztBQVFwQkMsV0FBUyxFQUFFLENBUlM7QUFTcEJyQixXQUFTLEVBQUUsQ0FUUztBQVVwQnNCLGFBQVcsRUFBRSxDQVZPO0FBV3BCQyxhQUFXLEVBQUUsQ0FYTztBQVlwQjdELFNBQU8sRUFBRSxDQVpXO0FBYXBCaUIsT0FBSyxFQUFFO0FBYmEsQ0FBdEIsQzs7Ozs7Ozs7Ozs7QUMzR0EsSUFBSTdCLE1BQUo7QUFBV0MsTUFBTSxDQUFDQyxJQUFQLENBQVksZUFBWixFQUE0QjtBQUFDRixRQUFNLENBQUNHLENBQUQsRUFBRztBQUFDSCxVQUFNLEdBQUNHLENBQVA7QUFBUzs7QUFBcEIsQ0FBNUIsRUFBa0QsQ0FBbEQ7QUFBcUQsSUFBSUMsS0FBSjtBQUFVSCxNQUFNLENBQUNDLElBQVAsQ0FBWSx1QkFBWixFQUFvQztBQUFDRSxPQUFLLENBQUNELENBQUQsRUFBRztBQUFDQyxTQUFLLEdBQUNELENBQU47QUFBUTs7QUFBbEIsQ0FBcEMsRUFBd0QsQ0FBeEQ7QUFBMkQsSUFBSTBFLFVBQUo7QUFBZTVFLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGtCQUFaLEVBQStCO0FBQUMyRSxZQUFVLENBQUMxRSxDQUFELEVBQUc7QUFBQzBFLGNBQVUsR0FBQzFFLENBQVg7QUFBYTs7QUFBNUIsQ0FBL0IsRUFBNkQsQ0FBN0Q7QUFBZ0UsSUFBSUUsTUFBSjtBQUFXSixNQUFNLENBQUNDLElBQVAsQ0FBWSwwQkFBWixFQUF1QztBQUFDRyxRQUFNLENBQUNGLENBQUQsRUFBRztBQUFDRSxVQUFNLEdBQUNGLENBQVA7QUFBUzs7QUFBcEIsQ0FBdkMsRUFBNkQsQ0FBN0Q7QUFLL05ILE1BQU0sQ0FBQ00sT0FBUCxDQUFlLG9CQUFmLEVBQW9DLFNBQVN3RSxZQUFULEdBQXVCO0FBQ3pELE1BQUlDLFFBQVEsR0FBQyxFQUFiOztBQUNBLE1BQUcsQ0FBQzNFLEtBQUssQ0FBQ00sWUFBTixDQUFtQixLQUFLRixNQUF4QixFQUFnQyxDQUFDLE9BQUQsQ0FBaEMsQ0FBSixFQUErQztBQUM3Q3VFLFlBQVEsQ0FBQ0MsSUFBVCxDQUNFO0FBQUNDLGFBQU8sRUFBQztBQUNUQyxhQUFLLEVBQUU7QUFDTEMsWUFBRSxFQUFFO0FBQUVDLGdCQUFJLEVBQUUsQ0FBRSxVQUFGLEVBQWMsS0FBSzVFLE1BQW5CO0FBQVIsV0FEQztBQUVMNkUsY0FBSSxFQUFFLFNBRkQ7QUFHTEMsY0FBSSxFQUFFO0FBSEQ7QUFERTtBQUFULEtBREY7QUFNRzs7QUFDRFAsVUFBUSxDQUFDQyxJQUFULENBQWM7QUFBRU8sV0FBTyxFQUFFO0FBQUVDLFVBQUksRUFBRSxZQUFSO0FBQXNCQyxnQkFBVSxFQUFFLFdBQWxDO0FBQStDQyxrQkFBWSxFQUFFLEtBQTdEO0FBQW9FQyxRQUFFLEVBQUU7QUFBeEU7QUFBWCxHQUFkO0FBQ0FaLFVBQVEsQ0FBQ0MsSUFBVCxDQUFjO0FBQUVZLFdBQU8sRUFBRTtBQUFYLEdBQWQ7QUFDQWIsVUFBUSxDQUFDQyxJQUFULENBQWM7QUFBRWEsWUFBUSxFQUFFO0FBQUMsNEJBQXFCO0FBQXRCO0FBQVosR0FBZDtBQUVBLFFBQU16QyxNQUFNLEdBQUcvQyxNQUFNLENBQUN5RixTQUFQLENBQWlCZixRQUFqQixDQUFmO0FBQ0EsTUFBSWdCLElBQUksR0FBQyxFQUFUO0FBQ0EzQyxRQUFNLENBQUM0QyxPQUFQLENBQWVDLE9BQU8sSUFBSTtBQUN4QkYsUUFBSSxDQUFDZixJQUFMLENBQVVpQixPQUFPLENBQUNDLGNBQVIsQ0FBdUJ2QyxHQUFqQztBQUNELEdBRkQ7QUFHSixTQUFPa0IsVUFBVSxDQUFDbEUsSUFBWCxDQUFnQjtBQUFDLFdBQU07QUFBQyxhQUFNb0Y7QUFBUDtBQUFQLEdBQWhCLEVBQXFDO0FBQUNsRixVQUFNLEVBQUNnRSxVQUFVLENBQUMvRDtBQUFuQixHQUFyQyxDQUFQO0FBQ0QsQ0FwQkQ7QUFxQkFkLE1BQU0sQ0FBQ00sT0FBUCxDQUFlLGdCQUFmLEVBQWlDLFNBQVM2RixhQUFULEdBQXlCO0FBQ3hELE1BQUcsQ0FBQyxLQUFLM0YsTUFBTixJQUFnQixDQUFDSixLQUFLLENBQUNNLFlBQU4sQ0FBbUIsS0FBS0YsTUFBeEIsRUFBZ0MsQ0FBQyxPQUFELENBQWhDLENBQXBCLEVBQWdFO0FBQzlELFdBQU8sS0FBS0MsS0FBTCxFQUFQO0FBQ0Q7O0FBRUQsU0FBT29FLFVBQVUsQ0FBQ2xFLElBQVgsQ0FBZ0IsRUFBaEIsRUFBb0I7QUFDekJFLFVBQU0sRUFBRWdFLFVBQVUsQ0FBQy9EO0FBRE0sR0FBcEIsQ0FBUDtBQUdELENBUkQsRTs7Ozs7Ozs7Ozs7QUMxQkFiLE1BQU0sQ0FBQ3NDLE1BQVAsQ0FBYztBQUFDc0MsWUFBVSxFQUFDLE1BQUlBO0FBQWhCLENBQWQ7QUFBMkMsSUFBSXJDLEtBQUo7QUFBVXZDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGNBQVosRUFBMkI7QUFBQ3NDLE9BQUssQ0FBQ3JDLENBQUQsRUFBRztBQUFDcUMsU0FBSyxHQUFDckMsQ0FBTjtBQUFROztBQUFsQixDQUEzQixFQUErQyxDQUEvQztBQUFrRCxJQUFJc0MsWUFBSjtBQUFpQnhDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGNBQVosRUFBMkI7QUFBQ21CLFNBQU8sQ0FBQ2xCLENBQUQsRUFBRztBQUFDc0MsZ0JBQVksR0FBQ3RDLENBQWI7QUFBZTs7QUFBM0IsQ0FBM0IsRUFBd0QsQ0FBeEQ7O0FBR3hILE1BQU1pRyxvQkFBTixTQUFtQzVELEtBQUssQ0FBQ0csVUFBekMsQ0FBb0Q7QUFDbERDLFFBQU0sQ0FBQ0ksU0FBRCxFQUFZSCxRQUFaLEVBQXNCO0FBQzFCLFVBQU13RCxZQUFZLEdBQUdyRCxTQUFyQjtBQUNBcUQsZ0JBQVksQ0FBQ25ELFNBQWIsR0FBeUJtRCxZQUFZLENBQUNuRCxTQUFiLElBQTBCLElBQUlDLElBQUosRUFBbkQ7QUFDQSxVQUFNQyxNQUFNLEdBQUcsTUFBTVIsTUFBTixDQUFheUQsWUFBYixFQUEyQnhELFFBQTNCLENBQWY7QUFDQSxXQUFPTyxNQUFQO0FBQ0Q7O0FBQ0RDLFFBQU0sQ0FBQ0MsUUFBRCxFQUFXQyxRQUFYLEVBQXFCO0FBQ3pCLFVBQU1ILE1BQU0sR0FBRyxNQUFNQyxNQUFOLENBQWFDLFFBQWIsRUFBdUJDLFFBQXZCLENBQWY7QUFDQSxXQUFPSCxNQUFQO0FBQ0Q7O0FBQ0RJLFFBQU0sQ0FBQ0YsUUFBRCxFQUFXO0FBQ2YsVUFBTUYsTUFBTSxHQUFHLE1BQU1JLE1BQU4sQ0FBYUYsUUFBYixDQUFmO0FBQ0EsV0FBT0YsTUFBUDtBQUNEOztBQWRpRDs7QUFpQjdDLE1BQU15QixVQUFVLEdBQUcsSUFBSXVCLG9CQUFKLENBQXlCLFlBQXpCLENBQW5CO0FBRVA7QUFDQXZCLFVBQVUsQ0FBQ3BCLElBQVgsQ0FBZ0I7QUFDZGIsUUFBTSxHQUFHO0FBQUUsV0FBTyxJQUFQO0FBQWMsR0FEWDs7QUFFZFMsUUFBTSxHQUFHO0FBQUUsV0FBTyxJQUFQO0FBQWMsR0FGWDs7QUFHZEcsUUFBTSxHQUFHO0FBQUUsV0FBTyxJQUFQO0FBQWM7O0FBSFgsQ0FBaEI7QUFNQXFCLFVBQVUsQ0FBQ25CLE1BQVgsR0FBb0IsSUFBSWpCLFlBQUosQ0FBaUI7QUFDbkNrQixLQUFHLEVBQUU7QUFDSEMsUUFBSSxFQUFFQyxNQURIO0FBRUhDLFNBQUssRUFBRXJCLFlBQVksQ0FBQ3NCLEtBQWIsQ0FBbUJDO0FBRnZCLEdBRDhCO0FBS25Dc0MsT0FBSyxFQUFFO0FBQ0wxQyxRQUFJLEVBQUVDLE1BREQ7QUFFTE0sU0FBSyxFQUFFLElBRkY7QUFHTEQsY0FBVSxFQUFFO0FBSFAsR0FMNEI7QUFVbkNxQyxZQUFVLEVBQUU7QUFDVjNDLFFBQUksRUFBRUMsTUFESTtBQUVWMkMsVUFBTSxFQUFFLElBRkU7QUFHVnRDLGNBQVUsRUFBRTtBQUhGLEdBVnVCO0FBZW5DdUMsV0FBUyxFQUFFO0FBQ1Q3QyxRQUFJLEVBQUVDLE1BREc7QUFFVDJDLFVBQU0sRUFBRSxJQUZDO0FBR1R0QyxjQUFVLEVBQUU7QUFISCxHQWZ3QjtBQW9CbkNoQixXQUFTLEVBQUU7QUFDVFUsUUFBSSxFQUFFVCxJQURHO0FBRVRlLGNBQVUsRUFBRTtBQUZIO0FBcEJ3QixDQUFqQixDQUFwQjtBQTBCQVcsVUFBVSxDQUFDRCxZQUFYLENBQXdCQyxVQUFVLENBQUNuQixNQUFuQyxFLENBRUE7QUFDQTtBQUNBOztBQUNBbUIsVUFBVSxDQUFDL0QsWUFBWCxHQUEwQjtBQUN4QjZDLEtBQUcsRUFBRSxDQURtQjtBQUV4QjJDLE9BQUssRUFBRSxDQUZpQjtBQUd4QkcsV0FBUyxFQUFFLENBSGE7QUFJeEJ2RCxXQUFTLEVBQUU7QUFKYSxDQUExQixDOzs7Ozs7Ozs7OztBQzVEQWpELE1BQU0sQ0FBQ3NDLE1BQVAsQ0FBYztBQUFDbUUsaUJBQWUsRUFBQyxNQUFJQTtBQUFyQixDQUFkO0FBQXFELElBQUlsRSxLQUFKO0FBQVV2QyxNQUFNLENBQUNDLElBQVAsQ0FBWSxjQUFaLEVBQTJCO0FBQUNzQyxPQUFLLENBQUNyQyxDQUFELEVBQUc7QUFBQ3FDLFNBQUssR0FBQ3JDLENBQU47QUFBUTs7QUFBbEIsQ0FBM0IsRUFBK0MsQ0FBL0M7QUFBa0QsSUFBSXNDLFlBQUo7QUFBaUJ4QyxNQUFNLENBQUNDLElBQVAsQ0FBWSxjQUFaLEVBQTJCO0FBQUNtQixTQUFPLENBQUNsQixDQUFELEVBQUc7QUFBQ3NDLGdCQUFZLEdBQUN0QyxDQUFiO0FBQWU7O0FBQTNCLENBQTNCLEVBQXdELENBQXhEOztBQUdsSSxNQUFNd0cseUJBQU4sU0FBd0NuRSxLQUFLLENBQUNHLFVBQTlDLENBQXlEO0FBQ3ZEQyxRQUFNLENBQUNnRSxLQUFELEVBQVEvRCxRQUFSLEVBQWtCO0FBQ3RCLFVBQU1PLE1BQU0sR0FBRyxNQUFNUixNQUFOLENBQWFnRSxLQUFiLEVBQW9CL0QsUUFBcEIsQ0FBZjtBQUNBLFdBQU9PLE1BQVA7QUFDRDs7QUFDREMsUUFBTSxDQUFDQyxRQUFELEVBQVdDLFFBQVgsRUFBcUI7QUFDekIsVUFBTUgsTUFBTSxHQUFHLE1BQU1DLE1BQU4sQ0FBYUMsUUFBYixFQUF1QkMsUUFBdkIsQ0FBZjtBQUNBLFdBQU9ILE1BQVA7QUFDRDs7QUFDREksUUFBTSxDQUFDRixRQUFELEVBQVc7QUFDZixVQUFNRixNQUFNLEdBQUcsTUFBTUksTUFBTixDQUFhRixRQUFiLENBQWY7QUFDQSxXQUFPRixNQUFQO0FBQ0Q7O0FBWnNEOztBQWVsRCxNQUFNc0QsZUFBZSxHQUFHLElBQUlDLHlCQUFKLENBQThCLGtCQUE5QixDQUF4QjtBQUVQO0FBQ0FELGVBQWUsQ0FBQ2pELElBQWhCLENBQXFCO0FBQ25CYixRQUFNLEdBQUc7QUFBRSxXQUFPLElBQVA7QUFBYyxHQUROOztBQUVuQlMsUUFBTSxHQUFHO0FBQUUsV0FBTyxJQUFQO0FBQWMsR0FGTjs7QUFHbkJHLFFBQU0sR0FBRztBQUFFLFdBQU8sSUFBUDtBQUFjOztBQUhOLENBQXJCO0FBTUFrRCxlQUFlLENBQUNoRCxNQUFoQixHQUF5QixJQUFJakIsWUFBSixDQUFpQjtBQUN4Q2tCLEtBQUcsRUFBRTtBQUNIQyxRQUFJLEVBQUVDLE1BREg7QUFFSEMsU0FBSyxFQUFFckIsWUFBWSxDQUFDc0IsS0FBYixDQUFtQkM7QUFGdkIsR0FEbUM7QUFLeEN6QyxNQUFJLEVBQUU7QUFDSnFDLFFBQUksRUFBRUMsTUFERjtBQUVKTSxTQUFLLEVBQUUsSUFGSDtBQUdKRCxjQUFVLEVBQUU7QUFIUixHQUxrQztBQVV4QzJDLE9BQUssRUFBRTtBQUNMakQsUUFBSSxFQUFFQyxNQUREO0FBRUxLLGNBQVUsRUFBRTtBQUZQLEdBVmlDO0FBY3hDNEMsU0FBTyxFQUFFO0FBQ1BsRCxRQUFJLEVBQUVDLE1BREM7QUFFUEssY0FBVSxFQUFFO0FBRkwsR0FkK0I7QUFrQnhDSyxXQUFTLEVBQUU7QUFDTFgsUUFBSSxFQUFFQyxNQUREO0FBRUxJLFlBQVEsRUFBRSxJQUZMO0FBR0xFLFNBQUssRUFBRSxJQUhGO0FBSUxELGNBQVUsRUFBRTtBQUpQLEdBbEI2QjtBQXdCeENDLE9BQUssRUFBRTtBQUNEUCxRQUFJLEVBQUVuQixZQUFZLENBQUMyQixPQURsQjtBQUVESCxZQUFRLEVBQUUsSUFGVDtBQUdEQyxjQUFVLEVBQUU7QUFIWCxHQXhCaUM7QUE2QnhDSSxNQUFJLEVBQUU7QUFDSlYsUUFBSSxFQUFFQyxNQURGO0FBRUpLLGNBQVUsRUFBRTtBQUZSO0FBN0JrQyxDQUFqQixDQUF6QjtBQW1DQXdDLGVBQWUsQ0FBQzlCLFlBQWhCLENBQTZCOEIsZUFBZSxDQUFDaEQsTUFBN0MsRSxDQUVBO0FBQ0E7QUFDQTs7QUFDQWdELGVBQWUsQ0FBQzVGLFlBQWhCLEdBQStCO0FBQzdCNkMsS0FBRyxFQUFFLENBRHdCO0FBRTdCcEMsTUFBSSxFQUFFLENBRnVCO0FBRzdCc0YsT0FBSyxFQUFFLENBSHNCO0FBSTdCQyxTQUFPLEVBQUUsQ0FKb0I7QUFLN0J2QyxXQUFTLEVBQUUsQ0FMa0I7QUFNN0JKLE9BQUssRUFBRSxDQU5zQjtBQU83QkcsTUFBSSxFQUFFO0FBUHVCLENBQS9CLEM7Ozs7Ozs7Ozs7O0FDbkVBLElBQUlwRCxlQUFKO0FBQW9CakIsTUFBTSxDQUFDQyxJQUFQLENBQVksNkJBQVosRUFBMEM7QUFBQ2dCLGlCQUFlLENBQUNmLENBQUQsRUFBRztBQUFDZSxtQkFBZSxHQUFDZixDQUFoQjtBQUFrQjs7QUFBdEMsQ0FBMUMsRUFBa0YsQ0FBbEY7QUFBcUYsSUFBSUgsTUFBSjtBQUFXQyxNQUFNLENBQUNDLElBQVAsQ0FBWSxlQUFaLEVBQTRCO0FBQUNGLFFBQU0sQ0FBQ0csQ0FBRCxFQUFHO0FBQUNILFVBQU0sR0FBQ0csQ0FBUDtBQUFTOztBQUFwQixDQUE1QixFQUFrRCxDQUFsRDtBQUFxRCxJQUFJWSxjQUFKO0FBQW1CZCxNQUFNLENBQUNDLElBQVAsQ0FBWSx5QkFBWixFQUFzQztBQUFDYSxnQkFBYyxDQUFDWixDQUFELEVBQUc7QUFBQ1ksa0JBQWMsR0FBQ1osQ0FBZjtBQUFpQjs7QUFBcEMsQ0FBdEMsRUFBNEUsQ0FBNUU7QUFBK0UsSUFBSTRHLFdBQUo7QUFBZ0I5RyxNQUFNLENBQUNDLElBQVAsQ0FBWSwrQ0FBWixFQUE0RDtBQUFDbUIsU0FBTyxDQUFDbEIsQ0FBRCxFQUFHO0FBQUM0RyxlQUFXLEdBQUM1RyxDQUFaO0FBQWM7O0FBQTFCLENBQTVELEVBQXdGLENBQXhGO0FBQTJGLElBQUk2RyxXQUFKO0FBQWdCL0csTUFBTSxDQUFDQyxJQUFQLENBQVksOENBQVosRUFBMkQ7QUFBQ21CLFNBQU8sQ0FBQ2xCLENBQUQsRUFBRztBQUFDNkcsZUFBVyxHQUFDN0csQ0FBWjtBQUFjOztBQUExQixDQUEzRCxFQUF1RixDQUF2RjtBQU90WSxNQUFNOEcsVUFBVSxHQUFHLElBQUkvRixlQUFKLENBQW9CO0FBQ3JDSyxNQUFJLEVBQUUscUJBRCtCO0FBRXJDQyxVQUFRLEVBQUUsSUFGMkI7O0FBR3JDQyxLQUFHLEdBQUc7QUFDSixXQUFPc0YsV0FBVyxFQUFsQjtBQUNEOztBQUxvQyxDQUFwQixDQUFuQjtBQVFBLE1BQU1HLFVBQVUsR0FBRyxJQUFJaEcsZUFBSixDQUFvQjtBQUNyQ0ssTUFBSSxFQUFFLHFCQUQrQjtBQUVyQ0MsVUFBUSxFQUFFLElBRjJCOztBQUdyQ0MsS0FBRyxHQUFHO0FBQ0osVUFBTTBGLE1BQU0sR0FBR0gsV0FBVyxFQUExQjtBQUNBLFdBQU9HLE1BQVA7QUFDRDs7QUFOb0MsQ0FBcEIsQ0FBbkIsQyxDQVVBOztBQUNBLE1BQU1DLGNBQWMsR0FBR2pHLENBQUMsQ0FBQ2UsS0FBRixDQUFRLENBQzdCK0UsVUFENkIsRUFFOUJDLFVBRjhCLENBQVIsRUFFVCxNQUZTLENBQXZCOztBQUlBLElBQUlsSCxNQUFNLENBQUNtQyxRQUFYLEVBQXFCO0FBQ25CO0FBQ0FwQixnQkFBYyxDQUFDcUIsT0FBZixDQUF1QjtBQUNyQmIsUUFBSSxDQUFDQSxJQUFELEVBQU87QUFDVCxhQUFPSixDQUFDLENBQUNrQixRQUFGLENBQVcrRSxjQUFYLEVBQTJCN0YsSUFBM0IsQ0FBUDtBQUNELEtBSG9COztBQUtyQjtBQUNBZSxnQkFBWSxHQUFHO0FBQUUsYUFBTyxJQUFQO0FBQWM7O0FBTlYsR0FBdkIsRUFPRyxDQVBILEVBT00sSUFQTjtBQVFELEM7Ozs7Ozs7Ozs7O0FDeENELElBQUl0QyxNQUFKO0FBQVdDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGVBQVosRUFBNEI7QUFBQ0YsUUFBTSxDQUFDRyxDQUFELEVBQUc7QUFBQ0gsVUFBTSxHQUFDRyxDQUFQO0FBQVM7O0FBQXBCLENBQTVCLEVBQWtELENBQWxEO0FBQXFELElBQUlZLGNBQUo7QUFBbUJkLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLHlCQUFaLEVBQXNDO0FBQUNhLGdCQUFjLENBQUNaLENBQUQsRUFBRztBQUFDWSxrQkFBYyxHQUFDWixDQUFmO0FBQWlCOztBQUFwQyxDQUF0QyxFQUE0RSxDQUE1RTtBQUErRSxJQUFJZSxlQUFKO0FBQW9CakIsTUFBTSxDQUFDQyxJQUFQLENBQVksNkJBQVosRUFBMEM7QUFBQ2dCLGlCQUFlLENBQUNmLENBQUQsRUFBRztBQUFDZSxtQkFBZSxHQUFDZixDQUFoQjtBQUFrQjs7QUFBdEMsQ0FBMUMsRUFBa0YsQ0FBbEY7QUFBcUYsSUFBSWtILFlBQUo7QUFBaUJwSCxNQUFNLENBQUNDLElBQVAsQ0FBWSx1Q0FBWixFQUFvRDtBQUFDbUIsU0FBTyxDQUFDbEIsQ0FBRCxFQUFHO0FBQUNrSCxnQkFBWSxHQUFDbEgsQ0FBYjtBQUFlOztBQUEzQixDQUFwRCxFQUFpRixDQUFqRjtBQUs1UixNQUFNbUgsZUFBZSxHQUFHLElBQUlwRyxlQUFKLENBQW9CO0FBQzFDSyxNQUFJLEVBQUUsa0JBRG9DO0FBRTFDQyxVQUFRLEVBQUUsSUFGZ0M7O0FBRzFDQyxLQUFHLEdBQUc7QUFDSixXQUFPNEYsWUFBWSxFQUFuQjtBQUNEOztBQUx5QyxDQUFwQixDQUF4QixDLENBUUE7O0FBQ0EsTUFBTUQsY0FBYyxHQUFHakcsQ0FBQyxDQUFDZSxLQUFGLENBQVEsQ0FDN0JvRixlQUQ2QixDQUFSLEVBRXBCLE1BRm9CLENBQXZCOztBQUlBLElBQUl0SCxNQUFNLENBQUNtQyxRQUFYLEVBQXFCO0FBQ25CO0FBQ0FwQixnQkFBYyxDQUFDcUIsT0FBZixDQUF1QjtBQUNyQmIsUUFBSSxDQUFDQSxJQUFELEVBQU87QUFDVCxhQUFPSixDQUFDLENBQUNrQixRQUFGLENBQVcrRSxjQUFYLEVBQTJCN0YsSUFBM0IsQ0FBUDtBQUNELEtBSG9COztBQUtyQjtBQUNBZSxnQkFBWSxHQUFHO0FBQUUsYUFBTyxJQUFQO0FBQWM7O0FBTlYsR0FBdkIsRUFPRyxDQVBILEVBT00sSUFQTjtBQVFELEM7Ozs7Ozs7Ozs7O0FDNUJEckMsTUFBTSxDQUFDc0MsTUFBUCxDQUFjO0FBQUNnRixNQUFJLEVBQUMsTUFBSUE7QUFBVixDQUFkO0FBQStCLElBQUkvRSxLQUFKO0FBQVV2QyxNQUFNLENBQUNDLElBQVAsQ0FBWSxjQUFaLEVBQTJCO0FBQUNzQyxPQUFLLENBQUNyQyxDQUFELEVBQUc7QUFBQ3FDLFNBQUssR0FBQ3JDLENBQU47QUFBUTs7QUFBbEIsQ0FBM0IsRUFBK0MsQ0FBL0M7QUFBa0QsSUFBSXNDLFlBQUo7QUFBaUJ4QyxNQUFNLENBQUNDLElBQVAsQ0FBWSxjQUFaLEVBQTJCO0FBQUNtQixTQUFPLENBQUNsQixDQUFELEVBQUc7QUFBQ3NDLGdCQUFZLEdBQUN0QyxDQUFiO0FBQWU7O0FBQTNCLENBQTNCLEVBQXdELENBQXhEOztBQUc1RyxNQUFNcUgsY0FBTixTQUE2QmhGLEtBQUssQ0FBQ0csVUFBbkMsQ0FBOEM7QUFDNUNDLFFBQU0sQ0FBQ2hCLElBQUQsRUFBT2lCLFFBQVAsRUFBaUI7QUFDckIsVUFBTTRFLE9BQU8sR0FBRzdGLElBQWhCO0FBQ0EsVUFBTXdCLE1BQU0sR0FBRyxNQUFNUixNQUFOLENBQWE2RSxPQUFiLEVBQXNCNUUsUUFBdEIsQ0FBZjtBQUNBLFdBQU9PLE1BQVA7QUFDRDs7QUFDREMsUUFBTSxDQUFDQyxRQUFELEVBQVdDLFFBQVgsRUFBcUI7QUFDekIsVUFBTUgsTUFBTSxHQUFHLE1BQU1DLE1BQU4sQ0FBYUMsUUFBYixFQUF1QkMsUUFBdkIsQ0FBZjtBQUNBLFdBQU9ILE1BQVA7QUFDRDs7QUFDREksUUFBTSxDQUFDRixRQUFELEVBQVc7QUFDZixVQUFNRixNQUFNLEdBQUcsTUFBTUksTUFBTixDQUFhRixRQUFiLENBQWY7QUFDQSxXQUFPRixNQUFQO0FBQ0Q7O0FBYjJDOztBQWdCdkMsTUFBTW1FLElBQUksR0FBRyxJQUFJQyxjQUFKLENBQW1CLE1BQW5CLENBQWI7QUFFUDtBQUNBRCxJQUFJLENBQUM5RCxJQUFMLENBQVU7QUFDUmIsUUFBTSxHQUFHO0FBQUUsV0FBTyxJQUFQO0FBQWMsR0FEakI7O0FBRVJTLFFBQU0sR0FBRztBQUFFLFdBQU8sSUFBUDtBQUFjLEdBRmpCOztBQUdSRyxRQUFNLEdBQUc7QUFBRSxXQUFPLElBQVA7QUFBYzs7QUFIakIsQ0FBVjtBQU1BK0QsSUFBSSxDQUFDN0QsTUFBTCxHQUFjLElBQUlqQixZQUFKLENBQWlCO0FBQzdCa0IsS0FBRyxFQUFFO0FBQ0hDLFFBQUksRUFBRUMsTUFESDtBQUVIQyxTQUFLLEVBQUVyQixZQUFZLENBQUNzQixLQUFiLENBQW1CQztBQUZ2QixHQUR3QjtBQUs3QjBELEtBQUcsRUFBRTtBQUNIOUQsUUFBSSxFQUFFQyxNQURIO0FBRUhNLFNBQUssRUFBRSxJQUZKO0FBR0hELGNBQVUsRUFBRTtBQUhULEdBTHdCO0FBVTdCMkMsT0FBSyxFQUFFO0FBQ0xqRCxRQUFJLEVBQUVDO0FBREQ7QUFWc0IsQ0FBakIsQ0FBZDtBQWVBMEQsSUFBSSxDQUFDM0MsWUFBTCxDQUFrQjJDLElBQUksQ0FBQzdELE1BQXZCLEUsQ0FFQTtBQUNBO0FBQ0E7O0FBQ0E2RCxJQUFJLENBQUN6RyxZQUFMLEdBQW9CLEVBQXBCLEM7Ozs7Ozs7Ozs7O0FDaERBYixNQUFNLENBQUNzQyxNQUFQLENBQWM7QUFBQ29GLFNBQU8sRUFBQyxNQUFJQTtBQUFiLENBQWQ7QUFBcUMsSUFBSW5GLEtBQUo7QUFBVXZDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGNBQVosRUFBMkI7QUFBQ3NDLE9BQUssQ0FBQ3JDLENBQUQsRUFBRztBQUFDcUMsU0FBSyxHQUFDckMsQ0FBTjtBQUFROztBQUFsQixDQUEzQixFQUErQyxDQUEvQztBQUFrRCxJQUFJc0MsWUFBSjtBQUFpQnhDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGNBQVosRUFBMkI7QUFBQ21CLFNBQU8sQ0FBQ2xCLENBQUQsRUFBRztBQUFDc0MsZ0JBQVksR0FBQ3RDLENBQWI7QUFBZTs7QUFBM0IsQ0FBM0IsRUFBd0QsQ0FBeEQ7O0FBR2xILE1BQU15SCxpQkFBTixTQUFnQ3BGLEtBQUssQ0FBQ0csVUFBdEMsQ0FBaUQ7QUFDL0NDLFFBQU0sQ0FBQ0ssTUFBRCxFQUFTSixRQUFULEVBQW1CO0FBQ3ZCLFVBQU1nRixTQUFTLEdBQUc1RSxNQUFsQjtBQUNBNEUsYUFBUyxDQUFDM0UsU0FBVixHQUFzQjJFLFNBQVMsQ0FBQzNFLFNBQVYsSUFBdUIsSUFBSUMsSUFBSixFQUE3QztBQUNBLFVBQU1DLE1BQU0sR0FBRyxNQUFNUixNQUFOLENBQWFpRixTQUFiLEVBQXdCaEYsUUFBeEIsQ0FBZjtBQUNBLFdBQU9PLE1BQVA7QUFDRDs7QUFDREMsUUFBTSxDQUFDQyxRQUFELEVBQVdDLFFBQVgsRUFBcUI7QUFDekIsVUFBTUgsTUFBTSxHQUFHLE1BQU1DLE1BQU4sQ0FBYUMsUUFBYixFQUF1QkMsUUFBdkIsQ0FBZjtBQUNBLFdBQU9ILE1BQVA7QUFDRDs7QUFDREksUUFBTSxDQUFDRixRQUFELEVBQVc7QUFDZixVQUFNRixNQUFNLEdBQUcsTUFBTUksTUFBTixDQUFhRixRQUFiLENBQWY7QUFDQSxXQUFPRixNQUFQO0FBQ0Q7O0FBZDhDOztBQWlCMUMsTUFBTXVFLE9BQU8sR0FBRyxJQUFJQyxpQkFBSixDQUFzQixTQUF0QixDQUFoQjtBQUVQO0FBQ0FELE9BQU8sQ0FBQ2xFLElBQVIsQ0FBYTtBQUNYYixRQUFNLEdBQUc7QUFBRSxXQUFPLElBQVA7QUFBYyxHQURkOztBQUVYUyxRQUFNLEdBQUc7QUFBRSxXQUFPLElBQVA7QUFBYyxHQUZkOztBQUdYRyxRQUFNLEdBQUc7QUFBRSxXQUFPLElBQVA7QUFBYzs7QUFIZCxDQUFiO0FBTUFtRSxPQUFPLENBQUNqRSxNQUFSLEdBQWlCLElBQUlqQixZQUFKLENBQWlCO0FBQ2hDa0IsS0FBRyxFQUFFO0FBQ0hDLFFBQUksRUFBRUMsTUFESDtBQUVIQyxTQUFLLEVBQUVyQixZQUFZLENBQUNzQixLQUFiLENBQW1CQztBQUZ2QixHQUQyQjtBQUtoQ3NDLE9BQUssRUFBRTtBQUNMMUMsUUFBSSxFQUFFQyxNQUREO0FBRUxNLFNBQUssRUFBRSxJQUZGO0FBR0xELGNBQVUsRUFBRTtBQUhQLEdBTHlCO0FBVWhDaEIsV0FBUyxFQUFFO0FBQ1RVLFFBQUksRUFBRVQsSUFERztBQUVUZSxjQUFVLEVBQUU7QUFGSDtBQVZxQixDQUFqQixDQUFqQjtBQWdCQXlELE9BQU8sQ0FBQy9DLFlBQVIsQ0FBcUIrQyxPQUFPLENBQUNqRSxNQUE3QixFLENBRUE7QUFDQTtBQUNBOztBQUNBaUUsT0FBTyxDQUFDN0csWUFBUixHQUF1QjtBQUNyQndGLE9BQUssRUFBRSxDQURjO0FBRXJCcEQsV0FBUyxFQUFFO0FBRlUsQ0FBdkIsQzs7Ozs7Ozs7Ozs7QUNsREEsSUFBSWxELE1BQUo7QUFBV0MsTUFBTSxDQUFDQyxJQUFQLENBQVksZUFBWixFQUE0QjtBQUFDRixRQUFNLENBQUNHLENBQUQsRUFBRztBQUFDSCxVQUFNLEdBQUNHLENBQVA7QUFBUzs7QUFBcEIsQ0FBNUIsRUFBa0QsQ0FBbEQ7QUFBcUQsSUFBSXNDLFlBQUo7QUFBaUJ4QyxNQUFNLENBQUNDLElBQVAsQ0FBWSxjQUFaLEVBQTJCO0FBQUNtQixTQUFPLENBQUNsQixDQUFELEVBQUc7QUFBQ3NDLGdCQUFZLEdBQUN0QyxDQUFiO0FBQWU7O0FBQTNCLENBQTNCLEVBQXdELENBQXhEO0FBQTJELElBQUkySCxrQkFBSjtBQUF1QjdILE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGdEQUFaLEVBQTZEO0FBQUM0SCxvQkFBa0IsQ0FBQzNILENBQUQsRUFBRztBQUFDMkgsc0JBQWtCLEdBQUMzSCxDQUFuQjtBQUFxQjs7QUFBNUMsQ0FBN0QsRUFBMkcsQ0FBM0c7QUFBOEcsSUFBSTRILE9BQUo7QUFBWTlILE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLDJDQUFaLEVBQXdEO0FBQUM2SCxTQUFPLENBQUM1SCxDQUFELEVBQUc7QUFBQzRILFdBQU8sR0FBQzVILENBQVI7QUFBVTs7QUFBdEIsQ0FBeEQsRUFBZ0YsQ0FBaEY7QUFBbUYsSUFBSUUsTUFBSjtBQUFXSixNQUFNLENBQUNDLElBQVAsQ0FBWSw4QkFBWixFQUEyQztBQUFDRyxRQUFNLENBQUNGLENBQUQsRUFBRztBQUFDRSxVQUFNLEdBQUNGLENBQVA7QUFBUzs7QUFBcEIsQ0FBM0MsRUFBaUUsQ0FBakU7QUFNM1gsTUFBTTZILG9CQUFvQixHQUFHLElBQUl2RixZQUFKLENBQWlCO0FBQzVDd0YsUUFBTSxFQUFFO0FBQ05yRSxRQUFJLEVBQUVDLE1BREE7QUFFTkksWUFBUSxFQUFFO0FBRkosR0FEb0M7QUFLNUNpRSxNQUFJLEVBQUM7QUFDSHRFLFFBQUksRUFBQ0M7QUFERixHQUx1QztBQVE1Q3NFLFFBQU0sRUFBQztBQUNMdkUsUUFBSSxFQUFFQyxNQUREO0FBRUxDLFNBQUssRUFBRXJCLFlBQVksQ0FBQ3NCLEtBQWIsQ0FBbUJxRSxFQUZyQjtBQUdMbkUsWUFBUSxFQUFDO0FBSEo7QUFScUMsQ0FBakIsQ0FBN0IsQyxDQWVBOztBQUVBLE1BQU1vRSxVQUFVLEdBQUl6RyxJQUFELElBQVU7QUFDM0IsTUFBSTtBQUNGLFVBQU02RixPQUFPLEdBQUc3RixJQUFoQjtBQUNBb0csd0JBQW9CLENBQUN4RyxRQUFyQixDQUE4QmlHLE9BQTlCO0FBQ0EsUUFBSTFDLFFBQVEsR0FBQyxDQUFDO0FBQUV1RCxZQUFNLEVBQUU7QUFBQyx1QkFBYztBQUFFQyxpQkFBTyxFQUFFLElBQVg7QUFBaUJDLGFBQUcsRUFBRTtBQUF0QjtBQUFmO0FBQVYsS0FBRCxDQUFiOztBQUVBLFFBQUdmLE9BQU8sQ0FBQ1MsSUFBUixJQUFjLE9BQWQsSUFBdUJULE9BQU8sQ0FBQ1UsTUFBUixJQUFnQk0sU0FBMUMsRUFBb0Q7QUFDbEQxRCxjQUFRLENBQUNDLElBQVQsQ0FBYztBQUFFQyxlQUFPLEVBQUM7QUFDdEJDLGVBQUssRUFBRTtBQUNMQyxjQUFFLEVBQUU7QUFBRUMsa0JBQUksRUFBRSxDQUFFLFVBQUYsRUFBY3FDLE9BQU8sQ0FBQ1UsTUFBdEI7QUFBUixhQURDO0FBRUw5QyxnQkFBSSxFQUFFLFNBRkQ7QUFHTEMsZ0JBQUksRUFBRTtBQUhEO0FBRGU7QUFBVixPQUFkO0FBS0Q7O0FBQ0RQLFlBQVEsQ0FBQzJELE1BQVQsQ0FBZ0IsQ0FDWjtBQUFFbkQsYUFBTyxFQUFFO0FBQUVDLFlBQUksRUFBRSxZQUFSO0FBQXNCQyxrQkFBVSxFQUFFLFdBQWxDO0FBQStDQyxvQkFBWSxFQUFFLEtBQTdEO0FBQW9FQyxVQUFFLEVBQUU7QUFBeEU7QUFBWCxLQURZLEVBRVo7QUFBRUosYUFBTyxFQUFFO0FBQUVDLFlBQUksRUFBRSxTQUFSO0FBQW1CQyxrQkFBVSxFQUFFLFFBQS9CO0FBQXlDQyxvQkFBWSxFQUFFLEtBQXZEO0FBQThEQyxVQUFFLEVBQUU7QUFBbEU7QUFBWCxLQUZZLEVBR1o7QUFBRUMsYUFBTyxFQUFFO0FBQVgsS0FIWSxFQUlaO0FBQUVBLGFBQU8sRUFBRTtBQUFYLEtBSlksRUFLWjtBQUFFQyxjQUFRLEVBQUU7QUFBQyxlQUFNLENBQVA7QUFBUyxxQkFBWSxDQUFyQjtBQUF3Qix1QkFBYyxDQUF0QztBQUF3QyxrQkFBUyxDQUFqRDtBQUFvRCw2QkFBb0IsQ0FBeEU7QUFBMEUsZ0NBQXVCO0FBQWpHO0FBQVosS0FMWSxDQUFoQixFQVpFLENBbUJGOztBQUVBLFFBQUk4QyxNQUFNLEdBQUl0SSxNQUFNLENBQUN5RixTQUFQLENBQWlCZixRQUFqQixDQUFkO0FBQ0EsUUFBSTZELGFBQUo7O0FBQ0EsUUFBSTtBQUNBQSxtQkFBYSxHQUFHRCxNQUFoQjtBQUNBWixhQUFPLENBQUMsZ0JBQUQsRUFBa0JELGtCQUFsQixFQUFxQ2UsSUFBSSxDQUFDQyxTQUFMLENBQWVGLGFBQWYsQ0FBckMsQ0FBUDtBQUNGLGFBQU9BLGFBQVA7QUFFRCxLQUxELENBS0UsT0FBTS9HLEtBQU4sRUFBYTtBQUNiLFlBQU0saUNBQStCQSxLQUFyQztBQUNEO0FBRUYsR0FoQ0QsQ0FnQ0UsT0FBT2tILFNBQVAsRUFBa0I7QUFDbEIsVUFBTSxJQUFJL0ksTUFBTSxDQUFDOEIsS0FBWCxDQUFpQiwyQkFBakIsRUFBOENpSCxTQUE5QyxDQUFOO0FBQ0Q7QUFDRixDQXBDRDs7QUF2QkE5SSxNQUFNLENBQUMrSSxhQUFQLENBNkRlWCxVQTdEZixFOzs7Ozs7Ozs7OztBQ0FBLElBQUlySSxNQUFKO0FBQVdDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGVBQVosRUFBNEI7QUFBQ0YsUUFBTSxDQUFDRyxDQUFELEVBQUc7QUFBQ0gsVUFBTSxHQUFDRyxDQUFQO0FBQVM7O0FBQXBCLENBQTVCLEVBQWtELENBQWxEO0FBQXFELElBQUlzQyxZQUFKO0FBQWlCeEMsTUFBTSxDQUFDQyxJQUFQLENBQVksY0FBWixFQUEyQjtBQUFDbUIsU0FBTyxDQUFDbEIsQ0FBRCxFQUFHO0FBQUNzQyxnQkFBWSxHQUFDdEMsQ0FBYjtBQUFlOztBQUEzQixDQUEzQixFQUF3RCxDQUF4RDtBQUEyRCxJQUFJOEksZUFBSixFQUFvQkMsc0JBQXBCLEVBQTJDQyxRQUEzQyxFQUFvREMsT0FBcEQ7QUFBNERuSixNQUFNLENBQUNDLElBQVAsQ0FBWSxxQ0FBWixFQUFrRDtBQUFDK0ksaUJBQWUsQ0FBQzlJLENBQUQsRUFBRztBQUFDOEksbUJBQWUsR0FBQzlJLENBQWhCO0FBQWtCLEdBQXRDOztBQUF1QytJLHdCQUFzQixDQUFDL0ksQ0FBRCxFQUFHO0FBQUMrSSwwQkFBc0IsR0FBQy9JLENBQXZCO0FBQXlCLEdBQTFGOztBQUEyRmdKLFVBQVEsQ0FBQ2hKLENBQUQsRUFBRztBQUFDZ0osWUFBUSxHQUFDaEosQ0FBVDtBQUFXLEdBQWxIOztBQUFtSGlKLFNBQU8sQ0FBQ2pKLENBQUQsRUFBRztBQUFDaUosV0FBTyxHQUFDakosQ0FBUjtBQUFVOztBQUF4SSxDQUFsRCxFQUE0TCxDQUE1TDtBQUErTCxJQUFJa0osTUFBSjtBQUFXcEosTUFBTSxDQUFDQyxJQUFQLENBQVksK0NBQVosRUFBNEQ7QUFBQ21KLFFBQU0sQ0FBQ2xKLENBQUQsRUFBRztBQUFDa0osVUFBTSxHQUFDbEosQ0FBUDtBQUFTOztBQUFwQixDQUE1RCxFQUFrRixDQUFsRjtBQUFxRixJQUFJbUosY0FBSixFQUFtQkMsZUFBbkI7QUFBbUN0SixNQUFNLENBQUNDLElBQVAsQ0FBWSxtREFBWixFQUFnRTtBQUFDb0osZ0JBQWMsQ0FBQ25KLENBQUQsRUFBRztBQUFDbUosa0JBQWMsR0FBQ25KLENBQWY7QUFBaUIsR0FBcEM7O0FBQXFDb0osaUJBQWUsQ0FBQ3BKLENBQUQsRUFBRztBQUFDb0osbUJBQWUsR0FBQ3BKLENBQWhCO0FBQWtCOztBQUExRSxDQUFoRSxFQUE0SSxDQUE1STtBQUErSSxJQUFJcUosVUFBSjtBQUFldkosTUFBTSxDQUFDQyxJQUFQLENBQVksZ0NBQVosRUFBNkM7QUFBQ3NKLFlBQVUsQ0FBQ3JKLENBQUQsRUFBRztBQUFDcUosY0FBVSxHQUFDckosQ0FBWDtBQUFhOztBQUE1QixDQUE3QyxFQUEyRSxDQUEzRTtBQUE4RSxJQUFJc0osV0FBSjtBQUFnQnhKLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLG9DQUFaLEVBQWlEO0FBQUN1SixhQUFXLENBQUN0SixDQUFELEVBQUc7QUFBQ3NKLGVBQVcsR0FBQ3RKLENBQVo7QUFBYzs7QUFBOUIsQ0FBakQsRUFBaUYsQ0FBakY7QUFBb0YsSUFBSUUsTUFBSjtBQUFXSixNQUFNLENBQUNDLElBQVAsQ0FBWSw0Q0FBWixFQUF5RDtBQUFDRyxRQUFNLENBQUNGLENBQUQsRUFBRztBQUFDRSxVQUFNLEdBQUNGLENBQVA7QUFBUzs7QUFBcEIsQ0FBekQsRUFBK0UsQ0FBL0U7QUFBa0YsSUFBSXVKLGFBQUo7QUFBa0J6SixNQUFNLENBQUNDLElBQVAsQ0FBWSw2QkFBWixFQUEwQztBQUFDbUIsU0FBTyxDQUFDbEIsQ0FBRCxFQUFHO0FBQUN1SixpQkFBYSxHQUFDdkosQ0FBZDtBQUFnQjs7QUFBNUIsQ0FBMUMsRUFBd0UsQ0FBeEU7QUFBMkUsSUFBSXdKLGdCQUFKO0FBQXFCMUosTUFBTSxDQUFDQyxJQUFQLENBQVksa0NBQVosRUFBK0M7QUFBQ21CLFNBQU8sQ0FBQ2xCLENBQUQsRUFBRztBQUFDd0osb0JBQWdCLEdBQUN4SixDQUFqQjtBQUFtQjs7QUFBL0IsQ0FBL0MsRUFBZ0YsQ0FBaEY7QUFBbUYsSUFBSXlKLGVBQUo7QUFBb0IzSixNQUFNLENBQUNDLElBQVAsQ0FBWSxnQ0FBWixFQUE2QztBQUFDbUIsU0FBTyxDQUFDbEIsQ0FBRCxFQUFHO0FBQUN5SixtQkFBZSxHQUFDekosQ0FBaEI7QUFBa0I7O0FBQTlCLENBQTdDLEVBQTZFLEVBQTdFO0FBQWlGLElBQUlpQixRQUFKO0FBQWFuQixNQUFNLENBQUNDLElBQVAsQ0FBWSxtQkFBWixFQUFnQztBQUFDbUIsU0FBTyxDQUFDbEIsQ0FBRCxFQUFHO0FBQUNpQixZQUFRLEdBQUNqQixDQUFUO0FBQVc7O0FBQXZCLENBQWhDLEVBQXlELEVBQXpEO0FBQTZELElBQUkwSixjQUFKO0FBQW1CNUosTUFBTSxDQUFDQyxJQUFQLENBQVksMEJBQVosRUFBdUM7QUFBQ21CLFNBQU8sQ0FBQ2xCLENBQUQsRUFBRztBQUFDMEosa0JBQWMsR0FBQzFKLENBQWY7QUFBaUI7O0FBQTdCLENBQXZDLEVBQXNFLEVBQXRFO0FBQTBFLElBQUkySixVQUFKLEVBQWVDLFFBQWY7QUFBd0I5SixNQUFNLENBQUNDLElBQVAsQ0FBWSwyQ0FBWixFQUF3RDtBQUFDNEosWUFBVSxDQUFDM0osQ0FBRCxFQUFHO0FBQUMySixjQUFVLEdBQUMzSixDQUFYO0FBQWEsR0FBNUI7O0FBQTZCNEosVUFBUSxDQUFDNUosQ0FBRCxFQUFHO0FBQUM0SixZQUFRLEdBQUM1SixDQUFUO0FBQVc7O0FBQXBELENBQXhELEVBQThHLEVBQTlHO0FBZWg2QyxNQUFNNkosc0JBQXNCLEdBQUcsSUFBSXZILFlBQUosQ0FBaUI7QUFDOUNsQixNQUFJLEVBQUU7QUFDSnFDLFFBQUksRUFBRUM7QUFERixHQUR3QztBQUk5Q29HLFFBQU0sRUFBRTtBQUNOckcsUUFBSSxFQUFFQztBQURBO0FBSnNDLENBQWpCLENBQS9COztBQVVBLE1BQU1xRyxnQkFBZ0IsR0FBSXRJLElBQUQsSUFBVTtBQUNqQyxNQUFJO0FBQ0YsVUFBTTZGLE9BQU8sR0FBRzdGLElBQWhCO0FBQ0FvSSwwQkFBc0IsQ0FBQ3hJLFFBQXZCLENBQWdDaUcsT0FBaEM7QUFDQSxVQUFNMEMsR0FBRyxHQUFHMUMsT0FBTyxDQUFDd0MsTUFBUixHQUFlZCxRQUFmLEdBQXdCQyxPQUF4QixHQUFnQyxHQUFoQyxHQUFvQ0gsZUFBaEQ7QUFDQSxVQUFNbUIsU0FBUyxHQUFHWCxXQUFXLENBQUNILGNBQUQsRUFBaUJDLGVBQWpCLEVBQWtDOUIsT0FBTyxDQUFDbEcsSUFBMUMsQ0FBN0I7QUFDQSxVQUFNOEksS0FBSyxHQUFHLGFBQVdDLGtCQUFrQixDQUFDN0MsT0FBTyxDQUFDbEcsSUFBVCxDQUE3QixHQUE0QyxhQUE1QyxHQUEwRCtJLGtCQUFrQixDQUFDRixTQUFELENBQTFGO0FBQ0FOLGNBQVUsQ0FBQyxvQ0FBa0NLLEdBQWxDLEdBQXNDLFNBQXZDLEVBQWtERSxLQUFsRCxDQUFWO0FBRUE7Ozs7O0FBSUEsVUFBTUUsUUFBUSxHQUFHZixVQUFVLENBQUNXLEdBQUQsRUFBTUUsS0FBTixDQUEzQjtBQUNBLFFBQUdFLFFBQVEsS0FBSzlCLFNBQWIsSUFBMEI4QixRQUFRLENBQUMzSSxJQUFULEtBQWtCNkcsU0FBL0MsRUFBMEQsTUFBTSxjQUFOO0FBQzFELFVBQU0rQixZQUFZLEdBQUdELFFBQVEsQ0FBQzNJLElBQTlCO0FBQ0FrSSxjQUFVLENBQUMseURBQUQsRUFBMkRTLFFBQVEsQ0FBQzNJLElBQVQsQ0FBY3FHLE1BQXpFLENBQVY7O0FBRUEsUUFBR3VDLFlBQVksQ0FBQ3ZDLE1BQWIsS0FBd0IsU0FBM0IsRUFBc0M7QUFDcEMsVUFBR3VDLFlBQVksQ0FBQzNJLEtBQWIsS0FBdUI0RyxTQUExQixFQUFxQyxNQUFNLGNBQU47O0FBQ3JDLFVBQUcrQixZQUFZLENBQUMzSSxLQUFiLENBQW1CNEksUUFBbkIsQ0FBNEIsa0JBQTVCLENBQUgsRUFBb0Q7QUFDbEQ7QUFDRVYsZ0JBQVEsQ0FBQywrQkFBRCxFQUFpQ1MsWUFBWSxDQUFDM0ksS0FBOUMsQ0FBUjtBQUNGO0FBQ0Q7O0FBQ0QsWUFBTTJJLFlBQVksQ0FBQzNJLEtBQW5CO0FBQ0Q7O0FBQ0RpSSxjQUFVLENBQUMsd0JBQUQsQ0FBVjtBQUVBLFVBQU1ZLE9BQU8sR0FBR3RKLFFBQVEsQ0FBQztBQUFDRyxVQUFJLEVBQUVrRyxPQUFPLENBQUNsRztBQUFmLEtBQUQsQ0FBeEI7QUFDQSxVQUFNUyxLQUFLLEdBQUczQixNQUFNLENBQUNzSyxPQUFQLENBQWU7QUFBQ2hILFNBQUcsRUFBRStHO0FBQU4sS0FBZixDQUFkO0FBQ0FaLGNBQVUsQ0FBQyxlQUFELEVBQWlCOUgsS0FBakIsQ0FBVjtBQUNBLFFBQUdBLEtBQUssQ0FBQzJDLGlCQUFOLEtBQTRCOEQsU0FBL0IsRUFBMEM7QUFFMUMsVUFBTW1DLEtBQUssR0FBR2pCLGdCQUFnQixDQUFDO0FBQUN2QixRQUFFLEVBQUVwRyxLQUFLLENBQUMyQjtBQUFYLEtBQUQsQ0FBOUI7QUFDQW1HLGNBQVUsQ0FBQyw4QkFBRCxFQUFnQ2MsS0FBaEMsQ0FBVjtBQUNBLFVBQU1DLGdCQUFnQixHQUFHakIsZUFBZSxDQUFDO0FBQUN4QixRQUFFLEVBQUVwRyxLQUFLLENBQUMyQixHQUFYO0FBQWdCaUgsV0FBSyxFQUFFQSxLQUF2QjtBQUE4QkUsY0FBUSxFQUFFTixZQUFZLENBQUM1SSxJQUFiLENBQWtCa0o7QUFBMUQsS0FBRCxDQUF4QztBQUNBaEIsY0FBVSxDQUFDLDZCQUFELEVBQStCZSxnQkFBL0IsQ0FBVjtBQUNBLFVBQU1FLGVBQWUsR0FBRzFCLE1BQU0sS0FBR0YsUUFBVCxHQUFrQkMsT0FBbEIsR0FBMEIsR0FBMUIsR0FBOEJGLHNCQUE5QixHQUFxRCxHQUFyRCxHQUF5RG9CLGtCQUFrQixDQUFDTyxnQkFBRCxDQUFuRztBQUNBZixjQUFVLENBQUMscUJBQW1CaUIsZUFBcEIsQ0FBVjtBQUVBLFVBQU1DLFFBQVEsR0FBR3RCLGFBQWEsQ0FBQztBQUFDc0IsY0FBUSxFQUFFUixZQUFZLENBQUM1SSxJQUFiLENBQWtCcUosT0FBN0I7QUFBc0NySixVQUFJLEVBQUU7QUFDekVzSix3QkFBZ0IsRUFBRUg7QUFEdUQ7QUFBNUMsS0FBRCxDQUE5QixDQXhDRSxDQTRDRjs7QUFFQWpCLGNBQVUsQ0FBQyx3REFBRCxDQUFWO0FBQ0FELGtCQUFjLENBQUM7QUFDYnNCLFFBQUUsRUFBRVgsWUFBWSxDQUFDNUksSUFBYixDQUFrQm9CLFNBRFQ7QUFFYm9JLGFBQU8sRUFBRVosWUFBWSxDQUFDNUksSUFBYixDQUFrQndKLE9BRmQ7QUFHYkMsYUFBTyxFQUFFTCxRQUhJO0FBSWJNLGdCQUFVLEVBQUVkLFlBQVksQ0FBQzVJLElBQWIsQ0FBa0IwSjtBQUpqQixLQUFELENBQWQ7QUFNRCxHQXJERCxDQXFERSxPQUFPdkMsU0FBUCxFQUFrQjtBQUNsQixVQUFNLElBQUkvSSxNQUFNLENBQUM4QixLQUFYLENBQWlCLGtDQUFqQixFQUFxRGlILFNBQXJELENBQU47QUFDRDtBQUNGLENBekREOztBQXpCQTlJLE1BQU0sQ0FBQytJLGFBQVAsQ0FvRmVrQixnQkFwRmYsRTs7Ozs7Ozs7Ozs7QUNBQSxJQUFJbEssTUFBSjtBQUFXQyxNQUFNLENBQUNDLElBQVAsQ0FBWSxlQUFaLEVBQTRCO0FBQUNGLFFBQU0sQ0FBQ0csQ0FBRCxFQUFHO0FBQUNILFVBQU0sR0FBQ0csQ0FBUDtBQUFTOztBQUFwQixDQUE1QixFQUFrRCxDQUFsRDtBQUFxRCxJQUFJc0MsWUFBSjtBQUFpQnhDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGNBQVosRUFBMkI7QUFBQ21CLFNBQU8sQ0FBQ2xCLENBQUQsRUFBRztBQUFDc0MsZ0JBQVksR0FBQ3RDLENBQWI7QUFBZTs7QUFBM0IsQ0FBM0IsRUFBd0QsQ0FBeEQ7QUFBMkQsSUFBSUUsTUFBSjtBQUFXSixNQUFNLENBQUNDLElBQVAsQ0FBWSxpQ0FBWixFQUE4QztBQUFDRyxRQUFNLENBQUNGLENBQUQsRUFBRztBQUFDRSxVQUFNLEdBQUNGLENBQVA7QUFBUzs7QUFBcEIsQ0FBOUMsRUFBb0UsQ0FBcEU7QUFBdUUsSUFBSTBFLFVBQUo7QUFBZTVFLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLHVDQUFaLEVBQW9EO0FBQUMyRSxZQUFVLENBQUMxRSxDQUFELEVBQUc7QUFBQzBFLGNBQVUsR0FBQzFFLENBQVg7QUFBYTs7QUFBNUIsQ0FBcEQsRUFBa0YsQ0FBbEY7QUFBcUYsSUFBSW9MLGdCQUFKO0FBQXFCdEwsTUFBTSxDQUFDQyxJQUFQLENBQVksK0JBQVosRUFBNEM7QUFBQ21CLFNBQU8sQ0FBQ2xCLENBQUQsRUFBRztBQUFDb0wsb0JBQWdCLEdBQUNwTCxDQUFqQjtBQUFtQjs7QUFBL0IsQ0FBNUMsRUFBNkUsQ0FBN0U7QUFBZ0YsSUFBSXFMLFdBQUo7QUFBZ0J2TCxNQUFNLENBQUNDLElBQVAsQ0FBWSwwQkFBWixFQUF1QztBQUFDbUIsU0FBTyxDQUFDbEIsQ0FBRCxFQUFHO0FBQUNxTCxlQUFXLEdBQUNyTCxDQUFaO0FBQWM7O0FBQTFCLENBQXZDLEVBQW1FLENBQW5FO0FBQXNFLElBQUlzTCxlQUFKO0FBQW9CeEwsTUFBTSxDQUFDQyxJQUFQLENBQVksaUNBQVosRUFBOEM7QUFBQ21CLFNBQU8sQ0FBQ2xCLENBQUQsRUFBRztBQUFDc0wsbUJBQWUsR0FBQ3RMLENBQWhCO0FBQWtCOztBQUE5QixDQUE5QyxFQUE4RSxDQUE5RTtBQUFpRixJQUFJcUosVUFBSjtBQUFldkosTUFBTSxDQUFDQyxJQUFQLENBQVksZ0NBQVosRUFBNkM7QUFBQ3NKLFlBQVUsQ0FBQ3JKLENBQUQsRUFBRztBQUFDcUosY0FBVSxHQUFDckosQ0FBWDtBQUFhOztBQUE1QixDQUE3QyxFQUEyRSxDQUEzRTtBQUE4RSxJQUFJMkgsa0JBQUo7QUFBdUI3SCxNQUFNLENBQUNDLElBQVAsQ0FBWSxnREFBWixFQUE2RDtBQUFDNEgsb0JBQWtCLENBQUMzSCxDQUFELEVBQUc7QUFBQzJILHNCQUFrQixHQUFDM0gsQ0FBbkI7QUFBcUI7O0FBQTVDLENBQTdELEVBQTJHLENBQTNHO0FBQThHLElBQUk0SCxPQUFKO0FBQVk5SCxNQUFNLENBQUNDLElBQVAsQ0FBWSwyQ0FBWixFQUF3RDtBQUFDNkgsU0FBTyxDQUFDNUgsQ0FBRCxFQUFHO0FBQUM0SCxXQUFPLEdBQUM1SCxDQUFSO0FBQVU7O0FBQXRCLENBQXhELEVBQWdGLENBQWhGO0FBQW1GLElBQUl1TCxRQUFKO0FBQWF6TCxNQUFNLENBQUNDLElBQVAsQ0FBWSxzQkFBWixFQUFtQztBQUFDd0wsVUFBUSxDQUFDdkwsQ0FBRCxFQUFHO0FBQUN1TCxZQUFRLEdBQUN2TCxDQUFUO0FBQVc7O0FBQXhCLENBQW5DLEVBQTZELEVBQTdEO0FBWWg3QixNQUFNd0wsb0JBQW9CLEdBQUcsSUFBSWxKLFlBQUosQ0FBaUI7QUFDNUNtSixTQUFPLEVBQUU7QUFDUGhJLFFBQUksRUFBRUM7QUFEQyxHQURtQztBQUk1Q3VHLFdBQVMsRUFBRTtBQUNUeEcsUUFBSSxFQUFFQztBQURHO0FBSmlDLENBQWpCLENBQTdCO0FBU0EsTUFBTWdJLGlCQUFpQixHQUFHLElBQUlwSixZQUFKLENBQWlCO0FBQ3pDMkksU0FBTyxFQUFFO0FBQ1B4SCxRQUFJLEVBQUVDLE1BREM7QUFFUEksWUFBUSxFQUFDO0FBRkYsR0FEZ0M7QUFLekM2RyxVQUFRLEVBQUU7QUFDUmxILFFBQUksRUFBRUMsTUFERTtBQUVSQyxTQUFLLEVBQUUsMkRBRkM7QUFHUkcsWUFBUSxFQUFDO0FBSEQsR0FMK0I7QUFVekNxSCxZQUFVLEVBQUU7QUFDVjFILFFBQUksRUFBRUMsTUFESTtBQUVWQyxTQUFLLEVBQUVyQixZQUFZLENBQUNzQixLQUFiLENBQW1CK0gsS0FGaEI7QUFHVjdILFlBQVEsRUFBQztBQUhDLEdBVjZCO0FBZXpDOEgsYUFBVyxFQUFFO0FBQ1huSSxRQUFJLEVBQUVDLE1BREs7QUFFWEMsU0FBSyxFQUFFLDJEQUZJO0FBR1hHLFlBQVEsRUFBQztBQUhFO0FBZjRCLENBQWpCLENBQTFCOztBQXNCQSxNQUFNK0gsY0FBYyxHQUFJcEssSUFBRCxJQUFVO0FBQy9CLE1BQUk7QUFDRixVQUFNNkYsT0FBTyxHQUFHN0YsSUFBaEI7QUFDQStKLHdCQUFvQixDQUFDbkssUUFBckIsQ0FBOEJpRyxPQUE5QjtBQUNBLFVBQU16RixLQUFLLEdBQUczQixNQUFNLENBQUNzSyxPQUFQLENBQWU7QUFBQ3RHLFlBQU0sRUFBRW9ELE9BQU8sQ0FBQ21FO0FBQWpCLEtBQWYsQ0FBZDtBQUNBLFFBQUc1SixLQUFLLEtBQUt5RyxTQUFiLEVBQXdCLE1BQU0sMEJBQXdCaEIsT0FBTyxDQUFDbUUsT0FBaEMsR0FBd0MsWUFBOUM7QUFDeEI3RCxXQUFPLENBQUMsY0FBRCxFQUFnQi9GLEtBQWhCLENBQVA7QUFFQSxVQUFNZ0IsU0FBUyxHQUFHNkIsVUFBVSxDQUFDOEYsT0FBWCxDQUFtQjtBQUFDaEgsU0FBRyxFQUFFM0IsS0FBSyxDQUFDZ0I7QUFBWixLQUFuQixDQUFsQjtBQUNBLFFBQUdBLFNBQVMsS0FBS3lGLFNBQWpCLEVBQTRCLE1BQU0scUJBQU47QUFDNUJWLFdBQU8sQ0FBQyxpQkFBRCxFQUFvQi9FLFNBQXBCLENBQVA7QUFFQSxVQUFNaUosS0FBSyxHQUFHakosU0FBUyxDQUFDc0QsS0FBVixDQUFnQjRGLEtBQWhCLENBQXNCLEdBQXRCLENBQWQ7QUFDQSxVQUFNakMsTUFBTSxHQUFHZ0MsS0FBSyxDQUFDQSxLQUFLLENBQUNFLE1BQU4sR0FBYSxDQUFkLENBQXBCO0FBRUEsUUFBSTFGLFNBQVMsR0FBRytFLFdBQVcsQ0FBQztBQUFFdkIsWUFBTSxFQUFFQTtBQUFWLEtBQUQsQ0FBM0I7O0FBRUEsUUFBRyxDQUFDeEQsU0FBSixFQUFjO0FBQ1osWUFBTTJGLFFBQVEsR0FBR2IsZ0JBQWdCLENBQUM7QUFBQ3RCLGNBQU0sRUFBRXhDLE9BQU8sQ0FBQ3dDO0FBQWpCLE9BQUQsQ0FBakM7QUFDQWxDLGFBQU8sQ0FBQyxtRUFBRCxFQUFzRTtBQUFFcUUsZ0JBQVEsRUFBRUE7QUFBWixPQUF0RSxDQUFQO0FBQ0EzRixlQUFTLEdBQUcrRSxXQUFXLENBQUM7QUFBRXZCLGNBQU0sRUFBRW1DO0FBQVYsT0FBRCxDQUF2QixDQUhZLENBR2tDO0FBQy9DOztBQUVEckUsV0FBTyxDQUFDLG9EQUFELEVBQXVELE1BQUlrRSxLQUFKLEdBQVUsR0FBVixHQUFjaEMsTUFBZCxHQUFxQixHQUFyQixHQUF5QnhELFNBQXpCLEdBQW1DLEdBQTFGLENBQVAsQ0F0QkUsQ0F3QkY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBc0IsV0FBTyxDQUFDLHdCQUFELENBQVA7O0FBQ0EsUUFBRyxDQUFDMEQsZUFBZSxDQUFDO0FBQUNoRixlQUFTLEVBQUVBLFNBQVo7QUFBdUI3RSxVQUFJLEVBQUU2RixPQUFPLENBQUNtRSxPQUFyQztBQUE4Q3hCLGVBQVMsRUFBRTNDLE9BQU8sQ0FBQzJDO0FBQWpFLEtBQUQsQ0FBbkIsRUFBa0c7QUFDaEcsWUFBTSxxQ0FBTjtBQUNEOztBQUVEckMsV0FBTyxDQUFDLG9CQUFELENBQVAsQ0FuQ0UsQ0FxQ0Y7O0FBQ0EsUUFBSXNFLFdBQUo7O0FBQ0EsUUFBSTtBQUVGQSxpQkFBVyxHQUFHN0MsVUFBVSxDQUFDMUIsa0JBQUQsRUFBcUIsRUFBckIsQ0FBVixDQUFtQ2xHLElBQWpEO0FBQ0EsVUFBSTBLLGlCQUFpQixHQUFHO0FBQ3RCLHFCQUFhdEosU0FBUyxDQUFDc0QsS0FERDtBQUV0QixtQkFBVytGLFdBQVcsQ0FBQ3pLLElBQVosQ0FBaUJxSixPQUZOO0FBR3RCLG9CQUFZb0IsV0FBVyxDQUFDekssSUFBWixDQUFpQmtKLFFBSFA7QUFJdEIsbUJBQVd1QixXQUFXLENBQUN6SyxJQUFaLENBQWlCd0osT0FKTjtBQUt0QixzQkFBY2lCLFdBQVcsQ0FBQ3pLLElBQVosQ0FBaUIwSjtBQUxULE9BQXhCO0FBUUYsVUFBSWlCLFVBQVUsR0FBR0QsaUJBQWpCOztBQUVBLFVBQUc7QUFDRCxZQUFJRSxLQUFLLEdBQUdkLFFBQVEsQ0FBQ2UsS0FBVCxDQUFlOUIsT0FBZixDQUF1QjtBQUFDaEgsYUFBRyxFQUFFM0IsS0FBSyxDQUFDcEI7QUFBWixTQUF2QixDQUFaO0FBQ0EsWUFBSThMLFlBQVksR0FBR0YsS0FBSyxDQUFDRyxPQUFOLENBQWNELFlBQWpDO0FBQ0FiLHlCQUFpQixDQUFDckssUUFBbEIsQ0FBMkJrTCxZQUEzQjtBQUVBSCxrQkFBVSxDQUFDLFVBQUQsQ0FBVixHQUF5QkcsWUFBWSxDQUFDLFVBQUQsQ0FBWixJQUE0QkosaUJBQWlCLENBQUMsVUFBRCxDQUF0RTtBQUNBQyxrQkFBVSxDQUFDLFNBQUQsQ0FBVixHQUF3QkcsWUFBWSxDQUFDLFNBQUQsQ0FBWixJQUEyQkosaUJBQWlCLENBQUMsU0FBRCxDQUFwRTtBQUNBQyxrQkFBVSxDQUFDLFlBQUQsQ0FBVixHQUEyQkcsWUFBWSxDQUFDLFlBQUQsQ0FBWixJQUE4QkosaUJBQWlCLENBQUMsWUFBRCxDQUExRTtBQUNBQyxrQkFBVSxDQUFDLFNBQUQsQ0FBVixHQUF3QkcsWUFBWSxDQUFDLGFBQUQsQ0FBWixHQUErQmxELFVBQVUsQ0FBQ2tELFlBQVksQ0FBQyxhQUFELENBQWIsRUFBOEIsRUFBOUIsQ0FBVixDQUE0Q3pCLE9BQTVDLElBQXVEcUIsaUJBQWlCLENBQUMsU0FBRCxDQUF2RyxHQUFzSEEsaUJBQWlCLENBQUMsU0FBRCxDQUEvSjtBQUVELE9BVkQsQ0FXQSxPQUFNekssS0FBTixFQUFhO0FBQ1gwSyxrQkFBVSxHQUFDRCxpQkFBWDtBQUNEOztBQUVDdkUsYUFBTyxDQUFDLHNCQUFELEVBQXlCRCxrQkFBekIsRUFBNkN5RSxVQUE3QyxDQUFQO0FBRUEsYUFBT0EsVUFBUDtBQUVELEtBaENELENBZ0NFLE9BQU0xSyxLQUFOLEVBQWE7QUFDYixZQUFNLHdDQUFzQ0EsS0FBNUM7QUFDRDtBQUVGLEdBM0VELENBMkVFLE9BQU1rSCxTQUFOLEVBQWlCO0FBQ2pCLFVBQU0sSUFBSS9JLE1BQU0sQ0FBQzhCLEtBQVgsQ0FBaUIsZ0NBQWpCLEVBQW1EaUgsU0FBbkQsQ0FBTjtBQUNEO0FBQ0YsQ0EvRUQ7O0FBM0NBOUksTUFBTSxDQUFDK0ksYUFBUCxDQTRIZWdELGNBNUhmLEU7Ozs7Ozs7Ozs7O0FDQUEsSUFBSWhNLE1BQUo7QUFBV0MsTUFBTSxDQUFDQyxJQUFQLENBQVksZUFBWixFQUE0QjtBQUFDRixRQUFNLENBQUNHLENBQUQsRUFBRztBQUFDSCxVQUFNLEdBQUNHLENBQVA7QUFBUzs7QUFBcEIsQ0FBNUIsRUFBa0QsQ0FBbEQ7QUFBcUQsSUFBSXNDLFlBQUo7QUFBaUJ4QyxNQUFNLENBQUNDLElBQVAsQ0FBWSxjQUFaLEVBQTJCO0FBQUNtQixTQUFPLENBQUNsQixDQUFELEVBQUc7QUFBQ3NDLGdCQUFZLEdBQUN0QyxDQUFiO0FBQWU7O0FBQTNCLENBQTNCLEVBQXdELENBQXhEO0FBQTJELElBQUl5TSxVQUFKO0FBQWUzTSxNQUFNLENBQUNDLElBQVAsQ0FBWSwrQkFBWixFQUE0QztBQUFDME0sWUFBVSxDQUFDek0sQ0FBRCxFQUFHO0FBQUN5TSxjQUFVLEdBQUN6TSxDQUFYO0FBQWE7O0FBQTVCLENBQTVDLEVBQTBFLENBQTFFO0FBQTZFLElBQUkwTSxpQkFBSjtBQUFzQjVNLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLDhDQUFaLEVBQTJEO0FBQUMyTSxtQkFBaUIsQ0FBQzFNLENBQUQsRUFBRztBQUFDME0scUJBQWlCLEdBQUMxTSxDQUFsQjtBQUFvQjs7QUFBMUMsQ0FBM0QsRUFBdUcsQ0FBdkc7QUFBMEcsSUFBSTJNLFNBQUosRUFBY0MsU0FBZDtBQUF3QjlNLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLDRDQUFaLEVBQXlEO0FBQUM0TSxXQUFTLENBQUMzTSxDQUFELEVBQUc7QUFBQzJNLGFBQVMsR0FBQzNNLENBQVY7QUFBWSxHQUExQjs7QUFBMkI0TSxXQUFTLENBQUM1TSxDQUFELEVBQUc7QUFBQzRNLGFBQVMsR0FBQzVNLENBQVY7QUFBWTs7QUFBcEQsQ0FBekQsRUFBK0csQ0FBL0c7QUFBa0gsSUFBSTRILE9BQUo7QUFBWTlILE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLDJDQUFaLEVBQXdEO0FBQUM2SCxTQUFPLENBQUM1SCxDQUFELEVBQUc7QUFBQzRILFdBQU8sR0FBQzVILENBQVI7QUFBVTs7QUFBdEIsQ0FBeEQsRUFBZ0YsQ0FBaEY7QUFPOWYsTUFBTTZNLFVBQVUsR0FBRyxxQkFBbkI7QUFDQSxNQUFNQyxrQkFBa0IsR0FBRyw2QkFBM0I7QUFFQSxNQUFNQyxpQkFBaUIsR0FBRyxJQUFJekssWUFBSixDQUFpQjtBQUN6Q3dILFFBQU0sRUFBRTtBQUNOckcsUUFBSSxFQUFFQztBQURBO0FBRGlDLENBQWpCLENBQTFCOztBQU9BLE1BQU0ySCxXQUFXLEdBQUk1SixJQUFELElBQVU7QUFDNUIsTUFBSTtBQUNGLFVBQU02RixPQUFPLEdBQUc3RixJQUFoQjtBQUNBc0wscUJBQWlCLENBQUMxTCxRQUFsQixDQUEyQmlHLE9BQTNCO0FBRUEsUUFBSTBGLGFBQWEsR0FBQ0gsVUFBbEI7O0FBRUEsUUFBR0YsU0FBUyxNQUFNQyxTQUFTLEVBQTNCLEVBQThCO0FBQzFCSSxtQkFBYSxHQUFHRixrQkFBaEI7QUFDQWxGLGFBQU8sQ0FBQyxtQkFBaUIrRSxTQUFTLEVBQTFCLEdBQTZCLFlBQTdCLEdBQTBDQyxTQUFTLEVBQW5ELEdBQXNELGdCQUF2RCxFQUF3RUksYUFBeEUsQ0FBUDtBQUNIOztBQUNELFVBQU16RixHQUFHLEdBQUdrRixVQUFVLENBQUNPLGFBQUQsRUFBZ0IxRixPQUFPLENBQUN3QyxNQUF4QixDQUF0QjtBQUNBbEMsV0FBTyxDQUFDLCtFQUFELEVBQWlGO0FBQUNxRixjQUFRLEVBQUMxRixHQUFWO0FBQWV1QyxZQUFNLEVBQUN4QyxPQUFPLENBQUN3QyxNQUE5QjtBQUFzQ29ELFlBQU0sRUFBQ0Y7QUFBN0MsS0FBakYsQ0FBUDtBQUVBLFFBQUd6RixHQUFHLEtBQUtlLFNBQVgsRUFBc0IsT0FBTzZFLFdBQVcsQ0FBQzdGLE9BQU8sQ0FBQ3dDLE1BQVQsQ0FBbEI7QUFDdEIsV0FBT3ZDLEdBQVA7QUFDRCxHQWZELENBZUUsT0FBT3FCLFNBQVAsRUFBa0I7QUFDbEIsVUFBTSxJQUFJL0ksTUFBTSxDQUFDOEIsS0FBWCxDQUFpQiwyQkFBakIsRUFBOENpSCxTQUE5QyxDQUFOO0FBQ0Q7QUFDRixDQW5CRDs7QUFxQkEsTUFBTXVFLFdBQVcsR0FBSXJELE1BQUQsSUFBWTtBQUM5QixNQUFHQSxNQUFNLEtBQUs0QyxpQkFBZCxFQUFpQyxNQUFNLElBQUk3TSxNQUFNLENBQUM4QixLQUFYLENBQWlCLDhCQUFqQixDQUFOO0FBQy9CaUcsU0FBTyxDQUFDLG1DQUFELEVBQXFDOEUsaUJBQXJDLENBQVA7QUFDRixTQUFPckIsV0FBVyxDQUFDO0FBQUN2QixVQUFNLEVBQUU0QztBQUFULEdBQUQsQ0FBbEI7QUFDRCxDQUpEOztBQXRDQTVNLE1BQU0sQ0FBQytJLGFBQVAsQ0E0Q2V3QyxXQTVDZixFOzs7Ozs7Ozs7OztBQ0FBLElBQUl4TCxNQUFKO0FBQVdDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGVBQVosRUFBNEI7QUFBQ0YsUUFBTSxDQUFDRyxDQUFELEVBQUc7QUFBQ0gsVUFBTSxHQUFDRyxDQUFQO0FBQVM7O0FBQXBCLENBQTVCLEVBQWtELENBQWxEO0FBQXFELElBQUlzQyxZQUFKO0FBQWlCeEMsTUFBTSxDQUFDQyxJQUFQLENBQVksY0FBWixFQUEyQjtBQUFDbUIsU0FBTyxDQUFDbEIsQ0FBRCxFQUFHO0FBQUNzQyxnQkFBWSxHQUFDdEMsQ0FBYjtBQUFlOztBQUEzQixDQUEzQixFQUF3RCxDQUF4RDtBQUEyRCxJQUFJeU0sVUFBSjtBQUFlM00sTUFBTSxDQUFDQyxJQUFQLENBQVksK0JBQVosRUFBNEM7QUFBQzBNLFlBQVUsQ0FBQ3pNLENBQUQsRUFBRztBQUFDeU0sY0FBVSxHQUFDek0sQ0FBWDtBQUFhOztBQUE1QixDQUE1QyxFQUEwRSxDQUExRTtBQUE2RSxJQUFJME0saUJBQUo7QUFBc0I1TSxNQUFNLENBQUNDLElBQVAsQ0FBWSw4Q0FBWixFQUEyRDtBQUFDMk0sbUJBQWlCLENBQUMxTSxDQUFELEVBQUc7QUFBQzBNLHFCQUFpQixHQUFDMU0sQ0FBbEI7QUFBb0I7O0FBQTFDLENBQTNELEVBQXVHLENBQXZHO0FBQTBHLElBQUk0SCxPQUFKO0FBQVk5SCxNQUFNLENBQUNDLElBQVAsQ0FBWSwyQ0FBWixFQUF3RDtBQUFDNkgsU0FBTyxDQUFDNUgsQ0FBRCxFQUFHO0FBQUM0SCxXQUFPLEdBQUM1SCxDQUFSO0FBQVU7O0FBQXRCLENBQXhELEVBQWdGLENBQWhGO0FBQW1GLElBQUkyTSxTQUFKLEVBQWNDLFNBQWQ7QUFBd0I5TSxNQUFNLENBQUNDLElBQVAsQ0FBWSw0Q0FBWixFQUF5RDtBQUFDNE0sV0FBUyxDQUFDM00sQ0FBRCxFQUFHO0FBQUMyTSxhQUFTLEdBQUMzTSxDQUFWO0FBQVksR0FBMUI7O0FBQTJCNE0sV0FBUyxDQUFDNU0sQ0FBRCxFQUFHO0FBQUM0TSxhQUFTLEdBQUM1TSxDQUFWO0FBQVk7O0FBQXBELENBQXpELEVBQStHLENBQS9HO0FBTy9kLE1BQU1vTixZQUFZLEdBQUcsMEJBQXJCO0FBQ0EsTUFBTUMsb0JBQW9CLEdBQUcsa0NBQTdCO0FBRUEsTUFBTUMsc0JBQXNCLEdBQUcsSUFBSWhMLFlBQUosQ0FBaUI7QUFDOUN3SCxRQUFNLEVBQUU7QUFDTnJHLFFBQUksRUFBRUM7QUFEQTtBQURzQyxDQUFqQixDQUEvQjs7QUFPQSxNQUFNMEgsZ0JBQWdCLEdBQUkzSixJQUFELElBQVU7QUFDakMsTUFBSTtBQUNGLFVBQU02RixPQUFPLEdBQUc3RixJQUFoQjtBQUNBNkwsMEJBQXNCLENBQUNqTSxRQUF2QixDQUFnQ2lHLE9BQWhDO0FBRUEsUUFBSWlHLGVBQWUsR0FBQ0gsWUFBcEI7O0FBQ0EsUUFBR1QsU0FBUyxNQUFNQyxTQUFTLEVBQTNCLEVBQThCO0FBQzFCVyxxQkFBZSxHQUFHRixvQkFBbEI7QUFDQXpGLGFBQU8sQ0FBQyxtQkFBaUIrRSxTQUFTLEVBQTFCLEdBQTZCLGFBQTdCLEdBQTJDQyxTQUFTLEVBQXBELEdBQXVELGVBQXhELEVBQXdFO0FBQUNZLG1CQUFXLEVBQUNELGVBQWI7QUFBOEJ6RCxjQUFNLEVBQUN4QyxPQUFPLENBQUN3QztBQUE3QyxPQUF4RSxDQUFQO0FBQ0g7O0FBRUQsVUFBTW1DLFFBQVEsR0FBR1EsVUFBVSxDQUFDYyxlQUFELEVBQWtCakcsT0FBTyxDQUFDd0MsTUFBMUIsQ0FBM0I7QUFDQSxRQUFHbUMsUUFBUSxLQUFLM0QsU0FBaEIsRUFBMkIsT0FBTzZFLFdBQVcsRUFBbEI7QUFFM0J2RixXQUFPLENBQUMsNkRBQUQsRUFBK0RxRSxRQUEvRCxDQUFQO0FBQ0EsV0FBT0EsUUFBUDtBQUNELEdBZkQsQ0FlRSxPQUFPckQsU0FBUCxFQUFrQjtBQUNsQixVQUFNLElBQUkvSSxNQUFNLENBQUM4QixLQUFYLENBQWlCLGdDQUFqQixFQUFtRGlILFNBQW5ELENBQU47QUFDRDtBQUNGLENBbkJEOztBQXFCQSxNQUFNdUUsV0FBVyxHQUFHLE1BQU07QUFDeEJ2RixTQUFPLENBQUMsb0NBQWtDOEUsaUJBQWxDLEdBQW9ELFVBQXJELENBQVA7QUFDQSxTQUFPQSxpQkFBUDtBQUNELENBSEQ7O0FBdENBNU0sTUFBTSxDQUFDK0ksYUFBUCxDQTJDZXVDLGdCQTNDZixFOzs7Ozs7Ozs7OztBQ0FBLElBQUl2TCxNQUFKO0FBQVdDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGVBQVosRUFBNEI7QUFBQ0YsUUFBTSxDQUFDRyxDQUFELEVBQUc7QUFBQ0gsVUFBTSxHQUFDRyxDQUFQO0FBQVM7O0FBQXBCLENBQTVCLEVBQWtELENBQWxEO0FBQXFELElBQUlzQyxZQUFKO0FBQWlCeEMsTUFBTSxDQUFDQyxJQUFQLENBQVksY0FBWixFQUEyQjtBQUFDbUIsU0FBTyxDQUFDbEIsQ0FBRCxFQUFHO0FBQUNzQyxnQkFBWSxHQUFDdEMsQ0FBYjtBQUFlOztBQUEzQixDQUEzQixFQUF3RCxDQUF4RDtBQUEyRCxJQUFJbUosY0FBSixFQUFtQkMsZUFBbkI7QUFBbUN0SixNQUFNLENBQUNDLElBQVAsQ0FBWSxtREFBWixFQUFnRTtBQUFDb0osZ0JBQWMsQ0FBQ25KLENBQUQsRUFBRztBQUFDbUosa0JBQWMsR0FBQ25KLENBQWY7QUFBaUIsR0FBcEM7O0FBQXFDb0osaUJBQWUsQ0FBQ3BKLENBQUQsRUFBRztBQUFDb0osbUJBQWUsR0FBQ3BKLENBQWhCO0FBQWtCOztBQUExRSxDQUFoRSxFQUE0SSxDQUE1STtBQUErSSxJQUFJeU4sTUFBSjtBQUFXM04sTUFBTSxDQUFDQyxJQUFQLENBQVksb0NBQVosRUFBaUQ7QUFBQzBOLFFBQU0sQ0FBQ3pOLENBQUQsRUFBRztBQUFDeU4sVUFBTSxHQUFDek4sQ0FBUDtBQUFTOztBQUFwQixDQUFqRCxFQUF1RSxDQUF2RTtBQUEwRSxJQUFJdUcsZUFBSjtBQUFvQnpHLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGtDQUFaLEVBQStDO0FBQUN3RyxpQkFBZSxDQUFDdkcsQ0FBRCxFQUFHO0FBQUN1RyxtQkFBZSxHQUFDdkcsQ0FBaEI7QUFBa0I7O0FBQXRDLENBQS9DLEVBQXVGLENBQXZGO0FBQTBGLElBQUkwTixzQkFBSjtBQUEyQjVOLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLG9DQUFaLEVBQWlEO0FBQUNtQixTQUFPLENBQUNsQixDQUFELEVBQUc7QUFBQzBOLDBCQUFzQixHQUFDMU4sQ0FBdkI7QUFBeUI7O0FBQXJDLENBQWpELEVBQXdGLENBQXhGO0FBQTJGLElBQUkyTixvQkFBSjtBQUF5QjdOLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLCtCQUFaLEVBQTRDO0FBQUNtQixTQUFPLENBQUNsQixDQUFELEVBQUc7QUFBQzJOLHdCQUFvQixHQUFDM04sQ0FBckI7QUFBdUI7O0FBQW5DLENBQTVDLEVBQWlGLENBQWpGO0FBQW9GLElBQUk0TixjQUFKO0FBQW1COU4sTUFBTSxDQUFDQyxJQUFQLENBQVksc0JBQVosRUFBbUM7QUFBQ21CLFNBQU8sQ0FBQ2xCLENBQUQsRUFBRztBQUFDNE4sa0JBQWMsR0FBQzVOLENBQWY7QUFBaUI7O0FBQTdCLENBQW5DLEVBQWtFLENBQWxFO0FBQXFFLElBQUkySixVQUFKLEVBQWUvQixPQUFmO0FBQXVCOUgsTUFBTSxDQUFDQyxJQUFQLENBQVksMkNBQVosRUFBd0Q7QUFBQzRKLFlBQVUsQ0FBQzNKLENBQUQsRUFBRztBQUFDMkosY0FBVSxHQUFDM0osQ0FBWDtBQUFhLEdBQTVCOztBQUE2QjRILFNBQU8sQ0FBQzVILENBQUQsRUFBRztBQUFDNEgsV0FBTyxHQUFDNUgsQ0FBUjtBQUFVOztBQUFsRCxDQUF4RCxFQUE0RyxDQUE1RztBQVVuMUIsTUFBTTZOLHNCQUFzQixHQUFHLElBQUl2TCxZQUFKLENBQWlCO0FBQzlDbEIsTUFBSSxFQUFFO0FBQ0pxQyxRQUFJLEVBQUVDO0FBREYsR0FEd0M7QUFJOUNnRCxPQUFLLEVBQUU7QUFDTGpELFFBQUksRUFBRUM7QUFERCxHQUp1QztBQU85Q2lELFNBQU8sRUFBRTtBQUNQbEQsUUFBSSxFQUFFQztBQURDLEdBUHFDO0FBVTlDUyxNQUFJLEVBQUU7QUFDSlYsUUFBSSxFQUFFQztBQURGO0FBVndDLENBQWpCLENBQS9CO0FBZUE7Ozs7Ozs7QUFNQSxNQUFNb0ssZ0JBQWdCLEdBQUlySCxLQUFELElBQVc7QUFDbEMsTUFBSTtBQUVGLFVBQU1zSCxRQUFRLEdBQUd0SCxLQUFqQjtBQUNBa0QsY0FBVSxDQUFDLGdDQUFELEVBQWtDb0UsUUFBUSxDQUFDM00sSUFBM0MsQ0FBVjtBQUNBeU0sMEJBQXNCLENBQUN4TSxRQUF2QixDQUFnQzBNLFFBQWhDO0FBRUEsVUFBTUMsR0FBRyxHQUFHekgsZUFBZSxDQUFDaUUsT0FBaEIsQ0FBd0I7QUFBQ3BKLFVBQUksRUFBRTJNLFFBQVEsQ0FBQzNNO0FBQWhCLEtBQXhCLENBQVo7O0FBQ0EsUUFBRzRNLEdBQUcsS0FBSzFGLFNBQVgsRUFBcUI7QUFDakJWLGFBQU8sQ0FBQyw0Q0FBMENvRyxHQUFHLENBQUN4SyxHQUEvQyxDQUFQO0FBQ0EsYUFBT3dLLEdBQUcsQ0FBQ3hLLEdBQVg7QUFDSDs7QUFFRCxVQUFNa0QsS0FBSyxHQUFHZ0MsSUFBSSxDQUFDdUYsS0FBTCxDQUFXRixRQUFRLENBQUNySCxLQUFwQixDQUFkLENBWkUsQ0FhRjs7QUFDQSxRQUFHQSxLQUFLLENBQUNyQixJQUFOLEtBQWVpRCxTQUFsQixFQUE2QixNQUFNLHdCQUFOLENBZDNCLENBYzJEOztBQUM3RCxVQUFNNEYsR0FBRyxHQUFHVCxNQUFNLENBQUN0RSxjQUFELEVBQWlCQyxlQUFqQixDQUFsQjtBQUNBLFVBQU1oRCxVQUFVLEdBQUd1SCxvQkFBb0IsQ0FBQztBQUFDTyxTQUFHLEVBQUVBO0FBQU4sS0FBRCxDQUF2QztBQUNBdEcsV0FBTyxDQUFDLHlDQUFELENBQVA7QUFFQSxVQUFNa0MsTUFBTSxHQUFHOEQsY0FBYyxDQUFDO0FBQUN4SCxnQkFBVSxFQUFFQSxVQUFiO0FBQXlCOEUsYUFBTyxFQUFFeEUsS0FBSyxDQUFDckI7QUFBeEMsS0FBRCxDQUE3QjtBQUNBdUMsV0FBTyxDQUFDLGlDQUFELEVBQW1Da0MsTUFBbkMsQ0FBUDtBQUVBLFVBQU1xRSxPQUFPLEdBQUdKLFFBQVEsQ0FBQzNNLElBQVQsQ0FBY2dOLE9BQWQsQ0FBc0IsR0FBdEIsQ0FBaEIsQ0F0QkUsQ0FzQjBDOztBQUM1Q3hHLFdBQU8sQ0FBQyxVQUFELEVBQVl1RyxPQUFaLENBQVA7QUFDQSxVQUFNL0osU0FBUyxHQUFJK0osT0FBTyxJQUFFLENBQUMsQ0FBWCxHQUFjSixRQUFRLENBQUMzTSxJQUFULENBQWNpTixTQUFkLENBQXdCLENBQXhCLEVBQTBCRixPQUExQixDQUFkLEdBQWlEN0YsU0FBbkU7QUFDQVYsV0FBTyxDQUFDLFlBQUQsRUFBY3hELFNBQWQsQ0FBUDtBQUNBLFVBQU1KLEtBQUssR0FBR0ksU0FBUyxHQUFDMkosUUFBUSxDQUFDM00sSUFBVCxDQUFjaU4sU0FBZCxDQUF3QkYsT0FBTyxHQUFDLENBQWhDLENBQUQsR0FBb0M3RixTQUEzRDtBQUNBVixXQUFPLENBQUMsUUFBRCxFQUFVNUQsS0FBVixDQUFQO0FBRUEsVUFBTWlFLEVBQUUsR0FBRzFCLGVBQWUsQ0FBQzlELE1BQWhCLENBQXVCO0FBQzlCckIsVUFBSSxFQUFFMk0sUUFBUSxDQUFDM00sSUFEZTtBQUU5QnNGLFdBQUssRUFBRXFILFFBQVEsQ0FBQ3JILEtBRmM7QUFHOUJDLGFBQU8sRUFBRW9ILFFBQVEsQ0FBQ3BILE9BSFk7QUFJOUJ2QyxlQUFTLEVBQUVBLFNBSm1CO0FBSzlCSixXQUFLLEVBQUVBLEtBTHVCO0FBTTlCRyxVQUFJLEVBQUU0SixRQUFRLENBQUM1SixJQU5lO0FBTzlCbUssZUFBUyxFQUFFUCxRQUFRLENBQUNPLFNBUFU7QUFROUJDLGFBQU8sRUFBRVIsUUFBUSxDQUFDUTtBQVJZLEtBQXZCLENBQVg7QUFXQTNHLFdBQU8sQ0FBQyw2QkFBRCxFQUFnQztBQUFDSyxRQUFFLEVBQUNBLEVBQUo7QUFBTzdHLFVBQUksRUFBQzJNLFFBQVEsQ0FBQzNNLElBQXJCO0FBQTBCZ0QsZUFBUyxFQUFDQSxTQUFwQztBQUE4Q0osV0FBSyxFQUFDQTtBQUFwRCxLQUFoQyxDQUFQOztBQUVBLFFBQUcsQ0FBQ0ksU0FBSixFQUFjO0FBQ1ZzSiw0QkFBc0IsQ0FBQztBQUNuQnRNLFlBQUksRUFBRTJNLFFBQVEsQ0FBQzNNLElBREk7QUFFbkIwSSxjQUFNLEVBQUVBO0FBRlcsT0FBRCxDQUF0QjtBQUlBbEMsYUFBTyxDQUFDLHdCQUNKLFNBREksR0FDTW1HLFFBQVEsQ0FBQzNNLElBRGYsR0FDb0IsSUFEcEIsR0FFSixVQUZJLEdBRU8yTSxRQUFRLENBQUNwSCxPQUZoQixHQUV3QixJQUZ4QixHQUdKLE9BSEksR0FHSW9ILFFBQVEsQ0FBQzVKLElBSGIsR0FHa0IsSUFIbEIsR0FJSixRQUpJLEdBSUs0SixRQUFRLENBQUNySCxLQUpmLENBQVA7QUFNSCxLQVhELE1BV0s7QUFDRGtCLGFBQU8sQ0FBQyw2Q0FBRCxFQUFnRHhELFNBQWhELENBQVA7QUFDSDs7QUFFRCxXQUFPNkQsRUFBUDtBQUNELEdBMURELENBMERFLE9BQU9XLFNBQVAsRUFBa0I7QUFDbEIsVUFBTSxJQUFJL0ksTUFBTSxDQUFDOEIsS0FBWCxDQUFpQix5Q0FBakIsRUFBNERpSCxTQUE1RCxDQUFOO0FBQ0Q7QUFDRixDQTlERDs7QUEvQkE5SSxNQUFNLENBQUMrSSxhQUFQLENBK0ZlaUYsZ0JBL0ZmLEU7Ozs7Ozs7Ozs7O0FDQUEsSUFBSWpPLE1BQUo7QUFBV0MsTUFBTSxDQUFDQyxJQUFQLENBQVksZUFBWixFQUE0QjtBQUFDRixRQUFNLENBQUNHLENBQUQsRUFBRztBQUFDSCxVQUFNLEdBQUNHLENBQVA7QUFBUzs7QUFBcEIsQ0FBNUIsRUFBa0QsQ0FBbEQ7QUFBcUQsSUFBSXdPLGNBQUosRUFBbUJDLFFBQW5CLEVBQTRCQyxpQkFBNUI7QUFBOEM1TyxNQUFNLENBQUNDLElBQVAsQ0FBWSxvQ0FBWixFQUFpRDtBQUFDeU8sZ0JBQWMsQ0FBQ3hPLENBQUQsRUFBRztBQUFDd08sa0JBQWMsR0FBQ3hPLENBQWY7QUFBaUIsR0FBcEM7O0FBQXFDeU8sVUFBUSxDQUFDek8sQ0FBRCxFQUFHO0FBQUN5TyxZQUFRLEdBQUN6TyxDQUFUO0FBQVcsR0FBNUQ7O0FBQTZEME8sbUJBQWlCLENBQUMxTyxDQUFELEVBQUc7QUFBQzBPLHFCQUFpQixHQUFDMU8sQ0FBbEI7QUFBb0I7O0FBQXRHLENBQWpELEVBQXlKLENBQXpKO0FBQTRKLElBQUltSixjQUFKLEVBQW1CQyxlQUFuQjtBQUFtQ3RKLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLG1EQUFaLEVBQWdFO0FBQUNvSixnQkFBYyxDQUFDbkosQ0FBRCxFQUFHO0FBQUNtSixrQkFBYyxHQUFDbkosQ0FBZjtBQUFpQixHQUFwQzs7QUFBcUNvSixpQkFBZSxDQUFDcEosQ0FBRCxFQUFHO0FBQUNvSixtQkFBZSxHQUFDcEosQ0FBaEI7QUFBa0I7O0FBQTFFLENBQWhFLEVBQTRJLENBQTVJO0FBQStJLElBQUk4TixnQkFBSjtBQUFxQmhPLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLCtCQUFaLEVBQTRDO0FBQUNtQixTQUFPLENBQUNsQixDQUFELEVBQUc7QUFBQzhOLG9CQUFnQixHQUFDOU4sQ0FBakI7QUFBbUI7O0FBQS9CLENBQTVDLEVBQTZFLENBQTdFO0FBQWdGLElBQUlvSCxJQUFKO0FBQVN0SCxNQUFNLENBQUNDLElBQVAsQ0FBWSwyQkFBWixFQUF3QztBQUFDcUgsTUFBSSxDQUFDcEgsQ0FBRCxFQUFHO0FBQUNvSCxRQUFJLEdBQUNwSCxDQUFMO0FBQU87O0FBQWhCLENBQXhDLEVBQTBELENBQTFEO0FBQTZELElBQUkyTyxlQUFKO0FBQW9CN08sTUFBTSxDQUFDQyxJQUFQLENBQVksd0JBQVosRUFBcUM7QUFBQ21CLFNBQU8sQ0FBQ2xCLENBQUQsRUFBRztBQUFDMk8sbUJBQWUsR0FBQzNPLENBQWhCO0FBQWtCOztBQUE5QixDQUFyQyxFQUFxRSxDQUFyRTtBQUF3RSxJQUFJMkosVUFBSjtBQUFlN0osTUFBTSxDQUFDQyxJQUFQLENBQVksMkNBQVosRUFBd0Q7QUFBQzRKLFlBQVUsQ0FBQzNKLENBQUQsRUFBRztBQUFDMkosY0FBVSxHQUFDM0osQ0FBWDtBQUFhOztBQUE1QixDQUF4RCxFQUFzRixDQUF0RjtBQVFsdEIsTUFBTTRPLGFBQWEsR0FBRyxJQUF0QjtBQUNBLE1BQU1DLHNCQUFzQixHQUFHLGtCQUEvQjs7QUFFQSxNQUFNQyxtQkFBbUIsR0FBRyxDQUFDQyxJQUFELEVBQU9DLEdBQVAsS0FBZTtBQUN6QyxNQUFJO0FBRUEsUUFBRyxDQUFDRCxJQUFKLEVBQVM7QUFDTHBGLGdCQUFVLENBQUMsd0hBQUQsRUFBMEhQLGVBQTFILENBQVY7O0FBRUEsVUFBSTtBQUNBLFlBQUk2RixnQkFBZ0IsR0FBRzdILElBQUksQ0FBQ29ELE9BQUwsQ0FBYTtBQUFDakQsYUFBRyxFQUFFc0g7QUFBTixTQUFiLENBQXZCO0FBQ0EsWUFBR0ksZ0JBQWdCLEtBQUszRyxTQUF4QixFQUFtQzJHLGdCQUFnQixHQUFHQSxnQkFBZ0IsQ0FBQ3ZJLEtBQXBDO0FBQ25DaUQsa0JBQVUsQ0FBQyxrQkFBRCxFQUFvQnNGLGdCQUFwQixDQUFWO0FBQ0EsY0FBTUMsR0FBRyxHQUFHVixjQUFjLENBQUNyRixjQUFELEVBQWlCOEYsZ0JBQWpCLENBQTFCO0FBQ0EsWUFBR0MsR0FBRyxLQUFLNUcsU0FBUixJQUFxQjRHLEdBQUcsQ0FBQ0MsWUFBSixLQUFxQjdHLFNBQTdDLEVBQXdEO0FBRXhELGNBQU04RyxHQUFHLEdBQUdGLEdBQUcsQ0FBQ0MsWUFBaEI7QUFDQUYsd0JBQWdCLEdBQUdDLEdBQUcsQ0FBQ0csU0FBdkI7O0FBQ0EsWUFBRyxDQUFDSCxHQUFELElBQVEsQ0FBQ0UsR0FBVCxJQUFnQixDQUFDQSxHQUFHLENBQUNwRCxNQUFMLEtBQWMsQ0FBakMsRUFBbUM7QUFDL0JyQyxvQkFBVSxDQUFDLGtGQUFELEVBQXFGc0YsZ0JBQXJGLENBQVY7QUFDQU4seUJBQWUsQ0FBQztBQUFDcEgsZUFBRyxFQUFFc0gsc0JBQU47QUFBOEJuSSxpQkFBSyxFQUFFdUk7QUFBckMsV0FBRCxDQUFmO0FBQ0E7QUFDSDs7QUFFRHRGLGtCQUFVLENBQUMsZ0JBQUQsRUFBa0J1RixHQUFsQixDQUFWO0FBRUEsY0FBTUksVUFBVSxHQUFHRixHQUFHLENBQUNHLE1BQUosQ0FBV0MsRUFBRSxJQUM1QkEsRUFBRSxDQUFDN0ksT0FBSCxLQUFleUMsZUFBZixJQUNHb0csRUFBRSxDQUFDcE8sSUFBSCxLQUFZa0gsU0FEZixDQUN5QjtBQUR6QixXQUVHa0gsRUFBRSxDQUFDcE8sSUFBSCxDQUFRcU8sVUFBUixDQUFtQixVQUFRYixhQUEzQixDQUhZLENBRytCO0FBSC9CLFNBQW5CO0FBS0FVLGtCQUFVLENBQUN6SixPQUFYLENBQW1CMkosRUFBRSxJQUFJO0FBQ3JCN0Ysb0JBQVUsQ0FBQyxLQUFELEVBQU82RixFQUFQLENBQVY7QUFDQSxjQUFJRSxNQUFNLEdBQUdGLEVBQUUsQ0FBQ3BPLElBQUgsQ0FBUWlOLFNBQVIsQ0FBa0IsQ0FBQyxVQUFRTyxhQUFULEVBQXdCNUMsTUFBMUMsQ0FBYjtBQUNBckMsb0JBQVUsQ0FBQyxxREFBRCxFQUF3RCtGLE1BQXhELENBQVY7QUFDQSxnQkFBTTFCLEdBQUcsR0FBR1MsUUFBUSxDQUFDdEYsY0FBRCxFQUFpQnVHLE1BQWpCLENBQXBCO0FBQ0EvRixvQkFBVSxDQUFDLGlCQUFELEVBQW1CcUUsR0FBbkIsQ0FBVjs7QUFDQSxjQUFHLENBQUNBLEdBQUosRUFBUTtBQUNKckUsc0JBQVUsQ0FBQyxxRUFBRCxFQUF3RXFFLEdBQXhFLENBQVY7QUFDQTtBQUNIOztBQUNEMkIsZUFBSyxDQUFDRCxNQUFELEVBQVMxQixHQUFHLENBQUN0SCxLQUFiLEVBQW1COEksRUFBRSxDQUFDN0ksT0FBdEIsRUFBOEI2SSxFQUFFLENBQUNULElBQWpDLENBQUwsQ0FWcUIsQ0FVd0I7QUFDaEQsU0FYRDtBQVlBSix1QkFBZSxDQUFDO0FBQUNwSCxhQUFHLEVBQUVzSCxzQkFBTjtBQUE4Qm5JLGVBQUssRUFBRXVJO0FBQXJDLFNBQUQsQ0FBZjtBQUNBdEYsa0JBQVUsQ0FBQywwQ0FBRCxFQUE0Q3NGLGdCQUE1QyxDQUFWO0FBQ0FELFdBQUcsQ0FBQ1ksSUFBSjtBQUNILE9BckNELENBcUNFLE9BQU1oSCxTQUFOLEVBQWlCO0FBQ2YsY0FBTSxJQUFJL0ksTUFBTSxDQUFDOEIsS0FBWCxDQUFpQix5Q0FBakIsRUFBNERpSCxTQUE1RCxDQUFOO0FBQ0g7QUFFSixLQTVDRCxNQTRDSztBQUNEZSxnQkFBVSxDQUFDLFdBQVNvRixJQUFULEdBQWMsNkNBQWYsRUFBNkQzRixlQUE3RCxDQUFWO0FBRUEsWUFBTThGLEdBQUcsR0FBR1IsaUJBQWlCLENBQUN2RixjQUFELEVBQWlCNEYsSUFBakIsQ0FBN0I7QUFDQSxZQUFNSyxHQUFHLEdBQUdGLEdBQUcsQ0FBQ1csSUFBaEI7O0FBRUEsVUFBRyxDQUFDWCxHQUFELElBQVEsQ0FBQ0UsR0FBVCxJQUFnQixDQUFDQSxHQUFHLENBQUNwRCxNQUFMLEtBQWMsQ0FBakMsRUFBbUM7QUFDL0JyQyxrQkFBVSxDQUFDLFVBQVFvRixJQUFSLEdBQWEsaUVBQWQsQ0FBVjtBQUNBO0FBQ0gsT0FUQSxDQVVGOzs7QUFFQyxZQUFNTyxVQUFVLEdBQUdGLEdBQUcsQ0FBQ0csTUFBSixDQUFXQyxFQUFFLElBQzVCQSxFQUFFLENBQUNNLFlBQUgsS0FBb0J4SCxTQUFwQixJQUNHa0gsRUFBRSxDQUFDTSxZQUFILENBQWdCQyxNQUFoQixLQUEyQnpILFNBRDlCLElBRUdrSCxFQUFFLENBQUNNLFlBQUgsQ0FBZ0JDLE1BQWhCLENBQXVCQyxFQUF2QixLQUE4QixVQUZqQyxDQUdGO0FBSEUsU0FJR1IsRUFBRSxDQUFDTSxZQUFILENBQWdCQyxNQUFoQixDQUF1QjNPLElBQXZCLEtBQWdDa0gsU0FKbkMsSUFLR2tILEVBQUUsQ0FBQ00sWUFBSCxDQUFnQkMsTUFBaEIsQ0FBdUIzTyxJQUF2QixDQUE0QnFPLFVBQTVCLENBQXVDYixhQUF2QyxDQU5ZLENBQW5CLENBWkMsQ0FxQkQ7O0FBQ0FVLGdCQUFVLENBQUN6SixPQUFYLENBQW1CMkosRUFBRSxJQUFJO0FBQ3JCRyxhQUFLLENBQUNILEVBQUUsQ0FBQ00sWUFBSCxDQUFnQkMsTUFBaEIsQ0FBdUIzTyxJQUF4QixFQUE4Qm9PLEVBQUUsQ0FBQ00sWUFBSCxDQUFnQkMsTUFBaEIsQ0FBdUJySixLQUFyRCxFQUEyRDhJLEVBQUUsQ0FBQ00sWUFBSCxDQUFnQkcsU0FBaEIsQ0FBMEIsQ0FBMUIsQ0FBM0QsRUFBd0ZsQixJQUF4RixDQUFMO0FBQ0gsT0FGRDtBQUdIO0FBQ0osR0F4RUQsQ0F3RUUsT0FBTW5HLFNBQU4sRUFBaUI7QUFDakIsVUFBTSxJQUFJL0ksTUFBTSxDQUFDOEIsS0FBWCxDQUFpQix5Q0FBakIsRUFBNERpSCxTQUE1RCxDQUFOO0FBQ0Q7O0FBQ0QsU0FBTyxJQUFQO0FBQ0QsQ0E3RUQ7O0FBZ0ZBLFNBQVMrRyxLQUFULENBQWV2TyxJQUFmLEVBQXFCc0YsS0FBckIsRUFBNEJDLE9BQTVCLEVBQXFDb0ksSUFBckMsRUFBMkM7QUFDdkMsUUFBTVcsTUFBTSxHQUFHdE8sSUFBSSxDQUFDaU4sU0FBTCxDQUFlTyxhQUFhLENBQUM1QyxNQUE3QixDQUFmO0FBRUE4QixrQkFBZ0IsQ0FBQztBQUNiMU0sUUFBSSxFQUFFc08sTUFETztBQUViaEosU0FBSyxFQUFFQSxLQUZNO0FBR2JDLFdBQU8sRUFBRUEsT0FISTtBQUlieEMsUUFBSSxFQUFFNEs7QUFKTyxHQUFELENBQWhCO0FBTUg7O0FBcEdEalAsTUFBTSxDQUFDK0ksYUFBUCxDQXNHZWlHLG1CQXRHZixFOzs7Ozs7Ozs7OztBQ0FBLElBQUlqUCxNQUFKO0FBQVdDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGVBQVosRUFBNEI7QUFBQ0YsUUFBTSxDQUFDRyxDQUFELEVBQUc7QUFBQ0gsVUFBTSxHQUFDRyxDQUFQO0FBQVM7O0FBQXBCLENBQTVCLEVBQWtELENBQWxEO0FBQXFELElBQUlzQyxZQUFKO0FBQWlCeEMsTUFBTSxDQUFDQyxJQUFQLENBQVksY0FBWixFQUEyQjtBQUFDbUIsU0FBTyxDQUFDbEIsQ0FBRCxFQUFHO0FBQUNzQyxnQkFBWSxHQUFDdEMsQ0FBYjtBQUFlOztBQUEzQixDQUEzQixFQUF3RCxDQUF4RDtBQUEyRCxJQUFJa1EsTUFBSjtBQUFXcFEsTUFBTSxDQUFDQyxJQUFQLENBQVksUUFBWixFQUFxQjtBQUFDbUIsU0FBTyxDQUFDbEIsQ0FBRCxFQUFHO0FBQUNrUSxVQUFNLEdBQUNsUSxDQUFQO0FBQVM7O0FBQXJCLENBQXJCLEVBQTRDLENBQTVDO0FBQStDLElBQUltUSxLQUFKO0FBQVVyUSxNQUFNLENBQUNDLElBQVAsQ0FBWSxnQkFBWixFQUE2QjtBQUFDbUIsU0FBTyxDQUFDbEIsQ0FBRCxFQUFHO0FBQUNtUSxTQUFLLEdBQUNuUSxDQUFOO0FBQVE7O0FBQXBCLENBQTdCLEVBQW1ELENBQW5EO0FBS2hOLE1BQU1vUSxvQkFBb0IsR0FBRyxJQUFJOU4sWUFBSixDQUFpQjtBQUM1QzhELFlBQVUsRUFBRTtBQUNWM0MsUUFBSSxFQUFFQztBQURJLEdBRGdDO0FBSTVDd0gsU0FBTyxFQUFFO0FBQ1B6SCxRQUFJLEVBQUVDO0FBREM7QUFKbUMsQ0FBakIsQ0FBN0I7O0FBU0EsTUFBTWtLLGNBQWMsR0FBSW5NLElBQUQsSUFBVTtBQUMvQixNQUFJO0FBQ0YsVUFBTTZGLE9BQU8sR0FBRzdGLElBQWhCO0FBQ0EyTyx3QkFBb0IsQ0FBQy9PLFFBQXJCLENBQThCaUcsT0FBOUI7QUFDQSxVQUFNbEIsVUFBVSxHQUFHaUssTUFBTSxDQUFDaEwsSUFBUCxDQUFZaUMsT0FBTyxDQUFDbEIsVUFBcEIsRUFBZ0MsS0FBaEMsQ0FBbkI7QUFDQSxVQUFNa0ssSUFBSSxHQUFHSixNQUFNLENBQUNLLFVBQVAsQ0FBa0IsV0FBbEIsQ0FBYjtBQUNBRCxRQUFJLENBQUNFLGFBQUwsQ0FBbUJwSyxVQUFuQjtBQUNBLFVBQU04RSxPQUFPLEdBQUdtRixNQUFNLENBQUNoTCxJQUFQLENBQVlpQyxPQUFPLENBQUM0RCxPQUFwQixFQUE2QixLQUE3QixDQUFoQjtBQUNBLFdBQU9pRixLQUFLLENBQUNNLE9BQU4sQ0FBY0gsSUFBZCxFQUFvQnBGLE9BQXBCLEVBQTZCd0YsUUFBN0IsQ0FBc0MsTUFBdEMsQ0FBUDtBQUNELEdBUkQsQ0FRRSxPQUFNOUgsU0FBTixFQUFpQjtBQUNqQixVQUFNLElBQUkvSSxNQUFNLENBQUM4QixLQUFYLENBQWlCLG1DQUFqQixFQUFzRGlILFNBQXRELENBQU47QUFDRDtBQUNGLENBWkQ7O0FBZEE5SSxNQUFNLENBQUMrSSxhQUFQLENBNEJlK0UsY0E1QmYsRTs7Ozs7Ozs7Ozs7QUNBQSxJQUFJL04sTUFBSjtBQUFXQyxNQUFNLENBQUNDLElBQVAsQ0FBWSxlQUFaLEVBQTRCO0FBQUNGLFFBQU0sQ0FBQ0csQ0FBRCxFQUFHO0FBQUNILFVBQU0sR0FBQ0csQ0FBUDtBQUFTOztBQUFwQixDQUE1QixFQUFrRCxDQUFsRDtBQUFxRCxJQUFJc0MsWUFBSjtBQUFpQnhDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGNBQVosRUFBMkI7QUFBQ21CLFNBQU8sQ0FBQ2xCLENBQUQsRUFBRztBQUFDc0MsZ0JBQVksR0FBQ3RDLENBQWI7QUFBZTs7QUFBM0IsQ0FBM0IsRUFBd0QsQ0FBeEQ7QUFBMkQsSUFBSW1RLEtBQUo7QUFBVXJRLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGdCQUFaLEVBQTZCO0FBQUNtQixTQUFPLENBQUNsQixDQUFELEVBQUc7QUFBQ21RLFNBQUssR0FBQ25RLENBQU47QUFBUTs7QUFBcEIsQ0FBN0IsRUFBbUQsQ0FBbkQ7QUFJdEosTUFBTTJRLG9CQUFvQixHQUFHLElBQUlyTyxZQUFKLENBQWlCO0FBQzVDZ0UsV0FBUyxFQUFFO0FBQ1Q3QyxRQUFJLEVBQUVDO0FBREcsR0FEaUM7QUFJNUN3SCxTQUFPLEVBQUU7QUFDUHpILFFBQUksRUFBRUM7QUFEQztBQUptQyxDQUFqQixDQUE3Qjs7QUFTQSxNQUFNa04sY0FBYyxHQUFJblAsSUFBRCxJQUFVO0FBQy9CLE1BQUk7QUFDRixVQUFNNkYsT0FBTyxHQUFHN0YsSUFBaEI7QUFDQWtQLHdCQUFvQixDQUFDdFAsUUFBckIsQ0FBOEJpRyxPQUE5QjtBQUNBLFVBQU1oQixTQUFTLEdBQUcrSixNQUFNLENBQUNoTCxJQUFQLENBQVlpQyxPQUFPLENBQUNoQixTQUFwQixFQUErQixLQUEvQixDQUFsQjtBQUNBLFVBQU00RSxPQUFPLEdBQUdtRixNQUFNLENBQUNoTCxJQUFQLENBQVlpQyxPQUFPLENBQUM0RCxPQUFwQixDQUFoQjtBQUNBLFdBQU9pRixLQUFLLENBQUNVLE9BQU4sQ0FBY3ZLLFNBQWQsRUFBeUI0RSxPQUF6QixFQUFrQ3dGLFFBQWxDLENBQTJDLEtBQTNDLENBQVA7QUFDRCxHQU5ELENBTUUsT0FBTTlILFNBQU4sRUFBaUI7QUFDakIsVUFBTSxJQUFJL0ksTUFBTSxDQUFDOEIsS0FBWCxDQUFpQixtQ0FBakIsRUFBc0RpSCxTQUF0RCxDQUFOO0FBQ0Q7QUFDRixDQVZEOztBQWJBOUksTUFBTSxDQUFDK0ksYUFBUCxDQXlCZStILGNBekJmLEU7Ozs7Ozs7Ozs7O0FDQUEsSUFBSS9RLE1BQUo7QUFBV0MsTUFBTSxDQUFDQyxJQUFQLENBQVksZUFBWixFQUE0QjtBQUFDRixRQUFNLENBQUNHLENBQUQsRUFBRztBQUFDSCxVQUFNLEdBQUNHLENBQVA7QUFBUzs7QUFBcEIsQ0FBNUIsRUFBa0QsQ0FBbEQ7QUFBcUQsSUFBSXNDLFlBQUo7QUFBaUJ4QyxNQUFNLENBQUNDLElBQVAsQ0FBWSxjQUFaLEVBQTJCO0FBQUNtQixTQUFPLENBQUNsQixDQUFELEVBQUc7QUFBQ3NDLGdCQUFZLEdBQUN0QyxDQUFiO0FBQWU7O0FBQTNCLENBQTNCLEVBQXdELENBQXhEO0FBQTJELElBQUlFLE1BQUo7QUFBV0osTUFBTSxDQUFDQyxJQUFQLENBQVksaUNBQVosRUFBOEM7QUFBQ0csUUFBTSxDQUFDRixDQUFELEVBQUc7QUFBQ0UsVUFBTSxHQUFDRixDQUFQO0FBQVM7O0FBQXBCLENBQTlDLEVBQW9FLENBQXBFO0FBQXVFLElBQUk4RyxVQUFKO0FBQWVoSCxNQUFNLENBQUNDLElBQVAsQ0FBWSxtQkFBWixFQUFnQztBQUFDbUIsU0FBTyxDQUFDbEIsQ0FBRCxFQUFHO0FBQUM4RyxjQUFVLEdBQUM5RyxDQUFYO0FBQWE7O0FBQXpCLENBQWhDLEVBQTJELENBQTNEO0FBQThELElBQUk0SCxPQUFKO0FBQVk5SCxNQUFNLENBQUNDLElBQVAsQ0FBWSwyQ0FBWixFQUF3RDtBQUFDNkgsU0FBTyxDQUFDNUgsQ0FBRCxFQUFHO0FBQUM0SCxXQUFPLEdBQUM1SCxDQUFSO0FBQVU7O0FBQXRCLENBQXhELEVBQWdGLENBQWhGO0FBTXZULE1BQU04USxvQkFBb0IsR0FBRyxJQUFJeE8sWUFBSixDQUFpQjtBQUM1QzJGLElBQUUsRUFBRTtBQUNGeEUsUUFBSSxFQUFFQztBQURKLEdBRHdDO0FBSTVDVSxXQUFTLEVBQUU7QUFDUFgsUUFBSSxFQUFFQyxNQURDO0FBRVBJLFlBQVEsRUFBRTtBQUZILEdBSmlDO0FBUTVDRSxPQUFLLEVBQUU7QUFDSFAsUUFBSSxFQUFFbkIsWUFBWSxDQUFDMkIsT0FEaEI7QUFFSEgsWUFBUSxFQUFFO0FBRlA7QUFScUMsQ0FBakIsQ0FBN0I7O0FBY0EsTUFBTWlOLGNBQWMsR0FBSWxQLEtBQUQsSUFBVztBQUNoQyxNQUFJO0FBQ0YsVUFBTWMsUUFBUSxHQUFHZCxLQUFqQjtBQUNBaVAsd0JBQW9CLENBQUN6UCxRQUFyQixDQUE4QnNCLFFBQTlCO0FBQ0EsUUFBSXVCLE1BQUo7O0FBQ0EsUUFBR3JDLEtBQUssQ0FBQ3VDLFNBQVQsRUFBbUI7QUFDZkYsWUFBTSxHQUFHdkIsUUFBUSxDQUFDeUIsU0FBVCxHQUFtQixHQUFuQixHQUF1QnpCLFFBQVEsQ0FBQ3FCLEtBQXpDO0FBQ0E0RCxhQUFPLENBQUMscUNBQW1DL0YsS0FBSyxDQUFDbUMsS0FBekMsR0FBK0MsVUFBaEQsRUFBMkRFLE1BQTNELENBQVA7QUFDSCxLQUhELE1BSUk7QUFDQUEsWUFBTSxHQUFHNEMsVUFBVSxHQUFHVixVQUF0QjtBQUNBd0IsYUFBTyxDQUFDLHdDQUFELEVBQTBDMUQsTUFBMUMsQ0FBUDtBQUNIOztBQUVEaEUsVUFBTSxDQUFDZ0QsTUFBUCxDQUFjO0FBQUNNLFNBQUcsRUFBR2IsUUFBUSxDQUFDc0Y7QUFBaEIsS0FBZCxFQUFtQztBQUFDK0ksVUFBSSxFQUFDO0FBQUM5TSxjQUFNLEVBQUVBO0FBQVQ7QUFBTixLQUFuQztBQUVBLFdBQU9BLE1BQVA7QUFDRCxHQWhCRCxDQWdCRSxPQUFNMEUsU0FBTixFQUFpQjtBQUNqQixVQUFNLElBQUkvSSxNQUFNLENBQUM4QixLQUFYLENBQWlCLG1DQUFqQixFQUFzRGlILFNBQXRELENBQU47QUFDRDtBQUNGLENBcEJEOztBQXBCQTlJLE1BQU0sQ0FBQytJLGFBQVAsQ0EwQ2VrSSxjQTFDZixFOzs7Ozs7Ozs7OztBQ0FBLElBQUlsUixNQUFKO0FBQVdDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGVBQVosRUFBNEI7QUFBQ0YsUUFBTSxDQUFDRyxDQUFELEVBQUc7QUFBQ0gsVUFBTSxHQUFDRyxDQUFQO0FBQVM7O0FBQXBCLENBQTVCLEVBQWtELENBQWxEO0FBQXFELElBQUlzQyxZQUFKO0FBQWlCeEMsTUFBTSxDQUFDQyxJQUFQLENBQVksY0FBWixFQUEyQjtBQUFDbUIsU0FBTyxDQUFDbEIsQ0FBRCxFQUFHO0FBQUNzQyxnQkFBWSxHQUFDdEMsQ0FBYjtBQUFlOztBQUEzQixDQUEzQixFQUF3RCxDQUF4RDtBQUEyRCxJQUFJaVIsUUFBSjtBQUFhblIsTUFBTSxDQUFDQyxJQUFQLENBQVksV0FBWixFQUF3QjtBQUFDbUIsU0FBTyxDQUFDbEIsQ0FBRCxFQUFHO0FBQUNpUixZQUFRLEdBQUNqUixDQUFUO0FBQVc7O0FBQXZCLENBQXhCLEVBQWlELENBQWpEO0FBQW9ELElBQUlrUixNQUFKO0FBQVdwUixNQUFNLENBQUNDLElBQVAsQ0FBWSxNQUFaLEVBQW1CO0FBQUNtQixTQUFPLENBQUNsQixDQUFELEVBQUc7QUFBQ2tSLFVBQU0sR0FBQ2xSLENBQVA7QUFBUzs7QUFBckIsQ0FBbkIsRUFBMEMsQ0FBMUM7QUFBNkMsSUFBSTJNLFNBQUo7QUFBYzdNLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLCtDQUFaLEVBQTREO0FBQUM0TSxXQUFTLENBQUMzTSxDQUFELEVBQUc7QUFBQzJNLGFBQVMsR0FBQzNNLENBQVY7QUFBWTs7QUFBMUIsQ0FBNUQsRUFBd0YsQ0FBeEY7QUFBMkYsSUFBSTRNLFNBQUo7QUFBYzlNLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLDRDQUFaLEVBQXlEO0FBQUM2TSxXQUFTLENBQUM1TSxDQUFELEVBQUc7QUFBQzRNLGFBQVMsR0FBQzVNLENBQVY7QUFBWTs7QUFBMUIsQ0FBekQsRUFBcUYsQ0FBckY7QUFPNVgsTUFBTW1SLFlBQVksR0FBRyxJQUFyQjtBQUNBLE1BQU1DLG9CQUFvQixHQUFHLElBQTdCO0FBQ0EsTUFBTUMsZ0JBQWdCLEdBQUcsSUFBSS9PLFlBQUosQ0FBaUI7QUFDeENnRSxXQUFTLEVBQUU7QUFDVDdDLFFBQUksRUFBRUM7QUFERztBQUQ2QixDQUFqQixDQUF6Qjs7QUFNQSxNQUFNNE4sVUFBVSxHQUFJN1AsSUFBRCxJQUFVO0FBQzNCLE1BQUk7QUFDRixVQUFNNkYsT0FBTyxHQUFHN0YsSUFBaEI7QUFDQTRQLG9CQUFnQixDQUFDaFEsUUFBakIsQ0FBMEJpRyxPQUExQjtBQUNBLFdBQU9pSyxXQUFXLENBQUNqSyxPQUFPLENBQUNoQixTQUFULENBQWxCO0FBQ0QsR0FKRCxDQUlFLE9BQU1zQyxTQUFOLEVBQWlCO0FBQ2pCLFVBQU0sSUFBSS9JLE1BQU0sQ0FBQzhCLEtBQVgsQ0FBaUIsK0JBQWpCLEVBQWtEaUgsU0FBbEQsQ0FBTjtBQUNEO0FBQ0YsQ0FSRDs7QUFVQSxTQUFTMkksV0FBVCxDQUFxQmpMLFNBQXJCLEVBQWdDO0FBQzlCLFFBQU1rTCxNQUFNLEdBQUdQLFFBQVEsQ0FBQ1EsR0FBVCxDQUFhQyxTQUFiLENBQXVCQyxNQUF2QixDQUE4QnRCLE1BQU0sQ0FBQ2hMLElBQVAsQ0FBWWlCLFNBQVosRUFBdUIsS0FBdkIsQ0FBOUIsQ0FBZjtBQUNBLE1BQUlpQixHQUFHLEdBQUcwSixRQUFRLENBQUNXLE1BQVQsQ0FBZ0JKLE1BQWhCLENBQVY7QUFDQWpLLEtBQUcsR0FBRzBKLFFBQVEsQ0FBQ1ksU0FBVCxDQUFtQnRLLEdBQW5CLENBQU47QUFDQSxNQUFJdUssV0FBVyxHQUFHWCxZQUFsQjtBQUNBLE1BQUd4RSxTQUFTLE1BQU1DLFNBQVMsRUFBM0IsRUFBK0JrRixXQUFXLEdBQUdWLG9CQUFkO0FBQy9CLE1BQUl6SyxPQUFPLEdBQUcwSixNQUFNLENBQUM5SCxNQUFQLENBQWMsQ0FBQzhILE1BQU0sQ0FBQ2hMLElBQVAsQ0FBWSxDQUFDeU0sV0FBRCxDQUFaLENBQUQsRUFBNkJ6QixNQUFNLENBQUNoTCxJQUFQLENBQVlrQyxHQUFHLENBQUNtSixRQUFKLEVBQVosRUFBNEIsS0FBNUIsQ0FBN0IsQ0FBZCxDQUFkO0FBQ0FuSixLQUFHLEdBQUcwSixRQUFRLENBQUNXLE1BQVQsQ0FBZ0JYLFFBQVEsQ0FBQ1EsR0FBVCxDQUFhQyxTQUFiLENBQXVCQyxNQUF2QixDQUE4QmhMLE9BQTlCLENBQWhCLENBQU47QUFDQVksS0FBRyxHQUFHMEosUUFBUSxDQUFDVyxNQUFULENBQWdCckssR0FBaEIsQ0FBTjtBQUNBLE1BQUl3SyxRQUFRLEdBQUd4SyxHQUFHLENBQUNtSixRQUFKLEdBQWVyQyxTQUFmLENBQXlCLENBQXpCLEVBQTRCLENBQTVCLENBQWY7QUFDQTFILFNBQU8sR0FBRyxJQUFJMEosTUFBSixDQUFXMUosT0FBTyxDQUFDK0osUUFBUixDQUFpQixLQUFqQixJQUF3QnFCLFFBQW5DLEVBQTRDLEtBQTVDLENBQVY7QUFDQXBMLFNBQU8sR0FBR3VLLE1BQU0sQ0FBQ2MsTUFBUCxDQUFjckwsT0FBZCxDQUFWO0FBQ0EsU0FBT0EsT0FBUDtBQUNEOztBQXRDRDdHLE1BQU0sQ0FBQytJLGFBQVAsQ0F3Q2V5SSxVQXhDZixFOzs7Ozs7Ozs7OztBQ0FBLElBQUl6UixNQUFKO0FBQVdDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGVBQVosRUFBNEI7QUFBQ0YsUUFBTSxDQUFDRyxDQUFELEVBQUc7QUFBQ0gsVUFBTSxHQUFDRyxDQUFQO0FBQVM7O0FBQXBCLENBQTVCLEVBQWtELENBQWxEO0FBQXFELElBQUkrRyxVQUFKO0FBQWVqSCxNQUFNLENBQUNDLElBQVAsQ0FBWSxvQ0FBWixFQUFpRDtBQUFDZ0gsWUFBVSxDQUFDL0csQ0FBRCxFQUFHO0FBQUMrRyxjQUFVLEdBQUMvRyxDQUFYO0FBQWE7O0FBQTVCLENBQWpELEVBQStFLENBQS9FO0FBQWtGLElBQUltSixjQUFKO0FBQW1CckosTUFBTSxDQUFDQyxJQUFQLENBQVksbURBQVosRUFBZ0U7QUFBQ29KLGdCQUFjLENBQUNuSixDQUFELEVBQUc7QUFBQ21KLGtCQUFjLEdBQUNuSixDQUFmO0FBQWlCOztBQUFwQyxDQUFoRSxFQUFzRyxDQUF0Rzs7QUFLcEwsTUFBTWlTLFdBQVcsR0FBRyxNQUFNO0FBRXhCLE1BQUk7QUFDRixVQUFNQyxHQUFHLEdBQUNuTCxVQUFVLENBQUNvQyxjQUFELENBQXBCO0FBQ0EsV0FBTytJLEdBQVA7QUFFRCxHQUpELENBSUUsT0FBTXRKLFNBQU4sRUFBaUI7QUFDakIsVUFBTSxJQUFJL0ksTUFBTSxDQUFDOEIsS0FBWCxDQUFpQiwrQkFBakIsRUFBa0RpSCxTQUFsRCxDQUFOO0FBQ0Q7O0FBQ0QsU0FBTyxJQUFQO0FBQ0QsQ0FWRDs7QUFMQTlJLE1BQU0sQ0FBQytJLGFBQVAsQ0FpQmVvSixXQWpCZixFOzs7Ozs7Ozs7OztBQ0FBLElBQUlwUyxNQUFKO0FBQVdDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGVBQVosRUFBNEI7QUFBQ0YsUUFBTSxDQUFDRyxDQUFELEVBQUc7QUFBQ0gsVUFBTSxHQUFDRyxDQUFQO0FBQVM7O0FBQXBCLENBQTVCLEVBQWtELENBQWxEO0FBQXFELElBQUlpUixRQUFKO0FBQWFuUixNQUFNLENBQUNDLElBQVAsQ0FBWSxXQUFaLEVBQXdCO0FBQUNtQixTQUFPLENBQUNsQixDQUFELEVBQUc7QUFBQ2lSLFlBQVEsR0FBQ2pSLENBQVQ7QUFBVzs7QUFBdkIsQ0FBeEIsRUFBaUQsQ0FBakQ7QUFBb0QsSUFBSXNDLFlBQUo7QUFBaUJ4QyxNQUFNLENBQUNDLElBQVAsQ0FBWSxjQUFaLEVBQTJCO0FBQUNtQixTQUFPLENBQUNsQixDQUFELEVBQUc7QUFBQ3NDLGdCQUFZLEdBQUN0QyxDQUFiO0FBQWU7O0FBQTNCLENBQTNCLEVBQXdELENBQXhEO0FBSWxKLE1BQU1tUyxpQkFBaUIsR0FBRyxJQUFJN1AsWUFBSixDQUFpQjtBQUN6Q2IsTUFBSSxFQUFFO0FBQ0pnQyxRQUFJLEVBQUVDO0FBREY7QUFEbUMsQ0FBakIsQ0FBMUI7O0FBTUEsTUFBTTBPLFdBQVcsR0FBSTNRLElBQUQsSUFBVTtBQUM1QixNQUFJO0FBQ0YsVUFBTTZGLE9BQU8sR0FBRzdGLElBQWhCO0FBQ0UwUSxxQkFBaUIsQ0FBQzlRLFFBQWxCLENBQTJCaUcsT0FBM0I7QUFDRixVQUFNK0ssSUFBSSxHQUFHcEIsUUFBUSxDQUFDVyxNQUFULENBQWdCdEssT0FBaEIsRUFBeUJvSixRQUF6QixFQUFiO0FBQ0EsV0FBTzJCLElBQVA7QUFDRCxHQUxELENBS0UsT0FBTXpKLFNBQU4sRUFBaUI7QUFDakIsVUFBTSxJQUFJL0ksTUFBTSxDQUFDOEIsS0FBWCxDQUFpQixnQ0FBakIsRUFBbURpSCxTQUFuRCxDQUFOO0FBQ0Q7QUFDRixDQVREOztBQVZBOUksTUFBTSxDQUFDK0ksYUFBUCxDQXFCZXVKLFdBckJmLEU7Ozs7Ozs7Ozs7O0FDQUEsSUFBSXZTLE1BQUo7QUFBV0MsTUFBTSxDQUFDQyxJQUFQLENBQVksZUFBWixFQUE0QjtBQUFDRixRQUFNLENBQUNHLENBQUQsRUFBRztBQUFDSCxVQUFNLEdBQUNHLENBQVA7QUFBUzs7QUFBcEIsQ0FBNUIsRUFBa0QsQ0FBbEQ7QUFBcUQsSUFBSXNTLFdBQUo7QUFBZ0J4UyxNQUFNLENBQUNDLElBQVAsQ0FBWSxRQUFaLEVBQXFCO0FBQUN1UyxhQUFXLENBQUN0UyxDQUFELEVBQUc7QUFBQ3NTLGVBQVcsR0FBQ3RTLENBQVo7QUFBYzs7QUFBOUIsQ0FBckIsRUFBcUQsQ0FBckQ7QUFBd0QsSUFBSXVTLFNBQUo7QUFBY3pTLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLFdBQVosRUFBd0I7QUFBQ21CLFNBQU8sQ0FBQ2xCLENBQUQsRUFBRztBQUFDdVMsYUFBUyxHQUFDdlMsQ0FBVjtBQUFZOztBQUF4QixDQUF4QixFQUFrRCxDQUFsRDs7QUFJdEosTUFBTThHLFVBQVUsR0FBRyxNQUFNO0FBQ3ZCLE1BQUk7QUFDRixRQUFJMEwsT0FBSjs7QUFDQSxPQUFHO0FBQUNBLGFBQU8sR0FBR0YsV0FBVyxDQUFDLEVBQUQsQ0FBckI7QUFBMEIsS0FBOUIsUUFBcUMsQ0FBQ0MsU0FBUyxDQUFDRSxnQkFBVixDQUEyQkQsT0FBM0IsQ0FBdEM7O0FBQ0EsVUFBTXBNLFVBQVUsR0FBR29NLE9BQW5CO0FBQ0EsVUFBTWxNLFNBQVMsR0FBR2lNLFNBQVMsQ0FBQ0csZUFBVixDQUEwQnRNLFVBQTFCLENBQWxCO0FBQ0EsV0FBTztBQUNMQSxnQkFBVSxFQUFFQSxVQUFVLENBQUNzSyxRQUFYLENBQW9CLEtBQXBCLEVBQTJCaUMsV0FBM0IsRUFEUDtBQUVMck0sZUFBUyxFQUFFQSxTQUFTLENBQUNvSyxRQUFWLENBQW1CLEtBQW5CLEVBQTBCaUMsV0FBMUI7QUFGTixLQUFQO0FBSUQsR0FURCxDQVNFLE9BQU0vSixTQUFOLEVBQWlCO0FBQ2pCLFVBQU0sSUFBSS9JLE1BQU0sQ0FBQzhCLEtBQVgsQ0FBaUIsK0JBQWpCLEVBQWtEaUgsU0FBbEQsQ0FBTjtBQUNEO0FBQ0YsQ0FiRDs7QUFKQTlJLE1BQU0sQ0FBQytJLGFBQVAsQ0FtQmUvQixVQW5CZixFOzs7Ozs7Ozs7OztBQ0FBLElBQUlqSCxNQUFKO0FBQVdDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGVBQVosRUFBNEI7QUFBQ0YsUUFBTSxDQUFDRyxDQUFELEVBQUc7QUFBQ0gsVUFBTSxHQUFDRyxDQUFQO0FBQVM7O0FBQXBCLENBQTVCLEVBQWtELENBQWxEO0FBQXFELElBQUlzQyxZQUFKO0FBQWlCeEMsTUFBTSxDQUFDQyxJQUFQLENBQVksY0FBWixFQUEyQjtBQUFDbUIsU0FBTyxDQUFDbEIsQ0FBRCxFQUFHO0FBQUNzQyxnQkFBWSxHQUFDdEMsQ0FBYjtBQUFlOztBQUEzQixDQUEzQixFQUF3RCxDQUF4RDtBQUEyRCxJQUFJa1IsTUFBSjtBQUFXcFIsTUFBTSxDQUFDQyxJQUFQLENBQVksTUFBWixFQUFtQjtBQUFDbUIsU0FBTyxDQUFDbEIsQ0FBRCxFQUFHO0FBQUNrUixVQUFNLEdBQUNsUixDQUFQO0FBQVM7O0FBQXJCLENBQW5CLEVBQTBDLENBQTFDO0FBSXZKLE1BQU00UywwQkFBMEIsR0FBRyxJQUFJdFEsWUFBSixDQUFpQjtBQUNsRDRMLEtBQUcsRUFBRTtBQUNIekssUUFBSSxFQUFFQztBQURIO0FBRDZDLENBQWpCLENBQW5DOztBQU1BLE1BQU1pSyxvQkFBb0IsR0FBSWxNLElBQUQsSUFBVTtBQUNyQyxNQUFJO0FBQ0YsVUFBTTZGLE9BQU8sR0FBRzdGLElBQWhCO0FBQ0FtUiw4QkFBMEIsQ0FBQ3ZSLFFBQTNCLENBQW9DaUcsT0FBcEM7QUFDQSxXQUFPdUwscUJBQXFCLENBQUN2TCxPQUFPLENBQUM0RyxHQUFULENBQTVCO0FBQ0QsR0FKRCxDQUlFLE9BQU10RixTQUFOLEVBQWlCO0FBQ2pCLFVBQU0sSUFBSS9JLE1BQU0sQ0FBQzhCLEtBQVgsQ0FBaUIseUNBQWpCLEVBQTREaUgsU0FBNUQsQ0FBTjtBQUNEO0FBQ0YsQ0FSRDs7QUFVQSxTQUFTaUsscUJBQVQsQ0FBK0IzRSxHQUEvQixFQUFvQztBQUNsQyxNQUFJOUgsVUFBVSxHQUFHOEssTUFBTSxDQUFDNEIsTUFBUCxDQUFjNUUsR0FBZCxFQUFtQndDLFFBQW5CLENBQTRCLEtBQTVCLENBQWpCO0FBQ0F0SyxZQUFVLEdBQUdBLFVBQVUsQ0FBQ2lJLFNBQVgsQ0FBcUIsQ0FBckIsRUFBd0JqSSxVQUFVLENBQUM0RixNQUFYLEdBQW9CLENBQTVDLENBQWI7O0FBQ0EsTUFBRzVGLFVBQVUsQ0FBQzRGLE1BQVgsS0FBc0IsRUFBdEIsSUFBNEI1RixVQUFVLENBQUMyTSxRQUFYLENBQW9CLElBQXBCLENBQS9CLEVBQTBEO0FBQ3hEM00sY0FBVSxHQUFHQSxVQUFVLENBQUNpSSxTQUFYLENBQXFCLENBQXJCLEVBQXdCakksVUFBVSxDQUFDNEYsTUFBWCxHQUFvQixDQUE1QyxDQUFiO0FBQ0Q7O0FBQ0QsU0FBTzVGLFVBQVA7QUFDRDs7QUEzQkR0RyxNQUFNLENBQUMrSSxhQUFQLENBNkJlOEUsb0JBN0JmLEU7Ozs7Ozs7Ozs7O0FDQUEsSUFBSXJMLFlBQUo7QUFBaUJ4QyxNQUFNLENBQUNDLElBQVAsQ0FBWSxjQUFaLEVBQTJCO0FBQUNtQixTQUFPLENBQUNsQixDQUFELEVBQUc7QUFBQ3NDLGdCQUFZLEdBQUN0QyxDQUFiO0FBQWU7O0FBQTNCLENBQTNCLEVBQXdELENBQXhEO0FBQTJELElBQUk0SCxPQUFKO0FBQVk5SCxNQUFNLENBQUNDLElBQVAsQ0FBWSwyQ0FBWixFQUF3RDtBQUFDNkgsU0FBTyxDQUFDNUgsQ0FBRCxFQUFHO0FBQUM0SCxXQUFPLEdBQUM1SCxDQUFSO0FBQVU7O0FBQXRCLENBQXhELEVBQWdGLENBQWhGO0FBQW1GLElBQUlxTCxXQUFKO0FBQWdCdkwsTUFBTSxDQUFDQyxJQUFQLENBQVksdUJBQVosRUFBb0M7QUFBQ21CLFNBQU8sQ0FBQ2xCLENBQUQsRUFBRztBQUFDcUwsZUFBVyxHQUFDckwsQ0FBWjtBQUFjOztBQUExQixDQUFwQyxFQUFnRSxDQUFoRTtBQUFtRSxJQUFJb0wsZ0JBQUo7QUFBcUJ0TCxNQUFNLENBQUNDLElBQVAsQ0FBWSw0QkFBWixFQUF5QztBQUFDbUIsU0FBTyxDQUFDbEIsQ0FBRCxFQUFHO0FBQUNvTCxvQkFBZ0IsR0FBQ3BMLENBQWpCO0FBQW1COztBQUEvQixDQUF6QyxFQUEwRSxDQUExRTtBQUE2RSxJQUFJc1IsVUFBSjtBQUFleFIsTUFBTSxDQUFDQyxJQUFQLENBQVksZUFBWixFQUE0QjtBQUFDbUIsU0FBTyxDQUFDbEIsQ0FBRCxFQUFHO0FBQUNzUixjQUFVLEdBQUN0UixDQUFYO0FBQWE7O0FBQXpCLENBQTVCLEVBQXVELENBQXZEO0FBTy9XLE1BQU1nVCxrQkFBa0IsR0FBRyxJQUFJMVEsWUFBSixDQUFpQjtBQUN4Q3dILFFBQU0sRUFBRTtBQUNKckcsUUFBSSxFQUFFQztBQURGO0FBRGdDLENBQWpCLENBQTNCOztBQU1BLE1BQU11UCxzQkFBc0IsR0FBSXhSLElBQUQsSUFBVTtBQUVyQyxRQUFNNkYsT0FBTyxHQUFHN0YsSUFBaEI7QUFDQXVSLG9CQUFrQixDQUFDM1IsUUFBbkIsQ0FBNEJpRyxPQUE1QjtBQUVBLE1BQUloQixTQUFTLEdBQUcrRSxXQUFXLENBQUM7QUFBQ3ZCLFVBQU0sRUFBRXhDLE9BQU8sQ0FBQ3dDO0FBQWpCLEdBQUQsQ0FBM0I7O0FBQ0EsTUFBRyxDQUFDeEQsU0FBSixFQUFjO0FBQ1YsVUFBTTJGLFFBQVEsR0FBR2IsZ0JBQWdCLENBQUM7QUFBQ3RCLFlBQU0sRUFBRXhDLE9BQU8sQ0FBQ3dDO0FBQWpCLEtBQUQsQ0FBakM7QUFDQWxDLFdBQU8sQ0FBQyxtRUFBRCxFQUFxRTtBQUFDcUUsY0FBUSxFQUFDQTtBQUFWLEtBQXJFLENBQVA7QUFDQTNGLGFBQVMsR0FBRytFLFdBQVcsQ0FBQztBQUFDdkIsWUFBTSxFQUFFbUM7QUFBVCxLQUFELENBQXZCLENBSFUsQ0FHbUM7QUFDaEQ7O0FBQ0QsUUFBTWlILFdBQVcsR0FBSTVCLFVBQVUsQ0FBQztBQUFDaEwsYUFBUyxFQUFFQTtBQUFaLEdBQUQsQ0FBL0I7QUFDQXNCLFNBQU8sQ0FBQyw0QkFBRCxFQUErQjtBQUFDdEIsYUFBUyxFQUFDQSxTQUFYO0FBQXFCNE0sZUFBVyxFQUFDQTtBQUFqQyxHQUEvQixDQUFQO0FBQ0EsU0FBTztBQUFDNU0sYUFBUyxFQUFDQSxTQUFYO0FBQXFCNE0sZUFBVyxFQUFDQTtBQUFqQyxHQUFQO0FBQ0gsQ0FkRDs7QUFiQXBULE1BQU0sQ0FBQytJLGFBQVAsQ0E2QmVvSyxzQkE3QmYsRTs7Ozs7Ozs7Ozs7QUNBQSxJQUFJcFQsTUFBSjtBQUFXQyxNQUFNLENBQUNDLElBQVAsQ0FBWSxlQUFaLEVBQTRCO0FBQUNGLFFBQU0sQ0FBQ0csQ0FBRCxFQUFHO0FBQUNILFVBQU0sR0FBQ0csQ0FBUDtBQUFTOztBQUFwQixDQUE1QixFQUFrRCxDQUFsRDtBQUFxRCxJQUFJc0MsWUFBSjtBQUFpQnhDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGNBQVosRUFBMkI7QUFBQ21CLFNBQU8sQ0FBQ2xCLENBQUQsRUFBRztBQUFDc0MsZ0JBQVksR0FBQ3RDLENBQWI7QUFBZTs7QUFBM0IsQ0FBM0IsRUFBd0QsQ0FBeEQ7QUFBMkQsSUFBSW1ULE9BQUo7QUFBWXJULE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGFBQVosRUFBMEI7QUFBQ21CLFNBQU8sQ0FBQ2xCLENBQUQsRUFBRztBQUFDbVQsV0FBTyxHQUFDblQsQ0FBUjtBQUFVOztBQUF0QixDQUExQixFQUFrRCxDQUFsRDtBQUFxRCxJQUFJb1QsT0FBSjtBQUFZdFQsTUFBTSxDQUFDQyxJQUFQLENBQVksaUJBQVosRUFBOEI7QUFBQ21CLFNBQU8sQ0FBQ2xCLENBQUQsRUFBRztBQUFDb1QsV0FBTyxHQUFDcFQsQ0FBUjtBQUFVOztBQUF0QixDQUE5QixFQUFzRCxDQUF0RDtBQUt6TixNQUFNcVQsa0JBQWtCLEdBQUcsSUFBSS9RLFlBQUosQ0FBaUI7QUFDMUM0SSxTQUFPLEVBQUU7QUFDUHpILFFBQUksRUFBRUM7QUFEQyxHQURpQztBQUkxQzBDLFlBQVUsRUFBRTtBQUNWM0MsUUFBSSxFQUFFQztBQURJO0FBSjhCLENBQWpCLENBQTNCOztBQVNBLE1BQU00UCxZQUFZLEdBQUk3UixJQUFELElBQVU7QUFDN0IsTUFBSTtBQUNGLFVBQU02RixPQUFPLEdBQUc3RixJQUFoQjtBQUNBNFIsc0JBQWtCLENBQUNoUyxRQUFuQixDQUE0QmlHLE9BQTVCO0FBQ0EsVUFBTTJDLFNBQVMsR0FBR21KLE9BQU8sQ0FBQzlMLE9BQU8sQ0FBQzRELE9BQVQsQ0FBUCxDQUF5QnFJLElBQXpCLENBQThCLElBQUlKLE9BQU8sQ0FBQ0ssVUFBWixDQUF1QmxNLE9BQU8sQ0FBQ2xCLFVBQS9CLENBQTlCLENBQWxCO0FBQ0EsV0FBTzZELFNBQVA7QUFDRCxHQUxELENBS0UsT0FBTXJCLFNBQU4sRUFBaUI7QUFDakIsVUFBTSxJQUFJL0ksTUFBTSxDQUFDOEIsS0FBWCxDQUFpQixpQ0FBakIsRUFBb0RpSCxTQUFwRCxDQUFOO0FBQ0Q7QUFDRixDQVREOztBQWRBOUksTUFBTSxDQUFDK0ksYUFBUCxDQXlCZXlLLFlBekJmLEU7Ozs7Ozs7Ozs7O0FDQUEsSUFBSXpULE1BQUo7QUFBV0MsTUFBTSxDQUFDQyxJQUFQLENBQVksZUFBWixFQUE0QjtBQUFDRixRQUFNLENBQUNHLENBQUQsRUFBRztBQUFDSCxVQUFNLEdBQUNHLENBQVA7QUFBUzs7QUFBcEIsQ0FBNUIsRUFBa0QsQ0FBbEQ7QUFBcUQsSUFBSXNDLFlBQUo7QUFBaUJ4QyxNQUFNLENBQUNDLElBQVAsQ0FBWSxjQUFaLEVBQTJCO0FBQUNtQixTQUFPLENBQUNsQixDQUFELEVBQUc7QUFBQ3NDLGdCQUFZLEdBQUN0QyxDQUFiO0FBQWU7O0FBQTNCLENBQTNCLEVBQXdELENBQXhEO0FBQTJELElBQUl5VCxXQUFKO0FBQWdCM1QsTUFBTSxDQUFDQyxJQUFQLENBQVksbURBQVosRUFBZ0U7QUFBQzBULGFBQVcsQ0FBQ3pULENBQUQsRUFBRztBQUFDeVQsZUFBVyxHQUFDelQsQ0FBWjtBQUFjOztBQUE5QixDQUFoRSxFQUFnRyxDQUFoRztBQUFtRyxJQUFJNFEsY0FBSjtBQUFtQjlRLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLG1CQUFaLEVBQWdDO0FBQUNtQixTQUFPLENBQUNsQixDQUFELEVBQUc7QUFBQzRRLGtCQUFjLEdBQUM1USxDQUFmO0FBQWlCOztBQUE3QixDQUFoQyxFQUErRCxDQUEvRDtBQUFrRSxJQUFJa0osTUFBSjtBQUFXcEosTUFBTSxDQUFDQyxJQUFQLENBQVksNENBQVosRUFBeUQ7QUFBQ21KLFFBQU0sQ0FBQ2xKLENBQUQsRUFBRztBQUFDa0osVUFBTSxHQUFDbEosQ0FBUDtBQUFTOztBQUFwQixDQUF6RCxFQUErRSxDQUEvRTtBQUFrRixJQUFJMFQsYUFBSixFQUFrQjlMLE9BQWxCO0FBQTBCOUgsTUFBTSxDQUFDQyxJQUFQLENBQVksMkNBQVosRUFBd0Q7QUFBQzJULGVBQWEsQ0FBQzFULENBQUQsRUFBRztBQUFDMFQsaUJBQWEsR0FBQzFULENBQWQ7QUFBZ0IsR0FBbEM7O0FBQW1DNEgsU0FBTyxDQUFDNUgsQ0FBRCxFQUFHO0FBQUM0SCxXQUFPLEdBQUM1SCxDQUFSO0FBQVU7O0FBQXhELENBQXhELEVBQWtILENBQWxIO0FBQXFILElBQUkyVCxNQUFKLEVBQVdDLE9BQVg7QUFBbUI5VCxNQUFNLENBQUNDLElBQVAsQ0FBWSxpQ0FBWixFQUE4QztBQUFDNFQsUUFBTSxDQUFDM1QsQ0FBRCxFQUFHO0FBQUMyVCxVQUFNLEdBQUMzVCxDQUFQO0FBQVMsR0FBcEI7O0FBQXFCNFQsU0FBTyxDQUFDNVQsQ0FBRCxFQUFHO0FBQUM0VCxXQUFPLEdBQUM1VCxDQUFSO0FBQVU7O0FBQTFDLENBQTlDLEVBQTBGLENBQTFGO0FBQTZGLElBQUlFLE1BQUo7QUFBV0osTUFBTSxDQUFDQyxJQUFQLENBQVksOEJBQVosRUFBMkM7QUFBQ0csUUFBTSxDQUFDRixDQUFELEVBQUc7QUFBQ0UsVUFBTSxHQUFDRixDQUFQO0FBQVM7O0FBQXBCLENBQTNDLEVBQWlFLENBQWpFO0FBQW9FLElBQUlpVCxzQkFBSjtBQUEyQm5ULE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLHVDQUFaLEVBQW9EO0FBQUNtQixTQUFPLENBQUNsQixDQUFELEVBQUc7QUFBQ2lULDBCQUFzQixHQUFDalQsQ0FBdkI7QUFBeUI7O0FBQXJDLENBQXBELEVBQTJGLENBQTNGO0FBVzF4QixNQUFNNlQsWUFBWSxHQUFHLElBQUl2UixZQUFKLENBQWlCO0FBQ3BDNEIsUUFBTSxFQUFFO0FBQ05ULFFBQUksRUFBRUM7QUFEQSxHQUQ0QjtBQUlwQ3VHLFdBQVMsRUFBRTtBQUNUeEcsUUFBSSxFQUFFQztBQURHLEdBSnlCO0FBT3BDb1EsVUFBUSxFQUFFO0FBQ1JyUSxRQUFJLEVBQUVDO0FBREUsR0FQMEI7QUFVcENvRyxRQUFNLEVBQUU7QUFDTnJHLFFBQUksRUFBRUM7QUFEQSxHQVY0QjtBQWFwQ3FRLFNBQU8sRUFBRTtBQUNQdFEsUUFBSSxFQUFFVDtBQURDO0FBYjJCLENBQWpCLENBQXJCOztBQWtCQSxNQUFNUCxNQUFNLEdBQUloQixJQUFELElBQVU7QUFDdkIsUUFBTTZGLE9BQU8sR0FBRzdGLElBQWhCOztBQUNBLE1BQUk7QUFDRm9TLGdCQUFZLENBQUN4UyxRQUFiLENBQXNCaUcsT0FBdEI7QUFDQU0sV0FBTyxDQUFDLFNBQUQsRUFBV04sT0FBTyxDQUFDd0MsTUFBbkIsQ0FBUDtBQUVBLFVBQU1rSyxtQkFBbUIsR0FBR2Ysc0JBQXNCLENBQUM7QUFBQ25KLFlBQU0sRUFBQ3hDLE9BQU8sQ0FBQ3dDO0FBQWhCLEtBQUQsQ0FBbEQ7QUFDQSxVQUFNekUsSUFBSSxHQUFHdUwsY0FBYyxDQUFDO0FBQUN0SyxlQUFTLEVBQUUwTixtQkFBbUIsQ0FBQzFOLFNBQWhDO0FBQTJDNEUsYUFBTyxFQUFFaEMsTUFBTTtBQUExRCxLQUFELENBQTNCO0FBQ0F0QixXQUFPLENBQUMsa0RBQUQsRUFBb0RzQixNQUFNLEVBQTFELEVBQTZEN0QsSUFBN0QsQ0FBUDtBQUVBLFVBQU00TyxTQUFTLEdBQUd2TCxJQUFJLENBQUNDLFNBQUwsQ0FBZTtBQUM3QnNCLGVBQVMsRUFBRTNDLE9BQU8sQ0FBQzJDLFNBRFU7QUFFN0I2SixjQUFRLEVBQUV4TSxPQUFPLENBQUN3TSxRQUZXO0FBRzdCek8sVUFBSSxFQUFFQTtBQUh1QixLQUFmLENBQWxCLENBUkUsQ0FjRjs7QUFDQXFPLGlCQUFhLENBQUMsbUVBQUQsRUFBc0VNLG1CQUFtQixDQUFDZCxXQUExRixDQUFiO0FBQ0EsVUFBTWdCLFFBQVEsR0FBR1AsTUFBTSxDQUFDRixXQUFELEVBQWNPLG1CQUFtQixDQUFDZCxXQUFsQyxDQUF2QjtBQUNBUSxpQkFBYSxDQUFDLDhCQUFELEVBQWlDUSxRQUFqQyxFQUEyQ0YsbUJBQW1CLENBQUNkLFdBQS9ELENBQWI7QUFFQVEsaUJBQWEsQ0FBQyxvRUFBRCxFQUF1RXBNLE9BQU8sQ0FBQ3BELE1BQS9FLEVBQXNGK1AsU0FBdEYsRUFBZ0dELG1CQUFtQixDQUFDZCxXQUFwSCxDQUFiO0FBQ0EsVUFBTWlCLFNBQVMsR0FBR1AsT0FBTyxDQUFDSCxXQUFELEVBQWNuTSxPQUFPLENBQUNwRCxNQUF0QixFQUE4QitQLFNBQTlCLEVBQXlDRCxtQkFBbUIsQ0FBQ2QsV0FBN0QsQ0FBekI7QUFDQVEsaUJBQWEsQ0FBQyxrQ0FBRCxFQUFxQ1MsU0FBckMsQ0FBYjtBQUVBalUsVUFBTSxDQUFDZ0QsTUFBUCxDQUFjO0FBQUNnQixZQUFNLEVBQUVvRCxPQUFPLENBQUNwRDtBQUFqQixLQUFkLEVBQXdDO0FBQUM4TSxVQUFJLEVBQUU7QUFBQzdNLFlBQUksRUFBQ2dRO0FBQU47QUFBUCxLQUF4QztBQUNBVCxpQkFBYSxDQUFDLDhCQUFELEVBQWlDO0FBQUN4UCxZQUFNLEVBQUVvRCxPQUFPLENBQUNwRCxNQUFqQjtBQUF5QkMsVUFBSSxFQUFFZ1E7QUFBL0IsS0FBakMsQ0FBYjtBQUVELEdBMUJELENBMEJFLE9BQU12TCxTQUFOLEVBQWlCO0FBQ2YxSSxVQUFNLENBQUNnRCxNQUFQLENBQWM7QUFBQ2dCLFlBQU0sRUFBRW9ELE9BQU8sQ0FBQ3BEO0FBQWpCLEtBQWQsRUFBd0M7QUFBQzhNLFVBQUksRUFBRTtBQUFDdFAsYUFBSyxFQUFDZ0gsSUFBSSxDQUFDQyxTQUFMLENBQWVDLFNBQVMsQ0FBQ3NDLE9BQXpCO0FBQVA7QUFBUCxLQUF4QztBQUNGLFVBQU0sSUFBSXJMLE1BQU0sQ0FBQzhCLEtBQVgsQ0FBaUIsMkJBQWpCLEVBQThDaUgsU0FBOUMsQ0FBTixDQUZpQixDQUUrQztBQUNqRTtBQUNGLENBaENEOztBQTdCQTlJLE1BQU0sQ0FBQytJLGFBQVAsQ0ErRGVwRyxNQS9EZixFOzs7Ozs7Ozs7OztBQ0FBLElBQUk1QyxNQUFKO0FBQVdDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGVBQVosRUFBNEI7QUFBQ0YsUUFBTSxDQUFDRyxDQUFELEVBQUc7QUFBQ0gsVUFBTSxHQUFDRyxDQUFQO0FBQVM7O0FBQXBCLENBQTVCLEVBQWtELENBQWxEO0FBQXFELElBQUlzQyxZQUFKO0FBQWlCeEMsTUFBTSxDQUFDQyxJQUFQLENBQVksY0FBWixFQUEyQjtBQUFDbUIsU0FBTyxDQUFDbEIsQ0FBRCxFQUFHO0FBQUNzQyxnQkFBWSxHQUFDdEMsQ0FBYjtBQUFlOztBQUEzQixDQUEzQixFQUF3RCxDQUF4RDtBQUEyRCxJQUFJbUosY0FBSjtBQUFtQnJKLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLG1EQUFaLEVBQWdFO0FBQUNvSixnQkFBYyxDQUFDbkosQ0FBRCxFQUFHO0FBQUNtSixrQkFBYyxHQUFDbkosQ0FBZjtBQUFpQjs7QUFBcEMsQ0FBaEUsRUFBc0csQ0FBdEc7QUFBeUcsSUFBSXlOLE1BQUosRUFBV25FLFdBQVgsRUFBdUI4SyxjQUF2QixFQUFzQ1IsT0FBdEMsRUFBOENuRixRQUE5QztBQUF1RDNPLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGlDQUFaLEVBQThDO0FBQUMwTixRQUFNLENBQUN6TixDQUFELEVBQUc7QUFBQ3lOLFVBQU0sR0FBQ3pOLENBQVA7QUFBUyxHQUFwQjs7QUFBcUJzSixhQUFXLENBQUN0SixDQUFELEVBQUc7QUFBQ3NKLGVBQVcsR0FBQ3RKLENBQVo7QUFBYyxHQUFsRDs7QUFBbURvVSxnQkFBYyxDQUFDcFUsQ0FBRCxFQUFHO0FBQUNvVSxrQkFBYyxHQUFDcFUsQ0FBZjtBQUFpQixHQUF0Rjs7QUFBdUY0VCxTQUFPLENBQUM1VCxDQUFELEVBQUc7QUFBQzRULFdBQU8sR0FBQzVULENBQVI7QUFBVSxHQUE1Rzs7QUFBNkd5TyxVQUFRLENBQUN6TyxDQUFELEVBQUc7QUFBQ3lPLFlBQVEsR0FBQ3pPLENBQVQ7QUFBVzs7QUFBcEksQ0FBOUMsRUFBb0wsQ0FBcEw7QUFBdUwsSUFBSWdKLFFBQUosRUFBYXFMLDZCQUFiLEVBQTJDcEwsT0FBM0M7QUFBbURuSixNQUFNLENBQUNDLElBQVAsQ0FBWSxrQ0FBWixFQUErQztBQUFDaUosVUFBUSxDQUFDaEosQ0FBRCxFQUFHO0FBQUNnSixZQUFRLEdBQUNoSixDQUFUO0FBQVcsR0FBeEI7O0FBQXlCcVUsK0JBQTZCLENBQUNyVSxDQUFELEVBQUc7QUFBQ3FVLGlDQUE2QixHQUFDclUsQ0FBOUI7QUFBZ0MsR0FBMUY7O0FBQTJGaUosU0FBTyxDQUFDakosQ0FBRCxFQUFHO0FBQUNpSixXQUFPLEdBQUNqSixDQUFSO0FBQVU7O0FBQWhILENBQS9DLEVBQWlLLENBQWpLO0FBQW9LLElBQUlvSixlQUFKO0FBQW9CdEosTUFBTSxDQUFDQyxJQUFQLENBQVksZ0RBQVosRUFBNkQ7QUFBQ3FKLGlCQUFlLENBQUNwSixDQUFELEVBQUc7QUFBQ29KLG1CQUFlLEdBQUNwSixDQUFoQjtBQUFrQjs7QUFBdEMsQ0FBN0QsRUFBcUcsQ0FBckc7QUFBd0csSUFBSXNVLFVBQUo7QUFBZXhVLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLDZCQUFaLEVBQTBDO0FBQUN1VSxZQUFVLENBQUN0VSxDQUFELEVBQUc7QUFBQ3NVLGNBQVUsR0FBQ3RVLENBQVg7QUFBYTs7QUFBNUIsQ0FBMUMsRUFBd0UsQ0FBeEU7QUFBMkUsSUFBSTJKLFVBQUo7QUFBZTdKLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLDJDQUFaLEVBQXdEO0FBQUM0SixZQUFVLENBQUMzSixDQUFELEVBQUc7QUFBQzJKLGNBQVUsR0FBQzNKLENBQVg7QUFBYTs7QUFBNUIsQ0FBeEQsRUFBc0YsQ0FBdEY7QUFBeUYsSUFBSTJOLG9CQUFKO0FBQXlCN04sTUFBTSxDQUFDQyxJQUFQLENBQVksNEJBQVosRUFBeUM7QUFBQ21CLFNBQU8sQ0FBQ2xCLENBQUQsRUFBRztBQUFDMk4sd0JBQW9CLEdBQUMzTixDQUFyQjtBQUF1Qjs7QUFBbkMsQ0FBekMsRUFBOEUsQ0FBOUU7QUFBaUYsSUFBSTROLGNBQUo7QUFBbUI5TixNQUFNLENBQUNDLElBQVAsQ0FBWSxtQkFBWixFQUFnQztBQUFDbUIsU0FBTyxDQUFDbEIsQ0FBRCxFQUFHO0FBQUM0TixrQkFBYyxHQUFDNU4sQ0FBZjtBQUFpQjs7QUFBN0IsQ0FBaEMsRUFBK0QsQ0FBL0Q7QUFBa0UsSUFBSUUsTUFBSjtBQUFXSixNQUFNLENBQUNDLElBQVAsQ0FBWSw4QkFBWixFQUEyQztBQUFDRyxRQUFNLENBQUNGLENBQUQsRUFBRztBQUFDRSxVQUFNLEdBQUNGLENBQVA7QUFBUzs7QUFBcEIsQ0FBM0MsRUFBaUUsRUFBakU7QUFZcnRDLE1BQU11VSxZQUFZLEdBQUcsSUFBSWpTLFlBQUosQ0FBaUI7QUFDcEM0QixRQUFNLEVBQUU7QUFDTlQsUUFBSSxFQUFFQztBQURBLEdBRDRCO0FBSXBDZ0QsT0FBSyxFQUFFO0FBQ0xqRCxRQUFJLEVBQUVDO0FBREQsR0FKNkI7QUFPcEM4USxNQUFJLEVBQUc7QUFDSC9RLFFBQUksRUFBRUMsTUFESDtBQUVISSxZQUFRLEVBQUU7QUFGUCxHQVA2QjtBQVdwQzJRLGFBQVcsRUFBRztBQUNWaFIsUUFBSSxFQUFFQztBQURJO0FBWHNCLENBQWpCLENBQXJCOztBQWdCQSxNQUFNUixNQUFNLEdBQUcsQ0FBQ3pCLElBQUQsRUFBT3VOLEdBQVAsS0FBZTtBQUM1QixNQUFJO0FBQ0YsVUFBTTFILE9BQU8sR0FBRzdGLElBQWhCO0FBRUE4UyxnQkFBWSxDQUFDbFQsUUFBYixDQUFzQmlHLE9BQXRCLEVBSEUsQ0FLRjs7QUFDQSxVQUFNb04sU0FBUyxHQUFHakcsUUFBUSxDQUFDdEYsY0FBRCxFQUFnQjdCLE9BQU8sQ0FBQ3BELE1BQXhCLENBQTFCOztBQUNBLFFBQUd3USxTQUFTLEtBQUtwTSxTQUFqQixFQUEyQjtBQUN2QnFNLFdBQUssQ0FBQzNGLEdBQUQsQ0FBTDtBQUNBckYsZ0JBQVUsQ0FBQyx5Q0FBRCxFQUEyQ3JDLE9BQU8sQ0FBQ3BELE1BQW5ELENBQVY7QUFDQTtBQUNIOztBQUNELFVBQU0wUSxlQUFlLEdBQUdSLGNBQWMsQ0FBQ2pMLGNBQUQsRUFBZ0J1TCxTQUFTLENBQUMzRixJQUExQixDQUF0Qzs7QUFDQSxRQUFHNkYsZUFBZSxDQUFDQyxhQUFoQixLQUFnQyxDQUFuQyxFQUFxQztBQUNqQ0YsV0FBSyxDQUFDM0YsR0FBRCxDQUFMO0FBQ0FyRixnQkFBVSxDQUFDLHdEQUFELEVBQTBEakIsSUFBSSxDQUFDdUYsS0FBTCxDQUFXM0csT0FBTyxDQUFDWixLQUFuQixDQUExRCxDQUFWO0FBQ0E7QUFDSDs7QUFDRGlELGNBQVUsQ0FBQyx3Q0FBRCxFQUEwQ2pCLElBQUksQ0FBQ3VGLEtBQUwsQ0FBVzNHLE9BQU8sQ0FBQ1osS0FBbkIsQ0FBMUMsQ0FBVjtBQUNBLFVBQU13SCxHQUFHLEdBQUdULE1BQU0sQ0FBQ3RFLGNBQUQsRUFBaUJDLGVBQWpCLENBQWxCO0FBQ0EsVUFBTWhELFVBQVUsR0FBR3VILG9CQUFvQixDQUFDO0FBQUNPLFNBQUcsRUFBRUE7QUFBTixLQUFELENBQXZDO0FBQ0F2RSxjQUFVLENBQUMsNEZBQUQsRUFBOEZyQyxPQUFPLENBQUNtTixXQUF0RyxDQUFWO0FBQ0EsVUFBTUssY0FBYyxHQUFHbEgsY0FBYyxDQUFDO0FBQUN4SCxnQkFBVSxFQUFFQSxVQUFiO0FBQXlCOEUsYUFBTyxFQUFFNUQsT0FBTyxDQUFDbU47QUFBMUMsS0FBRCxDQUFyQztBQUNBOUssY0FBVSxDQUFDLHVCQUFELEVBQXlCbUwsY0FBekIsQ0FBVjtBQUNBLFVBQU05SyxHQUFHLEdBQUc4SyxjQUFjLEdBQUM5TCxRQUFmLEdBQXdCQyxPQUF4QixHQUFnQyxHQUFoQyxHQUFvQ29MLDZCQUFoRDtBQUVBMUssY0FBVSxDQUFDLG9DQUFrQ1AsZUFBbEMsR0FBa0QsVUFBbkQsRUFBOEQ5QixPQUFPLENBQUNaLEtBQXRFLENBQVY7QUFDQSxVQUFNdUQsU0FBUyxHQUFHWCxXQUFXLENBQUNILGNBQUQsRUFBaUJDLGVBQWpCLEVBQWtDOUIsT0FBTyxDQUFDcEQsTUFBMUMsQ0FBN0IsQ0EzQkUsQ0EyQjhFOztBQUNoRnlGLGNBQVUsQ0FBQyxvQkFBRCxFQUFzQk0sU0FBdEIsQ0FBVjtBQUVBLFVBQU04SyxVQUFVLEdBQUc7QUFDZjdRLFlBQU0sRUFBRW9ELE9BQU8sQ0FBQ3BELE1BREQ7QUFFZitGLGVBQVMsRUFBRUEsU0FGSTtBQUdmdUssVUFBSSxFQUFFbE4sT0FBTyxDQUFDa047QUFIQyxLQUFuQjs7QUFNQSxRQUFJO0FBQ0EsWUFBTXpGLElBQUksR0FBRzZFLE9BQU8sQ0FBQ3pLLGNBQUQsRUFBaUI3QixPQUFPLENBQUNwRCxNQUF6QixFQUFpQ29ELE9BQU8sQ0FBQ1osS0FBekMsRUFBZ0QsSUFBaEQsQ0FBcEI7QUFDQWlELGdCQUFVLENBQUMsMEJBQUQsRUFBNEJvRixJQUE1QixDQUFWO0FBQ0gsS0FIRCxDQUdDLE9BQU1uRyxTQUFOLEVBQWdCO0FBQ2I7QUFDQWUsZ0JBQVUsQ0FBQyw4R0FBRCxFQUFnSHJDLE9BQU8sQ0FBQ3BELE1BQXhILENBQVY7O0FBQ0EsVUFBRzBFLFNBQVMsQ0FBQzhILFFBQVYsR0FBcUJ0QyxPQUFyQixDQUE2QixtREFBN0IsS0FBbUYsQ0FBQyxDQUF2RixFQUEwRjtBQUN0RmxPLGNBQU0sQ0FBQ2dELE1BQVAsQ0FBYztBQUFDZ0IsZ0JBQU0sRUFBRW9ELE9BQU8sQ0FBQ3BEO0FBQWpCLFNBQWQsRUFBd0M7QUFBQzhNLGNBQUksRUFBRTtBQUFDdFAsaUJBQUssRUFBRWdILElBQUksQ0FBQ0MsU0FBTCxDQUFlQyxTQUFTLENBQUNzQyxPQUF6QjtBQUFSO0FBQVAsU0FBeEM7QUFDSDs7QUFDRCxZQUFNLElBQUlyTCxNQUFNLENBQUM4QixLQUFYLENBQWlCLDJCQUFqQixFQUE4Q2lILFNBQTlDLENBQU4sQ0FOYSxDQU9iO0FBQ0E7QUFDQTtBQUNIOztBQUVELFVBQU13QixRQUFRLEdBQUdrSyxVQUFVLENBQUN0SyxHQUFELEVBQU0rSyxVQUFOLENBQTNCO0FBQ0FwTCxjQUFVLENBQUMsbURBQWlESyxHQUFqRCxHQUFxRCxrQkFBckQsR0FBd0V0QixJQUFJLENBQUNDLFNBQUwsQ0FBZW9NLFVBQWYsQ0FBeEUsR0FBbUcsWUFBcEcsRUFBaUgzSyxRQUFRLENBQUMzSSxJQUExSCxDQUFWO0FBQ0F1TixPQUFHLENBQUNZLElBQUo7QUFDRCxHQXRERCxDQXNERSxPQUFNaEgsU0FBTixFQUFpQjtBQUNqQixVQUFNLElBQUkvSSxNQUFNLENBQUM4QixLQUFYLENBQWlCLDJCQUFqQixFQUE4Q2lILFNBQTlDLENBQU47QUFDRDtBQUNGLENBMUREOztBQTREQSxTQUFTK0wsS0FBVCxDQUFlM0YsR0FBZixFQUFtQjtBQUNmckYsWUFBVSxDQUFDLDZDQUFELEVBQStDLEVBQS9DLENBQVY7QUFDQXFGLEtBQUcsQ0FBQ2dHLE1BQUo7QUFDQXJMLFlBQVUsQ0FBQywrQkFBRCxFQUFpQyxFQUFqQyxDQUFWO0FBQ0FxRixLQUFHLENBQUNpRyxPQUFKLENBQ0ksQ0FDSTtBQUNBO0FBQ0Q7QUFDZTtBQUpsQixHQURKLEVBT0ksVUFBVUMsR0FBVixFQUFlalMsTUFBZixFQUF1QjtBQUNuQixRQUFJQSxNQUFKLEVBQVk7QUFDUjBHLGdCQUFVLENBQUMsMEJBQUQsRUFBNEIxRyxNQUE1QixDQUFWO0FBQ0g7QUFDSixHQVhMO0FBYUg7O0FBekdEbkQsTUFBTSxDQUFDK0ksYUFBUCxDQTJHZTNGLE1BM0dmLEU7Ozs7Ozs7Ozs7O0FDQUEsSUFBSXJELE1BQUo7QUFBV0MsTUFBTSxDQUFDQyxJQUFQLENBQVksZUFBWixFQUE0QjtBQUFDRixRQUFNLENBQUNHLENBQUQsRUFBRztBQUFDSCxVQUFNLEdBQUNHLENBQVA7QUFBUzs7QUFBcEIsQ0FBNUIsRUFBa0QsQ0FBbEQ7QUFBcUQsSUFBSXNDLFlBQUo7QUFBaUJ4QyxNQUFNLENBQUNDLElBQVAsQ0FBWSxjQUFaLEVBQTJCO0FBQUNtQixTQUFPLENBQUNsQixDQUFELEVBQUc7QUFBQ3NDLGdCQUFZLEdBQUN0QyxDQUFiO0FBQWU7O0FBQTNCLENBQTNCLEVBQXdELENBQXhEO0FBQTJELElBQUltVCxPQUFKO0FBQVlyVCxNQUFNLENBQUNDLElBQVAsQ0FBWSxhQUFaLEVBQTBCO0FBQUNtQixTQUFPLENBQUNsQixDQUFELEVBQUc7QUFBQ21ULFdBQU8sR0FBQ25ULENBQVI7QUFBVTs7QUFBdEIsQ0FBMUIsRUFBa0QsQ0FBbEQ7QUFBcUQsSUFBSW9ULE9BQUo7QUFBWXRULE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGlCQUFaLEVBQThCO0FBQUNtQixTQUFPLENBQUNsQixDQUFELEVBQUc7QUFBQ29ULFdBQU8sR0FBQ3BULENBQVI7QUFBVTs7QUFBdEIsQ0FBOUIsRUFBc0QsQ0FBdEQ7QUFBeUQsSUFBSTRKLFFBQUosRUFBYXVMLFNBQWI7QUFBdUJyVixNQUFNLENBQUNDLElBQVAsQ0FBWSwyQ0FBWixFQUF3RDtBQUFDNkosVUFBUSxDQUFDNUosQ0FBRCxFQUFHO0FBQUM0SixZQUFRLEdBQUM1SixDQUFUO0FBQVcsR0FBeEI7O0FBQXlCbVYsV0FBUyxDQUFDblYsQ0FBRCxFQUFHO0FBQUNtVixhQUFTLEdBQUNuVixDQUFWO0FBQVk7O0FBQWxELENBQXhELEVBQTRHLENBQTVHO0FBS3pTLE1BQU1vVixPQUFPLEdBQUdqQyxPQUFPLENBQUNrQyxRQUFSLENBQWlCbFUsR0FBakIsQ0FBcUI7QUFDbkNDLE1BQUksRUFBRSxVQUQ2QjtBQUVuQ2tVLE9BQUssRUFBRSxVQUY0QjtBQUduQ0MsWUFBVSxFQUFFLElBSHVCO0FBSW5DQyxZQUFVLEVBQUUsSUFKdUI7QUFLbkNDLFlBQVUsRUFBRSxFQUx1QjtBQU1uQ0MsY0FBWSxFQUFFO0FBTnFCLENBQXJCLENBQWhCO0FBU0EsTUFBTUMscUJBQXFCLEdBQUcsSUFBSXJULFlBQUosQ0FBaUI7QUFDN0NiLE1BQUksRUFBRTtBQUNKZ0MsUUFBSSxFQUFFQztBQURGLEdBRHVDO0FBSTdDNEMsV0FBUyxFQUFFO0FBQ1Q3QyxRQUFJLEVBQUVDO0FBREcsR0FKa0M7QUFPN0N1RyxXQUFTLEVBQUU7QUFDVHhHLFFBQUksRUFBRUM7QUFERztBQVBrQyxDQUFqQixDQUE5Qjs7QUFZQSxNQUFNNEgsZUFBZSxHQUFJN0osSUFBRCxJQUFVO0FBQ2hDLE1BQUk7QUFDRixVQUFNNkYsT0FBTyxHQUFHN0YsSUFBaEI7QUFDQTBULGFBQVMsQ0FBQyxrQkFBRCxFQUFvQjdOLE9BQXBCLENBQVQ7QUFDQXFPLHlCQUFxQixDQUFDdFUsUUFBdEIsQ0FBK0JpRyxPQUEvQjtBQUNBLFVBQU1YLE9BQU8sR0FBR3dNLE9BQU8sQ0FBQ3lDLE9BQVIsQ0FBZ0JDLGFBQWhCLENBQThCLElBQUkxQyxPQUFPLENBQUMyQyxTQUFaLENBQXNCeE8sT0FBTyxDQUFDaEIsU0FBOUIsQ0FBOUIsRUFBd0U4TyxPQUF4RSxDQUFoQjs7QUFDQSxRQUFJO0FBQ0YsYUFBT2hDLE9BQU8sQ0FBQzlMLE9BQU8sQ0FBQzdGLElBQVQsQ0FBUCxDQUFzQnNVLE1BQXRCLENBQTZCcFAsT0FBN0IsRUFBc0NXLE9BQU8sQ0FBQzJDLFNBQTlDLENBQVA7QUFDRCxLQUZELENBRUUsT0FBTXZJLEtBQU4sRUFBYTtBQUFFa0ksY0FBUSxDQUFDbEksS0FBRCxDQUFSO0FBQWdCOztBQUNqQyxXQUFPLEtBQVA7QUFDRCxHQVRELENBU0UsT0FBTWtILFNBQU4sRUFBaUI7QUFDakIsVUFBTSxJQUFJL0ksTUFBTSxDQUFDOEIsS0FBWCxDQUFpQixvQ0FBakIsRUFBdURpSCxTQUF2RCxDQUFOO0FBQ0Q7QUFDRixDQWJEOztBQTFCQTlJLE1BQU0sQ0FBQytJLGFBQVAsQ0F5Q2V5QyxlQXpDZixFOzs7Ozs7Ozs7OztBQ0FBLElBQUl6TCxNQUFKO0FBQVdDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGVBQVosRUFBNEI7QUFBQ0YsUUFBTSxDQUFDRyxDQUFELEVBQUc7QUFBQ0gsVUFBTSxHQUFDRyxDQUFQO0FBQVM7O0FBQXBCLENBQTVCLEVBQWtELENBQWxEO0FBQXFELElBQUlzQyxZQUFKO0FBQWlCeEMsTUFBTSxDQUFDQyxJQUFQLENBQVksY0FBWixFQUEyQjtBQUFDbUIsU0FBTyxDQUFDbEIsQ0FBRCxFQUFHO0FBQUNzQyxnQkFBWSxHQUFDdEMsQ0FBYjtBQUFlOztBQUEzQixDQUEzQixFQUF3RCxDQUF4RDtBQUEyRCxJQUFJRSxNQUFKO0FBQVdKLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGlDQUFaLEVBQThDO0FBQUNHLFFBQU0sQ0FBQ0YsQ0FBRCxFQUFHO0FBQUNFLFVBQU0sR0FBQ0YsQ0FBUDtBQUFTOztBQUFwQixDQUE5QyxFQUFvRSxDQUFwRTtBQUF1RSxJQUFJd0gsT0FBSjtBQUFZMUgsTUFBTSxDQUFDQyxJQUFQLENBQVksaUNBQVosRUFBOEM7QUFBQ3lILFNBQU8sQ0FBQ3hILENBQUQsRUFBRztBQUFDd0gsV0FBTyxHQUFDeEgsQ0FBUjtBQUFVOztBQUF0QixDQUE5QyxFQUFzRSxDQUF0RTtBQUF5RSxJQUFJMEUsVUFBSjtBQUFlNUUsTUFBTSxDQUFDQyxJQUFQLENBQVksdUNBQVosRUFBb0Q7QUFBQzJFLFlBQVUsQ0FBQzFFLENBQUQsRUFBRztBQUFDMEUsY0FBVSxHQUFDMUUsQ0FBWDtBQUFhOztBQUE1QixDQUFwRCxFQUFrRixDQUFsRjtBQUFxRixJQUFJK1EsY0FBSjtBQUFtQmpSLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLHVCQUFaLEVBQW9DO0FBQUNtQixTQUFPLENBQUNsQixDQUFELEVBQUc7QUFBQytRLGtCQUFjLEdBQUMvUSxDQUFmO0FBQWlCOztBQUE3QixDQUFwQyxFQUFtRSxDQUFuRTtBQUFzRSxJQUFJc1QsWUFBSjtBQUFpQnhULE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLG9CQUFaLEVBQWlDO0FBQUNtQixTQUFPLENBQUNsQixDQUFELEVBQUc7QUFBQ3NULGdCQUFZLEdBQUN0VCxDQUFiO0FBQWU7O0FBQTNCLENBQWpDLEVBQThELENBQTlEO0FBQWlFLElBQUlvUyxXQUFKO0FBQWdCdFMsTUFBTSxDQUFDQyxJQUFQLENBQVksb0JBQVosRUFBaUM7QUFBQ21CLFNBQU8sQ0FBQ2xCLENBQUQsRUFBRztBQUFDb1MsZUFBVyxHQUFDcFMsQ0FBWjtBQUFjOztBQUExQixDQUFqQyxFQUE2RCxDQUE3RDtBQUFnRSxJQUFJZ1csc0JBQUo7QUFBMkJsVyxNQUFNLENBQUNDLElBQVAsQ0FBWSxrQ0FBWixFQUErQztBQUFDbUIsU0FBTyxDQUFDbEIsQ0FBRCxFQUFHO0FBQUNnVywwQkFBc0IsR0FBQ2hXLENBQXZCO0FBQXlCOztBQUFyQyxDQUEvQyxFQUFzRixDQUF0RjtBQUF5RixJQUFJNEgsT0FBSjtBQUFZOUgsTUFBTSxDQUFDQyxJQUFQLENBQVksMkNBQVosRUFBd0Q7QUFBQzZILFNBQU8sQ0FBQzVILENBQUQsRUFBRztBQUFDNEgsV0FBTyxHQUFDNUgsQ0FBUjtBQUFVOztBQUF0QixDQUF4RCxFQUFnRixDQUFoRjtBQVdseEIsTUFBTWlXLHVCQUF1QixHQUFHLElBQUkzVCxZQUFKLENBQWlCO0FBQy9DMkYsSUFBRSxFQUFFO0FBQ0Z4RSxRQUFJLEVBQUVDO0FBREo7QUFEMkMsQ0FBakIsQ0FBaEM7O0FBTUEsTUFBTXdTLGlCQUFpQixHQUFJelUsSUFBRCxJQUFVO0FBQ2xDLE1BQUk7QUFDRixVQUFNNkYsT0FBTyxHQUFHN0YsSUFBaEI7QUFDQXdVLDJCQUF1QixDQUFDNVUsUUFBeEIsQ0FBaUNpRyxPQUFqQztBQUVBLFVBQU16RixLQUFLLEdBQUczQixNQUFNLENBQUNzSyxPQUFQLENBQWU7QUFBQ2hILFNBQUcsRUFBRS9CLElBQUksQ0FBQ3dHO0FBQVgsS0FBZixDQUFkO0FBQ0EsVUFBTXBGLFNBQVMsR0FBRzZCLFVBQVUsQ0FBQzhGLE9BQVgsQ0FBbUI7QUFBQ2hILFNBQUcsRUFBRTNCLEtBQUssQ0FBQ2dCO0FBQVosS0FBbkIsQ0FBbEI7QUFDQSxVQUFNQyxNQUFNLEdBQUcwRSxPQUFPLENBQUNnRCxPQUFSLENBQWdCO0FBQUNoSCxTQUFHLEVBQUUzQixLQUFLLENBQUNpQjtBQUFaLEtBQWhCLENBQWY7QUFDQThFLFdBQU8sQ0FBQyxhQUFELEVBQWU7QUFBQzVELFdBQUssRUFBQ3NELE9BQU8sQ0FBQ3RELEtBQWY7QUFBc0JuQyxXQUFLLEVBQUNBLEtBQTVCO0FBQWtDZ0IsZUFBUyxFQUFDQSxTQUE1QztBQUFzREMsWUFBTSxFQUFFQTtBQUE5RCxLQUFmLENBQVA7QUFHQSxVQUFNb0IsTUFBTSxHQUFHNk0sY0FBYyxDQUFDO0FBQUM5SSxRQUFFLEVBQUV4RyxJQUFJLENBQUN3RyxFQUFWO0FBQWFqRSxXQUFLLEVBQUNuQyxLQUFLLENBQUNtQyxLQUF6QjtBQUErQkksZUFBUyxFQUFDdkMsS0FBSyxDQUFDdUM7QUFBL0MsS0FBRCxDQUE3QjtBQUNBLFVBQU02RixTQUFTLEdBQUdxSixZQUFZLENBQUM7QUFBQ3BJLGFBQU8sRUFBRXJJLFNBQVMsQ0FBQ3NELEtBQVYsR0FBZ0JyRCxNQUFNLENBQUNxRCxLQUFqQztBQUF3Q0MsZ0JBQVUsRUFBRXZELFNBQVMsQ0FBQ3VEO0FBQTlELEtBQUQsQ0FBOUI7QUFDQXdCLFdBQU8sQ0FBQyxzREFBRCxFQUF3RHFDLFNBQXhELENBQVA7QUFFQSxRQUFJNkosUUFBUSxHQUFHLEVBQWY7O0FBRUEsUUFBR2pTLEtBQUssQ0FBQ0osSUFBVCxFQUFlO0FBQ2JxUyxjQUFRLEdBQUcxQixXQUFXLENBQUM7QUFBQzNRLFlBQUksRUFBRUksS0FBSyxDQUFDSjtBQUFiLE9BQUQsQ0FBdEI7QUFDQW1HLGFBQU8sQ0FBQyxxQ0FBRCxFQUF1Q2tNLFFBQXZDLENBQVA7QUFDRDs7QUFFRCxVQUFNaEksS0FBSyxHQUFHakosU0FBUyxDQUFDc0QsS0FBVixDQUFnQjRGLEtBQWhCLENBQXNCLEdBQXRCLENBQWQ7QUFDQSxVQUFNakMsTUFBTSxHQUFHZ0MsS0FBSyxDQUFDQSxLQUFLLENBQUNFLE1BQU4sR0FBYSxDQUFkLENBQXBCO0FBQ0FwRSxXQUFPLENBQUMsd0NBQUQsRUFBMENrQyxNQUExQyxDQUFQO0FBQ0FrTSwwQkFBc0IsQ0FBQztBQUNyQjlSLFlBQU0sRUFBRUEsTUFEYTtBQUVyQitGLGVBQVMsRUFBRUEsU0FGVTtBQUdyQjZKLGNBQVEsRUFBRUEsUUFIVztBQUlyQmhLLFlBQU0sRUFBRUEsTUFKYTtBQUtyQmlLLGFBQU8sRUFBRWxTLEtBQUssQ0FBQ2tCO0FBTE0sS0FBRCxDQUF0QjtBQU9ELEdBL0JELENBK0JFLE9BQU82RixTQUFQLEVBQWtCO0FBQ2xCLFVBQU0sSUFBSS9JLE1BQU0sQ0FBQzhCLEtBQVgsQ0FBaUIsc0NBQWpCLEVBQXlEaUgsU0FBekQsQ0FBTjtBQUNEO0FBQ0YsQ0FuQ0Q7O0FBakJBOUksTUFBTSxDQUFDK0ksYUFBUCxDQXNEZXFOLGlCQXREZixFOzs7Ozs7Ozs7OztBQ0FBLElBQUlyVyxNQUFKO0FBQVdDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGVBQVosRUFBNEI7QUFBQ0YsUUFBTSxDQUFDRyxDQUFELEVBQUc7QUFBQ0gsVUFBTSxHQUFDRyxDQUFQO0FBQVM7O0FBQXBCLENBQTVCLEVBQWtELENBQWxEO0FBQXFELElBQUlzQyxZQUFKO0FBQWlCeEMsTUFBTSxDQUFDQyxJQUFQLENBQVksY0FBWixFQUEyQjtBQUFDbUIsU0FBTyxDQUFDbEIsQ0FBRCxFQUFHO0FBQUNzQyxnQkFBWSxHQUFDdEMsQ0FBYjtBQUFlOztBQUEzQixDQUEzQixFQUF3RCxDQUF4RDtBQUEyRCxJQUFJbVcsT0FBSjtBQUFZclcsTUFBTSxDQUFDQyxJQUFQLENBQVksZ0RBQVosRUFBNkQ7QUFBQ29XLFNBQU8sQ0FBQ25XLENBQUQsRUFBRztBQUFDbVcsV0FBTyxHQUFDblcsQ0FBUjtBQUFVOztBQUF0QixDQUE3RCxFQUFxRixDQUFyRjtBQUl4SixNQUFNb1csbUJBQW1CLEdBQUcsSUFBSTlULFlBQUosQ0FBaUI7QUFDM0MrUCxNQUFJLEVBQUU7QUFDSjVPLFFBQUksRUFBRUM7QUFERjtBQURxQyxDQUFqQixDQUE1Qjs7QUFNQSxNQUFNMlMsYUFBYSxHQUFJaEUsSUFBRCxJQUFVO0FBQzlCLE1BQUk7QUFDRixVQUFNaUUsT0FBTyxHQUFHakUsSUFBaEI7QUFDQStELHVCQUFtQixDQUFDL1UsUUFBcEIsQ0FBNkJpVixPQUE3QjtBQUNBLFVBQU1DLEdBQUcsR0FBR0osT0FBTyxDQUFDSyxTQUFSLENBQWtCRixPQUFPLENBQUNqRSxJQUExQixDQUFaO0FBQ0EsUUFBRyxDQUFDa0UsR0FBRCxJQUFRQSxHQUFHLEtBQUssRUFBbkIsRUFBdUIsTUFBTSxZQUFOOztBQUN2QixRQUFJO0FBQ0YsWUFBTUUsR0FBRyxHQUFHL04sSUFBSSxDQUFDdUYsS0FBTCxDQUFXb0MsTUFBTSxDQUFDa0csR0FBRCxFQUFNLEtBQU4sQ0FBTixDQUFtQjdGLFFBQW5CLENBQTRCLE9BQTVCLENBQVgsQ0FBWjtBQUNBLGFBQU8rRixHQUFQO0FBQ0QsS0FIRCxDQUdFLE9BQU03TixTQUFOLEVBQWlCO0FBQUMsWUFBTSxZQUFOO0FBQW9CO0FBQ3pDLEdBVEQsQ0FTRSxPQUFPQSxTQUFQLEVBQWtCO0FBQ2xCLFVBQU0sSUFBSS9JLE1BQU0sQ0FBQzhCLEtBQVgsQ0FBaUIsa0NBQWpCLEVBQXFEaUgsU0FBckQsQ0FBTjtBQUNEO0FBQ0YsQ0FiRDs7QUFWQTlJLE1BQU0sQ0FBQytJLGFBQVAsQ0F5QmV3TixhQXpCZixFOzs7Ozs7Ozs7OztBQ0FBLElBQUl4VyxNQUFKO0FBQVdDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGVBQVosRUFBNEI7QUFBQ0YsUUFBTSxDQUFDRyxDQUFELEVBQUc7QUFBQ0gsVUFBTSxHQUFDRyxDQUFQO0FBQVM7O0FBQXBCLENBQTVCLEVBQWtELENBQWxEO0FBQXFELElBQUlzQyxZQUFKO0FBQWlCeEMsTUFBTSxDQUFDQyxJQUFQLENBQVksY0FBWixFQUEyQjtBQUFDbUIsU0FBTyxDQUFDbEIsQ0FBRCxFQUFHO0FBQUNzQyxnQkFBWSxHQUFDdEMsQ0FBYjtBQUFlOztBQUEzQixDQUEzQixFQUF3RCxDQUF4RDtBQUEyRCxJQUFJbVcsT0FBSjtBQUFZclcsTUFBTSxDQUFDQyxJQUFQLENBQVksZ0RBQVosRUFBNkQ7QUFBQ29XLFNBQU8sQ0FBQ25XLENBQUQsRUFBRztBQUFDbVcsV0FBTyxHQUFDblcsQ0FBUjtBQUFVOztBQUF0QixDQUE3RCxFQUFxRixDQUFyRjtBQUl4SixNQUFNMFcscUJBQXFCLEdBQUcsSUFBSXBVLFlBQUosQ0FBaUI7QUFDN0MyRixJQUFFLEVBQUU7QUFDRnhFLFFBQUksRUFBRUM7QUFESixHQUR5QztBQUk3QytHLE9BQUssRUFBRTtBQUNMaEgsUUFBSSxFQUFFQztBQURELEdBSnNDO0FBTzdDaUgsVUFBUSxFQUFFO0FBQ1JsSCxRQUFJLEVBQUVDO0FBREU7QUFQbUMsQ0FBakIsQ0FBOUI7O0FBWUEsTUFBTStGLGVBQWUsR0FBSTVILEtBQUQsSUFBVztBQUNqQyxNQUFJO0FBQ0YsVUFBTWMsUUFBUSxHQUFHZCxLQUFqQjtBQUNBNlUseUJBQXFCLENBQUNyVixRQUF0QixDQUErQnNCLFFBQS9CO0FBRUEsVUFBTWdVLElBQUksR0FBR2pPLElBQUksQ0FBQ0MsU0FBTCxDQUFlO0FBQzFCVixRQUFFLEVBQUV0RixRQUFRLENBQUNzRixFQURhO0FBRTFCd0MsV0FBSyxFQUFFOUgsUUFBUSxDQUFDOEgsS0FGVTtBQUcxQkUsY0FBUSxFQUFFaEksUUFBUSxDQUFDZ0k7QUFITyxLQUFmLENBQWI7QUFNQSxVQUFNNEwsR0FBRyxHQUFHbEcsTUFBTSxDQUFDc0csSUFBRCxDQUFOLENBQWFqRyxRQUFiLENBQXNCLEtBQXRCLENBQVo7QUFDQSxVQUFNMkIsSUFBSSxHQUFHOEQsT0FBTyxDQUFDUyxTQUFSLENBQWtCTCxHQUFsQixDQUFiO0FBQ0EsV0FBT2xFLElBQVA7QUFDRCxHQWJELENBYUUsT0FBT3pKLFNBQVAsRUFBa0I7QUFDbEIsVUFBTSxJQUFJL0ksTUFBTSxDQUFDOEIsS0FBWCxDQUFpQixvQ0FBakIsRUFBdURpSCxTQUF2RCxDQUFOO0FBQ0Q7QUFDRixDQWpCRDs7QUFoQkE5SSxNQUFNLENBQUMrSSxhQUFQLENBbUNlWSxlQW5DZixFOzs7Ozs7Ozs7OztBQ0FBLElBQUk1SixNQUFKO0FBQVdDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGVBQVosRUFBNEI7QUFBQ0YsUUFBTSxDQUFDRyxDQUFELEVBQUc7QUFBQ0gsVUFBTSxHQUFDRyxDQUFQO0FBQVM7O0FBQXBCLENBQTVCLEVBQWtELENBQWxEO0FBQXFELElBQUlzQyxZQUFKO0FBQWlCeEMsTUFBTSxDQUFDQyxJQUFQLENBQVksY0FBWixFQUEyQjtBQUFDbUIsU0FBTyxDQUFDbEIsQ0FBRCxFQUFHO0FBQUNzQyxnQkFBWSxHQUFDdEMsQ0FBYjtBQUFlOztBQUEzQixDQUEzQixFQUF3RCxDQUF4RDtBQUEyRCxJQUFJMkosVUFBSjtBQUFlN0osTUFBTSxDQUFDQyxJQUFQLENBQVksMkNBQVosRUFBd0Q7QUFBQzRKLFlBQVUsQ0FBQzNKLENBQUQsRUFBRztBQUFDMkosY0FBVSxHQUFDM0osQ0FBWDtBQUFhOztBQUE1QixDQUF4RCxFQUFzRixDQUF0RjtBQUkzSixNQUFNNlcsaUJBQWlCLEdBQUcsY0FBMUI7QUFDQSxNQUFNQyxtQkFBbUIsR0FBRyxJQUFJeFUsWUFBSixDQUFpQjtBQUMzQ3VJLFVBQVEsRUFBRTtBQUNScEgsUUFBSSxFQUFFQztBQURFLEdBRGlDO0FBSTNDakMsTUFBSSxFQUFFO0FBQ0pnQyxRQUFJLEVBQUVzVCxNQURGO0FBRUpDLFlBQVEsRUFBRTtBQUZOO0FBSnFDLENBQWpCLENBQTVCOztBQVVBLE1BQU16TixhQUFhLEdBQUk5SCxJQUFELElBQVU7QUFDOUIsTUFBSTtBQUNGLFVBQU02RixPQUFPLEdBQUc3RixJQUFoQixDQURFLENBRUY7O0FBRUFxVix1QkFBbUIsQ0FBQ3pWLFFBQXBCLENBQTZCaUcsT0FBN0I7QUFDQXFDLGNBQVUsQ0FBQywrQkFBRCxDQUFWOztBQUVBLFFBQUlzTixNQUFKOztBQUNBLFFBQUlwTSxRQUFRLEdBQUd2RCxPQUFPLENBQUN1RCxRQUF2QixDQVJFLENBU0g7O0FBRUMsT0FBRztBQUNEb00sWUFBTSxHQUFHSixpQkFBaUIsQ0FBQ0ssSUFBbEIsQ0FBdUJyTSxRQUF2QixDQUFUO0FBQ0EsVUFBR29NLE1BQUgsRUFBV3BNLFFBQVEsR0FBR3NNLG1CQUFtQixDQUFDdE0sUUFBRCxFQUFXb00sTUFBWCxFQUFtQjNQLE9BQU8sQ0FBQzdGLElBQVIsQ0FBYXdWLE1BQU0sQ0FBQyxDQUFELENBQW5CLENBQW5CLENBQTlCO0FBQ1osS0FIRCxRQUdTQSxNQUhUOztBQUlBLFdBQU9wTSxRQUFQO0FBQ0QsR0FoQkQsQ0FnQkUsT0FBT2pDLFNBQVAsRUFBa0I7QUFDbEIsVUFBTSxJQUFJL0ksTUFBTSxDQUFDOEIsS0FBWCxDQUFpQixnQ0FBakIsRUFBbURpSCxTQUFuRCxDQUFOO0FBQ0Q7QUFDRixDQXBCRDs7QUFzQkEsU0FBU3VPLG1CQUFULENBQTZCdE0sUUFBN0IsRUFBdUNvTSxNQUF2QyxFQUErQ0csT0FBL0MsRUFBd0Q7QUFDdEQsTUFBSUMsR0FBRyxHQUFHRCxPQUFWO0FBQ0EsTUFBR0EsT0FBTyxLQUFLOU8sU0FBZixFQUEwQitPLEdBQUcsR0FBRyxFQUFOO0FBQzFCLFNBQU94TSxRQUFRLENBQUN3RCxTQUFULENBQW1CLENBQW5CLEVBQXNCNEksTUFBTSxDQUFDalQsS0FBN0IsSUFBb0NxVCxHQUFwQyxHQUF3Q3hNLFFBQVEsQ0FBQ3dELFNBQVQsQ0FBbUI0SSxNQUFNLENBQUNqVCxLQUFQLEdBQWFpVCxNQUFNLENBQUMsQ0FBRCxDQUFOLENBQVVqTCxNQUExQyxDQUEvQztBQUNEOztBQXpDRGxNLE1BQU0sQ0FBQytJLGFBQVAsQ0EyQ2VVLGFBM0NmLEU7Ozs7Ozs7Ozs7O0FDQUEsSUFBSTFKLE1BQUo7QUFBV0MsTUFBTSxDQUFDQyxJQUFQLENBQVksZUFBWixFQUE0QjtBQUFDRixRQUFNLENBQUNHLENBQUQsRUFBRztBQUFDSCxVQUFNLEdBQUNHLENBQVA7QUFBUzs7QUFBcEIsQ0FBNUIsRUFBa0QsQ0FBbEQ7QUFBcUQsSUFBSXNDLFlBQUo7QUFBaUJ4QyxNQUFNLENBQUNDLElBQVAsQ0FBWSxjQUFaLEVBQTJCO0FBQUNtQixTQUFPLENBQUNsQixDQUFELEVBQUc7QUFBQ3NDLGdCQUFZLEdBQUN0QyxDQUFiO0FBQWU7O0FBQTNCLENBQTNCLEVBQXdELENBQXhEO0FBQTJELElBQUkySixVQUFKO0FBQWU3SixNQUFNLENBQUNDLElBQVAsQ0FBWSwyQ0FBWixFQUF3RDtBQUFDNEosWUFBVSxDQUFDM0osQ0FBRCxFQUFHO0FBQUMySixjQUFVLEdBQUMzSixDQUFYO0FBQWE7O0FBQTVCLENBQXhELEVBQXNGLENBQXRGO0FBQXlGLElBQUlzWCwyQkFBSjtBQUFnQ3hYLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGdEQUFaLEVBQTZEO0FBQUN1WCw2QkFBMkIsQ0FBQ3RYLENBQUQsRUFBRztBQUFDc1gsK0JBQTJCLEdBQUN0WCxDQUE1QjtBQUE4Qjs7QUFBOUQsQ0FBN0QsRUFBNkgsQ0FBN0g7QUFLcFIsTUFBTXVYLGNBQWMsR0FBRyxJQUFJalYsWUFBSixDQUFpQjtBQUN0QytDLE1BQUksRUFBRTtBQUNKNUIsUUFBSSxFQUFFQyxNQURGO0FBRUpDLFNBQUssRUFBRXJCLFlBQVksQ0FBQ3NCLEtBQWIsQ0FBbUIrSDtBQUZ0QixHQURnQztBQUt0Q1gsSUFBRSxFQUFFO0FBQ0Z2SCxRQUFJLEVBQUVDLE1BREo7QUFFRkMsU0FBSyxFQUFFckIsWUFBWSxDQUFDc0IsS0FBYixDQUFtQitIO0FBRnhCLEdBTGtDO0FBU3RDVixTQUFPLEVBQUU7QUFDUHhILFFBQUksRUFBRUM7QUFEQyxHQVQ2QjtBQVl0Q3dILFNBQU8sRUFBRTtBQUNQekgsUUFBSSxFQUFFQztBQURDLEdBWjZCO0FBZXRDeUgsWUFBVSxFQUFFO0FBQ1YxSCxRQUFJLEVBQUVDLE1BREk7QUFFVkMsU0FBSyxFQUFFckIsWUFBWSxDQUFDc0IsS0FBYixDQUFtQitIO0FBRmhCO0FBZjBCLENBQWpCLENBQXZCOztBQXFCQSxNQUFNNkwsUUFBUSxHQUFJQyxJQUFELElBQVU7QUFDekIsTUFBSTtBQUVGQSxRQUFJLENBQUNwUyxJQUFMLEdBQVlpUywyQkFBWjtBQUVBLFVBQU1JLE9BQU8sR0FBR0QsSUFBaEI7QUFDQTlOLGNBQVUsQ0FBQywwQkFBRCxFQUE0QjtBQUFDcUIsUUFBRSxFQUFDeU0sSUFBSSxDQUFDek0sRUFBVDtBQUFhQyxhQUFPLEVBQUN3TSxJQUFJLENBQUN4TTtBQUExQixLQUE1QixDQUFWO0FBQ0FzTSxrQkFBYyxDQUFDbFcsUUFBZixDQUF3QnFXLE9BQXhCLEVBTkUsQ0FPRjs7QUFDQS9MLFNBQUssQ0FBQ2dNLElBQU4sQ0FBVztBQUNUdFMsVUFBSSxFQUFFb1MsSUFBSSxDQUFDcFMsSUFERjtBQUVUMkYsUUFBRSxFQUFFeU0sSUFBSSxDQUFDek0sRUFGQTtBQUdUQyxhQUFPLEVBQUV3TSxJQUFJLENBQUN4TSxPQUhMO0FBSVQyTSxVQUFJLEVBQUVILElBQUksQ0FBQ3ZNLE9BSkY7QUFLVDJNLGFBQU8sRUFBRTtBQUNQLHVCQUFlSixJQUFJLENBQUN0TTtBQURiO0FBTEEsS0FBWDtBQVVELEdBbEJELENBa0JFLE9BQU92QyxTQUFQLEVBQWtCO0FBQ2xCLFVBQU0sSUFBSS9JLE1BQU0sQ0FBQzhCLEtBQVgsQ0FBaUIsdUJBQWpCLEVBQTBDaUgsU0FBMUMsQ0FBTjtBQUNEO0FBQ0YsQ0F0QkQ7O0FBMUJBOUksTUFBTSxDQUFDK0ksYUFBUCxDQWtEZTJPLFFBbERmLEU7Ozs7Ozs7Ozs7O0FDQUEsSUFBSTNYLE1BQUo7QUFBV0MsTUFBTSxDQUFDQyxJQUFQLENBQVksZUFBWixFQUE0QjtBQUFDRixRQUFNLENBQUNHLENBQUQsRUFBRztBQUFDSCxVQUFNLEdBQUNHLENBQVA7QUFBUzs7QUFBcEIsQ0FBNUIsRUFBa0QsQ0FBbEQ7QUFBcUQsSUFBSThYLEdBQUo7QUFBUWhZLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLDhCQUFaLEVBQTJDO0FBQUMrWCxLQUFHLENBQUM5WCxDQUFELEVBQUc7QUFBQzhYLE9BQUcsR0FBQzlYLENBQUo7QUFBTTs7QUFBZCxDQUEzQyxFQUEyRCxDQUEzRDtBQUE4RCxJQUFJK1gsY0FBSjtBQUFtQmpZLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLDJDQUFaLEVBQXdEO0FBQUNnWSxnQkFBYyxDQUFDL1gsQ0FBRCxFQUFHO0FBQUMrWCxrQkFBYyxHQUFDL1gsQ0FBZjtBQUFpQjs7QUFBcEMsQ0FBeEQsRUFBOEYsQ0FBOUY7O0FBSXpKLE1BQU1nWSxvQ0FBb0MsR0FBRyxNQUFNO0FBQ2pELE1BQUk7QUFDRixVQUFNaEosR0FBRyxHQUFHLElBQUk4SSxHQUFKLENBQVFDLGNBQVIsRUFBd0IscUJBQXhCLEVBQStDLEVBQS9DLENBQVo7QUFDQS9JLE9BQUcsQ0FBQ2lKLEtBQUosQ0FBVTtBQUFDQyxhQUFPLEVBQUUsRUFBVjtBQUFjQyxVQUFJLEVBQUUsS0FBRztBQUF2QixLQUFWLEVBQXlDQyxJQUF6QyxDQUE4QztBQUFDQyxtQkFBYSxFQUFFO0FBQWhCLEtBQTlDO0FBQ0QsR0FIRCxDQUdFLE9BQU96UCxTQUFQLEVBQWtCO0FBQ2xCLFVBQU0sSUFBSS9JLE1BQU0sQ0FBQzhCLEtBQVgsQ0FBaUIsa0RBQWpCLEVBQXFFaUgsU0FBckUsQ0FBTjtBQUNEO0FBQ0YsQ0FQRDs7QUFKQTlJLE1BQU0sQ0FBQytJLGFBQVAsQ0FhZW1QLG9DQWJmLEU7Ozs7Ozs7Ozs7O0FDQUEsSUFBSW5ZLE1BQUo7QUFBV0MsTUFBTSxDQUFDQyxJQUFQLENBQVksZUFBWixFQUE0QjtBQUFDRixRQUFNLENBQUNHLENBQUQsRUFBRztBQUFDSCxVQUFNLEdBQUNHLENBQVA7QUFBUzs7QUFBcEIsQ0FBNUIsRUFBa0QsQ0FBbEQ7QUFBcUQsSUFBSXNDLFlBQUo7QUFBaUJ4QyxNQUFNLENBQUNDLElBQVAsQ0FBWSxjQUFaLEVBQTJCO0FBQUNtQixTQUFPLENBQUNsQixDQUFELEVBQUc7QUFBQ3NDLGdCQUFZLEdBQUN0QyxDQUFiO0FBQWU7O0FBQTNCLENBQTNCLEVBQXdELENBQXhEO0FBQTJELElBQUk4WCxHQUFKO0FBQVFoWSxNQUFNLENBQUNDLElBQVAsQ0FBWSw4QkFBWixFQUEyQztBQUFDK1gsS0FBRyxDQUFDOVgsQ0FBRCxFQUFHO0FBQUM4WCxPQUFHLEdBQUM5WCxDQUFKO0FBQU07O0FBQWQsQ0FBM0MsRUFBMkQsQ0FBM0Q7QUFBOEQsSUFBSXNZLFFBQUo7QUFBYXhZLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLHFDQUFaLEVBQWtEO0FBQUN1WSxVQUFRLENBQUN0WSxDQUFELEVBQUc7QUFBQ3NZLFlBQVEsR0FBQ3RZLENBQVQ7QUFBVzs7QUFBeEIsQ0FBbEQsRUFBNEUsQ0FBNUU7QUFLL04sTUFBTXVZLDRCQUE0QixHQUFHLElBQUlqVyxZQUFKLENBQWlCO0FBQ3BEbEIsTUFBSSxFQUFFO0FBQ0pxQyxRQUFJLEVBQUVDO0FBREYsR0FEOEM7QUFJcERvRyxRQUFNLEVBQUU7QUFDTnJHLFFBQUksRUFBRUM7QUFEQTtBQUo0QyxDQUFqQixDQUFyQzs7QUFTQSxNQUFNZ0ssc0JBQXNCLEdBQUlqTSxJQUFELElBQVU7QUFDdkMsTUFBSTtBQUNGLFVBQU02RixPQUFPLEdBQUc3RixJQUFoQjtBQUNBOFcsZ0NBQTRCLENBQUNsWCxRQUE3QixDQUFzQ2lHLE9BQXRDO0FBQ0EsVUFBTTBILEdBQUcsR0FBRyxJQUFJOEksR0FBSixDQUFRUSxRQUFSLEVBQWtCLGtCQUFsQixFQUFzQ2hSLE9BQXRDLENBQVo7QUFDQTBILE9BQUcsQ0FBQ2lKLEtBQUosQ0FBVTtBQUFDQyxhQUFPLEVBQUUsQ0FBVjtBQUFhQyxVQUFJLEVBQUUsSUFBRSxFQUFGLEdBQUs7QUFBeEIsS0FBVixFQUEwQ0MsSUFBMUMsR0FKRSxDQUlnRDtBQUNuRCxHQUxELENBS0UsT0FBT3hQLFNBQVAsRUFBa0I7QUFDbEIsVUFBTSxJQUFJL0ksTUFBTSxDQUFDOEIsS0FBWCxDQUFpQixvQ0FBakIsRUFBdURpSCxTQUF2RCxDQUFOO0FBQ0Q7QUFDRixDQVREOztBQWRBOUksTUFBTSxDQUFDK0ksYUFBUCxDQXlCZTZFLHNCQXpCZixFOzs7Ozs7Ozs7OztBQ0FBLElBQUk3TixNQUFKO0FBQVdDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGVBQVosRUFBNEI7QUFBQ0YsUUFBTSxDQUFDRyxDQUFELEVBQUc7QUFBQ0gsVUFBTSxHQUFDRyxDQUFQO0FBQVM7O0FBQXBCLENBQTVCLEVBQWtELENBQWxEO0FBQXFELElBQUk4WCxHQUFKO0FBQVFoWSxNQUFNLENBQUNDLElBQVAsQ0FBWSw4QkFBWixFQUEyQztBQUFDK1gsS0FBRyxDQUFDOVgsQ0FBRCxFQUFHO0FBQUM4WCxPQUFHLEdBQUM5WCxDQUFKO0FBQU07O0FBQWQsQ0FBM0MsRUFBMkQsQ0FBM0Q7QUFBOEQsSUFBSXNDLFlBQUo7QUFBaUJ4QyxNQUFNLENBQUNDLElBQVAsQ0FBWSxjQUFaLEVBQTJCO0FBQUNtQixTQUFPLENBQUNsQixDQUFELEVBQUc7QUFBQ3NDLGdCQUFZLEdBQUN0QyxDQUFiO0FBQWU7O0FBQTNCLENBQTNCLEVBQXdELENBQXhEO0FBQTJELElBQUkrWCxjQUFKO0FBQW1CalksTUFBTSxDQUFDQyxJQUFQLENBQVksMkNBQVosRUFBd0Q7QUFBQ2dZLGdCQUFjLENBQUMvWCxDQUFELEVBQUc7QUFBQytYLGtCQUFjLEdBQUMvWCxDQUFmO0FBQWlCOztBQUFwQyxDQUF4RCxFQUE4RixDQUE5RjtBQUtyTyxNQUFNd1ksNEJBQTRCLEdBQUcsSUFBSWxXLFlBQUosQ0FBaUI7QUFDcEQ0QixRQUFNLEVBQUU7QUFDTlQsUUFBSSxFQUFFQztBQURBLEdBRDRDO0FBSXBEdUcsV0FBUyxFQUFFO0FBQ1R4RyxRQUFJLEVBQUVDO0FBREcsR0FKeUM7QUFPcERvUSxVQUFRLEVBQUU7QUFDUnJRLFFBQUksRUFBRUMsTUFERTtBQUVSSSxZQUFRLEVBQUM7QUFGRCxHQVAwQztBQVdwRGdHLFFBQU0sRUFBRTtBQUNOckcsUUFBSSxFQUFFQztBQURBLEdBWDRDO0FBY3BEcVEsU0FBTyxFQUFFO0FBQ1B0USxRQUFJLEVBQUVUO0FBREM7QUFkMkMsQ0FBakIsQ0FBckM7O0FBbUJBLE1BQU1nVCxzQkFBc0IsR0FBSXZQLEtBQUQsSUFBVztBQUN4QyxNQUFJO0FBQ0YsVUFBTXNILFFBQVEsR0FBR3RILEtBQWpCO0FBQ0ErUixnQ0FBNEIsQ0FBQ25YLFFBQTdCLENBQXNDME0sUUFBdEM7QUFDQSxVQUFNaUIsR0FBRyxHQUFHLElBQUk4SSxHQUFKLENBQVFDLGNBQVIsRUFBd0IsUUFBeEIsRUFBa0NoSyxRQUFsQyxDQUFaO0FBQ0FpQixPQUFHLENBQUNpSixLQUFKLENBQVU7QUFBQ0MsYUFBTyxFQUFFLEVBQVY7QUFBY0MsVUFBSSxFQUFFLElBQUUsRUFBRixHQUFLO0FBQXpCLEtBQVYsRUFBMkNDLElBQTNDLEdBSkUsQ0FJaUQ7QUFDcEQsR0FMRCxDQUtFLE9BQU94UCxTQUFQLEVBQWtCO0FBQ2xCLFVBQU0sSUFBSS9JLE1BQU0sQ0FBQzhCLEtBQVgsQ0FBaUIsb0NBQWpCLEVBQXVEaUgsU0FBdkQsQ0FBTjtBQUNEO0FBQ0YsQ0FURDs7QUF4QkE5SSxNQUFNLENBQUMrSSxhQUFQLENBbUNlbU4sc0JBbkNmLEU7Ozs7Ozs7Ozs7O0FDQUEsSUFBSW5XLE1BQUo7QUFBV0MsTUFBTSxDQUFDQyxJQUFQLENBQVksZUFBWixFQUE0QjtBQUFDRixRQUFNLENBQUNHLENBQUQsRUFBRztBQUFDSCxVQUFNLEdBQUNHLENBQVA7QUFBUzs7QUFBcEIsQ0FBNUIsRUFBa0QsQ0FBbEQ7QUFBcUQsSUFBSThYLEdBQUo7QUFBUWhZLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLDhCQUFaLEVBQTJDO0FBQUMrWCxLQUFHLENBQUM5WCxDQUFELEVBQUc7QUFBQzhYLE9BQUcsR0FBQzlYLENBQUo7QUFBTTs7QUFBZCxDQUEzQyxFQUEyRCxDQUEzRDtBQUE4RCxJQUFJc0MsWUFBSjtBQUFpQnhDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGNBQVosRUFBMkI7QUFBQ21CLFNBQU8sQ0FBQ2xCLENBQUQsRUFBRztBQUFDc0MsZ0JBQVksR0FBQ3RDLENBQWI7QUFBZTs7QUFBM0IsQ0FBM0IsRUFBd0QsQ0FBeEQ7QUFBMkQsSUFBSXlZLFFBQUo7QUFBYTNZLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLHFDQUFaLEVBQWtEO0FBQUMwWSxVQUFRLENBQUN6WSxDQUFELEVBQUc7QUFBQ3lZLFlBQVEsR0FBQ3pZLENBQVQ7QUFBVzs7QUFBeEIsQ0FBbEQsRUFBNEUsQ0FBNUU7QUFLL04sTUFBTTBZLG9CQUFvQixHQUFHLElBQUlwVyxZQUFKLENBQWlCO0FBQzVDOzs7O0FBSUEwSSxJQUFFLEVBQUU7QUFDRnZILFFBQUksRUFBRUMsTUFESjtBQUVGQyxTQUFLLEVBQUVyQixZQUFZLENBQUNzQixLQUFiLENBQW1CK0g7QUFGeEIsR0FMd0M7QUFTNUNWLFNBQU8sRUFBRTtBQUNQeEgsUUFBSSxFQUFFQztBQURDLEdBVG1DO0FBWTVDd0gsU0FBTyxFQUFFO0FBQ1B6SCxRQUFJLEVBQUVDO0FBREMsR0FabUM7QUFlNUN5SCxZQUFVLEVBQUU7QUFDVjFILFFBQUksRUFBRUMsTUFESTtBQUVWQyxTQUFLLEVBQUVyQixZQUFZLENBQUNzQixLQUFiLENBQW1CK0g7QUFGaEI7QUFmZ0MsQ0FBakIsQ0FBN0I7O0FBcUJBLE1BQU1qQyxjQUFjLEdBQUkrTixJQUFELElBQVU7QUFDL0IsTUFBSTtBQUNGLFVBQU1DLE9BQU8sR0FBR0QsSUFBaEI7QUFDQWlCLHdCQUFvQixDQUFDclgsUUFBckIsQ0FBOEJxVyxPQUE5QjtBQUNBLFVBQU0xSSxHQUFHLEdBQUcsSUFBSThJLEdBQUosQ0FBUVcsUUFBUixFQUFrQixNQUFsQixFQUEwQmYsT0FBMUIsQ0FBWjtBQUNBMUksT0FBRyxDQUFDaUosS0FBSixDQUFVO0FBQUNDLGFBQU8sRUFBRSxDQUFWO0FBQWFDLFVBQUksRUFBRSxLQUFHO0FBQXRCLEtBQVYsRUFBd0NDLElBQXhDO0FBQ0QsR0FMRCxDQUtFLE9BQU94UCxTQUFQLEVBQWtCO0FBQ2xCLFVBQU0sSUFBSS9JLE1BQU0sQ0FBQzhCLEtBQVgsQ0FBaUIsNEJBQWpCLEVBQStDaUgsU0FBL0MsQ0FBTjtBQUNEO0FBQ0YsQ0FURDs7QUExQkE5SSxNQUFNLENBQUMrSSxhQUFQLENBcUNlYSxjQXJDZixFOzs7Ozs7Ozs7OztBQ0FBLElBQUk3SixNQUFKO0FBQVdDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGVBQVosRUFBNEI7QUFBQ0YsUUFBTSxDQUFDRyxDQUFELEVBQUc7QUFBQ0gsVUFBTSxHQUFDRyxDQUFQO0FBQVM7O0FBQXBCLENBQTVCLEVBQWtELENBQWxEO0FBQXFELElBQUlzQyxZQUFKO0FBQWlCeEMsTUFBTSxDQUFDQyxJQUFQLENBQVksY0FBWixFQUEyQjtBQUFDbUIsU0FBTyxDQUFDbEIsQ0FBRCxFQUFHO0FBQUNzQyxnQkFBWSxHQUFDdEMsQ0FBYjtBQUFlOztBQUEzQixDQUEzQixFQUF3RCxDQUF4RDtBQUEyRCxJQUFJOFgsR0FBSjtBQUFRaFksTUFBTSxDQUFDQyxJQUFQLENBQVksOEJBQVosRUFBMkM7QUFBQytYLEtBQUcsQ0FBQzlYLENBQUQsRUFBRztBQUFDOFgsT0FBRyxHQUFDOVgsQ0FBSjtBQUFNOztBQUFkLENBQTNDLEVBQTJELENBQTNEO0FBQThELElBQUkrWCxjQUFKO0FBQW1CalksTUFBTSxDQUFDQyxJQUFQLENBQVksMkNBQVosRUFBd0Q7QUFBQ2dZLGdCQUFjLENBQUMvWCxDQUFELEVBQUc7QUFBQytYLGtCQUFjLEdBQUMvWCxDQUFmO0FBQWlCOztBQUFwQyxDQUF4RCxFQUE4RixDQUE5RjtBQUtyTyxNQUFNMlksNEJBQTRCLEdBQUcsSUFBSXJXLFlBQUosQ0FBaUI7QUFDcEQ0QixRQUFNLEVBQUU7QUFDTlQsUUFBSSxFQUFFQztBQURBLEdBRDRDO0FBSXBEZ0QsT0FBSyxFQUFFO0FBQ0xqRCxRQUFJLEVBQUVDO0FBREQsR0FKNkM7QUFPcEQrUSxhQUFXLEVBQUU7QUFDWGhSLFFBQUksRUFBRUM7QUFESyxHQVB1QztBQVVwRDhRLE1BQUksRUFBRTtBQUNGL1EsUUFBSSxFQUFFQztBQURKO0FBVjhDLENBQWpCLENBQXJDOztBQWVBLE1BQU1rVixzQkFBc0IsR0FBSW5TLEtBQUQsSUFBVztBQUN4QyxNQUFJO0FBQ0YsVUFBTXNILFFBQVEsR0FBR3RILEtBQWpCO0FBQ0FrUyxnQ0FBNEIsQ0FBQ3RYLFFBQTdCLENBQXNDME0sUUFBdEM7QUFDQSxVQUFNaUIsR0FBRyxHQUFHLElBQUk4SSxHQUFKLENBQVFDLGNBQVIsRUFBd0IsUUFBeEIsRUFBa0NoSyxRQUFsQyxDQUFaO0FBQ0FpQixPQUFHLENBQUNpSixLQUFKLENBQVU7QUFBQ0MsYUFBTyxFQUFFLEdBQVY7QUFBZUMsVUFBSSxFQUFFLElBQUUsRUFBRixHQUFLO0FBQTFCLEtBQVYsRUFBNENDLElBQTVDO0FBQ0QsR0FMRCxDQUtFLE9BQU94UCxTQUFQLEVBQWtCO0FBQ2xCLFVBQU0sSUFBSS9JLE1BQU0sQ0FBQzhCLEtBQVgsQ0FBaUIsb0NBQWpCLEVBQXVEaUgsU0FBdkQsQ0FBTjtBQUNEO0FBQ0YsQ0FURDs7QUFwQkE5SSxNQUFNLENBQUMrSSxhQUFQLENBK0JlK1Asc0JBL0JmLEU7Ozs7Ozs7Ozs7O0FDQUEsSUFBSS9ZLE1BQUo7QUFBV0MsTUFBTSxDQUFDQyxJQUFQLENBQVksZUFBWixFQUE0QjtBQUFDRixRQUFNLENBQUNHLENBQUQsRUFBRztBQUFDSCxVQUFNLEdBQUNHLENBQVA7QUFBUzs7QUFBcEIsQ0FBNUIsRUFBa0QsQ0FBbEQ7QUFBcUQsSUFBSWEsSUFBSjtBQUFTZixNQUFNLENBQUNDLElBQVAsQ0FBWSxzQkFBWixFQUFtQztBQUFDbUIsU0FBTyxDQUFDbEIsQ0FBRCxFQUFHO0FBQUNhLFFBQUksR0FBQ2IsQ0FBTDtBQUFPOztBQUFuQixDQUFuQyxFQUF3RCxDQUF4RDs7QUFHekU7QUFDQTtBQUNBO0FBQ0EsTUFBTWtILFlBQVksR0FBRyxNQUFNO0FBQ3pCLE1BQUk7QUFDRixXQUFPckcsSUFBSSxDQUFDcUcsWUFBTCxFQUFQO0FBQ0QsR0FGRCxDQUVFLE9BQU8wQixTQUFQLEVBQWtCO0FBQ2xCLFVBQU0sSUFBSS9JLE1BQU0sQ0FBQzhCLEtBQVgsQ0FBaUIseUJBQWpCLEVBQTRDaUgsU0FBNUMsQ0FBTjtBQUNEO0FBQ0YsQ0FORDs7QUFOQTlJLE1BQU0sQ0FBQytJLGFBQVAsQ0FjZTNCLFlBZGYsRTs7Ozs7Ozs7Ozs7QUNBQSxJQUFJckgsTUFBSjtBQUFXQyxNQUFNLENBQUNDLElBQVAsQ0FBWSxlQUFaLEVBQTRCO0FBQUNGLFFBQU0sQ0FBQ0csQ0FBRCxFQUFHO0FBQUNILFVBQU0sR0FBQ0csQ0FBUDtBQUFTOztBQUFwQixDQUE1QixFQUFrRCxDQUFsRDtBQUFxRCxJQUFJc0MsWUFBSjtBQUFpQnhDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGNBQVosRUFBMkI7QUFBQ21CLFNBQU8sQ0FBQ2xCLENBQUQsRUFBRztBQUFDc0MsZ0JBQVksR0FBQ3RDLENBQWI7QUFBZTs7QUFBM0IsQ0FBM0IsRUFBd0QsQ0FBeEQ7QUFBMkQsSUFBSW9ILElBQUo7QUFBU3RILE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLDJCQUFaLEVBQXdDO0FBQUNxSCxNQUFJLENBQUNwSCxDQUFELEVBQUc7QUFBQ29ILFFBQUksR0FBQ3BILENBQUw7QUFBTzs7QUFBaEIsQ0FBeEMsRUFBMEQsQ0FBMUQ7QUFJckosTUFBTTZZLHFCQUFxQixHQUFHLElBQUl2VyxZQUFKLENBQWlCO0FBQzdDaUYsS0FBRyxFQUFFO0FBQ0g5RCxRQUFJLEVBQUVDO0FBREgsR0FEd0M7QUFJN0NnRCxPQUFLLEVBQUU7QUFDTGpELFFBQUksRUFBRUM7QUFERDtBQUpzQyxDQUFqQixDQUE5Qjs7QUFTQSxNQUFNaUwsZUFBZSxHQUFJbE4sSUFBRCxJQUFVO0FBQ2hDLE1BQUk7QUFDRixVQUFNNkYsT0FBTyxHQUFHN0YsSUFBaEI7QUFDQW9YLHlCQUFxQixDQUFDeFgsUUFBdEIsQ0FBK0JpRyxPQUEvQjtBQUNBLFVBQU13UixJQUFJLEdBQUcxUixJQUFJLENBQUNvRCxPQUFMLENBQWE7QUFBQ2pELFNBQUcsRUFBRUQsT0FBTyxDQUFDQztBQUFkLEtBQWIsQ0FBYjtBQUNBLFFBQUd1UixJQUFJLEtBQUt4USxTQUFaLEVBQXVCbEIsSUFBSSxDQUFDbEUsTUFBTCxDQUFZO0FBQUNNLFNBQUcsRUFBR3NWLElBQUksQ0FBQ3RWO0FBQVosS0FBWixFQUE4QjtBQUFDd04sVUFBSSxFQUFFO0FBQzFEdEssYUFBSyxFQUFFWSxPQUFPLENBQUNaO0FBRDJDO0FBQVAsS0FBOUIsRUFBdkIsS0FHSyxPQUFPVSxJQUFJLENBQUMzRSxNQUFMLENBQVk7QUFDdEI4RSxTQUFHLEVBQUVELE9BQU8sQ0FBQ0MsR0FEUztBQUV0QmIsV0FBSyxFQUFFWSxPQUFPLENBQUNaO0FBRk8sS0FBWixDQUFQO0FBSU4sR0FYRCxDQVdFLE9BQU9rQyxTQUFQLEVBQWtCO0FBQ2xCLFVBQU0sSUFBSS9JLE1BQU0sQ0FBQzhCLEtBQVgsQ0FBaUIsNEJBQWpCLEVBQStDaUgsU0FBL0MsQ0FBTjtBQUNEO0FBQ0YsQ0FmRDs7QUFiQTlJLE1BQU0sQ0FBQytJLGFBQVAsQ0E4QmU4RixlQTlCZixFOzs7Ozs7Ozs7OztBQ0FBLElBQUk5TyxNQUFKO0FBQVdDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGVBQVosRUFBNEI7QUFBQ0YsUUFBTSxDQUFDRyxDQUFELEVBQUc7QUFBQ0gsVUFBTSxHQUFDRyxDQUFQO0FBQVM7O0FBQXBCLENBQTVCLEVBQWtELENBQWxEO0FBQXFELElBQUlzQyxZQUFKO0FBQWlCeEMsTUFBTSxDQUFDQyxJQUFQLENBQVksY0FBWixFQUEyQjtBQUFDbUIsU0FBTyxDQUFDbEIsQ0FBRCxFQUFHO0FBQUNzQyxnQkFBWSxHQUFDdEMsQ0FBYjtBQUFlOztBQUEzQixDQUEzQixFQUF3RCxDQUF4RDtBQUEyRCxJQUFJRSxNQUFKO0FBQVdKLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGlDQUFaLEVBQThDO0FBQUNHLFFBQU0sQ0FBQ0YsQ0FBRCxFQUFHO0FBQUNFLFVBQU0sR0FBQ0YsQ0FBUDtBQUFTOztBQUFwQixDQUE5QyxFQUFvRSxDQUFwRTtBQUl2SixNQUFNK1ksY0FBYyxHQUFHLElBQUl6VyxZQUFKLENBQWlCO0FBQ3RDbEIsTUFBSSxFQUFFO0FBQ0pxQyxRQUFJLEVBQUVDO0FBREY7QUFEZ0MsQ0FBakIsQ0FBdkI7O0FBTUEsTUFBTXpDLFFBQVEsR0FBSVksS0FBRCxJQUFXO0FBQzFCLE1BQUk7QUFDRixVQUFNYyxRQUFRLEdBQUdkLEtBQWpCO0FBQ0FrWCxrQkFBYyxDQUFDMVgsUUFBZixDQUF3QnNCLFFBQXhCO0FBQ0EsVUFBTTZGLE1BQU0sR0FBR3RJLE1BQU0sQ0FBQ00sSUFBUCxDQUFZO0FBQUMwRCxZQUFNLEVBQUV2QixRQUFRLENBQUN2QjtBQUFsQixLQUFaLEVBQXFDNFgsS0FBckMsRUFBZjtBQUNBLFFBQUd4USxNQUFNLENBQUN3RCxNQUFQLEdBQWdCLENBQW5CLEVBQXNCLE9BQU94RCxNQUFNLENBQUMsQ0FBRCxDQUFOLENBQVVoRixHQUFqQjtBQUN0QixVQUFNK0csT0FBTyxHQUFHckssTUFBTSxDQUFDdUMsTUFBUCxDQUFjO0FBQzVCeUIsWUFBTSxFQUFFdkIsUUFBUSxDQUFDdkI7QUFEVyxLQUFkLENBQWhCO0FBR0EsV0FBT21KLE9BQVA7QUFDRCxHQVRELENBU0UsT0FBTzNCLFNBQVAsRUFBa0I7QUFDbEIsVUFBTSxJQUFJL0ksTUFBTSxDQUFDOEIsS0FBWCxDQUFpQix1QkFBakIsRUFBMENpSCxTQUExQyxDQUFOO0FBQ0Q7QUFDRixDQWJEOztBQVZBOUksTUFBTSxDQUFDK0ksYUFBUCxDQXlCZTVILFFBekJmLEU7Ozs7Ozs7Ozs7O0FDQUEsSUFBSXBCLE1BQUo7QUFBV0MsTUFBTSxDQUFDQyxJQUFQLENBQVksZUFBWixFQUE0QjtBQUFDRixRQUFNLENBQUNHLENBQUQsRUFBRztBQUFDSCxVQUFNLEdBQUNHLENBQVA7QUFBUzs7QUFBcEIsQ0FBNUIsRUFBa0QsQ0FBbEQ7QUFBcUQsSUFBSXNDLFlBQUo7QUFBaUJ4QyxNQUFNLENBQUNDLElBQVAsQ0FBWSxjQUFaLEVBQTJCO0FBQUNtQixTQUFPLENBQUNsQixDQUFELEVBQUc7QUFBQ3NDLGdCQUFZLEdBQUN0QyxDQUFiO0FBQWU7O0FBQTNCLENBQTNCLEVBQXdELENBQXhEO0FBQTJELElBQUlpWixZQUFKO0FBQWlCblosTUFBTSxDQUFDQyxJQUFQLENBQVksc0JBQVosRUFBbUM7QUFBQ21CLFNBQU8sQ0FBQ2xCLENBQUQsRUFBRztBQUFDaVosZ0JBQVksR0FBQ2paLENBQWI7QUFBZTs7QUFBM0IsQ0FBbkMsRUFBZ0UsQ0FBaEU7QUFBbUUsSUFBSWtaLFNBQUo7QUFBY3BaLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLG1CQUFaLEVBQWdDO0FBQUNtQixTQUFPLENBQUNsQixDQUFELEVBQUc7QUFBQ2taLGFBQVMsR0FBQ2xaLENBQVY7QUFBWTs7QUFBeEIsQ0FBaEMsRUFBMEQsQ0FBMUQ7QUFBNkQsSUFBSUUsTUFBSjtBQUFXSixNQUFNLENBQUNDLElBQVAsQ0FBWSxpQ0FBWixFQUE4QztBQUFDRyxRQUFNLENBQUNGLENBQUQsRUFBRztBQUFDRSxVQUFNLEdBQUNGLENBQVA7QUFBUzs7QUFBcEIsQ0FBOUMsRUFBb0UsQ0FBcEU7QUFBdUUsSUFBSWtXLGlCQUFKO0FBQXNCcFcsTUFBTSxDQUFDQyxJQUFQLENBQVksb0NBQVosRUFBaUQ7QUFBQ21CLFNBQU8sQ0FBQ2xCLENBQUQsRUFBRztBQUFDa1cscUJBQWlCLEdBQUNsVyxDQUFsQjtBQUFvQjs7QUFBaEMsQ0FBakQsRUFBbUYsQ0FBbkY7QUFBc0YsSUFBSTRKLFFBQUosRUFBYWhDLE9BQWI7QUFBcUI5SCxNQUFNLENBQUNDLElBQVAsQ0FBWSwyQ0FBWixFQUF3RDtBQUFDNkosVUFBUSxDQUFDNUosQ0FBRCxFQUFHO0FBQUM0SixZQUFRLEdBQUM1SixDQUFUO0FBQVcsR0FBeEI7O0FBQXlCNEgsU0FBTyxDQUFDNUgsQ0FBRCxFQUFHO0FBQUM0SCxXQUFPLEdBQUM1SCxDQUFSO0FBQVU7O0FBQTlDLENBQXhELEVBQXdHLENBQXhHO0FBUzlmLE1BQU0rWSxjQUFjLEdBQUcsSUFBSXpXLFlBQUosQ0FBaUI7QUFDdEM2VyxnQkFBYyxFQUFFO0FBQ2QxVixRQUFJLEVBQUVDLE1BRFE7QUFFZEMsU0FBSyxFQUFFckIsWUFBWSxDQUFDc0IsS0FBYixDQUFtQitIO0FBRlosR0FEc0I7QUFLdEN5TixhQUFXLEVBQUU7QUFDWDNWLFFBQUksRUFBRUMsTUFESztBQUVYQyxTQUFLLEVBQUVyQixZQUFZLENBQUNzQixLQUFiLENBQW1CK0g7QUFGZixHQUx5QjtBQVN0Q2xLLE1BQUksRUFBRTtBQUNKZ0MsUUFBSSxFQUFFQyxNQURGO0FBRUpJLFlBQVEsRUFBRTtBQUZOLEdBVGdDO0FBYXRDdVYsWUFBVSxFQUFFO0FBQ1I1VixRQUFJLEVBQUVDLE1BREU7QUFFUkksWUFBUSxFQUFFO0FBRkYsR0FiMEI7QUFpQnRDRSxPQUFLLEVBQUU7QUFDSFAsUUFBSSxFQUFFbkIsWUFBWSxDQUFDMkIsT0FEaEI7QUFFSEgsWUFBUSxFQUFFO0FBRlAsR0FqQitCO0FBcUJ0Q3JELFNBQU8sRUFBRTtBQUNQZ0QsUUFBSSxFQUFFQyxNQURDO0FBRVBDLFNBQUssRUFBRXJCLFlBQVksQ0FBQ3NCLEtBQWIsQ0FBbUJxRTtBQUZuQjtBQXJCNkIsQ0FBakIsQ0FBdkI7O0FBMkJBLE1BQU1oSCxRQUFRLEdBQUlZLEtBQUQsSUFBVztBQUMxQixNQUFJO0FBQ0YsVUFBTWMsUUFBUSxHQUFHZCxLQUFqQjtBQUNBa1gsa0JBQWMsQ0FBQzFYLFFBQWYsQ0FBd0JzQixRQUF4QjtBQUVBLFVBQU1FLFNBQVMsR0FBRztBQUNoQnNELFdBQUssRUFBRXhELFFBQVEsQ0FBQ3dXO0FBREEsS0FBbEI7QUFHQSxVQUFNRyxXQUFXLEdBQUdMLFlBQVksQ0FBQ3BXLFNBQUQsQ0FBaEM7QUFDQSxVQUFNQyxNQUFNLEdBQUc7QUFDYnFELFdBQUssRUFBRXhELFFBQVEsQ0FBQ3lXO0FBREgsS0FBZjtBQUdBLFVBQU1HLFFBQVEsR0FBR0wsU0FBUyxDQUFDcFcsTUFBRCxDQUExQjtBQUVBLFVBQU0wRixNQUFNLEdBQUd0SSxNQUFNLENBQUNNLElBQVAsQ0FBWTtBQUFDcUMsZUFBUyxFQUFFeVcsV0FBWjtBQUF5QnhXLFlBQU0sRUFBRXlXO0FBQWpDLEtBQVosRUFBd0RQLEtBQXhELEVBQWY7QUFDQSxRQUFHeFEsTUFBTSxDQUFDd0QsTUFBUCxHQUFnQixDQUFuQixFQUFzQixPQUFPeEQsTUFBTSxDQUFDLENBQUQsQ0FBTixDQUFVaEYsR0FBakIsQ0FkcEIsQ0FjMEM7O0FBRTVDLFFBQUdiLFFBQVEsQ0FBQ2xCLElBQVQsS0FBa0I2RyxTQUFyQixFQUFnQztBQUM5QixVQUFJO0FBQ0ZJLFlBQUksQ0FBQ3VGLEtBQUwsQ0FBV3RMLFFBQVEsQ0FBQ2xCLElBQXBCO0FBQ0QsT0FGRCxDQUVFLE9BQU1DLEtBQU4sRUFBYTtBQUNia0ksZ0JBQVEsQ0FBQyxnQkFBRCxFQUFrQmpILFFBQVEsQ0FBQ2xCLElBQTNCLENBQVI7QUFDQSxjQUFNLG9CQUFOO0FBQ0Q7QUFDRjs7QUFFRCxVQUFNOEksT0FBTyxHQUFHckssTUFBTSxDQUFDdUMsTUFBUCxDQUFjO0FBQzVCSSxlQUFTLEVBQUV5VyxXQURpQjtBQUU1QnhXLFlBQU0sRUFBRXlXLFFBRm9CO0FBRzVCdlYsV0FBSyxFQUFFckIsUUFBUSxDQUFDcUIsS0FIWTtBQUk1QkksZUFBUyxFQUFHekIsUUFBUSxDQUFDMFcsVUFKTztBQUs1QjVYLFVBQUksRUFBRWtCLFFBQVEsQ0FBQ2xCLElBTGE7QUFNNUJoQixhQUFPLEVBQUVrQyxRQUFRLENBQUNsQztBQU5VLEtBQWQsQ0FBaEI7QUFRQW1ILFdBQU8sQ0FBQyxrQkFBZ0JqRixRQUFRLENBQUNxQixLQUF6QixHQUErQixpQ0FBaEMsRUFBa0V1RyxPQUFsRSxDQUFQO0FBRUEyTCxxQkFBaUIsQ0FBQztBQUFDak8sUUFBRSxFQUFFc0M7QUFBTCxLQUFELENBQWpCO0FBQ0EsV0FBT0EsT0FBUDtBQUNELEdBckNELENBcUNFLE9BQU8zQixTQUFQLEVBQWtCO0FBQ2xCLFVBQU0sSUFBSS9JLE1BQU0sQ0FBQzhCLEtBQVgsQ0FBaUIsMkNBQWpCLEVBQThEaUgsU0FBOUQsQ0FBTjtBQUNEO0FBQ0YsQ0F6Q0Q7O0FBcENBOUksTUFBTSxDQUFDK0ksYUFBUCxDQStFZTVILFFBL0VmLEU7Ozs7Ozs7Ozs7O0FDQUEsSUFBSXBCLE1BQUo7QUFBV0MsTUFBTSxDQUFDQyxJQUFQLENBQVksZUFBWixFQUE0QjtBQUFDRixRQUFNLENBQUNHLENBQUQsRUFBRztBQUFDSCxVQUFNLEdBQUNHLENBQVA7QUFBUzs7QUFBcEIsQ0FBNUIsRUFBa0QsQ0FBbEQ7QUFBcUQsSUFBSXNDLFlBQUo7QUFBaUJ4QyxNQUFNLENBQUNDLElBQVAsQ0FBWSxjQUFaLEVBQTJCO0FBQUNtQixTQUFPLENBQUNsQixDQUFELEVBQUc7QUFBQ3NDLGdCQUFZLEdBQUN0QyxDQUFiO0FBQWU7O0FBQTNCLENBQTNCLEVBQXdELENBQXhEO0FBQTJELElBQUltSixjQUFKLEVBQW1CQyxlQUFuQjtBQUFtQ3RKLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLG1EQUFaLEVBQWdFO0FBQUNvSixnQkFBYyxDQUFDbkosQ0FBRCxFQUFHO0FBQUNtSixrQkFBYyxHQUFDbkosQ0FBZjtBQUFpQixHQUFwQzs7QUFBcUNvSixpQkFBZSxDQUFDcEosQ0FBRCxFQUFHO0FBQUNvSixtQkFBZSxHQUFDcEosQ0FBaEI7QUFBa0I7O0FBQTFFLENBQWhFLEVBQTRJLENBQTVJO0FBQStJLElBQUlFLE1BQUo7QUFBV0osTUFBTSxDQUFDQyxJQUFQLENBQVksaUNBQVosRUFBOEM7QUFBQ0csUUFBTSxDQUFDRixDQUFELEVBQUc7QUFBQ0UsVUFBTSxHQUFDRixDQUFQO0FBQVM7O0FBQXBCLENBQTlDLEVBQW9FLENBQXBFO0FBQXVFLElBQUl1RyxlQUFKO0FBQW9CekcsTUFBTSxDQUFDQyxJQUFQLENBQVksa0NBQVosRUFBK0M7QUFBQ3dHLGlCQUFlLENBQUN2RyxDQUFELEVBQUc7QUFBQ3VHLG1CQUFlLEdBQUN2RyxDQUFoQjtBQUFrQjs7QUFBdEMsQ0FBL0MsRUFBdUYsQ0FBdkY7QUFBMEYsSUFBSXFXLGFBQUo7QUFBa0J2VyxNQUFNLENBQUNDLElBQVAsQ0FBWSw4QkFBWixFQUEyQztBQUFDbUIsU0FBTyxDQUFDbEIsQ0FBRCxFQUFHO0FBQUNxVyxpQkFBYSxHQUFDclcsQ0FBZDtBQUFnQjs7QUFBNUIsQ0FBM0MsRUFBeUUsQ0FBekU7QUFBNEUsSUFBSXNKLFdBQUo7QUFBZ0J4SixNQUFNLENBQUNDLElBQVAsQ0FBWSxvQ0FBWixFQUFpRDtBQUFDdUosYUFBVyxDQUFDdEosQ0FBRCxFQUFHO0FBQUNzSixlQUFXLEdBQUN0SixDQUFaO0FBQWM7O0FBQTlCLENBQWpELEVBQWlGLENBQWpGO0FBQW9GLElBQUk0WSxzQkFBSjtBQUEyQjlZLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGtDQUFaLEVBQStDO0FBQUNtQixTQUFPLENBQUNsQixDQUFELEVBQUc7QUFBQzRZLDBCQUFzQixHQUFDNVksQ0FBdkI7QUFBeUI7O0FBQXJDLENBQS9DLEVBQXNGLENBQXRGO0FBQXlGLElBQUkySixVQUFKO0FBQWU3SixNQUFNLENBQUNDLElBQVAsQ0FBWSwyQ0FBWixFQUF3RDtBQUFDNEosWUFBVSxDQUFDM0osQ0FBRCxFQUFHO0FBQUMySixjQUFVLEdBQUMzSixDQUFYO0FBQWE7O0FBQTVCLENBQXhELEVBQXNGLENBQXRGO0FBVW4wQixNQUFNd1osa0JBQWtCLEdBQUcsSUFBSWxYLFlBQUosQ0FBaUI7QUFDMUNrUyxNQUFJLEVBQUU7QUFDSi9RLFFBQUksRUFBRUM7QUFERixHQURvQztBQUkxQzJPLE1BQUksRUFBRTtBQUNKNU8sUUFBSSxFQUFFQztBQURGO0FBSm9DLENBQWpCLENBQTNCOztBQVNBLE1BQU0rVixZQUFZLEdBQUlDLE9BQUQsSUFBYTtBQUNoQyxNQUFJO0FBQ0YsVUFBTUMsVUFBVSxHQUFHRCxPQUFuQjtBQUNBRixzQkFBa0IsQ0FBQ25ZLFFBQW5CLENBQTRCc1ksVUFBNUI7QUFDQSxVQUFNQyxPQUFPLEdBQUd2RCxhQUFhLENBQUM7QUFBQ2hFLFVBQUksRUFBRXFILE9BQU8sQ0FBQ3JIO0FBQWYsS0FBRCxDQUE3QjtBQUNBLFVBQU14USxLQUFLLEdBQUczQixNQUFNLENBQUNzSyxPQUFQLENBQWU7QUFBQ2hILFNBQUcsRUFBRW9XLE9BQU8sQ0FBQzNSO0FBQWQsS0FBZixDQUFkO0FBQ0EsUUFBR3BHLEtBQUssS0FBS3lHLFNBQVYsSUFBdUJ6RyxLQUFLLENBQUMyQyxpQkFBTixLQUE0Qm9WLE9BQU8sQ0FBQ25QLEtBQTlELEVBQXFFLE1BQU0sY0FBTjtBQUNyRSxVQUFNcEcsV0FBVyxHQUFHLElBQUlyQixJQUFKLEVBQXBCO0FBRUE5QyxVQUFNLENBQUNnRCxNQUFQLENBQWM7QUFBQ00sU0FBRyxFQUFHM0IsS0FBSyxDQUFDMkI7QUFBYixLQUFkLEVBQWdDO0FBQUN3TixVQUFJLEVBQUM7QUFBQzNNLG1CQUFXLEVBQUVBLFdBQWQ7QUFBMkJDLG1CQUFXLEVBQUVxVixVQUFVLENBQUNuRjtBQUFuRCxPQUFOO0FBQWdFcUYsWUFBTSxFQUFFO0FBQUNyVix5QkFBaUIsRUFBRTtBQUFwQjtBQUF4RSxLQUFoQyxFQVJFLENBVUY7O0FBQ0EsVUFBTXNWLE9BQU8sR0FBR3ZULGVBQWUsQ0FBQy9GLElBQWhCLENBQXFCO0FBQUN1WixTQUFHLEVBQUUsQ0FBQztBQUFDM1ksWUFBSSxFQUFFUyxLQUFLLENBQUNxQztBQUFiLE9BQUQsRUFBdUI7QUFBQ0UsaUJBQVMsRUFBRXZDLEtBQUssQ0FBQ3FDO0FBQWxCLE9BQXZCO0FBQU4sS0FBckIsQ0FBaEI7QUFDQSxRQUFHNFYsT0FBTyxLQUFLeFIsU0FBZixFQUEwQixNQUFNLGtDQUFOO0FBRTFCd1IsV0FBTyxDQUFDalUsT0FBUixDQUFnQlksS0FBSyxJQUFJO0FBQ3JCa0QsZ0JBQVUsQ0FBQywyQkFBRCxFQUE2QmxELEtBQTdCLENBQVY7QUFFQSxZQUFNQyxLQUFLLEdBQUdnQyxJQUFJLENBQUN1RixLQUFMLENBQVd4SCxLQUFLLENBQUNDLEtBQWpCLENBQWQ7QUFDQWlELGdCQUFVLENBQUMsK0JBQUQsRUFBa0NqRCxLQUFsQyxDQUFWO0FBRUEsWUFBTXNULFlBQVksR0FBRzFRLFdBQVcsQ0FBQ0gsY0FBRCxFQUFpQkMsZUFBakIsRUFBa0MxQyxLQUFLLENBQUN1RCxTQUF4QyxDQUFoQztBQUNBTixnQkFBVSxDQUFDLG1CQUFELEVBQXFCcVEsWUFBckIsQ0FBVjtBQUNBLFlBQU12RixXQUFXLEdBQUcvTixLQUFLLENBQUNyQixJQUExQjtBQUVBLGFBQU9xQixLQUFLLENBQUNyQixJQUFiO0FBQ0FxQixXQUFLLENBQUN1VCxZQUFOLEdBQXFCNVYsV0FBVyxDQUFDNlYsV0FBWixFQUFyQjtBQUNBeFQsV0FBSyxDQUFDc1QsWUFBTixHQUFxQkEsWUFBckI7QUFDQSxZQUFNRyxTQUFTLEdBQUd6UixJQUFJLENBQUNDLFNBQUwsQ0FBZWpDLEtBQWYsQ0FBbEI7QUFDQWlELGdCQUFVLENBQUMsOEJBQTRCOUgsS0FBSyxDQUFDcUMsTUFBbEMsR0FBeUMsY0FBMUMsRUFBeURpVyxTQUF6RCxDQUFWO0FBRUF2Qiw0QkFBc0IsQ0FBQztBQUNuQjFVLGNBQU0sRUFBRXVDLEtBQUssQ0FBQ3JGLElBREs7QUFFbkJzRixhQUFLLEVBQUV5VCxTQUZZO0FBR25CMUYsbUJBQVcsRUFBRUEsV0FITTtBQUluQkQsWUFBSSxFQUFFbUYsVUFBVSxDQUFDbkY7QUFKRSxPQUFELENBQXRCO0FBTUgsS0F0QkQ7QUF1QkE3SyxjQUFVLENBQUMsc0JBQUQsRUFBd0JpUSxPQUFPLENBQUNqUCxRQUFoQyxDQUFWO0FBQ0EsV0FBT2lQLE9BQU8sQ0FBQ2pQLFFBQWY7QUFDRCxHQXZDRCxDQXVDRSxPQUFPL0IsU0FBUCxFQUFrQjtBQUNsQixVQUFNLElBQUkvSSxNQUFNLENBQUM4QixLQUFYLENBQWlCLDJCQUFqQixFQUE4Q2lILFNBQTlDLENBQU47QUFDRDtBQUNGLENBM0NEOztBQW5CQTlJLE1BQU0sQ0FBQytJLGFBQVAsQ0FnRWU0USxZQWhFZixFOzs7Ozs7Ozs7OztBQ0FBLElBQUk1WixNQUFKO0FBQVdDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGVBQVosRUFBNEI7QUFBQ0YsUUFBTSxDQUFDRyxDQUFELEVBQUc7QUFBQ0gsVUFBTSxHQUFDRyxDQUFQO0FBQVM7O0FBQXBCLENBQTVCLEVBQWtELENBQWxEO0FBQXFELElBQUlzQyxZQUFKO0FBQWlCeEMsTUFBTSxDQUFDQyxJQUFQLENBQVksY0FBWixFQUEyQjtBQUFDbUIsU0FBTyxDQUFDbEIsQ0FBRCxFQUFHO0FBQUNzQyxnQkFBWSxHQUFDdEMsQ0FBYjtBQUFlOztBQUEzQixDQUEzQixFQUF3RCxDQUF4RDtBQUEyRCxJQUFJc1MsV0FBSjtBQUFnQnhTLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLFFBQVosRUFBcUI7QUFBQ3VTLGFBQVcsQ0FBQ3RTLENBQUQsRUFBRztBQUFDc1MsZUFBVyxHQUFDdFMsQ0FBWjtBQUFjOztBQUE5QixDQUFyQixFQUFxRCxDQUFyRDtBQUF3RCxJQUFJRSxNQUFKO0FBQVdKLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGlDQUFaLEVBQThDO0FBQUNHLFFBQU0sQ0FBQ0YsQ0FBRCxFQUFHO0FBQUNFLFVBQU0sR0FBQ0YsQ0FBUDtBQUFTOztBQUFwQixDQUE5QyxFQUFvRSxDQUFwRTtBQUsvTixNQUFNb2Esc0JBQXNCLEdBQUcsSUFBSTlYLFlBQUosQ0FBaUI7QUFDOUMyRixJQUFFLEVBQUU7QUFDRnhFLFFBQUksRUFBRUM7QUFESjtBQUQwQyxDQUFqQixDQUEvQjs7QUFNQSxNQUFNOEYsZ0JBQWdCLEdBQUkzSCxLQUFELElBQVc7QUFDbEMsTUFBSTtBQUNGLFVBQU1jLFFBQVEsR0FBR2QsS0FBakI7QUFDQXVZLDBCQUFzQixDQUFDL1ksUUFBdkIsQ0FBZ0NzQixRQUFoQztBQUNBLFVBQU04SCxLQUFLLEdBQUc2SCxXQUFXLENBQUMsRUFBRCxDQUFYLENBQWdCNUIsUUFBaEIsQ0FBeUIsS0FBekIsQ0FBZDtBQUNBeFEsVUFBTSxDQUFDZ0QsTUFBUCxDQUFjO0FBQUNNLFNBQUcsRUFBR2IsUUFBUSxDQUFDc0Y7QUFBaEIsS0FBZCxFQUFrQztBQUFDK0ksVUFBSSxFQUFDO0FBQUN4TSx5QkFBaUIsRUFBRWlHO0FBQXBCO0FBQU4sS0FBbEM7QUFDQSxXQUFPQSxLQUFQO0FBQ0QsR0FORCxDQU1FLE9BQU83QixTQUFQLEVBQWtCO0FBQ2xCLFVBQU0sSUFBSS9JLE1BQU0sQ0FBQzhCLEtBQVgsQ0FBaUIsc0NBQWpCLEVBQXlEaUgsU0FBekQsQ0FBTjtBQUNEO0FBQ0YsQ0FWRDs7QUFYQTlJLE1BQU0sQ0FBQytJLGFBQVAsQ0F1QmVXLGdCQXZCZixFOzs7Ozs7Ozs7OztBQ0FBLElBQUkzSixNQUFKO0FBQVdDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGVBQVosRUFBNEI7QUFBQ0YsUUFBTSxDQUFDRyxDQUFELEVBQUc7QUFBQ0gsVUFBTSxHQUFDRyxDQUFQO0FBQVM7O0FBQXBCLENBQTVCLEVBQWtELENBQWxEO0FBQXFELElBQUlzQyxZQUFKO0FBQWlCeEMsTUFBTSxDQUFDQyxJQUFQLENBQVksY0FBWixFQUEyQjtBQUFDbUIsU0FBTyxDQUFDbEIsQ0FBRCxFQUFHO0FBQUNzQyxnQkFBWSxHQUFDdEMsQ0FBYjtBQUFlOztBQUEzQixDQUEzQixFQUF3RCxDQUF4RDtBQUEyRCxJQUFJRSxNQUFKO0FBQVdKLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGlDQUFaLEVBQThDO0FBQUNHLFFBQU0sQ0FBQ0YsQ0FBRCxFQUFHO0FBQUNFLFVBQU0sR0FBQ0YsQ0FBUDtBQUFTOztBQUFwQixDQUE5QyxFQUFvRSxDQUFwRTtBQUF1RSxJQUFJMEUsVUFBSjtBQUFlNUUsTUFBTSxDQUFDQyxJQUFQLENBQVksdUNBQVosRUFBb0Q7QUFBQzJFLFlBQVUsQ0FBQzFFLENBQUQsRUFBRztBQUFDMEUsY0FBVSxHQUFDMUUsQ0FBWDtBQUFhOztBQUE1QixDQUFwRCxFQUFrRixDQUFsRjtBQUFxRixJQUFJc0wsZUFBSjtBQUFvQnhMLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGlDQUFaLEVBQThDO0FBQUNtQixTQUFPLENBQUNsQixDQUFELEVBQUc7QUFBQ3NMLG1CQUFlLEdBQUN0TCxDQUFoQjtBQUFrQjs7QUFBOUIsQ0FBOUMsRUFBOEUsQ0FBOUU7QUFBaUYsSUFBSTRILE9BQUo7QUFBWTlILE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLDJDQUFaLEVBQXdEO0FBQUM2SCxTQUFPLENBQUM1SCxDQUFELEVBQUc7QUFBQzRILFdBQU8sR0FBQzVILENBQVI7QUFBVTs7QUFBdEIsQ0FBeEQsRUFBZ0YsQ0FBaEY7QUFBbUYsSUFBSWlULHNCQUFKO0FBQTJCblQsTUFBTSxDQUFDQyxJQUFQLENBQVksaURBQVosRUFBOEQ7QUFBQ21CLFNBQU8sQ0FBQ2xCLENBQUQsRUFBRztBQUFDaVQsMEJBQXNCLEdBQUNqVCxDQUF2QjtBQUF5Qjs7QUFBckMsQ0FBOUQsRUFBcUcsQ0FBckc7QUFRamlCLE1BQU1xYSx1QkFBdUIsR0FBRyxJQUFJL1gsWUFBSixDQUFpQjtBQUMvQzRCLFFBQU0sRUFBRTtBQUNOVCxRQUFJLEVBQUVDO0FBREEsR0FEdUM7QUFJL0N1RyxXQUFTLEVBQUU7QUFDVHhHLFFBQUksRUFBRUM7QUFERyxHQUpvQztBQU8vQzhRLE1BQUksRUFBRTtBQUNGL1EsUUFBSSxFQUFFQyxNQURKO0FBRUZJLFlBQVEsRUFBRTtBQUZSO0FBUHlDLENBQWpCLENBQWhDOztBQWNBLE1BQU13VyxpQkFBaUIsR0FBSTdZLElBQUQsSUFBVTtBQUNsQyxNQUFJO0FBQ0YsVUFBTTZGLE9BQU8sR0FBRzdGLElBQWhCO0FBQ0FtRyxXQUFPLENBQUMsOEJBQUQsRUFBZ0NjLElBQUksQ0FBQ0MsU0FBTCxDQUFlbEgsSUFBZixDQUFoQyxDQUFQO0FBQ0E0WSwyQkFBdUIsQ0FBQ2haLFFBQXhCLENBQWlDaUcsT0FBakM7QUFDQSxVQUFNekYsS0FBSyxHQUFHM0IsTUFBTSxDQUFDc0ssT0FBUCxDQUFlO0FBQUN0RyxZQUFNLEVBQUVvRCxPQUFPLENBQUNwRDtBQUFqQixLQUFmLENBQWQ7QUFDQSxRQUFHckMsS0FBSyxLQUFLeUcsU0FBYixFQUF3QixNQUFNLGtCQUFOO0FBQ3hCVixXQUFPLENBQUMsOEJBQUQsRUFBZ0NOLE9BQU8sQ0FBQ3BELE1BQXhDLENBQVA7QUFFQSxVQUFNckIsU0FBUyxHQUFHNkIsVUFBVSxDQUFDOEYsT0FBWCxDQUFtQjtBQUFDaEgsU0FBRyxFQUFFM0IsS0FBSyxDQUFDZ0I7QUFBWixLQUFuQixDQUFsQjtBQUNBLFFBQUdBLFNBQVMsS0FBS3lGLFNBQWpCLEVBQTRCLE1BQU0scUJBQU47QUFDNUIsVUFBTXdELEtBQUssR0FBR2pKLFNBQVMsQ0FBQ3NELEtBQVYsQ0FBZ0I0RixLQUFoQixDQUFzQixHQUF0QixDQUFkO0FBQ0EsVUFBTWpDLE1BQU0sR0FBR2dDLEtBQUssQ0FBQ0EsS0FBSyxDQUFDRSxNQUFOLEdBQWEsQ0FBZCxDQUFwQjtBQUNBLFVBQU1nSSxtQkFBbUIsR0FBR2Ysc0JBQXNCLENBQUM7QUFBQ25KLFlBQU0sRUFBQ0E7QUFBUixLQUFELENBQWxELENBWkUsQ0FjRjs7QUFDQSxRQUFHLENBQUN3QixlQUFlLENBQUM7QUFBQ2hGLGVBQVMsRUFBRTBOLG1CQUFtQixDQUFDMU4sU0FBaEM7QUFBMkM3RSxVQUFJLEVBQUU2RixPQUFPLENBQUNwRCxNQUF6RDtBQUFpRStGLGVBQVMsRUFBRTNDLE9BQU8sQ0FBQzJDO0FBQXBGLEtBQUQsQ0FBbkIsRUFBcUg7QUFDbkgsWUFBTSxlQUFOO0FBQ0Q7O0FBQ0RyQyxXQUFPLENBQUMsK0JBQUQsRUFBa0NvTSxtQkFBbUIsQ0FBQzFOLFNBQXRELENBQVA7QUFFQXBHLFVBQU0sQ0FBQ2dELE1BQVAsQ0FBYztBQUFDTSxTQUFHLEVBQUczQixLQUFLLENBQUMyQjtBQUFiLEtBQWQsRUFBZ0M7QUFBQ3dOLFVBQUksRUFBQztBQUFDM00sbUJBQVcsRUFBRSxJQUFJckIsSUFBSixFQUFkO0FBQTBCc0IsbUJBQVcsRUFBRWdELE9BQU8sQ0FBQ2tOO0FBQS9DO0FBQU4sS0FBaEM7QUFDRCxHQXJCRCxDQXFCRSxPQUFPNUwsU0FBUCxFQUFrQjtBQUNsQixVQUFNLElBQUkvSSxNQUFNLENBQUM4QixLQUFYLENBQWlCLHdDQUFqQixFQUEyRGlILFNBQTNELENBQU47QUFDRDtBQUNGLENBekJEOztBQXRCQTlJLE1BQU0sQ0FBQytJLGFBQVAsQ0FpRGV5UixpQkFqRGYsRTs7Ozs7Ozs7Ozs7QUNBQSxJQUFJemEsTUFBSjtBQUFXQyxNQUFNLENBQUNDLElBQVAsQ0FBWSxlQUFaLEVBQTRCO0FBQUNGLFFBQU0sQ0FBQ0csQ0FBRCxFQUFHO0FBQUNILFVBQU0sR0FBQ0csQ0FBUDtBQUFTOztBQUFwQixDQUE1QixFQUFrRCxDQUFsRDtBQUFxRCxJQUFJc0MsWUFBSjtBQUFpQnhDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGNBQVosRUFBMkI7QUFBQ21CLFNBQU8sQ0FBQ2xCLENBQUQsRUFBRztBQUFDc0MsZ0JBQVksR0FBQ3RDLENBQWI7QUFBZTs7QUFBM0IsQ0FBM0IsRUFBd0QsQ0FBeEQ7QUFBMkQsSUFBSXVhLGFBQUo7QUFBa0J6YSxNQUFNLENBQUNDLElBQVAsQ0FBWSxtREFBWixFQUFnRTtBQUFDd2EsZUFBYSxDQUFDdmEsQ0FBRCxFQUFHO0FBQUN1YSxpQkFBYSxHQUFDdmEsQ0FBZDtBQUFnQjs7QUFBbEMsQ0FBaEUsRUFBb0csQ0FBcEc7QUFBdUcsSUFBSXlPLFFBQUo7QUFBYTNPLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLG9DQUFaLEVBQWlEO0FBQUMwTyxVQUFRLENBQUN6TyxDQUFELEVBQUc7QUFBQ3lPLFlBQVEsR0FBQ3pPLENBQVQ7QUFBVzs7QUFBeEIsQ0FBakQsRUFBMkUsQ0FBM0U7QUFBOEUsSUFBSW9MLGdCQUFKO0FBQXFCdEwsTUFBTSxDQUFDQyxJQUFQLENBQVksK0JBQVosRUFBNEM7QUFBQ21CLFNBQU8sQ0FBQ2xCLENBQUQsRUFBRztBQUFDb0wsb0JBQWdCLEdBQUNwTCxDQUFqQjtBQUFtQjs7QUFBL0IsQ0FBNUMsRUFBNkUsQ0FBN0U7QUFBZ0YsSUFBSXFMLFdBQUo7QUFBZ0J2TCxNQUFNLENBQUNDLElBQVAsQ0FBWSwwQkFBWixFQUF1QztBQUFDbUIsU0FBTyxDQUFDbEIsQ0FBRCxFQUFHO0FBQUNxTCxlQUFXLEdBQUNyTCxDQUFaO0FBQWM7O0FBQTFCLENBQXZDLEVBQW1FLENBQW5FO0FBQXNFLElBQUlzTCxlQUFKO0FBQW9CeEwsTUFBTSxDQUFDQyxJQUFQLENBQVksaUNBQVosRUFBOEM7QUFBQ21CLFNBQU8sQ0FBQ2xCLENBQUQsRUFBRztBQUFDc0wsbUJBQWUsR0FBQ3RMLENBQWhCO0FBQWtCOztBQUE5QixDQUE5QyxFQUE4RSxDQUE5RTtBQUFpRixJQUFJbVYsU0FBSjtBQUFjclYsTUFBTSxDQUFDQyxJQUFQLENBQVksMkNBQVosRUFBd0Q7QUFBQ29WLFdBQVMsQ0FBQ25WLENBQUQsRUFBRztBQUFDbVYsYUFBUyxHQUFDblYsQ0FBVjtBQUFZOztBQUExQixDQUF4RCxFQUFvRixDQUFwRjtBQUF1RixJQUFJaVQsc0JBQUo7QUFBMkJuVCxNQUFNLENBQUNDLElBQVAsQ0FBWSxpREFBWixFQUE4RDtBQUFDbUIsU0FBTyxDQUFDbEIsQ0FBRCxFQUFHO0FBQUNpVCwwQkFBc0IsR0FBQ2pULENBQXZCO0FBQXlCOztBQUFyQyxDQUE5RCxFQUFxRyxDQUFyRztBQVVod0IsTUFBTXdhLGlCQUFpQixHQUFHLElBQUlsWSxZQUFKLENBQWlCO0FBQ3pDNlcsZ0JBQWMsRUFBRTtBQUNkMVYsUUFBSSxFQUFFQyxNQURRO0FBRWRDLFNBQUssRUFBRXJCLFlBQVksQ0FBQ3NCLEtBQWIsQ0FBbUIrSDtBQUZaLEdBRHlCO0FBS3pDeU4sYUFBVyxFQUFFO0FBQ1gzVixRQUFJLEVBQUVDLE1BREs7QUFFWEMsU0FBSyxFQUFFckIsWUFBWSxDQUFDc0IsS0FBYixDQUFtQitIO0FBRmYsR0FMNEI7QUFTekNGLFNBQU8sRUFBRTtBQUNQaEksUUFBSSxFQUFFQztBQURDLEdBVGdDO0FBWXpDK1csc0JBQW9CLEVBQUU7QUFDcEJoWCxRQUFJLEVBQUVDO0FBRGM7QUFabUIsQ0FBakIsQ0FBMUI7O0FBaUJBLE1BQU1nWCxXQUFXLEdBQUlqWixJQUFELElBQVU7QUFDNUIsTUFBSTtBQUNGLFVBQU02RixPQUFPLEdBQUc3RixJQUFoQjtBQUNBK1kscUJBQWlCLENBQUNuWixRQUFsQixDQUEyQmlHLE9BQTNCO0FBQ0EsVUFBTWIsS0FBSyxHQUFHZ0ksUUFBUSxDQUFDOEwsYUFBRCxFQUFnQmpULE9BQU8sQ0FBQ21FLE9BQXhCLENBQXRCO0FBQ0EsUUFBR2hGLEtBQUssS0FBSzZCLFNBQWIsRUFBd0IsT0FBTyxLQUFQO0FBQ3hCLFVBQU1xUyxTQUFTLEdBQUdqUyxJQUFJLENBQUN1RixLQUFMLENBQVd4SCxLQUFLLENBQUNDLEtBQWpCLENBQWxCO0FBQ0EsVUFBTWtVLFVBQVUsR0FBR3RQLGVBQWUsQ0FBQztBQUNqQzdKLFVBQUksRUFBRTZGLE9BQU8sQ0FBQzZSLGNBQVIsR0FBdUI3UixPQUFPLENBQUM4UixXQURKO0FBRWpDblAsZUFBUyxFQUFFMFEsU0FBUyxDQUFDMVEsU0FGWTtBQUdqQzNELGVBQVMsRUFBRWdCLE9BQU8sQ0FBQ21UO0FBSGMsS0FBRCxDQUFsQztBQU1BLFFBQUcsQ0FBQ0csVUFBSixFQUFnQixPQUFPO0FBQUNBLGdCQUFVLEVBQUU7QUFBYixLQUFQO0FBQ2hCLFVBQU05TyxLQUFLLEdBQUd4RSxPQUFPLENBQUM2UixjQUFSLENBQXVCcE4sS0FBdkIsQ0FBNkIsR0FBN0IsQ0FBZCxDQWJFLENBYStDOztBQUNqRCxVQUFNakMsTUFBTSxHQUFHZ0MsS0FBSyxDQUFDQSxLQUFLLENBQUNFLE1BQU4sR0FBYSxDQUFkLENBQXBCO0FBQ0EsVUFBTWdJLG1CQUFtQixHQUFHZixzQkFBc0IsQ0FBQztBQUFDbkosWUFBTSxFQUFFQTtBQUFULEtBQUQsQ0FBbEQ7QUFFQSxVQUFNK1EsV0FBVyxHQUFHdlAsZUFBZSxDQUFDO0FBQ2xDN0osVUFBSSxFQUFFa1osU0FBUyxDQUFDMVEsU0FEa0I7QUFFbENBLGVBQVMsRUFBRTBRLFNBQVMsQ0FBQ1gsWUFGYTtBQUdsQzFULGVBQVMsRUFBRTBOLG1CQUFtQixDQUFDMU47QUFIRyxLQUFELENBQW5DO0FBTUEsUUFBRyxDQUFDdVUsV0FBSixFQUFpQixPQUFPO0FBQUNBLGlCQUFXLEVBQUU7QUFBZCxLQUFQO0FBQ2pCLFdBQU8sSUFBUDtBQUNELEdBekJELENBeUJFLE9BQU9qUyxTQUFQLEVBQWtCO0FBQ2xCLFVBQU0sSUFBSS9JLE1BQU0sQ0FBQzhCLEtBQVgsQ0FBaUIsMEJBQWpCLEVBQTZDaUgsU0FBN0MsQ0FBTjtBQUNEO0FBQ0YsQ0E3QkQ7O0FBM0JBOUksTUFBTSxDQUFDK0ksYUFBUCxDQTBEZTZSLFdBMURmLEU7Ozs7Ozs7Ozs7O0FDQUEsSUFBSTdhLE1BQUo7QUFBV0MsTUFBTSxDQUFDQyxJQUFQLENBQVksZUFBWixFQUE0QjtBQUFDRixRQUFNLENBQUNHLENBQUQsRUFBRztBQUFDSCxVQUFNLEdBQUNHLENBQVA7QUFBUzs7QUFBcEIsQ0FBNUIsRUFBa0QsQ0FBbEQ7QUFBcUQsSUFBSXNDLFlBQUo7QUFBaUJ4QyxNQUFNLENBQUNDLElBQVAsQ0FBWSxjQUFaLEVBQTJCO0FBQUNtQixTQUFPLENBQUNsQixDQUFELEVBQUc7QUFBQ3NDLGdCQUFZLEdBQUN0QyxDQUFiO0FBQWU7O0FBQTNCLENBQTNCLEVBQXdELENBQXhEO0FBQTJELElBQUkwRSxVQUFKO0FBQWU1RSxNQUFNLENBQUNDLElBQVAsQ0FBWSx1Q0FBWixFQUFvRDtBQUFDMkUsWUFBVSxDQUFDMUUsQ0FBRCxFQUFHO0FBQUMwRSxjQUFVLEdBQUMxRSxDQUFYO0FBQWE7O0FBQTVCLENBQXBELEVBQWtGLENBQWxGO0FBQXFGLElBQUk4RyxVQUFKO0FBQWVoSCxNQUFNLENBQUNDLElBQVAsQ0FBWSw2QkFBWixFQUEwQztBQUFDbUIsU0FBTyxDQUFDbEIsQ0FBRCxFQUFHO0FBQUM4RyxjQUFVLEdBQUM5RyxDQUFYO0FBQWE7O0FBQXpCLENBQTFDLEVBQXFFLENBQXJFO0FBSy9QLE1BQU04YSxrQkFBa0IsR0FBRyxJQUFJeFksWUFBSixDQUFpQjtBQUMxQzZELE9BQUssRUFBRTtBQUNMMUMsUUFBSSxFQUFFQyxNQUREO0FBRUxDLFNBQUssRUFBRXJCLFlBQVksQ0FBQ3NCLEtBQWIsQ0FBbUIrSDtBQUZyQjtBQURtQyxDQUFqQixDQUEzQjs7QUFPQSxNQUFNc04sWUFBWSxHQUFJcFcsU0FBRCxJQUFlO0FBQ2xDLE1BQUk7QUFDRixVQUFNcUQsWUFBWSxHQUFHckQsU0FBckI7QUFDQWlZLHNCQUFrQixDQUFDelosUUFBbkIsQ0FBNEI2RSxZQUE1QjtBQUNBLFVBQU02VSxVQUFVLEdBQUdyVyxVQUFVLENBQUNsRSxJQUFYLENBQWdCO0FBQUMyRixXQUFLLEVBQUV0RCxTQUFTLENBQUNzRDtBQUFsQixLQUFoQixFQUEwQzZTLEtBQTFDLEVBQW5CO0FBQ0EsUUFBRytCLFVBQVUsQ0FBQy9PLE1BQVgsR0FBb0IsQ0FBdkIsRUFBMEIsT0FBTytPLFVBQVUsQ0FBQyxDQUFELENBQVYsQ0FBY3ZYLEdBQXJCO0FBQzFCLFVBQU13WCxPQUFPLEdBQUdsVSxVQUFVLEVBQTFCO0FBQ0EsV0FBT3BDLFVBQVUsQ0FBQ2pDLE1BQVgsQ0FBa0I7QUFDdkIwRCxXQUFLLEVBQUVELFlBQVksQ0FBQ0MsS0FERztBQUV2QkMsZ0JBQVUsRUFBRTRVLE9BQU8sQ0FBQzVVLFVBRkc7QUFHdkJFLGVBQVMsRUFBRTBVLE9BQU8sQ0FBQzFVO0FBSEksS0FBbEIsQ0FBUDtBQUtELEdBWEQsQ0FXRSxPQUFPc0MsU0FBUCxFQUFrQjtBQUNsQixVQUFNLElBQUkvSSxNQUFNLENBQUM4QixLQUFYLENBQWlCLDBCQUFqQixFQUE2Q2lILFNBQTdDLENBQU47QUFDRDtBQUNGLENBZkQ7O0FBWkE5SSxNQUFNLENBQUMrSSxhQUFQLENBNkJlb1EsWUE3QmYsRTs7Ozs7Ozs7Ozs7QUNBQSxJQUFJcFosTUFBSjtBQUFXQyxNQUFNLENBQUNDLElBQVAsQ0FBWSxlQUFaLEVBQTRCO0FBQUNGLFFBQU0sQ0FBQ0csQ0FBRCxFQUFHO0FBQUNILFVBQU0sR0FBQ0csQ0FBUDtBQUFTOztBQUFwQixDQUE1QixFQUFrRCxDQUFsRDtBQUFxRCxJQUFJc0MsWUFBSjtBQUFpQnhDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGNBQVosRUFBMkI7QUFBQ21CLFNBQU8sQ0FBQ2xCLENBQUQsRUFBRztBQUFDc0MsZ0JBQVksR0FBQ3RDLENBQWI7QUFBZTs7QUFBM0IsQ0FBM0IsRUFBd0QsQ0FBeEQ7QUFBMkQsSUFBSXdILE9BQUo7QUFBWTFILE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGlDQUFaLEVBQThDO0FBQUN5SCxTQUFPLENBQUN4SCxDQUFELEVBQUc7QUFBQ3dILFdBQU8sR0FBQ3hILENBQVI7QUFBVTs7QUFBdEIsQ0FBOUMsRUFBc0UsQ0FBdEU7QUFJeEosTUFBTWliLGVBQWUsR0FBRyxJQUFJM1ksWUFBSixDQUFpQjtBQUN2QzZELE9BQUssRUFBRTtBQUNMMUMsUUFBSSxFQUFFQyxNQUREO0FBRUxDLFNBQUssRUFBRXJCLFlBQVksQ0FBQ3NCLEtBQWIsQ0FBbUIrSDtBQUZyQjtBQURnQyxDQUFqQixDQUF4Qjs7QUFPQSxNQUFNdU4sU0FBUyxHQUFJcFcsTUFBRCxJQUFZO0FBQzVCLE1BQUk7QUFDRixVQUFNNEUsU0FBUyxHQUFHNUUsTUFBbEI7QUFDQW1ZLG1CQUFlLENBQUM1WixRQUFoQixDQUF5QnFHLFNBQXpCO0FBQ0EsVUFBTXdULE9BQU8sR0FBRzFULE9BQU8sQ0FBQ2hILElBQVIsQ0FBYTtBQUFDMkYsV0FBSyxFQUFFckQsTUFBTSxDQUFDcUQ7QUFBZixLQUFiLEVBQW9DNlMsS0FBcEMsRUFBaEI7QUFDQSxRQUFHa0MsT0FBTyxDQUFDbFAsTUFBUixHQUFpQixDQUFwQixFQUF1QixPQUFPa1AsT0FBTyxDQUFDLENBQUQsQ0FBUCxDQUFXMVgsR0FBbEI7QUFDdkIsV0FBT2dFLE9BQU8sQ0FBQy9FLE1BQVIsQ0FBZTtBQUNwQjBELFdBQUssRUFBRXVCLFNBQVMsQ0FBQ3ZCO0FBREcsS0FBZixDQUFQO0FBR0QsR0FSRCxDQVFFLE9BQU95QyxTQUFQLEVBQWtCO0FBQ2xCLFVBQU0sSUFBSS9JLE1BQU0sQ0FBQzhCLEtBQVgsQ0FBaUIsdUJBQWpCLEVBQTBDaUgsU0FBMUMsQ0FBTjtBQUNEO0FBQ0YsQ0FaRDs7QUFYQTlJLE1BQU0sQ0FBQytJLGFBQVAsQ0F5QmVxUSxTQXpCZixFOzs7Ozs7Ozs7OztBQ0FBcFosTUFBTSxDQUFDc0MsTUFBUCxDQUFjO0FBQUMrWSxTQUFPLEVBQUMsTUFBSUEsT0FBYjtBQUFxQnhPLFdBQVMsRUFBQyxNQUFJQSxTQUFuQztBQUE2Q0MsV0FBUyxFQUFDLE1BQUlBLFNBQTNEO0FBQXFFMUQsUUFBTSxFQUFDLE1BQUlBO0FBQWhGLENBQWQ7QUFBdUcsSUFBSXJKLE1BQUo7QUFBV0MsTUFBTSxDQUFDQyxJQUFQLENBQVksZUFBWixFQUE0QjtBQUFDRixRQUFNLENBQUNHLENBQUQsRUFBRztBQUFDSCxVQUFNLEdBQUNHLENBQVA7QUFBUzs7QUFBcEIsQ0FBNUIsRUFBa0QsQ0FBbEQ7O0FBRTNHLFNBQVNtYixPQUFULEdBQW1CO0FBQ3hCLE1BQUd0YixNQUFNLENBQUN1YixRQUFQLEtBQW9COVMsU0FBcEIsSUFDQXpJLE1BQU0sQ0FBQ3ViLFFBQVAsQ0FBZ0JDLEdBQWhCLEtBQXdCL1MsU0FEeEIsSUFFQXpJLE1BQU0sQ0FBQ3ViLFFBQVAsQ0FBZ0JDLEdBQWhCLENBQW9CQyxLQUFwQixLQUE4QmhULFNBRmpDLEVBRTRDLE9BQU96SSxNQUFNLENBQUN1YixRQUFQLENBQWdCQyxHQUFoQixDQUFvQkMsS0FBM0I7QUFDNUMsU0FBTyxLQUFQO0FBQ0Q7O0FBRU0sU0FBUzNPLFNBQVQsR0FBcUI7QUFDMUIsTUFBRzlNLE1BQU0sQ0FBQ3ViLFFBQVAsS0FBb0I5UyxTQUFwQixJQUNBekksTUFBTSxDQUFDdWIsUUFBUCxDQUFnQkMsR0FBaEIsS0FBd0IvUyxTQUR4QixJQUVBekksTUFBTSxDQUFDdWIsUUFBUCxDQUFnQkMsR0FBaEIsQ0FBb0JFLE9BQXBCLEtBQWdDalQsU0FGbkMsRUFFOEMsT0FBT3pJLE1BQU0sQ0FBQ3ViLFFBQVAsQ0FBZ0JDLEdBQWhCLENBQW9CRSxPQUEzQjtBQUM5QyxTQUFPLEtBQVA7QUFDRDs7QUFFTSxTQUFTM08sU0FBVCxHQUFxQjtBQUN4QixNQUFHL00sTUFBTSxDQUFDdWIsUUFBUCxLQUFvQjlTLFNBQXBCLElBQ0N6SSxNQUFNLENBQUN1YixRQUFQLENBQWdCQyxHQUFoQixLQUF3Qi9TLFNBRHpCLElBRUN6SSxNQUFNLENBQUN1YixRQUFQLENBQWdCQyxHQUFoQixDQUFvQkcsT0FBcEIsS0FBZ0NsVCxTQUZwQyxFQUUrQyxPQUFPekksTUFBTSxDQUFDdWIsUUFBUCxDQUFnQkMsR0FBaEIsQ0FBb0JHLE9BQTNCO0FBQy9DLFNBQU8sS0FBUDtBQUNIOztBQUVNLFNBQVN0UyxNQUFULEdBQWtCO0FBQ3ZCLE1BQUdySixNQUFNLENBQUN1YixRQUFQLEtBQW9COVMsU0FBcEIsSUFDQXpJLE1BQU0sQ0FBQ3ViLFFBQVAsQ0FBZ0JDLEdBQWhCLEtBQXdCL1MsU0FEeEIsSUFFQXpJLE1BQU0sQ0FBQ3ViLFFBQVAsQ0FBZ0JDLEdBQWhCLENBQW9CN0csSUFBcEIsS0FBNkJsTSxTQUZoQyxFQUUyQztBQUN0QyxRQUFJbVQsSUFBSSxHQUFHLElBQVg7QUFDQSxRQUFHNWIsTUFBTSxDQUFDdWIsUUFBUCxDQUFnQkMsR0FBaEIsQ0FBb0JJLElBQXBCLEtBQTZCblQsU0FBaEMsRUFBMkNtVCxJQUFJLEdBQUc1YixNQUFNLENBQUN1YixRQUFQLENBQWdCQyxHQUFoQixDQUFvQkksSUFBM0I7QUFDM0MsV0FBTyxZQUFVNWIsTUFBTSxDQUFDdWIsUUFBUCxDQUFnQkMsR0FBaEIsQ0FBb0I3RyxJQUE5QixHQUFtQyxHQUFuQyxHQUF1Q2lILElBQXZDLEdBQTRDLEdBQW5EO0FBQ0o7O0FBQ0QsU0FBTzViLE1BQU0sQ0FBQzZiLFdBQVAsRUFBUDtBQUNELEM7Ozs7Ozs7Ozs7O0FDaENENWIsTUFBTSxDQUFDc0MsTUFBUCxDQUFjO0FBQUNzSyxtQkFBaUIsRUFBQyxNQUFJQTtBQUF2QixDQUFkO0FBQU8sTUFBTUEsaUJBQWlCLEdBQUcsY0FBMUIsQzs7Ozs7Ozs7Ozs7QUNBUDVNLE1BQU0sQ0FBQ3NDLE1BQVAsQ0FBYztBQUFDcVIsYUFBVyxFQUFDLE1BQUlBLFdBQWpCO0FBQTZCdEssZ0JBQWMsRUFBQyxNQUFJQSxjQUFoRDtBQUErREMsaUJBQWUsRUFBQyxNQUFJQSxlQUFuRjtBQUFtR21SLGVBQWEsRUFBQyxNQUFJQTtBQUFySCxDQUFkO0FBQW1KLElBQUlvQixRQUFKO0FBQWE3YixNQUFNLENBQUNDLElBQVAsQ0FBWSxVQUFaLEVBQXVCO0FBQUNtQixTQUFPLENBQUNsQixDQUFELEVBQUc7QUFBQzJiLFlBQVEsR0FBQzNiLENBQVQ7QUFBVzs7QUFBdkIsQ0FBdkIsRUFBZ0QsQ0FBaEQ7QUFBbUQsSUFBSTRiLFFBQUosRUFBYUMsV0FBYixFQUF5QkMsVUFBekIsRUFBb0NDLFNBQXBDO0FBQThDamMsTUFBTSxDQUFDQyxJQUFQLENBQVkseUJBQVosRUFBc0M7QUFBQzZiLFVBQVEsQ0FBQzViLENBQUQsRUFBRztBQUFDNGIsWUFBUSxHQUFDNWIsQ0FBVDtBQUFXLEdBQXhCOztBQUF5QjZiLGFBQVcsQ0FBQzdiLENBQUQsRUFBRztBQUFDNmIsZUFBVyxHQUFDN2IsQ0FBWjtBQUFjLEdBQXREOztBQUF1RDhiLFlBQVUsQ0FBQzliLENBQUQsRUFBRztBQUFDOGIsY0FBVSxHQUFDOWIsQ0FBWDtBQUFhLEdBQWxGOztBQUFtRitiLFdBQVMsQ0FBQy9iLENBQUQsRUFBRztBQUFDK2IsYUFBUyxHQUFDL2IsQ0FBVjtBQUFZOztBQUE1RyxDQUF0QyxFQUFvSixDQUFwSjtBQUdqUSxJQUFJZ2MsWUFBWSxHQUFHbmMsTUFBTSxDQUFDdWIsUUFBUCxDQUFnQnpELElBQW5DO0FBQ0EsSUFBSXNFLFVBQVUsR0FBRzNULFNBQWpCOztBQUNBLElBQUd5VCxTQUFTLENBQUNILFFBQUQsQ0FBWixFQUF3QjtBQUN0QixNQUFHLENBQUNJLFlBQUQsSUFBaUIsQ0FBQ0EsWUFBWSxDQUFDRSxRQUFsQyxFQUNFLE1BQU0sSUFBSXJjLE1BQU0sQ0FBQzhCLEtBQVgsQ0FBaUIsc0JBQWpCLEVBQXlDLHNDQUF6QyxDQUFOO0FBQ0ZzYSxZQUFVLEdBQUdFLFlBQVksQ0FBQ0gsWUFBWSxDQUFDRSxRQUFkLENBQXpCO0FBQ0Q7O0FBQ00sTUFBTXpJLFdBQVcsR0FBR3dJLFVBQXBCO0FBRVAsSUFBSUcsZUFBZSxHQUFHdmMsTUFBTSxDQUFDdWIsUUFBUCxDQUFnQmlCLE9BQXRDO0FBQ0EsSUFBSUMsYUFBYSxHQUFHaFUsU0FBcEI7QUFDQSxJQUFJaVUsY0FBYyxHQUFHalUsU0FBckI7O0FBQ0EsSUFBR3lULFNBQVMsQ0FBQ0YsV0FBRCxDQUFaLEVBQTJCO0FBQ3pCLE1BQUcsQ0FBQ08sZUFBRCxJQUFvQixDQUFDQSxlQUFlLENBQUNGLFFBQXhDLEVBQ0UsTUFBTSxJQUFJcmMsTUFBTSxDQUFDOEIsS0FBWCxDQUFpQix5QkFBakIsRUFBNEMseUNBQTVDLENBQU47QUFDRjJhLGVBQWEsR0FBR0gsWUFBWSxDQUFDQyxlQUFlLENBQUNGLFFBQWpCLENBQTVCO0FBQ0FLLGdCQUFjLEdBQUdILGVBQWUsQ0FBQ0YsUUFBaEIsQ0FBeUJ2VixPQUExQztBQUNEOztBQUNNLE1BQU13QyxjQUFjLEdBQUdtVCxhQUF2QjtBQUNBLE1BQU1sVCxlQUFlLEdBQUdtVCxjQUF4QjtBQUVQLElBQUlDLGNBQWMsR0FBRzNjLE1BQU0sQ0FBQ3ViLFFBQVAsQ0FBZ0JyRixNQUFyQztBQUNBLElBQUkwRyxZQUFZLEdBQUduVSxTQUFuQjs7QUFDQSxJQUFHeVQsU0FBUyxDQUFDRCxVQUFELENBQVosRUFBMEI7QUFDeEIsTUFBRyxDQUFDVSxjQUFELElBQW1CLENBQUNBLGNBQWMsQ0FBQ04sUUFBdEMsRUFDRSxNQUFNLElBQUlyYyxNQUFNLENBQUM4QixLQUFYLENBQWlCLHdCQUFqQixFQUEyQyx3Q0FBM0MsQ0FBTjtBQUNGOGEsY0FBWSxHQUFHTixZQUFZLENBQUNLLGNBQWMsQ0FBQ04sUUFBaEIsQ0FBM0I7QUFDRDs7QUFDTSxNQUFNM0IsYUFBYSxHQUFHa0MsWUFBdEI7O0FBRVAsU0FBU04sWUFBVCxDQUFzQmYsUUFBdEIsRUFBZ0M7QUFDOUIsU0FBTyxJQUFJTyxRQUFRLENBQUNlLE1BQWIsQ0FBb0I7QUFDekJsSSxRQUFJLEVBQUU0RyxRQUFRLENBQUM1RyxJQURVO0FBRXpCaUgsUUFBSSxFQUFFTCxRQUFRLENBQUNLLElBRlU7QUFHekJrQixRQUFJLEVBQUV2QixRQUFRLENBQUN3QixRQUhVO0FBSXpCQyxRQUFJLEVBQUV6QixRQUFRLENBQUMwQjtBQUpVLEdBQXBCLENBQVA7QUFNRCxDOzs7Ozs7Ozs7OztBQ3hDRGhkLE1BQU0sQ0FBQ3NDLE1BQVAsQ0FBYztBQUFDK1QsU0FBTyxFQUFDLE1BQUlBLE9BQWI7QUFBcUJ4TyxvQkFBa0IsRUFBQyxNQUFJQSxrQkFBNUM7QUFBK0QyUCw2QkFBMkIsRUFBQyxNQUFJQTtBQUEvRixDQUFkO0FBQTJJLElBQUl6WCxNQUFKO0FBQVdDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGVBQVosRUFBNEI7QUFBQ0YsUUFBTSxDQUFDRyxDQUFELEVBQUc7QUFBQ0gsVUFBTSxHQUFDRyxDQUFQO0FBQVM7O0FBQXBCLENBQTVCLEVBQWtELENBQWxEO0FBQXFELElBQUk0YixRQUFKLEVBQWFDLFdBQWIsRUFBeUJFLFNBQXpCO0FBQW1DamMsTUFBTSxDQUFDQyxJQUFQLENBQVkseUJBQVosRUFBc0M7QUFBQzZiLFVBQVEsQ0FBQzViLENBQUQsRUFBRztBQUFDNGIsWUFBUSxHQUFDNWIsQ0FBVDtBQUFXLEdBQXhCOztBQUF5QjZiLGFBQVcsQ0FBQzdiLENBQUQsRUFBRztBQUFDNmIsZUFBVyxHQUFDN2IsQ0FBWjtBQUFjLEdBQXREOztBQUF1RCtiLFdBQVMsQ0FBQy9iLENBQUQsRUFBRztBQUFDK2IsYUFBUyxHQUFDL2IsQ0FBVjtBQUFZOztBQUFoRixDQUF0QyxFQUF3SCxDQUF4SDtBQUEySCxJQUFJK2MsT0FBSjtBQUFZamQsTUFBTSxDQUFDQyxJQUFQLENBQVksU0FBWixFQUFzQjtBQUFDbUIsU0FBTyxDQUFDbEIsQ0FBRCxFQUFHO0FBQUMrYyxXQUFPLEdBQUMvYyxDQUFSO0FBQVU7O0FBQXRCLENBQXRCLEVBQThDLENBQTlDO0FBQWlELElBQUkySixVQUFKO0FBQWU3SixNQUFNLENBQUNDLElBQVAsQ0FBWSxxQkFBWixFQUFrQztBQUFDNEosWUFBVSxDQUFDM0osQ0FBRCxFQUFHO0FBQUMySixjQUFVLEdBQUMzSixDQUFYO0FBQWE7O0FBQTVCLENBQWxDLEVBQWdFLENBQWhFO0FBTTlhLE1BQU1tVyxPQUFPLEdBQUcsSUFBSTRHLE9BQUosQ0FBWSxrRUFBWixDQUFoQjtBQUVQLElBQUlmLFlBQVksR0FBR25jLE1BQU0sQ0FBQ3ViLFFBQVAsQ0FBZ0J6RCxJQUFuQztBQUNBLElBQUlxRixlQUFlLEdBQUcxVSxTQUF0Qjs7QUFFQSxJQUFHeVQsU0FBUyxDQUFDSCxRQUFELENBQVosRUFBd0I7QUFDdEIsTUFBRyxDQUFDSSxZQUFELElBQWlCLENBQUNBLFlBQVksQ0FBQ2dCLGVBQWxDLEVBQ0UsTUFBTSxJQUFJbmQsTUFBTSxDQUFDOEIsS0FBWCxDQUFpQixtQkFBakIsRUFBc0Msb0JBQXRDLENBQU47QUFDRnFiLGlCQUFlLEdBQUdoQixZQUFZLENBQUNnQixlQUEvQjtBQUNEOztBQUNNLE1BQU1yVixrQkFBa0IsR0FBR3FWLGVBQTNCO0FBRVAsSUFBSUMsV0FBVyxHQUFHM1UsU0FBbEI7O0FBQ0EsSUFBR3lULFNBQVMsQ0FBQ0YsV0FBRCxDQUFaLEVBQTJCO0FBQ3pCLE1BQUlPLGVBQWUsR0FBR3ZjLE1BQU0sQ0FBQ3ViLFFBQVAsQ0FBZ0JpQixPQUF0QztBQUVBLE1BQUcsQ0FBQ0QsZUFBRCxJQUFvQixDQUFDQSxlQUFlLENBQUNjLElBQXhDLEVBQ00sTUFBTSxJQUFJcmQsTUFBTSxDQUFDOEIsS0FBWCxDQUFpQixxQkFBakIsRUFBd0MsMkNBQXhDLENBQU47QUFFTixNQUFHLENBQUN5YSxlQUFlLENBQUNjLElBQWhCLENBQXFCRCxXQUF6QixFQUNNLE1BQU0sSUFBSXBkLE1BQU0sQ0FBQzhCLEtBQVgsQ0FBaUIsNEJBQWpCLEVBQStDLHlDQUEvQyxDQUFOO0FBRU5zYixhQUFXLEdBQUtiLGVBQWUsQ0FBQ2MsSUFBaEIsQ0FBcUJELFdBQXJDO0FBRUF0VCxZQUFVLENBQUMsMkJBQUQsRUFBNkJzVCxXQUE3QixDQUFWO0FBRUFwZCxRQUFNLENBQUNzZCxPQUFQLENBQWUsTUFBTTtBQUVwQixRQUFHZixlQUFlLENBQUNjLElBQWhCLENBQXFCTixRQUFyQixLQUFrQ3RVLFNBQXJDLEVBQStDO0FBQzNDOFUsYUFBTyxDQUFDQyxHQUFSLENBQVlDLFFBQVosR0FBdUIsWUFDbkJuVCxrQkFBa0IsQ0FBQ2lTLGVBQWUsQ0FBQ2MsSUFBaEIsQ0FBcUJLLE1BQXRCLENBREMsR0FFbkIsR0FGbUIsR0FHbkJuQixlQUFlLENBQUNjLElBQWhCLENBQXFCekIsSUFIekI7QUFJSCxLQUxELE1BS0s7QUFDRDJCLGFBQU8sQ0FBQ0MsR0FBUixDQUFZQyxRQUFaLEdBQXVCLFlBQ25CblQsa0JBQWtCLENBQUNpUyxlQUFlLENBQUNjLElBQWhCLENBQXFCTixRQUF0QixDQURDLEdBRW5CLEdBRm1CLEdBRWJ6UyxrQkFBa0IsQ0FBQ2lTLGVBQWUsQ0FBQ2MsSUFBaEIsQ0FBcUJKLFFBQXRCLENBRkwsR0FHbkIsR0FIbUIsR0FHYjNTLGtCQUFrQixDQUFDaVMsZUFBZSxDQUFDYyxJQUFoQixDQUFxQkssTUFBdEIsQ0FITCxHQUluQixHQUptQixHQUtuQm5CLGVBQWUsQ0FBQ2MsSUFBaEIsQ0FBcUJ6QixJQUx6QjtBQU1IOztBQUVEOVIsY0FBVSxDQUFDLGlCQUFELEVBQW1CeVQsT0FBTyxDQUFDQyxHQUFSLENBQVlDLFFBQS9CLENBQVY7QUFFQSxRQUFHbEIsZUFBZSxDQUFDYyxJQUFoQixDQUFxQk0sNEJBQXJCLEtBQW9EbFYsU0FBdkQsRUFDSThVLE9BQU8sQ0FBQ0MsR0FBUixDQUFZRyw0QkFBWixHQUEyQ3BCLGVBQWUsQ0FBQ2MsSUFBaEIsQ0FBcUJNLDRCQUFoRSxDQW5CZ0IsQ0FtQjhFO0FBQ2xHLEdBcEJEO0FBcUJEOztBQUNNLE1BQU1sRywyQkFBMkIsR0FBRzJGLFdBQXBDLEM7Ozs7Ozs7Ozs7O0FDdERQLElBQUlwZCxNQUFKO0FBQVdDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGVBQVosRUFBNEI7QUFBQ0YsUUFBTSxDQUFDRyxDQUFELEVBQUc7QUFBQ0gsVUFBTSxHQUFDRyxDQUFQO0FBQVM7O0FBQXBCLENBQTVCLEVBQWtELENBQWxEO0FBQXFELElBQUlDLEtBQUo7QUFBVUgsTUFBTSxDQUFDQyxJQUFQLENBQVksdUJBQVosRUFBb0M7QUFBQ0UsT0FBSyxDQUFDRCxDQUFELEVBQUc7QUFBQ0MsU0FBSyxHQUFDRCxDQUFOO0FBQVE7O0FBQWxCLENBQXBDLEVBQXdELENBQXhEO0FBQTJELElBQUlvSCxJQUFKO0FBQVN0SCxNQUFNLENBQUNDLElBQVAsQ0FBWSx3QkFBWixFQUFxQztBQUFDcUgsTUFBSSxDQUFDcEgsQ0FBRCxFQUFHO0FBQUNvSCxRQUFJLEdBQUNwSCxDQUFMO0FBQU87O0FBQWhCLENBQXJDLEVBQXVELENBQXZEO0FBRzlJSCxNQUFNLENBQUNzZCxPQUFQLENBQWUsTUFBTTtBQUVuQixNQUFJTSxPQUFPLEdBQUNDLE1BQU0sQ0FBQ0MsT0FBUCxDQUFlLGNBQWYsQ0FBWjs7QUFFQSxNQUFHdlcsSUFBSSxDQUFDNUcsSUFBTCxDQUFVO0FBQUMrRyxPQUFHLEVBQUM7QUFBTCxHQUFWLEVBQTJCcVcsS0FBM0IsS0FBcUMsQ0FBeEMsRUFBMEM7QUFDeEN4VyxRQUFJLENBQUMvRCxNQUFMLENBQVk7QUFBQ2tFLFNBQUcsRUFBQztBQUFMLEtBQVo7QUFDRDs7QUFDQUgsTUFBSSxDQUFDM0UsTUFBTCxDQUFZO0FBQUM4RSxPQUFHLEVBQUMsU0FBTDtBQUFlYixTQUFLLEVBQUMrVztBQUFyQixHQUFaOztBQUVELE1BQUc1ZCxNQUFNLENBQUN5TSxLQUFQLENBQWE5TCxJQUFiLEdBQW9Cb2QsS0FBcEIsT0FBZ0MsQ0FBbkMsRUFBc0M7QUFDcEMsVUFBTTNWLEVBQUUsR0FBR3NELFFBQVEsQ0FBQ3NTLFVBQVQsQ0FBb0I7QUFDN0JqQixjQUFRLEVBQUUsT0FEbUI7QUFFN0J6VyxXQUFLLEVBQUUscUJBRnNCO0FBRzdCMlcsY0FBUSxFQUFFO0FBSG1CLEtBQXBCLENBQVg7QUFLQTdjLFNBQUssQ0FBQzZkLGVBQU4sQ0FBc0I3VixFQUF0QixFQUEwQixPQUExQjtBQUNEO0FBQ0YsQ0FqQkQsRTs7Ozs7Ozs7Ozs7QUNIQW5JLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLHdCQUFaO0FBQXNDRCxNQUFNLENBQUNDLElBQVAsQ0FBWSx5QkFBWjtBQUF1Q0QsTUFBTSxDQUFDQyxJQUFQLENBQVkseUJBQVo7QUFBdUNELE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLHdCQUFaO0FBQXNDRCxNQUFNLENBQUNDLElBQVAsQ0FBWSw2QkFBWjtBQUEyQ0QsTUFBTSxDQUFDQyxJQUFQLENBQVksZUFBWjtBQUE2QkQsTUFBTSxDQUFDQyxJQUFQLENBQVksbUJBQVo7QUFBaUNELE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGlDQUFaO0FBQStDRCxNQUFNLENBQUNDLElBQVAsQ0FBWSxlQUFaO0FBQTZCRCxNQUFNLENBQUNDLElBQVAsQ0FBWSwwQkFBWjtBQUF3Q0QsTUFBTSxDQUFDQyxJQUFQLENBQVksV0FBWixFOzs7Ozs7Ozs7OztBQ0F2WCxJQUFJRixNQUFKO0FBQVdDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGVBQVosRUFBNEI7QUFBQ0YsUUFBTSxDQUFDRyxDQUFELEVBQUc7QUFBQ0gsVUFBTSxHQUFDRyxDQUFQO0FBQVM7O0FBQXBCLENBQTVCLEVBQWtELENBQWxEO0FBQXFELElBQUl5WSxRQUFKO0FBQWEzWSxNQUFNLENBQUNDLElBQVAsQ0FBWSxrQ0FBWixFQUErQztBQUFDMFksVUFBUSxDQUFDelksQ0FBRCxFQUFHO0FBQUN5WSxZQUFRLEdBQUN6WSxDQUFUO0FBQVc7O0FBQXhCLENBQS9DLEVBQXlFLENBQXpFO0FBQTRFLElBQUkrWCxjQUFKO0FBQW1CalksTUFBTSxDQUFDQyxJQUFQLENBQVksd0NBQVosRUFBcUQ7QUFBQ2dZLGdCQUFjLENBQUMvWCxDQUFELEVBQUc7QUFBQytYLGtCQUFjLEdBQUMvWCxDQUFmO0FBQWlCOztBQUFwQyxDQUFyRCxFQUEyRixDQUEzRjtBQUE4RixJQUFJc1ksUUFBSjtBQUFheFksTUFBTSxDQUFDQyxJQUFQLENBQVksa0NBQVosRUFBK0M7QUFBQ3VZLFVBQVEsQ0FBQ3RZLENBQUQsRUFBRztBQUFDc1ksWUFBUSxHQUFDdFksQ0FBVDtBQUFXOztBQUF4QixDQUEvQyxFQUF5RSxDQUF6RTtBQUE0RSxJQUFJNmIsV0FBSixFQUFnQkUsU0FBaEI7QUFBMEJqYyxNQUFNLENBQUNDLElBQVAsQ0FBWSx5QkFBWixFQUFzQztBQUFDOGIsYUFBVyxDQUFDN2IsQ0FBRCxFQUFHO0FBQUM2YixlQUFXLEdBQUM3YixDQUFaO0FBQWMsR0FBOUI7O0FBQStCK2IsV0FBUyxDQUFDL2IsQ0FBRCxFQUFHO0FBQUMrYixhQUFTLEdBQUMvYixDQUFWO0FBQVk7O0FBQXhELENBQXRDLEVBQWdHLENBQWhHO0FBQW1HLElBQUlnWSxvQ0FBSjtBQUF5Q2xZLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLHlEQUFaLEVBQXNFO0FBQUNtQixTQUFPLENBQUNsQixDQUFELEVBQUc7QUFBQ2dZLHdDQUFvQyxHQUFDaFksQ0FBckM7QUFBdUM7O0FBQW5ELENBQXRFLEVBQTJILENBQTNIO0FBT3pnQkgsTUFBTSxDQUFDc2QsT0FBUCxDQUFlLE1BQU07QUFDbkIxRSxVQUFRLENBQUNzRixjQUFUO0FBQ0FoRyxnQkFBYyxDQUFDZ0csY0FBZjtBQUNBekYsVUFBUSxDQUFDeUYsY0FBVDtBQUNBLE1BQUdoQyxTQUFTLENBQUNGLFdBQUQsQ0FBWixFQUEyQjdELG9DQUFvQztBQUNoRSxDQUxELEU7Ozs7Ozs7Ozs7O0FDUEFsWSxNQUFNLENBQUNzQyxNQUFQLENBQWM7QUFBQzRiLFNBQU8sRUFBQyxNQUFJQSxPQUFiO0FBQXFCQyxrQkFBZ0IsRUFBQyxNQUFJQSxnQkFBMUM7QUFBMkRDLHFCQUFtQixFQUFDLE1BQUlBLG1CQUFuRjtBQUF1R0Msb0JBQWtCLEVBQUMsTUFBSUEsa0JBQTlIO0FBQWlKQyx3QkFBc0IsRUFBQyxNQUFJQSxzQkFBNUs7QUFBbU1DLHFCQUFtQixFQUFDLE1BQUlBLG1CQUEzTjtBQUErT3pXLFNBQU8sRUFBQyxNQUFJQSxPQUEzUDtBQUFtUStCLFlBQVUsRUFBQyxNQUFJQSxVQUFsUjtBQUE2UndMLFdBQVMsRUFBQyxNQUFJQSxTQUEzUztBQUFxVHpCLGVBQWEsRUFBQyxNQUFJQSxhQUF2VTtBQUFxVjRLLFNBQU8sRUFBQyxNQUFJQSxPQUFqVztBQUF5VzFVLFVBQVEsRUFBQyxNQUFJQSxRQUF0WDtBQUErWDJVLGFBQVcsRUFBQyxNQUFJQTtBQUEvWSxDQUFkO0FBQTJhLElBQUlwRCxPQUFKO0FBQVlyYixNQUFNLENBQUNDLElBQVAsQ0FBWSxzQkFBWixFQUFtQztBQUFDb2IsU0FBTyxDQUFDbmIsQ0FBRCxFQUFHO0FBQUNtYixXQUFPLEdBQUNuYixDQUFSO0FBQVU7O0FBQXRCLENBQW5DLEVBQTJELENBQTNEOztBQUV2YndlLE9BQU8sQ0FBQyxXQUFELENBQVA7O0FBRU8sTUFBTVIsT0FBTyxHQUFHWixPQUFPLENBQUNZLE9BQXhCO0FBQ0EsTUFBTUMsZ0JBQWdCLEdBQUc7QUFBQ1EsS0FBRyxFQUFHLFdBQVA7QUFBb0JDLFFBQU0sRUFBRyxDQUFDLFFBQUQsRUFBVyxTQUFYO0FBQTdCLENBQXpCO0FBQ0EsTUFBTVIsbUJBQW1CLEdBQUc7QUFBQ08sS0FBRyxFQUFHLGNBQVA7QUFBdUJDLFFBQU0sRUFBRyxDQUFDLE1BQUQsRUFBUyxTQUFUO0FBQWhDLENBQTVCO0FBQ0EsTUFBTVAsa0JBQWtCLEdBQUc7QUFBQ00sS0FBRyxFQUFHLGFBQVA7QUFBc0JDLFFBQU0sRUFBRyxDQUFDLE9BQUQsRUFBVSxTQUFWO0FBQS9CLENBQTNCO0FBQ0EsTUFBTU4sc0JBQXNCLEdBQUc7QUFBQ0ssS0FBRyxFQUFHLGlCQUFQO0FBQTBCQyxRQUFNLEVBQUcsQ0FBQyxPQUFELEVBQVUsU0FBVjtBQUFuQyxDQUEvQjtBQUNBLE1BQU1MLG1CQUFtQixHQUFHO0FBQUNJLEtBQUcsRUFBRyxjQUFQO0FBQXVCQyxRQUFNLEVBQUcsQ0FBQyxRQUFELEVBQVcsU0FBWDtBQUFoQyxDQUE1Qjs7QUFFQSxTQUFTOVcsT0FBVCxDQUFpQnNELE9BQWpCLEVBQXlCeVQsS0FBekIsRUFBZ0M7QUFDbkMsTUFBR3hELE9BQU8sRUFBVixFQUFjO0FBQUM2QyxXQUFPLENBQUNZLElBQVIsR0FBZUMsR0FBZixDQUFtQlosZ0JBQW5CLEVBQXFDYSxHQUFyQyxDQUF5QzVULE9BQXpDLEVBQWlEeVQsS0FBSyxHQUFDQSxLQUFELEdBQU8sRUFBN0Q7QUFBa0U7QUFDcEY7O0FBRU0sU0FBU2hWLFVBQVQsQ0FBb0J1QixPQUFwQixFQUE0QnlULEtBQTVCLEVBQW1DO0FBQ3RDLE1BQUd4RCxPQUFPLEVBQVYsRUFBYztBQUFDNkMsV0FBTyxDQUFDWSxJQUFSLEdBQWVDLEdBQWYsQ0FBbUJYLG1CQUFuQixFQUF3Q1ksR0FBeEMsQ0FBNEM1VCxPQUE1QyxFQUFxRHlULEtBQUssR0FBQ0EsS0FBRCxHQUFPLEVBQWpFO0FBQXNFO0FBQ3hGOztBQUVNLFNBQVN4SixTQUFULENBQW1CakssT0FBbkIsRUFBNEJ5VCxLQUE1QixFQUFtQztBQUN0QyxNQUFHeEQsT0FBTyxFQUFWLEVBQWM7QUFBQzZDLFdBQU8sQ0FBQ1ksSUFBUixHQUFlQyxHQUFmLENBQW1CVixrQkFBbkIsRUFBdUNXLEdBQXZDLENBQTJDNVQsT0FBM0MsRUFBb0R5VCxLQUFLLEdBQUNBLEtBQUQsR0FBTyxFQUFoRTtBQUFxRTtBQUN2Rjs7QUFFTSxTQUFTakwsYUFBVCxDQUF1QnhJLE9BQXZCLEVBQWdDeVQsS0FBaEMsRUFBdUM7QUFDMUMsTUFBR3hELE9BQU8sRUFBVixFQUFhO0FBQUM2QyxXQUFPLENBQUNZLElBQVIsR0FBZUMsR0FBZixDQUFtQlQsc0JBQW5CLEVBQTJDVSxHQUEzQyxDQUErQzVULE9BQS9DLEVBQXdEeVQsS0FBSyxHQUFDQSxLQUFELEdBQU8sRUFBcEU7QUFBeUU7QUFDMUY7O0FBRU0sU0FBU0wsT0FBVCxDQUFpQnBULE9BQWpCLEVBQTBCeVQsS0FBMUIsRUFBaUM7QUFDcEMsTUFBR3hELE9BQU8sRUFBVixFQUFhO0FBQUM2QyxXQUFPLENBQUNZLElBQVIsR0FBZUMsR0FBZixDQUFtQlQsc0JBQW5CLEVBQTJDVSxHQUEzQyxDQUErQzVULE9BQS9DLEVBQXdEeVQsS0FBSyxHQUFDQSxLQUFELEdBQU8sRUFBcEU7QUFBeUU7QUFDMUY7O0FBRU0sU0FBUy9VLFFBQVQsQ0FBa0JzQixPQUFsQixFQUEyQnlULEtBQTNCLEVBQWtDO0FBQ3JDLE1BQUd4RCxPQUFPLEVBQVYsRUFBYTtBQUFDNkMsV0FBTyxDQUFDWSxJQUFSLEdBQWVDLEdBQWYsQ0FBbUJULHNCQUFuQixFQUEyQzFjLEtBQTNDLENBQWlEd0osT0FBakQsRUFBMER5VCxLQUFLLEdBQUNBLEtBQUQsR0FBTyxFQUF0RTtBQUEyRTtBQUM1Rjs7QUFFTSxTQUFTSixXQUFULENBQXFCclQsT0FBckIsRUFBOEJ5VCxLQUE5QixFQUFxQztBQUN4QyxNQUFHeEQsT0FBTyxFQUFWLEVBQWE7QUFBQzZDLFdBQU8sQ0FBQ1ksSUFBUixHQUFlQyxHQUFmLENBQW1CUixtQkFBbkIsRUFBd0NTLEdBQXhDLENBQTRDNVQsT0FBNUMsRUFBcUR5VCxLQUFLLEdBQUNBLEtBQUQsR0FBTyxFQUFqRTtBQUFzRTtBQUN2RixDOzs7Ozs7Ozs7OztBQ3JDRDdlLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGdDQUFaO0FBQThDRCxNQUFNLENBQUNDLElBQVAsQ0FBWSwrQkFBWjtBQUE2Q0QsTUFBTSxDQUFDQyxJQUFQLENBQVksNkNBQVo7QUFBMkRELE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLDhCQUFaO0FBQTRDRCxNQUFNLENBQUNDLElBQVAsQ0FBWSwwQ0FBWixFOzs7Ozs7Ozs7OztBQ0FsTSxJQUFJRixNQUFKO0FBQVdDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGVBQVosRUFBNEI7QUFBQ0YsUUFBTSxDQUFDRyxDQUFELEVBQUc7QUFBQ0gsVUFBTSxHQUFDRyxDQUFQO0FBQVM7O0FBQXBCLENBQTVCLEVBQWtELENBQWxEO0FBQXFELElBQUlZLGNBQUo7QUFBbUJkLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLHlCQUFaLEVBQXNDO0FBQUNhLGdCQUFjLENBQUNaLENBQUQsRUFBRztBQUFDWSxrQkFBYyxHQUFDWixDQUFmO0FBQWlCOztBQUFwQyxDQUF0QyxFQUE0RSxDQUE1RTs7QUFBK0UsSUFBSWdCLENBQUo7O0FBQU1sQixNQUFNLENBQUNDLElBQVAsQ0FBWSxtQkFBWixFQUFnQztBQUFDaUIsR0FBQyxDQUFDaEIsQ0FBRCxFQUFHO0FBQUNnQixLQUFDLEdBQUNoQixDQUFGO0FBQUk7O0FBQVYsQ0FBaEMsRUFBNEMsQ0FBNUM7QUFJeEs7QUFDQUgsTUFBTSxDQUFDeU0sS0FBUCxDQUFhaEosSUFBYixDQUFrQjtBQUNoQkosUUFBTSxHQUFHO0FBQ1AsV0FBTyxJQUFQO0FBQ0Q7O0FBSGUsQ0FBbEIsRSxDQU1BOztBQUNBLE1BQU02YixZQUFZLEdBQUcsQ0FDbkIsT0FEbUIsRUFFbkIsUUFGbUIsRUFHbkIsb0JBSG1CLEVBSW5CLGFBSm1CLEVBS25CLG1CQUxtQixFQU1uQix1QkFObUIsRUFPbkIsZ0JBUG1CLEVBUW5CLGdCQVJtQixFQVNuQixlQVRtQixFQVVuQixhQVZtQixFQVduQixZQVhtQixFQVluQixpQkFabUIsRUFhbkIsb0JBYm1CLEVBY25CLDJCQWRtQixDQUFyQjs7QUFpQkEsSUFBSWxmLE1BQU0sQ0FBQ21DLFFBQVgsRUFBcUI7QUFDbkI7QUFDQXBCLGdCQUFjLENBQUNxQixPQUFmLENBQXVCO0FBQ3JCYixRQUFJLENBQUNBLElBQUQsRUFBTztBQUNULGFBQU9KLENBQUMsQ0FBQ2tCLFFBQUYsQ0FBVzZjLFlBQVgsRUFBeUIzZCxJQUF6QixDQUFQO0FBQ0QsS0FIb0I7O0FBS3JCO0FBQ0FlLGdCQUFZLEdBQUc7QUFBRSxhQUFPLElBQVA7QUFBYzs7QUFOVixHQUF2QixFQU9HLENBUEgsRUFPTSxJQVBOO0FBUUQsQzs7Ozs7Ozs7Ozs7QUN2Q0RyQyxNQUFNLENBQUNzQyxNQUFQLENBQWM7QUFBQ3daLFVBQVEsRUFBQyxNQUFJQSxRQUFkO0FBQXVCQyxhQUFXLEVBQUMsTUFBSUEsV0FBdkM7QUFBbURDLFlBQVUsRUFBQyxNQUFJQSxVQUFsRTtBQUE2RUMsV0FBUyxFQUFDLE1BQUlBO0FBQTNGLENBQWQ7QUFBcUgsSUFBSWxjLE1BQUo7QUFBV0MsTUFBTSxDQUFDQyxJQUFQLENBQVksZUFBWixFQUE0QjtBQUFDRixRQUFNLENBQUNHLENBQUQsRUFBRztBQUFDSCxVQUFNLEdBQUNHLENBQVA7QUFBUzs7QUFBcEIsQ0FBNUIsRUFBa0QsQ0FBbEQ7QUFDekgsTUFBTTRiLFFBQVEsR0FBRyxNQUFqQjtBQUNBLE1BQU1DLFdBQVcsR0FBRyxTQUFwQjtBQUNBLE1BQU1DLFVBQVUsR0FBRyxRQUFuQjs7QUFDQSxTQUFTQyxTQUFULENBQW1CdFksSUFBbkIsRUFBeUI7QUFDOUIsTUFBRzVELE1BQU0sQ0FBQ3ViLFFBQVAsS0FBb0I5UyxTQUFwQixJQUFpQ3pJLE1BQU0sQ0FBQ3ViLFFBQVAsQ0FBZ0JDLEdBQWhCLEtBQXdCL1MsU0FBNUQsRUFBdUUsTUFBTSxvQkFBTjtBQUN2RSxRQUFNMFcsS0FBSyxHQUFHbmYsTUFBTSxDQUFDdWIsUUFBUCxDQUFnQkMsR0FBaEIsQ0FBb0IyRCxLQUFsQztBQUNBLE1BQUdBLEtBQUssS0FBSzFXLFNBQWIsRUFBd0IsT0FBTzBXLEtBQUssQ0FBQzFVLFFBQU4sQ0FBZTdHLElBQWYsQ0FBUDtBQUN4QixTQUFPLEtBQVA7QUFDRCxDOzs7Ozs7Ozs7OztBQ1RELElBQUk4SCxRQUFKO0FBQWF6TCxNQUFNLENBQUNDLElBQVAsQ0FBWSxzQkFBWixFQUFtQztBQUFDd0wsVUFBUSxDQUFDdkwsQ0FBRCxFQUFHO0FBQUN1TCxZQUFRLEdBQUN2TCxDQUFUO0FBQVc7O0FBQXhCLENBQW5DLEVBQTZELENBQTdEO0FBQ2J1TCxRQUFRLENBQUMwVCxNQUFULENBQWdCO0FBQ1pDLHVCQUFxQixFQUFFLElBRFg7QUFFWkMsNkJBQTJCLEVBQUU7QUFGakIsQ0FBaEI7QUFPQTVULFFBQVEsQ0FBQzZULGNBQVQsQ0FBd0IvWixJQUF4QixHQUE2QixzQkFBN0IsQzs7Ozs7Ozs7Ozs7QUNSQSxJQUFJZ2EsR0FBSixFQUFRQyxzQkFBUixFQUErQnZXLHNCQUEvQjtBQUFzRGpKLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLFlBQVosRUFBeUI7QUFBQ3NmLEtBQUcsQ0FBQ3JmLENBQUQsRUFBRztBQUFDcWYsT0FBRyxHQUFDcmYsQ0FBSjtBQUFNLEdBQWQ7O0FBQWVzZix3QkFBc0IsQ0FBQ3RmLENBQUQsRUFBRztBQUFDc2YsMEJBQXNCLEdBQUN0ZixDQUF2QjtBQUF5QixHQUFsRTs7QUFBbUUrSSx3QkFBc0IsQ0FBQy9JLENBQUQsRUFBRztBQUFDK0ksMEJBQXNCLEdBQUMvSSxDQUF2QjtBQUF5Qjs7QUFBdEgsQ0FBekIsRUFBaUosQ0FBako7QUFBb0osSUFBSXlaLFlBQUo7QUFBaUIzWixNQUFNLENBQUNDLElBQVAsQ0FBWSx1REFBWixFQUFvRTtBQUFDbUIsU0FBTyxDQUFDbEIsQ0FBRCxFQUFHO0FBQUN5WixnQkFBWSxHQUFDelosQ0FBYjtBQUFlOztBQUEzQixDQUFwRSxFQUFpRyxDQUFqRztBQUFvRyxJQUFJOE8sbUJBQUo7QUFBd0JoUCxNQUFNLENBQUNDLElBQVAsQ0FBWSxvRUFBWixFQUFpRjtBQUFDbUIsU0FBTyxDQUFDbEIsQ0FBRCxFQUFHO0FBQUM4Tyx1QkFBbUIsR0FBQzlPLENBQXBCO0FBQXNCOztBQUFsQyxDQUFqRixFQUFxSCxDQUFySDtBQUF3SCxJQUFJMkosVUFBSjtBQUFlN0osTUFBTSxDQUFDQyxJQUFQLENBQVksc0RBQVosRUFBbUU7QUFBQzRKLFlBQVUsQ0FBQzNKLENBQUQsRUFBRztBQUFDMkosY0FBVSxHQUFDM0osQ0FBWDtBQUFhOztBQUE1QixDQUFuRSxFQUFpRyxDQUFqRztBQUk5ZDtBQUNBcWYsR0FBRyxDQUFDRSxRQUFKLENBQWF4VyxzQkFBc0IsR0FBQyxRQUFwQyxFQUE4QztBQUFDeVcsY0FBWSxFQUFFO0FBQWYsQ0FBOUMsRUFBcUU7QUFDbkVDLEtBQUcsRUFBRTtBQUNIQyxVQUFNLEVBQUUsWUFBVztBQUNqQixZQUFNck4sSUFBSSxHQUFHLEtBQUtzTixTQUFMLENBQWV0TixJQUE1Qjs7QUFDQSxVQUFJO0FBQ0YsWUFBSXVOLEVBQUUsR0FBRyxLQUFLbEcsT0FBTCxDQUFhN0IsT0FBYixDQUFxQixpQkFBckIsS0FDUCxLQUFLNkIsT0FBTCxDQUFhbUcsVUFBYixDQUF3QkMsYUFEakIsSUFFUCxLQUFLcEcsT0FBTCxDQUFhcUcsTUFBYixDQUFvQkQsYUFGYixLQUdOLEtBQUtwRyxPQUFMLENBQWFtRyxVQUFiLENBQXdCRSxNQUF4QixHQUFpQyxLQUFLckcsT0FBTCxDQUFhbUcsVUFBYixDQUF3QkUsTUFBeEIsQ0FBK0JELGFBQWhFLEdBQStFLElBSHpFLENBQVQ7QUFLRSxZQUFHRixFQUFFLENBQUN4UixPQUFILENBQVcsR0FBWCxLQUFpQixDQUFDLENBQXJCLEVBQXVCd1IsRUFBRSxHQUFDQSxFQUFFLENBQUN2UixTQUFILENBQWEsQ0FBYixFQUFldVIsRUFBRSxDQUFDeFIsT0FBSCxDQUFXLEdBQVgsQ0FBZixDQUFIO0FBRXZCekUsa0JBQVUsQ0FBQyx1QkFBRCxFQUF5QjtBQUFDMEksY0FBSSxFQUFDQSxJQUFOO0FBQVltQyxjQUFJLEVBQUNvTDtBQUFqQixTQUF6QixDQUFWO0FBQ0EsY0FBTWpWLFFBQVEsR0FBRzhPLFlBQVksQ0FBQztBQUFDakYsY0FBSSxFQUFFb0wsRUFBUDtBQUFXdk4sY0FBSSxFQUFFQTtBQUFqQixTQUFELENBQTdCO0FBRUYsZUFBTztBQUNMMk4sb0JBQVUsRUFBRSxHQURQO0FBRUxuSSxpQkFBTyxFQUFFO0FBQUMsNEJBQWdCLFlBQWpCO0FBQStCLHdCQUFZbE47QUFBM0MsV0FGSjtBQUdMc1YsY0FBSSxFQUFFLGVBQWF0VjtBQUhkLFNBQVA7QUFLRCxPQWhCRCxDQWdCRSxPQUFNakosS0FBTixFQUFhO0FBQ2IsZUFBTztBQUFDc2Usb0JBQVUsRUFBRSxHQUFiO0FBQWtCQyxjQUFJLEVBQUU7QUFBQ25ZLGtCQUFNLEVBQUUsTUFBVDtBQUFpQm9ELG1CQUFPLEVBQUV4SixLQUFLLENBQUN3SjtBQUFoQztBQUF4QixTQUFQO0FBQ0Q7QUFDRjtBQXRCRTtBQUQ4RCxDQUFyRTtBQTJCQW1VLEdBQUcsQ0FBQ0UsUUFBSixDQUFhRCxzQkFBYixFQUFxQztBQUNqQ0csS0FBRyxFQUFFO0FBQ0RELGdCQUFZLEVBQUUsS0FEYjtBQUVERSxVQUFNLEVBQUUsWUFBVztBQUNmLFlBQU1RLE1BQU0sR0FBRyxLQUFLQyxXQUFwQjtBQUNBLFlBQU1wUixJQUFJLEdBQUdtUixNQUFNLENBQUMxUSxFQUFwQjs7QUFFQSxVQUFJO0FBQ0FWLDJCQUFtQixDQUFDQyxJQUFELENBQW5CO0FBQ0EsZUFBTztBQUFDakgsZ0JBQU0sRUFBRSxTQUFUO0FBQXFCckcsY0FBSSxFQUFDLFVBQVFzTixJQUFSLEdBQWE7QUFBdkMsU0FBUDtBQUNILE9BSEQsQ0FHRSxPQUFNck4sS0FBTixFQUFhO0FBQ1gsZUFBTztBQUFDb0csZ0JBQU0sRUFBRSxNQUFUO0FBQWlCcEcsZUFBSyxFQUFFQSxLQUFLLENBQUN3SjtBQUE5QixTQUFQO0FBQ0g7QUFDSjtBQVpBO0FBRDRCLENBQXJDLEU7Ozs7Ozs7Ozs7O0FDaENBLElBQUltVSxHQUFKO0FBQVF2ZixNQUFNLENBQUNDLElBQVAsQ0FBWSxZQUFaLEVBQXlCO0FBQUNzZixLQUFHLENBQUNyZixDQUFELEVBQUc7QUFBQ3FmLE9BQUcsR0FBQ3JmLENBQUo7QUFBTTs7QUFBZCxDQUF6QixFQUF5QyxDQUF6QztBQUNScWYsR0FBRyxDQUFDRSxRQUFKLENBQWEsWUFBYixFQUEyQjtBQUFDQyxjQUFZLEVBQUU7QUFBZixDQUEzQixFQUFrRDtBQUNoREMsS0FBRyxFQUFFO0FBQ0hDLFVBQU0sRUFBRSxZQUFXO0FBQ2pCLFlBQU1qZSxJQUFJLEdBQUc7QUFDWCxnQkFBUSxzQkFERztBQUVYLG1CQUFXLHFDQUZBO0FBR1gsb0JBQVksdUNBSEQ7QUFJWCxzQkFBYyxzQkFKSDtBQUtYLG1CQUFVLDZDQUNOLE9BRE0sR0FFTiwyQkFGTSxHQUdOLEtBSE0sR0FJTixzQkFKTSxHQUtOLHdCQUxNLEdBTU4sS0FOTSxHQU9OLGFBUE0sR0FRTixnQkFSTSxHQVNOLGlCQVRNLEdBVU4sdUJBVk0sR0FXTixxQ0FYTSxHQVlOLGlDQVpNLEdBYU4sS0FiTSxHQWNOLFNBZE0sR0FlTix3QkFmTSxHQWdCTixvQkFoQk0sR0FpQk4sNEJBakJNLEdBa0JOLHNDQWxCTSxHQW1CTixLQW5CTSxHQW9CTixXQXBCTSxHQXFCTixtQkFyQk0sR0FzQk4sS0F0Qk0sR0F1Qk4sc0JBdkJNLEdBd0JOLGdCQXhCTSxHQXlCTixpQkF6Qk0sR0EwQk4sNkJBMUJNLEdBMkJOLEtBM0JNLEdBNEJOLGtEQTVCTSxHQTZCTixnQ0E3Qk0sR0E4Qk4saUNBOUJNLEdBK0JOLEtBL0JNLEdBZ0NOLG9CQWhDTSxHQWlDTixnQ0FqQ00sR0FrQ04sa0JBbENNLEdBbUNOLEtBbkNNLEdBb0NOLHVIQXBDTSxHQXFDTiwyQkFyQ00sR0FzQ04sS0F0Q00sR0F1Q04sY0F2Q00sR0F3Q04sZ0NBeENNLEdBeUNOLDRCQXpDTSxHQTBDTiw0QkExQ00sR0EyQ04sS0EzQ00sR0E0Q04sU0E1Q00sR0E2Q04seUJBN0NNLEdBOENOLGVBOUNNLEdBK0NOLGtDQS9DTSxHQWdETixpQ0FoRE0sR0FpRE4sS0FqRE0sR0FrRE4sOERBbERNLEdBbUROLCtCQW5ETSxHQW9ETixnQ0FwRE0sR0FxRE4sMkJBckRNLEdBc0ROLHNCQXRETSxHQXVETixLQXZETSxHQXdETixrQkF4RE0sR0F5RE4sNEJBekRNLEdBMEROLHFCQTFETSxHQTJETiwyQkEzRE0sR0E0RE4sc0JBNURNLEdBNkROLEtBN0RNLEdBOEROLEtBOURNLEdBK0ROLG1CQS9ETSxHQWdFTixLQWhFTSxHQWlFTixVQWpFTSxHQWtFTixxQkFsRU0sR0FtRU4sMEJBbkVNLEdBb0VOLEtBcEVNLEdBcUVOLGdCQXJFTSxHQXNFTixvQ0F0RU0sR0F1RU4sS0F2RU0sR0F3RU4sa0JBeEVNLEdBeUVOLHVDQXpFTSxHQTBFTixLQTFFTSxHQTJFTixnQkEzRU0sR0E0RU4sZ0JBNUVNLEdBNkVOLGlCQTdFTSxHQThFTixLQTlFTSxHQStFTixPQS9FTSxHQWdGTiw2QkFoRk0sR0FpRk4sS0FqRk0sR0FrRk4sdUNBbEZNLEdBbUZOLDhCQW5GTSxHQW9GTixLQXBGTSxHQXFGTixVQXJGTSxHQXNGTixLQXRGTSxHQXVGTixVQXZGTSxHQXdGTix1QkF4Rk0sR0F5Rk4sa0JBekZNLEdBMEZOLEtBMUZNLEdBMkZOLG1DQTNGTSxHQTRGTixpQkE1Rk0sR0E2Rk4sS0E3Rk0sR0E4Rk4sbUNBOUZNLEdBK0ZOLGlDQS9GTSxHQWdHTixLQWhHTSxHQWlHTixZQWpHTSxHQWtHTixXQWxHTSxHQW1HTix5S0FuR00sR0FvR04seUJBcEdNLEdBcUdOLDZCQXJHTSxHQXNHTixLQXRHTSxHQXVHTixpQkF2R00sR0F3R04sNkJBeEdNLEdBeUdOLDhCQXpHTSxHQTBHTix5QkExR00sR0EyR04sS0EzR00sR0E0R04sd0JBNUdNLEdBNkdOLDZCQTdHTSxHQThHTixLQTlHTSxHQStHTix5QkEvR00sR0FnSE4sNkJBaEhNLEdBaUhOLEtBakhNLEdBa0hOLHlCQWxITSxHQW1ITiw2QkFuSE0sR0FvSE4sZ0NBcEhNLEdBcUhOLDZCQXJITSxHQXNITixtQ0F0SE0sR0F1SE4sb0NBdkhNLEdBd0hOLDZCQXhITSxHQXlITixLQXpITSxHQTBITixXQTFITSxHQTJITiwrQkEzSE0sR0E0SE4sNEJBNUhNLEdBNkhOLDZCQTdITSxHQThITix1QkE5SE0sR0ErSE4sS0EvSE0sR0FnSU4sbUJBaElNLEdBaUlOLGdDQWpJTSxHQWtJTiw2QkFsSU0sR0FtSU4sOEJBbklNLEdBb0lOLHVCQXBJTSxHQXFJTixxQ0FySU0sR0FzSU4sS0F0SU0sR0F1SU4sZUF2SU0sR0F3SU4sNkJBeElNLEdBeUlOLGtCQXpJTSxHQTBJTixLQTFJTSxHQTJJTixlQTNJTSxHQTRJTiw2QkE1SU0sR0E2SU4sa0JBN0lNLEdBOElOLEtBOUlNLEdBK0lOLEtBL0lNLEdBZ0pOLFlBaEpNLEdBaUpOLFdBakpNLEdBa0pOLCtDQWxKTSxHQW1KTixtQ0FuSk0sR0FvSk4sOEJBcEpNLEdBcUpOLEtBckpNLEdBc0pOLG1DQXRKTSxHQXVKTiw4QkF2Sk0sR0F3Sk4sS0F4Sk0sR0F5Sk4sS0F6Sk0sR0EwSk4sSUExSk0sR0EySk4seUtBM0pNLEdBNEpOLHVDQTVKTSxHQTZKTiw2QkE3Sk0sR0E4Sk4sS0E5Sk0sR0ErSk4sa0NBL0pNLEdBZ0tOLDZCQWhLTSxHQWlLTiw4QkFqS00sR0FrS04sS0FsS00sR0FtS04seUNBbktNLEdBb0tOLDZCQXBLTSxHQXFLTixLQXJLTSxHQXNLTiwwQ0F0S00sR0F1S04sNkJBdktNLEdBd0tOLEtBeEtNLEdBeUtOLDBDQXpLTSxHQTBLTiw2QkExS00sR0EyS04sZ0NBM0tNLEdBNEtOLDZCQTVLTSxHQTZLTixtQ0E3S00sR0E4S04sb0NBOUtNLEdBK0tOLDZCQS9LTSxHQWdMTixLQWhMTSxHQWlMTiw0QkFqTE0sR0FrTE4sK0JBbExNLEdBbUxOLGlCQW5MTSxHQW9MTixrQkFwTE0sR0FxTE4sdUJBckxNLEdBc0xOLEtBdExNLEdBdUxOLG1DQXZMTSxHQXdMTiw2QkF4TE0sR0F5TE4sS0F6TE0sR0EwTE4sbUNBMUxNLEdBMkxOLDZCQTNMTSxHQTRMTixLQTVMTSxHQTZMTixLQTdMTSxHQThMTixJQTlMTSxHQStMTixrQkEvTE0sR0FnTU4sV0FoTU0sR0FpTU4sNkJBak1NLEdBa01OLG1CQWxNTSxHQW1NTixLQW5NTSxHQW9NTix5QkFwTU0sR0FxTU4sNkJBck1NLEdBc01OLEtBdE1NLEdBdU1OLHNCQXZNTSxHQXdNTiw2QkF4TU0sR0F5TU4sbUJBek1NLEdBME1OLEtBMU1NLEdBMk1OLDJCQTNNTSxHQTRNTixxQkE1TU0sR0E2TU4sS0E3TU0sR0E4TU4sd0JBOU1NLEdBK01OLHFCQS9NTSxHQWdOTixtQkFoTk0sR0FpTk4sS0FqTk0sR0FrTk4sMEJBbE5NLEdBbU5OLDhCQW5OTSxHQW9OTixLQXBOTSxHQXFOTix1QkFyTk0sR0FzTk4sOEJBdE5NLEdBdU5OLG1CQXZOTSxHQXdOTixLQXhOTSxHQXlOTixLQXpOTSxHQTBOTixZQTFOTSxHQTJOTixJQTNOTSxHQTROTixnQ0E1Tk0sR0E2Tk4sMkJBN05NLEdBOE5OLDZEQTlOTSxHQStOTixxREEvTk0sR0FnT04sSUFoT00sR0FpT04sbUVBak9NLEdBa09OLGlFQWxPTSxHQW1PTixJQW5PTSxHQW9PTixZQXBPTSxHQXFPTixnQkFyT00sR0FzT04sSUF0T00sR0F1T04sdUJBdk9NLEdBd09OLDJCQXhPTSxHQXlPTiwwREF6T00sR0EwT04sOERBMU9NLEdBMk9OLDREQTNPTSxHQTRPTixnRkE1T00sR0E2T04sMEVBN09NLEdBOE9OLDhEQTlPTSxHQStPTixZQS9PTSxHQWdQTixnQkFoUE0sR0FpUE4sSUFqUE0sR0FrUE4sdUJBbFBNLEdBbVBOLDJCQW5QTSxHQW9QTixlQXBQTSxHQXFQTix5Q0FyUE0sR0FzUE4scUNBdFBNLEdBdVBOLHFDQXZQTSxHQXdQTixLQXhQTSxHQXlQTixJQXpQTSxHQTBQTixrREExUE0sR0EyUE4sZ0NBM1BNLEdBNFBOLG1DQTVQTSxHQTZQTixZQTdQTSxHQThQTixnQkE5UE0sR0ErUE4sSUEvUE0sR0FnUU4sd0JBaFFNLEdBaVFOLDJCQWpRTSxHQWtRTixXQWxRTSxHQW1RTixrQkFuUU0sR0FvUU4sMkJBcFFNLEdBcVFOLEtBclFNLEdBc1FOLElBdFFNLEdBdVFOLHdCQXZRTSxHQXdRTiwwQkF4UU0sR0F5UU4sMEJBelFNLEdBMFFOLEtBMVFNLEdBMlFOLElBM1FNLEdBNFFOLHlCQTVRTSxHQTZRTiwwQkE3UU0sR0E4UU4sMkJBOVFNLEdBK1FOLEtBL1FNLEdBZ1JOLFlBaFJNLEdBaVJOLGdCQWpSTSxHQWtSTixxRUFsUk0sR0FtUk4sZ0JBblJNLEdBb1JOLHdDQXBSTSxHQXFSTiwyQ0FyUk0sR0FzUk4sMkJBdFJNLEdBdVJOLDRCQXZSTSxHQXdSTixLQXhSTSxHQXlSTixZQXpSTSxHQTBSTixXQTFSTSxHQTJSTiwrTEEzUk0sR0E0Uk4sOElBNVJNLEdBNlJOLHNJQTdSTSxHQThSTixVQTlSTSxHQStSTixrRUEvUk0sR0FnU04sZ0JBaFNNLEdBaVNOLDRCQWpTTSxHQWtTTix5Q0FsU00sR0FtU04saUdBblNNLEdBb1NOLHdCQXBTTSxHQXFTTiw2REFyU00sR0FzU04seUtBdFNNLEdBdVNOLGtDQXZTTSxHQXdTTix5RUF4U00sR0F5U04sOEpBelNNLEdBMFNOLDRDQTFTTSxHQTJTTixvSkEzU00sR0E0U04saUNBNVNNLEdBNlNOLGdFQTdTTSxHQThTTiwySkE5U00sR0ErU04sc0VBL1NNLEdBZ1ROLHFUQWhUTSxHQWlUTix1RUFqVE0sR0FrVE4sc0VBbFRNLEdBbVROLGdDQW5UTSxHQW9UTixpQ0FwVE0sR0FxVE4sNkNBclRNLEdBc1ROLDRDQXRUTSxHQXVUTixxQkF2VE0sR0F3VE4scUJBeFRNLEdBeVROLDBTQXpUTSxHQTBUTixnQ0ExVE0sR0EyVE4sMExBM1RNLEdBNFROLHNDQTVUTSxHQTZUTiw2SUE3VE0sR0E4VE4sNENBOVRNLEdBK1ROLHlPQS9UTSxHQWdVTixnREFoVU0sR0FpVU4sNkZBalVNLEdBa1VOLHVEQWxVTSxHQW1VTiw2Q0FuVU0sR0FvVU4sOENBcFVNLEdBcVVOLHFHQXJVTSxHQXNVTiw0Q0F0VU0sR0F1VU4sc05BdlVNLEdBd1VOLGtEQXhVTSxHQXlVTiw2TEF6VU0sR0EwVU4sd0RBMVVNLEdBMlVOLGlKQTNVTSxHQTRVTiw4REE1VU0sR0E2VU4sMElBN1VNLEdBOFVOLG9FQTlVTSxHQStVTiwrTkEvVU0sR0FnVk4sMEVBaFZNLEdBaVZOLG1IQWpWTSxHQWtWTixrS0FsVk0sR0FtVk4sMkVBblZNLEdBb1ZOLGlGQXBWTSxHQXFWTixxRUFyVk0sR0FzVk4sMkVBdFZNLEdBdVZOLCtEQXZWTSxHQXdWTixxRUF4Vk0sR0F5Vk4seURBelZNLEdBMFZOLCtEQTFWTSxHQTJWTixtREEzVk0sR0E0Vk4sb0RBNVZNLEdBNlZOLDRDQTdWTSxHQThWTixvSEE5Vk0sR0ErVk4sNENBL1ZNLEdBZ1dOLDhKQWhXTSxHQWlXTixrREFqV00sR0FrV04sc0pBbFdNLEdBbVdOLHdEQW5XTSxHQW9XTix5SkFwV00sR0FxV04sOERBcldNLEdBc1dOLDRMQXRXTSxHQXVXTixvRUF2V00sR0F3V04sdUlBeFdNLEdBeVdOLDBFQXpXTSxHQTBXTix1R0ExV00sR0EyV04sMkVBM1dNLEdBNFdOLGlGQTVXTSxHQTZXTixxRUE3V00sR0E4V04sMkVBOVdNLEdBK1dOLCtEQS9XTSxHQWdYTixxRUFoWE0sR0FpWE4seURBalhNLEdBa1hOLCtEQWxYTSxHQW1YTixtREFuWE0sR0FvWE4sb0RBcFhNLEdBcVhOLDRDQXJYTSxHQXNYTixvSEF0WE0sR0F1WE4sNENBdlhNLEdBd1hOLDhKQXhYTSxHQXlYTixrREF6WE0sR0EwWE4sNkxBMVhNLEdBMlhOLHdEQTNYTSxHQTRYTixpSkE1WE0sR0E2WE4sOERBN1hNLEdBOFhOLDBJQTlYTSxHQStYTixvRUEvWE0sR0FnWU4sK05BaFlNLEdBaVlOLDBFQWpZTSxHQWtZTiwwUUFsWU0sR0FtWU4sV0FuWU0sR0FvWU4sMkVBcFlNLEdBcVlOLGlGQXJZTSxHQXNZTixxRUF0WU0sR0F1WU4sMkVBdllNLEdBd1lOLCtEQXhZTSxHQXlZTixxRUF6WU0sR0EwWU4seURBMVlNLEdBMllOLCtEQTNZTSxHQTRZTixtREE1WU0sR0E2WU4seURBN1lNLEdBOFlOLDZDQTlZTSxHQStZTiw4Q0EvWU0sR0FnWk4scUdBaFpNLEdBaVpOLDRDQWpaTSxHQWtaTix5T0FsWk0sR0FtWk4sMEtBblpNLEdBb1pOLDZOQXBaTSxHQXFaTix1REFyWk0sR0FzWk4sNkNBdFpNLEdBdVpOLDhDQXZaTSxHQXdaTiwwRkF4Wk0sR0F5Wk4sNENBelpNLEdBMFpOLCtNQTFaTSxHQTJaTixrREEzWk0sR0E0Wk4sd1ZBNVpNLEdBNlpOLHdEQTdaTSxHQThaTiwyVEE5Wk0sR0ErWk4sb0ZBL1pNLEdBZ2FOLHlEQWhhTSxHQWlhTiwrREFqYU0sR0FrYU4sbURBbGFNLEdBbWFOLHlEQW5hTSxHQW9hTiw2Q0FwYU0sR0FxYU4sOENBcmFNLEdBc2FOLHNMQXRhTSxHQXVhTixvZEF2YU0sR0F3YU4saURBeGFNLEdBeWFOLHVDQXphTSxHQTBhTiw2Q0ExYU0sR0EyYU4saUNBM2FNLEdBNGFOLGtDQTVhTSxHQTZhTiwrSkE3YU0sR0E4YU4sZ0NBOWFNLEdBK2FOLDBMQS9hTSxHQWdiTixzQ0FoYk0sR0FpYk4sNkhBamJNLEdBa2JOLDRDQWxiTSxHQW1iTix5T0FuYk0sR0FvYk4sb0tBcGJNLEdBcWJOLHlFQXJiTSxHQXNiTixxRUF0Yk0sR0F1Yk4sd0ZBdmJNLEdBd2JOLHVEQXhiTSxHQXliTiw2Q0F6Yk0sR0EwYk4sOENBMWJNLEdBMmJOLHNMQTNiTSxHQTRiTixnS0E1Yk0sR0E2Yk4sMkhBN2JNLEdBOGJOLDZJQTliTSxHQStiTix3R0EvYk0sR0FnY04saURBaGNNLEdBaWNOLHVDQWpjTSxHQWtjTiw2Q0FsY00sR0FtY04saUNBbmNNLEdBb2NOLHVDQXBjTSxHQXFjTiwyQkFyY00sR0FzY04saUNBdGNNLEdBdWNOLHFCQXZjTSxHQXdjTixzQkF4Y00sR0F5Y04sa0JBemNNLEdBMGNOLGdDQTFjTSxHQTJjTix3QkEzY00sR0E0Y04sV0E1Y00sR0E2Y047QUFsZE8sT0FBYjtBQXFkQSxhQUFPO0FBQUMsa0JBQVUsU0FBWDtBQUFzQixnQkFBUUE7QUFBOUIsT0FBUDtBQUNEO0FBeGRFO0FBRDJDLENBQWxELEU7Ozs7Ozs7Ozs7Ozs7OztBQ0RBLElBQUk0ZCxHQUFKLEVBQVF2VyxlQUFSLEVBQXdCdUwsNkJBQXhCO0FBQXNEdlUsTUFBTSxDQUFDQyxJQUFQLENBQVksWUFBWixFQUF5QjtBQUFDc2YsS0FBRyxDQUFDcmYsQ0FBRCxFQUFHO0FBQUNxZixPQUFHLEdBQUNyZixDQUFKO0FBQU0sR0FBZDs7QUFBZThJLGlCQUFlLENBQUM5SSxDQUFELEVBQUc7QUFBQzhJLG1CQUFlLEdBQUM5SSxDQUFoQjtBQUFrQixHQUFwRDs7QUFBcURxVSwrQkFBNkIsQ0FBQ3JVLENBQUQsRUFBRztBQUFDcVUsaUNBQTZCLEdBQUNyVSxDQUE5QjtBQUFnQzs7QUFBdEgsQ0FBekIsRUFBaUosQ0FBako7QUFBb0osSUFBSWlCLFFBQUo7QUFBYW5CLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLDJFQUFaLEVBQXdGO0FBQUNtQixTQUFPLENBQUNsQixDQUFELEVBQUc7QUFBQ2lCLFlBQVEsR0FBQ2pCLENBQVQ7QUFBVzs7QUFBdkIsQ0FBeEYsRUFBaUgsQ0FBakg7QUFBb0gsSUFBSXNhLGlCQUFKO0FBQXNCeGEsTUFBTSxDQUFDQyxJQUFQLENBQVksNkRBQVosRUFBMEU7QUFBQ21CLFNBQU8sQ0FBQ2xCLENBQUQsRUFBRztBQUFDc2EscUJBQWlCLEdBQUN0YSxDQUFsQjtBQUFvQjs7QUFBaEMsQ0FBMUUsRUFBNEcsQ0FBNUc7QUFBK0csSUFBSTZMLGNBQUo7QUFBbUIvTCxNQUFNLENBQUNDLElBQVAsQ0FBWSwrREFBWixFQUE0RTtBQUFDbUIsU0FBTyxDQUFDbEIsQ0FBRCxFQUFHO0FBQUM2TCxrQkFBYyxHQUFDN0wsQ0FBZjtBQUFpQjs7QUFBN0IsQ0FBNUUsRUFBMkcsQ0FBM0c7QUFBOEcsSUFBSTRKLFFBQUosRUFBYWhDLE9BQWI7QUFBcUI5SCxNQUFNLENBQUNDLElBQVAsQ0FBWSxzREFBWixFQUFtRTtBQUFDNkosVUFBUSxDQUFDNUosQ0FBRCxFQUFHO0FBQUM0SixZQUFRLEdBQUM1SixDQUFUO0FBQVcsR0FBeEI7O0FBQXlCNEgsU0FBTyxDQUFDNUgsQ0FBRCxFQUFHO0FBQUM0SCxXQUFPLEdBQUM1SCxDQUFSO0FBQVU7O0FBQTlDLENBQW5FLEVBQW1ILENBQW5IO0FBQXNILElBQUlvZ0IsZ0JBQUo7QUFBcUJ0Z0IsTUFBTSxDQUFDQyxJQUFQLENBQVksU0FBWixFQUFzQjtBQUFDcWdCLGtCQUFnQixDQUFDcGdCLENBQUQsRUFBRztBQUFDb2dCLG9CQUFnQixHQUFDcGdCLENBQWpCO0FBQW1COztBQUF4QyxDQUF0QixFQUFnRSxDQUFoRTtBQUFtRSxJQUFJa0ksVUFBSjtBQUFlcEksTUFBTSxDQUFDQyxJQUFQLENBQVksc0RBQVosRUFBbUU7QUFBQ21CLFNBQU8sQ0FBQ2xCLENBQUQsRUFBRztBQUFDa0ksY0FBVSxHQUFDbEksQ0FBWDtBQUFhOztBQUF6QixDQUFuRSxFQUE4RixDQUE5RjtBQUFpRyxJQUFJRSxNQUFKO0FBQVdKLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLHlDQUFaLEVBQXNEO0FBQUNHLFFBQU0sQ0FBQ0YsQ0FBRCxFQUFHO0FBQUNFLFVBQU0sR0FBQ0YsQ0FBUDtBQUFTOztBQUFwQixDQUF0RCxFQUE0RSxDQUE1RTtBQUErRSxJQUFJQyxLQUFKO0FBQVVILE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLHVCQUFaLEVBQW9DO0FBQUNFLE9BQUssQ0FBQ0QsQ0FBRCxFQUFHO0FBQUNDLFNBQUssR0FBQ0QsQ0FBTjtBQUFROztBQUFsQixDQUFwQyxFQUF3RCxDQUF4RDtBQVV4Z0M7QUFFQXFmLEdBQUcsQ0FBQ0UsUUFBSixDQUFhbEwsNkJBQWIsRUFBNEM7QUFDMUNnTSxNQUFJLEVBQUU7QUFDSmIsZ0JBQVksRUFBRSxJQURWO0FBRUo7QUFDQUUsVUFBTSxFQUFFLFlBQVc7QUFDakIsWUFBTVksT0FBTyxHQUFHLEtBQUtILFdBQXJCO0FBQ0EsWUFBTUksT0FBTyxHQUFHLEtBQUtDLFVBQXJCO0FBQ0EsVUFBSU4sTUFBTSxHQUFHLEVBQWI7QUFDQSxVQUFHSSxPQUFPLEtBQUtoWSxTQUFmLEVBQTBCNFgsTUFBTSxtQ0FBT0ksT0FBUCxDQUFOO0FBQzFCLFVBQUdDLE9BQU8sS0FBS2pZLFNBQWYsRUFBMEI0WCxNQUFNLG1DQUFPQSxNQUFQLEVBQWtCSyxPQUFsQixDQUFOO0FBRTFCLFlBQU1FLEdBQUcsR0FBRyxLQUFLcGdCLE1BQWpCOztBQUVBLFVBQUcsQ0FBQ0osS0FBSyxDQUFDTSxZQUFOLENBQW1Ca2dCLEdBQW5CLEVBQXdCLE9BQXhCLENBQUQsSUFBcUM7QUFDbkN4Z0IsV0FBSyxDQUFDTSxZQUFOLENBQW1Ca2dCLEdBQW5CLEVBQXdCLE9BQXhCLE1BQXFDUCxNQUFNLENBQUMsU0FBRCxDQUFOLElBQW1CLElBQW5CLElBQTJCQSxNQUFNLENBQUMsU0FBRCxDQUFOLElBQW1CNVgsU0FBbkYsQ0FETCxFQUNxRztBQUFHO0FBQ3BHNFgsY0FBTSxDQUFDLFNBQUQsQ0FBTixHQUFvQk8sR0FBcEI7QUFDSDs7QUFFRDdZLGFBQU8sQ0FBQyxrQ0FBRCxFQUFvQ3NZLE1BQXBDLENBQVA7O0FBQ0EsVUFBR0EsTUFBTSxDQUFDOUcsV0FBUCxDQUFtQnNILFdBQW5CLEtBQW1DQyxLQUF0QyxFQUE0QztBQUFFO0FBQzFDLGVBQU9DLFlBQVksQ0FBQ1YsTUFBRCxDQUFuQjtBQUNILE9BRkQsTUFFSztBQUNGLGVBQU9XLFVBQVUsQ0FBQ1gsTUFBRCxDQUFqQjtBQUNGO0FBQ0Y7QUF2QkcsR0FEb0M7QUEwQjFDWSxLQUFHLEVBQUU7QUFDSHRCLGdCQUFZLEVBQUUsS0FEWDtBQUVIRSxVQUFNLEVBQUUsWUFBVztBQUNqQixZQUFNWSxPQUFPLEdBQUcsS0FBS0gsV0FBckI7QUFDQSxZQUFNSSxPQUFPLEdBQUcsS0FBS0MsVUFBckI7QUFFQTVZLGFBQU8sQ0FBQyxVQUFELEVBQVkwWSxPQUFaLENBQVA7QUFDQTFZLGFBQU8sQ0FBQyxVQUFELEVBQVkyWSxPQUFaLENBQVA7QUFFQSxVQUFJTCxNQUFNLEdBQUcsRUFBYjtBQUNBLFVBQUdJLE9BQU8sS0FBS2hZLFNBQWYsRUFBMEI0WCxNQUFNLG1DQUFPSSxPQUFQLENBQU47QUFDMUIsVUFBR0MsT0FBTyxLQUFLalksU0FBZixFQUEwQjRYLE1BQU0sbUNBQU9BLE1BQVAsRUFBa0JLLE9BQWxCLENBQU47O0FBQzFCLFVBQUk7QUFDRixjQUFNUSxHQUFHLEdBQUd6RyxpQkFBaUIsQ0FBQzRGLE1BQUQsQ0FBN0I7QUFDQXRZLGVBQU8sQ0FBQyx1QkFBRCxFQUF5Qm1aLEdBQXpCLENBQVA7QUFDQSxlQUFPO0FBQUNqWixnQkFBTSxFQUFFLFNBQVQ7QUFBb0JyRyxjQUFJLEVBQUU7QUFBQ3lKLG1CQUFPLEVBQUU7QUFBVjtBQUExQixTQUFQO0FBQ0QsT0FKRCxDQUlFLE9BQU14SixLQUFOLEVBQWE7QUFDYixlQUFPO0FBQUNzZSxvQkFBVSxFQUFFLEdBQWI7QUFBa0JDLGNBQUksRUFBRTtBQUFDblksa0JBQU0sRUFBRSxNQUFUO0FBQWlCb0QsbUJBQU8sRUFBRXhKLEtBQUssQ0FBQ3dKO0FBQWhDO0FBQXhCLFNBQVA7QUFDRDtBQUNGO0FBbkJFO0FBMUJxQyxDQUE1QztBQWlEQW1VLEdBQUcsQ0FBQ0UsUUFBSixDQUFhelcsZUFBYixFQUE4QjtBQUFDMFcsY0FBWSxFQUFFO0FBQWYsQ0FBOUIsRUFBcUQ7QUFDbkRDLEtBQUcsRUFBRTtBQUNIQyxVQUFNLEVBQUUsWUFBVztBQUNqQixZQUFNUSxNQUFNLEdBQUcsS0FBS0MsV0FBcEI7O0FBQ0EsVUFBSTtBQUNBdlksZUFBTyxDQUFDLG9FQUFELEVBQXNFYyxJQUFJLENBQUNDLFNBQUwsQ0FBZXVYLE1BQWYsQ0FBdEUsQ0FBUDtBQUNBLGNBQU16ZSxJQUFJLEdBQUdvSyxjQUFjLENBQUNxVSxNQUFELENBQTNCO0FBQ0F0WSxlQUFPLENBQUMsMERBQUQsRUFBNEQ7QUFBQ3FELGlCQUFPLEVBQUN4SixJQUFJLENBQUN3SixPQUFkO0FBQXVCcEksbUJBQVMsRUFBQ3BCLElBQUksQ0FBQ29CO0FBQXRDLFNBQTVELENBQVA7QUFDRixlQUFPO0FBQUNpRixnQkFBTSxFQUFFLFNBQVQ7QUFBb0JyRztBQUFwQixTQUFQO0FBQ0QsT0FMRCxDQUtFLE9BQU1DLEtBQU4sRUFBYTtBQUNia0ksZ0JBQVEsQ0FBQyxpQ0FBRCxFQUFtQ2xJLEtBQW5DLENBQVI7QUFDQSxlQUFPO0FBQUNvRyxnQkFBTSxFQUFFLE1BQVQ7QUFBaUJwRyxlQUFLLEVBQUVBLEtBQUssQ0FBQ3dKO0FBQTlCLFNBQVA7QUFDRDtBQUNGO0FBWkU7QUFEOEMsQ0FBckQ7QUFpQkFtVSxHQUFHLENBQUNFLFFBQUosQ0FBYWEsZ0JBQWIsRUFBK0I7QUFDM0JYLEtBQUcsRUFBRTtBQUNERCxnQkFBWSxFQUFFLElBRGI7QUFFRDtBQUNBRSxVQUFNLEVBQUUsWUFBVztBQUNmLFVBQUlRLE1BQU0sR0FBRyxLQUFLQyxXQUFsQjtBQUNBLFlBQU1NLEdBQUcsR0FBRyxLQUFLcGdCLE1BQWpCOztBQUNBLFVBQUcsQ0FBQ0osS0FBSyxDQUFDTSxZQUFOLENBQW1Ca2dCLEdBQW5CLEVBQXdCLE9BQXhCLENBQUosRUFBcUM7QUFDakNQLGNBQU0sR0FBRztBQUFDbFksZ0JBQU0sRUFBQ3lZLEdBQVI7QUFBWTFZLGNBQUksRUFBQztBQUFqQixTQUFUO0FBQ0gsT0FGRCxNQUdJO0FBQ0FtWSxjQUFNLG1DQUFPQSxNQUFQO0FBQWNuWSxjQUFJLEVBQUM7QUFBbkIsVUFBTjtBQUNIOztBQUNELFVBQUk7QUFDQUgsZUFBTyxDQUFDLG9DQUFELEVBQXNDYyxJQUFJLENBQUNDLFNBQUwsQ0FBZXVYLE1BQWYsQ0FBdEMsQ0FBUDtBQUNBLGNBQU16ZSxJQUFJLEdBQUd5RyxVQUFVLENBQUNnWSxNQUFELENBQXZCO0FBQ0F0WSxlQUFPLENBQUMsd0JBQUQsRUFBMEJjLElBQUksQ0FBQ0MsU0FBTCxDQUFlbEgsSUFBZixDQUExQixDQUFQO0FBQ0EsZUFBTztBQUFDcUcsZ0JBQU0sRUFBRSxTQUFUO0FBQW9Cckc7QUFBcEIsU0FBUDtBQUNILE9BTEQsQ0FLRSxPQUFNQyxLQUFOLEVBQWE7QUFDWGtJLGdCQUFRLENBQUMsc0NBQUQsRUFBd0NsSSxLQUF4QyxDQUFSO0FBQ0EsZUFBTztBQUFDb0csZ0JBQU0sRUFBRSxNQUFUO0FBQWlCcEcsZUFBSyxFQUFFQSxLQUFLLENBQUN3SjtBQUE5QixTQUFQO0FBQ0g7QUFDSjtBQXJCQTtBQURzQixDQUEvQjs7QUEwQkEsU0FBUzBWLFlBQVQsQ0FBc0JWLE1BQXRCLEVBQTZCO0FBRXpCdFksU0FBTyxDQUFDLFdBQUQsRUFBYXNZLE1BQU0sQ0FBQzlHLFdBQXBCLENBQVA7QUFFQSxRQUFNOEIsT0FBTyxHQUFHZ0YsTUFBTSxDQUFDOUcsV0FBdkI7QUFDQSxRQUFNRCxjQUFjLEdBQUcrRyxNQUFNLENBQUMvRyxjQUE5QjtBQUNBLFFBQU0xWCxJQUFJLEdBQUd5ZSxNQUFNLENBQUN6ZSxJQUFwQjtBQUNBLFFBQU11ZixPQUFPLEdBQUdkLE1BQU0sQ0FBQ3pmLE9BQXZCO0FBRUEsTUFBSXdnQixjQUFKO0FBQ0EsTUFBSUMsV0FBVyxHQUFHLEVBQWxCO0FBQ0EsTUFBSTdILFVBQUo7QUFDQTZCLFNBQU8sQ0FBQ3JWLE9BQVIsQ0FBZ0IsQ0FBQy9DLE1BQUQsRUFBUWtCLEtBQVIsS0FBa0I7QUFFOUIsVUFBTW1kLFlBQVksR0FBR04sVUFBVSxDQUFDO0FBQUN6SCxpQkFBVyxFQUFDdFcsTUFBYjtBQUFvQnFXLG9CQUFjLEVBQUNBLGNBQW5DO0FBQWtEMVgsVUFBSSxFQUFDQSxJQUF2RDtBQUE2RDRYLGdCQUFVLEVBQUNBLFVBQXhFO0FBQW9GclYsV0FBSyxFQUFFQSxLQUEzRjtBQUFrR3ZELGFBQU8sRUFBQ3VnQjtBQUExRyxLQUFELENBQS9CO0FBQ0FwWixXQUFPLENBQUMsUUFBRCxFQUFVdVosWUFBVixDQUFQO0FBQ0EsUUFBR0EsWUFBWSxDQUFDclosTUFBYixLQUF3QlEsU0FBeEIsSUFBcUM2WSxZQUFZLENBQUNyWixNQUFiLEtBQXNCLFFBQTlELEVBQXdFLE1BQU0seUJBQU47QUFDeEVvWixlQUFXLENBQUNyYyxJQUFaLENBQWlCc2MsWUFBakI7QUFDQUYsa0JBQWMsR0FBR0UsWUFBWSxDQUFDMWYsSUFBYixDQUFrQndHLEVBQW5DOztBQUVBLFFBQUdqRSxLQUFLLEtBQUcsQ0FBWCxFQUNBO0FBQ0k0RCxhQUFPLENBQUMsdUJBQUQsRUFBeUJxWixjQUF6QixDQUFQO0FBQ0EsWUFBTXBmLEtBQUssR0FBRzNCLE1BQU0sQ0FBQ3NLLE9BQVAsQ0FBZTtBQUFDaEgsV0FBRyxFQUFFeWQ7QUFBTixPQUFmLENBQWQ7QUFDQTVILGdCQUFVLEdBQUd4WCxLQUFLLENBQUNxQyxNQUFuQjtBQUNBMEQsYUFBTyxDQUFDLHNCQUFELEVBQXdCeVIsVUFBeEIsQ0FBUDtBQUNIO0FBRUosR0FoQkQ7QUFrQkF6UixTQUFPLENBQUNzWixXQUFELENBQVA7QUFFQSxTQUFPQSxXQUFQO0FBQ0g7O0FBRUQsU0FBU0wsVUFBVCxDQUFvQlgsTUFBcEIsRUFBMkI7QUFFdkIsTUFBSTtBQUNBLFVBQU1hLEdBQUcsR0FBRzlmLFFBQVEsQ0FBQ2lmLE1BQUQsQ0FBcEI7QUFDQXRZLFdBQU8sQ0FBQyxrQkFBRCxFQUFvQm1aLEdBQXBCLENBQVA7QUFDQSxXQUFPO0FBQUNqWixZQUFNLEVBQUUsU0FBVDtBQUFvQnJHLFVBQUksRUFBRTtBQUFDd0csVUFBRSxFQUFFOFksR0FBTDtBQUFValosY0FBTSxFQUFFLFNBQWxCO0FBQTZCb0QsZUFBTyxFQUFFO0FBQXRDO0FBQTFCLEtBQVA7QUFDSCxHQUpELENBSUUsT0FBTXhKLEtBQU4sRUFBYTtBQUNYLFdBQU87QUFBQ3NlLGdCQUFVLEVBQUUsR0FBYjtBQUFrQkMsVUFBSSxFQUFFO0FBQUNuWSxjQUFNLEVBQUUsTUFBVDtBQUFpQm9ELGVBQU8sRUFBRXhKLEtBQUssQ0FBQ3dKO0FBQWhDO0FBQXhCLEtBQVA7QUFDSDtBQUNKLEM7Ozs7Ozs7Ozs7O0FDcEpELElBQUltVSxHQUFKO0FBQVF2ZixNQUFNLENBQUNDLElBQVAsQ0FBWSxZQUFaLEVBQXlCO0FBQUNzZixLQUFHLENBQUNyZixDQUFELEVBQUc7QUFBQ3FmLE9BQUcsR0FBQ3JmLENBQUo7QUFBTTs7QUFBZCxDQUF6QixFQUF5QyxDQUF6QztBQUE0QyxJQUFJb2hCLE9BQUo7QUFBWXRoQixNQUFNLENBQUNDLElBQVAsQ0FBWSxnQkFBWixFQUE2QjtBQUFDcWhCLFNBQU8sQ0FBQ3BoQixDQUFELEVBQUc7QUFBQ29oQixXQUFPLEdBQUNwaEIsQ0FBUjtBQUFVOztBQUF0QixDQUE3QixFQUFxRCxDQUFyRDtBQUF3RCxJQUFJbUosY0FBSixFQUFtQnNLLFdBQW5CO0FBQStCM1QsTUFBTSxDQUFDQyxJQUFQLENBQVksMkRBQVosRUFBd0U7QUFBQ29KLGdCQUFjLENBQUNuSixDQUFELEVBQUc7QUFBQ21KLGtCQUFjLEdBQUNuSixDQUFmO0FBQWlCLEdBQXBDOztBQUFxQ3lULGFBQVcsQ0FBQ3pULENBQUQsRUFBRztBQUFDeVQsZUFBVyxHQUFDelQsQ0FBWjtBQUFjOztBQUFsRSxDQUF4RSxFQUE0SSxDQUE1STtBQUl2SnFmLEdBQUcsQ0FBQ0UsUUFBSixDQUFhLFFBQWIsRUFBdUI7QUFBQ0MsY0FBWSxFQUFFO0FBQWYsQ0FBdkIsRUFBOEM7QUFDNUNDLEtBQUcsRUFBRTtBQUNIQyxVQUFNLEVBQUUsWUFBVztBQUNqQixVQUFJO0FBQ0YsY0FBTWplLElBQUksR0FBRzJmLE9BQU8sQ0FBQzNOLFdBQVcsR0FBQ0EsV0FBRCxHQUFhdEssY0FBekIsQ0FBcEI7QUFDQSxlQUFPO0FBQUMsb0JBQVUsU0FBWDtBQUFzQixrQkFBTzFIO0FBQTdCLFNBQVA7QUFDRCxPQUhELENBR0MsT0FBTTRmLEVBQU4sRUFBUztBQUNKLGVBQU87QUFBQyxvQkFBVSxRQUFYO0FBQXFCLGtCQUFRQSxFQUFFLENBQUMzUSxRQUFIO0FBQTdCLFNBQVA7QUFDTDtBQUNGO0FBUkU7QUFEdUMsQ0FBOUMsRTs7Ozs7Ozs7Ozs7Ozs7O0FDSkEsSUFBSTJPLEdBQUo7QUFBUXZmLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLFlBQVosRUFBeUI7QUFBQ3NmLEtBQUcsQ0FBQ3JmLENBQUQsRUFBRztBQUFDcWYsT0FBRyxHQUFDcmYsQ0FBSjtBQUFNOztBQUFkLENBQXpCLEVBQXlDLENBQXpDO0FBQTRDLElBQUlILE1BQUo7QUFBV0MsTUFBTSxDQUFDQyxJQUFQLENBQVksZUFBWixFQUE0QjtBQUFDRixRQUFNLENBQUNHLENBQUQsRUFBRztBQUFDSCxVQUFNLEdBQUNHLENBQVA7QUFBUzs7QUFBcEIsQ0FBNUIsRUFBa0QsQ0FBbEQ7QUFBcUQsSUFBSXVMLFFBQUo7QUFBYXpMLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLHNCQUFaLEVBQW1DO0FBQUN3TCxVQUFRLENBQUN2TCxDQUFELEVBQUc7QUFBQ3VMLFlBQVEsR0FBQ3ZMLENBQVQ7QUFBVzs7QUFBeEIsQ0FBbkMsRUFBNkQsQ0FBN0Q7QUFBZ0UsSUFBSXNDLFlBQUo7QUFBaUJ4QyxNQUFNLENBQUNDLElBQVAsQ0FBWSxjQUFaLEVBQTJCO0FBQUNtQixTQUFPLENBQUNsQixDQUFELEVBQUc7QUFBQ3NDLGdCQUFZLEdBQUN0QyxDQUFiO0FBQWU7O0FBQTNCLENBQTNCLEVBQXdELENBQXhEO0FBQTJELElBQUlDLEtBQUo7QUFBVUgsTUFBTSxDQUFDQyxJQUFQLENBQVksdUJBQVosRUFBb0M7QUFBQ0UsT0FBSyxDQUFDRCxDQUFELEVBQUc7QUFBQ0MsU0FBSyxHQUFDRCxDQUFOO0FBQVE7O0FBQWxCLENBQXBDLEVBQXdELENBQXhEO0FBQTJELElBQUlzZSxPQUFKO0FBQVl4ZSxNQUFNLENBQUNDLElBQVAsQ0FBWSxzREFBWixFQUFtRTtBQUFDdWUsU0FBTyxDQUFDdGUsQ0FBRCxFQUFHO0FBQUNzZSxXQUFPLEdBQUN0ZSxDQUFSO0FBQVU7O0FBQXRCLENBQW5FLEVBQTJGLENBQTNGO0FBTzlWLE1BQU1zaEIsa0JBQWtCLEdBQUcsSUFBSWhmLFlBQUosQ0FBaUI7QUFDeEMySSxTQUFPLEVBQUU7QUFDTHhILFFBQUksRUFBRUMsTUFERDtBQUVMSSxZQUFRLEVBQUM7QUFGSixHQUQrQjtBQUt4QzZHLFVBQVEsRUFBRTtBQUNObEgsUUFBSSxFQUFFQyxNQURBO0FBRU5DLFNBQUssRUFBRSwyREFGRDtBQUdORyxZQUFRLEVBQUM7QUFISCxHQUw4QjtBQVV4Q3FILFlBQVUsRUFBRTtBQUNSMUgsUUFBSSxFQUFFQyxNQURFO0FBRVJDLFNBQUssRUFBRXJCLFlBQVksQ0FBQ3NCLEtBQWIsQ0FBbUIrSCxLQUZsQjtBQUdSN0gsWUFBUSxFQUFDO0FBSEQsR0FWNEI7QUFleEM4SCxhQUFXLEVBQUM7QUFDUm5JLFFBQUksRUFBRUMsTUFERTtBQUVSQyxTQUFLLEVBQUUsMkRBRkM7QUFHUkcsWUFBUSxFQUFDO0FBSEQ7QUFmNEIsQ0FBakIsQ0FBM0I7QUFzQkEsTUFBTXlkLGdCQUFnQixHQUFHLElBQUlqZixZQUFKLENBQWlCO0FBQ3RDc2EsVUFBUSxFQUFFO0FBQ1JuWixRQUFJLEVBQUVDLE1BREU7QUFFUkMsU0FBSyxFQUFFLCtCQUZDLENBRWdDOztBQUZoQyxHQUQ0QjtBQUt0Q3dDLE9BQUssRUFBRTtBQUNMMUMsUUFBSSxFQUFFQyxNQUREO0FBRUxDLFNBQUssRUFBRXJCLFlBQVksQ0FBQ3NCLEtBQWIsQ0FBbUIrSDtBQUZyQixHQUwrQjtBQVN0Q21SLFVBQVEsRUFBRTtBQUNSclosUUFBSSxFQUFFQyxNQURFO0FBRVJDLFNBQUssRUFBRSwrQkFGQyxDQUUrQjs7QUFGL0IsR0FUNEI7QUFhdEM0SSxjQUFZLEVBQUM7QUFDVDlJLFFBQUksRUFBRTZkLGtCQURHO0FBRVR4ZCxZQUFRLEVBQUM7QUFGQTtBQWJ5QixDQUFqQixDQUF6QjtBQWtCRSxNQUFNMGQsZ0JBQWdCLEdBQUcsSUFBSWxmLFlBQUosQ0FBaUI7QUFDeENpSyxjQUFZLEVBQUM7QUFDVDlJLFFBQUksRUFBRTZkO0FBREc7QUFEMkIsQ0FBakIsQ0FBekIsQyxDQU1GOztBQUNBLE1BQU1HLGlCQUFpQixHQUNyQjtBQUNFQyxNQUFJLEVBQUMsT0FEUDtBQUVFQyxjQUFZLEVBQ1o7QUFDSW5DLGdCQUFZLEVBQUcsSUFEbkIsQ0FFSTs7QUFGSixHQUhGO0FBT0VvQyxtQkFBaUIsRUFBRSxDQUFDLE9BQUQsRUFBUyxXQUFULENBUHJCO0FBUUVDLFdBQVMsRUFDVDtBQUNJQyxVQUFNLEVBQUM7QUFBQ0Msa0JBQVksRUFBRztBQUFoQixLQURYO0FBRUkxQixRQUFJLEVBQ0o7QUFDSTBCLGtCQUFZLEVBQUcsT0FEbkI7QUFFSXJDLFlBQU0sRUFBRSxZQUFVO0FBQ2QsY0FBTVksT0FBTyxHQUFHLEtBQUtILFdBQXJCO0FBQ0EsY0FBTUksT0FBTyxHQUFHLEtBQUtDLFVBQXJCO0FBQ0EsWUFBSU4sTUFBTSxHQUFHLEVBQWI7QUFDQSxZQUFHSSxPQUFPLEtBQUtoWSxTQUFmLEVBQTBCNFgsTUFBTSxtQ0FBT0ksT0FBUCxDQUFOO0FBQzFCLFlBQUdDLE9BQU8sS0FBS2pZLFNBQWYsRUFBMEI0WCxNQUFNLG1DQUFPQSxNQUFQLEVBQWtCSyxPQUFsQixDQUFOOztBQUMxQixZQUFHO0FBQ0MsY0FBSWxnQixNQUFKO0FBQ0FraEIsMEJBQWdCLENBQUNsZ0IsUUFBakIsQ0FBMEI2ZSxNQUExQjtBQUNBNUIsaUJBQU8sQ0FBQyxXQUFELEVBQWE0QixNQUFiLENBQVA7O0FBQ0EsY0FBR0EsTUFBTSxDQUFDM1QsWUFBUCxLQUF3QmpFLFNBQTNCLEVBQXFDO0FBQ2pDakksa0JBQU0sR0FBR2tMLFFBQVEsQ0FBQ3NTLFVBQVQsQ0FBb0I7QUFBQ2pCLHNCQUFRLEVBQUNzRCxNQUFNLENBQUN0RCxRQUFqQjtBQUN6QnpXLG1CQUFLLEVBQUMrWixNQUFNLENBQUMvWixLQURZO0FBRXpCMlcsc0JBQVEsRUFBQ29ELE1BQU0sQ0FBQ3BELFFBRlM7QUFHekJ0USxxQkFBTyxFQUFDO0FBQUNELDRCQUFZLEVBQUMyVCxNQUFNLENBQUMzVDtBQUFyQjtBQUhpQixhQUFwQixDQUFUO0FBSUgsV0FMRCxNQU1JO0FBQ0FsTSxrQkFBTSxHQUFHa0wsUUFBUSxDQUFDc1MsVUFBVCxDQUFvQjtBQUFDakIsc0JBQVEsRUFBQ3NELE1BQU0sQ0FBQ3RELFFBQWpCO0FBQTBCelcsbUJBQUssRUFBQytaLE1BQU0sQ0FBQy9aLEtBQXZDO0FBQTZDMlcsc0JBQVEsRUFBQ29ELE1BQU0sQ0FBQ3BELFFBQTdEO0FBQXVFdFEscUJBQU8sRUFBQztBQUEvRSxhQUFwQixDQUFUO0FBQ0g7O0FBQ0QsaUJBQU87QUFBQzFFLGtCQUFNLEVBQUUsU0FBVDtBQUFvQnJHLGdCQUFJLEVBQUU7QUFBQ3VHLG9CQUFNLEVBQUUzSDtBQUFUO0FBQTFCLFdBQVA7QUFDSCxTQWRELENBY0UsT0FBTXFCLEtBQU4sRUFBYTtBQUNiLGlCQUFPO0FBQUNzZSxzQkFBVSxFQUFFLEdBQWI7QUFBa0JDLGdCQUFJLEVBQUU7QUFBQ25ZLG9CQUFNLEVBQUUsTUFBVDtBQUFpQm9ELHFCQUFPLEVBQUV4SixLQUFLLENBQUN3SjtBQUFoQztBQUF4QixXQUFQO0FBQ0Q7QUFFSjtBQTFCTCxLQUhKO0FBK0JJNFYsT0FBRyxFQUNIO0FBQ0lwQixZQUFNLEVBQUUsWUFBVTtBQUNkLGNBQU1ZLE9BQU8sR0FBRyxLQUFLSCxXQUFyQjtBQUNBLGNBQU1JLE9BQU8sR0FBRyxLQUFLQyxVQUFyQjtBQUNBLFlBQUlOLE1BQU0sR0FBRyxFQUFiO0FBQ0EsWUFBSU8sR0FBRyxHQUFDLEtBQUtwZ0IsTUFBYjtBQUNBLGNBQU0yaEIsT0FBTyxHQUFDLEtBQUtyQyxTQUFMLENBQWUxWCxFQUE3QjtBQUNBLFlBQUdxWSxPQUFPLEtBQUtoWSxTQUFmLEVBQTBCNFgsTUFBTSxtQ0FBT0ksT0FBUCxDQUFOO0FBQzFCLFlBQUdDLE9BQU8sS0FBS2pZLFNBQWYsRUFBMEI0WCxNQUFNLG1DQUFPQSxNQUFQLEVBQWtCSyxPQUFsQixDQUFOOztBQUUxQixZQUFHO0FBQUU7QUFDRCxjQUFHLENBQUN0Z0IsS0FBSyxDQUFDTSxZQUFOLENBQW1Ca2dCLEdBQW5CLEVBQXdCLE9BQXhCLENBQUosRUFBcUM7QUFDakMsZ0JBQUdBLEdBQUcsS0FBR3VCLE9BQVQsRUFBaUI7QUFDYixvQkFBTXJnQixLQUFLLENBQUMsZUFBRCxDQUFYO0FBQ0g7QUFDSjs7QUFDRDZmLDBCQUFnQixDQUFDbmdCLFFBQWpCLENBQTBCNmUsTUFBMUI7O0FBQ0EsY0FBRyxDQUFDcmdCLE1BQU0sQ0FBQ3lNLEtBQVAsQ0FBYXBKLE1BQWIsQ0FBb0IsS0FBS3ljLFNBQUwsQ0FBZTFYLEVBQW5DLEVBQXNDO0FBQUMrSSxnQkFBSSxFQUFDO0FBQUMsc0NBQXVCa1AsTUFBTSxDQUFDM1Q7QUFBL0I7QUFBTixXQUF0QyxDQUFKLEVBQStGO0FBQzNGLGtCQUFNNUssS0FBSyxDQUFDLHVCQUFELENBQVg7QUFDSDs7QUFDRCxpQkFBTztBQUFDbUcsa0JBQU0sRUFBRSxTQUFUO0FBQW9CckcsZ0JBQUksRUFBRTtBQUFDdUcsb0JBQU0sRUFBRSxLQUFLMlgsU0FBTCxDQUFlMVgsRUFBeEI7QUFBNEJzRSwwQkFBWSxFQUFDMlQsTUFBTSxDQUFDM1Q7QUFBaEQ7QUFBMUIsV0FBUDtBQUNILFNBWEQsQ0FXRSxPQUFNN0ssS0FBTixFQUFhO0FBQ2IsaUJBQU87QUFBQ3NlLHNCQUFVLEVBQUUsR0FBYjtBQUFrQkMsZ0JBQUksRUFBRTtBQUFDblksb0JBQU0sRUFBRSxNQUFUO0FBQWlCb0QscUJBQU8sRUFBRXhKLEtBQUssQ0FBQ3dKO0FBQWhDO0FBQXhCLFdBQVA7QUFDRDtBQUNKO0FBeEJMO0FBaENKO0FBVEYsQ0FERjtBQXNFQW1VLEdBQUcsQ0FBQzRDLGFBQUosQ0FBa0JwaUIsTUFBTSxDQUFDeU0sS0FBekIsRUFBK0JtVixpQkFBL0IsRTs7Ozs7Ozs7Ozs7Ozs7O0FDNUhBLElBQUlwQyxHQUFKO0FBQVF2ZixNQUFNLENBQUNDLElBQVAsQ0FBWSxZQUFaLEVBQXlCO0FBQUNzZixLQUFHLENBQUNyZixDQUFELEVBQUc7QUFBQ3FmLE9BQUcsR0FBQ3JmLENBQUo7QUFBTTs7QUFBZCxDQUF6QixFQUF5QyxDQUF6QztBQUE0QyxJQUFJMGEsV0FBSjtBQUFnQjVhLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLHNEQUFaLEVBQW1FO0FBQUNtQixTQUFPLENBQUNsQixDQUFELEVBQUc7QUFBQzBhLGVBQVcsR0FBQzFhLENBQVo7QUFBYzs7QUFBMUIsQ0FBbkUsRUFBK0YsQ0FBL0Y7QUFHcEVxZixHQUFHLENBQUNFLFFBQUosQ0FBYSxlQUFiLEVBQThCO0FBQUNDLGNBQVksRUFBRTtBQUFmLENBQTlCLEVBQW9EO0FBQ2xEQyxLQUFHLEVBQUU7QUFDSEQsZ0JBQVksRUFBRSxLQURYO0FBRUhFLFVBQU0sRUFBRSxZQUFXO0FBQ2YsWUFBTVksT0FBTyxHQUFHLEtBQUtILFdBQXJCO0FBQ0EsWUFBTUksT0FBTyxHQUFHLEtBQUtDLFVBQXJCO0FBQ0EsVUFBSU4sTUFBTSxHQUFHLEVBQWI7QUFDQSxVQUFHSSxPQUFPLEtBQUtoWSxTQUFmLEVBQTBCNFgsTUFBTSxtQ0FBT0ksT0FBUCxDQUFOO0FBQzFCLFVBQUdDLE9BQU8sS0FBS2pZLFNBQWYsRUFBMEI0WCxNQUFNLG1DQUFPQSxNQUFQLEVBQWtCSyxPQUFsQixDQUFOOztBQUU1QixVQUFJO0FBQ0YsY0FBTVEsR0FBRyxHQUFHckcsV0FBVyxDQUFDd0YsTUFBRCxDQUF2QjtBQUNBLGVBQU87QUFBQ3BZLGdCQUFNLEVBQUUsU0FBVDtBQUFvQnJHLGNBQUksRUFBRTtBQUFDc2Y7QUFBRDtBQUExQixTQUFQO0FBQ0QsT0FIRCxDQUdFLE9BQU1yZixLQUFOLEVBQWE7QUFDYixlQUFPO0FBQUNzZSxvQkFBVSxFQUFFLEdBQWI7QUFBa0JDLGNBQUksRUFBRTtBQUFDblksa0JBQU0sRUFBRSxNQUFUO0FBQWlCb0QsbUJBQU8sRUFBRXhKLEtBQUssQ0FBQ3dKO0FBQWhDO0FBQXhCLFNBQVA7QUFDRDtBQUNGO0FBZkU7QUFENkMsQ0FBcEQsRTs7Ozs7Ozs7Ozs7QUNIQXBMLE1BQU0sQ0FBQ3NDLE1BQVAsQ0FBYztBQUFDMkcsd0JBQXNCLEVBQUMsTUFBSUEsc0JBQTVCO0FBQW1Ec0wsK0JBQTZCLEVBQUMsTUFBSUEsNkJBQXJGO0FBQW1IaUwsd0JBQXNCLEVBQUMsTUFBSUEsc0JBQTlJO0FBQXFLeFcsaUJBQWUsRUFBQyxNQUFJQSxlQUF6TDtBQUF5TXNYLGtCQUFnQixFQUFDLE1BQUlBLGdCQUE5TjtBQUErT3BYLFVBQVEsRUFBQyxNQUFJQSxRQUE1UDtBQUFxUUMsU0FBTyxFQUFDLE1BQUlBLE9BQWpSO0FBQXlSb1csS0FBRyxFQUFDLE1BQUlBO0FBQWpTLENBQWQ7QUFBcVQsSUFBSTZDLFFBQUo7QUFBYXBpQixNQUFNLENBQUNDLElBQVAsQ0FBWSx3QkFBWixFQUFxQztBQUFDbWlCLFVBQVEsQ0FBQ2xpQixDQUFELEVBQUc7QUFBQ2tpQixZQUFRLEdBQUNsaUIsQ0FBVDtBQUFXOztBQUF4QixDQUFyQyxFQUErRCxDQUEvRDtBQUFrRSxJQUFJbWIsT0FBSjtBQUFZcmIsTUFBTSxDQUFDQyxJQUFQLENBQVksdURBQVosRUFBb0U7QUFBQ29iLFNBQU8sQ0FBQ25iLENBQUQsRUFBRztBQUFDbWIsV0FBTyxHQUFDbmIsQ0FBUjtBQUFVOztBQUF0QixDQUFwRSxFQUE0RixDQUE1RjtBQUErRixJQUFJNGIsUUFBSixFQUFhQyxXQUFiLEVBQXlCQyxVQUF6QixFQUFvQ0MsU0FBcEM7QUFBOENqYyxNQUFNLENBQUNDLElBQVAsQ0FBWSx1REFBWixFQUFvRTtBQUFDNmIsVUFBUSxDQUFDNWIsQ0FBRCxFQUFHO0FBQUM0YixZQUFRLEdBQUM1YixDQUFUO0FBQVcsR0FBeEI7O0FBQXlCNmIsYUFBVyxDQUFDN2IsQ0FBRCxFQUFHO0FBQUM2YixlQUFXLEdBQUM3YixDQUFaO0FBQWMsR0FBdEQ7O0FBQXVEOGIsWUFBVSxDQUFDOWIsQ0FBRCxFQUFHO0FBQUM4YixjQUFVLEdBQUM5YixDQUFYO0FBQWEsR0FBbEY7O0FBQW1GK2IsV0FBUyxDQUFDL2IsQ0FBRCxFQUFHO0FBQUMrYixhQUFTLEdBQUMvYixDQUFWO0FBQVk7O0FBQTVHLENBQXBFLEVBQWtMLENBQWxMO0FBSXRoQixNQUFNK0ksc0JBQXNCLEdBQUcsZ0JBQS9CO0FBQ0EsTUFBTXNMLDZCQUE2QixHQUFHLFFBQXRDO0FBQ0EsTUFBTWlMLHNCQUFzQixHQUFHLGNBQS9CO0FBQ0EsTUFBTXhXLGVBQWUsR0FBRyxVQUF4QjtBQUNBLE1BQU1zWCxnQkFBZ0IsR0FBRyxRQUF6QjtBQUNBLE1BQU1wWCxRQUFRLEdBQUcsTUFBakI7QUFDQSxNQUFNQyxPQUFPLEdBQUcsSUFBaEI7QUFFQSxNQUFNb1csR0FBRyxHQUFHLElBQUk2QyxRQUFKLENBQWE7QUFDOUJDLFNBQU8sRUFBRW5aLFFBRHFCO0FBRTlCeVUsU0FBTyxFQUFFeFUsT0FGcUI7QUFHOUJtWixnQkFBYyxFQUFFLElBSGM7QUFJOUJDLFlBQVUsRUFBRTtBQUprQixDQUFiLENBQVo7QUFPUCxJQUFHbEgsT0FBTyxFQUFWLEVBQWNxRCxPQUFPLENBQUMsb0JBQUQsQ0FBUDtBQUNkLElBQUd6QyxTQUFTLENBQUNILFFBQUQsQ0FBWixFQUF3QjRDLE9BQU8sQ0FBQyxtQkFBRCxDQUFQO0FBQ3hCLElBQUd6QyxTQUFTLENBQUNGLFdBQUQsQ0FBWixFQUEyQjJDLE9BQU8sQ0FBQyxzQkFBRCxDQUFQO0FBQzNCLElBQUd6QyxTQUFTLENBQUNELFVBQUQsQ0FBWixFQUEwQjBDLE9BQU8sQ0FBQyxxQkFBRCxDQUFQOztBQUMxQkEsT0FBTyxDQUFDLG1CQUFELENBQVA7O0FBQ0FBLE9BQU8sQ0FBQyxxQkFBRCxDQUFQLEM7Ozs7Ozs7Ozs7O0FDeEJBMWUsTUFBTSxDQUFDc0MsTUFBUCxDQUFjO0FBQUMyVixnQkFBYyxFQUFDLE1BQUlBO0FBQXBCLENBQWQ7QUFBbUQsSUFBSXVLLGFBQUosRUFBa0J4SyxHQUFsQjtBQUFzQmhZLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLDhCQUFaLEVBQTJDO0FBQUN1aUIsZUFBYSxDQUFDdGlCLENBQUQsRUFBRztBQUFDc2lCLGlCQUFhLEdBQUN0aUIsQ0FBZDtBQUFnQixHQUFsQzs7QUFBbUM4WCxLQUFHLENBQUM5WCxDQUFELEVBQUc7QUFBQzhYLE9BQUcsR0FBQzlYLENBQUo7QUFBTTs7QUFBaEQsQ0FBM0MsRUFBNkYsQ0FBN0Y7QUFBZ0csSUFBSUgsTUFBSjtBQUFXQyxNQUFNLENBQUNDLElBQVAsQ0FBWSxlQUFaLEVBQTRCO0FBQUNGLFFBQU0sQ0FBQ0csQ0FBRCxFQUFHO0FBQUNILFVBQU0sR0FBQ0csQ0FBUDtBQUFTOztBQUFwQixDQUE1QixFQUFrRCxDQUFsRDtBQUFxRCxJQUFJeUMsTUFBSjtBQUFXM0MsTUFBTSxDQUFDQyxJQUFQLENBQVksaURBQVosRUFBOEQ7QUFBQ21CLFNBQU8sQ0FBQ2xCLENBQUQsRUFBRztBQUFDeUMsVUFBTSxHQUFDekMsQ0FBUDtBQUFTOztBQUFyQixDQUE5RCxFQUFxRixDQUFyRjtBQUF3RixJQUFJa0QsTUFBSjtBQUFXcEQsTUFBTSxDQUFDQyxJQUFQLENBQVksaURBQVosRUFBOEQ7QUFBQ21CLFNBQU8sQ0FBQ2xCLENBQUQsRUFBRztBQUFDa0QsVUFBTSxHQUFDbEQsQ0FBUDtBQUFTOztBQUFyQixDQUE5RCxFQUFxRixDQUFyRjtBQUF3RixJQUFJOE8sbUJBQUo7QUFBd0JoUCxNQUFNLENBQUNDLElBQVAsQ0FBWSxpRUFBWixFQUE4RTtBQUFDbUIsU0FBTyxDQUFDbEIsQ0FBRCxFQUFHO0FBQUM4Tyx1QkFBbUIsR0FBQzlPLENBQXBCO0FBQXNCOztBQUFsQyxDQUE5RSxFQUFrSCxDQUFsSDtBQUFxSCxJQUFJNmIsV0FBSixFQUFnQkUsU0FBaEI7QUFBMEJqYyxNQUFNLENBQUNDLElBQVAsQ0FBWSxvREFBWixFQUFpRTtBQUFDOGIsYUFBVyxDQUFDN2IsQ0FBRCxFQUFHO0FBQUM2YixlQUFXLEdBQUM3YixDQUFaO0FBQWMsR0FBOUI7O0FBQStCK2IsV0FBUyxDQUFDL2IsQ0FBRCxFQUFHO0FBQUMrYixhQUFTLEdBQUMvYixDQUFWO0FBQVk7O0FBQXhELENBQWpFLEVBQTJILENBQTNIO0FBQThILElBQUlzZSxPQUFKO0FBQVl4ZSxNQUFNLENBQUNDLElBQVAsQ0FBWSxnREFBWixFQUE2RDtBQUFDdWUsU0FBTyxDQUFDdGUsQ0FBRCxFQUFHO0FBQUNzZSxXQUFPLEdBQUN0ZSxDQUFSO0FBQVU7O0FBQXRCLENBQTdELEVBQXFGLENBQXJGO0FBRXp0QixNQUFNK1gsY0FBYyxHQUFHdUssYUFBYSxDQUFDLFlBQUQsQ0FBcEM7QUFTUHZLLGNBQWMsQ0FBQ3dLLFdBQWYsQ0FBMkIsUUFBM0IsRUFBcUM7QUFBQ0MsYUFBVyxFQUFFLEtBQUc7QUFBakIsQ0FBckMsRUFBNEQsVUFBVXhULEdBQVYsRUFBZXlULEVBQWYsRUFBbUI7QUFDN0UsTUFBSTtBQUNGLFVBQU1oYyxLQUFLLEdBQUd1SSxHQUFHLENBQUN2TixJQUFsQjtBQUNBZ0IsVUFBTSxDQUFDZ0UsS0FBRCxDQUFOO0FBQ0F1SSxPQUFHLENBQUNZLElBQUo7QUFDRCxHQUpELENBSUUsT0FBTWhILFNBQU4sRUFBaUI7QUFDakJvRyxPQUFHLENBQUMwVCxJQUFKO0FBRUUsVUFBTSxJQUFJN2lCLE1BQU0sQ0FBQzhCLEtBQVgsQ0FBaUIsa0NBQWpCLEVBQXFEaUgsU0FBckQsQ0FBTjtBQUNILEdBUkQsU0FRVTtBQUNSNlosTUFBRTtBQUNIO0FBQ0YsQ0FaRDtBQWNBMUssY0FBYyxDQUFDd0ssV0FBZixDQUEyQixRQUEzQixFQUFxQztBQUFDQyxhQUFXLEVBQUUsS0FBRztBQUFqQixDQUFyQyxFQUE0RCxVQUFVeFQsR0FBVixFQUFleVQsRUFBZixFQUFtQjtBQUM3RSxNQUFJO0FBQ0YsVUFBTWhjLEtBQUssR0FBR3VJLEdBQUcsQ0FBQ3ZOLElBQWxCO0FBQ0F5QixVQUFNLENBQUN1RCxLQUFELEVBQU91SSxHQUFQLENBQU47QUFDRCxHQUhELENBR0UsT0FBTXBHLFNBQU4sRUFBaUI7QUFDakJvRyxPQUFHLENBQUMwVCxJQUFKO0FBQ0EsVUFBTSxJQUFJN2lCLE1BQU0sQ0FBQzhCLEtBQVgsQ0FBaUIsa0NBQWpCLEVBQXFEaUgsU0FBckQsQ0FBTjtBQUNELEdBTkQsU0FNVTtBQUNSNlosTUFBRTtBQUNIO0FBQ0YsQ0FWRDtBQVlBMUssY0FBYyxDQUFDd0ssV0FBZixDQUEyQixxQkFBM0IsRUFBa0Q7QUFBQ0MsYUFBVyxFQUFFLEtBQUc7QUFBakIsQ0FBbEQsRUFBeUUsVUFBVXhULEdBQVYsRUFBZXlULEVBQWYsRUFBbUI7QUFDMUYsTUFBSTtBQUNGLFFBQUcsQ0FBQzFHLFNBQVMsQ0FBQ0YsV0FBRCxDQUFiLEVBQTRCO0FBQzFCN00sU0FBRyxDQUFDMlQsS0FBSjtBQUNBM1QsU0FBRyxDQUFDZ0csTUFBSjtBQUNBaEcsU0FBRyxDQUFDM0wsTUFBSjtBQUNELEtBSkQsTUFJTyxDQUNMO0FBQ0Q7QUFDRixHQVJELENBUUUsT0FBTXVGLFNBQU4sRUFBaUI7QUFDakJvRyxPQUFHLENBQUMwVCxJQUFKO0FBQ0EsVUFBTSxJQUFJN2lCLE1BQU0sQ0FBQzhCLEtBQVgsQ0FBaUIsZ0RBQWpCLEVBQW1FaUgsU0FBbkUsQ0FBTjtBQUNELEdBWEQsU0FXVTtBQUNSNlosTUFBRTtBQUNIO0FBQ0YsQ0FmRDtBQWlCQSxJQUFJM0ssR0FBSixDQUFRQyxjQUFSLEVBQXdCLFNBQXhCLEVBQW1DLEVBQW5DLEVBQ0s2SyxNQURMLENBQ1k7QUFBRUMsVUFBUSxFQUFFOUssY0FBYyxDQUFDK0ssS0FBZixDQUFxQjdVLEtBQXJCLENBQTJCOFUsSUFBM0IsQ0FBZ0MsaUJBQWhDO0FBQVosQ0FEWixFQUVLM0ssSUFGTCxDQUVVO0FBQUNDLGVBQWEsRUFBRTtBQUFoQixDQUZWO0FBSUEsSUFBSTJLLENBQUMsR0FBR2pMLGNBQWMsQ0FBQ3dLLFdBQWYsQ0FBMkIsU0FBM0IsRUFBcUM7QUFBRVUsY0FBWSxFQUFFLEtBQWhCO0FBQXVCVCxhQUFXLEVBQUUsS0FBRztBQUF2QyxDQUFyQyxFQUFvRixVQUFVeFQsR0FBVixFQUFleVQsRUFBZixFQUFtQjtBQUM3RyxRQUFNUyxPQUFPLEdBQUcsSUFBSWxnQixJQUFKLEVBQWhCO0FBQ0VrZ0IsU0FBTyxDQUFDQyxVQUFSLENBQW1CRCxPQUFPLENBQUNFLFVBQVIsS0FBdUIsQ0FBMUM7QUFFRixRQUFNQyxHQUFHLEdBQUd0TCxjQUFjLENBQUN2WCxJQUFmLENBQW9CO0FBQ3hCc0gsVUFBTSxFQUFFO0FBQUN3YixTQUFHLEVBQUV4TCxHQUFHLENBQUN5TDtBQUFWLEtBRGdCO0FBRXhCQyxXQUFPLEVBQUU7QUFBQ0MsU0FBRyxFQUFFUDtBQUFOO0FBRmUsR0FBcEIsRUFHSjtBQUFDeGlCLFVBQU0sRUFBRTtBQUFFOEMsU0FBRyxFQUFFO0FBQVA7QUFBVCxHQUhJLENBQVo7QUFLRThhLFNBQU8sQ0FBQyxtQ0FBRCxFQUFxQytFLEdBQXJDLENBQVA7QUFDQXRMLGdCQUFjLENBQUMyTCxVQUFmLENBQTBCTCxHQUExQjs7QUFDQSxNQUFHQSxHQUFHLENBQUNyWCxNQUFKLEdBQWEsQ0FBaEIsRUFBa0I7QUFDaEJnRCxPQUFHLENBQUNZLElBQUosQ0FBUyxnQ0FBVDtBQUNEOztBQUNENlMsSUFBRTtBQUNMLENBZk8sQ0FBUjtBQWlCQTFLLGNBQWMsQ0FBQ3ZYLElBQWYsQ0FBb0I7QUFBRWlELE1BQUksRUFBRSxTQUFSO0FBQW1CcUUsUUFBTSxFQUFFO0FBQTNCLENBQXBCLEVBQ0s2YixPQURMLENBQ2E7QUFDTEMsT0FBSyxFQUFFLFlBQVk7QUFBRVosS0FBQyxDQUFDYSxPQUFGO0FBQWM7QUFEOUIsQ0FEYixFOzs7Ozs7Ozs7OztBQzNFQS9qQixNQUFNLENBQUNzQyxNQUFQLENBQWM7QUFBQ2tXLFVBQVEsRUFBQyxNQUFJQTtBQUFkLENBQWQ7QUFBdUMsSUFBSWdLLGFBQUosRUFBa0J4SyxHQUFsQjtBQUFzQmhZLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLDhCQUFaLEVBQTJDO0FBQUN1aUIsZUFBYSxDQUFDdGlCLENBQUQsRUFBRztBQUFDc2lCLGlCQUFhLEdBQUN0aUIsQ0FBZDtBQUFnQixHQUFsQzs7QUFBbUM4WCxLQUFHLENBQUM5WCxDQUFELEVBQUc7QUFBQzhYLE9BQUcsR0FBQzlYLENBQUo7QUFBTTs7QUFBaEQsQ0FBM0MsRUFBNkYsQ0FBN0Y7QUFBZ0csSUFBSStKLGdCQUFKO0FBQXFCakssTUFBTSxDQUFDQyxJQUFQLENBQVksMkRBQVosRUFBd0U7QUFBQ21CLFNBQU8sQ0FBQ2xCLENBQUQsRUFBRztBQUFDK0osb0JBQWdCLEdBQUMvSixDQUFqQjtBQUFtQjs7QUFBL0IsQ0FBeEUsRUFBeUcsQ0FBekc7QUFBNEcsSUFBSUgsTUFBSjtBQUFXQyxNQUFNLENBQUNDLElBQVAsQ0FBWSxlQUFaLEVBQTRCO0FBQUNGLFFBQU0sQ0FBQ0csQ0FBRCxFQUFHO0FBQUNILFVBQU0sR0FBQ0csQ0FBUDtBQUFTOztBQUFwQixDQUE1QixFQUFrRCxDQUFsRDtBQUFxRCxJQUFJc2UsT0FBSjtBQUFZeGUsTUFBTSxDQUFDQyxJQUFQLENBQVksZ0RBQVosRUFBNkQ7QUFBQ3VlLFNBQU8sQ0FBQ3RlLENBQUQsRUFBRztBQUFDc2UsV0FBTyxHQUFDdGUsQ0FBUjtBQUFVOztBQUF0QixDQUE3RCxFQUFxRixDQUFyRjtBQUF3RixJQUFJK1gsY0FBSjtBQUFtQmpZLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLG1CQUFaLEVBQWdDO0FBQUNnWSxnQkFBYyxDQUFDL1gsQ0FBRCxFQUFHO0FBQUMrWCxrQkFBYyxHQUFDL1gsQ0FBZjtBQUFpQjs7QUFBcEMsQ0FBaEMsRUFBc0UsQ0FBdEU7QUFNOWMsTUFBTXNZLFFBQVEsR0FBR2dLLGFBQWEsQ0FBQyxNQUFELENBQTlCO0FBRVBoSyxRQUFRLENBQUNpSyxXQUFULENBQXFCLGtCQUFyQixFQUF5QyxVQUFVdlQsR0FBVixFQUFleVQsRUFBZixFQUFtQjtBQUMxRCxNQUFJO0FBQ0YsVUFBTWhoQixJQUFJLEdBQUd1TixHQUFHLENBQUN2TixJQUFqQjtBQUNBc0ksb0JBQWdCLENBQUN0SSxJQUFELENBQWhCO0FBQ0F1TixPQUFHLENBQUNZLElBQUo7QUFDRCxHQUpELENBSUUsT0FBTWhILFNBQU4sRUFBaUI7QUFDakJvRyxPQUFHLENBQUMwVCxJQUFKO0FBQ0EsVUFBTSxJQUFJN2lCLE1BQU0sQ0FBQzhCLEtBQVgsQ0FBaUIsc0NBQWpCLEVBQXlEaUgsU0FBekQsQ0FBTjtBQUNELEdBUEQsU0FPVTtBQUNSNlosTUFBRTtBQUNIO0FBQ0YsQ0FYRDtBQWNBLElBQUkzSyxHQUFKLENBQVFRLFFBQVIsRUFBa0IsU0FBbEIsRUFBNkIsRUFBN0IsRUFDS3NLLE1BREwsQ0FDWTtBQUFFQyxVQUFRLEVBQUV2SyxRQUFRLENBQUN3SyxLQUFULENBQWU3VSxLQUFmLENBQXFCOFUsSUFBckIsQ0FBMEIsaUJBQTFCO0FBQVosQ0FEWixFQUVLM0ssSUFGTCxDQUVVO0FBQUNDLGVBQWEsRUFBRTtBQUFoQixDQUZWO0FBSUEsSUFBSTJLLENBQUMsR0FBRzFLLFFBQVEsQ0FBQ2lLLFdBQVQsQ0FBcUIsU0FBckIsRUFBK0I7QUFBRVUsY0FBWSxFQUFFLEtBQWhCO0FBQXVCVCxhQUFXLEVBQUUsS0FBRztBQUF2QyxDQUEvQixFQUE4RSxVQUFVeFQsR0FBVixFQUFleVQsRUFBZixFQUFtQjtBQUNyRyxRQUFNUyxPQUFPLEdBQUcsSUFBSWxnQixJQUFKLEVBQWhCO0FBQ0FrZ0IsU0FBTyxDQUFDQyxVQUFSLENBQW1CRCxPQUFPLENBQUNFLFVBQVIsS0FBdUIsQ0FBMUM7QUFFQSxRQUFNQyxHQUFHLEdBQUcvSyxRQUFRLENBQUM5WCxJQUFULENBQWM7QUFDbEJzSCxVQUFNLEVBQUU7QUFBQ3diLFNBQUcsRUFBRXhMLEdBQUcsQ0FBQ3lMO0FBQVYsS0FEVTtBQUVsQkMsV0FBTyxFQUFFO0FBQUNDLFNBQUcsRUFBRVA7QUFBTjtBQUZTLEdBQWQsRUFHUjtBQUFDeGlCLFVBQU0sRUFBRTtBQUFFOEMsU0FBRyxFQUFFO0FBQVA7QUFBVCxHQUhRLENBQVo7QUFLQThhLFNBQU8sQ0FBQyxtQ0FBRCxFQUFxQytFLEdBQXJDLENBQVA7QUFDQS9LLFVBQVEsQ0FBQ29MLFVBQVQsQ0FBb0JMLEdBQXBCOztBQUNBLE1BQUdBLEdBQUcsQ0FBQ3JYLE1BQUosR0FBYSxDQUFoQixFQUFrQjtBQUNkZ0QsT0FBRyxDQUFDWSxJQUFKLENBQVMsZ0NBQVQ7QUFDSDs7QUFDRDZTLElBQUU7QUFDTCxDQWZPLENBQVI7QUFpQkFuSyxRQUFRLENBQUM5WCxJQUFULENBQWM7QUFBRWlELE1BQUksRUFBRSxTQUFSO0FBQW1CcUUsUUFBTSxFQUFFO0FBQTNCLENBQWQsRUFDSzZiLE9BREwsQ0FDYTtBQUNMQyxPQUFLLEVBQUUsWUFBWTtBQUFFWixLQUFDLENBQUNhLE9BQUY7QUFBYztBQUQ5QixDQURiLEU7Ozs7Ozs7Ozs7O0FDM0NBL2pCLE1BQU0sQ0FBQ3NDLE1BQVAsQ0FBYztBQUFDcUssWUFBVSxFQUFDLE1BQUlBO0FBQWhCLENBQWQ7QUFBMkMsSUFBSTVNLE1BQUo7QUFBV0MsTUFBTSxDQUFDQyxJQUFQLENBQVksZUFBWixFQUE0QjtBQUFDRixRQUFNLENBQUNHLENBQUQsRUFBRztBQUFDSCxVQUFNLEdBQUNHLENBQVA7QUFBUzs7QUFBcEIsQ0FBNUIsRUFBa0QsQ0FBbEQ7QUFBcUQsSUFBSThqQixHQUFKO0FBQVFoa0IsTUFBTSxDQUFDQyxJQUFQLENBQVksS0FBWixFQUFrQjtBQUFDbUIsU0FBTyxDQUFDbEIsQ0FBRCxFQUFHO0FBQUM4akIsT0FBRyxHQUFDOWpCLENBQUo7QUFBTTs7QUFBbEIsQ0FBbEIsRUFBc0MsQ0FBdEM7QUFBeUMsSUFBSTRILE9BQUo7QUFBWTlILE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGdEQUFaLEVBQTZEO0FBQUM2SCxTQUFPLENBQUM1SCxDQUFELEVBQUc7QUFBQzRILFdBQU8sR0FBQzVILENBQVI7QUFBVTs7QUFBdEIsQ0FBN0QsRUFBcUYsQ0FBckY7O0FBSWpLLFNBQVN5TSxVQUFULENBQW9CbEYsR0FBcEIsRUFBeUJ1QyxNQUF6QixFQUFpQztBQUN0QyxRQUFNaWEsUUFBUSxHQUFHbGtCLE1BQU0sQ0FBQ21rQixTQUFQLENBQWlCQyxjQUFqQixDQUFqQjs7QUFDQSxNQUFJO0FBQ0YsVUFBTUMsT0FBTyxHQUFHSCxRQUFRLENBQUN4YyxHQUFELEVBQU11QyxNQUFOLENBQXhCO0FBQ0EsUUFBR29hLE9BQU8sS0FBSzViLFNBQWYsRUFBMEIsT0FBT0EsU0FBUDtBQUMxQixRQUFJNUIsS0FBSyxHQUFHNEIsU0FBWjtBQUNBNGIsV0FBTyxDQUFDcmUsT0FBUixDQUFnQnNlLE1BQU0sSUFBSTtBQUN4QixVQUFHQSxNQUFNLENBQUMsQ0FBRCxDQUFOLENBQVUxVSxVQUFWLENBQXFCbEksR0FBckIsQ0FBSCxFQUE4QjtBQUM1QixjQUFNd1osR0FBRyxHQUFHb0QsTUFBTSxDQUFDLENBQUQsQ0FBTixDQUFVOVYsU0FBVixDQUFvQjlHLEdBQUcsQ0FBQ3lFLE1BQUosR0FBVyxDQUEvQixDQUFaO0FBQ0F0RixhQUFLLEdBQUdxYSxHQUFHLENBQUNxRCxJQUFKLEVBQVI7QUFFRDtBQUNGLEtBTkQ7QUFPQSxXQUFPMWQsS0FBUDtBQUNELEdBWkQsQ0FZRSxPQUFNaEYsS0FBTixFQUFhO0FBQ2JrRyxXQUFPLENBQUMsc0NBQUQsRUFBd0NrYyxHQUFHLENBQUNPLFVBQUosRUFBeEMsQ0FBUDtBQUNBLFFBQUczaUIsS0FBSyxDQUFDd0osT0FBTixDQUFjdUUsVUFBZCxDQUF5QixrQkFBekIsS0FDQy9OLEtBQUssQ0FBQ3dKLE9BQU4sQ0FBY3VFLFVBQWQsQ0FBeUIsb0JBQXpCLENBREosRUFDb0QsT0FBT25ILFNBQVAsQ0FEcEQsS0FFSyxNQUFNNUcsS0FBTjtBQUNOO0FBQ0Y7O0FBRUQsU0FBU3VpQixjQUFULENBQXdCMWMsR0FBeEIsRUFBNkJ1QyxNQUE3QixFQUFxQ3BILFFBQXJDLEVBQStDO0FBQzNDa0YsU0FBTyxDQUFDLCtCQUFELEVBQWtDO0FBQUNMLE9BQUcsRUFBQ0EsR0FBTDtBQUFTdUMsVUFBTSxFQUFDQTtBQUFoQixHQUFsQyxDQUFQO0FBQ0FnYSxLQUFHLENBQUNyWCxVQUFKLENBQWUzQyxNQUFmLEVBQXVCLENBQUNvTCxHQUFELEVBQU1nUCxPQUFOLEtBQWtCO0FBQ3pDeGhCLFlBQVEsQ0FBQ3dTLEdBQUQsRUFBTWdQLE9BQU4sQ0FBUjtBQUNELEdBRkM7QUFHSCxDOzs7Ozs7Ozs7OztBQy9CRHBrQixNQUFNLENBQUNzQyxNQUFQLENBQWM7QUFBQ3FMLFFBQU0sRUFBQyxNQUFJQSxNQUFaO0FBQW1CNlcsdUJBQXFCLEVBQUMsTUFBSUEscUJBQTdDO0FBQW1FQyxlQUFhLEVBQUMsTUFBSUEsYUFBckY7QUFBbUdqYixhQUFXLEVBQUMsTUFBSUEsV0FBbkg7QUFBK0htRixVQUFRLEVBQUMsTUFBSUEsUUFBNUk7QUFBcUprRixRQUFNLEVBQUMsTUFBSUEsTUFBaEs7QUFBdUtDLFNBQU8sRUFBQyxNQUFJQSxPQUFuTDtBQUEyTHBGLGdCQUFjLEVBQUMsTUFBSUEsY0FBOU07QUFBNk40RixnQkFBYyxFQUFDLE1BQUlBLGNBQWhQO0FBQStQMUYsbUJBQWlCLEVBQUMsTUFBSUEsaUJBQXJSO0FBQXVTM0gsWUFBVSxFQUFDLE1BQUlBLFVBQXRUO0FBQWlVcWEsU0FBTyxFQUFDLE1BQUlBO0FBQTdVLENBQWQ7QUFBcVcsSUFBSXZoQixNQUFKO0FBQVdDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGVBQVosRUFBNEI7QUFBQ0YsUUFBTSxDQUFDRyxDQUFELEVBQUc7QUFBQ0gsVUFBTSxHQUFDRyxDQUFQO0FBQVM7O0FBQXBCLENBQTVCLEVBQWtELENBQWxEO0FBQXFELElBQUkwVCxhQUFKLEVBQWtCL0osVUFBbEIsRUFBNkJDLFFBQTdCO0FBQXNDOUosTUFBTSxDQUFDQyxJQUFQLENBQVksZ0RBQVosRUFBNkQ7QUFBQzJULGVBQWEsQ0FBQzFULENBQUQsRUFBRztBQUFDMFQsaUJBQWEsR0FBQzFULENBQWQ7QUFBZ0IsR0FBbEM7O0FBQW1DMkosWUFBVSxDQUFDM0osQ0FBRCxFQUFHO0FBQUMySixjQUFVLEdBQUMzSixDQUFYO0FBQWEsR0FBOUQ7O0FBQStENEosVUFBUSxDQUFDNUosQ0FBRCxFQUFHO0FBQUM0SixZQUFRLEdBQUM1SixDQUFUO0FBQVc7O0FBQXRGLENBQTdELEVBQXFKLENBQXJKO0FBSTNjLE1BQU13a0IsU0FBUyxHQUFHLElBQWxCOztBQUdPLFNBQVMvVyxNQUFULENBQWdCZ1gsTUFBaEIsRUFBd0I5ZCxPQUF4QixFQUFpQztBQUN0QyxNQUFHLENBQUNBLE9BQUosRUFBWTtBQUNOQSxXQUFPLEdBQUcyZCxxQkFBcUIsQ0FBQyxFQUFELENBQXJCLENBQTBCLENBQTFCLENBQVY7QUFDQTVRLGlCQUFhLENBQUMsMEVBQUQsRUFBNEUvTSxPQUE1RSxDQUFiO0FBQ0w7O0FBQ0QsTUFBRyxDQUFDQSxPQUFKLEVBQVk7QUFDTkEsV0FBTyxHQUFHNGQsYUFBYSxDQUFDLEVBQUQsQ0FBdkI7QUFDQTdRLGlCQUFhLENBQUMsMEVBQUQsRUFBNEUvTSxPQUE1RSxDQUFiO0FBQ0w7O0FBQ0QsUUFBTW9kLFFBQVEsR0FBR2xrQixNQUFNLENBQUNta0IsU0FBUCxDQUFpQlUsb0JBQWpCLENBQWpCO0FBQ0EsU0FBT1gsUUFBUSxDQUFDVSxNQUFELEVBQVM5ZCxPQUFULENBQWY7QUFDRDs7QUFFRCxTQUFTK2Qsb0JBQVQsQ0FBOEJELE1BQTlCLEVBQXNDOWQsT0FBdEMsRUFBK0NqRSxRQUEvQyxFQUF5RDtBQUN2RCxRQUFNaWlCLFVBQVUsR0FBR2hlLE9BQW5CO0FBQ0E4ZCxRQUFNLENBQUNHLEdBQVAsQ0FBVyxhQUFYLEVBQTBCRCxVQUExQixFQUFzQyxVQUFTelAsR0FBVCxFQUFjelQsSUFBZCxFQUFvQjtBQUN4RCxRQUFHeVQsR0FBSCxFQUFTdEwsUUFBUSxDQUFDLHVCQUFELEVBQXlCc0wsR0FBekIsQ0FBUjtBQUNUeFMsWUFBUSxDQUFDd1MsR0FBRCxFQUFNelQsSUFBTixDQUFSO0FBQ0QsR0FIRDtBQUlEOztBQUVNLFNBQVM2aUIscUJBQVQsQ0FBK0JHLE1BQS9CLEVBQXVDSSxNQUF2QyxFQUErQztBQUNsRCxRQUFNZCxRQUFRLEdBQUdsa0IsTUFBTSxDQUFDbWtCLFNBQVAsQ0FBaUJjLDhCQUFqQixDQUFqQjtBQUNBLFNBQU9mLFFBQVEsQ0FBQ1UsTUFBRCxFQUFTSSxNQUFULENBQWY7QUFDSDs7QUFFRCxTQUFTQyw4QkFBVCxDQUF3Q0wsTUFBeEMsRUFBZ0RNLE9BQWhELEVBQXlEcmlCLFFBQXpELEVBQW1FO0FBQy9ELFFBQU1zaUIsVUFBVSxHQUFHRCxPQUFuQjtBQUNBTixRQUFNLENBQUNHLEdBQVAsQ0FBVyx1QkFBWCxFQUFvQ0ksVUFBcEMsRUFBZ0QsVUFBUzlQLEdBQVQsRUFBY3pULElBQWQsRUFBb0I7QUFDaEUsUUFBR3lULEdBQUgsRUFBU3RMLFFBQVEsQ0FBQyx3QkFBRCxFQUEwQnNMLEdBQTFCLENBQVI7QUFDVHhTLFlBQVEsQ0FBQ3dTLEdBQUQsRUFBTXpULElBQU4sQ0FBUjtBQUNILEdBSEQ7QUFJSDs7QUFFTSxTQUFTOGlCLGFBQVQsQ0FBdUJFLE1BQXZCLEVBQStCSSxNQUEvQixFQUF1QztBQUMxQyxRQUFNZCxRQUFRLEdBQUdsa0IsTUFBTSxDQUFDbWtCLFNBQVAsQ0FBaUJpQixzQkFBakIsQ0FBakI7QUFDQSxTQUFPbEIsUUFBUSxDQUFDVSxNQUFELEVBQVNJLE1BQVQsQ0FBZjtBQUNIOztBQUNELFNBQVNJLHNCQUFULENBQWdDUixNQUFoQyxFQUF3Q00sT0FBeEMsRUFBaURyaUIsUUFBakQsRUFBMkQ7QUFDdkQsUUFBTXNpQixVQUFVLEdBQUdELE9BQW5CO0FBQ0FOLFFBQU0sQ0FBQ0csR0FBUCxDQUFXLGdCQUFYLEVBQTZCSSxVQUE3QixFQUF5QyxVQUFTOVAsR0FBVCxFQUFjelQsSUFBZCxFQUFvQjtBQUN6RCxRQUFHeVQsR0FBSCxFQUFTdEwsUUFBUSxDQUFDLGlCQUFELEVBQW1Cc0wsR0FBbkIsQ0FBUjtBQUNUeFMsWUFBUSxDQUFDd1MsR0FBRCxFQUFNelQsSUFBTixDQUFSO0FBQ0gsR0FIRDtBQUlIOztBQUdNLFNBQVM2SCxXQUFULENBQXFCbWIsTUFBckIsRUFBNkI5ZCxPQUE3QixFQUFzQ3VFLE9BQXRDLEVBQStDO0FBQ2xELFFBQU02WSxRQUFRLEdBQUdsa0IsTUFBTSxDQUFDbWtCLFNBQVAsQ0FBaUJrQixvQkFBakIsQ0FBakI7QUFDQSxTQUFPbkIsUUFBUSxDQUFDVSxNQUFELEVBQVM5ZCxPQUFULEVBQWtCdUUsT0FBbEIsQ0FBZjtBQUNIOztBQUVELFNBQVNnYSxvQkFBVCxDQUE4QlQsTUFBOUIsRUFBc0M5ZCxPQUF0QyxFQUErQ3VFLE9BQS9DLEVBQXdEeEksUUFBeEQsRUFBa0U7QUFDOUQsUUFBTWlpQixVQUFVLEdBQUdoZSxPQUFuQjtBQUNBLFFBQU13ZSxVQUFVLEdBQUdqYSxPQUFuQjtBQUNBdVosUUFBTSxDQUFDRyxHQUFQLENBQVcsYUFBWCxFQUEwQkQsVUFBMUIsRUFBc0NRLFVBQXRDLEVBQWtELFVBQVNqUSxHQUFULEVBQWN6VCxJQUFkLEVBQW9CO0FBQ2xFaUIsWUFBUSxDQUFDd1MsR0FBRCxFQUFNelQsSUFBTixDQUFSO0FBQ0gsR0FGRDtBQUdIOztBQUVNLFNBQVNnTixRQUFULENBQWtCZ1csTUFBbEIsRUFBMEJ4YyxFQUExQixFQUE4QjtBQUNuQyxRQUFNOGIsUUFBUSxHQUFHbGtCLE1BQU0sQ0FBQ21rQixTQUFQLENBQWlCb0IsaUJBQWpCLENBQWpCO0FBQ0EsU0FBT3JCLFFBQVEsQ0FBQ1UsTUFBRCxFQUFTeGMsRUFBVCxDQUFmO0FBQ0Q7O0FBRUQsU0FBU21kLGlCQUFULENBQTJCWCxNQUEzQixFQUFtQ3hjLEVBQW5DLEVBQXVDdkYsUUFBdkMsRUFBaUQ7QUFDL0MsUUFBTTJpQixLQUFLLEdBQUdDLE9BQU8sQ0FBQ3JkLEVBQUQsQ0FBckI7QUFDQTBCLFlBQVUsQ0FBQywwQkFBRCxFQUE0QjBiLEtBQTVCLENBQVY7QUFDQVosUUFBTSxDQUFDRyxHQUFQLENBQVcsV0FBWCxFQUF3QlMsS0FBeEIsRUFBK0IsVUFBU25RLEdBQVQsRUFBY3pULElBQWQsRUFBb0I7QUFDakQsUUFBR3lULEdBQUcsS0FBSzVNLFNBQVIsSUFBcUI0TSxHQUFHLEtBQUssSUFBN0IsSUFBcUNBLEdBQUcsQ0FBQ2hLLE9BQUosQ0FBWXVFLFVBQVosQ0FBdUIsZ0JBQXZCLENBQXhDLEVBQWtGO0FBQ2hGeUYsU0FBRyxHQUFHNU0sU0FBTixFQUNBN0csSUFBSSxHQUFHNkcsU0FEUDtBQUVEOztBQUNENUYsWUFBUSxDQUFDd1MsR0FBRCxFQUFNelQsSUFBTixDQUFSO0FBQ0QsR0FORDtBQU9EOztBQUVNLFNBQVNrUyxNQUFULENBQWdCOFEsTUFBaEIsRUFBd0I5ZCxPQUF4QixFQUFpQztBQUNwQyxRQUFNb2QsUUFBUSxHQUFHbGtCLE1BQU0sQ0FBQ21rQixTQUFQLENBQWlCdUIsZUFBakIsQ0FBakI7QUFDQSxTQUFPeEIsUUFBUSxDQUFDVSxNQUFELEVBQVM5ZCxPQUFULENBQWY7QUFDSDs7QUFFRCxTQUFTNGUsZUFBVCxDQUF5QmQsTUFBekIsRUFBaUM5ZCxPQUFqQyxFQUEwQ2pFLFFBQTFDLEVBQW9EO0FBQ2hELFFBQU13USxXQUFXLEdBQUd2TSxPQUFwQjtBQUNBOGQsUUFBTSxDQUFDRyxHQUFQLENBQVcsZUFBWCxFQUE0QjFSLFdBQTVCLEVBQXlDLE1BQXpDLEVBQWlELFVBQVNnQyxHQUFULEVBQWN6VCxJQUFkLEVBQW9CO0FBQ2pFaUIsWUFBUSxDQUFDd1MsR0FBRCxFQUFNelQsSUFBTixDQUFSO0FBQ0gsR0FGRDtBQUdIOztBQUVNLFNBQVNtUyxPQUFULENBQWlCNlEsTUFBakIsRUFBeUJyakIsSUFBekIsRUFBK0JzRixLQUEvQixFQUFzQ0MsT0FBdEMsRUFBK0M7QUFDbEQsUUFBTW9kLFFBQVEsR0FBR2xrQixNQUFNLENBQUNta0IsU0FBUCxDQUFpQndCLGdCQUFqQixDQUFqQjtBQUNBLFNBQU96QixRQUFRLENBQUNVLE1BQUQsRUFBU3JqQixJQUFULEVBQWVzRixLQUFmLEVBQXNCQyxPQUF0QixDQUFmO0FBQ0g7O0FBRUQsU0FBUzZlLGdCQUFULENBQTBCZixNQUExQixFQUFrQ3JqQixJQUFsQyxFQUF3Q3NGLEtBQXhDLEVBQStDQyxPQUEvQyxFQUF3RGpFLFFBQXhELEVBQWtFO0FBQzlELFFBQU0raUIsT0FBTyxHQUFHSCxPQUFPLENBQUNsa0IsSUFBRCxDQUF2QjtBQUNBLFFBQU1za0IsUUFBUSxHQUFHaGYsS0FBakI7QUFDQSxRQUFNd00sV0FBVyxHQUFHdk0sT0FBcEI7O0FBQ0EsTUFBRyxDQUFDQSxPQUFKLEVBQWE7QUFDVDhkLFVBQU0sQ0FBQ0csR0FBUCxDQUFXLFVBQVgsRUFBdUJhLE9BQXZCLEVBQWdDQyxRQUFoQyxFQUEwQyxVQUFVeFEsR0FBVixFQUFlelQsSUFBZixFQUFxQjtBQUMzRGlCLGNBQVEsQ0FBQ3dTLEdBQUQsRUFBTXpULElBQU4sQ0FBUjtBQUNILEtBRkQ7QUFHSCxHQUpELE1BSUs7QUFDRGdqQixVQUFNLENBQUNHLEdBQVAsQ0FBVyxVQUFYLEVBQXVCYSxPQUF2QixFQUFnQ0MsUUFBaEMsRUFBMEN4UyxXQUExQyxFQUF1RCxVQUFTZ0MsR0FBVCxFQUFjelQsSUFBZCxFQUFvQjtBQUN2RWlCLGNBQVEsQ0FBQ3dTLEdBQUQsRUFBTXpULElBQU4sQ0FBUjtBQUNILEtBRkQ7QUFHSDtBQUNKOztBQUVNLFNBQVMrTSxjQUFULENBQXdCaVcsTUFBeEIsRUFBZ0NrQixLQUFoQyxFQUF1QztBQUMxQyxRQUFNNUIsUUFBUSxHQUFHbGtCLE1BQU0sQ0FBQ21rQixTQUFQLENBQWlCNEIsdUJBQWpCLENBQWpCO0FBQ0EsTUFBSUMsUUFBUSxHQUFHRixLQUFmO0FBQ0EsTUFBR0UsUUFBUSxLQUFLdmQsU0FBaEIsRUFBMkJ1ZCxRQUFRLEdBQUcsSUFBWDtBQUMzQixTQUFPOUIsUUFBUSxDQUFDVSxNQUFELEVBQVNvQixRQUFULENBQWY7QUFDSDs7QUFFRCxTQUFTRCx1QkFBVCxDQUFpQ25CLE1BQWpDLEVBQXlDa0IsS0FBekMsRUFBZ0RqakIsUUFBaEQsRUFBMEQ7QUFDdEQsTUFBSW1qQixRQUFRLEdBQUdGLEtBQWY7QUFDQSxNQUFHRSxRQUFRLEtBQUssSUFBaEIsRUFBc0JwQixNQUFNLENBQUNHLEdBQVAsQ0FBVyxnQkFBWCxFQUE2QixVQUFTMVAsR0FBVCxFQUFjelQsSUFBZCxFQUFvQjtBQUNuRWlCLFlBQVEsQ0FBQ3dTLEdBQUQsRUFBTXpULElBQU4sQ0FBUjtBQUNILEdBRnFCLEVBQXRCLEtBR0tnakIsTUFBTSxDQUFDRyxHQUFQLENBQVcsZ0JBQVgsRUFBNkJpQixRQUE3QixFQUF1QyxVQUFTM1EsR0FBVCxFQUFjelQsSUFBZCxFQUFvQjtBQUM1RGlCLFlBQVEsQ0FBQ3dTLEdBQUQsRUFBTXpULElBQU4sQ0FBUjtBQUNILEdBRkk7QUFHUjs7QUFFTSxTQUFTMlMsY0FBVCxDQUF3QnFRLE1BQXhCLEVBQWdDMVYsSUFBaEMsRUFBc0M7QUFDekMsUUFBTWdWLFFBQVEsR0FBR2xrQixNQUFNLENBQUNta0IsU0FBUCxDQUFpQjhCLHVCQUFqQixDQUFqQjtBQUNBLFNBQU8vQixRQUFRLENBQUNVLE1BQUQsRUFBUzFWLElBQVQsQ0FBZjtBQUNIOztBQUVELFNBQVMrVyx1QkFBVCxDQUFpQ3JCLE1BQWpDLEVBQXlDMVYsSUFBekMsRUFBK0NyTSxRQUEvQyxFQUF5RDtBQUNyRGlILFlBQVUsQ0FBQywwQkFBRCxFQUE0Qm9GLElBQTVCLENBQVY7QUFDQTBWLFFBQU0sQ0FBQ0csR0FBUCxDQUFXLGdCQUFYLEVBQTZCN1YsSUFBN0IsRUFBbUMsVUFBU21HLEdBQVQsRUFBY3pULElBQWQsRUFBb0I7QUFDbkQsUUFBR3lULEdBQUgsRUFBU3RMLFFBQVEsQ0FBQywwQkFBRCxFQUE0QnNMLEdBQTVCLENBQVI7QUFDVHhTLFlBQVEsQ0FBQ3dTLEdBQUQsRUFBTXpULElBQU4sQ0FBUjtBQUNILEdBSEQ7QUFJSDs7QUFFTSxTQUFTaU4saUJBQVQsQ0FBMkIrVixNQUEzQixFQUFtQzFWLElBQW5DLEVBQXlDO0FBQzVDLFFBQU1nVixRQUFRLEdBQUdsa0IsTUFBTSxDQUFDbWtCLFNBQVAsQ0FBaUIrQiwwQkFBakIsQ0FBakI7QUFDQSxTQUFPaEMsUUFBUSxDQUFDVSxNQUFELEVBQVMxVixJQUFULENBQWY7QUFDSDs7QUFFRCxTQUFTZ1gsMEJBQVQsQ0FBb0N0QixNQUFwQyxFQUE0QzFWLElBQTVDLEVBQWtEck0sUUFBbEQsRUFBNEQ7QUFDeERnUixlQUFhLENBQUMsNkJBQUQsRUFBK0IzRSxJQUEvQixDQUFiO0FBQ0EwVixRQUFNLENBQUNHLEdBQVAsQ0FBVyxtQkFBWCxFQUFnQzdWLElBQWhDLEVBQXNDLENBQXRDLEVBQXlDLFVBQVNtRyxHQUFULEVBQWN6VCxJQUFkLEVBQW9CO0FBQ3pELFFBQUd5VCxHQUFILEVBQVN0TCxRQUFRLENBQUMsNkJBQUQsRUFBK0JzTCxHQUEvQixDQUFSO0FBQ1R4UyxZQUFRLENBQUN3UyxHQUFELEVBQU16VCxJQUFOLENBQVI7QUFDSCxHQUhEO0FBSUg7O0FBRU0sU0FBU3NGLFVBQVQsQ0FBb0IwZCxNQUFwQixFQUE0QjtBQUMvQixRQUFNVixRQUFRLEdBQUdsa0IsTUFBTSxDQUFDbWtCLFNBQVAsQ0FBaUJnQyxtQkFBakIsQ0FBakI7QUFDQSxTQUFPakMsUUFBUSxDQUFDVSxNQUFELENBQWY7QUFDSDs7QUFFRCxTQUFTdUIsbUJBQVQsQ0FBNkJ2QixNQUE3QixFQUFxQy9oQixRQUFyQyxFQUErQztBQUMzQytoQixRQUFNLENBQUNHLEdBQVAsQ0FBVyxZQUFYLEVBQXlCLFVBQVMxUCxHQUFULEVBQWN6VCxJQUFkLEVBQW9CO0FBQ3pDLFFBQUd5VCxHQUFILEVBQVE7QUFBRXRMLGNBQVEsQ0FBQyxzQkFBRCxFQUF3QnNMLEdBQXhCLENBQVI7QUFBc0M7O0FBQ2hEeFMsWUFBUSxDQUFDd1MsR0FBRCxFQUFNelQsSUFBTixDQUFSO0FBQ0gsR0FIRDtBQUlIOztBQUVNLFNBQVMyZixPQUFULENBQWlCcUQsTUFBakIsRUFBeUI7QUFDNUIsUUFBTVYsUUFBUSxHQUFHbGtCLE1BQU0sQ0FBQ21rQixTQUFQLENBQWlCaUMsZ0JBQWpCLENBQWpCO0FBQ0EsU0FBT2xDLFFBQVEsQ0FBQ1UsTUFBRCxDQUFmO0FBQ0g7O0FBRUQsU0FBU3dCLGdCQUFULENBQTBCeEIsTUFBMUIsRUFBa0MvaEIsUUFBbEMsRUFBNEM7QUFDeEMraEIsUUFBTSxDQUFDRyxHQUFQLENBQVcsbUJBQVgsRUFBZ0MsVUFBUzFQLEdBQVQsRUFBY3pULElBQWQsRUFBb0I7QUFDaEQsUUFBR3lULEdBQUgsRUFBUTtBQUFFdEwsY0FBUSxDQUFDLG1CQUFELEVBQXFCc0wsR0FBckIsQ0FBUjtBQUFtQzs7QUFDN0N4UyxZQUFRLENBQUN3UyxHQUFELEVBQU16VCxJQUFOLENBQVI7QUFDSCxHQUhEO0FBSUg7O0FBRUQsU0FBUzZqQixPQUFULENBQWlCcmQsRUFBakIsRUFBcUI7QUFDakIsUUFBTWllLFVBQVUsR0FBRyxPQUFuQjtBQUNBLE1BQUlDLE9BQU8sR0FBR2xlLEVBQWQsQ0FGaUIsQ0FFQzs7QUFFbEIsTUFBR0EsRUFBRSxDQUFDd0gsVUFBSCxDQUFjeVcsVUFBZCxDQUFILEVBQThCQyxPQUFPLEdBQUdsZSxFQUFFLENBQUNvRyxTQUFILENBQWE2WCxVQUFVLENBQUNsYSxNQUF4QixDQUFWLENBSmIsQ0FJd0Q7O0FBQ3pFLE1BQUcsQ0FBQy9ELEVBQUUsQ0FBQ3dILFVBQUgsQ0FBYytVLFNBQWQsQ0FBSixFQUE4QjJCLE9BQU8sR0FBRzNCLFNBQVMsR0FBQ3ZjLEVBQXBCLENBTGIsQ0FLcUM7O0FBQ3hELFNBQU9rZSxPQUFQO0FBQ0QsQzs7Ozs7Ozs7Ozs7QUM5TERybUIsTUFBTSxDQUFDc0MsTUFBUCxDQUFjO0FBQUNpSCxZQUFVLEVBQUMsTUFBSUEsVUFBaEI7QUFBMkIrYyxnQkFBYyxFQUFDLE1BQUlBLGNBQTlDO0FBQTZEQyxhQUFXLEVBQUMsTUFBSUEsV0FBN0U7QUFBeUYvUixZQUFVLEVBQUMsTUFBSUE7QUFBeEcsQ0FBZDtBQUFtSSxJQUFJelUsTUFBSjtBQUFXQyxNQUFNLENBQUNDLElBQVAsQ0FBWSxlQUFaLEVBQTRCO0FBQUNGLFFBQU0sQ0FBQ0csQ0FBRCxFQUFHO0FBQUNILFVBQU0sR0FBQ0csQ0FBUDtBQUFTOztBQUFwQixDQUE1QixFQUFrRCxDQUFsRDtBQUFxRCxJQUFJc21CLElBQUo7QUFBU3htQixNQUFNLENBQUNDLElBQVAsQ0FBWSxhQUFaLEVBQTBCO0FBQUN1bUIsTUFBSSxDQUFDdG1CLENBQUQsRUFBRztBQUFDc21CLFFBQUksR0FBQ3RtQixDQUFMO0FBQU87O0FBQWhCLENBQTFCLEVBQTRDLENBQTVDOztBQUdyTSxTQUFTcUosVUFBVCxDQUFvQlcsR0FBcEIsRUFBeUJFLEtBQXpCLEVBQWdDO0FBQ3JDLFFBQU02WixRQUFRLEdBQUdsa0IsTUFBTSxDQUFDbWtCLFNBQVAsQ0FBaUJ1QyxJQUFqQixDQUFqQjtBQUNBLFNBQU94QyxRQUFRLENBQUMvWixHQUFELEVBQU1FLEtBQU4sQ0FBZjtBQUNEOztBQUVNLFNBQVNrYyxjQUFULENBQXdCcGMsR0FBeEIsRUFBNkJ2SSxJQUE3QixFQUFtQztBQUN0QyxRQUFNc2lCLFFBQVEsR0FBR2xrQixNQUFNLENBQUNta0IsU0FBUCxDQUFpQndDLFFBQWpCLENBQWpCO0FBQ0EsU0FBT3pDLFFBQVEsQ0FBQy9aLEdBQUQsRUFBTXZJLElBQU4sQ0FBZjtBQUNIOztBQUVNLFNBQVM0a0IsV0FBVCxDQUFxQnJjLEdBQXJCLEVBQTBCdkksSUFBMUIsRUFBZ0M7QUFDbkMsUUFBTXNpQixRQUFRLEdBQUdsa0IsTUFBTSxDQUFDbWtCLFNBQVAsQ0FBaUJ5QyxLQUFqQixDQUFqQjtBQUNBLFNBQU8xQyxRQUFRLENBQUMvWixHQUFELEVBQU12SSxJQUFOLENBQWY7QUFDSDs7QUFFTSxTQUFTNlMsVUFBVCxDQUFvQnRLLEdBQXBCLEVBQXlCdkksSUFBekIsRUFBK0I7QUFDbEMsUUFBTXNpQixRQUFRLEdBQUdsa0IsTUFBTSxDQUFDbWtCLFNBQVAsQ0FBaUIwQyxJQUFqQixDQUFqQjtBQUNBLFNBQU8zQyxRQUFRLENBQUMvWixHQUFELEVBQU12SSxJQUFOLENBQWY7QUFDSDs7QUFFRCxTQUFTOGtCLElBQVQsQ0FBY3ZjLEdBQWQsRUFBbUJFLEtBQW5CLEVBQTBCeEgsUUFBMUIsRUFBb0M7QUFDbEMsUUFBTWlrQixNQUFNLEdBQUczYyxHQUFmO0FBQ0EsUUFBTTRjLFFBQVEsR0FBRzFjLEtBQWpCO0FBQ0FvYyxNQUFJLENBQUM3RyxHQUFMLENBQVNrSCxNQUFULEVBQWlCO0FBQUN6YyxTQUFLLEVBQUUwYztBQUFSLEdBQWpCLEVBQW9DLFVBQVMxUixHQUFULEVBQWNoRyxHQUFkLEVBQW1CO0FBQ3JEeE0sWUFBUSxDQUFDd1MsR0FBRCxFQUFNaEcsR0FBTixDQUFSO0FBQ0QsR0FGRDtBQUdEOztBQUVELFNBQVNzWCxRQUFULENBQWtCeGMsR0FBbEIsRUFBdUJ2SSxJQUF2QixFQUE2QmlCLFFBQTdCLEVBQXVDO0FBQ25DLFFBQU1pa0IsTUFBTSxHQUFHM2MsR0FBZjtBQUNBLFFBQU0xQyxPQUFPLEdBQUc3RixJQUFoQjtBQUNBNmtCLE1BQUksQ0FBQzdHLEdBQUwsQ0FBU2tILE1BQVQsRUFBaUJyZixPQUFqQixFQUEwQixVQUFTNE4sR0FBVCxFQUFjaEcsR0FBZCxFQUFtQjtBQUN6Q3hNLFlBQVEsQ0FBQ3dTLEdBQUQsRUFBTWhHLEdBQU4sQ0FBUjtBQUNILEdBRkQ7QUFHSDs7QUFFRCxTQUFTdVgsS0FBVCxDQUFlemMsR0FBZixFQUFvQnZJLElBQXBCLEVBQTBCaUIsUUFBMUIsRUFBb0M7QUFDaEMsUUFBTWlrQixNQUFNLEdBQUczYyxHQUFmO0FBQ0EsUUFBTTFDLE9BQU8sR0FBSTdGLElBQWpCO0FBRUE2a0IsTUFBSSxDQUFDakcsSUFBTCxDQUFVc0csTUFBVixFQUFrQnJmLE9BQWxCLEVBQTJCLFVBQVM0TixHQUFULEVBQWNoRyxHQUFkLEVBQW1CO0FBQzFDeE0sWUFBUSxDQUFDd1MsR0FBRCxFQUFNaEcsR0FBTixDQUFSO0FBQ0gsR0FGRDtBQUdIOztBQUVELFNBQVN3WCxJQUFULENBQWMxYyxHQUFkLEVBQW1CK0ssVUFBbkIsRUFBK0JyUyxRQUEvQixFQUF5QztBQUNyQyxRQUFNaWtCLE1BQU0sR0FBRzNjLEdBQWY7QUFDQSxRQUFNMUMsT0FBTyxHQUFHO0FBQ1o3RixRQUFJLEVBQUVzVDtBQURNLEdBQWhCO0FBSUF1UixNQUFJLENBQUN4RixHQUFMLENBQVM2RixNQUFULEVBQWlCcmYsT0FBakIsRUFBMEIsVUFBUzROLEdBQVQsRUFBY2hHLEdBQWQsRUFBbUI7QUFDM0N4TSxZQUFRLENBQUN3UyxHQUFELEVBQU1oRyxHQUFOLENBQVI7QUFDRCxHQUZEO0FBR0gsQzs7Ozs7Ozs7Ozs7QUN6RERwUCxNQUFNLENBQUNDLElBQVAsQ0FBWSxnQkFBWjtBQUE4QkQsTUFBTSxDQUFDQyxJQUFQLENBQVksZUFBWjtBQUE2QkQsTUFBTSxDQUFDQyxJQUFQLENBQVksc0JBQVo7QUFBb0NELE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGdCQUFaO0FBQThCRCxNQUFNLENBQUNDLElBQVAsQ0FBWSxVQUFaO0FBQXdCRCxNQUFNLENBQUNDLElBQVAsQ0FBWSxnQkFBWixFOzs7Ozs7Ozs7OztBQ0FySkQsTUFBTSxDQUFDc0MsTUFBUCxDQUFjO0FBQUNxVyxVQUFRLEVBQUMsTUFBSUE7QUFBZCxDQUFkO0FBQXVDLElBQUk1WSxNQUFKO0FBQVdDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGVBQVosRUFBNEI7QUFBQ0YsUUFBTSxDQUFDRyxDQUFELEVBQUc7QUFBQ0gsVUFBTSxHQUFDRyxDQUFQO0FBQVM7O0FBQXBCLENBQTVCLEVBQWtELENBQWxEO0FBQXFELElBQUlzaUIsYUFBSixFQUFrQnhLLEdBQWxCO0FBQXNCaFksTUFBTSxDQUFDQyxJQUFQLENBQVksOEJBQVosRUFBMkM7QUFBQ3VpQixlQUFhLENBQUN0aUIsQ0FBRCxFQUFHO0FBQUNzaUIsaUJBQWEsR0FBQ3RpQixDQUFkO0FBQWdCLEdBQWxDOztBQUFtQzhYLEtBQUcsQ0FBQzlYLENBQUQsRUFBRztBQUFDOFgsT0FBRyxHQUFDOVgsQ0FBSjtBQUFNOztBQUFoRCxDQUEzQyxFQUE2RixDQUE3RjtBQUFnRyxJQUFJd1gsUUFBSjtBQUFhMVgsTUFBTSxDQUFDQyxJQUFQLENBQVksNkNBQVosRUFBMEQ7QUFBQ21CLFNBQU8sQ0FBQ2xCLENBQUQsRUFBRztBQUFDd1gsWUFBUSxHQUFDeFgsQ0FBVDtBQUFXOztBQUF2QixDQUExRCxFQUFtRixDQUFuRjtBQUFzRixJQUFJc2UsT0FBSjtBQUFZeGUsTUFBTSxDQUFDQyxJQUFQLENBQVksZ0RBQVosRUFBNkQ7QUFBQ3VlLFNBQU8sQ0FBQ3RlLENBQUQsRUFBRztBQUFDc2UsV0FBTyxHQUFDdGUsQ0FBUjtBQUFVOztBQUF0QixDQUE3RCxFQUFxRixDQUFyRjtBQUF3RixJQUFJK1gsY0FBSjtBQUFtQmpZLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLG1CQUFaLEVBQWdDO0FBQUNnWSxnQkFBYyxDQUFDL1gsQ0FBRCxFQUFHO0FBQUMrWCxrQkFBYyxHQUFDL1gsQ0FBZjtBQUFpQjs7QUFBcEMsQ0FBaEMsRUFBc0UsQ0FBdEU7QUFFaGIsTUFBTXlZLFFBQVEsR0FBRzZKLGFBQWEsQ0FBQyxRQUFELENBQTlCO0FBT1A3SixRQUFRLENBQUM4SixXQUFULENBQXFCLE1BQXJCLEVBQTZCLFVBQVV2VCxHQUFWLEVBQWV5VCxFQUFmLEVBQW1CO0FBQzlDLE1BQUk7QUFDRixVQUFNdGMsS0FBSyxHQUFHNkksR0FBRyxDQUFDdk4sSUFBbEI7QUFDQStWLFlBQVEsQ0FBQ3JSLEtBQUQsQ0FBUjtBQUNBNkksT0FBRyxDQUFDWSxJQUFKO0FBQ0QsR0FKRCxDQUlFLE9BQU1oSCxTQUFOLEVBQWlCO0FBQ2pCb0csT0FBRyxDQUFDMFQsSUFBSjtBQUNBLFVBQU0sSUFBSTdpQixNQUFNLENBQUM4QixLQUFYLENBQWlCLDBCQUFqQixFQUE2Q2lILFNBQTdDLENBQU47QUFDRCxHQVBELFNBT1U7QUFDUjZaLE1BQUU7QUFDSDtBQUNGLENBWEQ7QUFjQSxJQUFJM0ssR0FBSixDQUFRVyxRQUFSLEVBQWtCLFNBQWxCLEVBQTZCLEVBQTdCLEVBQ0ttSyxNQURMLENBQ1k7QUFBRUMsVUFBUSxFQUFFcEssUUFBUSxDQUFDcUssS0FBVCxDQUFlN1UsS0FBZixDQUFxQjhVLElBQXJCLENBQTBCLGlCQUExQjtBQUFaLENBRFosRUFFSzNLLElBRkwsQ0FFVTtBQUFDQyxlQUFhLEVBQUU7QUFBaEIsQ0FGVjtBQUlBLElBQUkySyxDQUFDLEdBQUd2SyxRQUFRLENBQUM4SixXQUFULENBQXFCLFNBQXJCLEVBQStCO0FBQUVVLGNBQVksRUFBRSxLQUFoQjtBQUF1QlQsYUFBVyxFQUFFLEtBQUc7QUFBdkMsQ0FBL0IsRUFBOEUsVUFBVXhULEdBQVYsRUFBZXlULEVBQWYsRUFBbUI7QUFDckcsUUFBTVMsT0FBTyxHQUFHLElBQUlsZ0IsSUFBSixFQUFoQjtBQUNBa2dCLFNBQU8sQ0FBQ0MsVUFBUixDQUFtQkQsT0FBTyxDQUFDRSxVQUFSLEtBQXVCLENBQTFDO0FBRUEsUUFBTUMsR0FBRyxHQUFHNUssUUFBUSxDQUFDalksSUFBVCxDQUFjO0FBQ2xCc0gsVUFBTSxFQUFFO0FBQUN3YixTQUFHLEVBQUV4TCxHQUFHLENBQUN5TDtBQUFWLEtBRFU7QUFFbEJDLFdBQU8sRUFBRTtBQUFDQyxTQUFHLEVBQUVQO0FBQU47QUFGUyxHQUFkLEVBR1I7QUFBQ3hpQixVQUFNLEVBQUU7QUFBRThDLFNBQUcsRUFBRTtBQUFQO0FBQVQsR0FIUSxDQUFaO0FBS0E4YSxTQUFPLENBQUMsbUNBQUQsRUFBcUMrRSxHQUFyQyxDQUFQO0FBQ0E1SyxVQUFRLENBQUNpTCxVQUFULENBQW9CTCxHQUFwQjs7QUFDQSxNQUFHQSxHQUFHLENBQUNyWCxNQUFKLEdBQWEsQ0FBaEIsRUFBa0I7QUFDZGdELE9BQUcsQ0FBQ1ksSUFBSixDQUFTLGdDQUFUO0FBQ0g7O0FBQ0Q2UyxJQUFFO0FBQ0wsQ0FmTyxDQUFSO0FBaUJBaEssUUFBUSxDQUFDalksSUFBVCxDQUFjO0FBQUVpRCxNQUFJLEVBQUUsU0FBUjtBQUFtQnFFLFFBQU0sRUFBRTtBQUEzQixDQUFkLEVBQ0s2YixPQURMLENBQ2E7QUFDTEMsT0FBSyxFQUFFLFlBQVk7QUFBRVosS0FBQyxDQUFDYSxPQUFGO0FBQWM7QUFEOUIsQ0FEYixFOzs7Ozs7Ozs7OztBQzVDQS9qQixNQUFNLENBQUNDLElBQVAsQ0FBWSx5QkFBWjtBQUF1Q0QsTUFBTSxDQUFDQyxJQUFQLENBQVksZ0JBQVosRSIsImZpbGUiOiIvYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgeyBSb2xlcyB9IGZyb20gJ21ldGVvci9hbGFubmluZzpyb2xlcyc7XG5cbmltcG9ydCB7IE9wdElucyB9IGZyb20gJy4uL29wdC1pbnMuanMnO1xuXG5NZXRlb3IucHVibGlzaCgnb3B0LWlucy5hbGwnLCBmdW5jdGlvbiBPcHRJbnNBbGwoKSB7XG4gIGlmKCF0aGlzLnVzZXJJZCkge1xuICAgIHJldHVybiB0aGlzLnJlYWR5KCk7XG4gIH1cbiAgaWYoIVJvbGVzLnVzZXJJc0luUm9sZSh0aGlzLnVzZXJJZCwgWydhZG1pbiddKSl7XG4gICAgcmV0dXJuIE9wdElucy5maW5kKHtvd25lcklkOnRoaXMudXNlcklkfSwge1xuICAgICAgZmllbGRzOiBPcHRJbnMucHVibGljRmllbGRzLFxuICAgIH0pO1xuICB9XG4gIFxuXG4gIHJldHVybiBPcHRJbnMuZmluZCh7fSwge1xuICAgIGZpZWxkczogT3B0SW5zLnB1YmxpY0ZpZWxkcyxcbiAgfSk7XG59KTtcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IHsgRERQUmF0ZUxpbWl0ZXIgfSBmcm9tICdtZXRlb3IvZGRwLXJhdGUtbGltaXRlcic7XG5pbXBvcnQgeyBfaTE4biBhcyBpMThuIH0gZnJvbSAnbWV0ZW9yL3VuaXZlcnNlOmkxOG4nO1xuaW1wb3J0IHsgVmFsaWRhdGVkTWV0aG9kIH0gZnJvbSAnbWV0ZW9yL21kZzp2YWxpZGF0ZWQtbWV0aG9kJztcbmltcG9ydCB7IFJvbGVzIH0gZnJvbSAnbWV0ZW9yL2FsYW5uaW5nOnJvbGVzJztcbmltcG9ydCB7IF8gfSBmcm9tICdtZXRlb3IvdW5kZXJzY29yZSc7XG5pbXBvcnQgYWRkT3B0SW4gZnJvbSAnLi4vLi4vbW9kdWxlcy9zZXJ2ZXIvb3B0LWlucy9hZGRfYW5kX3dyaXRlX3RvX2Jsb2NrY2hhaW4uanMnO1xuXG5jb25zdCBhZGQgPSBuZXcgVmFsaWRhdGVkTWV0aG9kKHtcbiAgbmFtZTogJ29wdC1pbnMuYWRkJyxcbiAgdmFsaWRhdGU6IG51bGwsXG4gIHJ1bih7IHJlY2lwaWVudE1haWwsIHNlbmRlck1haWwsIGRhdGEgfSkge1xuICAgIGlmKCF0aGlzLnVzZXJJZCB8fCAhUm9sZXMudXNlcklzSW5Sb2xlKHRoaXMudXNlcklkLCBbJ2FkbWluJ10pKSB7XG4gICAgICBjb25zdCBlcnJvciA9IFwiYXBpLm9wdC1pbnMuYWRkLmFjY2Vzc0RlbmllZFwiO1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcihlcnJvciwgaTE4bi5fXyhlcnJvcikpO1xuICAgIH1cblxuICAgIGNvbnN0IG9wdEluID0ge1xuICAgICAgXCJyZWNpcGllbnRfbWFpbFwiOiByZWNpcGllbnRNYWlsLFxuICAgICAgXCJzZW5kZXJfbWFpbFwiOiBzZW5kZXJNYWlsLFxuICAgICAgZGF0YVxuICAgIH1cblxuICAgIGFkZE9wdEluKG9wdEluKVxuICB9LFxufSk7XG5cbi8vIEdldCBsaXN0IG9mIGFsbCBtZXRob2QgbmFtZXMgb24gb3B0LWluc1xuY29uc3QgT1BUSU9OU19NRVRIT0RTID0gXy5wbHVjayhbXG4gIGFkZFxuXSwgJ25hbWUnKTtcblxuaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAvLyBPbmx5IGFsbG93IDUgb3B0LWluIG9wZXJhdGlvbnMgcGVyIGNvbm5lY3Rpb24gcGVyIHNlY29uZFxuICBERFBSYXRlTGltaXRlci5hZGRSdWxlKHtcbiAgICBuYW1lKG5hbWUpIHtcbiAgICAgIHJldHVybiBfLmNvbnRhaW5zKE9QVElPTlNfTUVUSE9EUywgbmFtZSk7XG4gICAgfSxcblxuICAgIC8vIFJhdGUgbGltaXQgcGVyIGNvbm5lY3Rpb24gSURcbiAgICBjb25uZWN0aW9uSWQoKSB7IHJldHVybiB0cnVlOyB9LFxuICB9LCA1LCAxMDAwKTtcbn1cbiIsImltcG9ydCB7IE1vbmdvIH0gZnJvbSAnbWV0ZW9yL21vbmdvJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcblxuY2xhc3MgT3B0SW5zQ29sbGVjdGlvbiBleHRlbmRzIE1vbmdvLkNvbGxlY3Rpb24ge1xuICBpbnNlcnQob3B0SW4sIGNhbGxiYWNrKSB7XG4gICAgY29uc3Qgb3VyT3B0SW4gPSBvcHRJbjtcbiAgICBvdXJPcHRJbi5yZWNpcGllbnRfc2VuZGVyID0gb3VyT3B0SW4ucmVjaXBpZW50K291ck9wdEluLnNlbmRlcjtcbiAgICBvdXJPcHRJbi5jcmVhdGVkQXQgPSBvdXJPcHRJbi5jcmVhdGVkQXQgfHwgbmV3IERhdGUoKTtcbiAgICBjb25zdCByZXN1bHQgPSBzdXBlci5pbnNlcnQob3VyT3B0SW4sIGNhbGxiYWNrKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIHVwZGF0ZShzZWxlY3RvciwgbW9kaWZpZXIpIHtcbiAgICBjb25zdCByZXN1bHQgPSBzdXBlci51cGRhdGUoc2VsZWN0b3IsIG1vZGlmaWVyKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIHJlbW92ZShzZWxlY3Rvcikge1xuICAgIGNvbnN0IHJlc3VsdCA9IHN1cGVyLnJlbW92ZShzZWxlY3Rvcik7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgT3B0SW5zID0gbmV3IE9wdEluc0NvbGxlY3Rpb24oJ29wdC1pbnMnKTtcblxuLy8gRGVueSBhbGwgY2xpZW50LXNpZGUgdXBkYXRlcyBzaW5jZSB3ZSB3aWxsIGJlIHVzaW5nIG1ldGhvZHMgdG8gbWFuYWdlIHRoaXMgY29sbGVjdGlvblxuT3B0SW5zLmRlbnkoe1xuICBpbnNlcnQoKSB7IHJldHVybiB0cnVlOyB9LFxuICB1cGRhdGUoKSB7IHJldHVybiB0cnVlOyB9LFxuICByZW1vdmUoKSB7IHJldHVybiB0cnVlOyB9LFxufSk7XG5cbk9wdElucy5zY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgX2lkOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIHJlZ0V4OiBTaW1wbGVTY2hlbWEuUmVnRXguSWQsXG4gIH0sXG4gIHJlY2lwaWVudDoge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICBvcHRpb25hbDogdHJ1ZSxcbiAgICBkZW55VXBkYXRlOiB0cnVlLFxuICB9LFxuICBzZW5kZXI6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgb3B0aW9uYWw6IHRydWUsXG4gICAgZGVueVVwZGF0ZTogdHJ1ZSxcbiAgfSxcbiAgZGF0YToge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICBvcHRpb25hbDogdHJ1ZSxcbiAgICBkZW55VXBkYXRlOiBmYWxzZSxcbiAgfSxcbiAgaW5kZXg6IHtcbiAgICB0eXBlOiBTaW1wbGVTY2hlbWEuSW50ZWdlcixcbiAgICBvcHRpb25hbDogdHJ1ZSxcbiAgICBkZW55VXBkYXRlOiBmYWxzZSxcbiAgfSxcbiAgbmFtZUlkOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIG9wdGlvbmFsOiB0cnVlLFxuICAgIGRlbnlVcGRhdGU6IGZhbHNlLFxuICB9LFxuICB0eElkOiB7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICBvcHRpb25hbDogdHJ1ZSxcbiAgICAgIGRlbnlVcGRhdGU6IGZhbHNlLFxuICB9LFxuICBtYXN0ZXJEb2k6IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIG9wdGlvbmFsOiB0cnVlLFxuICAgICAgZGVueVVwZGF0ZTogZmFsc2UsXG4gIH0sXG4gIGNyZWF0ZWRBdDoge1xuICAgIHR5cGU6IERhdGUsXG4gICAgZGVueVVwZGF0ZTogdHJ1ZSxcbiAgfSxcbiAgY29uZmlybWVkQXQ6IHtcbiAgICB0eXBlOiBEYXRlLFxuICAgIG9wdGlvbmFsOiB0cnVlLFxuICAgIGRlbnlVcGRhdGU6IGZhbHNlLFxuICB9LFxuICBjb25maXJtZWRCeToge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICByZWdFeDogU2ltcGxlU2NoZW1hLlJlZ0V4LklQLFxuICAgIG9wdGlvbmFsOiB0cnVlLFxuICAgIGRlbnlVcGRhdGU6IGZhbHNlXG4gIH0sXG4gIGNvbmZpcm1hdGlvblRva2VuOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIG9wdGlvbmFsOiB0cnVlLFxuICAgIGRlbnlVcGRhdGU6IGZhbHNlXG4gIH0sXG4gIG93bmVySWQ6e1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICBvcHRpb25hbDogdHJ1ZSxcbiAgICByZWdFeDogU2ltcGxlU2NoZW1hLlJlZ0V4LklkXG4gIH0sXG4gIGVycm9yOntcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIG9wdGlvbmFsOiB0cnVlLFxuICAgICAgZGVueVVwZGF0ZTogZmFsc2VcbiAgfVxufSk7XG5cbk9wdElucy5hdHRhY2hTY2hlbWEoT3B0SW5zLnNjaGVtYSk7XG5cbi8vIFRoaXMgcmVwcmVzZW50cyB0aGUga2V5cyBmcm9tIE9wdC1JbiBvYmplY3RzIHRoYXQgc2hvdWxkIGJlIHB1Ymxpc2hlZFxuLy8gdG8gdGhlIGNsaWVudC4gSWYgd2UgYWRkIHNlY3JldCBwcm9wZXJ0aWVzIHRvIE9wdC1JbiBvYmplY3RzLCBkb24ndCBsaXN0XG4vLyB0aGVtIGhlcmUgdG8ga2VlcCB0aGVtIHByaXZhdGUgdG8gdGhlIHNlcnZlci5cbk9wdElucy5wdWJsaWNGaWVsZHMgPSB7XG4gIF9pZDogMSxcbiAgcmVjaXBpZW50OiAxLFxuICBzZW5kZXI6IDEsXG4gIGRhdGE6IDEsXG4gIGluZGV4OiAxLFxuICBuYW1lSWQ6IDEsXG4gIHR4SWQ6IDEsXG4gIG1hc3RlckRvaTogMSxcbiAgY3JlYXRlZEF0OiAxLFxuICBjb25maXJtZWRBdDogMSxcbiAgY29uZmlybWVkQnk6IDEsXG4gIG93bmVySWQ6IDEsXG4gIGVycm9yOiAxXG59O1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgeyBSb2xlcyB9IGZyb20gJ21ldGVvci9hbGFubmluZzpyb2xlcyc7XG5cbmltcG9ydCB7IFJlY2lwaWVudHMgfSBmcm9tICcuLi9yZWNpcGllbnRzLmpzJztcbmltcG9ydCB7IE9wdEluc30gZnJvbSAnLi4vLi4vb3B0LWlucy9vcHQtaW5zLmpzJ1xuTWV0ZW9yLnB1Ymxpc2goJ3JlY2lwaWVudHMuYnlPd25lcicsZnVuY3Rpb24gcmVjaXBpZW50R2V0KCl7XG4gIGxldCBwaXBlbGluZT1bXTtcbiAgaWYoIVJvbGVzLnVzZXJJc0luUm9sZSh0aGlzLnVzZXJJZCwgWydhZG1pbiddKSl7XG4gICAgcGlwZWxpbmUucHVzaChcbiAgICAgIHskcmVkYWN0OntcbiAgICAgICRjb25kOiB7XG4gICAgICAgIGlmOiB7ICRjbXA6IFsgXCIkb3duZXJJZFwiLCB0aGlzLnVzZXJJZCBdIH0sXG4gICAgICAgIHRoZW46IFwiJCRQUlVORVwiLFxuICAgICAgICBlbHNlOiBcIiQkS0VFUFwiIH19fSk7XG4gICAgICB9XG4gICAgICBwaXBlbGluZS5wdXNoKHsgJGxvb2t1cDogeyBmcm9tOiBcInJlY2lwaWVudHNcIiwgbG9jYWxGaWVsZDogXCJyZWNpcGllbnRcIiwgZm9yZWlnbkZpZWxkOiBcIl9pZFwiLCBhczogXCJSZWNpcGllbnRFbWFpbFwiIH0gfSk7XG4gICAgICBwaXBlbGluZS5wdXNoKHsgJHVud2luZDogXCIkUmVjaXBpZW50RW1haWxcIn0pO1xuICAgICAgcGlwZWxpbmUucHVzaCh7ICRwcm9qZWN0OiB7XCJSZWNpcGllbnRFbWFpbC5faWRcIjoxfX0pO1xuXG4gICAgICBjb25zdCByZXN1bHQgPSBPcHRJbnMuYWdncmVnYXRlKHBpcGVsaW5lKTtcbiAgICAgIGxldCBySWRzPVtdO1xuICAgICAgcmVzdWx0LmZvckVhY2goZWxlbWVudCA9PiB7XG4gICAgICAgIHJJZHMucHVzaChlbGVtZW50LlJlY2lwaWVudEVtYWlsLl9pZCk7XG4gICAgICB9KTtcbiAgcmV0dXJuIFJlY2lwaWVudHMuZmluZCh7XCJfaWRcIjp7XCIkaW5cIjpySWRzfX0se2ZpZWxkczpSZWNpcGllbnRzLnB1YmxpY0ZpZWxkc30pO1xufSk7XG5NZXRlb3IucHVibGlzaCgncmVjaXBpZW50cy5hbGwnLCBmdW5jdGlvbiByZWNpcGllbnRzQWxsKCkge1xuICBpZighdGhpcy51c2VySWQgfHwgIVJvbGVzLnVzZXJJc0luUm9sZSh0aGlzLnVzZXJJZCwgWydhZG1pbiddKSkge1xuICAgIHJldHVybiB0aGlzLnJlYWR5KCk7XG4gIH1cblxuICByZXR1cm4gUmVjaXBpZW50cy5maW5kKHt9LCB7XG4gICAgZmllbGRzOiBSZWNpcGllbnRzLnB1YmxpY0ZpZWxkcyxcbiAgfSk7XG59KTtcbiIsImltcG9ydCB7IE1vbmdvIH0gZnJvbSAnbWV0ZW9yL21vbmdvJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcblxuY2xhc3MgUmVjaXBpZW50c0NvbGxlY3Rpb24gZXh0ZW5kcyBNb25nby5Db2xsZWN0aW9uIHtcbiAgaW5zZXJ0KHJlY2lwaWVudCwgY2FsbGJhY2spIHtcbiAgICBjb25zdCBvdXJSZWNpcGllbnQgPSByZWNpcGllbnQ7XG4gICAgb3VyUmVjaXBpZW50LmNyZWF0ZWRBdCA9IG91clJlY2lwaWVudC5jcmVhdGVkQXQgfHwgbmV3IERhdGUoKTtcbiAgICBjb25zdCByZXN1bHQgPSBzdXBlci5pbnNlcnQob3VyUmVjaXBpZW50LCBjYWxsYmFjayk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICB1cGRhdGUoc2VsZWN0b3IsIG1vZGlmaWVyKSB7XG4gICAgY29uc3QgcmVzdWx0ID0gc3VwZXIudXBkYXRlKHNlbGVjdG9yLCBtb2RpZmllcik7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICByZW1vdmUoc2VsZWN0b3IpIHtcbiAgICBjb25zdCByZXN1bHQgPSBzdXBlci5yZW1vdmUoc2VsZWN0b3IpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IFJlY2lwaWVudHMgPSBuZXcgUmVjaXBpZW50c0NvbGxlY3Rpb24oJ3JlY2lwaWVudHMnKTtcblxuLy8gRGVueSBhbGwgY2xpZW50LXNpZGUgdXBkYXRlcyBzaW5jZSB3ZSB3aWxsIGJlIHVzaW5nIG1ldGhvZHMgdG8gbWFuYWdlIHRoaXMgY29sbGVjdGlvblxuUmVjaXBpZW50cy5kZW55KHtcbiAgaW5zZXJ0KCkgeyByZXR1cm4gdHJ1ZTsgfSxcbiAgdXBkYXRlKCkgeyByZXR1cm4gdHJ1ZTsgfSxcbiAgcmVtb3ZlKCkgeyByZXR1cm4gdHJ1ZTsgfSxcbn0pO1xuXG5SZWNpcGllbnRzLnNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICBfaWQ6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgcmVnRXg6IFNpbXBsZVNjaGVtYS5SZWdFeC5JZCxcbiAgfSxcbiAgZW1haWw6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgaW5kZXg6IHRydWUsXG4gICAgZGVueVVwZGF0ZTogdHJ1ZSxcbiAgfSxcbiAgcHJpdmF0ZUtleToge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICB1bmlxdWU6IHRydWUsXG4gICAgZGVueVVwZGF0ZTogdHJ1ZSxcbiAgfSxcbiAgcHVibGljS2V5OiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIHVuaXF1ZTogdHJ1ZSxcbiAgICBkZW55VXBkYXRlOiB0cnVlLFxuICB9LFxuICBjcmVhdGVkQXQ6IHtcbiAgICB0eXBlOiBEYXRlLFxuICAgIGRlbnlVcGRhdGU6IHRydWUsXG4gIH1cbn0pO1xuXG5SZWNpcGllbnRzLmF0dGFjaFNjaGVtYShSZWNpcGllbnRzLnNjaGVtYSk7XG5cbi8vIFRoaXMgcmVwcmVzZW50cyB0aGUga2V5cyBmcm9tIFJlY2lwaWVudCBvYmplY3RzIHRoYXQgc2hvdWxkIGJlIHB1Ymxpc2hlZFxuLy8gdG8gdGhlIGNsaWVudC4gSWYgd2UgYWRkIHNlY3JldCBwcm9wZXJ0aWVzIHRvIFJlY2lwaWVudCBvYmplY3RzLCBkb24ndCBsaXN0XG4vLyB0aGVtIGhlcmUgdG8ga2VlcCB0aGVtIHByaXZhdGUgdG8gdGhlIHNlcnZlci5cblJlY2lwaWVudHMucHVibGljRmllbGRzID0ge1xuICBfaWQ6IDEsXG4gIGVtYWlsOiAxLFxuICBwdWJsaWNLZXk6IDEsXG4gIGNyZWF0ZWRBdDogMVxufTtcbiIsImltcG9ydCB7IE1vbmdvIH0gZnJvbSAnbWV0ZW9yL21vbmdvJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcblxuY2xhc3MgRG9pY2hhaW5FbnRyaWVzQ29sbGVjdGlvbiBleHRlbmRzIE1vbmdvLkNvbGxlY3Rpb24ge1xuICBpbnNlcnQoZW50cnksIGNhbGxiYWNrKSB7XG4gICAgY29uc3QgcmVzdWx0ID0gc3VwZXIuaW5zZXJ0KGVudHJ5LCBjYWxsYmFjayk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICB1cGRhdGUoc2VsZWN0b3IsIG1vZGlmaWVyKSB7XG4gICAgY29uc3QgcmVzdWx0ID0gc3VwZXIudXBkYXRlKHNlbGVjdG9yLCBtb2RpZmllcik7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICByZW1vdmUoc2VsZWN0b3IpIHtcbiAgICBjb25zdCByZXN1bHQgPSBzdXBlci5yZW1vdmUoc2VsZWN0b3IpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IERvaWNoYWluRW50cmllcyA9IG5ldyBEb2ljaGFpbkVudHJpZXNDb2xsZWN0aW9uKCdkb2ljaGFpbi1lbnRyaWVzJyk7XG5cbi8vIERlbnkgYWxsIGNsaWVudC1zaWRlIHVwZGF0ZXMgc2luY2Ugd2Ugd2lsbCBiZSB1c2luZyBtZXRob2RzIHRvIG1hbmFnZSB0aGlzIGNvbGxlY3Rpb25cbkRvaWNoYWluRW50cmllcy5kZW55KHtcbiAgaW5zZXJ0KCkgeyByZXR1cm4gdHJ1ZTsgfSxcbiAgdXBkYXRlKCkgeyByZXR1cm4gdHJ1ZTsgfSxcbiAgcmVtb3ZlKCkgeyByZXR1cm4gdHJ1ZTsgfSxcbn0pO1xuXG5Eb2ljaGFpbkVudHJpZXMuc2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIF9pZDoge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICByZWdFeDogU2ltcGxlU2NoZW1hLlJlZ0V4LklkLFxuICB9LFxuICBuYW1lOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIGluZGV4OiB0cnVlLFxuICAgIGRlbnlVcGRhdGU6IHRydWVcbiAgfSxcbiAgdmFsdWU6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgZGVueVVwZGF0ZTogZmFsc2VcbiAgfSxcbiAgYWRkcmVzczoge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICBkZW55VXBkYXRlOiBmYWxzZVxuICB9LFxuICBtYXN0ZXJEb2k6IHtcbiAgICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgICBvcHRpb25hbDogdHJ1ZSxcbiAgICAgICAgaW5kZXg6IHRydWUsXG4gICAgICAgIGRlbnlVcGRhdGU6IHRydWVcbiAgfSxcbiAgaW5kZXg6IHtcbiAgICAgICAgdHlwZTogU2ltcGxlU2NoZW1hLkludGVnZXIsXG4gICAgICAgIG9wdGlvbmFsOiB0cnVlLFxuICAgICAgICBkZW55VXBkYXRlOiB0cnVlXG4gIH0sXG4gIHR4SWQ6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgZGVueVVwZGF0ZTogZmFsc2VcbiAgfVxufSk7XG5cbkRvaWNoYWluRW50cmllcy5hdHRhY2hTY2hlbWEoRG9pY2hhaW5FbnRyaWVzLnNjaGVtYSk7XG5cbi8vIFRoaXMgcmVwcmVzZW50cyB0aGUga2V5cyBmcm9tIEVudHJ5IG9iamVjdHMgdGhhdCBzaG91bGQgYmUgcHVibGlzaGVkXG4vLyB0byB0aGUgY2xpZW50LiBJZiB3ZSBhZGQgc2VjcmV0IHByb3BlcnRpZXMgdG8gRW50cnkgb2JqZWN0cywgZG9uJ3QgbGlzdFxuLy8gdGhlbSBoZXJlIHRvIGtlZXAgdGhlbSBwcml2YXRlIHRvIHRoZSBzZXJ2ZXIuXG5Eb2ljaGFpbkVudHJpZXMucHVibGljRmllbGRzID0ge1xuICBfaWQ6IDEsXG4gIG5hbWU6IDEsXG4gIHZhbHVlOiAxLFxuICBhZGRyZXNzOiAxLFxuICBtYXN0ZXJEb2k6IDEsXG4gIGluZGV4OiAxLFxuICB0eElkOiAxXG59O1xuIiwiaW1wb3J0IHsgVmFsaWRhdGVkTWV0aG9kIH0gZnJvbSAnbWV0ZW9yL21kZzp2YWxpZGF0ZWQtbWV0aG9kJztcbmltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IHsgRERQUmF0ZUxpbWl0ZXIgfSBmcm9tICdtZXRlb3IvZGRwLXJhdGUtbGltaXRlcic7XG5pbXBvcnQgZ2V0S2V5UGFpck0gZnJvbSAnLi4vLi4vbW9kdWxlcy9zZXJ2ZXIvZG9pY2hhaW4vZ2V0X2tleS1wYWlyLmpzJztcbmltcG9ydCBnZXRCYWxhbmNlTSBmcm9tICcuLi8uLi9tb2R1bGVzL3NlcnZlci9kb2ljaGFpbi9nZXRfYmFsYW5jZS5qcyc7XG5cblxuY29uc3QgZ2V0S2V5UGFpciA9IG5ldyBWYWxpZGF0ZWRNZXRob2Qoe1xuICBuYW1lOiAnZG9pY2hhaW4uZ2V0S2V5UGFpcicsXG4gIHZhbGlkYXRlOiBudWxsLFxuICBydW4oKSB7XG4gICAgcmV0dXJuIGdldEtleVBhaXJNKCk7XG4gIH0sXG59KTtcblxuY29uc3QgZ2V0QmFsYW5jZSA9IG5ldyBWYWxpZGF0ZWRNZXRob2Qoe1xuICBuYW1lOiAnZG9pY2hhaW4uZ2V0QmFsYW5jZScsXG4gIHZhbGlkYXRlOiBudWxsLFxuICBydW4oKSB7XG4gICAgY29uc3QgbG9nVmFsID0gZ2V0QmFsYW5jZU0oKTtcbiAgICByZXR1cm4gbG9nVmFsO1xuICB9LFxufSk7XG5cblxuLy8gR2V0IGxpc3Qgb2YgYWxsIG1ldGhvZCBuYW1lcyBvbiBkb2ljaGFpblxuY29uc3QgT1BUSU5TX01FVEhPRFMgPSBfLnBsdWNrKFtcbiAgZ2V0S2V5UGFpclxuLGdldEJhbGFuY2VdLCAnbmFtZScpO1xuXG5pZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIC8vIE9ubHkgYWxsb3cgNSBvcHQtaW4gb3BlcmF0aW9ucyBwZXIgY29ubmVjdGlvbiBwZXIgc2Vjb25kXG4gIEREUFJhdGVMaW1pdGVyLmFkZFJ1bGUoe1xuICAgIG5hbWUobmFtZSkge1xuICAgICAgcmV0dXJuIF8uY29udGFpbnMoT1BUSU5TX01FVEhPRFMsIG5hbWUpO1xuICAgIH0sXG5cbiAgICAvLyBSYXRlIGxpbWl0IHBlciBjb25uZWN0aW9uIElEXG4gICAgY29ubmVjdGlvbklkKCkgeyByZXR1cm4gdHJ1ZTsgfSxcbiAgfSwgNSwgMTAwMCk7XG59XG4iLCJpbXBvcnQgeyBNZXRlb3J9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IHsgRERQUmF0ZUxpbWl0ZXIgfSBmcm9tICdtZXRlb3IvZGRwLXJhdGUtbGltaXRlcic7XG5pbXBvcnQgeyBWYWxpZGF0ZWRNZXRob2QgfSBmcm9tICdtZXRlb3IvbWRnOnZhbGlkYXRlZC1tZXRob2QnO1xuaW1wb3J0IGdldExhbmd1YWdlcyBmcm9tICcuLi8uLi9tb2R1bGVzL3NlcnZlci9sYW5ndWFnZXMvZ2V0LmpzJztcblxuY29uc3QgZ2V0QWxsTGFuZ3VhZ2VzID0gbmV3IFZhbGlkYXRlZE1ldGhvZCh7XG4gIG5hbWU6ICdsYW5ndWFnZXMuZ2V0QWxsJyxcbiAgdmFsaWRhdGU6IG51bGwsXG4gIHJ1bigpIHtcbiAgICByZXR1cm4gZ2V0TGFuZ3VhZ2VzKCk7XG4gIH0sXG59KTtcblxuLy8gR2V0IGxpc3Qgb2YgYWxsIG1ldGhvZCBuYW1lcyBvbiBsYW5ndWFnZXNcbmNvbnN0IE9QVElOU19NRVRIT0RTID0gXy5wbHVjayhbXG4gIGdldEFsbExhbmd1YWdlc1xuXSwgJ25hbWUnKTtcblxuaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAvLyBPbmx5IGFsbG93IDUgb3B0LWluIG9wZXJhdGlvbnMgcGVyIGNvbm5lY3Rpb24gcGVyIHNlY29uZFxuICBERFBSYXRlTGltaXRlci5hZGRSdWxlKHtcbiAgICBuYW1lKG5hbWUpIHtcbiAgICAgIHJldHVybiBfLmNvbnRhaW5zKE9QVElOU19NRVRIT0RTLCBuYW1lKTtcbiAgICB9LFxuXG4gICAgLy8gUmF0ZSBsaW1pdCBwZXIgY29ubmVjdGlvbiBJRFxuICAgIGNvbm5lY3Rpb25JZCgpIHsgcmV0dXJuIHRydWU7IH0sXG4gIH0sIDUsIDEwMDApO1xufVxuIiwiaW1wb3J0IHsgTW9uZ28gfSBmcm9tICdtZXRlb3IvbW9uZ28nO1xuaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tICdzaW1wbC1zY2hlbWEnO1xuXG5jbGFzcyBNZXRhQ29sbGVjdGlvbiBleHRlbmRzIE1vbmdvLkNvbGxlY3Rpb24ge1xuICBpbnNlcnQoZGF0YSwgY2FsbGJhY2spIHtcbiAgICBjb25zdCBvdXJEYXRhID0gZGF0YTtcbiAgICBjb25zdCByZXN1bHQgPSBzdXBlci5pbnNlcnQob3VyRGF0YSwgY2FsbGJhY2spO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgdXBkYXRlKHNlbGVjdG9yLCBtb2RpZmllcikge1xuICAgIGNvbnN0IHJlc3VsdCA9IHN1cGVyLnVwZGF0ZShzZWxlY3RvciwgbW9kaWZpZXIpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgcmVtb3ZlKHNlbGVjdG9yKSB7XG4gICAgY29uc3QgcmVzdWx0ID0gc3VwZXIucmVtb3ZlKHNlbGVjdG9yKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG5cbmV4cG9ydCBjb25zdCBNZXRhID0gbmV3IE1ldGFDb2xsZWN0aW9uKCdtZXRhJyk7XG5cbi8vIERlbnkgYWxsIGNsaWVudC1zaWRlIHVwZGF0ZXMgc2luY2Ugd2Ugd2lsbCBiZSB1c2luZyBtZXRob2RzIHRvIG1hbmFnZSB0aGlzIGNvbGxlY3Rpb25cbk1ldGEuZGVueSh7XG4gIGluc2VydCgpIHsgcmV0dXJuIHRydWU7IH0sXG4gIHVwZGF0ZSgpIHsgcmV0dXJuIHRydWU7IH0sXG4gIHJlbW92ZSgpIHsgcmV0dXJuIHRydWU7IH0sXG59KTtcblxuTWV0YS5zY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgX2lkOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIHJlZ0V4OiBTaW1wbGVTY2hlbWEuUmVnRXguSWQsXG4gIH0sXG4gIGtleToge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICBpbmRleDogdHJ1ZSxcbiAgICBkZW55VXBkYXRlOiB0cnVlXG4gIH0sXG4gIHZhbHVlOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH1cbn0pO1xuXG5NZXRhLmF0dGFjaFNjaGVtYShNZXRhLnNjaGVtYSk7XG5cbi8vIFRoaXMgcmVwcmVzZW50cyB0aGUga2V5cyBmcm9tIE1ldGEgb2JqZWN0cyB0aGF0IHNob3VsZCBiZSBwdWJsaXNoZWRcbi8vIHRvIHRoZSBjbGllbnQuIElmIHdlIGFkZCBzZWNyZXQgcHJvcGVydGllcyB0byBNZXRhIG9iamVjdHMsIGRvbid0IGxpc3Rcbi8vIHRoZW0gaGVyZSB0byBrZWVwIHRoZW0gcHJpdmF0ZSB0byB0aGUgc2VydmVyLlxuTWV0YS5wdWJsaWNGaWVsZHMgPSB7XG59O1xuIiwiaW1wb3J0IHsgTW9uZ28gfSBmcm9tICdtZXRlb3IvbW9uZ28nO1xuaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tICdzaW1wbC1zY2hlbWEnO1xuXG5jbGFzcyBTZW5kZXJzQ29sbGVjdGlvbiBleHRlbmRzIE1vbmdvLkNvbGxlY3Rpb24ge1xuICBpbnNlcnQoc2VuZGVyLCBjYWxsYmFjaykge1xuICAgIGNvbnN0IG91clNlbmRlciA9IHNlbmRlcjtcbiAgICBvdXJTZW5kZXIuY3JlYXRlZEF0ID0gb3VyU2VuZGVyLmNyZWF0ZWRBdCB8fCBuZXcgRGF0ZSgpO1xuICAgIGNvbnN0IHJlc3VsdCA9IHN1cGVyLmluc2VydChvdXJTZW5kZXIsIGNhbGxiYWNrKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIHVwZGF0ZShzZWxlY3RvciwgbW9kaWZpZXIpIHtcbiAgICBjb25zdCByZXN1bHQgPSBzdXBlci51cGRhdGUoc2VsZWN0b3IsIG1vZGlmaWVyKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIHJlbW92ZShzZWxlY3Rvcikge1xuICAgIGNvbnN0IHJlc3VsdCA9IHN1cGVyLnJlbW92ZShzZWxlY3Rvcik7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgU2VuZGVycyA9IG5ldyBTZW5kZXJzQ29sbGVjdGlvbignc2VuZGVycycpO1xuXG4vLyBEZW55IGFsbCBjbGllbnQtc2lkZSB1cGRhdGVzIHNpbmNlIHdlIHdpbGwgYmUgdXNpbmcgbWV0aG9kcyB0byBtYW5hZ2UgdGhpcyBjb2xsZWN0aW9uXG5TZW5kZXJzLmRlbnkoe1xuICBpbnNlcnQoKSB7IHJldHVybiB0cnVlOyB9LFxuICB1cGRhdGUoKSB7IHJldHVybiB0cnVlOyB9LFxuICByZW1vdmUoKSB7IHJldHVybiB0cnVlOyB9LFxufSk7XG5cblNlbmRlcnMuc2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIF9pZDoge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICByZWdFeDogU2ltcGxlU2NoZW1hLlJlZ0V4LklkLFxuICB9LFxuICBlbWFpbDoge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICBpbmRleDogdHJ1ZSxcbiAgICBkZW55VXBkYXRlOiB0cnVlLFxuICB9LFxuICBjcmVhdGVkQXQ6IHtcbiAgICB0eXBlOiBEYXRlLFxuICAgIGRlbnlVcGRhdGU6IHRydWUsXG4gIH1cbn0pO1xuXG5TZW5kZXJzLmF0dGFjaFNjaGVtYShTZW5kZXJzLnNjaGVtYSk7XG5cbi8vIFRoaXMgcmVwcmVzZW50cyB0aGUga2V5cyBmcm9tIFNlbmRlciBvYmplY3RzIHRoYXQgc2hvdWxkIGJlIHB1Ymxpc2hlZFxuLy8gdG8gdGhlIGNsaWVudC4gSWYgd2UgYWRkIHNlY3JldCBwcm9wZXJ0aWVzIHRvIFNlbmRlciBvYmplY3RzLCBkb24ndCBsaXN0XG4vLyB0aGVtIGhlcmUgdG8ga2VlcCB0aGVtIHByaXZhdGUgdG8gdGhlIHNlcnZlci5cblNlbmRlcnMucHVibGljRmllbGRzID0ge1xuICBlbWFpbDogMSxcbiAgY3JlYXRlZEF0OiAxXG59O1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XG5pbXBvcnQgeyBET0lfTUFJTF9GRVRDSF9VUkwgfSBmcm9tICcuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9lbWFpbC1jb25maWd1cmF0aW9uLmpzJztcbmltcG9ydCB7bG9nU2VuZH0gZnJvbSBcIi4uLy4uLy4uL3N0YXJ0dXAvc2VydmVyL2xvZy1jb25maWd1cmF0aW9uXCI7XG5pbXBvcnQge09wdEluc30gZnJvbSBcIi4uLy4uLy4uL2FwaS9vcHQtaW5zL29wdC1pbnNcIjtcblxuY29uc3QgRXhwb3J0RG9pc0RhdGFTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgc3RhdHVzOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIG9wdGlvbmFsOiB0cnVlLFxuICB9LFxuICByb2xlOntcbiAgICB0eXBlOlN0cmluZ1xuICB9LFxuICB1c2VyaWQ6e1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICByZWdFeDogU2ltcGxlU2NoZW1hLlJlZ0V4LmlkLFxuICAgIG9wdGlvbmFsOnRydWUgXG4gIH1cbn0pO1xuXG4vL1RPRE8gYWRkIHNlbmRlciBhbmQgcmVjaXBpZW50IGVtYWlsIGFkZHJlc3MgdG8gZXhwb3J0XG5cbmNvbnN0IGV4cG9ydERvaXMgPSAoZGF0YSkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IG91ckRhdGEgPSBkYXRhO1xuICAgIEV4cG9ydERvaXNEYXRhU2NoZW1hLnZhbGlkYXRlKG91ckRhdGEpO1xuICAgIGxldCBwaXBlbGluZT1beyAkbWF0Y2g6IHtcImNvbmZpcm1lZEF0XCI6eyAkZXhpc3RzOiB0cnVlLCAkbmU6IG51bGwgfX0gfV07XG4gICAgXG4gICAgaWYob3VyRGF0YS5yb2xlIT0nYWRtaW4nfHxvdXJEYXRhLnVzZXJpZCE9dW5kZWZpbmVkKXtcbiAgICAgIHBpcGVsaW5lLnB1c2goeyAkcmVkYWN0OntcbiAgICAgICAgJGNvbmQ6IHtcbiAgICAgICAgICBpZjogeyAkY21wOiBbIFwiJG93bmVySWRcIiwgb3VyRGF0YS51c2VyaWQgXSB9LFxuICAgICAgICAgIHRoZW46IFwiJCRQUlVORVwiLFxuICAgICAgICAgIGVsc2U6IFwiJCRLRUVQXCIgfX19KTtcbiAgICB9XG4gICAgcGlwZWxpbmUuY29uY2F0KFtcbiAgICAgICAgeyAkbG9va3VwOiB7IGZyb206IFwicmVjaXBpZW50c1wiLCBsb2NhbEZpZWxkOiBcInJlY2lwaWVudFwiLCBmb3JlaWduRmllbGQ6IFwiX2lkXCIsIGFzOiBcIlJlY2lwaWVudEVtYWlsXCIgfSB9LFxuICAgICAgICB7ICRsb29rdXA6IHsgZnJvbTogXCJzZW5kZXJzXCIsIGxvY2FsRmllbGQ6IFwic2VuZGVyXCIsIGZvcmVpZ25GaWVsZDogXCJfaWRcIiwgYXM6IFwiU2VuZGVyRW1haWxcIiB9IH0sXG4gICAgICAgIHsgJHVud2luZDogXCIkU2VuZGVyRW1haWxcIn0sXG4gICAgICAgIHsgJHVud2luZDogXCIkUmVjaXBpZW50RW1haWxcIn0sXG4gICAgICAgIHsgJHByb2plY3Q6IHtcIl9pZFwiOjEsXCJjcmVhdGVkQXRcIjoxLCBcImNvbmZpcm1lZEF0XCI6MSxcIm5hbWVJZFwiOjEsIFwiU2VuZGVyRW1haWwuZW1haWxcIjoxLFwiUmVjaXBpZW50RW1haWwuZW1haWxcIjoxfX1cbiAgICBdKTtcbiAgICAvL2lmKG91ckRhdGEuc3RhdHVzPT0xKSBxdWVyeSA9IHtcImNvbmZpcm1lZEF0XCI6IHsgJGV4aXN0czogdHJ1ZSwgJG5lOiBudWxsIH19XG5cbiAgICBsZXQgb3B0SW5zID0gIE9wdElucy5hZ2dyZWdhdGUocGlwZWxpbmUpO1xuICAgIGxldCBleHBvcnREb2lEYXRhO1xuICAgIHRyeSB7XG4gICAgICAgIGV4cG9ydERvaURhdGEgPSBvcHRJbnM7XG4gICAgICAgIGxvZ1NlbmQoJ2V4cG9ydERvaSB1cmw6JyxET0lfTUFJTF9GRVRDSF9VUkwsSlNPTi5zdHJpbmdpZnkoZXhwb3J0RG9pRGF0YSkpO1xuICAgICAgcmV0dXJuIGV4cG9ydERvaURhdGFcblxuICAgIH0gY2F0Y2goZXJyb3IpIHtcbiAgICAgIHRocm93IFwiRXJyb3Igd2hpbGUgZXhwb3J0aW5nIGRvaXM6IFwiK2Vycm9yO1xuICAgIH1cblxuICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdkYXBwcy5leHBvcnREb2kuZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgZXhwb3J0RG9pcztcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tICdzaW1wbC1zY2hlbWEnO1xuaW1wb3J0IHsgRE9JX0ZFVENIX1JPVVRFLCBET0lfQ09ORklSTUFUSU9OX1JPVVRFLCBBUElfUEFUSCwgVkVSU0lPTiB9IGZyb20gJy4uLy4uLy4uLy4uL3NlcnZlci9hcGkvcmVzdC9yZXN0LmpzJztcbmltcG9ydCB7IGdldFVybCB9IGZyb20gJy4uLy4uLy4uL3N0YXJ0dXAvc2VydmVyL2RhcHAtY29uZmlndXJhdGlvbi5qcyc7XG5pbXBvcnQgeyBDT05GSVJNX0NMSUVOVCwgQ09ORklSTV9BRERSRVNTIH0gZnJvbSAnLi4vLi4vLi4vc3RhcnR1cC9zZXJ2ZXIvZG9pY2hhaW4tY29uZmlndXJhdGlvbi5qcyc7XG5pbXBvcnQgeyBnZXRIdHRwR0VUIH0gZnJvbSAnLi4vLi4vLi4vLi4vc2VydmVyL2FwaS9odHRwLmpzJztcbmltcG9ydCB7IHNpZ25NZXNzYWdlIH0gZnJvbSAnLi4vLi4vLi4vLi4vc2VydmVyL2FwaS9kb2ljaGFpbi5qcyc7XG5pbXBvcnQgeyBPcHRJbnMgfSBmcm9tICcuLi8uLi8uLi8uLi9pbXBvcnRzL2FwaS9vcHQtaW5zL29wdC1pbnMuanMnO1xuaW1wb3J0IHBhcnNlVGVtcGxhdGUgZnJvbSAnLi4vZW1haWxzL3BhcnNlX3RlbXBsYXRlLmpzJztcbmltcG9ydCBnZW5lcmF0ZURvaVRva2VuIGZyb20gJy4uL29wdC1pbnMvZ2VuZXJhdGVfZG9pLXRva2VuLmpzJztcbmltcG9ydCBnZW5lcmF0ZURvaUhhc2ggZnJvbSAnLi4vZW1haWxzL2dlbmVyYXRlX2RvaS1oYXNoLmpzJztcbmltcG9ydCBhZGRPcHRJbiBmcm9tICcuLi9vcHQtaW5zL2FkZC5qcyc7XG5pbXBvcnQgYWRkU2VuZE1haWxKb2IgZnJvbSAnLi4vam9icy9hZGRfc2VuZF9tYWlsLmpzJztcbmltcG9ydCB7bG9nQ29uZmlybSwgbG9nRXJyb3J9IGZyb20gXCIuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9sb2ctY29uZmlndXJhdGlvblwiO1xuXG5jb25zdCBGZXRjaERvaU1haWxEYXRhU2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIG5hbWU6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfSxcbiAgZG9tYWluOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH1cbn0pO1xuXG5cbmNvbnN0IGZldGNoRG9pTWFpbERhdGEgPSAoZGF0YSkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IG91ckRhdGEgPSBkYXRhO1xuICAgIEZldGNoRG9pTWFpbERhdGFTY2hlbWEudmFsaWRhdGUob3VyRGF0YSk7XG4gICAgY29uc3QgdXJsID0gb3VyRGF0YS5kb21haW4rQVBJX1BBVEgrVkVSU0lPTitcIi9cIitET0lfRkVUQ0hfUk9VVEU7XG4gICAgY29uc3Qgc2lnbmF0dXJlID0gc2lnbk1lc3NhZ2UoQ09ORklSTV9DTElFTlQsIENPTkZJUk1fQUREUkVTUywgb3VyRGF0YS5uYW1lKTtcbiAgICBjb25zdCBxdWVyeSA9IFwibmFtZV9pZD1cIitlbmNvZGVVUklDb21wb25lbnQob3VyRGF0YS5uYW1lKStcIiZzaWduYXR1cmU9XCIrZW5jb2RlVVJJQ29tcG9uZW50KHNpZ25hdHVyZSk7XG4gICAgbG9nQ29uZmlybSgnY2FsbGluZyBmb3IgZG9pLWVtYWlsLXRlbXBsYXRlOicrdXJsKycgcXVlcnk6JywgcXVlcnkpO1xuXG4gICAgLyoqXG4gICAgICBUT0RPIHdoZW4gcnVubmluZyBTZW5kLWRBcHAgaW4gVGVzdG5ldCBiZWhpbmQgTkFUIHRoaXMgVVJMIHdpbGwgbm90IGJlIGFjY2Vzc2libGUgZnJvbSB0aGUgaW50ZXJuZXRcbiAgICAgIGJ1dCBldmVuIHdoZW4gd2UgdXNlIHRoZSBVUkwgZnJvbSBsb2NhbGhvc3QgdmVyaWZ5IGFuZG4gb3RoZXJzIHdpbGwgZmFpbHMuXG4gICAgICovXG4gICAgY29uc3QgcmVzcG9uc2UgPSBnZXRIdHRwR0VUKHVybCwgcXVlcnkpO1xuICAgIGlmKHJlc3BvbnNlID09PSB1bmRlZmluZWQgfHwgcmVzcG9uc2UuZGF0YSA9PT0gdW5kZWZpbmVkKSB0aHJvdyBcIkJhZCByZXNwb25zZVwiO1xuICAgIGNvbnN0IHJlc3BvbnNlRGF0YSA9IHJlc3BvbnNlLmRhdGE7XG4gICAgbG9nQ29uZmlybSgncmVzcG9uc2Ugd2hpbGUgZ2V0dGluZyBnZXR0aW5nIGVtYWlsIHRlbXBsYXRlIGZyb20gVVJMOicscmVzcG9uc2UuZGF0YS5zdGF0dXMpO1xuXG4gICAgaWYocmVzcG9uc2VEYXRhLnN0YXR1cyAhPT0gXCJzdWNjZXNzXCIpIHtcbiAgICAgIGlmKHJlc3BvbnNlRGF0YS5lcnJvciA9PT0gdW5kZWZpbmVkKSB0aHJvdyBcIkJhZCByZXNwb25zZVwiO1xuICAgICAgaWYocmVzcG9uc2VEYXRhLmVycm9yLmluY2x1ZGVzKFwiT3B0LUluIG5vdCBmb3VuZFwiKSkge1xuICAgICAgICAvL0RvIG5vdGhpbmcgYW5kIGRvbid0IHRocm93IGVycm9yIHNvIGpvYiBpcyBkb25lXG4gICAgICAgICAgbG9nRXJyb3IoJ3Jlc3BvbnNlIGRhdGEgZnJvbSBTZW5kLWRBcHA6JyxyZXNwb25zZURhdGEuZXJyb3IpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB0aHJvdyByZXNwb25zZURhdGEuZXJyb3I7XG4gICAgfVxuICAgIGxvZ0NvbmZpcm0oJ0RPSSBNYWlsIGRhdGEgZmV0Y2hlZC4nKTtcblxuICAgIGNvbnN0IG9wdEluSWQgPSBhZGRPcHRJbih7bmFtZTogb3VyRGF0YS5uYW1lfSk7XG4gICAgY29uc3Qgb3B0SW4gPSBPcHRJbnMuZmluZE9uZSh7X2lkOiBvcHRJbklkfSk7XG4gICAgbG9nQ29uZmlybSgnb3B0LWluIGZvdW5kOicsb3B0SW4pO1xuICAgIGlmKG9wdEluLmNvbmZpcm1hdGlvblRva2VuICE9PSB1bmRlZmluZWQpIHJldHVybjtcblxuICAgIGNvbnN0IHRva2VuID0gZ2VuZXJhdGVEb2lUb2tlbih7aWQ6IG9wdEluLl9pZH0pO1xuICAgIGxvZ0NvbmZpcm0oJ2dlbmVyYXRlZCBjb25maXJtYXRpb25Ub2tlbjonLHRva2VuKTtcbiAgICBjb25zdCBjb25maXJtYXRpb25IYXNoID0gZ2VuZXJhdGVEb2lIYXNoKHtpZDogb3B0SW4uX2lkLCB0b2tlbjogdG9rZW4sIHJlZGlyZWN0OiByZXNwb25zZURhdGEuZGF0YS5yZWRpcmVjdH0pO1xuICAgIGxvZ0NvbmZpcm0oJ2dlbmVyYXRlZCBjb25maXJtYXRpb25IYXNoOicsY29uZmlybWF0aW9uSGFzaCk7XG4gICAgY29uc3QgY29uZmlybWF0aW9uVXJsID0gZ2V0VXJsKCkrQVBJX1BBVEgrVkVSU0lPTitcIi9cIitET0lfQ09ORklSTUFUSU9OX1JPVVRFK1wiL1wiK2VuY29kZVVSSUNvbXBvbmVudChjb25maXJtYXRpb25IYXNoKTtcbiAgICBsb2dDb25maXJtKCdjb25maXJtYXRpb25Vcmw6Jytjb25maXJtYXRpb25VcmwpO1xuXG4gICAgY29uc3QgdGVtcGxhdGUgPSBwYXJzZVRlbXBsYXRlKHt0ZW1wbGF0ZTogcmVzcG9uc2VEYXRhLmRhdGEuY29udGVudCwgZGF0YToge1xuICAgICAgY29uZmlybWF0aW9uX3VybDogY29uZmlybWF0aW9uVXJsXG4gICAgfX0pO1xuXG4gICAgLy9sb2dDb25maXJtKCd3ZSBhcmUgdXNpbmcgdGhpcyB0ZW1wbGF0ZTonLHRlbXBsYXRlKTtcblxuICAgIGxvZ0NvbmZpcm0oJ3NlbmRpbmcgZW1haWwgdG8gcGV0ZXIgZm9yIGNvbmZpcm1hdGlvbiBvdmVyIGJvYnMgZEFwcCcpO1xuICAgIGFkZFNlbmRNYWlsSm9iKHtcbiAgICAgIHRvOiByZXNwb25zZURhdGEuZGF0YS5yZWNpcGllbnQsXG4gICAgICBzdWJqZWN0OiByZXNwb25zZURhdGEuZGF0YS5zdWJqZWN0LFxuICAgICAgbWVzc2FnZTogdGVtcGxhdGUsXG4gICAgICByZXR1cm5QYXRoOiByZXNwb25zZURhdGEuZGF0YS5yZXR1cm5QYXRoXG4gICAgfSk7XG4gIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2RhcHBzLmZldGNoRG9pTWFpbERhdGEuZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgZmV0Y2hEb2lNYWlsRGF0YTtcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tICdzaW1wbC1zY2hlbWEnO1xuaW1wb3J0IHsgT3B0SW5zIH0gZnJvbSAnLi4vLi4vLi4vYXBpL29wdC1pbnMvb3B0LWlucy5qcyc7XG5pbXBvcnQgeyBSZWNpcGllbnRzIH0gZnJvbSAnLi4vLi4vLi4vYXBpL3JlY2lwaWVudHMvcmVjaXBpZW50cy5qcyc7XG5pbXBvcnQgZ2V0T3B0SW5Qcm92aWRlciBmcm9tICcuLi9kbnMvZ2V0X29wdC1pbi1wcm92aWRlci5qcyc7XG5pbXBvcnQgZ2V0T3B0SW5LZXkgZnJvbSAnLi4vZG5zL2dldF9vcHQtaW4ta2V5LmpzJztcbmltcG9ydCB2ZXJpZnlTaWduYXR1cmUgZnJvbSAnLi4vZG9pY2hhaW4vdmVyaWZ5X3NpZ25hdHVyZS5qcyc7XG5pbXBvcnQgeyBnZXRIdHRwR0VUIH0gZnJvbSAnLi4vLi4vLi4vLi4vc2VydmVyL2FwaS9odHRwLmpzJztcbmltcG9ydCB7IERPSV9NQUlMX0ZFVENIX1VSTCB9IGZyb20gJy4uLy4uLy4uL3N0YXJ0dXAvc2VydmVyL2VtYWlsLWNvbmZpZ3VyYXRpb24uanMnO1xuaW1wb3J0IHsgbG9nU2VuZCB9IGZyb20gXCIuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9sb2ctY29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgQWNjb3VudHMgfSBmcm9tICdtZXRlb3IvYWNjb3VudHMtYmFzZSdcblxuY29uc3QgR2V0RG9pTWFpbERhdGFTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgbmFtZV9pZDoge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9LFxuICBzaWduYXR1cmU6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfVxufSk7XG5cbmNvbnN0IHVzZXJQcm9maWxlU2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIHN1YmplY3Q6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgb3B0aW9uYWw6dHJ1ZVxuICB9LFxuICByZWRpcmVjdDoge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICByZWdFeDogXCJAKGh0dHBzP3xmdHApOi8vKC1cXFxcLik/KFteXFxcXHMvP1xcXFwuIy1dK1xcXFwuPykrKC9bXlxcXFxzXSopPyRAXCIsXG4gICAgb3B0aW9uYWw6dHJ1ZVxuICB9LFxuICByZXR1cm5QYXRoOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIHJlZ0V4OiBTaW1wbGVTY2hlbWEuUmVnRXguRW1haWwsXG4gICAgb3B0aW9uYWw6dHJ1ZVxuICB9LFxuICB0ZW1wbGF0ZVVSTDoge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICByZWdFeDogXCJAKGh0dHBzP3xmdHApOi8vKC1cXFxcLik/KFteXFxcXHMvP1xcXFwuIy1dK1xcXFwuPykrKC9bXlxcXFxzXSopPyRAXCIsXG4gICAgb3B0aW9uYWw6dHJ1ZVxuICB9XG59KTtcblxuY29uc3QgZ2V0RG9pTWFpbERhdGEgPSAoZGF0YSkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IG91ckRhdGEgPSBkYXRhO1xuICAgIEdldERvaU1haWxEYXRhU2NoZW1hLnZhbGlkYXRlKG91ckRhdGEpO1xuICAgIGNvbnN0IG9wdEluID0gT3B0SW5zLmZpbmRPbmUoe25hbWVJZDogb3VyRGF0YS5uYW1lX2lkfSk7XG4gICAgaWYob3B0SW4gPT09IHVuZGVmaW5lZCkgdGhyb3cgXCJPcHQtSW4gd2l0aCBuYW1lX2lkOiBcIitvdXJEYXRhLm5hbWVfaWQrXCIgbm90IGZvdW5kXCI7XG4gICAgbG9nU2VuZCgnT3B0LUluIGZvdW5kJyxvcHRJbik7XG5cbiAgICBjb25zdCByZWNpcGllbnQgPSBSZWNpcGllbnRzLmZpbmRPbmUoe19pZDogb3B0SW4ucmVjaXBpZW50fSk7XG4gICAgaWYocmVjaXBpZW50ID09PSB1bmRlZmluZWQpIHRocm93IFwiUmVjaXBpZW50IG5vdCBmb3VuZFwiO1xuICAgIGxvZ1NlbmQoJ1JlY2lwaWVudCBmb3VuZCcsIHJlY2lwaWVudCk7XG5cbiAgICBjb25zdCBwYXJ0cyA9IHJlY2lwaWVudC5lbWFpbC5zcGxpdChcIkBcIik7XG4gICAgY29uc3QgZG9tYWluID0gcGFydHNbcGFydHMubGVuZ3RoLTFdO1xuXG4gICAgbGV0IHB1YmxpY0tleSA9IGdldE9wdEluS2V5KHsgZG9tYWluOiBkb21haW59KTtcblxuICAgIGlmKCFwdWJsaWNLZXkpe1xuICAgICAgY29uc3QgcHJvdmlkZXIgPSBnZXRPcHRJblByb3ZpZGVyKHtkb21haW46IG91ckRhdGEuZG9tYWluIH0pO1xuICAgICAgbG9nU2VuZChcInVzaW5nIGRvaWNoYWluIHByb3ZpZGVyIGluc3RlYWQgb2YgZGlyZWN0bHkgY29uZmlndXJlZCBwdWJsaWNLZXk6XCIsIHsgcHJvdmlkZXI6IHByb3ZpZGVyIH0pO1xuICAgICAgcHVibGljS2V5ID0gZ2V0T3B0SW5LZXkoeyBkb21haW46IHByb3ZpZGVyfSk7IC8vZ2V0IHB1YmxpYyBrZXkgZnJvbSBwcm92aWRlciBvciBmYWxsYmFjayBpZiBwdWJsaWNrZXkgd2FzIG5vdCBzZXQgaW4gZG5zXG4gICAgfVxuXG4gICAgbG9nU2VuZCgncXVlcmllZCBkYXRhOiAocGFydHMsIGRvbWFpbiwgcHJvdmlkZXIsIHB1YmxpY0tleSknLCAnKCcrcGFydHMrJywnK2RvbWFpbisnLCcrcHVibGljS2V5KycpJyk7XG5cbiAgICAvL1RPRE86IE9ubHkgYWxsb3cgYWNjZXNzIG9uZSB0aW1lXG4gICAgLy8gUG9zc2libGUgc29sdXRpb246XG4gICAgLy8gMS4gUHJvdmlkZXIgKGNvbmZpcm0gZEFwcCkgcmVxdWVzdCB0aGUgZGF0YVxuICAgIC8vIDIuIFByb3ZpZGVyIHJlY2VpdmUgdGhlIGRhdGFcbiAgICAvLyAzLiBQcm92aWRlciBzZW5kcyBjb25maXJtYXRpb24gXCJJIGdvdCB0aGUgZGF0YVwiXG4gICAgLy8gNC4gU2VuZCBkQXBwIGxvY2sgdGhlIGRhdGEgZm9yIHRoaXMgb3B0IGluXG4gICAgbG9nU2VuZCgndmVyaWZ5aW5nIHNpZ25hdHVyZS4uLicpO1xuICAgIGlmKCF2ZXJpZnlTaWduYXR1cmUoe3B1YmxpY0tleTogcHVibGljS2V5LCBkYXRhOiBvdXJEYXRhLm5hbWVfaWQsIHNpZ25hdHVyZTogb3VyRGF0YS5zaWduYXR1cmV9KSkge1xuICAgICAgdGhyb3cgXCJzaWduYXR1cmUgaW5jb3JyZWN0IC0gYWNjZXNzIGRlbmllZFwiO1xuICAgIH1cbiAgICBcbiAgICBsb2dTZW5kKCdzaWduYXR1cmUgdmVyaWZpZWQnKTtcblxuICAgIC8vVE9ETzogUXVlcnkgZm9yIGxhbmd1YWdlXG4gICAgbGV0IGRvaU1haWxEYXRhO1xuICAgIHRyeSB7XG5cbiAgICAgIGRvaU1haWxEYXRhID0gZ2V0SHR0cEdFVChET0lfTUFJTF9GRVRDSF9VUkwsIFwiXCIpLmRhdGE7XG4gICAgICBsZXQgZGVmYXVsdFJldHVybkRhdGEgPSB7XG4gICAgICAgIFwicmVjaXBpZW50XCI6IHJlY2lwaWVudC5lbWFpbCxcbiAgICAgICAgXCJjb250ZW50XCI6IGRvaU1haWxEYXRhLmRhdGEuY29udGVudCxcbiAgICAgICAgXCJyZWRpcmVjdFwiOiBkb2lNYWlsRGF0YS5kYXRhLnJlZGlyZWN0LFxuICAgICAgICBcInN1YmplY3RcIjogZG9pTWFpbERhdGEuZGF0YS5zdWJqZWN0LFxuICAgICAgICBcInJldHVyblBhdGhcIjogZG9pTWFpbERhdGEuZGF0YS5yZXR1cm5QYXRoXG4gICAgICB9XG5cbiAgICBsZXQgcmV0dXJuRGF0YSA9IGRlZmF1bHRSZXR1cm5EYXRhO1xuXG4gICAgdHJ5e1xuICAgICAgbGV0IG93bmVyID0gQWNjb3VudHMudXNlcnMuZmluZE9uZSh7X2lkOiBvcHRJbi5vd25lcklkfSk7XG4gICAgICBsZXQgbWFpbFRlbXBsYXRlID0gb3duZXIucHJvZmlsZS5tYWlsVGVtcGxhdGU7XG4gICAgICB1c2VyUHJvZmlsZVNjaGVtYS52YWxpZGF0ZShtYWlsVGVtcGxhdGUpO1xuXG4gICAgICByZXR1cm5EYXRhW1wicmVkaXJlY3RcIl0gPSBtYWlsVGVtcGxhdGVbXCJyZWRpcmVjdFwiXSB8fCBkZWZhdWx0UmV0dXJuRGF0YVtcInJlZGlyZWN0XCJdO1xuICAgICAgcmV0dXJuRGF0YVtcInN1YmplY3RcIl0gPSBtYWlsVGVtcGxhdGVbXCJzdWJqZWN0XCJdIHx8IGRlZmF1bHRSZXR1cm5EYXRhW1wic3ViamVjdFwiXTtcbiAgICAgIHJldHVybkRhdGFbXCJyZXR1cm5QYXRoXCJdID0gbWFpbFRlbXBsYXRlW1wicmV0dXJuUGF0aFwiXSB8fCBkZWZhdWx0UmV0dXJuRGF0YVtcInJldHVyblBhdGhcIl07XG4gICAgICByZXR1cm5EYXRhW1wiY29udGVudFwiXSA9IG1haWxUZW1wbGF0ZVtcInRlbXBsYXRlVVJMXCJdID8gKGdldEh0dHBHRVQobWFpbFRlbXBsYXRlW1widGVtcGxhdGVVUkxcIl0sIFwiXCIpLmNvbnRlbnQgfHwgZGVmYXVsdFJldHVybkRhdGFbXCJjb250ZW50XCJdKSA6IGRlZmF1bHRSZXR1cm5EYXRhW1wiY29udGVudFwiXTtcbiAgICAgIFxuICAgIH1cbiAgICBjYXRjaChlcnJvcikge1xuICAgICAgcmV0dXJuRGF0YT1kZWZhdWx0UmV0dXJuRGF0YTtcbiAgICB9XG5cbiAgICAgIGxvZ1NlbmQoJ2RvaU1haWxEYXRhIGFuZCB1cmw6JywgRE9JX01BSUxfRkVUQ0hfVVJMLCByZXR1cm5EYXRhKTtcblxuICAgICAgcmV0dXJuIHJldHVybkRhdGFcblxuICAgIH0gY2F0Y2goZXJyb3IpIHtcbiAgICAgIHRocm93IFwiRXJyb3Igd2hpbGUgZmV0Y2hpbmcgbWFpbCBjb250ZW50OiBcIitlcnJvcjtcbiAgICB9XG5cbiAgfSBjYXRjaChleGNlcHRpb24pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdkYXBwcy5nZXREb2lNYWlsRGF0YS5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBnZXREb2lNYWlsRGF0YTtcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tICdzaW1wbC1zY2hlbWEnO1xuaW1wb3J0IHsgcmVzb2x2ZVR4dCB9IGZyb20gJy4uLy4uLy4uLy4uL3NlcnZlci9hcGkvZG5zLmpzJztcbmltcG9ydCB7IEZBTExCQUNLX1BST1ZJREVSIH0gZnJvbSAnLi4vLi4vLi4vc3RhcnR1cC9zZXJ2ZXIvZG5zLWNvbmZpZ3VyYXRpb24uanMnO1xuaW1wb3J0IHtpc1JlZ3Rlc3QsIGlzVGVzdG5ldH0gZnJvbSBcIi4uLy4uLy4uL3N0YXJ0dXAvc2VydmVyL2RhcHAtY29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHtsb2dTZW5kfSBmcm9tIFwiLi4vLi4vLi4vc3RhcnR1cC9zZXJ2ZXIvbG9nLWNvbmZpZ3VyYXRpb25cIjtcblxuY29uc3QgT1BUX0lOX0tFWSA9IFwiZG9pY2hhaW4tb3B0LWluLWtleVwiO1xuY29uc3QgT1BUX0lOX0tFWV9URVNUTkVUID0gXCJkb2ljaGFpbi10ZXN0bmV0LW9wdC1pbi1rZXlcIjtcblxuY29uc3QgR2V0T3B0SW5LZXlTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgZG9tYWluOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH1cbn0pO1xuXG5cbmNvbnN0IGdldE9wdEluS2V5ID0gKGRhdGEpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBvdXJEYXRhID0gZGF0YTtcbiAgICBHZXRPcHRJbktleVNjaGVtYS52YWxpZGF0ZShvdXJEYXRhKTtcblxuICAgIGxldCBvdXJPUFRfSU5fS0VZPU9QVF9JTl9LRVk7XG5cbiAgICBpZihpc1JlZ3Rlc3QoKSB8fCBpc1Rlc3RuZXQoKSl7XG4gICAgICAgIG91ck9QVF9JTl9LRVkgPSBPUFRfSU5fS0VZX1RFU1RORVQ7XG4gICAgICAgIGxvZ1NlbmQoJ1VzaW5nIFJlZ1Rlc3Q6Jytpc1JlZ3Rlc3QoKStcIiBUZXN0bmV0OiBcIitpc1Rlc3RuZXQoKStcIiBvdXJPUFRfSU5fS0VZXCIsb3VyT1BUX0lOX0tFWSk7XG4gICAgfVxuICAgIGNvbnN0IGtleSA9IHJlc29sdmVUeHQob3VyT1BUX0lOX0tFWSwgb3VyRGF0YS5kb21haW4pO1xuICAgIGxvZ1NlbmQoJ0ROUyBUWFQgY29uZmlndXJlZCBwdWJsaWMga2V5IG9mIHJlY2lwaWVudCBlbWFpbCBkb21haW4gYW5kIGNvbmZpcm1hdGlvbiBkYXBwJyx7Zm91bmRLZXk6a2V5LCBkb21haW46b3VyRGF0YS5kb21haW4sIGRuc2tleTpvdXJPUFRfSU5fS0VZfSk7XG5cbiAgICBpZihrZXkgPT09IHVuZGVmaW5lZCkgcmV0dXJuIHVzZUZhbGxiYWNrKG91ckRhdGEuZG9tYWluKTtcbiAgICByZXR1cm4ga2V5O1xuICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdkbnMuZ2V0T3B0SW5LZXkuZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgfVxufTtcblxuY29uc3QgdXNlRmFsbGJhY2sgPSAoZG9tYWluKSA9PiB7XG4gIGlmKGRvbWFpbiA9PT0gRkFMTEJBQ0tfUFJPVklERVIpIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoXCJGYWxsYmFjayBoYXMgbm8ga2V5IGRlZmluZWQhXCIpO1xuICAgIGxvZ1NlbmQoXCJLZXkgbm90IGRlZmluZWQuIFVzaW5nIGZhbGxiYWNrOiBcIixGQUxMQkFDS19QUk9WSURFUik7XG4gIHJldHVybiBnZXRPcHRJbktleSh7ZG9tYWluOiBGQUxMQkFDS19QUk9WSURFUn0pO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgZ2V0T3B0SW5LZXk7XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcbmltcG9ydCB7IHJlc29sdmVUeHQgfSBmcm9tICcuLi8uLi8uLi8uLi9zZXJ2ZXIvYXBpL2Rucy5qcyc7XG5pbXBvcnQgeyBGQUxMQkFDS19QUk9WSURFUiB9IGZyb20gJy4uLy4uLy4uL3N0YXJ0dXAvc2VydmVyL2Rucy1jb25maWd1cmF0aW9uLmpzJztcbmltcG9ydCB7bG9nU2VuZH0gZnJvbSBcIi4uLy4uLy4uL3N0YXJ0dXAvc2VydmVyL2xvZy1jb25maWd1cmF0aW9uXCI7XG5pbXBvcnQge2lzUmVndGVzdCwgaXNUZXN0bmV0fSBmcm9tIFwiLi4vLi4vLi4vc3RhcnR1cC9zZXJ2ZXIvZGFwcC1jb25maWd1cmF0aW9uXCI7XG5cbmNvbnN0IFBST1ZJREVSX0tFWSA9IFwiZG9pY2hhaW4tb3B0LWluLXByb3ZpZGVyXCI7XG5jb25zdCBQUk9WSURFUl9LRVlfVEVTVE5FVCA9IFwiZG9pY2hhaW4tdGVzdG5ldC1vcHQtaW4tcHJvdmlkZXJcIjtcblxuY29uc3QgR2V0T3B0SW5Qcm92aWRlclNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICBkb21haW46IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfVxufSk7XG5cblxuY29uc3QgZ2V0T3B0SW5Qcm92aWRlciA9IChkYXRhKSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3Qgb3VyRGF0YSA9IGRhdGE7XG4gICAgR2V0T3B0SW5Qcm92aWRlclNjaGVtYS52YWxpZGF0ZShvdXJEYXRhKTtcblxuICAgIGxldCBvdXJQUk9WSURFUl9LRVk9UFJPVklERVJfS0VZO1xuICAgIGlmKGlzUmVndGVzdCgpIHx8IGlzVGVzdG5ldCgpKXtcbiAgICAgICAgb3VyUFJPVklERVJfS0VZID0gUFJPVklERVJfS0VZX1RFU1RORVQ7XG4gICAgICAgIGxvZ1NlbmQoJ1VzaW5nIFJlZ1Rlc3Q6Jytpc1JlZ3Rlc3QoKStcIiA6IFRlc3RuZXQ6XCIraXNUZXN0bmV0KCkrXCIgUFJPVklERVJfS0VZXCIse3Byb3ZpZGVyS2V5Om91clBST1ZJREVSX0tFWSwgZG9tYWluOm91ckRhdGEuZG9tYWlufSk7XG4gICAgfVxuXG4gICAgY29uc3QgcHJvdmlkZXIgPSByZXNvbHZlVHh0KG91clBST1ZJREVSX0tFWSwgb3VyRGF0YS5kb21haW4pO1xuICAgIGlmKHByb3ZpZGVyID09PSB1bmRlZmluZWQpIHJldHVybiB1c2VGYWxsYmFjaygpO1xuXG4gICAgbG9nU2VuZCgnb3B0LWluLXByb3ZpZGVyIGZyb20gZG5zIC0gc2VydmVyIG9mIG1haWwgcmVjaXBpZW50OiAoVFhUKTonLHByb3ZpZGVyKTtcbiAgICByZXR1cm4gcHJvdmlkZXI7XG4gIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2Rucy5nZXRPcHRJblByb3ZpZGVyLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH1cbn07XG5cbmNvbnN0IHVzZUZhbGxiYWNrID0gKCkgPT4ge1xuICBsb2dTZW5kKCdQcm92aWRlciBub3QgZGVmaW5lZC4gRmFsbGJhY2sgJytGQUxMQkFDS19QUk9WSURFUisnIGlzIHVzZWQnKTtcbiAgcmV0dXJuIEZBTExCQUNLX1BST1ZJREVSO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgZ2V0T3B0SW5Qcm92aWRlcjtcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tICdzaW1wbC1zY2hlbWEnO1xuaW1wb3J0IHsgQ09ORklSTV9DTElFTlQsIENPTkZJUk1fQUREUkVTUyB9IGZyb20gJy4uLy4uLy4uL3N0YXJ0dXAvc2VydmVyL2RvaWNoYWluLWNvbmZpZ3VyYXRpb24uanMnO1xuaW1wb3J0IHsgZ2V0V2lmIH0gZnJvbSAnLi4vLi4vLi4vLi4vc2VydmVyL2FwaS9kb2ljaGFpbi5qcyc7XG5pbXBvcnQgeyBEb2ljaGFpbkVudHJpZXMgfSBmcm9tICcuLi8uLi8uLi9hcGkvZG9pY2hhaW4vZW50cmllcy5qcyc7XG5pbXBvcnQgYWRkRmV0Y2hEb2lNYWlsRGF0YUpvYiBmcm9tICcuLi9qb2JzL2FkZF9mZXRjaC1kb2ktbWFpbC1kYXRhLmpzJztcbmltcG9ydCBnZXRQcml2YXRlS2V5RnJvbVdpZiBmcm9tICcuL2dldF9wcml2YXRlLWtleV9mcm9tX3dpZi5qcyc7XG5pbXBvcnQgZGVjcnlwdE1lc3NhZ2UgZnJvbSAnLi9kZWNyeXB0X21lc3NhZ2UuanMnO1xuaW1wb3J0IHtsb2dDb25maXJtLCBsb2dTZW5kfSBmcm9tIFwiLi4vLi4vLi4vc3RhcnR1cC9zZXJ2ZXIvbG9nLWNvbmZpZ3VyYXRpb25cIjtcblxuY29uc3QgQWRkRG9pY2hhaW5FbnRyeVNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICBuYW1lOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH0sXG4gIHZhbHVlOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH0sXG4gIGFkZHJlc3M6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfSxcbiAgdHhJZDoge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9XG59KTtcblxuLyoqXG4gKiBJbnNlcnRzXG4gKlxuICogQHBhcmFtIGVudHJ5XG4gKiBAcmV0dXJucyB7Kn1cbiAqL1xuY29uc3QgYWRkRG9pY2hhaW5FbnRyeSA9IChlbnRyeSkgPT4ge1xuICB0cnkge1xuXG4gICAgY29uc3Qgb3VyRW50cnkgPSBlbnRyeTtcbiAgICBsb2dDb25maXJtKCdhZGRpbmcgRG9pY2hhaW5FbnRyeSBvbiBCb2IuLi4nLG91ckVudHJ5Lm5hbWUpO1xuICAgIEFkZERvaWNoYWluRW50cnlTY2hlbWEudmFsaWRhdGUob3VyRW50cnkpO1xuXG4gICAgY29uc3QgZXR5ID0gRG9pY2hhaW5FbnRyaWVzLmZpbmRPbmUoe25hbWU6IG91ckVudHJ5Lm5hbWV9KTtcbiAgICBpZihldHkgIT09IHVuZGVmaW5lZCl7XG4gICAgICAgIGxvZ1NlbmQoJ3JldHVybmluZyBsb2NhbGx5IHNhdmVkIGVudHJ5IHdpdGggX2lkOicrZXR5Ll9pZCk7XG4gICAgICAgIHJldHVybiBldHkuX2lkO1xuICAgIH1cblxuICAgIGNvbnN0IHZhbHVlID0gSlNPTi5wYXJzZShvdXJFbnRyeS52YWx1ZSk7XG4gICAgLy9sb2dTZW5kKFwidmFsdWU6XCIsdmFsdWUpO1xuICAgIGlmKHZhbHVlLmZyb20gPT09IHVuZGVmaW5lZCkgdGhyb3cgXCJXcm9uZyBibG9ja2NoYWluIGVudHJ5XCI7IC8vVE9ETyBpZiBmcm9tIGlzIG1pc3NpbmcgYnV0IHZhbHVlIGlzIHRoZXJlLCBpdCBpcyBwcm9iYWJseSBhbGxyZWFkeSBoYW5kZWxlZCBjb3JyZWN0bHkgYW55d2F5cyB0aGlzIGlzIG5vdCBzbyBjb29sIGFzIGl0IHNlZW1zLlxuICAgIGNvbnN0IHdpZiA9IGdldFdpZihDT05GSVJNX0NMSUVOVCwgQ09ORklSTV9BRERSRVNTKTtcbiAgICBjb25zdCBwcml2YXRlS2V5ID0gZ2V0UHJpdmF0ZUtleUZyb21XaWYoe3dpZjogd2lmfSk7XG4gICAgbG9nU2VuZCgnZ290IHByaXZhdGUga2V5ICh3aWxsIG5vdCBzaG93IGl0IGhlcmUpJyk7XG5cbiAgICBjb25zdCBkb21haW4gPSBkZWNyeXB0TWVzc2FnZSh7cHJpdmF0ZUtleTogcHJpdmF0ZUtleSwgbWVzc2FnZTogdmFsdWUuZnJvbX0pO1xuICAgIGxvZ1NlbmQoJ2RlY3J5cHRlZCBtZXNzYWdlIGZyb20gZG9tYWluOiAnLGRvbWFpbik7XG5cbiAgICBjb25zdCBuYW1lUG9zID0gb3VyRW50cnkubmFtZS5pbmRleE9mKCctJyk7IC8vaWYgdGhpcyBpcyBub3QgYSBjby1yZWdpc3RyYXRpb24gZmV0Y2ggbWFpbC5cbiAgICBsb2dTZW5kKCduYW1lUG9zOicsbmFtZVBvcyk7XG4gICAgY29uc3QgbWFzdGVyRG9pID0gKG5hbWVQb3MhPS0xKT9vdXJFbnRyeS5uYW1lLnN1YnN0cmluZygwLG5hbWVQb3MpOnVuZGVmaW5lZDtcbiAgICBsb2dTZW5kKCdtYXN0ZXJEb2k6JyxtYXN0ZXJEb2kpO1xuICAgIGNvbnN0IGluZGV4ID0gbWFzdGVyRG9pP291ckVudHJ5Lm5hbWUuc3Vic3RyaW5nKG5hbWVQb3MrMSk6dW5kZWZpbmVkO1xuICAgIGxvZ1NlbmQoJ2luZGV4OicsaW5kZXgpO1xuXG4gICAgY29uc3QgaWQgPSBEb2ljaGFpbkVudHJpZXMuaW5zZXJ0KHtcbiAgICAgICAgbmFtZTogb3VyRW50cnkubmFtZSxcbiAgICAgICAgdmFsdWU6IG91ckVudHJ5LnZhbHVlLFxuICAgICAgICBhZGRyZXNzOiBvdXJFbnRyeS5hZGRyZXNzLFxuICAgICAgICBtYXN0ZXJEb2k6IG1hc3RlckRvaSxcbiAgICAgICAgaW5kZXg6IGluZGV4LFxuICAgICAgICB0eElkOiBvdXJFbnRyeS50eElkLFxuICAgICAgICBleHBpcmVzSW46IG91ckVudHJ5LmV4cGlyZXNJbixcbiAgICAgICAgZXhwaXJlZDogb3VyRW50cnkuZXhwaXJlZFxuICAgIH0pO1xuXG4gICAgbG9nU2VuZCgnRG9pY2hhaW5FbnRyeSBhZGRlZCBvbiBCb2I6Jywge2lkOmlkLG5hbWU6b3VyRW50cnkubmFtZSxtYXN0ZXJEb2k6bWFzdGVyRG9pLGluZGV4OmluZGV4fSk7XG5cbiAgICBpZighbWFzdGVyRG9pKXtcbiAgICAgICAgYWRkRmV0Y2hEb2lNYWlsRGF0YUpvYih7XG4gICAgICAgICAgICBuYW1lOiBvdXJFbnRyeS5uYW1lLFxuICAgICAgICAgICAgZG9tYWluOiBkb21haW5cbiAgICAgICAgfSk7XG4gICAgICAgIGxvZ1NlbmQoJ05ldyBlbnRyeSBhZGRlZDogXFxuJytcbiAgICAgICAgICAgICdOYW1lSWQ9JytvdXJFbnRyeS5uYW1lK1wiXFxuXCIrXG4gICAgICAgICAgICAnQWRkcmVzcz0nK291ckVudHJ5LmFkZHJlc3MrXCJcXG5cIitcbiAgICAgICAgICAgICdUeElkPScrb3VyRW50cnkudHhJZCtcIlxcblwiK1xuICAgICAgICAgICAgJ1ZhbHVlPScrb3VyRW50cnkudmFsdWUpO1xuXG4gICAgfWVsc2V7XG4gICAgICAgIGxvZ1NlbmQoJ1RoaXMgdHJhbnNhY3Rpb24gYmVsb25ncyB0byBjby1yZWdpc3RyYXRpb24nLCBtYXN0ZXJEb2kpO1xuICAgIH1cblxuICAgIHJldHVybiBpZDtcbiAgfSBjYXRjaCAoZXhjZXB0aW9uKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZG9pY2hhaW4uYWRkRW50cnlBbmRGZXRjaERhdGEuZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgYWRkRG9pY2hhaW5FbnRyeTtcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IHsgbGlzdFNpbmNlQmxvY2ssIG5hbWVTaG93LCBnZXRSYXdUcmFuc2FjdGlvbn0gZnJvbSAnLi4vLi4vLi4vLi4vc2VydmVyL2FwaS9kb2ljaGFpbi5qcyc7XG5pbXBvcnQgeyBDT05GSVJNX0NMSUVOVCwgQ09ORklSTV9BRERSRVNTIH0gZnJvbSAnLi4vLi4vLi4vc3RhcnR1cC9zZXJ2ZXIvZG9pY2hhaW4tY29uZmlndXJhdGlvbi5qcyc7XG5pbXBvcnQgYWRkRG9pY2hhaW5FbnRyeSBmcm9tICcuL2FkZF9lbnRyeV9hbmRfZmV0Y2hfZGF0YS5qcydcbmltcG9ydCB7IE1ldGEgfSBmcm9tICcuLi8uLi8uLi9hcGkvbWV0YS9tZXRhLmpzJztcbmltcG9ydCBhZGRPclVwZGF0ZU1ldGEgZnJvbSAnLi4vbWV0YS9hZGRPclVwZGF0ZS5qcyc7XG5pbXBvcnQge2xvZ0NvbmZpcm19IGZyb20gXCIuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9sb2ctY29uZmlndXJhdGlvblwiO1xuXG5jb25zdCBUWF9OQU1FX1NUQVJUID0gXCJlL1wiO1xuY29uc3QgTEFTVF9DSEVDS0VEX0JMT0NLX0tFWSA9IFwibGFzdENoZWNrZWRCbG9ja1wiO1xuXG5jb25zdCBjaGVja05ld1RyYW5zYWN0aW9uID0gKHR4aWQsIGpvYikgPT4ge1xuICB0cnkge1xuXG4gICAgICBpZighdHhpZCl7XG4gICAgICAgICAgbG9nQ29uZmlybShcImNoZWNrTmV3VHJhbnNhY3Rpb24gdHJpZ2dlcmVkIHdoZW4gc3RhcnRpbmcgbm9kZSAtIGNoZWNraW5nIGFsbCBjb25maXJtZWQgYmxvY2tzIHNpbmNlIGxhc3QgY2hlY2sgZm9yIGRvaWNoYWluIGFkZHJlc3NcIixDT05GSVJNX0FERFJFU1MpO1xuXG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgdmFyIGxhc3RDaGVja2VkQmxvY2sgPSBNZXRhLmZpbmRPbmUoe2tleTogTEFTVF9DSEVDS0VEX0JMT0NLX0tFWX0pO1xuICAgICAgICAgICAgICBpZihsYXN0Q2hlY2tlZEJsb2NrICE9PSB1bmRlZmluZWQpIGxhc3RDaGVja2VkQmxvY2sgPSBsYXN0Q2hlY2tlZEJsb2NrLnZhbHVlO1xuICAgICAgICAgICAgICBsb2dDb25maXJtKFwibGFzdENoZWNrZWRCbG9ja1wiLGxhc3RDaGVja2VkQmxvY2spO1xuICAgICAgICAgICAgICBjb25zdCByZXQgPSBsaXN0U2luY2VCbG9jayhDT05GSVJNX0NMSUVOVCwgbGFzdENoZWNrZWRCbG9jayk7XG4gICAgICAgICAgICAgIGlmKHJldCA9PT0gdW5kZWZpbmVkIHx8IHJldC50cmFuc2FjdGlvbnMgPT09IHVuZGVmaW5lZCkgcmV0dXJuO1xuXG4gICAgICAgICAgICAgIGNvbnN0IHR4cyA9IHJldC50cmFuc2FjdGlvbnM7XG4gICAgICAgICAgICAgIGxhc3RDaGVja2VkQmxvY2sgPSByZXQubGFzdGJsb2NrO1xuICAgICAgICAgICAgICBpZighcmV0IHx8ICF0eHMgfHwgIXR4cy5sZW5ndGg9PT0wKXtcbiAgICAgICAgICAgICAgICAgIGxvZ0NvbmZpcm0oXCJ0cmFuc2FjdGlvbnMgZG8gbm90IGNvbnRhaW4gbmFtZU9wIHRyYW5zYWN0aW9uIGRldGFpbHMgb3IgdHJhbnNhY3Rpb24gbm90IGZvdW5kLlwiLCBsYXN0Q2hlY2tlZEJsb2NrKTtcbiAgICAgICAgICAgICAgICAgIGFkZE9yVXBkYXRlTWV0YSh7a2V5OiBMQVNUX0NIRUNLRURfQkxPQ0tfS0VZLCB2YWx1ZTogbGFzdENoZWNrZWRCbG9ja30pO1xuICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgbG9nQ29uZmlybShcImxpc3RTaW5jZUJsb2NrXCIscmV0KTtcblxuICAgICAgICAgICAgICBjb25zdCBhZGRyZXNzVHhzID0gdHhzLmZpbHRlcih0eCA9PlxuICAgICAgICAgICAgICAgICAgdHguYWRkcmVzcyA9PT0gQ09ORklSTV9BRERSRVNTXG4gICAgICAgICAgICAgICAgICAmJiB0eC5uYW1lICE9PSB1bmRlZmluZWQgLy9zaW5jZSBuYW1lX3Nob3cgY2Fubm90IGJlIHJlYWQgd2l0aG91dCBjb25maXJtYXRpb25zXG4gICAgICAgICAgICAgICAgICAmJiB0eC5uYW1lLnN0YXJ0c1dpdGgoXCJkb2k6IFwiK1RYX05BTUVfU1RBUlQpICAvL2hlcmUgJ2RvaTogZS94eHh4JyBpcyBhbHJlYWR5IHdyaXR0ZW4gaW4gdGhlIGJsb2NrXG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgIGFkZHJlc3NUeHMuZm9yRWFjaCh0eCA9PiB7XG4gICAgICAgICAgICAgICAgICBsb2dDb25maXJtKFwidHg6XCIsdHgpO1xuICAgICAgICAgICAgICAgICAgdmFyIHR4TmFtZSA9IHR4Lm5hbWUuc3Vic3RyaW5nKChcImRvaTogXCIrVFhfTkFNRV9TVEFSVCkubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICAgIGxvZ0NvbmZpcm0oXCJleGN1dGluZyBuYW1lX3Nob3cgaW4gb3JkZXIgdG8gZ2V0IHZhbHVlIG9mIG5hbWVJZDpcIiwgdHhOYW1lKTtcbiAgICAgICAgICAgICAgICAgIGNvbnN0IGV0eSA9IG5hbWVTaG93KENPTkZJUk1fQ0xJRU5ULCB0eE5hbWUpO1xuICAgICAgICAgICAgICAgICAgbG9nQ29uZmlybShcIm5hbWVTaG93OiB2YWx1ZVwiLGV0eSk7XG4gICAgICAgICAgICAgICAgICBpZighZXR5KXtcbiAgICAgICAgICAgICAgICAgICAgICBsb2dDb25maXJtKFwiY291bGRuJ3QgZmluZCBuYW1lIC0gb2J2aW91c2x5IG5vdCAoeWV0PyEpIGNvbmZpcm1lZCBpbiBibG9ja2NoYWluOlwiLCBldHkpO1xuICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIGFkZFR4KHR4TmFtZSwgZXR5LnZhbHVlLHR4LmFkZHJlc3MsdHgudHhpZCk7IC8vVE9ETyBldHkudmFsdWUuZnJvbSBpcyBtYXliZSBOT1QgZXhpc3RpbmcgYmVjYXVzZSBvZiB0aGlzIGl0cyAgKG1heWJlKSBvbnQgd29ya2luZy4uLlxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgYWRkT3JVcGRhdGVNZXRhKHtrZXk6IExBU1RfQ0hFQ0tFRF9CTE9DS19LRVksIHZhbHVlOiBsYXN0Q2hlY2tlZEJsb2NrfSk7XG4gICAgICAgICAgICAgIGxvZ0NvbmZpcm0oXCJUcmFuc2FjdGlvbnMgdXBkYXRlZCAtIGxhc3RDaGVja2VkQmxvY2s6XCIsbGFzdENoZWNrZWRCbG9jayk7XG4gICAgICAgICAgICAgIGpvYi5kb25lKCk7XG4gICAgICAgICAgfSBjYXRjaChleGNlcHRpb24pIHtcbiAgICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignbmFtZWNvaW4uY2hlY2tOZXdUcmFuc2FjdGlvbnMuZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgICAgICAgICB9XG5cbiAgICAgIH1lbHNle1xuICAgICAgICAgIGxvZ0NvbmZpcm0oXCJ0eGlkOiBcIit0eGlkK1wiIHdhcyB0cmlnZ2VyZWQgYnkgd2FsbGV0bm90aWZ5IGZvciBhZGRyZXNzOlwiLENPTkZJUk1fQUREUkVTUyk7XG5cbiAgICAgICAgICBjb25zdCByZXQgPSBnZXRSYXdUcmFuc2FjdGlvbihDT05GSVJNX0NMSUVOVCwgdHhpZCk7XG4gICAgICAgICAgY29uc3QgdHhzID0gcmV0LnZvdXQ7XG5cbiAgICAgICAgICBpZighcmV0IHx8ICF0eHMgfHwgIXR4cy5sZW5ndGg9PT0wKXtcbiAgICAgICAgICAgICAgbG9nQ29uZmlybShcInR4aWQgXCIrdHhpZCsnIGRvZXMgbm90IGNvbnRhaW4gdHJhbnNhY3Rpb24gZGV0YWlscyBvciB0cmFuc2FjdGlvbiBub3QgZm91bmQuJyk7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAvLyBsb2dDb25maXJtKCdub3cgY2hlY2tpbmcgcmF3IHRyYW5zYWN0aW9ucyB3aXRoIGZpbHRlcjonLHR4cyk7XG5cbiAgICAgICAgICBjb25zdCBhZGRyZXNzVHhzID0gdHhzLmZpbHRlcih0eCA9PlxuICAgICAgICAgICAgICB0eC5zY3JpcHRQdWJLZXkgIT09IHVuZGVmaW5lZFxuICAgICAgICAgICAgICAmJiB0eC5zY3JpcHRQdWJLZXkubmFtZU9wICE9PSB1bmRlZmluZWRcbiAgICAgICAgICAgICAgJiYgdHguc2NyaXB0UHViS2V5Lm5hbWVPcC5vcCA9PT0gXCJuYW1lX2RvaVwiXG4gICAgICAgICAgICAvLyAgJiYgdHguc2NyaXB0UHViS2V5LmFkZHJlc3Nlc1swXSA9PT0gQ09ORklSTV9BRERSRVNTIC8vb25seSBvd24gdHJhbnNhY3Rpb24gc2hvdWxkIGFycml2ZSBoZXJlLiAtIHNvIGNoZWNrIG9uIG93biBhZGRyZXNzIHVubmVjY2VzYXJ5XG4gICAgICAgICAgICAgICYmIHR4LnNjcmlwdFB1YktleS5uYW1lT3AubmFtZSAhPT0gdW5kZWZpbmVkXG4gICAgICAgICAgICAgICYmIHR4LnNjcmlwdFB1YktleS5uYW1lT3AubmFtZS5zdGFydHNXaXRoKFRYX05BTUVfU1RBUlQpXG4gICAgICAgICAgKTtcblxuICAgICAgICAgIC8vbG9nQ29uZmlybShcImZvdW5kIG5hbWVfb3AgdHJhbnNhY3Rpb25zOlwiLCBhZGRyZXNzVHhzKTtcbiAgICAgICAgICBhZGRyZXNzVHhzLmZvckVhY2godHggPT4ge1xuICAgICAgICAgICAgICBhZGRUeCh0eC5zY3JpcHRQdWJLZXkubmFtZU9wLm5hbWUsIHR4LnNjcmlwdFB1YktleS5uYW1lT3AudmFsdWUsdHguc2NyaXB0UHViS2V5LmFkZHJlc3Nlc1swXSx0eGlkKTtcbiAgICAgICAgICB9KTtcbiAgICAgIH1cbiAgfSBjYXRjaChleGNlcHRpb24pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdkb2ljaGFpbi5jaGVja05ld1RyYW5zYWN0aW9ucy5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9XG4gIHJldHVybiB0cnVlO1xufTtcblxuXG5mdW5jdGlvbiBhZGRUeChuYW1lLCB2YWx1ZSwgYWRkcmVzcywgdHhpZCkge1xuICAgIGNvbnN0IHR4TmFtZSA9IG5hbWUuc3Vic3RyaW5nKFRYX05BTUVfU1RBUlQubGVuZ3RoKTtcblxuICAgIGFkZERvaWNoYWluRW50cnkoe1xuICAgICAgICBuYW1lOiB0eE5hbWUsXG4gICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgYWRkcmVzczogYWRkcmVzcyxcbiAgICAgICAgdHhJZDogdHhpZFxuICAgIH0pO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjaGVja05ld1RyYW5zYWN0aW9uO1xuXG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcbmltcG9ydCBjcnlwdG8gZnJvbSAnY3J5cHRvJztcbmltcG9ydCBlY2llcyBmcm9tICdzdGFuZGFyZC1lY2llcyc7XG5cbmNvbnN0IERlY3J5cHRNZXNzYWdlU2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIHByaXZhdGVLZXk6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfSxcbiAgbWVzc2FnZToge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9XG59KTtcblxuY29uc3QgZGVjcnlwdE1lc3NhZ2UgPSAoZGF0YSkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IG91ckRhdGEgPSBkYXRhO1xuICAgIERlY3J5cHRNZXNzYWdlU2NoZW1hLnZhbGlkYXRlKG91ckRhdGEpO1xuICAgIGNvbnN0IHByaXZhdGVLZXkgPSBCdWZmZXIuZnJvbShvdXJEYXRhLnByaXZhdGVLZXksICdoZXgnKTtcbiAgICBjb25zdCBlY2RoID0gY3J5cHRvLmNyZWF0ZUVDREgoJ3NlY3AyNTZrMScpO1xuICAgIGVjZGguc2V0UHJpdmF0ZUtleShwcml2YXRlS2V5KTtcbiAgICBjb25zdCBtZXNzYWdlID0gQnVmZmVyLmZyb20ob3VyRGF0YS5tZXNzYWdlLCAnaGV4Jyk7XG4gICAgcmV0dXJuIGVjaWVzLmRlY3J5cHQoZWNkaCwgbWVzc2FnZSkudG9TdHJpbmcoJ3V0ZjgnKTtcbiAgfSBjYXRjaChleGNlcHRpb24pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdkb2ljaGFpbi5kZWNyeXB0TWVzc2FnZS5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBkZWNyeXB0TWVzc2FnZTtcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tICdzaW1wbC1zY2hlbWEnO1xuaW1wb3J0IGVjaWVzIGZyb20gJ3N0YW5kYXJkLWVjaWVzJztcblxuY29uc3QgRW5jcnlwdE1lc3NhZ2VTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgcHVibGljS2V5OiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH0sXG4gIG1lc3NhZ2U6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfVxufSk7XG5cbmNvbnN0IGVuY3J5cHRNZXNzYWdlID0gKGRhdGEpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBvdXJEYXRhID0gZGF0YTtcbiAgICBFbmNyeXB0TWVzc2FnZVNjaGVtYS52YWxpZGF0ZShvdXJEYXRhKTtcbiAgICBjb25zdCBwdWJsaWNLZXkgPSBCdWZmZXIuZnJvbShvdXJEYXRhLnB1YmxpY0tleSwgJ2hleCcpO1xuICAgIGNvbnN0IG1lc3NhZ2UgPSBCdWZmZXIuZnJvbShvdXJEYXRhLm1lc3NhZ2UpO1xuICAgIHJldHVybiBlY2llcy5lbmNyeXB0KHB1YmxpY0tleSwgbWVzc2FnZSkudG9TdHJpbmcoJ2hleCcpO1xuICB9IGNhdGNoKGV4Y2VwdGlvbikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2RvaWNoYWluLmVuY3J5cHRNZXNzYWdlLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGVuY3J5cHRNZXNzYWdlO1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XG5pbXBvcnQgeyBPcHRJbnMgfSBmcm9tICcuLi8uLi8uLi9hcGkvb3B0LWlucy9vcHQtaW5zLmpzJztcbmltcG9ydCBnZXRLZXlQYWlyIGZyb20gJy4vZ2V0X2tleS1wYWlyLmpzJztcbmltcG9ydCB7bG9nU2VuZH0gZnJvbSBcIi4uLy4uLy4uL3N0YXJ0dXAvc2VydmVyL2xvZy1jb25maWd1cmF0aW9uXCI7XG5cbmNvbnN0IEdlbmVyYXRlTmFtZUlkU2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIGlkOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH0sXG4gIG1hc3RlckRvaToge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgb3B0aW9uYWw6IHRydWVcbiAgfSxcbiAgaW5kZXg6IHtcbiAgICAgIHR5cGU6IFNpbXBsZVNjaGVtYS5JbnRlZ2VyLFxuICAgICAgb3B0aW9uYWw6IHRydWVcbiAgfVxufSk7XG5cbmNvbnN0IGdlbmVyYXRlTmFtZUlkID0gKG9wdEluKSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3Qgb3VyT3B0SW4gPSBvcHRJbjtcbiAgICBHZW5lcmF0ZU5hbWVJZFNjaGVtYS52YWxpZGF0ZShvdXJPcHRJbik7XG4gICAgbGV0IG5hbWVJZDtcbiAgICBpZihvcHRJbi5tYXN0ZXJEb2kpe1xuICAgICAgICBuYW1lSWQgPSBvdXJPcHRJbi5tYXN0ZXJEb2krXCItXCIrb3VyT3B0SW4uaW5kZXg7XG4gICAgICAgIGxvZ1NlbmQoXCJ1c2VkIG1hc3Rlcl9kb2kgYXMgbmFtZUlkIGluZGV4IFwiK29wdEluLmluZGV4K1wic3RvcmFnZTpcIixuYW1lSWQpO1xuICAgIH1cbiAgICBlbHNle1xuICAgICAgICBuYW1lSWQgPSBnZXRLZXlQYWlyKCkucHJpdmF0ZUtleTtcbiAgICAgICAgbG9nU2VuZChcImdlbmVyYXRlZCBuYW1lSWQgZm9yIGRvaWNoYWluIHN0b3JhZ2U6XCIsbmFtZUlkKTtcbiAgICB9XG5cbiAgICBPcHRJbnMudXBkYXRlKHtfaWQgOiBvdXJPcHRJbi5pZH0sIHskc2V0OntuYW1lSWQ6IG5hbWVJZH19KTtcblxuICAgIHJldHVybiBuYW1lSWQ7XG4gIH0gY2F0Y2goZXhjZXB0aW9uKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZG9pY2hhaW4uZ2VuZXJhdGVOYW1lSWQuZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgZ2VuZXJhdGVOYW1lSWQ7XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcbmltcG9ydCBDcnlwdG9KUyBmcm9tICdjcnlwdG8tanMnO1xuaW1wb3J0IEJhc2U1OCBmcm9tICdiczU4JztcbmltcG9ydCB7IGlzUmVndGVzdCB9IGZyb20gJy4uLy4uLy4uL3N0YXJ0dXAvc2VydmVyL2RhcHAtY29uZmlndXJhdGlvbi5qcyc7XG5pbXBvcnQge2lzVGVzdG5ldH0gZnJvbSBcIi4uLy4uLy4uL3N0YXJ0dXAvc2VydmVyL2RhcHAtY29uZmlndXJhdGlvblwiO1xuXG5jb25zdCBWRVJTSU9OX0JZVEUgPSAweDM0O1xuY29uc3QgVkVSU0lPTl9CWVRFX1JFR1RFU1QgPSAweDZmO1xuY29uc3QgR2V0QWRkcmVzc1NjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICBwdWJsaWNLZXk6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfVxufSk7XG5cbmNvbnN0IGdldEFkZHJlc3MgPSAoZGF0YSkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IG91ckRhdGEgPSBkYXRhO1xuICAgIEdldEFkZHJlc3NTY2hlbWEudmFsaWRhdGUob3VyRGF0YSk7XG4gICAgcmV0dXJuIF9nZXRBZGRyZXNzKG91ckRhdGEucHVibGljS2V5KTtcbiAgfSBjYXRjaChleGNlcHRpb24pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdkb2ljaGFpbi5nZXRBZGRyZXNzLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIF9nZXRBZGRyZXNzKHB1YmxpY0tleSkge1xuICBjb25zdCBwdWJLZXkgPSBDcnlwdG9KUy5saWIuV29yZEFycmF5LmNyZWF0ZShCdWZmZXIuZnJvbShwdWJsaWNLZXksICdoZXgnKSk7XG4gIGxldCBrZXkgPSBDcnlwdG9KUy5TSEEyNTYocHViS2V5KTtcbiAga2V5ID0gQ3J5cHRvSlMuUklQRU1EMTYwKGtleSk7XG4gIGxldCB2ZXJzaW9uQnl0ZSA9IFZFUlNJT05fQllURTtcbiAgaWYoaXNSZWd0ZXN0KCkgfHwgaXNUZXN0bmV0KCkpIHZlcnNpb25CeXRlID0gVkVSU0lPTl9CWVRFX1JFR1RFU1Q7XG4gIGxldCBhZGRyZXNzID0gQnVmZmVyLmNvbmNhdChbQnVmZmVyLmZyb20oW3ZlcnNpb25CeXRlXSksIEJ1ZmZlci5mcm9tKGtleS50b1N0cmluZygpLCAnaGV4JyldKTtcbiAga2V5ID0gQ3J5cHRvSlMuU0hBMjU2KENyeXB0b0pTLmxpYi5Xb3JkQXJyYXkuY3JlYXRlKGFkZHJlc3MpKTtcbiAga2V5ID0gQ3J5cHRvSlMuU0hBMjU2KGtleSk7XG4gIGxldCBjaGVja3N1bSA9IGtleS50b1N0cmluZygpLnN1YnN0cmluZygwLCA4KTtcbiAgYWRkcmVzcyA9IG5ldyBCdWZmZXIoYWRkcmVzcy50b1N0cmluZygnaGV4JykrY2hlY2tzdW0sJ2hleCcpO1xuICBhZGRyZXNzID0gQmFzZTU4LmVuY29kZShhZGRyZXNzKTtcbiAgcmV0dXJuIGFkZHJlc3M7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGdldEFkZHJlc3M7XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCB7IGdldEJhbGFuY2UgfSBmcm9tICcuLi8uLi8uLi8uLi9zZXJ2ZXIvYXBpL2RvaWNoYWluLmpzJztcbmltcG9ydCB7IENPTkZJUk1fQ0xJRU5UfSBmcm9tICcuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9kb2ljaGFpbi1jb25maWd1cmF0aW9uLmpzJztcblxuXG5jb25zdCBnZXRfQmFsYW5jZSA9ICgpID0+IHtcbiAgICBcbiAgdHJ5IHtcbiAgICBjb25zdCBiYWw9Z2V0QmFsYW5jZShDT05GSVJNX0NMSUVOVCk7XG4gICAgcmV0dXJuIGJhbDtcbiAgICBcbiAgfSBjYXRjaChleGNlcHRpb24pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdkb2ljaGFpbi5nZXRCYWxhbmNlLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBnZXRfQmFsYW5jZTtcblxuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgQ3J5cHRvSlMgZnJvbSAnY3J5cHRvLWpzJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcblxuY29uc3QgR2V0RGF0YUhhc2hTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgZGF0YToge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9XG59KTtcblxuY29uc3QgZ2V0RGF0YUhhc2ggPSAoZGF0YSkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IG91ckRhdGEgPSBkYXRhO1xuICAgICAgR2V0RGF0YUhhc2hTY2hlbWEudmFsaWRhdGUob3VyRGF0YSk7XG4gICAgY29uc3QgaGFzaCA9IENyeXB0b0pTLlNIQTI1NihvdXJEYXRhKS50b1N0cmluZygpO1xuICAgIHJldHVybiBoYXNoO1xuICB9IGNhdGNoKGV4Y2VwdGlvbikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2RvaWNoYWluLmdldERhdGFIYXNoLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGdldERhdGFIYXNoO1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgeyByYW5kb21CeXRlcyB9IGZyb20gJ2NyeXB0byc7XG5pbXBvcnQgc2VjcDI1NmsxIGZyb20gJ3NlY3AyNTZrMSc7XG5cbmNvbnN0IGdldEtleVBhaXIgPSAoKSA9PiB7XG4gIHRyeSB7XG4gICAgbGV0IHByaXZLZXlcbiAgICBkbyB7cHJpdktleSA9IHJhbmRvbUJ5dGVzKDMyKX0gd2hpbGUoIXNlY3AyNTZrMS5wcml2YXRlS2V5VmVyaWZ5KHByaXZLZXkpKVxuICAgIGNvbnN0IHByaXZhdGVLZXkgPSBwcml2S2V5O1xuICAgIGNvbnN0IHB1YmxpY0tleSA9IHNlY3AyNTZrMS5wdWJsaWNLZXlDcmVhdGUocHJpdmF0ZUtleSk7XG4gICAgcmV0dXJuIHtcbiAgICAgIHByaXZhdGVLZXk6IHByaXZhdGVLZXkudG9TdHJpbmcoJ2hleCcpLnRvVXBwZXJDYXNlKCksXG4gICAgICBwdWJsaWNLZXk6IHB1YmxpY0tleS50b1N0cmluZygnaGV4JykudG9VcHBlckNhc2UoKVxuICAgIH1cbiAgfSBjYXRjaChleGNlcHRpb24pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdkb2ljaGFpbi5nZXRLZXlQYWlyLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGdldEtleVBhaXI7XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcbmltcG9ydCBCYXNlNTggZnJvbSAnYnM1OCc7XG5cbmNvbnN0IEdldFByaXZhdGVLZXlGcm9tV2lmU2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIHdpZjoge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9XG59KTtcblxuY29uc3QgZ2V0UHJpdmF0ZUtleUZyb21XaWYgPSAoZGF0YSkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IG91ckRhdGEgPSBkYXRhO1xuICAgIEdldFByaXZhdGVLZXlGcm9tV2lmU2NoZW1hLnZhbGlkYXRlKG91ckRhdGEpO1xuICAgIHJldHVybiBfZ2V0UHJpdmF0ZUtleUZyb21XaWYob3VyRGF0YS53aWYpO1xuICB9IGNhdGNoKGV4Y2VwdGlvbikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2RvaWNoYWluLmdldFByaXZhdGVLZXlGcm9tV2lmLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIF9nZXRQcml2YXRlS2V5RnJvbVdpZih3aWYpIHtcbiAgdmFyIHByaXZhdGVLZXkgPSBCYXNlNTguZGVjb2RlKHdpZikudG9TdHJpbmcoJ2hleCcpO1xuICBwcml2YXRlS2V5ID0gcHJpdmF0ZUtleS5zdWJzdHJpbmcoMiwgcHJpdmF0ZUtleS5sZW5ndGggLSA4KTtcbiAgaWYocHJpdmF0ZUtleS5sZW5ndGggPT09IDY2ICYmIHByaXZhdGVLZXkuZW5kc1dpdGgoXCIwMVwiKSkge1xuICAgIHByaXZhdGVLZXkgPSBwcml2YXRlS2V5LnN1YnN0cmluZygwLCBwcml2YXRlS2V5Lmxlbmd0aCAtIDIpO1xuICB9XG4gIHJldHVybiBwcml2YXRlS2V5O1xufVxuXG5leHBvcnQgZGVmYXVsdCBnZXRQcml2YXRlS2V5RnJvbVdpZjtcbiIsImltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcbmltcG9ydCB7bG9nU2VuZH0gZnJvbSBcIi4uLy4uLy4uL3N0YXJ0dXAvc2VydmVyL2xvZy1jb25maWd1cmF0aW9uXCI7XG5cbmltcG9ydCBnZXRPcHRJbktleSBmcm9tIFwiLi4vZG5zL2dldF9vcHQtaW4ta2V5XCI7XG5pbXBvcnQgZ2V0T3B0SW5Qcm92aWRlciBmcm9tIFwiLi4vZG5zL2dldF9vcHQtaW4tcHJvdmlkZXJcIjtcbmltcG9ydCBnZXRBZGRyZXNzIGZyb20gXCIuL2dldF9hZGRyZXNzXCI7XG5cbmNvbnN0IEdldFB1YmxpY0tleVNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICAgIGRvbWFpbjoge1xuICAgICAgICB0eXBlOiBTdHJpbmdcbiAgICB9XG59KTtcblxuY29uc3QgZ2V0UHVibGljS2V5QW5kQWRkcmVzcyA9IChkYXRhKSA9PiB7XG5cbiAgICBjb25zdCBvdXJEYXRhID0gZGF0YTtcbiAgICBHZXRQdWJsaWNLZXlTY2hlbWEudmFsaWRhdGUob3VyRGF0YSk7XG5cbiAgICBsZXQgcHVibGljS2V5ID0gZ2V0T3B0SW5LZXkoe2RvbWFpbjogb3VyRGF0YS5kb21haW59KTtcbiAgICBpZighcHVibGljS2V5KXtcbiAgICAgICAgY29uc3QgcHJvdmlkZXIgPSBnZXRPcHRJblByb3ZpZGVyKHtkb21haW46IG91ckRhdGEuZG9tYWlufSk7XG4gICAgICAgIGxvZ1NlbmQoXCJ1c2luZyBkb2ljaGFpbiBwcm92aWRlciBpbnN0ZWFkIG9mIGRpcmVjdGx5IGNvbmZpZ3VyZWQgcHVibGljS2V5OlwiLHtwcm92aWRlcjpwcm92aWRlcn0pO1xuICAgICAgICBwdWJsaWNLZXkgPSBnZXRPcHRJbktleSh7ZG9tYWluOiBwcm92aWRlcn0pOyAvL2dldCBwdWJsaWMga2V5IGZyb20gcHJvdmlkZXIgb3IgZmFsbGJhY2sgaWYgcHVibGlja2V5IHdhcyBub3Qgc2V0IGluIGRuc1xuICAgIH1cbiAgICBjb25zdCBkZXN0QWRkcmVzcyA9ICBnZXRBZGRyZXNzKHtwdWJsaWNLZXk6IHB1YmxpY0tleX0pO1xuICAgIGxvZ1NlbmQoJ3B1YmxpY0tleSBhbmQgZGVzdEFkZHJlc3MgJywge3B1YmxpY0tleTpwdWJsaWNLZXksZGVzdEFkZHJlc3M6ZGVzdEFkZHJlc3N9KTtcbiAgICByZXR1cm4ge3B1YmxpY0tleTpwdWJsaWNLZXksZGVzdEFkZHJlc3M6ZGVzdEFkZHJlc3N9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgZ2V0UHVibGljS2V5QW5kQWRkcmVzczsiLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcbmltcG9ydCBiaXRjb3JlIGZyb20gJ2JpdGNvcmUtbGliJztcbmltcG9ydCBNZXNzYWdlIGZyb20gJ2JpdGNvcmUtbWVzc2FnZSc7XG5cbmNvbnN0IEdldFNpZ25hdHVyZVNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICBtZXNzYWdlOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH0sXG4gIHByaXZhdGVLZXk6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfVxufSk7XG5cbmNvbnN0IGdldFNpZ25hdHVyZSA9IChkYXRhKSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3Qgb3VyRGF0YSA9IGRhdGE7XG4gICAgR2V0U2lnbmF0dXJlU2NoZW1hLnZhbGlkYXRlKG91ckRhdGEpO1xuICAgIGNvbnN0IHNpZ25hdHVyZSA9IE1lc3NhZ2Uob3VyRGF0YS5tZXNzYWdlKS5zaWduKG5ldyBiaXRjb3JlLlByaXZhdGVLZXkob3VyRGF0YS5wcml2YXRlS2V5KSk7XG4gICAgcmV0dXJuIHNpZ25hdHVyZTtcbiAgfSBjYXRjaChleGNlcHRpb24pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdkb2ljaGFpbi5nZXRTaWduYXR1cmUuZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgZ2V0U2lnbmF0dXJlO1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XG5pbXBvcnQgeyBTRU5EX0NMSUVOVCB9IGZyb20gJy4uLy4uLy4uL3N0YXJ0dXAvc2VydmVyL2RvaWNoYWluLWNvbmZpZ3VyYXRpb24uanMnO1xuaW1wb3J0IGVuY3J5cHRNZXNzYWdlIGZyb20gXCIuL2VuY3J5cHRfbWVzc2FnZVwiO1xuaW1wb3J0IHtnZXRVcmx9IGZyb20gXCIuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9kYXBwLWNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7bG9nQmxvY2tjaGFpbiwgbG9nU2VuZH0gZnJvbSBcIi4uLy4uLy4uL3N0YXJ0dXAvc2VydmVyL2xvZy1jb25maWd1cmF0aW9uXCI7XG5pbXBvcnQge2ZlZURvaSxuYW1lRG9pfSBmcm9tIFwiLi4vLi4vLi4vLi4vc2VydmVyL2FwaS9kb2ljaGFpblwiO1xuaW1wb3J0IHtPcHRJbnN9IGZyb20gXCIuLi8uLi8uLi9hcGkvb3B0LWlucy9vcHQtaW5zXCI7XG5pbXBvcnQgZ2V0UHVibGljS2V5QW5kQWRkcmVzcyBmcm9tIFwiLi9nZXRfcHVibGlja2V5X2FuZF9hZGRyZXNzX2J5X2RvbWFpblwiO1xuXG5cbmNvbnN0IEluc2VydFNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICBuYW1lSWQ6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfSxcbiAgc2lnbmF0dXJlOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH0sXG4gIGRhdGFIYXNoOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH0sXG4gIGRvbWFpbjoge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9LFxuICBzb2lEYXRlOiB7XG4gICAgdHlwZTogRGF0ZVxuICB9XG59KTtcblxuY29uc3QgaW5zZXJ0ID0gKGRhdGEpID0+IHtcbiAgY29uc3Qgb3VyRGF0YSA9IGRhdGE7XG4gIHRyeSB7XG4gICAgSW5zZXJ0U2NoZW1hLnZhbGlkYXRlKG91ckRhdGEpO1xuICAgIGxvZ1NlbmQoXCJkb21haW46XCIsb3VyRGF0YS5kb21haW4pO1xuXG4gICAgY29uc3QgcHVibGljS2V5QW5kQWRkcmVzcyA9IGdldFB1YmxpY0tleUFuZEFkZHJlc3Moe2RvbWFpbjpvdXJEYXRhLmRvbWFpbn0pO1xuICAgIGNvbnN0IGZyb20gPSBlbmNyeXB0TWVzc2FnZSh7cHVibGljS2V5OiBwdWJsaWNLZXlBbmRBZGRyZXNzLnB1YmxpY0tleSwgbWVzc2FnZTogZ2V0VXJsKCl9KTtcbiAgICBsb2dTZW5kKCdlbmNyeXB0ZWQgdXJsIGZvciB1c2UgYWQgZnJvbSBpbiBkb2ljaGFpbiB2YWx1ZTonLGdldFVybCgpLGZyb20pO1xuXG4gICAgY29uc3QgbmFtZVZhbHVlID0gSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICBzaWduYXR1cmU6IG91ckRhdGEuc2lnbmF0dXJlLFxuICAgICAgICBkYXRhSGFzaDogb3VyRGF0YS5kYXRhSGFzaCxcbiAgICAgICAgZnJvbTogZnJvbVxuICAgIH0pO1xuXG4gICAgLy9UT0RPICghKSB0aGlzIG11c3QgYmUgcmVwbGFjZWQgaW4gZnV0dXJlIGJ5IFwiYXRvbWljIG5hbWUgdHJhZGluZyBleGFtcGxlXCIgaHR0cHM6Ly93aWtpLm5hbWVjb2luLmluZm8vP3RpdGxlPUF0b21pY19OYW1lLVRyYWRpbmdcbiAgICBsb2dCbG9ja2NoYWluKCdzZW5kaW5nIGEgZmVlIHRvIGJvYiBzbyBoZSBjYW4gcGF5IHRoZSBkb2kgc3RvcmFnZSAoZGVzdEFkZHJlc3MpOicsIHB1YmxpY0tleUFuZEFkZHJlc3MuZGVzdEFkZHJlc3MpO1xuICAgIGNvbnN0IGZlZURvaVR4ID0gZmVlRG9pKFNFTkRfQ0xJRU5ULCBwdWJsaWNLZXlBbmRBZGRyZXNzLmRlc3RBZGRyZXNzKTtcbiAgICBsb2dCbG9ja2NoYWluKCdmZWUgc2VuZCB0eGlkIHRvIGRlc3RhZGRyZXNzJywgZmVlRG9pVHgsIHB1YmxpY0tleUFuZEFkZHJlc3MuZGVzdEFkZHJlc3MpO1xuXG4gICAgbG9nQmxvY2tjaGFpbignYWRkaW5nIGRhdGEgdG8gYmxvY2tjaGFpbiB2aWEgbmFtZV9kb2kgKG5hbWVJZCx2YWx1ZSxkZXN0QWRkcmVzcyk6Jywgb3VyRGF0YS5uYW1lSWQsbmFtZVZhbHVlLHB1YmxpY0tleUFuZEFkZHJlc3MuZGVzdEFkZHJlc3MpO1xuICAgIGNvbnN0IG5hbWVEb2lUeCA9IG5hbWVEb2koU0VORF9DTElFTlQsIG91ckRhdGEubmFtZUlkLCBuYW1lVmFsdWUsIHB1YmxpY0tleUFuZEFkZHJlc3MuZGVzdEFkZHJlc3MpO1xuICAgIGxvZ0Jsb2NrY2hhaW4oJ25hbWVfZG9pIGFkZGVkIGJsb2NrY2hhaW4uIHR4aWQ6JywgbmFtZURvaVR4KTtcblxuICAgIE9wdElucy51cGRhdGUoe25hbWVJZDogb3VyRGF0YS5uYW1lSWR9LCB7JHNldDoge3R4SWQ6bmFtZURvaVR4fX0pO1xuICAgIGxvZ0Jsb2NrY2hhaW4oJ3VwZGF0aW5nIE9wdEluIGxvY2FsbHkgd2l0aDonLCB7bmFtZUlkOiBvdXJEYXRhLm5hbWVJZCwgdHhJZDogbmFtZURvaVR4fSk7XG5cbiAgfSBjYXRjaChleGNlcHRpb24pIHtcbiAgICAgIE9wdElucy51cGRhdGUoe25hbWVJZDogb3VyRGF0YS5uYW1lSWR9LCB7JHNldDoge2Vycm9yOkpTT04uc3RyaW5naWZ5KGV4Y2VwdGlvbi5tZXNzYWdlKX19KTtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdkb2ljaGFpbi5pbnNlcnQuZXhjZXB0aW9uJywgZXhjZXB0aW9uKTsgLy9UT0RPIHVwZGF0ZSBvcHQtaW4gaW4gbG9jYWwgZGIgdG8gaW5mb3JtIHVzZXIgYWJvdXQgdGhlIGVycm9yISBlLmcuIEluc3VmZmljaWVudCBmdW5kcyBldGMuXG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGluc2VydDtcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tICdzaW1wbC1zY2hlbWEnO1xuaW1wb3J0IHsgQ09ORklSTV9DTElFTlQgfSBmcm9tICcuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9kb2ljaGFpbi1jb25maWd1cmF0aW9uLmpzJztcbmltcG9ydCB7Z2V0V2lmLCBzaWduTWVzc2FnZSwgZ2V0VHJhbnNhY3Rpb24sIG5hbWVEb2ksIG5hbWVTaG93fSBmcm9tIFwiLi4vLi4vLi4vLi4vc2VydmVyL2FwaS9kb2ljaGFpblwiO1xuaW1wb3J0IHtBUElfUEFUSCwgRE9JX0NPTkZJUk1BVElPTl9OT1RJRllfUk9VVEUsIFZFUlNJT059IGZyb20gXCIuLi8uLi8uLi8uLi9zZXJ2ZXIvYXBpL3Jlc3QvcmVzdFwiO1xuaW1wb3J0IHtDT05GSVJNX0FERFJFU1N9IGZyb20gXCIuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9kb2ljaGFpbi1jb25maWd1cmF0aW9uXCI7XG5pbXBvcnQge2dldEh0dHBQVVR9IGZyb20gXCIuLi8uLi8uLi8uLi9zZXJ2ZXIvYXBpL2h0dHBcIjtcbmltcG9ydCB7bG9nQ29uZmlybX0gZnJvbSBcIi4uLy4uLy4uL3N0YXJ0dXAvc2VydmVyL2xvZy1jb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgZ2V0UHJpdmF0ZUtleUZyb21XaWYgZnJvbSBcIi4vZ2V0X3ByaXZhdGUta2V5X2Zyb21fd2lmXCI7XG5pbXBvcnQgZGVjcnlwdE1lc3NhZ2UgZnJvbSBcIi4vZGVjcnlwdF9tZXNzYWdlXCI7XG5pbXBvcnQge09wdEluc30gZnJvbSBcIi4uLy4uLy4uL2FwaS9vcHQtaW5zL29wdC1pbnNcIjtcblxuY29uc3QgVXBkYXRlU2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIG5hbWVJZDoge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9LFxuICB2YWx1ZToge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9LFxuICBob3N0IDoge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgb3B0aW9uYWw6IHRydWUsXG4gIH0sXG4gIGZyb21Ib3N0VXJsIDoge1xuICAgICAgdHlwZTogU3RyaW5nXG4gIH1cbn0pO1xuXG5jb25zdCB1cGRhdGUgPSAoZGF0YSwgam9iKSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3Qgb3VyRGF0YSA9IGRhdGE7XG5cbiAgICBVcGRhdGVTY2hlbWEudmFsaWRhdGUob3VyRGF0YSk7XG5cbiAgICAvL3N0b3AgdGhpcyB1cGRhdGUgdW50aWwgdGhpcyBuYW1lIGFzIGF0IGxlYXN0IDEgY29uZmlybWF0aW9uXG4gICAgY29uc3QgbmFtZV9kYXRhID0gbmFtZVNob3coQ09ORklSTV9DTElFTlQsb3VyRGF0YS5uYW1lSWQpO1xuICAgIGlmKG5hbWVfZGF0YSA9PT0gdW5kZWZpbmVkKXtcbiAgICAgICAgcmVydW4oam9iKTtcbiAgICAgICAgbG9nQ29uZmlybSgnbmFtZSBub3QgdmlzaWJsZSAtIGRlbGF5aW5nIG5hbWUgdXBkYXRlJyxvdXJEYXRhLm5hbWVJZCk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3Qgb3VyX3RyYW5zYWN0aW9uID0gZ2V0VHJhbnNhY3Rpb24oQ09ORklSTV9DTElFTlQsbmFtZV9kYXRhLnR4aWQpO1xuICAgIGlmKG91cl90cmFuc2FjdGlvbi5jb25maXJtYXRpb25zPT09MCl7XG4gICAgICAgIHJlcnVuKGpvYik7XG4gICAgICAgIGxvZ0NvbmZpcm0oJ3RyYW5zYWN0aW9uIGhhcyAwIGNvbmZpcm1hdGlvbnMgLSBkZWxheWluZyBuYW1lIHVwZGF0ZScsSlNPTi5wYXJzZShvdXJEYXRhLnZhbHVlKSk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgbG9nQ29uZmlybSgndXBkYXRpbmcgYmxvY2tjaGFpbiB3aXRoIGRvaVNpZ25hdHVyZTonLEpTT04ucGFyc2Uob3VyRGF0YS52YWx1ZSkpO1xuICAgIGNvbnN0IHdpZiA9IGdldFdpZihDT05GSVJNX0NMSUVOVCwgQ09ORklSTV9BRERSRVNTKTtcbiAgICBjb25zdCBwcml2YXRlS2V5ID0gZ2V0UHJpdmF0ZUtleUZyb21XaWYoe3dpZjogd2lmfSk7XG4gICAgbG9nQ29uZmlybSgnZ290IHByaXZhdGUga2V5ICh3aWxsIG5vdCBzaG93IGl0IGhlcmUpIGluIG9yZGVyIHRvIGRlY3J5cHQgU2VuZC1kQXBwIGhvc3QgdXJsIGZyb20gdmFsdWU6JyxvdXJEYXRhLmZyb21Ib3N0VXJsKTtcbiAgICBjb25zdCBvdXJmcm9tSG9zdFVybCA9IGRlY3J5cHRNZXNzYWdlKHtwcml2YXRlS2V5OiBwcml2YXRlS2V5LCBtZXNzYWdlOiBvdXJEYXRhLmZyb21Ib3N0VXJsfSk7XG4gICAgbG9nQ29uZmlybSgnZGVjcnlwdGVkIGZyb21Ib3N0VXJsJyxvdXJmcm9tSG9zdFVybCk7XG4gICAgY29uc3QgdXJsID0gb3VyZnJvbUhvc3RVcmwrQVBJX1BBVEgrVkVSU0lPTitcIi9cIitET0lfQ09ORklSTUFUSU9OX05PVElGWV9ST1VURTtcblxuICAgIGxvZ0NvbmZpcm0oJ2NyZWF0aW5nIHNpZ25hdHVyZSB3aXRoIEFERFJFU1MnK0NPTkZJUk1fQUREUkVTUytcIiBuYW1lSWQ6XCIsb3VyRGF0YS52YWx1ZSk7XG4gICAgY29uc3Qgc2lnbmF0dXJlID0gc2lnbk1lc3NhZ2UoQ09ORklSTV9DTElFTlQsIENPTkZJUk1fQUREUkVTUywgb3VyRGF0YS5uYW1lSWQpOyAvL1RPRE8gd2h5IGhlcmUgb3ZlciBuYW1lSUQ/XG4gICAgbG9nQ29uZmlybSgnc2lnbmF0dXJlIGNyZWF0ZWQ6JyxzaWduYXR1cmUpO1xuXG4gICAgY29uc3QgdXBkYXRlRGF0YSA9IHtcbiAgICAgICAgbmFtZUlkOiBvdXJEYXRhLm5hbWVJZCxcbiAgICAgICAgc2lnbmF0dXJlOiBzaWduYXR1cmUsXG4gICAgICAgIGhvc3Q6IG91ckRhdGEuaG9zdFxuICAgIH07XG5cbiAgICB0cnkge1xuICAgICAgICBjb25zdCB0eGlkID0gbmFtZURvaShDT05GSVJNX0NMSUVOVCwgb3VyRGF0YS5uYW1lSWQsIG91ckRhdGEudmFsdWUsIG51bGwpO1xuICAgICAgICBsb2dDb25maXJtKCd1cGRhdGUgdHJhbnNhY3Rpb24gdHhpZDonLHR4aWQpO1xuICAgIH1jYXRjaChleGNlcHRpb24pe1xuICAgICAgICAvL1xuICAgICAgICBsb2dDb25maXJtKCd0aGlzIG5hbWVET0kgZG9lc27CtHQgaGF2ZSBhIGJsb2NrIHlldCBhbmQgd2lsbCBiZSB1cGRhdGVkIHdpdGggdGhlIG5leHQgYmxvY2sgYW5kIHdpdGggdGhlIG5leHQgcXVldWUgc3RhcnQ6JyxvdXJEYXRhLm5hbWVJZCk7XG4gICAgICAgIGlmKGV4Y2VwdGlvbi50b1N0cmluZygpLmluZGV4T2YoXCJ0aGVyZSBpcyBhbHJlYWR5IGEgcmVnaXN0cmF0aW9uIGZvciB0aGlzIGRvaSBuYW1lXCIpPT0tMSkge1xuICAgICAgICAgICAgT3B0SW5zLnVwZGF0ZSh7bmFtZUlkOiBvdXJEYXRhLm5hbWVJZH0sIHskc2V0OiB7ZXJyb3I6IEpTT04uc3RyaW5naWZ5KGV4Y2VwdGlvbi5tZXNzYWdlKX19KTtcbiAgICAgICAgfVxuICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdkb2ljaGFpbi51cGRhdGUuZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgICAgICAgLy99ZWxzZXtcbiAgICAgICAgLy8gICAgbG9nQ29uZmlybSgndGhpcyBuYW1lRE9JIGRvZXNuwrR0IGhhdmUgYSBibG9jayB5ZXQgYW5kIHdpbGwgYmUgdXBkYXRlZCB3aXRoIHRoZSBuZXh0IGJsb2NrIGFuZCB3aXRoIHRoZSBuZXh0IHF1ZXVlIHN0YXJ0Oicsb3VyRGF0YS5uYW1lSWQpO1xuICAgICAgICAvL31cbiAgICB9XG5cbiAgICBjb25zdCByZXNwb25zZSA9IGdldEh0dHBQVVQodXJsLCB1cGRhdGVEYXRhKTtcbiAgICBsb2dDb25maXJtKCdpbmZvcm1lZCBzZW5kIGRBcHAgYWJvdXQgY29uZmlybWVkIGRvaSBvbiB1cmw6Jyt1cmwrJyB3aXRoIHVwZGF0ZURhdGEnK0pTT04uc3RyaW5naWZ5KHVwZGF0ZURhdGEpK1wiIHJlc3BvbnNlOlwiLHJlc3BvbnNlLmRhdGEpO1xuICAgIGpvYi5kb25lKCk7XG4gIH0gY2F0Y2goZXhjZXB0aW9uKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZG9pY2hhaW4udXBkYXRlLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIHJlcnVuKGpvYil7XG4gICAgbG9nQ29uZmlybSgncmVydW5uaW5nIHR4aWQgaW4gMTBzZWMgLSBjYW5jZWxpbmcgb2xkIGpvYicsJycpO1xuICAgIGpvYi5jYW5jZWwoKTtcbiAgICBsb2dDb25maXJtKCdyZXN0YXJ0IGJsb2NrY2hhaW4gZG9pIHVwZGF0ZScsJycpO1xuICAgIGpvYi5yZXN0YXJ0KFxuICAgICAgICB7XG4gICAgICAgICAgICAvL3JlcGVhdHM6IDYwMCwgICAvLyBPbmx5IHJlcGVhdCB0aGlzIG9uY2VcbiAgICAgICAgICAgIC8vIFRoaXMgaXMgdGhlIGRlZmF1bHRcbiAgICAgICAgICAgLy8gd2FpdDogMTAwMDAgICAvLyBXYWl0IDEwIHNlYyBiZXR3ZWVuIHJlcGVhdHNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRGVmYXVsdCBpcyBwcmV2aW91cyBzZXR0aW5nXG4gICAgICAgIH0sXG4gICAgICAgIGZ1bmN0aW9uIChlcnIsIHJlc3VsdCkge1xuICAgICAgICAgICAgaWYgKHJlc3VsdCkge1xuICAgICAgICAgICAgICAgIGxvZ0NvbmZpcm0oJ3JlcnVubmluZyB0eGlkIGluIDEwc2VjOicscmVzdWx0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHVwZGF0ZTtcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tICdzaW1wbC1zY2hlbWEnO1xuaW1wb3J0IGJpdGNvcmUgZnJvbSAnYml0Y29yZS1saWInO1xuaW1wb3J0IE1lc3NhZ2UgZnJvbSAnYml0Y29yZS1tZXNzYWdlJztcbmltcG9ydCB7bG9nRXJyb3IsIGxvZ1ZlcmlmeX0gZnJvbSBcIi4uLy4uLy4uL3N0YXJ0dXAvc2VydmVyL2xvZy1jb25maWd1cmF0aW9uXCI7XG5jb25zdCBORVRXT1JLID0gYml0Y29yZS5OZXR3b3Jrcy5hZGQoe1xuICBuYW1lOiAnZG9pY2hhaW4nLFxuICBhbGlhczogJ2RvaWNoYWluJyxcbiAgcHVia2V5aGFzaDogMHgzNCxcbiAgcHJpdmF0ZWtleTogMHhCNCxcbiAgc2NyaXB0aGFzaDogMTMsXG4gIG5ldHdvcmtNYWdpYzogMHhmOWJlYjRmZSxcbn0pO1xuXG5jb25zdCBWZXJpZnlTaWduYXR1cmVTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgZGF0YToge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9LFxuICBwdWJsaWNLZXk6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfSxcbiAgc2lnbmF0dXJlOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH1cbn0pO1xuXG5jb25zdCB2ZXJpZnlTaWduYXR1cmUgPSAoZGF0YSkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IG91ckRhdGEgPSBkYXRhO1xuICAgIGxvZ1ZlcmlmeSgndmVyaWZ5U2lnbmF0dXJlOicsb3VyRGF0YSk7XG4gICAgVmVyaWZ5U2lnbmF0dXJlU2NoZW1hLnZhbGlkYXRlKG91ckRhdGEpO1xuICAgIGNvbnN0IGFkZHJlc3MgPSBiaXRjb3JlLkFkZHJlc3MuZnJvbVB1YmxpY0tleShuZXcgYml0Y29yZS5QdWJsaWNLZXkob3VyRGF0YS5wdWJsaWNLZXkpLCBORVRXT1JLKTtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIE1lc3NhZ2Uob3VyRGF0YS5kYXRhKS52ZXJpZnkoYWRkcmVzcywgb3VyRGF0YS5zaWduYXR1cmUpO1xuICAgIH0gY2F0Y2goZXJyb3IpIHsgbG9nRXJyb3IoZXJyb3IpfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfSBjYXRjaChleGNlcHRpb24pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdkb2ljaGFpbi52ZXJpZnlTaWduYXR1cmUuZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgdmVyaWZ5U2lnbmF0dXJlO1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XG5pbXBvcnQgeyBPcHRJbnMgfSBmcm9tICcuLi8uLi8uLi9hcGkvb3B0LWlucy9vcHQtaW5zLmpzJztcbmltcG9ydCB7IFNlbmRlcnMgfSBmcm9tICcuLi8uLi8uLi9hcGkvc2VuZGVycy9zZW5kZXJzLmpzJztcbmltcG9ydCB7IFJlY2lwaWVudHMgfSBmcm9tICcuLi8uLi8uLi9hcGkvcmVjaXBpZW50cy9yZWNpcGllbnRzLmpzJztcbmltcG9ydCBnZW5lcmF0ZU5hbWVJZCBmcm9tICcuL2dlbmVyYXRlX25hbWUtaWQuanMnO1xuaW1wb3J0IGdldFNpZ25hdHVyZSBmcm9tICcuL2dldF9zaWduYXR1cmUuanMnO1xuaW1wb3J0IGdldERhdGFIYXNoIGZyb20gJy4vZ2V0X2RhdGEtaGFzaC5qcyc7XG5pbXBvcnQgYWRkSW5zZXJ0QmxvY2tjaGFpbkpvYiBmcm9tICcuLi9qb2JzL2FkZF9pbnNlcnRfYmxvY2tjaGFpbi5qcyc7XG5pbXBvcnQge2xvZ1NlbmR9IGZyb20gXCIuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9sb2ctY29uZmlndXJhdGlvblwiO1xuXG5jb25zdCBXcml0ZVRvQmxvY2tjaGFpblNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICBpZDoge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9XG59KTtcblxuY29uc3Qgd3JpdGVUb0Jsb2NrY2hhaW4gPSAoZGF0YSkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IG91ckRhdGEgPSBkYXRhO1xuICAgIFdyaXRlVG9CbG9ja2NoYWluU2NoZW1hLnZhbGlkYXRlKG91ckRhdGEpO1xuXG4gICAgY29uc3Qgb3B0SW4gPSBPcHRJbnMuZmluZE9uZSh7X2lkOiBkYXRhLmlkfSk7XG4gICAgY29uc3QgcmVjaXBpZW50ID0gUmVjaXBpZW50cy5maW5kT25lKHtfaWQ6IG9wdEluLnJlY2lwaWVudH0pO1xuICAgIGNvbnN0IHNlbmRlciA9IFNlbmRlcnMuZmluZE9uZSh7X2lkOiBvcHRJbi5zZW5kZXJ9KTtcbiAgICBsb2dTZW5kKFwib3B0SW4gZGF0YTpcIix7aW5kZXg6b3VyRGF0YS5pbmRleCwgb3B0SW46b3B0SW4scmVjaXBpZW50OnJlY2lwaWVudCxzZW5kZXI6IHNlbmRlcn0pO1xuXG5cbiAgICBjb25zdCBuYW1lSWQgPSBnZW5lcmF0ZU5hbWVJZCh7aWQ6IGRhdGEuaWQsaW5kZXg6b3B0SW4uaW5kZXgsbWFzdGVyRG9pOm9wdEluLm1hc3RlckRvaSB9KTtcbiAgICBjb25zdCBzaWduYXR1cmUgPSBnZXRTaWduYXR1cmUoe21lc3NhZ2U6IHJlY2lwaWVudC5lbWFpbCtzZW5kZXIuZW1haWwsIHByaXZhdGVLZXk6IHJlY2lwaWVudC5wcml2YXRlS2V5fSk7XG4gICAgbG9nU2VuZChcImdlbmVyYXRlZCBzaWduYXR1cmUgZnJvbSBlbWFpbCByZWNpcGllbnQgYW5kIHNlbmRlcjpcIixzaWduYXR1cmUpO1xuXG4gICAgbGV0IGRhdGFIYXNoID0gXCJcIjtcblxuICAgIGlmKG9wdEluLmRhdGEpIHtcbiAgICAgIGRhdGFIYXNoID0gZ2V0RGF0YUhhc2goe2RhdGE6IG9wdEluLmRhdGF9KTtcbiAgICAgIGxvZ1NlbmQoXCJnZW5lcmF0ZWQgZGF0YWhhc2ggZnJvbSBnaXZlbiBkYXRhOlwiLGRhdGFIYXNoKTtcbiAgICB9XG5cbiAgICBjb25zdCBwYXJ0cyA9IHJlY2lwaWVudC5lbWFpbC5zcGxpdChcIkBcIik7XG4gICAgY29uc3QgZG9tYWluID0gcGFydHNbcGFydHMubGVuZ3RoLTFdO1xuICAgIGxvZ1NlbmQoXCJlbWFpbCBkb21haW4gZm9yIHB1YmxpY0tleSByZXF1ZXN0IGlzOlwiLGRvbWFpbik7XG4gICAgYWRkSW5zZXJ0QmxvY2tjaGFpbkpvYih7XG4gICAgICBuYW1lSWQ6IG5hbWVJZCxcbiAgICAgIHNpZ25hdHVyZTogc2lnbmF0dXJlLFxuICAgICAgZGF0YUhhc2g6IGRhdGFIYXNoLFxuICAgICAgZG9tYWluOiBkb21haW4sXG4gICAgICBzb2lEYXRlOiBvcHRJbi5jcmVhdGVkQXRcbiAgICB9KVxuICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdkb2ljaGFpbi53cml0ZVRvQmxvY2tjaGFpbi5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCB3cml0ZVRvQmxvY2tjaGFpblxuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XG5pbXBvcnQgeyBIYXNoSWRzIH0gZnJvbSAnLi4vLi4vLi4vc3RhcnR1cC9zZXJ2ZXIvZW1haWwtY29uZmlndXJhdGlvbi5qcyc7XG5cbmNvbnN0IERlY29kZURvaUhhc2hTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgaGFzaDoge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9XG59KTtcblxuY29uc3QgZGVjb2RlRG9pSGFzaCA9IChoYXNoKSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3Qgb3VySGFzaCA9IGhhc2g7XG4gICAgRGVjb2RlRG9pSGFzaFNjaGVtYS52YWxpZGF0ZShvdXJIYXNoKTtcbiAgICBjb25zdCBoZXggPSBIYXNoSWRzLmRlY29kZUhleChvdXJIYXNoLmhhc2gpO1xuICAgIGlmKCFoZXggfHwgaGV4ID09PSAnJykgdGhyb3cgXCJXcm9uZyBoYXNoXCI7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IG9iaiA9IEpTT04ucGFyc2UoQnVmZmVyKGhleCwgJ2hleCcpLnRvU3RyaW5nKCdhc2NpaScpKTtcbiAgICAgIHJldHVybiBvYmo7XG4gICAgfSBjYXRjaChleGNlcHRpb24pIHt0aHJvdyBcIldyb25nIGhhc2hcIjt9XG4gIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2VtYWlscy5kZWNvZGVfZG9pLWhhc2guZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgZGVjb2RlRG9pSGFzaDtcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tICdzaW1wbC1zY2hlbWEnO1xuaW1wb3J0IHsgSGFzaElkcyB9IGZyb20gJy4uLy4uLy4uL3N0YXJ0dXAvc2VydmVyL2VtYWlsLWNvbmZpZ3VyYXRpb24uanMnO1xuXG5jb25zdCBHZW5lcmF0ZURvaUhhc2hTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgaWQ6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfSxcbiAgdG9rZW46IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfSxcbiAgcmVkaXJlY3Q6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfVxufSk7XG5cbmNvbnN0IGdlbmVyYXRlRG9pSGFzaCA9IChvcHRJbikgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IG91ck9wdEluID0gb3B0SW47XG4gICAgR2VuZXJhdGVEb2lIYXNoU2NoZW1hLnZhbGlkYXRlKG91ck9wdEluKTtcblxuICAgIGNvbnN0IGpzb24gPSBKU09OLnN0cmluZ2lmeSh7XG4gICAgICBpZDogb3VyT3B0SW4uaWQsXG4gICAgICB0b2tlbjogb3VyT3B0SW4udG9rZW4sXG4gICAgICByZWRpcmVjdDogb3VyT3B0SW4ucmVkaXJlY3RcbiAgICB9KTtcblxuICAgIGNvbnN0IGhleCA9IEJ1ZmZlcihqc29uKS50b1N0cmluZygnaGV4Jyk7XG4gICAgY29uc3QgaGFzaCA9IEhhc2hJZHMuZW5jb2RlSGV4KGhleCk7XG4gICAgcmV0dXJuIGhhc2g7XG4gIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2VtYWlscy5nZW5lcmF0ZV9kb2ktaGFzaC5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBnZW5lcmF0ZURvaUhhc2g7XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcbmltcG9ydCB7bG9nQ29uZmlybX0gZnJvbSBcIi4uLy4uLy4uL3N0YXJ0dXAvc2VydmVyL2xvZy1jb25maWd1cmF0aW9uXCI7XG5cbmNvbnN0IFBMQUNFSE9MREVSX1JFR0VYID0gL1xcJHsoW1xcd10qKX0vZztcbmNvbnN0IFBhcnNlVGVtcGxhdGVTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgdGVtcGxhdGU6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gIH0sXG4gIGRhdGE6IHtcbiAgICB0eXBlOiBPYmplY3QsXG4gICAgYmxhY2tib3g6IHRydWVcbiAgfVxufSk7XG5cbmNvbnN0IHBhcnNlVGVtcGxhdGUgPSAoZGF0YSkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IG91ckRhdGEgPSBkYXRhO1xuICAgIC8vbG9nQ29uZmlybSgncGFyc2VUZW1wbGF0ZTonLG91ckRhdGEpO1xuXG4gICAgUGFyc2VUZW1wbGF0ZVNjaGVtYS52YWxpZGF0ZShvdXJEYXRhKTtcbiAgICBsb2dDb25maXJtKCdQYXJzZVRlbXBsYXRlU2NoZW1hIHZhbGlkYXRlZCcpO1xuXG4gICAgdmFyIF9tYXRjaDtcbiAgICB2YXIgdGVtcGxhdGUgPSBvdXJEYXRhLnRlbXBsYXRlO1xuICAgLy9sb2dDb25maXJtKCdkb2luZyBzb21lIHJlZ2V4IHdpdGggdGVtcGxhdGU6Jyx0ZW1wbGF0ZSk7XG5cbiAgICBkbyB7XG4gICAgICBfbWF0Y2ggPSBQTEFDRUhPTERFUl9SRUdFWC5leGVjKHRlbXBsYXRlKTtcbiAgICAgIGlmKF9tYXRjaCkgdGVtcGxhdGUgPSBfcmVwbGFjZVBsYWNlaG9sZGVyKHRlbXBsYXRlLCBfbWF0Y2gsIG91ckRhdGEuZGF0YVtfbWF0Y2hbMV1dKTtcbiAgICB9IHdoaWxlIChfbWF0Y2gpO1xuICAgIHJldHVybiB0ZW1wbGF0ZTtcbiAgfSBjYXRjaCAoZXhjZXB0aW9uKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZW1haWxzLnBhcnNlVGVtcGxhdGUuZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgfVxufTtcblxuZnVuY3Rpb24gX3JlcGxhY2VQbGFjZWhvbGRlcih0ZW1wbGF0ZSwgX21hdGNoLCByZXBsYWNlKSB7XG4gIHZhciByZXAgPSByZXBsYWNlO1xuICBpZihyZXBsYWNlID09PSB1bmRlZmluZWQpIHJlcCA9IFwiXCI7XG4gIHJldHVybiB0ZW1wbGF0ZS5zdWJzdHJpbmcoMCwgX21hdGNoLmluZGV4KStyZXArdGVtcGxhdGUuc3Vic3RyaW5nKF9tYXRjaC5pbmRleCtfbWF0Y2hbMF0ubGVuZ3RoKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgcGFyc2VUZW1wbGF0ZTtcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tICdzaW1wbC1zY2hlbWEnO1xuaW1wb3J0IHtsb2dDb25maXJtfSBmcm9tIFwiLi4vLi4vLi4vc3RhcnR1cC9zZXJ2ZXIvbG9nLWNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IERPSV9NQUlMX0RFRkFVTFRfRU1BSUxfRlJPTSB9IGZyb20gJy4uLy4uLy4uL3N0YXJ0dXAvc2VydmVyL2VtYWlsLWNvbmZpZ3VyYXRpb24uanMnO1xuXG5jb25zdCBTZW5kTWFpbFNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICBmcm9tOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIHJlZ0V4OiBTaW1wbGVTY2hlbWEuUmVnRXguRW1haWxcbiAgfSxcbiAgdG86IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgcmVnRXg6IFNpbXBsZVNjaGVtYS5SZWdFeC5FbWFpbFxuICB9LFxuICBzdWJqZWN0OiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICB9LFxuICBtZXNzYWdlOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICB9LFxuICByZXR1cm5QYXRoOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIHJlZ0V4OiBTaW1wbGVTY2hlbWEuUmVnRXguRW1haWxcbiAgfVxufSk7XG5cbmNvbnN0IHNlbmRNYWlsID0gKG1haWwpID0+IHtcbiAgdHJ5IHtcblxuICAgIG1haWwuZnJvbSA9IERPSV9NQUlMX0RFRkFVTFRfRU1BSUxfRlJPTTtcblxuICAgIGNvbnN0IG91ck1haWwgPSBtYWlsO1xuICAgIGxvZ0NvbmZpcm0oJ3NlbmRpbmcgZW1haWwgd2l0aCBkYXRhOicse3RvOm1haWwudG8sIHN1YmplY3Q6bWFpbC5zdWJqZWN0fSk7XG4gICAgU2VuZE1haWxTY2hlbWEudmFsaWRhdGUob3VyTWFpbCk7XG4gICAgLy9UT0RPOiBUZXh0IGZhbGxiYWNrXG4gICAgRW1haWwuc2VuZCh7XG4gICAgICBmcm9tOiBtYWlsLmZyb20sXG4gICAgICB0bzogbWFpbC50byxcbiAgICAgIHN1YmplY3Q6IG1haWwuc3ViamVjdCxcbiAgICAgIGh0bWw6IG1haWwubWVzc2FnZSxcbiAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgJ1JldHVybi1QYXRoJzogbWFpbC5yZXR1cm5QYXRoLFxuICAgICAgfVxuICAgIH0pO1xuXG4gIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2VtYWlscy5zZW5kLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IHNlbmRNYWlsO1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgeyBKb2IgfSBmcm9tICdtZXRlb3IvdnNpdnNpOmpvYi1jb2xsZWN0aW9uJztcbmltcG9ydCB7IEJsb2NrY2hhaW5Kb2JzIH0gZnJvbSAnLi4vLi4vLi4vLi4vc2VydmVyL2FwaS9ibG9ja2NoYWluX2pvYnMuanMnO1xuXG5jb25zdCBhZGRDaGVja05ld1RyYW5zYWN0aW9uc0Jsb2NrY2hhaW5Kb2IgPSAoKSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3Qgam9iID0gbmV3IEpvYihCbG9ja2NoYWluSm9icywgJ2NoZWNrTmV3VHJhbnNhY3Rpb24nLCB7fSk7XG4gICAgam9iLnJldHJ5KHtyZXRyaWVzOiA2MCwgd2FpdDogMTUqMTAwMCB9KS5zYXZlKHtjYW5jZWxSZXBlYXRzOiB0cnVlfSk7XG4gIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2pvYnMuYWRkQ2hlY2tOZXdUcmFuc2FjdGlvbnNCbG9ja2NoYWluLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGFkZENoZWNrTmV3VHJhbnNhY3Rpb25zQmxvY2tjaGFpbkpvYjtcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tICdzaW1wbC1zY2hlbWEnO1xuaW1wb3J0IHsgSm9iIH0gZnJvbSAnbWV0ZW9yL3ZzaXZzaTpqb2ItY29sbGVjdGlvbic7XG5pbXBvcnQgeyBEQXBwSm9icyB9IGZyb20gJy4uLy4uLy4uLy4uL3NlcnZlci9hcGkvZGFwcF9qb2JzLmpzJztcblxuY29uc3QgQWRkRmV0Y2hEb2lNYWlsRGF0YUpvYlNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICBuYW1lOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH0sXG4gIGRvbWFpbjoge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9XG59KTtcblxuY29uc3QgYWRkRmV0Y2hEb2lNYWlsRGF0YUpvYiA9IChkYXRhKSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3Qgb3VyRGF0YSA9IGRhdGE7XG4gICAgQWRkRmV0Y2hEb2lNYWlsRGF0YUpvYlNjaGVtYS52YWxpZGF0ZShvdXJEYXRhKTtcbiAgICBjb25zdCBqb2IgPSBuZXcgSm9iKERBcHBKb2JzLCAnZmV0Y2hEb2lNYWlsRGF0YScsIG91ckRhdGEpO1xuICAgIGpvYi5yZXRyeSh7cmV0cmllczogNSwgd2FpdDogMSoxMCoxMDAwIH0pLnNhdmUoKTsgLy9jaGVjayBldmVyeSAxMCBzZWNzIDUgdGltZXNcbiAgfSBjYXRjaCAoZXhjZXB0aW9uKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignam9icy5hZGRGZXRjaERvaU1haWxEYXRhLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGFkZEZldGNoRG9pTWFpbERhdGFKb2I7XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCB7IEpvYiB9IGZyb20gJ21ldGVvci92c2l2c2k6am9iLWNvbGxlY3Rpb24nO1xuaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tICdzaW1wbC1zY2hlbWEnO1xuaW1wb3J0IHsgQmxvY2tjaGFpbkpvYnMgfSBmcm9tICcuLi8uLi8uLi8uLi9zZXJ2ZXIvYXBpL2Jsb2NrY2hhaW5fam9icy5qcyc7XG5cbmNvbnN0IEFkZEluc2VydEJsb2NrY2hhaW5Kb2JTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgbmFtZUlkOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH0sXG4gIHNpZ25hdHVyZToge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9LFxuICBkYXRhSGFzaDoge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICBvcHRpb25hbDp0cnVlXG4gIH0sXG4gIGRvbWFpbjoge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9LFxuICBzb2lEYXRlOiB7XG4gICAgdHlwZTogRGF0ZVxuICB9XG59KTtcblxuY29uc3QgYWRkSW5zZXJ0QmxvY2tjaGFpbkpvYiA9IChlbnRyeSkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IG91ckVudHJ5ID0gZW50cnk7XG4gICAgQWRkSW5zZXJ0QmxvY2tjaGFpbkpvYlNjaGVtYS52YWxpZGF0ZShvdXJFbnRyeSk7XG4gICAgY29uc3Qgam9iID0gbmV3IEpvYihCbG9ja2NoYWluSm9icywgJ2luc2VydCcsIG91ckVudHJ5KTtcbiAgICBqb2IucmV0cnkoe3JldHJpZXM6IDEwLCB3YWl0OiAzKjYwKjEwMDAgfSkuc2F2ZSgpOyAvL2NoZWNrIGV2ZXJ5IDEwc2VjIGZvciAxaFxuICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdqb2JzLmFkZEluc2VydEJsb2NrY2hhaW4uZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgYWRkSW5zZXJ0QmxvY2tjaGFpbkpvYjtcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IHsgSm9iIH0gZnJvbSAnbWV0ZW9yL3ZzaXZzaTpqb2ItY29sbGVjdGlvbic7XG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XG5pbXBvcnQgeyBNYWlsSm9icyB9IGZyb20gJy4uLy4uLy4uLy4uL3NlcnZlci9hcGkvbWFpbF9qb2JzLmpzJztcblxuY29uc3QgQWRkU2VuZE1haWxKb2JTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgLypmcm9tOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIHJlZ0V4OiBTaW1wbGVTY2hlbWEuUmVnRXguRW1haWxcbiAgfSwqL1xuICB0bzoge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICByZWdFeDogU2ltcGxlU2NoZW1hLlJlZ0V4LkVtYWlsXG4gIH0sXG4gIHN1YmplY3Q6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gIH0sXG4gIG1lc3NhZ2U6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gIH0sXG4gIHJldHVyblBhdGg6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgcmVnRXg6IFNpbXBsZVNjaGVtYS5SZWdFeC5FbWFpbFxuICB9XG59KTtcblxuY29uc3QgYWRkU2VuZE1haWxKb2IgPSAobWFpbCkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IG91ck1haWwgPSBtYWlsO1xuICAgIEFkZFNlbmRNYWlsSm9iU2NoZW1hLnZhbGlkYXRlKG91ck1haWwpO1xuICAgIGNvbnN0IGpvYiA9IG5ldyBKb2IoTWFpbEpvYnMsICdzZW5kJywgb3VyTWFpbCk7XG4gICAgam9iLnJldHJ5KHtyZXRyaWVzOiA1LCB3YWl0OiA2MCoxMDAwIH0pLnNhdmUoKTtcbiAgfSBjYXRjaCAoZXhjZXB0aW9uKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignam9icy5hZGRTZW5kTWFpbC5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBhZGRTZW5kTWFpbEpvYjtcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tICdzaW1wbC1zY2hlbWEnO1xuaW1wb3J0IHsgSm9iIH0gZnJvbSAnbWV0ZW9yL3ZzaXZzaTpqb2ItY29sbGVjdGlvbic7XG5pbXBvcnQgeyBCbG9ja2NoYWluSm9icyB9IGZyb20gJy4uLy4uLy4uLy4uL3NlcnZlci9hcGkvYmxvY2tjaGFpbl9qb2JzLmpzJztcblxuY29uc3QgQWRkVXBkYXRlQmxvY2tjaGFpbkpvYlNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICBuYW1lSWQ6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfSxcbiAgdmFsdWU6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfSxcbiAgZnJvbUhvc3RVcmw6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfSxcbiAgaG9zdDoge1xuICAgICAgdHlwZTogU3RyaW5nXG4gIH1cbn0pO1xuXG5jb25zdCBhZGRVcGRhdGVCbG9ja2NoYWluSm9iID0gKGVudHJ5KSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3Qgb3VyRW50cnkgPSBlbnRyeTtcbiAgICBBZGRVcGRhdGVCbG9ja2NoYWluSm9iU2NoZW1hLnZhbGlkYXRlKG91ckVudHJ5KTtcbiAgICBjb25zdCBqb2IgPSBuZXcgSm9iKEJsb2NrY2hhaW5Kb2JzLCAndXBkYXRlJywgb3VyRW50cnkpO1xuICAgIGpvYi5yZXRyeSh7cmV0cmllczogMzYwLCB3YWl0OiAxKjEwKjEwMDAgfSkuc2F2ZSgpO1xuICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdqb2JzLmFkZFVwZGF0ZUJsb2NrY2hhaW4uZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgYWRkVXBkYXRlQmxvY2tjaGFpbkpvYjtcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IGkxOG4gZnJvbSAnbWV0ZW9yL3VuaXZlcnNlOmkxOG4nO1xuXG4vLyB1bml2ZXJzZTppMThuIG9ubHkgYnVuZGxlcyB0aGUgZGVmYXVsdCBsYW5ndWFnZSBvbiB0aGUgY2xpZW50IHNpZGUuXG4vLyBUbyBnZXQgYSBsaXN0IG9mIGFsbCBhdmlhbGJsZSBsYW5ndWFnZXMgd2l0aCBhdCBsZWFzdCBvbmUgdHJhbnNsYXRpb24sXG4vLyBpMThuLmdldExhbmd1YWdlcygpIG11c3QgYmUgY2FsbGVkIHNlcnZlciBzaWRlLlxuY29uc3QgZ2V0TGFuZ3VhZ2VzID0gKCkgPT4ge1xuICB0cnkge1xuICAgIHJldHVybiBpMThuLmdldExhbmd1YWdlcygpO1xuICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdsYW5ndWFnZXMuZ2V0LmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGdldExhbmd1YWdlcztcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tICdzaW1wbC1zY2hlbWEnO1xuaW1wb3J0IHsgTWV0YSB9IGZyb20gJy4uLy4uLy4uL2FwaS9tZXRhL21ldGEuanMnO1xuXG5jb25zdCBBZGRPclVwZGF0ZU1ldGFTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAga2V5OiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH0sXG4gIHZhbHVlOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH1cbn0pO1xuXG5jb25zdCBhZGRPclVwZGF0ZU1ldGEgPSAoZGF0YSkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IG91ckRhdGEgPSBkYXRhO1xuICAgIEFkZE9yVXBkYXRlTWV0YVNjaGVtYS52YWxpZGF0ZShvdXJEYXRhKTtcbiAgICBjb25zdCBtZXRhID0gTWV0YS5maW5kT25lKHtrZXk6IG91ckRhdGEua2V5fSk7XG4gICAgaWYobWV0YSAhPT0gdW5kZWZpbmVkKSBNZXRhLnVwZGF0ZSh7X2lkIDogbWV0YS5faWR9LCB7JHNldDoge1xuICAgICAgdmFsdWU6IG91ckRhdGEudmFsdWVcbiAgICB9fSk7XG4gICAgZWxzZSByZXR1cm4gTWV0YS5pbnNlcnQoe1xuICAgICAga2V5OiBvdXJEYXRhLmtleSxcbiAgICAgIHZhbHVlOiBvdXJEYXRhLnZhbHVlXG4gICAgfSlcbiAgfSBjYXRjaCAoZXhjZXB0aW9uKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignbWV0YS5hZGRPclVwZGF0ZS5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBhZGRPclVwZGF0ZU1ldGE7XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcbmltcG9ydCB7IE9wdElucyB9IGZyb20gJy4uLy4uLy4uL2FwaS9vcHQtaW5zL29wdC1pbnMuanMnO1xuXG5jb25zdCBBZGRPcHRJblNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICBuYW1lOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH1cbn0pO1xuXG5jb25zdCBhZGRPcHRJbiA9IChvcHRJbikgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IG91ck9wdEluID0gb3B0SW47XG4gICAgQWRkT3B0SW5TY2hlbWEudmFsaWRhdGUob3VyT3B0SW4pO1xuICAgIGNvbnN0IG9wdElucyA9IE9wdElucy5maW5kKHtuYW1lSWQ6IG91ck9wdEluLm5hbWV9KS5mZXRjaCgpO1xuICAgIGlmKG9wdElucy5sZW5ndGggPiAwKSByZXR1cm4gb3B0SW5zWzBdLl9pZDtcbiAgICBjb25zdCBvcHRJbklkID0gT3B0SW5zLmluc2VydCh7XG4gICAgICBuYW1lSWQ6IG91ck9wdEluLm5hbWVcbiAgICB9KTtcbiAgICByZXR1cm4gb3B0SW5JZDtcbiAgfSBjYXRjaCAoZXhjZXB0aW9uKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignb3B0LWlucy5hZGQuZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgYWRkT3B0SW47XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcbmltcG9ydCBhZGRSZWNpcGllbnQgZnJvbSAnLi4vcmVjaXBpZW50cy9hZGQuanMnO1xuaW1wb3J0IGFkZFNlbmRlciBmcm9tICcuLi9zZW5kZXJzL2FkZC5qcyc7XG5pbXBvcnQgeyBPcHRJbnMgfSBmcm9tICcuLi8uLi8uLi9hcGkvb3B0LWlucy9vcHQtaW5zLmpzJztcbmltcG9ydCB3cml0ZVRvQmxvY2tjaGFpbiBmcm9tICcuLi9kb2ljaGFpbi93cml0ZV90b19ibG9ja2NoYWluLmpzJztcbmltcG9ydCB7bG9nRXJyb3IsIGxvZ1NlbmR9IGZyb20gXCIuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9sb2ctY29uZmlndXJhdGlvblwiO1xuXG5cbmNvbnN0IEFkZE9wdEluU2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIHJlY2lwaWVudF9tYWlsOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIHJlZ0V4OiBTaW1wbGVTY2hlbWEuUmVnRXguRW1haWxcbiAgfSxcbiAgc2VuZGVyX21haWw6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgcmVnRXg6IFNpbXBsZVNjaGVtYS5SZWdFeC5FbWFpbFxuICB9LFxuICBkYXRhOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIG9wdGlvbmFsOiB0cnVlXG4gIH0sXG4gIG1hc3Rlcl9kb2k6IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIG9wdGlvbmFsOiB0cnVlXG4gIH0sXG4gIGluZGV4OiB7XG4gICAgICB0eXBlOiBTaW1wbGVTY2hlbWEuSW50ZWdlcixcbiAgICAgIG9wdGlvbmFsOiB0cnVlXG4gIH0sXG4gIG93bmVySWQ6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgcmVnRXg6IFNpbXBsZVNjaGVtYS5SZWdFeC5pZFxuICB9XG59KTtcblxuY29uc3QgYWRkT3B0SW4gPSAob3B0SW4pID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBvdXJPcHRJbiA9IG9wdEluO1xuICAgIEFkZE9wdEluU2NoZW1hLnZhbGlkYXRlKG91ck9wdEluKTtcblxuICAgIGNvbnN0IHJlY2lwaWVudCA9IHtcbiAgICAgIGVtYWlsOiBvdXJPcHRJbi5yZWNpcGllbnRfbWFpbFxuICAgIH1cbiAgICBjb25zdCByZWNpcGllbnRJZCA9IGFkZFJlY2lwaWVudChyZWNpcGllbnQpO1xuICAgIGNvbnN0IHNlbmRlciA9IHtcbiAgICAgIGVtYWlsOiBvdXJPcHRJbi5zZW5kZXJfbWFpbFxuICAgIH1cbiAgICBjb25zdCBzZW5kZXJJZCA9IGFkZFNlbmRlcihzZW5kZXIpO1xuICAgIFxuICAgIGNvbnN0IG9wdElucyA9IE9wdElucy5maW5kKHtyZWNpcGllbnQ6IHJlY2lwaWVudElkLCBzZW5kZXI6IHNlbmRlcklkfSkuZmV0Y2goKTtcbiAgICBpZihvcHRJbnMubGVuZ3RoID4gMCkgcmV0dXJuIG9wdEluc1swXS5faWQ7IC8vVE9ETyB3aGVuIFNPSSBhbHJlYWR5IGV4aXN0cyByZXNlbmQgZW1haWw/XG5cbiAgICBpZihvdXJPcHRJbi5kYXRhICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIEpTT04ucGFyc2Uob3VyT3B0SW4uZGF0YSk7XG4gICAgICB9IGNhdGNoKGVycm9yKSB7XG4gICAgICAgIGxvZ0Vycm9yKFwib3VyT3B0SW4uZGF0YTpcIixvdXJPcHRJbi5kYXRhKTtcbiAgICAgICAgdGhyb3cgXCJJbnZhbGlkIGRhdGEganNvbiBcIjtcbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgY29uc3Qgb3B0SW5JZCA9IE9wdElucy5pbnNlcnQoe1xuICAgICAgcmVjaXBpZW50OiByZWNpcGllbnRJZCxcbiAgICAgIHNlbmRlcjogc2VuZGVySWQsXG4gICAgICBpbmRleDogb3VyT3B0SW4uaW5kZXgsXG4gICAgICBtYXN0ZXJEb2kgOiBvdXJPcHRJbi5tYXN0ZXJfZG9pLFxuICAgICAgZGF0YTogb3VyT3B0SW4uZGF0YSxcbiAgICAgIG93bmVySWQ6IG91ck9wdEluLm93bmVySWRcbiAgICB9KTtcbiAgICBsb2dTZW5kKFwib3B0SW4gKGluZGV4OlwiK291ck9wdEluLmluZGV4K1wiIGFkZGVkIHRvIGxvY2FsIGRiIHdpdGggb3B0SW5JZFwiLG9wdEluSWQpO1xuXG4gICAgd3JpdGVUb0Jsb2NrY2hhaW4oe2lkOiBvcHRJbklkfSk7XG4gICAgcmV0dXJuIG9wdEluSWQ7XG4gIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ29wdC1pbnMuYWRkQW5kV3JpdGVUb0Jsb2NrY2hhaW4uZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgYWRkT3B0SW47XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcbmltcG9ydCB7IENPTkZJUk1fQ0xJRU5ULCBDT05GSVJNX0FERFJFU1MgfSBmcm9tICcuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9kb2ljaGFpbi1jb25maWd1cmF0aW9uLmpzJztcbmltcG9ydCB7IE9wdElucyB9IGZyb20gJy4uLy4uLy4uL2FwaS9vcHQtaW5zL29wdC1pbnMuanMnO1xuaW1wb3J0IHsgRG9pY2hhaW5FbnRyaWVzIH0gZnJvbSAnLi4vLi4vLi4vYXBpL2RvaWNoYWluL2VudHJpZXMuanMnO1xuaW1wb3J0IGRlY29kZURvaUhhc2ggZnJvbSAnLi4vZW1haWxzL2RlY29kZV9kb2ktaGFzaC5qcyc7XG5pbXBvcnQgeyBzaWduTWVzc2FnZSB9IGZyb20gJy4uLy4uLy4uLy4uL3NlcnZlci9hcGkvZG9pY2hhaW4uanMnO1xuaW1wb3J0IGFkZFVwZGF0ZUJsb2NrY2hhaW5Kb2IgZnJvbSAnLi4vam9icy9hZGRfdXBkYXRlX2Jsb2NrY2hhaW4uanMnO1xuaW1wb3J0IHtsb2dDb25maXJtfSBmcm9tIFwiLi4vLi4vLi4vc3RhcnR1cC9zZXJ2ZXIvbG9nLWNvbmZpZ3VyYXRpb25cIjtcblxuY29uc3QgQ29uZmlybU9wdEluU2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIGhvc3Q6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfSxcbiAgaGFzaDoge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9XG59KTtcblxuY29uc3QgY29uZmlybU9wdEluID0gKHJlcXVlc3QpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBvdXJSZXF1ZXN0ID0gcmVxdWVzdDtcbiAgICBDb25maXJtT3B0SW5TY2hlbWEudmFsaWRhdGUob3VyUmVxdWVzdCk7XG4gICAgY29uc3QgZGVjb2RlZCA9IGRlY29kZURvaUhhc2goe2hhc2g6IHJlcXVlc3QuaGFzaH0pO1xuICAgIGNvbnN0IG9wdEluID0gT3B0SW5zLmZpbmRPbmUoe19pZDogZGVjb2RlZC5pZH0pO1xuICAgIGlmKG9wdEluID09PSB1bmRlZmluZWQgfHwgb3B0SW4uY29uZmlybWF0aW9uVG9rZW4gIT09IGRlY29kZWQudG9rZW4pIHRocm93IFwiSW52YWxpZCBoYXNoXCI7XG4gICAgY29uc3QgY29uZmlybWVkQXQgPSBuZXcgRGF0ZSgpO1xuXG4gICAgT3B0SW5zLnVwZGF0ZSh7X2lkIDogb3B0SW4uX2lkfSx7JHNldDp7Y29uZmlybWVkQXQ6IGNvbmZpcm1lZEF0LCBjb25maXJtZWRCeTogb3VyUmVxdWVzdC5ob3N0fSwgJHVuc2V0OiB7Y29uZmlybWF0aW9uVG9rZW46IFwiXCJ9fSk7XG5cbiAgICAvL1RPRE8gaGVyZSBmaW5kIGFsbCBEb2ljaGFpbkVudHJpZXMgaW4gdGhlIGxvY2FsIGRhdGFiYXNlICBhbmQgYmxvY2tjaGFpbiB3aXRoIHRoZSBzYW1lIG1hc3RlckRvaVxuICAgIGNvbnN0IGVudHJpZXMgPSBEb2ljaGFpbkVudHJpZXMuZmluZCh7JG9yOiBbe25hbWU6IG9wdEluLm5hbWVJZH0sIHttYXN0ZXJEb2k6IG9wdEluLm5hbWVJZH1dfSk7XG4gICAgaWYoZW50cmllcyA9PT0gdW5kZWZpbmVkKSB0aHJvdyBcIkRvaWNoYWluIGVudHJ5L2VudHJpZXMgbm90IGZvdW5kXCI7XG5cbiAgICBlbnRyaWVzLmZvckVhY2goZW50cnkgPT4ge1xuICAgICAgICBsb2dDb25maXJtKCdjb25maXJtaW5nIERvaUNoYWluRW50cnk6JyxlbnRyeSk7XG5cbiAgICAgICAgY29uc3QgdmFsdWUgPSBKU09OLnBhcnNlKGVudHJ5LnZhbHVlKTtcbiAgICAgICAgbG9nQ29uZmlybSgnZ2V0U2lnbmF0dXJlIChvbmx5IG9mIHZhbHVlISknLCB2YWx1ZSk7XG5cbiAgICAgICAgY29uc3QgZG9pU2lnbmF0dXJlID0gc2lnbk1lc3NhZ2UoQ09ORklSTV9DTElFTlQsIENPTkZJUk1fQUREUkVTUywgdmFsdWUuc2lnbmF0dXJlKTtcbiAgICAgICAgbG9nQ29uZmlybSgnZ290IGRvaVNpZ25hdHVyZTonLGRvaVNpZ25hdHVyZSk7XG4gICAgICAgIGNvbnN0IGZyb21Ib3N0VXJsID0gdmFsdWUuZnJvbTtcblxuICAgICAgICBkZWxldGUgdmFsdWUuZnJvbTtcbiAgICAgICAgdmFsdWUuZG9pVGltZXN0YW1wID0gY29uZmlybWVkQXQudG9JU09TdHJpbmcoKTtcbiAgICAgICAgdmFsdWUuZG9pU2lnbmF0dXJlID0gZG9pU2lnbmF0dXJlO1xuICAgICAgICBjb25zdCBqc29uVmFsdWUgPSBKU09OLnN0cmluZ2lmeSh2YWx1ZSk7XG4gICAgICAgIGxvZ0NvbmZpcm0oJ3VwZGF0aW5nIERvaWNoYWluIG5hbWVJZDonK29wdEluLm5hbWVJZCsnIHdpdGggdmFsdWU6Jyxqc29uVmFsdWUpO1xuXG4gICAgICAgIGFkZFVwZGF0ZUJsb2NrY2hhaW5Kb2Ioe1xuICAgICAgICAgICAgbmFtZUlkOiBlbnRyeS5uYW1lLFxuICAgICAgICAgICAgdmFsdWU6IGpzb25WYWx1ZSxcbiAgICAgICAgICAgIGZyb21Ib3N0VXJsOiBmcm9tSG9zdFVybCxcbiAgICAgICAgICAgIGhvc3Q6IG91clJlcXVlc3QuaG9zdFxuICAgICAgICB9KTtcbiAgICB9KTtcbiAgICBsb2dDb25maXJtKCdyZWRpcmVjdGluZyB1c2VyIHRvOicsZGVjb2RlZC5yZWRpcmVjdCk7XG4gICAgcmV0dXJuIGRlY29kZWQucmVkaXJlY3Q7XG4gIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ29wdC1pbnMuY29uZmlybS5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBjb25maXJtT3B0SW5cbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tICdzaW1wbC1zY2hlbWEnO1xuaW1wb3J0IHsgcmFuZG9tQnl0ZXMgfSBmcm9tICdjcnlwdG8nO1xuaW1wb3J0IHsgT3B0SW5zIH0gZnJvbSAnLi4vLi4vLi4vYXBpL29wdC1pbnMvb3B0LWlucy5qcyc7XG5cbmNvbnN0IEdlbmVyYXRlRG9pVG9rZW5TY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgaWQ6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfVxufSk7XG5cbmNvbnN0IGdlbmVyYXRlRG9pVG9rZW4gPSAob3B0SW4pID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBvdXJPcHRJbiA9IG9wdEluO1xuICAgIEdlbmVyYXRlRG9pVG9rZW5TY2hlbWEudmFsaWRhdGUob3VyT3B0SW4pO1xuICAgIGNvbnN0IHRva2VuID0gcmFuZG9tQnl0ZXMoMzIpLnRvU3RyaW5nKCdoZXgnKTtcbiAgICBPcHRJbnMudXBkYXRlKHtfaWQgOiBvdXJPcHRJbi5pZH0seyRzZXQ6e2NvbmZpcm1hdGlvblRva2VuOiB0b2tlbn19KTtcbiAgICByZXR1cm4gdG9rZW47XG4gIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ29wdC1pbnMuZ2VuZXJhdGVfZG9pLXRva2VuLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGdlbmVyYXRlRG9pVG9rZW5cbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tICdzaW1wbC1zY2hlbWEnO1xuaW1wb3J0IHsgT3B0SW5zIH0gZnJvbSAnLi4vLi4vLi4vYXBpL29wdC1pbnMvb3B0LWlucy5qcyc7XG5pbXBvcnQgeyBSZWNpcGllbnRzIH0gZnJvbSAnLi4vLi4vLi4vYXBpL3JlY2lwaWVudHMvcmVjaXBpZW50cy5qcyc7XG5pbXBvcnQgdmVyaWZ5U2lnbmF0dXJlIGZyb20gJy4uL2RvaWNoYWluL3ZlcmlmeV9zaWduYXR1cmUuanMnO1xuaW1wb3J0IHtsb2dTZW5kfSBmcm9tIFwiLi4vLi4vLi4vc3RhcnR1cC9zZXJ2ZXIvbG9nLWNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCBnZXRQdWJsaWNLZXlBbmRBZGRyZXNzIGZyb20gXCIuLi9kb2ljaGFpbi9nZXRfcHVibGlja2V5X2FuZF9hZGRyZXNzX2J5X2RvbWFpblwiO1xuXG5jb25zdCBVcGRhdGVPcHRJblN0YXR1c1NjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICBuYW1lSWQ6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfSxcbiAgc2lnbmF0dXJlOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH0sXG4gIGhvc3Q6IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIG9wdGlvbmFsOiB0cnVlXG4gIH1cbn0pO1xuXG5cbmNvbnN0IHVwZGF0ZU9wdEluU3RhdHVzID0gKGRhdGEpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBvdXJEYXRhID0gZGF0YTtcbiAgICBsb2dTZW5kKCdjb25maXJtIGRBcHAgY29uZmlybXMgb3B0SW46JyxKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gICAgVXBkYXRlT3B0SW5TdGF0dXNTY2hlbWEudmFsaWRhdGUob3VyRGF0YSk7XG4gICAgY29uc3Qgb3B0SW4gPSBPcHRJbnMuZmluZE9uZSh7bmFtZUlkOiBvdXJEYXRhLm5hbWVJZH0pO1xuICAgIGlmKG9wdEluID09PSB1bmRlZmluZWQpIHRocm93IFwiT3B0LUluIG5vdCBmb3VuZFwiO1xuICAgIGxvZ1NlbmQoJ2NvbmZpcm0gZEFwcCBjb25maXJtcyBvcHRJbjonLG91ckRhdGEubmFtZUlkKTtcblxuICAgIGNvbnN0IHJlY2lwaWVudCA9IFJlY2lwaWVudHMuZmluZE9uZSh7X2lkOiBvcHRJbi5yZWNpcGllbnR9KTtcbiAgICBpZihyZWNpcGllbnQgPT09IHVuZGVmaW5lZCkgdGhyb3cgXCJSZWNpcGllbnQgbm90IGZvdW5kXCI7XG4gICAgY29uc3QgcGFydHMgPSByZWNpcGllbnQuZW1haWwuc3BsaXQoXCJAXCIpO1xuICAgIGNvbnN0IGRvbWFpbiA9IHBhcnRzW3BhcnRzLmxlbmd0aC0xXTtcbiAgICBjb25zdCBwdWJsaWNLZXlBbmRBZGRyZXNzID0gZ2V0UHVibGljS2V5QW5kQWRkcmVzcyh7ZG9tYWluOmRvbWFpbn0pO1xuXG4gICAgLy9UT0RPIGdldHRpbmcgaW5mb3JtYXRpb24gZnJvbSBCb2IgdGhhdCBhIGNlcnRhaW4gbmFtZUlkIChET0kpIGdvdCBjb25maXJtZWQuXG4gICAgaWYoIXZlcmlmeVNpZ25hdHVyZSh7cHVibGljS2V5OiBwdWJsaWNLZXlBbmRBZGRyZXNzLnB1YmxpY0tleSwgZGF0YTogb3VyRGF0YS5uYW1lSWQsIHNpZ25hdHVyZTogb3VyRGF0YS5zaWduYXR1cmV9KSkge1xuICAgICAgdGhyb3cgXCJBY2Nlc3MgZGVuaWVkXCI7XG4gICAgfVxuICAgIGxvZ1NlbmQoJ3NpZ25hdHVyZSB2YWxpZCBmb3IgcHVibGljS2V5JywgcHVibGljS2V5QW5kQWRkcmVzcy5wdWJsaWNLZXkpO1xuXG4gICAgT3B0SW5zLnVwZGF0ZSh7X2lkIDogb3B0SW4uX2lkfSx7JHNldDp7Y29uZmlybWVkQXQ6IG5ldyBEYXRlKCksIGNvbmZpcm1lZEJ5OiBvdXJEYXRhLmhvc3R9fSk7XG4gIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2RhcHBzLnNlbmQudXBkYXRlT3B0SW5TdGF0dXMuZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgdXBkYXRlT3B0SW5TdGF0dXM7XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcbmltcG9ydCB7IFZFUklGWV9DTElFTlQgfSBmcm9tICcuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9kb2ljaGFpbi1jb25maWd1cmF0aW9uLmpzJztcbmltcG9ydCB7IG5hbWVTaG93IH0gZnJvbSAnLi4vLi4vLi4vLi4vc2VydmVyL2FwaS9kb2ljaGFpbi5qcyc7XG5pbXBvcnQgZ2V0T3B0SW5Qcm92aWRlciBmcm9tICcuLi9kbnMvZ2V0X29wdC1pbi1wcm92aWRlci5qcyc7XG5pbXBvcnQgZ2V0T3B0SW5LZXkgZnJvbSAnLi4vZG5zL2dldF9vcHQtaW4ta2V5LmpzJztcbmltcG9ydCB2ZXJpZnlTaWduYXR1cmUgZnJvbSAnLi4vZG9pY2hhaW4vdmVyaWZ5X3NpZ25hdHVyZS5qcyc7XG5pbXBvcnQge2xvZ1ZlcmlmeX0gZnJvbSBcIi4uLy4uLy4uL3N0YXJ0dXAvc2VydmVyL2xvZy1jb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgZ2V0UHVibGljS2V5QW5kQWRkcmVzcyBmcm9tIFwiLi4vZG9pY2hhaW4vZ2V0X3B1YmxpY2tleV9hbmRfYWRkcmVzc19ieV9kb21haW5cIjtcblxuY29uc3QgVmVyaWZ5T3B0SW5TY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgcmVjaXBpZW50X21haWw6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgcmVnRXg6IFNpbXBsZVNjaGVtYS5SZWdFeC5FbWFpbFxuICB9LFxuICBzZW5kZXJfbWFpbDoge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICByZWdFeDogU2ltcGxlU2NoZW1hLlJlZ0V4LkVtYWlsXG4gIH0sXG4gIG5hbWVfaWQ6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfSxcbiAgcmVjaXBpZW50X3B1YmxpY19rZXk6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfVxufSk7XG5cbmNvbnN0IHZlcmlmeU9wdEluID0gKGRhdGEpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBvdXJEYXRhID0gZGF0YTtcbiAgICBWZXJpZnlPcHRJblNjaGVtYS52YWxpZGF0ZShvdXJEYXRhKTtcbiAgICBjb25zdCBlbnRyeSA9IG5hbWVTaG93KFZFUklGWV9DTElFTlQsIG91ckRhdGEubmFtZV9pZCk7XG4gICAgaWYoZW50cnkgPT09IHVuZGVmaW5lZCkgcmV0dXJuIGZhbHNlO1xuICAgIGNvbnN0IGVudHJ5RGF0YSA9IEpTT04ucGFyc2UoZW50cnkudmFsdWUpO1xuICAgIGNvbnN0IGZpcnN0Q2hlY2sgPSB2ZXJpZnlTaWduYXR1cmUoe1xuICAgICAgZGF0YTogb3VyRGF0YS5yZWNpcGllbnRfbWFpbCtvdXJEYXRhLnNlbmRlcl9tYWlsLFxuICAgICAgc2lnbmF0dXJlOiBlbnRyeURhdGEuc2lnbmF0dXJlLFxuICAgICAgcHVibGljS2V5OiBvdXJEYXRhLnJlY2lwaWVudF9wdWJsaWNfa2V5XG4gICAgfSlcblxuICAgIGlmKCFmaXJzdENoZWNrKSByZXR1cm4ge2ZpcnN0Q2hlY2s6IGZhbHNlfTtcbiAgICBjb25zdCBwYXJ0cyA9IG91ckRhdGEucmVjaXBpZW50X21haWwuc3BsaXQoXCJAXCIpOyAvL1RPRE8gcHV0IHRoaXMgaW50byBnZXRQdWJsaWNLZXlBbmRBZGRyZXNzXG4gICAgY29uc3QgZG9tYWluID0gcGFydHNbcGFydHMubGVuZ3RoLTFdO1xuICAgIGNvbnN0IHB1YmxpY0tleUFuZEFkZHJlc3MgPSBnZXRQdWJsaWNLZXlBbmRBZGRyZXNzKHtkb21haW46IGRvbWFpbn0pO1xuXG4gICAgY29uc3Qgc2Vjb25kQ2hlY2sgPSB2ZXJpZnlTaWduYXR1cmUoe1xuICAgICAgZGF0YTogZW50cnlEYXRhLnNpZ25hdHVyZSxcbiAgICAgIHNpZ25hdHVyZTogZW50cnlEYXRhLmRvaVNpZ25hdHVyZSxcbiAgICAgIHB1YmxpY0tleTogcHVibGljS2V5QW5kQWRkcmVzcy5wdWJsaWNLZXlcbiAgICB9KVxuXG4gICAgaWYoIXNlY29uZENoZWNrKSByZXR1cm4ge3NlY29uZENoZWNrOiBmYWxzZX07XG4gICAgcmV0dXJuIHRydWU7XG4gIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ29wdC1pbnMudmVyaWZ5LmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IHZlcmlmeU9wdEluXG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcbmltcG9ydCB7IFJlY2lwaWVudHMgfSBmcm9tICcuLi8uLi8uLi9hcGkvcmVjaXBpZW50cy9yZWNpcGllbnRzLmpzJztcbmltcG9ydCBnZXRLZXlQYWlyIGZyb20gJy4uL2RvaWNoYWluL2dldF9rZXktcGFpci5qcyc7XG5cbmNvbnN0IEFkZFJlY2lwaWVudFNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICBlbWFpbDoge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICByZWdFeDogU2ltcGxlU2NoZW1hLlJlZ0V4LkVtYWlsXG4gIH1cbn0pO1xuXG5jb25zdCBhZGRSZWNpcGllbnQgPSAocmVjaXBpZW50KSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3Qgb3VyUmVjaXBpZW50ID0gcmVjaXBpZW50O1xuICAgIEFkZFJlY2lwaWVudFNjaGVtYS52YWxpZGF0ZShvdXJSZWNpcGllbnQpO1xuICAgIGNvbnN0IHJlY2lwaWVudHMgPSBSZWNpcGllbnRzLmZpbmQoe2VtYWlsOiByZWNpcGllbnQuZW1haWx9KS5mZXRjaCgpO1xuICAgIGlmKHJlY2lwaWVudHMubGVuZ3RoID4gMCkgcmV0dXJuIHJlY2lwaWVudHNbMF0uX2lkO1xuICAgIGNvbnN0IGtleVBhaXIgPSBnZXRLZXlQYWlyKCk7XG4gICAgcmV0dXJuIFJlY2lwaWVudHMuaW5zZXJ0KHtcbiAgICAgIGVtYWlsOiBvdXJSZWNpcGllbnQuZW1haWwsXG4gICAgICBwcml2YXRlS2V5OiBrZXlQYWlyLnByaXZhdGVLZXksXG4gICAgICBwdWJsaWNLZXk6IGtleVBhaXIucHVibGljS2V5XG4gICAgfSlcbiAgfSBjYXRjaCAoZXhjZXB0aW9uKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcigncmVjaXBpZW50cy5hZGQuZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgYWRkUmVjaXBpZW50O1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XG5pbXBvcnQgeyBTZW5kZXJzIH0gZnJvbSAnLi4vLi4vLi4vYXBpL3NlbmRlcnMvc2VuZGVycy5qcyc7XG5cbmNvbnN0IEFkZFNlbmRlclNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICBlbWFpbDoge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICByZWdFeDogU2ltcGxlU2NoZW1hLlJlZ0V4LkVtYWlsXG4gIH1cbn0pO1xuXG5jb25zdCBhZGRTZW5kZXIgPSAoc2VuZGVyKSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3Qgb3VyU2VuZGVyID0gc2VuZGVyO1xuICAgIEFkZFNlbmRlclNjaGVtYS52YWxpZGF0ZShvdXJTZW5kZXIpO1xuICAgIGNvbnN0IHNlbmRlcnMgPSBTZW5kZXJzLmZpbmQoe2VtYWlsOiBzZW5kZXIuZW1haWx9KS5mZXRjaCgpO1xuICAgIGlmKHNlbmRlcnMubGVuZ3RoID4gMCkgcmV0dXJuIHNlbmRlcnNbMF0uX2lkO1xuICAgIHJldHVybiBTZW5kZXJzLmluc2VydCh7XG4gICAgICBlbWFpbDogb3VyU2VuZGVyLmVtYWlsXG4gICAgfSlcbiAgfSBjYXRjaCAoZXhjZXB0aW9uKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignc2VuZGVycy5hZGQuZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgYWRkU2VuZGVyO1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0RlYnVnKCkge1xuICBpZihNZXRlb3Iuc2V0dGluZ3MgIT09IHVuZGVmaW5lZCAmJlxuICAgICBNZXRlb3Iuc2V0dGluZ3MuYXBwICE9PSB1bmRlZmluZWQgJiZcbiAgICAgTWV0ZW9yLnNldHRpbmdzLmFwcC5kZWJ1ZyAhPT0gdW5kZWZpbmVkKSByZXR1cm4gTWV0ZW9yLnNldHRpbmdzLmFwcC5kZWJ1Z1xuICByZXR1cm4gZmFsc2U7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1JlZ3Rlc3QoKSB7XG4gIGlmKE1ldGVvci5zZXR0aW5ncyAhPT0gdW5kZWZpbmVkICYmXG4gICAgIE1ldGVvci5zZXR0aW5ncy5hcHAgIT09IHVuZGVmaW5lZCAmJlxuICAgICBNZXRlb3Iuc2V0dGluZ3MuYXBwLnJlZ3Rlc3QgIT09IHVuZGVmaW5lZCkgcmV0dXJuIE1ldGVvci5zZXR0aW5ncy5hcHAucmVndGVzdFxuICByZXR1cm4gZmFsc2U7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1Rlc3RuZXQoKSB7XG4gICAgaWYoTWV0ZW9yLnNldHRpbmdzICE9PSB1bmRlZmluZWQgJiZcbiAgICAgICAgTWV0ZW9yLnNldHRpbmdzLmFwcCAhPT0gdW5kZWZpbmVkICYmXG4gICAgICAgIE1ldGVvci5zZXR0aW5ncy5hcHAudGVzdG5ldCAhPT0gdW5kZWZpbmVkKSByZXR1cm4gTWV0ZW9yLnNldHRpbmdzLmFwcC50ZXN0bmV0XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0VXJsKCkge1xuICBpZihNZXRlb3Iuc2V0dGluZ3MgIT09IHVuZGVmaW5lZCAmJlxuICAgICBNZXRlb3Iuc2V0dGluZ3MuYXBwICE9PSB1bmRlZmluZWQgJiZcbiAgICAgTWV0ZW9yLnNldHRpbmdzLmFwcC5ob3N0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICBsZXQgcG9ydCA9IDMwMDA7XG4gICAgICAgaWYoTWV0ZW9yLnNldHRpbmdzLmFwcC5wb3J0ICE9PSB1bmRlZmluZWQpIHBvcnQgPSBNZXRlb3Iuc2V0dGluZ3MuYXBwLnBvcnRcbiAgICAgICByZXR1cm4gXCJodHRwOi8vXCIrTWV0ZW9yLnNldHRpbmdzLmFwcC5ob3N0K1wiOlwiK3BvcnQrXCIvXCI7XG4gIH1cbiAgcmV0dXJuIE1ldGVvci5hYnNvbHV0ZVVybCgpO1xufVxuIiwiZXhwb3J0IGNvbnN0IEZBTExCQUNLX1BST1ZJREVSID0gXCJkb2ljaGFpbi5vcmdcIjtcbiIsImltcG9ydCBuYW1lY29pbiBmcm9tICduYW1lY29pbic7XG5pbXBvcnQgeyBTRU5EX0FQUCwgQ09ORklSTV9BUFAsIFZFUklGWV9BUFAsIGlzQXBwVHlwZSB9IGZyb20gJy4vdHlwZS1jb25maWd1cmF0aW9uLmpzJztcblxudmFyIHNlbmRTZXR0aW5ncyA9IE1ldGVvci5zZXR0aW5ncy5zZW5kO1xudmFyIHNlbmRDbGllbnQgPSB1bmRlZmluZWQ7XG5pZihpc0FwcFR5cGUoU0VORF9BUFApKSB7XG4gIGlmKCFzZW5kU2V0dGluZ3MgfHwgIXNlbmRTZXR0aW5ncy5kb2ljaGFpbilcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFwiY29uZmlnLnNlbmQuZG9pY2hhaW5cIiwgXCJTZW5kIGFwcCBkb2ljaGFpbiBzZXR0aW5ncyBub3QgZm91bmRcIilcbiAgc2VuZENsaWVudCA9IGNyZWF0ZUNsaWVudChzZW5kU2V0dGluZ3MuZG9pY2hhaW4pO1xufVxuZXhwb3J0IGNvbnN0IFNFTkRfQ0xJRU5UID0gc2VuZENsaWVudDtcblxudmFyIGNvbmZpcm1TZXR0aW5ncyA9IE1ldGVvci5zZXR0aW5ncy5jb25maXJtO1xudmFyIGNvbmZpcm1DbGllbnQgPSB1bmRlZmluZWQ7XG52YXIgY29uZmlybUFkZHJlc3MgPSB1bmRlZmluZWQ7XG5pZihpc0FwcFR5cGUoQ09ORklSTV9BUFApKSB7XG4gIGlmKCFjb25maXJtU2V0dGluZ3MgfHwgIWNvbmZpcm1TZXR0aW5ncy5kb2ljaGFpbilcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFwiY29uZmlnLmNvbmZpcm0uZG9pY2hhaW5cIiwgXCJDb25maXJtIGFwcCBkb2ljaGFpbiBzZXR0aW5ncyBub3QgZm91bmRcIilcbiAgY29uZmlybUNsaWVudCA9IGNyZWF0ZUNsaWVudChjb25maXJtU2V0dGluZ3MuZG9pY2hhaW4pO1xuICBjb25maXJtQWRkcmVzcyA9IGNvbmZpcm1TZXR0aW5ncy5kb2ljaGFpbi5hZGRyZXNzO1xufVxuZXhwb3J0IGNvbnN0IENPTkZJUk1fQ0xJRU5UID0gY29uZmlybUNsaWVudDtcbmV4cG9ydCBjb25zdCBDT05GSVJNX0FERFJFU1MgPSBjb25maXJtQWRkcmVzcztcblxudmFyIHZlcmlmeVNldHRpbmdzID0gTWV0ZW9yLnNldHRpbmdzLnZlcmlmeTtcbnZhciB2ZXJpZnlDbGllbnQgPSB1bmRlZmluZWQ7XG5pZihpc0FwcFR5cGUoVkVSSUZZX0FQUCkpIHtcbiAgaWYoIXZlcmlmeVNldHRpbmdzIHx8ICF2ZXJpZnlTZXR0aW5ncy5kb2ljaGFpbilcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFwiY29uZmlnLnZlcmlmeS5kb2ljaGFpblwiLCBcIlZlcmlmeSBhcHAgZG9pY2hhaW4gc2V0dGluZ3Mgbm90IGZvdW5kXCIpXG4gIHZlcmlmeUNsaWVudCA9IGNyZWF0ZUNsaWVudCh2ZXJpZnlTZXR0aW5ncy5kb2ljaGFpbik7XG59XG5leHBvcnQgY29uc3QgVkVSSUZZX0NMSUVOVCA9IHZlcmlmeUNsaWVudDtcblxuZnVuY3Rpb24gY3JlYXRlQ2xpZW50KHNldHRpbmdzKSB7XG4gIHJldHVybiBuZXcgbmFtZWNvaW4uQ2xpZW50KHtcbiAgICBob3N0OiBzZXR0aW5ncy5ob3N0LFxuICAgIHBvcnQ6IHNldHRpbmdzLnBvcnQsXG4gICAgdXNlcjogc2V0dGluZ3MudXNlcm5hbWUsXG4gICAgcGFzczogc2V0dGluZ3MucGFzc3dvcmRcbiAgfSk7XG59XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCB7IFNFTkRfQVBQLCBDT05GSVJNX0FQUCwgaXNBcHBUeXBlIH0gZnJvbSAnLi90eXBlLWNvbmZpZ3VyYXRpb24uanMnO1xuaW1wb3J0IEhhc2hpZHMgZnJvbSAnaGFzaGlkcyc7XG4vL2NvbnN0IEhhc2hpZHMgPSByZXF1aXJlKCdoYXNoaWRzJykuZGVmYXVsdDtcbmltcG9ydCB7bG9nQ29uZmlybX0gZnJvbSBcIi4vbG9nLWNvbmZpZ3VyYXRpb25cIjtcblxuZXhwb3J0IGNvbnN0IEhhc2hJZHMgPSBuZXcgSGFzaGlkcygnMHh1Z21MZTdOeWVlNnZrMWlGODgoNkNtd3Bxb0c0aFEqLVQ3NHRqWXdeTzJ2T08oWGwtOTF3QTgqbkNnX2xYJCcpO1xuXG52YXIgc2VuZFNldHRpbmdzID0gTWV0ZW9yLnNldHRpbmdzLnNlbmQ7XG52YXIgZG9pTWFpbEZldGNoVXJsID0gdW5kZWZpbmVkO1xuXG5pZihpc0FwcFR5cGUoU0VORF9BUFApKSB7XG4gIGlmKCFzZW5kU2V0dGluZ3MgfHwgIXNlbmRTZXR0aW5ncy5kb2lNYWlsRmV0Y2hVcmwpXG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcihcImNvbmZpZy5zZW5kLmVtYWlsXCIsIFwiU2V0dGluZ3Mgbm90IGZvdW5kXCIpO1xuICBkb2lNYWlsRmV0Y2hVcmwgPSBzZW5kU2V0dGluZ3MuZG9pTWFpbEZldGNoVXJsO1xufVxuZXhwb3J0IGNvbnN0IERPSV9NQUlMX0ZFVENIX1VSTCA9IGRvaU1haWxGZXRjaFVybDtcblxudmFyIGRlZmF1bHRGcm9tID0gdW5kZWZpbmVkO1xuaWYoaXNBcHBUeXBlKENPTkZJUk1fQVBQKSkge1xuICB2YXIgY29uZmlybVNldHRpbmdzID0gTWV0ZW9yLnNldHRpbmdzLmNvbmZpcm07XG5cbiAgaWYoIWNvbmZpcm1TZXR0aW5ncyB8fCAhY29uZmlybVNldHRpbmdzLnNtdHApXG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoXCJjb25maWcuY29uZmlybS5zbXRwXCIsIFwiQ29uZmlybSBhcHAgZW1haWwgc210cCBzZXR0aW5ncyBub3QgZm91bmRcIilcblxuICBpZighY29uZmlybVNldHRpbmdzLnNtdHAuZGVmYXVsdEZyb20pXG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoXCJjb25maWcuY29uZmlybS5kZWZhdWx0RnJvbVwiLCBcIkNvbmZpcm0gYXBwIGVtYWlsIGRlZmF1bHRGcm9tIG5vdCBmb3VuZFwiKVxuXG4gIGRlZmF1bHRGcm9tICA9ICBjb25maXJtU2V0dGluZ3Muc210cC5kZWZhdWx0RnJvbTtcblxuICBsb2dDb25maXJtKCdzZW5kaW5nIHdpdGggZGVmYXVsdEZyb206JyxkZWZhdWx0RnJvbSk7XG5cbiAgTWV0ZW9yLnN0YXJ0dXAoKCkgPT4ge1xuXG4gICBpZihjb25maXJtU2V0dGluZ3Muc210cC51c2VybmFtZSA9PT0gdW5kZWZpbmVkKXtcbiAgICAgICBwcm9jZXNzLmVudi5NQUlMX1VSTCA9ICdzbXRwOi8vJyArXG4gICAgICAgICAgIGVuY29kZVVSSUNvbXBvbmVudChjb25maXJtU2V0dGluZ3Muc210cC5zZXJ2ZXIpICtcbiAgICAgICAgICAgJzonICtcbiAgICAgICAgICAgY29uZmlybVNldHRpbmdzLnNtdHAucG9ydDtcbiAgIH1lbHNle1xuICAgICAgIHByb2Nlc3MuZW52Lk1BSUxfVVJMID0gJ3NtdHA6Ly8nICtcbiAgICAgICAgICAgZW5jb2RlVVJJQ29tcG9uZW50KGNvbmZpcm1TZXR0aW5ncy5zbXRwLnVzZXJuYW1lKSArXG4gICAgICAgICAgICc6JyArIGVuY29kZVVSSUNvbXBvbmVudChjb25maXJtU2V0dGluZ3Muc210cC5wYXNzd29yZCkgK1xuICAgICAgICAgICAnQCcgKyBlbmNvZGVVUklDb21wb25lbnQoY29uZmlybVNldHRpbmdzLnNtdHAuc2VydmVyKSArXG4gICAgICAgICAgICc6JyArXG4gICAgICAgICAgIGNvbmZpcm1TZXR0aW5ncy5zbXRwLnBvcnQ7XG4gICB9XG5cbiAgIGxvZ0NvbmZpcm0oJ3VzaW5nIE1BSUxfVVJMOicscHJvY2Vzcy5lbnYuTUFJTF9VUkwpO1xuXG4gICBpZihjb25maXJtU2V0dGluZ3Muc210cC5OT0RFX1RMU19SRUpFQ1RfVU5BVVRIT1JJWkVEIT09dW5kZWZpbmVkKVxuICAgICAgIHByb2Nlc3MuZW52Lk5PREVfVExTX1JFSkVDVF9VTkFVVEhPUklaRUQgPSBjb25maXJtU2V0dGluZ3Muc210cC5OT0RFX1RMU19SRUpFQ1RfVU5BVVRIT1JJWkVEOyAvLzBcbiAgfSk7XG59XG5leHBvcnQgY29uc3QgRE9JX01BSUxfREVGQVVMVF9FTUFJTF9GUk9NID0gZGVmYXVsdEZyb207XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCB7IFJvbGVzIH0gZnJvbSAnbWV0ZW9yL2FsYW5uaW5nOnJvbGVzJztcbmltcG9ydCB7TWV0YX0gZnJvbSAnLi4vLi4vYXBpL21ldGEvbWV0YS5qcydcbk1ldGVvci5zdGFydHVwKCgpID0+IHtcblxuICBsZXQgdmVyc2lvbj1Bc3NldHMuZ2V0VGV4dChcInZlcnNpb24uanNvblwiKTtcblxuICBpZihNZXRhLmZpbmQoe2tleTpcInZlcnNpb25cIn0pLmNvdW50KCkgPiAwKXtcbiAgICBNZXRhLnJlbW92ZSh7a2V5OlwidmVyc2lvblwifSk7XG4gIH1cbiAgIE1ldGEuaW5zZXJ0KHtrZXk6XCJ2ZXJzaW9uXCIsdmFsdWU6dmVyc2lvbn0pO1xuICBcbiAgaWYoTWV0ZW9yLnVzZXJzLmZpbmQoKS5jb3VudCgpID09PSAwKSB7XG4gICAgY29uc3QgaWQgPSBBY2NvdW50cy5jcmVhdGVVc2VyKHtcbiAgICAgIHVzZXJuYW1lOiAnYWRtaW4nLFxuICAgICAgZW1haWw6ICdhZG1pbkBzZW5kZWZmZWN0LmRlJyxcbiAgICAgIHBhc3N3b3JkOiAncGFzc3dvcmQnXG4gICAgfSk7XG4gICAgUm9sZXMuYWRkVXNlcnNUb1JvbGVzKGlkLCAnYWRtaW4nKTtcbiAgfVxufSk7XG4iLCJpbXBvcnQgJy4vbG9nLWNvbmZpZ3VyYXRpb24uanMnO1xuaW1wb3J0ICcuL2RhcHAtY29uZmlndXJhdGlvbi5qcyc7XG5pbXBvcnQgJy4vdHlwZS1jb25maWd1cmF0aW9uLmpzJztcbmltcG9ydCAnLi9kbnMtY29uZmlndXJhdGlvbi5qcyc7XG5pbXBvcnQgJy4vZG9pY2hhaW4tY29uZmlndXJhdGlvbi5qcyc7XG5pbXBvcnQgJy4vZml4dHVyZXMuanMnO1xuaW1wb3J0ICcuL3JlZ2lzdGVyLWFwaS5qcyc7XG5pbXBvcnQgJy4vdXNlcmFjY291bnRzLWNvbmZpZ3VyYXRpb24uanMnO1xuaW1wb3J0ICcuL3NlY3VyaXR5LmpzJztcbmltcG9ydCAnLi9lbWFpbC1jb25maWd1cmF0aW9uLmpzJztcbmltcG9ydCAnLi9qb2JzLmpzJztcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IHsgTWFpbEpvYnMgfSBmcm9tICcuLi8uLi8uLi9zZXJ2ZXIvYXBpL21haWxfam9icy5qcyc7XG5pbXBvcnQgeyBCbG9ja2NoYWluSm9icyB9IGZyb20gJy4uLy4uLy4uL3NlcnZlci9hcGkvYmxvY2tjaGFpbl9qb2JzLmpzJztcbmltcG9ydCB7IERBcHBKb2JzIH0gZnJvbSAnLi4vLi4vLi4vc2VydmVyL2FwaS9kYXBwX2pvYnMuanMnO1xuaW1wb3J0IHsgQ09ORklSTV9BUFAsIGlzQXBwVHlwZSB9IGZyb20gJy4vdHlwZS1jb25maWd1cmF0aW9uLmpzJztcbmltcG9ydCBhZGRDaGVja05ld1RyYW5zYWN0aW9uc0Jsb2NrY2hhaW5Kb2IgZnJvbSAnLi4vLi4vbW9kdWxlcy9zZXJ2ZXIvam9icy9hZGRfY2hlY2tfbmV3X3RyYW5zYWN0aW9ucy5qcyc7XG5cbk1ldGVvci5zdGFydHVwKCgpID0+IHtcbiAgTWFpbEpvYnMuc3RhcnRKb2JTZXJ2ZXIoKTtcbiAgQmxvY2tjaGFpbkpvYnMuc3RhcnRKb2JTZXJ2ZXIoKTtcbiAgREFwcEpvYnMuc3RhcnRKb2JTZXJ2ZXIoKTtcbiAgaWYoaXNBcHBUeXBlKENPTkZJUk1fQVBQKSkgYWRkQ2hlY2tOZXdUcmFuc2FjdGlvbnNCbG9ja2NoYWluSm9iKCk7XG59KTtcbiIsImltcG9ydCB7aXNEZWJ1Z30gZnJvbSBcIi4vZGFwcC1jb25maWd1cmF0aW9uXCI7XG5cbnJlcXVpcmUoJ3NjcmliZS1qcycpKCk7XG5cbmV4cG9ydCBjb25zdCBjb25zb2xlID0gcHJvY2Vzcy5jb25zb2xlO1xuZXhwb3J0IGNvbnN0IHNlbmRNb2RlVGFnQ29sb3IgPSB7bXNnIDogJ3NlbmQtbW9kZScsIGNvbG9ycyA6IFsneWVsbG93JywgJ2ludmVyc2UnXX07XG5leHBvcnQgY29uc3QgY29uZmlybU1vZGVUYWdDb2xvciA9IHttc2cgOiAnY29uZmlybS1tb2RlJywgY29sb3JzIDogWydibHVlJywgJ2ludmVyc2UnXX07XG5leHBvcnQgY29uc3QgdmVyaWZ5TW9kZVRhZ0NvbG9yID0ge21zZyA6ICd2ZXJpZnktbW9kZScsIGNvbG9ycyA6IFsnZ3JlZW4nLCAnaW52ZXJzZSddfTtcbmV4cG9ydCBjb25zdCBibG9ja2NoYWluTW9kZVRhZ0NvbG9yID0ge21zZyA6ICdibG9ja2NoYWluLW1vZGUnLCBjb2xvcnMgOiBbJ3doaXRlJywgJ2ludmVyc2UnXX07XG5leHBvcnQgY29uc3QgdGVzdGluZ01vZGVUYWdDb2xvciA9IHttc2cgOiAndGVzdGluZy1tb2RlJywgY29sb3JzIDogWydvcmFuZ2UnLCAnaW52ZXJzZSddfTtcblxuZXhwb3J0IGZ1bmN0aW9uIGxvZ1NlbmQobWVzc2FnZSxwYXJhbSkge1xuICAgIGlmKGlzRGVidWcoKSkge2NvbnNvbGUudGltZSgpLnRhZyhzZW5kTW9kZVRhZ0NvbG9yKS5sb2cobWVzc2FnZSxwYXJhbT9wYXJhbTonJyk7fVxufVxuXG5leHBvcnQgZnVuY3Rpb24gbG9nQ29uZmlybShtZXNzYWdlLHBhcmFtKSB7XG4gICAgaWYoaXNEZWJ1ZygpKSB7Y29uc29sZS50aW1lKCkudGFnKGNvbmZpcm1Nb2RlVGFnQ29sb3IpLmxvZyhtZXNzYWdlLCBwYXJhbT9wYXJhbTonJyk7fVxufVxuXG5leHBvcnQgZnVuY3Rpb24gbG9nVmVyaWZ5KG1lc3NhZ2UsIHBhcmFtKSB7XG4gICAgaWYoaXNEZWJ1ZygpKSB7Y29uc29sZS50aW1lKCkudGFnKHZlcmlmeU1vZGVUYWdDb2xvcikubG9nKG1lc3NhZ2UsIHBhcmFtP3BhcmFtOicnKTt9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsb2dCbG9ja2NoYWluKG1lc3NhZ2UsIHBhcmFtKSB7XG4gICAgaWYoaXNEZWJ1ZygpKXtjb25zb2xlLnRpbWUoKS50YWcoYmxvY2tjaGFpbk1vZGVUYWdDb2xvcikubG9nKG1lc3NhZ2UsIHBhcmFtP3BhcmFtOicnKTt9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsb2dNYWluKG1lc3NhZ2UsIHBhcmFtKSB7XG4gICAgaWYoaXNEZWJ1ZygpKXtjb25zb2xlLnRpbWUoKS50YWcoYmxvY2tjaGFpbk1vZGVUYWdDb2xvcikubG9nKG1lc3NhZ2UsIHBhcmFtP3BhcmFtOicnKTt9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsb2dFcnJvcihtZXNzYWdlLCBwYXJhbSkge1xuICAgIGlmKGlzRGVidWcoKSl7Y29uc29sZS50aW1lKCkudGFnKGJsb2NrY2hhaW5Nb2RlVGFnQ29sb3IpLmVycm9yKG1lc3NhZ2UsIHBhcmFtP3BhcmFtOicnKTt9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0ZXN0TG9nZ2luZyhtZXNzYWdlLCBwYXJhbSkge1xuICAgIGlmKGlzRGVidWcoKSl7Y29uc29sZS50aW1lKCkudGFnKHRlc3RpbmdNb2RlVGFnQ29sb3IpLmxvZyhtZXNzYWdlLCBwYXJhbT9wYXJhbTonJyk7fVxufSIsImltcG9ydCAnLi4vLi4vYXBpL2xhbmd1YWdlcy9tZXRob2RzLmpzJztcbmltcG9ydCAnLi4vLi4vYXBpL2RvaWNoYWluL21ldGhvZHMuanMnO1xuaW1wb3J0ICcuLi8uLi9hcGkvcmVjaXBpZW50cy9zZXJ2ZXIvcHVibGljYXRpb25zLmpzJztcbmltcG9ydCAnLi4vLi4vYXBpL29wdC1pbnMvbWV0aG9kcy5qcyc7XG4vL2ltcG9ydCAnLi4vLi4vYXBpL3ZlcnNpb24vcHVibGljYXRpb25zLmpzJztcbmltcG9ydCAnLi4vLi4vYXBpL29wdC1pbnMvc2VydmVyL3B1YmxpY2F0aW9ucy5qcyc7XG5cbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IHsgRERQUmF0ZUxpbWl0ZXIgfSBmcm9tICdtZXRlb3IvZGRwLXJhdGUtbGltaXRlcic7XG5pbXBvcnQgeyBfIH0gZnJvbSAnbWV0ZW9yL3VuZGVyc2NvcmUnO1xuXG4vLyBEb24ndCBsZXQgcGVvcGxlIHdyaXRlIGFyYml0cmFyeSBkYXRhIHRvIHRoZWlyICdwcm9maWxlJyBmaWVsZCBmcm9tIHRoZSBjbGllbnRcbk1ldGVvci51c2Vycy5kZW55KHtcbiAgdXBkYXRlKCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9LFxufSk7XG5cbi8vIEdldCBhIGxpc3Qgb2YgYWxsIGFjY291bnRzIG1ldGhvZHMgYnkgcnVubmluZyBgTWV0ZW9yLnNlcnZlci5tZXRob2RfaGFuZGxlcnNgIGluIG1ldGVvciBzaGVsbFxuY29uc3QgQVVUSF9NRVRIT0RTID0gW1xuICAnbG9naW4nLFxuICAnbG9nb3V0JyxcbiAgJ2xvZ291dE90aGVyQ2xpZW50cycsXG4gICdnZXROZXdUb2tlbicsXG4gICdyZW1vdmVPdGhlclRva2VucycsXG4gICdjb25maWd1cmVMb2dpblNlcnZpY2UnLFxuICAnY2hhbmdlUGFzc3dvcmQnLFxuICAnZm9yZ290UGFzc3dvcmQnLFxuICAncmVzZXRQYXNzd29yZCcsXG4gICd2ZXJpZnlFbWFpbCcsXG4gICdjcmVhdGVVc2VyJyxcbiAgJ0FUUmVtb3ZlU2VydmljZScsXG4gICdBVENyZWF0ZVVzZXJTZXJ2ZXInLFxuICAnQVRSZXNlbmRWZXJpZmljYXRpb25FbWFpbCcsXG5dO1xuXG5pZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIC8vIE9ubHkgYWxsb3cgMiBsb2dpbiBhdHRlbXB0cyBwZXIgY29ubmVjdGlvbiBwZXIgNSBzZWNvbmRzXG4gIEREUFJhdGVMaW1pdGVyLmFkZFJ1bGUoe1xuICAgIG5hbWUobmFtZSkge1xuICAgICAgcmV0dXJuIF8uY29udGFpbnMoQVVUSF9NRVRIT0RTLCBuYW1lKTtcbiAgICB9LFxuXG4gICAgLy8gUmF0ZSBsaW1pdCBwZXIgY29ubmVjdGlvbiBJRFxuICAgIGNvbm5lY3Rpb25JZCgpIHsgcmV0dXJuIHRydWU7IH0sXG4gIH0sIDIsIDUwMDApO1xufVxuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5leHBvcnQgY29uc3QgU0VORF9BUFAgPSBcInNlbmRcIjtcbmV4cG9ydCBjb25zdCBDT05GSVJNX0FQUCA9IFwiY29uZmlybVwiO1xuZXhwb3J0IGNvbnN0IFZFUklGWV9BUFAgPSBcInZlcmlmeVwiO1xuZXhwb3J0IGZ1bmN0aW9uIGlzQXBwVHlwZSh0eXBlKSB7XG4gIGlmKE1ldGVvci5zZXR0aW5ncyA9PT0gdW5kZWZpbmVkIHx8IE1ldGVvci5zZXR0aW5ncy5hcHAgPT09IHVuZGVmaW5lZCkgdGhyb3cgXCJObyBzZXR0aW5ncyBmb3VuZCFcIlxuICBjb25zdCB0eXBlcyA9IE1ldGVvci5zZXR0aW5ncy5hcHAudHlwZXM7XG4gIGlmKHR5cGVzICE9PSB1bmRlZmluZWQpIHJldHVybiB0eXBlcy5pbmNsdWRlcyh0eXBlKTtcbiAgcmV0dXJuIGZhbHNlO1xufVxuIiwiaW1wb3J0IHsgQWNjb3VudHMgfSBmcm9tICdtZXRlb3IvYWNjb3VudHMtYmFzZSc7XG5BY2NvdW50cy5jb25maWcoe1xuICAgIHNlbmRWZXJpZmljYXRpb25FbWFpbDogdHJ1ZSxcbiAgICBmb3JiaWRDbGllbnRBY2NvdW50Q3JlYXRpb246IHRydWVcbn0pO1xuXG5cblxuQWNjb3VudHMuZW1haWxUZW1wbGF0ZXMuZnJvbT0nZG9pY2hhaW5AbGUtc3BhY2UuZGUnOyIsImltcG9ydCB7IEFwaSwgRE9JX1dBTExFVE5PVElGWV9ST1VURSwgRE9JX0NPTkZJUk1BVElPTl9ST1VURSB9IGZyb20gJy4uL3Jlc3QuanMnO1xuaW1wb3J0IGNvbmZpcm1PcHRJbiBmcm9tICcuLi8uLi8uLi8uLi9pbXBvcnRzL21vZHVsZXMvc2VydmVyL29wdC1pbnMvY29uZmlybS5qcydcbmltcG9ydCBjaGVja05ld1RyYW5zYWN0aW9uIGZyb20gXCIuLi8uLi8uLi8uLi9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2RvaWNoYWluL2NoZWNrX25ld190cmFuc2FjdGlvbnNcIjtcbmltcG9ydCB7bG9nQ29uZmlybX0gZnJvbSBcIi4uLy4uLy4uLy4uL2ltcG9ydHMvc3RhcnR1cC9zZXJ2ZXIvbG9nLWNvbmZpZ3VyYXRpb25cIjtcbi8vZG9rdSBvZiBtZXRlb3ItcmVzdGl2dXMgaHR0cHM6Ly9naXRodWIuY29tL2thaG1hbGkvbWV0ZW9yLXJlc3RpdnVzXG5BcGkuYWRkUm91dGUoRE9JX0NPTkZJUk1BVElPTl9ST1VURSsnLzpoYXNoJywge2F1dGhSZXF1aXJlZDogZmFsc2V9LCB7XG4gIGdldDoge1xuICAgIGFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBoYXNoID0gdGhpcy51cmxQYXJhbXMuaGFzaDtcbiAgICAgIHRyeSB7XG4gICAgICAgIGxldCBpcCA9IHRoaXMucmVxdWVzdC5oZWFkZXJzWyd4LWZvcndhcmRlZC1mb3InXSB8fFxuICAgICAgICAgIHRoaXMucmVxdWVzdC5jb25uZWN0aW9uLnJlbW90ZUFkZHJlc3MgfHxcbiAgICAgICAgICB0aGlzLnJlcXVlc3Quc29ja2V0LnJlbW90ZUFkZHJlc3MgfHxcbiAgICAgICAgICAodGhpcy5yZXF1ZXN0LmNvbm5lY3Rpb24uc29ja2V0ID8gdGhpcy5yZXF1ZXN0LmNvbm5lY3Rpb24uc29ja2V0LnJlbW90ZUFkZHJlc3M6IG51bGwpO1xuXG4gICAgICAgICAgaWYoaXAuaW5kZXhPZignLCcpIT0tMSlpcD1pcC5zdWJzdHJpbmcoMCxpcC5pbmRleE9mKCcsJykpO1xuXG4gICAgICAgICAgbG9nQ29uZmlybSgnUkVTVCBvcHQtaW4vY29uZmlybSA6Jyx7aGFzaDpoYXNoLCBob3N0OmlwfSk7XG4gICAgICAgICAgY29uc3QgcmVkaXJlY3QgPSBjb25maXJtT3B0SW4oe2hvc3Q6IGlwLCBoYXNoOiBoYXNofSk7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBzdGF0dXNDb2RlOiAzMDMsXG4gICAgICAgICAgaGVhZGVyczogeydDb250ZW50LVR5cGUnOiAndGV4dC9wbGFpbicsICdMb2NhdGlvbic6IHJlZGlyZWN0fSxcbiAgICAgICAgICBib2R5OiAnTG9jYXRpb246ICcrcmVkaXJlY3RcbiAgICAgICAgfTtcbiAgICAgIH0gY2F0Y2goZXJyb3IpIHtcbiAgICAgICAgcmV0dXJuIHtzdGF0dXNDb2RlOiA1MDAsIGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogZXJyb3IubWVzc2FnZX19O1xuICAgICAgfVxuICAgIH1cbiAgfVxufSk7XG5cbkFwaS5hZGRSb3V0ZShET0lfV0FMTEVUTk9USUZZX1JPVVRFLCB7XG4gICAgZ2V0OiB7XG4gICAgICAgIGF1dGhSZXF1aXJlZDogZmFsc2UsXG4gICAgICAgIGFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjb25zdCBwYXJhbXMgPSB0aGlzLnF1ZXJ5UGFyYW1zO1xuICAgICAgICAgICAgY29uc3QgdHhpZCA9IHBhcmFtcy50eDtcblxuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBjaGVja05ld1RyYW5zYWN0aW9uKHR4aWQpO1xuICAgICAgICAgICAgICAgIHJldHVybiB7c3RhdHVzOiAnc3VjY2VzcycsICBkYXRhOid0eGlkOicrdHhpZCsnIHdhcyByZWFkIGZyb20gYmxvY2tjaGFpbid9O1xuICAgICAgICAgICAgfSBjYXRjaChlcnJvcikge1xuICAgICAgICAgICAgICAgIHJldHVybiB7c3RhdHVzOiAnZmFpbCcsIGVycm9yOiBlcnJvci5tZXNzYWdlfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn0pO1xuIiwiaW1wb3J0IHsgQXBpIH0gZnJvbSAnLi4vcmVzdC5qcyc7XG5BcGkuYWRkUm91dGUoJ2RlYnVnL21haWwnLCB7YXV0aFJlcXVpcmVkOiBmYWxzZX0sIHtcbiAgZ2V0OiB7XG4gICAgYWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IGRhdGEgPSB7XG4gICAgICAgIFwiZnJvbVwiOiBcIm5vcmVwbHlAZG9pY2hhaW4ub3JnXCIsXG4gICAgICAgIFwic3ViamVjdFwiOiBcIkRvaWNoYWluLm9yZyBOZXdzbGV0dGVyIEJlc3TDpHRpZ3VuZ1wiLFxuICAgICAgICBcInJlZGlyZWN0XCI6IFwiaHR0cHM6Ly93d3cuZG9pY2hhaW4ub3JnL3ZpZWxlbi1kYW5rL1wiLFxuICAgICAgICBcInJldHVyblBhdGhcIjogXCJub3JlcGx5QGRvaWNoYWluLm9yZ1wiLFxuICAgICAgICBcImNvbnRlbnRcIjpcIjxzdHlsZSB0eXBlPSd0ZXh0L2NzcycgbWVkaWE9J3NjcmVlbic+XFxuXCIgK1xuICAgICAgICAgICAgXCIqIHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGxpbmUtaGVpZ2h0OiBpbmhlcml0O1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwiLkV4dGVybmFsQ2xhc3MgKiB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRsaW5lLWhlaWdodDogMTAwJTtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcImJvZHksIHAge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0bWFyZ2luOiAwO1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0cGFkZGluZzogMDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdG1hcmdpbi1ib3R0b206IDA7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHQtd2Via2l0LXRleHQtc2l6ZS1hZGp1c3Q6IG5vbmU7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHQtbXMtdGV4dC1zaXplLWFkanVzdDogbm9uZTtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcImltZyB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRsaW5lLWhlaWdodDogMTAwJTtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdG91dGxpbmU6IG5vbmU7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHR0ZXh0LWRlY29yYXRpb246IG5vbmU7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHQtbXMtaW50ZXJwb2xhdGlvbi1tb2RlOiBiaWN1YmljO1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwiYSBpbWcge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0Ym9yZGVyOiBub25lO1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwiI2JhY2tncm91bmRUYWJsZSB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRtYXJnaW46IDA7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRwYWRkaW5nOiAwO1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0d2lkdGg6IDEwMCUgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcImEsIGE6bGluaywgLm5vLWRldGVjdC1sb2NhbCBhLCAuYXBwbGVMaW5rcyBhIHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGNvbG9yOiAjNTU1NWZmICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHR0ZXh0LWRlY29yYXRpb246IHVuZGVybGluZTtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcIi5FeHRlcm5hbENsYXNzIHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGRpc3BsYXk6IGJsb2NrICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHR3aWR0aDogMTAwJTtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcIi5FeHRlcm5hbENsYXNzLCAuRXh0ZXJuYWxDbGFzcyBwLCAuRXh0ZXJuYWxDbGFzcyBzcGFuLCAuRXh0ZXJuYWxDbGFzcyBmb250LCAuRXh0ZXJuYWxDbGFzcyB0ZCwgLkV4dGVybmFsQ2xhc3MgZGl2IHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGxpbmUtaGVpZ2h0OiBpbmhlcml0O1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwidGFibGUgdGQge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0Ym9yZGVyLWNvbGxhcHNlOiBjb2xsYXBzZTtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdG1zby10YWJsZS1sc3BhY2U6IDBwdDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdG1zby10YWJsZS1yc3BhY2U6IDBwdDtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcInN1cCB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRwb3NpdGlvbjogcmVsYXRpdmU7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHR0b3A6IDRweDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGxpbmUtaGVpZ2h0OiA3cHggIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGZvbnQtc2l6ZTogMTFweCAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwiLm1vYmlsZV9saW5rIGFbaHJlZl49J3RlbCddLCAubW9iaWxlX2xpbmsgYVtocmVmXj0nc21zJ10ge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0dGV4dC1kZWNvcmF0aW9uOiBkZWZhdWx0O1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0Y29sb3I6ICM1NTU1ZmYgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdHBvaW50ZXItZXZlbnRzOiBhdXRvO1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0Y3Vyc29yOiBkZWZhdWx0O1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwiLm5vLWRldGVjdCBhIHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdHRleHQtZGVjb3JhdGlvbjogbm9uZTtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGNvbG9yOiAjNTU1NWZmO1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0cG9pbnRlci1ldmVudHM6IGF1dG87XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRjdXJzb3I6IGRlZmF1bHQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCJ7XFxuXCIgK1xuICAgICAgICAgICAgXCJjb2xvcjogIzU1NTVmZjtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcInNwYW4ge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0Y29sb3I6IGluaGVyaXQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRib3JkZXItYm90dG9tOiBub25lO1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwic3Bhbjpob3ZlciB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcIi5ub3VuZGVybGluZSB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHR0ZXh0LWRlY29yYXRpb246IG5vbmUgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcImgxLCBoMiwgaDMge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0bWFyZ2luOiAwO1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0cGFkZGluZzogMDtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcInAge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0TWFyZ2luOiAwcHggIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcInRhYmxlW2NsYXNzPSdlbWFpbC1yb290LXdyYXBwZXInXSB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHR3aWR0aDogNjAwcHggIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcImJvZHkge1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwiYm9keSB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRtaW4td2lkdGg6IDI4MHB4O1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0d2lkdGg6IDEwMCU7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCJ0ZFtjbGFzcz0ncGF0dGVybiddIC5jMTEycDIwciB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHR3aWR0aDogMjAlO1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwidGRbY2xhc3M9J3BhdHRlcm4nXSAuYzMzNnA2MHIge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0d2lkdGg6IDYwLjAwMDAwMDAwMDAwMDI1NiU7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCI8L3N0eWxlPlxcblwiICtcbiAgICAgICAgICAgIFwiPHN0eWxlPlxcblwiICtcbiAgICAgICAgICAgIFwiQG1lZGlhIG9ubHkgc2NyZWVuIGFuZCAobWF4LXdpZHRoOiA1OTlweCksIG9ubHkgc2NyZWVuIGFuZCAobWF4LWRldmljZS13aWR0aDogNTk5cHgpLCBvbmx5IHNjcmVlbiBhbmQgKG1heC13aWR0aDogNDAwcHgpLCBvbmx5IHNjcmVlbiBhbmQgKG1heC1kZXZpY2Utd2lkdGg6IDQwMHB4KSB7XFxuXCIgK1xuICAgICAgICAgICAgXCIuZW1haWwtcm9vdC13cmFwcGVyIHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdHdpZHRoOiAxMDAlICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCIuZnVsbC13aWR0aCB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHR3aWR0aDogMTAwJSAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0aGVpZ2h0OiBhdXRvICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHR0ZXh0LWFsaWduOiBjZW50ZXI7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCIuZnVsbHdpZHRoaGFsZmxlZnQge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0d2lkdGg6IDEwMCUgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcIi5mdWxsd2lkdGhoYWxmcmlnaHQge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0d2lkdGg6IDEwMCUgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcIi5mdWxsd2lkdGhoYWxmaW5uZXIge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0d2lkdGg6IDEwMCUgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdG1hcmdpbjogMCBhdXRvICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRmbG9hdDogbm9uZSAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0bWFyZ2luLWxlZnQ6IGF1dG8gIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdG1hcmdpbi1yaWdodDogYXV0byAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0Y2xlYXI6IGJvdGggIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcIi5oaWRlIHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGRpc3BsYXk6IG5vbmUgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdHdpZHRoOiAwcHggIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGhlaWdodDogMHB4ICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRvdmVyZmxvdzogaGlkZGVuO1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwiLmRlc2t0b3AtaGlkZSB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRkaXNwbGF5OiBibG9jayAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0d2lkdGg6IDEwMCUgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGhlaWdodDogYXV0byAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0b3ZlcmZsb3c6IGhpZGRlbjtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdG1heC1oZWlnaHQ6IGluaGVyaXQgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcIi5jMTEycDIwciB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHR3aWR0aDogMTAwJSAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0ZmxvYXQ6IG5vbmU7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCIuYzMzNnA2MHIge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0d2lkdGg6IDEwMCUgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGZsb2F0OiBub25lO1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwiPC9zdHlsZT5cXG5cIiArXG4gICAgICAgICAgICBcIjxzdHlsZT5cXG5cIiArXG4gICAgICAgICAgICBcIkBtZWRpYSBvbmx5IHNjcmVlbiBhbmQgKG1pbi13aWR0aDogNjAwcHgpIHtcXG5cIiArXG4gICAgICAgICAgICBcInRkW2NsYXNzPSdwYXR0ZXJuJ10gLmMxMTJwMjByIHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdHdpZHRoOiAxMTJweCAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwidGRbY2xhc3M9J3BhdHRlcm4nXSAuYzMzNnA2MHIge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0d2lkdGg6IDMzNnB4ICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCJcXG5cIiArXG4gICAgICAgICAgICBcIkBtZWRpYSBvbmx5IHNjcmVlbiBhbmQgKG1heC13aWR0aDogNTk5cHgpLCBvbmx5IHNjcmVlbiBhbmQgKG1heC1kZXZpY2Utd2lkdGg6IDU5OXB4KSwgb25seSBzY3JlZW4gYW5kIChtYXgtd2lkdGg6IDQwMHB4KSwgb25seSBzY3JlZW4gYW5kIChtYXgtZGV2aWNlLXdpZHRoOiA0MDBweCkge1xcblwiICtcbiAgICAgICAgICAgIFwidGFibGVbY2xhc3M9J2VtYWlsLXJvb3Qtd3JhcHBlciddIHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdHdpZHRoOiAxMDAlICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCJ0ZFtjbGFzcz0nd3JhcCddIC5mdWxsLXdpZHRoIHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdHdpZHRoOiAxMDAlICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRoZWlnaHQ6IGF1dG8gIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcInRkW2NsYXNzPSd3cmFwJ10gLmZ1bGx3aWR0aGhhbGZsZWZ0IHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdHdpZHRoOiAxMDAlICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCJ0ZFtjbGFzcz0nd3JhcCddIC5mdWxsd2lkdGhoYWxmcmlnaHQge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0d2lkdGg6IDEwMCUgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcInRkW2NsYXNzPSd3cmFwJ10gLmZ1bGx3aWR0aGhhbGZpbm5lciB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHR3aWR0aDogMTAwJSAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0bWFyZ2luOiAwIGF1dG8gIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGZsb2F0OiBub25lICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRtYXJnaW4tbGVmdDogYXV0byAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0bWFyZ2luLXJpZ2h0OiBhdXRvICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRjbGVhcjogYm90aCAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwidGRbY2xhc3M9J3dyYXAnXSAuaGlkZSB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRkaXNwbGF5OiBub25lICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHR3aWR0aDogMHB4O1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0aGVpZ2h0OiAwcHg7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRvdmVyZmxvdzogaGlkZGVuO1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwidGRbY2xhc3M9J3BhdHRlcm4nXSAuYzExMnAyMHIge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0d2lkdGg6IDEwMCUgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcInRkW2NsYXNzPSdwYXR0ZXJuJ10gLmMzMzZwNjByIHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdHdpZHRoOiAxMDAlICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCJcXG5cIiArXG4gICAgICAgICAgICBcIkBtZWRpYSB5YWhvbyB7XFxuXCIgK1xuICAgICAgICAgICAgXCJ0YWJsZSB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRmbG9hdDogbm9uZSAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0aGVpZ2h0OiBhdXRvO1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwidGFibGVbYWxpZ249J2xlZnQnXSB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRmbG9hdDogbGVmdCAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwidGRbYWxpZ249J2xlZnQnXSB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRmbG9hdDogbGVmdCAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0aGVpZ2h0OiBhdXRvO1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwidGFibGVbYWxpZ249J2NlbnRlciddIHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdG1hcmdpbjogMCBhdXRvO1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwidGRbYWxpZ249J2NlbnRlciddIHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdG1hcmdpbjogMCBhdXRvO1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0aGVpZ2h0OiBhdXRvO1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwidGFibGVbYWxpZ249J3JpZ2h0J10ge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0ZmxvYXQ6IHJpZ2h0ICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCJ0ZFthbGlnbj0ncmlnaHQnXSB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRmbG9hdDogcmlnaHQgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGhlaWdodDogYXV0bztcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcIjwvc3R5bGU+XFxuXCIgK1xuICAgICAgICAgICAgXCJcXG5cIiArXG4gICAgICAgICAgICBcIjwhLS1baWYgKGd0ZSBJRSA3KSAmICh2bWwpXT5cXG5cIiArXG4gICAgICAgICAgICBcIjxzdHlsZSB0eXBlPSd0ZXh0L2Nzcyc+XFxuXCIgK1xuICAgICAgICAgICAgXCJodG1sLCBib2R5IHttYXJnaW46MCAhaW1wb3J0YW50OyBwYWRkaW5nOjBweCAhaW1wb3J0YW50O31cXG5cIiArXG4gICAgICAgICAgICBcImltZy5mdWxsLXdpZHRoIHsgcG9zaXRpb246IHJlbGF0aXZlICFpbXBvcnRhbnQ7IH1cXG5cIiArXG4gICAgICAgICAgICBcIlxcblwiICtcbiAgICAgICAgICAgIFwiLmltZzI0MHgzMCB7IHdpZHRoOiAyNDBweCAhaW1wb3J0YW50OyBoZWlnaHQ6IDMwcHggIWltcG9ydGFudDt9XFxuXCIgK1xuICAgICAgICAgICAgXCIuaW1nMjB4MjAgeyB3aWR0aDogMjBweCAhaW1wb3J0YW50OyBoZWlnaHQ6IDIwcHggIWltcG9ydGFudDt9XFxuXCIgK1xuICAgICAgICAgICAgXCJcXG5cIiArXG4gICAgICAgICAgICBcIjwvc3R5bGU+XFxuXCIgK1xuICAgICAgICAgICAgXCI8IVtlbmRpZl0tLT5cXG5cIiArXG4gICAgICAgICAgICBcIlxcblwiICtcbiAgICAgICAgICAgIFwiPCEtLVtpZiBndGUgbXNvIDldPlxcblwiICtcbiAgICAgICAgICAgIFwiPHN0eWxlIHR5cGU9J3RleHQvY3NzJz5cXG5cIiArXG4gICAgICAgICAgICBcIi5tc28tZm9udC1maXgtYXJpYWwgeyBmb250LWZhbWlseTogQXJpYWwsIHNhbnMtc2VyaWY7fVxcblwiICtcbiAgICAgICAgICAgIFwiLm1zby1mb250LWZpeC1nZW9yZ2lhIHsgZm9udC1mYW1pbHk6IEdlb3JnaWEsIHNhbnMtc2VyaWY7fVxcblwiICtcbiAgICAgICAgICAgIFwiLm1zby1mb250LWZpeC10YWhvbWEgeyBmb250LWZhbWlseTogVGFob21hLCBzYW5zLXNlcmlmO31cXG5cIiArXG4gICAgICAgICAgICBcIi5tc28tZm9udC1maXgtdGltZXNfbmV3X3JvbWFuIHsgZm9udC1mYW1pbHk6ICdUaW1lcyBOZXcgUm9tYW4nLCBzYW5zLXNlcmlmO31cXG5cIiArXG4gICAgICAgICAgICBcIi5tc28tZm9udC1maXgtdHJlYnVjaGV0X21zIHsgZm9udC1mYW1pbHk6ICdUcmVidWNoZXQgTVMnLCBzYW5zLXNlcmlmO31cXG5cIiArXG4gICAgICAgICAgICBcIi5tc28tZm9udC1maXgtdmVyZGFuYSB7IGZvbnQtZmFtaWx5OiBWZXJkYW5hLCBzYW5zLXNlcmlmO31cXG5cIiArXG4gICAgICAgICAgICBcIjwvc3R5bGU+XFxuXCIgK1xuICAgICAgICAgICAgXCI8IVtlbmRpZl0tLT5cXG5cIiArXG4gICAgICAgICAgICBcIlxcblwiICtcbiAgICAgICAgICAgIFwiPCEtLVtpZiBndGUgbXNvIDldPlxcblwiICtcbiAgICAgICAgICAgIFwiPHN0eWxlIHR5cGU9J3RleHQvY3NzJz5cXG5cIiArXG4gICAgICAgICAgICBcInRhYmxlLCB0ZCB7XFxuXCIgK1xuICAgICAgICAgICAgXCJib3JkZXItY29sbGFwc2U6IGNvbGxhcHNlICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJtc28tdGFibGUtbHNwYWNlOiAwcHggIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIm1zby10YWJsZS1yc3BhY2U6IDBweCAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwiXFxuXCIgK1xuICAgICAgICAgICAgXCIuZW1haWwtcm9vdC13cmFwcGVyIHsgd2lkdGggNjAwcHggIWltcG9ydGFudDt9XFxuXCIgK1xuICAgICAgICAgICAgXCIuaW1nbGluayB7IGZvbnQtc2l6ZTogMHB4OyB9XFxuXCIgK1xuICAgICAgICAgICAgXCIuZWRtX2J1dHRvbiB7IGZvbnQtc2l6ZTogMHB4OyB9XFxuXCIgK1xuICAgICAgICAgICAgXCI8L3N0eWxlPlxcblwiICtcbiAgICAgICAgICAgIFwiPCFbZW5kaWZdLS0+XFxuXCIgK1xuICAgICAgICAgICAgXCJcXG5cIiArXG4gICAgICAgICAgICBcIjwhLS1baWYgZ3RlIG1zbyAxNV0+XFxuXCIgK1xuICAgICAgICAgICAgXCI8c3R5bGUgdHlwZT0ndGV4dC9jc3MnPlxcblwiICtcbiAgICAgICAgICAgIFwidGFibGUge1xcblwiICtcbiAgICAgICAgICAgIFwiZm9udC1zaXplOjBweDtcXG5cIiArXG4gICAgICAgICAgICBcIm1zby1tYXJnaW4tdG9wLWFsdDowcHg7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCJcXG5cIiArXG4gICAgICAgICAgICBcIi5mdWxsd2lkdGhoYWxmbGVmdCB7XFxuXCIgK1xuICAgICAgICAgICAgXCJ3aWR0aDogNDklICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJmbG9hdDpsZWZ0ICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCJcXG5cIiArXG4gICAgICAgICAgICBcIi5mdWxsd2lkdGhoYWxmcmlnaHQge1xcblwiICtcbiAgICAgICAgICAgIFwid2lkdGg6IDUwJSAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwiZmxvYXQ6cmlnaHQgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcIjwvc3R5bGU+XFxuXCIgK1xuICAgICAgICAgICAgXCI8IVtlbmRpZl0tLT5cXG5cIiArXG4gICAgICAgICAgICBcIjxzdHlsZSB0eXBlPSd0ZXh0L2NzcycgbWVkaWE9Jyhwb2ludGVyKSBhbmQgKG1pbi1jb2xvci1pbmRleDowKSc+XFxuXCIgK1xuICAgICAgICAgICAgXCJodG1sLCBib2R5IHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGJhY2tncm91bmQtaW1hZ2U6IG5vbmUgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGJhY2tncm91bmQtY29sb3I6ICNlYmViZWIgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdG1hcmdpbjogMCAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0cGFkZGluZzogMCAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwiPC9zdHlsZT5cXG5cIiArXG4gICAgICAgICAgICBcIjwvaGVhZD5cXG5cIiArXG4gICAgICAgICAgICBcIjxib2R5IGxlZnRtYXJnaW49JzAnIG1hcmdpbndpZHRoPScwJyB0b3BtYXJnaW49JzAnIG1hcmdpbmhlaWdodD0nMCcgb2Zmc2V0PScwJyBiYWNrZ3JvdW5kPVxcXCJcXFwiIGJnY29sb3I9JyNlYmViZWInIHN0eWxlPSdmb250LWZhbWlseTpBcmlhbCwgc2Fucy1zZXJpZjsgZm9udC1zaXplOjBweDttYXJnaW46MDtwYWRkaW5nOjA7ICc+XFxuXCIgK1xuICAgICAgICAgICAgXCI8IS0tW2lmIHRdPjwhW2VuZGlmXS0tPjwhLS1baWYgdF0+PCFbZW5kaWZdLS0+PCEtLVtpZiB0XT48IVtlbmRpZl0tLT48IS0tW2lmIHRdPjwhW2VuZGlmXS0tPjwhLS1baWYgdF0+PCFbZW5kaWZdLS0+PCEtLVtpZiB0XT48IVtlbmRpZl0tLT5cXG5cIiArXG4gICAgICAgICAgICBcIjx0YWJsZSBhbGlnbj0nY2VudGVyJyBib3JkZXI9JzAnIGNlbGxwYWRkaW5nPScwJyBjZWxsc3BhY2luZz0nMCcgYmFja2dyb3VuZD1cXFwiXFxcIiAgaGVpZ2h0PScxMDAlJyB3aWR0aD0nMTAwJScgaWQ9J2JhY2tncm91bmRUYWJsZSc+XFxuXCIgK1xuICAgICAgICAgICAgXCIgIDx0cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICA8dGQgY2xhc3M9J3dyYXAnIGFsaWduPSdjZW50ZXInIHZhbGlnbj0ndG9wJyB3aWR0aD0nMTAwJSc+XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRcXHQ8Y2VudGVyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICA8IS0tIGNvbnRlbnQgLS0+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgIFxcdDxkaXYgc3R5bGU9J3BhZGRpbmc6IDBweDsnPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICBcXHQgIDx0YWJsZSBjZWxscGFkZGluZz0nMCcgY2VsbHNwYWNpbmc9JzAnIGJvcmRlcj0nMCcgd2lkdGg9JzEwMCUnIGJnY29sb3I9JyNlYmViZWInPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICBcXHRcXHQgPHRyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgXFx0XFx0ICA8dGQgdmFsaWduPSd0b3AnIHN0eWxlPSdwYWRkaW5nOiAwcHg7Jz5cXG5cIiArXG4gICAgICAgICAgICBcIlxcdFxcdFxcdFxcdFxcdFxcdCAgPHRhYmxlIGNlbGxwYWRkaW5nPScwJyBjZWxsc3BhY2luZz0nMCcgd2lkdGg9JzYwMCcgYWxpZ249J2NlbnRlcicgc3R5bGU9J21heC13aWR0aDogNjAwcHg7bWluLXdpZHRoOiAyNDBweDttYXJnaW46IDAgYXV0bzsnIGNsYXNzPSdlbWFpbC1yb290LXdyYXBwZXInPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICBcXHRcXHQgXFx0XFx0PHRyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgIFxcdFxcdFxcdFxcdFxcdCA8dGQgdmFsaWduPSd0b3AnIHN0eWxlPSdwYWRkaW5nOiAwcHg7Jz5cXG5cIiArXG4gICAgICAgICAgICBcIlxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdCBcXHRcXHQ8dGFibGUgY2VsbHBhZGRpbmc9JzAnIGNlbGxzcGFjaW5nPScwJyBib3JkZXI9JzAnIHdpZHRoPScxMDAlJyBiZ2NvbG9yPScjRkZGRkZGJyBzdHlsZT0nYm9yZGVyOiAwcHggbm9uZTtiYWNrZ3JvdW5kLWNvbG9yOiAjRkZGRkZGOyc+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgIFxcdFxcdFxcdFxcdFxcdFxcdCA8dHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgIFxcdFxcdFxcdCAgXFx0XFx0XFx0XFx0IDx0ZCB2YWxpZ249J3RvcCcgc3R5bGU9J3BhZGRpbmctdG9wOiAzMHB4O3BhZGRpbmctcmlnaHQ6IDIwcHg7cGFkZGluZy1ib3R0b206IDM1cHg7cGFkZGluZy1sZWZ0OiAyMHB4Oyc+XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHQgICBcXHRcXHRcXHRcXHRcXG5cIiArXG4gICAgICAgICAgICBcIlxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdDx0YWJsZSBjZWxscGFkZGluZz0nMCdcXG5cIiArXG4gICAgICAgICAgICBcIlxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdGNlbGxzcGFjaW5nPScwJyBib3JkZXI9JzAnIGFsaWduPSdjZW50ZXInIHdpZHRoPScyNDAnICBzdHlsZT0nYm9yZGVyOiAwcHggbm9uZTtoZWlnaHQ6IGF1dG87JyBjbGFzcz0nZnVsbC13aWR0aCc+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxcdCBcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHQ8dHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdDx0ZCB2YWxpZ249J3RvcCcgc3R5bGU9J3BhZGRpbmc6IDBweDsnPjxpbWcgc3JjPSdodHRwczovL3NmMjYuc2VuZHNmeC5jb20vYWRtaW4vdGVtcC91c2VyLzE3L2RvaWNoYWluXzEwMGgucG5nJyB3aWR0aD0nMjQwJyBoZWlnaHQ9JzMwJyBhbHQ9XFxcIlxcXCIgYm9yZGVyPScwJyBzdHlsZT0nZGlzcGxheTogYmxvY2s7d2lkdGg6IDEwMCU7aGVpZ2h0OiBhdXRvOycgY2xhc3M9J2Z1bGwtd2lkdGggaW1nMjQweDMwJyAvPjwvdGQ+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxcdCBcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHQ8L3RyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdDwvdGFibGU+XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXG5cIiArXG4gICAgICAgICAgICBcIlxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdDwvdGQ+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgXFx0XFx0ICBcXHRcXHRcXHRcXHQ8L3RyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgIFxcdFxcdFxcdFxcdFxcdDwvdGFibGU+XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHQgXFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHQgXFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgPHRhYmxlIGNlbGxwYWRkaW5nPScwJyBjZWxsc3BhY2luZz0nMCcgYm9yZGVyPScwJyB3aWR0aD0nMTAwJScgYmdjb2xvcj0nIzAwNzFhYScgc3R5bGU9J2JvcmRlcjogMHB4IG5vbmU7YmFja2dyb3VuZC1jb2xvcjogIzAwNzFhYTtiYWNrZ3JvdW5kLWltYWdlOiB1cmwoJ2h0dHBzOi8vc2YyNi5zZW5kc2Z4LmNvbS9hZG1pbi90ZW1wL3VzZXIvMTcvYmx1ZS1iZy5qcGcnKTtiYWNrZ3JvdW5kLXJlcGVhdDogbm8tcmVwZWF0IDtiYWNrZ3JvdW5kLXBvc2l0aW9uOiBjZW50ZXI7Jz5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIHZhbGlnbj0ndG9wJyBzdHlsZT0ncGFkZGluZy10b3A6IDQwcHg7cGFkZGluZy1yaWdodDogMjBweDtwYWRkaW5nLWJvdHRvbTogNDVweDtwYWRkaW5nLWxlZnQ6IDIwcHg7Jz48dGFibGUgY2VsbHBhZGRpbmc9JzAnIGNlbGxzcGFjaW5nPScwJyB3aWR0aD0nMTAwJSc+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBzdHlsZT0ncGFkZGluZzogMHB4OycgY2xhc3M9J3BhdHRlcm4nPjx0YWJsZSBjZWxscGFkZGluZz0nMCcgY2VsbHNwYWNpbmc9JzAnIGJvcmRlcj0nMCcgd2lkdGg9JzEwMCUnPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgdmFsaWduPSd0b3AnIHN0eWxlPSdwYWRkaW5nLWJvdHRvbTogMTBweDsnPjxkaXYgc3R5bGU9J3RleHQtYWxpZ246IGxlZnQ7Zm9udC1mYW1pbHk6IGFyaWFsO2ZvbnQtc2l6ZTogMjBweDtjb2xvcjogI2ZmZmZmZjtsaW5lLWhlaWdodDogMzBweDttc28tbGluZS1oZWlnaHQ6IGV4YWN0bHk7bXNvLXRleHQtcmFpc2U6IDVweDsnPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHBcXG5cIiArXG4gICAgICAgICAgICBcInN0eWxlPSdwYWRkaW5nOiAwOyBtYXJnaW46IDA7dGV4dC1hbGlnbjogY2VudGVyOyc+Qml0dGUgYmVzdMOkdGlnZW4gU2llIElocmUgQW5tZWxkdW5nPC9wPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PjwvdGQ+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGFibGU+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRhYmxlIGNlbGxwYWRkaW5nPScwJyBjZWxsc3BhY2luZz0nMCcgYm9yZGVyPScwJyB3aWR0aD0nMTAwJSc+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCB2YWxpZ249J3RvcCcgc3R5bGU9J3BhZGRpbmc6IDA7bXNvLWNlbGxzcGFjaW5nOiAwaW47Jz48dGFibGUgY2VsbHBhZGRpbmc9JzAnIGNlbGxzcGFjaW5nPScwJyBib3JkZXI9JzAnIGFsaWduPSdsZWZ0JyB3aWR0aD0nMTEyJyAgc3R5bGU9J2Zsb2F0OiBsZWZ0OycgY2xhc3M9J2MxMTJwMjByJz5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIHZhbGlnbj0ndG9wJyBzdHlsZT0ncGFkZGluZzogMHB4Oyc+PHRhYmxlIGNlbGxwYWRkaW5nPScwJyBjZWxsc3BhY2luZz0nMCcgYm9yZGVyPScwJyB3aWR0aD0nMTAwJScgc3R5bGU9J2JvcmRlcjogMHB4IG5vbmU7JyBjbGFzcz0naGlkZSc+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCB2YWxpZ249J3RvcCcgc3R5bGU9J3BhZGRpbmc6IDBweDsnPjx0YWJsZSBjZWxscGFkZGluZz0nMCcgY2VsbHNwYWNpbmc9JzAnIHdpZHRoPScxMDAlJz5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIHN0eWxlPSdwYWRkaW5nOiAwcHg7Jz48dGFibGUgY2VsbHBhZGRpbmc9JzAnIGNlbGxzcGFjaW5nPScwJyB3aWR0aD0nMTAwJSc+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBhbGlnbj0nY2VudGVyJyBzdHlsZT0ncGFkZGluZzogMHB4Oyc+PHRhYmxlIGNlbGxwYWRkaW5nPScwJyBjZWxsc3BhY2luZz0nMCcgYm9yZGVyPScwJyBhbGlnbj0nY2VudGVyJyB3aWR0aD0nMjAnICBzdHlsZT0nYm9yZGVyOiAwcHggbm9uZTtoZWlnaHQ6IGF1dG87Jz5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIHZhbGlnbj0ndG9wJyBzdHlsZT0ncGFkZGluZzogMHB4Oyc+PGltZ1xcblwiICtcbiAgICAgICAgICAgIFwic3JjPSdodHRwczovL3NmMjYuc2VuZHNmeC5jb20vYWRtaW4vdGVtcC91c2VyLzE3L2ltZ184OTgzNzMxOC5wbmcnIHdpZHRoPScyMCcgaGVpZ2h0PScyMCcgYWx0PVxcXCJcXFwiIGJvcmRlcj0nMCcgc3R5bGU9J2Rpc3BsYXk6IGJsb2NrOycgY2xhc3M9J2ltZzIweDIwJyAvPjwvdGQ+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGFibGU+PC90ZD5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90YWJsZT48L3RkPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RhYmxlPjwvdGQ+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGFibGU+PC90ZD5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90YWJsZT5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8IS0tW2lmIGd0ZSBtc28gOV0+PC90ZD48dGQgdmFsaWduPSd0b3AnIHN0eWxlPSdwYWRkaW5nOjA7Jz48IVtlbmRpZl0tLT5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGFibGUgY2VsbHBhZGRpbmc9JzAnIGNlbGxzcGFjaW5nPScwJyBib3JkZXI9JzAnIGFsaWduPSdsZWZ0JyB3aWR0aD0nMzM2JyAgc3R5bGU9J2Zsb2F0OiBsZWZ0OycgY2xhc3M9J2MzMzZwNjByJz5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIHZhbGlnbj0ndG9wJyBzdHlsZT0ncGFkZGluZzogMHB4Oyc+PHRhYmxlIGNlbGxwYWRkaW5nPScwJyBjZWxsc3BhY2luZz0nMCcgYm9yZGVyPScwJyB3aWR0aD0nMTAwJSc+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCB2YWxpZ249J3RvcCcgc3R5bGU9J3BhZGRpbmctYm90dG9tOiAzMHB4Oyc+PHRhYmxlIGNlbGxwYWRkaW5nPScwJyBjZWxsc3BhY2luZz0nMCcgd2lkdGg9JzEwMCUnPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgc3R5bGU9J3BhZGRpbmc6IDBweDsnPjx0YWJsZSBjZWxscGFkZGluZz0nMCcgY2VsbHNwYWNpbmc9JzAnIGJvcmRlcj0nMCcgd2lkdGg9JzEwMCUnIHN0eWxlPSdib3JkZXItdG9wOiAycHggc29saWQgI2ZmZmZmZjsnPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgdmFsaWduPSd0b3AnPjx0YWJsZSBjZWxscGFkZGluZz0nMCcgY2VsbHNwYWNpbmc9JzAnIHdpZHRoPScxMDAlJz5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIHN0eWxlPSdwYWRkaW5nOiAwcHg7Jz48L3RkPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RhYmxlPjwvdGQ+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGFibGU+PC90ZD5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90YWJsZT48L3RkPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RhYmxlPjwvdGQ+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGFibGU+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPCEtLVtpZiBndGUgbXNvIDldPjwvdGQ+PHRkIHZhbGlnbj0ndG9wJyBzdHlsZT0ncGFkZGluZzowOyc+PCFbZW5kaWZdLS0+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRhYmxlIGNlbGxwYWRkaW5nPScwJyBjZWxsc3BhY2luZz0nMCcgYm9yZGVyPScwJyBhbGlnbj0nbGVmdCcgd2lkdGg9JzExMicgIHN0eWxlPSdmbG9hdDogbGVmdDsnIGNsYXNzPSdjMTEycDIwcic+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCB2YWxpZ249J3RvcCcgc3R5bGU9J3BhZGRpbmc6IDBweDsnPjx0YWJsZSBjZWxscGFkZGluZz0nMCcgY2VsbHNwYWNpbmc9JzAnIGJvcmRlcj0nMCcgd2lkdGg9JzEwMCUnIHN0eWxlPSdib3JkZXI6IDBweCBub25lOycgY2xhc3M9J2hpZGUnPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgdmFsaWduPSd0b3AnIHN0eWxlPSdwYWRkaW5nOiAwcHg7Jz48dGFibGUgY2VsbHBhZGRpbmc9JzAnIGNlbGxzcGFjaW5nPScwJyB3aWR0aD0nMTAwJSc+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBzdHlsZT0ncGFkZGluZzogMHB4Oyc+PHRhYmxlIGNlbGxwYWRkaW5nPScwJyBjZWxsc3BhY2luZz0nMCcgd2lkdGg9JzEwMCUnPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgYWxpZ249J2NlbnRlcicgc3R5bGU9J3BhZGRpbmc6IDBweDsnPjx0YWJsZSBjZWxscGFkZGluZz0nMCcgY2VsbHNwYWNpbmc9JzAnIGJvcmRlcj0nMCcgYWxpZ249J2NlbnRlcicgd2lkdGg9JzIwJyAgc3R5bGU9J2JvcmRlcjogMHB4IG5vbmU7aGVpZ2h0OiBhdXRvOyc+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCB2YWxpZ249J3RvcCcgc3R5bGU9J3BhZGRpbmc6IDBweDsnPjxpbWcgc3JjPSdodHRwczovL3NmMjYuc2VuZHNmeC5jb20vYWRtaW4vdGVtcC91c2VyLzE3L2ltZ184OTgzNzMxOC5wbmcnIHdpZHRoPScyMCcgaGVpZ2h0PScyMCcgYWx0PVxcXCJcXFwiIGJvcmRlcj0nMCcgc3R5bGU9J2Rpc3BsYXk6IGJsb2NrOycgY2xhc3M9J2ltZzIweDIwJ1xcblwiICtcbiAgICAgICAgICAgIFwiLz48L3RkPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RhYmxlPjwvdGQ+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGFibGU+PC90ZD5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90YWJsZT48L3RkPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RhYmxlPjwvdGQ+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGFibGU+PC90ZD5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90YWJsZT5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGFibGUgY2VsbHBhZGRpbmc9JzAnIGNlbGxzcGFjaW5nPScwJyBib3JkZXI9JzAnIHdpZHRoPScxMDAlJz5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIHZhbGlnbj0ndG9wJyBzdHlsZT0ncGFkZGluZy1ib3R0b206IDIwcHg7Jz48ZGl2IHN0eWxlPSd0ZXh0LWFsaWduOiBsZWZ0O2ZvbnQtZmFtaWx5OiBhcmlhbDtmb250LXNpemU6IDE2cHg7Y29sb3I6ICNmZmZmZmY7bGluZS1oZWlnaHQ6IDI2cHg7bXNvLWxpbmUtaGVpZ2h0OiBleGFjdGx5O21zby10ZXh0LXJhaXNlOiA1cHg7Jz5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwIHN0eWxlPSdwYWRkaW5nOiAwOyBtYXJnaW46IDA7dGV4dC1hbGlnbjogY2VudGVyOyc+VmllbGVuIERhbmssIGRhc3MgU2llIHNpY2ggZsO8ciB1bnNlcmVuIE5ld3NsZXR0ZXIgYW5nZW1lbGRldCBoYWJlbi48L3A+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cCBzdHlsZT0ncGFkZGluZzogMDsgbWFyZ2luOiAwO3RleHQtYWxpZ246IGNlbnRlcjsnPlVtIGRpZXNlIEUtTWFpbC1BZHJlc3NlIHVuZCBJaHJlIGtvc3Rlbmxvc2UgQW5tZWxkdW5nIHp1IGJlc3TDpHRpZ2VuLCBrbGlja2VuIFNpZSBiaXR0ZSBqZXR6dCBhdWYgZGVuIGZvbGdlbmRlbiBCdXR0b246PC9wPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PjwvdGQ+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGFibGU+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRhYmxlIGNlbGxwYWRkaW5nPScwJyBjZWxsc3BhY2luZz0nMCcgd2lkdGg9JzEwMCUnPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgYWxpZ249J2NlbnRlcicgc3R5bGU9J3BhZGRpbmc6IDBweDsnPjx0YWJsZSBjZWxscGFkZGluZz0nMCcgY2VsbHNwYWNpbmc9JzAnIGJvcmRlcj0nMCcgYWxpZ249J2NlbnRlcicgc3R5bGU9J3RleHQtYWxpZ246IGNlbnRlcjtjb2xvcjogIzAwMDsnIGNsYXNzPSdmdWxsLXdpZHRoJz5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIHZhbGlnbj0ndG9wJyBhbGlnbj0nY2VudGVyJyBzdHlsZT0ncGFkZGluZy1yaWdodDogMTBweDtwYWRkaW5nLWJvdHRvbTogMzBweDtwYWRkaW5nLWxlZnQ6IDEwcHg7Jz48dGFibGUgY2VsbHBhZGRpbmc9JzAnIGNlbGxzcGFjaW5nPScwJyBib3JkZXI9JzAnIGJnY29sb3I9JyM4NWFjMWMnIHN0eWxlPSdib3JkZXI6IDBweCBub25lO2JvcmRlci1yYWRpdXM6IDVweDtib3JkZXItY29sbGFwc2U6IHNlcGFyYXRlICFpbXBvcnRhbnQ7YmFja2dyb3VuZC1jb2xvcjogIzg1YWMxYzsnIGNsYXNzPSdmdWxsLXdpZHRoJz5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIHZhbGlnbj0ndG9wJyBhbGlnbj0nY2VudGVyJyBzdHlsZT0ncGFkZGluZzogMTJweDsnPjxhIGhyZWY9JyR7Y29uZmlybWF0aW9uX3VybH0nIHRhcmdldD0nX2JsYW5rJyBzdHlsZT0ndGV4dC1kZWNvcmF0aW9uOiBub25lOycgY2xhc3M9J2VkbV9idXR0b24nPjxzcGFuIHN0eWxlPSdmb250LWZhbWlseTogYXJpYWw7Zm9udC1zaXplOiAxOHB4O2NvbG9yOiAjZmZmZmZmO2xpbmUtaGVpZ2h0OiAyOHB4O3RleHQtZGVjb3JhdGlvbjogbm9uZTsnPjxzcGFuXFxuXCIgK1xuICAgICAgICAgICAgXCJzdHlsZT0nZm9udC1zaXplOiAxOHB4Oyc+SmV0enQgQW5tZWxkdW5nIGJlc3QmYXVtbDt0aWdlbjwvc3Bhbj48L3NwYW4+IDwvYT48L3RkPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RhYmxlPjwvdGQ+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGFibGU+PC90ZD5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90YWJsZT5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPSd0ZXh0LWFsaWduOiBsZWZ0O2ZvbnQtZmFtaWx5OiBhcmlhbDtmb250LXNpemU6IDEycHg7Y29sb3I6ICNmZmZmZmY7bGluZS1oZWlnaHQ6IDIycHg7bXNvLWxpbmUtaGVpZ2h0OiBleGFjdGx5O21zby10ZXh0LXJhaXNlOiA1cHg7Jz5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwIHN0eWxlPSdwYWRkaW5nOiAwOyBtYXJnaW46IDA7dGV4dC1hbGlnbjogY2VudGVyOyc+V2VubiBTaWUgaWhyZSBFLU1haWwtQWRyZXNzZSBuaWNodCBiZXN0w6R0aWdlbiwga8O2bm5lbiBrZWluZSBOZXdzbGV0dGVyIHp1Z2VzdGVsbHQgd2VyZGVuLiBJaHIgRWludmVyc3TDpG5kbmlzIGvDtm5uZW4gU2llIHNlbGJzdHZlcnN0w6RuZGxpY2ggamVkZXJ6ZWl0IHdpZGVycnVmZW4uIFNvbGx0ZSBlcyBzaWNoIGJlaSBkZXIgQW5tZWxkdW5nIHVtIGVpbiBWZXJzZWhlbiBoYW5kZWxuIG9kZXIgd3VyZGUgZGVyIE5ld3NsZXR0ZXIgbmljaHQgaW4gSWhyZW0gTmFtZW4gYmVzdGVsbHQsIGvDtm5uZW4gU2llIGRpZXNlIEUtTWFpbCBlaW5mYWNoIGlnbm9yaWVyZW4uIElobmVuIHdlcmRlbiBrZWluZSB3ZWl0ZXJlbiBOYWNocmljaHRlbiB6dWdlc2NoaWNrdC48L3A+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+PC90ZD5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90YWJsZT48L3RkPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICA8L3RhYmxlPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgIDx0YWJsZSBjZWxscGFkZGluZz0nMCcgY2VsbHNwYWNpbmc9JzAnIGJvcmRlcj0nMCcgd2lkdGg9JzEwMCUnIGJnY29sb3I9JyNmZmZmZmYnIHN0eWxlPSdib3JkZXI6IDBweCBub25lO2JhY2tncm91bmQtY29sb3I6ICNmZmZmZmY7Jz5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIHZhbGlnbj0ndG9wJyBzdHlsZT0ncGFkZGluZy10b3A6IDMwcHg7cGFkZGluZy1yaWdodDogMjBweDtwYWRkaW5nLWJvdHRvbTogMzVweDtwYWRkaW5nLWxlZnQ6IDIwcHg7Jz48dGFibGUgY2VsbHBhZGRpbmc9JzAnIGNlbGxzcGFjaW5nPScwJyB3aWR0aD0nMTAwJSc+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBzdHlsZT0ncGFkZGluZzogMHB4Oyc+PHRhYmxlIGNlbGxwYWRkaW5nPScwJyBjZWxsc3BhY2luZz0nMCcgYm9yZGVyPScwJyB3aWR0aD0nMTAwJSc+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCB2YWxpZ249J3RvcCcgc3R5bGU9J3BhZGRpbmctYm90dG9tOiAyNXB4Oyc+PGRpdiBzdHlsZT0ndGV4dC1hbGlnbjogbGVmdDtmb250LWZhbWlseTogYXJpYWw7Zm9udC1zaXplOiAxMnB4O2NvbG9yOiAjMzMzMzMzO2xpbmUtaGVpZ2h0OiAyMnB4O21zby1saW5lLWhlaWdodDogZXhhY3RseTttc28tdGV4dC1yYWlzZTogNXB4Oyc+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cCBzdHlsZT0ncGFkZGluZzogMDsgbWFyZ2luOiAwO3RleHQtYWxpZ246IGNlbnRlcjsnPjxzcGFuIHN0eWxlPSdsaW5lLWhlaWdodDogMzsnPjxzdHJvbmc+S29udGFrdDwvc3Ryb25nPjwvc3Bhbj48YnI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlcnZpY2VAc2VuZGVmZmVjdC5kZTxicj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd3d3LnNlbmRlZmZlY3QuZGU8YnI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRlbGVmb246ICs0OSAoMCkgODU3MSAtIDk3IDM5IC0gNjktMDwvcD5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj48L3RkPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RhYmxlPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9J3RleHQtYWxpZ246IGxlZnQ7Zm9udC1mYW1pbHk6IGFyaWFsO2ZvbnQtc2l6ZTogMTJweDtjb2xvcjogIzMzMzMzMztsaW5lLWhlaWdodDogMjJweDttc28tbGluZS1oZWlnaHQ6IGV4YWN0bHk7bXNvLXRleHQtcmFpc2U6IDVweDsnPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHAgc3R5bGU9J3BhZGRpbmc6IDA7IG1hcmdpbjogMDt0ZXh0LWFsaWduOiBjZW50ZXI7Jz48c3BhbiBzdHlsZT0nbGluZS1oZWlnaHQ6IDM7Jz48c3Ryb25nPkltcHJlc3N1bTwvc3Ryb25nPjwvc3Bhbj48YnI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFuc2NocmlmdDogU2NodWxnYXNzZSA1LCBELTg0MzU5IFNpbWJhY2ggYW0gSW5uLCBlTWFpbDogc2VydmljZUBzZW5kZWZmZWN0LmRlPGJyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBCZXRyZWliZXI6IFdFQmFuaXplciBBRywgUmVnaXN0ZXJnZXJpY2h0OiBBbXRzZ2VyaWNodCBMYW5kc2h1dCBIUkIgNTE3NywgVXN0SWQuOiBERSAyMDY4IDYyIDA3MDxicj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVm9yc3RhbmQ6IE90dG1hciBOZXVidXJnZXIsIEF1ZnNpY2h0c3JhdDogVG9iaWFzIE5ldWJ1cmdlcjwvcD5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj48L3RkPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RhYmxlPjwvdGQ+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgIDwvdGFibGU+PC90ZD5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgIDwvdHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgPC90YWJsZT48L3RkPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgPC90cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICA8L3RhYmxlPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICA8L2Rpdj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgPCEtLSBjb250ZW50IGVuZCAtLT5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgIDwvY2VudGVyPjwvdGQ+XFxuXCIgK1xuICAgICAgICAgICAgXCIgIDwvdHI+XFxuXCIgK1xuICAgICAgICAgICAgXCI8L3RhYmxlPlwiXG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7XCJzdGF0dXNcIjogXCJzdWNjZXNzXCIsIFwiZGF0YVwiOiBkYXRhfTtcbiAgICB9XG4gIH1cbn0pO1xuIiwiaW1wb3J0IHsgQXBpLCBET0lfRkVUQ0hfUk9VVEUsIERPSV9DT05GSVJNQVRJT05fTk9USUZZX1JPVVRFIH0gZnJvbSAnLi4vcmVzdC5qcyc7XG5pbXBvcnQgYWRkT3B0SW4gZnJvbSAnLi4vLi4vLi4vLi4vaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9vcHQtaW5zL2FkZF9hbmRfd3JpdGVfdG9fYmxvY2tjaGFpbi5qcyc7XG5pbXBvcnQgdXBkYXRlT3B0SW5TdGF0dXMgZnJvbSAnLi4vLi4vLi4vLi4vaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9vcHQtaW5zL3VwZGF0ZV9zdGF0dXMuanMnO1xuaW1wb3J0IGdldERvaU1haWxEYXRhIGZyb20gJy4uLy4uLy4uLy4uL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvZGFwcHMvZ2V0X2RvaS1tYWlsLWRhdGEuanMnO1xuaW1wb3J0IHtsb2dFcnJvciwgbG9nU2VuZH0gZnJvbSBcIi4uLy4uLy4uLy4uL2ltcG9ydHMvc3RhcnR1cC9zZXJ2ZXIvbG9nLWNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7RE9JX0VYUE9SVF9ST1VURX0gZnJvbSBcIi4uL3Jlc3RcIjtcbmltcG9ydCBleHBvcnREb2lzIGZyb20gXCIuLi8uLi8uLi8uLi9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2RhcHBzL2V4cG9ydF9kb2lzXCI7XG5pbXBvcnQge09wdEluc30gZnJvbSBcIi4uLy4uLy4uLy4uL2ltcG9ydHMvYXBpL29wdC1pbnMvb3B0LWluc1wiO1xuaW1wb3J0IHtSb2xlc30gZnJvbSBcIm1ldGVvci9hbGFubmluZzpyb2xlc1wiO1xuXG4vL2Rva3Ugb2YgbWV0ZW9yLXJlc3RpdnVzIGh0dHBzOi8vZ2l0aHViLmNvbS9rYWhtYWxpL21ldGVvci1yZXN0aXZ1c1xuXG5BcGkuYWRkUm91dGUoRE9JX0NPTkZJUk1BVElPTl9OT1RJRllfUk9VVEUsIHtcbiAgcG9zdDoge1xuICAgIGF1dGhSZXF1aXJlZDogdHJ1ZSxcbiAgICAvL3JvbGVSZXF1aXJlZDogWydhZG1pbiddLFxuICAgIGFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBxUGFyYW1zID0gdGhpcy5xdWVyeVBhcmFtcztcbiAgICAgIGNvbnN0IGJQYXJhbXMgPSB0aGlzLmJvZHlQYXJhbXM7XG4gICAgICBsZXQgcGFyYW1zID0ge31cbiAgICAgIGlmKHFQYXJhbXMgIT09IHVuZGVmaW5lZCkgcGFyYW1zID0gey4uLnFQYXJhbXN9XG4gICAgICBpZihiUGFyYW1zICE9PSB1bmRlZmluZWQpIHBhcmFtcyA9IHsuLi5wYXJhbXMsIC4uLmJQYXJhbXN9XG5cbiAgICAgIGNvbnN0IHVpZCA9IHRoaXMudXNlcklkO1xuXG4gICAgICBpZighUm9sZXMudXNlcklzSW5Sb2xlKHVpZCwgJ2FkbWluJykgfHwgLy9pZiBpdHMgbm90IGFuIGFkbWluIGFsd2F5cyB1c2UgdWlkIGFzIG93bmVySWRcbiAgICAgICAgICAoUm9sZXMudXNlcklzSW5Sb2xlKHVpZCwgJ2FkbWluJykgJiYgKHBhcmFtc1tcIm93bmVySWRcIl09PW51bGwgfHwgcGFyYW1zW1wib3duZXJJZFwiXT09dW5kZWZpbmVkKSkpIHsgIC8vaWYgaXRzIGFuIGFkbWluIG9ubHkgdXNlIHVpZCBpbiBjYXNlIG5vIG93bmVySWQgd2FzIGdpdmVuXG4gICAgICAgICAgcGFyYW1zW1wib3duZXJJZFwiXSA9IHVpZDtcbiAgICAgIH1cblxuICAgICAgbG9nU2VuZCgncGFyYW1ldGVyIHJlY2VpdmVkIGZyb20gYnJvd3NlcjonLHBhcmFtcyk7XG4gICAgICBpZihwYXJhbXMuc2VuZGVyX21haWwuY29uc3RydWN0b3IgPT09IEFycmF5KXsgLy90aGlzIGlzIGEgU09JIHdpdGggY28tc3BvbnNvcnMgZmlyc3QgZW1haWwgaXMgbWFpbiBzcG9uc29yXG4gICAgICAgICAgcmV0dXJuIHByZXBhcmVDb0RPSShwYXJhbXMpO1xuICAgICAgfWVsc2V7XG4gICAgICAgICByZXR1cm4gcHJlcGFyZUFkZChwYXJhbXMpO1xuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgcHV0OiB7XG4gICAgYXV0aFJlcXVpcmVkOiBmYWxzZSxcbiAgICBhY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgcVBhcmFtcyA9IHRoaXMucXVlcnlQYXJhbXM7XG4gICAgICBjb25zdCBiUGFyYW1zID0gdGhpcy5ib2R5UGFyYW1zO1xuXG4gICAgICBsb2dTZW5kKCdxUGFyYW1zOicscVBhcmFtcyk7XG4gICAgICBsb2dTZW5kKCdiUGFyYW1zOicsYlBhcmFtcyk7XG5cbiAgICAgIGxldCBwYXJhbXMgPSB7fVxuICAgICAgaWYocVBhcmFtcyAhPT0gdW5kZWZpbmVkKSBwYXJhbXMgPSB7Li4ucVBhcmFtc31cbiAgICAgIGlmKGJQYXJhbXMgIT09IHVuZGVmaW5lZCkgcGFyYW1zID0gey4uLnBhcmFtcywgLi4uYlBhcmFtc31cbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHZhbCA9IHVwZGF0ZU9wdEluU3RhdHVzKHBhcmFtcyk7XG4gICAgICAgIGxvZ1NlbmQoJ29wdC1JbiBzdGF0dXMgdXBkYXRlZCcsdmFsKTtcbiAgICAgICAgcmV0dXJuIHtzdGF0dXM6ICdzdWNjZXNzJywgZGF0YToge21lc3NhZ2U6ICdPcHQtSW4gc3RhdHVzIHVwZGF0ZWQnfX07XG4gICAgICB9IGNhdGNoKGVycm9yKSB7XG4gICAgICAgIHJldHVybiB7c3RhdHVzQ29kZTogNTAwLCBib2R5OiB7c3RhdHVzOiAnZmFpbCcsIG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2V9fTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn0pO1xuXG5BcGkuYWRkUm91dGUoRE9JX0ZFVENIX1JPVVRFLCB7YXV0aFJlcXVpcmVkOiBmYWxzZX0sIHtcbiAgZ2V0OiB7XG4gICAgYWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IHBhcmFtcyA9IHRoaXMucXVlcnlQYXJhbXM7XG4gICAgICB0cnkge1xuICAgICAgICAgIGxvZ1NlbmQoJ3Jlc3QgYXBpIC0gRE9JX0ZFVENIX1JPVVRFIGNhbGxlZCBieSBib2IgdG8gcmVxdWVzdCBlbWFpbCB0ZW1wbGF0ZScsSlNPTi5zdHJpbmdpZnkocGFyYW1zKSk7XG4gICAgICAgICAgY29uc3QgZGF0YSA9IGdldERvaU1haWxEYXRhKHBhcmFtcyk7XG4gICAgICAgICAgbG9nU2VuZCgnZ290IGRvaS1tYWlsLWRhdGEgKGluY2x1ZGluZyB0ZW1wbGFsdGUpIHJldHVybmluZyB0byBib2InLHtzdWJqZWN0OmRhdGEuc3ViamVjdCwgcmVjaXBpZW50OmRhdGEucmVjaXBpZW50fSk7XG4gICAgICAgIHJldHVybiB7c3RhdHVzOiAnc3VjY2VzcycsIGRhdGF9O1xuICAgICAgfSBjYXRjaChlcnJvcikge1xuICAgICAgICBsb2dFcnJvcignZXJyb3Igd2hpbGUgZ2V0dGluZyBEb2lNYWlsRGF0YScsZXJyb3IpO1xuICAgICAgICByZXR1cm4ge3N0YXR1czogJ2ZhaWwnLCBlcnJvcjogZXJyb3IubWVzc2FnZX07XG4gICAgICB9XG4gICAgfVxuICB9XG59KTtcblxuQXBpLmFkZFJvdXRlKERPSV9FWFBPUlRfUk9VVEUsIHtcbiAgICBnZXQ6IHtcbiAgICAgICAgYXV0aFJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAvL3JvbGVSZXF1aXJlZDogWydhZG1pbiddLFxuICAgICAgICBhY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgbGV0IHBhcmFtcyA9IHRoaXMucXVlcnlQYXJhbXM7XG4gICAgICAgICAgICBjb25zdCB1aWQgPSB0aGlzLnVzZXJJZDtcbiAgICAgICAgICAgIGlmKCFSb2xlcy51c2VySXNJblJvbGUodWlkLCAnYWRtaW4nKSl7XG4gICAgICAgICAgICAgICAgcGFyYW1zID0ge3VzZXJpZDp1aWQscm9sZTondXNlcid9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICBwYXJhbXMgPSB7Li4ucGFyYW1zLHJvbGU6J2FkbWluJ31cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgbG9nU2VuZCgncmVzdCBhcGkgLSBET0lfRVhQT1JUX1JPVVRFIGNhbGxlZCcsSlNPTi5zdHJpbmdpZnkocGFyYW1zKSk7XG4gICAgICAgICAgICAgICAgY29uc3QgZGF0YSA9IGV4cG9ydERvaXMocGFyYW1zKTtcbiAgICAgICAgICAgICAgICBsb2dTZW5kKCdnb3QgZG9pcyBmcm9tIGRhdGFiYXNlJyxKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtzdGF0dXM6ICdzdWNjZXNzJywgZGF0YX07XG4gICAgICAgICAgICB9IGNhdGNoKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgbG9nRXJyb3IoJ2Vycm9yIHdoaWxlIGV4cG9ydGluZyBjb25maXJtZWQgZG9pcycsZXJyb3IpO1xuICAgICAgICAgICAgICAgIHJldHVybiB7c3RhdHVzOiAnZmFpbCcsIGVycm9yOiBlcnJvci5tZXNzYWdlfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn0pO1xuXG5mdW5jdGlvbiBwcmVwYXJlQ29ET0kocGFyYW1zKXtcblxuICAgIGxvZ1NlbmQoJ2lzIGFycmF5ICcscGFyYW1zLnNlbmRlcl9tYWlsKTtcblxuICAgIGNvbnN0IHNlbmRlcnMgPSBwYXJhbXMuc2VuZGVyX21haWw7XG4gICAgY29uc3QgcmVjaXBpZW50X21haWwgPSBwYXJhbXMucmVjaXBpZW50X21haWw7XG4gICAgY29uc3QgZGF0YSA9IHBhcmFtcy5kYXRhO1xuICAgIGNvbnN0IG93bmVySUQgPSBwYXJhbXMub3duZXJJZDtcblxuICAgIGxldCBjdXJyZW50T3B0SW5JZDtcbiAgICBsZXQgcmV0UmVzcG9uc2UgPSBbXTtcbiAgICBsZXQgbWFzdGVyX2RvaTtcbiAgICBzZW5kZXJzLmZvckVhY2goKHNlbmRlcixpbmRleCkgPT4ge1xuXG4gICAgICAgIGNvbnN0IHJldF9yZXNwb25zZSA9IHByZXBhcmVBZGQoe3NlbmRlcl9tYWlsOnNlbmRlcixyZWNpcGllbnRfbWFpbDpyZWNpcGllbnRfbWFpbCxkYXRhOmRhdGEsIG1hc3Rlcl9kb2k6bWFzdGVyX2RvaSwgaW5kZXg6IGluZGV4LCBvd25lcklkOm93bmVySUR9KTtcbiAgICAgICAgbG9nU2VuZCgnQ29ET0k6JyxyZXRfcmVzcG9uc2UpO1xuICAgICAgICBpZihyZXRfcmVzcG9uc2Uuc3RhdHVzID09PSB1bmRlZmluZWQgfHwgcmV0X3Jlc3BvbnNlLnN0YXR1cz09PVwiZmFpbGVkXCIpIHRocm93IFwiY291bGQgbm90IGFkZCBjby1vcHQtaW5cIjtcbiAgICAgICAgcmV0UmVzcG9uc2UucHVzaChyZXRfcmVzcG9uc2UpO1xuICAgICAgICBjdXJyZW50T3B0SW5JZCA9IHJldF9yZXNwb25zZS5kYXRhLmlkO1xuXG4gICAgICAgIGlmKGluZGV4PT09MClcbiAgICAgICAge1xuICAgICAgICAgICAgbG9nU2VuZCgnbWFpbiBzcG9uc29yIG9wdEluSWQ6JyxjdXJyZW50T3B0SW5JZCk7XG4gICAgICAgICAgICBjb25zdCBvcHRJbiA9IE9wdElucy5maW5kT25lKHtfaWQ6IGN1cnJlbnRPcHRJbklkfSk7XG4gICAgICAgICAgICBtYXN0ZXJfZG9pID0gb3B0SW4ubmFtZUlkO1xuICAgICAgICAgICAgbG9nU2VuZCgnbWFpbiBzcG9uc29yIG5hbWVJZDonLG1hc3Rlcl9kb2kpO1xuICAgICAgICB9XG5cbiAgICB9KTtcblxuICAgIGxvZ1NlbmQocmV0UmVzcG9uc2UpO1xuXG4gICAgcmV0dXJuIHJldFJlc3BvbnNlO1xufVxuXG5mdW5jdGlvbiBwcmVwYXJlQWRkKHBhcmFtcyl7XG5cbiAgICB0cnkge1xuICAgICAgICBjb25zdCB2YWwgPSBhZGRPcHRJbihwYXJhbXMpO1xuICAgICAgICBsb2dTZW5kKCdvcHQtSW4gYWRkZWQgSUQ6Jyx2YWwpO1xuICAgICAgICByZXR1cm4ge3N0YXR1czogJ3N1Y2Nlc3MnLCBkYXRhOiB7aWQ6IHZhbCwgc3RhdHVzOiAnc3VjY2VzcycsIG1lc3NhZ2U6ICdPcHQtSW4gYWRkZWQuJ319O1xuICAgIH0gY2F0Y2goZXJyb3IpIHtcbiAgICAgICAgcmV0dXJuIHtzdGF0dXNDb2RlOiA1MDAsIGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogZXJyb3IubWVzc2FnZX19O1xuICAgIH1cbn0iLCJpbXBvcnQgeyBBcGkgfSBmcm9tICcuLi9yZXN0LmpzJztcbmltcG9ydCB7Z2V0SW5mb30gZnJvbSBcIi4uLy4uL2RvaWNoYWluXCI7XG5pbXBvcnQgeyBDT05GSVJNX0NMSUVOVCxTRU5EX0NMSUVOVH0gZnJvbSBcIi4uLy4uLy4uLy4uL2ltcG9ydHMvc3RhcnR1cC9zZXJ2ZXIvZG9pY2hhaW4tY29uZmlndXJhdGlvblwiO1xuXG5BcGkuYWRkUm91dGUoJ3N0YXR1cycsIHthdXRoUmVxdWlyZWQ6IGZhbHNlfSwge1xuICBnZXQ6IHtcbiAgICBhY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgZGF0YSA9IGdldEluZm8oU0VORF9DTElFTlQ/U0VORF9DTElFTlQ6Q09ORklSTV9DTElFTlQpO1xuICAgICAgICByZXR1cm4ge1wic3RhdHVzXCI6IFwic3VjY2Vzc1wiLCBcImRhdGFcIjpkYXRhfTtcbiAgICAgIH1jYXRjaChleCl7XG4gICAgICAgICAgICByZXR1cm4ge1wic3RhdHVzXCI6IFwiZmFpbGVkXCIsIFwiZGF0YVwiOiBleC50b1N0cmluZygpfTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn0pO1xuIiwiaW1wb3J0IHsgQXBpIH0gZnJvbSAnLi4vcmVzdC5qcyc7XG5pbXBvcnQge01ldGVvcn0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQge0FjY291bnRzfSBmcm9tICdtZXRlb3IvYWNjb3VudHMtYmFzZSdcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcbmltcG9ydCB7Um9sZXN9IGZyb20gXCJtZXRlb3IvYWxhbm5pbmc6cm9sZXNcIjtcbmltcG9ydCB7bG9nTWFpbn0gZnJvbSBcIi4uLy4uLy4uLy4uL2ltcG9ydHMvc3RhcnR1cC9zZXJ2ZXIvbG9nLWNvbmZpZ3VyYXRpb25cIjtcblxuY29uc3QgbWFpbFRlbXBsYXRlU2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gICAgc3ViamVjdDoge1xuICAgICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICAgIG9wdGlvbmFsOnRydWUgXG4gICAgfSxcbiAgICByZWRpcmVjdDoge1xuICAgICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICAgIHJlZ0V4OiBcIkAoaHR0cHM/fGZ0cCk6Ly8oLVxcXFwuKT8oW15cXFxccy8/XFxcXC4jLV0rXFxcXC4/KSsoL1teXFxcXHNdKik/JEBcIixcbiAgICAgICAgb3B0aW9uYWw6dHJ1ZSBcbiAgICB9LFxuICAgIHJldHVyblBhdGg6IHtcbiAgICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgICByZWdFeDogU2ltcGxlU2NoZW1hLlJlZ0V4LkVtYWlsLFxuICAgICAgICBvcHRpb25hbDp0cnVlIFxuICAgIH0sXG4gICAgdGVtcGxhdGVVUkw6e1xuICAgICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICAgIHJlZ0V4OiBcIkAoaHR0cHM/fGZ0cCk6Ly8oLVxcXFwuKT8oW15cXFxccy8/XFxcXC4jLV0rXFxcXC4/KSsoL1teXFxcXHNdKik/JEBcIixcbiAgICAgICAgb3B0aW9uYWw6dHJ1ZSBcbiAgICB9XG59KTtcblxuY29uc3QgY3JlYXRlVXNlclNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICAgIHVzZXJuYW1lOiB7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICByZWdFeDogXCJeW0EtWixhLXosMC05LCEsXywkLCNdezQsMjR9JFwiICAvL09ubHkgdXNlcm5hbWVzIGJldHdlZW4gNC0yNCBjaGFyYWN0ZXJzIGZyb20gQS1aLGEteiwwLTksISxfLCQsIyBhbGxvd2VkXG4gICAgfSxcbiAgICBlbWFpbDoge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgcmVnRXg6IFNpbXBsZVNjaGVtYS5SZWdFeC5FbWFpbFxuICAgIH0sXG4gICAgcGFzc3dvcmQ6IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIHJlZ0V4OiBcIl5bQS1aLGEteiwwLTksISxfLCQsI117OCwyNH0kXCIgLy9Pbmx5IHBhc3N3b3JkcyBiZXR3ZWVuIDgtMjQgY2hhcmFjdGVycyBmcm9tIEEtWixhLXosMC05LCEsXywkLCMgYWxsb3dlZFxuICAgIH0sXG4gICAgbWFpbFRlbXBsYXRlOntcbiAgICAgICAgdHlwZTogbWFpbFRlbXBsYXRlU2NoZW1hLFxuICAgICAgICBvcHRpb25hbDp0cnVlIFxuICAgIH1cbiAgfSk7XG4gIGNvbnN0IHVwZGF0ZVVzZXJTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgICBtYWlsVGVtcGxhdGU6e1xuICAgICAgICB0eXBlOiBtYWlsVGVtcGxhdGVTY2hlbWFcbiAgICB9XG59KTtcblxuLy9UT0RPOiBjb2xsZWN0aW9uIG9wdGlvbnMgc2VwYXJhdGVcbmNvbnN0IGNvbGxlY3Rpb25PcHRpb25zID1cbiAge1xuICAgIHBhdGg6XCJ1c2Vyc1wiLFxuICAgIHJvdXRlT3B0aW9uczpcbiAgICB7XG4gICAgICAgIGF1dGhSZXF1aXJlZCA6IHRydWVcbiAgICAgICAgLy8scm9sZVJlcXVpcmVkIDogXCJhZG1pblwiXG4gICAgfSxcbiAgICBleGNsdWRlZEVuZHBvaW50czogWydwYXRjaCcsJ2RlbGV0ZUFsbCddLFxuICAgIGVuZHBvaW50czpcbiAgICB7XG4gICAgICAgIGRlbGV0ZTp7cm9sZVJlcXVpcmVkIDogXCJhZG1pblwifSxcbiAgICAgICAgcG9zdDpcbiAgICAgICAge1xuICAgICAgICAgICAgcm9sZVJlcXVpcmVkIDogXCJhZG1pblwiLFxuICAgICAgICAgICAgYWN0aW9uOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIGNvbnN0IHFQYXJhbXMgPSB0aGlzLnF1ZXJ5UGFyYW1zO1xuICAgICAgICAgICAgICAgIGNvbnN0IGJQYXJhbXMgPSB0aGlzLmJvZHlQYXJhbXM7XG4gICAgICAgICAgICAgICAgbGV0IHBhcmFtcyA9IHt9O1xuICAgICAgICAgICAgICAgIGlmKHFQYXJhbXMgIT09IHVuZGVmaW5lZCkgcGFyYW1zID0gey4uLnFQYXJhbXN9XG4gICAgICAgICAgICAgICAgaWYoYlBhcmFtcyAhPT0gdW5kZWZpbmVkKSBwYXJhbXMgPSB7Li4ucGFyYW1zLCAuLi5iUGFyYW1zfVxuICAgICAgICAgICAgICAgIHRyeXtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHVzZXJJZDtcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlVXNlclNjaGVtYS52YWxpZGF0ZShwYXJhbXMpO1xuICAgICAgICAgICAgICAgICAgICBsb2dNYWluKCd2YWxpZGF0ZWQnLHBhcmFtcyk7XG4gICAgICAgICAgICAgICAgICAgIGlmKHBhcmFtcy5tYWlsVGVtcGxhdGUgIT09IHVuZGVmaW5lZCl7XG4gICAgICAgICAgICAgICAgICAgICAgICB1c2VySWQgPSBBY2NvdW50cy5jcmVhdGVVc2VyKHt1c2VybmFtZTpwYXJhbXMudXNlcm5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW1haWw6cGFyYW1zLmVtYWlsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhc3N3b3JkOnBhcmFtcy5wYXNzd29yZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9maWxlOnttYWlsVGVtcGxhdGU6cGFyYW1zLm1haWxUZW1wbGF0ZX19KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgICAgICAgICAgdXNlcklkID0gQWNjb3VudHMuY3JlYXRlVXNlcih7dXNlcm5hbWU6cGFyYW1zLnVzZXJuYW1lLGVtYWlsOnBhcmFtcy5lbWFpbCxwYXNzd29yZDpwYXJhbXMucGFzc3dvcmQsIHByb2ZpbGU6e319KTtcbiAgICAgICAgICAgICAgICAgICAgfSAgICBcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtzdGF0dXM6ICdzdWNjZXNzJywgZGF0YToge3VzZXJpZDogdXNlcklkfX07XG4gICAgICAgICAgICAgICAgfSBjYXRjaChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIHtzdGF0dXNDb2RlOiA0MDAsIGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogZXJyb3IubWVzc2FnZX19O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgcHV0OlxuICAgICAgICB7XG4gICAgICAgICAgICBhY3Rpb246IGZ1bmN0aW9uKCl7ICAgICAgXG4gICAgICAgICAgICAgICAgY29uc3QgcVBhcmFtcyA9IHRoaXMucXVlcnlQYXJhbXM7XG4gICAgICAgICAgICAgICAgY29uc3QgYlBhcmFtcyA9IHRoaXMuYm9keVBhcmFtcztcbiAgICAgICAgICAgICAgICBsZXQgcGFyYW1zID0ge307XG4gICAgICAgICAgICAgICAgbGV0IHVpZD10aGlzLnVzZXJJZDtcbiAgICAgICAgICAgICAgICBjb25zdCBwYXJhbUlkPXRoaXMudXJsUGFyYW1zLmlkO1xuICAgICAgICAgICAgICAgIGlmKHFQYXJhbXMgIT09IHVuZGVmaW5lZCkgcGFyYW1zID0gey4uLnFQYXJhbXN9XG4gICAgICAgICAgICAgICAgaWYoYlBhcmFtcyAhPT0gdW5kZWZpbmVkKSBwYXJhbXMgPSB7Li4ucGFyYW1zLCAuLi5iUGFyYW1zfVxuXG4gICAgICAgICAgICAgICAgdHJ5eyAvL1RPRE8gdGhpcyBpcyBub3QgbmVjZXNzYXJ5IGhlcmUgYW5kIGNhbiBwcm9iYWJseSBnbyByaWdodCBpbnRvIHRoZSBkZWZpbml0aW9uIG9mIHRoZSBSRVNUIE1FVEhPRCBuZXh0IHRvIHB1dCAoIT8hKVxuICAgICAgICAgICAgICAgICAgICBpZighUm9sZXMudXNlcklzSW5Sb2xlKHVpZCwgJ2FkbWluJykpe1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYodWlkIT09cGFyYW1JZCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJObyBQZXJtaXNzaW9uXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZVVzZXJTY2hlbWEudmFsaWRhdGUocGFyYW1zKTtcbiAgICAgICAgICAgICAgICAgICAgaWYoIU1ldGVvci51c2Vycy51cGRhdGUodGhpcy51cmxQYXJhbXMuaWQseyRzZXQ6e1wicHJvZmlsZS5tYWlsVGVtcGxhdGVcIjpwYXJhbXMubWFpbFRlbXBsYXRlfX0pKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IEVycm9yKFwiRmFpbGVkIHRvIHVwZGF0ZSB1c2VyXCIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7c3RhdHVzOiAnc3VjY2VzcycsIGRhdGE6IHt1c2VyaWQ6IHRoaXMudXJsUGFyYW1zLmlkLCBtYWlsVGVtcGxhdGU6cGFyYW1zLm1haWxUZW1wbGF0ZX19O1xuICAgICAgICAgICAgICAgIH0gY2F0Y2goZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiB7c3RhdHVzQ29kZTogNDAwLCBib2R5OiB7c3RhdHVzOiAnZmFpbCcsIG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2V9fTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5BcGkuYWRkQ29sbGVjdGlvbihNZXRlb3IudXNlcnMsY29sbGVjdGlvbk9wdGlvbnMpOyIsImltcG9ydCB7IEFwaSB9IGZyb20gJy4uL3Jlc3QuanMnO1xuaW1wb3J0IHZlcmlmeU9wdEluIGZyb20gJy4uLy4uLy4uLy4uL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvb3B0LWlucy92ZXJpZnkuanMnO1xuXG5BcGkuYWRkUm91dGUoJ29wdC1pbi92ZXJpZnknLCB7YXV0aFJlcXVpcmVkOiB0cnVlfSwge1xuICBnZXQ6IHtcbiAgICBhdXRoUmVxdWlyZWQ6IGZhbHNlLFxuICAgIGFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnN0IHFQYXJhbXMgPSB0aGlzLnF1ZXJ5UGFyYW1zO1xuICAgICAgICBjb25zdCBiUGFyYW1zID0gdGhpcy5ib2R5UGFyYW1zO1xuICAgICAgICBsZXQgcGFyYW1zID0ge31cbiAgICAgICAgaWYocVBhcmFtcyAhPT0gdW5kZWZpbmVkKSBwYXJhbXMgPSB7Li4ucVBhcmFtc31cbiAgICAgICAgaWYoYlBhcmFtcyAhPT0gdW5kZWZpbmVkKSBwYXJhbXMgPSB7Li4ucGFyYW1zLCAuLi5iUGFyYW1zfVxuXG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCB2YWwgPSB2ZXJpZnlPcHRJbihwYXJhbXMpO1xuICAgICAgICByZXR1cm4ge3N0YXR1czogXCJzdWNjZXNzXCIsIGRhdGE6IHt2YWx9fTtcbiAgICAgIH0gY2F0Y2goZXJyb3IpIHtcbiAgICAgICAgcmV0dXJuIHtzdGF0dXNDb2RlOiA1MDAsIGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogZXJyb3IubWVzc2FnZX19O1xuICAgICAgfVxuICAgIH1cbiAgfVxufSk7XG4iLCJpbXBvcnQgeyBSZXN0aXZ1cyB9IGZyb20gJ21ldGVvci9uaW1ibGU6cmVzdGl2dXMnO1xuaW1wb3J0IHsgaXNEZWJ1ZyB9IGZyb20gJy4uLy4uLy4uL2ltcG9ydHMvc3RhcnR1cC9zZXJ2ZXIvZGFwcC1jb25maWd1cmF0aW9uLmpzJztcbmltcG9ydCB7IFNFTkRfQVBQLCBDT05GSVJNX0FQUCwgVkVSSUZZX0FQUCwgaXNBcHBUeXBlIH0gZnJvbSAnLi4vLi4vLi4vaW1wb3J0cy9zdGFydHVwL3NlcnZlci90eXBlLWNvbmZpZ3VyYXRpb24uanMnO1xuXG5leHBvcnQgY29uc3QgRE9JX0NPTkZJUk1BVElPTl9ST1VURSA9IFwib3B0LWluL2NvbmZpcm1cIjtcbmV4cG9ydCBjb25zdCBET0lfQ09ORklSTUFUSU9OX05PVElGWV9ST1VURSA9IFwib3B0LWluXCI7XG5leHBvcnQgY29uc3QgRE9JX1dBTExFVE5PVElGWV9ST1VURSA9IFwid2FsbGV0bm90aWZ5XCI7XG5leHBvcnQgY29uc3QgRE9JX0ZFVENIX1JPVVRFID0gXCJkb2ktbWFpbFwiO1xuZXhwb3J0IGNvbnN0IERPSV9FWFBPUlRfUk9VVEUgPSBcImV4cG9ydFwiO1xuZXhwb3J0IGNvbnN0IEFQSV9QQVRIID0gXCJhcGkvXCI7XG5leHBvcnQgY29uc3QgVkVSU0lPTiA9IFwidjFcIjtcblxuZXhwb3J0IGNvbnN0IEFwaSA9IG5ldyBSZXN0aXZ1cyh7XG4gIGFwaVBhdGg6IEFQSV9QQVRILFxuICB2ZXJzaW9uOiBWRVJTSU9OLFxuICB1c2VEZWZhdWx0QXV0aDogdHJ1ZSxcbiAgcHJldHR5SnNvbjogdHJ1ZVxufSk7XG5cbmlmKGlzRGVidWcoKSkgcmVxdWlyZSgnLi9pbXBvcnRzL2RlYnVnLmpzJyk7XG5pZihpc0FwcFR5cGUoU0VORF9BUFApKSByZXF1aXJlKCcuL2ltcG9ydHMvc2VuZC5qcycpO1xuaWYoaXNBcHBUeXBlKENPTkZJUk1fQVBQKSkgcmVxdWlyZSgnLi9pbXBvcnRzL2NvbmZpcm0uanMnKTtcbmlmKGlzQXBwVHlwZShWRVJJRllfQVBQKSkgcmVxdWlyZSgnLi9pbXBvcnRzL3ZlcmlmeS5qcycpO1xucmVxdWlyZSgnLi9pbXBvcnRzL3VzZXIuanMnKTtcbnJlcXVpcmUoJy4vaW1wb3J0cy9zdGF0dXMuanMnKTtcbiIsIlxuaW1wb3J0IHsgSm9iQ29sbGVjdGlvbixKb2IgfSBmcm9tICdtZXRlb3IvdnNpdnNpOmpvYi1jb2xsZWN0aW9uJztcbmV4cG9ydCBjb25zdCBCbG9ja2NoYWluSm9icyA9IEpvYkNvbGxlY3Rpb24oJ2Jsb2NrY2hhaW4nKTtcbmltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IGluc2VydCBmcm9tICcuLi8uLi9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2RvaWNoYWluL2luc2VydC5qcyc7XG5pbXBvcnQgdXBkYXRlIGZyb20gJy4uLy4uL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvZG9pY2hhaW4vdXBkYXRlLmpzJztcbi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovIC8vVE9ETyByZS1lbmFibGUgdGhpcyFcbmltcG9ydCBjaGVja05ld1RyYW5zYWN0aW9uIGZyb20gJy4uLy4uL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvZG9pY2hhaW4vY2hlY2tfbmV3X3RyYW5zYWN0aW9ucy5qcyc7XG5pbXBvcnQgeyBDT05GSVJNX0FQUCwgaXNBcHBUeXBlIH0gZnJvbSAnLi4vLi4vaW1wb3J0cy9zdGFydHVwL3NlcnZlci90eXBlLWNvbmZpZ3VyYXRpb24uanMnO1xuaW1wb3J0IHtsb2dNYWlufSBmcm9tIFwiLi4vLi4vaW1wb3J0cy9zdGFydHVwL3NlcnZlci9sb2ctY29uZmlndXJhdGlvblwiO1xuXG5CbG9ja2NoYWluSm9icy5wcm9jZXNzSm9icygnaW5zZXJ0Jywge3dvcmtUaW1lb3V0OiAzMCoxMDAwfSxmdW5jdGlvbiAoam9iLCBjYikge1xuICB0cnkge1xuICAgIGNvbnN0IGVudHJ5ID0gam9iLmRhdGE7XG4gICAgaW5zZXJ0KGVudHJ5KTtcbiAgICBqb2IuZG9uZSgpO1xuICB9IGNhdGNoKGV4Y2VwdGlvbikge1xuICAgIGpvYi5mYWlsKCk7XG5cbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2pvYnMuYmxvY2tjaGFpbi5pbnNlcnQuZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgfSBmaW5hbGx5IHtcbiAgICBjYigpO1xuICB9XG59KTtcblxuQmxvY2tjaGFpbkpvYnMucHJvY2Vzc0pvYnMoJ3VwZGF0ZScsIHt3b3JrVGltZW91dDogMzAqMTAwMH0sZnVuY3Rpb24gKGpvYiwgY2IpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCBlbnRyeSA9IGpvYi5kYXRhO1xuICAgIHVwZGF0ZShlbnRyeSxqb2IpO1xuICB9IGNhdGNoKGV4Y2VwdGlvbikge1xuICAgIGpvYi5mYWlsKCk7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignam9icy5ibG9ja2NoYWluLnVwZGF0ZS5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9IGZpbmFsbHkge1xuICAgIGNiKCk7XG4gIH1cbn0pO1xuXG5CbG9ja2NoYWluSm9icy5wcm9jZXNzSm9icygnY2hlY2tOZXdUcmFuc2FjdGlvbicsIHt3b3JrVGltZW91dDogMzAqMTAwMH0sZnVuY3Rpb24gKGpvYiwgY2IpIHtcbiAgdHJ5IHtcbiAgICBpZighaXNBcHBUeXBlKENPTkZJUk1fQVBQKSkge1xuICAgICAgam9iLnBhdXNlKCk7XG4gICAgICBqb2IuY2FuY2VsKCk7XG4gICAgICBqb2IucmVtb3ZlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vY2hlY2tOZXdUcmFuc2FjdGlvbihudWxsLGpvYik7XG4gICAgfVxuICB9IGNhdGNoKGV4Y2VwdGlvbikge1xuICAgIGpvYi5mYWlsKCk7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignam9icy5ibG9ja2NoYWluLmNoZWNrTmV3VHJhbnNhY3Rpb25zLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH0gZmluYWxseSB7XG4gICAgY2IoKTtcbiAgfVxufSk7XG5cbm5ldyBKb2IoQmxvY2tjaGFpbkpvYnMsICdjbGVhbnVwJywge30pXG4gICAgLnJlcGVhdCh7IHNjaGVkdWxlOiBCbG9ja2NoYWluSm9icy5sYXRlci5wYXJzZS50ZXh0KFwiZXZlcnkgNSBtaW51dGVzXCIpIH0pXG4gICAgLnNhdmUoe2NhbmNlbFJlcGVhdHM6IHRydWV9KTtcblxubGV0IHEgPSBCbG9ja2NoYWluSm9icy5wcm9jZXNzSm9icygnY2xlYW51cCcseyBwb2xsSW50ZXJ2YWw6IGZhbHNlLCB3b3JrVGltZW91dDogNjAqMTAwMCB9ICxmdW5jdGlvbiAoam9iLCBjYikge1xuICBjb25zdCBjdXJyZW50ID0gbmV3IERhdGUoKVxuICAgIGN1cnJlbnQuc2V0TWludXRlcyhjdXJyZW50LmdldE1pbnV0ZXMoKSAtIDUpO1xuXG4gIGNvbnN0IGlkcyA9IEJsb2NrY2hhaW5Kb2JzLmZpbmQoe1xuICAgICAgICAgIHN0YXR1czogeyRpbjogSm9iLmpvYlN0YXR1c1JlbW92YWJsZX0sXG4gICAgICAgICAgdXBkYXRlZDogeyRsdDogY3VycmVudH19LFxuICAgICAgICAgIHtmaWVsZHM6IHsgX2lkOiAxIH19KTtcblxuICAgIGxvZ01haW4oJ2ZvdW5kICByZW1vdmFibGUgYmxvY2tjaGFpbiBqb2JzOicsaWRzKTtcbiAgICBCbG9ja2NoYWluSm9icy5yZW1vdmVKb2JzKGlkcyk7XG4gICAgaWYoaWRzLmxlbmd0aCA+IDApe1xuICAgICAgam9iLmRvbmUoXCJSZW1vdmVkICN7aWRzLmxlbmd0aH0gb2xkIGpvYnNcIik7XG4gICAgfVxuICAgIGNiKCk7XG59KTtcblxuQmxvY2tjaGFpbkpvYnMuZmluZCh7IHR5cGU6ICdqb2JUeXBlJywgc3RhdHVzOiAncmVhZHknIH0pXG4gICAgLm9ic2VydmUoe1xuICAgICAgICBhZGRlZDogZnVuY3Rpb24gKCkgeyBxLnRyaWdnZXIoKTsgfVxuICAgIH0pO1xuIiwiaW1wb3J0IHsgSm9iQ29sbGVjdGlvbiwgSm9iIH0gZnJvbSAnbWV0ZW9yL3ZzaXZzaTpqb2ItY29sbGVjdGlvbic7XG5pbXBvcnQgZmV0Y2hEb2lNYWlsRGF0YSBmcm9tICcuLi8uLi9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2RhcHBzL2ZldGNoX2RvaS1tYWlsLWRhdGEuanMnO1xuaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQge2xvZ01haW59IGZyb20gXCIuLi8uLi9pbXBvcnRzL3N0YXJ0dXAvc2VydmVyL2xvZy1jb25maWd1cmF0aW9uXCI7XG5pbXBvcnQge0Jsb2NrY2hhaW5Kb2JzfSBmcm9tIFwiLi9ibG9ja2NoYWluX2pvYnNcIjtcblxuZXhwb3J0IGNvbnN0IERBcHBKb2JzID0gSm9iQ29sbGVjdGlvbignZGFwcCcpO1xuXG5EQXBwSm9icy5wcm9jZXNzSm9icygnZmV0Y2hEb2lNYWlsRGF0YScsIGZ1bmN0aW9uIChqb2IsIGNiKSB7XG4gIHRyeSB7XG4gICAgY29uc3QgZGF0YSA9IGpvYi5kYXRhO1xuICAgIGZldGNoRG9pTWFpbERhdGEoZGF0YSk7XG4gICAgam9iLmRvbmUoKTtcbiAgfSBjYXRjaChleGNlcHRpb24pIHtcbiAgICBqb2IuZmFpbCgpO1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2pvYnMuZGFwcC5mZXRjaERvaU1haWxEYXRhLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH0gZmluYWxseSB7XG4gICAgY2IoKTtcbiAgfVxufSk7XG5cblxubmV3IEpvYihEQXBwSm9icywgJ2NsZWFudXAnLCB7fSlcbiAgICAucmVwZWF0KHsgc2NoZWR1bGU6IERBcHBKb2JzLmxhdGVyLnBhcnNlLnRleHQoXCJldmVyeSA1IG1pbnV0ZXNcIikgfSlcbiAgICAuc2F2ZSh7Y2FuY2VsUmVwZWF0czogdHJ1ZX0pO1xuXG5sZXQgcSA9IERBcHBKb2JzLnByb2Nlc3NKb2JzKCdjbGVhbnVwJyx7IHBvbGxJbnRlcnZhbDogZmFsc2UsIHdvcmtUaW1lb3V0OiA2MCoxMDAwIH0gLGZ1bmN0aW9uIChqb2IsIGNiKSB7XG4gICAgY29uc3QgY3VycmVudCA9IG5ldyBEYXRlKClcbiAgICBjdXJyZW50LnNldE1pbnV0ZXMoY3VycmVudC5nZXRNaW51dGVzKCkgLSA1KTtcblxuICAgIGNvbnN0IGlkcyA9IERBcHBKb2JzLmZpbmQoe1xuICAgICAgICAgICAgc3RhdHVzOiB7JGluOiBKb2Iuam9iU3RhdHVzUmVtb3ZhYmxlfSxcbiAgICAgICAgICAgIHVwZGF0ZWQ6IHskbHQ6IGN1cnJlbnR9fSxcbiAgICAgICAge2ZpZWxkczogeyBfaWQ6IDEgfX0pO1xuXG4gICAgbG9nTWFpbignZm91bmQgIHJlbW92YWJsZSBibG9ja2NoYWluIGpvYnM6JyxpZHMpO1xuICAgIERBcHBKb2JzLnJlbW92ZUpvYnMoaWRzKTtcbiAgICBpZihpZHMubGVuZ3RoID4gMCl7XG4gICAgICAgIGpvYi5kb25lKFwiUmVtb3ZlZCAje2lkcy5sZW5ndGh9IG9sZCBqb2JzXCIpO1xuICAgIH1cbiAgICBjYigpO1xufSk7XG5cbkRBcHBKb2JzLmZpbmQoeyB0eXBlOiAnam9iVHlwZScsIHN0YXR1czogJ3JlYWR5JyB9KVxuICAgIC5vYnNlcnZlKHtcbiAgICAgICAgYWRkZWQ6IGZ1bmN0aW9uICgpIHsgcS50cmlnZ2VyKCk7IH1cbiAgICB9KTtcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IGRucyBmcm9tICdkbnMnO1xuaW1wb3J0IHtsb2dTZW5kfSBmcm9tIFwiLi4vLi4vaW1wb3J0cy9zdGFydHVwL3NlcnZlci9sb2ctY29uZmlndXJhdGlvblwiO1xuXG5leHBvcnQgZnVuY3Rpb24gcmVzb2x2ZVR4dChrZXksIGRvbWFpbikge1xuICBjb25zdCBzeW5jRnVuYyA9IE1ldGVvci53cmFwQXN5bmMoZG5zX3Jlc29sdmVUeHQpO1xuICB0cnkge1xuICAgIGNvbnN0IHJlY29yZHMgPSBzeW5jRnVuYyhrZXksIGRvbWFpbik7XG4gICAgaWYocmVjb3JkcyA9PT0gdW5kZWZpbmVkKSByZXR1cm4gdW5kZWZpbmVkO1xuICAgIGxldCB2YWx1ZSA9IHVuZGVmaW5lZDtcbiAgICByZWNvcmRzLmZvckVhY2gocmVjb3JkID0+IHtcbiAgICAgIGlmKHJlY29yZFswXS5zdGFydHNXaXRoKGtleSkpIHtcbiAgICAgICAgY29uc3QgdmFsID0gcmVjb3JkWzBdLnN1YnN0cmluZyhrZXkubGVuZ3RoKzEpO1xuICAgICAgICB2YWx1ZSA9IHZhbC50cmltKCk7XG5cbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH0gY2F0Y2goZXJyb3IpIHtcbiAgICBsb2dTZW5kKFwiZXJyb3Igd2hpbGUgYXNraW5nIGRucyBzZXJ2ZXJzIGZyb20gXCIsZG5zLmdldFNlcnZlcnMoKSk7XG4gICAgaWYoZXJyb3IubWVzc2FnZS5zdGFydHNXaXRoKFwicXVlcnlUeHQgRU5PREFUQVwiKSB8fFxuICAgICAgICBlcnJvci5tZXNzYWdlLnN0YXJ0c1dpdGgoXCJxdWVyeVR4dCBFTk9URk9VTkRcIikpIHJldHVybiB1bmRlZmluZWQ7XG4gICAgZWxzZSB0aHJvdyBlcnJvcjtcbiAgfVxufVxuXG5mdW5jdGlvbiBkbnNfcmVzb2x2ZVR4dChrZXksIGRvbWFpbiwgY2FsbGJhY2spIHtcbiAgICBsb2dTZW5kKFwicmVzb2x2aW5nIGRucyB0eHQgYXR0cmlidXRlOiBcIiwge2tleTprZXksZG9tYWluOmRvbWFpbn0pO1xuICAgIGRucy5yZXNvbHZlVHh0KGRvbWFpbiwgKGVyciwgcmVjb3JkcykgPT4ge1xuICAgIGNhbGxiYWNrKGVyciwgcmVjb3Jkcyk7XG4gIH0pO1xufVxuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQge2xvZ0Jsb2NrY2hhaW4sIGxvZ0NvbmZpcm0sIGxvZ0Vycm9yfSBmcm9tIFwiLi4vLi4vaW1wb3J0cy9zdGFydHVwL3NlcnZlci9sb2ctY29uZmlndXJhdGlvblwiO1xuXG5cbmNvbnN0IE5BTUVTUEFDRSA9ICdlLyc7XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFdpZihjbGllbnQsIGFkZHJlc3MpIHtcbiAgaWYoIWFkZHJlc3Mpe1xuICAgICAgICBhZGRyZXNzID0gZ2V0QWRkcmVzc2VzQnlBY2NvdW50KFwiXCIpWzBdO1xuICAgICAgICBsb2dCbG9ja2NoYWluKCdhZGRyZXNzIHdhcyBub3QgZGVmaW5lZCBzbyBnZXR0aW5nIHRoZSBmaXJzdCBleGlzdGluZyBvbmUgb2YgdGhlIHdhbGxldDonLGFkZHJlc3MpO1xuICB9XG4gIGlmKCFhZGRyZXNzKXtcbiAgICAgICAgYWRkcmVzcyA9IGdldE5ld0FkZHJlc3MoXCJcIik7XG4gICAgICAgIGxvZ0Jsb2NrY2hhaW4oJ2FkZHJlc3Mgd2FzIG5ldmVyIGRlZmluZWQgIGF0IGFsbCBnZW5lcmF0ZWQgbmV3IGFkZHJlc3MgZm9yIHRoaXMgd2FsbGV0OicsYWRkcmVzcyk7XG4gIH1cbiAgY29uc3Qgc3luY0Z1bmMgPSBNZXRlb3Iud3JhcEFzeW5jKGRvaWNoYWluX2R1bXBwcml2a2V5KTtcbiAgcmV0dXJuIHN5bmNGdW5jKGNsaWVudCwgYWRkcmVzcyk7XG59XG5cbmZ1bmN0aW9uIGRvaWNoYWluX2R1bXBwcml2a2V5KGNsaWVudCwgYWRkcmVzcywgY2FsbGJhY2spIHtcbiAgY29uc3Qgb3VyQWRkcmVzcyA9IGFkZHJlc3M7XG4gIGNsaWVudC5jbWQoJ2R1bXBwcml2a2V5Jywgb3VyQWRkcmVzcywgZnVuY3Rpb24oZXJyLCBkYXRhKSB7XG4gICAgaWYoZXJyKSAgbG9nRXJyb3IoJ2RvaWNoYWluX2R1bXBwcml2a2V5OicsZXJyKTtcbiAgICBjYWxsYmFjayhlcnIsIGRhdGEpO1xuICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEFkZHJlc3Nlc0J5QWNjb3VudChjbGllbnQsIGFjY291dCkge1xuICAgIGNvbnN0IHN5bmNGdW5jID0gTWV0ZW9yLndyYXBBc3luYyhkb2ljaGFpbl9nZXRhZGRyZXNzZXNieWFjY291bnQpO1xuICAgIHJldHVybiBzeW5jRnVuYyhjbGllbnQsIGFjY291dCk7XG59XG5cbmZ1bmN0aW9uIGRvaWNoYWluX2dldGFkZHJlc3Nlc2J5YWNjb3VudChjbGllbnQsIGFjY291bnQsIGNhbGxiYWNrKSB7XG4gICAgY29uc3Qgb3VyQWNjb3VudCA9IGFjY291bnQ7XG4gICAgY2xpZW50LmNtZCgnZ2V0YWRkcmVzc2VzYnlhY2NvdW50Jywgb3VyQWNjb3VudCwgZnVuY3Rpb24oZXJyLCBkYXRhKSB7XG4gICAgICAgIGlmKGVycikgIGxvZ0Vycm9yKCdnZXRhZGRyZXNzZXNieWFjY291bnQ6JyxlcnIpO1xuICAgICAgICBjYWxsYmFjayhlcnIsIGRhdGEpO1xuICAgIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0TmV3QWRkcmVzcyhjbGllbnQsIGFjY291dCkge1xuICAgIGNvbnN0IHN5bmNGdW5jID0gTWV0ZW9yLndyYXBBc3luYyhkb2ljaGFpbl9nZXRuZXdhZGRyZXNzKTtcbiAgICByZXR1cm4gc3luY0Z1bmMoY2xpZW50LCBhY2NvdXQpO1xufVxuZnVuY3Rpb24gZG9pY2hhaW5fZ2V0bmV3YWRkcmVzcyhjbGllbnQsIGFjY291bnQsIGNhbGxiYWNrKSB7XG4gICAgY29uc3Qgb3VyQWNjb3VudCA9IGFjY291bnQ7XG4gICAgY2xpZW50LmNtZCgnZ2V0bmV3YWRkcmVzc3MnLCBvdXJBY2NvdW50LCBmdW5jdGlvbihlcnIsIGRhdGEpIHtcbiAgICAgICAgaWYoZXJyKSAgbG9nRXJyb3IoJ2dldG5ld2FkZHJlc3NzOicsZXJyKTtcbiAgICAgICAgY2FsbGJhY2soZXJyLCBkYXRhKTtcbiAgICB9KTtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gc2lnbk1lc3NhZ2UoY2xpZW50LCBhZGRyZXNzLCBtZXNzYWdlKSB7XG4gICAgY29uc3Qgc3luY0Z1bmMgPSBNZXRlb3Iud3JhcEFzeW5jKGRvaWNoYWluX3NpZ25NZXNzYWdlKTtcbiAgICByZXR1cm4gc3luY0Z1bmMoY2xpZW50LCBhZGRyZXNzLCBtZXNzYWdlKTtcbn1cblxuZnVuY3Rpb24gZG9pY2hhaW5fc2lnbk1lc3NhZ2UoY2xpZW50LCBhZGRyZXNzLCBtZXNzYWdlLCBjYWxsYmFjaykge1xuICAgIGNvbnN0IG91ckFkZHJlc3MgPSBhZGRyZXNzO1xuICAgIGNvbnN0IG91ck1lc3NhZ2UgPSBtZXNzYWdlO1xuICAgIGNsaWVudC5jbWQoJ3NpZ25tZXNzYWdlJywgb3VyQWRkcmVzcywgb3VyTWVzc2FnZSwgZnVuY3Rpb24oZXJyLCBkYXRhKSB7XG4gICAgICAgIGNhbGxiYWNrKGVyciwgZGF0YSk7XG4gICAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBuYW1lU2hvdyhjbGllbnQsIGlkKSB7XG4gIGNvbnN0IHN5bmNGdW5jID0gTWV0ZW9yLndyYXBBc3luYyhkb2ljaGFpbl9uYW1lU2hvdyk7XG4gIHJldHVybiBzeW5jRnVuYyhjbGllbnQsIGlkKTtcbn1cblxuZnVuY3Rpb24gZG9pY2hhaW5fbmFtZVNob3coY2xpZW50LCBpZCwgY2FsbGJhY2spIHtcbiAgY29uc3Qgb3VySWQgPSBjaGVja0lkKGlkKTtcbiAgbG9nQ29uZmlybSgnZG9pY2hhaW4tY2xpIG5hbWVfc2hvdyA6JyxvdXJJZCk7XG4gIGNsaWVudC5jbWQoJ25hbWVfc2hvdycsIG91cklkLCBmdW5jdGlvbihlcnIsIGRhdGEpIHtcbiAgICBpZihlcnIgIT09IHVuZGVmaW5lZCAmJiBlcnIgIT09IG51bGwgJiYgZXJyLm1lc3NhZ2Uuc3RhcnRzV2l0aChcIm5hbWUgbm90IGZvdW5kXCIpKSB7XG4gICAgICBlcnIgPSB1bmRlZmluZWQsXG4gICAgICBkYXRhID0gdW5kZWZpbmVkXG4gICAgfVxuICAgIGNhbGxiYWNrKGVyciwgZGF0YSk7XG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZmVlRG9pKGNsaWVudCwgYWRkcmVzcykge1xuICAgIGNvbnN0IHN5bmNGdW5jID0gTWV0ZW9yLndyYXBBc3luYyhkb2ljaGFpbl9mZWVEb2kpO1xuICAgIHJldHVybiBzeW5jRnVuYyhjbGllbnQsIGFkZHJlc3MpO1xufVxuXG5mdW5jdGlvbiBkb2ljaGFpbl9mZWVEb2koY2xpZW50LCBhZGRyZXNzLCBjYWxsYmFjaykge1xuICAgIGNvbnN0IGRlc3RBZGRyZXNzID0gYWRkcmVzcztcbiAgICBjbGllbnQuY21kKCdzZW5kdG9hZGRyZXNzJywgZGVzdEFkZHJlc3MsICcwLjAyJywgZnVuY3Rpb24oZXJyLCBkYXRhKSB7XG4gICAgICAgIGNhbGxiYWNrKGVyciwgZGF0YSk7XG4gICAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBuYW1lRG9pKGNsaWVudCwgbmFtZSwgdmFsdWUsIGFkZHJlc3MpIHtcbiAgICBjb25zdCBzeW5jRnVuYyA9IE1ldGVvci53cmFwQXN5bmMoZG9pY2hhaW5fbmFtZURvaSk7XG4gICAgcmV0dXJuIHN5bmNGdW5jKGNsaWVudCwgbmFtZSwgdmFsdWUsIGFkZHJlc3MpO1xufVxuXG5mdW5jdGlvbiBkb2ljaGFpbl9uYW1lRG9pKGNsaWVudCwgbmFtZSwgdmFsdWUsIGFkZHJlc3MsIGNhbGxiYWNrKSB7XG4gICAgY29uc3Qgb3VyTmFtZSA9IGNoZWNrSWQobmFtZSk7XG4gICAgY29uc3Qgb3VyVmFsdWUgPSB2YWx1ZTtcbiAgICBjb25zdCBkZXN0QWRkcmVzcyA9IGFkZHJlc3M7XG4gICAgaWYoIWFkZHJlc3MpIHtcbiAgICAgICAgY2xpZW50LmNtZCgnbmFtZV9kb2knLCBvdXJOYW1lLCBvdXJWYWx1ZSwgZnVuY3Rpb24gKGVyciwgZGF0YSkge1xuICAgICAgICAgICAgY2FsbGJhY2soZXJyLCBkYXRhKTtcbiAgICAgICAgfSk7XG4gICAgfWVsc2V7XG4gICAgICAgIGNsaWVudC5jbWQoJ25hbWVfZG9pJywgb3VyTmFtZSwgb3VyVmFsdWUsIGRlc3RBZGRyZXNzLCBmdW5jdGlvbihlcnIsIGRhdGEpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKGVyciwgZGF0YSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxpc3RTaW5jZUJsb2NrKGNsaWVudCwgYmxvY2spIHtcbiAgICBjb25zdCBzeW5jRnVuYyA9IE1ldGVvci53cmFwQXN5bmMoZG9pY2hhaW5fbGlzdFNpbmNlQmxvY2spO1xuICAgIHZhciBvdXJCbG9jayA9IGJsb2NrO1xuICAgIGlmKG91ckJsb2NrID09PSB1bmRlZmluZWQpIG91ckJsb2NrID0gbnVsbDtcbiAgICByZXR1cm4gc3luY0Z1bmMoY2xpZW50LCBvdXJCbG9jayk7XG59XG5cbmZ1bmN0aW9uIGRvaWNoYWluX2xpc3RTaW5jZUJsb2NrKGNsaWVudCwgYmxvY2ssIGNhbGxiYWNrKSB7XG4gICAgdmFyIG91ckJsb2NrID0gYmxvY2s7XG4gICAgaWYob3VyQmxvY2sgPT09IG51bGwpIGNsaWVudC5jbWQoJ2xpc3RzaW5jZWJsb2NrJywgZnVuY3Rpb24oZXJyLCBkYXRhKSB7XG4gICAgICAgIGNhbGxiYWNrKGVyciwgZGF0YSk7XG4gICAgfSk7XG4gICAgZWxzZSBjbGllbnQuY21kKCdsaXN0c2luY2VibG9jaycsIG91ckJsb2NrLCBmdW5jdGlvbihlcnIsIGRhdGEpIHtcbiAgICAgICAgY2FsbGJhY2soZXJyLCBkYXRhKTtcbiAgICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFRyYW5zYWN0aW9uKGNsaWVudCwgdHhpZCkge1xuICAgIGNvbnN0IHN5bmNGdW5jID0gTWV0ZW9yLndyYXBBc3luYyhkb2ljaGFpbl9nZXR0cmFuc2FjdGlvbik7XG4gICAgcmV0dXJuIHN5bmNGdW5jKGNsaWVudCwgdHhpZCk7XG59XG5cbmZ1bmN0aW9uIGRvaWNoYWluX2dldHRyYW5zYWN0aW9uKGNsaWVudCwgdHhpZCwgY2FsbGJhY2spIHtcbiAgICBsb2dDb25maXJtKCdkb2ljaGFpbl9nZXR0cmFuc2FjdGlvbjonLHR4aWQpO1xuICAgIGNsaWVudC5jbWQoJ2dldHRyYW5zYWN0aW9uJywgdHhpZCwgZnVuY3Rpb24oZXJyLCBkYXRhKSB7XG4gICAgICAgIGlmKGVycikgIGxvZ0Vycm9yKCdkb2ljaGFpbl9nZXR0cmFuc2FjdGlvbjonLGVycik7XG4gICAgICAgIGNhbGxiYWNrKGVyciwgZGF0YSk7XG4gICAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRSYXdUcmFuc2FjdGlvbihjbGllbnQsIHR4aWQpIHtcbiAgICBjb25zdCBzeW5jRnVuYyA9IE1ldGVvci53cmFwQXN5bmMoZG9pY2hhaW5fZ2V0cmF3dHJhbnNhY3Rpb24pO1xuICAgIHJldHVybiBzeW5jRnVuYyhjbGllbnQsIHR4aWQpO1xufVxuXG5mdW5jdGlvbiBkb2ljaGFpbl9nZXRyYXd0cmFuc2FjdGlvbihjbGllbnQsIHR4aWQsIGNhbGxiYWNrKSB7XG4gICAgbG9nQmxvY2tjaGFpbignZG9pY2hhaW5fZ2V0cmF3dHJhbnNhY3Rpb246Jyx0eGlkKTtcbiAgICBjbGllbnQuY21kKCdnZXRyYXd0cmFuc2FjdGlvbicsIHR4aWQsIDEsIGZ1bmN0aW9uKGVyciwgZGF0YSkge1xuICAgICAgICBpZihlcnIpICBsb2dFcnJvcignZG9pY2hhaW5fZ2V0cmF3dHJhbnNhY3Rpb246JyxlcnIpO1xuICAgICAgICBjYWxsYmFjayhlcnIsIGRhdGEpO1xuICAgIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0QmFsYW5jZShjbGllbnQpIHtcbiAgICBjb25zdCBzeW5jRnVuYyA9IE1ldGVvci53cmFwQXN5bmMoZG9pY2hhaW5fZ2V0YmFsYW5jZSk7XG4gICAgcmV0dXJuIHN5bmNGdW5jKGNsaWVudCk7XG59XG5cbmZ1bmN0aW9uIGRvaWNoYWluX2dldGJhbGFuY2UoY2xpZW50LCBjYWxsYmFjaykge1xuICAgIGNsaWVudC5jbWQoJ2dldGJhbGFuY2UnLCBmdW5jdGlvbihlcnIsIGRhdGEpIHtcbiAgICAgICAgaWYoZXJyKSB7IGxvZ0Vycm9yKCdkb2ljaGFpbl9nZXRiYWxhbmNlOicsZXJyKTt9XG4gICAgICAgIGNhbGxiYWNrKGVyciwgZGF0YSk7XG4gICAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRJbmZvKGNsaWVudCkge1xuICAgIGNvbnN0IHN5bmNGdW5jID0gTWV0ZW9yLndyYXBBc3luYyhkb2ljaGFpbl9nZXRpbmZvKTtcbiAgICByZXR1cm4gc3luY0Z1bmMoY2xpZW50KTtcbn1cblxuZnVuY3Rpb24gZG9pY2hhaW5fZ2V0aW5mbyhjbGllbnQsIGNhbGxiYWNrKSB7XG4gICAgY2xpZW50LmNtZCgnZ2V0YmxvY2tjaGFpbmluZm8nLCBmdW5jdGlvbihlcnIsIGRhdGEpIHtcbiAgICAgICAgaWYoZXJyKSB7IGxvZ0Vycm9yKCdkb2ljaGFpbi1nZXRpbmZvOicsZXJyKTt9XG4gICAgICAgIGNhbGxiYWNrKGVyciwgZGF0YSk7XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIGNoZWNrSWQoaWQpIHtcbiAgICBjb25zdCBET0lfUFJFRklYID0gXCJkb2k6IFwiO1xuICAgIGxldCByZXRfdmFsID0gaWQ7IC8vZGVmYXVsdCB2YWx1ZVxuXG4gICAgaWYoaWQuc3RhcnRzV2l0aChET0lfUFJFRklYKSkgcmV0X3ZhbCA9IGlkLnN1YnN0cmluZyhET0lfUFJFRklYLmxlbmd0aCk7IC8vaW4gY2FzZSBpdCBzdGFydHMgd2l0aCBkb2k6IGN1dCAgdGhpcyBhd2F5XG4gICAgaWYoIWlkLnN0YXJ0c1dpdGgoTkFNRVNQQUNFKSkgcmV0X3ZhbCA9IE5BTUVTUEFDRStpZDsgLy9pbiBjYXNlIGl0IGRvZXNuJ3Qgc3RhcnQgd2l0aCBlLyBwdXQgaXQgaW4gZnJvbnQgbm93LlxuICByZXR1cm4gcmV0X3ZhbDtcbn1cbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IHsgSFRUUCB9IGZyb20gJ21ldGVvci9odHRwJ1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0SHR0cEdFVCh1cmwsIHF1ZXJ5KSB7XG4gIGNvbnN0IHN5bmNGdW5jID0gTWV0ZW9yLndyYXBBc3luYyhfZ2V0KTtcbiAgcmV0dXJuIHN5bmNGdW5jKHVybCwgcXVlcnkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0SHR0cEdFVGRhdGEodXJsLCBkYXRhKSB7XG4gICAgY29uc3Qgc3luY0Z1bmMgPSBNZXRlb3Iud3JhcEFzeW5jKF9nZXREYXRhKTtcbiAgICByZXR1cm4gc3luY0Z1bmModXJsLCBkYXRhKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEh0dHBQT1NUKHVybCwgZGF0YSkge1xuICAgIGNvbnN0IHN5bmNGdW5jID0gTWV0ZW9yLndyYXBBc3luYyhfcG9zdCk7XG4gICAgcmV0dXJuIHN5bmNGdW5jKHVybCwgZGF0YSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRIdHRwUFVUKHVybCwgZGF0YSkge1xuICAgIGNvbnN0IHN5bmNGdW5jID0gTWV0ZW9yLndyYXBBc3luYyhfcHV0KTtcbiAgICByZXR1cm4gc3luY0Z1bmModXJsLCBkYXRhKTtcbn1cblxuZnVuY3Rpb24gX2dldCh1cmwsIHF1ZXJ5LCBjYWxsYmFjaykge1xuICBjb25zdCBvdXJVcmwgPSB1cmw7XG4gIGNvbnN0IG91clF1ZXJ5ID0gcXVlcnk7XG4gIEhUVFAuZ2V0KG91clVybCwge3F1ZXJ5OiBvdXJRdWVyeX0sIGZ1bmN0aW9uKGVyciwgcmV0KSB7XG4gICAgY2FsbGJhY2soZXJyLCByZXQpO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gX2dldERhdGEodXJsLCBkYXRhLCBjYWxsYmFjaykge1xuICAgIGNvbnN0IG91clVybCA9IHVybDtcbiAgICBjb25zdCBvdXJEYXRhID0gZGF0YTtcbiAgICBIVFRQLmdldChvdXJVcmwsIG91ckRhdGEsIGZ1bmN0aW9uKGVyciwgcmV0KSB7XG4gICAgICAgIGNhbGxiYWNrKGVyciwgcmV0KTtcbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gX3Bvc3QodXJsLCBkYXRhLCBjYWxsYmFjaykge1xuICAgIGNvbnN0IG91clVybCA9IHVybDtcbiAgICBjb25zdCBvdXJEYXRhID0gIGRhdGE7XG5cbiAgICBIVFRQLnBvc3Qob3VyVXJsLCBvdXJEYXRhLCBmdW5jdGlvbihlcnIsIHJldCkge1xuICAgICAgICBjYWxsYmFjayhlcnIsIHJldCk7XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIF9wdXQodXJsLCB1cGRhdGVEYXRhLCBjYWxsYmFjaykge1xuICAgIGNvbnN0IG91clVybCA9IHVybDtcbiAgICBjb25zdCBvdXJEYXRhID0ge1xuICAgICAgICBkYXRhOiB1cGRhdGVEYXRhXG4gICAgfVxuXG4gICAgSFRUUC5wdXQob3VyVXJsLCBvdXJEYXRhLCBmdW5jdGlvbihlcnIsIHJldCkge1xuICAgICAgY2FsbGJhY2soZXJyLCByZXQpO1xuICAgIH0pO1xufVxuIiwiaW1wb3J0ICcuL21haWxfam9icy5qcyc7XG5pbXBvcnQgJy4vZG9pY2hhaW4uanMnO1xuaW1wb3J0ICcuL2Jsb2NrY2hhaW5fam9icy5qcyc7XG5pbXBvcnQgJy4vZGFwcF9qb2JzLmpzJztcbmltcG9ydCAnLi9kbnMuanMnO1xuaW1wb3J0ICcuL3Jlc3QvcmVzdC5qcyc7XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCB7IEpvYkNvbGxlY3Rpb24sIEpvYiB9IGZyb20gJ21ldGVvci92c2l2c2k6am9iLWNvbGxlY3Rpb24nO1xuZXhwb3J0IGNvbnN0IE1haWxKb2JzID0gSm9iQ29sbGVjdGlvbignZW1haWxzJyk7XG5pbXBvcnQgc2VuZE1haWwgZnJvbSAnLi4vLi4vaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9lbWFpbHMvc2VuZC5qcyc7XG5pbXBvcnQge2xvZ01haW59IGZyb20gXCIuLi8uLi9pbXBvcnRzL3N0YXJ0dXAvc2VydmVyL2xvZy1jb25maWd1cmF0aW9uXCI7XG5pbXBvcnQge0Jsb2NrY2hhaW5Kb2JzfSBmcm9tIFwiLi9ibG9ja2NoYWluX2pvYnNcIjtcblxuXG5cbk1haWxKb2JzLnByb2Nlc3NKb2JzKCdzZW5kJywgZnVuY3Rpb24gKGpvYiwgY2IpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCBlbWFpbCA9IGpvYi5kYXRhO1xuICAgIHNlbmRNYWlsKGVtYWlsKTtcbiAgICBqb2IuZG9uZSgpO1xuICB9IGNhdGNoKGV4Y2VwdGlvbikge1xuICAgIGpvYi5mYWlsKCk7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignam9icy5tYWlsLnNlbmQuZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgfSBmaW5hbGx5IHtcbiAgICBjYigpO1xuICB9XG59KTtcblxuXG5uZXcgSm9iKE1haWxKb2JzLCAnY2xlYW51cCcsIHt9KVxuICAgIC5yZXBlYXQoeyBzY2hlZHVsZTogTWFpbEpvYnMubGF0ZXIucGFyc2UudGV4dChcImV2ZXJ5IDUgbWludXRlc1wiKSB9KVxuICAgIC5zYXZlKHtjYW5jZWxSZXBlYXRzOiB0cnVlfSlcblxubGV0IHEgPSBNYWlsSm9icy5wcm9jZXNzSm9icygnY2xlYW51cCcseyBwb2xsSW50ZXJ2YWw6IGZhbHNlLCB3b3JrVGltZW91dDogNjAqMTAwMCB9ICxmdW5jdGlvbiAoam9iLCBjYikge1xuICAgIGNvbnN0IGN1cnJlbnQgPSBuZXcgRGF0ZSgpXG4gICAgY3VycmVudC5zZXRNaW51dGVzKGN1cnJlbnQuZ2V0TWludXRlcygpIC0gNSk7XG5cbiAgICBjb25zdCBpZHMgPSBNYWlsSm9icy5maW5kKHtcbiAgICAgICAgICAgIHN0YXR1czogeyRpbjogSm9iLmpvYlN0YXR1c1JlbW92YWJsZX0sXG4gICAgICAgICAgICB1cGRhdGVkOiB7JGx0OiBjdXJyZW50fX0sXG4gICAgICAgIHtmaWVsZHM6IHsgX2lkOiAxIH19KTtcblxuICAgIGxvZ01haW4oJ2ZvdW5kICByZW1vdmFibGUgYmxvY2tjaGFpbiBqb2JzOicsaWRzKTtcbiAgICBNYWlsSm9icy5yZW1vdmVKb2JzKGlkcyk7XG4gICAgaWYoaWRzLmxlbmd0aCA+IDApe1xuICAgICAgICBqb2IuZG9uZShcIlJlbW92ZWQgI3tpZHMubGVuZ3RofSBvbGQgam9ic1wiKTtcbiAgICB9XG4gICAgY2IoKTtcbn0pO1xuXG5NYWlsSm9icy5maW5kKHsgdHlwZTogJ2pvYlR5cGUnLCBzdGF0dXM6ICdyZWFkeScgfSlcbiAgICAub2JzZXJ2ZSh7XG4gICAgICAgIGFkZGVkOiBmdW5jdGlvbiAoKSB7IHEudHJpZ2dlcigpOyB9XG4gICAgfSk7XG5cbiIsImltcG9ydCAnL2ltcG9ydHMvc3RhcnR1cC9zZXJ2ZXInO1xuaW1wb3J0ICcuL2FwaS9pbmRleC5qcyc7XG4iXX0=
