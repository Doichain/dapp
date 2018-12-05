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
let CONFIRM_CLIENT;
module.link("../../../../imports/startup/server/doichain-configuration", {
  CONFIRM_CLIENT(v) {
    CONFIRM_CLIENT = v;
  }

}, 2);
Api.addRoute('status', {
  authRequired: false
}, {
  get: {
    action: function () {
      const data = getInfo(CONFIRM_CLIENT);
      return {
        "status": "success",
        "data": data
      };
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9hcGkvb3B0LWlucy9zZXJ2ZXIvcHVibGljYXRpb25zLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL2FwaS9vcHQtaW5zL21ldGhvZHMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvYXBpL29wdC1pbnMvb3B0LWlucy5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9hcGkvcmVjaXBpZW50cy9zZXJ2ZXIvcHVibGljYXRpb25zLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL2FwaS9yZWNpcGllbnRzL3JlY2lwaWVudHMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvYXBpL2RvaWNoYWluL2VudHJpZXMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvYXBpL2RvaWNoYWluL21ldGhvZHMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvYXBpL2xhbmd1YWdlcy9tZXRob2RzLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL2FwaS9tZXRhL21ldGEuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvYXBpL3NlbmRlcnMvc2VuZGVycy5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9hcGkvdmVyc2lvbi9wdWJsaWNhdGlvbnMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvZGFwcHMvZXhwb3J0X2RvaXMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvZGFwcHMvZmV0Y2hfZG9pLW1haWwtZGF0YS5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9kYXBwcy9nZXRfZG9pLW1haWwtZGF0YS5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9kbnMvZ2V0X29wdC1pbi1rZXkuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvZG5zL2dldF9vcHQtaW4tcHJvdmlkZXIuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvZG9pY2hhaW4vYWRkX2VudHJ5X2FuZF9mZXRjaF9kYXRhLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2RvaWNoYWluL2NoZWNrX25ld190cmFuc2FjdGlvbnMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvZG9pY2hhaW4vZGVjcnlwdF9tZXNzYWdlLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2RvaWNoYWluL2VuY3J5cHRfbWVzc2FnZS5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9kb2ljaGFpbi9nZW5lcmF0ZV9uYW1lLWlkLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2RvaWNoYWluL2dldF9hZGRyZXNzLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2RvaWNoYWluL2dldF9iYWxhbmNlLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2RvaWNoYWluL2dldF9kYXRhLWhhc2guanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvZG9pY2hhaW4vZ2V0X2tleS1wYWlyLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2RvaWNoYWluL2dldF9wcml2YXRlLWtleV9mcm9tX3dpZi5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9kb2ljaGFpbi9nZXRfcHVibGlja2V5X2FuZF9hZGRyZXNzX2J5X2RvbWFpbi5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9kb2ljaGFpbi9nZXRfc2lnbmF0dXJlLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2RvaWNoYWluL2luc2VydC5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9kb2ljaGFpbi91cGRhdGUuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvZG9pY2hhaW4vdmVyaWZ5X3NpZ25hdHVyZS5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9kb2ljaGFpbi93cml0ZV90b19ibG9ja2NoYWluLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2VtYWlscy9kZWNvZGVfZG9pLWhhc2guanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvZW1haWxzL2dlbmVyYXRlX2RvaS1oYXNoLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2VtYWlscy9wYXJzZV90ZW1wbGF0ZS5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9lbWFpbHMvc2VuZC5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9qb2JzL2FkZF9jaGVja19uZXdfdHJhbnNhY3Rpb25zLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2pvYnMvYWRkX2ZldGNoLWRvaS1tYWlsLWRhdGEuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvam9icy9hZGRfaW5zZXJ0X2Jsb2NrY2hhaW4uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvam9icy9hZGRfc2VuZF9tYWlsLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2pvYnMvYWRkX3VwZGF0ZV9ibG9ja2NoYWluLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2xhbmd1YWdlcy9nZXQuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvbWV0YS9hZGRPclVwZGF0ZS5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9vcHQtaW5zL2FkZC5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9vcHQtaW5zL2FkZF9hbmRfd3JpdGVfdG9fYmxvY2tjaGFpbi5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9vcHQtaW5zL2NvbmZpcm0uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvb3B0LWlucy9nZW5lcmF0ZV9kb2ktdG9rZW4uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvb3B0LWlucy91cGRhdGVfc3RhdHVzLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL21vZHVsZXMvc2VydmVyL29wdC1pbnMvdmVyaWZ5LmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL21vZHVsZXMvc2VydmVyL3JlY2lwaWVudHMvYWRkLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL21vZHVsZXMvc2VydmVyL3NlbmRlcnMvYWRkLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL3N0YXJ0dXAvc2VydmVyL2RhcHAtY29uZmlndXJhdGlvbi5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9zdGFydHVwL3NlcnZlci9kbnMtY29uZmlndXJhdGlvbi5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9zdGFydHVwL3NlcnZlci9kb2ljaGFpbi1jb25maWd1cmF0aW9uLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL3N0YXJ0dXAvc2VydmVyL2VtYWlsLWNvbmZpZ3VyYXRpb24uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvc3RhcnR1cC9zZXJ2ZXIvZml4dHVyZXMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvc3RhcnR1cC9zZXJ2ZXIvaW5kZXguanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvc3RhcnR1cC9zZXJ2ZXIvam9icy5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9zdGFydHVwL3NlcnZlci9sb2ctY29uZmlndXJhdGlvbi5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9zdGFydHVwL3NlcnZlci9yZWdpc3Rlci1hcGkuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvc3RhcnR1cC9zZXJ2ZXIvc2VjdXJpdHkuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvc3RhcnR1cC9zZXJ2ZXIvdHlwZS1jb25maWd1cmF0aW9uLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL3N0YXJ0dXAvc2VydmVyL3VzZXJhY2NvdW50cy1jb25maWd1cmF0aW9uLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvYXBpL3Jlc3QvaW1wb3J0cy9jb25maXJtLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvYXBpL3Jlc3QvaW1wb3J0cy9kZWJ1Zy5qcyIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL2FwaS9yZXN0L2ltcG9ydHMvc2VuZC5qcyIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL2FwaS9yZXN0L2ltcG9ydHMvc3RhdHVzLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvYXBpL3Jlc3QvaW1wb3J0cy91c2VyLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvYXBpL3Jlc3QvaW1wb3J0cy92ZXJpZnkuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9hcGkvcmVzdC9yZXN0LmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvYXBpL2Jsb2NrY2hhaW5fam9icy5qcyIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL2FwaS9kYXBwX2pvYnMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9hcGkvZG5zLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvYXBpL2RvaWNoYWluLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvYXBpL2h0dHAuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9hcGkvaW5kZXguanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9hcGkvbWFpbF9qb2JzLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWFpbi5qcyJdLCJuYW1lcyI6WyJNZXRlb3IiLCJtb2R1bGUiLCJsaW5rIiwidiIsIlJvbGVzIiwiT3B0SW5zIiwicHVibGlzaCIsIk9wdEluc0FsbCIsInVzZXJJZCIsInJlYWR5IiwidXNlcklzSW5Sb2xlIiwiZmluZCIsIm93bmVySWQiLCJmaWVsZHMiLCJwdWJsaWNGaWVsZHMiLCJERFBSYXRlTGltaXRlciIsImkxOG4iLCJfaTE4biIsIlZhbGlkYXRlZE1ldGhvZCIsIl8iLCJhZGRPcHRJbiIsImRlZmF1bHQiLCJhZGQiLCJuYW1lIiwidmFsaWRhdGUiLCJydW4iLCJyZWNpcGllbnRNYWlsIiwic2VuZGVyTWFpbCIsImRhdGEiLCJlcnJvciIsIkVycm9yIiwiX18iLCJvcHRJbiIsIk9QVElPTlNfTUVUSE9EUyIsInBsdWNrIiwiaXNTZXJ2ZXIiLCJhZGRSdWxlIiwiY29udGFpbnMiLCJjb25uZWN0aW9uSWQiLCJleHBvcnQiLCJNb25nbyIsIlNpbXBsZVNjaGVtYSIsIk9wdEluc0NvbGxlY3Rpb24iLCJDb2xsZWN0aW9uIiwiaW5zZXJ0IiwiY2FsbGJhY2siLCJvdXJPcHRJbiIsInJlY2lwaWVudF9zZW5kZXIiLCJyZWNpcGllbnQiLCJzZW5kZXIiLCJjcmVhdGVkQXQiLCJEYXRlIiwicmVzdWx0IiwidXBkYXRlIiwic2VsZWN0b3IiLCJtb2RpZmllciIsInJlbW92ZSIsImRlbnkiLCJzY2hlbWEiLCJfaWQiLCJ0eXBlIiwiU3RyaW5nIiwicmVnRXgiLCJSZWdFeCIsIklkIiwib3B0aW9uYWwiLCJkZW55VXBkYXRlIiwiaW5kZXgiLCJJbnRlZ2VyIiwibmFtZUlkIiwidHhJZCIsIm1hc3RlckRvaSIsImNvbmZpcm1lZEF0IiwiY29uZmlybWVkQnkiLCJJUCIsImNvbmZpcm1hdGlvblRva2VuIiwiYXR0YWNoU2NoZW1hIiwiUmVjaXBpZW50cyIsInJlY2lwaWVudEdldCIsInBpcGVsaW5lIiwicHVzaCIsIiRyZWRhY3QiLCIkY29uZCIsImlmIiwiJGNtcCIsInRoZW4iLCJlbHNlIiwiJGxvb2t1cCIsImZyb20iLCJsb2NhbEZpZWxkIiwiZm9yZWlnbkZpZWxkIiwiYXMiLCIkdW53aW5kIiwiJHByb2plY3QiLCJhZ2dyZWdhdGUiLCJySWRzIiwiZm9yRWFjaCIsImVsZW1lbnQiLCJSZWNpcGllbnRFbWFpbCIsInJlY2lwaWVudHNBbGwiLCJSZWNpcGllbnRzQ29sbGVjdGlvbiIsIm91clJlY2lwaWVudCIsImVtYWlsIiwicHJpdmF0ZUtleSIsInVuaXF1ZSIsInB1YmxpY0tleSIsIkRvaWNoYWluRW50cmllcyIsIkRvaWNoYWluRW50cmllc0NvbGxlY3Rpb24iLCJlbnRyeSIsInZhbHVlIiwiYWRkcmVzcyIsImdldEtleVBhaXJNIiwiZ2V0QmFsYW5jZU0iLCJnZXRLZXlQYWlyIiwiZ2V0QmFsYW5jZSIsImxvZ1ZhbCIsIk9QVElOU19NRVRIT0RTIiwiZ2V0TGFuZ3VhZ2VzIiwiZ2V0QWxsTGFuZ3VhZ2VzIiwiTWV0YSIsIk1ldGFDb2xsZWN0aW9uIiwib3VyRGF0YSIsImtleSIsIlNlbmRlcnMiLCJTZW5kZXJzQ29sbGVjdGlvbiIsIm91clNlbmRlciIsInZlcnNpb24iLCJET0lfTUFJTF9GRVRDSF9VUkwiLCJsb2dTZW5kIiwiRXhwb3J0RG9pc0RhdGFTY2hlbWEiLCJzdGF0dXMiLCJyb2xlIiwidXNlcmlkIiwiaWQiLCJleHBvcnREb2lzIiwiJG1hdGNoIiwiJGV4aXN0cyIsIiRuZSIsInVuZGVmaW5lZCIsImNvbmNhdCIsIm9wdElucyIsImV4cG9ydERvaURhdGEiLCJKU09OIiwic3RyaW5naWZ5IiwiZXhjZXB0aW9uIiwiZXhwb3J0RGVmYXVsdCIsIkRPSV9GRVRDSF9ST1VURSIsIkRPSV9DT05GSVJNQVRJT05fUk9VVEUiLCJBUElfUEFUSCIsIlZFUlNJT04iLCJnZXRVcmwiLCJDT05GSVJNX0NMSUVOVCIsIkNPTkZJUk1fQUREUkVTUyIsImdldEh0dHBHRVQiLCJzaWduTWVzc2FnZSIsInBhcnNlVGVtcGxhdGUiLCJnZW5lcmF0ZURvaVRva2VuIiwiZ2VuZXJhdGVEb2lIYXNoIiwiYWRkU2VuZE1haWxKb2IiLCJsb2dDb25maXJtIiwibG9nRXJyb3IiLCJGZXRjaERvaU1haWxEYXRhU2NoZW1hIiwiZG9tYWluIiwiZmV0Y2hEb2lNYWlsRGF0YSIsInVybCIsInNpZ25hdHVyZSIsInF1ZXJ5IiwiZW5jb2RlVVJJQ29tcG9uZW50IiwicmVzcG9uc2UiLCJyZXNwb25zZURhdGEiLCJpbmNsdWRlcyIsIm9wdEluSWQiLCJmaW5kT25lIiwidG9rZW4iLCJjb25maXJtYXRpb25IYXNoIiwicmVkaXJlY3QiLCJjb25maXJtYXRpb25VcmwiLCJ0ZW1wbGF0ZSIsImNvbnRlbnQiLCJjb25maXJtYXRpb25fdXJsIiwidG8iLCJzdWJqZWN0IiwibWVzc2FnZSIsInJldHVyblBhdGgiLCJnZXRPcHRJblByb3ZpZGVyIiwiZ2V0T3B0SW5LZXkiLCJ2ZXJpZnlTaWduYXR1cmUiLCJBY2NvdW50cyIsIkdldERvaU1haWxEYXRhU2NoZW1hIiwibmFtZV9pZCIsInVzZXJQcm9maWxlU2NoZW1hIiwiRW1haWwiLCJ0ZW1wbGF0ZVVSTCIsImdldERvaU1haWxEYXRhIiwicGFydHMiLCJzcGxpdCIsImxlbmd0aCIsInByb3ZpZGVyIiwiZG9pTWFpbERhdGEiLCJkZWZhdWx0UmV0dXJuRGF0YSIsInJldHVybkRhdGEiLCJvd25lciIsInVzZXJzIiwibWFpbFRlbXBsYXRlIiwicHJvZmlsZSIsInJlc29sdmVUeHQiLCJGQUxMQkFDS19QUk9WSURFUiIsImlzUmVndGVzdCIsImlzVGVzdG5ldCIsIk9QVF9JTl9LRVkiLCJPUFRfSU5fS0VZX1RFU1RORVQiLCJHZXRPcHRJbktleVNjaGVtYSIsIm91ck9QVF9JTl9LRVkiLCJmb3VuZEtleSIsImRuc2tleSIsInVzZUZhbGxiYWNrIiwiUFJPVklERVJfS0VZIiwiUFJPVklERVJfS0VZX1RFU1RORVQiLCJHZXRPcHRJblByb3ZpZGVyU2NoZW1hIiwib3VyUFJPVklERVJfS0VZIiwicHJvdmlkZXJLZXkiLCJnZXRXaWYiLCJhZGRGZXRjaERvaU1haWxEYXRhSm9iIiwiZ2V0UHJpdmF0ZUtleUZyb21XaWYiLCJkZWNyeXB0TWVzc2FnZSIsIkFkZERvaWNoYWluRW50cnlTY2hlbWEiLCJhZGREb2ljaGFpbkVudHJ5Iiwib3VyRW50cnkiLCJldHkiLCJwYXJzZSIsIndpZiIsIm5hbWVQb3MiLCJpbmRleE9mIiwic3Vic3RyaW5nIiwiZXhwaXJlc0luIiwiZXhwaXJlZCIsImxpc3RTaW5jZUJsb2NrIiwibmFtZVNob3ciLCJnZXRSYXdUcmFuc2FjdGlvbiIsImFkZE9yVXBkYXRlTWV0YSIsIlRYX05BTUVfU1RBUlQiLCJMQVNUX0NIRUNLRURfQkxPQ0tfS0VZIiwiY2hlY2tOZXdUcmFuc2FjdGlvbiIsInR4aWQiLCJqb2IiLCJsYXN0Q2hlY2tlZEJsb2NrIiwicmV0IiwidHJhbnNhY3Rpb25zIiwidHhzIiwibGFzdGJsb2NrIiwiYWRkcmVzc1R4cyIsImZpbHRlciIsInR4Iiwic3RhcnRzV2l0aCIsInR4TmFtZSIsImFkZFR4IiwiZG9uZSIsInZvdXQiLCJzY3JpcHRQdWJLZXkiLCJuYW1lT3AiLCJvcCIsImFkZHJlc3NlcyIsImNyeXB0byIsImVjaWVzIiwiRGVjcnlwdE1lc3NhZ2VTY2hlbWEiLCJCdWZmZXIiLCJlY2RoIiwiY3JlYXRlRUNESCIsInNldFByaXZhdGVLZXkiLCJkZWNyeXB0IiwidG9TdHJpbmciLCJFbmNyeXB0TWVzc2FnZVNjaGVtYSIsImVuY3J5cHRNZXNzYWdlIiwiZW5jcnlwdCIsIkdlbmVyYXRlTmFtZUlkU2NoZW1hIiwiZ2VuZXJhdGVOYW1lSWQiLCIkc2V0IiwiQ3J5cHRvSlMiLCJCYXNlNTgiLCJWRVJTSU9OX0JZVEUiLCJWRVJTSU9OX0JZVEVfUkVHVEVTVCIsIkdldEFkZHJlc3NTY2hlbWEiLCJnZXRBZGRyZXNzIiwiX2dldEFkZHJlc3MiLCJwdWJLZXkiLCJsaWIiLCJXb3JkQXJyYXkiLCJjcmVhdGUiLCJTSEEyNTYiLCJSSVBFTUQxNjAiLCJ2ZXJzaW9uQnl0ZSIsImNoZWNrc3VtIiwiZW5jb2RlIiwiZ2V0X0JhbGFuY2UiLCJiYWwiLCJHZXREYXRhSGFzaFNjaGVtYSIsImdldERhdGFIYXNoIiwiaGFzaCIsInJhbmRvbUJ5dGVzIiwic2VjcDI1NmsxIiwicHJpdktleSIsInByaXZhdGVLZXlWZXJpZnkiLCJwdWJsaWNLZXlDcmVhdGUiLCJ0b1VwcGVyQ2FzZSIsIkdldFByaXZhdGVLZXlGcm9tV2lmU2NoZW1hIiwiX2dldFByaXZhdGVLZXlGcm9tV2lmIiwiZGVjb2RlIiwiZW5kc1dpdGgiLCJHZXRQdWJsaWNLZXlTY2hlbWEiLCJnZXRQdWJsaWNLZXlBbmRBZGRyZXNzIiwiZGVzdEFkZHJlc3MiLCJiaXRjb3JlIiwiTWVzc2FnZSIsIkdldFNpZ25hdHVyZVNjaGVtYSIsImdldFNpZ25hdHVyZSIsInNpZ24iLCJQcml2YXRlS2V5IiwiU0VORF9DTElFTlQiLCJsb2dCbG9ja2NoYWluIiwiZmVlRG9pIiwibmFtZURvaSIsIkluc2VydFNjaGVtYSIsImRhdGFIYXNoIiwic29pRGF0ZSIsInB1YmxpY0tleUFuZEFkZHJlc3MiLCJuYW1lVmFsdWUiLCJmZWVEb2lUeCIsIm5hbWVEb2lUeCIsImdldFRyYW5zYWN0aW9uIiwiRE9JX0NPTkZJUk1BVElPTl9OT1RJRllfUk9VVEUiLCJnZXRIdHRwUFVUIiwiVXBkYXRlU2NoZW1hIiwiaG9zdCIsImZyb21Ib3N0VXJsIiwibmFtZV9kYXRhIiwicmVydW4iLCJvdXJfdHJhbnNhY3Rpb24iLCJjb25maXJtYXRpb25zIiwib3VyZnJvbUhvc3RVcmwiLCJ1cGRhdGVEYXRhIiwiY2FuY2VsIiwicmVzdGFydCIsImVyciIsImxvZ1ZlcmlmeSIsIk5FVFdPUksiLCJOZXR3b3JrcyIsImFsaWFzIiwicHVia2V5aGFzaCIsInByaXZhdGVrZXkiLCJzY3JpcHRoYXNoIiwibmV0d29ya01hZ2ljIiwiVmVyaWZ5U2lnbmF0dXJlU2NoZW1hIiwiQWRkcmVzcyIsImZyb21QdWJsaWNLZXkiLCJQdWJsaWNLZXkiLCJ2ZXJpZnkiLCJhZGRJbnNlcnRCbG9ja2NoYWluSm9iIiwiV3JpdGVUb0Jsb2NrY2hhaW5TY2hlbWEiLCJ3cml0ZVRvQmxvY2tjaGFpbiIsIkhhc2hJZHMiLCJEZWNvZGVEb2lIYXNoU2NoZW1hIiwiZGVjb2RlRG9pSGFzaCIsIm91ckhhc2giLCJoZXgiLCJkZWNvZGVIZXgiLCJvYmoiLCJHZW5lcmF0ZURvaUhhc2hTY2hlbWEiLCJqc29uIiwiZW5jb2RlSGV4IiwiUExBQ0VIT0xERVJfUkVHRVgiLCJQYXJzZVRlbXBsYXRlU2NoZW1hIiwiT2JqZWN0IiwiYmxhY2tib3giLCJfbWF0Y2giLCJleGVjIiwiX3JlcGxhY2VQbGFjZWhvbGRlciIsInJlcGxhY2UiLCJyZXAiLCJET0lfTUFJTF9ERUZBVUxUX0VNQUlMX0ZST00iLCJTZW5kTWFpbFNjaGVtYSIsInNlbmRNYWlsIiwibWFpbCIsIm91ck1haWwiLCJzZW5kIiwiaHRtbCIsImhlYWRlcnMiLCJKb2IiLCJCbG9ja2NoYWluSm9icyIsImFkZENoZWNrTmV3VHJhbnNhY3Rpb25zQmxvY2tjaGFpbkpvYiIsInJldHJ5IiwicmV0cmllcyIsIndhaXQiLCJzYXZlIiwiY2FuY2VsUmVwZWF0cyIsIkRBcHBKb2JzIiwiQWRkRmV0Y2hEb2lNYWlsRGF0YUpvYlNjaGVtYSIsIkFkZEluc2VydEJsb2NrY2hhaW5Kb2JTY2hlbWEiLCJNYWlsSm9icyIsIkFkZFNlbmRNYWlsSm9iU2NoZW1hIiwiQWRkVXBkYXRlQmxvY2tjaGFpbkpvYlNjaGVtYSIsImFkZFVwZGF0ZUJsb2NrY2hhaW5Kb2IiLCJBZGRPclVwZGF0ZU1ldGFTY2hlbWEiLCJtZXRhIiwiQWRkT3B0SW5TY2hlbWEiLCJmZXRjaCIsImFkZFJlY2lwaWVudCIsImFkZFNlbmRlciIsInJlY2lwaWVudF9tYWlsIiwic2VuZGVyX21haWwiLCJtYXN0ZXJfZG9pIiwicmVjaXBpZW50SWQiLCJzZW5kZXJJZCIsIkNvbmZpcm1PcHRJblNjaGVtYSIsImNvbmZpcm1PcHRJbiIsInJlcXVlc3QiLCJvdXJSZXF1ZXN0IiwiZGVjb2RlZCIsIiR1bnNldCIsImVudHJpZXMiLCIkb3IiLCJkb2lTaWduYXR1cmUiLCJkb2lUaW1lc3RhbXAiLCJ0b0lTT1N0cmluZyIsImpzb25WYWx1ZSIsIkdlbmVyYXRlRG9pVG9rZW5TY2hlbWEiLCJVcGRhdGVPcHRJblN0YXR1c1NjaGVtYSIsInVwZGF0ZU9wdEluU3RhdHVzIiwiVkVSSUZZX0NMSUVOVCIsIlZlcmlmeU9wdEluU2NoZW1hIiwicmVjaXBpZW50X3B1YmxpY19rZXkiLCJ2ZXJpZnlPcHRJbiIsImVudHJ5RGF0YSIsImZpcnN0Q2hlY2siLCJzZWNvbmRDaGVjayIsIkFkZFJlY2lwaWVudFNjaGVtYSIsInJlY2lwaWVudHMiLCJrZXlQYWlyIiwiQWRkU2VuZGVyU2NoZW1hIiwic2VuZGVycyIsImlzRGVidWciLCJzZXR0aW5ncyIsImFwcCIsImRlYnVnIiwicmVndGVzdCIsInRlc3RuZXQiLCJwb3J0IiwiYWJzb2x1dGVVcmwiLCJuYW1lY29pbiIsIlNFTkRfQVBQIiwiQ09ORklSTV9BUFAiLCJWRVJJRllfQVBQIiwiaXNBcHBUeXBlIiwic2VuZFNldHRpbmdzIiwic2VuZENsaWVudCIsImRvaWNoYWluIiwiY3JlYXRlQ2xpZW50IiwiY29uZmlybVNldHRpbmdzIiwiY29uZmlybSIsImNvbmZpcm1DbGllbnQiLCJjb25maXJtQWRkcmVzcyIsInZlcmlmeVNldHRpbmdzIiwidmVyaWZ5Q2xpZW50IiwiQ2xpZW50IiwidXNlciIsInVzZXJuYW1lIiwicGFzcyIsInBhc3N3b3JkIiwiSGFzaGlkcyIsImRvaU1haWxGZXRjaFVybCIsImRlZmF1bHRGcm9tIiwic210cCIsInN0YXJ0dXAiLCJwcm9jZXNzIiwiZW52IiwiTUFJTF9VUkwiLCJzZXJ2ZXIiLCJOT0RFX1RMU19SRUpFQ1RfVU5BVVRIT1JJWkVEIiwiQXNzZXRzIiwiZ2V0VGV4dCIsImNvdW50IiwiY3JlYXRlVXNlciIsImFkZFVzZXJzVG9Sb2xlcyIsInN0YXJ0Sm9iU2VydmVyIiwiY29uc29sZSIsInNlbmRNb2RlVGFnQ29sb3IiLCJjb25maXJtTW9kZVRhZ0NvbG9yIiwidmVyaWZ5TW9kZVRhZ0NvbG9yIiwiYmxvY2tjaGFpbk1vZGVUYWdDb2xvciIsInRlc3RpbmdNb2RlVGFnQ29sb3IiLCJsb2dNYWluIiwidGVzdExvZ2dpbmciLCJyZXF1aXJlIiwibXNnIiwiY29sb3JzIiwicGFyYW0iLCJ0aW1lIiwidGFnIiwibG9nIiwiQVVUSF9NRVRIT0RTIiwidHlwZXMiLCJjb25maWciLCJzZW5kVmVyaWZpY2F0aW9uRW1haWwiLCJmb3JiaWRDbGllbnRBY2NvdW50Q3JlYXRpb24iLCJlbWFpbFRlbXBsYXRlcyIsIkFwaSIsIkRPSV9XQUxMRVROT1RJRllfUk9VVEUiLCJhZGRSb3V0ZSIsImF1dGhSZXF1aXJlZCIsImdldCIsImFjdGlvbiIsInVybFBhcmFtcyIsImlwIiwiY29ubmVjdGlvbiIsInJlbW90ZUFkZHJlc3MiLCJzb2NrZXQiLCJzdGF0dXNDb2RlIiwiYm9keSIsInBhcmFtcyIsInF1ZXJ5UGFyYW1zIiwiRE9JX0VYUE9SVF9ST1VURSIsInBvc3QiLCJxUGFyYW1zIiwiYlBhcmFtcyIsImJvZHlQYXJhbXMiLCJ1aWQiLCJjb25zdHJ1Y3RvciIsIkFycmF5IiwicHJlcGFyZUNvRE9JIiwicHJlcGFyZUFkZCIsInB1dCIsInZhbCIsIm93bmVySUQiLCJjdXJyZW50T3B0SW5JZCIsInJldFJlc3BvbnNlIiwicmV0X3Jlc3BvbnNlIiwiZ2V0SW5mbyIsIm1haWxUZW1wbGF0ZVNjaGVtYSIsImNyZWF0ZVVzZXJTY2hlbWEiLCJ1cGRhdGVVc2VyU2NoZW1hIiwiY29sbGVjdGlvbk9wdGlvbnMiLCJwYXRoIiwicm91dGVPcHRpb25zIiwiZXhjbHVkZWRFbmRwb2ludHMiLCJlbmRwb2ludHMiLCJkZWxldGUiLCJyb2xlUmVxdWlyZWQiLCJwYXJhbUlkIiwiYWRkQ29sbGVjdGlvbiIsIlJlc3RpdnVzIiwiYXBpUGF0aCIsInVzZURlZmF1bHRBdXRoIiwicHJldHR5SnNvbiIsIkpvYkNvbGxlY3Rpb24iLCJwcm9jZXNzSm9icyIsIndvcmtUaW1lb3V0IiwiY2IiLCJmYWlsIiwicGF1c2UiLCJyZXBlYXQiLCJzY2hlZHVsZSIsImxhdGVyIiwidGV4dCIsInEiLCJwb2xsSW50ZXJ2YWwiLCJjdXJyZW50Iiwic2V0TWludXRlcyIsImdldE1pbnV0ZXMiLCJpZHMiLCIkaW4iLCJqb2JTdGF0dXNSZW1vdmFibGUiLCJ1cGRhdGVkIiwiJGx0IiwicmVtb3ZlSm9icyIsIm9ic2VydmUiLCJhZGRlZCIsInRyaWdnZXIiLCJkbnMiLCJzeW5jRnVuYyIsIndyYXBBc3luYyIsImRuc19yZXNvbHZlVHh0IiwicmVjb3JkcyIsInJlY29yZCIsInRyaW0iLCJnZXRBZGRyZXNzZXNCeUFjY291bnQiLCJnZXROZXdBZGRyZXNzIiwiTkFNRVNQQUNFIiwiY2xpZW50IiwiZG9pY2hhaW5fZHVtcHByaXZrZXkiLCJvdXJBZGRyZXNzIiwiY21kIiwiYWNjb3V0IiwiZG9pY2hhaW5fZ2V0YWRkcmVzc2VzYnlhY2NvdW50IiwiYWNjb3VudCIsIm91ckFjY291bnQiLCJkb2ljaGFpbl9nZXRuZXdhZGRyZXNzIiwiZG9pY2hhaW5fc2lnbk1lc3NhZ2UiLCJvdXJNZXNzYWdlIiwiZG9pY2hhaW5fbmFtZVNob3ciLCJvdXJJZCIsImNoZWNrSWQiLCJkb2ljaGFpbl9mZWVEb2kiLCJkb2ljaGFpbl9uYW1lRG9pIiwib3VyTmFtZSIsIm91clZhbHVlIiwiYmxvY2siLCJkb2ljaGFpbl9saXN0U2luY2VCbG9jayIsIm91ckJsb2NrIiwiZG9pY2hhaW5fZ2V0dHJhbnNhY3Rpb24iLCJkb2ljaGFpbl9nZXRyYXd0cmFuc2FjdGlvbiIsImRvaWNoYWluX2dldGJhbGFuY2UiLCJkb2ljaGFpbl9nZXRpbmZvIiwiRE9JX1BSRUZJWCIsInJldF92YWwiLCJnZXRIdHRwR0VUZGF0YSIsImdldEh0dHBQT1NUIiwiSFRUUCIsIl9nZXQiLCJfZ2V0RGF0YSIsIl9wb3N0IiwiX3B1dCIsIm91clVybCIsIm91clF1ZXJ5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLElBQUlBLE1BQUo7QUFBV0MsTUFBTSxDQUFDQyxJQUFQLENBQVksZUFBWixFQUE0QjtBQUFDRixRQUFNLENBQUNHLENBQUQsRUFBRztBQUFDSCxVQUFNLEdBQUNHLENBQVA7QUFBUzs7QUFBcEIsQ0FBNUIsRUFBa0QsQ0FBbEQ7QUFBcUQsSUFBSUMsS0FBSjtBQUFVSCxNQUFNLENBQUNDLElBQVAsQ0FBWSx1QkFBWixFQUFvQztBQUFDRSxPQUFLLENBQUNELENBQUQsRUFBRztBQUFDQyxTQUFLLEdBQUNELENBQU47QUFBUTs7QUFBbEIsQ0FBcEMsRUFBd0QsQ0FBeEQ7QUFBMkQsSUFBSUUsTUFBSjtBQUFXSixNQUFNLENBQUNDLElBQVAsQ0FBWSxlQUFaLEVBQTRCO0FBQUNHLFFBQU0sQ0FBQ0YsQ0FBRCxFQUFHO0FBQUNFLFVBQU0sR0FBQ0YsQ0FBUDtBQUFTOztBQUFwQixDQUE1QixFQUFrRCxDQUFsRDtBQUtoSkgsTUFBTSxDQUFDTSxPQUFQLENBQWUsYUFBZixFQUE4QixTQUFTQyxTQUFULEdBQXFCO0FBQ2pELE1BQUcsQ0FBQyxLQUFLQyxNQUFULEVBQWlCO0FBQ2YsV0FBTyxLQUFLQyxLQUFMLEVBQVA7QUFDRDs7QUFDRCxNQUFHLENBQUNMLEtBQUssQ0FBQ00sWUFBTixDQUFtQixLQUFLRixNQUF4QixFQUFnQyxDQUFDLE9BQUQsQ0FBaEMsQ0FBSixFQUErQztBQUM3QyxXQUFPSCxNQUFNLENBQUNNLElBQVAsQ0FBWTtBQUFDQyxhQUFPLEVBQUMsS0FBS0o7QUFBZCxLQUFaLEVBQW1DO0FBQ3hDSyxZQUFNLEVBQUVSLE1BQU0sQ0FBQ1M7QUFEeUIsS0FBbkMsQ0FBUDtBQUdEOztB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OiIvYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgeyBSb2xlcyB9IGZyb20gJ21ldGVvci9hbGFubmluZzpyb2xlcyc7XG5cbmltcG9ydCB7IE9wdElucyB9IGZyb20gJy4uL29wdC1pbnMuanMnO1xuXG5NZXRlb3IucHVibGlzaCgnb3B0LWlucy5hbGwnLCBmdW5jdGlvbiBPcHRJbnNBbGwoKSB7XG4gIGlmKCF0aGlzLnVzZXJJZCkge1xuICAgIHJldHVybiB0aGlzLnJlYWR5KCk7XG4gIH1cbiAgaWYoIVJvbGVzLnVzZXJJc0luUm9sZSh0aGlzLnVzZXJJZCwgWydhZG1pbiddKSl7XG4gICAgcmV0dXJuIE9wdElucy5maW5kKHtvd25lcklkOnRoaXMudXNlcklkfSwge1xuICAgICAgZmllbGRzOiBPcHRJbnMucHVibGljRmllbGRzLFxuICAgIH0pO1xuICB9XG4gIFxuXG4gIHJldHVybiBPcHRJbnMuZmluZCh7fSwge1xuICAgIGZpZWxkczogT3B0SW5zLnB1YmxpY0ZpZWxkcyxcbiAgfSk7XG59KTtcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IHsgRERQUmF0ZUxpbWl0ZXIgfSBmcm9tICdtZXRlb3IvZGRwLXJhdGUtbGltaXRlcic7XG5pbXBvcnQgeyBfaTE4biBhcyBpMThuIH0gZnJvbSAnbWV0ZW9yL3VuaXZlcnNlOmkxOG4nO1xuaW1wb3J0IHsgVmFsaWRhdGVkTWV0aG9kIH0gZnJvbSAnbWV0ZW9yL21kZzp2YWxpZGF0ZWQtbWV0aG9kJztcbmltcG9ydCB7IFJvbGVzIH0gZnJvbSAnbWV0ZW9yL2FsYW5uaW5nOnJvbGVzJztcbmltcG9ydCB7IF8gfSBmcm9tICdtZXRlb3IvdW5kZXJzY29yZSc7XG5pbXBvcnQgYWRkT3B0SW4gZnJvbSAnLi4vLi4vbW9kdWxlcy9zZXJ2ZXIvb3B0LWlucy9hZGRfYW5kX3dyaXRlX3RvX2Jsb2NrY2hhaW4uanMnO1xuXG5jb25zdCBhZGQgPSBuZXcgVmFsaWRhdGVkTWV0aG9kKHtcbiAgbmFtZTogJ29wdC1pbnMuYWRkJyxcbiAgdmFsaWRhdGU6IG51bGwsXG4gIHJ1bih7IHJlY2lwaWVudE1haWwsIHNlbmRlck1haWwsIGRhdGEgfSkge1xuICAgIGlmKCF0aGlzLnVzZXJJZCB8fCAhUm9sZXMudXNlcklzSW5Sb2xlKHRoaXMudXNlcklkLCBbJ2FkbWluJ10pKSB7XG4gICAgICBjb25zdCBlcnJvciA9IFwiYXBpLm9wdC1pbnMuYWRkLmFjY2Vzc0RlbmllZFwiO1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcihlcnJvciwgaTE4bi5fXyhlcnJvcikpO1xuICAgIH1cblxuICAgIGNvbnN0IG9wdEluID0ge1xuICAgICAgXCJyZWNpcGllbnRfbWFpbFwiOiByZWNpcGllbnRNYWlsLFxuICAgICAgXCJzZW5kZXJfbWFpbFwiOiBzZW5kZXJNYWlsLFxuICAgICAgZGF0YVxuICAgIH1cblxuICAgIGFkZE9wdEluKG9wdEluKVxuICB9LFxufSk7XG5cbi8vIEdldCBsaXN0IG9mIGFsbCBtZXRob2QgbmFtZXMgb24gb3B0LWluc1xuY29uc3QgT1BUSU9OU19NRVRIT0RTID0gXy5wbHVjayhbXG4gIGFkZFxuXSwgJ25hbWUnKTtcblxuaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAvLyBPbmx5IGFsbG93IDUgb3B0LWluIG9wZXJhdGlvbnMgcGVyIGNvbm5lY3Rpb24gcGVyIHNlY29uZFxuICBERFBSYXRlTGltaXRlci5hZGRSdWxlKHtcbiAgICBuYW1lKG5hbWUpIHtcbiAgICAgIHJldHVybiBfLmNvbnRhaW5zKE9QVElPTlNfTUVUSE9EUywgbmFtZSk7XG4gICAgfSxcblxuICAgIC8vIFJhdGUgbGltaXQgcGVyIGNvbm5lY3Rpb24gSURcbiAgICBjb25uZWN0aW9uSWQoKSB7IHJldHVybiB0cnVlOyB9LFxuICB9LCA1LCAxMDAwKTtcbn1cbiIsImltcG9ydCB7IE1vbmdvIH0gZnJvbSAnbWV0ZW9yL21vbmdvJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcblxuY2xhc3MgT3B0SW5zQ29sbGVjdGlvbiBleHRlbmRzIE1vbmdvLkNvbGxlY3Rpb24ge1xuICBpbnNlcnQob3B0SW4sIGNhbGxiYWNrKSB7XG4gICAgY29uc3Qgb3VyT3B0SW4gPSBvcHRJbjtcbiAgICBvdXJPcHRJbi5yZWNpcGllbnRfc2VuZGVyID0gb3VyT3B0SW4ucmVjaXBpZW50K291ck9wdEluLnNlbmRlcjtcbiAgICBvdXJPcHRJbi5jcmVhdGVkQXQgPSBvdXJPcHRJbi5jcmVhdGVkQXQgfHwgbmV3IERhdGUoKTtcbiAgICBjb25zdCByZXN1bHQgPSBzdXBlci5pbnNlcnQob3VyT3B0SW4sIGNhbGxiYWNrKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIHVwZGF0ZShzZWxlY3RvciwgbW9kaWZpZXIpIHtcbiAgICBjb25zdCByZXN1bHQgPSBzdXBlci51cGRhdGUoc2VsZWN0b3IsIG1vZGlmaWVyKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIHJlbW92ZShzZWxlY3Rvcikge1xuICAgIGNvbnN0IHJlc3VsdCA9IHN1cGVyLnJlbW92ZShzZWxlY3Rvcik7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgT3B0SW5zID0gbmV3IE9wdEluc0NvbGxlY3Rpb24oJ29wdC1pbnMnKTtcblxuLy8gRGVueSBhbGwgY2xpZW50LXNpZGUgdXBkYXRlcyBzaW5jZSB3ZSB3aWxsIGJlIHVzaW5nIG1ldGhvZHMgdG8gbWFuYWdlIHRoaXMgY29sbGVjdGlvblxuT3B0SW5zLmRlbnkoe1xuICBpbnNlcnQoKSB7IHJldHVybiB0cnVlOyB9LFxuICB1cGRhdGUoKSB7IHJldHVybiB0cnVlOyB9LFxuICByZW1vdmUoKSB7IHJldHVybiB0cnVlOyB9LFxufSk7XG5cbk9wdElucy5zY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgX2lkOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIHJlZ0V4OiBTaW1wbGVTY2hlbWEuUmVnRXguSWQsXG4gIH0sXG4gIHJlY2lwaWVudDoge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICBvcHRpb25hbDogdHJ1ZSxcbiAgICBkZW55VXBkYXRlOiB0cnVlLFxuICB9LFxuICBzZW5kZXI6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgb3B0aW9uYWw6IHRydWUsXG4gICAgZGVueVVwZGF0ZTogdHJ1ZSxcbiAgfSxcbiAgZGF0YToge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICBvcHRpb25hbDogdHJ1ZSxcbiAgICBkZW55VXBkYXRlOiBmYWxzZSxcbiAgfSxcbiAgaW5kZXg6IHtcbiAgICB0eXBlOiBTaW1wbGVTY2hlbWEuSW50ZWdlcixcbiAgICBvcHRpb25hbDogdHJ1ZSxcbiAgICBkZW55VXBkYXRlOiBmYWxzZSxcbiAgfSxcbiAgbmFtZUlkOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIG9wdGlvbmFsOiB0cnVlLFxuICAgIGRlbnlVcGRhdGU6IGZhbHNlLFxuICB9LFxuICB0eElkOiB7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICBvcHRpb25hbDogdHJ1ZSxcbiAgICAgIGRlbnlVcGRhdGU6IGZhbHNlLFxuICB9LFxuICBtYXN0ZXJEb2k6IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIG9wdGlvbmFsOiB0cnVlLFxuICAgICAgZGVueVVwZGF0ZTogZmFsc2UsXG4gIH0sXG4gIGNyZWF0ZWRBdDoge1xuICAgIHR5cGU6IERhdGUsXG4gICAgZGVueVVwZGF0ZTogdHJ1ZSxcbiAgfSxcbiAgY29uZmlybWVkQXQ6IHtcbiAgICB0eXBlOiBEYXRlLFxuICAgIG9wdGlvbmFsOiB0cnVlLFxuICAgIGRlbnlVcGRhdGU6IGZhbHNlLFxuICB9LFxuICBjb25maXJtZWRCeToge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICByZWdFeDogU2ltcGxlU2NoZW1hLlJlZ0V4LklQLFxuICAgIG9wdGlvbmFsOiB0cnVlLFxuICAgIGRlbnlVcGRhdGU6IGZhbHNlXG4gIH0sXG4gIGNvbmZpcm1hdGlvblRva2VuOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIG9wdGlvbmFsOiB0cnVlLFxuICAgIGRlbnlVcGRhdGU6IGZhbHNlXG4gIH0sXG4gIG93bmVySWQ6e1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICBvcHRpb25hbDogdHJ1ZSxcbiAgICByZWdFeDogU2ltcGxlU2NoZW1hLlJlZ0V4LklkXG4gIH0sXG4gIGVycm9yOntcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIG9wdGlvbmFsOiB0cnVlLFxuICAgICAgZGVueVVwZGF0ZTogZmFsc2VcbiAgfVxufSk7XG5cbk9wdElucy5hdHRhY2hTY2hlbWEoT3B0SW5zLnNjaGVtYSk7XG5cbi8vIFRoaXMgcmVwcmVzZW50cyB0aGUga2V5cyBmcm9tIE9wdC1JbiBvYmplY3RzIHRoYXQgc2hvdWxkIGJlIHB1Ymxpc2hlZFxuLy8gdG8gdGhlIGNsaWVudC4gSWYgd2UgYWRkIHNlY3JldCBwcm9wZXJ0aWVzIHRvIE9wdC1JbiBvYmplY3RzLCBkb24ndCBsaXN0XG4vLyB0aGVtIGhlcmUgdG8ga2VlcCB0aGVtIHByaXZhdGUgdG8gdGhlIHNlcnZlci5cbk9wdElucy5wdWJsaWNGaWVsZHMgPSB7XG4gIF9pZDogMSxcbiAgcmVjaXBpZW50OiAxLFxuICBzZW5kZXI6IDEsXG4gIGRhdGE6IDEsXG4gIGluZGV4OiAxLFxuICBuYW1lSWQ6IDEsXG4gIHR4SWQ6IDEsXG4gIG1hc3RlckRvaTogMSxcbiAgY3JlYXRlZEF0OiAxLFxuICBjb25maXJtZWRBdDogMSxcbiAgY29uZmlybWVkQnk6IDEsXG4gIG93bmVySWQ6IDEsXG4gIGVycm9yOiAxXG59O1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgeyBSb2xlcyB9IGZyb20gJ21ldGVvci9hbGFubmluZzpyb2xlcyc7XG5cbmltcG9ydCB7IFJlY2lwaWVudHMgfSBmcm9tICcuLi9yZWNpcGllbnRzLmpzJztcbmltcG9ydCB7IE9wdEluc30gZnJvbSAnLi4vLi4vb3B0LWlucy9vcHQtaW5zLmpzJ1xuTWV0ZW9yLnB1Ymxpc2goJ3JlY2lwaWVudHMuYnlPd25lcicsZnVuY3Rpb24gcmVjaXBpZW50R2V0KCl7XG4gIGxldCBwaXBlbGluZT1bXTtcbiAgaWYoIVJvbGVzLnVzZXJJc0luUm9sZSh0aGlzLnVzZXJJZCwgWydhZG1pbiddKSl7XG4gICAgcGlwZWxpbmUucHVzaChcbiAgICAgIHskcmVkYWN0OntcbiAgICAgICRjb25kOiB7XG4gICAgICAgIGlmOiB7ICRjbXA6IFsgXCIkb3duZXJJZFwiLCB0aGlzLnVzZXJJZCBdIH0sXG4gICAgICAgIHRoZW46IFwiJCRQUlVORVwiLFxuICAgICAgICBlbHNlOiBcIiQkS0VFUFwiIH19fSk7XG4gICAgICB9XG4gICAgICBwaXBlbGluZS5wdXNoKHsgJGxvb2t1cDogeyBmcm9tOiBcInJlY2lwaWVudHNcIiwgbG9jYWxGaWVsZDogXCJyZWNpcGllbnRcIiwgZm9yZWlnbkZpZWxkOiBcIl9pZFwiLCBhczogXCJSZWNpcGllbnRFbWFpbFwiIH0gfSk7XG4gICAgICBwaXBlbGluZS5wdXNoKHsgJHVud2luZDogXCIkUmVjaXBpZW50RW1haWxcIn0pO1xuICAgICAgcGlwZWxpbmUucHVzaCh7ICRwcm9qZWN0OiB7XCJSZWNpcGllbnRFbWFpbC5faWRcIjoxfX0pO1xuXG4gICAgICBjb25zdCByZXN1bHQgPSBPcHRJbnMuYWdncmVnYXRlKHBpcGVsaW5lKTtcbiAgICAgIGxldCBySWRzPVtdO1xuICAgICAgcmVzdWx0LmZvckVhY2goZWxlbWVudCA9PiB7XG4gICAgICAgIHJJZHMucHVzaChlbGVtZW50LlJlY2lwaWVudEVtYWlsLl9pZCk7XG4gICAgICB9KTtcbiAgcmV0dXJuIFJlY2lwaWVudHMuZmluZCh7XCJfaWRcIjp7XCIkaW5cIjpySWRzfX0se2ZpZWxkczpSZWNpcGllbnRzLnB1YmxpY0ZpZWxkc30pO1xufSk7XG5NZXRlb3IucHVibGlzaCgncmVjaXBpZW50cy5hbGwnLCBmdW5jdGlvbiByZWNpcGllbnRzQWxsKCkge1xuICBpZighdGhpcy51c2VySWQgfHwgIVJvbGVzLnVzZXJJc0luUm9sZSh0aGlzLnVzZXJJZCwgWydhZG1pbiddKSkge1xuICAgIHJldHVybiB0aGlzLnJlYWR5KCk7XG4gIH1cblxuICByZXR1cm4gUmVjaXBpZW50cy5maW5kKHt9LCB7XG4gICAgZmllbGRzOiBSZWNpcGllbnRzLnB1YmxpY0ZpZWxkcyxcbiAgfSk7XG59KTtcbiIsImltcG9ydCB7IE1vbmdvIH0gZnJvbSAnbWV0ZW9yL21vbmdvJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcblxuY2xhc3MgUmVjaXBpZW50c0NvbGxlY3Rpb24gZXh0ZW5kcyBNb25nby5Db2xsZWN0aW9uIHtcbiAgaW5zZXJ0KHJlY2lwaWVudCwgY2FsbGJhY2spIHtcbiAgICBjb25zdCBvdXJSZWNpcGllbnQgPSByZWNpcGllbnQ7XG4gICAgb3VyUmVjaXBpZW50LmNyZWF0ZWRBdCA9IG91clJlY2lwaWVudC5jcmVhdGVkQXQgfHwgbmV3IERhdGUoKTtcbiAgICBjb25zdCByZXN1bHQgPSBzdXBlci5pbnNlcnQob3VyUmVjaXBpZW50LCBjYWxsYmFjayk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICB1cGRhdGUoc2VsZWN0b3IsIG1vZGlmaWVyKSB7XG4gICAgY29uc3QgcmVzdWx0ID0gc3VwZXIudXBkYXRlKHNlbGVjdG9yLCBtb2RpZmllcik7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICByZW1vdmUoc2VsZWN0b3IpIHtcbiAgICBjb25zdCByZXN1bHQgPSBzdXBlci5yZW1vdmUoc2VsZWN0b3IpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IFJlY2lwaWVudHMgPSBuZXcgUmVjaXBpZW50c0NvbGxlY3Rpb24oJ3JlY2lwaWVudHMnKTtcblxuLy8gRGVueSBhbGwgY2xpZW50LXNpZGUgdXBkYXRlcyBzaW5jZSB3ZSB3aWxsIGJlIHVzaW5nIG1ldGhvZHMgdG8gbWFuYWdlIHRoaXMgY29sbGVjdGlvblxuUmVjaXBpZW50cy5kZW55KHtcbiAgaW5zZXJ0KCkgeyByZXR1cm4gdHJ1ZTsgfSxcbiAgdXBkYXRlKCkgeyByZXR1cm4gdHJ1ZTsgfSxcbiAgcmVtb3ZlKCkgeyByZXR1cm4gdHJ1ZTsgfSxcbn0pO1xuXG5SZWNpcGllbnRzLnNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICBfaWQ6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgcmVnRXg6IFNpbXBsZVNjaGVtYS5SZWdFeC5JZCxcbiAgfSxcbiAgZW1haWw6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgaW5kZXg6IHRydWUsXG4gICAgZGVueVVwZGF0ZTogdHJ1ZSxcbiAgfSxcbiAgcHJpdmF0ZUtleToge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICB1bmlxdWU6IHRydWUsXG4gICAgZGVueVVwZGF0ZTogdHJ1ZSxcbiAgfSxcbiAgcHVibGljS2V5OiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIHVuaXF1ZTogdHJ1ZSxcbiAgICBkZW55VXBkYXRlOiB0cnVlLFxuICB9LFxuICBjcmVhdGVkQXQ6IHtcbiAgICB0eXBlOiBEYXRlLFxuICAgIGRlbnlVcGRhdGU6IHRydWUsXG4gIH1cbn0pO1xuXG5SZWNpcGllbnRzLmF0dGFjaFNjaGVtYShSZWNpcGllbnRzLnNjaGVtYSk7XG5cbi8vIFRoaXMgcmVwcmVzZW50cyB0aGUga2V5cyBmcm9tIFJlY2lwaWVudCBvYmplY3RzIHRoYXQgc2hvdWxkIGJlIHB1Ymxpc2hlZFxuLy8gdG8gdGhlIGNsaWVudC4gSWYgd2UgYWRkIHNlY3JldCBwcm9wZXJ0aWVzIHRvIFJlY2lwaWVudCBvYmplY3RzLCBkb24ndCBsaXN0XG4vLyB0aGVtIGhlcmUgdG8ga2VlcCB0aGVtIHByaXZhdGUgdG8gdGhlIHNlcnZlci5cblJlY2lwaWVudHMucHVibGljRmllbGRzID0ge1xuICBfaWQ6IDEsXG4gIGVtYWlsOiAxLFxuICBwdWJsaWNLZXk6IDEsXG4gIGNyZWF0ZWRBdDogMVxufTtcbiIsImltcG9ydCB7IE1vbmdvIH0gZnJvbSAnbWV0ZW9yL21vbmdvJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcblxuY2xhc3MgRG9pY2hhaW5FbnRyaWVzQ29sbGVjdGlvbiBleHRlbmRzIE1vbmdvLkNvbGxlY3Rpb24ge1xuICBpbnNlcnQoZW50cnksIGNhbGxiYWNrKSB7XG4gICAgY29uc3QgcmVzdWx0ID0gc3VwZXIuaW5zZXJ0KGVudHJ5LCBjYWxsYmFjayk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICB1cGRhdGUoc2VsZWN0b3IsIG1vZGlmaWVyKSB7XG4gICAgY29uc3QgcmVzdWx0ID0gc3VwZXIudXBkYXRlKHNlbGVjdG9yLCBtb2RpZmllcik7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICByZW1vdmUoc2VsZWN0b3IpIHtcbiAgICBjb25zdCByZXN1bHQgPSBzdXBlci5yZW1vdmUoc2VsZWN0b3IpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IERvaWNoYWluRW50cmllcyA9IG5ldyBEb2ljaGFpbkVudHJpZXNDb2xsZWN0aW9uKCdkb2ljaGFpbi1lbnRyaWVzJyk7XG5cbi8vIERlbnkgYWxsIGNsaWVudC1zaWRlIHVwZGF0ZXMgc2luY2Ugd2Ugd2lsbCBiZSB1c2luZyBtZXRob2RzIHRvIG1hbmFnZSB0aGlzIGNvbGxlY3Rpb25cbkRvaWNoYWluRW50cmllcy5kZW55KHtcbiAgaW5zZXJ0KCkgeyByZXR1cm4gdHJ1ZTsgfSxcbiAgdXBkYXRlKCkgeyByZXR1cm4gdHJ1ZTsgfSxcbiAgcmVtb3ZlKCkgeyByZXR1cm4gdHJ1ZTsgfSxcbn0pO1xuXG5Eb2ljaGFpbkVudHJpZXMuc2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIF9pZDoge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICByZWdFeDogU2ltcGxlU2NoZW1hLlJlZ0V4LklkLFxuICB9LFxuICBuYW1lOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIGluZGV4OiB0cnVlLFxuICAgIGRlbnlVcGRhdGU6IHRydWVcbiAgfSxcbiAgdmFsdWU6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgZGVueVVwZGF0ZTogZmFsc2VcbiAgfSxcbiAgYWRkcmVzczoge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICBkZW55VXBkYXRlOiBmYWxzZVxuICB9LFxuICBtYXN0ZXJEb2k6IHtcbiAgICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgICBvcHRpb25hbDogdHJ1ZSxcbiAgICAgICAgaW5kZXg6IHRydWUsXG4gICAgICAgIGRlbnlVcGRhdGU6IHRydWVcbiAgfSxcbiAgaW5kZXg6IHtcbiAgICAgICAgdHlwZTogU2ltcGxlU2NoZW1hLkludGVnZXIsXG4gICAgICAgIG9wdGlvbmFsOiB0cnVlLFxuICAgICAgICBkZW55VXBkYXRlOiB0cnVlXG4gIH0sXG4gIHR4SWQ6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgZGVueVVwZGF0ZTogZmFsc2VcbiAgfVxufSk7XG5cbkRvaWNoYWluRW50cmllcy5hdHRhY2hTY2hlbWEoRG9pY2hhaW5FbnRyaWVzLnNjaGVtYSk7XG5cbi8vIFRoaXMgcmVwcmVzZW50cyB0aGUga2V5cyBmcm9tIEVudHJ5IG9iamVjdHMgdGhhdCBzaG91bGQgYmUgcHVibGlzaGVkXG4vLyB0byB0aGUgY2xpZW50LiBJZiB3ZSBhZGQgc2VjcmV0IHByb3BlcnRpZXMgdG8gRW50cnkgb2JqZWN0cywgZG9uJ3QgbGlzdFxuLy8gdGhlbSBoZXJlIHRvIGtlZXAgdGhlbSBwcml2YXRlIHRvIHRoZSBzZXJ2ZXIuXG5Eb2ljaGFpbkVudHJpZXMucHVibGljRmllbGRzID0ge1xuICBfaWQ6IDEsXG4gIG5hbWU6IDEsXG4gIHZhbHVlOiAxLFxuICBhZGRyZXNzOiAxLFxuICBtYXN0ZXJEb2k6IDEsXG4gIGluZGV4OiAxLFxuICB0eElkOiAxXG59O1xuIiwiaW1wb3J0IHsgVmFsaWRhdGVkTWV0aG9kIH0gZnJvbSAnbWV0ZW9yL21kZzp2YWxpZGF0ZWQtbWV0aG9kJztcbmltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IHsgRERQUmF0ZUxpbWl0ZXIgfSBmcm9tICdtZXRlb3IvZGRwLXJhdGUtbGltaXRlcic7XG5pbXBvcnQgZ2V0S2V5UGFpck0gZnJvbSAnLi4vLi4vbW9kdWxlcy9zZXJ2ZXIvZG9pY2hhaW4vZ2V0X2tleS1wYWlyLmpzJztcbmltcG9ydCBnZXRCYWxhbmNlTSBmcm9tICcuLi8uLi9tb2R1bGVzL3NlcnZlci9kb2ljaGFpbi9nZXRfYmFsYW5jZS5qcyc7XG5cblxuY29uc3QgZ2V0S2V5UGFpciA9IG5ldyBWYWxpZGF0ZWRNZXRob2Qoe1xuICBuYW1lOiAnZG9pY2hhaW4uZ2V0S2V5UGFpcicsXG4gIHZhbGlkYXRlOiBudWxsLFxuICBydW4oKSB7XG4gICAgcmV0dXJuIGdldEtleVBhaXJNKCk7XG4gIH0sXG59KTtcblxuY29uc3QgZ2V0QmFsYW5jZSA9IG5ldyBWYWxpZGF0ZWRNZXRob2Qoe1xuICBuYW1lOiAnZG9pY2hhaW4uZ2V0QmFsYW5jZScsXG4gIHZhbGlkYXRlOiBudWxsLFxuICBydW4oKSB7XG4gICAgY29uc3QgbG9nVmFsID0gZ2V0QmFsYW5jZU0oKTtcbiAgICByZXR1cm4gbG9nVmFsO1xuICB9LFxufSk7XG5cblxuLy8gR2V0IGxpc3Qgb2YgYWxsIG1ldGhvZCBuYW1lcyBvbiBkb2ljaGFpblxuY29uc3QgT1BUSU5TX01FVEhPRFMgPSBfLnBsdWNrKFtcbiAgZ2V0S2V5UGFpclxuLGdldEJhbGFuY2VdLCAnbmFtZScpO1xuXG5pZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIC8vIE9ubHkgYWxsb3cgNSBvcHQtaW4gb3BlcmF0aW9ucyBwZXIgY29ubmVjdGlvbiBwZXIgc2Vjb25kXG4gIEREUFJhdGVMaW1pdGVyLmFkZFJ1bGUoe1xuICAgIG5hbWUobmFtZSkge1xuICAgICAgcmV0dXJuIF8uY29udGFpbnMoT1BUSU5TX01FVEhPRFMsIG5hbWUpO1xuICAgIH0sXG5cbiAgICAvLyBSYXRlIGxpbWl0IHBlciBjb25uZWN0aW9uIElEXG4gICAgY29ubmVjdGlvbklkKCkgeyByZXR1cm4gdHJ1ZTsgfSxcbiAgfSwgNSwgMTAwMCk7XG59XG4iLCJpbXBvcnQgeyBNZXRlb3J9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IHsgRERQUmF0ZUxpbWl0ZXIgfSBmcm9tICdtZXRlb3IvZGRwLXJhdGUtbGltaXRlcic7XG5pbXBvcnQgeyBWYWxpZGF0ZWRNZXRob2QgfSBmcm9tICdtZXRlb3IvbWRnOnZhbGlkYXRlZC1tZXRob2QnO1xuaW1wb3J0IGdldExhbmd1YWdlcyBmcm9tICcuLi8uLi9tb2R1bGVzL3NlcnZlci9sYW5ndWFnZXMvZ2V0LmpzJztcblxuY29uc3QgZ2V0QWxsTGFuZ3VhZ2VzID0gbmV3IFZhbGlkYXRlZE1ldGhvZCh7XG4gIG5hbWU6ICdsYW5ndWFnZXMuZ2V0QWxsJyxcbiAgdmFsaWRhdGU6IG51bGwsXG4gIHJ1bigpIHtcbiAgICByZXR1cm4gZ2V0TGFuZ3VhZ2VzKCk7XG4gIH0sXG59KTtcblxuLy8gR2V0IGxpc3Qgb2YgYWxsIG1ldGhvZCBuYW1lcyBvbiBsYW5ndWFnZXNcbmNvbnN0IE9QVElOU19NRVRIT0RTID0gXy5wbHVjayhbXG4gIGdldEFsbExhbmd1YWdlc1xuXSwgJ25hbWUnKTtcblxuaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAvLyBPbmx5IGFsbG93IDUgb3B0LWluIG9wZXJhdGlvbnMgcGVyIGNvbm5lY3Rpb24gcGVyIHNlY29uZFxuICBERFBSYXRlTGltaXRlci5hZGRSdWxlKHtcbiAgICBuYW1lKG5hbWUpIHtcbiAgICAgIHJldHVybiBfLmNvbnRhaW5zKE9QVElOU19NRVRIT0RTLCBuYW1lKTtcbiAgICB9LFxuXG4gICAgLy8gUmF0ZSBsaW1pdCBwZXIgY29ubmVjdGlvbiBJRFxuICAgIGNvbm5lY3Rpb25JZCgpIHsgcmV0dXJuIHRydWU7IH0sXG4gIH0sIDUsIDEwMDApO1xufVxuIiwiaW1wb3J0IHsgTW9uZ28gfSBmcm9tICdtZXRlb3IvbW9uZ28nO1xuaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tICdzaW1wbC1zY2hlbWEnO1xuXG5jbGFzcyBNZXRhQ29sbGVjdGlvbiBleHRlbmRzIE1vbmdvLkNvbGxlY3Rpb24ge1xuICBpbnNlcnQoZGF0YSwgY2FsbGJhY2spIHtcbiAgICBjb25zdCBvdXJEYXRhID0gZGF0YTtcbiAgICBjb25zdCByZXN1bHQgPSBzdXBlci5pbnNlcnQob3VyRGF0YSwgY2FsbGJhY2spO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgdXBkYXRlKHNlbGVjdG9yLCBtb2RpZmllcikge1xuICAgIGNvbnN0IHJlc3VsdCA9IHN1cGVyLnVwZGF0ZShzZWxlY3RvciwgbW9kaWZpZXIpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgcmVtb3ZlKHNlbGVjdG9yKSB7XG4gICAgY29uc3QgcmVzdWx0ID0gc3VwZXIucmVtb3ZlKHNlbGVjdG9yKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG5cbmV4cG9ydCBjb25zdCBNZXRhID0gbmV3IE1ldGFDb2xsZWN0aW9uKCdtZXRhJyk7XG5cbi8vIERlbnkgYWxsIGNsaWVudC1zaWRlIHVwZGF0ZXMgc2luY2Ugd2Ugd2lsbCBiZSB1c2luZyBtZXRob2RzIHRvIG1hbmFnZSB0aGlzIGNvbGxlY3Rpb25cbk1ldGEuZGVueSh7XG4gIGluc2VydCgpIHsgcmV0dXJuIHRydWU7IH0sXG4gIHVwZGF0ZSgpIHsgcmV0dXJuIHRydWU7IH0sXG4gIHJlbW92ZSgpIHsgcmV0dXJuIHRydWU7IH0sXG59KTtcblxuTWV0YS5zY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgX2lkOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIHJlZ0V4OiBTaW1wbGVTY2hlbWEuUmVnRXguSWQsXG4gIH0sXG4gIGtleToge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICBpbmRleDogdHJ1ZSxcbiAgICBkZW55VXBkYXRlOiB0cnVlXG4gIH0sXG4gIHZhbHVlOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH1cbn0pO1xuXG5NZXRhLmF0dGFjaFNjaGVtYShNZXRhLnNjaGVtYSk7XG5cbi8vIFRoaXMgcmVwcmVzZW50cyB0aGUga2V5cyBmcm9tIE1ldGEgb2JqZWN0cyB0aGF0IHNob3VsZCBiZSBwdWJsaXNoZWRcbi8vIHRvIHRoZSBjbGllbnQuIElmIHdlIGFkZCBzZWNyZXQgcHJvcGVydGllcyB0byBNZXRhIG9iamVjdHMsIGRvbid0IGxpc3Rcbi8vIHRoZW0gaGVyZSB0byBrZWVwIHRoZW0gcHJpdmF0ZSB0byB0aGUgc2VydmVyLlxuTWV0YS5wdWJsaWNGaWVsZHMgPSB7XG59O1xuIiwiaW1wb3J0IHsgTW9uZ28gfSBmcm9tICdtZXRlb3IvbW9uZ28nO1xuaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tICdzaW1wbC1zY2hlbWEnO1xuXG5jbGFzcyBTZW5kZXJzQ29sbGVjdGlvbiBleHRlbmRzIE1vbmdvLkNvbGxlY3Rpb24ge1xuICBpbnNlcnQoc2VuZGVyLCBjYWxsYmFjaykge1xuICAgIGNvbnN0IG91clNlbmRlciA9IHNlbmRlcjtcbiAgICBvdXJTZW5kZXIuY3JlYXRlZEF0ID0gb3VyU2VuZGVyLmNyZWF0ZWRBdCB8fCBuZXcgRGF0ZSgpO1xuICAgIGNvbnN0IHJlc3VsdCA9IHN1cGVyLmluc2VydChvdXJTZW5kZXIsIGNhbGxiYWNrKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIHVwZGF0ZShzZWxlY3RvciwgbW9kaWZpZXIpIHtcbiAgICBjb25zdCByZXN1bHQgPSBzdXBlci51cGRhdGUoc2VsZWN0b3IsIG1vZGlmaWVyKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIHJlbW92ZShzZWxlY3Rvcikge1xuICAgIGNvbnN0IHJlc3VsdCA9IHN1cGVyLnJlbW92ZShzZWxlY3Rvcik7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgU2VuZGVycyA9IG5ldyBTZW5kZXJzQ29sbGVjdGlvbignc2VuZGVycycpO1xuXG4vLyBEZW55IGFsbCBjbGllbnQtc2lkZSB1cGRhdGVzIHNpbmNlIHdlIHdpbGwgYmUgdXNpbmcgbWV0aG9kcyB0byBtYW5hZ2UgdGhpcyBjb2xsZWN0aW9uXG5TZW5kZXJzLmRlbnkoe1xuICBpbnNlcnQoKSB7IHJldHVybiB0cnVlOyB9LFxuICB1cGRhdGUoKSB7IHJldHVybiB0cnVlOyB9LFxuICByZW1vdmUoKSB7IHJldHVybiB0cnVlOyB9LFxufSk7XG5cblNlbmRlcnMuc2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIF9pZDoge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICByZWdFeDogU2ltcGxlU2NoZW1hLlJlZ0V4LklkLFxuICB9LFxuICBlbWFpbDoge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICBpbmRleDogdHJ1ZSxcbiAgICBkZW55VXBkYXRlOiB0cnVlLFxuICB9LFxuICBjcmVhdGVkQXQ6IHtcbiAgICB0eXBlOiBEYXRlLFxuICAgIGRlbnlVcGRhdGU6IHRydWUsXG4gIH1cbn0pO1xuXG5TZW5kZXJzLmF0dGFjaFNjaGVtYShTZW5kZXJzLnNjaGVtYSk7XG5cbi8vIFRoaXMgcmVwcmVzZW50cyB0aGUga2V5cyBmcm9tIFNlbmRlciBvYmplY3RzIHRoYXQgc2hvdWxkIGJlIHB1Ymxpc2hlZFxuLy8gdG8gdGhlIGNsaWVudC4gSWYgd2UgYWRkIHNlY3JldCBwcm9wZXJ0aWVzIHRvIFNlbmRlciBvYmplY3RzLCBkb24ndCBsaXN0XG4vLyB0aGVtIGhlcmUgdG8ga2VlcCB0aGVtIHByaXZhdGUgdG8gdGhlIHNlcnZlci5cblNlbmRlcnMucHVibGljRmllbGRzID0ge1xuICBlbWFpbDogMSxcbiAgY3JlYXRlZEF0OiAxXG59O1xuIiwiaW1wb3J0IHsgTWV0ZW9yfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCB7IE1ldGEgfSBmcm9tICcuLi9tZXRhL21ldGEnO1xuXG5NZXRlb3IucHVibGlzaCgndmVyc2lvbicsIGZ1bmN0aW9uIHZlcnNpb24oKSB7XG4gIHJldHVybiBNZXRhLmZpbmQoe30pO1xufSk7XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcbmltcG9ydCB7IERPSV9NQUlMX0ZFVENIX1VSTCB9IGZyb20gJy4uLy4uLy4uL3N0YXJ0dXAvc2VydmVyL2VtYWlsLWNvbmZpZ3VyYXRpb24uanMnO1xuaW1wb3J0IHtsb2dTZW5kfSBmcm9tIFwiLi4vLi4vLi4vc3RhcnR1cC9zZXJ2ZXIvbG9nLWNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7T3B0SW5zfSBmcm9tIFwiLi4vLi4vLi4vYXBpL29wdC1pbnMvb3B0LWluc1wiO1xuXG5jb25zdCBFeHBvcnREb2lzRGF0YVNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICBzdGF0dXM6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgb3B0aW9uYWw6IHRydWUsXG4gIH0sXG4gIHJvbGU6e1xuICAgIHR5cGU6U3RyaW5nXG4gIH0sXG4gIHVzZXJpZDp7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIHJlZ0V4OiBTaW1wbGVTY2hlbWEuUmVnRXguaWQsXG4gICAgb3B0aW9uYWw6dHJ1ZSBcbiAgfVxufSk7XG5cbi8vVE9ETyBhZGQgc2VuZGVyIGFuZCByZWNpcGllbnQgZW1haWwgYWRkcmVzcyB0byBleHBvcnRcblxuY29uc3QgZXhwb3J0RG9pcyA9IChkYXRhKSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3Qgb3VyRGF0YSA9IGRhdGE7XG4gICAgRXhwb3J0RG9pc0RhdGFTY2hlbWEudmFsaWRhdGUob3VyRGF0YSk7XG4gICAgbGV0IHBpcGVsaW5lPVt7ICRtYXRjaDoge1wiY29uZmlybWVkQXRcIjp7ICRleGlzdHM6IHRydWUsICRuZTogbnVsbCB9fSB9XTtcbiAgICBcbiAgICBpZihvdXJEYXRhLnJvbGUhPSdhZG1pbid8fG91ckRhdGEudXNlcmlkIT11bmRlZmluZWQpe1xuICAgICAgcGlwZWxpbmUucHVzaCh7ICRyZWRhY3Q6e1xuICAgICAgICAkY29uZDoge1xuICAgICAgICAgIGlmOiB7ICRjbXA6IFsgXCIkb3duZXJJZFwiLCBvdXJEYXRhLnVzZXJpZCBdIH0sXG4gICAgICAgICAgdGhlbjogXCIkJFBSVU5FXCIsXG4gICAgICAgICAgZWxzZTogXCIkJEtFRVBcIiB9fX0pO1xuICAgIH1cbiAgICBwaXBlbGluZS5jb25jYXQoW1xuICAgICAgICB7ICRsb29rdXA6IHsgZnJvbTogXCJyZWNpcGllbnRzXCIsIGxvY2FsRmllbGQ6IFwicmVjaXBpZW50XCIsIGZvcmVpZ25GaWVsZDogXCJfaWRcIiwgYXM6IFwiUmVjaXBpZW50RW1haWxcIiB9IH0sXG4gICAgICAgIHsgJGxvb2t1cDogeyBmcm9tOiBcInNlbmRlcnNcIiwgbG9jYWxGaWVsZDogXCJzZW5kZXJcIiwgZm9yZWlnbkZpZWxkOiBcIl9pZFwiLCBhczogXCJTZW5kZXJFbWFpbFwiIH0gfSxcbiAgICAgICAgeyAkdW53aW5kOiBcIiRTZW5kZXJFbWFpbFwifSxcbiAgICAgICAgeyAkdW53aW5kOiBcIiRSZWNpcGllbnRFbWFpbFwifSxcbiAgICAgICAgeyAkcHJvamVjdDoge1wiX2lkXCI6MSxcImNyZWF0ZWRBdFwiOjEsIFwiY29uZmlybWVkQXRcIjoxLFwibmFtZUlkXCI6MSwgXCJTZW5kZXJFbWFpbC5lbWFpbFwiOjEsXCJSZWNpcGllbnRFbWFpbC5lbWFpbFwiOjF9fVxuICAgIF0pO1xuICAgIC8vaWYob3VyRGF0YS5zdGF0dXM9PTEpIHF1ZXJ5ID0ge1wiY29uZmlybWVkQXRcIjogeyAkZXhpc3RzOiB0cnVlLCAkbmU6IG51bGwgfX1cblxuICAgIGxldCBvcHRJbnMgPSAgT3B0SW5zLmFnZ3JlZ2F0ZShwaXBlbGluZSk7XG4gICAgbGV0IGV4cG9ydERvaURhdGE7XG4gICAgdHJ5IHtcbiAgICAgICAgZXhwb3J0RG9pRGF0YSA9IG9wdElucztcbiAgICAgICAgbG9nU2VuZCgnZXhwb3J0RG9pIHVybDonLERPSV9NQUlMX0ZFVENIX1VSTCxKU09OLnN0cmluZ2lmeShleHBvcnREb2lEYXRhKSk7XG4gICAgICByZXR1cm4gZXhwb3J0RG9pRGF0YVxuXG4gICAgfSBjYXRjaChlcnJvcikge1xuICAgICAgdGhyb3cgXCJFcnJvciB3aGlsZSBleHBvcnRpbmcgZG9pczogXCIrZXJyb3I7XG4gICAgfVxuXG4gIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2RhcHBzLmV4cG9ydERvaS5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBleHBvcnREb2lzO1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XG5pbXBvcnQgeyBET0lfRkVUQ0hfUk9VVEUsIERPSV9DT05GSVJNQVRJT05fUk9VVEUsIEFQSV9QQVRILCBWRVJTSU9OIH0gZnJvbSAnLi4vLi4vLi4vLi4vc2VydmVyL2FwaS9yZXN0L3Jlc3QuanMnO1xuaW1wb3J0IHsgZ2V0VXJsIH0gZnJvbSAnLi4vLi4vLi4vc3RhcnR1cC9zZXJ2ZXIvZGFwcC1jb25maWd1cmF0aW9uLmpzJztcbmltcG9ydCB7IENPTkZJUk1fQ0xJRU5ULCBDT05GSVJNX0FERFJFU1MgfSBmcm9tICcuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9kb2ljaGFpbi1jb25maWd1cmF0aW9uLmpzJztcbmltcG9ydCB7IGdldEh0dHBHRVQgfSBmcm9tICcuLi8uLi8uLi8uLi9zZXJ2ZXIvYXBpL2h0dHAuanMnO1xuaW1wb3J0IHsgc2lnbk1lc3NhZ2UgfSBmcm9tICcuLi8uLi8uLi8uLi9zZXJ2ZXIvYXBpL2RvaWNoYWluLmpzJztcbmltcG9ydCB7IE9wdElucyB9IGZyb20gJy4uLy4uLy4uLy4uL2ltcG9ydHMvYXBpL29wdC1pbnMvb3B0LWlucy5qcyc7XG5pbXBvcnQgcGFyc2VUZW1wbGF0ZSBmcm9tICcuLi9lbWFpbHMvcGFyc2VfdGVtcGxhdGUuanMnO1xuaW1wb3J0IGdlbmVyYXRlRG9pVG9rZW4gZnJvbSAnLi4vb3B0LWlucy9nZW5lcmF0ZV9kb2ktdG9rZW4uanMnO1xuaW1wb3J0IGdlbmVyYXRlRG9pSGFzaCBmcm9tICcuLi9lbWFpbHMvZ2VuZXJhdGVfZG9pLWhhc2guanMnO1xuaW1wb3J0IGFkZE9wdEluIGZyb20gJy4uL29wdC1pbnMvYWRkLmpzJztcbmltcG9ydCBhZGRTZW5kTWFpbEpvYiBmcm9tICcuLi9qb2JzL2FkZF9zZW5kX21haWwuanMnO1xuaW1wb3J0IHtsb2dDb25maXJtLCBsb2dFcnJvcn0gZnJvbSBcIi4uLy4uLy4uL3N0YXJ0dXAvc2VydmVyL2xvZy1jb25maWd1cmF0aW9uXCI7XG5cbmNvbnN0IEZldGNoRG9pTWFpbERhdGFTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgbmFtZToge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9LFxuICBkb21haW46IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfVxufSk7XG5cblxuY29uc3QgZmV0Y2hEb2lNYWlsRGF0YSA9IChkYXRhKSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3Qgb3VyRGF0YSA9IGRhdGE7XG4gICAgRmV0Y2hEb2lNYWlsRGF0YVNjaGVtYS52YWxpZGF0ZShvdXJEYXRhKTtcbiAgICBjb25zdCB1cmwgPSBvdXJEYXRhLmRvbWFpbitBUElfUEFUSCtWRVJTSU9OK1wiL1wiK0RPSV9GRVRDSF9ST1VURTtcbiAgICBjb25zdCBzaWduYXR1cmUgPSBzaWduTWVzc2FnZShDT05GSVJNX0NMSUVOVCwgQ09ORklSTV9BRERSRVNTLCBvdXJEYXRhLm5hbWUpO1xuICAgIGNvbnN0IHF1ZXJ5ID0gXCJuYW1lX2lkPVwiK2VuY29kZVVSSUNvbXBvbmVudChvdXJEYXRhLm5hbWUpK1wiJnNpZ25hdHVyZT1cIitlbmNvZGVVUklDb21wb25lbnQoc2lnbmF0dXJlKTtcbiAgICBsb2dDb25maXJtKCdjYWxsaW5nIGZvciBkb2ktZW1haWwtdGVtcGxhdGU6Jyt1cmwrJyBxdWVyeTonLCBxdWVyeSk7XG5cbiAgICAvKipcbiAgICAgIFRPRE8gd2hlbiBydW5uaW5nIFNlbmQtZEFwcCBpbiBUZXN0bmV0IGJlaGluZCBOQVQgdGhpcyBVUkwgd2lsbCBub3QgYmUgYWNjZXNzaWJsZSBmcm9tIHRoZSBpbnRlcm5ldFxuICAgICAgYnV0IGV2ZW4gd2hlbiB3ZSB1c2UgdGhlIFVSTCBmcm9tIGxvY2FsaG9zdCB2ZXJpZnkgYW5kbiBvdGhlcnMgd2lsbCBmYWlscy5cbiAgICAgKi9cbiAgICBjb25zdCByZXNwb25zZSA9IGdldEh0dHBHRVQodXJsLCBxdWVyeSk7XG4gICAgaWYocmVzcG9uc2UgPT09IHVuZGVmaW5lZCB8fCByZXNwb25zZS5kYXRhID09PSB1bmRlZmluZWQpIHRocm93IFwiQmFkIHJlc3BvbnNlXCI7XG4gICAgY29uc3QgcmVzcG9uc2VEYXRhID0gcmVzcG9uc2UuZGF0YTtcbiAgICBsb2dDb25maXJtKCdyZXNwb25zZSB3aGlsZSBnZXR0aW5nIGdldHRpbmcgZW1haWwgdGVtcGxhdGUgZnJvbSBVUkw6JyxyZXNwb25zZS5kYXRhLnN0YXR1cyk7XG5cbiAgICBpZihyZXNwb25zZURhdGEuc3RhdHVzICE9PSBcInN1Y2Nlc3NcIikge1xuICAgICAgaWYocmVzcG9uc2VEYXRhLmVycm9yID09PSB1bmRlZmluZWQpIHRocm93IFwiQmFkIHJlc3BvbnNlXCI7XG4gICAgICBpZihyZXNwb25zZURhdGEuZXJyb3IuaW5jbHVkZXMoXCJPcHQtSW4gbm90IGZvdW5kXCIpKSB7XG4gICAgICAgIC8vRG8gbm90aGluZyBhbmQgZG9uJ3QgdGhyb3cgZXJyb3Igc28gam9iIGlzIGRvbmVcbiAgICAgICAgICBsb2dFcnJvcigncmVzcG9uc2UgZGF0YSBmcm9tIFNlbmQtZEFwcDonLHJlc3BvbnNlRGF0YS5lcnJvcik7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHRocm93IHJlc3BvbnNlRGF0YS5lcnJvcjtcbiAgICB9XG4gICAgbG9nQ29uZmlybSgnRE9JIE1haWwgZGF0YSBmZXRjaGVkLicpO1xuXG4gICAgY29uc3Qgb3B0SW5JZCA9IGFkZE9wdEluKHtuYW1lOiBvdXJEYXRhLm5hbWV9KTtcbiAgICBjb25zdCBvcHRJbiA9IE9wdElucy5maW5kT25lKHtfaWQ6IG9wdEluSWR9KTtcbiAgICBsb2dDb25maXJtKCdvcHQtaW4gZm91bmQ6JyxvcHRJbik7XG4gICAgaWYob3B0SW4uY29uZmlybWF0aW9uVG9rZW4gIT09IHVuZGVmaW5lZCkgcmV0dXJuO1xuXG4gICAgY29uc3QgdG9rZW4gPSBnZW5lcmF0ZURvaVRva2VuKHtpZDogb3B0SW4uX2lkfSk7XG4gICAgbG9nQ29uZmlybSgnZ2VuZXJhdGVkIGNvbmZpcm1hdGlvblRva2VuOicsdG9rZW4pO1xuICAgIGNvbnN0IGNvbmZpcm1hdGlvbkhhc2ggPSBnZW5lcmF0ZURvaUhhc2goe2lkOiBvcHRJbi5faWQsIHRva2VuOiB0b2tlbiwgcmVkaXJlY3Q6IHJlc3BvbnNlRGF0YS5kYXRhLnJlZGlyZWN0fSk7XG4gICAgbG9nQ29uZmlybSgnZ2VuZXJhdGVkIGNvbmZpcm1hdGlvbkhhc2g6Jyxjb25maXJtYXRpb25IYXNoKTtcbiAgICBjb25zdCBjb25maXJtYXRpb25VcmwgPSBnZXRVcmwoKStBUElfUEFUSCtWRVJTSU9OK1wiL1wiK0RPSV9DT05GSVJNQVRJT05fUk9VVEUrXCIvXCIrZW5jb2RlVVJJQ29tcG9uZW50KGNvbmZpcm1hdGlvbkhhc2gpO1xuICAgIGxvZ0NvbmZpcm0oJ2NvbmZpcm1hdGlvblVybDonK2NvbmZpcm1hdGlvblVybCk7XG5cbiAgICBjb25zdCB0ZW1wbGF0ZSA9IHBhcnNlVGVtcGxhdGUoe3RlbXBsYXRlOiByZXNwb25zZURhdGEuZGF0YS5jb250ZW50LCBkYXRhOiB7XG4gICAgICBjb25maXJtYXRpb25fdXJsOiBjb25maXJtYXRpb25VcmxcbiAgICB9fSk7XG5cbiAgICAvL2xvZ0NvbmZpcm0oJ3dlIGFyZSB1c2luZyB0aGlzIHRlbXBsYXRlOicsdGVtcGxhdGUpO1xuXG4gICAgbG9nQ29uZmlybSgnc2VuZGluZyBlbWFpbCB0byBwZXRlciBmb3IgY29uZmlybWF0aW9uIG92ZXIgYm9icyBkQXBwJyk7XG4gICAgYWRkU2VuZE1haWxKb2Ioe1xuICAgICAgdG86IHJlc3BvbnNlRGF0YS5kYXRhLnJlY2lwaWVudCxcbiAgICAgIHN1YmplY3Q6IHJlc3BvbnNlRGF0YS5kYXRhLnN1YmplY3QsXG4gICAgICBtZXNzYWdlOiB0ZW1wbGF0ZSxcbiAgICAgIHJldHVyblBhdGg6IHJlc3BvbnNlRGF0YS5kYXRhLnJldHVyblBhdGhcbiAgICB9KTtcbiAgfSBjYXRjaCAoZXhjZXB0aW9uKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZGFwcHMuZmV0Y2hEb2lNYWlsRGF0YS5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBmZXRjaERvaU1haWxEYXRhO1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XG5pbXBvcnQgeyBPcHRJbnMgfSBmcm9tICcuLi8uLi8uLi9hcGkvb3B0LWlucy9vcHQtaW5zLmpzJztcbmltcG9ydCB7IFJlY2lwaWVudHMgfSBmcm9tICcuLi8uLi8uLi9hcGkvcmVjaXBpZW50cy9yZWNpcGllbnRzLmpzJztcbmltcG9ydCBnZXRPcHRJblByb3ZpZGVyIGZyb20gJy4uL2Rucy9nZXRfb3B0LWluLXByb3ZpZGVyLmpzJztcbmltcG9ydCBnZXRPcHRJbktleSBmcm9tICcuLi9kbnMvZ2V0X29wdC1pbi1rZXkuanMnO1xuaW1wb3J0IHZlcmlmeVNpZ25hdHVyZSBmcm9tICcuLi9kb2ljaGFpbi92ZXJpZnlfc2lnbmF0dXJlLmpzJztcbmltcG9ydCB7IGdldEh0dHBHRVQgfSBmcm9tICcuLi8uLi8uLi8uLi9zZXJ2ZXIvYXBpL2h0dHAuanMnO1xuaW1wb3J0IHsgRE9JX01BSUxfRkVUQ0hfVVJMIH0gZnJvbSAnLi4vLi4vLi4vc3RhcnR1cC9zZXJ2ZXIvZW1haWwtY29uZmlndXJhdGlvbi5qcyc7XG5pbXBvcnQgeyBsb2dTZW5kIH0gZnJvbSBcIi4uLy4uLy4uL3N0YXJ0dXAvc2VydmVyL2xvZy1jb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBBY2NvdW50cyB9IGZyb20gJ21ldGVvci9hY2NvdW50cy1iYXNlJ1xuXG5jb25zdCBHZXREb2lNYWlsRGF0YVNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICBuYW1lX2lkOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH0sXG4gIHNpZ25hdHVyZToge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9XG59KTtcblxuY29uc3QgdXNlclByb2ZpbGVTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgc3ViamVjdDoge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICBvcHRpb25hbDp0cnVlXG4gIH0sXG4gIHJlZGlyZWN0OiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIHJlZ0V4OiBcIkAoaHR0cHM/fGZ0cCk6Ly8oLVxcXFwuKT8oW15cXFxccy8/XFxcXC4jLV0rXFxcXC4/KSsoL1teXFxcXHNdKik/JEBcIixcbiAgICBvcHRpb25hbDp0cnVlXG4gIH0sXG4gIHJldHVyblBhdGg6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgcmVnRXg6IFNpbXBsZVNjaGVtYS5SZWdFeC5FbWFpbCxcbiAgICBvcHRpb25hbDp0cnVlXG4gIH0sXG4gIHRlbXBsYXRlVVJMOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIHJlZ0V4OiBcIkAoaHR0cHM/fGZ0cCk6Ly8oLVxcXFwuKT8oW15cXFxccy8/XFxcXC4jLV0rXFxcXC4/KSsoL1teXFxcXHNdKik/JEBcIixcbiAgICBvcHRpb25hbDp0cnVlXG4gIH1cbn0pO1xuXG5jb25zdCBnZXREb2lNYWlsRGF0YSA9IChkYXRhKSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3Qgb3VyRGF0YSA9IGRhdGE7XG4gICAgR2V0RG9pTWFpbERhdGFTY2hlbWEudmFsaWRhdGUob3VyRGF0YSk7XG4gICAgY29uc3Qgb3B0SW4gPSBPcHRJbnMuZmluZE9uZSh7bmFtZUlkOiBvdXJEYXRhLm5hbWVfaWR9KTtcbiAgICBpZihvcHRJbiA9PT0gdW5kZWZpbmVkKSB0aHJvdyBcIk9wdC1JbiB3aXRoIG5hbWVfaWQ6IFwiK291ckRhdGEubmFtZV9pZCtcIiBub3QgZm91bmRcIjtcbiAgICBsb2dTZW5kKCdPcHQtSW4gZm91bmQnLG9wdEluKTtcblxuICAgIGNvbnN0IHJlY2lwaWVudCA9IFJlY2lwaWVudHMuZmluZE9uZSh7X2lkOiBvcHRJbi5yZWNpcGllbnR9KTtcbiAgICBpZihyZWNpcGllbnQgPT09IHVuZGVmaW5lZCkgdGhyb3cgXCJSZWNpcGllbnQgbm90IGZvdW5kXCI7XG4gICAgbG9nU2VuZCgnUmVjaXBpZW50IGZvdW5kJywgcmVjaXBpZW50KTtcblxuICAgIGNvbnN0IHBhcnRzID0gcmVjaXBpZW50LmVtYWlsLnNwbGl0KFwiQFwiKTtcbiAgICBjb25zdCBkb21haW4gPSBwYXJ0c1twYXJ0cy5sZW5ndGgtMV07XG5cbiAgICBsZXQgcHVibGljS2V5ID0gZ2V0T3B0SW5LZXkoeyBkb21haW46IGRvbWFpbn0pO1xuXG4gICAgaWYoIXB1YmxpY0tleSl7XG4gICAgICBjb25zdCBwcm92aWRlciA9IGdldE9wdEluUHJvdmlkZXIoe2RvbWFpbjogb3VyRGF0YS5kb21haW4gfSk7XG4gICAgICBsb2dTZW5kKFwidXNpbmcgZG9pY2hhaW4gcHJvdmlkZXIgaW5zdGVhZCBvZiBkaXJlY3RseSBjb25maWd1cmVkIHB1YmxpY0tleTpcIiwgeyBwcm92aWRlcjogcHJvdmlkZXIgfSk7XG4gICAgICBwdWJsaWNLZXkgPSBnZXRPcHRJbktleSh7IGRvbWFpbjogcHJvdmlkZXJ9KTsgLy9nZXQgcHVibGljIGtleSBmcm9tIHByb3ZpZGVyIG9yIGZhbGxiYWNrIGlmIHB1YmxpY2tleSB3YXMgbm90IHNldCBpbiBkbnNcbiAgICB9XG5cbiAgICBsb2dTZW5kKCdxdWVyaWVkIGRhdGE6IChwYXJ0cywgZG9tYWluLCBwcm92aWRlciwgcHVibGljS2V5KScsICcoJytwYXJ0cysnLCcrZG9tYWluKycsJytwdWJsaWNLZXkrJyknKTtcblxuICAgIC8vVE9ETzogT25seSBhbGxvdyBhY2Nlc3Mgb25lIHRpbWVcbiAgICAvLyBQb3NzaWJsZSBzb2x1dGlvbjpcbiAgICAvLyAxLiBQcm92aWRlciAoY29uZmlybSBkQXBwKSByZXF1ZXN0IHRoZSBkYXRhXG4gICAgLy8gMi4gUHJvdmlkZXIgcmVjZWl2ZSB0aGUgZGF0YVxuICAgIC8vIDMuIFByb3ZpZGVyIHNlbmRzIGNvbmZpcm1hdGlvbiBcIkkgZ290IHRoZSBkYXRhXCJcbiAgICAvLyA0LiBTZW5kIGRBcHAgbG9jayB0aGUgZGF0YSBmb3IgdGhpcyBvcHQgaW5cbiAgICBsb2dTZW5kKCd2ZXJpZnlpbmcgc2lnbmF0dXJlLi4uJyk7XG4gICAgaWYoIXZlcmlmeVNpZ25hdHVyZSh7cHVibGljS2V5OiBwdWJsaWNLZXksIGRhdGE6IG91ckRhdGEubmFtZV9pZCwgc2lnbmF0dXJlOiBvdXJEYXRhLnNpZ25hdHVyZX0pKSB7XG4gICAgICB0aHJvdyBcInNpZ25hdHVyZSBpbmNvcnJlY3QgLSBhY2Nlc3MgZGVuaWVkXCI7XG4gICAgfVxuICAgIFxuICAgIGxvZ1NlbmQoJ3NpZ25hdHVyZSB2ZXJpZmllZCcpO1xuXG4gICAgLy9UT0RPOiBRdWVyeSBmb3IgbGFuZ3VhZ2VcbiAgICBsZXQgZG9pTWFpbERhdGE7XG4gICAgdHJ5IHtcblxuICAgICAgZG9pTWFpbERhdGEgPSBnZXRIdHRwR0VUKERPSV9NQUlMX0ZFVENIX1VSTCwgXCJcIikuZGF0YTtcbiAgICAgIGxldCBkZWZhdWx0UmV0dXJuRGF0YSA9IHtcbiAgICAgICAgXCJyZWNpcGllbnRcIjogcmVjaXBpZW50LmVtYWlsLFxuICAgICAgICBcImNvbnRlbnRcIjogZG9pTWFpbERhdGEuZGF0YS5jb250ZW50LFxuICAgICAgICBcInJlZGlyZWN0XCI6IGRvaU1haWxEYXRhLmRhdGEucmVkaXJlY3QsXG4gICAgICAgIFwic3ViamVjdFwiOiBkb2lNYWlsRGF0YS5kYXRhLnN1YmplY3QsXG4gICAgICAgIFwicmV0dXJuUGF0aFwiOiBkb2lNYWlsRGF0YS5kYXRhLnJldHVyblBhdGhcbiAgICAgIH1cblxuICAgIGxldCByZXR1cm5EYXRhID0gZGVmYXVsdFJldHVybkRhdGE7XG5cbiAgICB0cnl7XG4gICAgICBsZXQgb3duZXIgPSBBY2NvdW50cy51c2Vycy5maW5kT25lKHtfaWQ6IG9wdEluLm93bmVySWR9KTtcbiAgICAgIGxldCBtYWlsVGVtcGxhdGUgPSBvd25lci5wcm9maWxlLm1haWxUZW1wbGF0ZTtcbiAgICAgIHVzZXJQcm9maWxlU2NoZW1hLnZhbGlkYXRlKG1haWxUZW1wbGF0ZSk7XG5cbiAgICAgIHJldHVybkRhdGFbXCJyZWRpcmVjdFwiXSA9IG1haWxUZW1wbGF0ZVtcInJlZGlyZWN0XCJdIHx8IGRlZmF1bHRSZXR1cm5EYXRhW1wicmVkaXJlY3RcIl07XG4gICAgICByZXR1cm5EYXRhW1wic3ViamVjdFwiXSA9IG1haWxUZW1wbGF0ZVtcInN1YmplY3RcIl0gfHwgZGVmYXVsdFJldHVybkRhdGFbXCJzdWJqZWN0XCJdO1xuICAgICAgcmV0dXJuRGF0YVtcInJldHVyblBhdGhcIl0gPSBtYWlsVGVtcGxhdGVbXCJyZXR1cm5QYXRoXCJdIHx8IGRlZmF1bHRSZXR1cm5EYXRhW1wicmV0dXJuUGF0aFwiXTtcbiAgICAgIHJldHVybkRhdGFbXCJjb250ZW50XCJdID0gbWFpbFRlbXBsYXRlW1widGVtcGxhdGVVUkxcIl0gPyAoZ2V0SHR0cEdFVChtYWlsVGVtcGxhdGVbXCJ0ZW1wbGF0ZVVSTFwiXSwgXCJcIikuY29udGVudCB8fCBkZWZhdWx0UmV0dXJuRGF0YVtcImNvbnRlbnRcIl0pIDogZGVmYXVsdFJldHVybkRhdGFbXCJjb250ZW50XCJdO1xuICAgICAgXG4gICAgfVxuICAgIGNhdGNoKGVycm9yKSB7XG4gICAgICByZXR1cm5EYXRhPWRlZmF1bHRSZXR1cm5EYXRhO1xuICAgIH1cblxuICAgICAgbG9nU2VuZCgnZG9pTWFpbERhdGEgYW5kIHVybDonLCBET0lfTUFJTF9GRVRDSF9VUkwsIHJldHVybkRhdGEpO1xuXG4gICAgICByZXR1cm4gcmV0dXJuRGF0YVxuXG4gICAgfSBjYXRjaChlcnJvcikge1xuICAgICAgdGhyb3cgXCJFcnJvciB3aGlsZSBmZXRjaGluZyBtYWlsIGNvbnRlbnQ6IFwiK2Vycm9yO1xuICAgIH1cblxuICB9IGNhdGNoKGV4Y2VwdGlvbikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2RhcHBzLmdldERvaU1haWxEYXRhLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGdldERvaU1haWxEYXRhO1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XG5pbXBvcnQgeyByZXNvbHZlVHh0IH0gZnJvbSAnLi4vLi4vLi4vLi4vc2VydmVyL2FwaS9kbnMuanMnO1xuaW1wb3J0IHsgRkFMTEJBQ0tfUFJPVklERVIgfSBmcm9tICcuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9kbnMtY29uZmlndXJhdGlvbi5qcyc7XG5pbXBvcnQge2lzUmVndGVzdCwgaXNUZXN0bmV0fSBmcm9tIFwiLi4vLi4vLi4vc3RhcnR1cC9zZXJ2ZXIvZGFwcC1jb25maWd1cmF0aW9uXCI7XG5pbXBvcnQge2xvZ1NlbmR9IGZyb20gXCIuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9sb2ctY29uZmlndXJhdGlvblwiO1xuXG5jb25zdCBPUFRfSU5fS0VZID0gXCJkb2ljaGFpbi1vcHQtaW4ta2V5XCI7XG5jb25zdCBPUFRfSU5fS0VZX1RFU1RORVQgPSBcImRvaWNoYWluLXRlc3RuZXQtb3B0LWluLWtleVwiO1xuXG5jb25zdCBHZXRPcHRJbktleVNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICBkb21haW46IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfVxufSk7XG5cblxuY29uc3QgZ2V0T3B0SW5LZXkgPSAoZGF0YSkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IG91ckRhdGEgPSBkYXRhO1xuICAgIEdldE9wdEluS2V5U2NoZW1hLnZhbGlkYXRlKG91ckRhdGEpO1xuXG4gICAgbGV0IG91ck9QVF9JTl9LRVk9T1BUX0lOX0tFWTtcblxuICAgIGlmKGlzUmVndGVzdCgpIHx8IGlzVGVzdG5ldCgpKXtcbiAgICAgICAgb3VyT1BUX0lOX0tFWSA9IE9QVF9JTl9LRVlfVEVTVE5FVDtcbiAgICAgICAgbG9nU2VuZCgnVXNpbmcgUmVnVGVzdDonK2lzUmVndGVzdCgpK1wiIFRlc3RuZXQ6IFwiK2lzVGVzdG5ldCgpK1wiIG91ck9QVF9JTl9LRVlcIixvdXJPUFRfSU5fS0VZKTtcbiAgICB9XG4gICAgY29uc3Qga2V5ID0gcmVzb2x2ZVR4dChvdXJPUFRfSU5fS0VZLCBvdXJEYXRhLmRvbWFpbik7XG4gICAgbG9nU2VuZCgnRE5TIFRYVCBjb25maWd1cmVkIHB1YmxpYyBrZXkgb2YgcmVjaXBpZW50IGVtYWlsIGRvbWFpbiBhbmQgY29uZmlybWF0aW9uIGRhcHAnLHtmb3VuZEtleTprZXksIGRvbWFpbjpvdXJEYXRhLmRvbWFpbiwgZG5za2V5Om91ck9QVF9JTl9LRVl9KTtcblxuICAgIGlmKGtleSA9PT0gdW5kZWZpbmVkKSByZXR1cm4gdXNlRmFsbGJhY2sob3VyRGF0YS5kb21haW4pO1xuICAgIHJldHVybiBrZXk7XG4gIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2Rucy5nZXRPcHRJbktleS5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9XG59O1xuXG5jb25zdCB1c2VGYWxsYmFjayA9IChkb21haW4pID0+IHtcbiAgaWYoZG9tYWluID09PSBGQUxMQkFDS19QUk9WSURFUikgdGhyb3cgbmV3IE1ldGVvci5FcnJvcihcIkZhbGxiYWNrIGhhcyBubyBrZXkgZGVmaW5lZCFcIik7XG4gICAgbG9nU2VuZChcIktleSBub3QgZGVmaW5lZC4gVXNpbmcgZmFsbGJhY2s6IFwiLEZBTExCQUNLX1BST1ZJREVSKTtcbiAgcmV0dXJuIGdldE9wdEluS2V5KHtkb21haW46IEZBTExCQUNLX1BST1ZJREVSfSk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBnZXRPcHRJbktleTtcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tICdzaW1wbC1zY2hlbWEnO1xuaW1wb3J0IHsgcmVzb2x2ZVR4dCB9IGZyb20gJy4uLy4uLy4uLy4uL3NlcnZlci9hcGkvZG5zLmpzJztcbmltcG9ydCB7IEZBTExCQUNLX1BST1ZJREVSIH0gZnJvbSAnLi4vLi4vLi4vc3RhcnR1cC9zZXJ2ZXIvZG5zLWNvbmZpZ3VyYXRpb24uanMnO1xuaW1wb3J0IHtsb2dTZW5kfSBmcm9tIFwiLi4vLi4vLi4vc3RhcnR1cC9zZXJ2ZXIvbG9nLWNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7aXNSZWd0ZXN0LCBpc1Rlc3RuZXR9IGZyb20gXCIuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9kYXBwLWNvbmZpZ3VyYXRpb25cIjtcblxuY29uc3QgUFJPVklERVJfS0VZID0gXCJkb2ljaGFpbi1vcHQtaW4tcHJvdmlkZXJcIjtcbmNvbnN0IFBST1ZJREVSX0tFWV9URVNUTkVUID0gXCJkb2ljaGFpbi10ZXN0bmV0LW9wdC1pbi1wcm92aWRlclwiO1xuXG5jb25zdCBHZXRPcHRJblByb3ZpZGVyU2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIGRvbWFpbjoge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9XG59KTtcblxuXG5jb25zdCBnZXRPcHRJblByb3ZpZGVyID0gKGRhdGEpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBvdXJEYXRhID0gZGF0YTtcbiAgICBHZXRPcHRJblByb3ZpZGVyU2NoZW1hLnZhbGlkYXRlKG91ckRhdGEpO1xuXG4gICAgbGV0IG91clBST1ZJREVSX0tFWT1QUk9WSURFUl9LRVk7XG4gICAgaWYoaXNSZWd0ZXN0KCkgfHwgaXNUZXN0bmV0KCkpe1xuICAgICAgICBvdXJQUk9WSURFUl9LRVkgPSBQUk9WSURFUl9LRVlfVEVTVE5FVDtcbiAgICAgICAgbG9nU2VuZCgnVXNpbmcgUmVnVGVzdDonK2lzUmVndGVzdCgpK1wiIDogVGVzdG5ldDpcIitpc1Rlc3RuZXQoKStcIiBQUk9WSURFUl9LRVlcIix7cHJvdmlkZXJLZXk6b3VyUFJPVklERVJfS0VZLCBkb21haW46b3VyRGF0YS5kb21haW59KTtcbiAgICB9XG5cbiAgICBjb25zdCBwcm92aWRlciA9IHJlc29sdmVUeHQob3VyUFJPVklERVJfS0VZLCBvdXJEYXRhLmRvbWFpbik7XG4gICAgaWYocHJvdmlkZXIgPT09IHVuZGVmaW5lZCkgcmV0dXJuIHVzZUZhbGxiYWNrKCk7XG5cbiAgICBsb2dTZW5kKCdvcHQtaW4tcHJvdmlkZXIgZnJvbSBkbnMgLSBzZXJ2ZXIgb2YgbWFpbCByZWNpcGllbnQ6IChUWFQpOicscHJvdmlkZXIpO1xuICAgIHJldHVybiBwcm92aWRlcjtcbiAgfSBjYXRjaCAoZXhjZXB0aW9uKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZG5zLmdldE9wdEluUHJvdmlkZXIuZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgfVxufTtcblxuY29uc3QgdXNlRmFsbGJhY2sgPSAoKSA9PiB7XG4gIGxvZ1NlbmQoJ1Byb3ZpZGVyIG5vdCBkZWZpbmVkLiBGYWxsYmFjayAnK0ZBTExCQUNLX1BST1ZJREVSKycgaXMgdXNlZCcpO1xuICByZXR1cm4gRkFMTEJBQ0tfUFJPVklERVI7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBnZXRPcHRJblByb3ZpZGVyO1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XG5pbXBvcnQgeyBDT05GSVJNX0NMSUVOVCwgQ09ORklSTV9BRERSRVNTIH0gZnJvbSAnLi4vLi4vLi4vc3RhcnR1cC9zZXJ2ZXIvZG9pY2hhaW4tY29uZmlndXJhdGlvbi5qcyc7XG5pbXBvcnQgeyBnZXRXaWYgfSBmcm9tICcuLi8uLi8uLi8uLi9zZXJ2ZXIvYXBpL2RvaWNoYWluLmpzJztcbmltcG9ydCB7IERvaWNoYWluRW50cmllcyB9IGZyb20gJy4uLy4uLy4uL2FwaS9kb2ljaGFpbi9lbnRyaWVzLmpzJztcbmltcG9ydCBhZGRGZXRjaERvaU1haWxEYXRhSm9iIGZyb20gJy4uL2pvYnMvYWRkX2ZldGNoLWRvaS1tYWlsLWRhdGEuanMnO1xuaW1wb3J0IGdldFByaXZhdGVLZXlGcm9tV2lmIGZyb20gJy4vZ2V0X3ByaXZhdGUta2V5X2Zyb21fd2lmLmpzJztcbmltcG9ydCBkZWNyeXB0TWVzc2FnZSBmcm9tICcuL2RlY3J5cHRfbWVzc2FnZS5qcyc7XG5pbXBvcnQge2xvZ0NvbmZpcm0sIGxvZ1NlbmR9IGZyb20gXCIuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9sb2ctY29uZmlndXJhdGlvblwiO1xuXG5jb25zdCBBZGREb2ljaGFpbkVudHJ5U2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIG5hbWU6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfSxcbiAgdmFsdWU6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfSxcbiAgYWRkcmVzczoge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9LFxuICB0eElkOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH1cbn0pO1xuXG4vKipcbiAqIEluc2VydHNcbiAqXG4gKiBAcGFyYW0gZW50cnlcbiAqIEByZXR1cm5zIHsqfVxuICovXG5jb25zdCBhZGREb2ljaGFpbkVudHJ5ID0gKGVudHJ5KSA9PiB7XG4gIHRyeSB7XG5cbiAgICBjb25zdCBvdXJFbnRyeSA9IGVudHJ5O1xuICAgIGxvZ0NvbmZpcm0oJ2FkZGluZyBEb2ljaGFpbkVudHJ5IG9uIEJvYi4uLicsb3VyRW50cnkubmFtZSk7XG4gICAgQWRkRG9pY2hhaW5FbnRyeVNjaGVtYS52YWxpZGF0ZShvdXJFbnRyeSk7XG5cbiAgICBjb25zdCBldHkgPSBEb2ljaGFpbkVudHJpZXMuZmluZE9uZSh7bmFtZTogb3VyRW50cnkubmFtZX0pO1xuICAgIGlmKGV0eSAhPT0gdW5kZWZpbmVkKXtcbiAgICAgICAgbG9nU2VuZCgncmV0dXJuaW5nIGxvY2FsbHkgc2F2ZWQgZW50cnkgd2l0aCBfaWQ6JytldHkuX2lkKTtcbiAgICAgICAgcmV0dXJuIGV0eS5faWQ7XG4gICAgfVxuXG4gICAgY29uc3QgdmFsdWUgPSBKU09OLnBhcnNlKG91ckVudHJ5LnZhbHVlKTtcbiAgICAvL2xvZ1NlbmQoXCJ2YWx1ZTpcIix2YWx1ZSk7XG4gICAgaWYodmFsdWUuZnJvbSA9PT0gdW5kZWZpbmVkKSB0aHJvdyBcIldyb25nIGJsb2NrY2hhaW4gZW50cnlcIjsgLy9UT0RPIGlmIGZyb20gaXMgbWlzc2luZyBidXQgdmFsdWUgaXMgdGhlcmUsIGl0IGlzIHByb2JhYmx5IGFsbHJlYWR5IGhhbmRlbGVkIGNvcnJlY3RseSBhbnl3YXlzIHRoaXMgaXMgbm90IHNvIGNvb2wgYXMgaXQgc2VlbXMuXG4gICAgY29uc3Qgd2lmID0gZ2V0V2lmKENPTkZJUk1fQ0xJRU5ULCBDT05GSVJNX0FERFJFU1MpO1xuICAgIGNvbnN0IHByaXZhdGVLZXkgPSBnZXRQcml2YXRlS2V5RnJvbVdpZih7d2lmOiB3aWZ9KTtcbiAgICBsb2dTZW5kKCdnb3QgcHJpdmF0ZSBrZXkgKHdpbGwgbm90IHNob3cgaXQgaGVyZSknKTtcblxuICAgIGNvbnN0IGRvbWFpbiA9IGRlY3J5cHRNZXNzYWdlKHtwcml2YXRlS2V5OiBwcml2YXRlS2V5LCBtZXNzYWdlOiB2YWx1ZS5mcm9tfSk7XG4gICAgbG9nU2VuZCgnZGVjcnlwdGVkIG1lc3NhZ2UgZnJvbSBkb21haW46ICcsZG9tYWluKTtcblxuICAgIGNvbnN0IG5hbWVQb3MgPSBvdXJFbnRyeS5uYW1lLmluZGV4T2YoJy0nKTsgLy9pZiB0aGlzIGlzIG5vdCBhIGNvLXJlZ2lzdHJhdGlvbiBmZXRjaCBtYWlsLlxuICAgIGxvZ1NlbmQoJ25hbWVQb3M6JyxuYW1lUG9zKTtcbiAgICBjb25zdCBtYXN0ZXJEb2kgPSAobmFtZVBvcyE9LTEpP291ckVudHJ5Lm5hbWUuc3Vic3RyaW5nKDAsbmFtZVBvcyk6dW5kZWZpbmVkO1xuICAgIGxvZ1NlbmQoJ21hc3RlckRvaTonLG1hc3RlckRvaSk7XG4gICAgY29uc3QgaW5kZXggPSBtYXN0ZXJEb2k/b3VyRW50cnkubmFtZS5zdWJzdHJpbmcobmFtZVBvcysxKTp1bmRlZmluZWQ7XG4gICAgbG9nU2VuZCgnaW5kZXg6JyxpbmRleCk7XG5cbiAgICBjb25zdCBpZCA9IERvaWNoYWluRW50cmllcy5pbnNlcnQoe1xuICAgICAgICBuYW1lOiBvdXJFbnRyeS5uYW1lLFxuICAgICAgICB2YWx1ZTogb3VyRW50cnkudmFsdWUsXG4gICAgICAgIGFkZHJlc3M6IG91ckVudHJ5LmFkZHJlc3MsXG4gICAgICAgIG1hc3RlckRvaTogbWFzdGVyRG9pLFxuICAgICAgICBpbmRleDogaW5kZXgsXG4gICAgICAgIHR4SWQ6IG91ckVudHJ5LnR4SWQsXG4gICAgICAgIGV4cGlyZXNJbjogb3VyRW50cnkuZXhwaXJlc0luLFxuICAgICAgICBleHBpcmVkOiBvdXJFbnRyeS5leHBpcmVkXG4gICAgfSk7XG5cbiAgICBsb2dTZW5kKCdEb2ljaGFpbkVudHJ5IGFkZGVkIG9uIEJvYjonLCB7aWQ6aWQsbmFtZTpvdXJFbnRyeS5uYW1lLG1hc3RlckRvaTptYXN0ZXJEb2ksaW5kZXg6aW5kZXh9KTtcblxuICAgIGlmKCFtYXN0ZXJEb2kpe1xuICAgICAgICBhZGRGZXRjaERvaU1haWxEYXRhSm9iKHtcbiAgICAgICAgICAgIG5hbWU6IG91ckVudHJ5Lm5hbWUsXG4gICAgICAgICAgICBkb21haW46IGRvbWFpblxuICAgICAgICB9KTtcbiAgICAgICAgbG9nU2VuZCgnTmV3IGVudHJ5IGFkZGVkOiBcXG4nK1xuICAgICAgICAgICAgJ05hbWVJZD0nK291ckVudHJ5Lm5hbWUrXCJcXG5cIitcbiAgICAgICAgICAgICdBZGRyZXNzPScrb3VyRW50cnkuYWRkcmVzcytcIlxcblwiK1xuICAgICAgICAgICAgJ1R4SWQ9JytvdXJFbnRyeS50eElkK1wiXFxuXCIrXG4gICAgICAgICAgICAnVmFsdWU9JytvdXJFbnRyeS52YWx1ZSk7XG5cbiAgICB9ZWxzZXtcbiAgICAgICAgbG9nU2VuZCgnVGhpcyB0cmFuc2FjdGlvbiBiZWxvbmdzIHRvIGNvLXJlZ2lzdHJhdGlvbicsIG1hc3RlckRvaSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGlkO1xuICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdkb2ljaGFpbi5hZGRFbnRyeUFuZEZldGNoRGF0YS5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBhZGREb2ljaGFpbkVudHJ5O1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgeyBsaXN0U2luY2VCbG9jaywgbmFtZVNob3csIGdldFJhd1RyYW5zYWN0aW9ufSBmcm9tICcuLi8uLi8uLi8uLi9zZXJ2ZXIvYXBpL2RvaWNoYWluLmpzJztcbmltcG9ydCB7IENPTkZJUk1fQ0xJRU5ULCBDT05GSVJNX0FERFJFU1MgfSBmcm9tICcuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9kb2ljaGFpbi1jb25maWd1cmF0aW9uLmpzJztcbmltcG9ydCBhZGREb2ljaGFpbkVudHJ5IGZyb20gJy4vYWRkX2VudHJ5X2FuZF9mZXRjaF9kYXRhLmpzJ1xuaW1wb3J0IHsgTWV0YSB9IGZyb20gJy4uLy4uLy4uL2FwaS9tZXRhL21ldGEuanMnO1xuaW1wb3J0IGFkZE9yVXBkYXRlTWV0YSBmcm9tICcuLi9tZXRhL2FkZE9yVXBkYXRlLmpzJztcbmltcG9ydCB7bG9nQ29uZmlybX0gZnJvbSBcIi4uLy4uLy4uL3N0YXJ0dXAvc2VydmVyL2xvZy1jb25maWd1cmF0aW9uXCI7XG5cbmNvbnN0IFRYX05BTUVfU1RBUlQgPSBcImUvXCI7XG5jb25zdCBMQVNUX0NIRUNLRURfQkxPQ0tfS0VZID0gXCJsYXN0Q2hlY2tlZEJsb2NrXCI7XG5cbmNvbnN0IGNoZWNrTmV3VHJhbnNhY3Rpb24gPSAodHhpZCwgam9iKSA9PiB7XG4gIHRyeSB7XG5cbiAgICAgIGlmKCF0eGlkKXtcbiAgICAgICAgICBsb2dDb25maXJtKFwiY2hlY2tOZXdUcmFuc2FjdGlvbiB0cmlnZ2VyZWQgd2hlbiBzdGFydGluZyBub2RlIC0gY2hlY2tpbmcgYWxsIGNvbmZpcm1lZCBibG9ja3Mgc2luY2UgbGFzdCBjaGVjayBmb3IgZG9pY2hhaW4gYWRkcmVzc1wiLENPTkZJUk1fQUREUkVTUyk7XG5cbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICB2YXIgbGFzdENoZWNrZWRCbG9jayA9IE1ldGEuZmluZE9uZSh7a2V5OiBMQVNUX0NIRUNLRURfQkxPQ0tfS0VZfSk7XG4gICAgICAgICAgICAgIGlmKGxhc3RDaGVja2VkQmxvY2sgIT09IHVuZGVmaW5lZCkgbGFzdENoZWNrZWRCbG9jayA9IGxhc3RDaGVja2VkQmxvY2sudmFsdWU7XG4gICAgICAgICAgICAgIGxvZ0NvbmZpcm0oXCJsYXN0Q2hlY2tlZEJsb2NrXCIsbGFzdENoZWNrZWRCbG9jayk7XG4gICAgICAgICAgICAgIGNvbnN0IHJldCA9IGxpc3RTaW5jZUJsb2NrKENPTkZJUk1fQ0xJRU5ULCBsYXN0Q2hlY2tlZEJsb2NrKTtcbiAgICAgICAgICAgICAgaWYocmV0ID09PSB1bmRlZmluZWQgfHwgcmV0LnRyYW5zYWN0aW9ucyA9PT0gdW5kZWZpbmVkKSByZXR1cm47XG5cbiAgICAgICAgICAgICAgY29uc3QgdHhzID0gcmV0LnRyYW5zYWN0aW9ucztcbiAgICAgICAgICAgICAgbGFzdENoZWNrZWRCbG9jayA9IHJldC5sYXN0YmxvY2s7XG4gICAgICAgICAgICAgIGlmKCFyZXQgfHwgIXR4cyB8fCAhdHhzLmxlbmd0aD09PTApe1xuICAgICAgICAgICAgICAgICAgbG9nQ29uZmlybShcInRyYW5zYWN0aW9ucyBkbyBub3QgY29udGFpbiBuYW1lT3AgdHJhbnNhY3Rpb24gZGV0YWlscyBvciB0cmFuc2FjdGlvbiBub3QgZm91bmQuXCIsIGxhc3RDaGVja2VkQmxvY2spO1xuICAgICAgICAgICAgICAgICAgYWRkT3JVcGRhdGVNZXRhKHtrZXk6IExBU1RfQ0hFQ0tFRF9CTE9DS19LRVksIHZhbHVlOiBsYXN0Q2hlY2tlZEJsb2NrfSk7XG4gICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBsb2dDb25maXJtKFwibGlzdFNpbmNlQmxvY2tcIixyZXQpO1xuXG4gICAgICAgICAgICAgIGNvbnN0IGFkZHJlc3NUeHMgPSB0eHMuZmlsdGVyKHR4ID0+XG4gICAgICAgICAgICAgICAgICB0eC5hZGRyZXNzID09PSBDT05GSVJNX0FERFJFU1NcbiAgICAgICAgICAgICAgICAgICYmIHR4Lm5hbWUgIT09IHVuZGVmaW5lZCAvL3NpbmNlIG5hbWVfc2hvdyBjYW5ub3QgYmUgcmVhZCB3aXRob3V0IGNvbmZpcm1hdGlvbnNcbiAgICAgICAgICAgICAgICAgICYmIHR4Lm5hbWUuc3RhcnRzV2l0aChcImRvaTogXCIrVFhfTkFNRV9TVEFSVCkgIC8vaGVyZSAnZG9pOiBlL3h4eHgnIGlzIGFscmVhZHkgd3JpdHRlbiBpbiB0aGUgYmxvY2tcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgYWRkcmVzc1R4cy5mb3JFYWNoKHR4ID0+IHtcbiAgICAgICAgICAgICAgICAgIGxvZ0NvbmZpcm0oXCJ0eDpcIix0eCk7XG4gICAgICAgICAgICAgICAgICB2YXIgdHhOYW1lID0gdHgubmFtZS5zdWJzdHJpbmcoKFwiZG9pOiBcIitUWF9OQU1FX1NUQVJUKS5sZW5ndGgpO1xuICAgICAgICAgICAgICAgICAgbG9nQ29uZmlybShcImV4Y3V0aW5nIG5hbWVfc2hvdyBpbiBvcmRlciB0byBnZXQgdmFsdWUgb2YgbmFtZUlkOlwiLCB0eE5hbWUpO1xuICAgICAgICAgICAgICAgICAgY29uc3QgZXR5ID0gbmFtZVNob3coQ09ORklSTV9DTElFTlQsIHR4TmFtZSk7XG4gICAgICAgICAgICAgICAgICBsb2dDb25maXJtKFwibmFtZVNob3c6IHZhbHVlXCIsZXR5KTtcbiAgICAgICAgICAgICAgICAgIGlmKCFldHkpe1xuICAgICAgICAgICAgICAgICAgICAgIGxvZ0NvbmZpcm0oXCJjb3VsZG4ndCBmaW5kIG5hbWUgLSBvYnZpb3VzbHkgbm90ICh5ZXQ/ISkgY29uZmlybWVkIGluIGJsb2NrY2hhaW46XCIsIGV0eSk7XG4gICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgYWRkVHgodHhOYW1lLCBldHkudmFsdWUsdHguYWRkcmVzcyx0eC50eGlkKTsgLy9UT0RPIGV0eS52YWx1ZS5mcm9tIGlzIG1heWJlIE5PVCBleGlzdGluZyBiZWNhdXNlIG9mIHRoaXMgaXRzICAobWF5YmUpIG9udCB3b3JraW5nLi4uXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICBhZGRPclVwZGF0ZU1ldGEoe2tleTogTEFTVF9DSEVDS0VEX0JMT0NLX0tFWSwgdmFsdWU6IGxhc3RDaGVja2VkQmxvY2t9KTtcbiAgICAgICAgICAgICAgbG9nQ29uZmlybShcIlRyYW5zYWN0aW9ucyB1cGRhdGVkIC0gbGFzdENoZWNrZWRCbG9jazpcIixsYXN0Q2hlY2tlZEJsb2NrKTtcbiAgICAgICAgICAgICAgam9iLmRvbmUoKTtcbiAgICAgICAgICB9IGNhdGNoKGV4Y2VwdGlvbikge1xuICAgICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCduYW1lY29pbi5jaGVja05ld1RyYW5zYWN0aW9ucy5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICAgICAgICAgIH1cblxuICAgICAgfWVsc2V7XG4gICAgICAgICAgbG9nQ29uZmlybShcInR4aWQ6IFwiK3R4aWQrXCIgd2FzIHRyaWdnZXJlZCBieSB3YWxsZXRub3RpZnkgZm9yIGFkZHJlc3M6XCIsQ09ORklSTV9BRERSRVNTKTtcblxuICAgICAgICAgIGNvbnN0IHJldCA9IGdldFJhd1RyYW5zYWN0aW9uKENPTkZJUk1fQ0xJRU5ULCB0eGlkKTtcbiAgICAgICAgICBjb25zdCB0eHMgPSByZXQudm91dDtcblxuICAgICAgICAgIGlmKCFyZXQgfHwgIXR4cyB8fCAhdHhzLmxlbmd0aD09PTApe1xuICAgICAgICAgICAgICBsb2dDb25maXJtKFwidHhpZCBcIit0eGlkKycgZG9lcyBub3QgY29udGFpbiB0cmFuc2FjdGlvbiBkZXRhaWxzIG9yIHRyYW5zYWN0aW9uIG5vdCBmb3VuZC4nKTtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgLy8gbG9nQ29uZmlybSgnbm93IGNoZWNraW5nIHJhdyB0cmFuc2FjdGlvbnMgd2l0aCBmaWx0ZXI6Jyx0eHMpO1xuXG4gICAgICAgICAgY29uc3QgYWRkcmVzc1R4cyA9IHR4cy5maWx0ZXIodHggPT5cbiAgICAgICAgICAgICAgdHguc2NyaXB0UHViS2V5ICE9PSB1bmRlZmluZWRcbiAgICAgICAgICAgICAgJiYgdHguc2NyaXB0UHViS2V5Lm5hbWVPcCAhPT0gdW5kZWZpbmVkXG4gICAgICAgICAgICAgICYmIHR4LnNjcmlwdFB1YktleS5uYW1lT3Aub3AgPT09IFwibmFtZV9kb2lcIlxuICAgICAgICAgICAgLy8gICYmIHR4LnNjcmlwdFB1YktleS5hZGRyZXNzZXNbMF0gPT09IENPTkZJUk1fQUREUkVTUyAvL29ubHkgb3duIHRyYW5zYWN0aW9uIHNob3VsZCBhcnJpdmUgaGVyZS4gLSBzbyBjaGVjayBvbiBvd24gYWRkcmVzcyB1bm5lY2Nlc2FyeVxuICAgICAgICAgICAgICAmJiB0eC5zY3JpcHRQdWJLZXkubmFtZU9wLm5hbWUgIT09IHVuZGVmaW5lZFxuICAgICAgICAgICAgICAmJiB0eC5zY3JpcHRQdWJLZXkubmFtZU9wLm5hbWUuc3RhcnRzV2l0aChUWF9OQU1FX1NUQVJUKVxuICAgICAgICAgICk7XG5cbiAgICAgICAgICAvL2xvZ0NvbmZpcm0oXCJmb3VuZCBuYW1lX29wIHRyYW5zYWN0aW9uczpcIiwgYWRkcmVzc1R4cyk7XG5cbiAgICAgICAgICBhZGRyZXNzVHhzLmZvckVhY2godHggPT4ge1xuICAgICAgICAgICAgICBhZGRUeCh0eC5zY3JpcHRQdWJLZXkubmFtZU9wLm5hbWUsIHR4LnNjcmlwdFB1YktleS5uYW1lT3AudmFsdWUsdHguc2NyaXB0UHViS2V5LmFkZHJlc3Nlc1swXSx0eGlkKTtcbiAgICAgICAgICB9KTtcbiAgICAgIH1cblxuXG5cbiAgfSBjYXRjaChleGNlcHRpb24pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdkb2ljaGFpbi5jaGVja05ld1RyYW5zYWN0aW9ucy5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9XG4gIHJldHVybiB0cnVlO1xufTtcblxuXG5mdW5jdGlvbiBhZGRUeChuYW1lLCB2YWx1ZSwgYWRkcmVzcywgdHhpZCkge1xuICAgIGNvbnN0IHR4TmFtZSA9IG5hbWUuc3Vic3RyaW5nKFRYX05BTUVfU1RBUlQubGVuZ3RoKTtcblxuICAgIGFkZERvaWNoYWluRW50cnkoe1xuICAgICAgICBuYW1lOiB0eE5hbWUsXG4gICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgYWRkcmVzczogYWRkcmVzcyxcbiAgICAgICAgdHhJZDogdHhpZFxuICAgIH0pO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjaGVja05ld1RyYW5zYWN0aW9uO1xuXG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcbmltcG9ydCBjcnlwdG8gZnJvbSAnY3J5cHRvJztcbmltcG9ydCBlY2llcyBmcm9tICdzdGFuZGFyZC1lY2llcyc7XG5cbmNvbnN0IERlY3J5cHRNZXNzYWdlU2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIHByaXZhdGVLZXk6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfSxcbiAgbWVzc2FnZToge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9XG59KTtcblxuY29uc3QgZGVjcnlwdE1lc3NhZ2UgPSAoZGF0YSkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IG91ckRhdGEgPSBkYXRhO1xuICAgIERlY3J5cHRNZXNzYWdlU2NoZW1hLnZhbGlkYXRlKG91ckRhdGEpO1xuICAgIGNvbnN0IHByaXZhdGVLZXkgPSBCdWZmZXIuZnJvbShvdXJEYXRhLnByaXZhdGVLZXksICdoZXgnKTtcbiAgICBjb25zdCBlY2RoID0gY3J5cHRvLmNyZWF0ZUVDREgoJ3NlY3AyNTZrMScpO1xuICAgIGVjZGguc2V0UHJpdmF0ZUtleShwcml2YXRlS2V5KTtcbiAgICBjb25zdCBtZXNzYWdlID0gQnVmZmVyLmZyb20ob3VyRGF0YS5tZXNzYWdlLCAnaGV4Jyk7XG4gICAgcmV0dXJuIGVjaWVzLmRlY3J5cHQoZWNkaCwgbWVzc2FnZSkudG9TdHJpbmcoJ3V0ZjgnKTtcbiAgfSBjYXRjaChleGNlcHRpb24pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdkb2ljaGFpbi5kZWNyeXB0TWVzc2FnZS5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBkZWNyeXB0TWVzc2FnZTtcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tICdzaW1wbC1zY2hlbWEnO1xuaW1wb3J0IGVjaWVzIGZyb20gJ3N0YW5kYXJkLWVjaWVzJztcblxuY29uc3QgRW5jcnlwdE1lc3NhZ2VTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgcHVibGljS2V5OiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH0sXG4gIG1lc3NhZ2U6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfVxufSk7XG5cbmNvbnN0IGVuY3J5cHRNZXNzYWdlID0gKGRhdGEpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBvdXJEYXRhID0gZGF0YTtcbiAgICBFbmNyeXB0TWVzc2FnZVNjaGVtYS52YWxpZGF0ZShvdXJEYXRhKTtcbiAgICBjb25zdCBwdWJsaWNLZXkgPSBCdWZmZXIuZnJvbShvdXJEYXRhLnB1YmxpY0tleSwgJ2hleCcpO1xuICAgIGNvbnN0IG1lc3NhZ2UgPSBCdWZmZXIuZnJvbShvdXJEYXRhLm1lc3NhZ2UpO1xuICAgIHJldHVybiBlY2llcy5lbmNyeXB0KHB1YmxpY0tleSwgbWVzc2FnZSkudG9TdHJpbmcoJ2hleCcpO1xuICB9IGNhdGNoKGV4Y2VwdGlvbikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2RvaWNoYWluLmVuY3J5cHRNZXNzYWdlLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGVuY3J5cHRNZXNzYWdlO1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XG5pbXBvcnQgeyBPcHRJbnMgfSBmcm9tICcuLi8uLi8uLi9hcGkvb3B0LWlucy9vcHQtaW5zLmpzJztcbmltcG9ydCBnZXRLZXlQYWlyIGZyb20gJy4vZ2V0X2tleS1wYWlyLmpzJztcbmltcG9ydCB7bG9nU2VuZH0gZnJvbSBcIi4uLy4uLy4uL3N0YXJ0dXAvc2VydmVyL2xvZy1jb25maWd1cmF0aW9uXCI7XG5cbmNvbnN0IEdlbmVyYXRlTmFtZUlkU2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIGlkOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH0sXG4gIG1hc3RlckRvaToge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgb3B0aW9uYWw6IHRydWVcbiAgfSxcbiAgaW5kZXg6IHtcbiAgICAgIHR5cGU6IFNpbXBsZVNjaGVtYS5JbnRlZ2VyLFxuICAgICAgb3B0aW9uYWw6IHRydWVcbiAgfVxufSk7XG5cbmNvbnN0IGdlbmVyYXRlTmFtZUlkID0gKG9wdEluKSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3Qgb3VyT3B0SW4gPSBvcHRJbjtcbiAgICBHZW5lcmF0ZU5hbWVJZFNjaGVtYS52YWxpZGF0ZShvdXJPcHRJbik7XG4gICAgbGV0IG5hbWVJZDtcbiAgICBpZihvcHRJbi5tYXN0ZXJEb2kpe1xuICAgICAgICBuYW1lSWQgPSBvdXJPcHRJbi5tYXN0ZXJEb2krXCItXCIrb3VyT3B0SW4uaW5kZXg7XG4gICAgICAgIGxvZ1NlbmQoXCJ1c2VkIG1hc3Rlcl9kb2kgYXMgbmFtZUlkIGluZGV4IFwiK29wdEluLmluZGV4K1wic3RvcmFnZTpcIixuYW1lSWQpO1xuICAgIH1cbiAgICBlbHNle1xuICAgICAgICBuYW1lSWQgPSBnZXRLZXlQYWlyKCkucHJpdmF0ZUtleTtcbiAgICAgICAgbG9nU2VuZChcImdlbmVyYXRlZCBuYW1lSWQgZm9yIGRvaWNoYWluIHN0b3JhZ2U6XCIsbmFtZUlkKTtcbiAgICB9XG5cbiAgICBPcHRJbnMudXBkYXRlKHtfaWQgOiBvdXJPcHRJbi5pZH0sIHskc2V0OntuYW1lSWQ6IG5hbWVJZH19KTtcblxuICAgIHJldHVybiBuYW1lSWQ7XG4gIH0gY2F0Y2goZXhjZXB0aW9uKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZG9pY2hhaW4uZ2VuZXJhdGVOYW1lSWQuZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgZ2VuZXJhdGVOYW1lSWQ7XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcbmltcG9ydCBDcnlwdG9KUyBmcm9tICdjcnlwdG8tanMnO1xuaW1wb3J0IEJhc2U1OCBmcm9tICdiczU4JztcbmltcG9ydCB7IGlzUmVndGVzdCB9IGZyb20gJy4uLy4uLy4uL3N0YXJ0dXAvc2VydmVyL2RhcHAtY29uZmlndXJhdGlvbi5qcyc7XG5pbXBvcnQge2lzVGVzdG5ldH0gZnJvbSBcIi4uLy4uLy4uL3N0YXJ0dXAvc2VydmVyL2RhcHAtY29uZmlndXJhdGlvblwiO1xuXG5jb25zdCBWRVJTSU9OX0JZVEUgPSAweDM0O1xuY29uc3QgVkVSU0lPTl9CWVRFX1JFR1RFU1QgPSAweDZmO1xuY29uc3QgR2V0QWRkcmVzc1NjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICBwdWJsaWNLZXk6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfVxufSk7XG5cbmNvbnN0IGdldEFkZHJlc3MgPSAoZGF0YSkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IG91ckRhdGEgPSBkYXRhO1xuICAgIEdldEFkZHJlc3NTY2hlbWEudmFsaWRhdGUob3VyRGF0YSk7XG4gICAgcmV0dXJuIF9nZXRBZGRyZXNzKG91ckRhdGEucHVibGljS2V5KTtcbiAgfSBjYXRjaChleGNlcHRpb24pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdkb2ljaGFpbi5nZXRBZGRyZXNzLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIF9nZXRBZGRyZXNzKHB1YmxpY0tleSkge1xuICBjb25zdCBwdWJLZXkgPSBDcnlwdG9KUy5saWIuV29yZEFycmF5LmNyZWF0ZShCdWZmZXIuZnJvbShwdWJsaWNLZXksICdoZXgnKSk7XG4gIGxldCBrZXkgPSBDcnlwdG9KUy5TSEEyNTYocHViS2V5KTtcbiAga2V5ID0gQ3J5cHRvSlMuUklQRU1EMTYwKGtleSk7XG4gIGxldCB2ZXJzaW9uQnl0ZSA9IFZFUlNJT05fQllURTtcbiAgaWYoaXNSZWd0ZXN0KCkgfHwgaXNUZXN0bmV0KCkpIHZlcnNpb25CeXRlID0gVkVSU0lPTl9CWVRFX1JFR1RFU1Q7XG4gIGxldCBhZGRyZXNzID0gQnVmZmVyLmNvbmNhdChbQnVmZmVyLmZyb20oW3ZlcnNpb25CeXRlXSksIEJ1ZmZlci5mcm9tKGtleS50b1N0cmluZygpLCAnaGV4JyldKTtcbiAga2V5ID0gQ3J5cHRvSlMuU0hBMjU2KENyeXB0b0pTLmxpYi5Xb3JkQXJyYXkuY3JlYXRlKGFkZHJlc3MpKTtcbiAga2V5ID0gQ3J5cHRvSlMuU0hBMjU2KGtleSk7XG4gIGxldCBjaGVja3N1bSA9IGtleS50b1N0cmluZygpLnN1YnN0cmluZygwLCA4KTtcbiAgYWRkcmVzcyA9IG5ldyBCdWZmZXIoYWRkcmVzcy50b1N0cmluZygnaGV4JykrY2hlY2tzdW0sJ2hleCcpO1xuICBhZGRyZXNzID0gQmFzZTU4LmVuY29kZShhZGRyZXNzKTtcbiAgcmV0dXJuIGFkZHJlc3M7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGdldEFkZHJlc3M7XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCB7IGdldEJhbGFuY2UgfSBmcm9tICcuLi8uLi8uLi8uLi9zZXJ2ZXIvYXBpL2RvaWNoYWluLmpzJztcbmltcG9ydCB7IENPTkZJUk1fQ0xJRU5UfSBmcm9tICcuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9kb2ljaGFpbi1jb25maWd1cmF0aW9uLmpzJztcblxuXG5jb25zdCBnZXRfQmFsYW5jZSA9ICgpID0+IHtcbiAgICBcbiAgdHJ5IHtcbiAgICBjb25zdCBiYWw9Z2V0QmFsYW5jZShDT05GSVJNX0NMSUVOVCk7XG4gICAgcmV0dXJuIGJhbDtcbiAgICBcbiAgfSBjYXRjaChleGNlcHRpb24pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdkb2ljaGFpbi5nZXRCYWxhbmNlLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBnZXRfQmFsYW5jZTtcblxuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgQ3J5cHRvSlMgZnJvbSAnY3J5cHRvLWpzJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcblxuY29uc3QgR2V0RGF0YUhhc2hTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgZGF0YToge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9XG59KTtcblxuY29uc3QgZ2V0RGF0YUhhc2ggPSAoZGF0YSkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IG91ckRhdGEgPSBkYXRhO1xuICAgICAgR2V0RGF0YUhhc2hTY2hlbWEudmFsaWRhdGUob3VyRGF0YSk7XG4gICAgY29uc3QgaGFzaCA9IENyeXB0b0pTLlNIQTI1NihvdXJEYXRhKS50b1N0cmluZygpO1xuICAgIHJldHVybiBoYXNoO1xuICB9IGNhdGNoKGV4Y2VwdGlvbikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2RvaWNoYWluLmdldERhdGFIYXNoLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGdldERhdGFIYXNoO1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgeyByYW5kb21CeXRlcyB9IGZyb20gJ2NyeXB0byc7XG5pbXBvcnQgc2VjcDI1NmsxIGZyb20gJ3NlY3AyNTZrMSc7XG5cbmNvbnN0IGdldEtleVBhaXIgPSAoKSA9PiB7XG4gIHRyeSB7XG4gICAgbGV0IHByaXZLZXlcbiAgICBkbyB7cHJpdktleSA9IHJhbmRvbUJ5dGVzKDMyKX0gd2hpbGUoIXNlY3AyNTZrMS5wcml2YXRlS2V5VmVyaWZ5KHByaXZLZXkpKVxuICAgIGNvbnN0IHByaXZhdGVLZXkgPSBwcml2S2V5O1xuICAgIGNvbnN0IHB1YmxpY0tleSA9IHNlY3AyNTZrMS5wdWJsaWNLZXlDcmVhdGUocHJpdmF0ZUtleSk7XG4gICAgcmV0dXJuIHtcbiAgICAgIHByaXZhdGVLZXk6IHByaXZhdGVLZXkudG9TdHJpbmcoJ2hleCcpLnRvVXBwZXJDYXNlKCksXG4gICAgICBwdWJsaWNLZXk6IHB1YmxpY0tleS50b1N0cmluZygnaGV4JykudG9VcHBlckNhc2UoKVxuICAgIH1cbiAgfSBjYXRjaChleGNlcHRpb24pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdkb2ljaGFpbi5nZXRLZXlQYWlyLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGdldEtleVBhaXI7XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcbmltcG9ydCBCYXNlNTggZnJvbSAnYnM1OCc7XG5cbmNvbnN0IEdldFByaXZhdGVLZXlGcm9tV2lmU2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIHdpZjoge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9XG59KTtcblxuY29uc3QgZ2V0UHJpdmF0ZUtleUZyb21XaWYgPSAoZGF0YSkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IG91ckRhdGEgPSBkYXRhO1xuICAgIEdldFByaXZhdGVLZXlGcm9tV2lmU2NoZW1hLnZhbGlkYXRlKG91ckRhdGEpO1xuICAgIHJldHVybiBfZ2V0UHJpdmF0ZUtleUZyb21XaWYob3VyRGF0YS53aWYpO1xuICB9IGNhdGNoKGV4Y2VwdGlvbikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2RvaWNoYWluLmdldFByaXZhdGVLZXlGcm9tV2lmLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIF9nZXRQcml2YXRlS2V5RnJvbVdpZih3aWYpIHtcbiAgdmFyIHByaXZhdGVLZXkgPSBCYXNlNTguZGVjb2RlKHdpZikudG9TdHJpbmcoJ2hleCcpO1xuICBwcml2YXRlS2V5ID0gcHJpdmF0ZUtleS5zdWJzdHJpbmcoMiwgcHJpdmF0ZUtleS5sZW5ndGggLSA4KTtcbiAgaWYocHJpdmF0ZUtleS5sZW5ndGggPT09IDY2ICYmIHByaXZhdGVLZXkuZW5kc1dpdGgoXCIwMVwiKSkge1xuICAgIHByaXZhdGVLZXkgPSBwcml2YXRlS2V5LnN1YnN0cmluZygwLCBwcml2YXRlS2V5Lmxlbmd0aCAtIDIpO1xuICB9XG4gIHJldHVybiBwcml2YXRlS2V5O1xufVxuXG5leHBvcnQgZGVmYXVsdCBnZXRQcml2YXRlS2V5RnJvbVdpZjtcbiIsImltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcbmltcG9ydCB7bG9nU2VuZH0gZnJvbSBcIi4uLy4uLy4uL3N0YXJ0dXAvc2VydmVyL2xvZy1jb25maWd1cmF0aW9uXCI7XG5cbmltcG9ydCBnZXRPcHRJbktleSBmcm9tIFwiLi4vZG5zL2dldF9vcHQtaW4ta2V5XCI7XG5pbXBvcnQgZ2V0T3B0SW5Qcm92aWRlciBmcm9tIFwiLi4vZG5zL2dldF9vcHQtaW4tcHJvdmlkZXJcIjtcbmltcG9ydCBnZXRBZGRyZXNzIGZyb20gXCIuL2dldF9hZGRyZXNzXCI7XG5cbmNvbnN0IEdldFB1YmxpY0tleVNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICAgIGRvbWFpbjoge1xuICAgICAgICB0eXBlOiBTdHJpbmdcbiAgICB9XG59KTtcblxuY29uc3QgZ2V0UHVibGljS2V5QW5kQWRkcmVzcyA9IChkYXRhKSA9PiB7XG5cbiAgICBjb25zdCBvdXJEYXRhID0gZGF0YTtcbiAgICBHZXRQdWJsaWNLZXlTY2hlbWEudmFsaWRhdGUob3VyRGF0YSk7XG5cbiAgICBsZXQgcHVibGljS2V5ID0gZ2V0T3B0SW5LZXkoe2RvbWFpbjogb3VyRGF0YS5kb21haW59KTtcbiAgICBpZighcHVibGljS2V5KXtcbiAgICAgICAgY29uc3QgcHJvdmlkZXIgPSBnZXRPcHRJblByb3ZpZGVyKHtkb21haW46IG91ckRhdGEuZG9tYWlufSk7XG4gICAgICAgIGxvZ1NlbmQoXCJ1c2luZyBkb2ljaGFpbiBwcm92aWRlciBpbnN0ZWFkIG9mIGRpcmVjdGx5IGNvbmZpZ3VyZWQgcHVibGljS2V5OlwiLHtwcm92aWRlcjpwcm92aWRlcn0pO1xuICAgICAgICBwdWJsaWNLZXkgPSBnZXRPcHRJbktleSh7ZG9tYWluOiBwcm92aWRlcn0pOyAvL2dldCBwdWJsaWMga2V5IGZyb20gcHJvdmlkZXIgb3IgZmFsbGJhY2sgaWYgcHVibGlja2V5IHdhcyBub3Qgc2V0IGluIGRuc1xuICAgIH1cbiAgICBjb25zdCBkZXN0QWRkcmVzcyA9ICBnZXRBZGRyZXNzKHtwdWJsaWNLZXk6IHB1YmxpY0tleX0pO1xuICAgIGxvZ1NlbmQoJ3B1YmxpY0tleSBhbmQgZGVzdEFkZHJlc3MgJywge3B1YmxpY0tleTpwdWJsaWNLZXksZGVzdEFkZHJlc3M6ZGVzdEFkZHJlc3N9KTtcbiAgICByZXR1cm4ge3B1YmxpY0tleTpwdWJsaWNLZXksZGVzdEFkZHJlc3M6ZGVzdEFkZHJlc3N9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgZ2V0UHVibGljS2V5QW5kQWRkcmVzczsiLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcbmltcG9ydCBiaXRjb3JlIGZyb20gJ2JpdGNvcmUtbGliJztcbmltcG9ydCBNZXNzYWdlIGZyb20gJ2JpdGNvcmUtbWVzc2FnZSc7XG5cbmNvbnN0IEdldFNpZ25hdHVyZVNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICBtZXNzYWdlOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH0sXG4gIHByaXZhdGVLZXk6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfVxufSk7XG5cbmNvbnN0IGdldFNpZ25hdHVyZSA9IChkYXRhKSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3Qgb3VyRGF0YSA9IGRhdGE7XG4gICAgR2V0U2lnbmF0dXJlU2NoZW1hLnZhbGlkYXRlKG91ckRhdGEpO1xuICAgIGNvbnN0IHNpZ25hdHVyZSA9IE1lc3NhZ2Uob3VyRGF0YS5tZXNzYWdlKS5zaWduKG5ldyBiaXRjb3JlLlByaXZhdGVLZXkob3VyRGF0YS5wcml2YXRlS2V5KSk7XG4gICAgcmV0dXJuIHNpZ25hdHVyZTtcbiAgfSBjYXRjaChleGNlcHRpb24pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdkb2ljaGFpbi5nZXRTaWduYXR1cmUuZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgZ2V0U2lnbmF0dXJlO1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XG5pbXBvcnQgeyBTRU5EX0NMSUVOVCB9IGZyb20gJy4uLy4uLy4uL3N0YXJ0dXAvc2VydmVyL2RvaWNoYWluLWNvbmZpZ3VyYXRpb24uanMnO1xuaW1wb3J0IGVuY3J5cHRNZXNzYWdlIGZyb20gXCIuL2VuY3J5cHRfbWVzc2FnZVwiO1xuaW1wb3J0IHtnZXRVcmx9IGZyb20gXCIuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9kYXBwLWNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7bG9nQmxvY2tjaGFpbiwgbG9nU2VuZH0gZnJvbSBcIi4uLy4uLy4uL3N0YXJ0dXAvc2VydmVyL2xvZy1jb25maWd1cmF0aW9uXCI7XG5pbXBvcnQge2ZlZURvaSxuYW1lRG9pfSBmcm9tIFwiLi4vLi4vLi4vLi4vc2VydmVyL2FwaS9kb2ljaGFpblwiO1xuaW1wb3J0IHtPcHRJbnN9IGZyb20gXCIuLi8uLi8uLi9hcGkvb3B0LWlucy9vcHQtaW5zXCI7XG5pbXBvcnQgZ2V0UHVibGljS2V5QW5kQWRkcmVzcyBmcm9tIFwiLi9nZXRfcHVibGlja2V5X2FuZF9hZGRyZXNzX2J5X2RvbWFpblwiO1xuXG5cbmNvbnN0IEluc2VydFNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICBuYW1lSWQ6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfSxcbiAgc2lnbmF0dXJlOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH0sXG4gIGRhdGFIYXNoOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH0sXG4gIGRvbWFpbjoge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9LFxuICBzb2lEYXRlOiB7XG4gICAgdHlwZTogRGF0ZVxuICB9XG59KTtcblxuY29uc3QgaW5zZXJ0ID0gKGRhdGEpID0+IHtcbiAgY29uc3Qgb3VyRGF0YSA9IGRhdGE7XG4gIHRyeSB7XG4gICAgSW5zZXJ0U2NoZW1hLnZhbGlkYXRlKG91ckRhdGEpO1xuICAgIGxvZ1NlbmQoXCJkb21haW46XCIsb3VyRGF0YS5kb21haW4pO1xuXG4gICAgY29uc3QgcHVibGljS2V5QW5kQWRkcmVzcyA9IGdldFB1YmxpY0tleUFuZEFkZHJlc3Moe2RvbWFpbjpvdXJEYXRhLmRvbWFpbn0pO1xuICAgIGNvbnN0IGZyb20gPSBlbmNyeXB0TWVzc2FnZSh7cHVibGljS2V5OiBwdWJsaWNLZXlBbmRBZGRyZXNzLnB1YmxpY0tleSwgbWVzc2FnZTogZ2V0VXJsKCl9KTtcbiAgICBsb2dTZW5kKCdlbmNyeXB0ZWQgdXJsIGZvciB1c2UgYWQgZnJvbSBpbiBkb2ljaGFpbiB2YWx1ZTonLGdldFVybCgpLGZyb20pO1xuXG4gICAgY29uc3QgbmFtZVZhbHVlID0gSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICBzaWduYXR1cmU6IG91ckRhdGEuc2lnbmF0dXJlLFxuICAgICAgICBkYXRhSGFzaDogb3VyRGF0YS5kYXRhSGFzaCxcbiAgICAgICAgZnJvbTogZnJvbVxuICAgIH0pO1xuXG4gICAgLy9UT0RPICghKSB0aGlzIG11c3QgYmUgcmVwbGFjZWQgaW4gZnV0dXJlIGJ5IFwiYXRvbWljIG5hbWUgdHJhZGluZyBleGFtcGxlXCIgaHR0cHM6Ly93aWtpLm5hbWVjb2luLmluZm8vP3RpdGxlPUF0b21pY19OYW1lLVRyYWRpbmdcbiAgICBsb2dCbG9ja2NoYWluKCdzZW5kaW5nIGEgZmVlIHRvIGJvYiBzbyBoZSBjYW4gcGF5IHRoZSBkb2kgc3RvcmFnZSAoZGVzdEFkZHJlc3MpOicsIHB1YmxpY0tleUFuZEFkZHJlc3MuZGVzdEFkZHJlc3MpO1xuICAgIGNvbnN0IGZlZURvaVR4ID0gZmVlRG9pKFNFTkRfQ0xJRU5ULCBwdWJsaWNLZXlBbmRBZGRyZXNzLmRlc3RBZGRyZXNzKTtcbiAgICBsb2dCbG9ja2NoYWluKCdmZWUgc2VuZCB0eGlkIHRvIGRlc3RhZGRyZXNzJywgZmVlRG9pVHgsIHB1YmxpY0tleUFuZEFkZHJlc3MuZGVzdEFkZHJlc3MpO1xuXG4gICAgbG9nQmxvY2tjaGFpbignYWRkaW5nIGRhdGEgdG8gYmxvY2tjaGFpbiB2aWEgbmFtZV9kb2kgKG5hbWVJZCx2YWx1ZSxkZXN0QWRkcmVzcyk6Jywgb3VyRGF0YS5uYW1lSWQsbmFtZVZhbHVlLHB1YmxpY0tleUFuZEFkZHJlc3MuZGVzdEFkZHJlc3MpO1xuICAgIGNvbnN0IG5hbWVEb2lUeCA9IG5hbWVEb2koU0VORF9DTElFTlQsIG91ckRhdGEubmFtZUlkLCBuYW1lVmFsdWUsIHB1YmxpY0tleUFuZEFkZHJlc3MuZGVzdEFkZHJlc3MpO1xuICAgIGxvZ0Jsb2NrY2hhaW4oJ25hbWVfZG9pIGFkZGVkIGJsb2NrY2hhaW4uIHR4aWQ6JywgbmFtZURvaVR4KTtcblxuICAgIE9wdElucy51cGRhdGUoe25hbWVJZDogb3VyRGF0YS5uYW1lSWR9LCB7JHNldDoge3R4SWQ6bmFtZURvaVR4fX0pO1xuICAgIGxvZ0Jsb2NrY2hhaW4oJ3VwZGF0aW5nIE9wdEluIGxvY2FsbHkgd2l0aDonLCB7bmFtZUlkOiBvdXJEYXRhLm5hbWVJZCwgdHhJZDogbmFtZURvaVR4fSk7XG5cbiAgfSBjYXRjaChleGNlcHRpb24pIHtcbiAgICAgIE9wdElucy51cGRhdGUoe25hbWVJZDogb3VyRGF0YS5uYW1lSWR9LCB7JHNldDoge2Vycm9yOkpTT04uc3RyaW5naWZ5KGV4Y2VwdGlvbi5tZXNzYWdlKX19KTtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdkb2ljaGFpbi5pbnNlcnQuZXhjZXB0aW9uJywgZXhjZXB0aW9uKTsgLy9UT0RPIHVwZGF0ZSBvcHQtaW4gaW4gbG9jYWwgZGIgdG8gaW5mb3JtIHVzZXIgYWJvdXQgdGhlIGVycm9yISBlLmcuIEluc3VmZmljaWVudCBmdW5kcyBldGMuXG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGluc2VydDtcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tICdzaW1wbC1zY2hlbWEnO1xuaW1wb3J0IHsgQ09ORklSTV9DTElFTlQgfSBmcm9tICcuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9kb2ljaGFpbi1jb25maWd1cmF0aW9uLmpzJztcbmltcG9ydCB7Z2V0V2lmLCBzaWduTWVzc2FnZSwgZ2V0VHJhbnNhY3Rpb24sIG5hbWVEb2ksIG5hbWVTaG93fSBmcm9tIFwiLi4vLi4vLi4vLi4vc2VydmVyL2FwaS9kb2ljaGFpblwiO1xuaW1wb3J0IHtBUElfUEFUSCwgRE9JX0NPTkZJUk1BVElPTl9OT1RJRllfUk9VVEUsIFZFUlNJT059IGZyb20gXCIuLi8uLi8uLi8uLi9zZXJ2ZXIvYXBpL3Jlc3QvcmVzdFwiO1xuaW1wb3J0IHtDT05GSVJNX0FERFJFU1N9IGZyb20gXCIuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9kb2ljaGFpbi1jb25maWd1cmF0aW9uXCI7XG5pbXBvcnQge2dldEh0dHBQVVR9IGZyb20gXCIuLi8uLi8uLi8uLi9zZXJ2ZXIvYXBpL2h0dHBcIjtcbmltcG9ydCB7bG9nQ29uZmlybX0gZnJvbSBcIi4uLy4uLy4uL3N0YXJ0dXAvc2VydmVyL2xvZy1jb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgZ2V0UHJpdmF0ZUtleUZyb21XaWYgZnJvbSBcIi4vZ2V0X3ByaXZhdGUta2V5X2Zyb21fd2lmXCI7XG5pbXBvcnQgZGVjcnlwdE1lc3NhZ2UgZnJvbSBcIi4vZGVjcnlwdF9tZXNzYWdlXCI7XG5pbXBvcnQge09wdEluc30gZnJvbSBcIi4uLy4uLy4uL2FwaS9vcHQtaW5zL29wdC1pbnNcIjtcblxuY29uc3QgVXBkYXRlU2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIG5hbWVJZDoge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9LFxuICB2YWx1ZToge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9LFxuICBob3N0IDoge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgb3B0aW9uYWw6IHRydWUsXG4gIH0sXG4gIGZyb21Ib3N0VXJsIDoge1xuICAgICAgdHlwZTogU3RyaW5nXG4gIH1cbn0pO1xuXG5jb25zdCB1cGRhdGUgPSAoZGF0YSwgam9iKSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3Qgb3VyRGF0YSA9IGRhdGE7XG5cbiAgICBVcGRhdGVTY2hlbWEudmFsaWRhdGUob3VyRGF0YSk7XG5cbiAgICAvL3N0b3AgdGhpcyB1cGRhdGUgdW50aWwgdGhpcyBuYW1lIGFzIGF0IGxlYXN0IDEgY29uZmlybWF0aW9uXG4gICAgY29uc3QgbmFtZV9kYXRhID0gbmFtZVNob3coQ09ORklSTV9DTElFTlQsb3VyRGF0YS5uYW1lSWQpO1xuICAgIGlmKG5hbWVfZGF0YSA9PT0gdW5kZWZpbmVkKXtcbiAgICAgICAgcmVydW4oam9iKTtcbiAgICAgICAgbG9nQ29uZmlybSgnbmFtZSBub3QgdmlzaWJsZSAtIGRlbGF5aW5nIG5hbWUgdXBkYXRlJyxvdXJEYXRhLm5hbWVJZCk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3Qgb3VyX3RyYW5zYWN0aW9uID0gZ2V0VHJhbnNhY3Rpb24oQ09ORklSTV9DTElFTlQsbmFtZV9kYXRhLnR4aWQpO1xuICAgIGlmKG91cl90cmFuc2FjdGlvbi5jb25maXJtYXRpb25zPT09MCl7XG4gICAgICAgIHJlcnVuKGpvYik7XG4gICAgICAgIGxvZ0NvbmZpcm0oJ3RyYW5zYWN0aW9uIGhhcyAwIGNvbmZpcm1hdGlvbnMgLSBkZWxheWluZyBuYW1lIHVwZGF0ZScsSlNPTi5wYXJzZShvdXJEYXRhLnZhbHVlKSk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgbG9nQ29uZmlybSgndXBkYXRpbmcgYmxvY2tjaGFpbiB3aXRoIGRvaVNpZ25hdHVyZTonLEpTT04ucGFyc2Uob3VyRGF0YS52YWx1ZSkpO1xuICAgIGNvbnN0IHdpZiA9IGdldFdpZihDT05GSVJNX0NMSUVOVCwgQ09ORklSTV9BRERSRVNTKTtcbiAgICBjb25zdCBwcml2YXRlS2V5ID0gZ2V0UHJpdmF0ZUtleUZyb21XaWYoe3dpZjogd2lmfSk7XG4gICAgbG9nQ29uZmlybSgnZ290IHByaXZhdGUga2V5ICh3aWxsIG5vdCBzaG93IGl0IGhlcmUpIGluIG9yZGVyIHRvIGRlY3J5cHQgU2VuZC1kQXBwIGhvc3QgdXJsIGZyb20gdmFsdWU6JyxvdXJEYXRhLmZyb21Ib3N0VXJsKTtcbiAgICBjb25zdCBvdXJmcm9tSG9zdFVybCA9IGRlY3J5cHRNZXNzYWdlKHtwcml2YXRlS2V5OiBwcml2YXRlS2V5LCBtZXNzYWdlOiBvdXJEYXRhLmZyb21Ib3N0VXJsfSk7XG4gICAgbG9nQ29uZmlybSgnZGVjcnlwdGVkIGZyb21Ib3N0VXJsJyxvdXJmcm9tSG9zdFVybCk7XG4gICAgY29uc3QgdXJsID0gb3VyZnJvbUhvc3RVcmwrQVBJX1BBVEgrVkVSU0lPTitcIi9cIitET0lfQ09ORklSTUFUSU9OX05PVElGWV9ST1VURTtcblxuICAgIGxvZ0NvbmZpcm0oJ2NyZWF0aW5nIHNpZ25hdHVyZSB3aXRoIEFERFJFU1MnK0NPTkZJUk1fQUREUkVTUytcIiBuYW1lSWQ6XCIsb3VyRGF0YS52YWx1ZSk7XG4gICAgY29uc3Qgc2lnbmF0dXJlID0gc2lnbk1lc3NhZ2UoQ09ORklSTV9DTElFTlQsIENPTkZJUk1fQUREUkVTUywgb3VyRGF0YS5uYW1lSWQpOyAvL1RPRE8gd2h5IGhlcmUgb3ZlciBuYW1lSUQ/XG4gICAgbG9nQ29uZmlybSgnc2lnbmF0dXJlIGNyZWF0ZWQ6JyxzaWduYXR1cmUpO1xuXG4gICAgY29uc3QgdXBkYXRlRGF0YSA9IHtcbiAgICAgICAgbmFtZUlkOiBvdXJEYXRhLm5hbWVJZCxcbiAgICAgICAgc2lnbmF0dXJlOiBzaWduYXR1cmUsXG4gICAgICAgIGhvc3Q6IG91ckRhdGEuaG9zdFxuICAgIH07XG5cbiAgICB0cnkge1xuICAgICAgICBjb25zdCB0eGlkID0gbmFtZURvaShDT05GSVJNX0NMSUVOVCwgb3VyRGF0YS5uYW1lSWQsIG91ckRhdGEudmFsdWUsIG51bGwpO1xuICAgICAgICBsb2dDb25maXJtKCd1cGRhdGUgdHJhbnNhY3Rpb24gdHhpZDonLHR4aWQpO1xuICAgIH1jYXRjaChleGNlcHRpb24pe1xuICAgICAgICAvL1xuICAgICAgICBsb2dDb25maXJtKCd0aGlzIG5hbWVET0kgZG9lc27CtHQgaGF2ZSBhIGJsb2NrIHlldCBhbmQgd2lsbCBiZSB1cGRhdGVkIHdpdGggdGhlIG5leHQgYmxvY2sgYW5kIHdpdGggdGhlIG5leHQgcXVldWUgc3RhcnQ6JyxvdXJEYXRhLm5hbWVJZCk7XG4gICAgICAgIGlmKGV4Y2VwdGlvbi50b1N0cmluZygpLmluZGV4T2YoXCJ0aGVyZSBpcyBhbHJlYWR5IGEgcmVnaXN0cmF0aW9uIGZvciB0aGlzIGRvaSBuYW1lXCIpPT0tMSkge1xuICAgICAgICAgICAgT3B0SW5zLnVwZGF0ZSh7bmFtZUlkOiBvdXJEYXRhLm5hbWVJZH0sIHskc2V0OiB7ZXJyb3I6IEpTT04uc3RyaW5naWZ5KGV4Y2VwdGlvbi5tZXNzYWdlKX19KTtcbiAgICAgICAgfVxuICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdkb2ljaGFpbi51cGRhdGUuZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgICAgICAgLy99ZWxzZXtcbiAgICAgICAgLy8gICAgbG9nQ29uZmlybSgndGhpcyBuYW1lRE9JIGRvZXNuwrR0IGhhdmUgYSBibG9jayB5ZXQgYW5kIHdpbGwgYmUgdXBkYXRlZCB3aXRoIHRoZSBuZXh0IGJsb2NrIGFuZCB3aXRoIHRoZSBuZXh0IHF1ZXVlIHN0YXJ0Oicsb3VyRGF0YS5uYW1lSWQpO1xuICAgICAgICAvL31cbiAgICB9XG5cbiAgICBjb25zdCByZXNwb25zZSA9IGdldEh0dHBQVVQodXJsLCB1cGRhdGVEYXRhKTtcbiAgICBsb2dDb25maXJtKCdpbmZvcm1lZCBzZW5kIGRBcHAgYWJvdXQgY29uZmlybWVkIGRvaSBvbiB1cmw6Jyt1cmwrJyB3aXRoIHVwZGF0ZURhdGEnK0pTT04uc3RyaW5naWZ5KHVwZGF0ZURhdGEpK1wiIHJlc3BvbnNlOlwiLHJlc3BvbnNlLmRhdGEpO1xuICAgIGpvYi5kb25lKCk7XG4gIH0gY2F0Y2goZXhjZXB0aW9uKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZG9pY2hhaW4udXBkYXRlLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIHJlcnVuKGpvYil7XG4gICAgbG9nQ29uZmlybSgncmVydW5uaW5nIHR4aWQgaW4gMTBzZWMgLSBjYW5jZWxpbmcgb2xkIGpvYicsJycpO1xuICAgIGpvYi5jYW5jZWwoKTtcbiAgICBsb2dDb25maXJtKCdyZXN0YXJ0IGJsb2NrY2hhaW4gZG9pIHVwZGF0ZScsJycpO1xuICAgIGpvYi5yZXN0YXJ0KFxuICAgICAgICB7XG4gICAgICAgICAgICAvL3JlcGVhdHM6IDYwMCwgICAvLyBPbmx5IHJlcGVhdCB0aGlzIG9uY2VcbiAgICAgICAgICAgIC8vIFRoaXMgaXMgdGhlIGRlZmF1bHRcbiAgICAgICAgICAgLy8gd2FpdDogMTAwMDAgICAvLyBXYWl0IDEwIHNlYyBiZXR3ZWVuIHJlcGVhdHNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRGVmYXVsdCBpcyBwcmV2aW91cyBzZXR0aW5nXG4gICAgICAgIH0sXG4gICAgICAgIGZ1bmN0aW9uIChlcnIsIHJlc3VsdCkge1xuICAgICAgICAgICAgaWYgKHJlc3VsdCkge1xuICAgICAgICAgICAgICAgIGxvZ0NvbmZpcm0oJ3JlcnVubmluZyB0eGlkIGluIDEwc2VjOicscmVzdWx0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHVwZGF0ZTtcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tICdzaW1wbC1zY2hlbWEnO1xuaW1wb3J0IGJpdGNvcmUgZnJvbSAnYml0Y29yZS1saWInO1xuaW1wb3J0IE1lc3NhZ2UgZnJvbSAnYml0Y29yZS1tZXNzYWdlJztcbmltcG9ydCB7bG9nRXJyb3IsIGxvZ1ZlcmlmeX0gZnJvbSBcIi4uLy4uLy4uL3N0YXJ0dXAvc2VydmVyL2xvZy1jb25maWd1cmF0aW9uXCI7XG5jb25zdCBORVRXT1JLID0gYml0Y29yZS5OZXR3b3Jrcy5hZGQoe1xuICBuYW1lOiAnZG9pY2hhaW4nLFxuICBhbGlhczogJ2RvaWNoYWluJyxcbiAgcHVia2V5aGFzaDogMHgzNCxcbiAgcHJpdmF0ZWtleTogMHhCNCxcbiAgc2NyaXB0aGFzaDogMTMsXG4gIG5ldHdvcmtNYWdpYzogMHhmOWJlYjRmZSxcbn0pO1xuXG5jb25zdCBWZXJpZnlTaWduYXR1cmVTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgZGF0YToge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9LFxuICBwdWJsaWNLZXk6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfSxcbiAgc2lnbmF0dXJlOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH1cbn0pO1xuXG5jb25zdCB2ZXJpZnlTaWduYXR1cmUgPSAoZGF0YSkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IG91ckRhdGEgPSBkYXRhO1xuICAgIGxvZ1ZlcmlmeSgndmVyaWZ5U2lnbmF0dXJlOicsb3VyRGF0YSk7XG4gICAgVmVyaWZ5U2lnbmF0dXJlU2NoZW1hLnZhbGlkYXRlKG91ckRhdGEpO1xuICAgIGNvbnN0IGFkZHJlc3MgPSBiaXRjb3JlLkFkZHJlc3MuZnJvbVB1YmxpY0tleShuZXcgYml0Y29yZS5QdWJsaWNLZXkob3VyRGF0YS5wdWJsaWNLZXkpLCBORVRXT1JLKTtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIE1lc3NhZ2Uob3VyRGF0YS5kYXRhKS52ZXJpZnkoYWRkcmVzcywgb3VyRGF0YS5zaWduYXR1cmUpO1xuICAgIH0gY2F0Y2goZXJyb3IpIHsgbG9nRXJyb3IoZXJyb3IpfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfSBjYXRjaChleGNlcHRpb24pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdkb2ljaGFpbi52ZXJpZnlTaWduYXR1cmUuZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgdmVyaWZ5U2lnbmF0dXJlO1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XG5pbXBvcnQgeyBPcHRJbnMgfSBmcm9tICcuLi8uLi8uLi9hcGkvb3B0LWlucy9vcHQtaW5zLmpzJztcbmltcG9ydCB7IFNlbmRlcnMgfSBmcm9tICcuLi8uLi8uLi9hcGkvc2VuZGVycy9zZW5kZXJzLmpzJztcbmltcG9ydCB7IFJlY2lwaWVudHMgfSBmcm9tICcuLi8uLi8uLi9hcGkvcmVjaXBpZW50cy9yZWNpcGllbnRzLmpzJztcbmltcG9ydCBnZW5lcmF0ZU5hbWVJZCBmcm9tICcuL2dlbmVyYXRlX25hbWUtaWQuanMnO1xuaW1wb3J0IGdldFNpZ25hdHVyZSBmcm9tICcuL2dldF9zaWduYXR1cmUuanMnO1xuaW1wb3J0IGdldERhdGFIYXNoIGZyb20gJy4vZ2V0X2RhdGEtaGFzaC5qcyc7XG5pbXBvcnQgYWRkSW5zZXJ0QmxvY2tjaGFpbkpvYiBmcm9tICcuLi9qb2JzL2FkZF9pbnNlcnRfYmxvY2tjaGFpbi5qcyc7XG5pbXBvcnQge2xvZ1NlbmR9IGZyb20gXCIuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9sb2ctY29uZmlndXJhdGlvblwiO1xuXG5jb25zdCBXcml0ZVRvQmxvY2tjaGFpblNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICBpZDoge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9XG59KTtcblxuY29uc3Qgd3JpdGVUb0Jsb2NrY2hhaW4gPSAoZGF0YSkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IG91ckRhdGEgPSBkYXRhO1xuICAgIFdyaXRlVG9CbG9ja2NoYWluU2NoZW1hLnZhbGlkYXRlKG91ckRhdGEpO1xuXG4gICAgY29uc3Qgb3B0SW4gPSBPcHRJbnMuZmluZE9uZSh7X2lkOiBkYXRhLmlkfSk7XG4gICAgY29uc3QgcmVjaXBpZW50ID0gUmVjaXBpZW50cy5maW5kT25lKHtfaWQ6IG9wdEluLnJlY2lwaWVudH0pO1xuICAgIGNvbnN0IHNlbmRlciA9IFNlbmRlcnMuZmluZE9uZSh7X2lkOiBvcHRJbi5zZW5kZXJ9KTtcbiAgICBsb2dTZW5kKFwib3B0SW4gZGF0YTpcIix7aW5kZXg6b3VyRGF0YS5pbmRleCwgb3B0SW46b3B0SW4scmVjaXBpZW50OnJlY2lwaWVudCxzZW5kZXI6IHNlbmRlcn0pO1xuXG5cbiAgICBjb25zdCBuYW1lSWQgPSBnZW5lcmF0ZU5hbWVJZCh7aWQ6IGRhdGEuaWQsaW5kZXg6b3B0SW4uaW5kZXgsbWFzdGVyRG9pOm9wdEluLm1hc3RlckRvaSB9KTtcbiAgICBjb25zdCBzaWduYXR1cmUgPSBnZXRTaWduYXR1cmUoe21lc3NhZ2U6IHJlY2lwaWVudC5lbWFpbCtzZW5kZXIuZW1haWwsIHByaXZhdGVLZXk6IHJlY2lwaWVudC5wcml2YXRlS2V5fSk7XG4gICAgbG9nU2VuZChcImdlbmVyYXRlZCBzaWduYXR1cmUgZnJvbSBlbWFpbCByZWNpcGllbnQgYW5kIHNlbmRlcjpcIixzaWduYXR1cmUpO1xuXG4gICAgbGV0IGRhdGFIYXNoID0gXCJcIjtcblxuICAgIGlmKG9wdEluLmRhdGEpIHtcbiAgICAgIGRhdGFIYXNoID0gZ2V0RGF0YUhhc2goe2RhdGE6IG9wdEluLmRhdGF9KTtcbiAgICAgIGxvZ1NlbmQoXCJnZW5lcmF0ZWQgZGF0YWhhc2ggZnJvbSBnaXZlbiBkYXRhOlwiLGRhdGFIYXNoKTtcbiAgICB9XG5cbiAgICBjb25zdCBwYXJ0cyA9IHJlY2lwaWVudC5lbWFpbC5zcGxpdChcIkBcIik7XG4gICAgY29uc3QgZG9tYWluID0gcGFydHNbcGFydHMubGVuZ3RoLTFdO1xuICAgIGxvZ1NlbmQoXCJlbWFpbCBkb21haW4gZm9yIHB1YmxpY0tleSByZXF1ZXN0IGlzOlwiLGRvbWFpbik7XG4gICAgYWRkSW5zZXJ0QmxvY2tjaGFpbkpvYih7XG4gICAgICBuYW1lSWQ6IG5hbWVJZCxcbiAgICAgIHNpZ25hdHVyZTogc2lnbmF0dXJlLFxuICAgICAgZGF0YUhhc2g6IGRhdGFIYXNoLFxuICAgICAgZG9tYWluOiBkb21haW4sXG4gICAgICBzb2lEYXRlOiBvcHRJbi5jcmVhdGVkQXRcbiAgICB9KVxuICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdkb2ljaGFpbi53cml0ZVRvQmxvY2tjaGFpbi5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCB3cml0ZVRvQmxvY2tjaGFpblxuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XG5pbXBvcnQgeyBIYXNoSWRzIH0gZnJvbSAnLi4vLi4vLi4vc3RhcnR1cC9zZXJ2ZXIvZW1haWwtY29uZmlndXJhdGlvbi5qcyc7XG5cbmNvbnN0IERlY29kZURvaUhhc2hTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgaGFzaDoge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9XG59KTtcblxuY29uc3QgZGVjb2RlRG9pSGFzaCA9IChoYXNoKSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3Qgb3VySGFzaCA9IGhhc2g7XG4gICAgRGVjb2RlRG9pSGFzaFNjaGVtYS52YWxpZGF0ZShvdXJIYXNoKTtcbiAgICBjb25zdCBoZXggPSBIYXNoSWRzLmRlY29kZUhleChvdXJIYXNoLmhhc2gpO1xuICAgIGlmKCFoZXggfHwgaGV4ID09PSAnJykgdGhyb3cgXCJXcm9uZyBoYXNoXCI7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IG9iaiA9IEpTT04ucGFyc2UoQnVmZmVyKGhleCwgJ2hleCcpLnRvU3RyaW5nKCdhc2NpaScpKTtcbiAgICAgIHJldHVybiBvYmo7XG4gICAgfSBjYXRjaChleGNlcHRpb24pIHt0aHJvdyBcIldyb25nIGhhc2hcIjt9XG4gIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2VtYWlscy5kZWNvZGVfZG9pLWhhc2guZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgZGVjb2RlRG9pSGFzaDtcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tICdzaW1wbC1zY2hlbWEnO1xuaW1wb3J0IHsgSGFzaElkcyB9IGZyb20gJy4uLy4uLy4uL3N0YXJ0dXAvc2VydmVyL2VtYWlsLWNvbmZpZ3VyYXRpb24uanMnO1xuXG5jb25zdCBHZW5lcmF0ZURvaUhhc2hTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgaWQ6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfSxcbiAgdG9rZW46IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfSxcbiAgcmVkaXJlY3Q6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfVxufSk7XG5cbmNvbnN0IGdlbmVyYXRlRG9pSGFzaCA9IChvcHRJbikgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IG91ck9wdEluID0gb3B0SW47XG4gICAgR2VuZXJhdGVEb2lIYXNoU2NoZW1hLnZhbGlkYXRlKG91ck9wdEluKTtcblxuICAgIGNvbnN0IGpzb24gPSBKU09OLnN0cmluZ2lmeSh7XG4gICAgICBpZDogb3VyT3B0SW4uaWQsXG4gICAgICB0b2tlbjogb3VyT3B0SW4udG9rZW4sXG4gICAgICByZWRpcmVjdDogb3VyT3B0SW4ucmVkaXJlY3RcbiAgICB9KTtcblxuICAgIGNvbnN0IGhleCA9IEJ1ZmZlcihqc29uKS50b1N0cmluZygnaGV4Jyk7XG4gICAgY29uc3QgaGFzaCA9IEhhc2hJZHMuZW5jb2RlSGV4KGhleCk7XG4gICAgcmV0dXJuIGhhc2g7XG4gIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2VtYWlscy5nZW5lcmF0ZV9kb2ktaGFzaC5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBnZW5lcmF0ZURvaUhhc2g7XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcbmltcG9ydCB7bG9nQ29uZmlybX0gZnJvbSBcIi4uLy4uLy4uL3N0YXJ0dXAvc2VydmVyL2xvZy1jb25maWd1cmF0aW9uXCI7XG5cbmNvbnN0IFBMQUNFSE9MREVSX1JFR0VYID0gL1xcJHsoW1xcd10qKX0vZztcbmNvbnN0IFBhcnNlVGVtcGxhdGVTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgdGVtcGxhdGU6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gIH0sXG4gIGRhdGE6IHtcbiAgICB0eXBlOiBPYmplY3QsXG4gICAgYmxhY2tib3g6IHRydWVcbiAgfVxufSk7XG5cbmNvbnN0IHBhcnNlVGVtcGxhdGUgPSAoZGF0YSkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IG91ckRhdGEgPSBkYXRhO1xuICAgIC8vbG9nQ29uZmlybSgncGFyc2VUZW1wbGF0ZTonLG91ckRhdGEpO1xuXG4gICAgUGFyc2VUZW1wbGF0ZVNjaGVtYS52YWxpZGF0ZShvdXJEYXRhKTtcbiAgICBsb2dDb25maXJtKCdQYXJzZVRlbXBsYXRlU2NoZW1hIHZhbGlkYXRlZCcpO1xuXG4gICAgdmFyIF9tYXRjaDtcbiAgICB2YXIgdGVtcGxhdGUgPSBvdXJEYXRhLnRlbXBsYXRlO1xuICAgLy9sb2dDb25maXJtKCdkb2luZyBzb21lIHJlZ2V4IHdpdGggdGVtcGxhdGU6Jyx0ZW1wbGF0ZSk7XG5cbiAgICBkbyB7XG4gICAgICBfbWF0Y2ggPSBQTEFDRUhPTERFUl9SRUdFWC5leGVjKHRlbXBsYXRlKTtcbiAgICAgIGlmKF9tYXRjaCkgdGVtcGxhdGUgPSBfcmVwbGFjZVBsYWNlaG9sZGVyKHRlbXBsYXRlLCBfbWF0Y2gsIG91ckRhdGEuZGF0YVtfbWF0Y2hbMV1dKTtcbiAgICB9IHdoaWxlIChfbWF0Y2gpO1xuICAgIHJldHVybiB0ZW1wbGF0ZTtcbiAgfSBjYXRjaCAoZXhjZXB0aW9uKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZW1haWxzLnBhcnNlVGVtcGxhdGUuZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgfVxufTtcblxuZnVuY3Rpb24gX3JlcGxhY2VQbGFjZWhvbGRlcih0ZW1wbGF0ZSwgX21hdGNoLCByZXBsYWNlKSB7XG4gIHZhciByZXAgPSByZXBsYWNlO1xuICBpZihyZXBsYWNlID09PSB1bmRlZmluZWQpIHJlcCA9IFwiXCI7XG4gIHJldHVybiB0ZW1wbGF0ZS5zdWJzdHJpbmcoMCwgX21hdGNoLmluZGV4KStyZXArdGVtcGxhdGUuc3Vic3RyaW5nKF9tYXRjaC5pbmRleCtfbWF0Y2hbMF0ubGVuZ3RoKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgcGFyc2VUZW1wbGF0ZTtcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tICdzaW1wbC1zY2hlbWEnO1xuaW1wb3J0IHtsb2dDb25maXJtfSBmcm9tIFwiLi4vLi4vLi4vc3RhcnR1cC9zZXJ2ZXIvbG9nLWNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IERPSV9NQUlMX0RFRkFVTFRfRU1BSUxfRlJPTSB9IGZyb20gJy4uLy4uLy4uL3N0YXJ0dXAvc2VydmVyL2VtYWlsLWNvbmZpZ3VyYXRpb24uanMnO1xuXG5jb25zdCBTZW5kTWFpbFNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICBmcm9tOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIHJlZ0V4OiBTaW1wbGVTY2hlbWEuUmVnRXguRW1haWxcbiAgfSxcbiAgdG86IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgcmVnRXg6IFNpbXBsZVNjaGVtYS5SZWdFeC5FbWFpbFxuICB9LFxuICBzdWJqZWN0OiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICB9LFxuICBtZXNzYWdlOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICB9LFxuICByZXR1cm5QYXRoOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIHJlZ0V4OiBTaW1wbGVTY2hlbWEuUmVnRXguRW1haWxcbiAgfVxufSk7XG5cbmNvbnN0IHNlbmRNYWlsID0gKG1haWwpID0+IHtcbiAgdHJ5IHtcblxuICAgIG1haWwuZnJvbSA9IERPSV9NQUlMX0RFRkFVTFRfRU1BSUxfRlJPTTtcblxuICAgIGNvbnN0IG91ck1haWwgPSBtYWlsO1xuICAgIGxvZ0NvbmZpcm0oJ3NlbmRpbmcgZW1haWwgd2l0aCBkYXRhOicse3RvOm1haWwudG8sIHN1YmplY3Q6bWFpbC5zdWJqZWN0fSk7XG4gICAgU2VuZE1haWxTY2hlbWEudmFsaWRhdGUob3VyTWFpbCk7XG4gICAgLy9UT0RPOiBUZXh0IGZhbGxiYWNrXG4gICAgRW1haWwuc2VuZCh7XG4gICAgICBmcm9tOiBtYWlsLmZyb20sXG4gICAgICB0bzogbWFpbC50byxcbiAgICAgIHN1YmplY3Q6IG1haWwuc3ViamVjdCxcbiAgICAgIGh0bWw6IG1haWwubWVzc2FnZSxcbiAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgJ1JldHVybi1QYXRoJzogbWFpbC5yZXR1cm5QYXRoLFxuICAgICAgfVxuICAgIH0pO1xuXG4gIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2VtYWlscy5zZW5kLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IHNlbmRNYWlsO1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgeyBKb2IgfSBmcm9tICdtZXRlb3IvdnNpdnNpOmpvYi1jb2xsZWN0aW9uJztcbmltcG9ydCB7IEJsb2NrY2hhaW5Kb2JzIH0gZnJvbSAnLi4vLi4vLi4vLi4vc2VydmVyL2FwaS9ibG9ja2NoYWluX2pvYnMuanMnO1xuXG5jb25zdCBhZGRDaGVja05ld1RyYW5zYWN0aW9uc0Jsb2NrY2hhaW5Kb2IgPSAoKSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3Qgam9iID0gbmV3IEpvYihCbG9ja2NoYWluSm9icywgJ2NoZWNrTmV3VHJhbnNhY3Rpb24nLCB7fSk7XG4gICAgam9iLnJldHJ5KHtyZXRyaWVzOiA2MCwgd2FpdDogMTUqMTAwMCB9KS5zYXZlKHtjYW5jZWxSZXBlYXRzOiB0cnVlfSk7XG4gIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2pvYnMuYWRkQ2hlY2tOZXdUcmFuc2FjdGlvbnNCbG9ja2NoYWluLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGFkZENoZWNrTmV3VHJhbnNhY3Rpb25zQmxvY2tjaGFpbkpvYjtcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tICdzaW1wbC1zY2hlbWEnO1xuaW1wb3J0IHsgSm9iIH0gZnJvbSAnbWV0ZW9yL3ZzaXZzaTpqb2ItY29sbGVjdGlvbic7XG5pbXBvcnQgeyBEQXBwSm9icyB9IGZyb20gJy4uLy4uLy4uLy4uL3NlcnZlci9hcGkvZGFwcF9qb2JzLmpzJztcblxuY29uc3QgQWRkRmV0Y2hEb2lNYWlsRGF0YUpvYlNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICBuYW1lOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH0sXG4gIGRvbWFpbjoge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9XG59KTtcblxuY29uc3QgYWRkRmV0Y2hEb2lNYWlsRGF0YUpvYiA9IChkYXRhKSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3Qgb3VyRGF0YSA9IGRhdGE7XG4gICAgQWRkRmV0Y2hEb2lNYWlsRGF0YUpvYlNjaGVtYS52YWxpZGF0ZShvdXJEYXRhKTtcbiAgICBjb25zdCBqb2IgPSBuZXcgSm9iKERBcHBKb2JzLCAnZmV0Y2hEb2lNYWlsRGF0YScsIG91ckRhdGEpO1xuICAgIGpvYi5yZXRyeSh7cmV0cmllczogNSwgd2FpdDogMSoxMCoxMDAwIH0pLnNhdmUoKTsgLy9jaGVjayBldmVyeSAxMCBzZWNzIDUgdGltZXNcbiAgfSBjYXRjaCAoZXhjZXB0aW9uKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignam9icy5hZGRGZXRjaERvaU1haWxEYXRhLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGFkZEZldGNoRG9pTWFpbERhdGFKb2I7XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCB7IEpvYiB9IGZyb20gJ21ldGVvci92c2l2c2k6am9iLWNvbGxlY3Rpb24nO1xuaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tICdzaW1wbC1zY2hlbWEnO1xuaW1wb3J0IHsgQmxvY2tjaGFpbkpvYnMgfSBmcm9tICcuLi8uLi8uLi8uLi9zZXJ2ZXIvYXBpL2Jsb2NrY2hhaW5fam9icy5qcyc7XG5cbmNvbnN0IEFkZEluc2VydEJsb2NrY2hhaW5Kb2JTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgbmFtZUlkOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH0sXG4gIHNpZ25hdHVyZToge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9LFxuICBkYXRhSGFzaDoge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICBvcHRpb25hbDp0cnVlXG4gIH0sXG4gIGRvbWFpbjoge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9LFxuICBzb2lEYXRlOiB7XG4gICAgdHlwZTogRGF0ZVxuICB9XG59KTtcblxuY29uc3QgYWRkSW5zZXJ0QmxvY2tjaGFpbkpvYiA9IChlbnRyeSkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IG91ckVudHJ5ID0gZW50cnk7XG4gICAgQWRkSW5zZXJ0QmxvY2tjaGFpbkpvYlNjaGVtYS52YWxpZGF0ZShvdXJFbnRyeSk7XG4gICAgY29uc3Qgam9iID0gbmV3IEpvYihCbG9ja2NoYWluSm9icywgJ2luc2VydCcsIG91ckVudHJ5KTtcbiAgICBqb2IucmV0cnkoe3JldHJpZXM6IDEwLCB3YWl0OiAzKjYwKjEwMDAgfSkuc2F2ZSgpOyAvL2NoZWNrIGV2ZXJ5IDEwc2VjIGZvciAxaFxuICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdqb2JzLmFkZEluc2VydEJsb2NrY2hhaW4uZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgYWRkSW5zZXJ0QmxvY2tjaGFpbkpvYjtcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IHsgSm9iIH0gZnJvbSAnbWV0ZW9yL3ZzaXZzaTpqb2ItY29sbGVjdGlvbic7XG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XG5pbXBvcnQgeyBNYWlsSm9icyB9IGZyb20gJy4uLy4uLy4uLy4uL3NlcnZlci9hcGkvbWFpbF9qb2JzLmpzJztcblxuY29uc3QgQWRkU2VuZE1haWxKb2JTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgLypmcm9tOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIHJlZ0V4OiBTaW1wbGVTY2hlbWEuUmVnRXguRW1haWxcbiAgfSwqL1xuICB0bzoge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICByZWdFeDogU2ltcGxlU2NoZW1hLlJlZ0V4LkVtYWlsXG4gIH0sXG4gIHN1YmplY3Q6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gIH0sXG4gIG1lc3NhZ2U6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gIH0sXG4gIHJldHVyblBhdGg6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgcmVnRXg6IFNpbXBsZVNjaGVtYS5SZWdFeC5FbWFpbFxuICB9XG59KTtcblxuY29uc3QgYWRkU2VuZE1haWxKb2IgPSAobWFpbCkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IG91ck1haWwgPSBtYWlsO1xuICAgIEFkZFNlbmRNYWlsSm9iU2NoZW1hLnZhbGlkYXRlKG91ck1haWwpO1xuICAgIGNvbnN0IGpvYiA9IG5ldyBKb2IoTWFpbEpvYnMsICdzZW5kJywgb3VyTWFpbCk7XG4gICAgam9iLnJldHJ5KHtyZXRyaWVzOiA1LCB3YWl0OiA2MCoxMDAwIH0pLnNhdmUoKTtcbiAgfSBjYXRjaCAoZXhjZXB0aW9uKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignam9icy5hZGRTZW5kTWFpbC5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBhZGRTZW5kTWFpbEpvYjtcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tICdzaW1wbC1zY2hlbWEnO1xuaW1wb3J0IHsgSm9iIH0gZnJvbSAnbWV0ZW9yL3ZzaXZzaTpqb2ItY29sbGVjdGlvbic7XG5pbXBvcnQgeyBCbG9ja2NoYWluSm9icyB9IGZyb20gJy4uLy4uLy4uLy4uL3NlcnZlci9hcGkvYmxvY2tjaGFpbl9qb2JzLmpzJztcblxuY29uc3QgQWRkVXBkYXRlQmxvY2tjaGFpbkpvYlNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICBuYW1lSWQ6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfSxcbiAgdmFsdWU6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfSxcbiAgZnJvbUhvc3RVcmw6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfSxcbiAgaG9zdDoge1xuICAgICAgdHlwZTogU3RyaW5nXG4gIH1cbn0pO1xuXG5jb25zdCBhZGRVcGRhdGVCbG9ja2NoYWluSm9iID0gKGVudHJ5KSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3Qgb3VyRW50cnkgPSBlbnRyeTtcbiAgICBBZGRVcGRhdGVCbG9ja2NoYWluSm9iU2NoZW1hLnZhbGlkYXRlKG91ckVudHJ5KTtcbiAgICBjb25zdCBqb2IgPSBuZXcgSm9iKEJsb2NrY2hhaW5Kb2JzLCAndXBkYXRlJywgb3VyRW50cnkpO1xuICAgIGpvYi5yZXRyeSh7cmV0cmllczogMzYwLCB3YWl0OiAxKjEwKjEwMDAgfSkuc2F2ZSgpO1xuICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdqb2JzLmFkZFVwZGF0ZUJsb2NrY2hhaW4uZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgYWRkVXBkYXRlQmxvY2tjaGFpbkpvYjtcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IGkxOG4gZnJvbSAnbWV0ZW9yL3VuaXZlcnNlOmkxOG4nO1xuXG4vLyB1bml2ZXJzZTppMThuIG9ubHkgYnVuZGxlcyB0aGUgZGVmYXVsdCBsYW5ndWFnZSBvbiB0aGUgY2xpZW50IHNpZGUuXG4vLyBUbyBnZXQgYSBsaXN0IG9mIGFsbCBhdmlhbGJsZSBsYW5ndWFnZXMgd2l0aCBhdCBsZWFzdCBvbmUgdHJhbnNsYXRpb24sXG4vLyBpMThuLmdldExhbmd1YWdlcygpIG11c3QgYmUgY2FsbGVkIHNlcnZlciBzaWRlLlxuY29uc3QgZ2V0TGFuZ3VhZ2VzID0gKCkgPT4ge1xuICB0cnkge1xuICAgIHJldHVybiBpMThuLmdldExhbmd1YWdlcygpO1xuICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdsYW5ndWFnZXMuZ2V0LmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGdldExhbmd1YWdlcztcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tICdzaW1wbC1zY2hlbWEnO1xuaW1wb3J0IHsgTWV0YSB9IGZyb20gJy4uLy4uLy4uL2FwaS9tZXRhL21ldGEuanMnO1xuXG5jb25zdCBBZGRPclVwZGF0ZU1ldGFTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAga2V5OiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH0sXG4gIHZhbHVlOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH1cbn0pO1xuXG5jb25zdCBhZGRPclVwZGF0ZU1ldGEgPSAoZGF0YSkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IG91ckRhdGEgPSBkYXRhO1xuICAgIEFkZE9yVXBkYXRlTWV0YVNjaGVtYS52YWxpZGF0ZShvdXJEYXRhKTtcbiAgICBjb25zdCBtZXRhID0gTWV0YS5maW5kT25lKHtrZXk6IG91ckRhdGEua2V5fSk7XG4gICAgaWYobWV0YSAhPT0gdW5kZWZpbmVkKSBNZXRhLnVwZGF0ZSh7X2lkIDogbWV0YS5faWR9LCB7JHNldDoge1xuICAgICAgdmFsdWU6IG91ckRhdGEudmFsdWVcbiAgICB9fSk7XG4gICAgZWxzZSByZXR1cm4gTWV0YS5pbnNlcnQoe1xuICAgICAga2V5OiBvdXJEYXRhLmtleSxcbiAgICAgIHZhbHVlOiBvdXJEYXRhLnZhbHVlXG4gICAgfSlcbiAgfSBjYXRjaCAoZXhjZXB0aW9uKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignbWV0YS5hZGRPclVwZGF0ZS5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBhZGRPclVwZGF0ZU1ldGE7XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcbmltcG9ydCB7IE9wdElucyB9IGZyb20gJy4uLy4uLy4uL2FwaS9vcHQtaW5zL29wdC1pbnMuanMnO1xuXG5jb25zdCBBZGRPcHRJblNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICBuYW1lOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH1cbn0pO1xuXG5jb25zdCBhZGRPcHRJbiA9IChvcHRJbikgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IG91ck9wdEluID0gb3B0SW47XG4gICAgQWRkT3B0SW5TY2hlbWEudmFsaWRhdGUob3VyT3B0SW4pO1xuICAgIGNvbnN0IG9wdElucyA9IE9wdElucy5maW5kKHtuYW1lSWQ6IG91ck9wdEluLm5hbWV9KS5mZXRjaCgpO1xuICAgIGlmKG9wdElucy5sZW5ndGggPiAwKSByZXR1cm4gb3B0SW5zWzBdLl9pZDtcbiAgICBjb25zdCBvcHRJbklkID0gT3B0SW5zLmluc2VydCh7XG4gICAgICBuYW1lSWQ6IG91ck9wdEluLm5hbWVcbiAgICB9KTtcbiAgICByZXR1cm4gb3B0SW5JZDtcbiAgfSBjYXRjaCAoZXhjZXB0aW9uKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignb3B0LWlucy5hZGQuZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgYWRkT3B0SW47XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcbmltcG9ydCBhZGRSZWNpcGllbnQgZnJvbSAnLi4vcmVjaXBpZW50cy9hZGQuanMnO1xuaW1wb3J0IGFkZFNlbmRlciBmcm9tICcuLi9zZW5kZXJzL2FkZC5qcyc7XG5pbXBvcnQgeyBPcHRJbnMgfSBmcm9tICcuLi8uLi8uLi9hcGkvb3B0LWlucy9vcHQtaW5zLmpzJztcbmltcG9ydCB3cml0ZVRvQmxvY2tjaGFpbiBmcm9tICcuLi9kb2ljaGFpbi93cml0ZV90b19ibG9ja2NoYWluLmpzJztcbmltcG9ydCB7bG9nRXJyb3IsIGxvZ1NlbmR9IGZyb20gXCIuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9sb2ctY29uZmlndXJhdGlvblwiO1xuXG5cbmNvbnN0IEFkZE9wdEluU2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIHJlY2lwaWVudF9tYWlsOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIHJlZ0V4OiBTaW1wbGVTY2hlbWEuUmVnRXguRW1haWxcbiAgfSxcbiAgc2VuZGVyX21haWw6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgcmVnRXg6IFNpbXBsZVNjaGVtYS5SZWdFeC5FbWFpbFxuICB9LFxuICBkYXRhOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIG9wdGlvbmFsOiB0cnVlXG4gIH0sXG4gIG1hc3Rlcl9kb2k6IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIG9wdGlvbmFsOiB0cnVlXG4gIH0sXG4gIGluZGV4OiB7XG4gICAgICB0eXBlOiBTaW1wbGVTY2hlbWEuSW50ZWdlcixcbiAgICAgIG9wdGlvbmFsOiB0cnVlXG4gIH0sXG4gIG93bmVySWQ6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgcmVnRXg6IFNpbXBsZVNjaGVtYS5SZWdFeC5pZFxuICB9XG59KTtcblxuY29uc3QgYWRkT3B0SW4gPSAob3B0SW4pID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBvdXJPcHRJbiA9IG9wdEluO1xuICAgIEFkZE9wdEluU2NoZW1hLnZhbGlkYXRlKG91ck9wdEluKTtcblxuICAgIGNvbnN0IHJlY2lwaWVudCA9IHtcbiAgICAgIGVtYWlsOiBvdXJPcHRJbi5yZWNpcGllbnRfbWFpbFxuICAgIH1cbiAgICBjb25zdCByZWNpcGllbnRJZCA9IGFkZFJlY2lwaWVudChyZWNpcGllbnQpO1xuICAgIGNvbnN0IHNlbmRlciA9IHtcbiAgICAgIGVtYWlsOiBvdXJPcHRJbi5zZW5kZXJfbWFpbFxuICAgIH1cbiAgICBjb25zdCBzZW5kZXJJZCA9IGFkZFNlbmRlcihzZW5kZXIpO1xuICAgIFxuICAgIGNvbnN0IG9wdElucyA9IE9wdElucy5maW5kKHtyZWNpcGllbnQ6IHJlY2lwaWVudElkLCBzZW5kZXI6IHNlbmRlcklkfSkuZmV0Y2goKTtcbiAgICBpZihvcHRJbnMubGVuZ3RoID4gMCkgcmV0dXJuIG9wdEluc1swXS5faWQ7IC8vVE9ETyB3aGVuIFNPSSBhbHJlYWR5IGV4aXN0cyByZXNlbmQgZW1haWw/XG5cbiAgICBpZihvdXJPcHRJbi5kYXRhICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIEpTT04ucGFyc2Uob3VyT3B0SW4uZGF0YSk7XG4gICAgICB9IGNhdGNoKGVycm9yKSB7XG4gICAgICAgIGxvZ0Vycm9yKFwib3VyT3B0SW4uZGF0YTpcIixvdXJPcHRJbi5kYXRhKTtcbiAgICAgICAgdGhyb3cgXCJJbnZhbGlkIGRhdGEganNvbiBcIjtcbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgY29uc3Qgb3B0SW5JZCA9IE9wdElucy5pbnNlcnQoe1xuICAgICAgcmVjaXBpZW50OiByZWNpcGllbnRJZCxcbiAgICAgIHNlbmRlcjogc2VuZGVySWQsXG4gICAgICBpbmRleDogb3VyT3B0SW4uaW5kZXgsXG4gICAgICBtYXN0ZXJEb2kgOiBvdXJPcHRJbi5tYXN0ZXJfZG9pLFxuICAgICAgZGF0YTogb3VyT3B0SW4uZGF0YSxcbiAgICAgIG93bmVySWQ6IG91ck9wdEluLm93bmVySWRcbiAgICB9KTtcbiAgICBsb2dTZW5kKFwib3B0SW4gKGluZGV4OlwiK291ck9wdEluLmluZGV4K1wiIGFkZGVkIHRvIGxvY2FsIGRiIHdpdGggb3B0SW5JZFwiLG9wdEluSWQpO1xuXG4gICAgd3JpdGVUb0Jsb2NrY2hhaW4oe2lkOiBvcHRJbklkfSk7XG4gICAgcmV0dXJuIG9wdEluSWQ7XG4gIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ29wdC1pbnMuYWRkQW5kV3JpdGVUb0Jsb2NrY2hhaW4uZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgYWRkT3B0SW47XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcbmltcG9ydCB7IENPTkZJUk1fQ0xJRU5ULCBDT05GSVJNX0FERFJFU1MgfSBmcm9tICcuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9kb2ljaGFpbi1jb25maWd1cmF0aW9uLmpzJztcbmltcG9ydCB7IE9wdElucyB9IGZyb20gJy4uLy4uLy4uL2FwaS9vcHQtaW5zL29wdC1pbnMuanMnO1xuaW1wb3J0IHsgRG9pY2hhaW5FbnRyaWVzIH0gZnJvbSAnLi4vLi4vLi4vYXBpL2RvaWNoYWluL2VudHJpZXMuanMnO1xuaW1wb3J0IGRlY29kZURvaUhhc2ggZnJvbSAnLi4vZW1haWxzL2RlY29kZV9kb2ktaGFzaC5qcyc7XG5pbXBvcnQgeyBzaWduTWVzc2FnZSB9IGZyb20gJy4uLy4uLy4uLy4uL3NlcnZlci9hcGkvZG9pY2hhaW4uanMnO1xuaW1wb3J0IGFkZFVwZGF0ZUJsb2NrY2hhaW5Kb2IgZnJvbSAnLi4vam9icy9hZGRfdXBkYXRlX2Jsb2NrY2hhaW4uanMnO1xuaW1wb3J0IHtsb2dDb25maXJtfSBmcm9tIFwiLi4vLi4vLi4vc3RhcnR1cC9zZXJ2ZXIvbG9nLWNvbmZpZ3VyYXRpb25cIjtcblxuY29uc3QgQ29uZmlybU9wdEluU2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIGhvc3Q6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfSxcbiAgaGFzaDoge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9XG59KTtcblxuY29uc3QgY29uZmlybU9wdEluID0gKHJlcXVlc3QpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBvdXJSZXF1ZXN0ID0gcmVxdWVzdDtcbiAgICBDb25maXJtT3B0SW5TY2hlbWEudmFsaWRhdGUob3VyUmVxdWVzdCk7XG4gICAgY29uc3QgZGVjb2RlZCA9IGRlY29kZURvaUhhc2goe2hhc2g6IHJlcXVlc3QuaGFzaH0pO1xuICAgIGNvbnN0IG9wdEluID0gT3B0SW5zLmZpbmRPbmUoe19pZDogZGVjb2RlZC5pZH0pO1xuICAgIGlmKG9wdEluID09PSB1bmRlZmluZWQgfHwgb3B0SW4uY29uZmlybWF0aW9uVG9rZW4gIT09IGRlY29kZWQudG9rZW4pIHRocm93IFwiSW52YWxpZCBoYXNoXCI7XG4gICAgY29uc3QgY29uZmlybWVkQXQgPSBuZXcgRGF0ZSgpO1xuXG4gICAgT3B0SW5zLnVwZGF0ZSh7X2lkIDogb3B0SW4uX2lkfSx7JHNldDp7Y29uZmlybWVkQXQ6IGNvbmZpcm1lZEF0LCBjb25maXJtZWRCeTogb3VyUmVxdWVzdC5ob3N0fSwgJHVuc2V0OiB7Y29uZmlybWF0aW9uVG9rZW46IFwiXCJ9fSk7XG5cbiAgICAvL1RPRE8gaGVyZSBmaW5kIGFsbCBEb2ljaGFpbkVudHJpZXMgaW4gdGhlIGxvY2FsIGRhdGFiYXNlICBhbmQgYmxvY2tjaGFpbiB3aXRoIHRoZSBzYW1lIG1hc3RlckRvaVxuICAgIGNvbnN0IGVudHJpZXMgPSBEb2ljaGFpbkVudHJpZXMuZmluZCh7JG9yOiBbe25hbWU6IG9wdEluLm5hbWVJZH0sIHttYXN0ZXJEb2k6IG9wdEluLm5hbWVJZH1dfSk7XG4gICAgaWYoZW50cmllcyA9PT0gdW5kZWZpbmVkKSB0aHJvdyBcIkRvaWNoYWluIGVudHJ5L2VudHJpZXMgbm90IGZvdW5kXCI7XG5cbiAgICBlbnRyaWVzLmZvckVhY2goZW50cnkgPT4ge1xuICAgICAgICBsb2dDb25maXJtKCdjb25maXJtaW5nIERvaUNoYWluRW50cnk6JyxlbnRyeSk7XG5cbiAgICAgICAgY29uc3QgdmFsdWUgPSBKU09OLnBhcnNlKGVudHJ5LnZhbHVlKTtcbiAgICAgICAgbG9nQ29uZmlybSgnZ2V0U2lnbmF0dXJlIChvbmx5IG9mIHZhbHVlISknLCB2YWx1ZSk7XG5cbiAgICAgICAgY29uc3QgZG9pU2lnbmF0dXJlID0gc2lnbk1lc3NhZ2UoQ09ORklSTV9DTElFTlQsIENPTkZJUk1fQUREUkVTUywgdmFsdWUuc2lnbmF0dXJlKTtcbiAgICAgICAgbG9nQ29uZmlybSgnZ290IGRvaVNpZ25hdHVyZTonLGRvaVNpZ25hdHVyZSk7XG4gICAgICAgIGNvbnN0IGZyb21Ib3N0VXJsID0gdmFsdWUuZnJvbTtcblxuICAgICAgICBkZWxldGUgdmFsdWUuZnJvbTtcbiAgICAgICAgdmFsdWUuZG9pVGltZXN0YW1wID0gY29uZmlybWVkQXQudG9JU09TdHJpbmcoKTtcbiAgICAgICAgdmFsdWUuZG9pU2lnbmF0dXJlID0gZG9pU2lnbmF0dXJlO1xuICAgICAgICBjb25zdCBqc29uVmFsdWUgPSBKU09OLnN0cmluZ2lmeSh2YWx1ZSk7XG4gICAgICAgIGxvZ0NvbmZpcm0oJ3VwZGF0aW5nIERvaWNoYWluIG5hbWVJZDonK29wdEluLm5hbWVJZCsnIHdpdGggdmFsdWU6Jyxqc29uVmFsdWUpO1xuXG4gICAgICAgIGFkZFVwZGF0ZUJsb2NrY2hhaW5Kb2Ioe1xuICAgICAgICAgICAgbmFtZUlkOiBlbnRyeS5uYW1lLFxuICAgICAgICAgICAgdmFsdWU6IGpzb25WYWx1ZSxcbiAgICAgICAgICAgIGZyb21Ib3N0VXJsOiBmcm9tSG9zdFVybCxcbiAgICAgICAgICAgIGhvc3Q6IG91clJlcXVlc3QuaG9zdFxuICAgICAgICB9KTtcbiAgICB9KTtcbiAgICBsb2dDb25maXJtKCdyZWRpcmVjdGluZyB1c2VyIHRvOicsZGVjb2RlZC5yZWRpcmVjdCk7XG4gICAgcmV0dXJuIGRlY29kZWQucmVkaXJlY3Q7XG4gIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ29wdC1pbnMuY29uZmlybS5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBjb25maXJtT3B0SW5cbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tICdzaW1wbC1zY2hlbWEnO1xuaW1wb3J0IHsgcmFuZG9tQnl0ZXMgfSBmcm9tICdjcnlwdG8nO1xuaW1wb3J0IHsgT3B0SW5zIH0gZnJvbSAnLi4vLi4vLi4vYXBpL29wdC1pbnMvb3B0LWlucy5qcyc7XG5cbmNvbnN0IEdlbmVyYXRlRG9pVG9rZW5TY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgaWQ6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfVxufSk7XG5cbmNvbnN0IGdlbmVyYXRlRG9pVG9rZW4gPSAob3B0SW4pID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBvdXJPcHRJbiA9IG9wdEluO1xuICAgIEdlbmVyYXRlRG9pVG9rZW5TY2hlbWEudmFsaWRhdGUob3VyT3B0SW4pO1xuICAgIGNvbnN0IHRva2VuID0gcmFuZG9tQnl0ZXMoMzIpLnRvU3RyaW5nKCdoZXgnKTtcbiAgICBPcHRJbnMudXBkYXRlKHtfaWQgOiBvdXJPcHRJbi5pZH0seyRzZXQ6e2NvbmZpcm1hdGlvblRva2VuOiB0b2tlbn19KTtcbiAgICByZXR1cm4gdG9rZW47XG4gIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ29wdC1pbnMuZ2VuZXJhdGVfZG9pLXRva2VuLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGdlbmVyYXRlRG9pVG9rZW5cbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tICdzaW1wbC1zY2hlbWEnO1xuaW1wb3J0IHsgT3B0SW5zIH0gZnJvbSAnLi4vLi4vLi4vYXBpL29wdC1pbnMvb3B0LWlucy5qcyc7XG5pbXBvcnQgeyBSZWNpcGllbnRzIH0gZnJvbSAnLi4vLi4vLi4vYXBpL3JlY2lwaWVudHMvcmVjaXBpZW50cy5qcyc7XG5pbXBvcnQgdmVyaWZ5U2lnbmF0dXJlIGZyb20gJy4uL2RvaWNoYWluL3ZlcmlmeV9zaWduYXR1cmUuanMnO1xuaW1wb3J0IHtsb2dTZW5kfSBmcm9tIFwiLi4vLi4vLi4vc3RhcnR1cC9zZXJ2ZXIvbG9nLWNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCBnZXRQdWJsaWNLZXlBbmRBZGRyZXNzIGZyb20gXCIuLi9kb2ljaGFpbi9nZXRfcHVibGlja2V5X2FuZF9hZGRyZXNzX2J5X2RvbWFpblwiO1xuXG5jb25zdCBVcGRhdGVPcHRJblN0YXR1c1NjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICBuYW1lSWQ6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfSxcbiAgc2lnbmF0dXJlOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH0sXG4gIGhvc3Q6IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIG9wdGlvbmFsOiB0cnVlXG4gIH1cbn0pO1xuXG5cbmNvbnN0IHVwZGF0ZU9wdEluU3RhdHVzID0gKGRhdGEpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBvdXJEYXRhID0gZGF0YTtcbiAgICBsb2dTZW5kKCdjb25maXJtIGRBcHAgY29uZmlybXMgb3B0SW46JyxKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gICAgVXBkYXRlT3B0SW5TdGF0dXNTY2hlbWEudmFsaWRhdGUob3VyRGF0YSk7XG4gICAgY29uc3Qgb3B0SW4gPSBPcHRJbnMuZmluZE9uZSh7bmFtZUlkOiBvdXJEYXRhLm5hbWVJZH0pO1xuICAgIGlmKG9wdEluID09PSB1bmRlZmluZWQpIHRocm93IFwiT3B0LUluIG5vdCBmb3VuZFwiO1xuICAgIGxvZ1NlbmQoJ2NvbmZpcm0gZEFwcCBjb25maXJtcyBvcHRJbjonLG91ckRhdGEubmFtZUlkKTtcblxuICAgIGNvbnN0IHJlY2lwaWVudCA9IFJlY2lwaWVudHMuZmluZE9uZSh7X2lkOiBvcHRJbi5yZWNpcGllbnR9KTtcbiAgICBpZihyZWNpcGllbnQgPT09IHVuZGVmaW5lZCkgdGhyb3cgXCJSZWNpcGllbnQgbm90IGZvdW5kXCI7XG4gICAgY29uc3QgcGFydHMgPSByZWNpcGllbnQuZW1haWwuc3BsaXQoXCJAXCIpO1xuICAgIGNvbnN0IGRvbWFpbiA9IHBhcnRzW3BhcnRzLmxlbmd0aC0xXTtcbiAgICBjb25zdCBwdWJsaWNLZXlBbmRBZGRyZXNzID0gZ2V0UHVibGljS2V5QW5kQWRkcmVzcyh7ZG9tYWluOmRvbWFpbn0pO1xuXG4gICAgLy9UT0RPIGdldHRpbmcgaW5mb3JtYXRpb24gZnJvbSBCb2IgdGhhdCBhIGNlcnRhaW4gbmFtZUlkIChET0kpIGdvdCBjb25maXJtZWQuXG4gICAgaWYoIXZlcmlmeVNpZ25hdHVyZSh7cHVibGljS2V5OiBwdWJsaWNLZXlBbmRBZGRyZXNzLnB1YmxpY0tleSwgZGF0YTogb3VyRGF0YS5uYW1lSWQsIHNpZ25hdHVyZTogb3VyRGF0YS5zaWduYXR1cmV9KSkge1xuICAgICAgdGhyb3cgXCJBY2Nlc3MgZGVuaWVkXCI7XG4gICAgfVxuICAgIGxvZ1NlbmQoJ3NpZ25hdHVyZSB2YWxpZCBmb3IgcHVibGljS2V5JywgcHVibGljS2V5QW5kQWRkcmVzcy5wdWJsaWNLZXkpO1xuXG4gICAgT3B0SW5zLnVwZGF0ZSh7X2lkIDogb3B0SW4uX2lkfSx7JHNldDp7Y29uZmlybWVkQXQ6IG5ldyBEYXRlKCksIGNvbmZpcm1lZEJ5OiBvdXJEYXRhLmhvc3R9fSk7XG4gIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2RhcHBzLnNlbmQudXBkYXRlT3B0SW5TdGF0dXMuZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgdXBkYXRlT3B0SW5TdGF0dXM7XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcbmltcG9ydCB7IFZFUklGWV9DTElFTlQgfSBmcm9tICcuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9kb2ljaGFpbi1jb25maWd1cmF0aW9uLmpzJztcbmltcG9ydCB7IG5hbWVTaG93IH0gZnJvbSAnLi4vLi4vLi4vLi4vc2VydmVyL2FwaS9kb2ljaGFpbi5qcyc7XG5pbXBvcnQgZ2V0T3B0SW5Qcm92aWRlciBmcm9tICcuLi9kbnMvZ2V0X29wdC1pbi1wcm92aWRlci5qcyc7XG5pbXBvcnQgZ2V0T3B0SW5LZXkgZnJvbSAnLi4vZG5zL2dldF9vcHQtaW4ta2V5LmpzJztcbmltcG9ydCB2ZXJpZnlTaWduYXR1cmUgZnJvbSAnLi4vZG9pY2hhaW4vdmVyaWZ5X3NpZ25hdHVyZS5qcyc7XG5pbXBvcnQge2xvZ1ZlcmlmeX0gZnJvbSBcIi4uLy4uLy4uL3N0YXJ0dXAvc2VydmVyL2xvZy1jb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgZ2V0UHVibGljS2V5QW5kQWRkcmVzcyBmcm9tIFwiLi4vZG9pY2hhaW4vZ2V0X3B1YmxpY2tleV9hbmRfYWRkcmVzc19ieV9kb21haW5cIjtcblxuY29uc3QgVmVyaWZ5T3B0SW5TY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgcmVjaXBpZW50X21haWw6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgcmVnRXg6IFNpbXBsZVNjaGVtYS5SZWdFeC5FbWFpbFxuICB9LFxuICBzZW5kZXJfbWFpbDoge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICByZWdFeDogU2ltcGxlU2NoZW1hLlJlZ0V4LkVtYWlsXG4gIH0sXG4gIG5hbWVfaWQ6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfSxcbiAgcmVjaXBpZW50X3B1YmxpY19rZXk6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfVxufSk7XG5cbmNvbnN0IHZlcmlmeU9wdEluID0gKGRhdGEpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBvdXJEYXRhID0gZGF0YTtcbiAgICBWZXJpZnlPcHRJblNjaGVtYS52YWxpZGF0ZShvdXJEYXRhKTtcbiAgICBjb25zdCBlbnRyeSA9IG5hbWVTaG93KFZFUklGWV9DTElFTlQsIG91ckRhdGEubmFtZV9pZCk7XG4gICAgaWYoZW50cnkgPT09IHVuZGVmaW5lZCkgcmV0dXJuIGZhbHNlO1xuICAgIGNvbnN0IGVudHJ5RGF0YSA9IEpTT04ucGFyc2UoZW50cnkudmFsdWUpO1xuICAgIGNvbnN0IGZpcnN0Q2hlY2sgPSB2ZXJpZnlTaWduYXR1cmUoe1xuICAgICAgZGF0YTogb3VyRGF0YS5yZWNpcGllbnRfbWFpbCtvdXJEYXRhLnNlbmRlcl9tYWlsLFxuICAgICAgc2lnbmF0dXJlOiBlbnRyeURhdGEuc2lnbmF0dXJlLFxuICAgICAgcHVibGljS2V5OiBvdXJEYXRhLnJlY2lwaWVudF9wdWJsaWNfa2V5XG4gICAgfSlcblxuICAgIGlmKCFmaXJzdENoZWNrKSByZXR1cm4ge2ZpcnN0Q2hlY2s6IGZhbHNlfTtcbiAgICBjb25zdCBwYXJ0cyA9IG91ckRhdGEucmVjaXBpZW50X21haWwuc3BsaXQoXCJAXCIpOyAvL1RPRE8gcHV0IHRoaXMgaW50byBnZXRQdWJsaWNLZXlBbmRBZGRyZXNzXG4gICAgY29uc3QgZG9tYWluID0gcGFydHNbcGFydHMubGVuZ3RoLTFdO1xuICAgIGNvbnN0IHB1YmxpY0tleUFuZEFkZHJlc3MgPSBnZXRQdWJsaWNLZXlBbmRBZGRyZXNzKHtkb21haW46IGRvbWFpbn0pO1xuXG4gICAgY29uc3Qgc2Vjb25kQ2hlY2sgPSB2ZXJpZnlTaWduYXR1cmUoe1xuICAgICAgZGF0YTogZW50cnlEYXRhLnNpZ25hdHVyZSxcbiAgICAgIHNpZ25hdHVyZTogZW50cnlEYXRhLmRvaVNpZ25hdHVyZSxcbiAgICAgIHB1YmxpY0tleTogcHVibGljS2V5QW5kQWRkcmVzcy5wdWJsaWNLZXlcbiAgICB9KVxuXG4gICAgaWYoIXNlY29uZENoZWNrKSByZXR1cm4ge3NlY29uZENoZWNrOiBmYWxzZX07XG4gICAgcmV0dXJuIHRydWU7XG4gIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ29wdC1pbnMudmVyaWZ5LmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IHZlcmlmeU9wdEluXG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcbmltcG9ydCB7IFJlY2lwaWVudHMgfSBmcm9tICcuLi8uLi8uLi9hcGkvcmVjaXBpZW50cy9yZWNpcGllbnRzLmpzJztcbmltcG9ydCBnZXRLZXlQYWlyIGZyb20gJy4uL2RvaWNoYWluL2dldF9rZXktcGFpci5qcyc7XG5cbmNvbnN0IEFkZFJlY2lwaWVudFNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICBlbWFpbDoge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICByZWdFeDogU2ltcGxlU2NoZW1hLlJlZ0V4LkVtYWlsXG4gIH1cbn0pO1xuXG5jb25zdCBhZGRSZWNpcGllbnQgPSAocmVjaXBpZW50KSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3Qgb3VyUmVjaXBpZW50ID0gcmVjaXBpZW50O1xuICAgIEFkZFJlY2lwaWVudFNjaGVtYS52YWxpZGF0ZShvdXJSZWNpcGllbnQpO1xuICAgIGNvbnN0IHJlY2lwaWVudHMgPSBSZWNpcGllbnRzLmZpbmQoe2VtYWlsOiByZWNpcGllbnQuZW1haWx9KS5mZXRjaCgpO1xuICAgIGlmKHJlY2lwaWVudHMubGVuZ3RoID4gMCkgcmV0dXJuIHJlY2lwaWVudHNbMF0uX2lkO1xuICAgIGNvbnN0IGtleVBhaXIgPSBnZXRLZXlQYWlyKCk7XG4gICAgcmV0dXJuIFJlY2lwaWVudHMuaW5zZXJ0KHtcbiAgICAgIGVtYWlsOiBvdXJSZWNpcGllbnQuZW1haWwsXG4gICAgICBwcml2YXRlS2V5OiBrZXlQYWlyLnByaXZhdGVLZXksXG4gICAgICBwdWJsaWNLZXk6IGtleVBhaXIucHVibGljS2V5XG4gICAgfSlcbiAgfSBjYXRjaCAoZXhjZXB0aW9uKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcigncmVjaXBpZW50cy5hZGQuZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgYWRkUmVjaXBpZW50O1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XG5pbXBvcnQgeyBTZW5kZXJzIH0gZnJvbSAnLi4vLi4vLi4vYXBpL3NlbmRlcnMvc2VuZGVycy5qcyc7XG5cbmNvbnN0IEFkZFNlbmRlclNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICBlbWFpbDoge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICByZWdFeDogU2ltcGxlU2NoZW1hLlJlZ0V4LkVtYWlsXG4gIH1cbn0pO1xuXG5jb25zdCBhZGRTZW5kZXIgPSAoc2VuZGVyKSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3Qgb3VyU2VuZGVyID0gc2VuZGVyO1xuICAgIEFkZFNlbmRlclNjaGVtYS52YWxpZGF0ZShvdXJTZW5kZXIpO1xuICAgIGNvbnN0IHNlbmRlcnMgPSBTZW5kZXJzLmZpbmQoe2VtYWlsOiBzZW5kZXIuZW1haWx9KS5mZXRjaCgpO1xuICAgIGlmKHNlbmRlcnMubGVuZ3RoID4gMCkgcmV0dXJuIHNlbmRlcnNbMF0uX2lkO1xuICAgIHJldHVybiBTZW5kZXJzLmluc2VydCh7XG4gICAgICBlbWFpbDogb3VyU2VuZGVyLmVtYWlsXG4gICAgfSlcbiAgfSBjYXRjaCAoZXhjZXB0aW9uKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignc2VuZGVycy5hZGQuZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgYWRkU2VuZGVyO1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0RlYnVnKCkge1xuICBpZihNZXRlb3Iuc2V0dGluZ3MgIT09IHVuZGVmaW5lZCAmJlxuICAgICBNZXRlb3Iuc2V0dGluZ3MuYXBwICE9PSB1bmRlZmluZWQgJiZcbiAgICAgTWV0ZW9yLnNldHRpbmdzLmFwcC5kZWJ1ZyAhPT0gdW5kZWZpbmVkKSByZXR1cm4gTWV0ZW9yLnNldHRpbmdzLmFwcC5kZWJ1Z1xuICByZXR1cm4gZmFsc2U7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1JlZ3Rlc3QoKSB7XG4gIGlmKE1ldGVvci5zZXR0aW5ncyAhPT0gdW5kZWZpbmVkICYmXG4gICAgIE1ldGVvci5zZXR0aW5ncy5hcHAgIT09IHVuZGVmaW5lZCAmJlxuICAgICBNZXRlb3Iuc2V0dGluZ3MuYXBwLnJlZ3Rlc3QgIT09IHVuZGVmaW5lZCkgcmV0dXJuIE1ldGVvci5zZXR0aW5ncy5hcHAucmVndGVzdFxuICByZXR1cm4gZmFsc2U7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1Rlc3RuZXQoKSB7XG4gICAgaWYoTWV0ZW9yLnNldHRpbmdzICE9PSB1bmRlZmluZWQgJiZcbiAgICAgICAgTWV0ZW9yLnNldHRpbmdzLmFwcCAhPT0gdW5kZWZpbmVkICYmXG4gICAgICAgIE1ldGVvci5zZXR0aW5ncy5hcHAudGVzdG5ldCAhPT0gdW5kZWZpbmVkKSByZXR1cm4gTWV0ZW9yLnNldHRpbmdzLmFwcC50ZXN0bmV0XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0VXJsKCkge1xuICBpZihNZXRlb3Iuc2V0dGluZ3MgIT09IHVuZGVmaW5lZCAmJlxuICAgICBNZXRlb3Iuc2V0dGluZ3MuYXBwICE9PSB1bmRlZmluZWQgJiZcbiAgICAgTWV0ZW9yLnNldHRpbmdzLmFwcC5ob3N0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICBsZXQgcG9ydCA9IDMwMDA7XG4gICAgICAgaWYoTWV0ZW9yLnNldHRpbmdzLmFwcC5wb3J0ICE9PSB1bmRlZmluZWQpIHBvcnQgPSBNZXRlb3Iuc2V0dGluZ3MuYXBwLnBvcnRcbiAgICAgICByZXR1cm4gXCJodHRwOi8vXCIrTWV0ZW9yLnNldHRpbmdzLmFwcC5ob3N0K1wiOlwiK3BvcnQrXCIvXCI7XG4gIH1cbiAgcmV0dXJuIE1ldGVvci5hYnNvbHV0ZVVybCgpO1xufVxuIiwiZXhwb3J0IGNvbnN0IEZBTExCQUNLX1BST1ZJREVSID0gXCJkb2ljaGFpbi5vcmdcIjtcbiIsImltcG9ydCBuYW1lY29pbiBmcm9tICduYW1lY29pbic7XG5pbXBvcnQgeyBTRU5EX0FQUCwgQ09ORklSTV9BUFAsIFZFUklGWV9BUFAsIGlzQXBwVHlwZSB9IGZyb20gJy4vdHlwZS1jb25maWd1cmF0aW9uLmpzJztcblxudmFyIHNlbmRTZXR0aW5ncyA9IE1ldGVvci5zZXR0aW5ncy5zZW5kO1xudmFyIHNlbmRDbGllbnQgPSB1bmRlZmluZWQ7XG5pZihpc0FwcFR5cGUoU0VORF9BUFApKSB7XG4gIGlmKCFzZW5kU2V0dGluZ3MgfHwgIXNlbmRTZXR0aW5ncy5kb2ljaGFpbilcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFwiY29uZmlnLnNlbmQuZG9pY2hhaW5cIiwgXCJTZW5kIGFwcCBkb2ljaGFpbiBzZXR0aW5ncyBub3QgZm91bmRcIilcbiAgc2VuZENsaWVudCA9IGNyZWF0ZUNsaWVudChzZW5kU2V0dGluZ3MuZG9pY2hhaW4pO1xufVxuZXhwb3J0IGNvbnN0IFNFTkRfQ0xJRU5UID0gc2VuZENsaWVudDtcblxudmFyIGNvbmZpcm1TZXR0aW5ncyA9IE1ldGVvci5zZXR0aW5ncy5jb25maXJtO1xudmFyIGNvbmZpcm1DbGllbnQgPSB1bmRlZmluZWQ7XG52YXIgY29uZmlybUFkZHJlc3MgPSB1bmRlZmluZWQ7XG5pZihpc0FwcFR5cGUoQ09ORklSTV9BUFApKSB7XG4gIGlmKCFjb25maXJtU2V0dGluZ3MgfHwgIWNvbmZpcm1TZXR0aW5ncy5kb2ljaGFpbilcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFwiY29uZmlnLmNvbmZpcm0uZG9pY2hhaW5cIiwgXCJDb25maXJtIGFwcCBkb2ljaGFpbiBzZXR0aW5ncyBub3QgZm91bmRcIilcbiAgY29uZmlybUNsaWVudCA9IGNyZWF0ZUNsaWVudChjb25maXJtU2V0dGluZ3MuZG9pY2hhaW4pO1xuICBjb25maXJtQWRkcmVzcyA9IGNvbmZpcm1TZXR0aW5ncy5kb2ljaGFpbi5hZGRyZXNzO1xufVxuZXhwb3J0IGNvbnN0IENPTkZJUk1fQ0xJRU5UID0gY29uZmlybUNsaWVudDtcbmV4cG9ydCBjb25zdCBDT05GSVJNX0FERFJFU1MgPSBjb25maXJtQWRkcmVzcztcblxudmFyIHZlcmlmeVNldHRpbmdzID0gTWV0ZW9yLnNldHRpbmdzLnZlcmlmeTtcbnZhciB2ZXJpZnlDbGllbnQgPSB1bmRlZmluZWQ7XG5pZihpc0FwcFR5cGUoVkVSSUZZX0FQUCkpIHtcbiAgaWYoIXZlcmlmeVNldHRpbmdzIHx8ICF2ZXJpZnlTZXR0aW5ncy5kb2ljaGFpbilcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFwiY29uZmlnLnZlcmlmeS5kb2ljaGFpblwiLCBcIlZlcmlmeSBhcHAgZG9pY2hhaW4gc2V0dGluZ3Mgbm90IGZvdW5kXCIpXG4gIHZlcmlmeUNsaWVudCA9IGNyZWF0ZUNsaWVudCh2ZXJpZnlTZXR0aW5ncy5kb2ljaGFpbik7XG59XG5leHBvcnQgY29uc3QgVkVSSUZZX0NMSUVOVCA9IHZlcmlmeUNsaWVudDtcblxuZnVuY3Rpb24gY3JlYXRlQ2xpZW50KHNldHRpbmdzKSB7XG4gIHJldHVybiBuZXcgbmFtZWNvaW4uQ2xpZW50KHtcbiAgICBob3N0OiBzZXR0aW5ncy5ob3N0LFxuICAgIHBvcnQ6IHNldHRpbmdzLnBvcnQsXG4gICAgdXNlcjogc2V0dGluZ3MudXNlcm5hbWUsXG4gICAgcGFzczogc2V0dGluZ3MucGFzc3dvcmRcbiAgfSk7XG59XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCB7IFNFTkRfQVBQLCBDT05GSVJNX0FQUCwgaXNBcHBUeXBlIH0gZnJvbSAnLi90eXBlLWNvbmZpZ3VyYXRpb24uanMnO1xuaW1wb3J0IEhhc2hpZHMgZnJvbSAnaGFzaGlkcyc7XG4vL2NvbnN0IEhhc2hpZHMgPSByZXF1aXJlKCdoYXNoaWRzJykuZGVmYXVsdDtcbmltcG9ydCB7bG9nQ29uZmlybX0gZnJvbSBcIi4vbG9nLWNvbmZpZ3VyYXRpb25cIjtcblxuZXhwb3J0IGNvbnN0IEhhc2hJZHMgPSBuZXcgSGFzaGlkcygnMHh1Z21MZTdOeWVlNnZrMWlGODgoNkNtd3Bxb0c0aFEqLVQ3NHRqWXdeTzJ2T08oWGwtOTF3QTgqbkNnX2xYJCcpO1xuXG52YXIgc2VuZFNldHRpbmdzID0gTWV0ZW9yLnNldHRpbmdzLnNlbmQ7XG52YXIgZG9pTWFpbEZldGNoVXJsID0gdW5kZWZpbmVkO1xuXG5pZihpc0FwcFR5cGUoU0VORF9BUFApKSB7XG4gIGlmKCFzZW5kU2V0dGluZ3MgfHwgIXNlbmRTZXR0aW5ncy5kb2lNYWlsRmV0Y2hVcmwpXG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcihcImNvbmZpZy5zZW5kLmVtYWlsXCIsIFwiU2V0dGluZ3Mgbm90IGZvdW5kXCIpO1xuICBkb2lNYWlsRmV0Y2hVcmwgPSBzZW5kU2V0dGluZ3MuZG9pTWFpbEZldGNoVXJsO1xufVxuZXhwb3J0IGNvbnN0IERPSV9NQUlMX0ZFVENIX1VSTCA9IGRvaU1haWxGZXRjaFVybDtcblxudmFyIGRlZmF1bHRGcm9tID0gdW5kZWZpbmVkO1xuaWYoaXNBcHBUeXBlKENPTkZJUk1fQVBQKSkge1xuICB2YXIgY29uZmlybVNldHRpbmdzID0gTWV0ZW9yLnNldHRpbmdzLmNvbmZpcm07XG5cbiAgaWYoIWNvbmZpcm1TZXR0aW5ncyB8fCAhY29uZmlybVNldHRpbmdzLnNtdHApXG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoXCJjb25maWcuY29uZmlybS5zbXRwXCIsIFwiQ29uZmlybSBhcHAgZW1haWwgc210cCBzZXR0aW5ncyBub3QgZm91bmRcIilcblxuICBpZighY29uZmlybVNldHRpbmdzLnNtdHAuZGVmYXVsdEZyb20pXG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoXCJjb25maWcuY29uZmlybS5kZWZhdWx0RnJvbVwiLCBcIkNvbmZpcm0gYXBwIGVtYWlsIGRlZmF1bHRGcm9tIG5vdCBmb3VuZFwiKVxuXG4gIGRlZmF1bHRGcm9tICA9ICBjb25maXJtU2V0dGluZ3Muc210cC5kZWZhdWx0RnJvbTtcblxuICBsb2dDb25maXJtKCdzZW5kaW5nIHdpdGggZGVmYXVsdEZyb206JyxkZWZhdWx0RnJvbSk7XG5cbiAgTWV0ZW9yLnN0YXJ0dXAoKCkgPT4ge1xuXG4gICBpZihjb25maXJtU2V0dGluZ3Muc210cC51c2VybmFtZSA9PT0gdW5kZWZpbmVkKXtcbiAgICAgICBwcm9jZXNzLmVudi5NQUlMX1VSTCA9ICdzbXRwOi8vJyArXG4gICAgICAgICAgIGVuY29kZVVSSUNvbXBvbmVudChjb25maXJtU2V0dGluZ3Muc210cC5zZXJ2ZXIpICtcbiAgICAgICAgICAgJzonICtcbiAgICAgICAgICAgY29uZmlybVNldHRpbmdzLnNtdHAucG9ydDtcbiAgIH1lbHNle1xuICAgICAgIHByb2Nlc3MuZW52Lk1BSUxfVVJMID0gJ3NtdHA6Ly8nICtcbiAgICAgICAgICAgZW5jb2RlVVJJQ29tcG9uZW50KGNvbmZpcm1TZXR0aW5ncy5zbXRwLnVzZXJuYW1lKSArXG4gICAgICAgICAgICc6JyArIGVuY29kZVVSSUNvbXBvbmVudChjb25maXJtU2V0dGluZ3Muc210cC5wYXNzd29yZCkgK1xuICAgICAgICAgICAnQCcgKyBlbmNvZGVVUklDb21wb25lbnQoY29uZmlybVNldHRpbmdzLnNtdHAuc2VydmVyKSArXG4gICAgICAgICAgICc6JyArXG4gICAgICAgICAgIGNvbmZpcm1TZXR0aW5ncy5zbXRwLnBvcnQ7XG4gICB9XG5cbiAgIGxvZ0NvbmZpcm0oJ3VzaW5nIE1BSUxfVVJMOicscHJvY2Vzcy5lbnYuTUFJTF9VUkwpO1xuXG4gICBpZihjb25maXJtU2V0dGluZ3Muc210cC5OT0RFX1RMU19SRUpFQ1RfVU5BVVRIT1JJWkVEIT09dW5kZWZpbmVkKVxuICAgICAgIHByb2Nlc3MuZW52Lk5PREVfVExTX1JFSkVDVF9VTkFVVEhPUklaRUQgPSBjb25maXJtU2V0dGluZ3Muc210cC5OT0RFX1RMU19SRUpFQ1RfVU5BVVRIT1JJWkVEOyAvLzBcbiAgfSk7XG59XG5leHBvcnQgY29uc3QgRE9JX01BSUxfREVGQVVMVF9FTUFJTF9GUk9NID0gZGVmYXVsdEZyb207XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCB7IFJvbGVzIH0gZnJvbSAnbWV0ZW9yL2FsYW5uaW5nOnJvbGVzJztcbmltcG9ydCB7TWV0YX0gZnJvbSAnLi4vLi4vYXBpL21ldGEvbWV0YS5qcydcbk1ldGVvci5zdGFydHVwKCgpID0+IHtcbiAgIGxldCB2ZXJzaW9uPUFzc2V0cy5nZXRUZXh0KFwidmVyc2lvbi5qc29uXCIpO1xuXG4gIGlmIChNZXRhLmZpbmQoKS5jb3VudCgpID4gMCl7XG4gICAgTWV0YS5yZW1vdmUoe30pO1xuICB9XG4gICBNZXRhLmluc2VydCh7a2V5OlwidmVyc2lvblwiLHZhbHVlOnZlcnNpb259KTtcbiAgXG4gIGlmKE1ldGVvci51c2Vycy5maW5kKCkuY291bnQoKSA9PT0gMCkge1xuICAgIGNvbnN0IGlkID0gQWNjb3VudHMuY3JlYXRlVXNlcih7XG4gICAgICB1c2VybmFtZTogJ2FkbWluJyxcbiAgICAgIGVtYWlsOiAnYWRtaW5Ac2VuZGVmZmVjdC5kZScsXG4gICAgICBwYXNzd29yZDogJ3Bhc3N3b3JkJ1xuICAgIH0pO1xuICAgIFJvbGVzLmFkZFVzZXJzVG9Sb2xlcyhpZCwgJ2FkbWluJyk7XG4gIH1cbn0pO1xuIiwiaW1wb3J0ICcuL2xvZy1jb25maWd1cmF0aW9uLmpzJztcbmltcG9ydCAnLi9kYXBwLWNvbmZpZ3VyYXRpb24uanMnO1xuaW1wb3J0ICcuL3R5cGUtY29uZmlndXJhdGlvbi5qcyc7XG5pbXBvcnQgJy4vZG5zLWNvbmZpZ3VyYXRpb24uanMnO1xuaW1wb3J0ICcuL2RvaWNoYWluLWNvbmZpZ3VyYXRpb24uanMnO1xuaW1wb3J0ICcuL2ZpeHR1cmVzLmpzJztcbmltcG9ydCAnLi9yZWdpc3Rlci1hcGkuanMnO1xuaW1wb3J0ICcuL3VzZXJhY2NvdW50cy1jb25maWd1cmF0aW9uLmpzJztcbmltcG9ydCAnLi9zZWN1cml0eS5qcyc7XG5pbXBvcnQgJy4vZW1haWwtY29uZmlndXJhdGlvbi5qcyc7XG5pbXBvcnQgJy4vam9icy5qcyc7XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCB7IE1haWxKb2JzIH0gZnJvbSAnLi4vLi4vLi4vc2VydmVyL2FwaS9tYWlsX2pvYnMuanMnO1xuaW1wb3J0IHsgQmxvY2tjaGFpbkpvYnMgfSBmcm9tICcuLi8uLi8uLi9zZXJ2ZXIvYXBpL2Jsb2NrY2hhaW5fam9icy5qcyc7XG5pbXBvcnQgeyBEQXBwSm9icyB9IGZyb20gJy4uLy4uLy4uL3NlcnZlci9hcGkvZGFwcF9qb2JzLmpzJztcbmltcG9ydCB7IENPTkZJUk1fQVBQLCBpc0FwcFR5cGUgfSBmcm9tICcuL3R5cGUtY29uZmlndXJhdGlvbi5qcyc7XG5pbXBvcnQgYWRkQ2hlY2tOZXdUcmFuc2FjdGlvbnNCbG9ja2NoYWluSm9iIGZyb20gJy4uLy4uL21vZHVsZXMvc2VydmVyL2pvYnMvYWRkX2NoZWNrX25ld190cmFuc2FjdGlvbnMuanMnO1xuXG5NZXRlb3Iuc3RhcnR1cCgoKSA9PiB7XG4gIE1haWxKb2JzLnN0YXJ0Sm9iU2VydmVyKCk7XG4gIEJsb2NrY2hhaW5Kb2JzLnN0YXJ0Sm9iU2VydmVyKCk7XG4gIERBcHBKb2JzLnN0YXJ0Sm9iU2VydmVyKCk7XG4gIGlmKGlzQXBwVHlwZShDT05GSVJNX0FQUCkpIGFkZENoZWNrTmV3VHJhbnNhY3Rpb25zQmxvY2tjaGFpbkpvYigpO1xufSk7XG4iLCJpbXBvcnQge2lzRGVidWd9IGZyb20gXCIuL2RhcHAtY29uZmlndXJhdGlvblwiO1xuXG5yZXF1aXJlKCdzY3JpYmUtanMnKSgpO1xuXG5leHBvcnQgY29uc3QgY29uc29sZSA9IHByb2Nlc3MuY29uc29sZTtcbmV4cG9ydCBjb25zdCBzZW5kTW9kZVRhZ0NvbG9yID0ge21zZyA6ICdzZW5kLW1vZGUnLCBjb2xvcnMgOiBbJ3llbGxvdycsICdpbnZlcnNlJ119O1xuZXhwb3J0IGNvbnN0IGNvbmZpcm1Nb2RlVGFnQ29sb3IgPSB7bXNnIDogJ2NvbmZpcm0tbW9kZScsIGNvbG9ycyA6IFsnYmx1ZScsICdpbnZlcnNlJ119O1xuZXhwb3J0IGNvbnN0IHZlcmlmeU1vZGVUYWdDb2xvciA9IHttc2cgOiAndmVyaWZ5LW1vZGUnLCBjb2xvcnMgOiBbJ2dyZWVuJywgJ2ludmVyc2UnXX07XG5leHBvcnQgY29uc3QgYmxvY2tjaGFpbk1vZGVUYWdDb2xvciA9IHttc2cgOiAnYmxvY2tjaGFpbi1tb2RlJywgY29sb3JzIDogWyd3aGl0ZScsICdpbnZlcnNlJ119O1xuZXhwb3J0IGNvbnN0IHRlc3RpbmdNb2RlVGFnQ29sb3IgPSB7bXNnIDogJ3Rlc3RpbmctbW9kZScsIGNvbG9ycyA6IFsnb3JhbmdlJywgJ2ludmVyc2UnXX07XG5cbmV4cG9ydCBmdW5jdGlvbiBsb2dTZW5kKG1lc3NhZ2UscGFyYW0pIHtcbiAgICBpZihpc0RlYnVnKCkpIHtjb25zb2xlLnRpbWUoKS50YWcoc2VuZE1vZGVUYWdDb2xvcikubG9nKG1lc3NhZ2UscGFyYW0/cGFyYW06JycpO31cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxvZ0NvbmZpcm0obWVzc2FnZSxwYXJhbSkge1xuICAgIGlmKGlzRGVidWcoKSkge2NvbnNvbGUudGltZSgpLnRhZyhjb25maXJtTW9kZVRhZ0NvbG9yKS5sb2cobWVzc2FnZSwgcGFyYW0/cGFyYW06JycpO31cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxvZ1ZlcmlmeShtZXNzYWdlLCBwYXJhbSkge1xuICAgIGlmKGlzRGVidWcoKSkge2NvbnNvbGUudGltZSgpLnRhZyh2ZXJpZnlNb2RlVGFnQ29sb3IpLmxvZyhtZXNzYWdlLCBwYXJhbT9wYXJhbTonJyk7fVxufVxuXG5leHBvcnQgZnVuY3Rpb24gbG9nQmxvY2tjaGFpbihtZXNzYWdlLCBwYXJhbSkge1xuICAgIGlmKGlzRGVidWcoKSl7Y29uc29sZS50aW1lKCkudGFnKGJsb2NrY2hhaW5Nb2RlVGFnQ29sb3IpLmxvZyhtZXNzYWdlLCBwYXJhbT9wYXJhbTonJyk7fVxufVxuXG5leHBvcnQgZnVuY3Rpb24gbG9nTWFpbihtZXNzYWdlLCBwYXJhbSkge1xuICAgIGlmKGlzRGVidWcoKSl7Y29uc29sZS50aW1lKCkudGFnKGJsb2NrY2hhaW5Nb2RlVGFnQ29sb3IpLmxvZyhtZXNzYWdlLCBwYXJhbT9wYXJhbTonJyk7fVxufVxuXG5leHBvcnQgZnVuY3Rpb24gbG9nRXJyb3IobWVzc2FnZSwgcGFyYW0pIHtcbiAgICBpZihpc0RlYnVnKCkpe2NvbnNvbGUudGltZSgpLnRhZyhibG9ja2NoYWluTW9kZVRhZ0NvbG9yKS5lcnJvcihtZXNzYWdlLCBwYXJhbT9wYXJhbTonJyk7fVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdGVzdExvZ2dpbmcobWVzc2FnZSwgcGFyYW0pIHtcbiAgICBpZihpc0RlYnVnKCkpe2NvbnNvbGUudGltZSgpLnRhZyh0ZXN0aW5nTW9kZVRhZ0NvbG9yKS5sb2cobWVzc2FnZSwgcGFyYW0/cGFyYW06JycpO31cbn0iLCJpbXBvcnQgJy4uLy4uL2FwaS9sYW5ndWFnZXMvbWV0aG9kcy5qcyc7XG5pbXBvcnQgJy4uLy4uL2FwaS9kb2ljaGFpbi9tZXRob2RzLmpzJztcbmltcG9ydCAnLi4vLi4vYXBpL3JlY2lwaWVudHMvc2VydmVyL3B1YmxpY2F0aW9ucy5qcyc7XG5pbXBvcnQgJy4uLy4uL2FwaS9vcHQtaW5zL21ldGhvZHMuanMnO1xuaW1wb3J0ICcuLi8uLi9hcGkvdmVyc2lvbi9wdWJsaWNhdGlvbnMuanMnO1xuaW1wb3J0ICcuLi8uLi9hcGkvb3B0LWlucy9zZXJ2ZXIvcHVibGljYXRpb25zLmpzJztcblxuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgeyBERFBSYXRlTGltaXRlciB9IGZyb20gJ21ldGVvci9kZHAtcmF0ZS1saW1pdGVyJztcbmltcG9ydCB7IF8gfSBmcm9tICdtZXRlb3IvdW5kZXJzY29yZSc7XG5cbi8vIERvbid0IGxldCBwZW9wbGUgd3JpdGUgYXJiaXRyYXJ5IGRhdGEgdG8gdGhlaXIgJ3Byb2ZpbGUnIGZpZWxkIGZyb20gdGhlIGNsaWVudFxuTWV0ZW9yLnVzZXJzLmRlbnkoe1xuICB1cGRhdGUoKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0sXG59KTtcblxuLy8gR2V0IGEgbGlzdCBvZiBhbGwgYWNjb3VudHMgbWV0aG9kcyBieSBydW5uaW5nIGBNZXRlb3Iuc2VydmVyLm1ldGhvZF9oYW5kbGVyc2AgaW4gbWV0ZW9yIHNoZWxsXG5jb25zdCBBVVRIX01FVEhPRFMgPSBbXG4gICdsb2dpbicsXG4gICdsb2dvdXQnLFxuICAnbG9nb3V0T3RoZXJDbGllbnRzJyxcbiAgJ2dldE5ld1Rva2VuJyxcbiAgJ3JlbW92ZU90aGVyVG9rZW5zJyxcbiAgJ2NvbmZpZ3VyZUxvZ2luU2VydmljZScsXG4gICdjaGFuZ2VQYXNzd29yZCcsXG4gICdmb3Jnb3RQYXNzd29yZCcsXG4gICdyZXNldFBhc3N3b3JkJyxcbiAgJ3ZlcmlmeUVtYWlsJyxcbiAgJ2NyZWF0ZVVzZXInLFxuICAnQVRSZW1vdmVTZXJ2aWNlJyxcbiAgJ0FUQ3JlYXRlVXNlclNlcnZlcicsXG4gICdBVFJlc2VuZFZlcmlmaWNhdGlvbkVtYWlsJyxcbl07XG5cbmlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgLy8gT25seSBhbGxvdyAyIGxvZ2luIGF0dGVtcHRzIHBlciBjb25uZWN0aW9uIHBlciA1IHNlY29uZHNcbiAgRERQUmF0ZUxpbWl0ZXIuYWRkUnVsZSh7XG4gICAgbmFtZShuYW1lKSB7XG4gICAgICByZXR1cm4gXy5jb250YWlucyhBVVRIX01FVEhPRFMsIG5hbWUpO1xuICAgIH0sXG5cbiAgICAvLyBSYXRlIGxpbWl0IHBlciBjb25uZWN0aW9uIElEXG4gICAgY29ubmVjdGlvbklkKCkgeyByZXR1cm4gdHJ1ZTsgfSxcbiAgfSwgMiwgNTAwMCk7XG59XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmV4cG9ydCBjb25zdCBTRU5EX0FQUCA9IFwic2VuZFwiO1xuZXhwb3J0IGNvbnN0IENPTkZJUk1fQVBQID0gXCJjb25maXJtXCI7XG5leHBvcnQgY29uc3QgVkVSSUZZX0FQUCA9IFwidmVyaWZ5XCI7XG5leHBvcnQgZnVuY3Rpb24gaXNBcHBUeXBlKHR5cGUpIHtcbiAgaWYoTWV0ZW9yLnNldHRpbmdzID09PSB1bmRlZmluZWQgfHwgTWV0ZW9yLnNldHRpbmdzLmFwcCA9PT0gdW5kZWZpbmVkKSB0aHJvdyBcIk5vIHNldHRpbmdzIGZvdW5kIVwiXG4gIGNvbnN0IHR5cGVzID0gTWV0ZW9yLnNldHRpbmdzLmFwcC50eXBlcztcbiAgaWYodHlwZXMgIT09IHVuZGVmaW5lZCkgcmV0dXJuIHR5cGVzLmluY2x1ZGVzKHR5cGUpO1xuICByZXR1cm4gZmFsc2U7XG59XG4iLCJpbXBvcnQgeyBBY2NvdW50cyB9IGZyb20gJ21ldGVvci9hY2NvdW50cy1iYXNlJztcbkFjY291bnRzLmNvbmZpZyh7XG4gICAgc2VuZFZlcmlmaWNhdGlvbkVtYWlsOiB0cnVlLFxuICAgIGZvcmJpZENsaWVudEFjY291bnRDcmVhdGlvbjogdHJ1ZVxufSk7XG5cblxuXG5BY2NvdW50cy5lbWFpbFRlbXBsYXRlcy5mcm9tPSdkb2ljaGFpbkBsZS1zcGFjZS5kZSc7IiwiaW1wb3J0IHsgQXBpLCBET0lfV0FMTEVUTk9USUZZX1JPVVRFLCBET0lfQ09ORklSTUFUSU9OX1JPVVRFIH0gZnJvbSAnLi4vcmVzdC5qcyc7XG5pbXBvcnQgY29uZmlybU9wdEluIGZyb20gJy4uLy4uLy4uLy4uL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvb3B0LWlucy9jb25maXJtLmpzJ1xuaW1wb3J0IGNoZWNrTmV3VHJhbnNhY3Rpb24gZnJvbSBcIi4uLy4uLy4uLy4uL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvZG9pY2hhaW4vY2hlY2tfbmV3X3RyYW5zYWN0aW9uc1wiO1xuaW1wb3J0IHtsb2dDb25maXJtfSBmcm9tIFwiLi4vLi4vLi4vLi4vaW1wb3J0cy9zdGFydHVwL3NlcnZlci9sb2ctY29uZmlndXJhdGlvblwiO1xuLy9kb2t1IG9mIG1ldGVvci1yZXN0aXZ1cyBodHRwczovL2dpdGh1Yi5jb20va2FobWFsaS9tZXRlb3ItcmVzdGl2dXNcbkFwaS5hZGRSb3V0ZShET0lfQ09ORklSTUFUSU9OX1JPVVRFKycvOmhhc2gnLCB7YXV0aFJlcXVpcmVkOiBmYWxzZX0sIHtcbiAgZ2V0OiB7XG4gICAgYWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IGhhc2ggPSB0aGlzLnVybFBhcmFtcy5oYXNoO1xuICAgICAgdHJ5IHtcbiAgICAgICAgbGV0IGlwID0gdGhpcy5yZXF1ZXN0LmhlYWRlcnNbJ3gtZm9yd2FyZGVkLWZvciddIHx8XG4gICAgICAgICAgdGhpcy5yZXF1ZXN0LmNvbm5lY3Rpb24ucmVtb3RlQWRkcmVzcyB8fFxuICAgICAgICAgIHRoaXMucmVxdWVzdC5zb2NrZXQucmVtb3RlQWRkcmVzcyB8fFxuICAgICAgICAgICh0aGlzLnJlcXVlc3QuY29ubmVjdGlvbi5zb2NrZXQgPyB0aGlzLnJlcXVlc3QuY29ubmVjdGlvbi5zb2NrZXQucmVtb3RlQWRkcmVzczogbnVsbCk7XG5cbiAgICAgICAgICBpZihpcC5pbmRleE9mKCcsJykhPS0xKWlwPWlwLnN1YnN0cmluZygwLGlwLmluZGV4T2YoJywnKSk7XG5cbiAgICAgICAgICBsb2dDb25maXJtKCdSRVNUIG9wdC1pbi9jb25maXJtIDonLHtoYXNoOmhhc2gsIGhvc3Q6aXB9KTtcbiAgICAgICAgICBjb25zdCByZWRpcmVjdCA9IGNvbmZpcm1PcHRJbih7aG9zdDogaXAsIGhhc2g6IGhhc2h9KTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHN0YXR1c0NvZGU6IDMwMyxcbiAgICAgICAgICBoZWFkZXJzOiB7J0NvbnRlbnQtVHlwZSc6ICd0ZXh0L3BsYWluJywgJ0xvY2F0aW9uJzogcmVkaXJlY3R9LFxuICAgICAgICAgIGJvZHk6ICdMb2NhdGlvbjogJytyZWRpcmVjdFxuICAgICAgICB9O1xuICAgICAgfSBjYXRjaChlcnJvcikge1xuICAgICAgICByZXR1cm4ge3N0YXR1c0NvZGU6IDUwMCwgYm9keToge3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiBlcnJvci5tZXNzYWdlfX07XG4gICAgICB9XG4gICAgfVxuICB9XG59KTtcblxuQXBpLmFkZFJvdXRlKERPSV9XQUxMRVROT1RJRllfUk9VVEUsIHtcbiAgICBnZXQ6IHtcbiAgICAgICAgYXV0aFJlcXVpcmVkOiBmYWxzZSxcbiAgICAgICAgYWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNvbnN0IHBhcmFtcyA9IHRoaXMucXVlcnlQYXJhbXM7XG4gICAgICAgICAgICBjb25zdCB0eGlkID0gcGFyYW1zLnR4O1xuXG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGNoZWNrTmV3VHJhbnNhY3Rpb24odHhpZCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtzdGF0dXM6ICdzdWNjZXNzJywgIGRhdGE6J3R4aWQ6Jyt0eGlkKycgd2FzIHJlYWQgZnJvbSBibG9ja2NoYWluJ307XG4gICAgICAgICAgICB9IGNhdGNoKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtzdGF0dXM6ICdmYWlsJywgZXJyb3I6IGVycm9yLm1lc3NhZ2V9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufSk7XG4iLCJpbXBvcnQgeyBBcGkgfSBmcm9tICcuLi9yZXN0LmpzJztcbkFwaS5hZGRSb3V0ZSgnZGVidWcvbWFpbCcsIHthdXRoUmVxdWlyZWQ6IGZhbHNlfSwge1xuICBnZXQ6IHtcbiAgICBhY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgZGF0YSA9IHtcbiAgICAgICAgXCJmcm9tXCI6IFwibm9yZXBseUBkb2ljaGFpbi5vcmdcIixcbiAgICAgICAgXCJzdWJqZWN0XCI6IFwiRG9pY2hhaW4ub3JnIE5ld3NsZXR0ZXIgQmVzdMOkdGlndW5nXCIsXG4gICAgICAgIFwicmVkaXJlY3RcIjogXCJodHRwczovL3d3dy5kb2ljaGFpbi5vcmcvdmllbGVuLWRhbmsvXCIsXG4gICAgICAgIFwicmV0dXJuUGF0aFwiOiBcIm5vcmVwbHlAZG9pY2hhaW4ub3JnXCIsXG4gICAgICAgIFwiY29udGVudFwiOlwiPHN0eWxlIHR5cGU9J3RleHQvY3NzJyBtZWRpYT0nc2NyZWVuJz5cXG5cIiArXG4gICAgICAgICAgICBcIioge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0bGluZS1oZWlnaHQ6IGluaGVyaXQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCIuRXh0ZXJuYWxDbGFzcyAqIHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGxpbmUtaGVpZ2h0OiAxMDAlO1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwiYm9keSwgcCB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRtYXJnaW46IDA7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRwYWRkaW5nOiAwO1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0bWFyZ2luLWJvdHRvbTogMDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdC13ZWJraXQtdGV4dC1zaXplLWFkanVzdDogbm9uZTtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdC1tcy10ZXh0LXNpemUtYWRqdXN0OiBub25lO1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwiaW1nIHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGxpbmUtaGVpZ2h0OiAxMDAlO1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0b3V0bGluZTogbm9uZTtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdHRleHQtZGVjb3JhdGlvbjogbm9uZTtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdC1tcy1pbnRlcnBvbGF0aW9uLW1vZGU6IGJpY3ViaWM7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCJhIGltZyB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRib3JkZXI6IG5vbmU7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCIjYmFja2dyb3VuZFRhYmxlIHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdG1hcmdpbjogMDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdHBhZGRpbmc6IDA7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHR3aWR0aDogMTAwJSAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwiYSwgYTpsaW5rLCAubm8tZGV0ZWN0LWxvY2FsIGEsIC5hcHBsZUxpbmtzIGEge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0Y29sb3I6ICM1NTU1ZmYgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdHRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lO1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwiLkV4dGVybmFsQ2xhc3Mge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0ZGlzcGxheTogYmxvY2sgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdHdpZHRoOiAxMDAlO1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwiLkV4dGVybmFsQ2xhc3MsIC5FeHRlcm5hbENsYXNzIHAsIC5FeHRlcm5hbENsYXNzIHNwYW4sIC5FeHRlcm5hbENsYXNzIGZvbnQsIC5FeHRlcm5hbENsYXNzIHRkLCAuRXh0ZXJuYWxDbGFzcyBkaXYge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0bGluZS1oZWlnaHQ6IGluaGVyaXQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCJ0YWJsZSB0ZCB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRib3JkZXItY29sbGFwc2U6IGNvbGxhcHNlO1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0bXNvLXRhYmxlLWxzcGFjZTogMHB0O1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0bXNvLXRhYmxlLXJzcGFjZTogMHB0O1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwic3VwIHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdHBvc2l0aW9uOiByZWxhdGl2ZTtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdHRvcDogNHB4O1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0bGluZS1oZWlnaHQ6IDdweCAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0Zm9udC1zaXplOiAxMXB4ICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCIubW9iaWxlX2xpbmsgYVtocmVmXj0ndGVsJ10sIC5tb2JpbGVfbGluayBhW2hyZWZePSdzbXMnXSB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHR0ZXh0LWRlY29yYXRpb246IGRlZmF1bHQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRjb2xvcjogIzU1NTVmZiAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0cG9pbnRlci1ldmVudHM6IGF1dG87XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRjdXJzb3I6IGRlZmF1bHQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCIubm8tZGV0ZWN0IGEge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0dGV4dC1kZWNvcmF0aW9uOiBub25lO1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0Y29sb3I6ICM1NTU1ZmY7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRwb2ludGVyLWV2ZW50czogYXV0bztcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGN1cnNvcjogZGVmYXVsdDtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcIntcXG5cIiArXG4gICAgICAgICAgICBcImNvbG9yOiAjNTU1NWZmO1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwic3BhbiB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRjb2xvcjogaW5oZXJpdDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGJvcmRlci1ib3R0b206IG5vbmU7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCJzcGFuOmhvdmVyIHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwiLm5vdW5kZXJsaW5lIHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdHRleHQtZGVjb3JhdGlvbjogbm9uZSAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwiaDEsIGgyLCBoMyB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRtYXJnaW46IDA7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRwYWRkaW5nOiAwO1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwicCB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRNYXJnaW46IDBweCAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwidGFibGVbY2xhc3M9J2VtYWlsLXJvb3Qtd3JhcHBlciddIHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdHdpZHRoOiA2MDBweCAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwiYm9keSB7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCJib2R5IHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdG1pbi13aWR0aDogMjgwcHg7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHR3aWR0aDogMTAwJTtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcInRkW2NsYXNzPSdwYXR0ZXJuJ10gLmMxMTJwMjByIHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdHdpZHRoOiAyMCU7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCJ0ZFtjbGFzcz0ncGF0dGVybiddIC5jMzM2cDYwciB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHR3aWR0aDogNjAuMDAwMDAwMDAwMDAwMjU2JTtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcIjwvc3R5bGU+XFxuXCIgK1xuICAgICAgICAgICAgXCI8c3R5bGU+XFxuXCIgK1xuICAgICAgICAgICAgXCJAbWVkaWEgb25seSBzY3JlZW4gYW5kIChtYXgtd2lkdGg6IDU5OXB4KSwgb25seSBzY3JlZW4gYW5kIChtYXgtZGV2aWNlLXdpZHRoOiA1OTlweCksIG9ubHkgc2NyZWVuIGFuZCAobWF4LXdpZHRoOiA0MDBweCksIG9ubHkgc2NyZWVuIGFuZCAobWF4LWRldmljZS13aWR0aDogNDAwcHgpIHtcXG5cIiArXG4gICAgICAgICAgICBcIi5lbWFpbC1yb290LXdyYXBwZXIge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0d2lkdGg6IDEwMCUgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcIi5mdWxsLXdpZHRoIHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdHdpZHRoOiAxMDAlICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRoZWlnaHQ6IGF1dG8gIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdHRleHQtYWxpZ246IGNlbnRlcjtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcIi5mdWxsd2lkdGhoYWxmbGVmdCB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHR3aWR0aDogMTAwJSAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwiLmZ1bGx3aWR0aGhhbGZyaWdodCB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHR3aWR0aDogMTAwJSAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwiLmZ1bGx3aWR0aGhhbGZpbm5lciB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHR3aWR0aDogMTAwJSAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0bWFyZ2luOiAwIGF1dG8gIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGZsb2F0OiBub25lICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRtYXJnaW4tbGVmdDogYXV0byAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0bWFyZ2luLXJpZ2h0OiBhdXRvICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRjbGVhcjogYm90aCAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwiLmhpZGUge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0ZGlzcGxheTogbm9uZSAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0d2lkdGg6IDBweCAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0aGVpZ2h0OiAwcHggIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdG92ZXJmbG93OiBoaWRkZW47XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCIuZGVza3RvcC1oaWRlIHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGRpc3BsYXk6IGJsb2NrICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHR3aWR0aDogMTAwJSAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0aGVpZ2h0OiBhdXRvICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRvdmVyZmxvdzogaGlkZGVuO1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0bWF4LWhlaWdodDogaW5oZXJpdCAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwiLmMxMTJwMjByIHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdHdpZHRoOiAxMDAlICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRmbG9hdDogbm9uZTtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcIi5jMzM2cDYwciB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHR3aWR0aDogMTAwJSAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0ZmxvYXQ6IG5vbmU7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCI8L3N0eWxlPlxcblwiICtcbiAgICAgICAgICAgIFwiPHN0eWxlPlxcblwiICtcbiAgICAgICAgICAgIFwiQG1lZGlhIG9ubHkgc2NyZWVuIGFuZCAobWluLXdpZHRoOiA2MDBweCkge1xcblwiICtcbiAgICAgICAgICAgIFwidGRbY2xhc3M9J3BhdHRlcm4nXSAuYzExMnAyMHIge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0d2lkdGg6IDExMnB4ICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCJ0ZFtjbGFzcz0ncGF0dGVybiddIC5jMzM2cDYwciB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHR3aWR0aDogMzM2cHggIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcIlxcblwiICtcbiAgICAgICAgICAgIFwiQG1lZGlhIG9ubHkgc2NyZWVuIGFuZCAobWF4LXdpZHRoOiA1OTlweCksIG9ubHkgc2NyZWVuIGFuZCAobWF4LWRldmljZS13aWR0aDogNTk5cHgpLCBvbmx5IHNjcmVlbiBhbmQgKG1heC13aWR0aDogNDAwcHgpLCBvbmx5IHNjcmVlbiBhbmQgKG1heC1kZXZpY2Utd2lkdGg6IDQwMHB4KSB7XFxuXCIgK1xuICAgICAgICAgICAgXCJ0YWJsZVtjbGFzcz0nZW1haWwtcm9vdC13cmFwcGVyJ10ge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0d2lkdGg6IDEwMCUgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcInRkW2NsYXNzPSd3cmFwJ10gLmZ1bGwtd2lkdGgge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0d2lkdGg6IDEwMCUgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGhlaWdodDogYXV0byAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwidGRbY2xhc3M9J3dyYXAnXSAuZnVsbHdpZHRoaGFsZmxlZnQge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0d2lkdGg6IDEwMCUgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcInRkW2NsYXNzPSd3cmFwJ10gLmZ1bGx3aWR0aGhhbGZyaWdodCB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHR3aWR0aDogMTAwJSAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwidGRbY2xhc3M9J3dyYXAnXSAuZnVsbHdpZHRoaGFsZmlubmVyIHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdHdpZHRoOiAxMDAlICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRtYXJnaW46IDAgYXV0byAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0ZmxvYXQ6IG5vbmUgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdG1hcmdpbi1sZWZ0OiBhdXRvICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRtYXJnaW4tcmlnaHQ6IGF1dG8gIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGNsZWFyOiBib3RoICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCJ0ZFtjbGFzcz0nd3JhcCddIC5oaWRlIHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGRpc3BsYXk6IG5vbmUgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdHdpZHRoOiAwcHg7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRoZWlnaHQ6IDBweDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdG92ZXJmbG93OiBoaWRkZW47XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCJ0ZFtjbGFzcz0ncGF0dGVybiddIC5jMTEycDIwciB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHR3aWR0aDogMTAwJSAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwidGRbY2xhc3M9J3BhdHRlcm4nXSAuYzMzNnA2MHIge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0d2lkdGg6IDEwMCUgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcIlxcblwiICtcbiAgICAgICAgICAgIFwiQG1lZGlhIHlhaG9vIHtcXG5cIiArXG4gICAgICAgICAgICBcInRhYmxlIHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGZsb2F0OiBub25lICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRoZWlnaHQ6IGF1dG87XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCJ0YWJsZVthbGlnbj0nbGVmdCddIHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGZsb2F0OiBsZWZ0ICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCJ0ZFthbGlnbj0nbGVmdCddIHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGZsb2F0OiBsZWZ0ICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRoZWlnaHQ6IGF1dG87XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCJ0YWJsZVthbGlnbj0nY2VudGVyJ10ge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0bWFyZ2luOiAwIGF1dG87XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCJ0ZFthbGlnbj0nY2VudGVyJ10ge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0bWFyZ2luOiAwIGF1dG87XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRoZWlnaHQ6IGF1dG87XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCJ0YWJsZVthbGlnbj0ncmlnaHQnXSB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRmbG9hdDogcmlnaHQgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcInRkW2FsaWduPSdyaWdodCddIHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGZsb2F0OiByaWdodCAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0aGVpZ2h0OiBhdXRvO1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwiPC9zdHlsZT5cXG5cIiArXG4gICAgICAgICAgICBcIlxcblwiICtcbiAgICAgICAgICAgIFwiPCEtLVtpZiAoZ3RlIElFIDcpICYgKHZtbCldPlxcblwiICtcbiAgICAgICAgICAgIFwiPHN0eWxlIHR5cGU9J3RleHQvY3NzJz5cXG5cIiArXG4gICAgICAgICAgICBcImh0bWwsIGJvZHkge21hcmdpbjowICFpbXBvcnRhbnQ7IHBhZGRpbmc6MHB4ICFpbXBvcnRhbnQ7fVxcblwiICtcbiAgICAgICAgICAgIFwiaW1nLmZ1bGwtd2lkdGggeyBwb3NpdGlvbjogcmVsYXRpdmUgIWltcG9ydGFudDsgfVxcblwiICtcbiAgICAgICAgICAgIFwiXFxuXCIgK1xuICAgICAgICAgICAgXCIuaW1nMjQweDMwIHsgd2lkdGg6IDI0MHB4ICFpbXBvcnRhbnQ7IGhlaWdodDogMzBweCAhaW1wb3J0YW50O31cXG5cIiArXG4gICAgICAgICAgICBcIi5pbWcyMHgyMCB7IHdpZHRoOiAyMHB4ICFpbXBvcnRhbnQ7IGhlaWdodDogMjBweCAhaW1wb3J0YW50O31cXG5cIiArXG4gICAgICAgICAgICBcIlxcblwiICtcbiAgICAgICAgICAgIFwiPC9zdHlsZT5cXG5cIiArXG4gICAgICAgICAgICBcIjwhW2VuZGlmXS0tPlxcblwiICtcbiAgICAgICAgICAgIFwiXFxuXCIgK1xuICAgICAgICAgICAgXCI8IS0tW2lmIGd0ZSBtc28gOV0+XFxuXCIgK1xuICAgICAgICAgICAgXCI8c3R5bGUgdHlwZT0ndGV4dC9jc3MnPlxcblwiICtcbiAgICAgICAgICAgIFwiLm1zby1mb250LWZpeC1hcmlhbCB7IGZvbnQtZmFtaWx5OiBBcmlhbCwgc2Fucy1zZXJpZjt9XFxuXCIgK1xuICAgICAgICAgICAgXCIubXNvLWZvbnQtZml4LWdlb3JnaWEgeyBmb250LWZhbWlseTogR2VvcmdpYSwgc2Fucy1zZXJpZjt9XFxuXCIgK1xuICAgICAgICAgICAgXCIubXNvLWZvbnQtZml4LXRhaG9tYSB7IGZvbnQtZmFtaWx5OiBUYWhvbWEsIHNhbnMtc2VyaWY7fVxcblwiICtcbiAgICAgICAgICAgIFwiLm1zby1mb250LWZpeC10aW1lc19uZXdfcm9tYW4geyBmb250LWZhbWlseTogJ1RpbWVzIE5ldyBSb21hbicsIHNhbnMtc2VyaWY7fVxcblwiICtcbiAgICAgICAgICAgIFwiLm1zby1mb250LWZpeC10cmVidWNoZXRfbXMgeyBmb250LWZhbWlseTogJ1RyZWJ1Y2hldCBNUycsIHNhbnMtc2VyaWY7fVxcblwiICtcbiAgICAgICAgICAgIFwiLm1zby1mb250LWZpeC12ZXJkYW5hIHsgZm9udC1mYW1pbHk6IFZlcmRhbmEsIHNhbnMtc2VyaWY7fVxcblwiICtcbiAgICAgICAgICAgIFwiPC9zdHlsZT5cXG5cIiArXG4gICAgICAgICAgICBcIjwhW2VuZGlmXS0tPlxcblwiICtcbiAgICAgICAgICAgIFwiXFxuXCIgK1xuICAgICAgICAgICAgXCI8IS0tW2lmIGd0ZSBtc28gOV0+XFxuXCIgK1xuICAgICAgICAgICAgXCI8c3R5bGUgdHlwZT0ndGV4dC9jc3MnPlxcblwiICtcbiAgICAgICAgICAgIFwidGFibGUsIHRkIHtcXG5cIiArXG4gICAgICAgICAgICBcImJvcmRlci1jb2xsYXBzZTogY29sbGFwc2UgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIm1zby10YWJsZS1sc3BhY2U6IDBweCAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwibXNvLXRhYmxlLXJzcGFjZTogMHB4ICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCJcXG5cIiArXG4gICAgICAgICAgICBcIi5lbWFpbC1yb290LXdyYXBwZXIgeyB3aWR0aCA2MDBweCAhaW1wb3J0YW50O31cXG5cIiArXG4gICAgICAgICAgICBcIi5pbWdsaW5rIHsgZm9udC1zaXplOiAwcHg7IH1cXG5cIiArXG4gICAgICAgICAgICBcIi5lZG1fYnV0dG9uIHsgZm9udC1zaXplOiAwcHg7IH1cXG5cIiArXG4gICAgICAgICAgICBcIjwvc3R5bGU+XFxuXCIgK1xuICAgICAgICAgICAgXCI8IVtlbmRpZl0tLT5cXG5cIiArXG4gICAgICAgICAgICBcIlxcblwiICtcbiAgICAgICAgICAgIFwiPCEtLVtpZiBndGUgbXNvIDE1XT5cXG5cIiArXG4gICAgICAgICAgICBcIjxzdHlsZSB0eXBlPSd0ZXh0L2Nzcyc+XFxuXCIgK1xuICAgICAgICAgICAgXCJ0YWJsZSB7XFxuXCIgK1xuICAgICAgICAgICAgXCJmb250LXNpemU6MHB4O1xcblwiICtcbiAgICAgICAgICAgIFwibXNvLW1hcmdpbi10b3AtYWx0OjBweDtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcIlxcblwiICtcbiAgICAgICAgICAgIFwiLmZ1bGx3aWR0aGhhbGZsZWZ0IHtcXG5cIiArXG4gICAgICAgICAgICBcIndpZHRoOiA0OSUgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcImZsb2F0OmxlZnQgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcIlxcblwiICtcbiAgICAgICAgICAgIFwiLmZ1bGx3aWR0aGhhbGZyaWdodCB7XFxuXCIgK1xuICAgICAgICAgICAgXCJ3aWR0aDogNTAlICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJmbG9hdDpyaWdodCAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwiPC9zdHlsZT5cXG5cIiArXG4gICAgICAgICAgICBcIjwhW2VuZGlmXS0tPlxcblwiICtcbiAgICAgICAgICAgIFwiPHN0eWxlIHR5cGU9J3RleHQvY3NzJyBtZWRpYT0nKHBvaW50ZXIpIGFuZCAobWluLWNvbG9yLWluZGV4OjApJz5cXG5cIiArXG4gICAgICAgICAgICBcImh0bWwsIGJvZHkge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0YmFja2dyb3VuZC1pbWFnZTogbm9uZSAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0YmFja2dyb3VuZC1jb2xvcjogI2ViZWJlYiAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0bWFyZ2luOiAwICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRwYWRkaW5nOiAwICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCI8L3N0eWxlPlxcblwiICtcbiAgICAgICAgICAgIFwiPC9oZWFkPlxcblwiICtcbiAgICAgICAgICAgIFwiPGJvZHkgbGVmdG1hcmdpbj0nMCcgbWFyZ2lud2lkdGg9JzAnIHRvcG1hcmdpbj0nMCcgbWFyZ2luaGVpZ2h0PScwJyBvZmZzZXQ9JzAnIGJhY2tncm91bmQ9XFxcIlxcXCIgYmdjb2xvcj0nI2ViZWJlYicgc3R5bGU9J2ZvbnQtZmFtaWx5OkFyaWFsLCBzYW5zLXNlcmlmOyBmb250LXNpemU6MHB4O21hcmdpbjowO3BhZGRpbmc6MDsgJz5cXG5cIiArXG4gICAgICAgICAgICBcIjwhLS1baWYgdF0+PCFbZW5kaWZdLS0+PCEtLVtpZiB0XT48IVtlbmRpZl0tLT48IS0tW2lmIHRdPjwhW2VuZGlmXS0tPjwhLS1baWYgdF0+PCFbZW5kaWZdLS0+PCEtLVtpZiB0XT48IVtlbmRpZl0tLT48IS0tW2lmIHRdPjwhW2VuZGlmXS0tPlxcblwiICtcbiAgICAgICAgICAgIFwiPHRhYmxlIGFsaWduPSdjZW50ZXInIGJvcmRlcj0nMCcgY2VsbHBhZGRpbmc9JzAnIGNlbGxzcGFjaW5nPScwJyBiYWNrZ3JvdW5kPVxcXCJcXFwiICBoZWlnaHQ9JzEwMCUnIHdpZHRoPScxMDAlJyBpZD0nYmFja2dyb3VuZFRhYmxlJz5cXG5cIiArXG4gICAgICAgICAgICBcIiAgPHRyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgIDx0ZCBjbGFzcz0nd3JhcCcgYWxpZ249J2NlbnRlcicgdmFsaWduPSd0b3AnIHdpZHRoPScxMDAlJz5cXG5cIiArXG4gICAgICAgICAgICBcIlxcdFxcdDxjZW50ZXI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgIDwhLS0gY29udGVudCAtLT5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgXFx0PGRpdiBzdHlsZT0ncGFkZGluZzogMHB4Oyc+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgIFxcdCAgPHRhYmxlIGNlbGxwYWRkaW5nPScwJyBjZWxsc3BhY2luZz0nMCcgYm9yZGVyPScwJyB3aWR0aD0nMTAwJScgYmdjb2xvcj0nI2ViZWJlYic+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgIFxcdFxcdCA8dHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICBcXHRcXHQgIDx0ZCB2YWxpZ249J3RvcCcgc3R5bGU9J3BhZGRpbmc6IDBweDsnPlxcblwiICtcbiAgICAgICAgICAgIFwiXFx0XFx0XFx0XFx0XFx0XFx0ICA8dGFibGUgY2VsbHBhZGRpbmc9JzAnIGNlbGxzcGFjaW5nPScwJyB3aWR0aD0nNjAwJyBhbGlnbj0nY2VudGVyJyBzdHlsZT0nbWF4LXdpZHRoOiA2MDBweDttaW4td2lkdGg6IDI0MHB4O21hcmdpbjogMCBhdXRvOycgY2xhc3M9J2VtYWlsLXJvb3Qtd3JhcHBlcic+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgIFxcdFxcdCBcXHRcXHQ8dHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgXFx0XFx0XFx0XFx0XFx0IDx0ZCB2YWxpZ249J3RvcCcgc3R5bGU9J3BhZGRpbmc6IDBweDsnPlxcblwiICtcbiAgICAgICAgICAgIFwiXFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0IFxcdFxcdDx0YWJsZSBjZWxscGFkZGluZz0nMCcgY2VsbHNwYWNpbmc9JzAnIGJvcmRlcj0nMCcgd2lkdGg9JzEwMCUnIGJnY29sb3I9JyNGRkZGRkYnIHN0eWxlPSdib3JkZXI6IDBweCBub25lO2JhY2tncm91bmQtY29sb3I6ICNGRkZGRkY7Jz5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgXFx0XFx0XFx0XFx0XFx0XFx0IDx0cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgXFx0XFx0XFx0ICBcXHRcXHRcXHRcXHQgPHRkIHZhbGlnbj0ndG9wJyBzdHlsZT0ncGFkZGluZy10b3A6IDMwcHg7cGFkZGluZy1yaWdodDogMjBweDtwYWRkaW5nLWJvdHRvbTogMzVweDtwYWRkaW5nLWxlZnQ6IDIwcHg7Jz5cXG5cIiArXG4gICAgICAgICAgICBcIlxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdCAgIFxcdFxcdFxcdFxcdFxcblwiICtcbiAgICAgICAgICAgIFwiXFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0PHRhYmxlIGNlbGxwYWRkaW5nPScwJ1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0Y2VsbHNwYWNpbmc9JzAnIGJvcmRlcj0nMCcgYWxpZ249J2NlbnRlcicgd2lkdGg9JzI0MCcgIHN0eWxlPSdib3JkZXI6IDBweCBub25lO2hlaWdodDogYXV0bzsnIGNsYXNzPSdmdWxsLXdpZHRoJz5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXFx0IFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdDx0cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0PHRkIHZhbGlnbj0ndG9wJyBzdHlsZT0ncGFkZGluZzogMHB4Oyc+PGltZyBzcmM9J2h0dHBzOi8vc2YyNi5zZW5kc2Z4LmNvbS9hZG1pbi90ZW1wL3VzZXIvMTcvZG9pY2hhaW5fMTAwaC5wbmcnIHdpZHRoPScyNDAnIGhlaWdodD0nMzAnIGFsdD1cXFwiXFxcIiBib3JkZXI9JzAnIHN0eWxlPSdkaXNwbGF5OiBibG9jazt3aWR0aDogMTAwJTtoZWlnaHQ6IGF1dG87JyBjbGFzcz0nZnVsbC13aWR0aCBpbWcyNDB4MzAnIC8+PC90ZD5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXFx0IFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdDwvdHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0PC90YWJsZT5cXG5cIiArXG4gICAgICAgICAgICBcIlxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcblwiICtcbiAgICAgICAgICAgIFwiXFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0PC90ZD5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICBcXHRcXHQgIFxcdFxcdFxcdFxcdDwvdHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgXFx0XFx0XFx0XFx0XFx0PC90YWJsZT5cXG5cIiArXG4gICAgICAgICAgICBcIlxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdCBcXG5cIiArXG4gICAgICAgICAgICBcIlxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdCBcXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICA8dGFibGUgY2VsbHBhZGRpbmc9JzAnIGNlbGxzcGFjaW5nPScwJyBib3JkZXI9JzAnIHdpZHRoPScxMDAlJyBiZ2NvbG9yPScjMDA3MWFhJyBzdHlsZT0nYm9yZGVyOiAwcHggbm9uZTtiYWNrZ3JvdW5kLWNvbG9yOiAjMDA3MWFhO2JhY2tncm91bmQtaW1hZ2U6IHVybCgnaHR0cHM6Ly9zZjI2LnNlbmRzZnguY29tL2FkbWluL3RlbXAvdXNlci8xNy9ibHVlLWJnLmpwZycpO2JhY2tncm91bmQtcmVwZWF0OiBuby1yZXBlYXQgO2JhY2tncm91bmQtcG9zaXRpb246IGNlbnRlcjsnPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgdmFsaWduPSd0b3AnIHN0eWxlPSdwYWRkaW5nLXRvcDogNDBweDtwYWRkaW5nLXJpZ2h0OiAyMHB4O3BhZGRpbmctYm90dG9tOiA0NXB4O3BhZGRpbmctbGVmdDogMjBweDsnPjx0YWJsZSBjZWxscGFkZGluZz0nMCcgY2VsbHNwYWNpbmc9JzAnIHdpZHRoPScxMDAlJz5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIHN0eWxlPSdwYWRkaW5nOiAwcHg7JyBjbGFzcz0ncGF0dGVybic+PHRhYmxlIGNlbGxwYWRkaW5nPScwJyBjZWxsc3BhY2luZz0nMCcgYm9yZGVyPScwJyB3aWR0aD0nMTAwJSc+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCB2YWxpZ249J3RvcCcgc3R5bGU9J3BhZGRpbmctYm90dG9tOiAxMHB4Oyc+PGRpdiBzdHlsZT0ndGV4dC1hbGlnbjogbGVmdDtmb250LWZhbWlseTogYXJpYWw7Zm9udC1zaXplOiAyMHB4O2NvbG9yOiAjZmZmZmZmO2xpbmUtaGVpZ2h0OiAzMHB4O21zby1saW5lLWhlaWdodDogZXhhY3RseTttc28tdGV4dC1yYWlzZTogNXB4Oyc+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cFxcblwiICtcbiAgICAgICAgICAgIFwic3R5bGU9J3BhZGRpbmc6IDA7IG1hcmdpbjogMDt0ZXh0LWFsaWduOiBjZW50ZXI7Jz5CaXR0ZSBiZXN0w6R0aWdlbiBTaWUgSWhyZSBBbm1lbGR1bmc8L3A+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+PC90ZD5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90YWJsZT5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGFibGUgY2VsbHBhZGRpbmc9JzAnIGNlbGxzcGFjaW5nPScwJyBib3JkZXI9JzAnIHdpZHRoPScxMDAlJz5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIHZhbGlnbj0ndG9wJyBzdHlsZT0ncGFkZGluZzogMDttc28tY2VsbHNwYWNpbmc6IDBpbjsnPjx0YWJsZSBjZWxscGFkZGluZz0nMCcgY2VsbHNwYWNpbmc9JzAnIGJvcmRlcj0nMCcgYWxpZ249J2xlZnQnIHdpZHRoPScxMTInICBzdHlsZT0nZmxvYXQ6IGxlZnQ7JyBjbGFzcz0nYzExMnAyMHInPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgdmFsaWduPSd0b3AnIHN0eWxlPSdwYWRkaW5nOiAwcHg7Jz48dGFibGUgY2VsbHBhZGRpbmc9JzAnIGNlbGxzcGFjaW5nPScwJyBib3JkZXI9JzAnIHdpZHRoPScxMDAlJyBzdHlsZT0nYm9yZGVyOiAwcHggbm9uZTsnIGNsYXNzPSdoaWRlJz5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIHZhbGlnbj0ndG9wJyBzdHlsZT0ncGFkZGluZzogMHB4Oyc+PHRhYmxlIGNlbGxwYWRkaW5nPScwJyBjZWxsc3BhY2luZz0nMCcgd2lkdGg9JzEwMCUnPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgc3R5bGU9J3BhZGRpbmc6IDBweDsnPjx0YWJsZSBjZWxscGFkZGluZz0nMCcgY2VsbHNwYWNpbmc9JzAnIHdpZHRoPScxMDAlJz5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIGFsaWduPSdjZW50ZXInIHN0eWxlPSdwYWRkaW5nOiAwcHg7Jz48dGFibGUgY2VsbHBhZGRpbmc9JzAnIGNlbGxzcGFjaW5nPScwJyBib3JkZXI9JzAnIGFsaWduPSdjZW50ZXInIHdpZHRoPScyMCcgIHN0eWxlPSdib3JkZXI6IDBweCBub25lO2hlaWdodDogYXV0bzsnPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgdmFsaWduPSd0b3AnIHN0eWxlPSdwYWRkaW5nOiAwcHg7Jz48aW1nXFxuXCIgK1xuICAgICAgICAgICAgXCJzcmM9J2h0dHBzOi8vc2YyNi5zZW5kc2Z4LmNvbS9hZG1pbi90ZW1wL3VzZXIvMTcvaW1nXzg5ODM3MzE4LnBuZycgd2lkdGg9JzIwJyBoZWlnaHQ9JzIwJyBhbHQ9XFxcIlxcXCIgYm9yZGVyPScwJyBzdHlsZT0nZGlzcGxheTogYmxvY2s7JyBjbGFzcz0naW1nMjB4MjAnIC8+PC90ZD5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90YWJsZT48L3RkPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RhYmxlPjwvdGQ+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGFibGU+PC90ZD5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90YWJsZT48L3RkPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RhYmxlPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwhLS1baWYgZ3RlIG1zbyA5XT48L3RkPjx0ZCB2YWxpZ249J3RvcCcgc3R5bGU9J3BhZGRpbmc6MDsnPjwhW2VuZGlmXS0tPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0YWJsZSBjZWxscGFkZGluZz0nMCcgY2VsbHNwYWNpbmc9JzAnIGJvcmRlcj0nMCcgYWxpZ249J2xlZnQnIHdpZHRoPSczMzYnICBzdHlsZT0nZmxvYXQ6IGxlZnQ7JyBjbGFzcz0nYzMzNnA2MHInPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgdmFsaWduPSd0b3AnIHN0eWxlPSdwYWRkaW5nOiAwcHg7Jz48dGFibGUgY2VsbHBhZGRpbmc9JzAnIGNlbGxzcGFjaW5nPScwJyBib3JkZXI9JzAnIHdpZHRoPScxMDAlJz5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIHZhbGlnbj0ndG9wJyBzdHlsZT0ncGFkZGluZy1ib3R0b206IDMwcHg7Jz48dGFibGUgY2VsbHBhZGRpbmc9JzAnIGNlbGxzcGFjaW5nPScwJyB3aWR0aD0nMTAwJSc+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBzdHlsZT0ncGFkZGluZzogMHB4Oyc+PHRhYmxlIGNlbGxwYWRkaW5nPScwJyBjZWxsc3BhY2luZz0nMCcgYm9yZGVyPScwJyB3aWR0aD0nMTAwJScgc3R5bGU9J2JvcmRlci10b3A6IDJweCBzb2xpZCAjZmZmZmZmOyc+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCB2YWxpZ249J3RvcCc+PHRhYmxlIGNlbGxwYWRkaW5nPScwJyBjZWxsc3BhY2luZz0nMCcgd2lkdGg9JzEwMCUnPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgc3R5bGU9J3BhZGRpbmc6IDBweDsnPjwvdGQ+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGFibGU+PC90ZD5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90YWJsZT48L3RkPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RhYmxlPjwvdGQ+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGFibGU+PC90ZD5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90YWJsZT5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8IS0tW2lmIGd0ZSBtc28gOV0+PC90ZD48dGQgdmFsaWduPSd0b3AnIHN0eWxlPSdwYWRkaW5nOjA7Jz48IVtlbmRpZl0tLT5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGFibGUgY2VsbHBhZGRpbmc9JzAnIGNlbGxzcGFjaW5nPScwJyBib3JkZXI9JzAnIGFsaWduPSdsZWZ0JyB3aWR0aD0nMTEyJyAgc3R5bGU9J2Zsb2F0OiBsZWZ0OycgY2xhc3M9J2MxMTJwMjByJz5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIHZhbGlnbj0ndG9wJyBzdHlsZT0ncGFkZGluZzogMHB4Oyc+PHRhYmxlIGNlbGxwYWRkaW5nPScwJyBjZWxsc3BhY2luZz0nMCcgYm9yZGVyPScwJyB3aWR0aD0nMTAwJScgc3R5bGU9J2JvcmRlcjogMHB4IG5vbmU7JyBjbGFzcz0naGlkZSc+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCB2YWxpZ249J3RvcCcgc3R5bGU9J3BhZGRpbmc6IDBweDsnPjx0YWJsZSBjZWxscGFkZGluZz0nMCcgY2VsbHNwYWNpbmc9JzAnIHdpZHRoPScxMDAlJz5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIHN0eWxlPSdwYWRkaW5nOiAwcHg7Jz48dGFibGUgY2VsbHBhZGRpbmc9JzAnIGNlbGxzcGFjaW5nPScwJyB3aWR0aD0nMTAwJSc+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBhbGlnbj0nY2VudGVyJyBzdHlsZT0ncGFkZGluZzogMHB4Oyc+PHRhYmxlIGNlbGxwYWRkaW5nPScwJyBjZWxsc3BhY2luZz0nMCcgYm9yZGVyPScwJyBhbGlnbj0nY2VudGVyJyB3aWR0aD0nMjAnICBzdHlsZT0nYm9yZGVyOiAwcHggbm9uZTtoZWlnaHQ6IGF1dG87Jz5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIHZhbGlnbj0ndG9wJyBzdHlsZT0ncGFkZGluZzogMHB4Oyc+PGltZyBzcmM9J2h0dHBzOi8vc2YyNi5zZW5kc2Z4LmNvbS9hZG1pbi90ZW1wL3VzZXIvMTcvaW1nXzg5ODM3MzE4LnBuZycgd2lkdGg9JzIwJyBoZWlnaHQ9JzIwJyBhbHQ9XFxcIlxcXCIgYm9yZGVyPScwJyBzdHlsZT0nZGlzcGxheTogYmxvY2s7JyBjbGFzcz0naW1nMjB4MjAnXFxuXCIgK1xuICAgICAgICAgICAgXCIvPjwvdGQ+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGFibGU+PC90ZD5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90YWJsZT48L3RkPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RhYmxlPjwvdGQ+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGFibGU+PC90ZD5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90YWJsZT48L3RkPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RhYmxlPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0YWJsZSBjZWxscGFkZGluZz0nMCcgY2VsbHNwYWNpbmc9JzAnIGJvcmRlcj0nMCcgd2lkdGg9JzEwMCUnPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgdmFsaWduPSd0b3AnIHN0eWxlPSdwYWRkaW5nLWJvdHRvbTogMjBweDsnPjxkaXYgc3R5bGU9J3RleHQtYWxpZ246IGxlZnQ7Zm9udC1mYW1pbHk6IGFyaWFsO2ZvbnQtc2l6ZTogMTZweDtjb2xvcjogI2ZmZmZmZjtsaW5lLWhlaWdodDogMjZweDttc28tbGluZS1oZWlnaHQ6IGV4YWN0bHk7bXNvLXRleHQtcmFpc2U6IDVweDsnPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHAgc3R5bGU9J3BhZGRpbmc6IDA7IG1hcmdpbjogMDt0ZXh0LWFsaWduOiBjZW50ZXI7Jz5WaWVsZW4gRGFuaywgZGFzcyBTaWUgc2ljaCBmw7xyIHVuc2VyZW4gTmV3c2xldHRlciBhbmdlbWVsZGV0IGhhYmVuLjwvcD5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwIHN0eWxlPSdwYWRkaW5nOiAwOyBtYXJnaW46IDA7dGV4dC1hbGlnbjogY2VudGVyOyc+VW0gZGllc2UgRS1NYWlsLUFkcmVzc2UgdW5kIElocmUga29zdGVubG9zZSBBbm1lbGR1bmcgenUgYmVzdMOkdGlnZW4sIGtsaWNrZW4gU2llIGJpdHRlIGpldHp0IGF1ZiBkZW4gZm9sZ2VuZGVuIEJ1dHRvbjo8L3A+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+PC90ZD5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90YWJsZT5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGFibGUgY2VsbHBhZGRpbmc9JzAnIGNlbGxzcGFjaW5nPScwJyB3aWR0aD0nMTAwJSc+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBhbGlnbj0nY2VudGVyJyBzdHlsZT0ncGFkZGluZzogMHB4Oyc+PHRhYmxlIGNlbGxwYWRkaW5nPScwJyBjZWxsc3BhY2luZz0nMCcgYm9yZGVyPScwJyBhbGlnbj0nY2VudGVyJyBzdHlsZT0ndGV4dC1hbGlnbjogY2VudGVyO2NvbG9yOiAjMDAwOycgY2xhc3M9J2Z1bGwtd2lkdGgnPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgdmFsaWduPSd0b3AnIGFsaWduPSdjZW50ZXInIHN0eWxlPSdwYWRkaW5nLXJpZ2h0OiAxMHB4O3BhZGRpbmctYm90dG9tOiAzMHB4O3BhZGRpbmctbGVmdDogMTBweDsnPjx0YWJsZSBjZWxscGFkZGluZz0nMCcgY2VsbHNwYWNpbmc9JzAnIGJvcmRlcj0nMCcgYmdjb2xvcj0nIzg1YWMxYycgc3R5bGU9J2JvcmRlcjogMHB4IG5vbmU7Ym9yZGVyLXJhZGl1czogNXB4O2JvcmRlci1jb2xsYXBzZTogc2VwYXJhdGUgIWltcG9ydGFudDtiYWNrZ3JvdW5kLWNvbG9yOiAjODVhYzFjOycgY2xhc3M9J2Z1bGwtd2lkdGgnPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgdmFsaWduPSd0b3AnIGFsaWduPSdjZW50ZXInIHN0eWxlPSdwYWRkaW5nOiAxMnB4Oyc+PGEgaHJlZj0nJHtjb25maXJtYXRpb25fdXJsfScgdGFyZ2V0PSdfYmxhbmsnIHN0eWxlPSd0ZXh0LWRlY29yYXRpb246IG5vbmU7JyBjbGFzcz0nZWRtX2J1dHRvbic+PHNwYW4gc3R5bGU9J2ZvbnQtZmFtaWx5OiBhcmlhbDtmb250LXNpemU6IDE4cHg7Y29sb3I6ICNmZmZmZmY7bGluZS1oZWlnaHQ6IDI4cHg7dGV4dC1kZWNvcmF0aW9uOiBub25lOyc+PHNwYW5cXG5cIiArXG4gICAgICAgICAgICBcInN0eWxlPSdmb250LXNpemU6IDE4cHg7Jz5KZXR6dCBBbm1lbGR1bmcgYmVzdCZhdW1sO3RpZ2VuPC9zcGFuPjwvc3Bhbj4gPC9hPjwvdGQ+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGFibGU+PC90ZD5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90YWJsZT48L3RkPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RhYmxlPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9J3RleHQtYWxpZ246IGxlZnQ7Zm9udC1mYW1pbHk6IGFyaWFsO2ZvbnQtc2l6ZTogMTJweDtjb2xvcjogI2ZmZmZmZjtsaW5lLWhlaWdodDogMjJweDttc28tbGluZS1oZWlnaHQ6IGV4YWN0bHk7bXNvLXRleHQtcmFpc2U6IDVweDsnPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHAgc3R5bGU9J3BhZGRpbmc6IDA7IG1hcmdpbjogMDt0ZXh0LWFsaWduOiBjZW50ZXI7Jz5XZW5uIFNpZSBpaHJlIEUtTWFpbC1BZHJlc3NlIG5pY2h0IGJlc3TDpHRpZ2VuLCBrw7ZubmVuIGtlaW5lIE5ld3NsZXR0ZXIgenVnZXN0ZWxsdCB3ZXJkZW4uIElociBFaW52ZXJzdMOkbmRuaXMga8O2bm5lbiBTaWUgc2VsYnN0dmVyc3TDpG5kbGljaCBqZWRlcnplaXQgd2lkZXJydWZlbi4gU29sbHRlIGVzIHNpY2ggYmVpIGRlciBBbm1lbGR1bmcgdW0gZWluIFZlcnNlaGVuIGhhbmRlbG4gb2RlciB3dXJkZSBkZXIgTmV3c2xldHRlciBuaWNodCBpbiBJaHJlbSBOYW1lbiBiZXN0ZWxsdCwga8O2bm5lbiBTaWUgZGllc2UgRS1NYWlsIGVpbmZhY2ggaWdub3JpZXJlbi4gSWhuZW4gd2VyZGVuIGtlaW5lIHdlaXRlcmVuIE5hY2hyaWNodGVuIHp1Z2VzY2hpY2t0LjwvcD5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj48L3RkPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RhYmxlPjwvdGQ+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgIDwvdGFibGU+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgPHRhYmxlIGNlbGxwYWRkaW5nPScwJyBjZWxsc3BhY2luZz0nMCcgYm9yZGVyPScwJyB3aWR0aD0nMTAwJScgYmdjb2xvcj0nI2ZmZmZmZicgc3R5bGU9J2JvcmRlcjogMHB4IG5vbmU7YmFja2dyb3VuZC1jb2xvcjogI2ZmZmZmZjsnPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgdmFsaWduPSd0b3AnIHN0eWxlPSdwYWRkaW5nLXRvcDogMzBweDtwYWRkaW5nLXJpZ2h0OiAyMHB4O3BhZGRpbmctYm90dG9tOiAzNXB4O3BhZGRpbmctbGVmdDogMjBweDsnPjx0YWJsZSBjZWxscGFkZGluZz0nMCcgY2VsbHNwYWNpbmc9JzAnIHdpZHRoPScxMDAlJz5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIHN0eWxlPSdwYWRkaW5nOiAwcHg7Jz48dGFibGUgY2VsbHBhZGRpbmc9JzAnIGNlbGxzcGFjaW5nPScwJyBib3JkZXI9JzAnIHdpZHRoPScxMDAlJz5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIHZhbGlnbj0ndG9wJyBzdHlsZT0ncGFkZGluZy1ib3R0b206IDI1cHg7Jz48ZGl2IHN0eWxlPSd0ZXh0LWFsaWduOiBsZWZ0O2ZvbnQtZmFtaWx5OiBhcmlhbDtmb250LXNpemU6IDEycHg7Y29sb3I6ICMzMzMzMzM7bGluZS1oZWlnaHQ6IDIycHg7bXNvLWxpbmUtaGVpZ2h0OiBleGFjdGx5O21zby10ZXh0LXJhaXNlOiA1cHg7Jz5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwIHN0eWxlPSdwYWRkaW5nOiAwOyBtYXJnaW46IDA7dGV4dC1hbGlnbjogY2VudGVyOyc+PHNwYW4gc3R5bGU9J2xpbmUtaGVpZ2h0OiAzOyc+PHN0cm9uZz5Lb250YWt0PC9zdHJvbmc+PC9zcGFuPjxicj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VydmljZUBzZW5kZWZmZWN0LmRlPGJyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3d3cuc2VuZGVmZmVjdC5kZTxicj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVGVsZWZvbjogKzQ5ICgwKSA4NTcxIC0gOTcgMzkgLSA2OS0wPC9wPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PjwvdGQ+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGFibGU+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT0ndGV4dC1hbGlnbjogbGVmdDtmb250LWZhbWlseTogYXJpYWw7Zm9udC1zaXplOiAxMnB4O2NvbG9yOiAjMzMzMzMzO2xpbmUtaGVpZ2h0OiAyMnB4O21zby1saW5lLWhlaWdodDogZXhhY3RseTttc28tdGV4dC1yYWlzZTogNXB4Oyc+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cCBzdHlsZT0ncGFkZGluZzogMDsgbWFyZ2luOiAwO3RleHQtYWxpZ246IGNlbnRlcjsnPjxzcGFuIHN0eWxlPSdsaW5lLWhlaWdodDogMzsnPjxzdHJvbmc+SW1wcmVzc3VtPC9zdHJvbmc+PC9zcGFuPjxicj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQW5zY2hyaWZ0OiBTY2h1bGdhc3NlIDUsIEQtODQzNTkgU2ltYmFjaCBhbSBJbm4sIGVNYWlsOiBzZXJ2aWNlQHNlbmRlZmZlY3QuZGU8YnI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEJldHJlaWJlcjogV0VCYW5pemVyIEFHLCBSZWdpc3RlcmdlcmljaHQ6IEFtdHNnZXJpY2h0IExhbmRzaHV0IEhSQiA1MTc3LCBVc3RJZC46IERFIDIwNjggNjIgMDcwPGJyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBWb3JzdGFuZDogT3R0bWFyIE5ldWJ1cmdlciwgQXVmc2ljaHRzcmF0OiBUb2JpYXMgTmV1YnVyZ2VyPC9wPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PjwvdGQ+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGFibGU+PC90ZD5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgPC90YWJsZT48L3RkPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgPC90cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICA8L3RhYmxlPjwvdGQ+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICA8L3RyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgIDwvdGFibGU+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgIDwvZGl2PlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICA8IS0tIGNvbnRlbnQgZW5kIC0tPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgPC9jZW50ZXI+PC90ZD5cXG5cIiArXG4gICAgICAgICAgICBcIiAgPC90cj5cXG5cIiArXG4gICAgICAgICAgICBcIjwvdGFibGU+XCJcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHtcInN0YXR1c1wiOiBcInN1Y2Nlc3NcIiwgXCJkYXRhXCI6IGRhdGF9O1xuICAgIH1cbiAgfVxufSk7XG4iLCJpbXBvcnQgeyBBcGksIERPSV9GRVRDSF9ST1VURSwgRE9JX0NPTkZJUk1BVElPTl9OT1RJRllfUk9VVEUgfSBmcm9tICcuLi9yZXN0LmpzJztcbmltcG9ydCBhZGRPcHRJbiBmcm9tICcuLi8uLi8uLi8uLi9pbXBvcnRzL21vZHVsZXMvc2VydmVyL29wdC1pbnMvYWRkX2FuZF93cml0ZV90b19ibG9ja2NoYWluLmpzJztcbmltcG9ydCB1cGRhdGVPcHRJblN0YXR1cyBmcm9tICcuLi8uLi8uLi8uLi9pbXBvcnRzL21vZHVsZXMvc2VydmVyL29wdC1pbnMvdXBkYXRlX3N0YXR1cy5qcyc7XG5pbXBvcnQgZ2V0RG9pTWFpbERhdGEgZnJvbSAnLi4vLi4vLi4vLi4vaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9kYXBwcy9nZXRfZG9pLW1haWwtZGF0YS5qcyc7XG5pbXBvcnQge2xvZ0Vycm9yLCBsb2dTZW5kfSBmcm9tIFwiLi4vLi4vLi4vLi4vaW1wb3J0cy9zdGFydHVwL3NlcnZlci9sb2ctY29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHtET0lfRVhQT1JUX1JPVVRFfSBmcm9tIFwiLi4vcmVzdFwiO1xuaW1wb3J0IGV4cG9ydERvaXMgZnJvbSBcIi4uLy4uLy4uLy4uL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvZGFwcHMvZXhwb3J0X2RvaXNcIjtcbmltcG9ydCB7T3B0SW5zfSBmcm9tIFwiLi4vLi4vLi4vLi4vaW1wb3J0cy9hcGkvb3B0LWlucy9vcHQtaW5zXCI7XG5pbXBvcnQge1JvbGVzfSBmcm9tIFwibWV0ZW9yL2FsYW5uaW5nOnJvbGVzXCI7XG5cbi8vZG9rdSBvZiBtZXRlb3ItcmVzdGl2dXMgaHR0cHM6Ly9naXRodWIuY29tL2thaG1hbGkvbWV0ZW9yLXJlc3RpdnVzXG5cbkFwaS5hZGRSb3V0ZShET0lfQ09ORklSTUFUSU9OX05PVElGWV9ST1VURSwge1xuICBwb3N0OiB7XG4gICAgYXV0aFJlcXVpcmVkOiB0cnVlLFxuICAgIC8vcm9sZVJlcXVpcmVkOiBbJ2FkbWluJ10sXG4gICAgYWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IHFQYXJhbXMgPSB0aGlzLnF1ZXJ5UGFyYW1zO1xuICAgICAgY29uc3QgYlBhcmFtcyA9IHRoaXMuYm9keVBhcmFtcztcbiAgICAgIGxldCBwYXJhbXMgPSB7fVxuICAgICAgaWYocVBhcmFtcyAhPT0gdW5kZWZpbmVkKSBwYXJhbXMgPSB7Li4ucVBhcmFtc31cbiAgICAgIGlmKGJQYXJhbXMgIT09IHVuZGVmaW5lZCkgcGFyYW1zID0gey4uLnBhcmFtcywgLi4uYlBhcmFtc31cblxuICAgICAgY29uc3QgdWlkID0gdGhpcy51c2VySWQ7XG5cbiAgICAgIGlmKCFSb2xlcy51c2VySXNJblJvbGUodWlkLCAnYWRtaW4nKSB8fCAvL2lmIGl0cyBub3QgYW4gYWRtaW4gYWx3YXlzIHVzZSB1aWQgYXMgb3duZXJJZFxuICAgICAgICAgIChSb2xlcy51c2VySXNJblJvbGUodWlkLCAnYWRtaW4nKSAmJiAocGFyYW1zW1wib3duZXJJZFwiXT09bnVsbCB8fCBwYXJhbXNbXCJvd25lcklkXCJdPT11bmRlZmluZWQpKSkgeyAgLy9pZiBpdHMgYW4gYWRtaW4gb25seSB1c2UgdWlkIGluIGNhc2Ugbm8gb3duZXJJZCB3YXMgZ2l2ZW5cbiAgICAgICAgICBwYXJhbXNbXCJvd25lcklkXCJdID0gdWlkO1xuICAgICAgfVxuXG4gICAgICBsb2dTZW5kKCdwYXJhbWV0ZXIgcmVjZWl2ZWQgZnJvbSBicm93c2VyOicscGFyYW1zKTtcbiAgICAgIGlmKHBhcmFtcy5zZW5kZXJfbWFpbC5jb25zdHJ1Y3RvciA9PT0gQXJyYXkpeyAvL3RoaXMgaXMgYSBTT0kgd2l0aCBjby1zcG9uc29ycyBmaXJzdCBlbWFpbCBpcyBtYWluIHNwb25zb3JcbiAgICAgICAgICByZXR1cm4gcHJlcGFyZUNvRE9JKHBhcmFtcyk7XG4gICAgICB9ZWxzZXtcbiAgICAgICAgIHJldHVybiBwcmVwYXJlQWRkKHBhcmFtcyk7XG4gICAgICB9XG4gICAgfVxuICB9LFxuICBwdXQ6IHtcbiAgICBhdXRoUmVxdWlyZWQ6IGZhbHNlLFxuICAgIGFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBxUGFyYW1zID0gdGhpcy5xdWVyeVBhcmFtcztcbiAgICAgIGNvbnN0IGJQYXJhbXMgPSB0aGlzLmJvZHlQYXJhbXM7XG5cbiAgICAgIGxvZ1NlbmQoJ3FQYXJhbXM6JyxxUGFyYW1zKTtcbiAgICAgIGxvZ1NlbmQoJ2JQYXJhbXM6JyxiUGFyYW1zKTtcblxuICAgICAgbGV0IHBhcmFtcyA9IHt9XG4gICAgICBpZihxUGFyYW1zICE9PSB1bmRlZmluZWQpIHBhcmFtcyA9IHsuLi5xUGFyYW1zfVxuICAgICAgaWYoYlBhcmFtcyAhPT0gdW5kZWZpbmVkKSBwYXJhbXMgPSB7Li4ucGFyYW1zLCAuLi5iUGFyYW1zfVxuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgdmFsID0gdXBkYXRlT3B0SW5TdGF0dXMocGFyYW1zKTtcbiAgICAgICAgbG9nU2VuZCgnb3B0LUluIHN0YXR1cyB1cGRhdGVkJyx2YWwpO1xuICAgICAgICByZXR1cm4ge3N0YXR1czogJ3N1Y2Nlc3MnLCBkYXRhOiB7bWVzc2FnZTogJ09wdC1JbiBzdGF0dXMgdXBkYXRlZCd9fTtcbiAgICAgIH0gY2F0Y2goZXJyb3IpIHtcbiAgICAgICAgcmV0dXJuIHtzdGF0dXNDb2RlOiA1MDAsIGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogZXJyb3IubWVzc2FnZX19O1xuICAgICAgfVxuICAgIH1cbiAgfVxufSk7XG5cbkFwaS5hZGRSb3V0ZShET0lfRkVUQ0hfUk9VVEUsIHthdXRoUmVxdWlyZWQ6IGZhbHNlfSwge1xuICBnZXQ6IHtcbiAgICBhY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgcGFyYW1zID0gdGhpcy5xdWVyeVBhcmFtcztcbiAgICAgIHRyeSB7XG4gICAgICAgICAgbG9nU2VuZCgncmVzdCBhcGkgLSBET0lfRkVUQ0hfUk9VVEUgY2FsbGVkIGJ5IGJvYiB0byByZXF1ZXN0IGVtYWlsIHRlbXBsYXRlJyxKU09OLnN0cmluZ2lmeShwYXJhbXMpKTtcbiAgICAgICAgICBjb25zdCBkYXRhID0gZ2V0RG9pTWFpbERhdGEocGFyYW1zKTtcbiAgICAgICAgICBsb2dTZW5kKCdnb3QgZG9pLW1haWwtZGF0YSAoaW5jbHVkaW5nIHRlbXBsYWx0ZSkgcmV0dXJuaW5nIHRvIGJvYicse3N1YmplY3Q6ZGF0YS5zdWJqZWN0LCByZWNpcGllbnQ6ZGF0YS5yZWNpcGllbnR9KTtcbiAgICAgICAgcmV0dXJuIHtzdGF0dXM6ICdzdWNjZXNzJywgZGF0YX07XG4gICAgICB9IGNhdGNoKGVycm9yKSB7XG4gICAgICAgIGxvZ0Vycm9yKCdlcnJvciB3aGlsZSBnZXR0aW5nIERvaU1haWxEYXRhJyxlcnJvcik7XG4gICAgICAgIHJldHVybiB7c3RhdHVzOiAnZmFpbCcsIGVycm9yOiBlcnJvci5tZXNzYWdlfTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn0pO1xuXG5BcGkuYWRkUm91dGUoRE9JX0VYUE9SVF9ST1VURSwge1xuICAgIGdldDoge1xuICAgICAgICBhdXRoUmVxdWlyZWQ6IHRydWUsXG4gICAgICAgIC8vcm9sZVJlcXVpcmVkOiBbJ2FkbWluJ10sXG4gICAgICAgIGFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBsZXQgcGFyYW1zID0gdGhpcy5xdWVyeVBhcmFtcztcbiAgICAgICAgICAgIGNvbnN0IHVpZCA9IHRoaXMudXNlcklkO1xuICAgICAgICAgICAgaWYoIVJvbGVzLnVzZXJJc0luUm9sZSh1aWQsICdhZG1pbicpKXtcbiAgICAgICAgICAgICAgICBwYXJhbXMgPSB7dXNlcmlkOnVpZCxyb2xlOid1c2VyJ307XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgIHBhcmFtcyA9IHsuLi5wYXJhbXMscm9sZTonYWRtaW4nfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBsb2dTZW5kKCdyZXN0IGFwaSAtIERPSV9FWFBPUlRfUk9VVEUgY2FsbGVkJyxKU09OLnN0cmluZ2lmeShwYXJhbXMpKTtcbiAgICAgICAgICAgICAgICBjb25zdCBkYXRhID0gZXhwb3J0RG9pcyhwYXJhbXMpO1xuICAgICAgICAgICAgICAgIGxvZ1NlbmQoJ2dvdCBkb2lzIGZyb20gZGF0YWJhc2UnLEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcbiAgICAgICAgICAgICAgICByZXR1cm4ge3N0YXR1czogJ3N1Y2Nlc3MnLCBkYXRhfTtcbiAgICAgICAgICAgIH0gY2F0Y2goZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBsb2dFcnJvcignZXJyb3Igd2hpbGUgZXhwb3J0aW5nIGNvbmZpcm1lZCBkb2lzJyxlcnJvcik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtzdGF0dXM6ICdmYWlsJywgZXJyb3I6IGVycm9yLm1lc3NhZ2V9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufSk7XG5cbmZ1bmN0aW9uIHByZXBhcmVDb0RPSShwYXJhbXMpe1xuXG4gICAgbG9nU2VuZCgnaXMgYXJyYXkgJyxwYXJhbXMuc2VuZGVyX21haWwpO1xuXG4gICAgY29uc3Qgc2VuZGVycyA9IHBhcmFtcy5zZW5kZXJfbWFpbDtcbiAgICBjb25zdCByZWNpcGllbnRfbWFpbCA9IHBhcmFtcy5yZWNpcGllbnRfbWFpbDtcbiAgICBjb25zdCBkYXRhID0gcGFyYW1zLmRhdGE7XG4gICAgY29uc3Qgb3duZXJJRCA9IHBhcmFtcy5vd25lcklkO1xuXG4gICAgbGV0IGN1cnJlbnRPcHRJbklkO1xuICAgIGxldCByZXRSZXNwb25zZSA9IFtdO1xuICAgIGxldCBtYXN0ZXJfZG9pO1xuICAgIHNlbmRlcnMuZm9yRWFjaCgoc2VuZGVyLGluZGV4KSA9PiB7XG5cbiAgICAgICAgY29uc3QgcmV0X3Jlc3BvbnNlID0gcHJlcGFyZUFkZCh7c2VuZGVyX21haWw6c2VuZGVyLHJlY2lwaWVudF9tYWlsOnJlY2lwaWVudF9tYWlsLGRhdGE6ZGF0YSwgbWFzdGVyX2RvaTptYXN0ZXJfZG9pLCBpbmRleDogaW5kZXgsIG93bmVySWQ6b3duZXJJRH0pO1xuICAgICAgICBsb2dTZW5kKCdDb0RPSTonLHJldF9yZXNwb25zZSk7XG4gICAgICAgIGlmKHJldF9yZXNwb25zZS5zdGF0dXMgPT09IHVuZGVmaW5lZCB8fCByZXRfcmVzcG9uc2Uuc3RhdHVzPT09XCJmYWlsZWRcIikgdGhyb3cgXCJjb3VsZCBub3QgYWRkIGNvLW9wdC1pblwiO1xuICAgICAgICByZXRSZXNwb25zZS5wdXNoKHJldF9yZXNwb25zZSk7XG4gICAgICAgIGN1cnJlbnRPcHRJbklkID0gcmV0X3Jlc3BvbnNlLmRhdGEuaWQ7XG5cbiAgICAgICAgaWYoaW5kZXg9PT0wKVxuICAgICAgICB7XG4gICAgICAgICAgICBsb2dTZW5kKCdtYWluIHNwb25zb3Igb3B0SW5JZDonLGN1cnJlbnRPcHRJbklkKTtcbiAgICAgICAgICAgIGNvbnN0IG9wdEluID0gT3B0SW5zLmZpbmRPbmUoe19pZDogY3VycmVudE9wdEluSWR9KTtcbiAgICAgICAgICAgIG1hc3Rlcl9kb2kgPSBvcHRJbi5uYW1lSWQ7XG4gICAgICAgICAgICBsb2dTZW5kKCdtYWluIHNwb25zb3IgbmFtZUlkOicsbWFzdGVyX2RvaSk7XG4gICAgICAgIH1cblxuICAgIH0pO1xuXG4gICAgbG9nU2VuZChyZXRSZXNwb25zZSk7XG5cbiAgICByZXR1cm4gcmV0UmVzcG9uc2U7XG59XG5cbmZ1bmN0aW9uIHByZXBhcmVBZGQocGFyYW1zKXtcblxuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHZhbCA9IGFkZE9wdEluKHBhcmFtcyk7XG4gICAgICAgIGxvZ1NlbmQoJ29wdC1JbiBhZGRlZCBJRDonLHZhbCk7XG4gICAgICAgIHJldHVybiB7c3RhdHVzOiAnc3VjY2VzcycsIGRhdGE6IHtpZDogdmFsLCBzdGF0dXM6ICdzdWNjZXNzJywgbWVzc2FnZTogJ09wdC1JbiBhZGRlZC4nfX07XG4gICAgfSBjYXRjaChlcnJvcikge1xuICAgICAgICByZXR1cm4ge3N0YXR1c0NvZGU6IDUwMCwgYm9keToge3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiBlcnJvci5tZXNzYWdlfX07XG4gICAgfVxufSIsImltcG9ydCB7IEFwaSB9IGZyb20gJy4uL3Jlc3QuanMnO1xuaW1wb3J0IHtnZXRJbmZvfSBmcm9tIFwiLi4vLi4vZG9pY2hhaW5cIjtcbmltcG9ydCB7IENPTkZJUk1fQ0xJRU5UfSBmcm9tIFwiLi4vLi4vLi4vLi4vaW1wb3J0cy9zdGFydHVwL3NlcnZlci9kb2ljaGFpbi1jb25maWd1cmF0aW9uXCI7XG5cbkFwaS5hZGRSb3V0ZSgnc3RhdHVzJywge2F1dGhSZXF1aXJlZDogZmFsc2V9LCB7XG4gIGdldDoge1xuICAgIGFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBkYXRhID0gZ2V0SW5mbyhDT05GSVJNX0NMSUVOVCk7XG4gICAgICByZXR1cm4ge1wic3RhdHVzXCI6IFwic3VjY2Vzc1wiLCBcImRhdGFcIjogZGF0YX07XG4gICAgfVxuICB9XG59KTtcbiIsImltcG9ydCB7IEFwaSB9IGZyb20gJy4uL3Jlc3QuanMnO1xuaW1wb3J0IHtNZXRlb3J9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IHtBY2NvdW50c30gZnJvbSAnbWV0ZW9yL2FjY291bnRzLWJhc2UnXG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XG5pbXBvcnQge1JvbGVzfSBmcm9tIFwibWV0ZW9yL2FsYW5uaW5nOnJvbGVzXCI7XG5pbXBvcnQge2xvZ01haW59IGZyb20gXCIuLi8uLi8uLi8uLi9pbXBvcnRzL3N0YXJ0dXAvc2VydmVyL2xvZy1jb25maWd1cmF0aW9uXCI7XG5cbmNvbnN0IG1haWxUZW1wbGF0ZVNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICAgIHN1YmplY3Q6IHtcbiAgICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgICBvcHRpb25hbDp0cnVlIFxuICAgIH0sXG4gICAgcmVkaXJlY3Q6IHtcbiAgICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgICByZWdFeDogXCJAKGh0dHBzP3xmdHApOi8vKC1cXFxcLik/KFteXFxcXHMvP1xcXFwuIy1dK1xcXFwuPykrKC9bXlxcXFxzXSopPyRAXCIsXG4gICAgICAgIG9wdGlvbmFsOnRydWUgXG4gICAgfSxcbiAgICByZXR1cm5QYXRoOiB7XG4gICAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgICAgcmVnRXg6IFNpbXBsZVNjaGVtYS5SZWdFeC5FbWFpbCxcbiAgICAgICAgb3B0aW9uYWw6dHJ1ZSBcbiAgICB9LFxuICAgIHRlbXBsYXRlVVJMOntcbiAgICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgICByZWdFeDogXCJAKGh0dHBzP3xmdHApOi8vKC1cXFxcLik/KFteXFxcXHMvP1xcXFwuIy1dK1xcXFwuPykrKC9bXlxcXFxzXSopPyRAXCIsXG4gICAgICAgIG9wdGlvbmFsOnRydWUgXG4gICAgfVxufSk7XG5cbmNvbnN0IGNyZWF0ZVVzZXJTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgICB1c2VybmFtZToge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgcmVnRXg6IFwiXltBLVosYS16LDAtOSwhLF8sJCwjXXs0LDI0fSRcIiAgLy9Pbmx5IHVzZXJuYW1lcyBiZXR3ZWVuIDQtMjQgY2hhcmFjdGVycyBmcm9tIEEtWixhLXosMC05LCEsXywkLCMgYWxsb3dlZFxuICAgIH0sXG4gICAgZW1haWw6IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIHJlZ0V4OiBTaW1wbGVTY2hlbWEuUmVnRXguRW1haWxcbiAgICB9LFxuICAgIHBhc3N3b3JkOiB7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICByZWdFeDogXCJeW0EtWixhLXosMC05LCEsXywkLCNdezgsMjR9JFwiIC8vT25seSBwYXNzd29yZHMgYmV0d2VlbiA4LTI0IGNoYXJhY3RlcnMgZnJvbSBBLVosYS16LDAtOSwhLF8sJCwjIGFsbG93ZWRcbiAgICB9LFxuICAgIG1haWxUZW1wbGF0ZTp7XG4gICAgICAgIHR5cGU6IG1haWxUZW1wbGF0ZVNjaGVtYSxcbiAgICAgICAgb3B0aW9uYWw6dHJ1ZSBcbiAgICB9XG4gIH0pO1xuICBjb25zdCB1cGRhdGVVc2VyU2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gICAgbWFpbFRlbXBsYXRlOntcbiAgICAgICAgdHlwZTogbWFpbFRlbXBsYXRlU2NoZW1hXG4gICAgfVxufSk7XG5cbi8vVE9ETzogY29sbGVjdGlvbiBvcHRpb25zIHNlcGFyYXRlXG5jb25zdCBjb2xsZWN0aW9uT3B0aW9ucyA9XG4gIHtcbiAgICBwYXRoOlwidXNlcnNcIixcbiAgICByb3V0ZU9wdGlvbnM6XG4gICAge1xuICAgICAgICBhdXRoUmVxdWlyZWQgOiB0cnVlXG4gICAgICAgIC8vLHJvbGVSZXF1aXJlZCA6IFwiYWRtaW5cIlxuICAgIH0sXG4gICAgZXhjbHVkZWRFbmRwb2ludHM6IFsncGF0Y2gnLCdkZWxldGVBbGwnXSxcbiAgICBlbmRwb2ludHM6XG4gICAge1xuICAgICAgICBkZWxldGU6e3JvbGVSZXF1aXJlZCA6IFwiYWRtaW5cIn0sXG4gICAgICAgIHBvc3Q6XG4gICAgICAgIHtcbiAgICAgICAgICAgIHJvbGVSZXF1aXJlZCA6IFwiYWRtaW5cIixcbiAgICAgICAgICAgIGFjdGlvbjogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICBjb25zdCBxUGFyYW1zID0gdGhpcy5xdWVyeVBhcmFtcztcbiAgICAgICAgICAgICAgICBjb25zdCBiUGFyYW1zID0gdGhpcy5ib2R5UGFyYW1zO1xuICAgICAgICAgICAgICAgIGxldCBwYXJhbXMgPSB7fTtcbiAgICAgICAgICAgICAgICBpZihxUGFyYW1zICE9PSB1bmRlZmluZWQpIHBhcmFtcyA9IHsuLi5xUGFyYW1zfVxuICAgICAgICAgICAgICAgIGlmKGJQYXJhbXMgIT09IHVuZGVmaW5lZCkgcGFyYW1zID0gey4uLnBhcmFtcywgLi4uYlBhcmFtc31cbiAgICAgICAgICAgICAgICB0cnl7XG4gICAgICAgICAgICAgICAgICAgIGxldCB1c2VySWQ7XG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZVVzZXJTY2hlbWEudmFsaWRhdGUocGFyYW1zKTtcbiAgICAgICAgICAgICAgICAgICAgbG9nTWFpbigndmFsaWRhdGVkJyxwYXJhbXMpO1xuICAgICAgICAgICAgICAgICAgICBpZihwYXJhbXMubWFpbFRlbXBsYXRlICE9PSB1bmRlZmluZWQpe1xuICAgICAgICAgICAgICAgICAgICAgICAgdXNlcklkID0gQWNjb3VudHMuY3JlYXRlVXNlcih7dXNlcm5hbWU6cGFyYW1zLnVzZXJuYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVtYWlsOnBhcmFtcy5lbWFpbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXNzd29yZDpwYXJhbXMucGFzc3dvcmQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvZmlsZTp7bWFpbFRlbXBsYXRlOnBhcmFtcy5tYWlsVGVtcGxhdGV9fSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVzZXJJZCA9IEFjY291bnRzLmNyZWF0ZVVzZXIoe3VzZXJuYW1lOnBhcmFtcy51c2VybmFtZSxlbWFpbDpwYXJhbXMuZW1haWwscGFzc3dvcmQ6cGFyYW1zLnBhc3N3b3JkLCBwcm9maWxlOnt9fSk7XG4gICAgICAgICAgICAgICAgICAgIH0gICAgXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7c3RhdHVzOiAnc3VjY2VzcycsIGRhdGE6IHt1c2VyaWQ6IHVzZXJJZH19O1xuICAgICAgICAgICAgICAgIH0gY2F0Y2goZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiB7c3RhdHVzQ29kZTogNDAwLCBib2R5OiB7c3RhdHVzOiAnZmFpbCcsIG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2V9fTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHB1dDpcbiAgICAgICAge1xuICAgICAgICAgICAgYWN0aW9uOiBmdW5jdGlvbigpeyAgICAgIFxuICAgICAgICAgICAgICAgIGNvbnN0IHFQYXJhbXMgPSB0aGlzLnF1ZXJ5UGFyYW1zO1xuICAgICAgICAgICAgICAgIGNvbnN0IGJQYXJhbXMgPSB0aGlzLmJvZHlQYXJhbXM7XG4gICAgICAgICAgICAgICAgbGV0IHBhcmFtcyA9IHt9O1xuICAgICAgICAgICAgICAgIGxldCB1aWQ9dGhpcy51c2VySWQ7XG4gICAgICAgICAgICAgICAgY29uc3QgcGFyYW1JZD10aGlzLnVybFBhcmFtcy5pZDtcbiAgICAgICAgICAgICAgICBpZihxUGFyYW1zICE9PSB1bmRlZmluZWQpIHBhcmFtcyA9IHsuLi5xUGFyYW1zfVxuICAgICAgICAgICAgICAgIGlmKGJQYXJhbXMgIT09IHVuZGVmaW5lZCkgcGFyYW1zID0gey4uLnBhcmFtcywgLi4uYlBhcmFtc31cblxuICAgICAgICAgICAgICAgIHRyeXsgLy9UT0RPIHRoaXMgaXMgbm90IG5lY2Vzc2FyeSBoZXJlIGFuZCBjYW4gcHJvYmFibHkgZ28gcmlnaHQgaW50byB0aGUgZGVmaW5pdGlvbiBvZiB0aGUgUkVTVCBNRVRIT0QgbmV4dCB0byBwdXQgKCE/ISlcbiAgICAgICAgICAgICAgICAgICAgaWYoIVJvbGVzLnVzZXJJc0luUm9sZSh1aWQsICdhZG1pbicpKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHVpZCE9PXBhcmFtSWQpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IEVycm9yKFwiTm8gUGVybWlzc2lvblwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB1cGRhdGVVc2VyU2NoZW1hLnZhbGlkYXRlKHBhcmFtcyk7XG4gICAgICAgICAgICAgICAgICAgIGlmKCFNZXRlb3IudXNlcnMudXBkYXRlKHRoaXMudXJsUGFyYW1zLmlkLHskc2V0OntcInByb2ZpbGUubWFpbFRlbXBsYXRlXCI6cGFyYW1zLm1haWxUZW1wbGF0ZX19KSl7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBFcnJvcihcIkZhaWxlZCB0byB1cGRhdGUgdXNlclwiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge3N0YXR1czogJ3N1Y2Nlc3MnLCBkYXRhOiB7dXNlcmlkOiB0aGlzLnVybFBhcmFtcy5pZCwgbWFpbFRlbXBsYXRlOnBhcmFtcy5tYWlsVGVtcGxhdGV9fTtcbiAgICAgICAgICAgICAgICB9IGNhdGNoKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4ge3N0YXR1c0NvZGU6IDQwMCwgYm9keToge3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiBlcnJvci5tZXNzYWdlfX07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuQXBpLmFkZENvbGxlY3Rpb24oTWV0ZW9yLnVzZXJzLGNvbGxlY3Rpb25PcHRpb25zKTsiLCJpbXBvcnQgeyBBcGkgfSBmcm9tICcuLi9yZXN0LmpzJztcbmltcG9ydCB2ZXJpZnlPcHRJbiBmcm9tICcuLi8uLi8uLi8uLi9pbXBvcnRzL21vZHVsZXMvc2VydmVyL29wdC1pbnMvdmVyaWZ5LmpzJztcblxuQXBpLmFkZFJvdXRlKCdvcHQtaW4vdmVyaWZ5Jywge2F1dGhSZXF1aXJlZDogdHJ1ZX0sIHtcbiAgZ2V0OiB7XG4gICAgYXV0aFJlcXVpcmVkOiBmYWxzZSxcbiAgICBhY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICBjb25zdCBxUGFyYW1zID0gdGhpcy5xdWVyeVBhcmFtcztcbiAgICAgICAgY29uc3QgYlBhcmFtcyA9IHRoaXMuYm9keVBhcmFtcztcbiAgICAgICAgbGV0IHBhcmFtcyA9IHt9XG4gICAgICAgIGlmKHFQYXJhbXMgIT09IHVuZGVmaW5lZCkgcGFyYW1zID0gey4uLnFQYXJhbXN9XG4gICAgICAgIGlmKGJQYXJhbXMgIT09IHVuZGVmaW5lZCkgcGFyYW1zID0gey4uLnBhcmFtcywgLi4uYlBhcmFtc31cblxuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgdmFsID0gdmVyaWZ5T3B0SW4ocGFyYW1zKTtcbiAgICAgICAgcmV0dXJuIHtzdGF0dXM6IFwic3VjY2Vzc1wiLCBkYXRhOiB7dmFsfX07XG4gICAgICB9IGNhdGNoKGVycm9yKSB7XG4gICAgICAgIHJldHVybiB7c3RhdHVzQ29kZTogNTAwLCBib2R5OiB7c3RhdHVzOiAnZmFpbCcsIG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2V9fTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn0pO1xuIiwiaW1wb3J0IHsgUmVzdGl2dXMgfSBmcm9tICdtZXRlb3IvbmltYmxlOnJlc3RpdnVzJztcbmltcG9ydCB7IGlzRGVidWcgfSBmcm9tICcuLi8uLi8uLi9pbXBvcnRzL3N0YXJ0dXAvc2VydmVyL2RhcHAtY29uZmlndXJhdGlvbi5qcyc7XG5pbXBvcnQgeyBTRU5EX0FQUCwgQ09ORklSTV9BUFAsIFZFUklGWV9BUFAsIGlzQXBwVHlwZSB9IGZyb20gJy4uLy4uLy4uL2ltcG9ydHMvc3RhcnR1cC9zZXJ2ZXIvdHlwZS1jb25maWd1cmF0aW9uLmpzJztcblxuZXhwb3J0IGNvbnN0IERPSV9DT05GSVJNQVRJT05fUk9VVEUgPSBcIm9wdC1pbi9jb25maXJtXCI7XG5leHBvcnQgY29uc3QgRE9JX0NPTkZJUk1BVElPTl9OT1RJRllfUk9VVEUgPSBcIm9wdC1pblwiO1xuZXhwb3J0IGNvbnN0IERPSV9XQUxMRVROT1RJRllfUk9VVEUgPSBcIndhbGxldG5vdGlmeVwiO1xuZXhwb3J0IGNvbnN0IERPSV9GRVRDSF9ST1VURSA9IFwiZG9pLW1haWxcIjtcbmV4cG9ydCBjb25zdCBET0lfRVhQT1JUX1JPVVRFID0gXCJleHBvcnRcIjtcbmV4cG9ydCBjb25zdCBBUElfUEFUSCA9IFwiYXBpL1wiO1xuZXhwb3J0IGNvbnN0IFZFUlNJT04gPSBcInYxXCI7XG5cbmV4cG9ydCBjb25zdCBBcGkgPSBuZXcgUmVzdGl2dXMoe1xuICBhcGlQYXRoOiBBUElfUEFUSCxcbiAgdmVyc2lvbjogVkVSU0lPTixcbiAgdXNlRGVmYXVsdEF1dGg6IHRydWUsXG4gIHByZXR0eUpzb246IHRydWVcbn0pO1xuXG5pZihpc0RlYnVnKCkpIHJlcXVpcmUoJy4vaW1wb3J0cy9kZWJ1Zy5qcycpO1xuaWYoaXNBcHBUeXBlKFNFTkRfQVBQKSkgcmVxdWlyZSgnLi9pbXBvcnRzL3NlbmQuanMnKTtcbmlmKGlzQXBwVHlwZShDT05GSVJNX0FQUCkpIHJlcXVpcmUoJy4vaW1wb3J0cy9jb25maXJtLmpzJyk7XG5pZihpc0FwcFR5cGUoVkVSSUZZX0FQUCkpIHJlcXVpcmUoJy4vaW1wb3J0cy92ZXJpZnkuanMnKTtcbnJlcXVpcmUoJy4vaW1wb3J0cy91c2VyLmpzJyk7XG5yZXF1aXJlKCcuL2ltcG9ydHMvc3RhdHVzLmpzJyk7XG4iLCJcbmltcG9ydCB7IEpvYkNvbGxlY3Rpb24sSm9iIH0gZnJvbSAnbWV0ZW9yL3ZzaXZzaTpqb2ItY29sbGVjdGlvbic7XG5leHBvcnQgY29uc3QgQmxvY2tjaGFpbkpvYnMgPSBKb2JDb2xsZWN0aW9uKCdibG9ja2NoYWluJyk7XG5pbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCBpbnNlcnQgZnJvbSAnLi4vLi4vaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9kb2ljaGFpbi9pbnNlcnQuanMnO1xuaW1wb3J0IHVwZGF0ZSBmcm9tICcuLi8uLi9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2RvaWNoYWluL3VwZGF0ZS5qcyc7XG4vKiBlc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtdmFycyAqLyAvL1RPRE8gcmUtZW5hYmxlIHRoaXMhXG5pbXBvcnQgY2hlY2tOZXdUcmFuc2FjdGlvbiBmcm9tICcuLi8uLi9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2RvaWNoYWluL2NoZWNrX25ld190cmFuc2FjdGlvbnMuanMnO1xuaW1wb3J0IHsgQ09ORklSTV9BUFAsIGlzQXBwVHlwZSB9IGZyb20gJy4uLy4uL2ltcG9ydHMvc3RhcnR1cC9zZXJ2ZXIvdHlwZS1jb25maWd1cmF0aW9uLmpzJztcbmltcG9ydCB7bG9nTWFpbn0gZnJvbSBcIi4uLy4uL2ltcG9ydHMvc3RhcnR1cC9zZXJ2ZXIvbG9nLWNvbmZpZ3VyYXRpb25cIjtcblxuQmxvY2tjaGFpbkpvYnMucHJvY2Vzc0pvYnMoJ2luc2VydCcsIHt3b3JrVGltZW91dDogMzAqMTAwMH0sZnVuY3Rpb24gKGpvYiwgY2IpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCBlbnRyeSA9IGpvYi5kYXRhO1xuICAgIGluc2VydChlbnRyeSk7XG4gICAgam9iLmRvbmUoKTtcbiAgfSBjYXRjaChleGNlcHRpb24pIHtcbiAgICBqb2IuZmFpbCgpO1xuXG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdqb2JzLmJsb2NrY2hhaW4uaW5zZXJ0LmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH0gZmluYWxseSB7XG4gICAgY2IoKTtcbiAgfVxufSk7XG5cbkJsb2NrY2hhaW5Kb2JzLnByb2Nlc3NKb2JzKCd1cGRhdGUnLCB7d29ya1RpbWVvdXQ6IDMwKjEwMDB9LGZ1bmN0aW9uIChqb2IsIGNiKSB7XG4gIHRyeSB7XG4gICAgY29uc3QgZW50cnkgPSBqb2IuZGF0YTtcbiAgICB1cGRhdGUoZW50cnksam9iKTtcbiAgfSBjYXRjaChleGNlcHRpb24pIHtcbiAgICBqb2IuZmFpbCgpO1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2pvYnMuYmxvY2tjaGFpbi51cGRhdGUuZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgfSBmaW5hbGx5IHtcbiAgICBjYigpO1xuICB9XG59KTtcblxuQmxvY2tjaGFpbkpvYnMucHJvY2Vzc0pvYnMoJ2NoZWNrTmV3VHJhbnNhY3Rpb24nLCB7d29ya1RpbWVvdXQ6IDMwKjEwMDB9LGZ1bmN0aW9uIChqb2IsIGNiKSB7XG4gIHRyeSB7XG4gICAgaWYoIWlzQXBwVHlwZShDT05GSVJNX0FQUCkpIHtcbiAgICAgIGpvYi5wYXVzZSgpO1xuICAgICAgam9iLmNhbmNlbCgpO1xuICAgICAgam9iLnJlbW92ZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvL2NoZWNrTmV3VHJhbnNhY3Rpb24obnVsbCxqb2IpO1xuICAgIH1cbiAgfSBjYXRjaChleGNlcHRpb24pIHtcbiAgICBqb2IuZmFpbCgpO1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2pvYnMuYmxvY2tjaGFpbi5jaGVja05ld1RyYW5zYWN0aW9ucy5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9IGZpbmFsbHkge1xuICAgIGNiKCk7XG4gIH1cbn0pO1xuXG5uZXcgSm9iKEJsb2NrY2hhaW5Kb2JzLCAnY2xlYW51cCcsIHt9KVxuICAgIC5yZXBlYXQoeyBzY2hlZHVsZTogQmxvY2tjaGFpbkpvYnMubGF0ZXIucGFyc2UudGV4dChcImV2ZXJ5IDUgbWludXRlc1wiKSB9KVxuICAgIC5zYXZlKHtjYW5jZWxSZXBlYXRzOiB0cnVlfSk7XG5cbmxldCBxID0gQmxvY2tjaGFpbkpvYnMucHJvY2Vzc0pvYnMoJ2NsZWFudXAnLHsgcG9sbEludGVydmFsOiBmYWxzZSwgd29ya1RpbWVvdXQ6IDYwKjEwMDAgfSAsZnVuY3Rpb24gKGpvYiwgY2IpIHtcbiAgY29uc3QgY3VycmVudCA9IG5ldyBEYXRlKClcbiAgICBjdXJyZW50LnNldE1pbnV0ZXMoY3VycmVudC5nZXRNaW51dGVzKCkgLSA1KTtcblxuICBjb25zdCBpZHMgPSBCbG9ja2NoYWluSm9icy5maW5kKHtcbiAgICAgICAgICBzdGF0dXM6IHskaW46IEpvYi5qb2JTdGF0dXNSZW1vdmFibGV9LFxuICAgICAgICAgIHVwZGF0ZWQ6IHskbHQ6IGN1cnJlbnR9fSxcbiAgICAgICAgICB7ZmllbGRzOiB7IF9pZDogMSB9fSk7XG5cbiAgICBsb2dNYWluKCdmb3VuZCAgcmVtb3ZhYmxlIGJsb2NrY2hhaW4gam9iczonLGlkcyk7XG4gICAgQmxvY2tjaGFpbkpvYnMucmVtb3ZlSm9icyhpZHMpO1xuICAgIGlmKGlkcy5sZW5ndGggPiAwKXtcbiAgICAgIGpvYi5kb25lKFwiUmVtb3ZlZCAje2lkcy5sZW5ndGh9IG9sZCBqb2JzXCIpO1xuICAgIH1cbiAgICBjYigpO1xufSk7XG5cbkJsb2NrY2hhaW5Kb2JzLmZpbmQoeyB0eXBlOiAnam9iVHlwZScsIHN0YXR1czogJ3JlYWR5JyB9KVxuICAgIC5vYnNlcnZlKHtcbiAgICAgICAgYWRkZWQ6IGZ1bmN0aW9uICgpIHsgcS50cmlnZ2VyKCk7IH1cbiAgICB9KTtcbiIsImltcG9ydCB7IEpvYkNvbGxlY3Rpb24sIEpvYiB9IGZyb20gJ21ldGVvci92c2l2c2k6am9iLWNvbGxlY3Rpb24nO1xuaW1wb3J0IGZldGNoRG9pTWFpbERhdGEgZnJvbSAnLi4vLi4vaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9kYXBwcy9mZXRjaF9kb2ktbWFpbC1kYXRhLmpzJztcbmltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IHtsb2dNYWlufSBmcm9tIFwiLi4vLi4vaW1wb3J0cy9zdGFydHVwL3NlcnZlci9sb2ctY29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHtCbG9ja2NoYWluSm9ic30gZnJvbSBcIi4vYmxvY2tjaGFpbl9qb2JzXCI7XG5cbmV4cG9ydCBjb25zdCBEQXBwSm9icyA9IEpvYkNvbGxlY3Rpb24oJ2RhcHAnKTtcblxuREFwcEpvYnMucHJvY2Vzc0pvYnMoJ2ZldGNoRG9pTWFpbERhdGEnLCBmdW5jdGlvbiAoam9iLCBjYikge1xuICB0cnkge1xuICAgIGNvbnN0IGRhdGEgPSBqb2IuZGF0YTtcbiAgICBmZXRjaERvaU1haWxEYXRhKGRhdGEpO1xuICAgIGpvYi5kb25lKCk7XG4gIH0gY2F0Y2goZXhjZXB0aW9uKSB7XG4gICAgam9iLmZhaWwoKTtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdqb2JzLmRhcHAuZmV0Y2hEb2lNYWlsRGF0YS5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9IGZpbmFsbHkge1xuICAgIGNiKCk7XG4gIH1cbn0pO1xuXG5cbm5ldyBKb2IoREFwcEpvYnMsICdjbGVhbnVwJywge30pXG4gICAgLnJlcGVhdCh7IHNjaGVkdWxlOiBEQXBwSm9icy5sYXRlci5wYXJzZS50ZXh0KFwiZXZlcnkgNSBtaW51dGVzXCIpIH0pXG4gICAgLnNhdmUoe2NhbmNlbFJlcGVhdHM6IHRydWV9KTtcblxubGV0IHEgPSBEQXBwSm9icy5wcm9jZXNzSm9icygnY2xlYW51cCcseyBwb2xsSW50ZXJ2YWw6IGZhbHNlLCB3b3JrVGltZW91dDogNjAqMTAwMCB9ICxmdW5jdGlvbiAoam9iLCBjYikge1xuICAgIGNvbnN0IGN1cnJlbnQgPSBuZXcgRGF0ZSgpXG4gICAgY3VycmVudC5zZXRNaW51dGVzKGN1cnJlbnQuZ2V0TWludXRlcygpIC0gNSk7XG5cbiAgICBjb25zdCBpZHMgPSBEQXBwSm9icy5maW5kKHtcbiAgICAgICAgICAgIHN0YXR1czogeyRpbjogSm9iLmpvYlN0YXR1c1JlbW92YWJsZX0sXG4gICAgICAgICAgICB1cGRhdGVkOiB7JGx0OiBjdXJyZW50fX0sXG4gICAgICAgIHtmaWVsZHM6IHsgX2lkOiAxIH19KTtcblxuICAgIGxvZ01haW4oJ2ZvdW5kICByZW1vdmFibGUgYmxvY2tjaGFpbiBqb2JzOicsaWRzKTtcbiAgICBEQXBwSm9icy5yZW1vdmVKb2JzKGlkcyk7XG4gICAgaWYoaWRzLmxlbmd0aCA+IDApe1xuICAgICAgICBqb2IuZG9uZShcIlJlbW92ZWQgI3tpZHMubGVuZ3RofSBvbGQgam9ic1wiKTtcbiAgICB9XG4gICAgY2IoKTtcbn0pO1xuXG5EQXBwSm9icy5maW5kKHsgdHlwZTogJ2pvYlR5cGUnLCBzdGF0dXM6ICdyZWFkeScgfSlcbiAgICAub2JzZXJ2ZSh7XG4gICAgICAgIGFkZGVkOiBmdW5jdGlvbiAoKSB7IHEudHJpZ2dlcigpOyB9XG4gICAgfSk7XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCBkbnMgZnJvbSAnZG5zJztcbmltcG9ydCB7bG9nU2VuZH0gZnJvbSBcIi4uLy4uL2ltcG9ydHMvc3RhcnR1cC9zZXJ2ZXIvbG9nLWNvbmZpZ3VyYXRpb25cIjtcblxuZXhwb3J0IGZ1bmN0aW9uIHJlc29sdmVUeHQoa2V5LCBkb21haW4pIHtcbiAgY29uc3Qgc3luY0Z1bmMgPSBNZXRlb3Iud3JhcEFzeW5jKGRuc19yZXNvbHZlVHh0KTtcbiAgdHJ5IHtcbiAgICBjb25zdCByZWNvcmRzID0gc3luY0Z1bmMoa2V5LCBkb21haW4pO1xuICAgIGlmKHJlY29yZHMgPT09IHVuZGVmaW5lZCkgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICBsZXQgdmFsdWUgPSB1bmRlZmluZWQ7XG4gICAgcmVjb3Jkcy5mb3JFYWNoKHJlY29yZCA9PiB7XG4gICAgICBpZihyZWNvcmRbMF0uc3RhcnRzV2l0aChrZXkpKSB7XG4gICAgICAgIGNvbnN0IHZhbCA9IHJlY29yZFswXS5zdWJzdHJpbmcoa2V5Lmxlbmd0aCsxKTtcbiAgICAgICAgdmFsdWUgPSB2YWwudHJpbSgpO1xuXG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9IGNhdGNoKGVycm9yKSB7XG4gICAgaWYoZXJyb3IubWVzc2FnZS5zdGFydHNXaXRoKFwicXVlcnlUeHQgRU5PREFUQVwiKSB8fFxuICAgICAgICBlcnJvci5tZXNzYWdlLnN0YXJ0c1dpdGgoXCJxdWVyeVR4dCBFTk9URk9VTkRcIikpIHJldHVybiB1bmRlZmluZWQ7XG4gICAgZWxzZSB0aHJvdyBlcnJvcjtcbiAgfVxufVxuXG5mdW5jdGlvbiBkbnNfcmVzb2x2ZVR4dChrZXksIGRvbWFpbiwgY2FsbGJhY2spIHtcbiAgICBsb2dTZW5kKFwicmVzb2x2aW5nIGRucyB0eHQgYXR0cmlidXRlOiBcIiwge2tleTprZXksZG9tYWluOmRvbWFpbn0pO1xuICAgIGRucy5yZXNvbHZlVHh0KGRvbWFpbiwgKGVyciwgcmVjb3JkcykgPT4ge1xuICAgIGNhbGxiYWNrKGVyciwgcmVjb3Jkcyk7XG4gIH0pO1xufVxuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQge2xvZ0Jsb2NrY2hhaW4sIGxvZ0NvbmZpcm0sIGxvZ0Vycm9yfSBmcm9tIFwiLi4vLi4vaW1wb3J0cy9zdGFydHVwL3NlcnZlci9sb2ctY29uZmlndXJhdGlvblwiO1xuXG5cbmNvbnN0IE5BTUVTUEFDRSA9ICdlLyc7XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFdpZihjbGllbnQsIGFkZHJlc3MpIHtcbiAgaWYoIWFkZHJlc3Mpe1xuICAgICAgICBhZGRyZXNzID0gZ2V0QWRkcmVzc2VzQnlBY2NvdW50KFwiXCIpWzBdO1xuICAgICAgICBsb2dCbG9ja2NoYWluKCdhZGRyZXNzIHdhcyBub3QgZGVmaW5lZCBzbyBnZXR0aW5nIHRoZSBmaXJzdCBleGlzdGluZyBvbmUgb2YgdGhlIHdhbGxldDonLGFkZHJlc3MpO1xuICB9XG4gIGlmKCFhZGRyZXNzKXtcbiAgICAgICAgYWRkcmVzcyA9IGdldE5ld0FkZHJlc3MoXCJcIik7XG4gICAgICAgIGxvZ0Jsb2NrY2hhaW4oJ2FkZHJlc3Mgd2FzIG5ldmVyIGRlZmluZWQgIGF0IGFsbCBnZW5lcmF0ZWQgbmV3IGFkZHJlc3MgZm9yIHRoaXMgd2FsbGV0OicsYWRkcmVzcyk7XG4gIH1cbiAgY29uc3Qgc3luY0Z1bmMgPSBNZXRlb3Iud3JhcEFzeW5jKGRvaWNoYWluX2R1bXBwcml2a2V5KTtcbiAgcmV0dXJuIHN5bmNGdW5jKGNsaWVudCwgYWRkcmVzcyk7XG59XG5cbmZ1bmN0aW9uIGRvaWNoYWluX2R1bXBwcml2a2V5KGNsaWVudCwgYWRkcmVzcywgY2FsbGJhY2spIHtcbiAgY29uc3Qgb3VyQWRkcmVzcyA9IGFkZHJlc3M7XG4gIGNsaWVudC5jbWQoJ2R1bXBwcml2a2V5Jywgb3VyQWRkcmVzcywgZnVuY3Rpb24oZXJyLCBkYXRhKSB7XG4gICAgaWYoZXJyKSAgbG9nRXJyb3IoJ2RvaWNoYWluX2R1bXBwcml2a2V5OicsZXJyKTtcbiAgICBjYWxsYmFjayhlcnIsIGRhdGEpO1xuICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEFkZHJlc3Nlc0J5QWNjb3VudChjbGllbnQsIGFjY291dCkge1xuICAgIGNvbnN0IHN5bmNGdW5jID0gTWV0ZW9yLndyYXBBc3luYyhkb2ljaGFpbl9nZXRhZGRyZXNzZXNieWFjY291bnQpO1xuICAgIHJldHVybiBzeW5jRnVuYyhjbGllbnQsIGFjY291dCk7XG59XG5cbmZ1bmN0aW9uIGRvaWNoYWluX2dldGFkZHJlc3Nlc2J5YWNjb3VudChjbGllbnQsIGFjY291bnQsIGNhbGxiYWNrKSB7XG4gICAgY29uc3Qgb3VyQWNjb3VudCA9IGFjY291bnQ7XG4gICAgY2xpZW50LmNtZCgnZ2V0YWRkcmVzc2VzYnlhY2NvdW50Jywgb3VyQWNjb3VudCwgZnVuY3Rpb24oZXJyLCBkYXRhKSB7XG4gICAgICAgIGlmKGVycikgIGxvZ0Vycm9yKCdnZXRhZGRyZXNzZXNieWFjY291bnQ6JyxlcnIpO1xuICAgICAgICBjYWxsYmFjayhlcnIsIGRhdGEpO1xuICAgIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0TmV3QWRkcmVzcyhjbGllbnQsIGFjY291dCkge1xuICAgIGNvbnN0IHN5bmNGdW5jID0gTWV0ZW9yLndyYXBBc3luYyhkb2ljaGFpbl9nZXRuZXdhZGRyZXNzKTtcbiAgICByZXR1cm4gc3luY0Z1bmMoY2xpZW50LCBhY2NvdXQpO1xufVxuZnVuY3Rpb24gZG9pY2hhaW5fZ2V0bmV3YWRkcmVzcyhjbGllbnQsIGFjY291bnQsIGNhbGxiYWNrKSB7XG4gICAgY29uc3Qgb3VyQWNjb3VudCA9IGFjY291bnQ7XG4gICAgY2xpZW50LmNtZCgnZ2V0bmV3YWRkcmVzc3MnLCBvdXJBY2NvdW50LCBmdW5jdGlvbihlcnIsIGRhdGEpIHtcbiAgICAgICAgaWYoZXJyKSAgbG9nRXJyb3IoJ2dldG5ld2FkZHJlc3NzOicsZXJyKTtcbiAgICAgICAgY2FsbGJhY2soZXJyLCBkYXRhKTtcbiAgICB9KTtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gc2lnbk1lc3NhZ2UoY2xpZW50LCBhZGRyZXNzLCBtZXNzYWdlKSB7XG4gICAgY29uc3Qgc3luY0Z1bmMgPSBNZXRlb3Iud3JhcEFzeW5jKGRvaWNoYWluX3NpZ25NZXNzYWdlKTtcbiAgICByZXR1cm4gc3luY0Z1bmMoY2xpZW50LCBhZGRyZXNzLCBtZXNzYWdlKTtcbn1cblxuZnVuY3Rpb24gZG9pY2hhaW5fc2lnbk1lc3NhZ2UoY2xpZW50LCBhZGRyZXNzLCBtZXNzYWdlLCBjYWxsYmFjaykge1xuICAgIGNvbnN0IG91ckFkZHJlc3MgPSBhZGRyZXNzO1xuICAgIGNvbnN0IG91ck1lc3NhZ2UgPSBtZXNzYWdlO1xuICAgIGNsaWVudC5jbWQoJ3NpZ25tZXNzYWdlJywgb3VyQWRkcmVzcywgb3VyTWVzc2FnZSwgZnVuY3Rpb24oZXJyLCBkYXRhKSB7XG4gICAgICAgIGNhbGxiYWNrKGVyciwgZGF0YSk7XG4gICAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBuYW1lU2hvdyhjbGllbnQsIGlkKSB7XG4gIGNvbnN0IHN5bmNGdW5jID0gTWV0ZW9yLndyYXBBc3luYyhkb2ljaGFpbl9uYW1lU2hvdyk7XG4gIHJldHVybiBzeW5jRnVuYyhjbGllbnQsIGlkKTtcbn1cblxuZnVuY3Rpb24gZG9pY2hhaW5fbmFtZVNob3coY2xpZW50LCBpZCwgY2FsbGJhY2spIHtcbiAgY29uc3Qgb3VySWQgPSBjaGVja0lkKGlkKTtcbiAgbG9nQ29uZmlybSgnZG9pY2hhaW4tY2xpIG5hbWVfc2hvdyA6JyxvdXJJZCk7XG4gIGNsaWVudC5jbWQoJ25hbWVfc2hvdycsIG91cklkLCBmdW5jdGlvbihlcnIsIGRhdGEpIHtcbiAgICBpZihlcnIgIT09IHVuZGVmaW5lZCAmJiBlcnIgIT09IG51bGwgJiYgZXJyLm1lc3NhZ2Uuc3RhcnRzV2l0aChcIm5hbWUgbm90IGZvdW5kXCIpKSB7XG4gICAgICBlcnIgPSB1bmRlZmluZWQsXG4gICAgICBkYXRhID0gdW5kZWZpbmVkXG4gICAgfVxuICAgIGNhbGxiYWNrKGVyciwgZGF0YSk7XG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZmVlRG9pKGNsaWVudCwgYWRkcmVzcykge1xuICAgIGNvbnN0IHN5bmNGdW5jID0gTWV0ZW9yLndyYXBBc3luYyhkb2ljaGFpbl9mZWVEb2kpO1xuICAgIHJldHVybiBzeW5jRnVuYyhjbGllbnQsIGFkZHJlc3MpO1xufVxuXG5mdW5jdGlvbiBkb2ljaGFpbl9mZWVEb2koY2xpZW50LCBhZGRyZXNzLCBjYWxsYmFjaykge1xuICAgIGNvbnN0IGRlc3RBZGRyZXNzID0gYWRkcmVzcztcbiAgICBjbGllbnQuY21kKCdzZW5kdG9hZGRyZXNzJywgZGVzdEFkZHJlc3MsICcwLjAyJywgZnVuY3Rpb24oZXJyLCBkYXRhKSB7XG4gICAgICAgIGNhbGxiYWNrKGVyciwgZGF0YSk7XG4gICAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBuYW1lRG9pKGNsaWVudCwgbmFtZSwgdmFsdWUsIGFkZHJlc3MpIHtcbiAgICBjb25zdCBzeW5jRnVuYyA9IE1ldGVvci53cmFwQXN5bmMoZG9pY2hhaW5fbmFtZURvaSk7XG4gICAgcmV0dXJuIHN5bmNGdW5jKGNsaWVudCwgbmFtZSwgdmFsdWUsIGFkZHJlc3MpO1xufVxuXG5mdW5jdGlvbiBkb2ljaGFpbl9uYW1lRG9pKGNsaWVudCwgbmFtZSwgdmFsdWUsIGFkZHJlc3MsIGNhbGxiYWNrKSB7XG4gICAgY29uc3Qgb3VyTmFtZSA9IGNoZWNrSWQobmFtZSk7XG4gICAgY29uc3Qgb3VyVmFsdWUgPSB2YWx1ZTtcbiAgICBjb25zdCBkZXN0QWRkcmVzcyA9IGFkZHJlc3M7XG4gICAgaWYoIWFkZHJlc3MpIHtcbiAgICAgICAgY2xpZW50LmNtZCgnbmFtZV9kb2knLCBvdXJOYW1lLCBvdXJWYWx1ZSwgZnVuY3Rpb24gKGVyciwgZGF0YSkge1xuICAgICAgICAgICAgY2FsbGJhY2soZXJyLCBkYXRhKTtcbiAgICAgICAgfSk7XG4gICAgfWVsc2V7XG4gICAgICAgIGNsaWVudC5jbWQoJ25hbWVfZG9pJywgb3VyTmFtZSwgb3VyVmFsdWUsIGRlc3RBZGRyZXNzLCBmdW5jdGlvbihlcnIsIGRhdGEpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKGVyciwgZGF0YSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxpc3RTaW5jZUJsb2NrKGNsaWVudCwgYmxvY2spIHtcbiAgICBjb25zdCBzeW5jRnVuYyA9IE1ldGVvci53cmFwQXN5bmMoZG9pY2hhaW5fbGlzdFNpbmNlQmxvY2spO1xuICAgIHZhciBvdXJCbG9jayA9IGJsb2NrO1xuICAgIGlmKG91ckJsb2NrID09PSB1bmRlZmluZWQpIG91ckJsb2NrID0gbnVsbDtcbiAgICByZXR1cm4gc3luY0Z1bmMoY2xpZW50LCBvdXJCbG9jayk7XG59XG5cbmZ1bmN0aW9uIGRvaWNoYWluX2xpc3RTaW5jZUJsb2NrKGNsaWVudCwgYmxvY2ssIGNhbGxiYWNrKSB7XG4gICAgdmFyIG91ckJsb2NrID0gYmxvY2s7XG4gICAgaWYob3VyQmxvY2sgPT09IG51bGwpIGNsaWVudC5jbWQoJ2xpc3RzaW5jZWJsb2NrJywgZnVuY3Rpb24oZXJyLCBkYXRhKSB7XG4gICAgICAgIGNhbGxiYWNrKGVyciwgZGF0YSk7XG4gICAgfSk7XG4gICAgZWxzZSBjbGllbnQuY21kKCdsaXN0c2luY2VibG9jaycsIG91ckJsb2NrLCBmdW5jdGlvbihlcnIsIGRhdGEpIHtcbiAgICAgICAgY2FsbGJhY2soZXJyLCBkYXRhKTtcbiAgICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFRyYW5zYWN0aW9uKGNsaWVudCwgdHhpZCkge1xuICAgIGNvbnN0IHN5bmNGdW5jID0gTWV0ZW9yLndyYXBBc3luYyhkb2ljaGFpbl9nZXR0cmFuc2FjdGlvbik7XG4gICAgcmV0dXJuIHN5bmNGdW5jKGNsaWVudCwgdHhpZCk7XG59XG5cbmZ1bmN0aW9uIGRvaWNoYWluX2dldHRyYW5zYWN0aW9uKGNsaWVudCwgdHhpZCwgY2FsbGJhY2spIHtcbiAgICBsb2dDb25maXJtKCdkb2ljaGFpbl9nZXR0cmFuc2FjdGlvbjonLHR4aWQpO1xuICAgIGNsaWVudC5jbWQoJ2dldHRyYW5zYWN0aW9uJywgdHhpZCwgZnVuY3Rpb24oZXJyLCBkYXRhKSB7XG4gICAgICAgIGlmKGVycikgIGxvZ0Vycm9yKCdkb2ljaGFpbl9nZXR0cmFuc2FjdGlvbjonLGVycik7XG4gICAgICAgIGNhbGxiYWNrKGVyciwgZGF0YSk7XG4gICAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRSYXdUcmFuc2FjdGlvbihjbGllbnQsIHR4aWQpIHtcbiAgICBjb25zdCBzeW5jRnVuYyA9IE1ldGVvci53cmFwQXN5bmMoZG9pY2hhaW5fZ2V0cmF3dHJhbnNhY3Rpb24pO1xuICAgIHJldHVybiBzeW5jRnVuYyhjbGllbnQsIHR4aWQpO1xufVxuXG5mdW5jdGlvbiBkb2ljaGFpbl9nZXRyYXd0cmFuc2FjdGlvbihjbGllbnQsIHR4aWQsIGNhbGxiYWNrKSB7XG4gICAgbG9nQmxvY2tjaGFpbignZG9pY2hhaW5fZ2V0cmF3dHJhbnNhY3Rpb246Jyx0eGlkKTtcbiAgICBjbGllbnQuY21kKCdnZXRyYXd0cmFuc2FjdGlvbicsIHR4aWQsIDEsIGZ1bmN0aW9uKGVyciwgZGF0YSkge1xuICAgICAgICBpZihlcnIpICBsb2dFcnJvcignZG9pY2hhaW5fZ2V0cmF3dHJhbnNhY3Rpb246JyxlcnIpO1xuICAgICAgICBjYWxsYmFjayhlcnIsIGRhdGEpO1xuICAgIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0QmFsYW5jZShjbGllbnQpIHtcbiAgICBjb25zdCBzeW5jRnVuYyA9IE1ldGVvci53cmFwQXN5bmMoZG9pY2hhaW5fZ2V0YmFsYW5jZSk7XG4gICAgcmV0dXJuIHN5bmNGdW5jKGNsaWVudCk7XG59XG5cbmZ1bmN0aW9uIGRvaWNoYWluX2dldGJhbGFuY2UoY2xpZW50LCBjYWxsYmFjaykge1xuICAgIGNsaWVudC5jbWQoJ2dldGJhbGFuY2UnLCBmdW5jdGlvbihlcnIsIGRhdGEpIHtcbiAgICAgICAgaWYoZXJyKSB7IGxvZ0Vycm9yKCdkb2ljaGFpbl9nZXRiYWxhbmNlOicsZXJyKTt9XG4gICAgICAgIGNhbGxiYWNrKGVyciwgZGF0YSk7XG4gICAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRJbmZvKGNsaWVudCkge1xuICAgIGNvbnN0IHN5bmNGdW5jID0gTWV0ZW9yLndyYXBBc3luYyhkb2ljaGFpbl9nZXRpbmZvKTtcbiAgICByZXR1cm4gc3luY0Z1bmMoY2xpZW50KTtcbn1cblxuZnVuY3Rpb24gZG9pY2hhaW5fZ2V0aW5mbyhjbGllbnQsIGNhbGxiYWNrKSB7XG4gICAgY2xpZW50LmNtZCgnZ2V0YmxvY2tjaGFpbmluZm8nLCBmdW5jdGlvbihlcnIsIGRhdGEpIHtcbiAgICAgICAgaWYoZXJyKSB7IGxvZ0Vycm9yKCdkb2ljaGFpbi1nZXRpbmZvOicsZXJyKTt9XG4gICAgICAgIGNhbGxiYWNrKGVyciwgZGF0YSk7XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIGNoZWNrSWQoaWQpIHtcbiAgICBjb25zdCBET0lfUFJFRklYID0gXCJkb2k6IFwiO1xuICAgIGxldCByZXRfdmFsID0gaWQ7IC8vZGVmYXVsdCB2YWx1ZVxuXG4gICAgaWYoaWQuc3RhcnRzV2l0aChET0lfUFJFRklYKSkgcmV0X3ZhbCA9IGlkLnN1YnN0cmluZyhET0lfUFJFRklYLmxlbmd0aCk7IC8vaW4gY2FzZSBpdCBzdGFydHMgd2l0aCBkb2k6IGN1dCAgdGhpcyBhd2F5XG4gICAgaWYoIWlkLnN0YXJ0c1dpdGgoTkFNRVNQQUNFKSkgcmV0X3ZhbCA9IE5BTUVTUEFDRStpZDsgLy9pbiBjYXNlIGl0IGRvZXNuJ3Qgc3RhcnQgd2l0aCBlLyBwdXQgaXQgaW4gZnJvbnQgbm93LlxuICByZXR1cm4gcmV0X3ZhbDtcbn1cbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IHsgSFRUUCB9IGZyb20gJ21ldGVvci9odHRwJ1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0SHR0cEdFVCh1cmwsIHF1ZXJ5KSB7XG4gIGNvbnN0IHN5bmNGdW5jID0gTWV0ZW9yLndyYXBBc3luYyhfZ2V0KTtcbiAgcmV0dXJuIHN5bmNGdW5jKHVybCwgcXVlcnkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0SHR0cEdFVGRhdGEodXJsLCBkYXRhKSB7XG4gICAgY29uc3Qgc3luY0Z1bmMgPSBNZXRlb3Iud3JhcEFzeW5jKF9nZXREYXRhKTtcbiAgICByZXR1cm4gc3luY0Z1bmModXJsLCBkYXRhKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEh0dHBQT1NUKHVybCwgZGF0YSkge1xuICAgIGNvbnN0IHN5bmNGdW5jID0gTWV0ZW9yLndyYXBBc3luYyhfcG9zdCk7XG4gICAgcmV0dXJuIHN5bmNGdW5jKHVybCwgZGF0YSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRIdHRwUFVUKHVybCwgZGF0YSkge1xuICAgIGNvbnN0IHN5bmNGdW5jID0gTWV0ZW9yLndyYXBBc3luYyhfcHV0KTtcbiAgICByZXR1cm4gc3luY0Z1bmModXJsLCBkYXRhKTtcbn1cblxuZnVuY3Rpb24gX2dldCh1cmwsIHF1ZXJ5LCBjYWxsYmFjaykge1xuICBjb25zdCBvdXJVcmwgPSB1cmw7XG4gIGNvbnN0IG91clF1ZXJ5ID0gcXVlcnk7XG4gIEhUVFAuZ2V0KG91clVybCwge3F1ZXJ5OiBvdXJRdWVyeX0sIGZ1bmN0aW9uKGVyciwgcmV0KSB7XG4gICAgY2FsbGJhY2soZXJyLCByZXQpO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gX2dldERhdGEodXJsLCBkYXRhLCBjYWxsYmFjaykge1xuICAgIGNvbnN0IG91clVybCA9IHVybDtcbiAgICBjb25zdCBvdXJEYXRhID0gZGF0YTtcbiAgICBIVFRQLmdldChvdXJVcmwsIG91ckRhdGEsIGZ1bmN0aW9uKGVyciwgcmV0KSB7XG4gICAgICAgIGNhbGxiYWNrKGVyciwgcmV0KTtcbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gX3Bvc3QodXJsLCBkYXRhLCBjYWxsYmFjaykge1xuICAgIGNvbnN0IG91clVybCA9IHVybDtcbiAgICBjb25zdCBvdXJEYXRhID0gIGRhdGE7XG5cbiAgICBIVFRQLnBvc3Qob3VyVXJsLCBvdXJEYXRhLCBmdW5jdGlvbihlcnIsIHJldCkge1xuICAgICAgICBjYWxsYmFjayhlcnIsIHJldCk7XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIF9wdXQodXJsLCB1cGRhdGVEYXRhLCBjYWxsYmFjaykge1xuICAgIGNvbnN0IG91clVybCA9IHVybDtcbiAgICBjb25zdCBvdXJEYXRhID0ge1xuICAgICAgICBkYXRhOiB1cGRhdGVEYXRhXG4gICAgfVxuXG4gICAgSFRUUC5wdXQob3VyVXJsLCBvdXJEYXRhLCBmdW5jdGlvbihlcnIsIHJldCkge1xuICAgICAgY2FsbGJhY2soZXJyLCByZXQpO1xuICAgIH0pO1xufVxuIiwiaW1wb3J0ICcuL21haWxfam9icy5qcyc7XG5pbXBvcnQgJy4vZG9pY2hhaW4uanMnO1xuaW1wb3J0ICcuL2Jsb2NrY2hhaW5fam9icy5qcyc7XG5pbXBvcnQgJy4vZGFwcF9qb2JzLmpzJztcbmltcG9ydCAnLi9kbnMuanMnO1xuaW1wb3J0ICcuL3Jlc3QvcmVzdC5qcyc7XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCB7IEpvYkNvbGxlY3Rpb24sIEpvYiB9IGZyb20gJ21ldGVvci92c2l2c2k6am9iLWNvbGxlY3Rpb24nO1xuZXhwb3J0IGNvbnN0IE1haWxKb2JzID0gSm9iQ29sbGVjdGlvbignZW1haWxzJyk7XG5pbXBvcnQgc2VuZE1haWwgZnJvbSAnLi4vLi4vaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9lbWFpbHMvc2VuZC5qcyc7XG5pbXBvcnQge2xvZ01haW59IGZyb20gXCIuLi8uLi9pbXBvcnRzL3N0YXJ0dXAvc2VydmVyL2xvZy1jb25maWd1cmF0aW9uXCI7XG5pbXBvcnQge0Jsb2NrY2hhaW5Kb2JzfSBmcm9tIFwiLi9ibG9ja2NoYWluX2pvYnNcIjtcblxuXG5cbk1haWxKb2JzLnByb2Nlc3NKb2JzKCdzZW5kJywgZnVuY3Rpb24gKGpvYiwgY2IpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCBlbWFpbCA9IGpvYi5kYXRhO1xuICAgIHNlbmRNYWlsKGVtYWlsKTtcbiAgICBqb2IuZG9uZSgpO1xuICB9IGNhdGNoKGV4Y2VwdGlvbikge1xuICAgIGpvYi5mYWlsKCk7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignam9icy5tYWlsLnNlbmQuZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgfSBmaW5hbGx5IHtcbiAgICBjYigpO1xuICB9XG59KTtcblxuXG5uZXcgSm9iKE1haWxKb2JzLCAnY2xlYW51cCcsIHt9KVxuICAgIC5yZXBlYXQoeyBzY2hlZHVsZTogTWFpbEpvYnMubGF0ZXIucGFyc2UudGV4dChcImV2ZXJ5IDUgbWludXRlc1wiKSB9KVxuICAgIC5zYXZlKHtjYW5jZWxSZXBlYXRzOiB0cnVlfSlcblxubGV0IHEgPSBNYWlsSm9icy5wcm9jZXNzSm9icygnY2xlYW51cCcseyBwb2xsSW50ZXJ2YWw6IGZhbHNlLCB3b3JrVGltZW91dDogNjAqMTAwMCB9ICxmdW5jdGlvbiAoam9iLCBjYikge1xuICAgIGNvbnN0IGN1cnJlbnQgPSBuZXcgRGF0ZSgpXG4gICAgY3VycmVudC5zZXRNaW51dGVzKGN1cnJlbnQuZ2V0TWludXRlcygpIC0gNSk7XG5cbiAgICBjb25zdCBpZHMgPSBNYWlsSm9icy5maW5kKHtcbiAgICAgICAgICAgIHN0YXR1czogeyRpbjogSm9iLmpvYlN0YXR1c1JlbW92YWJsZX0sXG4gICAgICAgICAgICB1cGRhdGVkOiB7JGx0OiBjdXJyZW50fX0sXG4gICAgICAgIHtmaWVsZHM6IHsgX2lkOiAxIH19KTtcblxuICAgIGxvZ01haW4oJ2ZvdW5kICByZW1vdmFibGUgYmxvY2tjaGFpbiBqb2JzOicsaWRzKTtcbiAgICBNYWlsSm9icy5yZW1vdmVKb2JzKGlkcyk7XG4gICAgaWYoaWRzLmxlbmd0aCA+IDApe1xuICAgICAgICBqb2IuZG9uZShcIlJlbW92ZWQgI3tpZHMubGVuZ3RofSBvbGQgam9ic1wiKTtcbiAgICB9XG4gICAgY2IoKTtcbn0pO1xuXG5NYWlsSm9icy5maW5kKHsgdHlwZTogJ2pvYlR5cGUnLCBzdGF0dXM6ICdyZWFkeScgfSlcbiAgICAub2JzZXJ2ZSh7XG4gICAgICAgIGFkZGVkOiBmdW5jdGlvbiAoKSB7IHEudHJpZ2dlcigpOyB9XG4gICAgfSk7XG5cbiIsImltcG9ydCAnL2ltcG9ydHMvc3RhcnR1cC9zZXJ2ZXInO1xuaW1wb3J0ICcuL2FwaS9pbmRleC5qcyc7XG4iXX0=
