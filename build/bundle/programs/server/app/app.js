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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9hcGkvb3B0LWlucy9zZXJ2ZXIvcHVibGljYXRpb25zLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL2FwaS9vcHQtaW5zL21ldGhvZHMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvYXBpL29wdC1pbnMvb3B0LWlucy5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9hcGkvcmVjaXBpZW50cy9zZXJ2ZXIvcHVibGljYXRpb25zLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL2FwaS9yZWNpcGllbnRzL3JlY2lwaWVudHMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvYXBpL2RvaWNoYWluL2VudHJpZXMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvYXBpL2RvaWNoYWluL21ldGhvZHMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvYXBpL2xhbmd1YWdlcy9tZXRob2RzLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL2FwaS9tZXRhL21ldGEuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvYXBpL3NlbmRlcnMvc2VuZGVycy5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9hcGkvdmVyc2lvbi9wdWJsaWNhdGlvbnMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvZGFwcHMvZXhwb3J0X2RvaXMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvZGFwcHMvZmV0Y2hfZG9pLW1haWwtZGF0YS5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9kYXBwcy9nZXRfZG9pLW1haWwtZGF0YS5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9kbnMvZ2V0X29wdC1pbi1rZXkuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvZG5zL2dldF9vcHQtaW4tcHJvdmlkZXIuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvZG9pY2hhaW4vYWRkX2VudHJ5X2FuZF9mZXRjaF9kYXRhLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2RvaWNoYWluL2NoZWNrX25ld190cmFuc2FjdGlvbnMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvZG9pY2hhaW4vZGVjcnlwdF9tZXNzYWdlLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2RvaWNoYWluL2VuY3J5cHRfbWVzc2FnZS5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9kb2ljaGFpbi9nZW5lcmF0ZV9uYW1lLWlkLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2RvaWNoYWluL2dldF9hZGRyZXNzLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2RvaWNoYWluL2dldF9iYWxhbmNlLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2RvaWNoYWluL2dldF9kYXRhLWhhc2guanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvZG9pY2hhaW4vZ2V0X2tleS1wYWlyLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2RvaWNoYWluL2dldF9wcml2YXRlLWtleV9mcm9tX3dpZi5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9kb2ljaGFpbi9nZXRfcHVibGlja2V5X2FuZF9hZGRyZXNzX2J5X2RvbWFpbi5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9kb2ljaGFpbi9nZXRfc2lnbmF0dXJlLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2RvaWNoYWluL2luc2VydC5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9kb2ljaGFpbi91cGRhdGUuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvZG9pY2hhaW4vdmVyaWZ5X3NpZ25hdHVyZS5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9kb2ljaGFpbi93cml0ZV90b19ibG9ja2NoYWluLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2VtYWlscy9kZWNvZGVfZG9pLWhhc2guanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvZW1haWxzL2dlbmVyYXRlX2RvaS1oYXNoLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2VtYWlscy9wYXJzZV90ZW1wbGF0ZS5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9lbWFpbHMvc2VuZC5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9qb2JzL2FkZF9jaGVja19uZXdfdHJhbnNhY3Rpb25zLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2pvYnMvYWRkX2ZldGNoLWRvaS1tYWlsLWRhdGEuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvam9icy9hZGRfaW5zZXJ0X2Jsb2NrY2hhaW4uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvam9icy9hZGRfc2VuZF9tYWlsLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2pvYnMvYWRkX3VwZGF0ZV9ibG9ja2NoYWluLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2xhbmd1YWdlcy9nZXQuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvbWV0YS9hZGRPclVwZGF0ZS5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9vcHQtaW5zL2FkZC5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9vcHQtaW5zL2FkZF9hbmRfd3JpdGVfdG9fYmxvY2tjaGFpbi5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9vcHQtaW5zL2NvbmZpcm0uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvb3B0LWlucy9nZW5lcmF0ZV9kb2ktdG9rZW4uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvb3B0LWlucy91cGRhdGVfc3RhdHVzLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL21vZHVsZXMvc2VydmVyL29wdC1pbnMvdmVyaWZ5LmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL21vZHVsZXMvc2VydmVyL3JlY2lwaWVudHMvYWRkLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL21vZHVsZXMvc2VydmVyL3NlbmRlcnMvYWRkLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL3N0YXJ0dXAvc2VydmVyL2RhcHAtY29uZmlndXJhdGlvbi5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9zdGFydHVwL3NlcnZlci9kbnMtY29uZmlndXJhdGlvbi5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9zdGFydHVwL3NlcnZlci9kb2ljaGFpbi1jb25maWd1cmF0aW9uLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL3N0YXJ0dXAvc2VydmVyL2VtYWlsLWNvbmZpZ3VyYXRpb24uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvc3RhcnR1cC9zZXJ2ZXIvZml4dHVyZXMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvc3RhcnR1cC9zZXJ2ZXIvaW5kZXguanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvc3RhcnR1cC9zZXJ2ZXIvam9icy5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9zdGFydHVwL3NlcnZlci9sb2ctY29uZmlndXJhdGlvbi5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9zdGFydHVwL3NlcnZlci9yZWdpc3Rlci1hcGkuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvc3RhcnR1cC9zZXJ2ZXIvc2VjdXJpdHkuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvc3RhcnR1cC9zZXJ2ZXIvdHlwZS1jb25maWd1cmF0aW9uLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL3N0YXJ0dXAvc2VydmVyL3VzZXJhY2NvdW50cy1jb25maWd1cmF0aW9uLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvYXBpL3Jlc3QvaW1wb3J0cy9jb25maXJtLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvYXBpL3Jlc3QvaW1wb3J0cy9kZWJ1Zy5qcyIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL2FwaS9yZXN0L2ltcG9ydHMvc2VuZC5qcyIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL2FwaS9yZXN0L2ltcG9ydHMvc3RhdHVzLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvYXBpL3Jlc3QvaW1wb3J0cy91c2VyLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvYXBpL3Jlc3QvaW1wb3J0cy92ZXJpZnkuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9hcGkvcmVzdC9yZXN0LmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvYXBpL2Jsb2NrY2hhaW5fam9icy5qcyIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL2FwaS9kYXBwX2pvYnMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9hcGkvZG5zLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvYXBpL2RvaWNoYWluLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvYXBpL2h0dHAuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9hcGkvaW5kZXguanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9hcGkvbWFpbF9qb2JzLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWFpbi5qcyJdLCJuYW1lcyI6WyJNZXRlb3IiLCJtb2R1bGUiLCJsaW5rIiwidiIsIlJvbGVzIiwiT3B0SW5zIiwicHVibGlzaCIsIk9wdEluc0FsbCIsInVzZXJJZCIsInJlYWR5IiwidXNlcklzSW5Sb2xlIiwiZmluZCIsIm93bmVySWQiLCJmaWVsZHMiLCJwdWJsaWNGaWVsZHMiLCJERFBSYXRlTGltaXRlciIsImkxOG4iLCJfaTE4biIsIlZhbGlkYXRlZE1ldGhvZCIsIl8iLCJhZGRPcHRJbiIsImRlZmF1bHQiLCJhZGQiLCJuYW1lIiwidmFsaWRhdGUiLCJydW4iLCJyZWNpcGllbnRNYWlsIiwic2VuZGVyTWFpbCIsImRhdGEiLCJlcnJvciIsIkVycm9yIiwiX18iLCJvcHRJbiIsIk9QVElPTlNfTUVUSE9EUyIsInBsdWNrIiwiaXNTZXJ2ZXIiLCJhZGRSdWxlIiwiY29udGFpbnMiLCJjb25uZWN0aW9uSWQiLCJleHBvcnQiLCJNb25nbyIsIlNpbXBsZVNjaGVtYSIsIk9wdEluc0NvbGxlY3Rpb24iLCJDb2xsZWN0aW9uIiwiaW5zZXJ0IiwiY2FsbGJhY2siLCJvdXJPcHRJbiIsInJlY2lwaWVudF9zZW5kZXIiLCJyZWNpcGllbnQiLCJzZW5kZXIiLCJjcmVhdGVkQXQiLCJEYXRlIiwicmVzdWx0IiwidXBkYXRlIiwic2VsZWN0b3IiLCJtb2RpZmllciIsInJlbW92ZSIsImRlbnkiLCJzY2hlbWEiLCJfaWQiLCJ0eXBlIiwiU3RyaW5nIiwicmVnRXgiLCJSZWdFeCIsIklkIiwib3B0aW9uYWwiLCJkZW55VXBkYXRlIiwiaW5kZXgiLCJJbnRlZ2VyIiwibmFtZUlkIiwidHhJZCIsIm1hc3RlckRvaSIsImNvbmZpcm1lZEF0IiwiY29uZmlybWVkQnkiLCJJUCIsImNvbmZpcm1hdGlvblRva2VuIiwiYXR0YWNoU2NoZW1hIiwiUmVjaXBpZW50cyIsInJlY2lwaWVudEdldCIsInBpcGVsaW5lIiwicHVzaCIsIiRyZWRhY3QiLCIkY29uZCIsImlmIiwiJGNtcCIsInRoZW4iLCJlbHNlIiwiJGxvb2t1cCIsImZyb20iLCJsb2NhbEZpZWxkIiwiZm9yZWlnbkZpZWxkIiwiYXMiLCIkdW53aW5kIiwiJHByb2plY3QiLCJhZ2dyZWdhdGUiLCJySWRzIiwiZm9yRWFjaCIsImVsZW1lbnQiLCJSZWNpcGllbnRFbWFpbCIsInJlY2lwaWVudHNBbGwiLCJSZWNpcGllbnRzQ29sbGVjdGlvbiIsIm91clJlY2lwaWVudCIsImVtYWlsIiwicHJpdmF0ZUtleSIsInVuaXF1ZSIsInB1YmxpY0tleSIsIkRvaWNoYWluRW50cmllcyIsIkRvaWNoYWluRW50cmllc0NvbGxlY3Rpb24iLCJlbnRyeSIsInZhbHVlIiwiYWRkcmVzcyIsImdldEtleVBhaXJNIiwiZ2V0QmFsYW5jZU0iLCJnZXRLZXlQYWlyIiwiZ2V0QmFsYW5jZSIsImxvZ1ZhbCIsIk9QVElOU19NRVRIT0RTIiwiZ2V0TGFuZ3VhZ2VzIiwiZ2V0QWxsTGFuZ3VhZ2VzIiwiTWV0YSIsIk1ldGFDb2xsZWN0aW9uIiwib3VyRGF0YSIsImtleSIsIlNlbmRlcnMiLCJTZW5kZXJzQ29sbGVjdGlvbiIsIm91clNlbmRlciIsInZlcnNpb24iLCJET0lfTUFJTF9GRVRDSF9VUkwiLCJsb2dTZW5kIiwiRXhwb3J0RG9pc0RhdGFTY2hlbWEiLCJzdGF0dXMiLCJyb2xlIiwidXNlcmlkIiwiaWQiLCJleHBvcnREb2lzIiwiJG1hdGNoIiwiJGV4aXN0cyIsIiRuZSIsInVuZGVmaW5lZCIsImNvbmNhdCIsIm9wdElucyIsImV4cG9ydERvaURhdGEiLCJKU09OIiwic3RyaW5naWZ5IiwiZXhjZXB0aW9uIiwiZXhwb3J0RGVmYXVsdCIsIkRPSV9GRVRDSF9ST1VURSIsIkRPSV9DT05GSVJNQVRJT05fUk9VVEUiLCJBUElfUEFUSCIsIlZFUlNJT04iLCJnZXRVcmwiLCJDT05GSVJNX0NMSUVOVCIsIkNPTkZJUk1fQUREUkVTUyIsImdldEh0dHBHRVQiLCJzaWduTWVzc2FnZSIsInBhcnNlVGVtcGxhdGUiLCJnZW5lcmF0ZURvaVRva2VuIiwiZ2VuZXJhdGVEb2lIYXNoIiwiYWRkU2VuZE1haWxKb2IiLCJsb2dDb25maXJtIiwibG9nRXJyb3IiLCJGZXRjaERvaU1haWxEYXRhU2NoZW1hIiwiZG9tYWluIiwiZmV0Y2hEb2lNYWlsRGF0YSIsInVybCIsInNpZ25hdHVyZSIsInF1ZXJ5IiwiZW5jb2RlVVJJQ29tcG9uZW50IiwicmVzcG9uc2UiLCJyZXNwb25zZURhdGEiLCJpbmNsdWRlcyIsIm9wdEluSWQiLCJmaW5kT25lIiwidG9rZW4iLCJjb25maXJtYXRpb25IYXNoIiwicmVkaXJlY3QiLCJjb25maXJtYXRpb25VcmwiLCJ0ZW1wbGF0ZSIsImNvbnRlbnQiLCJjb25maXJtYXRpb25fdXJsIiwidG8iLCJzdWJqZWN0IiwibWVzc2FnZSIsInJldHVyblBhdGgiLCJnZXRPcHRJblByb3ZpZGVyIiwiZ2V0T3B0SW5LZXkiLCJ2ZXJpZnlTaWduYXR1cmUiLCJBY2NvdW50cyIsIkdldERvaU1haWxEYXRhU2NoZW1hIiwibmFtZV9pZCIsInVzZXJQcm9maWxlU2NoZW1hIiwiRW1haWwiLCJ0ZW1wbGF0ZVVSTCIsImdldERvaU1haWxEYXRhIiwicGFydHMiLCJzcGxpdCIsImxlbmd0aCIsInByb3ZpZGVyIiwiZG9pTWFpbERhdGEiLCJkZWZhdWx0UmV0dXJuRGF0YSIsInJldHVybkRhdGEiLCJvd25lciIsInVzZXJzIiwibWFpbFRlbXBsYXRlIiwicHJvZmlsZSIsInJlc29sdmVUeHQiLCJGQUxMQkFDS19QUk9WSURFUiIsImlzUmVndGVzdCIsImlzVGVzdG5ldCIsIk9QVF9JTl9LRVkiLCJPUFRfSU5fS0VZX1RFU1RORVQiLCJHZXRPcHRJbktleVNjaGVtYSIsIm91ck9QVF9JTl9LRVkiLCJmb3VuZEtleSIsImRuc2tleSIsInVzZUZhbGxiYWNrIiwiUFJPVklERVJfS0VZIiwiUFJPVklERVJfS0VZX1RFU1RORVQiLCJHZXRPcHRJblByb3ZpZGVyU2NoZW1hIiwib3VyUFJPVklERVJfS0VZIiwicHJvdmlkZXJLZXkiLCJnZXRXaWYiLCJhZGRGZXRjaERvaU1haWxEYXRhSm9iIiwiZ2V0UHJpdmF0ZUtleUZyb21XaWYiLCJkZWNyeXB0TWVzc2FnZSIsIkFkZERvaWNoYWluRW50cnlTY2hlbWEiLCJhZGREb2ljaGFpbkVudHJ5Iiwib3VyRW50cnkiLCJldHkiLCJwYXJzZSIsIndpZiIsIm5hbWVQb3MiLCJpbmRleE9mIiwic3Vic3RyaW5nIiwiZXhwaXJlc0luIiwiZXhwaXJlZCIsImxpc3RTaW5jZUJsb2NrIiwibmFtZVNob3ciLCJnZXRSYXdUcmFuc2FjdGlvbiIsImFkZE9yVXBkYXRlTWV0YSIsIlRYX05BTUVfU1RBUlQiLCJMQVNUX0NIRUNLRURfQkxPQ0tfS0VZIiwiY2hlY2tOZXdUcmFuc2FjdGlvbiIsInR4aWQiLCJqb2IiLCJsYXN0Q2hlY2tlZEJsb2NrIiwicmV0IiwidHJhbnNhY3Rpb25zIiwidHhzIiwibGFzdGJsb2NrIiwiYWRkcmVzc1R4cyIsImZpbHRlciIsInR4Iiwic3RhcnRzV2l0aCIsInR4TmFtZSIsImFkZFR4IiwiZG9uZSIsInZvdXQiLCJzY3JpcHRQdWJLZXkiLCJuYW1lT3AiLCJvcCIsImFkZHJlc3NlcyIsImNyeXB0byIsImVjaWVzIiwiRGVjcnlwdE1lc3NhZ2VTY2hlbWEiLCJCdWZmZXIiLCJlY2RoIiwiY3JlYXRlRUNESCIsInNldFByaXZhdGVLZXkiLCJkZWNyeXB0IiwidG9TdHJpbmciLCJFbmNyeXB0TWVzc2FnZVNjaGVtYSIsImVuY3J5cHRNZXNzYWdlIiwiZW5jcnlwdCIsIkdlbmVyYXRlTmFtZUlkU2NoZW1hIiwiZ2VuZXJhdGVOYW1lSWQiLCIkc2V0IiwiQ3J5cHRvSlMiLCJCYXNlNTgiLCJWRVJTSU9OX0JZVEUiLCJWRVJTSU9OX0JZVEVfUkVHVEVTVCIsIkdldEFkZHJlc3NTY2hlbWEiLCJnZXRBZGRyZXNzIiwiX2dldEFkZHJlc3MiLCJwdWJLZXkiLCJsaWIiLCJXb3JkQXJyYXkiLCJjcmVhdGUiLCJTSEEyNTYiLCJSSVBFTUQxNjAiLCJ2ZXJzaW9uQnl0ZSIsImNoZWNrc3VtIiwiZW5jb2RlIiwiZ2V0X0JhbGFuY2UiLCJiYWwiLCJHZXREYXRhSGFzaFNjaGVtYSIsImdldERhdGFIYXNoIiwiaGFzaCIsInJhbmRvbUJ5dGVzIiwic2VjcDI1NmsxIiwicHJpdktleSIsInByaXZhdGVLZXlWZXJpZnkiLCJwdWJsaWNLZXlDcmVhdGUiLCJ0b1VwcGVyQ2FzZSIsIkdldFByaXZhdGVLZXlGcm9tV2lmU2NoZW1hIiwiX2dldFByaXZhdGVLZXlGcm9tV2lmIiwiZGVjb2RlIiwiZW5kc1dpdGgiLCJHZXRQdWJsaWNLZXlTY2hlbWEiLCJnZXRQdWJsaWNLZXlBbmRBZGRyZXNzIiwiZGVzdEFkZHJlc3MiLCJiaXRjb3JlIiwiTWVzc2FnZSIsIkdldFNpZ25hdHVyZVNjaGVtYSIsImdldFNpZ25hdHVyZSIsInNpZ24iLCJQcml2YXRlS2V5IiwiU0VORF9DTElFTlQiLCJsb2dCbG9ja2NoYWluIiwiZmVlRG9pIiwibmFtZURvaSIsIkluc2VydFNjaGVtYSIsImRhdGFIYXNoIiwic29pRGF0ZSIsInB1YmxpY0tleUFuZEFkZHJlc3MiLCJuYW1lVmFsdWUiLCJmZWVEb2lUeCIsIm5hbWVEb2lUeCIsImdldFRyYW5zYWN0aW9uIiwiRE9JX0NPTkZJUk1BVElPTl9OT1RJRllfUk9VVEUiLCJnZXRIdHRwUFVUIiwiVXBkYXRlU2NoZW1hIiwiaG9zdCIsImZyb21Ib3N0VXJsIiwibmFtZV9kYXRhIiwicmVydW4iLCJvdXJfdHJhbnNhY3Rpb24iLCJjb25maXJtYXRpb25zIiwib3VyZnJvbUhvc3RVcmwiLCJ1cGRhdGVEYXRhIiwiY2FuY2VsIiwicmVzdGFydCIsImVyciIsImxvZ1ZlcmlmeSIsIk5FVFdPUksiLCJOZXR3b3JrcyIsImFsaWFzIiwicHVia2V5aGFzaCIsInByaXZhdGVrZXkiLCJzY3JpcHRoYXNoIiwibmV0d29ya01hZ2ljIiwiVmVyaWZ5U2lnbmF0dXJlU2NoZW1hIiwiQWRkcmVzcyIsImZyb21QdWJsaWNLZXkiLCJQdWJsaWNLZXkiLCJ2ZXJpZnkiLCJhZGRJbnNlcnRCbG9ja2NoYWluSm9iIiwiV3JpdGVUb0Jsb2NrY2hhaW5TY2hlbWEiLCJ3cml0ZVRvQmxvY2tjaGFpbiIsIkhhc2hJZHMiLCJEZWNvZGVEb2lIYXNoU2NoZW1hIiwiZGVjb2RlRG9pSGFzaCIsIm91ckhhc2giLCJoZXgiLCJkZWNvZGVIZXgiLCJvYmoiLCJHZW5lcmF0ZURvaUhhc2hTY2hlbWEiLCJqc29uIiwiZW5jb2RlSGV4IiwiUExBQ0VIT0xERVJfUkVHRVgiLCJQYXJzZVRlbXBsYXRlU2NoZW1hIiwiT2JqZWN0IiwiYmxhY2tib3giLCJfbWF0Y2giLCJleGVjIiwiX3JlcGxhY2VQbGFjZWhvbGRlciIsInJlcGxhY2UiLCJyZXAiLCJET0lfTUFJTF9ERUZBVUxUX0VNQUlMX0ZST00iLCJTZW5kTWFpbFNjaGVtYSIsInNlbmRNYWlsIiwibWFpbCIsIm91ck1haWwiLCJzZW5kIiwiaHRtbCIsImhlYWRlcnMiLCJKb2IiLCJCbG9ja2NoYWluSm9icyIsImFkZENoZWNrTmV3VHJhbnNhY3Rpb25zQmxvY2tjaGFpbkpvYiIsInJldHJ5IiwicmV0cmllcyIsIndhaXQiLCJzYXZlIiwiY2FuY2VsUmVwZWF0cyIsIkRBcHBKb2JzIiwiQWRkRmV0Y2hEb2lNYWlsRGF0YUpvYlNjaGVtYSIsIkFkZEluc2VydEJsb2NrY2hhaW5Kb2JTY2hlbWEiLCJNYWlsSm9icyIsIkFkZFNlbmRNYWlsSm9iU2NoZW1hIiwiQWRkVXBkYXRlQmxvY2tjaGFpbkpvYlNjaGVtYSIsImFkZFVwZGF0ZUJsb2NrY2hhaW5Kb2IiLCJBZGRPclVwZGF0ZU1ldGFTY2hlbWEiLCJtZXRhIiwiQWRkT3B0SW5TY2hlbWEiLCJmZXRjaCIsImFkZFJlY2lwaWVudCIsImFkZFNlbmRlciIsInJlY2lwaWVudF9tYWlsIiwic2VuZGVyX21haWwiLCJtYXN0ZXJfZG9pIiwicmVjaXBpZW50SWQiLCJzZW5kZXJJZCIsIkNvbmZpcm1PcHRJblNjaGVtYSIsImNvbmZpcm1PcHRJbiIsInJlcXVlc3QiLCJvdXJSZXF1ZXN0IiwiZGVjb2RlZCIsIiR1bnNldCIsImVudHJpZXMiLCIkb3IiLCJkb2lTaWduYXR1cmUiLCJkb2lUaW1lc3RhbXAiLCJ0b0lTT1N0cmluZyIsImpzb25WYWx1ZSIsIkdlbmVyYXRlRG9pVG9rZW5TY2hlbWEiLCJVcGRhdGVPcHRJblN0YXR1c1NjaGVtYSIsInVwZGF0ZU9wdEluU3RhdHVzIiwiVkVSSUZZX0NMSUVOVCIsIlZlcmlmeU9wdEluU2NoZW1hIiwicmVjaXBpZW50X3B1YmxpY19rZXkiLCJ2ZXJpZnlPcHRJbiIsImVudHJ5RGF0YSIsImZpcnN0Q2hlY2siLCJzZWNvbmRDaGVjayIsIkFkZFJlY2lwaWVudFNjaGVtYSIsInJlY2lwaWVudHMiLCJrZXlQYWlyIiwiQWRkU2VuZGVyU2NoZW1hIiwic2VuZGVycyIsImlzRGVidWciLCJzZXR0aW5ncyIsImFwcCIsImRlYnVnIiwicmVndGVzdCIsInRlc3RuZXQiLCJwb3J0IiwiYWJzb2x1dGVVcmwiLCJuYW1lY29pbiIsIlNFTkRfQVBQIiwiQ09ORklSTV9BUFAiLCJWRVJJRllfQVBQIiwiaXNBcHBUeXBlIiwic2VuZFNldHRpbmdzIiwic2VuZENsaWVudCIsImRvaWNoYWluIiwiY3JlYXRlQ2xpZW50IiwiY29uZmlybVNldHRpbmdzIiwiY29uZmlybSIsImNvbmZpcm1DbGllbnQiLCJjb25maXJtQWRkcmVzcyIsInZlcmlmeVNldHRpbmdzIiwidmVyaWZ5Q2xpZW50IiwiQ2xpZW50IiwidXNlciIsInVzZXJuYW1lIiwicGFzcyIsInBhc3N3b3JkIiwiSGFzaGlkcyIsImRvaU1haWxGZXRjaFVybCIsImRlZmF1bHRGcm9tIiwic210cCIsInN0YXJ0dXAiLCJwcm9jZXNzIiwiZW52IiwiTUFJTF9VUkwiLCJzZXJ2ZXIiLCJOT0RFX1RMU19SRUpFQ1RfVU5BVVRIT1JJWkVEIiwiQXNzZXRzIiwiZ2V0VGV4dCIsImNvdW50IiwiY3JlYXRlVXNlciIsImFkZFVzZXJzVG9Sb2xlcyIsInN0YXJ0Sm9iU2VydmVyIiwiY29uc29sZSIsInNlbmRNb2RlVGFnQ29sb3IiLCJjb25maXJtTW9kZVRhZ0NvbG9yIiwidmVyaWZ5TW9kZVRhZ0NvbG9yIiwiYmxvY2tjaGFpbk1vZGVUYWdDb2xvciIsInRlc3RpbmdNb2RlVGFnQ29sb3IiLCJsb2dNYWluIiwidGVzdExvZ2dpbmciLCJyZXF1aXJlIiwibXNnIiwiY29sb3JzIiwicGFyYW0iLCJ0aW1lIiwidGFnIiwibG9nIiwiQVVUSF9NRVRIT0RTIiwidHlwZXMiLCJjb25maWciLCJzZW5kVmVyaWZpY2F0aW9uRW1haWwiLCJmb3JiaWRDbGllbnRBY2NvdW50Q3JlYXRpb24iLCJlbWFpbFRlbXBsYXRlcyIsIkFwaSIsIkRPSV9XQUxMRVROT1RJRllfUk9VVEUiLCJhZGRSb3V0ZSIsImF1dGhSZXF1aXJlZCIsImdldCIsImFjdGlvbiIsInVybFBhcmFtcyIsImlwIiwiY29ubmVjdGlvbiIsInJlbW90ZUFkZHJlc3MiLCJzb2NrZXQiLCJzdGF0dXNDb2RlIiwiYm9keSIsInBhcmFtcyIsInF1ZXJ5UGFyYW1zIiwiRE9JX0VYUE9SVF9ST1VURSIsInBvc3QiLCJxUGFyYW1zIiwiYlBhcmFtcyIsImJvZHlQYXJhbXMiLCJ1aWQiLCJjb25zdHJ1Y3RvciIsIkFycmF5IiwicHJlcGFyZUNvRE9JIiwicHJlcGFyZUFkZCIsInB1dCIsInZhbCIsIm93bmVySUQiLCJjdXJyZW50T3B0SW5JZCIsInJldFJlc3BvbnNlIiwicmV0X3Jlc3BvbnNlIiwiZ2V0SW5mbyIsImV4IiwibWFpbFRlbXBsYXRlU2NoZW1hIiwiY3JlYXRlVXNlclNjaGVtYSIsInVwZGF0ZVVzZXJTY2hlbWEiLCJjb2xsZWN0aW9uT3B0aW9ucyIsInBhdGgiLCJyb3V0ZU9wdGlvbnMiLCJleGNsdWRlZEVuZHBvaW50cyIsImVuZHBvaW50cyIsImRlbGV0ZSIsInJvbGVSZXF1aXJlZCIsInBhcmFtSWQiLCJhZGRDb2xsZWN0aW9uIiwiUmVzdGl2dXMiLCJhcGlQYXRoIiwidXNlRGVmYXVsdEF1dGgiLCJwcmV0dHlKc29uIiwiSm9iQ29sbGVjdGlvbiIsInByb2Nlc3NKb2JzIiwid29ya1RpbWVvdXQiLCJjYiIsImZhaWwiLCJwYXVzZSIsInJlcGVhdCIsInNjaGVkdWxlIiwibGF0ZXIiLCJ0ZXh0IiwicSIsInBvbGxJbnRlcnZhbCIsImN1cnJlbnQiLCJzZXRNaW51dGVzIiwiZ2V0TWludXRlcyIsImlkcyIsIiRpbiIsImpvYlN0YXR1c1JlbW92YWJsZSIsInVwZGF0ZWQiLCIkbHQiLCJyZW1vdmVKb2JzIiwib2JzZXJ2ZSIsImFkZGVkIiwidHJpZ2dlciIsImRucyIsInN5bmNGdW5jIiwid3JhcEFzeW5jIiwiZG5zX3Jlc29sdmVUeHQiLCJyZWNvcmRzIiwicmVjb3JkIiwidHJpbSIsImdldFNlcnZlcnMiLCJnZXRBZGRyZXNzZXNCeUFjY291bnQiLCJnZXROZXdBZGRyZXNzIiwiTkFNRVNQQUNFIiwiY2xpZW50IiwiZG9pY2hhaW5fZHVtcHByaXZrZXkiLCJvdXJBZGRyZXNzIiwiY21kIiwiYWNjb3V0IiwiZG9pY2hhaW5fZ2V0YWRkcmVzc2VzYnlhY2NvdW50IiwiYWNjb3VudCIsIm91ckFjY291bnQiLCJkb2ljaGFpbl9nZXRuZXdhZGRyZXNzIiwiZG9pY2hhaW5fc2lnbk1lc3NhZ2UiLCJvdXJNZXNzYWdlIiwiZG9pY2hhaW5fbmFtZVNob3ciLCJvdXJJZCIsImNoZWNrSWQiLCJkb2ljaGFpbl9mZWVEb2kiLCJkb2ljaGFpbl9uYW1lRG9pIiwib3VyTmFtZSIsIm91clZhbHVlIiwiYmxvY2siLCJkb2ljaGFpbl9saXN0U2luY2VCbG9jayIsIm91ckJsb2NrIiwiZG9pY2hhaW5fZ2V0dHJhbnNhY3Rpb24iLCJkb2ljaGFpbl9nZXRyYXd0cmFuc2FjdGlvbiIsImRvaWNoYWluX2dldGJhbGFuY2UiLCJkb2ljaGFpbl9nZXRpbmZvIiwiRE9JX1BSRUZJWCIsInJldF92YWwiLCJnZXRIdHRwR0VUZGF0YSIsImdldEh0dHBQT1NUIiwiSFRUUCIsIl9nZXQiLCJfZ2V0RGF0YSIsIl9wb3N0IiwiX3B1dCIsIm91clVybCIsIm91clF1ZXJ5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLElBQUlBLE1BQUo7QUFBV0MsTUFBTSxDQUFDQyxJQUFQLENBQVksZUFBWixFQUE0QjtBQUFDRixRQUFNLENBQUNHLENBQUQsRUFBRztBQUFDSCxVQUFNLEdBQUNHLENBQVA7QUFBUzs7QUFBcEIsQ0FBNUIsRUFBa0QsQ0FBbEQ7QUFBcUQsSUFBSUMsS0FBSjtBQUFVSCxNQUFNLENBQUNDLElBQVAsQ0FBWSx1QkFBWixFQUFvQztBQUFDRSxPQUFLLENBQUNELENBQUQsRUFBRztBQUFDQyxTQUFLLEdBQUNELENBQU47QUFBUTs7QUFBbEIsQ0FBcEMsRUFBd0QsQ0FBeEQ7QUFBMkQsSUFBSUUsTUFBSjtBQUFXSixNQUFNLENBQUNDLElBQVAsQ0FBWSxlQUFaLEVBQTRCO0FBQUNHLFFBQU0sQ0FBQ0YsQ0FBRCxFQUFHO0FBQUNFLFVBQU0sR0FBQ0YsQ0FBUDtBQUFTOztBQUFwQixDQUE1QixFQUFrRCxDQUFsRDtBQUtoSkgsTUFBTSxDQUFDTSxPQUFQLENBQWUsYUFBZixFQUE4QixTQUFTQyxTQUFULEdBQXFCO0FBQ2pELE1BQUcsQ0FBQyxLQUFLQyxNQUFULEVBQWlCO0FBQ2YsV0FBTyxLQUFLQyxLQUFMLEVBQVA7QUFDRDs7QUFDRCxNQUFHLENBQUNMLEtBQUssQ0FBQ00sWUFBTixDQUFtQixLQUFLRixNQUF4QixFQUFnQyxDQUFDLE9BQUQsQ0FBaEMsQ0FBSixFQUErQztBQUM3QyxXQUFPSCxNQUFNLENBQUNNLElBQVAsQ0FBWTtBQUFDQyxhQUFPLEVBQUMsS0FBS0o7QUFBZCxLQUFaLEVBQW1DO0FBQ3hDSyxZQUFNLEVBQUVSLE1BQU0sQ0FBQ1M7QUFEeUIs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QUFKLENBQVMsZ0NBQVQ7QUFDSDs7QUFDRDRTLElBQUU7QUFDTCxDQWZPLENBQVI7QUFpQkEvSixRQUFRLENBQUNsWSxJQUFULENBQWM7QUFBRWlELE1BQUksRUFBRSxTQUFSO0FBQW1Cc0UsUUFBTSxFQUFFO0FBQTNCLENBQWQsRUFDSzRiLE9BREwsQ0FDYTtBQUNMQyxPQUFLLEVBQUUsWUFBWTtBQUFFWixLQUFDLENBQUNhLE9BQUY7QUFBYztBQUQ5QixDQURiLEU7Ozs7Ozs7Ozs7O0FDNUNBL2pCLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLHlCQUFaO0FBQXVDRCxNQUFNLENBQUNDLElBQVAsQ0FBWSxnQkFBWixFIiwiZmlsZSI6Ii9hcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCB7IFJvbGVzIH0gZnJvbSAnbWV0ZW9yL2FsYW5uaW5nOnJvbGVzJztcblxuaW1wb3J0IHsgT3B0SW5zIH0gZnJvbSAnLi4vb3B0LWlucy5qcyc7XG5cbk1ldGVvci5wdWJsaXNoKCdvcHQtaW5zLmFsbCcsIGZ1bmN0aW9uIE9wdEluc0FsbCgpIHtcbiAgaWYoIXRoaXMudXNlcklkKSB7XG4gICAgcmV0dXJuIHRoaXMucmVhZHkoKTtcbiAgfVxuICBpZighUm9sZXMudXNlcklzSW5Sb2xlKHRoaXMudXNlcklkLCBbJ2FkbWluJ10pKXtcbiAgICByZXR1cm4gT3B0SW5zLmZpbmQoe293bmVySWQ6dGhpcy51c2VySWR9LCB7XG4gICAgICBmaWVsZHM6IE9wdElucy5wdWJsaWNGaWVsZHMsXG4gICAgfSk7XG4gIH1cbiAgXG5cbiAgcmV0dXJuIE9wdElucy5maW5kKHt9LCB7XG4gICAgZmllbGRzOiBPcHRJbnMucHVibGljRmllbGRzLFxuICB9KTtcbn0pO1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgeyBERFBSYXRlTGltaXRlciB9IGZyb20gJ21ldGVvci9kZHAtcmF0ZS1saW1pdGVyJztcbmltcG9ydCB7IF9pMThuIGFzIGkxOG4gfSBmcm9tICdtZXRlb3IvdW5pdmVyc2U6aTE4bic7XG5pbXBvcnQgeyBWYWxpZGF0ZWRNZXRob2QgfSBmcm9tICdtZXRlb3IvbWRnOnZhbGlkYXRlZC1tZXRob2QnO1xuaW1wb3J0IHsgUm9sZXMgfSBmcm9tICdtZXRlb3IvYWxhbm5pbmc6cm9sZXMnO1xuaW1wb3J0IHsgXyB9IGZyb20gJ21ldGVvci91bmRlcnNjb3JlJztcbmltcG9ydCBhZGRPcHRJbiBmcm9tICcuLi8uLi9tb2R1bGVzL3NlcnZlci9vcHQtaW5zL2FkZF9hbmRfd3JpdGVfdG9fYmxvY2tjaGFpbi5qcyc7XG5cbmNvbnN0IGFkZCA9IG5ldyBWYWxpZGF0ZWRNZXRob2Qoe1xuICBuYW1lOiAnb3B0LWlucy5hZGQnLFxuICB2YWxpZGF0ZTogbnVsbCxcbiAgcnVuKHsgcmVjaXBpZW50TWFpbCwgc2VuZGVyTWFpbCwgZGF0YSB9KSB7XG4gICAgaWYoIXRoaXMudXNlcklkIHx8ICFSb2xlcy51c2VySXNJblJvbGUodGhpcy51c2VySWQsIFsnYWRtaW4nXSkpIHtcbiAgICAgIGNvbnN0IGVycm9yID0gXCJhcGkub3B0LWlucy5hZGQuYWNjZXNzRGVuaWVkXCI7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKGVycm9yLCBpMThuLl9fKGVycm9yKSk7XG4gICAgfVxuXG4gICAgY29uc3Qgb3B0SW4gPSB7XG4gICAgICBcInJlY2lwaWVudF9tYWlsXCI6IHJlY2lwaWVudE1haWwsXG4gICAgICBcInNlbmRlcl9tYWlsXCI6IHNlbmRlck1haWwsXG4gICAgICBkYXRhXG4gICAgfVxuXG4gICAgYWRkT3B0SW4ob3B0SW4pXG4gIH0sXG59KTtcblxuLy8gR2V0IGxpc3Qgb2YgYWxsIG1ldGhvZCBuYW1lcyBvbiBvcHQtaW5zXG5jb25zdCBPUFRJT05TX01FVEhPRFMgPSBfLnBsdWNrKFtcbiAgYWRkXG5dLCAnbmFtZScpO1xuXG5pZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIC8vIE9ubHkgYWxsb3cgNSBvcHQtaW4gb3BlcmF0aW9ucyBwZXIgY29ubmVjdGlvbiBwZXIgc2Vjb25kXG4gIEREUFJhdGVMaW1pdGVyLmFkZFJ1bGUoe1xuICAgIG5hbWUobmFtZSkge1xuICAgICAgcmV0dXJuIF8uY29udGFpbnMoT1BUSU9OU19NRVRIT0RTLCBuYW1lKTtcbiAgICB9LFxuXG4gICAgLy8gUmF0ZSBsaW1pdCBwZXIgY29ubmVjdGlvbiBJRFxuICAgIGNvbm5lY3Rpb25JZCgpIHsgcmV0dXJuIHRydWU7IH0sXG4gIH0sIDUsIDEwMDApO1xufVxuIiwiaW1wb3J0IHsgTW9uZ28gfSBmcm9tICdtZXRlb3IvbW9uZ28nO1xuaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tICdzaW1wbC1zY2hlbWEnO1xuXG5jbGFzcyBPcHRJbnNDb2xsZWN0aW9uIGV4dGVuZHMgTW9uZ28uQ29sbGVjdGlvbiB7XG4gIGluc2VydChvcHRJbiwgY2FsbGJhY2spIHtcbiAgICBjb25zdCBvdXJPcHRJbiA9IG9wdEluO1xuICAgIG91ck9wdEluLnJlY2lwaWVudF9zZW5kZXIgPSBvdXJPcHRJbi5yZWNpcGllbnQrb3VyT3B0SW4uc2VuZGVyO1xuICAgIG91ck9wdEluLmNyZWF0ZWRBdCA9IG91ck9wdEluLmNyZWF0ZWRBdCB8fCBuZXcgRGF0ZSgpO1xuICAgIGNvbnN0IHJlc3VsdCA9IHN1cGVyLmluc2VydChvdXJPcHRJbiwgY2FsbGJhY2spO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgdXBkYXRlKHNlbGVjdG9yLCBtb2RpZmllcikge1xuICAgIGNvbnN0IHJlc3VsdCA9IHN1cGVyLnVwZGF0ZShzZWxlY3RvciwgbW9kaWZpZXIpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgcmVtb3ZlKHNlbGVjdG9yKSB7XG4gICAgY29uc3QgcmVzdWx0ID0gc3VwZXIucmVtb3ZlKHNlbGVjdG9yKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG5cbmV4cG9ydCBjb25zdCBPcHRJbnMgPSBuZXcgT3B0SW5zQ29sbGVjdGlvbignb3B0LWlucycpO1xuXG4vLyBEZW55IGFsbCBjbGllbnQtc2lkZSB1cGRhdGVzIHNpbmNlIHdlIHdpbGwgYmUgdXNpbmcgbWV0aG9kcyB0byBtYW5hZ2UgdGhpcyBjb2xsZWN0aW9uXG5PcHRJbnMuZGVueSh7XG4gIGluc2VydCgpIHsgcmV0dXJuIHRydWU7IH0sXG4gIHVwZGF0ZSgpIHsgcmV0dXJuIHRydWU7IH0sXG4gIHJlbW92ZSgpIHsgcmV0dXJuIHRydWU7IH0sXG59KTtcblxuT3B0SW5zLnNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICBfaWQ6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgcmVnRXg6IFNpbXBsZVNjaGVtYS5SZWdFeC5JZCxcbiAgfSxcbiAgcmVjaXBpZW50OiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIG9wdGlvbmFsOiB0cnVlLFxuICAgIGRlbnlVcGRhdGU6IHRydWUsXG4gIH0sXG4gIHNlbmRlcjoge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICBvcHRpb25hbDogdHJ1ZSxcbiAgICBkZW55VXBkYXRlOiB0cnVlLFxuICB9LFxuICBkYXRhOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIG9wdGlvbmFsOiB0cnVlLFxuICAgIGRlbnlVcGRhdGU6IGZhbHNlLFxuICB9LFxuICBpbmRleDoge1xuICAgIHR5cGU6IFNpbXBsZVNjaGVtYS5JbnRlZ2VyLFxuICAgIG9wdGlvbmFsOiB0cnVlLFxuICAgIGRlbnlVcGRhdGU6IGZhbHNlLFxuICB9LFxuICBuYW1lSWQ6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgb3B0aW9uYWw6IHRydWUsXG4gICAgZGVueVVwZGF0ZTogZmFsc2UsXG4gIH0sXG4gIHR4SWQ6IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIG9wdGlvbmFsOiB0cnVlLFxuICAgICAgZGVueVVwZGF0ZTogZmFsc2UsXG4gIH0sXG4gIG1hc3RlckRvaToge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgb3B0aW9uYWw6IHRydWUsXG4gICAgICBkZW55VXBkYXRlOiBmYWxzZSxcbiAgfSxcbiAgY3JlYXRlZEF0OiB7XG4gICAgdHlwZTogRGF0ZSxcbiAgICBkZW55VXBkYXRlOiB0cnVlLFxuICB9LFxuICBjb25maXJtZWRBdDoge1xuICAgIHR5cGU6IERhdGUsXG4gICAgb3B0aW9uYWw6IHRydWUsXG4gICAgZGVueVVwZGF0ZTogZmFsc2UsXG4gIH0sXG4gIGNvbmZpcm1lZEJ5OiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIHJlZ0V4OiBTaW1wbGVTY2hlbWEuUmVnRXguSVAsXG4gICAgb3B0aW9uYWw6IHRydWUsXG4gICAgZGVueVVwZGF0ZTogZmFsc2VcbiAgfSxcbiAgY29uZmlybWF0aW9uVG9rZW46IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgb3B0aW9uYWw6IHRydWUsXG4gICAgZGVueVVwZGF0ZTogZmFsc2VcbiAgfSxcbiAgb3duZXJJZDp7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIG9wdGlvbmFsOiB0cnVlLFxuICAgIHJlZ0V4OiBTaW1wbGVTY2hlbWEuUmVnRXguSWRcbiAgfSxcbiAgZXJyb3I6e1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgb3B0aW9uYWw6IHRydWUsXG4gICAgICBkZW55VXBkYXRlOiBmYWxzZVxuICB9XG59KTtcblxuT3B0SW5zLmF0dGFjaFNjaGVtYShPcHRJbnMuc2NoZW1hKTtcblxuLy8gVGhpcyByZXByZXNlbnRzIHRoZSBrZXlzIGZyb20gT3B0LUluIG9iamVjdHMgdGhhdCBzaG91bGQgYmUgcHVibGlzaGVkXG4vLyB0byB0aGUgY2xpZW50LiBJZiB3ZSBhZGQgc2VjcmV0IHByb3BlcnRpZXMgdG8gT3B0LUluIG9iamVjdHMsIGRvbid0IGxpc3Rcbi8vIHRoZW0gaGVyZSB0byBrZWVwIHRoZW0gcHJpdmF0ZSB0byB0aGUgc2VydmVyLlxuT3B0SW5zLnB1YmxpY0ZpZWxkcyA9IHtcbiAgX2lkOiAxLFxuICByZWNpcGllbnQ6IDEsXG4gIHNlbmRlcjogMSxcbiAgZGF0YTogMSxcbiAgaW5kZXg6IDEsXG4gIG5hbWVJZDogMSxcbiAgdHhJZDogMSxcbiAgbWFzdGVyRG9pOiAxLFxuICBjcmVhdGVkQXQ6IDEsXG4gIGNvbmZpcm1lZEF0OiAxLFxuICBjb25maXJtZWRCeTogMSxcbiAgb3duZXJJZDogMSxcbiAgZXJyb3I6IDFcbn07XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCB7IFJvbGVzIH0gZnJvbSAnbWV0ZW9yL2FsYW5uaW5nOnJvbGVzJztcblxuaW1wb3J0IHsgUmVjaXBpZW50cyB9IGZyb20gJy4uL3JlY2lwaWVudHMuanMnO1xuaW1wb3J0IHsgT3B0SW5zfSBmcm9tICcuLi8uLi9vcHQtaW5zL29wdC1pbnMuanMnXG5NZXRlb3IucHVibGlzaCgncmVjaXBpZW50cy5ieU93bmVyJyxmdW5jdGlvbiByZWNpcGllbnRHZXQoKXtcbiAgbGV0IHBpcGVsaW5lPVtdO1xuICBpZighUm9sZXMudXNlcklzSW5Sb2xlKHRoaXMudXNlcklkLCBbJ2FkbWluJ10pKXtcbiAgICBwaXBlbGluZS5wdXNoKFxuICAgICAgeyRyZWRhY3Q6e1xuICAgICAgJGNvbmQ6IHtcbiAgICAgICAgaWY6IHsgJGNtcDogWyBcIiRvd25lcklkXCIsIHRoaXMudXNlcklkIF0gfSxcbiAgICAgICAgdGhlbjogXCIkJFBSVU5FXCIsXG4gICAgICAgIGVsc2U6IFwiJCRLRUVQXCIgfX19KTtcbiAgICAgIH1cbiAgICAgIHBpcGVsaW5lLnB1c2goeyAkbG9va3VwOiB7IGZyb206IFwicmVjaXBpZW50c1wiLCBsb2NhbEZpZWxkOiBcInJlY2lwaWVudFwiLCBmb3JlaWduRmllbGQ6IFwiX2lkXCIsIGFzOiBcIlJlY2lwaWVudEVtYWlsXCIgfSB9KTtcbiAgICAgIHBpcGVsaW5lLnB1c2goeyAkdW53aW5kOiBcIiRSZWNpcGllbnRFbWFpbFwifSk7XG4gICAgICBwaXBlbGluZS5wdXNoKHsgJHByb2plY3Q6IHtcIlJlY2lwaWVudEVtYWlsLl9pZFwiOjF9fSk7XG5cbiAgICAgIGNvbnN0IHJlc3VsdCA9IE9wdElucy5hZ2dyZWdhdGUocGlwZWxpbmUpO1xuICAgICAgbGV0IHJJZHM9W107XG4gICAgICByZXN1bHQuZm9yRWFjaChlbGVtZW50ID0+IHtcbiAgICAgICAgcklkcy5wdXNoKGVsZW1lbnQuUmVjaXBpZW50RW1haWwuX2lkKTtcbiAgICAgIH0pO1xuICByZXR1cm4gUmVjaXBpZW50cy5maW5kKHtcIl9pZFwiOntcIiRpblwiOnJJZHN9fSx7ZmllbGRzOlJlY2lwaWVudHMucHVibGljRmllbGRzfSk7XG59KTtcbk1ldGVvci5wdWJsaXNoKCdyZWNpcGllbnRzLmFsbCcsIGZ1bmN0aW9uIHJlY2lwaWVudHNBbGwoKSB7XG4gIGlmKCF0aGlzLnVzZXJJZCB8fCAhUm9sZXMudXNlcklzSW5Sb2xlKHRoaXMudXNlcklkLCBbJ2FkbWluJ10pKSB7XG4gICAgcmV0dXJuIHRoaXMucmVhZHkoKTtcbiAgfVxuXG4gIHJldHVybiBSZWNpcGllbnRzLmZpbmQoe30sIHtcbiAgICBmaWVsZHM6IFJlY2lwaWVudHMucHVibGljRmllbGRzLFxuICB9KTtcbn0pO1xuIiwiaW1wb3J0IHsgTW9uZ28gfSBmcm9tICdtZXRlb3IvbW9uZ28nO1xuaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tICdzaW1wbC1zY2hlbWEnO1xuXG5jbGFzcyBSZWNpcGllbnRzQ29sbGVjdGlvbiBleHRlbmRzIE1vbmdvLkNvbGxlY3Rpb24ge1xuICBpbnNlcnQocmVjaXBpZW50LCBjYWxsYmFjaykge1xuICAgIGNvbnN0IG91clJlY2lwaWVudCA9IHJlY2lwaWVudDtcbiAgICBvdXJSZWNpcGllbnQuY3JlYXRlZEF0ID0gb3VyUmVjaXBpZW50LmNyZWF0ZWRBdCB8fCBuZXcgRGF0ZSgpO1xuICAgIGNvbnN0IHJlc3VsdCA9IHN1cGVyLmluc2VydChvdXJSZWNpcGllbnQsIGNhbGxiYWNrKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIHVwZGF0ZShzZWxlY3RvciwgbW9kaWZpZXIpIHtcbiAgICBjb25zdCByZXN1bHQgPSBzdXBlci51cGRhdGUoc2VsZWN0b3IsIG1vZGlmaWVyKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIHJlbW92ZShzZWxlY3Rvcikge1xuICAgIGNvbnN0IHJlc3VsdCA9IHN1cGVyLnJlbW92ZShzZWxlY3Rvcik7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgUmVjaXBpZW50cyA9IG5ldyBSZWNpcGllbnRzQ29sbGVjdGlvbigncmVjaXBpZW50cycpO1xuXG4vLyBEZW55IGFsbCBjbGllbnQtc2lkZSB1cGRhdGVzIHNpbmNlIHdlIHdpbGwgYmUgdXNpbmcgbWV0aG9kcyB0byBtYW5hZ2UgdGhpcyBjb2xsZWN0aW9uXG5SZWNpcGllbnRzLmRlbnkoe1xuICBpbnNlcnQoKSB7IHJldHVybiB0cnVlOyB9LFxuICB1cGRhdGUoKSB7IHJldHVybiB0cnVlOyB9LFxuICByZW1vdmUoKSB7IHJldHVybiB0cnVlOyB9LFxufSk7XG5cblJlY2lwaWVudHMuc2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIF9pZDoge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICByZWdFeDogU2ltcGxlU2NoZW1hLlJlZ0V4LklkLFxuICB9LFxuICBlbWFpbDoge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICBpbmRleDogdHJ1ZSxcbiAgICBkZW55VXBkYXRlOiB0cnVlLFxuICB9LFxuICBwcml2YXRlS2V5OiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIHVuaXF1ZTogdHJ1ZSxcbiAgICBkZW55VXBkYXRlOiB0cnVlLFxuICB9LFxuICBwdWJsaWNLZXk6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgdW5pcXVlOiB0cnVlLFxuICAgIGRlbnlVcGRhdGU6IHRydWUsXG4gIH0sXG4gIGNyZWF0ZWRBdDoge1xuICAgIHR5cGU6IERhdGUsXG4gICAgZGVueVVwZGF0ZTogdHJ1ZSxcbiAgfVxufSk7XG5cblJlY2lwaWVudHMuYXR0YWNoU2NoZW1hKFJlY2lwaWVudHMuc2NoZW1hKTtcblxuLy8gVGhpcyByZXByZXNlbnRzIHRoZSBrZXlzIGZyb20gUmVjaXBpZW50IG9iamVjdHMgdGhhdCBzaG91bGQgYmUgcHVibGlzaGVkXG4vLyB0byB0aGUgY2xpZW50LiBJZiB3ZSBhZGQgc2VjcmV0IHByb3BlcnRpZXMgdG8gUmVjaXBpZW50IG9iamVjdHMsIGRvbid0IGxpc3Rcbi8vIHRoZW0gaGVyZSB0byBrZWVwIHRoZW0gcHJpdmF0ZSB0byB0aGUgc2VydmVyLlxuUmVjaXBpZW50cy5wdWJsaWNGaWVsZHMgPSB7XG4gIF9pZDogMSxcbiAgZW1haWw6IDEsXG4gIHB1YmxpY0tleTogMSxcbiAgY3JlYXRlZEF0OiAxXG59O1xuIiwiaW1wb3J0IHsgTW9uZ28gfSBmcm9tICdtZXRlb3IvbW9uZ28nO1xuaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tICdzaW1wbC1zY2hlbWEnO1xuXG5jbGFzcyBEb2ljaGFpbkVudHJpZXNDb2xsZWN0aW9uIGV4dGVuZHMgTW9uZ28uQ29sbGVjdGlvbiB7XG4gIGluc2VydChlbnRyeSwgY2FsbGJhY2spIHtcbiAgICBjb25zdCByZXN1bHQgPSBzdXBlci5pbnNlcnQoZW50cnksIGNhbGxiYWNrKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIHVwZGF0ZShzZWxlY3RvciwgbW9kaWZpZXIpIHtcbiAgICBjb25zdCByZXN1bHQgPSBzdXBlci51cGRhdGUoc2VsZWN0b3IsIG1vZGlmaWVyKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIHJlbW92ZShzZWxlY3Rvcikge1xuICAgIGNvbnN0IHJlc3VsdCA9IHN1cGVyLnJlbW92ZShzZWxlY3Rvcik7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgRG9pY2hhaW5FbnRyaWVzID0gbmV3IERvaWNoYWluRW50cmllc0NvbGxlY3Rpb24oJ2RvaWNoYWluLWVudHJpZXMnKTtcblxuLy8gRGVueSBhbGwgY2xpZW50LXNpZGUgdXBkYXRlcyBzaW5jZSB3ZSB3aWxsIGJlIHVzaW5nIG1ldGhvZHMgdG8gbWFuYWdlIHRoaXMgY29sbGVjdGlvblxuRG9pY2hhaW5FbnRyaWVzLmRlbnkoe1xuICBpbnNlcnQoKSB7IHJldHVybiB0cnVlOyB9LFxuICB1cGRhdGUoKSB7IHJldHVybiB0cnVlOyB9LFxuICByZW1vdmUoKSB7IHJldHVybiB0cnVlOyB9LFxufSk7XG5cbkRvaWNoYWluRW50cmllcy5zY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgX2lkOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIHJlZ0V4OiBTaW1wbGVTY2hlbWEuUmVnRXguSWQsXG4gIH0sXG4gIG5hbWU6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgaW5kZXg6IHRydWUsXG4gICAgZGVueVVwZGF0ZTogdHJ1ZVxuICB9LFxuICB2YWx1ZToge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICBkZW55VXBkYXRlOiBmYWxzZVxuICB9LFxuICBhZGRyZXNzOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIGRlbnlVcGRhdGU6IGZhbHNlXG4gIH0sXG4gIG1hc3RlckRvaToge1xuICAgICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICAgIG9wdGlvbmFsOiB0cnVlLFxuICAgICAgICBpbmRleDogdHJ1ZSxcbiAgICAgICAgZGVueVVwZGF0ZTogdHJ1ZVxuICB9LFxuICBpbmRleDoge1xuICAgICAgICB0eXBlOiBTaW1wbGVTY2hlbWEuSW50ZWdlcixcbiAgICAgICAgb3B0aW9uYWw6IHRydWUsXG4gICAgICAgIGRlbnlVcGRhdGU6IHRydWVcbiAgfSxcbiAgdHhJZDoge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICBkZW55VXBkYXRlOiBmYWxzZVxuICB9XG59KTtcblxuRG9pY2hhaW5FbnRyaWVzLmF0dGFjaFNjaGVtYShEb2ljaGFpbkVudHJpZXMuc2NoZW1hKTtcblxuLy8gVGhpcyByZXByZXNlbnRzIHRoZSBrZXlzIGZyb20gRW50cnkgb2JqZWN0cyB0aGF0IHNob3VsZCBiZSBwdWJsaXNoZWRcbi8vIHRvIHRoZSBjbGllbnQuIElmIHdlIGFkZCBzZWNyZXQgcHJvcGVydGllcyB0byBFbnRyeSBvYmplY3RzLCBkb24ndCBsaXN0XG4vLyB0aGVtIGhlcmUgdG8ga2VlcCB0aGVtIHByaXZhdGUgdG8gdGhlIHNlcnZlci5cbkRvaWNoYWluRW50cmllcy5wdWJsaWNGaWVsZHMgPSB7XG4gIF9pZDogMSxcbiAgbmFtZTogMSxcbiAgdmFsdWU6IDEsXG4gIGFkZHJlc3M6IDEsXG4gIG1hc3RlckRvaTogMSxcbiAgaW5kZXg6IDEsXG4gIHR4SWQ6IDFcbn07XG4iLCJpbXBvcnQgeyBWYWxpZGF0ZWRNZXRob2QgfSBmcm9tICdtZXRlb3IvbWRnOnZhbGlkYXRlZC1tZXRob2QnO1xuaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgeyBERFBSYXRlTGltaXRlciB9IGZyb20gJ21ldGVvci9kZHAtcmF0ZS1saW1pdGVyJztcbmltcG9ydCBnZXRLZXlQYWlyTSBmcm9tICcuLi8uLi9tb2R1bGVzL3NlcnZlci9kb2ljaGFpbi9nZXRfa2V5LXBhaXIuanMnO1xuaW1wb3J0IGdldEJhbGFuY2VNIGZyb20gJy4uLy4uL21vZHVsZXMvc2VydmVyL2RvaWNoYWluL2dldF9iYWxhbmNlLmpzJztcblxuXG5jb25zdCBnZXRLZXlQYWlyID0gbmV3IFZhbGlkYXRlZE1ldGhvZCh7XG4gIG5hbWU6ICdkb2ljaGFpbi5nZXRLZXlQYWlyJyxcbiAgdmFsaWRhdGU6IG51bGwsXG4gIHJ1bigpIHtcbiAgICByZXR1cm4gZ2V0S2V5UGFpck0oKTtcbiAgfSxcbn0pO1xuXG5jb25zdCBnZXRCYWxhbmNlID0gbmV3IFZhbGlkYXRlZE1ldGhvZCh7XG4gIG5hbWU6ICdkb2ljaGFpbi5nZXRCYWxhbmNlJyxcbiAgdmFsaWRhdGU6IG51bGwsXG4gIHJ1bigpIHtcbiAgICBjb25zdCBsb2dWYWwgPSBnZXRCYWxhbmNlTSgpO1xuICAgIHJldHVybiBsb2dWYWw7XG4gIH0sXG59KTtcblxuXG4vLyBHZXQgbGlzdCBvZiBhbGwgbWV0aG9kIG5hbWVzIG9uIGRvaWNoYWluXG5jb25zdCBPUFRJTlNfTUVUSE9EUyA9IF8ucGx1Y2soW1xuICBnZXRLZXlQYWlyXG4sZ2V0QmFsYW5jZV0sICduYW1lJyk7XG5cbmlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgLy8gT25seSBhbGxvdyA1IG9wdC1pbiBvcGVyYXRpb25zIHBlciBjb25uZWN0aW9uIHBlciBzZWNvbmRcbiAgRERQUmF0ZUxpbWl0ZXIuYWRkUnVsZSh7XG4gICAgbmFtZShuYW1lKSB7XG4gICAgICByZXR1cm4gXy5jb250YWlucyhPUFRJTlNfTUVUSE9EUywgbmFtZSk7XG4gICAgfSxcblxuICAgIC8vIFJhdGUgbGltaXQgcGVyIGNvbm5lY3Rpb24gSURcbiAgICBjb25uZWN0aW9uSWQoKSB7IHJldHVybiB0cnVlOyB9LFxuICB9LCA1LCAxMDAwKTtcbn1cbiIsImltcG9ydCB7IE1ldGVvcn0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgeyBERFBSYXRlTGltaXRlciB9IGZyb20gJ21ldGVvci9kZHAtcmF0ZS1saW1pdGVyJztcbmltcG9ydCB7IFZhbGlkYXRlZE1ldGhvZCB9IGZyb20gJ21ldGVvci9tZGc6dmFsaWRhdGVkLW1ldGhvZCc7XG5pbXBvcnQgZ2V0TGFuZ3VhZ2VzIGZyb20gJy4uLy4uL21vZHVsZXMvc2VydmVyL2xhbmd1YWdlcy9nZXQuanMnO1xuXG5jb25zdCBnZXRBbGxMYW5ndWFnZXMgPSBuZXcgVmFsaWRhdGVkTWV0aG9kKHtcbiAgbmFtZTogJ2xhbmd1YWdlcy5nZXRBbGwnLFxuICB2YWxpZGF0ZTogbnVsbCxcbiAgcnVuKCkge1xuICAgIHJldHVybiBnZXRMYW5ndWFnZXMoKTtcbiAgfSxcbn0pO1xuXG4vLyBHZXQgbGlzdCBvZiBhbGwgbWV0aG9kIG5hbWVzIG9uIGxhbmd1YWdlc1xuY29uc3QgT1BUSU5TX01FVEhPRFMgPSBfLnBsdWNrKFtcbiAgZ2V0QWxsTGFuZ3VhZ2VzXG5dLCAnbmFtZScpO1xuXG5pZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIC8vIE9ubHkgYWxsb3cgNSBvcHQtaW4gb3BlcmF0aW9ucyBwZXIgY29ubmVjdGlvbiBwZXIgc2Vjb25kXG4gIEREUFJhdGVMaW1pdGVyLmFkZFJ1bGUoe1xuICAgIG5hbWUobmFtZSkge1xuICAgICAgcmV0dXJuIF8uY29udGFpbnMoT1BUSU5TX01FVEhPRFMsIG5hbWUpO1xuICAgIH0sXG5cbiAgICAvLyBSYXRlIGxpbWl0IHBlciBjb25uZWN0aW9uIElEXG4gICAgY29ubmVjdGlvbklkKCkgeyByZXR1cm4gdHJ1ZTsgfSxcbiAgfSwgNSwgMTAwMCk7XG59XG4iLCJpbXBvcnQgeyBNb25nbyB9IGZyb20gJ21ldGVvci9tb25nbyc7XG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XG5cbmNsYXNzIE1ldGFDb2xsZWN0aW9uIGV4dGVuZHMgTW9uZ28uQ29sbGVjdGlvbiB7XG4gIGluc2VydChkYXRhLCBjYWxsYmFjaykge1xuICAgIGNvbnN0IG91ckRhdGEgPSBkYXRhO1xuICAgIGNvbnN0IHJlc3VsdCA9IHN1cGVyLmluc2VydChvdXJEYXRhLCBjYWxsYmFjayk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICB1cGRhdGUoc2VsZWN0b3IsIG1vZGlmaWVyKSB7XG4gICAgY29uc3QgcmVzdWx0ID0gc3VwZXIudXBkYXRlKHNlbGVjdG9yLCBtb2RpZmllcik7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICByZW1vdmUoc2VsZWN0b3IpIHtcbiAgICBjb25zdCByZXN1bHQgPSBzdXBlci5yZW1vdmUoc2VsZWN0b3IpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IE1ldGEgPSBuZXcgTWV0YUNvbGxlY3Rpb24oJ21ldGEnKTtcblxuLy8gRGVueSBhbGwgY2xpZW50LXNpZGUgdXBkYXRlcyBzaW5jZSB3ZSB3aWxsIGJlIHVzaW5nIG1ldGhvZHMgdG8gbWFuYWdlIHRoaXMgY29sbGVjdGlvblxuTWV0YS5kZW55KHtcbiAgaW5zZXJ0KCkgeyByZXR1cm4gdHJ1ZTsgfSxcbiAgdXBkYXRlKCkgeyByZXR1cm4gdHJ1ZTsgfSxcbiAgcmVtb3ZlKCkgeyByZXR1cm4gdHJ1ZTsgfSxcbn0pO1xuXG5NZXRhLnNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICBfaWQ6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgcmVnRXg6IFNpbXBsZVNjaGVtYS5SZWdFeC5JZCxcbiAgfSxcbiAga2V5OiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIGluZGV4OiB0cnVlLFxuICAgIGRlbnlVcGRhdGU6IHRydWVcbiAgfSxcbiAgdmFsdWU6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfVxufSk7XG5cbk1ldGEuYXR0YWNoU2NoZW1hKE1ldGEuc2NoZW1hKTtcblxuLy8gVGhpcyByZXByZXNlbnRzIHRoZSBrZXlzIGZyb20gTWV0YSBvYmplY3RzIHRoYXQgc2hvdWxkIGJlIHB1Ymxpc2hlZFxuLy8gdG8gdGhlIGNsaWVudC4gSWYgd2UgYWRkIHNlY3JldCBwcm9wZXJ0aWVzIHRvIE1ldGEgb2JqZWN0cywgZG9uJ3QgbGlzdFxuLy8gdGhlbSBoZXJlIHRvIGtlZXAgdGhlbSBwcml2YXRlIHRvIHRoZSBzZXJ2ZXIuXG5NZXRhLnB1YmxpY0ZpZWxkcyA9IHtcbn07XG4iLCJpbXBvcnQgeyBNb25nbyB9IGZyb20gJ21ldGVvci9tb25nbyc7XG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XG5cbmNsYXNzIFNlbmRlcnNDb2xsZWN0aW9uIGV4dGVuZHMgTW9uZ28uQ29sbGVjdGlvbiB7XG4gIGluc2VydChzZW5kZXIsIGNhbGxiYWNrKSB7XG4gICAgY29uc3Qgb3VyU2VuZGVyID0gc2VuZGVyO1xuICAgIG91clNlbmRlci5jcmVhdGVkQXQgPSBvdXJTZW5kZXIuY3JlYXRlZEF0IHx8IG5ldyBEYXRlKCk7XG4gICAgY29uc3QgcmVzdWx0ID0gc3VwZXIuaW5zZXJ0KG91clNlbmRlciwgY2FsbGJhY2spO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgdXBkYXRlKHNlbGVjdG9yLCBtb2RpZmllcikge1xuICAgIGNvbnN0IHJlc3VsdCA9IHN1cGVyLnVwZGF0ZShzZWxlY3RvciwgbW9kaWZpZXIpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgcmVtb3ZlKHNlbGVjdG9yKSB7XG4gICAgY29uc3QgcmVzdWx0ID0gc3VwZXIucmVtb3ZlKHNlbGVjdG9yKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG5cbmV4cG9ydCBjb25zdCBTZW5kZXJzID0gbmV3IFNlbmRlcnNDb2xsZWN0aW9uKCdzZW5kZXJzJyk7XG5cbi8vIERlbnkgYWxsIGNsaWVudC1zaWRlIHVwZGF0ZXMgc2luY2Ugd2Ugd2lsbCBiZSB1c2luZyBtZXRob2RzIHRvIG1hbmFnZSB0aGlzIGNvbGxlY3Rpb25cblNlbmRlcnMuZGVueSh7XG4gIGluc2VydCgpIHsgcmV0dXJuIHRydWU7IH0sXG4gIHVwZGF0ZSgpIHsgcmV0dXJuIHRydWU7IH0sXG4gIHJlbW92ZSgpIHsgcmV0dXJuIHRydWU7IH0sXG59KTtcblxuU2VuZGVycy5zY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgX2lkOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIHJlZ0V4OiBTaW1wbGVTY2hlbWEuUmVnRXguSWQsXG4gIH0sXG4gIGVtYWlsOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIGluZGV4OiB0cnVlLFxuICAgIGRlbnlVcGRhdGU6IHRydWUsXG4gIH0sXG4gIGNyZWF0ZWRBdDoge1xuICAgIHR5cGU6IERhdGUsXG4gICAgZGVueVVwZGF0ZTogdHJ1ZSxcbiAgfVxufSk7XG5cblNlbmRlcnMuYXR0YWNoU2NoZW1hKFNlbmRlcnMuc2NoZW1hKTtcblxuLy8gVGhpcyByZXByZXNlbnRzIHRoZSBrZXlzIGZyb20gU2VuZGVyIG9iamVjdHMgdGhhdCBzaG91bGQgYmUgcHVibGlzaGVkXG4vLyB0byB0aGUgY2xpZW50LiBJZiB3ZSBhZGQgc2VjcmV0IHByb3BlcnRpZXMgdG8gU2VuZGVyIG9iamVjdHMsIGRvbid0IGxpc3Rcbi8vIHRoZW0gaGVyZSB0byBrZWVwIHRoZW0gcHJpdmF0ZSB0byB0aGUgc2VydmVyLlxuU2VuZGVycy5wdWJsaWNGaWVsZHMgPSB7XG4gIGVtYWlsOiAxLFxuICBjcmVhdGVkQXQ6IDFcbn07XG4iLCJpbXBvcnQgeyBNZXRlb3J9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IHsgTWV0YSB9IGZyb20gJy4uL21ldGEvbWV0YSc7XG5cbk1ldGVvci5wdWJsaXNoKCd2ZXJzaW9uJywgZnVuY3Rpb24gdmVyc2lvbigpIHtcbiAgcmV0dXJuIE1ldGEuZmluZCh7fSk7XG59KTtcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tICdzaW1wbC1zY2hlbWEnO1xuaW1wb3J0IHsgRE9JX01BSUxfRkVUQ0hfVVJMIH0gZnJvbSAnLi4vLi4vLi4vc3RhcnR1cC9zZXJ2ZXIvZW1haWwtY29uZmlndXJhdGlvbi5qcyc7XG5pbXBvcnQge2xvZ1NlbmR9IGZyb20gXCIuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9sb2ctY29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHtPcHRJbnN9IGZyb20gXCIuLi8uLi8uLi9hcGkvb3B0LWlucy9vcHQtaW5zXCI7XG5cbmNvbnN0IEV4cG9ydERvaXNEYXRhU2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIHN0YXR1czoge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICBvcHRpb25hbDogdHJ1ZSxcbiAgfSxcbiAgcm9sZTp7XG4gICAgdHlwZTpTdHJpbmdcbiAgfSxcbiAgdXNlcmlkOntcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgcmVnRXg6IFNpbXBsZVNjaGVtYS5SZWdFeC5pZCxcbiAgICBvcHRpb25hbDp0cnVlIFxuICB9XG59KTtcblxuLy9UT0RPIGFkZCBzZW5kZXIgYW5kIHJlY2lwaWVudCBlbWFpbCBhZGRyZXNzIHRvIGV4cG9ydFxuXG5jb25zdCBleHBvcnREb2lzID0gKGRhdGEpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBvdXJEYXRhID0gZGF0YTtcbiAgICBFeHBvcnREb2lzRGF0YVNjaGVtYS52YWxpZGF0ZShvdXJEYXRhKTtcbiAgICBsZXQgcGlwZWxpbmU9W3sgJG1hdGNoOiB7XCJjb25maXJtZWRBdFwiOnsgJGV4aXN0czogdHJ1ZSwgJG5lOiBudWxsIH19IH1dO1xuICAgIFxuICAgIGlmKG91ckRhdGEucm9sZSE9J2FkbWluJ3x8b3VyRGF0YS51c2VyaWQhPXVuZGVmaW5lZCl7XG4gICAgICBwaXBlbGluZS5wdXNoKHsgJHJlZGFjdDp7XG4gICAgICAgICRjb25kOiB7XG4gICAgICAgICAgaWY6IHsgJGNtcDogWyBcIiRvd25lcklkXCIsIG91ckRhdGEudXNlcmlkIF0gfSxcbiAgICAgICAgICB0aGVuOiBcIiQkUFJVTkVcIixcbiAgICAgICAgICBlbHNlOiBcIiQkS0VFUFwiIH19fSk7XG4gICAgfVxuICAgIHBpcGVsaW5lLmNvbmNhdChbXG4gICAgICAgIHsgJGxvb2t1cDogeyBmcm9tOiBcInJlY2lwaWVudHNcIiwgbG9jYWxGaWVsZDogXCJyZWNpcGllbnRcIiwgZm9yZWlnbkZpZWxkOiBcIl9pZFwiLCBhczogXCJSZWNpcGllbnRFbWFpbFwiIH0gfSxcbiAgICAgICAgeyAkbG9va3VwOiB7IGZyb206IFwic2VuZGVyc1wiLCBsb2NhbEZpZWxkOiBcInNlbmRlclwiLCBmb3JlaWduRmllbGQ6IFwiX2lkXCIsIGFzOiBcIlNlbmRlckVtYWlsXCIgfSB9LFxuICAgICAgICB7ICR1bndpbmQ6IFwiJFNlbmRlckVtYWlsXCJ9LFxuICAgICAgICB7ICR1bndpbmQ6IFwiJFJlY2lwaWVudEVtYWlsXCJ9LFxuICAgICAgICB7ICRwcm9qZWN0OiB7XCJfaWRcIjoxLFwiY3JlYXRlZEF0XCI6MSwgXCJjb25maXJtZWRBdFwiOjEsXCJuYW1lSWRcIjoxLCBcIlNlbmRlckVtYWlsLmVtYWlsXCI6MSxcIlJlY2lwaWVudEVtYWlsLmVtYWlsXCI6MX19XG4gICAgXSk7XG4gICAgLy9pZihvdXJEYXRhLnN0YXR1cz09MSkgcXVlcnkgPSB7XCJjb25maXJtZWRBdFwiOiB7ICRleGlzdHM6IHRydWUsICRuZTogbnVsbCB9fVxuXG4gICAgbGV0IG9wdElucyA9ICBPcHRJbnMuYWdncmVnYXRlKHBpcGVsaW5lKTtcbiAgICBsZXQgZXhwb3J0RG9pRGF0YTtcbiAgICB0cnkge1xuICAgICAgICBleHBvcnREb2lEYXRhID0gb3B0SW5zO1xuICAgICAgICBsb2dTZW5kKCdleHBvcnREb2kgdXJsOicsRE9JX01BSUxfRkVUQ0hfVVJMLEpTT04uc3RyaW5naWZ5KGV4cG9ydERvaURhdGEpKTtcbiAgICAgIHJldHVybiBleHBvcnREb2lEYXRhXG5cbiAgICB9IGNhdGNoKGVycm9yKSB7XG4gICAgICB0aHJvdyBcIkVycm9yIHdoaWxlIGV4cG9ydGluZyBkb2lzOiBcIitlcnJvcjtcbiAgICB9XG5cbiAgfSBjYXRjaCAoZXhjZXB0aW9uKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZGFwcHMuZXhwb3J0RG9pLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGV4cG9ydERvaXM7XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcbmltcG9ydCB7IERPSV9GRVRDSF9ST1VURSwgRE9JX0NPTkZJUk1BVElPTl9ST1VURSwgQVBJX1BBVEgsIFZFUlNJT04gfSBmcm9tICcuLi8uLi8uLi8uLi9zZXJ2ZXIvYXBpL3Jlc3QvcmVzdC5qcyc7XG5pbXBvcnQgeyBnZXRVcmwgfSBmcm9tICcuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9kYXBwLWNvbmZpZ3VyYXRpb24uanMnO1xuaW1wb3J0IHsgQ09ORklSTV9DTElFTlQsIENPTkZJUk1fQUREUkVTUyB9IGZyb20gJy4uLy4uLy4uL3N0YXJ0dXAvc2VydmVyL2RvaWNoYWluLWNvbmZpZ3VyYXRpb24uanMnO1xuaW1wb3J0IHsgZ2V0SHR0cEdFVCB9IGZyb20gJy4uLy4uLy4uLy4uL3NlcnZlci9hcGkvaHR0cC5qcyc7XG5pbXBvcnQgeyBzaWduTWVzc2FnZSB9IGZyb20gJy4uLy4uLy4uLy4uL3NlcnZlci9hcGkvZG9pY2hhaW4uanMnO1xuaW1wb3J0IHsgT3B0SW5zIH0gZnJvbSAnLi4vLi4vLi4vLi4vaW1wb3J0cy9hcGkvb3B0LWlucy9vcHQtaW5zLmpzJztcbmltcG9ydCBwYXJzZVRlbXBsYXRlIGZyb20gJy4uL2VtYWlscy9wYXJzZV90ZW1wbGF0ZS5qcyc7XG5pbXBvcnQgZ2VuZXJhdGVEb2lUb2tlbiBmcm9tICcuLi9vcHQtaW5zL2dlbmVyYXRlX2RvaS10b2tlbi5qcyc7XG5pbXBvcnQgZ2VuZXJhdGVEb2lIYXNoIGZyb20gJy4uL2VtYWlscy9nZW5lcmF0ZV9kb2ktaGFzaC5qcyc7XG5pbXBvcnQgYWRkT3B0SW4gZnJvbSAnLi4vb3B0LWlucy9hZGQuanMnO1xuaW1wb3J0IGFkZFNlbmRNYWlsSm9iIGZyb20gJy4uL2pvYnMvYWRkX3NlbmRfbWFpbC5qcyc7XG5pbXBvcnQge2xvZ0NvbmZpcm0sIGxvZ0Vycm9yfSBmcm9tIFwiLi4vLi4vLi4vc3RhcnR1cC9zZXJ2ZXIvbG9nLWNvbmZpZ3VyYXRpb25cIjtcblxuY29uc3QgRmV0Y2hEb2lNYWlsRGF0YVNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICBuYW1lOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH0sXG4gIGRvbWFpbjoge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9XG59KTtcblxuXG5jb25zdCBmZXRjaERvaU1haWxEYXRhID0gKGRhdGEpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBvdXJEYXRhID0gZGF0YTtcbiAgICBGZXRjaERvaU1haWxEYXRhU2NoZW1hLnZhbGlkYXRlKG91ckRhdGEpO1xuICAgIGNvbnN0IHVybCA9IG91ckRhdGEuZG9tYWluK0FQSV9QQVRIK1ZFUlNJT04rXCIvXCIrRE9JX0ZFVENIX1JPVVRFO1xuICAgIGNvbnN0IHNpZ25hdHVyZSA9IHNpZ25NZXNzYWdlKENPTkZJUk1fQ0xJRU5ULCBDT05GSVJNX0FERFJFU1MsIG91ckRhdGEubmFtZSk7XG4gICAgY29uc3QgcXVlcnkgPSBcIm5hbWVfaWQ9XCIrZW5jb2RlVVJJQ29tcG9uZW50KG91ckRhdGEubmFtZSkrXCImc2lnbmF0dXJlPVwiK2VuY29kZVVSSUNvbXBvbmVudChzaWduYXR1cmUpO1xuICAgIGxvZ0NvbmZpcm0oJ2NhbGxpbmcgZm9yIGRvaS1lbWFpbC10ZW1wbGF0ZTonK3VybCsnIHF1ZXJ5OicsIHF1ZXJ5KTtcblxuICAgIC8qKlxuICAgICAgVE9ETyB3aGVuIHJ1bm5pbmcgU2VuZC1kQXBwIGluIFRlc3RuZXQgYmVoaW5kIE5BVCB0aGlzIFVSTCB3aWxsIG5vdCBiZSBhY2Nlc3NpYmxlIGZyb20gdGhlIGludGVybmV0XG4gICAgICBidXQgZXZlbiB3aGVuIHdlIHVzZSB0aGUgVVJMIGZyb20gbG9jYWxob3N0IHZlcmlmeSBhbmRuIG90aGVycyB3aWxsIGZhaWxzLlxuICAgICAqL1xuICAgIGNvbnN0IHJlc3BvbnNlID0gZ2V0SHR0cEdFVCh1cmwsIHF1ZXJ5KTtcbiAgICBpZihyZXNwb25zZSA9PT0gdW5kZWZpbmVkIHx8IHJlc3BvbnNlLmRhdGEgPT09IHVuZGVmaW5lZCkgdGhyb3cgXCJCYWQgcmVzcG9uc2VcIjtcbiAgICBjb25zdCByZXNwb25zZURhdGEgPSByZXNwb25zZS5kYXRhO1xuICAgIGxvZ0NvbmZpcm0oJ3Jlc3BvbnNlIHdoaWxlIGdldHRpbmcgZ2V0dGluZyBlbWFpbCB0ZW1wbGF0ZSBmcm9tIFVSTDonLHJlc3BvbnNlLmRhdGEuc3RhdHVzKTtcblxuICAgIGlmKHJlc3BvbnNlRGF0YS5zdGF0dXMgIT09IFwic3VjY2Vzc1wiKSB7XG4gICAgICBpZihyZXNwb25zZURhdGEuZXJyb3IgPT09IHVuZGVmaW5lZCkgdGhyb3cgXCJCYWQgcmVzcG9uc2VcIjtcbiAgICAgIGlmKHJlc3BvbnNlRGF0YS5lcnJvci5pbmNsdWRlcyhcIk9wdC1JbiBub3QgZm91bmRcIikpIHtcbiAgICAgICAgLy9EbyBub3RoaW5nIGFuZCBkb24ndCB0aHJvdyBlcnJvciBzbyBqb2IgaXMgZG9uZVxuICAgICAgICAgIGxvZ0Vycm9yKCdyZXNwb25zZSBkYXRhIGZyb20gU2VuZC1kQXBwOicscmVzcG9uc2VEYXRhLmVycm9yKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdGhyb3cgcmVzcG9uc2VEYXRhLmVycm9yO1xuICAgIH1cbiAgICBsb2dDb25maXJtKCdET0kgTWFpbCBkYXRhIGZldGNoZWQuJyk7XG5cbiAgICBjb25zdCBvcHRJbklkID0gYWRkT3B0SW4oe25hbWU6IG91ckRhdGEubmFtZX0pO1xuICAgIGNvbnN0IG9wdEluID0gT3B0SW5zLmZpbmRPbmUoe19pZDogb3B0SW5JZH0pO1xuICAgIGxvZ0NvbmZpcm0oJ29wdC1pbiBmb3VuZDonLG9wdEluKTtcbiAgICBpZihvcHRJbi5jb25maXJtYXRpb25Ub2tlbiAhPT0gdW5kZWZpbmVkKSByZXR1cm47XG5cbiAgICBjb25zdCB0b2tlbiA9IGdlbmVyYXRlRG9pVG9rZW4oe2lkOiBvcHRJbi5faWR9KTtcbiAgICBsb2dDb25maXJtKCdnZW5lcmF0ZWQgY29uZmlybWF0aW9uVG9rZW46Jyx0b2tlbik7XG4gICAgY29uc3QgY29uZmlybWF0aW9uSGFzaCA9IGdlbmVyYXRlRG9pSGFzaCh7aWQ6IG9wdEluLl9pZCwgdG9rZW46IHRva2VuLCByZWRpcmVjdDogcmVzcG9uc2VEYXRhLmRhdGEucmVkaXJlY3R9KTtcbiAgICBsb2dDb25maXJtKCdnZW5lcmF0ZWQgY29uZmlybWF0aW9uSGFzaDonLGNvbmZpcm1hdGlvbkhhc2gpO1xuICAgIGNvbnN0IGNvbmZpcm1hdGlvblVybCA9IGdldFVybCgpK0FQSV9QQVRIK1ZFUlNJT04rXCIvXCIrRE9JX0NPTkZJUk1BVElPTl9ST1VURStcIi9cIitlbmNvZGVVUklDb21wb25lbnQoY29uZmlybWF0aW9uSGFzaCk7XG4gICAgbG9nQ29uZmlybSgnY29uZmlybWF0aW9uVXJsOicrY29uZmlybWF0aW9uVXJsKTtcblxuICAgIGNvbnN0IHRlbXBsYXRlID0gcGFyc2VUZW1wbGF0ZSh7dGVtcGxhdGU6IHJlc3BvbnNlRGF0YS5kYXRhLmNvbnRlbnQsIGRhdGE6IHtcbiAgICAgIGNvbmZpcm1hdGlvbl91cmw6IGNvbmZpcm1hdGlvblVybFxuICAgIH19KTtcblxuICAgIC8vbG9nQ29uZmlybSgnd2UgYXJlIHVzaW5nIHRoaXMgdGVtcGxhdGU6Jyx0ZW1wbGF0ZSk7XG5cbiAgICBsb2dDb25maXJtKCdzZW5kaW5nIGVtYWlsIHRvIHBldGVyIGZvciBjb25maXJtYXRpb24gb3ZlciBib2JzIGRBcHAnKTtcbiAgICBhZGRTZW5kTWFpbEpvYih7XG4gICAgICB0bzogcmVzcG9uc2VEYXRhLmRhdGEucmVjaXBpZW50LFxuICAgICAgc3ViamVjdDogcmVzcG9uc2VEYXRhLmRhdGEuc3ViamVjdCxcbiAgICAgIG1lc3NhZ2U6IHRlbXBsYXRlLFxuICAgICAgcmV0dXJuUGF0aDogcmVzcG9uc2VEYXRhLmRhdGEucmV0dXJuUGF0aFxuICAgIH0pO1xuICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdkYXBwcy5mZXRjaERvaU1haWxEYXRhLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGZldGNoRG9pTWFpbERhdGE7XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcbmltcG9ydCB7IE9wdElucyB9IGZyb20gJy4uLy4uLy4uL2FwaS9vcHQtaW5zL29wdC1pbnMuanMnO1xuaW1wb3J0IHsgUmVjaXBpZW50cyB9IGZyb20gJy4uLy4uLy4uL2FwaS9yZWNpcGllbnRzL3JlY2lwaWVudHMuanMnO1xuaW1wb3J0IGdldE9wdEluUHJvdmlkZXIgZnJvbSAnLi4vZG5zL2dldF9vcHQtaW4tcHJvdmlkZXIuanMnO1xuaW1wb3J0IGdldE9wdEluS2V5IGZyb20gJy4uL2Rucy9nZXRfb3B0LWluLWtleS5qcyc7XG5pbXBvcnQgdmVyaWZ5U2lnbmF0dXJlIGZyb20gJy4uL2RvaWNoYWluL3ZlcmlmeV9zaWduYXR1cmUuanMnO1xuaW1wb3J0IHsgZ2V0SHR0cEdFVCB9IGZyb20gJy4uLy4uLy4uLy4uL3NlcnZlci9hcGkvaHR0cC5qcyc7XG5pbXBvcnQgeyBET0lfTUFJTF9GRVRDSF9VUkwgfSBmcm9tICcuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9lbWFpbC1jb25maWd1cmF0aW9uLmpzJztcbmltcG9ydCB7IGxvZ1NlbmQgfSBmcm9tIFwiLi4vLi4vLi4vc3RhcnR1cC9zZXJ2ZXIvbG9nLWNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IEFjY291bnRzIH0gZnJvbSAnbWV0ZW9yL2FjY291bnRzLWJhc2UnXG5cbmNvbnN0IEdldERvaU1haWxEYXRhU2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIG5hbWVfaWQ6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfSxcbiAgc2lnbmF0dXJlOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH1cbn0pO1xuXG5jb25zdCB1c2VyUHJvZmlsZVNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICBzdWJqZWN0OiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIG9wdGlvbmFsOnRydWVcbiAgfSxcbiAgcmVkaXJlY3Q6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgcmVnRXg6IFwiQChodHRwcz98ZnRwKTovLygtXFxcXC4pPyhbXlxcXFxzLz9cXFxcLiMtXStcXFxcLj8pKygvW15cXFxcc10qKT8kQFwiLFxuICAgIG9wdGlvbmFsOnRydWVcbiAgfSxcbiAgcmV0dXJuUGF0aDoge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICByZWdFeDogU2ltcGxlU2NoZW1hLlJlZ0V4LkVtYWlsLFxuICAgIG9wdGlvbmFsOnRydWVcbiAgfSxcbiAgdGVtcGxhdGVVUkw6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgcmVnRXg6IFwiQChodHRwcz98ZnRwKTovLygtXFxcXC4pPyhbXlxcXFxzLz9cXFxcLiMtXStcXFxcLj8pKygvW15cXFxcc10qKT8kQFwiLFxuICAgIG9wdGlvbmFsOnRydWVcbiAgfVxufSk7XG5cbmNvbnN0IGdldERvaU1haWxEYXRhID0gKGRhdGEpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBvdXJEYXRhID0gZGF0YTtcbiAgICBHZXREb2lNYWlsRGF0YVNjaGVtYS52YWxpZGF0ZShvdXJEYXRhKTtcbiAgICBjb25zdCBvcHRJbiA9IE9wdElucy5maW5kT25lKHtuYW1lSWQ6IG91ckRhdGEubmFtZV9pZH0pO1xuICAgIGlmKG9wdEluID09PSB1bmRlZmluZWQpIHRocm93IFwiT3B0LUluIHdpdGggbmFtZV9pZDogXCIrb3VyRGF0YS5uYW1lX2lkK1wiIG5vdCBmb3VuZFwiO1xuICAgIGxvZ1NlbmQoJ09wdC1JbiBmb3VuZCcsb3B0SW4pO1xuXG4gICAgY29uc3QgcmVjaXBpZW50ID0gUmVjaXBpZW50cy5maW5kT25lKHtfaWQ6IG9wdEluLnJlY2lwaWVudH0pO1xuICAgIGlmKHJlY2lwaWVudCA9PT0gdW5kZWZpbmVkKSB0aHJvdyBcIlJlY2lwaWVudCBub3QgZm91bmRcIjtcbiAgICBsb2dTZW5kKCdSZWNpcGllbnQgZm91bmQnLCByZWNpcGllbnQpO1xuXG4gICAgY29uc3QgcGFydHMgPSByZWNpcGllbnQuZW1haWwuc3BsaXQoXCJAXCIpO1xuICAgIGNvbnN0IGRvbWFpbiA9IHBhcnRzW3BhcnRzLmxlbmd0aC0xXTtcblxuICAgIGxldCBwdWJsaWNLZXkgPSBnZXRPcHRJbktleSh7IGRvbWFpbjogZG9tYWlufSk7XG5cbiAgICBpZighcHVibGljS2V5KXtcbiAgICAgIGNvbnN0IHByb3ZpZGVyID0gZ2V0T3B0SW5Qcm92aWRlcih7ZG9tYWluOiBvdXJEYXRhLmRvbWFpbiB9KTtcbiAgICAgIGxvZ1NlbmQoXCJ1c2luZyBkb2ljaGFpbiBwcm92aWRlciBpbnN0ZWFkIG9mIGRpcmVjdGx5IGNvbmZpZ3VyZWQgcHVibGljS2V5OlwiLCB7IHByb3ZpZGVyOiBwcm92aWRlciB9KTtcbiAgICAgIHB1YmxpY0tleSA9IGdldE9wdEluS2V5KHsgZG9tYWluOiBwcm92aWRlcn0pOyAvL2dldCBwdWJsaWMga2V5IGZyb20gcHJvdmlkZXIgb3IgZmFsbGJhY2sgaWYgcHVibGlja2V5IHdhcyBub3Qgc2V0IGluIGRuc1xuICAgIH1cblxuICAgIGxvZ1NlbmQoJ3F1ZXJpZWQgZGF0YTogKHBhcnRzLCBkb21haW4sIHByb3ZpZGVyLCBwdWJsaWNLZXkpJywgJygnK3BhcnRzKycsJytkb21haW4rJywnK3B1YmxpY0tleSsnKScpO1xuXG4gICAgLy9UT0RPOiBPbmx5IGFsbG93IGFjY2VzcyBvbmUgdGltZVxuICAgIC8vIFBvc3NpYmxlIHNvbHV0aW9uOlxuICAgIC8vIDEuIFByb3ZpZGVyIChjb25maXJtIGRBcHApIHJlcXVlc3QgdGhlIGRhdGFcbiAgICAvLyAyLiBQcm92aWRlciByZWNlaXZlIHRoZSBkYXRhXG4gICAgLy8gMy4gUHJvdmlkZXIgc2VuZHMgY29uZmlybWF0aW9uIFwiSSBnb3QgdGhlIGRhdGFcIlxuICAgIC8vIDQuIFNlbmQgZEFwcCBsb2NrIHRoZSBkYXRhIGZvciB0aGlzIG9wdCBpblxuICAgIGxvZ1NlbmQoJ3ZlcmlmeWluZyBzaWduYXR1cmUuLi4nKTtcbiAgICBpZighdmVyaWZ5U2lnbmF0dXJlKHtwdWJsaWNLZXk6IHB1YmxpY0tleSwgZGF0YTogb3VyRGF0YS5uYW1lX2lkLCBzaWduYXR1cmU6IG91ckRhdGEuc2lnbmF0dXJlfSkpIHtcbiAgICAgIHRocm93IFwic2lnbmF0dXJlIGluY29ycmVjdCAtIGFjY2VzcyBkZW5pZWRcIjtcbiAgICB9XG4gICAgXG4gICAgbG9nU2VuZCgnc2lnbmF0dXJlIHZlcmlmaWVkJyk7XG5cbiAgICAvL1RPRE86IFF1ZXJ5IGZvciBsYW5ndWFnZVxuICAgIGxldCBkb2lNYWlsRGF0YTtcbiAgICB0cnkge1xuXG4gICAgICBkb2lNYWlsRGF0YSA9IGdldEh0dHBHRVQoRE9JX01BSUxfRkVUQ0hfVVJMLCBcIlwiKS5kYXRhO1xuICAgICAgbGV0IGRlZmF1bHRSZXR1cm5EYXRhID0ge1xuICAgICAgICBcInJlY2lwaWVudFwiOiByZWNpcGllbnQuZW1haWwsXG4gICAgICAgIFwiY29udGVudFwiOiBkb2lNYWlsRGF0YS5kYXRhLmNvbnRlbnQsXG4gICAgICAgIFwicmVkaXJlY3RcIjogZG9pTWFpbERhdGEuZGF0YS5yZWRpcmVjdCxcbiAgICAgICAgXCJzdWJqZWN0XCI6IGRvaU1haWxEYXRhLmRhdGEuc3ViamVjdCxcbiAgICAgICAgXCJyZXR1cm5QYXRoXCI6IGRvaU1haWxEYXRhLmRhdGEucmV0dXJuUGF0aFxuICAgICAgfVxuXG4gICAgbGV0IHJldHVybkRhdGEgPSBkZWZhdWx0UmV0dXJuRGF0YTtcblxuICAgIHRyeXtcbiAgICAgIGxldCBvd25lciA9IEFjY291bnRzLnVzZXJzLmZpbmRPbmUoe19pZDogb3B0SW4ub3duZXJJZH0pO1xuICAgICAgbGV0IG1haWxUZW1wbGF0ZSA9IG93bmVyLnByb2ZpbGUubWFpbFRlbXBsYXRlO1xuICAgICAgdXNlclByb2ZpbGVTY2hlbWEudmFsaWRhdGUobWFpbFRlbXBsYXRlKTtcblxuICAgICAgcmV0dXJuRGF0YVtcInJlZGlyZWN0XCJdID0gbWFpbFRlbXBsYXRlW1wicmVkaXJlY3RcIl0gfHwgZGVmYXVsdFJldHVybkRhdGFbXCJyZWRpcmVjdFwiXTtcbiAgICAgIHJldHVybkRhdGFbXCJzdWJqZWN0XCJdID0gbWFpbFRlbXBsYXRlW1wic3ViamVjdFwiXSB8fCBkZWZhdWx0UmV0dXJuRGF0YVtcInN1YmplY3RcIl07XG4gICAgICByZXR1cm5EYXRhW1wicmV0dXJuUGF0aFwiXSA9IG1haWxUZW1wbGF0ZVtcInJldHVyblBhdGhcIl0gfHwgZGVmYXVsdFJldHVybkRhdGFbXCJyZXR1cm5QYXRoXCJdO1xuICAgICAgcmV0dXJuRGF0YVtcImNvbnRlbnRcIl0gPSBtYWlsVGVtcGxhdGVbXCJ0ZW1wbGF0ZVVSTFwiXSA/IChnZXRIdHRwR0VUKG1haWxUZW1wbGF0ZVtcInRlbXBsYXRlVVJMXCJdLCBcIlwiKS5jb250ZW50IHx8IGRlZmF1bHRSZXR1cm5EYXRhW1wiY29udGVudFwiXSkgOiBkZWZhdWx0UmV0dXJuRGF0YVtcImNvbnRlbnRcIl07XG4gICAgICBcbiAgICB9XG4gICAgY2F0Y2goZXJyb3IpIHtcbiAgICAgIHJldHVybkRhdGE9ZGVmYXVsdFJldHVybkRhdGE7XG4gICAgfVxuXG4gICAgICBsb2dTZW5kKCdkb2lNYWlsRGF0YSBhbmQgdXJsOicsIERPSV9NQUlMX0ZFVENIX1VSTCwgcmV0dXJuRGF0YSk7XG5cbiAgICAgIHJldHVybiByZXR1cm5EYXRhXG5cbiAgICB9IGNhdGNoKGVycm9yKSB7XG4gICAgICB0aHJvdyBcIkVycm9yIHdoaWxlIGZldGNoaW5nIG1haWwgY29udGVudDogXCIrZXJyb3I7XG4gICAgfVxuXG4gIH0gY2F0Y2goZXhjZXB0aW9uKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZGFwcHMuZ2V0RG9pTWFpbERhdGEuZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgZ2V0RG9pTWFpbERhdGE7XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcbmltcG9ydCB7IHJlc29sdmVUeHQgfSBmcm9tICcuLi8uLi8uLi8uLi9zZXJ2ZXIvYXBpL2Rucy5qcyc7XG5pbXBvcnQgeyBGQUxMQkFDS19QUk9WSURFUiB9IGZyb20gJy4uLy4uLy4uL3N0YXJ0dXAvc2VydmVyL2Rucy1jb25maWd1cmF0aW9uLmpzJztcbmltcG9ydCB7aXNSZWd0ZXN0LCBpc1Rlc3RuZXR9IGZyb20gXCIuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9kYXBwLWNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7bG9nU2VuZH0gZnJvbSBcIi4uLy4uLy4uL3N0YXJ0dXAvc2VydmVyL2xvZy1jb25maWd1cmF0aW9uXCI7XG5cbmNvbnN0IE9QVF9JTl9LRVkgPSBcImRvaWNoYWluLW9wdC1pbi1rZXlcIjtcbmNvbnN0IE9QVF9JTl9LRVlfVEVTVE5FVCA9IFwiZG9pY2hhaW4tdGVzdG5ldC1vcHQtaW4ta2V5XCI7XG5cbmNvbnN0IEdldE9wdEluS2V5U2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIGRvbWFpbjoge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9XG59KTtcblxuXG5jb25zdCBnZXRPcHRJbktleSA9IChkYXRhKSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3Qgb3VyRGF0YSA9IGRhdGE7XG4gICAgR2V0T3B0SW5LZXlTY2hlbWEudmFsaWRhdGUob3VyRGF0YSk7XG5cbiAgICBsZXQgb3VyT1BUX0lOX0tFWT1PUFRfSU5fS0VZO1xuXG4gICAgaWYoaXNSZWd0ZXN0KCkgfHwgaXNUZXN0bmV0KCkpe1xuICAgICAgICBvdXJPUFRfSU5fS0VZID0gT1BUX0lOX0tFWV9URVNUTkVUO1xuICAgICAgICBsb2dTZW5kKCdVc2luZyBSZWdUZXN0OicraXNSZWd0ZXN0KCkrXCIgVGVzdG5ldDogXCIraXNUZXN0bmV0KCkrXCIgb3VyT1BUX0lOX0tFWVwiLG91ck9QVF9JTl9LRVkpO1xuICAgIH1cbiAgICBjb25zdCBrZXkgPSByZXNvbHZlVHh0KG91ck9QVF9JTl9LRVksIG91ckRhdGEuZG9tYWluKTtcbiAgICBsb2dTZW5kKCdETlMgVFhUIGNvbmZpZ3VyZWQgcHVibGljIGtleSBvZiByZWNpcGllbnQgZW1haWwgZG9tYWluIGFuZCBjb25maXJtYXRpb24gZGFwcCcse2ZvdW5kS2V5OmtleSwgZG9tYWluOm91ckRhdGEuZG9tYWluLCBkbnNrZXk6b3VyT1BUX0lOX0tFWX0pO1xuXG4gICAgaWYoa2V5ID09PSB1bmRlZmluZWQpIHJldHVybiB1c2VGYWxsYmFjayhvdXJEYXRhLmRvbWFpbik7XG4gICAgcmV0dXJuIGtleTtcbiAgfSBjYXRjaCAoZXhjZXB0aW9uKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZG5zLmdldE9wdEluS2V5LmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH1cbn07XG5cbmNvbnN0IHVzZUZhbGxiYWNrID0gKGRvbWFpbikgPT4ge1xuICBpZihkb21haW4gPT09IEZBTExCQUNLX1BST1ZJREVSKSB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFwiRmFsbGJhY2sgaGFzIG5vIGtleSBkZWZpbmVkIVwiKTtcbiAgICBsb2dTZW5kKFwiS2V5IG5vdCBkZWZpbmVkLiBVc2luZyBmYWxsYmFjazogXCIsRkFMTEJBQ0tfUFJPVklERVIpO1xuICByZXR1cm4gZ2V0T3B0SW5LZXkoe2RvbWFpbjogRkFMTEJBQ0tfUFJPVklERVJ9KTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGdldE9wdEluS2V5O1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XG5pbXBvcnQgeyByZXNvbHZlVHh0IH0gZnJvbSAnLi4vLi4vLi4vLi4vc2VydmVyL2FwaS9kbnMuanMnO1xuaW1wb3J0IHsgRkFMTEJBQ0tfUFJPVklERVIgfSBmcm9tICcuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9kbnMtY29uZmlndXJhdGlvbi5qcyc7XG5pbXBvcnQge2xvZ1NlbmR9IGZyb20gXCIuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9sb2ctY29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHtpc1JlZ3Rlc3QsIGlzVGVzdG5ldH0gZnJvbSBcIi4uLy4uLy4uL3N0YXJ0dXAvc2VydmVyL2RhcHAtY29uZmlndXJhdGlvblwiO1xuXG5jb25zdCBQUk9WSURFUl9LRVkgPSBcImRvaWNoYWluLW9wdC1pbi1wcm92aWRlclwiO1xuY29uc3QgUFJPVklERVJfS0VZX1RFU1RORVQgPSBcImRvaWNoYWluLXRlc3RuZXQtb3B0LWluLXByb3ZpZGVyXCI7XG5cbmNvbnN0IEdldE9wdEluUHJvdmlkZXJTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgZG9tYWluOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH1cbn0pO1xuXG5cbmNvbnN0IGdldE9wdEluUHJvdmlkZXIgPSAoZGF0YSkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IG91ckRhdGEgPSBkYXRhO1xuICAgIEdldE9wdEluUHJvdmlkZXJTY2hlbWEudmFsaWRhdGUob3VyRGF0YSk7XG5cbiAgICBsZXQgb3VyUFJPVklERVJfS0VZPVBST1ZJREVSX0tFWTtcbiAgICBpZihpc1JlZ3Rlc3QoKSB8fCBpc1Rlc3RuZXQoKSl7XG4gICAgICAgIG91clBST1ZJREVSX0tFWSA9IFBST1ZJREVSX0tFWV9URVNUTkVUO1xuICAgICAgICBsb2dTZW5kKCdVc2luZyBSZWdUZXN0OicraXNSZWd0ZXN0KCkrXCIgOiBUZXN0bmV0OlwiK2lzVGVzdG5ldCgpK1wiIFBST1ZJREVSX0tFWVwiLHtwcm92aWRlcktleTpvdXJQUk9WSURFUl9LRVksIGRvbWFpbjpvdXJEYXRhLmRvbWFpbn0pO1xuICAgIH1cblxuICAgIGNvbnN0IHByb3ZpZGVyID0gcmVzb2x2ZVR4dChvdXJQUk9WSURFUl9LRVksIG91ckRhdGEuZG9tYWluKTtcbiAgICBpZihwcm92aWRlciA9PT0gdW5kZWZpbmVkKSByZXR1cm4gdXNlRmFsbGJhY2soKTtcblxuICAgIGxvZ1NlbmQoJ29wdC1pbi1wcm92aWRlciBmcm9tIGRucyAtIHNlcnZlciBvZiBtYWlsIHJlY2lwaWVudDogKFRYVCk6Jyxwcm92aWRlcik7XG4gICAgcmV0dXJuIHByb3ZpZGVyO1xuICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdkbnMuZ2V0T3B0SW5Qcm92aWRlci5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9XG59O1xuXG5jb25zdCB1c2VGYWxsYmFjayA9ICgpID0+IHtcbiAgbG9nU2VuZCgnUHJvdmlkZXIgbm90IGRlZmluZWQuIEZhbGxiYWNrICcrRkFMTEJBQ0tfUFJPVklERVIrJyBpcyB1c2VkJyk7XG4gIHJldHVybiBGQUxMQkFDS19QUk9WSURFUjtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGdldE9wdEluUHJvdmlkZXI7XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcbmltcG9ydCB7IENPTkZJUk1fQ0xJRU5ULCBDT05GSVJNX0FERFJFU1MgfSBmcm9tICcuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9kb2ljaGFpbi1jb25maWd1cmF0aW9uLmpzJztcbmltcG9ydCB7IGdldFdpZiB9IGZyb20gJy4uLy4uLy4uLy4uL3NlcnZlci9hcGkvZG9pY2hhaW4uanMnO1xuaW1wb3J0IHsgRG9pY2hhaW5FbnRyaWVzIH0gZnJvbSAnLi4vLi4vLi4vYXBpL2RvaWNoYWluL2VudHJpZXMuanMnO1xuaW1wb3J0IGFkZEZldGNoRG9pTWFpbERhdGFKb2IgZnJvbSAnLi4vam9icy9hZGRfZmV0Y2gtZG9pLW1haWwtZGF0YS5qcyc7XG5pbXBvcnQgZ2V0UHJpdmF0ZUtleUZyb21XaWYgZnJvbSAnLi9nZXRfcHJpdmF0ZS1rZXlfZnJvbV93aWYuanMnO1xuaW1wb3J0IGRlY3J5cHRNZXNzYWdlIGZyb20gJy4vZGVjcnlwdF9tZXNzYWdlLmpzJztcbmltcG9ydCB7bG9nQ29uZmlybSwgbG9nU2VuZH0gZnJvbSBcIi4uLy4uLy4uL3N0YXJ0dXAvc2VydmVyL2xvZy1jb25maWd1cmF0aW9uXCI7XG5cbmNvbnN0IEFkZERvaWNoYWluRW50cnlTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgbmFtZToge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9LFxuICB2YWx1ZToge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9LFxuICBhZGRyZXNzOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH0sXG4gIHR4SWQ6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfVxufSk7XG5cbi8qKlxuICogSW5zZXJ0c1xuICpcbiAqIEBwYXJhbSBlbnRyeVxuICogQHJldHVybnMgeyp9XG4gKi9cbmNvbnN0IGFkZERvaWNoYWluRW50cnkgPSAoZW50cnkpID0+IHtcbiAgdHJ5IHtcblxuICAgIGNvbnN0IG91ckVudHJ5ID0gZW50cnk7XG4gICAgbG9nQ29uZmlybSgnYWRkaW5nIERvaWNoYWluRW50cnkgb24gQm9iLi4uJyxvdXJFbnRyeS5uYW1lKTtcbiAgICBBZGREb2ljaGFpbkVudHJ5U2NoZW1hLnZhbGlkYXRlKG91ckVudHJ5KTtcblxuICAgIGNvbnN0IGV0eSA9IERvaWNoYWluRW50cmllcy5maW5kT25lKHtuYW1lOiBvdXJFbnRyeS5uYW1lfSk7XG4gICAgaWYoZXR5ICE9PSB1bmRlZmluZWQpe1xuICAgICAgICBsb2dTZW5kKCdyZXR1cm5pbmcgbG9jYWxseSBzYXZlZCBlbnRyeSB3aXRoIF9pZDonK2V0eS5faWQpO1xuICAgICAgICByZXR1cm4gZXR5Ll9pZDtcbiAgICB9XG5cbiAgICBjb25zdCB2YWx1ZSA9IEpTT04ucGFyc2Uob3VyRW50cnkudmFsdWUpO1xuICAgIC8vbG9nU2VuZChcInZhbHVlOlwiLHZhbHVlKTtcbiAgICBpZih2YWx1ZS5mcm9tID09PSB1bmRlZmluZWQpIHRocm93IFwiV3JvbmcgYmxvY2tjaGFpbiBlbnRyeVwiOyAvL1RPRE8gaWYgZnJvbSBpcyBtaXNzaW5nIGJ1dCB2YWx1ZSBpcyB0aGVyZSwgaXQgaXMgcHJvYmFibHkgYWxscmVhZHkgaGFuZGVsZWQgY29ycmVjdGx5IGFueXdheXMgdGhpcyBpcyBub3Qgc28gY29vbCBhcyBpdCBzZWVtcy5cbiAgICBjb25zdCB3aWYgPSBnZXRXaWYoQ09ORklSTV9DTElFTlQsIENPTkZJUk1fQUREUkVTUyk7XG4gICAgY29uc3QgcHJpdmF0ZUtleSA9IGdldFByaXZhdGVLZXlGcm9tV2lmKHt3aWY6IHdpZn0pO1xuICAgIGxvZ1NlbmQoJ2dvdCBwcml2YXRlIGtleSAod2lsbCBub3Qgc2hvdyBpdCBoZXJlKScpO1xuXG4gICAgY29uc3QgZG9tYWluID0gZGVjcnlwdE1lc3NhZ2Uoe3ByaXZhdGVLZXk6IHByaXZhdGVLZXksIG1lc3NhZ2U6IHZhbHVlLmZyb219KTtcbiAgICBsb2dTZW5kKCdkZWNyeXB0ZWQgbWVzc2FnZSBmcm9tIGRvbWFpbjogJyxkb21haW4pO1xuXG4gICAgY29uc3QgbmFtZVBvcyA9IG91ckVudHJ5Lm5hbWUuaW5kZXhPZignLScpOyAvL2lmIHRoaXMgaXMgbm90IGEgY28tcmVnaXN0cmF0aW9uIGZldGNoIG1haWwuXG4gICAgbG9nU2VuZCgnbmFtZVBvczonLG5hbWVQb3MpO1xuICAgIGNvbnN0IG1hc3RlckRvaSA9IChuYW1lUG9zIT0tMSk/b3VyRW50cnkubmFtZS5zdWJzdHJpbmcoMCxuYW1lUG9zKTp1bmRlZmluZWQ7XG4gICAgbG9nU2VuZCgnbWFzdGVyRG9pOicsbWFzdGVyRG9pKTtcbiAgICBjb25zdCBpbmRleCA9IG1hc3RlckRvaT9vdXJFbnRyeS5uYW1lLnN1YnN0cmluZyhuYW1lUG9zKzEpOnVuZGVmaW5lZDtcbiAgICBsb2dTZW5kKCdpbmRleDonLGluZGV4KTtcblxuICAgIGNvbnN0IGlkID0gRG9pY2hhaW5FbnRyaWVzLmluc2VydCh7XG4gICAgICAgIG5hbWU6IG91ckVudHJ5Lm5hbWUsXG4gICAgICAgIHZhbHVlOiBvdXJFbnRyeS52YWx1ZSxcbiAgICAgICAgYWRkcmVzczogb3VyRW50cnkuYWRkcmVzcyxcbiAgICAgICAgbWFzdGVyRG9pOiBtYXN0ZXJEb2ksXG4gICAgICAgIGluZGV4OiBpbmRleCxcbiAgICAgICAgdHhJZDogb3VyRW50cnkudHhJZCxcbiAgICAgICAgZXhwaXJlc0luOiBvdXJFbnRyeS5leHBpcmVzSW4sXG4gICAgICAgIGV4cGlyZWQ6IG91ckVudHJ5LmV4cGlyZWRcbiAgICB9KTtcblxuICAgIGxvZ1NlbmQoJ0RvaWNoYWluRW50cnkgYWRkZWQgb24gQm9iOicsIHtpZDppZCxuYW1lOm91ckVudHJ5Lm5hbWUsbWFzdGVyRG9pOm1hc3RlckRvaSxpbmRleDppbmRleH0pO1xuXG4gICAgaWYoIW1hc3RlckRvaSl7XG4gICAgICAgIGFkZEZldGNoRG9pTWFpbERhdGFKb2Ioe1xuICAgICAgICAgICAgbmFtZTogb3VyRW50cnkubmFtZSxcbiAgICAgICAgICAgIGRvbWFpbjogZG9tYWluXG4gICAgICAgIH0pO1xuICAgICAgICBsb2dTZW5kKCdOZXcgZW50cnkgYWRkZWQ6IFxcbicrXG4gICAgICAgICAgICAnTmFtZUlkPScrb3VyRW50cnkubmFtZStcIlxcblwiK1xuICAgICAgICAgICAgJ0FkZHJlc3M9JytvdXJFbnRyeS5hZGRyZXNzK1wiXFxuXCIrXG4gICAgICAgICAgICAnVHhJZD0nK291ckVudHJ5LnR4SWQrXCJcXG5cIitcbiAgICAgICAgICAgICdWYWx1ZT0nK291ckVudHJ5LnZhbHVlKTtcblxuICAgIH1lbHNle1xuICAgICAgICBsb2dTZW5kKCdUaGlzIHRyYW5zYWN0aW9uIGJlbG9uZ3MgdG8gY28tcmVnaXN0cmF0aW9uJywgbWFzdGVyRG9pKTtcbiAgICB9XG5cbiAgICByZXR1cm4gaWQ7XG4gIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2RvaWNoYWluLmFkZEVudHJ5QW5kRmV0Y2hEYXRhLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGFkZERvaWNoYWluRW50cnk7XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCB7IGxpc3RTaW5jZUJsb2NrLCBuYW1lU2hvdywgZ2V0UmF3VHJhbnNhY3Rpb259IGZyb20gJy4uLy4uLy4uLy4uL3NlcnZlci9hcGkvZG9pY2hhaW4uanMnO1xuaW1wb3J0IHsgQ09ORklSTV9DTElFTlQsIENPTkZJUk1fQUREUkVTUyB9IGZyb20gJy4uLy4uLy4uL3N0YXJ0dXAvc2VydmVyL2RvaWNoYWluLWNvbmZpZ3VyYXRpb24uanMnO1xuaW1wb3J0IGFkZERvaWNoYWluRW50cnkgZnJvbSAnLi9hZGRfZW50cnlfYW5kX2ZldGNoX2RhdGEuanMnXG5pbXBvcnQgeyBNZXRhIH0gZnJvbSAnLi4vLi4vLi4vYXBpL21ldGEvbWV0YS5qcyc7XG5pbXBvcnQgYWRkT3JVcGRhdGVNZXRhIGZyb20gJy4uL21ldGEvYWRkT3JVcGRhdGUuanMnO1xuaW1wb3J0IHtsb2dDb25maXJtfSBmcm9tIFwiLi4vLi4vLi4vc3RhcnR1cC9zZXJ2ZXIvbG9nLWNvbmZpZ3VyYXRpb25cIjtcblxuY29uc3QgVFhfTkFNRV9TVEFSVCA9IFwiZS9cIjtcbmNvbnN0IExBU1RfQ0hFQ0tFRF9CTE9DS19LRVkgPSBcImxhc3RDaGVja2VkQmxvY2tcIjtcblxuY29uc3QgY2hlY2tOZXdUcmFuc2FjdGlvbiA9ICh0eGlkLCBqb2IpID0+IHtcbiAgdHJ5IHtcblxuICAgICAgaWYoIXR4aWQpe1xuICAgICAgICAgIGxvZ0NvbmZpcm0oXCJjaGVja05ld1RyYW5zYWN0aW9uIHRyaWdnZXJlZCB3aGVuIHN0YXJ0aW5nIG5vZGUgLSBjaGVja2luZyBhbGwgY29uZmlybWVkIGJsb2NrcyBzaW5jZSBsYXN0IGNoZWNrIGZvciBkb2ljaGFpbiBhZGRyZXNzXCIsQ09ORklSTV9BRERSRVNTKTtcblxuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIHZhciBsYXN0Q2hlY2tlZEJsb2NrID0gTWV0YS5maW5kT25lKHtrZXk6IExBU1RfQ0hFQ0tFRF9CTE9DS19LRVl9KTtcbiAgICAgICAgICAgICAgaWYobGFzdENoZWNrZWRCbG9jayAhPT0gdW5kZWZpbmVkKSBsYXN0Q2hlY2tlZEJsb2NrID0gbGFzdENoZWNrZWRCbG9jay52YWx1ZTtcbiAgICAgICAgICAgICAgbG9nQ29uZmlybShcImxhc3RDaGVja2VkQmxvY2tcIixsYXN0Q2hlY2tlZEJsb2NrKTtcbiAgICAgICAgICAgICAgY29uc3QgcmV0ID0gbGlzdFNpbmNlQmxvY2soQ09ORklSTV9DTElFTlQsIGxhc3RDaGVja2VkQmxvY2spO1xuICAgICAgICAgICAgICBpZihyZXQgPT09IHVuZGVmaW5lZCB8fCByZXQudHJhbnNhY3Rpb25zID09PSB1bmRlZmluZWQpIHJldHVybjtcblxuICAgICAgICAgICAgICBjb25zdCB0eHMgPSByZXQudHJhbnNhY3Rpb25zO1xuICAgICAgICAgICAgICBsYXN0Q2hlY2tlZEJsb2NrID0gcmV0Lmxhc3RibG9jaztcbiAgICAgICAgICAgICAgaWYoIXJldCB8fCAhdHhzIHx8ICF0eHMubGVuZ3RoPT09MCl7XG4gICAgICAgICAgICAgICAgICBsb2dDb25maXJtKFwidHJhbnNhY3Rpb25zIGRvIG5vdCBjb250YWluIG5hbWVPcCB0cmFuc2FjdGlvbiBkZXRhaWxzIG9yIHRyYW5zYWN0aW9uIG5vdCBmb3VuZC5cIiwgbGFzdENoZWNrZWRCbG9jayk7XG4gICAgICAgICAgICAgICAgICBhZGRPclVwZGF0ZU1ldGEoe2tleTogTEFTVF9DSEVDS0VEX0JMT0NLX0tFWSwgdmFsdWU6IGxhc3RDaGVja2VkQmxvY2t9KTtcbiAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIGxvZ0NvbmZpcm0oXCJsaXN0U2luY2VCbG9ja1wiLHJldCk7XG5cbiAgICAgICAgICAgICAgY29uc3QgYWRkcmVzc1R4cyA9IHR4cy5maWx0ZXIodHggPT5cbiAgICAgICAgICAgICAgICAgIHR4LmFkZHJlc3MgPT09IENPTkZJUk1fQUREUkVTU1xuICAgICAgICAgICAgICAgICAgJiYgdHgubmFtZSAhPT0gdW5kZWZpbmVkIC8vc2luY2UgbmFtZV9zaG93IGNhbm5vdCBiZSByZWFkIHdpdGhvdXQgY29uZmlybWF0aW9uc1xuICAgICAgICAgICAgICAgICAgJiYgdHgubmFtZS5zdGFydHNXaXRoKFwiZG9pOiBcIitUWF9OQU1FX1NUQVJUKSAgLy9oZXJlICdkb2k6IGUveHh4eCcgaXMgYWxyZWFkeSB3cml0dGVuIGluIHRoZSBibG9ja1xuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICBhZGRyZXNzVHhzLmZvckVhY2godHggPT4ge1xuICAgICAgICAgICAgICAgICAgbG9nQ29uZmlybShcInR4OlwiLHR4KTtcbiAgICAgICAgICAgICAgICAgIHZhciB0eE5hbWUgPSB0eC5uYW1lLnN1YnN0cmluZygoXCJkb2k6IFwiK1RYX05BTUVfU1RBUlQpLmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgICBsb2dDb25maXJtKFwiZXhjdXRpbmcgbmFtZV9zaG93IGluIG9yZGVyIHRvIGdldCB2YWx1ZSBvZiBuYW1lSWQ6XCIsIHR4TmFtZSk7XG4gICAgICAgICAgICAgICAgICBjb25zdCBldHkgPSBuYW1lU2hvdyhDT05GSVJNX0NMSUVOVCwgdHhOYW1lKTtcbiAgICAgICAgICAgICAgICAgIGxvZ0NvbmZpcm0oXCJuYW1lU2hvdzogdmFsdWVcIixldHkpO1xuICAgICAgICAgICAgICAgICAgaWYoIWV0eSl7XG4gICAgICAgICAgICAgICAgICAgICAgbG9nQ29uZmlybShcImNvdWxkbid0IGZpbmQgbmFtZSAtIG9idmlvdXNseSBub3QgKHlldD8hKSBjb25maXJtZWQgaW4gYmxvY2tjaGFpbjpcIiwgZXR5KTtcbiAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICBhZGRUeCh0eE5hbWUsIGV0eS52YWx1ZSx0eC5hZGRyZXNzLHR4LnR4aWQpOyAvL1RPRE8gZXR5LnZhbHVlLmZyb20gaXMgbWF5YmUgTk9UIGV4aXN0aW5nIGJlY2F1c2Ugb2YgdGhpcyBpdHMgIChtYXliZSkgb250IHdvcmtpbmcuLi5cbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIGFkZE9yVXBkYXRlTWV0YSh7a2V5OiBMQVNUX0NIRUNLRURfQkxPQ0tfS0VZLCB2YWx1ZTogbGFzdENoZWNrZWRCbG9ja30pO1xuICAgICAgICAgICAgICBsb2dDb25maXJtKFwiVHJhbnNhY3Rpb25zIHVwZGF0ZWQgLSBsYXN0Q2hlY2tlZEJsb2NrOlwiLGxhc3RDaGVja2VkQmxvY2spO1xuICAgICAgICAgICAgICBqb2IuZG9uZSgpO1xuICAgICAgICAgIH0gY2F0Y2goZXhjZXB0aW9uKSB7XG4gICAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ25hbWVjb2luLmNoZWNrTmV3VHJhbnNhY3Rpb25zLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gICAgICAgICAgfVxuXG4gICAgICB9ZWxzZXtcbiAgICAgICAgICBsb2dDb25maXJtKFwidHhpZDogXCIrdHhpZCtcIiB3YXMgdHJpZ2dlcmVkIGJ5IHdhbGxldG5vdGlmeSBmb3IgYWRkcmVzczpcIixDT05GSVJNX0FERFJFU1MpO1xuXG4gICAgICAgICAgY29uc3QgcmV0ID0gZ2V0UmF3VHJhbnNhY3Rpb24oQ09ORklSTV9DTElFTlQsIHR4aWQpO1xuICAgICAgICAgIGNvbnN0IHR4cyA9IHJldC52b3V0O1xuXG4gICAgICAgICAgaWYoIXJldCB8fCAhdHhzIHx8ICF0eHMubGVuZ3RoPT09MCl7XG4gICAgICAgICAgICAgIGxvZ0NvbmZpcm0oXCJ0eGlkIFwiK3R4aWQrJyBkb2VzIG5vdCBjb250YWluIHRyYW5zYWN0aW9uIGRldGFpbHMgb3IgdHJhbnNhY3Rpb24gbm90IGZvdW5kLicpO1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgLy8gbG9nQ29uZmlybSgnbm93IGNoZWNraW5nIHJhdyB0cmFuc2FjdGlvbnMgd2l0aCBmaWx0ZXI6Jyx0eHMpO1xuXG4gICAgICAgICAgY29uc3QgYWRkcmVzc1R4cyA9IHR4cy5maWx0ZXIodHggPT5cbiAgICAgICAgICAgICAgdHguc2NyaXB0UHViS2V5ICE9PSB1bmRlZmluZWRcbiAgICAgICAgICAgICAgJiYgdHguc2NyaXB0UHViS2V5Lm5hbWVPcCAhPT0gdW5kZWZpbmVkXG4gICAgICAgICAgICAgICYmIHR4LnNjcmlwdFB1YktleS5uYW1lT3Aub3AgPT09IFwibmFtZV9kb2lcIlxuICAgICAgICAgICAgLy8gICYmIHR4LnNjcmlwdFB1YktleS5hZGRyZXNzZXNbMF0gPT09IENPTkZJUk1fQUREUkVTUyAvL29ubHkgb3duIHRyYW5zYWN0aW9uIHNob3VsZCBhcnJpdmUgaGVyZS4gLSBzbyBjaGVjayBvbiBvd24gYWRkcmVzcyB1bm5lY2Nlc2FyeVxuICAgICAgICAgICAgICAmJiB0eC5zY3JpcHRQdWJLZXkubmFtZU9wLm5hbWUgIT09IHVuZGVmaW5lZFxuICAgICAgICAgICAgICAmJiB0eC5zY3JpcHRQdWJLZXkubmFtZU9wLm5hbWUuc3RhcnRzV2l0aChUWF9OQU1FX1NUQVJUKVxuICAgICAgICAgICk7XG5cbiAgICAgICAgICAvL2xvZ0NvbmZpcm0oXCJmb3VuZCBuYW1lX29wIHRyYW5zYWN0aW9uczpcIiwgYWRkcmVzc1R4cyk7XG4gICAgICAgICAgYWRkcmVzc1R4cy5mb3JFYWNoKHR4ID0+IHtcbiAgICAgICAgICAgICAgYWRkVHgodHguc2NyaXB0UHViS2V5Lm5hbWVPcC5uYW1lLCB0eC5zY3JpcHRQdWJLZXkubmFtZU9wLnZhbHVlLHR4LnNjcmlwdFB1YktleS5hZGRyZXNzZXNbMF0sdHhpZCk7XG4gICAgICAgICAgfSk7XG4gICAgICB9XG4gIH0gY2F0Y2goZXhjZXB0aW9uKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZG9pY2hhaW4uY2hlY2tOZXdUcmFuc2FjdGlvbnMuZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn07XG5cblxuZnVuY3Rpb24gYWRkVHgobmFtZSwgdmFsdWUsIGFkZHJlc3MsIHR4aWQpIHtcbiAgICBjb25zdCB0eE5hbWUgPSBuYW1lLnN1YnN0cmluZyhUWF9OQU1FX1NUQVJULmxlbmd0aCk7XG5cbiAgICBhZGREb2ljaGFpbkVudHJ5KHtcbiAgICAgICAgbmFtZTogdHhOYW1lLFxuICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgIGFkZHJlc3M6IGFkZHJlc3MsXG4gICAgICAgIHR4SWQ6IHR4aWRcbiAgICB9KTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2hlY2tOZXdUcmFuc2FjdGlvbjtcblxuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XG5pbXBvcnQgY3J5cHRvIGZyb20gJ2NyeXB0byc7XG5pbXBvcnQgZWNpZXMgZnJvbSAnc3RhbmRhcmQtZWNpZXMnO1xuXG5jb25zdCBEZWNyeXB0TWVzc2FnZVNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICBwcml2YXRlS2V5OiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH0sXG4gIG1lc3NhZ2U6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfVxufSk7XG5cbmNvbnN0IGRlY3J5cHRNZXNzYWdlID0gKGRhdGEpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBvdXJEYXRhID0gZGF0YTtcbiAgICBEZWNyeXB0TWVzc2FnZVNjaGVtYS52YWxpZGF0ZShvdXJEYXRhKTtcbiAgICBjb25zdCBwcml2YXRlS2V5ID0gQnVmZmVyLmZyb20ob3VyRGF0YS5wcml2YXRlS2V5LCAnaGV4Jyk7XG4gICAgY29uc3QgZWNkaCA9IGNyeXB0by5jcmVhdGVFQ0RIKCdzZWNwMjU2azEnKTtcbiAgICBlY2RoLnNldFByaXZhdGVLZXkocHJpdmF0ZUtleSk7XG4gICAgY29uc3QgbWVzc2FnZSA9IEJ1ZmZlci5mcm9tKG91ckRhdGEubWVzc2FnZSwgJ2hleCcpO1xuICAgIHJldHVybiBlY2llcy5kZWNyeXB0KGVjZGgsIG1lc3NhZ2UpLnRvU3RyaW5nKCd1dGY4Jyk7XG4gIH0gY2F0Y2goZXhjZXB0aW9uKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZG9pY2hhaW4uZGVjcnlwdE1lc3NhZ2UuZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgZGVjcnlwdE1lc3NhZ2U7XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcbmltcG9ydCBlY2llcyBmcm9tICdzdGFuZGFyZC1lY2llcyc7XG5cbmNvbnN0IEVuY3J5cHRNZXNzYWdlU2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIHB1YmxpY0tleToge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9LFxuICBtZXNzYWdlOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH1cbn0pO1xuXG5jb25zdCBlbmNyeXB0TWVzc2FnZSA9IChkYXRhKSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3Qgb3VyRGF0YSA9IGRhdGE7XG4gICAgRW5jcnlwdE1lc3NhZ2VTY2hlbWEudmFsaWRhdGUob3VyRGF0YSk7XG4gICAgY29uc3QgcHVibGljS2V5ID0gQnVmZmVyLmZyb20ob3VyRGF0YS5wdWJsaWNLZXksICdoZXgnKTtcbiAgICBjb25zdCBtZXNzYWdlID0gQnVmZmVyLmZyb20ob3VyRGF0YS5tZXNzYWdlKTtcbiAgICByZXR1cm4gZWNpZXMuZW5jcnlwdChwdWJsaWNLZXksIG1lc3NhZ2UpLnRvU3RyaW5nKCdoZXgnKTtcbiAgfSBjYXRjaChleGNlcHRpb24pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdkb2ljaGFpbi5lbmNyeXB0TWVzc2FnZS5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBlbmNyeXB0TWVzc2FnZTtcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tICdzaW1wbC1zY2hlbWEnO1xuaW1wb3J0IHsgT3B0SW5zIH0gZnJvbSAnLi4vLi4vLi4vYXBpL29wdC1pbnMvb3B0LWlucy5qcyc7XG5pbXBvcnQgZ2V0S2V5UGFpciBmcm9tICcuL2dldF9rZXktcGFpci5qcyc7XG5pbXBvcnQge2xvZ1NlbmR9IGZyb20gXCIuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9sb2ctY29uZmlndXJhdGlvblwiO1xuXG5jb25zdCBHZW5lcmF0ZU5hbWVJZFNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICBpZDoge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9LFxuICBtYXN0ZXJEb2k6IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIG9wdGlvbmFsOiB0cnVlXG4gIH0sXG4gIGluZGV4OiB7XG4gICAgICB0eXBlOiBTaW1wbGVTY2hlbWEuSW50ZWdlcixcbiAgICAgIG9wdGlvbmFsOiB0cnVlXG4gIH1cbn0pO1xuXG5jb25zdCBnZW5lcmF0ZU5hbWVJZCA9IChvcHRJbikgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IG91ck9wdEluID0gb3B0SW47XG4gICAgR2VuZXJhdGVOYW1lSWRTY2hlbWEudmFsaWRhdGUob3VyT3B0SW4pO1xuICAgIGxldCBuYW1lSWQ7XG4gICAgaWYob3B0SW4ubWFzdGVyRG9pKXtcbiAgICAgICAgbmFtZUlkID0gb3VyT3B0SW4ubWFzdGVyRG9pK1wiLVwiK291ck9wdEluLmluZGV4O1xuICAgICAgICBsb2dTZW5kKFwidXNlZCBtYXN0ZXJfZG9pIGFzIG5hbWVJZCBpbmRleCBcIitvcHRJbi5pbmRleCtcInN0b3JhZ2U6XCIsbmFtZUlkKTtcbiAgICB9XG4gICAgZWxzZXtcbiAgICAgICAgbmFtZUlkID0gZ2V0S2V5UGFpcigpLnByaXZhdGVLZXk7XG4gICAgICAgIGxvZ1NlbmQoXCJnZW5lcmF0ZWQgbmFtZUlkIGZvciBkb2ljaGFpbiBzdG9yYWdlOlwiLG5hbWVJZCk7XG4gICAgfVxuXG4gICAgT3B0SW5zLnVwZGF0ZSh7X2lkIDogb3VyT3B0SW4uaWR9LCB7JHNldDp7bmFtZUlkOiBuYW1lSWR9fSk7XG5cbiAgICByZXR1cm4gbmFtZUlkO1xuICB9IGNhdGNoKGV4Y2VwdGlvbikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2RvaWNoYWluLmdlbmVyYXRlTmFtZUlkLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGdlbmVyYXRlTmFtZUlkO1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XG5pbXBvcnQgQ3J5cHRvSlMgZnJvbSAnY3J5cHRvLWpzJztcbmltcG9ydCBCYXNlNTggZnJvbSAnYnM1OCc7XG5pbXBvcnQgeyBpc1JlZ3Rlc3QgfSBmcm9tICcuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9kYXBwLWNvbmZpZ3VyYXRpb24uanMnO1xuaW1wb3J0IHtpc1Rlc3RuZXR9IGZyb20gXCIuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9kYXBwLWNvbmZpZ3VyYXRpb25cIjtcblxuY29uc3QgVkVSU0lPTl9CWVRFID0gMHgzNDtcbmNvbnN0IFZFUlNJT05fQllURV9SRUdURVNUID0gMHg2ZjtcbmNvbnN0IEdldEFkZHJlc3NTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgcHVibGljS2V5OiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH1cbn0pO1xuXG5jb25zdCBnZXRBZGRyZXNzID0gKGRhdGEpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBvdXJEYXRhID0gZGF0YTtcbiAgICBHZXRBZGRyZXNzU2NoZW1hLnZhbGlkYXRlKG91ckRhdGEpO1xuICAgIHJldHVybiBfZ2V0QWRkcmVzcyhvdXJEYXRhLnB1YmxpY0tleSk7XG4gIH0gY2F0Y2goZXhjZXB0aW9uKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZG9pY2hhaW4uZ2V0QWRkcmVzcy5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9XG59O1xuXG5mdW5jdGlvbiBfZ2V0QWRkcmVzcyhwdWJsaWNLZXkpIHtcbiAgY29uc3QgcHViS2V5ID0gQ3J5cHRvSlMubGliLldvcmRBcnJheS5jcmVhdGUoQnVmZmVyLmZyb20ocHVibGljS2V5LCAnaGV4JykpO1xuICBsZXQga2V5ID0gQ3J5cHRvSlMuU0hBMjU2KHB1YktleSk7XG4gIGtleSA9IENyeXB0b0pTLlJJUEVNRDE2MChrZXkpO1xuICBsZXQgdmVyc2lvbkJ5dGUgPSBWRVJTSU9OX0JZVEU7XG4gIGlmKGlzUmVndGVzdCgpIHx8IGlzVGVzdG5ldCgpKSB2ZXJzaW9uQnl0ZSA9IFZFUlNJT05fQllURV9SRUdURVNUO1xuICBsZXQgYWRkcmVzcyA9IEJ1ZmZlci5jb25jYXQoW0J1ZmZlci5mcm9tKFt2ZXJzaW9uQnl0ZV0pLCBCdWZmZXIuZnJvbShrZXkudG9TdHJpbmcoKSwgJ2hleCcpXSk7XG4gIGtleSA9IENyeXB0b0pTLlNIQTI1NihDcnlwdG9KUy5saWIuV29yZEFycmF5LmNyZWF0ZShhZGRyZXNzKSk7XG4gIGtleSA9IENyeXB0b0pTLlNIQTI1NihrZXkpO1xuICBsZXQgY2hlY2tzdW0gPSBrZXkudG9TdHJpbmcoKS5zdWJzdHJpbmcoMCwgOCk7XG4gIGFkZHJlc3MgPSBuZXcgQnVmZmVyKGFkZHJlc3MudG9TdHJpbmcoJ2hleCcpK2NoZWNrc3VtLCdoZXgnKTtcbiAgYWRkcmVzcyA9IEJhc2U1OC5lbmNvZGUoYWRkcmVzcyk7XG4gIHJldHVybiBhZGRyZXNzO1xufVxuXG5leHBvcnQgZGVmYXVsdCBnZXRBZGRyZXNzO1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgeyBnZXRCYWxhbmNlIH0gZnJvbSAnLi4vLi4vLi4vLi4vc2VydmVyL2FwaS9kb2ljaGFpbi5qcyc7XG5pbXBvcnQgeyBDT05GSVJNX0NMSUVOVH0gZnJvbSAnLi4vLi4vLi4vc3RhcnR1cC9zZXJ2ZXIvZG9pY2hhaW4tY29uZmlndXJhdGlvbi5qcyc7XG5cblxuY29uc3QgZ2V0X0JhbGFuY2UgPSAoKSA9PiB7XG4gICAgXG4gIHRyeSB7XG4gICAgY29uc3QgYmFsPWdldEJhbGFuY2UoQ09ORklSTV9DTElFTlQpO1xuICAgIHJldHVybiBiYWw7XG4gICAgXG4gIH0gY2F0Y2goZXhjZXB0aW9uKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZG9pY2hhaW4uZ2V0QmFsYW5jZS5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9XG4gIHJldHVybiB0cnVlO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgZ2V0X0JhbGFuY2U7XG5cbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IENyeXB0b0pTIGZyb20gJ2NyeXB0by1qcyc7XG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XG5cbmNvbnN0IEdldERhdGFIYXNoU2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIGRhdGE6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfVxufSk7XG5cbmNvbnN0IGdldERhdGFIYXNoID0gKGRhdGEpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBvdXJEYXRhID0gZGF0YTtcbiAgICAgIEdldERhdGFIYXNoU2NoZW1hLnZhbGlkYXRlKG91ckRhdGEpO1xuICAgIGNvbnN0IGhhc2ggPSBDcnlwdG9KUy5TSEEyNTYob3VyRGF0YSkudG9TdHJpbmcoKTtcbiAgICByZXR1cm4gaGFzaDtcbiAgfSBjYXRjaChleGNlcHRpb24pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdkb2ljaGFpbi5nZXREYXRhSGFzaC5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBnZXREYXRhSGFzaDtcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IHsgcmFuZG9tQnl0ZXMgfSBmcm9tICdjcnlwdG8nO1xuaW1wb3J0IHNlY3AyNTZrMSBmcm9tICdzZWNwMjU2azEnO1xuXG5jb25zdCBnZXRLZXlQYWlyID0gKCkgPT4ge1xuICB0cnkge1xuICAgIGxldCBwcml2S2V5XG4gICAgZG8ge3ByaXZLZXkgPSByYW5kb21CeXRlcygzMil9IHdoaWxlKCFzZWNwMjU2azEucHJpdmF0ZUtleVZlcmlmeShwcml2S2V5KSlcbiAgICBjb25zdCBwcml2YXRlS2V5ID0gcHJpdktleTtcbiAgICBjb25zdCBwdWJsaWNLZXkgPSBzZWNwMjU2azEucHVibGljS2V5Q3JlYXRlKHByaXZhdGVLZXkpO1xuICAgIHJldHVybiB7XG4gICAgICBwcml2YXRlS2V5OiBwcml2YXRlS2V5LnRvU3RyaW5nKCdoZXgnKS50b1VwcGVyQ2FzZSgpLFxuICAgICAgcHVibGljS2V5OiBwdWJsaWNLZXkudG9TdHJpbmcoJ2hleCcpLnRvVXBwZXJDYXNlKClcbiAgICB9XG4gIH0gY2F0Y2goZXhjZXB0aW9uKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZG9pY2hhaW4uZ2V0S2V5UGFpci5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBnZXRLZXlQYWlyO1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XG5pbXBvcnQgQmFzZTU4IGZyb20gJ2JzNTgnO1xuXG5jb25zdCBHZXRQcml2YXRlS2V5RnJvbVdpZlNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICB3aWY6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfVxufSk7XG5cbmNvbnN0IGdldFByaXZhdGVLZXlGcm9tV2lmID0gKGRhdGEpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBvdXJEYXRhID0gZGF0YTtcbiAgICBHZXRQcml2YXRlS2V5RnJvbVdpZlNjaGVtYS52YWxpZGF0ZShvdXJEYXRhKTtcbiAgICByZXR1cm4gX2dldFByaXZhdGVLZXlGcm9tV2lmKG91ckRhdGEud2lmKTtcbiAgfSBjYXRjaChleGNlcHRpb24pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdkb2ljaGFpbi5nZXRQcml2YXRlS2V5RnJvbVdpZi5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9XG59O1xuXG5mdW5jdGlvbiBfZ2V0UHJpdmF0ZUtleUZyb21XaWYod2lmKSB7XG4gIHZhciBwcml2YXRlS2V5ID0gQmFzZTU4LmRlY29kZSh3aWYpLnRvU3RyaW5nKCdoZXgnKTtcbiAgcHJpdmF0ZUtleSA9IHByaXZhdGVLZXkuc3Vic3RyaW5nKDIsIHByaXZhdGVLZXkubGVuZ3RoIC0gOCk7XG4gIGlmKHByaXZhdGVLZXkubGVuZ3RoID09PSA2NiAmJiBwcml2YXRlS2V5LmVuZHNXaXRoKFwiMDFcIikpIHtcbiAgICBwcml2YXRlS2V5ID0gcHJpdmF0ZUtleS5zdWJzdHJpbmcoMCwgcHJpdmF0ZUtleS5sZW5ndGggLSAyKTtcbiAgfVxuICByZXR1cm4gcHJpdmF0ZUtleTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZ2V0UHJpdmF0ZUtleUZyb21XaWY7XG4iLCJpbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XG5pbXBvcnQge2xvZ1NlbmR9IGZyb20gXCIuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9sb2ctY29uZmlndXJhdGlvblwiO1xuXG5pbXBvcnQgZ2V0T3B0SW5LZXkgZnJvbSBcIi4uL2Rucy9nZXRfb3B0LWluLWtleVwiO1xuaW1wb3J0IGdldE9wdEluUHJvdmlkZXIgZnJvbSBcIi4uL2Rucy9nZXRfb3B0LWluLXByb3ZpZGVyXCI7XG5pbXBvcnQgZ2V0QWRkcmVzcyBmcm9tIFwiLi9nZXRfYWRkcmVzc1wiO1xuXG5jb25zdCBHZXRQdWJsaWNLZXlTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgICBkb21haW46IHtcbiAgICAgICAgdHlwZTogU3RyaW5nXG4gICAgfVxufSk7XG5cbmNvbnN0IGdldFB1YmxpY0tleUFuZEFkZHJlc3MgPSAoZGF0YSkgPT4ge1xuXG4gICAgY29uc3Qgb3VyRGF0YSA9IGRhdGE7XG4gICAgR2V0UHVibGljS2V5U2NoZW1hLnZhbGlkYXRlKG91ckRhdGEpO1xuXG4gICAgbGV0IHB1YmxpY0tleSA9IGdldE9wdEluS2V5KHtkb21haW46IG91ckRhdGEuZG9tYWlufSk7XG4gICAgaWYoIXB1YmxpY0tleSl7XG4gICAgICAgIGNvbnN0IHByb3ZpZGVyID0gZ2V0T3B0SW5Qcm92aWRlcih7ZG9tYWluOiBvdXJEYXRhLmRvbWFpbn0pO1xuICAgICAgICBsb2dTZW5kKFwidXNpbmcgZG9pY2hhaW4gcHJvdmlkZXIgaW5zdGVhZCBvZiBkaXJlY3RseSBjb25maWd1cmVkIHB1YmxpY0tleTpcIix7cHJvdmlkZXI6cHJvdmlkZXJ9KTtcbiAgICAgICAgcHVibGljS2V5ID0gZ2V0T3B0SW5LZXkoe2RvbWFpbjogcHJvdmlkZXJ9KTsgLy9nZXQgcHVibGljIGtleSBmcm9tIHByb3ZpZGVyIG9yIGZhbGxiYWNrIGlmIHB1YmxpY2tleSB3YXMgbm90IHNldCBpbiBkbnNcbiAgICB9XG4gICAgY29uc3QgZGVzdEFkZHJlc3MgPSAgZ2V0QWRkcmVzcyh7cHVibGljS2V5OiBwdWJsaWNLZXl9KTtcbiAgICBsb2dTZW5kKCdwdWJsaWNLZXkgYW5kIGRlc3RBZGRyZXNzICcsIHtwdWJsaWNLZXk6cHVibGljS2V5LGRlc3RBZGRyZXNzOmRlc3RBZGRyZXNzfSk7XG4gICAgcmV0dXJuIHtwdWJsaWNLZXk6cHVibGljS2V5LGRlc3RBZGRyZXNzOmRlc3RBZGRyZXNzfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGdldFB1YmxpY0tleUFuZEFkZHJlc3M7IiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XG5pbXBvcnQgYml0Y29yZSBmcm9tICdiaXRjb3JlLWxpYic7XG5pbXBvcnQgTWVzc2FnZSBmcm9tICdiaXRjb3JlLW1lc3NhZ2UnO1xuXG5jb25zdCBHZXRTaWduYXR1cmVTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgbWVzc2FnZToge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9LFxuICBwcml2YXRlS2V5OiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH1cbn0pO1xuXG5jb25zdCBnZXRTaWduYXR1cmUgPSAoZGF0YSkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IG91ckRhdGEgPSBkYXRhO1xuICAgIEdldFNpZ25hdHVyZVNjaGVtYS52YWxpZGF0ZShvdXJEYXRhKTtcbiAgICBjb25zdCBzaWduYXR1cmUgPSBNZXNzYWdlKG91ckRhdGEubWVzc2FnZSkuc2lnbihuZXcgYml0Y29yZS5Qcml2YXRlS2V5KG91ckRhdGEucHJpdmF0ZUtleSkpO1xuICAgIHJldHVybiBzaWduYXR1cmU7XG4gIH0gY2F0Y2goZXhjZXB0aW9uKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZG9pY2hhaW4uZ2V0U2lnbmF0dXJlLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGdldFNpZ25hdHVyZTtcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tICdzaW1wbC1zY2hlbWEnO1xuaW1wb3J0IHsgU0VORF9DTElFTlQgfSBmcm9tICcuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9kb2ljaGFpbi1jb25maWd1cmF0aW9uLmpzJztcbmltcG9ydCBlbmNyeXB0TWVzc2FnZSBmcm9tIFwiLi9lbmNyeXB0X21lc3NhZ2VcIjtcbmltcG9ydCB7Z2V0VXJsfSBmcm9tIFwiLi4vLi4vLi4vc3RhcnR1cC9zZXJ2ZXIvZGFwcC1jb25maWd1cmF0aW9uXCI7XG5pbXBvcnQge2xvZ0Jsb2NrY2hhaW4sIGxvZ1NlbmR9IGZyb20gXCIuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9sb2ctY29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHtmZWVEb2ksbmFtZURvaX0gZnJvbSBcIi4uLy4uLy4uLy4uL3NlcnZlci9hcGkvZG9pY2hhaW5cIjtcbmltcG9ydCB7T3B0SW5zfSBmcm9tIFwiLi4vLi4vLi4vYXBpL29wdC1pbnMvb3B0LWluc1wiO1xuaW1wb3J0IGdldFB1YmxpY0tleUFuZEFkZHJlc3MgZnJvbSBcIi4vZ2V0X3B1YmxpY2tleV9hbmRfYWRkcmVzc19ieV9kb21haW5cIjtcblxuXG5jb25zdCBJbnNlcnRTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgbmFtZUlkOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH0sXG4gIHNpZ25hdHVyZToge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9LFxuICBkYXRhSGFzaDoge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9LFxuICBkb21haW46IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfSxcbiAgc29pRGF0ZToge1xuICAgIHR5cGU6IERhdGVcbiAgfVxufSk7XG5cbmNvbnN0IGluc2VydCA9IChkYXRhKSA9PiB7XG4gIGNvbnN0IG91ckRhdGEgPSBkYXRhO1xuICB0cnkge1xuICAgIEluc2VydFNjaGVtYS52YWxpZGF0ZShvdXJEYXRhKTtcbiAgICBsb2dTZW5kKFwiZG9tYWluOlwiLG91ckRhdGEuZG9tYWluKTtcblxuICAgIGNvbnN0IHB1YmxpY0tleUFuZEFkZHJlc3MgPSBnZXRQdWJsaWNLZXlBbmRBZGRyZXNzKHtkb21haW46b3VyRGF0YS5kb21haW59KTtcbiAgICBjb25zdCBmcm9tID0gZW5jcnlwdE1lc3NhZ2Uoe3B1YmxpY0tleTogcHVibGljS2V5QW5kQWRkcmVzcy5wdWJsaWNLZXksIG1lc3NhZ2U6IGdldFVybCgpfSk7XG4gICAgbG9nU2VuZCgnZW5jcnlwdGVkIHVybCBmb3IgdXNlIGFkIGZyb20gaW4gZG9pY2hhaW4gdmFsdWU6JyxnZXRVcmwoKSxmcm9tKTtcblxuICAgIGNvbnN0IG5hbWVWYWx1ZSA9IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgc2lnbmF0dXJlOiBvdXJEYXRhLnNpZ25hdHVyZSxcbiAgICAgICAgZGF0YUhhc2g6IG91ckRhdGEuZGF0YUhhc2gsXG4gICAgICAgIGZyb206IGZyb21cbiAgICB9KTtcblxuICAgIC8vVE9ETyAoISkgdGhpcyBtdXN0IGJlIHJlcGxhY2VkIGluIGZ1dHVyZSBieSBcImF0b21pYyBuYW1lIHRyYWRpbmcgZXhhbXBsZVwiIGh0dHBzOi8vd2lraS5uYW1lY29pbi5pbmZvLz90aXRsZT1BdG9taWNfTmFtZS1UcmFkaW5nXG4gICAgbG9nQmxvY2tjaGFpbignc2VuZGluZyBhIGZlZSB0byBib2Igc28gaGUgY2FuIHBheSB0aGUgZG9pIHN0b3JhZ2UgKGRlc3RBZGRyZXNzKTonLCBwdWJsaWNLZXlBbmRBZGRyZXNzLmRlc3RBZGRyZXNzKTtcbiAgICBjb25zdCBmZWVEb2lUeCA9IGZlZURvaShTRU5EX0NMSUVOVCwgcHVibGljS2V5QW5kQWRkcmVzcy5kZXN0QWRkcmVzcyk7XG4gICAgbG9nQmxvY2tjaGFpbignZmVlIHNlbmQgdHhpZCB0byBkZXN0YWRkcmVzcycsIGZlZURvaVR4LCBwdWJsaWNLZXlBbmRBZGRyZXNzLmRlc3RBZGRyZXNzKTtcblxuICAgIGxvZ0Jsb2NrY2hhaW4oJ2FkZGluZyBkYXRhIHRvIGJsb2NrY2hhaW4gdmlhIG5hbWVfZG9pIChuYW1lSWQsdmFsdWUsZGVzdEFkZHJlc3MpOicsIG91ckRhdGEubmFtZUlkLG5hbWVWYWx1ZSxwdWJsaWNLZXlBbmRBZGRyZXNzLmRlc3RBZGRyZXNzKTtcbiAgICBjb25zdCBuYW1lRG9pVHggPSBuYW1lRG9pKFNFTkRfQ0xJRU5ULCBvdXJEYXRhLm5hbWVJZCwgbmFtZVZhbHVlLCBwdWJsaWNLZXlBbmRBZGRyZXNzLmRlc3RBZGRyZXNzKTtcbiAgICBsb2dCbG9ja2NoYWluKCduYW1lX2RvaSBhZGRlZCBibG9ja2NoYWluLiB0eGlkOicsIG5hbWVEb2lUeCk7XG5cbiAgICBPcHRJbnMudXBkYXRlKHtuYW1lSWQ6IG91ckRhdGEubmFtZUlkfSwgeyRzZXQ6IHt0eElkOm5hbWVEb2lUeH19KTtcbiAgICBsb2dCbG9ja2NoYWluKCd1cGRhdGluZyBPcHRJbiBsb2NhbGx5IHdpdGg6Jywge25hbWVJZDogb3VyRGF0YS5uYW1lSWQsIHR4SWQ6IG5hbWVEb2lUeH0pO1xuXG4gIH0gY2F0Y2goZXhjZXB0aW9uKSB7XG4gICAgICBPcHRJbnMudXBkYXRlKHtuYW1lSWQ6IG91ckRhdGEubmFtZUlkfSwgeyRzZXQ6IHtlcnJvcjpKU09OLnN0cmluZ2lmeShleGNlcHRpb24ubWVzc2FnZSl9fSk7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZG9pY2hhaW4uaW5zZXJ0LmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7IC8vVE9ETyB1cGRhdGUgb3B0LWluIGluIGxvY2FsIGRiIHRvIGluZm9ybSB1c2VyIGFib3V0IHRoZSBlcnJvciEgZS5nLiBJbnN1ZmZpY2llbnQgZnVuZHMgZXRjLlxuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBpbnNlcnQ7XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcbmltcG9ydCB7IENPTkZJUk1fQ0xJRU5UIH0gZnJvbSAnLi4vLi4vLi4vc3RhcnR1cC9zZXJ2ZXIvZG9pY2hhaW4tY29uZmlndXJhdGlvbi5qcyc7XG5pbXBvcnQge2dldFdpZiwgc2lnbk1lc3NhZ2UsIGdldFRyYW5zYWN0aW9uLCBuYW1lRG9pLCBuYW1lU2hvd30gZnJvbSBcIi4uLy4uLy4uLy4uL3NlcnZlci9hcGkvZG9pY2hhaW5cIjtcbmltcG9ydCB7QVBJX1BBVEgsIERPSV9DT05GSVJNQVRJT05fTk9USUZZX1JPVVRFLCBWRVJTSU9OfSBmcm9tIFwiLi4vLi4vLi4vLi4vc2VydmVyL2FwaS9yZXN0L3Jlc3RcIjtcbmltcG9ydCB7Q09ORklSTV9BRERSRVNTfSBmcm9tIFwiLi4vLi4vLi4vc3RhcnR1cC9zZXJ2ZXIvZG9pY2hhaW4tY29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHtnZXRIdHRwUFVUfSBmcm9tIFwiLi4vLi4vLi4vLi4vc2VydmVyL2FwaS9odHRwXCI7XG5pbXBvcnQge2xvZ0NvbmZpcm19IGZyb20gXCIuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9sb2ctY29uZmlndXJhdGlvblwiO1xuaW1wb3J0IGdldFByaXZhdGVLZXlGcm9tV2lmIGZyb20gXCIuL2dldF9wcml2YXRlLWtleV9mcm9tX3dpZlwiO1xuaW1wb3J0IGRlY3J5cHRNZXNzYWdlIGZyb20gXCIuL2RlY3J5cHRfbWVzc2FnZVwiO1xuaW1wb3J0IHtPcHRJbnN9IGZyb20gXCIuLi8uLi8uLi9hcGkvb3B0LWlucy9vcHQtaW5zXCI7XG5cbmNvbnN0IFVwZGF0ZVNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICBuYW1lSWQ6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfSxcbiAgdmFsdWU6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfSxcbiAgaG9zdCA6IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIG9wdGlvbmFsOiB0cnVlLFxuICB9LFxuICBmcm9tSG9zdFVybCA6IHtcbiAgICAgIHR5cGU6IFN0cmluZ1xuICB9XG59KTtcblxuY29uc3QgdXBkYXRlID0gKGRhdGEsIGpvYikgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IG91ckRhdGEgPSBkYXRhO1xuXG4gICAgVXBkYXRlU2NoZW1hLnZhbGlkYXRlKG91ckRhdGEpO1xuXG4gICAgLy9zdG9wIHRoaXMgdXBkYXRlIHVudGlsIHRoaXMgbmFtZSBhcyBhdCBsZWFzdCAxIGNvbmZpcm1hdGlvblxuICAgIGNvbnN0IG5hbWVfZGF0YSA9IG5hbWVTaG93KENPTkZJUk1fQ0xJRU5ULG91ckRhdGEubmFtZUlkKTtcbiAgICBpZihuYW1lX2RhdGEgPT09IHVuZGVmaW5lZCl7XG4gICAgICAgIHJlcnVuKGpvYik7XG4gICAgICAgIGxvZ0NvbmZpcm0oJ25hbWUgbm90IHZpc2libGUgLSBkZWxheWluZyBuYW1lIHVwZGF0ZScsb3VyRGF0YS5uYW1lSWQpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IG91cl90cmFuc2FjdGlvbiA9IGdldFRyYW5zYWN0aW9uKENPTkZJUk1fQ0xJRU5ULG5hbWVfZGF0YS50eGlkKTtcbiAgICBpZihvdXJfdHJhbnNhY3Rpb24uY29uZmlybWF0aW9ucz09PTApe1xuICAgICAgICByZXJ1bihqb2IpO1xuICAgICAgICBsb2dDb25maXJtKCd0cmFuc2FjdGlvbiBoYXMgMCBjb25maXJtYXRpb25zIC0gZGVsYXlpbmcgbmFtZSB1cGRhdGUnLEpTT04ucGFyc2Uob3VyRGF0YS52YWx1ZSkpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGxvZ0NvbmZpcm0oJ3VwZGF0aW5nIGJsb2NrY2hhaW4gd2l0aCBkb2lTaWduYXR1cmU6JyxKU09OLnBhcnNlKG91ckRhdGEudmFsdWUpKTtcbiAgICBjb25zdCB3aWYgPSBnZXRXaWYoQ09ORklSTV9DTElFTlQsIENPTkZJUk1fQUREUkVTUyk7XG4gICAgY29uc3QgcHJpdmF0ZUtleSA9IGdldFByaXZhdGVLZXlGcm9tV2lmKHt3aWY6IHdpZn0pO1xuICAgIGxvZ0NvbmZpcm0oJ2dvdCBwcml2YXRlIGtleSAod2lsbCBub3Qgc2hvdyBpdCBoZXJlKSBpbiBvcmRlciB0byBkZWNyeXB0IFNlbmQtZEFwcCBob3N0IHVybCBmcm9tIHZhbHVlOicsb3VyRGF0YS5mcm9tSG9zdFVybCk7XG4gICAgY29uc3Qgb3VyZnJvbUhvc3RVcmwgPSBkZWNyeXB0TWVzc2FnZSh7cHJpdmF0ZUtleTogcHJpdmF0ZUtleSwgbWVzc2FnZTogb3VyRGF0YS5mcm9tSG9zdFVybH0pO1xuICAgIGxvZ0NvbmZpcm0oJ2RlY3J5cHRlZCBmcm9tSG9zdFVybCcsb3VyZnJvbUhvc3RVcmwpO1xuICAgIGNvbnN0IHVybCA9IG91cmZyb21Ib3N0VXJsK0FQSV9QQVRIK1ZFUlNJT04rXCIvXCIrRE9JX0NPTkZJUk1BVElPTl9OT1RJRllfUk9VVEU7XG5cbiAgICBsb2dDb25maXJtKCdjcmVhdGluZyBzaWduYXR1cmUgd2l0aCBBRERSRVNTJytDT05GSVJNX0FERFJFU1MrXCIgbmFtZUlkOlwiLG91ckRhdGEudmFsdWUpO1xuICAgIGNvbnN0IHNpZ25hdHVyZSA9IHNpZ25NZXNzYWdlKENPTkZJUk1fQ0xJRU5ULCBDT05GSVJNX0FERFJFU1MsIG91ckRhdGEubmFtZUlkKTsgLy9UT0RPIHdoeSBoZXJlIG92ZXIgbmFtZUlEP1xuICAgIGxvZ0NvbmZpcm0oJ3NpZ25hdHVyZSBjcmVhdGVkOicsc2lnbmF0dXJlKTtcblxuICAgIGNvbnN0IHVwZGF0ZURhdGEgPSB7XG4gICAgICAgIG5hbWVJZDogb3VyRGF0YS5uYW1lSWQsXG4gICAgICAgIHNpZ25hdHVyZTogc2lnbmF0dXJlLFxuICAgICAgICBob3N0OiBvdXJEYXRhLmhvc3RcbiAgICB9O1xuXG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgdHhpZCA9IG5hbWVEb2koQ09ORklSTV9DTElFTlQsIG91ckRhdGEubmFtZUlkLCBvdXJEYXRhLnZhbHVlLCBudWxsKTtcbiAgICAgICAgbG9nQ29uZmlybSgndXBkYXRlIHRyYW5zYWN0aW9uIHR4aWQ6Jyx0eGlkKTtcbiAgICB9Y2F0Y2goZXhjZXB0aW9uKXtcbiAgICAgICAgLy9cbiAgICAgICAgbG9nQ29uZmlybSgndGhpcyBuYW1lRE9JIGRvZXNuwrR0IGhhdmUgYSBibG9jayB5ZXQgYW5kIHdpbGwgYmUgdXBkYXRlZCB3aXRoIHRoZSBuZXh0IGJsb2NrIGFuZCB3aXRoIHRoZSBuZXh0IHF1ZXVlIHN0YXJ0Oicsb3VyRGF0YS5uYW1lSWQpO1xuICAgICAgICBpZihleGNlcHRpb24udG9TdHJpbmcoKS5pbmRleE9mKFwidGhlcmUgaXMgYWxyZWFkeSBhIHJlZ2lzdHJhdGlvbiBmb3IgdGhpcyBkb2kgbmFtZVwiKT09LTEpIHtcbiAgICAgICAgICAgIE9wdElucy51cGRhdGUoe25hbWVJZDogb3VyRGF0YS5uYW1lSWR9LCB7JHNldDoge2Vycm9yOiBKU09OLnN0cmluZ2lmeShleGNlcHRpb24ubWVzc2FnZSl9fSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZG9pY2hhaW4udXBkYXRlLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gICAgICAgIC8vfWVsc2V7XG4gICAgICAgIC8vICAgIGxvZ0NvbmZpcm0oJ3RoaXMgbmFtZURPSSBkb2VzbsK0dCBoYXZlIGEgYmxvY2sgeWV0IGFuZCB3aWxsIGJlIHVwZGF0ZWQgd2l0aCB0aGUgbmV4dCBibG9jayBhbmQgd2l0aCB0aGUgbmV4dCBxdWV1ZSBzdGFydDonLG91ckRhdGEubmFtZUlkKTtcbiAgICAgICAgLy99XG4gICAgfVxuXG4gICAgY29uc3QgcmVzcG9uc2UgPSBnZXRIdHRwUFVUKHVybCwgdXBkYXRlRGF0YSk7XG4gICAgbG9nQ29uZmlybSgnaW5mb3JtZWQgc2VuZCBkQXBwIGFib3V0IGNvbmZpcm1lZCBkb2kgb24gdXJsOicrdXJsKycgd2l0aCB1cGRhdGVEYXRhJytKU09OLnN0cmluZ2lmeSh1cGRhdGVEYXRhKStcIiByZXNwb25zZTpcIixyZXNwb25zZS5kYXRhKTtcbiAgICBqb2IuZG9uZSgpO1xuICB9IGNhdGNoKGV4Y2VwdGlvbikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2RvaWNoYWluLnVwZGF0ZS5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9XG59O1xuXG5mdW5jdGlvbiByZXJ1bihqb2Ipe1xuICAgIGxvZ0NvbmZpcm0oJ3JlcnVubmluZyB0eGlkIGluIDEwc2VjIC0gY2FuY2VsaW5nIG9sZCBqb2InLCcnKTtcbiAgICBqb2IuY2FuY2VsKCk7XG4gICAgbG9nQ29uZmlybSgncmVzdGFydCBibG9ja2NoYWluIGRvaSB1cGRhdGUnLCcnKTtcbiAgICBqb2IucmVzdGFydChcbiAgICAgICAge1xuICAgICAgICAgICAgLy9yZXBlYXRzOiA2MDAsICAgLy8gT25seSByZXBlYXQgdGhpcyBvbmNlXG4gICAgICAgICAgICAvLyBUaGlzIGlzIHRoZSBkZWZhdWx0XG4gICAgICAgICAgIC8vIHdhaXQ6IDEwMDAwICAgLy8gV2FpdCAxMCBzZWMgYmV0d2VlbiByZXBlYXRzXG4gICAgICAgICAgICAgICAgICAgICAgICAgIC8vIERlZmF1bHQgaXMgcHJldmlvdXMgc2V0dGluZ1xuICAgICAgICB9LFxuICAgICAgICBmdW5jdGlvbiAoZXJyLCByZXN1bHQpIHtcbiAgICAgICAgICAgIGlmIChyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICBsb2dDb25maXJtKCdyZXJ1bm5pbmcgdHhpZCBpbiAxMHNlYzonLHJlc3VsdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICApO1xufVxuXG5leHBvcnQgZGVmYXVsdCB1cGRhdGU7XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcbmltcG9ydCBiaXRjb3JlIGZyb20gJ2JpdGNvcmUtbGliJztcbmltcG9ydCBNZXNzYWdlIGZyb20gJ2JpdGNvcmUtbWVzc2FnZSc7XG5pbXBvcnQge2xvZ0Vycm9yLCBsb2dWZXJpZnl9IGZyb20gXCIuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9sb2ctY29uZmlndXJhdGlvblwiO1xuY29uc3QgTkVUV09SSyA9IGJpdGNvcmUuTmV0d29ya3MuYWRkKHtcbiAgbmFtZTogJ2RvaWNoYWluJyxcbiAgYWxpYXM6ICdkb2ljaGFpbicsXG4gIHB1YmtleWhhc2g6IDB4MzQsXG4gIHByaXZhdGVrZXk6IDB4QjQsXG4gIHNjcmlwdGhhc2g6IDEzLFxuICBuZXR3b3JrTWFnaWM6IDB4ZjliZWI0ZmUsXG59KTtcblxuY29uc3QgVmVyaWZ5U2lnbmF0dXJlU2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIGRhdGE6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfSxcbiAgcHVibGljS2V5OiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH0sXG4gIHNpZ25hdHVyZToge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9XG59KTtcblxuY29uc3QgdmVyaWZ5U2lnbmF0dXJlID0gKGRhdGEpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBvdXJEYXRhID0gZGF0YTtcbiAgICBsb2dWZXJpZnkoJ3ZlcmlmeVNpZ25hdHVyZTonLG91ckRhdGEpO1xuICAgIFZlcmlmeVNpZ25hdHVyZVNjaGVtYS52YWxpZGF0ZShvdXJEYXRhKTtcbiAgICBjb25zdCBhZGRyZXNzID0gYml0Y29yZS5BZGRyZXNzLmZyb21QdWJsaWNLZXkobmV3IGJpdGNvcmUuUHVibGljS2V5KG91ckRhdGEucHVibGljS2V5KSwgTkVUV09SSyk7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBNZXNzYWdlKG91ckRhdGEuZGF0YSkudmVyaWZ5KGFkZHJlc3MsIG91ckRhdGEuc2lnbmF0dXJlKTtcbiAgICB9IGNhdGNoKGVycm9yKSB7IGxvZ0Vycm9yKGVycm9yKX1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH0gY2F0Y2goZXhjZXB0aW9uKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZG9pY2hhaW4udmVyaWZ5U2lnbmF0dXJlLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IHZlcmlmeVNpZ25hdHVyZTtcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tICdzaW1wbC1zY2hlbWEnO1xuaW1wb3J0IHsgT3B0SW5zIH0gZnJvbSAnLi4vLi4vLi4vYXBpL29wdC1pbnMvb3B0LWlucy5qcyc7XG5pbXBvcnQgeyBTZW5kZXJzIH0gZnJvbSAnLi4vLi4vLi4vYXBpL3NlbmRlcnMvc2VuZGVycy5qcyc7XG5pbXBvcnQgeyBSZWNpcGllbnRzIH0gZnJvbSAnLi4vLi4vLi4vYXBpL3JlY2lwaWVudHMvcmVjaXBpZW50cy5qcyc7XG5pbXBvcnQgZ2VuZXJhdGVOYW1lSWQgZnJvbSAnLi9nZW5lcmF0ZV9uYW1lLWlkLmpzJztcbmltcG9ydCBnZXRTaWduYXR1cmUgZnJvbSAnLi9nZXRfc2lnbmF0dXJlLmpzJztcbmltcG9ydCBnZXREYXRhSGFzaCBmcm9tICcuL2dldF9kYXRhLWhhc2guanMnO1xuaW1wb3J0IGFkZEluc2VydEJsb2NrY2hhaW5Kb2IgZnJvbSAnLi4vam9icy9hZGRfaW5zZXJ0X2Jsb2NrY2hhaW4uanMnO1xuaW1wb3J0IHtsb2dTZW5kfSBmcm9tIFwiLi4vLi4vLi4vc3RhcnR1cC9zZXJ2ZXIvbG9nLWNvbmZpZ3VyYXRpb25cIjtcblxuY29uc3QgV3JpdGVUb0Jsb2NrY2hhaW5TY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgaWQ6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfVxufSk7XG5cbmNvbnN0IHdyaXRlVG9CbG9ja2NoYWluID0gKGRhdGEpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBvdXJEYXRhID0gZGF0YTtcbiAgICBXcml0ZVRvQmxvY2tjaGFpblNjaGVtYS52YWxpZGF0ZShvdXJEYXRhKTtcblxuICAgIGNvbnN0IG9wdEluID0gT3B0SW5zLmZpbmRPbmUoe19pZDogZGF0YS5pZH0pO1xuICAgIGNvbnN0IHJlY2lwaWVudCA9IFJlY2lwaWVudHMuZmluZE9uZSh7X2lkOiBvcHRJbi5yZWNpcGllbnR9KTtcbiAgICBjb25zdCBzZW5kZXIgPSBTZW5kZXJzLmZpbmRPbmUoe19pZDogb3B0SW4uc2VuZGVyfSk7XG4gICAgbG9nU2VuZChcIm9wdEluIGRhdGE6XCIse2luZGV4Om91ckRhdGEuaW5kZXgsIG9wdEluOm9wdEluLHJlY2lwaWVudDpyZWNpcGllbnQsc2VuZGVyOiBzZW5kZXJ9KTtcblxuXG4gICAgY29uc3QgbmFtZUlkID0gZ2VuZXJhdGVOYW1lSWQoe2lkOiBkYXRhLmlkLGluZGV4Om9wdEluLmluZGV4LG1hc3RlckRvaTpvcHRJbi5tYXN0ZXJEb2kgfSk7XG4gICAgY29uc3Qgc2lnbmF0dXJlID0gZ2V0U2lnbmF0dXJlKHttZXNzYWdlOiByZWNpcGllbnQuZW1haWwrc2VuZGVyLmVtYWlsLCBwcml2YXRlS2V5OiByZWNpcGllbnQucHJpdmF0ZUtleX0pO1xuICAgIGxvZ1NlbmQoXCJnZW5lcmF0ZWQgc2lnbmF0dXJlIGZyb20gZW1haWwgcmVjaXBpZW50IGFuZCBzZW5kZXI6XCIsc2lnbmF0dXJlKTtcblxuICAgIGxldCBkYXRhSGFzaCA9IFwiXCI7XG5cbiAgICBpZihvcHRJbi5kYXRhKSB7XG4gICAgICBkYXRhSGFzaCA9IGdldERhdGFIYXNoKHtkYXRhOiBvcHRJbi5kYXRhfSk7XG4gICAgICBsb2dTZW5kKFwiZ2VuZXJhdGVkIGRhdGFoYXNoIGZyb20gZ2l2ZW4gZGF0YTpcIixkYXRhSGFzaCk7XG4gICAgfVxuXG4gICAgY29uc3QgcGFydHMgPSByZWNpcGllbnQuZW1haWwuc3BsaXQoXCJAXCIpO1xuICAgIGNvbnN0IGRvbWFpbiA9IHBhcnRzW3BhcnRzLmxlbmd0aC0xXTtcbiAgICBsb2dTZW5kKFwiZW1haWwgZG9tYWluIGZvciBwdWJsaWNLZXkgcmVxdWVzdCBpczpcIixkb21haW4pO1xuICAgIGFkZEluc2VydEJsb2NrY2hhaW5Kb2Ioe1xuICAgICAgbmFtZUlkOiBuYW1lSWQsXG4gICAgICBzaWduYXR1cmU6IHNpZ25hdHVyZSxcbiAgICAgIGRhdGFIYXNoOiBkYXRhSGFzaCxcbiAgICAgIGRvbWFpbjogZG9tYWluLFxuICAgICAgc29pRGF0ZTogb3B0SW4uY3JlYXRlZEF0XG4gICAgfSlcbiAgfSBjYXRjaCAoZXhjZXB0aW9uKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZG9pY2hhaW4ud3JpdGVUb0Jsb2NrY2hhaW4uZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgd3JpdGVUb0Jsb2NrY2hhaW5cbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tICdzaW1wbC1zY2hlbWEnO1xuaW1wb3J0IHsgSGFzaElkcyB9IGZyb20gJy4uLy4uLy4uL3N0YXJ0dXAvc2VydmVyL2VtYWlsLWNvbmZpZ3VyYXRpb24uanMnO1xuXG5jb25zdCBEZWNvZGVEb2lIYXNoU2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIGhhc2g6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfVxufSk7XG5cbmNvbnN0IGRlY29kZURvaUhhc2ggPSAoaGFzaCkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IG91ckhhc2ggPSBoYXNoO1xuICAgIERlY29kZURvaUhhc2hTY2hlbWEudmFsaWRhdGUob3VySGFzaCk7XG4gICAgY29uc3QgaGV4ID0gSGFzaElkcy5kZWNvZGVIZXgob3VySGFzaC5oYXNoKTtcbiAgICBpZighaGV4IHx8IGhleCA9PT0gJycpIHRocm93IFwiV3JvbmcgaGFzaFwiO1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBvYmogPSBKU09OLnBhcnNlKEJ1ZmZlcihoZXgsICdoZXgnKS50b1N0cmluZygnYXNjaWknKSk7XG4gICAgICByZXR1cm4gb2JqO1xuICAgIH0gY2F0Y2goZXhjZXB0aW9uKSB7dGhyb3cgXCJXcm9uZyBoYXNoXCI7fVxuICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlbWFpbHMuZGVjb2RlX2RvaS1oYXNoLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGRlY29kZURvaUhhc2g7XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcbmltcG9ydCB7IEhhc2hJZHMgfSBmcm9tICcuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9lbWFpbC1jb25maWd1cmF0aW9uLmpzJztcblxuY29uc3QgR2VuZXJhdGVEb2lIYXNoU2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIGlkOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH0sXG4gIHRva2VuOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH0sXG4gIHJlZGlyZWN0OiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH1cbn0pO1xuXG5jb25zdCBnZW5lcmF0ZURvaUhhc2ggPSAob3B0SW4pID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBvdXJPcHRJbiA9IG9wdEluO1xuICAgIEdlbmVyYXRlRG9pSGFzaFNjaGVtYS52YWxpZGF0ZShvdXJPcHRJbik7XG5cbiAgICBjb25zdCBqc29uID0gSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgaWQ6IG91ck9wdEluLmlkLFxuICAgICAgdG9rZW46IG91ck9wdEluLnRva2VuLFxuICAgICAgcmVkaXJlY3Q6IG91ck9wdEluLnJlZGlyZWN0XG4gICAgfSk7XG5cbiAgICBjb25zdCBoZXggPSBCdWZmZXIoanNvbikudG9TdHJpbmcoJ2hleCcpO1xuICAgIGNvbnN0IGhhc2ggPSBIYXNoSWRzLmVuY29kZUhleChoZXgpO1xuICAgIHJldHVybiBoYXNoO1xuICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlbWFpbHMuZ2VuZXJhdGVfZG9pLWhhc2guZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgZ2VuZXJhdGVEb2lIYXNoO1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XG5pbXBvcnQge2xvZ0NvbmZpcm19IGZyb20gXCIuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9sb2ctY29uZmlndXJhdGlvblwiO1xuXG5jb25zdCBQTEFDRUhPTERFUl9SRUdFWCA9IC9cXCR7KFtcXHddKil9L2c7XG5jb25zdCBQYXJzZVRlbXBsYXRlU2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIHRlbXBsYXRlOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICB9LFxuICBkYXRhOiB7XG4gICAgdHlwZTogT2JqZWN0LFxuICAgIGJsYWNrYm94OiB0cnVlXG4gIH1cbn0pO1xuXG5jb25zdCBwYXJzZVRlbXBsYXRlID0gKGRhdGEpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBvdXJEYXRhID0gZGF0YTtcbiAgICAvL2xvZ0NvbmZpcm0oJ3BhcnNlVGVtcGxhdGU6JyxvdXJEYXRhKTtcblxuICAgIFBhcnNlVGVtcGxhdGVTY2hlbWEudmFsaWRhdGUob3VyRGF0YSk7XG4gICAgbG9nQ29uZmlybSgnUGFyc2VUZW1wbGF0ZVNjaGVtYSB2YWxpZGF0ZWQnKTtcblxuICAgIHZhciBfbWF0Y2g7XG4gICAgdmFyIHRlbXBsYXRlID0gb3VyRGF0YS50ZW1wbGF0ZTtcbiAgIC8vbG9nQ29uZmlybSgnZG9pbmcgc29tZSByZWdleCB3aXRoIHRlbXBsYXRlOicsdGVtcGxhdGUpO1xuXG4gICAgZG8ge1xuICAgICAgX21hdGNoID0gUExBQ0VIT0xERVJfUkVHRVguZXhlYyh0ZW1wbGF0ZSk7XG4gICAgICBpZihfbWF0Y2gpIHRlbXBsYXRlID0gX3JlcGxhY2VQbGFjZWhvbGRlcih0ZW1wbGF0ZSwgX21hdGNoLCBvdXJEYXRhLmRhdGFbX21hdGNoWzFdXSk7XG4gICAgfSB3aGlsZSAoX21hdGNoKTtcbiAgICByZXR1cm4gdGVtcGxhdGU7XG4gIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2VtYWlscy5wYXJzZVRlbXBsYXRlLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIF9yZXBsYWNlUGxhY2Vob2xkZXIodGVtcGxhdGUsIF9tYXRjaCwgcmVwbGFjZSkge1xuICB2YXIgcmVwID0gcmVwbGFjZTtcbiAgaWYocmVwbGFjZSA9PT0gdW5kZWZpbmVkKSByZXAgPSBcIlwiO1xuICByZXR1cm4gdGVtcGxhdGUuc3Vic3RyaW5nKDAsIF9tYXRjaC5pbmRleCkrcmVwK3RlbXBsYXRlLnN1YnN0cmluZyhfbWF0Y2guaW5kZXgrX21hdGNoWzBdLmxlbmd0aCk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHBhcnNlVGVtcGxhdGU7XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcbmltcG9ydCB7bG9nQ29uZmlybX0gZnJvbSBcIi4uLy4uLy4uL3N0YXJ0dXAvc2VydmVyL2xvZy1jb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBET0lfTUFJTF9ERUZBVUxUX0VNQUlMX0ZST00gfSBmcm9tICcuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9lbWFpbC1jb25maWd1cmF0aW9uLmpzJztcblxuY29uc3QgU2VuZE1haWxTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgZnJvbToge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICByZWdFeDogU2ltcGxlU2NoZW1hLlJlZ0V4LkVtYWlsXG4gIH0sXG4gIHRvOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIHJlZ0V4OiBTaW1wbGVTY2hlbWEuUmVnRXguRW1haWxcbiAgfSxcbiAgc3ViamVjdDoge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgfSxcbiAgbWVzc2FnZToge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgfSxcbiAgcmV0dXJuUGF0aDoge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICByZWdFeDogU2ltcGxlU2NoZW1hLlJlZ0V4LkVtYWlsXG4gIH1cbn0pO1xuXG5jb25zdCBzZW5kTWFpbCA9IChtYWlsKSA9PiB7XG4gIHRyeSB7XG5cbiAgICBtYWlsLmZyb20gPSBET0lfTUFJTF9ERUZBVUxUX0VNQUlMX0ZST007XG5cbiAgICBjb25zdCBvdXJNYWlsID0gbWFpbDtcbiAgICBsb2dDb25maXJtKCdzZW5kaW5nIGVtYWlsIHdpdGggZGF0YTonLHt0bzptYWlsLnRvLCBzdWJqZWN0Om1haWwuc3ViamVjdH0pO1xuICAgIFNlbmRNYWlsU2NoZW1hLnZhbGlkYXRlKG91ck1haWwpO1xuICAgIC8vVE9ETzogVGV4dCBmYWxsYmFja1xuICAgIEVtYWlsLnNlbmQoe1xuICAgICAgZnJvbTogbWFpbC5mcm9tLFxuICAgICAgdG86IG1haWwudG8sXG4gICAgICBzdWJqZWN0OiBtYWlsLnN1YmplY3QsXG4gICAgICBodG1sOiBtYWlsLm1lc3NhZ2UsXG4gICAgICBoZWFkZXJzOiB7XG4gICAgICAgICdSZXR1cm4tUGF0aCc6IG1haWwucmV0dXJuUGF0aCxcbiAgICAgIH1cbiAgICB9KTtcblxuICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlbWFpbHMuc2VuZC5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBzZW5kTWFpbDtcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IHsgSm9iIH0gZnJvbSAnbWV0ZW9yL3ZzaXZzaTpqb2ItY29sbGVjdGlvbic7XG5pbXBvcnQgeyBCbG9ja2NoYWluSm9icyB9IGZyb20gJy4uLy4uLy4uLy4uL3NlcnZlci9hcGkvYmxvY2tjaGFpbl9qb2JzLmpzJztcblxuY29uc3QgYWRkQ2hlY2tOZXdUcmFuc2FjdGlvbnNCbG9ja2NoYWluSm9iID0gKCkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IGpvYiA9IG5ldyBKb2IoQmxvY2tjaGFpbkpvYnMsICdjaGVja05ld1RyYW5zYWN0aW9uJywge30pO1xuICAgIGpvYi5yZXRyeSh7cmV0cmllczogNjAsIHdhaXQ6IDE1KjEwMDAgfSkuc2F2ZSh7Y2FuY2VsUmVwZWF0czogdHJ1ZX0pO1xuICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdqb2JzLmFkZENoZWNrTmV3VHJhbnNhY3Rpb25zQmxvY2tjaGFpbi5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBhZGRDaGVja05ld1RyYW5zYWN0aW9uc0Jsb2NrY2hhaW5Kb2I7XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcbmltcG9ydCB7IEpvYiB9IGZyb20gJ21ldGVvci92c2l2c2k6am9iLWNvbGxlY3Rpb24nO1xuaW1wb3J0IHsgREFwcEpvYnMgfSBmcm9tICcuLi8uLi8uLi8uLi9zZXJ2ZXIvYXBpL2RhcHBfam9icy5qcyc7XG5cbmNvbnN0IEFkZEZldGNoRG9pTWFpbERhdGFKb2JTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgbmFtZToge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9LFxuICBkb21haW46IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfVxufSk7XG5cbmNvbnN0IGFkZEZldGNoRG9pTWFpbERhdGFKb2IgPSAoZGF0YSkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IG91ckRhdGEgPSBkYXRhO1xuICAgIEFkZEZldGNoRG9pTWFpbERhdGFKb2JTY2hlbWEudmFsaWRhdGUob3VyRGF0YSk7XG4gICAgY29uc3Qgam9iID0gbmV3IEpvYihEQXBwSm9icywgJ2ZldGNoRG9pTWFpbERhdGEnLCBvdXJEYXRhKTtcbiAgICBqb2IucmV0cnkoe3JldHJpZXM6IDUsIHdhaXQ6IDEqMTAqMTAwMCB9KS5zYXZlKCk7IC8vY2hlY2sgZXZlcnkgMTAgc2VjcyA1IHRpbWVzXG4gIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2pvYnMuYWRkRmV0Y2hEb2lNYWlsRGF0YS5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBhZGRGZXRjaERvaU1haWxEYXRhSm9iO1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgeyBKb2IgfSBmcm9tICdtZXRlb3IvdnNpdnNpOmpvYi1jb2xsZWN0aW9uJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcbmltcG9ydCB7IEJsb2NrY2hhaW5Kb2JzIH0gZnJvbSAnLi4vLi4vLi4vLi4vc2VydmVyL2FwaS9ibG9ja2NoYWluX2pvYnMuanMnO1xuXG5jb25zdCBBZGRJbnNlcnRCbG9ja2NoYWluSm9iU2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIG5hbWVJZDoge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9LFxuICBzaWduYXR1cmU6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfSxcbiAgZGF0YUhhc2g6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgb3B0aW9uYWw6dHJ1ZVxuICB9LFxuICBkb21haW46IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfSxcbiAgc29pRGF0ZToge1xuICAgIHR5cGU6IERhdGVcbiAgfVxufSk7XG5cbmNvbnN0IGFkZEluc2VydEJsb2NrY2hhaW5Kb2IgPSAoZW50cnkpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBvdXJFbnRyeSA9IGVudHJ5O1xuICAgIEFkZEluc2VydEJsb2NrY2hhaW5Kb2JTY2hlbWEudmFsaWRhdGUob3VyRW50cnkpO1xuICAgIGNvbnN0IGpvYiA9IG5ldyBKb2IoQmxvY2tjaGFpbkpvYnMsICdpbnNlcnQnLCBvdXJFbnRyeSk7XG4gICAgam9iLnJldHJ5KHtyZXRyaWVzOiAxMCwgd2FpdDogMyo2MCoxMDAwIH0pLnNhdmUoKTsgLy9jaGVjayBldmVyeSAxMHNlYyBmb3IgMWhcbiAgfSBjYXRjaCAoZXhjZXB0aW9uKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignam9icy5hZGRJbnNlcnRCbG9ja2NoYWluLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGFkZEluc2VydEJsb2NrY2hhaW5Kb2I7XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCB7IEpvYiB9IGZyb20gJ21ldGVvci92c2l2c2k6am9iLWNvbGxlY3Rpb24nO1xuaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tICdzaW1wbC1zY2hlbWEnO1xuaW1wb3J0IHsgTWFpbEpvYnMgfSBmcm9tICcuLi8uLi8uLi8uLi9zZXJ2ZXIvYXBpL21haWxfam9icy5qcyc7XG5cbmNvbnN0IEFkZFNlbmRNYWlsSm9iU2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIC8qZnJvbToge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICByZWdFeDogU2ltcGxlU2NoZW1hLlJlZ0V4LkVtYWlsXG4gIH0sKi9cbiAgdG86IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgcmVnRXg6IFNpbXBsZVNjaGVtYS5SZWdFeC5FbWFpbFxuICB9LFxuICBzdWJqZWN0OiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICB9LFxuICBtZXNzYWdlOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICB9LFxuICByZXR1cm5QYXRoOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIHJlZ0V4OiBTaW1wbGVTY2hlbWEuUmVnRXguRW1haWxcbiAgfVxufSk7XG5cbmNvbnN0IGFkZFNlbmRNYWlsSm9iID0gKG1haWwpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBvdXJNYWlsID0gbWFpbDtcbiAgICBBZGRTZW5kTWFpbEpvYlNjaGVtYS52YWxpZGF0ZShvdXJNYWlsKTtcbiAgICBjb25zdCBqb2IgPSBuZXcgSm9iKE1haWxKb2JzLCAnc2VuZCcsIG91ck1haWwpO1xuICAgIGpvYi5yZXRyeSh7cmV0cmllczogNSwgd2FpdDogNjAqMTAwMCB9KS5zYXZlKCk7XG4gIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2pvYnMuYWRkU2VuZE1haWwuZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgYWRkU2VuZE1haWxKb2I7XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcbmltcG9ydCB7IEpvYiB9IGZyb20gJ21ldGVvci92c2l2c2k6am9iLWNvbGxlY3Rpb24nO1xuaW1wb3J0IHsgQmxvY2tjaGFpbkpvYnMgfSBmcm9tICcuLi8uLi8uLi8uLi9zZXJ2ZXIvYXBpL2Jsb2NrY2hhaW5fam9icy5qcyc7XG5cbmNvbnN0IEFkZFVwZGF0ZUJsb2NrY2hhaW5Kb2JTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgbmFtZUlkOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH0sXG4gIHZhbHVlOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH0sXG4gIGZyb21Ib3N0VXJsOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH0sXG4gIGhvc3Q6IHtcbiAgICAgIHR5cGU6IFN0cmluZ1xuICB9XG59KTtcblxuY29uc3QgYWRkVXBkYXRlQmxvY2tjaGFpbkpvYiA9IChlbnRyeSkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IG91ckVudHJ5ID0gZW50cnk7XG4gICAgQWRkVXBkYXRlQmxvY2tjaGFpbkpvYlNjaGVtYS52YWxpZGF0ZShvdXJFbnRyeSk7XG4gICAgY29uc3Qgam9iID0gbmV3IEpvYihCbG9ja2NoYWluSm9icywgJ3VwZGF0ZScsIG91ckVudHJ5KTtcbiAgICBqb2IucmV0cnkoe3JldHJpZXM6IDM2MCwgd2FpdDogMSoxMCoxMDAwIH0pLnNhdmUoKTtcbiAgfSBjYXRjaCAoZXhjZXB0aW9uKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignam9icy5hZGRVcGRhdGVCbG9ja2NoYWluLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGFkZFVwZGF0ZUJsb2NrY2hhaW5Kb2I7XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCBpMThuIGZyb20gJ21ldGVvci91bml2ZXJzZTppMThuJztcblxuLy8gdW5pdmVyc2U6aTE4biBvbmx5IGJ1bmRsZXMgdGhlIGRlZmF1bHQgbGFuZ3VhZ2Ugb24gdGhlIGNsaWVudCBzaWRlLlxuLy8gVG8gZ2V0IGEgbGlzdCBvZiBhbGwgYXZpYWxibGUgbGFuZ3VhZ2VzIHdpdGggYXQgbGVhc3Qgb25lIHRyYW5zbGF0aW9uLFxuLy8gaTE4bi5nZXRMYW5ndWFnZXMoKSBtdXN0IGJlIGNhbGxlZCBzZXJ2ZXIgc2lkZS5cbmNvbnN0IGdldExhbmd1YWdlcyA9ICgpID0+IHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gaTE4bi5nZXRMYW5ndWFnZXMoKTtcbiAgfSBjYXRjaCAoZXhjZXB0aW9uKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignbGFuZ3VhZ2VzLmdldC5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBnZXRMYW5ndWFnZXM7XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcbmltcG9ydCB7IE1ldGEgfSBmcm9tICcuLi8uLi8uLi9hcGkvbWV0YS9tZXRhLmpzJztcblxuY29uc3QgQWRkT3JVcGRhdGVNZXRhU2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIGtleToge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9LFxuICB2YWx1ZToge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9XG59KTtcblxuY29uc3QgYWRkT3JVcGRhdGVNZXRhID0gKGRhdGEpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBvdXJEYXRhID0gZGF0YTtcbiAgICBBZGRPclVwZGF0ZU1ldGFTY2hlbWEudmFsaWRhdGUob3VyRGF0YSk7XG4gICAgY29uc3QgbWV0YSA9IE1ldGEuZmluZE9uZSh7a2V5OiBvdXJEYXRhLmtleX0pO1xuICAgIGlmKG1ldGEgIT09IHVuZGVmaW5lZCkgTWV0YS51cGRhdGUoe19pZCA6IG1ldGEuX2lkfSwgeyRzZXQ6IHtcbiAgICAgIHZhbHVlOiBvdXJEYXRhLnZhbHVlXG4gICAgfX0pO1xuICAgIGVsc2UgcmV0dXJuIE1ldGEuaW5zZXJ0KHtcbiAgICAgIGtleTogb3VyRGF0YS5rZXksXG4gICAgICB2YWx1ZTogb3VyRGF0YS52YWx1ZVxuICAgIH0pXG4gIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ21ldGEuYWRkT3JVcGRhdGUuZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgYWRkT3JVcGRhdGVNZXRhO1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XG5pbXBvcnQgeyBPcHRJbnMgfSBmcm9tICcuLi8uLi8uLi9hcGkvb3B0LWlucy9vcHQtaW5zLmpzJztcblxuY29uc3QgQWRkT3B0SW5TY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgbmFtZToge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9XG59KTtcblxuY29uc3QgYWRkT3B0SW4gPSAob3B0SW4pID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBvdXJPcHRJbiA9IG9wdEluO1xuICAgIEFkZE9wdEluU2NoZW1hLnZhbGlkYXRlKG91ck9wdEluKTtcbiAgICBjb25zdCBvcHRJbnMgPSBPcHRJbnMuZmluZCh7bmFtZUlkOiBvdXJPcHRJbi5uYW1lfSkuZmV0Y2goKTtcbiAgICBpZihvcHRJbnMubGVuZ3RoID4gMCkgcmV0dXJuIG9wdEluc1swXS5faWQ7XG4gICAgY29uc3Qgb3B0SW5JZCA9IE9wdElucy5pbnNlcnQoe1xuICAgICAgbmFtZUlkOiBvdXJPcHRJbi5uYW1lXG4gICAgfSk7XG4gICAgcmV0dXJuIG9wdEluSWQ7XG4gIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ29wdC1pbnMuYWRkLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGFkZE9wdEluO1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XG5pbXBvcnQgYWRkUmVjaXBpZW50IGZyb20gJy4uL3JlY2lwaWVudHMvYWRkLmpzJztcbmltcG9ydCBhZGRTZW5kZXIgZnJvbSAnLi4vc2VuZGVycy9hZGQuanMnO1xuaW1wb3J0IHsgT3B0SW5zIH0gZnJvbSAnLi4vLi4vLi4vYXBpL29wdC1pbnMvb3B0LWlucy5qcyc7XG5pbXBvcnQgd3JpdGVUb0Jsb2NrY2hhaW4gZnJvbSAnLi4vZG9pY2hhaW4vd3JpdGVfdG9fYmxvY2tjaGFpbi5qcyc7XG5pbXBvcnQge2xvZ0Vycm9yLCBsb2dTZW5kfSBmcm9tIFwiLi4vLi4vLi4vc3RhcnR1cC9zZXJ2ZXIvbG9nLWNvbmZpZ3VyYXRpb25cIjtcblxuXG5jb25zdCBBZGRPcHRJblNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICByZWNpcGllbnRfbWFpbDoge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICByZWdFeDogU2ltcGxlU2NoZW1hLlJlZ0V4LkVtYWlsXG4gIH0sXG4gIHNlbmRlcl9tYWlsOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIHJlZ0V4OiBTaW1wbGVTY2hlbWEuUmVnRXguRW1haWxcbiAgfSxcbiAgZGF0YToge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICBvcHRpb25hbDogdHJ1ZVxuICB9LFxuICBtYXN0ZXJfZG9pOiB7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICBvcHRpb25hbDogdHJ1ZVxuICB9LFxuICBpbmRleDoge1xuICAgICAgdHlwZTogU2ltcGxlU2NoZW1hLkludGVnZXIsXG4gICAgICBvcHRpb25hbDogdHJ1ZVxuICB9LFxuICBvd25lcklkOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIHJlZ0V4OiBTaW1wbGVTY2hlbWEuUmVnRXguaWRcbiAgfVxufSk7XG5cbmNvbnN0IGFkZE9wdEluID0gKG9wdEluKSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3Qgb3VyT3B0SW4gPSBvcHRJbjtcbiAgICBBZGRPcHRJblNjaGVtYS52YWxpZGF0ZShvdXJPcHRJbik7XG5cbiAgICBjb25zdCByZWNpcGllbnQgPSB7XG4gICAgICBlbWFpbDogb3VyT3B0SW4ucmVjaXBpZW50X21haWxcbiAgICB9XG4gICAgY29uc3QgcmVjaXBpZW50SWQgPSBhZGRSZWNpcGllbnQocmVjaXBpZW50KTtcbiAgICBjb25zdCBzZW5kZXIgPSB7XG4gICAgICBlbWFpbDogb3VyT3B0SW4uc2VuZGVyX21haWxcbiAgICB9XG4gICAgY29uc3Qgc2VuZGVySWQgPSBhZGRTZW5kZXIoc2VuZGVyKTtcbiAgICBcbiAgICBjb25zdCBvcHRJbnMgPSBPcHRJbnMuZmluZCh7cmVjaXBpZW50OiByZWNpcGllbnRJZCwgc2VuZGVyOiBzZW5kZXJJZH0pLmZldGNoKCk7XG4gICAgaWYob3B0SW5zLmxlbmd0aCA+IDApIHJldHVybiBvcHRJbnNbMF0uX2lkOyAvL1RPRE8gd2hlbiBTT0kgYWxyZWFkeSBleGlzdHMgcmVzZW5kIGVtYWlsP1xuXG4gICAgaWYob3VyT3B0SW4uZGF0YSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0cnkge1xuICAgICAgICBKU09OLnBhcnNlKG91ck9wdEluLmRhdGEpO1xuICAgICAgfSBjYXRjaChlcnJvcikge1xuICAgICAgICBsb2dFcnJvcihcIm91ck9wdEluLmRhdGE6XCIsb3VyT3B0SW4uZGF0YSk7XG4gICAgICAgIHRocm93IFwiSW52YWxpZCBkYXRhIGpzb24gXCI7XG4gICAgICB9XG4gICAgfVxuICAgIFxuICAgIGNvbnN0IG9wdEluSWQgPSBPcHRJbnMuaW5zZXJ0KHtcbiAgICAgIHJlY2lwaWVudDogcmVjaXBpZW50SWQsXG4gICAgICBzZW5kZXI6IHNlbmRlcklkLFxuICAgICAgaW5kZXg6IG91ck9wdEluLmluZGV4LFxuICAgICAgbWFzdGVyRG9pIDogb3VyT3B0SW4ubWFzdGVyX2RvaSxcbiAgICAgIGRhdGE6IG91ck9wdEluLmRhdGEsXG4gICAgICBvd25lcklkOiBvdXJPcHRJbi5vd25lcklkXG4gICAgfSk7XG4gICAgbG9nU2VuZChcIm9wdEluIChpbmRleDpcIitvdXJPcHRJbi5pbmRleCtcIiBhZGRlZCB0byBsb2NhbCBkYiB3aXRoIG9wdEluSWRcIixvcHRJbklkKTtcblxuICAgIHdyaXRlVG9CbG9ja2NoYWluKHtpZDogb3B0SW5JZH0pO1xuICAgIHJldHVybiBvcHRJbklkO1xuICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdvcHQtaW5zLmFkZEFuZFdyaXRlVG9CbG9ja2NoYWluLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGFkZE9wdEluO1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XG5pbXBvcnQgeyBDT05GSVJNX0NMSUVOVCwgQ09ORklSTV9BRERSRVNTIH0gZnJvbSAnLi4vLi4vLi4vc3RhcnR1cC9zZXJ2ZXIvZG9pY2hhaW4tY29uZmlndXJhdGlvbi5qcyc7XG5pbXBvcnQgeyBPcHRJbnMgfSBmcm9tICcuLi8uLi8uLi9hcGkvb3B0LWlucy9vcHQtaW5zLmpzJztcbmltcG9ydCB7IERvaWNoYWluRW50cmllcyB9IGZyb20gJy4uLy4uLy4uL2FwaS9kb2ljaGFpbi9lbnRyaWVzLmpzJztcbmltcG9ydCBkZWNvZGVEb2lIYXNoIGZyb20gJy4uL2VtYWlscy9kZWNvZGVfZG9pLWhhc2guanMnO1xuaW1wb3J0IHsgc2lnbk1lc3NhZ2UgfSBmcm9tICcuLi8uLi8uLi8uLi9zZXJ2ZXIvYXBpL2RvaWNoYWluLmpzJztcbmltcG9ydCBhZGRVcGRhdGVCbG9ja2NoYWluSm9iIGZyb20gJy4uL2pvYnMvYWRkX3VwZGF0ZV9ibG9ja2NoYWluLmpzJztcbmltcG9ydCB7bG9nQ29uZmlybX0gZnJvbSBcIi4uLy4uLy4uL3N0YXJ0dXAvc2VydmVyL2xvZy1jb25maWd1cmF0aW9uXCI7XG5cbmNvbnN0IENvbmZpcm1PcHRJblNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICBob3N0OiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH0sXG4gIGhhc2g6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfVxufSk7XG5cbmNvbnN0IGNvbmZpcm1PcHRJbiA9IChyZXF1ZXN0KSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3Qgb3VyUmVxdWVzdCA9IHJlcXVlc3Q7XG4gICAgQ29uZmlybU9wdEluU2NoZW1hLnZhbGlkYXRlKG91clJlcXVlc3QpO1xuICAgIGNvbnN0IGRlY29kZWQgPSBkZWNvZGVEb2lIYXNoKHtoYXNoOiByZXF1ZXN0Lmhhc2h9KTtcbiAgICBjb25zdCBvcHRJbiA9IE9wdElucy5maW5kT25lKHtfaWQ6IGRlY29kZWQuaWR9KTtcbiAgICBpZihvcHRJbiA9PT0gdW5kZWZpbmVkIHx8IG9wdEluLmNvbmZpcm1hdGlvblRva2VuICE9PSBkZWNvZGVkLnRva2VuKSB0aHJvdyBcIkludmFsaWQgaGFzaFwiO1xuICAgIGNvbnN0IGNvbmZpcm1lZEF0ID0gbmV3IERhdGUoKTtcblxuICAgIE9wdElucy51cGRhdGUoe19pZCA6IG9wdEluLl9pZH0seyRzZXQ6e2NvbmZpcm1lZEF0OiBjb25maXJtZWRBdCwgY29uZmlybWVkQnk6IG91clJlcXVlc3QuaG9zdH0sICR1bnNldDoge2NvbmZpcm1hdGlvblRva2VuOiBcIlwifX0pO1xuXG4gICAgLy9UT0RPIGhlcmUgZmluZCBhbGwgRG9pY2hhaW5FbnRyaWVzIGluIHRoZSBsb2NhbCBkYXRhYmFzZSAgYW5kIGJsb2NrY2hhaW4gd2l0aCB0aGUgc2FtZSBtYXN0ZXJEb2lcbiAgICBjb25zdCBlbnRyaWVzID0gRG9pY2hhaW5FbnRyaWVzLmZpbmQoeyRvcjogW3tuYW1lOiBvcHRJbi5uYW1lSWR9LCB7bWFzdGVyRG9pOiBvcHRJbi5uYW1lSWR9XX0pO1xuICAgIGlmKGVudHJpZXMgPT09IHVuZGVmaW5lZCkgdGhyb3cgXCJEb2ljaGFpbiBlbnRyeS9lbnRyaWVzIG5vdCBmb3VuZFwiO1xuXG4gICAgZW50cmllcy5mb3JFYWNoKGVudHJ5ID0+IHtcbiAgICAgICAgbG9nQ29uZmlybSgnY29uZmlybWluZyBEb2lDaGFpbkVudHJ5OicsZW50cnkpO1xuXG4gICAgICAgIGNvbnN0IHZhbHVlID0gSlNPTi5wYXJzZShlbnRyeS52YWx1ZSk7XG4gICAgICAgIGxvZ0NvbmZpcm0oJ2dldFNpZ25hdHVyZSAob25seSBvZiB2YWx1ZSEpJywgdmFsdWUpO1xuXG4gICAgICAgIGNvbnN0IGRvaVNpZ25hdHVyZSA9IHNpZ25NZXNzYWdlKENPTkZJUk1fQ0xJRU5ULCBDT05GSVJNX0FERFJFU1MsIHZhbHVlLnNpZ25hdHVyZSk7XG4gICAgICAgIGxvZ0NvbmZpcm0oJ2dvdCBkb2lTaWduYXR1cmU6Jyxkb2lTaWduYXR1cmUpO1xuICAgICAgICBjb25zdCBmcm9tSG9zdFVybCA9IHZhbHVlLmZyb207XG5cbiAgICAgICAgZGVsZXRlIHZhbHVlLmZyb207XG4gICAgICAgIHZhbHVlLmRvaVRpbWVzdGFtcCA9IGNvbmZpcm1lZEF0LnRvSVNPU3RyaW5nKCk7XG4gICAgICAgIHZhbHVlLmRvaVNpZ25hdHVyZSA9IGRvaVNpZ25hdHVyZTtcbiAgICAgICAgY29uc3QganNvblZhbHVlID0gSlNPTi5zdHJpbmdpZnkodmFsdWUpO1xuICAgICAgICBsb2dDb25maXJtKCd1cGRhdGluZyBEb2ljaGFpbiBuYW1lSWQ6JytvcHRJbi5uYW1lSWQrJyB3aXRoIHZhbHVlOicsanNvblZhbHVlKTtcblxuICAgICAgICBhZGRVcGRhdGVCbG9ja2NoYWluSm9iKHtcbiAgICAgICAgICAgIG5hbWVJZDogZW50cnkubmFtZSxcbiAgICAgICAgICAgIHZhbHVlOiBqc29uVmFsdWUsXG4gICAgICAgICAgICBmcm9tSG9zdFVybDogZnJvbUhvc3RVcmwsXG4gICAgICAgICAgICBob3N0OiBvdXJSZXF1ZXN0Lmhvc3RcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gICAgbG9nQ29uZmlybSgncmVkaXJlY3RpbmcgdXNlciB0bzonLGRlY29kZWQucmVkaXJlY3QpO1xuICAgIHJldHVybiBkZWNvZGVkLnJlZGlyZWN0O1xuICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdvcHQtaW5zLmNvbmZpcm0uZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgY29uZmlybU9wdEluXG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcbmltcG9ydCB7IHJhbmRvbUJ5dGVzIH0gZnJvbSAnY3J5cHRvJztcbmltcG9ydCB7IE9wdElucyB9IGZyb20gJy4uLy4uLy4uL2FwaS9vcHQtaW5zL29wdC1pbnMuanMnO1xuXG5jb25zdCBHZW5lcmF0ZURvaVRva2VuU2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIGlkOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH1cbn0pO1xuXG5jb25zdCBnZW5lcmF0ZURvaVRva2VuID0gKG9wdEluKSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3Qgb3VyT3B0SW4gPSBvcHRJbjtcbiAgICBHZW5lcmF0ZURvaVRva2VuU2NoZW1hLnZhbGlkYXRlKG91ck9wdEluKTtcbiAgICBjb25zdCB0b2tlbiA9IHJhbmRvbUJ5dGVzKDMyKS50b1N0cmluZygnaGV4Jyk7XG4gICAgT3B0SW5zLnVwZGF0ZSh7X2lkIDogb3VyT3B0SW4uaWR9LHskc2V0Ontjb25maXJtYXRpb25Ub2tlbjogdG9rZW59fSk7XG4gICAgcmV0dXJuIHRva2VuO1xuICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdvcHQtaW5zLmdlbmVyYXRlX2RvaS10b2tlbi5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBnZW5lcmF0ZURvaVRva2VuXG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcbmltcG9ydCB7IE9wdElucyB9IGZyb20gJy4uLy4uLy4uL2FwaS9vcHQtaW5zL29wdC1pbnMuanMnO1xuaW1wb3J0IHsgUmVjaXBpZW50cyB9IGZyb20gJy4uLy4uLy4uL2FwaS9yZWNpcGllbnRzL3JlY2lwaWVudHMuanMnO1xuaW1wb3J0IHZlcmlmeVNpZ25hdHVyZSBmcm9tICcuLi9kb2ljaGFpbi92ZXJpZnlfc2lnbmF0dXJlLmpzJztcbmltcG9ydCB7bG9nU2VuZH0gZnJvbSBcIi4uLy4uLy4uL3N0YXJ0dXAvc2VydmVyL2xvZy1jb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgZ2V0UHVibGljS2V5QW5kQWRkcmVzcyBmcm9tIFwiLi4vZG9pY2hhaW4vZ2V0X3B1YmxpY2tleV9hbmRfYWRkcmVzc19ieV9kb21haW5cIjtcblxuY29uc3QgVXBkYXRlT3B0SW5TdGF0dXNTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgbmFtZUlkOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH0sXG4gIHNpZ25hdHVyZToge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9LFxuICBob3N0OiB7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICBvcHRpb25hbDogdHJ1ZVxuICB9XG59KTtcblxuXG5jb25zdCB1cGRhdGVPcHRJblN0YXR1cyA9IChkYXRhKSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3Qgb3VyRGF0YSA9IGRhdGE7XG4gICAgbG9nU2VuZCgnY29uZmlybSBkQXBwIGNvbmZpcm1zIG9wdEluOicsSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xuICAgIFVwZGF0ZU9wdEluU3RhdHVzU2NoZW1hLnZhbGlkYXRlKG91ckRhdGEpO1xuICAgIGNvbnN0IG9wdEluID0gT3B0SW5zLmZpbmRPbmUoe25hbWVJZDogb3VyRGF0YS5uYW1lSWR9KTtcbiAgICBpZihvcHRJbiA9PT0gdW5kZWZpbmVkKSB0aHJvdyBcIk9wdC1JbiBub3QgZm91bmRcIjtcbiAgICBsb2dTZW5kKCdjb25maXJtIGRBcHAgY29uZmlybXMgb3B0SW46JyxvdXJEYXRhLm5hbWVJZCk7XG5cbiAgICBjb25zdCByZWNpcGllbnQgPSBSZWNpcGllbnRzLmZpbmRPbmUoe19pZDogb3B0SW4ucmVjaXBpZW50fSk7XG4gICAgaWYocmVjaXBpZW50ID09PSB1bmRlZmluZWQpIHRocm93IFwiUmVjaXBpZW50IG5vdCBmb3VuZFwiO1xuICAgIGNvbnN0IHBhcnRzID0gcmVjaXBpZW50LmVtYWlsLnNwbGl0KFwiQFwiKTtcbiAgICBjb25zdCBkb21haW4gPSBwYXJ0c1twYXJ0cy5sZW5ndGgtMV07XG4gICAgY29uc3QgcHVibGljS2V5QW5kQWRkcmVzcyA9IGdldFB1YmxpY0tleUFuZEFkZHJlc3Moe2RvbWFpbjpkb21haW59KTtcblxuICAgIC8vVE9ETyBnZXR0aW5nIGluZm9ybWF0aW9uIGZyb20gQm9iIHRoYXQgYSBjZXJ0YWluIG5hbWVJZCAoRE9JKSBnb3QgY29uZmlybWVkLlxuICAgIGlmKCF2ZXJpZnlTaWduYXR1cmUoe3B1YmxpY0tleTogcHVibGljS2V5QW5kQWRkcmVzcy5wdWJsaWNLZXksIGRhdGE6IG91ckRhdGEubmFtZUlkLCBzaWduYXR1cmU6IG91ckRhdGEuc2lnbmF0dXJlfSkpIHtcbiAgICAgIHRocm93IFwiQWNjZXNzIGRlbmllZFwiO1xuICAgIH1cbiAgICBsb2dTZW5kKCdzaWduYXR1cmUgdmFsaWQgZm9yIHB1YmxpY0tleScsIHB1YmxpY0tleUFuZEFkZHJlc3MucHVibGljS2V5KTtcblxuICAgIE9wdElucy51cGRhdGUoe19pZCA6IG9wdEluLl9pZH0seyRzZXQ6e2NvbmZpcm1lZEF0OiBuZXcgRGF0ZSgpLCBjb25maXJtZWRCeTogb3VyRGF0YS5ob3N0fX0pO1xuICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdkYXBwcy5zZW5kLnVwZGF0ZU9wdEluU3RhdHVzLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IHVwZGF0ZU9wdEluU3RhdHVzO1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XG5pbXBvcnQgeyBWRVJJRllfQ0xJRU5UIH0gZnJvbSAnLi4vLi4vLi4vc3RhcnR1cC9zZXJ2ZXIvZG9pY2hhaW4tY29uZmlndXJhdGlvbi5qcyc7XG5pbXBvcnQgeyBuYW1lU2hvdyB9IGZyb20gJy4uLy4uLy4uLy4uL3NlcnZlci9hcGkvZG9pY2hhaW4uanMnO1xuaW1wb3J0IGdldE9wdEluUHJvdmlkZXIgZnJvbSAnLi4vZG5zL2dldF9vcHQtaW4tcHJvdmlkZXIuanMnO1xuaW1wb3J0IGdldE9wdEluS2V5IGZyb20gJy4uL2Rucy9nZXRfb3B0LWluLWtleS5qcyc7XG5pbXBvcnQgdmVyaWZ5U2lnbmF0dXJlIGZyb20gJy4uL2RvaWNoYWluL3ZlcmlmeV9zaWduYXR1cmUuanMnO1xuaW1wb3J0IHtsb2dWZXJpZnl9IGZyb20gXCIuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9sb2ctY29uZmlndXJhdGlvblwiO1xuaW1wb3J0IGdldFB1YmxpY0tleUFuZEFkZHJlc3MgZnJvbSBcIi4uL2RvaWNoYWluL2dldF9wdWJsaWNrZXlfYW5kX2FkZHJlc3NfYnlfZG9tYWluXCI7XG5cbmNvbnN0IFZlcmlmeU9wdEluU2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIHJlY2lwaWVudF9tYWlsOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIHJlZ0V4OiBTaW1wbGVTY2hlbWEuUmVnRXguRW1haWxcbiAgfSxcbiAgc2VuZGVyX21haWw6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgcmVnRXg6IFNpbXBsZVNjaGVtYS5SZWdFeC5FbWFpbFxuICB9LFxuICBuYW1lX2lkOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH0sXG4gIHJlY2lwaWVudF9wdWJsaWNfa2V5OiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH1cbn0pO1xuXG5jb25zdCB2ZXJpZnlPcHRJbiA9IChkYXRhKSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3Qgb3VyRGF0YSA9IGRhdGE7XG4gICAgVmVyaWZ5T3B0SW5TY2hlbWEudmFsaWRhdGUob3VyRGF0YSk7XG4gICAgY29uc3QgZW50cnkgPSBuYW1lU2hvdyhWRVJJRllfQ0xJRU5ULCBvdXJEYXRhLm5hbWVfaWQpO1xuICAgIGlmKGVudHJ5ID09PSB1bmRlZmluZWQpIHJldHVybiBmYWxzZTtcbiAgICBjb25zdCBlbnRyeURhdGEgPSBKU09OLnBhcnNlKGVudHJ5LnZhbHVlKTtcbiAgICBjb25zdCBmaXJzdENoZWNrID0gdmVyaWZ5U2lnbmF0dXJlKHtcbiAgICAgIGRhdGE6IG91ckRhdGEucmVjaXBpZW50X21haWwrb3VyRGF0YS5zZW5kZXJfbWFpbCxcbiAgICAgIHNpZ25hdHVyZTogZW50cnlEYXRhLnNpZ25hdHVyZSxcbiAgICAgIHB1YmxpY0tleTogb3VyRGF0YS5yZWNpcGllbnRfcHVibGljX2tleVxuICAgIH0pXG5cbiAgICBpZighZmlyc3RDaGVjaykgcmV0dXJuIHtmaXJzdENoZWNrOiBmYWxzZX07XG4gICAgY29uc3QgcGFydHMgPSBvdXJEYXRhLnJlY2lwaWVudF9tYWlsLnNwbGl0KFwiQFwiKTsgLy9UT0RPIHB1dCB0aGlzIGludG8gZ2V0UHVibGljS2V5QW5kQWRkcmVzc1xuICAgIGNvbnN0IGRvbWFpbiA9IHBhcnRzW3BhcnRzLmxlbmd0aC0xXTtcbiAgICBjb25zdCBwdWJsaWNLZXlBbmRBZGRyZXNzID0gZ2V0UHVibGljS2V5QW5kQWRkcmVzcyh7ZG9tYWluOiBkb21haW59KTtcblxuICAgIGNvbnN0IHNlY29uZENoZWNrID0gdmVyaWZ5U2lnbmF0dXJlKHtcbiAgICAgIGRhdGE6IGVudHJ5RGF0YS5zaWduYXR1cmUsXG4gICAgICBzaWduYXR1cmU6IGVudHJ5RGF0YS5kb2lTaWduYXR1cmUsXG4gICAgICBwdWJsaWNLZXk6IHB1YmxpY0tleUFuZEFkZHJlc3MucHVibGljS2V5XG4gICAgfSlcblxuICAgIGlmKCFzZWNvbmRDaGVjaykgcmV0dXJuIHtzZWNvbmRDaGVjazogZmFsc2V9O1xuICAgIHJldHVybiB0cnVlO1xuICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdvcHQtaW5zLnZlcmlmeS5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCB2ZXJpZnlPcHRJblxuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XG5pbXBvcnQgeyBSZWNpcGllbnRzIH0gZnJvbSAnLi4vLi4vLi4vYXBpL3JlY2lwaWVudHMvcmVjaXBpZW50cy5qcyc7XG5pbXBvcnQgZ2V0S2V5UGFpciBmcm9tICcuLi9kb2ljaGFpbi9nZXRfa2V5LXBhaXIuanMnO1xuXG5jb25zdCBBZGRSZWNpcGllbnRTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgZW1haWw6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgcmVnRXg6IFNpbXBsZVNjaGVtYS5SZWdFeC5FbWFpbFxuICB9XG59KTtcblxuY29uc3QgYWRkUmVjaXBpZW50ID0gKHJlY2lwaWVudCkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IG91clJlY2lwaWVudCA9IHJlY2lwaWVudDtcbiAgICBBZGRSZWNpcGllbnRTY2hlbWEudmFsaWRhdGUob3VyUmVjaXBpZW50KTtcbiAgICBjb25zdCByZWNpcGllbnRzID0gUmVjaXBpZW50cy5maW5kKHtlbWFpbDogcmVjaXBpZW50LmVtYWlsfSkuZmV0Y2goKTtcbiAgICBpZihyZWNpcGllbnRzLmxlbmd0aCA+IDApIHJldHVybiByZWNpcGllbnRzWzBdLl9pZDtcbiAgICBjb25zdCBrZXlQYWlyID0gZ2V0S2V5UGFpcigpO1xuICAgIHJldHVybiBSZWNpcGllbnRzLmluc2VydCh7XG4gICAgICBlbWFpbDogb3VyUmVjaXBpZW50LmVtYWlsLFxuICAgICAgcHJpdmF0ZUtleToga2V5UGFpci5wcml2YXRlS2V5LFxuICAgICAgcHVibGljS2V5OiBrZXlQYWlyLnB1YmxpY0tleVxuICAgIH0pXG4gIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ3JlY2lwaWVudHMuYWRkLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGFkZFJlY2lwaWVudDtcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tICdzaW1wbC1zY2hlbWEnO1xuaW1wb3J0IHsgU2VuZGVycyB9IGZyb20gJy4uLy4uLy4uL2FwaS9zZW5kZXJzL3NlbmRlcnMuanMnO1xuXG5jb25zdCBBZGRTZW5kZXJTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgZW1haWw6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgcmVnRXg6IFNpbXBsZVNjaGVtYS5SZWdFeC5FbWFpbFxuICB9XG59KTtcblxuY29uc3QgYWRkU2VuZGVyID0gKHNlbmRlcikgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IG91clNlbmRlciA9IHNlbmRlcjtcbiAgICBBZGRTZW5kZXJTY2hlbWEudmFsaWRhdGUob3VyU2VuZGVyKTtcbiAgICBjb25zdCBzZW5kZXJzID0gU2VuZGVycy5maW5kKHtlbWFpbDogc2VuZGVyLmVtYWlsfSkuZmV0Y2goKTtcbiAgICBpZihzZW5kZXJzLmxlbmd0aCA+IDApIHJldHVybiBzZW5kZXJzWzBdLl9pZDtcbiAgICByZXR1cm4gU2VuZGVycy5pbnNlcnQoe1xuICAgICAgZW1haWw6IG91clNlbmRlci5lbWFpbFxuICAgIH0pXG4gIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ3NlbmRlcnMuYWRkLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGFkZFNlbmRlcjtcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuXG5leHBvcnQgZnVuY3Rpb24gaXNEZWJ1ZygpIHtcbiAgaWYoTWV0ZW9yLnNldHRpbmdzICE9PSB1bmRlZmluZWQgJiZcbiAgICAgTWV0ZW9yLnNldHRpbmdzLmFwcCAhPT0gdW5kZWZpbmVkICYmXG4gICAgIE1ldGVvci5zZXR0aW5ncy5hcHAuZGVidWcgIT09IHVuZGVmaW5lZCkgcmV0dXJuIE1ldGVvci5zZXR0aW5ncy5hcHAuZGVidWdcbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNSZWd0ZXN0KCkge1xuICBpZihNZXRlb3Iuc2V0dGluZ3MgIT09IHVuZGVmaW5lZCAmJlxuICAgICBNZXRlb3Iuc2V0dGluZ3MuYXBwICE9PSB1bmRlZmluZWQgJiZcbiAgICAgTWV0ZW9yLnNldHRpbmdzLmFwcC5yZWd0ZXN0ICE9PSB1bmRlZmluZWQpIHJldHVybiBNZXRlb3Iuc2V0dGluZ3MuYXBwLnJlZ3Rlc3RcbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNUZXN0bmV0KCkge1xuICAgIGlmKE1ldGVvci5zZXR0aW5ncyAhPT0gdW5kZWZpbmVkICYmXG4gICAgICAgIE1ldGVvci5zZXR0aW5ncy5hcHAgIT09IHVuZGVmaW5lZCAmJlxuICAgICAgICBNZXRlb3Iuc2V0dGluZ3MuYXBwLnRlc3RuZXQgIT09IHVuZGVmaW5lZCkgcmV0dXJuIE1ldGVvci5zZXR0aW5ncy5hcHAudGVzdG5ldFxuICAgIHJldHVybiBmYWxzZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFVybCgpIHtcbiAgaWYoTWV0ZW9yLnNldHRpbmdzICE9PSB1bmRlZmluZWQgJiZcbiAgICAgTWV0ZW9yLnNldHRpbmdzLmFwcCAhPT0gdW5kZWZpbmVkICYmXG4gICAgIE1ldGVvci5zZXR0aW5ncy5hcHAuaG9zdCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgbGV0IHBvcnQgPSAzMDAwO1xuICAgICAgIGlmKE1ldGVvci5zZXR0aW5ncy5hcHAucG9ydCAhPT0gdW5kZWZpbmVkKSBwb3J0ID0gTWV0ZW9yLnNldHRpbmdzLmFwcC5wb3J0XG4gICAgICAgcmV0dXJuIFwiaHR0cDovL1wiK01ldGVvci5zZXR0aW5ncy5hcHAuaG9zdCtcIjpcIitwb3J0K1wiL1wiO1xuICB9XG4gIHJldHVybiBNZXRlb3IuYWJzb2x1dGVVcmwoKTtcbn1cbiIsImV4cG9ydCBjb25zdCBGQUxMQkFDS19QUk9WSURFUiA9IFwiZG9pY2hhaW4ub3JnXCI7XG4iLCJpbXBvcnQgbmFtZWNvaW4gZnJvbSAnbmFtZWNvaW4nO1xuaW1wb3J0IHsgU0VORF9BUFAsIENPTkZJUk1fQVBQLCBWRVJJRllfQVBQLCBpc0FwcFR5cGUgfSBmcm9tICcuL3R5cGUtY29uZmlndXJhdGlvbi5qcyc7XG5cbnZhciBzZW5kU2V0dGluZ3MgPSBNZXRlb3Iuc2V0dGluZ3Muc2VuZDtcbnZhciBzZW5kQ2xpZW50ID0gdW5kZWZpbmVkO1xuaWYoaXNBcHBUeXBlKFNFTkRfQVBQKSkge1xuICBpZighc2VuZFNldHRpbmdzIHx8ICFzZW5kU2V0dGluZ3MuZG9pY2hhaW4pXG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcihcImNvbmZpZy5zZW5kLmRvaWNoYWluXCIsIFwiU2VuZCBhcHAgZG9pY2hhaW4gc2V0dGluZ3Mgbm90IGZvdW5kXCIpXG4gIHNlbmRDbGllbnQgPSBjcmVhdGVDbGllbnQoc2VuZFNldHRpbmdzLmRvaWNoYWluKTtcbn1cbmV4cG9ydCBjb25zdCBTRU5EX0NMSUVOVCA9IHNlbmRDbGllbnQ7XG5cbnZhciBjb25maXJtU2V0dGluZ3MgPSBNZXRlb3Iuc2V0dGluZ3MuY29uZmlybTtcbnZhciBjb25maXJtQ2xpZW50ID0gdW5kZWZpbmVkO1xudmFyIGNvbmZpcm1BZGRyZXNzID0gdW5kZWZpbmVkO1xuaWYoaXNBcHBUeXBlKENPTkZJUk1fQVBQKSkge1xuICBpZighY29uZmlybVNldHRpbmdzIHx8ICFjb25maXJtU2V0dGluZ3MuZG9pY2hhaW4pXG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcihcImNvbmZpZy5jb25maXJtLmRvaWNoYWluXCIsIFwiQ29uZmlybSBhcHAgZG9pY2hhaW4gc2V0dGluZ3Mgbm90IGZvdW5kXCIpXG4gIGNvbmZpcm1DbGllbnQgPSBjcmVhdGVDbGllbnQoY29uZmlybVNldHRpbmdzLmRvaWNoYWluKTtcbiAgY29uZmlybUFkZHJlc3MgPSBjb25maXJtU2V0dGluZ3MuZG9pY2hhaW4uYWRkcmVzcztcbn1cbmV4cG9ydCBjb25zdCBDT05GSVJNX0NMSUVOVCA9IGNvbmZpcm1DbGllbnQ7XG5leHBvcnQgY29uc3QgQ09ORklSTV9BRERSRVNTID0gY29uZmlybUFkZHJlc3M7XG5cbnZhciB2ZXJpZnlTZXR0aW5ncyA9IE1ldGVvci5zZXR0aW5ncy52ZXJpZnk7XG52YXIgdmVyaWZ5Q2xpZW50ID0gdW5kZWZpbmVkO1xuaWYoaXNBcHBUeXBlKFZFUklGWV9BUFApKSB7XG4gIGlmKCF2ZXJpZnlTZXR0aW5ncyB8fCAhdmVyaWZ5U2V0dGluZ3MuZG9pY2hhaW4pXG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcihcImNvbmZpZy52ZXJpZnkuZG9pY2hhaW5cIiwgXCJWZXJpZnkgYXBwIGRvaWNoYWluIHNldHRpbmdzIG5vdCBmb3VuZFwiKVxuICB2ZXJpZnlDbGllbnQgPSBjcmVhdGVDbGllbnQodmVyaWZ5U2V0dGluZ3MuZG9pY2hhaW4pO1xufVxuZXhwb3J0IGNvbnN0IFZFUklGWV9DTElFTlQgPSB2ZXJpZnlDbGllbnQ7XG5cbmZ1bmN0aW9uIGNyZWF0ZUNsaWVudChzZXR0aW5ncykge1xuICByZXR1cm4gbmV3IG5hbWVjb2luLkNsaWVudCh7XG4gICAgaG9zdDogc2V0dGluZ3MuaG9zdCxcbiAgICBwb3J0OiBzZXR0aW5ncy5wb3J0LFxuICAgIHVzZXI6IHNldHRpbmdzLnVzZXJuYW1lLFxuICAgIHBhc3M6IHNldHRpbmdzLnBhc3N3b3JkXG4gIH0pO1xufVxuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgeyBTRU5EX0FQUCwgQ09ORklSTV9BUFAsIGlzQXBwVHlwZSB9IGZyb20gJy4vdHlwZS1jb25maWd1cmF0aW9uLmpzJztcbmltcG9ydCBIYXNoaWRzIGZyb20gJ2hhc2hpZHMnO1xuLy9jb25zdCBIYXNoaWRzID0gcmVxdWlyZSgnaGFzaGlkcycpLmRlZmF1bHQ7XG5pbXBvcnQge2xvZ0NvbmZpcm19IGZyb20gXCIuL2xvZy1jb25maWd1cmF0aW9uXCI7XG5cbmV4cG9ydCBjb25zdCBIYXNoSWRzID0gbmV3IEhhc2hpZHMoJzB4dWdtTGU3TnllZTZ2azFpRjg4KDZDbXdwcW9HNGhRKi1UNzR0all3Xk8ydk9PKFhsLTkxd0E4Km5DZ19sWCQnKTtcblxudmFyIHNlbmRTZXR0aW5ncyA9IE1ldGVvci5zZXR0aW5ncy5zZW5kO1xudmFyIGRvaU1haWxGZXRjaFVybCA9IHVuZGVmaW5lZDtcblxuaWYoaXNBcHBUeXBlKFNFTkRfQVBQKSkge1xuICBpZighc2VuZFNldHRpbmdzIHx8ICFzZW5kU2V0dGluZ3MuZG9pTWFpbEZldGNoVXJsKVxuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoXCJjb25maWcuc2VuZC5lbWFpbFwiLCBcIlNldHRpbmdzIG5vdCBmb3VuZFwiKTtcbiAgZG9pTWFpbEZldGNoVXJsID0gc2VuZFNldHRpbmdzLmRvaU1haWxGZXRjaFVybDtcbn1cbmV4cG9ydCBjb25zdCBET0lfTUFJTF9GRVRDSF9VUkwgPSBkb2lNYWlsRmV0Y2hVcmw7XG5cbnZhciBkZWZhdWx0RnJvbSA9IHVuZGVmaW5lZDtcbmlmKGlzQXBwVHlwZShDT05GSVJNX0FQUCkpIHtcbiAgdmFyIGNvbmZpcm1TZXR0aW5ncyA9IE1ldGVvci5zZXR0aW5ncy5jb25maXJtO1xuXG4gIGlmKCFjb25maXJtU2V0dGluZ3MgfHwgIWNvbmZpcm1TZXR0aW5ncy5zbXRwKVxuICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFwiY29uZmlnLmNvbmZpcm0uc210cFwiLCBcIkNvbmZpcm0gYXBwIGVtYWlsIHNtdHAgc2V0dGluZ3Mgbm90IGZvdW5kXCIpXG5cbiAgaWYoIWNvbmZpcm1TZXR0aW5ncy5zbXRwLmRlZmF1bHRGcm9tKVxuICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFwiY29uZmlnLmNvbmZpcm0uZGVmYXVsdEZyb21cIiwgXCJDb25maXJtIGFwcCBlbWFpbCBkZWZhdWx0RnJvbSBub3QgZm91bmRcIilcblxuICBkZWZhdWx0RnJvbSAgPSAgY29uZmlybVNldHRpbmdzLnNtdHAuZGVmYXVsdEZyb207XG5cbiAgbG9nQ29uZmlybSgnc2VuZGluZyB3aXRoIGRlZmF1bHRGcm9tOicsZGVmYXVsdEZyb20pO1xuXG4gIE1ldGVvci5zdGFydHVwKCgpID0+IHtcblxuICAgaWYoY29uZmlybVNldHRpbmdzLnNtdHAudXNlcm5hbWUgPT09IHVuZGVmaW5lZCl7XG4gICAgICAgcHJvY2Vzcy5lbnYuTUFJTF9VUkwgPSAnc210cDovLycgK1xuICAgICAgICAgICBlbmNvZGVVUklDb21wb25lbnQoY29uZmlybVNldHRpbmdzLnNtdHAuc2VydmVyKSArXG4gICAgICAgICAgICc6JyArXG4gICAgICAgICAgIGNvbmZpcm1TZXR0aW5ncy5zbXRwLnBvcnQ7XG4gICB9ZWxzZXtcbiAgICAgICBwcm9jZXNzLmVudi5NQUlMX1VSTCA9ICdzbXRwOi8vJyArXG4gICAgICAgICAgIGVuY29kZVVSSUNvbXBvbmVudChjb25maXJtU2V0dGluZ3Muc210cC51c2VybmFtZSkgK1xuICAgICAgICAgICAnOicgKyBlbmNvZGVVUklDb21wb25lbnQoY29uZmlybVNldHRpbmdzLnNtdHAucGFzc3dvcmQpICtcbiAgICAgICAgICAgJ0AnICsgZW5jb2RlVVJJQ29tcG9uZW50KGNvbmZpcm1TZXR0aW5ncy5zbXRwLnNlcnZlcikgK1xuICAgICAgICAgICAnOicgK1xuICAgICAgICAgICBjb25maXJtU2V0dGluZ3Muc210cC5wb3J0O1xuICAgfVxuXG4gICBsb2dDb25maXJtKCd1c2luZyBNQUlMX1VSTDonLHByb2Nlc3MuZW52Lk1BSUxfVVJMKTtcblxuICAgaWYoY29uZmlybVNldHRpbmdzLnNtdHAuTk9ERV9UTFNfUkVKRUNUX1VOQVVUSE9SSVpFRCE9PXVuZGVmaW5lZClcbiAgICAgICBwcm9jZXNzLmVudi5OT0RFX1RMU19SRUpFQ1RfVU5BVVRIT1JJWkVEID0gY29uZmlybVNldHRpbmdzLnNtdHAuTk9ERV9UTFNfUkVKRUNUX1VOQVVUSE9SSVpFRDsgLy8wXG4gIH0pO1xufVxuZXhwb3J0IGNvbnN0IERPSV9NQUlMX0RFRkFVTFRfRU1BSUxfRlJPTSA9IGRlZmF1bHRGcm9tO1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgeyBSb2xlcyB9IGZyb20gJ21ldGVvci9hbGFubmluZzpyb2xlcyc7XG5pbXBvcnQge01ldGF9IGZyb20gJy4uLy4uL2FwaS9tZXRhL21ldGEuanMnXG5NZXRlb3Iuc3RhcnR1cCgoKSA9PiB7XG4gICBsZXQgdmVyc2lvbj1Bc3NldHMuZ2V0VGV4dChcInZlcnNpb24uanNvblwiKTtcblxuICBpZiAoTWV0YS5maW5kKCkuY291bnQoKSA+IDApe1xuICAgIE1ldGEucmVtb3ZlKHt9KTtcbiAgfVxuICAgTWV0YS5pbnNlcnQoe2tleTpcInZlcnNpb25cIix2YWx1ZTp2ZXJzaW9ufSk7XG4gIFxuICBpZihNZXRlb3IudXNlcnMuZmluZCgpLmNvdW50KCkgPT09IDApIHtcbiAgICBjb25zdCBpZCA9IEFjY291bnRzLmNyZWF0ZVVzZXIoe1xuICAgICAgdXNlcm5hbWU6ICdhZG1pbicsXG4gICAgICBlbWFpbDogJ2FkbWluQHNlbmRlZmZlY3QuZGUnLFxuICAgICAgcGFzc3dvcmQ6ICdwYXNzd29yZCdcbiAgICB9KTtcbiAgICBSb2xlcy5hZGRVc2Vyc1RvUm9sZXMoaWQsICdhZG1pbicpO1xuICB9XG59KTtcbiIsImltcG9ydCAnLi9sb2ctY29uZmlndXJhdGlvbi5qcyc7XG5pbXBvcnQgJy4vZGFwcC1jb25maWd1cmF0aW9uLmpzJztcbmltcG9ydCAnLi90eXBlLWNvbmZpZ3VyYXRpb24uanMnO1xuaW1wb3J0ICcuL2Rucy1jb25maWd1cmF0aW9uLmpzJztcbmltcG9ydCAnLi9kb2ljaGFpbi1jb25maWd1cmF0aW9uLmpzJztcbmltcG9ydCAnLi9maXh0dXJlcy5qcyc7XG5pbXBvcnQgJy4vcmVnaXN0ZXItYXBpLmpzJztcbmltcG9ydCAnLi91c2VyYWNjb3VudHMtY29uZmlndXJhdGlvbi5qcyc7XG5pbXBvcnQgJy4vc2VjdXJpdHkuanMnO1xuaW1wb3J0ICcuL2VtYWlsLWNvbmZpZ3VyYXRpb24uanMnO1xuaW1wb3J0ICcuL2pvYnMuanMnO1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgeyBNYWlsSm9icyB9IGZyb20gJy4uLy4uLy4uL3NlcnZlci9hcGkvbWFpbF9qb2JzLmpzJztcbmltcG9ydCB7IEJsb2NrY2hhaW5Kb2JzIH0gZnJvbSAnLi4vLi4vLi4vc2VydmVyL2FwaS9ibG9ja2NoYWluX2pvYnMuanMnO1xuaW1wb3J0IHsgREFwcEpvYnMgfSBmcm9tICcuLi8uLi8uLi9zZXJ2ZXIvYXBpL2RhcHBfam9icy5qcyc7XG5pbXBvcnQgeyBDT05GSVJNX0FQUCwgaXNBcHBUeXBlIH0gZnJvbSAnLi90eXBlLWNvbmZpZ3VyYXRpb24uanMnO1xuaW1wb3J0IGFkZENoZWNrTmV3VHJhbnNhY3Rpb25zQmxvY2tjaGFpbkpvYiBmcm9tICcuLi8uLi9tb2R1bGVzL3NlcnZlci9qb2JzL2FkZF9jaGVja19uZXdfdHJhbnNhY3Rpb25zLmpzJztcblxuTWV0ZW9yLnN0YXJ0dXAoKCkgPT4ge1xuICBNYWlsSm9icy5zdGFydEpvYlNlcnZlcigpO1xuICBCbG9ja2NoYWluSm9icy5zdGFydEpvYlNlcnZlcigpO1xuICBEQXBwSm9icy5zdGFydEpvYlNlcnZlcigpO1xuICBpZihpc0FwcFR5cGUoQ09ORklSTV9BUFApKSBhZGRDaGVja05ld1RyYW5zYWN0aW9uc0Jsb2NrY2hhaW5Kb2IoKTtcbn0pO1xuIiwiaW1wb3J0IHtpc0RlYnVnfSBmcm9tIFwiLi9kYXBwLWNvbmZpZ3VyYXRpb25cIjtcblxucmVxdWlyZSgnc2NyaWJlLWpzJykoKTtcblxuZXhwb3J0IGNvbnN0IGNvbnNvbGUgPSBwcm9jZXNzLmNvbnNvbGU7XG5leHBvcnQgY29uc3Qgc2VuZE1vZGVUYWdDb2xvciA9IHttc2cgOiAnc2VuZC1tb2RlJywgY29sb3JzIDogWyd5ZWxsb3cnLCAnaW52ZXJzZSddfTtcbmV4cG9ydCBjb25zdCBjb25maXJtTW9kZVRhZ0NvbG9yID0ge21zZyA6ICdjb25maXJtLW1vZGUnLCBjb2xvcnMgOiBbJ2JsdWUnLCAnaW52ZXJzZSddfTtcbmV4cG9ydCBjb25zdCB2ZXJpZnlNb2RlVGFnQ29sb3IgPSB7bXNnIDogJ3ZlcmlmeS1tb2RlJywgY29sb3JzIDogWydncmVlbicsICdpbnZlcnNlJ119O1xuZXhwb3J0IGNvbnN0IGJsb2NrY2hhaW5Nb2RlVGFnQ29sb3IgPSB7bXNnIDogJ2Jsb2NrY2hhaW4tbW9kZScsIGNvbG9ycyA6IFsnd2hpdGUnLCAnaW52ZXJzZSddfTtcbmV4cG9ydCBjb25zdCB0ZXN0aW5nTW9kZVRhZ0NvbG9yID0ge21zZyA6ICd0ZXN0aW5nLW1vZGUnLCBjb2xvcnMgOiBbJ29yYW5nZScsICdpbnZlcnNlJ119O1xuXG5leHBvcnQgZnVuY3Rpb24gbG9nU2VuZChtZXNzYWdlLHBhcmFtKSB7XG4gICAgaWYoaXNEZWJ1ZygpKSB7Y29uc29sZS50aW1lKCkudGFnKHNlbmRNb2RlVGFnQ29sb3IpLmxvZyhtZXNzYWdlLHBhcmFtP3BhcmFtOicnKTt9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsb2dDb25maXJtKG1lc3NhZ2UscGFyYW0pIHtcbiAgICBpZihpc0RlYnVnKCkpIHtjb25zb2xlLnRpbWUoKS50YWcoY29uZmlybU1vZGVUYWdDb2xvcikubG9nKG1lc3NhZ2UsIHBhcmFtP3BhcmFtOicnKTt9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsb2dWZXJpZnkobWVzc2FnZSwgcGFyYW0pIHtcbiAgICBpZihpc0RlYnVnKCkpIHtjb25zb2xlLnRpbWUoKS50YWcodmVyaWZ5TW9kZVRhZ0NvbG9yKS5sb2cobWVzc2FnZSwgcGFyYW0/cGFyYW06JycpO31cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxvZ0Jsb2NrY2hhaW4obWVzc2FnZSwgcGFyYW0pIHtcbiAgICBpZihpc0RlYnVnKCkpe2NvbnNvbGUudGltZSgpLnRhZyhibG9ja2NoYWluTW9kZVRhZ0NvbG9yKS5sb2cobWVzc2FnZSwgcGFyYW0/cGFyYW06JycpO31cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxvZ01haW4obWVzc2FnZSwgcGFyYW0pIHtcbiAgICBpZihpc0RlYnVnKCkpe2NvbnNvbGUudGltZSgpLnRhZyhibG9ja2NoYWluTW9kZVRhZ0NvbG9yKS5sb2cobWVzc2FnZSwgcGFyYW0/cGFyYW06JycpO31cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxvZ0Vycm9yKG1lc3NhZ2UsIHBhcmFtKSB7XG4gICAgaWYoaXNEZWJ1ZygpKXtjb25zb2xlLnRpbWUoKS50YWcoYmxvY2tjaGFpbk1vZGVUYWdDb2xvcikuZXJyb3IobWVzc2FnZSwgcGFyYW0/cGFyYW06JycpO31cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRlc3RMb2dnaW5nKG1lc3NhZ2UsIHBhcmFtKSB7XG4gICAgaWYoaXNEZWJ1ZygpKXtjb25zb2xlLnRpbWUoKS50YWcodGVzdGluZ01vZGVUYWdDb2xvcikubG9nKG1lc3NhZ2UsIHBhcmFtP3BhcmFtOicnKTt9XG59IiwiaW1wb3J0ICcuLi8uLi9hcGkvbGFuZ3VhZ2VzL21ldGhvZHMuanMnO1xuaW1wb3J0ICcuLi8uLi9hcGkvZG9pY2hhaW4vbWV0aG9kcy5qcyc7XG5pbXBvcnQgJy4uLy4uL2FwaS9yZWNpcGllbnRzL3NlcnZlci9wdWJsaWNhdGlvbnMuanMnO1xuaW1wb3J0ICcuLi8uLi9hcGkvb3B0LWlucy9tZXRob2RzLmpzJztcbmltcG9ydCAnLi4vLi4vYXBpL3ZlcnNpb24vcHVibGljYXRpb25zLmpzJztcbmltcG9ydCAnLi4vLi4vYXBpL29wdC1pbnMvc2VydmVyL3B1YmxpY2F0aW9ucy5qcyc7XG5cbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IHsgRERQUmF0ZUxpbWl0ZXIgfSBmcm9tICdtZXRlb3IvZGRwLXJhdGUtbGltaXRlcic7XG5pbXBvcnQgeyBfIH0gZnJvbSAnbWV0ZW9yL3VuZGVyc2NvcmUnO1xuXG4vLyBEb24ndCBsZXQgcGVvcGxlIHdyaXRlIGFyYml0cmFyeSBkYXRhIHRvIHRoZWlyICdwcm9maWxlJyBmaWVsZCBmcm9tIHRoZSBjbGllbnRcbk1ldGVvci51c2Vycy5kZW55KHtcbiAgdXBkYXRlKCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9LFxufSk7XG5cbi8vIEdldCBhIGxpc3Qgb2YgYWxsIGFjY291bnRzIG1ldGhvZHMgYnkgcnVubmluZyBgTWV0ZW9yLnNlcnZlci5tZXRob2RfaGFuZGxlcnNgIGluIG1ldGVvciBzaGVsbFxuY29uc3QgQVVUSF9NRVRIT0RTID0gW1xuICAnbG9naW4nLFxuICAnbG9nb3V0JyxcbiAgJ2xvZ291dE90aGVyQ2xpZW50cycsXG4gICdnZXROZXdUb2tlbicsXG4gICdyZW1vdmVPdGhlclRva2VucycsXG4gICdjb25maWd1cmVMb2dpblNlcnZpY2UnLFxuICAnY2hhbmdlUGFzc3dvcmQnLFxuICAnZm9yZ290UGFzc3dvcmQnLFxuICAncmVzZXRQYXNzd29yZCcsXG4gICd2ZXJpZnlFbWFpbCcsXG4gICdjcmVhdGVVc2VyJyxcbiAgJ0FUUmVtb3ZlU2VydmljZScsXG4gICdBVENyZWF0ZVVzZXJTZXJ2ZXInLFxuICAnQVRSZXNlbmRWZXJpZmljYXRpb25FbWFpbCcsXG5dO1xuXG5pZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIC8vIE9ubHkgYWxsb3cgMiBsb2dpbiBhdHRlbXB0cyBwZXIgY29ubmVjdGlvbiBwZXIgNSBzZWNvbmRzXG4gIEREUFJhdGVMaW1pdGVyLmFkZFJ1bGUoe1xuICAgIG5hbWUobmFtZSkge1xuICAgICAgcmV0dXJuIF8uY29udGFpbnMoQVVUSF9NRVRIT0RTLCBuYW1lKTtcbiAgICB9LFxuXG4gICAgLy8gUmF0ZSBsaW1pdCBwZXIgY29ubmVjdGlvbiBJRFxuICAgIGNvbm5lY3Rpb25JZCgpIHsgcmV0dXJuIHRydWU7IH0sXG4gIH0sIDIsIDUwMDApO1xufVxuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5leHBvcnQgY29uc3QgU0VORF9BUFAgPSBcInNlbmRcIjtcbmV4cG9ydCBjb25zdCBDT05GSVJNX0FQUCA9IFwiY29uZmlybVwiO1xuZXhwb3J0IGNvbnN0IFZFUklGWV9BUFAgPSBcInZlcmlmeVwiO1xuZXhwb3J0IGZ1bmN0aW9uIGlzQXBwVHlwZSh0eXBlKSB7XG4gIGlmKE1ldGVvci5zZXR0aW5ncyA9PT0gdW5kZWZpbmVkIHx8IE1ldGVvci5zZXR0aW5ncy5hcHAgPT09IHVuZGVmaW5lZCkgdGhyb3cgXCJObyBzZXR0aW5ncyBmb3VuZCFcIlxuICBjb25zdCB0eXBlcyA9IE1ldGVvci5zZXR0aW5ncy5hcHAudHlwZXM7XG4gIGlmKHR5cGVzICE9PSB1bmRlZmluZWQpIHJldHVybiB0eXBlcy5pbmNsdWRlcyh0eXBlKTtcbiAgcmV0dXJuIGZhbHNlO1xufVxuIiwiaW1wb3J0IHsgQWNjb3VudHMgfSBmcm9tICdtZXRlb3IvYWNjb3VudHMtYmFzZSc7XG5BY2NvdW50cy5jb25maWcoe1xuICAgIHNlbmRWZXJpZmljYXRpb25FbWFpbDogdHJ1ZSxcbiAgICBmb3JiaWRDbGllbnRBY2NvdW50Q3JlYXRpb246IHRydWVcbn0pO1xuXG5cblxuQWNjb3VudHMuZW1haWxUZW1wbGF0ZXMuZnJvbT0nZG9pY2hhaW5AbGUtc3BhY2UuZGUnOyIsImltcG9ydCB7IEFwaSwgRE9JX1dBTExFVE5PVElGWV9ST1VURSwgRE9JX0NPTkZJUk1BVElPTl9ST1VURSB9IGZyb20gJy4uL3Jlc3QuanMnO1xuaW1wb3J0IGNvbmZpcm1PcHRJbiBmcm9tICcuLi8uLi8uLi8uLi9pbXBvcnRzL21vZHVsZXMvc2VydmVyL29wdC1pbnMvY29uZmlybS5qcydcbmltcG9ydCBjaGVja05ld1RyYW5zYWN0aW9uIGZyb20gXCIuLi8uLi8uLi8uLi9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2RvaWNoYWluL2NoZWNrX25ld190cmFuc2FjdGlvbnNcIjtcbmltcG9ydCB7bG9nQ29uZmlybX0gZnJvbSBcIi4uLy4uLy4uLy4uL2ltcG9ydHMvc3RhcnR1cC9zZXJ2ZXIvbG9nLWNvbmZpZ3VyYXRpb25cIjtcbi8vZG9rdSBvZiBtZXRlb3ItcmVzdGl2dXMgaHR0cHM6Ly9naXRodWIuY29tL2thaG1hbGkvbWV0ZW9yLXJlc3RpdnVzXG5BcGkuYWRkUm91dGUoRE9JX0NPTkZJUk1BVElPTl9ST1VURSsnLzpoYXNoJywge2F1dGhSZXF1aXJlZDogZmFsc2V9LCB7XG4gIGdldDoge1xuICAgIGFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBoYXNoID0gdGhpcy51cmxQYXJhbXMuaGFzaDtcbiAgICAgIHRyeSB7XG4gICAgICAgIGxldCBpcCA9IHRoaXMucmVxdWVzdC5oZWFkZXJzWyd4LWZvcndhcmRlZC1mb3InXSB8fFxuICAgICAgICAgIHRoaXMucmVxdWVzdC5jb25uZWN0aW9uLnJlbW90ZUFkZHJlc3MgfHxcbiAgICAgICAgICB0aGlzLnJlcXVlc3Quc29ja2V0LnJlbW90ZUFkZHJlc3MgfHxcbiAgICAgICAgICAodGhpcy5yZXF1ZXN0LmNvbm5lY3Rpb24uc29ja2V0ID8gdGhpcy5yZXF1ZXN0LmNvbm5lY3Rpb24uc29ja2V0LnJlbW90ZUFkZHJlc3M6IG51bGwpO1xuXG4gICAgICAgICAgaWYoaXAuaW5kZXhPZignLCcpIT0tMSlpcD1pcC5zdWJzdHJpbmcoMCxpcC5pbmRleE9mKCcsJykpO1xuXG4gICAgICAgICAgbG9nQ29uZmlybSgnUkVTVCBvcHQtaW4vY29uZmlybSA6Jyx7aGFzaDpoYXNoLCBob3N0OmlwfSk7XG4gICAgICAgICAgY29uc3QgcmVkaXJlY3QgPSBjb25maXJtT3B0SW4oe2hvc3Q6IGlwLCBoYXNoOiBoYXNofSk7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBzdGF0dXNDb2RlOiAzMDMsXG4gICAgICAgICAgaGVhZGVyczogeydDb250ZW50LVR5cGUnOiAndGV4dC9wbGFpbicsICdMb2NhdGlvbic6IHJlZGlyZWN0fSxcbiAgICAgICAgICBib2R5OiAnTG9jYXRpb246ICcrcmVkaXJlY3RcbiAgICAgICAgfTtcbiAgICAgIH0gY2F0Y2goZXJyb3IpIHtcbiAgICAgICAgcmV0dXJuIHtzdGF0dXNDb2RlOiA1MDAsIGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogZXJyb3IubWVzc2FnZX19O1xuICAgICAgfVxuICAgIH1cbiAgfVxufSk7XG5cbkFwaS5hZGRSb3V0ZShET0lfV0FMTEVUTk9USUZZX1JPVVRFLCB7XG4gICAgZ2V0OiB7XG4gICAgICAgIGF1dGhSZXF1aXJlZDogZmFsc2UsXG4gICAgICAgIGFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjb25zdCBwYXJhbXMgPSB0aGlzLnF1ZXJ5UGFyYW1zO1xuICAgICAgICAgICAgY29uc3QgdHhpZCA9IHBhcmFtcy50eDtcblxuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBjaGVja05ld1RyYW5zYWN0aW9uKHR4aWQpO1xuICAgICAgICAgICAgICAgIHJldHVybiB7c3RhdHVzOiAnc3VjY2VzcycsICBkYXRhOid0eGlkOicrdHhpZCsnIHdhcyByZWFkIGZyb20gYmxvY2tjaGFpbid9O1xuICAgICAgICAgICAgfSBjYXRjaChlcnJvcikge1xuICAgICAgICAgICAgICAgIHJldHVybiB7c3RhdHVzOiAnZmFpbCcsIGVycm9yOiBlcnJvci5tZXNzYWdlfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn0pO1xuIiwiaW1wb3J0IHsgQXBpIH0gZnJvbSAnLi4vcmVzdC5qcyc7XG5BcGkuYWRkUm91dGUoJ2RlYnVnL21haWwnLCB7YXV0aFJlcXVpcmVkOiBmYWxzZX0sIHtcbiAgZ2V0OiB7XG4gICAgYWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IGRhdGEgPSB7XG4gICAgICAgIFwiZnJvbVwiOiBcIm5vcmVwbHlAZG9pY2hhaW4ub3JnXCIsXG4gICAgICAgIFwic3ViamVjdFwiOiBcIkRvaWNoYWluLm9yZyBOZXdzbGV0dGVyIEJlc3TDpHRpZ3VuZ1wiLFxuICAgICAgICBcInJlZGlyZWN0XCI6IFwiaHR0cHM6Ly93d3cuZG9pY2hhaW4ub3JnL3ZpZWxlbi1kYW5rL1wiLFxuICAgICAgICBcInJldHVyblBhdGhcIjogXCJub3JlcGx5QGRvaWNoYWluLm9yZ1wiLFxuICAgICAgICBcImNvbnRlbnRcIjpcIjxzdHlsZSB0eXBlPSd0ZXh0L2NzcycgbWVkaWE9J3NjcmVlbic+XFxuXCIgK1xuICAgICAgICAgICAgXCIqIHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGxpbmUtaGVpZ2h0OiBpbmhlcml0O1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwiLkV4dGVybmFsQ2xhc3MgKiB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRsaW5lLWhlaWdodDogMTAwJTtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcImJvZHksIHAge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0bWFyZ2luOiAwO1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0cGFkZGluZzogMDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdG1hcmdpbi1ib3R0b206IDA7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHQtd2Via2l0LXRleHQtc2l6ZS1hZGp1c3Q6IG5vbmU7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHQtbXMtdGV4dC1zaXplLWFkanVzdDogbm9uZTtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcImltZyB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRsaW5lLWhlaWdodDogMTAwJTtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdG91dGxpbmU6IG5vbmU7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHR0ZXh0LWRlY29yYXRpb246IG5vbmU7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHQtbXMtaW50ZXJwb2xhdGlvbi1tb2RlOiBiaWN1YmljO1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwiYSBpbWcge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0Ym9yZGVyOiBub25lO1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwiI2JhY2tncm91bmRUYWJsZSB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRtYXJnaW46IDA7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRwYWRkaW5nOiAwO1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0d2lkdGg6IDEwMCUgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcImEsIGE6bGluaywgLm5vLWRldGVjdC1sb2NhbCBhLCAuYXBwbGVMaW5rcyBhIHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGNvbG9yOiAjNTU1NWZmICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHR0ZXh0LWRlY29yYXRpb246IHVuZGVybGluZTtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcIi5FeHRlcm5hbENsYXNzIHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGRpc3BsYXk6IGJsb2NrICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHR3aWR0aDogMTAwJTtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcIi5FeHRlcm5hbENsYXNzLCAuRXh0ZXJuYWxDbGFzcyBwLCAuRXh0ZXJuYWxDbGFzcyBzcGFuLCAuRXh0ZXJuYWxDbGFzcyBmb250LCAuRXh0ZXJuYWxDbGFzcyB0ZCwgLkV4dGVybmFsQ2xhc3MgZGl2IHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGxpbmUtaGVpZ2h0OiBpbmhlcml0O1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwidGFibGUgdGQge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0Ym9yZGVyLWNvbGxhcHNlOiBjb2xsYXBzZTtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdG1zby10YWJsZS1sc3BhY2U6IDBwdDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdG1zby10YWJsZS1yc3BhY2U6IDBwdDtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcInN1cCB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRwb3NpdGlvbjogcmVsYXRpdmU7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHR0b3A6IDRweDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGxpbmUtaGVpZ2h0OiA3cHggIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGZvbnQtc2l6ZTogMTFweCAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwiLm1vYmlsZV9saW5rIGFbaHJlZl49J3RlbCddLCAubW9iaWxlX2xpbmsgYVtocmVmXj0nc21zJ10ge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0dGV4dC1kZWNvcmF0aW9uOiBkZWZhdWx0O1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0Y29sb3I6ICM1NTU1ZmYgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdHBvaW50ZXItZXZlbnRzOiBhdXRvO1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0Y3Vyc29yOiBkZWZhdWx0O1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwiLm5vLWRldGVjdCBhIHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdHRleHQtZGVjb3JhdGlvbjogbm9uZTtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGNvbG9yOiAjNTU1NWZmO1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0cG9pbnRlci1ldmVudHM6IGF1dG87XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRjdXJzb3I6IGRlZmF1bHQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCJ7XFxuXCIgK1xuICAgICAgICAgICAgXCJjb2xvcjogIzU1NTVmZjtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcInNwYW4ge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0Y29sb3I6IGluaGVyaXQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRib3JkZXItYm90dG9tOiBub25lO1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwic3Bhbjpob3ZlciB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcIi5ub3VuZGVybGluZSB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHR0ZXh0LWRlY29yYXRpb246IG5vbmUgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcImgxLCBoMiwgaDMge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0bWFyZ2luOiAwO1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0cGFkZGluZzogMDtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcInAge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0TWFyZ2luOiAwcHggIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcInRhYmxlW2NsYXNzPSdlbWFpbC1yb290LXdyYXBwZXInXSB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHR3aWR0aDogNjAwcHggIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcImJvZHkge1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwiYm9keSB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRtaW4td2lkdGg6IDI4MHB4O1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0d2lkdGg6IDEwMCU7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCJ0ZFtjbGFzcz0ncGF0dGVybiddIC5jMTEycDIwciB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHR3aWR0aDogMjAlO1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwidGRbY2xhc3M9J3BhdHRlcm4nXSAuYzMzNnA2MHIge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0d2lkdGg6IDYwLjAwMDAwMDAwMDAwMDI1NiU7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCI8L3N0eWxlPlxcblwiICtcbiAgICAgICAgICAgIFwiPHN0eWxlPlxcblwiICtcbiAgICAgICAgICAgIFwiQG1lZGlhIG9ubHkgc2NyZWVuIGFuZCAobWF4LXdpZHRoOiA1OTlweCksIG9ubHkgc2NyZWVuIGFuZCAobWF4LWRldmljZS13aWR0aDogNTk5cHgpLCBvbmx5IHNjcmVlbiBhbmQgKG1heC13aWR0aDogNDAwcHgpLCBvbmx5IHNjcmVlbiBhbmQgKG1heC1kZXZpY2Utd2lkdGg6IDQwMHB4KSB7XFxuXCIgK1xuICAgICAgICAgICAgXCIuZW1haWwtcm9vdC13cmFwcGVyIHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdHdpZHRoOiAxMDAlICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCIuZnVsbC13aWR0aCB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHR3aWR0aDogMTAwJSAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0aGVpZ2h0OiBhdXRvICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHR0ZXh0LWFsaWduOiBjZW50ZXI7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCIuZnVsbHdpZHRoaGFsZmxlZnQge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0d2lkdGg6IDEwMCUgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcIi5mdWxsd2lkdGhoYWxmcmlnaHQge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0d2lkdGg6IDEwMCUgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcIi5mdWxsd2lkdGhoYWxmaW5uZXIge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0d2lkdGg6IDEwMCUgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdG1hcmdpbjogMCBhdXRvICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRmbG9hdDogbm9uZSAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0bWFyZ2luLWxlZnQ6IGF1dG8gIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdG1hcmdpbi1yaWdodDogYXV0byAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0Y2xlYXI6IGJvdGggIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcIi5oaWRlIHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGRpc3BsYXk6IG5vbmUgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdHdpZHRoOiAwcHggIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGhlaWdodDogMHB4ICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRvdmVyZmxvdzogaGlkZGVuO1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwiLmRlc2t0b3AtaGlkZSB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRkaXNwbGF5OiBibG9jayAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0d2lkdGg6IDEwMCUgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGhlaWdodDogYXV0byAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0b3ZlcmZsb3c6IGhpZGRlbjtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdG1heC1oZWlnaHQ6IGluaGVyaXQgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcIi5jMTEycDIwciB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHR3aWR0aDogMTAwJSAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0ZmxvYXQ6IG5vbmU7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCIuYzMzNnA2MHIge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0d2lkdGg6IDEwMCUgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGZsb2F0OiBub25lO1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwiPC9zdHlsZT5cXG5cIiArXG4gICAgICAgICAgICBcIjxzdHlsZT5cXG5cIiArXG4gICAgICAgICAgICBcIkBtZWRpYSBvbmx5IHNjcmVlbiBhbmQgKG1pbi13aWR0aDogNjAwcHgpIHtcXG5cIiArXG4gICAgICAgICAgICBcInRkW2NsYXNzPSdwYXR0ZXJuJ10gLmMxMTJwMjByIHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdHdpZHRoOiAxMTJweCAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwidGRbY2xhc3M9J3BhdHRlcm4nXSAuYzMzNnA2MHIge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0d2lkdGg6IDMzNnB4ICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCJcXG5cIiArXG4gICAgICAgICAgICBcIkBtZWRpYSBvbmx5IHNjcmVlbiBhbmQgKG1heC13aWR0aDogNTk5cHgpLCBvbmx5IHNjcmVlbiBhbmQgKG1heC1kZXZpY2Utd2lkdGg6IDU5OXB4KSwgb25seSBzY3JlZW4gYW5kIChtYXgtd2lkdGg6IDQwMHB4KSwgb25seSBzY3JlZW4gYW5kIChtYXgtZGV2aWNlLXdpZHRoOiA0MDBweCkge1xcblwiICtcbiAgICAgICAgICAgIFwidGFibGVbY2xhc3M9J2VtYWlsLXJvb3Qtd3JhcHBlciddIHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdHdpZHRoOiAxMDAlICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCJ0ZFtjbGFzcz0nd3JhcCddIC5mdWxsLXdpZHRoIHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdHdpZHRoOiAxMDAlICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRoZWlnaHQ6IGF1dG8gIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcInRkW2NsYXNzPSd3cmFwJ10gLmZ1bGx3aWR0aGhhbGZsZWZ0IHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdHdpZHRoOiAxMDAlICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCJ0ZFtjbGFzcz0nd3JhcCddIC5mdWxsd2lkdGhoYWxmcmlnaHQge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0d2lkdGg6IDEwMCUgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcInRkW2NsYXNzPSd3cmFwJ10gLmZ1bGx3aWR0aGhhbGZpbm5lciB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHR3aWR0aDogMTAwJSAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0bWFyZ2luOiAwIGF1dG8gIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGZsb2F0OiBub25lICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRtYXJnaW4tbGVmdDogYXV0byAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0bWFyZ2luLXJpZ2h0OiBhdXRvICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRjbGVhcjogYm90aCAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwidGRbY2xhc3M9J3dyYXAnXSAuaGlkZSB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRkaXNwbGF5OiBub25lICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHR3aWR0aDogMHB4O1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0aGVpZ2h0OiAwcHg7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRvdmVyZmxvdzogaGlkZGVuO1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwidGRbY2xhc3M9J3BhdHRlcm4nXSAuYzExMnAyMHIge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0d2lkdGg6IDEwMCUgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcInRkW2NsYXNzPSdwYXR0ZXJuJ10gLmMzMzZwNjByIHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdHdpZHRoOiAxMDAlICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCJcXG5cIiArXG4gICAgICAgICAgICBcIkBtZWRpYSB5YWhvbyB7XFxuXCIgK1xuICAgICAgICAgICAgXCJ0YWJsZSB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRmbG9hdDogbm9uZSAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0aGVpZ2h0OiBhdXRvO1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwidGFibGVbYWxpZ249J2xlZnQnXSB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRmbG9hdDogbGVmdCAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwidGRbYWxpZ249J2xlZnQnXSB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRmbG9hdDogbGVmdCAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0aGVpZ2h0OiBhdXRvO1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwidGFibGVbYWxpZ249J2NlbnRlciddIHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdG1hcmdpbjogMCBhdXRvO1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwidGRbYWxpZ249J2NlbnRlciddIHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdG1hcmdpbjogMCBhdXRvO1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0aGVpZ2h0OiBhdXRvO1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwidGFibGVbYWxpZ249J3JpZ2h0J10ge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0ZmxvYXQ6IHJpZ2h0ICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCJ0ZFthbGlnbj0ncmlnaHQnXSB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRmbG9hdDogcmlnaHQgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGhlaWdodDogYXV0bztcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcIjwvc3R5bGU+XFxuXCIgK1xuICAgICAgICAgICAgXCJcXG5cIiArXG4gICAgICAgICAgICBcIjwhLS1baWYgKGd0ZSBJRSA3KSAmICh2bWwpXT5cXG5cIiArXG4gICAgICAgICAgICBcIjxzdHlsZSB0eXBlPSd0ZXh0L2Nzcyc+XFxuXCIgK1xuICAgICAgICAgICAgXCJodG1sLCBib2R5IHttYXJnaW46MCAhaW1wb3J0YW50OyBwYWRkaW5nOjBweCAhaW1wb3J0YW50O31cXG5cIiArXG4gICAgICAgICAgICBcImltZy5mdWxsLXdpZHRoIHsgcG9zaXRpb246IHJlbGF0aXZlICFpbXBvcnRhbnQ7IH1cXG5cIiArXG4gICAgICAgICAgICBcIlxcblwiICtcbiAgICAgICAgICAgIFwiLmltZzI0MHgzMCB7IHdpZHRoOiAyNDBweCAhaW1wb3J0YW50OyBoZWlnaHQ6IDMwcHggIWltcG9ydGFudDt9XFxuXCIgK1xuICAgICAgICAgICAgXCIuaW1nMjB4MjAgeyB3aWR0aDogMjBweCAhaW1wb3J0YW50OyBoZWlnaHQ6IDIwcHggIWltcG9ydGFudDt9XFxuXCIgK1xuICAgICAgICAgICAgXCJcXG5cIiArXG4gICAgICAgICAgICBcIjwvc3R5bGU+XFxuXCIgK1xuICAgICAgICAgICAgXCI8IVtlbmRpZl0tLT5cXG5cIiArXG4gICAgICAgICAgICBcIlxcblwiICtcbiAgICAgICAgICAgIFwiPCEtLVtpZiBndGUgbXNvIDldPlxcblwiICtcbiAgICAgICAgICAgIFwiPHN0eWxlIHR5cGU9J3RleHQvY3NzJz5cXG5cIiArXG4gICAgICAgICAgICBcIi5tc28tZm9udC1maXgtYXJpYWwgeyBmb250LWZhbWlseTogQXJpYWwsIHNhbnMtc2VyaWY7fVxcblwiICtcbiAgICAgICAgICAgIFwiLm1zby1mb250LWZpeC1nZW9yZ2lhIHsgZm9udC1mYW1pbHk6IEdlb3JnaWEsIHNhbnMtc2VyaWY7fVxcblwiICtcbiAgICAgICAgICAgIFwiLm1zby1mb250LWZpeC10YWhvbWEgeyBmb250LWZhbWlseTogVGFob21hLCBzYW5zLXNlcmlmO31cXG5cIiArXG4gICAgICAgICAgICBcIi5tc28tZm9udC1maXgtdGltZXNfbmV3X3JvbWFuIHsgZm9udC1mYW1pbHk6ICdUaW1lcyBOZXcgUm9tYW4nLCBzYW5zLXNlcmlmO31cXG5cIiArXG4gICAgICAgICAgICBcIi5tc28tZm9udC1maXgtdHJlYnVjaGV0X21zIHsgZm9udC1mYW1pbHk6ICdUcmVidWNoZXQgTVMnLCBzYW5zLXNlcmlmO31cXG5cIiArXG4gICAgICAgICAgICBcIi5tc28tZm9udC1maXgtdmVyZGFuYSB7IGZvbnQtZmFtaWx5OiBWZXJkYW5hLCBzYW5zLXNlcmlmO31cXG5cIiArXG4gICAgICAgICAgICBcIjwvc3R5bGU+XFxuXCIgK1xuICAgICAgICAgICAgXCI8IVtlbmRpZl0tLT5cXG5cIiArXG4gICAgICAgICAgICBcIlxcblwiICtcbiAgICAgICAgICAgIFwiPCEtLVtpZiBndGUgbXNvIDldPlxcblwiICtcbiAgICAgICAgICAgIFwiPHN0eWxlIHR5cGU9J3RleHQvY3NzJz5cXG5cIiArXG4gICAgICAgICAgICBcInRhYmxlLCB0ZCB7XFxuXCIgK1xuICAgICAgICAgICAgXCJib3JkZXItY29sbGFwc2U6IGNvbGxhcHNlICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJtc28tdGFibGUtbHNwYWNlOiAwcHggIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIm1zby10YWJsZS1yc3BhY2U6IDBweCAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwiXFxuXCIgK1xuICAgICAgICAgICAgXCIuZW1haWwtcm9vdC13cmFwcGVyIHsgd2lkdGggNjAwcHggIWltcG9ydGFudDt9XFxuXCIgK1xuICAgICAgICAgICAgXCIuaW1nbGluayB7IGZvbnQtc2l6ZTogMHB4OyB9XFxuXCIgK1xuICAgICAgICAgICAgXCIuZWRtX2J1dHRvbiB7IGZvbnQtc2l6ZTogMHB4OyB9XFxuXCIgK1xuICAgICAgICAgICAgXCI8L3N0eWxlPlxcblwiICtcbiAgICAgICAgICAgIFwiPCFbZW5kaWZdLS0+XFxuXCIgK1xuICAgICAgICAgICAgXCJcXG5cIiArXG4gICAgICAgICAgICBcIjwhLS1baWYgZ3RlIG1zbyAxNV0+XFxuXCIgK1xuICAgICAgICAgICAgXCI8c3R5bGUgdHlwZT0ndGV4dC9jc3MnPlxcblwiICtcbiAgICAgICAgICAgIFwidGFibGUge1xcblwiICtcbiAgICAgICAgICAgIFwiZm9udC1zaXplOjBweDtcXG5cIiArXG4gICAgICAgICAgICBcIm1zby1tYXJnaW4tdG9wLWFsdDowcHg7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCJcXG5cIiArXG4gICAgICAgICAgICBcIi5mdWxsd2lkdGhoYWxmbGVmdCB7XFxuXCIgK1xuICAgICAgICAgICAgXCJ3aWR0aDogNDklICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJmbG9hdDpsZWZ0ICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCJcXG5cIiArXG4gICAgICAgICAgICBcIi5mdWxsd2lkdGhoYWxmcmlnaHQge1xcblwiICtcbiAgICAgICAgICAgIFwid2lkdGg6IDUwJSAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwiZmxvYXQ6cmlnaHQgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcIjwvc3R5bGU+XFxuXCIgK1xuICAgICAgICAgICAgXCI8IVtlbmRpZl0tLT5cXG5cIiArXG4gICAgICAgICAgICBcIjxzdHlsZSB0eXBlPSd0ZXh0L2NzcycgbWVkaWE9Jyhwb2ludGVyKSBhbmQgKG1pbi1jb2xvci1pbmRleDowKSc+XFxuXCIgK1xuICAgICAgICAgICAgXCJodG1sLCBib2R5IHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGJhY2tncm91bmQtaW1hZ2U6IG5vbmUgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGJhY2tncm91bmQtY29sb3I6ICNlYmViZWIgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdG1hcmdpbjogMCAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0cGFkZGluZzogMCAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwiPC9zdHlsZT5cXG5cIiArXG4gICAgICAgICAgICBcIjwvaGVhZD5cXG5cIiArXG4gICAgICAgICAgICBcIjxib2R5IGxlZnRtYXJnaW49JzAnIG1hcmdpbndpZHRoPScwJyB0b3BtYXJnaW49JzAnIG1hcmdpbmhlaWdodD0nMCcgb2Zmc2V0PScwJyBiYWNrZ3JvdW5kPVxcXCJcXFwiIGJnY29sb3I9JyNlYmViZWInIHN0eWxlPSdmb250LWZhbWlseTpBcmlhbCwgc2Fucy1zZXJpZjsgZm9udC1zaXplOjBweDttYXJnaW46MDtwYWRkaW5nOjA7ICc+XFxuXCIgK1xuICAgICAgICAgICAgXCI8IS0tW2lmIHRdPjwhW2VuZGlmXS0tPjwhLS1baWYgdF0+PCFbZW5kaWZdLS0+PCEtLVtpZiB0XT48IVtlbmRpZl0tLT48IS0tW2lmIHRdPjwhW2VuZGlmXS0tPjwhLS1baWYgdF0+PCFbZW5kaWZdLS0+PCEtLVtpZiB0XT48IVtlbmRpZl0tLT5cXG5cIiArXG4gICAgICAgICAgICBcIjx0YWJsZSBhbGlnbj0nY2VudGVyJyBib3JkZXI9JzAnIGNlbGxwYWRkaW5nPScwJyBjZWxsc3BhY2luZz0nMCcgYmFja2dyb3VuZD1cXFwiXFxcIiAgaGVpZ2h0PScxMDAlJyB3aWR0aD0nMTAwJScgaWQ9J2JhY2tncm91bmRUYWJsZSc+XFxuXCIgK1xuICAgICAgICAgICAgXCIgIDx0cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICA8dGQgY2xhc3M9J3dyYXAnIGFsaWduPSdjZW50ZXInIHZhbGlnbj0ndG9wJyB3aWR0aD0nMTAwJSc+XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRcXHQ8Y2VudGVyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICA8IS0tIGNvbnRlbnQgLS0+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgIFxcdDxkaXYgc3R5bGU9J3BhZGRpbmc6IDBweDsnPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICBcXHQgIDx0YWJsZSBjZWxscGFkZGluZz0nMCcgY2VsbHNwYWNpbmc9JzAnIGJvcmRlcj0nMCcgd2lkdGg9JzEwMCUnIGJnY29sb3I9JyNlYmViZWInPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICBcXHRcXHQgPHRyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgXFx0XFx0ICA8dGQgdmFsaWduPSd0b3AnIHN0eWxlPSdwYWRkaW5nOiAwcHg7Jz5cXG5cIiArXG4gICAgICAgICAgICBcIlxcdFxcdFxcdFxcdFxcdFxcdCAgPHRhYmxlIGNlbGxwYWRkaW5nPScwJyBjZWxsc3BhY2luZz0nMCcgd2lkdGg9JzYwMCcgYWxpZ249J2NlbnRlcicgc3R5bGU9J21heC13aWR0aDogNjAwcHg7bWluLXdpZHRoOiAyNDBweDttYXJnaW46IDAgYXV0bzsnIGNsYXNzPSdlbWFpbC1yb290LXdyYXBwZXInPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICBcXHRcXHQgXFx0XFx0PHRyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgIFxcdFxcdFxcdFxcdFxcdCA8dGQgdmFsaWduPSd0b3AnIHN0eWxlPSdwYWRkaW5nOiAwcHg7Jz5cXG5cIiArXG4gICAgICAgICAgICBcIlxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdCBcXHRcXHQ8dGFibGUgY2VsbHBhZGRpbmc9JzAnIGNlbGxzcGFjaW5nPScwJyBib3JkZXI9JzAnIHdpZHRoPScxMDAlJyBiZ2NvbG9yPScjRkZGRkZGJyBzdHlsZT0nYm9yZGVyOiAwcHggbm9uZTtiYWNrZ3JvdW5kLWNvbG9yOiAjRkZGRkZGOyc+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgIFxcdFxcdFxcdFxcdFxcdFxcdCA8dHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgIFxcdFxcdFxcdCAgXFx0XFx0XFx0XFx0IDx0ZCB2YWxpZ249J3RvcCcgc3R5bGU9J3BhZGRpbmctdG9wOiAzMHB4O3BhZGRpbmctcmlnaHQ6IDIwcHg7cGFkZGluZy1ib3R0b206IDM1cHg7cGFkZGluZy1sZWZ0OiAyMHB4Oyc+XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHQgICBcXHRcXHRcXHRcXHRcXG5cIiArXG4gICAgICAgICAgICBcIlxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdDx0YWJsZSBjZWxscGFkZGluZz0nMCdcXG5cIiArXG4gICAgICAgICAgICBcIlxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdGNlbGxzcGFjaW5nPScwJyBib3JkZXI9JzAnIGFsaWduPSdjZW50ZXInIHdpZHRoPScyNDAnICBzdHlsZT0nYm9yZGVyOiAwcHggbm9uZTtoZWlnaHQ6IGF1dG87JyBjbGFzcz0nZnVsbC13aWR0aCc+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxcdCBcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHQ8dHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdDx0ZCB2YWxpZ249J3RvcCcgc3R5bGU9J3BhZGRpbmc6IDBweDsnPjxpbWcgc3JjPSdodHRwczovL3NmMjYuc2VuZHNmeC5jb20vYWRtaW4vdGVtcC91c2VyLzE3L2RvaWNoYWluXzEwMGgucG5nJyB3aWR0aD0nMjQwJyBoZWlnaHQ9JzMwJyBhbHQ9XFxcIlxcXCIgYm9yZGVyPScwJyBzdHlsZT0nZGlzcGxheTogYmxvY2s7d2lkdGg6IDEwMCU7aGVpZ2h0OiBhdXRvOycgY2xhc3M9J2Z1bGwtd2lkdGggaW1nMjQweDMwJyAvPjwvdGQ+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxcdCBcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHQ8L3RyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdDwvdGFibGU+XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXG5cIiArXG4gICAgICAgICAgICBcIlxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdDwvdGQ+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgXFx0XFx0ICBcXHRcXHRcXHRcXHQ8L3RyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgIFxcdFxcdFxcdFxcdFxcdDwvdGFibGU+XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHQgXFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHQgXFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgPHRhYmxlIGNlbGxwYWRkaW5nPScwJyBjZWxsc3BhY2luZz0nMCcgYm9yZGVyPScwJyB3aWR0aD0nMTAwJScgYmdjb2xvcj0nIzAwNzFhYScgc3R5bGU9J2JvcmRlcjogMHB4IG5vbmU7YmFja2dyb3VuZC1jb2xvcjogIzAwNzFhYTtiYWNrZ3JvdW5kLWltYWdlOiB1cmwoJ2h0dHBzOi8vc2YyNi5zZW5kc2Z4LmNvbS9hZG1pbi90ZW1wL3VzZXIvMTcvYmx1ZS1iZy5qcGcnKTtiYWNrZ3JvdW5kLXJlcGVhdDogbm8tcmVwZWF0IDtiYWNrZ3JvdW5kLXBvc2l0aW9uOiBjZW50ZXI7Jz5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIHZhbGlnbj0ndG9wJyBzdHlsZT0ncGFkZGluZy10b3A6IDQwcHg7cGFkZGluZy1yaWdodDogMjBweDtwYWRkaW5nLWJvdHRvbTogNDVweDtwYWRkaW5nLWxlZnQ6IDIwcHg7Jz48dGFibGUgY2VsbHBhZGRpbmc9JzAnIGNlbGxzcGFjaW5nPScwJyB3aWR0aD0nMTAwJSc+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBzdHlsZT0ncGFkZGluZzogMHB4OycgY2xhc3M9J3BhdHRlcm4nPjx0YWJsZSBjZWxscGFkZGluZz0nMCcgY2VsbHNwYWNpbmc9JzAnIGJvcmRlcj0nMCcgd2lkdGg9JzEwMCUnPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgdmFsaWduPSd0b3AnIHN0eWxlPSdwYWRkaW5nLWJvdHRvbTogMTBweDsnPjxkaXYgc3R5bGU9J3RleHQtYWxpZ246IGxlZnQ7Zm9udC1mYW1pbHk6IGFyaWFsO2ZvbnQtc2l6ZTogMjBweDtjb2xvcjogI2ZmZmZmZjtsaW5lLWhlaWdodDogMzBweDttc28tbGluZS1oZWlnaHQ6IGV4YWN0bHk7bXNvLXRleHQtcmFpc2U6IDVweDsnPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHBcXG5cIiArXG4gICAgICAgICAgICBcInN0eWxlPSdwYWRkaW5nOiAwOyBtYXJnaW46IDA7dGV4dC1hbGlnbjogY2VudGVyOyc+Qml0dGUgYmVzdMOkdGlnZW4gU2llIElocmUgQW5tZWxkdW5nPC9wPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PjwvdGQ+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGFibGU+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRhYmxlIGNlbGxwYWRkaW5nPScwJyBjZWxsc3BhY2luZz0nMCcgYm9yZGVyPScwJyB3aWR0aD0nMTAwJSc+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCB2YWxpZ249J3RvcCcgc3R5bGU9J3BhZGRpbmc6IDA7bXNvLWNlbGxzcGFjaW5nOiAwaW47Jz48dGFibGUgY2VsbHBhZGRpbmc9JzAnIGNlbGxzcGFjaW5nPScwJyBib3JkZXI9JzAnIGFsaWduPSdsZWZ0JyB3aWR0aD0nMTEyJyAgc3R5bGU9J2Zsb2F0OiBsZWZ0OycgY2xhc3M9J2MxMTJwMjByJz5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIHZhbGlnbj0ndG9wJyBzdHlsZT0ncGFkZGluZzogMHB4Oyc+PHRhYmxlIGNlbGxwYWRkaW5nPScwJyBjZWxsc3BhY2luZz0nMCcgYm9yZGVyPScwJyB3aWR0aD0nMTAwJScgc3R5bGU9J2JvcmRlcjogMHB4IG5vbmU7JyBjbGFzcz0naGlkZSc+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCB2YWxpZ249J3RvcCcgc3R5bGU9J3BhZGRpbmc6IDBweDsnPjx0YWJsZSBjZWxscGFkZGluZz0nMCcgY2VsbHNwYWNpbmc9JzAnIHdpZHRoPScxMDAlJz5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIHN0eWxlPSdwYWRkaW5nOiAwcHg7Jz48dGFibGUgY2VsbHBhZGRpbmc9JzAnIGNlbGxzcGFjaW5nPScwJyB3aWR0aD0nMTAwJSc+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBhbGlnbj0nY2VudGVyJyBzdHlsZT0ncGFkZGluZzogMHB4Oyc+PHRhYmxlIGNlbGxwYWRkaW5nPScwJyBjZWxsc3BhY2luZz0nMCcgYm9yZGVyPScwJyBhbGlnbj0nY2VudGVyJyB3aWR0aD0nMjAnICBzdHlsZT0nYm9yZGVyOiAwcHggbm9uZTtoZWlnaHQ6IGF1dG87Jz5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIHZhbGlnbj0ndG9wJyBzdHlsZT0ncGFkZGluZzogMHB4Oyc+PGltZ1xcblwiICtcbiAgICAgICAgICAgIFwic3JjPSdodHRwczovL3NmMjYuc2VuZHNmeC5jb20vYWRtaW4vdGVtcC91c2VyLzE3L2ltZ184OTgzNzMxOC5wbmcnIHdpZHRoPScyMCcgaGVpZ2h0PScyMCcgYWx0PVxcXCJcXFwiIGJvcmRlcj0nMCcgc3R5bGU9J2Rpc3BsYXk6IGJsb2NrOycgY2xhc3M9J2ltZzIweDIwJyAvPjwvdGQ+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGFibGU+PC90ZD5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90YWJsZT48L3RkPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RhYmxlPjwvdGQ+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGFibGU+PC90ZD5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90YWJsZT5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8IS0tW2lmIGd0ZSBtc28gOV0+PC90ZD48dGQgdmFsaWduPSd0b3AnIHN0eWxlPSdwYWRkaW5nOjA7Jz48IVtlbmRpZl0tLT5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGFibGUgY2VsbHBhZGRpbmc9JzAnIGNlbGxzcGFjaW5nPScwJyBib3JkZXI9JzAnIGFsaWduPSdsZWZ0JyB3aWR0aD0nMzM2JyAgc3R5bGU9J2Zsb2F0OiBsZWZ0OycgY2xhc3M9J2MzMzZwNjByJz5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIHZhbGlnbj0ndG9wJyBzdHlsZT0ncGFkZGluZzogMHB4Oyc+PHRhYmxlIGNlbGxwYWRkaW5nPScwJyBjZWxsc3BhY2luZz0nMCcgYm9yZGVyPScwJyB3aWR0aD0nMTAwJSc+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCB2YWxpZ249J3RvcCcgc3R5bGU9J3BhZGRpbmctYm90dG9tOiAzMHB4Oyc+PHRhYmxlIGNlbGxwYWRkaW5nPScwJyBjZWxsc3BhY2luZz0nMCcgd2lkdGg9JzEwMCUnPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgc3R5bGU9J3BhZGRpbmc6IDBweDsnPjx0YWJsZSBjZWxscGFkZGluZz0nMCcgY2VsbHNwYWNpbmc9JzAnIGJvcmRlcj0nMCcgd2lkdGg9JzEwMCUnIHN0eWxlPSdib3JkZXItdG9wOiAycHggc29saWQgI2ZmZmZmZjsnPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgdmFsaWduPSd0b3AnPjx0YWJsZSBjZWxscGFkZGluZz0nMCcgY2VsbHNwYWNpbmc9JzAnIHdpZHRoPScxMDAlJz5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIHN0eWxlPSdwYWRkaW5nOiAwcHg7Jz48L3RkPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RhYmxlPjwvdGQ+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGFibGU+PC90ZD5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90YWJsZT48L3RkPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RhYmxlPjwvdGQ+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGFibGU+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPCEtLVtpZiBndGUgbXNvIDldPjwvdGQ+PHRkIHZhbGlnbj0ndG9wJyBzdHlsZT0ncGFkZGluZzowOyc+PCFbZW5kaWZdLS0+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRhYmxlIGNlbGxwYWRkaW5nPScwJyBjZWxsc3BhY2luZz0nMCcgYm9yZGVyPScwJyBhbGlnbj0nbGVmdCcgd2lkdGg9JzExMicgIHN0eWxlPSdmbG9hdDogbGVmdDsnIGNsYXNzPSdjMTEycDIwcic+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCB2YWxpZ249J3RvcCcgc3R5bGU9J3BhZGRpbmc6IDBweDsnPjx0YWJsZSBjZWxscGFkZGluZz0nMCcgY2VsbHNwYWNpbmc9JzAnIGJvcmRlcj0nMCcgd2lkdGg9JzEwMCUnIHN0eWxlPSdib3JkZXI6IDBweCBub25lOycgY2xhc3M9J2hpZGUnPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgdmFsaWduPSd0b3AnIHN0eWxlPSdwYWRkaW5nOiAwcHg7Jz48dGFibGUgY2VsbHBhZGRpbmc9JzAnIGNlbGxzcGFjaW5nPScwJyB3aWR0aD0nMTAwJSc+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBzdHlsZT0ncGFkZGluZzogMHB4Oyc+PHRhYmxlIGNlbGxwYWRkaW5nPScwJyBjZWxsc3BhY2luZz0nMCcgd2lkdGg9JzEwMCUnPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgYWxpZ249J2NlbnRlcicgc3R5bGU9J3BhZGRpbmc6IDBweDsnPjx0YWJsZSBjZWxscGFkZGluZz0nMCcgY2VsbHNwYWNpbmc9JzAnIGJvcmRlcj0nMCcgYWxpZ249J2NlbnRlcicgd2lkdGg9JzIwJyAgc3R5bGU9J2JvcmRlcjogMHB4IG5vbmU7aGVpZ2h0OiBhdXRvOyc+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCB2YWxpZ249J3RvcCcgc3R5bGU9J3BhZGRpbmc6IDBweDsnPjxpbWcgc3JjPSdodHRwczovL3NmMjYuc2VuZHNmeC5jb20vYWRtaW4vdGVtcC91c2VyLzE3L2ltZ184OTgzNzMxOC5wbmcnIHdpZHRoPScyMCcgaGVpZ2h0PScyMCcgYWx0PVxcXCJcXFwiIGJvcmRlcj0nMCcgc3R5bGU9J2Rpc3BsYXk6IGJsb2NrOycgY2xhc3M9J2ltZzIweDIwJ1xcblwiICtcbiAgICAgICAgICAgIFwiLz48L3RkPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RhYmxlPjwvdGQ+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGFibGU+PC90ZD5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90YWJsZT48L3RkPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RhYmxlPjwvdGQ+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGFibGU+PC90ZD5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90YWJsZT5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGFibGUgY2VsbHBhZGRpbmc9JzAnIGNlbGxzcGFjaW5nPScwJyBib3JkZXI9JzAnIHdpZHRoPScxMDAlJz5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIHZhbGlnbj0ndG9wJyBzdHlsZT0ncGFkZGluZy1ib3R0b206IDIwcHg7Jz48ZGl2IHN0eWxlPSd0ZXh0LWFsaWduOiBsZWZ0O2ZvbnQtZmFtaWx5OiBhcmlhbDtmb250LXNpemU6IDE2cHg7Y29sb3I6ICNmZmZmZmY7bGluZS1oZWlnaHQ6IDI2cHg7bXNvLWxpbmUtaGVpZ2h0OiBleGFjdGx5O21zby10ZXh0LXJhaXNlOiA1cHg7Jz5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwIHN0eWxlPSdwYWRkaW5nOiAwOyBtYXJnaW46IDA7dGV4dC1hbGlnbjogY2VudGVyOyc+VmllbGVuIERhbmssIGRhc3MgU2llIHNpY2ggZsO8ciB1bnNlcmVuIE5ld3NsZXR0ZXIgYW5nZW1lbGRldCBoYWJlbi48L3A+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cCBzdHlsZT0ncGFkZGluZzogMDsgbWFyZ2luOiAwO3RleHQtYWxpZ246IGNlbnRlcjsnPlVtIGRpZXNlIEUtTWFpbC1BZHJlc3NlIHVuZCBJaHJlIGtvc3Rlbmxvc2UgQW5tZWxkdW5nIHp1IGJlc3TDpHRpZ2VuLCBrbGlja2VuIFNpZSBiaXR0ZSBqZXR6dCBhdWYgZGVuIGZvbGdlbmRlbiBCdXR0b246PC9wPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PjwvdGQ+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGFibGU+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRhYmxlIGNlbGxwYWRkaW5nPScwJyBjZWxsc3BhY2luZz0nMCcgd2lkdGg9JzEwMCUnPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgYWxpZ249J2NlbnRlcicgc3R5bGU9J3BhZGRpbmc6IDBweDsnPjx0YWJsZSBjZWxscGFkZGluZz0nMCcgY2VsbHNwYWNpbmc9JzAnIGJvcmRlcj0nMCcgYWxpZ249J2NlbnRlcicgc3R5bGU9J3RleHQtYWxpZ246IGNlbnRlcjtjb2xvcjogIzAwMDsnIGNsYXNzPSdmdWxsLXdpZHRoJz5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIHZhbGlnbj0ndG9wJyBhbGlnbj0nY2VudGVyJyBzdHlsZT0ncGFkZGluZy1yaWdodDogMTBweDtwYWRkaW5nLWJvdHRvbTogMzBweDtwYWRkaW5nLWxlZnQ6IDEwcHg7Jz48dGFibGUgY2VsbHBhZGRpbmc9JzAnIGNlbGxzcGFjaW5nPScwJyBib3JkZXI9JzAnIGJnY29sb3I9JyM4NWFjMWMnIHN0eWxlPSdib3JkZXI6IDBweCBub25lO2JvcmRlci1yYWRpdXM6IDVweDtib3JkZXItY29sbGFwc2U6IHNlcGFyYXRlICFpbXBvcnRhbnQ7YmFja2dyb3VuZC1jb2xvcjogIzg1YWMxYzsnIGNsYXNzPSdmdWxsLXdpZHRoJz5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIHZhbGlnbj0ndG9wJyBhbGlnbj0nY2VudGVyJyBzdHlsZT0ncGFkZGluZzogMTJweDsnPjxhIGhyZWY9JyR7Y29uZmlybWF0aW9uX3VybH0nIHRhcmdldD0nX2JsYW5rJyBzdHlsZT0ndGV4dC1kZWNvcmF0aW9uOiBub25lOycgY2xhc3M9J2VkbV9idXR0b24nPjxzcGFuIHN0eWxlPSdmb250LWZhbWlseTogYXJpYWw7Zm9udC1zaXplOiAxOHB4O2NvbG9yOiAjZmZmZmZmO2xpbmUtaGVpZ2h0OiAyOHB4O3RleHQtZGVjb3JhdGlvbjogbm9uZTsnPjxzcGFuXFxuXCIgK1xuICAgICAgICAgICAgXCJzdHlsZT0nZm9udC1zaXplOiAxOHB4Oyc+SmV0enQgQW5tZWxkdW5nIGJlc3QmYXVtbDt0aWdlbjwvc3Bhbj48L3NwYW4+IDwvYT48L3RkPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RhYmxlPjwvdGQ+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGFibGU+PC90ZD5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90YWJsZT5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPSd0ZXh0LWFsaWduOiBsZWZ0O2ZvbnQtZmFtaWx5OiBhcmlhbDtmb250LXNpemU6IDEycHg7Y29sb3I6ICNmZmZmZmY7bGluZS1oZWlnaHQ6IDIycHg7bXNvLWxpbmUtaGVpZ2h0OiBleGFjdGx5O21zby10ZXh0LXJhaXNlOiA1cHg7Jz5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwIHN0eWxlPSdwYWRkaW5nOiAwOyBtYXJnaW46IDA7dGV4dC1hbGlnbjogY2VudGVyOyc+V2VubiBTaWUgaWhyZSBFLU1haWwtQWRyZXNzZSBuaWNodCBiZXN0w6R0aWdlbiwga8O2bm5lbiBrZWluZSBOZXdzbGV0dGVyIHp1Z2VzdGVsbHQgd2VyZGVuLiBJaHIgRWludmVyc3TDpG5kbmlzIGvDtm5uZW4gU2llIHNlbGJzdHZlcnN0w6RuZGxpY2ggamVkZXJ6ZWl0IHdpZGVycnVmZW4uIFNvbGx0ZSBlcyBzaWNoIGJlaSBkZXIgQW5tZWxkdW5nIHVtIGVpbiBWZXJzZWhlbiBoYW5kZWxuIG9kZXIgd3VyZGUgZGVyIE5ld3NsZXR0ZXIgbmljaHQgaW4gSWhyZW0gTmFtZW4gYmVzdGVsbHQsIGvDtm5uZW4gU2llIGRpZXNlIEUtTWFpbCBlaW5mYWNoIGlnbm9yaWVyZW4uIElobmVuIHdlcmRlbiBrZWluZSB3ZWl0ZXJlbiBOYWNocmljaHRlbiB6dWdlc2NoaWNrdC48L3A+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+PC90ZD5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90YWJsZT48L3RkPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICA8L3RhYmxlPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgIDx0YWJsZSBjZWxscGFkZGluZz0nMCcgY2VsbHNwYWNpbmc9JzAnIGJvcmRlcj0nMCcgd2lkdGg9JzEwMCUnIGJnY29sb3I9JyNmZmZmZmYnIHN0eWxlPSdib3JkZXI6IDBweCBub25lO2JhY2tncm91bmQtY29sb3I6ICNmZmZmZmY7Jz5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIHZhbGlnbj0ndG9wJyBzdHlsZT0ncGFkZGluZy10b3A6IDMwcHg7cGFkZGluZy1yaWdodDogMjBweDtwYWRkaW5nLWJvdHRvbTogMzVweDtwYWRkaW5nLWxlZnQ6IDIwcHg7Jz48dGFibGUgY2VsbHBhZGRpbmc9JzAnIGNlbGxzcGFjaW5nPScwJyB3aWR0aD0nMTAwJSc+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBzdHlsZT0ncGFkZGluZzogMHB4Oyc+PHRhYmxlIGNlbGxwYWRkaW5nPScwJyBjZWxsc3BhY2luZz0nMCcgYm9yZGVyPScwJyB3aWR0aD0nMTAwJSc+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCB2YWxpZ249J3RvcCcgc3R5bGU9J3BhZGRpbmctYm90dG9tOiAyNXB4Oyc+PGRpdiBzdHlsZT0ndGV4dC1hbGlnbjogbGVmdDtmb250LWZhbWlseTogYXJpYWw7Zm9udC1zaXplOiAxMnB4O2NvbG9yOiAjMzMzMzMzO2xpbmUtaGVpZ2h0OiAyMnB4O21zby1saW5lLWhlaWdodDogZXhhY3RseTttc28tdGV4dC1yYWlzZTogNXB4Oyc+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cCBzdHlsZT0ncGFkZGluZzogMDsgbWFyZ2luOiAwO3RleHQtYWxpZ246IGNlbnRlcjsnPjxzcGFuIHN0eWxlPSdsaW5lLWhlaWdodDogMzsnPjxzdHJvbmc+S29udGFrdDwvc3Ryb25nPjwvc3Bhbj48YnI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlcnZpY2VAc2VuZGVmZmVjdC5kZTxicj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd3d3LnNlbmRlZmZlY3QuZGU8YnI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRlbGVmb246ICs0OSAoMCkgODU3MSAtIDk3IDM5IC0gNjktMDwvcD5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj48L3RkPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RhYmxlPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9J3RleHQtYWxpZ246IGxlZnQ7Zm9udC1mYW1pbHk6IGFyaWFsO2ZvbnQtc2l6ZTogMTJweDtjb2xvcjogIzMzMzMzMztsaW5lLWhlaWdodDogMjJweDttc28tbGluZS1oZWlnaHQ6IGV4YWN0bHk7bXNvLXRleHQtcmFpc2U6IDVweDsnPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHAgc3R5bGU9J3BhZGRpbmc6IDA7IG1hcmdpbjogMDt0ZXh0LWFsaWduOiBjZW50ZXI7Jz48c3BhbiBzdHlsZT0nbGluZS1oZWlnaHQ6IDM7Jz48c3Ryb25nPkltcHJlc3N1bTwvc3Ryb25nPjwvc3Bhbj48YnI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFuc2NocmlmdDogU2NodWxnYXNzZSA1LCBELTg0MzU5IFNpbWJhY2ggYW0gSW5uLCBlTWFpbDogc2VydmljZUBzZW5kZWZmZWN0LmRlPGJyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBCZXRyZWliZXI6IFdFQmFuaXplciBBRywgUmVnaXN0ZXJnZXJpY2h0OiBBbXRzZ2VyaWNodCBMYW5kc2h1dCBIUkIgNTE3NywgVXN0SWQuOiBERSAyMDY4IDYyIDA3MDxicj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVm9yc3RhbmQ6IE90dG1hciBOZXVidXJnZXIsIEF1ZnNpY2h0c3JhdDogVG9iaWFzIE5ldWJ1cmdlcjwvcD5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj48L3RkPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RhYmxlPjwvdGQ+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgIDwvdGFibGU+PC90ZD5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgIDwvdHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgPC90YWJsZT48L3RkPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgPC90cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICA8L3RhYmxlPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICA8L2Rpdj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgPCEtLSBjb250ZW50IGVuZCAtLT5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgIDwvY2VudGVyPjwvdGQ+XFxuXCIgK1xuICAgICAgICAgICAgXCIgIDwvdHI+XFxuXCIgK1xuICAgICAgICAgICAgXCI8L3RhYmxlPlwiXG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7XCJzdGF0dXNcIjogXCJzdWNjZXNzXCIsIFwiZGF0YVwiOiBkYXRhfTtcbiAgICB9XG4gIH1cbn0pO1xuIiwiaW1wb3J0IHsgQXBpLCBET0lfRkVUQ0hfUk9VVEUsIERPSV9DT05GSVJNQVRJT05fTk9USUZZX1JPVVRFIH0gZnJvbSAnLi4vcmVzdC5qcyc7XG5pbXBvcnQgYWRkT3B0SW4gZnJvbSAnLi4vLi4vLi4vLi4vaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9vcHQtaW5zL2FkZF9hbmRfd3JpdGVfdG9fYmxvY2tjaGFpbi5qcyc7XG5pbXBvcnQgdXBkYXRlT3B0SW5TdGF0dXMgZnJvbSAnLi4vLi4vLi4vLi4vaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9vcHQtaW5zL3VwZGF0ZV9zdGF0dXMuanMnO1xuaW1wb3J0IGdldERvaU1haWxEYXRhIGZyb20gJy4uLy4uLy4uLy4uL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvZGFwcHMvZ2V0X2RvaS1tYWlsLWRhdGEuanMnO1xuaW1wb3J0IHtsb2dFcnJvciwgbG9nU2VuZH0gZnJvbSBcIi4uLy4uLy4uLy4uL2ltcG9ydHMvc3RhcnR1cC9zZXJ2ZXIvbG9nLWNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7RE9JX0VYUE9SVF9ST1VURX0gZnJvbSBcIi4uL3Jlc3RcIjtcbmltcG9ydCBleHBvcnREb2lzIGZyb20gXCIuLi8uLi8uLi8uLi9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2RhcHBzL2V4cG9ydF9kb2lzXCI7XG5pbXBvcnQge09wdEluc30gZnJvbSBcIi4uLy4uLy4uLy4uL2ltcG9ydHMvYXBpL29wdC1pbnMvb3B0LWluc1wiO1xuaW1wb3J0IHtSb2xlc30gZnJvbSBcIm1ldGVvci9hbGFubmluZzpyb2xlc1wiO1xuXG4vL2Rva3Ugb2YgbWV0ZW9yLXJlc3RpdnVzIGh0dHBzOi8vZ2l0aHViLmNvbS9rYWhtYWxpL21ldGVvci1yZXN0aXZ1c1xuXG5BcGkuYWRkUm91dGUoRE9JX0NPTkZJUk1BVElPTl9OT1RJRllfUk9VVEUsIHtcbiAgcG9zdDoge1xuICAgIGF1dGhSZXF1aXJlZDogdHJ1ZSxcbiAgICAvL3JvbGVSZXF1aXJlZDogWydhZG1pbiddLFxuICAgIGFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBxUGFyYW1zID0gdGhpcy5xdWVyeVBhcmFtcztcbiAgICAgIGNvbnN0IGJQYXJhbXMgPSB0aGlzLmJvZHlQYXJhbXM7XG4gICAgICBsZXQgcGFyYW1zID0ge31cbiAgICAgIGlmKHFQYXJhbXMgIT09IHVuZGVmaW5lZCkgcGFyYW1zID0gey4uLnFQYXJhbXN9XG4gICAgICBpZihiUGFyYW1zICE9PSB1bmRlZmluZWQpIHBhcmFtcyA9IHsuLi5wYXJhbXMsIC4uLmJQYXJhbXN9XG5cbiAgICAgIGNvbnN0IHVpZCA9IHRoaXMudXNlcklkO1xuXG4gICAgICBpZighUm9sZXMudXNlcklzSW5Sb2xlKHVpZCwgJ2FkbWluJykgfHwgLy9pZiBpdHMgbm90IGFuIGFkbWluIGFsd2F5cyB1c2UgdWlkIGFzIG93bmVySWRcbiAgICAgICAgICAoUm9sZXMudXNlcklzSW5Sb2xlKHVpZCwgJ2FkbWluJykgJiYgKHBhcmFtc1tcIm93bmVySWRcIl09PW51bGwgfHwgcGFyYW1zW1wib3duZXJJZFwiXT09dW5kZWZpbmVkKSkpIHsgIC8vaWYgaXRzIGFuIGFkbWluIG9ubHkgdXNlIHVpZCBpbiBjYXNlIG5vIG93bmVySWQgd2FzIGdpdmVuXG4gICAgICAgICAgcGFyYW1zW1wib3duZXJJZFwiXSA9IHVpZDtcbiAgICAgIH1cblxuICAgICAgbG9nU2VuZCgncGFyYW1ldGVyIHJlY2VpdmVkIGZyb20gYnJvd3NlcjonLHBhcmFtcyk7XG4gICAgICBpZihwYXJhbXMuc2VuZGVyX21haWwuY29uc3RydWN0b3IgPT09IEFycmF5KXsgLy90aGlzIGlzIGEgU09JIHdpdGggY28tc3BvbnNvcnMgZmlyc3QgZW1haWwgaXMgbWFpbiBzcG9uc29yXG4gICAgICAgICAgcmV0dXJuIHByZXBhcmVDb0RPSShwYXJhbXMpO1xuICAgICAgfWVsc2V7XG4gICAgICAgICByZXR1cm4gcHJlcGFyZUFkZChwYXJhbXMpO1xuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgcHV0OiB7XG4gICAgYXV0aFJlcXVpcmVkOiBmYWxzZSxcbiAgICBhY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgcVBhcmFtcyA9IHRoaXMucXVlcnlQYXJhbXM7XG4gICAgICBjb25zdCBiUGFyYW1zID0gdGhpcy5ib2R5UGFyYW1zO1xuXG4gICAgICBsb2dTZW5kKCdxUGFyYW1zOicscVBhcmFtcyk7XG4gICAgICBsb2dTZW5kKCdiUGFyYW1zOicsYlBhcmFtcyk7XG5cbiAgICAgIGxldCBwYXJhbXMgPSB7fVxuICAgICAgaWYocVBhcmFtcyAhPT0gdW5kZWZpbmVkKSBwYXJhbXMgPSB7Li4ucVBhcmFtc31cbiAgICAgIGlmKGJQYXJhbXMgIT09IHVuZGVmaW5lZCkgcGFyYW1zID0gey4uLnBhcmFtcywgLi4uYlBhcmFtc31cbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHZhbCA9IHVwZGF0ZU9wdEluU3RhdHVzKHBhcmFtcyk7XG4gICAgICAgIGxvZ1NlbmQoJ29wdC1JbiBzdGF0dXMgdXBkYXRlZCcsdmFsKTtcbiAgICAgICAgcmV0dXJuIHtzdGF0dXM6ICdzdWNjZXNzJywgZGF0YToge21lc3NhZ2U6ICdPcHQtSW4gc3RhdHVzIHVwZGF0ZWQnfX07XG4gICAgICB9IGNhdGNoKGVycm9yKSB7XG4gICAgICAgIHJldHVybiB7c3RhdHVzQ29kZTogNTAwLCBib2R5OiB7c3RhdHVzOiAnZmFpbCcsIG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2V9fTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn0pO1xuXG5BcGkuYWRkUm91dGUoRE9JX0ZFVENIX1JPVVRFLCB7YXV0aFJlcXVpcmVkOiBmYWxzZX0sIHtcbiAgZ2V0OiB7XG4gICAgYWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IHBhcmFtcyA9IHRoaXMucXVlcnlQYXJhbXM7XG4gICAgICB0cnkge1xuICAgICAgICAgIGxvZ1NlbmQoJ3Jlc3QgYXBpIC0gRE9JX0ZFVENIX1JPVVRFIGNhbGxlZCBieSBib2IgdG8gcmVxdWVzdCBlbWFpbCB0ZW1wbGF0ZScsSlNPTi5zdHJpbmdpZnkocGFyYW1zKSk7XG4gICAgICAgICAgY29uc3QgZGF0YSA9IGdldERvaU1haWxEYXRhKHBhcmFtcyk7XG4gICAgICAgICAgbG9nU2VuZCgnZ290IGRvaS1tYWlsLWRhdGEgKGluY2x1ZGluZyB0ZW1wbGFsdGUpIHJldHVybmluZyB0byBib2InLHtzdWJqZWN0OmRhdGEuc3ViamVjdCwgcmVjaXBpZW50OmRhdGEucmVjaXBpZW50fSk7XG4gICAgICAgIHJldHVybiB7c3RhdHVzOiAnc3VjY2VzcycsIGRhdGF9O1xuICAgICAgfSBjYXRjaChlcnJvcikge1xuICAgICAgICBsb2dFcnJvcignZXJyb3Igd2hpbGUgZ2V0dGluZyBEb2lNYWlsRGF0YScsZXJyb3IpO1xuICAgICAgICByZXR1cm4ge3N0YXR1czogJ2ZhaWwnLCBlcnJvcjogZXJyb3IubWVzc2FnZX07XG4gICAgICB9XG4gICAgfVxuICB9XG59KTtcblxuQXBpLmFkZFJvdXRlKERPSV9FWFBPUlRfUk9VVEUsIHtcbiAgICBnZXQ6IHtcbiAgICAgICAgYXV0aFJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAvL3JvbGVSZXF1aXJlZDogWydhZG1pbiddLFxuICAgICAgICBhY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgbGV0IHBhcmFtcyA9IHRoaXMucXVlcnlQYXJhbXM7XG4gICAgICAgICAgICBjb25zdCB1aWQgPSB0aGlzLnVzZXJJZDtcbiAgICAgICAgICAgIGlmKCFSb2xlcy51c2VySXNJblJvbGUodWlkLCAnYWRtaW4nKSl7XG4gICAgICAgICAgICAgICAgcGFyYW1zID0ge3VzZXJpZDp1aWQscm9sZTondXNlcid9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICBwYXJhbXMgPSB7Li4ucGFyYW1zLHJvbGU6J2FkbWluJ31cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgbG9nU2VuZCgncmVzdCBhcGkgLSBET0lfRVhQT1JUX1JPVVRFIGNhbGxlZCcsSlNPTi5zdHJpbmdpZnkocGFyYW1zKSk7XG4gICAgICAgICAgICAgICAgY29uc3QgZGF0YSA9IGV4cG9ydERvaXMocGFyYW1zKTtcbiAgICAgICAgICAgICAgICBsb2dTZW5kKCdnb3QgZG9pcyBmcm9tIGRhdGFiYXNlJyxKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtzdGF0dXM6ICdzdWNjZXNzJywgZGF0YX07XG4gICAgICAgICAgICB9IGNhdGNoKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgbG9nRXJyb3IoJ2Vycm9yIHdoaWxlIGV4cG9ydGluZyBjb25maXJtZWQgZG9pcycsZXJyb3IpO1xuICAgICAgICAgICAgICAgIHJldHVybiB7c3RhdHVzOiAnZmFpbCcsIGVycm9yOiBlcnJvci5tZXNzYWdlfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn0pO1xuXG5mdW5jdGlvbiBwcmVwYXJlQ29ET0kocGFyYW1zKXtcblxuICAgIGxvZ1NlbmQoJ2lzIGFycmF5ICcscGFyYW1zLnNlbmRlcl9tYWlsKTtcblxuICAgIGNvbnN0IHNlbmRlcnMgPSBwYXJhbXMuc2VuZGVyX21haWw7XG4gICAgY29uc3QgcmVjaXBpZW50X21haWwgPSBwYXJhbXMucmVjaXBpZW50X21haWw7XG4gICAgY29uc3QgZGF0YSA9IHBhcmFtcy5kYXRhO1xuICAgIGNvbnN0IG93bmVySUQgPSBwYXJhbXMub3duZXJJZDtcblxuICAgIGxldCBjdXJyZW50T3B0SW5JZDtcbiAgICBsZXQgcmV0UmVzcG9uc2UgPSBbXTtcbiAgICBsZXQgbWFzdGVyX2RvaTtcbiAgICBzZW5kZXJzLmZvckVhY2goKHNlbmRlcixpbmRleCkgPT4ge1xuXG4gICAgICAgIGNvbnN0IHJldF9yZXNwb25zZSA9IHByZXBhcmVBZGQoe3NlbmRlcl9tYWlsOnNlbmRlcixyZWNpcGllbnRfbWFpbDpyZWNpcGllbnRfbWFpbCxkYXRhOmRhdGEsIG1hc3Rlcl9kb2k6bWFzdGVyX2RvaSwgaW5kZXg6IGluZGV4LCBvd25lcklkOm93bmVySUR9KTtcbiAgICAgICAgbG9nU2VuZCgnQ29ET0k6JyxyZXRfcmVzcG9uc2UpO1xuICAgICAgICBpZihyZXRfcmVzcG9uc2Uuc3RhdHVzID09PSB1bmRlZmluZWQgfHwgcmV0X3Jlc3BvbnNlLnN0YXR1cz09PVwiZmFpbGVkXCIpIHRocm93IFwiY291bGQgbm90IGFkZCBjby1vcHQtaW5cIjtcbiAgICAgICAgcmV0UmVzcG9uc2UucHVzaChyZXRfcmVzcG9uc2UpO1xuICAgICAgICBjdXJyZW50T3B0SW5JZCA9IHJldF9yZXNwb25zZS5kYXRhLmlkO1xuXG4gICAgICAgIGlmKGluZGV4PT09MClcbiAgICAgICAge1xuICAgICAgICAgICAgbG9nU2VuZCgnbWFpbiBzcG9uc29yIG9wdEluSWQ6JyxjdXJyZW50T3B0SW5JZCk7XG4gICAgICAgICAgICBjb25zdCBvcHRJbiA9IE9wdElucy5maW5kT25lKHtfaWQ6IGN1cnJlbnRPcHRJbklkfSk7XG4gICAgICAgICAgICBtYXN0ZXJfZG9pID0gb3B0SW4ubmFtZUlkO1xuICAgICAgICAgICAgbG9nU2VuZCgnbWFpbiBzcG9uc29yIG5hbWVJZDonLG1hc3Rlcl9kb2kpO1xuICAgICAgICB9XG5cbiAgICB9KTtcblxuICAgIGxvZ1NlbmQocmV0UmVzcG9uc2UpO1xuXG4gICAgcmV0dXJuIHJldFJlc3BvbnNlO1xufVxuXG5mdW5jdGlvbiBwcmVwYXJlQWRkKHBhcmFtcyl7XG5cbiAgICB0cnkge1xuICAgICAgICBjb25zdCB2YWwgPSBhZGRPcHRJbihwYXJhbXMpO1xuICAgICAgICBsb2dTZW5kKCdvcHQtSW4gYWRkZWQgSUQ6Jyx2YWwpO1xuICAgICAgICByZXR1cm4ge3N0YXR1czogJ3N1Y2Nlc3MnLCBkYXRhOiB7aWQ6IHZhbCwgc3RhdHVzOiAnc3VjY2VzcycsIG1lc3NhZ2U6ICdPcHQtSW4gYWRkZWQuJ319O1xuICAgIH0gY2F0Y2goZXJyb3IpIHtcbiAgICAgICAgcmV0dXJuIHtzdGF0dXNDb2RlOiA1MDAsIGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogZXJyb3IubWVzc2FnZX19O1xuICAgIH1cbn0iLCJpbXBvcnQgeyBBcGkgfSBmcm9tICcuLi9yZXN0LmpzJztcbmltcG9ydCB7Z2V0SW5mb30gZnJvbSBcIi4uLy4uL2RvaWNoYWluXCI7XG5pbXBvcnQgeyBDT05GSVJNX0NMSUVOVCxTRU5EX0NMSUVOVH0gZnJvbSBcIi4uLy4uLy4uLy4uL2ltcG9ydHMvc3RhcnR1cC9zZXJ2ZXIvZG9pY2hhaW4tY29uZmlndXJhdGlvblwiO1xuXG5BcGkuYWRkUm91dGUoJ3N0YXR1cycsIHthdXRoUmVxdWlyZWQ6IGZhbHNlfSwge1xuICBnZXQ6IHtcbiAgICBhY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgZGF0YSA9IGdldEluZm8oU0VORF9DTElFTlQ/U0VORF9DTElFTlQ6Q09ORklSTV9DTElFTlQpO1xuICAgICAgICByZXR1cm4ge1wic3RhdHVzXCI6IFwic3VjY2Vzc1wiLCBcImRhdGFcIjpkYXRhfTtcbiAgICAgIH1jYXRjaChleCl7XG4gICAgICAgICAgICByZXR1cm4ge1wic3RhdHVzXCI6IFwiZmFpbGVkXCIsIFwiZGF0YVwiOiBleC50b1N0cmluZygpfTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn0pO1xuIiwiaW1wb3J0IHsgQXBpIH0gZnJvbSAnLi4vcmVzdC5qcyc7XG5pbXBvcnQge01ldGVvcn0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQge0FjY291bnRzfSBmcm9tICdtZXRlb3IvYWNjb3VudHMtYmFzZSdcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcbmltcG9ydCB7Um9sZXN9IGZyb20gXCJtZXRlb3IvYWxhbm5pbmc6cm9sZXNcIjtcbmltcG9ydCB7bG9nTWFpbn0gZnJvbSBcIi4uLy4uLy4uLy4uL2ltcG9ydHMvc3RhcnR1cC9zZXJ2ZXIvbG9nLWNvbmZpZ3VyYXRpb25cIjtcblxuY29uc3QgbWFpbFRlbXBsYXRlU2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gICAgc3ViamVjdDoge1xuICAgICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICAgIG9wdGlvbmFsOnRydWUgXG4gICAgfSxcbiAgICByZWRpcmVjdDoge1xuICAgICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICAgIHJlZ0V4OiBcIkAoaHR0cHM/fGZ0cCk6Ly8oLVxcXFwuKT8oW15cXFxccy8/XFxcXC4jLV0rXFxcXC4/KSsoL1teXFxcXHNdKik/JEBcIixcbiAgICAgICAgb3B0aW9uYWw6dHJ1ZSBcbiAgICB9LFxuICAgIHJldHVyblBhdGg6IHtcbiAgICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgICByZWdFeDogU2ltcGxlU2NoZW1hLlJlZ0V4LkVtYWlsLFxuICAgICAgICBvcHRpb25hbDp0cnVlIFxuICAgIH0sXG4gICAgdGVtcGxhdGVVUkw6e1xuICAgICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICAgIHJlZ0V4OiBcIkAoaHR0cHM/fGZ0cCk6Ly8oLVxcXFwuKT8oW15cXFxccy8/XFxcXC4jLV0rXFxcXC4/KSsoL1teXFxcXHNdKik/JEBcIixcbiAgICAgICAgb3B0aW9uYWw6dHJ1ZSBcbiAgICB9XG59KTtcblxuY29uc3QgY3JlYXRlVXNlclNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICAgIHVzZXJuYW1lOiB7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICByZWdFeDogXCJeW0EtWixhLXosMC05LCEsXywkLCNdezQsMjR9JFwiICAvL09ubHkgdXNlcm5hbWVzIGJldHdlZW4gNC0yNCBjaGFyYWN0ZXJzIGZyb20gQS1aLGEteiwwLTksISxfLCQsIyBhbGxvd2VkXG4gICAgfSxcbiAgICBlbWFpbDoge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgcmVnRXg6IFNpbXBsZVNjaGVtYS5SZWdFeC5FbWFpbFxuICAgIH0sXG4gICAgcGFzc3dvcmQ6IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIHJlZ0V4OiBcIl5bQS1aLGEteiwwLTksISxfLCQsI117OCwyNH0kXCIgLy9Pbmx5IHBhc3N3b3JkcyBiZXR3ZWVuIDgtMjQgY2hhcmFjdGVycyBmcm9tIEEtWixhLXosMC05LCEsXywkLCMgYWxsb3dlZFxuICAgIH0sXG4gICAgbWFpbFRlbXBsYXRlOntcbiAgICAgICAgdHlwZTogbWFpbFRlbXBsYXRlU2NoZW1hLFxuICAgICAgICBvcHRpb25hbDp0cnVlIFxuICAgIH1cbiAgfSk7XG4gIGNvbnN0IHVwZGF0ZVVzZXJTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgICBtYWlsVGVtcGxhdGU6e1xuICAgICAgICB0eXBlOiBtYWlsVGVtcGxhdGVTY2hlbWFcbiAgICB9XG59KTtcblxuLy9UT0RPOiBjb2xsZWN0aW9uIG9wdGlvbnMgc2VwYXJhdGVcbmNvbnN0IGNvbGxlY3Rpb25PcHRpb25zID1cbiAge1xuICAgIHBhdGg6XCJ1c2Vyc1wiLFxuICAgIHJvdXRlT3B0aW9uczpcbiAgICB7XG4gICAgICAgIGF1dGhSZXF1aXJlZCA6IHRydWVcbiAgICAgICAgLy8scm9sZVJlcXVpcmVkIDogXCJhZG1pblwiXG4gICAgfSxcbiAgICBleGNsdWRlZEVuZHBvaW50czogWydwYXRjaCcsJ2RlbGV0ZUFsbCddLFxuICAgIGVuZHBvaW50czpcbiAgICB7XG4gICAgICAgIGRlbGV0ZTp7cm9sZVJlcXVpcmVkIDogXCJhZG1pblwifSxcbiAgICAgICAgcG9zdDpcbiAgICAgICAge1xuICAgICAgICAgICAgcm9sZVJlcXVpcmVkIDogXCJhZG1pblwiLFxuICAgICAgICAgICAgYWN0aW9uOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIGNvbnN0IHFQYXJhbXMgPSB0aGlzLnF1ZXJ5UGFyYW1zO1xuICAgICAgICAgICAgICAgIGNvbnN0IGJQYXJhbXMgPSB0aGlzLmJvZHlQYXJhbXM7XG4gICAgICAgICAgICAgICAgbGV0IHBhcmFtcyA9IHt9O1xuICAgICAgICAgICAgICAgIGlmKHFQYXJhbXMgIT09IHVuZGVmaW5lZCkgcGFyYW1zID0gey4uLnFQYXJhbXN9XG4gICAgICAgICAgICAgICAgaWYoYlBhcmFtcyAhPT0gdW5kZWZpbmVkKSBwYXJhbXMgPSB7Li4ucGFyYW1zLCAuLi5iUGFyYW1zfVxuICAgICAgICAgICAgICAgIHRyeXtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHVzZXJJZDtcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlVXNlclNjaGVtYS52YWxpZGF0ZShwYXJhbXMpO1xuICAgICAgICAgICAgICAgICAgICBsb2dNYWluKCd2YWxpZGF0ZWQnLHBhcmFtcyk7XG4gICAgICAgICAgICAgICAgICAgIGlmKHBhcmFtcy5tYWlsVGVtcGxhdGUgIT09IHVuZGVmaW5lZCl7XG4gICAgICAgICAgICAgICAgICAgICAgICB1c2VySWQgPSBBY2NvdW50cy5jcmVhdGVVc2VyKHt1c2VybmFtZTpwYXJhbXMudXNlcm5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW1haWw6cGFyYW1zLmVtYWlsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhc3N3b3JkOnBhcmFtcy5wYXNzd29yZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9maWxlOnttYWlsVGVtcGxhdGU6cGFyYW1zLm1haWxUZW1wbGF0ZX19KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgICAgICAgICAgdXNlcklkID0gQWNjb3VudHMuY3JlYXRlVXNlcih7dXNlcm5hbWU6cGFyYW1zLnVzZXJuYW1lLGVtYWlsOnBhcmFtcy5lbWFpbCxwYXNzd29yZDpwYXJhbXMucGFzc3dvcmQsIHByb2ZpbGU6e319KTtcbiAgICAgICAgICAgICAgICAgICAgfSAgICBcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtzdGF0dXM6ICdzdWNjZXNzJywgZGF0YToge3VzZXJpZDogdXNlcklkfX07XG4gICAgICAgICAgICAgICAgfSBjYXRjaChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIHtzdGF0dXNDb2RlOiA0MDAsIGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogZXJyb3IubWVzc2FnZX19O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgcHV0OlxuICAgICAgICB7XG4gICAgICAgICAgICBhY3Rpb246IGZ1bmN0aW9uKCl7ICAgICAgXG4gICAgICAgICAgICAgICAgY29uc3QgcVBhcmFtcyA9IHRoaXMucXVlcnlQYXJhbXM7XG4gICAgICAgICAgICAgICAgY29uc3QgYlBhcmFtcyA9IHRoaXMuYm9keVBhcmFtcztcbiAgICAgICAgICAgICAgICBsZXQgcGFyYW1zID0ge307XG4gICAgICAgICAgICAgICAgbGV0IHVpZD10aGlzLnVzZXJJZDtcbiAgICAgICAgICAgICAgICBjb25zdCBwYXJhbUlkPXRoaXMudXJsUGFyYW1zLmlkO1xuICAgICAgICAgICAgICAgIGlmKHFQYXJhbXMgIT09IHVuZGVmaW5lZCkgcGFyYW1zID0gey4uLnFQYXJhbXN9XG4gICAgICAgICAgICAgICAgaWYoYlBhcmFtcyAhPT0gdW5kZWZpbmVkKSBwYXJhbXMgPSB7Li4ucGFyYW1zLCAuLi5iUGFyYW1zfVxuXG4gICAgICAgICAgICAgICAgdHJ5eyAvL1RPRE8gdGhpcyBpcyBub3QgbmVjZXNzYXJ5IGhlcmUgYW5kIGNhbiBwcm9iYWJseSBnbyByaWdodCBpbnRvIHRoZSBkZWZpbml0aW9uIG9mIHRoZSBSRVNUIE1FVEhPRCBuZXh0IHRvIHB1dCAoIT8hKVxuICAgICAgICAgICAgICAgICAgICBpZighUm9sZXMudXNlcklzSW5Sb2xlKHVpZCwgJ2FkbWluJykpe1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYodWlkIT09cGFyYW1JZCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJObyBQZXJtaXNzaW9uXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZVVzZXJTY2hlbWEudmFsaWRhdGUocGFyYW1zKTtcbiAgICAgICAgICAgICAgICAgICAgaWYoIU1ldGVvci51c2Vycy51cGRhdGUodGhpcy51cmxQYXJhbXMuaWQseyRzZXQ6e1wicHJvZmlsZS5tYWlsVGVtcGxhdGVcIjpwYXJhbXMubWFpbFRlbXBsYXRlfX0pKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IEVycm9yKFwiRmFpbGVkIHRvIHVwZGF0ZSB1c2VyXCIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7c3RhdHVzOiAnc3VjY2VzcycsIGRhdGE6IHt1c2VyaWQ6IHRoaXMudXJsUGFyYW1zLmlkLCBtYWlsVGVtcGxhdGU6cGFyYW1zLm1haWxUZW1wbGF0ZX19O1xuICAgICAgICAgICAgICAgIH0gY2F0Y2goZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiB7c3RhdHVzQ29kZTogNDAwLCBib2R5OiB7c3RhdHVzOiAnZmFpbCcsIG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2V9fTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5BcGkuYWRkQ29sbGVjdGlvbihNZXRlb3IudXNlcnMsY29sbGVjdGlvbk9wdGlvbnMpOyIsImltcG9ydCB7IEFwaSB9IGZyb20gJy4uL3Jlc3QuanMnO1xuaW1wb3J0IHZlcmlmeU9wdEluIGZyb20gJy4uLy4uLy4uLy4uL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvb3B0LWlucy92ZXJpZnkuanMnO1xuXG5BcGkuYWRkUm91dGUoJ29wdC1pbi92ZXJpZnknLCB7YXV0aFJlcXVpcmVkOiB0cnVlfSwge1xuICBnZXQ6IHtcbiAgICBhdXRoUmVxdWlyZWQ6IGZhbHNlLFxuICAgIGFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnN0IHFQYXJhbXMgPSB0aGlzLnF1ZXJ5UGFyYW1zO1xuICAgICAgICBjb25zdCBiUGFyYW1zID0gdGhpcy5ib2R5UGFyYW1zO1xuICAgICAgICBsZXQgcGFyYW1zID0ge31cbiAgICAgICAgaWYocVBhcmFtcyAhPT0gdW5kZWZpbmVkKSBwYXJhbXMgPSB7Li4ucVBhcmFtc31cbiAgICAgICAgaWYoYlBhcmFtcyAhPT0gdW5kZWZpbmVkKSBwYXJhbXMgPSB7Li4ucGFyYW1zLCAuLi5iUGFyYW1zfVxuXG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCB2YWwgPSB2ZXJpZnlPcHRJbihwYXJhbXMpO1xuICAgICAgICByZXR1cm4ge3N0YXR1czogXCJzdWNjZXNzXCIsIGRhdGE6IHt2YWx9fTtcbiAgICAgIH0gY2F0Y2goZXJyb3IpIHtcbiAgICAgICAgcmV0dXJuIHtzdGF0dXNDb2RlOiA1MDAsIGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogZXJyb3IubWVzc2FnZX19O1xuICAgICAgfVxuICAgIH1cbiAgfVxufSk7XG4iLCJpbXBvcnQgeyBSZXN0aXZ1cyB9IGZyb20gJ21ldGVvci9uaW1ibGU6cmVzdGl2dXMnO1xuaW1wb3J0IHsgaXNEZWJ1ZyB9IGZyb20gJy4uLy4uLy4uL2ltcG9ydHMvc3RhcnR1cC9zZXJ2ZXIvZGFwcC1jb25maWd1cmF0aW9uLmpzJztcbmltcG9ydCB7IFNFTkRfQVBQLCBDT05GSVJNX0FQUCwgVkVSSUZZX0FQUCwgaXNBcHBUeXBlIH0gZnJvbSAnLi4vLi4vLi4vaW1wb3J0cy9zdGFydHVwL3NlcnZlci90eXBlLWNvbmZpZ3VyYXRpb24uanMnO1xuXG5leHBvcnQgY29uc3QgRE9JX0NPTkZJUk1BVElPTl9ST1VURSA9IFwib3B0LWluL2NvbmZpcm1cIjtcbmV4cG9ydCBjb25zdCBET0lfQ09ORklSTUFUSU9OX05PVElGWV9ST1VURSA9IFwib3B0LWluXCI7XG5leHBvcnQgY29uc3QgRE9JX1dBTExFVE5PVElGWV9ST1VURSA9IFwid2FsbGV0bm90aWZ5XCI7XG5leHBvcnQgY29uc3QgRE9JX0ZFVENIX1JPVVRFID0gXCJkb2ktbWFpbFwiO1xuZXhwb3J0IGNvbnN0IERPSV9FWFBPUlRfUk9VVEUgPSBcImV4cG9ydFwiO1xuZXhwb3J0IGNvbnN0IEFQSV9QQVRIID0gXCJhcGkvXCI7XG5leHBvcnQgY29uc3QgVkVSU0lPTiA9IFwidjFcIjtcblxuZXhwb3J0IGNvbnN0IEFwaSA9IG5ldyBSZXN0aXZ1cyh7XG4gIGFwaVBhdGg6IEFQSV9QQVRILFxuICB2ZXJzaW9uOiBWRVJTSU9OLFxuICB1c2VEZWZhdWx0QXV0aDogdHJ1ZSxcbiAgcHJldHR5SnNvbjogdHJ1ZVxufSk7XG5cbmlmKGlzRGVidWcoKSkgcmVxdWlyZSgnLi9pbXBvcnRzL2RlYnVnLmpzJyk7XG5pZihpc0FwcFR5cGUoU0VORF9BUFApKSByZXF1aXJlKCcuL2ltcG9ydHMvc2VuZC5qcycpO1xuaWYoaXNBcHBUeXBlKENPTkZJUk1fQVBQKSkgcmVxdWlyZSgnLi9pbXBvcnRzL2NvbmZpcm0uanMnKTtcbmlmKGlzQXBwVHlwZShWRVJJRllfQVBQKSkgcmVxdWlyZSgnLi9pbXBvcnRzL3ZlcmlmeS5qcycpO1xucmVxdWlyZSgnLi9pbXBvcnRzL3VzZXIuanMnKTtcbnJlcXVpcmUoJy4vaW1wb3J0cy9zdGF0dXMuanMnKTtcbiIsIlxuaW1wb3J0IHsgSm9iQ29sbGVjdGlvbixKb2IgfSBmcm9tICdtZXRlb3IvdnNpdnNpOmpvYi1jb2xsZWN0aW9uJztcbmV4cG9ydCBjb25zdCBCbG9ja2NoYWluSm9icyA9IEpvYkNvbGxlY3Rpb24oJ2Jsb2NrY2hhaW4nKTtcbmltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IGluc2VydCBmcm9tICcuLi8uLi9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2RvaWNoYWluL2luc2VydC5qcyc7XG5pbXBvcnQgdXBkYXRlIGZyb20gJy4uLy4uL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvZG9pY2hhaW4vdXBkYXRlLmpzJztcbi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovIC8vVE9ETyByZS1lbmFibGUgdGhpcyFcbmltcG9ydCBjaGVja05ld1RyYW5zYWN0aW9uIGZyb20gJy4uLy4uL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvZG9pY2hhaW4vY2hlY2tfbmV3X3RyYW5zYWN0aW9ucy5qcyc7XG5pbXBvcnQgeyBDT05GSVJNX0FQUCwgaXNBcHBUeXBlIH0gZnJvbSAnLi4vLi4vaW1wb3J0cy9zdGFydHVwL3NlcnZlci90eXBlLWNvbmZpZ3VyYXRpb24uanMnO1xuaW1wb3J0IHtsb2dNYWlufSBmcm9tIFwiLi4vLi4vaW1wb3J0cy9zdGFydHVwL3NlcnZlci9sb2ctY29uZmlndXJhdGlvblwiO1xuXG5CbG9ja2NoYWluSm9icy5wcm9jZXNzSm9icygnaW5zZXJ0Jywge3dvcmtUaW1lb3V0OiAzMCoxMDAwfSxmdW5jdGlvbiAoam9iLCBjYikge1xuICB0cnkge1xuICAgIGNvbnN0IGVudHJ5ID0gam9iLmRhdGE7XG4gICAgaW5zZXJ0KGVudHJ5KTtcbiAgICBqb2IuZG9uZSgpO1xuICB9IGNhdGNoKGV4Y2VwdGlvbikge1xuICAgIGpvYi5mYWlsKCk7XG5cbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2pvYnMuYmxvY2tjaGFpbi5pbnNlcnQuZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgfSBmaW5hbGx5IHtcbiAgICBjYigpO1xuICB9XG59KTtcblxuQmxvY2tjaGFpbkpvYnMucHJvY2Vzc0pvYnMoJ3VwZGF0ZScsIHt3b3JrVGltZW91dDogMzAqMTAwMH0sZnVuY3Rpb24gKGpvYiwgY2IpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCBlbnRyeSA9IGpvYi5kYXRhO1xuICAgIHVwZGF0ZShlbnRyeSxqb2IpO1xuICB9IGNhdGNoKGV4Y2VwdGlvbikge1xuICAgIGpvYi5mYWlsKCk7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignam9icy5ibG9ja2NoYWluLnVwZGF0ZS5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9IGZpbmFsbHkge1xuICAgIGNiKCk7XG4gIH1cbn0pO1xuXG5CbG9ja2NoYWluSm9icy5wcm9jZXNzSm9icygnY2hlY2tOZXdUcmFuc2FjdGlvbicsIHt3b3JrVGltZW91dDogMzAqMTAwMH0sZnVuY3Rpb24gKGpvYiwgY2IpIHtcbiAgdHJ5IHtcbiAgICBpZighaXNBcHBUeXBlKENPTkZJUk1fQVBQKSkge1xuICAgICAgam9iLnBhdXNlKCk7XG4gICAgICBqb2IuY2FuY2VsKCk7XG4gICAgICBqb2IucmVtb3ZlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vY2hlY2tOZXdUcmFuc2FjdGlvbihudWxsLGpvYik7XG4gICAgfVxuICB9IGNhdGNoKGV4Y2VwdGlvbikge1xuICAgIGpvYi5mYWlsKCk7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignam9icy5ibG9ja2NoYWluLmNoZWNrTmV3VHJhbnNhY3Rpb25zLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH0gZmluYWxseSB7XG4gICAgY2IoKTtcbiAgfVxufSk7XG5cbm5ldyBKb2IoQmxvY2tjaGFpbkpvYnMsICdjbGVhbnVwJywge30pXG4gICAgLnJlcGVhdCh7IHNjaGVkdWxlOiBCbG9ja2NoYWluSm9icy5sYXRlci5wYXJzZS50ZXh0KFwiZXZlcnkgNSBtaW51dGVzXCIpIH0pXG4gICAgLnNhdmUoe2NhbmNlbFJlcGVhdHM6IHRydWV9KTtcblxubGV0IHEgPSBCbG9ja2NoYWluSm9icy5wcm9jZXNzSm9icygnY2xlYW51cCcseyBwb2xsSW50ZXJ2YWw6IGZhbHNlLCB3b3JrVGltZW91dDogNjAqMTAwMCB9ICxmdW5jdGlvbiAoam9iLCBjYikge1xuICBjb25zdCBjdXJyZW50ID0gbmV3IERhdGUoKVxuICAgIGN1cnJlbnQuc2V0TWludXRlcyhjdXJyZW50LmdldE1pbnV0ZXMoKSAtIDUpO1xuXG4gIGNvbnN0IGlkcyA9IEJsb2NrY2hhaW5Kb2JzLmZpbmQoe1xuICAgICAgICAgIHN0YXR1czogeyRpbjogSm9iLmpvYlN0YXR1c1JlbW92YWJsZX0sXG4gICAgICAgICAgdXBkYXRlZDogeyRsdDogY3VycmVudH19LFxuICAgICAgICAgIHtmaWVsZHM6IHsgX2lkOiAxIH19KTtcblxuICAgIGxvZ01haW4oJ2ZvdW5kICByZW1vdmFibGUgYmxvY2tjaGFpbiBqb2JzOicsaWRzKTtcbiAgICBCbG9ja2NoYWluSm9icy5yZW1vdmVKb2JzKGlkcyk7XG4gICAgaWYoaWRzLmxlbmd0aCA+IDApe1xuICAgICAgam9iLmRvbmUoXCJSZW1vdmVkICN7aWRzLmxlbmd0aH0gb2xkIGpvYnNcIik7XG4gICAgfVxuICAgIGNiKCk7XG59KTtcblxuQmxvY2tjaGFpbkpvYnMuZmluZCh7IHR5cGU6ICdqb2JUeXBlJywgc3RhdHVzOiAncmVhZHknIH0pXG4gICAgLm9ic2VydmUoe1xuICAgICAgICBhZGRlZDogZnVuY3Rpb24gKCkgeyBxLnRyaWdnZXIoKTsgfVxuICAgIH0pO1xuIiwiaW1wb3J0IHsgSm9iQ29sbGVjdGlvbiwgSm9iIH0gZnJvbSAnbWV0ZW9yL3ZzaXZzaTpqb2ItY29sbGVjdGlvbic7XG5pbXBvcnQgZmV0Y2hEb2lNYWlsRGF0YSBmcm9tICcuLi8uLi9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2RhcHBzL2ZldGNoX2RvaS1tYWlsLWRhdGEuanMnO1xuaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQge2xvZ01haW59IGZyb20gXCIuLi8uLi9pbXBvcnRzL3N0YXJ0dXAvc2VydmVyL2xvZy1jb25maWd1cmF0aW9uXCI7XG5pbXBvcnQge0Jsb2NrY2hhaW5Kb2JzfSBmcm9tIFwiLi9ibG9ja2NoYWluX2pvYnNcIjtcblxuZXhwb3J0IGNvbnN0IERBcHBKb2JzID0gSm9iQ29sbGVjdGlvbignZGFwcCcpO1xuXG5EQXBwSm9icy5wcm9jZXNzSm9icygnZmV0Y2hEb2lNYWlsRGF0YScsIGZ1bmN0aW9uIChqb2IsIGNiKSB7XG4gIHRyeSB7XG4gICAgY29uc3QgZGF0YSA9IGpvYi5kYXRhO1xuICAgIGZldGNoRG9pTWFpbERhdGEoZGF0YSk7XG4gICAgam9iLmRvbmUoKTtcbiAgfSBjYXRjaChleGNlcHRpb24pIHtcbiAgICBqb2IuZmFpbCgpO1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2pvYnMuZGFwcC5mZXRjaERvaU1haWxEYXRhLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH0gZmluYWxseSB7XG4gICAgY2IoKTtcbiAgfVxufSk7XG5cblxubmV3IEpvYihEQXBwSm9icywgJ2NsZWFudXAnLCB7fSlcbiAgICAucmVwZWF0KHsgc2NoZWR1bGU6IERBcHBKb2JzLmxhdGVyLnBhcnNlLnRleHQoXCJldmVyeSA1IG1pbnV0ZXNcIikgfSlcbiAgICAuc2F2ZSh7Y2FuY2VsUmVwZWF0czogdHJ1ZX0pO1xuXG5sZXQgcSA9IERBcHBKb2JzLnByb2Nlc3NKb2JzKCdjbGVhbnVwJyx7IHBvbGxJbnRlcnZhbDogZmFsc2UsIHdvcmtUaW1lb3V0OiA2MCoxMDAwIH0gLGZ1bmN0aW9uIChqb2IsIGNiKSB7XG4gICAgY29uc3QgY3VycmVudCA9IG5ldyBEYXRlKClcbiAgICBjdXJyZW50LnNldE1pbnV0ZXMoY3VycmVudC5nZXRNaW51dGVzKCkgLSA1KTtcblxuICAgIGNvbnN0IGlkcyA9IERBcHBKb2JzLmZpbmQoe1xuICAgICAgICAgICAgc3RhdHVzOiB7JGluOiBKb2Iuam9iU3RhdHVzUmVtb3ZhYmxlfSxcbiAgICAgICAgICAgIHVwZGF0ZWQ6IHskbHQ6IGN1cnJlbnR9fSxcbiAgICAgICAge2ZpZWxkczogeyBfaWQ6IDEgfX0pO1xuXG4gICAgbG9nTWFpbignZm91bmQgIHJlbW92YWJsZSBibG9ja2NoYWluIGpvYnM6JyxpZHMpO1xuICAgIERBcHBKb2JzLnJlbW92ZUpvYnMoaWRzKTtcbiAgICBpZihpZHMubGVuZ3RoID4gMCl7XG4gICAgICAgIGpvYi5kb25lKFwiUmVtb3ZlZCAje2lkcy5sZW5ndGh9IG9sZCBqb2JzXCIpO1xuICAgIH1cbiAgICBjYigpO1xufSk7XG5cbkRBcHBKb2JzLmZpbmQoeyB0eXBlOiAnam9iVHlwZScsIHN0YXR1czogJ3JlYWR5JyB9KVxuICAgIC5vYnNlcnZlKHtcbiAgICAgICAgYWRkZWQ6IGZ1bmN0aW9uICgpIHsgcS50cmlnZ2VyKCk7IH1cbiAgICB9KTtcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IGRucyBmcm9tICdkbnMnO1xuaW1wb3J0IHtsb2dTZW5kfSBmcm9tIFwiLi4vLi4vaW1wb3J0cy9zdGFydHVwL3NlcnZlci9sb2ctY29uZmlndXJhdGlvblwiO1xuXG5leHBvcnQgZnVuY3Rpb24gcmVzb2x2ZVR4dChrZXksIGRvbWFpbikge1xuICBjb25zdCBzeW5jRnVuYyA9IE1ldGVvci53cmFwQXN5bmMoZG5zX3Jlc29sdmVUeHQpO1xuICB0cnkge1xuICAgIGNvbnN0IHJlY29yZHMgPSBzeW5jRnVuYyhrZXksIGRvbWFpbik7XG4gICAgaWYocmVjb3JkcyA9PT0gdW5kZWZpbmVkKSByZXR1cm4gdW5kZWZpbmVkO1xuICAgIGxldCB2YWx1ZSA9IHVuZGVmaW5lZDtcbiAgICByZWNvcmRzLmZvckVhY2gocmVjb3JkID0+IHtcbiAgICAgIGlmKHJlY29yZFswXS5zdGFydHNXaXRoKGtleSkpIHtcbiAgICAgICAgY29uc3QgdmFsID0gcmVjb3JkWzBdLnN1YnN0cmluZyhrZXkubGVuZ3RoKzEpO1xuICAgICAgICB2YWx1ZSA9IHZhbC50cmltKCk7XG5cbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH0gY2F0Y2goZXJyb3IpIHtcbiAgICBsb2dTZW5kKFwiZXJyb3Igd2hpbGUgYXNraW5nIGRucyBzZXJ2ZXJzIGZyb20gXCIsZG5zLmdldFNlcnZlcnMoKSk7XG4gICAgaWYoZXJyb3IubWVzc2FnZS5zdGFydHNXaXRoKFwicXVlcnlUeHQgRU5PREFUQVwiKSB8fFxuICAgICAgICBlcnJvci5tZXNzYWdlLnN0YXJ0c1dpdGgoXCJxdWVyeVR4dCBFTk9URk9VTkRcIikpIHJldHVybiB1bmRlZmluZWQ7XG4gICAgZWxzZSB0aHJvdyBlcnJvcjtcbiAgfVxufVxuXG5mdW5jdGlvbiBkbnNfcmVzb2x2ZVR4dChrZXksIGRvbWFpbiwgY2FsbGJhY2spIHtcbiAgICBsb2dTZW5kKFwicmVzb2x2aW5nIGRucyB0eHQgYXR0cmlidXRlOiBcIiwge2tleTprZXksZG9tYWluOmRvbWFpbn0pO1xuICAgIGRucy5yZXNvbHZlVHh0KGRvbWFpbiwgKGVyciwgcmVjb3JkcykgPT4ge1xuICAgIGNhbGxiYWNrKGVyciwgcmVjb3Jkcyk7XG4gIH0pO1xufVxuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQge2xvZ0Jsb2NrY2hhaW4sIGxvZ0NvbmZpcm0sIGxvZ0Vycm9yfSBmcm9tIFwiLi4vLi4vaW1wb3J0cy9zdGFydHVwL3NlcnZlci9sb2ctY29uZmlndXJhdGlvblwiO1xuXG5cbmNvbnN0IE5BTUVTUEFDRSA9ICdlLyc7XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFdpZihjbGllbnQsIGFkZHJlc3MpIHtcbiAgaWYoIWFkZHJlc3Mpe1xuICAgICAgICBhZGRyZXNzID0gZ2V0QWRkcmVzc2VzQnlBY2NvdW50KFwiXCIpWzBdO1xuICAgICAgICBsb2dCbG9ja2NoYWluKCdhZGRyZXNzIHdhcyBub3QgZGVmaW5lZCBzbyBnZXR0aW5nIHRoZSBmaXJzdCBleGlzdGluZyBvbmUgb2YgdGhlIHdhbGxldDonLGFkZHJlc3MpO1xuICB9XG4gIGlmKCFhZGRyZXNzKXtcbiAgICAgICAgYWRkcmVzcyA9IGdldE5ld0FkZHJlc3MoXCJcIik7XG4gICAgICAgIGxvZ0Jsb2NrY2hhaW4oJ2FkZHJlc3Mgd2FzIG5ldmVyIGRlZmluZWQgIGF0IGFsbCBnZW5lcmF0ZWQgbmV3IGFkZHJlc3MgZm9yIHRoaXMgd2FsbGV0OicsYWRkcmVzcyk7XG4gIH1cbiAgY29uc3Qgc3luY0Z1bmMgPSBNZXRlb3Iud3JhcEFzeW5jKGRvaWNoYWluX2R1bXBwcml2a2V5KTtcbiAgcmV0dXJuIHN5bmNGdW5jKGNsaWVudCwgYWRkcmVzcyk7XG59XG5cbmZ1bmN0aW9uIGRvaWNoYWluX2R1bXBwcml2a2V5KGNsaWVudCwgYWRkcmVzcywgY2FsbGJhY2spIHtcbiAgY29uc3Qgb3VyQWRkcmVzcyA9IGFkZHJlc3M7XG4gIGNsaWVudC5jbWQoJ2R1bXBwcml2a2V5Jywgb3VyQWRkcmVzcywgZnVuY3Rpb24oZXJyLCBkYXRhKSB7XG4gICAgaWYoZXJyKSAgbG9nRXJyb3IoJ2RvaWNoYWluX2R1bXBwcml2a2V5OicsZXJyKTtcbiAgICBjYWxsYmFjayhlcnIsIGRhdGEpO1xuICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEFkZHJlc3Nlc0J5QWNjb3VudChjbGllbnQsIGFjY291dCkge1xuICAgIGNvbnN0IHN5bmNGdW5jID0gTWV0ZW9yLndyYXBBc3luYyhkb2ljaGFpbl9nZXRhZGRyZXNzZXNieWFjY291bnQpO1xuICAgIHJldHVybiBzeW5jRnVuYyhjbGllbnQsIGFjY291dCk7XG59XG5cbmZ1bmN0aW9uIGRvaWNoYWluX2dldGFkZHJlc3Nlc2J5YWNjb3VudChjbGllbnQsIGFjY291bnQsIGNhbGxiYWNrKSB7XG4gICAgY29uc3Qgb3VyQWNjb3VudCA9IGFjY291bnQ7XG4gICAgY2xpZW50LmNtZCgnZ2V0YWRkcmVzc2VzYnlhY2NvdW50Jywgb3VyQWNjb3VudCwgZnVuY3Rpb24oZXJyLCBkYXRhKSB7XG4gICAgICAgIGlmKGVycikgIGxvZ0Vycm9yKCdnZXRhZGRyZXNzZXNieWFjY291bnQ6JyxlcnIpO1xuICAgICAgICBjYWxsYmFjayhlcnIsIGRhdGEpO1xuICAgIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0TmV3QWRkcmVzcyhjbGllbnQsIGFjY291dCkge1xuICAgIGNvbnN0IHN5bmNGdW5jID0gTWV0ZW9yLndyYXBBc3luYyhkb2ljaGFpbl9nZXRuZXdhZGRyZXNzKTtcbiAgICByZXR1cm4gc3luY0Z1bmMoY2xpZW50LCBhY2NvdXQpO1xufVxuZnVuY3Rpb24gZG9pY2hhaW5fZ2V0bmV3YWRkcmVzcyhjbGllbnQsIGFjY291bnQsIGNhbGxiYWNrKSB7XG4gICAgY29uc3Qgb3VyQWNjb3VudCA9IGFjY291bnQ7XG4gICAgY2xpZW50LmNtZCgnZ2V0bmV3YWRkcmVzc3MnLCBvdXJBY2NvdW50LCBmdW5jdGlvbihlcnIsIGRhdGEpIHtcbiAgICAgICAgaWYoZXJyKSAgbG9nRXJyb3IoJ2dldG5ld2FkZHJlc3NzOicsZXJyKTtcbiAgICAgICAgY2FsbGJhY2soZXJyLCBkYXRhKTtcbiAgICB9KTtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gc2lnbk1lc3NhZ2UoY2xpZW50LCBhZGRyZXNzLCBtZXNzYWdlKSB7XG4gICAgY29uc3Qgc3luY0Z1bmMgPSBNZXRlb3Iud3JhcEFzeW5jKGRvaWNoYWluX3NpZ25NZXNzYWdlKTtcbiAgICByZXR1cm4gc3luY0Z1bmMoY2xpZW50LCBhZGRyZXNzLCBtZXNzYWdlKTtcbn1cblxuZnVuY3Rpb24gZG9pY2hhaW5fc2lnbk1lc3NhZ2UoY2xpZW50LCBhZGRyZXNzLCBtZXNzYWdlLCBjYWxsYmFjaykge1xuICAgIGNvbnN0IG91ckFkZHJlc3MgPSBhZGRyZXNzO1xuICAgIGNvbnN0IG91ck1lc3NhZ2UgPSBtZXNzYWdlO1xuICAgIGNsaWVudC5jbWQoJ3NpZ25tZXNzYWdlJywgb3VyQWRkcmVzcywgb3VyTWVzc2FnZSwgZnVuY3Rpb24oZXJyLCBkYXRhKSB7XG4gICAgICAgIGNhbGxiYWNrKGVyciwgZGF0YSk7XG4gICAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBuYW1lU2hvdyhjbGllbnQsIGlkKSB7XG4gIGNvbnN0IHN5bmNGdW5jID0gTWV0ZW9yLndyYXBBc3luYyhkb2ljaGFpbl9uYW1lU2hvdyk7XG4gIHJldHVybiBzeW5jRnVuYyhjbGllbnQsIGlkKTtcbn1cblxuZnVuY3Rpb24gZG9pY2hhaW5fbmFtZVNob3coY2xpZW50LCBpZCwgY2FsbGJhY2spIHtcbiAgY29uc3Qgb3VySWQgPSBjaGVja0lkKGlkKTtcbiAgbG9nQ29uZmlybSgnZG9pY2hhaW4tY2xpIG5hbWVfc2hvdyA6JyxvdXJJZCk7XG4gIGNsaWVudC5jbWQoJ25hbWVfc2hvdycsIG91cklkLCBmdW5jdGlvbihlcnIsIGRhdGEpIHtcbiAgICBpZihlcnIgIT09IHVuZGVmaW5lZCAmJiBlcnIgIT09IG51bGwgJiYgZXJyLm1lc3NhZ2Uuc3RhcnRzV2l0aChcIm5hbWUgbm90IGZvdW5kXCIpKSB7XG4gICAgICBlcnIgPSB1bmRlZmluZWQsXG4gICAgICBkYXRhID0gdW5kZWZpbmVkXG4gICAgfVxuICAgIGNhbGxiYWNrKGVyciwgZGF0YSk7XG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZmVlRG9pKGNsaWVudCwgYWRkcmVzcykge1xuICAgIGNvbnN0IHN5bmNGdW5jID0gTWV0ZW9yLndyYXBBc3luYyhkb2ljaGFpbl9mZWVEb2kpO1xuICAgIHJldHVybiBzeW5jRnVuYyhjbGllbnQsIGFkZHJlc3MpO1xufVxuXG5mdW5jdGlvbiBkb2ljaGFpbl9mZWVEb2koY2xpZW50LCBhZGRyZXNzLCBjYWxsYmFjaykge1xuICAgIGNvbnN0IGRlc3RBZGRyZXNzID0gYWRkcmVzcztcbiAgICBjbGllbnQuY21kKCdzZW5kdG9hZGRyZXNzJywgZGVzdEFkZHJlc3MsICcwLjAyJywgZnVuY3Rpb24oZXJyLCBkYXRhKSB7XG4gICAgICAgIGNhbGxiYWNrKGVyciwgZGF0YSk7XG4gICAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBuYW1lRG9pKGNsaWVudCwgbmFtZSwgdmFsdWUsIGFkZHJlc3MpIHtcbiAgICBjb25zdCBzeW5jRnVuYyA9IE1ldGVvci53cmFwQXN5bmMoZG9pY2hhaW5fbmFtZURvaSk7XG4gICAgcmV0dXJuIHN5bmNGdW5jKGNsaWVudCwgbmFtZSwgdmFsdWUsIGFkZHJlc3MpO1xufVxuXG5mdW5jdGlvbiBkb2ljaGFpbl9uYW1lRG9pKGNsaWVudCwgbmFtZSwgdmFsdWUsIGFkZHJlc3MsIGNhbGxiYWNrKSB7XG4gICAgY29uc3Qgb3VyTmFtZSA9IGNoZWNrSWQobmFtZSk7XG4gICAgY29uc3Qgb3VyVmFsdWUgPSB2YWx1ZTtcbiAgICBjb25zdCBkZXN0QWRkcmVzcyA9IGFkZHJlc3M7XG4gICAgaWYoIWFkZHJlc3MpIHtcbiAgICAgICAgY2xpZW50LmNtZCgnbmFtZV9kb2knLCBvdXJOYW1lLCBvdXJWYWx1ZSwgZnVuY3Rpb24gKGVyciwgZGF0YSkge1xuICAgICAgICAgICAgY2FsbGJhY2soZXJyLCBkYXRhKTtcbiAgICAgICAgfSk7XG4gICAgfWVsc2V7XG4gICAgICAgIGNsaWVudC5jbWQoJ25hbWVfZG9pJywgb3VyTmFtZSwgb3VyVmFsdWUsIGRlc3RBZGRyZXNzLCBmdW5jdGlvbihlcnIsIGRhdGEpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKGVyciwgZGF0YSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxpc3RTaW5jZUJsb2NrKGNsaWVudCwgYmxvY2spIHtcbiAgICBjb25zdCBzeW5jRnVuYyA9IE1ldGVvci53cmFwQXN5bmMoZG9pY2hhaW5fbGlzdFNpbmNlQmxvY2spO1xuICAgIHZhciBvdXJCbG9jayA9IGJsb2NrO1xuICAgIGlmKG91ckJsb2NrID09PSB1bmRlZmluZWQpIG91ckJsb2NrID0gbnVsbDtcbiAgICByZXR1cm4gc3luY0Z1bmMoY2xpZW50LCBvdXJCbG9jayk7XG59XG5cbmZ1bmN0aW9uIGRvaWNoYWluX2xpc3RTaW5jZUJsb2NrKGNsaWVudCwgYmxvY2ssIGNhbGxiYWNrKSB7XG4gICAgdmFyIG91ckJsb2NrID0gYmxvY2s7XG4gICAgaWYob3VyQmxvY2sgPT09IG51bGwpIGNsaWVudC5jbWQoJ2xpc3RzaW5jZWJsb2NrJywgZnVuY3Rpb24oZXJyLCBkYXRhKSB7XG4gICAgICAgIGNhbGxiYWNrKGVyciwgZGF0YSk7XG4gICAgfSk7XG4gICAgZWxzZSBjbGllbnQuY21kKCdsaXN0c2luY2VibG9jaycsIG91ckJsb2NrLCBmdW5jdGlvbihlcnIsIGRhdGEpIHtcbiAgICAgICAgY2FsbGJhY2soZXJyLCBkYXRhKTtcbiAgICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFRyYW5zYWN0aW9uKGNsaWVudCwgdHhpZCkge1xuICAgIGNvbnN0IHN5bmNGdW5jID0gTWV0ZW9yLndyYXBBc3luYyhkb2ljaGFpbl9nZXR0cmFuc2FjdGlvbik7XG4gICAgcmV0dXJuIHN5bmNGdW5jKGNsaWVudCwgdHhpZCk7XG59XG5cbmZ1bmN0aW9uIGRvaWNoYWluX2dldHRyYW5zYWN0aW9uKGNsaWVudCwgdHhpZCwgY2FsbGJhY2spIHtcbiAgICBsb2dDb25maXJtKCdkb2ljaGFpbl9nZXR0cmFuc2FjdGlvbjonLHR4aWQpO1xuICAgIGNsaWVudC5jbWQoJ2dldHRyYW5zYWN0aW9uJywgdHhpZCwgZnVuY3Rpb24oZXJyLCBkYXRhKSB7XG4gICAgICAgIGlmKGVycikgIGxvZ0Vycm9yKCdkb2ljaGFpbl9nZXR0cmFuc2FjdGlvbjonLGVycik7XG4gICAgICAgIGNhbGxiYWNrKGVyciwgZGF0YSk7XG4gICAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRSYXdUcmFuc2FjdGlvbihjbGllbnQsIHR4aWQpIHtcbiAgICBjb25zdCBzeW5jRnVuYyA9IE1ldGVvci53cmFwQXN5bmMoZG9pY2hhaW5fZ2V0cmF3dHJhbnNhY3Rpb24pO1xuICAgIHJldHVybiBzeW5jRnVuYyhjbGllbnQsIHR4aWQpO1xufVxuXG5mdW5jdGlvbiBkb2ljaGFpbl9nZXRyYXd0cmFuc2FjdGlvbihjbGllbnQsIHR4aWQsIGNhbGxiYWNrKSB7XG4gICAgbG9nQmxvY2tjaGFpbignZG9pY2hhaW5fZ2V0cmF3dHJhbnNhY3Rpb246Jyx0eGlkKTtcbiAgICBjbGllbnQuY21kKCdnZXRyYXd0cmFuc2FjdGlvbicsIHR4aWQsIDEsIGZ1bmN0aW9uKGVyciwgZGF0YSkge1xuICAgICAgICBpZihlcnIpICBsb2dFcnJvcignZG9pY2hhaW5fZ2V0cmF3dHJhbnNhY3Rpb246JyxlcnIpO1xuICAgICAgICBjYWxsYmFjayhlcnIsIGRhdGEpO1xuICAgIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0QmFsYW5jZShjbGllbnQpIHtcbiAgICBjb25zdCBzeW5jRnVuYyA9IE1ldGVvci53cmFwQXN5bmMoZG9pY2hhaW5fZ2V0YmFsYW5jZSk7XG4gICAgcmV0dXJuIHN5bmNGdW5jKGNsaWVudCk7XG59XG5cbmZ1bmN0aW9uIGRvaWNoYWluX2dldGJhbGFuY2UoY2xpZW50LCBjYWxsYmFjaykge1xuICAgIGNsaWVudC5jbWQoJ2dldGJhbGFuY2UnLCBmdW5jdGlvbihlcnIsIGRhdGEpIHtcbiAgICAgICAgaWYoZXJyKSB7IGxvZ0Vycm9yKCdkb2ljaGFpbl9nZXRiYWxhbmNlOicsZXJyKTt9XG4gICAgICAgIGNhbGxiYWNrKGVyciwgZGF0YSk7XG4gICAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRJbmZvKGNsaWVudCkge1xuICAgIGNvbnN0IHN5bmNGdW5jID0gTWV0ZW9yLndyYXBBc3luYyhkb2ljaGFpbl9nZXRpbmZvKTtcbiAgICByZXR1cm4gc3luY0Z1bmMoY2xpZW50KTtcbn1cblxuZnVuY3Rpb24gZG9pY2hhaW5fZ2V0aW5mbyhjbGllbnQsIGNhbGxiYWNrKSB7XG4gICAgY2xpZW50LmNtZCgnZ2V0YmxvY2tjaGFpbmluZm8nLCBmdW5jdGlvbihlcnIsIGRhdGEpIHtcbiAgICAgICAgaWYoZXJyKSB7IGxvZ0Vycm9yKCdkb2ljaGFpbi1nZXRpbmZvOicsZXJyKTt9XG4gICAgICAgIGNhbGxiYWNrKGVyciwgZGF0YSk7XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIGNoZWNrSWQoaWQpIHtcbiAgICBjb25zdCBET0lfUFJFRklYID0gXCJkb2k6IFwiO1xuICAgIGxldCByZXRfdmFsID0gaWQ7IC8vZGVmYXVsdCB2YWx1ZVxuXG4gICAgaWYoaWQuc3RhcnRzV2l0aChET0lfUFJFRklYKSkgcmV0X3ZhbCA9IGlkLnN1YnN0cmluZyhET0lfUFJFRklYLmxlbmd0aCk7IC8vaW4gY2FzZSBpdCBzdGFydHMgd2l0aCBkb2k6IGN1dCAgdGhpcyBhd2F5XG4gICAgaWYoIWlkLnN0YXJ0c1dpdGgoTkFNRVNQQUNFKSkgcmV0X3ZhbCA9IE5BTUVTUEFDRStpZDsgLy9pbiBjYXNlIGl0IGRvZXNuJ3Qgc3RhcnQgd2l0aCBlLyBwdXQgaXQgaW4gZnJvbnQgbm93LlxuICByZXR1cm4gcmV0X3ZhbDtcbn1cbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IHsgSFRUUCB9IGZyb20gJ21ldGVvci9odHRwJ1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0SHR0cEdFVCh1cmwsIHF1ZXJ5KSB7XG4gIGNvbnN0IHN5bmNGdW5jID0gTWV0ZW9yLndyYXBBc3luYyhfZ2V0KTtcbiAgcmV0dXJuIHN5bmNGdW5jKHVybCwgcXVlcnkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0SHR0cEdFVGRhdGEodXJsLCBkYXRhKSB7XG4gICAgY29uc3Qgc3luY0Z1bmMgPSBNZXRlb3Iud3JhcEFzeW5jKF9nZXREYXRhKTtcbiAgICByZXR1cm4gc3luY0Z1bmModXJsLCBkYXRhKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEh0dHBQT1NUKHVybCwgZGF0YSkge1xuICAgIGNvbnN0IHN5bmNGdW5jID0gTWV0ZW9yLndyYXBBc3luYyhfcG9zdCk7XG4gICAgcmV0dXJuIHN5bmNGdW5jKHVybCwgZGF0YSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRIdHRwUFVUKHVybCwgZGF0YSkge1xuICAgIGNvbnN0IHN5bmNGdW5jID0gTWV0ZW9yLndyYXBBc3luYyhfcHV0KTtcbiAgICByZXR1cm4gc3luY0Z1bmModXJsLCBkYXRhKTtcbn1cblxuZnVuY3Rpb24gX2dldCh1cmwsIHF1ZXJ5LCBjYWxsYmFjaykge1xuICBjb25zdCBvdXJVcmwgPSB1cmw7XG4gIGNvbnN0IG91clF1ZXJ5ID0gcXVlcnk7XG4gIEhUVFAuZ2V0KG91clVybCwge3F1ZXJ5OiBvdXJRdWVyeX0sIGZ1bmN0aW9uKGVyciwgcmV0KSB7XG4gICAgY2FsbGJhY2soZXJyLCByZXQpO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gX2dldERhdGEodXJsLCBkYXRhLCBjYWxsYmFjaykge1xuICAgIGNvbnN0IG91clVybCA9IHVybDtcbiAgICBjb25zdCBvdXJEYXRhID0gZGF0YTtcbiAgICBIVFRQLmdldChvdXJVcmwsIG91ckRhdGEsIGZ1bmN0aW9uKGVyciwgcmV0KSB7XG4gICAgICAgIGNhbGxiYWNrKGVyciwgcmV0KTtcbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gX3Bvc3QodXJsLCBkYXRhLCBjYWxsYmFjaykge1xuICAgIGNvbnN0IG91clVybCA9IHVybDtcbiAgICBjb25zdCBvdXJEYXRhID0gIGRhdGE7XG5cbiAgICBIVFRQLnBvc3Qob3VyVXJsLCBvdXJEYXRhLCBmdW5jdGlvbihlcnIsIHJldCkge1xuICAgICAgICBjYWxsYmFjayhlcnIsIHJldCk7XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIF9wdXQodXJsLCB1cGRhdGVEYXRhLCBjYWxsYmFjaykge1xuICAgIGNvbnN0IG91clVybCA9IHVybDtcbiAgICBjb25zdCBvdXJEYXRhID0ge1xuICAgICAgICBkYXRhOiB1cGRhdGVEYXRhXG4gICAgfVxuXG4gICAgSFRUUC5wdXQob3VyVXJsLCBvdXJEYXRhLCBmdW5jdGlvbihlcnIsIHJldCkge1xuICAgICAgY2FsbGJhY2soZXJyLCByZXQpO1xuICAgIH0pO1xufVxuIiwiaW1wb3J0ICcuL21haWxfam9icy5qcyc7XG5pbXBvcnQgJy4vZG9pY2hhaW4uanMnO1xuaW1wb3J0ICcuL2Jsb2NrY2hhaW5fam9icy5qcyc7XG5pbXBvcnQgJy4vZGFwcF9qb2JzLmpzJztcbmltcG9ydCAnLi9kbnMuanMnO1xuaW1wb3J0ICcuL3Jlc3QvcmVzdC5qcyc7XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCB7IEpvYkNvbGxlY3Rpb24sIEpvYiB9IGZyb20gJ21ldGVvci92c2l2c2k6am9iLWNvbGxlY3Rpb24nO1xuZXhwb3J0IGNvbnN0IE1haWxKb2JzID0gSm9iQ29sbGVjdGlvbignZW1haWxzJyk7XG5pbXBvcnQgc2VuZE1haWwgZnJvbSAnLi4vLi4vaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9lbWFpbHMvc2VuZC5qcyc7XG5pbXBvcnQge2xvZ01haW59IGZyb20gXCIuLi8uLi9pbXBvcnRzL3N0YXJ0dXAvc2VydmVyL2xvZy1jb25maWd1cmF0aW9uXCI7XG5pbXBvcnQge0Jsb2NrY2hhaW5Kb2JzfSBmcm9tIFwiLi9ibG9ja2NoYWluX2pvYnNcIjtcblxuXG5cbk1haWxKb2JzLnByb2Nlc3NKb2JzKCdzZW5kJywgZnVuY3Rpb24gKGpvYiwgY2IpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCBlbWFpbCA9IGpvYi5kYXRhO1xuICAgIHNlbmRNYWlsKGVtYWlsKTtcbiAgICBqb2IuZG9uZSgpO1xuICB9IGNhdGNoKGV4Y2VwdGlvbikge1xuICAgIGpvYi5mYWlsKCk7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignam9icy5tYWlsLnNlbmQuZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgfSBmaW5hbGx5IHtcbiAgICBjYigpO1xuICB9XG59KTtcblxuXG5uZXcgSm9iKE1haWxKb2JzLCAnY2xlYW51cCcsIHt9KVxuICAgIC5yZXBlYXQoeyBzY2hlZHVsZTogTWFpbEpvYnMubGF0ZXIucGFyc2UudGV4dChcImV2ZXJ5IDUgbWludXRlc1wiKSB9KVxuICAgIC5zYXZlKHtjYW5jZWxSZXBlYXRzOiB0cnVlfSlcblxubGV0IHEgPSBNYWlsSm9icy5wcm9jZXNzSm9icygnY2xlYW51cCcseyBwb2xsSW50ZXJ2YWw6IGZhbHNlLCB3b3JrVGltZW91dDogNjAqMTAwMCB9ICxmdW5jdGlvbiAoam9iLCBjYikge1xuICAgIGNvbnN0IGN1cnJlbnQgPSBuZXcgRGF0ZSgpXG4gICAgY3VycmVudC5zZXRNaW51dGVzKGN1cnJlbnQuZ2V0TWludXRlcygpIC0gNSk7XG5cbiAgICBjb25zdCBpZHMgPSBNYWlsSm9icy5maW5kKHtcbiAgICAgICAgICAgIHN0YXR1czogeyRpbjogSm9iLmpvYlN0YXR1c1JlbW92YWJsZX0sXG4gICAgICAgICAgICB1cGRhdGVkOiB7JGx0OiBjdXJyZW50fX0sXG4gICAgICAgIHtmaWVsZHM6IHsgX2lkOiAxIH19KTtcblxuICAgIGxvZ01haW4oJ2ZvdW5kICByZW1vdmFibGUgYmxvY2tjaGFpbiBqb2JzOicsaWRzKTtcbiAgICBNYWlsSm9icy5yZW1vdmVKb2JzKGlkcyk7XG4gICAgaWYoaWRzLmxlbmd0aCA+IDApe1xuICAgICAgICBqb2IuZG9uZShcIlJlbW92ZWQgI3tpZHMubGVuZ3RofSBvbGQgam9ic1wiKTtcbiAgICB9XG4gICAgY2IoKTtcbn0pO1xuXG5NYWlsSm9icy5maW5kKHsgdHlwZTogJ2pvYlR5cGUnLCBzdGF0dXM6ICdyZWFkeScgfSlcbiAgICAub2JzZXJ2ZSh7XG4gICAgICAgIGFkZGVkOiBmdW5jdGlvbiAoKSB7IHEudHJpZ2dlcigpOyB9XG4gICAgfSk7XG5cbiIsImltcG9ydCAnL2ltcG9ydHMvc3RhcnR1cC9zZXJ2ZXInO1xuaW1wb3J0ICcuL2FwaS9pbmRleC5qcyc7XG4iXX0=
