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

}},"version":{"publications.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// imports/api/version/publications.js                                                                                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let Meta;
module.link("../meta/meta", {
  Meta(v) {
    Meta = v;
  }

}, 1);
Meteor.publish('version', function version() {
  return Meta.find({});
});
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

  if (Meta.find().count() > 0) {
    Meta.remove({});
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
module.link("../../api/version/publications.js");
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
  client.cmd('-getinfo', function (err, data) {
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9hcGkvb3B0LWlucy9zZXJ2ZXIvcHVibGljYXRpb25zLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL2FwaS9vcHQtaW5zL21ldGhvZHMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvYXBpL29wdC1pbnMvb3B0LWlucy5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9hcGkvcmVjaXBpZW50cy9zZXJ2ZXIvcHVibGljYXRpb25zLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL2FwaS9yZWNpcGllbnRzL3JlY2lwaWVudHMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvYXBpL2RvaWNoYWluL2VudHJpZXMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvYXBpL2RvaWNoYWluL21ldGhvZHMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvYXBpL2xhbmd1YWdlcy9tZXRob2RzLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL2FwaS9tZXRhL21ldGEuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvYXBpL3NlbmRlcnMvc2VuZGVycy5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9hcGkvdmVyc2lvbi9wdWJsaWNhdGlvbnMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvZGFwcHMvZXhwb3J0X2RvaXMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvZGFwcHMvZmV0Y2hfZG9pLW1haWwtZGF0YS5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9kYXBwcy9nZXRfZG9pLW1haWwtZGF0YS5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9kbnMvZ2V0X29wdC1pbi1rZXkuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvZG5zL2dldF9vcHQtaW4tcHJvdmlkZXIuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvZG9pY2hhaW4vYWRkX2VudHJ5X2FuZF9mZXRjaF9kYXRhLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2RvaWNoYWluL2NoZWNrX25ld190cmFuc2FjdGlvbnMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvZG9pY2hhaW4vZGVjcnlwdF9tZXNzYWdlLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2RvaWNoYWluL2VuY3J5cHRfbWVzc2FnZS5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9kb2ljaGFpbi9nZW5lcmF0ZV9uYW1lLWlkLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2RvaWNoYWluL2dldF9hZGRyZXNzLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2RvaWNoYWluL2dldF9iYWxhbmNlLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2RvaWNoYWluL2dldF9kYXRhLWhhc2guanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvZG9pY2hhaW4vZ2V0X2tleS1wYWlyLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2RvaWNoYWluL2dldF9wcml2YXRlLWtleV9mcm9tX3dpZi5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9kb2ljaGFpbi9nZXRfcHVibGlja2V5X2FuZF9hZGRyZXNzX2J5X2RvbWFpbi5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9kb2ljaGFpbi9nZXRfc2lnbmF0dXJlLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2RvaWNoYWluL2luc2VydC5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9kb2ljaGFpbi91cGRhdGUuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvZG9pY2hhaW4vdmVyaWZ5X3NpZ25hdHVyZS5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9kb2ljaGFpbi93cml0ZV90b19ibG9ja2NoYWluLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2VtYWlscy9kZWNvZGVfZG9pLWhhc2guanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvZW1haWxzL2dlbmVyYXRlX2RvaS1oYXNoLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2VtYWlscy9wYXJzZV90ZW1wbGF0ZS5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9lbWFpbHMvc2VuZC5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9qb2JzL2FkZF9jaGVja19uZXdfdHJhbnNhY3Rpb25zLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2pvYnMvYWRkX2ZldGNoLWRvaS1tYWlsLWRhdGEuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvam9icy9hZGRfaW5zZXJ0X2Jsb2NrY2hhaW4uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvam9icy9hZGRfc2VuZF9tYWlsLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2pvYnMvYWRkX3VwZGF0ZV9ibG9ja2NoYWluLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2xhbmd1YWdlcy9nZXQuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvbWV0YS9hZGRPclVwZGF0ZS5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9vcHQtaW5zL2FkZC5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9vcHQtaW5zL2FkZF9hbmRfd3JpdGVfdG9fYmxvY2tjaGFpbi5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9vcHQtaW5zL2NvbmZpcm0uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvb3B0LWlucy9nZW5lcmF0ZV9kb2ktdG9rZW4uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvb3B0LWlucy91cGRhdGVfc3RhdHVzLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL21vZHVsZXMvc2VydmVyL29wdC1pbnMvdmVyaWZ5LmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL21vZHVsZXMvc2VydmVyL3JlY2lwaWVudHMvYWRkLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL21vZHVsZXMvc2VydmVyL3NlbmRlcnMvYWRkLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL3N0YXJ0dXAvc2VydmVyL2RhcHAtY29uZmlndXJhdGlvbi5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9zdGFydHVwL3NlcnZlci9kbnMtY29uZmlndXJhdGlvbi5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9zdGFydHVwL3NlcnZlci9kb2ljaGFpbi1jb25maWd1cmF0aW9uLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL3N0YXJ0dXAvc2VydmVyL2VtYWlsLWNvbmZpZ3VyYXRpb24uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvc3RhcnR1cC9zZXJ2ZXIvZml4dHVyZXMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvc3RhcnR1cC9zZXJ2ZXIvaW5kZXguanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvc3RhcnR1cC9zZXJ2ZXIvam9icy5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9zdGFydHVwL3NlcnZlci9sb2ctY29uZmlndXJhdGlvbi5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9zdGFydHVwL3NlcnZlci9yZWdpc3Rlci1hcGkuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvc3RhcnR1cC9zZXJ2ZXIvc2VjdXJpdHkuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvc3RhcnR1cC9zZXJ2ZXIvdHlwZS1jb25maWd1cmF0aW9uLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL3N0YXJ0dXAvc2VydmVyL3VzZXJhY2NvdW50cy1jb25maWd1cmF0aW9uLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvYXBpL3Jlc3QvaW1wb3J0cy9jb25maXJtLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvYXBpL3Jlc3QvaW1wb3J0cy9kZWJ1Zy5qcyIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL2FwaS9yZXN0L2ltcG9ydHMvc2VuZC5qcyIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL2FwaS9yZXN0L2ltcG9ydHMvdXNlci5qcyIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL2FwaS9yZXN0L2ltcG9ydHMvdmVyaWZ5LmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvYXBpL3Jlc3QvcmVzdC5qcyIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL2FwaS9ibG9ja2NoYWluX2pvYnMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9hcGkvZGFwcF9qb2JzLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvYXBpL2Rucy5qcyIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL2FwaS9kb2ljaGFpbi5qcyIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL2FwaS9odHRwLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvYXBpL2luZGV4LmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvYXBpL21haWxfam9icy5qcyIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL21haW4uanMiXSwibmFtZXMiOlsiTWV0ZW9yIiwibW9kdWxlIiwibGluayIsInYiLCJSb2xlcyIsIk9wdElucyIsInB1Ymxpc2giLCJPcHRJbnNBbGwiLCJ1c2VySWQiLCJyZWFkeSIsInVzZXJJc0luUm9sZSIsImZpbmQiLCJvd25lcklkIiwiZmllbGRzIiwicHVibGljRmllbGRzIiwiRERQUmF0ZUxpbWl0ZXIiLCJpMThuIiwiX2kxOG4iLCJWYWxpZGF0ZWRNZXRob2QiLCJfIiwiYWRkT3B0SW4iLCJkZWZhdWx0IiwiYWRkIiwibmFtZSIsInZhbGlkYXRlIiwicnVuIiwicmVjaXBpZW50TWFpbCIsInNlbmRlck1haWwiLCJkYXRhIiwiZXJyb3IiLCJFcnJvciIsIl9fIiwib3B0SW4iLCJPUFRJT05TX01FVEhPRFMiLCJwbHVjayIsImlzU2VydmVyIiwiYWRkUnVsZSIsImNvbnRhaW5zIiwiY29ubmVjdGlvbklkIiwiZXhwb3J0IiwiTW9uZ28iLCJTaW1wbGVTY2hlbWEiLCJPcHRJbnNDb2xsZWN0aW9uIiwiQ29sbGVjdGlvbiIsImluc2VydCIsImNhbGxiYWNrIiwib3VyT3B0SW4iLCJyZWNpcGllbnRfc2VuZGVyIiwicmVjaXBpZW50Iiwic2VuZGVyIiwiY3JlYXRlZEF0IiwiRGF0ZSIsInJlc3VsdCIsInVwZGF0ZSIsInNlbGVjdG9yIiwibW9kaWZpZXIiLCJyZW1vdmUiLCJkZW55Iiwic2NoZW1hIiwiX2lkIiwidHlwZSIsIlN0cmluZyIsInJlZ0V4IiwiUmVnRXgiLCJJZCIsIm9wdGlvbmFsIiwiZGVueVVwZGF0ZSIsImluZGV4IiwiSW50ZWdlciIsIm5hbWVJZCIsInR4SWQiLCJtYXN0ZXJEb2kiLCJjb25maXJtZWRBdCIsImNvbmZpcm1lZEJ5IiwiSVAiLCJjb25maXJtYXRpb25Ub2tlbiIsImF0dGFjaFNjaGVtYSIsIlJlY2lwaWVudHMiLCJyZWNpcGllbnRHZXQiLCJwaXBlbGluZSIsInB1c2giLCIkcmVkYWN0IiwiJGNvbmQiLCJpZiIsIiRjbXAiLCJ0aGVuIiwiZWxzZSIsIiRsb29rdXAiLCJmcm9tIiwibG9jYWxGaWVsZCIsImZvcmVpZ25GaWVsZCIsImFzIiwiJHVud2luZCIsIiRwcm9qZWN0IiwiYWdncmVnYXRlIiwicklkcyIsImZvckVhY2giLCJlbGVtZW50IiwiUmVjaXBpZW50RW1haWwiLCJyZWNpcGllbnRzQWxsIiwiUmVjaXBpZW50c0NvbGxlY3Rpb24iLCJvdXJSZWNpcGllbnQiLCJlbWFpbCIsInByaXZhdGVLZXkiLCJ1bmlxdWUiLCJwdWJsaWNLZXkiLCJEb2ljaGFpbkVudHJpZXMiLCJEb2ljaGFpbkVudHJpZXNDb2xsZWN0aW9uIiwiZW50cnkiLCJ2YWx1ZSIsImFkZHJlc3MiLCJnZXRLZXlQYWlyTSIsImdldEJhbGFuY2VNIiwiZ2V0S2V5UGFpciIsImdldEJhbGFuY2UiLCJsb2dWYWwiLCJPUFRJTlNfTUVUSE9EUyIsImdldExhbmd1YWdlcyIsImdldEFsbExhbmd1YWdlcyIsIk1ldGEiLCJNZXRhQ29sbGVjdGlvbiIsIm91ckRhdGEiLCJrZXkiLCJTZW5kZXJzIiwiU2VuZGVyc0NvbGxlY3Rpb24iLCJvdXJTZW5kZXIiLCJ2ZXJzaW9uIiwiRE9JX01BSUxfRkVUQ0hfVVJMIiwibG9nU2VuZCIsIkV4cG9ydERvaXNEYXRhU2NoZW1hIiwic3RhdHVzIiwicm9sZSIsInVzZXJpZCIsImlkIiwiZXhwb3J0RG9pcyIsIiRtYXRjaCIsIiRleGlzdHMiLCIkbmUiLCJ1bmRlZmluZWQiLCJjb25jYXQiLCJvcHRJbnMiLCJleHBvcnREb2lEYXRhIiwiSlNPTiIsInN0cmluZ2lmeSIsImV4Y2VwdGlvbiIsImV4cG9ydERlZmF1bHQiLCJET0lfRkVUQ0hfUk9VVEUiLCJET0lfQ09ORklSTUFUSU9OX1JPVVRFIiwiQVBJX1BBVEgiLCJWRVJTSU9OIiwiZ2V0VXJsIiwiQ09ORklSTV9DTElFTlQiLCJDT05GSVJNX0FERFJFU1MiLCJnZXRIdHRwR0VUIiwic2lnbk1lc3NhZ2UiLCJwYXJzZVRlbXBsYXRlIiwiZ2VuZXJhdGVEb2lUb2tlbiIsImdlbmVyYXRlRG9pSGFzaCIsImFkZFNlbmRNYWlsSm9iIiwibG9nQ29uZmlybSIsImxvZ0Vycm9yIiwiRmV0Y2hEb2lNYWlsRGF0YVNjaGVtYSIsImRvbWFpbiIsImZldGNoRG9pTWFpbERhdGEiLCJ1cmwiLCJzaWduYXR1cmUiLCJxdWVyeSIsImVuY29kZVVSSUNvbXBvbmVudCIsInJlc3BvbnNlIiwicmVzcG9uc2VEYXRhIiwiaW5jbHVkZXMiLCJvcHRJbklkIiwiZmluZE9uZSIsInRva2VuIiwiY29uZmlybWF0aW9uSGFzaCIsInJlZGlyZWN0IiwiY29uZmlybWF0aW9uVXJsIiwidGVtcGxhdGUiLCJjb250ZW50IiwiY29uZmlybWF0aW9uX3VybCIsInRvIiwic3ViamVjdCIsIm1lc3NhZ2UiLCJyZXR1cm5QYXRoIiwiZ2V0T3B0SW5Qcm92aWRlciIsImdldE9wdEluS2V5IiwidmVyaWZ5U2lnbmF0dXJlIiwiQWNjb3VudHMiLCJHZXREb2lNYWlsRGF0YVNjaGVtYSIsIm5hbWVfaWQiLCJ1c2VyUHJvZmlsZVNjaGVtYSIsIkVtYWlsIiwidGVtcGxhdGVVUkwiLCJnZXREb2lNYWlsRGF0YSIsInBhcnRzIiwic3BsaXQiLCJsZW5ndGgiLCJwcm92aWRlciIsImRvaU1haWxEYXRhIiwiZGVmYXVsdFJldHVybkRhdGEiLCJyZXR1cm5EYXRhIiwib3duZXIiLCJ1c2VycyIsIm1haWxUZW1wbGF0ZSIsInByb2ZpbGUiLCJyZXNvbHZlVHh0IiwiRkFMTEJBQ0tfUFJPVklERVIiLCJpc1JlZ3Rlc3QiLCJpc1Rlc3RuZXQiLCJPUFRfSU5fS0VZIiwiT1BUX0lOX0tFWV9URVNUTkVUIiwiR2V0T3B0SW5LZXlTY2hlbWEiLCJvdXJPUFRfSU5fS0VZIiwiZm91bmRLZXkiLCJkbnNrZXkiLCJ1c2VGYWxsYmFjayIsIlBST1ZJREVSX0tFWSIsIlBST1ZJREVSX0tFWV9URVNUTkVUIiwiR2V0T3B0SW5Qcm92aWRlclNjaGVtYSIsIm91clBST1ZJREVSX0tFWSIsInByb3ZpZGVyS2V5IiwiZ2V0V2lmIiwiYWRkRmV0Y2hEb2lNYWlsRGF0YUpvYiIsImdldFByaXZhdGVLZXlGcm9tV2lmIiwiZGVjcnlwdE1lc3NhZ2UiLCJBZGREb2ljaGFpbkVudHJ5U2NoZW1hIiwiYWRkRG9pY2hhaW5FbnRyeSIsIm91ckVudHJ5IiwiZXR5IiwicGFyc2UiLCJ3aWYiLCJuYW1lUG9zIiwiaW5kZXhPZiIsInN1YnN0cmluZyIsImV4cGlyZXNJbiIsImV4cGlyZWQiLCJsaXN0U2luY2VCbG9jayIsIm5hbWVTaG93IiwiZ2V0UmF3VHJhbnNhY3Rpb24iLCJhZGRPclVwZGF0ZU1ldGEiLCJUWF9OQU1FX1NUQVJUIiwiTEFTVF9DSEVDS0VEX0JMT0NLX0tFWSIsImNoZWNrTmV3VHJhbnNhY3Rpb24iLCJ0eGlkIiwiam9iIiwibGFzdENoZWNrZWRCbG9jayIsInJldCIsInRyYW5zYWN0aW9ucyIsInR4cyIsImxhc3RibG9jayIsImFkZHJlc3NUeHMiLCJmaWx0ZXIiLCJ0eCIsInN0YXJ0c1dpdGgiLCJ0eE5hbWUiLCJhZGRUeCIsImRvbmUiLCJ2b3V0Iiwic2NyaXB0UHViS2V5IiwibmFtZU9wIiwib3AiLCJhZGRyZXNzZXMiLCJjcnlwdG8iLCJlY2llcyIsIkRlY3J5cHRNZXNzYWdlU2NoZW1hIiwiQnVmZmVyIiwiZWNkaCIsImNyZWF0ZUVDREgiLCJzZXRQcml2YXRlS2V5IiwiZGVjcnlwdCIsInRvU3RyaW5nIiwiRW5jcnlwdE1lc3NhZ2VTY2hlbWEiLCJlbmNyeXB0TWVzc2FnZSIsImVuY3J5cHQiLCJHZW5lcmF0ZU5hbWVJZFNjaGVtYSIsImdlbmVyYXRlTmFtZUlkIiwiJHNldCIsIkNyeXB0b0pTIiwiQmFzZTU4IiwiVkVSU0lPTl9CWVRFIiwiVkVSU0lPTl9CWVRFX1JFR1RFU1QiLCJHZXRBZGRyZXNzU2NoZW1hIiwiZ2V0QWRkcmVzcyIsIl9nZXRBZGRyZXNzIiwicHViS2V5IiwibGliIiwiV29yZEFycmF5IiwiY3JlYXRlIiwiU0hBMjU2IiwiUklQRU1EMTYwIiwidmVyc2lvbkJ5dGUiLCJjaGVja3N1bSIsImVuY29kZSIsImdldF9CYWxhbmNlIiwiYmFsIiwiR2V0RGF0YUhhc2hTY2hlbWEiLCJnZXREYXRhSGFzaCIsImhhc2giLCJyYW5kb21CeXRlcyIsInNlY3AyNTZrMSIsInByaXZLZXkiLCJwcml2YXRlS2V5VmVyaWZ5IiwicHVibGljS2V5Q3JlYXRlIiwidG9VcHBlckNhc2UiLCJHZXRQcml2YXRlS2V5RnJvbVdpZlNjaGVtYSIsIl9nZXRQcml2YXRlS2V5RnJvbVdpZiIsImRlY29kZSIsImVuZHNXaXRoIiwiR2V0UHVibGljS2V5U2NoZW1hIiwiZ2V0UHVibGljS2V5QW5kQWRkcmVzcyIsImRlc3RBZGRyZXNzIiwiYml0Y29yZSIsIk1lc3NhZ2UiLCJHZXRTaWduYXR1cmVTY2hlbWEiLCJnZXRTaWduYXR1cmUiLCJzaWduIiwiUHJpdmF0ZUtleSIsIlNFTkRfQ0xJRU5UIiwibG9nQmxvY2tjaGFpbiIsImZlZURvaSIsIm5hbWVEb2kiLCJJbnNlcnRTY2hlbWEiLCJkYXRhSGFzaCIsInNvaURhdGUiLCJwdWJsaWNLZXlBbmRBZGRyZXNzIiwibmFtZVZhbHVlIiwiZmVlRG9pVHgiLCJuYW1lRG9pVHgiLCJnZXRUcmFuc2FjdGlvbiIsIkRPSV9DT05GSVJNQVRJT05fTk9USUZZX1JPVVRFIiwiZ2V0SHR0cFBVVCIsIlVwZGF0ZVNjaGVtYSIsImhvc3QiLCJmcm9tSG9zdFVybCIsIm5hbWVfZGF0YSIsInJlcnVuIiwib3VyX3RyYW5zYWN0aW9uIiwiY29uZmlybWF0aW9ucyIsIm91cmZyb21Ib3N0VXJsIiwidXBkYXRlRGF0YSIsImNhbmNlbCIsInJlc3RhcnQiLCJlcnIiLCJsb2dWZXJpZnkiLCJORVRXT1JLIiwiTmV0d29ya3MiLCJhbGlhcyIsInB1YmtleWhhc2giLCJwcml2YXRla2V5Iiwic2NyaXB0aGFzaCIsIm5ldHdvcmtNYWdpYyIsIlZlcmlmeVNpZ25hdHVyZVNjaGVtYSIsIkFkZHJlc3MiLCJmcm9tUHVibGljS2V5IiwiUHVibGljS2V5IiwidmVyaWZ5IiwiYWRkSW5zZXJ0QmxvY2tjaGFpbkpvYiIsIldyaXRlVG9CbG9ja2NoYWluU2NoZW1hIiwid3JpdGVUb0Jsb2NrY2hhaW4iLCJIYXNoSWRzIiwiRGVjb2RlRG9pSGFzaFNjaGVtYSIsImRlY29kZURvaUhhc2giLCJvdXJIYXNoIiwiaGV4IiwiZGVjb2RlSGV4Iiwib2JqIiwiR2VuZXJhdGVEb2lIYXNoU2NoZW1hIiwianNvbiIsImVuY29kZUhleCIsIlBMQUNFSE9MREVSX1JFR0VYIiwiUGFyc2VUZW1wbGF0ZVNjaGVtYSIsIk9iamVjdCIsImJsYWNrYm94IiwiX21hdGNoIiwiZXhlYyIsIl9yZXBsYWNlUGxhY2Vob2xkZXIiLCJyZXBsYWNlIiwicmVwIiwiRE9JX01BSUxfREVGQVVMVF9FTUFJTF9GUk9NIiwiU2VuZE1haWxTY2hlbWEiLCJzZW5kTWFpbCIsIm1haWwiLCJvdXJNYWlsIiwic2VuZCIsImh0bWwiLCJoZWFkZXJzIiwiSm9iIiwiQmxvY2tjaGFpbkpvYnMiLCJhZGRDaGVja05ld1RyYW5zYWN0aW9uc0Jsb2NrY2hhaW5Kb2IiLCJyZXRyeSIsInJldHJpZXMiLCJ3YWl0Iiwic2F2ZSIsImNhbmNlbFJlcGVhdHMiLCJEQXBwSm9icyIsIkFkZEZldGNoRG9pTWFpbERhdGFKb2JTY2hlbWEiLCJBZGRJbnNlcnRCbG9ja2NoYWluSm9iU2NoZW1hIiwiTWFpbEpvYnMiLCJBZGRTZW5kTWFpbEpvYlNjaGVtYSIsIkFkZFVwZGF0ZUJsb2NrY2hhaW5Kb2JTY2hlbWEiLCJhZGRVcGRhdGVCbG9ja2NoYWluSm9iIiwiQWRkT3JVcGRhdGVNZXRhU2NoZW1hIiwibWV0YSIsIkFkZE9wdEluU2NoZW1hIiwiZmV0Y2giLCJhZGRSZWNpcGllbnQiLCJhZGRTZW5kZXIiLCJyZWNpcGllbnRfbWFpbCIsInNlbmRlcl9tYWlsIiwibWFzdGVyX2RvaSIsInJlY2lwaWVudElkIiwic2VuZGVySWQiLCJDb25maXJtT3B0SW5TY2hlbWEiLCJjb25maXJtT3B0SW4iLCJyZXF1ZXN0Iiwib3VyUmVxdWVzdCIsImRlY29kZWQiLCIkdW5zZXQiLCJlbnRyaWVzIiwiJG9yIiwiZG9pU2lnbmF0dXJlIiwiZG9pVGltZXN0YW1wIiwidG9JU09TdHJpbmciLCJqc29uVmFsdWUiLCJHZW5lcmF0ZURvaVRva2VuU2NoZW1hIiwiVXBkYXRlT3B0SW5TdGF0dXNTY2hlbWEiLCJ1cGRhdGVPcHRJblN0YXR1cyIsIlZFUklGWV9DTElFTlQiLCJWZXJpZnlPcHRJblNjaGVtYSIsInJlY2lwaWVudF9wdWJsaWNfa2V5IiwidmVyaWZ5T3B0SW4iLCJlbnRyeURhdGEiLCJmaXJzdENoZWNrIiwic2Vjb25kQ2hlY2siLCJBZGRSZWNpcGllbnRTY2hlbWEiLCJyZWNpcGllbnRzIiwia2V5UGFpciIsIkFkZFNlbmRlclNjaGVtYSIsInNlbmRlcnMiLCJpc0RlYnVnIiwic2V0dGluZ3MiLCJhcHAiLCJkZWJ1ZyIsInJlZ3Rlc3QiLCJ0ZXN0bmV0IiwicG9ydCIsImFic29sdXRlVXJsIiwibmFtZWNvaW4iLCJTRU5EX0FQUCIsIkNPTkZJUk1fQVBQIiwiVkVSSUZZX0FQUCIsImlzQXBwVHlwZSIsInNlbmRTZXR0aW5ncyIsInNlbmRDbGllbnQiLCJkb2ljaGFpbiIsImNyZWF0ZUNsaWVudCIsImNvbmZpcm1TZXR0aW5ncyIsImNvbmZpcm0iLCJjb25maXJtQ2xpZW50IiwiY29uZmlybUFkZHJlc3MiLCJ2ZXJpZnlTZXR0aW5ncyIsInZlcmlmeUNsaWVudCIsIkNsaWVudCIsInVzZXIiLCJ1c2VybmFtZSIsInBhc3MiLCJwYXNzd29yZCIsIkhhc2hpZHMiLCJkb2lNYWlsRmV0Y2hVcmwiLCJkZWZhdWx0RnJvbSIsInNtdHAiLCJzdGFydHVwIiwicHJvY2VzcyIsImVudiIsIk1BSUxfVVJMIiwic2VydmVyIiwiTk9ERV9UTFNfUkVKRUNUX1VOQVVUSE9SSVpFRCIsIkFzc2V0cyIsImdldFRleHQiLCJjb3VudCIsImNyZWF0ZVVzZXIiLCJhZGRVc2Vyc1RvUm9sZXMiLCJzdGFydEpvYlNlcnZlciIsImNvbnNvbGUiLCJzZW5kTW9kZVRhZ0NvbG9yIiwiY29uZmlybU1vZGVUYWdDb2xvciIsInZlcmlmeU1vZGVUYWdDb2xvciIsImJsb2NrY2hhaW5Nb2RlVGFnQ29sb3IiLCJ0ZXN0aW5nTW9kZVRhZ0NvbG9yIiwibG9nTWFpbiIsInRlc3RMb2dnaW5nIiwicmVxdWlyZSIsIm1zZyIsImNvbG9ycyIsInBhcmFtIiwidGltZSIsInRhZyIsImxvZyIsIkFVVEhfTUVUSE9EUyIsInR5cGVzIiwiY29uZmlnIiwic2VuZFZlcmlmaWNhdGlvbkVtYWlsIiwiZm9yYmlkQ2xpZW50QWNjb3VudENyZWF0aW9uIiwiZW1haWxUZW1wbGF0ZXMiLCJBcGkiLCJET0lfV0FMTEVUTk9USUZZX1JPVVRFIiwiYWRkUm91dGUiLCJhdXRoUmVxdWlyZWQiLCJnZXQiLCJhY3Rpb24iLCJ1cmxQYXJhbXMiLCJpcCIsImNvbm5lY3Rpb24iLCJyZW1vdGVBZGRyZXNzIiwic29ja2V0Iiwic3RhdHVzQ29kZSIsImJvZHkiLCJwYXJhbXMiLCJxdWVyeVBhcmFtcyIsIkRPSV9FWFBPUlRfUk9VVEUiLCJwb3N0IiwicVBhcmFtcyIsImJQYXJhbXMiLCJib2R5UGFyYW1zIiwidWlkIiwiY29uc3RydWN0b3IiLCJBcnJheSIsInByZXBhcmVDb0RPSSIsInByZXBhcmVBZGQiLCJwdXQiLCJ2YWwiLCJvd25lcklEIiwiY3VycmVudE9wdEluSWQiLCJyZXRSZXNwb25zZSIsInJldF9yZXNwb25zZSIsIm1haWxUZW1wbGF0ZVNjaGVtYSIsImNyZWF0ZVVzZXJTY2hlbWEiLCJ1cGRhdGVVc2VyU2NoZW1hIiwiY29sbGVjdGlvbk9wdGlvbnMiLCJwYXRoIiwicm91dGVPcHRpb25zIiwiZXhjbHVkZWRFbmRwb2ludHMiLCJlbmRwb2ludHMiLCJkZWxldGUiLCJyb2xlUmVxdWlyZWQiLCJwYXJhbUlkIiwiYWRkQ29sbGVjdGlvbiIsIlJlc3RpdnVzIiwiYXBpUGF0aCIsInVzZURlZmF1bHRBdXRoIiwicHJldHR5SnNvbiIsIkpvYkNvbGxlY3Rpb24iLCJwcm9jZXNzSm9icyIsIndvcmtUaW1lb3V0IiwiY2IiLCJmYWlsIiwicGF1c2UiLCJyZXBlYXQiLCJzY2hlZHVsZSIsImxhdGVyIiwidGV4dCIsInEiLCJwb2xsSW50ZXJ2YWwiLCJjdXJyZW50Iiwic2V0TWludXRlcyIsImdldE1pbnV0ZXMiLCJpZHMiLCIkaW4iLCJqb2JTdGF0dXNSZW1vdmFibGUiLCJ1cGRhdGVkIiwiJGx0IiwicmVtb3ZlSm9icyIsIm9ic2VydmUiLCJhZGRlZCIsInRyaWdnZXIiLCJkbnMiLCJzeW5jRnVuYyIsIndyYXBBc3luYyIsImRuc19yZXNvbHZlVHh0IiwicmVjb3JkcyIsInJlY29yZCIsInRyaW0iLCJnZXRBZGRyZXNzZXNCeUFjY291bnQiLCJnZXROZXdBZGRyZXNzIiwiZ2V0SW5mbyIsIk5BTUVTUEFDRSIsImNsaWVudCIsImRvaWNoYWluX2R1bXBwcml2a2V5Iiwib3VyQWRkcmVzcyIsImNtZCIsImFjY291dCIsImRvaWNoYWluX2dldGFkZHJlc3Nlc2J5YWNjb3VudCIsImFjY291bnQiLCJvdXJBY2NvdW50IiwiZG9pY2hhaW5fZ2V0bmV3YWRkcmVzcyIsImRvaWNoYWluX3NpZ25NZXNzYWdlIiwib3VyTWVzc2FnZSIsImRvaWNoYWluX25hbWVTaG93Iiwib3VySWQiLCJjaGVja0lkIiwiZG9pY2hhaW5fZmVlRG9pIiwiZG9pY2hhaW5fbmFtZURvaSIsIm91ck5hbWUiLCJvdXJWYWx1ZSIsImJsb2NrIiwiZG9pY2hhaW5fbGlzdFNpbmNlQmxvY2siLCJvdXJCbG9jayIsImRvaWNoYWluX2dldHRyYW5zYWN0aW9uIiwiZG9pY2hhaW5fZ2V0cmF3dHJhbnNhY3Rpb24iLCJkb2ljaGFpbl9nZXRiYWxhbmNlIiwiZG9pY2hhaW5fZ2V0aW5mbyIsIkRPSV9QUkVGSVgiLCJyZXRfdmFsIiwiZ2V0SHR0cEdFVGRhdGEiLCJnZXRIdHRwUE9TVCIsIkhUVFAiLCJfZ2V0IiwiX2dldERhdGEiLCJfcG9zdCIsIl9wdXQiLCJvdXJVcmwiLCJvdXJRdWVyeSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQSxJQUFJQSxNQUFKO0FBQVdDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGVBQVosRUFBNEI7QUFBQ0YsUUFBTSxDQUFDRyxDQUFELEVBQUc7QUFBQ0gsVUFBTSxHQUFDRyxDQUFQO0FBQVM7O0FBQXBCLENBQTVCLEVBQWtELENBQWxEO0FBQXFELElBQUlDLEtBQUo7QUFBVUgsTUFBTSxDQUFDQyxJQUFQLENBQVksdUJBQVosRUFBb0M7QUFBQ0UsT0FBSyxDQUFDRCxDQUFELEVBQUc7QUFBQ0MsU0FBSyxHQUFDRCxDQUFOO0FBQVE7O0FBQWxCLENBQXBDLEVBQXdELENBQXhEO0FBQTJELElBQUlFLE1BQUo7QUFBV0osTUFBTSxDQUFDQyxJQUFQLENBQVksZUFBWixFQUE0QjtBQUFDRyxRQUFNLENBQUNGLENBQUQsRUFBRztBQUFDRSxVQUFNLEdBQUNGLENBQVA7QUFBUzs7QUFBcEIsQ0FBNUIsRUFBa0QsQ0FBbEQ7QUFLaEpILE1BQU0sQ0FBQ00sT0FBUCxDQUFlLGFBQWYsRUFBOEIsU0FBU0MsU0FBVCxHQUFxQjtBQUNqRCxNQUFHLENBQUMsS0FBS0MsTUFBVCxFQUFpQjtBQUNmLFdBQU8sS0FBS0MsS0FBTCxFQUFQO0FBQ0Q7O0FBQ0QsTUFBRyxDQUFDTCxLQUFLLENBQUNNLFlBQU4sQ0FBbUIsS0FBS0YsTUFBeEIsRUFBZ0MsQ0FBQyxPQUFELENBQWhDLENBQUosRUFBK0M7QUFDN0MsV0FBT0gsTUFBTSxDQUFDTSxJQUFQLENBQVk7QUFBQ0MsYUFBTyxFQUFDLEtBQUtKO0FBQWQsS0FBWixFQUFtQztBQUN4Q0ssWUFBTSxFQUFFUixNQUFNLENBQUNTO0FBRHlCLEtBQW5DLENBQVA7QUFHRDs7QUFHRCxTQUFPVCxNQUFNLENBQUNNLElBQVAsQ0FBWSxFQUFaLEVBQWdCO0FBQ3JCRSxVQUFN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Q0FBZCxFQUNLMGIsT0FETCxDQUNhO0FBQ0xDLE9BQUssRUFBRSxZQUFZO0FBQUVaLEtBQUMsQ0FBQ2EsT0FBRjtBQUFjO0FBRDlCLENBRGIsRTs7Ozs7Ozs7Ozs7QUM1Q0E3akIsTUFBTSxDQUFDQyxJQUFQLENBQVkseUJBQVo7QUFBdUNELE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGdCQUFaLEUiLCJmaWxlIjoiL2FwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IHsgUm9sZXMgfSBmcm9tICdtZXRlb3IvYWxhbm5pbmc6cm9sZXMnO1xuXG5pbXBvcnQgeyBPcHRJbnMgfSBmcm9tICcuLi9vcHQtaW5zLmpzJztcblxuTWV0ZW9yLnB1Ymxpc2goJ29wdC1pbnMuYWxsJywgZnVuY3Rpb24gT3B0SW5zQWxsKCkge1xuICBpZighdGhpcy51c2VySWQpIHtcbiAgICByZXR1cm4gdGhpcy5yZWFkeSgpO1xuICB9XG4gIGlmKCFSb2xlcy51c2VySXNJblJvbGUodGhpcy51c2VySWQsIFsnYWRtaW4nXSkpe1xuICAgIHJldHVybiBPcHRJbnMuZmluZCh7b3duZXJJZDp0aGlzLnVzZXJJZH0sIHtcbiAgICAgIGZpZWxkczogT3B0SW5zLnB1YmxpY0ZpZWxkcyxcbiAgICB9KTtcbiAgfVxuICBcblxuICByZXR1cm4gT3B0SW5zLmZpbmQoe30sIHtcbiAgICBmaWVsZHM6IE9wdElucy5wdWJsaWNGaWVsZHMsXG4gIH0pO1xufSk7XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCB7IEREUFJhdGVMaW1pdGVyIH0gZnJvbSAnbWV0ZW9yL2RkcC1yYXRlLWxpbWl0ZXInO1xuaW1wb3J0IHsgX2kxOG4gYXMgaTE4biB9IGZyb20gJ21ldGVvci91bml2ZXJzZTppMThuJztcbmltcG9ydCB7IFZhbGlkYXRlZE1ldGhvZCB9IGZyb20gJ21ldGVvci9tZGc6dmFsaWRhdGVkLW1ldGhvZCc7XG5pbXBvcnQgeyBSb2xlcyB9IGZyb20gJ21ldGVvci9hbGFubmluZzpyb2xlcyc7XG5pbXBvcnQgeyBfIH0gZnJvbSAnbWV0ZW9yL3VuZGVyc2NvcmUnO1xuaW1wb3J0IGFkZE9wdEluIGZyb20gJy4uLy4uL21vZHVsZXMvc2VydmVyL29wdC1pbnMvYWRkX2FuZF93cml0ZV90b19ibG9ja2NoYWluLmpzJztcblxuY29uc3QgYWRkID0gbmV3IFZhbGlkYXRlZE1ldGhvZCh7XG4gIG5hbWU6ICdvcHQtaW5zLmFkZCcsXG4gIHZhbGlkYXRlOiBudWxsLFxuICBydW4oeyByZWNpcGllbnRNYWlsLCBzZW5kZXJNYWlsLCBkYXRhIH0pIHtcbiAgICBpZighdGhpcy51c2VySWQgfHwgIVJvbGVzLnVzZXJJc0luUm9sZSh0aGlzLnVzZXJJZCwgWydhZG1pbiddKSkge1xuICAgICAgY29uc3QgZXJyb3IgPSBcImFwaS5vcHQtaW5zLmFkZC5hY2Nlc3NEZW5pZWRcIjtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoZXJyb3IsIGkxOG4uX18oZXJyb3IpKTtcbiAgICB9XG5cbiAgICBjb25zdCBvcHRJbiA9IHtcbiAgICAgIFwicmVjaXBpZW50X21haWxcIjogcmVjaXBpZW50TWFpbCxcbiAgICAgIFwic2VuZGVyX21haWxcIjogc2VuZGVyTWFpbCxcbiAgICAgIGRhdGFcbiAgICB9XG5cbiAgICBhZGRPcHRJbihvcHRJbilcbiAgfSxcbn0pO1xuXG4vLyBHZXQgbGlzdCBvZiBhbGwgbWV0aG9kIG5hbWVzIG9uIG9wdC1pbnNcbmNvbnN0IE9QVElPTlNfTUVUSE9EUyA9IF8ucGx1Y2soW1xuICBhZGRcbl0sICduYW1lJyk7XG5cbmlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgLy8gT25seSBhbGxvdyA1IG9wdC1pbiBvcGVyYXRpb25zIHBlciBjb25uZWN0aW9uIHBlciBzZWNvbmRcbiAgRERQUmF0ZUxpbWl0ZXIuYWRkUnVsZSh7XG4gICAgbmFtZShuYW1lKSB7XG4gICAgICByZXR1cm4gXy5jb250YWlucyhPUFRJT05TX01FVEhPRFMsIG5hbWUpO1xuICAgIH0sXG5cbiAgICAvLyBSYXRlIGxpbWl0IHBlciBjb25uZWN0aW9uIElEXG4gICAgY29ubmVjdGlvbklkKCkgeyByZXR1cm4gdHJ1ZTsgfSxcbiAgfSwgNSwgMTAwMCk7XG59XG4iLCJpbXBvcnQgeyBNb25nbyB9IGZyb20gJ21ldGVvci9tb25nbyc7XG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XG5cbmNsYXNzIE9wdEluc0NvbGxlY3Rpb24gZXh0ZW5kcyBNb25nby5Db2xsZWN0aW9uIHtcbiAgaW5zZXJ0KG9wdEluLCBjYWxsYmFjaykge1xuICAgIGNvbnN0IG91ck9wdEluID0gb3B0SW47XG4gICAgb3VyT3B0SW4ucmVjaXBpZW50X3NlbmRlciA9IG91ck9wdEluLnJlY2lwaWVudCtvdXJPcHRJbi5zZW5kZXI7XG4gICAgb3VyT3B0SW4uY3JlYXRlZEF0ID0gb3VyT3B0SW4uY3JlYXRlZEF0IHx8IG5ldyBEYXRlKCk7XG4gICAgY29uc3QgcmVzdWx0ID0gc3VwZXIuaW5zZXJ0KG91ck9wdEluLCBjYWxsYmFjayk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICB1cGRhdGUoc2VsZWN0b3IsIG1vZGlmaWVyKSB7XG4gICAgY29uc3QgcmVzdWx0ID0gc3VwZXIudXBkYXRlKHNlbGVjdG9yLCBtb2RpZmllcik7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICByZW1vdmUoc2VsZWN0b3IpIHtcbiAgICBjb25zdCByZXN1bHQgPSBzdXBlci5yZW1vdmUoc2VsZWN0b3IpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IE9wdElucyA9IG5ldyBPcHRJbnNDb2xsZWN0aW9uKCdvcHQtaW5zJyk7XG5cbi8vIERlbnkgYWxsIGNsaWVudC1zaWRlIHVwZGF0ZXMgc2luY2Ugd2Ugd2lsbCBiZSB1c2luZyBtZXRob2RzIHRvIG1hbmFnZSB0aGlzIGNvbGxlY3Rpb25cbk9wdElucy5kZW55KHtcbiAgaW5zZXJ0KCkgeyByZXR1cm4gdHJ1ZTsgfSxcbiAgdXBkYXRlKCkgeyByZXR1cm4gdHJ1ZTsgfSxcbiAgcmVtb3ZlKCkgeyByZXR1cm4gdHJ1ZTsgfSxcbn0pO1xuXG5PcHRJbnMuc2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIF9pZDoge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICByZWdFeDogU2ltcGxlU2NoZW1hLlJlZ0V4LklkLFxuICB9LFxuICByZWNpcGllbnQ6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgb3B0aW9uYWw6IHRydWUsXG4gICAgZGVueVVwZGF0ZTogdHJ1ZSxcbiAgfSxcbiAgc2VuZGVyOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIG9wdGlvbmFsOiB0cnVlLFxuICAgIGRlbnlVcGRhdGU6IHRydWUsXG4gIH0sXG4gIGRhdGE6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgb3B0aW9uYWw6IHRydWUsXG4gICAgZGVueVVwZGF0ZTogZmFsc2UsXG4gIH0sXG4gIGluZGV4OiB7XG4gICAgdHlwZTogU2ltcGxlU2NoZW1hLkludGVnZXIsXG4gICAgb3B0aW9uYWw6IHRydWUsXG4gICAgZGVueVVwZGF0ZTogZmFsc2UsXG4gIH0sXG4gIG5hbWVJZDoge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICBvcHRpb25hbDogdHJ1ZSxcbiAgICBkZW55VXBkYXRlOiBmYWxzZSxcbiAgfSxcbiAgdHhJZDoge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgb3B0aW9uYWw6IHRydWUsXG4gICAgICBkZW55VXBkYXRlOiBmYWxzZSxcbiAgfSxcbiAgbWFzdGVyRG9pOiB7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICBvcHRpb25hbDogdHJ1ZSxcbiAgICAgIGRlbnlVcGRhdGU6IGZhbHNlLFxuICB9LFxuICBjcmVhdGVkQXQ6IHtcbiAgICB0eXBlOiBEYXRlLFxuICAgIGRlbnlVcGRhdGU6IHRydWUsXG4gIH0sXG4gIGNvbmZpcm1lZEF0OiB7XG4gICAgdHlwZTogRGF0ZSxcbiAgICBvcHRpb25hbDogdHJ1ZSxcbiAgICBkZW55VXBkYXRlOiBmYWxzZSxcbiAgfSxcbiAgY29uZmlybWVkQnk6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgcmVnRXg6IFNpbXBsZVNjaGVtYS5SZWdFeC5JUCxcbiAgICBvcHRpb25hbDogdHJ1ZSxcbiAgICBkZW55VXBkYXRlOiBmYWxzZVxuICB9LFxuICBjb25maXJtYXRpb25Ub2tlbjoge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICBvcHRpb25hbDogdHJ1ZSxcbiAgICBkZW55VXBkYXRlOiBmYWxzZVxuICB9LFxuICBvd25lcklkOntcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgb3B0aW9uYWw6IHRydWUsXG4gICAgcmVnRXg6IFNpbXBsZVNjaGVtYS5SZWdFeC5JZFxuICB9LFxuICBlcnJvcjp7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICBvcHRpb25hbDogdHJ1ZSxcbiAgICAgIGRlbnlVcGRhdGU6IGZhbHNlXG4gIH1cbn0pO1xuXG5PcHRJbnMuYXR0YWNoU2NoZW1hKE9wdElucy5zY2hlbWEpO1xuXG4vLyBUaGlzIHJlcHJlc2VudHMgdGhlIGtleXMgZnJvbSBPcHQtSW4gb2JqZWN0cyB0aGF0IHNob3VsZCBiZSBwdWJsaXNoZWRcbi8vIHRvIHRoZSBjbGllbnQuIElmIHdlIGFkZCBzZWNyZXQgcHJvcGVydGllcyB0byBPcHQtSW4gb2JqZWN0cywgZG9uJ3QgbGlzdFxuLy8gdGhlbSBoZXJlIHRvIGtlZXAgdGhlbSBwcml2YXRlIHRvIHRoZSBzZXJ2ZXIuXG5PcHRJbnMucHVibGljRmllbGRzID0ge1xuICBfaWQ6IDEsXG4gIHJlY2lwaWVudDogMSxcbiAgc2VuZGVyOiAxLFxuICBkYXRhOiAxLFxuICBpbmRleDogMSxcbiAgbmFtZUlkOiAxLFxuICB0eElkOiAxLFxuICBtYXN0ZXJEb2k6IDEsXG4gIGNyZWF0ZWRBdDogMSxcbiAgY29uZmlybWVkQXQ6IDEsXG4gIGNvbmZpcm1lZEJ5OiAxLFxuICBvd25lcklkOiAxLFxuICBlcnJvcjogMVxufTtcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IHsgUm9sZXMgfSBmcm9tICdtZXRlb3IvYWxhbm5pbmc6cm9sZXMnO1xuXG5pbXBvcnQgeyBSZWNpcGllbnRzIH0gZnJvbSAnLi4vcmVjaXBpZW50cy5qcyc7XG5pbXBvcnQgeyBPcHRJbnN9IGZyb20gJy4uLy4uL29wdC1pbnMvb3B0LWlucy5qcydcbk1ldGVvci5wdWJsaXNoKCdyZWNpcGllbnRzLmJ5T3duZXInLGZ1bmN0aW9uIHJlY2lwaWVudEdldCgpe1xuICBsZXQgcGlwZWxpbmU9W107XG4gIGlmKCFSb2xlcy51c2VySXNJblJvbGUodGhpcy51c2VySWQsIFsnYWRtaW4nXSkpe1xuICAgIHBpcGVsaW5lLnB1c2goXG4gICAgICB7JHJlZGFjdDp7XG4gICAgICAkY29uZDoge1xuICAgICAgICBpZjogeyAkY21wOiBbIFwiJG93bmVySWRcIiwgdGhpcy51c2VySWQgXSB9LFxuICAgICAgICB0aGVuOiBcIiQkUFJVTkVcIixcbiAgICAgICAgZWxzZTogXCIkJEtFRVBcIiB9fX0pO1xuICAgICAgfVxuICAgICAgcGlwZWxpbmUucHVzaCh7ICRsb29rdXA6IHsgZnJvbTogXCJyZWNpcGllbnRzXCIsIGxvY2FsRmllbGQ6IFwicmVjaXBpZW50XCIsIGZvcmVpZ25GaWVsZDogXCJfaWRcIiwgYXM6IFwiUmVjaXBpZW50RW1haWxcIiB9IH0pO1xuICAgICAgcGlwZWxpbmUucHVzaCh7ICR1bndpbmQ6IFwiJFJlY2lwaWVudEVtYWlsXCJ9KTtcbiAgICAgIHBpcGVsaW5lLnB1c2goeyAkcHJvamVjdDoge1wiUmVjaXBpZW50RW1haWwuX2lkXCI6MX19KTtcblxuICAgICAgY29uc3QgcmVzdWx0ID0gT3B0SW5zLmFnZ3JlZ2F0ZShwaXBlbGluZSk7XG4gICAgICBsZXQgcklkcz1bXTtcbiAgICAgIHJlc3VsdC5mb3JFYWNoKGVsZW1lbnQgPT4ge1xuICAgICAgICBySWRzLnB1c2goZWxlbWVudC5SZWNpcGllbnRFbWFpbC5faWQpO1xuICAgICAgfSk7XG4gIHJldHVybiBSZWNpcGllbnRzLmZpbmQoe1wiX2lkXCI6e1wiJGluXCI6cklkc319LHtmaWVsZHM6UmVjaXBpZW50cy5wdWJsaWNGaWVsZHN9KTtcbn0pO1xuTWV0ZW9yLnB1Ymxpc2goJ3JlY2lwaWVudHMuYWxsJywgZnVuY3Rpb24gcmVjaXBpZW50c0FsbCgpIHtcbiAgaWYoIXRoaXMudXNlcklkIHx8ICFSb2xlcy51c2VySXNJblJvbGUodGhpcy51c2VySWQsIFsnYWRtaW4nXSkpIHtcbiAgICByZXR1cm4gdGhpcy5yZWFkeSgpO1xuICB9XG5cbiAgcmV0dXJuIFJlY2lwaWVudHMuZmluZCh7fSwge1xuICAgIGZpZWxkczogUmVjaXBpZW50cy5wdWJsaWNGaWVsZHMsXG4gIH0pO1xufSk7XG4iLCJpbXBvcnQgeyBNb25nbyB9IGZyb20gJ21ldGVvci9tb25nbyc7XG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XG5cbmNsYXNzIFJlY2lwaWVudHNDb2xsZWN0aW9uIGV4dGVuZHMgTW9uZ28uQ29sbGVjdGlvbiB7XG4gIGluc2VydChyZWNpcGllbnQsIGNhbGxiYWNrKSB7XG4gICAgY29uc3Qgb3VyUmVjaXBpZW50ID0gcmVjaXBpZW50O1xuICAgIG91clJlY2lwaWVudC5jcmVhdGVkQXQgPSBvdXJSZWNpcGllbnQuY3JlYXRlZEF0IHx8IG5ldyBEYXRlKCk7XG4gICAgY29uc3QgcmVzdWx0ID0gc3VwZXIuaW5zZXJ0KG91clJlY2lwaWVudCwgY2FsbGJhY2spO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgdXBkYXRlKHNlbGVjdG9yLCBtb2RpZmllcikge1xuICAgIGNvbnN0IHJlc3VsdCA9IHN1cGVyLnVwZGF0ZShzZWxlY3RvciwgbW9kaWZpZXIpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgcmVtb3ZlKHNlbGVjdG9yKSB7XG4gICAgY29uc3QgcmVzdWx0ID0gc3VwZXIucmVtb3ZlKHNlbGVjdG9yKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG5cbmV4cG9ydCBjb25zdCBSZWNpcGllbnRzID0gbmV3IFJlY2lwaWVudHNDb2xsZWN0aW9uKCdyZWNpcGllbnRzJyk7XG5cbi8vIERlbnkgYWxsIGNsaWVudC1zaWRlIHVwZGF0ZXMgc2luY2Ugd2Ugd2lsbCBiZSB1c2luZyBtZXRob2RzIHRvIG1hbmFnZSB0aGlzIGNvbGxlY3Rpb25cblJlY2lwaWVudHMuZGVueSh7XG4gIGluc2VydCgpIHsgcmV0dXJuIHRydWU7IH0sXG4gIHVwZGF0ZSgpIHsgcmV0dXJuIHRydWU7IH0sXG4gIHJlbW92ZSgpIHsgcmV0dXJuIHRydWU7IH0sXG59KTtcblxuUmVjaXBpZW50cy5zY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgX2lkOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIHJlZ0V4OiBTaW1wbGVTY2hlbWEuUmVnRXguSWQsXG4gIH0sXG4gIGVtYWlsOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIGluZGV4OiB0cnVlLFxuICAgIGRlbnlVcGRhdGU6IHRydWUsXG4gIH0sXG4gIHByaXZhdGVLZXk6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgdW5pcXVlOiB0cnVlLFxuICAgIGRlbnlVcGRhdGU6IHRydWUsXG4gIH0sXG4gIHB1YmxpY0tleToge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICB1bmlxdWU6IHRydWUsXG4gICAgZGVueVVwZGF0ZTogdHJ1ZSxcbiAgfSxcbiAgY3JlYXRlZEF0OiB7XG4gICAgdHlwZTogRGF0ZSxcbiAgICBkZW55VXBkYXRlOiB0cnVlLFxuICB9XG59KTtcblxuUmVjaXBpZW50cy5hdHRhY2hTY2hlbWEoUmVjaXBpZW50cy5zY2hlbWEpO1xuXG4vLyBUaGlzIHJlcHJlc2VudHMgdGhlIGtleXMgZnJvbSBSZWNpcGllbnQgb2JqZWN0cyB0aGF0IHNob3VsZCBiZSBwdWJsaXNoZWRcbi8vIHRvIHRoZSBjbGllbnQuIElmIHdlIGFkZCBzZWNyZXQgcHJvcGVydGllcyB0byBSZWNpcGllbnQgb2JqZWN0cywgZG9uJ3QgbGlzdFxuLy8gdGhlbSBoZXJlIHRvIGtlZXAgdGhlbSBwcml2YXRlIHRvIHRoZSBzZXJ2ZXIuXG5SZWNpcGllbnRzLnB1YmxpY0ZpZWxkcyA9IHtcbiAgX2lkOiAxLFxuICBlbWFpbDogMSxcbiAgcHVibGljS2V5OiAxLFxuICBjcmVhdGVkQXQ6IDFcbn07XG4iLCJpbXBvcnQgeyBNb25nbyB9IGZyb20gJ21ldGVvci9tb25nbyc7XG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XG5cbmNsYXNzIERvaWNoYWluRW50cmllc0NvbGxlY3Rpb24gZXh0ZW5kcyBNb25nby5Db2xsZWN0aW9uIHtcbiAgaW5zZXJ0KGVudHJ5LCBjYWxsYmFjaykge1xuICAgIGNvbnN0IHJlc3VsdCA9IHN1cGVyLmluc2VydChlbnRyeSwgY2FsbGJhY2spO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgdXBkYXRlKHNlbGVjdG9yLCBtb2RpZmllcikge1xuICAgIGNvbnN0IHJlc3VsdCA9IHN1cGVyLnVwZGF0ZShzZWxlY3RvciwgbW9kaWZpZXIpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgcmVtb3ZlKHNlbGVjdG9yKSB7XG4gICAgY29uc3QgcmVzdWx0ID0gc3VwZXIucmVtb3ZlKHNlbGVjdG9yKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG5cbmV4cG9ydCBjb25zdCBEb2ljaGFpbkVudHJpZXMgPSBuZXcgRG9pY2hhaW5FbnRyaWVzQ29sbGVjdGlvbignZG9pY2hhaW4tZW50cmllcycpO1xuXG4vLyBEZW55IGFsbCBjbGllbnQtc2lkZSB1cGRhdGVzIHNpbmNlIHdlIHdpbGwgYmUgdXNpbmcgbWV0aG9kcyB0byBtYW5hZ2UgdGhpcyBjb2xsZWN0aW9uXG5Eb2ljaGFpbkVudHJpZXMuZGVueSh7XG4gIGluc2VydCgpIHsgcmV0dXJuIHRydWU7IH0sXG4gIHVwZGF0ZSgpIHsgcmV0dXJuIHRydWU7IH0sXG4gIHJlbW92ZSgpIHsgcmV0dXJuIHRydWU7IH0sXG59KTtcblxuRG9pY2hhaW5FbnRyaWVzLnNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICBfaWQ6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgcmVnRXg6IFNpbXBsZVNjaGVtYS5SZWdFeC5JZCxcbiAgfSxcbiAgbmFtZToge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICBpbmRleDogdHJ1ZSxcbiAgICBkZW55VXBkYXRlOiB0cnVlXG4gIH0sXG4gIHZhbHVlOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIGRlbnlVcGRhdGU6IGZhbHNlXG4gIH0sXG4gIGFkZHJlc3M6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgZGVueVVwZGF0ZTogZmFsc2VcbiAgfSxcbiAgbWFzdGVyRG9pOiB7XG4gICAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgICAgb3B0aW9uYWw6IHRydWUsXG4gICAgICAgIGluZGV4OiB0cnVlLFxuICAgICAgICBkZW55VXBkYXRlOiB0cnVlXG4gIH0sXG4gIGluZGV4OiB7XG4gICAgICAgIHR5cGU6IFNpbXBsZVNjaGVtYS5JbnRlZ2VyLFxuICAgICAgICBvcHRpb25hbDogdHJ1ZSxcbiAgICAgICAgZGVueVVwZGF0ZTogdHJ1ZVxuICB9LFxuICB0eElkOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIGRlbnlVcGRhdGU6IGZhbHNlXG4gIH1cbn0pO1xuXG5Eb2ljaGFpbkVudHJpZXMuYXR0YWNoU2NoZW1hKERvaWNoYWluRW50cmllcy5zY2hlbWEpO1xuXG4vLyBUaGlzIHJlcHJlc2VudHMgdGhlIGtleXMgZnJvbSBFbnRyeSBvYmplY3RzIHRoYXQgc2hvdWxkIGJlIHB1Ymxpc2hlZFxuLy8gdG8gdGhlIGNsaWVudC4gSWYgd2UgYWRkIHNlY3JldCBwcm9wZXJ0aWVzIHRvIEVudHJ5IG9iamVjdHMsIGRvbid0IGxpc3Rcbi8vIHRoZW0gaGVyZSB0byBrZWVwIHRoZW0gcHJpdmF0ZSB0byB0aGUgc2VydmVyLlxuRG9pY2hhaW5FbnRyaWVzLnB1YmxpY0ZpZWxkcyA9IHtcbiAgX2lkOiAxLFxuICBuYW1lOiAxLFxuICB2YWx1ZTogMSxcbiAgYWRkcmVzczogMSxcbiAgbWFzdGVyRG9pOiAxLFxuICBpbmRleDogMSxcbiAgdHhJZDogMVxufTtcbiIsImltcG9ydCB7IFZhbGlkYXRlZE1ldGhvZCB9IGZyb20gJ21ldGVvci9tZGc6dmFsaWRhdGVkLW1ldGhvZCc7XG5pbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCB7IEREUFJhdGVMaW1pdGVyIH0gZnJvbSAnbWV0ZW9yL2RkcC1yYXRlLWxpbWl0ZXInO1xuaW1wb3J0IGdldEtleVBhaXJNIGZyb20gJy4uLy4uL21vZHVsZXMvc2VydmVyL2RvaWNoYWluL2dldF9rZXktcGFpci5qcyc7XG5pbXBvcnQgZ2V0QmFsYW5jZU0gZnJvbSAnLi4vLi4vbW9kdWxlcy9zZXJ2ZXIvZG9pY2hhaW4vZ2V0X2JhbGFuY2UuanMnO1xuXG5cbmNvbnN0IGdldEtleVBhaXIgPSBuZXcgVmFsaWRhdGVkTWV0aG9kKHtcbiAgbmFtZTogJ2RvaWNoYWluLmdldEtleVBhaXInLFxuICB2YWxpZGF0ZTogbnVsbCxcbiAgcnVuKCkge1xuICAgIHJldHVybiBnZXRLZXlQYWlyTSgpO1xuICB9LFxufSk7XG5cbmNvbnN0IGdldEJhbGFuY2UgPSBuZXcgVmFsaWRhdGVkTWV0aG9kKHtcbiAgbmFtZTogJ2RvaWNoYWluLmdldEJhbGFuY2UnLFxuICB2YWxpZGF0ZTogbnVsbCxcbiAgcnVuKCkge1xuICAgIGNvbnN0IGxvZ1ZhbCA9IGdldEJhbGFuY2VNKCk7XG4gICAgcmV0dXJuIGxvZ1ZhbDtcbiAgfSxcbn0pO1xuXG5cbi8vIEdldCBsaXN0IG9mIGFsbCBtZXRob2QgbmFtZXMgb24gZG9pY2hhaW5cbmNvbnN0IE9QVElOU19NRVRIT0RTID0gXy5wbHVjayhbXG4gIGdldEtleVBhaXJcbixnZXRCYWxhbmNlXSwgJ25hbWUnKTtcblxuaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAvLyBPbmx5IGFsbG93IDUgb3B0LWluIG9wZXJhdGlvbnMgcGVyIGNvbm5lY3Rpb24gcGVyIHNlY29uZFxuICBERFBSYXRlTGltaXRlci5hZGRSdWxlKHtcbiAgICBuYW1lKG5hbWUpIHtcbiAgICAgIHJldHVybiBfLmNvbnRhaW5zKE9QVElOU19NRVRIT0RTLCBuYW1lKTtcbiAgICB9LFxuXG4gICAgLy8gUmF0ZSBsaW1pdCBwZXIgY29ubmVjdGlvbiBJRFxuICAgIGNvbm5lY3Rpb25JZCgpIHsgcmV0dXJuIHRydWU7IH0sXG4gIH0sIDUsIDEwMDApO1xufVxuIiwiaW1wb3J0IHsgTWV0ZW9yfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCB7IEREUFJhdGVMaW1pdGVyIH0gZnJvbSAnbWV0ZW9yL2RkcC1yYXRlLWxpbWl0ZXInO1xuaW1wb3J0IHsgVmFsaWRhdGVkTWV0aG9kIH0gZnJvbSAnbWV0ZW9yL21kZzp2YWxpZGF0ZWQtbWV0aG9kJztcbmltcG9ydCBnZXRMYW5ndWFnZXMgZnJvbSAnLi4vLi4vbW9kdWxlcy9zZXJ2ZXIvbGFuZ3VhZ2VzL2dldC5qcyc7XG5cbmNvbnN0IGdldEFsbExhbmd1YWdlcyA9IG5ldyBWYWxpZGF0ZWRNZXRob2Qoe1xuICBuYW1lOiAnbGFuZ3VhZ2VzLmdldEFsbCcsXG4gIHZhbGlkYXRlOiBudWxsLFxuICBydW4oKSB7XG4gICAgcmV0dXJuIGdldExhbmd1YWdlcygpO1xuICB9LFxufSk7XG5cbi8vIEdldCBsaXN0IG9mIGFsbCBtZXRob2QgbmFtZXMgb24gbGFuZ3VhZ2VzXG5jb25zdCBPUFRJTlNfTUVUSE9EUyA9IF8ucGx1Y2soW1xuICBnZXRBbGxMYW5ndWFnZXNcbl0sICduYW1lJyk7XG5cbmlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgLy8gT25seSBhbGxvdyA1IG9wdC1pbiBvcGVyYXRpb25zIHBlciBjb25uZWN0aW9uIHBlciBzZWNvbmRcbiAgRERQUmF0ZUxpbWl0ZXIuYWRkUnVsZSh7XG4gICAgbmFtZShuYW1lKSB7XG4gICAgICByZXR1cm4gXy5jb250YWlucyhPUFRJTlNfTUVUSE9EUywgbmFtZSk7XG4gICAgfSxcblxuICAgIC8vIFJhdGUgbGltaXQgcGVyIGNvbm5lY3Rpb24gSURcbiAgICBjb25uZWN0aW9uSWQoKSB7IHJldHVybiB0cnVlOyB9LFxuICB9LCA1LCAxMDAwKTtcbn1cbiIsImltcG9ydCB7IE1vbmdvIH0gZnJvbSAnbWV0ZW9yL21vbmdvJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcblxuY2xhc3MgTWV0YUNvbGxlY3Rpb24gZXh0ZW5kcyBNb25nby5Db2xsZWN0aW9uIHtcbiAgaW5zZXJ0KGRhdGEsIGNhbGxiYWNrKSB7XG4gICAgY29uc3Qgb3VyRGF0YSA9IGRhdGE7XG4gICAgY29uc3QgcmVzdWx0ID0gc3VwZXIuaW5zZXJ0KG91ckRhdGEsIGNhbGxiYWNrKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIHVwZGF0ZShzZWxlY3RvciwgbW9kaWZpZXIpIHtcbiAgICBjb25zdCByZXN1bHQgPSBzdXBlci51cGRhdGUoc2VsZWN0b3IsIG1vZGlmaWVyKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIHJlbW92ZShzZWxlY3Rvcikge1xuICAgIGNvbnN0IHJlc3VsdCA9IHN1cGVyLnJlbW92ZShzZWxlY3Rvcik7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgTWV0YSA9IG5ldyBNZXRhQ29sbGVjdGlvbignbWV0YScpO1xuXG4vLyBEZW55IGFsbCBjbGllbnQtc2lkZSB1cGRhdGVzIHNpbmNlIHdlIHdpbGwgYmUgdXNpbmcgbWV0aG9kcyB0byBtYW5hZ2UgdGhpcyBjb2xsZWN0aW9uXG5NZXRhLmRlbnkoe1xuICBpbnNlcnQoKSB7IHJldHVybiB0cnVlOyB9LFxuICB1cGRhdGUoKSB7IHJldHVybiB0cnVlOyB9LFxuICByZW1vdmUoKSB7IHJldHVybiB0cnVlOyB9LFxufSk7XG5cbk1ldGEuc2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIF9pZDoge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICByZWdFeDogU2ltcGxlU2NoZW1hLlJlZ0V4LklkLFxuICB9LFxuICBrZXk6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgaW5kZXg6IHRydWUsXG4gICAgZGVueVVwZGF0ZTogdHJ1ZVxuICB9LFxuICB2YWx1ZToge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9XG59KTtcblxuTWV0YS5hdHRhY2hTY2hlbWEoTWV0YS5zY2hlbWEpO1xuXG4vLyBUaGlzIHJlcHJlc2VudHMgdGhlIGtleXMgZnJvbSBNZXRhIG9iamVjdHMgdGhhdCBzaG91bGQgYmUgcHVibGlzaGVkXG4vLyB0byB0aGUgY2xpZW50LiBJZiB3ZSBhZGQgc2VjcmV0IHByb3BlcnRpZXMgdG8gTWV0YSBvYmplY3RzLCBkb24ndCBsaXN0XG4vLyB0aGVtIGhlcmUgdG8ga2VlcCB0aGVtIHByaXZhdGUgdG8gdGhlIHNlcnZlci5cbk1ldGEucHVibGljRmllbGRzID0ge1xufTtcbiIsImltcG9ydCB7IE1vbmdvIH0gZnJvbSAnbWV0ZW9yL21vbmdvJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcblxuY2xhc3MgU2VuZGVyc0NvbGxlY3Rpb24gZXh0ZW5kcyBNb25nby5Db2xsZWN0aW9uIHtcbiAgaW5zZXJ0KHNlbmRlciwgY2FsbGJhY2spIHtcbiAgICBjb25zdCBvdXJTZW5kZXIgPSBzZW5kZXI7XG4gICAgb3VyU2VuZGVyLmNyZWF0ZWRBdCA9IG91clNlbmRlci5jcmVhdGVkQXQgfHwgbmV3IERhdGUoKTtcbiAgICBjb25zdCByZXN1bHQgPSBzdXBlci5pbnNlcnQob3VyU2VuZGVyLCBjYWxsYmFjayk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICB1cGRhdGUoc2VsZWN0b3IsIG1vZGlmaWVyKSB7XG4gICAgY29uc3QgcmVzdWx0ID0gc3VwZXIudXBkYXRlKHNlbGVjdG9yLCBtb2RpZmllcik7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICByZW1vdmUoc2VsZWN0b3IpIHtcbiAgICBjb25zdCByZXN1bHQgPSBzdXBlci5yZW1vdmUoc2VsZWN0b3IpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IFNlbmRlcnMgPSBuZXcgU2VuZGVyc0NvbGxlY3Rpb24oJ3NlbmRlcnMnKTtcblxuLy8gRGVueSBhbGwgY2xpZW50LXNpZGUgdXBkYXRlcyBzaW5jZSB3ZSB3aWxsIGJlIHVzaW5nIG1ldGhvZHMgdG8gbWFuYWdlIHRoaXMgY29sbGVjdGlvblxuU2VuZGVycy5kZW55KHtcbiAgaW5zZXJ0KCkgeyByZXR1cm4gdHJ1ZTsgfSxcbiAgdXBkYXRlKCkgeyByZXR1cm4gdHJ1ZTsgfSxcbiAgcmVtb3ZlKCkgeyByZXR1cm4gdHJ1ZTsgfSxcbn0pO1xuXG5TZW5kZXJzLnNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICBfaWQ6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgcmVnRXg6IFNpbXBsZVNjaGVtYS5SZWdFeC5JZCxcbiAgfSxcbiAgZW1haWw6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgaW5kZXg6IHRydWUsXG4gICAgZGVueVVwZGF0ZTogdHJ1ZSxcbiAgfSxcbiAgY3JlYXRlZEF0OiB7XG4gICAgdHlwZTogRGF0ZSxcbiAgICBkZW55VXBkYXRlOiB0cnVlLFxuICB9XG59KTtcblxuU2VuZGVycy5hdHRhY2hTY2hlbWEoU2VuZGVycy5zY2hlbWEpO1xuXG4vLyBUaGlzIHJlcHJlc2VudHMgdGhlIGtleXMgZnJvbSBTZW5kZXIgb2JqZWN0cyB0aGF0IHNob3VsZCBiZSBwdWJsaXNoZWRcbi8vIHRvIHRoZSBjbGllbnQuIElmIHdlIGFkZCBzZWNyZXQgcHJvcGVydGllcyB0byBTZW5kZXIgb2JqZWN0cywgZG9uJ3QgbGlzdFxuLy8gdGhlbSBoZXJlIHRvIGtlZXAgdGhlbSBwcml2YXRlIHRvIHRoZSBzZXJ2ZXIuXG5TZW5kZXJzLnB1YmxpY0ZpZWxkcyA9IHtcbiAgZW1haWw6IDEsXG4gIGNyZWF0ZWRBdDogMVxufTtcbiIsImltcG9ydCB7IE1ldGVvcn0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgeyBNZXRhIH0gZnJvbSAnLi4vbWV0YS9tZXRhJztcblxuTWV0ZW9yLnB1Ymxpc2goJ3ZlcnNpb24nLCBmdW5jdGlvbiB2ZXJzaW9uKCkge1xuICByZXR1cm4gTWV0YS5maW5kKHt9KTtcbn0pO1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XG5pbXBvcnQgeyBET0lfTUFJTF9GRVRDSF9VUkwgfSBmcm9tICcuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9lbWFpbC1jb25maWd1cmF0aW9uLmpzJztcbmltcG9ydCB7bG9nU2VuZH0gZnJvbSBcIi4uLy4uLy4uL3N0YXJ0dXAvc2VydmVyL2xvZy1jb25maWd1cmF0aW9uXCI7XG5pbXBvcnQge09wdEluc30gZnJvbSBcIi4uLy4uLy4uL2FwaS9vcHQtaW5zL29wdC1pbnNcIjtcblxuY29uc3QgRXhwb3J0RG9pc0RhdGFTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgc3RhdHVzOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIG9wdGlvbmFsOiB0cnVlLFxuICB9LFxuICByb2xlOntcbiAgICB0eXBlOlN0cmluZ1xuICB9LFxuICB1c2VyaWQ6e1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICByZWdFeDogU2ltcGxlU2NoZW1hLlJlZ0V4LmlkLFxuICAgIG9wdGlvbmFsOnRydWUgXG4gIH1cbn0pO1xuXG4vL1RPRE8gYWRkIHNlbmRlciBhbmQgcmVjaXBpZW50IGVtYWlsIGFkZHJlc3MgdG8gZXhwb3J0XG5cbmNvbnN0IGV4cG9ydERvaXMgPSAoZGF0YSkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IG91ckRhdGEgPSBkYXRhO1xuICAgIEV4cG9ydERvaXNEYXRhU2NoZW1hLnZhbGlkYXRlKG91ckRhdGEpO1xuICAgIGxldCBwaXBlbGluZT1beyAkbWF0Y2g6IHtcImNvbmZpcm1lZEF0XCI6eyAkZXhpc3RzOiB0cnVlLCAkbmU6IG51bGwgfX0gfV07XG4gICAgXG4gICAgaWYob3VyRGF0YS5yb2xlIT0nYWRtaW4nfHxvdXJEYXRhLnVzZXJpZCE9dW5kZWZpbmVkKXtcbiAgICAgIHBpcGVsaW5lLnB1c2goeyAkcmVkYWN0OntcbiAgICAgICAgJGNvbmQ6IHtcbiAgICAgICAgICBpZjogeyAkY21wOiBbIFwiJG93bmVySWRcIiwgb3VyRGF0YS51c2VyaWQgXSB9LFxuICAgICAgICAgIHRoZW46IFwiJCRQUlVORVwiLFxuICAgICAgICAgIGVsc2U6IFwiJCRLRUVQXCIgfX19KTtcbiAgICB9XG4gICAgcGlwZWxpbmUuY29uY2F0KFtcbiAgICAgICAgeyAkbG9va3VwOiB7IGZyb206IFwicmVjaXBpZW50c1wiLCBsb2NhbEZpZWxkOiBcInJlY2lwaWVudFwiLCBmb3JlaWduRmllbGQ6IFwiX2lkXCIsIGFzOiBcIlJlY2lwaWVudEVtYWlsXCIgfSB9LFxuICAgICAgICB7ICRsb29rdXA6IHsgZnJvbTogXCJzZW5kZXJzXCIsIGxvY2FsRmllbGQ6IFwic2VuZGVyXCIsIGZvcmVpZ25GaWVsZDogXCJfaWRcIiwgYXM6IFwiU2VuZGVyRW1haWxcIiB9IH0sXG4gICAgICAgIHsgJHVud2luZDogXCIkU2VuZGVyRW1haWxcIn0sXG4gICAgICAgIHsgJHVud2luZDogXCIkUmVjaXBpZW50RW1haWxcIn0sXG4gICAgICAgIHsgJHByb2plY3Q6IHtcIl9pZFwiOjEsXCJjcmVhdGVkQXRcIjoxLCBcImNvbmZpcm1lZEF0XCI6MSxcIm5hbWVJZFwiOjEsIFwiU2VuZGVyRW1haWwuZW1haWxcIjoxLFwiUmVjaXBpZW50RW1haWwuZW1haWxcIjoxfX1cbiAgICBdKTtcbiAgICAvL2lmKG91ckRhdGEuc3RhdHVzPT0xKSBxdWVyeSA9IHtcImNvbmZpcm1lZEF0XCI6IHsgJGV4aXN0czogdHJ1ZSwgJG5lOiBudWxsIH19XG5cbiAgICBsZXQgb3B0SW5zID0gIE9wdElucy5hZ2dyZWdhdGUocGlwZWxpbmUpO1xuICAgIGxldCBleHBvcnREb2lEYXRhO1xuICAgIHRyeSB7XG4gICAgICAgIGV4cG9ydERvaURhdGEgPSBvcHRJbnM7XG4gICAgICAgIGxvZ1NlbmQoJ2V4cG9ydERvaSB1cmw6JyxET0lfTUFJTF9GRVRDSF9VUkwsSlNPTi5zdHJpbmdpZnkoZXhwb3J0RG9pRGF0YSkpO1xuICAgICAgcmV0dXJuIGV4cG9ydERvaURhdGFcblxuICAgIH0gY2F0Y2goZXJyb3IpIHtcbiAgICAgIHRocm93IFwiRXJyb3Igd2hpbGUgZXhwb3J0aW5nIGRvaXM6IFwiK2Vycm9yO1xuICAgIH1cblxuICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdkYXBwcy5leHBvcnREb2kuZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgZXhwb3J0RG9pcztcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tICdzaW1wbC1zY2hlbWEnO1xuaW1wb3J0IHsgRE9JX0ZFVENIX1JPVVRFLCBET0lfQ09ORklSTUFUSU9OX1JPVVRFLCBBUElfUEFUSCwgVkVSU0lPTiB9IGZyb20gJy4uLy4uLy4uLy4uL3NlcnZlci9hcGkvcmVzdC9yZXN0LmpzJztcbmltcG9ydCB7IGdldFVybCB9IGZyb20gJy4uLy4uLy4uL3N0YXJ0dXAvc2VydmVyL2RhcHAtY29uZmlndXJhdGlvbi5qcyc7XG5pbXBvcnQgeyBDT05GSVJNX0NMSUVOVCwgQ09ORklSTV9BRERSRVNTIH0gZnJvbSAnLi4vLi4vLi4vc3RhcnR1cC9zZXJ2ZXIvZG9pY2hhaW4tY29uZmlndXJhdGlvbi5qcyc7XG5pbXBvcnQgeyBnZXRIdHRwR0VUIH0gZnJvbSAnLi4vLi4vLi4vLi4vc2VydmVyL2FwaS9odHRwLmpzJztcbmltcG9ydCB7IHNpZ25NZXNzYWdlIH0gZnJvbSAnLi4vLi4vLi4vLi4vc2VydmVyL2FwaS9kb2ljaGFpbi5qcyc7XG5pbXBvcnQgeyBPcHRJbnMgfSBmcm9tICcuLi8uLi8uLi8uLi9pbXBvcnRzL2FwaS9vcHQtaW5zL29wdC1pbnMuanMnO1xuaW1wb3J0IHBhcnNlVGVtcGxhdGUgZnJvbSAnLi4vZW1haWxzL3BhcnNlX3RlbXBsYXRlLmpzJztcbmltcG9ydCBnZW5lcmF0ZURvaVRva2VuIGZyb20gJy4uL29wdC1pbnMvZ2VuZXJhdGVfZG9pLXRva2VuLmpzJztcbmltcG9ydCBnZW5lcmF0ZURvaUhhc2ggZnJvbSAnLi4vZW1haWxzL2dlbmVyYXRlX2RvaS1oYXNoLmpzJztcbmltcG9ydCBhZGRPcHRJbiBmcm9tICcuLi9vcHQtaW5zL2FkZC5qcyc7XG5pbXBvcnQgYWRkU2VuZE1haWxKb2IgZnJvbSAnLi4vam9icy9hZGRfc2VuZF9tYWlsLmpzJztcbmltcG9ydCB7bG9nQ29uZmlybSwgbG9nRXJyb3J9IGZyb20gXCIuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9sb2ctY29uZmlndXJhdGlvblwiO1xuXG5jb25zdCBGZXRjaERvaU1haWxEYXRhU2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIG5hbWU6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfSxcbiAgZG9tYWluOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH1cbn0pO1xuXG5cbmNvbnN0IGZldGNoRG9pTWFpbERhdGEgPSAoZGF0YSkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IG91ckRhdGEgPSBkYXRhO1xuICAgIEZldGNoRG9pTWFpbERhdGFTY2hlbWEudmFsaWRhdGUob3VyRGF0YSk7XG4gICAgY29uc3QgdXJsID0gb3VyRGF0YS5kb21haW4rQVBJX1BBVEgrVkVSU0lPTitcIi9cIitET0lfRkVUQ0hfUk9VVEU7XG4gICAgY29uc3Qgc2lnbmF0dXJlID0gc2lnbk1lc3NhZ2UoQ09ORklSTV9DTElFTlQsIENPTkZJUk1fQUREUkVTUywgb3VyRGF0YS5uYW1lKTtcbiAgICBjb25zdCBxdWVyeSA9IFwibmFtZV9pZD1cIitlbmNvZGVVUklDb21wb25lbnQob3VyRGF0YS5uYW1lKStcIiZzaWduYXR1cmU9XCIrZW5jb2RlVVJJQ29tcG9uZW50KHNpZ25hdHVyZSk7XG4gICAgbG9nQ29uZmlybSgnY2FsbGluZyBmb3IgZG9pLWVtYWlsLXRlbXBsYXRlOicrdXJsKycgcXVlcnk6JywgcXVlcnkpO1xuXG4gICAgLyoqXG4gICAgICBUT0RPIHdoZW4gcnVubmluZyBTZW5kLWRBcHAgaW4gVGVzdG5ldCBiZWhpbmQgTkFUIHRoaXMgVVJMIHdpbGwgbm90IGJlIGFjY2Vzc2libGUgZnJvbSB0aGUgaW50ZXJuZXRcbiAgICAgIGJ1dCBldmVuIHdoZW4gd2UgdXNlIHRoZSBVUkwgZnJvbSBsb2NhbGhvc3QgdmVyaWZ5IGFuZG4gb3RoZXJzIHdpbGwgZmFpbHMuXG4gICAgICovXG4gICAgY29uc3QgcmVzcG9uc2UgPSBnZXRIdHRwR0VUKHVybCwgcXVlcnkpO1xuICAgIGlmKHJlc3BvbnNlID09PSB1bmRlZmluZWQgfHwgcmVzcG9uc2UuZGF0YSA9PT0gdW5kZWZpbmVkKSB0aHJvdyBcIkJhZCByZXNwb25zZVwiO1xuICAgIGNvbnN0IHJlc3BvbnNlRGF0YSA9IHJlc3BvbnNlLmRhdGE7XG4gICAgbG9nQ29uZmlybSgncmVzcG9uc2Ugd2hpbGUgZ2V0dGluZyBnZXR0aW5nIGVtYWlsIHRlbXBsYXRlIGZyb20gVVJMOicscmVzcG9uc2UuZGF0YS5zdGF0dXMpO1xuXG4gICAgaWYocmVzcG9uc2VEYXRhLnN0YXR1cyAhPT0gXCJzdWNjZXNzXCIpIHtcbiAgICAgIGlmKHJlc3BvbnNlRGF0YS5lcnJvciA9PT0gdW5kZWZpbmVkKSB0aHJvdyBcIkJhZCByZXNwb25zZVwiO1xuICAgICAgaWYocmVzcG9uc2VEYXRhLmVycm9yLmluY2x1ZGVzKFwiT3B0LUluIG5vdCBmb3VuZFwiKSkge1xuICAgICAgICAvL0RvIG5vdGhpbmcgYW5kIGRvbid0IHRocm93IGVycm9yIHNvIGpvYiBpcyBkb25lXG4gICAgICAgICAgbG9nRXJyb3IoJ3Jlc3BvbnNlIGRhdGEgZnJvbSBTZW5kLWRBcHA6JyxyZXNwb25zZURhdGEuZXJyb3IpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB0aHJvdyByZXNwb25zZURhdGEuZXJyb3I7XG4gICAgfVxuICAgIGxvZ0NvbmZpcm0oJ0RPSSBNYWlsIGRhdGEgZmV0Y2hlZC4nKTtcblxuICAgIGNvbnN0IG9wdEluSWQgPSBhZGRPcHRJbih7bmFtZTogb3VyRGF0YS5uYW1lfSk7XG4gICAgY29uc3Qgb3B0SW4gPSBPcHRJbnMuZmluZE9uZSh7X2lkOiBvcHRJbklkfSk7XG4gICAgbG9nQ29uZmlybSgnb3B0LWluIGZvdW5kOicsb3B0SW4pO1xuICAgIGlmKG9wdEluLmNvbmZpcm1hdGlvblRva2VuICE9PSB1bmRlZmluZWQpIHJldHVybjtcblxuICAgIGNvbnN0IHRva2VuID0gZ2VuZXJhdGVEb2lUb2tlbih7aWQ6IG9wdEluLl9pZH0pO1xuICAgIGxvZ0NvbmZpcm0oJ2dlbmVyYXRlZCBjb25maXJtYXRpb25Ub2tlbjonLHRva2VuKTtcbiAgICBjb25zdCBjb25maXJtYXRpb25IYXNoID0gZ2VuZXJhdGVEb2lIYXNoKHtpZDogb3B0SW4uX2lkLCB0b2tlbjogdG9rZW4sIHJlZGlyZWN0OiByZXNwb25zZURhdGEuZGF0YS5yZWRpcmVjdH0pO1xuICAgIGxvZ0NvbmZpcm0oJ2dlbmVyYXRlZCBjb25maXJtYXRpb25IYXNoOicsY29uZmlybWF0aW9uSGFzaCk7XG4gICAgY29uc3QgY29uZmlybWF0aW9uVXJsID0gZ2V0VXJsKCkrQVBJX1BBVEgrVkVSU0lPTitcIi9cIitET0lfQ09ORklSTUFUSU9OX1JPVVRFK1wiL1wiK2VuY29kZVVSSUNvbXBvbmVudChjb25maXJtYXRpb25IYXNoKTtcbiAgICBsb2dDb25maXJtKCdjb25maXJtYXRpb25Vcmw6Jytjb25maXJtYXRpb25VcmwpO1xuXG4gICAgY29uc3QgdGVtcGxhdGUgPSBwYXJzZVRlbXBsYXRlKHt0ZW1wbGF0ZTogcmVzcG9uc2VEYXRhLmRhdGEuY29udGVudCwgZGF0YToge1xuICAgICAgY29uZmlybWF0aW9uX3VybDogY29uZmlybWF0aW9uVXJsXG4gICAgfX0pO1xuXG4gICAgLy9sb2dDb25maXJtKCd3ZSBhcmUgdXNpbmcgdGhpcyB0ZW1wbGF0ZTonLHRlbXBsYXRlKTtcblxuICAgIGxvZ0NvbmZpcm0oJ3NlbmRpbmcgZW1haWwgdG8gcGV0ZXIgZm9yIGNvbmZpcm1hdGlvbiBvdmVyIGJvYnMgZEFwcCcpO1xuICAgIGFkZFNlbmRNYWlsSm9iKHtcbiAgICAgIHRvOiByZXNwb25zZURhdGEuZGF0YS5yZWNpcGllbnQsXG4gICAgICBzdWJqZWN0OiByZXNwb25zZURhdGEuZGF0YS5zdWJqZWN0LFxuICAgICAgbWVzc2FnZTogdGVtcGxhdGUsXG4gICAgICByZXR1cm5QYXRoOiByZXNwb25zZURhdGEuZGF0YS5yZXR1cm5QYXRoXG4gICAgfSk7XG4gIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2RhcHBzLmZldGNoRG9pTWFpbERhdGEuZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgZmV0Y2hEb2lNYWlsRGF0YTtcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tICdzaW1wbC1zY2hlbWEnO1xuaW1wb3J0IHsgT3B0SW5zIH0gZnJvbSAnLi4vLi4vLi4vYXBpL29wdC1pbnMvb3B0LWlucy5qcyc7XG5pbXBvcnQgeyBSZWNpcGllbnRzIH0gZnJvbSAnLi4vLi4vLi4vYXBpL3JlY2lwaWVudHMvcmVjaXBpZW50cy5qcyc7XG5pbXBvcnQgZ2V0T3B0SW5Qcm92aWRlciBmcm9tICcuLi9kbnMvZ2V0X29wdC1pbi1wcm92aWRlci5qcyc7XG5pbXBvcnQgZ2V0T3B0SW5LZXkgZnJvbSAnLi4vZG5zL2dldF9vcHQtaW4ta2V5LmpzJztcbmltcG9ydCB2ZXJpZnlTaWduYXR1cmUgZnJvbSAnLi4vZG9pY2hhaW4vdmVyaWZ5X3NpZ25hdHVyZS5qcyc7XG5pbXBvcnQgeyBnZXRIdHRwR0VUIH0gZnJvbSAnLi4vLi4vLi4vLi4vc2VydmVyL2FwaS9odHRwLmpzJztcbmltcG9ydCB7IERPSV9NQUlMX0ZFVENIX1VSTCB9IGZyb20gJy4uLy4uLy4uL3N0YXJ0dXAvc2VydmVyL2VtYWlsLWNvbmZpZ3VyYXRpb24uanMnO1xuaW1wb3J0IHsgbG9nU2VuZCB9IGZyb20gXCIuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9sb2ctY29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgQWNjb3VudHMgfSBmcm9tICdtZXRlb3IvYWNjb3VudHMtYmFzZSdcblxuY29uc3QgR2V0RG9pTWFpbERhdGFTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgbmFtZV9pZDoge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9LFxuICBzaWduYXR1cmU6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfVxufSk7XG5cbmNvbnN0IHVzZXJQcm9maWxlU2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIHN1YmplY3Q6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgb3B0aW9uYWw6dHJ1ZVxuICB9LFxuICByZWRpcmVjdDoge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICByZWdFeDogXCJAKGh0dHBzP3xmdHApOi8vKC1cXFxcLik/KFteXFxcXHMvP1xcXFwuIy1dK1xcXFwuPykrKC9bXlxcXFxzXSopPyRAXCIsXG4gICAgb3B0aW9uYWw6dHJ1ZVxuICB9LFxuICByZXR1cm5QYXRoOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIHJlZ0V4OiBTaW1wbGVTY2hlbWEuUmVnRXguRW1haWwsXG4gICAgb3B0aW9uYWw6dHJ1ZVxuICB9LFxuICB0ZW1wbGF0ZVVSTDoge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICByZWdFeDogXCJAKGh0dHBzP3xmdHApOi8vKC1cXFxcLik/KFteXFxcXHMvP1xcXFwuIy1dK1xcXFwuPykrKC9bXlxcXFxzXSopPyRAXCIsXG4gICAgb3B0aW9uYWw6dHJ1ZVxuICB9XG59KTtcblxuY29uc3QgZ2V0RG9pTWFpbERhdGEgPSAoZGF0YSkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IG91ckRhdGEgPSBkYXRhO1xuICAgIEdldERvaU1haWxEYXRhU2NoZW1hLnZhbGlkYXRlKG91ckRhdGEpO1xuICAgIGNvbnN0IG9wdEluID0gT3B0SW5zLmZpbmRPbmUoe25hbWVJZDogb3VyRGF0YS5uYW1lX2lkfSk7XG4gICAgaWYob3B0SW4gPT09IHVuZGVmaW5lZCkgdGhyb3cgXCJPcHQtSW4gd2l0aCBuYW1lX2lkOiBcIitvdXJEYXRhLm5hbWVfaWQrXCIgbm90IGZvdW5kXCI7XG4gICAgbG9nU2VuZCgnT3B0LUluIGZvdW5kJyxvcHRJbik7XG5cbiAgICBjb25zdCByZWNpcGllbnQgPSBSZWNpcGllbnRzLmZpbmRPbmUoe19pZDogb3B0SW4ucmVjaXBpZW50fSk7XG4gICAgaWYocmVjaXBpZW50ID09PSB1bmRlZmluZWQpIHRocm93IFwiUmVjaXBpZW50IG5vdCBmb3VuZFwiO1xuICAgIGxvZ1NlbmQoJ1JlY2lwaWVudCBmb3VuZCcsIHJlY2lwaWVudCk7XG5cbiAgICBjb25zdCBwYXJ0cyA9IHJlY2lwaWVudC5lbWFpbC5zcGxpdChcIkBcIik7XG4gICAgY29uc3QgZG9tYWluID0gcGFydHNbcGFydHMubGVuZ3RoLTFdO1xuXG4gICAgbGV0IHB1YmxpY0tleSA9IGdldE9wdEluS2V5KHsgZG9tYWluOiBkb21haW59KTtcblxuICAgIGlmKCFwdWJsaWNLZXkpe1xuICAgICAgY29uc3QgcHJvdmlkZXIgPSBnZXRPcHRJblByb3ZpZGVyKHtkb21haW46IG91ckRhdGEuZG9tYWluIH0pO1xuICAgICAgbG9nU2VuZChcInVzaW5nIGRvaWNoYWluIHByb3ZpZGVyIGluc3RlYWQgb2YgZGlyZWN0bHkgY29uZmlndXJlZCBwdWJsaWNLZXk6XCIsIHsgcHJvdmlkZXI6IHByb3ZpZGVyIH0pO1xuICAgICAgcHVibGljS2V5ID0gZ2V0T3B0SW5LZXkoeyBkb21haW46IHByb3ZpZGVyfSk7IC8vZ2V0IHB1YmxpYyBrZXkgZnJvbSBwcm92aWRlciBvciBmYWxsYmFjayBpZiBwdWJsaWNrZXkgd2FzIG5vdCBzZXQgaW4gZG5zXG4gICAgfVxuXG4gICAgbG9nU2VuZCgncXVlcmllZCBkYXRhOiAocGFydHMsIGRvbWFpbiwgcHJvdmlkZXIsIHB1YmxpY0tleSknLCAnKCcrcGFydHMrJywnK2RvbWFpbisnLCcrcHVibGljS2V5KycpJyk7XG5cbiAgICAvL1RPRE86IE9ubHkgYWxsb3cgYWNjZXNzIG9uZSB0aW1lXG4gICAgLy8gUG9zc2libGUgc29sdXRpb246XG4gICAgLy8gMS4gUHJvdmlkZXIgKGNvbmZpcm0gZEFwcCkgcmVxdWVzdCB0aGUgZGF0YVxuICAgIC8vIDIuIFByb3ZpZGVyIHJlY2VpdmUgdGhlIGRhdGFcbiAgICAvLyAzLiBQcm92aWRlciBzZW5kcyBjb25maXJtYXRpb24gXCJJIGdvdCB0aGUgZGF0YVwiXG4gICAgLy8gNC4gU2VuZCBkQXBwIGxvY2sgdGhlIGRhdGEgZm9yIHRoaXMgb3B0IGluXG4gICAgbG9nU2VuZCgndmVyaWZ5aW5nIHNpZ25hdHVyZS4uLicpO1xuICAgIGlmKCF2ZXJpZnlTaWduYXR1cmUoe3B1YmxpY0tleTogcHVibGljS2V5LCBkYXRhOiBvdXJEYXRhLm5hbWVfaWQsIHNpZ25hdHVyZTogb3VyRGF0YS5zaWduYXR1cmV9KSkge1xuICAgICAgdGhyb3cgXCJzaWduYXR1cmUgaW5jb3JyZWN0IC0gYWNjZXNzIGRlbmllZFwiO1xuICAgIH1cbiAgICBcbiAgICBsb2dTZW5kKCdzaWduYXR1cmUgdmVyaWZpZWQnKTtcblxuICAgIC8vVE9ETzogUXVlcnkgZm9yIGxhbmd1YWdlXG4gICAgbGV0IGRvaU1haWxEYXRhO1xuICAgIHRyeSB7XG5cbiAgICAgIGRvaU1haWxEYXRhID0gZ2V0SHR0cEdFVChET0lfTUFJTF9GRVRDSF9VUkwsIFwiXCIpLmRhdGE7XG4gICAgICBsZXQgZGVmYXVsdFJldHVybkRhdGEgPSB7XG4gICAgICAgIFwicmVjaXBpZW50XCI6IHJlY2lwaWVudC5lbWFpbCxcbiAgICAgICAgXCJjb250ZW50XCI6IGRvaU1haWxEYXRhLmRhdGEuY29udGVudCxcbiAgICAgICAgXCJyZWRpcmVjdFwiOiBkb2lNYWlsRGF0YS5kYXRhLnJlZGlyZWN0LFxuICAgICAgICBcInN1YmplY3RcIjogZG9pTWFpbERhdGEuZGF0YS5zdWJqZWN0LFxuICAgICAgICBcInJldHVyblBhdGhcIjogZG9pTWFpbERhdGEuZGF0YS5yZXR1cm5QYXRoXG4gICAgICB9XG5cbiAgICBsZXQgcmV0dXJuRGF0YSA9IGRlZmF1bHRSZXR1cm5EYXRhO1xuXG4gICAgdHJ5e1xuICAgICAgbGV0IG93bmVyID0gQWNjb3VudHMudXNlcnMuZmluZE9uZSh7X2lkOiBvcHRJbi5vd25lcklkfSk7XG4gICAgICBsZXQgbWFpbFRlbXBsYXRlID0gb3duZXIucHJvZmlsZS5tYWlsVGVtcGxhdGU7XG4gICAgICB1c2VyUHJvZmlsZVNjaGVtYS52YWxpZGF0ZShtYWlsVGVtcGxhdGUpO1xuXG4gICAgICByZXR1cm5EYXRhW1wicmVkaXJlY3RcIl0gPSBtYWlsVGVtcGxhdGVbXCJyZWRpcmVjdFwiXSB8fCBkZWZhdWx0UmV0dXJuRGF0YVtcInJlZGlyZWN0XCJdO1xuICAgICAgcmV0dXJuRGF0YVtcInN1YmplY3RcIl0gPSBtYWlsVGVtcGxhdGVbXCJzdWJqZWN0XCJdIHx8IGRlZmF1bHRSZXR1cm5EYXRhW1wic3ViamVjdFwiXTtcbiAgICAgIHJldHVybkRhdGFbXCJyZXR1cm5QYXRoXCJdID0gbWFpbFRlbXBsYXRlW1wicmV0dXJuUGF0aFwiXSB8fCBkZWZhdWx0UmV0dXJuRGF0YVtcInJldHVyblBhdGhcIl07XG4gICAgICByZXR1cm5EYXRhW1wiY29udGVudFwiXSA9IG1haWxUZW1wbGF0ZVtcInRlbXBsYXRlVVJMXCJdID8gKGdldEh0dHBHRVQobWFpbFRlbXBsYXRlW1widGVtcGxhdGVVUkxcIl0sIFwiXCIpLmNvbnRlbnQgfHwgZGVmYXVsdFJldHVybkRhdGFbXCJjb250ZW50XCJdKSA6IGRlZmF1bHRSZXR1cm5EYXRhW1wiY29udGVudFwiXTtcbiAgICAgIFxuICAgIH1cbiAgICBjYXRjaChlcnJvcikge1xuICAgICAgcmV0dXJuRGF0YT1kZWZhdWx0UmV0dXJuRGF0YTtcbiAgICB9XG5cbiAgICAgIGxvZ1NlbmQoJ2RvaU1haWxEYXRhIGFuZCB1cmw6JywgRE9JX01BSUxfRkVUQ0hfVVJMLCByZXR1cm5EYXRhKTtcblxuICAgICAgcmV0dXJuIHJldHVybkRhdGFcblxuICAgIH0gY2F0Y2goZXJyb3IpIHtcbiAgICAgIHRocm93IFwiRXJyb3Igd2hpbGUgZmV0Y2hpbmcgbWFpbCBjb250ZW50OiBcIitlcnJvcjtcbiAgICB9XG5cbiAgfSBjYXRjaChleGNlcHRpb24pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdkYXBwcy5nZXREb2lNYWlsRGF0YS5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBnZXREb2lNYWlsRGF0YTtcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tICdzaW1wbC1zY2hlbWEnO1xuaW1wb3J0IHsgcmVzb2x2ZVR4dCB9IGZyb20gJy4uLy4uLy4uLy4uL3NlcnZlci9hcGkvZG5zLmpzJztcbmltcG9ydCB7IEZBTExCQUNLX1BST1ZJREVSIH0gZnJvbSAnLi4vLi4vLi4vc3RhcnR1cC9zZXJ2ZXIvZG5zLWNvbmZpZ3VyYXRpb24uanMnO1xuaW1wb3J0IHtpc1JlZ3Rlc3QsIGlzVGVzdG5ldH0gZnJvbSBcIi4uLy4uLy4uL3N0YXJ0dXAvc2VydmVyL2RhcHAtY29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHtsb2dTZW5kfSBmcm9tIFwiLi4vLi4vLi4vc3RhcnR1cC9zZXJ2ZXIvbG9nLWNvbmZpZ3VyYXRpb25cIjtcblxuY29uc3QgT1BUX0lOX0tFWSA9IFwiZG9pY2hhaW4tb3B0LWluLWtleVwiO1xuY29uc3QgT1BUX0lOX0tFWV9URVNUTkVUID0gXCJkb2ljaGFpbi10ZXN0bmV0LW9wdC1pbi1rZXlcIjtcblxuY29uc3QgR2V0T3B0SW5LZXlTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgZG9tYWluOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH1cbn0pO1xuXG5cbmNvbnN0IGdldE9wdEluS2V5ID0gKGRhdGEpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBvdXJEYXRhID0gZGF0YTtcbiAgICBHZXRPcHRJbktleVNjaGVtYS52YWxpZGF0ZShvdXJEYXRhKTtcblxuICAgIGxldCBvdXJPUFRfSU5fS0VZPU9QVF9JTl9LRVk7XG5cbiAgICBpZihpc1JlZ3Rlc3QoKSB8fCBpc1Rlc3RuZXQoKSl7XG4gICAgICAgIG91ck9QVF9JTl9LRVkgPSBPUFRfSU5fS0VZX1RFU1RORVQ7XG4gICAgICAgIGxvZ1NlbmQoJ1VzaW5nIFJlZ1Rlc3Q6Jytpc1JlZ3Rlc3QoKStcIiBUZXN0bmV0OiBcIitpc1Rlc3RuZXQoKStcIiBvdXJPUFRfSU5fS0VZXCIsb3VyT1BUX0lOX0tFWSk7XG4gICAgfVxuICAgIGNvbnN0IGtleSA9IHJlc29sdmVUeHQob3VyT1BUX0lOX0tFWSwgb3VyRGF0YS5kb21haW4pO1xuICAgIGxvZ1NlbmQoJ0ROUyBUWFQgY29uZmlndXJlZCBwdWJsaWMga2V5IG9mIHJlY2lwaWVudCBlbWFpbCBkb21haW4gYW5kIGNvbmZpcm1hdGlvbiBkYXBwJyx7Zm91bmRLZXk6a2V5LCBkb21haW46b3VyRGF0YS5kb21haW4sIGRuc2tleTpvdXJPUFRfSU5fS0VZfSk7XG5cbiAgICBpZihrZXkgPT09IHVuZGVmaW5lZCkgcmV0dXJuIHVzZUZhbGxiYWNrKG91ckRhdGEuZG9tYWluKTtcbiAgICByZXR1cm4ga2V5O1xuICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdkbnMuZ2V0T3B0SW5LZXkuZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgfVxufTtcblxuY29uc3QgdXNlRmFsbGJhY2sgPSAoZG9tYWluKSA9PiB7XG4gIGlmKGRvbWFpbiA9PT0gRkFMTEJBQ0tfUFJPVklERVIpIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoXCJGYWxsYmFjayBoYXMgbm8ga2V5IGRlZmluZWQhXCIpO1xuICAgIGxvZ1NlbmQoXCJLZXkgbm90IGRlZmluZWQuIFVzaW5nIGZhbGxiYWNrOiBcIixGQUxMQkFDS19QUk9WSURFUik7XG4gIHJldHVybiBnZXRPcHRJbktleSh7ZG9tYWluOiBGQUxMQkFDS19QUk9WSURFUn0pO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgZ2V0T3B0SW5LZXk7XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcbmltcG9ydCB7IHJlc29sdmVUeHQgfSBmcm9tICcuLi8uLi8uLi8uLi9zZXJ2ZXIvYXBpL2Rucy5qcyc7XG5pbXBvcnQgeyBGQUxMQkFDS19QUk9WSURFUiB9IGZyb20gJy4uLy4uLy4uL3N0YXJ0dXAvc2VydmVyL2Rucy1jb25maWd1cmF0aW9uLmpzJztcbmltcG9ydCB7bG9nU2VuZH0gZnJvbSBcIi4uLy4uLy4uL3N0YXJ0dXAvc2VydmVyL2xvZy1jb25maWd1cmF0aW9uXCI7XG5pbXBvcnQge2lzUmVndGVzdCwgaXNUZXN0bmV0fSBmcm9tIFwiLi4vLi4vLi4vc3RhcnR1cC9zZXJ2ZXIvZGFwcC1jb25maWd1cmF0aW9uXCI7XG5cbmNvbnN0IFBST1ZJREVSX0tFWSA9IFwiZG9pY2hhaW4tb3B0LWluLXByb3ZpZGVyXCI7XG5jb25zdCBQUk9WSURFUl9LRVlfVEVTVE5FVCA9IFwiZG9pY2hhaW4tdGVzdG5ldC1vcHQtaW4tcHJvdmlkZXJcIjtcblxuY29uc3QgR2V0T3B0SW5Qcm92aWRlclNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICBkb21haW46IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfVxufSk7XG5cblxuY29uc3QgZ2V0T3B0SW5Qcm92aWRlciA9IChkYXRhKSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3Qgb3VyRGF0YSA9IGRhdGE7XG4gICAgR2V0T3B0SW5Qcm92aWRlclNjaGVtYS52YWxpZGF0ZShvdXJEYXRhKTtcblxuICAgIGxldCBvdXJQUk9WSURFUl9LRVk9UFJPVklERVJfS0VZO1xuICAgIGlmKGlzUmVndGVzdCgpIHx8IGlzVGVzdG5ldCgpKXtcbiAgICAgICAgb3VyUFJPVklERVJfS0VZID0gUFJPVklERVJfS0VZX1RFU1RORVQ7XG4gICAgICAgIGxvZ1NlbmQoJ1VzaW5nIFJlZ1Rlc3Q6Jytpc1JlZ3Rlc3QoKStcIiA6IFRlc3RuZXQ6XCIraXNUZXN0bmV0KCkrXCIgUFJPVklERVJfS0VZXCIse3Byb3ZpZGVyS2V5Om91clBST1ZJREVSX0tFWSwgZG9tYWluOm91ckRhdGEuZG9tYWlufSk7XG4gICAgfVxuXG4gICAgY29uc3QgcHJvdmlkZXIgPSByZXNvbHZlVHh0KG91clBST1ZJREVSX0tFWSwgb3VyRGF0YS5kb21haW4pO1xuICAgIGlmKHByb3ZpZGVyID09PSB1bmRlZmluZWQpIHJldHVybiB1c2VGYWxsYmFjaygpO1xuXG4gICAgbG9nU2VuZCgnb3B0LWluLXByb3ZpZGVyIGZyb20gZG5zIC0gc2VydmVyIG9mIG1haWwgcmVjaXBpZW50OiAoVFhUKTonLHByb3ZpZGVyKTtcbiAgICByZXR1cm4gcHJvdmlkZXI7XG4gIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2Rucy5nZXRPcHRJblByb3ZpZGVyLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH1cbn07XG5cbmNvbnN0IHVzZUZhbGxiYWNrID0gKCkgPT4ge1xuICBsb2dTZW5kKCdQcm92aWRlciBub3QgZGVmaW5lZC4gRmFsbGJhY2sgJytGQUxMQkFDS19QUk9WSURFUisnIGlzIHVzZWQnKTtcbiAgcmV0dXJuIEZBTExCQUNLX1BST1ZJREVSO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgZ2V0T3B0SW5Qcm92aWRlcjtcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tICdzaW1wbC1zY2hlbWEnO1xuaW1wb3J0IHsgQ09ORklSTV9DTElFTlQsIENPTkZJUk1fQUREUkVTUyB9IGZyb20gJy4uLy4uLy4uL3N0YXJ0dXAvc2VydmVyL2RvaWNoYWluLWNvbmZpZ3VyYXRpb24uanMnO1xuaW1wb3J0IHsgZ2V0V2lmIH0gZnJvbSAnLi4vLi4vLi4vLi4vc2VydmVyL2FwaS9kb2ljaGFpbi5qcyc7XG5pbXBvcnQgeyBEb2ljaGFpbkVudHJpZXMgfSBmcm9tICcuLi8uLi8uLi9hcGkvZG9pY2hhaW4vZW50cmllcy5qcyc7XG5pbXBvcnQgYWRkRmV0Y2hEb2lNYWlsRGF0YUpvYiBmcm9tICcuLi9qb2JzL2FkZF9mZXRjaC1kb2ktbWFpbC1kYXRhLmpzJztcbmltcG9ydCBnZXRQcml2YXRlS2V5RnJvbVdpZiBmcm9tICcuL2dldF9wcml2YXRlLWtleV9mcm9tX3dpZi5qcyc7XG5pbXBvcnQgZGVjcnlwdE1lc3NhZ2UgZnJvbSAnLi9kZWNyeXB0X21lc3NhZ2UuanMnO1xuaW1wb3J0IHtsb2dDb25maXJtLCBsb2dTZW5kfSBmcm9tIFwiLi4vLi4vLi4vc3RhcnR1cC9zZXJ2ZXIvbG9nLWNvbmZpZ3VyYXRpb25cIjtcblxuY29uc3QgQWRkRG9pY2hhaW5FbnRyeVNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICBuYW1lOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH0sXG4gIHZhbHVlOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH0sXG4gIGFkZHJlc3M6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfSxcbiAgdHhJZDoge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9XG59KTtcblxuLyoqXG4gKiBJbnNlcnRzXG4gKlxuICogQHBhcmFtIGVudHJ5XG4gKiBAcmV0dXJucyB7Kn1cbiAqL1xuY29uc3QgYWRkRG9pY2hhaW5FbnRyeSA9IChlbnRyeSkgPT4ge1xuICB0cnkge1xuXG4gICAgY29uc3Qgb3VyRW50cnkgPSBlbnRyeTtcbiAgICBsb2dDb25maXJtKCdhZGRpbmcgRG9pY2hhaW5FbnRyeSBvbiBCb2IuLi4nLG91ckVudHJ5Lm5hbWUpO1xuICAgIEFkZERvaWNoYWluRW50cnlTY2hlbWEudmFsaWRhdGUob3VyRW50cnkpO1xuXG4gICAgY29uc3QgZXR5ID0gRG9pY2hhaW5FbnRyaWVzLmZpbmRPbmUoe25hbWU6IG91ckVudHJ5Lm5hbWV9KTtcbiAgICBpZihldHkgIT09IHVuZGVmaW5lZCl7XG4gICAgICAgIGxvZ1NlbmQoJ3JldHVybmluZyBsb2NhbGx5IHNhdmVkIGVudHJ5IHdpdGggX2lkOicrZXR5Ll9pZCk7XG4gICAgICAgIHJldHVybiBldHkuX2lkO1xuICAgIH1cblxuICAgIGNvbnN0IHZhbHVlID0gSlNPTi5wYXJzZShvdXJFbnRyeS52YWx1ZSk7XG4gICAgLy9sb2dTZW5kKFwidmFsdWU6XCIsdmFsdWUpO1xuICAgIGlmKHZhbHVlLmZyb20gPT09IHVuZGVmaW5lZCkgdGhyb3cgXCJXcm9uZyBibG9ja2NoYWluIGVudHJ5XCI7IC8vVE9ETyBpZiBmcm9tIGlzIG1pc3NpbmcgYnV0IHZhbHVlIGlzIHRoZXJlLCBpdCBpcyBwcm9iYWJseSBhbGxyZWFkeSBoYW5kZWxlZCBjb3JyZWN0bHkgYW55d2F5cyB0aGlzIGlzIG5vdCBzbyBjb29sIGFzIGl0IHNlZW1zLlxuICAgIGNvbnN0IHdpZiA9IGdldFdpZihDT05GSVJNX0NMSUVOVCwgQ09ORklSTV9BRERSRVNTKTtcbiAgICBjb25zdCBwcml2YXRlS2V5ID0gZ2V0UHJpdmF0ZUtleUZyb21XaWYoe3dpZjogd2lmfSk7XG4gICAgbG9nU2VuZCgnZ290IHByaXZhdGUga2V5ICh3aWxsIG5vdCBzaG93IGl0IGhlcmUpJyk7XG5cbiAgICBjb25zdCBkb21haW4gPSBkZWNyeXB0TWVzc2FnZSh7cHJpdmF0ZUtleTogcHJpdmF0ZUtleSwgbWVzc2FnZTogdmFsdWUuZnJvbX0pO1xuICAgIGxvZ1NlbmQoJ2RlY3J5cHRlZCBtZXNzYWdlIGZyb20gZG9tYWluOiAnLGRvbWFpbik7XG5cbiAgICBjb25zdCBuYW1lUG9zID0gb3VyRW50cnkubmFtZS5pbmRleE9mKCctJyk7IC8vaWYgdGhpcyBpcyBub3QgYSBjby1yZWdpc3RyYXRpb24gZmV0Y2ggbWFpbC5cbiAgICBsb2dTZW5kKCduYW1lUG9zOicsbmFtZVBvcyk7XG4gICAgY29uc3QgbWFzdGVyRG9pID0gKG5hbWVQb3MhPS0xKT9vdXJFbnRyeS5uYW1lLnN1YnN0cmluZygwLG5hbWVQb3MpOnVuZGVmaW5lZDtcbiAgICBsb2dTZW5kKCdtYXN0ZXJEb2k6JyxtYXN0ZXJEb2kpO1xuICAgIGNvbnN0IGluZGV4ID0gbWFzdGVyRG9pP291ckVudHJ5Lm5hbWUuc3Vic3RyaW5nKG5hbWVQb3MrMSk6dW5kZWZpbmVkO1xuICAgIGxvZ1NlbmQoJ2luZGV4OicsaW5kZXgpO1xuXG4gICAgY29uc3QgaWQgPSBEb2ljaGFpbkVudHJpZXMuaW5zZXJ0KHtcbiAgICAgICAgbmFtZTogb3VyRW50cnkubmFtZSxcbiAgICAgICAgdmFsdWU6IG91ckVudHJ5LnZhbHVlLFxuICAgICAgICBhZGRyZXNzOiBvdXJFbnRyeS5hZGRyZXNzLFxuICAgICAgICBtYXN0ZXJEb2k6IG1hc3RlckRvaSxcbiAgICAgICAgaW5kZXg6IGluZGV4LFxuICAgICAgICB0eElkOiBvdXJFbnRyeS50eElkLFxuICAgICAgICBleHBpcmVzSW46IG91ckVudHJ5LmV4cGlyZXNJbixcbiAgICAgICAgZXhwaXJlZDogb3VyRW50cnkuZXhwaXJlZFxuICAgIH0pO1xuXG4gICAgbG9nU2VuZCgnRG9pY2hhaW5FbnRyeSBhZGRlZCBvbiBCb2I6Jywge2lkOmlkLG5hbWU6b3VyRW50cnkubmFtZSxtYXN0ZXJEb2k6bWFzdGVyRG9pLGluZGV4OmluZGV4fSk7XG5cbiAgICBpZighbWFzdGVyRG9pKXtcbiAgICAgICAgYWRkRmV0Y2hEb2lNYWlsRGF0YUpvYih7XG4gICAgICAgICAgICBuYW1lOiBvdXJFbnRyeS5uYW1lLFxuICAgICAgICAgICAgZG9tYWluOiBkb21haW5cbiAgICAgICAgfSk7XG4gICAgICAgIGxvZ1NlbmQoJ05ldyBlbnRyeSBhZGRlZDogXFxuJytcbiAgICAgICAgICAgICdOYW1lSWQ9JytvdXJFbnRyeS5uYW1lK1wiXFxuXCIrXG4gICAgICAgICAgICAnQWRkcmVzcz0nK291ckVudHJ5LmFkZHJlc3MrXCJcXG5cIitcbiAgICAgICAgICAgICdUeElkPScrb3VyRW50cnkudHhJZCtcIlxcblwiK1xuICAgICAgICAgICAgJ1ZhbHVlPScrb3VyRW50cnkudmFsdWUpO1xuXG4gICAgfWVsc2V7XG4gICAgICAgIGxvZ1NlbmQoJ1RoaXMgdHJhbnNhY3Rpb24gYmVsb25ncyB0byBjby1yZWdpc3RyYXRpb24nLCBtYXN0ZXJEb2kpO1xuICAgIH1cblxuICAgIHJldHVybiBpZDtcbiAgfSBjYXRjaCAoZXhjZXB0aW9uKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZG9pY2hhaW4uYWRkRW50cnlBbmRGZXRjaERhdGEuZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgYWRkRG9pY2hhaW5FbnRyeTtcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IHsgbGlzdFNpbmNlQmxvY2ssIG5hbWVTaG93LCBnZXRSYXdUcmFuc2FjdGlvbn0gZnJvbSAnLi4vLi4vLi4vLi4vc2VydmVyL2FwaS9kb2ljaGFpbi5qcyc7XG5pbXBvcnQgeyBDT05GSVJNX0NMSUVOVCwgQ09ORklSTV9BRERSRVNTIH0gZnJvbSAnLi4vLi4vLi4vc3RhcnR1cC9zZXJ2ZXIvZG9pY2hhaW4tY29uZmlndXJhdGlvbi5qcyc7XG5pbXBvcnQgYWRkRG9pY2hhaW5FbnRyeSBmcm9tICcuL2FkZF9lbnRyeV9hbmRfZmV0Y2hfZGF0YS5qcydcbmltcG9ydCB7IE1ldGEgfSBmcm9tICcuLi8uLi8uLi9hcGkvbWV0YS9tZXRhLmpzJztcbmltcG9ydCBhZGRPclVwZGF0ZU1ldGEgZnJvbSAnLi4vbWV0YS9hZGRPclVwZGF0ZS5qcyc7XG5pbXBvcnQge2xvZ0NvbmZpcm19IGZyb20gXCIuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9sb2ctY29uZmlndXJhdGlvblwiO1xuXG5jb25zdCBUWF9OQU1FX1NUQVJUID0gXCJlL1wiO1xuY29uc3QgTEFTVF9DSEVDS0VEX0JMT0NLX0tFWSA9IFwibGFzdENoZWNrZWRCbG9ja1wiO1xuXG5jb25zdCBjaGVja05ld1RyYW5zYWN0aW9uID0gKHR4aWQsIGpvYikgPT4ge1xuICB0cnkge1xuXG4gICAgICBpZighdHhpZCl7XG4gICAgICAgICAgbG9nQ29uZmlybShcImNoZWNrTmV3VHJhbnNhY3Rpb24gdHJpZ2dlcmVkIHdoZW4gc3RhcnRpbmcgbm9kZSAtIGNoZWNraW5nIGFsbCBjb25maXJtZWQgYmxvY2tzIHNpbmNlIGxhc3QgY2hlY2sgZm9yIGRvaWNoYWluIGFkZHJlc3NcIixDT05GSVJNX0FERFJFU1MpO1xuXG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgdmFyIGxhc3RDaGVja2VkQmxvY2sgPSBNZXRhLmZpbmRPbmUoe2tleTogTEFTVF9DSEVDS0VEX0JMT0NLX0tFWX0pO1xuICAgICAgICAgICAgICBpZihsYXN0Q2hlY2tlZEJsb2NrICE9PSB1bmRlZmluZWQpIGxhc3RDaGVja2VkQmxvY2sgPSBsYXN0Q2hlY2tlZEJsb2NrLnZhbHVlO1xuICAgICAgICAgICAgICBsb2dDb25maXJtKFwibGFzdENoZWNrZWRCbG9ja1wiLGxhc3RDaGVja2VkQmxvY2spO1xuICAgICAgICAgICAgICBjb25zdCByZXQgPSBsaXN0U2luY2VCbG9jayhDT05GSVJNX0NMSUVOVCwgbGFzdENoZWNrZWRCbG9jayk7XG4gICAgICAgICAgICAgIGlmKHJldCA9PT0gdW5kZWZpbmVkIHx8IHJldC50cmFuc2FjdGlvbnMgPT09IHVuZGVmaW5lZCkgcmV0dXJuO1xuXG4gICAgICAgICAgICAgIGNvbnN0IHR4cyA9IHJldC50cmFuc2FjdGlvbnM7XG4gICAgICAgICAgICAgIGxhc3RDaGVja2VkQmxvY2sgPSByZXQubGFzdGJsb2NrO1xuICAgICAgICAgICAgICBpZighcmV0IHx8ICF0eHMgfHwgIXR4cy5sZW5ndGg9PT0wKXtcbiAgICAgICAgICAgICAgICAgIGxvZ0NvbmZpcm0oXCJ0cmFuc2FjdGlvbnMgZG8gbm90IGNvbnRhaW4gbmFtZU9wIHRyYW5zYWN0aW9uIGRldGFpbHMgb3IgdHJhbnNhY3Rpb24gbm90IGZvdW5kLlwiLCBsYXN0Q2hlY2tlZEJsb2NrKTtcbiAgICAgICAgICAgICAgICAgIGFkZE9yVXBkYXRlTWV0YSh7a2V5OiBMQVNUX0NIRUNLRURfQkxPQ0tfS0VZLCB2YWx1ZTogbGFzdENoZWNrZWRCbG9ja30pO1xuICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgbG9nQ29uZmlybShcImxpc3RTaW5jZUJsb2NrXCIscmV0KTtcblxuICAgICAgICAgICAgICBjb25zdCBhZGRyZXNzVHhzID0gdHhzLmZpbHRlcih0eCA9PlxuICAgICAgICAgICAgICAgICAgdHguYWRkcmVzcyA9PT0gQ09ORklSTV9BRERSRVNTXG4gICAgICAgICAgICAgICAgICAmJiB0eC5uYW1lICE9PSB1bmRlZmluZWQgLy9zaW5jZSBuYW1lX3Nob3cgY2Fubm90IGJlIHJlYWQgd2l0aG91dCBjb25maXJtYXRpb25zXG4gICAgICAgICAgICAgICAgICAmJiB0eC5uYW1lLnN0YXJ0c1dpdGgoXCJkb2k6IFwiK1RYX05BTUVfU1RBUlQpICAvL2hlcmUgJ2RvaTogZS94eHh4JyBpcyBhbHJlYWR5IHdyaXR0ZW4gaW4gdGhlIGJsb2NrXG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgIGFkZHJlc3NUeHMuZm9yRWFjaCh0eCA9PiB7XG4gICAgICAgICAgICAgICAgICBsb2dDb25maXJtKFwidHg6XCIsdHgpO1xuICAgICAgICAgICAgICAgICAgdmFyIHR4TmFtZSA9IHR4Lm5hbWUuc3Vic3RyaW5nKChcImRvaTogXCIrVFhfTkFNRV9TVEFSVCkubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICAgIGxvZ0NvbmZpcm0oXCJleGN1dGluZyBuYW1lX3Nob3cgaW4gb3JkZXIgdG8gZ2V0IHZhbHVlIG9mIG5hbWVJZDpcIiwgdHhOYW1lKTtcbiAgICAgICAgICAgICAgICAgIGNvbnN0IGV0eSA9IG5hbWVTaG93KENPTkZJUk1fQ0xJRU5ULCB0eE5hbWUpO1xuICAgICAgICAgICAgICAgICAgbG9nQ29uZmlybShcIm5hbWVTaG93OiB2YWx1ZVwiLGV0eSk7XG4gICAgICAgICAgICAgICAgICBpZighZXR5KXtcbiAgICAgICAgICAgICAgICAgICAgICBsb2dDb25maXJtKFwiY291bGRuJ3QgZmluZCBuYW1lIC0gb2J2aW91c2x5IG5vdCAoeWV0PyEpIGNvbmZpcm1lZCBpbiBibG9ja2NoYWluOlwiLCBldHkpO1xuICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIGFkZFR4KHR4TmFtZSwgZXR5LnZhbHVlLHR4LmFkZHJlc3MsdHgudHhpZCk7IC8vVE9ETyBldHkudmFsdWUuZnJvbSBpcyBtYXliZSBOT1QgZXhpc3RpbmcgYmVjYXVzZSBvZiB0aGlzIGl0cyAgKG1heWJlKSBvbnQgd29ya2luZy4uLlxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgYWRkT3JVcGRhdGVNZXRhKHtrZXk6IExBU1RfQ0hFQ0tFRF9CTE9DS19LRVksIHZhbHVlOiBsYXN0Q2hlY2tlZEJsb2NrfSk7XG4gICAgICAgICAgICAgIGxvZ0NvbmZpcm0oXCJUcmFuc2FjdGlvbnMgdXBkYXRlZCAtIGxhc3RDaGVja2VkQmxvY2s6XCIsbGFzdENoZWNrZWRCbG9jayk7XG4gICAgICAgICAgICAgIGpvYi5kb25lKCk7XG4gICAgICAgICAgfSBjYXRjaChleGNlcHRpb24pIHtcbiAgICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignbmFtZWNvaW4uY2hlY2tOZXdUcmFuc2FjdGlvbnMuZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgICAgICAgICB9XG5cbiAgICAgIH1lbHNle1xuICAgICAgICAgIGxvZ0NvbmZpcm0oXCJ0eGlkOiBcIit0eGlkK1wiIHdhcyB0cmlnZ2VyZWQgYnkgd2FsbGV0bm90aWZ5IGZvciBhZGRyZXNzOlwiLENPTkZJUk1fQUREUkVTUyk7XG5cbiAgICAgICAgICBjb25zdCByZXQgPSBnZXRSYXdUcmFuc2FjdGlvbihDT05GSVJNX0NMSUVOVCwgdHhpZCk7XG4gICAgICAgICAgY29uc3QgdHhzID0gcmV0LnZvdXQ7XG5cbiAgICAgICAgICBpZighcmV0IHx8ICF0eHMgfHwgIXR4cy5sZW5ndGg9PT0wKXtcbiAgICAgICAgICAgICAgbG9nQ29uZmlybShcInR4aWQgXCIrdHhpZCsnIGRvZXMgbm90IGNvbnRhaW4gdHJhbnNhY3Rpb24gZGV0YWlscyBvciB0cmFuc2FjdGlvbiBub3QgZm91bmQuJyk7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgIC8vIGxvZ0NvbmZpcm0oJ25vdyBjaGVja2luZyByYXcgdHJhbnNhY3Rpb25zIHdpdGggZmlsdGVyOicsdHhzKTtcblxuICAgICAgICAgIGNvbnN0IGFkZHJlc3NUeHMgPSB0eHMuZmlsdGVyKHR4ID0+XG4gICAgICAgICAgICAgIHR4LnNjcmlwdFB1YktleSAhPT0gdW5kZWZpbmVkXG4gICAgICAgICAgICAgICYmIHR4LnNjcmlwdFB1YktleS5uYW1lT3AgIT09IHVuZGVmaW5lZFxuICAgICAgICAgICAgICAmJiB0eC5zY3JpcHRQdWJLZXkubmFtZU9wLm9wID09PSBcIm5hbWVfZG9pXCJcbiAgICAgICAgICAgIC8vICAmJiB0eC5zY3JpcHRQdWJLZXkuYWRkcmVzc2VzWzBdID09PSBDT05GSVJNX0FERFJFU1MgLy9vbmx5IG93biB0cmFuc2FjdGlvbiBzaG91bGQgYXJyaXZlIGhlcmUuIC0gc28gY2hlY2sgb24gb3duIGFkZHJlc3MgdW5uZWNjZXNhcnlcbiAgICAgICAgICAgICAgJiYgdHguc2NyaXB0UHViS2V5Lm5hbWVPcC5uYW1lICE9PSB1bmRlZmluZWRcbiAgICAgICAgICAgICAgJiYgdHguc2NyaXB0UHViS2V5Lm5hbWVPcC5uYW1lLnN0YXJ0c1dpdGgoVFhfTkFNRV9TVEFSVClcbiAgICAgICAgICApO1xuXG4gICAgICAgICAgLy9sb2dDb25maXJtKFwiZm91bmQgbmFtZV9vcCB0cmFuc2FjdGlvbnM6XCIsIGFkZHJlc3NUeHMpO1xuXG4gICAgICAgICAgYWRkcmVzc1R4cy5mb3JFYWNoKHR4ID0+IHtcbiAgICAgICAgICAgICAgYWRkVHgodHguc2NyaXB0UHViS2V5Lm5hbWVPcC5uYW1lLCB0eC5zY3JpcHRQdWJLZXkubmFtZU9wLnZhbHVlLHR4LnNjcmlwdFB1YktleS5hZGRyZXNzZXNbMF0sdHhpZCk7XG4gICAgICAgICAgfSk7XG4gICAgICB9XG5cblxuXG4gIH0gY2F0Y2goZXhjZXB0aW9uKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZG9pY2hhaW4uY2hlY2tOZXdUcmFuc2FjdGlvbnMuZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn07XG5cblxuZnVuY3Rpb24gYWRkVHgobmFtZSwgdmFsdWUsIGFkZHJlc3MsIHR4aWQpIHtcbiAgICBjb25zdCB0eE5hbWUgPSBuYW1lLnN1YnN0cmluZyhUWF9OQU1FX1NUQVJULmxlbmd0aCk7XG5cbiAgICBhZGREb2ljaGFpbkVudHJ5KHtcbiAgICAgICAgbmFtZTogdHhOYW1lLFxuICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgIGFkZHJlc3M6IGFkZHJlc3MsXG4gICAgICAgIHR4SWQ6IHR4aWRcbiAgICB9KTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2hlY2tOZXdUcmFuc2FjdGlvbjtcblxuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XG5pbXBvcnQgY3J5cHRvIGZyb20gJ2NyeXB0byc7XG5pbXBvcnQgZWNpZXMgZnJvbSAnc3RhbmRhcmQtZWNpZXMnO1xuXG5jb25zdCBEZWNyeXB0TWVzc2FnZVNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICBwcml2YXRlS2V5OiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH0sXG4gIG1lc3NhZ2U6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfVxufSk7XG5cbmNvbnN0IGRlY3J5cHRNZXNzYWdlID0gKGRhdGEpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBvdXJEYXRhID0gZGF0YTtcbiAgICBEZWNyeXB0TWVzc2FnZVNjaGVtYS52YWxpZGF0ZShvdXJEYXRhKTtcbiAgICBjb25zdCBwcml2YXRlS2V5ID0gQnVmZmVyLmZyb20ob3VyRGF0YS5wcml2YXRlS2V5LCAnaGV4Jyk7XG4gICAgY29uc3QgZWNkaCA9IGNyeXB0by5jcmVhdGVFQ0RIKCdzZWNwMjU2azEnKTtcbiAgICBlY2RoLnNldFByaXZhdGVLZXkocHJpdmF0ZUtleSk7XG4gICAgY29uc3QgbWVzc2FnZSA9IEJ1ZmZlci5mcm9tKG91ckRhdGEubWVzc2FnZSwgJ2hleCcpO1xuICAgIHJldHVybiBlY2llcy5kZWNyeXB0KGVjZGgsIG1lc3NhZ2UpLnRvU3RyaW5nKCd1dGY4Jyk7XG4gIH0gY2F0Y2goZXhjZXB0aW9uKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZG9pY2hhaW4uZGVjcnlwdE1lc3NhZ2UuZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgZGVjcnlwdE1lc3NhZ2U7XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcbmltcG9ydCBlY2llcyBmcm9tICdzdGFuZGFyZC1lY2llcyc7XG5cbmNvbnN0IEVuY3J5cHRNZXNzYWdlU2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIHB1YmxpY0tleToge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9LFxuICBtZXNzYWdlOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH1cbn0pO1xuXG5jb25zdCBlbmNyeXB0TWVzc2FnZSA9IChkYXRhKSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3Qgb3VyRGF0YSA9IGRhdGE7XG4gICAgRW5jcnlwdE1lc3NhZ2VTY2hlbWEudmFsaWRhdGUob3VyRGF0YSk7XG4gICAgY29uc3QgcHVibGljS2V5ID0gQnVmZmVyLmZyb20ob3VyRGF0YS5wdWJsaWNLZXksICdoZXgnKTtcbiAgICBjb25zdCBtZXNzYWdlID0gQnVmZmVyLmZyb20ob3VyRGF0YS5tZXNzYWdlKTtcbiAgICByZXR1cm4gZWNpZXMuZW5jcnlwdChwdWJsaWNLZXksIG1lc3NhZ2UpLnRvU3RyaW5nKCdoZXgnKTtcbiAgfSBjYXRjaChleGNlcHRpb24pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdkb2ljaGFpbi5lbmNyeXB0TWVzc2FnZS5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBlbmNyeXB0TWVzc2FnZTtcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tICdzaW1wbC1zY2hlbWEnO1xuaW1wb3J0IHsgT3B0SW5zIH0gZnJvbSAnLi4vLi4vLi4vYXBpL29wdC1pbnMvb3B0LWlucy5qcyc7XG5pbXBvcnQgZ2V0S2V5UGFpciBmcm9tICcuL2dldF9rZXktcGFpci5qcyc7XG5pbXBvcnQge2xvZ1NlbmR9IGZyb20gXCIuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9sb2ctY29uZmlndXJhdGlvblwiO1xuXG5jb25zdCBHZW5lcmF0ZU5hbWVJZFNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICBpZDoge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9LFxuICBtYXN0ZXJEb2k6IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIG9wdGlvbmFsOiB0cnVlXG4gIH0sXG4gIGluZGV4OiB7XG4gICAgICB0eXBlOiBTaW1wbGVTY2hlbWEuSW50ZWdlcixcbiAgICAgIG9wdGlvbmFsOiB0cnVlXG4gIH1cbn0pO1xuXG5jb25zdCBnZW5lcmF0ZU5hbWVJZCA9IChvcHRJbikgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IG91ck9wdEluID0gb3B0SW47XG4gICAgR2VuZXJhdGVOYW1lSWRTY2hlbWEudmFsaWRhdGUob3VyT3B0SW4pO1xuICAgIGxldCBuYW1lSWQ7XG4gICAgaWYob3B0SW4ubWFzdGVyRG9pKXtcbiAgICAgICAgbmFtZUlkID0gb3VyT3B0SW4ubWFzdGVyRG9pK1wiLVwiK291ck9wdEluLmluZGV4O1xuICAgICAgICBsb2dTZW5kKFwidXNlZCBtYXN0ZXJfZG9pIGFzIG5hbWVJZCBpbmRleCBcIitvcHRJbi5pbmRleCtcInN0b3JhZ2U6XCIsbmFtZUlkKTtcbiAgICB9XG4gICAgZWxzZXtcbiAgICAgICAgbmFtZUlkID0gZ2V0S2V5UGFpcigpLnByaXZhdGVLZXk7XG4gICAgICAgIGxvZ1NlbmQoXCJnZW5lcmF0ZWQgbmFtZUlkIGZvciBkb2ljaGFpbiBzdG9yYWdlOlwiLG5hbWVJZCk7XG4gICAgfVxuXG4gICAgT3B0SW5zLnVwZGF0ZSh7X2lkIDogb3VyT3B0SW4uaWR9LCB7JHNldDp7bmFtZUlkOiBuYW1lSWR9fSk7XG5cbiAgICByZXR1cm4gbmFtZUlkO1xuICB9IGNhdGNoKGV4Y2VwdGlvbikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2RvaWNoYWluLmdlbmVyYXRlTmFtZUlkLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGdlbmVyYXRlTmFtZUlkO1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XG5pbXBvcnQgQ3J5cHRvSlMgZnJvbSAnY3J5cHRvLWpzJztcbmltcG9ydCBCYXNlNTggZnJvbSAnYnM1OCc7XG5pbXBvcnQgeyBpc1JlZ3Rlc3QgfSBmcm9tICcuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9kYXBwLWNvbmZpZ3VyYXRpb24uanMnO1xuaW1wb3J0IHtpc1Rlc3RuZXR9IGZyb20gXCIuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9kYXBwLWNvbmZpZ3VyYXRpb25cIjtcblxuY29uc3QgVkVSU0lPTl9CWVRFID0gMHgzNDtcbmNvbnN0IFZFUlNJT05fQllURV9SRUdURVNUID0gMHg2ZjtcbmNvbnN0IEdldEFkZHJlc3NTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgcHVibGljS2V5OiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH1cbn0pO1xuXG5jb25zdCBnZXRBZGRyZXNzID0gKGRhdGEpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBvdXJEYXRhID0gZGF0YTtcbiAgICBHZXRBZGRyZXNzU2NoZW1hLnZhbGlkYXRlKG91ckRhdGEpO1xuICAgIHJldHVybiBfZ2V0QWRkcmVzcyhvdXJEYXRhLnB1YmxpY0tleSk7XG4gIH0gY2F0Y2goZXhjZXB0aW9uKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZG9pY2hhaW4uZ2V0QWRkcmVzcy5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9XG59O1xuXG5mdW5jdGlvbiBfZ2V0QWRkcmVzcyhwdWJsaWNLZXkpIHtcbiAgY29uc3QgcHViS2V5ID0gQ3J5cHRvSlMubGliLldvcmRBcnJheS5jcmVhdGUoQnVmZmVyLmZyb20ocHVibGljS2V5LCAnaGV4JykpO1xuICBsZXQga2V5ID0gQ3J5cHRvSlMuU0hBMjU2KHB1YktleSk7XG4gIGtleSA9IENyeXB0b0pTLlJJUEVNRDE2MChrZXkpO1xuICBsZXQgdmVyc2lvbkJ5dGUgPSBWRVJTSU9OX0JZVEU7XG4gIGlmKGlzUmVndGVzdCgpIHx8IGlzVGVzdG5ldCgpKSB2ZXJzaW9uQnl0ZSA9IFZFUlNJT05fQllURV9SRUdURVNUO1xuICBsZXQgYWRkcmVzcyA9IEJ1ZmZlci5jb25jYXQoW0J1ZmZlci5mcm9tKFt2ZXJzaW9uQnl0ZV0pLCBCdWZmZXIuZnJvbShrZXkudG9TdHJpbmcoKSwgJ2hleCcpXSk7XG4gIGtleSA9IENyeXB0b0pTLlNIQTI1NihDcnlwdG9KUy5saWIuV29yZEFycmF5LmNyZWF0ZShhZGRyZXNzKSk7XG4gIGtleSA9IENyeXB0b0pTLlNIQTI1NihrZXkpO1xuICBsZXQgY2hlY2tzdW0gPSBrZXkudG9TdHJpbmcoKS5zdWJzdHJpbmcoMCwgOCk7XG4gIGFkZHJlc3MgPSBuZXcgQnVmZmVyKGFkZHJlc3MudG9TdHJpbmcoJ2hleCcpK2NoZWNrc3VtLCdoZXgnKTtcbiAgYWRkcmVzcyA9IEJhc2U1OC5lbmNvZGUoYWRkcmVzcyk7XG4gIHJldHVybiBhZGRyZXNzO1xufVxuXG5leHBvcnQgZGVmYXVsdCBnZXRBZGRyZXNzO1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgeyBnZXRCYWxhbmNlIH0gZnJvbSAnLi4vLi4vLi4vLi4vc2VydmVyL2FwaS9kb2ljaGFpbi5qcyc7XG5pbXBvcnQgeyBDT05GSVJNX0NMSUVOVH0gZnJvbSAnLi4vLi4vLi4vc3RhcnR1cC9zZXJ2ZXIvZG9pY2hhaW4tY29uZmlndXJhdGlvbi5qcyc7XG5cblxuY29uc3QgZ2V0X0JhbGFuY2UgPSAoKSA9PiB7XG4gICAgXG4gIHRyeSB7XG4gICAgY29uc3QgYmFsPWdldEJhbGFuY2UoQ09ORklSTV9DTElFTlQpO1xuICAgIHJldHVybiBiYWw7XG4gICAgXG4gIH0gY2F0Y2goZXhjZXB0aW9uKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZG9pY2hhaW4uZ2V0QmFsYW5jZS5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9XG4gIHJldHVybiB0cnVlO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgZ2V0X0JhbGFuY2U7XG5cbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IENyeXB0b0pTIGZyb20gJ2NyeXB0by1qcyc7XG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XG5cbmNvbnN0IEdldERhdGFIYXNoU2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIGRhdGE6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfVxufSk7XG5cbmNvbnN0IGdldERhdGFIYXNoID0gKGRhdGEpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBvdXJEYXRhID0gZGF0YTtcbiAgICAgIEdldERhdGFIYXNoU2NoZW1hLnZhbGlkYXRlKG91ckRhdGEpO1xuICAgIGNvbnN0IGhhc2ggPSBDcnlwdG9KUy5TSEEyNTYob3VyRGF0YSkudG9TdHJpbmcoKTtcbiAgICByZXR1cm4gaGFzaDtcbiAgfSBjYXRjaChleGNlcHRpb24pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdkb2ljaGFpbi5nZXREYXRhSGFzaC5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBnZXREYXRhSGFzaDtcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IHsgcmFuZG9tQnl0ZXMgfSBmcm9tICdjcnlwdG8nO1xuaW1wb3J0IHNlY3AyNTZrMSBmcm9tICdzZWNwMjU2azEnO1xuXG5jb25zdCBnZXRLZXlQYWlyID0gKCkgPT4ge1xuICB0cnkge1xuICAgIGxldCBwcml2S2V5XG4gICAgZG8ge3ByaXZLZXkgPSByYW5kb21CeXRlcygzMil9IHdoaWxlKCFzZWNwMjU2azEucHJpdmF0ZUtleVZlcmlmeShwcml2S2V5KSlcbiAgICBjb25zdCBwcml2YXRlS2V5ID0gcHJpdktleTtcbiAgICBjb25zdCBwdWJsaWNLZXkgPSBzZWNwMjU2azEucHVibGljS2V5Q3JlYXRlKHByaXZhdGVLZXkpO1xuICAgIHJldHVybiB7XG4gICAgICBwcml2YXRlS2V5OiBwcml2YXRlS2V5LnRvU3RyaW5nKCdoZXgnKS50b1VwcGVyQ2FzZSgpLFxuICAgICAgcHVibGljS2V5OiBwdWJsaWNLZXkudG9TdHJpbmcoJ2hleCcpLnRvVXBwZXJDYXNlKClcbiAgICB9XG4gIH0gY2F0Y2goZXhjZXB0aW9uKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZG9pY2hhaW4uZ2V0S2V5UGFpci5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBnZXRLZXlQYWlyO1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XG5pbXBvcnQgQmFzZTU4IGZyb20gJ2JzNTgnO1xuXG5jb25zdCBHZXRQcml2YXRlS2V5RnJvbVdpZlNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICB3aWY6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfVxufSk7XG5cbmNvbnN0IGdldFByaXZhdGVLZXlGcm9tV2lmID0gKGRhdGEpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBvdXJEYXRhID0gZGF0YTtcbiAgICBHZXRQcml2YXRlS2V5RnJvbVdpZlNjaGVtYS52YWxpZGF0ZShvdXJEYXRhKTtcbiAgICByZXR1cm4gX2dldFByaXZhdGVLZXlGcm9tV2lmKG91ckRhdGEud2lmKTtcbiAgfSBjYXRjaChleGNlcHRpb24pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdkb2ljaGFpbi5nZXRQcml2YXRlS2V5RnJvbVdpZi5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9XG59O1xuXG5mdW5jdGlvbiBfZ2V0UHJpdmF0ZUtleUZyb21XaWYod2lmKSB7XG4gIHZhciBwcml2YXRlS2V5ID0gQmFzZTU4LmRlY29kZSh3aWYpLnRvU3RyaW5nKCdoZXgnKTtcbiAgcHJpdmF0ZUtleSA9IHByaXZhdGVLZXkuc3Vic3RyaW5nKDIsIHByaXZhdGVLZXkubGVuZ3RoIC0gOCk7XG4gIGlmKHByaXZhdGVLZXkubGVuZ3RoID09PSA2NiAmJiBwcml2YXRlS2V5LmVuZHNXaXRoKFwiMDFcIikpIHtcbiAgICBwcml2YXRlS2V5ID0gcHJpdmF0ZUtleS5zdWJzdHJpbmcoMCwgcHJpdmF0ZUtleS5sZW5ndGggLSAyKTtcbiAgfVxuICByZXR1cm4gcHJpdmF0ZUtleTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZ2V0UHJpdmF0ZUtleUZyb21XaWY7XG4iLCJpbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XG5pbXBvcnQge2xvZ1NlbmR9IGZyb20gXCIuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9sb2ctY29uZmlndXJhdGlvblwiO1xuXG5pbXBvcnQgZ2V0T3B0SW5LZXkgZnJvbSBcIi4uL2Rucy9nZXRfb3B0LWluLWtleVwiO1xuaW1wb3J0IGdldE9wdEluUHJvdmlkZXIgZnJvbSBcIi4uL2Rucy9nZXRfb3B0LWluLXByb3ZpZGVyXCI7XG5pbXBvcnQgZ2V0QWRkcmVzcyBmcm9tIFwiLi9nZXRfYWRkcmVzc1wiO1xuXG5jb25zdCBHZXRQdWJsaWNLZXlTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgICBkb21haW46IHtcbiAgICAgICAgdHlwZTogU3RyaW5nXG4gICAgfVxufSk7XG5cbmNvbnN0IGdldFB1YmxpY0tleUFuZEFkZHJlc3MgPSAoZGF0YSkgPT4ge1xuXG4gICAgY29uc3Qgb3VyRGF0YSA9IGRhdGE7XG4gICAgR2V0UHVibGljS2V5U2NoZW1hLnZhbGlkYXRlKG91ckRhdGEpO1xuXG4gICAgbGV0IHB1YmxpY0tleSA9IGdldE9wdEluS2V5KHtkb21haW46IG91ckRhdGEuZG9tYWlufSk7XG4gICAgaWYoIXB1YmxpY0tleSl7XG4gICAgICAgIGNvbnN0IHByb3ZpZGVyID0gZ2V0T3B0SW5Qcm92aWRlcih7ZG9tYWluOiBvdXJEYXRhLmRvbWFpbn0pO1xuICAgICAgICBsb2dTZW5kKFwidXNpbmcgZG9pY2hhaW4gcHJvdmlkZXIgaW5zdGVhZCBvZiBkaXJlY3RseSBjb25maWd1cmVkIHB1YmxpY0tleTpcIix7cHJvdmlkZXI6cHJvdmlkZXJ9KTtcbiAgICAgICAgcHVibGljS2V5ID0gZ2V0T3B0SW5LZXkoe2RvbWFpbjogcHJvdmlkZXJ9KTsgLy9nZXQgcHVibGljIGtleSBmcm9tIHByb3ZpZGVyIG9yIGZhbGxiYWNrIGlmIHB1YmxpY2tleSB3YXMgbm90IHNldCBpbiBkbnNcbiAgICB9XG4gICAgY29uc3QgZGVzdEFkZHJlc3MgPSAgZ2V0QWRkcmVzcyh7cHVibGljS2V5OiBwdWJsaWNLZXl9KTtcbiAgICBsb2dTZW5kKCdwdWJsaWNLZXkgYW5kIGRlc3RBZGRyZXNzICcsIHtwdWJsaWNLZXk6cHVibGljS2V5LGRlc3RBZGRyZXNzOmRlc3RBZGRyZXNzfSk7XG4gICAgcmV0dXJuIHtwdWJsaWNLZXk6cHVibGljS2V5LGRlc3RBZGRyZXNzOmRlc3RBZGRyZXNzfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGdldFB1YmxpY0tleUFuZEFkZHJlc3M7IiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XG5pbXBvcnQgYml0Y29yZSBmcm9tICdiaXRjb3JlLWxpYic7XG5pbXBvcnQgTWVzc2FnZSBmcm9tICdiaXRjb3JlLW1lc3NhZ2UnO1xuXG5jb25zdCBHZXRTaWduYXR1cmVTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgbWVzc2FnZToge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9LFxuICBwcml2YXRlS2V5OiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH1cbn0pO1xuXG5jb25zdCBnZXRTaWduYXR1cmUgPSAoZGF0YSkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IG91ckRhdGEgPSBkYXRhO1xuICAgIEdldFNpZ25hdHVyZVNjaGVtYS52YWxpZGF0ZShvdXJEYXRhKTtcbiAgICBjb25zdCBzaWduYXR1cmUgPSBNZXNzYWdlKG91ckRhdGEubWVzc2FnZSkuc2lnbihuZXcgYml0Y29yZS5Qcml2YXRlS2V5KG91ckRhdGEucHJpdmF0ZUtleSkpO1xuICAgIHJldHVybiBzaWduYXR1cmU7XG4gIH0gY2F0Y2goZXhjZXB0aW9uKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZG9pY2hhaW4uZ2V0U2lnbmF0dXJlLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGdldFNpZ25hdHVyZTtcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tICdzaW1wbC1zY2hlbWEnO1xuaW1wb3J0IHsgU0VORF9DTElFTlQgfSBmcm9tICcuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9kb2ljaGFpbi1jb25maWd1cmF0aW9uLmpzJztcbmltcG9ydCBlbmNyeXB0TWVzc2FnZSBmcm9tIFwiLi9lbmNyeXB0X21lc3NhZ2VcIjtcbmltcG9ydCB7Z2V0VXJsfSBmcm9tIFwiLi4vLi4vLi4vc3RhcnR1cC9zZXJ2ZXIvZGFwcC1jb25maWd1cmF0aW9uXCI7XG5pbXBvcnQge2xvZ0Jsb2NrY2hhaW4sIGxvZ1NlbmR9IGZyb20gXCIuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9sb2ctY29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHtmZWVEb2ksbmFtZURvaX0gZnJvbSBcIi4uLy4uLy4uLy4uL3NlcnZlci9hcGkvZG9pY2hhaW5cIjtcbmltcG9ydCB7T3B0SW5zfSBmcm9tIFwiLi4vLi4vLi4vYXBpL29wdC1pbnMvb3B0LWluc1wiO1xuaW1wb3J0IGdldFB1YmxpY0tleUFuZEFkZHJlc3MgZnJvbSBcIi4vZ2V0X3B1YmxpY2tleV9hbmRfYWRkcmVzc19ieV9kb21haW5cIjtcblxuXG5jb25zdCBJbnNlcnRTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgbmFtZUlkOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH0sXG4gIHNpZ25hdHVyZToge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9LFxuICBkYXRhSGFzaDoge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9LFxuICBkb21haW46IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfSxcbiAgc29pRGF0ZToge1xuICAgIHR5cGU6IERhdGVcbiAgfVxufSk7XG5cbmNvbnN0IGluc2VydCA9IChkYXRhKSA9PiB7XG4gIGNvbnN0IG91ckRhdGEgPSBkYXRhO1xuICB0cnkge1xuICAgIEluc2VydFNjaGVtYS52YWxpZGF0ZShvdXJEYXRhKTtcbiAgICBsb2dTZW5kKFwiZG9tYWluOlwiLG91ckRhdGEuZG9tYWluKTtcblxuICAgIGNvbnN0IHB1YmxpY0tleUFuZEFkZHJlc3MgPSBnZXRQdWJsaWNLZXlBbmRBZGRyZXNzKHtkb21haW46b3VyRGF0YS5kb21haW59KTtcbiAgICBjb25zdCBmcm9tID0gZW5jcnlwdE1lc3NhZ2Uoe3B1YmxpY0tleTogcHVibGljS2V5QW5kQWRkcmVzcy5wdWJsaWNLZXksIG1lc3NhZ2U6IGdldFVybCgpfSk7XG4gICAgbG9nU2VuZCgnZW5jcnlwdGVkIHVybCBmb3IgdXNlIGFkIGZyb20gaW4gZG9pY2hhaW4gdmFsdWU6JyxnZXRVcmwoKSxmcm9tKTtcblxuICAgIGNvbnN0IG5hbWVWYWx1ZSA9IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgc2lnbmF0dXJlOiBvdXJEYXRhLnNpZ25hdHVyZSxcbiAgICAgICAgZGF0YUhhc2g6IG91ckRhdGEuZGF0YUhhc2gsXG4gICAgICAgIGZyb206IGZyb21cbiAgICB9KTtcblxuICAgIC8vVE9ETyAoISkgdGhpcyBtdXN0IGJlIHJlcGxhY2VkIGluIGZ1dHVyZSBieSBcImF0b21pYyBuYW1lIHRyYWRpbmcgZXhhbXBsZVwiIGh0dHBzOi8vd2lraS5uYW1lY29pbi5pbmZvLz90aXRsZT1BdG9taWNfTmFtZS1UcmFkaW5nXG4gICAgbG9nQmxvY2tjaGFpbignc2VuZGluZyBhIGZlZSB0byBib2Igc28gaGUgY2FuIHBheSB0aGUgZG9pIHN0b3JhZ2UgKGRlc3RBZGRyZXNzKTonLCBwdWJsaWNLZXlBbmRBZGRyZXNzLmRlc3RBZGRyZXNzKTtcbiAgICBjb25zdCBmZWVEb2lUeCA9IGZlZURvaShTRU5EX0NMSUVOVCwgcHVibGljS2V5QW5kQWRkcmVzcy5kZXN0QWRkcmVzcyk7XG4gICAgbG9nQmxvY2tjaGFpbignZmVlIHNlbmQgdHhpZCB0byBkZXN0YWRkcmVzcycsIGZlZURvaVR4LCBwdWJsaWNLZXlBbmRBZGRyZXNzLmRlc3RBZGRyZXNzKTtcblxuICAgIGxvZ0Jsb2NrY2hhaW4oJ2FkZGluZyBkYXRhIHRvIGJsb2NrY2hhaW4gdmlhIG5hbWVfZG9pIChuYW1lSWQsdmFsdWUsZGVzdEFkZHJlc3MpOicsIG91ckRhdGEubmFtZUlkLG5hbWVWYWx1ZSxwdWJsaWNLZXlBbmRBZGRyZXNzLmRlc3RBZGRyZXNzKTtcbiAgICBjb25zdCBuYW1lRG9pVHggPSBuYW1lRG9pKFNFTkRfQ0xJRU5ULCBvdXJEYXRhLm5hbWVJZCwgbmFtZVZhbHVlLCBwdWJsaWNLZXlBbmRBZGRyZXNzLmRlc3RBZGRyZXNzKTtcbiAgICBsb2dCbG9ja2NoYWluKCduYW1lX2RvaSBhZGRlZCBibG9ja2NoYWluLiB0eGlkOicsIG5hbWVEb2lUeCk7XG5cbiAgICBPcHRJbnMudXBkYXRlKHtuYW1lSWQ6IG91ckRhdGEubmFtZUlkfSwgeyRzZXQ6IHt0eElkOm5hbWVEb2lUeH19KTtcbiAgICBsb2dCbG9ja2NoYWluKCd1cGRhdGluZyBPcHRJbiBsb2NhbGx5IHdpdGg6Jywge25hbWVJZDogb3VyRGF0YS5uYW1lSWQsIHR4SWQ6IG5hbWVEb2lUeH0pO1xuXG4gIH0gY2F0Y2goZXhjZXB0aW9uKSB7XG4gICAgICBPcHRJbnMudXBkYXRlKHtuYW1lSWQ6IG91ckRhdGEubmFtZUlkfSwgeyRzZXQ6IHtlcnJvcjpKU09OLnN0cmluZ2lmeShleGNlcHRpb24ubWVzc2FnZSl9fSk7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZG9pY2hhaW4uaW5zZXJ0LmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7IC8vVE9ETyB1cGRhdGUgb3B0LWluIGluIGxvY2FsIGRiIHRvIGluZm9ybSB1c2VyIGFib3V0IHRoZSBlcnJvciEgZS5nLiBJbnN1ZmZpY2llbnQgZnVuZHMgZXRjLlxuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBpbnNlcnQ7XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcbmltcG9ydCB7IENPTkZJUk1fQ0xJRU5UIH0gZnJvbSAnLi4vLi4vLi4vc3RhcnR1cC9zZXJ2ZXIvZG9pY2hhaW4tY29uZmlndXJhdGlvbi5qcyc7XG5pbXBvcnQge2dldFdpZiwgc2lnbk1lc3NhZ2UsIGdldFRyYW5zYWN0aW9uLCBuYW1lRG9pLCBuYW1lU2hvd30gZnJvbSBcIi4uLy4uLy4uLy4uL3NlcnZlci9hcGkvZG9pY2hhaW5cIjtcbmltcG9ydCB7QVBJX1BBVEgsIERPSV9DT05GSVJNQVRJT05fTk9USUZZX1JPVVRFLCBWRVJTSU9OfSBmcm9tIFwiLi4vLi4vLi4vLi4vc2VydmVyL2FwaS9yZXN0L3Jlc3RcIjtcbmltcG9ydCB7Q09ORklSTV9BRERSRVNTfSBmcm9tIFwiLi4vLi4vLi4vc3RhcnR1cC9zZXJ2ZXIvZG9pY2hhaW4tY29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHtnZXRIdHRwUFVUfSBmcm9tIFwiLi4vLi4vLi4vLi4vc2VydmVyL2FwaS9odHRwXCI7XG5pbXBvcnQge2xvZ0NvbmZpcm19IGZyb20gXCIuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9sb2ctY29uZmlndXJhdGlvblwiO1xuaW1wb3J0IGdldFByaXZhdGVLZXlGcm9tV2lmIGZyb20gXCIuL2dldF9wcml2YXRlLWtleV9mcm9tX3dpZlwiO1xuaW1wb3J0IGRlY3J5cHRNZXNzYWdlIGZyb20gXCIuL2RlY3J5cHRfbWVzc2FnZVwiO1xuaW1wb3J0IHtPcHRJbnN9IGZyb20gXCIuLi8uLi8uLi9hcGkvb3B0LWlucy9vcHQtaW5zXCI7XG5cbmNvbnN0IFVwZGF0ZVNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICBuYW1lSWQ6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfSxcbiAgdmFsdWU6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfSxcbiAgaG9zdCA6IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIG9wdGlvbmFsOiB0cnVlLFxuICB9LFxuICBmcm9tSG9zdFVybCA6IHtcbiAgICAgIHR5cGU6IFN0cmluZ1xuICB9XG59KTtcblxuY29uc3QgdXBkYXRlID0gKGRhdGEsIGpvYikgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IG91ckRhdGEgPSBkYXRhO1xuXG4gICAgVXBkYXRlU2NoZW1hLnZhbGlkYXRlKG91ckRhdGEpO1xuXG4gICAgLy9zdG9wIHRoaXMgdXBkYXRlIHVudGlsIHRoaXMgbmFtZSBhcyBhdCBsZWFzdCAxIGNvbmZpcm1hdGlvblxuICAgIGNvbnN0IG5hbWVfZGF0YSA9IG5hbWVTaG93KENPTkZJUk1fQ0xJRU5ULG91ckRhdGEubmFtZUlkKTtcbiAgICBpZihuYW1lX2RhdGEgPT09IHVuZGVmaW5lZCl7XG4gICAgICAgIHJlcnVuKGpvYik7XG4gICAgICAgIGxvZ0NvbmZpcm0oJ25hbWUgbm90IHZpc2libGUgLSBkZWxheWluZyBuYW1lIHVwZGF0ZScsb3VyRGF0YS5uYW1lSWQpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IG91cl90cmFuc2FjdGlvbiA9IGdldFRyYW5zYWN0aW9uKENPTkZJUk1fQ0xJRU5ULG5hbWVfZGF0YS50eGlkKTtcbiAgICBpZihvdXJfdHJhbnNhY3Rpb24uY29uZmlybWF0aW9ucz09PTApe1xuICAgICAgICByZXJ1bihqb2IpO1xuICAgICAgICBsb2dDb25maXJtKCd0cmFuc2FjdGlvbiBoYXMgMCBjb25maXJtYXRpb25zIC0gZGVsYXlpbmcgbmFtZSB1cGRhdGUnLEpTT04ucGFyc2Uob3VyRGF0YS52YWx1ZSkpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGxvZ0NvbmZpcm0oJ3VwZGF0aW5nIGJsb2NrY2hhaW4gd2l0aCBkb2lTaWduYXR1cmU6JyxKU09OLnBhcnNlKG91ckRhdGEudmFsdWUpKTtcbiAgICBjb25zdCB3aWYgPSBnZXRXaWYoQ09ORklSTV9DTElFTlQsIENPTkZJUk1fQUREUkVTUyk7XG4gICAgY29uc3QgcHJpdmF0ZUtleSA9IGdldFByaXZhdGVLZXlGcm9tV2lmKHt3aWY6IHdpZn0pO1xuICAgIGxvZ0NvbmZpcm0oJ2dvdCBwcml2YXRlIGtleSAod2lsbCBub3Qgc2hvdyBpdCBoZXJlKSBpbiBvcmRlciB0byBkZWNyeXB0IFNlbmQtZEFwcCBob3N0IHVybCBmcm9tIHZhbHVlOicsb3VyRGF0YS5mcm9tSG9zdFVybCk7XG4gICAgY29uc3Qgb3VyZnJvbUhvc3RVcmwgPSBkZWNyeXB0TWVzc2FnZSh7cHJpdmF0ZUtleTogcHJpdmF0ZUtleSwgbWVzc2FnZTogb3VyRGF0YS5mcm9tSG9zdFVybH0pO1xuICAgIGxvZ0NvbmZpcm0oJ2RlY3J5cHRlZCBmcm9tSG9zdFVybCcsb3VyZnJvbUhvc3RVcmwpO1xuICAgIGNvbnN0IHVybCA9IG91cmZyb21Ib3N0VXJsK0FQSV9QQVRIK1ZFUlNJT04rXCIvXCIrRE9JX0NPTkZJUk1BVElPTl9OT1RJRllfUk9VVEU7XG5cbiAgICBsb2dDb25maXJtKCdjcmVhdGluZyBzaWduYXR1cmUgd2l0aCBBRERSRVNTJytDT05GSVJNX0FERFJFU1MrXCIgbmFtZUlkOlwiLG91ckRhdGEudmFsdWUpO1xuICAgIGNvbnN0IHNpZ25hdHVyZSA9IHNpZ25NZXNzYWdlKENPTkZJUk1fQ0xJRU5ULCBDT05GSVJNX0FERFJFU1MsIG91ckRhdGEubmFtZUlkKTsgLy9UT0RPIHdoeSBoZXJlIG92ZXIgbmFtZUlEP1xuICAgIGxvZ0NvbmZpcm0oJ3NpZ25hdHVyZSBjcmVhdGVkOicsc2lnbmF0dXJlKTtcblxuICAgIGNvbnN0IHVwZGF0ZURhdGEgPSB7XG4gICAgICAgIG5hbWVJZDogb3VyRGF0YS5uYW1lSWQsXG4gICAgICAgIHNpZ25hdHVyZTogc2lnbmF0dXJlLFxuICAgICAgICBob3N0OiBvdXJEYXRhLmhvc3RcbiAgICB9O1xuXG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgdHhpZCA9IG5hbWVEb2koQ09ORklSTV9DTElFTlQsIG91ckRhdGEubmFtZUlkLCBvdXJEYXRhLnZhbHVlLCBudWxsKTtcbiAgICAgICAgbG9nQ29uZmlybSgndXBkYXRlIHRyYW5zYWN0aW9uIHR4aWQ6Jyx0eGlkKTtcbiAgICB9Y2F0Y2goZXhjZXB0aW9uKXtcbiAgICAgICAgLy9cbiAgICAgICAgbG9nQ29uZmlybSgndGhpcyBuYW1lRE9JIGRvZXNuwrR0IGhhdmUgYSBibG9jayB5ZXQgYW5kIHdpbGwgYmUgdXBkYXRlZCB3aXRoIHRoZSBuZXh0IGJsb2NrIGFuZCB3aXRoIHRoZSBuZXh0IHF1ZXVlIHN0YXJ0Oicsb3VyRGF0YS5uYW1lSWQpO1xuICAgICAgICBpZihleGNlcHRpb24udG9TdHJpbmcoKS5pbmRleE9mKFwidGhlcmUgaXMgYWxyZWFkeSBhIHJlZ2lzdHJhdGlvbiBmb3IgdGhpcyBkb2kgbmFtZVwiKT09LTEpIHtcbiAgICAgICAgICAgIE9wdElucy51cGRhdGUoe25hbWVJZDogb3VyRGF0YS5uYW1lSWR9LCB7JHNldDoge2Vycm9yOiBKU09OLnN0cmluZ2lmeShleGNlcHRpb24ubWVzc2FnZSl9fSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZG9pY2hhaW4udXBkYXRlLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gICAgICAgIC8vfWVsc2V7XG4gICAgICAgIC8vICAgIGxvZ0NvbmZpcm0oJ3RoaXMgbmFtZURPSSBkb2VzbsK0dCBoYXZlIGEgYmxvY2sgeWV0IGFuZCB3aWxsIGJlIHVwZGF0ZWQgd2l0aCB0aGUgbmV4dCBibG9jayBhbmQgd2l0aCB0aGUgbmV4dCBxdWV1ZSBzdGFydDonLG91ckRhdGEubmFtZUlkKTtcbiAgICAgICAgLy99XG4gICAgfVxuXG4gICAgY29uc3QgcmVzcG9uc2UgPSBnZXRIdHRwUFVUKHVybCwgdXBkYXRlRGF0YSk7XG4gICAgbG9nQ29uZmlybSgnaW5mb3JtZWQgc2VuZCBkQXBwIGFib3V0IGNvbmZpcm1lZCBkb2kgb24gdXJsOicrdXJsKycgd2l0aCB1cGRhdGVEYXRhJytKU09OLnN0cmluZ2lmeSh1cGRhdGVEYXRhKStcIiByZXNwb25zZTpcIixyZXNwb25zZS5kYXRhKTtcbiAgICBqb2IuZG9uZSgpO1xuICB9IGNhdGNoKGV4Y2VwdGlvbikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2RvaWNoYWluLnVwZGF0ZS5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9XG59O1xuXG5mdW5jdGlvbiByZXJ1bihqb2Ipe1xuICAgIGxvZ0NvbmZpcm0oJ3JlcnVubmluZyB0eGlkIGluIDEwc2VjIC0gY2FuY2VsaW5nIG9sZCBqb2InLCcnKTtcbiAgICBqb2IuY2FuY2VsKCk7XG4gICAgbG9nQ29uZmlybSgncmVzdGFydCBibG9ja2NoYWluIGRvaSB1cGRhdGUnLCcnKTtcbiAgICBqb2IucmVzdGFydChcbiAgICAgICAge1xuICAgICAgICAgICAgLy9yZXBlYXRzOiA2MDAsICAgLy8gT25seSByZXBlYXQgdGhpcyBvbmNlXG4gICAgICAgICAgICAvLyBUaGlzIGlzIHRoZSBkZWZhdWx0XG4gICAgICAgICAgIC8vIHdhaXQ6IDEwMDAwICAgLy8gV2FpdCAxMCBzZWMgYmV0d2VlbiByZXBlYXRzXG4gICAgICAgICAgICAgICAgICAgICAgICAgIC8vIERlZmF1bHQgaXMgcHJldmlvdXMgc2V0dGluZ1xuICAgICAgICB9LFxuICAgICAgICBmdW5jdGlvbiAoZXJyLCByZXN1bHQpIHtcbiAgICAgICAgICAgIGlmIChyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICBsb2dDb25maXJtKCdyZXJ1bm5pbmcgdHhpZCBpbiAxMHNlYzonLHJlc3VsdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICApO1xufVxuXG5leHBvcnQgZGVmYXVsdCB1cGRhdGU7XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcbmltcG9ydCBiaXRjb3JlIGZyb20gJ2JpdGNvcmUtbGliJztcbmltcG9ydCBNZXNzYWdlIGZyb20gJ2JpdGNvcmUtbWVzc2FnZSc7XG5pbXBvcnQge2xvZ0Vycm9yLCBsb2dWZXJpZnl9IGZyb20gXCIuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9sb2ctY29uZmlndXJhdGlvblwiO1xuY29uc3QgTkVUV09SSyA9IGJpdGNvcmUuTmV0d29ya3MuYWRkKHtcbiAgbmFtZTogJ2RvaWNoYWluJyxcbiAgYWxpYXM6ICdkb2ljaGFpbicsXG4gIHB1YmtleWhhc2g6IDB4MzQsXG4gIHByaXZhdGVrZXk6IDB4QjQsXG4gIHNjcmlwdGhhc2g6IDEzLFxuICBuZXR3b3JrTWFnaWM6IDB4ZjliZWI0ZmUsXG59KTtcblxuY29uc3QgVmVyaWZ5U2lnbmF0dXJlU2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIGRhdGE6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfSxcbiAgcHVibGljS2V5OiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH0sXG4gIHNpZ25hdHVyZToge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9XG59KTtcblxuY29uc3QgdmVyaWZ5U2lnbmF0dXJlID0gKGRhdGEpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBvdXJEYXRhID0gZGF0YTtcbiAgICBsb2dWZXJpZnkoJ3ZlcmlmeVNpZ25hdHVyZTonLG91ckRhdGEpO1xuICAgIFZlcmlmeVNpZ25hdHVyZVNjaGVtYS52YWxpZGF0ZShvdXJEYXRhKTtcbiAgICBjb25zdCBhZGRyZXNzID0gYml0Y29yZS5BZGRyZXNzLmZyb21QdWJsaWNLZXkobmV3IGJpdGNvcmUuUHVibGljS2V5KG91ckRhdGEucHVibGljS2V5KSwgTkVUV09SSyk7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBNZXNzYWdlKG91ckRhdGEuZGF0YSkudmVyaWZ5KGFkZHJlc3MsIG91ckRhdGEuc2lnbmF0dXJlKTtcbiAgICB9IGNhdGNoKGVycm9yKSB7IGxvZ0Vycm9yKGVycm9yKX1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH0gY2F0Y2goZXhjZXB0aW9uKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZG9pY2hhaW4udmVyaWZ5U2lnbmF0dXJlLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IHZlcmlmeVNpZ25hdHVyZTtcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tICdzaW1wbC1zY2hlbWEnO1xuaW1wb3J0IHsgT3B0SW5zIH0gZnJvbSAnLi4vLi4vLi4vYXBpL29wdC1pbnMvb3B0LWlucy5qcyc7XG5pbXBvcnQgeyBTZW5kZXJzIH0gZnJvbSAnLi4vLi4vLi4vYXBpL3NlbmRlcnMvc2VuZGVycy5qcyc7XG5pbXBvcnQgeyBSZWNpcGllbnRzIH0gZnJvbSAnLi4vLi4vLi4vYXBpL3JlY2lwaWVudHMvcmVjaXBpZW50cy5qcyc7XG5pbXBvcnQgZ2VuZXJhdGVOYW1lSWQgZnJvbSAnLi9nZW5lcmF0ZV9uYW1lLWlkLmpzJztcbmltcG9ydCBnZXRTaWduYXR1cmUgZnJvbSAnLi9nZXRfc2lnbmF0dXJlLmpzJztcbmltcG9ydCBnZXREYXRhSGFzaCBmcm9tICcuL2dldF9kYXRhLWhhc2guanMnO1xuaW1wb3J0IGFkZEluc2VydEJsb2NrY2hhaW5Kb2IgZnJvbSAnLi4vam9icy9hZGRfaW5zZXJ0X2Jsb2NrY2hhaW4uanMnO1xuaW1wb3J0IHtsb2dTZW5kfSBmcm9tIFwiLi4vLi4vLi4vc3RhcnR1cC9zZXJ2ZXIvbG9nLWNvbmZpZ3VyYXRpb25cIjtcblxuY29uc3QgV3JpdGVUb0Jsb2NrY2hhaW5TY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgaWQ6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfVxufSk7XG5cbmNvbnN0IHdyaXRlVG9CbG9ja2NoYWluID0gKGRhdGEpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBvdXJEYXRhID0gZGF0YTtcbiAgICBXcml0ZVRvQmxvY2tjaGFpblNjaGVtYS52YWxpZGF0ZShvdXJEYXRhKTtcblxuICAgIGNvbnN0IG9wdEluID0gT3B0SW5zLmZpbmRPbmUoe19pZDogZGF0YS5pZH0pO1xuICAgIGNvbnN0IHJlY2lwaWVudCA9IFJlY2lwaWVudHMuZmluZE9uZSh7X2lkOiBvcHRJbi5yZWNpcGllbnR9KTtcbiAgICBjb25zdCBzZW5kZXIgPSBTZW5kZXJzLmZpbmRPbmUoe19pZDogb3B0SW4uc2VuZGVyfSk7XG4gICAgbG9nU2VuZChcIm9wdEluIGRhdGE6XCIse2luZGV4Om91ckRhdGEuaW5kZXgsIG9wdEluOm9wdEluLHJlY2lwaWVudDpyZWNpcGllbnQsc2VuZGVyOiBzZW5kZXJ9KTtcblxuXG4gICAgY29uc3QgbmFtZUlkID0gZ2VuZXJhdGVOYW1lSWQoe2lkOiBkYXRhLmlkLGluZGV4Om9wdEluLmluZGV4LG1hc3RlckRvaTpvcHRJbi5tYXN0ZXJEb2kgfSk7XG4gICAgY29uc3Qgc2lnbmF0dXJlID0gZ2V0U2lnbmF0dXJlKHttZXNzYWdlOiByZWNpcGllbnQuZW1haWwrc2VuZGVyLmVtYWlsLCBwcml2YXRlS2V5OiByZWNpcGllbnQucHJpdmF0ZUtleX0pO1xuICAgIGxvZ1NlbmQoXCJnZW5lcmF0ZWQgc2lnbmF0dXJlIGZyb20gZW1haWwgcmVjaXBpZW50IGFuZCBzZW5kZXI6XCIsc2lnbmF0dXJlKTtcblxuICAgIGxldCBkYXRhSGFzaCA9IFwiXCI7XG5cbiAgICBpZihvcHRJbi5kYXRhKSB7XG4gICAgICBkYXRhSGFzaCA9IGdldERhdGFIYXNoKHtkYXRhOiBvcHRJbi5kYXRhfSk7XG4gICAgICBsb2dTZW5kKFwiZ2VuZXJhdGVkIGRhdGFoYXNoIGZyb20gZ2l2ZW4gZGF0YTpcIixkYXRhSGFzaCk7XG4gICAgfVxuXG4gICAgY29uc3QgcGFydHMgPSByZWNpcGllbnQuZW1haWwuc3BsaXQoXCJAXCIpO1xuICAgIGNvbnN0IGRvbWFpbiA9IHBhcnRzW3BhcnRzLmxlbmd0aC0xXTtcbiAgICBsb2dTZW5kKFwiZW1haWwgZG9tYWluIGZvciBwdWJsaWNLZXkgcmVxdWVzdCBpczpcIixkb21haW4pO1xuICAgIGFkZEluc2VydEJsb2NrY2hhaW5Kb2Ioe1xuICAgICAgbmFtZUlkOiBuYW1lSWQsXG4gICAgICBzaWduYXR1cmU6IHNpZ25hdHVyZSxcbiAgICAgIGRhdGFIYXNoOiBkYXRhSGFzaCxcbiAgICAgIGRvbWFpbjogZG9tYWluLFxuICAgICAgc29pRGF0ZTogb3B0SW4uY3JlYXRlZEF0XG4gICAgfSlcbiAgfSBjYXRjaCAoZXhjZXB0aW9uKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZG9pY2hhaW4ud3JpdGVUb0Jsb2NrY2hhaW4uZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgd3JpdGVUb0Jsb2NrY2hhaW5cbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tICdzaW1wbC1zY2hlbWEnO1xuaW1wb3J0IHsgSGFzaElkcyB9IGZyb20gJy4uLy4uLy4uL3N0YXJ0dXAvc2VydmVyL2VtYWlsLWNvbmZpZ3VyYXRpb24uanMnO1xuXG5jb25zdCBEZWNvZGVEb2lIYXNoU2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIGhhc2g6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfVxufSk7XG5cbmNvbnN0IGRlY29kZURvaUhhc2ggPSAoaGFzaCkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IG91ckhhc2ggPSBoYXNoO1xuICAgIERlY29kZURvaUhhc2hTY2hlbWEudmFsaWRhdGUob3VySGFzaCk7XG4gICAgY29uc3QgaGV4ID0gSGFzaElkcy5kZWNvZGVIZXgob3VySGFzaC5oYXNoKTtcbiAgICBpZighaGV4IHx8IGhleCA9PT0gJycpIHRocm93IFwiV3JvbmcgaGFzaFwiO1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBvYmogPSBKU09OLnBhcnNlKEJ1ZmZlcihoZXgsICdoZXgnKS50b1N0cmluZygnYXNjaWknKSk7XG4gICAgICByZXR1cm4gb2JqO1xuICAgIH0gY2F0Y2goZXhjZXB0aW9uKSB7dGhyb3cgXCJXcm9uZyBoYXNoXCI7fVxuICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlbWFpbHMuZGVjb2RlX2RvaS1oYXNoLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGRlY29kZURvaUhhc2g7XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcbmltcG9ydCB7IEhhc2hJZHMgfSBmcm9tICcuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9lbWFpbC1jb25maWd1cmF0aW9uLmpzJztcblxuY29uc3QgR2VuZXJhdGVEb2lIYXNoU2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIGlkOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH0sXG4gIHRva2VuOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH0sXG4gIHJlZGlyZWN0OiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH1cbn0pO1xuXG5jb25zdCBnZW5lcmF0ZURvaUhhc2ggPSAob3B0SW4pID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBvdXJPcHRJbiA9IG9wdEluO1xuICAgIEdlbmVyYXRlRG9pSGFzaFNjaGVtYS52YWxpZGF0ZShvdXJPcHRJbik7XG5cbiAgICBjb25zdCBqc29uID0gSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgaWQ6IG91ck9wdEluLmlkLFxuICAgICAgdG9rZW46IG91ck9wdEluLnRva2VuLFxuICAgICAgcmVkaXJlY3Q6IG91ck9wdEluLnJlZGlyZWN0XG4gICAgfSk7XG5cbiAgICBjb25zdCBoZXggPSBCdWZmZXIoanNvbikudG9TdHJpbmcoJ2hleCcpO1xuICAgIGNvbnN0IGhhc2ggPSBIYXNoSWRzLmVuY29kZUhleChoZXgpO1xuICAgIHJldHVybiBoYXNoO1xuICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlbWFpbHMuZ2VuZXJhdGVfZG9pLWhhc2guZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgZ2VuZXJhdGVEb2lIYXNoO1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XG5pbXBvcnQge2xvZ0NvbmZpcm19IGZyb20gXCIuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9sb2ctY29uZmlndXJhdGlvblwiO1xuXG5jb25zdCBQTEFDRUhPTERFUl9SRUdFWCA9IC9cXCR7KFtcXHddKil9L2c7XG5jb25zdCBQYXJzZVRlbXBsYXRlU2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIHRlbXBsYXRlOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICB9LFxuICBkYXRhOiB7XG4gICAgdHlwZTogT2JqZWN0LFxuICAgIGJsYWNrYm94OiB0cnVlXG4gIH1cbn0pO1xuXG5jb25zdCBwYXJzZVRlbXBsYXRlID0gKGRhdGEpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBvdXJEYXRhID0gZGF0YTtcbiAgICAvL2xvZ0NvbmZpcm0oJ3BhcnNlVGVtcGxhdGU6JyxvdXJEYXRhKTtcblxuICAgIFBhcnNlVGVtcGxhdGVTY2hlbWEudmFsaWRhdGUob3VyRGF0YSk7XG4gICAgbG9nQ29uZmlybSgnUGFyc2VUZW1wbGF0ZVNjaGVtYSB2YWxpZGF0ZWQnKTtcblxuICAgIHZhciBfbWF0Y2g7XG4gICAgdmFyIHRlbXBsYXRlID0gb3VyRGF0YS50ZW1wbGF0ZTtcbiAgIC8vbG9nQ29uZmlybSgnZG9pbmcgc29tZSByZWdleCB3aXRoIHRlbXBsYXRlOicsdGVtcGxhdGUpO1xuXG4gICAgZG8ge1xuICAgICAgX21hdGNoID0gUExBQ0VIT0xERVJfUkVHRVguZXhlYyh0ZW1wbGF0ZSk7XG4gICAgICBpZihfbWF0Y2gpIHRlbXBsYXRlID0gX3JlcGxhY2VQbGFjZWhvbGRlcih0ZW1wbGF0ZSwgX21hdGNoLCBvdXJEYXRhLmRhdGFbX21hdGNoWzFdXSk7XG4gICAgfSB3aGlsZSAoX21hdGNoKTtcbiAgICByZXR1cm4gdGVtcGxhdGU7XG4gIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2VtYWlscy5wYXJzZVRlbXBsYXRlLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIF9yZXBsYWNlUGxhY2Vob2xkZXIodGVtcGxhdGUsIF9tYXRjaCwgcmVwbGFjZSkge1xuICB2YXIgcmVwID0gcmVwbGFjZTtcbiAgaWYocmVwbGFjZSA9PT0gdW5kZWZpbmVkKSByZXAgPSBcIlwiO1xuICByZXR1cm4gdGVtcGxhdGUuc3Vic3RyaW5nKDAsIF9tYXRjaC5pbmRleCkrcmVwK3RlbXBsYXRlLnN1YnN0cmluZyhfbWF0Y2guaW5kZXgrX21hdGNoWzBdLmxlbmd0aCk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHBhcnNlVGVtcGxhdGU7XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcbmltcG9ydCB7bG9nQ29uZmlybX0gZnJvbSBcIi4uLy4uLy4uL3N0YXJ0dXAvc2VydmVyL2xvZy1jb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBET0lfTUFJTF9ERUZBVUxUX0VNQUlMX0ZST00gfSBmcm9tICcuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9lbWFpbC1jb25maWd1cmF0aW9uLmpzJztcblxuY29uc3QgU2VuZE1haWxTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgZnJvbToge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICByZWdFeDogU2ltcGxlU2NoZW1hLlJlZ0V4LkVtYWlsXG4gIH0sXG4gIHRvOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIHJlZ0V4OiBTaW1wbGVTY2hlbWEuUmVnRXguRW1haWxcbiAgfSxcbiAgc3ViamVjdDoge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgfSxcbiAgbWVzc2FnZToge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgfSxcbiAgcmV0dXJuUGF0aDoge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICByZWdFeDogU2ltcGxlU2NoZW1hLlJlZ0V4LkVtYWlsXG4gIH1cbn0pO1xuXG5jb25zdCBzZW5kTWFpbCA9IChtYWlsKSA9PiB7XG4gIHRyeSB7XG5cbiAgICBtYWlsLmZyb20gPSBET0lfTUFJTF9ERUZBVUxUX0VNQUlMX0ZST007XG5cbiAgICBjb25zdCBvdXJNYWlsID0gbWFpbDtcbiAgICBsb2dDb25maXJtKCdzZW5kaW5nIGVtYWlsIHdpdGggZGF0YTonLHt0bzptYWlsLnRvLCBzdWJqZWN0Om1haWwuc3ViamVjdH0pO1xuICAgIFNlbmRNYWlsU2NoZW1hLnZhbGlkYXRlKG91ck1haWwpO1xuICAgIC8vVE9ETzogVGV4dCBmYWxsYmFja1xuICAgIEVtYWlsLnNlbmQoe1xuICAgICAgZnJvbTogbWFpbC5mcm9tLFxuICAgICAgdG86IG1haWwudG8sXG4gICAgICBzdWJqZWN0OiBtYWlsLnN1YmplY3QsXG4gICAgICBodG1sOiBtYWlsLm1lc3NhZ2UsXG4gICAgICBoZWFkZXJzOiB7XG4gICAgICAgICdSZXR1cm4tUGF0aCc6IG1haWwucmV0dXJuUGF0aCxcbiAgICAgIH1cbiAgICB9KTtcblxuICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlbWFpbHMuc2VuZC5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBzZW5kTWFpbDtcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IHsgSm9iIH0gZnJvbSAnbWV0ZW9yL3ZzaXZzaTpqb2ItY29sbGVjdGlvbic7XG5pbXBvcnQgeyBCbG9ja2NoYWluSm9icyB9IGZyb20gJy4uLy4uLy4uLy4uL3NlcnZlci9hcGkvYmxvY2tjaGFpbl9qb2JzLmpzJztcblxuY29uc3QgYWRkQ2hlY2tOZXdUcmFuc2FjdGlvbnNCbG9ja2NoYWluSm9iID0gKCkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IGpvYiA9IG5ldyBKb2IoQmxvY2tjaGFpbkpvYnMsICdjaGVja05ld1RyYW5zYWN0aW9uJywge30pO1xuICAgIGpvYi5yZXRyeSh7cmV0cmllczogNjAsIHdhaXQ6IDE1KjEwMDAgfSkuc2F2ZSh7Y2FuY2VsUmVwZWF0czogdHJ1ZX0pO1xuICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdqb2JzLmFkZENoZWNrTmV3VHJhbnNhY3Rpb25zQmxvY2tjaGFpbi5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBhZGRDaGVja05ld1RyYW5zYWN0aW9uc0Jsb2NrY2hhaW5Kb2I7XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcbmltcG9ydCB7IEpvYiB9IGZyb20gJ21ldGVvci92c2l2c2k6am9iLWNvbGxlY3Rpb24nO1xuaW1wb3J0IHsgREFwcEpvYnMgfSBmcm9tICcuLi8uLi8uLi8uLi9zZXJ2ZXIvYXBpL2RhcHBfam9icy5qcyc7XG5cbmNvbnN0IEFkZEZldGNoRG9pTWFpbERhdGFKb2JTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgbmFtZToge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9LFxuICBkb21haW46IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfVxufSk7XG5cbmNvbnN0IGFkZEZldGNoRG9pTWFpbERhdGFKb2IgPSAoZGF0YSkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IG91ckRhdGEgPSBkYXRhO1xuICAgIEFkZEZldGNoRG9pTWFpbERhdGFKb2JTY2hlbWEudmFsaWRhdGUob3VyRGF0YSk7XG4gICAgY29uc3Qgam9iID0gbmV3IEpvYihEQXBwSm9icywgJ2ZldGNoRG9pTWFpbERhdGEnLCBvdXJEYXRhKTtcbiAgICBqb2IucmV0cnkoe3JldHJpZXM6IDUsIHdhaXQ6IDEqMTAqMTAwMCB9KS5zYXZlKCk7IC8vY2hlY2sgZXZlcnkgMTAgc2VjcyA1IHRpbWVzXG4gIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2pvYnMuYWRkRmV0Y2hEb2lNYWlsRGF0YS5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBhZGRGZXRjaERvaU1haWxEYXRhSm9iO1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgeyBKb2IgfSBmcm9tICdtZXRlb3IvdnNpdnNpOmpvYi1jb2xsZWN0aW9uJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcbmltcG9ydCB7IEJsb2NrY2hhaW5Kb2JzIH0gZnJvbSAnLi4vLi4vLi4vLi4vc2VydmVyL2FwaS9ibG9ja2NoYWluX2pvYnMuanMnO1xuXG5jb25zdCBBZGRJbnNlcnRCbG9ja2NoYWluSm9iU2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIG5hbWVJZDoge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9LFxuICBzaWduYXR1cmU6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfSxcbiAgZGF0YUhhc2g6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgb3B0aW9uYWw6dHJ1ZVxuICB9LFxuICBkb21haW46IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfSxcbiAgc29pRGF0ZToge1xuICAgIHR5cGU6IERhdGVcbiAgfVxufSk7XG5cbmNvbnN0IGFkZEluc2VydEJsb2NrY2hhaW5Kb2IgPSAoZW50cnkpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBvdXJFbnRyeSA9IGVudHJ5O1xuICAgIEFkZEluc2VydEJsb2NrY2hhaW5Kb2JTY2hlbWEudmFsaWRhdGUob3VyRW50cnkpO1xuICAgIGNvbnN0IGpvYiA9IG5ldyBKb2IoQmxvY2tjaGFpbkpvYnMsICdpbnNlcnQnLCBvdXJFbnRyeSk7XG4gICAgam9iLnJldHJ5KHtyZXRyaWVzOiAxMCwgd2FpdDogMyo2MCoxMDAwIH0pLnNhdmUoKTsgLy9jaGVjayBldmVyeSAxMHNlYyBmb3IgMWhcbiAgfSBjYXRjaCAoZXhjZXB0aW9uKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignam9icy5hZGRJbnNlcnRCbG9ja2NoYWluLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGFkZEluc2VydEJsb2NrY2hhaW5Kb2I7XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCB7IEpvYiB9IGZyb20gJ21ldGVvci92c2l2c2k6am9iLWNvbGxlY3Rpb24nO1xuaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tICdzaW1wbC1zY2hlbWEnO1xuaW1wb3J0IHsgTWFpbEpvYnMgfSBmcm9tICcuLi8uLi8uLi8uLi9zZXJ2ZXIvYXBpL21haWxfam9icy5qcyc7XG5cbmNvbnN0IEFkZFNlbmRNYWlsSm9iU2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIC8qZnJvbToge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICByZWdFeDogU2ltcGxlU2NoZW1hLlJlZ0V4LkVtYWlsXG4gIH0sKi9cbiAgdG86IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgcmVnRXg6IFNpbXBsZVNjaGVtYS5SZWdFeC5FbWFpbFxuICB9LFxuICBzdWJqZWN0OiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICB9LFxuICBtZXNzYWdlOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICB9LFxuICByZXR1cm5QYXRoOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIHJlZ0V4OiBTaW1wbGVTY2hlbWEuUmVnRXguRW1haWxcbiAgfVxufSk7XG5cbmNvbnN0IGFkZFNlbmRNYWlsSm9iID0gKG1haWwpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBvdXJNYWlsID0gbWFpbDtcbiAgICBBZGRTZW5kTWFpbEpvYlNjaGVtYS52YWxpZGF0ZShvdXJNYWlsKTtcbiAgICBjb25zdCBqb2IgPSBuZXcgSm9iKE1haWxKb2JzLCAnc2VuZCcsIG91ck1haWwpO1xuICAgIGpvYi5yZXRyeSh7cmV0cmllczogNSwgd2FpdDogNjAqMTAwMCB9KS5zYXZlKCk7XG4gIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2pvYnMuYWRkU2VuZE1haWwuZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgYWRkU2VuZE1haWxKb2I7XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcbmltcG9ydCB7IEpvYiB9IGZyb20gJ21ldGVvci92c2l2c2k6am9iLWNvbGxlY3Rpb24nO1xuaW1wb3J0IHsgQmxvY2tjaGFpbkpvYnMgfSBmcm9tICcuLi8uLi8uLi8uLi9zZXJ2ZXIvYXBpL2Jsb2NrY2hhaW5fam9icy5qcyc7XG5cbmNvbnN0IEFkZFVwZGF0ZUJsb2NrY2hhaW5Kb2JTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgbmFtZUlkOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH0sXG4gIHZhbHVlOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH0sXG4gIGZyb21Ib3N0VXJsOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH0sXG4gIGhvc3Q6IHtcbiAgICAgIHR5cGU6IFN0cmluZ1xuICB9XG59KTtcblxuY29uc3QgYWRkVXBkYXRlQmxvY2tjaGFpbkpvYiA9IChlbnRyeSkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IG91ckVudHJ5ID0gZW50cnk7XG4gICAgQWRkVXBkYXRlQmxvY2tjaGFpbkpvYlNjaGVtYS52YWxpZGF0ZShvdXJFbnRyeSk7XG4gICAgY29uc3Qgam9iID0gbmV3IEpvYihCbG9ja2NoYWluSm9icywgJ3VwZGF0ZScsIG91ckVudHJ5KTtcbiAgICBqb2IucmV0cnkoe3JldHJpZXM6IDM2MCwgd2FpdDogMSoxMCoxMDAwIH0pLnNhdmUoKTtcbiAgfSBjYXRjaCAoZXhjZXB0aW9uKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignam9icy5hZGRVcGRhdGVCbG9ja2NoYWluLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGFkZFVwZGF0ZUJsb2NrY2hhaW5Kb2I7XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCBpMThuIGZyb20gJ21ldGVvci91bml2ZXJzZTppMThuJztcblxuLy8gdW5pdmVyc2U6aTE4biBvbmx5IGJ1bmRsZXMgdGhlIGRlZmF1bHQgbGFuZ3VhZ2Ugb24gdGhlIGNsaWVudCBzaWRlLlxuLy8gVG8gZ2V0IGEgbGlzdCBvZiBhbGwgYXZpYWxibGUgbGFuZ3VhZ2VzIHdpdGggYXQgbGVhc3Qgb25lIHRyYW5zbGF0aW9uLFxuLy8gaTE4bi5nZXRMYW5ndWFnZXMoKSBtdXN0IGJlIGNhbGxlZCBzZXJ2ZXIgc2lkZS5cbmNvbnN0IGdldExhbmd1YWdlcyA9ICgpID0+IHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gaTE4bi5nZXRMYW5ndWFnZXMoKTtcbiAgfSBjYXRjaCAoZXhjZXB0aW9uKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignbGFuZ3VhZ2VzLmdldC5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBnZXRMYW5ndWFnZXM7XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcbmltcG9ydCB7IE1ldGEgfSBmcm9tICcuLi8uLi8uLi9hcGkvbWV0YS9tZXRhLmpzJztcblxuY29uc3QgQWRkT3JVcGRhdGVNZXRhU2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIGtleToge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9LFxuICB2YWx1ZToge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9XG59KTtcblxuY29uc3QgYWRkT3JVcGRhdGVNZXRhID0gKGRhdGEpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBvdXJEYXRhID0gZGF0YTtcbiAgICBBZGRPclVwZGF0ZU1ldGFTY2hlbWEudmFsaWRhdGUob3VyRGF0YSk7XG4gICAgY29uc3QgbWV0YSA9IE1ldGEuZmluZE9uZSh7a2V5OiBvdXJEYXRhLmtleX0pO1xuICAgIGlmKG1ldGEgIT09IHVuZGVmaW5lZCkgTWV0YS51cGRhdGUoe19pZCA6IG1ldGEuX2lkfSwgeyRzZXQ6IHtcbiAgICAgIHZhbHVlOiBvdXJEYXRhLnZhbHVlXG4gICAgfX0pO1xuICAgIGVsc2UgcmV0dXJuIE1ldGEuaW5zZXJ0KHtcbiAgICAgIGtleTogb3VyRGF0YS5rZXksXG4gICAgICB2YWx1ZTogb3VyRGF0YS52YWx1ZVxuICAgIH0pXG4gIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ21ldGEuYWRkT3JVcGRhdGUuZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgYWRkT3JVcGRhdGVNZXRhO1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XG5pbXBvcnQgeyBPcHRJbnMgfSBmcm9tICcuLi8uLi8uLi9hcGkvb3B0LWlucy9vcHQtaW5zLmpzJztcblxuY29uc3QgQWRkT3B0SW5TY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgbmFtZToge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9XG59KTtcblxuY29uc3QgYWRkT3B0SW4gPSAob3B0SW4pID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBvdXJPcHRJbiA9IG9wdEluO1xuICAgIEFkZE9wdEluU2NoZW1hLnZhbGlkYXRlKG91ck9wdEluKTtcbiAgICBjb25zdCBvcHRJbnMgPSBPcHRJbnMuZmluZCh7bmFtZUlkOiBvdXJPcHRJbi5uYW1lfSkuZmV0Y2goKTtcbiAgICBpZihvcHRJbnMubGVuZ3RoID4gMCkgcmV0dXJuIG9wdEluc1swXS5faWQ7XG4gICAgY29uc3Qgb3B0SW5JZCA9IE9wdElucy5pbnNlcnQoe1xuICAgICAgbmFtZUlkOiBvdXJPcHRJbi5uYW1lXG4gICAgfSk7XG4gICAgcmV0dXJuIG9wdEluSWQ7XG4gIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ29wdC1pbnMuYWRkLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGFkZE9wdEluO1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XG5pbXBvcnQgYWRkUmVjaXBpZW50IGZyb20gJy4uL3JlY2lwaWVudHMvYWRkLmpzJztcbmltcG9ydCBhZGRTZW5kZXIgZnJvbSAnLi4vc2VuZGVycy9hZGQuanMnO1xuaW1wb3J0IHsgT3B0SW5zIH0gZnJvbSAnLi4vLi4vLi4vYXBpL29wdC1pbnMvb3B0LWlucy5qcyc7XG5pbXBvcnQgd3JpdGVUb0Jsb2NrY2hhaW4gZnJvbSAnLi4vZG9pY2hhaW4vd3JpdGVfdG9fYmxvY2tjaGFpbi5qcyc7XG5pbXBvcnQge2xvZ0Vycm9yLCBsb2dTZW5kfSBmcm9tIFwiLi4vLi4vLi4vc3RhcnR1cC9zZXJ2ZXIvbG9nLWNvbmZpZ3VyYXRpb25cIjtcblxuXG5jb25zdCBBZGRPcHRJblNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICByZWNpcGllbnRfbWFpbDoge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICByZWdFeDogU2ltcGxlU2NoZW1hLlJlZ0V4LkVtYWlsXG4gIH0sXG4gIHNlbmRlcl9tYWlsOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIHJlZ0V4OiBTaW1wbGVTY2hlbWEuUmVnRXguRW1haWxcbiAgfSxcbiAgZGF0YToge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICBvcHRpb25hbDogdHJ1ZVxuICB9LFxuICBtYXN0ZXJfZG9pOiB7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICBvcHRpb25hbDogdHJ1ZVxuICB9LFxuICBpbmRleDoge1xuICAgICAgdHlwZTogU2ltcGxlU2NoZW1hLkludGVnZXIsXG4gICAgICBvcHRpb25hbDogdHJ1ZVxuICB9LFxuICBvd25lcklkOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIHJlZ0V4OiBTaW1wbGVTY2hlbWEuUmVnRXguaWRcbiAgfVxufSk7XG5cbmNvbnN0IGFkZE9wdEluID0gKG9wdEluKSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3Qgb3VyT3B0SW4gPSBvcHRJbjtcbiAgICBBZGRPcHRJblNjaGVtYS52YWxpZGF0ZShvdXJPcHRJbik7XG5cbiAgICBjb25zdCByZWNpcGllbnQgPSB7XG4gICAgICBlbWFpbDogb3VyT3B0SW4ucmVjaXBpZW50X21haWxcbiAgICB9XG4gICAgY29uc3QgcmVjaXBpZW50SWQgPSBhZGRSZWNpcGllbnQocmVjaXBpZW50KTtcbiAgICBjb25zdCBzZW5kZXIgPSB7XG4gICAgICBlbWFpbDogb3VyT3B0SW4uc2VuZGVyX21haWxcbiAgICB9XG4gICAgY29uc3Qgc2VuZGVySWQgPSBhZGRTZW5kZXIoc2VuZGVyKTtcbiAgICBcbiAgICBjb25zdCBvcHRJbnMgPSBPcHRJbnMuZmluZCh7cmVjaXBpZW50OiByZWNpcGllbnRJZCwgc2VuZGVyOiBzZW5kZXJJZH0pLmZldGNoKCk7XG4gICAgaWYob3B0SW5zLmxlbmd0aCA+IDApIHJldHVybiBvcHRJbnNbMF0uX2lkOyAvL1RPRE8gd2hlbiBTT0kgYWxyZWFkeSBleGlzdHMgcmVzZW5kIGVtYWlsP1xuXG4gICAgaWYob3VyT3B0SW4uZGF0YSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0cnkge1xuICAgICAgICBKU09OLnBhcnNlKG91ck9wdEluLmRhdGEpO1xuICAgICAgfSBjYXRjaChlcnJvcikge1xuICAgICAgICBsb2dFcnJvcihcIm91ck9wdEluLmRhdGE6XCIsb3VyT3B0SW4uZGF0YSk7XG4gICAgICAgIHRocm93IFwiSW52YWxpZCBkYXRhIGpzb24gXCI7XG4gICAgICB9XG4gICAgfVxuICAgIFxuICAgIGNvbnN0IG9wdEluSWQgPSBPcHRJbnMuaW5zZXJ0KHtcbiAgICAgIHJlY2lwaWVudDogcmVjaXBpZW50SWQsXG4gICAgICBzZW5kZXI6IHNlbmRlcklkLFxuICAgICAgaW5kZXg6IG91ck9wdEluLmluZGV4LFxuICAgICAgbWFzdGVyRG9pIDogb3VyT3B0SW4ubWFzdGVyX2RvaSxcbiAgICAgIGRhdGE6IG91ck9wdEluLmRhdGEsXG4gICAgICBvd25lcklkOiBvdXJPcHRJbi5vd25lcklkXG4gICAgfSk7XG4gICAgbG9nU2VuZChcIm9wdEluIChpbmRleDpcIitvdXJPcHRJbi5pbmRleCtcIiBhZGRlZCB0byBsb2NhbCBkYiB3aXRoIG9wdEluSWRcIixvcHRJbklkKTtcblxuICAgIHdyaXRlVG9CbG9ja2NoYWluKHtpZDogb3B0SW5JZH0pO1xuICAgIHJldHVybiBvcHRJbklkO1xuICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdvcHQtaW5zLmFkZEFuZFdyaXRlVG9CbG9ja2NoYWluLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGFkZE9wdEluO1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XG5pbXBvcnQgeyBDT05GSVJNX0NMSUVOVCwgQ09ORklSTV9BRERSRVNTIH0gZnJvbSAnLi4vLi4vLi4vc3RhcnR1cC9zZXJ2ZXIvZG9pY2hhaW4tY29uZmlndXJhdGlvbi5qcyc7XG5pbXBvcnQgeyBPcHRJbnMgfSBmcm9tICcuLi8uLi8uLi9hcGkvb3B0LWlucy9vcHQtaW5zLmpzJztcbmltcG9ydCB7IERvaWNoYWluRW50cmllcyB9IGZyb20gJy4uLy4uLy4uL2FwaS9kb2ljaGFpbi9lbnRyaWVzLmpzJztcbmltcG9ydCBkZWNvZGVEb2lIYXNoIGZyb20gJy4uL2VtYWlscy9kZWNvZGVfZG9pLWhhc2guanMnO1xuaW1wb3J0IHsgc2lnbk1lc3NhZ2UgfSBmcm9tICcuLi8uLi8uLi8uLi9zZXJ2ZXIvYXBpL2RvaWNoYWluLmpzJztcbmltcG9ydCBhZGRVcGRhdGVCbG9ja2NoYWluSm9iIGZyb20gJy4uL2pvYnMvYWRkX3VwZGF0ZV9ibG9ja2NoYWluLmpzJztcbmltcG9ydCB7bG9nQ29uZmlybX0gZnJvbSBcIi4uLy4uLy4uL3N0YXJ0dXAvc2VydmVyL2xvZy1jb25maWd1cmF0aW9uXCI7XG5cbmNvbnN0IENvbmZpcm1PcHRJblNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICBob3N0OiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH0sXG4gIGhhc2g6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfVxufSk7XG5cbmNvbnN0IGNvbmZpcm1PcHRJbiA9IChyZXF1ZXN0KSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3Qgb3VyUmVxdWVzdCA9IHJlcXVlc3Q7XG4gICAgQ29uZmlybU9wdEluU2NoZW1hLnZhbGlkYXRlKG91clJlcXVlc3QpO1xuICAgIGNvbnN0IGRlY29kZWQgPSBkZWNvZGVEb2lIYXNoKHtoYXNoOiByZXF1ZXN0Lmhhc2h9KTtcbiAgICBjb25zdCBvcHRJbiA9IE9wdElucy5maW5kT25lKHtfaWQ6IGRlY29kZWQuaWR9KTtcbiAgICBpZihvcHRJbiA9PT0gdW5kZWZpbmVkIHx8IG9wdEluLmNvbmZpcm1hdGlvblRva2VuICE9PSBkZWNvZGVkLnRva2VuKSB0aHJvdyBcIkludmFsaWQgaGFzaFwiO1xuICAgIGNvbnN0IGNvbmZpcm1lZEF0ID0gbmV3IERhdGUoKTtcblxuICAgIE9wdElucy51cGRhdGUoe19pZCA6IG9wdEluLl9pZH0seyRzZXQ6e2NvbmZpcm1lZEF0OiBjb25maXJtZWRBdCwgY29uZmlybWVkQnk6IG91clJlcXVlc3QuaG9zdH0sICR1bnNldDoge2NvbmZpcm1hdGlvblRva2VuOiBcIlwifX0pO1xuXG4gICAgLy9UT0RPIGhlcmUgZmluZCBhbGwgRG9pY2hhaW5FbnRyaWVzIGluIHRoZSBsb2NhbCBkYXRhYmFzZSAgYW5kIGJsb2NrY2hhaW4gd2l0aCB0aGUgc2FtZSBtYXN0ZXJEb2lcbiAgICBjb25zdCBlbnRyaWVzID0gRG9pY2hhaW5FbnRyaWVzLmZpbmQoeyRvcjogW3tuYW1lOiBvcHRJbi5uYW1lSWR9LCB7bWFzdGVyRG9pOiBvcHRJbi5uYW1lSWR9XX0pO1xuICAgIGlmKGVudHJpZXMgPT09IHVuZGVmaW5lZCkgdGhyb3cgXCJEb2ljaGFpbiBlbnRyeS9lbnRyaWVzIG5vdCBmb3VuZFwiO1xuXG4gICAgZW50cmllcy5mb3JFYWNoKGVudHJ5ID0+IHtcbiAgICAgICAgbG9nQ29uZmlybSgnY29uZmlybWluZyBEb2lDaGFpbkVudHJ5OicsZW50cnkpO1xuXG4gICAgICAgIGNvbnN0IHZhbHVlID0gSlNPTi5wYXJzZShlbnRyeS52YWx1ZSk7XG4gICAgICAgIGxvZ0NvbmZpcm0oJ2dldFNpZ25hdHVyZSAob25seSBvZiB2YWx1ZSEpJywgdmFsdWUpO1xuXG4gICAgICAgIGNvbnN0IGRvaVNpZ25hdHVyZSA9IHNpZ25NZXNzYWdlKENPTkZJUk1fQ0xJRU5ULCBDT05GSVJNX0FERFJFU1MsIHZhbHVlLnNpZ25hdHVyZSk7XG4gICAgICAgIGxvZ0NvbmZpcm0oJ2dvdCBkb2lTaWduYXR1cmU6Jyxkb2lTaWduYXR1cmUpO1xuICAgICAgICBjb25zdCBmcm9tSG9zdFVybCA9IHZhbHVlLmZyb207XG5cbiAgICAgICAgZGVsZXRlIHZhbHVlLmZyb207XG4gICAgICAgIHZhbHVlLmRvaVRpbWVzdGFtcCA9IGNvbmZpcm1lZEF0LnRvSVNPU3RyaW5nKCk7XG4gICAgICAgIHZhbHVlLmRvaVNpZ25hdHVyZSA9IGRvaVNpZ25hdHVyZTtcbiAgICAgICAgY29uc3QganNvblZhbHVlID0gSlNPTi5zdHJpbmdpZnkodmFsdWUpO1xuICAgICAgICBsb2dDb25maXJtKCd1cGRhdGluZyBEb2ljaGFpbiBuYW1lSWQ6JytvcHRJbi5uYW1lSWQrJyB3aXRoIHZhbHVlOicsanNvblZhbHVlKTtcblxuICAgICAgICBhZGRVcGRhdGVCbG9ja2NoYWluSm9iKHtcbiAgICAgICAgICAgIG5hbWVJZDogZW50cnkubmFtZSxcbiAgICAgICAgICAgIHZhbHVlOiBqc29uVmFsdWUsXG4gICAgICAgICAgICBmcm9tSG9zdFVybDogZnJvbUhvc3RVcmwsXG4gICAgICAgICAgICBob3N0OiBvdXJSZXF1ZXN0Lmhvc3RcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gICAgbG9nQ29uZmlybSgncmVkaXJlY3RpbmcgdXNlciB0bzonLGRlY29kZWQucmVkaXJlY3QpO1xuICAgIHJldHVybiBkZWNvZGVkLnJlZGlyZWN0O1xuICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdvcHQtaW5zLmNvbmZpcm0uZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgY29uZmlybU9wdEluXG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcbmltcG9ydCB7IHJhbmRvbUJ5dGVzIH0gZnJvbSAnY3J5cHRvJztcbmltcG9ydCB7IE9wdElucyB9IGZyb20gJy4uLy4uLy4uL2FwaS9vcHQtaW5zL29wdC1pbnMuanMnO1xuXG5jb25zdCBHZW5lcmF0ZURvaVRva2VuU2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIGlkOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH1cbn0pO1xuXG5jb25zdCBnZW5lcmF0ZURvaVRva2VuID0gKG9wdEluKSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3Qgb3VyT3B0SW4gPSBvcHRJbjtcbiAgICBHZW5lcmF0ZURvaVRva2VuU2NoZW1hLnZhbGlkYXRlKG91ck9wdEluKTtcbiAgICBjb25zdCB0b2tlbiA9IHJhbmRvbUJ5dGVzKDMyKS50b1N0cmluZygnaGV4Jyk7XG4gICAgT3B0SW5zLnVwZGF0ZSh7X2lkIDogb3VyT3B0SW4uaWR9LHskc2V0Ontjb25maXJtYXRpb25Ub2tlbjogdG9rZW59fSk7XG4gICAgcmV0dXJuIHRva2VuO1xuICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdvcHQtaW5zLmdlbmVyYXRlX2RvaS10b2tlbi5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBnZW5lcmF0ZURvaVRva2VuXG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcbmltcG9ydCB7IE9wdElucyB9IGZyb20gJy4uLy4uLy4uL2FwaS9vcHQtaW5zL29wdC1pbnMuanMnO1xuaW1wb3J0IHsgUmVjaXBpZW50cyB9IGZyb20gJy4uLy4uLy4uL2FwaS9yZWNpcGllbnRzL3JlY2lwaWVudHMuanMnO1xuaW1wb3J0IHZlcmlmeVNpZ25hdHVyZSBmcm9tICcuLi9kb2ljaGFpbi92ZXJpZnlfc2lnbmF0dXJlLmpzJztcbmltcG9ydCB7bG9nU2VuZH0gZnJvbSBcIi4uLy4uLy4uL3N0YXJ0dXAvc2VydmVyL2xvZy1jb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgZ2V0UHVibGljS2V5QW5kQWRkcmVzcyBmcm9tIFwiLi4vZG9pY2hhaW4vZ2V0X3B1YmxpY2tleV9hbmRfYWRkcmVzc19ieV9kb21haW5cIjtcblxuY29uc3QgVXBkYXRlT3B0SW5TdGF0dXNTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgbmFtZUlkOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH0sXG4gIHNpZ25hdHVyZToge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9LFxuICBob3N0OiB7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICBvcHRpb25hbDogdHJ1ZVxuICB9XG59KTtcblxuXG5jb25zdCB1cGRhdGVPcHRJblN0YXR1cyA9IChkYXRhKSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3Qgb3VyRGF0YSA9IGRhdGE7XG4gICAgbG9nU2VuZCgnY29uZmlybSBkQXBwIGNvbmZpcm1zIG9wdEluOicsSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xuICAgIFVwZGF0ZU9wdEluU3RhdHVzU2NoZW1hLnZhbGlkYXRlKG91ckRhdGEpO1xuICAgIGNvbnN0IG9wdEluID0gT3B0SW5zLmZpbmRPbmUoe25hbWVJZDogb3VyRGF0YS5uYW1lSWR9KTtcbiAgICBpZihvcHRJbiA9PT0gdW5kZWZpbmVkKSB0aHJvdyBcIk9wdC1JbiBub3QgZm91bmRcIjtcbiAgICBsb2dTZW5kKCdjb25maXJtIGRBcHAgY29uZmlybXMgb3B0SW46JyxvdXJEYXRhLm5hbWVJZCk7XG5cbiAgICBjb25zdCByZWNpcGllbnQgPSBSZWNpcGllbnRzLmZpbmRPbmUoe19pZDogb3B0SW4ucmVjaXBpZW50fSk7XG4gICAgaWYocmVjaXBpZW50ID09PSB1bmRlZmluZWQpIHRocm93IFwiUmVjaXBpZW50IG5vdCBmb3VuZFwiO1xuICAgIGNvbnN0IHBhcnRzID0gcmVjaXBpZW50LmVtYWlsLnNwbGl0KFwiQFwiKTtcbiAgICBjb25zdCBkb21haW4gPSBwYXJ0c1twYXJ0cy5sZW5ndGgtMV07XG4gICAgY29uc3QgcHVibGljS2V5QW5kQWRkcmVzcyA9IGdldFB1YmxpY0tleUFuZEFkZHJlc3Moe2RvbWFpbjpkb21haW59KTtcblxuICAgIC8vVE9ETyBnZXR0aW5nIGluZm9ybWF0aW9uIGZyb20gQm9iIHRoYXQgYSBjZXJ0YWluIG5hbWVJZCAoRE9JKSBnb3QgY29uZmlybWVkLlxuICAgIGlmKCF2ZXJpZnlTaWduYXR1cmUoe3B1YmxpY0tleTogcHVibGljS2V5QW5kQWRkcmVzcy5wdWJsaWNLZXksIGRhdGE6IG91ckRhdGEubmFtZUlkLCBzaWduYXR1cmU6IG91ckRhdGEuc2lnbmF0dXJlfSkpIHtcbiAgICAgIHRocm93IFwiQWNjZXNzIGRlbmllZFwiO1xuICAgIH1cbiAgICBsb2dTZW5kKCdzaWduYXR1cmUgdmFsaWQgZm9yIHB1YmxpY0tleScsIHB1YmxpY0tleUFuZEFkZHJlc3MucHVibGljS2V5KTtcblxuICAgIE9wdElucy51cGRhdGUoe19pZCA6IG9wdEluLl9pZH0seyRzZXQ6e2NvbmZpcm1lZEF0OiBuZXcgRGF0ZSgpLCBjb25maXJtZWRCeTogb3VyRGF0YS5ob3N0fX0pO1xuICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdkYXBwcy5zZW5kLnVwZGF0ZU9wdEluU3RhdHVzLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IHVwZGF0ZU9wdEluU3RhdHVzO1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XG5pbXBvcnQgeyBWRVJJRllfQ0xJRU5UIH0gZnJvbSAnLi4vLi4vLi4vc3RhcnR1cC9zZXJ2ZXIvZG9pY2hhaW4tY29uZmlndXJhdGlvbi5qcyc7XG5pbXBvcnQgeyBuYW1lU2hvdyB9IGZyb20gJy4uLy4uLy4uLy4uL3NlcnZlci9hcGkvZG9pY2hhaW4uanMnO1xuaW1wb3J0IGdldE9wdEluUHJvdmlkZXIgZnJvbSAnLi4vZG5zL2dldF9vcHQtaW4tcHJvdmlkZXIuanMnO1xuaW1wb3J0IGdldE9wdEluS2V5IGZyb20gJy4uL2Rucy9nZXRfb3B0LWluLWtleS5qcyc7XG5pbXBvcnQgdmVyaWZ5U2lnbmF0dXJlIGZyb20gJy4uL2RvaWNoYWluL3ZlcmlmeV9zaWduYXR1cmUuanMnO1xuaW1wb3J0IHtsb2dWZXJpZnl9IGZyb20gXCIuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9sb2ctY29uZmlndXJhdGlvblwiO1xuaW1wb3J0IGdldFB1YmxpY0tleUFuZEFkZHJlc3MgZnJvbSBcIi4uL2RvaWNoYWluL2dldF9wdWJsaWNrZXlfYW5kX2FkZHJlc3NfYnlfZG9tYWluXCI7XG5cbmNvbnN0IFZlcmlmeU9wdEluU2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIHJlY2lwaWVudF9tYWlsOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIHJlZ0V4OiBTaW1wbGVTY2hlbWEuUmVnRXguRW1haWxcbiAgfSxcbiAgc2VuZGVyX21haWw6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgcmVnRXg6IFNpbXBsZVNjaGVtYS5SZWdFeC5FbWFpbFxuICB9LFxuICBuYW1lX2lkOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH0sXG4gIHJlY2lwaWVudF9wdWJsaWNfa2V5OiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH1cbn0pO1xuXG5jb25zdCB2ZXJpZnlPcHRJbiA9IChkYXRhKSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3Qgb3VyRGF0YSA9IGRhdGE7XG4gICAgVmVyaWZ5T3B0SW5TY2hlbWEudmFsaWRhdGUob3VyRGF0YSk7XG4gICAgY29uc3QgZW50cnkgPSBuYW1lU2hvdyhWRVJJRllfQ0xJRU5ULCBvdXJEYXRhLm5hbWVfaWQpO1xuICAgIGlmKGVudHJ5ID09PSB1bmRlZmluZWQpIHJldHVybiBmYWxzZTtcbiAgICBjb25zdCBlbnRyeURhdGEgPSBKU09OLnBhcnNlKGVudHJ5LnZhbHVlKTtcbiAgICBjb25zdCBmaXJzdENoZWNrID0gdmVyaWZ5U2lnbmF0dXJlKHtcbiAgICAgIGRhdGE6IG91ckRhdGEucmVjaXBpZW50X21haWwrb3VyRGF0YS5zZW5kZXJfbWFpbCxcbiAgICAgIHNpZ25hdHVyZTogZW50cnlEYXRhLnNpZ25hdHVyZSxcbiAgICAgIHB1YmxpY0tleTogb3VyRGF0YS5yZWNpcGllbnRfcHVibGljX2tleVxuICAgIH0pXG5cbiAgICBpZighZmlyc3RDaGVjaykgcmV0dXJuIHtmaXJzdENoZWNrOiBmYWxzZX07XG4gICAgY29uc3QgcGFydHMgPSBvdXJEYXRhLnJlY2lwaWVudF9tYWlsLnNwbGl0KFwiQFwiKTsgLy9UT0RPIHB1dCB0aGlzIGludG8gZ2V0UHVibGljS2V5QW5kQWRkcmVzc1xuICAgIGNvbnN0IGRvbWFpbiA9IHBhcnRzW3BhcnRzLmxlbmd0aC0xXTtcbiAgICBjb25zdCBwdWJsaWNLZXlBbmRBZGRyZXNzID0gZ2V0UHVibGljS2V5QW5kQWRkcmVzcyh7ZG9tYWluOiBkb21haW59KTtcblxuICAgIGNvbnN0IHNlY29uZENoZWNrID0gdmVyaWZ5U2lnbmF0dXJlKHtcbiAgICAgIGRhdGE6IGVudHJ5RGF0YS5zaWduYXR1cmUsXG4gICAgICBzaWduYXR1cmU6IGVudHJ5RGF0YS5kb2lTaWduYXR1cmUsXG4gICAgICBwdWJsaWNLZXk6IHB1YmxpY0tleUFuZEFkZHJlc3MucHVibGljS2V5XG4gICAgfSlcblxuICAgIGlmKCFzZWNvbmRDaGVjaykgcmV0dXJuIHtzZWNvbmRDaGVjazogZmFsc2V9O1xuICAgIHJldHVybiB0cnVlO1xuICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdvcHQtaW5zLnZlcmlmeS5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCB2ZXJpZnlPcHRJblxuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XG5pbXBvcnQgeyBSZWNpcGllbnRzIH0gZnJvbSAnLi4vLi4vLi4vYXBpL3JlY2lwaWVudHMvcmVjaXBpZW50cy5qcyc7XG5pbXBvcnQgZ2V0S2V5UGFpciBmcm9tICcuLi9kb2ljaGFpbi9nZXRfa2V5LXBhaXIuanMnO1xuXG5jb25zdCBBZGRSZWNpcGllbnRTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgZW1haWw6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgcmVnRXg6IFNpbXBsZVNjaGVtYS5SZWdFeC5FbWFpbFxuICB9XG59KTtcblxuY29uc3QgYWRkUmVjaXBpZW50ID0gKHJlY2lwaWVudCkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IG91clJlY2lwaWVudCA9IHJlY2lwaWVudDtcbiAgICBBZGRSZWNpcGllbnRTY2hlbWEudmFsaWRhdGUob3VyUmVjaXBpZW50KTtcbiAgICBjb25zdCByZWNpcGllbnRzID0gUmVjaXBpZW50cy5maW5kKHtlbWFpbDogcmVjaXBpZW50LmVtYWlsfSkuZmV0Y2goKTtcbiAgICBpZihyZWNpcGllbnRzLmxlbmd0aCA+IDApIHJldHVybiByZWNpcGllbnRzWzBdLl9pZDtcbiAgICBjb25zdCBrZXlQYWlyID0gZ2V0S2V5UGFpcigpO1xuICAgIHJldHVybiBSZWNpcGllbnRzLmluc2VydCh7XG4gICAgICBlbWFpbDogb3VyUmVjaXBpZW50LmVtYWlsLFxuICAgICAgcHJpdmF0ZUtleToga2V5UGFpci5wcml2YXRlS2V5LFxuICAgICAgcHVibGljS2V5OiBrZXlQYWlyLnB1YmxpY0tleVxuICAgIH0pXG4gIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ3JlY2lwaWVudHMuYWRkLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGFkZFJlY2lwaWVudDtcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tICdzaW1wbC1zY2hlbWEnO1xuaW1wb3J0IHsgU2VuZGVycyB9IGZyb20gJy4uLy4uLy4uL2FwaS9zZW5kZXJzL3NlbmRlcnMuanMnO1xuXG5jb25zdCBBZGRTZW5kZXJTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgZW1haWw6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgcmVnRXg6IFNpbXBsZVNjaGVtYS5SZWdFeC5FbWFpbFxuICB9XG59KTtcblxuY29uc3QgYWRkU2VuZGVyID0gKHNlbmRlcikgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IG91clNlbmRlciA9IHNlbmRlcjtcbiAgICBBZGRTZW5kZXJTY2hlbWEudmFsaWRhdGUob3VyU2VuZGVyKTtcbiAgICBjb25zdCBzZW5kZXJzID0gU2VuZGVycy5maW5kKHtlbWFpbDogc2VuZGVyLmVtYWlsfSkuZmV0Y2goKTtcbiAgICBpZihzZW5kZXJzLmxlbmd0aCA+IDApIHJldHVybiBzZW5kZXJzWzBdLl9pZDtcbiAgICByZXR1cm4gU2VuZGVycy5pbnNlcnQoe1xuICAgICAgZW1haWw6IG91clNlbmRlci5lbWFpbFxuICAgIH0pXG4gIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ3NlbmRlcnMuYWRkLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGFkZFNlbmRlcjtcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuXG5leHBvcnQgZnVuY3Rpb24gaXNEZWJ1ZygpIHtcbiAgaWYoTWV0ZW9yLnNldHRpbmdzICE9PSB1bmRlZmluZWQgJiZcbiAgICAgTWV0ZW9yLnNldHRpbmdzLmFwcCAhPT0gdW5kZWZpbmVkICYmXG4gICAgIE1ldGVvci5zZXR0aW5ncy5hcHAuZGVidWcgIT09IHVuZGVmaW5lZCkgcmV0dXJuIE1ldGVvci5zZXR0aW5ncy5hcHAuZGVidWdcbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNSZWd0ZXN0KCkge1xuICBpZihNZXRlb3Iuc2V0dGluZ3MgIT09IHVuZGVmaW5lZCAmJlxuICAgICBNZXRlb3Iuc2V0dGluZ3MuYXBwICE9PSB1bmRlZmluZWQgJiZcbiAgICAgTWV0ZW9yLnNldHRpbmdzLmFwcC5yZWd0ZXN0ICE9PSB1bmRlZmluZWQpIHJldHVybiBNZXRlb3Iuc2V0dGluZ3MuYXBwLnJlZ3Rlc3RcbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNUZXN0bmV0KCkge1xuICAgIGlmKE1ldGVvci5zZXR0aW5ncyAhPT0gdW5kZWZpbmVkICYmXG4gICAgICAgIE1ldGVvci5zZXR0aW5ncy5hcHAgIT09IHVuZGVmaW5lZCAmJlxuICAgICAgICBNZXRlb3Iuc2V0dGluZ3MuYXBwLnRlc3RuZXQgIT09IHVuZGVmaW5lZCkgcmV0dXJuIE1ldGVvci5zZXR0aW5ncy5hcHAudGVzdG5ldFxuICAgIHJldHVybiBmYWxzZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFVybCgpIHtcbiAgaWYoTWV0ZW9yLnNldHRpbmdzICE9PSB1bmRlZmluZWQgJiZcbiAgICAgTWV0ZW9yLnNldHRpbmdzLmFwcCAhPT0gdW5kZWZpbmVkICYmXG4gICAgIE1ldGVvci5zZXR0aW5ncy5hcHAuaG9zdCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgbGV0IHBvcnQgPSAzMDAwO1xuICAgICAgIGlmKE1ldGVvci5zZXR0aW5ncy5hcHAucG9ydCAhPT0gdW5kZWZpbmVkKSBwb3J0ID0gTWV0ZW9yLnNldHRpbmdzLmFwcC5wb3J0XG4gICAgICAgcmV0dXJuIFwiaHR0cDovL1wiK01ldGVvci5zZXR0aW5ncy5hcHAuaG9zdCtcIjpcIitwb3J0K1wiL1wiO1xuICB9XG4gIHJldHVybiBNZXRlb3IuYWJzb2x1dGVVcmwoKTtcbn1cbiIsImV4cG9ydCBjb25zdCBGQUxMQkFDS19QUk9WSURFUiA9IFwiZG9pY2hhaW4ub3JnXCI7XG4iLCJpbXBvcnQgbmFtZWNvaW4gZnJvbSAnbmFtZWNvaW4nO1xuaW1wb3J0IHsgU0VORF9BUFAsIENPTkZJUk1fQVBQLCBWRVJJRllfQVBQLCBpc0FwcFR5cGUgfSBmcm9tICcuL3R5cGUtY29uZmlndXJhdGlvbi5qcyc7XG5cbnZhciBzZW5kU2V0dGluZ3MgPSBNZXRlb3Iuc2V0dGluZ3Muc2VuZDtcbnZhciBzZW5kQ2xpZW50ID0gdW5kZWZpbmVkO1xuaWYoaXNBcHBUeXBlKFNFTkRfQVBQKSkge1xuICBpZighc2VuZFNldHRpbmdzIHx8ICFzZW5kU2V0dGluZ3MuZG9pY2hhaW4pXG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcihcImNvbmZpZy5zZW5kLmRvaWNoYWluXCIsIFwiU2VuZCBhcHAgZG9pY2hhaW4gc2V0dGluZ3Mgbm90IGZvdW5kXCIpXG4gIHNlbmRDbGllbnQgPSBjcmVhdGVDbGllbnQoc2VuZFNldHRpbmdzLmRvaWNoYWluKTtcbn1cbmV4cG9ydCBjb25zdCBTRU5EX0NMSUVOVCA9IHNlbmRDbGllbnQ7XG5cbnZhciBjb25maXJtU2V0dGluZ3MgPSBNZXRlb3Iuc2V0dGluZ3MuY29uZmlybTtcbnZhciBjb25maXJtQ2xpZW50ID0gdW5kZWZpbmVkO1xudmFyIGNvbmZpcm1BZGRyZXNzID0gdW5kZWZpbmVkO1xuaWYoaXNBcHBUeXBlKENPTkZJUk1fQVBQKSkge1xuICBpZighY29uZmlybVNldHRpbmdzIHx8ICFjb25maXJtU2V0dGluZ3MuZG9pY2hhaW4pXG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcihcImNvbmZpZy5jb25maXJtLmRvaWNoYWluXCIsIFwiQ29uZmlybSBhcHAgZG9pY2hhaW4gc2V0dGluZ3Mgbm90IGZvdW5kXCIpXG4gIGNvbmZpcm1DbGllbnQgPSBjcmVhdGVDbGllbnQoY29uZmlybVNldHRpbmdzLmRvaWNoYWluKTtcbiAgY29uZmlybUFkZHJlc3MgPSBjb25maXJtU2V0dGluZ3MuZG9pY2hhaW4uYWRkcmVzcztcbn1cbmV4cG9ydCBjb25zdCBDT05GSVJNX0NMSUVOVCA9IGNvbmZpcm1DbGllbnQ7XG5leHBvcnQgY29uc3QgQ09ORklSTV9BRERSRVNTID0gY29uZmlybUFkZHJlc3M7XG5cbnZhciB2ZXJpZnlTZXR0aW5ncyA9IE1ldGVvci5zZXR0aW5ncy52ZXJpZnk7XG52YXIgdmVyaWZ5Q2xpZW50ID0gdW5kZWZpbmVkO1xuaWYoaXNBcHBUeXBlKFZFUklGWV9BUFApKSB7XG4gIGlmKCF2ZXJpZnlTZXR0aW5ncyB8fCAhdmVyaWZ5U2V0dGluZ3MuZG9pY2hhaW4pXG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcihcImNvbmZpZy52ZXJpZnkuZG9pY2hhaW5cIiwgXCJWZXJpZnkgYXBwIGRvaWNoYWluIHNldHRpbmdzIG5vdCBmb3VuZFwiKVxuICB2ZXJpZnlDbGllbnQgPSBjcmVhdGVDbGllbnQodmVyaWZ5U2V0dGluZ3MuZG9pY2hhaW4pO1xufVxuZXhwb3J0IGNvbnN0IFZFUklGWV9DTElFTlQgPSB2ZXJpZnlDbGllbnQ7XG5cbmZ1bmN0aW9uIGNyZWF0ZUNsaWVudChzZXR0aW5ncykge1xuICByZXR1cm4gbmV3IG5hbWVjb2luLkNsaWVudCh7XG4gICAgaG9zdDogc2V0dGluZ3MuaG9zdCxcbiAgICBwb3J0OiBzZXR0aW5ncy5wb3J0LFxuICAgIHVzZXI6IHNldHRpbmdzLnVzZXJuYW1lLFxuICAgIHBhc3M6IHNldHRpbmdzLnBhc3N3b3JkXG4gIH0pO1xufVxuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgeyBTRU5EX0FQUCwgQ09ORklSTV9BUFAsIGlzQXBwVHlwZSB9IGZyb20gJy4vdHlwZS1jb25maWd1cmF0aW9uLmpzJztcbmltcG9ydCBIYXNoaWRzIGZyb20gJ2hhc2hpZHMnO1xuLy9jb25zdCBIYXNoaWRzID0gcmVxdWlyZSgnaGFzaGlkcycpLmRlZmF1bHQ7XG5pbXBvcnQge2xvZ0NvbmZpcm19IGZyb20gXCIuL2xvZy1jb25maWd1cmF0aW9uXCI7XG5cbmV4cG9ydCBjb25zdCBIYXNoSWRzID0gbmV3IEhhc2hpZHMoJzB4dWdtTGU3TnllZTZ2azFpRjg4KDZDbXdwcW9HNGhRKi1UNzR0all3Xk8ydk9PKFhsLTkxd0E4Km5DZ19sWCQnKTtcblxudmFyIHNlbmRTZXR0aW5ncyA9IE1ldGVvci5zZXR0aW5ncy5zZW5kO1xudmFyIGRvaU1haWxGZXRjaFVybCA9IHVuZGVmaW5lZDtcblxuaWYoaXNBcHBUeXBlKFNFTkRfQVBQKSkge1xuICBpZighc2VuZFNldHRpbmdzIHx8ICFzZW5kU2V0dGluZ3MuZG9pTWFpbEZldGNoVXJsKVxuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoXCJjb25maWcuc2VuZC5lbWFpbFwiLCBcIlNldHRpbmdzIG5vdCBmb3VuZFwiKTtcbiAgZG9pTWFpbEZldGNoVXJsID0gc2VuZFNldHRpbmdzLmRvaU1haWxGZXRjaFVybDtcbn1cbmV4cG9ydCBjb25zdCBET0lfTUFJTF9GRVRDSF9VUkwgPSBkb2lNYWlsRmV0Y2hVcmw7XG5cbnZhciBkZWZhdWx0RnJvbSA9IHVuZGVmaW5lZDtcbmlmKGlzQXBwVHlwZShDT05GSVJNX0FQUCkpIHtcbiAgdmFyIGNvbmZpcm1TZXR0aW5ncyA9IE1ldGVvci5zZXR0aW5ncy5jb25maXJtO1xuXG4gIGlmKCFjb25maXJtU2V0dGluZ3MgfHwgIWNvbmZpcm1TZXR0aW5ncy5zbXRwKVxuICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFwiY29uZmlnLmNvbmZpcm0uc210cFwiLCBcIkNvbmZpcm0gYXBwIGVtYWlsIHNtdHAgc2V0dGluZ3Mgbm90IGZvdW5kXCIpXG5cbiAgaWYoIWNvbmZpcm1TZXR0aW5ncy5zbXRwLmRlZmF1bHRGcm9tKVxuICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFwiY29uZmlnLmNvbmZpcm0uZGVmYXVsdEZyb21cIiwgXCJDb25maXJtIGFwcCBlbWFpbCBkZWZhdWx0RnJvbSBub3QgZm91bmRcIilcblxuICBkZWZhdWx0RnJvbSAgPSAgY29uZmlybVNldHRpbmdzLnNtdHAuZGVmYXVsdEZyb207XG5cbiAgbG9nQ29uZmlybSgnc2VuZGluZyB3aXRoIGRlZmF1bHRGcm9tOicsZGVmYXVsdEZyb20pO1xuXG4gIE1ldGVvci5zdGFydHVwKCgpID0+IHtcblxuICAgaWYoY29uZmlybVNldHRpbmdzLnNtdHAudXNlcm5hbWUgPT09IHVuZGVmaW5lZCl7XG4gICAgICAgcHJvY2Vzcy5lbnYuTUFJTF9VUkwgPSAnc210cDovLycgK1xuICAgICAgICAgICBlbmNvZGVVUklDb21wb25lbnQoY29uZmlybVNldHRpbmdzLnNtdHAuc2VydmVyKSArXG4gICAgICAgICAgICc6JyArXG4gICAgICAgICAgIGNvbmZpcm1TZXR0aW5ncy5zbXRwLnBvcnQ7XG4gICB9ZWxzZXtcbiAgICAgICBwcm9jZXNzLmVudi5NQUlMX1VSTCA9ICdzbXRwOi8vJyArXG4gICAgICAgICAgIGVuY29kZVVSSUNvbXBvbmVudChjb25maXJtU2V0dGluZ3Muc210cC51c2VybmFtZSkgK1xuICAgICAgICAgICAnOicgKyBlbmNvZGVVUklDb21wb25lbnQoY29uZmlybVNldHRpbmdzLnNtdHAucGFzc3dvcmQpICtcbiAgICAgICAgICAgJ0AnICsgZW5jb2RlVVJJQ29tcG9uZW50KGNvbmZpcm1TZXR0aW5ncy5zbXRwLnNlcnZlcikgK1xuICAgICAgICAgICAnOicgK1xuICAgICAgICAgICBjb25maXJtU2V0dGluZ3Muc210cC5wb3J0O1xuICAgfVxuXG4gICBsb2dDb25maXJtKCd1c2luZyBNQUlMX1VSTDonLHByb2Nlc3MuZW52Lk1BSUxfVVJMKTtcblxuICAgaWYoY29uZmlybVNldHRpbmdzLnNtdHAuTk9ERV9UTFNfUkVKRUNUX1VOQVVUSE9SSVpFRCE9PXVuZGVmaW5lZClcbiAgICAgICBwcm9jZXNzLmVudi5OT0RFX1RMU19SRUpFQ1RfVU5BVVRIT1JJWkVEID0gY29uZmlybVNldHRpbmdzLnNtdHAuTk9ERV9UTFNfUkVKRUNUX1VOQVVUSE9SSVpFRDsgLy8wXG4gIH0pO1xufVxuZXhwb3J0IGNvbnN0IERPSV9NQUlMX0RFRkFVTFRfRU1BSUxfRlJPTSA9IGRlZmF1bHRGcm9tO1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgeyBSb2xlcyB9IGZyb20gJ21ldGVvci9hbGFubmluZzpyb2xlcyc7XG5pbXBvcnQge01ldGF9IGZyb20gJy4uLy4uL2FwaS9tZXRhL21ldGEuanMnXG5NZXRlb3Iuc3RhcnR1cCgoKSA9PiB7XG4gICBsZXQgdmVyc2lvbj1Bc3NldHMuZ2V0VGV4dChcInZlcnNpb24uanNvblwiKTtcblxuICBpZiAoTWV0YS5maW5kKCkuY291bnQoKSA+IDApe1xuICAgIE1ldGEucmVtb3ZlKHt9KTtcbiAgfVxuICAgTWV0YS5pbnNlcnQoe2tleTpcInZlcnNpb25cIix2YWx1ZTp2ZXJzaW9ufSk7XG4gIFxuICBpZihNZXRlb3IudXNlcnMuZmluZCgpLmNvdW50KCkgPT09IDApIHtcbiAgICBjb25zdCBpZCA9IEFjY291bnRzLmNyZWF0ZVVzZXIoe1xuICAgICAgdXNlcm5hbWU6ICdhZG1pbicsXG4gICAgICBlbWFpbDogJ2FkbWluQHNlbmRlZmZlY3QuZGUnLFxuICAgICAgcGFzc3dvcmQ6ICdwYXNzd29yZCdcbiAgICB9KTtcbiAgICBSb2xlcy5hZGRVc2Vyc1RvUm9sZXMoaWQsICdhZG1pbicpO1xuICB9XG59KTtcbiIsImltcG9ydCAnLi9sb2ctY29uZmlndXJhdGlvbi5qcyc7XG5pbXBvcnQgJy4vZGFwcC1jb25maWd1cmF0aW9uLmpzJztcbmltcG9ydCAnLi90eXBlLWNvbmZpZ3VyYXRpb24uanMnO1xuaW1wb3J0ICcuL2Rucy1jb25maWd1cmF0aW9uLmpzJztcbmltcG9ydCAnLi9kb2ljaGFpbi1jb25maWd1cmF0aW9uLmpzJztcbmltcG9ydCAnLi9maXh0dXJlcy5qcyc7XG5pbXBvcnQgJy4vcmVnaXN0ZXItYXBpLmpzJztcbmltcG9ydCAnLi91c2VyYWNjb3VudHMtY29uZmlndXJhdGlvbi5qcyc7XG5pbXBvcnQgJy4vc2VjdXJpdHkuanMnO1xuaW1wb3J0ICcuL2VtYWlsLWNvbmZpZ3VyYXRpb24uanMnO1xuaW1wb3J0ICcuL2pvYnMuanMnO1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgeyBNYWlsSm9icyB9IGZyb20gJy4uLy4uLy4uL3NlcnZlci9hcGkvbWFpbF9qb2JzLmpzJztcbmltcG9ydCB7IEJsb2NrY2hhaW5Kb2JzIH0gZnJvbSAnLi4vLi4vLi4vc2VydmVyL2FwaS9ibG9ja2NoYWluX2pvYnMuanMnO1xuaW1wb3J0IHsgREFwcEpvYnMgfSBmcm9tICcuLi8uLi8uLi9zZXJ2ZXIvYXBpL2RhcHBfam9icy5qcyc7XG5pbXBvcnQgeyBDT05GSVJNX0FQUCwgaXNBcHBUeXBlIH0gZnJvbSAnLi90eXBlLWNvbmZpZ3VyYXRpb24uanMnO1xuaW1wb3J0IGFkZENoZWNrTmV3VHJhbnNhY3Rpb25zQmxvY2tjaGFpbkpvYiBmcm9tICcuLi8uLi9tb2R1bGVzL3NlcnZlci9qb2JzL2FkZF9jaGVja19uZXdfdHJhbnNhY3Rpb25zLmpzJztcblxuTWV0ZW9yLnN0YXJ0dXAoKCkgPT4ge1xuICBNYWlsSm9icy5zdGFydEpvYlNlcnZlcigpO1xuICBCbG9ja2NoYWluSm9icy5zdGFydEpvYlNlcnZlcigpO1xuICBEQXBwSm9icy5zdGFydEpvYlNlcnZlcigpO1xuICBpZihpc0FwcFR5cGUoQ09ORklSTV9BUFApKSBhZGRDaGVja05ld1RyYW5zYWN0aW9uc0Jsb2NrY2hhaW5Kb2IoKTtcbn0pO1xuIiwiaW1wb3J0IHtpc0RlYnVnfSBmcm9tIFwiLi9kYXBwLWNvbmZpZ3VyYXRpb25cIjtcblxucmVxdWlyZSgnc2NyaWJlLWpzJykoKTtcblxuZXhwb3J0IGNvbnN0IGNvbnNvbGUgPSBwcm9jZXNzLmNvbnNvbGU7XG5leHBvcnQgY29uc3Qgc2VuZE1vZGVUYWdDb2xvciA9IHttc2cgOiAnc2VuZC1tb2RlJywgY29sb3JzIDogWyd5ZWxsb3cnLCAnaW52ZXJzZSddfTtcbmV4cG9ydCBjb25zdCBjb25maXJtTW9kZVRhZ0NvbG9yID0ge21zZyA6ICdjb25maXJtLW1vZGUnLCBjb2xvcnMgOiBbJ2JsdWUnLCAnaW52ZXJzZSddfTtcbmV4cG9ydCBjb25zdCB2ZXJpZnlNb2RlVGFnQ29sb3IgPSB7bXNnIDogJ3ZlcmlmeS1tb2RlJywgY29sb3JzIDogWydncmVlbicsICdpbnZlcnNlJ119O1xuZXhwb3J0IGNvbnN0IGJsb2NrY2hhaW5Nb2RlVGFnQ29sb3IgPSB7bXNnIDogJ2Jsb2NrY2hhaW4tbW9kZScsIGNvbG9ycyA6IFsnd2hpdGUnLCAnaW52ZXJzZSddfTtcbmV4cG9ydCBjb25zdCB0ZXN0aW5nTW9kZVRhZ0NvbG9yID0ge21zZyA6ICd0ZXN0aW5nLW1vZGUnLCBjb2xvcnMgOiBbJ29yYW5nZScsICdpbnZlcnNlJ119O1xuXG5leHBvcnQgZnVuY3Rpb24gbG9nU2VuZChtZXNzYWdlLHBhcmFtKSB7XG4gICAgaWYoaXNEZWJ1ZygpKSB7Y29uc29sZS50aW1lKCkudGFnKHNlbmRNb2RlVGFnQ29sb3IpLmxvZyhtZXNzYWdlLHBhcmFtP3BhcmFtOicnKTt9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsb2dDb25maXJtKG1lc3NhZ2UscGFyYW0pIHtcbiAgICBpZihpc0RlYnVnKCkpIHtjb25zb2xlLnRpbWUoKS50YWcoY29uZmlybU1vZGVUYWdDb2xvcikubG9nKG1lc3NhZ2UsIHBhcmFtP3BhcmFtOicnKTt9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsb2dWZXJpZnkobWVzc2FnZSwgcGFyYW0pIHtcbiAgICBpZihpc0RlYnVnKCkpIHtjb25zb2xlLnRpbWUoKS50YWcodmVyaWZ5TW9kZVRhZ0NvbG9yKS5sb2cobWVzc2FnZSwgcGFyYW0/cGFyYW06JycpO31cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxvZ0Jsb2NrY2hhaW4obWVzc2FnZSwgcGFyYW0pIHtcbiAgICBpZihpc0RlYnVnKCkpe2NvbnNvbGUudGltZSgpLnRhZyhibG9ja2NoYWluTW9kZVRhZ0NvbG9yKS5sb2cobWVzc2FnZSwgcGFyYW0/cGFyYW06JycpO31cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxvZ01haW4obWVzc2FnZSwgcGFyYW0pIHtcbiAgICBpZihpc0RlYnVnKCkpe2NvbnNvbGUudGltZSgpLnRhZyhibG9ja2NoYWluTW9kZVRhZ0NvbG9yKS5sb2cobWVzc2FnZSwgcGFyYW0/cGFyYW06JycpO31cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxvZ0Vycm9yKG1lc3NhZ2UsIHBhcmFtKSB7XG4gICAgaWYoaXNEZWJ1ZygpKXtjb25zb2xlLnRpbWUoKS50YWcoYmxvY2tjaGFpbk1vZGVUYWdDb2xvcikuZXJyb3IobWVzc2FnZSwgcGFyYW0/cGFyYW06JycpO31cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRlc3RMb2dnaW5nKG1lc3NhZ2UsIHBhcmFtKSB7XG4gICAgaWYoaXNEZWJ1ZygpKXtjb25zb2xlLnRpbWUoKS50YWcodGVzdGluZ01vZGVUYWdDb2xvcikubG9nKG1lc3NhZ2UsIHBhcmFtP3BhcmFtOicnKTt9XG59IiwiaW1wb3J0ICcuLi8uLi9hcGkvbGFuZ3VhZ2VzL21ldGhvZHMuanMnO1xuaW1wb3J0ICcuLi8uLi9hcGkvZG9pY2hhaW4vbWV0aG9kcy5qcyc7XG5pbXBvcnQgJy4uLy4uL2FwaS9yZWNpcGllbnRzL3NlcnZlci9wdWJsaWNhdGlvbnMuanMnO1xuaW1wb3J0ICcuLi8uLi9hcGkvb3B0LWlucy9tZXRob2RzLmpzJztcbmltcG9ydCAnLi4vLi4vYXBpL3ZlcnNpb24vcHVibGljYXRpb25zLmpzJztcbmltcG9ydCAnLi4vLi4vYXBpL29wdC1pbnMvc2VydmVyL3B1YmxpY2F0aW9ucy5qcyc7XG5cbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IHsgRERQUmF0ZUxpbWl0ZXIgfSBmcm9tICdtZXRlb3IvZGRwLXJhdGUtbGltaXRlcic7XG5pbXBvcnQgeyBfIH0gZnJvbSAnbWV0ZW9yL3VuZGVyc2NvcmUnO1xuXG4vLyBEb24ndCBsZXQgcGVvcGxlIHdyaXRlIGFyYml0cmFyeSBkYXRhIHRvIHRoZWlyICdwcm9maWxlJyBmaWVsZCBmcm9tIHRoZSBjbGllbnRcbk1ldGVvci51c2Vycy5kZW55KHtcbiAgdXBkYXRlKCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9LFxufSk7XG5cbi8vIEdldCBhIGxpc3Qgb2YgYWxsIGFjY291bnRzIG1ldGhvZHMgYnkgcnVubmluZyBgTWV0ZW9yLnNlcnZlci5tZXRob2RfaGFuZGxlcnNgIGluIG1ldGVvciBzaGVsbFxuY29uc3QgQVVUSF9NRVRIT0RTID0gW1xuICAnbG9naW4nLFxuICAnbG9nb3V0JyxcbiAgJ2xvZ291dE90aGVyQ2xpZW50cycsXG4gICdnZXROZXdUb2tlbicsXG4gICdyZW1vdmVPdGhlclRva2VucycsXG4gICdjb25maWd1cmVMb2dpblNlcnZpY2UnLFxuICAnY2hhbmdlUGFzc3dvcmQnLFxuICAnZm9yZ290UGFzc3dvcmQnLFxuICAncmVzZXRQYXNzd29yZCcsXG4gICd2ZXJpZnlFbWFpbCcsXG4gICdjcmVhdGVVc2VyJyxcbiAgJ0FUUmVtb3ZlU2VydmljZScsXG4gICdBVENyZWF0ZVVzZXJTZXJ2ZXInLFxuICAnQVRSZXNlbmRWZXJpZmljYXRpb25FbWFpbCcsXG5dO1xuXG5pZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIC8vIE9ubHkgYWxsb3cgMiBsb2dpbiBhdHRlbXB0cyBwZXIgY29ubmVjdGlvbiBwZXIgNSBzZWNvbmRzXG4gIEREUFJhdGVMaW1pdGVyLmFkZFJ1bGUoe1xuICAgIG5hbWUobmFtZSkge1xuICAgICAgcmV0dXJuIF8uY29udGFpbnMoQVVUSF9NRVRIT0RTLCBuYW1lKTtcbiAgICB9LFxuXG4gICAgLy8gUmF0ZSBsaW1pdCBwZXIgY29ubmVjdGlvbiBJRFxuICAgIGNvbm5lY3Rpb25JZCgpIHsgcmV0dXJuIHRydWU7IH0sXG4gIH0sIDIsIDUwMDApO1xufVxuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5leHBvcnQgY29uc3QgU0VORF9BUFAgPSBcInNlbmRcIjtcbmV4cG9ydCBjb25zdCBDT05GSVJNX0FQUCA9IFwiY29uZmlybVwiO1xuZXhwb3J0IGNvbnN0IFZFUklGWV9BUFAgPSBcInZlcmlmeVwiO1xuZXhwb3J0IGZ1bmN0aW9uIGlzQXBwVHlwZSh0eXBlKSB7XG4gIGlmKE1ldGVvci5zZXR0aW5ncyA9PT0gdW5kZWZpbmVkIHx8IE1ldGVvci5zZXR0aW5ncy5hcHAgPT09IHVuZGVmaW5lZCkgdGhyb3cgXCJObyBzZXR0aW5ncyBmb3VuZCFcIlxuICBjb25zdCB0eXBlcyA9IE1ldGVvci5zZXR0aW5ncy5hcHAudHlwZXM7XG4gIGlmKHR5cGVzICE9PSB1bmRlZmluZWQpIHJldHVybiB0eXBlcy5pbmNsdWRlcyh0eXBlKTtcbiAgcmV0dXJuIGZhbHNlO1xufVxuIiwiaW1wb3J0IHsgQWNjb3VudHMgfSBmcm9tICdtZXRlb3IvYWNjb3VudHMtYmFzZSc7XG5BY2NvdW50cy5jb25maWcoe1xuICAgIHNlbmRWZXJpZmljYXRpb25FbWFpbDogdHJ1ZSxcbiAgICBmb3JiaWRDbGllbnRBY2NvdW50Q3JlYXRpb246IHRydWVcbn0pO1xuXG5cblxuQWNjb3VudHMuZW1haWxUZW1wbGF0ZXMuZnJvbT0nZG9pY2hhaW5AbGUtc3BhY2UuZGUnOyIsImltcG9ydCB7IEFwaSwgRE9JX1dBTExFVE5PVElGWV9ST1VURSwgRE9JX0NPTkZJUk1BVElPTl9ST1VURSB9IGZyb20gJy4uL3Jlc3QuanMnO1xuaW1wb3J0IGNvbmZpcm1PcHRJbiBmcm9tICcuLi8uLi8uLi8uLi9pbXBvcnRzL21vZHVsZXMvc2VydmVyL29wdC1pbnMvY29uZmlybS5qcydcbmltcG9ydCBjaGVja05ld1RyYW5zYWN0aW9uIGZyb20gXCIuLi8uLi8uLi8uLi9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2RvaWNoYWluL2NoZWNrX25ld190cmFuc2FjdGlvbnNcIjtcbmltcG9ydCB7bG9nQ29uZmlybX0gZnJvbSBcIi4uLy4uLy4uLy4uL2ltcG9ydHMvc3RhcnR1cC9zZXJ2ZXIvbG9nLWNvbmZpZ3VyYXRpb25cIjtcbi8vZG9rdSBvZiBtZXRlb3ItcmVzdGl2dXMgaHR0cHM6Ly9naXRodWIuY29tL2thaG1hbGkvbWV0ZW9yLXJlc3RpdnVzXG5BcGkuYWRkUm91dGUoRE9JX0NPTkZJUk1BVElPTl9ST1VURSsnLzpoYXNoJywge2F1dGhSZXF1aXJlZDogZmFsc2V9LCB7XG4gIGdldDoge1xuICAgIGFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBoYXNoID0gdGhpcy51cmxQYXJhbXMuaGFzaDtcbiAgICAgIHRyeSB7XG4gICAgICAgIGxldCBpcCA9IHRoaXMucmVxdWVzdC5oZWFkZXJzWyd4LWZvcndhcmRlZC1mb3InXSB8fFxuICAgICAgICAgIHRoaXMucmVxdWVzdC5jb25uZWN0aW9uLnJlbW90ZUFkZHJlc3MgfHxcbiAgICAgICAgICB0aGlzLnJlcXVlc3Quc29ja2V0LnJlbW90ZUFkZHJlc3MgfHxcbiAgICAgICAgICAodGhpcy5yZXF1ZXN0LmNvbm5lY3Rpb24uc29ja2V0ID8gdGhpcy5yZXF1ZXN0LmNvbm5lY3Rpb24uc29ja2V0LnJlbW90ZUFkZHJlc3M6IG51bGwpO1xuXG4gICAgICAgICAgaWYoaXAuaW5kZXhPZignLCcpIT0tMSlpcD1pcC5zdWJzdHJpbmcoMCxpcC5pbmRleE9mKCcsJykpO1xuXG4gICAgICAgICAgbG9nQ29uZmlybSgnUkVTVCBvcHQtaW4vY29uZmlybSA6Jyx7aGFzaDpoYXNoLCBob3N0OmlwfSk7XG4gICAgICAgICAgY29uc3QgcmVkaXJlY3QgPSBjb25maXJtT3B0SW4oe2hvc3Q6IGlwLCBoYXNoOiBoYXNofSk7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBzdGF0dXNDb2RlOiAzMDMsXG4gICAgICAgICAgaGVhZGVyczogeydDb250ZW50LVR5cGUnOiAndGV4dC9wbGFpbicsICdMb2NhdGlvbic6IHJlZGlyZWN0fSxcbiAgICAgICAgICBib2R5OiAnTG9jYXRpb246ICcrcmVkaXJlY3RcbiAgICAgICAgfTtcbiAgICAgIH0gY2F0Y2goZXJyb3IpIHtcbiAgICAgICAgcmV0dXJuIHtzdGF0dXNDb2RlOiA1MDAsIGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogZXJyb3IubWVzc2FnZX19O1xuICAgICAgfVxuICAgIH1cbiAgfVxufSk7XG5cbkFwaS5hZGRSb3V0ZShET0lfV0FMTEVUTk9USUZZX1JPVVRFLCB7XG4gICAgZ2V0OiB7XG4gICAgICAgIGF1dGhSZXF1aXJlZDogZmFsc2UsXG4gICAgICAgIGFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjb25zdCBwYXJhbXMgPSB0aGlzLnF1ZXJ5UGFyYW1zO1xuICAgICAgICAgICAgY29uc3QgdHhpZCA9IHBhcmFtcy50eDtcblxuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBjaGVja05ld1RyYW5zYWN0aW9uKHR4aWQpO1xuICAgICAgICAgICAgICAgIHJldHVybiB7c3RhdHVzOiAnc3VjY2VzcycsICBkYXRhOid0eGlkOicrdHhpZCsnIHdhcyByZWFkIGZyb20gYmxvY2tjaGFpbid9O1xuICAgICAgICAgICAgfSBjYXRjaChlcnJvcikge1xuICAgICAgICAgICAgICAgIHJldHVybiB7c3RhdHVzOiAnZmFpbCcsIGVycm9yOiBlcnJvci5tZXNzYWdlfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn0pO1xuIiwiaW1wb3J0IHsgQXBpIH0gZnJvbSAnLi4vcmVzdC5qcyc7XG5BcGkuYWRkUm91dGUoJ2RlYnVnL21haWwnLCB7YXV0aFJlcXVpcmVkOiBmYWxzZX0sIHtcbiAgZ2V0OiB7XG4gICAgYWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IGRhdGEgPSB7XG4gICAgICAgIFwiZnJvbVwiOiBcIm5vcmVwbHlAZG9pY2hhaW4ub3JnXCIsXG4gICAgICAgIFwic3ViamVjdFwiOiBcIkRvaWNoYWluLm9yZyBOZXdzbGV0dGVyIEJlc3TDpHRpZ3VuZ1wiLFxuICAgICAgICBcInJlZGlyZWN0XCI6IFwiaHR0cHM6Ly93d3cuZG9pY2hhaW4ub3JnL3ZpZWxlbi1kYW5rL1wiLFxuICAgICAgICBcInJldHVyblBhdGhcIjogXCJub3JlcGx5QGRvaWNoYWluLm9yZ1wiLFxuICAgICAgICBcImNvbnRlbnRcIjpcIjxzdHlsZSB0eXBlPSd0ZXh0L2NzcycgbWVkaWE9J3NjcmVlbic+XFxuXCIgK1xuICAgICAgICAgICAgXCIqIHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGxpbmUtaGVpZ2h0OiBpbmhlcml0O1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwiLkV4dGVybmFsQ2xhc3MgKiB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRsaW5lLWhlaWdodDogMTAwJTtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcImJvZHksIHAge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0bWFyZ2luOiAwO1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0cGFkZGluZzogMDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdG1hcmdpbi1ib3R0b206IDA7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHQtd2Via2l0LXRleHQtc2l6ZS1hZGp1c3Q6IG5vbmU7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHQtbXMtdGV4dC1zaXplLWFkanVzdDogbm9uZTtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcImltZyB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRsaW5lLWhlaWdodDogMTAwJTtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdG91dGxpbmU6IG5vbmU7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHR0ZXh0LWRlY29yYXRpb246IG5vbmU7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHQtbXMtaW50ZXJwb2xhdGlvbi1tb2RlOiBiaWN1YmljO1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwiYSBpbWcge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0Ym9yZGVyOiBub25lO1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwiI2JhY2tncm91bmRUYWJsZSB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRtYXJnaW46IDA7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRwYWRkaW5nOiAwO1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0d2lkdGg6IDEwMCUgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcImEsIGE6bGluaywgLm5vLWRldGVjdC1sb2NhbCBhLCAuYXBwbGVMaW5rcyBhIHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGNvbG9yOiAjNTU1NWZmICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHR0ZXh0LWRlY29yYXRpb246IHVuZGVybGluZTtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcIi5FeHRlcm5hbENsYXNzIHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGRpc3BsYXk6IGJsb2NrICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHR3aWR0aDogMTAwJTtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcIi5FeHRlcm5hbENsYXNzLCAuRXh0ZXJuYWxDbGFzcyBwLCAuRXh0ZXJuYWxDbGFzcyBzcGFuLCAuRXh0ZXJuYWxDbGFzcyBmb250LCAuRXh0ZXJuYWxDbGFzcyB0ZCwgLkV4dGVybmFsQ2xhc3MgZGl2IHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGxpbmUtaGVpZ2h0OiBpbmhlcml0O1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwidGFibGUgdGQge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0Ym9yZGVyLWNvbGxhcHNlOiBjb2xsYXBzZTtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdG1zby10YWJsZS1sc3BhY2U6IDBwdDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdG1zby10YWJsZS1yc3BhY2U6IDBwdDtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcInN1cCB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRwb3NpdGlvbjogcmVsYXRpdmU7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHR0b3A6IDRweDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGxpbmUtaGVpZ2h0OiA3cHggIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGZvbnQtc2l6ZTogMTFweCAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwiLm1vYmlsZV9saW5rIGFbaHJlZl49J3RlbCddLCAubW9iaWxlX2xpbmsgYVtocmVmXj0nc21zJ10ge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0dGV4dC1kZWNvcmF0aW9uOiBkZWZhdWx0O1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0Y29sb3I6ICM1NTU1ZmYgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdHBvaW50ZXItZXZlbnRzOiBhdXRvO1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0Y3Vyc29yOiBkZWZhdWx0O1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwiLm5vLWRldGVjdCBhIHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdHRleHQtZGVjb3JhdGlvbjogbm9uZTtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGNvbG9yOiAjNTU1NWZmO1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0cG9pbnRlci1ldmVudHM6IGF1dG87XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRjdXJzb3I6IGRlZmF1bHQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCJ7XFxuXCIgK1xuICAgICAgICAgICAgXCJjb2xvcjogIzU1NTVmZjtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcInNwYW4ge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0Y29sb3I6IGluaGVyaXQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRib3JkZXItYm90dG9tOiBub25lO1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwic3Bhbjpob3ZlciB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcIi5ub3VuZGVybGluZSB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHR0ZXh0LWRlY29yYXRpb246IG5vbmUgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcImgxLCBoMiwgaDMge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0bWFyZ2luOiAwO1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0cGFkZGluZzogMDtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcInAge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0TWFyZ2luOiAwcHggIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcInRhYmxlW2NsYXNzPSdlbWFpbC1yb290LXdyYXBwZXInXSB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHR3aWR0aDogNjAwcHggIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcImJvZHkge1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwiYm9keSB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRtaW4td2lkdGg6IDI4MHB4O1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0d2lkdGg6IDEwMCU7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCJ0ZFtjbGFzcz0ncGF0dGVybiddIC5jMTEycDIwciB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHR3aWR0aDogMjAlO1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwidGRbY2xhc3M9J3BhdHRlcm4nXSAuYzMzNnA2MHIge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0d2lkdGg6IDYwLjAwMDAwMDAwMDAwMDI1NiU7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCI8L3N0eWxlPlxcblwiICtcbiAgICAgICAgICAgIFwiPHN0eWxlPlxcblwiICtcbiAgICAgICAgICAgIFwiQG1lZGlhIG9ubHkgc2NyZWVuIGFuZCAobWF4LXdpZHRoOiA1OTlweCksIG9ubHkgc2NyZWVuIGFuZCAobWF4LWRldmljZS13aWR0aDogNTk5cHgpLCBvbmx5IHNjcmVlbiBhbmQgKG1heC13aWR0aDogNDAwcHgpLCBvbmx5IHNjcmVlbiBhbmQgKG1heC1kZXZpY2Utd2lkdGg6IDQwMHB4KSB7XFxuXCIgK1xuICAgICAgICAgICAgXCIuZW1haWwtcm9vdC13cmFwcGVyIHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdHdpZHRoOiAxMDAlICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCIuZnVsbC13aWR0aCB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHR3aWR0aDogMTAwJSAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0aGVpZ2h0OiBhdXRvICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHR0ZXh0LWFsaWduOiBjZW50ZXI7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCIuZnVsbHdpZHRoaGFsZmxlZnQge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0d2lkdGg6IDEwMCUgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcIi5mdWxsd2lkdGhoYWxmcmlnaHQge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0d2lkdGg6IDEwMCUgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcIi5mdWxsd2lkdGhoYWxmaW5uZXIge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0d2lkdGg6IDEwMCUgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdG1hcmdpbjogMCBhdXRvICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRmbG9hdDogbm9uZSAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0bWFyZ2luLWxlZnQ6IGF1dG8gIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdG1hcmdpbi1yaWdodDogYXV0byAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0Y2xlYXI6IGJvdGggIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcIi5oaWRlIHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGRpc3BsYXk6IG5vbmUgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdHdpZHRoOiAwcHggIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGhlaWdodDogMHB4ICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRvdmVyZmxvdzogaGlkZGVuO1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwiLmRlc2t0b3AtaGlkZSB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRkaXNwbGF5OiBibG9jayAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0d2lkdGg6IDEwMCUgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGhlaWdodDogYXV0byAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0b3ZlcmZsb3c6IGhpZGRlbjtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdG1heC1oZWlnaHQ6IGluaGVyaXQgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcIi5jMTEycDIwciB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHR3aWR0aDogMTAwJSAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0ZmxvYXQ6IG5vbmU7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCIuYzMzNnA2MHIge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0d2lkdGg6IDEwMCUgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGZsb2F0OiBub25lO1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwiPC9zdHlsZT5cXG5cIiArXG4gICAgICAgICAgICBcIjxzdHlsZT5cXG5cIiArXG4gICAgICAgICAgICBcIkBtZWRpYSBvbmx5IHNjcmVlbiBhbmQgKG1pbi13aWR0aDogNjAwcHgpIHtcXG5cIiArXG4gICAgICAgICAgICBcInRkW2NsYXNzPSdwYXR0ZXJuJ10gLmMxMTJwMjByIHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdHdpZHRoOiAxMTJweCAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwidGRbY2xhc3M9J3BhdHRlcm4nXSAuYzMzNnA2MHIge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0d2lkdGg6IDMzNnB4ICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCJcXG5cIiArXG4gICAgICAgICAgICBcIkBtZWRpYSBvbmx5IHNjcmVlbiBhbmQgKG1heC13aWR0aDogNTk5cHgpLCBvbmx5IHNjcmVlbiBhbmQgKG1heC1kZXZpY2Utd2lkdGg6IDU5OXB4KSwgb25seSBzY3JlZW4gYW5kIChtYXgtd2lkdGg6IDQwMHB4KSwgb25seSBzY3JlZW4gYW5kIChtYXgtZGV2aWNlLXdpZHRoOiA0MDBweCkge1xcblwiICtcbiAgICAgICAgICAgIFwidGFibGVbY2xhc3M9J2VtYWlsLXJvb3Qtd3JhcHBlciddIHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdHdpZHRoOiAxMDAlICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCJ0ZFtjbGFzcz0nd3JhcCddIC5mdWxsLXdpZHRoIHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdHdpZHRoOiAxMDAlICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRoZWlnaHQ6IGF1dG8gIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcInRkW2NsYXNzPSd3cmFwJ10gLmZ1bGx3aWR0aGhhbGZsZWZ0IHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdHdpZHRoOiAxMDAlICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCJ0ZFtjbGFzcz0nd3JhcCddIC5mdWxsd2lkdGhoYWxmcmlnaHQge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0d2lkdGg6IDEwMCUgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcInRkW2NsYXNzPSd3cmFwJ10gLmZ1bGx3aWR0aGhhbGZpbm5lciB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHR3aWR0aDogMTAwJSAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0bWFyZ2luOiAwIGF1dG8gIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGZsb2F0OiBub25lICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRtYXJnaW4tbGVmdDogYXV0byAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0bWFyZ2luLXJpZ2h0OiBhdXRvICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRjbGVhcjogYm90aCAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwidGRbY2xhc3M9J3dyYXAnXSAuaGlkZSB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRkaXNwbGF5OiBub25lICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHR3aWR0aDogMHB4O1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0aGVpZ2h0OiAwcHg7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRvdmVyZmxvdzogaGlkZGVuO1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwidGRbY2xhc3M9J3BhdHRlcm4nXSAuYzExMnAyMHIge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0d2lkdGg6IDEwMCUgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcInRkW2NsYXNzPSdwYXR0ZXJuJ10gLmMzMzZwNjByIHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdHdpZHRoOiAxMDAlICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCJcXG5cIiArXG4gICAgICAgICAgICBcIkBtZWRpYSB5YWhvbyB7XFxuXCIgK1xuICAgICAgICAgICAgXCJ0YWJsZSB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRmbG9hdDogbm9uZSAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0aGVpZ2h0OiBhdXRvO1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwidGFibGVbYWxpZ249J2xlZnQnXSB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRmbG9hdDogbGVmdCAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwidGRbYWxpZ249J2xlZnQnXSB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRmbG9hdDogbGVmdCAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0aGVpZ2h0OiBhdXRvO1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwidGFibGVbYWxpZ249J2NlbnRlciddIHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdG1hcmdpbjogMCBhdXRvO1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwidGRbYWxpZ249J2NlbnRlciddIHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdG1hcmdpbjogMCBhdXRvO1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0aGVpZ2h0OiBhdXRvO1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwidGFibGVbYWxpZ249J3JpZ2h0J10ge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0ZmxvYXQ6IHJpZ2h0ICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCJ0ZFthbGlnbj0ncmlnaHQnXSB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRmbG9hdDogcmlnaHQgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGhlaWdodDogYXV0bztcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcIjwvc3R5bGU+XFxuXCIgK1xuICAgICAgICAgICAgXCJcXG5cIiArXG4gICAgICAgICAgICBcIjwhLS1baWYgKGd0ZSBJRSA3KSAmICh2bWwpXT5cXG5cIiArXG4gICAgICAgICAgICBcIjxzdHlsZSB0eXBlPSd0ZXh0L2Nzcyc+XFxuXCIgK1xuICAgICAgICAgICAgXCJodG1sLCBib2R5IHttYXJnaW46MCAhaW1wb3J0YW50OyBwYWRkaW5nOjBweCAhaW1wb3J0YW50O31cXG5cIiArXG4gICAgICAgICAgICBcImltZy5mdWxsLXdpZHRoIHsgcG9zaXRpb246IHJlbGF0aXZlICFpbXBvcnRhbnQ7IH1cXG5cIiArXG4gICAgICAgICAgICBcIlxcblwiICtcbiAgICAgICAgICAgIFwiLmltZzI0MHgzMCB7IHdpZHRoOiAyNDBweCAhaW1wb3J0YW50OyBoZWlnaHQ6IDMwcHggIWltcG9ydGFudDt9XFxuXCIgK1xuICAgICAgICAgICAgXCIuaW1nMjB4MjAgeyB3aWR0aDogMjBweCAhaW1wb3J0YW50OyBoZWlnaHQ6IDIwcHggIWltcG9ydGFudDt9XFxuXCIgK1xuICAgICAgICAgICAgXCJcXG5cIiArXG4gICAgICAgICAgICBcIjwvc3R5bGU+XFxuXCIgK1xuICAgICAgICAgICAgXCI8IVtlbmRpZl0tLT5cXG5cIiArXG4gICAgICAgICAgICBcIlxcblwiICtcbiAgICAgICAgICAgIFwiPCEtLVtpZiBndGUgbXNvIDldPlxcblwiICtcbiAgICAgICAgICAgIFwiPHN0eWxlIHR5cGU9J3RleHQvY3NzJz5cXG5cIiArXG4gICAgICAgICAgICBcIi5tc28tZm9udC1maXgtYXJpYWwgeyBmb250LWZhbWlseTogQXJpYWwsIHNhbnMtc2VyaWY7fVxcblwiICtcbiAgICAgICAgICAgIFwiLm1zby1mb250LWZpeC1nZW9yZ2lhIHsgZm9udC1mYW1pbHk6IEdlb3JnaWEsIHNhbnMtc2VyaWY7fVxcblwiICtcbiAgICAgICAgICAgIFwiLm1zby1mb250LWZpeC10YWhvbWEgeyBmb250LWZhbWlseTogVGFob21hLCBzYW5zLXNlcmlmO31cXG5cIiArXG4gICAgICAgICAgICBcIi5tc28tZm9udC1maXgtdGltZXNfbmV3X3JvbWFuIHsgZm9udC1mYW1pbHk6ICdUaW1lcyBOZXcgUm9tYW4nLCBzYW5zLXNlcmlmO31cXG5cIiArXG4gICAgICAgICAgICBcIi5tc28tZm9udC1maXgtdHJlYnVjaGV0X21zIHsgZm9udC1mYW1pbHk6ICdUcmVidWNoZXQgTVMnLCBzYW5zLXNlcmlmO31cXG5cIiArXG4gICAgICAgICAgICBcIi5tc28tZm9udC1maXgtdmVyZGFuYSB7IGZvbnQtZmFtaWx5OiBWZXJkYW5hLCBzYW5zLXNlcmlmO31cXG5cIiArXG4gICAgICAgICAgICBcIjwvc3R5bGU+XFxuXCIgK1xuICAgICAgICAgICAgXCI8IVtlbmRpZl0tLT5cXG5cIiArXG4gICAgICAgICAgICBcIlxcblwiICtcbiAgICAgICAgICAgIFwiPCEtLVtpZiBndGUgbXNvIDldPlxcblwiICtcbiAgICAgICAgICAgIFwiPHN0eWxlIHR5cGU9J3RleHQvY3NzJz5cXG5cIiArXG4gICAgICAgICAgICBcInRhYmxlLCB0ZCB7XFxuXCIgK1xuICAgICAgICAgICAgXCJib3JkZXItY29sbGFwc2U6IGNvbGxhcHNlICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJtc28tdGFibGUtbHNwYWNlOiAwcHggIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIm1zby10YWJsZS1yc3BhY2U6IDBweCAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwiXFxuXCIgK1xuICAgICAgICAgICAgXCIuZW1haWwtcm9vdC13cmFwcGVyIHsgd2lkdGggNjAwcHggIWltcG9ydGFudDt9XFxuXCIgK1xuICAgICAgICAgICAgXCIuaW1nbGluayB7IGZvbnQtc2l6ZTogMHB4OyB9XFxuXCIgK1xuICAgICAgICAgICAgXCIuZWRtX2J1dHRvbiB7IGZvbnQtc2l6ZTogMHB4OyB9XFxuXCIgK1xuICAgICAgICAgICAgXCI8L3N0eWxlPlxcblwiICtcbiAgICAgICAgICAgIFwiPCFbZW5kaWZdLS0+XFxuXCIgK1xuICAgICAgICAgICAgXCJcXG5cIiArXG4gICAgICAgICAgICBcIjwhLS1baWYgZ3RlIG1zbyAxNV0+XFxuXCIgK1xuICAgICAgICAgICAgXCI8c3R5bGUgdHlwZT0ndGV4dC9jc3MnPlxcblwiICtcbiAgICAgICAgICAgIFwidGFibGUge1xcblwiICtcbiAgICAgICAgICAgIFwiZm9udC1zaXplOjBweDtcXG5cIiArXG4gICAgICAgICAgICBcIm1zby1tYXJnaW4tdG9wLWFsdDowcHg7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCJcXG5cIiArXG4gICAgICAgICAgICBcIi5mdWxsd2lkdGhoYWxmbGVmdCB7XFxuXCIgK1xuICAgICAgICAgICAgXCJ3aWR0aDogNDklICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJmbG9hdDpsZWZ0ICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCJcXG5cIiArXG4gICAgICAgICAgICBcIi5mdWxsd2lkdGhoYWxmcmlnaHQge1xcblwiICtcbiAgICAgICAgICAgIFwid2lkdGg6IDUwJSAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwiZmxvYXQ6cmlnaHQgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcIjwvc3R5bGU+XFxuXCIgK1xuICAgICAgICAgICAgXCI8IVtlbmRpZl0tLT5cXG5cIiArXG4gICAgICAgICAgICBcIjxzdHlsZSB0eXBlPSd0ZXh0L2NzcycgbWVkaWE9Jyhwb2ludGVyKSBhbmQgKG1pbi1jb2xvci1pbmRleDowKSc+XFxuXCIgK1xuICAgICAgICAgICAgXCJodG1sLCBib2R5IHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGJhY2tncm91bmQtaW1hZ2U6IG5vbmUgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGJhY2tncm91bmQtY29sb3I6ICNlYmViZWIgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdG1hcmdpbjogMCAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0cGFkZGluZzogMCAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwiPC9zdHlsZT5cXG5cIiArXG4gICAgICAgICAgICBcIjwvaGVhZD5cXG5cIiArXG4gICAgICAgICAgICBcIjxib2R5IGxlZnRtYXJnaW49JzAnIG1hcmdpbndpZHRoPScwJyB0b3BtYXJnaW49JzAnIG1hcmdpbmhlaWdodD0nMCcgb2Zmc2V0PScwJyBiYWNrZ3JvdW5kPVxcXCJcXFwiIGJnY29sb3I9JyNlYmViZWInIHN0eWxlPSdmb250LWZhbWlseTpBcmlhbCwgc2Fucy1zZXJpZjsgZm9udC1zaXplOjBweDttYXJnaW46MDtwYWRkaW5nOjA7ICc+XFxuXCIgK1xuICAgICAgICAgICAgXCI8IS0tW2lmIHRdPjwhW2VuZGlmXS0tPjwhLS1baWYgdF0+PCFbZW5kaWZdLS0+PCEtLVtpZiB0XT48IVtlbmRpZl0tLT48IS0tW2lmIHRdPjwhW2VuZGlmXS0tPjwhLS1baWYgdF0+PCFbZW5kaWZdLS0+PCEtLVtpZiB0XT48IVtlbmRpZl0tLT5cXG5cIiArXG4gICAgICAgICAgICBcIjx0YWJsZSBhbGlnbj0nY2VudGVyJyBib3JkZXI9JzAnIGNlbGxwYWRkaW5nPScwJyBjZWxsc3BhY2luZz0nMCcgYmFja2dyb3VuZD1cXFwiXFxcIiAgaGVpZ2h0PScxMDAlJyB3aWR0aD0nMTAwJScgaWQ9J2JhY2tncm91bmRUYWJsZSc+XFxuXCIgK1xuICAgICAgICAgICAgXCIgIDx0cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICA8dGQgY2xhc3M9J3dyYXAnIGFsaWduPSdjZW50ZXInIHZhbGlnbj0ndG9wJyB3aWR0aD0nMTAwJSc+XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRcXHQ8Y2VudGVyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICA8IS0tIGNvbnRlbnQgLS0+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgIFxcdDxkaXYgc3R5bGU9J3BhZGRpbmc6IDBweDsnPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICBcXHQgIDx0YWJsZSBjZWxscGFkZGluZz0nMCcgY2VsbHNwYWNpbmc9JzAnIGJvcmRlcj0nMCcgd2lkdGg9JzEwMCUnIGJnY29sb3I9JyNlYmViZWInPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICBcXHRcXHQgPHRyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgXFx0XFx0ICA8dGQgdmFsaWduPSd0b3AnIHN0eWxlPSdwYWRkaW5nOiAwcHg7Jz5cXG5cIiArXG4gICAgICAgICAgICBcIlxcdFxcdFxcdFxcdFxcdFxcdCAgPHRhYmxlIGNlbGxwYWRkaW5nPScwJyBjZWxsc3BhY2luZz0nMCcgd2lkdGg9JzYwMCcgYWxpZ249J2NlbnRlcicgc3R5bGU9J21heC13aWR0aDogNjAwcHg7bWluLXdpZHRoOiAyNDBweDttYXJnaW46IDAgYXV0bzsnIGNsYXNzPSdlbWFpbC1yb290LXdyYXBwZXInPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICBcXHRcXHQgXFx0XFx0PHRyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgIFxcdFxcdFxcdFxcdFxcdCA8dGQgdmFsaWduPSd0b3AnIHN0eWxlPSdwYWRkaW5nOiAwcHg7Jz5cXG5cIiArXG4gICAgICAgICAgICBcIlxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdCBcXHRcXHQ8dGFibGUgY2VsbHBhZGRpbmc9JzAnIGNlbGxzcGFjaW5nPScwJyBib3JkZXI9JzAnIHdpZHRoPScxMDAlJyBiZ2NvbG9yPScjRkZGRkZGJyBzdHlsZT0nYm9yZGVyOiAwcHggbm9uZTtiYWNrZ3JvdW5kLWNvbG9yOiAjRkZGRkZGOyc+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgIFxcdFxcdFxcdFxcdFxcdFxcdCA8dHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgIFxcdFxcdFxcdCAgXFx0XFx0XFx0XFx0IDx0ZCB2YWxpZ249J3RvcCcgc3R5bGU9J3BhZGRpbmctdG9wOiAzMHB4O3BhZGRpbmctcmlnaHQ6IDIwcHg7cGFkZGluZy1ib3R0b206IDM1cHg7cGFkZGluZy1sZWZ0OiAyMHB4Oyc+XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHQgICBcXHRcXHRcXHRcXHRcXG5cIiArXG4gICAgICAgICAgICBcIlxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdDx0YWJsZSBjZWxscGFkZGluZz0nMCdcXG5cIiArXG4gICAgICAgICAgICBcIlxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdGNlbGxzcGFjaW5nPScwJyBib3JkZXI9JzAnIGFsaWduPSdjZW50ZXInIHdpZHRoPScyNDAnICBzdHlsZT0nYm9yZGVyOiAwcHggbm9uZTtoZWlnaHQ6IGF1dG87JyBjbGFzcz0nZnVsbC13aWR0aCc+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxcdCBcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHQ8dHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdDx0ZCB2YWxpZ249J3RvcCcgc3R5bGU9J3BhZGRpbmc6IDBweDsnPjxpbWcgc3JjPSdodHRwczovL3NmMjYuc2VuZHNmeC5jb20vYWRtaW4vdGVtcC91c2VyLzE3L2RvaWNoYWluXzEwMGgucG5nJyB3aWR0aD0nMjQwJyBoZWlnaHQ9JzMwJyBhbHQ9XFxcIlxcXCIgYm9yZGVyPScwJyBzdHlsZT0nZGlzcGxheTogYmxvY2s7d2lkdGg6IDEwMCU7aGVpZ2h0OiBhdXRvOycgY2xhc3M9J2Z1bGwtd2lkdGggaW1nMjQweDMwJyAvPjwvdGQ+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxcdCBcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHQ8L3RyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdDwvdGFibGU+XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXG5cIiArXG4gICAgICAgICAgICBcIlxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdDwvdGQ+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgXFx0XFx0ICBcXHRcXHRcXHRcXHQ8L3RyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgIFxcdFxcdFxcdFxcdFxcdDwvdGFibGU+XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHQgXFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHQgXFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgPHRhYmxlIGNlbGxwYWRkaW5nPScwJyBjZWxsc3BhY2luZz0nMCcgYm9yZGVyPScwJyB3aWR0aD0nMTAwJScgYmdjb2xvcj0nIzAwNzFhYScgc3R5bGU9J2JvcmRlcjogMHB4IG5vbmU7YmFja2dyb3VuZC1jb2xvcjogIzAwNzFhYTtiYWNrZ3JvdW5kLWltYWdlOiB1cmwoJ2h0dHBzOi8vc2YyNi5zZW5kc2Z4LmNvbS9hZG1pbi90ZW1wL3VzZXIvMTcvYmx1ZS1iZy5qcGcnKTtiYWNrZ3JvdW5kLXJlcGVhdDogbm8tcmVwZWF0IDtiYWNrZ3JvdW5kLXBvc2l0aW9uOiBjZW50ZXI7Jz5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIHZhbGlnbj0ndG9wJyBzdHlsZT0ncGFkZGluZy10b3A6IDQwcHg7cGFkZGluZy1yaWdodDogMjBweDtwYWRkaW5nLWJvdHRvbTogNDVweDtwYWRkaW5nLWxlZnQ6IDIwcHg7Jz48dGFibGUgY2VsbHBhZGRpbmc9JzAnIGNlbGxzcGFjaW5nPScwJyB3aWR0aD0nMTAwJSc+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBzdHlsZT0ncGFkZGluZzogMHB4OycgY2xhc3M9J3BhdHRlcm4nPjx0YWJsZSBjZWxscGFkZGluZz0nMCcgY2VsbHNwYWNpbmc9JzAnIGJvcmRlcj0nMCcgd2lkdGg9JzEwMCUnPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgdmFsaWduPSd0b3AnIHN0eWxlPSdwYWRkaW5nLWJvdHRvbTogMTBweDsnPjxkaXYgc3R5bGU9J3RleHQtYWxpZ246IGxlZnQ7Zm9udC1mYW1pbHk6IGFyaWFsO2ZvbnQtc2l6ZTogMjBweDtjb2xvcjogI2ZmZmZmZjtsaW5lLWhlaWdodDogMzBweDttc28tbGluZS1oZWlnaHQ6IGV4YWN0bHk7bXNvLXRleHQtcmFpc2U6IDVweDsnPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHBcXG5cIiArXG4gICAgICAgICAgICBcInN0eWxlPSdwYWRkaW5nOiAwOyBtYXJnaW46IDA7dGV4dC1hbGlnbjogY2VudGVyOyc+Qml0dGUgYmVzdMOkdGlnZW4gU2llIElocmUgQW5tZWxkdW5nPC9wPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PjwvdGQ+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGFibGU+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRhYmxlIGNlbGxwYWRkaW5nPScwJyBjZWxsc3BhY2luZz0nMCcgYm9yZGVyPScwJyB3aWR0aD0nMTAwJSc+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCB2YWxpZ249J3RvcCcgc3R5bGU9J3BhZGRpbmc6IDA7bXNvLWNlbGxzcGFjaW5nOiAwaW47Jz48dGFibGUgY2VsbHBhZGRpbmc9JzAnIGNlbGxzcGFjaW5nPScwJyBib3JkZXI9JzAnIGFsaWduPSdsZWZ0JyB3aWR0aD0nMTEyJyAgc3R5bGU9J2Zsb2F0OiBsZWZ0OycgY2xhc3M9J2MxMTJwMjByJz5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIHZhbGlnbj0ndG9wJyBzdHlsZT0ncGFkZGluZzogMHB4Oyc+PHRhYmxlIGNlbGxwYWRkaW5nPScwJyBjZWxsc3BhY2luZz0nMCcgYm9yZGVyPScwJyB3aWR0aD0nMTAwJScgc3R5bGU9J2JvcmRlcjogMHB4IG5vbmU7JyBjbGFzcz0naGlkZSc+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCB2YWxpZ249J3RvcCcgc3R5bGU9J3BhZGRpbmc6IDBweDsnPjx0YWJsZSBjZWxscGFkZGluZz0nMCcgY2VsbHNwYWNpbmc9JzAnIHdpZHRoPScxMDAlJz5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIHN0eWxlPSdwYWRkaW5nOiAwcHg7Jz48dGFibGUgY2VsbHBhZGRpbmc9JzAnIGNlbGxzcGFjaW5nPScwJyB3aWR0aD0nMTAwJSc+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBhbGlnbj0nY2VudGVyJyBzdHlsZT0ncGFkZGluZzogMHB4Oyc+PHRhYmxlIGNlbGxwYWRkaW5nPScwJyBjZWxsc3BhY2luZz0nMCcgYm9yZGVyPScwJyBhbGlnbj0nY2VudGVyJyB3aWR0aD0nMjAnICBzdHlsZT0nYm9yZGVyOiAwcHggbm9uZTtoZWlnaHQ6IGF1dG87Jz5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIHZhbGlnbj0ndG9wJyBzdHlsZT0ncGFkZGluZzogMHB4Oyc+PGltZ1xcblwiICtcbiAgICAgICAgICAgIFwic3JjPSdodHRwczovL3NmMjYuc2VuZHNmeC5jb20vYWRtaW4vdGVtcC91c2VyLzE3L2ltZ184OTgzNzMxOC5wbmcnIHdpZHRoPScyMCcgaGVpZ2h0PScyMCcgYWx0PVxcXCJcXFwiIGJvcmRlcj0nMCcgc3R5bGU9J2Rpc3BsYXk6IGJsb2NrOycgY2xhc3M9J2ltZzIweDIwJyAvPjwvdGQ+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGFibGU+PC90ZD5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90YWJsZT48L3RkPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RhYmxlPjwvdGQ+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGFibGU+PC90ZD5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90YWJsZT5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8IS0tW2lmIGd0ZSBtc28gOV0+PC90ZD48dGQgdmFsaWduPSd0b3AnIHN0eWxlPSdwYWRkaW5nOjA7Jz48IVtlbmRpZl0tLT5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGFibGUgY2VsbHBhZGRpbmc9JzAnIGNlbGxzcGFjaW5nPScwJyBib3JkZXI9JzAnIGFsaWduPSdsZWZ0JyB3aWR0aD0nMzM2JyAgc3R5bGU9J2Zsb2F0OiBsZWZ0OycgY2xhc3M9J2MzMzZwNjByJz5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIHZhbGlnbj0ndG9wJyBzdHlsZT0ncGFkZGluZzogMHB4Oyc+PHRhYmxlIGNlbGxwYWRkaW5nPScwJyBjZWxsc3BhY2luZz0nMCcgYm9yZGVyPScwJyB3aWR0aD0nMTAwJSc+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCB2YWxpZ249J3RvcCcgc3R5bGU9J3BhZGRpbmctYm90dG9tOiAzMHB4Oyc+PHRhYmxlIGNlbGxwYWRkaW5nPScwJyBjZWxsc3BhY2luZz0nMCcgd2lkdGg9JzEwMCUnPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgc3R5bGU9J3BhZGRpbmc6IDBweDsnPjx0YWJsZSBjZWxscGFkZGluZz0nMCcgY2VsbHNwYWNpbmc9JzAnIGJvcmRlcj0nMCcgd2lkdGg9JzEwMCUnIHN0eWxlPSdib3JkZXItdG9wOiAycHggc29saWQgI2ZmZmZmZjsnPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgdmFsaWduPSd0b3AnPjx0YWJsZSBjZWxscGFkZGluZz0nMCcgY2VsbHNwYWNpbmc9JzAnIHdpZHRoPScxMDAlJz5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIHN0eWxlPSdwYWRkaW5nOiAwcHg7Jz48L3RkPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RhYmxlPjwvdGQ+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGFibGU+PC90ZD5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90YWJsZT48L3RkPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RhYmxlPjwvdGQ+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGFibGU+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPCEtLVtpZiBndGUgbXNvIDldPjwvdGQ+PHRkIHZhbGlnbj0ndG9wJyBzdHlsZT0ncGFkZGluZzowOyc+PCFbZW5kaWZdLS0+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRhYmxlIGNlbGxwYWRkaW5nPScwJyBjZWxsc3BhY2luZz0nMCcgYm9yZGVyPScwJyBhbGlnbj0nbGVmdCcgd2lkdGg9JzExMicgIHN0eWxlPSdmbG9hdDogbGVmdDsnIGNsYXNzPSdjMTEycDIwcic+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCB2YWxpZ249J3RvcCcgc3R5bGU9J3BhZGRpbmc6IDBweDsnPjx0YWJsZSBjZWxscGFkZGluZz0nMCcgY2VsbHNwYWNpbmc9JzAnIGJvcmRlcj0nMCcgd2lkdGg9JzEwMCUnIHN0eWxlPSdib3JkZXI6IDBweCBub25lOycgY2xhc3M9J2hpZGUnPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgdmFsaWduPSd0b3AnIHN0eWxlPSdwYWRkaW5nOiAwcHg7Jz48dGFibGUgY2VsbHBhZGRpbmc9JzAnIGNlbGxzcGFjaW5nPScwJyB3aWR0aD0nMTAwJSc+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBzdHlsZT0ncGFkZGluZzogMHB4Oyc+PHRhYmxlIGNlbGxwYWRkaW5nPScwJyBjZWxsc3BhY2luZz0nMCcgd2lkdGg9JzEwMCUnPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgYWxpZ249J2NlbnRlcicgc3R5bGU9J3BhZGRpbmc6IDBweDsnPjx0YWJsZSBjZWxscGFkZGluZz0nMCcgY2VsbHNwYWNpbmc9JzAnIGJvcmRlcj0nMCcgYWxpZ249J2NlbnRlcicgd2lkdGg9JzIwJyAgc3R5bGU9J2JvcmRlcjogMHB4IG5vbmU7aGVpZ2h0OiBhdXRvOyc+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCB2YWxpZ249J3RvcCcgc3R5bGU9J3BhZGRpbmc6IDBweDsnPjxpbWcgc3JjPSdodHRwczovL3NmMjYuc2VuZHNmeC5jb20vYWRtaW4vdGVtcC91c2VyLzE3L2ltZ184OTgzNzMxOC5wbmcnIHdpZHRoPScyMCcgaGVpZ2h0PScyMCcgYWx0PVxcXCJcXFwiIGJvcmRlcj0nMCcgc3R5bGU9J2Rpc3BsYXk6IGJsb2NrOycgY2xhc3M9J2ltZzIweDIwJ1xcblwiICtcbiAgICAgICAgICAgIFwiLz48L3RkPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RhYmxlPjwvdGQ+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGFibGU+PC90ZD5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90YWJsZT48L3RkPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RhYmxlPjwvdGQ+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGFibGU+PC90ZD5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90YWJsZT5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGFibGUgY2VsbHBhZGRpbmc9JzAnIGNlbGxzcGFjaW5nPScwJyBib3JkZXI9JzAnIHdpZHRoPScxMDAlJz5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIHZhbGlnbj0ndG9wJyBzdHlsZT0ncGFkZGluZy1ib3R0b206IDIwcHg7Jz48ZGl2IHN0eWxlPSd0ZXh0LWFsaWduOiBsZWZ0O2ZvbnQtZmFtaWx5OiBhcmlhbDtmb250LXNpemU6IDE2cHg7Y29sb3I6ICNmZmZmZmY7bGluZS1oZWlnaHQ6IDI2cHg7bXNvLWxpbmUtaGVpZ2h0OiBleGFjdGx5O21zby10ZXh0LXJhaXNlOiA1cHg7Jz5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwIHN0eWxlPSdwYWRkaW5nOiAwOyBtYXJnaW46IDA7dGV4dC1hbGlnbjogY2VudGVyOyc+VmllbGVuIERhbmssIGRhc3MgU2llIHNpY2ggZsO8ciB1bnNlcmVuIE5ld3NsZXR0ZXIgYW5nZW1lbGRldCBoYWJlbi48L3A+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cCBzdHlsZT0ncGFkZGluZzogMDsgbWFyZ2luOiAwO3RleHQtYWxpZ246IGNlbnRlcjsnPlVtIGRpZXNlIEUtTWFpbC1BZHJlc3NlIHVuZCBJaHJlIGtvc3Rlbmxvc2UgQW5tZWxkdW5nIHp1IGJlc3TDpHRpZ2VuLCBrbGlja2VuIFNpZSBiaXR0ZSBqZXR6dCBhdWYgZGVuIGZvbGdlbmRlbiBCdXR0b246PC9wPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PjwvdGQ+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGFibGU+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRhYmxlIGNlbGxwYWRkaW5nPScwJyBjZWxsc3BhY2luZz0nMCcgd2lkdGg9JzEwMCUnPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgYWxpZ249J2NlbnRlcicgc3R5bGU9J3BhZGRpbmc6IDBweDsnPjx0YWJsZSBjZWxscGFkZGluZz0nMCcgY2VsbHNwYWNpbmc9JzAnIGJvcmRlcj0nMCcgYWxpZ249J2NlbnRlcicgc3R5bGU9J3RleHQtYWxpZ246IGNlbnRlcjtjb2xvcjogIzAwMDsnIGNsYXNzPSdmdWxsLXdpZHRoJz5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIHZhbGlnbj0ndG9wJyBhbGlnbj0nY2VudGVyJyBzdHlsZT0ncGFkZGluZy1yaWdodDogMTBweDtwYWRkaW5nLWJvdHRvbTogMzBweDtwYWRkaW5nLWxlZnQ6IDEwcHg7Jz48dGFibGUgY2VsbHBhZGRpbmc9JzAnIGNlbGxzcGFjaW5nPScwJyBib3JkZXI9JzAnIGJnY29sb3I9JyM4NWFjMWMnIHN0eWxlPSdib3JkZXI6IDBweCBub25lO2JvcmRlci1yYWRpdXM6IDVweDtib3JkZXItY29sbGFwc2U6IHNlcGFyYXRlICFpbXBvcnRhbnQ7YmFja2dyb3VuZC1jb2xvcjogIzg1YWMxYzsnIGNsYXNzPSdmdWxsLXdpZHRoJz5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIHZhbGlnbj0ndG9wJyBhbGlnbj0nY2VudGVyJyBzdHlsZT0ncGFkZGluZzogMTJweDsnPjxhIGhyZWY9JyR7Y29uZmlybWF0aW9uX3VybH0nIHRhcmdldD0nX2JsYW5rJyBzdHlsZT0ndGV4dC1kZWNvcmF0aW9uOiBub25lOycgY2xhc3M9J2VkbV9idXR0b24nPjxzcGFuIHN0eWxlPSdmb250LWZhbWlseTogYXJpYWw7Zm9udC1zaXplOiAxOHB4O2NvbG9yOiAjZmZmZmZmO2xpbmUtaGVpZ2h0OiAyOHB4O3RleHQtZGVjb3JhdGlvbjogbm9uZTsnPjxzcGFuXFxuXCIgK1xuICAgICAgICAgICAgXCJzdHlsZT0nZm9udC1zaXplOiAxOHB4Oyc+SmV0enQgQW5tZWxkdW5nIGJlc3QmYXVtbDt0aWdlbjwvc3Bhbj48L3NwYW4+IDwvYT48L3RkPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RhYmxlPjwvdGQ+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGFibGU+PC90ZD5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90YWJsZT5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPSd0ZXh0LWFsaWduOiBsZWZ0O2ZvbnQtZmFtaWx5OiBhcmlhbDtmb250LXNpemU6IDEycHg7Y29sb3I6ICNmZmZmZmY7bGluZS1oZWlnaHQ6IDIycHg7bXNvLWxpbmUtaGVpZ2h0OiBleGFjdGx5O21zby10ZXh0LXJhaXNlOiA1cHg7Jz5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwIHN0eWxlPSdwYWRkaW5nOiAwOyBtYXJnaW46IDA7dGV4dC1hbGlnbjogY2VudGVyOyc+V2VubiBTaWUgaWhyZSBFLU1haWwtQWRyZXNzZSBuaWNodCBiZXN0w6R0aWdlbiwga8O2bm5lbiBrZWluZSBOZXdzbGV0dGVyIHp1Z2VzdGVsbHQgd2VyZGVuLiBJaHIgRWludmVyc3TDpG5kbmlzIGvDtm5uZW4gU2llIHNlbGJzdHZlcnN0w6RuZGxpY2ggamVkZXJ6ZWl0IHdpZGVycnVmZW4uIFNvbGx0ZSBlcyBzaWNoIGJlaSBkZXIgQW5tZWxkdW5nIHVtIGVpbiBWZXJzZWhlbiBoYW5kZWxuIG9kZXIgd3VyZGUgZGVyIE5ld3NsZXR0ZXIgbmljaHQgaW4gSWhyZW0gTmFtZW4gYmVzdGVsbHQsIGvDtm5uZW4gU2llIGRpZXNlIEUtTWFpbCBlaW5mYWNoIGlnbm9yaWVyZW4uIElobmVuIHdlcmRlbiBrZWluZSB3ZWl0ZXJlbiBOYWNocmljaHRlbiB6dWdlc2NoaWNrdC48L3A+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+PC90ZD5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90YWJsZT48L3RkPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICA8L3RhYmxlPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgIDx0YWJsZSBjZWxscGFkZGluZz0nMCcgY2VsbHNwYWNpbmc9JzAnIGJvcmRlcj0nMCcgd2lkdGg9JzEwMCUnIGJnY29sb3I9JyNmZmZmZmYnIHN0eWxlPSdib3JkZXI6IDBweCBub25lO2JhY2tncm91bmQtY29sb3I6ICNmZmZmZmY7Jz5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIHZhbGlnbj0ndG9wJyBzdHlsZT0ncGFkZGluZy10b3A6IDMwcHg7cGFkZGluZy1yaWdodDogMjBweDtwYWRkaW5nLWJvdHRvbTogMzVweDtwYWRkaW5nLWxlZnQ6IDIwcHg7Jz48dGFibGUgY2VsbHBhZGRpbmc9JzAnIGNlbGxzcGFjaW5nPScwJyB3aWR0aD0nMTAwJSc+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBzdHlsZT0ncGFkZGluZzogMHB4Oyc+PHRhYmxlIGNlbGxwYWRkaW5nPScwJyBjZWxsc3BhY2luZz0nMCcgYm9yZGVyPScwJyB3aWR0aD0nMTAwJSc+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCB2YWxpZ249J3RvcCcgc3R5bGU9J3BhZGRpbmctYm90dG9tOiAyNXB4Oyc+PGRpdiBzdHlsZT0ndGV4dC1hbGlnbjogbGVmdDtmb250LWZhbWlseTogYXJpYWw7Zm9udC1zaXplOiAxMnB4O2NvbG9yOiAjMzMzMzMzO2xpbmUtaGVpZ2h0OiAyMnB4O21zby1saW5lLWhlaWdodDogZXhhY3RseTttc28tdGV4dC1yYWlzZTogNXB4Oyc+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cCBzdHlsZT0ncGFkZGluZzogMDsgbWFyZ2luOiAwO3RleHQtYWxpZ246IGNlbnRlcjsnPjxzcGFuIHN0eWxlPSdsaW5lLWhlaWdodDogMzsnPjxzdHJvbmc+S29udGFrdDwvc3Ryb25nPjwvc3Bhbj48YnI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlcnZpY2VAc2VuZGVmZmVjdC5kZTxicj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd3d3LnNlbmRlZmZlY3QuZGU8YnI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRlbGVmb246ICs0OSAoMCkgODU3MSAtIDk3IDM5IC0gNjktMDwvcD5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj48L3RkPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RhYmxlPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9J3RleHQtYWxpZ246IGxlZnQ7Zm9udC1mYW1pbHk6IGFyaWFsO2ZvbnQtc2l6ZTogMTJweDtjb2xvcjogIzMzMzMzMztsaW5lLWhlaWdodDogMjJweDttc28tbGluZS1oZWlnaHQ6IGV4YWN0bHk7bXNvLXRleHQtcmFpc2U6IDVweDsnPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHAgc3R5bGU9J3BhZGRpbmc6IDA7IG1hcmdpbjogMDt0ZXh0LWFsaWduOiBjZW50ZXI7Jz48c3BhbiBzdHlsZT0nbGluZS1oZWlnaHQ6IDM7Jz48c3Ryb25nPkltcHJlc3N1bTwvc3Ryb25nPjwvc3Bhbj48YnI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFuc2NocmlmdDogU2NodWxnYXNzZSA1LCBELTg0MzU5IFNpbWJhY2ggYW0gSW5uLCBlTWFpbDogc2VydmljZUBzZW5kZWZmZWN0LmRlPGJyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBCZXRyZWliZXI6IFdFQmFuaXplciBBRywgUmVnaXN0ZXJnZXJpY2h0OiBBbXRzZ2VyaWNodCBMYW5kc2h1dCBIUkIgNTE3NywgVXN0SWQuOiBERSAyMDY4IDYyIDA3MDxicj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVm9yc3RhbmQ6IE90dG1hciBOZXVidXJnZXIsIEF1ZnNpY2h0c3JhdDogVG9iaWFzIE5ldWJ1cmdlcjwvcD5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj48L3RkPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RhYmxlPjwvdGQ+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgIDwvdGFibGU+PC90ZD5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgIDwvdHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgPC90YWJsZT48L3RkPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgPC90cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICA8L3RhYmxlPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICA8L2Rpdj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgPCEtLSBjb250ZW50IGVuZCAtLT5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgIDwvY2VudGVyPjwvdGQ+XFxuXCIgK1xuICAgICAgICAgICAgXCIgIDwvdHI+XFxuXCIgK1xuICAgICAgICAgICAgXCI8L3RhYmxlPlwiXG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7XCJzdGF0dXNcIjogXCJzdWNjZXNzXCIsIFwiZGF0YVwiOiBkYXRhfTtcbiAgICB9XG4gIH1cbn0pO1xuIiwiaW1wb3J0IHsgQXBpLCBET0lfRkVUQ0hfUk9VVEUsIERPSV9DT05GSVJNQVRJT05fTk9USUZZX1JPVVRFIH0gZnJvbSAnLi4vcmVzdC5qcyc7XG5pbXBvcnQgYWRkT3B0SW4gZnJvbSAnLi4vLi4vLi4vLi4vaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9vcHQtaW5zL2FkZF9hbmRfd3JpdGVfdG9fYmxvY2tjaGFpbi5qcyc7XG5pbXBvcnQgdXBkYXRlT3B0SW5TdGF0dXMgZnJvbSAnLi4vLi4vLi4vLi4vaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9vcHQtaW5zL3VwZGF0ZV9zdGF0dXMuanMnO1xuaW1wb3J0IGdldERvaU1haWxEYXRhIGZyb20gJy4uLy4uLy4uLy4uL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvZGFwcHMvZ2V0X2RvaS1tYWlsLWRhdGEuanMnO1xuaW1wb3J0IHtsb2dFcnJvciwgbG9nU2VuZH0gZnJvbSBcIi4uLy4uLy4uLy4uL2ltcG9ydHMvc3RhcnR1cC9zZXJ2ZXIvbG9nLWNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7RE9JX0VYUE9SVF9ST1VURX0gZnJvbSBcIi4uL3Jlc3RcIjtcbmltcG9ydCBleHBvcnREb2lzIGZyb20gXCIuLi8uLi8uLi8uLi9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2RhcHBzL2V4cG9ydF9kb2lzXCI7XG5pbXBvcnQge09wdEluc30gZnJvbSBcIi4uLy4uLy4uLy4uL2ltcG9ydHMvYXBpL29wdC1pbnMvb3B0LWluc1wiO1xuaW1wb3J0IHtSb2xlc30gZnJvbSBcIm1ldGVvci9hbGFubmluZzpyb2xlc1wiO1xuXG4vL2Rva3Ugb2YgbWV0ZW9yLXJlc3RpdnVzIGh0dHBzOi8vZ2l0aHViLmNvbS9rYWhtYWxpL21ldGVvci1yZXN0aXZ1c1xuXG5BcGkuYWRkUm91dGUoRE9JX0NPTkZJUk1BVElPTl9OT1RJRllfUk9VVEUsIHtcbiAgcG9zdDoge1xuICAgIGF1dGhSZXF1aXJlZDogdHJ1ZSxcbiAgICAvL3JvbGVSZXF1aXJlZDogWydhZG1pbiddLFxuICAgIGFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBxUGFyYW1zID0gdGhpcy5xdWVyeVBhcmFtcztcbiAgICAgIGNvbnN0IGJQYXJhbXMgPSB0aGlzLmJvZHlQYXJhbXM7XG4gICAgICBsZXQgcGFyYW1zID0ge31cbiAgICAgIGlmKHFQYXJhbXMgIT09IHVuZGVmaW5lZCkgcGFyYW1zID0gey4uLnFQYXJhbXN9XG4gICAgICBpZihiUGFyYW1zICE9PSB1bmRlZmluZWQpIHBhcmFtcyA9IHsuLi5wYXJhbXMsIC4uLmJQYXJhbXN9XG5cbiAgICAgIGNvbnN0IHVpZCA9IHRoaXMudXNlcklkO1xuXG4gICAgICBpZighUm9sZXMudXNlcklzSW5Sb2xlKHVpZCwgJ2FkbWluJykgfHwgLy9pZiBpdHMgbm90IGFuIGFkbWluIGFsd2F5cyB1c2UgdWlkIGFzIG93bmVySWRcbiAgICAgICAgICAoUm9sZXMudXNlcklzSW5Sb2xlKHVpZCwgJ2FkbWluJykgJiYgKHBhcmFtc1tcIm93bmVySWRcIl09PW51bGwgfHwgcGFyYW1zW1wib3duZXJJZFwiXT09dW5kZWZpbmVkKSkpIHsgIC8vaWYgaXRzIGFuIGFkbWluIG9ubHkgdXNlIHVpZCBpbiBjYXNlIG5vIG93bmVySWQgd2FzIGdpdmVuXG4gICAgICAgICAgcGFyYW1zW1wib3duZXJJZFwiXSA9IHVpZDtcbiAgICAgIH1cblxuICAgICAgbG9nU2VuZCgncGFyYW1ldGVyIHJlY2VpdmVkIGZyb20gYnJvd3NlcjonLHBhcmFtcyk7XG4gICAgICBpZihwYXJhbXMuc2VuZGVyX21haWwuY29uc3RydWN0b3IgPT09IEFycmF5KXsgLy90aGlzIGlzIGEgU09JIHdpdGggY28tc3BvbnNvcnMgZmlyc3QgZW1haWwgaXMgbWFpbiBzcG9uc29yXG4gICAgICAgICAgcmV0dXJuIHByZXBhcmVDb0RPSShwYXJhbXMpO1xuICAgICAgfWVsc2V7XG4gICAgICAgICByZXR1cm4gcHJlcGFyZUFkZChwYXJhbXMpO1xuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgcHV0OiB7XG4gICAgYXV0aFJlcXVpcmVkOiBmYWxzZSxcbiAgICBhY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgcVBhcmFtcyA9IHRoaXMucXVlcnlQYXJhbXM7XG4gICAgICBjb25zdCBiUGFyYW1zID0gdGhpcy5ib2R5UGFyYW1zO1xuXG4gICAgICBsb2dTZW5kKCdxUGFyYW1zOicscVBhcmFtcyk7XG4gICAgICBsb2dTZW5kKCdiUGFyYW1zOicsYlBhcmFtcyk7XG5cbiAgICAgIGxldCBwYXJhbXMgPSB7fVxuICAgICAgaWYocVBhcmFtcyAhPT0gdW5kZWZpbmVkKSBwYXJhbXMgPSB7Li4ucVBhcmFtc31cbiAgICAgIGlmKGJQYXJhbXMgIT09IHVuZGVmaW5lZCkgcGFyYW1zID0gey4uLnBhcmFtcywgLi4uYlBhcmFtc31cbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHZhbCA9IHVwZGF0ZU9wdEluU3RhdHVzKHBhcmFtcyk7XG4gICAgICAgIGxvZ1NlbmQoJ29wdC1JbiBzdGF0dXMgdXBkYXRlZCcsdmFsKTtcbiAgICAgICAgcmV0dXJuIHtzdGF0dXM6ICdzdWNjZXNzJywgZGF0YToge21lc3NhZ2U6ICdPcHQtSW4gc3RhdHVzIHVwZGF0ZWQnfX07XG4gICAgICB9IGNhdGNoKGVycm9yKSB7XG4gICAgICAgIHJldHVybiB7c3RhdHVzQ29kZTogNTAwLCBib2R5OiB7c3RhdHVzOiAnZmFpbCcsIG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2V9fTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn0pO1xuXG5BcGkuYWRkUm91dGUoRE9JX0ZFVENIX1JPVVRFLCB7YXV0aFJlcXVpcmVkOiBmYWxzZX0sIHtcbiAgZ2V0OiB7XG4gICAgYWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IHBhcmFtcyA9IHRoaXMucXVlcnlQYXJhbXM7XG4gICAgICB0cnkge1xuICAgICAgICAgIGxvZ1NlbmQoJ3Jlc3QgYXBpIC0gRE9JX0ZFVENIX1JPVVRFIGNhbGxlZCBieSBib2IgdG8gcmVxdWVzdCBlbWFpbCB0ZW1wbGF0ZScsSlNPTi5zdHJpbmdpZnkocGFyYW1zKSk7XG4gICAgICAgICAgY29uc3QgZGF0YSA9IGdldERvaU1haWxEYXRhKHBhcmFtcyk7XG4gICAgICAgICAgbG9nU2VuZCgnZ290IGRvaS1tYWlsLWRhdGEgKGluY2x1ZGluZyB0ZW1wbGFsdGUpIHJldHVybmluZyB0byBib2InLHtzdWJqZWN0OmRhdGEuc3ViamVjdCwgcmVjaXBpZW50OmRhdGEucmVjaXBpZW50fSk7XG4gICAgICAgIHJldHVybiB7c3RhdHVzOiAnc3VjY2VzcycsIGRhdGF9O1xuICAgICAgfSBjYXRjaChlcnJvcikge1xuICAgICAgICBsb2dFcnJvcignZXJyb3Igd2hpbGUgZ2V0dGluZyBEb2lNYWlsRGF0YScsZXJyb3IpO1xuICAgICAgICByZXR1cm4ge3N0YXR1czogJ2ZhaWwnLCBlcnJvcjogZXJyb3IubWVzc2FnZX07XG4gICAgICB9XG4gICAgfVxuICB9XG59KTtcblxuQXBpLmFkZFJvdXRlKERPSV9FWFBPUlRfUk9VVEUsIHtcbiAgICBnZXQ6IHtcbiAgICAgICAgYXV0aFJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAvL3JvbGVSZXF1aXJlZDogWydhZG1pbiddLFxuICAgICAgICBhY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgbGV0IHBhcmFtcyA9IHRoaXMucXVlcnlQYXJhbXM7XG4gICAgICAgICAgICBjb25zdCB1aWQgPSB0aGlzLnVzZXJJZDtcbiAgICAgICAgICAgIGlmKCFSb2xlcy51c2VySXNJblJvbGUodWlkLCAnYWRtaW4nKSl7XG4gICAgICAgICAgICAgICAgcGFyYW1zID0ge3VzZXJpZDp1aWQscm9sZTondXNlcid9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICBwYXJhbXMgPSB7Li4ucGFyYW1zLHJvbGU6J2FkbWluJ31cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgbG9nU2VuZCgncmVzdCBhcGkgLSBET0lfRVhQT1JUX1JPVVRFIGNhbGxlZCcsSlNPTi5zdHJpbmdpZnkocGFyYW1zKSk7XG4gICAgICAgICAgICAgICAgY29uc3QgZGF0YSA9IGV4cG9ydERvaXMocGFyYW1zKTtcbiAgICAgICAgICAgICAgICBsb2dTZW5kKCdnb3QgZG9pcyBmcm9tIGRhdGFiYXNlJyxKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtzdGF0dXM6ICdzdWNjZXNzJywgZGF0YX07XG4gICAgICAgICAgICB9IGNhdGNoKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgbG9nRXJyb3IoJ2Vycm9yIHdoaWxlIGV4cG9ydGluZyBjb25maXJtZWQgZG9pcycsZXJyb3IpO1xuICAgICAgICAgICAgICAgIHJldHVybiB7c3RhdHVzOiAnZmFpbCcsIGVycm9yOiBlcnJvci5tZXNzYWdlfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn0pO1xuXG5mdW5jdGlvbiBwcmVwYXJlQ29ET0kocGFyYW1zKXtcblxuICAgIGxvZ1NlbmQoJ2lzIGFycmF5ICcscGFyYW1zLnNlbmRlcl9tYWlsKTtcblxuICAgIGNvbnN0IHNlbmRlcnMgPSBwYXJhbXMuc2VuZGVyX21haWw7XG4gICAgY29uc3QgcmVjaXBpZW50X21haWwgPSBwYXJhbXMucmVjaXBpZW50X21haWw7XG4gICAgY29uc3QgZGF0YSA9IHBhcmFtcy5kYXRhO1xuICAgIGNvbnN0IG93bmVySUQgPSBwYXJhbXMub3duZXJJZDtcblxuICAgIGxldCBjdXJyZW50T3B0SW5JZDtcbiAgICBsZXQgcmV0UmVzcG9uc2UgPSBbXTtcbiAgICBsZXQgbWFzdGVyX2RvaTtcbiAgICBzZW5kZXJzLmZvckVhY2goKHNlbmRlcixpbmRleCkgPT4ge1xuXG4gICAgICAgIGNvbnN0IHJldF9yZXNwb25zZSA9IHByZXBhcmVBZGQoe3NlbmRlcl9tYWlsOnNlbmRlcixyZWNpcGllbnRfbWFpbDpyZWNpcGllbnRfbWFpbCxkYXRhOmRhdGEsIG1hc3Rlcl9kb2k6bWFzdGVyX2RvaSwgaW5kZXg6IGluZGV4LCBvd25lcklkOm93bmVySUR9KTtcbiAgICAgICAgbG9nU2VuZCgnQ29ET0k6JyxyZXRfcmVzcG9uc2UpO1xuICAgICAgICBpZihyZXRfcmVzcG9uc2Uuc3RhdHVzID09PSB1bmRlZmluZWQgfHwgcmV0X3Jlc3BvbnNlLnN0YXR1cz09PVwiZmFpbGVkXCIpIHRocm93IFwiY291bGQgbm90IGFkZCBjby1vcHQtaW5cIjtcbiAgICAgICAgcmV0UmVzcG9uc2UucHVzaChyZXRfcmVzcG9uc2UpO1xuICAgICAgICBjdXJyZW50T3B0SW5JZCA9IHJldF9yZXNwb25zZS5kYXRhLmlkO1xuXG4gICAgICAgIGlmKGluZGV4PT09MClcbiAgICAgICAge1xuICAgICAgICAgICAgbG9nU2VuZCgnbWFpbiBzcG9uc29yIG9wdEluSWQ6JyxjdXJyZW50T3B0SW5JZCk7XG4gICAgICAgICAgICBjb25zdCBvcHRJbiA9IE9wdElucy5maW5kT25lKHtfaWQ6IGN1cnJlbnRPcHRJbklkfSk7XG4gICAgICAgICAgICBtYXN0ZXJfZG9pID0gb3B0SW4ubmFtZUlkO1xuICAgICAgICAgICAgbG9nU2VuZCgnbWFpbiBzcG9uc29yIG5hbWVJZDonLG1hc3Rlcl9kb2kpO1xuICAgICAgICB9XG5cbiAgICB9KTtcblxuICAgIGxvZ1NlbmQocmV0UmVzcG9uc2UpO1xuXG4gICAgcmV0dXJuIHJldFJlc3BvbnNlO1xufVxuXG5mdW5jdGlvbiBwcmVwYXJlQWRkKHBhcmFtcyl7XG5cbiAgICB0cnkge1xuICAgICAgICBjb25zdCB2YWwgPSBhZGRPcHRJbihwYXJhbXMpO1xuICAgICAgICBsb2dTZW5kKCdvcHQtSW4gYWRkZWQgSUQ6Jyx2YWwpO1xuICAgICAgICByZXR1cm4ge3N0YXR1czogJ3N1Y2Nlc3MnLCBkYXRhOiB7aWQ6IHZhbCwgc3RhdHVzOiAnc3VjY2VzcycsIG1lc3NhZ2U6ICdPcHQtSW4gYWRkZWQuJ319O1xuICAgIH0gY2F0Y2goZXJyb3IpIHtcbiAgICAgICAgcmV0dXJuIHtzdGF0dXNDb2RlOiA1MDAsIGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogZXJyb3IubWVzc2FnZX19O1xuICAgIH1cbn0iLCJpbXBvcnQgeyBBcGkgfSBmcm9tICcuLi9yZXN0LmpzJztcbmltcG9ydCB7TWV0ZW9yfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCB7QWNjb3VudHN9IGZyb20gJ21ldGVvci9hY2NvdW50cy1iYXNlJ1xuaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tICdzaW1wbC1zY2hlbWEnO1xuaW1wb3J0IHtSb2xlc30gZnJvbSBcIm1ldGVvci9hbGFubmluZzpyb2xlc1wiO1xuaW1wb3J0IHtsb2dNYWlufSBmcm9tIFwiLi4vLi4vLi4vLi4vaW1wb3J0cy9zdGFydHVwL3NlcnZlci9sb2ctY29uZmlndXJhdGlvblwiO1xuXG5jb25zdCBtYWlsVGVtcGxhdGVTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgICBzdWJqZWN0OiB7XG4gICAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgICAgb3B0aW9uYWw6dHJ1ZSBcbiAgICB9LFxuICAgIHJlZGlyZWN0OiB7XG4gICAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgICAgcmVnRXg6IFwiQChodHRwcz98ZnRwKTovLygtXFxcXC4pPyhbXlxcXFxzLz9cXFxcLiMtXStcXFxcLj8pKygvW15cXFxcc10qKT8kQFwiLFxuICAgICAgICBvcHRpb25hbDp0cnVlIFxuICAgIH0sXG4gICAgcmV0dXJuUGF0aDoge1xuICAgICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICAgIHJlZ0V4OiBTaW1wbGVTY2hlbWEuUmVnRXguRW1haWwsXG4gICAgICAgIG9wdGlvbmFsOnRydWUgXG4gICAgfSxcbiAgICB0ZW1wbGF0ZVVSTDp7XG4gICAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgICAgcmVnRXg6IFwiQChodHRwcz98ZnRwKTovLygtXFxcXC4pPyhbXlxcXFxzLz9cXFxcLiMtXStcXFxcLj8pKygvW15cXFxcc10qKT8kQFwiLFxuICAgICAgICBvcHRpb25hbDp0cnVlIFxuICAgIH1cbn0pO1xuXG5jb25zdCBjcmVhdGVVc2VyU2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gICAgdXNlcm5hbWU6IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIHJlZ0V4OiBcIl5bQS1aLGEteiwwLTksISxfLCQsI117NCwyNH0kXCIgIC8vT25seSB1c2VybmFtZXMgYmV0d2VlbiA0LTI0IGNoYXJhY3RlcnMgZnJvbSBBLVosYS16LDAtOSwhLF8sJCwjIGFsbG93ZWRcbiAgICB9LFxuICAgIGVtYWlsOiB7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICByZWdFeDogU2ltcGxlU2NoZW1hLlJlZ0V4LkVtYWlsXG4gICAgfSxcbiAgICBwYXNzd29yZDoge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgcmVnRXg6IFwiXltBLVosYS16LDAtOSwhLF8sJCwjXXs4LDI0fSRcIiAvL09ubHkgcGFzc3dvcmRzIGJldHdlZW4gOC0yNCBjaGFyYWN0ZXJzIGZyb20gQS1aLGEteiwwLTksISxfLCQsIyBhbGxvd2VkXG4gICAgfSxcbiAgICBtYWlsVGVtcGxhdGU6e1xuICAgICAgICB0eXBlOiBtYWlsVGVtcGxhdGVTY2hlbWEsXG4gICAgICAgIG9wdGlvbmFsOnRydWUgXG4gICAgfVxuICB9KTtcbiAgY29uc3QgdXBkYXRlVXNlclNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICAgIG1haWxUZW1wbGF0ZTp7XG4gICAgICAgIHR5cGU6IG1haWxUZW1wbGF0ZVNjaGVtYVxuICAgIH1cbn0pO1xuXG4vL1RPRE86IGNvbGxlY3Rpb24gb3B0aW9ucyBzZXBhcmF0ZVxuY29uc3QgY29sbGVjdGlvbk9wdGlvbnMgPVxuICB7XG4gICAgcGF0aDpcInVzZXJzXCIsXG4gICAgcm91dGVPcHRpb25zOlxuICAgIHtcbiAgICAgICAgYXV0aFJlcXVpcmVkIDogdHJ1ZVxuICAgICAgICAvLyxyb2xlUmVxdWlyZWQgOiBcImFkbWluXCJcbiAgICB9LFxuICAgIGV4Y2x1ZGVkRW5kcG9pbnRzOiBbJ3BhdGNoJywnZGVsZXRlQWxsJ10sXG4gICAgZW5kcG9pbnRzOlxuICAgIHtcbiAgICAgICAgZGVsZXRlOntyb2xlUmVxdWlyZWQgOiBcImFkbWluXCJ9LFxuICAgICAgICBwb3N0OlxuICAgICAgICB7XG4gICAgICAgICAgICByb2xlUmVxdWlyZWQgOiBcImFkbWluXCIsXG4gICAgICAgICAgICBhY3Rpb246IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgY29uc3QgcVBhcmFtcyA9IHRoaXMucXVlcnlQYXJhbXM7XG4gICAgICAgICAgICAgICAgY29uc3QgYlBhcmFtcyA9IHRoaXMuYm9keVBhcmFtcztcbiAgICAgICAgICAgICAgICBsZXQgcGFyYW1zID0ge307XG4gICAgICAgICAgICAgICAgaWYocVBhcmFtcyAhPT0gdW5kZWZpbmVkKSBwYXJhbXMgPSB7Li4ucVBhcmFtc31cbiAgICAgICAgICAgICAgICBpZihiUGFyYW1zICE9PSB1bmRlZmluZWQpIHBhcmFtcyA9IHsuLi5wYXJhbXMsIC4uLmJQYXJhbXN9XG4gICAgICAgICAgICAgICAgdHJ5e1xuICAgICAgICAgICAgICAgICAgICBsZXQgdXNlcklkO1xuICAgICAgICAgICAgICAgICAgICBjcmVhdGVVc2VyU2NoZW1hLnZhbGlkYXRlKHBhcmFtcyk7XG4gICAgICAgICAgICAgICAgICAgIGxvZ01haW4oJ3ZhbGlkYXRlZCcscGFyYW1zKTtcbiAgICAgICAgICAgICAgICAgICAgaWYocGFyYW1zLm1haWxUZW1wbGF0ZSAhPT0gdW5kZWZpbmVkKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVzZXJJZCA9IEFjY291bnRzLmNyZWF0ZVVzZXIoe3VzZXJuYW1lOnBhcmFtcy51c2VybmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbWFpbDpwYXJhbXMuZW1haWwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFzc3dvcmQ6cGFyYW1zLnBhc3N3b3JkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb2ZpbGU6e21haWxUZW1wbGF0ZTpwYXJhbXMubWFpbFRlbXBsYXRlfX0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgICAgICAgICB1c2VySWQgPSBBY2NvdW50cy5jcmVhdGVVc2VyKHt1c2VybmFtZTpwYXJhbXMudXNlcm5hbWUsZW1haWw6cGFyYW1zLmVtYWlsLHBhc3N3b3JkOnBhcmFtcy5wYXNzd29yZCwgcHJvZmlsZTp7fX0pO1xuICAgICAgICAgICAgICAgICAgICB9ICAgIFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge3N0YXR1czogJ3N1Y2Nlc3MnLCBkYXRhOiB7dXNlcmlkOiB1c2VySWR9fTtcbiAgICAgICAgICAgICAgICB9IGNhdGNoKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4ge3N0YXR1c0NvZGU6IDQwMCwgYm9keToge3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiBlcnJvci5tZXNzYWdlfX07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBwdXQ6XG4gICAgICAgIHtcbiAgICAgICAgICAgIGFjdGlvbjogZnVuY3Rpb24oKXsgICAgICBcbiAgICAgICAgICAgICAgICBjb25zdCBxUGFyYW1zID0gdGhpcy5xdWVyeVBhcmFtcztcbiAgICAgICAgICAgICAgICBjb25zdCBiUGFyYW1zID0gdGhpcy5ib2R5UGFyYW1zO1xuICAgICAgICAgICAgICAgIGxldCBwYXJhbXMgPSB7fTtcbiAgICAgICAgICAgICAgICBsZXQgdWlkPXRoaXMudXNlcklkO1xuICAgICAgICAgICAgICAgIGNvbnN0IHBhcmFtSWQ9dGhpcy51cmxQYXJhbXMuaWQ7XG4gICAgICAgICAgICAgICAgaWYocVBhcmFtcyAhPT0gdW5kZWZpbmVkKSBwYXJhbXMgPSB7Li4ucVBhcmFtc31cbiAgICAgICAgICAgICAgICBpZihiUGFyYW1zICE9PSB1bmRlZmluZWQpIHBhcmFtcyA9IHsuLi5wYXJhbXMsIC4uLmJQYXJhbXN9XG5cbiAgICAgICAgICAgICAgICB0cnl7IC8vVE9ETyB0aGlzIGlzIG5vdCBuZWNlc3NhcnkgaGVyZSBhbmQgY2FuIHByb2JhYmx5IGdvIHJpZ2h0IGludG8gdGhlIGRlZmluaXRpb24gb2YgdGhlIFJFU1QgTUVUSE9EIG5leHQgdG8gcHV0ICghPyEpXG4gICAgICAgICAgICAgICAgICAgIGlmKCFSb2xlcy51c2VySXNJblJvbGUodWlkLCAnYWRtaW4nKSl7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZih1aWQhPT1wYXJhbUlkKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBFcnJvcihcIk5vIFBlcm1pc3Npb25cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlVXNlclNjaGVtYS52YWxpZGF0ZShwYXJhbXMpO1xuICAgICAgICAgICAgICAgICAgICBpZighTWV0ZW9yLnVzZXJzLnVwZGF0ZSh0aGlzLnVybFBhcmFtcy5pZCx7JHNldDp7XCJwcm9maWxlLm1haWxUZW1wbGF0ZVwiOnBhcmFtcy5tYWlsVGVtcGxhdGV9fSkpe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJGYWlsZWQgdG8gdXBkYXRlIHVzZXJcIik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtzdGF0dXM6ICdzdWNjZXNzJywgZGF0YToge3VzZXJpZDogdGhpcy51cmxQYXJhbXMuaWQsIG1haWxUZW1wbGF0ZTpwYXJhbXMubWFpbFRlbXBsYXRlfX07XG4gICAgICAgICAgICAgICAgfSBjYXRjaChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIHtzdGF0dXNDb2RlOiA0MDAsIGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogZXJyb3IubWVzc2FnZX19O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cbkFwaS5hZGRDb2xsZWN0aW9uKE1ldGVvci51c2Vycyxjb2xsZWN0aW9uT3B0aW9ucyk7IiwiaW1wb3J0IHsgQXBpIH0gZnJvbSAnLi4vcmVzdC5qcyc7XG5pbXBvcnQgdmVyaWZ5T3B0SW4gZnJvbSAnLi4vLi4vLi4vLi4vaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9vcHQtaW5zL3ZlcmlmeS5qcyc7XG5cbkFwaS5hZGRSb3V0ZSgnb3B0LWluL3ZlcmlmeScsIHthdXRoUmVxdWlyZWQ6IHRydWV9LCB7XG4gIGdldDoge1xuICAgIGF1dGhSZXF1aXJlZDogZmFsc2UsXG4gICAgYWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgY29uc3QgcVBhcmFtcyA9IHRoaXMucXVlcnlQYXJhbXM7XG4gICAgICAgIGNvbnN0IGJQYXJhbXMgPSB0aGlzLmJvZHlQYXJhbXM7XG4gICAgICAgIGxldCBwYXJhbXMgPSB7fVxuICAgICAgICBpZihxUGFyYW1zICE9PSB1bmRlZmluZWQpIHBhcmFtcyA9IHsuLi5xUGFyYW1zfVxuICAgICAgICBpZihiUGFyYW1zICE9PSB1bmRlZmluZWQpIHBhcmFtcyA9IHsuLi5wYXJhbXMsIC4uLmJQYXJhbXN9XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHZhbCA9IHZlcmlmeU9wdEluKHBhcmFtcyk7XG4gICAgICAgIHJldHVybiB7c3RhdHVzOiBcInN1Y2Nlc3NcIiwgZGF0YToge3ZhbH19O1xuICAgICAgfSBjYXRjaChlcnJvcikge1xuICAgICAgICByZXR1cm4ge3N0YXR1c0NvZGU6IDUwMCwgYm9keToge3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiBlcnJvci5tZXNzYWdlfX07XG4gICAgICB9XG4gICAgfVxuICB9XG59KTtcbiIsImltcG9ydCB7IFJlc3RpdnVzIH0gZnJvbSAnbWV0ZW9yL25pbWJsZTpyZXN0aXZ1cyc7XG5pbXBvcnQgeyBpc0RlYnVnIH0gZnJvbSAnLi4vLi4vLi4vaW1wb3J0cy9zdGFydHVwL3NlcnZlci9kYXBwLWNvbmZpZ3VyYXRpb24uanMnO1xuaW1wb3J0IHsgU0VORF9BUFAsIENPTkZJUk1fQVBQLCBWRVJJRllfQVBQLCBpc0FwcFR5cGUgfSBmcm9tICcuLi8uLi8uLi9pbXBvcnRzL3N0YXJ0dXAvc2VydmVyL3R5cGUtY29uZmlndXJhdGlvbi5qcyc7XG5cbmV4cG9ydCBjb25zdCBET0lfQ09ORklSTUFUSU9OX1JPVVRFID0gXCJvcHQtaW4vY29uZmlybVwiO1xuZXhwb3J0IGNvbnN0IERPSV9DT05GSVJNQVRJT05fTk9USUZZX1JPVVRFID0gXCJvcHQtaW5cIjtcbmV4cG9ydCBjb25zdCBET0lfV0FMTEVUTk9USUZZX1JPVVRFID0gXCJ3YWxsZXRub3RpZnlcIjtcbmV4cG9ydCBjb25zdCBET0lfRkVUQ0hfUk9VVEUgPSBcImRvaS1tYWlsXCI7XG5leHBvcnQgY29uc3QgRE9JX0VYUE9SVF9ST1VURSA9IFwiZXhwb3J0XCI7XG5leHBvcnQgY29uc3QgQVBJX1BBVEggPSBcImFwaS9cIjtcbmV4cG9ydCBjb25zdCBWRVJTSU9OID0gXCJ2MVwiO1xuXG5leHBvcnQgY29uc3QgQXBpID0gbmV3IFJlc3RpdnVzKHtcbiAgYXBpUGF0aDogQVBJX1BBVEgsXG4gIHZlcnNpb246IFZFUlNJT04sXG4gIHVzZURlZmF1bHRBdXRoOiB0cnVlLFxuICBwcmV0dHlKc29uOiB0cnVlXG59KTtcblxuaWYoaXNEZWJ1ZygpKSByZXF1aXJlKCcuL2ltcG9ydHMvZGVidWcuanMnKTtcbmlmKGlzQXBwVHlwZShTRU5EX0FQUCkpIHJlcXVpcmUoJy4vaW1wb3J0cy9zZW5kLmpzJyk7XG5pZihpc0FwcFR5cGUoQ09ORklSTV9BUFApKSByZXF1aXJlKCcuL2ltcG9ydHMvY29uZmlybS5qcycpO1xuaWYoaXNBcHBUeXBlKFZFUklGWV9BUFApKSByZXF1aXJlKCcuL2ltcG9ydHMvdmVyaWZ5LmpzJyk7XG5yZXF1aXJlKCcuL2ltcG9ydHMvdXNlci5qcycpO1xucmVxdWlyZSgnLi9pbXBvcnRzL3N0YXR1cy5qcycpO1xuIiwiXG5pbXBvcnQgeyBKb2JDb2xsZWN0aW9uLEpvYiB9IGZyb20gJ21ldGVvci92c2l2c2k6am9iLWNvbGxlY3Rpb24nO1xuZXhwb3J0IGNvbnN0IEJsb2NrY2hhaW5Kb2JzID0gSm9iQ29sbGVjdGlvbignYmxvY2tjaGFpbicpO1xuaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgaW5zZXJ0IGZyb20gJy4uLy4uL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvZG9pY2hhaW4vaW5zZXJ0LmpzJztcbmltcG9ydCB1cGRhdGUgZnJvbSAnLi4vLi4vaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9kb2ljaGFpbi91cGRhdGUuanMnO1xuLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLXZhcnMgKi8gLy9UT0RPIHJlLWVuYWJsZSB0aGlzIVxuaW1wb3J0IGNoZWNrTmV3VHJhbnNhY3Rpb24gZnJvbSAnLi4vLi4vaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9kb2ljaGFpbi9jaGVja19uZXdfdHJhbnNhY3Rpb25zLmpzJztcbmltcG9ydCB7IENPTkZJUk1fQVBQLCBpc0FwcFR5cGUgfSBmcm9tICcuLi8uLi9pbXBvcnRzL3N0YXJ0dXAvc2VydmVyL3R5cGUtY29uZmlndXJhdGlvbi5qcyc7XG5pbXBvcnQge2xvZ01haW59IGZyb20gXCIuLi8uLi9pbXBvcnRzL3N0YXJ0dXAvc2VydmVyL2xvZy1jb25maWd1cmF0aW9uXCI7XG5cbkJsb2NrY2hhaW5Kb2JzLnByb2Nlc3NKb2JzKCdpbnNlcnQnLCB7d29ya1RpbWVvdXQ6IDMwKjEwMDB9LGZ1bmN0aW9uIChqb2IsIGNiKSB7XG4gIHRyeSB7XG4gICAgY29uc3QgZW50cnkgPSBqb2IuZGF0YTtcbiAgICBpbnNlcnQoZW50cnkpO1xuICAgIGpvYi5kb25lKCk7XG4gIH0gY2F0Y2goZXhjZXB0aW9uKSB7XG4gICAgam9iLmZhaWwoKTtcblxuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignam9icy5ibG9ja2NoYWluLmluc2VydC5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9IGZpbmFsbHkge1xuICAgIGNiKCk7XG4gIH1cbn0pO1xuXG5CbG9ja2NoYWluSm9icy5wcm9jZXNzSm9icygndXBkYXRlJywge3dvcmtUaW1lb3V0OiAzMCoxMDAwfSxmdW5jdGlvbiAoam9iLCBjYikge1xuICB0cnkge1xuICAgIGNvbnN0IGVudHJ5ID0gam9iLmRhdGE7XG4gICAgdXBkYXRlKGVudHJ5LGpvYik7XG4gIH0gY2F0Y2goZXhjZXB0aW9uKSB7XG4gICAgam9iLmZhaWwoKTtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdqb2JzLmJsb2NrY2hhaW4udXBkYXRlLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH0gZmluYWxseSB7XG4gICAgY2IoKTtcbiAgfVxufSk7XG5cbkJsb2NrY2hhaW5Kb2JzLnByb2Nlc3NKb2JzKCdjaGVja05ld1RyYW5zYWN0aW9uJywge3dvcmtUaW1lb3V0OiAzMCoxMDAwfSxmdW5jdGlvbiAoam9iLCBjYikge1xuICB0cnkge1xuICAgIGlmKCFpc0FwcFR5cGUoQ09ORklSTV9BUFApKSB7XG4gICAgICBqb2IucGF1c2UoKTtcbiAgICAgIGpvYi5jYW5jZWwoKTtcbiAgICAgIGpvYi5yZW1vdmUoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy9jaGVja05ld1RyYW5zYWN0aW9uKG51bGwsam9iKTtcbiAgICB9XG4gIH0gY2F0Y2goZXhjZXB0aW9uKSB7XG4gICAgam9iLmZhaWwoKTtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdqb2JzLmJsb2NrY2hhaW4uY2hlY2tOZXdUcmFuc2FjdGlvbnMuZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgfSBmaW5hbGx5IHtcbiAgICBjYigpO1xuICB9XG59KTtcblxubmV3IEpvYihCbG9ja2NoYWluSm9icywgJ2NsZWFudXAnLCB7fSlcbiAgICAucmVwZWF0KHsgc2NoZWR1bGU6IEJsb2NrY2hhaW5Kb2JzLmxhdGVyLnBhcnNlLnRleHQoXCJldmVyeSA1IG1pbnV0ZXNcIikgfSlcbiAgICAuc2F2ZSh7Y2FuY2VsUmVwZWF0czogdHJ1ZX0pO1xuXG5sZXQgcSA9IEJsb2NrY2hhaW5Kb2JzLnByb2Nlc3NKb2JzKCdjbGVhbnVwJyx7IHBvbGxJbnRlcnZhbDogZmFsc2UsIHdvcmtUaW1lb3V0OiA2MCoxMDAwIH0gLGZ1bmN0aW9uIChqb2IsIGNiKSB7XG4gIGNvbnN0IGN1cnJlbnQgPSBuZXcgRGF0ZSgpXG4gICAgY3VycmVudC5zZXRNaW51dGVzKGN1cnJlbnQuZ2V0TWludXRlcygpIC0gNSk7XG5cbiAgY29uc3QgaWRzID0gQmxvY2tjaGFpbkpvYnMuZmluZCh7XG4gICAgICAgICAgc3RhdHVzOiB7JGluOiBKb2Iuam9iU3RhdHVzUmVtb3ZhYmxlfSxcbiAgICAgICAgICB1cGRhdGVkOiB7JGx0OiBjdXJyZW50fX0sXG4gICAgICAgICAge2ZpZWxkczogeyBfaWQ6IDEgfX0pO1xuXG4gICAgbG9nTWFpbignZm91bmQgIHJlbW92YWJsZSBibG9ja2NoYWluIGpvYnM6JyxpZHMpO1xuICAgIEJsb2NrY2hhaW5Kb2JzLnJlbW92ZUpvYnMoaWRzKTtcbiAgICBpZihpZHMubGVuZ3RoID4gMCl7XG4gICAgICBqb2IuZG9uZShcIlJlbW92ZWQgI3tpZHMubGVuZ3RofSBvbGQgam9ic1wiKTtcbiAgICB9XG4gICAgY2IoKTtcbn0pO1xuXG5CbG9ja2NoYWluSm9icy5maW5kKHsgdHlwZTogJ2pvYlR5cGUnLCBzdGF0dXM6ICdyZWFkeScgfSlcbiAgICAub2JzZXJ2ZSh7XG4gICAgICAgIGFkZGVkOiBmdW5jdGlvbiAoKSB7IHEudHJpZ2dlcigpOyB9XG4gICAgfSk7XG4iLCJpbXBvcnQgeyBKb2JDb2xsZWN0aW9uLCBKb2IgfSBmcm9tICdtZXRlb3IvdnNpdnNpOmpvYi1jb2xsZWN0aW9uJztcbmltcG9ydCBmZXRjaERvaU1haWxEYXRhIGZyb20gJy4uLy4uL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvZGFwcHMvZmV0Y2hfZG9pLW1haWwtZGF0YS5qcyc7XG5pbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCB7bG9nTWFpbn0gZnJvbSBcIi4uLy4uL2ltcG9ydHMvc3RhcnR1cC9zZXJ2ZXIvbG9nLWNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7QmxvY2tjaGFpbkpvYnN9IGZyb20gXCIuL2Jsb2NrY2hhaW5fam9ic1wiO1xuXG5leHBvcnQgY29uc3QgREFwcEpvYnMgPSBKb2JDb2xsZWN0aW9uKCdkYXBwJyk7XG5cbkRBcHBKb2JzLnByb2Nlc3NKb2JzKCdmZXRjaERvaU1haWxEYXRhJywgZnVuY3Rpb24gKGpvYiwgY2IpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCBkYXRhID0gam9iLmRhdGE7XG4gICAgZmV0Y2hEb2lNYWlsRGF0YShkYXRhKTtcbiAgICBqb2IuZG9uZSgpO1xuICB9IGNhdGNoKGV4Y2VwdGlvbikge1xuICAgIGpvYi5mYWlsKCk7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignam9icy5kYXBwLmZldGNoRG9pTWFpbERhdGEuZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgfSBmaW5hbGx5IHtcbiAgICBjYigpO1xuICB9XG59KTtcblxuXG5uZXcgSm9iKERBcHBKb2JzLCAnY2xlYW51cCcsIHt9KVxuICAgIC5yZXBlYXQoeyBzY2hlZHVsZTogREFwcEpvYnMubGF0ZXIucGFyc2UudGV4dChcImV2ZXJ5IDUgbWludXRlc1wiKSB9KVxuICAgIC5zYXZlKHtjYW5jZWxSZXBlYXRzOiB0cnVlfSk7XG5cbmxldCBxID0gREFwcEpvYnMucHJvY2Vzc0pvYnMoJ2NsZWFudXAnLHsgcG9sbEludGVydmFsOiBmYWxzZSwgd29ya1RpbWVvdXQ6IDYwKjEwMDAgfSAsZnVuY3Rpb24gKGpvYiwgY2IpIHtcbiAgICBjb25zdCBjdXJyZW50ID0gbmV3IERhdGUoKVxuICAgIGN1cnJlbnQuc2V0TWludXRlcyhjdXJyZW50LmdldE1pbnV0ZXMoKSAtIDUpO1xuXG4gICAgY29uc3QgaWRzID0gREFwcEpvYnMuZmluZCh7XG4gICAgICAgICAgICBzdGF0dXM6IHskaW46IEpvYi5qb2JTdGF0dXNSZW1vdmFibGV9LFxuICAgICAgICAgICAgdXBkYXRlZDogeyRsdDogY3VycmVudH19LFxuICAgICAgICB7ZmllbGRzOiB7IF9pZDogMSB9fSk7XG5cbiAgICBsb2dNYWluKCdmb3VuZCAgcmVtb3ZhYmxlIGJsb2NrY2hhaW4gam9iczonLGlkcyk7XG4gICAgREFwcEpvYnMucmVtb3ZlSm9icyhpZHMpO1xuICAgIGlmKGlkcy5sZW5ndGggPiAwKXtcbiAgICAgICAgam9iLmRvbmUoXCJSZW1vdmVkICN7aWRzLmxlbmd0aH0gb2xkIGpvYnNcIik7XG4gICAgfVxuICAgIGNiKCk7XG59KTtcblxuREFwcEpvYnMuZmluZCh7IHR5cGU6ICdqb2JUeXBlJywgc3RhdHVzOiAncmVhZHknIH0pXG4gICAgLm9ic2VydmUoe1xuICAgICAgICBhZGRlZDogZnVuY3Rpb24gKCkgeyBxLnRyaWdnZXIoKTsgfVxuICAgIH0pO1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgZG5zIGZyb20gJ2Rucyc7XG5pbXBvcnQge2xvZ1NlbmR9IGZyb20gXCIuLi8uLi9pbXBvcnRzL3N0YXJ0dXAvc2VydmVyL2xvZy1jb25maWd1cmF0aW9uXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiByZXNvbHZlVHh0KGtleSwgZG9tYWluKSB7XG4gIGNvbnN0IHN5bmNGdW5jID0gTWV0ZW9yLndyYXBBc3luYyhkbnNfcmVzb2x2ZVR4dCk7XG4gIHRyeSB7XG4gICAgY29uc3QgcmVjb3JkcyA9IHN5bmNGdW5jKGtleSwgZG9tYWluKTtcbiAgICBpZihyZWNvcmRzID09PSB1bmRlZmluZWQpIHJldHVybiB1bmRlZmluZWQ7XG4gICAgbGV0IHZhbHVlID0gdW5kZWZpbmVkO1xuICAgIHJlY29yZHMuZm9yRWFjaChyZWNvcmQgPT4ge1xuICAgICAgaWYocmVjb3JkWzBdLnN0YXJ0c1dpdGgoa2V5KSkge1xuICAgICAgICBjb25zdCB2YWwgPSByZWNvcmRbMF0uc3Vic3RyaW5nKGtleS5sZW5ndGgrMSk7XG4gICAgICAgIHZhbHVlID0gdmFsLnRyaW0oKTtcblxuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfSBjYXRjaChlcnJvcikge1xuICAgIGlmKGVycm9yLm1lc3NhZ2Uuc3RhcnRzV2l0aChcInF1ZXJ5VHh0IEVOT0RBVEFcIikgfHxcbiAgICAgICAgZXJyb3IubWVzc2FnZS5zdGFydHNXaXRoKFwicXVlcnlUeHQgRU5PVEZPVU5EXCIpKSByZXR1cm4gdW5kZWZpbmVkO1xuICAgIGVsc2UgdGhyb3cgZXJyb3I7XG4gIH1cbn1cblxuZnVuY3Rpb24gZG5zX3Jlc29sdmVUeHQoa2V5LCBkb21haW4sIGNhbGxiYWNrKSB7XG4gICAgbG9nU2VuZChcInJlc29sdmluZyBkbnMgdHh0IGF0dHJpYnV0ZTogXCIsIHtrZXk6a2V5LGRvbWFpbjpkb21haW59KTtcbiAgICBkbnMucmVzb2x2ZVR4dChkb21haW4sIChlcnIsIHJlY29yZHMpID0+IHtcbiAgICBjYWxsYmFjayhlcnIsIHJlY29yZHMpO1xuICB9KTtcbn1cbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IHtsb2dCbG9ja2NoYWluLCBsb2dDb25maXJtLCBsb2dFcnJvcn0gZnJvbSBcIi4uLy4uL2ltcG9ydHMvc3RhcnR1cC9zZXJ2ZXIvbG9nLWNvbmZpZ3VyYXRpb25cIjtcblxuXG5jb25zdCBOQU1FU1BBQ0UgPSAnZS8nO1xuXG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRXaWYoY2xpZW50LCBhZGRyZXNzKSB7XG4gIGlmKCFhZGRyZXNzKXtcbiAgICAgICAgYWRkcmVzcyA9IGdldEFkZHJlc3Nlc0J5QWNjb3VudChcIlwiKVswXTtcbiAgICAgICAgbG9nQmxvY2tjaGFpbignYWRkcmVzcyB3YXMgbm90IGRlZmluZWQgc28gZ2V0dGluZyB0aGUgZmlyc3QgZXhpc3Rpbmcgb25lIG9mIHRoZSB3YWxsZXQ6JyxhZGRyZXNzKTtcbiAgfVxuICBpZighYWRkcmVzcyl7XG4gICAgICAgIGFkZHJlc3MgPSBnZXROZXdBZGRyZXNzKFwiXCIpO1xuICAgICAgICBsb2dCbG9ja2NoYWluKCdhZGRyZXNzIHdhcyBuZXZlciBkZWZpbmVkICBhdCBhbGwgZ2VuZXJhdGVkIG5ldyBhZGRyZXNzIGZvciB0aGlzIHdhbGxldDonLGFkZHJlc3MpO1xuICB9XG4gIGNvbnN0IHN5bmNGdW5jID0gTWV0ZW9yLndyYXBBc3luYyhkb2ljaGFpbl9kdW1wcHJpdmtleSk7XG4gIHJldHVybiBzeW5jRnVuYyhjbGllbnQsIGFkZHJlc3MpO1xufVxuXG5mdW5jdGlvbiBkb2ljaGFpbl9kdW1wcHJpdmtleShjbGllbnQsIGFkZHJlc3MsIGNhbGxiYWNrKSB7XG4gIGNvbnN0IG91ckFkZHJlc3MgPSBhZGRyZXNzO1xuICBjbGllbnQuY21kKCdkdW1wcHJpdmtleScsIG91ckFkZHJlc3MsIGZ1bmN0aW9uKGVyciwgZGF0YSkge1xuICAgIGlmKGVycikgIGxvZ0Vycm9yKCdkb2ljaGFpbl9kdW1wcHJpdmtleTonLGVycik7XG4gICAgY2FsbGJhY2soZXJyLCBkYXRhKTtcbiAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRBZGRyZXNzZXNCeUFjY291bnQoY2xpZW50LCBhY2NvdXQpIHtcbiAgICBjb25zdCBzeW5jRnVuYyA9IE1ldGVvci53cmFwQXN5bmMoZG9pY2hhaW5fZ2V0YWRkcmVzc2VzYnlhY2NvdW50KTtcbiAgICByZXR1cm4gc3luY0Z1bmMoY2xpZW50LCBhY2NvdXQpO1xufVxuXG5mdW5jdGlvbiBkb2ljaGFpbl9nZXRhZGRyZXNzZXNieWFjY291bnQoY2xpZW50LCBhY2NvdW50LCBjYWxsYmFjaykge1xuICAgIGNvbnN0IG91ckFjY291bnQgPSBhY2NvdW50O1xuICAgIGNsaWVudC5jbWQoJ2dldGFkZHJlc3Nlc2J5YWNjb3VudCcsIG91ckFjY291bnQsIGZ1bmN0aW9uKGVyciwgZGF0YSkge1xuICAgICAgICBpZihlcnIpICBsb2dFcnJvcignZ2V0YWRkcmVzc2VzYnlhY2NvdW50OicsZXJyKTtcbiAgICAgICAgY2FsbGJhY2soZXJyLCBkYXRhKTtcbiAgICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldE5ld0FkZHJlc3MoY2xpZW50LCBhY2NvdXQpIHtcbiAgICBjb25zdCBzeW5jRnVuYyA9IE1ldGVvci53cmFwQXN5bmMoZG9pY2hhaW5fZ2V0bmV3YWRkcmVzcyk7XG4gICAgcmV0dXJuIHN5bmNGdW5jKGNsaWVudCwgYWNjb3V0KTtcbn1cbmZ1bmN0aW9uIGRvaWNoYWluX2dldG5ld2FkZHJlc3MoY2xpZW50LCBhY2NvdW50LCBjYWxsYmFjaykge1xuICAgIGNvbnN0IG91ckFjY291bnQgPSBhY2NvdW50O1xuICAgIGNsaWVudC5jbWQoJ2dldG5ld2FkZHJlc3NzJywgb3VyQWNjb3VudCwgZnVuY3Rpb24oZXJyLCBkYXRhKSB7XG4gICAgICAgIGlmKGVycikgIGxvZ0Vycm9yKCdnZXRuZXdhZGRyZXNzczonLGVycik7XG4gICAgICAgIGNhbGxiYWNrKGVyciwgZGF0YSk7XG4gICAgfSk7XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIHNpZ25NZXNzYWdlKGNsaWVudCwgYWRkcmVzcywgbWVzc2FnZSkge1xuICAgIGNvbnN0IHN5bmNGdW5jID0gTWV0ZW9yLndyYXBBc3luYyhkb2ljaGFpbl9zaWduTWVzc2FnZSk7XG4gICAgcmV0dXJuIHN5bmNGdW5jKGNsaWVudCwgYWRkcmVzcywgbWVzc2FnZSk7XG59XG5cbmZ1bmN0aW9uIGRvaWNoYWluX3NpZ25NZXNzYWdlKGNsaWVudCwgYWRkcmVzcywgbWVzc2FnZSwgY2FsbGJhY2spIHtcbiAgICBjb25zdCBvdXJBZGRyZXNzID0gYWRkcmVzcztcbiAgICBjb25zdCBvdXJNZXNzYWdlID0gbWVzc2FnZTtcbiAgICBjbGllbnQuY21kKCdzaWdubWVzc2FnZScsIG91ckFkZHJlc3MsIG91ck1lc3NhZ2UsIGZ1bmN0aW9uKGVyciwgZGF0YSkge1xuICAgICAgICBjYWxsYmFjayhlcnIsIGRhdGEpO1xuICAgIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbmFtZVNob3coY2xpZW50LCBpZCkge1xuICBjb25zdCBzeW5jRnVuYyA9IE1ldGVvci53cmFwQXN5bmMoZG9pY2hhaW5fbmFtZVNob3cpO1xuICByZXR1cm4gc3luY0Z1bmMoY2xpZW50LCBpZCk7XG59XG5cbmZ1bmN0aW9uIGRvaWNoYWluX25hbWVTaG93KGNsaWVudCwgaWQsIGNhbGxiYWNrKSB7XG4gIGNvbnN0IG91cklkID0gY2hlY2tJZChpZCk7XG4gIGxvZ0NvbmZpcm0oJ2RvaWNoYWluLWNsaSBuYW1lX3Nob3cgOicsb3VySWQpO1xuICBjbGllbnQuY21kKCduYW1lX3Nob3cnLCBvdXJJZCwgZnVuY3Rpb24oZXJyLCBkYXRhKSB7XG4gICAgaWYoZXJyICE9PSB1bmRlZmluZWQgJiYgZXJyICE9PSBudWxsICYmIGVyci5tZXNzYWdlLnN0YXJ0c1dpdGgoXCJuYW1lIG5vdCBmb3VuZFwiKSkge1xuICAgICAgZXJyID0gdW5kZWZpbmVkLFxuICAgICAgZGF0YSA9IHVuZGVmaW5lZFxuICAgIH1cbiAgICBjYWxsYmFjayhlcnIsIGRhdGEpO1xuICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZlZURvaShjbGllbnQsIGFkZHJlc3MpIHtcbiAgICBjb25zdCBzeW5jRnVuYyA9IE1ldGVvci53cmFwQXN5bmMoZG9pY2hhaW5fZmVlRG9pKTtcbiAgICByZXR1cm4gc3luY0Z1bmMoY2xpZW50LCBhZGRyZXNzKTtcbn1cblxuZnVuY3Rpb24gZG9pY2hhaW5fZmVlRG9pKGNsaWVudCwgYWRkcmVzcywgY2FsbGJhY2spIHtcbiAgICBjb25zdCBkZXN0QWRkcmVzcyA9IGFkZHJlc3M7XG4gICAgY2xpZW50LmNtZCgnc2VuZHRvYWRkcmVzcycsIGRlc3RBZGRyZXNzLCAnMC4wMicsIGZ1bmN0aW9uKGVyciwgZGF0YSkge1xuICAgICAgICBjYWxsYmFjayhlcnIsIGRhdGEpO1xuICAgIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbmFtZURvaShjbGllbnQsIG5hbWUsIHZhbHVlLCBhZGRyZXNzKSB7XG4gICAgY29uc3Qgc3luY0Z1bmMgPSBNZXRlb3Iud3JhcEFzeW5jKGRvaWNoYWluX25hbWVEb2kpO1xuICAgIHJldHVybiBzeW5jRnVuYyhjbGllbnQsIG5hbWUsIHZhbHVlLCBhZGRyZXNzKTtcbn1cblxuZnVuY3Rpb24gZG9pY2hhaW5fbmFtZURvaShjbGllbnQsIG5hbWUsIHZhbHVlLCBhZGRyZXNzLCBjYWxsYmFjaykge1xuICAgIGNvbnN0IG91ck5hbWUgPSBjaGVja0lkKG5hbWUpO1xuICAgIGNvbnN0IG91clZhbHVlID0gdmFsdWU7XG4gICAgY29uc3QgZGVzdEFkZHJlc3MgPSBhZGRyZXNzO1xuICAgIGlmKCFhZGRyZXNzKSB7XG4gICAgICAgIGNsaWVudC5jbWQoJ25hbWVfZG9pJywgb3VyTmFtZSwgb3VyVmFsdWUsIGZ1bmN0aW9uIChlcnIsIGRhdGEpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKGVyciwgZGF0YSk7XG4gICAgICAgIH0pO1xuICAgIH1lbHNle1xuICAgICAgICBjbGllbnQuY21kKCduYW1lX2RvaScsIG91ck5hbWUsIG91clZhbHVlLCBkZXN0QWRkcmVzcywgZnVuY3Rpb24oZXJyLCBkYXRhKSB7XG4gICAgICAgICAgICBjYWxsYmFjayhlcnIsIGRhdGEpO1xuICAgICAgICB9KTtcbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsaXN0U2luY2VCbG9jayhjbGllbnQsIGJsb2NrKSB7XG4gICAgY29uc3Qgc3luY0Z1bmMgPSBNZXRlb3Iud3JhcEFzeW5jKGRvaWNoYWluX2xpc3RTaW5jZUJsb2NrKTtcbiAgICB2YXIgb3VyQmxvY2sgPSBibG9jaztcbiAgICBpZihvdXJCbG9jayA9PT0gdW5kZWZpbmVkKSBvdXJCbG9jayA9IG51bGw7XG4gICAgcmV0dXJuIHN5bmNGdW5jKGNsaWVudCwgb3VyQmxvY2spO1xufVxuXG5mdW5jdGlvbiBkb2ljaGFpbl9saXN0U2luY2VCbG9jayhjbGllbnQsIGJsb2NrLCBjYWxsYmFjaykge1xuICAgIHZhciBvdXJCbG9jayA9IGJsb2NrO1xuICAgIGlmKG91ckJsb2NrID09PSBudWxsKSBjbGllbnQuY21kKCdsaXN0c2luY2VibG9jaycsIGZ1bmN0aW9uKGVyciwgZGF0YSkge1xuICAgICAgICBjYWxsYmFjayhlcnIsIGRhdGEpO1xuICAgIH0pO1xuICAgIGVsc2UgY2xpZW50LmNtZCgnbGlzdHNpbmNlYmxvY2snLCBvdXJCbG9jaywgZnVuY3Rpb24oZXJyLCBkYXRhKSB7XG4gICAgICAgIGNhbGxiYWNrKGVyciwgZGF0YSk7XG4gICAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRUcmFuc2FjdGlvbihjbGllbnQsIHR4aWQpIHtcbiAgICBjb25zdCBzeW5jRnVuYyA9IE1ldGVvci53cmFwQXN5bmMoZG9pY2hhaW5fZ2V0dHJhbnNhY3Rpb24pO1xuICAgIHJldHVybiBzeW5jRnVuYyhjbGllbnQsIHR4aWQpO1xufVxuXG5mdW5jdGlvbiBkb2ljaGFpbl9nZXR0cmFuc2FjdGlvbihjbGllbnQsIHR4aWQsIGNhbGxiYWNrKSB7XG4gICAgbG9nQ29uZmlybSgnZG9pY2hhaW5fZ2V0dHJhbnNhY3Rpb246Jyx0eGlkKTtcbiAgICBjbGllbnQuY21kKCdnZXR0cmFuc2FjdGlvbicsIHR4aWQsIGZ1bmN0aW9uKGVyciwgZGF0YSkge1xuICAgICAgICBpZihlcnIpICBsb2dFcnJvcignZG9pY2hhaW5fZ2V0dHJhbnNhY3Rpb246JyxlcnIpO1xuICAgICAgICBjYWxsYmFjayhlcnIsIGRhdGEpO1xuICAgIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UmF3VHJhbnNhY3Rpb24oY2xpZW50LCB0eGlkKSB7XG4gICAgY29uc3Qgc3luY0Z1bmMgPSBNZXRlb3Iud3JhcEFzeW5jKGRvaWNoYWluX2dldHJhd3RyYW5zYWN0aW9uKTtcbiAgICByZXR1cm4gc3luY0Z1bmMoY2xpZW50LCB0eGlkKTtcbn1cblxuZnVuY3Rpb24gZG9pY2hhaW5fZ2V0cmF3dHJhbnNhY3Rpb24oY2xpZW50LCB0eGlkLCBjYWxsYmFjaykge1xuICAgIGxvZ0Jsb2NrY2hhaW4oJ2RvaWNoYWluX2dldHJhd3RyYW5zYWN0aW9uOicsdHhpZCk7XG4gICAgY2xpZW50LmNtZCgnZ2V0cmF3dHJhbnNhY3Rpb24nLCB0eGlkLCAxLCBmdW5jdGlvbihlcnIsIGRhdGEpIHtcbiAgICAgICAgaWYoZXJyKSAgbG9nRXJyb3IoJ2RvaWNoYWluX2dldHJhd3RyYW5zYWN0aW9uOicsZXJyKTtcbiAgICAgICAgY2FsbGJhY2soZXJyLCBkYXRhKTtcbiAgICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEJhbGFuY2UoY2xpZW50KSB7XG4gICAgY29uc3Qgc3luY0Z1bmMgPSBNZXRlb3Iud3JhcEFzeW5jKGRvaWNoYWluX2dldGJhbGFuY2UpO1xuICAgIHJldHVybiBzeW5jRnVuYyhjbGllbnQpO1xufVxuXG5mdW5jdGlvbiBkb2ljaGFpbl9nZXRiYWxhbmNlKGNsaWVudCwgY2FsbGJhY2spIHtcbiAgICBjbGllbnQuY21kKCdnZXRiYWxhbmNlJywgZnVuY3Rpb24oZXJyLCBkYXRhKSB7XG4gICAgICAgIGlmKGVycikgeyBsb2dFcnJvcignZG9pY2hhaW5fZ2V0YmFsYW5jZTonLGVycik7fVxuICAgICAgICBjYWxsYmFjayhlcnIsIGRhdGEpO1xuICAgIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0SW5mbyhjbGllbnQpIHtcbiAgICBjb25zdCBzeW5jRnVuYyA9IE1ldGVvci53cmFwQXN5bmMoZG9pY2hhaW5fZ2V0aW5mbyk7XG4gICAgcmV0dXJuIHN5bmNGdW5jKGNsaWVudCk7XG59XG5cbmZ1bmN0aW9uIGRvaWNoYWluX2dldGluZm8oY2xpZW50LCBjYWxsYmFjaykge1xuICAgIGNsaWVudC5jbWQoJy1nZXRpbmZvJywgZnVuY3Rpb24oZXJyLCBkYXRhKSB7XG4gICAgICAgIGlmKGVycikgeyBsb2dFcnJvcignZG9pY2hhaW4tZ2V0aW5mbzonLGVycik7fVxuICAgICAgICBjYWxsYmFjayhlcnIsIGRhdGEpO1xuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBjaGVja0lkKGlkKSB7XG4gICAgY29uc3QgRE9JX1BSRUZJWCA9IFwiZG9pOiBcIjtcbiAgICBsZXQgcmV0X3ZhbCA9IGlkOyAvL2RlZmF1bHQgdmFsdWVcblxuICAgIGlmKGlkLnN0YXJ0c1dpdGgoRE9JX1BSRUZJWCkpIHJldF92YWwgPSBpZC5zdWJzdHJpbmcoRE9JX1BSRUZJWC5sZW5ndGgpOyAvL2luIGNhc2UgaXQgc3RhcnRzIHdpdGggZG9pOiBjdXQgIHRoaXMgYXdheVxuICAgIGlmKCFpZC5zdGFydHNXaXRoKE5BTUVTUEFDRSkpIHJldF92YWwgPSBOQU1FU1BBQ0UraWQ7IC8vaW4gY2FzZSBpdCBkb2Vzbid0IHN0YXJ0IHdpdGggZS8gcHV0IGl0IGluIGZyb250IG5vdy5cbiAgcmV0dXJuIHJldF92YWw7XG59XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCB7IEhUVFAgfSBmcm9tICdtZXRlb3IvaHR0cCdcblxuZXhwb3J0IGZ1bmN0aW9uIGdldEh0dHBHRVQodXJsLCBxdWVyeSkge1xuICBjb25zdCBzeW5jRnVuYyA9IE1ldGVvci53cmFwQXN5bmMoX2dldCk7XG4gIHJldHVybiBzeW5jRnVuYyh1cmwsIHF1ZXJ5KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEh0dHBHRVRkYXRhKHVybCwgZGF0YSkge1xuICAgIGNvbnN0IHN5bmNGdW5jID0gTWV0ZW9yLndyYXBBc3luYyhfZ2V0RGF0YSk7XG4gICAgcmV0dXJuIHN5bmNGdW5jKHVybCwgZGF0YSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRIdHRwUE9TVCh1cmwsIGRhdGEpIHtcbiAgICBjb25zdCBzeW5jRnVuYyA9IE1ldGVvci53cmFwQXN5bmMoX3Bvc3QpO1xuICAgIHJldHVybiBzeW5jRnVuYyh1cmwsIGRhdGEpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0SHR0cFBVVCh1cmwsIGRhdGEpIHtcbiAgICBjb25zdCBzeW5jRnVuYyA9IE1ldGVvci53cmFwQXN5bmMoX3B1dCk7XG4gICAgcmV0dXJuIHN5bmNGdW5jKHVybCwgZGF0YSk7XG59XG5cbmZ1bmN0aW9uIF9nZXQodXJsLCBxdWVyeSwgY2FsbGJhY2spIHtcbiAgY29uc3Qgb3VyVXJsID0gdXJsO1xuICBjb25zdCBvdXJRdWVyeSA9IHF1ZXJ5O1xuICBIVFRQLmdldChvdXJVcmwsIHtxdWVyeTogb3VyUXVlcnl9LCBmdW5jdGlvbihlcnIsIHJldCkge1xuICAgIGNhbGxiYWNrKGVyciwgcmV0KTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIF9nZXREYXRhKHVybCwgZGF0YSwgY2FsbGJhY2spIHtcbiAgICBjb25zdCBvdXJVcmwgPSB1cmw7XG4gICAgY29uc3Qgb3VyRGF0YSA9IGRhdGE7XG4gICAgSFRUUC5nZXQob3VyVXJsLCBvdXJEYXRhLCBmdW5jdGlvbihlcnIsIHJldCkge1xuICAgICAgICBjYWxsYmFjayhlcnIsIHJldCk7XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIF9wb3N0KHVybCwgZGF0YSwgY2FsbGJhY2spIHtcbiAgICBjb25zdCBvdXJVcmwgPSB1cmw7XG4gICAgY29uc3Qgb3VyRGF0YSA9ICBkYXRhO1xuXG4gICAgSFRUUC5wb3N0KG91clVybCwgb3VyRGF0YSwgZnVuY3Rpb24oZXJyLCByZXQpIHtcbiAgICAgICAgY2FsbGJhY2soZXJyLCByZXQpO1xuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBfcHV0KHVybCwgdXBkYXRlRGF0YSwgY2FsbGJhY2spIHtcbiAgICBjb25zdCBvdXJVcmwgPSB1cmw7XG4gICAgY29uc3Qgb3VyRGF0YSA9IHtcbiAgICAgICAgZGF0YTogdXBkYXRlRGF0YVxuICAgIH1cblxuICAgIEhUVFAucHV0KG91clVybCwgb3VyRGF0YSwgZnVuY3Rpb24oZXJyLCByZXQpIHtcbiAgICAgIGNhbGxiYWNrKGVyciwgcmV0KTtcbiAgICB9KTtcbn1cbiIsImltcG9ydCAnLi9tYWlsX2pvYnMuanMnO1xuaW1wb3J0ICcuL2RvaWNoYWluLmpzJztcbmltcG9ydCAnLi9ibG9ja2NoYWluX2pvYnMuanMnO1xuaW1wb3J0ICcuL2RhcHBfam9icy5qcyc7XG5pbXBvcnQgJy4vZG5zLmpzJztcbmltcG9ydCAnLi9yZXN0L3Jlc3QuanMnO1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgeyBKb2JDb2xsZWN0aW9uLCBKb2IgfSBmcm9tICdtZXRlb3IvdnNpdnNpOmpvYi1jb2xsZWN0aW9uJztcbmV4cG9ydCBjb25zdCBNYWlsSm9icyA9IEpvYkNvbGxlY3Rpb24oJ2VtYWlscycpO1xuaW1wb3J0IHNlbmRNYWlsIGZyb20gJy4uLy4uL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvZW1haWxzL3NlbmQuanMnO1xuaW1wb3J0IHtsb2dNYWlufSBmcm9tIFwiLi4vLi4vaW1wb3J0cy9zdGFydHVwL3NlcnZlci9sb2ctY29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHtCbG9ja2NoYWluSm9ic30gZnJvbSBcIi4vYmxvY2tjaGFpbl9qb2JzXCI7XG5cblxuXG5NYWlsSm9icy5wcm9jZXNzSm9icygnc2VuZCcsIGZ1bmN0aW9uIChqb2IsIGNiKSB7XG4gIHRyeSB7XG4gICAgY29uc3QgZW1haWwgPSBqb2IuZGF0YTtcbiAgICBzZW5kTWFpbChlbWFpbCk7XG4gICAgam9iLmRvbmUoKTtcbiAgfSBjYXRjaChleGNlcHRpb24pIHtcbiAgICBqb2IuZmFpbCgpO1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2pvYnMubWFpbC5zZW5kLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH0gZmluYWxseSB7XG4gICAgY2IoKTtcbiAgfVxufSk7XG5cblxubmV3IEpvYihNYWlsSm9icywgJ2NsZWFudXAnLCB7fSlcbiAgICAucmVwZWF0KHsgc2NoZWR1bGU6IE1haWxKb2JzLmxhdGVyLnBhcnNlLnRleHQoXCJldmVyeSA1IG1pbnV0ZXNcIikgfSlcbiAgICAuc2F2ZSh7Y2FuY2VsUmVwZWF0czogdHJ1ZX0pXG5cbmxldCBxID0gTWFpbEpvYnMucHJvY2Vzc0pvYnMoJ2NsZWFudXAnLHsgcG9sbEludGVydmFsOiBmYWxzZSwgd29ya1RpbWVvdXQ6IDYwKjEwMDAgfSAsZnVuY3Rpb24gKGpvYiwgY2IpIHtcbiAgICBjb25zdCBjdXJyZW50ID0gbmV3IERhdGUoKVxuICAgIGN1cnJlbnQuc2V0TWludXRlcyhjdXJyZW50LmdldE1pbnV0ZXMoKSAtIDUpO1xuXG4gICAgY29uc3QgaWRzID0gTWFpbEpvYnMuZmluZCh7XG4gICAgICAgICAgICBzdGF0dXM6IHskaW46IEpvYi5qb2JTdGF0dXNSZW1vdmFibGV9LFxuICAgICAgICAgICAgdXBkYXRlZDogeyRsdDogY3VycmVudH19LFxuICAgICAgICB7ZmllbGRzOiB7IF9pZDogMSB9fSk7XG5cbiAgICBsb2dNYWluKCdmb3VuZCAgcmVtb3ZhYmxlIGJsb2NrY2hhaW4gam9iczonLGlkcyk7XG4gICAgTWFpbEpvYnMucmVtb3ZlSm9icyhpZHMpO1xuICAgIGlmKGlkcy5sZW5ndGggPiAwKXtcbiAgICAgICAgam9iLmRvbmUoXCJSZW1vdmVkICN7aWRzLmxlbmd0aH0gb2xkIGpvYnNcIik7XG4gICAgfVxuICAgIGNiKCk7XG59KTtcblxuTWFpbEpvYnMuZmluZCh7IHR5cGU6ICdqb2JUeXBlJywgc3RhdHVzOiAncmVhZHknIH0pXG4gICAgLm9ic2VydmUoe1xuICAgICAgICBhZGRlZDogZnVuY3Rpb24gKCkgeyBxLnRyaWdnZXIoKTsgfVxuICAgIH0pO1xuXG4iLCJpbXBvcnQgJy9pbXBvcnRzL3N0YXJ0dXAvc2VydmVyJztcbmltcG9ydCAnLi9hcGkvaW5kZXguanMnO1xuIl19
