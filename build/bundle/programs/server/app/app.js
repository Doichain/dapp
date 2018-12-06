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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9hcGkvb3B0LWlucy9zZXJ2ZXIvcHVibGljYXRpb25zLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL2FwaS9vcHQtaW5zL21ldGhvZHMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvYXBpL29wdC1pbnMvb3B0LWlucy5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9hcGkvcmVjaXBpZW50cy9zZXJ2ZXIvcHVibGljYXRpb25zLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL2FwaS9yZWNpcGllbnRzL3JlY2lwaWVudHMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvYXBpL2RvaWNoYWluL2VudHJpZXMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvYXBpL2RvaWNoYWluL21ldGhvZHMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvYXBpL2xhbmd1YWdlcy9tZXRob2RzLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL2FwaS9tZXRhL21ldGEuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvYXBpL3NlbmRlcnMvc2VuZGVycy5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9hcGkvdmVyc2lvbi9wdWJsaWNhdGlvbnMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvZGFwcHMvZXhwb3J0X2RvaXMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvZGFwcHMvZmV0Y2hfZG9pLW1haWwtZGF0YS5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9kYXBwcy9nZXRfZG9pLW1haWwtZGF0YS5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9kbnMvZ2V0X29wdC1pbi1rZXkuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvZG5zL2dldF9vcHQtaW4tcHJvdmlkZXIuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvZG9pY2hhaW4vYWRkX2VudHJ5X2FuZF9mZXRjaF9kYXRhLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2RvaWNoYWluL2NoZWNrX25ld190cmFuc2FjdGlvbnMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvZG9pY2hhaW4vZGVjcnlwdF9tZXNzYWdlLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2RvaWNoYWluL2VuY3J5cHRfbWVzc2FnZS5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9kb2ljaGFpbi9nZW5lcmF0ZV9uYW1lLWlkLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2RvaWNoYWluL2dldF9hZGRyZXNzLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2RvaWNoYWluL2dldF9iYWxhbmNlLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2RvaWNoYWluL2dldF9kYXRhLWhhc2guanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvZG9pY2hhaW4vZ2V0X2tleS1wYWlyLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2RvaWNoYWluL2dldF9wcml2YXRlLWtleV9mcm9tX3dpZi5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9kb2ljaGFpbi9nZXRfcHVibGlja2V5X2FuZF9hZGRyZXNzX2J5X2RvbWFpbi5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9kb2ljaGFpbi9nZXRfc2lnbmF0dXJlLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2RvaWNoYWluL2luc2VydC5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9kb2ljaGFpbi91cGRhdGUuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvZG9pY2hhaW4vdmVyaWZ5X3NpZ25hdHVyZS5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9kb2ljaGFpbi93cml0ZV90b19ibG9ja2NoYWluLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2VtYWlscy9kZWNvZGVfZG9pLWhhc2guanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvZW1haWxzL2dlbmVyYXRlX2RvaS1oYXNoLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2VtYWlscy9wYXJzZV90ZW1wbGF0ZS5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9lbWFpbHMvc2VuZC5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9qb2JzL2FkZF9jaGVja19uZXdfdHJhbnNhY3Rpb25zLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2pvYnMvYWRkX2ZldGNoLWRvaS1tYWlsLWRhdGEuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvam9icy9hZGRfaW5zZXJ0X2Jsb2NrY2hhaW4uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvam9icy9hZGRfc2VuZF9tYWlsLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2pvYnMvYWRkX3VwZGF0ZV9ibG9ja2NoYWluLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2xhbmd1YWdlcy9nZXQuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvbWV0YS9hZGRPclVwZGF0ZS5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9vcHQtaW5zL2FkZC5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9vcHQtaW5zL2FkZF9hbmRfd3JpdGVfdG9fYmxvY2tjaGFpbi5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9vcHQtaW5zL2NvbmZpcm0uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvb3B0LWlucy9nZW5lcmF0ZV9kb2ktdG9rZW4uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvb3B0LWlucy91cGRhdGVfc3RhdHVzLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL21vZHVsZXMvc2VydmVyL29wdC1pbnMvdmVyaWZ5LmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL21vZHVsZXMvc2VydmVyL3JlY2lwaWVudHMvYWRkLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL21vZHVsZXMvc2VydmVyL3NlbmRlcnMvYWRkLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL3N0YXJ0dXAvc2VydmVyL2RhcHAtY29uZmlndXJhdGlvbi5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9zdGFydHVwL3NlcnZlci9kbnMtY29uZmlndXJhdGlvbi5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9zdGFydHVwL3NlcnZlci9kb2ljaGFpbi1jb25maWd1cmF0aW9uLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL3N0YXJ0dXAvc2VydmVyL2VtYWlsLWNvbmZpZ3VyYXRpb24uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvc3RhcnR1cC9zZXJ2ZXIvZml4dHVyZXMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvc3RhcnR1cC9zZXJ2ZXIvaW5kZXguanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvc3RhcnR1cC9zZXJ2ZXIvam9icy5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9zdGFydHVwL3NlcnZlci9sb2ctY29uZmlndXJhdGlvbi5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9zdGFydHVwL3NlcnZlci9yZWdpc3Rlci1hcGkuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvc3RhcnR1cC9zZXJ2ZXIvc2VjdXJpdHkuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvc3RhcnR1cC9zZXJ2ZXIvdHlwZS1jb25maWd1cmF0aW9uLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL3N0YXJ0dXAvc2VydmVyL3VzZXJhY2NvdW50cy1jb25maWd1cmF0aW9uLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvYXBpL3Jlc3QvaW1wb3J0cy9jb25maXJtLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvYXBpL3Jlc3QvaW1wb3J0cy9kZWJ1Zy5qcyIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL2FwaS9yZXN0L2ltcG9ydHMvc2VuZC5qcyIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL2FwaS9yZXN0L2ltcG9ydHMvc3RhdHVzLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvYXBpL3Jlc3QvaW1wb3J0cy91c2VyLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvYXBpL3Jlc3QvaW1wb3J0cy92ZXJpZnkuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9hcGkvcmVzdC9yZXN0LmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvYXBpL2Jsb2NrY2hhaW5fam9icy5qcyIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL2FwaS9kYXBwX2pvYnMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9hcGkvZG5zLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvYXBpL2RvaWNoYWluLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvYXBpL2h0dHAuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9hcGkvaW5kZXguanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9hcGkvbWFpbF9qb2JzLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWFpbi5qcyJdLCJuYW1lcyI6WyJNZXRlb3IiLCJtb2R1bGUiLCJsaW5rIiwidiIsIlJvbGVzIiwiT3B0SW5zIiwicHVibGlzaCIsIk9wdEluc0FsbCIsInVzZXJJZCIsInJlYWR5IiwidXNlcklzSW5Sb2xlIiwiZmluZCIsIm93bmVySWQiLCJmaWVsZHMiLCJwdWJsaWNGaWVsZHMiLCJERFBSYXRlTGltaXRlciIsImkxOG4iLCJfaTE4biIsIlZhbGlkYXRlZE1ldGhvZCIsIl8iLCJhZGRPcHRJbiIsImRlZmF1bHQiLCJhZGQiLCJuYW1lIiwidmFsaWRhdGUiLCJydW4iLCJyZWNpcGllbnRNYWlsIiwic2VuZGVyTWFpbCIsImRhdGEiLCJlcnJvciIsIkVycm9yIiwiX18iLCJvcHRJbiIsIk9QVElPTlNfTUVUSE9EUyIsInBsdWNrIiwiaXNTZXJ2ZXIiLCJhZGRSdWxlIiwiY29udGFpbnMiLCJjb25uZWN0aW9uSWQiLCJleHBvcnQiLCJNb25nbyIsIlNpbXBsZVNjaGVtYSIsIk9wdEluc0NvbGxlY3Rpb24iLCJDb2xsZWN0aW9uIiwiaW5zZXJ0IiwiY2FsbGJhY2siLCJvdXJPcHRJbiIsInJlY2lwaWVudF9zZW5kZXIiLCJyZWNpcGllbnQiLCJzZW5kZXIiLCJjcmVhdGVkQXQiLCJEYXRlIiwicmVzdWx0IiwidXBkYXRlIiwic2VsZWN0b3IiLCJtb2RpZmllciIsInJlbW92ZSIsImRlbnkiLCJzY2hlbWEiLCJfaWQiLCJ0eXBlIiwiU3RyaW5nIiwicmVnRXgiLCJSZWdFeCIsIklkIiwib3B0aW9uYWwiLCJkZW55VXBkYXRlIiwiaW5kZXgiLCJJbnRlZ2VyIiwibmFtZUlkIiwidHhJZCIsIm1hc3RlckRvaSIsImNvbmZpcm1lZEF0IiwiY29uZmlybWVkQnkiLCJJUCIsImNvbmZpcm1hdGlvblRva2VuIiwiYXR0YWNoU2NoZW1hIiwiUmVjaXBpZW50cyIsInJlY2lwaWVudEdldCIsInBpcGVsaW5lIiwicHVzaCIsIiRyZWRhY3QiLCIkY29uZCIsImlmIiwiJGNtcCIsInRoZW4iLCJlbHNlIiwiJGxvb2t1cCIsImZyb20iLCJsb2NhbEZpZWxkIiwiZm9yZWlnbkZpZWxkIiwiYXMiLCIkdW53aW5kIiwiJHByb2plY3QiLCJhZ2dyZWdhdGUiLCJySWRzIiwiZm9yRWFjaCIsImVsZW1lbnQiLCJSZWNpcGllbnRFbWFpbCIsInJlY2lwaWVudHNBbGwiLCJSZWNpcGllbnRzQ29sbGVjdGlvbiIsIm91clJlY2lwaWVudCIsImVtYWlsIiwicHJpdmF0ZUtleSIsInVuaXF1ZSIsInB1YmxpY0tleSIsIkRvaWNoYWluRW50cmllcyIsIkRvaWNoYWluRW50cmllc0NvbGxlY3Rpb24iLCJlbnRyeSIsInZhbHVlIiwiYWRkcmVzcyIsImdldEtleVBhaXJNIiwiZ2V0QmFsYW5jZU0iLCJnZXRLZXlQYWlyIiwiZ2V0QmFsYW5jZSIsImxvZ1ZhbCIsIk9QVElOU19NRVRIT0RTIiwiZ2V0TGFuZ3VhZ2VzIiwiZ2V0QWxsTGFuZ3VhZ2VzIiwiTWV0YSIsIk1ldGFDb2xsZWN0aW9uIiwib3VyRGF0YSIsImtleSIsIlNlbmRlcnMiLCJTZW5kZXJzQ29sbGVjdGlvbiIsIm91clNlbmRlciIsInZlcnNpb24iLCJET0lfTUFJTF9GRVRDSF9VUkwiLCJsb2dTZW5kIiwiRXhwb3J0RG9pc0RhdGFTY2hlbWEiLCJzdGF0dXMiLCJyb2xlIiwidXNlcmlkIiwiaWQiLCJleHBvcnREb2lzIiwiJG1hdGNoIiwiJGV4aXN0cyIsIiRuZSIsInVuZGVmaW5lZCIsImNvbmNhdCIsIm9wdElucyIsImV4cG9ydERvaURhdGEiLCJKU09OIiwic3RyaW5naWZ5IiwiZXhjZXB0aW9uIiwiZXhwb3J0RGVmYXVsdCIsIkRPSV9GRVRDSF9ST1VURSIsIkRPSV9DT05GSVJNQVRJT05fUk9VVEUiLCJBUElfUEFUSCIsIlZFUlNJT04iLCJnZXRVcmwiLCJDT05GSVJNX0NMSUVOVCIsIkNPTkZJUk1fQUREUkVTUyIsImdldEh0dHBHRVQiLCJzaWduTWVzc2FnZSIsInBhcnNlVGVtcGxhdGUiLCJnZW5lcmF0ZURvaVRva2VuIiwiZ2VuZXJhdGVEb2lIYXNoIiwiYWRkU2VuZE1haWxKb2IiLCJsb2dDb25maXJtIiwibG9nRXJyb3IiLCJGZXRjaERvaU1haWxEYXRhU2NoZW1hIiwiZG9tYWluIiwiZmV0Y2hEb2lNYWlsRGF0YSIsInVybCIsInNpZ25hdHVyZSIsInF1ZXJ5IiwiZW5jb2RlVVJJQ29tcG9uZW50IiwicmVzcG9uc2UiLCJyZXNwb25zZURhdGEiLCJpbmNsdWRlcyIsIm9wdEluSWQiLCJmaW5kT25lIiwidG9rZW4iLCJjb25maXJtYXRpb25IYXNoIiwicmVkaXJlY3QiLCJjb25maXJtYXRpb25VcmwiLCJ0ZW1wbGF0ZSIsImNvbnRlbnQiLCJjb25maXJtYXRpb25fdXJsIiwidG8iLCJzdWJqZWN0IiwibWVzc2FnZSIsInJldHVyblBhdGgiLCJnZXRPcHRJblByb3ZpZGVyIiwiZ2V0T3B0SW5LZXkiLCJ2ZXJpZnlTaWduYXR1cmUiLCJBY2NvdW50cyIsIkdldERvaU1haWxEYXRhU2NoZW1hIiwibmFtZV9pZCIsInVzZXJQcm9maWxlU2NoZW1hIiwiRW1haWwiLCJ0ZW1wbGF0ZVVSTCIsImdldERvaU1haWxEYXRhIiwicGFydHMiLCJzcGxpdCIsImxlbmd0aCIsInByb3ZpZGVyIiwiZG9pTWFpbERhdGEiLCJkZWZhdWx0UmV0dXJuRGF0YSIsInJldHVybkRhdGEiLCJvd25lciIsInVzZXJzIiwibWFpbFRlbXBsYXRlIiwicHJvZmlsZSIsInJlc29sdmVUeHQiLCJGQUxMQkFDS19QUk9WSURFUiIsImlzUmVndGVzdCIsImlzVGVzdG5ldCIsIk9QVF9JTl9LRVkiLCJPUFRfSU5fS0VZX1RFU1RORVQiLCJHZXRPcHRJbktleVNjaGVtYSIsIm91ck9QVF9JTl9LRVkiLCJmb3VuZEtleSIsImRuc2tleSIsInVzZUZhbGxiYWNrIiwiUFJPVklERVJfS0VZIiwiUFJPVklERVJfS0VZX1RFU1RORVQiLCJHZXRPcHRJblByb3ZpZGVyU2NoZW1hIiwib3VyUFJPVklERVJfS0VZIiwicHJvdmlkZXJLZXkiLCJnZXRXaWYiLCJhZGRGZXRjaERvaU1haWxEYXRhSm9iIiwiZ2V0UHJpdmF0ZUtleUZyb21XaWYiLCJkZWNyeXB0TWVzc2FnZSIsIkFkZERvaWNoYWluRW50cnlTY2hlbWEiLCJhZGREb2ljaGFpbkVudHJ5Iiwib3VyRW50cnkiLCJldHkiLCJwYXJzZSIsIndpZiIsIm5hbWVQb3MiLCJpbmRleE9mIiwic3Vic3RyaW5nIiwiZXhwaXJlc0luIiwiZXhwaXJlZCIsImxpc3RTaW5jZUJsb2NrIiwibmFtZVNob3ciLCJnZXRSYXdUcmFuc2FjdGlvbiIsImFkZE9yVXBkYXRlTWV0YSIsIlRYX05BTUVfU1RBUlQiLCJMQVNUX0NIRUNLRURfQkxPQ0tfS0VZIiwiY2hlY2tOZXdUcmFuc2FjdGlvbiIsInR4aWQiLCJqb2IiLCJsYXN0Q2hlY2tlZEJsb2NrIiwicmV0IiwidHJhbnNhY3Rpb25zIiwidHhzIiwibGFzdGJsb2NrIiwiYWRkcmVzc1R4cyIsImZpbHRlciIsInR4Iiwic3RhcnRzV2l0aCIsInR4TmFtZSIsImFkZFR4IiwiZG9uZSIsInZvdXQiLCJzY3JpcHRQdWJLZXkiLCJuYW1lT3AiLCJvcCIsImFkZHJlc3NlcyIsImNyeXB0byIsImVjaWVzIiwiRGVjcnlwdE1lc3NhZ2VTY2hlbWEiLCJCdWZmZXIiLCJlY2RoIiwiY3JlYXRlRUNESCIsInNldFByaXZhdGVLZXkiLCJkZWNyeXB0IiwidG9TdHJpbmciLCJFbmNyeXB0TWVzc2FnZVNjaGVtYSIsImVuY3J5cHRNZXNzYWdlIiwiZW5jcnlwdCIsIkdlbmVyYXRlTmFtZUlkU2NoZW1hIiwiZ2VuZXJhdGVOYW1lSWQiLCIkc2V0IiwiQ3J5cHRvSlMiLCJCYXNlNTgiLCJWRVJTSU9OX0JZVEUiLCJWRVJTSU9OX0JZVEVfUkVHVEVTVCIsIkdldEFkZHJlc3NTY2hlbWEiLCJnZXRBZGRyZXNzIiwiX2dldEFkZHJlc3MiLCJwdWJLZXkiLCJsaWIiLCJXb3JkQXJyYXkiLCJjcmVhdGUiLCJTSEEyNTYiLCJSSVBFTUQxNjAiLCJ2ZXJzaW9uQnl0ZSIsImNoZWNrc3VtIiwiZW5jb2RlIiwiZ2V0X0JhbGFuY2UiLCJiYWwiLCJHZXREYXRhSGFzaFNjaGVtYSIsImdldERhdGFIYXNoIiwiaGFzaCIsInJhbmRvbUJ5dGVzIiwic2VjcDI1NmsxIiwicHJpdktleSIsInByaXZhdGVLZXlWZXJpZnkiLCJwdWJsaWNLZXlDcmVhdGUiLCJ0b1VwcGVyQ2FzZSIsIkdldFByaXZhdGVLZXlGcm9tV2lmU2NoZW1hIiwiX2dldFByaXZhdGVLZXlGcm9tV2lmIiwiZGVjb2RlIiwiZW5kc1dpdGgiLCJHZXRQdWJsaWNLZXlTY2hlbWEiLCJnZXRQdWJsaWNLZXlBbmRBZGRyZXNzIiwiZGVzdEFkZHJlc3MiLCJiaXRjb3JlIiwiTWVzc2FnZSIsIkdldFNpZ25hdHVyZVNjaGVtYSIsImdldFNpZ25hdHVyZSIsInNpZ24iLCJQcml2YXRlS2V5IiwiU0VORF9DTElFTlQiLCJsb2dCbG9ja2NoYWluIiwiZmVlRG9pIiwibmFtZURvaSIsIkluc2VydFNjaGVtYSIsImRhdGFIYXNoIiwic29pRGF0ZSIsInB1YmxpY0tleUFuZEFkZHJlc3MiLCJuYW1lVmFsdWUiLCJmZWVEb2lUeCIsIm5hbWVEb2lUeCIsImdldFRyYW5zYWN0aW9uIiwiRE9JX0NPTkZJUk1BVElPTl9OT1RJRllfUk9VVEUiLCJnZXRIdHRwUFVUIiwiVXBkYXRlU2NoZW1hIiwiaG9zdCIsImZyb21Ib3N0VXJsIiwibmFtZV9kYXRhIiwicmVydW4iLCJvdXJfdHJhbnNhY3Rpb24iLCJjb25maXJtYXRpb25zIiwib3VyZnJvbUhvc3RVcmwiLCJ1cGRhdGVEYXRhIiwiY2FuY2VsIiwicmVzdGFydCIsImVyciIsImxvZ1ZlcmlmeSIsIk5FVFdPUksiLCJOZXR3b3JrcyIsImFsaWFzIiwicHVia2V5aGFzaCIsInByaXZhdGVrZXkiLCJzY3JpcHRoYXNoIiwibmV0d29ya01hZ2ljIiwiVmVyaWZ5U2lnbmF0dXJlU2NoZW1hIiwiQWRkcmVzcyIsImZyb21QdWJsaWNLZXkiLCJQdWJsaWNLZXkiLCJ2ZXJpZnkiLCJhZGRJbnNlcnRCbG9ja2NoYWluSm9iIiwiV3JpdGVUb0Jsb2NrY2hhaW5TY2hlbWEiLCJ3cml0ZVRvQmxvY2tjaGFpbiIsIkhhc2hJZHMiLCJEZWNvZGVEb2lIYXNoU2NoZW1hIiwiZGVjb2RlRG9pSGFzaCIsIm91ckhhc2giLCJoZXgiLCJkZWNvZGVIZXgiLCJvYmoiLCJHZW5lcmF0ZURvaUhhc2hTY2hlbWEiLCJqc29uIiwiZW5jb2RlSGV4IiwiUExBQ0VIT0xERVJfUkVHRVgiLCJQYXJzZVRlbXBsYXRlU2NoZW1hIiwiT2JqZWN0IiwiYmxhY2tib3giLCJfbWF0Y2giLCJleGVjIiwiX3JlcGxhY2VQbGFjZWhvbGRlciIsInJlcGxhY2UiLCJyZXAiLCJET0lfTUFJTF9ERUZBVUxUX0VNQUlMX0ZST00iLCJTZW5kTWFpbFNjaGVtYSIsInNlbmRNYWlsIiwibWFpbCIsIm91ck1haWwiLCJzZW5kIiwiaHRtbCIsImhlYWRlcnMiLCJKb2IiLCJCbG9ja2NoYWluSm9icyIsImFkZENoZWNrTmV3VHJhbnNhY3Rpb25zQmxvY2tjaGFpbkpvYiIsInJldHJ5IiwicmV0cmllcyIsIndhaXQiLCJzYXZlIiwiY2FuY2VsUmVwZWF0cyIsIkRBcHBKb2JzIiwiQWRkRmV0Y2hEb2lNYWlsRGF0YUpvYlNjaGVtYSIsIkFkZEluc2VydEJsb2NrY2hhaW5Kb2JTY2hlbWEiLCJNYWlsSm9icyIsIkFkZFNlbmRNYWlsSm9iU2NoZW1hIiwiQWRkVXBkYXRlQmxvY2tjaGFpbkpvYlNjaGVtYSIsImFkZFVwZGF0ZUJsb2NrY2hhaW5Kb2IiLCJBZGRPclVwZGF0ZU1ldGFTY2hlbWEiLCJtZXRhIiwiQWRkT3B0SW5TY2hlbWEiLCJmZXRjaCIsImFkZFJlY2lwaWVudCIsImFkZFNlbmRlciIsInJlY2lwaWVudF9tYWlsIiwic2VuZGVyX21haWwiLCJtYXN0ZXJfZG9pIiwicmVjaXBpZW50SWQiLCJzZW5kZXJJZCIsIkNvbmZpcm1PcHRJblNjaGVtYSIsImNvbmZpcm1PcHRJbiIsInJlcXVlc3QiLCJvdXJSZXF1ZXN0IiwiZGVjb2RlZCIsIiR1bnNldCIsImVudHJpZXMiLCIkb3IiLCJkb2lTaWduYXR1cmUiLCJkb2lUaW1lc3RhbXAiLCJ0b0lTT1N0cmluZyIsImpzb25WYWx1ZSIsIkdlbmVyYXRlRG9pVG9rZW5TY2hlbWEiLCJVcGRhdGVPcHRJblN0YXR1c1NjaGVtYSIsInVwZGF0ZU9wdEluU3RhdHVzIiwiVkVSSUZZX0NMSUVOVCIsIlZlcmlmeU9wdEluU2NoZW1hIiwicmVjaXBpZW50X3B1YmxpY19rZXkiLCJ2ZXJpZnlPcHRJbiIsImVudHJ5RGF0YSIsImZpcnN0Q2hlY2siLCJzZWNvbmRDaGVjayIsIkFkZFJlY2lwaWVudFNjaGVtYSIsInJlY2lwaWVudHMiLCJrZXlQYWlyIiwiQWRkU2VuZGVyU2NoZW1hIiwic2VuZGVycyIsImlzRGVidWciLCJzZXR0aW5ncyIsImFwcCIsImRlYnVnIiwicmVndGVzdCIsInRlc3RuZXQiLCJwb3J0IiwiYWJzb2x1dGVVcmwiLCJuYW1lY29pbiIsIlNFTkRfQVBQIiwiQ09ORklSTV9BUFAiLCJWRVJJRllfQVBQIiwiaXNBcHBUeXBlIiwic2VuZFNldHRpbmdzIiwic2VuZENsaWVudCIsImRvaWNoYWluIiwiY3JlYXRlQ2xpZW50IiwiY29uZmlybVNldHRpbmdzIiwiY29uZmlybSIsImNvbmZpcm1DbGllbnQiLCJjb25maXJtQWRkcmVzcyIsInZlcmlmeVNldHRpbmdzIiwidmVyaWZ5Q2xpZW50IiwiQ2xpZW50IiwidXNlciIsInVzZXJuYW1lIiwicGFzcyIsInBhc3N3b3JkIiwiSGFzaGlkcyIsImRvaU1haWxGZXRjaFVybCIsImRlZmF1bHRGcm9tIiwic210cCIsInN0YXJ0dXAiLCJwcm9jZXNzIiwiZW52IiwiTUFJTF9VUkwiLCJzZXJ2ZXIiLCJOT0RFX1RMU19SRUpFQ1RfVU5BVVRIT1JJWkVEIiwiQXNzZXRzIiwiZ2V0VGV4dCIsImNvdW50IiwiY3JlYXRlVXNlciIsImFkZFVzZXJzVG9Sb2xlcyIsInN0YXJ0Sm9iU2VydmVyIiwiY29uc29sZSIsInNlbmRNb2RlVGFnQ29sb3IiLCJjb25maXJtTW9kZVRhZ0NvbG9yIiwidmVyaWZ5TW9kZVRhZ0NvbG9yIiwiYmxvY2tjaGFpbk1vZGVUYWdDb2xvciIsInRlc3RpbmdNb2RlVGFnQ29sb3IiLCJsb2dNYWluIiwidGVzdExvZ2dpbmciLCJyZXF1aXJlIiwibXNnIiwiY29sb3JzIiwicGFyYW0iLCJ0aW1lIiwidGFnIiwibG9nIiwiQVVUSF9NRVRIT0RTIiwidHlwZXMiLCJjb25maWciLCJzZW5kVmVyaWZpY2F0aW9uRW1haWwiLCJmb3JiaWRDbGllbnRBY2NvdW50Q3JlYXRpb24iLCJlbWFpbFRlbXBsYXRlcyIsIkFwaSIsIkRPSV9XQUxMRVROT1RJRllfUk9VVEUiLCJhZGRSb3V0ZSIsImF1dGhSZXF1aXJlZCIsImdldCIsImFjdGlvbiIsInVybFBhcmFtcyIsImlwIiwiY29ubmVjdGlvbiIsInJlbW90ZUFkZHJlc3MiLCJzb2NrZXQiLCJzdGF0dXNDb2RlIiwiYm9keSIsInBhcmFtcyIsInF1ZXJ5UGFyYW1zIiwiRE9JX0VYUE9SVF9ST1VURSIsInBvc3QiLCJxUGFyYW1zIiwiYlBhcmFtcyIsImJvZHlQYXJhbXMiLCJ1aWQiLCJjb25zdHJ1Y3RvciIsIkFycmF5IiwicHJlcGFyZUNvRE9JIiwicHJlcGFyZUFkZCIsInB1dCIsInZhbCIsIm93bmVySUQiLCJjdXJyZW50T3B0SW5JZCIsInJldFJlc3BvbnNlIiwicmV0X3Jlc3BvbnNlIiwiZ2V0SW5mbyIsImV4IiwibWFpbFRlbXBsYXRlU2NoZW1hIiwiY3JlYXRlVXNlclNjaGVtYSIsInVwZGF0ZVVzZXJTY2hlbWEiLCJjb2xsZWN0aW9uT3B0aW9ucyIsInBhdGgiLCJyb3V0ZU9wdGlvbnMiLCJleGNsdWRlZEVuZHBvaW50cyIsImVuZHBvaW50cyIsImRlbGV0ZSIsInJvbGVSZXF1aXJlZCIsInBhcmFtSWQiLCJhZGRDb2xsZWN0aW9uIiwiUmVzdGl2dXMiLCJhcGlQYXRoIiwidXNlRGVmYXVsdEF1dGgiLCJwcmV0dHlKc29uIiwiSm9iQ29sbGVjdGlvbiIsInByb2Nlc3NKb2JzIiwid29ya1RpbWVvdXQiLCJjYiIsImZhaWwiLCJwYXVzZSIsInJlcGVhdCIsInNjaGVkdWxlIiwibGF0ZXIiLCJ0ZXh0IiwicSIsInBvbGxJbnRlcnZhbCIsImN1cnJlbnQiLCJzZXRNaW51dGVzIiwiZ2V0TWludXRlcyIsImlkcyIsIiRpbiIsImpvYlN0YXR1c1JlbW92YWJsZSIsInVwZGF0ZWQiLCIkbHQiLCJyZW1vdmVKb2JzIiwib2JzZXJ2ZSIsImFkZGVkIiwidHJpZ2dlciIsImRucyIsInN5bmNGdW5jIiwid3JhcEFzeW5jIiwiZG5zX3Jlc29sdmVUeHQiLCJyZWNvcmRzIiwicmVjb3JkIiwidHJpbSIsImdldEFkZHJlc3Nlc0J5QWNjb3VudCIsImdldE5ld0FkZHJlc3MiLCJOQU1FU1BBQ0UiLCJjbGllbnQiLCJkb2ljaGFpbl9kdW1wcHJpdmtleSIsIm91ckFkZHJlc3MiLCJjbWQiLCJhY2NvdXQiLCJkb2ljaGFpbl9nZXRhZGRyZXNzZXNieWFjY291bnQiLCJhY2NvdW50Iiwib3VyQWNjb3VudCIsImRvaWNoYWluX2dldG5ld2FkZHJlc3MiLCJkb2ljaGFpbl9zaWduTWVzc2FnZSIsIm91ck1lc3NhZ2UiLCJkb2ljaGFpbl9uYW1lU2hvdyIsIm91cklkIiwiY2hlY2tJZCIsImRvaWNoYWluX2ZlZURvaSIsImRvaWNoYWluX25hbWVEb2kiLCJvdXJOYW1lIiwib3VyVmFsdWUiLCJibG9jayIsImRvaWNoYWluX2xpc3RTaW5jZUJsb2NrIiwib3VyQmxvY2siLCJkb2ljaGFpbl9nZXR0cmFuc2FjdGlvbiIsImRvaWNoYWluX2dldHJhd3RyYW5zYWN0aW9uIiwiZG9pY2hhaW5fZ2V0YmFsYW5jZSIsImRvaWNoYWluX2dldGluZm8iLCJET0lfUFJFRklYIiwicmV0X3ZhbCIsImdldEh0dHBHRVRkYXRhIiwiZ2V0SHR0cFBPU1QiLCJIVFRQIiwiX2dldCIsIl9nZXREYXRhIiwiX3Bvc3QiLCJfcHV0Iiwib3VyVXJsIiwib3VyUXVlcnkiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUEsSUFBSUEsTUFBSjtBQUFXQyxNQUFNLENBQUNDLElBQVAsQ0FBWSxlQUFaLEVBQTRCO0FBQUNGLFFBQU0sQ0FBQ0csQ0FBRCxFQUFHO0FBQUNILFVBQU0sR0FBQ0csQ0FBUDtBQUFTOztBQUFwQixDQUE1QixFQUFrRCxDQUFsRDtBQUFxRCxJQUFJQyxLQUFKO0FBQVVILE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLHVCQUFaLEVBQW9DO0FBQUNFLE9BQUssQ0FBQ0QsQ0FBRCxFQUFHO0FBQUNDLFNBQUssR0FBQ0QsQ0FBTjtBQUFROztBQUFsQixDQUFwQyxFQUF3RCxDQUF4RDtBQUEyRCxJQUFJRSxNQUFKO0FBQVdKLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGVBQVosRUFBNEI7QUFBQ0csUUFBTSxDQUFDRixDQUFELEVBQUc7QUFBQ0UsVUFBTSxHQUFDRixDQUFQO0FBQVM7O0FBQXBCLENBQTVCLEVBQWtELENBQWxEO0FBS2hKSCxNQUFNLENBQUNNLE9BQVAsQ0FBZSxhQUFmLEVBQThCLFNBQVNDLFNBQVQsR0FBcUI7QUFDakQsTUFBRyxDQUFDLEtBQUtDLE1BQVQsRUFBaUI7QUFDZixXQUFPLEtBQUtDLEtBQUwsRUFBUDtBQUNEOztBQUNELE1BQUcsQ0FBQ0wsS0FBSyxDQUFDTSxZQUFOLENBQW1CLEtBQUtGLE1BQXhCLEVBQWdDLENBQUMsT0FBRCxDQUFoQyxDQUFKLEVBQStDO0FBQzdDLFdBQU9ILE1BQU0sQ0FBQ00sSUFBUCxDQUFZO0FBQUNDLGFBQU8sRUFBQyxLQUFLSjtBQUFkLEtBQVosRUFBbUM7QUFDeENLLFlBQU0sRUFBRVIsTUFBTSxDQUFDUztBQUR5QixLQUFuQyxDQUFQO0FBR0Q7O0FBR0QsU0FBT1QsTUFBTSxDQUFDTSxJQUFQLENBQVksRUFBWixFQUFnQjtBQUNyQkUsVUFBTSxFQUFFUixNQUFNLENBQUNTO0FBRE0sR0FBaEIsQ0FBUDtBQUdELENBZEQsRTs7Ozs7Ozs7Ozs7QUNMQSxJQUFJZCxNQUFKO0FBQVdDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGVBQVosRUFBNEI7QUFBQ0YsUUFBTSxDQUFDRyxDQUFELEVBQUc7QUFBQ0gsVUFBTSxHQUFDRyxDQUFQO0FBQVM7O0FBQXBCLENBQTVCLEVBQWtELENBQWxEO0FBQXFELElBQUlZLGNBQUo7QUFBbUJkLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLHlCQUFaLEVBQXNDO0FBQUNhLGdCQUFjLENBQUNaLENBQUQsRUFBRztBQUFDWSxrQkFBYyxHQUFDWixDQUFmO0FBQWlCOztBQUFwQyxDQUF0QyxFQUE0RSxDQUE1RTtBQUErRSxJQUFJYSxJQUFKO0FBQVNmLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLHNCQUFaLEVBQW1DO0FBQUNlLE9BQUssQ0FBQ2QsQ0FBRCxFQUFHO0FBQUNhLFFBQUksR0FBQ2IsQ0FBTDtBQUFPOztBQUFqQixDQUFuQyxFQUFzRCxDQUF0RDtBQUF5RCxJQUFJZSxlQUFKO0FBQW9CakIsTUFBTSxDQUFDQyxJQUFQLENBQVksNkJBQVosRUFBMEM7QUFBQ2dCLGlCQUFlLENBQUNmLENBQUQsRUFBRztBQUFDZSxtQkFBZSxHQUFDZixDQUFoQjtBQUFrQjs7QUFBdEMsQ0FBMUMsRUFBa0YsQ0FBbEY7QUFBcUYsSUFBSUMsS0FBSjtBQUFVSCxNQUFNLENBQUNDLElBQVAsQ0FBWSx1QkFBWixFQUFvQztBQUFDRSxPQUFLLENBQUNELENBQUQsRUFBRztBQUFDQyxTQUFLLEdBQUNELENBQU47QUFBUTs7QUFBbEIsQ0FBcEMsRUFBd0QsQ0FBeEQ7O0FBQTJELElBQUlnQixDQUFKOztBQUFNbEIsTUFBTSxDQUFDQyxJQUFQLENBQVksbUJBQVosRUFBZ0M7QUFBQ2lCLEdBQUMsQ0FBQ2hCLENBQUQsRUFBRztBQUFDZ0IsS0FBQyxHQUFDaEIsQ0FBRjtBQUFJOztBQUFWLENBQWhDLEVBQTRDLENBQTVDO0FBQStDLElBQUlpQixRQUFKO0FBQWFuQixNQUFNLENBQUNDLElBQVAsQ0FBWSw2REFBWixFQUEwRTtBQUFDbUIsU0FBTyxDQUFDbEIsQ0FBRCxFQUFHO0FBQUNpQixZQUFRLEdBQUNqQixDQUFUO0FBQVc7O0FBQXZCLENBQTFFLEVBQW1HLENBQW5HO0FBUXBkLE1BQU1tQixHQUFHLEdBQUcsSUFBSUosZUFBSixDQUFvQjtBQUM5QkssTUFBSSxFQUFFLGFBRHdCO0FBRTlCQyxVQUFRLEVBQUUsSUFGb0I7O0FBRzlCQyxLQUFHLENBQUM7QUFBRUMsaUJBQUY7QUFBaUJDLGNBQWpCO0FBQTZCQztBQUE3QixHQUFELEVBQXNDO0FBQ3ZDLFFBQUcsQ0FBQyxLQUFLcEIsTUFBTixJQUFnQixDQUFDSixLQUFLLENBQUNNLFlBQU4sQ0FBbUIsS0FBS0YsTUFBeEIsRUFBZ0MsQ0FBQyxPQUFELENBQWhDLENBQXBCLEVBQWdFO0FBQzlELFlBQU1xQixLQUFLLEdBQUcsOEJBQWQ7QUFDQSxZQUFNLElBQUk3QixNQUFNLENBQUM4QixLQUFYLENBQWlCRCxLQUFqQixFQUF3QmIsSUFBSSxDQUFDZSxFQUFMLENBQVFGLEtBQVIsQ0FBeEIsQ0FBTjtBQUNEOztBQUVELFVBQU1HLEtBQUssR0FBRztBQUNaLHdCQUFrQk4sYUFETjtBQUVaLHFCQUFlQyxVQUZIO0FBR1pDO0FBSFksS0FBZDtBQU1BUixZQUFRLENBQUNZLEtBQUQsQ0FBUjtBQUNEOztBQWhCNkIsQ0FBcEIsQ0FBWixDLENBbUJBOztBQUNBLE1BQU1DLGVBQWUsR0FBR2QsQ0FBQyxDQUFDZSxLQUFGLENBQVEsQ0FDOUJaLEdBRDhCLENBQVIsRUFFckIsTUFGcUIsQ0FBeEI7O0FBSUEsSUFBSXRCLE1BQU0sQ0FBQ21DLFFBQVgsRUFBcUI7QUFDbkI7QUFDQXBCLGdCQUFjLENBQUNxQixPQUFmLENBQXVCO0FBQ3JCYixRQUFJLENBQUNBLElBQUQsRUFBTztBQUNULGFBQU9KLENBQUMsQ0FBQ2tCLFFBQUYsQ0FBV0osZUFBWCxFQUE0QlYsSUFBNUIsQ0FBUDtBQUNELEtBSG9COztBQUtyQjtBQUNBZSxnQkFBWSxHQUFHO0FBQUUsYUFBTyxJQUFQO0FBQWM7O0FBTlYsR0FBdkIsRUFPRyxDQVBILEVBT00sSUFQTjtBQVFELEM7Ozs7Ozs7Ozs7O0FDMUNEckMsTUFBTSxDQUFDc0MsTUFBUCxDQUFjO0FBQUNsQyxRQUFNLEVBQUMsTUFBSUE7QUFBWixDQUFkO0FBQW1DLElBQUltQyxLQUFKO0FBQVV2QyxNQUFNLENBQUNDLElBQVAsQ0FBWSxjQUFaLEVBQTJCO0FBQUNzQyxPQUFLLENBQUNyQyxDQUFELEVBQUc7QUFBQ3FDLFNBQUssR0FBQ3JDLENBQU47QUFBUTs7QUFBbEIsQ0FBM0IsRUFBK0MsQ0FBL0M7QUFBa0QsSUFBSXNDLFlBQUo7QUFBaUJ4QyxNQUFNLENBQUNDLElBQVAsQ0FBWSxjQUFaLEVBQTJCO0FBQUNtQixTQUFPLENBQUNsQixDQUFELEVBQUc7QUFBQ3NDLGdCQUFZLEdBQUN0QyxDQUFiO0FBQWU7O0FBQTNCLENBQTNCLEVBQXdELENBQXhEOztBQUdoSCxNQUFNdUMsZ0JBQU4sU0FBK0JGLEtBQUssQ0FBQ0csVUFBckMsQ0FBZ0Q7QUFDOUNDLFFBQU0sQ0FBQ1osS0FBRCxFQUFRYSxRQUFSLEVBQWtCO0FBQ3RCLFVBQU1DLFFBQVEsR0FBR2QsS0FBakI7QUFDQWMsWUFBUSxDQUFDQyxnQkFBVCxHQUE0QkQsUUFBUSxDQUFDRSxTQUFULEdBQW1CRixRQUFRLENBQUNHLE1BQXhEO0FBQ0FILFlBQVEsQ0FBQ0ksU0FBVCxHQUFxQkosUUFBUSxDQUFDSSxTQUFULElBQXNCLElBQUlDLElBQUosRUFBM0M7QUFDQSxVQUFNQyxNQUFNLEdBQUcsTUFBTVIsTUFBTixDQUFhRSxRQUFiLEVBQXVCRCxRQUF2QixDQUFmO0FBQ0EsV0FBT08sTUFBUDtBQUNEOztBQUNEQyxRQUFNLENBQUNDLFFBQUQsRUFBV0MsUUFBWCxFQUFxQjtBQUN6QixVQUFNSCxNQUFNLEdBQUcsTUFBTUMsTUFBTixDQUFhQyxRQUFiLEVBQXVCQyxRQUF2QixDQUFmO0FBQ0EsV0FBT0gsTUFBUDtBQUNEOztBQUNESSxRQUFNLENBQUNGLFFBQUQsRUFBVztBQUNmLFVBQU1GLE1BQU0sR0FBRyxNQUFNSSxNQUFOLENBQWFGLFFBQWIsQ0FBZjtBQUNBLFdBQU9GLE1BQVA7QUFDRDs7QUFmNkM7O0FBa0J6QyxNQUFNL0MsTUFBTSxHQUFHLElBQUlxQyxnQkFBSixDQUFxQixTQUFyQixDQUFmO0FBRVA7QUFDQXJDLE1BQU0sQ0FBQ29ELElBQVAsQ0FBWTtBQUNWYixRQUFNLEdBQUc7QUFBRSxXQUFPLElBQVA7QUFBYyxHQURmOztBQUVWUyxRQUFNLEdBQUc7QUFBRSxXQUFPLElBQVA7QUFBYyxHQUZmOztBQUdWRyxRQUFNLEdBQUc7QUFBRSxXQUFPLElBQVA7QUFBYzs7QUFIZixDQUFaO0FBTUFuRCxNQUFNLENBQUNxRCxNQUFQLEdBQWdCLElBQUlqQixZQUFKLENBQWlCO0FBQy9Ca0IsS0FBRyxFQUFFO0FBQ0hDLFFBQUksRUFBRUMsTUFESDtBQUVIQyxTQUFLLEVBQUVyQixZQUFZLENBQUNzQixLQUFiLENBQW1CQztBQUZ2QixHQUQwQjtBQUsvQmhCLFdBQVMsRUFBRTtBQUNUWSxRQUFJLEVBQUVDLE1BREc7QUFFVEksWUFBUSxFQUFFLElBRkQ7QUFHVEMsY0FBVSxFQUFFO0FBSEgsR0FMb0I7QUFVL0JqQixRQUFNLEVBQUU7QUFDTlcsUUFBSSxFQUFFQyxNQURBO0FBRU5JLFlBQVEsRUFBRSxJQUZKO0FBR05DLGNBQVUsRUFBRTtBQUhOLEdBVnVCO0FBZS9CdEMsTUFBSSxFQUFFO0FBQ0pnQyxRQUFJLEVBQUVDLE1BREY7QUFFSkksWUFBUSxFQUFFLElBRk47QUFHSkMsY0FBVSxFQUFFO0FBSFIsR0FmeUI7QUFvQi9CQyxPQUFLLEVBQUU7QUFDTFAsUUFBSSxFQUFFbkIsWUFBWSxDQUFDMkIsT0FEZDtBQUVMSCxZQUFRLEVBQUUsSUFGTDtBQUdMQyxjQUFVLEVBQUU7QUFIUCxHQXBCd0I7QUF5Qi9CRyxRQUFNLEVBQUU7QUFDTlQsUUFBSSxFQUFFQyxNQURBO0FBRU5JLFlBQVEsRUFBRSxJQUZKO0FBR05DLGNBQVUsRUFBRTtBQUhOLEdBekJ1QjtBQThCL0JJLE1BQUksRUFBRTtBQUNGVixRQUFJLEVBQUVDLE1BREo7QUFFRkksWUFBUSxFQUFFLElBRlI7QUFHRkMsY0FBVSxFQUFFO0FBSFYsR0E5QnlCO0FBbUMvQkssV0FBUyxFQUFFO0FBQ1BYLFFBQUksRUFBRUMsTUFEQztBQUVQSSxZQUFRLEVBQUUsSUFGSDtBQUdQQyxjQUFVLEVBQUU7QUFITCxHQW5Db0I7QUF3Qy9CaEIsV0FBUyxFQUFFO0FBQ1RVLFFBQUksRUFBRVQsSUFERztBQUVUZSxjQUFVLEVBQUU7QUFGSCxHQXhDb0I7QUE0Qy9CTSxhQUFXLEVBQUU7QUFDWFosUUFBSSxFQUFFVCxJQURLO0FBRVhjLFlBQVEsRUFBRSxJQUZDO0FBR1hDLGNBQVUsRUFBRTtBQUhELEdBNUNrQjtBQWlEL0JPLGFBQVcsRUFBRTtBQUNYYixRQUFJLEVBQUVDLE1BREs7QUFFWEMsU0FBSyxFQUFFckIsWUFBWSxDQUFDc0IsS0FBYixDQUFtQlcsRUFGZjtBQUdYVCxZQUFRLEVBQUUsSUFIQztBQUlYQyxjQUFVLEVBQUU7QUFKRCxHQWpEa0I7QUF1RC9CUyxtQkFBaUIsRUFBRTtBQUNqQmYsUUFBSSxFQUFFQyxNQURXO0FBRWpCSSxZQUFRLEVBQUUsSUFGTztBQUdqQkMsY0FBVSxFQUFFO0FBSEssR0F2RFk7QUE0RC9CdEQsU0FBTyxFQUFDO0FBQ05nRCxRQUFJLEVBQUVDLE1BREE7QUFFTkksWUFBUSxFQUFFLElBRko7QUFHTkgsU0FBSyxFQUFFckIsWUFBWSxDQUFDc0IsS0FBYixDQUFtQkM7QUFIcEIsR0E1RHVCO0FBaUUvQm5DLE9BQUssRUFBQztBQUNGK0IsUUFBSSxFQUFFQyxNQURKO0FBRUZJLFlBQVEsRUFBRSxJQUZSO0FBR0ZDLGNBQVUsRUFBRTtBQUhWO0FBakV5QixDQUFqQixDQUFoQjtBQXdFQTdELE1BQU0sQ0FBQ3VFLFlBQVAsQ0FBb0J2RSxNQUFNLENBQUNxRCxNQUEzQixFLENBRUE7QUFDQTtBQUNBOztBQUNBckQsTUFBTSxDQUFDUyxZQUFQLEdBQXNCO0FBQ3BCNkMsS0FBRyxFQUFFLENBRGU7QUFFcEJYLFdBQVMsRUFBRSxDQUZTO0FBR3BCQyxRQUFNLEVBQUUsQ0FIWTtBQUlwQnJCLE1BQUksRUFBRSxDQUpjO0FBS3BCdUMsT0FBSyxFQUFFLENBTGE7QUFNcEJFLFFBQU0sRUFBRSxDQU5ZO0FBT3BCQyxNQUFJLEVBQUUsQ0FQYztBQVFwQkMsV0FBUyxFQUFFLENBUlM7QUFTcEJyQixXQUFTLEVBQUUsQ0FUUztBQVVwQnNCLGFBQVcsRUFBRSxDQVZPO0FBV3BCQyxhQUFXLEVBQUUsQ0FYTztBQVlwQjdELFNBQU8sRUFBRSxDQVpXO0FBYXBCaUIsT0FBSyxFQUFFO0FBYmEsQ0FBdEIsQzs7Ozs7Ozs7Ozs7QUMzR0EsSUFBSTdCLE1BQUo7QUFBV0MsTUFBTSxDQUFDQyxJQUFQLENBQVksZUFBWixFQUE0QjtBQUFDRixRQUFNLENBQUNHLENBQUQsRUFBRztBQUFDSCxVQUFNLEdBQUNHLENBQVA7QUFBUzs7QUFBcEIsQ0FBNUIsRUFBa0QsQ0FBbEQ7QUFBcUQsSUFBSUMsS0FBSjtBQUFVSCxNQUFNLENBQUNDLElBQVAsQ0FBWSx1QkFBWixFQUFvQztBQUFDRSxPQUFLLENBQUNELENBQUQsRUFBRztBQUFDQyxTQUFLLEdBQUNELENBQU47QUFBUTs7QUFBbEIsQ0FBcEMsRUFBd0QsQ0FBeEQ7QUFBMkQsSUFBSTBFLFVBQUo7QUFBZTVFLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGtCQUFaLEVBQStCO0FBQUMyRSxZQUFVLENBQUMxRSxDQUFELEVBQUc7QUFBQzBFLGNBQVUsR0FBQzFFLENBQVg7QUFBYTs7QUFBNUIsQ0FBL0IsRUFBNkQsQ0FBN0Q7QUFBZ0UsSUFBSUUsTUFBSjtBQUFXSixNQUFNLENBQUNDLElBQVAsQ0FBWSwwQkFBWixFQUF1QztBQUFDRyxRQUFNLENBQUNGLENBQUQsRUFBRztBQUFDRSxVQUFNLEdBQUNGLENBQVA7QUFBUzs7QUFBcEIsQ0FBdkMsRUFBNkQsQ0FBN0Q7QUFLL05ILE1BQU0sQ0FBQ00sT0FBUCxDQUFlLG9CQUFmLEVBQW9DLFNBQVN3RSxZQUFULEdBQXVCO0FBQ3pELE1BQUlDLFFBQVEsR0FBQyxFQUFiOztBQUNBLE1BQUcsQ0FBQzNFLEtBQUssQ0FBQ00sWUFBTixDQUFtQixLQUFLRixNQUF4QixFQUFnQyxDQUFDLE9BQUQsQ0FBaEMsQ0FBSixFQUErQztBQUM3Q3VFLFlBQVEsQ0FBQ0MsSUFBVCxDQUNFO0FBQUNDLGFBQU8sRUFBQztBQUNUQyxhQUFLLEVBQUU7QUFDTEMsWUFBRSxFQUFFO0FBQUVDLGdCQUFJLEVBQUUsQ0FBRSxVQUFGLEVBQWMsS0FBSzVFLE1BQW5CO0FBQVIsV0FEQztBQUVMNkUsY0FBSSxFQUFFLFNBRkQ7QUFHTEMsY0FBSSxFQUFFO0FBSEQ7QUFERTtBQUFULEtBREY7QUFNRzs7QUFDRFAsVUFBUSxDQUFDQyxJQUFULENBQWM7QUFBRU8sV0FBTyxFQUFFO0FBQUVDLFVBQUksRUFBRSxZQUFSO0FBQXNCQyxnQkFBVSxFQUFFLFdBQWxDO0FBQStDQyxrQkFBWSxFQUFFLEtBQTdEO0FBQW9FQyxRQUFFLEVBQUU7QUFBeEU7QUFBWCxHQUFkO0FBQ0FaLFVBQVEsQ0FBQ0MsSUFBVCxDQUFjO0FBQUVZLFdBQU8sRUFBRTtBQUFYLEdBQWQ7QUFDQWIsVUFBUSxDQUFDQyxJQUFULENBQWM7QUFBRWEsWUFBUSxFQUFFO0FBQUMsNEJBQXFCO0FBQXRCO0FBQVosR0FBZDtBQUVBLFFBQU16QyxNQUFNLEdBQUcvQyxNQUFNLENBQUN5RixTQUFQLENBQWlCZixRQUFqQixDQUFmO0FBQ0EsTUFBSWdCLElBQUksR0FBQyxFQUFUO0FBQ0EzQyxRQUFNLENBQUM0QyxPQUFQLENBQWVDLE9BQU8sSUFBSTtBQUN4QkYsUUFBSSxDQUFDZixJQUFMLENBQVVpQixPQUFPLENBQUNDLGNBQVIsQ0FBdUJ2QyxHQUFqQztBQUNELEdBRkQ7QUFHSixTQUFPa0IsVUFBVSxDQUFDbEUsSUFBWCxDQUFnQjtBQUFDLFdBQU07QUFBQyxhQUFNb0Y7QUFBUDtBQUFQLEdBQWhCLEVBQXFDO0FBQUNsRixVQUFNLEVBQUNnRSxVQUFVLENBQUMvRDtBQUFuQixHQUFyQyxDQUFQO0FBQ0QsQ0FwQkQ7QUFxQkFkLE1BQU0sQ0FBQ00sT0FBUCxDQUFlLGdCQUFmLEVBQWlDLFNBQVM2RixhQUFULEdBQXlCO0FBQ3hELE1BQUcsQ0FBQyxLQUFLM0YsTUFBTixJQUFnQixDQUFDSixLQUFLLENBQUNNLFlBQU4sQ0FBbUIsS0FBS0YsTUFBeEIsRUFBZ0MsQ0FBQyxPQUFELENBQWhDLENBQXBCLEVBQWdFO0FBQzlELFdBQU8sS0FBS0MsS0FBTCxFQUFQO0FBQ0Q7O0FBRUQsU0FBT29FLFVBQVUsQ0FBQ2xFLElBQVgsQ0FBZ0IsRUFBaEIsRUFBb0I7QUFDekJFLFVBQU0sRUFBRWdFLFVBQVUsQ0FBQy9EO0FBRE0sR0FBcEIsQ0FBUDtBQUdELENBUkQsRTs7Ozs7Ozs7Ozs7QUMxQkFiLE1BQU0sQ0FBQ3NDLE1BQVAsQ0FBYztBQUFDc0MsWUFBVSxFQUFDLE1BQUlBO0FBQWhCLENBQWQ7QUFBMkMsSUFBSXJDLEtBQUo7QUFBVXZDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGNBQVosRUFBMkI7QUFBQ3NDLE9BQUssQ0FBQ3JDLENBQUQsRUFBRztBQUFDcUMsU0FBSyxHQUFDckMsQ0FBTjtBQUFROztBQUFsQixDQUEzQixFQUErQyxDQUEvQztBQUFrRCxJQUFJc0MsWUFBSjtBQUFpQnhDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGNBQVosRUFBMkI7QUFBQ21CLFNBQU8sQ0FBQ2xCLENBQUQsRUFBRztBQUFDc0MsZ0JBQVksR0FBQ3RDLENBQWI7QUFBZTs7QUFBM0IsQ0FBM0IsRUFBd0QsQ0FBeEQ7O0FBR3hILE1BQU1pRyxvQkFBTixTQUFtQzVELEtBQUssQ0FBQ0csVUFBekMsQ0FBb0Q7QUFDbERDLFFBQU0sQ0FBQ0ksU0FBRCxFQUFZSCxRQUFaLEVBQXNCO0FBQzFCLFVBQU13RCxZQUFZLEdBQUdyRCxTQUFyQjtBQUNBcUQsZ0JBQVksQ0FBQ25ELFNBQWIsR0FBeUJtRCxZQUFZLENBQUNuRCxTQUFiLElBQTBCLElBQUlDLElBQUosRUFBbkQ7QUFDQSxVQUFNQyxNQUFNLEdBQUcsTUFBTVIsTUFBTixDQUFheUQsWUFBYixFQUEyQnhELFFBQTNCLENBQWY7QUFDQSxXQUFPTyxNQUFQO0FBQ0Q7O0FBQ0RDLFFBQU0sQ0FBQ0MsUUFBRCxFQUFXQyxRQUFYLEVBQXFCO0FBQ3pCLFVBQU1ILE1BQU0sR0FBRyxNQUFNQyxNQUFOLENBQWFDLFFBQWIsRUFBdUJDLFFBQXZCLENBQWY7QUFDQSxXQUFPSCxNQUFQO0FBQ0Q7O0FBQ0RJLFFBQU0sQ0FBQ0YsUUFBRCxFQUFXO0FBQ2YsVUFBTUYsTUFBTSxHQUFHLE1BQU1JLE1BQU4sQ0FBYUYsUUFBYixDQUFmO0FBQ0EsV0FBT0YsTUFBUDtBQUNEOztBQWRpRDs7QUFpQjdDLE1BQU15QixVQUFVLEdBQUcsSUFBSXVCLG9CQUFKLENBQXlCLFlBQXpCLENBQW5CO0FBRVA7QUFDQXZCLFVBQVUsQ0FBQ3BCLElBQVgsQ0FBZ0I7QUFDZGIsUUFBTSxHQUFHO0FBQUUsV0FBTyxJQUFQO0FBQWMsR0FEWDs7QUFFZFMsUUFBTSxHQUFHO0FBQUUsV0FBTyxJQUFQO0FBQWMsR0FGWDs7QUFHZEcsUUFBTSxHQUFHO0FBQUUsV0FBTyxJQUFQO0FBQWM7O0FBSFgsQ0FBaEI7QUFNQXFCLFVBQVUsQ0FBQ25CLE1BQVgsR0FBb0IsSUFBSWpCLFlBQUosQ0FBaUI7QUFDbkNrQixLQUFHLEVBQUU7QUFDSEMsUUFBSSxFQUFFQyxNQURIO0FBRUhDLFNBQUssRUFBRXJCLFlBQVksQ0FBQ3NCLEtBQWIsQ0FBbUJDO0FBRnZCLEdBRDhCO0FBS25Dc0MsT0FBSyxFQUFFO0FBQ0wxQyxRQUFJLEVBQUVDLE1BREQ7QUFFTE0sU0FBSyxFQUFFLElBRkY7QUFHTEQsY0FBVSxFQUFFO0FBSFAsR0FMNEI7QUFVbkNxQyxZQUFVLEVBQUU7QUFDVjNDLFFBQUksRUFBRUMsTUFESTtBQUVWMkMsVUFBTSxFQUFFLElBRkU7QUFHVnRDLGNBQVUsRUFBRTtBQUhGLEdBVnVCO0FBZW5DdUMsV0FBUyxFQUFFO0FBQ1Q3QyxRQUFJLEVBQUVDLE1BREc7QUFFVDJDLFVBQU0sRUFBRSxJQUZDO0FBR1R0QyxjQUFVLEVBQUU7QUFISCxHQWZ3QjtBQW9CbkNoQixXQUFTLEVBQUU7QUFDVFUsUUFBSSxFQUFFVCxJQURHO0FBRVRlLGNBQVUsRUFBRTtBQUZIO0FBcEJ3QixDQUFqQixDQUFwQjtBQTBCQVcsVUFBVSxDQUFDRCxZQUFYLENBQXdCQyxVQUFVLENBQUNuQixNQUFuQyxFLENBRUE7QUFDQTtBQUNBOztBQUNBbUIsVUFBVSxDQUFDL0QsWUFBWCxHQUEwQjtBQUN4QjZDLEtBQUcsRUFBRSxDQURtQjtBQUV4QjJDLE9BQUssRUFBRSxDQUZpQjtBQUd4QkcsV0FBUyxFQUFFLENBSGE7QUFJeEJ2RCxXQUFTLEVBQUU7QUFKYSxDQUExQixDOzs7Ozs7Ozs7OztBQzVEQWpELE1BQU0sQ0FBQ3NDLE1BQVAsQ0FBYztBQUFDbUUsaUJBQWUsRUFBQyxNQUFJQTtBQUFyQixDQUFkO0FBQXFELElBQUlsRSxLQUFKO0FBQVV2QyxNQUFNLENBQUNDLElBQVAsQ0FBWSxjQUFaLEVBQTJCO0FBQUNzQyxPQUFLLENBQUNyQyxDQUFELEVBQUc7QUFBQ3FDLFNBQUssR0FBQ3JDLENBQU47QUFBUTs7QUFBbEIsQ0FBM0IsRUFBK0MsQ0FBL0M7QUFBa0QsSUFBSXNDLFlBQUo7QUFBaUJ4QyxNQUFNLENBQUNDLElBQVAsQ0FBWSxjQUFaLEVBQTJCO0FBQUNtQixTQUFPLENBQUNsQixDQUFELEVBQUc7QUFBQ3NDLGdCQUFZLEdBQUN0QyxDQUFiO0FBQWU7O0FBQTNCLENBQTNCLEVBQXdELENBQXhEOztBQUdsSSxNQUFNd0cseUJBQU4sU0FBd0NuRSxLQUFLLENBQUNHLFVBQTlDLENBQXlEO0FBQ3ZEQyxRQUFNLENBQUNnRSxLQUFELEVBQVEvRCxRQUFSLEVBQWtCO0FBQ3RCLFVBQU1PLE1BQU0sR0FBRyxNQUFNUixNQUFOLENBQWFnRSxLQUFiLEVBQW9CL0QsUUFBcEIsQ0FBZjtBQUNBLFdBQU9PLE1BQVA7QUFDRDs7QUFDREMsUUFBTSxDQUFDQyxRQUFELEVBQVdDLFFBQVgsRUFBcUI7QUFDekIsVUFBTUgsTUFBTSxHQUFHLE1BQU1DLE1BQU4sQ0FBYUMsUUFBYixFQUF1QkMsUUFBdkIsQ0FBZjtBQUNBLFdBQU9ILE1BQVA7QUFDRDs7QUFDREksUUFBTSxDQUFDRixRQUFELEVBQVc7QUFDZixVQUFNRixNQUFNLEdBQUcsTUFBTUksTUFBTixDQUFhRixRQUFiLENBQWY7QUFDQSxXQUFPRixNQUFQO0FBQ0Q7O0FBWnNEOztBQWVsRCxNQUFNc0QsZUFBZSxHQUFHLElBQUlDLHlCQUFKLENBQThCLGtCQUE5QixDQUF4QjtBQUVQO0FBQ0FELGVBQWUsQ0FBQ2pELElBQWhCLENBQXFCO0FBQ25CYixRQUFNLEdBQUc7QUFBRSxXQUFPLElBQVA7QUFBYyxHQUROOztBQUVuQlMsUUFBTSxHQUFHO0FBQUUsV0FBTyxJQUFQO0FBQWMsR0FGTjs7QUFHbkJHLFFBQU0sR0FBRztBQUFFLFdBQU8sSUFBUDtBQUFjOztBQUhOLENBQXJCO0FBTUFrRCxlQUFlLENBQUNoRCxNQUFoQixHQUF5QixJQUFJakIsWUFBSixDQUFpQjtBQUN4Q2tCLEtBQUcsRUFBRTtBQUNIQyxRQUFJLEVBQUVDLE1BREg7QUFFSEMsU0FBSyxFQUFFckIsWUFBWSxDQUFDc0IsS0FBYixDQUFtQkM7QUFGdkIsR0FEbUM7QUFLeEN6QyxNQUFJLEVBQUU7QUFDSnFDLFFBQUksRUFBRUMsTUFERjtBQUVKTSxTQUFLLEVBQUUsSUFGSDtBQUdKRCxjQUFVLEVBQUU7QUFIUixHQUxrQztBQVV4QzJDLE9BQUssRUFBRTtBQUNMakQsUUFBSSxFQUFFQyxNQUREO0FBRUxLLGNBQVUsRUFBRTtBQUZQLEdBVmlDO0FBY3hDNEMsU0FBTyxFQUFFO0FBQ1BsRCxRQUFJLEVBQUVDLE1BREM7QUFFUEssY0FBVSxFQUFFO0FBRkwsR0FkK0I7QUFrQnhDSyxXQUFTLEVBQUU7QUFDTFgsUUFBSSxFQUFFQyxNQUREO0FBRUxJLFlBQVEsRUFBRSxJQUZMO0FBR0xFLFNBQUssRUFBRSxJQUhGO0FBSUxELGNBQVUsRUFBRTtBQUpQLEdBbEI2QjtBQXdCeENDLE9BQUssRUFBRTtBQUNEUCxRQUFJLEVBQUVuQixZQUFZLENBQUMyQixPQURsQjtBQUVESCxZQUFRLEVBQUUsSUFGVDtBQUdEQyxjQUFVLEVBQUU7QUFIWCxHQXhCaUM7QUE2QnhDSSxNQUFJLEVBQUU7QUFDSlYsUUFBSSxFQUFFQyxNQURGO0FBRUpLLGNBQVUsRUFBRTtBQUZSO0FBN0JrQyxDQUFqQixDQUF6QjtBQW1DQXdDLGVBQWUsQ0FBQzlCLFlBQWhCLENBQTZCOEIsZUFBZSxDQUFDaEQsTUFBN0MsRSxDQUVBO0FBQ0E7QUFDQTs7QUFDQWdELGVBQWUsQ0FBQzVGLFlBQWhCLEdBQStCO0FBQzdCNkMsS0FBRyxFQUFFLENBRHdCO0FBRTdCcEMsTUFBSSxFQUFFLENBRnVCO0FBRzdCc0YsT0FBSyxFQUFFLENBSHNCO0FBSTdCQyxTQUFPLEVBQUUsQ0FKb0I7QUFLN0J2QyxXQUFTLEVBQUUsQ0FMa0I7QUFNN0JKLE9BQUssRUFBRSxDQU5zQjtBQU83QkcsTUFBSSxFQUFFO0FBUHVCLENBQS9CLEM7Ozs7Ozs7Ozs7O0FDbkVBLElBQUlwRCxlQUFKO0FBQW9CakIsTUFBTSxDQUFDQyxJQUFQLENBQVksNkJBQVosRUFBMEM7QUFBQ2dCLGlCQUFlLENBQUNmLENBQUQsRUFBRztBQUFDZSxtQkFBZSxHQUFDZixDQUFoQjtBQUFrQjs7QUFBdEMsQ0FBMUMsRUFBa0YsQ0FBbEY7QUFBcUYsSUFBSUgsTUFBSjtBQUFXQyxNQUFNLENBQUNDLElBQVAsQ0FBWSxlQUFaLEVBQTRCO0FBQUNGLFFBQU0sQ0FBQ0csQ0FBRCxFQUFHO0FBQUNILFVBQU0sR0FBQ0csQ0FBUDtBQUFTOztBQUFwQixDQUE1QixFQUFrRCxDQUFsRDtBQUFxRCxJQUFJWSxjQUFKO0FBQW1CZCxNQUFNLENBQUNDLElBQVAsQ0FBWSx5QkFBWixFQUFzQztBQUFDYSxnQkFBYyxDQUFDWixDQUFELEVBQUc7QUFBQ1ksa0JBQWMsR0FBQ1osQ0FBZjtBQUFpQjs7QUFBcEMsQ0FBdEMsRUFBNEUsQ0FBNUU7QUFBK0UsSUFBSTRHLFdBQUo7QUFBZ0I5RyxNQUFNLENBQUNDLElBQVAsQ0FBWSwrQ0FBWixFQUE0RDtBQUFDbUIsU0FBTyxDQUFDbEIsQ0FBRCxFQUFHO0FBQUM0RyxlQUFXLEdBQUM1RyxDQUFaO0FBQWM7O0FBQTFCLENBQTVELEVBQXdGLENBQXhGO0FBQTJGLElBQUk2RyxXQUFKO0FBQWdCL0csTUFBTSxDQUFDQyxJQUFQLENBQVksOENBQVosRUFBMkQ7QUFBQ21CLFNBQU8sQ0FBQ2xCLENBQUQsRUFBRztBQUFDNkcsZUFBVyxHQUFDN0csQ0FBWjtBQUFjOztBQUExQixDQUEzRCxFQUF1RixDQUF2RjtBQU90WSxNQUFNOEcsVUFBVSxHQUFHLElBQUkvRixlQUFKLENBQW9CO0FBQ3JDSyxNQUFJLEVBQUUscUJBRCtCO0FBRXJDQyxVQUFRLEVBQUUsSUFGMkI7O0FBR3JDQyxLQUFHLEdBQUc7QUFDSixXQUFPc0YsV0FBVyxFQUFsQjtBQUNEOztBQUxvQyxDQUFwQixDQUFuQjtBQVFBLE1BQU1HLFVBQVUsR0FBRyxJQUFJaEcsZUFBSixDQUFvQjtBQUNyQ0ssTUFBSSxFQUFFLHFCQUQrQjtBQUVyQ0MsVUFBUSxFQUFFLElBRjJCOztBQUdyQ0MsS0FBRyxHQUFHO0FBQ0osVUFBTTBGLE1BQU0sR0FBR0gsV0FBVyxFQUExQjtBQUNBLFdBQU9HLE1BQVA7QUFDRDs7QUFOb0MsQ0FBcEIsQ0FBbkIsQyxDQVVBOztBQUNBLE1BQU1DLGNBQWMsR0FBR2pHLENBQUMsQ0FBQ2UsS0FBRixDQUFRLENBQzdCK0UsVUFENkIsRUFFOUJDLFVBRjhCLENBQVIsRUFFVCxNQUZTLENBQXZCOztBQUlBLElBQUlsSCxNQUFNLENBQUNtQyxRQUFYLEVBQXFCO0FBQ25CO0FBQ0FwQixnQkFBYyxDQUFDcUIsT0FBZixDQUF1QjtBQUNyQmIsUUFBSSxDQUFDQSxJQUFELEVBQU87QUFDVCxhQUFPSixDQUFDLENBQUNrQixRQUFGLENBQVcrRSxjQUFYLEVBQTJCN0YsSUFBM0IsQ0FBUDtBQUNELEtBSG9COztBQUtyQjtBQUNBZSxnQkFBWSxHQUFHO0FBQUUsYUFBTyxJQUFQO0FBQWM7O0FBTlYsR0FBdkIsRUFPRyxDQVBILEVBT00sSUFQTjtBQVFELEM7Ozs7Ozs7Ozs7O0FDeENELElBQUl0QyxNQUFKO0FBQVdDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGVBQVosRUFBNEI7QUFBQ0YsUUFBTSxDQUFDRyxDQUFELEVBQUc7QUFBQ0gsVUFBTSxHQUFDRyxDQUFQO0FBQVM7O0FBQXBCLENBQTVCLEVBQWtELENBQWxEO0FBQXFELElBQUlZLGNBQUo7QUFBbUJkLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLHlCQUFaLEVBQXNDO0FBQUNhLGdCQUFjLENBQUNaLENBQUQsRUFBRztBQUFDWSxrQkFBYyxHQUFDWixDQUFmO0FBQWlCOztBQUFwQyxDQUF0QyxFQUE0RSxDQUE1RTtBQUErRSxJQUFJZSxlQUFKO0FBQW9CakIsTUFBTSxDQUFDQyxJQUFQLENBQVksNkJBQVosRUFBMEM7QUFBQ2dCLGlCQUFlLENBQUNmLENBQUQsRUFBRztBQUFDZSxtQkFBZSxHQUFDZixDQUFoQjtBQUFrQjs7QUFBdEMsQ0FBMUMsRUFBa0YsQ0FBbEY7QUFBcUYsSUFBSWtILFlBQUo7QUFBaUJwSCxNQUFNLENBQUNDLElBQVAsQ0FBWSx1Q0FBWixFQUFvRDtBQUFDbUIsU0FBTyxDQUFDbEIsQ0FBRCxFQUFHO0FBQUNrSCxnQkFBWSxHQUFDbEgsQ0FBYjtBQUFlOztBQUEzQixDQUFwRCxFQUFpRixDQUFqRjtBQUs1UixNQUFNbUgsZUFBZSxHQUFHLElBQUlwRyxlQUFKLENBQW9CO0FBQzFDSyxNQUFJLEVBQUUsa0JBRG9DO0FBRTFDQyxVQUFRLEVBQUUsSUFGZ0M7O0FBRzFDQyxLQUFHLEdBQUc7QUFDSixXQUFPNEYsWUFBWSxFQUFuQjtBQUNEOztBQUx5QyxDQUFwQixDQUF4QixDLENBUUE7O0FBQ0EsTUFBTUQsY0FBYyxHQUFHakcsQ0FBQyxDQUFDZSxLQUFGLENBQVEsQ0FDN0JvRixlQUQ2QixDQUFSLEVBRXBCLE1BRm9CLENBQXZCOztBQUlBLElBQUl0SCxNQUFNLENBQUNtQyxRQUFYLEVBQXFCO0FBQ25CO0FBQ0FwQixnQkFBYyxDQUFDcUIsT0FBZixDQUF1QjtBQUNyQmIsUUFBSSxDQUFDQSxJQUFELEVBQU87QUFDVCxhQUFPSixDQUFDLENBQUNrQixRQUFGLENBQVcrRSxjQUFYLEVBQTJCN0YsSUFBM0IsQ0FBUDtBQUNELEtBSG9COztBQUtyQjtBQUNBZSxnQkFBWSxHQUFHO0FBQUUsYUFBTyxJQUFQO0FBQWM7O0FBTlYsR0FBdkIsRUFPRyxDQVBILEVBT00sSUFQTjtBQVFELEM7Ozs7Ozs7Ozs7O0FDNUJEckMsTUFBTSxDQUFDc0MsTUFBUCxDQUFjO0FBQUNnRixNQUFJLEVBQUMsTUFBSUE7QUFBVixDQUFkO0FBQStCLElBQUkvRSxLQUFKO0FBQVV2QyxNQUFNLENBQUNDLElBQVAsQ0FBWSxjQUFaLEVBQTJCO0FBQUNzQyxPQUFLLENBQUNyQyxDQUFELEVBQUc7QUFBQ3FDLFNBQUssR0FBQ3JDLENBQU47QUFBUTs7QUFBbEIsQ0FBM0IsRUFBK0MsQ0FBL0M7QUFBa0QsSUFBSXNDLFlBQUo7QUFBaUJ4QyxNQUFNLENBQUNDLElBQVAsQ0FBWSxjQUFaLEVBQTJCO0FBQUNtQixTQUFPLENBQUNsQixDQUFELEVBQUc7QUFBQ3NDLGdCQUFZLEdBQUN0QyxDQUFiO0FBQWU7O0FBQTNCLENBQTNCLEVBQXdELENBQXhEOztBQUc1RyxNQUFNcUgsY0FBTixTQUE2QmhGLEtBQUssQ0FBQ0csVUFBbkMsQ0FBOEM7QUFDNUNDLFFBQU0sQ0FBQ2hCLElBQUQsRUFBT2lCLFFBQVAsRUFBaUI7QUFDckIsVUFBTTRFLE9BQU8sR0FBRzdGLElBQWhCO0FBQ0EsVUFBTXdCLE1BQU0sR0FBRyxNQUFNUixNQUFOLENBQWE2RSxPQUFiLEVBQXNCNUUsUUFBdEIsQ0FBZjtBQUNBLFdBQU9PLE1BQVA7QUFDRDs7QUFDREMsUUFBTSxDQUFDQyxRQUFELEVBQVdDLFFBQVgsRUFBcUI7QUFDekIsVUFBTUgsTUFBTSxHQUFHLE1BQU1DLE1BQU4sQ0FBYUMsUUFBYixFQUF1QkMsUUFBdkIsQ0FBZjtBQUNBLFdBQU9ILE1BQVA7QUFDRDs7QUFDREksUUFBTSxDQUFDRixRQUFELEVBQVc7QUFDZixVQUFNRixNQUFNLEdBQUcsTUFBTUksTUFBTixDQUFhRixRQUFiLENBQWY7QUFDQSxXQUFPRixNQUFQO0FBQ0Q7O0FBYjJDOztBQWdCdkMsTUFBTW1FLElBQUksR0FBRyxJQUFJQyxjQUFKLENBQW1CLE1BQW5CLENBQWI7QUFFUDtBQUNBRCxJQUFJLENBQUM5RCxJQUFMLENBQVU7QUFDUmIsUUFBTSxHQUFHO0FBQUUsV0FBTyxJQUFQO0FBQWMsR0FEakI7O0FBRVJTLFFBQU0sR0FBRztBQUFFLFdBQU8sSUFBUDtBQUFjLEdBRmpCOztBQUdSRyxRQUFNLEdBQUc7QUFBRSxXQUFPLElBQVA7QUFBYzs7QUFIakIsQ0FBVjtBQU1BK0QsSUFBSSxDQUFDN0QsTUFBTCxHQUFjLElBQUlqQixZQUFKLENBQWlCO0FBQzdCa0IsS0FBRyxFQUFFO0FBQ0hDLFFBQUksRUFBRUMsTUFESDtBQUVIQyxTQUFLLEVBQUVyQixZQUFZLENBQUNzQixLQUFiLENBQW1CQztBQUZ2QixHQUR3QjtBQUs3QjBELEtBQUcsRUFBRTtBQUNIOUQsUUFBSSxFQUFFQyxNQURIO0FBRUhNLFNBQUssRUFBRSxJQUZKO0FBR0hELGNBQVUsRUFBRTtBQUhULEdBTHdCO0FBVTdCMkMsT0FBSyxFQUFFO0FBQ0xqRCxRQUFJLEVBQUVDO0FBREQ7QUFWc0IsQ0FBakIsQ0FBZDtBQWVBMEQsSUFBSSxDQUFDM0MsWUFBTCxDQUFrQjJDLElBQUksQ0FBQzdELE1BQXZCLEUsQ0FFQTtBQUNBO0FBQ0E7O0FBQ0E2RCxJQUFJLENBQUN6RyxZQUFMLEdBQW9CLEVBQXBCLEM7Ozs7Ozs7Ozs7O0FDaERBYixNQUFNLENBQUNzQyxNQUFQLENBQWM7QUFBQ29GLFNBQU8sRUFBQyxNQUFJQTtBQUFiLENBQWQ7QUFBcUMsSUFBSW5GLEtBQUo7QUFBVXZDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGNBQVosRUFBMkI7QUFBQ3NDLE9BQUssQ0FBQ3JDLENBQUQsRUFBRztBQUFDcUMsU0FBSyxHQUFDckMsQ0FBTjtBQUFROztBQUFsQixDQUEzQixFQUErQyxDQUEvQztBQUFrRCxJQUFJc0MsWUFBSjtBQUFpQnhDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGNBQVosRUFBMkI7QUFBQ21CLFNBQU8sQ0FBQ2xCLENBQUQsRUFBRztBQUFDc0MsZ0JBQVksR0FBQ3RDLENBQWI7QUFBZTs7QUFBM0IsQ0FBM0IsRUFBd0QsQ0FBeEQ7O0FBR2xILE1BQU15SCxpQkFBTixTQUFnQ3BGLEtBQUssQ0FBQ0csVUFBdEMsQ0FBaUQ7QUFDL0NDLFFBQU0sQ0FBQ0ssTUFBRCxFQUFTSixRQUFULEVBQW1CO0FBQ3ZCLFVBQU1nRixTQUFTLEdBQUc1RSxNQUFsQjtBQUNBNEUsYUFBUyxDQUFDM0UsU0FBVixHQUFzQjJFLFNBQVMsQ0FBQzNFLFNBQVYsSUFBdUIsSUFBSUMsSUFBSixFQUE3QztBQUNBLFVBQU1DLE1BQU0sR0FBRyxNQUFNUixNQUFOLENBQWFpRixTQUFiLEVBQXdCaEYsUUFBeEIsQ0FBZjtBQUNBLFdBQU9PLE1BQVA7QUFDRDs7QUFDREMsUUFBTSxDQUFDQyxRQUFELEVBQVdDLFFBQVgsRUFBcUI7QUFDekIsVUFBTUgsTUFBTSxHQUFHLE1BQU1DLE1BQU4sQ0FBYUMsUUFBYixFQUF1QkMsUUFBdkIsQ0FBZjtBQUNBLFdBQU9ILE1BQVA7QUFDRDs7QUFDREksUUFBTSxDQUFDRixRQUFELEVBQVc7QUFDZixVQUFNRixNQUFNLEdBQUcsTUFBTUksTUFBTixDQUFhRixRQUFiLENBQWY7QUFDQSxXQUFPRixNQUFQO0FBQ0Q7O0FBZDhDOztBQWlCMUMsTUFBTXVFLE9BQU8sR0FBRyxJQUFJQyxpQkFBSixDQUFzQixTQUF0QixDQUFoQjtBQUVQO0FBQ0FELE9BQU8sQ0FBQ2xFLElBQVIsQ0FBYTtBQUNYYixRQUFNLEdBQUc7QUFBRSxXQUFPLElBQVA7QUFBYyxHQURkOztBQUVYUyxRQUFNLEdBQUc7QUFBRSxXQUFPLElBQVA7QUFBYyxHQUZkOztBQUdYRyxRQUFNLEdBQUc7QUFBRSxXQUFPLElBQVA7QUFBYzs7QUFIZCxDQUFiO0FBTUFtRSxPQUFPLENBQUNqRSxNQUFSLEdBQWlCLElBQUlqQixZQUFKLENBQWlCO0FBQ2hDa0IsS0FBRyxFQUFFO0FBQ0hDLFFBQUksRUFBRUMsTUFESDtBQUVIQyxTQUFLLEVBQUVyQixZQUFZLENBQUNzQixLQUFiLENBQW1CQztBQUZ2QixHQUQyQjtBQUtoQ3NDLE9BQUssRUFBRTtBQUNMMUMsUUFBSSxFQUFFQyxNQUREO0FBRUxNLFNBQUssRUFBRSxJQUZGO0FBR0xELGNBQVUsRUFBRTtBQUhQLEdBTHlCO0FBVWhDaEIsV0FBUyxFQUFFO0FBQ1RVLFFBQUksRUFBRVQsSUFERztBQUVUZSxjQUFVLEVBQUU7QUFGSDtBQVZxQixDQUFqQixDQUFqQjtBQWdCQXlELE9BQU8sQ0FBQy9DLFlBQVIsQ0FBcUIrQyxPQUFPLENBQUNqRSxNQUE3QixFLENBRUE7QUFDQTtBQUNBOztBQUNBaUUsT0FBTyxDQUFDN0csWUFBUixHQUF1QjtBQUNyQndGLE9BQUssRUFBRSxDQURjO0FBRXJCcEQsV0FBUyxFQUFFO0FBRlUsQ0FBdkIsQzs7Ozs7Ozs7Ozs7QUNsREEsSUFBSWxELE1BQUo7QUFBV0MsTUFBTSxDQUFDQyxJQUFQLENBQVksZUFBWixFQUE0QjtBQUFDRixRQUFNLENBQUNHLENBQUQsRUFBRztBQUFDSCxVQUFNLEdBQUNHLENBQVA7QUFBUzs7QUFBcEIsQ0FBNUIsRUFBa0QsQ0FBbEQ7QUFBcUQsSUFBSW9ILElBQUo7QUFBU3RILE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGNBQVosRUFBMkI7QUFBQ3FILE1BQUksQ0FBQ3BILENBQUQsRUFBRztBQUFDb0gsUUFBSSxHQUFDcEgsQ0FBTDtBQUFPOztBQUFoQixDQUEzQixFQUE2QyxDQUE3QztBQUd6RUgsTUFBTSxDQUFDTSxPQUFQLENBQWUsU0FBZixFQUEwQixTQUFTd0gsT0FBVCxHQUFtQjtBQUMzQyxTQUFPUCxJQUFJLENBQUM1RyxJQUFMLENBQVUsRUFBVixDQUFQO0FBQ0QsQ0FGRCxFOzs7Ozs7Ozs7OztBQ0hBLElBQUlYLE1BQUo7QUFBV0MsTUFBTSxDQUFDQyxJQUFQLENBQVksZUFBWixFQUE0QjtBQUFDRixRQUFNLENBQUNHLENBQUQsRUFBRztBQUFDSCxVQUFNLEdBQUNHLENBQVA7QUFBUzs7QUFBcEIsQ0FBNUIsRUFBa0QsQ0FBbEQ7QUFBcUQsSUFBSXNDLFlBQUo7QUFBaUJ4QyxNQUFNLENBQUNDLElBQVAsQ0FBWSxjQUFaLEVBQTJCO0FBQUNtQixTQUFPLENBQUNsQixDQUFELEVBQUc7QUFBQ3NDLGdCQUFZLEdBQUN0QyxDQUFiO0FBQWU7O0FBQTNCLENBQTNCLEVBQXdELENBQXhEO0FBQTJELElBQUk0SCxrQkFBSjtBQUF1QjlILE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGdEQUFaLEVBQTZEO0FBQUM2SCxvQkFBa0IsQ0FBQzVILENBQUQsRUFBRztBQUFDNEgsc0JBQWtCLEdBQUM1SCxDQUFuQjtBQUFxQjs7QUFBNUMsQ0FBN0QsRUFBMkcsQ0FBM0c7QUFBOEcsSUFBSTZILE9BQUo7QUFBWS9ILE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLDJDQUFaLEVBQXdEO0FBQUM4SCxTQUFPLENBQUM3SCxDQUFELEVBQUc7QUFBQzZILFdBQU8sR0FBQzdILENBQVI7QUFBVTs7QUFBdEIsQ0FBeEQsRUFBZ0YsQ0FBaEY7QUFBbUYsSUFBSUUsTUFBSjtBQUFXSixNQUFNLENBQUNDLElBQVAsQ0FBWSw4QkFBWixFQUEyQztBQUFDRyxRQUFNLENBQUNGLENBQUQsRUFBRztBQUFDRSxVQUFNLEdBQUNGLENBQVA7QUFBUzs7QUFBcEIsQ0FBM0MsRUFBaUUsQ0FBakU7QUFNM1gsTUFBTThILG9CQUFvQixHQUFHLElBQUl4RixZQUFKLENBQWlCO0FBQzVDeUYsUUFBTSxFQUFFO0FBQ050RSxRQUFJLEVBQUVDLE1BREE7QUFFTkksWUFBUSxFQUFFO0FBRkosR0FEb0M7QUFLNUNrRSxNQUFJLEVBQUM7QUFDSHZFLFFBQUksRUFBQ0M7QUFERixHQUx1QztBQVE1Q3VFLFFBQU0sRUFBQztBQUNMeEUsUUFBSSxFQUFFQyxNQUREO0FBRUxDLFNBQUssRUFBRXJCLFlBQVksQ0FBQ3NCLEtBQWIsQ0FBbUJzRSxFQUZyQjtBQUdMcEUsWUFBUSxFQUFDO0FBSEo7QUFScUMsQ0FBakIsQ0FBN0IsQyxDQWVBOztBQUVBLE1BQU1xRSxVQUFVLEdBQUkxRyxJQUFELElBQVU7QUFDM0IsTUFBSTtBQUNGLFVBQU02RixPQUFPLEdBQUc3RixJQUFoQjtBQUNBcUcsd0JBQW9CLENBQUN6RyxRQUFyQixDQUE4QmlHLE9BQTlCO0FBQ0EsUUFBSTFDLFFBQVEsR0FBQyxDQUFDO0FBQUV3RCxZQUFNLEVBQUU7QUFBQyx1QkFBYztBQUFFQyxpQkFBTyxFQUFFLElBQVg7QUFBaUJDLGFBQUcsRUFBRTtBQUF0QjtBQUFmO0FBQVYsS0FBRCxDQUFiOztBQUVBLFFBQUdoQixPQUFPLENBQUNVLElBQVIsSUFBYyxPQUFkLElBQXVCVixPQUFPLENBQUNXLE1BQVIsSUFBZ0JNLFNBQTFDLEVBQW9EO0FBQ2xEM0QsY0FBUSxDQUFDQyxJQUFULENBQWM7QUFBRUMsZUFBTyxFQUFDO0FBQ3RCQyxlQUFLLEVBQUU7QUFDTEMsY0FBRSxFQUFFO0FBQUVDLGtCQUFJLEVBQUUsQ0FBRSxVQUFGLEVBQWNxQyxPQUFPLENBQUNXLE1BQXRCO0FBQVIsYUFEQztBQUVML0MsZ0JBQUksRUFBRSxTQUZEO0FBR0xDLGdCQUFJLEVBQUU7QUFIRDtBQURlO0FBQVYsT0FBZDtBQUtEOztBQUNEUCxZQUFRLENBQUM0RCxNQUFULENBQWdCLENBQ1o7QUFBRXBELGFBQU8sRUFBRTtBQUFFQyxZQUFJLEVBQUUsWUFBUjtBQUFzQkMsa0JBQVUsRUFBRSxXQUFsQztBQUErQ0Msb0JBQVksRUFBRSxLQUE3RDtBQUFvRUMsVUFBRSxFQUFFO0FBQXhFO0FBQVgsS0FEWSxFQUVaO0FBQUVKLGFBQU8sRUFBRTtBQUFFQyxZQUFJLEVBQUUsU0FBUjtBQUFtQkMsa0JBQVUsRUFBRSxRQUEvQjtBQUF5Q0Msb0JBQVksRUFBRSxLQUF2RDtBQUE4REMsVUFBRSxFQUFFO0FBQWxFO0FBQVgsS0FGWSxFQUdaO0FBQUVDLGFBQU8sRUFBRTtBQUFYLEtBSFksRUFJWjtBQUFFQSxhQUFPLEVBQUU7QUFBWCxLQUpZLEVBS1o7QUFBRUMsY0FBUSxFQUFFO0FBQUMsZUFBTSxDQUFQO0FBQVMscUJBQVksQ0FBckI7QUFBd0IsdUJBQWMsQ0FBdEM7QUFBd0Msa0JBQVMsQ0FBakQ7QUFBb0QsNkJBQW9CLENBQXhFO0FBQTBFLGdDQUF1QjtBQUFqRztBQUFaLEtBTFksQ0FBaEIsRUFaRSxDQW1CRjs7QUFFQSxRQUFJK0MsTUFBTSxHQUFJdkksTUFBTSxDQUFDeUYsU0FBUCxDQUFpQmYsUUFBakIsQ0FBZDtBQUNBLFFBQUk4RCxhQUFKOztBQUNBLFFBQUk7QUFDQUEsbUJBQWEsR0FBR0QsTUFBaEI7QUFDQVosYUFBTyxDQUFDLGdCQUFELEVBQWtCRCxrQkFBbEIsRUFBcUNlLElBQUksQ0FBQ0MsU0FBTCxDQUFlRixhQUFmLENBQXJDLENBQVA7QUFDRixhQUFPQSxhQUFQO0FBRUQsS0FMRCxDQUtFLE9BQU1oSCxLQUFOLEVBQWE7QUFDYixZQUFNLGlDQUErQkEsS0FBckM7QUFDRDtBQUVGLEdBaENELENBZ0NFLE9BQU9tSCxTQUFQLEVBQWtCO0FBQ2xCLFVBQU0sSUFBSWhKLE1BQU0sQ0FBQzhCLEtBQVgsQ0FBaUIsMkJBQWpCLEVBQThDa0gsU0FBOUMsQ0FBTjtBQUNEO0FBQ0YsQ0FwQ0Q7O0FBdkJBL0ksTUFBTSxDQUFDZ0osYUFBUCxDQTZEZVgsVUE3RGYsRTs7Ozs7Ozs7Ozs7QUNBQSxJQUFJdEksTUFBSjtBQUFXQyxNQUFNLENBQUNDLElBQVAsQ0FBWSxlQUFaLEVBQTRCO0FBQUNGLFFBQU0sQ0FBQ0csQ0FBRCxFQUFHO0FBQUNILFVBQU0sR0FBQ0csQ0FBUDtBQUFTOztBQUFwQixDQUE1QixFQUFrRCxDQUFsRDtBQUFxRCxJQUFJc0MsWUFBSjtBQUFpQnhDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGNBQVosRUFBMkI7QUFBQ21CLFNBQU8sQ0FBQ2xCLENBQUQsRUFBRztBQUFDc0MsZ0JBQVksR0FBQ3RDLENBQWI7QUFBZTs7QUFBM0IsQ0FBM0IsRUFBd0QsQ0FBeEQ7QUFBMkQsSUFBSStJLGVBQUosRUFBb0JDLHNCQUFwQixFQUEyQ0MsUUFBM0MsRUFBb0RDLE9BQXBEO0FBQTREcEosTUFBTSxDQUFDQyxJQUFQLENBQVkscUNBQVosRUFBa0Q7QUFBQ2dKLGlCQUFlLENBQUMvSSxDQUFELEVBQUc7QUFBQytJLG1CQUFlLEdBQUMvSSxDQUFoQjtBQUFrQixHQUF0Qzs7QUFBdUNnSix3QkFBc0IsQ0FBQ2hKLENBQUQsRUFBRztBQUFDZ0osMEJBQXNCLEdBQUNoSixDQUF2QjtBQUF5QixHQUExRjs7QUFBMkZpSixVQUFRLENBQUNqSixDQUFELEVBQUc7QUFBQ2lKLFlBQVEsR0FBQ2pKLENBQVQ7QUFBVyxHQUFsSDs7QUFBbUhrSixTQUFPLENBQUNsSixDQUFELEVBQUc7QUFBQ2tKLFdBQU8sR0FBQ2xKLENBQVI7QUFBVTs7QUFBeEksQ0FBbEQsRUFBNEwsQ0FBNUw7QUFBK0wsSUFBSW1KLE1BQUo7QUFBV3JKLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLCtDQUFaLEVBQTREO0FBQUNvSixRQUFNLENBQUNuSixDQUFELEVBQUc7QUFBQ21KLFVBQU0sR0FBQ25KLENBQVA7QUFBUzs7QUFBcEIsQ0FBNUQsRUFBa0YsQ0FBbEY7QUFBcUYsSUFBSW9KLGNBQUosRUFBbUJDLGVBQW5CO0FBQW1DdkosTUFBTSxDQUFDQyxJQUFQLENBQVksbURBQVosRUFBZ0U7QUFBQ3FKLGdCQUFjLENBQUNwSixDQUFELEVBQUc7QUFBQ29KLGtCQUFjLEdBQUNwSixDQUFmO0FBQWlCLEdBQXBDOztBQUFxQ3FKLGlCQUFlLENBQUNySixDQUFELEVBQUc7QUFBQ3FKLG1CQUFlLEdBQUNySixDQUFoQjtBQUFrQjs7QUFBMUUsQ0FBaEUsRUFBNEksQ0FBNUk7QUFBK0ksSUFBSXNKLFVBQUo7QUFBZXhKLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGdDQUFaLEVBQTZDO0FBQUN1SixZQUFVLENBQUN0SixDQUFELEVBQUc7QUFBQ3NKLGNBQVUsR0FBQ3RKLENBQVg7QUFBYTs7QUFBNUIsQ0FBN0MsRUFBMkUsQ0FBM0U7QUFBOEUsSUFBSXVKLFdBQUo7QUFBZ0J6SixNQUFNLENBQUNDLElBQVAsQ0FBWSxvQ0FBWixFQUFpRDtBQUFDd0osYUFBVyxDQUFDdkosQ0FBRCxFQUFHO0FBQUN1SixlQUFXLEdBQUN2SixDQUFaO0FBQWM7O0FBQTlCLENBQWpELEVBQWlGLENBQWpGO0FBQW9GLElBQUlFLE1BQUo7QUFBV0osTUFBTSxDQUFDQyxJQUFQLENBQVksNENBQVosRUFBeUQ7QUFBQ0csUUFBTSxDQUFDRixDQUFELEVBQUc7QUFBQ0UsVUFBTSxHQUFDRixDQUFQO0FBQVM7O0FBQXBCLENBQXpELEVBQStFLENBQS9FO0FBQWtGLElBQUl3SixhQUFKO0FBQWtCMUosTUFBTSxDQUFDQyxJQUFQLENBQVksNkJBQVosRUFBMEM7QUFBQ21CLFNBQU8sQ0FBQ2xCLENBQUQsRUFBRztBQUFDd0osaUJBQWEsR0FBQ3hKLENBQWQ7QUFBZ0I7O0FBQTVCLENBQTFDLEVBQXdFLENBQXhFO0FBQTJFLElBQUl5SixnQkFBSjtBQUFxQjNKLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGtDQUFaLEVBQStDO0FBQUNtQixTQUFPLENBQUNsQixDQUFELEVBQUc7QUFBQ3lKLG9CQUFnQixHQUFDekosQ0FBakI7QUFBbUI7O0FBQS9CLENBQS9DLEVBQWdGLENBQWhGO0FBQW1GLElBQUkwSixlQUFKO0FBQW9CNUosTUFBTSxDQUFDQyxJQUFQLENBQVksZ0NBQVosRUFBNkM7QUFBQ21CLFNBQU8sQ0FBQ2xCLENBQUQsRUFBRztBQUFDMEosbUJBQWUsR0FBQzFKLENBQWhCO0FBQWtCOztBQUE5QixDQUE3QyxFQUE2RSxFQUE3RTtBQUFpRixJQUFJaUIsUUFBSjtBQUFhbkIsTUFBTSxDQUFDQyxJQUFQLENBQVksbUJBQVosRUFBZ0M7QUFBQ21CLFNBQU8sQ0FBQ2xCLENBQUQsRUFBRztBQUFDaUIsWUFBUSxHQUFDakIsQ0FBVDtBQUFXOztBQUF2QixDQUFoQyxFQUF5RCxFQUF6RDtBQUE2RCxJQUFJMkosY0FBSjtBQUFtQjdKLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLDBCQUFaLEVBQXVDO0FBQUNtQixTQUFPLENBQUNsQixDQUFELEVBQUc7QUFBQzJKLGtCQUFjLEdBQUMzSixDQUFmO0FBQWlCOztBQUE3QixDQUF2QyxFQUFzRSxFQUF0RTtBQUEwRSxJQUFJNEosVUFBSixFQUFlQyxRQUFmO0FBQXdCL0osTUFBTSxDQUFDQyxJQUFQLENBQVksMkNBQVosRUFBd0Q7QUFBQzZKLFlBQVUsQ0FBQzVKLENBQUQsRUFBRztBQUFDNEosY0FBVSxHQUFDNUosQ0FBWDtBQUFhLEdBQTVCOztBQUE2QjZKLFVBQVEsQ0FBQzdKLENBQUQsRUFBRztBQUFDNkosWUFBUSxHQUFDN0osQ0FBVDtBQUFXOztBQUFwRCxDQUF4RCxFQUE4RyxFQUE5RztBQWVoNkMsTUFBTThKLHNCQUFzQixHQUFHLElBQUl4SCxZQUFKLENBQWlCO0FBQzlDbEIsTUFBSSxFQUFFO0FBQ0pxQyxRQUFJLEVBQUVDO0FBREYsR0FEd0M7QUFJOUNxRyxRQUFNLEVBQUU7QUFDTnRHLFFBQUksRUFBRUM7QUFEQTtBQUpzQyxDQUFqQixDQUEvQjs7QUFVQSxNQUFNc0csZ0JBQWdCLEdBQUl2SSxJQUFELElBQVU7QUFDakMsTUFBSTtBQUNGLFVBQU02RixPQUFPLEdBQUc3RixJQUFoQjtBQUNBcUksMEJBQXNCLENBQUN6SSxRQUF2QixDQUFnQ2lHLE9BQWhDO0FBQ0EsVUFBTTJDLEdBQUcsR0FBRzNDLE9BQU8sQ0FBQ3lDLE1BQVIsR0FBZWQsUUFBZixHQUF3QkMsT0FBeEIsR0FBZ0MsR0FBaEMsR0FBb0NILGVBQWhEO0FBQ0EsVUFBTW1CLFNBQVMsR0FBR1gsV0FBVyxDQUFDSCxjQUFELEVBQWlCQyxlQUFqQixFQUFrQy9CLE9BQU8sQ0FBQ2xHLElBQTFDLENBQTdCO0FBQ0EsVUFBTStJLEtBQUssR0FBRyxhQUFXQyxrQkFBa0IsQ0FBQzlDLE9BQU8sQ0FBQ2xHLElBQVQsQ0FBN0IsR0FBNEMsYUFBNUMsR0FBMERnSixrQkFBa0IsQ0FBQ0YsU0FBRCxDQUExRjtBQUNBTixjQUFVLENBQUMsb0NBQWtDSyxHQUFsQyxHQUFzQyxTQUF2QyxFQUFrREUsS0FBbEQsQ0FBVjtBQUVBOzs7OztBQUlBLFVBQU1FLFFBQVEsR0FBR2YsVUFBVSxDQUFDVyxHQUFELEVBQU1FLEtBQU4sQ0FBM0I7QUFDQSxRQUFHRSxRQUFRLEtBQUs5QixTQUFiLElBQTBCOEIsUUFBUSxDQUFDNUksSUFBVCxLQUFrQjhHLFNBQS9DLEVBQTBELE1BQU0sY0FBTjtBQUMxRCxVQUFNK0IsWUFBWSxHQUFHRCxRQUFRLENBQUM1SSxJQUE5QjtBQUNBbUksY0FBVSxDQUFDLHlEQUFELEVBQTJEUyxRQUFRLENBQUM1SSxJQUFULENBQWNzRyxNQUF6RSxDQUFWOztBQUVBLFFBQUd1QyxZQUFZLENBQUN2QyxNQUFiLEtBQXdCLFNBQTNCLEVBQXNDO0FBQ3BDLFVBQUd1QyxZQUFZLENBQUM1SSxLQUFiLEtBQXVCNkcsU0FBMUIsRUFBcUMsTUFBTSxjQUFOOztBQUNyQyxVQUFHK0IsWUFBWSxDQUFDNUksS0FBYixDQUFtQjZJLFFBQW5CLENBQTRCLGtCQUE1QixDQUFILEVBQW9EO0FBQ2xEO0FBQ0VWLGdCQUFRLENBQUMsK0JBQUQsRUFBaUNTLFlBQVksQ0FBQzVJLEtBQTlDLENBQVI7QUFDRjtBQUNEOztBQUNELFlBQU00SSxZQUFZLENBQUM1SSxLQUFuQjtBQUNEOztBQUNEa0ksY0FBVSxDQUFDLHdCQUFELENBQVY7QUFFQSxVQUFNWSxPQUFPLEdBQUd2SixRQUFRLENBQUM7QUFBQ0csVUFBSSxFQUFFa0csT0FBTyxDQUFDbEc7QUFBZixLQUFELENBQXhCO0FBQ0EsVUFBTVMsS0FBSyxHQUFHM0IsTUFBTSxDQUFDdUssT0FBUCxDQUFlO0FBQUNqSCxTQUFHLEVBQUVnSDtBQUFOLEtBQWYsQ0FBZDtBQUNBWixjQUFVLENBQUMsZUFBRCxFQUFpQi9ILEtBQWpCLENBQVY7QUFDQSxRQUFHQSxLQUFLLENBQUMyQyxpQkFBTixLQUE0QitELFNBQS9CLEVBQTBDO0FBRTFDLFVBQU1tQyxLQUFLLEdBQUdqQixnQkFBZ0IsQ0FBQztBQUFDdkIsUUFBRSxFQUFFckcsS0FBSyxDQUFDMkI7QUFBWCxLQUFELENBQTlCO0FBQ0FvRyxjQUFVLENBQUMsOEJBQUQsRUFBZ0NjLEtBQWhDLENBQVY7QUFDQSxVQUFNQyxnQkFBZ0IsR0FBR2pCLGVBQWUsQ0FBQztBQUFDeEIsUUFBRSxFQUFFckcsS0FBSyxDQUFDMkIsR0FBWDtBQUFnQmtILFdBQUssRUFBRUEsS0FBdkI7QUFBOEJFLGNBQVEsRUFBRU4sWUFBWSxDQUFDN0ksSUFBYixDQUFrQm1KO0FBQTFELEtBQUQsQ0FBeEM7QUFDQWhCLGNBQVUsQ0FBQyw2QkFBRCxFQUErQmUsZ0JBQS9CLENBQVY7QUFDQSxVQUFNRSxlQUFlLEdBQUcxQixNQUFNLEtBQUdGLFFBQVQsR0FBa0JDLE9BQWxCLEdBQTBCLEdBQTFCLEdBQThCRixzQkFBOUIsR0FBcUQsR0FBckQsR0FBeURvQixrQkFBa0IsQ0FBQ08sZ0JBQUQsQ0FBbkc7QUFDQWYsY0FBVSxDQUFDLHFCQUFtQmlCLGVBQXBCLENBQVY7QUFFQSxVQUFNQyxRQUFRLEdBQUd0QixhQUFhLENBQUM7QUFBQ3NCLGNBQVEsRUFBRVIsWUFBWSxDQUFDN0ksSUFBYixDQUFrQnNKLE9BQTdCO0FBQXNDdEosVUFBSSxFQUFFO0FBQ3pFdUosd0JBQWdCLEVBQUVIO0FBRHVEO0FBQTVDLEtBQUQsQ0FBOUIsQ0F4Q0UsQ0E0Q0Y7O0FBRUFqQixjQUFVLENBQUMsd0RBQUQsQ0FBVjtBQUNBRCxrQkFBYyxDQUFDO0FBQ2JzQixRQUFFLEVBQUVYLFlBQVksQ0FBQzdJLElBQWIsQ0FBa0JvQixTQURUO0FBRWJxSSxhQUFPLEVBQUVaLFlBQVksQ0FBQzdJLElBQWIsQ0FBa0J5SixPQUZkO0FBR2JDLGFBQU8sRUFBRUwsUUFISTtBQUliTSxnQkFBVSxFQUFFZCxZQUFZLENBQUM3SSxJQUFiLENBQWtCMko7QUFKakIsS0FBRCxDQUFkO0FBTUQsR0FyREQsQ0FxREUsT0FBT3ZDLFNBQVAsRUFBa0I7QUFDbEIsVUFBTSxJQUFJaEosTUFBTSxDQUFDOEIsS0FBWCxDQUFpQixrQ0FBakIsRUFBcURrSCxTQUFyRCxDQUFOO0FBQ0Q7QUFDRixDQXpERDs7QUF6QkEvSSxNQUFNLENBQUNnSixhQUFQLENBb0Zla0IsZ0JBcEZmLEU7Ozs7Ozs7Ozs7O0FDQUEsSUFBSW5LLE1BQUo7QUFBV0MsTUFBTSxDQUFDQyxJQUFQLENBQVksZUFBWixFQUE0QjtBQUFDRixRQUFNLENBQUNHLENBQUQsRUFBRztBQUFDSCxVQUFNLEdBQUNHLENBQVA7QUFBUzs7QUFBcEIsQ0FBNUIsRUFBa0QsQ0FBbEQ7QUFBcUQsSUFBSXNDLFlBQUo7QUFBaUJ4QyxNQUFNLENBQUNDLElBQVAsQ0FBWSxjQUFaLEVBQTJCO0FBQUNtQixTQUFPLENBQUNsQixDQUFELEVBQUc7QUFBQ3NDLGdCQUFZLEdBQUN0QyxDQUFiO0FBQWU7O0FBQTNCLENBQTNCLEVBQXdELENBQXhEO0FBQTJELElBQUlFLE1BQUo7QUFBV0osTUFBTSxDQUFDQyxJQUFQLENBQVksaUNBQVosRUFBOEM7QUFBQ0csUUFBTSxDQUFDRixDQUFELEVBQUc7QUFBQ0UsVUFBTSxHQUFDRixDQUFQO0FBQVM7O0FBQXBCLENBQTlDLEVBQW9FLENBQXBFO0FBQXVFLElBQUkwRSxVQUFKO0FBQWU1RSxNQUFNLENBQUNDLElBQVAsQ0FBWSx1Q0FBWixFQUFvRDtBQUFDMkUsWUFBVSxDQUFDMUUsQ0FBRCxFQUFHO0FBQUMwRSxjQUFVLEdBQUMxRSxDQUFYO0FBQWE7O0FBQTVCLENBQXBELEVBQWtGLENBQWxGO0FBQXFGLElBQUlxTCxnQkFBSjtBQUFxQnZMLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLCtCQUFaLEVBQTRDO0FBQUNtQixTQUFPLENBQUNsQixDQUFELEVBQUc7QUFBQ3FMLG9CQUFnQixHQUFDckwsQ0FBakI7QUFBbUI7O0FBQS9CLENBQTVDLEVBQTZFLENBQTdFO0FBQWdGLElBQUlzTCxXQUFKO0FBQWdCeEwsTUFBTSxDQUFDQyxJQUFQLENBQVksMEJBQVosRUFBdUM7QUFBQ21CLFNBQU8sQ0FBQ2xCLENBQUQsRUFBRztBQUFDc0wsZUFBVyxHQUFDdEwsQ0FBWjtBQUFjOztBQUExQixDQUF2QyxFQUFtRSxDQUFuRTtBQUFzRSxJQUFJdUwsZUFBSjtBQUFvQnpMLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGlDQUFaLEVBQThDO0FBQUNtQixTQUFPLENBQUNsQixDQUFELEVBQUc7QUFBQ3VMLG1CQUFlLEdBQUN2TCxDQUFoQjtBQUFrQjs7QUFBOUIsQ0FBOUMsRUFBOEUsQ0FBOUU7QUFBaUYsSUFBSXNKLFVBQUo7QUFBZXhKLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGdDQUFaLEVBQTZDO0FBQUN1SixZQUFVLENBQUN0SixDQUFELEVBQUc7QUFBQ3NKLGNBQVUsR0FBQ3RKLENBQVg7QUFBYTs7QUFBNUIsQ0FBN0MsRUFBMkUsQ0FBM0U7QUFBOEUsSUFBSTRILGtCQUFKO0FBQXVCOUgsTUFBTSxDQUFDQyxJQUFQLENBQVksZ0RBQVosRUFBNkQ7QUFBQzZILG9CQUFrQixDQUFDNUgsQ0FBRCxFQUFHO0FBQUM0SCxzQkFBa0IsR0FBQzVILENBQW5CO0FBQXFCOztBQUE1QyxDQUE3RCxFQUEyRyxDQUEzRztBQUE4RyxJQUFJNkgsT0FBSjtBQUFZL0gsTUFBTSxDQUFDQyxJQUFQLENBQVksMkNBQVosRUFBd0Q7QUFBQzhILFNBQU8sQ0FBQzdILENBQUQsRUFBRztBQUFDNkgsV0FBTyxHQUFDN0gsQ0FBUjtBQUFVOztBQUF0QixDQUF4RCxFQUFnRixDQUFoRjtBQUFtRixJQUFJd0wsUUFBSjtBQUFhMUwsTUFBTSxDQUFDQyxJQUFQLENBQVksc0JBQVosRUFBbUM7QUFBQ3lMLFVBQVEsQ0FBQ3hMLENBQUQsRUFBRztBQUFDd0wsWUFBUSxHQUFDeEwsQ0FBVDtBQUFXOztBQUF4QixDQUFuQyxFQUE2RCxFQUE3RDtBQVloN0IsTUFBTXlMLG9CQUFvQixHQUFHLElBQUluSixZQUFKLENBQWlCO0FBQzVDb0osU0FBTyxFQUFFO0FBQ1BqSSxRQUFJLEVBQUVDO0FBREMsR0FEbUM7QUFJNUN3RyxXQUFTLEVBQUU7QUFDVHpHLFFBQUksRUFBRUM7QUFERztBQUppQyxDQUFqQixDQUE3QjtBQVNBLE1BQU1pSSxpQkFBaUIsR0FBRyxJQUFJckosWUFBSixDQUFpQjtBQUN6QzRJLFNBQU8sRUFBRTtBQUNQekgsUUFBSSxFQUFFQyxNQURDO0FBRVBJLFlBQVEsRUFBQztBQUZGLEdBRGdDO0FBS3pDOEcsVUFBUSxFQUFFO0FBQ1JuSCxRQUFJLEVBQUVDLE1BREU7QUFFUkMsU0FBSyxFQUFFLDJEQUZDO0FBR1JHLFlBQVEsRUFBQztBQUhELEdBTCtCO0FBVXpDc0gsWUFBVSxFQUFFO0FBQ1YzSCxRQUFJLEVBQUVDLE1BREk7QUFFVkMsU0FBSyxFQUFFckIsWUFBWSxDQUFDc0IsS0FBYixDQUFtQmdJLEtBRmhCO0FBR1Y5SCxZQUFRLEVBQUM7QUFIQyxHQVY2QjtBQWV6QytILGFBQVcsRUFBRTtBQUNYcEksUUFBSSxFQUFFQyxNQURLO0FBRVhDLFNBQUssRUFBRSwyREFGSTtBQUdYRyxZQUFRLEVBQUM7QUFIRTtBQWY0QixDQUFqQixDQUExQjs7QUFzQkEsTUFBTWdJLGNBQWMsR0FBSXJLLElBQUQsSUFBVTtBQUMvQixNQUFJO0FBQ0YsVUFBTTZGLE9BQU8sR0FBRzdGLElBQWhCO0FBQ0FnSyx3QkFBb0IsQ0FBQ3BLLFFBQXJCLENBQThCaUcsT0FBOUI7QUFDQSxVQUFNekYsS0FBSyxHQUFHM0IsTUFBTSxDQUFDdUssT0FBUCxDQUFlO0FBQUN2RyxZQUFNLEVBQUVvRCxPQUFPLENBQUNvRTtBQUFqQixLQUFmLENBQWQ7QUFDQSxRQUFHN0osS0FBSyxLQUFLMEcsU0FBYixFQUF3QixNQUFNLDBCQUF3QmpCLE9BQU8sQ0FBQ29FLE9BQWhDLEdBQXdDLFlBQTlDO0FBQ3hCN0QsV0FBTyxDQUFDLGNBQUQsRUFBZ0JoRyxLQUFoQixDQUFQO0FBRUEsVUFBTWdCLFNBQVMsR0FBRzZCLFVBQVUsQ0FBQytGLE9BQVgsQ0FBbUI7QUFBQ2pILFNBQUcsRUFBRTNCLEtBQUssQ0FBQ2dCO0FBQVosS0FBbkIsQ0FBbEI7QUFDQSxRQUFHQSxTQUFTLEtBQUswRixTQUFqQixFQUE0QixNQUFNLHFCQUFOO0FBQzVCVixXQUFPLENBQUMsaUJBQUQsRUFBb0JoRixTQUFwQixDQUFQO0FBRUEsVUFBTWtKLEtBQUssR0FBR2xKLFNBQVMsQ0FBQ3NELEtBQVYsQ0FBZ0I2RixLQUFoQixDQUFzQixHQUF0QixDQUFkO0FBQ0EsVUFBTWpDLE1BQU0sR0FBR2dDLEtBQUssQ0FBQ0EsS0FBSyxDQUFDRSxNQUFOLEdBQWEsQ0FBZCxDQUFwQjtBQUVBLFFBQUkzRixTQUFTLEdBQUdnRixXQUFXLENBQUM7QUFBRXZCLFlBQU0sRUFBRUE7QUFBVixLQUFELENBQTNCOztBQUVBLFFBQUcsQ0FBQ3pELFNBQUosRUFBYztBQUNaLFlBQU00RixRQUFRLEdBQUdiLGdCQUFnQixDQUFDO0FBQUN0QixjQUFNLEVBQUV6QyxPQUFPLENBQUN5QztBQUFqQixPQUFELENBQWpDO0FBQ0FsQyxhQUFPLENBQUMsbUVBQUQsRUFBc0U7QUFBRXFFLGdCQUFRLEVBQUVBO0FBQVosT0FBdEUsQ0FBUDtBQUNBNUYsZUFBUyxHQUFHZ0YsV0FBVyxDQUFDO0FBQUV2QixjQUFNLEVBQUVtQztBQUFWLE9BQUQsQ0FBdkIsQ0FIWSxDQUdrQztBQUMvQzs7QUFFRHJFLFdBQU8sQ0FBQyxvREFBRCxFQUF1RCxNQUFJa0UsS0FBSixHQUFVLEdBQVYsR0FBY2hDLE1BQWQsR0FBcUIsR0FBckIsR0FBeUJ6RCxTQUF6QixHQUFtQyxHQUExRixDQUFQLENBdEJFLENBd0JGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQXVCLFdBQU8sQ0FBQyx3QkFBRCxDQUFQOztBQUNBLFFBQUcsQ0FBQzBELGVBQWUsQ0FBQztBQUFDakYsZUFBUyxFQUFFQSxTQUFaO0FBQXVCN0UsVUFBSSxFQUFFNkYsT0FBTyxDQUFDb0UsT0FBckM7QUFBOEN4QixlQUFTLEVBQUU1QyxPQUFPLENBQUM0QztBQUFqRSxLQUFELENBQW5CLEVBQWtHO0FBQ2hHLFlBQU0scUNBQU47QUFDRDs7QUFFRHJDLFdBQU8sQ0FBQyxvQkFBRCxDQUFQLENBbkNFLENBcUNGOztBQUNBLFFBQUlzRSxXQUFKOztBQUNBLFFBQUk7QUFFRkEsaUJBQVcsR0FBRzdDLFVBQVUsQ0FBQzFCLGtCQUFELEVBQXFCLEVBQXJCLENBQVYsQ0FBbUNuRyxJQUFqRDtBQUNBLFVBQUkySyxpQkFBaUIsR0FBRztBQUN0QixxQkFBYXZKLFNBQVMsQ0FBQ3NELEtBREQ7QUFFdEIsbUJBQVdnRyxXQUFXLENBQUMxSyxJQUFaLENBQWlCc0osT0FGTjtBQUd0QixvQkFBWW9CLFdBQVcsQ0FBQzFLLElBQVosQ0FBaUJtSixRQUhQO0FBSXRCLG1CQUFXdUIsV0FBVyxDQUFDMUssSUFBWixDQUFpQnlKLE9BSk47QUFLdEIsc0JBQWNpQixXQUFXLENBQUMxSyxJQUFaLENBQWlCMko7QUFMVCxPQUF4QjtBQVFGLFVBQUlpQixVQUFVLEdBQUdELGlCQUFqQjs7QUFFQSxVQUFHO0FBQ0QsWUFBSUUsS0FBSyxHQUFHZCxRQUFRLENBQUNlLEtBQVQsQ0FBZTlCLE9BQWYsQ0FBdUI7QUFBQ2pILGFBQUcsRUFBRTNCLEtBQUssQ0FBQ3BCO0FBQVosU0FBdkIsQ0FBWjtBQUNBLFlBQUkrTCxZQUFZLEdBQUdGLEtBQUssQ0FBQ0csT0FBTixDQUFjRCxZQUFqQztBQUNBYix5QkFBaUIsQ0FBQ3RLLFFBQWxCLENBQTJCbUwsWUFBM0I7QUFFQUgsa0JBQVUsQ0FBQyxVQUFELENBQVYsR0FBeUJHLFlBQVksQ0FBQyxVQUFELENBQVosSUFBNEJKLGlCQUFpQixDQUFDLFVBQUQsQ0FBdEU7QUFDQUMsa0JBQVUsQ0FBQyxTQUFELENBQVYsR0FBd0JHLFlBQVksQ0FBQyxTQUFELENBQVosSUFBMkJKLGlCQUFpQixDQUFDLFNBQUQsQ0FBcEU7QUFDQUMsa0JBQVUsQ0FBQyxZQUFELENBQVYsR0FBMkJHLFlBQVksQ0FBQyxZQUFELENBQVosSUFBOEJKLGlCQUFpQixDQUFDLFlBQUQsQ0FBMUU7QUFDQUMsa0JBQVUsQ0FBQyxTQUFELENBQVYsR0FBd0JHLFlBQVksQ0FBQyxhQUFELENBQVosR0FBK0JsRCxVQUFVLENBQUNrRCxZQUFZLENBQUMsYUFBRCxDQUFiLEVBQThCLEVBQTlCLENBQVYsQ0FBNEN6QixPQUE1QyxJQUF1RHFCLGlCQUFpQixDQUFDLFNBQUQsQ0FBdkcsR0FBc0hBLGlCQUFpQixDQUFDLFNBQUQsQ0FBL0o7QUFFRCxPQVZELENBV0EsT0FBTTFLLEtBQU4sRUFBYTtBQUNYMkssa0JBQVUsR0FBQ0QsaUJBQVg7QUFDRDs7QUFFQ3ZFLGFBQU8sQ0FBQyxzQkFBRCxFQUF5QkQsa0JBQXpCLEVBQTZDeUUsVUFBN0MsQ0FBUDtBQUVBLGFBQU9BLFVBQVA7QUFFRCxLQWhDRCxDQWdDRSxPQUFNM0ssS0FBTixFQUFhO0FBQ2IsWUFBTSx3Q0FBc0NBLEtBQTVDO0FBQ0Q7QUFFRixHQTNFRCxDQTJFRSxPQUFNbUgsU0FBTixFQUFpQjtBQUNqQixVQUFNLElBQUloSixNQUFNLENBQUM4QixLQUFYLENBQWlCLGdDQUFqQixFQUFtRGtILFNBQW5ELENBQU47QUFDRDtBQUNGLENBL0VEOztBQTNDQS9JLE1BQU0sQ0FBQ2dKLGFBQVAsQ0E0SGVnRCxjQTVIZixFOzs7Ozs7Ozs7OztBQ0FBLElBQUlqTSxNQUFKO0FBQVdDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGVBQVosRUFBNEI7QUFBQ0YsUUFBTSxDQUFDRyxDQUFELEVBQUc7QUFBQ0gsVUFBTSxHQUFDRyxDQUFQO0FBQVM7O0FBQXBCLENBQTVCLEVBQWtELENBQWxEO0FBQXFELElBQUlzQyxZQUFKO0FBQWlCeEMsTUFBTSxDQUFDQyxJQUFQLENBQVksY0FBWixFQUEyQjtBQUFDbUIsU0FBTyxDQUFDbEIsQ0FBRCxFQUFHO0FBQUNzQyxnQkFBWSxHQUFDdEMsQ0FBYjtBQUFlOztBQUEzQixDQUEzQixFQUF3RCxDQUF4RDtBQUEyRCxJQUFJME0sVUFBSjtBQUFlNU0sTUFBTSxDQUFDQyxJQUFQLENBQVksK0JBQVosRUFBNEM7QUFBQzJNLFlBQVUsQ0FBQzFNLENBQUQsRUFBRztBQUFDME0sY0FBVSxHQUFDMU0sQ0FBWDtBQUFhOztBQUE1QixDQUE1QyxFQUEwRSxDQUExRTtBQUE2RSxJQUFJMk0saUJBQUo7QUFBc0I3TSxNQUFNLENBQUNDLElBQVAsQ0FBWSw4Q0FBWixFQUEyRDtBQUFDNE0sbUJBQWlCLENBQUMzTSxDQUFELEVBQUc7QUFBQzJNLHFCQUFpQixHQUFDM00sQ0FBbEI7QUFBb0I7O0FBQTFDLENBQTNELEVBQXVHLENBQXZHO0FBQTBHLElBQUk0TSxTQUFKLEVBQWNDLFNBQWQ7QUFBd0IvTSxNQUFNLENBQUNDLElBQVAsQ0FBWSw0Q0FBWixFQUF5RDtBQUFDNk0sV0FBUyxDQUFDNU0sQ0FBRCxFQUFHO0FBQUM0TSxhQUFTLEdBQUM1TSxDQUFWO0FBQVksR0FBMUI7O0FBQTJCNk0sV0FBUyxDQUFDN00sQ0FBRCxFQUFHO0FBQUM2TSxhQUFTLEdBQUM3TSxDQUFWO0FBQVk7O0FBQXBELENBQXpELEVBQStHLENBQS9HO0FBQWtILElBQUk2SCxPQUFKO0FBQVkvSCxNQUFNLENBQUNDLElBQVAsQ0FBWSwyQ0FBWixFQUF3RDtBQUFDOEgsU0FBTyxDQUFDN0gsQ0FBRCxFQUFHO0FBQUM2SCxXQUFPLEdBQUM3SCxDQUFSO0FBQVU7O0FBQXRCLENBQXhELEVBQWdGLENBQWhGO0FBTzlmLE1BQU04TSxVQUFVLEdBQUcscUJBQW5CO0FBQ0EsTUFBTUMsa0JBQWtCLEdBQUcsNkJBQTNCO0FBRUEsTUFBTUMsaUJBQWlCLEdBQUcsSUFBSTFLLFlBQUosQ0FBaUI7QUFDekN5SCxRQUFNLEVBQUU7QUFDTnRHLFFBQUksRUFBRUM7QUFEQTtBQURpQyxDQUFqQixDQUExQjs7QUFPQSxNQUFNNEgsV0FBVyxHQUFJN0osSUFBRCxJQUFVO0FBQzVCLE1BQUk7QUFDRixVQUFNNkYsT0FBTyxHQUFHN0YsSUFBaEI7QUFDQXVMLHFCQUFpQixDQUFDM0wsUUFBbEIsQ0FBMkJpRyxPQUEzQjtBQUVBLFFBQUkyRixhQUFhLEdBQUNILFVBQWxCOztBQUVBLFFBQUdGLFNBQVMsTUFBTUMsU0FBUyxFQUEzQixFQUE4QjtBQUMxQkksbUJBQWEsR0FBR0Ysa0JBQWhCO0FBQ0FsRixhQUFPLENBQUMsbUJBQWlCK0UsU0FBUyxFQUExQixHQUE2QixZQUE3QixHQUEwQ0MsU0FBUyxFQUFuRCxHQUFzRCxnQkFBdkQsRUFBd0VJLGFBQXhFLENBQVA7QUFDSDs7QUFDRCxVQUFNMUYsR0FBRyxHQUFHbUYsVUFBVSxDQUFDTyxhQUFELEVBQWdCM0YsT0FBTyxDQUFDeUMsTUFBeEIsQ0FBdEI7QUFDQWxDLFdBQU8sQ0FBQywrRUFBRCxFQUFpRjtBQUFDcUYsY0FBUSxFQUFDM0YsR0FBVjtBQUFld0MsWUFBTSxFQUFDekMsT0FBTyxDQUFDeUMsTUFBOUI7QUFBc0NvRCxZQUFNLEVBQUNGO0FBQTdDLEtBQWpGLENBQVA7QUFFQSxRQUFHMUYsR0FBRyxLQUFLZ0IsU0FBWCxFQUFzQixPQUFPNkUsV0FBVyxDQUFDOUYsT0FBTyxDQUFDeUMsTUFBVCxDQUFsQjtBQUN0QixXQUFPeEMsR0FBUDtBQUNELEdBZkQsQ0FlRSxPQUFPc0IsU0FBUCxFQUFrQjtBQUNsQixVQUFNLElBQUloSixNQUFNLENBQUM4QixLQUFYLENBQWlCLDJCQUFqQixFQUE4Q2tILFNBQTlDLENBQU47QUFDRDtBQUNGLENBbkJEOztBQXFCQSxNQUFNdUUsV0FBVyxHQUFJckQsTUFBRCxJQUFZO0FBQzlCLE1BQUdBLE1BQU0sS0FBSzRDLGlCQUFkLEVBQWlDLE1BQU0sSUFBSTlNLE1BQU0sQ0FBQzhCLEtBQVgsQ0FBaUIsOEJBQWpCLENBQU47QUFDL0JrRyxTQUFPLENBQUMsbUNBQUQsRUFBcUM4RSxpQkFBckMsQ0FBUDtBQUNGLFNBQU9yQixXQUFXLENBQUM7QUFBQ3ZCLFVBQU0sRUFBRTRDO0FBQVQsR0FBRCxDQUFsQjtBQUNELENBSkQ7O0FBdENBN00sTUFBTSxDQUFDZ0osYUFBUCxDQTRDZXdDLFdBNUNmLEU7Ozs7Ozs7Ozs7O0FDQUEsSUFBSXpMLE1BQUo7QUFBV0MsTUFBTSxDQUFDQyxJQUFQLENBQVksZUFBWixFQUE0QjtBQUFDRixRQUFNLENBQUNHLENBQUQsRUFBRztBQUFDSCxVQUFNLEdBQUNHLENBQVA7QUFBUzs7QUFBcEIsQ0FBNUIsRUFBa0QsQ0FBbEQ7QUFBcUQsSUFBSXNDLFlBQUo7QUFBaUJ4QyxNQUFNLENBQUNDLElBQVAsQ0FBWSxjQUFaLEVBQTJCO0FBQUNtQixTQUFPLENBQUNsQixDQUFELEVBQUc7QUFBQ3NDLGdCQUFZLEdBQUN0QyxDQUFiO0FBQWU7O0FBQTNCLENBQTNCLEVBQXdELENBQXhEO0FBQTJELElBQUkwTSxVQUFKO0FBQWU1TSxNQUFNLENBQUNDLElBQVAsQ0FBWSwrQkFBWixFQUE0QztBQUFDMk0sWUFBVSxDQUFDMU0sQ0FBRCxFQUFHO0FBQUMwTSxjQUFVLEdBQUMxTSxDQUFYO0FBQWE7O0FBQTVCLENBQTVDLEVBQTBFLENBQTFFO0FBQTZFLElBQUkyTSxpQkFBSjtBQUFzQjdNLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLDhDQUFaLEVBQTJEO0FBQUM0TSxtQkFBaUIsQ0FBQzNNLENBQUQsRUFBRztBQUFDMk0scUJBQWlCLEdBQUMzTSxDQUFsQjtBQUFvQjs7QUFBMUMsQ0FBM0QsRUFBdUcsQ0FBdkc7QUFBMEcsSUFBSTZILE9BQUo7QUFBWS9ILE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLDJDQUFaLEVBQXdEO0FBQUM4SCxTQUFPLENBQUM3SCxDQUFELEVBQUc7QUFBQzZILFdBQU8sR0FBQzdILENBQVI7QUFBVTs7QUFBdEIsQ0FBeEQsRUFBZ0YsQ0FBaEY7QUFBbUYsSUFBSTRNLFNBQUosRUFBY0MsU0FBZDtBQUF3Qi9NLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLDRDQUFaLEVBQXlEO0FBQUM2TSxXQUFTLENBQUM1TSxDQUFELEVBQUc7QUFBQzRNLGFBQVMsR0FBQzVNLENBQVY7QUFBWSxHQUExQjs7QUFBMkI2TSxXQUFTLENBQUM3TSxDQUFELEVBQUc7QUFBQzZNLGFBQVMsR0FBQzdNLENBQVY7QUFBWTs7QUFBcEQsQ0FBekQsRUFBK0csQ0FBL0c7QUFPL2QsTUFBTXFOLFlBQVksR0FBRywwQkFBckI7QUFDQSxNQUFNQyxvQkFBb0IsR0FBRyxrQ0FBN0I7QUFFQSxNQUFNQyxzQkFBc0IsR0FBRyxJQUFJakwsWUFBSixDQUFpQjtBQUM5Q3lILFFBQU0sRUFBRTtBQUNOdEcsUUFBSSxFQUFFQztBQURBO0FBRHNDLENBQWpCLENBQS9COztBQU9BLE1BQU0ySCxnQkFBZ0IsR0FBSTVKLElBQUQsSUFBVTtBQUNqQyxNQUFJO0FBQ0YsVUFBTTZGLE9BQU8sR0FBRzdGLElBQWhCO0FBQ0E4TCwwQkFBc0IsQ0FBQ2xNLFFBQXZCLENBQWdDaUcsT0FBaEM7QUFFQSxRQUFJa0csZUFBZSxHQUFDSCxZQUFwQjs7QUFDQSxRQUFHVCxTQUFTLE1BQU1DLFNBQVMsRUFBM0IsRUFBOEI7QUFDMUJXLHFCQUFlLEdBQUdGLG9CQUFsQjtBQUNBekYsYUFBTyxDQUFDLG1CQUFpQitFLFNBQVMsRUFBMUIsR0FBNkIsYUFBN0IsR0FBMkNDLFNBQVMsRUFBcEQsR0FBdUQsZUFBeEQsRUFBd0U7QUFBQ1ksbUJBQVcsRUFBQ0QsZUFBYjtBQUE4QnpELGNBQU0sRUFBQ3pDLE9BQU8sQ0FBQ3lDO0FBQTdDLE9BQXhFLENBQVA7QUFDSDs7QUFFRCxVQUFNbUMsUUFBUSxHQUFHUSxVQUFVLENBQUNjLGVBQUQsRUFBa0JsRyxPQUFPLENBQUN5QyxNQUExQixDQUEzQjtBQUNBLFFBQUdtQyxRQUFRLEtBQUszRCxTQUFoQixFQUEyQixPQUFPNkUsV0FBVyxFQUFsQjtBQUUzQnZGLFdBQU8sQ0FBQyw2REFBRCxFQUErRHFFLFFBQS9ELENBQVA7QUFDQSxXQUFPQSxRQUFQO0FBQ0QsR0FmRCxDQWVFLE9BQU9yRCxTQUFQLEVBQWtCO0FBQ2xCLFVBQU0sSUFBSWhKLE1BQU0sQ0FBQzhCLEtBQVgsQ0FBaUIsZ0NBQWpCLEVBQW1Ea0gsU0FBbkQsQ0FBTjtBQUNEO0FBQ0YsQ0FuQkQ7O0FBcUJBLE1BQU11RSxXQUFXLEdBQUcsTUFBTTtBQUN4QnZGLFNBQU8sQ0FBQyxvQ0FBa0M4RSxpQkFBbEMsR0FBb0QsVUFBckQsQ0FBUDtBQUNBLFNBQU9BLGlCQUFQO0FBQ0QsQ0FIRDs7QUF0Q0E3TSxNQUFNLENBQUNnSixhQUFQLENBMkNldUMsZ0JBM0NmLEU7Ozs7Ozs7Ozs7O0FDQUEsSUFBSXhMLE1BQUo7QUFBV0MsTUFBTSxDQUFDQyxJQUFQLENBQVksZUFBWixFQUE0QjtBQUFDRixRQUFNLENBQUNHLENBQUQsRUFBRztBQUFDSCxVQUFNLEdBQUNHLENBQVA7QUFBUzs7QUFBcEIsQ0FBNUIsRUFBa0QsQ0FBbEQ7QUFBcUQsSUFBSXNDLFlBQUo7QUFBaUJ4QyxNQUFNLENBQUNDLElBQVAsQ0FBWSxjQUFaLEVBQTJCO0FBQUNtQixTQUFPLENBQUNsQixDQUFELEVBQUc7QUFBQ3NDLGdCQUFZLEdBQUN0QyxDQUFiO0FBQWU7O0FBQTNCLENBQTNCLEVBQXdELENBQXhEO0FBQTJELElBQUlvSixjQUFKLEVBQW1CQyxlQUFuQjtBQUFtQ3ZKLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLG1EQUFaLEVBQWdFO0FBQUNxSixnQkFBYyxDQUFDcEosQ0FBRCxFQUFHO0FBQUNvSixrQkFBYyxHQUFDcEosQ0FBZjtBQUFpQixHQUFwQzs7QUFBcUNxSixpQkFBZSxDQUFDckosQ0FBRCxFQUFHO0FBQUNxSixtQkFBZSxHQUFDckosQ0FBaEI7QUFBa0I7O0FBQTFFLENBQWhFLEVBQTRJLENBQTVJO0FBQStJLElBQUkwTixNQUFKO0FBQVc1TixNQUFNLENBQUNDLElBQVAsQ0FBWSxvQ0FBWixFQUFpRDtBQUFDMk4sUUFBTSxDQUFDMU4sQ0FBRCxFQUFHO0FBQUMwTixVQUFNLEdBQUMxTixDQUFQO0FBQVM7O0FBQXBCLENBQWpELEVBQXVFLENBQXZFO0FBQTBFLElBQUl1RyxlQUFKO0FBQW9CekcsTUFBTSxDQUFDQyxJQUFQLENBQVksa0NBQVosRUFBK0M7QUFBQ3dHLGlCQUFlLENBQUN2RyxDQUFELEVBQUc7QUFBQ3VHLG1CQUFlLEdBQUN2RyxDQUFoQjtBQUFrQjs7QUFBdEMsQ0FBL0MsRUFBdUYsQ0FBdkY7QUFBMEYsSUFBSTJOLHNCQUFKO0FBQTJCN04sTUFBTSxDQUFDQyxJQUFQLENBQVksb0NBQVosRUFBaUQ7QUFBQ21CLFNBQU8sQ0FBQ2xCLENBQUQsRUFBRztBQUFDMk4sMEJBQXNCLEdBQUMzTixDQUF2QjtBQUF5Qjs7QUFBckMsQ0FBakQsRUFBd0YsQ0FBeEY7QUFBMkYsSUFBSTROLG9CQUFKO0FBQXlCOU4sTUFBTSxDQUFDQyxJQUFQLENBQVksK0JBQVosRUFBNEM7QUFBQ21CLFNBQU8sQ0FBQ2xCLENBQUQsRUFBRztBQUFDNE4sd0JBQW9CLEdBQUM1TixDQUFyQjtBQUF1Qjs7QUFBbkMsQ0FBNUMsRUFBaUYsQ0FBakY7QUFBb0YsSUFBSTZOLGNBQUo7QUFBbUIvTixNQUFNLENBQUNDLElBQVAsQ0FBWSxzQkFBWixFQUFtQztBQUFDbUIsU0FBTyxDQUFDbEIsQ0FBRCxFQUFHO0FBQUM2TixrQkFBYyxHQUFDN04sQ0FBZjtBQUFpQjs7QUFBN0IsQ0FBbkMsRUFBa0UsQ0FBbEU7QUFBcUUsSUFBSTRKLFVBQUosRUFBZS9CLE9BQWY7QUFBdUIvSCxNQUFNLENBQUNDLElBQVAsQ0FBWSwyQ0FBWixFQUF3RDtBQUFDNkosWUFBVSxDQUFDNUosQ0FBRCxFQUFHO0FBQUM0SixjQUFVLEdBQUM1SixDQUFYO0FBQWEsR0FBNUI7O0FBQTZCNkgsU0FBTyxDQUFDN0gsQ0FBRCxFQUFHO0FBQUM2SCxXQUFPLEdBQUM3SCxDQUFSO0FBQVU7O0FBQWxELENBQXhELEVBQTRHLENBQTVHO0FBVW4xQixNQUFNOE4sc0JBQXNCLEdBQUcsSUFBSXhMLFlBQUosQ0FBaUI7QUFDOUNsQixNQUFJLEVBQUU7QUFDSnFDLFFBQUksRUFBRUM7QUFERixHQUR3QztBQUk5Q2dELE9BQUssRUFBRTtBQUNMakQsUUFBSSxFQUFFQztBQURELEdBSnVDO0FBTzlDaUQsU0FBTyxFQUFFO0FBQ1BsRCxRQUFJLEVBQUVDO0FBREMsR0FQcUM7QUFVOUNTLE1BQUksRUFBRTtBQUNKVixRQUFJLEVBQUVDO0FBREY7QUFWd0MsQ0FBakIsQ0FBL0I7QUFlQTs7Ozs7OztBQU1BLE1BQU1xSyxnQkFBZ0IsR0FBSXRILEtBQUQsSUFBVztBQUNsQyxNQUFJO0FBRUYsVUFBTXVILFFBQVEsR0FBR3ZILEtBQWpCO0FBQ0FtRCxjQUFVLENBQUMsZ0NBQUQsRUFBa0NvRSxRQUFRLENBQUM1TSxJQUEzQyxDQUFWO0FBQ0EwTSwwQkFBc0IsQ0FBQ3pNLFFBQXZCLENBQWdDMk0sUUFBaEM7QUFFQSxVQUFNQyxHQUFHLEdBQUcxSCxlQUFlLENBQUNrRSxPQUFoQixDQUF3QjtBQUFDckosVUFBSSxFQUFFNE0sUUFBUSxDQUFDNU07QUFBaEIsS0FBeEIsQ0FBWjs7QUFDQSxRQUFHNk0sR0FBRyxLQUFLMUYsU0FBWCxFQUFxQjtBQUNqQlYsYUFBTyxDQUFDLDRDQUEwQ29HLEdBQUcsQ0FBQ3pLLEdBQS9DLENBQVA7QUFDQSxhQUFPeUssR0FBRyxDQUFDekssR0FBWDtBQUNIOztBQUVELFVBQU1rRCxLQUFLLEdBQUdpQyxJQUFJLENBQUN1RixLQUFMLENBQVdGLFFBQVEsQ0FBQ3RILEtBQXBCLENBQWQsQ0FaRSxDQWFGOztBQUNBLFFBQUdBLEtBQUssQ0FBQ3JCLElBQU4sS0FBZWtELFNBQWxCLEVBQTZCLE1BQU0sd0JBQU4sQ0FkM0IsQ0FjMkQ7O0FBQzdELFVBQU00RixHQUFHLEdBQUdULE1BQU0sQ0FBQ3RFLGNBQUQsRUFBaUJDLGVBQWpCLENBQWxCO0FBQ0EsVUFBTWpELFVBQVUsR0FBR3dILG9CQUFvQixDQUFDO0FBQUNPLFNBQUcsRUFBRUE7QUFBTixLQUFELENBQXZDO0FBQ0F0RyxXQUFPLENBQUMseUNBQUQsQ0FBUDtBQUVBLFVBQU1rQyxNQUFNLEdBQUc4RCxjQUFjLENBQUM7QUFBQ3pILGdCQUFVLEVBQUVBLFVBQWI7QUFBeUIrRSxhQUFPLEVBQUV6RSxLQUFLLENBQUNyQjtBQUF4QyxLQUFELENBQTdCO0FBQ0F3QyxXQUFPLENBQUMsaUNBQUQsRUFBbUNrQyxNQUFuQyxDQUFQO0FBRUEsVUFBTXFFLE9BQU8sR0FBR0osUUFBUSxDQUFDNU0sSUFBVCxDQUFjaU4sT0FBZCxDQUFzQixHQUF0QixDQUFoQixDQXRCRSxDQXNCMEM7O0FBQzVDeEcsV0FBTyxDQUFDLFVBQUQsRUFBWXVHLE9BQVosQ0FBUDtBQUNBLFVBQU1oSyxTQUFTLEdBQUlnSyxPQUFPLElBQUUsQ0FBQyxDQUFYLEdBQWNKLFFBQVEsQ0FBQzVNLElBQVQsQ0FBY2tOLFNBQWQsQ0FBd0IsQ0FBeEIsRUFBMEJGLE9BQTFCLENBQWQsR0FBaUQ3RixTQUFuRTtBQUNBVixXQUFPLENBQUMsWUFBRCxFQUFjekQsU0FBZCxDQUFQO0FBQ0EsVUFBTUosS0FBSyxHQUFHSSxTQUFTLEdBQUM0SixRQUFRLENBQUM1TSxJQUFULENBQWNrTixTQUFkLENBQXdCRixPQUFPLEdBQUMsQ0FBaEMsQ0FBRCxHQUFvQzdGLFNBQTNEO0FBQ0FWLFdBQU8sQ0FBQyxRQUFELEVBQVU3RCxLQUFWLENBQVA7QUFFQSxVQUFNa0UsRUFBRSxHQUFHM0IsZUFBZSxDQUFDOUQsTUFBaEIsQ0FBdUI7QUFDOUJyQixVQUFJLEVBQUU0TSxRQUFRLENBQUM1TSxJQURlO0FBRTlCc0YsV0FBSyxFQUFFc0gsUUFBUSxDQUFDdEgsS0FGYztBQUc5QkMsYUFBTyxFQUFFcUgsUUFBUSxDQUFDckgsT0FIWTtBQUk5QnZDLGVBQVMsRUFBRUEsU0FKbUI7QUFLOUJKLFdBQUssRUFBRUEsS0FMdUI7QUFNOUJHLFVBQUksRUFBRTZKLFFBQVEsQ0FBQzdKLElBTmU7QUFPOUJvSyxlQUFTLEVBQUVQLFFBQVEsQ0FBQ08sU0FQVTtBQVE5QkMsYUFBTyxFQUFFUixRQUFRLENBQUNRO0FBUlksS0FBdkIsQ0FBWDtBQVdBM0csV0FBTyxDQUFDLDZCQUFELEVBQWdDO0FBQUNLLFFBQUUsRUFBQ0EsRUFBSjtBQUFPOUcsVUFBSSxFQUFDNE0sUUFBUSxDQUFDNU0sSUFBckI7QUFBMEJnRCxlQUFTLEVBQUNBLFNBQXBDO0FBQThDSixXQUFLLEVBQUNBO0FBQXBELEtBQWhDLENBQVA7O0FBRUEsUUFBRyxDQUFDSSxTQUFKLEVBQWM7QUFDVnVKLDRCQUFzQixDQUFDO0FBQ25Cdk0sWUFBSSxFQUFFNE0sUUFBUSxDQUFDNU0sSUFESTtBQUVuQjJJLGNBQU0sRUFBRUE7QUFGVyxPQUFELENBQXRCO0FBSUFsQyxhQUFPLENBQUMsd0JBQ0osU0FESSxHQUNNbUcsUUFBUSxDQUFDNU0sSUFEZixHQUNvQixJQURwQixHQUVKLFVBRkksR0FFTzRNLFFBQVEsQ0FBQ3JILE9BRmhCLEdBRXdCLElBRnhCLEdBR0osT0FISSxHQUdJcUgsUUFBUSxDQUFDN0osSUFIYixHQUdrQixJQUhsQixHQUlKLFFBSkksR0FJSzZKLFFBQVEsQ0FBQ3RILEtBSmYsQ0FBUDtBQU1ILEtBWEQsTUFXSztBQUNEbUIsYUFBTyxDQUFDLDZDQUFELEVBQWdEekQsU0FBaEQsQ0FBUDtBQUNIOztBQUVELFdBQU84RCxFQUFQO0FBQ0QsR0ExREQsQ0EwREUsT0FBT1csU0FBUCxFQUFrQjtBQUNsQixVQUFNLElBQUloSixNQUFNLENBQUM4QixLQUFYLENBQWlCLHlDQUFqQixFQUE0RGtILFNBQTVELENBQU47QUFDRDtBQUNGLENBOUREOztBQS9CQS9JLE1BQU0sQ0FBQ2dKLGFBQVAsQ0ErRmVpRixnQkEvRmYsRTs7Ozs7Ozs7Ozs7QUNBQSxJQUFJbE8sTUFBSjtBQUFXQyxNQUFNLENBQUNDLElBQVAsQ0FBWSxlQUFaLEVBQTRCO0FBQUNGLFFBQU0sQ0FBQ0csQ0FBRCxFQUFHO0FBQUNILFVBQU0sR0FBQ0csQ0FBUDtBQUFTOztBQUFwQixDQUE1QixFQUFrRCxDQUFsRDtBQUFxRCxJQUFJeU8sY0FBSixFQUFtQkMsUUFBbkIsRUFBNEJDLGlCQUE1QjtBQUE4QzdPLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLG9DQUFaLEVBQWlEO0FBQUMwTyxnQkFBYyxDQUFDek8sQ0FBRCxFQUFHO0FBQUN5TyxrQkFBYyxHQUFDek8sQ0FBZjtBQUFpQixHQUFwQzs7QUFBcUMwTyxVQUFRLENBQUMxTyxDQUFELEVBQUc7QUFBQzBPLFlBQVEsR0FBQzFPLENBQVQ7QUFBVyxHQUE1RDs7QUFBNkQyTyxtQkFBaUIsQ0FBQzNPLENBQUQsRUFBRztBQUFDMk8scUJBQWlCLEdBQUMzTyxDQUFsQjtBQUFvQjs7QUFBdEcsQ0FBakQsRUFBeUosQ0FBeko7QUFBNEosSUFBSW9KLGNBQUosRUFBbUJDLGVBQW5CO0FBQW1DdkosTUFBTSxDQUFDQyxJQUFQLENBQVksbURBQVosRUFBZ0U7QUFBQ3FKLGdCQUFjLENBQUNwSixDQUFELEVBQUc7QUFBQ29KLGtCQUFjLEdBQUNwSixDQUFmO0FBQWlCLEdBQXBDOztBQUFxQ3FKLGlCQUFlLENBQUNySixDQUFELEVBQUc7QUFBQ3FKLG1CQUFlLEdBQUNySixDQUFoQjtBQUFrQjs7QUFBMUUsQ0FBaEUsRUFBNEksQ0FBNUk7QUFBK0ksSUFBSStOLGdCQUFKO0FBQXFCak8sTUFBTSxDQUFDQyxJQUFQLENBQVksK0JBQVosRUFBNEM7QUFBQ21CLFNBQU8sQ0FBQ2xCLENBQUQsRUFBRztBQUFDK04sb0JBQWdCLEdBQUMvTixDQUFqQjtBQUFtQjs7QUFBL0IsQ0FBNUMsRUFBNkUsQ0FBN0U7QUFBZ0YsSUFBSW9ILElBQUo7QUFBU3RILE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLDJCQUFaLEVBQXdDO0FBQUNxSCxNQUFJLENBQUNwSCxDQUFELEVBQUc7QUFBQ29ILFFBQUksR0FBQ3BILENBQUw7QUFBTzs7QUFBaEIsQ0FBeEMsRUFBMEQsQ0FBMUQ7QUFBNkQsSUFBSTRPLGVBQUo7QUFBb0I5TyxNQUFNLENBQUNDLElBQVAsQ0FBWSx3QkFBWixFQUFxQztBQUFDbUIsU0FBTyxDQUFDbEIsQ0FBRCxFQUFHO0FBQUM0TyxtQkFBZSxHQUFDNU8sQ0FBaEI7QUFBa0I7O0FBQTlCLENBQXJDLEVBQXFFLENBQXJFO0FBQXdFLElBQUk0SixVQUFKO0FBQWU5SixNQUFNLENBQUNDLElBQVAsQ0FBWSwyQ0FBWixFQUF3RDtBQUFDNkosWUFBVSxDQUFDNUosQ0FBRCxFQUFHO0FBQUM0SixjQUFVLEdBQUM1SixDQUFYO0FBQWE7O0FBQTVCLENBQXhELEVBQXNGLENBQXRGO0FBUWx0QixNQUFNNk8sYUFBYSxHQUFHLElBQXRCO0FBQ0EsTUFBTUMsc0JBQXNCLEdBQUcsa0JBQS9COztBQUVBLE1BQU1DLG1CQUFtQixHQUFHLENBQUNDLElBQUQsRUFBT0MsR0FBUCxLQUFlO0FBQ3pDLE1BQUk7QUFFQSxRQUFHLENBQUNELElBQUosRUFBUztBQUNMcEYsZ0JBQVUsQ0FBQyx3SEFBRCxFQUEwSFAsZUFBMUgsQ0FBVjs7QUFFQSxVQUFJO0FBQ0EsWUFBSTZGLGdCQUFnQixHQUFHOUgsSUFBSSxDQUFDcUQsT0FBTCxDQUFhO0FBQUNsRCxhQUFHLEVBQUV1SDtBQUFOLFNBQWIsQ0FBdkI7QUFDQSxZQUFHSSxnQkFBZ0IsS0FBSzNHLFNBQXhCLEVBQW1DMkcsZ0JBQWdCLEdBQUdBLGdCQUFnQixDQUFDeEksS0FBcEM7QUFDbkNrRCxrQkFBVSxDQUFDLGtCQUFELEVBQW9Cc0YsZ0JBQXBCLENBQVY7QUFDQSxjQUFNQyxHQUFHLEdBQUdWLGNBQWMsQ0FBQ3JGLGNBQUQsRUFBaUI4RixnQkFBakIsQ0FBMUI7QUFDQSxZQUFHQyxHQUFHLEtBQUs1RyxTQUFSLElBQXFCNEcsR0FBRyxDQUFDQyxZQUFKLEtBQXFCN0csU0FBN0MsRUFBd0Q7QUFFeEQsY0FBTThHLEdBQUcsR0FBR0YsR0FBRyxDQUFDQyxZQUFoQjtBQUNBRix3QkFBZ0IsR0FBR0MsR0FBRyxDQUFDRyxTQUF2Qjs7QUFDQSxZQUFHLENBQUNILEdBQUQsSUFBUSxDQUFDRSxHQUFULElBQWdCLENBQUNBLEdBQUcsQ0FBQ3BELE1BQUwsS0FBYyxDQUFqQyxFQUFtQztBQUMvQnJDLG9CQUFVLENBQUMsa0ZBQUQsRUFBcUZzRixnQkFBckYsQ0FBVjtBQUNBTix5QkFBZSxDQUFDO0FBQUNySCxlQUFHLEVBQUV1SCxzQkFBTjtBQUE4QnBJLGlCQUFLLEVBQUV3STtBQUFyQyxXQUFELENBQWY7QUFDQTtBQUNIOztBQUVEdEYsa0JBQVUsQ0FBQyxnQkFBRCxFQUFrQnVGLEdBQWxCLENBQVY7QUFFQSxjQUFNSSxVQUFVLEdBQUdGLEdBQUcsQ0FBQ0csTUFBSixDQUFXQyxFQUFFLElBQzVCQSxFQUFFLENBQUM5SSxPQUFILEtBQWUwQyxlQUFmLElBQ0dvRyxFQUFFLENBQUNyTyxJQUFILEtBQVltSCxTQURmLENBQ3lCO0FBRHpCLFdBRUdrSCxFQUFFLENBQUNyTyxJQUFILENBQVFzTyxVQUFSLENBQW1CLFVBQVFiLGFBQTNCLENBSFksQ0FHK0I7QUFIL0IsU0FBbkI7QUFLQVUsa0JBQVUsQ0FBQzFKLE9BQVgsQ0FBbUI0SixFQUFFLElBQUk7QUFDckI3RixvQkFBVSxDQUFDLEtBQUQsRUFBTzZGLEVBQVAsQ0FBVjtBQUNBLGNBQUlFLE1BQU0sR0FBR0YsRUFBRSxDQUFDck8sSUFBSCxDQUFRa04sU0FBUixDQUFrQixDQUFDLFVBQVFPLGFBQVQsRUFBd0I1QyxNQUExQyxDQUFiO0FBQ0FyQyxvQkFBVSxDQUFDLHFEQUFELEVBQXdEK0YsTUFBeEQsQ0FBVjtBQUNBLGdCQUFNMUIsR0FBRyxHQUFHUyxRQUFRLENBQUN0RixjQUFELEVBQWlCdUcsTUFBakIsQ0FBcEI7QUFDQS9GLG9CQUFVLENBQUMsaUJBQUQsRUFBbUJxRSxHQUFuQixDQUFWOztBQUNBLGNBQUcsQ0FBQ0EsR0FBSixFQUFRO0FBQ0pyRSxzQkFBVSxDQUFDLHFFQUFELEVBQXdFcUUsR0FBeEUsQ0FBVjtBQUNBO0FBQ0g7O0FBQ0QyQixlQUFLLENBQUNELE1BQUQsRUFBUzFCLEdBQUcsQ0FBQ3ZILEtBQWIsRUFBbUIrSSxFQUFFLENBQUM5SSxPQUF0QixFQUE4QjhJLEVBQUUsQ0FBQ1QsSUFBakMsQ0FBTCxDQVZxQixDQVV3QjtBQUNoRCxTQVhEO0FBWUFKLHVCQUFlLENBQUM7QUFBQ3JILGFBQUcsRUFBRXVILHNCQUFOO0FBQThCcEksZUFBSyxFQUFFd0k7QUFBckMsU0FBRCxDQUFmO0FBQ0F0RixrQkFBVSxDQUFDLDBDQUFELEVBQTRDc0YsZ0JBQTVDLENBQVY7QUFDQUQsV0FBRyxDQUFDWSxJQUFKO0FBQ0gsT0FyQ0QsQ0FxQ0UsT0FBTWhILFNBQU4sRUFBaUI7QUFDZixjQUFNLElBQUloSixNQUFNLENBQUM4QixLQUFYLENBQWlCLHlDQUFqQixFQUE0RGtILFNBQTVELENBQU47QUFDSDtBQUVKLEtBNUNELE1BNENLO0FBQ0RlLGdCQUFVLENBQUMsV0FBU29GLElBQVQsR0FBYyw2Q0FBZixFQUE2RDNGLGVBQTdELENBQVY7QUFFQSxZQUFNOEYsR0FBRyxHQUFHUixpQkFBaUIsQ0FBQ3ZGLGNBQUQsRUFBaUI0RixJQUFqQixDQUE3QjtBQUNBLFlBQU1LLEdBQUcsR0FBR0YsR0FBRyxDQUFDVyxJQUFoQjs7QUFFQSxVQUFHLENBQUNYLEdBQUQsSUFBUSxDQUFDRSxHQUFULElBQWdCLENBQUNBLEdBQUcsQ0FBQ3BELE1BQUwsS0FBYyxDQUFqQyxFQUFtQztBQUMvQnJDLGtCQUFVLENBQUMsVUFBUW9GLElBQVIsR0FBYSxpRUFBZCxDQUFWO0FBQ0E7QUFDSCxPQVRBLENBV0Y7OztBQUVDLFlBQU1PLFVBQVUsR0FBR0YsR0FBRyxDQUFDRyxNQUFKLENBQVdDLEVBQUUsSUFDNUJBLEVBQUUsQ0FBQ00sWUFBSCxLQUFvQnhILFNBQXBCLElBQ0drSCxFQUFFLENBQUNNLFlBQUgsQ0FBZ0JDLE1BQWhCLEtBQTJCekgsU0FEOUIsSUFFR2tILEVBQUUsQ0FBQ00sWUFBSCxDQUFnQkMsTUFBaEIsQ0FBdUJDLEVBQXZCLEtBQThCLFVBRmpDLENBR0Y7QUFIRSxTQUlHUixFQUFFLENBQUNNLFlBQUgsQ0FBZ0JDLE1BQWhCLENBQXVCNU8sSUFBdkIsS0FBZ0NtSCxTQUpuQyxJQUtHa0gsRUFBRSxDQUFDTSxZQUFILENBQWdCQyxNQUFoQixDQUF1QjVPLElBQXZCLENBQTRCc08sVUFBNUIsQ0FBdUNiLGFBQXZDLENBTlksQ0FBbkIsQ0FiQyxDQXNCRDs7QUFFQVUsZ0JBQVUsQ0FBQzFKLE9BQVgsQ0FBbUI0SixFQUFFLElBQUk7QUFDckJHLGFBQUssQ0FBQ0gsRUFBRSxDQUFDTSxZQUFILENBQWdCQyxNQUFoQixDQUF1QjVPLElBQXhCLEVBQThCcU8sRUFBRSxDQUFDTSxZQUFILENBQWdCQyxNQUFoQixDQUF1QnRKLEtBQXJELEVBQTJEK0ksRUFBRSxDQUFDTSxZQUFILENBQWdCRyxTQUFoQixDQUEwQixDQUExQixDQUEzRCxFQUF3RmxCLElBQXhGLENBQUw7QUFDSCxPQUZEO0FBR0g7QUFJSixHQTdFRCxDQTZFRSxPQUFNbkcsU0FBTixFQUFpQjtBQUNqQixVQUFNLElBQUloSixNQUFNLENBQUM4QixLQUFYLENBQWlCLHlDQUFqQixFQUE0RGtILFNBQTVELENBQU47QUFDRDs7QUFDRCxTQUFPLElBQVA7QUFDRCxDQWxGRDs7QUFxRkEsU0FBUytHLEtBQVQsQ0FBZXhPLElBQWYsRUFBcUJzRixLQUFyQixFQUE0QkMsT0FBNUIsRUFBcUNxSSxJQUFyQyxFQUEyQztBQUN2QyxRQUFNVyxNQUFNLEdBQUd2TyxJQUFJLENBQUNrTixTQUFMLENBQWVPLGFBQWEsQ0FBQzVDLE1BQTdCLENBQWY7QUFFQThCLGtCQUFnQixDQUFDO0FBQ2IzTSxRQUFJLEVBQUV1TyxNQURPO0FBRWJqSixTQUFLLEVBQUVBLEtBRk07QUFHYkMsV0FBTyxFQUFFQSxPQUhJO0FBSWJ4QyxRQUFJLEVBQUU2SztBQUpPLEdBQUQsQ0FBaEI7QUFNSDs7QUF6R0RsUCxNQUFNLENBQUNnSixhQUFQLENBMkdlaUcsbUJBM0dmLEU7Ozs7Ozs7Ozs7O0FDQUEsSUFBSWxQLE1BQUo7QUFBV0MsTUFBTSxDQUFDQyxJQUFQLENBQVksZUFBWixFQUE0QjtBQUFDRixRQUFNLENBQUNHLENBQUQsRUFBRztBQUFDSCxVQUFNLEdBQUNHLENBQVA7QUFBUzs7QUFBcEIsQ0FBNUIsRUFBa0QsQ0FBbEQ7QUFBcUQsSUFBSXNDLFlBQUo7QUFBaUJ4QyxNQUFNLENBQUNDLElBQVAsQ0FBWSxjQUFaLEVBQTJCO0FBQUNtQixTQUFPLENBQUNsQixDQUFELEVBQUc7QUFBQ3NDLGdCQUFZLEdBQUN0QyxDQUFiO0FBQWU7O0FBQTNCLENBQTNCLEVBQXdELENBQXhEO0FBQTJELElBQUltUSxNQUFKO0FBQVdyUSxNQUFNLENBQUNDLElBQVAsQ0FBWSxRQUFaLEVBQXFCO0FBQUNtQixTQUFPLENBQUNsQixDQUFELEVBQUc7QUFBQ21RLFVBQU0sR0FBQ25RLENBQVA7QUFBUzs7QUFBckIsQ0FBckIsRUFBNEMsQ0FBNUM7QUFBK0MsSUFBSW9RLEtBQUo7QUFBVXRRLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGdCQUFaLEVBQTZCO0FBQUNtQixTQUFPLENBQUNsQixDQUFELEVBQUc7QUFBQ29RLFNBQUssR0FBQ3BRLENBQU47QUFBUTs7QUFBcEIsQ0FBN0IsRUFBbUQsQ0FBbkQ7QUFLaE4sTUFBTXFRLG9CQUFvQixHQUFHLElBQUkvTixZQUFKLENBQWlCO0FBQzVDOEQsWUFBVSxFQUFFO0FBQ1YzQyxRQUFJLEVBQUVDO0FBREksR0FEZ0M7QUFJNUN5SCxTQUFPLEVBQUU7QUFDUDFILFFBQUksRUFBRUM7QUFEQztBQUptQyxDQUFqQixDQUE3Qjs7QUFTQSxNQUFNbUssY0FBYyxHQUFJcE0sSUFBRCxJQUFVO0FBQy9CLE1BQUk7QUFDRixVQUFNNkYsT0FBTyxHQUFHN0YsSUFBaEI7QUFDQTRPLHdCQUFvQixDQUFDaFAsUUFBckIsQ0FBOEJpRyxPQUE5QjtBQUNBLFVBQU1sQixVQUFVLEdBQUdrSyxNQUFNLENBQUNqTCxJQUFQLENBQVlpQyxPQUFPLENBQUNsQixVQUFwQixFQUFnQyxLQUFoQyxDQUFuQjtBQUNBLFVBQU1tSyxJQUFJLEdBQUdKLE1BQU0sQ0FBQ0ssVUFBUCxDQUFrQixXQUFsQixDQUFiO0FBQ0FELFFBQUksQ0FBQ0UsYUFBTCxDQUFtQnJLLFVBQW5CO0FBQ0EsVUFBTStFLE9BQU8sR0FBR21GLE1BQU0sQ0FBQ2pMLElBQVAsQ0FBWWlDLE9BQU8sQ0FBQzZELE9BQXBCLEVBQTZCLEtBQTdCLENBQWhCO0FBQ0EsV0FBT2lGLEtBQUssQ0FBQ00sT0FBTixDQUFjSCxJQUFkLEVBQW9CcEYsT0FBcEIsRUFBNkJ3RixRQUE3QixDQUFzQyxNQUF0QyxDQUFQO0FBQ0QsR0FSRCxDQVFFLE9BQU05SCxTQUFOLEVBQWlCO0FBQ2pCLFVBQU0sSUFBSWhKLE1BQU0sQ0FBQzhCLEtBQVgsQ0FBaUIsbUNBQWpCLEVBQXNEa0gsU0FBdEQsQ0FBTjtBQUNEO0FBQ0YsQ0FaRDs7QUFkQS9JLE1BQU0sQ0FBQ2dKLGFBQVAsQ0E0QmUrRSxjQTVCZixFOzs7Ozs7Ozs7OztBQ0FBLElBQUloTyxNQUFKO0FBQVdDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGVBQVosRUFBNEI7QUFBQ0YsUUFBTSxDQUFDRyxDQUFELEVBQUc7QUFBQ0gsVUFBTSxHQUFDRyxDQUFQO0FBQVM7O0FBQXBCLENBQTVCLEVBQWtELENBQWxEO0FBQXFELElBQUlzQyxZQUFKO0FBQWlCeEMsTUFBTSxDQUFDQyxJQUFQLENBQVksY0FBWixFQUEyQjtBQUFDbUIsU0FBTyxDQUFDbEIsQ0FBRCxFQUFHO0FBQUNzQyxnQkFBWSxHQUFDdEMsQ0FBYjtBQUFlOztBQUEzQixDQUEzQixFQUF3RCxDQUF4RDtBQUEyRCxJQUFJb1EsS0FBSjtBQUFVdFEsTUFBTSxDQUFDQyxJQUFQLENBQVksZ0JBQVosRUFBNkI7QUFBQ21CLFNBQU8sQ0FBQ2xCLENBQUQsRUFBRztBQUFDb1EsU0FBSyxHQUFDcFEsQ0FBTjtBQUFROztBQUFwQixDQUE3QixFQUFtRCxDQUFuRDtBQUl0SixNQUFNNFEsb0JBQW9CLEdBQUcsSUFBSXRPLFlBQUosQ0FBaUI7QUFDNUNnRSxXQUFTLEVBQUU7QUFDVDdDLFFBQUksRUFBRUM7QUFERyxHQURpQztBQUk1Q3lILFNBQU8sRUFBRTtBQUNQMUgsUUFBSSxFQUFFQztBQURDO0FBSm1DLENBQWpCLENBQTdCOztBQVNBLE1BQU1tTixjQUFjLEdBQUlwUCxJQUFELElBQVU7QUFDL0IsTUFBSTtBQUNGLFVBQU02RixPQUFPLEdBQUc3RixJQUFoQjtBQUNBbVAsd0JBQW9CLENBQUN2UCxRQUFyQixDQUE4QmlHLE9BQTlCO0FBQ0EsVUFBTWhCLFNBQVMsR0FBR2dLLE1BQU0sQ0FBQ2pMLElBQVAsQ0FBWWlDLE9BQU8sQ0FBQ2hCLFNBQXBCLEVBQStCLEtBQS9CLENBQWxCO0FBQ0EsVUFBTTZFLE9BQU8sR0FBR21GLE1BQU0sQ0FBQ2pMLElBQVAsQ0FBWWlDLE9BQU8sQ0FBQzZELE9BQXBCLENBQWhCO0FBQ0EsV0FBT2lGLEtBQUssQ0FBQ1UsT0FBTixDQUFjeEssU0FBZCxFQUF5QjZFLE9BQXpCLEVBQWtDd0YsUUFBbEMsQ0FBMkMsS0FBM0MsQ0FBUDtBQUNELEdBTkQsQ0FNRSxPQUFNOUgsU0FBTixFQUFpQjtBQUNqQixVQUFNLElBQUloSixNQUFNLENBQUM4QixLQUFYLENBQWlCLG1DQUFqQixFQUFzRGtILFNBQXRELENBQU47QUFDRDtBQUNGLENBVkQ7O0FBYkEvSSxNQUFNLENBQUNnSixhQUFQLENBeUJlK0gsY0F6QmYsRTs7Ozs7Ozs7Ozs7QUNBQSxJQUFJaFIsTUFBSjtBQUFXQyxNQUFNLENBQUNDLElBQVAsQ0FBWSxlQUFaLEVBQTRCO0FBQUNGLFFBQU0sQ0FBQ0csQ0FBRCxFQUFHO0FBQUNILFVBQU0sR0FBQ0csQ0FBUDtBQUFTOztBQUFwQixDQUE1QixFQUFrRCxDQUFsRDtBQUFxRCxJQUFJc0MsWUFBSjtBQUFpQnhDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGNBQVosRUFBMkI7QUFBQ21CLFNBQU8sQ0FBQ2xCLENBQUQsRUFBRztBQUFDc0MsZ0JBQVksR0FBQ3RDLENBQWI7QUFBZTs7QUFBM0IsQ0FBM0IsRUFBd0QsQ0FBeEQ7QUFBMkQsSUFBSUUsTUFBSjtBQUFXSixNQUFNLENBQUNDLElBQVAsQ0FBWSxpQ0FBWixFQUE4QztBQUFDRyxRQUFNLENBQUNGLENBQUQsRUFBRztBQUFDRSxVQUFNLEdBQUNGLENBQVA7QUFBUzs7QUFBcEIsQ0FBOUMsRUFBb0UsQ0FBcEU7QUFBdUUsSUFBSThHLFVBQUo7QUFBZWhILE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLG1CQUFaLEVBQWdDO0FBQUNtQixTQUFPLENBQUNsQixDQUFELEVBQUc7QUFBQzhHLGNBQVUsR0FBQzlHLENBQVg7QUFBYTs7QUFBekIsQ0FBaEMsRUFBMkQsQ0FBM0Q7QUFBOEQsSUFBSTZILE9BQUo7QUFBWS9ILE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLDJDQUFaLEVBQXdEO0FBQUM4SCxTQUFPLENBQUM3SCxDQUFELEVBQUc7QUFBQzZILFdBQU8sR0FBQzdILENBQVI7QUFBVTs7QUFBdEIsQ0FBeEQsRUFBZ0YsQ0FBaEY7QUFNdlQsTUFBTStRLG9CQUFvQixHQUFHLElBQUl6TyxZQUFKLENBQWlCO0FBQzVDNEYsSUFBRSxFQUFFO0FBQ0Z6RSxRQUFJLEVBQUVDO0FBREosR0FEd0M7QUFJNUNVLFdBQVMsRUFBRTtBQUNQWCxRQUFJLEVBQUVDLE1BREM7QUFFUEksWUFBUSxFQUFFO0FBRkgsR0FKaUM7QUFRNUNFLE9BQUssRUFBRTtBQUNIUCxRQUFJLEVBQUVuQixZQUFZLENBQUMyQixPQURoQjtBQUVISCxZQUFRLEVBQUU7QUFGUDtBQVJxQyxDQUFqQixDQUE3Qjs7QUFjQSxNQUFNa04sY0FBYyxHQUFJblAsS0FBRCxJQUFXO0FBQ2hDLE1BQUk7QUFDRixVQUFNYyxRQUFRLEdBQUdkLEtBQWpCO0FBQ0FrUCx3QkFBb0IsQ0FBQzFQLFFBQXJCLENBQThCc0IsUUFBOUI7QUFDQSxRQUFJdUIsTUFBSjs7QUFDQSxRQUFHckMsS0FBSyxDQUFDdUMsU0FBVCxFQUFtQjtBQUNmRixZQUFNLEdBQUd2QixRQUFRLENBQUN5QixTQUFULEdBQW1CLEdBQW5CLEdBQXVCekIsUUFBUSxDQUFDcUIsS0FBekM7QUFDQTZELGFBQU8sQ0FBQyxxQ0FBbUNoRyxLQUFLLENBQUNtQyxLQUF6QyxHQUErQyxVQUFoRCxFQUEyREUsTUFBM0QsQ0FBUDtBQUNILEtBSEQsTUFJSTtBQUNBQSxZQUFNLEdBQUc0QyxVQUFVLEdBQUdWLFVBQXRCO0FBQ0F5QixhQUFPLENBQUMsd0NBQUQsRUFBMEMzRCxNQUExQyxDQUFQO0FBQ0g7O0FBRURoRSxVQUFNLENBQUNnRCxNQUFQLENBQWM7QUFBQ00sU0FBRyxFQUFHYixRQUFRLENBQUN1RjtBQUFoQixLQUFkLEVBQW1DO0FBQUMrSSxVQUFJLEVBQUM7QUFBQy9NLGNBQU0sRUFBRUE7QUFBVDtBQUFOLEtBQW5DO0FBRUEsV0FBT0EsTUFBUDtBQUNELEdBaEJELENBZ0JFLE9BQU0yRSxTQUFOLEVBQWlCO0FBQ2pCLFVBQU0sSUFBSWhKLE1BQU0sQ0FBQzhCLEtBQVgsQ0FBaUIsbUNBQWpCLEVBQXNEa0gsU0FBdEQsQ0FBTjtBQUNEO0FBQ0YsQ0FwQkQ7O0FBcEJBL0ksTUFBTSxDQUFDZ0osYUFBUCxDQTBDZWtJLGNBMUNmLEU7Ozs7Ozs7Ozs7O0FDQUEsSUFBSW5SLE1BQUo7QUFBV0MsTUFBTSxDQUFDQyxJQUFQLENBQVksZUFBWixFQUE0QjtBQUFDRixRQUFNLENBQUNHLENBQUQsRUFBRztBQUFDSCxVQUFNLEdBQUNHLENBQVA7QUFBUzs7QUFBcEIsQ0FBNUIsRUFBa0QsQ0FBbEQ7QUFBcUQsSUFBSXNDLFlBQUo7QUFBaUJ4QyxNQUFNLENBQUNDLElBQVAsQ0FBWSxjQUFaLEVBQTJCO0FBQUNtQixTQUFPLENBQUNsQixDQUFELEVBQUc7QUFBQ3NDLGdCQUFZLEdBQUN0QyxDQUFiO0FBQWU7O0FBQTNCLENBQTNCLEVBQXdELENBQXhEO0FBQTJELElBQUlrUixRQUFKO0FBQWFwUixNQUFNLENBQUNDLElBQVAsQ0FBWSxXQUFaLEVBQXdCO0FBQUNtQixTQUFPLENBQUNsQixDQUFELEVBQUc7QUFBQ2tSLFlBQVEsR0FBQ2xSLENBQVQ7QUFBVzs7QUFBdkIsQ0FBeEIsRUFBaUQsQ0FBakQ7QUFBb0QsSUFBSW1SLE1BQUo7QUFBV3JSLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLE1BQVosRUFBbUI7QUFBQ21CLFNBQU8sQ0FBQ2xCLENBQUQsRUFBRztBQUFDbVIsVUFBTSxHQUFDblIsQ0FBUDtBQUFTOztBQUFyQixDQUFuQixFQUEwQyxDQUExQztBQUE2QyxJQUFJNE0sU0FBSjtBQUFjOU0sTUFBTSxDQUFDQyxJQUFQLENBQVksK0NBQVosRUFBNEQ7QUFBQzZNLFdBQVMsQ0FBQzVNLENBQUQsRUFBRztBQUFDNE0sYUFBUyxHQUFDNU0sQ0FBVjtBQUFZOztBQUExQixDQUE1RCxFQUF3RixDQUF4RjtBQUEyRixJQUFJNk0sU0FBSjtBQUFjL00sTUFBTSxDQUFDQyxJQUFQLENBQVksNENBQVosRUFBeUQ7QUFBQzhNLFdBQVMsQ0FBQzdNLENBQUQsRUFBRztBQUFDNk0sYUFBUyxHQUFDN00sQ0FBVjtBQUFZOztBQUExQixDQUF6RCxFQUFxRixDQUFyRjtBQU81WCxNQUFNb1IsWUFBWSxHQUFHLElBQXJCO0FBQ0EsTUFBTUMsb0JBQW9CLEdBQUcsSUFBN0I7QUFDQSxNQUFNQyxnQkFBZ0IsR0FBRyxJQUFJaFAsWUFBSixDQUFpQjtBQUN4Q2dFLFdBQVMsRUFBRTtBQUNUN0MsUUFBSSxFQUFFQztBQURHO0FBRDZCLENBQWpCLENBQXpCOztBQU1BLE1BQU02TixVQUFVLEdBQUk5UCxJQUFELElBQVU7QUFDM0IsTUFBSTtBQUNGLFVBQU02RixPQUFPLEdBQUc3RixJQUFoQjtBQUNBNlAsb0JBQWdCLENBQUNqUSxRQUFqQixDQUEwQmlHLE9BQTFCO0FBQ0EsV0FBT2tLLFdBQVcsQ0FBQ2xLLE9BQU8sQ0FBQ2hCLFNBQVQsQ0FBbEI7QUFDRCxHQUpELENBSUUsT0FBTXVDLFNBQU4sRUFBaUI7QUFDakIsVUFBTSxJQUFJaEosTUFBTSxDQUFDOEIsS0FBWCxDQUFpQiwrQkFBakIsRUFBa0RrSCxTQUFsRCxDQUFOO0FBQ0Q7QUFDRixDQVJEOztBQVVBLFNBQVMySSxXQUFULENBQXFCbEwsU0FBckIsRUFBZ0M7QUFDOUIsUUFBTW1MLE1BQU0sR0FBR1AsUUFBUSxDQUFDUSxHQUFULENBQWFDLFNBQWIsQ0FBdUJDLE1BQXZCLENBQThCdEIsTUFBTSxDQUFDakwsSUFBUCxDQUFZaUIsU0FBWixFQUF1QixLQUF2QixDQUE5QixDQUFmO0FBQ0EsTUFBSWlCLEdBQUcsR0FBRzJKLFFBQVEsQ0FBQ1csTUFBVCxDQUFnQkosTUFBaEIsQ0FBVjtBQUNBbEssS0FBRyxHQUFHMkosUUFBUSxDQUFDWSxTQUFULENBQW1CdkssR0FBbkIsQ0FBTjtBQUNBLE1BQUl3SyxXQUFXLEdBQUdYLFlBQWxCO0FBQ0EsTUFBR3hFLFNBQVMsTUFBTUMsU0FBUyxFQUEzQixFQUErQmtGLFdBQVcsR0FBR1Ysb0JBQWQ7QUFDL0IsTUFBSTFLLE9BQU8sR0FBRzJKLE1BQU0sQ0FBQzlILE1BQVAsQ0FBYyxDQUFDOEgsTUFBTSxDQUFDakwsSUFBUCxDQUFZLENBQUMwTSxXQUFELENBQVosQ0FBRCxFQUE2QnpCLE1BQU0sQ0FBQ2pMLElBQVAsQ0FBWWtDLEdBQUcsQ0FBQ29KLFFBQUosRUFBWixFQUE0QixLQUE1QixDQUE3QixDQUFkLENBQWQ7QUFDQXBKLEtBQUcsR0FBRzJKLFFBQVEsQ0FBQ1csTUFBVCxDQUFnQlgsUUFBUSxDQUFDUSxHQUFULENBQWFDLFNBQWIsQ0FBdUJDLE1BQXZCLENBQThCakwsT0FBOUIsQ0FBaEIsQ0FBTjtBQUNBWSxLQUFHLEdBQUcySixRQUFRLENBQUNXLE1BQVQsQ0FBZ0J0SyxHQUFoQixDQUFOO0FBQ0EsTUFBSXlLLFFBQVEsR0FBR3pLLEdBQUcsQ0FBQ29KLFFBQUosR0FBZXJDLFNBQWYsQ0FBeUIsQ0FBekIsRUFBNEIsQ0FBNUIsQ0FBZjtBQUNBM0gsU0FBTyxHQUFHLElBQUkySixNQUFKLENBQVczSixPQUFPLENBQUNnSyxRQUFSLENBQWlCLEtBQWpCLElBQXdCcUIsUUFBbkMsRUFBNEMsS0FBNUMsQ0FBVjtBQUNBckwsU0FBTyxHQUFHd0ssTUFBTSxDQUFDYyxNQUFQLENBQWN0TCxPQUFkLENBQVY7QUFDQSxTQUFPQSxPQUFQO0FBQ0Q7O0FBdENEN0csTUFBTSxDQUFDZ0osYUFBUCxDQXdDZXlJLFVBeENmLEU7Ozs7Ozs7Ozs7O0FDQUEsSUFBSTFSLE1BQUo7QUFBV0MsTUFBTSxDQUFDQyxJQUFQLENBQVksZUFBWixFQUE0QjtBQUFDRixRQUFNLENBQUNHLENBQUQsRUFBRztBQUFDSCxVQUFNLEdBQUNHLENBQVA7QUFBUzs7QUFBcEIsQ0FBNUIsRUFBa0QsQ0FBbEQ7QUFBcUQsSUFBSStHLFVBQUo7QUFBZWpILE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLG9DQUFaLEVBQWlEO0FBQUNnSCxZQUFVLENBQUMvRyxDQUFELEVBQUc7QUFBQytHLGNBQVUsR0FBQy9HLENBQVg7QUFBYTs7QUFBNUIsQ0FBakQsRUFBK0UsQ0FBL0U7QUFBa0YsSUFBSW9KLGNBQUo7QUFBbUJ0SixNQUFNLENBQUNDLElBQVAsQ0FBWSxtREFBWixFQUFnRTtBQUFDcUosZ0JBQWMsQ0FBQ3BKLENBQUQsRUFBRztBQUFDb0osa0JBQWMsR0FBQ3BKLENBQWY7QUFBaUI7O0FBQXBDLENBQWhFLEVBQXNHLENBQXRHOztBQUtwTCxNQUFNa1MsV0FBVyxHQUFHLE1BQU07QUFFeEIsTUFBSTtBQUNGLFVBQU1DLEdBQUcsR0FBQ3BMLFVBQVUsQ0FBQ3FDLGNBQUQsQ0FBcEI7QUFDQSxXQUFPK0ksR0FBUDtBQUVELEdBSkQsQ0FJRSxPQUFNdEosU0FBTixFQUFpQjtBQUNqQixVQUFNLElBQUloSixNQUFNLENBQUM4QixLQUFYLENBQWlCLCtCQUFqQixFQUFrRGtILFNBQWxELENBQU47QUFDRDs7QUFDRCxTQUFPLElBQVA7QUFDRCxDQVZEOztBQUxBL0ksTUFBTSxDQUFDZ0osYUFBUCxDQWlCZW9KLFdBakJmLEU7Ozs7Ozs7Ozs7O0FDQUEsSUFBSXJTLE1BQUo7QUFBV0MsTUFBTSxDQUFDQyxJQUFQLENBQVksZUFBWixFQUE0QjtBQUFDRixRQUFNLENBQUNHLENBQUQsRUFBRztBQUFDSCxVQUFNLEdBQUNHLENBQVA7QUFBUzs7QUFBcEIsQ0FBNUIsRUFBa0QsQ0FBbEQ7QUFBcUQsSUFBSWtSLFFBQUo7QUFBYXBSLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLFdBQVosRUFBd0I7QUFBQ21CLFNBQU8sQ0FBQ2xCLENBQUQsRUFBRztBQUFDa1IsWUFBUSxHQUFDbFIsQ0FBVDtBQUFXOztBQUF2QixDQUF4QixFQUFpRCxDQUFqRDtBQUFvRCxJQUFJc0MsWUFBSjtBQUFpQnhDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGNBQVosRUFBMkI7QUFBQ21CLFNBQU8sQ0FBQ2xCLENBQUQsRUFBRztBQUFDc0MsZ0JBQVksR0FBQ3RDLENBQWI7QUFBZTs7QUFBM0IsQ0FBM0IsRUFBd0QsQ0FBeEQ7QUFJbEosTUFBTW9TLGlCQUFpQixHQUFHLElBQUk5UCxZQUFKLENBQWlCO0FBQ3pDYixNQUFJLEVBQUU7QUFDSmdDLFFBQUksRUFBRUM7QUFERjtBQURtQyxDQUFqQixDQUExQjs7QUFNQSxNQUFNMk8sV0FBVyxHQUFJNVEsSUFBRCxJQUFVO0FBQzVCLE1BQUk7QUFDRixVQUFNNkYsT0FBTyxHQUFHN0YsSUFBaEI7QUFDRTJRLHFCQUFpQixDQUFDL1EsUUFBbEIsQ0FBMkJpRyxPQUEzQjtBQUNGLFVBQU1nTCxJQUFJLEdBQUdwQixRQUFRLENBQUNXLE1BQVQsQ0FBZ0J2SyxPQUFoQixFQUF5QnFKLFFBQXpCLEVBQWI7QUFDQSxXQUFPMkIsSUFBUDtBQUNELEdBTEQsQ0FLRSxPQUFNekosU0FBTixFQUFpQjtBQUNqQixVQUFNLElBQUloSixNQUFNLENBQUM4QixLQUFYLENBQWlCLGdDQUFqQixFQUFtRGtILFNBQW5ELENBQU47QUFDRDtBQUNGLENBVEQ7O0FBVkEvSSxNQUFNLENBQUNnSixhQUFQLENBcUJldUosV0FyQmYsRTs7Ozs7Ozs7Ozs7QUNBQSxJQUFJeFMsTUFBSjtBQUFXQyxNQUFNLENBQUNDLElBQVAsQ0FBWSxlQUFaLEVBQTRCO0FBQUNGLFFBQU0sQ0FBQ0csQ0FBRCxFQUFHO0FBQUNILFVBQU0sR0FBQ0csQ0FBUDtBQUFTOztBQUFwQixDQUE1QixFQUFrRCxDQUFsRDtBQUFxRCxJQUFJdVMsV0FBSjtBQUFnQnpTLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLFFBQVosRUFBcUI7QUFBQ3dTLGFBQVcsQ0FBQ3ZTLENBQUQsRUFBRztBQUFDdVMsZUFBVyxHQUFDdlMsQ0FBWjtBQUFjOztBQUE5QixDQUFyQixFQUFxRCxDQUFyRDtBQUF3RCxJQUFJd1MsU0FBSjtBQUFjMVMsTUFBTSxDQUFDQyxJQUFQLENBQVksV0FBWixFQUF3QjtBQUFDbUIsU0FBTyxDQUFDbEIsQ0FBRCxFQUFHO0FBQUN3UyxhQUFTLEdBQUN4UyxDQUFWO0FBQVk7O0FBQXhCLENBQXhCLEVBQWtELENBQWxEOztBQUl0SixNQUFNOEcsVUFBVSxHQUFHLE1BQU07QUFDdkIsTUFBSTtBQUNGLFFBQUkyTCxPQUFKOztBQUNBLE9BQUc7QUFBQ0EsYUFBTyxHQUFHRixXQUFXLENBQUMsRUFBRCxDQUFyQjtBQUEwQixLQUE5QixRQUFxQyxDQUFDQyxTQUFTLENBQUNFLGdCQUFWLENBQTJCRCxPQUEzQixDQUF0Qzs7QUFDQSxVQUFNck0sVUFBVSxHQUFHcU0sT0FBbkI7QUFDQSxVQUFNbk0sU0FBUyxHQUFHa00sU0FBUyxDQUFDRyxlQUFWLENBQTBCdk0sVUFBMUIsQ0FBbEI7QUFDQSxXQUFPO0FBQ0xBLGdCQUFVLEVBQUVBLFVBQVUsQ0FBQ3VLLFFBQVgsQ0FBb0IsS0FBcEIsRUFBMkJpQyxXQUEzQixFQURQO0FBRUx0TSxlQUFTLEVBQUVBLFNBQVMsQ0FBQ3FLLFFBQVYsQ0FBbUIsS0FBbkIsRUFBMEJpQyxXQUExQjtBQUZOLEtBQVA7QUFJRCxHQVRELENBU0UsT0FBTS9KLFNBQU4sRUFBaUI7QUFDakIsVUFBTSxJQUFJaEosTUFBTSxDQUFDOEIsS0FBWCxDQUFpQiwrQkFBakIsRUFBa0RrSCxTQUFsRCxDQUFOO0FBQ0Q7QUFDRixDQWJEOztBQUpBL0ksTUFBTSxDQUFDZ0osYUFBUCxDQW1CZWhDLFVBbkJmLEU7Ozs7Ozs7Ozs7O0FDQUEsSUFBSWpILE1BQUo7QUFBV0MsTUFBTSxDQUFDQyxJQUFQLENBQVksZUFBWixFQUE0QjtBQUFDRixRQUFNLENBQUNHLENBQUQsRUFBRztBQUFDSCxVQUFNLEdBQUNHLENBQVA7QUFBUzs7QUFBcEIsQ0FBNUIsRUFBa0QsQ0FBbEQ7QUFBcUQsSUFBSXNDLFlBQUo7QUFBaUJ4QyxNQUFNLENBQUNDLElBQVAsQ0FBWSxjQUFaLEVBQTJCO0FBQUNtQixTQUFPLENBQUNsQixDQUFELEVBQUc7QUFBQ3NDLGdCQUFZLEdBQUN0QyxDQUFiO0FBQWU7O0FBQTNCLENBQTNCLEVBQXdELENBQXhEO0FBQTJELElBQUltUixNQUFKO0FBQVdyUixNQUFNLENBQUNDLElBQVAsQ0FBWSxNQUFaLEVBQW1CO0FBQUNtQixTQUFPLENBQUNsQixDQUFELEVBQUc7QUFBQ21SLFVBQU0sR0FBQ25SLENBQVA7QUFBUzs7QUFBckIsQ0FBbkIsRUFBMEMsQ0FBMUM7QUFJdkosTUFBTTZTLDBCQUEwQixHQUFHLElBQUl2USxZQUFKLENBQWlCO0FBQ2xENkwsS0FBRyxFQUFFO0FBQ0gxSyxRQUFJLEVBQUVDO0FBREg7QUFENkMsQ0FBakIsQ0FBbkM7O0FBTUEsTUFBTWtLLG9CQUFvQixHQUFJbk0sSUFBRCxJQUFVO0FBQ3JDLE1BQUk7QUFDRixVQUFNNkYsT0FBTyxHQUFHN0YsSUFBaEI7QUFDQW9SLDhCQUEwQixDQUFDeFIsUUFBM0IsQ0FBb0NpRyxPQUFwQztBQUNBLFdBQU93TCxxQkFBcUIsQ0FBQ3hMLE9BQU8sQ0FBQzZHLEdBQVQsQ0FBNUI7QUFDRCxHQUpELENBSUUsT0FBTXRGLFNBQU4sRUFBaUI7QUFDakIsVUFBTSxJQUFJaEosTUFBTSxDQUFDOEIsS0FBWCxDQUFpQix5Q0FBakIsRUFBNERrSCxTQUE1RCxDQUFOO0FBQ0Q7QUFDRixDQVJEOztBQVVBLFNBQVNpSyxxQkFBVCxDQUErQjNFLEdBQS9CLEVBQW9DO0FBQ2xDLE1BQUkvSCxVQUFVLEdBQUcrSyxNQUFNLENBQUM0QixNQUFQLENBQWM1RSxHQUFkLEVBQW1Cd0MsUUFBbkIsQ0FBNEIsS0FBNUIsQ0FBakI7QUFDQXZLLFlBQVUsR0FBR0EsVUFBVSxDQUFDa0ksU0FBWCxDQUFxQixDQUFyQixFQUF3QmxJLFVBQVUsQ0FBQzZGLE1BQVgsR0FBb0IsQ0FBNUMsQ0FBYjs7QUFDQSxNQUFHN0YsVUFBVSxDQUFDNkYsTUFBWCxLQUFzQixFQUF0QixJQUE0QjdGLFVBQVUsQ0FBQzRNLFFBQVgsQ0FBb0IsSUFBcEIsQ0FBL0IsRUFBMEQ7QUFDeEQ1TSxjQUFVLEdBQUdBLFVBQVUsQ0FBQ2tJLFNBQVgsQ0FBcUIsQ0FBckIsRUFBd0JsSSxVQUFVLENBQUM2RixNQUFYLEdBQW9CLENBQTVDLENBQWI7QUFDRDs7QUFDRCxTQUFPN0YsVUFBUDtBQUNEOztBQTNCRHRHLE1BQU0sQ0FBQ2dKLGFBQVAsQ0E2QmU4RSxvQkE3QmYsRTs7Ozs7Ozs7Ozs7QUNBQSxJQUFJdEwsWUFBSjtBQUFpQnhDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGNBQVosRUFBMkI7QUFBQ21CLFNBQU8sQ0FBQ2xCLENBQUQsRUFBRztBQUFDc0MsZ0JBQVksR0FBQ3RDLENBQWI7QUFBZTs7QUFBM0IsQ0FBM0IsRUFBd0QsQ0FBeEQ7QUFBMkQsSUFBSTZILE9BQUo7QUFBWS9ILE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLDJDQUFaLEVBQXdEO0FBQUM4SCxTQUFPLENBQUM3SCxDQUFELEVBQUc7QUFBQzZILFdBQU8sR0FBQzdILENBQVI7QUFBVTs7QUFBdEIsQ0FBeEQsRUFBZ0YsQ0FBaEY7QUFBbUYsSUFBSXNMLFdBQUo7QUFBZ0J4TCxNQUFNLENBQUNDLElBQVAsQ0FBWSx1QkFBWixFQUFvQztBQUFDbUIsU0FBTyxDQUFDbEIsQ0FBRCxFQUFHO0FBQUNzTCxlQUFXLEdBQUN0TCxDQUFaO0FBQWM7O0FBQTFCLENBQXBDLEVBQWdFLENBQWhFO0FBQW1FLElBQUlxTCxnQkFBSjtBQUFxQnZMLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLDRCQUFaLEVBQXlDO0FBQUNtQixTQUFPLENBQUNsQixDQUFELEVBQUc7QUFBQ3FMLG9CQUFnQixHQUFDckwsQ0FBakI7QUFBbUI7O0FBQS9CLENBQXpDLEVBQTBFLENBQTFFO0FBQTZFLElBQUl1UixVQUFKO0FBQWV6UixNQUFNLENBQUNDLElBQVAsQ0FBWSxlQUFaLEVBQTRCO0FBQUNtQixTQUFPLENBQUNsQixDQUFELEVBQUc7QUFBQ3VSLGNBQVUsR0FBQ3ZSLENBQVg7QUFBYTs7QUFBekIsQ0FBNUIsRUFBdUQsQ0FBdkQ7QUFPL1csTUFBTWlULGtCQUFrQixHQUFHLElBQUkzUSxZQUFKLENBQWlCO0FBQ3hDeUgsUUFBTSxFQUFFO0FBQ0p0RyxRQUFJLEVBQUVDO0FBREY7QUFEZ0MsQ0FBakIsQ0FBM0I7O0FBTUEsTUFBTXdQLHNCQUFzQixHQUFJelIsSUFBRCxJQUFVO0FBRXJDLFFBQU02RixPQUFPLEdBQUc3RixJQUFoQjtBQUNBd1Isb0JBQWtCLENBQUM1UixRQUFuQixDQUE0QmlHLE9BQTVCO0FBRUEsTUFBSWhCLFNBQVMsR0FBR2dGLFdBQVcsQ0FBQztBQUFDdkIsVUFBTSxFQUFFekMsT0FBTyxDQUFDeUM7QUFBakIsR0FBRCxDQUEzQjs7QUFDQSxNQUFHLENBQUN6RCxTQUFKLEVBQWM7QUFDVixVQUFNNEYsUUFBUSxHQUFHYixnQkFBZ0IsQ0FBQztBQUFDdEIsWUFBTSxFQUFFekMsT0FBTyxDQUFDeUM7QUFBakIsS0FBRCxDQUFqQztBQUNBbEMsV0FBTyxDQUFDLG1FQUFELEVBQXFFO0FBQUNxRSxjQUFRLEVBQUNBO0FBQVYsS0FBckUsQ0FBUDtBQUNBNUYsYUFBUyxHQUFHZ0YsV0FBVyxDQUFDO0FBQUN2QixZQUFNLEVBQUVtQztBQUFULEtBQUQsQ0FBdkIsQ0FIVSxDQUdtQztBQUNoRDs7QUFDRCxRQUFNaUgsV0FBVyxHQUFJNUIsVUFBVSxDQUFDO0FBQUNqTCxhQUFTLEVBQUVBO0FBQVosR0FBRCxDQUEvQjtBQUNBdUIsU0FBTyxDQUFDLDRCQUFELEVBQStCO0FBQUN2QixhQUFTLEVBQUNBLFNBQVg7QUFBcUI2TSxlQUFXLEVBQUNBO0FBQWpDLEdBQS9CLENBQVA7QUFDQSxTQUFPO0FBQUM3TSxhQUFTLEVBQUNBLFNBQVg7QUFBcUI2TSxlQUFXLEVBQUNBO0FBQWpDLEdBQVA7QUFDSCxDQWREOztBQWJBclQsTUFBTSxDQUFDZ0osYUFBUCxDQTZCZW9LLHNCQTdCZixFOzs7Ozs7Ozs7OztBQ0FBLElBQUlyVCxNQUFKO0FBQVdDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGVBQVosRUFBNEI7QUFBQ0YsUUFBTSxDQUFDRyxDQUFELEVBQUc7QUFBQ0gsVUFBTSxHQUFDRyxDQUFQO0FBQVM7O0FBQXBCLENBQTVCLEVBQWtELENBQWxEO0FBQXFELElBQUlzQyxZQUFKO0FBQWlCeEMsTUFBTSxDQUFDQyxJQUFQLENBQVksY0FBWixFQUEyQjtBQUFDbUIsU0FBTyxDQUFDbEIsQ0FBRCxFQUFHO0FBQUNzQyxnQkFBWSxHQUFDdEMsQ0FBYjtBQUFlOztBQUEzQixDQUEzQixFQUF3RCxDQUF4RDtBQUEyRCxJQUFJb1QsT0FBSjtBQUFZdFQsTUFBTSxDQUFDQyxJQUFQLENBQVksYUFBWixFQUEwQjtBQUFDbUIsU0FBTyxDQUFDbEIsQ0FBRCxFQUFHO0FBQUNvVCxXQUFPLEdBQUNwVCxDQUFSO0FBQVU7O0FBQXRCLENBQTFCLEVBQWtELENBQWxEO0FBQXFELElBQUlxVCxPQUFKO0FBQVl2VCxNQUFNLENBQUNDLElBQVAsQ0FBWSxpQkFBWixFQUE4QjtBQUFDbUIsU0FBTyxDQUFDbEIsQ0FBRCxFQUFHO0FBQUNxVCxXQUFPLEdBQUNyVCxDQUFSO0FBQVU7O0FBQXRCLENBQTlCLEVBQXNELENBQXREO0FBS3pOLE1BQU1zVCxrQkFBa0IsR0FBRyxJQUFJaFIsWUFBSixDQUFpQjtBQUMxQzZJLFNBQU8sRUFBRTtBQUNQMUgsUUFBSSxFQUFFQztBQURDLEdBRGlDO0FBSTFDMEMsWUFBVSxFQUFFO0FBQ1YzQyxRQUFJLEVBQUVDO0FBREk7QUFKOEIsQ0FBakIsQ0FBM0I7O0FBU0EsTUFBTTZQLFlBQVksR0FBSTlSLElBQUQsSUFBVTtBQUM3QixNQUFJO0FBQ0YsVUFBTTZGLE9BQU8sR0FBRzdGLElBQWhCO0FBQ0E2UixzQkFBa0IsQ0FBQ2pTLFFBQW5CLENBQTRCaUcsT0FBNUI7QUFDQSxVQUFNNEMsU0FBUyxHQUFHbUosT0FBTyxDQUFDL0wsT0FBTyxDQUFDNkQsT0FBVCxDQUFQLENBQXlCcUksSUFBekIsQ0FBOEIsSUFBSUosT0FBTyxDQUFDSyxVQUFaLENBQXVCbk0sT0FBTyxDQUFDbEIsVUFBL0IsQ0FBOUIsQ0FBbEI7QUFDQSxXQUFPOEQsU0FBUDtBQUNELEdBTEQsQ0FLRSxPQUFNckIsU0FBTixFQUFpQjtBQUNqQixVQUFNLElBQUloSixNQUFNLENBQUM4QixLQUFYLENBQWlCLGlDQUFqQixFQUFvRGtILFNBQXBELENBQU47QUFDRDtBQUNGLENBVEQ7O0FBZEEvSSxNQUFNLENBQUNnSixhQUFQLENBeUJleUssWUF6QmYsRTs7Ozs7Ozs7Ozs7QUNBQSxJQUFJMVQsTUFBSjtBQUFXQyxNQUFNLENBQUNDLElBQVAsQ0FBWSxlQUFaLEVBQTRCO0FBQUNGLFFBQU0sQ0FBQ0csQ0FBRCxFQUFHO0FBQUNILFVBQU0sR0FBQ0csQ0FBUDtBQUFTOztBQUFwQixDQUE1QixFQUFrRCxDQUFsRDtBQUFxRCxJQUFJc0MsWUFBSjtBQUFpQnhDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGNBQVosRUFBMkI7QUFBQ21CLFNBQU8sQ0FBQ2xCLENBQUQsRUFBRztBQUFDc0MsZ0JBQVksR0FBQ3RDLENBQWI7QUFBZTs7QUFBM0IsQ0FBM0IsRUFBd0QsQ0FBeEQ7QUFBMkQsSUFBSTBULFdBQUo7QUFBZ0I1VCxNQUFNLENBQUNDLElBQVAsQ0FBWSxtREFBWixFQUFnRTtBQUFDMlQsYUFBVyxDQUFDMVQsQ0FBRCxFQUFHO0FBQUMwVCxlQUFXLEdBQUMxVCxDQUFaO0FBQWM7O0FBQTlCLENBQWhFLEVBQWdHLENBQWhHO0FBQW1HLElBQUk2USxjQUFKO0FBQW1CL1EsTUFBTSxDQUFDQyxJQUFQLENBQVksbUJBQVosRUFBZ0M7QUFBQ21CLFNBQU8sQ0FBQ2xCLENBQUQsRUFBRztBQUFDNlEsa0JBQWMsR0FBQzdRLENBQWY7QUFBaUI7O0FBQTdCLENBQWhDLEVBQStELENBQS9EO0FBQWtFLElBQUltSixNQUFKO0FBQVdySixNQUFNLENBQUNDLElBQVAsQ0FBWSw0Q0FBWixFQUF5RDtBQUFDb0osUUFBTSxDQUFDbkosQ0FBRCxFQUFHO0FBQUNtSixVQUFNLEdBQUNuSixDQUFQO0FBQVM7O0FBQXBCLENBQXpELEVBQStFLENBQS9FO0FBQWtGLElBQUkyVCxhQUFKLEVBQWtCOUwsT0FBbEI7QUFBMEIvSCxNQUFNLENBQUNDLElBQVAsQ0FBWSwyQ0FBWixFQUF3RDtBQUFDNFQsZUFBYSxDQUFDM1QsQ0FBRCxFQUFHO0FBQUMyVCxpQkFBYSxHQUFDM1QsQ0FBZDtBQUFnQixHQUFsQzs7QUFBbUM2SCxTQUFPLENBQUM3SCxDQUFELEVBQUc7QUFBQzZILFdBQU8sR0FBQzdILENBQVI7QUFBVTs7QUFBeEQsQ0FBeEQsRUFBa0gsQ0FBbEg7QUFBcUgsSUFBSTRULE1BQUosRUFBV0MsT0FBWDtBQUFtQi9ULE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGlDQUFaLEVBQThDO0FBQUM2VCxRQUFNLENBQUM1VCxDQUFELEVBQUc7QUFBQzRULFVBQU0sR0FBQzVULENBQVA7QUFBUyxHQUFwQjs7QUFBcUI2VCxTQUFPLENBQUM3VCxDQUFELEVBQUc7QUFBQzZULFdBQU8sR0FBQzdULENBQVI7QUFBVTs7QUFBMUMsQ0FBOUMsRUFBMEYsQ0FBMUY7QUFBNkYsSUFBSUUsTUFBSjtBQUFXSixNQUFNLENBQUNDLElBQVAsQ0FBWSw4QkFBWixFQUEyQztBQUFDRyxRQUFNLENBQUNGLENBQUQsRUFBRztBQUFDRSxVQUFNLEdBQUNGLENBQVA7QUFBUzs7QUFBcEIsQ0FBM0MsRUFBaUUsQ0FBakU7QUFBb0UsSUFBSWtULHNCQUFKO0FBQTJCcFQsTUFBTSxDQUFDQyxJQUFQLENBQVksdUNBQVosRUFBb0Q7QUFBQ21CLFNBQU8sQ0FBQ2xCLENBQUQsRUFBRztBQUFDa1QsMEJBQXNCLEdBQUNsVCxDQUF2QjtBQUF5Qjs7QUFBckMsQ0FBcEQsRUFBMkYsQ0FBM0Y7QUFXMXhCLE1BQU04VCxZQUFZLEdBQUcsSUFBSXhSLFlBQUosQ0FBaUI7QUFDcEM0QixRQUFNLEVBQUU7QUFDTlQsUUFBSSxFQUFFQztBQURBLEdBRDRCO0FBSXBDd0csV0FBUyxFQUFFO0FBQ1R6RyxRQUFJLEVBQUVDO0FBREcsR0FKeUI7QUFPcENxUSxVQUFRLEVBQUU7QUFDUnRRLFFBQUksRUFBRUM7QUFERSxHQVAwQjtBQVVwQ3FHLFFBQU0sRUFBRTtBQUNOdEcsUUFBSSxFQUFFQztBQURBLEdBVjRCO0FBYXBDc1EsU0FBTyxFQUFFO0FBQ1B2USxRQUFJLEVBQUVUO0FBREM7QUFiMkIsQ0FBakIsQ0FBckI7O0FBa0JBLE1BQU1QLE1BQU0sR0FBSWhCLElBQUQsSUFBVTtBQUN2QixRQUFNNkYsT0FBTyxHQUFHN0YsSUFBaEI7O0FBQ0EsTUFBSTtBQUNGcVMsZ0JBQVksQ0FBQ3pTLFFBQWIsQ0FBc0JpRyxPQUF0QjtBQUNBTyxXQUFPLENBQUMsU0FBRCxFQUFXUCxPQUFPLENBQUN5QyxNQUFuQixDQUFQO0FBRUEsVUFBTWtLLG1CQUFtQixHQUFHZixzQkFBc0IsQ0FBQztBQUFDbkosWUFBTSxFQUFDekMsT0FBTyxDQUFDeUM7QUFBaEIsS0FBRCxDQUFsRDtBQUNBLFVBQU0xRSxJQUFJLEdBQUd3TCxjQUFjLENBQUM7QUFBQ3ZLLGVBQVMsRUFBRTJOLG1CQUFtQixDQUFDM04sU0FBaEM7QUFBMkM2RSxhQUFPLEVBQUVoQyxNQUFNO0FBQTFELEtBQUQsQ0FBM0I7QUFDQXRCLFdBQU8sQ0FBQyxrREFBRCxFQUFvRHNCLE1BQU0sRUFBMUQsRUFBNkQ5RCxJQUE3RCxDQUFQO0FBRUEsVUFBTTZPLFNBQVMsR0FBR3ZMLElBQUksQ0FBQ0MsU0FBTCxDQUFlO0FBQzdCc0IsZUFBUyxFQUFFNUMsT0FBTyxDQUFDNEMsU0FEVTtBQUU3QjZKLGNBQVEsRUFBRXpNLE9BQU8sQ0FBQ3lNLFFBRlc7QUFHN0IxTyxVQUFJLEVBQUVBO0FBSHVCLEtBQWYsQ0FBbEIsQ0FSRSxDQWNGOztBQUNBc08saUJBQWEsQ0FBQyxtRUFBRCxFQUFzRU0sbUJBQW1CLENBQUNkLFdBQTFGLENBQWI7QUFDQSxVQUFNZ0IsUUFBUSxHQUFHUCxNQUFNLENBQUNGLFdBQUQsRUFBY08sbUJBQW1CLENBQUNkLFdBQWxDLENBQXZCO0FBQ0FRLGlCQUFhLENBQUMsOEJBQUQsRUFBaUNRLFFBQWpDLEVBQTJDRixtQkFBbUIsQ0FBQ2QsV0FBL0QsQ0FBYjtBQUVBUSxpQkFBYSxDQUFDLG9FQUFELEVBQXVFck0sT0FBTyxDQUFDcEQsTUFBL0UsRUFBc0ZnUSxTQUF0RixFQUFnR0QsbUJBQW1CLENBQUNkLFdBQXBILENBQWI7QUFDQSxVQUFNaUIsU0FBUyxHQUFHUCxPQUFPLENBQUNILFdBQUQsRUFBY3BNLE9BQU8sQ0FBQ3BELE1BQXRCLEVBQThCZ1EsU0FBOUIsRUFBeUNELG1CQUFtQixDQUFDZCxXQUE3RCxDQUF6QjtBQUNBUSxpQkFBYSxDQUFDLGtDQUFELEVBQXFDUyxTQUFyQyxDQUFiO0FBRUFsVSxVQUFNLENBQUNnRCxNQUFQLENBQWM7QUFBQ2dCLFlBQU0sRUFBRW9ELE9BQU8sQ0FBQ3BEO0FBQWpCLEtBQWQsRUFBd0M7QUFBQytNLFVBQUksRUFBRTtBQUFDOU0sWUFBSSxFQUFDaVE7QUFBTjtBQUFQLEtBQXhDO0FBQ0FULGlCQUFhLENBQUMsOEJBQUQsRUFBaUM7QUFBQ3pQLFlBQU0sRUFBRW9ELE9BQU8sQ0FBQ3BELE1BQWpCO0FBQXlCQyxVQUFJLEVBQUVpUTtBQUEvQixLQUFqQyxDQUFiO0FBRUQsR0ExQkQsQ0EwQkUsT0FBTXZMLFNBQU4sRUFBaUI7QUFDZjNJLFVBQU0sQ0FBQ2dELE1BQVAsQ0FBYztBQUFDZ0IsWUFBTSxFQUFFb0QsT0FBTyxDQUFDcEQ7QUFBakIsS0FBZCxFQUF3QztBQUFDK00sVUFBSSxFQUFFO0FBQUN2UCxhQUFLLEVBQUNpSCxJQUFJLENBQUNDLFNBQUwsQ0FBZUMsU0FBUyxDQUFDc0MsT0FBekI7QUFBUDtBQUFQLEtBQXhDO0FBQ0YsVUFBTSxJQUFJdEwsTUFBTSxDQUFDOEIsS0FBWCxDQUFpQiwyQkFBakIsRUFBOENrSCxTQUE5QyxDQUFOLENBRmlCLENBRStDO0FBQ2pFO0FBQ0YsQ0FoQ0Q7O0FBN0JBL0ksTUFBTSxDQUFDZ0osYUFBUCxDQStEZXJHLE1BL0RmLEU7Ozs7Ozs7Ozs7O0FDQUEsSUFBSTVDLE1BQUo7QUFBV0MsTUFBTSxDQUFDQyxJQUFQLENBQVksZUFBWixFQUE0QjtBQUFDRixRQUFNLENBQUNHLENBQUQsRUFBRztBQUFDSCxVQUFNLEdBQUNHLENBQVA7QUFBUzs7QUFBcEIsQ0FBNUIsRUFBa0QsQ0FBbEQ7QUFBcUQsSUFBSXNDLFlBQUo7QUFBaUJ4QyxNQUFNLENBQUNDLElBQVAsQ0FBWSxjQUFaLEVBQTJCO0FBQUNtQixTQUFPLENBQUNsQixDQUFELEVBQUc7QUFBQ3NDLGdCQUFZLEdBQUN0QyxDQUFiO0FBQWU7O0FBQTNCLENBQTNCLEVBQXdELENBQXhEO0FBQTJELElBQUlvSixjQUFKO0FBQW1CdEosTUFBTSxDQUFDQyxJQUFQLENBQVksbURBQVosRUFBZ0U7QUFBQ3FKLGdCQUFjLENBQUNwSixDQUFELEVBQUc7QUFBQ29KLGtCQUFjLEdBQUNwSixDQUFmO0FBQWlCOztBQUFwQyxDQUFoRSxFQUFzRyxDQUF0RztBQUF5RyxJQUFJME4sTUFBSixFQUFXbkUsV0FBWCxFQUF1QjhLLGNBQXZCLEVBQXNDUixPQUF0QyxFQUE4Q25GLFFBQTlDO0FBQXVENU8sTUFBTSxDQUFDQyxJQUFQLENBQVksaUNBQVosRUFBOEM7QUFBQzJOLFFBQU0sQ0FBQzFOLENBQUQsRUFBRztBQUFDME4sVUFBTSxHQUFDMU4sQ0FBUDtBQUFTLEdBQXBCOztBQUFxQnVKLGFBQVcsQ0FBQ3ZKLENBQUQsRUFBRztBQUFDdUosZUFBVyxHQUFDdkosQ0FBWjtBQUFjLEdBQWxEOztBQUFtRHFVLGdCQUFjLENBQUNyVSxDQUFELEVBQUc7QUFBQ3FVLGtCQUFjLEdBQUNyVSxDQUFmO0FBQWlCLEdBQXRGOztBQUF1RjZULFNBQU8sQ0FBQzdULENBQUQsRUFBRztBQUFDNlQsV0FBTyxHQUFDN1QsQ0FBUjtBQUFVLEdBQTVHOztBQUE2RzBPLFVBQVEsQ0FBQzFPLENBQUQsRUFBRztBQUFDME8sWUFBUSxHQUFDMU8sQ0FBVDtBQUFXOztBQUFwSSxDQUE5QyxFQUFvTCxDQUFwTDtBQUF1TCxJQUFJaUosUUFBSixFQUFhcUwsNkJBQWIsRUFBMkNwTCxPQUEzQztBQUFtRHBKLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGtDQUFaLEVBQStDO0FBQUNrSixVQUFRLENBQUNqSixDQUFELEVBQUc7QUFBQ2lKLFlBQVEsR0FBQ2pKLENBQVQ7QUFBVyxHQUF4Qjs7QUFBeUJzVSwrQkFBNkIsQ0FBQ3RVLENBQUQsRUFBRztBQUFDc1UsaUNBQTZCLEdBQUN0VSxDQUE5QjtBQUFnQyxHQUExRjs7QUFBMkZrSixTQUFPLENBQUNsSixDQUFELEVBQUc7QUFBQ2tKLFdBQU8sR0FBQ2xKLENBQVI7QUFBVTs7QUFBaEgsQ0FBL0MsRUFBaUssQ0FBaks7QUFBb0ssSUFBSXFKLGVBQUo7QUFBb0J2SixNQUFNLENBQUNDLElBQVAsQ0FBWSxnREFBWixFQUE2RDtBQUFDc0osaUJBQWUsQ0FBQ3JKLENBQUQsRUFBRztBQUFDcUosbUJBQWUsR0FBQ3JKLENBQWhCO0FBQWtCOztBQUF0QyxDQUE3RCxFQUFxRyxDQUFyRztBQUF3RyxJQUFJdVUsVUFBSjtBQUFlelUsTUFBTSxDQUFDQyxJQUFQLENBQVksNkJBQVosRUFBMEM7QUFBQ3dVLFlBQVUsQ0FBQ3ZVLENBQUQsRUFBRztBQUFDdVUsY0FBVSxHQUFDdlUsQ0FBWDtBQUFhOztBQUE1QixDQUExQyxFQUF3RSxDQUF4RTtBQUEyRSxJQUFJNEosVUFBSjtBQUFlOUosTUFBTSxDQUFDQyxJQUFQLENBQVksMkNBQVosRUFBd0Q7QUFBQzZKLFlBQVUsQ0FBQzVKLENBQUQsRUFBRztBQUFDNEosY0FBVSxHQUFDNUosQ0FBWDtBQUFhOztBQUE1QixDQUF4RCxFQUFzRixDQUF0RjtBQUF5RixJQUFJNE4sb0JBQUo7QUFBeUI5TixNQUFNLENBQUNDLElBQVAsQ0FBWSw0QkFBWixFQUF5QztBQUFDbUIsU0FBTyxDQUFDbEIsQ0FBRCxFQUFHO0FBQUM0Tix3QkFBb0IsR0FBQzVOLENBQXJCO0FBQXVCOztBQUFuQyxDQUF6QyxFQUE4RSxDQUE5RTtBQUFpRixJQUFJNk4sY0FBSjtBQUFtQi9OLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLG1CQUFaLEVBQWdDO0FBQUNtQixTQUFPLENBQUNsQixDQUFELEVBQUc7QUFBQzZOLGtCQUFjLEdBQUM3TixDQUFmO0FBQWlCOztBQUE3QixDQUFoQyxFQUErRCxDQUEvRDtBQUFrRSxJQUFJRSxNQUFKO0FBQVdKLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLDhCQUFaLEVBQTJDO0FBQUNHLFFBQU0sQ0FBQ0YsQ0FBRCxFQUFHO0FBQUNFLFVBQU0sR0FBQ0YsQ0FBUDtBQUFTOztBQUFwQixDQUEzQyxFQUFpRSxFQUFqRTtBQVlydEMsTUFBTXdVLFlBQVksR0FBRyxJQUFJbFMsWUFBSixDQUFpQjtBQUNwQzRCLFFBQU0sRUFBRTtBQUNOVCxRQUFJLEVBQUVDO0FBREEsR0FENEI7QUFJcENnRCxPQUFLLEVBQUU7QUFDTGpELFFBQUksRUFBRUM7QUFERCxHQUo2QjtBQU9wQytRLE1BQUksRUFBRztBQUNIaFIsUUFBSSxFQUFFQyxNQURIO0FBRUhJLFlBQVEsRUFBRTtBQUZQLEdBUDZCO0FBV3BDNFEsYUFBVyxFQUFHO0FBQ1ZqUixRQUFJLEVBQUVDO0FBREk7QUFYc0IsQ0FBakIsQ0FBckI7O0FBZ0JBLE1BQU1SLE1BQU0sR0FBRyxDQUFDekIsSUFBRCxFQUFPd04sR0FBUCxLQUFlO0FBQzVCLE1BQUk7QUFDRixVQUFNM0gsT0FBTyxHQUFHN0YsSUFBaEI7QUFFQStTLGdCQUFZLENBQUNuVCxRQUFiLENBQXNCaUcsT0FBdEIsRUFIRSxDQUtGOztBQUNBLFVBQU1xTixTQUFTLEdBQUdqRyxRQUFRLENBQUN0RixjQUFELEVBQWdCOUIsT0FBTyxDQUFDcEQsTUFBeEIsQ0FBMUI7O0FBQ0EsUUFBR3lRLFNBQVMsS0FBS3BNLFNBQWpCLEVBQTJCO0FBQ3ZCcU0sV0FBSyxDQUFDM0YsR0FBRCxDQUFMO0FBQ0FyRixnQkFBVSxDQUFDLHlDQUFELEVBQTJDdEMsT0FBTyxDQUFDcEQsTUFBbkQsQ0FBVjtBQUNBO0FBQ0g7O0FBQ0QsVUFBTTJRLGVBQWUsR0FBR1IsY0FBYyxDQUFDakwsY0FBRCxFQUFnQnVMLFNBQVMsQ0FBQzNGLElBQTFCLENBQXRDOztBQUNBLFFBQUc2RixlQUFlLENBQUNDLGFBQWhCLEtBQWdDLENBQW5DLEVBQXFDO0FBQ2pDRixXQUFLLENBQUMzRixHQUFELENBQUw7QUFDQXJGLGdCQUFVLENBQUMsd0RBQUQsRUFBMERqQixJQUFJLENBQUN1RixLQUFMLENBQVc1RyxPQUFPLENBQUNaLEtBQW5CLENBQTFELENBQVY7QUFDQTtBQUNIOztBQUNEa0QsY0FBVSxDQUFDLHdDQUFELEVBQTBDakIsSUFBSSxDQUFDdUYsS0FBTCxDQUFXNUcsT0FBTyxDQUFDWixLQUFuQixDQUExQyxDQUFWO0FBQ0EsVUFBTXlILEdBQUcsR0FBR1QsTUFBTSxDQUFDdEUsY0FBRCxFQUFpQkMsZUFBakIsQ0FBbEI7QUFDQSxVQUFNakQsVUFBVSxHQUFHd0gsb0JBQW9CLENBQUM7QUFBQ08sU0FBRyxFQUFFQTtBQUFOLEtBQUQsQ0FBdkM7QUFDQXZFLGNBQVUsQ0FBQyw0RkFBRCxFQUE4RnRDLE9BQU8sQ0FBQ29OLFdBQXRHLENBQVY7QUFDQSxVQUFNSyxjQUFjLEdBQUdsSCxjQUFjLENBQUM7QUFBQ3pILGdCQUFVLEVBQUVBLFVBQWI7QUFBeUIrRSxhQUFPLEVBQUU3RCxPQUFPLENBQUNvTjtBQUExQyxLQUFELENBQXJDO0FBQ0E5SyxjQUFVLENBQUMsdUJBQUQsRUFBeUJtTCxjQUF6QixDQUFWO0FBQ0EsVUFBTTlLLEdBQUcsR0FBRzhLLGNBQWMsR0FBQzlMLFFBQWYsR0FBd0JDLE9BQXhCLEdBQWdDLEdBQWhDLEdBQW9Db0wsNkJBQWhEO0FBRUExSyxjQUFVLENBQUMsb0NBQWtDUCxlQUFsQyxHQUFrRCxVQUFuRCxFQUE4RC9CLE9BQU8sQ0FBQ1osS0FBdEUsQ0FBVjtBQUNBLFVBQU13RCxTQUFTLEdBQUdYLFdBQVcsQ0FBQ0gsY0FBRCxFQUFpQkMsZUFBakIsRUFBa0MvQixPQUFPLENBQUNwRCxNQUExQyxDQUE3QixDQTNCRSxDQTJCOEU7O0FBQ2hGMEYsY0FBVSxDQUFDLG9CQUFELEVBQXNCTSxTQUF0QixDQUFWO0FBRUEsVUFBTThLLFVBQVUsR0FBRztBQUNmOVEsWUFBTSxFQUFFb0QsT0FBTyxDQUFDcEQsTUFERDtBQUVmZ0csZUFBUyxFQUFFQSxTQUZJO0FBR2Z1SyxVQUFJLEVBQUVuTixPQUFPLENBQUNtTjtBQUhDLEtBQW5COztBQU1BLFFBQUk7QUFDQSxZQUFNekYsSUFBSSxHQUFHNkUsT0FBTyxDQUFDekssY0FBRCxFQUFpQjlCLE9BQU8sQ0FBQ3BELE1BQXpCLEVBQWlDb0QsT0FBTyxDQUFDWixLQUF6QyxFQUFnRCxJQUFoRCxDQUFwQjtBQUNBa0QsZ0JBQVUsQ0FBQywwQkFBRCxFQUE0Qm9GLElBQTVCLENBQVY7QUFDSCxLQUhELENBR0MsT0FBTW5HLFNBQU4sRUFBZ0I7QUFDYjtBQUNBZSxnQkFBVSxDQUFDLDhHQUFELEVBQWdIdEMsT0FBTyxDQUFDcEQsTUFBeEgsQ0FBVjs7QUFDQSxVQUFHMkUsU0FBUyxDQUFDOEgsUUFBVixHQUFxQnRDLE9BQXJCLENBQTZCLG1EQUE3QixLQUFtRixDQUFDLENBQXZGLEVBQTBGO0FBQ3RGbk8sY0FBTSxDQUFDZ0QsTUFBUCxDQUFjO0FBQUNnQixnQkFBTSxFQUFFb0QsT0FBTyxDQUFDcEQ7QUFBakIsU0FBZCxFQUF3QztBQUFDK00sY0FBSSxFQUFFO0FBQUN2UCxpQkFBSyxFQUFFaUgsSUFBSSxDQUFDQyxTQUFMLENBQWVDLFNBQVMsQ0FBQ3NDLE9BQXpCO0FBQVI7QUFBUCxTQUF4QztBQUNIOztBQUNELFlBQU0sSUFBSXRMLE1BQU0sQ0FBQzhCLEtBQVgsQ0FBaUIsMkJBQWpCLEVBQThDa0gsU0FBOUMsQ0FBTixDQU5hLENBT2I7QUFDQTtBQUNBO0FBQ0g7O0FBRUQsVUFBTXdCLFFBQVEsR0FBR2tLLFVBQVUsQ0FBQ3RLLEdBQUQsRUFBTStLLFVBQU4sQ0FBM0I7QUFDQXBMLGNBQVUsQ0FBQyxtREFBaURLLEdBQWpELEdBQXFELGtCQUFyRCxHQUF3RXRCLElBQUksQ0FBQ0MsU0FBTCxDQUFlb00sVUFBZixDQUF4RSxHQUFtRyxZQUFwRyxFQUFpSDNLLFFBQVEsQ0FBQzVJLElBQTFILENBQVY7QUFDQXdOLE9BQUcsQ0FBQ1ksSUFBSjtBQUNELEdBdERELENBc0RFLE9BQU1oSCxTQUFOLEVBQWlCO0FBQ2pCLFVBQU0sSUFBSWhKLE1BQU0sQ0FBQzhCLEtBQVgsQ0FBaUIsMkJBQWpCLEVBQThDa0gsU0FBOUMsQ0FBTjtBQUNEO0FBQ0YsQ0ExREQ7O0FBNERBLFNBQVMrTCxLQUFULENBQWUzRixHQUFmLEVBQW1CO0FBQ2ZyRixZQUFVLENBQUMsNkNBQUQsRUFBK0MsRUFBL0MsQ0FBVjtBQUNBcUYsS0FBRyxDQUFDZ0csTUFBSjtBQUNBckwsWUFBVSxDQUFDLCtCQUFELEVBQWlDLEVBQWpDLENBQVY7QUFDQXFGLEtBQUcsQ0FBQ2lHLE9BQUosQ0FDSSxDQUNJO0FBQ0E7QUFDRDtBQUNlO0FBSmxCLEdBREosRUFPSSxVQUFVQyxHQUFWLEVBQWVsUyxNQUFmLEVBQXVCO0FBQ25CLFFBQUlBLE1BQUosRUFBWTtBQUNSMkcsZ0JBQVUsQ0FBQywwQkFBRCxFQUE0QjNHLE1BQTVCLENBQVY7QUFDSDtBQUNKLEdBWEw7QUFhSDs7QUF6R0RuRCxNQUFNLENBQUNnSixhQUFQLENBMkdlNUYsTUEzR2YsRTs7Ozs7Ozs7Ozs7QUNBQSxJQUFJckQsTUFBSjtBQUFXQyxNQUFNLENBQUNDLElBQVAsQ0FBWSxlQUFaLEVBQTRCO0FBQUNGLFFBQU0sQ0FBQ0csQ0FBRCxFQUFHO0FBQUNILFVBQU0sR0FBQ0csQ0FBUDtBQUFTOztBQUFwQixDQUE1QixFQUFrRCxDQUFsRDtBQUFxRCxJQUFJc0MsWUFBSjtBQUFpQnhDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGNBQVosRUFBMkI7QUFBQ21CLFNBQU8sQ0FBQ2xCLENBQUQsRUFBRztBQUFDc0MsZ0JBQVksR0FBQ3RDLENBQWI7QUFBZTs7QUFBM0IsQ0FBM0IsRUFBd0QsQ0FBeEQ7QUFBMkQsSUFBSW9ULE9BQUo7QUFBWXRULE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGFBQVosRUFBMEI7QUFBQ21CLFNBQU8sQ0FBQ2xCLENBQUQsRUFBRztBQUFDb1QsV0FBTyxHQUFDcFQsQ0FBUjtBQUFVOztBQUF0QixDQUExQixFQUFrRCxDQUFsRDtBQUFxRCxJQUFJcVQsT0FBSjtBQUFZdlQsTUFBTSxDQUFDQyxJQUFQLENBQVksaUJBQVosRUFBOEI7QUFBQ21CLFNBQU8sQ0FBQ2xCLENBQUQsRUFBRztBQUFDcVQsV0FBTyxHQUFDclQsQ0FBUjtBQUFVOztBQUF0QixDQUE5QixFQUFzRCxDQUF0RDtBQUF5RCxJQUFJNkosUUFBSixFQUFhdUwsU0FBYjtBQUF1QnRWLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLDJDQUFaLEVBQXdEO0FBQUM4SixVQUFRLENBQUM3SixDQUFELEVBQUc7QUFBQzZKLFlBQVEsR0FBQzdKLENBQVQ7QUFBVyxHQUF4Qjs7QUFBeUJvVixXQUFTLENBQUNwVixDQUFELEVBQUc7QUFBQ29WLGFBQVMsR0FBQ3BWLENBQVY7QUFBWTs7QUFBbEQsQ0FBeEQsRUFBNEcsQ0FBNUc7QUFLelMsTUFBTXFWLE9BQU8sR0FBR2pDLE9BQU8sQ0FBQ2tDLFFBQVIsQ0FBaUJuVSxHQUFqQixDQUFxQjtBQUNuQ0MsTUFBSSxFQUFFLFVBRDZCO0FBRW5DbVUsT0FBSyxFQUFFLFVBRjRCO0FBR25DQyxZQUFVLEVBQUUsSUFIdUI7QUFJbkNDLFlBQVUsRUFBRSxJQUp1QjtBQUtuQ0MsWUFBVSxFQUFFLEVBTHVCO0FBTW5DQyxjQUFZLEVBQUU7QUFOcUIsQ0FBckIsQ0FBaEI7QUFTQSxNQUFNQyxxQkFBcUIsR0FBRyxJQUFJdFQsWUFBSixDQUFpQjtBQUM3Q2IsTUFBSSxFQUFFO0FBQ0pnQyxRQUFJLEVBQUVDO0FBREYsR0FEdUM7QUFJN0M0QyxXQUFTLEVBQUU7QUFDVDdDLFFBQUksRUFBRUM7QUFERyxHQUprQztBQU83Q3dHLFdBQVMsRUFBRTtBQUNUekcsUUFBSSxFQUFFQztBQURHO0FBUGtDLENBQWpCLENBQTlCOztBQVlBLE1BQU02SCxlQUFlLEdBQUk5SixJQUFELElBQVU7QUFDaEMsTUFBSTtBQUNGLFVBQU02RixPQUFPLEdBQUc3RixJQUFoQjtBQUNBMlQsYUFBUyxDQUFDLGtCQUFELEVBQW9COU4sT0FBcEIsQ0FBVDtBQUNBc08seUJBQXFCLENBQUN2VSxRQUF0QixDQUErQmlHLE9BQS9CO0FBQ0EsVUFBTVgsT0FBTyxHQUFHeU0sT0FBTyxDQUFDeUMsT0FBUixDQUFnQkMsYUFBaEIsQ0FBOEIsSUFBSTFDLE9BQU8sQ0FBQzJDLFNBQVosQ0FBc0J6TyxPQUFPLENBQUNoQixTQUE5QixDQUE5QixFQUF3RStPLE9BQXhFLENBQWhCOztBQUNBLFFBQUk7QUFDRixhQUFPaEMsT0FBTyxDQUFDL0wsT0FBTyxDQUFDN0YsSUFBVCxDQUFQLENBQXNCdVUsTUFBdEIsQ0FBNkJyUCxPQUE3QixFQUFzQ1csT0FBTyxDQUFDNEMsU0FBOUMsQ0FBUDtBQUNELEtBRkQsQ0FFRSxPQUFNeEksS0FBTixFQUFhO0FBQUVtSSxjQUFRLENBQUNuSSxLQUFELENBQVI7QUFBZ0I7O0FBQ2pDLFdBQU8sS0FBUDtBQUNELEdBVEQsQ0FTRSxPQUFNbUgsU0FBTixFQUFpQjtBQUNqQixVQUFNLElBQUloSixNQUFNLENBQUM4QixLQUFYLENBQWlCLG9DQUFqQixFQUF1RGtILFNBQXZELENBQU47QUFDRDtBQUNGLENBYkQ7O0FBMUJBL0ksTUFBTSxDQUFDZ0osYUFBUCxDQXlDZXlDLGVBekNmLEU7Ozs7Ozs7Ozs7O0FDQUEsSUFBSTFMLE1BQUo7QUFBV0MsTUFBTSxDQUFDQyxJQUFQLENBQVksZUFBWixFQUE0QjtBQUFDRixRQUFNLENBQUNHLENBQUQsRUFBRztBQUFDSCxVQUFNLEdBQUNHLENBQVA7QUFBUzs7QUFBcEIsQ0FBNUIsRUFBa0QsQ0FBbEQ7QUFBcUQsSUFBSXNDLFlBQUo7QUFBaUJ4QyxNQUFNLENBQUNDLElBQVAsQ0FBWSxjQUFaLEVBQTJCO0FBQUNtQixTQUFPLENBQUNsQixDQUFELEVBQUc7QUFBQ3NDLGdCQUFZLEdBQUN0QyxDQUFiO0FBQWU7O0FBQTNCLENBQTNCLEVBQXdELENBQXhEO0FBQTJELElBQUlFLE1BQUo7QUFBV0osTUFBTSxDQUFDQyxJQUFQLENBQVksaUNBQVosRUFBOEM7QUFBQ0csUUFBTSxDQUFDRixDQUFELEVBQUc7QUFBQ0UsVUFBTSxHQUFDRixDQUFQO0FBQVM7O0FBQXBCLENBQTlDLEVBQW9FLENBQXBFO0FBQXVFLElBQUl3SCxPQUFKO0FBQVkxSCxNQUFNLENBQUNDLElBQVAsQ0FBWSxpQ0FBWixFQUE4QztBQUFDeUgsU0FBTyxDQUFDeEgsQ0FBRCxFQUFHO0FBQUN3SCxXQUFPLEdBQUN4SCxDQUFSO0FBQVU7O0FBQXRCLENBQTlDLEVBQXNFLENBQXRFO0FBQXlFLElBQUkwRSxVQUFKO0FBQWU1RSxNQUFNLENBQUNDLElBQVAsQ0FBWSx1Q0FBWixFQUFvRDtBQUFDMkUsWUFBVSxDQUFDMUUsQ0FBRCxFQUFHO0FBQUMwRSxjQUFVLEdBQUMxRSxDQUFYO0FBQWE7O0FBQTVCLENBQXBELEVBQWtGLENBQWxGO0FBQXFGLElBQUlnUixjQUFKO0FBQW1CbFIsTUFBTSxDQUFDQyxJQUFQLENBQVksdUJBQVosRUFBb0M7QUFBQ21CLFNBQU8sQ0FBQ2xCLENBQUQsRUFBRztBQUFDZ1Isa0JBQWMsR0FBQ2hSLENBQWY7QUFBaUI7O0FBQTdCLENBQXBDLEVBQW1FLENBQW5FO0FBQXNFLElBQUl1VCxZQUFKO0FBQWlCelQsTUFBTSxDQUFDQyxJQUFQLENBQVksb0JBQVosRUFBaUM7QUFBQ21CLFNBQU8sQ0FBQ2xCLENBQUQsRUFBRztBQUFDdVQsZ0JBQVksR0FBQ3ZULENBQWI7QUFBZTs7QUFBM0IsQ0FBakMsRUFBOEQsQ0FBOUQ7QUFBaUUsSUFBSXFTLFdBQUo7QUFBZ0J2UyxNQUFNLENBQUNDLElBQVAsQ0FBWSxvQkFBWixFQUFpQztBQUFDbUIsU0FBTyxDQUFDbEIsQ0FBRCxFQUFHO0FBQUNxUyxlQUFXLEdBQUNyUyxDQUFaO0FBQWM7O0FBQTFCLENBQWpDLEVBQTZELENBQTdEO0FBQWdFLElBQUlpVyxzQkFBSjtBQUEyQm5XLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGtDQUFaLEVBQStDO0FBQUNtQixTQUFPLENBQUNsQixDQUFELEVBQUc7QUFBQ2lXLDBCQUFzQixHQUFDalcsQ0FBdkI7QUFBeUI7O0FBQXJDLENBQS9DLEVBQXNGLENBQXRGO0FBQXlGLElBQUk2SCxPQUFKO0FBQVkvSCxNQUFNLENBQUNDLElBQVAsQ0FBWSwyQ0FBWixFQUF3RDtBQUFDOEgsU0FBTyxDQUFDN0gsQ0FBRCxFQUFHO0FBQUM2SCxXQUFPLEdBQUM3SCxDQUFSO0FBQVU7O0FBQXRCLENBQXhELEVBQWdGLENBQWhGO0FBV2x4QixNQUFNa1csdUJBQXVCLEdBQUcsSUFBSTVULFlBQUosQ0FBaUI7QUFDL0M0RixJQUFFLEVBQUU7QUFDRnpFLFFBQUksRUFBRUM7QUFESjtBQUQyQyxDQUFqQixDQUFoQzs7QUFNQSxNQUFNeVMsaUJBQWlCLEdBQUkxVSxJQUFELElBQVU7QUFDbEMsTUFBSTtBQUNGLFVBQU02RixPQUFPLEdBQUc3RixJQUFoQjtBQUNBeVUsMkJBQXVCLENBQUM3VSxRQUF4QixDQUFpQ2lHLE9BQWpDO0FBRUEsVUFBTXpGLEtBQUssR0FBRzNCLE1BQU0sQ0FBQ3VLLE9BQVAsQ0FBZTtBQUFDakgsU0FBRyxFQUFFL0IsSUFBSSxDQUFDeUc7QUFBWCxLQUFmLENBQWQ7QUFDQSxVQUFNckYsU0FBUyxHQUFHNkIsVUFBVSxDQUFDK0YsT0FBWCxDQUFtQjtBQUFDakgsU0FBRyxFQUFFM0IsS0FBSyxDQUFDZ0I7QUFBWixLQUFuQixDQUFsQjtBQUNBLFVBQU1DLE1BQU0sR0FBRzBFLE9BQU8sQ0FBQ2lELE9BQVIsQ0FBZ0I7QUFBQ2pILFNBQUcsRUFBRTNCLEtBQUssQ0FBQ2lCO0FBQVosS0FBaEIsQ0FBZjtBQUNBK0UsV0FBTyxDQUFDLGFBQUQsRUFBZTtBQUFDN0QsV0FBSyxFQUFDc0QsT0FBTyxDQUFDdEQsS0FBZjtBQUFzQm5DLFdBQUssRUFBQ0EsS0FBNUI7QUFBa0NnQixlQUFTLEVBQUNBLFNBQTVDO0FBQXNEQyxZQUFNLEVBQUVBO0FBQTlELEtBQWYsQ0FBUDtBQUdBLFVBQU1vQixNQUFNLEdBQUc4TSxjQUFjLENBQUM7QUFBQzlJLFFBQUUsRUFBRXpHLElBQUksQ0FBQ3lHLEVBQVY7QUFBYWxFLFdBQUssRUFBQ25DLEtBQUssQ0FBQ21DLEtBQXpCO0FBQStCSSxlQUFTLEVBQUN2QyxLQUFLLENBQUN1QztBQUEvQyxLQUFELENBQTdCO0FBQ0EsVUFBTThGLFNBQVMsR0FBR3FKLFlBQVksQ0FBQztBQUFDcEksYUFBTyxFQUFFdEksU0FBUyxDQUFDc0QsS0FBVixHQUFnQnJELE1BQU0sQ0FBQ3FELEtBQWpDO0FBQXdDQyxnQkFBVSxFQUFFdkQsU0FBUyxDQUFDdUQ7QUFBOUQsS0FBRCxDQUE5QjtBQUNBeUIsV0FBTyxDQUFDLHNEQUFELEVBQXdEcUMsU0FBeEQsQ0FBUDtBQUVBLFFBQUk2SixRQUFRLEdBQUcsRUFBZjs7QUFFQSxRQUFHbFMsS0FBSyxDQUFDSixJQUFULEVBQWU7QUFDYnNTLGNBQVEsR0FBRzFCLFdBQVcsQ0FBQztBQUFDNVEsWUFBSSxFQUFFSSxLQUFLLENBQUNKO0FBQWIsT0FBRCxDQUF0QjtBQUNBb0csYUFBTyxDQUFDLHFDQUFELEVBQXVDa00sUUFBdkMsQ0FBUDtBQUNEOztBQUVELFVBQU1oSSxLQUFLLEdBQUdsSixTQUFTLENBQUNzRCxLQUFWLENBQWdCNkYsS0FBaEIsQ0FBc0IsR0FBdEIsQ0FBZDtBQUNBLFVBQU1qQyxNQUFNLEdBQUdnQyxLQUFLLENBQUNBLEtBQUssQ0FBQ0UsTUFBTixHQUFhLENBQWQsQ0FBcEI7QUFDQXBFLFdBQU8sQ0FBQyx3Q0FBRCxFQUEwQ2tDLE1BQTFDLENBQVA7QUFDQWtNLDBCQUFzQixDQUFDO0FBQ3JCL1IsWUFBTSxFQUFFQSxNQURhO0FBRXJCZ0csZUFBUyxFQUFFQSxTQUZVO0FBR3JCNkosY0FBUSxFQUFFQSxRQUhXO0FBSXJCaEssWUFBTSxFQUFFQSxNQUphO0FBS3JCaUssYUFBTyxFQUFFblMsS0FBSyxDQUFDa0I7QUFMTSxLQUFELENBQXRCO0FBT0QsR0EvQkQsQ0ErQkUsT0FBTzhGLFNBQVAsRUFBa0I7QUFDbEIsVUFBTSxJQUFJaEosTUFBTSxDQUFDOEIsS0FBWCxDQUFpQixzQ0FBakIsRUFBeURrSCxTQUF6RCxDQUFOO0FBQ0Q7QUFDRixDQW5DRDs7QUFqQkEvSSxNQUFNLENBQUNnSixhQUFQLENBc0RlcU4saUJBdERmLEU7Ozs7Ozs7Ozs7O0FDQUEsSUFBSXRXLE1BQUo7QUFBV0MsTUFBTSxDQUFDQyxJQUFQLENBQVksZUFBWixFQUE0QjtBQUFDRixRQUFNLENBQUNHLENBQUQsRUFBRztBQUFDSCxVQUFNLEdBQUNHLENBQVA7QUFBUzs7QUFBcEIsQ0FBNUIsRUFBa0QsQ0FBbEQ7QUFBcUQsSUFBSXNDLFlBQUo7QUFBaUJ4QyxNQUFNLENBQUNDLElBQVAsQ0FBWSxjQUFaLEVBQTJCO0FBQUNtQixTQUFPLENBQUNsQixDQUFELEVBQUc7QUFBQ3NDLGdCQUFZLEdBQUN0QyxDQUFiO0FBQWU7O0FBQTNCLENBQTNCLEVBQXdELENBQXhEO0FBQTJELElBQUlvVyxPQUFKO0FBQVl0VyxNQUFNLENBQUNDLElBQVAsQ0FBWSxnREFBWixFQUE2RDtBQUFDcVcsU0FBTyxDQUFDcFcsQ0FBRCxFQUFHO0FBQUNvVyxXQUFPLEdBQUNwVyxDQUFSO0FBQVU7O0FBQXRCLENBQTdELEVBQXFGLENBQXJGO0FBSXhKLE1BQU1xVyxtQkFBbUIsR0FBRyxJQUFJL1QsWUFBSixDQUFpQjtBQUMzQ2dRLE1BQUksRUFBRTtBQUNKN08sUUFBSSxFQUFFQztBQURGO0FBRHFDLENBQWpCLENBQTVCOztBQU1BLE1BQU00UyxhQUFhLEdBQUloRSxJQUFELElBQVU7QUFDOUIsTUFBSTtBQUNGLFVBQU1pRSxPQUFPLEdBQUdqRSxJQUFoQjtBQUNBK0QsdUJBQW1CLENBQUNoVixRQUFwQixDQUE2QmtWLE9BQTdCO0FBQ0EsVUFBTUMsR0FBRyxHQUFHSixPQUFPLENBQUNLLFNBQVIsQ0FBa0JGLE9BQU8sQ0FBQ2pFLElBQTFCLENBQVo7QUFDQSxRQUFHLENBQUNrRSxHQUFELElBQVFBLEdBQUcsS0FBSyxFQUFuQixFQUF1QixNQUFNLFlBQU47O0FBQ3ZCLFFBQUk7QUFDRixZQUFNRSxHQUFHLEdBQUcvTixJQUFJLENBQUN1RixLQUFMLENBQVdvQyxNQUFNLENBQUNrRyxHQUFELEVBQU0sS0FBTixDQUFOLENBQW1CN0YsUUFBbkIsQ0FBNEIsT0FBNUIsQ0FBWCxDQUFaO0FBQ0EsYUFBTytGLEdBQVA7QUFDRCxLQUhELENBR0UsT0FBTTdOLFNBQU4sRUFBaUI7QUFBQyxZQUFNLFlBQU47QUFBb0I7QUFDekMsR0FURCxDQVNFLE9BQU9BLFNBQVAsRUFBa0I7QUFDbEIsVUFBTSxJQUFJaEosTUFBTSxDQUFDOEIsS0FBWCxDQUFpQixrQ0FBakIsRUFBcURrSCxTQUFyRCxDQUFOO0FBQ0Q7QUFDRixDQWJEOztBQVZBL0ksTUFBTSxDQUFDZ0osYUFBUCxDQXlCZXdOLGFBekJmLEU7Ozs7Ozs7Ozs7O0FDQUEsSUFBSXpXLE1BQUo7QUFBV0MsTUFBTSxDQUFDQyxJQUFQLENBQVksZUFBWixFQUE0QjtBQUFDRixRQUFNLENBQUNHLENBQUQsRUFBRztBQUFDSCxVQUFNLEdBQUNHLENBQVA7QUFBUzs7QUFBcEIsQ0FBNUIsRUFBa0QsQ0FBbEQ7QUFBcUQsSUFBSXNDLFlBQUo7QUFBaUJ4QyxNQUFNLENBQUNDLElBQVAsQ0FBWSxjQUFaLEVBQTJCO0FBQUNtQixTQUFPLENBQUNsQixDQUFELEVBQUc7QUFBQ3NDLGdCQUFZLEdBQUN0QyxDQUFiO0FBQWU7O0FBQTNCLENBQTNCLEVBQXdELENBQXhEO0FBQTJELElBQUlvVyxPQUFKO0FBQVl0VyxNQUFNLENBQUNDLElBQVAsQ0FBWSxnREFBWixFQUE2RDtBQUFDcVcsU0FBTyxDQUFDcFcsQ0FBRCxFQUFHO0FBQUNvVyxXQUFPLEdBQUNwVyxDQUFSO0FBQVU7O0FBQXRCLENBQTdELEVBQXFGLENBQXJGO0FBSXhKLE1BQU0yVyxxQkFBcUIsR0FBRyxJQUFJclUsWUFBSixDQUFpQjtBQUM3QzRGLElBQUUsRUFBRTtBQUNGekUsUUFBSSxFQUFFQztBQURKLEdBRHlDO0FBSTdDZ0gsT0FBSyxFQUFFO0FBQ0xqSCxRQUFJLEVBQUVDO0FBREQsR0FKc0M7QUFPN0NrSCxVQUFRLEVBQUU7QUFDUm5ILFFBQUksRUFBRUM7QUFERTtBQVBtQyxDQUFqQixDQUE5Qjs7QUFZQSxNQUFNZ0csZUFBZSxHQUFJN0gsS0FBRCxJQUFXO0FBQ2pDLE1BQUk7QUFDRixVQUFNYyxRQUFRLEdBQUdkLEtBQWpCO0FBQ0E4VSx5QkFBcUIsQ0FBQ3RWLFFBQXRCLENBQStCc0IsUUFBL0I7QUFFQSxVQUFNaVUsSUFBSSxHQUFHak8sSUFBSSxDQUFDQyxTQUFMLENBQWU7QUFDMUJWLFFBQUUsRUFBRXZGLFFBQVEsQ0FBQ3VGLEVBRGE7QUFFMUJ3QyxXQUFLLEVBQUUvSCxRQUFRLENBQUMrSCxLQUZVO0FBRzFCRSxjQUFRLEVBQUVqSSxRQUFRLENBQUNpSTtBQUhPLEtBQWYsQ0FBYjtBQU1BLFVBQU00TCxHQUFHLEdBQUdsRyxNQUFNLENBQUNzRyxJQUFELENBQU4sQ0FBYWpHLFFBQWIsQ0FBc0IsS0FBdEIsQ0FBWjtBQUNBLFVBQU0yQixJQUFJLEdBQUc4RCxPQUFPLENBQUNTLFNBQVIsQ0FBa0JMLEdBQWxCLENBQWI7QUFDQSxXQUFPbEUsSUFBUDtBQUNELEdBYkQsQ0FhRSxPQUFPekosU0FBUCxFQUFrQjtBQUNsQixVQUFNLElBQUloSixNQUFNLENBQUM4QixLQUFYLENBQWlCLG9DQUFqQixFQUF1RGtILFNBQXZELENBQU47QUFDRDtBQUNGLENBakJEOztBQWhCQS9JLE1BQU0sQ0FBQ2dKLGFBQVAsQ0FtQ2VZLGVBbkNmLEU7Ozs7Ozs7Ozs7O0FDQUEsSUFBSTdKLE1BQUo7QUFBV0MsTUFBTSxDQUFDQyxJQUFQLENBQVksZUFBWixFQUE0QjtBQUFDRixRQUFNLENBQUNHLENBQUQsRUFBRztBQUFDSCxVQUFNLEdBQUNHLENBQVA7QUFBUzs7QUFBcEIsQ0FBNUIsRUFBa0QsQ0FBbEQ7QUFBcUQsSUFBSXNDLFlBQUo7QUFBaUJ4QyxNQUFNLENBQUNDLElBQVAsQ0FBWSxjQUFaLEVBQTJCO0FBQUNtQixTQUFPLENBQUNsQixDQUFELEVBQUc7QUFBQ3NDLGdCQUFZLEdBQUN0QyxDQUFiO0FBQWU7O0FBQTNCLENBQTNCLEVBQXdELENBQXhEO0FBQTJELElBQUk0SixVQUFKO0FBQWU5SixNQUFNLENBQUNDLElBQVAsQ0FBWSwyQ0FBWixFQUF3RDtBQUFDNkosWUFBVSxDQUFDNUosQ0FBRCxFQUFHO0FBQUM0SixjQUFVLEdBQUM1SixDQUFYO0FBQWE7O0FBQTVCLENBQXhELEVBQXNGLENBQXRGO0FBSTNKLE1BQU04VyxpQkFBaUIsR0FBRyxjQUExQjtBQUNBLE1BQU1DLG1CQUFtQixHQUFHLElBQUl6VSxZQUFKLENBQWlCO0FBQzNDd0ksVUFBUSxFQUFFO0FBQ1JySCxRQUFJLEVBQUVDO0FBREUsR0FEaUM7QUFJM0NqQyxNQUFJLEVBQUU7QUFDSmdDLFFBQUksRUFBRXVULE1BREY7QUFFSkMsWUFBUSxFQUFFO0FBRk47QUFKcUMsQ0FBakIsQ0FBNUI7O0FBVUEsTUFBTXpOLGFBQWEsR0FBSS9ILElBQUQsSUFBVTtBQUM5QixNQUFJO0FBQ0YsVUFBTTZGLE9BQU8sR0FBRzdGLElBQWhCLENBREUsQ0FFRjs7QUFFQXNWLHVCQUFtQixDQUFDMVYsUUFBcEIsQ0FBNkJpRyxPQUE3QjtBQUNBc0MsY0FBVSxDQUFDLCtCQUFELENBQVY7O0FBRUEsUUFBSXNOLE1BQUo7O0FBQ0EsUUFBSXBNLFFBQVEsR0FBR3hELE9BQU8sQ0FBQ3dELFFBQXZCLENBUkUsQ0FTSDs7QUFFQyxPQUFHO0FBQ0RvTSxZQUFNLEdBQUdKLGlCQUFpQixDQUFDSyxJQUFsQixDQUF1QnJNLFFBQXZCLENBQVQ7QUFDQSxVQUFHb00sTUFBSCxFQUFXcE0sUUFBUSxHQUFHc00sbUJBQW1CLENBQUN0TSxRQUFELEVBQVdvTSxNQUFYLEVBQW1CNVAsT0FBTyxDQUFDN0YsSUFBUixDQUFheVYsTUFBTSxDQUFDLENBQUQsQ0FBbkIsQ0FBbkIsQ0FBOUI7QUFDWixLQUhELFFBR1NBLE1BSFQ7O0FBSUEsV0FBT3BNLFFBQVA7QUFDRCxHQWhCRCxDQWdCRSxPQUFPakMsU0FBUCxFQUFrQjtBQUNsQixVQUFNLElBQUloSixNQUFNLENBQUM4QixLQUFYLENBQWlCLGdDQUFqQixFQUFtRGtILFNBQW5ELENBQU47QUFDRDtBQUNGLENBcEJEOztBQXNCQSxTQUFTdU8sbUJBQVQsQ0FBNkJ0TSxRQUE3QixFQUF1Q29NLE1BQXZDLEVBQStDRyxPQUEvQyxFQUF3RDtBQUN0RCxNQUFJQyxHQUFHLEdBQUdELE9BQVY7QUFDQSxNQUFHQSxPQUFPLEtBQUs5TyxTQUFmLEVBQTBCK08sR0FBRyxHQUFHLEVBQU47QUFDMUIsU0FBT3hNLFFBQVEsQ0FBQ3dELFNBQVQsQ0FBbUIsQ0FBbkIsRUFBc0I0SSxNQUFNLENBQUNsVCxLQUE3QixJQUFvQ3NULEdBQXBDLEdBQXdDeE0sUUFBUSxDQUFDd0QsU0FBVCxDQUFtQjRJLE1BQU0sQ0FBQ2xULEtBQVAsR0FBYWtULE1BQU0sQ0FBQyxDQUFELENBQU4sQ0FBVWpMLE1BQTFDLENBQS9DO0FBQ0Q7O0FBekNEbk0sTUFBTSxDQUFDZ0osYUFBUCxDQTJDZVUsYUEzQ2YsRTs7Ozs7Ozs7Ozs7QUNBQSxJQUFJM0osTUFBSjtBQUFXQyxNQUFNLENBQUNDLElBQVAsQ0FBWSxlQUFaLEVBQTRCO0FBQUNGLFFBQU0sQ0FBQ0csQ0FBRCxFQUFHO0FBQUNILFVBQU0sR0FBQ0csQ0FBUDtBQUFTOztBQUFwQixDQUE1QixFQUFrRCxDQUFsRDtBQUFxRCxJQUFJc0MsWUFBSjtBQUFpQnhDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGNBQVosRUFBMkI7QUFBQ21CLFNBQU8sQ0FBQ2xCLENBQUQsRUFBRztBQUFDc0MsZ0JBQVksR0FBQ3RDLENBQWI7QUFBZTs7QUFBM0IsQ0FBM0IsRUFBd0QsQ0FBeEQ7QUFBMkQsSUFBSTRKLFVBQUo7QUFBZTlKLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLDJDQUFaLEVBQXdEO0FBQUM2SixZQUFVLENBQUM1SixDQUFELEVBQUc7QUFBQzRKLGNBQVUsR0FBQzVKLENBQVg7QUFBYTs7QUFBNUIsQ0FBeEQsRUFBc0YsQ0FBdEY7QUFBeUYsSUFBSXVYLDJCQUFKO0FBQWdDelgsTUFBTSxDQUFDQyxJQUFQLENBQVksZ0RBQVosRUFBNkQ7QUFBQ3dYLDZCQUEyQixDQUFDdlgsQ0FBRCxFQUFHO0FBQUN1WCwrQkFBMkIsR0FBQ3ZYLENBQTVCO0FBQThCOztBQUE5RCxDQUE3RCxFQUE2SCxDQUE3SDtBQUtwUixNQUFNd1gsY0FBYyxHQUFHLElBQUlsVixZQUFKLENBQWlCO0FBQ3RDK0MsTUFBSSxFQUFFO0FBQ0o1QixRQUFJLEVBQUVDLE1BREY7QUFFSkMsU0FBSyxFQUFFckIsWUFBWSxDQUFDc0IsS0FBYixDQUFtQmdJO0FBRnRCLEdBRGdDO0FBS3RDWCxJQUFFLEVBQUU7QUFDRnhILFFBQUksRUFBRUMsTUFESjtBQUVGQyxTQUFLLEVBQUVyQixZQUFZLENBQUNzQixLQUFiLENBQW1CZ0k7QUFGeEIsR0FMa0M7QUFTdENWLFNBQU8sRUFBRTtBQUNQekgsUUFBSSxFQUFFQztBQURDLEdBVDZCO0FBWXRDeUgsU0FBTyxFQUFFO0FBQ1AxSCxRQUFJLEVBQUVDO0FBREMsR0FaNkI7QUFldEMwSCxZQUFVLEVBQUU7QUFDVjNILFFBQUksRUFBRUMsTUFESTtBQUVWQyxTQUFLLEVBQUVyQixZQUFZLENBQUNzQixLQUFiLENBQW1CZ0k7QUFGaEI7QUFmMEIsQ0FBakIsQ0FBdkI7O0FBcUJBLE1BQU02TCxRQUFRLEdBQUlDLElBQUQsSUFBVTtBQUN6QixNQUFJO0FBRUZBLFFBQUksQ0FBQ3JTLElBQUwsR0FBWWtTLDJCQUFaO0FBRUEsVUFBTUksT0FBTyxHQUFHRCxJQUFoQjtBQUNBOU4sY0FBVSxDQUFDLDBCQUFELEVBQTRCO0FBQUNxQixRQUFFLEVBQUN5TSxJQUFJLENBQUN6TSxFQUFUO0FBQWFDLGFBQU8sRUFBQ3dNLElBQUksQ0FBQ3hNO0FBQTFCLEtBQTVCLENBQVY7QUFDQXNNLGtCQUFjLENBQUNuVyxRQUFmLENBQXdCc1csT0FBeEIsRUFORSxDQU9GOztBQUNBL0wsU0FBSyxDQUFDZ00sSUFBTixDQUFXO0FBQ1R2UyxVQUFJLEVBQUVxUyxJQUFJLENBQUNyUyxJQURGO0FBRVQ0RixRQUFFLEVBQUV5TSxJQUFJLENBQUN6TSxFQUZBO0FBR1RDLGFBQU8sRUFBRXdNLElBQUksQ0FBQ3hNLE9BSEw7QUFJVDJNLFVBQUksRUFBRUgsSUFBSSxDQUFDdk0sT0FKRjtBQUtUMk0sYUFBTyxFQUFFO0FBQ1AsdUJBQWVKLElBQUksQ0FBQ3RNO0FBRGI7QUFMQSxLQUFYO0FBVUQsR0FsQkQsQ0FrQkUsT0FBT3ZDLFNBQVAsRUFBa0I7QUFDbEIsVUFBTSxJQUFJaEosTUFBTSxDQUFDOEIsS0FBWCxDQUFpQix1QkFBakIsRUFBMENrSCxTQUExQyxDQUFOO0FBQ0Q7QUFDRixDQXRCRDs7QUExQkEvSSxNQUFNLENBQUNnSixhQUFQLENBa0RlMk8sUUFsRGYsRTs7Ozs7Ozs7Ozs7QUNBQSxJQUFJNVgsTUFBSjtBQUFXQyxNQUFNLENBQUNDLElBQVAsQ0FBWSxlQUFaLEVBQTRCO0FBQUNGLFFBQU0sQ0FBQ0csQ0FBRCxFQUFHO0FBQUNILFVBQU0sR0FBQ0csQ0FBUDtBQUFTOztBQUFwQixDQUE1QixFQUFrRCxDQUFsRDtBQUFxRCxJQUFJK1gsR0FBSjtBQUFRalksTUFBTSxDQUFDQyxJQUFQLENBQVksOEJBQVosRUFBMkM7QUFBQ2dZLEtBQUcsQ0FBQy9YLENBQUQsRUFBRztBQUFDK1gsT0FBRyxHQUFDL1gsQ0FBSjtBQUFNOztBQUFkLENBQTNDLEVBQTJELENBQTNEO0FBQThELElBQUlnWSxjQUFKO0FBQW1CbFksTUFBTSxDQUFDQyxJQUFQLENBQVksMkNBQVosRUFBd0Q7QUFBQ2lZLGdCQUFjLENBQUNoWSxDQUFELEVBQUc7QUFBQ2dZLGtCQUFjLEdBQUNoWSxDQUFmO0FBQWlCOztBQUFwQyxDQUF4RCxFQUE4RixDQUE5Rjs7QUFJekosTUFBTWlZLG9DQUFvQyxHQUFHLE1BQU07QUFDakQsTUFBSTtBQUNGLFVBQU1oSixHQUFHLEdBQUcsSUFBSThJLEdBQUosQ0FBUUMsY0FBUixFQUF3QixxQkFBeEIsRUFBK0MsRUFBL0MsQ0FBWjtBQUNBL0ksT0FBRyxDQUFDaUosS0FBSixDQUFVO0FBQUNDLGFBQU8sRUFBRSxFQUFWO0FBQWNDLFVBQUksRUFBRSxLQUFHO0FBQXZCLEtBQVYsRUFBeUNDLElBQXpDLENBQThDO0FBQUNDLG1CQUFhLEVBQUU7QUFBaEIsS0FBOUM7QUFDRCxHQUhELENBR0UsT0FBT3pQLFNBQVAsRUFBa0I7QUFDbEIsVUFBTSxJQUFJaEosTUFBTSxDQUFDOEIsS0FBWCxDQUFpQixrREFBakIsRUFBcUVrSCxTQUFyRSxDQUFOO0FBQ0Q7QUFDRixDQVBEOztBQUpBL0ksTUFBTSxDQUFDZ0osYUFBUCxDQWFlbVAsb0NBYmYsRTs7Ozs7Ozs7Ozs7QUNBQSxJQUFJcFksTUFBSjtBQUFXQyxNQUFNLENBQUNDLElBQVAsQ0FBWSxlQUFaLEVBQTRCO0FBQUNGLFFBQU0sQ0FBQ0csQ0FBRCxFQUFHO0FBQUNILFVBQU0sR0FBQ0csQ0FBUDtBQUFTOztBQUFwQixDQUE1QixFQUFrRCxDQUFsRDtBQUFxRCxJQUFJc0MsWUFBSjtBQUFpQnhDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGNBQVosRUFBMkI7QUFBQ21CLFNBQU8sQ0FBQ2xCLENBQUQsRUFBRztBQUFDc0MsZ0JBQVksR0FBQ3RDLENBQWI7QUFBZTs7QUFBM0IsQ0FBM0IsRUFBd0QsQ0FBeEQ7QUFBMkQsSUFBSStYLEdBQUo7QUFBUWpZLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLDhCQUFaLEVBQTJDO0FBQUNnWSxLQUFHLENBQUMvWCxDQUFELEVBQUc7QUFBQytYLE9BQUcsR0FBQy9YLENBQUo7QUFBTTs7QUFBZCxDQUEzQyxFQUEyRCxDQUEzRDtBQUE4RCxJQUFJdVksUUFBSjtBQUFhelksTUFBTSxDQUFDQyxJQUFQLENBQVkscUNBQVosRUFBa0Q7QUFBQ3dZLFVBQVEsQ0FBQ3ZZLENBQUQsRUFBRztBQUFDdVksWUFBUSxHQUFDdlksQ0FBVDtBQUFXOztBQUF4QixDQUFsRCxFQUE0RSxDQUE1RTtBQUsvTixNQUFNd1ksNEJBQTRCLEdBQUcsSUFBSWxXLFlBQUosQ0FBaUI7QUFDcERsQixNQUFJLEVBQUU7QUFDSnFDLFFBQUksRUFBRUM7QUFERixHQUQ4QztBQUlwRHFHLFFBQU0sRUFBRTtBQUNOdEcsUUFBSSxFQUFFQztBQURBO0FBSjRDLENBQWpCLENBQXJDOztBQVNBLE1BQU1pSyxzQkFBc0IsR0FBSWxNLElBQUQsSUFBVTtBQUN2QyxNQUFJO0FBQ0YsVUFBTTZGLE9BQU8sR0FBRzdGLElBQWhCO0FBQ0ErVyxnQ0FBNEIsQ0FBQ25YLFFBQTdCLENBQXNDaUcsT0FBdEM7QUFDQSxVQUFNMkgsR0FBRyxHQUFHLElBQUk4SSxHQUFKLENBQVFRLFFBQVIsRUFBa0Isa0JBQWxCLEVBQXNDalIsT0FBdEMsQ0FBWjtBQUNBMkgsT0FBRyxDQUFDaUosS0FBSixDQUFVO0FBQUNDLGFBQU8sRUFBRSxDQUFWO0FBQWFDLFVBQUksRUFBRSxJQUFFLEVBQUYsR0FBSztBQUF4QixLQUFWLEVBQTBDQyxJQUExQyxHQUpFLENBSWdEO0FBQ25ELEdBTEQsQ0FLRSxPQUFPeFAsU0FBUCxFQUFrQjtBQUNsQixVQUFNLElBQUloSixNQUFNLENBQUM4QixLQUFYLENBQWlCLG9DQUFqQixFQUF1RGtILFNBQXZELENBQU47QUFDRDtBQUNGLENBVEQ7O0FBZEEvSSxNQUFNLENBQUNnSixhQUFQLENBeUJlNkUsc0JBekJmLEU7Ozs7Ozs7Ozs7O0FDQUEsSUFBSTlOLE1BQUo7QUFBV0MsTUFBTSxDQUFDQyxJQUFQLENBQVksZUFBWixFQUE0QjtBQUFDRixRQUFNLENBQUNHLENBQUQsRUFBRztBQUFDSCxVQUFNLEdBQUNHLENBQVA7QUFBUzs7QUFBcEIsQ0FBNUIsRUFBa0QsQ0FBbEQ7QUFBcUQsSUFBSStYLEdBQUo7QUFBUWpZLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLDhCQUFaLEVBQTJDO0FBQUNnWSxLQUFHLENBQUMvWCxDQUFELEVBQUc7QUFBQytYLE9BQUcsR0FBQy9YLENBQUo7QUFBTTs7QUFBZCxDQUEzQyxFQUEyRCxDQUEzRDtBQUE4RCxJQUFJc0MsWUFBSjtBQUFpQnhDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGNBQVosRUFBMkI7QUFBQ21CLFNBQU8sQ0FBQ2xCLENBQUQsRUFBRztBQUFDc0MsZ0JBQVksR0FBQ3RDLENBQWI7QUFBZTs7QUFBM0IsQ0FBM0IsRUFBd0QsQ0FBeEQ7QUFBMkQsSUFBSWdZLGNBQUo7QUFBbUJsWSxNQUFNLENBQUNDLElBQVAsQ0FBWSwyQ0FBWixFQUF3RDtBQUFDaVksZ0JBQWMsQ0FBQ2hZLENBQUQsRUFBRztBQUFDZ1ksa0JBQWMsR0FBQ2hZLENBQWY7QUFBaUI7O0FBQXBDLENBQXhELEVBQThGLENBQTlGO0FBS3JPLE1BQU15WSw0QkFBNEIsR0FBRyxJQUFJblcsWUFBSixDQUFpQjtBQUNwRDRCLFFBQU0sRUFBRTtBQUNOVCxRQUFJLEVBQUVDO0FBREEsR0FENEM7QUFJcER3RyxXQUFTLEVBQUU7QUFDVHpHLFFBQUksRUFBRUM7QUFERyxHQUp5QztBQU9wRHFRLFVBQVEsRUFBRTtBQUNSdFEsUUFBSSxFQUFFQyxNQURFO0FBRVJJLFlBQVEsRUFBQztBQUZELEdBUDBDO0FBV3BEaUcsUUFBTSxFQUFFO0FBQ050RyxRQUFJLEVBQUVDO0FBREEsR0FYNEM7QUFjcERzUSxTQUFPLEVBQUU7QUFDUHZRLFFBQUksRUFBRVQ7QUFEQztBQWQyQyxDQUFqQixDQUFyQzs7QUFtQkEsTUFBTWlULHNCQUFzQixHQUFJeFAsS0FBRCxJQUFXO0FBQ3hDLE1BQUk7QUFDRixVQUFNdUgsUUFBUSxHQUFHdkgsS0FBakI7QUFDQWdTLGdDQUE0QixDQUFDcFgsUUFBN0IsQ0FBc0MyTSxRQUF0QztBQUNBLFVBQU1pQixHQUFHLEdBQUcsSUFBSThJLEdBQUosQ0FBUUMsY0FBUixFQUF3QixRQUF4QixFQUFrQ2hLLFFBQWxDLENBQVo7QUFDQWlCLE9BQUcsQ0FBQ2lKLEtBQUosQ0FBVTtBQUFDQyxhQUFPLEVBQUUsRUFBVjtBQUFjQyxVQUFJLEVBQUUsSUFBRSxFQUFGLEdBQUs7QUFBekIsS0FBVixFQUEyQ0MsSUFBM0MsR0FKRSxDQUlpRDtBQUNwRCxHQUxELENBS0UsT0FBT3hQLFNBQVAsRUFBa0I7QUFDbEIsVUFBTSxJQUFJaEosTUFBTSxDQUFDOEIsS0FBWCxDQUFpQixvQ0FBakIsRUFBdURrSCxTQUF2RCxDQUFOO0FBQ0Q7QUFDRixDQVREOztBQXhCQS9JLE1BQU0sQ0FBQ2dKLGFBQVAsQ0FtQ2VtTixzQkFuQ2YsRTs7Ozs7Ozs7Ozs7QUNBQSxJQUFJcFcsTUFBSjtBQUFXQyxNQUFNLENBQUNDLElBQVAsQ0FBWSxlQUFaLEVBQTRCO0FBQUNGLFFBQU0sQ0FBQ0csQ0FBRCxFQUFHO0FBQUNILFVBQU0sR0FBQ0csQ0FBUDtBQUFTOztBQUFwQixDQUE1QixFQUFrRCxDQUFsRDtBQUFxRCxJQUFJK1gsR0FBSjtBQUFRalksTUFBTSxDQUFDQyxJQUFQLENBQVksOEJBQVosRUFBMkM7QUFBQ2dZLEtBQUcsQ0FBQy9YLENBQUQsRUFBRztBQUFDK1gsT0FBRyxHQUFDL1gsQ0FBSjtBQUFNOztBQUFkLENBQTNDLEVBQTJELENBQTNEO0FBQThELElBQUlzQyxZQUFKO0FBQWlCeEMsTUFBTSxDQUFDQyxJQUFQLENBQVksY0FBWixFQUEyQjtBQUFDbUIsU0FBTyxDQUFDbEIsQ0FBRCxFQUFHO0FBQUNzQyxnQkFBWSxHQUFDdEMsQ0FBYjtBQUFlOztBQUEzQixDQUEzQixFQUF3RCxDQUF4RDtBQUEyRCxJQUFJMFksUUFBSjtBQUFhNVksTUFBTSxDQUFDQyxJQUFQLENBQVkscUNBQVosRUFBa0Q7QUFBQzJZLFVBQVEsQ0FBQzFZLENBQUQsRUFBRztBQUFDMFksWUFBUSxHQUFDMVksQ0FBVDtBQUFXOztBQUF4QixDQUFsRCxFQUE0RSxDQUE1RTtBQUsvTixNQUFNMlksb0JBQW9CLEdBQUcsSUFBSXJXLFlBQUosQ0FBaUI7QUFDNUM7Ozs7QUFJQTJJLElBQUUsRUFBRTtBQUNGeEgsUUFBSSxFQUFFQyxNQURKO0FBRUZDLFNBQUssRUFBRXJCLFlBQVksQ0FBQ3NCLEtBQWIsQ0FBbUJnSTtBQUZ4QixHQUx3QztBQVM1Q1YsU0FBTyxFQUFFO0FBQ1B6SCxRQUFJLEVBQUVDO0FBREMsR0FUbUM7QUFZNUN5SCxTQUFPLEVBQUU7QUFDUDFILFFBQUksRUFBRUM7QUFEQyxHQVptQztBQWU1QzBILFlBQVUsRUFBRTtBQUNWM0gsUUFBSSxFQUFFQyxNQURJO0FBRVZDLFNBQUssRUFBRXJCLFlBQVksQ0FBQ3NCLEtBQWIsQ0FBbUJnSTtBQUZoQjtBQWZnQyxDQUFqQixDQUE3Qjs7QUFxQkEsTUFBTWpDLGNBQWMsR0FBSStOLElBQUQsSUFBVTtBQUMvQixNQUFJO0FBQ0YsVUFBTUMsT0FBTyxHQUFHRCxJQUFoQjtBQUNBaUIsd0JBQW9CLENBQUN0WCxRQUFyQixDQUE4QnNXLE9BQTlCO0FBQ0EsVUFBTTFJLEdBQUcsR0FBRyxJQUFJOEksR0FBSixDQUFRVyxRQUFSLEVBQWtCLE1BQWxCLEVBQTBCZixPQUExQixDQUFaO0FBQ0ExSSxPQUFHLENBQUNpSixLQUFKLENBQVU7QUFBQ0MsYUFBTyxFQUFFLENBQVY7QUFBYUMsVUFBSSxFQUFFLEtBQUc7QUFBdEIsS0FBVixFQUF3Q0MsSUFBeEM7QUFDRCxHQUxELENBS0UsT0FBT3hQLFNBQVAsRUFBa0I7QUFDbEIsVUFBTSxJQUFJaEosTUFBTSxDQUFDOEIsS0FBWCxDQUFpQiw0QkFBakIsRUFBK0NrSCxTQUEvQyxDQUFOO0FBQ0Q7QUFDRixDQVREOztBQTFCQS9JLE1BQU0sQ0FBQ2dKLGFBQVAsQ0FxQ2VhLGNBckNmLEU7Ozs7Ozs7Ozs7O0FDQUEsSUFBSTlKLE1BQUo7QUFBV0MsTUFBTSxDQUFDQyxJQUFQLENBQVksZUFBWixFQUE0QjtBQUFDRixRQUFNLENBQUNHLENBQUQsRUFBRztBQUFDSCxVQUFNLEdBQUNHLENBQVA7QUFBUzs7QUFBcEIsQ0FBNUIsRUFBa0QsQ0FBbEQ7QUFBcUQsSUFBSXNDLFlBQUo7QUFBaUJ4QyxNQUFNLENBQUNDLElBQVAsQ0FBWSxjQUFaLEVBQTJCO0FBQUNtQixTQUFPLENBQUNsQixDQUFELEVBQUc7QUFBQ3NDLGdCQUFZLEdBQUN0QyxDQUFiO0FBQWU7O0FBQTNCLENBQTNCLEVBQXdELENBQXhEO0FBQTJELElBQUkrWCxHQUFKO0FBQVFqWSxNQUFNLENBQUNDLElBQVAsQ0FBWSw4QkFBWixFQUEyQztBQUFDZ1ksS0FBRyxDQUFDL1gsQ0FBRCxFQUFHO0FBQUMrWCxPQUFHLEdBQUMvWCxDQUFKO0FBQU07O0FBQWQsQ0FBM0MsRUFBMkQsQ0FBM0Q7QUFBOEQsSUFBSWdZLGNBQUo7QUFBbUJsWSxNQUFNLENBQUNDLElBQVAsQ0FBWSwyQ0FBWixFQUF3RDtBQUFDaVksZ0JBQWMsQ0FBQ2hZLENBQUQsRUFBRztBQUFDZ1ksa0JBQWMsR0FBQ2hZLENBQWY7QUFBaUI7O0FBQXBDLENBQXhELEVBQThGLENBQTlGO0FBS3JPLE1BQU00WSw0QkFBNEIsR0FBRyxJQUFJdFcsWUFBSixDQUFpQjtBQUNwRDRCLFFBQU0sRUFBRTtBQUNOVCxRQUFJLEVBQUVDO0FBREEsR0FENEM7QUFJcERnRCxPQUFLLEVBQUU7QUFDTGpELFFBQUksRUFBRUM7QUFERCxHQUo2QztBQU9wRGdSLGFBQVcsRUFBRTtBQUNYalIsUUFBSSxFQUFFQztBQURLLEdBUHVDO0FBVXBEK1EsTUFBSSxFQUFFO0FBQ0ZoUixRQUFJLEVBQUVDO0FBREo7QUFWOEMsQ0FBakIsQ0FBckM7O0FBZUEsTUFBTW1WLHNCQUFzQixHQUFJcFMsS0FBRCxJQUFXO0FBQ3hDLE1BQUk7QUFDRixVQUFNdUgsUUFBUSxHQUFHdkgsS0FBakI7QUFDQW1TLGdDQUE0QixDQUFDdlgsUUFBN0IsQ0FBc0MyTSxRQUF0QztBQUNBLFVBQU1pQixHQUFHLEdBQUcsSUFBSThJLEdBQUosQ0FBUUMsY0FBUixFQUF3QixRQUF4QixFQUFrQ2hLLFFBQWxDLENBQVo7QUFDQWlCLE9BQUcsQ0FBQ2lKLEtBQUosQ0FBVTtBQUFDQyxhQUFPLEVBQUUsR0FBVjtBQUFlQyxVQUFJLEVBQUUsSUFBRSxFQUFGLEdBQUs7QUFBMUIsS0FBVixFQUE0Q0MsSUFBNUM7QUFDRCxHQUxELENBS0UsT0FBT3hQLFNBQVAsRUFBa0I7QUFDbEIsVUFBTSxJQUFJaEosTUFBTSxDQUFDOEIsS0FBWCxDQUFpQixvQ0FBakIsRUFBdURrSCxTQUF2RCxDQUFOO0FBQ0Q7QUFDRixDQVREOztBQXBCQS9JLE1BQU0sQ0FBQ2dKLGFBQVAsQ0ErQmUrUCxzQkEvQmYsRTs7Ozs7Ozs7Ozs7QUNBQSxJQUFJaFosTUFBSjtBQUFXQyxNQUFNLENBQUNDLElBQVAsQ0FBWSxlQUFaLEVBQTRCO0FBQUNGLFFBQU0sQ0FBQ0csQ0FBRCxFQUFHO0FBQUNILFVBQU0sR0FBQ0csQ0FBUDtBQUFTOztBQUFwQixDQUE1QixFQUFrRCxDQUFsRDtBQUFxRCxJQUFJYSxJQUFKO0FBQVNmLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLHNCQUFaLEVBQW1DO0FBQUNtQixTQUFPLENBQUNsQixDQUFELEVBQUc7QUFBQ2EsUUFBSSxHQUFDYixDQUFMO0FBQU87O0FBQW5CLENBQW5DLEVBQXdELENBQXhEOztBQUd6RTtBQUNBO0FBQ0E7QUFDQSxNQUFNa0gsWUFBWSxHQUFHLE1BQU07QUFDekIsTUFBSTtBQUNGLFdBQU9yRyxJQUFJLENBQUNxRyxZQUFMLEVBQVA7QUFDRCxHQUZELENBRUUsT0FBTzJCLFNBQVAsRUFBa0I7QUFDbEIsVUFBTSxJQUFJaEosTUFBTSxDQUFDOEIsS0FBWCxDQUFpQix5QkFBakIsRUFBNENrSCxTQUE1QyxDQUFOO0FBQ0Q7QUFDRixDQU5EOztBQU5BL0ksTUFBTSxDQUFDZ0osYUFBUCxDQWNlNUIsWUFkZixFOzs7Ozs7Ozs7OztBQ0FBLElBQUlySCxNQUFKO0FBQVdDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGVBQVosRUFBNEI7QUFBQ0YsUUFBTSxDQUFDRyxDQUFELEVBQUc7QUFBQ0gsVUFBTSxHQUFDRyxDQUFQO0FBQVM7O0FBQXBCLENBQTVCLEVBQWtELENBQWxEO0FBQXFELElBQUlzQyxZQUFKO0FBQWlCeEMsTUFBTSxDQUFDQyxJQUFQLENBQVksY0FBWixFQUEyQjtBQUFDbUIsU0FBTyxDQUFDbEIsQ0FBRCxFQUFHO0FBQUNzQyxnQkFBWSxHQUFDdEMsQ0FBYjtBQUFlOztBQUEzQixDQUEzQixFQUF3RCxDQUF4RDtBQUEyRCxJQUFJb0gsSUFBSjtBQUFTdEgsTUFBTSxDQUFDQyxJQUFQLENBQVksMkJBQVosRUFBd0M7QUFBQ3FILE1BQUksQ0FBQ3BILENBQUQsRUFBRztBQUFDb0gsUUFBSSxHQUFDcEgsQ0FBTDtBQUFPOztBQUFoQixDQUF4QyxFQUEwRCxDQUExRDtBQUlySixNQUFNOFkscUJBQXFCLEdBQUcsSUFBSXhXLFlBQUosQ0FBaUI7QUFDN0NpRixLQUFHLEVBQUU7QUFDSDlELFFBQUksRUFBRUM7QUFESCxHQUR3QztBQUk3Q2dELE9BQUssRUFBRTtBQUNMakQsUUFBSSxFQUFFQztBQUREO0FBSnNDLENBQWpCLENBQTlCOztBQVNBLE1BQU1rTCxlQUFlLEdBQUluTixJQUFELElBQVU7QUFDaEMsTUFBSTtBQUNGLFVBQU02RixPQUFPLEdBQUc3RixJQUFoQjtBQUNBcVgseUJBQXFCLENBQUN6WCxRQUF0QixDQUErQmlHLE9BQS9CO0FBQ0EsVUFBTXlSLElBQUksR0FBRzNSLElBQUksQ0FBQ3FELE9BQUwsQ0FBYTtBQUFDbEQsU0FBRyxFQUFFRCxPQUFPLENBQUNDO0FBQWQsS0FBYixDQUFiO0FBQ0EsUUFBR3dSLElBQUksS0FBS3hRLFNBQVosRUFBdUJuQixJQUFJLENBQUNsRSxNQUFMLENBQVk7QUFBQ00sU0FBRyxFQUFHdVYsSUFBSSxDQUFDdlY7QUFBWixLQUFaLEVBQThCO0FBQUN5TixVQUFJLEVBQUU7QUFDMUR2SyxhQUFLLEVBQUVZLE9BQU8sQ0FBQ1o7QUFEMkM7QUFBUCxLQUE5QixFQUF2QixLQUdLLE9BQU9VLElBQUksQ0FBQzNFLE1BQUwsQ0FBWTtBQUN0QjhFLFNBQUcsRUFBRUQsT0FBTyxDQUFDQyxHQURTO0FBRXRCYixXQUFLLEVBQUVZLE9BQU8sQ0FBQ1o7QUFGTyxLQUFaLENBQVA7QUFJTixHQVhELENBV0UsT0FBT21DLFNBQVAsRUFBa0I7QUFDbEIsVUFBTSxJQUFJaEosTUFBTSxDQUFDOEIsS0FBWCxDQUFpQiw0QkFBakIsRUFBK0NrSCxTQUEvQyxDQUFOO0FBQ0Q7QUFDRixDQWZEOztBQWJBL0ksTUFBTSxDQUFDZ0osYUFBUCxDQThCZThGLGVBOUJmLEU7Ozs7Ozs7Ozs7O0FDQUEsSUFBSS9PLE1BQUo7QUFBV0MsTUFBTSxDQUFDQyxJQUFQLENBQVksZUFBWixFQUE0QjtBQUFDRixRQUFNLENBQUNHLENBQUQsRUFBRztBQUFDSCxVQUFNLEdBQUNHLENBQVA7QUFBUzs7QUFBcEIsQ0FBNUIsRUFBa0QsQ0FBbEQ7QUFBcUQsSUFBSXNDLFlBQUo7QUFBaUJ4QyxNQUFNLENBQUNDLElBQVAsQ0FBWSxjQUFaLEVBQTJCO0FBQUNtQixTQUFPLENBQUNsQixDQUFELEVBQUc7QUFBQ3NDLGdCQUFZLEdBQUN0QyxDQUFiO0FBQWU7O0FBQTNCLENBQTNCLEVBQXdELENBQXhEO0FBQTJELElBQUlFLE1BQUo7QUFBV0osTUFBTSxDQUFDQyxJQUFQLENBQVksaUNBQVosRUFBOEM7QUFBQ0csUUFBTSxDQUFDRixDQUFELEVBQUc7QUFBQ0UsVUFBTSxHQUFDRixDQUFQO0FBQVM7O0FBQXBCLENBQTlDLEVBQW9FLENBQXBFO0FBSXZKLE1BQU1nWixjQUFjLEdBQUcsSUFBSTFXLFlBQUosQ0FBaUI7QUFDdENsQixNQUFJLEVBQUU7QUFDSnFDLFFBQUksRUFBRUM7QUFERjtBQURnQyxDQUFqQixDQUF2Qjs7QUFNQSxNQUFNekMsUUFBUSxHQUFJWSxLQUFELElBQVc7QUFDMUIsTUFBSTtBQUNGLFVBQU1jLFFBQVEsR0FBR2QsS0FBakI7QUFDQW1YLGtCQUFjLENBQUMzWCxRQUFmLENBQXdCc0IsUUFBeEI7QUFDQSxVQUFNOEYsTUFBTSxHQUFHdkksTUFBTSxDQUFDTSxJQUFQLENBQVk7QUFBQzBELFlBQU0sRUFBRXZCLFFBQVEsQ0FBQ3ZCO0FBQWxCLEtBQVosRUFBcUM2WCxLQUFyQyxFQUFmO0FBQ0EsUUFBR3hRLE1BQU0sQ0FBQ3dELE1BQVAsR0FBZ0IsQ0FBbkIsRUFBc0IsT0FBT3hELE1BQU0sQ0FBQyxDQUFELENBQU4sQ0FBVWpGLEdBQWpCO0FBQ3RCLFVBQU1nSCxPQUFPLEdBQUd0SyxNQUFNLENBQUN1QyxNQUFQLENBQWM7QUFDNUJ5QixZQUFNLEVBQUV2QixRQUFRLENBQUN2QjtBQURXLEtBQWQsQ0FBaEI7QUFHQSxXQUFPb0osT0FBUDtBQUNELEdBVEQsQ0FTRSxPQUFPM0IsU0FBUCxFQUFrQjtBQUNsQixVQUFNLElBQUloSixNQUFNLENBQUM4QixLQUFYLENBQWlCLHVCQUFqQixFQUEwQ2tILFNBQTFDLENBQU47QUFDRDtBQUNGLENBYkQ7O0FBVkEvSSxNQUFNLENBQUNnSixhQUFQLENBeUJlN0gsUUF6QmYsRTs7Ozs7Ozs7Ozs7QUNBQSxJQUFJcEIsTUFBSjtBQUFXQyxNQUFNLENBQUNDLElBQVAsQ0FBWSxlQUFaLEVBQTRCO0FBQUNGLFFBQU0sQ0FBQ0csQ0FBRCxFQUFHO0FBQUNILFVBQU0sR0FBQ0csQ0FBUDtBQUFTOztBQUFwQixDQUE1QixFQUFrRCxDQUFsRDtBQUFxRCxJQUFJc0MsWUFBSjtBQUFpQnhDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGNBQVosRUFBMkI7QUFBQ21CLFNBQU8sQ0FBQ2xCLENBQUQsRUFBRztBQUFDc0MsZ0JBQVksR0FBQ3RDLENBQWI7QUFBZTs7QUFBM0IsQ0FBM0IsRUFBd0QsQ0FBeEQ7QUFBMkQsSUFBSWtaLFlBQUo7QUFBaUJwWixNQUFNLENBQUNDLElBQVAsQ0FBWSxzQkFBWixFQUFtQztBQUFDbUIsU0FBTyxDQUFDbEIsQ0FBRCxFQUFHO0FBQUNrWixnQkFBWSxHQUFDbFosQ0FBYjtBQUFlOztBQUEzQixDQUFuQyxFQUFnRSxDQUFoRTtBQUFtRSxJQUFJbVosU0FBSjtBQUFjclosTUFBTSxDQUFDQyxJQUFQLENBQVksbUJBQVosRUFBZ0M7QUFBQ21CLFNBQU8sQ0FBQ2xCLENBQUQsRUFBRztBQUFDbVosYUFBUyxHQUFDblosQ0FBVjtBQUFZOztBQUF4QixDQUFoQyxFQUEwRCxDQUExRDtBQUE2RCxJQUFJRSxNQUFKO0FBQVdKLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGlDQUFaLEVBQThDO0FBQUNHLFFBQU0sQ0FBQ0YsQ0FBRCxFQUFHO0FBQUNFLFVBQU0sR0FBQ0YsQ0FBUDtBQUFTOztBQUFwQixDQUE5QyxFQUFvRSxDQUFwRTtBQUF1RSxJQUFJbVcsaUJBQUo7QUFBc0JyVyxNQUFNLENBQUNDLElBQVAsQ0FBWSxvQ0FBWixFQUFpRDtBQUFDbUIsU0FBTyxDQUFDbEIsQ0FBRCxFQUFHO0FBQUNtVyxxQkFBaUIsR0FBQ25XLENBQWxCO0FBQW9COztBQUFoQyxDQUFqRCxFQUFtRixDQUFuRjtBQUFzRixJQUFJNkosUUFBSixFQUFhaEMsT0FBYjtBQUFxQi9ILE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLDJDQUFaLEVBQXdEO0FBQUM4SixVQUFRLENBQUM3SixDQUFELEVBQUc7QUFBQzZKLFlBQVEsR0FBQzdKLENBQVQ7QUFBVyxHQUF4Qjs7QUFBeUI2SCxTQUFPLENBQUM3SCxDQUFELEVBQUc7QUFBQzZILFdBQU8sR0FBQzdILENBQVI7QUFBVTs7QUFBOUMsQ0FBeEQsRUFBd0csQ0FBeEc7QUFTOWYsTUFBTWdaLGNBQWMsR0FBRyxJQUFJMVcsWUFBSixDQUFpQjtBQUN0QzhXLGdCQUFjLEVBQUU7QUFDZDNWLFFBQUksRUFBRUMsTUFEUTtBQUVkQyxTQUFLLEVBQUVyQixZQUFZLENBQUNzQixLQUFiLENBQW1CZ0k7QUFGWixHQURzQjtBQUt0Q3lOLGFBQVcsRUFBRTtBQUNYNVYsUUFBSSxFQUFFQyxNQURLO0FBRVhDLFNBQUssRUFBRXJCLFlBQVksQ0FBQ3NCLEtBQWIsQ0FBbUJnSTtBQUZmLEdBTHlCO0FBU3RDbkssTUFBSSxFQUFFO0FBQ0pnQyxRQUFJLEVBQUVDLE1BREY7QUFFSkksWUFBUSxFQUFFO0FBRk4sR0FUZ0M7QUFhdEN3VixZQUFVLEVBQUU7QUFDUjdWLFFBQUksRUFBRUMsTUFERTtBQUVSSSxZQUFRLEVBQUU7QUFGRixHQWIwQjtBQWlCdENFLE9BQUssRUFBRTtBQUNIUCxRQUFJLEVBQUVuQixZQUFZLENBQUMyQixPQURoQjtBQUVISCxZQUFRLEVBQUU7QUFGUCxHQWpCK0I7QUFxQnRDckQsU0FBTyxFQUFFO0FBQ1BnRCxRQUFJLEVBQUVDLE1BREM7QUFFUEMsU0FBSyxFQUFFckIsWUFBWSxDQUFDc0IsS0FBYixDQUFtQnNFO0FBRm5CO0FBckI2QixDQUFqQixDQUF2Qjs7QUEyQkEsTUFBTWpILFFBQVEsR0FBSVksS0FBRCxJQUFXO0FBQzFCLE1BQUk7QUFDRixVQUFNYyxRQUFRLEdBQUdkLEtBQWpCO0FBQ0FtWCxrQkFBYyxDQUFDM1gsUUFBZixDQUF3QnNCLFFBQXhCO0FBRUEsVUFBTUUsU0FBUyxHQUFHO0FBQ2hCc0QsV0FBSyxFQUFFeEQsUUFBUSxDQUFDeVc7QUFEQSxLQUFsQjtBQUdBLFVBQU1HLFdBQVcsR0FBR0wsWUFBWSxDQUFDclcsU0FBRCxDQUFoQztBQUNBLFVBQU1DLE1BQU0sR0FBRztBQUNicUQsV0FBSyxFQUFFeEQsUUFBUSxDQUFDMFc7QUFESCxLQUFmO0FBR0EsVUFBTUcsUUFBUSxHQUFHTCxTQUFTLENBQUNyVyxNQUFELENBQTFCO0FBRUEsVUFBTTJGLE1BQU0sR0FBR3ZJLE1BQU0sQ0FBQ00sSUFBUCxDQUFZO0FBQUNxQyxlQUFTLEVBQUUwVyxXQUFaO0FBQXlCelcsWUFBTSxFQUFFMFc7QUFBakMsS0FBWixFQUF3RFAsS0FBeEQsRUFBZjtBQUNBLFFBQUd4USxNQUFNLENBQUN3RCxNQUFQLEdBQWdCLENBQW5CLEVBQXNCLE9BQU94RCxNQUFNLENBQUMsQ0FBRCxDQUFOLENBQVVqRixHQUFqQixDQWRwQixDQWMwQzs7QUFFNUMsUUFBR2IsUUFBUSxDQUFDbEIsSUFBVCxLQUFrQjhHLFNBQXJCLEVBQWdDO0FBQzlCLFVBQUk7QUFDRkksWUFBSSxDQUFDdUYsS0FBTCxDQUFXdkwsUUFBUSxDQUFDbEIsSUFBcEI7QUFDRCxPQUZELENBRUUsT0FBTUMsS0FBTixFQUFhO0FBQ2JtSSxnQkFBUSxDQUFDLGdCQUFELEVBQWtCbEgsUUFBUSxDQUFDbEIsSUFBM0IsQ0FBUjtBQUNBLGNBQU0sb0JBQU47QUFDRDtBQUNGOztBQUVELFVBQU0rSSxPQUFPLEdBQUd0SyxNQUFNLENBQUN1QyxNQUFQLENBQWM7QUFDNUJJLGVBQVMsRUFBRTBXLFdBRGlCO0FBRTVCelcsWUFBTSxFQUFFMFcsUUFGb0I7QUFHNUJ4VixXQUFLLEVBQUVyQixRQUFRLENBQUNxQixLQUhZO0FBSTVCSSxlQUFTLEVBQUd6QixRQUFRLENBQUMyVyxVQUpPO0FBSzVCN1gsVUFBSSxFQUFFa0IsUUFBUSxDQUFDbEIsSUFMYTtBQU01QmhCLGFBQU8sRUFBRWtDLFFBQVEsQ0FBQ2xDO0FBTlUsS0FBZCxDQUFoQjtBQVFBb0gsV0FBTyxDQUFDLGtCQUFnQmxGLFFBQVEsQ0FBQ3FCLEtBQXpCLEdBQStCLGlDQUFoQyxFQUFrRXdHLE9BQWxFLENBQVA7QUFFQTJMLHFCQUFpQixDQUFDO0FBQUNqTyxRQUFFLEVBQUVzQztBQUFMLEtBQUQsQ0FBakI7QUFDQSxXQUFPQSxPQUFQO0FBQ0QsR0FyQ0QsQ0FxQ0UsT0FBTzNCLFNBQVAsRUFBa0I7QUFDbEIsVUFBTSxJQUFJaEosTUFBTSxDQUFDOEIsS0FBWCxDQUFpQiwyQ0FBakIsRUFBOERrSCxTQUE5RCxDQUFOO0FBQ0Q7QUFDRixDQXpDRDs7QUFwQ0EvSSxNQUFNLENBQUNnSixhQUFQLENBK0VlN0gsUUEvRWYsRTs7Ozs7Ozs7Ozs7QUNBQSxJQUFJcEIsTUFBSjtBQUFXQyxNQUFNLENBQUNDLElBQVAsQ0FBWSxlQUFaLEVBQTRCO0FBQUNGLFFBQU0sQ0FBQ0csQ0FBRCxFQUFHO0FBQUNILFVBQU0sR0FBQ0csQ0FBUDtBQUFTOztBQUFwQixDQUE1QixFQUFrRCxDQUFsRDtBQUFxRCxJQUFJc0MsWUFBSjtBQUFpQnhDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGNBQVosRUFBMkI7QUFBQ21CLFNBQU8sQ0FBQ2xCLENBQUQsRUFBRztBQUFDc0MsZ0JBQVksR0FBQ3RDLENBQWI7QUFBZTs7QUFBM0IsQ0FBM0IsRUFBd0QsQ0FBeEQ7QUFBMkQsSUFBSW9KLGNBQUosRUFBbUJDLGVBQW5CO0FBQW1DdkosTUFBTSxDQUFDQyxJQUFQLENBQVksbURBQVosRUFBZ0U7QUFBQ3FKLGdCQUFjLENBQUNwSixDQUFELEVBQUc7QUFBQ29KLGtCQUFjLEdBQUNwSixDQUFmO0FBQWlCLEdBQXBDOztBQUFxQ3FKLGlCQUFlLENBQUNySixDQUFELEVBQUc7QUFBQ3FKLG1CQUFlLEdBQUNySixDQUFoQjtBQUFrQjs7QUFBMUUsQ0FBaEUsRUFBNEksQ0FBNUk7QUFBK0ksSUFBSUUsTUFBSjtBQUFXSixNQUFNLENBQUNDLElBQVAsQ0FBWSxpQ0FBWixFQUE4QztBQUFDRyxRQUFNLENBQUNGLENBQUQsRUFBRztBQUFDRSxVQUFNLEdBQUNGLENBQVA7QUFBUzs7QUFBcEIsQ0FBOUMsRUFBb0UsQ0FBcEU7QUFBdUUsSUFBSXVHLGVBQUo7QUFBb0J6RyxNQUFNLENBQUNDLElBQVAsQ0FBWSxrQ0FBWixFQUErQztBQUFDd0csaUJBQWUsQ0FBQ3ZHLENBQUQsRUFBRztBQUFDdUcsbUJBQWUsR0FBQ3ZHLENBQWhCO0FBQWtCOztBQUF0QyxDQUEvQyxFQUF1RixDQUF2RjtBQUEwRixJQUFJc1csYUFBSjtBQUFrQnhXLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLDhCQUFaLEVBQTJDO0FBQUNtQixTQUFPLENBQUNsQixDQUFELEVBQUc7QUFBQ3NXLGlCQUFhLEdBQUN0VyxDQUFkO0FBQWdCOztBQUE1QixDQUEzQyxFQUF5RSxDQUF6RTtBQUE0RSxJQUFJdUosV0FBSjtBQUFnQnpKLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLG9DQUFaLEVBQWlEO0FBQUN3SixhQUFXLENBQUN2SixDQUFELEVBQUc7QUFBQ3VKLGVBQVcsR0FBQ3ZKLENBQVo7QUFBYzs7QUFBOUIsQ0FBakQsRUFBaUYsQ0FBakY7QUFBb0YsSUFBSTZZLHNCQUFKO0FBQTJCL1ksTUFBTSxDQUFDQyxJQUFQLENBQVksa0NBQVosRUFBK0M7QUFBQ21CLFNBQU8sQ0FBQ2xCLENBQUQsRUFBRztBQUFDNlksMEJBQXNCLEdBQUM3WSxDQUF2QjtBQUF5Qjs7QUFBckMsQ0FBL0MsRUFBc0YsQ0FBdEY7QUFBeUYsSUFBSTRKLFVBQUo7QUFBZTlKLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLDJDQUFaLEVBQXdEO0FBQUM2SixZQUFVLENBQUM1SixDQUFELEVBQUc7QUFBQzRKLGNBQVUsR0FBQzVKLENBQVg7QUFBYTs7QUFBNUIsQ0FBeEQsRUFBc0YsQ0FBdEY7QUFVbjBCLE1BQU15WixrQkFBa0IsR0FBRyxJQUFJblgsWUFBSixDQUFpQjtBQUMxQ21TLE1BQUksRUFBRTtBQUNKaFIsUUFBSSxFQUFFQztBQURGLEdBRG9DO0FBSTFDNE8sTUFBSSxFQUFFO0FBQ0o3TyxRQUFJLEVBQUVDO0FBREY7QUFKb0MsQ0FBakIsQ0FBM0I7O0FBU0EsTUFBTWdXLFlBQVksR0FBSUMsT0FBRCxJQUFhO0FBQ2hDLE1BQUk7QUFDRixVQUFNQyxVQUFVLEdBQUdELE9BQW5CO0FBQ0FGLHNCQUFrQixDQUFDcFksUUFBbkIsQ0FBNEJ1WSxVQUE1QjtBQUNBLFVBQU1DLE9BQU8sR0FBR3ZELGFBQWEsQ0FBQztBQUFDaEUsVUFBSSxFQUFFcUgsT0FBTyxDQUFDckg7QUFBZixLQUFELENBQTdCO0FBQ0EsVUFBTXpRLEtBQUssR0FBRzNCLE1BQU0sQ0FBQ3VLLE9BQVAsQ0FBZTtBQUFDakgsU0FBRyxFQUFFcVcsT0FBTyxDQUFDM1I7QUFBZCxLQUFmLENBQWQ7QUFDQSxRQUFHckcsS0FBSyxLQUFLMEcsU0FBVixJQUF1QjFHLEtBQUssQ0FBQzJDLGlCQUFOLEtBQTRCcVYsT0FBTyxDQUFDblAsS0FBOUQsRUFBcUUsTUFBTSxjQUFOO0FBQ3JFLFVBQU1yRyxXQUFXLEdBQUcsSUFBSXJCLElBQUosRUFBcEI7QUFFQTlDLFVBQU0sQ0FBQ2dELE1BQVAsQ0FBYztBQUFDTSxTQUFHLEVBQUczQixLQUFLLENBQUMyQjtBQUFiLEtBQWQsRUFBZ0M7QUFBQ3lOLFVBQUksRUFBQztBQUFDNU0sbUJBQVcsRUFBRUEsV0FBZDtBQUEyQkMsbUJBQVcsRUFBRXNWLFVBQVUsQ0FBQ25GO0FBQW5ELE9BQU47QUFBZ0VxRixZQUFNLEVBQUU7QUFBQ3RWLHlCQUFpQixFQUFFO0FBQXBCO0FBQXhFLEtBQWhDLEVBUkUsQ0FVRjs7QUFDQSxVQUFNdVYsT0FBTyxHQUFHeFQsZUFBZSxDQUFDL0YsSUFBaEIsQ0FBcUI7QUFBQ3daLFNBQUcsRUFBRSxDQUFDO0FBQUM1WSxZQUFJLEVBQUVTLEtBQUssQ0FBQ3FDO0FBQWIsT0FBRCxFQUF1QjtBQUFDRSxpQkFBUyxFQUFFdkMsS0FBSyxDQUFDcUM7QUFBbEIsT0FBdkI7QUFBTixLQUFyQixDQUFoQjtBQUNBLFFBQUc2VixPQUFPLEtBQUt4UixTQUFmLEVBQTBCLE1BQU0sa0NBQU47QUFFMUJ3UixXQUFPLENBQUNsVSxPQUFSLENBQWdCWSxLQUFLLElBQUk7QUFDckJtRCxnQkFBVSxDQUFDLDJCQUFELEVBQTZCbkQsS0FBN0IsQ0FBVjtBQUVBLFlBQU1DLEtBQUssR0FBR2lDLElBQUksQ0FBQ3VGLEtBQUwsQ0FBV3pILEtBQUssQ0FBQ0MsS0FBakIsQ0FBZDtBQUNBa0QsZ0JBQVUsQ0FBQywrQkFBRCxFQUFrQ2xELEtBQWxDLENBQVY7QUFFQSxZQUFNdVQsWUFBWSxHQUFHMVEsV0FBVyxDQUFDSCxjQUFELEVBQWlCQyxlQUFqQixFQUFrQzNDLEtBQUssQ0FBQ3dELFNBQXhDLENBQWhDO0FBQ0FOLGdCQUFVLENBQUMsbUJBQUQsRUFBcUJxUSxZQUFyQixDQUFWO0FBQ0EsWUFBTXZGLFdBQVcsR0FBR2hPLEtBQUssQ0FBQ3JCLElBQTFCO0FBRUEsYUFBT3FCLEtBQUssQ0FBQ3JCLElBQWI7QUFDQXFCLFdBQUssQ0FBQ3dULFlBQU4sR0FBcUI3VixXQUFXLENBQUM4VixXQUFaLEVBQXJCO0FBQ0F6VCxXQUFLLENBQUN1VCxZQUFOLEdBQXFCQSxZQUFyQjtBQUNBLFlBQU1HLFNBQVMsR0FBR3pSLElBQUksQ0FBQ0MsU0FBTCxDQUFlbEMsS0FBZixDQUFsQjtBQUNBa0QsZ0JBQVUsQ0FBQyw4QkFBNEIvSCxLQUFLLENBQUNxQyxNQUFsQyxHQUF5QyxjQUExQyxFQUF5RGtXLFNBQXpELENBQVY7QUFFQXZCLDRCQUFzQixDQUFDO0FBQ25CM1UsY0FBTSxFQUFFdUMsS0FBSyxDQUFDckYsSUFESztBQUVuQnNGLGFBQUssRUFBRTBULFNBRlk7QUFHbkIxRixtQkFBVyxFQUFFQSxXQUhNO0FBSW5CRCxZQUFJLEVBQUVtRixVQUFVLENBQUNuRjtBQUpFLE9BQUQsQ0FBdEI7QUFNSCxLQXRCRDtBQXVCQTdLLGNBQVUsQ0FBQyxzQkFBRCxFQUF3QmlRLE9BQU8sQ0FBQ2pQLFFBQWhDLENBQVY7QUFDQSxXQUFPaVAsT0FBTyxDQUFDalAsUUFBZjtBQUNELEdBdkNELENBdUNFLE9BQU8vQixTQUFQLEVBQWtCO0FBQ2xCLFVBQU0sSUFBSWhKLE1BQU0sQ0FBQzhCLEtBQVgsQ0FBaUIsMkJBQWpCLEVBQThDa0gsU0FBOUMsQ0FBTjtBQUNEO0FBQ0YsQ0EzQ0Q7O0FBbkJBL0ksTUFBTSxDQUFDZ0osYUFBUCxDQWdFZTRRLFlBaEVmLEU7Ozs7Ozs7Ozs7O0FDQUEsSUFBSTdaLE1BQUo7QUFBV0MsTUFBTSxDQUFDQyxJQUFQLENBQVksZUFBWixFQUE0QjtBQUFDRixRQUFNLENBQUNHLENBQUQsRUFBRztBQUFDSCxVQUFNLEdBQUNHLENBQVA7QUFBUzs7QUFBcEIsQ0FBNUIsRUFBa0QsQ0FBbEQ7QUFBcUQsSUFBSXNDLFlBQUo7QUFBaUJ4QyxNQUFNLENBQUNDLElBQVAsQ0FBWSxjQUFaLEVBQTJCO0FBQUNtQixTQUFPLENBQUNsQixDQUFELEVBQUc7QUFBQ3NDLGdCQUFZLEdBQUN0QyxDQUFiO0FBQWU7O0FBQTNCLENBQTNCLEVBQXdELENBQXhEO0FBQTJELElBQUl1UyxXQUFKO0FBQWdCelMsTUFBTSxDQUFDQyxJQUFQLENBQVksUUFBWixFQUFxQjtBQUFDd1MsYUFBVyxDQUFDdlMsQ0FBRCxFQUFHO0FBQUN1UyxlQUFXLEdBQUN2UyxDQUFaO0FBQWM7O0FBQTlCLENBQXJCLEVBQXFELENBQXJEO0FBQXdELElBQUlFLE1BQUo7QUFBV0osTUFBTSxDQUFDQyxJQUFQLENBQVksaUNBQVosRUFBOEM7QUFBQ0csUUFBTSxDQUFDRixDQUFELEVBQUc7QUFBQ0UsVUFBTSxHQUFDRixDQUFQO0FBQVM7O0FBQXBCLENBQTlDLEVBQW9FLENBQXBFO0FBSy9OLE1BQU1xYSxzQkFBc0IsR0FBRyxJQUFJL1gsWUFBSixDQUFpQjtBQUM5QzRGLElBQUUsRUFBRTtBQUNGekUsUUFBSSxFQUFFQztBQURKO0FBRDBDLENBQWpCLENBQS9COztBQU1BLE1BQU0rRixnQkFBZ0IsR0FBSTVILEtBQUQsSUFBVztBQUNsQyxNQUFJO0FBQ0YsVUFBTWMsUUFBUSxHQUFHZCxLQUFqQjtBQUNBd1ksMEJBQXNCLENBQUNoWixRQUF2QixDQUFnQ3NCLFFBQWhDO0FBQ0EsVUFBTStILEtBQUssR0FBRzZILFdBQVcsQ0FBQyxFQUFELENBQVgsQ0FBZ0I1QixRQUFoQixDQUF5QixLQUF6QixDQUFkO0FBQ0F6USxVQUFNLENBQUNnRCxNQUFQLENBQWM7QUFBQ00sU0FBRyxFQUFHYixRQUFRLENBQUN1RjtBQUFoQixLQUFkLEVBQWtDO0FBQUMrSSxVQUFJLEVBQUM7QUFBQ3pNLHlCQUFpQixFQUFFa0c7QUFBcEI7QUFBTixLQUFsQztBQUNBLFdBQU9BLEtBQVA7QUFDRCxHQU5ELENBTUUsT0FBTzdCLFNBQVAsRUFBa0I7QUFDbEIsVUFBTSxJQUFJaEosTUFBTSxDQUFDOEIsS0FBWCxDQUFpQixzQ0FBakIsRUFBeURrSCxTQUF6RCxDQUFOO0FBQ0Q7QUFDRixDQVZEOztBQVhBL0ksTUFBTSxDQUFDZ0osYUFBUCxDQXVCZVcsZ0JBdkJmLEU7Ozs7Ozs7Ozs7O0FDQUEsSUFBSTVKLE1BQUo7QUFBV0MsTUFBTSxDQUFDQyxJQUFQLENBQVksZUFBWixFQUE0QjtBQUFDRixRQUFNLENBQUNHLENBQUQsRUFBRztBQUFDSCxVQUFNLEdBQUNHLENBQVA7QUFBUzs7QUFBcEIsQ0FBNUIsRUFBa0QsQ0FBbEQ7QUFBcUQsSUFBSXNDLFlBQUo7QUFBaUJ4QyxNQUFNLENBQUNDLElBQVAsQ0FBWSxjQUFaLEVBQTJCO0FBQUNtQixTQUFPLENBQUNsQixDQUFELEVBQUc7QUFBQ3NDLGdCQUFZLEdBQUN0QyxDQUFiO0FBQWU7O0FBQTNCLENBQTNCLEVBQXdELENBQXhEO0FBQTJELElBQUlFLE1BQUo7QUFBV0osTUFBTSxDQUFDQyxJQUFQLENBQVksaUNBQVosRUFBOEM7QUFBQ0csUUFBTSxDQUFDRixDQUFELEVBQUc7QUFBQ0UsVUFBTSxHQUFDRixDQUFQO0FBQVM7O0FBQXBCLENBQTlDLEVBQW9FLENBQXBFO0FBQXVFLElBQUkwRSxVQUFKO0FBQWU1RSxNQUFNLENBQUNDLElBQVAsQ0FBWSx1Q0FBWixFQUFvRDtBQUFDMkUsWUFBVSxDQUFDMUUsQ0FBRCxFQUFHO0FBQUMwRSxjQUFVLEdBQUMxRSxDQUFYO0FBQWE7O0FBQTVCLENBQXBELEVBQWtGLENBQWxGO0FBQXFGLElBQUl1TCxlQUFKO0FBQW9CekwsTUFBTSxDQUFDQyxJQUFQLENBQVksaUNBQVosRUFBOEM7QUFBQ21CLFNBQU8sQ0FBQ2xCLENBQUQsRUFBRztBQUFDdUwsbUJBQWUsR0FBQ3ZMLENBQWhCO0FBQWtCOztBQUE5QixDQUE5QyxFQUE4RSxDQUE5RTtBQUFpRixJQUFJNkgsT0FBSjtBQUFZL0gsTUFBTSxDQUFDQyxJQUFQLENBQVksMkNBQVosRUFBd0Q7QUFBQzhILFNBQU8sQ0FBQzdILENBQUQsRUFBRztBQUFDNkgsV0FBTyxHQUFDN0gsQ0FBUjtBQUFVOztBQUF0QixDQUF4RCxFQUFnRixDQUFoRjtBQUFtRixJQUFJa1Qsc0JBQUo7QUFBMkJwVCxNQUFNLENBQUNDLElBQVAsQ0FBWSxpREFBWixFQUE4RDtBQUFDbUIsU0FBTyxDQUFDbEIsQ0FBRCxFQUFHO0FBQUNrVCwwQkFBc0IsR0FBQ2xULENBQXZCO0FBQXlCOztBQUFyQyxDQUE5RCxFQUFxRyxDQUFyRztBQVFqaUIsTUFBTXNhLHVCQUF1QixHQUFHLElBQUloWSxZQUFKLENBQWlCO0FBQy9DNEIsUUFBTSxFQUFFO0FBQ05ULFFBQUksRUFBRUM7QUFEQSxHQUR1QztBQUkvQ3dHLFdBQVMsRUFBRTtBQUNUekcsUUFBSSxFQUFFQztBQURHLEdBSm9DO0FBTy9DK1EsTUFBSSxFQUFFO0FBQ0ZoUixRQUFJLEVBQUVDLE1BREo7QUFFRkksWUFBUSxFQUFFO0FBRlI7QUFQeUMsQ0FBakIsQ0FBaEM7O0FBY0EsTUFBTXlXLGlCQUFpQixHQUFJOVksSUFBRCxJQUFVO0FBQ2xDLE1BQUk7QUFDRixVQUFNNkYsT0FBTyxHQUFHN0YsSUFBaEI7QUFDQW9HLFdBQU8sQ0FBQyw4QkFBRCxFQUFnQ2MsSUFBSSxDQUFDQyxTQUFMLENBQWVuSCxJQUFmLENBQWhDLENBQVA7QUFDQTZZLDJCQUF1QixDQUFDalosUUFBeEIsQ0FBaUNpRyxPQUFqQztBQUNBLFVBQU16RixLQUFLLEdBQUczQixNQUFNLENBQUN1SyxPQUFQLENBQWU7QUFBQ3ZHLFlBQU0sRUFBRW9ELE9BQU8sQ0FBQ3BEO0FBQWpCLEtBQWYsQ0FBZDtBQUNBLFFBQUdyQyxLQUFLLEtBQUswRyxTQUFiLEVBQXdCLE1BQU0sa0JBQU47QUFDeEJWLFdBQU8sQ0FBQyw4QkFBRCxFQUFnQ1AsT0FBTyxDQUFDcEQsTUFBeEMsQ0FBUDtBQUVBLFVBQU1yQixTQUFTLEdBQUc2QixVQUFVLENBQUMrRixPQUFYLENBQW1CO0FBQUNqSCxTQUFHLEVBQUUzQixLQUFLLENBQUNnQjtBQUFaLEtBQW5CLENBQWxCO0FBQ0EsUUFBR0EsU0FBUyxLQUFLMEYsU0FBakIsRUFBNEIsTUFBTSxxQkFBTjtBQUM1QixVQUFNd0QsS0FBSyxHQUFHbEosU0FBUyxDQUFDc0QsS0FBVixDQUFnQjZGLEtBQWhCLENBQXNCLEdBQXRCLENBQWQ7QUFDQSxVQUFNakMsTUFBTSxHQUFHZ0MsS0FBSyxDQUFDQSxLQUFLLENBQUNFLE1BQU4sR0FBYSxDQUFkLENBQXBCO0FBQ0EsVUFBTWdJLG1CQUFtQixHQUFHZixzQkFBc0IsQ0FBQztBQUFDbkosWUFBTSxFQUFDQTtBQUFSLEtBQUQsQ0FBbEQsQ0FaRSxDQWNGOztBQUNBLFFBQUcsQ0FBQ3dCLGVBQWUsQ0FBQztBQUFDakYsZUFBUyxFQUFFMk4sbUJBQW1CLENBQUMzTixTQUFoQztBQUEyQzdFLFVBQUksRUFBRTZGLE9BQU8sQ0FBQ3BELE1BQXpEO0FBQWlFZ0csZUFBUyxFQUFFNUMsT0FBTyxDQUFDNEM7QUFBcEYsS0FBRCxDQUFuQixFQUFxSDtBQUNuSCxZQUFNLGVBQU47QUFDRDs7QUFDRHJDLFdBQU8sQ0FBQywrQkFBRCxFQUFrQ29NLG1CQUFtQixDQUFDM04sU0FBdEQsQ0FBUDtBQUVBcEcsVUFBTSxDQUFDZ0QsTUFBUCxDQUFjO0FBQUNNLFNBQUcsRUFBRzNCLEtBQUssQ0FBQzJCO0FBQWIsS0FBZCxFQUFnQztBQUFDeU4sVUFBSSxFQUFDO0FBQUM1TSxtQkFBVyxFQUFFLElBQUlyQixJQUFKLEVBQWQ7QUFBMEJzQixtQkFBVyxFQUFFZ0QsT0FBTyxDQUFDbU47QUFBL0M7QUFBTixLQUFoQztBQUNELEdBckJELENBcUJFLE9BQU81TCxTQUFQLEVBQWtCO0FBQ2xCLFVBQU0sSUFBSWhKLE1BQU0sQ0FBQzhCLEtBQVgsQ0FBaUIsd0NBQWpCLEVBQTJEa0gsU0FBM0QsQ0FBTjtBQUNEO0FBQ0YsQ0F6QkQ7O0FBdEJBL0ksTUFBTSxDQUFDZ0osYUFBUCxDQWlEZXlSLGlCQWpEZixFOzs7Ozs7Ozs7OztBQ0FBLElBQUkxYSxNQUFKO0FBQVdDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGVBQVosRUFBNEI7QUFBQ0YsUUFBTSxDQUFDRyxDQUFELEVBQUc7QUFBQ0gsVUFBTSxHQUFDRyxDQUFQO0FBQVM7O0FBQXBCLENBQTVCLEVBQWtELENBQWxEO0FBQXFELElBQUlzQyxZQUFKO0FBQWlCeEMsTUFBTSxDQUFDQyxJQUFQLENBQVksY0FBWixFQUEyQjtBQUFDbUIsU0FBTyxDQUFDbEIsQ0FBRCxFQUFHO0FBQUNzQyxnQkFBWSxHQUFDdEMsQ0FBYjtBQUFlOztBQUEzQixDQUEzQixFQUF3RCxDQUF4RDtBQUEyRCxJQUFJd2EsYUFBSjtBQUFrQjFhLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLG1EQUFaLEVBQWdFO0FBQUN5YSxlQUFhLENBQUN4YSxDQUFELEVBQUc7QUFBQ3dhLGlCQUFhLEdBQUN4YSxDQUFkO0FBQWdCOztBQUFsQyxDQUFoRSxFQUFvRyxDQUFwRztBQUF1RyxJQUFJME8sUUFBSjtBQUFhNU8sTUFBTSxDQUFDQyxJQUFQLENBQVksb0NBQVosRUFBaUQ7QUFBQzJPLFVBQVEsQ0FBQzFPLENBQUQsRUFBRztBQUFDME8sWUFBUSxHQUFDMU8sQ0FBVDtBQUFXOztBQUF4QixDQUFqRCxFQUEyRSxDQUEzRTtBQUE4RSxJQUFJcUwsZ0JBQUo7QUFBcUJ2TCxNQUFNLENBQUNDLElBQVAsQ0FBWSwrQkFBWixFQUE0QztBQUFDbUIsU0FBTyxDQUFDbEIsQ0FBRCxFQUFHO0FBQUNxTCxvQkFBZ0IsR0FBQ3JMLENBQWpCO0FBQW1COztBQUEvQixDQUE1QyxFQUE2RSxDQUE3RTtBQUFnRixJQUFJc0wsV0FBSjtBQUFnQnhMLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLDBCQUFaLEVBQXVDO0FBQUNtQixTQUFPLENBQUNsQixDQUFELEVBQUc7QUFBQ3NMLGVBQVcsR0FBQ3RMLENBQVo7QUFBYzs7QUFBMUIsQ0FBdkMsRUFBbUUsQ0FBbkU7QUFBc0UsSUFBSXVMLGVBQUo7QUFBb0J6TCxNQUFNLENBQUNDLElBQVAsQ0FBWSxpQ0FBWixFQUE4QztBQUFDbUIsU0FBTyxDQUFDbEIsQ0FBRCxFQUFHO0FBQUN1TCxtQkFBZSxHQUFDdkwsQ0FBaEI7QUFBa0I7O0FBQTlCLENBQTlDLEVBQThFLENBQTlFO0FBQWlGLElBQUlvVixTQUFKO0FBQWN0VixNQUFNLENBQUNDLElBQVAsQ0FBWSwyQ0FBWixFQUF3RDtBQUFDcVYsV0FBUyxDQUFDcFYsQ0FBRCxFQUFHO0FBQUNvVixhQUFTLEdBQUNwVixDQUFWO0FBQVk7O0FBQTFCLENBQXhELEVBQW9GLENBQXBGO0FBQXVGLElBQUlrVCxzQkFBSjtBQUEyQnBULE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGlEQUFaLEVBQThEO0FBQUNtQixTQUFPLENBQUNsQixDQUFELEVBQUc7QUFBQ2tULDBCQUFzQixHQUFDbFQsQ0FBdkI7QUFBeUI7O0FBQXJDLENBQTlELEVBQXFHLENBQXJHO0FBVWh3QixNQUFNeWEsaUJBQWlCLEdBQUcsSUFBSW5ZLFlBQUosQ0FBaUI7QUFDekM4VyxnQkFBYyxFQUFFO0FBQ2QzVixRQUFJLEVBQUVDLE1BRFE7QUFFZEMsU0FBSyxFQUFFckIsWUFBWSxDQUFDc0IsS0FBYixDQUFtQmdJO0FBRlosR0FEeUI7QUFLekN5TixhQUFXLEVBQUU7QUFDWDVWLFFBQUksRUFBRUMsTUFESztBQUVYQyxTQUFLLEVBQUVyQixZQUFZLENBQUNzQixLQUFiLENBQW1CZ0k7QUFGZixHQUw0QjtBQVN6Q0YsU0FBTyxFQUFFO0FBQ1BqSSxRQUFJLEVBQUVDO0FBREMsR0FUZ0M7QUFZekNnWCxzQkFBb0IsRUFBRTtBQUNwQmpYLFFBQUksRUFBRUM7QUFEYztBQVptQixDQUFqQixDQUExQjs7QUFpQkEsTUFBTWlYLFdBQVcsR0FBSWxaLElBQUQsSUFBVTtBQUM1QixNQUFJO0FBQ0YsVUFBTTZGLE9BQU8sR0FBRzdGLElBQWhCO0FBQ0FnWixxQkFBaUIsQ0FBQ3BaLFFBQWxCLENBQTJCaUcsT0FBM0I7QUFDQSxVQUFNYixLQUFLLEdBQUdpSSxRQUFRLENBQUM4TCxhQUFELEVBQWdCbFQsT0FBTyxDQUFDb0UsT0FBeEIsQ0FBdEI7QUFDQSxRQUFHakYsS0FBSyxLQUFLOEIsU0FBYixFQUF3QixPQUFPLEtBQVA7QUFDeEIsVUFBTXFTLFNBQVMsR0FBR2pTLElBQUksQ0FBQ3VGLEtBQUwsQ0FBV3pILEtBQUssQ0FBQ0MsS0FBakIsQ0FBbEI7QUFDQSxVQUFNbVUsVUFBVSxHQUFHdFAsZUFBZSxDQUFDO0FBQ2pDOUosVUFBSSxFQUFFNkYsT0FBTyxDQUFDOFIsY0FBUixHQUF1QjlSLE9BQU8sQ0FBQytSLFdBREo7QUFFakNuUCxlQUFTLEVBQUUwUSxTQUFTLENBQUMxUSxTQUZZO0FBR2pDNUQsZUFBUyxFQUFFZ0IsT0FBTyxDQUFDb1Q7QUFIYyxLQUFELENBQWxDO0FBTUEsUUFBRyxDQUFDRyxVQUFKLEVBQWdCLE9BQU87QUFBQ0EsZ0JBQVUsRUFBRTtBQUFiLEtBQVA7QUFDaEIsVUFBTTlPLEtBQUssR0FBR3pFLE9BQU8sQ0FBQzhSLGNBQVIsQ0FBdUJwTixLQUF2QixDQUE2QixHQUE3QixDQUFkLENBYkUsQ0FhK0M7O0FBQ2pELFVBQU1qQyxNQUFNLEdBQUdnQyxLQUFLLENBQUNBLEtBQUssQ0FBQ0UsTUFBTixHQUFhLENBQWQsQ0FBcEI7QUFDQSxVQUFNZ0ksbUJBQW1CLEdBQUdmLHNCQUFzQixDQUFDO0FBQUNuSixZQUFNLEVBQUVBO0FBQVQsS0FBRCxDQUFsRDtBQUVBLFVBQU0rUSxXQUFXLEdBQUd2UCxlQUFlLENBQUM7QUFDbEM5SixVQUFJLEVBQUVtWixTQUFTLENBQUMxUSxTQURrQjtBQUVsQ0EsZUFBUyxFQUFFMFEsU0FBUyxDQUFDWCxZQUZhO0FBR2xDM1QsZUFBUyxFQUFFMk4sbUJBQW1CLENBQUMzTjtBQUhHLEtBQUQsQ0FBbkM7QUFNQSxRQUFHLENBQUN3VSxXQUFKLEVBQWlCLE9BQU87QUFBQ0EsaUJBQVcsRUFBRTtBQUFkLEtBQVA7QUFDakIsV0FBTyxJQUFQO0FBQ0QsR0F6QkQsQ0F5QkUsT0FBT2pTLFNBQVAsRUFBa0I7QUFDbEIsVUFBTSxJQUFJaEosTUFBTSxDQUFDOEIsS0FBWCxDQUFpQiwwQkFBakIsRUFBNkNrSCxTQUE3QyxDQUFOO0FBQ0Q7QUFDRixDQTdCRDs7QUEzQkEvSSxNQUFNLENBQUNnSixhQUFQLENBMERlNlIsV0ExRGYsRTs7Ozs7Ozs7Ozs7QUNBQSxJQUFJOWEsTUFBSjtBQUFXQyxNQUFNLENBQUNDLElBQVAsQ0FBWSxlQUFaLEVBQTRCO0FBQUNGLFFBQU0sQ0FBQ0csQ0FBRCxFQUFHO0FBQUNILFVBQU0sR0FBQ0csQ0FBUDtBQUFTOztBQUFwQixDQUE1QixFQUFrRCxDQUFsRDtBQUFxRCxJQUFJc0MsWUFBSjtBQUFpQnhDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGNBQVosRUFBMkI7QUFBQ21CLFNBQU8sQ0FBQ2xCLENBQUQsRUFBRztBQUFDc0MsZ0JBQVksR0FBQ3RDLENBQWI7QUFBZTs7QUFBM0IsQ0FBM0IsRUFBd0QsQ0FBeEQ7QUFBMkQsSUFBSTBFLFVBQUo7QUFBZTVFLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLHVDQUFaLEVBQW9EO0FBQUMyRSxZQUFVLENBQUMxRSxDQUFELEVBQUc7QUFBQzBFLGNBQVUsR0FBQzFFLENBQVg7QUFBYTs7QUFBNUIsQ0FBcEQsRUFBa0YsQ0FBbEY7QUFBcUYsSUFBSThHLFVBQUo7QUFBZWhILE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLDZCQUFaLEVBQTBDO0FBQUNtQixTQUFPLENBQUNsQixDQUFELEVBQUc7QUFBQzhHLGNBQVUsR0FBQzlHLENBQVg7QUFBYTs7QUFBekIsQ0FBMUMsRUFBcUUsQ0FBckU7QUFLL1AsTUFBTSthLGtCQUFrQixHQUFHLElBQUl6WSxZQUFKLENBQWlCO0FBQzFDNkQsT0FBSyxFQUFFO0FBQ0wxQyxRQUFJLEVBQUVDLE1BREQ7QUFFTEMsU0FBSyxFQUFFckIsWUFBWSxDQUFDc0IsS0FBYixDQUFtQmdJO0FBRnJCO0FBRG1DLENBQWpCLENBQTNCOztBQU9BLE1BQU1zTixZQUFZLEdBQUlyVyxTQUFELElBQWU7QUFDbEMsTUFBSTtBQUNGLFVBQU1xRCxZQUFZLEdBQUdyRCxTQUFyQjtBQUNBa1ksc0JBQWtCLENBQUMxWixRQUFuQixDQUE0QjZFLFlBQTVCO0FBQ0EsVUFBTThVLFVBQVUsR0FBR3RXLFVBQVUsQ0FBQ2xFLElBQVgsQ0FBZ0I7QUFBQzJGLFdBQUssRUFBRXRELFNBQVMsQ0FBQ3NEO0FBQWxCLEtBQWhCLEVBQTBDOFMsS0FBMUMsRUFBbkI7QUFDQSxRQUFHK0IsVUFBVSxDQUFDL08sTUFBWCxHQUFvQixDQUF2QixFQUEwQixPQUFPK08sVUFBVSxDQUFDLENBQUQsQ0FBVixDQUFjeFgsR0FBckI7QUFDMUIsVUFBTXlYLE9BQU8sR0FBR25VLFVBQVUsRUFBMUI7QUFDQSxXQUFPcEMsVUFBVSxDQUFDakMsTUFBWCxDQUFrQjtBQUN2QjBELFdBQUssRUFBRUQsWUFBWSxDQUFDQyxLQURHO0FBRXZCQyxnQkFBVSxFQUFFNlUsT0FBTyxDQUFDN1UsVUFGRztBQUd2QkUsZUFBUyxFQUFFMlUsT0FBTyxDQUFDM1U7QUFISSxLQUFsQixDQUFQO0FBS0QsR0FYRCxDQVdFLE9BQU91QyxTQUFQLEVBQWtCO0FBQ2xCLFVBQU0sSUFBSWhKLE1BQU0sQ0FBQzhCLEtBQVgsQ0FBaUIsMEJBQWpCLEVBQTZDa0gsU0FBN0MsQ0FBTjtBQUNEO0FBQ0YsQ0FmRDs7QUFaQS9JLE1BQU0sQ0FBQ2dKLGFBQVAsQ0E2QmVvUSxZQTdCZixFOzs7Ozs7Ozs7OztBQ0FBLElBQUlyWixNQUFKO0FBQVdDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGVBQVosRUFBNEI7QUFBQ0YsUUFBTSxDQUFDRyxDQUFELEVBQUc7QUFBQ0gsVUFBTSxHQUFDRyxDQUFQO0FBQVM7O0FBQXBCLENBQTVCLEVBQWtELENBQWxEO0FBQXFELElBQUlzQyxZQUFKO0FBQWlCeEMsTUFBTSxDQUFDQyxJQUFQLENBQVksY0FBWixFQUEyQjtBQUFDbUIsU0FBTyxDQUFDbEIsQ0FBRCxFQUFHO0FBQUNzQyxnQkFBWSxHQUFDdEMsQ0FBYjtBQUFlOztBQUEzQixDQUEzQixFQUF3RCxDQUF4RDtBQUEyRCxJQUFJd0gsT0FBSjtBQUFZMUgsTUFBTSxDQUFDQyxJQUFQLENBQVksaUNBQVosRUFBOEM7QUFBQ3lILFNBQU8sQ0FBQ3hILENBQUQsRUFBRztBQUFDd0gsV0FBTyxHQUFDeEgsQ0FBUjtBQUFVOztBQUF0QixDQUE5QyxFQUFzRSxDQUF0RTtBQUl4SixNQUFNa2IsZUFBZSxHQUFHLElBQUk1WSxZQUFKLENBQWlCO0FBQ3ZDNkQsT0FBSyxFQUFFO0FBQ0wxQyxRQUFJLEVBQUVDLE1BREQ7QUFFTEMsU0FBSyxFQUFFckIsWUFBWSxDQUFDc0IsS0FBYixDQUFtQmdJO0FBRnJCO0FBRGdDLENBQWpCLENBQXhCOztBQU9BLE1BQU11TixTQUFTLEdBQUlyVyxNQUFELElBQVk7QUFDNUIsTUFBSTtBQUNGLFVBQU00RSxTQUFTLEdBQUc1RSxNQUFsQjtBQUNBb1ksbUJBQWUsQ0FBQzdaLFFBQWhCLENBQXlCcUcsU0FBekI7QUFDQSxVQUFNeVQsT0FBTyxHQUFHM1QsT0FBTyxDQUFDaEgsSUFBUixDQUFhO0FBQUMyRixXQUFLLEVBQUVyRCxNQUFNLENBQUNxRDtBQUFmLEtBQWIsRUFBb0M4UyxLQUFwQyxFQUFoQjtBQUNBLFFBQUdrQyxPQUFPLENBQUNsUCxNQUFSLEdBQWlCLENBQXBCLEVBQXVCLE9BQU9rUCxPQUFPLENBQUMsQ0FBRCxDQUFQLENBQVczWCxHQUFsQjtBQUN2QixXQUFPZ0UsT0FBTyxDQUFDL0UsTUFBUixDQUFlO0FBQ3BCMEQsV0FBSyxFQUFFdUIsU0FBUyxDQUFDdkI7QUFERyxLQUFmLENBQVA7QUFHRCxHQVJELENBUUUsT0FBTzBDLFNBQVAsRUFBa0I7QUFDbEIsVUFBTSxJQUFJaEosTUFBTSxDQUFDOEIsS0FBWCxDQUFpQix1QkFBakIsRUFBMENrSCxTQUExQyxDQUFOO0FBQ0Q7QUFDRixDQVpEOztBQVhBL0ksTUFBTSxDQUFDZ0osYUFBUCxDQXlCZXFRLFNBekJmLEU7Ozs7Ozs7Ozs7O0FDQUFyWixNQUFNLENBQUNzQyxNQUFQLENBQWM7QUFBQ2daLFNBQU8sRUFBQyxNQUFJQSxPQUFiO0FBQXFCeE8sV0FBUyxFQUFDLE1BQUlBLFNBQW5DO0FBQTZDQyxXQUFTLEVBQUMsTUFBSUEsU0FBM0Q7QUFBcUUxRCxRQUFNLEVBQUMsTUFBSUE7QUFBaEYsQ0FBZDtBQUF1RyxJQUFJdEosTUFBSjtBQUFXQyxNQUFNLENBQUNDLElBQVAsQ0FBWSxlQUFaLEVBQTRCO0FBQUNGLFFBQU0sQ0FBQ0csQ0FBRCxFQUFHO0FBQUNILFVBQU0sR0FBQ0csQ0FBUDtBQUFTOztBQUFwQixDQUE1QixFQUFrRCxDQUFsRDs7QUFFM0csU0FBU29iLE9BQVQsR0FBbUI7QUFDeEIsTUFBR3ZiLE1BQU0sQ0FBQ3diLFFBQVAsS0FBb0I5UyxTQUFwQixJQUNBMUksTUFBTSxDQUFDd2IsUUFBUCxDQUFnQkMsR0FBaEIsS0FBd0IvUyxTQUR4QixJQUVBMUksTUFBTSxDQUFDd2IsUUFBUCxDQUFnQkMsR0FBaEIsQ0FBb0JDLEtBQXBCLEtBQThCaFQsU0FGakMsRUFFNEMsT0FBTzFJLE1BQU0sQ0FBQ3diLFFBQVAsQ0FBZ0JDLEdBQWhCLENBQW9CQyxLQUEzQjtBQUM1QyxTQUFPLEtBQVA7QUFDRDs7QUFFTSxTQUFTM08sU0FBVCxHQUFxQjtBQUMxQixNQUFHL00sTUFBTSxDQUFDd2IsUUFBUCxLQUFvQjlTLFNBQXBCLElBQ0ExSSxNQUFNLENBQUN3YixRQUFQLENBQWdCQyxHQUFoQixLQUF3Qi9TLFNBRHhCLElBRUExSSxNQUFNLENBQUN3YixRQUFQLENBQWdCQyxHQUFoQixDQUFvQkUsT0FBcEIsS0FBZ0NqVCxTQUZuQyxFQUU4QyxPQUFPMUksTUFBTSxDQUFDd2IsUUFBUCxDQUFnQkMsR0FBaEIsQ0FBb0JFLE9BQTNCO0FBQzlDLFNBQU8sS0FBUDtBQUNEOztBQUVNLFNBQVMzTyxTQUFULEdBQXFCO0FBQ3hCLE1BQUdoTixNQUFNLENBQUN3YixRQUFQLEtBQW9COVMsU0FBcEIsSUFDQzFJLE1BQU0sQ0FBQ3diLFFBQVAsQ0FBZ0JDLEdBQWhCLEtBQXdCL1MsU0FEekIsSUFFQzFJLE1BQU0sQ0FBQ3diLFFBQVAsQ0FBZ0JDLEdBQWhCLENBQW9CRyxPQUFwQixLQUFnQ2xULFNBRnBDLEVBRStDLE9BQU8xSSxNQUFNLENBQUN3YixRQUFQLENBQWdCQyxHQUFoQixDQUFvQkcsT0FBM0I7QUFDL0MsU0FBTyxLQUFQO0FBQ0g7O0FBRU0sU0FBU3RTLE1BQVQsR0FBa0I7QUFDdkIsTUFBR3RKLE1BQU0sQ0FBQ3diLFFBQVAsS0FBb0I5UyxTQUFwQixJQUNBMUksTUFBTSxDQUFDd2IsUUFBUCxDQUFnQkMsR0FBaEIsS0FBd0IvUyxTQUR4QixJQUVBMUksTUFBTSxDQUFDd2IsUUFBUCxDQUFnQkMsR0FBaEIsQ0FBb0I3RyxJQUFwQixLQUE2QmxNLFNBRmhDLEVBRTJDO0FBQ3RDLFFBQUltVCxJQUFJLEdBQUcsSUFBWDtBQUNBLFFBQUc3YixNQUFNLENBQUN3YixRQUFQLENBQWdCQyxHQUFoQixDQUFvQkksSUFBcEIsS0FBNkJuVCxTQUFoQyxFQUEyQ21ULElBQUksR0FBRzdiLE1BQU0sQ0FBQ3diLFFBQVAsQ0FBZ0JDLEdBQWhCLENBQW9CSSxJQUEzQjtBQUMzQyxXQUFPLFlBQVU3YixNQUFNLENBQUN3YixRQUFQLENBQWdCQyxHQUFoQixDQUFvQjdHLElBQTlCLEdBQW1DLEdBQW5DLEdBQXVDaUgsSUFBdkMsR0FBNEMsR0FBbkQ7QUFDSjs7QUFDRCxTQUFPN2IsTUFBTSxDQUFDOGIsV0FBUCxFQUFQO0FBQ0QsQzs7Ozs7Ozs7Ozs7QUNoQ0Q3YixNQUFNLENBQUNzQyxNQUFQLENBQWM7QUFBQ3VLLG1CQUFpQixFQUFDLE1BQUlBO0FBQXZCLENBQWQ7QUFBTyxNQUFNQSxpQkFBaUIsR0FBRyxjQUExQixDOzs7Ozs7Ozs7OztBQ0FQN00sTUFBTSxDQUFDc0MsTUFBUCxDQUFjO0FBQUNzUixhQUFXLEVBQUMsTUFBSUEsV0FBakI7QUFBNkJ0SyxnQkFBYyxFQUFDLE1BQUlBLGNBQWhEO0FBQStEQyxpQkFBZSxFQUFDLE1BQUlBLGVBQW5GO0FBQW1HbVIsZUFBYSxFQUFDLE1BQUlBO0FBQXJILENBQWQ7QUFBbUosSUFBSW9CLFFBQUo7QUFBYTliLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLFVBQVosRUFBdUI7QUFBQ21CLFNBQU8sQ0FBQ2xCLENBQUQsRUFBRztBQUFDNGIsWUFBUSxHQUFDNWIsQ0FBVDtBQUFXOztBQUF2QixDQUF2QixFQUFnRCxDQUFoRDtBQUFtRCxJQUFJNmIsUUFBSixFQUFhQyxXQUFiLEVBQXlCQyxVQUF6QixFQUFvQ0MsU0FBcEM7QUFBOENsYyxNQUFNLENBQUNDLElBQVAsQ0FBWSx5QkFBWixFQUFzQztBQUFDOGIsVUFBUSxDQUFDN2IsQ0FBRCxFQUFHO0FBQUM2YixZQUFRLEdBQUM3YixDQUFUO0FBQVcsR0FBeEI7O0FBQXlCOGIsYUFBVyxDQUFDOWIsQ0FBRCxFQUFHO0FBQUM4YixlQUFXLEdBQUM5YixDQUFaO0FBQWMsR0FBdEQ7O0FBQXVEK2IsWUFBVSxDQUFDL2IsQ0FBRCxFQUFHO0FBQUMrYixjQUFVLEdBQUMvYixDQUFYO0FBQWEsR0FBbEY7O0FBQW1GZ2MsV0FBUyxDQUFDaGMsQ0FBRCxFQUFHO0FBQUNnYyxhQUFTLEdBQUNoYyxDQUFWO0FBQVk7O0FBQTVHLENBQXRDLEVBQW9KLENBQXBKO0FBR2pRLElBQUlpYyxZQUFZLEdBQUdwYyxNQUFNLENBQUN3YixRQUFQLENBQWdCekQsSUFBbkM7QUFDQSxJQUFJc0UsVUFBVSxHQUFHM1QsU0FBakI7O0FBQ0EsSUFBR3lULFNBQVMsQ0FBQ0gsUUFBRCxDQUFaLEVBQXdCO0FBQ3RCLE1BQUcsQ0FBQ0ksWUFBRCxJQUFpQixDQUFDQSxZQUFZLENBQUNFLFFBQWxDLEVBQ0UsTUFBTSxJQUFJdGMsTUFBTSxDQUFDOEIsS0FBWCxDQUFpQixzQkFBakIsRUFBeUMsc0NBQXpDLENBQU47QUFDRnVhLFlBQVUsR0FBR0UsWUFBWSxDQUFDSCxZQUFZLENBQUNFLFFBQWQsQ0FBekI7QUFDRDs7QUFDTSxNQUFNekksV0FBVyxHQUFHd0ksVUFBcEI7QUFFUCxJQUFJRyxlQUFlLEdBQUd4YyxNQUFNLENBQUN3YixRQUFQLENBQWdCaUIsT0FBdEM7QUFDQSxJQUFJQyxhQUFhLEdBQUdoVSxTQUFwQjtBQUNBLElBQUlpVSxjQUFjLEdBQUdqVSxTQUFyQjs7QUFDQSxJQUFHeVQsU0FBUyxDQUFDRixXQUFELENBQVosRUFBMkI7QUFDekIsTUFBRyxDQUFDTyxlQUFELElBQW9CLENBQUNBLGVBQWUsQ0FBQ0YsUUFBeEMsRUFDRSxNQUFNLElBQUl0YyxNQUFNLENBQUM4QixLQUFYLENBQWlCLHlCQUFqQixFQUE0Qyx5Q0FBNUMsQ0FBTjtBQUNGNGEsZUFBYSxHQUFHSCxZQUFZLENBQUNDLGVBQWUsQ0FBQ0YsUUFBakIsQ0FBNUI7QUFDQUssZ0JBQWMsR0FBR0gsZUFBZSxDQUFDRixRQUFoQixDQUF5QnhWLE9BQTFDO0FBQ0Q7O0FBQ00sTUFBTXlDLGNBQWMsR0FBR21ULGFBQXZCO0FBQ0EsTUFBTWxULGVBQWUsR0FBR21ULGNBQXhCO0FBRVAsSUFBSUMsY0FBYyxHQUFHNWMsTUFBTSxDQUFDd2IsUUFBUCxDQUFnQnJGLE1BQXJDO0FBQ0EsSUFBSTBHLFlBQVksR0FBR25VLFNBQW5COztBQUNBLElBQUd5VCxTQUFTLENBQUNELFVBQUQsQ0FBWixFQUEwQjtBQUN4QixNQUFHLENBQUNVLGNBQUQsSUFBbUIsQ0FBQ0EsY0FBYyxDQUFDTixRQUF0QyxFQUNFLE1BQU0sSUFBSXRjLE1BQU0sQ0FBQzhCLEtBQVgsQ0FBaUIsd0JBQWpCLEVBQTJDLHdDQUEzQyxDQUFOO0FBQ0YrYSxjQUFZLEdBQUdOLFlBQVksQ0FBQ0ssY0FBYyxDQUFDTixRQUFoQixDQUEzQjtBQUNEOztBQUNNLE1BQU0zQixhQUFhLEdBQUdrQyxZQUF0Qjs7QUFFUCxTQUFTTixZQUFULENBQXNCZixRQUF0QixFQUFnQztBQUM5QixTQUFPLElBQUlPLFFBQVEsQ0FBQ2UsTUFBYixDQUFvQjtBQUN6QmxJLFFBQUksRUFBRTRHLFFBQVEsQ0FBQzVHLElBRFU7QUFFekJpSCxRQUFJLEVBQUVMLFFBQVEsQ0FBQ0ssSUFGVTtBQUd6QmtCLFFBQUksRUFBRXZCLFFBQVEsQ0FBQ3dCLFFBSFU7QUFJekJDLFFBQUksRUFBRXpCLFFBQVEsQ0FBQzBCO0FBSlUsR0FBcEIsQ0FBUDtBQU1ELEM7Ozs7Ozs7Ozs7O0FDeENEamQsTUFBTSxDQUFDc0MsTUFBUCxDQUFjO0FBQUNnVSxTQUFPLEVBQUMsTUFBSUEsT0FBYjtBQUFxQnhPLG9CQUFrQixFQUFDLE1BQUlBLGtCQUE1QztBQUErRDJQLDZCQUEyQixFQUFDLE1BQUlBO0FBQS9GLENBQWQ7QUFBMkksSUFBSTFYLE1BQUo7QUFBV0MsTUFBTSxDQUFDQyxJQUFQLENBQVksZUFBWixFQUE0QjtBQUFDRixRQUFNLENBQUNHLENBQUQsRUFBRztBQUFDSCxVQUFNLEdBQUNHLENBQVA7QUFBUzs7QUFBcEIsQ0FBNUIsRUFBa0QsQ0FBbEQ7QUFBcUQsSUFBSTZiLFFBQUosRUFBYUMsV0FBYixFQUF5QkUsU0FBekI7QUFBbUNsYyxNQUFNLENBQUNDLElBQVAsQ0FBWSx5QkFBWixFQUFzQztBQUFDOGIsVUFBUSxDQUFDN2IsQ0FBRCxFQUFHO0FBQUM2YixZQUFRLEdBQUM3YixDQUFUO0FBQVcsR0FBeEI7O0FBQXlCOGIsYUFBVyxDQUFDOWIsQ0FBRCxFQUFHO0FBQUM4YixlQUFXLEdBQUM5YixDQUFaO0FBQWMsR0FBdEQ7O0FBQXVEZ2MsV0FBUyxDQUFDaGMsQ0FBRCxFQUFHO0FBQUNnYyxhQUFTLEdBQUNoYyxDQUFWO0FBQVk7O0FBQWhGLENBQXRDLEVBQXdILENBQXhIO0FBQTJILElBQUlnZCxPQUFKO0FBQVlsZCxNQUFNLENBQUNDLElBQVAsQ0FBWSxTQUFaLEVBQXNCO0FBQUNtQixTQUFPLENBQUNsQixDQUFELEVBQUc7QUFBQ2dkLFdBQU8sR0FBQ2hkLENBQVI7QUFBVTs7QUFBdEIsQ0FBdEIsRUFBOEMsQ0FBOUM7QUFBaUQsSUFBSTRKLFVBQUo7QUFBZTlKLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLHFCQUFaLEVBQWtDO0FBQUM2SixZQUFVLENBQUM1SixDQUFELEVBQUc7QUFBQzRKLGNBQVUsR0FBQzVKLENBQVg7QUFBYTs7QUFBNUIsQ0FBbEMsRUFBZ0UsQ0FBaEU7QUFNOWEsTUFBTW9XLE9BQU8sR0FBRyxJQUFJNEcsT0FBSixDQUFZLGtFQUFaLENBQWhCO0FBRVAsSUFBSWYsWUFBWSxHQUFHcGMsTUFBTSxDQUFDd2IsUUFBUCxDQUFnQnpELElBQW5DO0FBQ0EsSUFBSXFGLGVBQWUsR0FBRzFVLFNBQXRCOztBQUVBLElBQUd5VCxTQUFTLENBQUNILFFBQUQsQ0FBWixFQUF3QjtBQUN0QixNQUFHLENBQUNJLFlBQUQsSUFBaUIsQ0FBQ0EsWUFBWSxDQUFDZ0IsZUFBbEMsRUFDRSxNQUFNLElBQUlwZCxNQUFNLENBQUM4QixLQUFYLENBQWlCLG1CQUFqQixFQUFzQyxvQkFBdEMsQ0FBTjtBQUNGc2IsaUJBQWUsR0FBR2hCLFlBQVksQ0FBQ2dCLGVBQS9CO0FBQ0Q7O0FBQ00sTUFBTXJWLGtCQUFrQixHQUFHcVYsZUFBM0I7QUFFUCxJQUFJQyxXQUFXLEdBQUczVSxTQUFsQjs7QUFDQSxJQUFHeVQsU0FBUyxDQUFDRixXQUFELENBQVosRUFBMkI7QUFDekIsTUFBSU8sZUFBZSxHQUFHeGMsTUFBTSxDQUFDd2IsUUFBUCxDQUFnQmlCLE9BQXRDO0FBRUEsTUFBRyxDQUFDRCxlQUFELElBQW9CLENBQUNBLGVBQWUsQ0FBQ2MsSUFBeEMsRUFDTSxNQUFNLElBQUl0ZCxNQUFNLENBQUM4QixLQUFYLENBQWlCLHFCQUFqQixFQUF3QywyQ0FBeEMsQ0FBTjtBQUVOLE1BQUcsQ0FBQzBhLGVBQWUsQ0FBQ2MsSUFBaEIsQ0FBcUJELFdBQXpCLEVBQ00sTUFBTSxJQUFJcmQsTUFBTSxDQUFDOEIsS0FBWCxDQUFpQiw0QkFBakIsRUFBK0MseUNBQS9DLENBQU47QUFFTnViLGFBQVcsR0FBS2IsZUFBZSxDQUFDYyxJQUFoQixDQUFxQkQsV0FBckM7QUFFQXRULFlBQVUsQ0FBQywyQkFBRCxFQUE2QnNULFdBQTdCLENBQVY7QUFFQXJkLFFBQU0sQ0FBQ3VkLE9BQVAsQ0FBZSxNQUFNO0FBRXBCLFFBQUdmLGVBQWUsQ0FBQ2MsSUFBaEIsQ0FBcUJOLFFBQXJCLEtBQWtDdFUsU0FBckMsRUFBK0M7QUFDM0M4VSxhQUFPLENBQUNDLEdBQVIsQ0FBWUMsUUFBWixHQUF1QixZQUNuQm5ULGtCQUFrQixDQUFDaVMsZUFBZSxDQUFDYyxJQUFoQixDQUFxQkssTUFBdEIsQ0FEQyxHQUVuQixHQUZtQixHQUduQm5CLGVBQWUsQ0FBQ2MsSUFBaEIsQ0FBcUJ6QixJQUh6QjtBQUlILEtBTEQsTUFLSztBQUNEMkIsYUFBTyxDQUFDQyxHQUFSLENBQVlDLFFBQVosR0FBdUIsWUFDbkJuVCxrQkFBa0IsQ0FBQ2lTLGVBQWUsQ0FBQ2MsSUFBaEIsQ0FBcUJOLFFBQXRCLENBREMsR0FFbkIsR0FGbUIsR0FFYnpTLGtCQUFrQixDQUFDaVMsZUFBZSxDQUFDYyxJQUFoQixDQUFxQkosUUFBdEIsQ0FGTCxHQUduQixHQUhtQixHQUdiM1Msa0JBQWtCLENBQUNpUyxlQUFlLENBQUNjLElBQWhCLENBQXFCSyxNQUF0QixDQUhMLEdBSW5CLEdBSm1CLEdBS25CbkIsZUFBZSxDQUFDYyxJQUFoQixDQUFxQnpCLElBTHpCO0FBTUg7O0FBRUQ5UixjQUFVLENBQUMsaUJBQUQsRUFBbUJ5VCxPQUFPLENBQUNDLEdBQVIsQ0FBWUMsUUFBL0IsQ0FBVjtBQUVBLFFBQUdsQixlQUFlLENBQUNjLElBQWhCLENBQXFCTSw0QkFBckIsS0FBb0RsVixTQUF2RCxFQUNJOFUsT0FBTyxDQUFDQyxHQUFSLENBQVlHLDRCQUFaLEdBQTJDcEIsZUFBZSxDQUFDYyxJQUFoQixDQUFxQk0sNEJBQWhFLENBbkJnQixDQW1COEU7QUFDbEcsR0FwQkQ7QUFxQkQ7O0FBQ00sTUFBTWxHLDJCQUEyQixHQUFHMkYsV0FBcEMsQzs7Ozs7Ozs7Ozs7QUN0RFAsSUFBSXJkLE1BQUo7QUFBV0MsTUFBTSxDQUFDQyxJQUFQLENBQVksZUFBWixFQUE0QjtBQUFDRixRQUFNLENBQUNHLENBQUQsRUFBRztBQUFDSCxVQUFNLEdBQUNHLENBQVA7QUFBUzs7QUFBcEIsQ0FBNUIsRUFBa0QsQ0FBbEQ7QUFBcUQsSUFBSUMsS0FBSjtBQUFVSCxNQUFNLENBQUNDLElBQVAsQ0FBWSx1QkFBWixFQUFvQztBQUFDRSxPQUFLLENBQUNELENBQUQsRUFBRztBQUFDQyxTQUFLLEdBQUNELENBQU47QUFBUTs7QUFBbEIsQ0FBcEMsRUFBd0QsQ0FBeEQ7QUFBMkQsSUFBSW9ILElBQUo7QUFBU3RILE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLHdCQUFaLEVBQXFDO0FBQUNxSCxNQUFJLENBQUNwSCxDQUFELEVBQUc7QUFBQ29ILFFBQUksR0FBQ3BILENBQUw7QUFBTzs7QUFBaEIsQ0FBckMsRUFBdUQsQ0FBdkQ7QUFHOUlILE1BQU0sQ0FBQ3VkLE9BQVAsQ0FBZSxNQUFNO0FBQ2xCLE1BQUl6VixPQUFPLEdBQUMrVixNQUFNLENBQUNDLE9BQVAsQ0FBZSxjQUFmLENBQVo7O0FBRUQsTUFBSXZXLElBQUksQ0FBQzVHLElBQUwsR0FBWW9kLEtBQVosS0FBc0IsQ0FBMUIsRUFBNEI7QUFDMUJ4VyxRQUFJLENBQUMvRCxNQUFMLENBQVksRUFBWjtBQUNEOztBQUNBK0QsTUFBSSxDQUFDM0UsTUFBTCxDQUFZO0FBQUM4RSxPQUFHLEVBQUMsU0FBTDtBQUFlYixTQUFLLEVBQUNpQjtBQUFyQixHQUFaOztBQUVELE1BQUc5SCxNQUFNLENBQUMwTSxLQUFQLENBQWEvTCxJQUFiLEdBQW9Cb2QsS0FBcEIsT0FBZ0MsQ0FBbkMsRUFBc0M7QUFDcEMsVUFBTTFWLEVBQUUsR0FBR3NELFFBQVEsQ0FBQ3FTLFVBQVQsQ0FBb0I7QUFDN0JoQixjQUFRLEVBQUUsT0FEbUI7QUFFN0IxVyxXQUFLLEVBQUUscUJBRnNCO0FBRzdCNFcsY0FBUSxFQUFFO0FBSG1CLEtBQXBCLENBQVg7QUFLQTljLFNBQUssQ0FBQzZkLGVBQU4sQ0FBc0I1VixFQUF0QixFQUEwQixPQUExQjtBQUNEO0FBQ0YsQ0FoQkQsRTs7Ozs7Ozs7Ozs7QUNIQXBJLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLHdCQUFaO0FBQXNDRCxNQUFNLENBQUNDLElBQVAsQ0FBWSx5QkFBWjtBQUF1Q0QsTUFBTSxDQUFDQyxJQUFQLENBQVkseUJBQVo7QUFBdUNELE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLHdCQUFaO0FBQXNDRCxNQUFNLENBQUNDLElBQVAsQ0FBWSw2QkFBWjtBQUEyQ0QsTUFBTSxDQUFDQyxJQUFQLENBQVksZUFBWjtBQUE2QkQsTUFBTSxDQUFDQyxJQUFQLENBQVksbUJBQVo7QUFBaUNELE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGlDQUFaO0FBQStDRCxNQUFNLENBQUNDLElBQVAsQ0FBWSxlQUFaO0FBQTZCRCxNQUFNLENBQUNDLElBQVAsQ0FBWSwwQkFBWjtBQUF3Q0QsTUFBTSxDQUFDQyxJQUFQLENBQVksV0FBWixFOzs7Ozs7Ozs7OztBQ0F2WCxJQUFJRixNQUFKO0FBQVdDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGVBQVosRUFBNEI7QUFBQ0YsUUFBTSxDQUFDRyxDQUFELEVBQUc7QUFBQ0gsVUFBTSxHQUFDRyxDQUFQO0FBQVM7O0FBQXBCLENBQTVCLEVBQWtELENBQWxEO0FBQXFELElBQUkwWSxRQUFKO0FBQWE1WSxNQUFNLENBQUNDLElBQVAsQ0FBWSxrQ0FBWixFQUErQztBQUFDMlksVUFBUSxDQUFDMVksQ0FBRCxFQUFHO0FBQUMwWSxZQUFRLEdBQUMxWSxDQUFUO0FBQVc7O0FBQXhCLENBQS9DLEVBQXlFLENBQXpFO0FBQTRFLElBQUlnWSxjQUFKO0FBQW1CbFksTUFBTSxDQUFDQyxJQUFQLENBQVksd0NBQVosRUFBcUQ7QUFBQ2lZLGdCQUFjLENBQUNoWSxDQUFELEVBQUc7QUFBQ2dZLGtCQUFjLEdBQUNoWSxDQUFmO0FBQWlCOztBQUFwQyxDQUFyRCxFQUEyRixDQUEzRjtBQUE4RixJQUFJdVksUUFBSjtBQUFhelksTUFBTSxDQUFDQyxJQUFQLENBQVksa0NBQVosRUFBK0M7QUFBQ3dZLFVBQVEsQ0FBQ3ZZLENBQUQsRUFBRztBQUFDdVksWUFBUSxHQUFDdlksQ0FBVDtBQUFXOztBQUF4QixDQUEvQyxFQUF5RSxDQUF6RTtBQUE0RSxJQUFJOGIsV0FBSixFQUFnQkUsU0FBaEI7QUFBMEJsYyxNQUFNLENBQUNDLElBQVAsQ0FBWSx5QkFBWixFQUFzQztBQUFDK2IsYUFBVyxDQUFDOWIsQ0FBRCxFQUFHO0FBQUM4YixlQUFXLEdBQUM5YixDQUFaO0FBQWMsR0FBOUI7O0FBQStCZ2MsV0FBUyxDQUFDaGMsQ0FBRCxFQUFHO0FBQUNnYyxhQUFTLEdBQUNoYyxDQUFWO0FBQVk7O0FBQXhELENBQXRDLEVBQWdHLENBQWhHO0FBQW1HLElBQUlpWSxvQ0FBSjtBQUF5Q25ZLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLHlEQUFaLEVBQXNFO0FBQUNtQixTQUFPLENBQUNsQixDQUFELEVBQUc7QUFBQ2lZLHdDQUFvQyxHQUFDalksQ0FBckM7QUFBdUM7O0FBQW5ELENBQXRFLEVBQTJILENBQTNIO0FBT3pnQkgsTUFBTSxDQUFDdWQsT0FBUCxDQUFlLE1BQU07QUFDbkIxRSxVQUFRLENBQUNxRixjQUFUO0FBQ0EvRixnQkFBYyxDQUFDK0YsY0FBZjtBQUNBeEYsVUFBUSxDQUFDd0YsY0FBVDtBQUNBLE1BQUcvQixTQUFTLENBQUNGLFdBQUQsQ0FBWixFQUEyQjdELG9DQUFvQztBQUNoRSxDQUxELEU7Ozs7Ozs7Ozs7O0FDUEFuWSxNQUFNLENBQUNzQyxNQUFQLENBQWM7QUFBQzRiLFNBQU8sRUFBQyxNQUFJQSxPQUFiO0FBQXFCQyxrQkFBZ0IsRUFBQyxNQUFJQSxnQkFBMUM7QUFBMkRDLHFCQUFtQixFQUFDLE1BQUlBLG1CQUFuRjtBQUF1R0Msb0JBQWtCLEVBQUMsTUFBSUEsa0JBQTlIO0FBQWlKQyx3QkFBc0IsRUFBQyxNQUFJQSxzQkFBNUs7QUFBbU1DLHFCQUFtQixFQUFDLE1BQUlBLG1CQUEzTjtBQUErT3hXLFNBQU8sRUFBQyxNQUFJQSxPQUEzUDtBQUFtUStCLFlBQVUsRUFBQyxNQUFJQSxVQUFsUjtBQUE2UndMLFdBQVMsRUFBQyxNQUFJQSxTQUEzUztBQUFxVHpCLGVBQWEsRUFBQyxNQUFJQSxhQUF2VTtBQUFxVjJLLFNBQU8sRUFBQyxNQUFJQSxPQUFqVztBQUF5V3pVLFVBQVEsRUFBQyxNQUFJQSxRQUF0WDtBQUErWDBVLGFBQVcsRUFBQyxNQUFJQTtBQUEvWSxDQUFkO0FBQTJhLElBQUluRCxPQUFKO0FBQVl0YixNQUFNLENBQUNDLElBQVAsQ0FBWSxzQkFBWixFQUFtQztBQUFDcWIsU0FBTyxDQUFDcGIsQ0FBRCxFQUFHO0FBQUNvYixXQUFPLEdBQUNwYixDQUFSO0FBQVU7O0FBQXRCLENBQW5DLEVBQTJELENBQTNEOztBQUV2YndlLE9BQU8sQ0FBQyxXQUFELENBQVA7O0FBRU8sTUFBTVIsT0FBTyxHQUFHWCxPQUFPLENBQUNXLE9BQXhCO0FBQ0EsTUFBTUMsZ0JBQWdCLEdBQUc7QUFBQ1EsS0FBRyxFQUFHLFdBQVA7QUFBb0JDLFFBQU0sRUFBRyxDQUFDLFFBQUQsRUFBVyxTQUFYO0FBQTdCLENBQXpCO0FBQ0EsTUFBTVIsbUJBQW1CLEdBQUc7QUFBQ08sS0FBRyxFQUFHLGNBQVA7QUFBdUJDLFFBQU0sRUFBRyxDQUFDLE1BQUQsRUFBUyxTQUFUO0FBQWhDLENBQTVCO0FBQ0EsTUFBTVAsa0JBQWtCLEdBQUc7QUFBQ00sS0FBRyxFQUFHLGFBQVA7QUFBc0JDLFFBQU0sRUFBRyxDQUFDLE9BQUQsRUFBVSxTQUFWO0FBQS9CLENBQTNCO0FBQ0EsTUFBTU4sc0JBQXNCLEdBQUc7QUFBQ0ssS0FBRyxFQUFHLGlCQUFQO0FBQTBCQyxRQUFNLEVBQUcsQ0FBQyxPQUFELEVBQVUsU0FBVjtBQUFuQyxDQUEvQjtBQUNBLE1BQU1MLG1CQUFtQixHQUFHO0FBQUNJLEtBQUcsRUFBRyxjQUFQO0FBQXVCQyxRQUFNLEVBQUcsQ0FBQyxRQUFELEVBQVcsU0FBWDtBQUFoQyxDQUE1Qjs7QUFFQSxTQUFTN1csT0FBVCxDQUFpQnNELE9BQWpCLEVBQXlCd1QsS0FBekIsRUFBZ0M7QUFDbkMsTUFBR3ZELE9BQU8sRUFBVixFQUFjO0FBQUM0QyxXQUFPLENBQUNZLElBQVIsR0FBZUMsR0FBZixDQUFtQlosZ0JBQW5CLEVBQXFDYSxHQUFyQyxDQUF5QzNULE9BQXpDLEVBQWlEd1QsS0FBSyxHQUFDQSxLQUFELEdBQU8sRUFBN0Q7QUFBa0U7QUFDcEY7O0FBRU0sU0FBUy9VLFVBQVQsQ0FBb0J1QixPQUFwQixFQUE0QndULEtBQTVCLEVBQW1DO0FBQ3RDLE1BQUd2RCxPQUFPLEVBQVYsRUFBYztBQUFDNEMsV0FBTyxDQUFDWSxJQUFSLEdBQWVDLEdBQWYsQ0FBbUJYLG1CQUFuQixFQUF3Q1ksR0FBeEMsQ0FBNEMzVCxPQUE1QyxFQUFxRHdULEtBQUssR0FBQ0EsS0FBRCxHQUFPLEVBQWpFO0FBQXNFO0FBQ3hGOztBQUVNLFNBQVN2SixTQUFULENBQW1CakssT0FBbkIsRUFBNEJ3VCxLQUE1QixFQUFtQztBQUN0QyxNQUFHdkQsT0FBTyxFQUFWLEVBQWM7QUFBQzRDLFdBQU8sQ0FBQ1ksSUFBUixHQUFlQyxHQUFmLENBQW1CVixrQkFBbkIsRUFBdUNXLEdBQXZDLENBQTJDM1QsT0FBM0MsRUFBb0R3VCxLQUFLLEdBQUNBLEtBQUQsR0FBTyxFQUFoRTtBQUFxRTtBQUN2Rjs7QUFFTSxTQUFTaEwsYUFBVCxDQUF1QnhJLE9BQXZCLEVBQWdDd1QsS0FBaEMsRUFBdUM7QUFDMUMsTUFBR3ZELE9BQU8sRUFBVixFQUFhO0FBQUM0QyxXQUFPLENBQUNZLElBQVIsR0FBZUMsR0FBZixDQUFtQlQsc0JBQW5CLEVBQTJDVSxHQUEzQyxDQUErQzNULE9BQS9DLEVBQXdEd1QsS0FBSyxHQUFDQSxLQUFELEdBQU8sRUFBcEU7QUFBeUU7QUFDMUY7O0FBRU0sU0FBU0wsT0FBVCxDQUFpQm5ULE9BQWpCLEVBQTBCd1QsS0FBMUIsRUFBaUM7QUFDcEMsTUFBR3ZELE9BQU8sRUFBVixFQUFhO0FBQUM0QyxXQUFPLENBQUNZLElBQVIsR0FBZUMsR0FBZixDQUFtQlQsc0JBQW5CLEVBQTJDVSxHQUEzQyxDQUErQzNULE9BQS9DLEVBQXdEd1QsS0FBSyxHQUFDQSxLQUFELEdBQU8sRUFBcEU7QUFBeUU7QUFDMUY7O0FBRU0sU0FBUzlVLFFBQVQsQ0FBa0JzQixPQUFsQixFQUEyQndULEtBQTNCLEVBQWtDO0FBQ3JDLE1BQUd2RCxPQUFPLEVBQVYsRUFBYTtBQUFDNEMsV0FBTyxDQUFDWSxJQUFSLEdBQWVDLEdBQWYsQ0FBbUJULHNCQUFuQixFQUEyQzFjLEtBQTNDLENBQWlEeUosT0FBakQsRUFBMER3VCxLQUFLLEdBQUNBLEtBQUQsR0FBTyxFQUF0RTtBQUEyRTtBQUM1Rjs7QUFFTSxTQUFTSixXQUFULENBQXFCcFQsT0FBckIsRUFBOEJ3VCxLQUE5QixFQUFxQztBQUN4QyxNQUFHdkQsT0FBTyxFQUFWLEVBQWE7QUFBQzRDLFdBQU8sQ0FBQ1ksSUFBUixHQUFlQyxHQUFmLENBQW1CUixtQkFBbkIsRUFBd0NTLEdBQXhDLENBQTRDM1QsT0FBNUMsRUFBcUR3VCxLQUFLLEdBQUNBLEtBQUQsR0FBTyxFQUFqRTtBQUFzRTtBQUN2RixDOzs7Ozs7Ozs7OztBQ3JDRDdlLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGdDQUFaO0FBQThDRCxNQUFNLENBQUNDLElBQVAsQ0FBWSwrQkFBWjtBQUE2Q0QsTUFBTSxDQUFDQyxJQUFQLENBQVksNkNBQVo7QUFBMkRELE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLDhCQUFaO0FBQTRDRCxNQUFNLENBQUNDLElBQVAsQ0FBWSxtQ0FBWjtBQUFpREQsTUFBTSxDQUFDQyxJQUFQLENBQVksMENBQVosRTs7Ozs7Ozs7Ozs7QUNBblAsSUFBSUYsTUFBSjtBQUFXQyxNQUFNLENBQUNDLElBQVAsQ0FBWSxlQUFaLEVBQTRCO0FBQUNGLFFBQU0sQ0FBQ0csQ0FBRCxFQUFHO0FBQUNILFVBQU0sR0FBQ0csQ0FBUDtBQUFTOztBQUFwQixDQUE1QixFQUFrRCxDQUFsRDtBQUFxRCxJQUFJWSxjQUFKO0FBQW1CZCxNQUFNLENBQUNDLElBQVAsQ0FBWSx5QkFBWixFQUFzQztBQUFDYSxnQkFBYyxDQUFDWixDQUFELEVBQUc7QUFBQ1ksa0JBQWMsR0FBQ1osQ0FBZjtBQUFpQjs7QUFBcEMsQ0FBdEMsRUFBNEUsQ0FBNUU7O0FBQStFLElBQUlnQixDQUFKOztBQUFNbEIsTUFBTSxDQUFDQyxJQUFQLENBQVksbUJBQVosRUFBZ0M7QUFBQ2lCLEdBQUMsQ0FBQ2hCLENBQUQsRUFBRztBQUFDZ0IsS0FBQyxHQUFDaEIsQ0FBRjtBQUFJOztBQUFWLENBQWhDLEVBQTRDLENBQTVDO0FBSXhLO0FBQ0FILE1BQU0sQ0FBQzBNLEtBQVAsQ0FBYWpKLElBQWIsQ0FBa0I7QUFDaEJKLFFBQU0sR0FBRztBQUNQLFdBQU8sSUFBUDtBQUNEOztBQUhlLENBQWxCLEUsQ0FNQTs7QUFDQSxNQUFNNmIsWUFBWSxHQUFHLENBQ25CLE9BRG1CLEVBRW5CLFFBRm1CLEVBR25CLG9CQUhtQixFQUluQixhQUptQixFQUtuQixtQkFMbUIsRUFNbkIsdUJBTm1CLEVBT25CLGdCQVBtQixFQVFuQixnQkFSbUIsRUFTbkIsZUFUbUIsRUFVbkIsYUFWbUIsRUFXbkIsWUFYbUIsRUFZbkIsaUJBWm1CLEVBYW5CLG9CQWJtQixFQWNuQiwyQkFkbUIsQ0FBckI7O0FBaUJBLElBQUlsZixNQUFNLENBQUNtQyxRQUFYLEVBQXFCO0FBQ25CO0FBQ0FwQixnQkFBYyxDQUFDcUIsT0FBZixDQUF1QjtBQUNyQmIsUUFBSSxDQUFDQSxJQUFELEVBQU87QUFDVCxhQUFPSixDQUFDLENBQUNrQixRQUFGLENBQVc2YyxZQUFYLEVBQXlCM2QsSUFBekIsQ0FBUDtBQUNELEtBSG9COztBQUtyQjtBQUNBZSxnQkFBWSxHQUFHO0FBQUUsYUFBTyxJQUFQO0FBQWM7O0FBTlYsR0FBdkIsRUFPRyxDQVBILEVBT00sSUFQTjtBQVFELEM7Ozs7Ozs7Ozs7O0FDdkNEckMsTUFBTSxDQUFDc0MsTUFBUCxDQUFjO0FBQUN5WixVQUFRLEVBQUMsTUFBSUEsUUFBZDtBQUF1QkMsYUFBVyxFQUFDLE1BQUlBLFdBQXZDO0FBQW1EQyxZQUFVLEVBQUMsTUFBSUEsVUFBbEU7QUFBNkVDLFdBQVMsRUFBQyxNQUFJQTtBQUEzRixDQUFkO0FBQXFILElBQUluYyxNQUFKO0FBQVdDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGVBQVosRUFBNEI7QUFBQ0YsUUFBTSxDQUFDRyxDQUFELEVBQUc7QUFBQ0gsVUFBTSxHQUFDRyxDQUFQO0FBQVM7O0FBQXBCLENBQTVCLEVBQWtELENBQWxEO0FBQ3pILE1BQU02YixRQUFRLEdBQUcsTUFBakI7QUFDQSxNQUFNQyxXQUFXLEdBQUcsU0FBcEI7QUFDQSxNQUFNQyxVQUFVLEdBQUcsUUFBbkI7O0FBQ0EsU0FBU0MsU0FBVCxDQUFtQnZZLElBQW5CLEVBQXlCO0FBQzlCLE1BQUc1RCxNQUFNLENBQUN3YixRQUFQLEtBQW9COVMsU0FBcEIsSUFBaUMxSSxNQUFNLENBQUN3YixRQUFQLENBQWdCQyxHQUFoQixLQUF3Qi9TLFNBQTVELEVBQXVFLE1BQU0sb0JBQU47QUFDdkUsUUFBTXlXLEtBQUssR0FBR25mLE1BQU0sQ0FBQ3diLFFBQVAsQ0FBZ0JDLEdBQWhCLENBQW9CMEQsS0FBbEM7QUFDQSxNQUFHQSxLQUFLLEtBQUt6VyxTQUFiLEVBQXdCLE9BQU95VyxLQUFLLENBQUN6VSxRQUFOLENBQWU5RyxJQUFmLENBQVA7QUFDeEIsU0FBTyxLQUFQO0FBQ0QsQzs7Ozs7Ozs7Ozs7QUNURCxJQUFJK0gsUUFBSjtBQUFhMUwsTUFBTSxDQUFDQyxJQUFQLENBQVksc0JBQVosRUFBbUM7QUFBQ3lMLFVBQVEsQ0FBQ3hMLENBQUQsRUFBRztBQUFDd0wsWUFBUSxHQUFDeEwsQ0FBVDtBQUFXOztBQUF4QixDQUFuQyxFQUE2RCxDQUE3RDtBQUNid0wsUUFBUSxDQUFDeVQsTUFBVCxDQUFnQjtBQUNaQyx1QkFBcUIsRUFBRSxJQURYO0FBRVpDLDZCQUEyQixFQUFFO0FBRmpCLENBQWhCO0FBT0EzVCxRQUFRLENBQUM0VCxjQUFULENBQXdCL1osSUFBeEIsR0FBNkIsc0JBQTdCLEM7Ozs7Ozs7Ozs7O0FDUkEsSUFBSWdhLEdBQUosRUFBUUMsc0JBQVIsRUFBK0J0VyxzQkFBL0I7QUFBc0RsSixNQUFNLENBQUNDLElBQVAsQ0FBWSxZQUFaLEVBQXlCO0FBQUNzZixLQUFHLENBQUNyZixDQUFELEVBQUc7QUFBQ3FmLE9BQUcsR0FBQ3JmLENBQUo7QUFBTSxHQUFkOztBQUFlc2Ysd0JBQXNCLENBQUN0ZixDQUFELEVBQUc7QUFBQ3NmLDBCQUFzQixHQUFDdGYsQ0FBdkI7QUFBeUIsR0FBbEU7O0FBQW1FZ0osd0JBQXNCLENBQUNoSixDQUFELEVBQUc7QUFBQ2dKLDBCQUFzQixHQUFDaEosQ0FBdkI7QUFBeUI7O0FBQXRILENBQXpCLEVBQWlKLENBQWpKO0FBQW9KLElBQUkwWixZQUFKO0FBQWlCNVosTUFBTSxDQUFDQyxJQUFQLENBQVksdURBQVosRUFBb0U7QUFBQ21CLFNBQU8sQ0FBQ2xCLENBQUQsRUFBRztBQUFDMFosZ0JBQVksR0FBQzFaLENBQWI7QUFBZTs7QUFBM0IsQ0FBcEUsRUFBaUcsQ0FBakc7QUFBb0csSUFBSStPLG1CQUFKO0FBQXdCalAsTUFBTSxDQUFDQyxJQUFQLENBQVksb0VBQVosRUFBaUY7QUFBQ21CLFNBQU8sQ0FBQ2xCLENBQUQsRUFBRztBQUFDK08sdUJBQW1CLEdBQUMvTyxDQUFwQjtBQUFzQjs7QUFBbEMsQ0FBakYsRUFBcUgsQ0FBckg7QUFBd0gsSUFBSTRKLFVBQUo7QUFBZTlKLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLHNEQUFaLEVBQW1FO0FBQUM2SixZQUFVLENBQUM1SixDQUFELEVBQUc7QUFBQzRKLGNBQVUsR0FBQzVKLENBQVg7QUFBYTs7QUFBNUIsQ0FBbkUsRUFBaUcsQ0FBakc7QUFJOWQ7QUFDQXFmLEdBQUcsQ0FBQ0UsUUFBSixDQUFhdlcsc0JBQXNCLEdBQUMsUUFBcEMsRUFBOEM7QUFBQ3dXLGNBQVksRUFBRTtBQUFmLENBQTlDLEVBQXFFO0FBQ25FQyxLQUFHLEVBQUU7QUFDSEMsVUFBTSxFQUFFLFlBQVc7QUFDakIsWUFBTXBOLElBQUksR0FBRyxLQUFLcU4sU0FBTCxDQUFlck4sSUFBNUI7O0FBQ0EsVUFBSTtBQUNGLFlBQUlzTixFQUFFLEdBQUcsS0FBS2pHLE9BQUwsQ0FBYTdCLE9BQWIsQ0FBcUIsaUJBQXJCLEtBQ1AsS0FBSzZCLE9BQUwsQ0FBYWtHLFVBQWIsQ0FBd0JDLGFBRGpCLElBRVAsS0FBS25HLE9BQUwsQ0FBYW9HLE1BQWIsQ0FBb0JELGFBRmIsS0FHTixLQUFLbkcsT0FBTCxDQUFha0csVUFBYixDQUF3QkUsTUFBeEIsR0FBaUMsS0FBS3BHLE9BQUwsQ0FBYWtHLFVBQWIsQ0FBd0JFLE1BQXhCLENBQStCRCxhQUFoRSxHQUErRSxJQUh6RSxDQUFUO0FBS0UsWUFBR0YsRUFBRSxDQUFDdlIsT0FBSCxDQUFXLEdBQVgsS0FBaUIsQ0FBQyxDQUFyQixFQUF1QnVSLEVBQUUsR0FBQ0EsRUFBRSxDQUFDdFIsU0FBSCxDQUFhLENBQWIsRUFBZXNSLEVBQUUsQ0FBQ3ZSLE9BQUgsQ0FBVyxHQUFYLENBQWYsQ0FBSDtBQUV2QnpFLGtCQUFVLENBQUMsdUJBQUQsRUFBeUI7QUFBQzBJLGNBQUksRUFBQ0EsSUFBTjtBQUFZbUMsY0FBSSxFQUFDbUw7QUFBakIsU0FBekIsQ0FBVjtBQUNBLGNBQU1oVixRQUFRLEdBQUc4TyxZQUFZLENBQUM7QUFBQ2pGLGNBQUksRUFBRW1MLEVBQVA7QUFBV3ROLGNBQUksRUFBRUE7QUFBakIsU0FBRCxDQUE3QjtBQUVGLGVBQU87QUFDTDBOLG9CQUFVLEVBQUUsR0FEUDtBQUVMbEksaUJBQU8sRUFBRTtBQUFDLDRCQUFnQixZQUFqQjtBQUErQix3QkFBWWxOO0FBQTNDLFdBRko7QUFHTHFWLGNBQUksRUFBRSxlQUFhclY7QUFIZCxTQUFQO0FBS0QsT0FoQkQsQ0FnQkUsT0FBTWxKLEtBQU4sRUFBYTtBQUNiLGVBQU87QUFBQ3NlLG9CQUFVLEVBQUUsR0FBYjtBQUFrQkMsY0FBSSxFQUFFO0FBQUNsWSxrQkFBTSxFQUFFLE1BQVQ7QUFBaUJvRCxtQkFBTyxFQUFFekosS0FBSyxDQUFDeUo7QUFBaEM7QUFBeEIsU0FBUDtBQUNEO0FBQ0Y7QUF0QkU7QUFEOEQsQ0FBckU7QUEyQkFrVSxHQUFHLENBQUNFLFFBQUosQ0FBYUQsc0JBQWIsRUFBcUM7QUFDakNHLEtBQUcsRUFBRTtBQUNERCxnQkFBWSxFQUFFLEtBRGI7QUFFREUsVUFBTSxFQUFFLFlBQVc7QUFDZixZQUFNUSxNQUFNLEdBQUcsS0FBS0MsV0FBcEI7QUFDQSxZQUFNblIsSUFBSSxHQUFHa1IsTUFBTSxDQUFDelEsRUFBcEI7O0FBRUEsVUFBSTtBQUNBViwyQkFBbUIsQ0FBQ0MsSUFBRCxDQUFuQjtBQUNBLGVBQU87QUFBQ2pILGdCQUFNLEVBQUUsU0FBVDtBQUFxQnRHLGNBQUksRUFBQyxVQUFRdU4sSUFBUixHQUFhO0FBQXZDLFNBQVA7QUFDSCxPQUhELENBR0UsT0FBTXROLEtBQU4sRUFBYTtBQUNYLGVBQU87QUFBQ3FHLGdCQUFNLEVBQUUsTUFBVDtBQUFpQnJHLGVBQUssRUFBRUEsS0FBSyxDQUFDeUo7QUFBOUIsU0FBUDtBQUNIO0FBQ0o7QUFaQTtBQUQ0QixDQUFyQyxFOzs7Ozs7Ozs7OztBQ2hDQSxJQUFJa1UsR0FBSjtBQUFRdmYsTUFBTSxDQUFDQyxJQUFQLENBQVksWUFBWixFQUF5QjtBQUFDc2YsS0FBRyxDQUFDcmYsQ0FBRCxFQUFHO0FBQUNxZixPQUFHLEdBQUNyZixDQUFKO0FBQU07O0FBQWQsQ0FBekIsRUFBeUMsQ0FBekM7QUFDUnFmLEdBQUcsQ0FBQ0UsUUFBSixDQUFhLFlBQWIsRUFBMkI7QUFBQ0MsY0FBWSxFQUFFO0FBQWYsQ0FBM0IsRUFBa0Q7QUFDaERDLEtBQUcsRUFBRTtBQUNIQyxVQUFNLEVBQUUsWUFBVztBQUNqQixZQUFNamUsSUFBSSxHQUFHO0FBQ1gsZ0JBQVEsc0JBREc7QUFFWCxtQkFBVyxxQ0FGQTtBQUdYLG9CQUFZLHVDQUhEO0FBSVgsc0JBQWMsc0JBSkg7QUFLWCxtQkFBVSw2Q0FDTixPQURNLEdBRU4sMkJBRk0sR0FHTixLQUhNLEdBSU4sc0JBSk0sR0FLTix3QkFMTSxHQU1OLEtBTk0sR0FPTixhQVBNLEdBUU4sZ0JBUk0sR0FTTixpQkFUTSxHQVVOLHVCQVZNLEdBV04scUNBWE0sR0FZTixpQ0FaTSxHQWFOLEtBYk0sR0FjTixTQWRNLEdBZU4sd0JBZk0sR0FnQk4sb0JBaEJNLEdBaUJOLDRCQWpCTSxHQWtCTixzQ0FsQk0sR0FtQk4sS0FuQk0sR0FvQk4sV0FwQk0sR0FxQk4sbUJBckJNLEdBc0JOLEtBdEJNLEdBdUJOLHNCQXZCTSxHQXdCTixnQkF4Qk0sR0F5Qk4saUJBekJNLEdBMEJOLDZCQTFCTSxHQTJCTixLQTNCTSxHQTRCTixrREE1Qk0sR0E2Qk4sZ0NBN0JNLEdBOEJOLGlDQTlCTSxHQStCTixLQS9CTSxHQWdDTixvQkFoQ00sR0FpQ04sZ0NBakNNLEdBa0NOLGtCQWxDTSxHQW1DTixLQW5DTSxHQW9DTix1SEFwQ00sR0FxQ04sMkJBckNNLEdBc0NOLEtBdENNLEdBdUNOLGNBdkNNLEdBd0NOLGdDQXhDTSxHQXlDTiw0QkF6Q00sR0EwQ04sNEJBMUNNLEdBMkNOLEtBM0NNLEdBNENOLFNBNUNNLEdBNkNOLHlCQTdDTSxHQThDTixlQTlDTSxHQStDTixrQ0EvQ00sR0FnRE4saUNBaERNLEdBaUROLEtBakRNLEdBa0ROLDhEQWxETSxHQW1ETiwrQkFuRE0sR0FvRE4sZ0NBcERNLEdBcUROLDJCQXJETSxHQXNETixzQkF0RE0sR0F1RE4sS0F2RE0sR0F3RE4sa0JBeERNLEdBeUROLDRCQXpETSxHQTBETixxQkExRE0sR0EyRE4sMkJBM0RNLEdBNEROLHNCQTVETSxHQTZETixLQTdETSxHQThETixLQTlETSxHQStETixtQkEvRE0sR0FnRU4sS0FoRU0sR0FpRU4sVUFqRU0sR0FrRU4scUJBbEVNLEdBbUVOLDBCQW5FTSxHQW9FTixLQXBFTSxHQXFFTixnQkFyRU0sR0FzRU4sb0NBdEVNLEdBdUVOLEtBdkVNLEdBd0VOLGtCQXhFTSxHQXlFTix1Q0F6RU0sR0EwRU4sS0ExRU0sR0EyRU4sZ0JBM0VNLEdBNEVOLGdCQTVFTSxHQTZFTixpQkE3RU0sR0E4RU4sS0E5RU0sR0ErRU4sT0EvRU0sR0FnRk4sNkJBaEZNLEdBaUZOLEtBakZNLEdBa0ZOLHVDQWxGTSxHQW1GTiw4QkFuRk0sR0FvRk4sS0FwRk0sR0FxRk4sVUFyRk0sR0FzRk4sS0F0Rk0sR0F1Rk4sVUF2Rk0sR0F3Rk4sdUJBeEZNLEdBeUZOLGtCQXpGTSxHQTBGTixLQTFGTSxHQTJGTixtQ0EzRk0sR0E0Rk4saUJBNUZNLEdBNkZOLEtBN0ZNLEdBOEZOLG1DQTlGTSxHQStGTixpQ0EvRk0sR0FnR04sS0FoR00sR0FpR04sWUFqR00sR0FrR04sV0FsR00sR0FtR04seUtBbkdNLEdBb0dOLHlCQXBHTSxHQXFHTiw2QkFyR00sR0FzR04sS0F0R00sR0F1R04saUJBdkdNLEdBd0dOLDZCQXhHTSxHQXlHTiw4QkF6R00sR0EwR04seUJBMUdNLEdBMkdOLEtBM0dNLEdBNEdOLHdCQTVHTSxHQTZHTiw2QkE3R00sR0E4R04sS0E5R00sR0ErR04seUJBL0dNLEdBZ0hOLDZCQWhITSxHQWlITixLQWpITSxHQWtITix5QkFsSE0sR0FtSE4sNkJBbkhNLEdBb0hOLGdDQXBITSxHQXFITiw2QkFySE0sR0FzSE4sbUNBdEhNLEdBdUhOLG9DQXZITSxHQXdITiw2QkF4SE0sR0F5SE4sS0F6SE0sR0EwSE4sV0ExSE0sR0EySE4sK0JBM0hNLEdBNEhOLDRCQTVITSxHQTZITiw2QkE3SE0sR0E4SE4sdUJBOUhNLEdBK0hOLEtBL0hNLEdBZ0lOLG1CQWhJTSxHQWlJTixnQ0FqSU0sR0FrSU4sNkJBbElNLEdBbUlOLDhCQW5JTSxHQW9JTix1QkFwSU0sR0FxSU4scUNBcklNLEdBc0lOLEtBdElNLEdBdUlOLGVBdklNLEdBd0lOLDZCQXhJTSxHQXlJTixrQkF6SU0sR0EwSU4sS0ExSU0sR0EySU4sZUEzSU0sR0E0SU4sNkJBNUlNLEdBNklOLGtCQTdJTSxHQThJTixLQTlJTSxHQStJTixLQS9JTSxHQWdKTixZQWhKTSxHQWlKTixXQWpKTSxHQWtKTiwrQ0FsSk0sR0FtSk4sbUNBbkpNLEdBb0pOLDhCQXBKTSxHQXFKTixLQXJKTSxHQXNKTixtQ0F0Sk0sR0F1Sk4sOEJBdkpNLEdBd0pOLEtBeEpNLEdBeUpOLEtBekpNLEdBMEpOLElBMUpNLEdBMkpOLHlLQTNKTSxHQTRKTix1Q0E1Sk0sR0E2Sk4sNkJBN0pNLEdBOEpOLEtBOUpNLEdBK0pOLGtDQS9KTSxHQWdLTiw2QkFoS00sR0FpS04sOEJBaktNLEdBa0tOLEtBbEtNLEdBbUtOLHlDQW5LTSxHQW9LTiw2QkFwS00sR0FxS04sS0FyS00sR0FzS04sMENBdEtNLEdBdUtOLDZCQXZLTSxHQXdLTixLQXhLTSxHQXlLTiwwQ0F6S00sR0EwS04sNkJBMUtNLEdBMktOLGdDQTNLTSxHQTRLTiw2QkE1S00sR0E2S04sbUNBN0tNLEdBOEtOLG9DQTlLTSxHQStLTiw2QkEvS00sR0FnTE4sS0FoTE0sR0FpTE4sNEJBakxNLEdBa0xOLCtCQWxMTSxHQW1MTixpQkFuTE0sR0FvTE4sa0JBcExNLEdBcUxOLHVCQXJMTSxHQXNMTixLQXRMTSxHQXVMTixtQ0F2TE0sR0F3TE4sNkJBeExNLEdBeUxOLEtBekxNLEdBMExOLG1DQTFMTSxHQTJMTiw2QkEzTE0sR0E0TE4sS0E1TE0sR0E2TE4sS0E3TE0sR0E4TE4sSUE5TE0sR0ErTE4sa0JBL0xNLEdBZ01OLFdBaE1NLEdBaU1OLDZCQWpNTSxHQWtNTixtQkFsTU0sR0FtTU4sS0FuTU0sR0FvTU4seUJBcE1NLEdBcU1OLDZCQXJNTSxHQXNNTixLQXRNTSxHQXVNTixzQkF2TU0sR0F3TU4sNkJBeE1NLEdBeU1OLG1CQXpNTSxHQTBNTixLQTFNTSxHQTJNTiwyQkEzTU0sR0E0TU4scUJBNU1NLEdBNk1OLEtBN01NLEdBOE1OLHdCQTlNTSxHQStNTixxQkEvTU0sR0FnTk4sbUJBaE5NLEdBaU5OLEtBak5NLEdBa05OLDBCQWxOTSxHQW1OTiw4QkFuTk0sR0FvTk4sS0FwTk0sR0FxTk4sdUJBck5NLEdBc05OLDhCQXROTSxHQXVOTixtQkF2Tk0sR0F3Tk4sS0F4Tk0sR0F5Tk4sS0F6Tk0sR0EwTk4sWUExTk0sR0EyTk4sSUEzTk0sR0E0Tk4sZ0NBNU5NLEdBNk5OLDJCQTdOTSxHQThOTiw2REE5Tk0sR0ErTk4scURBL05NLEdBZ09OLElBaE9NLEdBaU9OLG1FQWpPTSxHQWtPTixpRUFsT00sR0FtT04sSUFuT00sR0FvT04sWUFwT00sR0FxT04sZ0JBck9NLEdBc09OLElBdE9NLEdBdU9OLHVCQXZPTSxHQXdPTiwyQkF4T00sR0F5T04sMERBek9NLEdBME9OLDhEQTFPTSxHQTJPTiw0REEzT00sR0E0T04sZ0ZBNU9NLEdBNk9OLDBFQTdPTSxHQThPTiw4REE5T00sR0ErT04sWUEvT00sR0FnUE4sZ0JBaFBNLEdBaVBOLElBalBNLEdBa1BOLHVCQWxQTSxHQW1QTiwyQkFuUE0sR0FvUE4sZUFwUE0sR0FxUE4seUNBclBNLEdBc1BOLHFDQXRQTSxHQXVQTixxQ0F2UE0sR0F3UE4sS0F4UE0sR0F5UE4sSUF6UE0sR0EwUE4sa0RBMVBNLEdBMlBOLGdDQTNQTSxHQTRQTixtQ0E1UE0sR0E2UE4sWUE3UE0sR0E4UE4sZ0JBOVBNLEdBK1BOLElBL1BNLEdBZ1FOLHdCQWhRTSxHQWlRTiwyQkFqUU0sR0FrUU4sV0FsUU0sR0FtUU4sa0JBblFNLEdBb1FOLDJCQXBRTSxHQXFRTixLQXJRTSxHQXNRTixJQXRRTSxHQXVRTix3QkF2UU0sR0F3UU4sMEJBeFFNLEdBeVFOLDBCQXpRTSxHQTBRTixLQTFRTSxHQTJRTixJQTNRTSxHQTRRTix5QkE1UU0sR0E2UU4sMEJBN1FNLEdBOFFOLDJCQTlRTSxHQStRTixLQS9RTSxHQWdSTixZQWhSTSxHQWlSTixnQkFqUk0sR0FrUk4scUVBbFJNLEdBbVJOLGdCQW5STSxHQW9STix3Q0FwUk0sR0FxUk4sMkNBclJNLEdBc1JOLDJCQXRSTSxHQXVSTiw0QkF2Uk0sR0F3Uk4sS0F4Uk0sR0F5Uk4sWUF6Uk0sR0EwUk4sV0ExUk0sR0EyUk4sK0xBM1JNLEdBNFJOLDhJQTVSTSxHQTZSTixzSUE3Uk0sR0E4Uk4sVUE5Uk0sR0ErUk4sa0VBL1JNLEdBZ1NOLGdCQWhTTSxHQWlTTiw0QkFqU00sR0FrU04seUNBbFNNLEdBbVNOLGlHQW5TTSxHQW9TTix3QkFwU00sR0FxU04sNkRBclNNLEdBc1NOLHlLQXRTTSxHQXVTTixrQ0F2U00sR0F3U04seUVBeFNNLEdBeVNOLDhKQXpTTSxHQTBTTiw0Q0ExU00sR0EyU04sb0pBM1NNLEdBNFNOLGlDQTVTTSxHQTZTTixnRUE3U00sR0E4U04sMkpBOVNNLEdBK1NOLHNFQS9TTSxHQWdUTixxVEFoVE0sR0FpVE4sdUVBalRNLEdBa1ROLHNFQWxUTSxHQW1UTixnQ0FuVE0sR0FvVE4saUNBcFRNLEdBcVROLDZDQXJUTSxHQXNUTiw0Q0F0VE0sR0F1VE4scUJBdlRNLEdBd1ROLHFCQXhUTSxHQXlUTiwwU0F6VE0sR0EwVE4sZ0NBMVRNLEdBMlROLDBMQTNUTSxHQTRUTixzQ0E1VE0sR0E2VE4sNklBN1RNLEdBOFROLDRDQTlUTSxHQStUTix5T0EvVE0sR0FnVU4sZ0RBaFVNLEdBaVVOLDZGQWpVTSxHQWtVTix1REFsVU0sR0FtVU4sNkNBblVNLEdBb1VOLDhDQXBVTSxHQXFVTixxR0FyVU0sR0FzVU4sNENBdFVNLEdBdVVOLHNOQXZVTSxHQXdVTixrREF4VU0sR0F5VU4sNkxBelVNLEdBMFVOLHdEQTFVTSxHQTJVTixpSkEzVU0sR0E0VU4sOERBNVVNLEdBNlVOLDBJQTdVTSxHQThVTixvRUE5VU0sR0ErVU4sK05BL1VNLEdBZ1ZOLDBFQWhWTSxHQWlWTixtSEFqVk0sR0FrVk4sa0tBbFZNLEdBbVZOLDJFQW5WTSxHQW9WTixpRkFwVk0sR0FxVk4scUVBclZNLEdBc1ZOLDJFQXRWTSxHQXVWTiwrREF2Vk0sR0F3Vk4scUVBeFZNLEdBeVZOLHlEQXpWTSxHQTBWTiwrREExVk0sR0EyVk4sbURBM1ZNLEdBNFZOLG9EQTVWTSxHQTZWTiw0Q0E3Vk0sR0E4Vk4sb0hBOVZNLEdBK1ZOLDRDQS9WTSxHQWdXTiw4SkFoV00sR0FpV04sa0RBaldNLEdBa1dOLHNKQWxXTSxHQW1XTix3REFuV00sR0FvV04seUpBcFdNLEdBcVdOLDhEQXJXTSxHQXNXTiw0TEF0V00sR0F1V04sb0VBdldNLEdBd1dOLHVJQXhXTSxHQXlXTiwwRUF6V00sR0EwV04sdUdBMVdNLEdBMldOLDJFQTNXTSxHQTRXTixpRkE1V00sR0E2V04scUVBN1dNLEdBOFdOLDJFQTlXTSxHQStXTiwrREEvV00sR0FnWE4scUVBaFhNLEdBaVhOLHlEQWpYTSxHQWtYTiwrREFsWE0sR0FtWE4sbURBblhNLEdBb1hOLG9EQXBYTSxHQXFYTiw0Q0FyWE0sR0FzWE4sb0hBdFhNLEdBdVhOLDRDQXZYTSxHQXdYTiw4SkF4WE0sR0F5WE4sa0RBelhNLEdBMFhOLDZMQTFYTSxHQTJYTix3REEzWE0sR0E0WE4saUpBNVhNLEdBNlhOLDhEQTdYTSxHQThYTiwwSUE5WE0sR0ErWE4sb0VBL1hNLEdBZ1lOLCtOQWhZTSxHQWlZTiwwRUFqWU0sR0FrWU4sMFFBbFlNLEdBbVlOLFdBbllNLEdBb1lOLDJFQXBZTSxHQXFZTixpRkFyWU0sR0FzWU4scUVBdFlNLEdBdVlOLDJFQXZZTSxHQXdZTiwrREF4WU0sR0F5WU4scUVBellNLEdBMFlOLHlEQTFZTSxHQTJZTiwrREEzWU0sR0E0WU4sbURBNVlNLEdBNllOLHlEQTdZTSxHQThZTiw2Q0E5WU0sR0ErWU4sOENBL1lNLEdBZ1pOLHFHQWhaTSxHQWlaTiw0Q0FqWk0sR0FrWk4seU9BbFpNLEdBbVpOLDBLQW5aTSxHQW9aTiw2TkFwWk0sR0FxWk4sdURBclpNLEdBc1pOLDZDQXRaTSxHQXVaTiw4Q0F2Wk0sR0F3Wk4sMEZBeFpNLEdBeVpOLDRDQXpaTSxHQTBaTiwrTUExWk0sR0EyWk4sa0RBM1pNLEdBNFpOLHdWQTVaTSxHQTZaTix3REE3Wk0sR0E4Wk4sMlRBOVpNLEdBK1pOLG9GQS9aTSxHQWdhTix5REFoYU0sR0FpYU4sK0RBamFNLEdBa2FOLG1EQWxhTSxHQW1hTix5REFuYU0sR0FvYU4sNkNBcGFNLEdBcWFOLDhDQXJhTSxHQXNhTixzTEF0YU0sR0F1YU4sb2RBdmFNLEdBd2FOLGlEQXhhTSxHQXlhTix1Q0F6YU0sR0EwYU4sNkNBMWFNLEdBMmFOLGlDQTNhTSxHQTRhTixrQ0E1YU0sR0E2YU4sK0pBN2FNLEdBOGFOLGdDQTlhTSxHQSthTiwwTEEvYU0sR0FnYk4sc0NBaGJNLEdBaWJOLDZIQWpiTSxHQWtiTiw0Q0FsYk0sR0FtYk4seU9BbmJNLEdBb2JOLG9LQXBiTSxHQXFiTix5RUFyYk0sR0FzYk4scUVBdGJNLEdBdWJOLHdGQXZiTSxHQXdiTix1REF4Yk0sR0F5Yk4sNkNBemJNLEdBMGJOLDhDQTFiTSxHQTJiTixzTEEzYk0sR0E0Yk4sZ0tBNWJNLEdBNmJOLDJIQTdiTSxHQThiTiw2SUE5Yk0sR0ErYk4sd0dBL2JNLEdBZ2NOLGlEQWhjTSxHQWljTix1Q0FqY00sR0FrY04sNkNBbGNNLEdBbWNOLGlDQW5jTSxHQW9jTix1Q0FwY00sR0FxY04sMkJBcmNNLEdBc2NOLGlDQXRjTSxHQXVjTixxQkF2Y00sR0F3Y04sc0JBeGNNLEdBeWNOLGtCQXpjTSxHQTBjTixnQ0ExY00sR0EyY04sd0JBM2NNLEdBNGNOLFdBNWNNLEdBNmNOO0FBbGRPLE9BQWI7QUFxZEEsYUFBTztBQUFDLGtCQUFVLFNBQVg7QUFBc0IsZ0JBQVFBO0FBQTlCLE9BQVA7QUFDRDtBQXhkRTtBQUQyQyxDQUFsRCxFOzs7Ozs7Ozs7Ozs7Ozs7QUNEQSxJQUFJNGQsR0FBSixFQUFRdFcsZUFBUixFQUF3QnVMLDZCQUF4QjtBQUFzRHhVLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLFlBQVosRUFBeUI7QUFBQ3NmLEtBQUcsQ0FBQ3JmLENBQUQsRUFBRztBQUFDcWYsT0FBRyxHQUFDcmYsQ0FBSjtBQUFNLEdBQWQ7O0FBQWUrSSxpQkFBZSxDQUFDL0ksQ0FBRCxFQUFHO0FBQUMrSSxtQkFBZSxHQUFDL0ksQ0FBaEI7QUFBa0IsR0FBcEQ7O0FBQXFEc1UsK0JBQTZCLENBQUN0VSxDQUFELEVBQUc7QUFBQ3NVLGlDQUE2QixHQUFDdFUsQ0FBOUI7QUFBZ0M7O0FBQXRILENBQXpCLEVBQWlKLENBQWpKO0FBQW9KLElBQUlpQixRQUFKO0FBQWFuQixNQUFNLENBQUNDLElBQVAsQ0FBWSwyRUFBWixFQUF3RjtBQUFDbUIsU0FBTyxDQUFDbEIsQ0FBRCxFQUFHO0FBQUNpQixZQUFRLEdBQUNqQixDQUFUO0FBQVc7O0FBQXZCLENBQXhGLEVBQWlILENBQWpIO0FBQW9ILElBQUl1YSxpQkFBSjtBQUFzQnphLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLDZEQUFaLEVBQTBFO0FBQUNtQixTQUFPLENBQUNsQixDQUFELEVBQUc7QUFBQ3VhLHFCQUFpQixHQUFDdmEsQ0FBbEI7QUFBb0I7O0FBQWhDLENBQTFFLEVBQTRHLENBQTVHO0FBQStHLElBQUk4TCxjQUFKO0FBQW1CaE0sTUFBTSxDQUFDQyxJQUFQLENBQVksK0RBQVosRUFBNEU7QUFBQ21CLFNBQU8sQ0FBQ2xCLENBQUQsRUFBRztBQUFDOEwsa0JBQWMsR0FBQzlMLENBQWY7QUFBaUI7O0FBQTdCLENBQTVFLEVBQTJHLENBQTNHO0FBQThHLElBQUk2SixRQUFKLEVBQWFoQyxPQUFiO0FBQXFCL0gsTUFBTSxDQUFDQyxJQUFQLENBQVksc0RBQVosRUFBbUU7QUFBQzhKLFVBQVEsQ0FBQzdKLENBQUQsRUFBRztBQUFDNkosWUFBUSxHQUFDN0osQ0FBVDtBQUFXLEdBQXhCOztBQUF5QjZILFNBQU8sQ0FBQzdILENBQUQsRUFBRztBQUFDNkgsV0FBTyxHQUFDN0gsQ0FBUjtBQUFVOztBQUE5QyxDQUFuRSxFQUFtSCxDQUFuSDtBQUFzSCxJQUFJb2dCLGdCQUFKO0FBQXFCdGdCLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLFNBQVosRUFBc0I7QUFBQ3FnQixrQkFBZ0IsQ0FBQ3BnQixDQUFELEVBQUc7QUFBQ29nQixvQkFBZ0IsR0FBQ3BnQixDQUFqQjtBQUFtQjs7QUFBeEMsQ0FBdEIsRUFBZ0UsQ0FBaEU7QUFBbUUsSUFBSW1JLFVBQUo7QUFBZXJJLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLHNEQUFaLEVBQW1FO0FBQUNtQixTQUFPLENBQUNsQixDQUFELEVBQUc7QUFBQ21JLGNBQVUsR0FBQ25JLENBQVg7QUFBYTs7QUFBekIsQ0FBbkUsRUFBOEYsQ0FBOUY7QUFBaUcsSUFBSUUsTUFBSjtBQUFXSixNQUFNLENBQUNDLElBQVAsQ0FBWSx5Q0FBWixFQUFzRDtBQUFDRyxRQUFNLENBQUNGLENBQUQsRUFBRztBQUFDRSxVQUFNLEdBQUNGLENBQVA7QUFBUzs7QUFBcEIsQ0FBdEQsRUFBNEUsQ0FBNUU7QUFBK0UsSUFBSUMsS0FBSjtBQUFVSCxNQUFNLENBQUNDLElBQVAsQ0FBWSx1QkFBWixFQUFvQztBQUFDRSxPQUFLLENBQUNELENBQUQsRUFBRztBQUFDQyxTQUFLLEdBQUNELENBQU47QUFBUTs7QUFBbEIsQ0FBcEMsRUFBd0QsQ0FBeEQ7QUFVeGdDO0FBRUFxZixHQUFHLENBQUNFLFFBQUosQ0FBYWpMLDZCQUFiLEVBQTRDO0FBQzFDK0wsTUFBSSxFQUFFO0FBQ0piLGdCQUFZLEVBQUUsSUFEVjtBQUVKO0FBQ0FFLFVBQU0sRUFBRSxZQUFXO0FBQ2pCLFlBQU1ZLE9BQU8sR0FBRyxLQUFLSCxXQUFyQjtBQUNBLFlBQU1JLE9BQU8sR0FBRyxLQUFLQyxVQUFyQjtBQUNBLFVBQUlOLE1BQU0sR0FBRyxFQUFiO0FBQ0EsVUFBR0ksT0FBTyxLQUFLL1gsU0FBZixFQUEwQjJYLE1BQU0sbUNBQU9JLE9BQVAsQ0FBTjtBQUMxQixVQUFHQyxPQUFPLEtBQUtoWSxTQUFmLEVBQTBCMlgsTUFBTSxtQ0FBT0EsTUFBUCxFQUFrQkssT0FBbEIsQ0FBTjtBQUUxQixZQUFNRSxHQUFHLEdBQUcsS0FBS3BnQixNQUFqQjs7QUFFQSxVQUFHLENBQUNKLEtBQUssQ0FBQ00sWUFBTixDQUFtQmtnQixHQUFuQixFQUF3QixPQUF4QixDQUFELElBQXFDO0FBQ25DeGdCLFdBQUssQ0FBQ00sWUFBTixDQUFtQmtnQixHQUFuQixFQUF3QixPQUF4QixNQUFxQ1AsTUFBTSxDQUFDLFNBQUQsQ0FBTixJQUFtQixJQUFuQixJQUEyQkEsTUFBTSxDQUFDLFNBQUQsQ0FBTixJQUFtQjNYLFNBQW5GLENBREwsRUFDcUc7QUFBRztBQUNwRzJYLGNBQU0sQ0FBQyxTQUFELENBQU4sR0FBb0JPLEdBQXBCO0FBQ0g7O0FBRUQ1WSxhQUFPLENBQUMsa0NBQUQsRUFBb0NxWSxNQUFwQyxDQUFQOztBQUNBLFVBQUdBLE1BQU0sQ0FBQzdHLFdBQVAsQ0FBbUJxSCxXQUFuQixLQUFtQ0MsS0FBdEMsRUFBNEM7QUFBRTtBQUMxQyxlQUFPQyxZQUFZLENBQUNWLE1BQUQsQ0FBbkI7QUFDSCxPQUZELE1BRUs7QUFDRixlQUFPVyxVQUFVLENBQUNYLE1BQUQsQ0FBakI7QUFDRjtBQUNGO0FBdkJHLEdBRG9DO0FBMEIxQ1ksS0FBRyxFQUFFO0FBQ0h0QixnQkFBWSxFQUFFLEtBRFg7QUFFSEUsVUFBTSxFQUFFLFlBQVc7QUFDakIsWUFBTVksT0FBTyxHQUFHLEtBQUtILFdBQXJCO0FBQ0EsWUFBTUksT0FBTyxHQUFHLEtBQUtDLFVBQXJCO0FBRUEzWSxhQUFPLENBQUMsVUFBRCxFQUFZeVksT0FBWixDQUFQO0FBQ0F6WSxhQUFPLENBQUMsVUFBRCxFQUFZMFksT0FBWixDQUFQO0FBRUEsVUFBSUwsTUFBTSxHQUFHLEVBQWI7QUFDQSxVQUFHSSxPQUFPLEtBQUsvWCxTQUFmLEVBQTBCMlgsTUFBTSxtQ0FBT0ksT0FBUCxDQUFOO0FBQzFCLFVBQUdDLE9BQU8sS0FBS2hZLFNBQWYsRUFBMEIyWCxNQUFNLG1DQUFPQSxNQUFQLEVBQWtCSyxPQUFsQixDQUFOOztBQUMxQixVQUFJO0FBQ0YsY0FBTVEsR0FBRyxHQUFHeEcsaUJBQWlCLENBQUMyRixNQUFELENBQTdCO0FBQ0FyWSxlQUFPLENBQUMsdUJBQUQsRUFBeUJrWixHQUF6QixDQUFQO0FBQ0EsZUFBTztBQUFDaFosZ0JBQU0sRUFBRSxTQUFUO0FBQW9CdEcsY0FBSSxFQUFFO0FBQUMwSixtQkFBTyxFQUFFO0FBQVY7QUFBMUIsU0FBUDtBQUNELE9BSkQsQ0FJRSxPQUFNekosS0FBTixFQUFhO0FBQ2IsZUFBTztBQUFDc2Usb0JBQVUsRUFBRSxHQUFiO0FBQWtCQyxjQUFJLEVBQUU7QUFBQ2xZLGtCQUFNLEVBQUUsTUFBVDtBQUFpQm9ELG1CQUFPLEVBQUV6SixLQUFLLENBQUN5SjtBQUFoQztBQUF4QixTQUFQO0FBQ0Q7QUFDRjtBQW5CRTtBQTFCcUMsQ0FBNUM7QUFpREFrVSxHQUFHLENBQUNFLFFBQUosQ0FBYXhXLGVBQWIsRUFBOEI7QUFBQ3lXLGNBQVksRUFBRTtBQUFmLENBQTlCLEVBQXFEO0FBQ25EQyxLQUFHLEVBQUU7QUFDSEMsVUFBTSxFQUFFLFlBQVc7QUFDakIsWUFBTVEsTUFBTSxHQUFHLEtBQUtDLFdBQXBCOztBQUNBLFVBQUk7QUFDQXRZLGVBQU8sQ0FBQyxvRUFBRCxFQUFzRWMsSUFBSSxDQUFDQyxTQUFMLENBQWVzWCxNQUFmLENBQXRFLENBQVA7QUFDQSxjQUFNemUsSUFBSSxHQUFHcUssY0FBYyxDQUFDb1UsTUFBRCxDQUEzQjtBQUNBclksZUFBTyxDQUFDLDBEQUFELEVBQTREO0FBQUNxRCxpQkFBTyxFQUFDekosSUFBSSxDQUFDeUosT0FBZDtBQUF1QnJJLG1CQUFTLEVBQUNwQixJQUFJLENBQUNvQjtBQUF0QyxTQUE1RCxDQUFQO0FBQ0YsZUFBTztBQUFDa0YsZ0JBQU0sRUFBRSxTQUFUO0FBQW9CdEc7QUFBcEIsU0FBUDtBQUNELE9BTEQsQ0FLRSxPQUFNQyxLQUFOLEVBQWE7QUFDYm1JLGdCQUFRLENBQUMsaUNBQUQsRUFBbUNuSSxLQUFuQyxDQUFSO0FBQ0EsZUFBTztBQUFDcUcsZ0JBQU0sRUFBRSxNQUFUO0FBQWlCckcsZUFBSyxFQUFFQSxLQUFLLENBQUN5SjtBQUE5QixTQUFQO0FBQ0Q7QUFDRjtBQVpFO0FBRDhDLENBQXJEO0FBaUJBa1UsR0FBRyxDQUFDRSxRQUFKLENBQWFhLGdCQUFiLEVBQStCO0FBQzNCWCxLQUFHLEVBQUU7QUFDREQsZ0JBQVksRUFBRSxJQURiO0FBRUQ7QUFDQUUsVUFBTSxFQUFFLFlBQVc7QUFDZixVQUFJUSxNQUFNLEdBQUcsS0FBS0MsV0FBbEI7QUFDQSxZQUFNTSxHQUFHLEdBQUcsS0FBS3BnQixNQUFqQjs7QUFDQSxVQUFHLENBQUNKLEtBQUssQ0FBQ00sWUFBTixDQUFtQmtnQixHQUFuQixFQUF3QixPQUF4QixDQUFKLEVBQXFDO0FBQ2pDUCxjQUFNLEdBQUc7QUFBQ2pZLGdCQUFNLEVBQUN3WSxHQUFSO0FBQVl6WSxjQUFJLEVBQUM7QUFBakIsU0FBVDtBQUNILE9BRkQsTUFHSTtBQUNBa1ksY0FBTSxtQ0FBT0EsTUFBUDtBQUFjbFksY0FBSSxFQUFDO0FBQW5CLFVBQU47QUFDSDs7QUFDRCxVQUFJO0FBQ0FILGVBQU8sQ0FBQyxvQ0FBRCxFQUFzQ2MsSUFBSSxDQUFDQyxTQUFMLENBQWVzWCxNQUFmLENBQXRDLENBQVA7QUFDQSxjQUFNemUsSUFBSSxHQUFHMEcsVUFBVSxDQUFDK1gsTUFBRCxDQUF2QjtBQUNBclksZUFBTyxDQUFDLHdCQUFELEVBQTBCYyxJQUFJLENBQUNDLFNBQUwsQ0FBZW5ILElBQWYsQ0FBMUIsQ0FBUDtBQUNBLGVBQU87QUFBQ3NHLGdCQUFNLEVBQUUsU0FBVDtBQUFvQnRHO0FBQXBCLFNBQVA7QUFDSCxPQUxELENBS0UsT0FBTUMsS0FBTixFQUFhO0FBQ1htSSxnQkFBUSxDQUFDLHNDQUFELEVBQXdDbkksS0FBeEMsQ0FBUjtBQUNBLGVBQU87QUFBQ3FHLGdCQUFNLEVBQUUsTUFBVDtBQUFpQnJHLGVBQUssRUFBRUEsS0FBSyxDQUFDeUo7QUFBOUIsU0FBUDtBQUNIO0FBQ0o7QUFyQkE7QUFEc0IsQ0FBL0I7O0FBMEJBLFNBQVN5VixZQUFULENBQXNCVixNQUF0QixFQUE2QjtBQUV6QnJZLFNBQU8sQ0FBQyxXQUFELEVBQWFxWSxNQUFNLENBQUM3RyxXQUFwQixDQUFQO0FBRUEsUUFBTThCLE9BQU8sR0FBRytFLE1BQU0sQ0FBQzdHLFdBQXZCO0FBQ0EsUUFBTUQsY0FBYyxHQUFHOEcsTUFBTSxDQUFDOUcsY0FBOUI7QUFDQSxRQUFNM1gsSUFBSSxHQUFHeWUsTUFBTSxDQUFDemUsSUFBcEI7QUFDQSxRQUFNdWYsT0FBTyxHQUFHZCxNQUFNLENBQUN6ZixPQUF2QjtBQUVBLE1BQUl3Z0IsY0FBSjtBQUNBLE1BQUlDLFdBQVcsR0FBRyxFQUFsQjtBQUNBLE1BQUk1SCxVQUFKO0FBQ0E2QixTQUFPLENBQUN0VixPQUFSLENBQWdCLENBQUMvQyxNQUFELEVBQVFrQixLQUFSLEtBQWtCO0FBRTlCLFVBQU1tZCxZQUFZLEdBQUdOLFVBQVUsQ0FBQztBQUFDeEgsaUJBQVcsRUFBQ3ZXLE1BQWI7QUFBb0JzVyxvQkFBYyxFQUFDQSxjQUFuQztBQUFrRDNYLFVBQUksRUFBQ0EsSUFBdkQ7QUFBNkQ2WCxnQkFBVSxFQUFDQSxVQUF4RTtBQUFvRnRWLFdBQUssRUFBRUEsS0FBM0Y7QUFBa0d2RCxhQUFPLEVBQUN1Z0I7QUFBMUcsS0FBRCxDQUEvQjtBQUNBblosV0FBTyxDQUFDLFFBQUQsRUFBVXNaLFlBQVYsQ0FBUDtBQUNBLFFBQUdBLFlBQVksQ0FBQ3BaLE1BQWIsS0FBd0JRLFNBQXhCLElBQXFDNFksWUFBWSxDQUFDcFosTUFBYixLQUFzQixRQUE5RCxFQUF3RSxNQUFNLHlCQUFOO0FBQ3hFbVosZUFBVyxDQUFDcmMsSUFBWixDQUFpQnNjLFlBQWpCO0FBQ0FGLGtCQUFjLEdBQUdFLFlBQVksQ0FBQzFmLElBQWIsQ0FBa0J5RyxFQUFuQzs7QUFFQSxRQUFHbEUsS0FBSyxLQUFHLENBQVgsRUFDQTtBQUNJNkQsYUFBTyxDQUFDLHVCQUFELEVBQXlCb1osY0FBekIsQ0FBUDtBQUNBLFlBQU1wZixLQUFLLEdBQUczQixNQUFNLENBQUN1SyxPQUFQLENBQWU7QUFBQ2pILFdBQUcsRUFBRXlkO0FBQU4sT0FBZixDQUFkO0FBQ0EzSCxnQkFBVSxHQUFHelgsS0FBSyxDQUFDcUMsTUFBbkI7QUFDQTJELGFBQU8sQ0FBQyxzQkFBRCxFQUF3QnlSLFVBQXhCLENBQVA7QUFDSDtBQUVKLEdBaEJEO0FBa0JBelIsU0FBTyxDQUFDcVosV0FBRCxDQUFQO0FBRUEsU0FBT0EsV0FBUDtBQUNIOztBQUVELFNBQVNMLFVBQVQsQ0FBb0JYLE1BQXBCLEVBQTJCO0FBRXZCLE1BQUk7QUFDQSxVQUFNYSxHQUFHLEdBQUc5ZixRQUFRLENBQUNpZixNQUFELENBQXBCO0FBQ0FyWSxXQUFPLENBQUMsa0JBQUQsRUFBb0JrWixHQUFwQixDQUFQO0FBQ0EsV0FBTztBQUFDaFosWUFBTSxFQUFFLFNBQVQ7QUFBb0J0RyxVQUFJLEVBQUU7QUFBQ3lHLFVBQUUsRUFBRTZZLEdBQUw7QUFBVWhaLGNBQU0sRUFBRSxTQUFsQjtBQUE2Qm9ELGVBQU8sRUFBRTtBQUF0QztBQUExQixLQUFQO0FBQ0gsR0FKRCxDQUlFLE9BQU16SixLQUFOLEVBQWE7QUFDWCxXQUFPO0FBQUNzZSxnQkFBVSxFQUFFLEdBQWI7QUFBa0JDLFVBQUksRUFBRTtBQUFDbFksY0FBTSxFQUFFLE1BQVQ7QUFBaUJvRCxlQUFPLEVBQUV6SixLQUFLLENBQUN5SjtBQUFoQztBQUF4QixLQUFQO0FBQ0g7QUFDSixDOzs7Ozs7Ozs7OztBQ3BKRCxJQUFJa1UsR0FBSjtBQUFRdmYsTUFBTSxDQUFDQyxJQUFQLENBQVksWUFBWixFQUF5QjtBQUFDc2YsS0FBRyxDQUFDcmYsQ0FBRCxFQUFHO0FBQUNxZixPQUFHLEdBQUNyZixDQUFKO0FBQU07O0FBQWQsQ0FBekIsRUFBeUMsQ0FBekM7QUFBNEMsSUFBSW9oQixPQUFKO0FBQVl0aEIsTUFBTSxDQUFDQyxJQUFQLENBQVksZ0JBQVosRUFBNkI7QUFBQ3FoQixTQUFPLENBQUNwaEIsQ0FBRCxFQUFHO0FBQUNvaEIsV0FBTyxHQUFDcGhCLENBQVI7QUFBVTs7QUFBdEIsQ0FBN0IsRUFBcUQsQ0FBckQ7QUFBd0QsSUFBSW9KLGNBQUosRUFBbUJzSyxXQUFuQjtBQUErQjVULE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLDJEQUFaLEVBQXdFO0FBQUNxSixnQkFBYyxDQUFDcEosQ0FBRCxFQUFHO0FBQUNvSixrQkFBYyxHQUFDcEosQ0FBZjtBQUFpQixHQUFwQzs7QUFBcUMwVCxhQUFXLENBQUMxVCxDQUFELEVBQUc7QUFBQzBULGVBQVcsR0FBQzFULENBQVo7QUFBYzs7QUFBbEUsQ0FBeEUsRUFBNEksQ0FBNUk7QUFJdkpxZixHQUFHLENBQUNFLFFBQUosQ0FBYSxRQUFiLEVBQXVCO0FBQUNDLGNBQVksRUFBRTtBQUFmLENBQXZCLEVBQThDO0FBQzVDQyxLQUFHLEVBQUU7QUFDSEMsVUFBTSxFQUFFLFlBQVc7QUFDakIsVUFBSTtBQUNGLGNBQU1qZSxJQUFJLEdBQUcyZixPQUFPLENBQUMxTixXQUFXLEdBQUNBLFdBQUQsR0FBYXRLLGNBQXpCLENBQXBCO0FBQ0EsZUFBTztBQUFDLG9CQUFVLFNBQVg7QUFBc0Isa0JBQU8zSDtBQUE3QixTQUFQO0FBQ0QsT0FIRCxDQUdDLE9BQU00ZixFQUFOLEVBQVM7QUFDSixlQUFPO0FBQUMsb0JBQVUsUUFBWDtBQUFxQixrQkFBUUEsRUFBRSxDQUFDMVEsUUFBSDtBQUE3QixTQUFQO0FBQ0w7QUFDRjtBQVJFO0FBRHVDLENBQTlDLEU7Ozs7Ozs7Ozs7Ozs7OztBQ0pBLElBQUkwTyxHQUFKO0FBQVF2ZixNQUFNLENBQUNDLElBQVAsQ0FBWSxZQUFaLEVBQXlCO0FBQUNzZixLQUFHLENBQUNyZixDQUFELEVBQUc7QUFBQ3FmLE9BQUcsR0FBQ3JmLENBQUo7QUFBTTs7QUFBZCxDQUF6QixFQUF5QyxDQUF6QztBQUE0QyxJQUFJSCxNQUFKO0FBQVdDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGVBQVosRUFBNEI7QUFBQ0YsUUFBTSxDQUFDRyxDQUFELEVBQUc7QUFBQ0gsVUFBTSxHQUFDRyxDQUFQO0FBQVM7O0FBQXBCLENBQTVCLEVBQWtELENBQWxEO0FBQXFELElBQUl3TCxRQUFKO0FBQWExTCxNQUFNLENBQUNDLElBQVAsQ0FBWSxzQkFBWixFQUFtQztBQUFDeUwsVUFBUSxDQUFDeEwsQ0FBRCxFQUFHO0FBQUN3TCxZQUFRLEdBQUN4TCxDQUFUO0FBQVc7O0FBQXhCLENBQW5DLEVBQTZELENBQTdEO0FBQWdFLElBQUlzQyxZQUFKO0FBQWlCeEMsTUFBTSxDQUFDQyxJQUFQLENBQVksY0FBWixFQUEyQjtBQUFDbUIsU0FBTyxDQUFDbEIsQ0FBRCxFQUFHO0FBQUNzQyxnQkFBWSxHQUFDdEMsQ0FBYjtBQUFlOztBQUEzQixDQUEzQixFQUF3RCxDQUF4RDtBQUEyRCxJQUFJQyxLQUFKO0FBQVVILE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLHVCQUFaLEVBQW9DO0FBQUNFLE9BQUssQ0FBQ0QsQ0FBRCxFQUFHO0FBQUNDLFNBQUssR0FBQ0QsQ0FBTjtBQUFROztBQUFsQixDQUFwQyxFQUF3RCxDQUF4RDtBQUEyRCxJQUFJc2UsT0FBSjtBQUFZeGUsTUFBTSxDQUFDQyxJQUFQLENBQVksc0RBQVosRUFBbUU7QUFBQ3VlLFNBQU8sQ0FBQ3RlLENBQUQsRUFBRztBQUFDc2UsV0FBTyxHQUFDdGUsQ0FBUjtBQUFVOztBQUF0QixDQUFuRSxFQUEyRixDQUEzRjtBQU85VixNQUFNc2hCLGtCQUFrQixHQUFHLElBQUloZixZQUFKLENBQWlCO0FBQ3hDNEksU0FBTyxFQUFFO0FBQ0x6SCxRQUFJLEVBQUVDLE1BREQ7QUFFTEksWUFBUSxFQUFDO0FBRkosR0FEK0I7QUFLeEM4RyxVQUFRLEVBQUU7QUFDTm5ILFFBQUksRUFBRUMsTUFEQTtBQUVOQyxTQUFLLEVBQUUsMkRBRkQ7QUFHTkcsWUFBUSxFQUFDO0FBSEgsR0FMOEI7QUFVeENzSCxZQUFVLEVBQUU7QUFDUjNILFFBQUksRUFBRUMsTUFERTtBQUVSQyxTQUFLLEVBQUVyQixZQUFZLENBQUNzQixLQUFiLENBQW1CZ0ksS0FGbEI7QUFHUjlILFlBQVEsRUFBQztBQUhELEdBVjRCO0FBZXhDK0gsYUFBVyxFQUFDO0FBQ1JwSSxRQUFJLEVBQUVDLE1BREU7QUFFUkMsU0FBSyxFQUFFLDJEQUZDO0FBR1JHLFlBQVEsRUFBQztBQUhEO0FBZjRCLENBQWpCLENBQTNCO0FBc0JBLE1BQU15ZCxnQkFBZ0IsR0FBRyxJQUFJamYsWUFBSixDQUFpQjtBQUN0Q3VhLFVBQVEsRUFBRTtBQUNScFosUUFBSSxFQUFFQyxNQURFO0FBRVJDLFNBQUssRUFBRSwrQkFGQyxDQUVnQzs7QUFGaEMsR0FENEI7QUFLdEN3QyxPQUFLLEVBQUU7QUFDTDFDLFFBQUksRUFBRUMsTUFERDtBQUVMQyxTQUFLLEVBQUVyQixZQUFZLENBQUNzQixLQUFiLENBQW1CZ0k7QUFGckIsR0FMK0I7QUFTdENtUixVQUFRLEVBQUU7QUFDUnRaLFFBQUksRUFBRUMsTUFERTtBQUVSQyxTQUFLLEVBQUUsK0JBRkMsQ0FFK0I7O0FBRi9CLEdBVDRCO0FBYXRDNkksY0FBWSxFQUFDO0FBQ1QvSSxRQUFJLEVBQUU2ZCxrQkFERztBQUVUeGQsWUFBUSxFQUFDO0FBRkE7QUFieUIsQ0FBakIsQ0FBekI7QUFrQkUsTUFBTTBkLGdCQUFnQixHQUFHLElBQUlsZixZQUFKLENBQWlCO0FBQ3hDa0ssY0FBWSxFQUFDO0FBQ1QvSSxRQUFJLEVBQUU2ZDtBQURHO0FBRDJCLENBQWpCLENBQXpCLEMsQ0FNRjs7QUFDQSxNQUFNRyxpQkFBaUIsR0FDckI7QUFDRUMsTUFBSSxFQUFDLE9BRFA7QUFFRUMsY0FBWSxFQUNaO0FBQ0luQyxnQkFBWSxFQUFHLElBRG5CLENBRUk7O0FBRkosR0FIRjtBQU9Fb0MsbUJBQWlCLEVBQUUsQ0FBQyxPQUFELEVBQVMsV0FBVCxDQVByQjtBQVFFQyxXQUFTLEVBQ1Q7QUFDSUMsVUFBTSxFQUFDO0FBQUNDLGtCQUFZLEVBQUc7QUFBaEIsS0FEWDtBQUVJMUIsUUFBSSxFQUNKO0FBQ0kwQixrQkFBWSxFQUFHLE9BRG5CO0FBRUlyQyxZQUFNLEVBQUUsWUFBVTtBQUNkLGNBQU1ZLE9BQU8sR0FBRyxLQUFLSCxXQUFyQjtBQUNBLGNBQU1JLE9BQU8sR0FBRyxLQUFLQyxVQUFyQjtBQUNBLFlBQUlOLE1BQU0sR0FBRyxFQUFiO0FBQ0EsWUFBR0ksT0FBTyxLQUFLL1gsU0FBZixFQUEwQjJYLE1BQU0sbUNBQU9JLE9BQVAsQ0FBTjtBQUMxQixZQUFHQyxPQUFPLEtBQUtoWSxTQUFmLEVBQTBCMlgsTUFBTSxtQ0FBT0EsTUFBUCxFQUFrQkssT0FBbEIsQ0FBTjs7QUFDMUIsWUFBRztBQUNDLGNBQUlsZ0IsTUFBSjtBQUNBa2hCLDBCQUFnQixDQUFDbGdCLFFBQWpCLENBQTBCNmUsTUFBMUI7QUFDQTVCLGlCQUFPLENBQUMsV0FBRCxFQUFhNEIsTUFBYixDQUFQOztBQUNBLGNBQUdBLE1BQU0sQ0FBQzFULFlBQVAsS0FBd0JqRSxTQUEzQixFQUFxQztBQUNqQ2xJLGtCQUFNLEdBQUdtTCxRQUFRLENBQUNxUyxVQUFULENBQW9CO0FBQUNoQixzQkFBUSxFQUFDcUQsTUFBTSxDQUFDckQsUUFBakI7QUFDekIxVyxtQkFBSyxFQUFDK1osTUFBTSxDQUFDL1osS0FEWTtBQUV6QjRXLHNCQUFRLEVBQUNtRCxNQUFNLENBQUNuRCxRQUZTO0FBR3pCdFEscUJBQU8sRUFBQztBQUFDRCw0QkFBWSxFQUFDMFQsTUFBTSxDQUFDMVQ7QUFBckI7QUFIaUIsYUFBcEIsQ0FBVDtBQUlILFdBTEQsTUFNSTtBQUNBbk0sa0JBQU0sR0FBR21MLFFBQVEsQ0FBQ3FTLFVBQVQsQ0FBb0I7QUFBQ2hCLHNCQUFRLEVBQUNxRCxNQUFNLENBQUNyRCxRQUFqQjtBQUEwQjFXLG1CQUFLLEVBQUMrWixNQUFNLENBQUMvWixLQUF2QztBQUE2QzRXLHNCQUFRLEVBQUNtRCxNQUFNLENBQUNuRCxRQUE3RDtBQUF1RXRRLHFCQUFPLEVBQUM7QUFBL0UsYUFBcEIsQ0FBVDtBQUNIOztBQUNELGlCQUFPO0FBQUMxRSxrQkFBTSxFQUFFLFNBQVQ7QUFBb0J0RyxnQkFBSSxFQUFFO0FBQUN3RyxvQkFBTSxFQUFFNUg7QUFBVDtBQUExQixXQUFQO0FBQ0gsU0FkRCxDQWNFLE9BQU1xQixLQUFOLEVBQWE7QUFDYixpQkFBTztBQUFDc2Usc0JBQVUsRUFBRSxHQUFiO0FBQWtCQyxnQkFBSSxFQUFFO0FBQUNsWSxvQkFBTSxFQUFFLE1BQVQ7QUFBaUJvRCxxQkFBTyxFQUFFekosS0FBSyxDQUFDeUo7QUFBaEM7QUFBeEIsV0FBUDtBQUNEO0FBRUo7QUExQkwsS0FISjtBQStCSTJWLE9BQUcsRUFDSDtBQUNJcEIsWUFBTSxFQUFFLFlBQVU7QUFDZCxjQUFNWSxPQUFPLEdBQUcsS0FBS0gsV0FBckI7QUFDQSxjQUFNSSxPQUFPLEdBQUcsS0FBS0MsVUFBckI7QUFDQSxZQUFJTixNQUFNLEdBQUcsRUFBYjtBQUNBLFlBQUlPLEdBQUcsR0FBQyxLQUFLcGdCLE1BQWI7QUFDQSxjQUFNMmhCLE9BQU8sR0FBQyxLQUFLckMsU0FBTCxDQUFlelgsRUFBN0I7QUFDQSxZQUFHb1ksT0FBTyxLQUFLL1gsU0FBZixFQUEwQjJYLE1BQU0sbUNBQU9JLE9BQVAsQ0FBTjtBQUMxQixZQUFHQyxPQUFPLEtBQUtoWSxTQUFmLEVBQTBCMlgsTUFBTSxtQ0FBT0EsTUFBUCxFQUFrQkssT0FBbEIsQ0FBTjs7QUFFMUIsWUFBRztBQUFFO0FBQ0QsY0FBRyxDQUFDdGdCLEtBQUssQ0FBQ00sWUFBTixDQUFtQmtnQixHQUFuQixFQUF3QixPQUF4QixDQUFKLEVBQXFDO0FBQ2pDLGdCQUFHQSxHQUFHLEtBQUd1QixPQUFULEVBQWlCO0FBQ2Isb0JBQU1yZ0IsS0FBSyxDQUFDLGVBQUQsQ0FBWDtBQUNIO0FBQ0o7O0FBQ0Q2ZiwwQkFBZ0IsQ0FBQ25nQixRQUFqQixDQUEwQjZlLE1BQTFCOztBQUNBLGNBQUcsQ0FBQ3JnQixNQUFNLENBQUMwTSxLQUFQLENBQWFySixNQUFiLENBQW9CLEtBQUt5YyxTQUFMLENBQWV6WCxFQUFuQyxFQUFzQztBQUFDK0ksZ0JBQUksRUFBQztBQUFDLHNDQUF1QmlQLE1BQU0sQ0FBQzFUO0FBQS9CO0FBQU4sV0FBdEMsQ0FBSixFQUErRjtBQUMzRixrQkFBTTdLLEtBQUssQ0FBQyx1QkFBRCxDQUFYO0FBQ0g7O0FBQ0QsaUJBQU87QUFBQ29HLGtCQUFNLEVBQUUsU0FBVDtBQUFvQnRHLGdCQUFJLEVBQUU7QUFBQ3dHLG9CQUFNLEVBQUUsS0FBSzBYLFNBQUwsQ0FBZXpYLEVBQXhCO0FBQTRCc0UsMEJBQVksRUFBQzBULE1BQU0sQ0FBQzFUO0FBQWhEO0FBQTFCLFdBQVA7QUFDSCxTQVhELENBV0UsT0FBTTlLLEtBQU4sRUFBYTtBQUNiLGlCQUFPO0FBQUNzZSxzQkFBVSxFQUFFLEdBQWI7QUFBa0JDLGdCQUFJLEVBQUU7QUFBQ2xZLG9CQUFNLEVBQUUsTUFBVDtBQUFpQm9ELHFCQUFPLEVBQUV6SixLQUFLLENBQUN5SjtBQUFoQztBQUF4QixXQUFQO0FBQ0Q7QUFDSjtBQXhCTDtBQWhDSjtBQVRGLENBREY7QUFzRUFrVSxHQUFHLENBQUM0QyxhQUFKLENBQWtCcGlCLE1BQU0sQ0FBQzBNLEtBQXpCLEVBQStCa1YsaUJBQS9CLEU7Ozs7Ozs7Ozs7Ozs7OztBQzVIQSxJQUFJcEMsR0FBSjtBQUFRdmYsTUFBTSxDQUFDQyxJQUFQLENBQVksWUFBWixFQUF5QjtBQUFDc2YsS0FBRyxDQUFDcmYsQ0FBRCxFQUFHO0FBQUNxZixPQUFHLEdBQUNyZixDQUFKO0FBQU07O0FBQWQsQ0FBekIsRUFBeUMsQ0FBekM7QUFBNEMsSUFBSTJhLFdBQUo7QUFBZ0I3YSxNQUFNLENBQUNDLElBQVAsQ0FBWSxzREFBWixFQUFtRTtBQUFDbUIsU0FBTyxDQUFDbEIsQ0FBRCxFQUFHO0FBQUMyYSxlQUFXLEdBQUMzYSxDQUFaO0FBQWM7O0FBQTFCLENBQW5FLEVBQStGLENBQS9GO0FBR3BFcWYsR0FBRyxDQUFDRSxRQUFKLENBQWEsZUFBYixFQUE4QjtBQUFDQyxjQUFZLEVBQUU7QUFBZixDQUE5QixFQUFvRDtBQUNsREMsS0FBRyxFQUFFO0FBQ0hELGdCQUFZLEVBQUUsS0FEWDtBQUVIRSxVQUFNLEVBQUUsWUFBVztBQUNmLFlBQU1ZLE9BQU8sR0FBRyxLQUFLSCxXQUFyQjtBQUNBLFlBQU1JLE9BQU8sR0FBRyxLQUFLQyxVQUFyQjtBQUNBLFVBQUlOLE1BQU0sR0FBRyxFQUFiO0FBQ0EsVUFBR0ksT0FBTyxLQUFLL1gsU0FBZixFQUEwQjJYLE1BQU0sbUNBQU9JLE9BQVAsQ0FBTjtBQUMxQixVQUFHQyxPQUFPLEtBQUtoWSxTQUFmLEVBQTBCMlgsTUFBTSxtQ0FBT0EsTUFBUCxFQUFrQkssT0FBbEIsQ0FBTjs7QUFFNUIsVUFBSTtBQUNGLGNBQU1RLEdBQUcsR0FBR3BHLFdBQVcsQ0FBQ3VGLE1BQUQsQ0FBdkI7QUFDQSxlQUFPO0FBQUNuWSxnQkFBTSxFQUFFLFNBQVQ7QUFBb0J0RyxjQUFJLEVBQUU7QUFBQ3NmO0FBQUQ7QUFBMUIsU0FBUDtBQUNELE9BSEQsQ0FHRSxPQUFNcmYsS0FBTixFQUFhO0FBQ2IsZUFBTztBQUFDc2Usb0JBQVUsRUFBRSxHQUFiO0FBQWtCQyxjQUFJLEVBQUU7QUFBQ2xZLGtCQUFNLEVBQUUsTUFBVDtBQUFpQm9ELG1CQUFPLEVBQUV6SixLQUFLLENBQUN5SjtBQUFoQztBQUF4QixTQUFQO0FBQ0Q7QUFDRjtBQWZFO0FBRDZDLENBQXBELEU7Ozs7Ozs7Ozs7O0FDSEFyTCxNQUFNLENBQUNzQyxNQUFQLENBQWM7QUFBQzRHLHdCQUFzQixFQUFDLE1BQUlBLHNCQUE1QjtBQUFtRHNMLCtCQUE2QixFQUFDLE1BQUlBLDZCQUFyRjtBQUFtSGdMLHdCQUFzQixFQUFDLE1BQUlBLHNCQUE5STtBQUFxS3ZXLGlCQUFlLEVBQUMsTUFBSUEsZUFBekw7QUFBeU1xWCxrQkFBZ0IsRUFBQyxNQUFJQSxnQkFBOU47QUFBK09uWCxVQUFRLEVBQUMsTUFBSUEsUUFBNVA7QUFBcVFDLFNBQU8sRUFBQyxNQUFJQSxPQUFqUjtBQUF5Um1XLEtBQUcsRUFBQyxNQUFJQTtBQUFqUyxDQUFkO0FBQXFULElBQUk2QyxRQUFKO0FBQWFwaUIsTUFBTSxDQUFDQyxJQUFQLENBQVksd0JBQVosRUFBcUM7QUFBQ21pQixVQUFRLENBQUNsaUIsQ0FBRCxFQUFHO0FBQUNraUIsWUFBUSxHQUFDbGlCLENBQVQ7QUFBVzs7QUFBeEIsQ0FBckMsRUFBK0QsQ0FBL0Q7QUFBa0UsSUFBSW9iLE9BQUo7QUFBWXRiLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLHVEQUFaLEVBQW9FO0FBQUNxYixTQUFPLENBQUNwYixDQUFELEVBQUc7QUFBQ29iLFdBQU8sR0FBQ3BiLENBQVI7QUFBVTs7QUFBdEIsQ0FBcEUsRUFBNEYsQ0FBNUY7QUFBK0YsSUFBSTZiLFFBQUosRUFBYUMsV0FBYixFQUF5QkMsVUFBekIsRUFBb0NDLFNBQXBDO0FBQThDbGMsTUFBTSxDQUFDQyxJQUFQLENBQVksdURBQVosRUFBb0U7QUFBQzhiLFVBQVEsQ0FBQzdiLENBQUQsRUFBRztBQUFDNmIsWUFBUSxHQUFDN2IsQ0FBVDtBQUFXLEdBQXhCOztBQUF5QjhiLGFBQVcsQ0FBQzliLENBQUQsRUFBRztBQUFDOGIsZUFBVyxHQUFDOWIsQ0FBWjtBQUFjLEdBQXREOztBQUF1RCtiLFlBQVUsQ0FBQy9iLENBQUQsRUFBRztBQUFDK2IsY0FBVSxHQUFDL2IsQ0FBWDtBQUFhLEdBQWxGOztBQUFtRmdjLFdBQVMsQ0FBQ2hjLENBQUQsRUFBRztBQUFDZ2MsYUFBUyxHQUFDaGMsQ0FBVjtBQUFZOztBQUE1RyxDQUFwRSxFQUFrTCxDQUFsTDtBQUl0aEIsTUFBTWdKLHNCQUFzQixHQUFHLGdCQUEvQjtBQUNBLE1BQU1zTCw2QkFBNkIsR0FBRyxRQUF0QztBQUNBLE1BQU1nTCxzQkFBc0IsR0FBRyxjQUEvQjtBQUNBLE1BQU12VyxlQUFlLEdBQUcsVUFBeEI7QUFDQSxNQUFNcVgsZ0JBQWdCLEdBQUcsUUFBekI7QUFDQSxNQUFNblgsUUFBUSxHQUFHLE1BQWpCO0FBQ0EsTUFBTUMsT0FBTyxHQUFHLElBQWhCO0FBRUEsTUFBTW1XLEdBQUcsR0FBRyxJQUFJNkMsUUFBSixDQUFhO0FBQzlCQyxTQUFPLEVBQUVsWixRQURxQjtBQUU5QnRCLFNBQU8sRUFBRXVCLE9BRnFCO0FBRzlCa1osZ0JBQWMsRUFBRSxJQUhjO0FBSTlCQyxZQUFVLEVBQUU7QUFKa0IsQ0FBYixDQUFaO0FBT1AsSUFBR2pILE9BQU8sRUFBVixFQUFjb0QsT0FBTyxDQUFDLG9CQUFELENBQVA7QUFDZCxJQUFHeEMsU0FBUyxDQUFDSCxRQUFELENBQVosRUFBd0IyQyxPQUFPLENBQUMsbUJBQUQsQ0FBUDtBQUN4QixJQUFHeEMsU0FBUyxDQUFDRixXQUFELENBQVosRUFBMkIwQyxPQUFPLENBQUMsc0JBQUQsQ0FBUDtBQUMzQixJQUFHeEMsU0FBUyxDQUFDRCxVQUFELENBQVosRUFBMEJ5QyxPQUFPLENBQUMscUJBQUQsQ0FBUDs7QUFDMUJBLE9BQU8sQ0FBQyxtQkFBRCxDQUFQOztBQUNBQSxPQUFPLENBQUMscUJBQUQsQ0FBUCxDOzs7Ozs7Ozs7OztBQ3hCQTFlLE1BQU0sQ0FBQ3NDLE1BQVAsQ0FBYztBQUFDNFYsZ0JBQWMsRUFBQyxNQUFJQTtBQUFwQixDQUFkO0FBQW1ELElBQUlzSyxhQUFKLEVBQWtCdkssR0FBbEI7QUFBc0JqWSxNQUFNLENBQUNDLElBQVAsQ0FBWSw4QkFBWixFQUEyQztBQUFDdWlCLGVBQWEsQ0FBQ3RpQixDQUFELEVBQUc7QUFBQ3NpQixpQkFBYSxHQUFDdGlCLENBQWQ7QUFBZ0IsR0FBbEM7O0FBQW1DK1gsS0FBRyxDQUFDL1gsQ0FBRCxFQUFHO0FBQUMrWCxPQUFHLEdBQUMvWCxDQUFKO0FBQU07O0FBQWhELENBQTNDLEVBQTZGLENBQTdGO0FBQWdHLElBQUlILE1BQUo7QUFBV0MsTUFBTSxDQUFDQyxJQUFQLENBQVksZUFBWixFQUE0QjtBQUFDRixRQUFNLENBQUNHLENBQUQsRUFBRztBQUFDSCxVQUFNLEdBQUNHLENBQVA7QUFBUzs7QUFBcEIsQ0FBNUIsRUFBa0QsQ0FBbEQ7QUFBcUQsSUFBSXlDLE1BQUo7QUFBVzNDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGlEQUFaLEVBQThEO0FBQUNtQixTQUFPLENBQUNsQixDQUFELEVBQUc7QUFBQ3lDLFVBQU0sR0FBQ3pDLENBQVA7QUFBUzs7QUFBckIsQ0FBOUQsRUFBcUYsQ0FBckY7QUFBd0YsSUFBSWtELE1BQUo7QUFBV3BELE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGlEQUFaLEVBQThEO0FBQUNtQixTQUFPLENBQUNsQixDQUFELEVBQUc7QUFBQ2tELFVBQU0sR0FBQ2xELENBQVA7QUFBUzs7QUFBckIsQ0FBOUQsRUFBcUYsQ0FBckY7QUFBd0YsSUFBSStPLG1CQUFKO0FBQXdCalAsTUFBTSxDQUFDQyxJQUFQLENBQVksaUVBQVosRUFBOEU7QUFBQ21CLFNBQU8sQ0FBQ2xCLENBQUQsRUFBRztBQUFDK08sdUJBQW1CLEdBQUMvTyxDQUFwQjtBQUFzQjs7QUFBbEMsQ0FBOUUsRUFBa0gsQ0FBbEg7QUFBcUgsSUFBSThiLFdBQUosRUFBZ0JFLFNBQWhCO0FBQTBCbGMsTUFBTSxDQUFDQyxJQUFQLENBQVksb0RBQVosRUFBaUU7QUFBQytiLGFBQVcsQ0FBQzliLENBQUQsRUFBRztBQUFDOGIsZUFBVyxHQUFDOWIsQ0FBWjtBQUFjLEdBQTlCOztBQUErQmdjLFdBQVMsQ0FBQ2hjLENBQUQsRUFBRztBQUFDZ2MsYUFBUyxHQUFDaGMsQ0FBVjtBQUFZOztBQUF4RCxDQUFqRSxFQUEySCxDQUEzSDtBQUE4SCxJQUFJc2UsT0FBSjtBQUFZeGUsTUFBTSxDQUFDQyxJQUFQLENBQVksZ0RBQVosRUFBNkQ7QUFBQ3VlLFNBQU8sQ0FBQ3RlLENBQUQsRUFBRztBQUFDc2UsV0FBTyxHQUFDdGUsQ0FBUjtBQUFVOztBQUF0QixDQUE3RCxFQUFxRixDQUFyRjtBQUV6dEIsTUFBTWdZLGNBQWMsR0FBR3NLLGFBQWEsQ0FBQyxZQUFELENBQXBDO0FBU1B0SyxjQUFjLENBQUN1SyxXQUFmLENBQTJCLFFBQTNCLEVBQXFDO0FBQUNDLGFBQVcsRUFBRSxLQUFHO0FBQWpCLENBQXJDLEVBQTRELFVBQVV2VCxHQUFWLEVBQWV3VCxFQUFmLEVBQW1CO0FBQzdFLE1BQUk7QUFDRixVQUFNaGMsS0FBSyxHQUFHd0ksR0FBRyxDQUFDeE4sSUFBbEI7QUFDQWdCLFVBQU0sQ0FBQ2dFLEtBQUQsQ0FBTjtBQUNBd0ksT0FBRyxDQUFDWSxJQUFKO0FBQ0QsR0FKRCxDQUlFLE9BQU1oSCxTQUFOLEVBQWlCO0FBQ2pCb0csT0FBRyxDQUFDeVQsSUFBSjtBQUVFLFVBQU0sSUFBSTdpQixNQUFNLENBQUM4QixLQUFYLENBQWlCLGtDQUFqQixFQUFxRGtILFNBQXJELENBQU47QUFDSCxHQVJELFNBUVU7QUFDUjRaLE1BQUU7QUFDSDtBQUNGLENBWkQ7QUFjQXpLLGNBQWMsQ0FBQ3VLLFdBQWYsQ0FBMkIsUUFBM0IsRUFBcUM7QUFBQ0MsYUFBVyxFQUFFLEtBQUc7QUFBakIsQ0FBckMsRUFBNEQsVUFBVXZULEdBQVYsRUFBZXdULEVBQWYsRUFBbUI7QUFDN0UsTUFBSTtBQUNGLFVBQU1oYyxLQUFLLEdBQUd3SSxHQUFHLENBQUN4TixJQUFsQjtBQUNBeUIsVUFBTSxDQUFDdUQsS0FBRCxFQUFPd0ksR0FBUCxDQUFOO0FBQ0QsR0FIRCxDQUdFLE9BQU1wRyxTQUFOLEVBQWlCO0FBQ2pCb0csT0FBRyxDQUFDeVQsSUFBSjtBQUNBLFVBQU0sSUFBSTdpQixNQUFNLENBQUM4QixLQUFYLENBQWlCLGtDQUFqQixFQUFxRGtILFNBQXJELENBQU47QUFDRCxHQU5ELFNBTVU7QUFDUjRaLE1BQUU7QUFDSDtBQUNGLENBVkQ7QUFZQXpLLGNBQWMsQ0FBQ3VLLFdBQWYsQ0FBMkIscUJBQTNCLEVBQWtEO0FBQUNDLGFBQVcsRUFBRSxLQUFHO0FBQWpCLENBQWxELEVBQXlFLFVBQVV2VCxHQUFWLEVBQWV3VCxFQUFmLEVBQW1CO0FBQzFGLE1BQUk7QUFDRixRQUFHLENBQUN6RyxTQUFTLENBQUNGLFdBQUQsQ0FBYixFQUE0QjtBQUMxQjdNLFNBQUcsQ0FBQzBULEtBQUo7QUFDQTFULFNBQUcsQ0FBQ2dHLE1BQUo7QUFDQWhHLFNBQUcsQ0FBQzVMLE1BQUo7QUFDRCxLQUpELE1BSU8sQ0FDTDtBQUNEO0FBQ0YsR0FSRCxDQVFFLE9BQU13RixTQUFOLEVBQWlCO0FBQ2pCb0csT0FBRyxDQUFDeVQsSUFBSjtBQUNBLFVBQU0sSUFBSTdpQixNQUFNLENBQUM4QixLQUFYLENBQWlCLGdEQUFqQixFQUFtRWtILFNBQW5FLENBQU47QUFDRCxHQVhELFNBV1U7QUFDUjRaLE1BQUU7QUFDSDtBQUNGLENBZkQ7QUFpQkEsSUFBSTFLLEdBQUosQ0FBUUMsY0FBUixFQUF3QixTQUF4QixFQUFtQyxFQUFuQyxFQUNLNEssTUFETCxDQUNZO0FBQUVDLFVBQVEsRUFBRTdLLGNBQWMsQ0FBQzhLLEtBQWYsQ0FBcUI1VSxLQUFyQixDQUEyQjZVLElBQTNCLENBQWdDLGlCQUFoQztBQUFaLENBRFosRUFFSzFLLElBRkwsQ0FFVTtBQUFDQyxlQUFhLEVBQUU7QUFBaEIsQ0FGVjtBQUlBLElBQUkwSyxDQUFDLEdBQUdoTCxjQUFjLENBQUN1SyxXQUFmLENBQTJCLFNBQTNCLEVBQXFDO0FBQUVVLGNBQVksRUFBRSxLQUFoQjtBQUF1QlQsYUFBVyxFQUFFLEtBQUc7QUFBdkMsQ0FBckMsRUFBb0YsVUFBVXZULEdBQVYsRUFBZXdULEVBQWYsRUFBbUI7QUFDN0csUUFBTVMsT0FBTyxHQUFHLElBQUlsZ0IsSUFBSixFQUFoQjtBQUNFa2dCLFNBQU8sQ0FBQ0MsVUFBUixDQUFtQkQsT0FBTyxDQUFDRSxVQUFSLEtBQXVCLENBQTFDO0FBRUYsUUFBTUMsR0FBRyxHQUFHckwsY0FBYyxDQUFDeFgsSUFBZixDQUFvQjtBQUN4QnVILFVBQU0sRUFBRTtBQUFDdWIsU0FBRyxFQUFFdkwsR0FBRyxDQUFDd0w7QUFBVixLQURnQjtBQUV4QkMsV0FBTyxFQUFFO0FBQUNDLFNBQUcsRUFBRVA7QUFBTjtBQUZlLEdBQXBCLEVBR0o7QUFBQ3hpQixVQUFNLEVBQUU7QUFBRThDLFNBQUcsRUFBRTtBQUFQO0FBQVQsR0FISSxDQUFaO0FBS0U4YSxTQUFPLENBQUMsbUNBQUQsRUFBcUMrRSxHQUFyQyxDQUFQO0FBQ0FyTCxnQkFBYyxDQUFDMEwsVUFBZixDQUEwQkwsR0FBMUI7O0FBQ0EsTUFBR0EsR0FBRyxDQUFDcFgsTUFBSixHQUFhLENBQWhCLEVBQWtCO0FBQ2hCZ0QsT0FBRyxDQUFDWSxJQUFKLENBQVMsZ0NBQVQ7QUFDRDs7QUFDRDRTLElBQUU7QUFDTCxDQWZPLENBQVI7QUFpQkF6SyxjQUFjLENBQUN4WCxJQUFmLENBQW9CO0FBQUVpRCxNQUFJLEVBQUUsU0FBUjtBQUFtQnNFLFFBQU0sRUFBRTtBQUEzQixDQUFwQixFQUNLNGIsT0FETCxDQUNhO0FBQ0xDLE9BQUssRUFBRSxZQUFZO0FBQUVaLEtBQUMsQ0FBQ2EsT0FBRjtBQUFjO0FBRDlCLENBRGIsRTs7Ozs7Ozs7Ozs7QUMzRUEvakIsTUFBTSxDQUFDc0MsTUFBUCxDQUFjO0FBQUNtVyxVQUFRLEVBQUMsTUFBSUE7QUFBZCxDQUFkO0FBQXVDLElBQUkrSixhQUFKLEVBQWtCdkssR0FBbEI7QUFBc0JqWSxNQUFNLENBQUNDLElBQVAsQ0FBWSw4QkFBWixFQUEyQztBQUFDdWlCLGVBQWEsQ0FBQ3RpQixDQUFELEVBQUc7QUFBQ3NpQixpQkFBYSxHQUFDdGlCLENBQWQ7QUFBZ0IsR0FBbEM7O0FBQW1DK1gsS0FBRyxDQUFDL1gsQ0FBRCxFQUFHO0FBQUMrWCxPQUFHLEdBQUMvWCxDQUFKO0FBQU07O0FBQWhELENBQTNDLEVBQTZGLENBQTdGO0FBQWdHLElBQUlnSyxnQkFBSjtBQUFxQmxLLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLDJEQUFaLEVBQXdFO0FBQUNtQixTQUFPLENBQUNsQixDQUFELEVBQUc7QUFBQ2dLLG9CQUFnQixHQUFDaEssQ0FBakI7QUFBbUI7O0FBQS9CLENBQXhFLEVBQXlHLENBQXpHO0FBQTRHLElBQUlILE1BQUo7QUFBV0MsTUFBTSxDQUFDQyxJQUFQLENBQVksZUFBWixFQUE0QjtBQUFDRixRQUFNLENBQUNHLENBQUQsRUFBRztBQUFDSCxVQUFNLEdBQUNHLENBQVA7QUFBUzs7QUFBcEIsQ0FBNUIsRUFBa0QsQ0FBbEQ7QUFBcUQsSUFBSXNlLE9BQUo7QUFBWXhlLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGdEQUFaLEVBQTZEO0FBQUN1ZSxTQUFPLENBQUN0ZSxDQUFELEVBQUc7QUFBQ3NlLFdBQU8sR0FBQ3RlLENBQVI7QUFBVTs7QUFBdEIsQ0FBN0QsRUFBcUYsQ0FBckY7QUFBd0YsSUFBSWdZLGNBQUo7QUFBbUJsWSxNQUFNLENBQUNDLElBQVAsQ0FBWSxtQkFBWixFQUFnQztBQUFDaVksZ0JBQWMsQ0FBQ2hZLENBQUQsRUFBRztBQUFDZ1ksa0JBQWMsR0FBQ2hZLENBQWY7QUFBaUI7O0FBQXBDLENBQWhDLEVBQXNFLENBQXRFO0FBTTljLE1BQU11WSxRQUFRLEdBQUcrSixhQUFhLENBQUMsTUFBRCxDQUE5QjtBQUVQL0osUUFBUSxDQUFDZ0ssV0FBVCxDQUFxQixrQkFBckIsRUFBeUMsVUFBVXRULEdBQVYsRUFBZXdULEVBQWYsRUFBbUI7QUFDMUQsTUFBSTtBQUNGLFVBQU1oaEIsSUFBSSxHQUFHd04sR0FBRyxDQUFDeE4sSUFBakI7QUFDQXVJLG9CQUFnQixDQUFDdkksSUFBRCxDQUFoQjtBQUNBd04sT0FBRyxDQUFDWSxJQUFKO0FBQ0QsR0FKRCxDQUlFLE9BQU1oSCxTQUFOLEVBQWlCO0FBQ2pCb0csT0FBRyxDQUFDeVQsSUFBSjtBQUNBLFVBQU0sSUFBSTdpQixNQUFNLENBQUM4QixLQUFYLENBQWlCLHNDQUFqQixFQUF5RGtILFNBQXpELENBQU47QUFDRCxHQVBELFNBT1U7QUFDUjRaLE1BQUU7QUFDSDtBQUNGLENBWEQ7QUFjQSxJQUFJMUssR0FBSixDQUFRUSxRQUFSLEVBQWtCLFNBQWxCLEVBQTZCLEVBQTdCLEVBQ0txSyxNQURMLENBQ1k7QUFBRUMsVUFBUSxFQUFFdEssUUFBUSxDQUFDdUssS0FBVCxDQUFlNVUsS0FBZixDQUFxQjZVLElBQXJCLENBQTBCLGlCQUExQjtBQUFaLENBRFosRUFFSzFLLElBRkwsQ0FFVTtBQUFDQyxlQUFhLEVBQUU7QUFBaEIsQ0FGVjtBQUlBLElBQUkwSyxDQUFDLEdBQUd6SyxRQUFRLENBQUNnSyxXQUFULENBQXFCLFNBQXJCLEVBQStCO0FBQUVVLGNBQVksRUFBRSxLQUFoQjtBQUF1QlQsYUFBVyxFQUFFLEtBQUc7QUFBdkMsQ0FBL0IsRUFBOEUsVUFBVXZULEdBQVYsRUFBZXdULEVBQWYsRUFBbUI7QUFDckcsUUFBTVMsT0FBTyxHQUFHLElBQUlsZ0IsSUFBSixFQUFoQjtBQUNBa2dCLFNBQU8sQ0FBQ0MsVUFBUixDQUFtQkQsT0FBTyxDQUFDRSxVQUFSLEtBQXVCLENBQTFDO0FBRUEsUUFBTUMsR0FBRyxHQUFHOUssUUFBUSxDQUFDL1gsSUFBVCxDQUFjO0FBQ2xCdUgsVUFBTSxFQUFFO0FBQUN1YixTQUFHLEVBQUV2TCxHQUFHLENBQUN3TDtBQUFWLEtBRFU7QUFFbEJDLFdBQU8sRUFBRTtBQUFDQyxTQUFHLEVBQUVQO0FBQU47QUFGUyxHQUFkLEVBR1I7QUFBQ3hpQixVQUFNLEVBQUU7QUFBRThDLFNBQUcsRUFBRTtBQUFQO0FBQVQsR0FIUSxDQUFaO0FBS0E4YSxTQUFPLENBQUMsbUNBQUQsRUFBcUMrRSxHQUFyQyxDQUFQO0FBQ0E5SyxVQUFRLENBQUNtTCxVQUFULENBQW9CTCxHQUFwQjs7QUFDQSxNQUFHQSxHQUFHLENBQUNwWCxNQUFKLEdBQWEsQ0FBaEIsRUFBa0I7QUFDZGdELE9BQUcsQ0FBQ1ksSUFBSixDQUFTLGdDQUFUO0FBQ0g7O0FBQ0Q0UyxJQUFFO0FBQ0wsQ0FmTyxDQUFSO0FBaUJBbEssUUFBUSxDQUFDL1gsSUFBVCxDQUFjO0FBQUVpRCxNQUFJLEVBQUUsU0FBUjtBQUFtQnNFLFFBQU0sRUFBRTtBQUEzQixDQUFkLEVBQ0s0YixPQURMLENBQ2E7QUFDTEMsT0FBSyxFQUFFLFlBQVk7QUFBRVosS0FBQyxDQUFDYSxPQUFGO0FBQWM7QUFEOUIsQ0FEYixFOzs7Ozs7Ozs7OztBQzNDQS9qQixNQUFNLENBQUNzQyxNQUFQLENBQWM7QUFBQ3NLLFlBQVUsRUFBQyxNQUFJQTtBQUFoQixDQUFkO0FBQTJDLElBQUk3TSxNQUFKO0FBQVdDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGVBQVosRUFBNEI7QUFBQ0YsUUFBTSxDQUFDRyxDQUFELEVBQUc7QUFBQ0gsVUFBTSxHQUFDRyxDQUFQO0FBQVM7O0FBQXBCLENBQTVCLEVBQWtELENBQWxEO0FBQXFELElBQUk4akIsR0FBSjtBQUFRaGtCLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLEtBQVosRUFBa0I7QUFBQ21CLFNBQU8sQ0FBQ2xCLENBQUQsRUFBRztBQUFDOGpCLE9BQUcsR0FBQzlqQixDQUFKO0FBQU07O0FBQWxCLENBQWxCLEVBQXNDLENBQXRDO0FBQXlDLElBQUk2SCxPQUFKO0FBQVkvSCxNQUFNLENBQUNDLElBQVAsQ0FBWSxnREFBWixFQUE2RDtBQUFDOEgsU0FBTyxDQUFDN0gsQ0FBRCxFQUFHO0FBQUM2SCxXQUFPLEdBQUM3SCxDQUFSO0FBQVU7O0FBQXRCLENBQTdELEVBQXFGLENBQXJGOztBQUlqSyxTQUFTME0sVUFBVCxDQUFvQm5GLEdBQXBCLEVBQXlCd0MsTUFBekIsRUFBaUM7QUFDdEMsUUFBTWdhLFFBQVEsR0FBR2xrQixNQUFNLENBQUNta0IsU0FBUCxDQUFpQkMsY0FBakIsQ0FBakI7O0FBQ0EsTUFBSTtBQUNGLFVBQU1DLE9BQU8sR0FBR0gsUUFBUSxDQUFDeGMsR0FBRCxFQUFNd0MsTUFBTixDQUF4QjtBQUNBLFFBQUdtYSxPQUFPLEtBQUszYixTQUFmLEVBQTBCLE9BQU9BLFNBQVA7QUFDMUIsUUFBSTdCLEtBQUssR0FBRzZCLFNBQVo7QUFDQTJiLFdBQU8sQ0FBQ3JlLE9BQVIsQ0FBZ0JzZSxNQUFNLElBQUk7QUFDeEIsVUFBR0EsTUFBTSxDQUFDLENBQUQsQ0FBTixDQUFVelUsVUFBVixDQUFxQm5JLEdBQXJCLENBQUgsRUFBOEI7QUFDNUIsY0FBTXdaLEdBQUcsR0FBR29ELE1BQU0sQ0FBQyxDQUFELENBQU4sQ0FBVTdWLFNBQVYsQ0FBb0IvRyxHQUFHLENBQUMwRSxNQUFKLEdBQVcsQ0FBL0IsQ0FBWjtBQUNBdkYsYUFBSyxHQUFHcWEsR0FBRyxDQUFDcUQsSUFBSixFQUFSO0FBRUQ7QUFDRixLQU5EO0FBT0EsV0FBTzFkLEtBQVA7QUFDRCxHQVpELENBWUUsT0FBTWhGLEtBQU4sRUFBYTtBQUNiLFFBQUdBLEtBQUssQ0FBQ3lKLE9BQU4sQ0FBY3VFLFVBQWQsQ0FBeUIsa0JBQXpCLEtBQ0NoTyxLQUFLLENBQUN5SixPQUFOLENBQWN1RSxVQUFkLENBQXlCLG9CQUF6QixDQURKLEVBQ29ELE9BQU9uSCxTQUFQLENBRHBELEtBRUssTUFBTTdHLEtBQU47QUFDTjtBQUNGOztBQUVELFNBQVN1aUIsY0FBVCxDQUF3QjFjLEdBQXhCLEVBQTZCd0MsTUFBN0IsRUFBcUNySCxRQUFyQyxFQUErQztBQUMzQ21GLFNBQU8sQ0FBQywrQkFBRCxFQUFrQztBQUFDTixPQUFHLEVBQUNBLEdBQUw7QUFBU3dDLFVBQU0sRUFBQ0E7QUFBaEIsR0FBbEMsQ0FBUDtBQUNBK1osS0FBRyxDQUFDcFgsVUFBSixDQUFlM0MsTUFBZixFQUF1QixDQUFDb0wsR0FBRCxFQUFNK08sT0FBTixLQUFrQjtBQUN6Q3hoQixZQUFRLENBQUN5UyxHQUFELEVBQU0rTyxPQUFOLENBQVI7QUFDRCxHQUZDO0FBR0gsQzs7Ozs7Ozs7Ozs7QUM5QkRwa0IsTUFBTSxDQUFDc0MsTUFBUCxDQUFjO0FBQUNzTCxRQUFNLEVBQUMsTUFBSUEsTUFBWjtBQUFtQjJXLHVCQUFxQixFQUFDLE1BQUlBLHFCQUE3QztBQUFtRUMsZUFBYSxFQUFDLE1BQUlBLGFBQXJGO0FBQW1HL2EsYUFBVyxFQUFDLE1BQUlBLFdBQW5IO0FBQStIbUYsVUFBUSxFQUFDLE1BQUlBLFFBQTVJO0FBQXFKa0YsUUFBTSxFQUFDLE1BQUlBLE1BQWhLO0FBQXVLQyxTQUFPLEVBQUMsTUFBSUEsT0FBbkw7QUFBMkxwRixnQkFBYyxFQUFDLE1BQUlBLGNBQTlNO0FBQTZONEYsZ0JBQWMsRUFBQyxNQUFJQSxjQUFoUDtBQUErUDFGLG1CQUFpQixFQUFDLE1BQUlBLGlCQUFyUjtBQUF1UzVILFlBQVUsRUFBQyxNQUFJQSxVQUF0VDtBQUFpVXFhLFNBQU8sRUFBQyxNQUFJQTtBQUE3VSxDQUFkO0FBQXFXLElBQUl2aEIsTUFBSjtBQUFXQyxNQUFNLENBQUNDLElBQVAsQ0FBWSxlQUFaLEVBQTRCO0FBQUNGLFFBQU0sQ0FBQ0csQ0FBRCxFQUFHO0FBQUNILFVBQU0sR0FBQ0csQ0FBUDtBQUFTOztBQUFwQixDQUE1QixFQUFrRCxDQUFsRDtBQUFxRCxJQUFJMlQsYUFBSixFQUFrQi9KLFVBQWxCLEVBQTZCQyxRQUE3QjtBQUFzQy9KLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGdEQUFaLEVBQTZEO0FBQUM0VCxlQUFhLENBQUMzVCxDQUFELEVBQUc7QUFBQzJULGlCQUFhLEdBQUMzVCxDQUFkO0FBQWdCLEdBQWxDOztBQUFtQzRKLFlBQVUsQ0FBQzVKLENBQUQsRUFBRztBQUFDNEosY0FBVSxHQUFDNUosQ0FBWDtBQUFhLEdBQTlEOztBQUErRDZKLFVBQVEsQ0FBQzdKLENBQUQsRUFBRztBQUFDNkosWUFBUSxHQUFDN0osQ0FBVDtBQUFXOztBQUF0RixDQUE3RCxFQUFxSixDQUFySjtBQUkzYyxNQUFNdWtCLFNBQVMsR0FBRyxJQUFsQjs7QUFHTyxTQUFTN1csTUFBVCxDQUFnQjhXLE1BQWhCLEVBQXdCN2QsT0FBeEIsRUFBaUM7QUFDdEMsTUFBRyxDQUFDQSxPQUFKLEVBQVk7QUFDTkEsV0FBTyxHQUFHMGQscUJBQXFCLENBQUMsRUFBRCxDQUFyQixDQUEwQixDQUExQixDQUFWO0FBQ0ExUSxpQkFBYSxDQUFDLDBFQUFELEVBQTRFaE4sT0FBNUUsQ0FBYjtBQUNMOztBQUNELE1BQUcsQ0FBQ0EsT0FBSixFQUFZO0FBQ05BLFdBQU8sR0FBRzJkLGFBQWEsQ0FBQyxFQUFELENBQXZCO0FBQ0EzUSxpQkFBYSxDQUFDLDBFQUFELEVBQTRFaE4sT0FBNUUsQ0FBYjtBQUNMOztBQUNELFFBQU1vZCxRQUFRLEdBQUdsa0IsTUFBTSxDQUFDbWtCLFNBQVAsQ0FBaUJTLG9CQUFqQixDQUFqQjtBQUNBLFNBQU9WLFFBQVEsQ0FBQ1MsTUFBRCxFQUFTN2QsT0FBVCxDQUFmO0FBQ0Q7O0FBRUQsU0FBUzhkLG9CQUFULENBQThCRCxNQUE5QixFQUFzQzdkLE9BQXRDLEVBQStDakUsUUFBL0MsRUFBeUQ7QUFDdkQsUUFBTWdpQixVQUFVLEdBQUcvZCxPQUFuQjtBQUNBNmQsUUFBTSxDQUFDRyxHQUFQLENBQVcsYUFBWCxFQUEwQkQsVUFBMUIsRUFBc0MsVUFBU3ZQLEdBQVQsRUFBYzFULElBQWQsRUFBb0I7QUFDeEQsUUFBRzBULEdBQUgsRUFBU3RMLFFBQVEsQ0FBQyx1QkFBRCxFQUF5QnNMLEdBQXpCLENBQVI7QUFDVHpTLFlBQVEsQ0FBQ3lTLEdBQUQsRUFBTTFULElBQU4sQ0FBUjtBQUNELEdBSEQ7QUFJRDs7QUFFTSxTQUFTNGlCLHFCQUFULENBQStCRyxNQUEvQixFQUF1Q0ksTUFBdkMsRUFBK0M7QUFDbEQsUUFBTWIsUUFBUSxHQUFHbGtCLE1BQU0sQ0FBQ21rQixTQUFQLENBQWlCYSw4QkFBakIsQ0FBakI7QUFDQSxTQUFPZCxRQUFRLENBQUNTLE1BQUQsRUFBU0ksTUFBVCxDQUFmO0FBQ0g7O0FBRUQsU0FBU0MsOEJBQVQsQ0FBd0NMLE1BQXhDLEVBQWdETSxPQUFoRCxFQUF5RHBpQixRQUF6RCxFQUFtRTtBQUMvRCxRQUFNcWlCLFVBQVUsR0FBR0QsT0FBbkI7QUFDQU4sUUFBTSxDQUFDRyxHQUFQLENBQVcsdUJBQVgsRUFBb0NJLFVBQXBDLEVBQWdELFVBQVM1UCxHQUFULEVBQWMxVCxJQUFkLEVBQW9CO0FBQ2hFLFFBQUcwVCxHQUFILEVBQVN0TCxRQUFRLENBQUMsd0JBQUQsRUFBMEJzTCxHQUExQixDQUFSO0FBQ1R6UyxZQUFRLENBQUN5UyxHQUFELEVBQU0xVCxJQUFOLENBQVI7QUFDSCxHQUhEO0FBSUg7O0FBRU0sU0FBUzZpQixhQUFULENBQXVCRSxNQUF2QixFQUErQkksTUFBL0IsRUFBdUM7QUFDMUMsUUFBTWIsUUFBUSxHQUFHbGtCLE1BQU0sQ0FBQ21rQixTQUFQLENBQWlCZ0Isc0JBQWpCLENBQWpCO0FBQ0EsU0FBT2pCLFFBQVEsQ0FBQ1MsTUFBRCxFQUFTSSxNQUFULENBQWY7QUFDSDs7QUFDRCxTQUFTSSxzQkFBVCxDQUFnQ1IsTUFBaEMsRUFBd0NNLE9BQXhDLEVBQWlEcGlCLFFBQWpELEVBQTJEO0FBQ3ZELFFBQU1xaUIsVUFBVSxHQUFHRCxPQUFuQjtBQUNBTixRQUFNLENBQUNHLEdBQVAsQ0FBVyxnQkFBWCxFQUE2QkksVUFBN0IsRUFBeUMsVUFBUzVQLEdBQVQsRUFBYzFULElBQWQsRUFBb0I7QUFDekQsUUFBRzBULEdBQUgsRUFBU3RMLFFBQVEsQ0FBQyxpQkFBRCxFQUFtQnNMLEdBQW5CLENBQVI7QUFDVHpTLFlBQVEsQ0FBQ3lTLEdBQUQsRUFBTTFULElBQU4sQ0FBUjtBQUNILEdBSEQ7QUFJSDs7QUFHTSxTQUFTOEgsV0FBVCxDQUFxQmliLE1BQXJCLEVBQTZCN2QsT0FBN0IsRUFBc0N3RSxPQUF0QyxFQUErQztBQUNsRCxRQUFNNFksUUFBUSxHQUFHbGtCLE1BQU0sQ0FBQ21rQixTQUFQLENBQWlCaUIsb0JBQWpCLENBQWpCO0FBQ0EsU0FBT2xCLFFBQVEsQ0FBQ1MsTUFBRCxFQUFTN2QsT0FBVCxFQUFrQndFLE9BQWxCLENBQWY7QUFDSDs7QUFFRCxTQUFTOFosb0JBQVQsQ0FBOEJULE1BQTlCLEVBQXNDN2QsT0FBdEMsRUFBK0N3RSxPQUEvQyxFQUF3RHpJLFFBQXhELEVBQWtFO0FBQzlELFFBQU1naUIsVUFBVSxHQUFHL2QsT0FBbkI7QUFDQSxRQUFNdWUsVUFBVSxHQUFHL1osT0FBbkI7QUFDQXFaLFFBQU0sQ0FBQ0csR0FBUCxDQUFXLGFBQVgsRUFBMEJELFVBQTFCLEVBQXNDUSxVQUF0QyxFQUFrRCxVQUFTL1AsR0FBVCxFQUFjMVQsSUFBZCxFQUFvQjtBQUNsRWlCLFlBQVEsQ0FBQ3lTLEdBQUQsRUFBTTFULElBQU4sQ0FBUjtBQUNILEdBRkQ7QUFHSDs7QUFFTSxTQUFTaU4sUUFBVCxDQUFrQjhWLE1BQWxCLEVBQTBCdGMsRUFBMUIsRUFBOEI7QUFDbkMsUUFBTTZiLFFBQVEsR0FBR2xrQixNQUFNLENBQUNta0IsU0FBUCxDQUFpQm1CLGlCQUFqQixDQUFqQjtBQUNBLFNBQU9wQixRQUFRLENBQUNTLE1BQUQsRUFBU3RjLEVBQVQsQ0FBZjtBQUNEOztBQUVELFNBQVNpZCxpQkFBVCxDQUEyQlgsTUFBM0IsRUFBbUN0YyxFQUFuQyxFQUF1Q3hGLFFBQXZDLEVBQWlEO0FBQy9DLFFBQU0waUIsS0FBSyxHQUFHQyxPQUFPLENBQUNuZCxFQUFELENBQXJCO0FBQ0EwQixZQUFVLENBQUMsMEJBQUQsRUFBNEJ3YixLQUE1QixDQUFWO0FBQ0FaLFFBQU0sQ0FBQ0csR0FBUCxDQUFXLFdBQVgsRUFBd0JTLEtBQXhCLEVBQStCLFVBQVNqUSxHQUFULEVBQWMxVCxJQUFkLEVBQW9CO0FBQ2pELFFBQUcwVCxHQUFHLEtBQUs1TSxTQUFSLElBQXFCNE0sR0FBRyxLQUFLLElBQTdCLElBQXFDQSxHQUFHLENBQUNoSyxPQUFKLENBQVl1RSxVQUFaLENBQXVCLGdCQUF2QixDQUF4QyxFQUFrRjtBQUNoRnlGLFNBQUcsR0FBRzVNLFNBQU4sRUFDQTlHLElBQUksR0FBRzhHLFNBRFA7QUFFRDs7QUFDRDdGLFlBQVEsQ0FBQ3lTLEdBQUQsRUFBTTFULElBQU4sQ0FBUjtBQUNELEdBTkQ7QUFPRDs7QUFFTSxTQUFTbVMsTUFBVCxDQUFnQjRRLE1BQWhCLEVBQXdCN2QsT0FBeEIsRUFBaUM7QUFDcEMsUUFBTW9kLFFBQVEsR0FBR2xrQixNQUFNLENBQUNta0IsU0FBUCxDQUFpQnNCLGVBQWpCLENBQWpCO0FBQ0EsU0FBT3ZCLFFBQVEsQ0FBQ1MsTUFBRCxFQUFTN2QsT0FBVCxDQUFmO0FBQ0g7O0FBRUQsU0FBUzJlLGVBQVQsQ0FBeUJkLE1BQXpCLEVBQWlDN2QsT0FBakMsRUFBMENqRSxRQUExQyxFQUFvRDtBQUNoRCxRQUFNeVEsV0FBVyxHQUFHeE0sT0FBcEI7QUFDQTZkLFFBQU0sQ0FBQ0csR0FBUCxDQUFXLGVBQVgsRUFBNEJ4UixXQUE1QixFQUF5QyxNQUF6QyxFQUFpRCxVQUFTZ0MsR0FBVCxFQUFjMVQsSUFBZCxFQUFvQjtBQUNqRWlCLFlBQVEsQ0FBQ3lTLEdBQUQsRUFBTTFULElBQU4sQ0FBUjtBQUNILEdBRkQ7QUFHSDs7QUFFTSxTQUFTb1MsT0FBVCxDQUFpQjJRLE1BQWpCLEVBQXlCcGpCLElBQXpCLEVBQStCc0YsS0FBL0IsRUFBc0NDLE9BQXRDLEVBQStDO0FBQ2xELFFBQU1vZCxRQUFRLEdBQUdsa0IsTUFBTSxDQUFDbWtCLFNBQVAsQ0FBaUJ1QixnQkFBakIsQ0FBakI7QUFDQSxTQUFPeEIsUUFBUSxDQUFDUyxNQUFELEVBQVNwakIsSUFBVCxFQUFlc0YsS0FBZixFQUFzQkMsT0FBdEIsQ0FBZjtBQUNIOztBQUVELFNBQVM0ZSxnQkFBVCxDQUEwQmYsTUFBMUIsRUFBa0NwakIsSUFBbEMsRUFBd0NzRixLQUF4QyxFQUErQ0MsT0FBL0MsRUFBd0RqRSxRQUF4RCxFQUFrRTtBQUM5RCxRQUFNOGlCLE9BQU8sR0FBR0gsT0FBTyxDQUFDamtCLElBQUQsQ0FBdkI7QUFDQSxRQUFNcWtCLFFBQVEsR0FBRy9lLEtBQWpCO0FBQ0EsUUFBTXlNLFdBQVcsR0FBR3hNLE9BQXBCOztBQUNBLE1BQUcsQ0FBQ0EsT0FBSixFQUFhO0FBQ1Q2ZCxVQUFNLENBQUNHLEdBQVAsQ0FBVyxVQUFYLEVBQXVCYSxPQUF2QixFQUFnQ0MsUUFBaEMsRUFBMEMsVUFBVXRRLEdBQVYsRUFBZTFULElBQWYsRUFBcUI7QUFDM0RpQixjQUFRLENBQUN5UyxHQUFELEVBQU0xVCxJQUFOLENBQVI7QUFDSCxLQUZEO0FBR0gsR0FKRCxNQUlLO0FBQ0QraUIsVUFBTSxDQUFDRyxHQUFQLENBQVcsVUFBWCxFQUF1QmEsT0FBdkIsRUFBZ0NDLFFBQWhDLEVBQTBDdFMsV0FBMUMsRUFBdUQsVUFBU2dDLEdBQVQsRUFBYzFULElBQWQsRUFBb0I7QUFDdkVpQixjQUFRLENBQUN5UyxHQUFELEVBQU0xVCxJQUFOLENBQVI7QUFDSCxLQUZEO0FBR0g7QUFDSjs7QUFFTSxTQUFTZ04sY0FBVCxDQUF3QitWLE1BQXhCLEVBQWdDa0IsS0FBaEMsRUFBdUM7QUFDMUMsUUFBTTNCLFFBQVEsR0FBR2xrQixNQUFNLENBQUNta0IsU0FBUCxDQUFpQjJCLHVCQUFqQixDQUFqQjtBQUNBLE1BQUlDLFFBQVEsR0FBR0YsS0FBZjtBQUNBLE1BQUdFLFFBQVEsS0FBS3JkLFNBQWhCLEVBQTJCcWQsUUFBUSxHQUFHLElBQVg7QUFDM0IsU0FBTzdCLFFBQVEsQ0FBQ1MsTUFBRCxFQUFTb0IsUUFBVCxDQUFmO0FBQ0g7O0FBRUQsU0FBU0QsdUJBQVQsQ0FBaUNuQixNQUFqQyxFQUF5Q2tCLEtBQXpDLEVBQWdEaGpCLFFBQWhELEVBQTBEO0FBQ3RELE1BQUlrakIsUUFBUSxHQUFHRixLQUFmO0FBQ0EsTUFBR0UsUUFBUSxLQUFLLElBQWhCLEVBQXNCcEIsTUFBTSxDQUFDRyxHQUFQLENBQVcsZ0JBQVgsRUFBNkIsVUFBU3hQLEdBQVQsRUFBYzFULElBQWQsRUFBb0I7QUFDbkVpQixZQUFRLENBQUN5UyxHQUFELEVBQU0xVCxJQUFOLENBQVI7QUFDSCxHQUZxQixFQUF0QixLQUdLK2lCLE1BQU0sQ0FBQ0csR0FBUCxDQUFXLGdCQUFYLEVBQTZCaUIsUUFBN0IsRUFBdUMsVUFBU3pRLEdBQVQsRUFBYzFULElBQWQsRUFBb0I7QUFDNURpQixZQUFRLENBQUN5UyxHQUFELEVBQU0xVCxJQUFOLENBQVI7QUFDSCxHQUZJO0FBR1I7O0FBRU0sU0FBUzRTLGNBQVQsQ0FBd0JtUSxNQUF4QixFQUFnQ3hWLElBQWhDLEVBQXNDO0FBQ3pDLFFBQU0rVSxRQUFRLEdBQUdsa0IsTUFBTSxDQUFDbWtCLFNBQVAsQ0FBaUI2Qix1QkFBakIsQ0FBakI7QUFDQSxTQUFPOUIsUUFBUSxDQUFDUyxNQUFELEVBQVN4VixJQUFULENBQWY7QUFDSDs7QUFFRCxTQUFTNlcsdUJBQVQsQ0FBaUNyQixNQUFqQyxFQUF5Q3hWLElBQXpDLEVBQStDdE0sUUFBL0MsRUFBeUQ7QUFDckRrSCxZQUFVLENBQUMsMEJBQUQsRUFBNEJvRixJQUE1QixDQUFWO0FBQ0F3VixRQUFNLENBQUNHLEdBQVAsQ0FBVyxnQkFBWCxFQUE2QjNWLElBQTdCLEVBQW1DLFVBQVNtRyxHQUFULEVBQWMxVCxJQUFkLEVBQW9CO0FBQ25ELFFBQUcwVCxHQUFILEVBQVN0TCxRQUFRLENBQUMsMEJBQUQsRUFBNEJzTCxHQUE1QixDQUFSO0FBQ1R6UyxZQUFRLENBQUN5UyxHQUFELEVBQU0xVCxJQUFOLENBQVI7QUFDSCxHQUhEO0FBSUg7O0FBRU0sU0FBU2tOLGlCQUFULENBQTJCNlYsTUFBM0IsRUFBbUN4VixJQUFuQyxFQUF5QztBQUM1QyxRQUFNK1UsUUFBUSxHQUFHbGtCLE1BQU0sQ0FBQ21rQixTQUFQLENBQWlCOEIsMEJBQWpCLENBQWpCO0FBQ0EsU0FBTy9CLFFBQVEsQ0FBQ1MsTUFBRCxFQUFTeFYsSUFBVCxDQUFmO0FBQ0g7O0FBRUQsU0FBUzhXLDBCQUFULENBQW9DdEIsTUFBcEMsRUFBNEN4VixJQUE1QyxFQUFrRHRNLFFBQWxELEVBQTREO0FBQ3hEaVIsZUFBYSxDQUFDLDZCQUFELEVBQStCM0UsSUFBL0IsQ0FBYjtBQUNBd1YsUUFBTSxDQUFDRyxHQUFQLENBQVcsbUJBQVgsRUFBZ0MzVixJQUFoQyxFQUFzQyxDQUF0QyxFQUF5QyxVQUFTbUcsR0FBVCxFQUFjMVQsSUFBZCxFQUFvQjtBQUN6RCxRQUFHMFQsR0FBSCxFQUFTdEwsUUFBUSxDQUFDLDZCQUFELEVBQStCc0wsR0FBL0IsQ0FBUjtBQUNUelMsWUFBUSxDQUFDeVMsR0FBRCxFQUFNMVQsSUFBTixDQUFSO0FBQ0gsR0FIRDtBQUlIOztBQUVNLFNBQVNzRixVQUFULENBQW9CeWQsTUFBcEIsRUFBNEI7QUFDL0IsUUFBTVQsUUFBUSxHQUFHbGtCLE1BQU0sQ0FBQ21rQixTQUFQLENBQWlCK0IsbUJBQWpCLENBQWpCO0FBQ0EsU0FBT2hDLFFBQVEsQ0FBQ1MsTUFBRCxDQUFmO0FBQ0g7O0FBRUQsU0FBU3VCLG1CQUFULENBQTZCdkIsTUFBN0IsRUFBcUM5aEIsUUFBckMsRUFBK0M7QUFDM0M4aEIsUUFBTSxDQUFDRyxHQUFQLENBQVcsWUFBWCxFQUF5QixVQUFTeFAsR0FBVCxFQUFjMVQsSUFBZCxFQUFvQjtBQUN6QyxRQUFHMFQsR0FBSCxFQUFRO0FBQUV0TCxjQUFRLENBQUMsc0JBQUQsRUFBd0JzTCxHQUF4QixDQUFSO0FBQXNDOztBQUNoRHpTLFlBQVEsQ0FBQ3lTLEdBQUQsRUFBTTFULElBQU4sQ0FBUjtBQUNILEdBSEQ7QUFJSDs7QUFFTSxTQUFTMmYsT0FBVCxDQUFpQm9ELE1BQWpCLEVBQXlCO0FBQzVCLFFBQU1ULFFBQVEsR0FBR2xrQixNQUFNLENBQUNta0IsU0FBUCxDQUFpQmdDLGdCQUFqQixDQUFqQjtBQUNBLFNBQU9qQyxRQUFRLENBQUNTLE1BQUQsQ0FBZjtBQUNIOztBQUVELFNBQVN3QixnQkFBVCxDQUEwQnhCLE1BQTFCLEVBQWtDOWhCLFFBQWxDLEVBQTRDO0FBQ3hDOGhCLFFBQU0sQ0FBQ0csR0FBUCxDQUFXLG1CQUFYLEVBQWdDLFVBQVN4UCxHQUFULEVBQWMxVCxJQUFkLEVBQW9CO0FBQ2hELFFBQUcwVCxHQUFILEVBQVE7QUFBRXRMLGNBQVEsQ0FBQyxtQkFBRCxFQUFxQnNMLEdBQXJCLENBQVI7QUFBbUM7O0FBQzdDelMsWUFBUSxDQUFDeVMsR0FBRCxFQUFNMVQsSUFBTixDQUFSO0FBQ0gsR0FIRDtBQUlIOztBQUVELFNBQVM0akIsT0FBVCxDQUFpQm5kLEVBQWpCLEVBQXFCO0FBQ2pCLFFBQU0rZCxVQUFVLEdBQUcsT0FBbkI7QUFDQSxNQUFJQyxPQUFPLEdBQUdoZSxFQUFkLENBRmlCLENBRUM7O0FBRWxCLE1BQUdBLEVBQUUsQ0FBQ3dILFVBQUgsQ0FBY3VXLFVBQWQsQ0FBSCxFQUE4QkMsT0FBTyxHQUFHaGUsRUFBRSxDQUFDb0csU0FBSCxDQUFhMlgsVUFBVSxDQUFDaGEsTUFBeEIsQ0FBVixDQUpiLENBSXdEOztBQUN6RSxNQUFHLENBQUMvRCxFQUFFLENBQUN3SCxVQUFILENBQWM2VSxTQUFkLENBQUosRUFBOEIyQixPQUFPLEdBQUczQixTQUFTLEdBQUNyYyxFQUFwQixDQUxiLENBS3FDOztBQUN4RCxTQUFPZ2UsT0FBUDtBQUNELEM7Ozs7Ozs7Ozs7O0FDOUxEcG1CLE1BQU0sQ0FBQ3NDLE1BQVAsQ0FBYztBQUFDa0gsWUFBVSxFQUFDLE1BQUlBLFVBQWhCO0FBQTJCNmMsZ0JBQWMsRUFBQyxNQUFJQSxjQUE5QztBQUE2REMsYUFBVyxFQUFDLE1BQUlBLFdBQTdFO0FBQXlGN1IsWUFBVSxFQUFDLE1BQUlBO0FBQXhHLENBQWQ7QUFBbUksSUFBSTFVLE1BQUo7QUFBV0MsTUFBTSxDQUFDQyxJQUFQLENBQVksZUFBWixFQUE0QjtBQUFDRixRQUFNLENBQUNHLENBQUQsRUFBRztBQUFDSCxVQUFNLEdBQUNHLENBQVA7QUFBUzs7QUFBcEIsQ0FBNUIsRUFBa0QsQ0FBbEQ7QUFBcUQsSUFBSXFtQixJQUFKO0FBQVN2bUIsTUFBTSxDQUFDQyxJQUFQLENBQVksYUFBWixFQUEwQjtBQUFDc21CLE1BQUksQ0FBQ3JtQixDQUFELEVBQUc7QUFBQ3FtQixRQUFJLEdBQUNybUIsQ0FBTDtBQUFPOztBQUFoQixDQUExQixFQUE0QyxDQUE1Qzs7QUFHck0sU0FBU3NKLFVBQVQsQ0FBb0JXLEdBQXBCLEVBQXlCRSxLQUF6QixFQUFnQztBQUNyQyxRQUFNNFosUUFBUSxHQUFHbGtCLE1BQU0sQ0FBQ21rQixTQUFQLENBQWlCc0MsSUFBakIsQ0FBakI7QUFDQSxTQUFPdkMsUUFBUSxDQUFDOVosR0FBRCxFQUFNRSxLQUFOLENBQWY7QUFDRDs7QUFFTSxTQUFTZ2MsY0FBVCxDQUF3QmxjLEdBQXhCLEVBQTZCeEksSUFBN0IsRUFBbUM7QUFDdEMsUUFBTXNpQixRQUFRLEdBQUdsa0IsTUFBTSxDQUFDbWtCLFNBQVAsQ0FBaUJ1QyxRQUFqQixDQUFqQjtBQUNBLFNBQU94QyxRQUFRLENBQUM5WixHQUFELEVBQU14SSxJQUFOLENBQWY7QUFDSDs7QUFFTSxTQUFTMmtCLFdBQVQsQ0FBcUJuYyxHQUFyQixFQUEwQnhJLElBQTFCLEVBQWdDO0FBQ25DLFFBQU1zaUIsUUFBUSxHQUFHbGtCLE1BQU0sQ0FBQ21rQixTQUFQLENBQWlCd0MsS0FBakIsQ0FBakI7QUFDQSxTQUFPekMsUUFBUSxDQUFDOVosR0FBRCxFQUFNeEksSUFBTixDQUFmO0FBQ0g7O0FBRU0sU0FBUzhTLFVBQVQsQ0FBb0J0SyxHQUFwQixFQUF5QnhJLElBQXpCLEVBQStCO0FBQ2xDLFFBQU1zaUIsUUFBUSxHQUFHbGtCLE1BQU0sQ0FBQ21rQixTQUFQLENBQWlCeUMsSUFBakIsQ0FBakI7QUFDQSxTQUFPMUMsUUFBUSxDQUFDOVosR0FBRCxFQUFNeEksSUFBTixDQUFmO0FBQ0g7O0FBRUQsU0FBUzZrQixJQUFULENBQWNyYyxHQUFkLEVBQW1CRSxLQUFuQixFQUEwQnpILFFBQTFCLEVBQW9DO0FBQ2xDLFFBQU1na0IsTUFBTSxHQUFHemMsR0FBZjtBQUNBLFFBQU0wYyxRQUFRLEdBQUd4YyxLQUFqQjtBQUNBa2MsTUFBSSxDQUFDNUcsR0FBTCxDQUFTaUgsTUFBVCxFQUFpQjtBQUFDdmMsU0FBSyxFQUFFd2M7QUFBUixHQUFqQixFQUFvQyxVQUFTeFIsR0FBVCxFQUFjaEcsR0FBZCxFQUFtQjtBQUNyRHpNLFlBQVEsQ0FBQ3lTLEdBQUQsRUFBTWhHLEdBQU4sQ0FBUjtBQUNELEdBRkQ7QUFHRDs7QUFFRCxTQUFTb1gsUUFBVCxDQUFrQnRjLEdBQWxCLEVBQXVCeEksSUFBdkIsRUFBNkJpQixRQUE3QixFQUF1QztBQUNuQyxRQUFNZ2tCLE1BQU0sR0FBR3pjLEdBQWY7QUFDQSxRQUFNM0MsT0FBTyxHQUFHN0YsSUFBaEI7QUFDQTRrQixNQUFJLENBQUM1RyxHQUFMLENBQVNpSCxNQUFULEVBQWlCcGYsT0FBakIsRUFBMEIsVUFBUzZOLEdBQVQsRUFBY2hHLEdBQWQsRUFBbUI7QUFDekN6TSxZQUFRLENBQUN5UyxHQUFELEVBQU1oRyxHQUFOLENBQVI7QUFDSCxHQUZEO0FBR0g7O0FBRUQsU0FBU3FYLEtBQVQsQ0FBZXZjLEdBQWYsRUFBb0J4SSxJQUFwQixFQUEwQmlCLFFBQTFCLEVBQW9DO0FBQ2hDLFFBQU1na0IsTUFBTSxHQUFHemMsR0FBZjtBQUNBLFFBQU0zQyxPQUFPLEdBQUk3RixJQUFqQjtBQUVBNGtCLE1BQUksQ0FBQ2hHLElBQUwsQ0FBVXFHLE1BQVYsRUFBa0JwZixPQUFsQixFQUEyQixVQUFTNk4sR0FBVCxFQUFjaEcsR0FBZCxFQUFtQjtBQUMxQ3pNLFlBQVEsQ0FBQ3lTLEdBQUQsRUFBTWhHLEdBQU4sQ0FBUjtBQUNILEdBRkQ7QUFHSDs7QUFFRCxTQUFTc1gsSUFBVCxDQUFjeGMsR0FBZCxFQUFtQitLLFVBQW5CLEVBQStCdFMsUUFBL0IsRUFBeUM7QUFDckMsUUFBTWdrQixNQUFNLEdBQUd6YyxHQUFmO0FBQ0EsUUFBTTNDLE9BQU8sR0FBRztBQUNaN0YsUUFBSSxFQUFFdVQ7QUFETSxHQUFoQjtBQUlBcVIsTUFBSSxDQUFDdkYsR0FBTCxDQUFTNEYsTUFBVCxFQUFpQnBmLE9BQWpCLEVBQTBCLFVBQVM2TixHQUFULEVBQWNoRyxHQUFkLEVBQW1CO0FBQzNDek0sWUFBUSxDQUFDeVMsR0FBRCxFQUFNaEcsR0FBTixDQUFSO0FBQ0QsR0FGRDtBQUdILEM7Ozs7Ozs7Ozs7O0FDekREclAsTUFBTSxDQUFDQyxJQUFQLENBQVksZ0JBQVo7QUFBOEJELE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGVBQVo7QUFBNkJELE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLHNCQUFaO0FBQW9DRCxNQUFNLENBQUNDLElBQVAsQ0FBWSxnQkFBWjtBQUE4QkQsTUFBTSxDQUFDQyxJQUFQLENBQVksVUFBWjtBQUF3QkQsTUFBTSxDQUFDQyxJQUFQLENBQVksZ0JBQVosRTs7Ozs7Ozs7Ozs7QUNBckpELE1BQU0sQ0FBQ3NDLE1BQVAsQ0FBYztBQUFDc1csVUFBUSxFQUFDLE1BQUlBO0FBQWQsQ0FBZDtBQUF1QyxJQUFJN1ksTUFBSjtBQUFXQyxNQUFNLENBQUNDLElBQVAsQ0FBWSxlQUFaLEVBQTRCO0FBQUNGLFFBQU0sQ0FBQ0csQ0FBRCxFQUFHO0FBQUNILFVBQU0sR0FBQ0csQ0FBUDtBQUFTOztBQUFwQixDQUE1QixFQUFrRCxDQUFsRDtBQUFxRCxJQUFJc2lCLGFBQUosRUFBa0J2SyxHQUFsQjtBQUFzQmpZLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLDhCQUFaLEVBQTJDO0FBQUN1aUIsZUFBYSxDQUFDdGlCLENBQUQsRUFBRztBQUFDc2lCLGlCQUFhLEdBQUN0aUIsQ0FBZDtBQUFnQixHQUFsQzs7QUFBbUMrWCxLQUFHLENBQUMvWCxDQUFELEVBQUc7QUFBQytYLE9BQUcsR0FBQy9YLENBQUo7QUFBTTs7QUFBaEQsQ0FBM0MsRUFBNkYsQ0FBN0Y7QUFBZ0csSUFBSXlYLFFBQUo7QUFBYTNYLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLDZDQUFaLEVBQTBEO0FBQUNtQixTQUFPLENBQUNsQixDQUFELEVBQUc7QUFBQ3lYLFlBQVEsR0FBQ3pYLENBQVQ7QUFBVzs7QUFBdkIsQ0FBMUQsRUFBbUYsQ0FBbkY7QUFBc0YsSUFBSXNlLE9BQUo7QUFBWXhlLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGdEQUFaLEVBQTZEO0FBQUN1ZSxTQUFPLENBQUN0ZSxDQUFELEVBQUc7QUFBQ3NlLFdBQU8sR0FBQ3RlLENBQVI7QUFBVTs7QUFBdEIsQ0FBN0QsRUFBcUYsQ0FBckY7QUFBd0YsSUFBSWdZLGNBQUo7QUFBbUJsWSxNQUFNLENBQUNDLElBQVAsQ0FBWSxtQkFBWixFQUFnQztBQUFDaVksZ0JBQWMsQ0FBQ2hZLENBQUQsRUFBRztBQUFDZ1ksa0JBQWMsR0FBQ2hZLENBQWY7QUFBaUI7O0FBQXBDLENBQWhDLEVBQXNFLENBQXRFO0FBRWhiLE1BQU0wWSxRQUFRLEdBQUc0SixhQUFhLENBQUMsUUFBRCxDQUE5QjtBQU9QNUosUUFBUSxDQUFDNkosV0FBVCxDQUFxQixNQUFyQixFQUE2QixVQUFVdFQsR0FBVixFQUFld1QsRUFBZixFQUFtQjtBQUM5QyxNQUFJO0FBQ0YsVUFBTXRjLEtBQUssR0FBRzhJLEdBQUcsQ0FBQ3hOLElBQWxCO0FBQ0FnVyxZQUFRLENBQUN0UixLQUFELENBQVI7QUFDQThJLE9BQUcsQ0FBQ1ksSUFBSjtBQUNELEdBSkQsQ0FJRSxPQUFNaEgsU0FBTixFQUFpQjtBQUNqQm9HLE9BQUcsQ0FBQ3lULElBQUo7QUFDQSxVQUFNLElBQUk3aUIsTUFBTSxDQUFDOEIsS0FBWCxDQUFpQiwwQkFBakIsRUFBNkNrSCxTQUE3QyxDQUFOO0FBQ0QsR0FQRCxTQU9VO0FBQ1I0WixNQUFFO0FBQ0g7QUFDRixDQVhEO0FBY0EsSUFBSTFLLEdBQUosQ0FBUVcsUUFBUixFQUFrQixTQUFsQixFQUE2QixFQUE3QixFQUNLa0ssTUFETCxDQUNZO0FBQUVDLFVBQVEsRUFBRW5LLFFBQVEsQ0FBQ29LLEtBQVQsQ0FBZTVVLEtBQWYsQ0FBcUI2VSxJQUFyQixDQUEwQixpQkFBMUI7QUFBWixDQURaLEVBRUsxSyxJQUZMLENBRVU7QUFBQ0MsZUFBYSxFQUFFO0FBQWhCLENBRlY7QUFJQSxJQUFJMEssQ0FBQyxHQUFHdEssUUFBUSxDQUFDNkosV0FBVCxDQUFxQixTQUFyQixFQUErQjtBQUFFVSxjQUFZLEVBQUUsS0FBaEI7QUFBdUJULGFBQVcsRUFBRSxLQUFHO0FBQXZDLENBQS9CLEVBQThFLFVBQVV2VCxHQUFWLEVBQWV3VCxFQUFmLEVBQW1CO0FBQ3JHLFFBQU1TLE9BQU8sR0FBRyxJQUFJbGdCLElBQUosRUFBaEI7QUFDQWtnQixTQUFPLENBQUNDLFVBQVIsQ0FBbUJELE9BQU8sQ0FBQ0UsVUFBUixLQUF1QixDQUExQztBQUVBLFFBQU1DLEdBQUcsR0FBRzNLLFFBQVEsQ0FBQ2xZLElBQVQsQ0FBYztBQUNsQnVILFVBQU0sRUFBRTtBQUFDdWIsU0FBRyxFQUFFdkwsR0FBRyxDQUFDd0w7QUFBVixLQURVO0FBRWxCQyxXQUFPLEVBQUU7QUFBQ0MsU0FBRyxFQUFFUDtBQUFOO0FBRlMsR0FBZCxFQUdSO0FBQUN4aUIsVUFBTSxFQUFFO0FBQUU4QyxTQUFHLEVBQUU7QUFBUDtBQUFULEdBSFEsQ0FBWjtBQUtBOGEsU0FBTyxDQUFDLG1DQUFELEVBQXFDK0UsR0FBckMsQ0FBUDtBQUNBM0ssVUFBUSxDQUFDZ0wsVUFBVCxDQUFvQkwsR0FBcEI7O0FBQ0EsTUFBR0EsR0FBRyxDQUFDcFgsTUFBSixHQUFhLENBQWhCLEVBQWtCO0FBQ2RnRCxPQUFHLENBQUNZLElBQUosQ0FBUyxnQ0FBVDtBQUNIOztBQUNENFMsSUFBRTtBQUNMLENBZk8sQ0FBUjtBQWlCQS9KLFFBQVEsQ0FBQ2xZLElBQVQsQ0FBYztBQUFFaUQsTUFBSSxFQUFFLFNBQVI7QUFBbUJzRSxRQUFNLEVBQUU7QUFBM0IsQ0FBZCxFQUNLNGIsT0FETCxDQUNhO0FBQ0xDLE9BQUssRUFBRSxZQUFZO0FBQUVaLEtBQUMsQ0FBQ2EsT0FBRjtBQUFjO0FBRDlCLENBRGIsRTs7Ozs7Ozs7Ozs7QUM1Q0EvakIsTUFBTSxDQUFDQyxJQUFQLENBQVkseUJBQVo7QUFBdUNELE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGdCQUFaLEUiLCJmaWxlIjoiL2FwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IHsgUm9sZXMgfSBmcm9tICdtZXRlb3IvYWxhbm5pbmc6cm9sZXMnO1xuXG5pbXBvcnQgeyBPcHRJbnMgfSBmcm9tICcuLi9vcHQtaW5zLmpzJztcblxuTWV0ZW9yLnB1Ymxpc2goJ29wdC1pbnMuYWxsJywgZnVuY3Rpb24gT3B0SW5zQWxsKCkge1xuICBpZighdGhpcy51c2VySWQpIHtcbiAgICByZXR1cm4gdGhpcy5yZWFkeSgpO1xuICB9XG4gIGlmKCFSb2xlcy51c2VySXNJblJvbGUodGhpcy51c2VySWQsIFsnYWRtaW4nXSkpe1xuICAgIHJldHVybiBPcHRJbnMuZmluZCh7b3duZXJJZDp0aGlzLnVzZXJJZH0sIHtcbiAgICAgIGZpZWxkczogT3B0SW5zLnB1YmxpY0ZpZWxkcyxcbiAgICB9KTtcbiAgfVxuICBcblxuICByZXR1cm4gT3B0SW5zLmZpbmQoe30sIHtcbiAgICBmaWVsZHM6IE9wdElucy5wdWJsaWNGaWVsZHMsXG4gIH0pO1xufSk7XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCB7IEREUFJhdGVMaW1pdGVyIH0gZnJvbSAnbWV0ZW9yL2RkcC1yYXRlLWxpbWl0ZXInO1xuaW1wb3J0IHsgX2kxOG4gYXMgaTE4biB9IGZyb20gJ21ldGVvci91bml2ZXJzZTppMThuJztcbmltcG9ydCB7IFZhbGlkYXRlZE1ldGhvZCB9IGZyb20gJ21ldGVvci9tZGc6dmFsaWRhdGVkLW1ldGhvZCc7XG5pbXBvcnQgeyBSb2xlcyB9IGZyb20gJ21ldGVvci9hbGFubmluZzpyb2xlcyc7XG5pbXBvcnQgeyBfIH0gZnJvbSAnbWV0ZW9yL3VuZGVyc2NvcmUnO1xuaW1wb3J0IGFkZE9wdEluIGZyb20gJy4uLy4uL21vZHVsZXMvc2VydmVyL29wdC1pbnMvYWRkX2FuZF93cml0ZV90b19ibG9ja2NoYWluLmpzJztcblxuY29uc3QgYWRkID0gbmV3IFZhbGlkYXRlZE1ldGhvZCh7XG4gIG5hbWU6ICdvcHQtaW5zLmFkZCcsXG4gIHZhbGlkYXRlOiBudWxsLFxuICBydW4oeyByZWNpcGllbnRNYWlsLCBzZW5kZXJNYWlsLCBkYXRhIH0pIHtcbiAgICBpZighdGhpcy51c2VySWQgfHwgIVJvbGVzLnVzZXJJc0luUm9sZSh0aGlzLnVzZXJJZCwgWydhZG1pbiddKSkge1xuICAgICAgY29uc3QgZXJyb3IgPSBcImFwaS5vcHQtaW5zLmFkZC5hY2Nlc3NEZW5pZWRcIjtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoZXJyb3IsIGkxOG4uX18oZXJyb3IpKTtcbiAgICB9XG5cbiAgICBjb25zdCBvcHRJbiA9IHtcbiAgICAgIFwicmVjaXBpZW50X21haWxcIjogcmVjaXBpZW50TWFpbCxcbiAgICAgIFwic2VuZGVyX21haWxcIjogc2VuZGVyTWFpbCxcbiAgICAgIGRhdGFcbiAgICB9XG5cbiAgICBhZGRPcHRJbihvcHRJbilcbiAgfSxcbn0pO1xuXG4vLyBHZXQgbGlzdCBvZiBhbGwgbWV0aG9kIG5hbWVzIG9uIG9wdC1pbnNcbmNvbnN0IE9QVElPTlNfTUVUSE9EUyA9IF8ucGx1Y2soW1xuICBhZGRcbl0sICduYW1lJyk7XG5cbmlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgLy8gT25seSBhbGxvdyA1IG9wdC1pbiBvcGVyYXRpb25zIHBlciBjb25uZWN0aW9uIHBlciBzZWNvbmRcbiAgRERQUmF0ZUxpbWl0ZXIuYWRkUnVsZSh7XG4gICAgbmFtZShuYW1lKSB7XG4gICAgICByZXR1cm4gXy5jb250YWlucyhPUFRJT05TX01FVEhPRFMsIG5hbWUpO1xuICAgIH0sXG5cbiAgICAvLyBSYXRlIGxpbWl0IHBlciBjb25uZWN0aW9uIElEXG4gICAgY29ubmVjdGlvbklkKCkgeyByZXR1cm4gdHJ1ZTsgfSxcbiAgfSwgNSwgMTAwMCk7XG59XG4iLCJpbXBvcnQgeyBNb25nbyB9IGZyb20gJ21ldGVvci9tb25nbyc7XG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XG5cbmNsYXNzIE9wdEluc0NvbGxlY3Rpb24gZXh0ZW5kcyBNb25nby5Db2xsZWN0aW9uIHtcbiAgaW5zZXJ0KG9wdEluLCBjYWxsYmFjaykge1xuICAgIGNvbnN0IG91ck9wdEluID0gb3B0SW47XG4gICAgb3VyT3B0SW4ucmVjaXBpZW50X3NlbmRlciA9IG91ck9wdEluLnJlY2lwaWVudCtvdXJPcHRJbi5zZW5kZXI7XG4gICAgb3VyT3B0SW4uY3JlYXRlZEF0ID0gb3VyT3B0SW4uY3JlYXRlZEF0IHx8IG5ldyBEYXRlKCk7XG4gICAgY29uc3QgcmVzdWx0ID0gc3VwZXIuaW5zZXJ0KG91ck9wdEluLCBjYWxsYmFjayk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICB1cGRhdGUoc2VsZWN0b3IsIG1vZGlmaWVyKSB7XG4gICAgY29uc3QgcmVzdWx0ID0gc3VwZXIudXBkYXRlKHNlbGVjdG9yLCBtb2RpZmllcik7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICByZW1vdmUoc2VsZWN0b3IpIHtcbiAgICBjb25zdCByZXN1bHQgPSBzdXBlci5yZW1vdmUoc2VsZWN0b3IpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IE9wdElucyA9IG5ldyBPcHRJbnNDb2xsZWN0aW9uKCdvcHQtaW5zJyk7XG5cbi8vIERlbnkgYWxsIGNsaWVudC1zaWRlIHVwZGF0ZXMgc2luY2Ugd2Ugd2lsbCBiZSB1c2luZyBtZXRob2RzIHRvIG1hbmFnZSB0aGlzIGNvbGxlY3Rpb25cbk9wdElucy5kZW55KHtcbiAgaW5zZXJ0KCkgeyByZXR1cm4gdHJ1ZTsgfSxcbiAgdXBkYXRlKCkgeyByZXR1cm4gdHJ1ZTsgfSxcbiAgcmVtb3ZlKCkgeyByZXR1cm4gdHJ1ZTsgfSxcbn0pO1xuXG5PcHRJbnMuc2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIF9pZDoge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICByZWdFeDogU2ltcGxlU2NoZW1hLlJlZ0V4LklkLFxuICB9LFxuICByZWNpcGllbnQ6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgb3B0aW9uYWw6IHRydWUsXG4gICAgZGVueVVwZGF0ZTogdHJ1ZSxcbiAgfSxcbiAgc2VuZGVyOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIG9wdGlvbmFsOiB0cnVlLFxuICAgIGRlbnlVcGRhdGU6IHRydWUsXG4gIH0sXG4gIGRhdGE6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgb3B0aW9uYWw6IHRydWUsXG4gICAgZGVueVVwZGF0ZTogZmFsc2UsXG4gIH0sXG4gIGluZGV4OiB7XG4gICAgdHlwZTogU2ltcGxlU2NoZW1hLkludGVnZXIsXG4gICAgb3B0aW9uYWw6IHRydWUsXG4gICAgZGVueVVwZGF0ZTogZmFsc2UsXG4gIH0sXG4gIG5hbWVJZDoge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICBvcHRpb25hbDogdHJ1ZSxcbiAgICBkZW55VXBkYXRlOiBmYWxzZSxcbiAgfSxcbiAgdHhJZDoge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgb3B0aW9uYWw6IHRydWUsXG4gICAgICBkZW55VXBkYXRlOiBmYWxzZSxcbiAgfSxcbiAgbWFzdGVyRG9pOiB7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICBvcHRpb25hbDogdHJ1ZSxcbiAgICAgIGRlbnlVcGRhdGU6IGZhbHNlLFxuICB9LFxuICBjcmVhdGVkQXQ6IHtcbiAgICB0eXBlOiBEYXRlLFxuICAgIGRlbnlVcGRhdGU6IHRydWUsXG4gIH0sXG4gIGNvbmZpcm1lZEF0OiB7XG4gICAgdHlwZTogRGF0ZSxcbiAgICBvcHRpb25hbDogdHJ1ZSxcbiAgICBkZW55VXBkYXRlOiBmYWxzZSxcbiAgfSxcbiAgY29uZmlybWVkQnk6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgcmVnRXg6IFNpbXBsZVNjaGVtYS5SZWdFeC5JUCxcbiAgICBvcHRpb25hbDogdHJ1ZSxcbiAgICBkZW55VXBkYXRlOiBmYWxzZVxuICB9LFxuICBjb25maXJtYXRpb25Ub2tlbjoge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICBvcHRpb25hbDogdHJ1ZSxcbiAgICBkZW55VXBkYXRlOiBmYWxzZVxuICB9LFxuICBvd25lcklkOntcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgb3B0aW9uYWw6IHRydWUsXG4gICAgcmVnRXg6IFNpbXBsZVNjaGVtYS5SZWdFeC5JZFxuICB9LFxuICBlcnJvcjp7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICBvcHRpb25hbDogdHJ1ZSxcbiAgICAgIGRlbnlVcGRhdGU6IGZhbHNlXG4gIH1cbn0pO1xuXG5PcHRJbnMuYXR0YWNoU2NoZW1hKE9wdElucy5zY2hlbWEpO1xuXG4vLyBUaGlzIHJlcHJlc2VudHMgdGhlIGtleXMgZnJvbSBPcHQtSW4gb2JqZWN0cyB0aGF0IHNob3VsZCBiZSBwdWJsaXNoZWRcbi8vIHRvIHRoZSBjbGllbnQuIElmIHdlIGFkZCBzZWNyZXQgcHJvcGVydGllcyB0byBPcHQtSW4gb2JqZWN0cywgZG9uJ3QgbGlzdFxuLy8gdGhlbSBoZXJlIHRvIGtlZXAgdGhlbSBwcml2YXRlIHRvIHRoZSBzZXJ2ZXIuXG5PcHRJbnMucHVibGljRmllbGRzID0ge1xuICBfaWQ6IDEsXG4gIHJlY2lwaWVudDogMSxcbiAgc2VuZGVyOiAxLFxuICBkYXRhOiAxLFxuICBpbmRleDogMSxcbiAgbmFtZUlkOiAxLFxuICB0eElkOiAxLFxuICBtYXN0ZXJEb2k6IDEsXG4gIGNyZWF0ZWRBdDogMSxcbiAgY29uZmlybWVkQXQ6IDEsXG4gIGNvbmZpcm1lZEJ5OiAxLFxuICBvd25lcklkOiAxLFxuICBlcnJvcjogMVxufTtcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IHsgUm9sZXMgfSBmcm9tICdtZXRlb3IvYWxhbm5pbmc6cm9sZXMnO1xuXG5pbXBvcnQgeyBSZWNpcGllbnRzIH0gZnJvbSAnLi4vcmVjaXBpZW50cy5qcyc7XG5pbXBvcnQgeyBPcHRJbnN9IGZyb20gJy4uLy4uL29wdC1pbnMvb3B0LWlucy5qcydcbk1ldGVvci5wdWJsaXNoKCdyZWNpcGllbnRzLmJ5T3duZXInLGZ1bmN0aW9uIHJlY2lwaWVudEdldCgpe1xuICBsZXQgcGlwZWxpbmU9W107XG4gIGlmKCFSb2xlcy51c2VySXNJblJvbGUodGhpcy51c2VySWQsIFsnYWRtaW4nXSkpe1xuICAgIHBpcGVsaW5lLnB1c2goXG4gICAgICB7JHJlZGFjdDp7XG4gICAgICAkY29uZDoge1xuICAgICAgICBpZjogeyAkY21wOiBbIFwiJG93bmVySWRcIiwgdGhpcy51c2VySWQgXSB9LFxuICAgICAgICB0aGVuOiBcIiQkUFJVTkVcIixcbiAgICAgICAgZWxzZTogXCIkJEtFRVBcIiB9fX0pO1xuICAgICAgfVxuICAgICAgcGlwZWxpbmUucHVzaCh7ICRsb29rdXA6IHsgZnJvbTogXCJyZWNpcGllbnRzXCIsIGxvY2FsRmllbGQ6IFwicmVjaXBpZW50XCIsIGZvcmVpZ25GaWVsZDogXCJfaWRcIiwgYXM6IFwiUmVjaXBpZW50RW1haWxcIiB9IH0pO1xuICAgICAgcGlwZWxpbmUucHVzaCh7ICR1bndpbmQ6IFwiJFJlY2lwaWVudEVtYWlsXCJ9KTtcbiAgICAgIHBpcGVsaW5lLnB1c2goeyAkcHJvamVjdDoge1wiUmVjaXBpZW50RW1haWwuX2lkXCI6MX19KTtcblxuICAgICAgY29uc3QgcmVzdWx0ID0gT3B0SW5zLmFnZ3JlZ2F0ZShwaXBlbGluZSk7XG4gICAgICBsZXQgcklkcz1bXTtcbiAgICAgIHJlc3VsdC5mb3JFYWNoKGVsZW1lbnQgPT4ge1xuICAgICAgICBySWRzLnB1c2goZWxlbWVudC5SZWNpcGllbnRFbWFpbC5faWQpO1xuICAgICAgfSk7XG4gIHJldHVybiBSZWNpcGllbnRzLmZpbmQoe1wiX2lkXCI6e1wiJGluXCI6cklkc319LHtmaWVsZHM6UmVjaXBpZW50cy5wdWJsaWNGaWVsZHN9KTtcbn0pO1xuTWV0ZW9yLnB1Ymxpc2goJ3JlY2lwaWVudHMuYWxsJywgZnVuY3Rpb24gcmVjaXBpZW50c0FsbCgpIHtcbiAgaWYoIXRoaXMudXNlcklkIHx8ICFSb2xlcy51c2VySXNJblJvbGUodGhpcy51c2VySWQsIFsnYWRtaW4nXSkpIHtcbiAgICByZXR1cm4gdGhpcy5yZWFkeSgpO1xuICB9XG5cbiAgcmV0dXJuIFJlY2lwaWVudHMuZmluZCh7fSwge1xuICAgIGZpZWxkczogUmVjaXBpZW50cy5wdWJsaWNGaWVsZHMsXG4gIH0pO1xufSk7XG4iLCJpbXBvcnQgeyBNb25nbyB9IGZyb20gJ21ldGVvci9tb25nbyc7XG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XG5cbmNsYXNzIFJlY2lwaWVudHNDb2xsZWN0aW9uIGV4dGVuZHMgTW9uZ28uQ29sbGVjdGlvbiB7XG4gIGluc2VydChyZWNpcGllbnQsIGNhbGxiYWNrKSB7XG4gICAgY29uc3Qgb3VyUmVjaXBpZW50ID0gcmVjaXBpZW50O1xuICAgIG91clJlY2lwaWVudC5jcmVhdGVkQXQgPSBvdXJSZWNpcGllbnQuY3JlYXRlZEF0IHx8IG5ldyBEYXRlKCk7XG4gICAgY29uc3QgcmVzdWx0ID0gc3VwZXIuaW5zZXJ0KG91clJlY2lwaWVudCwgY2FsbGJhY2spO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgdXBkYXRlKHNlbGVjdG9yLCBtb2RpZmllcikge1xuICAgIGNvbnN0IHJlc3VsdCA9IHN1cGVyLnVwZGF0ZShzZWxlY3RvciwgbW9kaWZpZXIpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgcmVtb3ZlKHNlbGVjdG9yKSB7XG4gICAgY29uc3QgcmVzdWx0ID0gc3VwZXIucmVtb3ZlKHNlbGVjdG9yKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG5cbmV4cG9ydCBjb25zdCBSZWNpcGllbnRzID0gbmV3IFJlY2lwaWVudHNDb2xsZWN0aW9uKCdyZWNpcGllbnRzJyk7XG5cbi8vIERlbnkgYWxsIGNsaWVudC1zaWRlIHVwZGF0ZXMgc2luY2Ugd2Ugd2lsbCBiZSB1c2luZyBtZXRob2RzIHRvIG1hbmFnZSB0aGlzIGNvbGxlY3Rpb25cblJlY2lwaWVudHMuZGVueSh7XG4gIGluc2VydCgpIHsgcmV0dXJuIHRydWU7IH0sXG4gIHVwZGF0ZSgpIHsgcmV0dXJuIHRydWU7IH0sXG4gIHJlbW92ZSgpIHsgcmV0dXJuIHRydWU7IH0sXG59KTtcblxuUmVjaXBpZW50cy5zY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgX2lkOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIHJlZ0V4OiBTaW1wbGVTY2hlbWEuUmVnRXguSWQsXG4gIH0sXG4gIGVtYWlsOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIGluZGV4OiB0cnVlLFxuICAgIGRlbnlVcGRhdGU6IHRydWUsXG4gIH0sXG4gIHByaXZhdGVLZXk6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgdW5pcXVlOiB0cnVlLFxuICAgIGRlbnlVcGRhdGU6IHRydWUsXG4gIH0sXG4gIHB1YmxpY0tleToge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICB1bmlxdWU6IHRydWUsXG4gICAgZGVueVVwZGF0ZTogdHJ1ZSxcbiAgfSxcbiAgY3JlYXRlZEF0OiB7XG4gICAgdHlwZTogRGF0ZSxcbiAgICBkZW55VXBkYXRlOiB0cnVlLFxuICB9XG59KTtcblxuUmVjaXBpZW50cy5hdHRhY2hTY2hlbWEoUmVjaXBpZW50cy5zY2hlbWEpO1xuXG4vLyBUaGlzIHJlcHJlc2VudHMgdGhlIGtleXMgZnJvbSBSZWNpcGllbnQgb2JqZWN0cyB0aGF0IHNob3VsZCBiZSBwdWJsaXNoZWRcbi8vIHRvIHRoZSBjbGllbnQuIElmIHdlIGFkZCBzZWNyZXQgcHJvcGVydGllcyB0byBSZWNpcGllbnQgb2JqZWN0cywgZG9uJ3QgbGlzdFxuLy8gdGhlbSBoZXJlIHRvIGtlZXAgdGhlbSBwcml2YXRlIHRvIHRoZSBzZXJ2ZXIuXG5SZWNpcGllbnRzLnB1YmxpY0ZpZWxkcyA9IHtcbiAgX2lkOiAxLFxuICBlbWFpbDogMSxcbiAgcHVibGljS2V5OiAxLFxuICBjcmVhdGVkQXQ6IDFcbn07XG4iLCJpbXBvcnQgeyBNb25nbyB9IGZyb20gJ21ldGVvci9tb25nbyc7XG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XG5cbmNsYXNzIERvaWNoYWluRW50cmllc0NvbGxlY3Rpb24gZXh0ZW5kcyBNb25nby5Db2xsZWN0aW9uIHtcbiAgaW5zZXJ0KGVudHJ5LCBjYWxsYmFjaykge1xuICAgIGNvbnN0IHJlc3VsdCA9IHN1cGVyLmluc2VydChlbnRyeSwgY2FsbGJhY2spO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgdXBkYXRlKHNlbGVjdG9yLCBtb2RpZmllcikge1xuICAgIGNvbnN0IHJlc3VsdCA9IHN1cGVyLnVwZGF0ZShzZWxlY3RvciwgbW9kaWZpZXIpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgcmVtb3ZlKHNlbGVjdG9yKSB7XG4gICAgY29uc3QgcmVzdWx0ID0gc3VwZXIucmVtb3ZlKHNlbGVjdG9yKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG5cbmV4cG9ydCBjb25zdCBEb2ljaGFpbkVudHJpZXMgPSBuZXcgRG9pY2hhaW5FbnRyaWVzQ29sbGVjdGlvbignZG9pY2hhaW4tZW50cmllcycpO1xuXG4vLyBEZW55IGFsbCBjbGllbnQtc2lkZSB1cGRhdGVzIHNpbmNlIHdlIHdpbGwgYmUgdXNpbmcgbWV0aG9kcyB0byBtYW5hZ2UgdGhpcyBjb2xsZWN0aW9uXG5Eb2ljaGFpbkVudHJpZXMuZGVueSh7XG4gIGluc2VydCgpIHsgcmV0dXJuIHRydWU7IH0sXG4gIHVwZGF0ZSgpIHsgcmV0dXJuIHRydWU7IH0sXG4gIHJlbW92ZSgpIHsgcmV0dXJuIHRydWU7IH0sXG59KTtcblxuRG9pY2hhaW5FbnRyaWVzLnNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICBfaWQ6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgcmVnRXg6IFNpbXBsZVNjaGVtYS5SZWdFeC5JZCxcbiAgfSxcbiAgbmFtZToge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICBpbmRleDogdHJ1ZSxcbiAgICBkZW55VXBkYXRlOiB0cnVlXG4gIH0sXG4gIHZhbHVlOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIGRlbnlVcGRhdGU6IGZhbHNlXG4gIH0sXG4gIGFkZHJlc3M6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgZGVueVVwZGF0ZTogZmFsc2VcbiAgfSxcbiAgbWFzdGVyRG9pOiB7XG4gICAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgICAgb3B0aW9uYWw6IHRydWUsXG4gICAgICAgIGluZGV4OiB0cnVlLFxuICAgICAgICBkZW55VXBkYXRlOiB0cnVlXG4gIH0sXG4gIGluZGV4OiB7XG4gICAgICAgIHR5cGU6IFNpbXBsZVNjaGVtYS5JbnRlZ2VyLFxuICAgICAgICBvcHRpb25hbDogdHJ1ZSxcbiAgICAgICAgZGVueVVwZGF0ZTogdHJ1ZVxuICB9LFxuICB0eElkOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIGRlbnlVcGRhdGU6IGZhbHNlXG4gIH1cbn0pO1xuXG5Eb2ljaGFpbkVudHJpZXMuYXR0YWNoU2NoZW1hKERvaWNoYWluRW50cmllcy5zY2hlbWEpO1xuXG4vLyBUaGlzIHJlcHJlc2VudHMgdGhlIGtleXMgZnJvbSBFbnRyeSBvYmplY3RzIHRoYXQgc2hvdWxkIGJlIHB1Ymxpc2hlZFxuLy8gdG8gdGhlIGNsaWVudC4gSWYgd2UgYWRkIHNlY3JldCBwcm9wZXJ0aWVzIHRvIEVudHJ5IG9iamVjdHMsIGRvbid0IGxpc3Rcbi8vIHRoZW0gaGVyZSB0byBrZWVwIHRoZW0gcHJpdmF0ZSB0byB0aGUgc2VydmVyLlxuRG9pY2hhaW5FbnRyaWVzLnB1YmxpY0ZpZWxkcyA9IHtcbiAgX2lkOiAxLFxuICBuYW1lOiAxLFxuICB2YWx1ZTogMSxcbiAgYWRkcmVzczogMSxcbiAgbWFzdGVyRG9pOiAxLFxuICBpbmRleDogMSxcbiAgdHhJZDogMVxufTtcbiIsImltcG9ydCB7IFZhbGlkYXRlZE1ldGhvZCB9IGZyb20gJ21ldGVvci9tZGc6dmFsaWRhdGVkLW1ldGhvZCc7XG5pbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCB7IEREUFJhdGVMaW1pdGVyIH0gZnJvbSAnbWV0ZW9yL2RkcC1yYXRlLWxpbWl0ZXInO1xuaW1wb3J0IGdldEtleVBhaXJNIGZyb20gJy4uLy4uL21vZHVsZXMvc2VydmVyL2RvaWNoYWluL2dldF9rZXktcGFpci5qcyc7XG5pbXBvcnQgZ2V0QmFsYW5jZU0gZnJvbSAnLi4vLi4vbW9kdWxlcy9zZXJ2ZXIvZG9pY2hhaW4vZ2V0X2JhbGFuY2UuanMnO1xuXG5cbmNvbnN0IGdldEtleVBhaXIgPSBuZXcgVmFsaWRhdGVkTWV0aG9kKHtcbiAgbmFtZTogJ2RvaWNoYWluLmdldEtleVBhaXInLFxuICB2YWxpZGF0ZTogbnVsbCxcbiAgcnVuKCkge1xuICAgIHJldHVybiBnZXRLZXlQYWlyTSgpO1xuICB9LFxufSk7XG5cbmNvbnN0IGdldEJhbGFuY2UgPSBuZXcgVmFsaWRhdGVkTWV0aG9kKHtcbiAgbmFtZTogJ2RvaWNoYWluLmdldEJhbGFuY2UnLFxuICB2YWxpZGF0ZTogbnVsbCxcbiAgcnVuKCkge1xuICAgIGNvbnN0IGxvZ1ZhbCA9IGdldEJhbGFuY2VNKCk7XG4gICAgcmV0dXJuIGxvZ1ZhbDtcbiAgfSxcbn0pO1xuXG5cbi8vIEdldCBsaXN0IG9mIGFsbCBtZXRob2QgbmFtZXMgb24gZG9pY2hhaW5cbmNvbnN0IE9QVElOU19NRVRIT0RTID0gXy5wbHVjayhbXG4gIGdldEtleVBhaXJcbixnZXRCYWxhbmNlXSwgJ25hbWUnKTtcblxuaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAvLyBPbmx5IGFsbG93IDUgb3B0LWluIG9wZXJhdGlvbnMgcGVyIGNvbm5lY3Rpb24gcGVyIHNlY29uZFxuICBERFBSYXRlTGltaXRlci5hZGRSdWxlKHtcbiAgICBuYW1lKG5hbWUpIHtcbiAgICAgIHJldHVybiBfLmNvbnRhaW5zKE9QVElOU19NRVRIT0RTLCBuYW1lKTtcbiAgICB9LFxuXG4gICAgLy8gUmF0ZSBsaW1pdCBwZXIgY29ubmVjdGlvbiBJRFxuICAgIGNvbm5lY3Rpb25JZCgpIHsgcmV0dXJuIHRydWU7IH0sXG4gIH0sIDUsIDEwMDApO1xufVxuIiwiaW1wb3J0IHsgTWV0ZW9yfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCB7IEREUFJhdGVMaW1pdGVyIH0gZnJvbSAnbWV0ZW9yL2RkcC1yYXRlLWxpbWl0ZXInO1xuaW1wb3J0IHsgVmFsaWRhdGVkTWV0aG9kIH0gZnJvbSAnbWV0ZW9yL21kZzp2YWxpZGF0ZWQtbWV0aG9kJztcbmltcG9ydCBnZXRMYW5ndWFnZXMgZnJvbSAnLi4vLi4vbW9kdWxlcy9zZXJ2ZXIvbGFuZ3VhZ2VzL2dldC5qcyc7XG5cbmNvbnN0IGdldEFsbExhbmd1YWdlcyA9IG5ldyBWYWxpZGF0ZWRNZXRob2Qoe1xuICBuYW1lOiAnbGFuZ3VhZ2VzLmdldEFsbCcsXG4gIHZhbGlkYXRlOiBudWxsLFxuICBydW4oKSB7XG4gICAgcmV0dXJuIGdldExhbmd1YWdlcygpO1xuICB9LFxufSk7XG5cbi8vIEdldCBsaXN0IG9mIGFsbCBtZXRob2QgbmFtZXMgb24gbGFuZ3VhZ2VzXG5jb25zdCBPUFRJTlNfTUVUSE9EUyA9IF8ucGx1Y2soW1xuICBnZXRBbGxMYW5ndWFnZXNcbl0sICduYW1lJyk7XG5cbmlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgLy8gT25seSBhbGxvdyA1IG9wdC1pbiBvcGVyYXRpb25zIHBlciBjb25uZWN0aW9uIHBlciBzZWNvbmRcbiAgRERQUmF0ZUxpbWl0ZXIuYWRkUnVsZSh7XG4gICAgbmFtZShuYW1lKSB7XG4gICAgICByZXR1cm4gXy5jb250YWlucyhPUFRJTlNfTUVUSE9EUywgbmFtZSk7XG4gICAgfSxcblxuICAgIC8vIFJhdGUgbGltaXQgcGVyIGNvbm5lY3Rpb24gSURcbiAgICBjb25uZWN0aW9uSWQoKSB7IHJldHVybiB0cnVlOyB9LFxuICB9LCA1LCAxMDAwKTtcbn1cbiIsImltcG9ydCB7IE1vbmdvIH0gZnJvbSAnbWV0ZW9yL21vbmdvJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcblxuY2xhc3MgTWV0YUNvbGxlY3Rpb24gZXh0ZW5kcyBNb25nby5Db2xsZWN0aW9uIHtcbiAgaW5zZXJ0KGRhdGEsIGNhbGxiYWNrKSB7XG4gICAgY29uc3Qgb3VyRGF0YSA9IGRhdGE7XG4gICAgY29uc3QgcmVzdWx0ID0gc3VwZXIuaW5zZXJ0KG91ckRhdGEsIGNhbGxiYWNrKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIHVwZGF0ZShzZWxlY3RvciwgbW9kaWZpZXIpIHtcbiAgICBjb25zdCByZXN1bHQgPSBzdXBlci51cGRhdGUoc2VsZWN0b3IsIG1vZGlmaWVyKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIHJlbW92ZShzZWxlY3Rvcikge1xuICAgIGNvbnN0IHJlc3VsdCA9IHN1cGVyLnJlbW92ZShzZWxlY3Rvcik7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgTWV0YSA9IG5ldyBNZXRhQ29sbGVjdGlvbignbWV0YScpO1xuXG4vLyBEZW55IGFsbCBjbGllbnQtc2lkZSB1cGRhdGVzIHNpbmNlIHdlIHdpbGwgYmUgdXNpbmcgbWV0aG9kcyB0byBtYW5hZ2UgdGhpcyBjb2xsZWN0aW9uXG5NZXRhLmRlbnkoe1xuICBpbnNlcnQoKSB7IHJldHVybiB0cnVlOyB9LFxuICB1cGRhdGUoKSB7IHJldHVybiB0cnVlOyB9LFxuICByZW1vdmUoKSB7IHJldHVybiB0cnVlOyB9LFxufSk7XG5cbk1ldGEuc2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIF9pZDoge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICByZWdFeDogU2ltcGxlU2NoZW1hLlJlZ0V4LklkLFxuICB9LFxuICBrZXk6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgaW5kZXg6IHRydWUsXG4gICAgZGVueVVwZGF0ZTogdHJ1ZVxuICB9LFxuICB2YWx1ZToge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9XG59KTtcblxuTWV0YS5hdHRhY2hTY2hlbWEoTWV0YS5zY2hlbWEpO1xuXG4vLyBUaGlzIHJlcHJlc2VudHMgdGhlIGtleXMgZnJvbSBNZXRhIG9iamVjdHMgdGhhdCBzaG91bGQgYmUgcHVibGlzaGVkXG4vLyB0byB0aGUgY2xpZW50LiBJZiB3ZSBhZGQgc2VjcmV0IHByb3BlcnRpZXMgdG8gTWV0YSBvYmplY3RzLCBkb24ndCBsaXN0XG4vLyB0aGVtIGhlcmUgdG8ga2VlcCB0aGVtIHByaXZhdGUgdG8gdGhlIHNlcnZlci5cbk1ldGEucHVibGljRmllbGRzID0ge1xufTtcbiIsImltcG9ydCB7IE1vbmdvIH0gZnJvbSAnbWV0ZW9yL21vbmdvJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcblxuY2xhc3MgU2VuZGVyc0NvbGxlY3Rpb24gZXh0ZW5kcyBNb25nby5Db2xsZWN0aW9uIHtcbiAgaW5zZXJ0KHNlbmRlciwgY2FsbGJhY2spIHtcbiAgICBjb25zdCBvdXJTZW5kZXIgPSBzZW5kZXI7XG4gICAgb3VyU2VuZGVyLmNyZWF0ZWRBdCA9IG91clNlbmRlci5jcmVhdGVkQXQgfHwgbmV3IERhdGUoKTtcbiAgICBjb25zdCByZXN1bHQgPSBzdXBlci5pbnNlcnQob3VyU2VuZGVyLCBjYWxsYmFjayk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICB1cGRhdGUoc2VsZWN0b3IsIG1vZGlmaWVyKSB7XG4gICAgY29uc3QgcmVzdWx0ID0gc3VwZXIudXBkYXRlKHNlbGVjdG9yLCBtb2RpZmllcik7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICByZW1vdmUoc2VsZWN0b3IpIHtcbiAgICBjb25zdCByZXN1bHQgPSBzdXBlci5yZW1vdmUoc2VsZWN0b3IpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IFNlbmRlcnMgPSBuZXcgU2VuZGVyc0NvbGxlY3Rpb24oJ3NlbmRlcnMnKTtcblxuLy8gRGVueSBhbGwgY2xpZW50LXNpZGUgdXBkYXRlcyBzaW5jZSB3ZSB3aWxsIGJlIHVzaW5nIG1ldGhvZHMgdG8gbWFuYWdlIHRoaXMgY29sbGVjdGlvblxuU2VuZGVycy5kZW55KHtcbiAgaW5zZXJ0KCkgeyByZXR1cm4gdHJ1ZTsgfSxcbiAgdXBkYXRlKCkgeyByZXR1cm4gdHJ1ZTsgfSxcbiAgcmVtb3ZlKCkgeyByZXR1cm4gdHJ1ZTsgfSxcbn0pO1xuXG5TZW5kZXJzLnNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICBfaWQ6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgcmVnRXg6IFNpbXBsZVNjaGVtYS5SZWdFeC5JZCxcbiAgfSxcbiAgZW1haWw6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgaW5kZXg6IHRydWUsXG4gICAgZGVueVVwZGF0ZTogdHJ1ZSxcbiAgfSxcbiAgY3JlYXRlZEF0OiB7XG4gICAgdHlwZTogRGF0ZSxcbiAgICBkZW55VXBkYXRlOiB0cnVlLFxuICB9XG59KTtcblxuU2VuZGVycy5hdHRhY2hTY2hlbWEoU2VuZGVycy5zY2hlbWEpO1xuXG4vLyBUaGlzIHJlcHJlc2VudHMgdGhlIGtleXMgZnJvbSBTZW5kZXIgb2JqZWN0cyB0aGF0IHNob3VsZCBiZSBwdWJsaXNoZWRcbi8vIHRvIHRoZSBjbGllbnQuIElmIHdlIGFkZCBzZWNyZXQgcHJvcGVydGllcyB0byBTZW5kZXIgb2JqZWN0cywgZG9uJ3QgbGlzdFxuLy8gdGhlbSBoZXJlIHRvIGtlZXAgdGhlbSBwcml2YXRlIHRvIHRoZSBzZXJ2ZXIuXG5TZW5kZXJzLnB1YmxpY0ZpZWxkcyA9IHtcbiAgZW1haWw6IDEsXG4gIGNyZWF0ZWRBdDogMVxufTtcbiIsImltcG9ydCB7IE1ldGVvcn0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgeyBNZXRhIH0gZnJvbSAnLi4vbWV0YS9tZXRhJztcblxuTWV0ZW9yLnB1Ymxpc2goJ3ZlcnNpb24nLCBmdW5jdGlvbiB2ZXJzaW9uKCkge1xuICByZXR1cm4gTWV0YS5maW5kKHt9KTtcbn0pO1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XG5pbXBvcnQgeyBET0lfTUFJTF9GRVRDSF9VUkwgfSBmcm9tICcuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9lbWFpbC1jb25maWd1cmF0aW9uLmpzJztcbmltcG9ydCB7bG9nU2VuZH0gZnJvbSBcIi4uLy4uLy4uL3N0YXJ0dXAvc2VydmVyL2xvZy1jb25maWd1cmF0aW9uXCI7XG5pbXBvcnQge09wdEluc30gZnJvbSBcIi4uLy4uLy4uL2FwaS9vcHQtaW5zL29wdC1pbnNcIjtcblxuY29uc3QgRXhwb3J0RG9pc0RhdGFTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgc3RhdHVzOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIG9wdGlvbmFsOiB0cnVlLFxuICB9LFxuICByb2xlOntcbiAgICB0eXBlOlN0cmluZ1xuICB9LFxuICB1c2VyaWQ6e1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICByZWdFeDogU2ltcGxlU2NoZW1hLlJlZ0V4LmlkLFxuICAgIG9wdGlvbmFsOnRydWUgXG4gIH1cbn0pO1xuXG4vL1RPRE8gYWRkIHNlbmRlciBhbmQgcmVjaXBpZW50IGVtYWlsIGFkZHJlc3MgdG8gZXhwb3J0XG5cbmNvbnN0IGV4cG9ydERvaXMgPSAoZGF0YSkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IG91ckRhdGEgPSBkYXRhO1xuICAgIEV4cG9ydERvaXNEYXRhU2NoZW1hLnZhbGlkYXRlKG91ckRhdGEpO1xuICAgIGxldCBwaXBlbGluZT1beyAkbWF0Y2g6IHtcImNvbmZpcm1lZEF0XCI6eyAkZXhpc3RzOiB0cnVlLCAkbmU6IG51bGwgfX0gfV07XG4gICAgXG4gICAgaWYob3VyRGF0YS5yb2xlIT0nYWRtaW4nfHxvdXJEYXRhLnVzZXJpZCE9dW5kZWZpbmVkKXtcbiAgICAgIHBpcGVsaW5lLnB1c2goeyAkcmVkYWN0OntcbiAgICAgICAgJGNvbmQ6IHtcbiAgICAgICAgICBpZjogeyAkY21wOiBbIFwiJG93bmVySWRcIiwgb3VyRGF0YS51c2VyaWQgXSB9LFxuICAgICAgICAgIHRoZW46IFwiJCRQUlVORVwiLFxuICAgICAgICAgIGVsc2U6IFwiJCRLRUVQXCIgfX19KTtcbiAgICB9XG4gICAgcGlwZWxpbmUuY29uY2F0KFtcbiAgICAgICAgeyAkbG9va3VwOiB7IGZyb206IFwicmVjaXBpZW50c1wiLCBsb2NhbEZpZWxkOiBcInJlY2lwaWVudFwiLCBmb3JlaWduRmllbGQ6IFwiX2lkXCIsIGFzOiBcIlJlY2lwaWVudEVtYWlsXCIgfSB9LFxuICAgICAgICB7ICRsb29rdXA6IHsgZnJvbTogXCJzZW5kZXJzXCIsIGxvY2FsRmllbGQ6IFwic2VuZGVyXCIsIGZvcmVpZ25GaWVsZDogXCJfaWRcIiwgYXM6IFwiU2VuZGVyRW1haWxcIiB9IH0sXG4gICAgICAgIHsgJHVud2luZDogXCIkU2VuZGVyRW1haWxcIn0sXG4gICAgICAgIHsgJHVud2luZDogXCIkUmVjaXBpZW50RW1haWxcIn0sXG4gICAgICAgIHsgJHByb2plY3Q6IHtcIl9pZFwiOjEsXCJjcmVhdGVkQXRcIjoxLCBcImNvbmZpcm1lZEF0XCI6MSxcIm5hbWVJZFwiOjEsIFwiU2VuZGVyRW1haWwuZW1haWxcIjoxLFwiUmVjaXBpZW50RW1haWwuZW1haWxcIjoxfX1cbiAgICBdKTtcbiAgICAvL2lmKG91ckRhdGEuc3RhdHVzPT0xKSBxdWVyeSA9IHtcImNvbmZpcm1lZEF0XCI6IHsgJGV4aXN0czogdHJ1ZSwgJG5lOiBudWxsIH19XG5cbiAgICBsZXQgb3B0SW5zID0gIE9wdElucy5hZ2dyZWdhdGUocGlwZWxpbmUpO1xuICAgIGxldCBleHBvcnREb2lEYXRhO1xuICAgIHRyeSB7XG4gICAgICAgIGV4cG9ydERvaURhdGEgPSBvcHRJbnM7XG4gICAgICAgIGxvZ1NlbmQoJ2V4cG9ydERvaSB1cmw6JyxET0lfTUFJTF9GRVRDSF9VUkwsSlNPTi5zdHJpbmdpZnkoZXhwb3J0RG9pRGF0YSkpO1xuICAgICAgcmV0dXJuIGV4cG9ydERvaURhdGFcblxuICAgIH0gY2F0Y2goZXJyb3IpIHtcbiAgICAgIHRocm93IFwiRXJyb3Igd2hpbGUgZXhwb3J0aW5nIGRvaXM6IFwiK2Vycm9yO1xuICAgIH1cblxuICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdkYXBwcy5leHBvcnREb2kuZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgZXhwb3J0RG9pcztcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tICdzaW1wbC1zY2hlbWEnO1xuaW1wb3J0IHsgRE9JX0ZFVENIX1JPVVRFLCBET0lfQ09ORklSTUFUSU9OX1JPVVRFLCBBUElfUEFUSCwgVkVSU0lPTiB9IGZyb20gJy4uLy4uLy4uLy4uL3NlcnZlci9hcGkvcmVzdC9yZXN0LmpzJztcbmltcG9ydCB7IGdldFVybCB9IGZyb20gJy4uLy4uLy4uL3N0YXJ0dXAvc2VydmVyL2RhcHAtY29uZmlndXJhdGlvbi5qcyc7XG5pbXBvcnQgeyBDT05GSVJNX0NMSUVOVCwgQ09ORklSTV9BRERSRVNTIH0gZnJvbSAnLi4vLi4vLi4vc3RhcnR1cC9zZXJ2ZXIvZG9pY2hhaW4tY29uZmlndXJhdGlvbi5qcyc7XG5pbXBvcnQgeyBnZXRIdHRwR0VUIH0gZnJvbSAnLi4vLi4vLi4vLi4vc2VydmVyL2FwaS9odHRwLmpzJztcbmltcG9ydCB7IHNpZ25NZXNzYWdlIH0gZnJvbSAnLi4vLi4vLi4vLi4vc2VydmVyL2FwaS9kb2ljaGFpbi5qcyc7XG5pbXBvcnQgeyBPcHRJbnMgfSBmcm9tICcuLi8uLi8uLi8uLi9pbXBvcnRzL2FwaS9vcHQtaW5zL29wdC1pbnMuanMnO1xuaW1wb3J0IHBhcnNlVGVtcGxhdGUgZnJvbSAnLi4vZW1haWxzL3BhcnNlX3RlbXBsYXRlLmpzJztcbmltcG9ydCBnZW5lcmF0ZURvaVRva2VuIGZyb20gJy4uL29wdC1pbnMvZ2VuZXJhdGVfZG9pLXRva2VuLmpzJztcbmltcG9ydCBnZW5lcmF0ZURvaUhhc2ggZnJvbSAnLi4vZW1haWxzL2dlbmVyYXRlX2RvaS1oYXNoLmpzJztcbmltcG9ydCBhZGRPcHRJbiBmcm9tICcuLi9vcHQtaW5zL2FkZC5qcyc7XG5pbXBvcnQgYWRkU2VuZE1haWxKb2IgZnJvbSAnLi4vam9icy9hZGRfc2VuZF9tYWlsLmpzJztcbmltcG9ydCB7bG9nQ29uZmlybSwgbG9nRXJyb3J9IGZyb20gXCIuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9sb2ctY29uZmlndXJhdGlvblwiO1xuXG5jb25zdCBGZXRjaERvaU1haWxEYXRhU2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIG5hbWU6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfSxcbiAgZG9tYWluOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH1cbn0pO1xuXG5cbmNvbnN0IGZldGNoRG9pTWFpbERhdGEgPSAoZGF0YSkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IG91ckRhdGEgPSBkYXRhO1xuICAgIEZldGNoRG9pTWFpbERhdGFTY2hlbWEudmFsaWRhdGUob3VyRGF0YSk7XG4gICAgY29uc3QgdXJsID0gb3VyRGF0YS5kb21haW4rQVBJX1BBVEgrVkVSU0lPTitcIi9cIitET0lfRkVUQ0hfUk9VVEU7XG4gICAgY29uc3Qgc2lnbmF0dXJlID0gc2lnbk1lc3NhZ2UoQ09ORklSTV9DTElFTlQsIENPTkZJUk1fQUREUkVTUywgb3VyRGF0YS5uYW1lKTtcbiAgICBjb25zdCBxdWVyeSA9IFwibmFtZV9pZD1cIitlbmNvZGVVUklDb21wb25lbnQob3VyRGF0YS5uYW1lKStcIiZzaWduYXR1cmU9XCIrZW5jb2RlVVJJQ29tcG9uZW50KHNpZ25hdHVyZSk7XG4gICAgbG9nQ29uZmlybSgnY2FsbGluZyBmb3IgZG9pLWVtYWlsLXRlbXBsYXRlOicrdXJsKycgcXVlcnk6JywgcXVlcnkpO1xuXG4gICAgLyoqXG4gICAgICBUT0RPIHdoZW4gcnVubmluZyBTZW5kLWRBcHAgaW4gVGVzdG5ldCBiZWhpbmQgTkFUIHRoaXMgVVJMIHdpbGwgbm90IGJlIGFjY2Vzc2libGUgZnJvbSB0aGUgaW50ZXJuZXRcbiAgICAgIGJ1dCBldmVuIHdoZW4gd2UgdXNlIHRoZSBVUkwgZnJvbSBsb2NhbGhvc3QgdmVyaWZ5IGFuZG4gb3RoZXJzIHdpbGwgZmFpbHMuXG4gICAgICovXG4gICAgY29uc3QgcmVzcG9uc2UgPSBnZXRIdHRwR0VUKHVybCwgcXVlcnkpO1xuICAgIGlmKHJlc3BvbnNlID09PSB1bmRlZmluZWQgfHwgcmVzcG9uc2UuZGF0YSA9PT0gdW5kZWZpbmVkKSB0aHJvdyBcIkJhZCByZXNwb25zZVwiO1xuICAgIGNvbnN0IHJlc3BvbnNlRGF0YSA9IHJlc3BvbnNlLmRhdGE7XG4gICAgbG9nQ29uZmlybSgncmVzcG9uc2Ugd2hpbGUgZ2V0dGluZyBnZXR0aW5nIGVtYWlsIHRlbXBsYXRlIGZyb20gVVJMOicscmVzcG9uc2UuZGF0YS5zdGF0dXMpO1xuXG4gICAgaWYocmVzcG9uc2VEYXRhLnN0YXR1cyAhPT0gXCJzdWNjZXNzXCIpIHtcbiAgICAgIGlmKHJlc3BvbnNlRGF0YS5lcnJvciA9PT0gdW5kZWZpbmVkKSB0aHJvdyBcIkJhZCByZXNwb25zZVwiO1xuICAgICAgaWYocmVzcG9uc2VEYXRhLmVycm9yLmluY2x1ZGVzKFwiT3B0LUluIG5vdCBmb3VuZFwiKSkge1xuICAgICAgICAvL0RvIG5vdGhpbmcgYW5kIGRvbid0IHRocm93IGVycm9yIHNvIGpvYiBpcyBkb25lXG4gICAgICAgICAgbG9nRXJyb3IoJ3Jlc3BvbnNlIGRhdGEgZnJvbSBTZW5kLWRBcHA6JyxyZXNwb25zZURhdGEuZXJyb3IpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB0aHJvdyByZXNwb25zZURhdGEuZXJyb3I7XG4gICAgfVxuICAgIGxvZ0NvbmZpcm0oJ0RPSSBNYWlsIGRhdGEgZmV0Y2hlZC4nKTtcblxuICAgIGNvbnN0IG9wdEluSWQgPSBhZGRPcHRJbih7bmFtZTogb3VyRGF0YS5uYW1lfSk7XG4gICAgY29uc3Qgb3B0SW4gPSBPcHRJbnMuZmluZE9uZSh7X2lkOiBvcHRJbklkfSk7XG4gICAgbG9nQ29uZmlybSgnb3B0LWluIGZvdW5kOicsb3B0SW4pO1xuICAgIGlmKG9wdEluLmNvbmZpcm1hdGlvblRva2VuICE9PSB1bmRlZmluZWQpIHJldHVybjtcblxuICAgIGNvbnN0IHRva2VuID0gZ2VuZXJhdGVEb2lUb2tlbih7aWQ6IG9wdEluLl9pZH0pO1xuICAgIGxvZ0NvbmZpcm0oJ2dlbmVyYXRlZCBjb25maXJtYXRpb25Ub2tlbjonLHRva2VuKTtcbiAgICBjb25zdCBjb25maXJtYXRpb25IYXNoID0gZ2VuZXJhdGVEb2lIYXNoKHtpZDogb3B0SW4uX2lkLCB0b2tlbjogdG9rZW4sIHJlZGlyZWN0OiByZXNwb25zZURhdGEuZGF0YS5yZWRpcmVjdH0pO1xuICAgIGxvZ0NvbmZpcm0oJ2dlbmVyYXRlZCBjb25maXJtYXRpb25IYXNoOicsY29uZmlybWF0aW9uSGFzaCk7XG4gICAgY29uc3QgY29uZmlybWF0aW9uVXJsID0gZ2V0VXJsKCkrQVBJX1BBVEgrVkVSU0lPTitcIi9cIitET0lfQ09ORklSTUFUSU9OX1JPVVRFK1wiL1wiK2VuY29kZVVSSUNvbXBvbmVudChjb25maXJtYXRpb25IYXNoKTtcbiAgICBsb2dDb25maXJtKCdjb25maXJtYXRpb25Vcmw6Jytjb25maXJtYXRpb25VcmwpO1xuXG4gICAgY29uc3QgdGVtcGxhdGUgPSBwYXJzZVRlbXBsYXRlKHt0ZW1wbGF0ZTogcmVzcG9uc2VEYXRhLmRhdGEuY29udGVudCwgZGF0YToge1xuICAgICAgY29uZmlybWF0aW9uX3VybDogY29uZmlybWF0aW9uVXJsXG4gICAgfX0pO1xuXG4gICAgLy9sb2dDb25maXJtKCd3ZSBhcmUgdXNpbmcgdGhpcyB0ZW1wbGF0ZTonLHRlbXBsYXRlKTtcblxuICAgIGxvZ0NvbmZpcm0oJ3NlbmRpbmcgZW1haWwgdG8gcGV0ZXIgZm9yIGNvbmZpcm1hdGlvbiBvdmVyIGJvYnMgZEFwcCcpO1xuICAgIGFkZFNlbmRNYWlsSm9iKHtcbiAgICAgIHRvOiByZXNwb25zZURhdGEuZGF0YS5yZWNpcGllbnQsXG4gICAgICBzdWJqZWN0OiByZXNwb25zZURhdGEuZGF0YS5zdWJqZWN0LFxuICAgICAgbWVzc2FnZTogdGVtcGxhdGUsXG4gICAgICByZXR1cm5QYXRoOiByZXNwb25zZURhdGEuZGF0YS5yZXR1cm5QYXRoXG4gICAgfSk7XG4gIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2RhcHBzLmZldGNoRG9pTWFpbERhdGEuZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgZmV0Y2hEb2lNYWlsRGF0YTtcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tICdzaW1wbC1zY2hlbWEnO1xuaW1wb3J0IHsgT3B0SW5zIH0gZnJvbSAnLi4vLi4vLi4vYXBpL29wdC1pbnMvb3B0LWlucy5qcyc7XG5pbXBvcnQgeyBSZWNpcGllbnRzIH0gZnJvbSAnLi4vLi4vLi4vYXBpL3JlY2lwaWVudHMvcmVjaXBpZW50cy5qcyc7XG5pbXBvcnQgZ2V0T3B0SW5Qcm92aWRlciBmcm9tICcuLi9kbnMvZ2V0X29wdC1pbi1wcm92aWRlci5qcyc7XG5pbXBvcnQgZ2V0T3B0SW5LZXkgZnJvbSAnLi4vZG5zL2dldF9vcHQtaW4ta2V5LmpzJztcbmltcG9ydCB2ZXJpZnlTaWduYXR1cmUgZnJvbSAnLi4vZG9pY2hhaW4vdmVyaWZ5X3NpZ25hdHVyZS5qcyc7XG5pbXBvcnQgeyBnZXRIdHRwR0VUIH0gZnJvbSAnLi4vLi4vLi4vLi4vc2VydmVyL2FwaS9odHRwLmpzJztcbmltcG9ydCB7IERPSV9NQUlMX0ZFVENIX1VSTCB9IGZyb20gJy4uLy4uLy4uL3N0YXJ0dXAvc2VydmVyL2VtYWlsLWNvbmZpZ3VyYXRpb24uanMnO1xuaW1wb3J0IHsgbG9nU2VuZCB9IGZyb20gXCIuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9sb2ctY29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgQWNjb3VudHMgfSBmcm9tICdtZXRlb3IvYWNjb3VudHMtYmFzZSdcblxuY29uc3QgR2V0RG9pTWFpbERhdGFTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgbmFtZV9pZDoge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9LFxuICBzaWduYXR1cmU6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfVxufSk7XG5cbmNvbnN0IHVzZXJQcm9maWxlU2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIHN1YmplY3Q6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgb3B0aW9uYWw6dHJ1ZVxuICB9LFxuICByZWRpcmVjdDoge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICByZWdFeDogXCJAKGh0dHBzP3xmdHApOi8vKC1cXFxcLik/KFteXFxcXHMvP1xcXFwuIy1dK1xcXFwuPykrKC9bXlxcXFxzXSopPyRAXCIsXG4gICAgb3B0aW9uYWw6dHJ1ZVxuICB9LFxuICByZXR1cm5QYXRoOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIHJlZ0V4OiBTaW1wbGVTY2hlbWEuUmVnRXguRW1haWwsXG4gICAgb3B0aW9uYWw6dHJ1ZVxuICB9LFxuICB0ZW1wbGF0ZVVSTDoge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICByZWdFeDogXCJAKGh0dHBzP3xmdHApOi8vKC1cXFxcLik/KFteXFxcXHMvP1xcXFwuIy1dK1xcXFwuPykrKC9bXlxcXFxzXSopPyRAXCIsXG4gICAgb3B0aW9uYWw6dHJ1ZVxuICB9XG59KTtcblxuY29uc3QgZ2V0RG9pTWFpbERhdGEgPSAoZGF0YSkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IG91ckRhdGEgPSBkYXRhO1xuICAgIEdldERvaU1haWxEYXRhU2NoZW1hLnZhbGlkYXRlKG91ckRhdGEpO1xuICAgIGNvbnN0IG9wdEluID0gT3B0SW5zLmZpbmRPbmUoe25hbWVJZDogb3VyRGF0YS5uYW1lX2lkfSk7XG4gICAgaWYob3B0SW4gPT09IHVuZGVmaW5lZCkgdGhyb3cgXCJPcHQtSW4gd2l0aCBuYW1lX2lkOiBcIitvdXJEYXRhLm5hbWVfaWQrXCIgbm90IGZvdW5kXCI7XG4gICAgbG9nU2VuZCgnT3B0LUluIGZvdW5kJyxvcHRJbik7XG5cbiAgICBjb25zdCByZWNpcGllbnQgPSBSZWNpcGllbnRzLmZpbmRPbmUoe19pZDogb3B0SW4ucmVjaXBpZW50fSk7XG4gICAgaWYocmVjaXBpZW50ID09PSB1bmRlZmluZWQpIHRocm93IFwiUmVjaXBpZW50IG5vdCBmb3VuZFwiO1xuICAgIGxvZ1NlbmQoJ1JlY2lwaWVudCBmb3VuZCcsIHJlY2lwaWVudCk7XG5cbiAgICBjb25zdCBwYXJ0cyA9IHJlY2lwaWVudC5lbWFpbC5zcGxpdChcIkBcIik7XG4gICAgY29uc3QgZG9tYWluID0gcGFydHNbcGFydHMubGVuZ3RoLTFdO1xuXG4gICAgbGV0IHB1YmxpY0tleSA9IGdldE9wdEluS2V5KHsgZG9tYWluOiBkb21haW59KTtcblxuICAgIGlmKCFwdWJsaWNLZXkpe1xuICAgICAgY29uc3QgcHJvdmlkZXIgPSBnZXRPcHRJblByb3ZpZGVyKHtkb21haW46IG91ckRhdGEuZG9tYWluIH0pO1xuICAgICAgbG9nU2VuZChcInVzaW5nIGRvaWNoYWluIHByb3ZpZGVyIGluc3RlYWQgb2YgZGlyZWN0bHkgY29uZmlndXJlZCBwdWJsaWNLZXk6XCIsIHsgcHJvdmlkZXI6IHByb3ZpZGVyIH0pO1xuICAgICAgcHVibGljS2V5ID0gZ2V0T3B0SW5LZXkoeyBkb21haW46IHByb3ZpZGVyfSk7IC8vZ2V0IHB1YmxpYyBrZXkgZnJvbSBwcm92aWRlciBvciBmYWxsYmFjayBpZiBwdWJsaWNrZXkgd2FzIG5vdCBzZXQgaW4gZG5zXG4gICAgfVxuXG4gICAgbG9nU2VuZCgncXVlcmllZCBkYXRhOiAocGFydHMsIGRvbWFpbiwgcHJvdmlkZXIsIHB1YmxpY0tleSknLCAnKCcrcGFydHMrJywnK2RvbWFpbisnLCcrcHVibGljS2V5KycpJyk7XG5cbiAgICAvL1RPRE86IE9ubHkgYWxsb3cgYWNjZXNzIG9uZSB0aW1lXG4gICAgLy8gUG9zc2libGUgc29sdXRpb246XG4gICAgLy8gMS4gUHJvdmlkZXIgKGNvbmZpcm0gZEFwcCkgcmVxdWVzdCB0aGUgZGF0YVxuICAgIC8vIDIuIFByb3ZpZGVyIHJlY2VpdmUgdGhlIGRhdGFcbiAgICAvLyAzLiBQcm92aWRlciBzZW5kcyBjb25maXJtYXRpb24gXCJJIGdvdCB0aGUgZGF0YVwiXG4gICAgLy8gNC4gU2VuZCBkQXBwIGxvY2sgdGhlIGRhdGEgZm9yIHRoaXMgb3B0IGluXG4gICAgbG9nU2VuZCgndmVyaWZ5aW5nIHNpZ25hdHVyZS4uLicpO1xuICAgIGlmKCF2ZXJpZnlTaWduYXR1cmUoe3B1YmxpY0tleTogcHVibGljS2V5LCBkYXRhOiBvdXJEYXRhLm5hbWVfaWQsIHNpZ25hdHVyZTogb3VyRGF0YS5zaWduYXR1cmV9KSkge1xuICAgICAgdGhyb3cgXCJzaWduYXR1cmUgaW5jb3JyZWN0IC0gYWNjZXNzIGRlbmllZFwiO1xuICAgIH1cbiAgICBcbiAgICBsb2dTZW5kKCdzaWduYXR1cmUgdmVyaWZpZWQnKTtcblxuICAgIC8vVE9ETzogUXVlcnkgZm9yIGxhbmd1YWdlXG4gICAgbGV0IGRvaU1haWxEYXRhO1xuICAgIHRyeSB7XG5cbiAgICAgIGRvaU1haWxEYXRhID0gZ2V0SHR0cEdFVChET0lfTUFJTF9GRVRDSF9VUkwsIFwiXCIpLmRhdGE7XG4gICAgICBsZXQgZGVmYXVsdFJldHVybkRhdGEgPSB7XG4gICAgICAgIFwicmVjaXBpZW50XCI6IHJlY2lwaWVudC5lbWFpbCxcbiAgICAgICAgXCJjb250ZW50XCI6IGRvaU1haWxEYXRhLmRhdGEuY29udGVudCxcbiAgICAgICAgXCJyZWRpcmVjdFwiOiBkb2lNYWlsRGF0YS5kYXRhLnJlZGlyZWN0LFxuICAgICAgICBcInN1YmplY3RcIjogZG9pTWFpbERhdGEuZGF0YS5zdWJqZWN0LFxuICAgICAgICBcInJldHVyblBhdGhcIjogZG9pTWFpbERhdGEuZGF0YS5yZXR1cm5QYXRoXG4gICAgICB9XG5cbiAgICBsZXQgcmV0dXJuRGF0YSA9IGRlZmF1bHRSZXR1cm5EYXRhO1xuXG4gICAgdHJ5e1xuICAgICAgbGV0IG93bmVyID0gQWNjb3VudHMudXNlcnMuZmluZE9uZSh7X2lkOiBvcHRJbi5vd25lcklkfSk7XG4gICAgICBsZXQgbWFpbFRlbXBsYXRlID0gb3duZXIucHJvZmlsZS5tYWlsVGVtcGxhdGU7XG4gICAgICB1c2VyUHJvZmlsZVNjaGVtYS52YWxpZGF0ZShtYWlsVGVtcGxhdGUpO1xuXG4gICAgICByZXR1cm5EYXRhW1wicmVkaXJlY3RcIl0gPSBtYWlsVGVtcGxhdGVbXCJyZWRpcmVjdFwiXSB8fCBkZWZhdWx0UmV0dXJuRGF0YVtcInJlZGlyZWN0XCJdO1xuICAgICAgcmV0dXJuRGF0YVtcInN1YmplY3RcIl0gPSBtYWlsVGVtcGxhdGVbXCJzdWJqZWN0XCJdIHx8IGRlZmF1bHRSZXR1cm5EYXRhW1wic3ViamVjdFwiXTtcbiAgICAgIHJldHVybkRhdGFbXCJyZXR1cm5QYXRoXCJdID0gbWFpbFRlbXBsYXRlW1wicmV0dXJuUGF0aFwiXSB8fCBkZWZhdWx0UmV0dXJuRGF0YVtcInJldHVyblBhdGhcIl07XG4gICAgICByZXR1cm5EYXRhW1wiY29udGVudFwiXSA9IG1haWxUZW1wbGF0ZVtcInRlbXBsYXRlVVJMXCJdID8gKGdldEh0dHBHRVQobWFpbFRlbXBsYXRlW1widGVtcGxhdGVVUkxcIl0sIFwiXCIpLmNvbnRlbnQgfHwgZGVmYXVsdFJldHVybkRhdGFbXCJjb250ZW50XCJdKSA6IGRlZmF1bHRSZXR1cm5EYXRhW1wiY29udGVudFwiXTtcbiAgICAgIFxuICAgIH1cbiAgICBjYXRjaChlcnJvcikge1xuICAgICAgcmV0dXJuRGF0YT1kZWZhdWx0UmV0dXJuRGF0YTtcbiAgICB9XG5cbiAgICAgIGxvZ1NlbmQoJ2RvaU1haWxEYXRhIGFuZCB1cmw6JywgRE9JX01BSUxfRkVUQ0hfVVJMLCByZXR1cm5EYXRhKTtcblxuICAgICAgcmV0dXJuIHJldHVybkRhdGFcblxuICAgIH0gY2F0Y2goZXJyb3IpIHtcbiAgICAgIHRocm93IFwiRXJyb3Igd2hpbGUgZmV0Y2hpbmcgbWFpbCBjb250ZW50OiBcIitlcnJvcjtcbiAgICB9XG5cbiAgfSBjYXRjaChleGNlcHRpb24pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdkYXBwcy5nZXREb2lNYWlsRGF0YS5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBnZXREb2lNYWlsRGF0YTtcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tICdzaW1wbC1zY2hlbWEnO1xuaW1wb3J0IHsgcmVzb2x2ZVR4dCB9IGZyb20gJy4uLy4uLy4uLy4uL3NlcnZlci9hcGkvZG5zLmpzJztcbmltcG9ydCB7IEZBTExCQUNLX1BST1ZJREVSIH0gZnJvbSAnLi4vLi4vLi4vc3RhcnR1cC9zZXJ2ZXIvZG5zLWNvbmZpZ3VyYXRpb24uanMnO1xuaW1wb3J0IHtpc1JlZ3Rlc3QsIGlzVGVzdG5ldH0gZnJvbSBcIi4uLy4uLy4uL3N0YXJ0dXAvc2VydmVyL2RhcHAtY29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHtsb2dTZW5kfSBmcm9tIFwiLi4vLi4vLi4vc3RhcnR1cC9zZXJ2ZXIvbG9nLWNvbmZpZ3VyYXRpb25cIjtcblxuY29uc3QgT1BUX0lOX0tFWSA9IFwiZG9pY2hhaW4tb3B0LWluLWtleVwiO1xuY29uc3QgT1BUX0lOX0tFWV9URVNUTkVUID0gXCJkb2ljaGFpbi10ZXN0bmV0LW9wdC1pbi1rZXlcIjtcblxuY29uc3QgR2V0T3B0SW5LZXlTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgZG9tYWluOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH1cbn0pO1xuXG5cbmNvbnN0IGdldE9wdEluS2V5ID0gKGRhdGEpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBvdXJEYXRhID0gZGF0YTtcbiAgICBHZXRPcHRJbktleVNjaGVtYS52YWxpZGF0ZShvdXJEYXRhKTtcblxuICAgIGxldCBvdXJPUFRfSU5fS0VZPU9QVF9JTl9LRVk7XG5cbiAgICBpZihpc1JlZ3Rlc3QoKSB8fCBpc1Rlc3RuZXQoKSl7XG4gICAgICAgIG91ck9QVF9JTl9LRVkgPSBPUFRfSU5fS0VZX1RFU1RORVQ7XG4gICAgICAgIGxvZ1NlbmQoJ1VzaW5nIFJlZ1Rlc3Q6Jytpc1JlZ3Rlc3QoKStcIiBUZXN0bmV0OiBcIitpc1Rlc3RuZXQoKStcIiBvdXJPUFRfSU5fS0VZXCIsb3VyT1BUX0lOX0tFWSk7XG4gICAgfVxuICAgIGNvbnN0IGtleSA9IHJlc29sdmVUeHQob3VyT1BUX0lOX0tFWSwgb3VyRGF0YS5kb21haW4pO1xuICAgIGxvZ1NlbmQoJ0ROUyBUWFQgY29uZmlndXJlZCBwdWJsaWMga2V5IG9mIHJlY2lwaWVudCBlbWFpbCBkb21haW4gYW5kIGNvbmZpcm1hdGlvbiBkYXBwJyx7Zm91bmRLZXk6a2V5LCBkb21haW46b3VyRGF0YS5kb21haW4sIGRuc2tleTpvdXJPUFRfSU5fS0VZfSk7XG5cbiAgICBpZihrZXkgPT09IHVuZGVmaW5lZCkgcmV0dXJuIHVzZUZhbGxiYWNrKG91ckRhdGEuZG9tYWluKTtcbiAgICByZXR1cm4ga2V5O1xuICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdkbnMuZ2V0T3B0SW5LZXkuZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgfVxufTtcblxuY29uc3QgdXNlRmFsbGJhY2sgPSAoZG9tYWluKSA9PiB7XG4gIGlmKGRvbWFpbiA9PT0gRkFMTEJBQ0tfUFJPVklERVIpIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoXCJGYWxsYmFjayBoYXMgbm8ga2V5IGRlZmluZWQhXCIpO1xuICAgIGxvZ1NlbmQoXCJLZXkgbm90IGRlZmluZWQuIFVzaW5nIGZhbGxiYWNrOiBcIixGQUxMQkFDS19QUk9WSURFUik7XG4gIHJldHVybiBnZXRPcHRJbktleSh7ZG9tYWluOiBGQUxMQkFDS19QUk9WSURFUn0pO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgZ2V0T3B0SW5LZXk7XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcbmltcG9ydCB7IHJlc29sdmVUeHQgfSBmcm9tICcuLi8uLi8uLi8uLi9zZXJ2ZXIvYXBpL2Rucy5qcyc7XG5pbXBvcnQgeyBGQUxMQkFDS19QUk9WSURFUiB9IGZyb20gJy4uLy4uLy4uL3N0YXJ0dXAvc2VydmVyL2Rucy1jb25maWd1cmF0aW9uLmpzJztcbmltcG9ydCB7bG9nU2VuZH0gZnJvbSBcIi4uLy4uLy4uL3N0YXJ0dXAvc2VydmVyL2xvZy1jb25maWd1cmF0aW9uXCI7XG5pbXBvcnQge2lzUmVndGVzdCwgaXNUZXN0bmV0fSBmcm9tIFwiLi4vLi4vLi4vc3RhcnR1cC9zZXJ2ZXIvZGFwcC1jb25maWd1cmF0aW9uXCI7XG5cbmNvbnN0IFBST1ZJREVSX0tFWSA9IFwiZG9pY2hhaW4tb3B0LWluLXByb3ZpZGVyXCI7XG5jb25zdCBQUk9WSURFUl9LRVlfVEVTVE5FVCA9IFwiZG9pY2hhaW4tdGVzdG5ldC1vcHQtaW4tcHJvdmlkZXJcIjtcblxuY29uc3QgR2V0T3B0SW5Qcm92aWRlclNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICBkb21haW46IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfVxufSk7XG5cblxuY29uc3QgZ2V0T3B0SW5Qcm92aWRlciA9IChkYXRhKSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3Qgb3VyRGF0YSA9IGRhdGE7XG4gICAgR2V0T3B0SW5Qcm92aWRlclNjaGVtYS52YWxpZGF0ZShvdXJEYXRhKTtcblxuICAgIGxldCBvdXJQUk9WSURFUl9LRVk9UFJPVklERVJfS0VZO1xuICAgIGlmKGlzUmVndGVzdCgpIHx8IGlzVGVzdG5ldCgpKXtcbiAgICAgICAgb3VyUFJPVklERVJfS0VZID0gUFJPVklERVJfS0VZX1RFU1RORVQ7XG4gICAgICAgIGxvZ1NlbmQoJ1VzaW5nIFJlZ1Rlc3Q6Jytpc1JlZ3Rlc3QoKStcIiA6IFRlc3RuZXQ6XCIraXNUZXN0bmV0KCkrXCIgUFJPVklERVJfS0VZXCIse3Byb3ZpZGVyS2V5Om91clBST1ZJREVSX0tFWSwgZG9tYWluOm91ckRhdGEuZG9tYWlufSk7XG4gICAgfVxuXG4gICAgY29uc3QgcHJvdmlkZXIgPSByZXNvbHZlVHh0KG91clBST1ZJREVSX0tFWSwgb3VyRGF0YS5kb21haW4pO1xuICAgIGlmKHByb3ZpZGVyID09PSB1bmRlZmluZWQpIHJldHVybiB1c2VGYWxsYmFjaygpO1xuXG4gICAgbG9nU2VuZCgnb3B0LWluLXByb3ZpZGVyIGZyb20gZG5zIC0gc2VydmVyIG9mIG1haWwgcmVjaXBpZW50OiAoVFhUKTonLHByb3ZpZGVyKTtcbiAgICByZXR1cm4gcHJvdmlkZXI7XG4gIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2Rucy5nZXRPcHRJblByb3ZpZGVyLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH1cbn07XG5cbmNvbnN0IHVzZUZhbGxiYWNrID0gKCkgPT4ge1xuICBsb2dTZW5kKCdQcm92aWRlciBub3QgZGVmaW5lZC4gRmFsbGJhY2sgJytGQUxMQkFDS19QUk9WSURFUisnIGlzIHVzZWQnKTtcbiAgcmV0dXJuIEZBTExCQUNLX1BST1ZJREVSO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgZ2V0T3B0SW5Qcm92aWRlcjtcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tICdzaW1wbC1zY2hlbWEnO1xuaW1wb3J0IHsgQ09ORklSTV9DTElFTlQsIENPTkZJUk1fQUREUkVTUyB9IGZyb20gJy4uLy4uLy4uL3N0YXJ0dXAvc2VydmVyL2RvaWNoYWluLWNvbmZpZ3VyYXRpb24uanMnO1xuaW1wb3J0IHsgZ2V0V2lmIH0gZnJvbSAnLi4vLi4vLi4vLi4vc2VydmVyL2FwaS9kb2ljaGFpbi5qcyc7XG5pbXBvcnQgeyBEb2ljaGFpbkVudHJpZXMgfSBmcm9tICcuLi8uLi8uLi9hcGkvZG9pY2hhaW4vZW50cmllcy5qcyc7XG5pbXBvcnQgYWRkRmV0Y2hEb2lNYWlsRGF0YUpvYiBmcm9tICcuLi9qb2JzL2FkZF9mZXRjaC1kb2ktbWFpbC1kYXRhLmpzJztcbmltcG9ydCBnZXRQcml2YXRlS2V5RnJvbVdpZiBmcm9tICcuL2dldF9wcml2YXRlLWtleV9mcm9tX3dpZi5qcyc7XG5pbXBvcnQgZGVjcnlwdE1lc3NhZ2UgZnJvbSAnLi9kZWNyeXB0X21lc3NhZ2UuanMnO1xuaW1wb3J0IHtsb2dDb25maXJtLCBsb2dTZW5kfSBmcm9tIFwiLi4vLi4vLi4vc3RhcnR1cC9zZXJ2ZXIvbG9nLWNvbmZpZ3VyYXRpb25cIjtcblxuY29uc3QgQWRkRG9pY2hhaW5FbnRyeVNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICBuYW1lOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH0sXG4gIHZhbHVlOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH0sXG4gIGFkZHJlc3M6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfSxcbiAgdHhJZDoge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9XG59KTtcblxuLyoqXG4gKiBJbnNlcnRzXG4gKlxuICogQHBhcmFtIGVudHJ5XG4gKiBAcmV0dXJucyB7Kn1cbiAqL1xuY29uc3QgYWRkRG9pY2hhaW5FbnRyeSA9IChlbnRyeSkgPT4ge1xuICB0cnkge1xuXG4gICAgY29uc3Qgb3VyRW50cnkgPSBlbnRyeTtcbiAgICBsb2dDb25maXJtKCdhZGRpbmcgRG9pY2hhaW5FbnRyeSBvbiBCb2IuLi4nLG91ckVudHJ5Lm5hbWUpO1xuICAgIEFkZERvaWNoYWluRW50cnlTY2hlbWEudmFsaWRhdGUob3VyRW50cnkpO1xuXG4gICAgY29uc3QgZXR5ID0gRG9pY2hhaW5FbnRyaWVzLmZpbmRPbmUoe25hbWU6IG91ckVudHJ5Lm5hbWV9KTtcbiAgICBpZihldHkgIT09IHVuZGVmaW5lZCl7XG4gICAgICAgIGxvZ1NlbmQoJ3JldHVybmluZyBsb2NhbGx5IHNhdmVkIGVudHJ5IHdpdGggX2lkOicrZXR5Ll9pZCk7XG4gICAgICAgIHJldHVybiBldHkuX2lkO1xuICAgIH1cblxuICAgIGNvbnN0IHZhbHVlID0gSlNPTi5wYXJzZShvdXJFbnRyeS52YWx1ZSk7XG4gICAgLy9sb2dTZW5kKFwidmFsdWU6XCIsdmFsdWUpO1xuICAgIGlmKHZhbHVlLmZyb20gPT09IHVuZGVmaW5lZCkgdGhyb3cgXCJXcm9uZyBibG9ja2NoYWluIGVudHJ5XCI7IC8vVE9ETyBpZiBmcm9tIGlzIG1pc3NpbmcgYnV0IHZhbHVlIGlzIHRoZXJlLCBpdCBpcyBwcm9iYWJseSBhbGxyZWFkeSBoYW5kZWxlZCBjb3JyZWN0bHkgYW55d2F5cyB0aGlzIGlzIG5vdCBzbyBjb29sIGFzIGl0IHNlZW1zLlxuICAgIGNvbnN0IHdpZiA9IGdldFdpZihDT05GSVJNX0NMSUVOVCwgQ09ORklSTV9BRERSRVNTKTtcbiAgICBjb25zdCBwcml2YXRlS2V5ID0gZ2V0UHJpdmF0ZUtleUZyb21XaWYoe3dpZjogd2lmfSk7XG4gICAgbG9nU2VuZCgnZ290IHByaXZhdGUga2V5ICh3aWxsIG5vdCBzaG93IGl0IGhlcmUpJyk7XG5cbiAgICBjb25zdCBkb21haW4gPSBkZWNyeXB0TWVzc2FnZSh7cHJpdmF0ZUtleTogcHJpdmF0ZUtleSwgbWVzc2FnZTogdmFsdWUuZnJvbX0pO1xuICAgIGxvZ1NlbmQoJ2RlY3J5cHRlZCBtZXNzYWdlIGZyb20gZG9tYWluOiAnLGRvbWFpbik7XG5cbiAgICBjb25zdCBuYW1lUG9zID0gb3VyRW50cnkubmFtZS5pbmRleE9mKCctJyk7IC8vaWYgdGhpcyBpcyBub3QgYSBjby1yZWdpc3RyYXRpb24gZmV0Y2ggbWFpbC5cbiAgICBsb2dTZW5kKCduYW1lUG9zOicsbmFtZVBvcyk7XG4gICAgY29uc3QgbWFzdGVyRG9pID0gKG5hbWVQb3MhPS0xKT9vdXJFbnRyeS5uYW1lLnN1YnN0cmluZygwLG5hbWVQb3MpOnVuZGVmaW5lZDtcbiAgICBsb2dTZW5kKCdtYXN0ZXJEb2k6JyxtYXN0ZXJEb2kpO1xuICAgIGNvbnN0IGluZGV4ID0gbWFzdGVyRG9pP291ckVudHJ5Lm5hbWUuc3Vic3RyaW5nKG5hbWVQb3MrMSk6dW5kZWZpbmVkO1xuICAgIGxvZ1NlbmQoJ2luZGV4OicsaW5kZXgpO1xuXG4gICAgY29uc3QgaWQgPSBEb2ljaGFpbkVudHJpZXMuaW5zZXJ0KHtcbiAgICAgICAgbmFtZTogb3VyRW50cnkubmFtZSxcbiAgICAgICAgdmFsdWU6IG91ckVudHJ5LnZhbHVlLFxuICAgICAgICBhZGRyZXNzOiBvdXJFbnRyeS5hZGRyZXNzLFxuICAgICAgICBtYXN0ZXJEb2k6IG1hc3RlckRvaSxcbiAgICAgICAgaW5kZXg6IGluZGV4LFxuICAgICAgICB0eElkOiBvdXJFbnRyeS50eElkLFxuICAgICAgICBleHBpcmVzSW46IG91ckVudHJ5LmV4cGlyZXNJbixcbiAgICAgICAgZXhwaXJlZDogb3VyRW50cnkuZXhwaXJlZFxuICAgIH0pO1xuXG4gICAgbG9nU2VuZCgnRG9pY2hhaW5FbnRyeSBhZGRlZCBvbiBCb2I6Jywge2lkOmlkLG5hbWU6b3VyRW50cnkubmFtZSxtYXN0ZXJEb2k6bWFzdGVyRG9pLGluZGV4OmluZGV4fSk7XG5cbiAgICBpZighbWFzdGVyRG9pKXtcbiAgICAgICAgYWRkRmV0Y2hEb2lNYWlsRGF0YUpvYih7XG4gICAgICAgICAgICBuYW1lOiBvdXJFbnRyeS5uYW1lLFxuICAgICAgICAgICAgZG9tYWluOiBkb21haW5cbiAgICAgICAgfSk7XG4gICAgICAgIGxvZ1NlbmQoJ05ldyBlbnRyeSBhZGRlZDogXFxuJytcbiAgICAgICAgICAgICdOYW1lSWQ9JytvdXJFbnRyeS5uYW1lK1wiXFxuXCIrXG4gICAgICAgICAgICAnQWRkcmVzcz0nK291ckVudHJ5LmFkZHJlc3MrXCJcXG5cIitcbiAgICAgICAgICAgICdUeElkPScrb3VyRW50cnkudHhJZCtcIlxcblwiK1xuICAgICAgICAgICAgJ1ZhbHVlPScrb3VyRW50cnkudmFsdWUpO1xuXG4gICAgfWVsc2V7XG4gICAgICAgIGxvZ1NlbmQoJ1RoaXMgdHJhbnNhY3Rpb24gYmVsb25ncyB0byBjby1yZWdpc3RyYXRpb24nLCBtYXN0ZXJEb2kpO1xuICAgIH1cblxuICAgIHJldHVybiBpZDtcbiAgfSBjYXRjaCAoZXhjZXB0aW9uKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZG9pY2hhaW4uYWRkRW50cnlBbmRGZXRjaERhdGEuZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgYWRkRG9pY2hhaW5FbnRyeTtcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IHsgbGlzdFNpbmNlQmxvY2ssIG5hbWVTaG93LCBnZXRSYXdUcmFuc2FjdGlvbn0gZnJvbSAnLi4vLi4vLi4vLi4vc2VydmVyL2FwaS9kb2ljaGFpbi5qcyc7XG5pbXBvcnQgeyBDT05GSVJNX0NMSUVOVCwgQ09ORklSTV9BRERSRVNTIH0gZnJvbSAnLi4vLi4vLi4vc3RhcnR1cC9zZXJ2ZXIvZG9pY2hhaW4tY29uZmlndXJhdGlvbi5qcyc7XG5pbXBvcnQgYWRkRG9pY2hhaW5FbnRyeSBmcm9tICcuL2FkZF9lbnRyeV9hbmRfZmV0Y2hfZGF0YS5qcydcbmltcG9ydCB7IE1ldGEgfSBmcm9tICcuLi8uLi8uLi9hcGkvbWV0YS9tZXRhLmpzJztcbmltcG9ydCBhZGRPclVwZGF0ZU1ldGEgZnJvbSAnLi4vbWV0YS9hZGRPclVwZGF0ZS5qcyc7XG5pbXBvcnQge2xvZ0NvbmZpcm19IGZyb20gXCIuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9sb2ctY29uZmlndXJhdGlvblwiO1xuXG5jb25zdCBUWF9OQU1FX1NUQVJUID0gXCJlL1wiO1xuY29uc3QgTEFTVF9DSEVDS0VEX0JMT0NLX0tFWSA9IFwibGFzdENoZWNrZWRCbG9ja1wiO1xuXG5jb25zdCBjaGVja05ld1RyYW5zYWN0aW9uID0gKHR4aWQsIGpvYikgPT4ge1xuICB0cnkge1xuXG4gICAgICBpZighdHhpZCl7XG4gICAgICAgICAgbG9nQ29uZmlybShcImNoZWNrTmV3VHJhbnNhY3Rpb24gdHJpZ2dlcmVkIHdoZW4gc3RhcnRpbmcgbm9kZSAtIGNoZWNraW5nIGFsbCBjb25maXJtZWQgYmxvY2tzIHNpbmNlIGxhc3QgY2hlY2sgZm9yIGRvaWNoYWluIGFkZHJlc3NcIixDT05GSVJNX0FERFJFU1MpO1xuXG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgdmFyIGxhc3RDaGVja2VkQmxvY2sgPSBNZXRhLmZpbmRPbmUoe2tleTogTEFTVF9DSEVDS0VEX0JMT0NLX0tFWX0pO1xuICAgICAgICAgICAgICBpZihsYXN0Q2hlY2tlZEJsb2NrICE9PSB1bmRlZmluZWQpIGxhc3RDaGVja2VkQmxvY2sgPSBsYXN0Q2hlY2tlZEJsb2NrLnZhbHVlO1xuICAgICAgICAgICAgICBsb2dDb25maXJtKFwibGFzdENoZWNrZWRCbG9ja1wiLGxhc3RDaGVja2VkQmxvY2spO1xuICAgICAgICAgICAgICBjb25zdCByZXQgPSBsaXN0U2luY2VCbG9jayhDT05GSVJNX0NMSUVOVCwgbGFzdENoZWNrZWRCbG9jayk7XG4gICAgICAgICAgICAgIGlmKHJldCA9PT0gdW5kZWZpbmVkIHx8IHJldC50cmFuc2FjdGlvbnMgPT09IHVuZGVmaW5lZCkgcmV0dXJuO1xuXG4gICAgICAgICAgICAgIGNvbnN0IHR4cyA9IHJldC50cmFuc2FjdGlvbnM7XG4gICAgICAgICAgICAgIGxhc3RDaGVja2VkQmxvY2sgPSByZXQubGFzdGJsb2NrO1xuICAgICAgICAgICAgICBpZighcmV0IHx8ICF0eHMgfHwgIXR4cy5sZW5ndGg9PT0wKXtcbiAgICAgICAgICAgICAgICAgIGxvZ0NvbmZpcm0oXCJ0cmFuc2FjdGlvbnMgZG8gbm90IGNvbnRhaW4gbmFtZU9wIHRyYW5zYWN0aW9uIGRldGFpbHMgb3IgdHJhbnNhY3Rpb24gbm90IGZvdW5kLlwiLCBsYXN0Q2hlY2tlZEJsb2NrKTtcbiAgICAgICAgICAgICAgICAgIGFkZE9yVXBkYXRlTWV0YSh7a2V5OiBMQVNUX0NIRUNLRURfQkxPQ0tfS0VZLCB2YWx1ZTogbGFzdENoZWNrZWRCbG9ja30pO1xuICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgbG9nQ29uZmlybShcImxpc3RTaW5jZUJsb2NrXCIscmV0KTtcblxuICAgICAgICAgICAgICBjb25zdCBhZGRyZXNzVHhzID0gdHhzLmZpbHRlcih0eCA9PlxuICAgICAgICAgICAgICAgICAgdHguYWRkcmVzcyA9PT0gQ09ORklSTV9BRERSRVNTXG4gICAgICAgICAgICAgICAgICAmJiB0eC5uYW1lICE9PSB1bmRlZmluZWQgLy9zaW5jZSBuYW1lX3Nob3cgY2Fubm90IGJlIHJlYWQgd2l0aG91dCBjb25maXJtYXRpb25zXG4gICAgICAgICAgICAgICAgICAmJiB0eC5uYW1lLnN0YXJ0c1dpdGgoXCJkb2k6IFwiK1RYX05BTUVfU1RBUlQpICAvL2hlcmUgJ2RvaTogZS94eHh4JyBpcyBhbHJlYWR5IHdyaXR0ZW4gaW4gdGhlIGJsb2NrXG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgIGFkZHJlc3NUeHMuZm9yRWFjaCh0eCA9PiB7XG4gICAgICAgICAgICAgICAgICBsb2dDb25maXJtKFwidHg6XCIsdHgpO1xuICAgICAgICAgICAgICAgICAgdmFyIHR4TmFtZSA9IHR4Lm5hbWUuc3Vic3RyaW5nKChcImRvaTogXCIrVFhfTkFNRV9TVEFSVCkubGVuZ3RoKTtcbiAgICAgICAgICAgICAgICAgIGxvZ0NvbmZpcm0oXCJleGN1dGluZyBuYW1lX3Nob3cgaW4gb3JkZXIgdG8gZ2V0IHZhbHVlIG9mIG5hbWVJZDpcIiwgdHhOYW1lKTtcbiAgICAgICAgICAgICAgICAgIGNvbnN0IGV0eSA9IG5hbWVTaG93KENPTkZJUk1fQ0xJRU5ULCB0eE5hbWUpO1xuICAgICAgICAgICAgICAgICAgbG9nQ29uZmlybShcIm5hbWVTaG93OiB2YWx1ZVwiLGV0eSk7XG4gICAgICAgICAgICAgICAgICBpZighZXR5KXtcbiAgICAgICAgICAgICAgICAgICAgICBsb2dDb25maXJtKFwiY291bGRuJ3QgZmluZCBuYW1lIC0gb2J2aW91c2x5IG5vdCAoeWV0PyEpIGNvbmZpcm1lZCBpbiBibG9ja2NoYWluOlwiLCBldHkpO1xuICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIGFkZFR4KHR4TmFtZSwgZXR5LnZhbHVlLHR4LmFkZHJlc3MsdHgudHhpZCk7IC8vVE9ETyBldHkudmFsdWUuZnJvbSBpcyBtYXliZSBOT1QgZXhpc3RpbmcgYmVjYXVzZSBvZiB0aGlzIGl0cyAgKG1heWJlKSBvbnQgd29ya2luZy4uLlxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgYWRkT3JVcGRhdGVNZXRhKHtrZXk6IExBU1RfQ0hFQ0tFRF9CTE9DS19LRVksIHZhbHVlOiBsYXN0Q2hlY2tlZEJsb2NrfSk7XG4gICAgICAgICAgICAgIGxvZ0NvbmZpcm0oXCJUcmFuc2FjdGlvbnMgdXBkYXRlZCAtIGxhc3RDaGVja2VkQmxvY2s6XCIsbGFzdENoZWNrZWRCbG9jayk7XG4gICAgICAgICAgICAgIGpvYi5kb25lKCk7XG4gICAgICAgICAgfSBjYXRjaChleGNlcHRpb24pIHtcbiAgICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignbmFtZWNvaW4uY2hlY2tOZXdUcmFuc2FjdGlvbnMuZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgICAgICAgICB9XG5cbiAgICAgIH1lbHNle1xuICAgICAgICAgIGxvZ0NvbmZpcm0oXCJ0eGlkOiBcIit0eGlkK1wiIHdhcyB0cmlnZ2VyZWQgYnkgd2FsbGV0bm90aWZ5IGZvciBhZGRyZXNzOlwiLENPTkZJUk1fQUREUkVTUyk7XG5cbiAgICAgICAgICBjb25zdCByZXQgPSBnZXRSYXdUcmFuc2FjdGlvbihDT05GSVJNX0NMSUVOVCwgdHhpZCk7XG4gICAgICAgICAgY29uc3QgdHhzID0gcmV0LnZvdXQ7XG5cbiAgICAgICAgICBpZighcmV0IHx8ICF0eHMgfHwgIXR4cy5sZW5ndGg9PT0wKXtcbiAgICAgICAgICAgICAgbG9nQ29uZmlybShcInR4aWQgXCIrdHhpZCsnIGRvZXMgbm90IGNvbnRhaW4gdHJhbnNhY3Rpb24gZGV0YWlscyBvciB0cmFuc2FjdGlvbiBub3QgZm91bmQuJyk7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgIC8vIGxvZ0NvbmZpcm0oJ25vdyBjaGVja2luZyByYXcgdHJhbnNhY3Rpb25zIHdpdGggZmlsdGVyOicsdHhzKTtcblxuICAgICAgICAgIGNvbnN0IGFkZHJlc3NUeHMgPSB0eHMuZmlsdGVyKHR4ID0+XG4gICAgICAgICAgICAgIHR4LnNjcmlwdFB1YktleSAhPT0gdW5kZWZpbmVkXG4gICAgICAgICAgICAgICYmIHR4LnNjcmlwdFB1YktleS5uYW1lT3AgIT09IHVuZGVmaW5lZFxuICAgICAgICAgICAgICAmJiB0eC5zY3JpcHRQdWJLZXkubmFtZU9wLm9wID09PSBcIm5hbWVfZG9pXCJcbiAgICAgICAgICAgIC8vICAmJiB0eC5zY3JpcHRQdWJLZXkuYWRkcmVzc2VzWzBdID09PSBDT05GSVJNX0FERFJFU1MgLy9vbmx5IG93biB0cmFuc2FjdGlvbiBzaG91bGQgYXJyaXZlIGhlcmUuIC0gc28gY2hlY2sgb24gb3duIGFkZHJlc3MgdW5uZWNjZXNhcnlcbiAgICAgICAgICAgICAgJiYgdHguc2NyaXB0UHViS2V5Lm5hbWVPcC5uYW1lICE9PSB1bmRlZmluZWRcbiAgICAgICAgICAgICAgJiYgdHguc2NyaXB0UHViS2V5Lm5hbWVPcC5uYW1lLnN0YXJ0c1dpdGgoVFhfTkFNRV9TVEFSVClcbiAgICAgICAgICApO1xuXG4gICAgICAgICAgLy9sb2dDb25maXJtKFwiZm91bmQgbmFtZV9vcCB0cmFuc2FjdGlvbnM6XCIsIGFkZHJlc3NUeHMpO1xuXG4gICAgICAgICAgYWRkcmVzc1R4cy5mb3JFYWNoKHR4ID0+IHtcbiAgICAgICAgICAgICAgYWRkVHgodHguc2NyaXB0UHViS2V5Lm5hbWVPcC5uYW1lLCB0eC5zY3JpcHRQdWJLZXkubmFtZU9wLnZhbHVlLHR4LnNjcmlwdFB1YktleS5hZGRyZXNzZXNbMF0sdHhpZCk7XG4gICAgICAgICAgfSk7XG4gICAgICB9XG5cblxuXG4gIH0gY2F0Y2goZXhjZXB0aW9uKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZG9pY2hhaW4uY2hlY2tOZXdUcmFuc2FjdGlvbnMuZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn07XG5cblxuZnVuY3Rpb24gYWRkVHgobmFtZSwgdmFsdWUsIGFkZHJlc3MsIHR4aWQpIHtcbiAgICBjb25zdCB0eE5hbWUgPSBuYW1lLnN1YnN0cmluZyhUWF9OQU1FX1NUQVJULmxlbmd0aCk7XG5cbiAgICBhZGREb2ljaGFpbkVudHJ5KHtcbiAgICAgICAgbmFtZTogdHhOYW1lLFxuICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgIGFkZHJlc3M6IGFkZHJlc3MsXG4gICAgICAgIHR4SWQ6IHR4aWRcbiAgICB9KTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2hlY2tOZXdUcmFuc2FjdGlvbjtcblxuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XG5pbXBvcnQgY3J5cHRvIGZyb20gJ2NyeXB0byc7XG5pbXBvcnQgZWNpZXMgZnJvbSAnc3RhbmRhcmQtZWNpZXMnO1xuXG5jb25zdCBEZWNyeXB0TWVzc2FnZVNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICBwcml2YXRlS2V5OiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH0sXG4gIG1lc3NhZ2U6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfVxufSk7XG5cbmNvbnN0IGRlY3J5cHRNZXNzYWdlID0gKGRhdGEpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBvdXJEYXRhID0gZGF0YTtcbiAgICBEZWNyeXB0TWVzc2FnZVNjaGVtYS52YWxpZGF0ZShvdXJEYXRhKTtcbiAgICBjb25zdCBwcml2YXRlS2V5ID0gQnVmZmVyLmZyb20ob3VyRGF0YS5wcml2YXRlS2V5LCAnaGV4Jyk7XG4gICAgY29uc3QgZWNkaCA9IGNyeXB0by5jcmVhdGVFQ0RIKCdzZWNwMjU2azEnKTtcbiAgICBlY2RoLnNldFByaXZhdGVLZXkocHJpdmF0ZUtleSk7XG4gICAgY29uc3QgbWVzc2FnZSA9IEJ1ZmZlci5mcm9tKG91ckRhdGEubWVzc2FnZSwgJ2hleCcpO1xuICAgIHJldHVybiBlY2llcy5kZWNyeXB0KGVjZGgsIG1lc3NhZ2UpLnRvU3RyaW5nKCd1dGY4Jyk7XG4gIH0gY2F0Y2goZXhjZXB0aW9uKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZG9pY2hhaW4uZGVjcnlwdE1lc3NhZ2UuZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgZGVjcnlwdE1lc3NhZ2U7XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcbmltcG9ydCBlY2llcyBmcm9tICdzdGFuZGFyZC1lY2llcyc7XG5cbmNvbnN0IEVuY3J5cHRNZXNzYWdlU2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIHB1YmxpY0tleToge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9LFxuICBtZXNzYWdlOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH1cbn0pO1xuXG5jb25zdCBlbmNyeXB0TWVzc2FnZSA9IChkYXRhKSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3Qgb3VyRGF0YSA9IGRhdGE7XG4gICAgRW5jcnlwdE1lc3NhZ2VTY2hlbWEudmFsaWRhdGUob3VyRGF0YSk7XG4gICAgY29uc3QgcHVibGljS2V5ID0gQnVmZmVyLmZyb20ob3VyRGF0YS5wdWJsaWNLZXksICdoZXgnKTtcbiAgICBjb25zdCBtZXNzYWdlID0gQnVmZmVyLmZyb20ob3VyRGF0YS5tZXNzYWdlKTtcbiAgICByZXR1cm4gZWNpZXMuZW5jcnlwdChwdWJsaWNLZXksIG1lc3NhZ2UpLnRvU3RyaW5nKCdoZXgnKTtcbiAgfSBjYXRjaChleGNlcHRpb24pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdkb2ljaGFpbi5lbmNyeXB0TWVzc2FnZS5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBlbmNyeXB0TWVzc2FnZTtcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tICdzaW1wbC1zY2hlbWEnO1xuaW1wb3J0IHsgT3B0SW5zIH0gZnJvbSAnLi4vLi4vLi4vYXBpL29wdC1pbnMvb3B0LWlucy5qcyc7XG5pbXBvcnQgZ2V0S2V5UGFpciBmcm9tICcuL2dldF9rZXktcGFpci5qcyc7XG5pbXBvcnQge2xvZ1NlbmR9IGZyb20gXCIuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9sb2ctY29uZmlndXJhdGlvblwiO1xuXG5jb25zdCBHZW5lcmF0ZU5hbWVJZFNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICBpZDoge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9LFxuICBtYXN0ZXJEb2k6IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIG9wdGlvbmFsOiB0cnVlXG4gIH0sXG4gIGluZGV4OiB7XG4gICAgICB0eXBlOiBTaW1wbGVTY2hlbWEuSW50ZWdlcixcbiAgICAgIG9wdGlvbmFsOiB0cnVlXG4gIH1cbn0pO1xuXG5jb25zdCBnZW5lcmF0ZU5hbWVJZCA9IChvcHRJbikgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IG91ck9wdEluID0gb3B0SW47XG4gICAgR2VuZXJhdGVOYW1lSWRTY2hlbWEudmFsaWRhdGUob3VyT3B0SW4pO1xuICAgIGxldCBuYW1lSWQ7XG4gICAgaWYob3B0SW4ubWFzdGVyRG9pKXtcbiAgICAgICAgbmFtZUlkID0gb3VyT3B0SW4ubWFzdGVyRG9pK1wiLVwiK291ck9wdEluLmluZGV4O1xuICAgICAgICBsb2dTZW5kKFwidXNlZCBtYXN0ZXJfZG9pIGFzIG5hbWVJZCBpbmRleCBcIitvcHRJbi5pbmRleCtcInN0b3JhZ2U6XCIsbmFtZUlkKTtcbiAgICB9XG4gICAgZWxzZXtcbiAgICAgICAgbmFtZUlkID0gZ2V0S2V5UGFpcigpLnByaXZhdGVLZXk7XG4gICAgICAgIGxvZ1NlbmQoXCJnZW5lcmF0ZWQgbmFtZUlkIGZvciBkb2ljaGFpbiBzdG9yYWdlOlwiLG5hbWVJZCk7XG4gICAgfVxuXG4gICAgT3B0SW5zLnVwZGF0ZSh7X2lkIDogb3VyT3B0SW4uaWR9LCB7JHNldDp7bmFtZUlkOiBuYW1lSWR9fSk7XG5cbiAgICByZXR1cm4gbmFtZUlkO1xuICB9IGNhdGNoKGV4Y2VwdGlvbikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2RvaWNoYWluLmdlbmVyYXRlTmFtZUlkLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGdlbmVyYXRlTmFtZUlkO1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XG5pbXBvcnQgQ3J5cHRvSlMgZnJvbSAnY3J5cHRvLWpzJztcbmltcG9ydCBCYXNlNTggZnJvbSAnYnM1OCc7XG5pbXBvcnQgeyBpc1JlZ3Rlc3QgfSBmcm9tICcuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9kYXBwLWNvbmZpZ3VyYXRpb24uanMnO1xuaW1wb3J0IHtpc1Rlc3RuZXR9IGZyb20gXCIuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9kYXBwLWNvbmZpZ3VyYXRpb25cIjtcblxuY29uc3QgVkVSU0lPTl9CWVRFID0gMHgzNDtcbmNvbnN0IFZFUlNJT05fQllURV9SRUdURVNUID0gMHg2ZjtcbmNvbnN0IEdldEFkZHJlc3NTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgcHVibGljS2V5OiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH1cbn0pO1xuXG5jb25zdCBnZXRBZGRyZXNzID0gKGRhdGEpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBvdXJEYXRhID0gZGF0YTtcbiAgICBHZXRBZGRyZXNzU2NoZW1hLnZhbGlkYXRlKG91ckRhdGEpO1xuICAgIHJldHVybiBfZ2V0QWRkcmVzcyhvdXJEYXRhLnB1YmxpY0tleSk7XG4gIH0gY2F0Y2goZXhjZXB0aW9uKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZG9pY2hhaW4uZ2V0QWRkcmVzcy5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9XG59O1xuXG5mdW5jdGlvbiBfZ2V0QWRkcmVzcyhwdWJsaWNLZXkpIHtcbiAgY29uc3QgcHViS2V5ID0gQ3J5cHRvSlMubGliLldvcmRBcnJheS5jcmVhdGUoQnVmZmVyLmZyb20ocHVibGljS2V5LCAnaGV4JykpO1xuICBsZXQga2V5ID0gQ3J5cHRvSlMuU0hBMjU2KHB1YktleSk7XG4gIGtleSA9IENyeXB0b0pTLlJJUEVNRDE2MChrZXkpO1xuICBsZXQgdmVyc2lvbkJ5dGUgPSBWRVJTSU9OX0JZVEU7XG4gIGlmKGlzUmVndGVzdCgpIHx8IGlzVGVzdG5ldCgpKSB2ZXJzaW9uQnl0ZSA9IFZFUlNJT05fQllURV9SRUdURVNUO1xuICBsZXQgYWRkcmVzcyA9IEJ1ZmZlci5jb25jYXQoW0J1ZmZlci5mcm9tKFt2ZXJzaW9uQnl0ZV0pLCBCdWZmZXIuZnJvbShrZXkudG9TdHJpbmcoKSwgJ2hleCcpXSk7XG4gIGtleSA9IENyeXB0b0pTLlNIQTI1NihDcnlwdG9KUy5saWIuV29yZEFycmF5LmNyZWF0ZShhZGRyZXNzKSk7XG4gIGtleSA9IENyeXB0b0pTLlNIQTI1NihrZXkpO1xuICBsZXQgY2hlY2tzdW0gPSBrZXkudG9TdHJpbmcoKS5zdWJzdHJpbmcoMCwgOCk7XG4gIGFkZHJlc3MgPSBuZXcgQnVmZmVyKGFkZHJlc3MudG9TdHJpbmcoJ2hleCcpK2NoZWNrc3VtLCdoZXgnKTtcbiAgYWRkcmVzcyA9IEJhc2U1OC5lbmNvZGUoYWRkcmVzcyk7XG4gIHJldHVybiBhZGRyZXNzO1xufVxuXG5leHBvcnQgZGVmYXVsdCBnZXRBZGRyZXNzO1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgeyBnZXRCYWxhbmNlIH0gZnJvbSAnLi4vLi4vLi4vLi4vc2VydmVyL2FwaS9kb2ljaGFpbi5qcyc7XG5pbXBvcnQgeyBDT05GSVJNX0NMSUVOVH0gZnJvbSAnLi4vLi4vLi4vc3RhcnR1cC9zZXJ2ZXIvZG9pY2hhaW4tY29uZmlndXJhdGlvbi5qcyc7XG5cblxuY29uc3QgZ2V0X0JhbGFuY2UgPSAoKSA9PiB7XG4gICAgXG4gIHRyeSB7XG4gICAgY29uc3QgYmFsPWdldEJhbGFuY2UoQ09ORklSTV9DTElFTlQpO1xuICAgIHJldHVybiBiYWw7XG4gICAgXG4gIH0gY2F0Y2goZXhjZXB0aW9uKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZG9pY2hhaW4uZ2V0QmFsYW5jZS5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9XG4gIHJldHVybiB0cnVlO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgZ2V0X0JhbGFuY2U7XG5cbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IENyeXB0b0pTIGZyb20gJ2NyeXB0by1qcyc7XG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XG5cbmNvbnN0IEdldERhdGFIYXNoU2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIGRhdGE6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfVxufSk7XG5cbmNvbnN0IGdldERhdGFIYXNoID0gKGRhdGEpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBvdXJEYXRhID0gZGF0YTtcbiAgICAgIEdldERhdGFIYXNoU2NoZW1hLnZhbGlkYXRlKG91ckRhdGEpO1xuICAgIGNvbnN0IGhhc2ggPSBDcnlwdG9KUy5TSEEyNTYob3VyRGF0YSkudG9TdHJpbmcoKTtcbiAgICByZXR1cm4gaGFzaDtcbiAgfSBjYXRjaChleGNlcHRpb24pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdkb2ljaGFpbi5nZXREYXRhSGFzaC5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBnZXREYXRhSGFzaDtcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IHsgcmFuZG9tQnl0ZXMgfSBmcm9tICdjcnlwdG8nO1xuaW1wb3J0IHNlY3AyNTZrMSBmcm9tICdzZWNwMjU2azEnO1xuXG5jb25zdCBnZXRLZXlQYWlyID0gKCkgPT4ge1xuICB0cnkge1xuICAgIGxldCBwcml2S2V5XG4gICAgZG8ge3ByaXZLZXkgPSByYW5kb21CeXRlcygzMil9IHdoaWxlKCFzZWNwMjU2azEucHJpdmF0ZUtleVZlcmlmeShwcml2S2V5KSlcbiAgICBjb25zdCBwcml2YXRlS2V5ID0gcHJpdktleTtcbiAgICBjb25zdCBwdWJsaWNLZXkgPSBzZWNwMjU2azEucHVibGljS2V5Q3JlYXRlKHByaXZhdGVLZXkpO1xuICAgIHJldHVybiB7XG4gICAgICBwcml2YXRlS2V5OiBwcml2YXRlS2V5LnRvU3RyaW5nKCdoZXgnKS50b1VwcGVyQ2FzZSgpLFxuICAgICAgcHVibGljS2V5OiBwdWJsaWNLZXkudG9TdHJpbmcoJ2hleCcpLnRvVXBwZXJDYXNlKClcbiAgICB9XG4gIH0gY2F0Y2goZXhjZXB0aW9uKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZG9pY2hhaW4uZ2V0S2V5UGFpci5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBnZXRLZXlQYWlyO1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XG5pbXBvcnQgQmFzZTU4IGZyb20gJ2JzNTgnO1xuXG5jb25zdCBHZXRQcml2YXRlS2V5RnJvbVdpZlNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICB3aWY6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfVxufSk7XG5cbmNvbnN0IGdldFByaXZhdGVLZXlGcm9tV2lmID0gKGRhdGEpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBvdXJEYXRhID0gZGF0YTtcbiAgICBHZXRQcml2YXRlS2V5RnJvbVdpZlNjaGVtYS52YWxpZGF0ZShvdXJEYXRhKTtcbiAgICByZXR1cm4gX2dldFByaXZhdGVLZXlGcm9tV2lmKG91ckRhdGEud2lmKTtcbiAgfSBjYXRjaChleGNlcHRpb24pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdkb2ljaGFpbi5nZXRQcml2YXRlS2V5RnJvbVdpZi5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9XG59O1xuXG5mdW5jdGlvbiBfZ2V0UHJpdmF0ZUtleUZyb21XaWYod2lmKSB7XG4gIHZhciBwcml2YXRlS2V5ID0gQmFzZTU4LmRlY29kZSh3aWYpLnRvU3RyaW5nKCdoZXgnKTtcbiAgcHJpdmF0ZUtleSA9IHByaXZhdGVLZXkuc3Vic3RyaW5nKDIsIHByaXZhdGVLZXkubGVuZ3RoIC0gOCk7XG4gIGlmKHByaXZhdGVLZXkubGVuZ3RoID09PSA2NiAmJiBwcml2YXRlS2V5LmVuZHNXaXRoKFwiMDFcIikpIHtcbiAgICBwcml2YXRlS2V5ID0gcHJpdmF0ZUtleS5zdWJzdHJpbmcoMCwgcHJpdmF0ZUtleS5sZW5ndGggLSAyKTtcbiAgfVxuICByZXR1cm4gcHJpdmF0ZUtleTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZ2V0UHJpdmF0ZUtleUZyb21XaWY7XG4iLCJpbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XG5pbXBvcnQge2xvZ1NlbmR9IGZyb20gXCIuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9sb2ctY29uZmlndXJhdGlvblwiO1xuXG5pbXBvcnQgZ2V0T3B0SW5LZXkgZnJvbSBcIi4uL2Rucy9nZXRfb3B0LWluLWtleVwiO1xuaW1wb3J0IGdldE9wdEluUHJvdmlkZXIgZnJvbSBcIi4uL2Rucy9nZXRfb3B0LWluLXByb3ZpZGVyXCI7XG5pbXBvcnQgZ2V0QWRkcmVzcyBmcm9tIFwiLi9nZXRfYWRkcmVzc1wiO1xuXG5jb25zdCBHZXRQdWJsaWNLZXlTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgICBkb21haW46IHtcbiAgICAgICAgdHlwZTogU3RyaW5nXG4gICAgfVxufSk7XG5cbmNvbnN0IGdldFB1YmxpY0tleUFuZEFkZHJlc3MgPSAoZGF0YSkgPT4ge1xuXG4gICAgY29uc3Qgb3VyRGF0YSA9IGRhdGE7XG4gICAgR2V0UHVibGljS2V5U2NoZW1hLnZhbGlkYXRlKG91ckRhdGEpO1xuXG4gICAgbGV0IHB1YmxpY0tleSA9IGdldE9wdEluS2V5KHtkb21haW46IG91ckRhdGEuZG9tYWlufSk7XG4gICAgaWYoIXB1YmxpY0tleSl7XG4gICAgICAgIGNvbnN0IHByb3ZpZGVyID0gZ2V0T3B0SW5Qcm92aWRlcih7ZG9tYWluOiBvdXJEYXRhLmRvbWFpbn0pO1xuICAgICAgICBsb2dTZW5kKFwidXNpbmcgZG9pY2hhaW4gcHJvdmlkZXIgaW5zdGVhZCBvZiBkaXJlY3RseSBjb25maWd1cmVkIHB1YmxpY0tleTpcIix7cHJvdmlkZXI6cHJvdmlkZXJ9KTtcbiAgICAgICAgcHVibGljS2V5ID0gZ2V0T3B0SW5LZXkoe2RvbWFpbjogcHJvdmlkZXJ9KTsgLy9nZXQgcHVibGljIGtleSBmcm9tIHByb3ZpZGVyIG9yIGZhbGxiYWNrIGlmIHB1YmxpY2tleSB3YXMgbm90IHNldCBpbiBkbnNcbiAgICB9XG4gICAgY29uc3QgZGVzdEFkZHJlc3MgPSAgZ2V0QWRkcmVzcyh7cHVibGljS2V5OiBwdWJsaWNLZXl9KTtcbiAgICBsb2dTZW5kKCdwdWJsaWNLZXkgYW5kIGRlc3RBZGRyZXNzICcsIHtwdWJsaWNLZXk6cHVibGljS2V5LGRlc3RBZGRyZXNzOmRlc3RBZGRyZXNzfSk7XG4gICAgcmV0dXJuIHtwdWJsaWNLZXk6cHVibGljS2V5LGRlc3RBZGRyZXNzOmRlc3RBZGRyZXNzfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGdldFB1YmxpY0tleUFuZEFkZHJlc3M7IiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XG5pbXBvcnQgYml0Y29yZSBmcm9tICdiaXRjb3JlLWxpYic7XG5pbXBvcnQgTWVzc2FnZSBmcm9tICdiaXRjb3JlLW1lc3NhZ2UnO1xuXG5jb25zdCBHZXRTaWduYXR1cmVTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgbWVzc2FnZToge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9LFxuICBwcml2YXRlS2V5OiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH1cbn0pO1xuXG5jb25zdCBnZXRTaWduYXR1cmUgPSAoZGF0YSkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IG91ckRhdGEgPSBkYXRhO1xuICAgIEdldFNpZ25hdHVyZVNjaGVtYS52YWxpZGF0ZShvdXJEYXRhKTtcbiAgICBjb25zdCBzaWduYXR1cmUgPSBNZXNzYWdlKG91ckRhdGEubWVzc2FnZSkuc2lnbihuZXcgYml0Y29yZS5Qcml2YXRlS2V5KG91ckRhdGEucHJpdmF0ZUtleSkpO1xuICAgIHJldHVybiBzaWduYXR1cmU7XG4gIH0gY2F0Y2goZXhjZXB0aW9uKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZG9pY2hhaW4uZ2V0U2lnbmF0dXJlLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGdldFNpZ25hdHVyZTtcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tICdzaW1wbC1zY2hlbWEnO1xuaW1wb3J0IHsgU0VORF9DTElFTlQgfSBmcm9tICcuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9kb2ljaGFpbi1jb25maWd1cmF0aW9uLmpzJztcbmltcG9ydCBlbmNyeXB0TWVzc2FnZSBmcm9tIFwiLi9lbmNyeXB0X21lc3NhZ2VcIjtcbmltcG9ydCB7Z2V0VXJsfSBmcm9tIFwiLi4vLi4vLi4vc3RhcnR1cC9zZXJ2ZXIvZGFwcC1jb25maWd1cmF0aW9uXCI7XG5pbXBvcnQge2xvZ0Jsb2NrY2hhaW4sIGxvZ1NlbmR9IGZyb20gXCIuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9sb2ctY29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHtmZWVEb2ksbmFtZURvaX0gZnJvbSBcIi4uLy4uLy4uLy4uL3NlcnZlci9hcGkvZG9pY2hhaW5cIjtcbmltcG9ydCB7T3B0SW5zfSBmcm9tIFwiLi4vLi4vLi4vYXBpL29wdC1pbnMvb3B0LWluc1wiO1xuaW1wb3J0IGdldFB1YmxpY0tleUFuZEFkZHJlc3MgZnJvbSBcIi4vZ2V0X3B1YmxpY2tleV9hbmRfYWRkcmVzc19ieV9kb21haW5cIjtcblxuXG5jb25zdCBJbnNlcnRTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgbmFtZUlkOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH0sXG4gIHNpZ25hdHVyZToge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9LFxuICBkYXRhSGFzaDoge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9LFxuICBkb21haW46IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfSxcbiAgc29pRGF0ZToge1xuICAgIHR5cGU6IERhdGVcbiAgfVxufSk7XG5cbmNvbnN0IGluc2VydCA9IChkYXRhKSA9PiB7XG4gIGNvbnN0IG91ckRhdGEgPSBkYXRhO1xuICB0cnkge1xuICAgIEluc2VydFNjaGVtYS52YWxpZGF0ZShvdXJEYXRhKTtcbiAgICBsb2dTZW5kKFwiZG9tYWluOlwiLG91ckRhdGEuZG9tYWluKTtcblxuICAgIGNvbnN0IHB1YmxpY0tleUFuZEFkZHJlc3MgPSBnZXRQdWJsaWNLZXlBbmRBZGRyZXNzKHtkb21haW46b3VyRGF0YS5kb21haW59KTtcbiAgICBjb25zdCBmcm9tID0gZW5jcnlwdE1lc3NhZ2Uoe3B1YmxpY0tleTogcHVibGljS2V5QW5kQWRkcmVzcy5wdWJsaWNLZXksIG1lc3NhZ2U6IGdldFVybCgpfSk7XG4gICAgbG9nU2VuZCgnZW5jcnlwdGVkIHVybCBmb3IgdXNlIGFkIGZyb20gaW4gZG9pY2hhaW4gdmFsdWU6JyxnZXRVcmwoKSxmcm9tKTtcblxuICAgIGNvbnN0IG5hbWVWYWx1ZSA9IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgc2lnbmF0dXJlOiBvdXJEYXRhLnNpZ25hdHVyZSxcbiAgICAgICAgZGF0YUhhc2g6IG91ckRhdGEuZGF0YUhhc2gsXG4gICAgICAgIGZyb206IGZyb21cbiAgICB9KTtcblxuICAgIC8vVE9ETyAoISkgdGhpcyBtdXN0IGJlIHJlcGxhY2VkIGluIGZ1dHVyZSBieSBcImF0b21pYyBuYW1lIHRyYWRpbmcgZXhhbXBsZVwiIGh0dHBzOi8vd2lraS5uYW1lY29pbi5pbmZvLz90aXRsZT1BdG9taWNfTmFtZS1UcmFkaW5nXG4gICAgbG9nQmxvY2tjaGFpbignc2VuZGluZyBhIGZlZSB0byBib2Igc28gaGUgY2FuIHBheSB0aGUgZG9pIHN0b3JhZ2UgKGRlc3RBZGRyZXNzKTonLCBwdWJsaWNLZXlBbmRBZGRyZXNzLmRlc3RBZGRyZXNzKTtcbiAgICBjb25zdCBmZWVEb2lUeCA9IGZlZURvaShTRU5EX0NMSUVOVCwgcHVibGljS2V5QW5kQWRkcmVzcy5kZXN0QWRkcmVzcyk7XG4gICAgbG9nQmxvY2tjaGFpbignZmVlIHNlbmQgdHhpZCB0byBkZXN0YWRkcmVzcycsIGZlZURvaVR4LCBwdWJsaWNLZXlBbmRBZGRyZXNzLmRlc3RBZGRyZXNzKTtcblxuICAgIGxvZ0Jsb2NrY2hhaW4oJ2FkZGluZyBkYXRhIHRvIGJsb2NrY2hhaW4gdmlhIG5hbWVfZG9pIChuYW1lSWQsdmFsdWUsZGVzdEFkZHJlc3MpOicsIG91ckRhdGEubmFtZUlkLG5hbWVWYWx1ZSxwdWJsaWNLZXlBbmRBZGRyZXNzLmRlc3RBZGRyZXNzKTtcbiAgICBjb25zdCBuYW1lRG9pVHggPSBuYW1lRG9pKFNFTkRfQ0xJRU5ULCBvdXJEYXRhLm5hbWVJZCwgbmFtZVZhbHVlLCBwdWJsaWNLZXlBbmRBZGRyZXNzLmRlc3RBZGRyZXNzKTtcbiAgICBsb2dCbG9ja2NoYWluKCduYW1lX2RvaSBhZGRlZCBibG9ja2NoYWluLiB0eGlkOicsIG5hbWVEb2lUeCk7XG5cbiAgICBPcHRJbnMudXBkYXRlKHtuYW1lSWQ6IG91ckRhdGEubmFtZUlkfSwgeyRzZXQ6IHt0eElkOm5hbWVEb2lUeH19KTtcbiAgICBsb2dCbG9ja2NoYWluKCd1cGRhdGluZyBPcHRJbiBsb2NhbGx5IHdpdGg6Jywge25hbWVJZDogb3VyRGF0YS5uYW1lSWQsIHR4SWQ6IG5hbWVEb2lUeH0pO1xuXG4gIH0gY2F0Y2goZXhjZXB0aW9uKSB7XG4gICAgICBPcHRJbnMudXBkYXRlKHtuYW1lSWQ6IG91ckRhdGEubmFtZUlkfSwgeyRzZXQ6IHtlcnJvcjpKU09OLnN0cmluZ2lmeShleGNlcHRpb24ubWVzc2FnZSl9fSk7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZG9pY2hhaW4uaW5zZXJ0LmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7IC8vVE9ETyB1cGRhdGUgb3B0LWluIGluIGxvY2FsIGRiIHRvIGluZm9ybSB1c2VyIGFib3V0IHRoZSBlcnJvciEgZS5nLiBJbnN1ZmZpY2llbnQgZnVuZHMgZXRjLlxuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBpbnNlcnQ7XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcbmltcG9ydCB7IENPTkZJUk1fQ0xJRU5UIH0gZnJvbSAnLi4vLi4vLi4vc3RhcnR1cC9zZXJ2ZXIvZG9pY2hhaW4tY29uZmlndXJhdGlvbi5qcyc7XG5pbXBvcnQge2dldFdpZiwgc2lnbk1lc3NhZ2UsIGdldFRyYW5zYWN0aW9uLCBuYW1lRG9pLCBuYW1lU2hvd30gZnJvbSBcIi4uLy4uLy4uLy4uL3NlcnZlci9hcGkvZG9pY2hhaW5cIjtcbmltcG9ydCB7QVBJX1BBVEgsIERPSV9DT05GSVJNQVRJT05fTk9USUZZX1JPVVRFLCBWRVJTSU9OfSBmcm9tIFwiLi4vLi4vLi4vLi4vc2VydmVyL2FwaS9yZXN0L3Jlc3RcIjtcbmltcG9ydCB7Q09ORklSTV9BRERSRVNTfSBmcm9tIFwiLi4vLi4vLi4vc3RhcnR1cC9zZXJ2ZXIvZG9pY2hhaW4tY29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHtnZXRIdHRwUFVUfSBmcm9tIFwiLi4vLi4vLi4vLi4vc2VydmVyL2FwaS9odHRwXCI7XG5pbXBvcnQge2xvZ0NvbmZpcm19IGZyb20gXCIuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9sb2ctY29uZmlndXJhdGlvblwiO1xuaW1wb3J0IGdldFByaXZhdGVLZXlGcm9tV2lmIGZyb20gXCIuL2dldF9wcml2YXRlLWtleV9mcm9tX3dpZlwiO1xuaW1wb3J0IGRlY3J5cHRNZXNzYWdlIGZyb20gXCIuL2RlY3J5cHRfbWVzc2FnZVwiO1xuaW1wb3J0IHtPcHRJbnN9IGZyb20gXCIuLi8uLi8uLi9hcGkvb3B0LWlucy9vcHQtaW5zXCI7XG5cbmNvbnN0IFVwZGF0ZVNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICBuYW1lSWQ6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfSxcbiAgdmFsdWU6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfSxcbiAgaG9zdCA6IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIG9wdGlvbmFsOiB0cnVlLFxuICB9LFxuICBmcm9tSG9zdFVybCA6IHtcbiAgICAgIHR5cGU6IFN0cmluZ1xuICB9XG59KTtcblxuY29uc3QgdXBkYXRlID0gKGRhdGEsIGpvYikgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IG91ckRhdGEgPSBkYXRhO1xuXG4gICAgVXBkYXRlU2NoZW1hLnZhbGlkYXRlKG91ckRhdGEpO1xuXG4gICAgLy9zdG9wIHRoaXMgdXBkYXRlIHVudGlsIHRoaXMgbmFtZSBhcyBhdCBsZWFzdCAxIGNvbmZpcm1hdGlvblxuICAgIGNvbnN0IG5hbWVfZGF0YSA9IG5hbWVTaG93KENPTkZJUk1fQ0xJRU5ULG91ckRhdGEubmFtZUlkKTtcbiAgICBpZihuYW1lX2RhdGEgPT09IHVuZGVmaW5lZCl7XG4gICAgICAgIHJlcnVuKGpvYik7XG4gICAgICAgIGxvZ0NvbmZpcm0oJ25hbWUgbm90IHZpc2libGUgLSBkZWxheWluZyBuYW1lIHVwZGF0ZScsb3VyRGF0YS5uYW1lSWQpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IG91cl90cmFuc2FjdGlvbiA9IGdldFRyYW5zYWN0aW9uKENPTkZJUk1fQ0xJRU5ULG5hbWVfZGF0YS50eGlkKTtcbiAgICBpZihvdXJfdHJhbnNhY3Rpb24uY29uZmlybWF0aW9ucz09PTApe1xuICAgICAgICByZXJ1bihqb2IpO1xuICAgICAgICBsb2dDb25maXJtKCd0cmFuc2FjdGlvbiBoYXMgMCBjb25maXJtYXRpb25zIC0gZGVsYXlpbmcgbmFtZSB1cGRhdGUnLEpTT04ucGFyc2Uob3VyRGF0YS52YWx1ZSkpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGxvZ0NvbmZpcm0oJ3VwZGF0aW5nIGJsb2NrY2hhaW4gd2l0aCBkb2lTaWduYXR1cmU6JyxKU09OLnBhcnNlKG91ckRhdGEudmFsdWUpKTtcbiAgICBjb25zdCB3aWYgPSBnZXRXaWYoQ09ORklSTV9DTElFTlQsIENPTkZJUk1fQUREUkVTUyk7XG4gICAgY29uc3QgcHJpdmF0ZUtleSA9IGdldFByaXZhdGVLZXlGcm9tV2lmKHt3aWY6IHdpZn0pO1xuICAgIGxvZ0NvbmZpcm0oJ2dvdCBwcml2YXRlIGtleSAod2lsbCBub3Qgc2hvdyBpdCBoZXJlKSBpbiBvcmRlciB0byBkZWNyeXB0IFNlbmQtZEFwcCBob3N0IHVybCBmcm9tIHZhbHVlOicsb3VyRGF0YS5mcm9tSG9zdFVybCk7XG4gICAgY29uc3Qgb3VyZnJvbUhvc3RVcmwgPSBkZWNyeXB0TWVzc2FnZSh7cHJpdmF0ZUtleTogcHJpdmF0ZUtleSwgbWVzc2FnZTogb3VyRGF0YS5mcm9tSG9zdFVybH0pO1xuICAgIGxvZ0NvbmZpcm0oJ2RlY3J5cHRlZCBmcm9tSG9zdFVybCcsb3VyZnJvbUhvc3RVcmwpO1xuICAgIGNvbnN0IHVybCA9IG91cmZyb21Ib3N0VXJsK0FQSV9QQVRIK1ZFUlNJT04rXCIvXCIrRE9JX0NPTkZJUk1BVElPTl9OT1RJRllfUk9VVEU7XG5cbiAgICBsb2dDb25maXJtKCdjcmVhdGluZyBzaWduYXR1cmUgd2l0aCBBRERSRVNTJytDT05GSVJNX0FERFJFU1MrXCIgbmFtZUlkOlwiLG91ckRhdGEudmFsdWUpO1xuICAgIGNvbnN0IHNpZ25hdHVyZSA9IHNpZ25NZXNzYWdlKENPTkZJUk1fQ0xJRU5ULCBDT05GSVJNX0FERFJFU1MsIG91ckRhdGEubmFtZUlkKTsgLy9UT0RPIHdoeSBoZXJlIG92ZXIgbmFtZUlEP1xuICAgIGxvZ0NvbmZpcm0oJ3NpZ25hdHVyZSBjcmVhdGVkOicsc2lnbmF0dXJlKTtcblxuICAgIGNvbnN0IHVwZGF0ZURhdGEgPSB7XG4gICAgICAgIG5hbWVJZDogb3VyRGF0YS5uYW1lSWQsXG4gICAgICAgIHNpZ25hdHVyZTogc2lnbmF0dXJlLFxuICAgICAgICBob3N0OiBvdXJEYXRhLmhvc3RcbiAgICB9O1xuXG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgdHhpZCA9IG5hbWVEb2koQ09ORklSTV9DTElFTlQsIG91ckRhdGEubmFtZUlkLCBvdXJEYXRhLnZhbHVlLCBudWxsKTtcbiAgICAgICAgbG9nQ29uZmlybSgndXBkYXRlIHRyYW5zYWN0aW9uIHR4aWQ6Jyx0eGlkKTtcbiAgICB9Y2F0Y2goZXhjZXB0aW9uKXtcbiAgICAgICAgLy9cbiAgICAgICAgbG9nQ29uZmlybSgndGhpcyBuYW1lRE9JIGRvZXNuwrR0IGhhdmUgYSBibG9jayB5ZXQgYW5kIHdpbGwgYmUgdXBkYXRlZCB3aXRoIHRoZSBuZXh0IGJsb2NrIGFuZCB3aXRoIHRoZSBuZXh0IHF1ZXVlIHN0YXJ0Oicsb3VyRGF0YS5uYW1lSWQpO1xuICAgICAgICBpZihleGNlcHRpb24udG9TdHJpbmcoKS5pbmRleE9mKFwidGhlcmUgaXMgYWxyZWFkeSBhIHJlZ2lzdHJhdGlvbiBmb3IgdGhpcyBkb2kgbmFtZVwiKT09LTEpIHtcbiAgICAgICAgICAgIE9wdElucy51cGRhdGUoe25hbWVJZDogb3VyRGF0YS5uYW1lSWR9LCB7JHNldDoge2Vycm9yOiBKU09OLnN0cmluZ2lmeShleGNlcHRpb24ubWVzc2FnZSl9fSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZG9pY2hhaW4udXBkYXRlLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gICAgICAgIC8vfWVsc2V7XG4gICAgICAgIC8vICAgIGxvZ0NvbmZpcm0oJ3RoaXMgbmFtZURPSSBkb2VzbsK0dCBoYXZlIGEgYmxvY2sgeWV0IGFuZCB3aWxsIGJlIHVwZGF0ZWQgd2l0aCB0aGUgbmV4dCBibG9jayBhbmQgd2l0aCB0aGUgbmV4dCBxdWV1ZSBzdGFydDonLG91ckRhdGEubmFtZUlkKTtcbiAgICAgICAgLy99XG4gICAgfVxuXG4gICAgY29uc3QgcmVzcG9uc2UgPSBnZXRIdHRwUFVUKHVybCwgdXBkYXRlRGF0YSk7XG4gICAgbG9nQ29uZmlybSgnaW5mb3JtZWQgc2VuZCBkQXBwIGFib3V0IGNvbmZpcm1lZCBkb2kgb24gdXJsOicrdXJsKycgd2l0aCB1cGRhdGVEYXRhJytKU09OLnN0cmluZ2lmeSh1cGRhdGVEYXRhKStcIiByZXNwb25zZTpcIixyZXNwb25zZS5kYXRhKTtcbiAgICBqb2IuZG9uZSgpO1xuICB9IGNhdGNoKGV4Y2VwdGlvbikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2RvaWNoYWluLnVwZGF0ZS5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9XG59O1xuXG5mdW5jdGlvbiByZXJ1bihqb2Ipe1xuICAgIGxvZ0NvbmZpcm0oJ3JlcnVubmluZyB0eGlkIGluIDEwc2VjIC0gY2FuY2VsaW5nIG9sZCBqb2InLCcnKTtcbiAgICBqb2IuY2FuY2VsKCk7XG4gICAgbG9nQ29uZmlybSgncmVzdGFydCBibG9ja2NoYWluIGRvaSB1cGRhdGUnLCcnKTtcbiAgICBqb2IucmVzdGFydChcbiAgICAgICAge1xuICAgICAgICAgICAgLy9yZXBlYXRzOiA2MDAsICAgLy8gT25seSByZXBlYXQgdGhpcyBvbmNlXG4gICAgICAgICAgICAvLyBUaGlzIGlzIHRoZSBkZWZhdWx0XG4gICAgICAgICAgIC8vIHdhaXQ6IDEwMDAwICAgLy8gV2FpdCAxMCBzZWMgYmV0d2VlbiByZXBlYXRzXG4gICAgICAgICAgICAgICAgICAgICAgICAgIC8vIERlZmF1bHQgaXMgcHJldmlvdXMgc2V0dGluZ1xuICAgICAgICB9LFxuICAgICAgICBmdW5jdGlvbiAoZXJyLCByZXN1bHQpIHtcbiAgICAgICAgICAgIGlmIChyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICBsb2dDb25maXJtKCdyZXJ1bm5pbmcgdHhpZCBpbiAxMHNlYzonLHJlc3VsdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICApO1xufVxuXG5leHBvcnQgZGVmYXVsdCB1cGRhdGU7XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcbmltcG9ydCBiaXRjb3JlIGZyb20gJ2JpdGNvcmUtbGliJztcbmltcG9ydCBNZXNzYWdlIGZyb20gJ2JpdGNvcmUtbWVzc2FnZSc7XG5pbXBvcnQge2xvZ0Vycm9yLCBsb2dWZXJpZnl9IGZyb20gXCIuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9sb2ctY29uZmlndXJhdGlvblwiO1xuY29uc3QgTkVUV09SSyA9IGJpdGNvcmUuTmV0d29ya3MuYWRkKHtcbiAgbmFtZTogJ2RvaWNoYWluJyxcbiAgYWxpYXM6ICdkb2ljaGFpbicsXG4gIHB1YmtleWhhc2g6IDB4MzQsXG4gIHByaXZhdGVrZXk6IDB4QjQsXG4gIHNjcmlwdGhhc2g6IDEzLFxuICBuZXR3b3JrTWFnaWM6IDB4ZjliZWI0ZmUsXG59KTtcblxuY29uc3QgVmVyaWZ5U2lnbmF0dXJlU2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIGRhdGE6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfSxcbiAgcHVibGljS2V5OiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH0sXG4gIHNpZ25hdHVyZToge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9XG59KTtcblxuY29uc3QgdmVyaWZ5U2lnbmF0dXJlID0gKGRhdGEpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBvdXJEYXRhID0gZGF0YTtcbiAgICBsb2dWZXJpZnkoJ3ZlcmlmeVNpZ25hdHVyZTonLG91ckRhdGEpO1xuICAgIFZlcmlmeVNpZ25hdHVyZVNjaGVtYS52YWxpZGF0ZShvdXJEYXRhKTtcbiAgICBjb25zdCBhZGRyZXNzID0gYml0Y29yZS5BZGRyZXNzLmZyb21QdWJsaWNLZXkobmV3IGJpdGNvcmUuUHVibGljS2V5KG91ckRhdGEucHVibGljS2V5KSwgTkVUV09SSyk7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBNZXNzYWdlKG91ckRhdGEuZGF0YSkudmVyaWZ5KGFkZHJlc3MsIG91ckRhdGEuc2lnbmF0dXJlKTtcbiAgICB9IGNhdGNoKGVycm9yKSB7IGxvZ0Vycm9yKGVycm9yKX1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH0gY2F0Y2goZXhjZXB0aW9uKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZG9pY2hhaW4udmVyaWZ5U2lnbmF0dXJlLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IHZlcmlmeVNpZ25hdHVyZTtcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tICdzaW1wbC1zY2hlbWEnO1xuaW1wb3J0IHsgT3B0SW5zIH0gZnJvbSAnLi4vLi4vLi4vYXBpL29wdC1pbnMvb3B0LWlucy5qcyc7XG5pbXBvcnQgeyBTZW5kZXJzIH0gZnJvbSAnLi4vLi4vLi4vYXBpL3NlbmRlcnMvc2VuZGVycy5qcyc7XG5pbXBvcnQgeyBSZWNpcGllbnRzIH0gZnJvbSAnLi4vLi4vLi4vYXBpL3JlY2lwaWVudHMvcmVjaXBpZW50cy5qcyc7XG5pbXBvcnQgZ2VuZXJhdGVOYW1lSWQgZnJvbSAnLi9nZW5lcmF0ZV9uYW1lLWlkLmpzJztcbmltcG9ydCBnZXRTaWduYXR1cmUgZnJvbSAnLi9nZXRfc2lnbmF0dXJlLmpzJztcbmltcG9ydCBnZXREYXRhSGFzaCBmcm9tICcuL2dldF9kYXRhLWhhc2guanMnO1xuaW1wb3J0IGFkZEluc2VydEJsb2NrY2hhaW5Kb2IgZnJvbSAnLi4vam9icy9hZGRfaW5zZXJ0X2Jsb2NrY2hhaW4uanMnO1xuaW1wb3J0IHtsb2dTZW5kfSBmcm9tIFwiLi4vLi4vLi4vc3RhcnR1cC9zZXJ2ZXIvbG9nLWNvbmZpZ3VyYXRpb25cIjtcblxuY29uc3QgV3JpdGVUb0Jsb2NrY2hhaW5TY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgaWQ6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfVxufSk7XG5cbmNvbnN0IHdyaXRlVG9CbG9ja2NoYWluID0gKGRhdGEpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBvdXJEYXRhID0gZGF0YTtcbiAgICBXcml0ZVRvQmxvY2tjaGFpblNjaGVtYS52YWxpZGF0ZShvdXJEYXRhKTtcblxuICAgIGNvbnN0IG9wdEluID0gT3B0SW5zLmZpbmRPbmUoe19pZDogZGF0YS5pZH0pO1xuICAgIGNvbnN0IHJlY2lwaWVudCA9IFJlY2lwaWVudHMuZmluZE9uZSh7X2lkOiBvcHRJbi5yZWNpcGllbnR9KTtcbiAgICBjb25zdCBzZW5kZXIgPSBTZW5kZXJzLmZpbmRPbmUoe19pZDogb3B0SW4uc2VuZGVyfSk7XG4gICAgbG9nU2VuZChcIm9wdEluIGRhdGE6XCIse2luZGV4Om91ckRhdGEuaW5kZXgsIG9wdEluOm9wdEluLHJlY2lwaWVudDpyZWNpcGllbnQsc2VuZGVyOiBzZW5kZXJ9KTtcblxuXG4gICAgY29uc3QgbmFtZUlkID0gZ2VuZXJhdGVOYW1lSWQoe2lkOiBkYXRhLmlkLGluZGV4Om9wdEluLmluZGV4LG1hc3RlckRvaTpvcHRJbi5tYXN0ZXJEb2kgfSk7XG4gICAgY29uc3Qgc2lnbmF0dXJlID0gZ2V0U2lnbmF0dXJlKHttZXNzYWdlOiByZWNpcGllbnQuZW1haWwrc2VuZGVyLmVtYWlsLCBwcml2YXRlS2V5OiByZWNpcGllbnQucHJpdmF0ZUtleX0pO1xuICAgIGxvZ1NlbmQoXCJnZW5lcmF0ZWQgc2lnbmF0dXJlIGZyb20gZW1haWwgcmVjaXBpZW50IGFuZCBzZW5kZXI6XCIsc2lnbmF0dXJlKTtcblxuICAgIGxldCBkYXRhSGFzaCA9IFwiXCI7XG5cbiAgICBpZihvcHRJbi5kYXRhKSB7XG4gICAgICBkYXRhSGFzaCA9IGdldERhdGFIYXNoKHtkYXRhOiBvcHRJbi5kYXRhfSk7XG4gICAgICBsb2dTZW5kKFwiZ2VuZXJhdGVkIGRhdGFoYXNoIGZyb20gZ2l2ZW4gZGF0YTpcIixkYXRhSGFzaCk7XG4gICAgfVxuXG4gICAgY29uc3QgcGFydHMgPSByZWNpcGllbnQuZW1haWwuc3BsaXQoXCJAXCIpO1xuICAgIGNvbnN0IGRvbWFpbiA9IHBhcnRzW3BhcnRzLmxlbmd0aC0xXTtcbiAgICBsb2dTZW5kKFwiZW1haWwgZG9tYWluIGZvciBwdWJsaWNLZXkgcmVxdWVzdCBpczpcIixkb21haW4pO1xuICAgIGFkZEluc2VydEJsb2NrY2hhaW5Kb2Ioe1xuICAgICAgbmFtZUlkOiBuYW1lSWQsXG4gICAgICBzaWduYXR1cmU6IHNpZ25hdHVyZSxcbiAgICAgIGRhdGFIYXNoOiBkYXRhSGFzaCxcbiAgICAgIGRvbWFpbjogZG9tYWluLFxuICAgICAgc29pRGF0ZTogb3B0SW4uY3JlYXRlZEF0XG4gICAgfSlcbiAgfSBjYXRjaCAoZXhjZXB0aW9uKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZG9pY2hhaW4ud3JpdGVUb0Jsb2NrY2hhaW4uZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgd3JpdGVUb0Jsb2NrY2hhaW5cbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tICdzaW1wbC1zY2hlbWEnO1xuaW1wb3J0IHsgSGFzaElkcyB9IGZyb20gJy4uLy4uLy4uL3N0YXJ0dXAvc2VydmVyL2VtYWlsLWNvbmZpZ3VyYXRpb24uanMnO1xuXG5jb25zdCBEZWNvZGVEb2lIYXNoU2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIGhhc2g6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfVxufSk7XG5cbmNvbnN0IGRlY29kZURvaUhhc2ggPSAoaGFzaCkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IG91ckhhc2ggPSBoYXNoO1xuICAgIERlY29kZURvaUhhc2hTY2hlbWEudmFsaWRhdGUob3VySGFzaCk7XG4gICAgY29uc3QgaGV4ID0gSGFzaElkcy5kZWNvZGVIZXgob3VySGFzaC5oYXNoKTtcbiAgICBpZighaGV4IHx8IGhleCA9PT0gJycpIHRocm93IFwiV3JvbmcgaGFzaFwiO1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBvYmogPSBKU09OLnBhcnNlKEJ1ZmZlcihoZXgsICdoZXgnKS50b1N0cmluZygnYXNjaWknKSk7XG4gICAgICByZXR1cm4gb2JqO1xuICAgIH0gY2F0Y2goZXhjZXB0aW9uKSB7dGhyb3cgXCJXcm9uZyBoYXNoXCI7fVxuICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlbWFpbHMuZGVjb2RlX2RvaS1oYXNoLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGRlY29kZURvaUhhc2g7XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcbmltcG9ydCB7IEhhc2hJZHMgfSBmcm9tICcuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9lbWFpbC1jb25maWd1cmF0aW9uLmpzJztcblxuY29uc3QgR2VuZXJhdGVEb2lIYXNoU2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIGlkOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH0sXG4gIHRva2VuOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH0sXG4gIHJlZGlyZWN0OiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH1cbn0pO1xuXG5jb25zdCBnZW5lcmF0ZURvaUhhc2ggPSAob3B0SW4pID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBvdXJPcHRJbiA9IG9wdEluO1xuICAgIEdlbmVyYXRlRG9pSGFzaFNjaGVtYS52YWxpZGF0ZShvdXJPcHRJbik7XG5cbiAgICBjb25zdCBqc29uID0gSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgaWQ6IG91ck9wdEluLmlkLFxuICAgICAgdG9rZW46IG91ck9wdEluLnRva2VuLFxuICAgICAgcmVkaXJlY3Q6IG91ck9wdEluLnJlZGlyZWN0XG4gICAgfSk7XG5cbiAgICBjb25zdCBoZXggPSBCdWZmZXIoanNvbikudG9TdHJpbmcoJ2hleCcpO1xuICAgIGNvbnN0IGhhc2ggPSBIYXNoSWRzLmVuY29kZUhleChoZXgpO1xuICAgIHJldHVybiBoYXNoO1xuICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlbWFpbHMuZ2VuZXJhdGVfZG9pLWhhc2guZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgZ2VuZXJhdGVEb2lIYXNoO1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XG5pbXBvcnQge2xvZ0NvbmZpcm19IGZyb20gXCIuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9sb2ctY29uZmlndXJhdGlvblwiO1xuXG5jb25zdCBQTEFDRUhPTERFUl9SRUdFWCA9IC9cXCR7KFtcXHddKil9L2c7XG5jb25zdCBQYXJzZVRlbXBsYXRlU2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIHRlbXBsYXRlOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICB9LFxuICBkYXRhOiB7XG4gICAgdHlwZTogT2JqZWN0LFxuICAgIGJsYWNrYm94OiB0cnVlXG4gIH1cbn0pO1xuXG5jb25zdCBwYXJzZVRlbXBsYXRlID0gKGRhdGEpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBvdXJEYXRhID0gZGF0YTtcbiAgICAvL2xvZ0NvbmZpcm0oJ3BhcnNlVGVtcGxhdGU6JyxvdXJEYXRhKTtcblxuICAgIFBhcnNlVGVtcGxhdGVTY2hlbWEudmFsaWRhdGUob3VyRGF0YSk7XG4gICAgbG9nQ29uZmlybSgnUGFyc2VUZW1wbGF0ZVNjaGVtYSB2YWxpZGF0ZWQnKTtcblxuICAgIHZhciBfbWF0Y2g7XG4gICAgdmFyIHRlbXBsYXRlID0gb3VyRGF0YS50ZW1wbGF0ZTtcbiAgIC8vbG9nQ29uZmlybSgnZG9pbmcgc29tZSByZWdleCB3aXRoIHRlbXBsYXRlOicsdGVtcGxhdGUpO1xuXG4gICAgZG8ge1xuICAgICAgX21hdGNoID0gUExBQ0VIT0xERVJfUkVHRVguZXhlYyh0ZW1wbGF0ZSk7XG4gICAgICBpZihfbWF0Y2gpIHRlbXBsYXRlID0gX3JlcGxhY2VQbGFjZWhvbGRlcih0ZW1wbGF0ZSwgX21hdGNoLCBvdXJEYXRhLmRhdGFbX21hdGNoWzFdXSk7XG4gICAgfSB3aGlsZSAoX21hdGNoKTtcbiAgICByZXR1cm4gdGVtcGxhdGU7XG4gIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2VtYWlscy5wYXJzZVRlbXBsYXRlLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIF9yZXBsYWNlUGxhY2Vob2xkZXIodGVtcGxhdGUsIF9tYXRjaCwgcmVwbGFjZSkge1xuICB2YXIgcmVwID0gcmVwbGFjZTtcbiAgaWYocmVwbGFjZSA9PT0gdW5kZWZpbmVkKSByZXAgPSBcIlwiO1xuICByZXR1cm4gdGVtcGxhdGUuc3Vic3RyaW5nKDAsIF9tYXRjaC5pbmRleCkrcmVwK3RlbXBsYXRlLnN1YnN0cmluZyhfbWF0Y2guaW5kZXgrX21hdGNoWzBdLmxlbmd0aCk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHBhcnNlVGVtcGxhdGU7XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcbmltcG9ydCB7bG9nQ29uZmlybX0gZnJvbSBcIi4uLy4uLy4uL3N0YXJ0dXAvc2VydmVyL2xvZy1jb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBET0lfTUFJTF9ERUZBVUxUX0VNQUlMX0ZST00gfSBmcm9tICcuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9lbWFpbC1jb25maWd1cmF0aW9uLmpzJztcblxuY29uc3QgU2VuZE1haWxTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgZnJvbToge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICByZWdFeDogU2ltcGxlU2NoZW1hLlJlZ0V4LkVtYWlsXG4gIH0sXG4gIHRvOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIHJlZ0V4OiBTaW1wbGVTY2hlbWEuUmVnRXguRW1haWxcbiAgfSxcbiAgc3ViamVjdDoge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgfSxcbiAgbWVzc2FnZToge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgfSxcbiAgcmV0dXJuUGF0aDoge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICByZWdFeDogU2ltcGxlU2NoZW1hLlJlZ0V4LkVtYWlsXG4gIH1cbn0pO1xuXG5jb25zdCBzZW5kTWFpbCA9IChtYWlsKSA9PiB7XG4gIHRyeSB7XG5cbiAgICBtYWlsLmZyb20gPSBET0lfTUFJTF9ERUZBVUxUX0VNQUlMX0ZST007XG5cbiAgICBjb25zdCBvdXJNYWlsID0gbWFpbDtcbiAgICBsb2dDb25maXJtKCdzZW5kaW5nIGVtYWlsIHdpdGggZGF0YTonLHt0bzptYWlsLnRvLCBzdWJqZWN0Om1haWwuc3ViamVjdH0pO1xuICAgIFNlbmRNYWlsU2NoZW1hLnZhbGlkYXRlKG91ck1haWwpO1xuICAgIC8vVE9ETzogVGV4dCBmYWxsYmFja1xuICAgIEVtYWlsLnNlbmQoe1xuICAgICAgZnJvbTogbWFpbC5mcm9tLFxuICAgICAgdG86IG1haWwudG8sXG4gICAgICBzdWJqZWN0OiBtYWlsLnN1YmplY3QsXG4gICAgICBodG1sOiBtYWlsLm1lc3NhZ2UsXG4gICAgICBoZWFkZXJzOiB7XG4gICAgICAgICdSZXR1cm4tUGF0aCc6IG1haWwucmV0dXJuUGF0aCxcbiAgICAgIH1cbiAgICB9KTtcblxuICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlbWFpbHMuc2VuZC5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBzZW5kTWFpbDtcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IHsgSm9iIH0gZnJvbSAnbWV0ZW9yL3ZzaXZzaTpqb2ItY29sbGVjdGlvbic7XG5pbXBvcnQgeyBCbG9ja2NoYWluSm9icyB9IGZyb20gJy4uLy4uLy4uLy4uL3NlcnZlci9hcGkvYmxvY2tjaGFpbl9qb2JzLmpzJztcblxuY29uc3QgYWRkQ2hlY2tOZXdUcmFuc2FjdGlvbnNCbG9ja2NoYWluSm9iID0gKCkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IGpvYiA9IG5ldyBKb2IoQmxvY2tjaGFpbkpvYnMsICdjaGVja05ld1RyYW5zYWN0aW9uJywge30pO1xuICAgIGpvYi5yZXRyeSh7cmV0cmllczogNjAsIHdhaXQ6IDE1KjEwMDAgfSkuc2F2ZSh7Y2FuY2VsUmVwZWF0czogdHJ1ZX0pO1xuICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdqb2JzLmFkZENoZWNrTmV3VHJhbnNhY3Rpb25zQmxvY2tjaGFpbi5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBhZGRDaGVja05ld1RyYW5zYWN0aW9uc0Jsb2NrY2hhaW5Kb2I7XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcbmltcG9ydCB7IEpvYiB9IGZyb20gJ21ldGVvci92c2l2c2k6am9iLWNvbGxlY3Rpb24nO1xuaW1wb3J0IHsgREFwcEpvYnMgfSBmcm9tICcuLi8uLi8uLi8uLi9zZXJ2ZXIvYXBpL2RhcHBfam9icy5qcyc7XG5cbmNvbnN0IEFkZEZldGNoRG9pTWFpbERhdGFKb2JTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgbmFtZToge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9LFxuICBkb21haW46IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfVxufSk7XG5cbmNvbnN0IGFkZEZldGNoRG9pTWFpbERhdGFKb2IgPSAoZGF0YSkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IG91ckRhdGEgPSBkYXRhO1xuICAgIEFkZEZldGNoRG9pTWFpbERhdGFKb2JTY2hlbWEudmFsaWRhdGUob3VyRGF0YSk7XG4gICAgY29uc3Qgam9iID0gbmV3IEpvYihEQXBwSm9icywgJ2ZldGNoRG9pTWFpbERhdGEnLCBvdXJEYXRhKTtcbiAgICBqb2IucmV0cnkoe3JldHJpZXM6IDUsIHdhaXQ6IDEqMTAqMTAwMCB9KS5zYXZlKCk7IC8vY2hlY2sgZXZlcnkgMTAgc2VjcyA1IHRpbWVzXG4gIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2pvYnMuYWRkRmV0Y2hEb2lNYWlsRGF0YS5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBhZGRGZXRjaERvaU1haWxEYXRhSm9iO1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgeyBKb2IgfSBmcm9tICdtZXRlb3IvdnNpdnNpOmpvYi1jb2xsZWN0aW9uJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcbmltcG9ydCB7IEJsb2NrY2hhaW5Kb2JzIH0gZnJvbSAnLi4vLi4vLi4vLi4vc2VydmVyL2FwaS9ibG9ja2NoYWluX2pvYnMuanMnO1xuXG5jb25zdCBBZGRJbnNlcnRCbG9ja2NoYWluSm9iU2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIG5hbWVJZDoge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9LFxuICBzaWduYXR1cmU6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfSxcbiAgZGF0YUhhc2g6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgb3B0aW9uYWw6dHJ1ZVxuICB9LFxuICBkb21haW46IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfSxcbiAgc29pRGF0ZToge1xuICAgIHR5cGU6IERhdGVcbiAgfVxufSk7XG5cbmNvbnN0IGFkZEluc2VydEJsb2NrY2hhaW5Kb2IgPSAoZW50cnkpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBvdXJFbnRyeSA9IGVudHJ5O1xuICAgIEFkZEluc2VydEJsb2NrY2hhaW5Kb2JTY2hlbWEudmFsaWRhdGUob3VyRW50cnkpO1xuICAgIGNvbnN0IGpvYiA9IG5ldyBKb2IoQmxvY2tjaGFpbkpvYnMsICdpbnNlcnQnLCBvdXJFbnRyeSk7XG4gICAgam9iLnJldHJ5KHtyZXRyaWVzOiAxMCwgd2FpdDogMyo2MCoxMDAwIH0pLnNhdmUoKTsgLy9jaGVjayBldmVyeSAxMHNlYyBmb3IgMWhcbiAgfSBjYXRjaCAoZXhjZXB0aW9uKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignam9icy5hZGRJbnNlcnRCbG9ja2NoYWluLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGFkZEluc2VydEJsb2NrY2hhaW5Kb2I7XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCB7IEpvYiB9IGZyb20gJ21ldGVvci92c2l2c2k6am9iLWNvbGxlY3Rpb24nO1xuaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tICdzaW1wbC1zY2hlbWEnO1xuaW1wb3J0IHsgTWFpbEpvYnMgfSBmcm9tICcuLi8uLi8uLi8uLi9zZXJ2ZXIvYXBpL21haWxfam9icy5qcyc7XG5cbmNvbnN0IEFkZFNlbmRNYWlsSm9iU2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIC8qZnJvbToge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICByZWdFeDogU2ltcGxlU2NoZW1hLlJlZ0V4LkVtYWlsXG4gIH0sKi9cbiAgdG86IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgcmVnRXg6IFNpbXBsZVNjaGVtYS5SZWdFeC5FbWFpbFxuICB9LFxuICBzdWJqZWN0OiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICB9LFxuICBtZXNzYWdlOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICB9LFxuICByZXR1cm5QYXRoOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIHJlZ0V4OiBTaW1wbGVTY2hlbWEuUmVnRXguRW1haWxcbiAgfVxufSk7XG5cbmNvbnN0IGFkZFNlbmRNYWlsSm9iID0gKG1haWwpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBvdXJNYWlsID0gbWFpbDtcbiAgICBBZGRTZW5kTWFpbEpvYlNjaGVtYS52YWxpZGF0ZShvdXJNYWlsKTtcbiAgICBjb25zdCBqb2IgPSBuZXcgSm9iKE1haWxKb2JzLCAnc2VuZCcsIG91ck1haWwpO1xuICAgIGpvYi5yZXRyeSh7cmV0cmllczogNSwgd2FpdDogNjAqMTAwMCB9KS5zYXZlKCk7XG4gIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2pvYnMuYWRkU2VuZE1haWwuZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgYWRkU2VuZE1haWxKb2I7XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcbmltcG9ydCB7IEpvYiB9IGZyb20gJ21ldGVvci92c2l2c2k6am9iLWNvbGxlY3Rpb24nO1xuaW1wb3J0IHsgQmxvY2tjaGFpbkpvYnMgfSBmcm9tICcuLi8uLi8uLi8uLi9zZXJ2ZXIvYXBpL2Jsb2NrY2hhaW5fam9icy5qcyc7XG5cbmNvbnN0IEFkZFVwZGF0ZUJsb2NrY2hhaW5Kb2JTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgbmFtZUlkOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH0sXG4gIHZhbHVlOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH0sXG4gIGZyb21Ib3N0VXJsOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH0sXG4gIGhvc3Q6IHtcbiAgICAgIHR5cGU6IFN0cmluZ1xuICB9XG59KTtcblxuY29uc3QgYWRkVXBkYXRlQmxvY2tjaGFpbkpvYiA9IChlbnRyeSkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IG91ckVudHJ5ID0gZW50cnk7XG4gICAgQWRkVXBkYXRlQmxvY2tjaGFpbkpvYlNjaGVtYS52YWxpZGF0ZShvdXJFbnRyeSk7XG4gICAgY29uc3Qgam9iID0gbmV3IEpvYihCbG9ja2NoYWluSm9icywgJ3VwZGF0ZScsIG91ckVudHJ5KTtcbiAgICBqb2IucmV0cnkoe3JldHJpZXM6IDM2MCwgd2FpdDogMSoxMCoxMDAwIH0pLnNhdmUoKTtcbiAgfSBjYXRjaCAoZXhjZXB0aW9uKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignam9icy5hZGRVcGRhdGVCbG9ja2NoYWluLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGFkZFVwZGF0ZUJsb2NrY2hhaW5Kb2I7XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCBpMThuIGZyb20gJ21ldGVvci91bml2ZXJzZTppMThuJztcblxuLy8gdW5pdmVyc2U6aTE4biBvbmx5IGJ1bmRsZXMgdGhlIGRlZmF1bHQgbGFuZ3VhZ2Ugb24gdGhlIGNsaWVudCBzaWRlLlxuLy8gVG8gZ2V0IGEgbGlzdCBvZiBhbGwgYXZpYWxibGUgbGFuZ3VhZ2VzIHdpdGggYXQgbGVhc3Qgb25lIHRyYW5zbGF0aW9uLFxuLy8gaTE4bi5nZXRMYW5ndWFnZXMoKSBtdXN0IGJlIGNhbGxlZCBzZXJ2ZXIgc2lkZS5cbmNvbnN0IGdldExhbmd1YWdlcyA9ICgpID0+IHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gaTE4bi5nZXRMYW5ndWFnZXMoKTtcbiAgfSBjYXRjaCAoZXhjZXB0aW9uKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignbGFuZ3VhZ2VzLmdldC5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBnZXRMYW5ndWFnZXM7XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcbmltcG9ydCB7IE1ldGEgfSBmcm9tICcuLi8uLi8uLi9hcGkvbWV0YS9tZXRhLmpzJztcblxuY29uc3QgQWRkT3JVcGRhdGVNZXRhU2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIGtleToge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9LFxuICB2YWx1ZToge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9XG59KTtcblxuY29uc3QgYWRkT3JVcGRhdGVNZXRhID0gKGRhdGEpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBvdXJEYXRhID0gZGF0YTtcbiAgICBBZGRPclVwZGF0ZU1ldGFTY2hlbWEudmFsaWRhdGUob3VyRGF0YSk7XG4gICAgY29uc3QgbWV0YSA9IE1ldGEuZmluZE9uZSh7a2V5OiBvdXJEYXRhLmtleX0pO1xuICAgIGlmKG1ldGEgIT09IHVuZGVmaW5lZCkgTWV0YS51cGRhdGUoe19pZCA6IG1ldGEuX2lkfSwgeyRzZXQ6IHtcbiAgICAgIHZhbHVlOiBvdXJEYXRhLnZhbHVlXG4gICAgfX0pO1xuICAgIGVsc2UgcmV0dXJuIE1ldGEuaW5zZXJ0KHtcbiAgICAgIGtleTogb3VyRGF0YS5rZXksXG4gICAgICB2YWx1ZTogb3VyRGF0YS52YWx1ZVxuICAgIH0pXG4gIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ21ldGEuYWRkT3JVcGRhdGUuZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgYWRkT3JVcGRhdGVNZXRhO1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XG5pbXBvcnQgeyBPcHRJbnMgfSBmcm9tICcuLi8uLi8uLi9hcGkvb3B0LWlucy9vcHQtaW5zLmpzJztcblxuY29uc3QgQWRkT3B0SW5TY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgbmFtZToge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9XG59KTtcblxuY29uc3QgYWRkT3B0SW4gPSAob3B0SW4pID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBvdXJPcHRJbiA9IG9wdEluO1xuICAgIEFkZE9wdEluU2NoZW1hLnZhbGlkYXRlKG91ck9wdEluKTtcbiAgICBjb25zdCBvcHRJbnMgPSBPcHRJbnMuZmluZCh7bmFtZUlkOiBvdXJPcHRJbi5uYW1lfSkuZmV0Y2goKTtcbiAgICBpZihvcHRJbnMubGVuZ3RoID4gMCkgcmV0dXJuIG9wdEluc1swXS5faWQ7XG4gICAgY29uc3Qgb3B0SW5JZCA9IE9wdElucy5pbnNlcnQoe1xuICAgICAgbmFtZUlkOiBvdXJPcHRJbi5uYW1lXG4gICAgfSk7XG4gICAgcmV0dXJuIG9wdEluSWQ7XG4gIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ29wdC1pbnMuYWRkLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGFkZE9wdEluO1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XG5pbXBvcnQgYWRkUmVjaXBpZW50IGZyb20gJy4uL3JlY2lwaWVudHMvYWRkLmpzJztcbmltcG9ydCBhZGRTZW5kZXIgZnJvbSAnLi4vc2VuZGVycy9hZGQuanMnO1xuaW1wb3J0IHsgT3B0SW5zIH0gZnJvbSAnLi4vLi4vLi4vYXBpL29wdC1pbnMvb3B0LWlucy5qcyc7XG5pbXBvcnQgd3JpdGVUb0Jsb2NrY2hhaW4gZnJvbSAnLi4vZG9pY2hhaW4vd3JpdGVfdG9fYmxvY2tjaGFpbi5qcyc7XG5pbXBvcnQge2xvZ0Vycm9yLCBsb2dTZW5kfSBmcm9tIFwiLi4vLi4vLi4vc3RhcnR1cC9zZXJ2ZXIvbG9nLWNvbmZpZ3VyYXRpb25cIjtcblxuXG5jb25zdCBBZGRPcHRJblNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICByZWNpcGllbnRfbWFpbDoge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICByZWdFeDogU2ltcGxlU2NoZW1hLlJlZ0V4LkVtYWlsXG4gIH0sXG4gIHNlbmRlcl9tYWlsOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIHJlZ0V4OiBTaW1wbGVTY2hlbWEuUmVnRXguRW1haWxcbiAgfSxcbiAgZGF0YToge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICBvcHRpb25hbDogdHJ1ZVxuICB9LFxuICBtYXN0ZXJfZG9pOiB7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICBvcHRpb25hbDogdHJ1ZVxuICB9LFxuICBpbmRleDoge1xuICAgICAgdHlwZTogU2ltcGxlU2NoZW1hLkludGVnZXIsXG4gICAgICBvcHRpb25hbDogdHJ1ZVxuICB9LFxuICBvd25lcklkOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIHJlZ0V4OiBTaW1wbGVTY2hlbWEuUmVnRXguaWRcbiAgfVxufSk7XG5cbmNvbnN0IGFkZE9wdEluID0gKG9wdEluKSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3Qgb3VyT3B0SW4gPSBvcHRJbjtcbiAgICBBZGRPcHRJblNjaGVtYS52YWxpZGF0ZShvdXJPcHRJbik7XG5cbiAgICBjb25zdCByZWNpcGllbnQgPSB7XG4gICAgICBlbWFpbDogb3VyT3B0SW4ucmVjaXBpZW50X21haWxcbiAgICB9XG4gICAgY29uc3QgcmVjaXBpZW50SWQgPSBhZGRSZWNpcGllbnQocmVjaXBpZW50KTtcbiAgICBjb25zdCBzZW5kZXIgPSB7XG4gICAgICBlbWFpbDogb3VyT3B0SW4uc2VuZGVyX21haWxcbiAgICB9XG4gICAgY29uc3Qgc2VuZGVySWQgPSBhZGRTZW5kZXIoc2VuZGVyKTtcbiAgICBcbiAgICBjb25zdCBvcHRJbnMgPSBPcHRJbnMuZmluZCh7cmVjaXBpZW50OiByZWNpcGllbnRJZCwgc2VuZGVyOiBzZW5kZXJJZH0pLmZldGNoKCk7XG4gICAgaWYob3B0SW5zLmxlbmd0aCA+IDApIHJldHVybiBvcHRJbnNbMF0uX2lkOyAvL1RPRE8gd2hlbiBTT0kgYWxyZWFkeSBleGlzdHMgcmVzZW5kIGVtYWlsP1xuXG4gICAgaWYob3VyT3B0SW4uZGF0YSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0cnkge1xuICAgICAgICBKU09OLnBhcnNlKG91ck9wdEluLmRhdGEpO1xuICAgICAgfSBjYXRjaChlcnJvcikge1xuICAgICAgICBsb2dFcnJvcihcIm91ck9wdEluLmRhdGE6XCIsb3VyT3B0SW4uZGF0YSk7XG4gICAgICAgIHRocm93IFwiSW52YWxpZCBkYXRhIGpzb24gXCI7XG4gICAgICB9XG4gICAgfVxuICAgIFxuICAgIGNvbnN0IG9wdEluSWQgPSBPcHRJbnMuaW5zZXJ0KHtcbiAgICAgIHJlY2lwaWVudDogcmVjaXBpZW50SWQsXG4gICAgICBzZW5kZXI6IHNlbmRlcklkLFxuICAgICAgaW5kZXg6IG91ck9wdEluLmluZGV4LFxuICAgICAgbWFzdGVyRG9pIDogb3VyT3B0SW4ubWFzdGVyX2RvaSxcbiAgICAgIGRhdGE6IG91ck9wdEluLmRhdGEsXG4gICAgICBvd25lcklkOiBvdXJPcHRJbi5vd25lcklkXG4gICAgfSk7XG4gICAgbG9nU2VuZChcIm9wdEluIChpbmRleDpcIitvdXJPcHRJbi5pbmRleCtcIiBhZGRlZCB0byBsb2NhbCBkYiB3aXRoIG9wdEluSWRcIixvcHRJbklkKTtcblxuICAgIHdyaXRlVG9CbG9ja2NoYWluKHtpZDogb3B0SW5JZH0pO1xuICAgIHJldHVybiBvcHRJbklkO1xuICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdvcHQtaW5zLmFkZEFuZFdyaXRlVG9CbG9ja2NoYWluLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGFkZE9wdEluO1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XG5pbXBvcnQgeyBDT05GSVJNX0NMSUVOVCwgQ09ORklSTV9BRERSRVNTIH0gZnJvbSAnLi4vLi4vLi4vc3RhcnR1cC9zZXJ2ZXIvZG9pY2hhaW4tY29uZmlndXJhdGlvbi5qcyc7XG5pbXBvcnQgeyBPcHRJbnMgfSBmcm9tICcuLi8uLi8uLi9hcGkvb3B0LWlucy9vcHQtaW5zLmpzJztcbmltcG9ydCB7IERvaWNoYWluRW50cmllcyB9IGZyb20gJy4uLy4uLy4uL2FwaS9kb2ljaGFpbi9lbnRyaWVzLmpzJztcbmltcG9ydCBkZWNvZGVEb2lIYXNoIGZyb20gJy4uL2VtYWlscy9kZWNvZGVfZG9pLWhhc2guanMnO1xuaW1wb3J0IHsgc2lnbk1lc3NhZ2UgfSBmcm9tICcuLi8uLi8uLi8uLi9zZXJ2ZXIvYXBpL2RvaWNoYWluLmpzJztcbmltcG9ydCBhZGRVcGRhdGVCbG9ja2NoYWluSm9iIGZyb20gJy4uL2pvYnMvYWRkX3VwZGF0ZV9ibG9ja2NoYWluLmpzJztcbmltcG9ydCB7bG9nQ29uZmlybX0gZnJvbSBcIi4uLy4uLy4uL3N0YXJ0dXAvc2VydmVyL2xvZy1jb25maWd1cmF0aW9uXCI7XG5cbmNvbnN0IENvbmZpcm1PcHRJblNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICBob3N0OiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH0sXG4gIGhhc2g6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfVxufSk7XG5cbmNvbnN0IGNvbmZpcm1PcHRJbiA9IChyZXF1ZXN0KSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3Qgb3VyUmVxdWVzdCA9IHJlcXVlc3Q7XG4gICAgQ29uZmlybU9wdEluU2NoZW1hLnZhbGlkYXRlKG91clJlcXVlc3QpO1xuICAgIGNvbnN0IGRlY29kZWQgPSBkZWNvZGVEb2lIYXNoKHtoYXNoOiByZXF1ZXN0Lmhhc2h9KTtcbiAgICBjb25zdCBvcHRJbiA9IE9wdElucy5maW5kT25lKHtfaWQ6IGRlY29kZWQuaWR9KTtcbiAgICBpZihvcHRJbiA9PT0gdW5kZWZpbmVkIHx8IG9wdEluLmNvbmZpcm1hdGlvblRva2VuICE9PSBkZWNvZGVkLnRva2VuKSB0aHJvdyBcIkludmFsaWQgaGFzaFwiO1xuICAgIGNvbnN0IGNvbmZpcm1lZEF0ID0gbmV3IERhdGUoKTtcblxuICAgIE9wdElucy51cGRhdGUoe19pZCA6IG9wdEluLl9pZH0seyRzZXQ6e2NvbmZpcm1lZEF0OiBjb25maXJtZWRBdCwgY29uZmlybWVkQnk6IG91clJlcXVlc3QuaG9zdH0sICR1bnNldDoge2NvbmZpcm1hdGlvblRva2VuOiBcIlwifX0pO1xuXG4gICAgLy9UT0RPIGhlcmUgZmluZCBhbGwgRG9pY2hhaW5FbnRyaWVzIGluIHRoZSBsb2NhbCBkYXRhYmFzZSAgYW5kIGJsb2NrY2hhaW4gd2l0aCB0aGUgc2FtZSBtYXN0ZXJEb2lcbiAgICBjb25zdCBlbnRyaWVzID0gRG9pY2hhaW5FbnRyaWVzLmZpbmQoeyRvcjogW3tuYW1lOiBvcHRJbi5uYW1lSWR9LCB7bWFzdGVyRG9pOiBvcHRJbi5uYW1lSWR9XX0pO1xuICAgIGlmKGVudHJpZXMgPT09IHVuZGVmaW5lZCkgdGhyb3cgXCJEb2ljaGFpbiBlbnRyeS9lbnRyaWVzIG5vdCBmb3VuZFwiO1xuXG4gICAgZW50cmllcy5mb3JFYWNoKGVudHJ5ID0+IHtcbiAgICAgICAgbG9nQ29uZmlybSgnY29uZmlybWluZyBEb2lDaGFpbkVudHJ5OicsZW50cnkpO1xuXG4gICAgICAgIGNvbnN0IHZhbHVlID0gSlNPTi5wYXJzZShlbnRyeS52YWx1ZSk7XG4gICAgICAgIGxvZ0NvbmZpcm0oJ2dldFNpZ25hdHVyZSAob25seSBvZiB2YWx1ZSEpJywgdmFsdWUpO1xuXG4gICAgICAgIGNvbnN0IGRvaVNpZ25hdHVyZSA9IHNpZ25NZXNzYWdlKENPTkZJUk1fQ0xJRU5ULCBDT05GSVJNX0FERFJFU1MsIHZhbHVlLnNpZ25hdHVyZSk7XG4gICAgICAgIGxvZ0NvbmZpcm0oJ2dvdCBkb2lTaWduYXR1cmU6Jyxkb2lTaWduYXR1cmUpO1xuICAgICAgICBjb25zdCBmcm9tSG9zdFVybCA9IHZhbHVlLmZyb207XG5cbiAgICAgICAgZGVsZXRlIHZhbHVlLmZyb207XG4gICAgICAgIHZhbHVlLmRvaVRpbWVzdGFtcCA9IGNvbmZpcm1lZEF0LnRvSVNPU3RyaW5nKCk7XG4gICAgICAgIHZhbHVlLmRvaVNpZ25hdHVyZSA9IGRvaVNpZ25hdHVyZTtcbiAgICAgICAgY29uc3QganNvblZhbHVlID0gSlNPTi5zdHJpbmdpZnkodmFsdWUpO1xuICAgICAgICBsb2dDb25maXJtKCd1cGRhdGluZyBEb2ljaGFpbiBuYW1lSWQ6JytvcHRJbi5uYW1lSWQrJyB3aXRoIHZhbHVlOicsanNvblZhbHVlKTtcblxuICAgICAgICBhZGRVcGRhdGVCbG9ja2NoYWluSm9iKHtcbiAgICAgICAgICAgIG5hbWVJZDogZW50cnkubmFtZSxcbiAgICAgICAgICAgIHZhbHVlOiBqc29uVmFsdWUsXG4gICAgICAgICAgICBmcm9tSG9zdFVybDogZnJvbUhvc3RVcmwsXG4gICAgICAgICAgICBob3N0OiBvdXJSZXF1ZXN0Lmhvc3RcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gICAgbG9nQ29uZmlybSgncmVkaXJlY3RpbmcgdXNlciB0bzonLGRlY29kZWQucmVkaXJlY3QpO1xuICAgIHJldHVybiBkZWNvZGVkLnJlZGlyZWN0O1xuICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdvcHQtaW5zLmNvbmZpcm0uZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgY29uZmlybU9wdEluXG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcbmltcG9ydCB7IHJhbmRvbUJ5dGVzIH0gZnJvbSAnY3J5cHRvJztcbmltcG9ydCB7IE9wdElucyB9IGZyb20gJy4uLy4uLy4uL2FwaS9vcHQtaW5zL29wdC1pbnMuanMnO1xuXG5jb25zdCBHZW5lcmF0ZURvaVRva2VuU2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIGlkOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH1cbn0pO1xuXG5jb25zdCBnZW5lcmF0ZURvaVRva2VuID0gKG9wdEluKSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3Qgb3VyT3B0SW4gPSBvcHRJbjtcbiAgICBHZW5lcmF0ZURvaVRva2VuU2NoZW1hLnZhbGlkYXRlKG91ck9wdEluKTtcbiAgICBjb25zdCB0b2tlbiA9IHJhbmRvbUJ5dGVzKDMyKS50b1N0cmluZygnaGV4Jyk7XG4gICAgT3B0SW5zLnVwZGF0ZSh7X2lkIDogb3VyT3B0SW4uaWR9LHskc2V0Ontjb25maXJtYXRpb25Ub2tlbjogdG9rZW59fSk7XG4gICAgcmV0dXJuIHRva2VuO1xuICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdvcHQtaW5zLmdlbmVyYXRlX2RvaS10b2tlbi5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBnZW5lcmF0ZURvaVRva2VuXG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcbmltcG9ydCB7IE9wdElucyB9IGZyb20gJy4uLy4uLy4uL2FwaS9vcHQtaW5zL29wdC1pbnMuanMnO1xuaW1wb3J0IHsgUmVjaXBpZW50cyB9IGZyb20gJy4uLy4uLy4uL2FwaS9yZWNpcGllbnRzL3JlY2lwaWVudHMuanMnO1xuaW1wb3J0IHZlcmlmeVNpZ25hdHVyZSBmcm9tICcuLi9kb2ljaGFpbi92ZXJpZnlfc2lnbmF0dXJlLmpzJztcbmltcG9ydCB7bG9nU2VuZH0gZnJvbSBcIi4uLy4uLy4uL3N0YXJ0dXAvc2VydmVyL2xvZy1jb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgZ2V0UHVibGljS2V5QW5kQWRkcmVzcyBmcm9tIFwiLi4vZG9pY2hhaW4vZ2V0X3B1YmxpY2tleV9hbmRfYWRkcmVzc19ieV9kb21haW5cIjtcblxuY29uc3QgVXBkYXRlT3B0SW5TdGF0dXNTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgbmFtZUlkOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH0sXG4gIHNpZ25hdHVyZToge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9LFxuICBob3N0OiB7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICBvcHRpb25hbDogdHJ1ZVxuICB9XG59KTtcblxuXG5jb25zdCB1cGRhdGVPcHRJblN0YXR1cyA9IChkYXRhKSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3Qgb3VyRGF0YSA9IGRhdGE7XG4gICAgbG9nU2VuZCgnY29uZmlybSBkQXBwIGNvbmZpcm1zIG9wdEluOicsSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xuICAgIFVwZGF0ZU9wdEluU3RhdHVzU2NoZW1hLnZhbGlkYXRlKG91ckRhdGEpO1xuICAgIGNvbnN0IG9wdEluID0gT3B0SW5zLmZpbmRPbmUoe25hbWVJZDogb3VyRGF0YS5uYW1lSWR9KTtcbiAgICBpZihvcHRJbiA9PT0gdW5kZWZpbmVkKSB0aHJvdyBcIk9wdC1JbiBub3QgZm91bmRcIjtcbiAgICBsb2dTZW5kKCdjb25maXJtIGRBcHAgY29uZmlybXMgb3B0SW46JyxvdXJEYXRhLm5hbWVJZCk7XG5cbiAgICBjb25zdCByZWNpcGllbnQgPSBSZWNpcGllbnRzLmZpbmRPbmUoe19pZDogb3B0SW4ucmVjaXBpZW50fSk7XG4gICAgaWYocmVjaXBpZW50ID09PSB1bmRlZmluZWQpIHRocm93IFwiUmVjaXBpZW50IG5vdCBmb3VuZFwiO1xuICAgIGNvbnN0IHBhcnRzID0gcmVjaXBpZW50LmVtYWlsLnNwbGl0KFwiQFwiKTtcbiAgICBjb25zdCBkb21haW4gPSBwYXJ0c1twYXJ0cy5sZW5ndGgtMV07XG4gICAgY29uc3QgcHVibGljS2V5QW5kQWRkcmVzcyA9IGdldFB1YmxpY0tleUFuZEFkZHJlc3Moe2RvbWFpbjpkb21haW59KTtcblxuICAgIC8vVE9ETyBnZXR0aW5nIGluZm9ybWF0aW9uIGZyb20gQm9iIHRoYXQgYSBjZXJ0YWluIG5hbWVJZCAoRE9JKSBnb3QgY29uZmlybWVkLlxuICAgIGlmKCF2ZXJpZnlTaWduYXR1cmUoe3B1YmxpY0tleTogcHVibGljS2V5QW5kQWRkcmVzcy5wdWJsaWNLZXksIGRhdGE6IG91ckRhdGEubmFtZUlkLCBzaWduYXR1cmU6IG91ckRhdGEuc2lnbmF0dXJlfSkpIHtcbiAgICAgIHRocm93IFwiQWNjZXNzIGRlbmllZFwiO1xuICAgIH1cbiAgICBsb2dTZW5kKCdzaWduYXR1cmUgdmFsaWQgZm9yIHB1YmxpY0tleScsIHB1YmxpY0tleUFuZEFkZHJlc3MucHVibGljS2V5KTtcblxuICAgIE9wdElucy51cGRhdGUoe19pZCA6IG9wdEluLl9pZH0seyRzZXQ6e2NvbmZpcm1lZEF0OiBuZXcgRGF0ZSgpLCBjb25maXJtZWRCeTogb3VyRGF0YS5ob3N0fX0pO1xuICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdkYXBwcy5zZW5kLnVwZGF0ZU9wdEluU3RhdHVzLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IHVwZGF0ZU9wdEluU3RhdHVzO1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XG5pbXBvcnQgeyBWRVJJRllfQ0xJRU5UIH0gZnJvbSAnLi4vLi4vLi4vc3RhcnR1cC9zZXJ2ZXIvZG9pY2hhaW4tY29uZmlndXJhdGlvbi5qcyc7XG5pbXBvcnQgeyBuYW1lU2hvdyB9IGZyb20gJy4uLy4uLy4uLy4uL3NlcnZlci9hcGkvZG9pY2hhaW4uanMnO1xuaW1wb3J0IGdldE9wdEluUHJvdmlkZXIgZnJvbSAnLi4vZG5zL2dldF9vcHQtaW4tcHJvdmlkZXIuanMnO1xuaW1wb3J0IGdldE9wdEluS2V5IGZyb20gJy4uL2Rucy9nZXRfb3B0LWluLWtleS5qcyc7XG5pbXBvcnQgdmVyaWZ5U2lnbmF0dXJlIGZyb20gJy4uL2RvaWNoYWluL3ZlcmlmeV9zaWduYXR1cmUuanMnO1xuaW1wb3J0IHtsb2dWZXJpZnl9IGZyb20gXCIuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9sb2ctY29uZmlndXJhdGlvblwiO1xuaW1wb3J0IGdldFB1YmxpY0tleUFuZEFkZHJlc3MgZnJvbSBcIi4uL2RvaWNoYWluL2dldF9wdWJsaWNrZXlfYW5kX2FkZHJlc3NfYnlfZG9tYWluXCI7XG5cbmNvbnN0IFZlcmlmeU9wdEluU2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIHJlY2lwaWVudF9tYWlsOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIHJlZ0V4OiBTaW1wbGVTY2hlbWEuUmVnRXguRW1haWxcbiAgfSxcbiAgc2VuZGVyX21haWw6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgcmVnRXg6IFNpbXBsZVNjaGVtYS5SZWdFeC5FbWFpbFxuICB9LFxuICBuYW1lX2lkOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH0sXG4gIHJlY2lwaWVudF9wdWJsaWNfa2V5OiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH1cbn0pO1xuXG5jb25zdCB2ZXJpZnlPcHRJbiA9IChkYXRhKSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3Qgb3VyRGF0YSA9IGRhdGE7XG4gICAgVmVyaWZ5T3B0SW5TY2hlbWEudmFsaWRhdGUob3VyRGF0YSk7XG4gICAgY29uc3QgZW50cnkgPSBuYW1lU2hvdyhWRVJJRllfQ0xJRU5ULCBvdXJEYXRhLm5hbWVfaWQpO1xuICAgIGlmKGVudHJ5ID09PSB1bmRlZmluZWQpIHJldHVybiBmYWxzZTtcbiAgICBjb25zdCBlbnRyeURhdGEgPSBKU09OLnBhcnNlKGVudHJ5LnZhbHVlKTtcbiAgICBjb25zdCBmaXJzdENoZWNrID0gdmVyaWZ5U2lnbmF0dXJlKHtcbiAgICAgIGRhdGE6IG91ckRhdGEucmVjaXBpZW50X21haWwrb3VyRGF0YS5zZW5kZXJfbWFpbCxcbiAgICAgIHNpZ25hdHVyZTogZW50cnlEYXRhLnNpZ25hdHVyZSxcbiAgICAgIHB1YmxpY0tleTogb3VyRGF0YS5yZWNpcGllbnRfcHVibGljX2tleVxuICAgIH0pXG5cbiAgICBpZighZmlyc3RDaGVjaykgcmV0dXJuIHtmaXJzdENoZWNrOiBmYWxzZX07XG4gICAgY29uc3QgcGFydHMgPSBvdXJEYXRhLnJlY2lwaWVudF9tYWlsLnNwbGl0KFwiQFwiKTsgLy9UT0RPIHB1dCB0aGlzIGludG8gZ2V0UHVibGljS2V5QW5kQWRkcmVzc1xuICAgIGNvbnN0IGRvbWFpbiA9IHBhcnRzW3BhcnRzLmxlbmd0aC0xXTtcbiAgICBjb25zdCBwdWJsaWNLZXlBbmRBZGRyZXNzID0gZ2V0UHVibGljS2V5QW5kQWRkcmVzcyh7ZG9tYWluOiBkb21haW59KTtcblxuICAgIGNvbnN0IHNlY29uZENoZWNrID0gdmVyaWZ5U2lnbmF0dXJlKHtcbiAgICAgIGRhdGE6IGVudHJ5RGF0YS5zaWduYXR1cmUsXG4gICAgICBzaWduYXR1cmU6IGVudHJ5RGF0YS5kb2lTaWduYXR1cmUsXG4gICAgICBwdWJsaWNLZXk6IHB1YmxpY0tleUFuZEFkZHJlc3MucHVibGljS2V5XG4gICAgfSlcblxuICAgIGlmKCFzZWNvbmRDaGVjaykgcmV0dXJuIHtzZWNvbmRDaGVjazogZmFsc2V9O1xuICAgIHJldHVybiB0cnVlO1xuICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdvcHQtaW5zLnZlcmlmeS5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCB2ZXJpZnlPcHRJblxuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XG5pbXBvcnQgeyBSZWNpcGllbnRzIH0gZnJvbSAnLi4vLi4vLi4vYXBpL3JlY2lwaWVudHMvcmVjaXBpZW50cy5qcyc7XG5pbXBvcnQgZ2V0S2V5UGFpciBmcm9tICcuLi9kb2ljaGFpbi9nZXRfa2V5LXBhaXIuanMnO1xuXG5jb25zdCBBZGRSZWNpcGllbnRTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgZW1haWw6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgcmVnRXg6IFNpbXBsZVNjaGVtYS5SZWdFeC5FbWFpbFxuICB9XG59KTtcblxuY29uc3QgYWRkUmVjaXBpZW50ID0gKHJlY2lwaWVudCkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IG91clJlY2lwaWVudCA9IHJlY2lwaWVudDtcbiAgICBBZGRSZWNpcGllbnRTY2hlbWEudmFsaWRhdGUob3VyUmVjaXBpZW50KTtcbiAgICBjb25zdCByZWNpcGllbnRzID0gUmVjaXBpZW50cy5maW5kKHtlbWFpbDogcmVjaXBpZW50LmVtYWlsfSkuZmV0Y2goKTtcbiAgICBpZihyZWNpcGllbnRzLmxlbmd0aCA+IDApIHJldHVybiByZWNpcGllbnRzWzBdLl9pZDtcbiAgICBjb25zdCBrZXlQYWlyID0gZ2V0S2V5UGFpcigpO1xuICAgIHJldHVybiBSZWNpcGllbnRzLmluc2VydCh7XG4gICAgICBlbWFpbDogb3VyUmVjaXBpZW50LmVtYWlsLFxuICAgICAgcHJpdmF0ZUtleToga2V5UGFpci5wcml2YXRlS2V5LFxuICAgICAgcHVibGljS2V5OiBrZXlQYWlyLnB1YmxpY0tleVxuICAgIH0pXG4gIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ3JlY2lwaWVudHMuYWRkLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGFkZFJlY2lwaWVudDtcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tICdzaW1wbC1zY2hlbWEnO1xuaW1wb3J0IHsgU2VuZGVycyB9IGZyb20gJy4uLy4uLy4uL2FwaS9zZW5kZXJzL3NlbmRlcnMuanMnO1xuXG5jb25zdCBBZGRTZW5kZXJTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgZW1haWw6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgcmVnRXg6IFNpbXBsZVNjaGVtYS5SZWdFeC5FbWFpbFxuICB9XG59KTtcblxuY29uc3QgYWRkU2VuZGVyID0gKHNlbmRlcikgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IG91clNlbmRlciA9IHNlbmRlcjtcbiAgICBBZGRTZW5kZXJTY2hlbWEudmFsaWRhdGUob3VyU2VuZGVyKTtcbiAgICBjb25zdCBzZW5kZXJzID0gU2VuZGVycy5maW5kKHtlbWFpbDogc2VuZGVyLmVtYWlsfSkuZmV0Y2goKTtcbiAgICBpZihzZW5kZXJzLmxlbmd0aCA+IDApIHJldHVybiBzZW5kZXJzWzBdLl9pZDtcbiAgICByZXR1cm4gU2VuZGVycy5pbnNlcnQoe1xuICAgICAgZW1haWw6IG91clNlbmRlci5lbWFpbFxuICAgIH0pXG4gIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ3NlbmRlcnMuYWRkLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGFkZFNlbmRlcjtcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuXG5leHBvcnQgZnVuY3Rpb24gaXNEZWJ1ZygpIHtcbiAgaWYoTWV0ZW9yLnNldHRpbmdzICE9PSB1bmRlZmluZWQgJiZcbiAgICAgTWV0ZW9yLnNldHRpbmdzLmFwcCAhPT0gdW5kZWZpbmVkICYmXG4gICAgIE1ldGVvci5zZXR0aW5ncy5hcHAuZGVidWcgIT09IHVuZGVmaW5lZCkgcmV0dXJuIE1ldGVvci5zZXR0aW5ncy5hcHAuZGVidWdcbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNSZWd0ZXN0KCkge1xuICBpZihNZXRlb3Iuc2V0dGluZ3MgIT09IHVuZGVmaW5lZCAmJlxuICAgICBNZXRlb3Iuc2V0dGluZ3MuYXBwICE9PSB1bmRlZmluZWQgJiZcbiAgICAgTWV0ZW9yLnNldHRpbmdzLmFwcC5yZWd0ZXN0ICE9PSB1bmRlZmluZWQpIHJldHVybiBNZXRlb3Iuc2V0dGluZ3MuYXBwLnJlZ3Rlc3RcbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNUZXN0bmV0KCkge1xuICAgIGlmKE1ldGVvci5zZXR0aW5ncyAhPT0gdW5kZWZpbmVkICYmXG4gICAgICAgIE1ldGVvci5zZXR0aW5ncy5hcHAgIT09IHVuZGVmaW5lZCAmJlxuICAgICAgICBNZXRlb3Iuc2V0dGluZ3MuYXBwLnRlc3RuZXQgIT09IHVuZGVmaW5lZCkgcmV0dXJuIE1ldGVvci5zZXR0aW5ncy5hcHAudGVzdG5ldFxuICAgIHJldHVybiBmYWxzZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFVybCgpIHtcbiAgaWYoTWV0ZW9yLnNldHRpbmdzICE9PSB1bmRlZmluZWQgJiZcbiAgICAgTWV0ZW9yLnNldHRpbmdzLmFwcCAhPT0gdW5kZWZpbmVkICYmXG4gICAgIE1ldGVvci5zZXR0aW5ncy5hcHAuaG9zdCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgbGV0IHBvcnQgPSAzMDAwO1xuICAgICAgIGlmKE1ldGVvci5zZXR0aW5ncy5hcHAucG9ydCAhPT0gdW5kZWZpbmVkKSBwb3J0ID0gTWV0ZW9yLnNldHRpbmdzLmFwcC5wb3J0XG4gICAgICAgcmV0dXJuIFwiaHR0cDovL1wiK01ldGVvci5zZXR0aW5ncy5hcHAuaG9zdCtcIjpcIitwb3J0K1wiL1wiO1xuICB9XG4gIHJldHVybiBNZXRlb3IuYWJzb2x1dGVVcmwoKTtcbn1cbiIsImV4cG9ydCBjb25zdCBGQUxMQkFDS19QUk9WSURFUiA9IFwiZG9pY2hhaW4ub3JnXCI7XG4iLCJpbXBvcnQgbmFtZWNvaW4gZnJvbSAnbmFtZWNvaW4nO1xuaW1wb3J0IHsgU0VORF9BUFAsIENPTkZJUk1fQVBQLCBWRVJJRllfQVBQLCBpc0FwcFR5cGUgfSBmcm9tICcuL3R5cGUtY29uZmlndXJhdGlvbi5qcyc7XG5cbnZhciBzZW5kU2V0dGluZ3MgPSBNZXRlb3Iuc2V0dGluZ3Muc2VuZDtcbnZhciBzZW5kQ2xpZW50ID0gdW5kZWZpbmVkO1xuaWYoaXNBcHBUeXBlKFNFTkRfQVBQKSkge1xuICBpZighc2VuZFNldHRpbmdzIHx8ICFzZW5kU2V0dGluZ3MuZG9pY2hhaW4pXG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcihcImNvbmZpZy5zZW5kLmRvaWNoYWluXCIsIFwiU2VuZCBhcHAgZG9pY2hhaW4gc2V0dGluZ3Mgbm90IGZvdW5kXCIpXG4gIHNlbmRDbGllbnQgPSBjcmVhdGVDbGllbnQoc2VuZFNldHRpbmdzLmRvaWNoYWluKTtcbn1cbmV4cG9ydCBjb25zdCBTRU5EX0NMSUVOVCA9IHNlbmRDbGllbnQ7XG5cbnZhciBjb25maXJtU2V0dGluZ3MgPSBNZXRlb3Iuc2V0dGluZ3MuY29uZmlybTtcbnZhciBjb25maXJtQ2xpZW50ID0gdW5kZWZpbmVkO1xudmFyIGNvbmZpcm1BZGRyZXNzID0gdW5kZWZpbmVkO1xuaWYoaXNBcHBUeXBlKENPTkZJUk1fQVBQKSkge1xuICBpZighY29uZmlybVNldHRpbmdzIHx8ICFjb25maXJtU2V0dGluZ3MuZG9pY2hhaW4pXG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcihcImNvbmZpZy5jb25maXJtLmRvaWNoYWluXCIsIFwiQ29uZmlybSBhcHAgZG9pY2hhaW4gc2V0dGluZ3Mgbm90IGZvdW5kXCIpXG4gIGNvbmZpcm1DbGllbnQgPSBjcmVhdGVDbGllbnQoY29uZmlybVNldHRpbmdzLmRvaWNoYWluKTtcbiAgY29uZmlybUFkZHJlc3MgPSBjb25maXJtU2V0dGluZ3MuZG9pY2hhaW4uYWRkcmVzcztcbn1cbmV4cG9ydCBjb25zdCBDT05GSVJNX0NMSUVOVCA9IGNvbmZpcm1DbGllbnQ7XG5leHBvcnQgY29uc3QgQ09ORklSTV9BRERSRVNTID0gY29uZmlybUFkZHJlc3M7XG5cbnZhciB2ZXJpZnlTZXR0aW5ncyA9IE1ldGVvci5zZXR0aW5ncy52ZXJpZnk7XG52YXIgdmVyaWZ5Q2xpZW50ID0gdW5kZWZpbmVkO1xuaWYoaXNBcHBUeXBlKFZFUklGWV9BUFApKSB7XG4gIGlmKCF2ZXJpZnlTZXR0aW5ncyB8fCAhdmVyaWZ5U2V0dGluZ3MuZG9pY2hhaW4pXG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcihcImNvbmZpZy52ZXJpZnkuZG9pY2hhaW5cIiwgXCJWZXJpZnkgYXBwIGRvaWNoYWluIHNldHRpbmdzIG5vdCBmb3VuZFwiKVxuICB2ZXJpZnlDbGllbnQgPSBjcmVhdGVDbGllbnQodmVyaWZ5U2V0dGluZ3MuZG9pY2hhaW4pO1xufVxuZXhwb3J0IGNvbnN0IFZFUklGWV9DTElFTlQgPSB2ZXJpZnlDbGllbnQ7XG5cbmZ1bmN0aW9uIGNyZWF0ZUNsaWVudChzZXR0aW5ncykge1xuICByZXR1cm4gbmV3IG5hbWVjb2luLkNsaWVudCh7XG4gICAgaG9zdDogc2V0dGluZ3MuaG9zdCxcbiAgICBwb3J0OiBzZXR0aW5ncy5wb3J0LFxuICAgIHVzZXI6IHNldHRpbmdzLnVzZXJuYW1lLFxuICAgIHBhc3M6IHNldHRpbmdzLnBhc3N3b3JkXG4gIH0pO1xufVxuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgeyBTRU5EX0FQUCwgQ09ORklSTV9BUFAsIGlzQXBwVHlwZSB9IGZyb20gJy4vdHlwZS1jb25maWd1cmF0aW9uLmpzJztcbmltcG9ydCBIYXNoaWRzIGZyb20gJ2hhc2hpZHMnO1xuLy9jb25zdCBIYXNoaWRzID0gcmVxdWlyZSgnaGFzaGlkcycpLmRlZmF1bHQ7XG5pbXBvcnQge2xvZ0NvbmZpcm19IGZyb20gXCIuL2xvZy1jb25maWd1cmF0aW9uXCI7XG5cbmV4cG9ydCBjb25zdCBIYXNoSWRzID0gbmV3IEhhc2hpZHMoJzB4dWdtTGU3TnllZTZ2azFpRjg4KDZDbXdwcW9HNGhRKi1UNzR0all3Xk8ydk9PKFhsLTkxd0E4Km5DZ19sWCQnKTtcblxudmFyIHNlbmRTZXR0aW5ncyA9IE1ldGVvci5zZXR0aW5ncy5zZW5kO1xudmFyIGRvaU1haWxGZXRjaFVybCA9IHVuZGVmaW5lZDtcblxuaWYoaXNBcHBUeXBlKFNFTkRfQVBQKSkge1xuICBpZighc2VuZFNldHRpbmdzIHx8ICFzZW5kU2V0dGluZ3MuZG9pTWFpbEZldGNoVXJsKVxuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoXCJjb25maWcuc2VuZC5lbWFpbFwiLCBcIlNldHRpbmdzIG5vdCBmb3VuZFwiKTtcbiAgZG9pTWFpbEZldGNoVXJsID0gc2VuZFNldHRpbmdzLmRvaU1haWxGZXRjaFVybDtcbn1cbmV4cG9ydCBjb25zdCBET0lfTUFJTF9GRVRDSF9VUkwgPSBkb2lNYWlsRmV0Y2hVcmw7XG5cbnZhciBkZWZhdWx0RnJvbSA9IHVuZGVmaW5lZDtcbmlmKGlzQXBwVHlwZShDT05GSVJNX0FQUCkpIHtcbiAgdmFyIGNvbmZpcm1TZXR0aW5ncyA9IE1ldGVvci5zZXR0aW5ncy5jb25maXJtO1xuXG4gIGlmKCFjb25maXJtU2V0dGluZ3MgfHwgIWNvbmZpcm1TZXR0aW5ncy5zbXRwKVxuICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFwiY29uZmlnLmNvbmZpcm0uc210cFwiLCBcIkNvbmZpcm0gYXBwIGVtYWlsIHNtdHAgc2V0dGluZ3Mgbm90IGZvdW5kXCIpXG5cbiAgaWYoIWNvbmZpcm1TZXR0aW5ncy5zbXRwLmRlZmF1bHRGcm9tKVxuICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFwiY29uZmlnLmNvbmZpcm0uZGVmYXVsdEZyb21cIiwgXCJDb25maXJtIGFwcCBlbWFpbCBkZWZhdWx0RnJvbSBub3QgZm91bmRcIilcblxuICBkZWZhdWx0RnJvbSAgPSAgY29uZmlybVNldHRpbmdzLnNtdHAuZGVmYXVsdEZyb207XG5cbiAgbG9nQ29uZmlybSgnc2VuZGluZyB3aXRoIGRlZmF1bHRGcm9tOicsZGVmYXVsdEZyb20pO1xuXG4gIE1ldGVvci5zdGFydHVwKCgpID0+IHtcblxuICAgaWYoY29uZmlybVNldHRpbmdzLnNtdHAudXNlcm5hbWUgPT09IHVuZGVmaW5lZCl7XG4gICAgICAgcHJvY2Vzcy5lbnYuTUFJTF9VUkwgPSAnc210cDovLycgK1xuICAgICAgICAgICBlbmNvZGVVUklDb21wb25lbnQoY29uZmlybVNldHRpbmdzLnNtdHAuc2VydmVyKSArXG4gICAgICAgICAgICc6JyArXG4gICAgICAgICAgIGNvbmZpcm1TZXR0aW5ncy5zbXRwLnBvcnQ7XG4gICB9ZWxzZXtcbiAgICAgICBwcm9jZXNzLmVudi5NQUlMX1VSTCA9ICdzbXRwOi8vJyArXG4gICAgICAgICAgIGVuY29kZVVSSUNvbXBvbmVudChjb25maXJtU2V0dGluZ3Muc210cC51c2VybmFtZSkgK1xuICAgICAgICAgICAnOicgKyBlbmNvZGVVUklDb21wb25lbnQoY29uZmlybVNldHRpbmdzLnNtdHAucGFzc3dvcmQpICtcbiAgICAgICAgICAgJ0AnICsgZW5jb2RlVVJJQ29tcG9uZW50KGNvbmZpcm1TZXR0aW5ncy5zbXRwLnNlcnZlcikgK1xuICAgICAgICAgICAnOicgK1xuICAgICAgICAgICBjb25maXJtU2V0dGluZ3Muc210cC5wb3J0O1xuICAgfVxuXG4gICBsb2dDb25maXJtKCd1c2luZyBNQUlMX1VSTDonLHByb2Nlc3MuZW52Lk1BSUxfVVJMKTtcblxuICAgaWYoY29uZmlybVNldHRpbmdzLnNtdHAuTk9ERV9UTFNfUkVKRUNUX1VOQVVUSE9SSVpFRCE9PXVuZGVmaW5lZClcbiAgICAgICBwcm9jZXNzLmVudi5OT0RFX1RMU19SRUpFQ1RfVU5BVVRIT1JJWkVEID0gY29uZmlybVNldHRpbmdzLnNtdHAuTk9ERV9UTFNfUkVKRUNUX1VOQVVUSE9SSVpFRDsgLy8wXG4gIH0pO1xufVxuZXhwb3J0IGNvbnN0IERPSV9NQUlMX0RFRkFVTFRfRU1BSUxfRlJPTSA9IGRlZmF1bHRGcm9tO1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgeyBSb2xlcyB9IGZyb20gJ21ldGVvci9hbGFubmluZzpyb2xlcyc7XG5pbXBvcnQge01ldGF9IGZyb20gJy4uLy4uL2FwaS9tZXRhL21ldGEuanMnXG5NZXRlb3Iuc3RhcnR1cCgoKSA9PiB7XG4gICBsZXQgdmVyc2lvbj1Bc3NldHMuZ2V0VGV4dChcInZlcnNpb24uanNvblwiKTtcblxuICBpZiAoTWV0YS5maW5kKCkuY291bnQoKSA+IDApe1xuICAgIE1ldGEucmVtb3ZlKHt9KTtcbiAgfVxuICAgTWV0YS5pbnNlcnQoe2tleTpcInZlcnNpb25cIix2YWx1ZTp2ZXJzaW9ufSk7XG4gIFxuICBpZihNZXRlb3IudXNlcnMuZmluZCgpLmNvdW50KCkgPT09IDApIHtcbiAgICBjb25zdCBpZCA9IEFjY291bnRzLmNyZWF0ZVVzZXIoe1xuICAgICAgdXNlcm5hbWU6ICdhZG1pbicsXG4gICAgICBlbWFpbDogJ2FkbWluQHNlbmRlZmZlY3QuZGUnLFxuICAgICAgcGFzc3dvcmQ6ICdwYXNzd29yZCdcbiAgICB9KTtcbiAgICBSb2xlcy5hZGRVc2Vyc1RvUm9sZXMoaWQsICdhZG1pbicpO1xuICB9XG59KTtcbiIsImltcG9ydCAnLi9sb2ctY29uZmlndXJhdGlvbi5qcyc7XG5pbXBvcnQgJy4vZGFwcC1jb25maWd1cmF0aW9uLmpzJztcbmltcG9ydCAnLi90eXBlLWNvbmZpZ3VyYXRpb24uanMnO1xuaW1wb3J0ICcuL2Rucy1jb25maWd1cmF0aW9uLmpzJztcbmltcG9ydCAnLi9kb2ljaGFpbi1jb25maWd1cmF0aW9uLmpzJztcbmltcG9ydCAnLi9maXh0dXJlcy5qcyc7XG5pbXBvcnQgJy4vcmVnaXN0ZXItYXBpLmpzJztcbmltcG9ydCAnLi91c2VyYWNjb3VudHMtY29uZmlndXJhdGlvbi5qcyc7XG5pbXBvcnQgJy4vc2VjdXJpdHkuanMnO1xuaW1wb3J0ICcuL2VtYWlsLWNvbmZpZ3VyYXRpb24uanMnO1xuaW1wb3J0ICcuL2pvYnMuanMnO1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgeyBNYWlsSm9icyB9IGZyb20gJy4uLy4uLy4uL3NlcnZlci9hcGkvbWFpbF9qb2JzLmpzJztcbmltcG9ydCB7IEJsb2NrY2hhaW5Kb2JzIH0gZnJvbSAnLi4vLi4vLi4vc2VydmVyL2FwaS9ibG9ja2NoYWluX2pvYnMuanMnO1xuaW1wb3J0IHsgREFwcEpvYnMgfSBmcm9tICcuLi8uLi8uLi9zZXJ2ZXIvYXBpL2RhcHBfam9icy5qcyc7XG5pbXBvcnQgeyBDT05GSVJNX0FQUCwgaXNBcHBUeXBlIH0gZnJvbSAnLi90eXBlLWNvbmZpZ3VyYXRpb24uanMnO1xuaW1wb3J0IGFkZENoZWNrTmV3VHJhbnNhY3Rpb25zQmxvY2tjaGFpbkpvYiBmcm9tICcuLi8uLi9tb2R1bGVzL3NlcnZlci9qb2JzL2FkZF9jaGVja19uZXdfdHJhbnNhY3Rpb25zLmpzJztcblxuTWV0ZW9yLnN0YXJ0dXAoKCkgPT4ge1xuICBNYWlsSm9icy5zdGFydEpvYlNlcnZlcigpO1xuICBCbG9ja2NoYWluSm9icy5zdGFydEpvYlNlcnZlcigpO1xuICBEQXBwSm9icy5zdGFydEpvYlNlcnZlcigpO1xuICBpZihpc0FwcFR5cGUoQ09ORklSTV9BUFApKSBhZGRDaGVja05ld1RyYW5zYWN0aW9uc0Jsb2NrY2hhaW5Kb2IoKTtcbn0pO1xuIiwiaW1wb3J0IHtpc0RlYnVnfSBmcm9tIFwiLi9kYXBwLWNvbmZpZ3VyYXRpb25cIjtcblxucmVxdWlyZSgnc2NyaWJlLWpzJykoKTtcblxuZXhwb3J0IGNvbnN0IGNvbnNvbGUgPSBwcm9jZXNzLmNvbnNvbGU7XG5leHBvcnQgY29uc3Qgc2VuZE1vZGVUYWdDb2xvciA9IHttc2cgOiAnc2VuZC1tb2RlJywgY29sb3JzIDogWyd5ZWxsb3cnLCAnaW52ZXJzZSddfTtcbmV4cG9ydCBjb25zdCBjb25maXJtTW9kZVRhZ0NvbG9yID0ge21zZyA6ICdjb25maXJtLW1vZGUnLCBjb2xvcnMgOiBbJ2JsdWUnLCAnaW52ZXJzZSddfTtcbmV4cG9ydCBjb25zdCB2ZXJpZnlNb2RlVGFnQ29sb3IgPSB7bXNnIDogJ3ZlcmlmeS1tb2RlJywgY29sb3JzIDogWydncmVlbicsICdpbnZlcnNlJ119O1xuZXhwb3J0IGNvbnN0IGJsb2NrY2hhaW5Nb2RlVGFnQ29sb3IgPSB7bXNnIDogJ2Jsb2NrY2hhaW4tbW9kZScsIGNvbG9ycyA6IFsnd2hpdGUnLCAnaW52ZXJzZSddfTtcbmV4cG9ydCBjb25zdCB0ZXN0aW5nTW9kZVRhZ0NvbG9yID0ge21zZyA6ICd0ZXN0aW5nLW1vZGUnLCBjb2xvcnMgOiBbJ29yYW5nZScsICdpbnZlcnNlJ119O1xuXG5leHBvcnQgZnVuY3Rpb24gbG9nU2VuZChtZXNzYWdlLHBhcmFtKSB7XG4gICAgaWYoaXNEZWJ1ZygpKSB7Y29uc29sZS50aW1lKCkudGFnKHNlbmRNb2RlVGFnQ29sb3IpLmxvZyhtZXNzYWdlLHBhcmFtP3BhcmFtOicnKTt9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsb2dDb25maXJtKG1lc3NhZ2UscGFyYW0pIHtcbiAgICBpZihpc0RlYnVnKCkpIHtjb25zb2xlLnRpbWUoKS50YWcoY29uZmlybU1vZGVUYWdDb2xvcikubG9nKG1lc3NhZ2UsIHBhcmFtP3BhcmFtOicnKTt9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsb2dWZXJpZnkobWVzc2FnZSwgcGFyYW0pIHtcbiAgICBpZihpc0RlYnVnKCkpIHtjb25zb2xlLnRpbWUoKS50YWcodmVyaWZ5TW9kZVRhZ0NvbG9yKS5sb2cobWVzc2FnZSwgcGFyYW0/cGFyYW06JycpO31cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxvZ0Jsb2NrY2hhaW4obWVzc2FnZSwgcGFyYW0pIHtcbiAgICBpZihpc0RlYnVnKCkpe2NvbnNvbGUudGltZSgpLnRhZyhibG9ja2NoYWluTW9kZVRhZ0NvbG9yKS5sb2cobWVzc2FnZSwgcGFyYW0/cGFyYW06JycpO31cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxvZ01haW4obWVzc2FnZSwgcGFyYW0pIHtcbiAgICBpZihpc0RlYnVnKCkpe2NvbnNvbGUudGltZSgpLnRhZyhibG9ja2NoYWluTW9kZVRhZ0NvbG9yKS5sb2cobWVzc2FnZSwgcGFyYW0/cGFyYW06JycpO31cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxvZ0Vycm9yKG1lc3NhZ2UsIHBhcmFtKSB7XG4gICAgaWYoaXNEZWJ1ZygpKXtjb25zb2xlLnRpbWUoKS50YWcoYmxvY2tjaGFpbk1vZGVUYWdDb2xvcikuZXJyb3IobWVzc2FnZSwgcGFyYW0/cGFyYW06JycpO31cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRlc3RMb2dnaW5nKG1lc3NhZ2UsIHBhcmFtKSB7XG4gICAgaWYoaXNEZWJ1ZygpKXtjb25zb2xlLnRpbWUoKS50YWcodGVzdGluZ01vZGVUYWdDb2xvcikubG9nKG1lc3NhZ2UsIHBhcmFtP3BhcmFtOicnKTt9XG59IiwiaW1wb3J0ICcuLi8uLi9hcGkvbGFuZ3VhZ2VzL21ldGhvZHMuanMnO1xuaW1wb3J0ICcuLi8uLi9hcGkvZG9pY2hhaW4vbWV0aG9kcy5qcyc7XG5pbXBvcnQgJy4uLy4uL2FwaS9yZWNpcGllbnRzL3NlcnZlci9wdWJsaWNhdGlvbnMuanMnO1xuaW1wb3J0ICcuLi8uLi9hcGkvb3B0LWlucy9tZXRob2RzLmpzJztcbmltcG9ydCAnLi4vLi4vYXBpL3ZlcnNpb24vcHVibGljYXRpb25zLmpzJztcbmltcG9ydCAnLi4vLi4vYXBpL29wdC1pbnMvc2VydmVyL3B1YmxpY2F0aW9ucy5qcyc7XG5cbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IHsgRERQUmF0ZUxpbWl0ZXIgfSBmcm9tICdtZXRlb3IvZGRwLXJhdGUtbGltaXRlcic7XG5pbXBvcnQgeyBfIH0gZnJvbSAnbWV0ZW9yL3VuZGVyc2NvcmUnO1xuXG4vLyBEb24ndCBsZXQgcGVvcGxlIHdyaXRlIGFyYml0cmFyeSBkYXRhIHRvIHRoZWlyICdwcm9maWxlJyBmaWVsZCBmcm9tIHRoZSBjbGllbnRcbk1ldGVvci51c2Vycy5kZW55KHtcbiAgdXBkYXRlKCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9LFxufSk7XG5cbi8vIEdldCBhIGxpc3Qgb2YgYWxsIGFjY291bnRzIG1ldGhvZHMgYnkgcnVubmluZyBgTWV0ZW9yLnNlcnZlci5tZXRob2RfaGFuZGxlcnNgIGluIG1ldGVvciBzaGVsbFxuY29uc3QgQVVUSF9NRVRIT0RTID0gW1xuICAnbG9naW4nLFxuICAnbG9nb3V0JyxcbiAgJ2xvZ291dE90aGVyQ2xpZW50cycsXG4gICdnZXROZXdUb2tlbicsXG4gICdyZW1vdmVPdGhlclRva2VucycsXG4gICdjb25maWd1cmVMb2dpblNlcnZpY2UnLFxuICAnY2hhbmdlUGFzc3dvcmQnLFxuICAnZm9yZ290UGFzc3dvcmQnLFxuICAncmVzZXRQYXNzd29yZCcsXG4gICd2ZXJpZnlFbWFpbCcsXG4gICdjcmVhdGVVc2VyJyxcbiAgJ0FUUmVtb3ZlU2VydmljZScsXG4gICdBVENyZWF0ZVVzZXJTZXJ2ZXInLFxuICAnQVRSZXNlbmRWZXJpZmljYXRpb25FbWFpbCcsXG5dO1xuXG5pZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIC8vIE9ubHkgYWxsb3cgMiBsb2dpbiBhdHRlbXB0cyBwZXIgY29ubmVjdGlvbiBwZXIgNSBzZWNvbmRzXG4gIEREUFJhdGVMaW1pdGVyLmFkZFJ1bGUoe1xuICAgIG5hbWUobmFtZSkge1xuICAgICAgcmV0dXJuIF8uY29udGFpbnMoQVVUSF9NRVRIT0RTLCBuYW1lKTtcbiAgICB9LFxuXG4gICAgLy8gUmF0ZSBsaW1pdCBwZXIgY29ubmVjdGlvbiBJRFxuICAgIGNvbm5lY3Rpb25JZCgpIHsgcmV0dXJuIHRydWU7IH0sXG4gIH0sIDIsIDUwMDApO1xufVxuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5leHBvcnQgY29uc3QgU0VORF9BUFAgPSBcInNlbmRcIjtcbmV4cG9ydCBjb25zdCBDT05GSVJNX0FQUCA9IFwiY29uZmlybVwiO1xuZXhwb3J0IGNvbnN0IFZFUklGWV9BUFAgPSBcInZlcmlmeVwiO1xuZXhwb3J0IGZ1bmN0aW9uIGlzQXBwVHlwZSh0eXBlKSB7XG4gIGlmKE1ldGVvci5zZXR0aW5ncyA9PT0gdW5kZWZpbmVkIHx8IE1ldGVvci5zZXR0aW5ncy5hcHAgPT09IHVuZGVmaW5lZCkgdGhyb3cgXCJObyBzZXR0aW5ncyBmb3VuZCFcIlxuICBjb25zdCB0eXBlcyA9IE1ldGVvci5zZXR0aW5ncy5hcHAudHlwZXM7XG4gIGlmKHR5cGVzICE9PSB1bmRlZmluZWQpIHJldHVybiB0eXBlcy5pbmNsdWRlcyh0eXBlKTtcbiAgcmV0dXJuIGZhbHNlO1xufVxuIiwiaW1wb3J0IHsgQWNjb3VudHMgfSBmcm9tICdtZXRlb3IvYWNjb3VudHMtYmFzZSc7XG5BY2NvdW50cy5jb25maWcoe1xuICAgIHNlbmRWZXJpZmljYXRpb25FbWFpbDogdHJ1ZSxcbiAgICBmb3JiaWRDbGllbnRBY2NvdW50Q3JlYXRpb246IHRydWVcbn0pO1xuXG5cblxuQWNjb3VudHMuZW1haWxUZW1wbGF0ZXMuZnJvbT0nZG9pY2hhaW5AbGUtc3BhY2UuZGUnOyIsImltcG9ydCB7IEFwaSwgRE9JX1dBTExFVE5PVElGWV9ST1VURSwgRE9JX0NPTkZJUk1BVElPTl9ST1VURSB9IGZyb20gJy4uL3Jlc3QuanMnO1xuaW1wb3J0IGNvbmZpcm1PcHRJbiBmcm9tICcuLi8uLi8uLi8uLi9pbXBvcnRzL21vZHVsZXMvc2VydmVyL29wdC1pbnMvY29uZmlybS5qcydcbmltcG9ydCBjaGVja05ld1RyYW5zYWN0aW9uIGZyb20gXCIuLi8uLi8uLi8uLi9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2RvaWNoYWluL2NoZWNrX25ld190cmFuc2FjdGlvbnNcIjtcbmltcG9ydCB7bG9nQ29uZmlybX0gZnJvbSBcIi4uLy4uLy4uLy4uL2ltcG9ydHMvc3RhcnR1cC9zZXJ2ZXIvbG9nLWNvbmZpZ3VyYXRpb25cIjtcbi8vZG9rdSBvZiBtZXRlb3ItcmVzdGl2dXMgaHR0cHM6Ly9naXRodWIuY29tL2thaG1hbGkvbWV0ZW9yLXJlc3RpdnVzXG5BcGkuYWRkUm91dGUoRE9JX0NPTkZJUk1BVElPTl9ST1VURSsnLzpoYXNoJywge2F1dGhSZXF1aXJlZDogZmFsc2V9LCB7XG4gIGdldDoge1xuICAgIGFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBoYXNoID0gdGhpcy51cmxQYXJhbXMuaGFzaDtcbiAgICAgIHRyeSB7XG4gICAgICAgIGxldCBpcCA9IHRoaXMucmVxdWVzdC5oZWFkZXJzWyd4LWZvcndhcmRlZC1mb3InXSB8fFxuICAgICAgICAgIHRoaXMucmVxdWVzdC5jb25uZWN0aW9uLnJlbW90ZUFkZHJlc3MgfHxcbiAgICAgICAgICB0aGlzLnJlcXVlc3Quc29ja2V0LnJlbW90ZUFkZHJlc3MgfHxcbiAgICAgICAgICAodGhpcy5yZXF1ZXN0LmNvbm5lY3Rpb24uc29ja2V0ID8gdGhpcy5yZXF1ZXN0LmNvbm5lY3Rpb24uc29ja2V0LnJlbW90ZUFkZHJlc3M6IG51bGwpO1xuXG4gICAgICAgICAgaWYoaXAuaW5kZXhPZignLCcpIT0tMSlpcD1pcC5zdWJzdHJpbmcoMCxpcC5pbmRleE9mKCcsJykpO1xuXG4gICAgICAgICAgbG9nQ29uZmlybSgnUkVTVCBvcHQtaW4vY29uZmlybSA6Jyx7aGFzaDpoYXNoLCBob3N0OmlwfSk7XG4gICAgICAgICAgY29uc3QgcmVkaXJlY3QgPSBjb25maXJtT3B0SW4oe2hvc3Q6IGlwLCBoYXNoOiBoYXNofSk7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBzdGF0dXNDb2RlOiAzMDMsXG4gICAgICAgICAgaGVhZGVyczogeydDb250ZW50LVR5cGUnOiAndGV4dC9wbGFpbicsICdMb2NhdGlvbic6IHJlZGlyZWN0fSxcbiAgICAgICAgICBib2R5OiAnTG9jYXRpb246ICcrcmVkaXJlY3RcbiAgICAgICAgfTtcbiAgICAgIH0gY2F0Y2goZXJyb3IpIHtcbiAgICAgICAgcmV0dXJuIHtzdGF0dXNDb2RlOiA1MDAsIGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogZXJyb3IubWVzc2FnZX19O1xuICAgICAgfVxuICAgIH1cbiAgfVxufSk7XG5cbkFwaS5hZGRSb3V0ZShET0lfV0FMTEVUTk9USUZZX1JPVVRFLCB7XG4gICAgZ2V0OiB7XG4gICAgICAgIGF1dGhSZXF1aXJlZDogZmFsc2UsXG4gICAgICAgIGFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjb25zdCBwYXJhbXMgPSB0aGlzLnF1ZXJ5UGFyYW1zO1xuICAgICAgICAgICAgY29uc3QgdHhpZCA9IHBhcmFtcy50eDtcblxuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBjaGVja05ld1RyYW5zYWN0aW9uKHR4aWQpO1xuICAgICAgICAgICAgICAgIHJldHVybiB7c3RhdHVzOiAnc3VjY2VzcycsICBkYXRhOid0eGlkOicrdHhpZCsnIHdhcyByZWFkIGZyb20gYmxvY2tjaGFpbid9O1xuICAgICAgICAgICAgfSBjYXRjaChlcnJvcikge1xuICAgICAgICAgICAgICAgIHJldHVybiB7c3RhdHVzOiAnZmFpbCcsIGVycm9yOiBlcnJvci5tZXNzYWdlfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn0pO1xuIiwiaW1wb3J0IHsgQXBpIH0gZnJvbSAnLi4vcmVzdC5qcyc7XG5BcGkuYWRkUm91dGUoJ2RlYnVnL21haWwnLCB7YXV0aFJlcXVpcmVkOiBmYWxzZX0sIHtcbiAgZ2V0OiB7XG4gICAgYWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IGRhdGEgPSB7XG4gICAgICAgIFwiZnJvbVwiOiBcIm5vcmVwbHlAZG9pY2hhaW4ub3JnXCIsXG4gICAgICAgIFwic3ViamVjdFwiOiBcIkRvaWNoYWluLm9yZyBOZXdzbGV0dGVyIEJlc3TDpHRpZ3VuZ1wiLFxuICAgICAgICBcInJlZGlyZWN0XCI6IFwiaHR0cHM6Ly93d3cuZG9pY2hhaW4ub3JnL3ZpZWxlbi1kYW5rL1wiLFxuICAgICAgICBcInJldHVyblBhdGhcIjogXCJub3JlcGx5QGRvaWNoYWluLm9yZ1wiLFxuICAgICAgICBcImNvbnRlbnRcIjpcIjxzdHlsZSB0eXBlPSd0ZXh0L2NzcycgbWVkaWE9J3NjcmVlbic+XFxuXCIgK1xuICAgICAgICAgICAgXCIqIHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGxpbmUtaGVpZ2h0OiBpbmhlcml0O1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwiLkV4dGVybmFsQ2xhc3MgKiB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRsaW5lLWhlaWdodDogMTAwJTtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcImJvZHksIHAge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0bWFyZ2luOiAwO1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0cGFkZGluZzogMDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdG1hcmdpbi1ib3R0b206IDA7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHQtd2Via2l0LXRleHQtc2l6ZS1hZGp1c3Q6IG5vbmU7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHQtbXMtdGV4dC1zaXplLWFkanVzdDogbm9uZTtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcImltZyB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRsaW5lLWhlaWdodDogMTAwJTtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdG91dGxpbmU6IG5vbmU7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHR0ZXh0LWRlY29yYXRpb246IG5vbmU7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHQtbXMtaW50ZXJwb2xhdGlvbi1tb2RlOiBiaWN1YmljO1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwiYSBpbWcge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0Ym9yZGVyOiBub25lO1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwiI2JhY2tncm91bmRUYWJsZSB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRtYXJnaW46IDA7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRwYWRkaW5nOiAwO1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0d2lkdGg6IDEwMCUgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcImEsIGE6bGluaywgLm5vLWRldGVjdC1sb2NhbCBhLCAuYXBwbGVMaW5rcyBhIHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGNvbG9yOiAjNTU1NWZmICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHR0ZXh0LWRlY29yYXRpb246IHVuZGVybGluZTtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcIi5FeHRlcm5hbENsYXNzIHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGRpc3BsYXk6IGJsb2NrICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHR3aWR0aDogMTAwJTtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcIi5FeHRlcm5hbENsYXNzLCAuRXh0ZXJuYWxDbGFzcyBwLCAuRXh0ZXJuYWxDbGFzcyBzcGFuLCAuRXh0ZXJuYWxDbGFzcyBmb250LCAuRXh0ZXJuYWxDbGFzcyB0ZCwgLkV4dGVybmFsQ2xhc3MgZGl2IHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGxpbmUtaGVpZ2h0OiBpbmhlcml0O1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwidGFibGUgdGQge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0Ym9yZGVyLWNvbGxhcHNlOiBjb2xsYXBzZTtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdG1zby10YWJsZS1sc3BhY2U6IDBwdDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdG1zby10YWJsZS1yc3BhY2U6IDBwdDtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcInN1cCB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRwb3NpdGlvbjogcmVsYXRpdmU7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHR0b3A6IDRweDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGxpbmUtaGVpZ2h0OiA3cHggIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGZvbnQtc2l6ZTogMTFweCAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwiLm1vYmlsZV9saW5rIGFbaHJlZl49J3RlbCddLCAubW9iaWxlX2xpbmsgYVtocmVmXj0nc21zJ10ge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0dGV4dC1kZWNvcmF0aW9uOiBkZWZhdWx0O1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0Y29sb3I6ICM1NTU1ZmYgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdHBvaW50ZXItZXZlbnRzOiBhdXRvO1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0Y3Vyc29yOiBkZWZhdWx0O1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwiLm5vLWRldGVjdCBhIHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdHRleHQtZGVjb3JhdGlvbjogbm9uZTtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGNvbG9yOiAjNTU1NWZmO1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0cG9pbnRlci1ldmVudHM6IGF1dG87XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRjdXJzb3I6IGRlZmF1bHQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCJ7XFxuXCIgK1xuICAgICAgICAgICAgXCJjb2xvcjogIzU1NTVmZjtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcInNwYW4ge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0Y29sb3I6IGluaGVyaXQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRib3JkZXItYm90dG9tOiBub25lO1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwic3Bhbjpob3ZlciB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcIi5ub3VuZGVybGluZSB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHR0ZXh0LWRlY29yYXRpb246IG5vbmUgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcImgxLCBoMiwgaDMge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0bWFyZ2luOiAwO1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0cGFkZGluZzogMDtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcInAge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0TWFyZ2luOiAwcHggIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcInRhYmxlW2NsYXNzPSdlbWFpbC1yb290LXdyYXBwZXInXSB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHR3aWR0aDogNjAwcHggIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcImJvZHkge1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwiYm9keSB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRtaW4td2lkdGg6IDI4MHB4O1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0d2lkdGg6IDEwMCU7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCJ0ZFtjbGFzcz0ncGF0dGVybiddIC5jMTEycDIwciB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHR3aWR0aDogMjAlO1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwidGRbY2xhc3M9J3BhdHRlcm4nXSAuYzMzNnA2MHIge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0d2lkdGg6IDYwLjAwMDAwMDAwMDAwMDI1NiU7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCI8L3N0eWxlPlxcblwiICtcbiAgICAgICAgICAgIFwiPHN0eWxlPlxcblwiICtcbiAgICAgICAgICAgIFwiQG1lZGlhIG9ubHkgc2NyZWVuIGFuZCAobWF4LXdpZHRoOiA1OTlweCksIG9ubHkgc2NyZWVuIGFuZCAobWF4LWRldmljZS13aWR0aDogNTk5cHgpLCBvbmx5IHNjcmVlbiBhbmQgKG1heC13aWR0aDogNDAwcHgpLCBvbmx5IHNjcmVlbiBhbmQgKG1heC1kZXZpY2Utd2lkdGg6IDQwMHB4KSB7XFxuXCIgK1xuICAgICAgICAgICAgXCIuZW1haWwtcm9vdC13cmFwcGVyIHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdHdpZHRoOiAxMDAlICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCIuZnVsbC13aWR0aCB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHR3aWR0aDogMTAwJSAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0aGVpZ2h0OiBhdXRvICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHR0ZXh0LWFsaWduOiBjZW50ZXI7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCIuZnVsbHdpZHRoaGFsZmxlZnQge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0d2lkdGg6IDEwMCUgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcIi5mdWxsd2lkdGhoYWxmcmlnaHQge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0d2lkdGg6IDEwMCUgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcIi5mdWxsd2lkdGhoYWxmaW5uZXIge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0d2lkdGg6IDEwMCUgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdG1hcmdpbjogMCBhdXRvICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRmbG9hdDogbm9uZSAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0bWFyZ2luLWxlZnQ6IGF1dG8gIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdG1hcmdpbi1yaWdodDogYXV0byAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0Y2xlYXI6IGJvdGggIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcIi5oaWRlIHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGRpc3BsYXk6IG5vbmUgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdHdpZHRoOiAwcHggIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGhlaWdodDogMHB4ICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRvdmVyZmxvdzogaGlkZGVuO1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwiLmRlc2t0b3AtaGlkZSB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRkaXNwbGF5OiBibG9jayAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0d2lkdGg6IDEwMCUgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGhlaWdodDogYXV0byAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0b3ZlcmZsb3c6IGhpZGRlbjtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdG1heC1oZWlnaHQ6IGluaGVyaXQgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcIi5jMTEycDIwciB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHR3aWR0aDogMTAwJSAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0ZmxvYXQ6IG5vbmU7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCIuYzMzNnA2MHIge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0d2lkdGg6IDEwMCUgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGZsb2F0OiBub25lO1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwiPC9zdHlsZT5cXG5cIiArXG4gICAgICAgICAgICBcIjxzdHlsZT5cXG5cIiArXG4gICAgICAgICAgICBcIkBtZWRpYSBvbmx5IHNjcmVlbiBhbmQgKG1pbi13aWR0aDogNjAwcHgpIHtcXG5cIiArXG4gICAgICAgICAgICBcInRkW2NsYXNzPSdwYXR0ZXJuJ10gLmMxMTJwMjByIHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdHdpZHRoOiAxMTJweCAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwidGRbY2xhc3M9J3BhdHRlcm4nXSAuYzMzNnA2MHIge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0d2lkdGg6IDMzNnB4ICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCJcXG5cIiArXG4gICAgICAgICAgICBcIkBtZWRpYSBvbmx5IHNjcmVlbiBhbmQgKG1heC13aWR0aDogNTk5cHgpLCBvbmx5IHNjcmVlbiBhbmQgKG1heC1kZXZpY2Utd2lkdGg6IDU5OXB4KSwgb25seSBzY3JlZW4gYW5kIChtYXgtd2lkdGg6IDQwMHB4KSwgb25seSBzY3JlZW4gYW5kIChtYXgtZGV2aWNlLXdpZHRoOiA0MDBweCkge1xcblwiICtcbiAgICAgICAgICAgIFwidGFibGVbY2xhc3M9J2VtYWlsLXJvb3Qtd3JhcHBlciddIHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdHdpZHRoOiAxMDAlICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCJ0ZFtjbGFzcz0nd3JhcCddIC5mdWxsLXdpZHRoIHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdHdpZHRoOiAxMDAlICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRoZWlnaHQ6IGF1dG8gIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcInRkW2NsYXNzPSd3cmFwJ10gLmZ1bGx3aWR0aGhhbGZsZWZ0IHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdHdpZHRoOiAxMDAlICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCJ0ZFtjbGFzcz0nd3JhcCddIC5mdWxsd2lkdGhoYWxmcmlnaHQge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0d2lkdGg6IDEwMCUgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcInRkW2NsYXNzPSd3cmFwJ10gLmZ1bGx3aWR0aGhhbGZpbm5lciB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHR3aWR0aDogMTAwJSAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0bWFyZ2luOiAwIGF1dG8gIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGZsb2F0OiBub25lICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRtYXJnaW4tbGVmdDogYXV0byAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0bWFyZ2luLXJpZ2h0OiBhdXRvICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRjbGVhcjogYm90aCAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwidGRbY2xhc3M9J3dyYXAnXSAuaGlkZSB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRkaXNwbGF5OiBub25lICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHR3aWR0aDogMHB4O1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0aGVpZ2h0OiAwcHg7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRvdmVyZmxvdzogaGlkZGVuO1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwidGRbY2xhc3M9J3BhdHRlcm4nXSAuYzExMnAyMHIge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0d2lkdGg6IDEwMCUgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcInRkW2NsYXNzPSdwYXR0ZXJuJ10gLmMzMzZwNjByIHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdHdpZHRoOiAxMDAlICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCJcXG5cIiArXG4gICAgICAgICAgICBcIkBtZWRpYSB5YWhvbyB7XFxuXCIgK1xuICAgICAgICAgICAgXCJ0YWJsZSB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRmbG9hdDogbm9uZSAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0aGVpZ2h0OiBhdXRvO1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwidGFibGVbYWxpZ249J2xlZnQnXSB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRmbG9hdDogbGVmdCAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwidGRbYWxpZ249J2xlZnQnXSB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRmbG9hdDogbGVmdCAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0aGVpZ2h0OiBhdXRvO1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwidGFibGVbYWxpZ249J2NlbnRlciddIHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdG1hcmdpbjogMCBhdXRvO1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwidGRbYWxpZ249J2NlbnRlciddIHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdG1hcmdpbjogMCBhdXRvO1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0aGVpZ2h0OiBhdXRvO1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwidGFibGVbYWxpZ249J3JpZ2h0J10ge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0ZmxvYXQ6IHJpZ2h0ICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCJ0ZFthbGlnbj0ncmlnaHQnXSB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRmbG9hdDogcmlnaHQgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGhlaWdodDogYXV0bztcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcIjwvc3R5bGU+XFxuXCIgK1xuICAgICAgICAgICAgXCJcXG5cIiArXG4gICAgICAgICAgICBcIjwhLS1baWYgKGd0ZSBJRSA3KSAmICh2bWwpXT5cXG5cIiArXG4gICAgICAgICAgICBcIjxzdHlsZSB0eXBlPSd0ZXh0L2Nzcyc+XFxuXCIgK1xuICAgICAgICAgICAgXCJodG1sLCBib2R5IHttYXJnaW46MCAhaW1wb3J0YW50OyBwYWRkaW5nOjBweCAhaW1wb3J0YW50O31cXG5cIiArXG4gICAgICAgICAgICBcImltZy5mdWxsLXdpZHRoIHsgcG9zaXRpb246IHJlbGF0aXZlICFpbXBvcnRhbnQ7IH1cXG5cIiArXG4gICAgICAgICAgICBcIlxcblwiICtcbiAgICAgICAgICAgIFwiLmltZzI0MHgzMCB7IHdpZHRoOiAyNDBweCAhaW1wb3J0YW50OyBoZWlnaHQ6IDMwcHggIWltcG9ydGFudDt9XFxuXCIgK1xuICAgICAgICAgICAgXCIuaW1nMjB4MjAgeyB3aWR0aDogMjBweCAhaW1wb3J0YW50OyBoZWlnaHQ6IDIwcHggIWltcG9ydGFudDt9XFxuXCIgK1xuICAgICAgICAgICAgXCJcXG5cIiArXG4gICAgICAgICAgICBcIjwvc3R5bGU+XFxuXCIgK1xuICAgICAgICAgICAgXCI8IVtlbmRpZl0tLT5cXG5cIiArXG4gICAgICAgICAgICBcIlxcblwiICtcbiAgICAgICAgICAgIFwiPCEtLVtpZiBndGUgbXNvIDldPlxcblwiICtcbiAgICAgICAgICAgIFwiPHN0eWxlIHR5cGU9J3RleHQvY3NzJz5cXG5cIiArXG4gICAgICAgICAgICBcIi5tc28tZm9udC1maXgtYXJpYWwgeyBmb250LWZhbWlseTogQXJpYWwsIHNhbnMtc2VyaWY7fVxcblwiICtcbiAgICAgICAgICAgIFwiLm1zby1mb250LWZpeC1nZW9yZ2lhIHsgZm9udC1mYW1pbHk6IEdlb3JnaWEsIHNhbnMtc2VyaWY7fVxcblwiICtcbiAgICAgICAgICAgIFwiLm1zby1mb250LWZpeC10YWhvbWEgeyBmb250LWZhbWlseTogVGFob21hLCBzYW5zLXNlcmlmO31cXG5cIiArXG4gICAgICAgICAgICBcIi5tc28tZm9udC1maXgtdGltZXNfbmV3X3JvbWFuIHsgZm9udC1mYW1pbHk6ICdUaW1lcyBOZXcgUm9tYW4nLCBzYW5zLXNlcmlmO31cXG5cIiArXG4gICAgICAgICAgICBcIi5tc28tZm9udC1maXgtdHJlYnVjaGV0X21zIHsgZm9udC1mYW1pbHk6ICdUcmVidWNoZXQgTVMnLCBzYW5zLXNlcmlmO31cXG5cIiArXG4gICAgICAgICAgICBcIi5tc28tZm9udC1maXgtdmVyZGFuYSB7IGZvbnQtZmFtaWx5OiBWZXJkYW5hLCBzYW5zLXNlcmlmO31cXG5cIiArXG4gICAgICAgICAgICBcIjwvc3R5bGU+XFxuXCIgK1xuICAgICAgICAgICAgXCI8IVtlbmRpZl0tLT5cXG5cIiArXG4gICAgICAgICAgICBcIlxcblwiICtcbiAgICAgICAgICAgIFwiPCEtLVtpZiBndGUgbXNvIDldPlxcblwiICtcbiAgICAgICAgICAgIFwiPHN0eWxlIHR5cGU9J3RleHQvY3NzJz5cXG5cIiArXG4gICAgICAgICAgICBcInRhYmxlLCB0ZCB7XFxuXCIgK1xuICAgICAgICAgICAgXCJib3JkZXItY29sbGFwc2U6IGNvbGxhcHNlICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJtc28tdGFibGUtbHNwYWNlOiAwcHggIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIm1zby10YWJsZS1yc3BhY2U6IDBweCAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwiXFxuXCIgK1xuICAgICAgICAgICAgXCIuZW1haWwtcm9vdC13cmFwcGVyIHsgd2lkdGggNjAwcHggIWltcG9ydGFudDt9XFxuXCIgK1xuICAgICAgICAgICAgXCIuaW1nbGluayB7IGZvbnQtc2l6ZTogMHB4OyB9XFxuXCIgK1xuICAgICAgICAgICAgXCIuZWRtX2J1dHRvbiB7IGZvbnQtc2l6ZTogMHB4OyB9XFxuXCIgK1xuICAgICAgICAgICAgXCI8L3N0eWxlPlxcblwiICtcbiAgICAgICAgICAgIFwiPCFbZW5kaWZdLS0+XFxuXCIgK1xuICAgICAgICAgICAgXCJcXG5cIiArXG4gICAgICAgICAgICBcIjwhLS1baWYgZ3RlIG1zbyAxNV0+XFxuXCIgK1xuICAgICAgICAgICAgXCI8c3R5bGUgdHlwZT0ndGV4dC9jc3MnPlxcblwiICtcbiAgICAgICAgICAgIFwidGFibGUge1xcblwiICtcbiAgICAgICAgICAgIFwiZm9udC1zaXplOjBweDtcXG5cIiArXG4gICAgICAgICAgICBcIm1zby1tYXJnaW4tdG9wLWFsdDowcHg7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCJcXG5cIiArXG4gICAgICAgICAgICBcIi5mdWxsd2lkdGhoYWxmbGVmdCB7XFxuXCIgK1xuICAgICAgICAgICAgXCJ3aWR0aDogNDklICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJmbG9hdDpsZWZ0ICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCJcXG5cIiArXG4gICAgICAgICAgICBcIi5mdWxsd2lkdGhoYWxmcmlnaHQge1xcblwiICtcbiAgICAgICAgICAgIFwid2lkdGg6IDUwJSAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwiZmxvYXQ6cmlnaHQgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcIjwvc3R5bGU+XFxuXCIgK1xuICAgICAgICAgICAgXCI8IVtlbmRpZl0tLT5cXG5cIiArXG4gICAgICAgICAgICBcIjxzdHlsZSB0eXBlPSd0ZXh0L2NzcycgbWVkaWE9Jyhwb2ludGVyKSBhbmQgKG1pbi1jb2xvci1pbmRleDowKSc+XFxuXCIgK1xuICAgICAgICAgICAgXCJodG1sLCBib2R5IHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGJhY2tncm91bmQtaW1hZ2U6IG5vbmUgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGJhY2tncm91bmQtY29sb3I6ICNlYmViZWIgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdG1hcmdpbjogMCAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0cGFkZGluZzogMCAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwiPC9zdHlsZT5cXG5cIiArXG4gICAgICAgICAgICBcIjwvaGVhZD5cXG5cIiArXG4gICAgICAgICAgICBcIjxib2R5IGxlZnRtYXJnaW49JzAnIG1hcmdpbndpZHRoPScwJyB0b3BtYXJnaW49JzAnIG1hcmdpbmhlaWdodD0nMCcgb2Zmc2V0PScwJyBiYWNrZ3JvdW5kPVxcXCJcXFwiIGJnY29sb3I9JyNlYmViZWInIHN0eWxlPSdmb250LWZhbWlseTpBcmlhbCwgc2Fucy1zZXJpZjsgZm9udC1zaXplOjBweDttYXJnaW46MDtwYWRkaW5nOjA7ICc+XFxuXCIgK1xuICAgICAgICAgICAgXCI8IS0tW2lmIHRdPjwhW2VuZGlmXS0tPjwhLS1baWYgdF0+PCFbZW5kaWZdLS0+PCEtLVtpZiB0XT48IVtlbmRpZl0tLT48IS0tW2lmIHRdPjwhW2VuZGlmXS0tPjwhLS1baWYgdF0+PCFbZW5kaWZdLS0+PCEtLVtpZiB0XT48IVtlbmRpZl0tLT5cXG5cIiArXG4gICAgICAgICAgICBcIjx0YWJsZSBhbGlnbj0nY2VudGVyJyBib3JkZXI9JzAnIGNlbGxwYWRkaW5nPScwJyBjZWxsc3BhY2luZz0nMCcgYmFja2dyb3VuZD1cXFwiXFxcIiAgaGVpZ2h0PScxMDAlJyB3aWR0aD0nMTAwJScgaWQ9J2JhY2tncm91bmRUYWJsZSc+XFxuXCIgK1xuICAgICAgICAgICAgXCIgIDx0cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICA8dGQgY2xhc3M9J3dyYXAnIGFsaWduPSdjZW50ZXInIHZhbGlnbj0ndG9wJyB3aWR0aD0nMTAwJSc+XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRcXHQ8Y2VudGVyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICA8IS0tIGNvbnRlbnQgLS0+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgIFxcdDxkaXYgc3R5bGU9J3BhZGRpbmc6IDBweDsnPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICBcXHQgIDx0YWJsZSBjZWxscGFkZGluZz0nMCcgY2VsbHNwYWNpbmc9JzAnIGJvcmRlcj0nMCcgd2lkdGg9JzEwMCUnIGJnY29sb3I9JyNlYmViZWInPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICBcXHRcXHQgPHRyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgXFx0XFx0ICA8dGQgdmFsaWduPSd0b3AnIHN0eWxlPSdwYWRkaW5nOiAwcHg7Jz5cXG5cIiArXG4gICAgICAgICAgICBcIlxcdFxcdFxcdFxcdFxcdFxcdCAgPHRhYmxlIGNlbGxwYWRkaW5nPScwJyBjZWxsc3BhY2luZz0nMCcgd2lkdGg9JzYwMCcgYWxpZ249J2NlbnRlcicgc3R5bGU9J21heC13aWR0aDogNjAwcHg7bWluLXdpZHRoOiAyNDBweDttYXJnaW46IDAgYXV0bzsnIGNsYXNzPSdlbWFpbC1yb290LXdyYXBwZXInPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICBcXHRcXHQgXFx0XFx0PHRyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgIFxcdFxcdFxcdFxcdFxcdCA8dGQgdmFsaWduPSd0b3AnIHN0eWxlPSdwYWRkaW5nOiAwcHg7Jz5cXG5cIiArXG4gICAgICAgICAgICBcIlxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdCBcXHRcXHQ8dGFibGUgY2VsbHBhZGRpbmc9JzAnIGNlbGxzcGFjaW5nPScwJyBib3JkZXI9JzAnIHdpZHRoPScxMDAlJyBiZ2NvbG9yPScjRkZGRkZGJyBzdHlsZT0nYm9yZGVyOiAwcHggbm9uZTtiYWNrZ3JvdW5kLWNvbG9yOiAjRkZGRkZGOyc+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgIFxcdFxcdFxcdFxcdFxcdFxcdCA8dHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgIFxcdFxcdFxcdCAgXFx0XFx0XFx0XFx0IDx0ZCB2YWxpZ249J3RvcCcgc3R5bGU9J3BhZGRpbmctdG9wOiAzMHB4O3BhZGRpbmctcmlnaHQ6IDIwcHg7cGFkZGluZy1ib3R0b206IDM1cHg7cGFkZGluZy1sZWZ0OiAyMHB4Oyc+XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHQgICBcXHRcXHRcXHRcXHRcXG5cIiArXG4gICAgICAgICAgICBcIlxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdDx0YWJsZSBjZWxscGFkZGluZz0nMCdcXG5cIiArXG4gICAgICAgICAgICBcIlxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdGNlbGxzcGFjaW5nPScwJyBib3JkZXI9JzAnIGFsaWduPSdjZW50ZXInIHdpZHRoPScyNDAnICBzdHlsZT0nYm9yZGVyOiAwcHggbm9uZTtoZWlnaHQ6IGF1dG87JyBjbGFzcz0nZnVsbC13aWR0aCc+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxcdCBcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHQ8dHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdDx0ZCB2YWxpZ249J3RvcCcgc3R5bGU9J3BhZGRpbmc6IDBweDsnPjxpbWcgc3JjPSdodHRwczovL3NmMjYuc2VuZHNmeC5jb20vYWRtaW4vdGVtcC91c2VyLzE3L2RvaWNoYWluXzEwMGgucG5nJyB3aWR0aD0nMjQwJyBoZWlnaHQ9JzMwJyBhbHQ9XFxcIlxcXCIgYm9yZGVyPScwJyBzdHlsZT0nZGlzcGxheTogYmxvY2s7d2lkdGg6IDEwMCU7aGVpZ2h0OiBhdXRvOycgY2xhc3M9J2Z1bGwtd2lkdGggaW1nMjQweDMwJyAvPjwvdGQ+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxcdCBcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHQ8L3RyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdDwvdGFibGU+XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXG5cIiArXG4gICAgICAgICAgICBcIlxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdDwvdGQ+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgXFx0XFx0ICBcXHRcXHRcXHRcXHQ8L3RyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgIFxcdFxcdFxcdFxcdFxcdDwvdGFibGU+XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHQgXFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHQgXFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgPHRhYmxlIGNlbGxwYWRkaW5nPScwJyBjZWxsc3BhY2luZz0nMCcgYm9yZGVyPScwJyB3aWR0aD0nMTAwJScgYmdjb2xvcj0nIzAwNzFhYScgc3R5bGU9J2JvcmRlcjogMHB4IG5vbmU7YmFja2dyb3VuZC1jb2xvcjogIzAwNzFhYTtiYWNrZ3JvdW5kLWltYWdlOiB1cmwoJ2h0dHBzOi8vc2YyNi5zZW5kc2Z4LmNvbS9hZG1pbi90ZW1wL3VzZXIvMTcvYmx1ZS1iZy5qcGcnKTtiYWNrZ3JvdW5kLXJlcGVhdDogbm8tcmVwZWF0IDtiYWNrZ3JvdW5kLXBvc2l0aW9uOiBjZW50ZXI7Jz5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIHZhbGlnbj0ndG9wJyBzdHlsZT0ncGFkZGluZy10b3A6IDQwcHg7cGFkZGluZy1yaWdodDogMjBweDtwYWRkaW5nLWJvdHRvbTogNDVweDtwYWRkaW5nLWxlZnQ6IDIwcHg7Jz48dGFibGUgY2VsbHBhZGRpbmc9JzAnIGNlbGxzcGFjaW5nPScwJyB3aWR0aD0nMTAwJSc+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBzdHlsZT0ncGFkZGluZzogMHB4OycgY2xhc3M9J3BhdHRlcm4nPjx0YWJsZSBjZWxscGFkZGluZz0nMCcgY2VsbHNwYWNpbmc9JzAnIGJvcmRlcj0nMCcgd2lkdGg9JzEwMCUnPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgdmFsaWduPSd0b3AnIHN0eWxlPSdwYWRkaW5nLWJvdHRvbTogMTBweDsnPjxkaXYgc3R5bGU9J3RleHQtYWxpZ246IGxlZnQ7Zm9udC1mYW1pbHk6IGFyaWFsO2ZvbnQtc2l6ZTogMjBweDtjb2xvcjogI2ZmZmZmZjtsaW5lLWhlaWdodDogMzBweDttc28tbGluZS1oZWlnaHQ6IGV4YWN0bHk7bXNvLXRleHQtcmFpc2U6IDVweDsnPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHBcXG5cIiArXG4gICAgICAgICAgICBcInN0eWxlPSdwYWRkaW5nOiAwOyBtYXJnaW46IDA7dGV4dC1hbGlnbjogY2VudGVyOyc+Qml0dGUgYmVzdMOkdGlnZW4gU2llIElocmUgQW5tZWxkdW5nPC9wPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PjwvdGQ+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGFibGU+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRhYmxlIGNlbGxwYWRkaW5nPScwJyBjZWxsc3BhY2luZz0nMCcgYm9yZGVyPScwJyB3aWR0aD0nMTAwJSc+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCB2YWxpZ249J3RvcCcgc3R5bGU9J3BhZGRpbmc6IDA7bXNvLWNlbGxzcGFjaW5nOiAwaW47Jz48dGFibGUgY2VsbHBhZGRpbmc9JzAnIGNlbGxzcGFjaW5nPScwJyBib3JkZXI9JzAnIGFsaWduPSdsZWZ0JyB3aWR0aD0nMTEyJyAgc3R5bGU9J2Zsb2F0OiBsZWZ0OycgY2xhc3M9J2MxMTJwMjByJz5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIHZhbGlnbj0ndG9wJyBzdHlsZT0ncGFkZGluZzogMHB4Oyc+PHRhYmxlIGNlbGxwYWRkaW5nPScwJyBjZWxsc3BhY2luZz0nMCcgYm9yZGVyPScwJyB3aWR0aD0nMTAwJScgc3R5bGU9J2JvcmRlcjogMHB4IG5vbmU7JyBjbGFzcz0naGlkZSc+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCB2YWxpZ249J3RvcCcgc3R5bGU9J3BhZGRpbmc6IDBweDsnPjx0YWJsZSBjZWxscGFkZGluZz0nMCcgY2VsbHNwYWNpbmc9JzAnIHdpZHRoPScxMDAlJz5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIHN0eWxlPSdwYWRkaW5nOiAwcHg7Jz48dGFibGUgY2VsbHBhZGRpbmc9JzAnIGNlbGxzcGFjaW5nPScwJyB3aWR0aD0nMTAwJSc+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBhbGlnbj0nY2VudGVyJyBzdHlsZT0ncGFkZGluZzogMHB4Oyc+PHRhYmxlIGNlbGxwYWRkaW5nPScwJyBjZWxsc3BhY2luZz0nMCcgYm9yZGVyPScwJyBhbGlnbj0nY2VudGVyJyB3aWR0aD0nMjAnICBzdHlsZT0nYm9yZGVyOiAwcHggbm9uZTtoZWlnaHQ6IGF1dG87Jz5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIHZhbGlnbj0ndG9wJyBzdHlsZT0ncGFkZGluZzogMHB4Oyc+PGltZ1xcblwiICtcbiAgICAgICAgICAgIFwic3JjPSdodHRwczovL3NmMjYuc2VuZHNmeC5jb20vYWRtaW4vdGVtcC91c2VyLzE3L2ltZ184OTgzNzMxOC5wbmcnIHdpZHRoPScyMCcgaGVpZ2h0PScyMCcgYWx0PVxcXCJcXFwiIGJvcmRlcj0nMCcgc3R5bGU9J2Rpc3BsYXk6IGJsb2NrOycgY2xhc3M9J2ltZzIweDIwJyAvPjwvdGQ+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGFibGU+PC90ZD5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90YWJsZT48L3RkPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RhYmxlPjwvdGQ+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGFibGU+PC90ZD5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90YWJsZT5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8IS0tW2lmIGd0ZSBtc28gOV0+PC90ZD48dGQgdmFsaWduPSd0b3AnIHN0eWxlPSdwYWRkaW5nOjA7Jz48IVtlbmRpZl0tLT5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGFibGUgY2VsbHBhZGRpbmc9JzAnIGNlbGxzcGFjaW5nPScwJyBib3JkZXI9JzAnIGFsaWduPSdsZWZ0JyB3aWR0aD0nMzM2JyAgc3R5bGU9J2Zsb2F0OiBsZWZ0OycgY2xhc3M9J2MzMzZwNjByJz5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIHZhbGlnbj0ndG9wJyBzdHlsZT0ncGFkZGluZzogMHB4Oyc+PHRhYmxlIGNlbGxwYWRkaW5nPScwJyBjZWxsc3BhY2luZz0nMCcgYm9yZGVyPScwJyB3aWR0aD0nMTAwJSc+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCB2YWxpZ249J3RvcCcgc3R5bGU9J3BhZGRpbmctYm90dG9tOiAzMHB4Oyc+PHRhYmxlIGNlbGxwYWRkaW5nPScwJyBjZWxsc3BhY2luZz0nMCcgd2lkdGg9JzEwMCUnPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgc3R5bGU9J3BhZGRpbmc6IDBweDsnPjx0YWJsZSBjZWxscGFkZGluZz0nMCcgY2VsbHNwYWNpbmc9JzAnIGJvcmRlcj0nMCcgd2lkdGg9JzEwMCUnIHN0eWxlPSdib3JkZXItdG9wOiAycHggc29saWQgI2ZmZmZmZjsnPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgdmFsaWduPSd0b3AnPjx0YWJsZSBjZWxscGFkZGluZz0nMCcgY2VsbHNwYWNpbmc9JzAnIHdpZHRoPScxMDAlJz5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIHN0eWxlPSdwYWRkaW5nOiAwcHg7Jz48L3RkPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RhYmxlPjwvdGQ+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGFibGU+PC90ZD5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90YWJsZT48L3RkPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RhYmxlPjwvdGQ+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGFibGU+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPCEtLVtpZiBndGUgbXNvIDldPjwvdGQ+PHRkIHZhbGlnbj0ndG9wJyBzdHlsZT0ncGFkZGluZzowOyc+PCFbZW5kaWZdLS0+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRhYmxlIGNlbGxwYWRkaW5nPScwJyBjZWxsc3BhY2luZz0nMCcgYm9yZGVyPScwJyBhbGlnbj0nbGVmdCcgd2lkdGg9JzExMicgIHN0eWxlPSdmbG9hdDogbGVmdDsnIGNsYXNzPSdjMTEycDIwcic+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCB2YWxpZ249J3RvcCcgc3R5bGU9J3BhZGRpbmc6IDBweDsnPjx0YWJsZSBjZWxscGFkZGluZz0nMCcgY2VsbHNwYWNpbmc9JzAnIGJvcmRlcj0nMCcgd2lkdGg9JzEwMCUnIHN0eWxlPSdib3JkZXI6IDBweCBub25lOycgY2xhc3M9J2hpZGUnPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgdmFsaWduPSd0b3AnIHN0eWxlPSdwYWRkaW5nOiAwcHg7Jz48dGFibGUgY2VsbHBhZGRpbmc9JzAnIGNlbGxzcGFjaW5nPScwJyB3aWR0aD0nMTAwJSc+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBzdHlsZT0ncGFkZGluZzogMHB4Oyc+PHRhYmxlIGNlbGxwYWRkaW5nPScwJyBjZWxsc3BhY2luZz0nMCcgd2lkdGg9JzEwMCUnPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgYWxpZ249J2NlbnRlcicgc3R5bGU9J3BhZGRpbmc6IDBweDsnPjx0YWJsZSBjZWxscGFkZGluZz0nMCcgY2VsbHNwYWNpbmc9JzAnIGJvcmRlcj0nMCcgYWxpZ249J2NlbnRlcicgd2lkdGg9JzIwJyAgc3R5bGU9J2JvcmRlcjogMHB4IG5vbmU7aGVpZ2h0OiBhdXRvOyc+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCB2YWxpZ249J3RvcCcgc3R5bGU9J3BhZGRpbmc6IDBweDsnPjxpbWcgc3JjPSdodHRwczovL3NmMjYuc2VuZHNmeC5jb20vYWRtaW4vdGVtcC91c2VyLzE3L2ltZ184OTgzNzMxOC5wbmcnIHdpZHRoPScyMCcgaGVpZ2h0PScyMCcgYWx0PVxcXCJcXFwiIGJvcmRlcj0nMCcgc3R5bGU9J2Rpc3BsYXk6IGJsb2NrOycgY2xhc3M9J2ltZzIweDIwJ1xcblwiICtcbiAgICAgICAgICAgIFwiLz48L3RkPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RhYmxlPjwvdGQ+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGFibGU+PC90ZD5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90YWJsZT48L3RkPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RhYmxlPjwvdGQ+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGFibGU+PC90ZD5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90YWJsZT5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGFibGUgY2VsbHBhZGRpbmc9JzAnIGNlbGxzcGFjaW5nPScwJyBib3JkZXI9JzAnIHdpZHRoPScxMDAlJz5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIHZhbGlnbj0ndG9wJyBzdHlsZT0ncGFkZGluZy1ib3R0b206IDIwcHg7Jz48ZGl2IHN0eWxlPSd0ZXh0LWFsaWduOiBsZWZ0O2ZvbnQtZmFtaWx5OiBhcmlhbDtmb250LXNpemU6IDE2cHg7Y29sb3I6ICNmZmZmZmY7bGluZS1oZWlnaHQ6IDI2cHg7bXNvLWxpbmUtaGVpZ2h0OiBleGFjdGx5O21zby10ZXh0LXJhaXNlOiA1cHg7Jz5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwIHN0eWxlPSdwYWRkaW5nOiAwOyBtYXJnaW46IDA7dGV4dC1hbGlnbjogY2VudGVyOyc+VmllbGVuIERhbmssIGRhc3MgU2llIHNpY2ggZsO8ciB1bnNlcmVuIE5ld3NsZXR0ZXIgYW5nZW1lbGRldCBoYWJlbi48L3A+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cCBzdHlsZT0ncGFkZGluZzogMDsgbWFyZ2luOiAwO3RleHQtYWxpZ246IGNlbnRlcjsnPlVtIGRpZXNlIEUtTWFpbC1BZHJlc3NlIHVuZCBJaHJlIGtvc3Rlbmxvc2UgQW5tZWxkdW5nIHp1IGJlc3TDpHRpZ2VuLCBrbGlja2VuIFNpZSBiaXR0ZSBqZXR6dCBhdWYgZGVuIGZvbGdlbmRlbiBCdXR0b246PC9wPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PjwvdGQ+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGFibGU+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRhYmxlIGNlbGxwYWRkaW5nPScwJyBjZWxsc3BhY2luZz0nMCcgd2lkdGg9JzEwMCUnPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgYWxpZ249J2NlbnRlcicgc3R5bGU9J3BhZGRpbmc6IDBweDsnPjx0YWJsZSBjZWxscGFkZGluZz0nMCcgY2VsbHNwYWNpbmc9JzAnIGJvcmRlcj0nMCcgYWxpZ249J2NlbnRlcicgc3R5bGU9J3RleHQtYWxpZ246IGNlbnRlcjtjb2xvcjogIzAwMDsnIGNsYXNzPSdmdWxsLXdpZHRoJz5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIHZhbGlnbj0ndG9wJyBhbGlnbj0nY2VudGVyJyBzdHlsZT0ncGFkZGluZy1yaWdodDogMTBweDtwYWRkaW5nLWJvdHRvbTogMzBweDtwYWRkaW5nLWxlZnQ6IDEwcHg7Jz48dGFibGUgY2VsbHBhZGRpbmc9JzAnIGNlbGxzcGFjaW5nPScwJyBib3JkZXI9JzAnIGJnY29sb3I9JyM4NWFjMWMnIHN0eWxlPSdib3JkZXI6IDBweCBub25lO2JvcmRlci1yYWRpdXM6IDVweDtib3JkZXItY29sbGFwc2U6IHNlcGFyYXRlICFpbXBvcnRhbnQ7YmFja2dyb3VuZC1jb2xvcjogIzg1YWMxYzsnIGNsYXNzPSdmdWxsLXdpZHRoJz5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIHZhbGlnbj0ndG9wJyBhbGlnbj0nY2VudGVyJyBzdHlsZT0ncGFkZGluZzogMTJweDsnPjxhIGhyZWY9JyR7Y29uZmlybWF0aW9uX3VybH0nIHRhcmdldD0nX2JsYW5rJyBzdHlsZT0ndGV4dC1kZWNvcmF0aW9uOiBub25lOycgY2xhc3M9J2VkbV9idXR0b24nPjxzcGFuIHN0eWxlPSdmb250LWZhbWlseTogYXJpYWw7Zm9udC1zaXplOiAxOHB4O2NvbG9yOiAjZmZmZmZmO2xpbmUtaGVpZ2h0OiAyOHB4O3RleHQtZGVjb3JhdGlvbjogbm9uZTsnPjxzcGFuXFxuXCIgK1xuICAgICAgICAgICAgXCJzdHlsZT0nZm9udC1zaXplOiAxOHB4Oyc+SmV0enQgQW5tZWxkdW5nIGJlc3QmYXVtbDt0aWdlbjwvc3Bhbj48L3NwYW4+IDwvYT48L3RkPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RhYmxlPjwvdGQ+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGFibGU+PC90ZD5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90YWJsZT5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPSd0ZXh0LWFsaWduOiBsZWZ0O2ZvbnQtZmFtaWx5OiBhcmlhbDtmb250LXNpemU6IDEycHg7Y29sb3I6ICNmZmZmZmY7bGluZS1oZWlnaHQ6IDIycHg7bXNvLWxpbmUtaGVpZ2h0OiBleGFjdGx5O21zby10ZXh0LXJhaXNlOiA1cHg7Jz5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwIHN0eWxlPSdwYWRkaW5nOiAwOyBtYXJnaW46IDA7dGV4dC1hbGlnbjogY2VudGVyOyc+V2VubiBTaWUgaWhyZSBFLU1haWwtQWRyZXNzZSBuaWNodCBiZXN0w6R0aWdlbiwga8O2bm5lbiBrZWluZSBOZXdzbGV0dGVyIHp1Z2VzdGVsbHQgd2VyZGVuLiBJaHIgRWludmVyc3TDpG5kbmlzIGvDtm5uZW4gU2llIHNlbGJzdHZlcnN0w6RuZGxpY2ggamVkZXJ6ZWl0IHdpZGVycnVmZW4uIFNvbGx0ZSBlcyBzaWNoIGJlaSBkZXIgQW5tZWxkdW5nIHVtIGVpbiBWZXJzZWhlbiBoYW5kZWxuIG9kZXIgd3VyZGUgZGVyIE5ld3NsZXR0ZXIgbmljaHQgaW4gSWhyZW0gTmFtZW4gYmVzdGVsbHQsIGvDtm5uZW4gU2llIGRpZXNlIEUtTWFpbCBlaW5mYWNoIGlnbm9yaWVyZW4uIElobmVuIHdlcmRlbiBrZWluZSB3ZWl0ZXJlbiBOYWNocmljaHRlbiB6dWdlc2NoaWNrdC48L3A+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+PC90ZD5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90YWJsZT48L3RkPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICA8L3RhYmxlPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgIDx0YWJsZSBjZWxscGFkZGluZz0nMCcgY2VsbHNwYWNpbmc9JzAnIGJvcmRlcj0nMCcgd2lkdGg9JzEwMCUnIGJnY29sb3I9JyNmZmZmZmYnIHN0eWxlPSdib3JkZXI6IDBweCBub25lO2JhY2tncm91bmQtY29sb3I6ICNmZmZmZmY7Jz5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIHZhbGlnbj0ndG9wJyBzdHlsZT0ncGFkZGluZy10b3A6IDMwcHg7cGFkZGluZy1yaWdodDogMjBweDtwYWRkaW5nLWJvdHRvbTogMzVweDtwYWRkaW5nLWxlZnQ6IDIwcHg7Jz48dGFibGUgY2VsbHBhZGRpbmc9JzAnIGNlbGxzcGFjaW5nPScwJyB3aWR0aD0nMTAwJSc+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBzdHlsZT0ncGFkZGluZzogMHB4Oyc+PHRhYmxlIGNlbGxwYWRkaW5nPScwJyBjZWxsc3BhY2luZz0nMCcgYm9yZGVyPScwJyB3aWR0aD0nMTAwJSc+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCB2YWxpZ249J3RvcCcgc3R5bGU9J3BhZGRpbmctYm90dG9tOiAyNXB4Oyc+PGRpdiBzdHlsZT0ndGV4dC1hbGlnbjogbGVmdDtmb250LWZhbWlseTogYXJpYWw7Zm9udC1zaXplOiAxMnB4O2NvbG9yOiAjMzMzMzMzO2xpbmUtaGVpZ2h0OiAyMnB4O21zby1saW5lLWhlaWdodDogZXhhY3RseTttc28tdGV4dC1yYWlzZTogNXB4Oyc+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cCBzdHlsZT0ncGFkZGluZzogMDsgbWFyZ2luOiAwO3RleHQtYWxpZ246IGNlbnRlcjsnPjxzcGFuIHN0eWxlPSdsaW5lLWhlaWdodDogMzsnPjxzdHJvbmc+S29udGFrdDwvc3Ryb25nPjwvc3Bhbj48YnI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlcnZpY2VAc2VuZGVmZmVjdC5kZTxicj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd3d3LnNlbmRlZmZlY3QuZGU8YnI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRlbGVmb246ICs0OSAoMCkgODU3MSAtIDk3IDM5IC0gNjktMDwvcD5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj48L3RkPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RhYmxlPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9J3RleHQtYWxpZ246IGxlZnQ7Zm9udC1mYW1pbHk6IGFyaWFsO2ZvbnQtc2l6ZTogMTJweDtjb2xvcjogIzMzMzMzMztsaW5lLWhlaWdodDogMjJweDttc28tbGluZS1oZWlnaHQ6IGV4YWN0bHk7bXNvLXRleHQtcmFpc2U6IDVweDsnPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHAgc3R5bGU9J3BhZGRpbmc6IDA7IG1hcmdpbjogMDt0ZXh0LWFsaWduOiBjZW50ZXI7Jz48c3BhbiBzdHlsZT0nbGluZS1oZWlnaHQ6IDM7Jz48c3Ryb25nPkltcHJlc3N1bTwvc3Ryb25nPjwvc3Bhbj48YnI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFuc2NocmlmdDogU2NodWxnYXNzZSA1LCBELTg0MzU5IFNpbWJhY2ggYW0gSW5uLCBlTWFpbDogc2VydmljZUBzZW5kZWZmZWN0LmRlPGJyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBCZXRyZWliZXI6IFdFQmFuaXplciBBRywgUmVnaXN0ZXJnZXJpY2h0OiBBbXRzZ2VyaWNodCBMYW5kc2h1dCBIUkIgNTE3NywgVXN0SWQuOiBERSAyMDY4IDYyIDA3MDxicj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVm9yc3RhbmQ6IE90dG1hciBOZXVidXJnZXIsIEF1ZnNpY2h0c3JhdDogVG9iaWFzIE5ldWJ1cmdlcjwvcD5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj48L3RkPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RhYmxlPjwvdGQ+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgIDwvdGFibGU+PC90ZD5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgIDwvdHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgPC90YWJsZT48L3RkPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgPC90cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICA8L3RhYmxlPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICA8L2Rpdj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgPCEtLSBjb250ZW50IGVuZCAtLT5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgIDwvY2VudGVyPjwvdGQ+XFxuXCIgK1xuICAgICAgICAgICAgXCIgIDwvdHI+XFxuXCIgK1xuICAgICAgICAgICAgXCI8L3RhYmxlPlwiXG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7XCJzdGF0dXNcIjogXCJzdWNjZXNzXCIsIFwiZGF0YVwiOiBkYXRhfTtcbiAgICB9XG4gIH1cbn0pO1xuIiwiaW1wb3J0IHsgQXBpLCBET0lfRkVUQ0hfUk9VVEUsIERPSV9DT05GSVJNQVRJT05fTk9USUZZX1JPVVRFIH0gZnJvbSAnLi4vcmVzdC5qcyc7XG5pbXBvcnQgYWRkT3B0SW4gZnJvbSAnLi4vLi4vLi4vLi4vaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9vcHQtaW5zL2FkZF9hbmRfd3JpdGVfdG9fYmxvY2tjaGFpbi5qcyc7XG5pbXBvcnQgdXBkYXRlT3B0SW5TdGF0dXMgZnJvbSAnLi4vLi4vLi4vLi4vaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9vcHQtaW5zL3VwZGF0ZV9zdGF0dXMuanMnO1xuaW1wb3J0IGdldERvaU1haWxEYXRhIGZyb20gJy4uLy4uLy4uLy4uL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvZGFwcHMvZ2V0X2RvaS1tYWlsLWRhdGEuanMnO1xuaW1wb3J0IHtsb2dFcnJvciwgbG9nU2VuZH0gZnJvbSBcIi4uLy4uLy4uLy4uL2ltcG9ydHMvc3RhcnR1cC9zZXJ2ZXIvbG9nLWNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7RE9JX0VYUE9SVF9ST1VURX0gZnJvbSBcIi4uL3Jlc3RcIjtcbmltcG9ydCBleHBvcnREb2lzIGZyb20gXCIuLi8uLi8uLi8uLi9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2RhcHBzL2V4cG9ydF9kb2lzXCI7XG5pbXBvcnQge09wdEluc30gZnJvbSBcIi4uLy4uLy4uLy4uL2ltcG9ydHMvYXBpL29wdC1pbnMvb3B0LWluc1wiO1xuaW1wb3J0IHtSb2xlc30gZnJvbSBcIm1ldGVvci9hbGFubmluZzpyb2xlc1wiO1xuXG4vL2Rva3Ugb2YgbWV0ZW9yLXJlc3RpdnVzIGh0dHBzOi8vZ2l0aHViLmNvbS9rYWhtYWxpL21ldGVvci1yZXN0aXZ1c1xuXG5BcGkuYWRkUm91dGUoRE9JX0NPTkZJUk1BVElPTl9OT1RJRllfUk9VVEUsIHtcbiAgcG9zdDoge1xuICAgIGF1dGhSZXF1aXJlZDogdHJ1ZSxcbiAgICAvL3JvbGVSZXF1aXJlZDogWydhZG1pbiddLFxuICAgIGFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBxUGFyYW1zID0gdGhpcy5xdWVyeVBhcmFtcztcbiAgICAgIGNvbnN0IGJQYXJhbXMgPSB0aGlzLmJvZHlQYXJhbXM7XG4gICAgICBsZXQgcGFyYW1zID0ge31cbiAgICAgIGlmKHFQYXJhbXMgIT09IHVuZGVmaW5lZCkgcGFyYW1zID0gey4uLnFQYXJhbXN9XG4gICAgICBpZihiUGFyYW1zICE9PSB1bmRlZmluZWQpIHBhcmFtcyA9IHsuLi5wYXJhbXMsIC4uLmJQYXJhbXN9XG5cbiAgICAgIGNvbnN0IHVpZCA9IHRoaXMudXNlcklkO1xuXG4gICAgICBpZighUm9sZXMudXNlcklzSW5Sb2xlKHVpZCwgJ2FkbWluJykgfHwgLy9pZiBpdHMgbm90IGFuIGFkbWluIGFsd2F5cyB1c2UgdWlkIGFzIG93bmVySWRcbiAgICAgICAgICAoUm9sZXMudXNlcklzSW5Sb2xlKHVpZCwgJ2FkbWluJykgJiYgKHBhcmFtc1tcIm93bmVySWRcIl09PW51bGwgfHwgcGFyYW1zW1wib3duZXJJZFwiXT09dW5kZWZpbmVkKSkpIHsgIC8vaWYgaXRzIGFuIGFkbWluIG9ubHkgdXNlIHVpZCBpbiBjYXNlIG5vIG93bmVySWQgd2FzIGdpdmVuXG4gICAgICAgICAgcGFyYW1zW1wib3duZXJJZFwiXSA9IHVpZDtcbiAgICAgIH1cblxuICAgICAgbG9nU2VuZCgncGFyYW1ldGVyIHJlY2VpdmVkIGZyb20gYnJvd3NlcjonLHBhcmFtcyk7XG4gICAgICBpZihwYXJhbXMuc2VuZGVyX21haWwuY29uc3RydWN0b3IgPT09IEFycmF5KXsgLy90aGlzIGlzIGEgU09JIHdpdGggY28tc3BvbnNvcnMgZmlyc3QgZW1haWwgaXMgbWFpbiBzcG9uc29yXG4gICAgICAgICAgcmV0dXJuIHByZXBhcmVDb0RPSShwYXJhbXMpO1xuICAgICAgfWVsc2V7XG4gICAgICAgICByZXR1cm4gcHJlcGFyZUFkZChwYXJhbXMpO1xuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgcHV0OiB7XG4gICAgYXV0aFJlcXVpcmVkOiBmYWxzZSxcbiAgICBhY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgcVBhcmFtcyA9IHRoaXMucXVlcnlQYXJhbXM7XG4gICAgICBjb25zdCBiUGFyYW1zID0gdGhpcy5ib2R5UGFyYW1zO1xuXG4gICAgICBsb2dTZW5kKCdxUGFyYW1zOicscVBhcmFtcyk7XG4gICAgICBsb2dTZW5kKCdiUGFyYW1zOicsYlBhcmFtcyk7XG5cbiAgICAgIGxldCBwYXJhbXMgPSB7fVxuICAgICAgaWYocVBhcmFtcyAhPT0gdW5kZWZpbmVkKSBwYXJhbXMgPSB7Li4ucVBhcmFtc31cbiAgICAgIGlmKGJQYXJhbXMgIT09IHVuZGVmaW5lZCkgcGFyYW1zID0gey4uLnBhcmFtcywgLi4uYlBhcmFtc31cbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHZhbCA9IHVwZGF0ZU9wdEluU3RhdHVzKHBhcmFtcyk7XG4gICAgICAgIGxvZ1NlbmQoJ29wdC1JbiBzdGF0dXMgdXBkYXRlZCcsdmFsKTtcbiAgICAgICAgcmV0dXJuIHtzdGF0dXM6ICdzdWNjZXNzJywgZGF0YToge21lc3NhZ2U6ICdPcHQtSW4gc3RhdHVzIHVwZGF0ZWQnfX07XG4gICAgICB9IGNhdGNoKGVycm9yKSB7XG4gICAgICAgIHJldHVybiB7c3RhdHVzQ29kZTogNTAwLCBib2R5OiB7c3RhdHVzOiAnZmFpbCcsIG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2V9fTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn0pO1xuXG5BcGkuYWRkUm91dGUoRE9JX0ZFVENIX1JPVVRFLCB7YXV0aFJlcXVpcmVkOiBmYWxzZX0sIHtcbiAgZ2V0OiB7XG4gICAgYWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IHBhcmFtcyA9IHRoaXMucXVlcnlQYXJhbXM7XG4gICAgICB0cnkge1xuICAgICAgICAgIGxvZ1NlbmQoJ3Jlc3QgYXBpIC0gRE9JX0ZFVENIX1JPVVRFIGNhbGxlZCBieSBib2IgdG8gcmVxdWVzdCBlbWFpbCB0ZW1wbGF0ZScsSlNPTi5zdHJpbmdpZnkocGFyYW1zKSk7XG4gICAgICAgICAgY29uc3QgZGF0YSA9IGdldERvaU1haWxEYXRhKHBhcmFtcyk7XG4gICAgICAgICAgbG9nU2VuZCgnZ290IGRvaS1tYWlsLWRhdGEgKGluY2x1ZGluZyB0ZW1wbGFsdGUpIHJldHVybmluZyB0byBib2InLHtzdWJqZWN0OmRhdGEuc3ViamVjdCwgcmVjaXBpZW50OmRhdGEucmVjaXBpZW50fSk7XG4gICAgICAgIHJldHVybiB7c3RhdHVzOiAnc3VjY2VzcycsIGRhdGF9O1xuICAgICAgfSBjYXRjaChlcnJvcikge1xuICAgICAgICBsb2dFcnJvcignZXJyb3Igd2hpbGUgZ2V0dGluZyBEb2lNYWlsRGF0YScsZXJyb3IpO1xuICAgICAgICByZXR1cm4ge3N0YXR1czogJ2ZhaWwnLCBlcnJvcjogZXJyb3IubWVzc2FnZX07XG4gICAgICB9XG4gICAgfVxuICB9XG59KTtcblxuQXBpLmFkZFJvdXRlKERPSV9FWFBPUlRfUk9VVEUsIHtcbiAgICBnZXQ6IHtcbiAgICAgICAgYXV0aFJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAvL3JvbGVSZXF1aXJlZDogWydhZG1pbiddLFxuICAgICAgICBhY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgbGV0IHBhcmFtcyA9IHRoaXMucXVlcnlQYXJhbXM7XG4gICAgICAgICAgICBjb25zdCB1aWQgPSB0aGlzLnVzZXJJZDtcbiAgICAgICAgICAgIGlmKCFSb2xlcy51c2VySXNJblJvbGUodWlkLCAnYWRtaW4nKSl7XG4gICAgICAgICAgICAgICAgcGFyYW1zID0ge3VzZXJpZDp1aWQscm9sZTondXNlcid9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICBwYXJhbXMgPSB7Li4ucGFyYW1zLHJvbGU6J2FkbWluJ31cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgbG9nU2VuZCgncmVzdCBhcGkgLSBET0lfRVhQT1JUX1JPVVRFIGNhbGxlZCcsSlNPTi5zdHJpbmdpZnkocGFyYW1zKSk7XG4gICAgICAgICAgICAgICAgY29uc3QgZGF0YSA9IGV4cG9ydERvaXMocGFyYW1zKTtcbiAgICAgICAgICAgICAgICBsb2dTZW5kKCdnb3QgZG9pcyBmcm9tIGRhdGFiYXNlJyxKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtzdGF0dXM6ICdzdWNjZXNzJywgZGF0YX07XG4gICAgICAgICAgICB9IGNhdGNoKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgbG9nRXJyb3IoJ2Vycm9yIHdoaWxlIGV4cG9ydGluZyBjb25maXJtZWQgZG9pcycsZXJyb3IpO1xuICAgICAgICAgICAgICAgIHJldHVybiB7c3RhdHVzOiAnZmFpbCcsIGVycm9yOiBlcnJvci5tZXNzYWdlfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn0pO1xuXG5mdW5jdGlvbiBwcmVwYXJlQ29ET0kocGFyYW1zKXtcblxuICAgIGxvZ1NlbmQoJ2lzIGFycmF5ICcscGFyYW1zLnNlbmRlcl9tYWlsKTtcblxuICAgIGNvbnN0IHNlbmRlcnMgPSBwYXJhbXMuc2VuZGVyX21haWw7XG4gICAgY29uc3QgcmVjaXBpZW50X21haWwgPSBwYXJhbXMucmVjaXBpZW50X21haWw7XG4gICAgY29uc3QgZGF0YSA9IHBhcmFtcy5kYXRhO1xuICAgIGNvbnN0IG93bmVySUQgPSBwYXJhbXMub3duZXJJZDtcblxuICAgIGxldCBjdXJyZW50T3B0SW5JZDtcbiAgICBsZXQgcmV0UmVzcG9uc2UgPSBbXTtcbiAgICBsZXQgbWFzdGVyX2RvaTtcbiAgICBzZW5kZXJzLmZvckVhY2goKHNlbmRlcixpbmRleCkgPT4ge1xuXG4gICAgICAgIGNvbnN0IHJldF9yZXNwb25zZSA9IHByZXBhcmVBZGQoe3NlbmRlcl9tYWlsOnNlbmRlcixyZWNpcGllbnRfbWFpbDpyZWNpcGllbnRfbWFpbCxkYXRhOmRhdGEsIG1hc3Rlcl9kb2k6bWFzdGVyX2RvaSwgaW5kZXg6IGluZGV4LCBvd25lcklkOm93bmVySUR9KTtcbiAgICAgICAgbG9nU2VuZCgnQ29ET0k6JyxyZXRfcmVzcG9uc2UpO1xuICAgICAgICBpZihyZXRfcmVzcG9uc2Uuc3RhdHVzID09PSB1bmRlZmluZWQgfHwgcmV0X3Jlc3BvbnNlLnN0YXR1cz09PVwiZmFpbGVkXCIpIHRocm93IFwiY291bGQgbm90IGFkZCBjby1vcHQtaW5cIjtcbiAgICAgICAgcmV0UmVzcG9uc2UucHVzaChyZXRfcmVzcG9uc2UpO1xuICAgICAgICBjdXJyZW50T3B0SW5JZCA9IHJldF9yZXNwb25zZS5kYXRhLmlkO1xuXG4gICAgICAgIGlmKGluZGV4PT09MClcbiAgICAgICAge1xuICAgICAgICAgICAgbG9nU2VuZCgnbWFpbiBzcG9uc29yIG9wdEluSWQ6JyxjdXJyZW50T3B0SW5JZCk7XG4gICAgICAgICAgICBjb25zdCBvcHRJbiA9IE9wdElucy5maW5kT25lKHtfaWQ6IGN1cnJlbnRPcHRJbklkfSk7XG4gICAgICAgICAgICBtYXN0ZXJfZG9pID0gb3B0SW4ubmFtZUlkO1xuICAgICAgICAgICAgbG9nU2VuZCgnbWFpbiBzcG9uc29yIG5hbWVJZDonLG1hc3Rlcl9kb2kpO1xuICAgICAgICB9XG5cbiAgICB9KTtcblxuICAgIGxvZ1NlbmQocmV0UmVzcG9uc2UpO1xuXG4gICAgcmV0dXJuIHJldFJlc3BvbnNlO1xufVxuXG5mdW5jdGlvbiBwcmVwYXJlQWRkKHBhcmFtcyl7XG5cbiAgICB0cnkge1xuICAgICAgICBjb25zdCB2YWwgPSBhZGRPcHRJbihwYXJhbXMpO1xuICAgICAgICBsb2dTZW5kKCdvcHQtSW4gYWRkZWQgSUQ6Jyx2YWwpO1xuICAgICAgICByZXR1cm4ge3N0YXR1czogJ3N1Y2Nlc3MnLCBkYXRhOiB7aWQ6IHZhbCwgc3RhdHVzOiAnc3VjY2VzcycsIG1lc3NhZ2U6ICdPcHQtSW4gYWRkZWQuJ319O1xuICAgIH0gY2F0Y2goZXJyb3IpIHtcbiAgICAgICAgcmV0dXJuIHtzdGF0dXNDb2RlOiA1MDAsIGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogZXJyb3IubWVzc2FnZX19O1xuICAgIH1cbn0iLCJpbXBvcnQgeyBBcGkgfSBmcm9tICcuLi9yZXN0LmpzJztcbmltcG9ydCB7Z2V0SW5mb30gZnJvbSBcIi4uLy4uL2RvaWNoYWluXCI7XG5pbXBvcnQgeyBDT05GSVJNX0NMSUVOVCxTRU5EX0NMSUVOVH0gZnJvbSBcIi4uLy4uLy4uLy4uL2ltcG9ydHMvc3RhcnR1cC9zZXJ2ZXIvZG9pY2hhaW4tY29uZmlndXJhdGlvblwiO1xuXG5BcGkuYWRkUm91dGUoJ3N0YXR1cycsIHthdXRoUmVxdWlyZWQ6IGZhbHNlfSwge1xuICBnZXQ6IHtcbiAgICBhY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgZGF0YSA9IGdldEluZm8oU0VORF9DTElFTlQ/U0VORF9DTElFTlQ6Q09ORklSTV9DTElFTlQpO1xuICAgICAgICByZXR1cm4ge1wic3RhdHVzXCI6IFwic3VjY2Vzc1wiLCBcImRhdGFcIjpkYXRhfTtcbiAgICAgIH1jYXRjaChleCl7XG4gICAgICAgICAgICByZXR1cm4ge1wic3RhdHVzXCI6IFwiZmFpbGVkXCIsIFwiZGF0YVwiOiBleC50b1N0cmluZygpfTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn0pO1xuIiwiaW1wb3J0IHsgQXBpIH0gZnJvbSAnLi4vcmVzdC5qcyc7XG5pbXBvcnQge01ldGVvcn0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQge0FjY291bnRzfSBmcm9tICdtZXRlb3IvYWNjb3VudHMtYmFzZSdcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcbmltcG9ydCB7Um9sZXN9IGZyb20gXCJtZXRlb3IvYWxhbm5pbmc6cm9sZXNcIjtcbmltcG9ydCB7bG9nTWFpbn0gZnJvbSBcIi4uLy4uLy4uLy4uL2ltcG9ydHMvc3RhcnR1cC9zZXJ2ZXIvbG9nLWNvbmZpZ3VyYXRpb25cIjtcblxuY29uc3QgbWFpbFRlbXBsYXRlU2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gICAgc3ViamVjdDoge1xuICAgICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICAgIG9wdGlvbmFsOnRydWUgXG4gICAgfSxcbiAgICByZWRpcmVjdDoge1xuICAgICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICAgIHJlZ0V4OiBcIkAoaHR0cHM/fGZ0cCk6Ly8oLVxcXFwuKT8oW15cXFxccy8/XFxcXC4jLV0rXFxcXC4/KSsoL1teXFxcXHNdKik/JEBcIixcbiAgICAgICAgb3B0aW9uYWw6dHJ1ZSBcbiAgICB9LFxuICAgIHJldHVyblBhdGg6IHtcbiAgICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgICByZWdFeDogU2ltcGxlU2NoZW1hLlJlZ0V4LkVtYWlsLFxuICAgICAgICBvcHRpb25hbDp0cnVlIFxuICAgIH0sXG4gICAgdGVtcGxhdGVVUkw6e1xuICAgICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICAgIHJlZ0V4OiBcIkAoaHR0cHM/fGZ0cCk6Ly8oLVxcXFwuKT8oW15cXFxccy8/XFxcXC4jLV0rXFxcXC4/KSsoL1teXFxcXHNdKik/JEBcIixcbiAgICAgICAgb3B0aW9uYWw6dHJ1ZSBcbiAgICB9XG59KTtcblxuY29uc3QgY3JlYXRlVXNlclNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICAgIHVzZXJuYW1lOiB7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICByZWdFeDogXCJeW0EtWixhLXosMC05LCEsXywkLCNdezQsMjR9JFwiICAvL09ubHkgdXNlcm5hbWVzIGJldHdlZW4gNC0yNCBjaGFyYWN0ZXJzIGZyb20gQS1aLGEteiwwLTksISxfLCQsIyBhbGxvd2VkXG4gICAgfSxcbiAgICBlbWFpbDoge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgcmVnRXg6IFNpbXBsZVNjaGVtYS5SZWdFeC5FbWFpbFxuICAgIH0sXG4gICAgcGFzc3dvcmQ6IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIHJlZ0V4OiBcIl5bQS1aLGEteiwwLTksISxfLCQsI117OCwyNH0kXCIgLy9Pbmx5IHBhc3N3b3JkcyBiZXR3ZWVuIDgtMjQgY2hhcmFjdGVycyBmcm9tIEEtWixhLXosMC05LCEsXywkLCMgYWxsb3dlZFxuICAgIH0sXG4gICAgbWFpbFRlbXBsYXRlOntcbiAgICAgICAgdHlwZTogbWFpbFRlbXBsYXRlU2NoZW1hLFxuICAgICAgICBvcHRpb25hbDp0cnVlIFxuICAgIH1cbiAgfSk7XG4gIGNvbnN0IHVwZGF0ZVVzZXJTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgICBtYWlsVGVtcGxhdGU6e1xuICAgICAgICB0eXBlOiBtYWlsVGVtcGxhdGVTY2hlbWFcbiAgICB9XG59KTtcblxuLy9UT0RPOiBjb2xsZWN0aW9uIG9wdGlvbnMgc2VwYXJhdGVcbmNvbnN0IGNvbGxlY3Rpb25PcHRpb25zID1cbiAge1xuICAgIHBhdGg6XCJ1c2Vyc1wiLFxuICAgIHJvdXRlT3B0aW9uczpcbiAgICB7XG4gICAgICAgIGF1dGhSZXF1aXJlZCA6IHRydWVcbiAgICAgICAgLy8scm9sZVJlcXVpcmVkIDogXCJhZG1pblwiXG4gICAgfSxcbiAgICBleGNsdWRlZEVuZHBvaW50czogWydwYXRjaCcsJ2RlbGV0ZUFsbCddLFxuICAgIGVuZHBvaW50czpcbiAgICB7XG4gICAgICAgIGRlbGV0ZTp7cm9sZVJlcXVpcmVkIDogXCJhZG1pblwifSxcbiAgICAgICAgcG9zdDpcbiAgICAgICAge1xuICAgICAgICAgICAgcm9sZVJlcXVpcmVkIDogXCJhZG1pblwiLFxuICAgICAgICAgICAgYWN0aW9uOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIGNvbnN0IHFQYXJhbXMgPSB0aGlzLnF1ZXJ5UGFyYW1zO1xuICAgICAgICAgICAgICAgIGNvbnN0IGJQYXJhbXMgPSB0aGlzLmJvZHlQYXJhbXM7XG4gICAgICAgICAgICAgICAgbGV0IHBhcmFtcyA9IHt9O1xuICAgICAgICAgICAgICAgIGlmKHFQYXJhbXMgIT09IHVuZGVmaW5lZCkgcGFyYW1zID0gey4uLnFQYXJhbXN9XG4gICAgICAgICAgICAgICAgaWYoYlBhcmFtcyAhPT0gdW5kZWZpbmVkKSBwYXJhbXMgPSB7Li4ucGFyYW1zLCAuLi5iUGFyYW1zfVxuICAgICAgICAgICAgICAgIHRyeXtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHVzZXJJZDtcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlVXNlclNjaGVtYS52YWxpZGF0ZShwYXJhbXMpO1xuICAgICAgICAgICAgICAgICAgICBsb2dNYWluKCd2YWxpZGF0ZWQnLHBhcmFtcyk7XG4gICAgICAgICAgICAgICAgICAgIGlmKHBhcmFtcy5tYWlsVGVtcGxhdGUgIT09IHVuZGVmaW5lZCl7XG4gICAgICAgICAgICAgICAgICAgICAgICB1c2VySWQgPSBBY2NvdW50cy5jcmVhdGVVc2VyKHt1c2VybmFtZTpwYXJhbXMudXNlcm5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW1haWw6cGFyYW1zLmVtYWlsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhc3N3b3JkOnBhcmFtcy5wYXNzd29yZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9maWxlOnttYWlsVGVtcGxhdGU6cGFyYW1zLm1haWxUZW1wbGF0ZX19KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgICAgICAgICAgdXNlcklkID0gQWNjb3VudHMuY3JlYXRlVXNlcih7dXNlcm5hbWU6cGFyYW1zLnVzZXJuYW1lLGVtYWlsOnBhcmFtcy5lbWFpbCxwYXNzd29yZDpwYXJhbXMucGFzc3dvcmQsIHByb2ZpbGU6e319KTtcbiAgICAgICAgICAgICAgICAgICAgfSAgICBcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtzdGF0dXM6ICdzdWNjZXNzJywgZGF0YToge3VzZXJpZDogdXNlcklkfX07XG4gICAgICAgICAgICAgICAgfSBjYXRjaChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIHtzdGF0dXNDb2RlOiA0MDAsIGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogZXJyb3IubWVzc2FnZX19O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgcHV0OlxuICAgICAgICB7XG4gICAgICAgICAgICBhY3Rpb246IGZ1bmN0aW9uKCl7ICAgICAgXG4gICAgICAgICAgICAgICAgY29uc3QgcVBhcmFtcyA9IHRoaXMucXVlcnlQYXJhbXM7XG4gICAgICAgICAgICAgICAgY29uc3QgYlBhcmFtcyA9IHRoaXMuYm9keVBhcmFtcztcbiAgICAgICAgICAgICAgICBsZXQgcGFyYW1zID0ge307XG4gICAgICAgICAgICAgICAgbGV0IHVpZD10aGlzLnVzZXJJZDtcbiAgICAgICAgICAgICAgICBjb25zdCBwYXJhbUlkPXRoaXMudXJsUGFyYW1zLmlkO1xuICAgICAgICAgICAgICAgIGlmKHFQYXJhbXMgIT09IHVuZGVmaW5lZCkgcGFyYW1zID0gey4uLnFQYXJhbXN9XG4gICAgICAgICAgICAgICAgaWYoYlBhcmFtcyAhPT0gdW5kZWZpbmVkKSBwYXJhbXMgPSB7Li4ucGFyYW1zLCAuLi5iUGFyYW1zfVxuXG4gICAgICAgICAgICAgICAgdHJ5eyAvL1RPRE8gdGhpcyBpcyBub3QgbmVjZXNzYXJ5IGhlcmUgYW5kIGNhbiBwcm9iYWJseSBnbyByaWdodCBpbnRvIHRoZSBkZWZpbml0aW9uIG9mIHRoZSBSRVNUIE1FVEhPRCBuZXh0IHRvIHB1dCAoIT8hKVxuICAgICAgICAgICAgICAgICAgICBpZighUm9sZXMudXNlcklzSW5Sb2xlKHVpZCwgJ2FkbWluJykpe1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYodWlkIT09cGFyYW1JZCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJObyBQZXJtaXNzaW9uXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZVVzZXJTY2hlbWEudmFsaWRhdGUocGFyYW1zKTtcbiAgICAgICAgICAgICAgICAgICAgaWYoIU1ldGVvci51c2Vycy51cGRhdGUodGhpcy51cmxQYXJhbXMuaWQseyRzZXQ6e1wicHJvZmlsZS5tYWlsVGVtcGxhdGVcIjpwYXJhbXMubWFpbFRlbXBsYXRlfX0pKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IEVycm9yKFwiRmFpbGVkIHRvIHVwZGF0ZSB1c2VyXCIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7c3RhdHVzOiAnc3VjY2VzcycsIGRhdGE6IHt1c2VyaWQ6IHRoaXMudXJsUGFyYW1zLmlkLCBtYWlsVGVtcGxhdGU6cGFyYW1zLm1haWxUZW1wbGF0ZX19O1xuICAgICAgICAgICAgICAgIH0gY2F0Y2goZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiB7c3RhdHVzQ29kZTogNDAwLCBib2R5OiB7c3RhdHVzOiAnZmFpbCcsIG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2V9fTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5BcGkuYWRkQ29sbGVjdGlvbihNZXRlb3IudXNlcnMsY29sbGVjdGlvbk9wdGlvbnMpOyIsImltcG9ydCB7IEFwaSB9IGZyb20gJy4uL3Jlc3QuanMnO1xuaW1wb3J0IHZlcmlmeU9wdEluIGZyb20gJy4uLy4uLy4uLy4uL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvb3B0LWlucy92ZXJpZnkuanMnO1xuXG5BcGkuYWRkUm91dGUoJ29wdC1pbi92ZXJpZnknLCB7YXV0aFJlcXVpcmVkOiB0cnVlfSwge1xuICBnZXQ6IHtcbiAgICBhdXRoUmVxdWlyZWQ6IGZhbHNlLFxuICAgIGFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnN0IHFQYXJhbXMgPSB0aGlzLnF1ZXJ5UGFyYW1zO1xuICAgICAgICBjb25zdCBiUGFyYW1zID0gdGhpcy5ib2R5UGFyYW1zO1xuICAgICAgICBsZXQgcGFyYW1zID0ge31cbiAgICAgICAgaWYocVBhcmFtcyAhPT0gdW5kZWZpbmVkKSBwYXJhbXMgPSB7Li4ucVBhcmFtc31cbiAgICAgICAgaWYoYlBhcmFtcyAhPT0gdW5kZWZpbmVkKSBwYXJhbXMgPSB7Li4ucGFyYW1zLCAuLi5iUGFyYW1zfVxuXG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCB2YWwgPSB2ZXJpZnlPcHRJbihwYXJhbXMpO1xuICAgICAgICByZXR1cm4ge3N0YXR1czogXCJzdWNjZXNzXCIsIGRhdGE6IHt2YWx9fTtcbiAgICAgIH0gY2F0Y2goZXJyb3IpIHtcbiAgICAgICAgcmV0dXJuIHtzdGF0dXNDb2RlOiA1MDAsIGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogZXJyb3IubWVzc2FnZX19O1xuICAgICAgfVxuICAgIH1cbiAgfVxufSk7XG4iLCJpbXBvcnQgeyBSZXN0aXZ1cyB9IGZyb20gJ21ldGVvci9uaW1ibGU6cmVzdGl2dXMnO1xuaW1wb3J0IHsgaXNEZWJ1ZyB9IGZyb20gJy4uLy4uLy4uL2ltcG9ydHMvc3RhcnR1cC9zZXJ2ZXIvZGFwcC1jb25maWd1cmF0aW9uLmpzJztcbmltcG9ydCB7IFNFTkRfQVBQLCBDT05GSVJNX0FQUCwgVkVSSUZZX0FQUCwgaXNBcHBUeXBlIH0gZnJvbSAnLi4vLi4vLi4vaW1wb3J0cy9zdGFydHVwL3NlcnZlci90eXBlLWNvbmZpZ3VyYXRpb24uanMnO1xuXG5leHBvcnQgY29uc3QgRE9JX0NPTkZJUk1BVElPTl9ST1VURSA9IFwib3B0LWluL2NvbmZpcm1cIjtcbmV4cG9ydCBjb25zdCBET0lfQ09ORklSTUFUSU9OX05PVElGWV9ST1VURSA9IFwib3B0LWluXCI7XG5leHBvcnQgY29uc3QgRE9JX1dBTExFVE5PVElGWV9ST1VURSA9IFwid2FsbGV0bm90aWZ5XCI7XG5leHBvcnQgY29uc3QgRE9JX0ZFVENIX1JPVVRFID0gXCJkb2ktbWFpbFwiO1xuZXhwb3J0IGNvbnN0IERPSV9FWFBPUlRfUk9VVEUgPSBcImV4cG9ydFwiO1xuZXhwb3J0IGNvbnN0IEFQSV9QQVRIID0gXCJhcGkvXCI7XG5leHBvcnQgY29uc3QgVkVSU0lPTiA9IFwidjFcIjtcblxuZXhwb3J0IGNvbnN0IEFwaSA9IG5ldyBSZXN0aXZ1cyh7XG4gIGFwaVBhdGg6IEFQSV9QQVRILFxuICB2ZXJzaW9uOiBWRVJTSU9OLFxuICB1c2VEZWZhdWx0QXV0aDogdHJ1ZSxcbiAgcHJldHR5SnNvbjogdHJ1ZVxufSk7XG5cbmlmKGlzRGVidWcoKSkgcmVxdWlyZSgnLi9pbXBvcnRzL2RlYnVnLmpzJyk7XG5pZihpc0FwcFR5cGUoU0VORF9BUFApKSByZXF1aXJlKCcuL2ltcG9ydHMvc2VuZC5qcycpO1xuaWYoaXNBcHBUeXBlKENPTkZJUk1fQVBQKSkgcmVxdWlyZSgnLi9pbXBvcnRzL2NvbmZpcm0uanMnKTtcbmlmKGlzQXBwVHlwZShWRVJJRllfQVBQKSkgcmVxdWlyZSgnLi9pbXBvcnRzL3ZlcmlmeS5qcycpO1xucmVxdWlyZSgnLi9pbXBvcnRzL3VzZXIuanMnKTtcbnJlcXVpcmUoJy4vaW1wb3J0cy9zdGF0dXMuanMnKTtcbiIsIlxuaW1wb3J0IHsgSm9iQ29sbGVjdGlvbixKb2IgfSBmcm9tICdtZXRlb3IvdnNpdnNpOmpvYi1jb2xsZWN0aW9uJztcbmV4cG9ydCBjb25zdCBCbG9ja2NoYWluSm9icyA9IEpvYkNvbGxlY3Rpb24oJ2Jsb2NrY2hhaW4nKTtcbmltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IGluc2VydCBmcm9tICcuLi8uLi9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2RvaWNoYWluL2luc2VydC5qcyc7XG5pbXBvcnQgdXBkYXRlIGZyb20gJy4uLy4uL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvZG9pY2hhaW4vdXBkYXRlLmpzJztcbi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovIC8vVE9ETyByZS1lbmFibGUgdGhpcyFcbmltcG9ydCBjaGVja05ld1RyYW5zYWN0aW9uIGZyb20gJy4uLy4uL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvZG9pY2hhaW4vY2hlY2tfbmV3X3RyYW5zYWN0aW9ucy5qcyc7XG5pbXBvcnQgeyBDT05GSVJNX0FQUCwgaXNBcHBUeXBlIH0gZnJvbSAnLi4vLi4vaW1wb3J0cy9zdGFydHVwL3NlcnZlci90eXBlLWNvbmZpZ3VyYXRpb24uanMnO1xuaW1wb3J0IHtsb2dNYWlufSBmcm9tIFwiLi4vLi4vaW1wb3J0cy9zdGFydHVwL3NlcnZlci9sb2ctY29uZmlndXJhdGlvblwiO1xuXG5CbG9ja2NoYWluSm9icy5wcm9jZXNzSm9icygnaW5zZXJ0Jywge3dvcmtUaW1lb3V0OiAzMCoxMDAwfSxmdW5jdGlvbiAoam9iLCBjYikge1xuICB0cnkge1xuICAgIGNvbnN0IGVudHJ5ID0gam9iLmRhdGE7XG4gICAgaW5zZXJ0KGVudHJ5KTtcbiAgICBqb2IuZG9uZSgpO1xuICB9IGNhdGNoKGV4Y2VwdGlvbikge1xuICAgIGpvYi5mYWlsKCk7XG5cbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2pvYnMuYmxvY2tjaGFpbi5pbnNlcnQuZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgfSBmaW5hbGx5IHtcbiAgICBjYigpO1xuICB9XG59KTtcblxuQmxvY2tjaGFpbkpvYnMucHJvY2Vzc0pvYnMoJ3VwZGF0ZScsIHt3b3JrVGltZW91dDogMzAqMTAwMH0sZnVuY3Rpb24gKGpvYiwgY2IpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCBlbnRyeSA9IGpvYi5kYXRhO1xuICAgIHVwZGF0ZShlbnRyeSxqb2IpO1xuICB9IGNhdGNoKGV4Y2VwdGlvbikge1xuICAgIGpvYi5mYWlsKCk7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignam9icy5ibG9ja2NoYWluLnVwZGF0ZS5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9IGZpbmFsbHkge1xuICAgIGNiKCk7XG4gIH1cbn0pO1xuXG5CbG9ja2NoYWluSm9icy5wcm9jZXNzSm9icygnY2hlY2tOZXdUcmFuc2FjdGlvbicsIHt3b3JrVGltZW91dDogMzAqMTAwMH0sZnVuY3Rpb24gKGpvYiwgY2IpIHtcbiAgdHJ5IHtcbiAgICBpZighaXNBcHBUeXBlKENPTkZJUk1fQVBQKSkge1xuICAgICAgam9iLnBhdXNlKCk7XG4gICAgICBqb2IuY2FuY2VsKCk7XG4gICAgICBqb2IucmVtb3ZlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vY2hlY2tOZXdUcmFuc2FjdGlvbihudWxsLGpvYik7XG4gICAgfVxuICB9IGNhdGNoKGV4Y2VwdGlvbikge1xuICAgIGpvYi5mYWlsKCk7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignam9icy5ibG9ja2NoYWluLmNoZWNrTmV3VHJhbnNhY3Rpb25zLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH0gZmluYWxseSB7XG4gICAgY2IoKTtcbiAgfVxufSk7XG5cbm5ldyBKb2IoQmxvY2tjaGFpbkpvYnMsICdjbGVhbnVwJywge30pXG4gICAgLnJlcGVhdCh7IHNjaGVkdWxlOiBCbG9ja2NoYWluSm9icy5sYXRlci5wYXJzZS50ZXh0KFwiZXZlcnkgNSBtaW51dGVzXCIpIH0pXG4gICAgLnNhdmUoe2NhbmNlbFJlcGVhdHM6IHRydWV9KTtcblxubGV0IHEgPSBCbG9ja2NoYWluSm9icy5wcm9jZXNzSm9icygnY2xlYW51cCcseyBwb2xsSW50ZXJ2YWw6IGZhbHNlLCB3b3JrVGltZW91dDogNjAqMTAwMCB9ICxmdW5jdGlvbiAoam9iLCBjYikge1xuICBjb25zdCBjdXJyZW50ID0gbmV3IERhdGUoKVxuICAgIGN1cnJlbnQuc2V0TWludXRlcyhjdXJyZW50LmdldE1pbnV0ZXMoKSAtIDUpO1xuXG4gIGNvbnN0IGlkcyA9IEJsb2NrY2hhaW5Kb2JzLmZpbmQoe1xuICAgICAgICAgIHN0YXR1czogeyRpbjogSm9iLmpvYlN0YXR1c1JlbW92YWJsZX0sXG4gICAgICAgICAgdXBkYXRlZDogeyRsdDogY3VycmVudH19LFxuICAgICAgICAgIHtmaWVsZHM6IHsgX2lkOiAxIH19KTtcblxuICAgIGxvZ01haW4oJ2ZvdW5kICByZW1vdmFibGUgYmxvY2tjaGFpbiBqb2JzOicsaWRzKTtcbiAgICBCbG9ja2NoYWluSm9icy5yZW1vdmVKb2JzKGlkcyk7XG4gICAgaWYoaWRzLmxlbmd0aCA+IDApe1xuICAgICAgam9iLmRvbmUoXCJSZW1vdmVkICN7aWRzLmxlbmd0aH0gb2xkIGpvYnNcIik7XG4gICAgfVxuICAgIGNiKCk7XG59KTtcblxuQmxvY2tjaGFpbkpvYnMuZmluZCh7IHR5cGU6ICdqb2JUeXBlJywgc3RhdHVzOiAncmVhZHknIH0pXG4gICAgLm9ic2VydmUoe1xuICAgICAgICBhZGRlZDogZnVuY3Rpb24gKCkgeyBxLnRyaWdnZXIoKTsgfVxuICAgIH0pO1xuIiwiaW1wb3J0IHsgSm9iQ29sbGVjdGlvbiwgSm9iIH0gZnJvbSAnbWV0ZW9yL3ZzaXZzaTpqb2ItY29sbGVjdGlvbic7XG5pbXBvcnQgZmV0Y2hEb2lNYWlsRGF0YSBmcm9tICcuLi8uLi9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2RhcHBzL2ZldGNoX2RvaS1tYWlsLWRhdGEuanMnO1xuaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQge2xvZ01haW59IGZyb20gXCIuLi8uLi9pbXBvcnRzL3N0YXJ0dXAvc2VydmVyL2xvZy1jb25maWd1cmF0aW9uXCI7XG5pbXBvcnQge0Jsb2NrY2hhaW5Kb2JzfSBmcm9tIFwiLi9ibG9ja2NoYWluX2pvYnNcIjtcblxuZXhwb3J0IGNvbnN0IERBcHBKb2JzID0gSm9iQ29sbGVjdGlvbignZGFwcCcpO1xuXG5EQXBwSm9icy5wcm9jZXNzSm9icygnZmV0Y2hEb2lNYWlsRGF0YScsIGZ1bmN0aW9uIChqb2IsIGNiKSB7XG4gIHRyeSB7XG4gICAgY29uc3QgZGF0YSA9IGpvYi5kYXRhO1xuICAgIGZldGNoRG9pTWFpbERhdGEoZGF0YSk7XG4gICAgam9iLmRvbmUoKTtcbiAgfSBjYXRjaChleGNlcHRpb24pIHtcbiAgICBqb2IuZmFpbCgpO1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2pvYnMuZGFwcC5mZXRjaERvaU1haWxEYXRhLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH0gZmluYWxseSB7XG4gICAgY2IoKTtcbiAgfVxufSk7XG5cblxubmV3IEpvYihEQXBwSm9icywgJ2NsZWFudXAnLCB7fSlcbiAgICAucmVwZWF0KHsgc2NoZWR1bGU6IERBcHBKb2JzLmxhdGVyLnBhcnNlLnRleHQoXCJldmVyeSA1IG1pbnV0ZXNcIikgfSlcbiAgICAuc2F2ZSh7Y2FuY2VsUmVwZWF0czogdHJ1ZX0pO1xuXG5sZXQgcSA9IERBcHBKb2JzLnByb2Nlc3NKb2JzKCdjbGVhbnVwJyx7IHBvbGxJbnRlcnZhbDogZmFsc2UsIHdvcmtUaW1lb3V0OiA2MCoxMDAwIH0gLGZ1bmN0aW9uIChqb2IsIGNiKSB7XG4gICAgY29uc3QgY3VycmVudCA9IG5ldyBEYXRlKClcbiAgICBjdXJyZW50LnNldE1pbnV0ZXMoY3VycmVudC5nZXRNaW51dGVzKCkgLSA1KTtcblxuICAgIGNvbnN0IGlkcyA9IERBcHBKb2JzLmZpbmQoe1xuICAgICAgICAgICAgc3RhdHVzOiB7JGluOiBKb2Iuam9iU3RhdHVzUmVtb3ZhYmxlfSxcbiAgICAgICAgICAgIHVwZGF0ZWQ6IHskbHQ6IGN1cnJlbnR9fSxcbiAgICAgICAge2ZpZWxkczogeyBfaWQ6IDEgfX0pO1xuXG4gICAgbG9nTWFpbignZm91bmQgIHJlbW92YWJsZSBibG9ja2NoYWluIGpvYnM6JyxpZHMpO1xuICAgIERBcHBKb2JzLnJlbW92ZUpvYnMoaWRzKTtcbiAgICBpZihpZHMubGVuZ3RoID4gMCl7XG4gICAgICAgIGpvYi5kb25lKFwiUmVtb3ZlZCAje2lkcy5sZW5ndGh9IG9sZCBqb2JzXCIpO1xuICAgIH1cbiAgICBjYigpO1xufSk7XG5cbkRBcHBKb2JzLmZpbmQoeyB0eXBlOiAnam9iVHlwZScsIHN0YXR1czogJ3JlYWR5JyB9KVxuICAgIC5vYnNlcnZlKHtcbiAgICAgICAgYWRkZWQ6IGZ1bmN0aW9uICgpIHsgcS50cmlnZ2VyKCk7IH1cbiAgICB9KTtcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IGRucyBmcm9tICdkbnMnO1xuaW1wb3J0IHtsb2dTZW5kfSBmcm9tIFwiLi4vLi4vaW1wb3J0cy9zdGFydHVwL3NlcnZlci9sb2ctY29uZmlndXJhdGlvblwiO1xuXG5leHBvcnQgZnVuY3Rpb24gcmVzb2x2ZVR4dChrZXksIGRvbWFpbikge1xuICBjb25zdCBzeW5jRnVuYyA9IE1ldGVvci53cmFwQXN5bmMoZG5zX3Jlc29sdmVUeHQpO1xuICB0cnkge1xuICAgIGNvbnN0IHJlY29yZHMgPSBzeW5jRnVuYyhrZXksIGRvbWFpbik7XG4gICAgaWYocmVjb3JkcyA9PT0gdW5kZWZpbmVkKSByZXR1cm4gdW5kZWZpbmVkO1xuICAgIGxldCB2YWx1ZSA9IHVuZGVmaW5lZDtcbiAgICByZWNvcmRzLmZvckVhY2gocmVjb3JkID0+IHtcbiAgICAgIGlmKHJlY29yZFswXS5zdGFydHNXaXRoKGtleSkpIHtcbiAgICAgICAgY29uc3QgdmFsID0gcmVjb3JkWzBdLnN1YnN0cmluZyhrZXkubGVuZ3RoKzEpO1xuICAgICAgICB2YWx1ZSA9IHZhbC50cmltKCk7XG5cbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH0gY2F0Y2goZXJyb3IpIHtcbiAgICBpZihlcnJvci5tZXNzYWdlLnN0YXJ0c1dpdGgoXCJxdWVyeVR4dCBFTk9EQVRBXCIpIHx8XG4gICAgICAgIGVycm9yLm1lc3NhZ2Uuc3RhcnRzV2l0aChcInF1ZXJ5VHh0IEVOT1RGT1VORFwiKSkgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICBlbHNlIHRocm93IGVycm9yO1xuICB9XG59XG5cbmZ1bmN0aW9uIGRuc19yZXNvbHZlVHh0KGtleSwgZG9tYWluLCBjYWxsYmFjaykge1xuICAgIGxvZ1NlbmQoXCJyZXNvbHZpbmcgZG5zIHR4dCBhdHRyaWJ1dGU6IFwiLCB7a2V5OmtleSxkb21haW46ZG9tYWlufSk7XG4gICAgZG5zLnJlc29sdmVUeHQoZG9tYWluLCAoZXJyLCByZWNvcmRzKSA9PiB7XG4gICAgY2FsbGJhY2soZXJyLCByZWNvcmRzKTtcbiAgfSk7XG59XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCB7bG9nQmxvY2tjaGFpbiwgbG9nQ29uZmlybSwgbG9nRXJyb3J9IGZyb20gXCIuLi8uLi9pbXBvcnRzL3N0YXJ0dXAvc2VydmVyL2xvZy1jb25maWd1cmF0aW9uXCI7XG5cblxuY29uc3QgTkFNRVNQQUNFID0gJ2UvJztcblxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0V2lmKGNsaWVudCwgYWRkcmVzcykge1xuICBpZighYWRkcmVzcyl7XG4gICAgICAgIGFkZHJlc3MgPSBnZXRBZGRyZXNzZXNCeUFjY291bnQoXCJcIilbMF07XG4gICAgICAgIGxvZ0Jsb2NrY2hhaW4oJ2FkZHJlc3Mgd2FzIG5vdCBkZWZpbmVkIHNvIGdldHRpbmcgdGhlIGZpcnN0IGV4aXN0aW5nIG9uZSBvZiB0aGUgd2FsbGV0OicsYWRkcmVzcyk7XG4gIH1cbiAgaWYoIWFkZHJlc3Mpe1xuICAgICAgICBhZGRyZXNzID0gZ2V0TmV3QWRkcmVzcyhcIlwiKTtcbiAgICAgICAgbG9nQmxvY2tjaGFpbignYWRkcmVzcyB3YXMgbmV2ZXIgZGVmaW5lZCAgYXQgYWxsIGdlbmVyYXRlZCBuZXcgYWRkcmVzcyBmb3IgdGhpcyB3YWxsZXQ6JyxhZGRyZXNzKTtcbiAgfVxuICBjb25zdCBzeW5jRnVuYyA9IE1ldGVvci53cmFwQXN5bmMoZG9pY2hhaW5fZHVtcHByaXZrZXkpO1xuICByZXR1cm4gc3luY0Z1bmMoY2xpZW50LCBhZGRyZXNzKTtcbn1cblxuZnVuY3Rpb24gZG9pY2hhaW5fZHVtcHByaXZrZXkoY2xpZW50LCBhZGRyZXNzLCBjYWxsYmFjaykge1xuICBjb25zdCBvdXJBZGRyZXNzID0gYWRkcmVzcztcbiAgY2xpZW50LmNtZCgnZHVtcHByaXZrZXknLCBvdXJBZGRyZXNzLCBmdW5jdGlvbihlcnIsIGRhdGEpIHtcbiAgICBpZihlcnIpICBsb2dFcnJvcignZG9pY2hhaW5fZHVtcHByaXZrZXk6JyxlcnIpO1xuICAgIGNhbGxiYWNrKGVyciwgZGF0YSk7XG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0QWRkcmVzc2VzQnlBY2NvdW50KGNsaWVudCwgYWNjb3V0KSB7XG4gICAgY29uc3Qgc3luY0Z1bmMgPSBNZXRlb3Iud3JhcEFzeW5jKGRvaWNoYWluX2dldGFkZHJlc3Nlc2J5YWNjb3VudCk7XG4gICAgcmV0dXJuIHN5bmNGdW5jKGNsaWVudCwgYWNjb3V0KTtcbn1cblxuZnVuY3Rpb24gZG9pY2hhaW5fZ2V0YWRkcmVzc2VzYnlhY2NvdW50KGNsaWVudCwgYWNjb3VudCwgY2FsbGJhY2spIHtcbiAgICBjb25zdCBvdXJBY2NvdW50ID0gYWNjb3VudDtcbiAgICBjbGllbnQuY21kKCdnZXRhZGRyZXNzZXNieWFjY291bnQnLCBvdXJBY2NvdW50LCBmdW5jdGlvbihlcnIsIGRhdGEpIHtcbiAgICAgICAgaWYoZXJyKSAgbG9nRXJyb3IoJ2dldGFkZHJlc3Nlc2J5YWNjb3VudDonLGVycik7XG4gICAgICAgIGNhbGxiYWNrKGVyciwgZGF0YSk7XG4gICAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXROZXdBZGRyZXNzKGNsaWVudCwgYWNjb3V0KSB7XG4gICAgY29uc3Qgc3luY0Z1bmMgPSBNZXRlb3Iud3JhcEFzeW5jKGRvaWNoYWluX2dldG5ld2FkZHJlc3MpO1xuICAgIHJldHVybiBzeW5jRnVuYyhjbGllbnQsIGFjY291dCk7XG59XG5mdW5jdGlvbiBkb2ljaGFpbl9nZXRuZXdhZGRyZXNzKGNsaWVudCwgYWNjb3VudCwgY2FsbGJhY2spIHtcbiAgICBjb25zdCBvdXJBY2NvdW50ID0gYWNjb3VudDtcbiAgICBjbGllbnQuY21kKCdnZXRuZXdhZGRyZXNzcycsIG91ckFjY291bnQsIGZ1bmN0aW9uKGVyciwgZGF0YSkge1xuICAgICAgICBpZihlcnIpICBsb2dFcnJvcignZ2V0bmV3YWRkcmVzc3M6JyxlcnIpO1xuICAgICAgICBjYWxsYmFjayhlcnIsIGRhdGEpO1xuICAgIH0pO1xufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBzaWduTWVzc2FnZShjbGllbnQsIGFkZHJlc3MsIG1lc3NhZ2UpIHtcbiAgICBjb25zdCBzeW5jRnVuYyA9IE1ldGVvci53cmFwQXN5bmMoZG9pY2hhaW5fc2lnbk1lc3NhZ2UpO1xuICAgIHJldHVybiBzeW5jRnVuYyhjbGllbnQsIGFkZHJlc3MsIG1lc3NhZ2UpO1xufVxuXG5mdW5jdGlvbiBkb2ljaGFpbl9zaWduTWVzc2FnZShjbGllbnQsIGFkZHJlc3MsIG1lc3NhZ2UsIGNhbGxiYWNrKSB7XG4gICAgY29uc3Qgb3VyQWRkcmVzcyA9IGFkZHJlc3M7XG4gICAgY29uc3Qgb3VyTWVzc2FnZSA9IG1lc3NhZ2U7XG4gICAgY2xpZW50LmNtZCgnc2lnbm1lc3NhZ2UnLCBvdXJBZGRyZXNzLCBvdXJNZXNzYWdlLCBmdW5jdGlvbihlcnIsIGRhdGEpIHtcbiAgICAgICAgY2FsbGJhY2soZXJyLCBkYXRhKTtcbiAgICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG5hbWVTaG93KGNsaWVudCwgaWQpIHtcbiAgY29uc3Qgc3luY0Z1bmMgPSBNZXRlb3Iud3JhcEFzeW5jKGRvaWNoYWluX25hbWVTaG93KTtcbiAgcmV0dXJuIHN5bmNGdW5jKGNsaWVudCwgaWQpO1xufVxuXG5mdW5jdGlvbiBkb2ljaGFpbl9uYW1lU2hvdyhjbGllbnQsIGlkLCBjYWxsYmFjaykge1xuICBjb25zdCBvdXJJZCA9IGNoZWNrSWQoaWQpO1xuICBsb2dDb25maXJtKCdkb2ljaGFpbi1jbGkgbmFtZV9zaG93IDonLG91cklkKTtcbiAgY2xpZW50LmNtZCgnbmFtZV9zaG93Jywgb3VySWQsIGZ1bmN0aW9uKGVyciwgZGF0YSkge1xuICAgIGlmKGVyciAhPT0gdW5kZWZpbmVkICYmIGVyciAhPT0gbnVsbCAmJiBlcnIubWVzc2FnZS5zdGFydHNXaXRoKFwibmFtZSBub3QgZm91bmRcIikpIHtcbiAgICAgIGVyciA9IHVuZGVmaW5lZCxcbiAgICAgIGRhdGEgPSB1bmRlZmluZWRcbiAgICB9XG4gICAgY2FsbGJhY2soZXJyLCBkYXRhKTtcbiAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmZWVEb2koY2xpZW50LCBhZGRyZXNzKSB7XG4gICAgY29uc3Qgc3luY0Z1bmMgPSBNZXRlb3Iud3JhcEFzeW5jKGRvaWNoYWluX2ZlZURvaSk7XG4gICAgcmV0dXJuIHN5bmNGdW5jKGNsaWVudCwgYWRkcmVzcyk7XG59XG5cbmZ1bmN0aW9uIGRvaWNoYWluX2ZlZURvaShjbGllbnQsIGFkZHJlc3MsIGNhbGxiYWNrKSB7XG4gICAgY29uc3QgZGVzdEFkZHJlc3MgPSBhZGRyZXNzO1xuICAgIGNsaWVudC5jbWQoJ3NlbmR0b2FkZHJlc3MnLCBkZXN0QWRkcmVzcywgJzAuMDInLCBmdW5jdGlvbihlcnIsIGRhdGEpIHtcbiAgICAgICAgY2FsbGJhY2soZXJyLCBkYXRhKTtcbiAgICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG5hbWVEb2koY2xpZW50LCBuYW1lLCB2YWx1ZSwgYWRkcmVzcykge1xuICAgIGNvbnN0IHN5bmNGdW5jID0gTWV0ZW9yLndyYXBBc3luYyhkb2ljaGFpbl9uYW1lRG9pKTtcbiAgICByZXR1cm4gc3luY0Z1bmMoY2xpZW50LCBuYW1lLCB2YWx1ZSwgYWRkcmVzcyk7XG59XG5cbmZ1bmN0aW9uIGRvaWNoYWluX25hbWVEb2koY2xpZW50LCBuYW1lLCB2YWx1ZSwgYWRkcmVzcywgY2FsbGJhY2spIHtcbiAgICBjb25zdCBvdXJOYW1lID0gY2hlY2tJZChuYW1lKTtcbiAgICBjb25zdCBvdXJWYWx1ZSA9IHZhbHVlO1xuICAgIGNvbnN0IGRlc3RBZGRyZXNzID0gYWRkcmVzcztcbiAgICBpZighYWRkcmVzcykge1xuICAgICAgICBjbGllbnQuY21kKCduYW1lX2RvaScsIG91ck5hbWUsIG91clZhbHVlLCBmdW5jdGlvbiAoZXJyLCBkYXRhKSB7XG4gICAgICAgICAgICBjYWxsYmFjayhlcnIsIGRhdGEpO1xuICAgICAgICB9KTtcbiAgICB9ZWxzZXtcbiAgICAgICAgY2xpZW50LmNtZCgnbmFtZV9kb2knLCBvdXJOYW1lLCBvdXJWYWx1ZSwgZGVzdEFkZHJlc3MsIGZ1bmN0aW9uKGVyciwgZGF0YSkge1xuICAgICAgICAgICAgY2FsbGJhY2soZXJyLCBkYXRhKTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gbGlzdFNpbmNlQmxvY2soY2xpZW50LCBibG9jaykge1xuICAgIGNvbnN0IHN5bmNGdW5jID0gTWV0ZW9yLndyYXBBc3luYyhkb2ljaGFpbl9saXN0U2luY2VCbG9jayk7XG4gICAgdmFyIG91ckJsb2NrID0gYmxvY2s7XG4gICAgaWYob3VyQmxvY2sgPT09IHVuZGVmaW5lZCkgb3VyQmxvY2sgPSBudWxsO1xuICAgIHJldHVybiBzeW5jRnVuYyhjbGllbnQsIG91ckJsb2NrKTtcbn1cblxuZnVuY3Rpb24gZG9pY2hhaW5fbGlzdFNpbmNlQmxvY2soY2xpZW50LCBibG9jaywgY2FsbGJhY2spIHtcbiAgICB2YXIgb3VyQmxvY2sgPSBibG9jaztcbiAgICBpZihvdXJCbG9jayA9PT0gbnVsbCkgY2xpZW50LmNtZCgnbGlzdHNpbmNlYmxvY2snLCBmdW5jdGlvbihlcnIsIGRhdGEpIHtcbiAgICAgICAgY2FsbGJhY2soZXJyLCBkYXRhKTtcbiAgICB9KTtcbiAgICBlbHNlIGNsaWVudC5jbWQoJ2xpc3RzaW5jZWJsb2NrJywgb3VyQmxvY2ssIGZ1bmN0aW9uKGVyciwgZGF0YSkge1xuICAgICAgICBjYWxsYmFjayhlcnIsIGRhdGEpO1xuICAgIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0VHJhbnNhY3Rpb24oY2xpZW50LCB0eGlkKSB7XG4gICAgY29uc3Qgc3luY0Z1bmMgPSBNZXRlb3Iud3JhcEFzeW5jKGRvaWNoYWluX2dldHRyYW5zYWN0aW9uKTtcbiAgICByZXR1cm4gc3luY0Z1bmMoY2xpZW50LCB0eGlkKTtcbn1cblxuZnVuY3Rpb24gZG9pY2hhaW5fZ2V0dHJhbnNhY3Rpb24oY2xpZW50LCB0eGlkLCBjYWxsYmFjaykge1xuICAgIGxvZ0NvbmZpcm0oJ2RvaWNoYWluX2dldHRyYW5zYWN0aW9uOicsdHhpZCk7XG4gICAgY2xpZW50LmNtZCgnZ2V0dHJhbnNhY3Rpb24nLCB0eGlkLCBmdW5jdGlvbihlcnIsIGRhdGEpIHtcbiAgICAgICAgaWYoZXJyKSAgbG9nRXJyb3IoJ2RvaWNoYWluX2dldHRyYW5zYWN0aW9uOicsZXJyKTtcbiAgICAgICAgY2FsbGJhY2soZXJyLCBkYXRhKTtcbiAgICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFJhd1RyYW5zYWN0aW9uKGNsaWVudCwgdHhpZCkge1xuICAgIGNvbnN0IHN5bmNGdW5jID0gTWV0ZW9yLndyYXBBc3luYyhkb2ljaGFpbl9nZXRyYXd0cmFuc2FjdGlvbik7XG4gICAgcmV0dXJuIHN5bmNGdW5jKGNsaWVudCwgdHhpZCk7XG59XG5cbmZ1bmN0aW9uIGRvaWNoYWluX2dldHJhd3RyYW5zYWN0aW9uKGNsaWVudCwgdHhpZCwgY2FsbGJhY2spIHtcbiAgICBsb2dCbG9ja2NoYWluKCdkb2ljaGFpbl9nZXRyYXd0cmFuc2FjdGlvbjonLHR4aWQpO1xuICAgIGNsaWVudC5jbWQoJ2dldHJhd3RyYW5zYWN0aW9uJywgdHhpZCwgMSwgZnVuY3Rpb24oZXJyLCBkYXRhKSB7XG4gICAgICAgIGlmKGVycikgIGxvZ0Vycm9yKCdkb2ljaGFpbl9nZXRyYXd0cmFuc2FjdGlvbjonLGVycik7XG4gICAgICAgIGNhbGxiYWNrKGVyciwgZGF0YSk7XG4gICAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRCYWxhbmNlKGNsaWVudCkge1xuICAgIGNvbnN0IHN5bmNGdW5jID0gTWV0ZW9yLndyYXBBc3luYyhkb2ljaGFpbl9nZXRiYWxhbmNlKTtcbiAgICByZXR1cm4gc3luY0Z1bmMoY2xpZW50KTtcbn1cblxuZnVuY3Rpb24gZG9pY2hhaW5fZ2V0YmFsYW5jZShjbGllbnQsIGNhbGxiYWNrKSB7XG4gICAgY2xpZW50LmNtZCgnZ2V0YmFsYW5jZScsIGZ1bmN0aW9uKGVyciwgZGF0YSkge1xuICAgICAgICBpZihlcnIpIHsgbG9nRXJyb3IoJ2RvaWNoYWluX2dldGJhbGFuY2U6JyxlcnIpO31cbiAgICAgICAgY2FsbGJhY2soZXJyLCBkYXRhKTtcbiAgICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEluZm8oY2xpZW50KSB7XG4gICAgY29uc3Qgc3luY0Z1bmMgPSBNZXRlb3Iud3JhcEFzeW5jKGRvaWNoYWluX2dldGluZm8pO1xuICAgIHJldHVybiBzeW5jRnVuYyhjbGllbnQpO1xufVxuXG5mdW5jdGlvbiBkb2ljaGFpbl9nZXRpbmZvKGNsaWVudCwgY2FsbGJhY2spIHtcbiAgICBjbGllbnQuY21kKCdnZXRibG9ja2NoYWluaW5mbycsIGZ1bmN0aW9uKGVyciwgZGF0YSkge1xuICAgICAgICBpZihlcnIpIHsgbG9nRXJyb3IoJ2RvaWNoYWluLWdldGluZm86JyxlcnIpO31cbiAgICAgICAgY2FsbGJhY2soZXJyLCBkYXRhKTtcbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gY2hlY2tJZChpZCkge1xuICAgIGNvbnN0IERPSV9QUkVGSVggPSBcImRvaTogXCI7XG4gICAgbGV0IHJldF92YWwgPSBpZDsgLy9kZWZhdWx0IHZhbHVlXG5cbiAgICBpZihpZC5zdGFydHNXaXRoKERPSV9QUkVGSVgpKSByZXRfdmFsID0gaWQuc3Vic3RyaW5nKERPSV9QUkVGSVgubGVuZ3RoKTsgLy9pbiBjYXNlIGl0IHN0YXJ0cyB3aXRoIGRvaTogY3V0ICB0aGlzIGF3YXlcbiAgICBpZighaWQuc3RhcnRzV2l0aChOQU1FU1BBQ0UpKSByZXRfdmFsID0gTkFNRVNQQUNFK2lkOyAvL2luIGNhc2UgaXQgZG9lc24ndCBzdGFydCB3aXRoIGUvIHB1dCBpdCBpbiBmcm9udCBub3cuXG4gIHJldHVybiByZXRfdmFsO1xufVxuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgeyBIVFRQIH0gZnJvbSAnbWV0ZW9yL2h0dHAnXG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRIdHRwR0VUKHVybCwgcXVlcnkpIHtcbiAgY29uc3Qgc3luY0Z1bmMgPSBNZXRlb3Iud3JhcEFzeW5jKF9nZXQpO1xuICByZXR1cm4gc3luY0Z1bmModXJsLCBxdWVyeSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRIdHRwR0VUZGF0YSh1cmwsIGRhdGEpIHtcbiAgICBjb25zdCBzeW5jRnVuYyA9IE1ldGVvci53cmFwQXN5bmMoX2dldERhdGEpO1xuICAgIHJldHVybiBzeW5jRnVuYyh1cmwsIGRhdGEpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0SHR0cFBPU1QodXJsLCBkYXRhKSB7XG4gICAgY29uc3Qgc3luY0Z1bmMgPSBNZXRlb3Iud3JhcEFzeW5jKF9wb3N0KTtcbiAgICByZXR1cm4gc3luY0Z1bmModXJsLCBkYXRhKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEh0dHBQVVQodXJsLCBkYXRhKSB7XG4gICAgY29uc3Qgc3luY0Z1bmMgPSBNZXRlb3Iud3JhcEFzeW5jKF9wdXQpO1xuICAgIHJldHVybiBzeW5jRnVuYyh1cmwsIGRhdGEpO1xufVxuXG5mdW5jdGlvbiBfZ2V0KHVybCwgcXVlcnksIGNhbGxiYWNrKSB7XG4gIGNvbnN0IG91clVybCA9IHVybDtcbiAgY29uc3Qgb3VyUXVlcnkgPSBxdWVyeTtcbiAgSFRUUC5nZXQob3VyVXJsLCB7cXVlcnk6IG91clF1ZXJ5fSwgZnVuY3Rpb24oZXJyLCByZXQpIHtcbiAgICBjYWxsYmFjayhlcnIsIHJldCk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBfZ2V0RGF0YSh1cmwsIGRhdGEsIGNhbGxiYWNrKSB7XG4gICAgY29uc3Qgb3VyVXJsID0gdXJsO1xuICAgIGNvbnN0IG91ckRhdGEgPSBkYXRhO1xuICAgIEhUVFAuZ2V0KG91clVybCwgb3VyRGF0YSwgZnVuY3Rpb24oZXJyLCByZXQpIHtcbiAgICAgICAgY2FsbGJhY2soZXJyLCByZXQpO1xuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBfcG9zdCh1cmwsIGRhdGEsIGNhbGxiYWNrKSB7XG4gICAgY29uc3Qgb3VyVXJsID0gdXJsO1xuICAgIGNvbnN0IG91ckRhdGEgPSAgZGF0YTtcblxuICAgIEhUVFAucG9zdChvdXJVcmwsIG91ckRhdGEsIGZ1bmN0aW9uKGVyciwgcmV0KSB7XG4gICAgICAgIGNhbGxiYWNrKGVyciwgcmV0KTtcbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gX3B1dCh1cmwsIHVwZGF0ZURhdGEsIGNhbGxiYWNrKSB7XG4gICAgY29uc3Qgb3VyVXJsID0gdXJsO1xuICAgIGNvbnN0IG91ckRhdGEgPSB7XG4gICAgICAgIGRhdGE6IHVwZGF0ZURhdGFcbiAgICB9XG5cbiAgICBIVFRQLnB1dChvdXJVcmwsIG91ckRhdGEsIGZ1bmN0aW9uKGVyciwgcmV0KSB7XG4gICAgICBjYWxsYmFjayhlcnIsIHJldCk7XG4gICAgfSk7XG59XG4iLCJpbXBvcnQgJy4vbWFpbF9qb2JzLmpzJztcbmltcG9ydCAnLi9kb2ljaGFpbi5qcyc7XG5pbXBvcnQgJy4vYmxvY2tjaGFpbl9qb2JzLmpzJztcbmltcG9ydCAnLi9kYXBwX2pvYnMuanMnO1xuaW1wb3J0ICcuL2Rucy5qcyc7XG5pbXBvcnQgJy4vcmVzdC9yZXN0LmpzJztcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IHsgSm9iQ29sbGVjdGlvbiwgSm9iIH0gZnJvbSAnbWV0ZW9yL3ZzaXZzaTpqb2ItY29sbGVjdGlvbic7XG5leHBvcnQgY29uc3QgTWFpbEpvYnMgPSBKb2JDb2xsZWN0aW9uKCdlbWFpbHMnKTtcbmltcG9ydCBzZW5kTWFpbCBmcm9tICcuLi8uLi9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2VtYWlscy9zZW5kLmpzJztcbmltcG9ydCB7bG9nTWFpbn0gZnJvbSBcIi4uLy4uL2ltcG9ydHMvc3RhcnR1cC9zZXJ2ZXIvbG9nLWNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7QmxvY2tjaGFpbkpvYnN9IGZyb20gXCIuL2Jsb2NrY2hhaW5fam9ic1wiO1xuXG5cblxuTWFpbEpvYnMucHJvY2Vzc0pvYnMoJ3NlbmQnLCBmdW5jdGlvbiAoam9iLCBjYikge1xuICB0cnkge1xuICAgIGNvbnN0IGVtYWlsID0gam9iLmRhdGE7XG4gICAgc2VuZE1haWwoZW1haWwpO1xuICAgIGpvYi5kb25lKCk7XG4gIH0gY2F0Y2goZXhjZXB0aW9uKSB7XG4gICAgam9iLmZhaWwoKTtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdqb2JzLm1haWwuc2VuZC5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9IGZpbmFsbHkge1xuICAgIGNiKCk7XG4gIH1cbn0pO1xuXG5cbm5ldyBKb2IoTWFpbEpvYnMsICdjbGVhbnVwJywge30pXG4gICAgLnJlcGVhdCh7IHNjaGVkdWxlOiBNYWlsSm9icy5sYXRlci5wYXJzZS50ZXh0KFwiZXZlcnkgNSBtaW51dGVzXCIpIH0pXG4gICAgLnNhdmUoe2NhbmNlbFJlcGVhdHM6IHRydWV9KVxuXG5sZXQgcSA9IE1haWxKb2JzLnByb2Nlc3NKb2JzKCdjbGVhbnVwJyx7IHBvbGxJbnRlcnZhbDogZmFsc2UsIHdvcmtUaW1lb3V0OiA2MCoxMDAwIH0gLGZ1bmN0aW9uIChqb2IsIGNiKSB7XG4gICAgY29uc3QgY3VycmVudCA9IG5ldyBEYXRlKClcbiAgICBjdXJyZW50LnNldE1pbnV0ZXMoY3VycmVudC5nZXRNaW51dGVzKCkgLSA1KTtcblxuICAgIGNvbnN0IGlkcyA9IE1haWxKb2JzLmZpbmQoe1xuICAgICAgICAgICAgc3RhdHVzOiB7JGluOiBKb2Iuam9iU3RhdHVzUmVtb3ZhYmxlfSxcbiAgICAgICAgICAgIHVwZGF0ZWQ6IHskbHQ6IGN1cnJlbnR9fSxcbiAgICAgICAge2ZpZWxkczogeyBfaWQ6IDEgfX0pO1xuXG4gICAgbG9nTWFpbignZm91bmQgIHJlbW92YWJsZSBibG9ja2NoYWluIGpvYnM6JyxpZHMpO1xuICAgIE1haWxKb2JzLnJlbW92ZUpvYnMoaWRzKTtcbiAgICBpZihpZHMubGVuZ3RoID4gMCl7XG4gICAgICAgIGpvYi5kb25lKFwiUmVtb3ZlZCAje2lkcy5sZW5ndGh9IG9sZCBqb2JzXCIpO1xuICAgIH1cbiAgICBjYigpO1xufSk7XG5cbk1haWxKb2JzLmZpbmQoeyB0eXBlOiAnam9iVHlwZScsIHN0YXR1czogJ3JlYWR5JyB9KVxuICAgIC5vYnNlcnZlKHtcbiAgICAgICAgYWRkZWQ6IGZ1bmN0aW9uICgpIHsgcS50cmlnZ2VyKCk7IH1cbiAgICB9KTtcblxuIiwiaW1wb3J0ICcvaW1wb3J0cy9zdGFydHVwL3NlcnZlcic7XG5pbXBvcnQgJy4vYXBpL2luZGV4LmpzJztcbiJdfQ==
