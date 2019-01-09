var require = meteorInstall({"imports":{"api":{"opt-ins":{"server":{"publications.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/api/opt-ins/server/publications.js                                                                          //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"methods.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/api/opt-ins/methods.js                                                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"opt-ins.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/api/opt-ins/opt-ins.js                                                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"recipients":{"server":{"publications.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/api/recipients/server/publications.js                                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"recipients.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/api/recipients/recipients.js                                                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"doichain":{"entries.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/api/doichain/entries.js                                                                                     //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"methods.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/api/doichain/methods.js                                                                                     //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"languages":{"methods.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/api/languages/methods.js                                                                                    //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"meta":{"meta.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/api/meta/meta.js                                                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"senders":{"senders.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/api/senders/senders.js                                                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"version":{"publications.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/api/version/publications.js                                                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},"modules":{"server":{"dapps":{"export_dois.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/modules/server/dapps/export_dois.js                                                                         //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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

    pipeline = [...pipeline, {
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
        _id: 1,
        ownerId: 1,
        createdAt: 1,
        confirmedAt: 1,
        nameId: 1,
        'SenderEmail.email': 1,
        'RecipientEmail.email': 1
      }
    }]; //if(ourData.status==1) query = {"confirmedAt": { $exists: true, $ne: null }}

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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"fetch_doi-mail-data.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/modules/server/dapps/fetch_doi-mail-data.js                                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"get_doi-mail-data.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/modules/server/dapps/get_doi-mail-data.js                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"dns":{"get_opt-in-key.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/modules/server/dns/get_opt-in-key.js                                                                        //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"get_opt-in-provider.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/modules/server/dns/get_opt-in-provider.js                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"doichain":{"add_entry_and_fetch_data.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/modules/server/doichain/add_entry_and_fetch_data.js                                                         //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"check_new_transactions.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/modules/server/doichain/check_new_transactions.js                                                           //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"decrypt_message.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/modules/server/doichain/decrypt_message.js                                                                  //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"encrypt_message.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/modules/server/doichain/encrypt_message.js                                                                  //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"generate_name-id.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/modules/server/doichain/generate_name-id.js                                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"get_address.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/modules/server/doichain/get_address.js                                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"get_balance.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/modules/server/doichain/get_balance.js                                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"get_data-hash.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/modules/server/doichain/get_data-hash.js                                                                    //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"get_key-pair.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/modules/server/doichain/get_key-pair.js                                                                     //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"get_private-key_from_wif.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/modules/server/doichain/get_private-key_from_wif.js                                                         //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"get_publickey_and_address_by_domain.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/modules/server/doichain/get_publickey_and_address_by_domain.js                                              //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"get_signature.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/modules/server/doichain/get_signature.js                                                                    //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"insert.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/modules/server/doichain/insert.js                                                                           //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"update.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/modules/server/doichain/update.js                                                                           //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"verify_signature.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/modules/server/doichain/verify_signature.js                                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"write_to_blockchain.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/modules/server/doichain/write_to_blockchain.js                                                              //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"emails":{"decode_doi-hash.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/modules/server/emails/decode_doi-hash.js                                                                    //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"generate_doi-hash.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/modules/server/emails/generate_doi-hash.js                                                                  //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"parse_template.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/modules/server/emails/parse_template.js                                                                     //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"send.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/modules/server/emails/send.js                                                                               //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"jobs":{"add_check_new_transactions.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/modules/server/jobs/add_check_new_transactions.js                                                           //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"add_fetch-doi-mail-data.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/modules/server/jobs/add_fetch-doi-mail-data.js                                                              //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"add_insert_blockchain.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/modules/server/jobs/add_insert_blockchain.js                                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"add_send_mail.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/modules/server/jobs/add_send_mail.js                                                                        //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"add_update_blockchain.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/modules/server/jobs/add_update_blockchain.js                                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"languages":{"get.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/modules/server/languages/get.js                                                                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"meta":{"addOrUpdate.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/modules/server/meta/addOrUpdate.js                                                                          //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"opt-ins":{"add.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/modules/server/opt-ins/add.js                                                                               //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"add_and_write_to_blockchain.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/modules/server/opt-ins/add_and_write_to_blockchain.js                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"confirm.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/modules/server/opt-ins/confirm.js                                                                           //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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

    if (optIn.confirmationToken === decoded.token && optIn.confirmedAt != undefined) {
      // Opt-In was already confirmed on email click
      logConfirm("OptIn already confirmed: ", optIn);
      return decoded.redirect;
    }

    const confirmedAt = new Date(); //TODO after confirmation we deleted the confonfirmationtoken, now we keep it. can this be a security problem?

    OptIns.update({
      _id: optIn._id
    }, {
      $set: {
        confirmedAt: confirmedAt,
        confirmedBy: ourRequest.host
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"generate_doi-token.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/modules/server/opt-ins/generate_doi-token.js                                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"update_status.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/modules/server/opt-ins/update_status.js                                                                     //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"verify.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/modules/server/opt-ins/verify.js                                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
    if (entry === undefined) return {
      nameIdFound: "failed"
    };
    const entryData = JSON.parse(entry.value);
    const firstCheck = verifySignature({
      data: ourData.recipient_mail + ourData.sender_mail,
      signature: entryData.signature,
      publicKey: ourData.recipient_public_key
    });
    if (!firstCheck) return {
      soiSignatureStatus: "failed"
    };
    const parts = ourData.recipient_mail.split("@"); //TODO put this into getPublicKeyAndAddress

    const domain = parts[parts.length - 1];
    const publicKeyAndAddress = getPublicKeyAndAddress({
      domain: domain
    });
    if (!entryData.signature || !entryData.doiSignature) return {
      doiSignatureStatus: "missing"
    };
    const secondCheck = verifySignature({
      data: entryData.signature,
      signature: entryData.doiSignature,
      publicKey: publicKeyAndAddress.publicKey
    });
    if (!secondCheck) return {
      doiSignatureStatus: "failed"
    };
    return true;
  } catch (exception) {
    throw new Meteor.Error('opt-ins.verify.exception', exception);
  }
};

module.exportDefault(verifyOptIn);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"recipients":{"add.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/modules/server/recipients/add.js                                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"senders":{"add.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/modules/server/senders/add.js                                                                               //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}},"startup":{"server":{"dapp-configuration.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/startup/server/dapp-configuration.js                                                                        //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"dns-configuration.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/startup/server/dns-configuration.js                                                                         //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  FALLBACK_PROVIDER: () => FALLBACK_PROVIDER
});
const FALLBACK_PROVIDER = "doichain.org";
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"doichain-configuration.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/startup/server/doichain-configuration.js                                                                    //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"email-configuration.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/startup/server/email-configuration.js                                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"fixtures.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/startup/server/fixtures.js                                                                                  //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"index.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/startup/server/index.js                                                                                     //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"jobs.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/startup/server/jobs.js                                                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"log-configuration.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/startup/server/log-configuration.js                                                                         //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"register-api.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/startup/server/register-api.js                                                                              //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.link("../../api/languages/methods.js");
module.link("../../api/doichain/methods.js");
module.link("../../api/recipients/server/publications.js");
module.link("../../api/opt-ins/methods.js");
module.link("../../api/version/publications.js");
module.link("../../api/opt-ins/server/publications.js");
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"security.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/startup/server/security.js                                                                                  //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"type-configuration.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/startup/server/type-configuration.js                                                                        //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"useraccounts-configuration.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// imports/startup/server/useraccounts-configuration.js                                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}},"server":{"api":{"rest":{"imports":{"confirm.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/api/rest/imports/confirm.js                                                                                  //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"debug.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/api/rest/imports/debug.js                                                                                    //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"send.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/api/rest/imports/send.js                                                                                     //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"status.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/api/rest/imports/status.js                                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"user.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/api/rest/imports/user.js                                                                                     //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"verify.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/api/rest/imports/verify.js                                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"rest.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/api/rest/rest.js                                                                                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"blockchain_jobs.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/api/blockchain_jobs.js                                                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"dapp_jobs.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/api/dapp_jobs.js                                                                                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"dns.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/api/dns.js                                                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"doichain.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/api/doichain.js                                                                                              //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"http.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/api/http.js                                                                                                  //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"index.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/api/index.js                                                                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.link("./mail_jobs.js");
module.link("./doichain.js");
module.link("./blockchain_jobs.js");
module.link("./dapp_jobs.js");
module.link("./dns.js");
module.link("./rest/rest.js");
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"mail_jobs.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/api/mail_jobs.js                                                                                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"test":{"test-api":{"test-api-on-dapp.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/test/test-api/test-api-on-dapp.js                                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  login: () => login,
  requestDOI: () => requestDOI,
  getNameIdOfRawTransaction: () => getNameIdOfRawTransaction,
  getNameIdOfOptInFromRawTx: () => getNameIdOfOptInFromRawTx,
  fetchConfirmLinkFromPop3Mail: () => fetchConfirmLinkFromPop3Mail,
  deleteAllEmailsFromPop3: () => deleteAllEmailsFromPop3,
  confirmLink: () => confirmLink,
  verifyDOI: () => verifyDOI,
  createUser: () => createUser,
  findUser: () => findUser,
  findOptIn: () => findOptIn,
  exportOptIns: () => exportOptIns,
  requestConfirmVerifyBasicDoi: () => requestConfirmVerifyBasicDoi,
  updateUser: () => updateUser,
  resetUsers: () => resetUsers
});
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let chai;
module.link("meteor/practicalmeteor:chai", {
  chai(v) {
    chai = v;
  }

}, 1);
let quotedPrintableDecode;
module.link("emailjs-mime-codec", {
  quotedPrintableDecode(v) {
    quotedPrintableDecode = v;
  }

}, 2);
let OptIns;
module.link("../../../imports/api/opt-ins/opt-ins", {
  OptIns(v) {
    OptIns = v;
  }

}, 3);
let Recipients;
module.link("../../../imports/api/recipients/recipients", {
  Recipients(v) {
    Recipients = v;
  }

}, 4);
let getHttpGET, getHttpGETdata, getHttpPOST;
module.link("../../../server/api/http", {
  getHttpGET(v) {
    getHttpGET = v;
  },

  getHttpGETdata(v) {
    getHttpGETdata = v;
  },

  getHttpPOST(v) {
    getHttpPOST = v;
  }

}, 5);
let testLogging;
module.link("../../../imports/startup/server/log-configuration", {
  testLogging(v) {
    testLogging = v;
  }

}, 6);
let generatetoaddress;
module.link("./test-api-on-node", {
  generatetoaddress(v) {
    generatetoaddress = v;
  }

}, 7);
const headers = {
  'Content-Type': 'text/plain'
};

const os = require('os');

var POP3Client = require("poplib");

function login(url, paramsLogin, log) {
  if (log) testLogging('dApp login.');
  const urlLogin = url + '/api/v1/login';
  const headersLogin = [{
    'Content-Type': 'application/json'
  }];
  const realDataLogin = {
    params: paramsLogin,
    headers: headersLogin
  };
  const result = getHttpPOST(urlLogin, realDataLogin);
  if (log) testLogging('result login:', result);
  const statusCode = result.statusCode;
  const dataLogin = result.data;
  const statusLogin = dataLogin.status;
  chai.assert.equal(200, statusCode);
  chai.assert.equal('success', statusLogin);
  return dataLogin.data;
}

function requestDOI(url, auth, recipient_mail, sender_mail, data, log) {
  if (log) testLogging('step 1 - requestDOI called via REST');
  const urlOptIn = url + '/api/v1/opt-in';
  let dataOptIn = {};

  if (data) {
    dataOptIn = {
      "recipient_mail": recipient_mail,
      "sender_mail": sender_mail,
      "data": JSON.stringify(data)
    };
  } else {
    dataOptIn = {
      "recipient_mail": recipient_mail,
      "sender_mail": sender_mail
    };
  }

  const headersOptIn = {
    'Content-Type': 'application/json',
    'X-User-Id': auth.userId,
    'X-Auth-Token': auth.authToken
  };
  const realDataOptIn = {
    data: dataOptIn,
    headers: headersOptIn
  };
  const resultOptIn = getHttpPOST(urlOptIn, realDataOptIn); //logBlockchain("resultOptIn",resultOptIn);

  chai.assert.equal(200, resultOptIn.statusCode);
  testLogging("RETURNED VALUES: ", resultOptIn);

  if (Array.isArray(resultOptIn.data)) {
    testLogging('adding coDOIs');
    resultOptIn.data.forEach(element => {
      chai.assert.equal('success', element.status);
    });
  } else {
    testLogging('adding DOI');
    chai.assert.equal('success', resultOptIn.data.status);
  }

  return resultOptIn.data;
}

function getNameIdOfRawTransaction(url, auth, txId) {
  testLogging('pre-start of getNameIdOfRawTransaction', txId);
  const syncFunc = Meteor.wrapAsync(get_nameid_of_raw_transaction);
  return syncFunc(url, auth, txId);
}

function get_nameid_of_raw_transaction(url, auth, txId, callback) {
  let nameId = '';
  let running = true;
  let counter = 0;
  testLogging('start getNameIdOfRawTransaction', txId);

  (function loop() {
    return Promise.asyncApply(() => {
      while (running && ++counter < 1500) {
        //trying 50x to get email from bobs mailbox
        try {
          testLogging('trying to get transaction', txId);
          const dataGetRawTransaction = {
            "jsonrpc": "1.0",
            "id": "getrawtransaction",
            "method": "getrawtransaction",
            "params": [txId, 1]
          };
          const realdataGetRawTransaction = {
            auth: auth,
            data: dataGetRawTransaction,
            headers: headers
          };
          const resultGetRawTransaction = getHttpPOST(url, realdataGetRawTransaction);

          if (resultGetRawTransaction.data.result.vout[1].scriptPubKey.nameOp !== undefined) {
            nameId = resultGetRawTransaction.data.result.vout[1].scriptPubKey.nameOp.name;
          } else {
            nameId = resultGetRawTransaction.data.result.vout[0].scriptPubKey.nameOp.name;
          }

          if (resultGetRawTransaction.data.result.txid !== undefined) {
            testLogging('confirmed txid:' + resultGetRawTransaction.data.result.txid);
            running = false;
          } //chai.assert.equal(txId, resultGetRawTransaction.data.result.txid);

        } catch (ex) {
          testLogging('trying to get email - so far no success:', counter);
          Promise.await(new Promise(resolve => setTimeout(resolve, 2000)));
        }
      }

      testLogging('end of getNameIdOfRawTransaction returning nameId', nameId);
      callback(null, nameId);
    });
  })();
}

function getNameIdOfOptInFromRawTx(url, auth, optInId, log) {
  const syncFunc = Meteor.wrapAsync(get_nameid_of_optin_from_rawtx);
  return syncFunc(url, auth, optInId, log);
}

function get_nameid_of_optin_from_rawtx(url, auth, optInId, log, callback) {
  return Promise.asyncApply(() => {
    testLogging('step 2 - getting nameId of raw transaction from blockchain');
    if (log) testLogging('the txId will be added a bit later as soon as the schedule picks up the job and inserts it into the blockchain. it does not happen immediately. waiting...');
    let running = true;
    let counter = 0;
    let our_optIn = null;
    let nameId = null;
    Promise.await(function loop() {
      return Promise.asyncApply(() => {
        while (running && ++counter < 50) {
          //trying 50x to get opt-in
          testLogging('find opt-In', optInId);
          our_optIn = OptIns.findOne({
            _id: optInId
          });

          if (our_optIn.txId !== undefined) {
            testLogging('found txId of opt-In', our_optIn.txId);
            running = false;
          } else {
            testLogging('did not find txId yet for opt-In-Id', our_optIn._id);
          }

          Promise.await(new Promise(resolve => setTimeout(resolve, 3000)));
        }
      });
    }());

    try {
      chai.assert.equal(our_optIn._id, optInId);
      if (log) testLogging('optIn:', our_optIn);
      nameId = getNameIdOfRawTransaction(url, auth, our_optIn.txId);
      chai.assert.equal("e/" + our_optIn.nameId, nameId);
      if (log) testLogging('nameId:', nameId);
      chai.assert.notEqual(nameId, null);
      chai.assert.isBelow(counter, 50, "OptIn not found after retries");
      callback(null, nameId);
    } catch (error) {
      callback(error, nameId);
    }
  });
}

function fetchConfirmLinkFromPop3Mail(hostname, port, username, password, alicedapp_url, log) {
  const syncFunc = Meteor.wrapAsync(fetch_confirm_link_from_pop3_mail);
  return syncFunc(hostname, port, username, password, alicedapp_url, log);
}

function fetch_confirm_link_from_pop3_mail(hostname, port, username, password, alicedapp_url, log, callback) {
  testLogging("step 3 - getting email from bobs inbox"); //https://github.com/ditesh/node-poplib/blob/master/demos/retrieve-all.js

  var client = new POP3Client(port, hostname, {
    tlserrs: false,
    enabletls: false,
    debug: false
  });
  client.on("connect", function () {
    testLogging("CONNECT success");
    client.login(username, password);
    client.on("login", function (status, rawdata) {
      if (status) {
        testLogging("LOGIN/PASS success");
        client.list();
        client.on("list", function (status, msgcount, msgnumber, data, rawdata) {
          if (status === false) {
            const err = "LIST failed" + msgnumber;
            client.rset();
            callback(err, null);
            return;
          } else {
            if (log) testLogging("LIST success with " + msgcount + " element(s)", ''); //chai.expect(msgcount).to.be.above(0, 'no email in bobs inbox');

            if (msgcount > 0) {
              client.retr(1);
              client.on("retr", function (status, msgnumber, maildata, rawdata) {
                if (status === true) {
                  if (log) testLogging("RETR success " + msgnumber); //https://github.com/emailjs/emailjs-mime-codec

                  let html = quotedPrintableDecode(maildata);

                  if (os.hostname() !== 'regtest') {
                    //this is probably a selenium test from outside docker  - so replace URL so it can be confirmed
                    html = replaceAll(html, 'http://172.20.0.8', 'http://localhost'); //TODO put this IP inside a config
                  }

                  chai.expect(html.indexOf(alicedapp_url)).to.not.equal(-1);
                  const linkdata = html.substring(html.indexOf(alicedapp_url), html.indexOf("'", html.indexOf(alicedapp_url)));
                  chai.expect(linkdata).to.not.be.null;
                  if (log && !(log === true)) chai.expect(html.indexOf(log)).to.not.equal(-1);
                  const requestData = {
                    "linkdata": linkdata,
                    "html": html
                  };
                  client.dele(msgnumber);
                  client.on("dele", function (status, msgnumber, data, rawdata) {
                    client.quit();
                    client.end();
                    client = null;
                    callback(null, linkdata);
                  });
                } else {
                  const err = "RETR failed for msgnumber " + msgnumber;
                  client.rset();
                  client.end();
                  client = null;
                  callback(err, null);
                  return;
                }
              });
            } else {
              const err = "empty mailbox";
              callback(err, null);
              client.quit();
              client.end();
              client = null;
              return;
            }
          }
        });
      } else {
        const err = "LOGIN/PASS failed";
        callback(err, null);
        client.quit();
        client.end();
        client = null;
        return;
      }
    });
  });
}

function replaceAll(str, find, replace) {
  return str.replace(new RegExp(find, 'g'), replace);
}

function deleteAllEmailsFromPop3(hostname, port, username, password, log) {
  const syncFunc = Meteor.wrapAsync(delete_all_emails_from_pop3);
  return syncFunc(hostname, port, username, password, log);
}

function delete_all_emails_from_pop3(hostname, port, username, password, log, callback) {
  testLogging("deleting all emails from bobs inbox"); //https://github.com/ditesh/node-poplib/blob/master/demos/retrieve-all.js

  var client = new POP3Client(port, hostname, {
    tlserrs: false,
    enabletls: false,
    debug: false
  });
  client.on("connect", function () {
    testLogging("CONNECT success");
    client.login(username, password);
    client.on("login", function (status, rawdata) {
      if (status) {
        testLogging("LOGIN/PASS success");
        client.list();
        client.on("list", function (status, msgcount, msgnumber, data, rawdata) {
          if (status === false) {
            const err = "LIST failed" + msgnumber;
            client.rset();
            callback(err, null);
            return;
          } else {
            if (log) testLogging("LIST success with " + msgcount + " element(s)", ''); //chai.expect(msgcount).to.be.above(0, 'no email in bobs inbox');

            if (msgcount > 0) {
              for (let i = 0; i <= msgcount; i++) {
                client.dele(i + 1);
                client.on("dele", function (status, msgnumber, data, rawdata) {
                  testLogging("deleted email" + (i + 1) + " status:" + status);

                  if (i == msgcount - 1) {
                    client.quit();
                    client.end();
                    client = null;
                    if (log) testLogging("all emails deleted");
                    callback(null, 'all emails deleted');
                  }
                });
              }
            } else {
              const err = "empty mailbox";
              callback(null, err); //we do not send an error here when inbox is empty

              client.quit();
              client.end();
              client = null;
              return;
            }
          }
        });
      } else {
        const err = "LOGIN/PASS failed";
        callback(err, null);
        client.quit();
        client.end();
        client = null;
        return;
      }
    });
  });
}

function confirmLink(confirmLink) {
  const syncFunc = Meteor.wrapAsync(confirm_link);
  return syncFunc(confirmLink);
}

function confirm_link(confirmLink, callback) {
  testLogging("clickable link:", confirmLink);
  const doiConfirmlinkResult = getHttpGET(confirmLink, '');

  try {
    chai.expect(doiConfirmlinkResult.content).to.have.string('ANMELDUNG ERFOLGREICH');
    chai.expect(doiConfirmlinkResult.content).to.have.string('Vielen Dank für Ihre Anmeldung');
    chai.expect(doiConfirmlinkResult.content).to.have.string('Ihre Anmeldung war erfolgreich.');
    chai.assert.equal(200, doiConfirmlinkResult.statusCode);
    callback(null, true);
  } catch (e) {
    callback(e, null);
  }
}

function verifyDOI(dAppUrl, dAppUrlAuth, node_url_alice, rpcAuthAlice, sender_mail, recipient_mail, nameId, log) {
  const syncFunc = Meteor.wrapAsync(verify_doi);
  return syncFunc(dAppUrl, dAppUrlAuth, node_url_alice, rpcAuthAlice, sender_mail, recipient_mail, nameId, log);
}

function verify_doi(dAppUrl, dAppUrlAuth, node_url_alice, rpcAuthAlice, sender_mail, recipient_mail, nameId, log, callback) {
  return Promise.asyncApply(() => {
    let our_recipient_mail = recipient_mail;

    if (Array.isArray(recipient_mail)) {
      our_recipient_mail = recipient_mail[0];
    }

    const urlVerify = dAppUrl + '/api/v1/opt-in/verify';
    const recipient_public_key = Recipients.findOne({
      email: our_recipient_mail
    }).publicKey;
    let resultVerify = {};
    let statusVerify = {};
    const dataVerify = {
      recipient_mail: our_recipient_mail,
      sender_mail: sender_mail,
      name_id: nameId,
      recipient_public_key: recipient_public_key
    };
    const headersVerify = {
      'Content-Type': 'application/json',
      'X-User-Id': dAppUrlAuth.userId,
      'X-Auth-Token': dAppUrlAuth.authToken
    };
    let running = true;
    let counter = 0;
    Promise.await(function loop() {
      return Promise.asyncApply(() => {
        while (running && ++counter < 50) {
          //trying 50x to get email from bobs mailbox
          try {
            testLogging('Step 5: verifying opt-in:', {
              data: dataVerify
            });
            const realdataVerify = {
              data: dataVerify,
              headers: headersVerify
            };
            resultVerify = getHttpGETdata(urlVerify, realdataVerify);
            testLogging('result /opt-in/verify:', {
              status: resultVerify.data.status,
              val: resultVerify.data.data.val
            });
            statusVerify = resultVerify.statusCode;
            if (resultVerify.data.data.val === true) running = false;
          } catch (ex) {
            testLogging('trying to verify opt-in - so far no success:', ex); //generatetoaddress(node_url_alice, rpcAuthAlice, global.aliceAddress, 1, true);
            //await new Promise(resolve => setTimeout(resolve, 2000));
          } finally {
            generatetoaddress(node_url_alice, rpcAuthAlice, global.aliceAddress, 1, true);
            Promise.await(new Promise(resolve => setTimeout(resolve, 2000)));
          }
        }
      });
    }());

    try {
      chai.assert.equal(statusVerify, 200);
      chai.assert.equal(resultVerify.data.data.val, true);
      chai.assert.isBelow(counter, 50);
      callback(null, true);
    } catch (error) {
      callback(error, false);
    }
  });
}

function createUser(url, auth, username, templateURL, log) {
  const headersUser = {
    'Content-Type': 'application/json',
    'X-User-Id': auth.userId,
    'X-Auth-Token': auth.authToken
  };
  const mailTemplate = {
    "subject": "Hello i am " + username,
    "redirect": "https://www.doichain.org/vielen-dank/",
    "returnPath": username + "-test@doichain.org",
    "templateURL": templateURL
  };
  const urlUsers = url + '/api/v1/users';
  const dataUser = {
    "username": username,
    "email": username + "-test@doichain.org",
    "password": "password",
    "mailTemplate": mailTemplate
  };
  const realDataUser = {
    data: dataUser,
    headers: headersUser
  };
  if (log) testLogging('createUser:', realDataUser);
  let res = getHttpPOST(urlUsers, realDataUser);
  if (log) testLogging("response", res);
  chai.assert.equal(200, res.statusCode);
  chai.assert.equal(res.data.status, "success");
  return res.data.data.userid;
}

function findUser(userId) {
  const res = Accounts.users.findOne({
    _id: userId
  });
  chai.expect(res).to.not.be.undefined;
  return res;
}

function findOptIn(optInId, log) {
  const res = OptIns.findOne({
    _id: optInId
  });
  if (log) testLogging(res, optInId);
  chai.expect(res).to.not.be.undefined;
  return res;
}

function exportOptIns(url, auth, log) {
  const headersUser = {
    'Content-Type': 'application/json',
    'X-User-Id': auth.userId,
    'X-Auth-Token': auth.authToken
  };
  const urlExport = url + '/api/v1/export';
  const realDataUser = {
    headers: headersUser
  };
  let res = getHttpGETdata(urlExport, realDataUser);
  if (log) testLogging(res, log);
  chai.assert.equal(200, res.statusCode);
  chai.assert.equal(res.data.status, "success");
  return res.data.data;
}

function requestConfirmVerifyBasicDoi(node_url_alice, rpcAuthAlice, dappUrlAlice, dataLoginAlice, dappUrlBob, recipient_mail, sender_mail, optionalData, recipient_pop3username, recipient_pop3password, log) {
  const syncFunc = Meteor.wrapAsync(request_confirm_verify_basic_doi);
  return syncFunc(node_url_alice, rpcAuthAlice, dappUrlAlice, dataLoginAlice, dappUrlBob, recipient_mail, sender_mail, optionalData, recipient_pop3username, recipient_pop3password, log);
}

function request_confirm_verify_basic_doi(node_url_alice, rpcAuthAlice, dappUrlAlice, dataLoginAlice, dappUrlBob, recipient_mail, sender_mail_in, optionalData, recipient_pop3username, recipient_pop3password, log, callback) {
  return Promise.asyncApply(() => {
    if (log) testLogging('node_url_alice', node_url_alice);
    if (log) testLogging('rpcAuthAlice', rpcAuthAlice);
    if (log) testLogging('dappUrlAlice', dappUrlAlice);
    if (log) testLogging('dataLoginAlice', dataLoginAlice);
    if (log) testLogging('dappUrlBob', dappUrlBob);
    if (log) testLogging('recipient_mail', recipient_mail);
    if (log) testLogging('sender_mail_in', sender_mail_in);
    if (log) testLogging('optionalData', optionalData);
    if (log) testLogging('recipient_pop3username', recipient_pop3username);
    if (log) testLogging('recipient_pop3password', recipient_pop3password);
    let sender_mail = sender_mail_in;
    if (log) testLogging('log into alice and request DOI');
    let resultDataOptInTmp = requestDOI(dappUrlAlice, dataLoginAlice, recipient_mail, sender_mail, optionalData, true);
    let resultDataOptIn = resultDataOptInTmp;

    if (Array.isArray(sender_mail_in)) {
      //Select master doi from senders and result
      if (log) testLogging('MASTER DOI: ', resultDataOptInTmp[0]);
      resultDataOptIn = resultDataOptInTmp[0];
      sender_mail = sender_mail_in[0];
    } //generating a block so transaction gets confirmed and delivered to bob.


    generatetoaddress(node_url_alice, rpcAuthAlice, global.aliceAddress, 1, true);
    let running = true;
    let counter = 0;
    let confirmedLink = "";
    confirmedLink = Promise.await(function loop() {
      return Promise.asyncApply(() => {
        while (running && ++counter < 50) {
          //trying 50x to get email from bobs mailbox
          try {
            testLogging('step 3: getting email from hostname!', os.hostname());
            const link2Confirm = fetchConfirmLinkFromPop3Mail(os.hostname() == 'regtest' ? 'mail' : 'localhost', 110, recipient_pop3username, recipient_pop3password, dappUrlBob, false);
            testLogging('step 4: confirming link', link2Confirm);

            if (link2Confirm != null) {
              running = false;
              confirmLink(link2Confirm);
              confirmedLink = link2Confirm;
              testLogging('confirmed');
              return link2Confirm;
            }
          } catch (ex) {
            testLogging('trying to get email - so far no success:', counter);
            Promise.await(new Promise(resolve => setTimeout(resolve, 3000)));
          }
        }
      });
    }());

    if (os.hostname() !== 'regtest') {
      //if this is a selenium test from outside docker - don't verify DOI here for simplicity 
      testLogging('returning to test without DOI-verification while doing selenium outside docker');
      callback(null, {
        status: "DOI confirmed"
      }); // return;
    } else {
      let nameId = null;

      try {
        chai.assert.isBelow(counter, 50); //confirmLink(confirmedLink);

        const nameId = getNameIdOfOptInFromRawTx(node_url_alice, rpcAuthAlice, resultDataOptIn.data.id, true);
        if (log) testLogging('got nameId', nameId);
        generatetoaddress(node_url_alice, rpcAuthAlice, global.aliceAddress, 1, true);
        testLogging('before verification');

        if (Array.isArray(sender_mail_in)) {
          for (let index = 0; index < sender_mail_in.length; index++) {
            let tmpId = index == 0 ? nameId : nameId + "-" + index; //get nameid of coDOIs based on master

            testLogging("NameId of coDoi: ", tmpId);
            verifyDOI(dappUrlAlice, dataLoginAlice, node_url_alice, rpcAuthAlice, sender_mail_in[index], recipient_mail, tmpId, true);
          }
        } else {
          verifyDOI(dappUrlAlice, dataLoginAlice, node_url_alice, rpcAuthAlice, sender_mail, recipient_mail, nameId, true); //need to generate two blocks to make block visible on alice
        }

        testLogging('after verification'); //confirmLink(confirmedLink);

        callback(null, {
          optIn: resultDataOptIn,
          nameId: nameId,
          confirmLink: confirmedLink
        });
      } catch (error) {
        callback(error, {
          optIn: resultDataOptIn,
          nameId: nameId
        });
      }
    }
  });
}

function updateUser(url, auth, updateId, mailTemplate, log) {
  const headersUser = {
    'Content-Type': 'application/json',
    'X-User-Id': auth.userId,
    'X-Auth-Token': auth.authToken
  };
  const dataUser = {
    "mailTemplate": mailTemplate
  };
  if (log) testLogging('url:', url);
  const urlUsers = url + '/api/v1/users/' + updateId;
  const realDataUser = {
    data: dataUser,
    headers: headersUser
  };
  if (log) testLogging('updateUser:', realDataUser);
  let res = HTTP.put(urlUsers, realDataUser);
  if (log) testLogging("response", res);
  chai.assert.equal(200, res.statusCode);
  chai.assert.equal(res.data.status, "success");
  const usDat = Accounts.users.findOne({
    _id: updateId
  }).profile.mailTemplate;
  if (log) testLogging("InputTemplate", dataUser.mailTemplate);
  if (log) testLogging("ResultTemplate", usDat);
  chai.expect(usDat).to.not.be.undefined;
  chai.assert.equal(dataUser.mailTemplate.templateURL, usDat.templateURL);
  return usDat;
}

function resetUsers() {
  Accounts.users.remove({
    "username": {
      "$ne": "admin"
    }
  });
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"test-api-on-node.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/test/test-api/test-api-on-node.js                                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  initBlockchain: () => initBlockchain,
  isNodeAlive: () => isNodeAlive,
  isNodeAliveAndConnectedToHost: () => isNodeAliveAndConnectedToHost,
  importPrivKey: () => importPrivKey,
  getNewAddress: () => getNewAddress,
  generatetoaddress: () => generatetoaddress,
  getBalance: () => getBalance,
  waitToStartContainer: () => waitToStartContainer,
  deleteOptInsFromAliceAndBob: () => deleteOptInsFromAliceAndBob,
  start3rdNode: () => start3rdNode,
  stopDockerBob: () => stopDockerBob,
  getContainerIdOfName: () => getContainerIdOfName,
  startDockerBob: () => startDockerBob,
  doichainAddNode: () => doichainAddNode,
  getDockerStatus: () => getDockerStatus,
  connectDockerBob: () => connectDockerBob,
  runAndWait: () => runAndWait
});
let getHttpPOST;
module.link("../../../server/api/http", {
  getHttpPOST(v) {
    getHttpPOST = v;
  }

}, 0);
let logBlockchain, testLogging;
module.link("../../../imports/startup/server/log-configuration", {
  logBlockchain(v) {
    logBlockchain = v;
  },

  testLogging(v) {
    testLogging = v;
  }

}, 1);
let chai;
module.link("meteor/practicalmeteor:chai", {
  chai(v) {
    chai = v;
  }

}, 2);
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 3);

const os = require('os');

let sudo = os.hostname() == 'regtest' ? 'sudo ' : '';
const headers = {
  'Content-Type': 'text/plain'
};

const exec = require('child_process').exec;

function initBlockchain(node_url_alice, node_url_bob, rpcAuth, privKeyBob, log) {
  //connect nodes (alice & bob) and generate DOI (only if not connected)
  console.log("importing private key:" + privKeyBob);
  importPrivKey(node_url_bob, rpcAuth, privKeyBob, true, log);

  try {
    const aliceContainerId = getContainerIdOfName('alice');
    const statusDocker = JSON.parse(getDockerStatus(aliceContainerId));
    logBlockchain("real balance :" + statusDocker.balance, Number(statusDocker.balance) > 0);
    logBlockchain("connections:" + statusDocker.connections);

    if (Number(statusDocker.connections) == 0) {
      isNodeAlive(node_url_alice, rpcAuth, log);
      isNodeAliveAndConnectedToHost(node_url_bob, rpcAuth, 'alice', log);
    }

    if (Number(statusDocker.balance) > 0) {
      logBlockchain("enough founding for alice - blockchain already connected");
      global.aliceAddress = getNewAddress(node_url_alice, rpcAuth, log);
      return;
    }
  } catch (exception) {
    logBlockchain("connecting blockchain and mining some coins");
  }

  global.aliceAddress = getNewAddress(node_url_alice, rpcAuth, log);
  generatetoaddress(node_url_alice, rpcAuth, global.aliceAddress, 210); //110 blocks to new address! 110 blöcke *25 coins
}

function wait_to_start_container(startedContainerId, callback) {
  let running = true;
  let counter = 0; //here we make sure bob gets started and connected again in probably all possible sitautions

  while (running) {
    try {
      const statusDocker = JSON.parse(getDockerStatus(startedContainerId));
      testLogging("getinfo", statusDocker);
      testLogging("version:" + statusDocker.version);
      testLogging("balance:" + statusDocker.balance);
      testLogging("connections:" + statusDocker.connections);

      if (statusDocker.connections === 0) {
        doichainAddNode(startedContainerId);
      }

      running = false;
    } catch (error) {
      testLogging("statusDocker problem trying to start Bobs node inside docker container:", error);

      try {
        connectDockerBob(startedContainerId);
      } catch (error2) {
        testLogging("could not start bob:", error2);
      }

      if (counter == 50) running = false;
    }

    counter++;
  }

  callback(null, startedContainerId);
}

function delete_options_from_alice_and_bob(callback) {
  const containerId = getContainerIdOfName('mongo');
  exec('sudo docker cp /home/doichain/dapp/contrib/scripts/meteor/delete_collections.sh ' + containerId + ':/tmp/', (e, stdout, stderr) => {
    testLogging('copied delete_collections into mongo docker container', {
      stderr: stderr,
      stdout: stdout
    });
    exec('sudo docker exec ' + containerId + ' bash -c "mongo < /tmp/delete_collections.sh"', (e, stdout, stderr) => {
      testLogging('sudo docker exec ' + containerId + ' bash -c "mongo < /tmp/delete_collections.sh"', {
        stderr: stderr,
        stdout: stdout
      });
      callback(stderr, stdout);
    });
  });
}

function isNodeAlive(url, auth, log) {
  if (log) testLogging('isNodeAlive called to url', url);
  const dataGetNetworkInfo = {
    "jsonrpc": "1.0",
    "id": "getnetworkinfo",
    "method": "getnetworkinfo",
    "params": []
  };
  const realdataGetNetworkInfo = {
    auth: auth,
    data: dataGetNetworkInfo,
    headers: headers
  };
  const resultGetNetworkInfo = getHttpPOST(url, realdataGetNetworkInfo);
  const statusGetNetworkInfo = resultGetNetworkInfo.statusCode;
  chai.assert.equal(200, statusGetNetworkInfo);
  if (log) testLogging('resultGetNetworkInfo:', resultGetNetworkInfo); // getnetworkinfo | jq '.localaddresses[0].address'
}

function isNodeAliveAndConnectedToHost(url, auth, host, log) {
  if (log) testLogging('isNodeAliveAndConnectedToHost called');
  isNodeAlive(url, auth, log);
  const dataGetNetworkInfo = {
    "jsonrpc": "1.0",
    "id": "addnode",
    "method": "addnode",
    "params": ['alice', 'onetry']
  };
  const realdataGetNetworkInfo = {
    auth: auth,
    data: dataGetNetworkInfo,
    headers: headers
  };
  const resultGetNetworkInfo = getHttpPOST(url, realdataGetNetworkInfo);
  const statusAddNode = resultGetNetworkInfo.statusCode;
  if (log) testLogging('addnode:', statusAddNode);
  chai.assert.equal(200, statusAddNode);
  const dataGetPeerInfo = {
    "jsonrpc": "1.0",
    "id": "getpeerinfo",
    "method": "getpeerinfo",
    "params": []
  };
  const realdataGetPeerInfo = {
    auth: auth,
    data: dataGetPeerInfo,
    headers: headers
  };
  const resultGetPeerInfo = getHttpPOST(url, realdataGetPeerInfo);
  const statusGetPeerInfo = resultGetPeerInfo.statusCode;
  if (log) testLogging('resultGetPeerInfo:', resultGetPeerInfo);
  chai.assert.equal(200, statusGetPeerInfo);
  chai.assert.isAbove(resultGetPeerInfo.data.result.length, 0, 'no connection to other nodes! '); //chai.expect(resultGetPeerInfo.data.result).to.have.lengthOf.at.least(1);
}

function importPrivKey(url, auth, privKey, rescan, log) {
  if (log) testLogging('importPrivKey called', '');
  const data_importprivkey = {
    "jsonrpc": "1.0",
    "id": "importprivkey",
    "method": "importprivkey",
    "params": [privKey]
  };
  const realdata_importprivkey = {
    auth: auth,
    data: data_importprivkey,
    headers: headers
  };
  const result = getHttpPOST(url, realdata_importprivkey);
  if (log) testLogging('result:', result);
}

function getNewAddress(url, auth, log) {
  if (log) testLogging('getNewAddress called');
  const dataGetNewAddress = {
    "jsonrpc": "1.0",
    "id": "getnewaddress",
    "method": "getnewaddress",
    "params": []
  };
  const realdataGetNewAddress = {
    auth: auth,
    data: dataGetNewAddress,
    headers: headers
  };
  const resultGetNewAddress = getHttpPOST(url, realdataGetNewAddress);
  const statusOptInGetNewAddress = resultGetNewAddress.statusCode;
  const newAddress = resultGetNewAddress.data.result;
  chai.assert.equal(200, statusOptInGetNewAddress);
  chai.expect(resultGetNewAddress.data.error).to.be.null;
  chai.expect(newAddress).to.not.be.null;
  if (log) testLogging(newAddress);
  return newAddress;
}

function generatetoaddress(url, auth, toaddress, amount, log) {
  const dataGenerate = {
    "jsonrpc": "1.0",
    "id": "generatetoaddress",
    "method": "generatetoaddress",
    "params": [amount, toaddress]
  };
  const headersGenerates = {
    'Content-Type': 'text/plain'
  };
  const realdataGenerate = {
    auth: auth,
    data: dataGenerate,
    headers: headersGenerates
  };
  const resultGenerate = getHttpPOST(url, realdataGenerate);
  const statusResultGenerate = resultGenerate.statusCode;
  if (log) testLogging('statusResultGenerate:', statusResultGenerate);
  chai.assert.equal(200, statusResultGenerate);
  chai.expect(resultGenerate.data.error).to.be.null;
  chai.expect(resultGenerate.data.result).to.not.be.null;
}

function getBalance(url, auth, log) {
  const dataGetBalance = {
    "jsonrpc": "1.0",
    "id": "getbalance",
    "method": "getbalance",
    "params": []
  };
  const realdataGetBalance = {
    auth: auth,
    data: dataGetBalance,
    headers: headers
  };
  const resultGetBalance = getHttpPOST(url, realdataGetBalance);
  if (log) testLogging('resultGetBalance:', resultGetBalance.data.result);
  return resultGetBalance.data.result;
}

function get_container_id_of_name(name, callback) {
  exec(sudo + 'docker ps --filter "name=' + name + '" | cut -f1 -d" " | sed \'1d\'', (e, stdout, stderr) => {
    if (e != null) {
      testLogging('cannot find ' + name + ' node ' + stdout, stderr);
      return null;
    }

    const bobsContainerId = stdout.toString().trim(); //.substring(0,stdout.toString().length-1); //remove last char since ins a line break

    callback(stderr, bobsContainerId);
  });
}

function stop_docker_bob(callback) {
  const bobsContainerId = getContainerIdOfName('bob');
  testLogging('stopping Bob with container-id: ' + bobsContainerId);

  try {
    exec(sudo + 'docker stop ' + bobsContainerId, (e, stdout, stderr) => {
      testLogging('stopping Bob with container-id: ', {
        stdout: stdout,
        stderr: stderr
      });
      callback(null, bobsContainerId);
    });
  } catch (e) {
    testLogging('couldnt stop bobs node', e);
  }
}

function doichain_add_node(containerId, callback) {
  exec(sudo + 'docker exec ' + containerId + ' doichain-cli addnode alice onetry', (e, stdout, stderr) => {
    testLogging('bob ' + containerId + ' connected? ', {
      stdout: stdout,
      stderr: stderr
    });
    callback(stderr, stdout);
  });
}

function get_docker_status(containerId, callback) {
  logBlockchain('containerId ' + containerId + ' running? ');
  exec(sudo + 'docker exec ' + containerId + ' doichain-cli -getinfo', (e, stdout, stderr) => {
    testLogging('containerId ' + containerId + ' status: ', {
      stdout: stdout,
      stderr: stderr
    });
    callback(stderr, stdout);
  });
}

function start_docker_bob(bobsContainerId, callback) {
  exec(sudo + 'docker start ' + bobsContainerId, (e, stdout, stderr) => {
    testLogging('started bobs node again: ' + bobsContainerId, {
      stdout: stdout,
      stderr: stderr
    });
    callback(stderr, stdout.toString().trim()); //remove line break from the end
  });
}

function connect_docker_bob(bobsContainerId, callback) {
  exec(sudo + 'docker exec ' + bobsContainerId + ' doichaind -regtest -daemon -reindex -addnode=alice', (e, stdout, stderr) => {
    testLogging('restarting doichaind on bobs node and connecting with alice: ', {
      stdout: stdout,
      stderr: stderr
    });
    callback(stderr, stdout);
  });
}

function start_3rd_node(callback) {
  exec(sudo + 'docker start 3rd_node', (e, stdout, stderr) => {
    testLogging('trying to start 3rd_node', {
      stdout: stdout,
      stderr: stderr
    });

    if (stderr) {
      exec(sudo + 'docker network ls |grep doichain | cut -f9 -d" "', (e, stdout, stderr) => {
        const network = stdout.toString().substring(0, stdout.toString().length - 1);
        testLogging('connecting 3rd node to docker network: ' + network);
        exec(sudo + 'docker run --expose=18332 ' + '-e REGTEST=true ' + '-e DOICHAIN_VER=0.16.3.2 ' + '-e RPC_ALLOW_IP=::/0 ' + '-e CONNECTION_NODE=alice ' + '-e RPC_PASSWORD=generated-password ' + '--name=3rd_node ' + '--dns=172.20.0.5  ' + '--dns=8.8.8.8 ' + '--dns-search=ci-doichain.org ' + '--ip=172.20.0.10 ' + '--network=' + network + ' -d doichain/core:0.16.3.2', (e, stdout, stderr) => {
          callback(stderr, stdout);
        });
      });
    } else {
      callback(stderr, stdout);
    }
  });
}

function run_and_wait(runfunction, seconds, callback) {
  Meteor.setTimeout(function () {
    runfunction();
    callback(null, true);
  }, seconds + 1000);
}

function waitToStartContainer(containerId) {
  const syncFunc = Meteor.wrapAsync(wait_to_start_container);
  return syncFunc(containerId);
}

function deleteOptInsFromAliceAndBob() {
  const syncFunc = Meteor.wrapAsync(delete_options_from_alice_and_bob);
  return syncFunc();
}

function start3rdNode() {
  const syncFunc = Meteor.wrapAsync(start_3rd_node);
  return syncFunc();
}

function stopDockerBob() {
  const syncFunc = Meteor.wrapAsync(stop_docker_bob);
  return syncFunc();
}

function getContainerIdOfName(name) {
  const syncFunc = Meteor.wrapAsync(get_container_id_of_name);
  return syncFunc(name);
}

function startDockerBob(containerId) {
  const syncFunc = Meteor.wrapAsync(start_docker_bob);
  return syncFunc(containerId);
}

function doichainAddNode(containerId) {
  const syncFunc = Meteor.wrapAsync(doichain_add_node);
  return syncFunc(containerId);
}

function getDockerStatus(containerId) {
  const syncFunc = Meteor.wrapAsync(get_docker_status);
  return syncFunc(containerId);
}

function connectDockerBob(containerId) {
  const syncFunc = Meteor.wrapAsync(connect_docker_bob);
  return syncFunc(containerId);
}

function runAndWait(runfunction, seconds) {
  const syncFunc = Meteor.wrapAsync(run_and_wait);
  return syncFunc(seconds);
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"0-basic-doi-tests.0.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/test/0-basic-doi-tests.0.js                                                                                  //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let chai;
module.link("meteor/practicalmeteor:chai", {
  chai(v) {
    chai = v;
  }

}, 0);
let deleteOptInsFromAliceAndBob, getBalance, initBlockchain;
module.link("./test-api/test-api-on-node", {
  deleteOptInsFromAliceAndBob(v) {
    deleteOptInsFromAliceAndBob = v;
  },

  getBalance(v) {
    getBalance = v;
  },

  initBlockchain(v) {
    initBlockchain = v;
  }

}, 1);
let logBlockchain;
module.link("../../imports/startup/server/log-configuration", {
  logBlockchain(v) {
    logBlockchain = v;
  }

}, 2);
const node_url_alice = 'http://172.20.0.6:18332/';
const node_url_bob = 'http://172.20.0.7:18332/';
const rpcAuth = "admin:generated-password";
const privKeyBob = "cP3EigkzsWuyKEmxk8cC6qXYb4ZjwUo5vzvZpAPmDQ83RCgXQruj";
const log = true;

if (Meteor.isAppTest) {
  describe('basic-doi-test-0', function () {
    this.timeout(0);
    before(function () {
      logBlockchain("removing OptIns,Recipients,Senders");
      deleteOptInsFromAliceAndBob();
    });
    it('should create a RegTest Doichain with alice and bob and some Doi - coins', function () {
      initBlockchain(node_url_alice, node_url_bob, rpcAuth, privKeyBob, true);
      const aliceBalance = getBalance(node_url_alice, rpcAuth, log);
      chai.assert.isAbove(aliceBalance, 0, 'no funding! ');
    });
  });
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"1-basic-doi-test.1.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/test/1-basic-doi-test.1.js                                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let chai;
module.link("meteor/practicalmeteor:chai", {
  chai(v) {
    chai = v;
  }

}, 0);
let login, createUser, findUser, exportOptIns, requestConfirmVerifyBasicDoi, resetUsers, updateUser, deleteAllEmailsFromPop3, confirmLink;
module.link("./test-api/test-api-on-dapp", {
  login(v) {
    login = v;
  },

  createUser(v) {
    createUser = v;
  },

  findUser(v) {
    findUser = v;
  },

  exportOptIns(v) {
    exportOptIns = v;
  },

  requestConfirmVerifyBasicDoi(v) {
    requestConfirmVerifyBasicDoi = v;
  },

  resetUsers(v) {
    resetUsers = v;
  },

  updateUser(v) {
    updateUser = v;
  },

  deleteAllEmailsFromPop3(v) {
    deleteAllEmailsFromPop3 = v;
  },

  confirmLink(v) {
    confirmLink = v;
  }

}, 1);
let logBlockchain;
module.link("../../imports/startup/server/log-configuration", {
  logBlockchain(v) {
    logBlockchain = v;
  }

}, 2);
let deleteOptInsFromAliceAndBob;
module.link("./test-api/test-api-on-node", {
  deleteOptInsFromAliceAndBob(v) {
    deleteOptInsFromAliceAndBob = v;
  }

}, 3);
const node_url_alice = 'http://172.20.0.6:18332/';
const rpcAuthAlice = "admin:generated-password";
const dappUrlAlice = "http://localhost:3000";
const dappUrlBob = "http://172.20.0.8:4000";
const dAppLogin = {
  "username": "admin",
  "password": "password"
};
const templateUrlA = "http://172.20.0.8:4000/templates/emails/doichain-anmeldung-final-DE.html";
const templateUrlB = "http://172.20.0.8:4000/templates/emails/doichain-anmeldung-final-EN.html";
const aliceALogin = {
  "username": "alice-a",
  "password": "password"
};
const aliceBLogin = {
  "username": "alice-a",
  "password": "password"
};
const recipient_pop3username = "bob@ci-doichain.org";
const recipient_pop3password = "bob";

if (Meteor.isAppTest) {
  describe('basic-doi-test-01', function () {
    this.timeout(0);
    before(function () {
      logBlockchain("removing OptIns,Recipients,Senders");
      deleteOptInsFromAliceAndBob();
      deleteAllEmailsFromPop3("mail", 110, recipient_pop3username, recipient_pop3password, true);
    });
    it('should test if basic Doichain workflow is working with optional data', function (done) {
      const recipient_mail = "bob@ci-doichain.org"; //please use this as standard to not confuse people!

      const sender_mail = "alice@ci-doichain.org";
      const dataLoginAlice = login(dappUrlAlice, dAppLogin, false); //log into dApp

      requestConfirmVerifyBasicDoi(node_url_alice, rpcAuthAlice, dappUrlAlice, dataLoginAlice, dappUrlBob, recipient_mail, sender_mail, {
        'city': 'Ekaterinburg'
      }, "bob@ci-doichain.org", "bob", true);
      done();
    });
    it('should test if basic Doichain workflow is working without optional data', function (done) {
      const recipient_mail = "alice@ci-doichain.org"; //please use this as an alernative when above standard is not possible

      const sender_mail = "bob@ci-doichain.org"; //login to dApp & request DOI on alice via bob

      const dataLoginAlice = login(dappUrlAlice, dAppLogin, false); //log into dApp

      requestConfirmVerifyBasicDoi(node_url_alice, rpcAuthAlice, dappUrlAlice, dataLoginAlice, dappUrlBob, recipient_mail, sender_mail, null, "alice@ci-doichain.org", "alice", true);
      done();
    });
    it('should create two more users', function (done) {
      resetUsers();
      const logAdmin = login(dappUrlAlice, dAppLogin, false);
      let userA = createUser(dappUrlAlice, logAdmin, "alice-a", templateUrlA, true);
      chai.expect(findUser(userA)).to.not.be.undefined;
      let userB = createUser(dappUrlAlice, logAdmin, "alice-b", templateUrlB, true);
      chai.expect(findUser(userB)).to.not.be.undefined;
      done();
    });
    it('should test if Doichain workflow is using different templates for different users', function (done) {
      resetUsers();
      const recipient_mail = "bob@ci-doichain.org"; //

      const sender_mail_alice_a = "alice-a@ci-doichain.org";
      const sender_mail_alice_b = "alice-b@ci-doichain.org";
      const logAdmin = login(dappUrlAlice, dAppLogin, false);
      let userA = createUser(dappUrlAlice, logAdmin, "alice-a", templateUrlA, true);
      chai.expect(findUser(userA)).to.not.be.undefined;
      let userB = createUser(dappUrlAlice, logAdmin, "alice-b", templateUrlB, true);
      chai.expect(findUser(userB)).to.not.be.undefined;
      const logUserA = login(dappUrlAlice, aliceALogin, true);
      const logUserB = login(dappUrlAlice, aliceBLogin, true); //requestConfirmVerifyBasicDoi checks if the "log" value (if it is a String) is in the mail-text

      requestConfirmVerifyBasicDoi(node_url_alice, rpcAuthAlice, dappUrlAlice, logUserA, dappUrlBob, recipient_mail, sender_mail_alice_a, {
        'city': 'Ekaterinburg'
      }, "bob@ci-doichain.org", "bob", "kostenlose Anmeldung");
      requestConfirmVerifyBasicDoi(node_url_alice, rpcAuthAlice, dappUrlAlice, logUserB, dappUrlBob, recipient_mail, sender_mail_alice_b, {
        'city': 'Simbach'
      }, "bob@ci-doichain.org", "bob", "free registration");
      done();
    });
    it('should test if users can export OptIns ', function (done) {
      const recipient_mail = "bob@ci-doichain.org"; //

      const sender_mail_alice_a = "alice-export@ci-doichain.org";
      const logAdmin = login(dappUrlAlice, dAppLogin, true);
      const logUserA = login(dappUrlAlice, aliceALogin, true);
      requestConfirmVerifyBasicDoi(node_url_alice, rpcAuthAlice, dappUrlAlice, logUserA, dappUrlBob, recipient_mail, sender_mail_alice_a, {
        'city': 'München'
      }, "bob@ci-doichain.org", "bob", true);
      const exportedOptIns = exportOptIns(dappUrlAlice, logAdmin, true);
      chai.expect(exportedOptIns).to.not.be.undefined;
      chai.expect(exportedOptIns[0]).to.not.be.undefined;
      chai.expect(exportedOptIns[0].RecipientEmail.email).to.be.equal(recipient_mail);
      const exportedOptInsA = exportOptIns(dappUrlAlice, logUserA, true);
      exportedOptInsA.forEach(element => {
        chai.expect(element.ownerId).to.be.equal(logUserA.userId);
      }); //chai.expect(findOptIn(resultDataOptIn._id)).to.not.be.undefined;

      done();
    });
    it('should test if admin can update user profiles', function () {
      resetUsers();
      let logAdmin = login(dappUrlAlice, dAppLogin, true);
      const userUp = createUser(dappUrlAlice, logAdmin, "updateUser", templateUrlA, true);
      const changedData = updateUser(dappUrlAlice, logAdmin, userUp, {
        "templateURL": templateUrlB
      }, true);
      chai.expect(changedData).not.undefined;
    });
    it('should test if user can update own profile', function () {
      resetUsers();
      let logAdmin = login(dappUrlAlice, dAppLogin, true);
      const userUp = createUser(dappUrlAlice, logAdmin, "updateUser", templateUrlA, true);
      const logUserUp = login(dappUrlAlice, {
        "username": "updateUser",
        "password": "password"
      }, true);
      const changedData = updateUser(dappUrlAlice, logUserUp, userUp, {
        "templateURL": templateUrlB
      }, true);
      chai.expect(changedData).not.undefined;
    });
    it('should test if coDoi works', function () {
      const coDoiList = ["alice1@doichain-ci.com", "alice2@doichain-ci.com", "alice3@doichain-ci.com"];
      const recipient_mail = "bob@ci-doichain.org";
      const sender_mail = coDoiList;
      let logAdmin = login(dappUrlAlice, dAppLogin, true);
      const coDois = requestConfirmVerifyBasicDoi(node_url_alice, rpcAuthAlice, dappUrlAlice, logAdmin, dappUrlBob, recipient_mail, sender_mail, {
        'city': 'Ekaterinburg'
      }, "bob@ci-doichain.org", "bob", true);
    });
    it('should find updated Data in email', function (done) {
      const recipient_mail = "bob@ci-doichain.org"; //please use this as standard to not confuse people!

      const sender_mail = "alice-update@ci-doichain.org";
      const adLog = login(dappUrlAlice, dAppLogin, false);
      updateUser(dappUrlAlice, adLog, adLog.userId, {
        "subject": "updateTest",
        "templateURL": templateUrlB
      });
      requestConfirmVerifyBasicDoi(node_url_alice, rpcAuthAlice, dappUrlAlice, adLog, dappUrlBob, recipient_mail, sender_mail, {
        'city': 'Ekaterinburg'
      }, "bob@ci-doichain.org", "bob", true);
      done();
    });
    it('should redirect if confirmation-link is clicked again', function () {
      for (let index = 0; index < 3; index++) {
        const recipient_mail = "bob@ci-doichain.org"; //please use this as standard to not confuse people!

        const sender_mail = "alice_" + index + "@ci-doichain.org";
        const dataLoginAlice = login(dappUrlAlice, dAppLogin, false); //log into dApp

        let returnedData = requestConfirmVerifyBasicDoi(node_url_alice, rpcAuthAlice, dappUrlAlice, dataLoginAlice, dappUrlBob, recipient_mail, sender_mail, {
          'city': 'Ekaterinburg'
        }, "bob@ci-doichain.org", "bob", true);
        chai.assert.equal(true, confirmLink(returnedData.confirmLink));
      }
    });
  });
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"2-basic-doi-test.2.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/test/2-basic-doi-test.2.js                                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let chai;
module.link("meteor/practicalmeteor:chai", {
  chai(v) {
    chai = v;
  }

}, 0);
let confirmLink, deleteAllEmailsFromPop3, fetchConfirmLinkFromPop3Mail, getNameIdOfOptInFromRawTx, login, requestDOI, verifyDOI;
module.link("./test-api/test-api-on-dapp", {
  confirmLink(v) {
    confirmLink = v;
  },

  deleteAllEmailsFromPop3(v) {
    deleteAllEmailsFromPop3 = v;
  },

  fetchConfirmLinkFromPop3Mail(v) {
    fetchConfirmLinkFromPop3Mail = v;
  },

  getNameIdOfOptInFromRawTx(v) {
    getNameIdOfOptInFromRawTx = v;
  },

  login(v) {
    login = v;
  },

  requestDOI(v) {
    requestDOI = v;
  },

  verifyDOI(v) {
    verifyDOI = v;
  }

}, 1);
let testLogging;
module.link("../../imports/startup/server/log-configuration", {
  testLogging(v) {
    testLogging = v;
  }

}, 2);
let deleteOptInsFromAliceAndBob, generatetoaddress, getNewAddress, start3rdNode, startDockerBob, stopDockerBob, waitToStartContainer;
module.link("./test-api/test-api-on-node", {
  deleteOptInsFromAliceAndBob(v) {
    deleteOptInsFromAliceAndBob = v;
  },

  generatetoaddress(v) {
    generatetoaddress = v;
  },

  getNewAddress(v) {
    getNewAddress = v;
  },

  start3rdNode(v) {
    start3rdNode = v;
  },

  startDockerBob(v) {
    startDockerBob = v;
  },

  stopDockerBob(v) {
    stopDockerBob = v;
  },

  waitToStartContainer(v) {
    waitToStartContainer = v;
  }

}, 3);

const exec = require('child_process').exec;

const node_url_alice = 'http://172.20.0.6:18332/';
const recipient_pop3username = "bob@ci-doichain.org";
const recipient_pop3password = "bob";
const rpcAuth = "admin:generated-password";
const dappUrlAlice = "http://localhost:3000";
const dappUrlBob = "http://172.20.0.8:4000";
const dAppLogin = {
  "username": "admin",
  "password": "password"
};
const log = true;

if (Meteor.isAppTest) {
  describe('02-basic-doi-test-with-offline-node-02', function () {
    before(function () {
      deleteOptInsFromAliceAndBob();
      deleteAllEmailsFromPop3("mail", 110, recipient_pop3username, recipient_pop3password, true);
      exec('sudo docker rm 3rd_node', (e, stdout2, stderr2) => {
        testLogging('deleted 3rd_node:', {
          stdout: stdout2,
          stderr: stderr2
        });
      });

      try {
        exec('sudo docker stop 3rd_node', (e, stdout, stderr) => {
          testLogging('stopped 3rd_node:', {
            stdout: stdout,
            stderr: stderr
          });
          exec('sudo docker rm 3rd_node', (e, stdout, stderr) => {
            testLogging('removed 3rd_node:', {
              stdout: stdout,
              stderr: stderr
            });
          });
        });
      } catch (ex) {
        testLogging('could not stop 3rd_node');
      } //importPrivKey(node_url_bob, rpcAuth, privKeyBob, true, false);

    });
    before(function () {
      try {
        exec('sudo docker stop 3rd_node', (e, stdout, stderr) => {
          testLogging('stopped 3rd_node:', {
            stdout: stdout,
            stderr: stderr
          });
          exec('sudo docker rm 3rd_node', (e, stdout, stderr) => {
            testLogging('removed 3rd_node:', {
              stdout: stdout,
              stderr: stderr
            });
          });
        });
      } catch (ex) {
        testLogging('could not stop 3rd_node');
      }
    });
    it('should test if basic Doichain workflow is working when Bobs node is temporarily offline', function (done) {
      this.timeout(0);
      global.aliceAddress = getNewAddress(node_url_alice, rpcAuth, false); //start another 3rd node before shutdown Bob

      start3rdNode();
      var containerId = stopDockerBob();
      const recipient_mail = "bob@ci-doichain.org";
      const sender_mail = "alice-to-offline-node@ci-doichain.org"; //login to dApp & request DOI on alice via bob

      if (log) testLogging('log into alice and request DOI');
      let dataLoginAlice = login(dappUrlAlice, dAppLogin, false); //log into dApp

      let resultDataOptIn = requestDOI(dappUrlAlice, dataLoginAlice, recipient_mail, sender_mail, null, true);
      const nameId = getNameIdOfOptInFromRawTx(node_url_alice, rpcAuth, resultDataOptIn.data.id, true);
      if (log) testLogging('got nameId', nameId);
      var startedContainerId = startDockerBob(containerId);
      testLogging("started bob's node with containerId", startedContainerId);
      chai.expect(startedContainerId).to.not.be.null;
      waitToStartContainer(startedContainerId); //generating a block so transaction gets confirmed and delivered to bob.

      generatetoaddress(node_url_alice, rpcAuth, global.aliceAddress, 1, true);
      let running = true;
      let counter = 0;

      (function loop() {
        return Promise.asyncApply(() => {
          while (running && ++counter < 50) {
            //trying 50x to get email from bobs mailbox
            try {
              //  generatetoaddress(node_url_alice, rpcAuth, global.aliceAddress, 1, true);
              testLogging('step 3: getting email!');
              const link2Confirm = fetchConfirmLinkFromPop3Mail("mail", 110, recipient_pop3username, recipient_pop3password, dappUrlBob, false);
              testLogging('step 4: confirming link', link2Confirm);
              if (link2Confirm != null) running = false;
              confirmLink(link2Confirm);
              testLogging('confirmed');
            } catch (ex) {
              testLogging('trying to get email - so far no success:', counter);
              Promise.await(new Promise(resolve => setTimeout(resolve, 2000)));
            }
          }
        });
      })();

      generatetoaddress(node_url_alice, rpcAuth, global.aliceAddress, 1, true);
      verifyDOI(dappUrlAlice, dataLoginAlice, node_url_alice, rpcAuth, sender_mail, recipient_mail, nameId, log); //need to generate two blocks to make block visible on alice

      testLogging('end of getNameIdOfRawTransaction returning nameId', nameId);

      try {
        exec('sudo docker stop 3rd_node', (e, stdout, stderr) => {
          testLogging('stopped 3rd_node:', {
            stdout: stdout,
            stderr: stderr
          });
          exec('sudo docker rm 3rd_node', (e, stdout, stderr) => {
            testLogging('removed 3rd_node:', {
              stdout: stdout,
              stderr: stderr
            });
          });
        });
      } catch (ex) {
        testLogging('could not stop 3rd_node');
      }

      done(); //done();
    }); //it
  });
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"3-basic-doi-test.3.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/test/3-basic-doi-test.3.js                                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let chai;
module.link("meteor/practicalmeteor:chai", {
  chai(v) {
    chai = v;
  }

}, 0);
let deleteAllEmailsFromPop3, findOptIn, login, requestConfirmVerifyBasicDoi, requestDOI;
module.link("./test-api/test-api-on-dapp", {
  deleteAllEmailsFromPop3(v) {
    deleteAllEmailsFromPop3 = v;
  },

  findOptIn(v) {
    findOptIn = v;
  },

  login(v) {
    login = v;
  },

  requestConfirmVerifyBasicDoi(v) {
    requestConfirmVerifyBasicDoi = v;
  },

  requestDOI(v) {
    requestDOI = v;
  }

}, 1);
let logBlockchain;
module.link("../../imports/startup/server/log-configuration", {
  logBlockchain(v) {
    logBlockchain = v;
  }

}, 2);
let deleteOptInsFromAliceAndBob, generatetoaddress, getNewAddress;
module.link("./test-api/test-api-on-node", {
  deleteOptInsFromAliceAndBob(v) {
    deleteOptInsFromAliceAndBob = v;
  },

  generatetoaddress(v) {
    generatetoaddress = v;
  },

  getNewAddress(v) {
    getNewAddress = v;
  }

}, 3);
const node_url_alice = 'http://172.20.0.6:18332/';
const rpcAuthAlice = "admin:generated-password";
const dappUrlAlice = "http://localhost:3000";
const dappUrlBob = "http://172.20.0.8:4000";
const dAppLogin = {
  "username": "admin",
  "password": "password"
};
const recipient_pop3username = "bob@ci-doichain.org";
const recipient_pop3password = "bob";

if (Meteor.isAppTest) {
  describe('03-basic-doi-test-03', function () {
    before(function () {
      logBlockchain("removing OptIns,Recipients,Senders");
      deleteOptInsFromAliceAndBob();
      deleteAllEmailsFromPop3("mail", 110, recipient_pop3username, recipient_pop3password, true);
    });
    it('should test if basic Doichain workflow running 5 times', function (done) {
      this.timeout(0);
      const dataLoginAlice = login(dappUrlAlice, dAppLogin, false); //log into dApp

      global.aliceAddress = getNewAddress(node_url_alice, rpcAuthAlice, false);

      for (let i = 0; i < 20; i++) {
        const recipient_mail = "bob@ci-doichain.org"; //please use this as standard to not confuse people!

        const sender_mail = "alice_" + i + "@ci-doichain.org";
        requestConfirmVerifyBasicDoi(node_url_alice, rpcAuthAlice, dappUrlAlice, dataLoginAlice, dappUrlBob, recipient_mail, sender_mail, {
          'city': 'Ekaterinburg_' + i
        }, "bob@ci-doichain.org", "bob", true);
      }

      done();
    });
    it('should test if basic Doichain workflow running 20 times without confirmation and verification', function (done) {
      this.timeout(0);
      deleteAllEmailsFromPop3("mail", 110, recipient_pop3username, recipient_pop3password, true);
      const dataLoginAlice = login(dappUrlAlice, dAppLogin, false); //log into dApp

      global.aliceAddress = getNewAddress(node_url_alice, rpcAuthAlice, false);

      for (let i = 0; i < 20; i++) {
        const recipient_mail = "bob@ci-doichain.org"; //please use this as standard to not confuse people!

        const sender_mail = "alice_" + i + "@ci-doichain.org";
        const resultDataOptIn = requestDOI(dappUrlAlice, dataLoginAlice, recipient_mail, sender_mail, null, true);
        chai.expect(findOptIn(resultDataOptIn.data.id, true)).to.not.be.undefined;
      }

      done();
    });
    it('should test if basic Doichain workflow running 100 times with without confirmation and verification', function (done) {
      this.timeout(0);
      deleteAllEmailsFromPop3("mail", 110, recipient_pop3username, recipient_pop3password, true);
      const dataLoginAlice = login(dappUrlAlice, dAppLogin, false); //log into dApp

      global.aliceAddress = getNewAddress(node_url_alice, rpcAuthAlice, false);

      for (let i = 0; i < 100; i++) {
        const recipient_mail = "bob@ci-doichain.org"; //please use this as standard to not confuse people!

        const sender_mail = "alice_" + i + "@ci-doichain.org";
        const resultDataOptIn = requestDOI(dappUrlAlice, dataLoginAlice, recipient_mail, sender_mail, null, true);
        chai.expect(findOptIn(resultDataOptIn.data.id, true)).to.not.be.undefined;
        if (i % 100 === 0) generatetoaddress(node_url_alice, rpcAuthAlice, global.aliceAddress, 1, true);
      }

      done();
    });
  });
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"5-selenium-test-flo.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/test/5-selenium-test-flo.js                                                                                  //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
if (Meteor.isAppTest || Meteor.isTest) {
  describe('simple-selenium-test', function () {
    this.timeout(10000);
    beforeEach(function () {});
  });
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"basic-doi-test-nico.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/test/basic-doi-test-nico.js                                                                                  //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let chai;
module.link("meteor/practicalmeteor:chai", {
  chai(v) {
    chai = v;
  }

}, 0);
let logBlockchain;
module.link("../../imports/startup/server/log-configuration", {
  logBlockchain(v) {
    logBlockchain = v;
  }

}, 1);
let deleteOptInsFromAliceAndBob, getBalance, initBlockchain;
module.link("./test-api/test-api-on-node", {
  deleteOptInsFromAliceAndBob(v) {
    deleteOptInsFromAliceAndBob = v;
  },

  getBalance(v) {
    getBalance = v;
  },

  initBlockchain(v) {
    initBlockchain = v;
  }

}, 2);
let login, requestConfirmVerifyBasicDoi;
module.link("./test-api/test-api-on-dapp", {
  login(v) {
    login = v;
  },

  requestConfirmVerifyBasicDoi(v) {
    requestConfirmVerifyBasicDoi = v;
  }

}, 3);
const node_url_alice = 'http://172.20.0.6:18332/';
const node_url_bob = 'http://172.20.0.7:18332/';
const rpcAuth = "admin:generated-password";
const privKeyBob = "cP3EigkzsWuyKEmxk8cC6qXYb4ZjwUo5vzvZpAPmDQ83RCgXQruj";
const log = true;
const rpcAuthAlice = "admin:generated-password";
const dappUrlAlice = "http://localhost:3000";
const dappUrlBob = "http://172.20.0.8:4000";
const dAppLogin = {
  "username": "admin",
  "password": "password"
};

if (Meteor.isTest || Meteor.isAppTest) {
  xdescribe('basic-doi-test-nico', function () {
    this.timeout(600000);
    before(function () {
      logBlockchain("removing OptIns,Recipients,Senders");
      deleteOptInsFromAliceAndBob();
    });
    xit('should create a RegTest Doichain with alice and bob and some Doi - coins', function () {
      initBlockchain(node_url_alice, node_url_bob, rpcAuth, privKeyBob, true);
      const aliceBalance = getBalance(node_url_alice, rpcAuth, log);
      chai.assert.isAbove(aliceBalance, 0, 'no funding! ');
    });
    xit('should test if basic Doichain workflow is working with optional data', function (done) {
      const recipient_mail = "bob+1@ci-doichain.org"; //please use this as standard to not confuse people!

      const sender_mail = "alice@ci-doichain.org";
      const dataLoginAlice = login(dappUrlAlice, dAppLogin, false); //log into dApp

      requestConfirmVerifyBasicDoi(node_url_alice, rpcAuthAlice, dappUrlAlice, dataLoginAlice, dappUrlBob, recipient_mail, sender_mail, {
        'city': 'Ekaterinburg'
      }, "bob@ci-doichain.org", "bob", true);
      done();
    });
  });
  xdescribe('basic-doi-test-nico', function () {
    /**
     * Information regarding to event loop node.js
     * - https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/
     *
     * Promises:
     * - https://developers.google.com/web/fundamentals/primers/promises
     *
     * Promise loops and async wait
     * - https://stackoverflow.com/questions/40328932/javascript-es6-promise-for-loop
     *
     * Asynchronous loops with mocha:
     * - https://whitfin.io/asynchronous-test-loops-with-mocha/
     */

    /*  it('should test a timeout with a promise', function (done) {
          logBlockchain("truying a promise");
          for (let i = 0; i < 10; i++) {
              const promise = new Promise((resolve, reject) => {
                  const timeout = Math.random() * 1000;
                  setTimeout(() => {
                      console.log('promise:'+i);
                  }, timeout);
              });
              // TODO: Chain this promise to the previous one (maybe without having it running?)
          }
          done();
      });
       it('should run a loop with async wait', function (done) {
          logBlockchain("trying asycn wait");
          (async function loop() {
              for (let i = 0; i < 10; i++) {
                  await new Promise(resolve => setTimeout(resolve, Math.random() * 1000));
                  console.log('async wait'+i);
              }
              done()
          })();
      });
       xit('should safely stop and start bobs doichain node container', function (done) {
          var containerId = stopDockerBob();
           logBlockchain("stopped bob's node with containerId",containerId);
          chai.expect(containerId).to.not.be.null;
           var startedContainerId = startDockerBob(containerId);
          logBlockchain("started bob's node with containerId",startedContainerId);
          chai.expect(startedContainerId).to.not.be.null;
           let running = true;
          while(running){
              runAndWait(function () {
                  try{
                      const statusDocker = JSON.parse(getDockerStatus(containerId));
                      logBlockchain("getinfo",statusDocker);
                      logBlockchain("version:"+statusDocker.version);
                      logBlockchain("balance:"+statusDocker.balance);
                      logBlockchain("balance:"+statusDocker.connections);
                      if(statusDocker.connections===0){
                          doichainAddNode(containerId);
                      }
                      running = false;
                  }
                  catch(error){
                      logBlockchain("statusDocker problem:",error);
                  }
              },2);
          }
           done();
      });*/
  });
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"basic-doi-test.flo.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/test/basic-doi-test.flo.js                                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let chai;
module.link("meteor/practicalmeteor:chai", {
  chai(v) {
    chai = v;
  }

}, 0);

if (Meteor.isTest) {
  describe('basic-doi-test-flo', function () {});
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"main.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// server/main.js                                                                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.link("/imports/startup/server");
module.link("./api/index.js");
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"i18n":{"de.i18n.json.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// i18n/de.i18n.json.js                                                                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Package['universe:i18n'].i18n.addTranslations('de','',{"components":{"userMenu":{"logout":"Ausloggen","login":"Einloggen","join":"Beitreten","change":"Passwort ändern","entries":{"home":{"name":"Startseite"},"key-generator":{"name":"Key Generator"},"balance":{"name":"Guthaben"},"recipients":{"name":"Empfänger"},"opt-ins":{"name":"Opt-Ins"}}},"keyGenerator":{"privateKey":"Privater Schlüssel","publicKey":"Öffentlicher Schlüssel","generateButton":"Generieren"},"balance":{},"connectionNotification":{"tryingToConnect":"Versuche zu verbinden","connectionIssue":"Es scheint ein Verbindungsproblem zu geben"},"mobileMenu":{"showMenu":"Zeige Menü"},"ImageElement":{"toggle":"Anzeigen"}},"pages":{"startPage":{"title":"doichain","infoText":"Doichain - die Blockchain basierte Anti-Email-Spam Lösung","joinNow":"Jetzt anmelden!"},"keyGeneratorPage":{"title":"Key Generator"},"balancePage":{"title":"Guthaben"},"recipientsPage":{"title":"Empfänger","noRecipients":"Keine Empfänger hier","loading":"Lade Empfänger...","id":"ID","email":"Email","publicKey":"Public Key","createdAt":"Erstellt am"},"optInsPage":{"title":"Opt-Ins","noOptIns":"Keine Opt-Ins hier","loading":"Lade Opt-Ins...","id":"ID","recipient":"Empfänger","sender":"Versender","data":"Daten","screenshot":"Screenshot","nameId":"NameId","createdAt":"Erstellt am","confirmedAt":"Bestätigt am","confirmedBy":"Bestätigt von","txId":"Transaktions-Id","error":"Fehler"},"authPageSignIn":{"emailRequired":"Email benötigt","passwordRequired":"Passwort benötigt","signIn":"Einloggen.","signInReason":"Einloggen erlaubt dir opt-ins hinzuzufügen","yourEmail":"Deine Email","password":"Passwort","signInButton":"Einloggen","needAccount":"Keinen Account? Jetzt beitreten."},"notFoundPage":{"pageNotFound":"Seite nicht gefunden"}},"api":{"opt-ins":{"add":{"accessDenied":"Keine Berechtigung um Opt-Ins hinzuzufügen"}}}});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"en.i18n.json.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// i18n/en.i18n.json.js                                                                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Package['universe:i18n'].i18n.addTranslations('en','',{"components":{"userMenu":{"logout":"Logout","login":"Login","join":"Sign-up","change":"Change password","entries":{"home":{"name":"Home"},"key-generator":{"name":"Key Generator"},"balance":{"name":"Balance"},"recipients":{"name":"Recipients"},"opt-ins":{"name":"Opt-Ins"}}},"keyGenerator":{"privateKey":"Private key","publicKey":"Public key","generateButton":"Generate"},"balance":{},"connectionNotification":{"tryingToConnect":"Trying to connect","connectionIssue":"There seems to be a connection issue"},"mobileMenu":{"showMenu":"Show Menu"},"ImageElement":{"toggle":"Display"}},"pages":{"startPage":{"title":"doichain","infoText":"This is Doichain - A blockchain based email anti-spam","joinNow":"Join now!"},"keyGeneratorPage":{"title":"Key Generator"},"balancePage":{"title":"Balance"},"recipientsPage":{"title":"Recipients","noRecipients":"No recipients here","loading":"Loading recipients...","id":"ID","email":"Email","publicKey":"Public Key","createdAt":"Created At"},"optInsPage":{"title":"Opt-Ins","noOptIns":"No opt-ins here","loading":"Loading opt-ins...","id":"ID","recipient":"Recipient","sender":"Sender","data":"Data","screenshot":"Screenshot","nameId":"NameId","createdAt":"Created At","confirmedAt":"Confirmed At","confirmedBy":"Confirmed By","txId":"Transaction-Id","error":"Error"},"authPageSignIn":{"emailRequired":"Email required","passwordRequired":"Password required","signIn":"Sign In.","signInReason":"Signing in allows you to add opt-ins","yourEmail":"Your Email","password":"Password","signInButton":"Sign in","needAccount":"Need an account? Join Now."},"notFoundPage":{"pageNotFound":"Page not found"}},"api":{"opt-ins":{"add":{"accessDenied":"Cannot add opt-ins without permissions"}}}});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},{
  "extensions": [
    ".js",
    ".json",
    ".i18n.json"
  ]
});

require("/server/api/rest/rest.js");
require("/server/test/test-api/test-api-on-dapp.js");
require("/server/test/test-api/test-api-on-node.js");
require("/server/api/blockchain_jobs.js");
require("/server/api/dapp_jobs.js");
require("/server/api/dns.js");
require("/server/api/doichain.js");
require("/server/api/http.js");
require("/server/api/index.js");
require("/server/api/mail_jobs.js");
require("/server/test/0-basic-doi-tests.0.js");
require("/server/test/1-basic-doi-test.1.js");
require("/server/test/2-basic-doi-test.2.js");
require("/server/test/3-basic-doi-test.3.js");
require("/server/test/5-selenium-test-flo.js");
require("/server/test/basic-doi-test-nico.js");
require("/server/test/basic-doi-test.flo.js");
require("/i18n/de.i18n.json.js");
require("/i18n/en.i18n.json.js");
require("/server/main.js");
//# sourceURL=meteor://💻app/app/app.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9hcGkvb3B0LWlucy9zZXJ2ZXIvcHVibGljYXRpb25zLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL2FwaS9vcHQtaW5zL21ldGhvZHMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvYXBpL29wdC1pbnMvb3B0LWlucy5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9hcGkvcmVjaXBpZW50cy9zZXJ2ZXIvcHVibGljYXRpb25zLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL2FwaS9yZWNpcGllbnRzL3JlY2lwaWVudHMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvYXBpL2RvaWNoYWluL2VudHJpZXMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvYXBpL2RvaWNoYWluL21ldGhvZHMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvYXBpL2xhbmd1YWdlcy9tZXRob2RzLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL2FwaS9tZXRhL21ldGEuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvYXBpL3NlbmRlcnMvc2VuZGVycy5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9hcGkvdmVyc2lvbi9wdWJsaWNhdGlvbnMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvZGFwcHMvZXhwb3J0X2RvaXMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvZGFwcHMvZmV0Y2hfZG9pLW1haWwtZGF0YS5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9kYXBwcy9nZXRfZG9pLW1haWwtZGF0YS5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9kbnMvZ2V0X29wdC1pbi1rZXkuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvZG5zL2dldF9vcHQtaW4tcHJvdmlkZXIuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvZG9pY2hhaW4vYWRkX2VudHJ5X2FuZF9mZXRjaF9kYXRhLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2RvaWNoYWluL2NoZWNrX25ld190cmFuc2FjdGlvbnMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvZG9pY2hhaW4vZGVjcnlwdF9tZXNzYWdlLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2RvaWNoYWluL2VuY3J5cHRfbWVzc2FnZS5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9kb2ljaGFpbi9nZW5lcmF0ZV9uYW1lLWlkLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2RvaWNoYWluL2dldF9hZGRyZXNzLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2RvaWNoYWluL2dldF9iYWxhbmNlLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2RvaWNoYWluL2dldF9kYXRhLWhhc2guanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvZG9pY2hhaW4vZ2V0X2tleS1wYWlyLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2RvaWNoYWluL2dldF9wcml2YXRlLWtleV9mcm9tX3dpZi5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9kb2ljaGFpbi9nZXRfcHVibGlja2V5X2FuZF9hZGRyZXNzX2J5X2RvbWFpbi5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9kb2ljaGFpbi9nZXRfc2lnbmF0dXJlLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2RvaWNoYWluL2luc2VydC5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9kb2ljaGFpbi91cGRhdGUuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvZG9pY2hhaW4vdmVyaWZ5X3NpZ25hdHVyZS5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9kb2ljaGFpbi93cml0ZV90b19ibG9ja2NoYWluLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2VtYWlscy9kZWNvZGVfZG9pLWhhc2guanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvZW1haWxzL2dlbmVyYXRlX2RvaS1oYXNoLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2VtYWlscy9wYXJzZV90ZW1wbGF0ZS5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9lbWFpbHMvc2VuZC5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9qb2JzL2FkZF9jaGVja19uZXdfdHJhbnNhY3Rpb25zLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2pvYnMvYWRkX2ZldGNoLWRvaS1tYWlsLWRhdGEuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvam9icy9hZGRfaW5zZXJ0X2Jsb2NrY2hhaW4uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvam9icy9hZGRfc2VuZF9tYWlsLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2pvYnMvYWRkX3VwZGF0ZV9ibG9ja2NoYWluLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2xhbmd1YWdlcy9nZXQuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvbWV0YS9hZGRPclVwZGF0ZS5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9vcHQtaW5zL2FkZC5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9vcHQtaW5zL2FkZF9hbmRfd3JpdGVfdG9fYmxvY2tjaGFpbi5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9vcHQtaW5zL2NvbmZpcm0uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvb3B0LWlucy9nZW5lcmF0ZV9kb2ktdG9rZW4uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvb3B0LWlucy91cGRhdGVfc3RhdHVzLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL21vZHVsZXMvc2VydmVyL29wdC1pbnMvdmVyaWZ5LmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL21vZHVsZXMvc2VydmVyL3JlY2lwaWVudHMvYWRkLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL21vZHVsZXMvc2VydmVyL3NlbmRlcnMvYWRkLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL3N0YXJ0dXAvc2VydmVyL2RhcHAtY29uZmlndXJhdGlvbi5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9zdGFydHVwL3NlcnZlci9kbnMtY29uZmlndXJhdGlvbi5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9zdGFydHVwL3NlcnZlci9kb2ljaGFpbi1jb25maWd1cmF0aW9uLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL3N0YXJ0dXAvc2VydmVyL2VtYWlsLWNvbmZpZ3VyYXRpb24uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvc3RhcnR1cC9zZXJ2ZXIvZml4dHVyZXMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvc3RhcnR1cC9zZXJ2ZXIvaW5kZXguanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvc3RhcnR1cC9zZXJ2ZXIvam9icy5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9zdGFydHVwL3NlcnZlci9sb2ctY29uZmlndXJhdGlvbi5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9zdGFydHVwL3NlcnZlci9yZWdpc3Rlci1hcGkuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvc3RhcnR1cC9zZXJ2ZXIvc2VjdXJpdHkuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvc3RhcnR1cC9zZXJ2ZXIvdHlwZS1jb25maWd1cmF0aW9uLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL3N0YXJ0dXAvc2VydmVyL3VzZXJhY2NvdW50cy1jb25maWd1cmF0aW9uLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvYXBpL3Jlc3QvaW1wb3J0cy9jb25maXJtLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvYXBpL3Jlc3QvaW1wb3J0cy9kZWJ1Zy5qcyIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL2FwaS9yZXN0L2ltcG9ydHMvc2VuZC5qcyIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL2FwaS9yZXN0L2ltcG9ydHMvc3RhdHVzLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvYXBpL3Jlc3QvaW1wb3J0cy91c2VyLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvYXBpL3Jlc3QvaW1wb3J0cy92ZXJpZnkuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9hcGkvcmVzdC9yZXN0LmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvYXBpL2Jsb2NrY2hhaW5fam9icy5qcyIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL2FwaS9kYXBwX2pvYnMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9hcGkvZG5zLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvYXBpL2RvaWNoYWluLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvYXBpL2h0dHAuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9hcGkvaW5kZXguanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9hcGkvbWFpbF9qb2JzLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvdGVzdC90ZXN0LWFwaS90ZXN0LWFwaS1vbi1kYXBwLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvdGVzdC90ZXN0LWFwaS90ZXN0LWFwaS1vbi1ub2RlLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvdGVzdC8wLWJhc2ljLWRvaS10ZXN0cy4wLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvdGVzdC8xLWJhc2ljLWRvaS10ZXN0LjEuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci90ZXN0LzItYmFzaWMtZG9pLXRlc3QuMi5qcyIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3Rlc3QvMy1iYXNpYy1kb2ktdGVzdC4zLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvdGVzdC81LXNlbGVuaXVtLXRlc3QtZmxvLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvdGVzdC9iYXNpYy1kb2ktdGVzdC1uaWNvLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvdGVzdC9iYXNpYy1kb2ktdGVzdC5mbG8uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3NlcnZlci9tYWluLmpzIl0sIm5hbWVzIjpbIk1ldGVvciIsIm1vZHVsZSIsImxpbmsiLCJ2IiwiUm9sZXMiLCJPcHRJbnMiLCJwdWJsaXNoIiwiT3B0SW5zQWxsIiwidXNlcklkIiwicmVhZHkiLCJ1c2VySXNJblJvbGUiLCJmaW5kIiwib3duZXJJZCIsImZpZWxkcyIsInB1YmxpY0ZpZWxkcyIsIkREUFJhdGVMaW1pdGVyIiwiaTE4biIsIl9pMThuIiwiVmFsaWRhdGVkTWV0aG9kIiwiXyIsImFkZE9wdEluIiwiZGVmYXVsdCIsImFkZCIsIm5hbWUiLCJ2YWxpZGF0ZSIsInJ1biIsInJlY2lwaWVudE1haWwiLCJzZW5kZXJNYWlsIiwiZGF0YSIsImVycm9yIiwiRXJyb3IiLCJfXyIsIm9wdEluIiwiT1BUSU9OU19NRVRIT0RTIiwicGx1Y2siLCJpc1NlcnZlciIsImFkZFJ1bGUiLCJjb250YWlucyIsImNvbm5lY3Rpb25JZCIsImV4cG9ydCIsIk1vbmdvIiwiU2ltcGxlU2NoZW1hIiwiT3B0SW5zQ29sbGVjdGlvbiIsIkNvbGxlY3Rpb24iLCJpbnNlcnQiLCJjYWxsYmFjayIsIm91ck9wdEluIiwicmVjaXBpZW50X3NlbmRlciIsInJlY2lwaWVudCIsInNlbmRlciIsImNyZWF0ZWRBdCIsIkRhdGUiLCJyZXN1bHQiLCJ1cGRhdGUiLCJzZWxlY3RvciIsIm1vZGlmaWVyIiwicmVtb3ZlIiwiZGVueSIsInNjaGVtYSIsIl9pZCIsInR5cGUiLCJTdHJpbmciLCJyZWdFeCIsIlJlZ0V4IiwiSWQiLCJvcHRpb25hbCIsImRlbnlVcGRhdGUiLCJpbmRleCIsIkludGVnZXIiLCJuYW1lSWQiLCJ0eElkIiwibWFzdGVyRG9pIiwiY29uZmlybWVkQXQiLCJjb25maXJtZWRCeSIsIklQIiwiY29uZmlybWF0aW9uVG9rZW4iLCJhdHRhY2hTY2hlbWEiLCJSZWNpcGllbnRzIiwicmVjaXBpZW50R2V0IiwicGlwZWxpbmUiLCJwdXNoIiwiJHJlZGFjdCIsIiRjb25kIiwiaWYiLCIkY21wIiwidGhlbiIsImVsc2UiLCIkbG9va3VwIiwiZnJvbSIsImxvY2FsRmllbGQiLCJmb3JlaWduRmllbGQiLCJhcyIsIiR1bndpbmQiLCIkcHJvamVjdCIsImFnZ3JlZ2F0ZSIsInJJZHMiLCJmb3JFYWNoIiwiZWxlbWVudCIsIlJlY2lwaWVudEVtYWlsIiwicmVjaXBpZW50c0FsbCIsIlJlY2lwaWVudHNDb2xsZWN0aW9uIiwib3VyUmVjaXBpZW50IiwiZW1haWwiLCJwcml2YXRlS2V5IiwidW5pcXVlIiwicHVibGljS2V5IiwiRG9pY2hhaW5FbnRyaWVzIiwiRG9pY2hhaW5FbnRyaWVzQ29sbGVjdGlvbiIsImVudHJ5IiwidmFsdWUiLCJhZGRyZXNzIiwiZ2V0S2V5UGFpck0iLCJnZXRCYWxhbmNlTSIsImdldEtleVBhaXIiLCJnZXRCYWxhbmNlIiwibG9nVmFsIiwiT1BUSU5TX01FVEhPRFMiLCJnZXRMYW5ndWFnZXMiLCJnZXRBbGxMYW5ndWFnZXMiLCJNZXRhIiwiTWV0YUNvbGxlY3Rpb24iLCJvdXJEYXRhIiwia2V5IiwiU2VuZGVycyIsIlNlbmRlcnNDb2xsZWN0aW9uIiwib3VyU2VuZGVyIiwidmVyc2lvbiIsIkRPSV9NQUlMX0ZFVENIX1VSTCIsImxvZ1NlbmQiLCJFeHBvcnREb2lzRGF0YVNjaGVtYSIsInN0YXR1cyIsInJvbGUiLCJ1c2VyaWQiLCJpZCIsImV4cG9ydERvaXMiLCIkbWF0Y2giLCIkZXhpc3RzIiwiJG5lIiwidW5kZWZpbmVkIiwib3B0SW5zIiwiZXhwb3J0RG9pRGF0YSIsIkpTT04iLCJzdHJpbmdpZnkiLCJleGNlcHRpb24iLCJleHBvcnREZWZhdWx0IiwiRE9JX0ZFVENIX1JPVVRFIiwiRE9JX0NPTkZJUk1BVElPTl9ST1VURSIsIkFQSV9QQVRIIiwiVkVSU0lPTiIsImdldFVybCIsIkNPTkZJUk1fQ0xJRU5UIiwiQ09ORklSTV9BRERSRVNTIiwiZ2V0SHR0cEdFVCIsInNpZ25NZXNzYWdlIiwicGFyc2VUZW1wbGF0ZSIsImdlbmVyYXRlRG9pVG9rZW4iLCJnZW5lcmF0ZURvaUhhc2giLCJhZGRTZW5kTWFpbEpvYiIsImxvZ0NvbmZpcm0iLCJsb2dFcnJvciIsIkZldGNoRG9pTWFpbERhdGFTY2hlbWEiLCJkb21haW4iLCJmZXRjaERvaU1haWxEYXRhIiwidXJsIiwic2lnbmF0dXJlIiwicXVlcnkiLCJlbmNvZGVVUklDb21wb25lbnQiLCJyZXNwb25zZSIsInJlc3BvbnNlRGF0YSIsImluY2x1ZGVzIiwib3B0SW5JZCIsImZpbmRPbmUiLCJ0b2tlbiIsImNvbmZpcm1hdGlvbkhhc2giLCJyZWRpcmVjdCIsImNvbmZpcm1hdGlvblVybCIsInRlbXBsYXRlIiwiY29udGVudCIsImNvbmZpcm1hdGlvbl91cmwiLCJ0byIsInN1YmplY3QiLCJtZXNzYWdlIiwicmV0dXJuUGF0aCIsImdldE9wdEluUHJvdmlkZXIiLCJnZXRPcHRJbktleSIsInZlcmlmeVNpZ25hdHVyZSIsIkFjY291bnRzIiwiR2V0RG9pTWFpbERhdGFTY2hlbWEiLCJuYW1lX2lkIiwidXNlclByb2ZpbGVTY2hlbWEiLCJFbWFpbCIsInRlbXBsYXRlVVJMIiwiZ2V0RG9pTWFpbERhdGEiLCJwYXJ0cyIsInNwbGl0IiwibGVuZ3RoIiwicHJvdmlkZXIiLCJkb2lNYWlsRGF0YSIsImRlZmF1bHRSZXR1cm5EYXRhIiwicmV0dXJuRGF0YSIsIm93bmVyIiwidXNlcnMiLCJtYWlsVGVtcGxhdGUiLCJwcm9maWxlIiwicmVzb2x2ZVR4dCIsIkZBTExCQUNLX1BST1ZJREVSIiwiaXNSZWd0ZXN0IiwiaXNUZXN0bmV0IiwiT1BUX0lOX0tFWSIsIk9QVF9JTl9LRVlfVEVTVE5FVCIsIkdldE9wdEluS2V5U2NoZW1hIiwib3VyT1BUX0lOX0tFWSIsImZvdW5kS2V5IiwiZG5za2V5IiwidXNlRmFsbGJhY2siLCJQUk9WSURFUl9LRVkiLCJQUk9WSURFUl9LRVlfVEVTVE5FVCIsIkdldE9wdEluUHJvdmlkZXJTY2hlbWEiLCJvdXJQUk9WSURFUl9LRVkiLCJwcm92aWRlcktleSIsImdldFdpZiIsImFkZEZldGNoRG9pTWFpbERhdGFKb2IiLCJnZXRQcml2YXRlS2V5RnJvbVdpZiIsImRlY3J5cHRNZXNzYWdlIiwiQWRkRG9pY2hhaW5FbnRyeVNjaGVtYSIsImFkZERvaWNoYWluRW50cnkiLCJvdXJFbnRyeSIsImV0eSIsInBhcnNlIiwid2lmIiwibmFtZVBvcyIsImluZGV4T2YiLCJzdWJzdHJpbmciLCJleHBpcmVzSW4iLCJleHBpcmVkIiwibGlzdFNpbmNlQmxvY2siLCJuYW1lU2hvdyIsImdldFJhd1RyYW5zYWN0aW9uIiwiYWRkT3JVcGRhdGVNZXRhIiwiVFhfTkFNRV9TVEFSVCIsIkxBU1RfQ0hFQ0tFRF9CTE9DS19LRVkiLCJjaGVja05ld1RyYW5zYWN0aW9uIiwidHhpZCIsImpvYiIsImxhc3RDaGVja2VkQmxvY2siLCJyZXQiLCJ0cmFuc2FjdGlvbnMiLCJ0eHMiLCJsYXN0YmxvY2siLCJhZGRyZXNzVHhzIiwiZmlsdGVyIiwidHgiLCJzdGFydHNXaXRoIiwidHhOYW1lIiwiYWRkVHgiLCJkb25lIiwidm91dCIsInNjcmlwdFB1YktleSIsIm5hbWVPcCIsIm9wIiwiYWRkcmVzc2VzIiwiY3J5cHRvIiwiZWNpZXMiLCJEZWNyeXB0TWVzc2FnZVNjaGVtYSIsIkJ1ZmZlciIsImVjZGgiLCJjcmVhdGVFQ0RIIiwic2V0UHJpdmF0ZUtleSIsImRlY3J5cHQiLCJ0b1N0cmluZyIsIkVuY3J5cHRNZXNzYWdlU2NoZW1hIiwiZW5jcnlwdE1lc3NhZ2UiLCJlbmNyeXB0IiwiR2VuZXJhdGVOYW1lSWRTY2hlbWEiLCJnZW5lcmF0ZU5hbWVJZCIsIiRzZXQiLCJDcnlwdG9KUyIsIkJhc2U1OCIsIlZFUlNJT05fQllURSIsIlZFUlNJT05fQllURV9SRUdURVNUIiwiR2V0QWRkcmVzc1NjaGVtYSIsImdldEFkZHJlc3MiLCJfZ2V0QWRkcmVzcyIsInB1YktleSIsImxpYiIsIldvcmRBcnJheSIsImNyZWF0ZSIsIlNIQTI1NiIsIlJJUEVNRDE2MCIsInZlcnNpb25CeXRlIiwiY29uY2F0IiwiY2hlY2tzdW0iLCJlbmNvZGUiLCJnZXRfQmFsYW5jZSIsImJhbCIsIkdldERhdGFIYXNoU2NoZW1hIiwiZ2V0RGF0YUhhc2giLCJoYXNoIiwicmFuZG9tQnl0ZXMiLCJzZWNwMjU2azEiLCJwcml2S2V5IiwicHJpdmF0ZUtleVZlcmlmeSIsInB1YmxpY0tleUNyZWF0ZSIsInRvVXBwZXJDYXNlIiwiR2V0UHJpdmF0ZUtleUZyb21XaWZTY2hlbWEiLCJfZ2V0UHJpdmF0ZUtleUZyb21XaWYiLCJkZWNvZGUiLCJlbmRzV2l0aCIsIkdldFB1YmxpY0tleVNjaGVtYSIsImdldFB1YmxpY0tleUFuZEFkZHJlc3MiLCJkZXN0QWRkcmVzcyIsImJpdGNvcmUiLCJNZXNzYWdlIiwiR2V0U2lnbmF0dXJlU2NoZW1hIiwiZ2V0U2lnbmF0dXJlIiwic2lnbiIsIlByaXZhdGVLZXkiLCJTRU5EX0NMSUVOVCIsImxvZ0Jsb2NrY2hhaW4iLCJmZWVEb2kiLCJuYW1lRG9pIiwiSW5zZXJ0U2NoZW1hIiwiZGF0YUhhc2giLCJzb2lEYXRlIiwicHVibGljS2V5QW5kQWRkcmVzcyIsIm5hbWVWYWx1ZSIsImZlZURvaVR4IiwibmFtZURvaVR4IiwiZ2V0VHJhbnNhY3Rpb24iLCJET0lfQ09ORklSTUFUSU9OX05PVElGWV9ST1VURSIsImdldEh0dHBQVVQiLCJVcGRhdGVTY2hlbWEiLCJob3N0IiwiZnJvbUhvc3RVcmwiLCJuYW1lX2RhdGEiLCJyZXJ1biIsIm91cl90cmFuc2FjdGlvbiIsImNvbmZpcm1hdGlvbnMiLCJvdXJmcm9tSG9zdFVybCIsInVwZGF0ZURhdGEiLCJjYW5jZWwiLCJyZXN0YXJ0IiwiZXJyIiwibG9nVmVyaWZ5IiwiTkVUV09SSyIsIk5ldHdvcmtzIiwiYWxpYXMiLCJwdWJrZXloYXNoIiwicHJpdmF0ZWtleSIsInNjcmlwdGhhc2giLCJuZXR3b3JrTWFnaWMiLCJWZXJpZnlTaWduYXR1cmVTY2hlbWEiLCJBZGRyZXNzIiwiZnJvbVB1YmxpY0tleSIsIlB1YmxpY0tleSIsInZlcmlmeSIsImFkZEluc2VydEJsb2NrY2hhaW5Kb2IiLCJXcml0ZVRvQmxvY2tjaGFpblNjaGVtYSIsIndyaXRlVG9CbG9ja2NoYWluIiwiSGFzaElkcyIsIkRlY29kZURvaUhhc2hTY2hlbWEiLCJkZWNvZGVEb2lIYXNoIiwib3VySGFzaCIsImhleCIsImRlY29kZUhleCIsIm9iaiIsIkdlbmVyYXRlRG9pSGFzaFNjaGVtYSIsImpzb24iLCJlbmNvZGVIZXgiLCJQTEFDRUhPTERFUl9SRUdFWCIsIlBhcnNlVGVtcGxhdGVTY2hlbWEiLCJPYmplY3QiLCJibGFja2JveCIsIl9tYXRjaCIsImV4ZWMiLCJfcmVwbGFjZVBsYWNlaG9sZGVyIiwicmVwbGFjZSIsInJlcCIsIkRPSV9NQUlMX0RFRkFVTFRfRU1BSUxfRlJPTSIsIlNlbmRNYWlsU2NoZW1hIiwic2VuZE1haWwiLCJtYWlsIiwib3VyTWFpbCIsInNlbmQiLCJodG1sIiwiaGVhZGVycyIsIkpvYiIsIkJsb2NrY2hhaW5Kb2JzIiwiYWRkQ2hlY2tOZXdUcmFuc2FjdGlvbnNCbG9ja2NoYWluSm9iIiwicmV0cnkiLCJyZXRyaWVzIiwid2FpdCIsInNhdmUiLCJjYW5jZWxSZXBlYXRzIiwiREFwcEpvYnMiLCJBZGRGZXRjaERvaU1haWxEYXRhSm9iU2NoZW1hIiwiQWRkSW5zZXJ0QmxvY2tjaGFpbkpvYlNjaGVtYSIsIk1haWxKb2JzIiwiQWRkU2VuZE1haWxKb2JTY2hlbWEiLCJBZGRVcGRhdGVCbG9ja2NoYWluSm9iU2NoZW1hIiwiYWRkVXBkYXRlQmxvY2tjaGFpbkpvYiIsIkFkZE9yVXBkYXRlTWV0YVNjaGVtYSIsIm1ldGEiLCJBZGRPcHRJblNjaGVtYSIsImZldGNoIiwiYWRkUmVjaXBpZW50IiwiYWRkU2VuZGVyIiwicmVjaXBpZW50X21haWwiLCJzZW5kZXJfbWFpbCIsIm1hc3Rlcl9kb2kiLCJyZWNpcGllbnRJZCIsInNlbmRlcklkIiwiQ29uZmlybU9wdEluU2NoZW1hIiwiY29uZmlybU9wdEluIiwicmVxdWVzdCIsIm91clJlcXVlc3QiLCJkZWNvZGVkIiwiZW50cmllcyIsIiRvciIsImRvaVNpZ25hdHVyZSIsImRvaVRpbWVzdGFtcCIsInRvSVNPU3RyaW5nIiwianNvblZhbHVlIiwiR2VuZXJhdGVEb2lUb2tlblNjaGVtYSIsIlVwZGF0ZU9wdEluU3RhdHVzU2NoZW1hIiwidXBkYXRlT3B0SW5TdGF0dXMiLCJWRVJJRllfQ0xJRU5UIiwiVmVyaWZ5T3B0SW5TY2hlbWEiLCJyZWNpcGllbnRfcHVibGljX2tleSIsInZlcmlmeU9wdEluIiwibmFtZUlkRm91bmQiLCJlbnRyeURhdGEiLCJmaXJzdENoZWNrIiwic29pU2lnbmF0dXJlU3RhdHVzIiwiZG9pU2lnbmF0dXJlU3RhdHVzIiwic2Vjb25kQ2hlY2siLCJBZGRSZWNpcGllbnRTY2hlbWEiLCJyZWNpcGllbnRzIiwia2V5UGFpciIsIkFkZFNlbmRlclNjaGVtYSIsInNlbmRlcnMiLCJpc0RlYnVnIiwic2V0dGluZ3MiLCJhcHAiLCJkZWJ1ZyIsInJlZ3Rlc3QiLCJ0ZXN0bmV0IiwicG9ydCIsImFic29sdXRlVXJsIiwibmFtZWNvaW4iLCJTRU5EX0FQUCIsIkNPTkZJUk1fQVBQIiwiVkVSSUZZX0FQUCIsImlzQXBwVHlwZSIsInNlbmRTZXR0aW5ncyIsInNlbmRDbGllbnQiLCJkb2ljaGFpbiIsImNyZWF0ZUNsaWVudCIsImNvbmZpcm1TZXR0aW5ncyIsImNvbmZpcm0iLCJjb25maXJtQ2xpZW50IiwiY29uZmlybUFkZHJlc3MiLCJ2ZXJpZnlTZXR0aW5ncyIsInZlcmlmeUNsaWVudCIsIkNsaWVudCIsInVzZXIiLCJ1c2VybmFtZSIsInBhc3MiLCJwYXNzd29yZCIsIkhhc2hpZHMiLCJkb2lNYWlsRmV0Y2hVcmwiLCJkZWZhdWx0RnJvbSIsInNtdHAiLCJzdGFydHVwIiwicHJvY2VzcyIsImVudiIsIk1BSUxfVVJMIiwic2VydmVyIiwiTk9ERV9UTFNfUkVKRUNUX1VOQVVUSE9SSVpFRCIsIkFzc2V0cyIsImdldFRleHQiLCJjb3VudCIsImNyZWF0ZVVzZXIiLCJhZGRVc2Vyc1RvUm9sZXMiLCJzdGFydEpvYlNlcnZlciIsImNvbnNvbGUiLCJzZW5kTW9kZVRhZ0NvbG9yIiwiY29uZmlybU1vZGVUYWdDb2xvciIsInZlcmlmeU1vZGVUYWdDb2xvciIsImJsb2NrY2hhaW5Nb2RlVGFnQ29sb3IiLCJ0ZXN0aW5nTW9kZVRhZ0NvbG9yIiwibG9nTWFpbiIsInRlc3RMb2dnaW5nIiwicmVxdWlyZSIsIm1zZyIsImNvbG9ycyIsInBhcmFtIiwidGltZSIsInRhZyIsImxvZyIsIkFVVEhfTUVUSE9EUyIsInR5cGVzIiwiY29uZmlnIiwic2VuZFZlcmlmaWNhdGlvbkVtYWlsIiwiZm9yYmlkQ2xpZW50QWNjb3VudENyZWF0aW9uIiwiZW1haWxUZW1wbGF0ZXMiLCJBcGkiLCJET0lfV0FMTEVUTk9USUZZX1JPVVRFIiwiYWRkUm91dGUiLCJhdXRoUmVxdWlyZWQiLCJnZXQiLCJhY3Rpb24iLCJ1cmxQYXJhbXMiLCJpcCIsImNvbm5lY3Rpb24iLCJyZW1vdGVBZGRyZXNzIiwic29ja2V0Iiwic3RhdHVzQ29kZSIsImJvZHkiLCJwYXJhbXMiLCJxdWVyeVBhcmFtcyIsIkRPSV9FWFBPUlRfUk9VVEUiLCJwb3N0IiwicVBhcmFtcyIsImJQYXJhbXMiLCJib2R5UGFyYW1zIiwidWlkIiwiY29uc3RydWN0b3IiLCJBcnJheSIsInByZXBhcmVDb0RPSSIsInByZXBhcmVBZGQiLCJwdXQiLCJ2YWwiLCJvd25lcklEIiwiY3VycmVudE9wdEluSWQiLCJyZXRSZXNwb25zZSIsInJldF9yZXNwb25zZSIsImdldEluZm8iLCJleCIsIm1haWxUZW1wbGF0ZVNjaGVtYSIsImNyZWF0ZVVzZXJTY2hlbWEiLCJ1cGRhdGVVc2VyU2NoZW1hIiwiY29sbGVjdGlvbk9wdGlvbnMiLCJwYXRoIiwicm91dGVPcHRpb25zIiwiZXhjbHVkZWRFbmRwb2ludHMiLCJlbmRwb2ludHMiLCJkZWxldGUiLCJyb2xlUmVxdWlyZWQiLCJwYXJhbUlkIiwiYWRkQ29sbGVjdGlvbiIsIlJlc3RpdnVzIiwiYXBpUGF0aCIsInVzZURlZmF1bHRBdXRoIiwicHJldHR5SnNvbiIsIkpvYkNvbGxlY3Rpb24iLCJwcm9jZXNzSm9icyIsIndvcmtUaW1lb3V0IiwiY2IiLCJmYWlsIiwicGF1c2UiLCJyZXBlYXQiLCJzY2hlZHVsZSIsImxhdGVyIiwidGV4dCIsInEiLCJwb2xsSW50ZXJ2YWwiLCJjdXJyZW50Iiwic2V0TWludXRlcyIsImdldE1pbnV0ZXMiLCJpZHMiLCIkaW4iLCJqb2JTdGF0dXNSZW1vdmFibGUiLCJ1cGRhdGVkIiwiJGx0IiwicmVtb3ZlSm9icyIsIm9ic2VydmUiLCJhZGRlZCIsInRyaWdnZXIiLCJkbnMiLCJzeW5jRnVuYyIsIndyYXBBc3luYyIsImRuc19yZXNvbHZlVHh0IiwicmVjb3JkcyIsInJlY29yZCIsInRyaW0iLCJnZXRTZXJ2ZXJzIiwiZ2V0QWRkcmVzc2VzQnlBY2NvdW50IiwiZ2V0TmV3QWRkcmVzcyIsIk5BTUVTUEFDRSIsImNsaWVudCIsImRvaWNoYWluX2R1bXBwcml2a2V5Iiwib3VyQWRkcmVzcyIsImNtZCIsImFjY291dCIsImRvaWNoYWluX2dldGFkZHJlc3Nlc2J5YWNjb3VudCIsImFjY291bnQiLCJvdXJBY2NvdW50IiwiZG9pY2hhaW5fZ2V0bmV3YWRkcmVzcyIsImRvaWNoYWluX3NpZ25NZXNzYWdlIiwib3VyTWVzc2FnZSIsImRvaWNoYWluX25hbWVTaG93Iiwib3VySWQiLCJjaGVja0lkIiwiZG9pY2hhaW5fZmVlRG9pIiwiZG9pY2hhaW5fbmFtZURvaSIsIm91ck5hbWUiLCJvdXJWYWx1ZSIsImJsb2NrIiwiZG9pY2hhaW5fbGlzdFNpbmNlQmxvY2siLCJvdXJCbG9jayIsImRvaWNoYWluX2dldHRyYW5zYWN0aW9uIiwiZG9pY2hhaW5fZ2V0cmF3dHJhbnNhY3Rpb24iLCJkb2ljaGFpbl9nZXRiYWxhbmNlIiwiZG9pY2hhaW5fZ2V0aW5mbyIsIkRPSV9QUkVGSVgiLCJyZXRfdmFsIiwiZ2V0SHR0cEdFVGRhdGEiLCJnZXRIdHRwUE9TVCIsIkhUVFAiLCJfZ2V0IiwiX2dldERhdGEiLCJfcG9zdCIsIl9wdXQiLCJvdXJVcmwiLCJvdXJRdWVyeSIsImxvZ2luIiwicmVxdWVzdERPSSIsImdldE5hbWVJZE9mUmF3VHJhbnNhY3Rpb24iLCJnZXROYW1lSWRPZk9wdEluRnJvbVJhd1R4IiwiZmV0Y2hDb25maXJtTGlua0Zyb21Qb3AzTWFpbCIsImRlbGV0ZUFsbEVtYWlsc0Zyb21Qb3AzIiwiY29uZmlybUxpbmsiLCJ2ZXJpZnlET0kiLCJmaW5kVXNlciIsImZpbmRPcHRJbiIsImV4cG9ydE9wdElucyIsInJlcXVlc3RDb25maXJtVmVyaWZ5QmFzaWNEb2kiLCJ1cGRhdGVVc2VyIiwicmVzZXRVc2VycyIsImNoYWkiLCJxdW90ZWRQcmludGFibGVEZWNvZGUiLCJnZW5lcmF0ZXRvYWRkcmVzcyIsIm9zIiwiUE9QM0NsaWVudCIsInBhcmFtc0xvZ2luIiwidXJsTG9naW4iLCJoZWFkZXJzTG9naW4iLCJyZWFsRGF0YUxvZ2luIiwiZGF0YUxvZ2luIiwic3RhdHVzTG9naW4iLCJhc3NlcnQiLCJlcXVhbCIsImF1dGgiLCJ1cmxPcHRJbiIsImRhdGFPcHRJbiIsImhlYWRlcnNPcHRJbiIsImF1dGhUb2tlbiIsInJlYWxEYXRhT3B0SW4iLCJyZXN1bHRPcHRJbiIsImlzQXJyYXkiLCJnZXRfbmFtZWlkX29mX3Jhd190cmFuc2FjdGlvbiIsInJ1bm5pbmciLCJjb3VudGVyIiwibG9vcCIsImRhdGFHZXRSYXdUcmFuc2FjdGlvbiIsInJlYWxkYXRhR2V0UmF3VHJhbnNhY3Rpb24iLCJyZXN1bHRHZXRSYXdUcmFuc2FjdGlvbiIsIlByb21pc2UiLCJyZXNvbHZlIiwic2V0VGltZW91dCIsImdldF9uYW1laWRfb2Zfb3B0aW5fZnJvbV9yYXd0eCIsIm91cl9vcHRJbiIsIm5vdEVxdWFsIiwiaXNCZWxvdyIsImhvc3RuYW1lIiwiYWxpY2VkYXBwX3VybCIsImZldGNoX2NvbmZpcm1fbGlua19mcm9tX3BvcDNfbWFpbCIsInRsc2VycnMiLCJlbmFibGV0bHMiLCJvbiIsInJhd2RhdGEiLCJsaXN0IiwibXNnY291bnQiLCJtc2dudW1iZXIiLCJyc2V0IiwicmV0ciIsIm1haWxkYXRhIiwicmVwbGFjZUFsbCIsImV4cGVjdCIsIm5vdCIsImxpbmtkYXRhIiwiYmUiLCJudWxsIiwicmVxdWVzdERhdGEiLCJkZWxlIiwicXVpdCIsImVuZCIsInN0ciIsIlJlZ0V4cCIsImRlbGV0ZV9hbGxfZW1haWxzX2Zyb21fcG9wMyIsImkiLCJjb25maXJtX2xpbmsiLCJkb2lDb25maXJtbGlua1Jlc3VsdCIsImhhdmUiLCJzdHJpbmciLCJlIiwiZEFwcFVybCIsImRBcHBVcmxBdXRoIiwibm9kZV91cmxfYWxpY2UiLCJycGNBdXRoQWxpY2UiLCJ2ZXJpZnlfZG9pIiwib3VyX3JlY2lwaWVudF9tYWlsIiwidXJsVmVyaWZ5IiwicmVzdWx0VmVyaWZ5Iiwic3RhdHVzVmVyaWZ5IiwiZGF0YVZlcmlmeSIsImhlYWRlcnNWZXJpZnkiLCJyZWFsZGF0YVZlcmlmeSIsImdsb2JhbCIsImFsaWNlQWRkcmVzcyIsImhlYWRlcnNVc2VyIiwidXJsVXNlcnMiLCJkYXRhVXNlciIsInJlYWxEYXRhVXNlciIsInJlcyIsInVybEV4cG9ydCIsImRhcHBVcmxBbGljZSIsImRhdGFMb2dpbkFsaWNlIiwiZGFwcFVybEJvYiIsIm9wdGlvbmFsRGF0YSIsInJlY2lwaWVudF9wb3AzdXNlcm5hbWUiLCJyZWNpcGllbnRfcG9wM3Bhc3N3b3JkIiwicmVxdWVzdF9jb25maXJtX3ZlcmlmeV9iYXNpY19kb2kiLCJzZW5kZXJfbWFpbF9pbiIsInJlc3VsdERhdGFPcHRJblRtcCIsInJlc3VsdERhdGFPcHRJbiIsImNvbmZpcm1lZExpbmsiLCJsaW5rMkNvbmZpcm0iLCJ0bXBJZCIsInVwZGF0ZUlkIiwidXNEYXQiLCJpbml0QmxvY2tjaGFpbiIsImlzTm9kZUFsaXZlIiwiaXNOb2RlQWxpdmVBbmRDb25uZWN0ZWRUb0hvc3QiLCJpbXBvcnRQcml2S2V5Iiwid2FpdFRvU3RhcnRDb250YWluZXIiLCJkZWxldGVPcHRJbnNGcm9tQWxpY2VBbmRCb2IiLCJzdGFydDNyZE5vZGUiLCJzdG9wRG9ja2VyQm9iIiwiZ2V0Q29udGFpbmVySWRPZk5hbWUiLCJzdGFydERvY2tlckJvYiIsImRvaWNoYWluQWRkTm9kZSIsImdldERvY2tlclN0YXR1cyIsImNvbm5lY3REb2NrZXJCb2IiLCJydW5BbmRXYWl0Iiwic3VkbyIsIm5vZGVfdXJsX2JvYiIsInJwY0F1dGgiLCJwcml2S2V5Qm9iIiwiYWxpY2VDb250YWluZXJJZCIsInN0YXR1c0RvY2tlciIsImJhbGFuY2UiLCJOdW1iZXIiLCJjb25uZWN0aW9ucyIsIndhaXRfdG9fc3RhcnRfY29udGFpbmVyIiwic3RhcnRlZENvbnRhaW5lcklkIiwiZXJyb3IyIiwiZGVsZXRlX29wdGlvbnNfZnJvbV9hbGljZV9hbmRfYm9iIiwiY29udGFpbmVySWQiLCJzdGRvdXQiLCJzdGRlcnIiLCJkYXRhR2V0TmV0d29ya0luZm8iLCJyZWFsZGF0YUdldE5ldHdvcmtJbmZvIiwicmVzdWx0R2V0TmV0d29ya0luZm8iLCJzdGF0dXNHZXROZXR3b3JrSW5mbyIsInN0YXR1c0FkZE5vZGUiLCJkYXRhR2V0UGVlckluZm8iLCJyZWFsZGF0YUdldFBlZXJJbmZvIiwicmVzdWx0R2V0UGVlckluZm8iLCJzdGF0dXNHZXRQZWVySW5mbyIsImlzQWJvdmUiLCJyZXNjYW4iLCJkYXRhX2ltcG9ydHByaXZrZXkiLCJyZWFsZGF0YV9pbXBvcnRwcml2a2V5IiwiZGF0YUdldE5ld0FkZHJlc3MiLCJyZWFsZGF0YUdldE5ld0FkZHJlc3MiLCJyZXN1bHRHZXROZXdBZGRyZXNzIiwic3RhdHVzT3B0SW5HZXROZXdBZGRyZXNzIiwibmV3QWRkcmVzcyIsInRvYWRkcmVzcyIsImFtb3VudCIsImRhdGFHZW5lcmF0ZSIsImhlYWRlcnNHZW5lcmF0ZXMiLCJyZWFsZGF0YUdlbmVyYXRlIiwicmVzdWx0R2VuZXJhdGUiLCJzdGF0dXNSZXN1bHRHZW5lcmF0ZSIsImRhdGFHZXRCYWxhbmNlIiwicmVhbGRhdGFHZXRCYWxhbmNlIiwicmVzdWx0R2V0QmFsYW5jZSIsImdldF9jb250YWluZXJfaWRfb2ZfbmFtZSIsImJvYnNDb250YWluZXJJZCIsInN0b3BfZG9ja2VyX2JvYiIsImRvaWNoYWluX2FkZF9ub2RlIiwiZ2V0X2RvY2tlcl9zdGF0dXMiLCJzdGFydF9kb2NrZXJfYm9iIiwiY29ubmVjdF9kb2NrZXJfYm9iIiwic3RhcnRfM3JkX25vZGUiLCJuZXR3b3JrIiwicnVuX2FuZF93YWl0IiwicnVuZnVuY3Rpb24iLCJzZWNvbmRzIiwiaXNBcHBUZXN0IiwiZGVzY3JpYmUiLCJ0aW1lb3V0IiwiYmVmb3JlIiwiaXQiLCJhbGljZUJhbGFuY2UiLCJkQXBwTG9naW4iLCJ0ZW1wbGF0ZVVybEEiLCJ0ZW1wbGF0ZVVybEIiLCJhbGljZUFMb2dpbiIsImFsaWNlQkxvZ2luIiwibG9nQWRtaW4iLCJ1c2VyQSIsInVzZXJCIiwic2VuZGVyX21haWxfYWxpY2VfYSIsInNlbmRlcl9tYWlsX2FsaWNlX2IiLCJsb2dVc2VyQSIsImxvZ1VzZXJCIiwiZXhwb3J0ZWRPcHRJbnMiLCJleHBvcnRlZE9wdEluc0EiLCJ1c2VyVXAiLCJjaGFuZ2VkRGF0YSIsImxvZ1VzZXJVcCIsImNvRG9pTGlzdCIsImNvRG9pcyIsImFkTG9nIiwicmV0dXJuZWREYXRhIiwic3Rkb3V0MiIsInN0ZGVycjIiLCJpc1Rlc3QiLCJiZWZvcmVFYWNoIiwieGRlc2NyaWJlIiwieGl0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLElBQUlBLE1BQUo7QUFBV0MsTUFBTSxDQUFDQyxJQUFQLENBQVksZUFBWixFQUE0QjtBQUFDRixRQUFNLENBQUNHLENBQUQsRUFBRztBQUFDSCxVQUFNLEdBQUNHLENBQVA7QUFBUzs7QUFBcEIsQ0FBNUIsRUFBa0QsQ0FBbEQ7QUFBcUQsSUFBSUMsS0FBSjtBQUFVSCxNQUFNLENBQUNDLElBQVAsQ0FBWSx1QkFBWixFQUFvQztBQUFDRSxPQUFLLENBQUNELENBQUQsRUFBRztBQUFDQyxTQUFLLEdBQUNELENBQU47QUFBUTs7QUFBbEIsQ0FBcEMsRUFBd0QsQ0FBeEQ7QUFBMkQsSUFBSUUsTUFBSjtBQUFXSixNQUFNLENBQUNDLElBQVAsQ0FBWSxlQUFaLEVBQTRCO0FBQUNHLFFBQU0sQ0FBQ0YsQ0FBRCxFQUFHO0FBQUNFLFVBQU0sR0FBQ0YsQ0FBUDtBQUFTOztBQUFwQixDQUE1QixFQUFrRCxDQUFsRDtBQUtoSkgsTUFBTSxDQUFDTSxPQUFQLENBQWUsYUFBZixFQUE4QixTQUFTQyxTQUFULEdBQXFCO0FBQ2pELE1BQUcsQ0FBQyxLQUFLQyxNQUFULEVBQWlCO0FB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a0IsV0FBUyxDQUFDLHFCQUFELEVBQXdCLFlBQVk7QUFHekM7Ozs7Ozs7Ozs7Ozs7O0FBYUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXlESCxHQXpFUSxDQUFUO0FBMEVILEM7Ozs7Ozs7Ozs7O0FDcEhELElBQUkzTSxJQUFKO0FBQVMvbkIsTUFBTSxDQUFDQyxJQUFQLENBQVksNkJBQVosRUFBMEM7QUFBQzhuQixNQUFJLENBQUM3bkIsQ0FBRCxFQUFHO0FBQUM2bkIsUUFBSSxHQUFDN25CLENBQUw7QUFBTzs7QUFBaEIsQ0FBMUMsRUFBNEQsQ0FBNUQ7O0FBQ1QsSUFBR0gsTUFBTSxDQUFDeTBCLE1BQVYsRUFBa0I7QUFFZDVCLFVBQVEsQ0FBQyxvQkFBRCxFQUF1QixZQUFZLENBQzFDLENBRE8sQ0FBUjtBQUVILEM7Ozs7Ozs7Ozs7O0FDTEQ1eUIsTUFBTSxDQUFDQyxJQUFQLENBQVkseUJBQVo7QUFBdUNELE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGdCQUFaLEUiLCJmaWxlIjoiL2FwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IHsgUm9sZXMgfSBmcm9tICdtZXRlb3IvYWxhbm5pbmc6cm9sZXMnO1xuXG5pbXBvcnQgeyBPcHRJbnMgfSBmcm9tICcuLi9vcHQtaW5zLmpzJztcblxuTWV0ZW9yLnB1Ymxpc2goJ29wdC1pbnMuYWxsJywgZnVuY3Rpb24gT3B0SW5zQWxsKCkge1xuICBpZighdGhpcy51c2VySWQpIHtcbiAgICByZXR1cm4gdGhpcy5yZWFkeSgpO1xuICB9XG4gIGlmKCFSb2xlcy51c2VySXNJblJvbGUodGhpcy51c2VySWQsIFsnYWRtaW4nXSkpe1xuICAgIHJldHVybiBPcHRJbnMuZmluZCh7b3duZXJJZDp0aGlzLnVzZXJJZH0sIHtcbiAgICAgIGZpZWxkczogT3B0SW5zLnB1YmxpY0ZpZWxkcyxcbiAgICB9KTtcbiAgfVxuICBcblxuICByZXR1cm4gT3B0SW5zLmZpbmQoe30sIHtcbiAgICBmaWVsZHM6IE9wdElucy5wdWJsaWNGaWVsZHMsXG4gIH0pO1xufSk7XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCB7IEREUFJhdGVMaW1pdGVyIH0gZnJvbSAnbWV0ZW9yL2RkcC1yYXRlLWxpbWl0ZXInO1xuaW1wb3J0IHsgX2kxOG4gYXMgaTE4biB9IGZyb20gJ21ldGVvci91bml2ZXJzZTppMThuJztcbmltcG9ydCB7IFZhbGlkYXRlZE1ldGhvZCB9IGZyb20gJ21ldGVvci9tZGc6dmFsaWRhdGVkLW1ldGhvZCc7XG5pbXBvcnQgeyBSb2xlcyB9IGZyb20gJ21ldGVvci9hbGFubmluZzpyb2xlcyc7XG5pbXBvcnQgeyBfIH0gZnJvbSAnbWV0ZW9yL3VuZGVyc2NvcmUnO1xuaW1wb3J0IGFkZE9wdEluIGZyb20gJy4uLy4uL21vZHVsZXMvc2VydmVyL29wdC1pbnMvYWRkX2FuZF93cml0ZV90b19ibG9ja2NoYWluLmpzJztcblxuY29uc3QgYWRkID0gbmV3IFZhbGlkYXRlZE1ldGhvZCh7XG4gIG5hbWU6ICdvcHQtaW5zLmFkZCcsXG4gIHZhbGlkYXRlOiBudWxsLFxuICBydW4oeyByZWNpcGllbnRNYWlsLCBzZW5kZXJNYWlsLCBkYXRhIH0pIHtcbiAgICBpZighdGhpcy51c2VySWQgfHwgIVJvbGVzLnVzZXJJc0luUm9sZSh0aGlzLnVzZXJJZCwgWydhZG1pbiddKSkge1xuICAgICAgY29uc3QgZXJyb3IgPSBcImFwaS5vcHQtaW5zLmFkZC5hY2Nlc3NEZW5pZWRcIjtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoZXJyb3IsIGkxOG4uX18oZXJyb3IpKTtcbiAgICB9XG5cbiAgICBjb25zdCBvcHRJbiA9IHtcbiAgICAgIFwicmVjaXBpZW50X21haWxcIjogcmVjaXBpZW50TWFpbCxcbiAgICAgIFwic2VuZGVyX21haWxcIjogc2VuZGVyTWFpbCxcbiAgICAgIGRhdGFcbiAgICB9XG5cbiAgICBhZGRPcHRJbihvcHRJbilcbiAgfSxcbn0pO1xuXG4vLyBHZXQgbGlzdCBvZiBhbGwgbWV0aG9kIG5hbWVzIG9uIG9wdC1pbnNcbmNvbnN0IE9QVElPTlNfTUVUSE9EUyA9IF8ucGx1Y2soW1xuICBhZGRcbl0sICduYW1lJyk7XG5cbmlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgLy8gT25seSBhbGxvdyA1IG9wdC1pbiBvcGVyYXRpb25zIHBlciBjb25uZWN0aW9uIHBlciBzZWNvbmRcbiAgRERQUmF0ZUxpbWl0ZXIuYWRkUnVsZSh7XG4gICAgbmFtZShuYW1lKSB7XG4gICAgICByZXR1cm4gXy5jb250YWlucyhPUFRJT05TX01FVEhPRFMsIG5hbWUpO1xuICAgIH0sXG5cbiAgICAvLyBSYXRlIGxpbWl0IHBlciBjb25uZWN0aW9uIElEXG4gICAgY29ubmVjdGlvbklkKCkgeyByZXR1cm4gdHJ1ZTsgfSxcbiAgfSwgNSwgMTAwMCk7XG59XG4iLCJpbXBvcnQgeyBNb25nbyB9IGZyb20gJ21ldGVvci9tb25nbyc7XG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XG5cbmNsYXNzIE9wdEluc0NvbGxlY3Rpb24gZXh0ZW5kcyBNb25nby5Db2xsZWN0aW9uIHtcbiAgaW5zZXJ0KG9wdEluLCBjYWxsYmFjaykge1xuICAgIGNvbnN0IG91ck9wdEluID0gb3B0SW47XG4gICAgb3VyT3B0SW4ucmVjaXBpZW50X3NlbmRlciA9IG91ck9wdEluLnJlY2lwaWVudCtvdXJPcHRJbi5zZW5kZXI7XG4gICAgb3VyT3B0SW4uY3JlYXRlZEF0ID0gb3VyT3B0SW4uY3JlYXRlZEF0IHx8IG5ldyBEYXRlKCk7XG4gICAgY29uc3QgcmVzdWx0ID0gc3VwZXIuaW5zZXJ0KG91ck9wdEluLCBjYWxsYmFjayk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICB1cGRhdGUoc2VsZWN0b3IsIG1vZGlmaWVyKSB7XG4gICAgY29uc3QgcmVzdWx0ID0gc3VwZXIudXBkYXRlKHNlbGVjdG9yLCBtb2RpZmllcik7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICByZW1vdmUoc2VsZWN0b3IpIHtcbiAgICBjb25zdCByZXN1bHQgPSBzdXBlci5yZW1vdmUoc2VsZWN0b3IpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IE9wdElucyA9IG5ldyBPcHRJbnNDb2xsZWN0aW9uKCdvcHQtaW5zJyk7XG5cbi8vIERlbnkgYWxsIGNsaWVudC1zaWRlIHVwZGF0ZXMgc2luY2Ugd2Ugd2lsbCBiZSB1c2luZyBtZXRob2RzIHRvIG1hbmFnZSB0aGlzIGNvbGxlY3Rpb25cbk9wdElucy5kZW55KHtcbiAgaW5zZXJ0KCkgeyByZXR1cm4gdHJ1ZTsgfSxcbiAgdXBkYXRlKCkgeyByZXR1cm4gdHJ1ZTsgfSxcbiAgcmVtb3ZlKCkgeyByZXR1cm4gdHJ1ZTsgfSxcbn0pO1xuXG5PcHRJbnMuc2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIF9pZDoge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICByZWdFeDogU2ltcGxlU2NoZW1hLlJlZ0V4LklkLFxuICB9LFxuICByZWNpcGllbnQ6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgb3B0aW9uYWw6IHRydWUsXG4gICAgZGVueVVwZGF0ZTogdHJ1ZSxcbiAgfSxcbiAgc2VuZGVyOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIG9wdGlvbmFsOiB0cnVlLFxuICAgIGRlbnlVcGRhdGU6IHRydWUsXG4gIH0sXG4gIGRhdGE6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgb3B0aW9uYWw6IHRydWUsXG4gICAgZGVueVVwZGF0ZTogZmFsc2UsXG4gIH0sXG4gIGluZGV4OiB7XG4gICAgdHlwZTogU2ltcGxlU2NoZW1hLkludGVnZXIsXG4gICAgb3B0aW9uYWw6IHRydWUsXG4gICAgZGVueVVwZGF0ZTogZmFsc2UsXG4gIH0sXG4gIG5hbWVJZDoge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICBvcHRpb25hbDogdHJ1ZSxcbiAgICBkZW55VXBkYXRlOiBmYWxzZSxcbiAgfSxcbiAgdHhJZDoge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgb3B0aW9uYWw6IHRydWUsXG4gICAgICBkZW55VXBkYXRlOiBmYWxzZSxcbiAgfSxcbiAgbWFzdGVyRG9pOiB7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICBvcHRpb25hbDogdHJ1ZSxcbiAgICAgIGRlbnlVcGRhdGU6IGZhbHNlLFxuICB9LFxuICBjcmVhdGVkQXQ6IHtcbiAgICB0eXBlOiBEYXRlLFxuICAgIGRlbnlVcGRhdGU6IHRydWUsXG4gIH0sXG4gIGNvbmZpcm1lZEF0OiB7XG4gICAgdHlwZTogRGF0ZSxcbiAgICBvcHRpb25hbDogdHJ1ZSxcbiAgICBkZW55VXBkYXRlOiBmYWxzZSxcbiAgfSxcbiAgY29uZmlybWVkQnk6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgcmVnRXg6IFNpbXBsZVNjaGVtYS5SZWdFeC5JUCxcbiAgICBvcHRpb25hbDogdHJ1ZSxcbiAgICBkZW55VXBkYXRlOiBmYWxzZVxuICB9LFxuICBjb25maXJtYXRpb25Ub2tlbjoge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICBvcHRpb25hbDogdHJ1ZSxcbiAgICBkZW55VXBkYXRlOiBmYWxzZVxuICB9LFxuICBvd25lcklkOntcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgb3B0aW9uYWw6IHRydWUsXG4gICAgcmVnRXg6IFNpbXBsZVNjaGVtYS5SZWdFeC5JZFxuICB9LFxuICBlcnJvcjp7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICBvcHRpb25hbDogdHJ1ZSxcbiAgICAgIGRlbnlVcGRhdGU6IGZhbHNlXG4gIH1cbn0pO1xuXG5PcHRJbnMuYXR0YWNoU2NoZW1hKE9wdElucy5zY2hlbWEpO1xuXG4vLyBUaGlzIHJlcHJlc2VudHMgdGhlIGtleXMgZnJvbSBPcHQtSW4gb2JqZWN0cyB0aGF0IHNob3VsZCBiZSBwdWJsaXNoZWRcbi8vIHRvIHRoZSBjbGllbnQuIElmIHdlIGFkZCBzZWNyZXQgcHJvcGVydGllcyB0byBPcHQtSW4gb2JqZWN0cywgZG9uJ3QgbGlzdFxuLy8gdGhlbSBoZXJlIHRvIGtlZXAgdGhlbSBwcml2YXRlIHRvIHRoZSBzZXJ2ZXIuXG5PcHRJbnMucHVibGljRmllbGRzID0ge1xuICBfaWQ6IDEsXG4gIHJlY2lwaWVudDogMSxcbiAgc2VuZGVyOiAxLFxuICBkYXRhOiAxLFxuICBpbmRleDogMSxcbiAgbmFtZUlkOiAxLFxuICB0eElkOiAxLFxuICBtYXN0ZXJEb2k6IDEsXG4gIGNyZWF0ZWRBdDogMSxcbiAgY29uZmlybWVkQXQ6IDEsXG4gIGNvbmZpcm1lZEJ5OiAxLFxuICBvd25lcklkOiAxLFxuICBlcnJvcjogMVxufTtcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IHsgUm9sZXMgfSBmcm9tICdtZXRlb3IvYWxhbm5pbmc6cm9sZXMnO1xuXG5pbXBvcnQgeyBSZWNpcGllbnRzIH0gZnJvbSAnLi4vcmVjaXBpZW50cy5qcyc7XG5pbXBvcnQgeyBPcHRJbnN9IGZyb20gJy4uLy4uL29wdC1pbnMvb3B0LWlucy5qcydcbk1ldGVvci5wdWJsaXNoKCdyZWNpcGllbnRzLmJ5T3duZXInLGZ1bmN0aW9uIHJlY2lwaWVudEdldCgpe1xuICBsZXQgcGlwZWxpbmU9W107XG4gIGlmKCFSb2xlcy51c2VySXNJblJvbGUodGhpcy51c2VySWQsIFsnYWRtaW4nXSkpe1xuICAgIHBpcGVsaW5lLnB1c2goXG4gICAgICB7JHJlZGFjdDp7XG4gICAgICAkY29uZDoge1xuICAgICAgICBpZjogeyAkY21wOiBbIFwiJG93bmVySWRcIiwgdGhpcy51c2VySWQgXSB9LFxuICAgICAgICB0aGVuOiBcIiQkUFJVTkVcIixcbiAgICAgICAgZWxzZTogXCIkJEtFRVBcIiB9fX0pO1xuICAgICAgfVxuICAgICAgcGlwZWxpbmUucHVzaCh7ICRsb29rdXA6IHsgZnJvbTogXCJyZWNpcGllbnRzXCIsIGxvY2FsRmllbGQ6IFwicmVjaXBpZW50XCIsIGZvcmVpZ25GaWVsZDogXCJfaWRcIiwgYXM6IFwiUmVjaXBpZW50RW1haWxcIiB9IH0pO1xuICAgICAgcGlwZWxpbmUucHVzaCh7ICR1bndpbmQ6IFwiJFJlY2lwaWVudEVtYWlsXCJ9KTtcbiAgICAgIHBpcGVsaW5lLnB1c2goeyAkcHJvamVjdDoge1wiUmVjaXBpZW50RW1haWwuX2lkXCI6MX19KTtcblxuICAgICAgY29uc3QgcmVzdWx0ID0gT3B0SW5zLmFnZ3JlZ2F0ZShwaXBlbGluZSk7XG4gICAgICBsZXQgcklkcz1bXTtcbiAgICAgIHJlc3VsdC5mb3JFYWNoKGVsZW1lbnQgPT4ge1xuICAgICAgICBySWRzLnB1c2goZWxlbWVudC5SZWNpcGllbnRFbWFpbC5faWQpO1xuICAgICAgfSk7XG4gIHJldHVybiBSZWNpcGllbnRzLmZpbmQoe1wiX2lkXCI6e1wiJGluXCI6cklkc319LHtmaWVsZHM6UmVjaXBpZW50cy5wdWJsaWNGaWVsZHN9KTtcbn0pO1xuTWV0ZW9yLnB1Ymxpc2goJ3JlY2lwaWVudHMuYWxsJywgZnVuY3Rpb24gcmVjaXBpZW50c0FsbCgpIHtcbiAgaWYoIXRoaXMudXNlcklkIHx8ICFSb2xlcy51c2VySXNJblJvbGUodGhpcy51c2VySWQsIFsnYWRtaW4nXSkpIHtcbiAgICByZXR1cm4gdGhpcy5yZWFkeSgpO1xuICB9XG5cbiAgcmV0dXJuIFJlY2lwaWVudHMuZmluZCh7fSwge1xuICAgIGZpZWxkczogUmVjaXBpZW50cy5wdWJsaWNGaWVsZHMsXG4gIH0pO1xufSk7XG4iLCJpbXBvcnQgeyBNb25nbyB9IGZyb20gJ21ldGVvci9tb25nbyc7XG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XG5cbmNsYXNzIFJlY2lwaWVudHNDb2xsZWN0aW9uIGV4dGVuZHMgTW9uZ28uQ29sbGVjdGlvbiB7XG4gIGluc2VydChyZWNpcGllbnQsIGNhbGxiYWNrKSB7XG4gICAgY29uc3Qgb3VyUmVjaXBpZW50ID0gcmVjaXBpZW50O1xuICAgIG91clJlY2lwaWVudC5jcmVhdGVkQXQgPSBvdXJSZWNpcGllbnQuY3JlYXRlZEF0IHx8IG5ldyBEYXRlKCk7XG4gICAgY29uc3QgcmVzdWx0ID0gc3VwZXIuaW5zZXJ0KG91clJlY2lwaWVudCwgY2FsbGJhY2spO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgdXBkYXRlKHNlbGVjdG9yLCBtb2RpZmllcikge1xuICAgIGNvbnN0IHJlc3VsdCA9IHN1cGVyLnVwZGF0ZShzZWxlY3RvciwgbW9kaWZpZXIpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgcmVtb3ZlKHNlbGVjdG9yKSB7XG4gICAgY29uc3QgcmVzdWx0ID0gc3VwZXIucmVtb3ZlKHNlbGVjdG9yKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG5cbmV4cG9ydCBjb25zdCBSZWNpcGllbnRzID0gbmV3IFJlY2lwaWVudHNDb2xsZWN0aW9uKCdyZWNpcGllbnRzJyk7XG5cbi8vIERlbnkgYWxsIGNsaWVudC1zaWRlIHVwZGF0ZXMgc2luY2Ugd2Ugd2lsbCBiZSB1c2luZyBtZXRob2RzIHRvIG1hbmFnZSB0aGlzIGNvbGxlY3Rpb25cblJlY2lwaWVudHMuZGVueSh7XG4gIGluc2VydCgpIHsgcmV0dXJuIHRydWU7IH0sXG4gIHVwZGF0ZSgpIHsgcmV0dXJuIHRydWU7IH0sXG4gIHJlbW92ZSgpIHsgcmV0dXJuIHRydWU7IH0sXG59KTtcblxuUmVjaXBpZW50cy5zY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgX2lkOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIHJlZ0V4OiBTaW1wbGVTY2hlbWEuUmVnRXguSWQsXG4gIH0sXG4gIGVtYWlsOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIGluZGV4OiB0cnVlLFxuICAgIGRlbnlVcGRhdGU6IHRydWUsXG4gIH0sXG4gIHByaXZhdGVLZXk6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgdW5pcXVlOiB0cnVlLFxuICAgIGRlbnlVcGRhdGU6IHRydWUsXG4gIH0sXG4gIHB1YmxpY0tleToge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICB1bmlxdWU6IHRydWUsXG4gICAgZGVueVVwZGF0ZTogdHJ1ZSxcbiAgfSxcbiAgY3JlYXRlZEF0OiB7XG4gICAgdHlwZTogRGF0ZSxcbiAgICBkZW55VXBkYXRlOiB0cnVlLFxuICB9XG59KTtcblxuUmVjaXBpZW50cy5hdHRhY2hTY2hlbWEoUmVjaXBpZW50cy5zY2hlbWEpO1xuXG4vLyBUaGlzIHJlcHJlc2VudHMgdGhlIGtleXMgZnJvbSBSZWNpcGllbnQgb2JqZWN0cyB0aGF0IHNob3VsZCBiZSBwdWJsaXNoZWRcbi8vIHRvIHRoZSBjbGllbnQuIElmIHdlIGFkZCBzZWNyZXQgcHJvcGVydGllcyB0byBSZWNpcGllbnQgb2JqZWN0cywgZG9uJ3QgbGlzdFxuLy8gdGhlbSBoZXJlIHRvIGtlZXAgdGhlbSBwcml2YXRlIHRvIHRoZSBzZXJ2ZXIuXG5SZWNpcGllbnRzLnB1YmxpY0ZpZWxkcyA9IHtcbiAgX2lkOiAxLFxuICBlbWFpbDogMSxcbiAgcHVibGljS2V5OiAxLFxuICBjcmVhdGVkQXQ6IDFcbn07XG4iLCJpbXBvcnQgeyBNb25nbyB9IGZyb20gJ21ldGVvci9tb25nbyc7XG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XG5cbmNsYXNzIERvaWNoYWluRW50cmllc0NvbGxlY3Rpb24gZXh0ZW5kcyBNb25nby5Db2xsZWN0aW9uIHtcbiAgaW5zZXJ0KGVudHJ5LCBjYWxsYmFjaykge1xuICAgIGNvbnN0IHJlc3VsdCA9IHN1cGVyLmluc2VydChlbnRyeSwgY2FsbGJhY2spO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgdXBkYXRlKHNlbGVjdG9yLCBtb2RpZmllcikge1xuICAgIGNvbnN0IHJlc3VsdCA9IHN1cGVyLnVwZGF0ZShzZWxlY3RvciwgbW9kaWZpZXIpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgcmVtb3ZlKHNlbGVjdG9yKSB7XG4gICAgY29uc3QgcmVzdWx0ID0gc3VwZXIucmVtb3ZlKHNlbGVjdG9yKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG5cbmV4cG9ydCBjb25zdCBEb2ljaGFpbkVudHJpZXMgPSBuZXcgRG9pY2hhaW5FbnRyaWVzQ29sbGVjdGlvbignZG9pY2hhaW4tZW50cmllcycpO1xuXG4vLyBEZW55IGFsbCBjbGllbnQtc2lkZSB1cGRhdGVzIHNpbmNlIHdlIHdpbGwgYmUgdXNpbmcgbWV0aG9kcyB0byBtYW5hZ2UgdGhpcyBjb2xsZWN0aW9uXG5Eb2ljaGFpbkVudHJpZXMuZGVueSh7XG4gIGluc2VydCgpIHsgcmV0dXJuIHRydWU7IH0sXG4gIHVwZGF0ZSgpIHsgcmV0dXJuIHRydWU7IH0sXG4gIHJlbW92ZSgpIHsgcmV0dXJuIHRydWU7IH0sXG59KTtcblxuRG9pY2hhaW5FbnRyaWVzLnNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICBfaWQ6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgcmVnRXg6IFNpbXBsZVNjaGVtYS5SZWdFeC5JZCxcbiAgfSxcbiAgbmFtZToge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICBpbmRleDogdHJ1ZSxcbiAgICBkZW55VXBkYXRlOiB0cnVlXG4gIH0sXG4gIHZhbHVlOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIGRlbnlVcGRhdGU6IGZhbHNlXG4gIH0sXG4gIGFkZHJlc3M6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgZGVueVVwZGF0ZTogZmFsc2VcbiAgfSxcbiAgbWFzdGVyRG9pOiB7XG4gICAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgICAgb3B0aW9uYWw6IHRydWUsXG4gICAgICAgIGluZGV4OiB0cnVlLFxuICAgICAgICBkZW55VXBkYXRlOiB0cnVlXG4gIH0sXG4gIGluZGV4OiB7XG4gICAgICAgIHR5cGU6IFNpbXBsZVNjaGVtYS5JbnRlZ2VyLFxuICAgICAgICBvcHRpb25hbDogdHJ1ZSxcbiAgICAgICAgZGVueVVwZGF0ZTogdHJ1ZVxuICB9LFxuICB0eElkOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIGRlbnlVcGRhdGU6IGZhbHNlXG4gIH1cbn0pO1xuXG5Eb2ljaGFpbkVudHJpZXMuYXR0YWNoU2NoZW1hKERvaWNoYWluRW50cmllcy5zY2hlbWEpO1xuXG4vLyBUaGlzIHJlcHJlc2VudHMgdGhlIGtleXMgZnJvbSBFbnRyeSBvYmplY3RzIHRoYXQgc2hvdWxkIGJlIHB1Ymxpc2hlZFxuLy8gdG8gdGhlIGNsaWVudC4gSWYgd2UgYWRkIHNlY3JldCBwcm9wZXJ0aWVzIHRvIEVudHJ5IG9iamVjdHMsIGRvbid0IGxpc3Rcbi8vIHRoZW0gaGVyZSB0byBrZWVwIHRoZW0gcHJpdmF0ZSB0byB0aGUgc2VydmVyLlxuRG9pY2hhaW5FbnRyaWVzLnB1YmxpY0ZpZWxkcyA9IHtcbiAgX2lkOiAxLFxuICBuYW1lOiAxLFxuICB2YWx1ZTogMSxcbiAgYWRkcmVzczogMSxcbiAgbWFzdGVyRG9pOiAxLFxuICBpbmRleDogMSxcbiAgdHhJZDogMVxufTtcbiIsImltcG9ydCB7IFZhbGlkYXRlZE1ldGhvZCB9IGZyb20gJ21ldGVvci9tZGc6dmFsaWRhdGVkLW1ldGhvZCc7XG5pbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCB7IEREUFJhdGVMaW1pdGVyIH0gZnJvbSAnbWV0ZW9yL2RkcC1yYXRlLWxpbWl0ZXInO1xuaW1wb3J0IGdldEtleVBhaXJNIGZyb20gJy4uLy4uL21vZHVsZXMvc2VydmVyL2RvaWNoYWluL2dldF9rZXktcGFpci5qcyc7XG5pbXBvcnQgZ2V0QmFsYW5jZU0gZnJvbSAnLi4vLi4vbW9kdWxlcy9zZXJ2ZXIvZG9pY2hhaW4vZ2V0X2JhbGFuY2UuanMnO1xuXG5cbmNvbnN0IGdldEtleVBhaXIgPSBuZXcgVmFsaWRhdGVkTWV0aG9kKHtcbiAgbmFtZTogJ2RvaWNoYWluLmdldEtleVBhaXInLFxuICB2YWxpZGF0ZTogbnVsbCxcbiAgcnVuKCkge1xuICAgIHJldHVybiBnZXRLZXlQYWlyTSgpO1xuICB9LFxufSk7XG5cbmNvbnN0IGdldEJhbGFuY2UgPSBuZXcgVmFsaWRhdGVkTWV0aG9kKHtcbiAgbmFtZTogJ2RvaWNoYWluLmdldEJhbGFuY2UnLFxuICB2YWxpZGF0ZTogbnVsbCxcbiAgcnVuKCkge1xuICAgIGNvbnN0IGxvZ1ZhbCA9IGdldEJhbGFuY2VNKCk7XG4gICAgcmV0dXJuIGxvZ1ZhbDtcbiAgfSxcbn0pO1xuXG5cbi8vIEdldCBsaXN0IG9mIGFsbCBtZXRob2QgbmFtZXMgb24gZG9pY2hhaW5cbmNvbnN0IE9QVElOU19NRVRIT0RTID0gXy5wbHVjayhbXG4gIGdldEtleVBhaXJcbixnZXRCYWxhbmNlXSwgJ25hbWUnKTtcblxuaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAvLyBPbmx5IGFsbG93IDUgb3B0LWluIG9wZXJhdGlvbnMgcGVyIGNvbm5lY3Rpb24gcGVyIHNlY29uZFxuICBERFBSYXRlTGltaXRlci5hZGRSdWxlKHtcbiAgICBuYW1lKG5hbWUpIHtcbiAgICAgIHJldHVybiBfLmNvbnRhaW5zKE9QVElOU19NRVRIT0RTLCBuYW1lKTtcbiAgICB9LFxuXG4gICAgLy8gUmF0ZSBsaW1pdCBwZXIgY29ubmVjdGlvbiBJRFxuICAgIGNvbm5lY3Rpb25JZCgpIHsgcmV0dXJuIHRydWU7IH0sXG4gIH0sIDUsIDEwMDApO1xufVxuIiwiaW1wb3J0IHsgTWV0ZW9yfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCB7IEREUFJhdGVMaW1pdGVyIH0gZnJvbSAnbWV0ZW9yL2RkcC1yYXRlLWxpbWl0ZXInO1xuaW1wb3J0IHsgVmFsaWRhdGVkTWV0aG9kIH0gZnJvbSAnbWV0ZW9yL21kZzp2YWxpZGF0ZWQtbWV0aG9kJztcbmltcG9ydCBnZXRMYW5ndWFnZXMgZnJvbSAnLi4vLi4vbW9kdWxlcy9zZXJ2ZXIvbGFuZ3VhZ2VzL2dldC5qcyc7XG5cbmNvbnN0IGdldEFsbExhbmd1YWdlcyA9IG5ldyBWYWxpZGF0ZWRNZXRob2Qoe1xuICBuYW1lOiAnbGFuZ3VhZ2VzLmdldEFsbCcsXG4gIHZhbGlkYXRlOiBudWxsLFxuICBydW4oKSB7XG4gICAgcmV0dXJuIGdldExhbmd1YWdlcygpO1xuICB9LFxufSk7XG5cbi8vIEdldCBsaXN0IG9mIGFsbCBtZXRob2QgbmFtZXMgb24gbGFuZ3VhZ2VzXG5jb25zdCBPUFRJTlNfTUVUSE9EUyA9IF8ucGx1Y2soW1xuICBnZXRBbGxMYW5ndWFnZXNcbl0sICduYW1lJyk7XG5cbmlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgLy8gT25seSBhbGxvdyA1IG9wdC1pbiBvcGVyYXRpb25zIHBlciBjb25uZWN0aW9uIHBlciBzZWNvbmRcbiAgRERQUmF0ZUxpbWl0ZXIuYWRkUnVsZSh7XG4gICAgbmFtZShuYW1lKSB7XG4gICAgICByZXR1cm4gXy5jb250YWlucyhPUFRJTlNfTUVUSE9EUywgbmFtZSk7XG4gICAgfSxcblxuICAgIC8vIFJhdGUgbGltaXQgcGVyIGNvbm5lY3Rpb24gSURcbiAgICBjb25uZWN0aW9uSWQoKSB7IHJldHVybiB0cnVlOyB9LFxuICB9LCA1LCAxMDAwKTtcbn1cbiIsImltcG9ydCB7IE1vbmdvIH0gZnJvbSAnbWV0ZW9yL21vbmdvJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcblxuY2xhc3MgTWV0YUNvbGxlY3Rpb24gZXh0ZW5kcyBNb25nby5Db2xsZWN0aW9uIHtcbiAgaW5zZXJ0KGRhdGEsIGNhbGxiYWNrKSB7XG4gICAgY29uc3Qgb3VyRGF0YSA9IGRhdGE7XG4gICAgY29uc3QgcmVzdWx0ID0gc3VwZXIuaW5zZXJ0KG91ckRhdGEsIGNhbGxiYWNrKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIHVwZGF0ZShzZWxlY3RvciwgbW9kaWZpZXIpIHtcbiAgICBjb25zdCByZXN1bHQgPSBzdXBlci51cGRhdGUoc2VsZWN0b3IsIG1vZGlmaWVyKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIHJlbW92ZShzZWxlY3Rvcikge1xuICAgIGNvbnN0IHJlc3VsdCA9IHN1cGVyLnJlbW92ZShzZWxlY3Rvcik7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgTWV0YSA9IG5ldyBNZXRhQ29sbGVjdGlvbignbWV0YScpO1xuXG4vLyBEZW55IGFsbCBjbGllbnQtc2lkZSB1cGRhdGVzIHNpbmNlIHdlIHdpbGwgYmUgdXNpbmcgbWV0aG9kcyB0byBtYW5hZ2UgdGhpcyBjb2xsZWN0aW9uXG5NZXRhLmRlbnkoe1xuICBpbnNlcnQoKSB7IHJldHVybiB0cnVlOyB9LFxuICB1cGRhdGUoKSB7IHJldHVybiB0cnVlOyB9LFxuICByZW1vdmUoKSB7IHJldHVybiB0cnVlOyB9LFxufSk7XG5cbk1ldGEuc2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIF9pZDoge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICByZWdFeDogU2ltcGxlU2NoZW1hLlJlZ0V4LklkLFxuICB9LFxuICBrZXk6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgaW5kZXg6IHRydWUsXG4gICAgZGVueVVwZGF0ZTogdHJ1ZVxuICB9LFxuICB2YWx1ZToge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9XG59KTtcblxuTWV0YS5hdHRhY2hTY2hlbWEoTWV0YS5zY2hlbWEpO1xuXG4vLyBUaGlzIHJlcHJlc2VudHMgdGhlIGtleXMgZnJvbSBNZXRhIG9iamVjdHMgdGhhdCBzaG91bGQgYmUgcHVibGlzaGVkXG4vLyB0byB0aGUgY2xpZW50LiBJZiB3ZSBhZGQgc2VjcmV0IHByb3BlcnRpZXMgdG8gTWV0YSBvYmplY3RzLCBkb24ndCBsaXN0XG4vLyB0aGVtIGhlcmUgdG8ga2VlcCB0aGVtIHByaXZhdGUgdG8gdGhlIHNlcnZlci5cbk1ldGEucHVibGljRmllbGRzID0ge1xufTtcbiIsImltcG9ydCB7IE1vbmdvIH0gZnJvbSAnbWV0ZW9yL21vbmdvJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcblxuY2xhc3MgU2VuZGVyc0NvbGxlY3Rpb24gZXh0ZW5kcyBNb25nby5Db2xsZWN0aW9uIHtcbiAgaW5zZXJ0KHNlbmRlciwgY2FsbGJhY2spIHtcbiAgICBjb25zdCBvdXJTZW5kZXIgPSBzZW5kZXI7XG4gICAgb3VyU2VuZGVyLmNyZWF0ZWRBdCA9IG91clNlbmRlci5jcmVhdGVkQXQgfHwgbmV3IERhdGUoKTtcbiAgICBjb25zdCByZXN1bHQgPSBzdXBlci5pbnNlcnQob3VyU2VuZGVyLCBjYWxsYmFjayk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICB1cGRhdGUoc2VsZWN0b3IsIG1vZGlmaWVyKSB7XG4gICAgY29uc3QgcmVzdWx0ID0gc3VwZXIudXBkYXRlKHNlbGVjdG9yLCBtb2RpZmllcik7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICByZW1vdmUoc2VsZWN0b3IpIHtcbiAgICBjb25zdCByZXN1bHQgPSBzdXBlci5yZW1vdmUoc2VsZWN0b3IpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IFNlbmRlcnMgPSBuZXcgU2VuZGVyc0NvbGxlY3Rpb24oJ3NlbmRlcnMnKTtcblxuLy8gRGVueSBhbGwgY2xpZW50LXNpZGUgdXBkYXRlcyBzaW5jZSB3ZSB3aWxsIGJlIHVzaW5nIG1ldGhvZHMgdG8gbWFuYWdlIHRoaXMgY29sbGVjdGlvblxuU2VuZGVycy5kZW55KHtcbiAgaW5zZXJ0KCkgeyByZXR1cm4gdHJ1ZTsgfSxcbiAgdXBkYXRlKCkgeyByZXR1cm4gdHJ1ZTsgfSxcbiAgcmVtb3ZlKCkgeyByZXR1cm4gdHJ1ZTsgfSxcbn0pO1xuXG5TZW5kZXJzLnNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICBfaWQ6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgcmVnRXg6IFNpbXBsZVNjaGVtYS5SZWdFeC5JZCxcbiAgfSxcbiAgZW1haWw6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgaW5kZXg6IHRydWUsXG4gICAgZGVueVVwZGF0ZTogdHJ1ZSxcbiAgfSxcbiAgY3JlYXRlZEF0OiB7XG4gICAgdHlwZTogRGF0ZSxcbiAgICBkZW55VXBkYXRlOiB0cnVlLFxuICB9XG59KTtcblxuU2VuZGVycy5hdHRhY2hTY2hlbWEoU2VuZGVycy5zY2hlbWEpO1xuXG4vLyBUaGlzIHJlcHJlc2VudHMgdGhlIGtleXMgZnJvbSBTZW5kZXIgb2JqZWN0cyB0aGF0IHNob3VsZCBiZSBwdWJsaXNoZWRcbi8vIHRvIHRoZSBjbGllbnQuIElmIHdlIGFkZCBzZWNyZXQgcHJvcGVydGllcyB0byBTZW5kZXIgb2JqZWN0cywgZG9uJ3QgbGlzdFxuLy8gdGhlbSBoZXJlIHRvIGtlZXAgdGhlbSBwcml2YXRlIHRvIHRoZSBzZXJ2ZXIuXG5TZW5kZXJzLnB1YmxpY0ZpZWxkcyA9IHtcbiAgZW1haWw6IDEsXG4gIGNyZWF0ZWRBdDogMVxufTtcbiIsImltcG9ydCB7IE1ldGVvcn0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgeyBNZXRhIH0gZnJvbSAnLi4vbWV0YS9tZXRhJztcblxuXG5NZXRlb3IucHVibGlzaCgndmVyc2lvbicsIGZ1bmN0aW9uIHZlcnNpb24oKSB7XG4gICAgcmV0dXJuIE1ldGEuZmluZCh7fSk7XG59KTsiLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcbmltcG9ydCB7IERPSV9NQUlMX0ZFVENIX1VSTCB9IGZyb20gJy4uLy4uLy4uL3N0YXJ0dXAvc2VydmVyL2VtYWlsLWNvbmZpZ3VyYXRpb24uanMnO1xuaW1wb3J0IHtsb2dTZW5kfSBmcm9tIFwiLi4vLi4vLi4vc3RhcnR1cC9zZXJ2ZXIvbG9nLWNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7T3B0SW5zfSBmcm9tIFwiLi4vLi4vLi4vYXBpL29wdC1pbnMvb3B0LWluc1wiO1xuXG5jb25zdCBFeHBvcnREb2lzRGF0YVNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICBzdGF0dXM6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgb3B0aW9uYWw6IHRydWUsXG4gIH0sXG4gIHJvbGU6e1xuICAgIHR5cGU6U3RyaW5nXG4gIH0sXG4gIHVzZXJpZDp7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIHJlZ0V4OiBTaW1wbGVTY2hlbWEuUmVnRXguaWQsXG4gICAgb3B0aW9uYWw6dHJ1ZSBcbiAgfVxufSk7XG5cbi8vVE9ETyBhZGQgc2VuZGVyIGFuZCByZWNpcGllbnQgZW1haWwgYWRkcmVzcyB0byBleHBvcnRcblxuY29uc3QgZXhwb3J0RG9pcyA9IChkYXRhKSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3Qgb3VyRGF0YSA9IGRhdGE7XG4gICAgRXhwb3J0RG9pc0RhdGFTY2hlbWEudmFsaWRhdGUob3VyRGF0YSk7XG4gICAgbGV0IHBpcGVsaW5lPVt7ICRtYXRjaDoge1wiY29uZmlybWVkQXRcIjp7ICRleGlzdHM6IHRydWUsICRuZTogbnVsbCB9fSB9XTtcbiAgICBcbiAgICBpZihvdXJEYXRhLnJvbGUhPSdhZG1pbid8fG91ckRhdGEudXNlcmlkIT11bmRlZmluZWQpe1xuICAgICAgcGlwZWxpbmUucHVzaCh7ICRyZWRhY3Q6e1xuICAgICAgICAkY29uZDoge1xuICAgICAgICAgIGlmOiB7ICRjbXA6IFsgXCIkb3duZXJJZFwiLCBvdXJEYXRhLnVzZXJpZCBdIH0sXG4gICAgICAgICAgdGhlbjogXCIkJFBSVU5FXCIsXG4gICAgICAgICAgZWxzZTogXCIkJEtFRVBcIiB9fX0pO1xuICAgIH1cbiAgICBwaXBlbGluZT1bLi4ucGlwZWxpbmUsXG4gICAgICAgIHsgJGxvb2t1cDogeyBmcm9tOiBcInJlY2lwaWVudHNcIiwgbG9jYWxGaWVsZDogXCJyZWNpcGllbnRcIiwgZm9yZWlnbkZpZWxkOiBcIl9pZFwiLCBhczogXCJSZWNpcGllbnRFbWFpbFwiIH0gfSxcbiAgICAgICAgeyAkbG9va3VwOiB7IGZyb206IFwic2VuZGVyc1wiLCBsb2NhbEZpZWxkOiBcInNlbmRlclwiLCBmb3JlaWduRmllbGQ6IFwiX2lkXCIsIGFzOiBcIlNlbmRlckVtYWlsXCIgfSB9LFxuICAgICAgICB7ICR1bndpbmQ6IFwiJFNlbmRlckVtYWlsXCJ9LFxuICAgICAgICB7ICR1bndpbmQ6IFwiJFJlY2lwaWVudEVtYWlsXCJ9LFxuICAgICAgICB7ICRwcm9qZWN0OiB7X2lkOjEsb3duZXJJZDoxLCBjcmVhdGVkQXQ6MSwgY29uZmlybWVkQXQ6MSxuYW1lSWQ6MSwgJ1NlbmRlckVtYWlsLmVtYWlsJzoxLCdSZWNpcGllbnRFbWFpbC5lbWFpbCc6MX1cbiAgICAgIH1cbiAgICBdO1xuICAgIC8vaWYob3VyRGF0YS5zdGF0dXM9PTEpIHF1ZXJ5ID0ge1wiY29uZmlybWVkQXRcIjogeyAkZXhpc3RzOiB0cnVlLCAkbmU6IG51bGwgfX1cblxuICAgIGxldCBvcHRJbnMgPSAgT3B0SW5zLmFnZ3JlZ2F0ZShwaXBlbGluZSk7XG4gICAgbGV0IGV4cG9ydERvaURhdGE7XG4gICAgdHJ5IHtcbiAgICAgICAgZXhwb3J0RG9pRGF0YSA9IG9wdElucztcbiAgICAgICAgbG9nU2VuZCgnZXhwb3J0RG9pIHVybDonLERPSV9NQUlMX0ZFVENIX1VSTCxKU09OLnN0cmluZ2lmeShleHBvcnREb2lEYXRhKSk7XG4gICAgICByZXR1cm4gZXhwb3J0RG9pRGF0YVxuXG4gICAgfSBjYXRjaChlcnJvcikge1xuICAgICAgdGhyb3cgXCJFcnJvciB3aGlsZSBleHBvcnRpbmcgZG9pczogXCIrZXJyb3I7XG4gICAgfVxuXG4gIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2RhcHBzLmV4cG9ydERvaS5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBleHBvcnREb2lzO1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XG5pbXBvcnQgeyBET0lfRkVUQ0hfUk9VVEUsIERPSV9DT05GSVJNQVRJT05fUk9VVEUsIEFQSV9QQVRILCBWRVJTSU9OIH0gZnJvbSAnLi4vLi4vLi4vLi4vc2VydmVyL2FwaS9yZXN0L3Jlc3QuanMnO1xuaW1wb3J0IHsgZ2V0VXJsIH0gZnJvbSAnLi4vLi4vLi4vc3RhcnR1cC9zZXJ2ZXIvZGFwcC1jb25maWd1cmF0aW9uLmpzJztcbmltcG9ydCB7IENPTkZJUk1fQ0xJRU5ULCBDT05GSVJNX0FERFJFU1MgfSBmcm9tICcuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9kb2ljaGFpbi1jb25maWd1cmF0aW9uLmpzJztcbmltcG9ydCB7IGdldEh0dHBHRVQgfSBmcm9tICcuLi8uLi8uLi8uLi9zZXJ2ZXIvYXBpL2h0dHAuanMnO1xuaW1wb3J0IHsgc2lnbk1lc3NhZ2UgfSBmcm9tICcuLi8uLi8uLi8uLi9zZXJ2ZXIvYXBpL2RvaWNoYWluLmpzJztcbmltcG9ydCB7IE9wdElucyB9IGZyb20gJy4uLy4uLy4uLy4uL2ltcG9ydHMvYXBpL29wdC1pbnMvb3B0LWlucy5qcyc7XG5pbXBvcnQgcGFyc2VUZW1wbGF0ZSBmcm9tICcuLi9lbWFpbHMvcGFyc2VfdGVtcGxhdGUuanMnO1xuaW1wb3J0IGdlbmVyYXRlRG9pVG9rZW4gZnJvbSAnLi4vb3B0LWlucy9nZW5lcmF0ZV9kb2ktdG9rZW4uanMnO1xuaW1wb3J0IGdlbmVyYXRlRG9pSGFzaCBmcm9tICcuLi9lbWFpbHMvZ2VuZXJhdGVfZG9pLWhhc2guanMnO1xuaW1wb3J0IGFkZE9wdEluIGZyb20gJy4uL29wdC1pbnMvYWRkLmpzJztcbmltcG9ydCBhZGRTZW5kTWFpbEpvYiBmcm9tICcuLi9qb2JzL2FkZF9zZW5kX21haWwuanMnO1xuaW1wb3J0IHtsb2dDb25maXJtLCBsb2dFcnJvcn0gZnJvbSBcIi4uLy4uLy4uL3N0YXJ0dXAvc2VydmVyL2xvZy1jb25maWd1cmF0aW9uXCI7XG5cbmNvbnN0IEZldGNoRG9pTWFpbERhdGFTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgbmFtZToge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9LFxuICBkb21haW46IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfVxufSk7XG5cblxuY29uc3QgZmV0Y2hEb2lNYWlsRGF0YSA9IChkYXRhKSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3Qgb3VyRGF0YSA9IGRhdGE7XG4gICAgRmV0Y2hEb2lNYWlsRGF0YVNjaGVtYS52YWxpZGF0ZShvdXJEYXRhKTtcbiAgICBjb25zdCB1cmwgPSBvdXJEYXRhLmRvbWFpbitBUElfUEFUSCtWRVJTSU9OK1wiL1wiK0RPSV9GRVRDSF9ST1VURTtcbiAgICBjb25zdCBzaWduYXR1cmUgPSBzaWduTWVzc2FnZShDT05GSVJNX0NMSUVOVCwgQ09ORklSTV9BRERSRVNTLCBvdXJEYXRhLm5hbWUpO1xuICAgIGNvbnN0IHF1ZXJ5ID0gXCJuYW1lX2lkPVwiK2VuY29kZVVSSUNvbXBvbmVudChvdXJEYXRhLm5hbWUpK1wiJnNpZ25hdHVyZT1cIitlbmNvZGVVUklDb21wb25lbnQoc2lnbmF0dXJlKTtcbiAgICBsb2dDb25maXJtKCdjYWxsaW5nIGZvciBkb2ktZW1haWwtdGVtcGxhdGU6Jyt1cmwrJyBxdWVyeTonLCBxdWVyeSk7XG5cbiAgICAvKipcbiAgICAgIFRPRE8gd2hlbiBydW5uaW5nIFNlbmQtZEFwcCBpbiBUZXN0bmV0IGJlaGluZCBOQVQgdGhpcyBVUkwgd2lsbCBub3QgYmUgYWNjZXNzaWJsZSBmcm9tIHRoZSBpbnRlcm5ldFxuICAgICAgYnV0IGV2ZW4gd2hlbiB3ZSB1c2UgdGhlIFVSTCBmcm9tIGxvY2FsaG9zdCB2ZXJpZnkgYW5kbiBvdGhlcnMgd2lsbCBmYWlscy5cbiAgICAgKi9cbiAgICBjb25zdCByZXNwb25zZSA9IGdldEh0dHBHRVQodXJsLCBxdWVyeSk7XG4gICAgaWYocmVzcG9uc2UgPT09IHVuZGVmaW5lZCB8fCByZXNwb25zZS5kYXRhID09PSB1bmRlZmluZWQpIHRocm93IFwiQmFkIHJlc3BvbnNlXCI7XG4gICAgY29uc3QgcmVzcG9uc2VEYXRhID0gcmVzcG9uc2UuZGF0YTtcbiAgICBsb2dDb25maXJtKCdyZXNwb25zZSB3aGlsZSBnZXR0aW5nIGdldHRpbmcgZW1haWwgdGVtcGxhdGUgZnJvbSBVUkw6JyxyZXNwb25zZS5kYXRhLnN0YXR1cyk7XG5cbiAgICBpZihyZXNwb25zZURhdGEuc3RhdHVzICE9PSBcInN1Y2Nlc3NcIikge1xuICAgICAgaWYocmVzcG9uc2VEYXRhLmVycm9yID09PSB1bmRlZmluZWQpIHRocm93IFwiQmFkIHJlc3BvbnNlXCI7XG4gICAgICBpZihyZXNwb25zZURhdGEuZXJyb3IuaW5jbHVkZXMoXCJPcHQtSW4gbm90IGZvdW5kXCIpKSB7XG4gICAgICAgIC8vRG8gbm90aGluZyBhbmQgZG9uJ3QgdGhyb3cgZXJyb3Igc28gam9iIGlzIGRvbmVcbiAgICAgICAgICBsb2dFcnJvcigncmVzcG9uc2UgZGF0YSBmcm9tIFNlbmQtZEFwcDonLHJlc3BvbnNlRGF0YS5lcnJvcik7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHRocm93IHJlc3BvbnNlRGF0YS5lcnJvcjtcbiAgICB9XG4gICAgbG9nQ29uZmlybSgnRE9JIE1haWwgZGF0YSBmZXRjaGVkLicpO1xuXG4gICAgY29uc3Qgb3B0SW5JZCA9IGFkZE9wdEluKHtuYW1lOiBvdXJEYXRhLm5hbWV9KTtcbiAgICBjb25zdCBvcHRJbiA9IE9wdElucy5maW5kT25lKHtfaWQ6IG9wdEluSWR9KTtcbiAgICBsb2dDb25maXJtKCdvcHQtaW4gZm91bmQ6JyxvcHRJbik7XG4gICAgaWYob3B0SW4uY29uZmlybWF0aW9uVG9rZW4gIT09IHVuZGVmaW5lZCkgcmV0dXJuO1xuXG4gICAgY29uc3QgdG9rZW4gPSBnZW5lcmF0ZURvaVRva2VuKHtpZDogb3B0SW4uX2lkfSk7XG4gICAgbG9nQ29uZmlybSgnZ2VuZXJhdGVkIGNvbmZpcm1hdGlvblRva2VuOicsdG9rZW4pO1xuICAgIGNvbnN0IGNvbmZpcm1hdGlvbkhhc2ggPSBnZW5lcmF0ZURvaUhhc2goe2lkOiBvcHRJbi5faWQsIHRva2VuOiB0b2tlbiwgcmVkaXJlY3Q6IHJlc3BvbnNlRGF0YS5kYXRhLnJlZGlyZWN0fSk7XG4gICAgbG9nQ29uZmlybSgnZ2VuZXJhdGVkIGNvbmZpcm1hdGlvbkhhc2g6Jyxjb25maXJtYXRpb25IYXNoKTtcbiAgICBjb25zdCBjb25maXJtYXRpb25VcmwgPSBnZXRVcmwoKStBUElfUEFUSCtWRVJTSU9OK1wiL1wiK0RPSV9DT05GSVJNQVRJT05fUk9VVEUrXCIvXCIrZW5jb2RlVVJJQ29tcG9uZW50KGNvbmZpcm1hdGlvbkhhc2gpO1xuICAgIGxvZ0NvbmZpcm0oJ2NvbmZpcm1hdGlvblVybDonK2NvbmZpcm1hdGlvblVybCk7XG5cbiAgICBjb25zdCB0ZW1wbGF0ZSA9IHBhcnNlVGVtcGxhdGUoe3RlbXBsYXRlOiByZXNwb25zZURhdGEuZGF0YS5jb250ZW50LCBkYXRhOiB7XG4gICAgICBjb25maXJtYXRpb25fdXJsOiBjb25maXJtYXRpb25VcmxcbiAgICB9fSk7XG5cbiAgICAvL2xvZ0NvbmZpcm0oJ3dlIGFyZSB1c2luZyB0aGlzIHRlbXBsYXRlOicsdGVtcGxhdGUpO1xuXG4gICAgbG9nQ29uZmlybSgnc2VuZGluZyBlbWFpbCB0byBwZXRlciBmb3IgY29uZmlybWF0aW9uIG92ZXIgYm9icyBkQXBwJyk7XG4gICAgYWRkU2VuZE1haWxKb2Ioe1xuICAgICAgdG86IHJlc3BvbnNlRGF0YS5kYXRhLnJlY2lwaWVudCxcbiAgICAgIHN1YmplY3Q6IHJlc3BvbnNlRGF0YS5kYXRhLnN1YmplY3QsXG4gICAgICBtZXNzYWdlOiB0ZW1wbGF0ZSxcbiAgICAgIHJldHVyblBhdGg6IHJlc3BvbnNlRGF0YS5kYXRhLnJldHVyblBhdGhcbiAgICB9KTtcbiAgfSBjYXRjaCAoZXhjZXB0aW9uKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZGFwcHMuZmV0Y2hEb2lNYWlsRGF0YS5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBmZXRjaERvaU1haWxEYXRhO1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XG5pbXBvcnQgeyBPcHRJbnMgfSBmcm9tICcuLi8uLi8uLi9hcGkvb3B0LWlucy9vcHQtaW5zLmpzJztcbmltcG9ydCB7IFJlY2lwaWVudHMgfSBmcm9tICcuLi8uLi8uLi9hcGkvcmVjaXBpZW50cy9yZWNpcGllbnRzLmpzJztcbmltcG9ydCBnZXRPcHRJblByb3ZpZGVyIGZyb20gJy4uL2Rucy9nZXRfb3B0LWluLXByb3ZpZGVyLmpzJztcbmltcG9ydCBnZXRPcHRJbktleSBmcm9tICcuLi9kbnMvZ2V0X29wdC1pbi1rZXkuanMnO1xuaW1wb3J0IHZlcmlmeVNpZ25hdHVyZSBmcm9tICcuLi9kb2ljaGFpbi92ZXJpZnlfc2lnbmF0dXJlLmpzJztcbmltcG9ydCB7IGdldEh0dHBHRVQgfSBmcm9tICcuLi8uLi8uLi8uLi9zZXJ2ZXIvYXBpL2h0dHAuanMnO1xuaW1wb3J0IHsgRE9JX01BSUxfRkVUQ0hfVVJMIH0gZnJvbSAnLi4vLi4vLi4vc3RhcnR1cC9zZXJ2ZXIvZW1haWwtY29uZmlndXJhdGlvbi5qcyc7XG5pbXBvcnQgeyBsb2dTZW5kIH0gZnJvbSBcIi4uLy4uLy4uL3N0YXJ0dXAvc2VydmVyL2xvZy1jb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBBY2NvdW50cyB9IGZyb20gJ21ldGVvci9hY2NvdW50cy1iYXNlJ1xuXG5jb25zdCBHZXREb2lNYWlsRGF0YVNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICBuYW1lX2lkOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH0sXG4gIHNpZ25hdHVyZToge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9XG59KTtcblxuY29uc3QgdXNlclByb2ZpbGVTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgc3ViamVjdDoge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICBvcHRpb25hbDp0cnVlXG4gIH0sXG4gIHJlZGlyZWN0OiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIHJlZ0V4OiBcIkAoaHR0cHM/fGZ0cCk6Ly8oLVxcXFwuKT8oW15cXFxccy8/XFxcXC4jLV0rXFxcXC4/KSsoL1teXFxcXHNdKik/JEBcIixcbiAgICBvcHRpb25hbDp0cnVlXG4gIH0sXG4gIHJldHVyblBhdGg6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgcmVnRXg6IFNpbXBsZVNjaGVtYS5SZWdFeC5FbWFpbCxcbiAgICBvcHRpb25hbDp0cnVlXG4gIH0sXG4gIHRlbXBsYXRlVVJMOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIHJlZ0V4OiBcIkAoaHR0cHM/fGZ0cCk6Ly8oLVxcXFwuKT8oW15cXFxccy8/XFxcXC4jLV0rXFxcXC4/KSsoL1teXFxcXHNdKik/JEBcIixcbiAgICBvcHRpb25hbDp0cnVlXG4gIH1cbn0pO1xuXG5jb25zdCBnZXREb2lNYWlsRGF0YSA9IChkYXRhKSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3Qgb3VyRGF0YSA9IGRhdGE7XG4gICAgR2V0RG9pTWFpbERhdGFTY2hlbWEudmFsaWRhdGUob3VyRGF0YSk7XG4gICAgY29uc3Qgb3B0SW4gPSBPcHRJbnMuZmluZE9uZSh7bmFtZUlkOiBvdXJEYXRhLm5hbWVfaWR9KTtcbiAgICBpZihvcHRJbiA9PT0gdW5kZWZpbmVkKSB0aHJvdyBcIk9wdC1JbiB3aXRoIG5hbWVfaWQ6IFwiK291ckRhdGEubmFtZV9pZCtcIiBub3QgZm91bmRcIjtcbiAgICBsb2dTZW5kKCdPcHQtSW4gZm91bmQnLG9wdEluKTtcblxuICAgIGNvbnN0IHJlY2lwaWVudCA9IFJlY2lwaWVudHMuZmluZE9uZSh7X2lkOiBvcHRJbi5yZWNpcGllbnR9KTtcbiAgICBpZihyZWNpcGllbnQgPT09IHVuZGVmaW5lZCkgdGhyb3cgXCJSZWNpcGllbnQgbm90IGZvdW5kXCI7XG4gICAgbG9nU2VuZCgnUmVjaXBpZW50IGZvdW5kJywgcmVjaXBpZW50KTtcblxuICAgIGNvbnN0IHBhcnRzID0gcmVjaXBpZW50LmVtYWlsLnNwbGl0KFwiQFwiKTtcbiAgICBjb25zdCBkb21haW4gPSBwYXJ0c1twYXJ0cy5sZW5ndGgtMV07XG5cbiAgICBsZXQgcHVibGljS2V5ID0gZ2V0T3B0SW5LZXkoeyBkb21haW46IGRvbWFpbn0pO1xuXG4gICAgaWYoIXB1YmxpY0tleSl7XG4gICAgICBjb25zdCBwcm92aWRlciA9IGdldE9wdEluUHJvdmlkZXIoe2RvbWFpbjogb3VyRGF0YS5kb21haW4gfSk7XG4gICAgICBsb2dTZW5kKFwidXNpbmcgZG9pY2hhaW4gcHJvdmlkZXIgaW5zdGVhZCBvZiBkaXJlY3RseSBjb25maWd1cmVkIHB1YmxpY0tleTpcIiwgeyBwcm92aWRlcjogcHJvdmlkZXIgfSk7XG4gICAgICBwdWJsaWNLZXkgPSBnZXRPcHRJbktleSh7IGRvbWFpbjogcHJvdmlkZXJ9KTsgLy9nZXQgcHVibGljIGtleSBmcm9tIHByb3ZpZGVyIG9yIGZhbGxiYWNrIGlmIHB1YmxpY2tleSB3YXMgbm90IHNldCBpbiBkbnNcbiAgICB9XG5cbiAgICBsb2dTZW5kKCdxdWVyaWVkIGRhdGE6IChwYXJ0cywgZG9tYWluLCBwcm92aWRlciwgcHVibGljS2V5KScsICcoJytwYXJ0cysnLCcrZG9tYWluKycsJytwdWJsaWNLZXkrJyknKTtcblxuICAgIC8vVE9ETzogT25seSBhbGxvdyBhY2Nlc3Mgb25lIHRpbWVcbiAgICAvLyBQb3NzaWJsZSBzb2x1dGlvbjpcbiAgICAvLyAxLiBQcm92aWRlciAoY29uZmlybSBkQXBwKSByZXF1ZXN0IHRoZSBkYXRhXG4gICAgLy8gMi4gUHJvdmlkZXIgcmVjZWl2ZSB0aGUgZGF0YVxuICAgIC8vIDMuIFByb3ZpZGVyIHNlbmRzIGNvbmZpcm1hdGlvbiBcIkkgZ290IHRoZSBkYXRhXCJcbiAgICAvLyA0LiBTZW5kIGRBcHAgbG9jayB0aGUgZGF0YSBmb3IgdGhpcyBvcHQgaW5cbiAgICBsb2dTZW5kKCd2ZXJpZnlpbmcgc2lnbmF0dXJlLi4uJyk7XG4gICAgaWYoIXZlcmlmeVNpZ25hdHVyZSh7cHVibGljS2V5OiBwdWJsaWNLZXksIGRhdGE6IG91ckRhdGEubmFtZV9pZCwgc2lnbmF0dXJlOiBvdXJEYXRhLnNpZ25hdHVyZX0pKSB7XG4gICAgICB0aHJvdyBcInNpZ25hdHVyZSBpbmNvcnJlY3QgLSBhY2Nlc3MgZGVuaWVkXCI7XG4gICAgfVxuICAgIFxuICAgIGxvZ1NlbmQoJ3NpZ25hdHVyZSB2ZXJpZmllZCcpO1xuXG4gICAgLy9UT0RPOiBRdWVyeSBmb3IgbGFuZ3VhZ2VcbiAgICBsZXQgZG9pTWFpbERhdGE7XG4gICAgdHJ5IHtcblxuICAgICAgZG9pTWFpbERhdGEgPSBnZXRIdHRwR0VUKERPSV9NQUlMX0ZFVENIX1VSTCwgXCJcIikuZGF0YTtcbiAgICAgIGxldCBkZWZhdWx0UmV0dXJuRGF0YSA9IHtcbiAgICAgICAgXCJyZWNpcGllbnRcIjogcmVjaXBpZW50LmVtYWlsLFxuICAgICAgICBcImNvbnRlbnRcIjogZG9pTWFpbERhdGEuZGF0YS5jb250ZW50LFxuICAgICAgICBcInJlZGlyZWN0XCI6IGRvaU1haWxEYXRhLmRhdGEucmVkaXJlY3QsXG4gICAgICAgIFwic3ViamVjdFwiOiBkb2lNYWlsRGF0YS5kYXRhLnN1YmplY3QsXG4gICAgICAgIFwicmV0dXJuUGF0aFwiOiBkb2lNYWlsRGF0YS5kYXRhLnJldHVyblBhdGhcbiAgICAgIH1cblxuICAgIGxldCByZXR1cm5EYXRhID0gZGVmYXVsdFJldHVybkRhdGE7XG5cbiAgICB0cnl7XG4gICAgICBsZXQgb3duZXIgPSBBY2NvdW50cy51c2Vycy5maW5kT25lKHtfaWQ6IG9wdEluLm93bmVySWR9KTtcbiAgICAgIGxldCBtYWlsVGVtcGxhdGUgPSBvd25lci5wcm9maWxlLm1haWxUZW1wbGF0ZTtcbiAgICAgIHVzZXJQcm9maWxlU2NoZW1hLnZhbGlkYXRlKG1haWxUZW1wbGF0ZSk7XG5cbiAgICAgIHJldHVybkRhdGFbXCJyZWRpcmVjdFwiXSA9IG1haWxUZW1wbGF0ZVtcInJlZGlyZWN0XCJdIHx8IGRlZmF1bHRSZXR1cm5EYXRhW1wicmVkaXJlY3RcIl07XG4gICAgICByZXR1cm5EYXRhW1wic3ViamVjdFwiXSA9IG1haWxUZW1wbGF0ZVtcInN1YmplY3RcIl0gfHwgZGVmYXVsdFJldHVybkRhdGFbXCJzdWJqZWN0XCJdO1xuICAgICAgcmV0dXJuRGF0YVtcInJldHVyblBhdGhcIl0gPSBtYWlsVGVtcGxhdGVbXCJyZXR1cm5QYXRoXCJdIHx8IGRlZmF1bHRSZXR1cm5EYXRhW1wicmV0dXJuUGF0aFwiXTtcbiAgICAgIHJldHVybkRhdGFbXCJjb250ZW50XCJdID0gbWFpbFRlbXBsYXRlW1widGVtcGxhdGVVUkxcIl0gPyAoZ2V0SHR0cEdFVChtYWlsVGVtcGxhdGVbXCJ0ZW1wbGF0ZVVSTFwiXSwgXCJcIikuY29udGVudCB8fCBkZWZhdWx0UmV0dXJuRGF0YVtcImNvbnRlbnRcIl0pIDogZGVmYXVsdFJldHVybkRhdGFbXCJjb250ZW50XCJdO1xuICAgICAgXG4gICAgfVxuICAgIGNhdGNoKGVycm9yKSB7XG4gICAgICByZXR1cm5EYXRhPWRlZmF1bHRSZXR1cm5EYXRhO1xuICAgIH1cblxuICAgICAgbG9nU2VuZCgnZG9pTWFpbERhdGEgYW5kIHVybDonLCBET0lfTUFJTF9GRVRDSF9VUkwsIHJldHVybkRhdGEpO1xuXG4gICAgICByZXR1cm4gcmV0dXJuRGF0YVxuXG4gICAgfSBjYXRjaChlcnJvcikge1xuICAgICAgdGhyb3cgXCJFcnJvciB3aGlsZSBmZXRjaGluZyBtYWlsIGNvbnRlbnQ6IFwiK2Vycm9yO1xuICAgIH1cblxuICB9IGNhdGNoKGV4Y2VwdGlvbikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2RhcHBzLmdldERvaU1haWxEYXRhLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGdldERvaU1haWxEYXRhO1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XG5pbXBvcnQgeyByZXNvbHZlVHh0IH0gZnJvbSAnLi4vLi4vLi4vLi4vc2VydmVyL2FwaS9kbnMuanMnO1xuaW1wb3J0IHsgRkFMTEJBQ0tfUFJPVklERVIgfSBmcm9tICcuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9kbnMtY29uZmlndXJhdGlvbi5qcyc7XG5pbXBvcnQge2lzUmVndGVzdCwgaXNUZXN0bmV0fSBmcm9tIFwiLi4vLi4vLi4vc3RhcnR1cC9zZXJ2ZXIvZGFwcC1jb25maWd1cmF0aW9uXCI7XG5pbXBvcnQge2xvZ1NlbmR9IGZyb20gXCIuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9sb2ctY29uZmlndXJhdGlvblwiO1xuXG5jb25zdCBPUFRfSU5fS0VZID0gXCJkb2ljaGFpbi1vcHQtaW4ta2V5XCI7XG5jb25zdCBPUFRfSU5fS0VZX1RFU1RORVQgPSBcImRvaWNoYWluLXRlc3RuZXQtb3B0LWluLWtleVwiO1xuXG5jb25zdCBHZXRPcHRJbktleVNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICBkb21haW46IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfVxufSk7XG5cblxuY29uc3QgZ2V0T3B0SW5LZXkgPSAoZGF0YSkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IG91ckRhdGEgPSBkYXRhO1xuICAgIEdldE9wdEluS2V5U2NoZW1hLnZhbGlkYXRlKG91ckRhdGEpO1xuXG4gICAgbGV0IG91ck9QVF9JTl9LRVk9T1BUX0lOX0tFWTtcblxuICAgIGlmKGlzUmVndGVzdCgpIHx8IGlzVGVzdG5ldCgpKXtcbiAgICAgICAgb3VyT1BUX0lOX0tFWSA9IE9QVF9JTl9LRVlfVEVTVE5FVDtcbiAgICAgICAgbG9nU2VuZCgnVXNpbmcgUmVnVGVzdDonK2lzUmVndGVzdCgpK1wiIFRlc3RuZXQ6IFwiK2lzVGVzdG5ldCgpK1wiIG91ck9QVF9JTl9LRVlcIixvdXJPUFRfSU5fS0VZKTtcbiAgICB9XG4gICAgY29uc3Qga2V5ID0gcmVzb2x2ZVR4dChvdXJPUFRfSU5fS0VZLCBvdXJEYXRhLmRvbWFpbik7XG4gICAgbG9nU2VuZCgnRE5TIFRYVCBjb25maWd1cmVkIHB1YmxpYyBrZXkgb2YgcmVjaXBpZW50IGVtYWlsIGRvbWFpbiBhbmQgY29uZmlybWF0aW9uIGRhcHAnLHtmb3VuZEtleTprZXksIGRvbWFpbjpvdXJEYXRhLmRvbWFpbiwgZG5za2V5Om91ck9QVF9JTl9LRVl9KTtcblxuICAgIGlmKGtleSA9PT0gdW5kZWZpbmVkKSByZXR1cm4gdXNlRmFsbGJhY2sob3VyRGF0YS5kb21haW4pO1xuICAgIHJldHVybiBrZXk7XG4gIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2Rucy5nZXRPcHRJbktleS5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9XG59O1xuXG5jb25zdCB1c2VGYWxsYmFjayA9IChkb21haW4pID0+IHtcbiAgaWYoZG9tYWluID09PSBGQUxMQkFDS19QUk9WSURFUikgdGhyb3cgbmV3IE1ldGVvci5FcnJvcihcIkZhbGxiYWNrIGhhcyBubyBrZXkgZGVmaW5lZCFcIik7XG4gICAgbG9nU2VuZChcIktleSBub3QgZGVmaW5lZC4gVXNpbmcgZmFsbGJhY2s6IFwiLEZBTExCQUNLX1BST1ZJREVSKTtcbiAgcmV0dXJuIGdldE9wdEluS2V5KHtkb21haW46IEZBTExCQUNLX1BST1ZJREVSfSk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBnZXRPcHRJbktleTtcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tICdzaW1wbC1zY2hlbWEnO1xuaW1wb3J0IHsgcmVzb2x2ZVR4dCB9IGZyb20gJy4uLy4uLy4uLy4uL3NlcnZlci9hcGkvZG5zLmpzJztcbmltcG9ydCB7IEZBTExCQUNLX1BST1ZJREVSIH0gZnJvbSAnLi4vLi4vLi4vc3RhcnR1cC9zZXJ2ZXIvZG5zLWNvbmZpZ3VyYXRpb24uanMnO1xuaW1wb3J0IHtsb2dTZW5kfSBmcm9tIFwiLi4vLi4vLi4vc3RhcnR1cC9zZXJ2ZXIvbG9nLWNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7aXNSZWd0ZXN0LCBpc1Rlc3RuZXR9IGZyb20gXCIuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9kYXBwLWNvbmZpZ3VyYXRpb25cIjtcblxuY29uc3QgUFJPVklERVJfS0VZID0gXCJkb2ljaGFpbi1vcHQtaW4tcHJvdmlkZXJcIjtcbmNvbnN0IFBST1ZJREVSX0tFWV9URVNUTkVUID0gXCJkb2ljaGFpbi10ZXN0bmV0LW9wdC1pbi1wcm92aWRlclwiO1xuXG5jb25zdCBHZXRPcHRJblByb3ZpZGVyU2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIGRvbWFpbjoge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9XG59KTtcblxuXG5jb25zdCBnZXRPcHRJblByb3ZpZGVyID0gKGRhdGEpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBvdXJEYXRhID0gZGF0YTtcbiAgICBHZXRPcHRJblByb3ZpZGVyU2NoZW1hLnZhbGlkYXRlKG91ckRhdGEpO1xuXG4gICAgbGV0IG91clBST1ZJREVSX0tFWT1QUk9WSURFUl9LRVk7XG4gICAgaWYoaXNSZWd0ZXN0KCkgfHwgaXNUZXN0bmV0KCkpe1xuICAgICAgICBvdXJQUk9WSURFUl9LRVkgPSBQUk9WSURFUl9LRVlfVEVTVE5FVDtcbiAgICAgICAgbG9nU2VuZCgnVXNpbmcgUmVnVGVzdDonK2lzUmVndGVzdCgpK1wiIDogVGVzdG5ldDpcIitpc1Rlc3RuZXQoKStcIiBQUk9WSURFUl9LRVlcIix7cHJvdmlkZXJLZXk6b3VyUFJPVklERVJfS0VZLCBkb21haW46b3VyRGF0YS5kb21haW59KTtcbiAgICB9XG5cbiAgICBjb25zdCBwcm92aWRlciA9IHJlc29sdmVUeHQob3VyUFJPVklERVJfS0VZLCBvdXJEYXRhLmRvbWFpbik7XG4gICAgaWYocHJvdmlkZXIgPT09IHVuZGVmaW5lZCkgcmV0dXJuIHVzZUZhbGxiYWNrKCk7XG5cbiAgICBsb2dTZW5kKCdvcHQtaW4tcHJvdmlkZXIgZnJvbSBkbnMgLSBzZXJ2ZXIgb2YgbWFpbCByZWNpcGllbnQ6IChUWFQpOicscHJvdmlkZXIpO1xuICAgIHJldHVybiBwcm92aWRlcjtcbiAgfSBjYXRjaCAoZXhjZXB0aW9uKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZG5zLmdldE9wdEluUHJvdmlkZXIuZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgfVxufTtcblxuY29uc3QgdXNlRmFsbGJhY2sgPSAoKSA9PiB7XG4gIGxvZ1NlbmQoJ1Byb3ZpZGVyIG5vdCBkZWZpbmVkLiBGYWxsYmFjayAnK0ZBTExCQUNLX1BST1ZJREVSKycgaXMgdXNlZCcpO1xuICByZXR1cm4gRkFMTEJBQ0tfUFJPVklERVI7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBnZXRPcHRJblByb3ZpZGVyO1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XG5pbXBvcnQgeyBDT05GSVJNX0NMSUVOVCwgQ09ORklSTV9BRERSRVNTIH0gZnJvbSAnLi4vLi4vLi4vc3RhcnR1cC9zZXJ2ZXIvZG9pY2hhaW4tY29uZmlndXJhdGlvbi5qcyc7XG5pbXBvcnQgeyBnZXRXaWYgfSBmcm9tICcuLi8uLi8uLi8uLi9zZXJ2ZXIvYXBpL2RvaWNoYWluLmpzJztcbmltcG9ydCB7IERvaWNoYWluRW50cmllcyB9IGZyb20gJy4uLy4uLy4uL2FwaS9kb2ljaGFpbi9lbnRyaWVzLmpzJztcbmltcG9ydCBhZGRGZXRjaERvaU1haWxEYXRhSm9iIGZyb20gJy4uL2pvYnMvYWRkX2ZldGNoLWRvaS1tYWlsLWRhdGEuanMnO1xuaW1wb3J0IGdldFByaXZhdGVLZXlGcm9tV2lmIGZyb20gJy4vZ2V0X3ByaXZhdGUta2V5X2Zyb21fd2lmLmpzJztcbmltcG9ydCBkZWNyeXB0TWVzc2FnZSBmcm9tICcuL2RlY3J5cHRfbWVzc2FnZS5qcyc7XG5pbXBvcnQge2xvZ0NvbmZpcm0sIGxvZ1NlbmR9IGZyb20gXCIuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9sb2ctY29uZmlndXJhdGlvblwiO1xuXG5jb25zdCBBZGREb2ljaGFpbkVudHJ5U2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIG5hbWU6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfSxcbiAgdmFsdWU6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfSxcbiAgYWRkcmVzczoge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9LFxuICB0eElkOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH1cbn0pO1xuXG4vKipcbiAqIEluc2VydHNcbiAqXG4gKiBAcGFyYW0gZW50cnlcbiAqIEByZXR1cm5zIHsqfVxuICovXG5jb25zdCBhZGREb2ljaGFpbkVudHJ5ID0gKGVudHJ5KSA9PiB7XG4gIHRyeSB7XG5cbiAgICBjb25zdCBvdXJFbnRyeSA9IGVudHJ5O1xuICAgIGxvZ0NvbmZpcm0oJ2FkZGluZyBEb2ljaGFpbkVudHJ5IG9uIEJvYi4uLicsb3VyRW50cnkubmFtZSk7XG4gICAgQWRkRG9pY2hhaW5FbnRyeVNjaGVtYS52YWxpZGF0ZShvdXJFbnRyeSk7XG5cbiAgICBjb25zdCBldHkgPSBEb2ljaGFpbkVudHJpZXMuZmluZE9uZSh7bmFtZTogb3VyRW50cnkubmFtZX0pO1xuICAgIGlmKGV0eSAhPT0gdW5kZWZpbmVkKXtcbiAgICAgICAgbG9nU2VuZCgncmV0dXJuaW5nIGxvY2FsbHkgc2F2ZWQgZW50cnkgd2l0aCBfaWQ6JytldHkuX2lkKTtcbiAgICAgICAgcmV0dXJuIGV0eS5faWQ7XG4gICAgfVxuXG4gICAgY29uc3QgdmFsdWUgPSBKU09OLnBhcnNlKG91ckVudHJ5LnZhbHVlKTtcbiAgICAvL2xvZ1NlbmQoXCJ2YWx1ZTpcIix2YWx1ZSk7XG4gICAgaWYodmFsdWUuZnJvbSA9PT0gdW5kZWZpbmVkKSB0aHJvdyBcIldyb25nIGJsb2NrY2hhaW4gZW50cnlcIjsgLy9UT0RPIGlmIGZyb20gaXMgbWlzc2luZyBidXQgdmFsdWUgaXMgdGhlcmUsIGl0IGlzIHByb2JhYmx5IGFsbHJlYWR5IGhhbmRlbGVkIGNvcnJlY3RseSBhbnl3YXlzIHRoaXMgaXMgbm90IHNvIGNvb2wgYXMgaXQgc2VlbXMuXG4gICAgY29uc3Qgd2lmID0gZ2V0V2lmKENPTkZJUk1fQ0xJRU5ULCBDT05GSVJNX0FERFJFU1MpO1xuICAgIGNvbnN0IHByaXZhdGVLZXkgPSBnZXRQcml2YXRlS2V5RnJvbVdpZih7d2lmOiB3aWZ9KTtcbiAgICBsb2dTZW5kKCdnb3QgcHJpdmF0ZSBrZXkgKHdpbGwgbm90IHNob3cgaXQgaGVyZSknKTtcblxuICAgIGNvbnN0IGRvbWFpbiA9IGRlY3J5cHRNZXNzYWdlKHtwcml2YXRlS2V5OiBwcml2YXRlS2V5LCBtZXNzYWdlOiB2YWx1ZS5mcm9tfSk7XG4gICAgbG9nU2VuZCgnZGVjcnlwdGVkIG1lc3NhZ2UgZnJvbSBkb21haW46ICcsZG9tYWluKTtcblxuICAgIGNvbnN0IG5hbWVQb3MgPSBvdXJFbnRyeS5uYW1lLmluZGV4T2YoJy0nKTsgLy9pZiB0aGlzIGlzIG5vdCBhIGNvLXJlZ2lzdHJhdGlvbiBmZXRjaCBtYWlsLlxuICAgIGxvZ1NlbmQoJ25hbWVQb3M6JyxuYW1lUG9zKTtcbiAgICBjb25zdCBtYXN0ZXJEb2kgPSAobmFtZVBvcyE9LTEpP291ckVudHJ5Lm5hbWUuc3Vic3RyaW5nKDAsbmFtZVBvcyk6dW5kZWZpbmVkO1xuICAgIGxvZ1NlbmQoJ21hc3RlckRvaTonLG1hc3RlckRvaSk7XG4gICAgY29uc3QgaW5kZXggPSBtYXN0ZXJEb2k/b3VyRW50cnkubmFtZS5zdWJzdHJpbmcobmFtZVBvcysxKTp1bmRlZmluZWQ7XG4gICAgbG9nU2VuZCgnaW5kZXg6JyxpbmRleCk7XG5cbiAgICBjb25zdCBpZCA9IERvaWNoYWluRW50cmllcy5pbnNlcnQoe1xuICAgICAgICBuYW1lOiBvdXJFbnRyeS5uYW1lLFxuICAgICAgICB2YWx1ZTogb3VyRW50cnkudmFsdWUsXG4gICAgICAgIGFkZHJlc3M6IG91ckVudHJ5LmFkZHJlc3MsXG4gICAgICAgIG1hc3RlckRvaTogbWFzdGVyRG9pLFxuICAgICAgICBpbmRleDogaW5kZXgsXG4gICAgICAgIHR4SWQ6IG91ckVudHJ5LnR4SWQsXG4gICAgICAgIGV4cGlyZXNJbjogb3VyRW50cnkuZXhwaXJlc0luLFxuICAgICAgICBleHBpcmVkOiBvdXJFbnRyeS5leHBpcmVkXG4gICAgfSk7XG5cbiAgICBsb2dTZW5kKCdEb2ljaGFpbkVudHJ5IGFkZGVkIG9uIEJvYjonLCB7aWQ6aWQsbmFtZTpvdXJFbnRyeS5uYW1lLG1hc3RlckRvaTptYXN0ZXJEb2ksaW5kZXg6aW5kZXh9KTtcblxuICAgIGlmKCFtYXN0ZXJEb2kpe1xuICAgICAgICBhZGRGZXRjaERvaU1haWxEYXRhSm9iKHtcbiAgICAgICAgICAgIG5hbWU6IG91ckVudHJ5Lm5hbWUsXG4gICAgICAgICAgICBkb21haW46IGRvbWFpblxuICAgICAgICB9KTtcbiAgICAgICAgbG9nU2VuZCgnTmV3IGVudHJ5IGFkZGVkOiBcXG4nK1xuICAgICAgICAgICAgJ05hbWVJZD0nK291ckVudHJ5Lm5hbWUrXCJcXG5cIitcbiAgICAgICAgICAgICdBZGRyZXNzPScrb3VyRW50cnkuYWRkcmVzcytcIlxcblwiK1xuICAgICAgICAgICAgJ1R4SWQ9JytvdXJFbnRyeS50eElkK1wiXFxuXCIrXG4gICAgICAgICAgICAnVmFsdWU9JytvdXJFbnRyeS52YWx1ZSk7XG5cbiAgICB9ZWxzZXtcbiAgICAgICAgbG9nU2VuZCgnVGhpcyB0cmFuc2FjdGlvbiBiZWxvbmdzIHRvIGNvLXJlZ2lzdHJhdGlvbicsIG1hc3RlckRvaSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGlkO1xuICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdkb2ljaGFpbi5hZGRFbnRyeUFuZEZldGNoRGF0YS5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBhZGREb2ljaGFpbkVudHJ5O1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgeyBsaXN0U2luY2VCbG9jaywgbmFtZVNob3csIGdldFJhd1RyYW5zYWN0aW9ufSBmcm9tICcuLi8uLi8uLi8uLi9zZXJ2ZXIvYXBpL2RvaWNoYWluLmpzJztcbmltcG9ydCB7IENPTkZJUk1fQ0xJRU5ULCBDT05GSVJNX0FERFJFU1MgfSBmcm9tICcuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9kb2ljaGFpbi1jb25maWd1cmF0aW9uLmpzJztcbmltcG9ydCBhZGREb2ljaGFpbkVudHJ5IGZyb20gJy4vYWRkX2VudHJ5X2FuZF9mZXRjaF9kYXRhLmpzJ1xuaW1wb3J0IHsgTWV0YSB9IGZyb20gJy4uLy4uLy4uL2FwaS9tZXRhL21ldGEuanMnO1xuaW1wb3J0IGFkZE9yVXBkYXRlTWV0YSBmcm9tICcuLi9tZXRhL2FkZE9yVXBkYXRlLmpzJztcbmltcG9ydCB7bG9nQ29uZmlybX0gZnJvbSBcIi4uLy4uLy4uL3N0YXJ0dXAvc2VydmVyL2xvZy1jb25maWd1cmF0aW9uXCI7XG5cbmNvbnN0IFRYX05BTUVfU1RBUlQgPSBcImUvXCI7XG5jb25zdCBMQVNUX0NIRUNLRURfQkxPQ0tfS0VZID0gXCJsYXN0Q2hlY2tlZEJsb2NrXCI7XG5cbmNvbnN0IGNoZWNrTmV3VHJhbnNhY3Rpb24gPSAodHhpZCwgam9iKSA9PiB7XG4gIHRyeSB7XG5cbiAgICAgIGlmKCF0eGlkKXtcbiAgICAgICAgICBsb2dDb25maXJtKFwiY2hlY2tOZXdUcmFuc2FjdGlvbiB0cmlnZ2VyZWQgd2hlbiBzdGFydGluZyBub2RlIC0gY2hlY2tpbmcgYWxsIGNvbmZpcm1lZCBibG9ja3Mgc2luY2UgbGFzdCBjaGVjayBmb3IgZG9pY2hhaW4gYWRkcmVzc1wiLENPTkZJUk1fQUREUkVTUyk7XG5cbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICB2YXIgbGFzdENoZWNrZWRCbG9jayA9IE1ldGEuZmluZE9uZSh7a2V5OiBMQVNUX0NIRUNLRURfQkxPQ0tfS0VZfSk7XG4gICAgICAgICAgICAgIGlmKGxhc3RDaGVja2VkQmxvY2sgIT09IHVuZGVmaW5lZCkgbGFzdENoZWNrZWRCbG9jayA9IGxhc3RDaGVja2VkQmxvY2sudmFsdWU7XG4gICAgICAgICAgICAgIGxvZ0NvbmZpcm0oXCJsYXN0Q2hlY2tlZEJsb2NrXCIsbGFzdENoZWNrZWRCbG9jayk7XG4gICAgICAgICAgICAgIGNvbnN0IHJldCA9IGxpc3RTaW5jZUJsb2NrKENPTkZJUk1fQ0xJRU5ULCBsYXN0Q2hlY2tlZEJsb2NrKTtcbiAgICAgICAgICAgICAgaWYocmV0ID09PSB1bmRlZmluZWQgfHwgcmV0LnRyYW5zYWN0aW9ucyA9PT0gdW5kZWZpbmVkKSByZXR1cm47XG5cbiAgICAgICAgICAgICAgY29uc3QgdHhzID0gcmV0LnRyYW5zYWN0aW9ucztcbiAgICAgICAgICAgICAgbGFzdENoZWNrZWRCbG9jayA9IHJldC5sYXN0YmxvY2s7XG4gICAgICAgICAgICAgIGlmKCFyZXQgfHwgIXR4cyB8fCAhdHhzLmxlbmd0aD09PTApe1xuICAgICAgICAgICAgICAgICAgbG9nQ29uZmlybShcInRyYW5zYWN0aW9ucyBkbyBub3QgY29udGFpbiBuYW1lT3AgdHJhbnNhY3Rpb24gZGV0YWlscyBvciB0cmFuc2FjdGlvbiBub3QgZm91bmQuXCIsIGxhc3RDaGVja2VkQmxvY2spO1xuICAgICAgICAgICAgICAgICAgYWRkT3JVcGRhdGVNZXRhKHtrZXk6IExBU1RfQ0hFQ0tFRF9CTE9DS19LRVksIHZhbHVlOiBsYXN0Q2hlY2tlZEJsb2NrfSk7XG4gICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBsb2dDb25maXJtKFwibGlzdFNpbmNlQmxvY2tcIixyZXQpO1xuXG4gICAgICAgICAgICAgIGNvbnN0IGFkZHJlc3NUeHMgPSB0eHMuZmlsdGVyKHR4ID0+XG4gICAgICAgICAgICAgICAgICB0eC5hZGRyZXNzID09PSBDT05GSVJNX0FERFJFU1NcbiAgICAgICAgICAgICAgICAgICYmIHR4Lm5hbWUgIT09IHVuZGVmaW5lZCAvL3NpbmNlIG5hbWVfc2hvdyBjYW5ub3QgYmUgcmVhZCB3aXRob3V0IGNvbmZpcm1hdGlvbnNcbiAgICAgICAgICAgICAgICAgICYmIHR4Lm5hbWUuc3RhcnRzV2l0aChcImRvaTogXCIrVFhfTkFNRV9TVEFSVCkgIC8vaGVyZSAnZG9pOiBlL3h4eHgnIGlzIGFscmVhZHkgd3JpdHRlbiBpbiB0aGUgYmxvY2tcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgYWRkcmVzc1R4cy5mb3JFYWNoKHR4ID0+IHtcbiAgICAgICAgICAgICAgICAgIGxvZ0NvbmZpcm0oXCJ0eDpcIix0eCk7XG4gICAgICAgICAgICAgICAgICB2YXIgdHhOYW1lID0gdHgubmFtZS5zdWJzdHJpbmcoKFwiZG9pOiBcIitUWF9OQU1FX1NUQVJUKS5sZW5ndGgpO1xuICAgICAgICAgICAgICAgICAgbG9nQ29uZmlybShcImV4Y3V0aW5nIG5hbWVfc2hvdyBpbiBvcmRlciB0byBnZXQgdmFsdWUgb2YgbmFtZUlkOlwiLCB0eE5hbWUpO1xuICAgICAgICAgICAgICAgICAgY29uc3QgZXR5ID0gbmFtZVNob3coQ09ORklSTV9DTElFTlQsIHR4TmFtZSk7XG4gICAgICAgICAgICAgICAgICBsb2dDb25maXJtKFwibmFtZVNob3c6IHZhbHVlXCIsZXR5KTtcbiAgICAgICAgICAgICAgICAgIGlmKCFldHkpe1xuICAgICAgICAgICAgICAgICAgICAgIGxvZ0NvbmZpcm0oXCJjb3VsZG4ndCBmaW5kIG5hbWUgLSBvYnZpb3VzbHkgbm90ICh5ZXQ/ISkgY29uZmlybWVkIGluIGJsb2NrY2hhaW46XCIsIGV0eSk7XG4gICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgYWRkVHgodHhOYW1lLCBldHkudmFsdWUsdHguYWRkcmVzcyx0eC50eGlkKTsgLy9UT0RPIGV0eS52YWx1ZS5mcm9tIGlzIG1heWJlIE5PVCBleGlzdGluZyBiZWNhdXNlIG9mIHRoaXMgaXRzICAobWF5YmUpIG9udCB3b3JraW5nLi4uXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICBhZGRPclVwZGF0ZU1ldGEoe2tleTogTEFTVF9DSEVDS0VEX0JMT0NLX0tFWSwgdmFsdWU6IGxhc3RDaGVja2VkQmxvY2t9KTtcbiAgICAgICAgICAgICAgbG9nQ29uZmlybShcIlRyYW5zYWN0aW9ucyB1cGRhdGVkIC0gbGFzdENoZWNrZWRCbG9jazpcIixsYXN0Q2hlY2tlZEJsb2NrKTtcbiAgICAgICAgICAgICAgam9iLmRvbmUoKTtcbiAgICAgICAgICB9IGNhdGNoKGV4Y2VwdGlvbikge1xuICAgICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCduYW1lY29pbi5jaGVja05ld1RyYW5zYWN0aW9ucy5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICAgICAgICAgIH1cblxuICAgICAgfWVsc2V7XG4gICAgICAgICAgbG9nQ29uZmlybShcInR4aWQ6IFwiK3R4aWQrXCIgd2FzIHRyaWdnZXJlZCBieSB3YWxsZXRub3RpZnkgZm9yIGFkZHJlc3M6XCIsQ09ORklSTV9BRERSRVNTKTtcblxuICAgICAgICAgIGNvbnN0IHJldCA9IGdldFJhd1RyYW5zYWN0aW9uKENPTkZJUk1fQ0xJRU5ULCB0eGlkKTtcbiAgICAgICAgICBjb25zdCB0eHMgPSByZXQudm91dDtcblxuICAgICAgICAgIGlmKCFyZXQgfHwgIXR4cyB8fCAhdHhzLmxlbmd0aD09PTApe1xuICAgICAgICAgICAgICBsb2dDb25maXJtKFwidHhpZCBcIit0eGlkKycgZG9lcyBub3QgY29udGFpbiB0cmFuc2FjdGlvbiBkZXRhaWxzIG9yIHRyYW5zYWN0aW9uIG5vdCBmb3VuZC4nKTtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgIC8vIGxvZ0NvbmZpcm0oJ25vdyBjaGVja2luZyByYXcgdHJhbnNhY3Rpb25zIHdpdGggZmlsdGVyOicsdHhzKTtcblxuICAgICAgICAgIGNvbnN0IGFkZHJlc3NUeHMgPSB0eHMuZmlsdGVyKHR4ID0+XG4gICAgICAgICAgICAgIHR4LnNjcmlwdFB1YktleSAhPT0gdW5kZWZpbmVkXG4gICAgICAgICAgICAgICYmIHR4LnNjcmlwdFB1YktleS5uYW1lT3AgIT09IHVuZGVmaW5lZFxuICAgICAgICAgICAgICAmJiB0eC5zY3JpcHRQdWJLZXkubmFtZU9wLm9wID09PSBcIm5hbWVfZG9pXCJcbiAgICAgICAgICAgIC8vICAmJiB0eC5zY3JpcHRQdWJLZXkuYWRkcmVzc2VzWzBdID09PSBDT05GSVJNX0FERFJFU1MgLy9vbmx5IG93biB0cmFuc2FjdGlvbiBzaG91bGQgYXJyaXZlIGhlcmUuIC0gc28gY2hlY2sgb24gb3duIGFkZHJlc3MgdW5uZWNjZXNhcnlcbiAgICAgICAgICAgICAgJiYgdHguc2NyaXB0UHViS2V5Lm5hbWVPcC5uYW1lICE9PSB1bmRlZmluZWRcbiAgICAgICAgICAgICAgJiYgdHguc2NyaXB0UHViS2V5Lm5hbWVPcC5uYW1lLnN0YXJ0c1dpdGgoVFhfTkFNRV9TVEFSVClcbiAgICAgICAgICApO1xuXG4gICAgICAgICAgLy9sb2dDb25maXJtKFwiZm91bmQgbmFtZV9vcCB0cmFuc2FjdGlvbnM6XCIsIGFkZHJlc3NUeHMpO1xuICAgICAgICAgIGFkZHJlc3NUeHMuZm9yRWFjaCh0eCA9PiB7XG4gICAgICAgICAgICAgIGFkZFR4KHR4LnNjcmlwdFB1YktleS5uYW1lT3AubmFtZSwgdHguc2NyaXB0UHViS2V5Lm5hbWVPcC52YWx1ZSx0eC5zY3JpcHRQdWJLZXkuYWRkcmVzc2VzWzBdLHR4aWQpO1xuICAgICAgICAgIH0pO1xuICAgICAgfVxuICB9IGNhdGNoKGV4Y2VwdGlvbikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2RvaWNoYWluLmNoZWNrTmV3VHJhbnNhY3Rpb25zLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59O1xuXG5cbmZ1bmN0aW9uIGFkZFR4KG5hbWUsIHZhbHVlLCBhZGRyZXNzLCB0eGlkKSB7XG4gICAgY29uc3QgdHhOYW1lID0gbmFtZS5zdWJzdHJpbmcoVFhfTkFNRV9TVEFSVC5sZW5ndGgpO1xuXG4gICAgYWRkRG9pY2hhaW5FbnRyeSh7XG4gICAgICAgIG5hbWU6IHR4TmFtZSxcbiAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICBhZGRyZXNzOiBhZGRyZXNzLFxuICAgICAgICB0eElkOiB0eGlkXG4gICAgfSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNoZWNrTmV3VHJhbnNhY3Rpb247XG5cbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tICdzaW1wbC1zY2hlbWEnO1xuaW1wb3J0IGNyeXB0byBmcm9tICdjcnlwdG8nO1xuaW1wb3J0IGVjaWVzIGZyb20gJ3N0YW5kYXJkLWVjaWVzJztcblxuY29uc3QgRGVjcnlwdE1lc3NhZ2VTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgcHJpdmF0ZUtleToge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9LFxuICBtZXNzYWdlOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH1cbn0pO1xuXG5jb25zdCBkZWNyeXB0TWVzc2FnZSA9IChkYXRhKSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3Qgb3VyRGF0YSA9IGRhdGE7XG4gICAgRGVjcnlwdE1lc3NhZ2VTY2hlbWEudmFsaWRhdGUob3VyRGF0YSk7XG4gICAgY29uc3QgcHJpdmF0ZUtleSA9IEJ1ZmZlci5mcm9tKG91ckRhdGEucHJpdmF0ZUtleSwgJ2hleCcpO1xuICAgIGNvbnN0IGVjZGggPSBjcnlwdG8uY3JlYXRlRUNESCgnc2VjcDI1NmsxJyk7XG4gICAgZWNkaC5zZXRQcml2YXRlS2V5KHByaXZhdGVLZXkpO1xuICAgIGNvbnN0IG1lc3NhZ2UgPSBCdWZmZXIuZnJvbShvdXJEYXRhLm1lc3NhZ2UsICdoZXgnKTtcbiAgICByZXR1cm4gZWNpZXMuZGVjcnlwdChlY2RoLCBtZXNzYWdlKS50b1N0cmluZygndXRmOCcpO1xuICB9IGNhdGNoKGV4Y2VwdGlvbikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2RvaWNoYWluLmRlY3J5cHRNZXNzYWdlLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGRlY3J5cHRNZXNzYWdlO1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XG5pbXBvcnQgZWNpZXMgZnJvbSAnc3RhbmRhcmQtZWNpZXMnO1xuXG5jb25zdCBFbmNyeXB0TWVzc2FnZVNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICBwdWJsaWNLZXk6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfSxcbiAgbWVzc2FnZToge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9XG59KTtcblxuY29uc3QgZW5jcnlwdE1lc3NhZ2UgPSAoZGF0YSkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IG91ckRhdGEgPSBkYXRhO1xuICAgIEVuY3J5cHRNZXNzYWdlU2NoZW1hLnZhbGlkYXRlKG91ckRhdGEpO1xuICAgIGNvbnN0IHB1YmxpY0tleSA9IEJ1ZmZlci5mcm9tKG91ckRhdGEucHVibGljS2V5LCAnaGV4Jyk7XG4gICAgY29uc3QgbWVzc2FnZSA9IEJ1ZmZlci5mcm9tKG91ckRhdGEubWVzc2FnZSk7XG4gICAgcmV0dXJuIGVjaWVzLmVuY3J5cHQocHVibGljS2V5LCBtZXNzYWdlKS50b1N0cmluZygnaGV4Jyk7XG4gIH0gY2F0Y2goZXhjZXB0aW9uKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZG9pY2hhaW4uZW5jcnlwdE1lc3NhZ2UuZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgZW5jcnlwdE1lc3NhZ2U7XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcbmltcG9ydCB7IE9wdElucyB9IGZyb20gJy4uLy4uLy4uL2FwaS9vcHQtaW5zL29wdC1pbnMuanMnO1xuaW1wb3J0IGdldEtleVBhaXIgZnJvbSAnLi9nZXRfa2V5LXBhaXIuanMnO1xuaW1wb3J0IHtsb2dTZW5kfSBmcm9tIFwiLi4vLi4vLi4vc3RhcnR1cC9zZXJ2ZXIvbG9nLWNvbmZpZ3VyYXRpb25cIjtcblxuY29uc3QgR2VuZXJhdGVOYW1lSWRTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgaWQ6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfSxcbiAgbWFzdGVyRG9pOiB7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICBvcHRpb25hbDogdHJ1ZVxuICB9LFxuICBpbmRleDoge1xuICAgICAgdHlwZTogU2ltcGxlU2NoZW1hLkludGVnZXIsXG4gICAgICBvcHRpb25hbDogdHJ1ZVxuICB9XG59KTtcblxuY29uc3QgZ2VuZXJhdGVOYW1lSWQgPSAob3B0SW4pID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBvdXJPcHRJbiA9IG9wdEluO1xuICAgIEdlbmVyYXRlTmFtZUlkU2NoZW1hLnZhbGlkYXRlKG91ck9wdEluKTtcbiAgICBsZXQgbmFtZUlkO1xuICAgIGlmKG9wdEluLm1hc3RlckRvaSl7XG4gICAgICAgIG5hbWVJZCA9IG91ck9wdEluLm1hc3RlckRvaStcIi1cIitvdXJPcHRJbi5pbmRleDtcbiAgICAgICAgbG9nU2VuZChcInVzZWQgbWFzdGVyX2RvaSBhcyBuYW1lSWQgaW5kZXggXCIrb3B0SW4uaW5kZXgrXCJzdG9yYWdlOlwiLG5hbWVJZCk7XG4gICAgfVxuICAgIGVsc2V7XG4gICAgICAgIG5hbWVJZCA9IGdldEtleVBhaXIoKS5wcml2YXRlS2V5O1xuICAgICAgICBsb2dTZW5kKFwiZ2VuZXJhdGVkIG5hbWVJZCBmb3IgZG9pY2hhaW4gc3RvcmFnZTpcIixuYW1lSWQpO1xuICAgIH1cblxuICAgIE9wdElucy51cGRhdGUoe19pZCA6IG91ck9wdEluLmlkfSwgeyRzZXQ6e25hbWVJZDogbmFtZUlkfX0pO1xuXG4gICAgcmV0dXJuIG5hbWVJZDtcbiAgfSBjYXRjaChleGNlcHRpb24pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdkb2ljaGFpbi5nZW5lcmF0ZU5hbWVJZC5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBnZW5lcmF0ZU5hbWVJZDtcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tICdzaW1wbC1zY2hlbWEnO1xuaW1wb3J0IENyeXB0b0pTIGZyb20gJ2NyeXB0by1qcyc7XG5pbXBvcnQgQmFzZTU4IGZyb20gJ2JzNTgnO1xuaW1wb3J0IHsgaXNSZWd0ZXN0IH0gZnJvbSAnLi4vLi4vLi4vc3RhcnR1cC9zZXJ2ZXIvZGFwcC1jb25maWd1cmF0aW9uLmpzJztcbmltcG9ydCB7aXNUZXN0bmV0fSBmcm9tIFwiLi4vLi4vLi4vc3RhcnR1cC9zZXJ2ZXIvZGFwcC1jb25maWd1cmF0aW9uXCI7XG5cbmNvbnN0IFZFUlNJT05fQllURSA9IDB4MzQ7XG5jb25zdCBWRVJTSU9OX0JZVEVfUkVHVEVTVCA9IDB4NmY7XG5jb25zdCBHZXRBZGRyZXNzU2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIHB1YmxpY0tleToge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9XG59KTtcblxuY29uc3QgZ2V0QWRkcmVzcyA9IChkYXRhKSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3Qgb3VyRGF0YSA9IGRhdGE7XG4gICAgR2V0QWRkcmVzc1NjaGVtYS52YWxpZGF0ZShvdXJEYXRhKTtcbiAgICByZXR1cm4gX2dldEFkZHJlc3Mob3VyRGF0YS5wdWJsaWNLZXkpO1xuICB9IGNhdGNoKGV4Y2VwdGlvbikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2RvaWNoYWluLmdldEFkZHJlc3MuZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgfVxufTtcblxuZnVuY3Rpb24gX2dldEFkZHJlc3MocHVibGljS2V5KSB7XG4gIGNvbnN0IHB1YktleSA9IENyeXB0b0pTLmxpYi5Xb3JkQXJyYXkuY3JlYXRlKEJ1ZmZlci5mcm9tKHB1YmxpY0tleSwgJ2hleCcpKTtcbiAgbGV0IGtleSA9IENyeXB0b0pTLlNIQTI1NihwdWJLZXkpO1xuICBrZXkgPSBDcnlwdG9KUy5SSVBFTUQxNjAoa2V5KTtcbiAgbGV0IHZlcnNpb25CeXRlID0gVkVSU0lPTl9CWVRFO1xuICBpZihpc1JlZ3Rlc3QoKSB8fCBpc1Rlc3RuZXQoKSkgdmVyc2lvbkJ5dGUgPSBWRVJTSU9OX0JZVEVfUkVHVEVTVDtcbiAgbGV0IGFkZHJlc3MgPSBCdWZmZXIuY29uY2F0KFtCdWZmZXIuZnJvbShbdmVyc2lvbkJ5dGVdKSwgQnVmZmVyLmZyb20oa2V5LnRvU3RyaW5nKCksICdoZXgnKV0pO1xuICBrZXkgPSBDcnlwdG9KUy5TSEEyNTYoQ3J5cHRvSlMubGliLldvcmRBcnJheS5jcmVhdGUoYWRkcmVzcykpO1xuICBrZXkgPSBDcnlwdG9KUy5TSEEyNTYoa2V5KTtcbiAgbGV0IGNoZWNrc3VtID0ga2V5LnRvU3RyaW5nKCkuc3Vic3RyaW5nKDAsIDgpO1xuICBhZGRyZXNzID0gbmV3IEJ1ZmZlcihhZGRyZXNzLnRvU3RyaW5nKCdoZXgnKStjaGVja3N1bSwnaGV4Jyk7XG4gIGFkZHJlc3MgPSBCYXNlNTguZW5jb2RlKGFkZHJlc3MpO1xuICByZXR1cm4gYWRkcmVzcztcbn1cblxuZXhwb3J0IGRlZmF1bHQgZ2V0QWRkcmVzcztcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IHsgZ2V0QmFsYW5jZSB9IGZyb20gJy4uLy4uLy4uLy4uL3NlcnZlci9hcGkvZG9pY2hhaW4uanMnO1xuaW1wb3J0IHsgQ09ORklSTV9DTElFTlR9IGZyb20gJy4uLy4uLy4uL3N0YXJ0dXAvc2VydmVyL2RvaWNoYWluLWNvbmZpZ3VyYXRpb24uanMnO1xuXG5cbmNvbnN0IGdldF9CYWxhbmNlID0gKCkgPT4ge1xuICAgIFxuICB0cnkge1xuICAgIGNvbnN0IGJhbD1nZXRCYWxhbmNlKENPTkZJUk1fQ0xJRU5UKTtcbiAgICByZXR1cm4gYmFsO1xuICAgIFxuICB9IGNhdGNoKGV4Y2VwdGlvbikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2RvaWNoYWluLmdldEJhbGFuY2UuZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGdldF9CYWxhbmNlO1xuXG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCBDcnlwdG9KUyBmcm9tICdjcnlwdG8tanMnO1xuaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tICdzaW1wbC1zY2hlbWEnO1xuXG5jb25zdCBHZXREYXRhSGFzaFNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICBkYXRhOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH1cbn0pO1xuXG5jb25zdCBnZXREYXRhSGFzaCA9IChkYXRhKSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3Qgb3VyRGF0YSA9IGRhdGE7XG4gICAgICBHZXREYXRhSGFzaFNjaGVtYS52YWxpZGF0ZShvdXJEYXRhKTtcbiAgICBjb25zdCBoYXNoID0gQ3J5cHRvSlMuU0hBMjU2KG91ckRhdGEpLnRvU3RyaW5nKCk7XG4gICAgcmV0dXJuIGhhc2g7XG4gIH0gY2F0Y2goZXhjZXB0aW9uKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZG9pY2hhaW4uZ2V0RGF0YUhhc2guZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgZ2V0RGF0YUhhc2g7XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCB7IHJhbmRvbUJ5dGVzIH0gZnJvbSAnY3J5cHRvJztcbmltcG9ydCBzZWNwMjU2azEgZnJvbSAnc2VjcDI1NmsxJztcblxuY29uc3QgZ2V0S2V5UGFpciA9ICgpID0+IHtcbiAgdHJ5IHtcbiAgICBsZXQgcHJpdktleVxuICAgIGRvIHtwcml2S2V5ID0gcmFuZG9tQnl0ZXMoMzIpfSB3aGlsZSghc2VjcDI1NmsxLnByaXZhdGVLZXlWZXJpZnkocHJpdktleSkpXG4gICAgY29uc3QgcHJpdmF0ZUtleSA9IHByaXZLZXk7XG4gICAgY29uc3QgcHVibGljS2V5ID0gc2VjcDI1NmsxLnB1YmxpY0tleUNyZWF0ZShwcml2YXRlS2V5KTtcbiAgICByZXR1cm4ge1xuICAgICAgcHJpdmF0ZUtleTogcHJpdmF0ZUtleS50b1N0cmluZygnaGV4JykudG9VcHBlckNhc2UoKSxcbiAgICAgIHB1YmxpY0tleTogcHVibGljS2V5LnRvU3RyaW5nKCdoZXgnKS50b1VwcGVyQ2FzZSgpXG4gICAgfVxuICB9IGNhdGNoKGV4Y2VwdGlvbikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2RvaWNoYWluLmdldEtleVBhaXIuZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgZ2V0S2V5UGFpcjtcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tICdzaW1wbC1zY2hlbWEnO1xuaW1wb3J0IEJhc2U1OCBmcm9tICdiczU4JztcblxuY29uc3QgR2V0UHJpdmF0ZUtleUZyb21XaWZTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgd2lmOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH1cbn0pO1xuXG5jb25zdCBnZXRQcml2YXRlS2V5RnJvbVdpZiA9IChkYXRhKSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3Qgb3VyRGF0YSA9IGRhdGE7XG4gICAgR2V0UHJpdmF0ZUtleUZyb21XaWZTY2hlbWEudmFsaWRhdGUob3VyRGF0YSk7XG4gICAgcmV0dXJuIF9nZXRQcml2YXRlS2V5RnJvbVdpZihvdXJEYXRhLndpZik7XG4gIH0gY2F0Y2goZXhjZXB0aW9uKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZG9pY2hhaW4uZ2V0UHJpdmF0ZUtleUZyb21XaWYuZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgfVxufTtcblxuZnVuY3Rpb24gX2dldFByaXZhdGVLZXlGcm9tV2lmKHdpZikge1xuICB2YXIgcHJpdmF0ZUtleSA9IEJhc2U1OC5kZWNvZGUod2lmKS50b1N0cmluZygnaGV4Jyk7XG4gIHByaXZhdGVLZXkgPSBwcml2YXRlS2V5LnN1YnN0cmluZygyLCBwcml2YXRlS2V5Lmxlbmd0aCAtIDgpO1xuICBpZihwcml2YXRlS2V5Lmxlbmd0aCA9PT0gNjYgJiYgcHJpdmF0ZUtleS5lbmRzV2l0aChcIjAxXCIpKSB7XG4gICAgcHJpdmF0ZUtleSA9IHByaXZhdGVLZXkuc3Vic3RyaW5nKDAsIHByaXZhdGVLZXkubGVuZ3RoIC0gMik7XG4gIH1cbiAgcmV0dXJuIHByaXZhdGVLZXk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGdldFByaXZhdGVLZXlGcm9tV2lmO1xuIiwiaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tICdzaW1wbC1zY2hlbWEnO1xuaW1wb3J0IHtsb2dTZW5kfSBmcm9tIFwiLi4vLi4vLi4vc3RhcnR1cC9zZXJ2ZXIvbG9nLWNvbmZpZ3VyYXRpb25cIjtcblxuaW1wb3J0IGdldE9wdEluS2V5IGZyb20gXCIuLi9kbnMvZ2V0X29wdC1pbi1rZXlcIjtcbmltcG9ydCBnZXRPcHRJblByb3ZpZGVyIGZyb20gXCIuLi9kbnMvZ2V0X29wdC1pbi1wcm92aWRlclwiO1xuaW1wb3J0IGdldEFkZHJlc3MgZnJvbSBcIi4vZ2V0X2FkZHJlc3NcIjtcblxuY29uc3QgR2V0UHVibGljS2V5U2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gICAgZG9tYWluOiB7XG4gICAgICAgIHR5cGU6IFN0cmluZ1xuICAgIH1cbn0pO1xuXG5jb25zdCBnZXRQdWJsaWNLZXlBbmRBZGRyZXNzID0gKGRhdGEpID0+IHtcblxuICAgIGNvbnN0IG91ckRhdGEgPSBkYXRhO1xuICAgIEdldFB1YmxpY0tleVNjaGVtYS52YWxpZGF0ZShvdXJEYXRhKTtcblxuICAgIGxldCBwdWJsaWNLZXkgPSBnZXRPcHRJbktleSh7ZG9tYWluOiBvdXJEYXRhLmRvbWFpbn0pO1xuICAgIGlmKCFwdWJsaWNLZXkpe1xuICAgICAgICBjb25zdCBwcm92aWRlciA9IGdldE9wdEluUHJvdmlkZXIoe2RvbWFpbjogb3VyRGF0YS5kb21haW59KTtcbiAgICAgICAgbG9nU2VuZChcInVzaW5nIGRvaWNoYWluIHByb3ZpZGVyIGluc3RlYWQgb2YgZGlyZWN0bHkgY29uZmlndXJlZCBwdWJsaWNLZXk6XCIse3Byb3ZpZGVyOnByb3ZpZGVyfSk7XG4gICAgICAgIHB1YmxpY0tleSA9IGdldE9wdEluS2V5KHtkb21haW46IHByb3ZpZGVyfSk7IC8vZ2V0IHB1YmxpYyBrZXkgZnJvbSBwcm92aWRlciBvciBmYWxsYmFjayBpZiBwdWJsaWNrZXkgd2FzIG5vdCBzZXQgaW4gZG5zXG4gICAgfVxuICAgIGNvbnN0IGRlc3RBZGRyZXNzID0gIGdldEFkZHJlc3Moe3B1YmxpY0tleTogcHVibGljS2V5fSk7XG4gICAgbG9nU2VuZCgncHVibGljS2V5IGFuZCBkZXN0QWRkcmVzcyAnLCB7cHVibGljS2V5OnB1YmxpY0tleSxkZXN0QWRkcmVzczpkZXN0QWRkcmVzc30pO1xuICAgIHJldHVybiB7cHVibGljS2V5OnB1YmxpY0tleSxkZXN0QWRkcmVzczpkZXN0QWRkcmVzc307XG59O1xuXG5leHBvcnQgZGVmYXVsdCBnZXRQdWJsaWNLZXlBbmRBZGRyZXNzOyIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tICdzaW1wbC1zY2hlbWEnO1xuaW1wb3J0IGJpdGNvcmUgZnJvbSAnYml0Y29yZS1saWInO1xuaW1wb3J0IE1lc3NhZ2UgZnJvbSAnYml0Y29yZS1tZXNzYWdlJztcblxuY29uc3QgR2V0U2lnbmF0dXJlU2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIG1lc3NhZ2U6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfSxcbiAgcHJpdmF0ZUtleToge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9XG59KTtcblxuY29uc3QgZ2V0U2lnbmF0dXJlID0gKGRhdGEpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBvdXJEYXRhID0gZGF0YTtcbiAgICBHZXRTaWduYXR1cmVTY2hlbWEudmFsaWRhdGUob3VyRGF0YSk7XG4gICAgY29uc3Qgc2lnbmF0dXJlID0gTWVzc2FnZShvdXJEYXRhLm1lc3NhZ2UpLnNpZ24obmV3IGJpdGNvcmUuUHJpdmF0ZUtleShvdXJEYXRhLnByaXZhdGVLZXkpKTtcbiAgICByZXR1cm4gc2lnbmF0dXJlO1xuICB9IGNhdGNoKGV4Y2VwdGlvbikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2RvaWNoYWluLmdldFNpZ25hdHVyZS5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBnZXRTaWduYXR1cmU7XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcbmltcG9ydCB7IFNFTkRfQ0xJRU5UIH0gZnJvbSAnLi4vLi4vLi4vc3RhcnR1cC9zZXJ2ZXIvZG9pY2hhaW4tY29uZmlndXJhdGlvbi5qcyc7XG5pbXBvcnQgZW5jcnlwdE1lc3NhZ2UgZnJvbSBcIi4vZW5jcnlwdF9tZXNzYWdlXCI7XG5pbXBvcnQge2dldFVybH0gZnJvbSBcIi4uLy4uLy4uL3N0YXJ0dXAvc2VydmVyL2RhcHAtY29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHtsb2dCbG9ja2NoYWluLCBsb2dTZW5kfSBmcm9tIFwiLi4vLi4vLi4vc3RhcnR1cC9zZXJ2ZXIvbG9nLWNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7ZmVlRG9pLG5hbWVEb2l9IGZyb20gXCIuLi8uLi8uLi8uLi9zZXJ2ZXIvYXBpL2RvaWNoYWluXCI7XG5pbXBvcnQge09wdEluc30gZnJvbSBcIi4uLy4uLy4uL2FwaS9vcHQtaW5zL29wdC1pbnNcIjtcbmltcG9ydCBnZXRQdWJsaWNLZXlBbmRBZGRyZXNzIGZyb20gXCIuL2dldF9wdWJsaWNrZXlfYW5kX2FkZHJlc3NfYnlfZG9tYWluXCI7XG5cblxuY29uc3QgSW5zZXJ0U2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIG5hbWVJZDoge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9LFxuICBzaWduYXR1cmU6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfSxcbiAgZGF0YUhhc2g6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfSxcbiAgZG9tYWluOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH0sXG4gIHNvaURhdGU6IHtcbiAgICB0eXBlOiBEYXRlXG4gIH1cbn0pO1xuXG5jb25zdCBpbnNlcnQgPSAoZGF0YSkgPT4ge1xuICBjb25zdCBvdXJEYXRhID0gZGF0YTtcbiAgdHJ5IHtcbiAgICBJbnNlcnRTY2hlbWEudmFsaWRhdGUob3VyRGF0YSk7XG4gICAgbG9nU2VuZChcImRvbWFpbjpcIixvdXJEYXRhLmRvbWFpbik7XG5cbiAgICBjb25zdCBwdWJsaWNLZXlBbmRBZGRyZXNzID0gZ2V0UHVibGljS2V5QW5kQWRkcmVzcyh7ZG9tYWluOm91ckRhdGEuZG9tYWlufSk7XG4gICAgY29uc3QgZnJvbSA9IGVuY3J5cHRNZXNzYWdlKHtwdWJsaWNLZXk6IHB1YmxpY0tleUFuZEFkZHJlc3MucHVibGljS2V5LCBtZXNzYWdlOiBnZXRVcmwoKX0pO1xuICAgIGxvZ1NlbmQoJ2VuY3J5cHRlZCB1cmwgZm9yIHVzZSBhZCBmcm9tIGluIGRvaWNoYWluIHZhbHVlOicsZ2V0VXJsKCksZnJvbSk7XG5cbiAgICBjb25zdCBuYW1lVmFsdWUgPSBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgIHNpZ25hdHVyZTogb3VyRGF0YS5zaWduYXR1cmUsXG4gICAgICAgIGRhdGFIYXNoOiBvdXJEYXRhLmRhdGFIYXNoLFxuICAgICAgICBmcm9tOiBmcm9tXG4gICAgfSk7XG5cbiAgICAvL1RPRE8gKCEpIHRoaXMgbXVzdCBiZSByZXBsYWNlZCBpbiBmdXR1cmUgYnkgXCJhdG9taWMgbmFtZSB0cmFkaW5nIGV4YW1wbGVcIiBodHRwczovL3dpa2kubmFtZWNvaW4uaW5mby8/dGl0bGU9QXRvbWljX05hbWUtVHJhZGluZ1xuICAgIGxvZ0Jsb2NrY2hhaW4oJ3NlbmRpbmcgYSBmZWUgdG8gYm9iIHNvIGhlIGNhbiBwYXkgdGhlIGRvaSBzdG9yYWdlIChkZXN0QWRkcmVzcyk6JywgcHVibGljS2V5QW5kQWRkcmVzcy5kZXN0QWRkcmVzcyk7XG4gICAgY29uc3QgZmVlRG9pVHggPSBmZWVEb2koU0VORF9DTElFTlQsIHB1YmxpY0tleUFuZEFkZHJlc3MuZGVzdEFkZHJlc3MpO1xuICAgIGxvZ0Jsb2NrY2hhaW4oJ2ZlZSBzZW5kIHR4aWQgdG8gZGVzdGFkZHJlc3MnLCBmZWVEb2lUeCwgcHVibGljS2V5QW5kQWRkcmVzcy5kZXN0QWRkcmVzcyk7XG5cbiAgICBsb2dCbG9ja2NoYWluKCdhZGRpbmcgZGF0YSB0byBibG9ja2NoYWluIHZpYSBuYW1lX2RvaSAobmFtZUlkLHZhbHVlLGRlc3RBZGRyZXNzKTonLCBvdXJEYXRhLm5hbWVJZCxuYW1lVmFsdWUscHVibGljS2V5QW5kQWRkcmVzcy5kZXN0QWRkcmVzcyk7XG4gICAgY29uc3QgbmFtZURvaVR4ID0gbmFtZURvaShTRU5EX0NMSUVOVCwgb3VyRGF0YS5uYW1lSWQsIG5hbWVWYWx1ZSwgcHVibGljS2V5QW5kQWRkcmVzcy5kZXN0QWRkcmVzcyk7XG4gICAgbG9nQmxvY2tjaGFpbignbmFtZV9kb2kgYWRkZWQgYmxvY2tjaGFpbi4gdHhpZDonLCBuYW1lRG9pVHgpO1xuXG4gICAgT3B0SW5zLnVwZGF0ZSh7bmFtZUlkOiBvdXJEYXRhLm5hbWVJZH0sIHskc2V0OiB7dHhJZDpuYW1lRG9pVHh9fSk7XG4gICAgbG9nQmxvY2tjaGFpbigndXBkYXRpbmcgT3B0SW4gbG9jYWxseSB3aXRoOicsIHtuYW1lSWQ6IG91ckRhdGEubmFtZUlkLCB0eElkOiBuYW1lRG9pVHh9KTtcblxuICB9IGNhdGNoKGV4Y2VwdGlvbikge1xuICAgICAgT3B0SW5zLnVwZGF0ZSh7bmFtZUlkOiBvdXJEYXRhLm5hbWVJZH0sIHskc2V0OiB7ZXJyb3I6SlNPTi5zdHJpbmdpZnkoZXhjZXB0aW9uLm1lc3NhZ2UpfX0pO1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2RvaWNoYWluLmluc2VydC5leGNlcHRpb24nLCBleGNlcHRpb24pOyAvL1RPRE8gdXBkYXRlIG9wdC1pbiBpbiBsb2NhbCBkYiB0byBpbmZvcm0gdXNlciBhYm91dCB0aGUgZXJyb3IhIGUuZy4gSW5zdWZmaWNpZW50IGZ1bmRzIGV0Yy5cbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgaW5zZXJ0O1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XG5pbXBvcnQgeyBDT05GSVJNX0NMSUVOVCB9IGZyb20gJy4uLy4uLy4uL3N0YXJ0dXAvc2VydmVyL2RvaWNoYWluLWNvbmZpZ3VyYXRpb24uanMnO1xuaW1wb3J0IHtnZXRXaWYsIHNpZ25NZXNzYWdlLCBnZXRUcmFuc2FjdGlvbiwgbmFtZURvaSwgbmFtZVNob3d9IGZyb20gXCIuLi8uLi8uLi8uLi9zZXJ2ZXIvYXBpL2RvaWNoYWluXCI7XG5pbXBvcnQge0FQSV9QQVRILCBET0lfQ09ORklSTUFUSU9OX05PVElGWV9ST1VURSwgVkVSU0lPTn0gZnJvbSBcIi4uLy4uLy4uLy4uL3NlcnZlci9hcGkvcmVzdC9yZXN0XCI7XG5pbXBvcnQge0NPTkZJUk1fQUREUkVTU30gZnJvbSBcIi4uLy4uLy4uL3N0YXJ0dXAvc2VydmVyL2RvaWNoYWluLWNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7Z2V0SHR0cFBVVH0gZnJvbSBcIi4uLy4uLy4uLy4uL3NlcnZlci9hcGkvaHR0cFwiO1xuaW1wb3J0IHtsb2dDb25maXJtfSBmcm9tIFwiLi4vLi4vLi4vc3RhcnR1cC9zZXJ2ZXIvbG9nLWNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCBnZXRQcml2YXRlS2V5RnJvbVdpZiBmcm9tIFwiLi9nZXRfcHJpdmF0ZS1rZXlfZnJvbV93aWZcIjtcbmltcG9ydCBkZWNyeXB0TWVzc2FnZSBmcm9tIFwiLi9kZWNyeXB0X21lc3NhZ2VcIjtcbmltcG9ydCB7T3B0SW5zfSBmcm9tIFwiLi4vLi4vLi4vYXBpL29wdC1pbnMvb3B0LWluc1wiO1xuXG5jb25zdCBVcGRhdGVTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgbmFtZUlkOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH0sXG4gIHZhbHVlOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH0sXG4gIGhvc3QgOiB7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICBvcHRpb25hbDogdHJ1ZSxcbiAgfSxcbiAgZnJvbUhvc3RVcmwgOiB7XG4gICAgICB0eXBlOiBTdHJpbmdcbiAgfVxufSk7XG5cbmNvbnN0IHVwZGF0ZSA9IChkYXRhLCBqb2IpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBvdXJEYXRhID0gZGF0YTtcblxuICAgIFVwZGF0ZVNjaGVtYS52YWxpZGF0ZShvdXJEYXRhKTtcblxuICAgIC8vc3RvcCB0aGlzIHVwZGF0ZSB1bnRpbCB0aGlzIG5hbWUgYXMgYXQgbGVhc3QgMSBjb25maXJtYXRpb25cbiAgICBjb25zdCBuYW1lX2RhdGEgPSBuYW1lU2hvdyhDT05GSVJNX0NMSUVOVCxvdXJEYXRhLm5hbWVJZCk7XG4gICAgaWYobmFtZV9kYXRhID09PSB1bmRlZmluZWQpe1xuICAgICAgICByZXJ1bihqb2IpO1xuICAgICAgICBsb2dDb25maXJtKCduYW1lIG5vdCB2aXNpYmxlIC0gZGVsYXlpbmcgbmFtZSB1cGRhdGUnLG91ckRhdGEubmFtZUlkKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBvdXJfdHJhbnNhY3Rpb24gPSBnZXRUcmFuc2FjdGlvbihDT05GSVJNX0NMSUVOVCxuYW1lX2RhdGEudHhpZCk7XG4gICAgaWYob3VyX3RyYW5zYWN0aW9uLmNvbmZpcm1hdGlvbnM9PT0wKXtcbiAgICAgICAgcmVydW4oam9iKTtcbiAgICAgICAgbG9nQ29uZmlybSgndHJhbnNhY3Rpb24gaGFzIDAgY29uZmlybWF0aW9ucyAtIGRlbGF5aW5nIG5hbWUgdXBkYXRlJyxKU09OLnBhcnNlKG91ckRhdGEudmFsdWUpKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBsb2dDb25maXJtKCd1cGRhdGluZyBibG9ja2NoYWluIHdpdGggZG9pU2lnbmF0dXJlOicsSlNPTi5wYXJzZShvdXJEYXRhLnZhbHVlKSk7XG4gICAgY29uc3Qgd2lmID0gZ2V0V2lmKENPTkZJUk1fQ0xJRU5ULCBDT05GSVJNX0FERFJFU1MpO1xuICAgIGNvbnN0IHByaXZhdGVLZXkgPSBnZXRQcml2YXRlS2V5RnJvbVdpZih7d2lmOiB3aWZ9KTtcbiAgICBsb2dDb25maXJtKCdnb3QgcHJpdmF0ZSBrZXkgKHdpbGwgbm90IHNob3cgaXQgaGVyZSkgaW4gb3JkZXIgdG8gZGVjcnlwdCBTZW5kLWRBcHAgaG9zdCB1cmwgZnJvbSB2YWx1ZTonLG91ckRhdGEuZnJvbUhvc3RVcmwpO1xuICAgIGNvbnN0IG91cmZyb21Ib3N0VXJsID0gZGVjcnlwdE1lc3NhZ2Uoe3ByaXZhdGVLZXk6IHByaXZhdGVLZXksIG1lc3NhZ2U6IG91ckRhdGEuZnJvbUhvc3RVcmx9KTtcbiAgICBsb2dDb25maXJtKCdkZWNyeXB0ZWQgZnJvbUhvc3RVcmwnLG91cmZyb21Ib3N0VXJsKTtcbiAgICBjb25zdCB1cmwgPSBvdXJmcm9tSG9zdFVybCtBUElfUEFUSCtWRVJTSU9OK1wiL1wiK0RPSV9DT05GSVJNQVRJT05fTk9USUZZX1JPVVRFO1xuXG4gICAgbG9nQ29uZmlybSgnY3JlYXRpbmcgc2lnbmF0dXJlIHdpdGggQUREUkVTUycrQ09ORklSTV9BRERSRVNTK1wiIG5hbWVJZDpcIixvdXJEYXRhLnZhbHVlKTtcbiAgICBjb25zdCBzaWduYXR1cmUgPSBzaWduTWVzc2FnZShDT05GSVJNX0NMSUVOVCwgQ09ORklSTV9BRERSRVNTLCBvdXJEYXRhLm5hbWVJZCk7IC8vVE9ETyB3aHkgaGVyZSBvdmVyIG5hbWVJRD9cbiAgICBsb2dDb25maXJtKCdzaWduYXR1cmUgY3JlYXRlZDonLHNpZ25hdHVyZSk7XG5cbiAgICBjb25zdCB1cGRhdGVEYXRhID0ge1xuICAgICAgICBuYW1lSWQ6IG91ckRhdGEubmFtZUlkLFxuICAgICAgICBzaWduYXR1cmU6IHNpZ25hdHVyZSxcbiAgICAgICAgaG9zdDogb3VyRGF0YS5ob3N0XG4gICAgfTtcblxuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHR4aWQgPSBuYW1lRG9pKENPTkZJUk1fQ0xJRU5ULCBvdXJEYXRhLm5hbWVJZCwgb3VyRGF0YS52YWx1ZSwgbnVsbCk7XG4gICAgICAgIGxvZ0NvbmZpcm0oJ3VwZGF0ZSB0cmFuc2FjdGlvbiB0eGlkOicsdHhpZCk7XG4gICAgfWNhdGNoKGV4Y2VwdGlvbil7XG4gICAgICAgIC8vXG4gICAgICAgIGxvZ0NvbmZpcm0oJ3RoaXMgbmFtZURPSSBkb2VzbsK0dCBoYXZlIGEgYmxvY2sgeWV0IGFuZCB3aWxsIGJlIHVwZGF0ZWQgd2l0aCB0aGUgbmV4dCBibG9jayBhbmQgd2l0aCB0aGUgbmV4dCBxdWV1ZSBzdGFydDonLG91ckRhdGEubmFtZUlkKTtcbiAgICAgICAgaWYoZXhjZXB0aW9uLnRvU3RyaW5nKCkuaW5kZXhPZihcInRoZXJlIGlzIGFscmVhZHkgYSByZWdpc3RyYXRpb24gZm9yIHRoaXMgZG9pIG5hbWVcIik9PS0xKSB7XG4gICAgICAgICAgICBPcHRJbnMudXBkYXRlKHtuYW1lSWQ6IG91ckRhdGEubmFtZUlkfSwgeyRzZXQ6IHtlcnJvcjogSlNPTi5zdHJpbmdpZnkoZXhjZXB0aW9uLm1lc3NhZ2UpfX0pO1xuICAgICAgICB9XG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2RvaWNoYWluLnVwZGF0ZS5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICAgICAgICAvL31lbHNle1xuICAgICAgICAvLyAgICBsb2dDb25maXJtKCd0aGlzIG5hbWVET0kgZG9lc27CtHQgaGF2ZSBhIGJsb2NrIHlldCBhbmQgd2lsbCBiZSB1cGRhdGVkIHdpdGggdGhlIG5leHQgYmxvY2sgYW5kIHdpdGggdGhlIG5leHQgcXVldWUgc3RhcnQ6JyxvdXJEYXRhLm5hbWVJZCk7XG4gICAgICAgIC8vfVxuICAgIH1cblxuICAgIGNvbnN0IHJlc3BvbnNlID0gZ2V0SHR0cFBVVCh1cmwsIHVwZGF0ZURhdGEpO1xuICAgIGxvZ0NvbmZpcm0oJ2luZm9ybWVkIHNlbmQgZEFwcCBhYm91dCBjb25maXJtZWQgZG9pIG9uIHVybDonK3VybCsnIHdpdGggdXBkYXRlRGF0YScrSlNPTi5zdHJpbmdpZnkodXBkYXRlRGF0YSkrXCIgcmVzcG9uc2U6XCIscmVzcG9uc2UuZGF0YSk7XG4gICAgam9iLmRvbmUoKTtcbiAgfSBjYXRjaChleGNlcHRpb24pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdkb2ljaGFpbi51cGRhdGUuZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgfVxufTtcblxuZnVuY3Rpb24gcmVydW4oam9iKXtcbiAgICBsb2dDb25maXJtKCdyZXJ1bm5pbmcgdHhpZCBpbiAxMHNlYyAtIGNhbmNlbGluZyBvbGQgam9iJywnJyk7XG4gICAgam9iLmNhbmNlbCgpO1xuICAgIGxvZ0NvbmZpcm0oJ3Jlc3RhcnQgYmxvY2tjaGFpbiBkb2kgdXBkYXRlJywnJyk7XG4gICAgam9iLnJlc3RhcnQoXG4gICAgICAgIHtcbiAgICAgICAgICAgIC8vcmVwZWF0czogNjAwLCAgIC8vIE9ubHkgcmVwZWF0IHRoaXMgb25jZVxuICAgICAgICAgICAgLy8gVGhpcyBpcyB0aGUgZGVmYXVsdFxuICAgICAgICAgICAvLyB3YWl0OiAxMDAwMCAgIC8vIFdhaXQgMTAgc2VjIGJldHdlZW4gcmVwZWF0c1xuICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBEZWZhdWx0IGlzIHByZXZpb3VzIHNldHRpbmdcbiAgICAgICAgfSxcbiAgICAgICAgZnVuY3Rpb24gKGVyciwgcmVzdWx0KSB7XG4gICAgICAgICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgbG9nQ29uZmlybSgncmVydW5uaW5nIHR4aWQgaW4gMTBzZWM6JyxyZXN1bHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgdXBkYXRlO1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XG5pbXBvcnQgYml0Y29yZSBmcm9tICdiaXRjb3JlLWxpYic7XG5pbXBvcnQgTWVzc2FnZSBmcm9tICdiaXRjb3JlLW1lc3NhZ2UnO1xuaW1wb3J0IHtsb2dFcnJvciwgbG9nVmVyaWZ5fSBmcm9tIFwiLi4vLi4vLi4vc3RhcnR1cC9zZXJ2ZXIvbG9nLWNvbmZpZ3VyYXRpb25cIjtcbmNvbnN0IE5FVFdPUksgPSBiaXRjb3JlLk5ldHdvcmtzLmFkZCh7XG4gIG5hbWU6ICdkb2ljaGFpbicsXG4gIGFsaWFzOiAnZG9pY2hhaW4nLFxuICBwdWJrZXloYXNoOiAweDM0LFxuICBwcml2YXRla2V5OiAweEI0LFxuICBzY3JpcHRoYXNoOiAxMyxcbiAgbmV0d29ya01hZ2ljOiAweGY5YmViNGZlLFxufSk7XG5cbmNvbnN0IFZlcmlmeVNpZ25hdHVyZVNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICBkYXRhOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH0sXG4gIHB1YmxpY0tleToge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9LFxuICBzaWduYXR1cmU6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfVxufSk7XG5cbmNvbnN0IHZlcmlmeVNpZ25hdHVyZSA9IChkYXRhKSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3Qgb3VyRGF0YSA9IGRhdGE7XG4gICAgbG9nVmVyaWZ5KCd2ZXJpZnlTaWduYXR1cmU6JyxvdXJEYXRhKTtcbiAgICBWZXJpZnlTaWduYXR1cmVTY2hlbWEudmFsaWRhdGUob3VyRGF0YSk7XG4gICAgY29uc3QgYWRkcmVzcyA9IGJpdGNvcmUuQWRkcmVzcy5mcm9tUHVibGljS2V5KG5ldyBiaXRjb3JlLlB1YmxpY0tleShvdXJEYXRhLnB1YmxpY0tleSksIE5FVFdPUkspO1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gTWVzc2FnZShvdXJEYXRhLmRhdGEpLnZlcmlmeShhZGRyZXNzLCBvdXJEYXRhLnNpZ25hdHVyZSk7XG4gICAgfSBjYXRjaChlcnJvcikgeyBsb2dFcnJvcihlcnJvcil9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9IGNhdGNoKGV4Y2VwdGlvbikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2RvaWNoYWluLnZlcmlmeVNpZ25hdHVyZS5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCB2ZXJpZnlTaWduYXR1cmU7XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcbmltcG9ydCB7IE9wdElucyB9IGZyb20gJy4uLy4uLy4uL2FwaS9vcHQtaW5zL29wdC1pbnMuanMnO1xuaW1wb3J0IHsgU2VuZGVycyB9IGZyb20gJy4uLy4uLy4uL2FwaS9zZW5kZXJzL3NlbmRlcnMuanMnO1xuaW1wb3J0IHsgUmVjaXBpZW50cyB9IGZyb20gJy4uLy4uLy4uL2FwaS9yZWNpcGllbnRzL3JlY2lwaWVudHMuanMnO1xuaW1wb3J0IGdlbmVyYXRlTmFtZUlkIGZyb20gJy4vZ2VuZXJhdGVfbmFtZS1pZC5qcyc7XG5pbXBvcnQgZ2V0U2lnbmF0dXJlIGZyb20gJy4vZ2V0X3NpZ25hdHVyZS5qcyc7XG5pbXBvcnQgZ2V0RGF0YUhhc2ggZnJvbSAnLi9nZXRfZGF0YS1oYXNoLmpzJztcbmltcG9ydCBhZGRJbnNlcnRCbG9ja2NoYWluSm9iIGZyb20gJy4uL2pvYnMvYWRkX2luc2VydF9ibG9ja2NoYWluLmpzJztcbmltcG9ydCB7bG9nU2VuZH0gZnJvbSBcIi4uLy4uLy4uL3N0YXJ0dXAvc2VydmVyL2xvZy1jb25maWd1cmF0aW9uXCI7XG5cbmNvbnN0IFdyaXRlVG9CbG9ja2NoYWluU2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIGlkOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH1cbn0pO1xuXG5jb25zdCB3cml0ZVRvQmxvY2tjaGFpbiA9IChkYXRhKSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3Qgb3VyRGF0YSA9IGRhdGE7XG4gICAgV3JpdGVUb0Jsb2NrY2hhaW5TY2hlbWEudmFsaWRhdGUob3VyRGF0YSk7XG5cbiAgICBjb25zdCBvcHRJbiA9IE9wdElucy5maW5kT25lKHtfaWQ6IGRhdGEuaWR9KTtcbiAgICBjb25zdCByZWNpcGllbnQgPSBSZWNpcGllbnRzLmZpbmRPbmUoe19pZDogb3B0SW4ucmVjaXBpZW50fSk7XG4gICAgY29uc3Qgc2VuZGVyID0gU2VuZGVycy5maW5kT25lKHtfaWQ6IG9wdEluLnNlbmRlcn0pO1xuICAgIGxvZ1NlbmQoXCJvcHRJbiBkYXRhOlwiLHtpbmRleDpvdXJEYXRhLmluZGV4LCBvcHRJbjpvcHRJbixyZWNpcGllbnQ6cmVjaXBpZW50LHNlbmRlcjogc2VuZGVyfSk7XG5cblxuICAgIGNvbnN0IG5hbWVJZCA9IGdlbmVyYXRlTmFtZUlkKHtpZDogZGF0YS5pZCxpbmRleDpvcHRJbi5pbmRleCxtYXN0ZXJEb2k6b3B0SW4ubWFzdGVyRG9pIH0pO1xuICAgIGNvbnN0IHNpZ25hdHVyZSA9IGdldFNpZ25hdHVyZSh7bWVzc2FnZTogcmVjaXBpZW50LmVtYWlsK3NlbmRlci5lbWFpbCwgcHJpdmF0ZUtleTogcmVjaXBpZW50LnByaXZhdGVLZXl9KTtcbiAgICBsb2dTZW5kKFwiZ2VuZXJhdGVkIHNpZ25hdHVyZSBmcm9tIGVtYWlsIHJlY2lwaWVudCBhbmQgc2VuZGVyOlwiLHNpZ25hdHVyZSk7XG5cbiAgICBsZXQgZGF0YUhhc2ggPSBcIlwiO1xuXG4gICAgaWYob3B0SW4uZGF0YSkge1xuICAgICAgZGF0YUhhc2ggPSBnZXREYXRhSGFzaCh7ZGF0YTogb3B0SW4uZGF0YX0pO1xuICAgICAgbG9nU2VuZChcImdlbmVyYXRlZCBkYXRhaGFzaCBmcm9tIGdpdmVuIGRhdGE6XCIsZGF0YUhhc2gpO1xuICAgIH1cblxuICAgIGNvbnN0IHBhcnRzID0gcmVjaXBpZW50LmVtYWlsLnNwbGl0KFwiQFwiKTtcbiAgICBjb25zdCBkb21haW4gPSBwYXJ0c1twYXJ0cy5sZW5ndGgtMV07XG4gICAgbG9nU2VuZChcImVtYWlsIGRvbWFpbiBmb3IgcHVibGljS2V5IHJlcXVlc3QgaXM6XCIsZG9tYWluKTtcbiAgICBhZGRJbnNlcnRCbG9ja2NoYWluSm9iKHtcbiAgICAgIG5hbWVJZDogbmFtZUlkLFxuICAgICAgc2lnbmF0dXJlOiBzaWduYXR1cmUsXG4gICAgICBkYXRhSGFzaDogZGF0YUhhc2gsXG4gICAgICBkb21haW46IGRvbWFpbixcbiAgICAgIHNvaURhdGU6IG9wdEluLmNyZWF0ZWRBdFxuICAgIH0pXG4gIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2RvaWNoYWluLndyaXRlVG9CbG9ja2NoYWluLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IHdyaXRlVG9CbG9ja2NoYWluXG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcbmltcG9ydCB7IEhhc2hJZHMgfSBmcm9tICcuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9lbWFpbC1jb25maWd1cmF0aW9uLmpzJztcblxuY29uc3QgRGVjb2RlRG9pSGFzaFNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICBoYXNoOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH1cbn0pO1xuXG5jb25zdCBkZWNvZGVEb2lIYXNoID0gKGhhc2gpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBvdXJIYXNoID0gaGFzaDtcbiAgICBEZWNvZGVEb2lIYXNoU2NoZW1hLnZhbGlkYXRlKG91ckhhc2gpO1xuICAgIGNvbnN0IGhleCA9IEhhc2hJZHMuZGVjb2RlSGV4KG91ckhhc2guaGFzaCk7XG4gICAgaWYoIWhleCB8fCBoZXggPT09ICcnKSB0aHJvdyBcIldyb25nIGhhc2hcIjtcbiAgICB0cnkge1xuICAgICAgY29uc3Qgb2JqID0gSlNPTi5wYXJzZShCdWZmZXIoaGV4LCAnaGV4JykudG9TdHJpbmcoJ2FzY2lpJykpO1xuICAgICAgcmV0dXJuIG9iajtcbiAgICB9IGNhdGNoKGV4Y2VwdGlvbikge3Rocm93IFwiV3JvbmcgaGFzaFwiO31cbiAgfSBjYXRjaCAoZXhjZXB0aW9uKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZW1haWxzLmRlY29kZV9kb2ktaGFzaC5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBkZWNvZGVEb2lIYXNoO1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XG5pbXBvcnQgeyBIYXNoSWRzIH0gZnJvbSAnLi4vLi4vLi4vc3RhcnR1cC9zZXJ2ZXIvZW1haWwtY29uZmlndXJhdGlvbi5qcyc7XG5cbmNvbnN0IEdlbmVyYXRlRG9pSGFzaFNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICBpZDoge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9LFxuICB0b2tlbjoge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9LFxuICByZWRpcmVjdDoge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9XG59KTtcblxuY29uc3QgZ2VuZXJhdGVEb2lIYXNoID0gKG9wdEluKSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3Qgb3VyT3B0SW4gPSBvcHRJbjtcbiAgICBHZW5lcmF0ZURvaUhhc2hTY2hlbWEudmFsaWRhdGUob3VyT3B0SW4pO1xuXG4gICAgY29uc3QganNvbiA9IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgIGlkOiBvdXJPcHRJbi5pZCxcbiAgICAgIHRva2VuOiBvdXJPcHRJbi50b2tlbixcbiAgICAgIHJlZGlyZWN0OiBvdXJPcHRJbi5yZWRpcmVjdFxuICAgIH0pO1xuXG4gICAgY29uc3QgaGV4ID0gQnVmZmVyKGpzb24pLnRvU3RyaW5nKCdoZXgnKTtcbiAgICBjb25zdCBoYXNoID0gSGFzaElkcy5lbmNvZGVIZXgoaGV4KTtcbiAgICByZXR1cm4gaGFzaDtcbiAgfSBjYXRjaCAoZXhjZXB0aW9uKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZW1haWxzLmdlbmVyYXRlX2RvaS1oYXNoLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGdlbmVyYXRlRG9pSGFzaDtcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tICdzaW1wbC1zY2hlbWEnO1xuaW1wb3J0IHtsb2dDb25maXJtfSBmcm9tIFwiLi4vLi4vLi4vc3RhcnR1cC9zZXJ2ZXIvbG9nLWNvbmZpZ3VyYXRpb25cIjtcblxuY29uc3QgUExBQ0VIT0xERVJfUkVHRVggPSAvXFwkeyhbXFx3XSopfS9nO1xuY29uc3QgUGFyc2VUZW1wbGF0ZVNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICB0ZW1wbGF0ZToge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgfSxcbiAgZGF0YToge1xuICAgIHR5cGU6IE9iamVjdCxcbiAgICBibGFja2JveDogdHJ1ZVxuICB9XG59KTtcblxuY29uc3QgcGFyc2VUZW1wbGF0ZSA9IChkYXRhKSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3Qgb3VyRGF0YSA9IGRhdGE7XG4gICAgLy9sb2dDb25maXJtKCdwYXJzZVRlbXBsYXRlOicsb3VyRGF0YSk7XG5cbiAgICBQYXJzZVRlbXBsYXRlU2NoZW1hLnZhbGlkYXRlKG91ckRhdGEpO1xuICAgIGxvZ0NvbmZpcm0oJ1BhcnNlVGVtcGxhdGVTY2hlbWEgdmFsaWRhdGVkJyk7XG5cbiAgICB2YXIgX21hdGNoO1xuICAgIHZhciB0ZW1wbGF0ZSA9IG91ckRhdGEudGVtcGxhdGU7XG4gICAvL2xvZ0NvbmZpcm0oJ2RvaW5nIHNvbWUgcmVnZXggd2l0aCB0ZW1wbGF0ZTonLHRlbXBsYXRlKTtcblxuICAgIGRvIHtcbiAgICAgIF9tYXRjaCA9IFBMQUNFSE9MREVSX1JFR0VYLmV4ZWModGVtcGxhdGUpO1xuICAgICAgaWYoX21hdGNoKSB0ZW1wbGF0ZSA9IF9yZXBsYWNlUGxhY2Vob2xkZXIodGVtcGxhdGUsIF9tYXRjaCwgb3VyRGF0YS5kYXRhW19tYXRjaFsxXV0pO1xuICAgIH0gd2hpbGUgKF9tYXRjaCk7XG4gICAgcmV0dXJuIHRlbXBsYXRlO1xuICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlbWFpbHMucGFyc2VUZW1wbGF0ZS5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9XG59O1xuXG5mdW5jdGlvbiBfcmVwbGFjZVBsYWNlaG9sZGVyKHRlbXBsYXRlLCBfbWF0Y2gsIHJlcGxhY2UpIHtcbiAgdmFyIHJlcCA9IHJlcGxhY2U7XG4gIGlmKHJlcGxhY2UgPT09IHVuZGVmaW5lZCkgcmVwID0gXCJcIjtcbiAgcmV0dXJuIHRlbXBsYXRlLnN1YnN0cmluZygwLCBfbWF0Y2guaW5kZXgpK3JlcCt0ZW1wbGF0ZS5zdWJzdHJpbmcoX21hdGNoLmluZGV4K19tYXRjaFswXS5sZW5ndGgpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBwYXJzZVRlbXBsYXRlO1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XG5pbXBvcnQge2xvZ0NvbmZpcm19IGZyb20gXCIuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9sb2ctY29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHsgRE9JX01BSUxfREVGQVVMVF9FTUFJTF9GUk9NIH0gZnJvbSAnLi4vLi4vLi4vc3RhcnR1cC9zZXJ2ZXIvZW1haWwtY29uZmlndXJhdGlvbi5qcyc7XG5cbmNvbnN0IFNlbmRNYWlsU2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIGZyb206IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgcmVnRXg6IFNpbXBsZVNjaGVtYS5SZWdFeC5FbWFpbFxuICB9LFxuICB0bzoge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICByZWdFeDogU2ltcGxlU2NoZW1hLlJlZ0V4LkVtYWlsXG4gIH0sXG4gIHN1YmplY3Q6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gIH0sXG4gIG1lc3NhZ2U6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gIH0sXG4gIHJldHVyblBhdGg6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgcmVnRXg6IFNpbXBsZVNjaGVtYS5SZWdFeC5FbWFpbFxuICB9XG59KTtcblxuY29uc3Qgc2VuZE1haWwgPSAobWFpbCkgPT4ge1xuICB0cnkge1xuXG4gICAgbWFpbC5mcm9tID0gRE9JX01BSUxfREVGQVVMVF9FTUFJTF9GUk9NO1xuXG4gICAgY29uc3Qgb3VyTWFpbCA9IG1haWw7XG4gICAgbG9nQ29uZmlybSgnc2VuZGluZyBlbWFpbCB3aXRoIGRhdGE6Jyx7dG86bWFpbC50bywgc3ViamVjdDptYWlsLnN1YmplY3R9KTtcbiAgICBTZW5kTWFpbFNjaGVtYS52YWxpZGF0ZShvdXJNYWlsKTtcbiAgICAvL1RPRE86IFRleHQgZmFsbGJhY2tcbiAgICBFbWFpbC5zZW5kKHtcbiAgICAgIGZyb206IG1haWwuZnJvbSxcbiAgICAgIHRvOiBtYWlsLnRvLFxuICAgICAgc3ViamVjdDogbWFpbC5zdWJqZWN0LFxuICAgICAgaHRtbDogbWFpbC5tZXNzYWdlLFxuICAgICAgaGVhZGVyczoge1xuICAgICAgICAnUmV0dXJuLVBhdGgnOiBtYWlsLnJldHVyblBhdGgsXG4gICAgICB9XG4gICAgfSk7XG5cbiAgfSBjYXRjaCAoZXhjZXB0aW9uKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZW1haWxzLnNlbmQuZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgc2VuZE1haWw7XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCB7IEpvYiB9IGZyb20gJ21ldGVvci92c2l2c2k6am9iLWNvbGxlY3Rpb24nO1xuaW1wb3J0IHsgQmxvY2tjaGFpbkpvYnMgfSBmcm9tICcuLi8uLi8uLi8uLi9zZXJ2ZXIvYXBpL2Jsb2NrY2hhaW5fam9icy5qcyc7XG5cbmNvbnN0IGFkZENoZWNrTmV3VHJhbnNhY3Rpb25zQmxvY2tjaGFpbkpvYiA9ICgpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBqb2IgPSBuZXcgSm9iKEJsb2NrY2hhaW5Kb2JzLCAnY2hlY2tOZXdUcmFuc2FjdGlvbicsIHt9KTtcbiAgICBqb2IucmV0cnkoe3JldHJpZXM6IDYwLCB3YWl0OiAxNSoxMDAwIH0pLnNhdmUoe2NhbmNlbFJlcGVhdHM6IHRydWV9KTtcbiAgfSBjYXRjaCAoZXhjZXB0aW9uKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignam9icy5hZGRDaGVja05ld1RyYW5zYWN0aW9uc0Jsb2NrY2hhaW4uZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgYWRkQ2hlY2tOZXdUcmFuc2FjdGlvbnNCbG9ja2NoYWluSm9iO1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XG5pbXBvcnQgeyBKb2IgfSBmcm9tICdtZXRlb3IvdnNpdnNpOmpvYi1jb2xsZWN0aW9uJztcbmltcG9ydCB7IERBcHBKb2JzIH0gZnJvbSAnLi4vLi4vLi4vLi4vc2VydmVyL2FwaS9kYXBwX2pvYnMuanMnO1xuXG5jb25zdCBBZGRGZXRjaERvaU1haWxEYXRhSm9iU2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIG5hbWU6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfSxcbiAgZG9tYWluOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH1cbn0pO1xuXG5jb25zdCBhZGRGZXRjaERvaU1haWxEYXRhSm9iID0gKGRhdGEpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBvdXJEYXRhID0gZGF0YTtcbiAgICBBZGRGZXRjaERvaU1haWxEYXRhSm9iU2NoZW1hLnZhbGlkYXRlKG91ckRhdGEpO1xuICAgIGNvbnN0IGpvYiA9IG5ldyBKb2IoREFwcEpvYnMsICdmZXRjaERvaU1haWxEYXRhJywgb3VyRGF0YSk7XG4gICAgam9iLnJldHJ5KHtyZXRyaWVzOiA1LCB3YWl0OiAxKjEwKjEwMDAgfSkuc2F2ZSgpOyAvL2NoZWNrIGV2ZXJ5IDEwIHNlY3MgNSB0aW1lc1xuICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdqb2JzLmFkZEZldGNoRG9pTWFpbERhdGEuZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgYWRkRmV0Y2hEb2lNYWlsRGF0YUpvYjtcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IHsgSm9iIH0gZnJvbSAnbWV0ZW9yL3ZzaXZzaTpqb2ItY29sbGVjdGlvbic7XG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XG5pbXBvcnQgeyBCbG9ja2NoYWluSm9icyB9IGZyb20gJy4uLy4uLy4uLy4uL3NlcnZlci9hcGkvYmxvY2tjaGFpbl9qb2JzLmpzJztcblxuY29uc3QgQWRkSW5zZXJ0QmxvY2tjaGFpbkpvYlNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICBuYW1lSWQ6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfSxcbiAgc2lnbmF0dXJlOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH0sXG4gIGRhdGFIYXNoOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIG9wdGlvbmFsOnRydWVcbiAgfSxcbiAgZG9tYWluOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH0sXG4gIHNvaURhdGU6IHtcbiAgICB0eXBlOiBEYXRlXG4gIH1cbn0pO1xuXG5jb25zdCBhZGRJbnNlcnRCbG9ja2NoYWluSm9iID0gKGVudHJ5KSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3Qgb3VyRW50cnkgPSBlbnRyeTtcbiAgICBBZGRJbnNlcnRCbG9ja2NoYWluSm9iU2NoZW1hLnZhbGlkYXRlKG91ckVudHJ5KTtcbiAgICBjb25zdCBqb2IgPSBuZXcgSm9iKEJsb2NrY2hhaW5Kb2JzLCAnaW5zZXJ0Jywgb3VyRW50cnkpO1xuICAgIGpvYi5yZXRyeSh7cmV0cmllczogMTAsIHdhaXQ6IDMqNjAqMTAwMCB9KS5zYXZlKCk7IC8vY2hlY2sgZXZlcnkgMTBzZWMgZm9yIDFoXG4gIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2pvYnMuYWRkSW5zZXJ0QmxvY2tjaGFpbi5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBhZGRJbnNlcnRCbG9ja2NoYWluSm9iO1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgeyBKb2IgfSBmcm9tICdtZXRlb3IvdnNpdnNpOmpvYi1jb2xsZWN0aW9uJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcbmltcG9ydCB7IE1haWxKb2JzIH0gZnJvbSAnLi4vLi4vLi4vLi4vc2VydmVyL2FwaS9tYWlsX2pvYnMuanMnO1xuXG5jb25zdCBBZGRTZW5kTWFpbEpvYlNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICAvKmZyb206IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgcmVnRXg6IFNpbXBsZVNjaGVtYS5SZWdFeC5FbWFpbFxuICB9LCovXG4gIHRvOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIHJlZ0V4OiBTaW1wbGVTY2hlbWEuUmVnRXguRW1haWxcbiAgfSxcbiAgc3ViamVjdDoge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgfSxcbiAgbWVzc2FnZToge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgfSxcbiAgcmV0dXJuUGF0aDoge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICByZWdFeDogU2ltcGxlU2NoZW1hLlJlZ0V4LkVtYWlsXG4gIH1cbn0pO1xuXG5jb25zdCBhZGRTZW5kTWFpbEpvYiA9IChtYWlsKSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3Qgb3VyTWFpbCA9IG1haWw7XG4gICAgQWRkU2VuZE1haWxKb2JTY2hlbWEudmFsaWRhdGUob3VyTWFpbCk7XG4gICAgY29uc3Qgam9iID0gbmV3IEpvYihNYWlsSm9icywgJ3NlbmQnLCBvdXJNYWlsKTtcbiAgICBqb2IucmV0cnkoe3JldHJpZXM6IDUsIHdhaXQ6IDYwKjEwMDAgfSkuc2F2ZSgpO1xuICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdqb2JzLmFkZFNlbmRNYWlsLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGFkZFNlbmRNYWlsSm9iO1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XG5pbXBvcnQgeyBKb2IgfSBmcm9tICdtZXRlb3IvdnNpdnNpOmpvYi1jb2xsZWN0aW9uJztcbmltcG9ydCB7IEJsb2NrY2hhaW5Kb2JzIH0gZnJvbSAnLi4vLi4vLi4vLi4vc2VydmVyL2FwaS9ibG9ja2NoYWluX2pvYnMuanMnO1xuXG5jb25zdCBBZGRVcGRhdGVCbG9ja2NoYWluSm9iU2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIG5hbWVJZDoge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9LFxuICB2YWx1ZToge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9LFxuICBmcm9tSG9zdFVybDoge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9LFxuICBob3N0OiB7XG4gICAgICB0eXBlOiBTdHJpbmdcbiAgfVxufSk7XG5cbmNvbnN0IGFkZFVwZGF0ZUJsb2NrY2hhaW5Kb2IgPSAoZW50cnkpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBvdXJFbnRyeSA9IGVudHJ5O1xuICAgIEFkZFVwZGF0ZUJsb2NrY2hhaW5Kb2JTY2hlbWEudmFsaWRhdGUob3VyRW50cnkpO1xuICAgIGNvbnN0IGpvYiA9IG5ldyBKb2IoQmxvY2tjaGFpbkpvYnMsICd1cGRhdGUnLCBvdXJFbnRyeSk7XG4gICAgam9iLnJldHJ5KHtyZXRyaWVzOiAzNjAsIHdhaXQ6IDEqMTAqMTAwMCB9KS5zYXZlKCk7XG4gIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2pvYnMuYWRkVXBkYXRlQmxvY2tjaGFpbi5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBhZGRVcGRhdGVCbG9ja2NoYWluSm9iO1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgaTE4biBmcm9tICdtZXRlb3IvdW5pdmVyc2U6aTE4bic7XG5cbi8vIHVuaXZlcnNlOmkxOG4gb25seSBidW5kbGVzIHRoZSBkZWZhdWx0IGxhbmd1YWdlIG9uIHRoZSBjbGllbnQgc2lkZS5cbi8vIFRvIGdldCBhIGxpc3Qgb2YgYWxsIGF2aWFsYmxlIGxhbmd1YWdlcyB3aXRoIGF0IGxlYXN0IG9uZSB0cmFuc2xhdGlvbixcbi8vIGkxOG4uZ2V0TGFuZ3VhZ2VzKCkgbXVzdCBiZSBjYWxsZWQgc2VydmVyIHNpZGUuXG5jb25zdCBnZXRMYW5ndWFnZXMgPSAoKSA9PiB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGkxOG4uZ2V0TGFuZ3VhZ2VzKCk7XG4gIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2xhbmd1YWdlcy5nZXQuZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgZ2V0TGFuZ3VhZ2VzO1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XG5pbXBvcnQgeyBNZXRhIH0gZnJvbSAnLi4vLi4vLi4vYXBpL21ldGEvbWV0YS5qcyc7XG5cbmNvbnN0IEFkZE9yVXBkYXRlTWV0YVNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICBrZXk6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfSxcbiAgdmFsdWU6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfVxufSk7XG5cbmNvbnN0IGFkZE9yVXBkYXRlTWV0YSA9IChkYXRhKSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3Qgb3VyRGF0YSA9IGRhdGE7XG4gICAgQWRkT3JVcGRhdGVNZXRhU2NoZW1hLnZhbGlkYXRlKG91ckRhdGEpO1xuICAgIGNvbnN0IG1ldGEgPSBNZXRhLmZpbmRPbmUoe2tleTogb3VyRGF0YS5rZXl9KTtcbiAgICBpZihtZXRhICE9PSB1bmRlZmluZWQpIE1ldGEudXBkYXRlKHtfaWQgOiBtZXRhLl9pZH0sIHskc2V0OiB7XG4gICAgICB2YWx1ZTogb3VyRGF0YS52YWx1ZVxuICAgIH19KTtcbiAgICBlbHNlIHJldHVybiBNZXRhLmluc2VydCh7XG4gICAgICBrZXk6IG91ckRhdGEua2V5LFxuICAgICAgdmFsdWU6IG91ckRhdGEudmFsdWVcbiAgICB9KVxuICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdtZXRhLmFkZE9yVXBkYXRlLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGFkZE9yVXBkYXRlTWV0YTtcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tICdzaW1wbC1zY2hlbWEnO1xuaW1wb3J0IHsgT3B0SW5zIH0gZnJvbSAnLi4vLi4vLi4vYXBpL29wdC1pbnMvb3B0LWlucy5qcyc7XG5cbmNvbnN0IEFkZE9wdEluU2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIG5hbWU6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfVxufSk7XG5cbmNvbnN0IGFkZE9wdEluID0gKG9wdEluKSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3Qgb3VyT3B0SW4gPSBvcHRJbjtcbiAgICBBZGRPcHRJblNjaGVtYS52YWxpZGF0ZShvdXJPcHRJbik7XG4gICAgY29uc3Qgb3B0SW5zID0gT3B0SW5zLmZpbmQoe25hbWVJZDogb3VyT3B0SW4ubmFtZX0pLmZldGNoKCk7XG4gICAgaWYob3B0SW5zLmxlbmd0aCA+IDApIHJldHVybiBvcHRJbnNbMF0uX2lkO1xuICAgIGNvbnN0IG9wdEluSWQgPSBPcHRJbnMuaW5zZXJ0KHtcbiAgICAgIG5hbWVJZDogb3VyT3B0SW4ubmFtZVxuICAgIH0pO1xuICAgIHJldHVybiBvcHRJbklkO1xuICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdvcHQtaW5zLmFkZC5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBhZGRPcHRJbjtcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tICdzaW1wbC1zY2hlbWEnO1xuaW1wb3J0IGFkZFJlY2lwaWVudCBmcm9tICcuLi9yZWNpcGllbnRzL2FkZC5qcyc7XG5pbXBvcnQgYWRkU2VuZGVyIGZyb20gJy4uL3NlbmRlcnMvYWRkLmpzJztcbmltcG9ydCB7IE9wdElucyB9IGZyb20gJy4uLy4uLy4uL2FwaS9vcHQtaW5zL29wdC1pbnMuanMnO1xuaW1wb3J0IHdyaXRlVG9CbG9ja2NoYWluIGZyb20gJy4uL2RvaWNoYWluL3dyaXRlX3RvX2Jsb2NrY2hhaW4uanMnO1xuaW1wb3J0IHtsb2dFcnJvciwgbG9nU2VuZH0gZnJvbSBcIi4uLy4uLy4uL3N0YXJ0dXAvc2VydmVyL2xvZy1jb25maWd1cmF0aW9uXCI7XG5cblxuY29uc3QgQWRkT3B0SW5TY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgcmVjaXBpZW50X21haWw6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgcmVnRXg6IFNpbXBsZVNjaGVtYS5SZWdFeC5FbWFpbFxuICB9LFxuICBzZW5kZXJfbWFpbDoge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICByZWdFeDogU2ltcGxlU2NoZW1hLlJlZ0V4LkVtYWlsXG4gIH0sXG4gIGRhdGE6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgb3B0aW9uYWw6IHRydWVcbiAgfSxcbiAgbWFzdGVyX2RvaToge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgb3B0aW9uYWw6IHRydWVcbiAgfSxcbiAgaW5kZXg6IHtcbiAgICAgIHR5cGU6IFNpbXBsZVNjaGVtYS5JbnRlZ2VyLFxuICAgICAgb3B0aW9uYWw6IHRydWVcbiAgfSxcbiAgb3duZXJJZDoge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICByZWdFeDogU2ltcGxlU2NoZW1hLlJlZ0V4LmlkXG4gIH1cbn0pO1xuXG5jb25zdCBhZGRPcHRJbiA9IChvcHRJbikgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IG91ck9wdEluID0gb3B0SW47XG4gICAgQWRkT3B0SW5TY2hlbWEudmFsaWRhdGUob3VyT3B0SW4pO1xuXG4gICAgY29uc3QgcmVjaXBpZW50ID0ge1xuICAgICAgZW1haWw6IG91ck9wdEluLnJlY2lwaWVudF9tYWlsXG4gICAgfVxuICAgIGNvbnN0IHJlY2lwaWVudElkID0gYWRkUmVjaXBpZW50KHJlY2lwaWVudCk7XG4gICAgY29uc3Qgc2VuZGVyID0ge1xuICAgICAgZW1haWw6IG91ck9wdEluLnNlbmRlcl9tYWlsXG4gICAgfVxuICAgIGNvbnN0IHNlbmRlcklkID0gYWRkU2VuZGVyKHNlbmRlcik7XG4gICAgXG4gICAgY29uc3Qgb3B0SW5zID0gT3B0SW5zLmZpbmQoe3JlY2lwaWVudDogcmVjaXBpZW50SWQsIHNlbmRlcjogc2VuZGVySWR9KS5mZXRjaCgpO1xuICAgIGlmKG9wdElucy5sZW5ndGggPiAwKSByZXR1cm4gb3B0SW5zWzBdLl9pZDsgLy9UT0RPIHdoZW4gU09JIGFscmVhZHkgZXhpc3RzIHJlc2VuZCBlbWFpbD9cblxuICAgIGlmKG91ck9wdEluLmRhdGEgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgSlNPTi5wYXJzZShvdXJPcHRJbi5kYXRhKTtcbiAgICAgIH0gY2F0Y2goZXJyb3IpIHtcbiAgICAgICAgbG9nRXJyb3IoXCJvdXJPcHRJbi5kYXRhOlwiLG91ck9wdEluLmRhdGEpO1xuICAgICAgICB0aHJvdyBcIkludmFsaWQgZGF0YSBqc29uIFwiO1xuICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBjb25zdCBvcHRJbklkID0gT3B0SW5zLmluc2VydCh7XG4gICAgICByZWNpcGllbnQ6IHJlY2lwaWVudElkLFxuICAgICAgc2VuZGVyOiBzZW5kZXJJZCxcbiAgICAgIGluZGV4OiBvdXJPcHRJbi5pbmRleCxcbiAgICAgIG1hc3RlckRvaSA6IG91ck9wdEluLm1hc3Rlcl9kb2ksXG4gICAgICBkYXRhOiBvdXJPcHRJbi5kYXRhLFxuICAgICAgb3duZXJJZDogb3VyT3B0SW4ub3duZXJJZFxuICAgIH0pO1xuICAgIGxvZ1NlbmQoXCJvcHRJbiAoaW5kZXg6XCIrb3VyT3B0SW4uaW5kZXgrXCIgYWRkZWQgdG8gbG9jYWwgZGIgd2l0aCBvcHRJbklkXCIsb3B0SW5JZCk7XG5cbiAgICB3cml0ZVRvQmxvY2tjaGFpbih7aWQ6IG9wdEluSWR9KTtcbiAgICByZXR1cm4gb3B0SW5JZDtcbiAgfSBjYXRjaCAoZXhjZXB0aW9uKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignb3B0LWlucy5hZGRBbmRXcml0ZVRvQmxvY2tjaGFpbi5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBhZGRPcHRJbjtcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tICdzaW1wbC1zY2hlbWEnO1xuaW1wb3J0IHsgQ09ORklSTV9DTElFTlQsIENPTkZJUk1fQUREUkVTUyB9IGZyb20gJy4uLy4uLy4uL3N0YXJ0dXAvc2VydmVyL2RvaWNoYWluLWNvbmZpZ3VyYXRpb24uanMnO1xuaW1wb3J0IHsgT3B0SW5zIH0gZnJvbSAnLi4vLi4vLi4vYXBpL29wdC1pbnMvb3B0LWlucy5qcyc7XG5pbXBvcnQgeyBEb2ljaGFpbkVudHJpZXMgfSBmcm9tICcuLi8uLi8uLi9hcGkvZG9pY2hhaW4vZW50cmllcy5qcyc7XG5pbXBvcnQgZGVjb2RlRG9pSGFzaCBmcm9tICcuLi9lbWFpbHMvZGVjb2RlX2RvaS1oYXNoLmpzJztcbmltcG9ydCB7IHNpZ25NZXNzYWdlIH0gZnJvbSAnLi4vLi4vLi4vLi4vc2VydmVyL2FwaS9kb2ljaGFpbi5qcyc7XG5pbXBvcnQgYWRkVXBkYXRlQmxvY2tjaGFpbkpvYiBmcm9tICcuLi9qb2JzL2FkZF91cGRhdGVfYmxvY2tjaGFpbi5qcyc7XG5pbXBvcnQge2xvZ0NvbmZpcm19IGZyb20gXCIuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9sb2ctY29uZmlndXJhdGlvblwiO1xuXG5jb25zdCBDb25maXJtT3B0SW5TY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgaG9zdDoge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9LFxuICBoYXNoOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH1cbn0pO1xuXG5jb25zdCBjb25maXJtT3B0SW4gPSAocmVxdWVzdCkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IG91clJlcXVlc3QgPSByZXF1ZXN0O1xuICAgIENvbmZpcm1PcHRJblNjaGVtYS52YWxpZGF0ZShvdXJSZXF1ZXN0KTtcbiAgICBjb25zdCBkZWNvZGVkID0gZGVjb2RlRG9pSGFzaCh7aGFzaDogcmVxdWVzdC5oYXNofSk7XG4gICAgY29uc3Qgb3B0SW4gPSBPcHRJbnMuZmluZE9uZSh7X2lkOiBkZWNvZGVkLmlkfSk7XG4gICAgaWYob3B0SW4gPT09IHVuZGVmaW5lZCB8fCBvcHRJbi5jb25maXJtYXRpb25Ub2tlbiAhPT0gZGVjb2RlZC50b2tlbikgdGhyb3cgXCJJbnZhbGlkIGhhc2hcIjtcbiAgICBpZihvcHRJbi5jb25maXJtYXRpb25Ub2tlbiA9PT0gZGVjb2RlZC50b2tlbiAmJiBvcHRJbi5jb25maXJtZWRBdCAhPSB1bmRlZmluZWQpeyAvLyBPcHQtSW4gd2FzIGFscmVhZHkgY29uZmlybWVkIG9uIGVtYWlsIGNsaWNrXG4gICAgICBsb2dDb25maXJtKFwiT3B0SW4gYWxyZWFkeSBjb25maXJtZWQ6IFwiLG9wdEluKTsgXG4gICAgICByZXR1cm4gZGVjb2RlZC5yZWRpcmVjdDsgXG4gICAgfVxuICAgIGNvbnN0IGNvbmZpcm1lZEF0ID0gbmV3IERhdGUoKTtcbi8vVE9ETyBhZnRlciBjb25maXJtYXRpb24gd2UgZGVsZXRlZCB0aGUgY29uZm9uZmlybWF0aW9udG9rZW4sIG5vdyB3ZSBrZWVwIGl0LiBjYW4gdGhpcyBiZSBhIHNlY3VyaXR5IHByb2JsZW0/XG4gICAgT3B0SW5zLnVwZGF0ZSh7X2lkIDogb3B0SW4uX2lkfSx7JHNldDp7Y29uZmlybWVkQXQ6IGNvbmZpcm1lZEF0LCBjb25maXJtZWRCeTogb3VyUmVxdWVzdC5ob3N0fX0pO1xuXG4gICAgLy9UT0RPIGhlcmUgZmluZCBhbGwgRG9pY2hhaW5FbnRyaWVzIGluIHRoZSBsb2NhbCBkYXRhYmFzZSAgYW5kIGJsb2NrY2hhaW4gd2l0aCB0aGUgc2FtZSBtYXN0ZXJEb2lcbiAgICBjb25zdCBlbnRyaWVzID0gRG9pY2hhaW5FbnRyaWVzLmZpbmQoeyRvcjogW3tuYW1lOiBvcHRJbi5uYW1lSWR9LCB7bWFzdGVyRG9pOiBvcHRJbi5uYW1lSWR9XX0pO1xuICAgIGlmKGVudHJpZXMgPT09IHVuZGVmaW5lZCkgdGhyb3cgXCJEb2ljaGFpbiBlbnRyeS9lbnRyaWVzIG5vdCBmb3VuZFwiO1xuXG4gICAgZW50cmllcy5mb3JFYWNoKGVudHJ5ID0+IHtcbiAgICAgICAgbG9nQ29uZmlybSgnY29uZmlybWluZyBEb2lDaGFpbkVudHJ5OicsZW50cnkpO1xuXG4gICAgICAgIGNvbnN0IHZhbHVlID0gSlNPTi5wYXJzZShlbnRyeS52YWx1ZSk7XG4gICAgICAgIGxvZ0NvbmZpcm0oJ2dldFNpZ25hdHVyZSAob25seSBvZiB2YWx1ZSEpJywgdmFsdWUpO1xuXG4gICAgICAgIGNvbnN0IGRvaVNpZ25hdHVyZSA9IHNpZ25NZXNzYWdlKENPTkZJUk1fQ0xJRU5ULCBDT05GSVJNX0FERFJFU1MsIHZhbHVlLnNpZ25hdHVyZSk7XG4gICAgICAgIGxvZ0NvbmZpcm0oJ2dvdCBkb2lTaWduYXR1cmU6Jyxkb2lTaWduYXR1cmUpO1xuICAgICAgICBjb25zdCBmcm9tSG9zdFVybCA9IHZhbHVlLmZyb207XG5cbiAgICAgICAgZGVsZXRlIHZhbHVlLmZyb207XG4gICAgICAgIHZhbHVlLmRvaVRpbWVzdGFtcCA9IGNvbmZpcm1lZEF0LnRvSVNPU3RyaW5nKCk7XG4gICAgICAgIHZhbHVlLmRvaVNpZ25hdHVyZSA9IGRvaVNpZ25hdHVyZTtcbiAgICAgICAgY29uc3QganNvblZhbHVlID0gSlNPTi5zdHJpbmdpZnkodmFsdWUpO1xuICAgICAgICBsb2dDb25maXJtKCd1cGRhdGluZyBEb2ljaGFpbiBuYW1lSWQ6JytvcHRJbi5uYW1lSWQrJyB3aXRoIHZhbHVlOicsanNvblZhbHVlKTtcblxuICAgICAgICBhZGRVcGRhdGVCbG9ja2NoYWluSm9iKHtcbiAgICAgICAgICAgIG5hbWVJZDogZW50cnkubmFtZSxcbiAgICAgICAgICAgIHZhbHVlOiBqc29uVmFsdWUsXG4gICAgICAgICAgICBmcm9tSG9zdFVybDogZnJvbUhvc3RVcmwsXG4gICAgICAgICAgICBob3N0OiBvdXJSZXF1ZXN0Lmhvc3RcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gICAgbG9nQ29uZmlybSgncmVkaXJlY3RpbmcgdXNlciB0bzonLGRlY29kZWQucmVkaXJlY3QpO1xuICAgIHJldHVybiBkZWNvZGVkLnJlZGlyZWN0O1xuICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdvcHQtaW5zLmNvbmZpcm0uZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgY29uZmlybU9wdEluXG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcbmltcG9ydCB7IHJhbmRvbUJ5dGVzIH0gZnJvbSAnY3J5cHRvJztcbmltcG9ydCB7IE9wdElucyB9IGZyb20gJy4uLy4uLy4uL2FwaS9vcHQtaW5zL29wdC1pbnMuanMnO1xuXG5jb25zdCBHZW5lcmF0ZURvaVRva2VuU2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIGlkOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH1cbn0pO1xuXG5jb25zdCBnZW5lcmF0ZURvaVRva2VuID0gKG9wdEluKSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3Qgb3VyT3B0SW4gPSBvcHRJbjtcbiAgICBHZW5lcmF0ZURvaVRva2VuU2NoZW1hLnZhbGlkYXRlKG91ck9wdEluKTtcbiAgICBjb25zdCB0b2tlbiA9IHJhbmRvbUJ5dGVzKDMyKS50b1N0cmluZygnaGV4Jyk7XG4gICAgT3B0SW5zLnVwZGF0ZSh7X2lkIDogb3VyT3B0SW4uaWR9LHskc2V0Ontjb25maXJtYXRpb25Ub2tlbjogdG9rZW59fSk7XG4gICAgcmV0dXJuIHRva2VuO1xuICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdvcHQtaW5zLmdlbmVyYXRlX2RvaS10b2tlbi5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBnZW5lcmF0ZURvaVRva2VuXG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcbmltcG9ydCB7IE9wdElucyB9IGZyb20gJy4uLy4uLy4uL2FwaS9vcHQtaW5zL29wdC1pbnMuanMnO1xuaW1wb3J0IHsgUmVjaXBpZW50cyB9IGZyb20gJy4uLy4uLy4uL2FwaS9yZWNpcGllbnRzL3JlY2lwaWVudHMuanMnO1xuaW1wb3J0IHZlcmlmeVNpZ25hdHVyZSBmcm9tICcuLi9kb2ljaGFpbi92ZXJpZnlfc2lnbmF0dXJlLmpzJztcbmltcG9ydCB7bG9nU2VuZH0gZnJvbSBcIi4uLy4uLy4uL3N0YXJ0dXAvc2VydmVyL2xvZy1jb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgZ2V0UHVibGljS2V5QW5kQWRkcmVzcyBmcm9tIFwiLi4vZG9pY2hhaW4vZ2V0X3B1YmxpY2tleV9hbmRfYWRkcmVzc19ieV9kb21haW5cIjtcblxuY29uc3QgVXBkYXRlT3B0SW5TdGF0dXNTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgbmFtZUlkOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH0sXG4gIHNpZ25hdHVyZToge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9LFxuICBob3N0OiB7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICBvcHRpb25hbDogdHJ1ZVxuICB9XG59KTtcblxuXG5jb25zdCB1cGRhdGVPcHRJblN0YXR1cyA9IChkYXRhKSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3Qgb3VyRGF0YSA9IGRhdGE7XG4gICAgbG9nU2VuZCgnY29uZmlybSBkQXBwIGNvbmZpcm1zIG9wdEluOicsSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xuICAgIFVwZGF0ZU9wdEluU3RhdHVzU2NoZW1hLnZhbGlkYXRlKG91ckRhdGEpO1xuICAgIGNvbnN0IG9wdEluID0gT3B0SW5zLmZpbmRPbmUoe25hbWVJZDogb3VyRGF0YS5uYW1lSWR9KTtcbiAgICBpZihvcHRJbiA9PT0gdW5kZWZpbmVkKSB0aHJvdyBcIk9wdC1JbiBub3QgZm91bmRcIjtcbiAgICBsb2dTZW5kKCdjb25maXJtIGRBcHAgY29uZmlybXMgb3B0SW46JyxvdXJEYXRhLm5hbWVJZCk7XG5cbiAgICBjb25zdCByZWNpcGllbnQgPSBSZWNpcGllbnRzLmZpbmRPbmUoe19pZDogb3B0SW4ucmVjaXBpZW50fSk7XG4gICAgaWYocmVjaXBpZW50ID09PSB1bmRlZmluZWQpIHRocm93IFwiUmVjaXBpZW50IG5vdCBmb3VuZFwiO1xuICAgIGNvbnN0IHBhcnRzID0gcmVjaXBpZW50LmVtYWlsLnNwbGl0KFwiQFwiKTtcbiAgICBjb25zdCBkb21haW4gPSBwYXJ0c1twYXJ0cy5sZW5ndGgtMV07XG4gICAgY29uc3QgcHVibGljS2V5QW5kQWRkcmVzcyA9IGdldFB1YmxpY0tleUFuZEFkZHJlc3Moe2RvbWFpbjpkb21haW59KTtcblxuICAgIC8vVE9ETyBnZXR0aW5nIGluZm9ybWF0aW9uIGZyb20gQm9iIHRoYXQgYSBjZXJ0YWluIG5hbWVJZCAoRE9JKSBnb3QgY29uZmlybWVkLlxuICAgIGlmKCF2ZXJpZnlTaWduYXR1cmUoe3B1YmxpY0tleTogcHVibGljS2V5QW5kQWRkcmVzcy5wdWJsaWNLZXksIGRhdGE6IG91ckRhdGEubmFtZUlkLCBzaWduYXR1cmU6IG91ckRhdGEuc2lnbmF0dXJlfSkpIHtcbiAgICAgIHRocm93IFwiQWNjZXNzIGRlbmllZFwiO1xuICAgIH1cbiAgICBsb2dTZW5kKCdzaWduYXR1cmUgdmFsaWQgZm9yIHB1YmxpY0tleScsIHB1YmxpY0tleUFuZEFkZHJlc3MucHVibGljS2V5KTtcblxuICAgIE9wdElucy51cGRhdGUoe19pZCA6IG9wdEluLl9pZH0seyRzZXQ6e2NvbmZpcm1lZEF0OiBuZXcgRGF0ZSgpLCBjb25maXJtZWRCeTogb3VyRGF0YS5ob3N0fX0pO1xuICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdkYXBwcy5zZW5kLnVwZGF0ZU9wdEluU3RhdHVzLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IHVwZGF0ZU9wdEluU3RhdHVzO1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XG5pbXBvcnQgeyBWRVJJRllfQ0xJRU5UIH0gZnJvbSAnLi4vLi4vLi4vc3RhcnR1cC9zZXJ2ZXIvZG9pY2hhaW4tY29uZmlndXJhdGlvbi5qcyc7XG5pbXBvcnQgeyBuYW1lU2hvdyB9IGZyb20gJy4uLy4uLy4uLy4uL3NlcnZlci9hcGkvZG9pY2hhaW4uanMnO1xuaW1wb3J0IGdldE9wdEluUHJvdmlkZXIgZnJvbSAnLi4vZG5zL2dldF9vcHQtaW4tcHJvdmlkZXIuanMnO1xuaW1wb3J0IGdldE9wdEluS2V5IGZyb20gJy4uL2Rucy9nZXRfb3B0LWluLWtleS5qcyc7XG5pbXBvcnQgdmVyaWZ5U2lnbmF0dXJlIGZyb20gJy4uL2RvaWNoYWluL3ZlcmlmeV9zaWduYXR1cmUuanMnO1xuaW1wb3J0IHtsb2dWZXJpZnl9IGZyb20gXCIuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9sb2ctY29uZmlndXJhdGlvblwiO1xuaW1wb3J0IGdldFB1YmxpY0tleUFuZEFkZHJlc3MgZnJvbSBcIi4uL2RvaWNoYWluL2dldF9wdWJsaWNrZXlfYW5kX2FkZHJlc3NfYnlfZG9tYWluXCI7XG5cbmNvbnN0IFZlcmlmeU9wdEluU2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIHJlY2lwaWVudF9tYWlsOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIHJlZ0V4OiBTaW1wbGVTY2hlbWEuUmVnRXguRW1haWxcbiAgfSxcbiAgc2VuZGVyX21haWw6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgcmVnRXg6IFNpbXBsZVNjaGVtYS5SZWdFeC5FbWFpbFxuICB9LFxuICBuYW1lX2lkOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH0sXG4gIHJlY2lwaWVudF9wdWJsaWNfa2V5OiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH1cbn0pO1xuXG5jb25zdCB2ZXJpZnlPcHRJbiA9IChkYXRhKSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3Qgb3VyRGF0YSA9IGRhdGE7XG4gICAgVmVyaWZ5T3B0SW5TY2hlbWEudmFsaWRhdGUob3VyRGF0YSk7XG4gICAgY29uc3QgZW50cnkgPSBuYW1lU2hvdyhWRVJJRllfQ0xJRU5ULCBvdXJEYXRhLm5hbWVfaWQpO1xuICAgIGlmKGVudHJ5ID09PSB1bmRlZmluZWQpIHJldHVybiB7bmFtZUlkRm91bmQ6IFwiZmFpbGVkXCJ9O1xuICAgIGNvbnN0IGVudHJ5RGF0YSA9IEpTT04ucGFyc2UoZW50cnkudmFsdWUpO1xuICAgIGNvbnN0IGZpcnN0Q2hlY2sgPSB2ZXJpZnlTaWduYXR1cmUoe1xuICAgICAgZGF0YTogb3VyRGF0YS5yZWNpcGllbnRfbWFpbCtvdXJEYXRhLnNlbmRlcl9tYWlsLFxuICAgICAgc2lnbmF0dXJlOiBlbnRyeURhdGEuc2lnbmF0dXJlLFxuICAgICAgcHVibGljS2V5OiBvdXJEYXRhLnJlY2lwaWVudF9wdWJsaWNfa2V5XG4gICAgfSk7XG5cbiAgICBpZighZmlyc3RDaGVjaykgcmV0dXJuIHtzb2lTaWduYXR1cmVTdGF0dXM6IFwiZmFpbGVkXCJ9O1xuICAgIGNvbnN0IHBhcnRzID0gb3VyRGF0YS5yZWNpcGllbnRfbWFpbC5zcGxpdChcIkBcIik7IC8vVE9ETyBwdXQgdGhpcyBpbnRvIGdldFB1YmxpY0tleUFuZEFkZHJlc3NcbiAgICBjb25zdCBkb21haW4gPSBwYXJ0c1twYXJ0cy5sZW5ndGgtMV07XG4gICAgY29uc3QgcHVibGljS2V5QW5kQWRkcmVzcyA9IGdldFB1YmxpY0tleUFuZEFkZHJlc3Moe2RvbWFpbjogZG9tYWlufSk7XG5cbiAgICBpZighZW50cnlEYXRhLnNpZ25hdHVyZXx8IWVudHJ5RGF0YS5kb2lTaWduYXR1cmUpcmV0dXJuIHtkb2lTaWduYXR1cmVTdGF0dXM6IFwibWlzc2luZ1wifTtcbiAgICBjb25zdCBzZWNvbmRDaGVjayA9IHZlcmlmeVNpZ25hdHVyZSh7XG4gICAgICBkYXRhOiBlbnRyeURhdGEuc2lnbmF0dXJlLFxuICAgICAgc2lnbmF0dXJlOiBlbnRyeURhdGEuZG9pU2lnbmF0dXJlLFxuICAgICAgcHVibGljS2V5OiBwdWJsaWNLZXlBbmRBZGRyZXNzLnB1YmxpY0tleVxuICAgIH0pXG5cbiAgICBpZighc2Vjb25kQ2hlY2spIHJldHVybiB7ZG9pU2lnbmF0dXJlU3RhdHVzOiBcImZhaWxlZFwifTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBjYXRjaCAoZXhjZXB0aW9uKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignb3B0LWlucy52ZXJpZnkuZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgdmVyaWZ5T3B0SW5cbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tICdzaW1wbC1zY2hlbWEnO1xuaW1wb3J0IHsgUmVjaXBpZW50cyB9IGZyb20gJy4uLy4uLy4uL2FwaS9yZWNpcGllbnRzL3JlY2lwaWVudHMuanMnO1xuaW1wb3J0IGdldEtleVBhaXIgZnJvbSAnLi4vZG9pY2hhaW4vZ2V0X2tleS1wYWlyLmpzJztcblxuY29uc3QgQWRkUmVjaXBpZW50U2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIGVtYWlsOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIHJlZ0V4OiBTaW1wbGVTY2hlbWEuUmVnRXguRW1haWxcbiAgfVxufSk7XG5cbmNvbnN0IGFkZFJlY2lwaWVudCA9IChyZWNpcGllbnQpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBvdXJSZWNpcGllbnQgPSByZWNpcGllbnQ7XG4gICAgQWRkUmVjaXBpZW50U2NoZW1hLnZhbGlkYXRlKG91clJlY2lwaWVudCk7XG4gICAgY29uc3QgcmVjaXBpZW50cyA9IFJlY2lwaWVudHMuZmluZCh7ZW1haWw6IHJlY2lwaWVudC5lbWFpbH0pLmZldGNoKCk7XG4gICAgaWYocmVjaXBpZW50cy5sZW5ndGggPiAwKSByZXR1cm4gcmVjaXBpZW50c1swXS5faWQ7XG4gICAgY29uc3Qga2V5UGFpciA9IGdldEtleVBhaXIoKTtcbiAgICByZXR1cm4gUmVjaXBpZW50cy5pbnNlcnQoe1xuICAgICAgZW1haWw6IG91clJlY2lwaWVudC5lbWFpbCxcbiAgICAgIHByaXZhdGVLZXk6IGtleVBhaXIucHJpdmF0ZUtleSxcbiAgICAgIHB1YmxpY0tleToga2V5UGFpci5wdWJsaWNLZXlcbiAgICB9KVxuICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdyZWNpcGllbnRzLmFkZC5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBhZGRSZWNpcGllbnQ7XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcbmltcG9ydCB7IFNlbmRlcnMgfSBmcm9tICcuLi8uLi8uLi9hcGkvc2VuZGVycy9zZW5kZXJzLmpzJztcblxuY29uc3QgQWRkU2VuZGVyU2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIGVtYWlsOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIHJlZ0V4OiBTaW1wbGVTY2hlbWEuUmVnRXguRW1haWxcbiAgfVxufSk7XG5cbmNvbnN0IGFkZFNlbmRlciA9IChzZW5kZXIpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBvdXJTZW5kZXIgPSBzZW5kZXI7XG4gICAgQWRkU2VuZGVyU2NoZW1hLnZhbGlkYXRlKG91clNlbmRlcik7XG4gICAgY29uc3Qgc2VuZGVycyA9IFNlbmRlcnMuZmluZCh7ZW1haWw6IHNlbmRlci5lbWFpbH0pLmZldGNoKCk7XG4gICAgaWYoc2VuZGVycy5sZW5ndGggPiAwKSByZXR1cm4gc2VuZGVyc1swXS5faWQ7XG4gICAgcmV0dXJuIFNlbmRlcnMuaW5zZXJ0KHtcbiAgICAgIGVtYWlsOiBvdXJTZW5kZXIuZW1haWxcbiAgICB9KVxuICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdzZW5kZXJzLmFkZC5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBhZGRTZW5kZXI7XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcblxuZXhwb3J0IGZ1bmN0aW9uIGlzRGVidWcoKSB7XG4gIGlmKE1ldGVvci5zZXR0aW5ncyAhPT0gdW5kZWZpbmVkICYmXG4gICAgIE1ldGVvci5zZXR0aW5ncy5hcHAgIT09IHVuZGVmaW5lZCAmJlxuICAgICBNZXRlb3Iuc2V0dGluZ3MuYXBwLmRlYnVnICE9PSB1bmRlZmluZWQpIHJldHVybiBNZXRlb3Iuc2V0dGluZ3MuYXBwLmRlYnVnXG4gIHJldHVybiBmYWxzZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzUmVndGVzdCgpIHtcbiAgaWYoTWV0ZW9yLnNldHRpbmdzICE9PSB1bmRlZmluZWQgJiZcbiAgICAgTWV0ZW9yLnNldHRpbmdzLmFwcCAhPT0gdW5kZWZpbmVkICYmXG4gICAgIE1ldGVvci5zZXR0aW5ncy5hcHAucmVndGVzdCAhPT0gdW5kZWZpbmVkKSByZXR1cm4gTWV0ZW9yLnNldHRpbmdzLmFwcC5yZWd0ZXN0XG4gIHJldHVybiBmYWxzZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzVGVzdG5ldCgpIHtcbiAgICBpZihNZXRlb3Iuc2V0dGluZ3MgIT09IHVuZGVmaW5lZCAmJlxuICAgICAgICBNZXRlb3Iuc2V0dGluZ3MuYXBwICE9PSB1bmRlZmluZWQgJiZcbiAgICAgICAgTWV0ZW9yLnNldHRpbmdzLmFwcC50ZXN0bmV0ICE9PSB1bmRlZmluZWQpIHJldHVybiBNZXRlb3Iuc2V0dGluZ3MuYXBwLnRlc3RuZXRcbiAgICByZXR1cm4gZmFsc2U7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRVcmwoKSB7XG4gIGlmKE1ldGVvci5zZXR0aW5ncyAhPT0gdW5kZWZpbmVkICYmXG4gICAgIE1ldGVvci5zZXR0aW5ncy5hcHAgIT09IHVuZGVmaW5lZCAmJlxuICAgICBNZXRlb3Iuc2V0dGluZ3MuYXBwLmhvc3QgIT09IHVuZGVmaW5lZCkge1xuICAgICAgIGxldCBwb3J0ID0gMzAwMDtcbiAgICAgICBpZihNZXRlb3Iuc2V0dGluZ3MuYXBwLnBvcnQgIT09IHVuZGVmaW5lZCkgcG9ydCA9IE1ldGVvci5zZXR0aW5ncy5hcHAucG9ydFxuICAgICAgIHJldHVybiBcImh0dHA6Ly9cIitNZXRlb3Iuc2V0dGluZ3MuYXBwLmhvc3QrXCI6XCIrcG9ydCtcIi9cIjtcbiAgfVxuICByZXR1cm4gTWV0ZW9yLmFic29sdXRlVXJsKCk7XG59XG4iLCJleHBvcnQgY29uc3QgRkFMTEJBQ0tfUFJPVklERVIgPSBcImRvaWNoYWluLm9yZ1wiO1xuIiwiaW1wb3J0IG5hbWVjb2luIGZyb20gJ25hbWVjb2luJztcbmltcG9ydCB7IFNFTkRfQVBQLCBDT05GSVJNX0FQUCwgVkVSSUZZX0FQUCwgaXNBcHBUeXBlIH0gZnJvbSAnLi90eXBlLWNvbmZpZ3VyYXRpb24uanMnO1xuXG52YXIgc2VuZFNldHRpbmdzID0gTWV0ZW9yLnNldHRpbmdzLnNlbmQ7XG52YXIgc2VuZENsaWVudCA9IHVuZGVmaW5lZDtcbmlmKGlzQXBwVHlwZShTRU5EX0FQUCkpIHtcbiAgaWYoIXNlbmRTZXR0aW5ncyB8fCAhc2VuZFNldHRpbmdzLmRvaWNoYWluKVxuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoXCJjb25maWcuc2VuZC5kb2ljaGFpblwiLCBcIlNlbmQgYXBwIGRvaWNoYWluIHNldHRpbmdzIG5vdCBmb3VuZFwiKVxuICBzZW5kQ2xpZW50ID0gY3JlYXRlQ2xpZW50KHNlbmRTZXR0aW5ncy5kb2ljaGFpbik7XG59XG5leHBvcnQgY29uc3QgU0VORF9DTElFTlQgPSBzZW5kQ2xpZW50O1xuXG52YXIgY29uZmlybVNldHRpbmdzID0gTWV0ZW9yLnNldHRpbmdzLmNvbmZpcm07XG52YXIgY29uZmlybUNsaWVudCA9IHVuZGVmaW5lZDtcbnZhciBjb25maXJtQWRkcmVzcyA9IHVuZGVmaW5lZDtcbmlmKGlzQXBwVHlwZShDT05GSVJNX0FQUCkpIHtcbiAgaWYoIWNvbmZpcm1TZXR0aW5ncyB8fCAhY29uZmlybVNldHRpbmdzLmRvaWNoYWluKVxuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoXCJjb25maWcuY29uZmlybS5kb2ljaGFpblwiLCBcIkNvbmZpcm0gYXBwIGRvaWNoYWluIHNldHRpbmdzIG5vdCBmb3VuZFwiKVxuICBjb25maXJtQ2xpZW50ID0gY3JlYXRlQ2xpZW50KGNvbmZpcm1TZXR0aW5ncy5kb2ljaGFpbik7XG4gIGNvbmZpcm1BZGRyZXNzID0gY29uZmlybVNldHRpbmdzLmRvaWNoYWluLmFkZHJlc3M7XG59XG5leHBvcnQgY29uc3QgQ09ORklSTV9DTElFTlQgPSBjb25maXJtQ2xpZW50O1xuZXhwb3J0IGNvbnN0IENPTkZJUk1fQUREUkVTUyA9IGNvbmZpcm1BZGRyZXNzO1xuXG52YXIgdmVyaWZ5U2V0dGluZ3MgPSBNZXRlb3Iuc2V0dGluZ3MudmVyaWZ5O1xudmFyIHZlcmlmeUNsaWVudCA9IHVuZGVmaW5lZDtcbmlmKGlzQXBwVHlwZShWRVJJRllfQVBQKSkge1xuICBpZighdmVyaWZ5U2V0dGluZ3MgfHwgIXZlcmlmeVNldHRpbmdzLmRvaWNoYWluKVxuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoXCJjb25maWcudmVyaWZ5LmRvaWNoYWluXCIsIFwiVmVyaWZ5IGFwcCBkb2ljaGFpbiBzZXR0aW5ncyBub3QgZm91bmRcIilcbiAgdmVyaWZ5Q2xpZW50ID0gY3JlYXRlQ2xpZW50KHZlcmlmeVNldHRpbmdzLmRvaWNoYWluKTtcbn1cbmV4cG9ydCBjb25zdCBWRVJJRllfQ0xJRU5UID0gdmVyaWZ5Q2xpZW50O1xuXG5mdW5jdGlvbiBjcmVhdGVDbGllbnQoc2V0dGluZ3MpIHtcbiAgcmV0dXJuIG5ldyBuYW1lY29pbi5DbGllbnQoe1xuICAgIGhvc3Q6IHNldHRpbmdzLmhvc3QsXG4gICAgcG9ydDogc2V0dGluZ3MucG9ydCxcbiAgICB1c2VyOiBzZXR0aW5ncy51c2VybmFtZSxcbiAgICBwYXNzOiBzZXR0aW5ncy5wYXNzd29yZFxuICB9KTtcbn1cbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IHsgU0VORF9BUFAsIENPTkZJUk1fQVBQLCBpc0FwcFR5cGUgfSBmcm9tICcuL3R5cGUtY29uZmlndXJhdGlvbi5qcyc7XG5pbXBvcnQgSGFzaGlkcyBmcm9tICdoYXNoaWRzJztcbi8vY29uc3QgSGFzaGlkcyA9IHJlcXVpcmUoJ2hhc2hpZHMnKS5kZWZhdWx0O1xuaW1wb3J0IHtsb2dDb25maXJtfSBmcm9tIFwiLi9sb2ctY29uZmlndXJhdGlvblwiO1xuXG5leHBvcnQgY29uc3QgSGFzaElkcyA9IG5ldyBIYXNoaWRzKCcweHVnbUxlN055ZWU2dmsxaUY4OCg2Q213cHFvRzRoUSotVDc0dGpZd15PMnZPTyhYbC05MXdBOCpuQ2dfbFgkJyk7XG5cbnZhciBzZW5kU2V0dGluZ3MgPSBNZXRlb3Iuc2V0dGluZ3Muc2VuZDtcbnZhciBkb2lNYWlsRmV0Y2hVcmwgPSB1bmRlZmluZWQ7XG5cbmlmKGlzQXBwVHlwZShTRU5EX0FQUCkpIHtcbiAgaWYoIXNlbmRTZXR0aW5ncyB8fCAhc2VuZFNldHRpbmdzLmRvaU1haWxGZXRjaFVybClcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFwiY29uZmlnLnNlbmQuZW1haWxcIiwgXCJTZXR0aW5ncyBub3QgZm91bmRcIik7XG4gIGRvaU1haWxGZXRjaFVybCA9IHNlbmRTZXR0aW5ncy5kb2lNYWlsRmV0Y2hVcmw7XG59XG5leHBvcnQgY29uc3QgRE9JX01BSUxfRkVUQ0hfVVJMID0gZG9pTWFpbEZldGNoVXJsO1xuXG52YXIgZGVmYXVsdEZyb20gPSB1bmRlZmluZWQ7XG5pZihpc0FwcFR5cGUoQ09ORklSTV9BUFApKSB7XG4gIHZhciBjb25maXJtU2V0dGluZ3MgPSBNZXRlb3Iuc2V0dGluZ3MuY29uZmlybTtcblxuICBpZighY29uZmlybVNldHRpbmdzIHx8ICFjb25maXJtU2V0dGluZ3Muc210cClcbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcihcImNvbmZpZy5jb25maXJtLnNtdHBcIiwgXCJDb25maXJtIGFwcCBlbWFpbCBzbXRwIHNldHRpbmdzIG5vdCBmb3VuZFwiKVxuXG4gIGlmKCFjb25maXJtU2V0dGluZ3Muc210cC5kZWZhdWx0RnJvbSlcbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcihcImNvbmZpZy5jb25maXJtLmRlZmF1bHRGcm9tXCIsIFwiQ29uZmlybSBhcHAgZW1haWwgZGVmYXVsdEZyb20gbm90IGZvdW5kXCIpXG5cbiAgZGVmYXVsdEZyb20gID0gIGNvbmZpcm1TZXR0aW5ncy5zbXRwLmRlZmF1bHRGcm9tO1xuXG4gIGxvZ0NvbmZpcm0oJ3NlbmRpbmcgd2l0aCBkZWZhdWx0RnJvbTonLGRlZmF1bHRGcm9tKTtcblxuICBNZXRlb3Iuc3RhcnR1cCgoKSA9PiB7XG5cbiAgIGlmKGNvbmZpcm1TZXR0aW5ncy5zbXRwLnVzZXJuYW1lID09PSB1bmRlZmluZWQpe1xuICAgICAgIHByb2Nlc3MuZW52Lk1BSUxfVVJMID0gJ3NtdHA6Ly8nICtcbiAgICAgICAgICAgZW5jb2RlVVJJQ29tcG9uZW50KGNvbmZpcm1TZXR0aW5ncy5zbXRwLnNlcnZlcikgK1xuICAgICAgICAgICAnOicgK1xuICAgICAgICAgICBjb25maXJtU2V0dGluZ3Muc210cC5wb3J0O1xuICAgfWVsc2V7XG4gICAgICAgcHJvY2Vzcy5lbnYuTUFJTF9VUkwgPSAnc210cDovLycgK1xuICAgICAgICAgICBlbmNvZGVVUklDb21wb25lbnQoY29uZmlybVNldHRpbmdzLnNtdHAudXNlcm5hbWUpICtcbiAgICAgICAgICAgJzonICsgZW5jb2RlVVJJQ29tcG9uZW50KGNvbmZpcm1TZXR0aW5ncy5zbXRwLnBhc3N3b3JkKSArXG4gICAgICAgICAgICdAJyArIGVuY29kZVVSSUNvbXBvbmVudChjb25maXJtU2V0dGluZ3Muc210cC5zZXJ2ZXIpICtcbiAgICAgICAgICAgJzonICtcbiAgICAgICAgICAgY29uZmlybVNldHRpbmdzLnNtdHAucG9ydDtcbiAgIH1cblxuICAgbG9nQ29uZmlybSgndXNpbmcgTUFJTF9VUkw6Jyxwcm9jZXNzLmVudi5NQUlMX1VSTCk7XG5cbiAgIGlmKGNvbmZpcm1TZXR0aW5ncy5zbXRwLk5PREVfVExTX1JFSkVDVF9VTkFVVEhPUklaRUQhPT11bmRlZmluZWQpXG4gICAgICAgcHJvY2Vzcy5lbnYuTk9ERV9UTFNfUkVKRUNUX1VOQVVUSE9SSVpFRCA9IGNvbmZpcm1TZXR0aW5ncy5zbXRwLk5PREVfVExTX1JFSkVDVF9VTkFVVEhPUklaRUQ7IC8vMFxuICB9KTtcbn1cbmV4cG9ydCBjb25zdCBET0lfTUFJTF9ERUZBVUxUX0VNQUlMX0ZST00gPSBkZWZhdWx0RnJvbTtcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IHsgUm9sZXMgfSBmcm9tICdtZXRlb3IvYWxhbm5pbmc6cm9sZXMnO1xuaW1wb3J0IHtNZXRhfSBmcm9tICcuLi8uLi9hcGkvbWV0YS9tZXRhLmpzJ1xuTWV0ZW9yLnN0YXJ0dXAoKCkgPT4ge1xuXG4gIGxldCB2ZXJzaW9uPUFzc2V0cy5nZXRUZXh0KFwidmVyc2lvbi5qc29uXCIpO1xuXG4gIGlmKE1ldGEuZmluZCh7a2V5OlwidmVyc2lvblwifSkuY291bnQoKSA+IDApe1xuICAgIE1ldGEucmVtb3ZlKHtrZXk6XCJ2ZXJzaW9uXCJ9KTtcbiAgfVxuICAgTWV0YS5pbnNlcnQoe2tleTpcInZlcnNpb25cIix2YWx1ZTp2ZXJzaW9ufSk7XG4gIFxuICBpZihNZXRlb3IudXNlcnMuZmluZCgpLmNvdW50KCkgPT09IDApIHtcbiAgICBjb25zdCBpZCA9IEFjY291bnRzLmNyZWF0ZVVzZXIoe1xuICAgICAgdXNlcm5hbWU6ICdhZG1pbicsXG4gICAgICBlbWFpbDogJ2FkbWluQHNlbmRlZmZlY3QuZGUnLFxuICAgICAgcGFzc3dvcmQ6ICdwYXNzd29yZCdcbiAgICB9KTtcbiAgICBSb2xlcy5hZGRVc2Vyc1RvUm9sZXMoaWQsICdhZG1pbicpO1xuICB9XG59KTtcbiIsImltcG9ydCAnLi9sb2ctY29uZmlndXJhdGlvbi5qcyc7XG5pbXBvcnQgJy4vZGFwcC1jb25maWd1cmF0aW9uLmpzJztcbmltcG9ydCAnLi90eXBlLWNvbmZpZ3VyYXRpb24uanMnO1xuaW1wb3J0ICcuL2Rucy1jb25maWd1cmF0aW9uLmpzJztcbmltcG9ydCAnLi9kb2ljaGFpbi1jb25maWd1cmF0aW9uLmpzJztcbmltcG9ydCAnLi9maXh0dXJlcy5qcyc7XG5pbXBvcnQgJy4vcmVnaXN0ZXItYXBpLmpzJztcbmltcG9ydCAnLi91c2VyYWNjb3VudHMtY29uZmlndXJhdGlvbi5qcyc7XG5pbXBvcnQgJy4vc2VjdXJpdHkuanMnO1xuaW1wb3J0ICcuL2VtYWlsLWNvbmZpZ3VyYXRpb24uanMnO1xuaW1wb3J0ICcuL2pvYnMuanMnO1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgeyBNYWlsSm9icyB9IGZyb20gJy4uLy4uLy4uL3NlcnZlci9hcGkvbWFpbF9qb2JzLmpzJztcbmltcG9ydCB7IEJsb2NrY2hhaW5Kb2JzIH0gZnJvbSAnLi4vLi4vLi4vc2VydmVyL2FwaS9ibG9ja2NoYWluX2pvYnMuanMnO1xuaW1wb3J0IHsgREFwcEpvYnMgfSBmcm9tICcuLi8uLi8uLi9zZXJ2ZXIvYXBpL2RhcHBfam9icy5qcyc7XG5pbXBvcnQgeyBDT05GSVJNX0FQUCwgaXNBcHBUeXBlIH0gZnJvbSAnLi90eXBlLWNvbmZpZ3VyYXRpb24uanMnO1xuaW1wb3J0IGFkZENoZWNrTmV3VHJhbnNhY3Rpb25zQmxvY2tjaGFpbkpvYiBmcm9tICcuLi8uLi9tb2R1bGVzL3NlcnZlci9qb2JzL2FkZF9jaGVja19uZXdfdHJhbnNhY3Rpb25zLmpzJztcblxuTWV0ZW9yLnN0YXJ0dXAoKCkgPT4ge1xuICBNYWlsSm9icy5zdGFydEpvYlNlcnZlcigpO1xuICBCbG9ja2NoYWluSm9icy5zdGFydEpvYlNlcnZlcigpO1xuICBEQXBwSm9icy5zdGFydEpvYlNlcnZlcigpO1xuICBpZihpc0FwcFR5cGUoQ09ORklSTV9BUFApKSBhZGRDaGVja05ld1RyYW5zYWN0aW9uc0Jsb2NrY2hhaW5Kb2IoKTtcbn0pO1xuIiwiaW1wb3J0IHtpc0RlYnVnfSBmcm9tIFwiLi9kYXBwLWNvbmZpZ3VyYXRpb25cIjtcblxucmVxdWlyZSgnc2NyaWJlLWpzJykoKTtcblxuZXhwb3J0IGNvbnN0IGNvbnNvbGUgPSBwcm9jZXNzLmNvbnNvbGU7XG5leHBvcnQgY29uc3Qgc2VuZE1vZGVUYWdDb2xvciA9IHttc2cgOiAnc2VuZC1tb2RlJywgY29sb3JzIDogWyd5ZWxsb3cnLCAnaW52ZXJzZSddfTtcbmV4cG9ydCBjb25zdCBjb25maXJtTW9kZVRhZ0NvbG9yID0ge21zZyA6ICdjb25maXJtLW1vZGUnLCBjb2xvcnMgOiBbJ2JsdWUnLCAnaW52ZXJzZSddfTtcbmV4cG9ydCBjb25zdCB2ZXJpZnlNb2RlVGFnQ29sb3IgPSB7bXNnIDogJ3ZlcmlmeS1tb2RlJywgY29sb3JzIDogWydncmVlbicsICdpbnZlcnNlJ119O1xuZXhwb3J0IGNvbnN0IGJsb2NrY2hhaW5Nb2RlVGFnQ29sb3IgPSB7bXNnIDogJ2Jsb2NrY2hhaW4tbW9kZScsIGNvbG9ycyA6IFsnd2hpdGUnLCAnaW52ZXJzZSddfTtcbmV4cG9ydCBjb25zdCB0ZXN0aW5nTW9kZVRhZ0NvbG9yID0ge21zZyA6ICd0ZXN0aW5nLW1vZGUnLCBjb2xvcnMgOiBbJ29yYW5nZScsICdpbnZlcnNlJ119O1xuXG5leHBvcnQgZnVuY3Rpb24gbG9nU2VuZChtZXNzYWdlLHBhcmFtKSB7XG4gICAgaWYoaXNEZWJ1ZygpKSB7Y29uc29sZS50aW1lKCkudGFnKHNlbmRNb2RlVGFnQ29sb3IpLmxvZyhtZXNzYWdlLHBhcmFtP3BhcmFtOicnKTt9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsb2dDb25maXJtKG1lc3NhZ2UscGFyYW0pIHtcbiAgICBpZihpc0RlYnVnKCkpIHtjb25zb2xlLnRpbWUoKS50YWcoY29uZmlybU1vZGVUYWdDb2xvcikubG9nKG1lc3NhZ2UsIHBhcmFtP3BhcmFtOicnKTt9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsb2dWZXJpZnkobWVzc2FnZSwgcGFyYW0pIHtcbiAgICBpZihpc0RlYnVnKCkpIHtjb25zb2xlLnRpbWUoKS50YWcodmVyaWZ5TW9kZVRhZ0NvbG9yKS5sb2cobWVzc2FnZSwgcGFyYW0/cGFyYW06JycpO31cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxvZ0Jsb2NrY2hhaW4obWVzc2FnZSwgcGFyYW0pIHtcbiAgICBpZihpc0RlYnVnKCkpe2NvbnNvbGUudGltZSgpLnRhZyhibG9ja2NoYWluTW9kZVRhZ0NvbG9yKS5sb2cobWVzc2FnZSwgcGFyYW0/cGFyYW06JycpO31cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxvZ01haW4obWVzc2FnZSwgcGFyYW0pIHtcbiAgICBpZihpc0RlYnVnKCkpe2NvbnNvbGUudGltZSgpLnRhZyhibG9ja2NoYWluTW9kZVRhZ0NvbG9yKS5sb2cobWVzc2FnZSwgcGFyYW0/cGFyYW06JycpO31cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxvZ0Vycm9yKG1lc3NhZ2UsIHBhcmFtKSB7XG4gICAgaWYoaXNEZWJ1ZygpKXtjb25zb2xlLnRpbWUoKS50YWcoYmxvY2tjaGFpbk1vZGVUYWdDb2xvcikuZXJyb3IobWVzc2FnZSwgcGFyYW0/cGFyYW06JycpO31cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRlc3RMb2dnaW5nKG1lc3NhZ2UsIHBhcmFtKSB7XG4gICAgaWYoaXNEZWJ1ZygpKXtjb25zb2xlLnRpbWUoKS50YWcodGVzdGluZ01vZGVUYWdDb2xvcikubG9nKG1lc3NhZ2UsIHBhcmFtP3BhcmFtOicnKTt9XG59IiwiaW1wb3J0ICcuLi8uLi9hcGkvbGFuZ3VhZ2VzL21ldGhvZHMuanMnO1xuaW1wb3J0ICcuLi8uLi9hcGkvZG9pY2hhaW4vbWV0aG9kcy5qcyc7XG5pbXBvcnQgJy4uLy4uL2FwaS9yZWNpcGllbnRzL3NlcnZlci9wdWJsaWNhdGlvbnMuanMnO1xuaW1wb3J0ICcuLi8uLi9hcGkvb3B0LWlucy9tZXRob2RzLmpzJztcbmltcG9ydCAnLi4vLi4vYXBpL3ZlcnNpb24vcHVibGljYXRpb25zLmpzJztcbmltcG9ydCAnLi4vLi4vYXBpL29wdC1pbnMvc2VydmVyL3B1YmxpY2F0aW9ucy5qcyc7XG5cbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IHsgRERQUmF0ZUxpbWl0ZXIgfSBmcm9tICdtZXRlb3IvZGRwLXJhdGUtbGltaXRlcic7XG5pbXBvcnQgeyBfIH0gZnJvbSAnbWV0ZW9yL3VuZGVyc2NvcmUnO1xuXG4vLyBEb24ndCBsZXQgcGVvcGxlIHdyaXRlIGFyYml0cmFyeSBkYXRhIHRvIHRoZWlyICdwcm9maWxlJyBmaWVsZCBmcm9tIHRoZSBjbGllbnRcbk1ldGVvci51c2Vycy5kZW55KHtcbiAgdXBkYXRlKCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9LFxufSk7XG5cbi8vIEdldCBhIGxpc3Qgb2YgYWxsIGFjY291bnRzIG1ldGhvZHMgYnkgcnVubmluZyBgTWV0ZW9yLnNlcnZlci5tZXRob2RfaGFuZGxlcnNgIGluIG1ldGVvciBzaGVsbFxuY29uc3QgQVVUSF9NRVRIT0RTID0gW1xuICAnbG9naW4nLFxuICAnbG9nb3V0JyxcbiAgJ2xvZ291dE90aGVyQ2xpZW50cycsXG4gICdnZXROZXdUb2tlbicsXG4gICdyZW1vdmVPdGhlclRva2VucycsXG4gICdjb25maWd1cmVMb2dpblNlcnZpY2UnLFxuICAnY2hhbmdlUGFzc3dvcmQnLFxuICAnZm9yZ290UGFzc3dvcmQnLFxuICAncmVzZXRQYXNzd29yZCcsXG4gICd2ZXJpZnlFbWFpbCcsXG4gICdjcmVhdGVVc2VyJyxcbiAgJ0FUUmVtb3ZlU2VydmljZScsXG4gICdBVENyZWF0ZVVzZXJTZXJ2ZXInLFxuICAnQVRSZXNlbmRWZXJpZmljYXRpb25FbWFpbCcsXG5dO1xuXG5pZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIC8vIE9ubHkgYWxsb3cgMiBsb2dpbiBhdHRlbXB0cyBwZXIgY29ubmVjdGlvbiBwZXIgNSBzZWNvbmRzXG4gIEREUFJhdGVMaW1pdGVyLmFkZFJ1bGUoe1xuICAgIG5hbWUobmFtZSkge1xuICAgICAgcmV0dXJuIF8uY29udGFpbnMoQVVUSF9NRVRIT0RTLCBuYW1lKTtcbiAgICB9LFxuXG4gICAgLy8gUmF0ZSBsaW1pdCBwZXIgY29ubmVjdGlvbiBJRFxuICAgIGNvbm5lY3Rpb25JZCgpIHsgcmV0dXJuIHRydWU7IH0sXG4gIH0sIDIsIDUwMDApO1xufVxuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5leHBvcnQgY29uc3QgU0VORF9BUFAgPSBcInNlbmRcIjtcbmV4cG9ydCBjb25zdCBDT05GSVJNX0FQUCA9IFwiY29uZmlybVwiO1xuZXhwb3J0IGNvbnN0IFZFUklGWV9BUFAgPSBcInZlcmlmeVwiO1xuZXhwb3J0IGZ1bmN0aW9uIGlzQXBwVHlwZSh0eXBlKSB7XG4gIGlmKE1ldGVvci5zZXR0aW5ncyA9PT0gdW5kZWZpbmVkIHx8IE1ldGVvci5zZXR0aW5ncy5hcHAgPT09IHVuZGVmaW5lZCkgdGhyb3cgXCJObyBzZXR0aW5ncyBmb3VuZCFcIlxuICBjb25zdCB0eXBlcyA9IE1ldGVvci5zZXR0aW5ncy5hcHAudHlwZXM7XG4gIGlmKHR5cGVzICE9PSB1bmRlZmluZWQpIHJldHVybiB0eXBlcy5pbmNsdWRlcyh0eXBlKTtcbiAgcmV0dXJuIGZhbHNlO1xufVxuIiwiaW1wb3J0IHsgQWNjb3VudHMgfSBmcm9tICdtZXRlb3IvYWNjb3VudHMtYmFzZSc7XG5BY2NvdW50cy5jb25maWcoe1xuICAgIHNlbmRWZXJpZmljYXRpb25FbWFpbDogdHJ1ZSxcbiAgICBmb3JiaWRDbGllbnRBY2NvdW50Q3JlYXRpb246IHRydWVcbn0pO1xuXG5cblxuQWNjb3VudHMuZW1haWxUZW1wbGF0ZXMuZnJvbT0nZG9pY2hhaW5AbGUtc3BhY2UuZGUnOyIsImltcG9ydCB7IEFwaSwgRE9JX1dBTExFVE5PVElGWV9ST1VURSwgRE9JX0NPTkZJUk1BVElPTl9ST1VURSB9IGZyb20gJy4uL3Jlc3QuanMnO1xuaW1wb3J0IGNvbmZpcm1PcHRJbiBmcm9tICcuLi8uLi8uLi8uLi9pbXBvcnRzL21vZHVsZXMvc2VydmVyL29wdC1pbnMvY29uZmlybS5qcydcbmltcG9ydCBjaGVja05ld1RyYW5zYWN0aW9uIGZyb20gXCIuLi8uLi8uLi8uLi9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2RvaWNoYWluL2NoZWNrX25ld190cmFuc2FjdGlvbnNcIjtcbmltcG9ydCB7bG9nQ29uZmlybX0gZnJvbSBcIi4uLy4uLy4uLy4uL2ltcG9ydHMvc3RhcnR1cC9zZXJ2ZXIvbG9nLWNvbmZpZ3VyYXRpb25cIjtcbi8vZG9rdSBvZiBtZXRlb3ItcmVzdGl2dXMgaHR0cHM6Ly9naXRodWIuY29tL2thaG1hbGkvbWV0ZW9yLXJlc3RpdnVzXG5BcGkuYWRkUm91dGUoRE9JX0NPTkZJUk1BVElPTl9ST1VURSsnLzpoYXNoJywge2F1dGhSZXF1aXJlZDogZmFsc2V9LCB7XG4gIGdldDoge1xuICAgIGFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBoYXNoID0gdGhpcy51cmxQYXJhbXMuaGFzaDtcbiAgICAgIHRyeSB7XG4gICAgICAgIGxldCBpcCA9IHRoaXMucmVxdWVzdC5oZWFkZXJzWyd4LWZvcndhcmRlZC1mb3InXSB8fFxuICAgICAgICAgIHRoaXMucmVxdWVzdC5jb25uZWN0aW9uLnJlbW90ZUFkZHJlc3MgfHxcbiAgICAgICAgICB0aGlzLnJlcXVlc3Quc29ja2V0LnJlbW90ZUFkZHJlc3MgfHxcbiAgICAgICAgICAodGhpcy5yZXF1ZXN0LmNvbm5lY3Rpb24uc29ja2V0ID8gdGhpcy5yZXF1ZXN0LmNvbm5lY3Rpb24uc29ja2V0LnJlbW90ZUFkZHJlc3M6IG51bGwpO1xuXG4gICAgICAgICAgaWYoaXAuaW5kZXhPZignLCcpIT0tMSlpcD1pcC5zdWJzdHJpbmcoMCxpcC5pbmRleE9mKCcsJykpO1xuXG4gICAgICAgICAgbG9nQ29uZmlybSgnUkVTVCBvcHQtaW4vY29uZmlybSA6Jyx7aGFzaDpoYXNoLCBob3N0OmlwfSk7XG4gICAgICAgICAgY29uc3QgcmVkaXJlY3QgPSBjb25maXJtT3B0SW4oe2hvc3Q6IGlwLCBoYXNoOiBoYXNofSk7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBzdGF0dXNDb2RlOiAzMDMsXG4gICAgICAgICAgaGVhZGVyczogeydDb250ZW50LVR5cGUnOiAndGV4dC9wbGFpbicsICdMb2NhdGlvbic6IHJlZGlyZWN0fSxcbiAgICAgICAgICBib2R5OiAnTG9jYXRpb246ICcrcmVkaXJlY3RcbiAgICAgICAgfTtcbiAgICAgIH0gY2F0Y2goZXJyb3IpIHtcbiAgICAgICAgcmV0dXJuIHtzdGF0dXNDb2RlOiA1MDAsIGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogZXJyb3IubWVzc2FnZX19O1xuICAgICAgfVxuICAgIH1cbiAgfVxufSk7XG5cbkFwaS5hZGRSb3V0ZShET0lfV0FMTEVUTk9USUZZX1JPVVRFLCB7XG4gICAgZ2V0OiB7XG4gICAgICAgIGF1dGhSZXF1aXJlZDogZmFsc2UsXG4gICAgICAgIGFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjb25zdCBwYXJhbXMgPSB0aGlzLnF1ZXJ5UGFyYW1zO1xuICAgICAgICAgICAgY29uc3QgdHhpZCA9IHBhcmFtcy50eDtcblxuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBjaGVja05ld1RyYW5zYWN0aW9uKHR4aWQpO1xuICAgICAgICAgICAgICAgIHJldHVybiB7c3RhdHVzOiAnc3VjY2VzcycsICBkYXRhOid0eGlkOicrdHhpZCsnIHdhcyByZWFkIGZyb20gYmxvY2tjaGFpbid9O1xuICAgICAgICAgICAgfSBjYXRjaChlcnJvcikge1xuICAgICAgICAgICAgICAgIHJldHVybiB7c3RhdHVzOiAnZmFpbCcsIGVycm9yOiBlcnJvci5tZXNzYWdlfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn0pO1xuIiwiaW1wb3J0IHsgQXBpIH0gZnJvbSAnLi4vcmVzdC5qcyc7XG5BcGkuYWRkUm91dGUoJ2RlYnVnL21haWwnLCB7YXV0aFJlcXVpcmVkOiBmYWxzZX0sIHtcbiAgZ2V0OiB7XG4gICAgYWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IGRhdGEgPSB7XG4gICAgICAgIFwiZnJvbVwiOiBcIm5vcmVwbHlAZG9pY2hhaW4ub3JnXCIsXG4gICAgICAgIFwic3ViamVjdFwiOiBcIkRvaWNoYWluLm9yZyBOZXdzbGV0dGVyIEJlc3TDpHRpZ3VuZ1wiLFxuICAgICAgICBcInJlZGlyZWN0XCI6IFwiaHR0cHM6Ly93d3cuZG9pY2hhaW4ub3JnL3ZpZWxlbi1kYW5rL1wiLFxuICAgICAgICBcInJldHVyblBhdGhcIjogXCJub3JlcGx5QGRvaWNoYWluLm9yZ1wiLFxuICAgICAgICBcImNvbnRlbnRcIjpcIjxzdHlsZSB0eXBlPSd0ZXh0L2NzcycgbWVkaWE9J3NjcmVlbic+XFxuXCIgK1xuICAgICAgICAgICAgXCIqIHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGxpbmUtaGVpZ2h0OiBpbmhlcml0O1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwiLkV4dGVybmFsQ2xhc3MgKiB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRsaW5lLWhlaWdodDogMTAwJTtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcImJvZHksIHAge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0bWFyZ2luOiAwO1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0cGFkZGluZzogMDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdG1hcmdpbi1ib3R0b206IDA7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHQtd2Via2l0LXRleHQtc2l6ZS1hZGp1c3Q6IG5vbmU7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHQtbXMtdGV4dC1zaXplLWFkanVzdDogbm9uZTtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcImltZyB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRsaW5lLWhlaWdodDogMTAwJTtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdG91dGxpbmU6IG5vbmU7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHR0ZXh0LWRlY29yYXRpb246IG5vbmU7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHQtbXMtaW50ZXJwb2xhdGlvbi1tb2RlOiBiaWN1YmljO1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwiYSBpbWcge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0Ym9yZGVyOiBub25lO1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwiI2JhY2tncm91bmRUYWJsZSB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRtYXJnaW46IDA7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRwYWRkaW5nOiAwO1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0d2lkdGg6IDEwMCUgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcImEsIGE6bGluaywgLm5vLWRldGVjdC1sb2NhbCBhLCAuYXBwbGVMaW5rcyBhIHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGNvbG9yOiAjNTU1NWZmICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHR0ZXh0LWRlY29yYXRpb246IHVuZGVybGluZTtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcIi5FeHRlcm5hbENsYXNzIHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGRpc3BsYXk6IGJsb2NrICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHR3aWR0aDogMTAwJTtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcIi5FeHRlcm5hbENsYXNzLCAuRXh0ZXJuYWxDbGFzcyBwLCAuRXh0ZXJuYWxDbGFzcyBzcGFuLCAuRXh0ZXJuYWxDbGFzcyBmb250LCAuRXh0ZXJuYWxDbGFzcyB0ZCwgLkV4dGVybmFsQ2xhc3MgZGl2IHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGxpbmUtaGVpZ2h0OiBpbmhlcml0O1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwidGFibGUgdGQge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0Ym9yZGVyLWNvbGxhcHNlOiBjb2xsYXBzZTtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdG1zby10YWJsZS1sc3BhY2U6IDBwdDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdG1zby10YWJsZS1yc3BhY2U6IDBwdDtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcInN1cCB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRwb3NpdGlvbjogcmVsYXRpdmU7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHR0b3A6IDRweDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGxpbmUtaGVpZ2h0OiA3cHggIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGZvbnQtc2l6ZTogMTFweCAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwiLm1vYmlsZV9saW5rIGFbaHJlZl49J3RlbCddLCAubW9iaWxlX2xpbmsgYVtocmVmXj0nc21zJ10ge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0dGV4dC1kZWNvcmF0aW9uOiBkZWZhdWx0O1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0Y29sb3I6ICM1NTU1ZmYgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdHBvaW50ZXItZXZlbnRzOiBhdXRvO1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0Y3Vyc29yOiBkZWZhdWx0O1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwiLm5vLWRldGVjdCBhIHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdHRleHQtZGVjb3JhdGlvbjogbm9uZTtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGNvbG9yOiAjNTU1NWZmO1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0cG9pbnRlci1ldmVudHM6IGF1dG87XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRjdXJzb3I6IGRlZmF1bHQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCJ7XFxuXCIgK1xuICAgICAgICAgICAgXCJjb2xvcjogIzU1NTVmZjtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcInNwYW4ge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0Y29sb3I6IGluaGVyaXQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRib3JkZXItYm90dG9tOiBub25lO1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwic3Bhbjpob3ZlciB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcIi5ub3VuZGVybGluZSB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHR0ZXh0LWRlY29yYXRpb246IG5vbmUgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcImgxLCBoMiwgaDMge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0bWFyZ2luOiAwO1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0cGFkZGluZzogMDtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcInAge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0TWFyZ2luOiAwcHggIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcInRhYmxlW2NsYXNzPSdlbWFpbC1yb290LXdyYXBwZXInXSB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHR3aWR0aDogNjAwcHggIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcImJvZHkge1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwiYm9keSB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRtaW4td2lkdGg6IDI4MHB4O1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0d2lkdGg6IDEwMCU7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCJ0ZFtjbGFzcz0ncGF0dGVybiddIC5jMTEycDIwciB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHR3aWR0aDogMjAlO1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwidGRbY2xhc3M9J3BhdHRlcm4nXSAuYzMzNnA2MHIge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0d2lkdGg6IDYwLjAwMDAwMDAwMDAwMDI1NiU7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCI8L3N0eWxlPlxcblwiICtcbiAgICAgICAgICAgIFwiPHN0eWxlPlxcblwiICtcbiAgICAgICAgICAgIFwiQG1lZGlhIG9ubHkgc2NyZWVuIGFuZCAobWF4LXdpZHRoOiA1OTlweCksIG9ubHkgc2NyZWVuIGFuZCAobWF4LWRldmljZS13aWR0aDogNTk5cHgpLCBvbmx5IHNjcmVlbiBhbmQgKG1heC13aWR0aDogNDAwcHgpLCBvbmx5IHNjcmVlbiBhbmQgKG1heC1kZXZpY2Utd2lkdGg6IDQwMHB4KSB7XFxuXCIgK1xuICAgICAgICAgICAgXCIuZW1haWwtcm9vdC13cmFwcGVyIHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdHdpZHRoOiAxMDAlICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCIuZnVsbC13aWR0aCB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHR3aWR0aDogMTAwJSAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0aGVpZ2h0OiBhdXRvICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHR0ZXh0LWFsaWduOiBjZW50ZXI7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCIuZnVsbHdpZHRoaGFsZmxlZnQge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0d2lkdGg6IDEwMCUgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcIi5mdWxsd2lkdGhoYWxmcmlnaHQge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0d2lkdGg6IDEwMCUgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcIi5mdWxsd2lkdGhoYWxmaW5uZXIge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0d2lkdGg6IDEwMCUgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdG1hcmdpbjogMCBhdXRvICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRmbG9hdDogbm9uZSAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0bWFyZ2luLWxlZnQ6IGF1dG8gIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdG1hcmdpbi1yaWdodDogYXV0byAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0Y2xlYXI6IGJvdGggIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcIi5oaWRlIHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGRpc3BsYXk6IG5vbmUgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdHdpZHRoOiAwcHggIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGhlaWdodDogMHB4ICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRvdmVyZmxvdzogaGlkZGVuO1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwiLmRlc2t0b3AtaGlkZSB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRkaXNwbGF5OiBibG9jayAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0d2lkdGg6IDEwMCUgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGhlaWdodDogYXV0byAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0b3ZlcmZsb3c6IGhpZGRlbjtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdG1heC1oZWlnaHQ6IGluaGVyaXQgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcIi5jMTEycDIwciB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHR3aWR0aDogMTAwJSAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0ZmxvYXQ6IG5vbmU7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCIuYzMzNnA2MHIge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0d2lkdGg6IDEwMCUgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGZsb2F0OiBub25lO1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwiPC9zdHlsZT5cXG5cIiArXG4gICAgICAgICAgICBcIjxzdHlsZT5cXG5cIiArXG4gICAgICAgICAgICBcIkBtZWRpYSBvbmx5IHNjcmVlbiBhbmQgKG1pbi13aWR0aDogNjAwcHgpIHtcXG5cIiArXG4gICAgICAgICAgICBcInRkW2NsYXNzPSdwYXR0ZXJuJ10gLmMxMTJwMjByIHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdHdpZHRoOiAxMTJweCAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwidGRbY2xhc3M9J3BhdHRlcm4nXSAuYzMzNnA2MHIge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0d2lkdGg6IDMzNnB4ICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCJcXG5cIiArXG4gICAgICAgICAgICBcIkBtZWRpYSBvbmx5IHNjcmVlbiBhbmQgKG1heC13aWR0aDogNTk5cHgpLCBvbmx5IHNjcmVlbiBhbmQgKG1heC1kZXZpY2Utd2lkdGg6IDU5OXB4KSwgb25seSBzY3JlZW4gYW5kIChtYXgtd2lkdGg6IDQwMHB4KSwgb25seSBzY3JlZW4gYW5kIChtYXgtZGV2aWNlLXdpZHRoOiA0MDBweCkge1xcblwiICtcbiAgICAgICAgICAgIFwidGFibGVbY2xhc3M9J2VtYWlsLXJvb3Qtd3JhcHBlciddIHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdHdpZHRoOiAxMDAlICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCJ0ZFtjbGFzcz0nd3JhcCddIC5mdWxsLXdpZHRoIHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdHdpZHRoOiAxMDAlICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRoZWlnaHQ6IGF1dG8gIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcInRkW2NsYXNzPSd3cmFwJ10gLmZ1bGx3aWR0aGhhbGZsZWZ0IHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdHdpZHRoOiAxMDAlICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCJ0ZFtjbGFzcz0nd3JhcCddIC5mdWxsd2lkdGhoYWxmcmlnaHQge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0d2lkdGg6IDEwMCUgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcInRkW2NsYXNzPSd3cmFwJ10gLmZ1bGx3aWR0aGhhbGZpbm5lciB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHR3aWR0aDogMTAwJSAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0bWFyZ2luOiAwIGF1dG8gIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGZsb2F0OiBub25lICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRtYXJnaW4tbGVmdDogYXV0byAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0bWFyZ2luLXJpZ2h0OiBhdXRvICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRjbGVhcjogYm90aCAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwidGRbY2xhc3M9J3dyYXAnXSAuaGlkZSB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRkaXNwbGF5OiBub25lICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHR3aWR0aDogMHB4O1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0aGVpZ2h0OiAwcHg7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRvdmVyZmxvdzogaGlkZGVuO1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwidGRbY2xhc3M9J3BhdHRlcm4nXSAuYzExMnAyMHIge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0d2lkdGg6IDEwMCUgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcInRkW2NsYXNzPSdwYXR0ZXJuJ10gLmMzMzZwNjByIHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdHdpZHRoOiAxMDAlICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCJcXG5cIiArXG4gICAgICAgICAgICBcIkBtZWRpYSB5YWhvbyB7XFxuXCIgK1xuICAgICAgICAgICAgXCJ0YWJsZSB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRmbG9hdDogbm9uZSAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0aGVpZ2h0OiBhdXRvO1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwidGFibGVbYWxpZ249J2xlZnQnXSB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRmbG9hdDogbGVmdCAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwidGRbYWxpZ249J2xlZnQnXSB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRmbG9hdDogbGVmdCAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0aGVpZ2h0OiBhdXRvO1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwidGFibGVbYWxpZ249J2NlbnRlciddIHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdG1hcmdpbjogMCBhdXRvO1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwidGRbYWxpZ249J2NlbnRlciddIHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdG1hcmdpbjogMCBhdXRvO1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0aGVpZ2h0OiBhdXRvO1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwidGFibGVbYWxpZ249J3JpZ2h0J10ge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0ZmxvYXQ6IHJpZ2h0ICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCJ0ZFthbGlnbj0ncmlnaHQnXSB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRmbG9hdDogcmlnaHQgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGhlaWdodDogYXV0bztcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcIjwvc3R5bGU+XFxuXCIgK1xuICAgICAgICAgICAgXCJcXG5cIiArXG4gICAgICAgICAgICBcIjwhLS1baWYgKGd0ZSBJRSA3KSAmICh2bWwpXT5cXG5cIiArXG4gICAgICAgICAgICBcIjxzdHlsZSB0eXBlPSd0ZXh0L2Nzcyc+XFxuXCIgK1xuICAgICAgICAgICAgXCJodG1sLCBib2R5IHttYXJnaW46MCAhaW1wb3J0YW50OyBwYWRkaW5nOjBweCAhaW1wb3J0YW50O31cXG5cIiArXG4gICAgICAgICAgICBcImltZy5mdWxsLXdpZHRoIHsgcG9zaXRpb246IHJlbGF0aXZlICFpbXBvcnRhbnQ7IH1cXG5cIiArXG4gICAgICAgICAgICBcIlxcblwiICtcbiAgICAgICAgICAgIFwiLmltZzI0MHgzMCB7IHdpZHRoOiAyNDBweCAhaW1wb3J0YW50OyBoZWlnaHQ6IDMwcHggIWltcG9ydGFudDt9XFxuXCIgK1xuICAgICAgICAgICAgXCIuaW1nMjB4MjAgeyB3aWR0aDogMjBweCAhaW1wb3J0YW50OyBoZWlnaHQ6IDIwcHggIWltcG9ydGFudDt9XFxuXCIgK1xuICAgICAgICAgICAgXCJcXG5cIiArXG4gICAgICAgICAgICBcIjwvc3R5bGU+XFxuXCIgK1xuICAgICAgICAgICAgXCI8IVtlbmRpZl0tLT5cXG5cIiArXG4gICAgICAgICAgICBcIlxcblwiICtcbiAgICAgICAgICAgIFwiPCEtLVtpZiBndGUgbXNvIDldPlxcblwiICtcbiAgICAgICAgICAgIFwiPHN0eWxlIHR5cGU9J3RleHQvY3NzJz5cXG5cIiArXG4gICAgICAgICAgICBcIi5tc28tZm9udC1maXgtYXJpYWwgeyBmb250LWZhbWlseTogQXJpYWwsIHNhbnMtc2VyaWY7fVxcblwiICtcbiAgICAgICAgICAgIFwiLm1zby1mb250LWZpeC1nZW9yZ2lhIHsgZm9udC1mYW1pbHk6IEdlb3JnaWEsIHNhbnMtc2VyaWY7fVxcblwiICtcbiAgICAgICAgICAgIFwiLm1zby1mb250LWZpeC10YWhvbWEgeyBmb250LWZhbWlseTogVGFob21hLCBzYW5zLXNlcmlmO31cXG5cIiArXG4gICAgICAgICAgICBcIi5tc28tZm9udC1maXgtdGltZXNfbmV3X3JvbWFuIHsgZm9udC1mYW1pbHk6ICdUaW1lcyBOZXcgUm9tYW4nLCBzYW5zLXNlcmlmO31cXG5cIiArXG4gICAgICAgICAgICBcIi5tc28tZm9udC1maXgtdHJlYnVjaGV0X21zIHsgZm9udC1mYW1pbHk6ICdUcmVidWNoZXQgTVMnLCBzYW5zLXNlcmlmO31cXG5cIiArXG4gICAgICAgICAgICBcIi5tc28tZm9udC1maXgtdmVyZGFuYSB7IGZvbnQtZmFtaWx5OiBWZXJkYW5hLCBzYW5zLXNlcmlmO31cXG5cIiArXG4gICAgICAgICAgICBcIjwvc3R5bGU+XFxuXCIgK1xuICAgICAgICAgICAgXCI8IVtlbmRpZl0tLT5cXG5cIiArXG4gICAgICAgICAgICBcIlxcblwiICtcbiAgICAgICAgICAgIFwiPCEtLVtpZiBndGUgbXNvIDldPlxcblwiICtcbiAgICAgICAgICAgIFwiPHN0eWxlIHR5cGU9J3RleHQvY3NzJz5cXG5cIiArXG4gICAgICAgICAgICBcInRhYmxlLCB0ZCB7XFxuXCIgK1xuICAgICAgICAgICAgXCJib3JkZXItY29sbGFwc2U6IGNvbGxhcHNlICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJtc28tdGFibGUtbHNwYWNlOiAwcHggIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIm1zby10YWJsZS1yc3BhY2U6IDBweCAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwiXFxuXCIgK1xuICAgICAgICAgICAgXCIuZW1haWwtcm9vdC13cmFwcGVyIHsgd2lkdGggNjAwcHggIWltcG9ydGFudDt9XFxuXCIgK1xuICAgICAgICAgICAgXCIuaW1nbGluayB7IGZvbnQtc2l6ZTogMHB4OyB9XFxuXCIgK1xuICAgICAgICAgICAgXCIuZWRtX2J1dHRvbiB7IGZvbnQtc2l6ZTogMHB4OyB9XFxuXCIgK1xuICAgICAgICAgICAgXCI8L3N0eWxlPlxcblwiICtcbiAgICAgICAgICAgIFwiPCFbZW5kaWZdLS0+XFxuXCIgK1xuICAgICAgICAgICAgXCJcXG5cIiArXG4gICAgICAgICAgICBcIjwhLS1baWYgZ3RlIG1zbyAxNV0+XFxuXCIgK1xuICAgICAgICAgICAgXCI8c3R5bGUgdHlwZT0ndGV4dC9jc3MnPlxcblwiICtcbiAgICAgICAgICAgIFwidGFibGUge1xcblwiICtcbiAgICAgICAgICAgIFwiZm9udC1zaXplOjBweDtcXG5cIiArXG4gICAgICAgICAgICBcIm1zby1tYXJnaW4tdG9wLWFsdDowcHg7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCJcXG5cIiArXG4gICAgICAgICAgICBcIi5mdWxsd2lkdGhoYWxmbGVmdCB7XFxuXCIgK1xuICAgICAgICAgICAgXCJ3aWR0aDogNDklICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJmbG9hdDpsZWZ0ICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCJcXG5cIiArXG4gICAgICAgICAgICBcIi5mdWxsd2lkdGhoYWxmcmlnaHQge1xcblwiICtcbiAgICAgICAgICAgIFwid2lkdGg6IDUwJSAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwiZmxvYXQ6cmlnaHQgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcIjwvc3R5bGU+XFxuXCIgK1xuICAgICAgICAgICAgXCI8IVtlbmRpZl0tLT5cXG5cIiArXG4gICAgICAgICAgICBcIjxzdHlsZSB0eXBlPSd0ZXh0L2NzcycgbWVkaWE9Jyhwb2ludGVyKSBhbmQgKG1pbi1jb2xvci1pbmRleDowKSc+XFxuXCIgK1xuICAgICAgICAgICAgXCJodG1sLCBib2R5IHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGJhY2tncm91bmQtaW1hZ2U6IG5vbmUgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGJhY2tncm91bmQtY29sb3I6ICNlYmViZWIgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdG1hcmdpbjogMCAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0cGFkZGluZzogMCAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwiPC9zdHlsZT5cXG5cIiArXG4gICAgICAgICAgICBcIjwvaGVhZD5cXG5cIiArXG4gICAgICAgICAgICBcIjxib2R5IGxlZnRtYXJnaW49JzAnIG1hcmdpbndpZHRoPScwJyB0b3BtYXJnaW49JzAnIG1hcmdpbmhlaWdodD0nMCcgb2Zmc2V0PScwJyBiYWNrZ3JvdW5kPVxcXCJcXFwiIGJnY29sb3I9JyNlYmViZWInIHN0eWxlPSdmb250LWZhbWlseTpBcmlhbCwgc2Fucy1zZXJpZjsgZm9udC1zaXplOjBweDttYXJnaW46MDtwYWRkaW5nOjA7ICc+XFxuXCIgK1xuICAgICAgICAgICAgXCI8IS0tW2lmIHRdPjwhW2VuZGlmXS0tPjwhLS1baWYgdF0+PCFbZW5kaWZdLS0+PCEtLVtpZiB0XT48IVtlbmRpZl0tLT48IS0tW2lmIHRdPjwhW2VuZGlmXS0tPjwhLS1baWYgdF0+PCFbZW5kaWZdLS0+PCEtLVtpZiB0XT48IVtlbmRpZl0tLT5cXG5cIiArXG4gICAgICAgICAgICBcIjx0YWJsZSBhbGlnbj0nY2VudGVyJyBib3JkZXI9JzAnIGNlbGxwYWRkaW5nPScwJyBjZWxsc3BhY2luZz0nMCcgYmFja2dyb3VuZD1cXFwiXFxcIiAgaGVpZ2h0PScxMDAlJyB3aWR0aD0nMTAwJScgaWQ9J2JhY2tncm91bmRUYWJsZSc+XFxuXCIgK1xuICAgICAgICAgICAgXCIgIDx0cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICA8dGQgY2xhc3M9J3dyYXAnIGFsaWduPSdjZW50ZXInIHZhbGlnbj0ndG9wJyB3aWR0aD0nMTAwJSc+XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRcXHQ8Y2VudGVyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICA8IS0tIGNvbnRlbnQgLS0+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgIFxcdDxkaXYgc3R5bGU9J3BhZGRpbmc6IDBweDsnPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICBcXHQgIDx0YWJsZSBjZWxscGFkZGluZz0nMCcgY2VsbHNwYWNpbmc9JzAnIGJvcmRlcj0nMCcgd2lkdGg9JzEwMCUnIGJnY29sb3I9JyNlYmViZWInPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICBcXHRcXHQgPHRyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgXFx0XFx0ICA8dGQgdmFsaWduPSd0b3AnIHN0eWxlPSdwYWRkaW5nOiAwcHg7Jz5cXG5cIiArXG4gICAgICAgICAgICBcIlxcdFxcdFxcdFxcdFxcdFxcdCAgPHRhYmxlIGNlbGxwYWRkaW5nPScwJyBjZWxsc3BhY2luZz0nMCcgd2lkdGg9JzYwMCcgYWxpZ249J2NlbnRlcicgc3R5bGU9J21heC13aWR0aDogNjAwcHg7bWluLXdpZHRoOiAyNDBweDttYXJnaW46IDAgYXV0bzsnIGNsYXNzPSdlbWFpbC1yb290LXdyYXBwZXInPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICBcXHRcXHQgXFx0XFx0PHRyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgIFxcdFxcdFxcdFxcdFxcdCA8dGQgdmFsaWduPSd0b3AnIHN0eWxlPSdwYWRkaW5nOiAwcHg7Jz5cXG5cIiArXG4gICAgICAgICAgICBcIlxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdCBcXHRcXHQ8dGFibGUgY2VsbHBhZGRpbmc9JzAnIGNlbGxzcGFjaW5nPScwJyBib3JkZXI9JzAnIHdpZHRoPScxMDAlJyBiZ2NvbG9yPScjRkZGRkZGJyBzdHlsZT0nYm9yZGVyOiAwcHggbm9uZTtiYWNrZ3JvdW5kLWNvbG9yOiAjRkZGRkZGOyc+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgIFxcdFxcdFxcdFxcdFxcdFxcdCA8dHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgIFxcdFxcdFxcdCAgXFx0XFx0XFx0XFx0IDx0ZCB2YWxpZ249J3RvcCcgc3R5bGU9J3BhZGRpbmctdG9wOiAzMHB4O3BhZGRpbmctcmlnaHQ6IDIwcHg7cGFkZGluZy1ib3R0b206IDM1cHg7cGFkZGluZy1sZWZ0OiAyMHB4Oyc+XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHQgICBcXHRcXHRcXHRcXHRcXG5cIiArXG4gICAgICAgICAgICBcIlxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdDx0YWJsZSBjZWxscGFkZGluZz0nMCdcXG5cIiArXG4gICAgICAgICAgICBcIlxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdGNlbGxzcGFjaW5nPScwJyBib3JkZXI9JzAnIGFsaWduPSdjZW50ZXInIHdpZHRoPScyNDAnICBzdHlsZT0nYm9yZGVyOiAwcHggbm9uZTtoZWlnaHQ6IGF1dG87JyBjbGFzcz0nZnVsbC13aWR0aCc+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxcdCBcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHQ8dHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdDx0ZCB2YWxpZ249J3RvcCcgc3R5bGU9J3BhZGRpbmc6IDBweDsnPjxpbWcgc3JjPSdodHRwczovL3NmMjYuc2VuZHNmeC5jb20vYWRtaW4vdGVtcC91c2VyLzE3L2RvaWNoYWluXzEwMGgucG5nJyB3aWR0aD0nMjQwJyBoZWlnaHQ9JzMwJyBhbHQ9XFxcIlxcXCIgYm9yZGVyPScwJyBzdHlsZT0nZGlzcGxheTogYmxvY2s7d2lkdGg6IDEwMCU7aGVpZ2h0OiBhdXRvOycgY2xhc3M9J2Z1bGwtd2lkdGggaW1nMjQweDMwJyAvPjwvdGQ+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxcdCBcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHQ8L3RyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdDwvdGFibGU+XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXG5cIiArXG4gICAgICAgICAgICBcIlxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdDwvdGQ+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgXFx0XFx0ICBcXHRcXHRcXHRcXHQ8L3RyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgIFxcdFxcdFxcdFxcdFxcdDwvdGFibGU+XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHQgXFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRcXHRcXHRcXHRcXHRcXHRcXHRcXHQgXFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgPHRhYmxlIGNlbGxwYWRkaW5nPScwJyBjZWxsc3BhY2luZz0nMCcgYm9yZGVyPScwJyB3aWR0aD0nMTAwJScgYmdjb2xvcj0nIzAwNzFhYScgc3R5bGU9J2JvcmRlcjogMHB4IG5vbmU7YmFja2dyb3VuZC1jb2xvcjogIzAwNzFhYTtiYWNrZ3JvdW5kLWltYWdlOiB1cmwoJ2h0dHBzOi8vc2YyNi5zZW5kc2Z4LmNvbS9hZG1pbi90ZW1wL3VzZXIvMTcvYmx1ZS1iZy5qcGcnKTtiYWNrZ3JvdW5kLXJlcGVhdDogbm8tcmVwZWF0IDtiYWNrZ3JvdW5kLXBvc2l0aW9uOiBjZW50ZXI7Jz5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIHZhbGlnbj0ndG9wJyBzdHlsZT0ncGFkZGluZy10b3A6IDQwcHg7cGFkZGluZy1yaWdodDogMjBweDtwYWRkaW5nLWJvdHRvbTogNDVweDtwYWRkaW5nLWxlZnQ6IDIwcHg7Jz48dGFibGUgY2VsbHBhZGRpbmc9JzAnIGNlbGxzcGFjaW5nPScwJyB3aWR0aD0nMTAwJSc+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBzdHlsZT0ncGFkZGluZzogMHB4OycgY2xhc3M9J3BhdHRlcm4nPjx0YWJsZSBjZWxscGFkZGluZz0nMCcgY2VsbHNwYWNpbmc9JzAnIGJvcmRlcj0nMCcgd2lkdGg9JzEwMCUnPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgdmFsaWduPSd0b3AnIHN0eWxlPSdwYWRkaW5nLWJvdHRvbTogMTBweDsnPjxkaXYgc3R5bGU9J3RleHQtYWxpZ246IGxlZnQ7Zm9udC1mYW1pbHk6IGFyaWFsO2ZvbnQtc2l6ZTogMjBweDtjb2xvcjogI2ZmZmZmZjtsaW5lLWhlaWdodDogMzBweDttc28tbGluZS1oZWlnaHQ6IGV4YWN0bHk7bXNvLXRleHQtcmFpc2U6IDVweDsnPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHBcXG5cIiArXG4gICAgICAgICAgICBcInN0eWxlPSdwYWRkaW5nOiAwOyBtYXJnaW46IDA7dGV4dC1hbGlnbjogY2VudGVyOyc+Qml0dGUgYmVzdMOkdGlnZW4gU2llIElocmUgQW5tZWxkdW5nPC9wPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PjwvdGQ+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGFibGU+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRhYmxlIGNlbGxwYWRkaW5nPScwJyBjZWxsc3BhY2luZz0nMCcgYm9yZGVyPScwJyB3aWR0aD0nMTAwJSc+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCB2YWxpZ249J3RvcCcgc3R5bGU9J3BhZGRpbmc6IDA7bXNvLWNlbGxzcGFjaW5nOiAwaW47Jz48dGFibGUgY2VsbHBhZGRpbmc9JzAnIGNlbGxzcGFjaW5nPScwJyBib3JkZXI9JzAnIGFsaWduPSdsZWZ0JyB3aWR0aD0nMTEyJyAgc3R5bGU9J2Zsb2F0OiBsZWZ0OycgY2xhc3M9J2MxMTJwMjByJz5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIHZhbGlnbj0ndG9wJyBzdHlsZT0ncGFkZGluZzogMHB4Oyc+PHRhYmxlIGNlbGxwYWRkaW5nPScwJyBjZWxsc3BhY2luZz0nMCcgYm9yZGVyPScwJyB3aWR0aD0nMTAwJScgc3R5bGU9J2JvcmRlcjogMHB4IG5vbmU7JyBjbGFzcz0naGlkZSc+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCB2YWxpZ249J3RvcCcgc3R5bGU9J3BhZGRpbmc6IDBweDsnPjx0YWJsZSBjZWxscGFkZGluZz0nMCcgY2VsbHNwYWNpbmc9JzAnIHdpZHRoPScxMDAlJz5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIHN0eWxlPSdwYWRkaW5nOiAwcHg7Jz48dGFibGUgY2VsbHBhZGRpbmc9JzAnIGNlbGxzcGFjaW5nPScwJyB3aWR0aD0nMTAwJSc+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBhbGlnbj0nY2VudGVyJyBzdHlsZT0ncGFkZGluZzogMHB4Oyc+PHRhYmxlIGNlbGxwYWRkaW5nPScwJyBjZWxsc3BhY2luZz0nMCcgYm9yZGVyPScwJyBhbGlnbj0nY2VudGVyJyB3aWR0aD0nMjAnICBzdHlsZT0nYm9yZGVyOiAwcHggbm9uZTtoZWlnaHQ6IGF1dG87Jz5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIHZhbGlnbj0ndG9wJyBzdHlsZT0ncGFkZGluZzogMHB4Oyc+PGltZ1xcblwiICtcbiAgICAgICAgICAgIFwic3JjPSdodHRwczovL3NmMjYuc2VuZHNmeC5jb20vYWRtaW4vdGVtcC91c2VyLzE3L2ltZ184OTgzNzMxOC5wbmcnIHdpZHRoPScyMCcgaGVpZ2h0PScyMCcgYWx0PVxcXCJcXFwiIGJvcmRlcj0nMCcgc3R5bGU9J2Rpc3BsYXk6IGJsb2NrOycgY2xhc3M9J2ltZzIweDIwJyAvPjwvdGQ+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGFibGU+PC90ZD5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90YWJsZT48L3RkPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RhYmxlPjwvdGQ+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGFibGU+PC90ZD5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90YWJsZT5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8IS0tW2lmIGd0ZSBtc28gOV0+PC90ZD48dGQgdmFsaWduPSd0b3AnIHN0eWxlPSdwYWRkaW5nOjA7Jz48IVtlbmRpZl0tLT5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGFibGUgY2VsbHBhZGRpbmc9JzAnIGNlbGxzcGFjaW5nPScwJyBib3JkZXI9JzAnIGFsaWduPSdsZWZ0JyB3aWR0aD0nMzM2JyAgc3R5bGU9J2Zsb2F0OiBsZWZ0OycgY2xhc3M9J2MzMzZwNjByJz5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIHZhbGlnbj0ndG9wJyBzdHlsZT0ncGFkZGluZzogMHB4Oyc+PHRhYmxlIGNlbGxwYWRkaW5nPScwJyBjZWxsc3BhY2luZz0nMCcgYm9yZGVyPScwJyB3aWR0aD0nMTAwJSc+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCB2YWxpZ249J3RvcCcgc3R5bGU9J3BhZGRpbmctYm90dG9tOiAzMHB4Oyc+PHRhYmxlIGNlbGxwYWRkaW5nPScwJyBjZWxsc3BhY2luZz0nMCcgd2lkdGg9JzEwMCUnPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgc3R5bGU9J3BhZGRpbmc6IDBweDsnPjx0YWJsZSBjZWxscGFkZGluZz0nMCcgY2VsbHNwYWNpbmc9JzAnIGJvcmRlcj0nMCcgd2lkdGg9JzEwMCUnIHN0eWxlPSdib3JkZXItdG9wOiAycHggc29saWQgI2ZmZmZmZjsnPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgdmFsaWduPSd0b3AnPjx0YWJsZSBjZWxscGFkZGluZz0nMCcgY2VsbHNwYWNpbmc9JzAnIHdpZHRoPScxMDAlJz5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIHN0eWxlPSdwYWRkaW5nOiAwcHg7Jz48L3RkPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RhYmxlPjwvdGQ+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGFibGU+PC90ZD5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90YWJsZT48L3RkPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RhYmxlPjwvdGQ+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGFibGU+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPCEtLVtpZiBndGUgbXNvIDldPjwvdGQ+PHRkIHZhbGlnbj0ndG9wJyBzdHlsZT0ncGFkZGluZzowOyc+PCFbZW5kaWZdLS0+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRhYmxlIGNlbGxwYWRkaW5nPScwJyBjZWxsc3BhY2luZz0nMCcgYm9yZGVyPScwJyBhbGlnbj0nbGVmdCcgd2lkdGg9JzExMicgIHN0eWxlPSdmbG9hdDogbGVmdDsnIGNsYXNzPSdjMTEycDIwcic+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCB2YWxpZ249J3RvcCcgc3R5bGU9J3BhZGRpbmc6IDBweDsnPjx0YWJsZSBjZWxscGFkZGluZz0nMCcgY2VsbHNwYWNpbmc9JzAnIGJvcmRlcj0nMCcgd2lkdGg9JzEwMCUnIHN0eWxlPSdib3JkZXI6IDBweCBub25lOycgY2xhc3M9J2hpZGUnPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgdmFsaWduPSd0b3AnIHN0eWxlPSdwYWRkaW5nOiAwcHg7Jz48dGFibGUgY2VsbHBhZGRpbmc9JzAnIGNlbGxzcGFjaW5nPScwJyB3aWR0aD0nMTAwJSc+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBzdHlsZT0ncGFkZGluZzogMHB4Oyc+PHRhYmxlIGNlbGxwYWRkaW5nPScwJyBjZWxsc3BhY2luZz0nMCcgd2lkdGg9JzEwMCUnPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgYWxpZ249J2NlbnRlcicgc3R5bGU9J3BhZGRpbmc6IDBweDsnPjx0YWJsZSBjZWxscGFkZGluZz0nMCcgY2VsbHNwYWNpbmc9JzAnIGJvcmRlcj0nMCcgYWxpZ249J2NlbnRlcicgd2lkdGg9JzIwJyAgc3R5bGU9J2JvcmRlcjogMHB4IG5vbmU7aGVpZ2h0OiBhdXRvOyc+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCB2YWxpZ249J3RvcCcgc3R5bGU9J3BhZGRpbmc6IDBweDsnPjxpbWcgc3JjPSdodHRwczovL3NmMjYuc2VuZHNmeC5jb20vYWRtaW4vdGVtcC91c2VyLzE3L2ltZ184OTgzNzMxOC5wbmcnIHdpZHRoPScyMCcgaGVpZ2h0PScyMCcgYWx0PVxcXCJcXFwiIGJvcmRlcj0nMCcgc3R5bGU9J2Rpc3BsYXk6IGJsb2NrOycgY2xhc3M9J2ltZzIweDIwJ1xcblwiICtcbiAgICAgICAgICAgIFwiLz48L3RkPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RhYmxlPjwvdGQ+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGFibGU+PC90ZD5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90YWJsZT48L3RkPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RhYmxlPjwvdGQ+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGFibGU+PC90ZD5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90YWJsZT5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGFibGUgY2VsbHBhZGRpbmc9JzAnIGNlbGxzcGFjaW5nPScwJyBib3JkZXI9JzAnIHdpZHRoPScxMDAlJz5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIHZhbGlnbj0ndG9wJyBzdHlsZT0ncGFkZGluZy1ib3R0b206IDIwcHg7Jz48ZGl2IHN0eWxlPSd0ZXh0LWFsaWduOiBsZWZ0O2ZvbnQtZmFtaWx5OiBhcmlhbDtmb250LXNpemU6IDE2cHg7Y29sb3I6ICNmZmZmZmY7bGluZS1oZWlnaHQ6IDI2cHg7bXNvLWxpbmUtaGVpZ2h0OiBleGFjdGx5O21zby10ZXh0LXJhaXNlOiA1cHg7Jz5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwIHN0eWxlPSdwYWRkaW5nOiAwOyBtYXJnaW46IDA7dGV4dC1hbGlnbjogY2VudGVyOyc+VmllbGVuIERhbmssIGRhc3MgU2llIHNpY2ggZsO8ciB1bnNlcmVuIE5ld3NsZXR0ZXIgYW5nZW1lbGRldCBoYWJlbi48L3A+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cCBzdHlsZT0ncGFkZGluZzogMDsgbWFyZ2luOiAwO3RleHQtYWxpZ246IGNlbnRlcjsnPlVtIGRpZXNlIEUtTWFpbC1BZHJlc3NlIHVuZCBJaHJlIGtvc3Rlbmxvc2UgQW5tZWxkdW5nIHp1IGJlc3TDpHRpZ2VuLCBrbGlja2VuIFNpZSBiaXR0ZSBqZXR6dCBhdWYgZGVuIGZvbGdlbmRlbiBCdXR0b246PC9wPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PjwvdGQ+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGFibGU+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRhYmxlIGNlbGxwYWRkaW5nPScwJyBjZWxsc3BhY2luZz0nMCcgd2lkdGg9JzEwMCUnPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgYWxpZ249J2NlbnRlcicgc3R5bGU9J3BhZGRpbmc6IDBweDsnPjx0YWJsZSBjZWxscGFkZGluZz0nMCcgY2VsbHNwYWNpbmc9JzAnIGJvcmRlcj0nMCcgYWxpZ249J2NlbnRlcicgc3R5bGU9J3RleHQtYWxpZ246IGNlbnRlcjtjb2xvcjogIzAwMDsnIGNsYXNzPSdmdWxsLXdpZHRoJz5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIHZhbGlnbj0ndG9wJyBhbGlnbj0nY2VudGVyJyBzdHlsZT0ncGFkZGluZy1yaWdodDogMTBweDtwYWRkaW5nLWJvdHRvbTogMzBweDtwYWRkaW5nLWxlZnQ6IDEwcHg7Jz48dGFibGUgY2VsbHBhZGRpbmc9JzAnIGNlbGxzcGFjaW5nPScwJyBib3JkZXI9JzAnIGJnY29sb3I9JyM4NWFjMWMnIHN0eWxlPSdib3JkZXI6IDBweCBub25lO2JvcmRlci1yYWRpdXM6IDVweDtib3JkZXItY29sbGFwc2U6IHNlcGFyYXRlICFpbXBvcnRhbnQ7YmFja2dyb3VuZC1jb2xvcjogIzg1YWMxYzsnIGNsYXNzPSdmdWxsLXdpZHRoJz5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIHZhbGlnbj0ndG9wJyBhbGlnbj0nY2VudGVyJyBzdHlsZT0ncGFkZGluZzogMTJweDsnPjxhIGhyZWY9JyR7Y29uZmlybWF0aW9uX3VybH0nIHRhcmdldD0nX2JsYW5rJyBzdHlsZT0ndGV4dC1kZWNvcmF0aW9uOiBub25lOycgY2xhc3M9J2VkbV9idXR0b24nPjxzcGFuIHN0eWxlPSdmb250LWZhbWlseTogYXJpYWw7Zm9udC1zaXplOiAxOHB4O2NvbG9yOiAjZmZmZmZmO2xpbmUtaGVpZ2h0OiAyOHB4O3RleHQtZGVjb3JhdGlvbjogbm9uZTsnPjxzcGFuXFxuXCIgK1xuICAgICAgICAgICAgXCJzdHlsZT0nZm9udC1zaXplOiAxOHB4Oyc+SmV0enQgQW5tZWxkdW5nIGJlc3QmYXVtbDt0aWdlbjwvc3Bhbj48L3NwYW4+IDwvYT48L3RkPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RhYmxlPjwvdGQ+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGFibGU+PC90ZD5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90YWJsZT5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPSd0ZXh0LWFsaWduOiBsZWZ0O2ZvbnQtZmFtaWx5OiBhcmlhbDtmb250LXNpemU6IDEycHg7Y29sb3I6ICNmZmZmZmY7bGluZS1oZWlnaHQ6IDIycHg7bXNvLWxpbmUtaGVpZ2h0OiBleGFjdGx5O21zby10ZXh0LXJhaXNlOiA1cHg7Jz5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwIHN0eWxlPSdwYWRkaW5nOiAwOyBtYXJnaW46IDA7dGV4dC1hbGlnbjogY2VudGVyOyc+V2VubiBTaWUgaWhyZSBFLU1haWwtQWRyZXNzZSBuaWNodCBiZXN0w6R0aWdlbiwga8O2bm5lbiBrZWluZSBOZXdzbGV0dGVyIHp1Z2VzdGVsbHQgd2VyZGVuLiBJaHIgRWludmVyc3TDpG5kbmlzIGvDtm5uZW4gU2llIHNlbGJzdHZlcnN0w6RuZGxpY2ggamVkZXJ6ZWl0IHdpZGVycnVmZW4uIFNvbGx0ZSBlcyBzaWNoIGJlaSBkZXIgQW5tZWxkdW5nIHVtIGVpbiBWZXJzZWhlbiBoYW5kZWxuIG9kZXIgd3VyZGUgZGVyIE5ld3NsZXR0ZXIgbmljaHQgaW4gSWhyZW0gTmFtZW4gYmVzdGVsbHQsIGvDtm5uZW4gU2llIGRpZXNlIEUtTWFpbCBlaW5mYWNoIGlnbm9yaWVyZW4uIElobmVuIHdlcmRlbiBrZWluZSB3ZWl0ZXJlbiBOYWNocmljaHRlbiB6dWdlc2NoaWNrdC48L3A+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+PC90ZD5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90YWJsZT48L3RkPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICA8L3RhYmxlPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgIDx0YWJsZSBjZWxscGFkZGluZz0nMCcgY2VsbHNwYWNpbmc9JzAnIGJvcmRlcj0nMCcgd2lkdGg9JzEwMCUnIGJnY29sb3I9JyNmZmZmZmYnIHN0eWxlPSdib3JkZXI6IDBweCBub25lO2JhY2tncm91bmQtY29sb3I6ICNmZmZmZmY7Jz5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIHZhbGlnbj0ndG9wJyBzdHlsZT0ncGFkZGluZy10b3A6IDMwcHg7cGFkZGluZy1yaWdodDogMjBweDtwYWRkaW5nLWJvdHRvbTogMzVweDtwYWRkaW5nLWxlZnQ6IDIwcHg7Jz48dGFibGUgY2VsbHBhZGRpbmc9JzAnIGNlbGxzcGFjaW5nPScwJyB3aWR0aD0nMTAwJSc+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBzdHlsZT0ncGFkZGluZzogMHB4Oyc+PHRhYmxlIGNlbGxwYWRkaW5nPScwJyBjZWxsc3BhY2luZz0nMCcgYm9yZGVyPScwJyB3aWR0aD0nMTAwJSc+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCB2YWxpZ249J3RvcCcgc3R5bGU9J3BhZGRpbmctYm90dG9tOiAyNXB4Oyc+PGRpdiBzdHlsZT0ndGV4dC1hbGlnbjogbGVmdDtmb250LWZhbWlseTogYXJpYWw7Zm9udC1zaXplOiAxMnB4O2NvbG9yOiAjMzMzMzMzO2xpbmUtaGVpZ2h0OiAyMnB4O21zby1saW5lLWhlaWdodDogZXhhY3RseTttc28tdGV4dC1yYWlzZTogNXB4Oyc+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cCBzdHlsZT0ncGFkZGluZzogMDsgbWFyZ2luOiAwO3RleHQtYWxpZ246IGNlbnRlcjsnPjxzcGFuIHN0eWxlPSdsaW5lLWhlaWdodDogMzsnPjxzdHJvbmc+S29udGFrdDwvc3Ryb25nPjwvc3Bhbj48YnI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlcnZpY2VAc2VuZGVmZmVjdC5kZTxicj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd3d3LnNlbmRlZmZlY3QuZGU8YnI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRlbGVmb246ICs0OSAoMCkgODU3MSAtIDk3IDM5IC0gNjktMDwvcD5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj48L3RkPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RhYmxlPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9J3RleHQtYWxpZ246IGxlZnQ7Zm9udC1mYW1pbHk6IGFyaWFsO2ZvbnQtc2l6ZTogMTJweDtjb2xvcjogIzMzMzMzMztsaW5lLWhlaWdodDogMjJweDttc28tbGluZS1oZWlnaHQ6IGV4YWN0bHk7bXNvLXRleHQtcmFpc2U6IDVweDsnPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHAgc3R5bGU9J3BhZGRpbmc6IDA7IG1hcmdpbjogMDt0ZXh0LWFsaWduOiBjZW50ZXI7Jz48c3BhbiBzdHlsZT0nbGluZS1oZWlnaHQ6IDM7Jz48c3Ryb25nPkltcHJlc3N1bTwvc3Ryb25nPjwvc3Bhbj48YnI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFuc2NocmlmdDogU2NodWxnYXNzZSA1LCBELTg0MzU5IFNpbWJhY2ggYW0gSW5uLCBlTWFpbDogc2VydmljZUBzZW5kZWZmZWN0LmRlPGJyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBCZXRyZWliZXI6IFdFQmFuaXplciBBRywgUmVnaXN0ZXJnZXJpY2h0OiBBbXRzZ2VyaWNodCBMYW5kc2h1dCBIUkIgNTE3NywgVXN0SWQuOiBERSAyMDY4IDYyIDA3MDxicj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVm9yc3RhbmQ6IE90dG1hciBOZXVidXJnZXIsIEF1ZnNpY2h0c3JhdDogVG9iaWFzIE5ldWJ1cmdlcjwvcD5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj48L3RkPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RhYmxlPjwvdGQ+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgIDwvdGFibGU+PC90ZD5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgIDwvdHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgPC90YWJsZT48L3RkPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgPC90cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICA8L3RhYmxlPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICA8L2Rpdj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgPCEtLSBjb250ZW50IGVuZCAtLT5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgIDwvY2VudGVyPjwvdGQ+XFxuXCIgK1xuICAgICAgICAgICAgXCIgIDwvdHI+XFxuXCIgK1xuICAgICAgICAgICAgXCI8L3RhYmxlPlwiXG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7XCJzdGF0dXNcIjogXCJzdWNjZXNzXCIsIFwiZGF0YVwiOiBkYXRhfTtcbiAgICB9XG4gIH1cbn0pO1xuIiwiaW1wb3J0IHsgQXBpLCBET0lfRkVUQ0hfUk9VVEUsIERPSV9DT05GSVJNQVRJT05fTk9USUZZX1JPVVRFIH0gZnJvbSAnLi4vcmVzdC5qcyc7XG5pbXBvcnQgYWRkT3B0SW4gZnJvbSAnLi4vLi4vLi4vLi4vaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9vcHQtaW5zL2FkZF9hbmRfd3JpdGVfdG9fYmxvY2tjaGFpbi5qcyc7XG5pbXBvcnQgdXBkYXRlT3B0SW5TdGF0dXMgZnJvbSAnLi4vLi4vLi4vLi4vaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9vcHQtaW5zL3VwZGF0ZV9zdGF0dXMuanMnO1xuaW1wb3J0IGdldERvaU1haWxEYXRhIGZyb20gJy4uLy4uLy4uLy4uL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvZGFwcHMvZ2V0X2RvaS1tYWlsLWRhdGEuanMnO1xuaW1wb3J0IHtsb2dFcnJvciwgbG9nU2VuZH0gZnJvbSBcIi4uLy4uLy4uLy4uL2ltcG9ydHMvc3RhcnR1cC9zZXJ2ZXIvbG9nLWNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7RE9JX0VYUE9SVF9ST1VURX0gZnJvbSBcIi4uL3Jlc3RcIjtcbmltcG9ydCBleHBvcnREb2lzIGZyb20gXCIuLi8uLi8uLi8uLi9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2RhcHBzL2V4cG9ydF9kb2lzXCI7XG5pbXBvcnQge09wdEluc30gZnJvbSBcIi4uLy4uLy4uLy4uL2ltcG9ydHMvYXBpL29wdC1pbnMvb3B0LWluc1wiO1xuaW1wb3J0IHtSb2xlc30gZnJvbSBcIm1ldGVvci9hbGFubmluZzpyb2xlc1wiO1xuXG4vL2Rva3Ugb2YgbWV0ZW9yLXJlc3RpdnVzIGh0dHBzOi8vZ2l0aHViLmNvbS9rYWhtYWxpL21ldGVvci1yZXN0aXZ1c1xuXG5BcGkuYWRkUm91dGUoRE9JX0NPTkZJUk1BVElPTl9OT1RJRllfUk9VVEUsIHtcbiAgcG9zdDoge1xuICAgIGF1dGhSZXF1aXJlZDogdHJ1ZSxcbiAgICAvL3JvbGVSZXF1aXJlZDogWydhZG1pbiddLFxuICAgIGFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBxUGFyYW1zID0gdGhpcy5xdWVyeVBhcmFtcztcbiAgICAgIGNvbnN0IGJQYXJhbXMgPSB0aGlzLmJvZHlQYXJhbXM7XG4gICAgICBsZXQgcGFyYW1zID0ge31cbiAgICAgIGlmKHFQYXJhbXMgIT09IHVuZGVmaW5lZCkgcGFyYW1zID0gey4uLnFQYXJhbXN9XG4gICAgICBpZihiUGFyYW1zICE9PSB1bmRlZmluZWQpIHBhcmFtcyA9IHsuLi5wYXJhbXMsIC4uLmJQYXJhbXN9XG5cbiAgICAgIGNvbnN0IHVpZCA9IHRoaXMudXNlcklkO1xuXG4gICAgICBpZighUm9sZXMudXNlcklzSW5Sb2xlKHVpZCwgJ2FkbWluJykgfHwgLy9pZiBpdHMgbm90IGFuIGFkbWluIGFsd2F5cyB1c2UgdWlkIGFzIG93bmVySWRcbiAgICAgICAgICAoUm9sZXMudXNlcklzSW5Sb2xlKHVpZCwgJ2FkbWluJykgJiYgKHBhcmFtc1tcIm93bmVySWRcIl09PW51bGwgfHwgcGFyYW1zW1wib3duZXJJZFwiXT09dW5kZWZpbmVkKSkpIHsgIC8vaWYgaXRzIGFuIGFkbWluIG9ubHkgdXNlIHVpZCBpbiBjYXNlIG5vIG93bmVySWQgd2FzIGdpdmVuXG4gICAgICAgICAgcGFyYW1zW1wib3duZXJJZFwiXSA9IHVpZDtcbiAgICAgIH1cblxuICAgICAgbG9nU2VuZCgncGFyYW1ldGVyIHJlY2VpdmVkIGZyb20gYnJvd3NlcjonLHBhcmFtcyk7XG4gICAgICBpZihwYXJhbXMuc2VuZGVyX21haWwuY29uc3RydWN0b3IgPT09IEFycmF5KXsgLy90aGlzIGlzIGEgU09JIHdpdGggY28tc3BvbnNvcnMgZmlyc3QgZW1haWwgaXMgbWFpbiBzcG9uc29yXG4gICAgICAgICAgcmV0dXJuIHByZXBhcmVDb0RPSShwYXJhbXMpO1xuICAgICAgfWVsc2V7XG4gICAgICAgICByZXR1cm4gcHJlcGFyZUFkZChwYXJhbXMpO1xuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgcHV0OiB7XG4gICAgYXV0aFJlcXVpcmVkOiBmYWxzZSxcbiAgICBhY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgcVBhcmFtcyA9IHRoaXMucXVlcnlQYXJhbXM7XG4gICAgICBjb25zdCBiUGFyYW1zID0gdGhpcy5ib2R5UGFyYW1zO1xuXG4gICAgICBsb2dTZW5kKCdxUGFyYW1zOicscVBhcmFtcyk7XG4gICAgICBsb2dTZW5kKCdiUGFyYW1zOicsYlBhcmFtcyk7XG5cbiAgICAgIGxldCBwYXJhbXMgPSB7fVxuICAgICAgaWYocVBhcmFtcyAhPT0gdW5kZWZpbmVkKSBwYXJhbXMgPSB7Li4ucVBhcmFtc31cbiAgICAgIGlmKGJQYXJhbXMgIT09IHVuZGVmaW5lZCkgcGFyYW1zID0gey4uLnBhcmFtcywgLi4uYlBhcmFtc31cbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHZhbCA9IHVwZGF0ZU9wdEluU3RhdHVzKHBhcmFtcyk7XG4gICAgICAgIGxvZ1NlbmQoJ29wdC1JbiBzdGF0dXMgdXBkYXRlZCcsdmFsKTtcbiAgICAgICAgcmV0dXJuIHtzdGF0dXM6ICdzdWNjZXNzJywgZGF0YToge21lc3NhZ2U6ICdPcHQtSW4gc3RhdHVzIHVwZGF0ZWQnfX07XG4gICAgICB9IGNhdGNoKGVycm9yKSB7XG4gICAgICAgIHJldHVybiB7c3RhdHVzQ29kZTogNTAwLCBib2R5OiB7c3RhdHVzOiAnZmFpbCcsIG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2V9fTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn0pO1xuXG5BcGkuYWRkUm91dGUoRE9JX0ZFVENIX1JPVVRFLCB7YXV0aFJlcXVpcmVkOiBmYWxzZX0sIHtcbiAgZ2V0OiB7XG4gICAgYWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IHBhcmFtcyA9IHRoaXMucXVlcnlQYXJhbXM7XG4gICAgICB0cnkge1xuICAgICAgICAgIGxvZ1NlbmQoJ3Jlc3QgYXBpIC0gRE9JX0ZFVENIX1JPVVRFIGNhbGxlZCBieSBib2IgdG8gcmVxdWVzdCBlbWFpbCB0ZW1wbGF0ZScsSlNPTi5zdHJpbmdpZnkocGFyYW1zKSk7XG4gICAgICAgICAgY29uc3QgZGF0YSA9IGdldERvaU1haWxEYXRhKHBhcmFtcyk7XG4gICAgICAgICAgbG9nU2VuZCgnZ290IGRvaS1tYWlsLWRhdGEgKGluY2x1ZGluZyB0ZW1wbGFsdGUpIHJldHVybmluZyB0byBib2InLHtzdWJqZWN0OmRhdGEuc3ViamVjdCwgcmVjaXBpZW50OmRhdGEucmVjaXBpZW50fSk7XG4gICAgICAgIHJldHVybiB7c3RhdHVzOiAnc3VjY2VzcycsIGRhdGF9O1xuICAgICAgfSBjYXRjaChlcnJvcikge1xuICAgICAgICBsb2dFcnJvcignZXJyb3Igd2hpbGUgZ2V0dGluZyBEb2lNYWlsRGF0YScsZXJyb3IpO1xuICAgICAgICByZXR1cm4ge3N0YXR1czogJ2ZhaWwnLCBlcnJvcjogZXJyb3IubWVzc2FnZX07XG4gICAgICB9XG4gICAgfVxuICB9XG59KTtcblxuQXBpLmFkZFJvdXRlKERPSV9FWFBPUlRfUk9VVEUsIHtcbiAgICBnZXQ6IHtcbiAgICAgICAgYXV0aFJlcXVpcmVkOiB0cnVlLFxuICAgICAgICAvL3JvbGVSZXF1aXJlZDogWydhZG1pbiddLFxuICAgICAgICBhY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgbGV0IHBhcmFtcyA9IHRoaXMucXVlcnlQYXJhbXM7XG4gICAgICAgICAgICBjb25zdCB1aWQgPSB0aGlzLnVzZXJJZDtcbiAgICAgICAgICAgIGlmKCFSb2xlcy51c2VySXNJblJvbGUodWlkLCAnYWRtaW4nKSl7XG4gICAgICAgICAgICAgICAgcGFyYW1zID0ge3VzZXJpZDp1aWQscm9sZTondXNlcid9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICBwYXJhbXMgPSB7Li4ucGFyYW1zLHJvbGU6J2FkbWluJ31cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgbG9nU2VuZCgncmVzdCBhcGkgLSBET0lfRVhQT1JUX1JPVVRFIGNhbGxlZCcsSlNPTi5zdHJpbmdpZnkocGFyYW1zKSk7XG4gICAgICAgICAgICAgICAgY29uc3QgZGF0YSA9IGV4cG9ydERvaXMocGFyYW1zKTtcbiAgICAgICAgICAgICAgICBsb2dTZW5kKCdnb3QgZG9pcyBmcm9tIGRhdGFiYXNlJyxKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtzdGF0dXM6ICdzdWNjZXNzJywgZGF0YX07XG4gICAgICAgICAgICB9IGNhdGNoKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgbG9nRXJyb3IoJ2Vycm9yIHdoaWxlIGV4cG9ydGluZyBjb25maXJtZWQgZG9pcycsZXJyb3IpO1xuICAgICAgICAgICAgICAgIHJldHVybiB7c3RhdHVzOiAnZmFpbCcsIGVycm9yOiBlcnJvci5tZXNzYWdlfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn0pO1xuXG5mdW5jdGlvbiBwcmVwYXJlQ29ET0kocGFyYW1zKXtcblxuICAgIGxvZ1NlbmQoJ2lzIGFycmF5ICcscGFyYW1zLnNlbmRlcl9tYWlsKTtcblxuICAgIGNvbnN0IHNlbmRlcnMgPSBwYXJhbXMuc2VuZGVyX21haWw7XG4gICAgY29uc3QgcmVjaXBpZW50X21haWwgPSBwYXJhbXMucmVjaXBpZW50X21haWw7XG4gICAgY29uc3QgZGF0YSA9IHBhcmFtcy5kYXRhO1xuICAgIGNvbnN0IG93bmVySUQgPSBwYXJhbXMub3duZXJJZDtcblxuICAgIGxldCBjdXJyZW50T3B0SW5JZDtcbiAgICBsZXQgcmV0UmVzcG9uc2UgPSBbXTtcbiAgICBsZXQgbWFzdGVyX2RvaTtcbiAgICBzZW5kZXJzLmZvckVhY2goKHNlbmRlcixpbmRleCkgPT4ge1xuXG4gICAgICAgIGNvbnN0IHJldF9yZXNwb25zZSA9IHByZXBhcmVBZGQoe3NlbmRlcl9tYWlsOnNlbmRlcixyZWNpcGllbnRfbWFpbDpyZWNpcGllbnRfbWFpbCxkYXRhOmRhdGEsIG1hc3Rlcl9kb2k6bWFzdGVyX2RvaSwgaW5kZXg6IGluZGV4LCBvd25lcklkOm93bmVySUR9KTtcbiAgICAgICAgbG9nU2VuZCgnQ29ET0k6JyxyZXRfcmVzcG9uc2UpO1xuICAgICAgICBpZihyZXRfcmVzcG9uc2Uuc3RhdHVzID09PSB1bmRlZmluZWQgfHwgcmV0X3Jlc3BvbnNlLnN0YXR1cz09PVwiZmFpbGVkXCIpIHRocm93IFwiY291bGQgbm90IGFkZCBjby1vcHQtaW5cIjtcbiAgICAgICAgcmV0UmVzcG9uc2UucHVzaChyZXRfcmVzcG9uc2UpO1xuICAgICAgICBjdXJyZW50T3B0SW5JZCA9IHJldF9yZXNwb25zZS5kYXRhLmlkO1xuXG4gICAgICAgIGlmKGluZGV4PT09MClcbiAgICAgICAge1xuICAgICAgICAgICAgbG9nU2VuZCgnbWFpbiBzcG9uc29yIG9wdEluSWQ6JyxjdXJyZW50T3B0SW5JZCk7XG4gICAgICAgICAgICBjb25zdCBvcHRJbiA9IE9wdElucy5maW5kT25lKHtfaWQ6IGN1cnJlbnRPcHRJbklkfSk7XG4gICAgICAgICAgICBtYXN0ZXJfZG9pID0gb3B0SW4ubmFtZUlkO1xuICAgICAgICAgICAgbG9nU2VuZCgnbWFpbiBzcG9uc29yIG5hbWVJZDonLG1hc3Rlcl9kb2kpO1xuICAgICAgICB9XG5cbiAgICB9KTtcblxuICAgIGxvZ1NlbmQocmV0UmVzcG9uc2UpO1xuXG4gICAgcmV0dXJuIHJldFJlc3BvbnNlO1xufVxuXG5mdW5jdGlvbiBwcmVwYXJlQWRkKHBhcmFtcyl7XG5cbiAgICB0cnkge1xuICAgICAgICBjb25zdCB2YWwgPSBhZGRPcHRJbihwYXJhbXMpO1xuICAgICAgICBsb2dTZW5kKCdvcHQtSW4gYWRkZWQgSUQ6Jyx2YWwpO1xuICAgICAgICByZXR1cm4ge3N0YXR1czogJ3N1Y2Nlc3MnLCBkYXRhOiB7aWQ6IHZhbCwgc3RhdHVzOiAnc3VjY2VzcycsIG1lc3NhZ2U6ICdPcHQtSW4gYWRkZWQuJ319O1xuICAgIH0gY2F0Y2goZXJyb3IpIHtcbiAgICAgICAgcmV0dXJuIHtzdGF0dXNDb2RlOiA1MDAsIGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogZXJyb3IubWVzc2FnZX19O1xuICAgIH1cbn0iLCJpbXBvcnQgeyBBcGkgfSBmcm9tICcuLi9yZXN0LmpzJztcbmltcG9ydCB7Z2V0SW5mb30gZnJvbSBcIi4uLy4uL2RvaWNoYWluXCI7XG5pbXBvcnQgeyBDT05GSVJNX0NMSUVOVCxTRU5EX0NMSUVOVH0gZnJvbSBcIi4uLy4uLy4uLy4uL2ltcG9ydHMvc3RhcnR1cC9zZXJ2ZXIvZG9pY2hhaW4tY29uZmlndXJhdGlvblwiO1xuXG5BcGkuYWRkUm91dGUoJ3N0YXR1cycsIHthdXRoUmVxdWlyZWQ6IGZhbHNlfSwge1xuICBnZXQ6IHtcbiAgICBhY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgZGF0YSA9IGdldEluZm8oU0VORF9DTElFTlQ/U0VORF9DTElFTlQ6Q09ORklSTV9DTElFTlQpO1xuICAgICAgICByZXR1cm4ge1wic3RhdHVzXCI6IFwic3VjY2Vzc1wiLCBcImRhdGFcIjpkYXRhfTtcbiAgICAgIH1jYXRjaChleCl7XG4gICAgICAgICAgICByZXR1cm4ge1wic3RhdHVzXCI6IFwiZmFpbGVkXCIsIFwiZGF0YVwiOiBleC50b1N0cmluZygpfTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn0pO1xuIiwiaW1wb3J0IHsgQXBpIH0gZnJvbSAnLi4vcmVzdC5qcyc7XG5pbXBvcnQge01ldGVvcn0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQge0FjY291bnRzfSBmcm9tICdtZXRlb3IvYWNjb3VudHMtYmFzZSdcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcbmltcG9ydCB7Um9sZXN9IGZyb20gXCJtZXRlb3IvYWxhbm5pbmc6cm9sZXNcIjtcbmltcG9ydCB7bG9nTWFpbn0gZnJvbSBcIi4uLy4uLy4uLy4uL2ltcG9ydHMvc3RhcnR1cC9zZXJ2ZXIvbG9nLWNvbmZpZ3VyYXRpb25cIjtcblxuY29uc3QgbWFpbFRlbXBsYXRlU2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gICAgc3ViamVjdDoge1xuICAgICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICAgIG9wdGlvbmFsOnRydWUgXG4gICAgfSxcbiAgICByZWRpcmVjdDoge1xuICAgICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICAgIHJlZ0V4OiBcIkAoaHR0cHM/fGZ0cCk6Ly8oLVxcXFwuKT8oW15cXFxccy8/XFxcXC4jLV0rXFxcXC4/KSsoL1teXFxcXHNdKik/JEBcIixcbiAgICAgICAgb3B0aW9uYWw6dHJ1ZSBcbiAgICB9LFxuICAgIHJldHVyblBhdGg6IHtcbiAgICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgICByZWdFeDogU2ltcGxlU2NoZW1hLlJlZ0V4LkVtYWlsLFxuICAgICAgICBvcHRpb25hbDp0cnVlIFxuICAgIH0sXG4gICAgdGVtcGxhdGVVUkw6e1xuICAgICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICAgIHJlZ0V4OiBcIkAoaHR0cHM/fGZ0cCk6Ly8oLVxcXFwuKT8oW15cXFxccy8/XFxcXC4jLV0rXFxcXC4/KSsoL1teXFxcXHNdKik/JEBcIixcbiAgICAgICAgb3B0aW9uYWw6dHJ1ZSBcbiAgICB9XG59KTtcblxuY29uc3QgY3JlYXRlVXNlclNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICAgIHVzZXJuYW1lOiB7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICByZWdFeDogXCJeW0EtWixhLXosMC05LCEsXywkLCNdezQsMjR9JFwiICAvL09ubHkgdXNlcm5hbWVzIGJldHdlZW4gNC0yNCBjaGFyYWN0ZXJzIGZyb20gQS1aLGEteiwwLTksISxfLCQsIyBhbGxvd2VkXG4gICAgfSxcbiAgICBlbWFpbDoge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgcmVnRXg6IFNpbXBsZVNjaGVtYS5SZWdFeC5FbWFpbFxuICAgIH0sXG4gICAgcGFzc3dvcmQ6IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIHJlZ0V4OiBcIl5bQS1aLGEteiwwLTksISxfLCQsI117OCwyNH0kXCIgLy9Pbmx5IHBhc3N3b3JkcyBiZXR3ZWVuIDgtMjQgY2hhcmFjdGVycyBmcm9tIEEtWixhLXosMC05LCEsXywkLCMgYWxsb3dlZFxuICAgIH0sXG4gICAgbWFpbFRlbXBsYXRlOntcbiAgICAgICAgdHlwZTogbWFpbFRlbXBsYXRlU2NoZW1hLFxuICAgICAgICBvcHRpb25hbDp0cnVlIFxuICAgIH1cbiAgfSk7XG4gIGNvbnN0IHVwZGF0ZVVzZXJTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgICBtYWlsVGVtcGxhdGU6e1xuICAgICAgICB0eXBlOiBtYWlsVGVtcGxhdGVTY2hlbWFcbiAgICB9XG59KTtcblxuLy9UT0RPOiBjb2xsZWN0aW9uIG9wdGlvbnMgc2VwYXJhdGVcbmNvbnN0IGNvbGxlY3Rpb25PcHRpb25zID1cbiAge1xuICAgIHBhdGg6XCJ1c2Vyc1wiLFxuICAgIHJvdXRlT3B0aW9uczpcbiAgICB7XG4gICAgICAgIGF1dGhSZXF1aXJlZCA6IHRydWVcbiAgICAgICAgLy8scm9sZVJlcXVpcmVkIDogXCJhZG1pblwiXG4gICAgfSxcbiAgICBleGNsdWRlZEVuZHBvaW50czogWydwYXRjaCcsJ2RlbGV0ZUFsbCddLFxuICAgIGVuZHBvaW50czpcbiAgICB7XG4gICAgICAgIGRlbGV0ZTp7cm9sZVJlcXVpcmVkIDogXCJhZG1pblwifSxcbiAgICAgICAgcG9zdDpcbiAgICAgICAge1xuICAgICAgICAgICAgcm9sZVJlcXVpcmVkIDogXCJhZG1pblwiLFxuICAgICAgICAgICAgYWN0aW9uOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIGNvbnN0IHFQYXJhbXMgPSB0aGlzLnF1ZXJ5UGFyYW1zO1xuICAgICAgICAgICAgICAgIGNvbnN0IGJQYXJhbXMgPSB0aGlzLmJvZHlQYXJhbXM7XG4gICAgICAgICAgICAgICAgbGV0IHBhcmFtcyA9IHt9O1xuICAgICAgICAgICAgICAgIGlmKHFQYXJhbXMgIT09IHVuZGVmaW5lZCkgcGFyYW1zID0gey4uLnFQYXJhbXN9XG4gICAgICAgICAgICAgICAgaWYoYlBhcmFtcyAhPT0gdW5kZWZpbmVkKSBwYXJhbXMgPSB7Li4ucGFyYW1zLCAuLi5iUGFyYW1zfVxuICAgICAgICAgICAgICAgIHRyeXtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHVzZXJJZDtcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlVXNlclNjaGVtYS52YWxpZGF0ZShwYXJhbXMpO1xuICAgICAgICAgICAgICAgICAgICBsb2dNYWluKCd2YWxpZGF0ZWQnLHBhcmFtcyk7XG4gICAgICAgICAgICAgICAgICAgIGlmKHBhcmFtcy5tYWlsVGVtcGxhdGUgIT09IHVuZGVmaW5lZCl7XG4gICAgICAgICAgICAgICAgICAgICAgICB1c2VySWQgPSBBY2NvdW50cy5jcmVhdGVVc2VyKHt1c2VybmFtZTpwYXJhbXMudXNlcm5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW1haWw6cGFyYW1zLmVtYWlsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhc3N3b3JkOnBhcmFtcy5wYXNzd29yZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9maWxlOnttYWlsVGVtcGxhdGU6cGFyYW1zLm1haWxUZW1wbGF0ZX19KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgICAgICAgICAgdXNlcklkID0gQWNjb3VudHMuY3JlYXRlVXNlcih7dXNlcm5hbWU6cGFyYW1zLnVzZXJuYW1lLGVtYWlsOnBhcmFtcy5lbWFpbCxwYXNzd29yZDpwYXJhbXMucGFzc3dvcmQsIHByb2ZpbGU6e319KTtcbiAgICAgICAgICAgICAgICAgICAgfSAgICBcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtzdGF0dXM6ICdzdWNjZXNzJywgZGF0YToge3VzZXJpZDogdXNlcklkfX07XG4gICAgICAgICAgICAgICAgfSBjYXRjaChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIHtzdGF0dXNDb2RlOiA0MDAsIGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogZXJyb3IubWVzc2FnZX19O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgcHV0OlxuICAgICAgICB7XG4gICAgICAgICAgICBhY3Rpb246IGZ1bmN0aW9uKCl7ICAgICAgXG4gICAgICAgICAgICAgICAgY29uc3QgcVBhcmFtcyA9IHRoaXMucXVlcnlQYXJhbXM7XG4gICAgICAgICAgICAgICAgY29uc3QgYlBhcmFtcyA9IHRoaXMuYm9keVBhcmFtcztcbiAgICAgICAgICAgICAgICBsZXQgcGFyYW1zID0ge307XG4gICAgICAgICAgICAgICAgbGV0IHVpZD10aGlzLnVzZXJJZDtcbiAgICAgICAgICAgICAgICBjb25zdCBwYXJhbUlkPXRoaXMudXJsUGFyYW1zLmlkO1xuICAgICAgICAgICAgICAgIGlmKHFQYXJhbXMgIT09IHVuZGVmaW5lZCkgcGFyYW1zID0gey4uLnFQYXJhbXN9XG4gICAgICAgICAgICAgICAgaWYoYlBhcmFtcyAhPT0gdW5kZWZpbmVkKSBwYXJhbXMgPSB7Li4ucGFyYW1zLCAuLi5iUGFyYW1zfVxuXG4gICAgICAgICAgICAgICAgdHJ5eyAvL1RPRE8gdGhpcyBpcyBub3QgbmVjZXNzYXJ5IGhlcmUgYW5kIGNhbiBwcm9iYWJseSBnbyByaWdodCBpbnRvIHRoZSBkZWZpbml0aW9uIG9mIHRoZSBSRVNUIE1FVEhPRCBuZXh0IHRvIHB1dCAoIT8hKVxuICAgICAgICAgICAgICAgICAgICBpZighUm9sZXMudXNlcklzSW5Sb2xlKHVpZCwgJ2FkbWluJykpe1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYodWlkIT09cGFyYW1JZCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJObyBQZXJtaXNzaW9uXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZVVzZXJTY2hlbWEudmFsaWRhdGUocGFyYW1zKTtcbiAgICAgICAgICAgICAgICAgICAgaWYoIU1ldGVvci51c2Vycy51cGRhdGUodGhpcy51cmxQYXJhbXMuaWQseyRzZXQ6e1wicHJvZmlsZS5tYWlsVGVtcGxhdGVcIjpwYXJhbXMubWFpbFRlbXBsYXRlfX0pKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IEVycm9yKFwiRmFpbGVkIHRvIHVwZGF0ZSB1c2VyXCIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7c3RhdHVzOiAnc3VjY2VzcycsIGRhdGE6IHt1c2VyaWQ6IHRoaXMudXJsUGFyYW1zLmlkLCBtYWlsVGVtcGxhdGU6cGFyYW1zLm1haWxUZW1wbGF0ZX19O1xuICAgICAgICAgICAgICAgIH0gY2F0Y2goZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiB7c3RhdHVzQ29kZTogNDAwLCBib2R5OiB7c3RhdHVzOiAnZmFpbCcsIG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2V9fTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5BcGkuYWRkQ29sbGVjdGlvbihNZXRlb3IudXNlcnMsY29sbGVjdGlvbk9wdGlvbnMpOyIsImltcG9ydCB7IEFwaSB9IGZyb20gJy4uL3Jlc3QuanMnO1xuaW1wb3J0IHZlcmlmeU9wdEluIGZyb20gJy4uLy4uLy4uLy4uL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvb3B0LWlucy92ZXJpZnkuanMnO1xuXG5BcGkuYWRkUm91dGUoJ29wdC1pbi92ZXJpZnknLCB7YXV0aFJlcXVpcmVkOiB0cnVlfSwge1xuICBnZXQ6IHtcbiAgICBhdXRoUmVxdWlyZWQ6IGZhbHNlLFxuICAgIGFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnN0IHFQYXJhbXMgPSB0aGlzLnF1ZXJ5UGFyYW1zO1xuICAgICAgICBjb25zdCBiUGFyYW1zID0gdGhpcy5ib2R5UGFyYW1zO1xuICAgICAgICBsZXQgcGFyYW1zID0ge31cbiAgICAgICAgaWYocVBhcmFtcyAhPT0gdW5kZWZpbmVkKSBwYXJhbXMgPSB7Li4ucVBhcmFtc31cbiAgICAgICAgaWYoYlBhcmFtcyAhPT0gdW5kZWZpbmVkKSBwYXJhbXMgPSB7Li4ucGFyYW1zLCAuLi5iUGFyYW1zfVxuXG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCB2YWwgPSB2ZXJpZnlPcHRJbihwYXJhbXMpO1xuICAgICAgICByZXR1cm4ge3N0YXR1czogXCJzdWNjZXNzXCIsIGRhdGE6IHt2YWx9fTtcbiAgICAgIH0gY2F0Y2goZXJyb3IpIHtcbiAgICAgICAgcmV0dXJuIHtzdGF0dXNDb2RlOiA1MDAsIGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogZXJyb3IubWVzc2FnZX19O1xuICAgICAgfVxuICAgIH1cbiAgfVxufSk7XG4iLCJpbXBvcnQgeyBSZXN0aXZ1cyB9IGZyb20gJ21ldGVvci9uaW1ibGU6cmVzdGl2dXMnO1xuaW1wb3J0IHsgaXNEZWJ1ZyB9IGZyb20gJy4uLy4uLy4uL2ltcG9ydHMvc3RhcnR1cC9zZXJ2ZXIvZGFwcC1jb25maWd1cmF0aW9uLmpzJztcbmltcG9ydCB7IFNFTkRfQVBQLCBDT05GSVJNX0FQUCwgVkVSSUZZX0FQUCwgaXNBcHBUeXBlIH0gZnJvbSAnLi4vLi4vLi4vaW1wb3J0cy9zdGFydHVwL3NlcnZlci90eXBlLWNvbmZpZ3VyYXRpb24uanMnO1xuXG5leHBvcnQgY29uc3QgRE9JX0NPTkZJUk1BVElPTl9ST1VURSA9IFwib3B0LWluL2NvbmZpcm1cIjtcbmV4cG9ydCBjb25zdCBET0lfQ09ORklSTUFUSU9OX05PVElGWV9ST1VURSA9IFwib3B0LWluXCI7XG5leHBvcnQgY29uc3QgRE9JX1dBTExFVE5PVElGWV9ST1VURSA9IFwid2FsbGV0bm90aWZ5XCI7XG5leHBvcnQgY29uc3QgRE9JX0ZFVENIX1JPVVRFID0gXCJkb2ktbWFpbFwiO1xuZXhwb3J0IGNvbnN0IERPSV9FWFBPUlRfUk9VVEUgPSBcImV4cG9ydFwiO1xuZXhwb3J0IGNvbnN0IEFQSV9QQVRIID0gXCJhcGkvXCI7XG5leHBvcnQgY29uc3QgVkVSU0lPTiA9IFwidjFcIjtcblxuZXhwb3J0IGNvbnN0IEFwaSA9IG5ldyBSZXN0aXZ1cyh7XG4gIGFwaVBhdGg6IEFQSV9QQVRILFxuICB2ZXJzaW9uOiBWRVJTSU9OLFxuICB1c2VEZWZhdWx0QXV0aDogdHJ1ZSxcbiAgcHJldHR5SnNvbjogdHJ1ZVxufSk7XG5cbmlmKGlzRGVidWcoKSkgcmVxdWlyZSgnLi9pbXBvcnRzL2RlYnVnLmpzJyk7XG5pZihpc0FwcFR5cGUoU0VORF9BUFApKSByZXF1aXJlKCcuL2ltcG9ydHMvc2VuZC5qcycpO1xuaWYoaXNBcHBUeXBlKENPTkZJUk1fQVBQKSkgcmVxdWlyZSgnLi9pbXBvcnRzL2NvbmZpcm0uanMnKTtcbmlmKGlzQXBwVHlwZShWRVJJRllfQVBQKSkgcmVxdWlyZSgnLi9pbXBvcnRzL3ZlcmlmeS5qcycpO1xucmVxdWlyZSgnLi9pbXBvcnRzL3VzZXIuanMnKTtcbnJlcXVpcmUoJy4vaW1wb3J0cy9zdGF0dXMuanMnKTtcbiIsIlxuaW1wb3J0IHsgSm9iQ29sbGVjdGlvbixKb2IgfSBmcm9tICdtZXRlb3IvdnNpdnNpOmpvYi1jb2xsZWN0aW9uJztcbmV4cG9ydCBjb25zdCBCbG9ja2NoYWluSm9icyA9IEpvYkNvbGxlY3Rpb24oJ2Jsb2NrY2hhaW4nKTtcbmltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IGluc2VydCBmcm9tICcuLi8uLi9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2RvaWNoYWluL2luc2VydC5qcyc7XG5pbXBvcnQgdXBkYXRlIGZyb20gJy4uLy4uL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvZG9pY2hhaW4vdXBkYXRlLmpzJztcbi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovIC8vVE9ETyByZS1lbmFibGUgdGhpcyFcbmltcG9ydCBjaGVja05ld1RyYW5zYWN0aW9uIGZyb20gJy4uLy4uL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvZG9pY2hhaW4vY2hlY2tfbmV3X3RyYW5zYWN0aW9ucy5qcyc7XG5pbXBvcnQgeyBDT05GSVJNX0FQUCwgaXNBcHBUeXBlIH0gZnJvbSAnLi4vLi4vaW1wb3J0cy9zdGFydHVwL3NlcnZlci90eXBlLWNvbmZpZ3VyYXRpb24uanMnO1xuaW1wb3J0IHtsb2dNYWlufSBmcm9tIFwiLi4vLi4vaW1wb3J0cy9zdGFydHVwL3NlcnZlci9sb2ctY29uZmlndXJhdGlvblwiO1xuXG5CbG9ja2NoYWluSm9icy5wcm9jZXNzSm9icygnaW5zZXJ0Jywge3dvcmtUaW1lb3V0OiAzMCoxMDAwfSxmdW5jdGlvbiAoam9iLCBjYikge1xuICB0cnkge1xuICAgIGNvbnN0IGVudHJ5ID0gam9iLmRhdGE7XG4gICAgaW5zZXJ0KGVudHJ5KTtcbiAgICBqb2IuZG9uZSgpO1xuICB9IGNhdGNoKGV4Y2VwdGlvbikge1xuICAgIGpvYi5mYWlsKCk7XG5cbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2pvYnMuYmxvY2tjaGFpbi5pbnNlcnQuZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgfSBmaW5hbGx5IHtcbiAgICBjYigpO1xuICB9XG59KTtcblxuQmxvY2tjaGFpbkpvYnMucHJvY2Vzc0pvYnMoJ3VwZGF0ZScsIHt3b3JrVGltZW91dDogMzAqMTAwMH0sZnVuY3Rpb24gKGpvYiwgY2IpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCBlbnRyeSA9IGpvYi5kYXRhO1xuICAgIHVwZGF0ZShlbnRyeSxqb2IpO1xuICB9IGNhdGNoKGV4Y2VwdGlvbikge1xuICAgIGpvYi5mYWlsKCk7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignam9icy5ibG9ja2NoYWluLnVwZGF0ZS5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9IGZpbmFsbHkge1xuICAgIGNiKCk7XG4gIH1cbn0pO1xuXG5CbG9ja2NoYWluSm9icy5wcm9jZXNzSm9icygnY2hlY2tOZXdUcmFuc2FjdGlvbicsIHt3b3JrVGltZW91dDogMzAqMTAwMH0sZnVuY3Rpb24gKGpvYiwgY2IpIHtcbiAgdHJ5IHtcbiAgICBpZighaXNBcHBUeXBlKENPTkZJUk1fQVBQKSkge1xuICAgICAgam9iLnBhdXNlKCk7XG4gICAgICBqb2IuY2FuY2VsKCk7XG4gICAgICBqb2IucmVtb3ZlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vY2hlY2tOZXdUcmFuc2FjdGlvbihudWxsLGpvYik7XG4gICAgfVxuICB9IGNhdGNoKGV4Y2VwdGlvbikge1xuICAgIGpvYi5mYWlsKCk7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignam9icy5ibG9ja2NoYWluLmNoZWNrTmV3VHJhbnNhY3Rpb25zLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH0gZmluYWxseSB7XG4gICAgY2IoKTtcbiAgfVxufSk7XG5cbm5ldyBKb2IoQmxvY2tjaGFpbkpvYnMsICdjbGVhbnVwJywge30pXG4gICAgLnJlcGVhdCh7IHNjaGVkdWxlOiBCbG9ja2NoYWluSm9icy5sYXRlci5wYXJzZS50ZXh0KFwiZXZlcnkgNSBtaW51dGVzXCIpIH0pXG4gICAgLnNhdmUoe2NhbmNlbFJlcGVhdHM6IHRydWV9KTtcblxubGV0IHEgPSBCbG9ja2NoYWluSm9icy5wcm9jZXNzSm9icygnY2xlYW51cCcseyBwb2xsSW50ZXJ2YWw6IGZhbHNlLCB3b3JrVGltZW91dDogNjAqMTAwMCB9ICxmdW5jdGlvbiAoam9iLCBjYikge1xuICBjb25zdCBjdXJyZW50ID0gbmV3IERhdGUoKVxuICAgIGN1cnJlbnQuc2V0TWludXRlcyhjdXJyZW50LmdldE1pbnV0ZXMoKSAtIDUpO1xuXG4gIGNvbnN0IGlkcyA9IEJsb2NrY2hhaW5Kb2JzLmZpbmQoe1xuICAgICAgICAgIHN0YXR1czogeyRpbjogSm9iLmpvYlN0YXR1c1JlbW92YWJsZX0sXG4gICAgICAgICAgdXBkYXRlZDogeyRsdDogY3VycmVudH19LFxuICAgICAgICAgIHtmaWVsZHM6IHsgX2lkOiAxIH19KTtcblxuICAgIGxvZ01haW4oJ2ZvdW5kICByZW1vdmFibGUgYmxvY2tjaGFpbiBqb2JzOicsaWRzKTtcbiAgICBCbG9ja2NoYWluSm9icy5yZW1vdmVKb2JzKGlkcyk7XG4gICAgaWYoaWRzLmxlbmd0aCA+IDApe1xuICAgICAgam9iLmRvbmUoXCJSZW1vdmVkICN7aWRzLmxlbmd0aH0gb2xkIGpvYnNcIik7XG4gICAgfVxuICAgIGNiKCk7XG59KTtcblxuQmxvY2tjaGFpbkpvYnMuZmluZCh7IHR5cGU6ICdqb2JUeXBlJywgc3RhdHVzOiAncmVhZHknIH0pXG4gICAgLm9ic2VydmUoe1xuICAgICAgICBhZGRlZDogZnVuY3Rpb24gKCkgeyBxLnRyaWdnZXIoKTsgfVxuICAgIH0pO1xuIiwiaW1wb3J0IHsgSm9iQ29sbGVjdGlvbiwgSm9iIH0gZnJvbSAnbWV0ZW9yL3ZzaXZzaTpqb2ItY29sbGVjdGlvbic7XG5pbXBvcnQgZmV0Y2hEb2lNYWlsRGF0YSBmcm9tICcuLi8uLi9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2RhcHBzL2ZldGNoX2RvaS1tYWlsLWRhdGEuanMnO1xuaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQge2xvZ01haW59IGZyb20gXCIuLi8uLi9pbXBvcnRzL3N0YXJ0dXAvc2VydmVyL2xvZy1jb25maWd1cmF0aW9uXCI7XG5pbXBvcnQge0Jsb2NrY2hhaW5Kb2JzfSBmcm9tIFwiLi9ibG9ja2NoYWluX2pvYnNcIjtcblxuZXhwb3J0IGNvbnN0IERBcHBKb2JzID0gSm9iQ29sbGVjdGlvbignZGFwcCcpO1xuXG5EQXBwSm9icy5wcm9jZXNzSm9icygnZmV0Y2hEb2lNYWlsRGF0YScsIGZ1bmN0aW9uIChqb2IsIGNiKSB7XG4gIHRyeSB7XG4gICAgY29uc3QgZGF0YSA9IGpvYi5kYXRhO1xuICAgIGZldGNoRG9pTWFpbERhdGEoZGF0YSk7XG4gICAgam9iLmRvbmUoKTtcbiAgfSBjYXRjaChleGNlcHRpb24pIHtcbiAgICBqb2IuZmFpbCgpO1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2pvYnMuZGFwcC5mZXRjaERvaU1haWxEYXRhLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH0gZmluYWxseSB7XG4gICAgY2IoKTtcbiAgfVxufSk7XG5cblxubmV3IEpvYihEQXBwSm9icywgJ2NsZWFudXAnLCB7fSlcbiAgICAucmVwZWF0KHsgc2NoZWR1bGU6IERBcHBKb2JzLmxhdGVyLnBhcnNlLnRleHQoXCJldmVyeSA1IG1pbnV0ZXNcIikgfSlcbiAgICAuc2F2ZSh7Y2FuY2VsUmVwZWF0czogdHJ1ZX0pO1xuXG5sZXQgcSA9IERBcHBKb2JzLnByb2Nlc3NKb2JzKCdjbGVhbnVwJyx7IHBvbGxJbnRlcnZhbDogZmFsc2UsIHdvcmtUaW1lb3V0OiA2MCoxMDAwIH0gLGZ1bmN0aW9uIChqb2IsIGNiKSB7XG4gICAgY29uc3QgY3VycmVudCA9IG5ldyBEYXRlKClcbiAgICBjdXJyZW50LnNldE1pbnV0ZXMoY3VycmVudC5nZXRNaW51dGVzKCkgLSA1KTtcblxuICAgIGNvbnN0IGlkcyA9IERBcHBKb2JzLmZpbmQoe1xuICAgICAgICAgICAgc3RhdHVzOiB7JGluOiBKb2Iuam9iU3RhdHVzUmVtb3ZhYmxlfSxcbiAgICAgICAgICAgIHVwZGF0ZWQ6IHskbHQ6IGN1cnJlbnR9fSxcbiAgICAgICAge2ZpZWxkczogeyBfaWQ6IDEgfX0pO1xuXG4gICAgbG9nTWFpbignZm91bmQgIHJlbW92YWJsZSBibG9ja2NoYWluIGpvYnM6JyxpZHMpO1xuICAgIERBcHBKb2JzLnJlbW92ZUpvYnMoaWRzKTtcbiAgICBpZihpZHMubGVuZ3RoID4gMCl7XG4gICAgICAgIGpvYi5kb25lKFwiUmVtb3ZlZCAje2lkcy5sZW5ndGh9IG9sZCBqb2JzXCIpO1xuICAgIH1cbiAgICBjYigpO1xufSk7XG5cbkRBcHBKb2JzLmZpbmQoeyB0eXBlOiAnam9iVHlwZScsIHN0YXR1czogJ3JlYWR5JyB9KVxuICAgIC5vYnNlcnZlKHtcbiAgICAgICAgYWRkZWQ6IGZ1bmN0aW9uICgpIHsgcS50cmlnZ2VyKCk7IH1cbiAgICB9KTtcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IGRucyBmcm9tICdkbnMnO1xuaW1wb3J0IHtsb2dTZW5kfSBmcm9tIFwiLi4vLi4vaW1wb3J0cy9zdGFydHVwL3NlcnZlci9sb2ctY29uZmlndXJhdGlvblwiO1xuXG5leHBvcnQgZnVuY3Rpb24gcmVzb2x2ZVR4dChrZXksIGRvbWFpbikge1xuICBjb25zdCBzeW5jRnVuYyA9IE1ldGVvci53cmFwQXN5bmMoZG5zX3Jlc29sdmVUeHQpO1xuICB0cnkge1xuICAgIGNvbnN0IHJlY29yZHMgPSBzeW5jRnVuYyhrZXksIGRvbWFpbik7XG4gICAgaWYocmVjb3JkcyA9PT0gdW5kZWZpbmVkKSByZXR1cm4gdW5kZWZpbmVkO1xuICAgIGxldCB2YWx1ZSA9IHVuZGVmaW5lZDtcbiAgICByZWNvcmRzLmZvckVhY2gocmVjb3JkID0+IHtcbiAgICAgIGlmKHJlY29yZFswXS5zdGFydHNXaXRoKGtleSkpIHtcbiAgICAgICAgY29uc3QgdmFsID0gcmVjb3JkWzBdLnN1YnN0cmluZyhrZXkubGVuZ3RoKzEpO1xuICAgICAgICB2YWx1ZSA9IHZhbC50cmltKCk7XG5cbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH0gY2F0Y2goZXJyb3IpIHtcbiAgICBsb2dTZW5kKFwiZXJyb3Igd2hpbGUgYXNraW5nIGRucyBzZXJ2ZXJzIGZyb20gXCIsZG5zLmdldFNlcnZlcnMoKSk7XG4gICAgaWYoZXJyb3IubWVzc2FnZS5zdGFydHNXaXRoKFwicXVlcnlUeHQgRU5PREFUQVwiKSB8fFxuICAgICAgICBlcnJvci5tZXNzYWdlLnN0YXJ0c1dpdGgoXCJxdWVyeVR4dCBFTk9URk9VTkRcIikpIHJldHVybiB1bmRlZmluZWQ7XG4gICAgZWxzZSB0aHJvdyBlcnJvcjtcbiAgfVxufVxuXG5mdW5jdGlvbiBkbnNfcmVzb2x2ZVR4dChrZXksIGRvbWFpbiwgY2FsbGJhY2spIHtcbiAgICBsb2dTZW5kKFwicmVzb2x2aW5nIGRucyB0eHQgYXR0cmlidXRlOiBcIiwge2tleTprZXksZG9tYWluOmRvbWFpbn0pO1xuICAgIGRucy5yZXNvbHZlVHh0KGRvbWFpbiwgKGVyciwgcmVjb3JkcykgPT4ge1xuICAgIGNhbGxiYWNrKGVyciwgcmVjb3Jkcyk7XG4gIH0pO1xufVxuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQge2xvZ0Jsb2NrY2hhaW4sIGxvZ0NvbmZpcm0sIGxvZ0Vycm9yfSBmcm9tIFwiLi4vLi4vaW1wb3J0cy9zdGFydHVwL3NlcnZlci9sb2ctY29uZmlndXJhdGlvblwiO1xuXG5cbmNvbnN0IE5BTUVTUEFDRSA9ICdlLyc7XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFdpZihjbGllbnQsIGFkZHJlc3MpIHtcbiAgaWYoIWFkZHJlc3Mpe1xuICAgICAgICBhZGRyZXNzID0gZ2V0QWRkcmVzc2VzQnlBY2NvdW50KFwiXCIpWzBdO1xuICAgICAgICBsb2dCbG9ja2NoYWluKCdhZGRyZXNzIHdhcyBub3QgZGVmaW5lZCBzbyBnZXR0aW5nIHRoZSBmaXJzdCBleGlzdGluZyBvbmUgb2YgdGhlIHdhbGxldDonLGFkZHJlc3MpO1xuICB9XG4gIGlmKCFhZGRyZXNzKXtcbiAgICAgICAgYWRkcmVzcyA9IGdldE5ld0FkZHJlc3MoXCJcIik7XG4gICAgICAgIGxvZ0Jsb2NrY2hhaW4oJ2FkZHJlc3Mgd2FzIG5ldmVyIGRlZmluZWQgIGF0IGFsbCBnZW5lcmF0ZWQgbmV3IGFkZHJlc3MgZm9yIHRoaXMgd2FsbGV0OicsYWRkcmVzcyk7XG4gIH1cbiAgY29uc3Qgc3luY0Z1bmMgPSBNZXRlb3Iud3JhcEFzeW5jKGRvaWNoYWluX2R1bXBwcml2a2V5KTtcbiAgcmV0dXJuIHN5bmNGdW5jKGNsaWVudCwgYWRkcmVzcyk7XG59XG5cbmZ1bmN0aW9uIGRvaWNoYWluX2R1bXBwcml2a2V5KGNsaWVudCwgYWRkcmVzcywgY2FsbGJhY2spIHtcbiAgY29uc3Qgb3VyQWRkcmVzcyA9IGFkZHJlc3M7XG4gIGNsaWVudC5jbWQoJ2R1bXBwcml2a2V5Jywgb3VyQWRkcmVzcywgZnVuY3Rpb24oZXJyLCBkYXRhKSB7XG4gICAgaWYoZXJyKSAgbG9nRXJyb3IoJ2RvaWNoYWluX2R1bXBwcml2a2V5OicsZXJyKTtcbiAgICBjYWxsYmFjayhlcnIsIGRhdGEpO1xuICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEFkZHJlc3Nlc0J5QWNjb3VudChjbGllbnQsIGFjY291dCkge1xuICAgIGNvbnN0IHN5bmNGdW5jID0gTWV0ZW9yLndyYXBBc3luYyhkb2ljaGFpbl9nZXRhZGRyZXNzZXNieWFjY291bnQpO1xuICAgIHJldHVybiBzeW5jRnVuYyhjbGllbnQsIGFjY291dCk7XG59XG5cbmZ1bmN0aW9uIGRvaWNoYWluX2dldGFkZHJlc3Nlc2J5YWNjb3VudChjbGllbnQsIGFjY291bnQsIGNhbGxiYWNrKSB7XG4gICAgY29uc3Qgb3VyQWNjb3VudCA9IGFjY291bnQ7XG4gICAgY2xpZW50LmNtZCgnZ2V0YWRkcmVzc2VzYnlhY2NvdW50Jywgb3VyQWNjb3VudCwgZnVuY3Rpb24oZXJyLCBkYXRhKSB7XG4gICAgICAgIGlmKGVycikgIGxvZ0Vycm9yKCdnZXRhZGRyZXNzZXNieWFjY291bnQ6JyxlcnIpO1xuICAgICAgICBjYWxsYmFjayhlcnIsIGRhdGEpO1xuICAgIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0TmV3QWRkcmVzcyhjbGllbnQsIGFjY291dCkge1xuICAgIGNvbnN0IHN5bmNGdW5jID0gTWV0ZW9yLndyYXBBc3luYyhkb2ljaGFpbl9nZXRuZXdhZGRyZXNzKTtcbiAgICByZXR1cm4gc3luY0Z1bmMoY2xpZW50LCBhY2NvdXQpO1xufVxuZnVuY3Rpb24gZG9pY2hhaW5fZ2V0bmV3YWRkcmVzcyhjbGllbnQsIGFjY291bnQsIGNhbGxiYWNrKSB7XG4gICAgY29uc3Qgb3VyQWNjb3VudCA9IGFjY291bnQ7XG4gICAgY2xpZW50LmNtZCgnZ2V0bmV3YWRkcmVzc3MnLCBvdXJBY2NvdW50LCBmdW5jdGlvbihlcnIsIGRhdGEpIHtcbiAgICAgICAgaWYoZXJyKSAgbG9nRXJyb3IoJ2dldG5ld2FkZHJlc3NzOicsZXJyKTtcbiAgICAgICAgY2FsbGJhY2soZXJyLCBkYXRhKTtcbiAgICB9KTtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gc2lnbk1lc3NhZ2UoY2xpZW50LCBhZGRyZXNzLCBtZXNzYWdlKSB7XG4gICAgY29uc3Qgc3luY0Z1bmMgPSBNZXRlb3Iud3JhcEFzeW5jKGRvaWNoYWluX3NpZ25NZXNzYWdlKTtcbiAgICByZXR1cm4gc3luY0Z1bmMoY2xpZW50LCBhZGRyZXNzLCBtZXNzYWdlKTtcbn1cblxuZnVuY3Rpb24gZG9pY2hhaW5fc2lnbk1lc3NhZ2UoY2xpZW50LCBhZGRyZXNzLCBtZXNzYWdlLCBjYWxsYmFjaykge1xuICAgIGNvbnN0IG91ckFkZHJlc3MgPSBhZGRyZXNzO1xuICAgIGNvbnN0IG91ck1lc3NhZ2UgPSBtZXNzYWdlO1xuICAgIGNsaWVudC5jbWQoJ3NpZ25tZXNzYWdlJywgb3VyQWRkcmVzcywgb3VyTWVzc2FnZSwgZnVuY3Rpb24oZXJyLCBkYXRhKSB7XG4gICAgICAgIGNhbGxiYWNrKGVyciwgZGF0YSk7XG4gICAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBuYW1lU2hvdyhjbGllbnQsIGlkKSB7XG4gIGNvbnN0IHN5bmNGdW5jID0gTWV0ZW9yLndyYXBBc3luYyhkb2ljaGFpbl9uYW1lU2hvdyk7XG4gIHJldHVybiBzeW5jRnVuYyhjbGllbnQsIGlkKTtcbn1cblxuZnVuY3Rpb24gZG9pY2hhaW5fbmFtZVNob3coY2xpZW50LCBpZCwgY2FsbGJhY2spIHtcbiAgY29uc3Qgb3VySWQgPSBjaGVja0lkKGlkKTtcbiAgbG9nQ29uZmlybSgnZG9pY2hhaW4tY2xpIG5hbWVfc2hvdyA6JyxvdXJJZCk7XG4gIGNsaWVudC5jbWQoJ25hbWVfc2hvdycsIG91cklkLCBmdW5jdGlvbihlcnIsIGRhdGEpIHtcbiAgICBpZihlcnIgIT09IHVuZGVmaW5lZCAmJiBlcnIgIT09IG51bGwgJiYgZXJyLm1lc3NhZ2Uuc3RhcnRzV2l0aChcIm5hbWUgbm90IGZvdW5kXCIpKSB7XG4gICAgICBlcnIgPSB1bmRlZmluZWQsXG4gICAgICBkYXRhID0gdW5kZWZpbmVkXG4gICAgfVxuICAgIGNhbGxiYWNrKGVyciwgZGF0YSk7XG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZmVlRG9pKGNsaWVudCwgYWRkcmVzcykge1xuICAgIGNvbnN0IHN5bmNGdW5jID0gTWV0ZW9yLndyYXBBc3luYyhkb2ljaGFpbl9mZWVEb2kpO1xuICAgIHJldHVybiBzeW5jRnVuYyhjbGllbnQsIGFkZHJlc3MpO1xufVxuXG5mdW5jdGlvbiBkb2ljaGFpbl9mZWVEb2koY2xpZW50LCBhZGRyZXNzLCBjYWxsYmFjaykge1xuICAgIGNvbnN0IGRlc3RBZGRyZXNzID0gYWRkcmVzcztcbiAgICBjbGllbnQuY21kKCdzZW5kdG9hZGRyZXNzJywgZGVzdEFkZHJlc3MsICcwLjAyJywgZnVuY3Rpb24oZXJyLCBkYXRhKSB7XG4gICAgICAgIGNhbGxiYWNrKGVyciwgZGF0YSk7XG4gICAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBuYW1lRG9pKGNsaWVudCwgbmFtZSwgdmFsdWUsIGFkZHJlc3MpIHtcbiAgICBjb25zdCBzeW5jRnVuYyA9IE1ldGVvci53cmFwQXN5bmMoZG9pY2hhaW5fbmFtZURvaSk7XG4gICAgcmV0dXJuIHN5bmNGdW5jKGNsaWVudCwgbmFtZSwgdmFsdWUsIGFkZHJlc3MpO1xufVxuXG5mdW5jdGlvbiBkb2ljaGFpbl9uYW1lRG9pKGNsaWVudCwgbmFtZSwgdmFsdWUsIGFkZHJlc3MsIGNhbGxiYWNrKSB7XG4gICAgY29uc3Qgb3VyTmFtZSA9IGNoZWNrSWQobmFtZSk7XG4gICAgY29uc3Qgb3VyVmFsdWUgPSB2YWx1ZTtcbiAgICBjb25zdCBkZXN0QWRkcmVzcyA9IGFkZHJlc3M7XG4gICAgaWYoIWFkZHJlc3MpIHtcbiAgICAgICAgY2xpZW50LmNtZCgnbmFtZV9kb2knLCBvdXJOYW1lLCBvdXJWYWx1ZSwgZnVuY3Rpb24gKGVyciwgZGF0YSkge1xuICAgICAgICAgICAgY2FsbGJhY2soZXJyLCBkYXRhKTtcbiAgICAgICAgfSk7XG4gICAgfWVsc2V7XG4gICAgICAgIGNsaWVudC5jbWQoJ25hbWVfZG9pJywgb3VyTmFtZSwgb3VyVmFsdWUsIGRlc3RBZGRyZXNzLCBmdW5jdGlvbihlcnIsIGRhdGEpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKGVyciwgZGF0YSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxpc3RTaW5jZUJsb2NrKGNsaWVudCwgYmxvY2spIHtcbiAgICBjb25zdCBzeW5jRnVuYyA9IE1ldGVvci53cmFwQXN5bmMoZG9pY2hhaW5fbGlzdFNpbmNlQmxvY2spO1xuICAgIHZhciBvdXJCbG9jayA9IGJsb2NrO1xuICAgIGlmKG91ckJsb2NrID09PSB1bmRlZmluZWQpIG91ckJsb2NrID0gbnVsbDtcbiAgICByZXR1cm4gc3luY0Z1bmMoY2xpZW50LCBvdXJCbG9jayk7XG59XG5cbmZ1bmN0aW9uIGRvaWNoYWluX2xpc3RTaW5jZUJsb2NrKGNsaWVudCwgYmxvY2ssIGNhbGxiYWNrKSB7XG4gICAgdmFyIG91ckJsb2NrID0gYmxvY2s7XG4gICAgaWYob3VyQmxvY2sgPT09IG51bGwpIGNsaWVudC5jbWQoJ2xpc3RzaW5jZWJsb2NrJywgZnVuY3Rpb24oZXJyLCBkYXRhKSB7XG4gICAgICAgIGNhbGxiYWNrKGVyciwgZGF0YSk7XG4gICAgfSk7XG4gICAgZWxzZSBjbGllbnQuY21kKCdsaXN0c2luY2VibG9jaycsIG91ckJsb2NrLCBmdW5jdGlvbihlcnIsIGRhdGEpIHtcbiAgICAgICAgY2FsbGJhY2soZXJyLCBkYXRhKTtcbiAgICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFRyYW5zYWN0aW9uKGNsaWVudCwgdHhpZCkge1xuICAgIGNvbnN0IHN5bmNGdW5jID0gTWV0ZW9yLndyYXBBc3luYyhkb2ljaGFpbl9nZXR0cmFuc2FjdGlvbik7XG4gICAgcmV0dXJuIHN5bmNGdW5jKGNsaWVudCwgdHhpZCk7XG59XG5cbmZ1bmN0aW9uIGRvaWNoYWluX2dldHRyYW5zYWN0aW9uKGNsaWVudCwgdHhpZCwgY2FsbGJhY2spIHtcbiAgICBsb2dDb25maXJtKCdkb2ljaGFpbl9nZXR0cmFuc2FjdGlvbjonLHR4aWQpO1xuICAgIGNsaWVudC5jbWQoJ2dldHRyYW5zYWN0aW9uJywgdHhpZCwgZnVuY3Rpb24oZXJyLCBkYXRhKSB7XG4gICAgICAgIGlmKGVycikgIGxvZ0Vycm9yKCdkb2ljaGFpbl9nZXR0cmFuc2FjdGlvbjonLGVycik7XG4gICAgICAgIGNhbGxiYWNrKGVyciwgZGF0YSk7XG4gICAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRSYXdUcmFuc2FjdGlvbihjbGllbnQsIHR4aWQpIHtcbiAgICBjb25zdCBzeW5jRnVuYyA9IE1ldGVvci53cmFwQXN5bmMoZG9pY2hhaW5fZ2V0cmF3dHJhbnNhY3Rpb24pO1xuICAgIHJldHVybiBzeW5jRnVuYyhjbGllbnQsIHR4aWQpO1xufVxuXG5mdW5jdGlvbiBkb2ljaGFpbl9nZXRyYXd0cmFuc2FjdGlvbihjbGllbnQsIHR4aWQsIGNhbGxiYWNrKSB7XG4gICAgbG9nQmxvY2tjaGFpbignZG9pY2hhaW5fZ2V0cmF3dHJhbnNhY3Rpb246Jyx0eGlkKTtcbiAgICBjbGllbnQuY21kKCdnZXRyYXd0cmFuc2FjdGlvbicsIHR4aWQsIDEsIGZ1bmN0aW9uKGVyciwgZGF0YSkge1xuICAgICAgICBpZihlcnIpICBsb2dFcnJvcignZG9pY2hhaW5fZ2V0cmF3dHJhbnNhY3Rpb246JyxlcnIpO1xuICAgICAgICBjYWxsYmFjayhlcnIsIGRhdGEpO1xuICAgIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0QmFsYW5jZShjbGllbnQpIHtcbiAgICBjb25zdCBzeW5jRnVuYyA9IE1ldGVvci53cmFwQXN5bmMoZG9pY2hhaW5fZ2V0YmFsYW5jZSk7XG4gICAgcmV0dXJuIHN5bmNGdW5jKGNsaWVudCk7XG59XG5cbmZ1bmN0aW9uIGRvaWNoYWluX2dldGJhbGFuY2UoY2xpZW50LCBjYWxsYmFjaykge1xuICAgIGNsaWVudC5jbWQoJ2dldGJhbGFuY2UnLCBmdW5jdGlvbihlcnIsIGRhdGEpIHtcbiAgICAgICAgaWYoZXJyKSB7IGxvZ0Vycm9yKCdkb2ljaGFpbl9nZXRiYWxhbmNlOicsZXJyKTt9XG4gICAgICAgIGNhbGxiYWNrKGVyciwgZGF0YSk7XG4gICAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRJbmZvKGNsaWVudCkge1xuICAgIGNvbnN0IHN5bmNGdW5jID0gTWV0ZW9yLndyYXBBc3luYyhkb2ljaGFpbl9nZXRpbmZvKTtcbiAgICByZXR1cm4gc3luY0Z1bmMoY2xpZW50KTtcbn1cblxuZnVuY3Rpb24gZG9pY2hhaW5fZ2V0aW5mbyhjbGllbnQsIGNhbGxiYWNrKSB7XG4gICAgY2xpZW50LmNtZCgnZ2V0YmxvY2tjaGFpbmluZm8nLCBmdW5jdGlvbihlcnIsIGRhdGEpIHtcbiAgICAgICAgaWYoZXJyKSB7IGxvZ0Vycm9yKCdkb2ljaGFpbi1nZXRpbmZvOicsZXJyKTt9XG4gICAgICAgIGNhbGxiYWNrKGVyciwgZGF0YSk7XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIGNoZWNrSWQoaWQpIHtcbiAgICBjb25zdCBET0lfUFJFRklYID0gXCJkb2k6IFwiO1xuICAgIGxldCByZXRfdmFsID0gaWQ7IC8vZGVmYXVsdCB2YWx1ZVxuXG4gICAgaWYoaWQuc3RhcnRzV2l0aChET0lfUFJFRklYKSkgcmV0X3ZhbCA9IGlkLnN1YnN0cmluZyhET0lfUFJFRklYLmxlbmd0aCk7IC8vaW4gY2FzZSBpdCBzdGFydHMgd2l0aCBkb2k6IGN1dCAgdGhpcyBhd2F5XG4gICAgaWYoIWlkLnN0YXJ0c1dpdGgoTkFNRVNQQUNFKSkgcmV0X3ZhbCA9IE5BTUVTUEFDRStpZDsgLy9pbiBjYXNlIGl0IGRvZXNuJ3Qgc3RhcnQgd2l0aCBlLyBwdXQgaXQgaW4gZnJvbnQgbm93LlxuICByZXR1cm4gcmV0X3ZhbDtcbn1cbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IHsgSFRUUCB9IGZyb20gJ21ldGVvci9odHRwJ1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0SHR0cEdFVCh1cmwsIHF1ZXJ5KSB7XG4gIGNvbnN0IHN5bmNGdW5jID0gTWV0ZW9yLndyYXBBc3luYyhfZ2V0KTtcbiAgcmV0dXJuIHN5bmNGdW5jKHVybCwgcXVlcnkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0SHR0cEdFVGRhdGEodXJsLCBkYXRhKSB7XG4gICAgY29uc3Qgc3luY0Z1bmMgPSBNZXRlb3Iud3JhcEFzeW5jKF9nZXREYXRhKTtcbiAgICByZXR1cm4gc3luY0Z1bmModXJsLCBkYXRhKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEh0dHBQT1NUKHVybCwgZGF0YSkge1xuICAgIGNvbnN0IHN5bmNGdW5jID0gTWV0ZW9yLndyYXBBc3luYyhfcG9zdCk7XG4gICAgcmV0dXJuIHN5bmNGdW5jKHVybCwgZGF0YSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRIdHRwUFVUKHVybCwgZGF0YSkge1xuICAgIGNvbnN0IHN5bmNGdW5jID0gTWV0ZW9yLndyYXBBc3luYyhfcHV0KTtcbiAgICByZXR1cm4gc3luY0Z1bmModXJsLCBkYXRhKTtcbn1cblxuZnVuY3Rpb24gX2dldCh1cmwsIHF1ZXJ5LCBjYWxsYmFjaykge1xuICBjb25zdCBvdXJVcmwgPSB1cmw7XG4gIGNvbnN0IG91clF1ZXJ5ID0gcXVlcnk7XG4gIEhUVFAuZ2V0KG91clVybCwge3F1ZXJ5OiBvdXJRdWVyeX0sIGZ1bmN0aW9uKGVyciwgcmV0KSB7XG4gICAgY2FsbGJhY2soZXJyLCByZXQpO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gX2dldERhdGEodXJsLCBkYXRhLCBjYWxsYmFjaykge1xuICAgIGNvbnN0IG91clVybCA9IHVybDtcbiAgICBjb25zdCBvdXJEYXRhID0gZGF0YTtcbiAgICBIVFRQLmdldChvdXJVcmwsIG91ckRhdGEsIGZ1bmN0aW9uKGVyciwgcmV0KSB7XG4gICAgICAgIGNhbGxiYWNrKGVyciwgcmV0KTtcbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gX3Bvc3QodXJsLCBkYXRhLCBjYWxsYmFjaykge1xuICAgIGNvbnN0IG91clVybCA9IHVybDtcbiAgICBjb25zdCBvdXJEYXRhID0gIGRhdGE7XG5cbiAgICBIVFRQLnBvc3Qob3VyVXJsLCBvdXJEYXRhLCBmdW5jdGlvbihlcnIsIHJldCkge1xuICAgICAgICBjYWxsYmFjayhlcnIsIHJldCk7XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIF9wdXQodXJsLCB1cGRhdGVEYXRhLCBjYWxsYmFjaykge1xuICAgIGNvbnN0IG91clVybCA9IHVybDtcbiAgICBjb25zdCBvdXJEYXRhID0ge1xuICAgICAgICBkYXRhOiB1cGRhdGVEYXRhXG4gICAgfVxuXG4gICAgSFRUUC5wdXQob3VyVXJsLCBvdXJEYXRhLCBmdW5jdGlvbihlcnIsIHJldCkge1xuICAgICAgY2FsbGJhY2soZXJyLCByZXQpO1xuICAgIH0pO1xufVxuIiwiaW1wb3J0ICcuL21haWxfam9icy5qcyc7XG5pbXBvcnQgJy4vZG9pY2hhaW4uanMnO1xuaW1wb3J0ICcuL2Jsb2NrY2hhaW5fam9icy5qcyc7XG5pbXBvcnQgJy4vZGFwcF9qb2JzLmpzJztcbmltcG9ydCAnLi9kbnMuanMnO1xuaW1wb3J0ICcuL3Jlc3QvcmVzdC5qcyc7XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCB7IEpvYkNvbGxlY3Rpb24sIEpvYiB9IGZyb20gJ21ldGVvci92c2l2c2k6am9iLWNvbGxlY3Rpb24nO1xuZXhwb3J0IGNvbnN0IE1haWxKb2JzID0gSm9iQ29sbGVjdGlvbignZW1haWxzJyk7XG5pbXBvcnQgc2VuZE1haWwgZnJvbSAnLi4vLi4vaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9lbWFpbHMvc2VuZC5qcyc7XG5pbXBvcnQge2xvZ01haW59IGZyb20gXCIuLi8uLi9pbXBvcnRzL3N0YXJ0dXAvc2VydmVyL2xvZy1jb25maWd1cmF0aW9uXCI7XG5pbXBvcnQge0Jsb2NrY2hhaW5Kb2JzfSBmcm9tIFwiLi9ibG9ja2NoYWluX2pvYnNcIjtcblxuXG5cbk1haWxKb2JzLnByb2Nlc3NKb2JzKCdzZW5kJywgZnVuY3Rpb24gKGpvYiwgY2IpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCBlbWFpbCA9IGpvYi5kYXRhO1xuICAgIHNlbmRNYWlsKGVtYWlsKTtcbiAgICBqb2IuZG9uZSgpO1xuICB9IGNhdGNoKGV4Y2VwdGlvbikge1xuICAgIGpvYi5mYWlsKCk7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignam9icy5tYWlsLnNlbmQuZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgfSBmaW5hbGx5IHtcbiAgICBjYigpO1xuICB9XG59KTtcblxuXG5uZXcgSm9iKE1haWxKb2JzLCAnY2xlYW51cCcsIHt9KVxuICAgIC5yZXBlYXQoeyBzY2hlZHVsZTogTWFpbEpvYnMubGF0ZXIucGFyc2UudGV4dChcImV2ZXJ5IDUgbWludXRlc1wiKSB9KVxuICAgIC5zYXZlKHtjYW5jZWxSZXBlYXRzOiB0cnVlfSlcblxubGV0IHEgPSBNYWlsSm9icy5wcm9jZXNzSm9icygnY2xlYW51cCcseyBwb2xsSW50ZXJ2YWw6IGZhbHNlLCB3b3JrVGltZW91dDogNjAqMTAwMCB9ICxmdW5jdGlvbiAoam9iLCBjYikge1xuICAgIGNvbnN0IGN1cnJlbnQgPSBuZXcgRGF0ZSgpXG4gICAgY3VycmVudC5zZXRNaW51dGVzKGN1cnJlbnQuZ2V0TWludXRlcygpIC0gNSk7XG5cbiAgICBjb25zdCBpZHMgPSBNYWlsSm9icy5maW5kKHtcbiAgICAgICAgICAgIHN0YXR1czogeyRpbjogSm9iLmpvYlN0YXR1c1JlbW92YWJsZX0sXG4gICAgICAgICAgICB1cGRhdGVkOiB7JGx0OiBjdXJyZW50fX0sXG4gICAgICAgIHtmaWVsZHM6IHsgX2lkOiAxIH19KTtcblxuICAgIGxvZ01haW4oJ2ZvdW5kICByZW1vdmFibGUgYmxvY2tjaGFpbiBqb2JzOicsaWRzKTtcbiAgICBNYWlsSm9icy5yZW1vdmVKb2JzKGlkcyk7XG4gICAgaWYoaWRzLmxlbmd0aCA+IDApe1xuICAgICAgICBqb2IuZG9uZShcIlJlbW92ZWQgI3tpZHMubGVuZ3RofSBvbGQgam9ic1wiKTtcbiAgICB9XG4gICAgY2IoKTtcbn0pO1xuXG5NYWlsSm9icy5maW5kKHsgdHlwZTogJ2pvYlR5cGUnLCBzdGF0dXM6ICdyZWFkeScgfSlcbiAgICAub2JzZXJ2ZSh7XG4gICAgICAgIGFkZGVkOiBmdW5jdGlvbiAoKSB7IHEudHJpZ2dlcigpOyB9XG4gICAgfSk7XG5cbiIsImltcG9ydCB7TWV0ZW9yfSBmcm9tIFwibWV0ZW9yL21ldGVvclwiO1xuaW1wb3J0IHtjaGFpfSBmcm9tICdtZXRlb3IvcHJhY3RpY2FsbWV0ZW9yOmNoYWknO1xuaW1wb3J0IHtxdW90ZWRQcmludGFibGVEZWNvZGV9IGZyb20gXCJlbWFpbGpzLW1pbWUtY29kZWNcIjtcbmltcG9ydCB7T3B0SW5zfSBmcm9tIFwiLi4vLi4vLi4vaW1wb3J0cy9hcGkvb3B0LWlucy9vcHQtaW5zXCI7XG5pbXBvcnQge1JlY2lwaWVudHN9IGZyb20gXCIuLi8uLi8uLi9pbXBvcnRzL2FwaS9yZWNpcGllbnRzL3JlY2lwaWVudHNcIjtcbmltcG9ydCB7Z2V0SHR0cEdFVCwgZ2V0SHR0cEdFVGRhdGEsIGdldEh0dHBQT1NUfSBmcm9tIFwiLi4vLi4vLi4vc2VydmVyL2FwaS9odHRwXCI7XG5pbXBvcnQge3Rlc3RMb2dnaW5nfSBmcm9tIFwiLi4vLi4vLi4vaW1wb3J0cy9zdGFydHVwL3NlcnZlci9sb2ctY29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHtnZW5lcmF0ZXRvYWRkcmVzc30gZnJvbSBcIi4vdGVzdC1hcGktb24tbm9kZVwiO1xuXG5jb25zdCBoZWFkZXJzID0geyAnQ29udGVudC1UeXBlJzondGV4dC9wbGFpbicgIH07XG5jb25zdCBvcyA9IHJlcXVpcmUoJ29zJyk7XG5cblxudmFyIFBPUDNDbGllbnQgPSByZXF1aXJlKFwicG9wbGliXCIpO1xuXG5leHBvcnQgZnVuY3Rpb24gbG9naW4odXJsLCBwYXJhbXNMb2dpbiwgbG9nKSB7XG4gICAgaWYobG9nKSB0ZXN0TG9nZ2luZygnZEFwcCBsb2dpbi4nKTtcblxuICAgIGNvbnN0IHVybExvZ2luID0gdXJsKycvYXBpL3YxL2xvZ2luJztcbiAgICBjb25zdCBoZWFkZXJzTG9naW4gPSBbeydDb250ZW50LVR5cGUnOidhcHBsaWNhdGlvbi9qc29uJ31dO1xuICAgIGNvbnN0IHJlYWxEYXRhTG9naW49IHsgcGFyYW1zOiBwYXJhbXNMb2dpbiwgaGVhZGVyczogaGVhZGVyc0xvZ2luIH07XG5cbiAgICBjb25zdCByZXN1bHQgPSBnZXRIdHRwUE9TVCh1cmxMb2dpbiwgcmVhbERhdGFMb2dpbik7XG5cbiAgICBpZihsb2cpIHRlc3RMb2dnaW5nKCdyZXN1bHQgbG9naW46JyxyZXN1bHQpO1xuICAgIGNvbnN0IHN0YXR1c0NvZGUgPSByZXN1bHQuc3RhdHVzQ29kZTtcbiAgICBjb25zdCBkYXRhTG9naW4gPSByZXN1bHQuZGF0YTtcblxuICAgIGNvbnN0IHN0YXR1c0xvZ2luID0gZGF0YUxvZ2luLnN0YXR1cztcbiAgICBjaGFpLmFzc2VydC5lcXVhbCgyMDAsIHN0YXR1c0NvZGUpO1xuICAgIGNoYWkuYXNzZXJ0LmVxdWFsKCdzdWNjZXNzJywgc3RhdHVzTG9naW4pO1xuICAgIHJldHVybiBkYXRhTG9naW4uZGF0YTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlcXVlc3RET0kodXJsLCBhdXRoLCByZWNpcGllbnRfbWFpbCwgc2VuZGVyX21haWwsIGRhdGEsICBsb2cpIHtcbiAgICBpZihsb2cpIHRlc3RMb2dnaW5nKCdzdGVwIDEgLSByZXF1ZXN0RE9JIGNhbGxlZCB2aWEgUkVTVCcpO1xuXG4gICAgY29uc3QgdXJsT3B0SW4gPSB1cmwrJy9hcGkvdjEvb3B0LWluJztcbiAgICBsZXQgZGF0YU9wdEluID0ge307XG5cbiAgICBpZihkYXRhKXtcbiAgICAgICAgZGF0YU9wdEluID0ge1xuICAgICAgICAgICAgXCJyZWNpcGllbnRfbWFpbFwiOnJlY2lwaWVudF9tYWlsLFxuICAgICAgICAgICAgXCJzZW5kZXJfbWFpbFwiOnNlbmRlcl9tYWlsLFxuICAgICAgICAgICAgXCJkYXRhXCI6SlNPTi5zdHJpbmdpZnkoZGF0YSlcbiAgICAgICAgfVxuICAgIH1lbHNle1xuICAgICAgICBkYXRhT3B0SW4gPSB7XG4gICAgICAgICAgICBcInJlY2lwaWVudF9tYWlsXCI6cmVjaXBpZW50X21haWwsXG4gICAgICAgICAgICBcInNlbmRlcl9tYWlsXCI6c2VuZGVyX21haWxcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGhlYWRlcnNPcHRJbiA9IHtcbiAgICAgICAgJ0NvbnRlbnQtVHlwZSc6J2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAnWC1Vc2VyLUlkJzphdXRoLnVzZXJJZCxcbiAgICAgICAgJ1gtQXV0aC1Ub2tlbic6YXV0aC5hdXRoVG9rZW5cbiAgICB9O1xuXG4gICAgY29uc3QgcmVhbERhdGFPcHRJbiA9IHsgZGF0YTogZGF0YU9wdEluLCBoZWFkZXJzOiBoZWFkZXJzT3B0SW59O1xuICAgIGNvbnN0IHJlc3VsdE9wdEluID0gZ2V0SHR0cFBPU1QodXJsT3B0SW4sIHJlYWxEYXRhT3B0SW4pO1xuXG4gICAgLy9sb2dCbG9ja2NoYWluKFwicmVzdWx0T3B0SW5cIixyZXN1bHRPcHRJbik7XG4gICAgY2hhaS5hc3NlcnQuZXF1YWwoMjAwLCByZXN1bHRPcHRJbi5zdGF0dXNDb2RlKTtcbiAgICB0ZXN0TG9nZ2luZyhcIlJFVFVSTkVEIFZBTFVFUzogXCIscmVzdWx0T3B0SW4pO1xuICAgIGlmKEFycmF5LmlzQXJyYXkocmVzdWx0T3B0SW4uZGF0YSkpe1xuICAgICAgICB0ZXN0TG9nZ2luZygnYWRkaW5nIGNvRE9JcycpO1xuICAgICAgICByZXN1bHRPcHRJbi5kYXRhLmZvckVhY2goZWxlbWVudCA9PiB7XG4gICAgICAgICAgICBjaGFpLmFzc2VydC5lcXVhbCgnc3VjY2VzcycsIGVsZW1lbnQuc3RhdHVzKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZWxzZXtcbiAgICAgICAgdGVzdExvZ2dpbmcoJ2FkZGluZyBET0knKTtcbiAgICBjaGFpLmFzc2VydC5lcXVhbCgnc3VjY2VzcycsICByZXN1bHRPcHRJbi5kYXRhLnN0YXR1cyk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHRPcHRJbi5kYXRhO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0TmFtZUlkT2ZSYXdUcmFuc2FjdGlvbih1cmwsIGF1dGgsIHR4SWQpIHtcbiAgICB0ZXN0TG9nZ2luZygncHJlLXN0YXJ0IG9mIGdldE5hbWVJZE9mUmF3VHJhbnNhY3Rpb24nLHR4SWQpO1xuICAgIGNvbnN0IHN5bmNGdW5jID0gTWV0ZW9yLndyYXBBc3luYyhnZXRfbmFtZWlkX29mX3Jhd190cmFuc2FjdGlvbik7XG4gICAgcmV0dXJuIHN5bmNGdW5jKHVybCwgYXV0aCwgdHhJZCk7XG59XG5cbmZ1bmN0aW9uIGdldF9uYW1laWRfb2ZfcmF3X3RyYW5zYWN0aW9uKHVybCwgYXV0aCwgdHhJZCwgY2FsbGJhY2spe1xuXG4gICAgbGV0IG5hbWVJZCA9ICcnO1xuICAgIGxldCBydW5uaW5nID0gdHJ1ZTtcbiAgICBsZXQgY291bnRlciA9IDA7XG4gICAgdGVzdExvZ2dpbmcoJ3N0YXJ0IGdldE5hbWVJZE9mUmF3VHJhbnNhY3Rpb24nLHR4SWQpO1xuICAgIChhc3luYyBmdW5jdGlvbiBsb29wKCkge1xuICAgICAgICB3aGlsZShydW5uaW5nICYmICsrY291bnRlcjwxNTAwKXsgLy90cnlpbmcgNTB4IHRvIGdldCBlbWFpbCBmcm9tIGJvYnMgbWFpbGJveFxuICAgICAgICAgICAgdHJ5e1xuICAgICAgICAgICAgICAgICAgICB0ZXN0TG9nZ2luZygndHJ5aW5nIHRvIGdldCB0cmFuc2FjdGlvbicsdHhJZCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGRhdGFHZXRSYXdUcmFuc2FjdGlvbiA9IHtcImpzb25ycGNcIjogXCIxLjBcIiwgXCJpZFwiOlwiZ2V0cmF3dHJhbnNhY3Rpb25cIiwgXCJtZXRob2RcIjogXCJnZXRyYXd0cmFuc2FjdGlvblwiLCBcInBhcmFtc1wiOiBbdHhJZCwxXSB9O1xuICAgICAgICAgICAgICAgICAgICBjb25zdCByZWFsZGF0YUdldFJhd1RyYW5zYWN0aW9uID0geyBhdXRoOiBhdXRoLCBkYXRhOiBkYXRhR2V0UmF3VHJhbnNhY3Rpb24sIGhlYWRlcnM6IGhlYWRlcnMgfTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0R2V0UmF3VHJhbnNhY3Rpb24gPSBnZXRIdHRwUE9TVCh1cmwsIHJlYWxkYXRhR2V0UmF3VHJhbnNhY3Rpb24pO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmKHJlc3VsdEdldFJhd1RyYW5zYWN0aW9uLmRhdGEucmVzdWx0LnZvdXRbMV0uc2NyaXB0UHViS2V5Lm5hbWVPcCE9PXVuZGVmaW5lZCl7XG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lSWQgPSByZXN1bHRHZXRSYXdUcmFuc2FjdGlvbi5kYXRhLnJlc3VsdC52b3V0WzFdLnNjcmlwdFB1YktleS5uYW1lT3AubmFtZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZUlkID0gcmVzdWx0R2V0UmF3VHJhbnNhY3Rpb24uZGF0YS5yZXN1bHQudm91dFswXS5zY3JpcHRQdWJLZXkubmFtZU9wLm5hbWU7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZihyZXN1bHRHZXRSYXdUcmFuc2FjdGlvbi5kYXRhLnJlc3VsdC50eGlkIT09dW5kZWZpbmVkKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlc3RMb2dnaW5nKCdjb25maXJtZWQgdHhpZDonK3Jlc3VsdEdldFJhd1RyYW5zYWN0aW9uLmRhdGEucmVzdWx0LnR4aWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcnVubmluZz1mYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvL2NoYWkuYXNzZXJ0LmVxdWFsKHR4SWQsIHJlc3VsdEdldFJhd1RyYW5zYWN0aW9uLmRhdGEucmVzdWx0LnR4aWQpO1xuICAgICAgICAgICAgfWNhdGNoKGV4KXtcbiAgICAgICAgICAgICAgICB0ZXN0TG9nZ2luZygndHJ5aW5nIHRvIGdldCBlbWFpbCAtIHNvIGZhciBubyBzdWNjZXNzOicsY291bnRlcik7XG4gICAgICAgICAgICAgICAgYXdhaXQgbmV3IFByb21pc2UocmVzb2x2ZSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIDIwMDApKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0ZXN0TG9nZ2luZygnZW5kIG9mIGdldE5hbWVJZE9mUmF3VHJhbnNhY3Rpb24gcmV0dXJuaW5nIG5hbWVJZCcsbmFtZUlkKTtcbiAgICAgICAgY2FsbGJhY2sobnVsbCxuYW1lSWQpO1xuICAgIH0pKCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXROYW1lSWRPZk9wdEluRnJvbVJhd1R4KHVybCwgYXV0aCwgb3B0SW5JZCxsb2cpIHtcbiAgICBjb25zdCBzeW5jRnVuYyA9IE1ldGVvci53cmFwQXN5bmMoZ2V0X25hbWVpZF9vZl9vcHRpbl9mcm9tX3Jhd3R4KTtcbiAgICByZXR1cm4gc3luY0Z1bmModXJsLCBhdXRoLCBvcHRJbklkLGxvZyk7XG59XG5cblxuYXN5bmMgZnVuY3Rpb24gZ2V0X25hbWVpZF9vZl9vcHRpbl9mcm9tX3Jhd3R4KHVybCwgYXV0aCwgb3B0SW5JZCwgbG9nLCBjYWxsYmFjayl7XG4gICAgdGVzdExvZ2dpbmcoJ3N0ZXAgMiAtIGdldHRpbmcgbmFtZUlkIG9mIHJhdyB0cmFuc2FjdGlvbiBmcm9tIGJsb2NrY2hhaW4nKTtcbiAgICBpZihsb2cpIHRlc3RMb2dnaW5nKCd0aGUgdHhJZCB3aWxsIGJlIGFkZGVkIGEgYml0IGxhdGVyIGFzIHNvb24gYXMgdGhlIHNjaGVkdWxlIHBpY2tzIHVwIHRoZSBqb2IgYW5kIGluc2VydHMgaXQgaW50byB0aGUgYmxvY2tjaGFpbi4gaXQgZG9lcyBub3QgaGFwcGVuIGltbWVkaWF0ZWx5LiB3YWl0aW5nLi4uJyk7XG4gICAgbGV0IHJ1bm5pbmcgPSB0cnVlO1xuICAgIGxldCBjb3VudGVyID0gMDtcbiAgICBsZXQgb3VyX29wdEluID0gbnVsbDtcbiAgICBsZXQgbmFtZUlkID0gbnVsbDtcbiAgICBhd2FpdCAoYXN5bmMgZnVuY3Rpb24gbG9vcCgpIHtcbiAgICAgICAgd2hpbGUocnVubmluZyAmJiArK2NvdW50ZXI8NTApeyAvL3RyeWluZyA1MHggdG8gZ2V0IG9wdC1pblxuXG4gICAgICAgICAgICB0ZXN0TG9nZ2luZygnZmluZCBvcHQtSW4nLG9wdEluSWQpO1xuICAgICAgICAgICAgb3VyX29wdEluID0gT3B0SW5zLmZpbmRPbmUoe19pZDogb3B0SW5JZH0pO1xuICAgICAgICAgICAgaWYob3VyX29wdEluLnR4SWQhPT11bmRlZmluZWQpe1xuICAgICAgICAgICAgICAgIHRlc3RMb2dnaW5nKCdmb3VuZCB0eElkIG9mIG9wdC1Jbicsb3VyX29wdEluLnR4SWQpO1xuICAgICAgICAgICAgICAgIHJ1bm5pbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgdGVzdExvZ2dpbmcoJ2RpZCBub3QgZmluZCB0eElkIHlldCBmb3Igb3B0LUluLUlkJyxvdXJfb3B0SW4uX2lkKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYXdhaXQgbmV3IFByb21pc2UocmVzb2x2ZSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIDMwMDApKTtcbiAgICAgICAgfVxuICAgIH0pKCk7XG5cbiAgICB0cnl7XG5cbiAgICAgICAgY2hhaS5hc3NlcnQuZXF1YWwob3VyX29wdEluLl9pZCxvcHRJbklkKTtcbiAgICAgICAgaWYobG9nKSB0ZXN0TG9nZ2luZygnb3B0SW46JyxvdXJfb3B0SW4pO1xuICAgICAgICBuYW1lSWQgPSBnZXROYW1lSWRPZlJhd1RyYW5zYWN0aW9uKHVybCxhdXRoLG91cl9vcHRJbi50eElkKTtcbiAgICAgICAgY2hhaS5hc3NlcnQuZXF1YWwoXCJlL1wiK291cl9vcHRJbi5uYW1lSWQsbmFtZUlkKTtcblxuICAgICAgICBpZihsb2cpIHRlc3RMb2dnaW5nKCduYW1lSWQ6JyxuYW1lSWQpO1xuICAgICAgICBjaGFpLmFzc2VydC5ub3RFcXVhbChuYW1lSWQsbnVsbCk7XG4gICAgICAgIGNoYWkuYXNzZXJ0LmlzQmVsb3coY291bnRlciw1MCxcIk9wdEluIG5vdCBmb3VuZCBhZnRlciByZXRyaWVzXCIpO1xuICAgICAgICBjYWxsYmFjayhudWxsLG5hbWVJZCk7XG4gICAgfVxuICAgIGNhdGNoKGVycm9yKXtcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsbmFtZUlkKTtcbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmZXRjaENvbmZpcm1MaW5rRnJvbVBvcDNNYWlsKGhvc3RuYW1lLHBvcnQsdXNlcm5hbWUscGFzc3dvcmQsYWxpY2VkYXBwX3VybCxsb2cpIHtcbiAgICBjb25zdCBzeW5jRnVuYyA9IE1ldGVvci53cmFwQXN5bmMoZmV0Y2hfY29uZmlybV9saW5rX2Zyb21fcG9wM19tYWlsKTtcbiAgICByZXR1cm4gc3luY0Z1bmMoaG9zdG5hbWUscG9ydCx1c2VybmFtZSxwYXNzd29yZCxhbGljZWRhcHBfdXJsLGxvZyk7XG59XG5cbmZ1bmN0aW9uIGZldGNoX2NvbmZpcm1fbGlua19mcm9tX3BvcDNfbWFpbChob3N0bmFtZSxwb3J0LHVzZXJuYW1lLHBhc3N3b3JkLGFsaWNlZGFwcF91cmwsbG9nLGNhbGxiYWNrKSB7XG5cbiAgICB0ZXN0TG9nZ2luZyhcInN0ZXAgMyAtIGdldHRpbmcgZW1haWwgZnJvbSBib2JzIGluYm94XCIpO1xuICAgIC8vaHR0cHM6Ly9naXRodWIuY29tL2RpdGVzaC9ub2RlLXBvcGxpYi9ibG9iL21hc3Rlci9kZW1vcy9yZXRyaWV2ZS1hbGwuanNcbiAgICB2YXIgY2xpZW50ID0gbmV3IFBPUDNDbGllbnQocG9ydCwgaG9zdG5hbWUsIHtcbiAgICAgICAgdGxzZXJyczogZmFsc2UsXG4gICAgICAgIGVuYWJsZXRsczogZmFsc2UsXG4gICAgICAgIGRlYnVnOiBmYWxzZVxuICAgIH0pO1xuXG4gICAgY2xpZW50Lm9uKFwiY29ubmVjdFwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdGVzdExvZ2dpbmcoXCJDT05ORUNUIHN1Y2Nlc3NcIik7XG4gICAgICAgIGNsaWVudC5sb2dpbih1c2VybmFtZSwgcGFzc3dvcmQpO1xuICAgICAgICBjbGllbnQub24oXCJsb2dpblwiLCBmdW5jdGlvbihzdGF0dXMsIHJhd2RhdGEpIHtcbiAgICAgICAgICAgIGlmIChzdGF0dXMpIHtcbiAgICAgICAgICAgICAgICB0ZXN0TG9nZ2luZyhcIkxPR0lOL1BBU1Mgc3VjY2Vzc1wiKTtcbiAgICAgICAgICAgICAgICBjbGllbnQubGlzdCgpO1xuXG4gICAgICAgICAgICAgICAgY2xpZW50Lm9uKFwibGlzdFwiLCBmdW5jdGlvbihzdGF0dXMsIG1zZ2NvdW50LCBtc2dudW1iZXIsIGRhdGEsIHJhd2RhdGEpIHtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoc3RhdHVzID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZXJyID0gXCJMSVNUIGZhaWxlZFwiKyBtc2dudW1iZXI7XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGllbnQucnNldCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyLCBudWxsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGxvZykgdGVzdExvZ2dpbmcoXCJMSVNUIHN1Y2Nlc3Mgd2l0aCBcIiArIG1zZ2NvdW50ICsgXCIgZWxlbWVudChzKVwiLCcnKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy9jaGFpLmV4cGVjdChtc2djb3VudCkudG8uYmUuYWJvdmUoMCwgJ25vIGVtYWlsIGluIGJvYnMgaW5ib3gnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtc2djb3VudCA+IDApe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWVudC5yZXRyKDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWVudC5vbihcInJldHJcIiwgZnVuY3Rpb24oc3RhdHVzLCBtc2dudW1iZXIsIG1haWxkYXRhLCByYXdkYXRhKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN0YXR1cyA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYobG9nKSB0ZXN0TG9nZ2luZyhcIlJFVFIgc3VjY2VzcyBcIiArIG1zZ251bWJlcik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vaHR0cHM6Ly9naXRodWIuY29tL2VtYWlsanMvZW1haWxqcy1taW1lLWNvZGVjXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgaHRtbCAgPSBxdW90ZWRQcmludGFibGVEZWNvZGUobWFpbGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYob3MuaG9zdG5hbWUoKSE9PSdyZWd0ZXN0Jyl7IC8vdGhpcyBpcyBwcm9iYWJseSBhIHNlbGVuaXVtIHRlc3QgZnJvbSBvdXRzaWRlIGRvY2tlciAgLSBzbyByZXBsYWNlIFVSTCBzbyBpdCBjYW4gYmUgY29uZmlybWVkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGh0bWwgPSByZXBsYWNlQWxsKGh0bWwsJ2h0dHA6Ly8xNzIuMjAuMC44JywnaHR0cDovL2xvY2FsaG9zdCcpOyAgLy9UT0RPIHB1dCB0aGlzIElQIGluc2lkZSBhIGNvbmZpZ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hhaS5leHBlY3QoaHRtbC5pbmRleE9mKGFsaWNlZGFwcF91cmwpKS50by5ub3QuZXF1YWwoLTEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbGlua2RhdGEgPSAgaHRtbC5zdWJzdHJpbmcoaHRtbC5pbmRleE9mKGFsaWNlZGFwcF91cmwpLGh0bWwuaW5kZXhPZihcIidcIixodG1sLmluZGV4T2YoYWxpY2VkYXBwX3VybCkpKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hhaS5leHBlY3QobGlua2RhdGEpLnRvLm5vdC5iZS5udWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYobG9nICYmICEobG9nPT09dHJ1ZSkpY2hhaS5leHBlY3QoaHRtbC5pbmRleE9mKGxvZykpLnRvLm5vdC5lcXVhbCgtMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCByZXF1ZXN0RGF0YSA9IHtcImxpbmtkYXRhXCI6bGlua2RhdGEsXCJodG1sXCI6aHRtbH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpZW50LmRlbGUobXNnbnVtYmVyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWVudC5vbihcImRlbGVcIiwgZnVuY3Rpb24oc3RhdHVzLCBtc2dudW1iZXIsIGRhdGEsIHJhd2RhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGllbnQucXVpdCgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpZW50LmVuZCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWVudCA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCxsaW5rZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZXJyID0gXCJSRVRSIGZhaWxlZCBmb3IgbXNnbnVtYmVyIFwiKyBtc2dudW1iZXI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGllbnQucnNldCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpZW50LmVuZCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpZW50ID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVyciwgbnVsbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZXJyID0gXCJlbXB0eSBtYWlsYm94XCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyLCBudWxsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGllbnQucXVpdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaWVudC5lbmQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGllbnQgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnN0IGVyciA9IFwiTE9HSU4vUEFTUyBmYWlsZWRcIjtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnIsIG51bGwpO1xuICAgICAgICAgICAgICAgIGNsaWVudC5xdWl0KCk7XG4gICAgICAgICAgICAgICAgY2xpZW50LmVuZCgpO1xuICAgICAgICAgICAgICAgIGNsaWVudCA9IG51bGw7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gcmVwbGFjZUFsbChzdHIsIGZpbmQsIHJlcGxhY2UpIHtcbiAgICByZXR1cm4gc3RyLnJlcGxhY2UobmV3IFJlZ0V4cChmaW5kLCAnZycpLCByZXBsYWNlKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlbGV0ZUFsbEVtYWlsc0Zyb21Qb3AzKGhvc3RuYW1lLHBvcnQsdXNlcm5hbWUscGFzc3dvcmQsbG9nKSB7XG4gICAgY29uc3Qgc3luY0Z1bmMgPSBNZXRlb3Iud3JhcEFzeW5jKGRlbGV0ZV9hbGxfZW1haWxzX2Zyb21fcG9wMyk7XG4gICAgcmV0dXJuIHN5bmNGdW5jKGhvc3RuYW1lLHBvcnQsdXNlcm5hbWUscGFzc3dvcmQsbG9nKTtcbn1cblxuZnVuY3Rpb24gZGVsZXRlX2FsbF9lbWFpbHNfZnJvbV9wb3AzKGhvc3RuYW1lLHBvcnQsdXNlcm5hbWUscGFzc3dvcmQsbG9nLGNhbGxiYWNrKSB7XG5cbiAgICB0ZXN0TG9nZ2luZyhcImRlbGV0aW5nIGFsbCBlbWFpbHMgZnJvbSBib2JzIGluYm94XCIpO1xuICAgIC8vaHR0cHM6Ly9naXRodWIuY29tL2RpdGVzaC9ub2RlLXBvcGxpYi9ibG9iL21hc3Rlci9kZW1vcy9yZXRyaWV2ZS1hbGwuanNcbiAgICB2YXIgY2xpZW50ID0gbmV3IFBPUDNDbGllbnQocG9ydCwgaG9zdG5hbWUsIHtcbiAgICAgICAgdGxzZXJyczogZmFsc2UsXG4gICAgICAgIGVuYWJsZXRsczogZmFsc2UsXG4gICAgICAgIGRlYnVnOiBmYWxzZVxuICAgIH0pO1xuXG4gICAgY2xpZW50Lm9uKFwiY29ubmVjdFwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdGVzdExvZ2dpbmcoXCJDT05ORUNUIHN1Y2Nlc3NcIik7XG4gICAgICAgIGNsaWVudC5sb2dpbih1c2VybmFtZSwgcGFzc3dvcmQpO1xuICAgICAgICBjbGllbnQub24oXCJsb2dpblwiLCBmdW5jdGlvbihzdGF0dXMsIHJhd2RhdGEpIHtcbiAgICAgICAgICAgIGlmIChzdGF0dXMpIHtcbiAgICAgICAgICAgICAgICB0ZXN0TG9nZ2luZyhcIkxPR0lOL1BBU1Mgc3VjY2Vzc1wiKTtcbiAgICAgICAgICAgICAgICBjbGllbnQubGlzdCgpO1xuXG4gICAgICAgICAgICAgICAgY2xpZW50Lm9uKFwibGlzdFwiLCBmdW5jdGlvbihzdGF0dXMsIG1zZ2NvdW50LCBtc2dudW1iZXIsIGRhdGEsIHJhd2RhdGEpIHtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoc3RhdHVzID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZXJyID0gXCJMSVNUIGZhaWxlZFwiKyBtc2dudW1iZXI7XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGllbnQucnNldCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyLCBudWxsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGxvZykgdGVzdExvZ2dpbmcoXCJMSVNUIHN1Y2Nlc3Mgd2l0aCBcIiArIG1zZ2NvdW50ICsgXCIgZWxlbWVudChzKVwiLCcnKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy9jaGFpLmV4cGVjdChtc2djb3VudCkudG8uYmUuYWJvdmUoMCwgJ25vIGVtYWlsIGluIGJvYnMgaW5ib3gnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtc2djb3VudCA+IDApe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcihsZXQgaSA9IDA7aTw9bXNnY291bnQ7aSsrKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpZW50LmRlbGUoaSsxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpZW50Lm9uKFwiZGVsZVwiLCBmdW5jdGlvbihzdGF0dXMsIG1zZ251bWJlciwgZGF0YSwgcmF3ZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVzdExvZ2dpbmcoXCJkZWxldGVkIGVtYWlsXCIrKGkrMSkrXCIgc3RhdHVzOlwiK3N0YXR1cyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKGk9PW1zZ2NvdW50LTEpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpZW50LnF1aXQoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpZW50LmVuZCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpZW50ID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKGxvZykgdGVzdExvZ2dpbmcoXCJhbGwgZW1haWxzIGRlbGV0ZWRcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCdhbGwgZW1haWxzIGRlbGV0ZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGVyciA9IFwiZW1wdHkgbWFpbGJveFwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIGVycik7IC8vd2UgZG8gbm90IHNlbmQgYW4gZXJyb3IgaGVyZSB3aGVuIGluYm94IGlzIGVtcHR5XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpZW50LnF1aXQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGllbnQuZW5kKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpZW50ID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zdCBlcnIgPSBcIkxPR0lOL1BBU1MgZmFpbGVkXCI7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyLCBudWxsKTtcbiAgICAgICAgICAgICAgICBjbGllbnQucXVpdCgpO1xuICAgICAgICAgICAgICAgIGNsaWVudC5lbmQoKTtcbiAgICAgICAgICAgICAgICBjbGllbnQgPSBudWxsO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjb25maXJtTGluayhjb25maXJtTGluaykge1xuICAgIGNvbnN0IHN5bmNGdW5jID0gTWV0ZW9yLndyYXBBc3luYyhjb25maXJtX2xpbmspO1xuICAgIHJldHVybiBzeW5jRnVuYyhjb25maXJtTGluayk7XG59XG5cbmZ1bmN0aW9uIGNvbmZpcm1fbGluayhjb25maXJtTGluayxjYWxsYmFjayl7XG4gICAgdGVzdExvZ2dpbmcoXCJjbGlja2FibGUgbGluazpcIixjb25maXJtTGluayk7XG4gICAgY29uc3QgZG9pQ29uZmlybWxpbmtSZXN1bHQgPSBnZXRIdHRwR0VUKGNvbmZpcm1MaW5rLCcnKTtcbiAgICB0cnl7XG4gICAgY2hhaS5leHBlY3QoZG9pQ29uZmlybWxpbmtSZXN1bHQuY29udGVudCkudG8uaGF2ZS5zdHJpbmcoJ0FOTUVMRFVORyBFUkZPTEdSRUlDSCcpO1xuICAgIGNoYWkuZXhwZWN0KGRvaUNvbmZpcm1saW5rUmVzdWx0LmNvbnRlbnQpLnRvLmhhdmUuc3RyaW5nKCdWaWVsZW4gRGFuayBmw7xyIElocmUgQW5tZWxkdW5nJyk7XG4gICAgY2hhaS5leHBlY3QoZG9pQ29uZmlybWxpbmtSZXN1bHQuY29udGVudCkudG8uaGF2ZS5zdHJpbmcoJ0locmUgQW5tZWxkdW5nIHdhciBlcmZvbGdyZWljaC4nKTtcbiAgICBjaGFpLmFzc2VydC5lcXVhbCgyMDAsIGRvaUNvbmZpcm1saW5rUmVzdWx0LnN0YXR1c0NvZGUpO1xuICAgIGNhbGxiYWNrKG51bGwsdHJ1ZSk7XG4gICAgfVxuICAgIGNhdGNoKGUpe1xuICAgICAgICBjYWxsYmFjayhlLG51bGwpO1xuICAgIH1cbiAgICBcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHZlcmlmeURPSShkQXBwVXJsLCBkQXBwVXJsQXV0aCwgbm9kZV91cmxfYWxpY2UsIHJwY0F1dGhBbGljZSwgc2VuZGVyX21haWwsIHJlY2lwaWVudF9tYWlsLG5hbWVJZCwgbG9nICl7XG4gICAgY29uc3Qgc3luY0Z1bmMgPSBNZXRlb3Iud3JhcEFzeW5jKHZlcmlmeV9kb2kpO1xuICAgIHJldHVybiBzeW5jRnVuYyhkQXBwVXJsLCBkQXBwVXJsQXV0aCwgbm9kZV91cmxfYWxpY2UsIHJwY0F1dGhBbGljZSwgc2VuZGVyX21haWwsIHJlY2lwaWVudF9tYWlsLG5hbWVJZCwgbG9nICk7XG59XG5cblxuYXN5bmMgZnVuY3Rpb24gdmVyaWZ5X2RvaShkQXBwVXJsLCBkQXBwVXJsQXV0aCwgbm9kZV91cmxfYWxpY2UsIHJwY0F1dGhBbGljZSwgc2VuZGVyX21haWwsIHJlY2lwaWVudF9tYWlsLG5hbWVJZCwgbG9nLCBjYWxsYmFjayl7XG4gICAgbGV0IG91cl9yZWNpcGllbnRfbWFpbCA9cmVjaXBpZW50X21haWw7XG4gICAgaWYoQXJyYXkuaXNBcnJheShyZWNpcGllbnRfbWFpbCkpe1xuICAgICAgICBvdXJfcmVjaXBpZW50X21haWw9cmVjaXBpZW50X21haWxbMF07XG4gICAgfVxuICAgIGNvbnN0IHVybFZlcmlmeSA9IGRBcHBVcmwrJy9hcGkvdjEvb3B0LWluL3ZlcmlmeSc7XG4gICAgY29uc3QgcmVjaXBpZW50X3B1YmxpY19rZXkgPSBSZWNpcGllbnRzLmZpbmRPbmUoe2VtYWlsOiBvdXJfcmVjaXBpZW50X21haWx9KS5wdWJsaWNLZXk7XG4gICAgbGV0IHJlc3VsdFZlcmlmeSA9e307XG4gICAgbGV0IHN0YXR1c1ZlcmlmeSA9e307XG5cbiAgICBjb25zdCBkYXRhVmVyaWZ5ID0ge1xuICAgICAgICByZWNpcGllbnRfbWFpbDogb3VyX3JlY2lwaWVudF9tYWlsLFxuICAgICAgICBzZW5kZXJfbWFpbDogc2VuZGVyX21haWwsXG4gICAgICAgIG5hbWVfaWQ6IG5hbWVJZCxcbiAgICAgICAgcmVjaXBpZW50X3B1YmxpY19rZXk6IHJlY2lwaWVudF9wdWJsaWNfa2V5XG4gICAgfTtcblxuICAgIGNvbnN0IGhlYWRlcnNWZXJpZnkgPSB7XG4gICAgICAgICdDb250ZW50LVR5cGUnOidhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICAgJ1gtVXNlci1JZCc6ZEFwcFVybEF1dGgudXNlcklkLFxuICAgICAgICAnWC1BdXRoLVRva2VuJzpkQXBwVXJsQXV0aC5hdXRoVG9rZW5cbiAgICB9O1xuICAgIGxldCBydW5uaW5nID0gdHJ1ZTtcbiAgICBsZXQgY291bnRlciA9IDA7XG5cbiAgICBhd2FpdCAoYXN5bmMgZnVuY3Rpb24gbG9vcCgpIHtcbiAgICAgICAgd2hpbGUocnVubmluZyAmJiArK2NvdW50ZXI8NTApeyAvL3RyeWluZyA1MHggdG8gZ2V0IGVtYWlsIGZyb20gYm9icyBtYWlsYm94XG4gICAgICAgICAgICB0cnl7XG4gICAgICAgICAgICAgICAgdGVzdExvZ2dpbmcoJ1N0ZXAgNTogdmVyaWZ5aW5nIG9wdC1pbjonLCB7ZGF0YTpkYXRhVmVyaWZ5fSk7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVhbGRhdGFWZXJpZnkgPSB7IGRhdGE6IGRhdGFWZXJpZnksIGhlYWRlcnM6IGhlYWRlcnNWZXJpZnkgfTtcbiAgICAgICAgICAgICAgICByZXN1bHRWZXJpZnkgPSBnZXRIdHRwR0VUZGF0YSh1cmxWZXJpZnksIHJlYWxkYXRhVmVyaWZ5KTtcbiAgICAgICAgICAgICAgICB0ZXN0TG9nZ2luZygncmVzdWx0IC9vcHQtaW4vdmVyaWZ5Oicse3N0YXR1czpyZXN1bHRWZXJpZnkuZGF0YS5zdGF0dXMsdmFsOnJlc3VsdFZlcmlmeS5kYXRhLmRhdGEudmFsfSApO1xuICAgICAgICAgICAgICAgIHN0YXR1c1ZlcmlmeSA9IHJlc3VsdFZlcmlmeS5zdGF0dXNDb2RlO1xuICAgICAgICAgICAgICAgIGlmKHJlc3VsdFZlcmlmeS5kYXRhLmRhdGEudmFsPT09dHJ1ZSkgcnVubmluZyA9IGZhbHNlO1xuXG4gICAgICAgICAgICB9Y2F0Y2goZXgpIHtcbiAgICAgICAgICAgICAgICB0ZXN0TG9nZ2luZygndHJ5aW5nIHRvIHZlcmlmeSBvcHQtaW4gLSBzbyBmYXIgbm8gc3VjY2VzczonLGV4KTtcbiAgICAgICAgICAgICAgICAvL2dlbmVyYXRldG9hZGRyZXNzKG5vZGVfdXJsX2FsaWNlLCBycGNBdXRoQWxpY2UsIGdsb2JhbC5hbGljZUFkZHJlc3MsIDEsIHRydWUpO1xuICAgICAgICAgICAgICAgIC8vYXdhaXQgbmV3IFByb21pc2UocmVzb2x2ZSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIDIwMDApKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZpbmFsbHl7XG4gICAgICAgICAgICAgICAgZ2VuZXJhdGV0b2FkZHJlc3Mobm9kZV91cmxfYWxpY2UsIHJwY0F1dGhBbGljZSwgZ2xvYmFsLmFsaWNlQWRkcmVzcywgMSwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgYXdhaXQgbmV3IFByb21pc2UocmVzb2x2ZSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIDIwMDApKTsgXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgIH0pKCk7XG4gICAgICAgIHRyeXtcbiAgICAgICAgY2hhaS5hc3NlcnQuZXF1YWwoc3RhdHVzVmVyaWZ5LDIwMCk7XG4gICAgICAgIGNoYWkuYXNzZXJ0LmVxdWFsKHJlc3VsdFZlcmlmeS5kYXRhLmRhdGEudmFsLHRydWUpO1xuICAgICAgICBjaGFpLmFzc2VydC5pc0JlbG93KGNvdW50ZXIsNTApO1xuICAgICAgICBjYWxsYmFjayhudWxsLHRydWUpO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoKGVycm9yKXtcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsZmFsc2UpO1xuICAgICAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVVc2VyKHVybCxhdXRoLHVzZXJuYW1lLHRlbXBsYXRlVVJMLGxvZyl7XG4gICAgY29uc3QgaGVhZGVyc1VzZXIgPSB7XG4gICAgICAgICdDb250ZW50LVR5cGUnOidhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICAgJ1gtVXNlci1JZCc6YXV0aC51c2VySWQsXG4gICAgICAgICdYLUF1dGgtVG9rZW4nOmF1dGguYXV0aFRva2VuXG4gICAgfVxuICAgIGNvbnN0IG1haWxUZW1wbGF0ZSA9IHtcbiAgICAgICAgXCJzdWJqZWN0XCI6IFwiSGVsbG8gaSBhbSBcIit1c2VybmFtZSxcbiAgICAgICAgXCJyZWRpcmVjdFwiOiBcImh0dHBzOi8vd3d3LmRvaWNoYWluLm9yZy92aWVsZW4tZGFuay9cIixcbiAgICAgICAgXCJyZXR1cm5QYXRoXCI6ICB1c2VybmFtZStcIi10ZXN0QGRvaWNoYWluLm9yZ1wiLFxuICAgICAgICBcInRlbXBsYXRlVVJMXCI6IHRlbXBsYXRlVVJMXG4gICAgfVxuICAgIGNvbnN0IHVybFVzZXJzID0gdXJsKycvYXBpL3YxL3VzZXJzJztcbiAgICBjb25zdCBkYXRhVXNlciA9IHtcInVzZXJuYW1lXCI6dXNlcm5hbWUsXCJlbWFpbFwiOnVzZXJuYW1lK1wiLXRlc3RAZG9pY2hhaW4ub3JnXCIsXCJwYXNzd29yZFwiOlwicGFzc3dvcmRcIixcIm1haWxUZW1wbGF0ZVwiOm1haWxUZW1wbGF0ZX1cblxuICAgIGNvbnN0IHJlYWxEYXRhVXNlcj0geyBkYXRhOiBkYXRhVXNlciwgaGVhZGVyczogaGVhZGVyc1VzZXJ9O1xuICAgIGlmKGxvZykgdGVzdExvZ2dpbmcoJ2NyZWF0ZVVzZXI6JywgcmVhbERhdGFVc2VyKTtcbiAgICBsZXQgcmVzID0gZ2V0SHR0cFBPU1QodXJsVXNlcnMscmVhbERhdGFVc2VyKTtcbiAgICBpZihsb2cpIHRlc3RMb2dnaW5nKFwicmVzcG9uc2VcIixyZXMpO1xuICAgIGNoYWkuYXNzZXJ0LmVxdWFsKDIwMCwgcmVzLnN0YXR1c0NvZGUpO1xuICAgIGNoYWkuYXNzZXJ0LmVxdWFsKHJlcy5kYXRhLnN0YXR1cyxcInN1Y2Nlc3NcIik7XG4gICAgcmV0dXJuIHJlcy5kYXRhLmRhdGEudXNlcmlkO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZmluZFVzZXIodXNlcklkKXtcbiAgICBjb25zdCByZXMgPSBBY2NvdW50cy51c2Vycy5maW5kT25lKHtfaWQ6dXNlcklkfSk7XG4gICAgY2hhaS5leHBlY3QocmVzKS50by5ub3QuYmUudW5kZWZpbmVkO1xuICAgIHJldHVybiByZXM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmaW5kT3B0SW4ob3B0SW5JZCxsb2cpe1xuICAgIGNvbnN0IHJlcyA9IE9wdElucy5maW5kT25lKHtfaWQ6b3B0SW5JZH0pO1xuICAgIGlmKGxvZyl0ZXN0TG9nZ2luZyhyZXMsb3B0SW5JZCk7XG4gICAgY2hhaS5leHBlY3QocmVzKS50by5ub3QuYmUudW5kZWZpbmVkO1xuICAgIHJldHVybiByZXM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBleHBvcnRPcHRJbnModXJsLGF1dGgsbG9nKXtcbiAgICBjb25zdCBoZWFkZXJzVXNlciA9IHtcbiAgICAgICAgJ0NvbnRlbnQtVHlwZSc6J2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAnWC1Vc2VyLUlkJzphdXRoLnVzZXJJZCxcbiAgICAgICAgJ1gtQXV0aC1Ub2tlbic6YXV0aC5hdXRoVG9rZW5cbiAgICB9O1xuXG4gICAgY29uc3QgdXJsRXhwb3J0ID0gdXJsKycvYXBpL3YxL2V4cG9ydCc7XG4gICAgY29uc3QgcmVhbERhdGFVc2VyPSB7aGVhZGVyczogaGVhZGVyc1VzZXJ9O1xuICAgIGxldCByZXMgPSBnZXRIdHRwR0VUZGF0YSh1cmxFeHBvcnQscmVhbERhdGFVc2VyKTtcbiAgICBpZihsb2cpIHRlc3RMb2dnaW5nKHJlcyxsb2cpO1xuICAgIGNoYWkuYXNzZXJ0LmVxdWFsKDIwMCwgcmVzLnN0YXR1c0NvZGUpO1xuICAgIGNoYWkuYXNzZXJ0LmVxdWFsKHJlcy5kYXRhLnN0YXR1cyxcInN1Y2Nlc3NcIik7XG4gICAgcmV0dXJuIHJlcy5kYXRhLmRhdGE7XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIHJlcXVlc3RDb25maXJtVmVyaWZ5QmFzaWNEb2kobm9kZV91cmxfYWxpY2UscnBjQXV0aEFsaWNlLCBkYXBwVXJsQWxpY2UsZGF0YUxvZ2luQWxpY2UsZGFwcFVybEJvYixyZWNpcGllbnRfbWFpbCxzZW5kZXJfbWFpbCxvcHRpb25hbERhdGEscmVjaXBpZW50X3BvcDN1c2VybmFtZSwgcmVjaXBpZW50X3BvcDNwYXNzd29yZCwgbG9nKSB7XG4gICAgY29uc3Qgc3luY0Z1bmMgPSBNZXRlb3Iud3JhcEFzeW5jKHJlcXVlc3RfY29uZmlybV92ZXJpZnlfYmFzaWNfZG9pKTtcbiAgICByZXR1cm4gc3luY0Z1bmMobm9kZV91cmxfYWxpY2UscnBjQXV0aEFsaWNlLCBkYXBwVXJsQWxpY2UsZGF0YUxvZ2luQWxpY2UsZGFwcFVybEJvYiwgcmVjaXBpZW50X21haWwsc2VuZGVyX21haWwsb3B0aW9uYWxEYXRhLHJlY2lwaWVudF9wb3AzdXNlcm5hbWUsIHJlY2lwaWVudF9wb3AzcGFzc3dvcmQsIGxvZyk7XG59XG5cblxuYXN5bmMgZnVuY3Rpb24gcmVxdWVzdF9jb25maXJtX3ZlcmlmeV9iYXNpY19kb2kobm9kZV91cmxfYWxpY2UscnBjQXV0aEFsaWNlLCBkYXBwVXJsQWxpY2UsZGF0YUxvZ2luQWxpY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXBwVXJsQm9iLCByZWNpcGllbnRfbWFpbCxzZW5kZXJfbWFpbF9pbixvcHRpb25hbERhdGEscmVjaXBpZW50X3BvcDN1c2VybmFtZSwgcmVjaXBpZW50X3BvcDNwYXNzd29yZCwgbG9nLCBjYWxsYmFjaykge1xuICAgIGlmKGxvZykgdGVzdExvZ2dpbmcoJ25vZGVfdXJsX2FsaWNlJyxub2RlX3VybF9hbGljZSk7XG4gICAgaWYobG9nKSB0ZXN0TG9nZ2luZygncnBjQXV0aEFsaWNlJyxycGNBdXRoQWxpY2UpO1xuICAgIGlmKGxvZykgdGVzdExvZ2dpbmcoJ2RhcHBVcmxBbGljZScsZGFwcFVybEFsaWNlKTtcbiAgICBpZihsb2cpIHRlc3RMb2dnaW5nKCdkYXRhTG9naW5BbGljZScsZGF0YUxvZ2luQWxpY2UpO1xuICAgIGlmKGxvZykgdGVzdExvZ2dpbmcoJ2RhcHBVcmxCb2InLGRhcHBVcmxCb2IpO1xuICAgIGlmKGxvZykgdGVzdExvZ2dpbmcoJ3JlY2lwaWVudF9tYWlsJyxyZWNpcGllbnRfbWFpbCk7XG4gICAgaWYobG9nKSB0ZXN0TG9nZ2luZygnc2VuZGVyX21haWxfaW4nLHNlbmRlcl9tYWlsX2luKTtcbiAgICBpZihsb2cpIHRlc3RMb2dnaW5nKCdvcHRpb25hbERhdGEnLG9wdGlvbmFsRGF0YSk7XG4gICAgaWYobG9nKSB0ZXN0TG9nZ2luZygncmVjaXBpZW50X3BvcDN1c2VybmFtZScscmVjaXBpZW50X3BvcDN1c2VybmFtZSk7XG4gICAgaWYobG9nKSB0ZXN0TG9nZ2luZygncmVjaXBpZW50X3BvcDNwYXNzd29yZCcscmVjaXBpZW50X3BvcDNwYXNzd29yZCk7XG5cblxuICAgIGxldCBzZW5kZXJfbWFpbCA9IHNlbmRlcl9tYWlsX2luO1xuICAgIGlmKGxvZykgdGVzdExvZ2dpbmcoJ2xvZyBpbnRvIGFsaWNlIGFuZCByZXF1ZXN0IERPSScpO1xuICAgIGxldCByZXN1bHREYXRhT3B0SW5UbXAgPSByZXF1ZXN0RE9JKGRhcHBVcmxBbGljZSwgZGF0YUxvZ2luQWxpY2UsIHJlY2lwaWVudF9tYWlsLCBzZW5kZXJfbWFpbCwgb3B0aW9uYWxEYXRhLCB0cnVlKTtcbiAgICBsZXQgcmVzdWx0RGF0YU9wdEluID0gcmVzdWx0RGF0YU9wdEluVG1wO1xuXG4gICAgaWYoQXJyYXkuaXNBcnJheShzZW5kZXJfbWFpbF9pbikpeyAgICAgICAgICAgICAgLy9TZWxlY3QgbWFzdGVyIGRvaSBmcm9tIHNlbmRlcnMgYW5kIHJlc3VsdFxuICAgICAgICBpZihsb2cpIHRlc3RMb2dnaW5nKCdNQVNURVIgRE9JOiAnLHJlc3VsdERhdGFPcHRJblRtcFswXSk7XG4gICAgICAgIHJlc3VsdERhdGFPcHRJbiA9IHJlc3VsdERhdGFPcHRJblRtcFswXTtcbiAgICAgICAgc2VuZGVyX21haWwgPSBzZW5kZXJfbWFpbF9pblswXTtcbiAgICB9XG5cbiAgICAvL2dlbmVyYXRpbmcgYSBibG9jayBzbyB0cmFuc2FjdGlvbiBnZXRzIGNvbmZpcm1lZCBhbmQgZGVsaXZlcmVkIHRvIGJvYi5cbiAgICBnZW5lcmF0ZXRvYWRkcmVzcyhub2RlX3VybF9hbGljZSwgcnBjQXV0aEFsaWNlLCBnbG9iYWwuYWxpY2VBZGRyZXNzLCAxLCB0cnVlKTtcbiAgICBsZXQgcnVubmluZyA9IHRydWU7XG4gICAgbGV0IGNvdW50ZXIgPSAwO1xuICAgIGxldCBjb25maXJtZWRMaW5rID0gXCJcIjtcbiAgICBjb25maXJtZWRMaW5rID0gYXdhaXQoYXN5bmMgZnVuY3Rpb24gbG9vcCgpIHtcbiAgICAgICAgd2hpbGUocnVubmluZyAmJiArK2NvdW50ZXI8NTApeyAvL3RyeWluZyA1MHggdG8gZ2V0IGVtYWlsIGZyb20gYm9icyBtYWlsYm94XG4gICAgICAgICAgICB0cnl7XG4gICAgICAgICAgICAgICAgdGVzdExvZ2dpbmcoJ3N0ZXAgMzogZ2V0dGluZyBlbWFpbCBmcm9tIGhvc3RuYW1lIScsb3MuaG9zdG5hbWUoKSk7XG4gICAgICAgICAgICAgICAgY29uc3QgbGluazJDb25maXJtID0gZmV0Y2hDb25maXJtTGlua0Zyb21Qb3AzTWFpbCgob3MuaG9zdG5hbWUoKT09J3JlZ3Rlc3QnKT8nbWFpbCc6J2xvY2FsaG9zdCcsIDExMCwgcmVjaXBpZW50X3BvcDN1c2VybmFtZSwgcmVjaXBpZW50X3BvcDNwYXNzd29yZCwgZGFwcFVybEJvYiwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIHRlc3RMb2dnaW5nKCdzdGVwIDQ6IGNvbmZpcm1pbmcgbGluaycsbGluazJDb25maXJtKTtcbiAgICAgICAgICAgICAgICBpZihsaW5rMkNvbmZpcm0hPW51bGwpe3J1bm5pbmc9ZmFsc2U7XG4gICAgICAgICAgICAgICAgY29uZmlybUxpbmsobGluazJDb25maXJtKTtcbiAgICAgICAgICAgICAgICBjb25maXJtZWRMaW5rPWxpbmsyQ29uZmlybTtcbiAgICAgICAgICAgICAgICB0ZXN0TG9nZ2luZygnY29uZmlybWVkJylcbiAgICAgICAgICAgICAgICByZXR1cm4gbGluazJDb25maXJtO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1jYXRjaChleCl7XG4gICAgICAgICAgICAgICAgdGVzdExvZ2dpbmcoJ3RyeWluZyB0byBnZXQgZW1haWwgLSBzbyBmYXIgbm8gc3VjY2VzczonLGNvdW50ZXIpO1xuICAgICAgICAgICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCAzMDAwKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgIH0pKCk7XG5cbiAgICBpZihvcy5ob3N0bmFtZSgpIT09J3JlZ3Rlc3QnKXsgLy9pZiB0aGlzIGlzIGEgc2VsZW5pdW0gdGVzdCBmcm9tIG91dHNpZGUgZG9ja2VyIC0gZG9uJ3QgdmVyaWZ5IERPSSBoZXJlIGZvciBzaW1wbGljaXR5IFxuICAgICAgICAgICAgdGVzdExvZ2dpbmcoJ3JldHVybmluZyB0byB0ZXN0IHdpdGhvdXQgRE9JLXZlcmlmaWNhdGlvbiB3aGlsZSBkb2luZyBzZWxlbml1bSBvdXRzaWRlIGRvY2tlcicpO1xuICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwge3N0YXR1czogXCJET0kgY29uZmlybWVkXCJ9KTtcbiAgICAgICAgICAgLy8gcmV0dXJuO1xuICAgIH1lbHNle1xuICAgICAgICBsZXQgbmFtZUlkPW51bGw7XG4gICAgICAgIHRyeXtcbiAgICAgICAgICAgIGNoYWkuYXNzZXJ0LmlzQmVsb3coY291bnRlciw1MCk7XG4gICAgICAgICAgICAvL2NvbmZpcm1MaW5rKGNvbmZpcm1lZExpbmspO1xuICAgICAgICAgICAgY29uc3QgbmFtZUlkID0gZ2V0TmFtZUlkT2ZPcHRJbkZyb21SYXdUeChub2RlX3VybF9hbGljZSxycGNBdXRoQWxpY2UscmVzdWx0RGF0YU9wdEluLmRhdGEuaWQsdHJ1ZSk7XG4gICAgICAgICAgICBpZihsb2cpIHRlc3RMb2dnaW5nKCdnb3QgbmFtZUlkJyxuYW1lSWQpO1xuICAgICAgICAgICAgZ2VuZXJhdGV0b2FkZHJlc3Mobm9kZV91cmxfYWxpY2UsIHJwY0F1dGhBbGljZSwgZ2xvYmFsLmFsaWNlQWRkcmVzcywgMSwgdHJ1ZSk7XG4gICAgICAgICAgICB0ZXN0TG9nZ2luZygnYmVmb3JlIHZlcmlmaWNhdGlvbicpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZihBcnJheS5pc0FycmF5KHNlbmRlcl9tYWlsX2luKSl7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IHNlbmRlcl9tYWlsX2luLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICAgICAgICAgICAgICBsZXQgdG1wSWQgPSBpbmRleD09MCA/IG5hbWVJZCA6IG5hbWVJZCtcIi1cIisoaW5kZXgpOyAvL2dldCBuYW1laWQgb2YgY29ET0lzIGJhc2VkIG9uIG1hc3RlclxuICAgICAgICAgICAgICAgICAgICB0ZXN0TG9nZ2luZyhcIk5hbWVJZCBvZiBjb0RvaTogXCIsdG1wSWQpO1xuICAgICAgICAgICAgICAgIHZlcmlmeURPSShkYXBwVXJsQWxpY2UsIGRhdGFMb2dpbkFsaWNlLCBub2RlX3VybF9hbGljZSwgcnBjQXV0aEFsaWNlLCBzZW5kZXJfbWFpbF9pbltpbmRleF0sIHJlY2lwaWVudF9tYWlsLCB0bXBJZCwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICB2ZXJpZnlET0koZGFwcFVybEFsaWNlLCBkYXRhTG9naW5BbGljZSwgbm9kZV91cmxfYWxpY2UsIHJwY0F1dGhBbGljZSwgc2VuZGVyX21haWwsIHJlY2lwaWVudF9tYWlsLCBuYW1lSWQsIHRydWUpOyAvL25lZWQgdG8gZ2VuZXJhdGUgdHdvIGJsb2NrcyB0byBtYWtlIGJsb2NrIHZpc2libGUgb24gYWxpY2VcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRlc3RMb2dnaW5nKCdhZnRlciB2ZXJpZmljYXRpb24nKTtcbiAgICAgICAgICAgIC8vY29uZmlybUxpbmsoY29uZmlybWVkTGluayk7XG4gICAgICAgICAgICBjYWxsYmFjayhudWxsLCB7b3B0SW46IHJlc3VsdERhdGFPcHRJbiwgbmFtZUlkOiBuYW1lSWQsY29uZmlybUxpbms6IGNvbmZpcm1lZExpbmt9KTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaChlcnJvcil7XG4gICAgICAgICAgICBjYWxsYmFjayhlcnJvciwge29wdEluOiByZXN1bHREYXRhT3B0SW4sIG5hbWVJZDogbmFtZUlkfSk7XG4gICAgICAgIH1cbiAgICB9XG5cblxufVxuXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlVXNlcih1cmwsYXV0aCx1cGRhdGVJZCxtYWlsVGVtcGxhdGUsbG9nKXtcbiAgICBjb25zdCBoZWFkZXJzVXNlciA9IHtcbiAgICAgICAgJ0NvbnRlbnQtVHlwZSc6J2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAnWC1Vc2VyLUlkJzphdXRoLnVzZXJJZCxcbiAgICAgICAgJ1gtQXV0aC1Ub2tlbic6YXV0aC5hdXRoVG9rZW5cbiAgICB9XG5cbiAgICBjb25zdCBkYXRhVXNlciA9IHtcIm1haWxUZW1wbGF0ZVwiOm1haWxUZW1wbGF0ZX07XG4gICAgaWYobG9nKSB0ZXN0TG9nZ2luZygndXJsOicsIHVybCk7XG4gICAgY29uc3QgdXJsVXNlcnMgPSB1cmwrJy9hcGkvdjEvdXNlcnMvJyt1cGRhdGVJZDtcbiAgICBjb25zdCByZWFsRGF0YVVzZXI9IHsgZGF0YTogZGF0YVVzZXIsIGhlYWRlcnM6IGhlYWRlcnNVc2VyfTtcbiAgICBpZihsb2cpIHRlc3RMb2dnaW5nKCd1cGRhdGVVc2VyOicsIHJlYWxEYXRhVXNlcik7XG4gICAgbGV0IHJlcyA9IEhUVFAucHV0KHVybFVzZXJzLHJlYWxEYXRhVXNlcik7XG4gICAgaWYobG9nKSB0ZXN0TG9nZ2luZyhcInJlc3BvbnNlXCIscmVzKTtcbiAgICBjaGFpLmFzc2VydC5lcXVhbCgyMDAsIHJlcy5zdGF0dXNDb2RlKTtcbiAgICBjaGFpLmFzc2VydC5lcXVhbChyZXMuZGF0YS5zdGF0dXMsXCJzdWNjZXNzXCIpO1xuICAgIGNvbnN0IHVzRGF0ID0gQWNjb3VudHMudXNlcnMuZmluZE9uZSh7X2lkOnVwZGF0ZUlkfSkucHJvZmlsZS5tYWlsVGVtcGxhdGU7XG4gICAgaWYobG9nKSB0ZXN0TG9nZ2luZyhcIklucHV0VGVtcGxhdGVcIixkYXRhVXNlci5tYWlsVGVtcGxhdGUpO1xuICAgIGlmKGxvZykgdGVzdExvZ2dpbmcoXCJSZXN1bHRUZW1wbGF0ZVwiLHVzRGF0KTtcbiAgICBjaGFpLmV4cGVjdCh1c0RhdCkudG8ubm90LmJlLnVuZGVmaW5lZDtcbiAgICBjaGFpLmFzc2VydC5lcXVhbChkYXRhVXNlci5tYWlsVGVtcGxhdGUudGVtcGxhdGVVUkwsdXNEYXQudGVtcGxhdGVVUkwpO1xuICAgIHJldHVybiB1c0RhdDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlc2V0VXNlcnMoKXtcbiAgICBBY2NvdW50cy51c2Vycy5yZW1vdmUoXG4gICAgICAgIHtcInVzZXJuYW1lXCI6XG4gICAgICAgIHtcIiRuZVwiOlwiYWRtaW5cIn1cbiAgICAgICAgfVxuICAgICk7XG59XG4iLCJpbXBvcnQge2dldEh0dHBQT1NUfSBmcm9tIFwiLi4vLi4vLi4vc2VydmVyL2FwaS9odHRwXCI7XG5pbXBvcnQge2xvZ0Jsb2NrY2hhaW4sIHRlc3RMb2dnaW5nfSBmcm9tIFwiLi4vLi4vLi4vaW1wb3J0cy9zdGFydHVwL3NlcnZlci9sb2ctY29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHtjaGFpfSBmcm9tICdtZXRlb3IvcHJhY3RpY2FsbWV0ZW9yOmNoYWknO1xuaW1wb3J0IHtNZXRlb3J9IGZyb20gXCJtZXRlb3IvbWV0ZW9yXCI7XG5jb25zdCBvcyA9IHJlcXVpcmUoJ29zJyk7XG5sZXQgc3VkbyA9IChvcy5ob3N0bmFtZSgpPT0ncmVndGVzdCcpPydzdWRvICc6JydcbmNvbnN0IGhlYWRlcnMgPSB7ICdDb250ZW50LVR5cGUnOid0ZXh0L3BsYWluJyAgfTtcbmNvbnN0IGV4ZWMgPSByZXF1aXJlKCdjaGlsZF9wcm9jZXNzJykuZXhlYztcblxuZXhwb3J0IGZ1bmN0aW9uIGluaXRCbG9ja2NoYWluKG5vZGVfdXJsX2FsaWNlLG5vZGVfdXJsX2JvYixycGNBdXRoLHByaXZLZXlCb2IsbG9nKSB7ICAgICAgICAgICAgLy9jb25uZWN0IG5vZGVzIChhbGljZSAmIGJvYikgYW5kIGdlbmVyYXRlIERPSSAob25seSBpZiBub3QgY29ubmVjdGVkKVxuXG4gICAgY29uc29sZS5sb2coXCJpbXBvcnRpbmcgcHJpdmF0ZSBrZXk6XCIrcHJpdktleUJvYik7XG4gICAgaW1wb3J0UHJpdktleShub2RlX3VybF9ib2IsIHJwY0F1dGgsIHByaXZLZXlCb2IsIHRydWUsIGxvZyk7XG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgYWxpY2VDb250YWluZXJJZCA9IGdldENvbnRhaW5lcklkT2ZOYW1lKCdhbGljZScpO1xuICAgICAgICBjb25zdCBzdGF0dXNEb2NrZXIgPSBKU09OLnBhcnNlKGdldERvY2tlclN0YXR1cyhhbGljZUNvbnRhaW5lcklkKSk7XG4gICAgICAgIGxvZ0Jsb2NrY2hhaW4oXCJyZWFsIGJhbGFuY2UgOlwiICsgc3RhdHVzRG9ja2VyLmJhbGFuY2UsIChOdW1iZXIoc3RhdHVzRG9ja2VyLmJhbGFuY2UpID4gMCkpO1xuICAgICAgICBsb2dCbG9ja2NoYWluKFwiY29ubmVjdGlvbnM6XCIgKyBzdGF0dXNEb2NrZXIuY29ubmVjdGlvbnMpO1xuICAgICAgICBpZiAoTnVtYmVyKHN0YXR1c0RvY2tlci5jb25uZWN0aW9ucykgPT0gMCkge1xuICAgICAgICAgICAgaXNOb2RlQWxpdmUobm9kZV91cmxfYWxpY2UsIHJwY0F1dGgsIGxvZyk7XG4gICAgICAgICAgICBpc05vZGVBbGl2ZUFuZENvbm5lY3RlZFRvSG9zdChub2RlX3VybF9ib2IsIHJwY0F1dGgsICdhbGljZScsIGxvZyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoTnVtYmVyKHN0YXR1c0RvY2tlci5iYWxhbmNlKSA+IDApIHtcbiAgICAgICAgICAgIGxvZ0Jsb2NrY2hhaW4oXCJlbm91Z2ggZm91bmRpbmcgZm9yIGFsaWNlIC0gYmxvY2tjaGFpbiBhbHJlYWR5IGNvbm5lY3RlZFwiKTtcbiAgICAgICAgICAgIGdsb2JhbC5hbGljZUFkZHJlc3MgPSBnZXROZXdBZGRyZXNzKG5vZGVfdXJsX2FsaWNlLCBycGNBdXRoLCBsb2cpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZXhjZXB0aW9uKSB7XG4gICAgICAgIGxvZ0Jsb2NrY2hhaW4oXCJjb25uZWN0aW5nIGJsb2NrY2hhaW4gYW5kIG1pbmluZyBzb21lIGNvaW5zXCIpO1xuICAgIH1cbiAgICBnbG9iYWwuYWxpY2VBZGRyZXNzID0gZ2V0TmV3QWRkcmVzcyhub2RlX3VybF9hbGljZSwgcnBjQXV0aCwgbG9nKTtcbiAgICBnZW5lcmF0ZXRvYWRkcmVzcyhub2RlX3VybF9hbGljZSwgcnBjQXV0aCwgZ2xvYmFsLmFsaWNlQWRkcmVzcywgMjEwKTsgIC8vMTEwIGJsb2NrcyB0byBuZXcgYWRkcmVzcyEgMTEwIGJsw7Zja2UgKjI1IGNvaW5zXG5cbn1cbmZ1bmN0aW9uIHdhaXRfdG9fc3RhcnRfY29udGFpbmVyKHN0YXJ0ZWRDb250YWluZXJJZCxjYWxsYmFjayl7XG4gICAgbGV0IHJ1bm5pbmcgPSB0cnVlO1xuICAgIGxldCBjb3VudGVyID0gMDtcblxuICAgIC8vaGVyZSB3ZSBtYWtlIHN1cmUgYm9iIGdldHMgc3RhcnRlZCBhbmQgY29ubmVjdGVkIGFnYWluIGluIHByb2JhYmx5IGFsbCBwb3NzaWJsZSBzaXRhdXRpb25zXG4gICAgd2hpbGUocnVubmluZyl7XG4gICAgICAgIHRyeXtcbiAgICAgICAgICAgIGNvbnN0IHN0YXR1c0RvY2tlciA9IEpTT04ucGFyc2UoZ2V0RG9ja2VyU3RhdHVzKHN0YXJ0ZWRDb250YWluZXJJZCkpO1xuICAgICAgICAgICAgdGVzdExvZ2dpbmcoXCJnZXRpbmZvXCIsc3RhdHVzRG9ja2VyKTtcbiAgICAgICAgICAgIHRlc3RMb2dnaW5nKFwidmVyc2lvbjpcIitzdGF0dXNEb2NrZXIudmVyc2lvbik7XG4gICAgICAgICAgICB0ZXN0TG9nZ2luZyhcImJhbGFuY2U6XCIrc3RhdHVzRG9ja2VyLmJhbGFuY2UpO1xuICAgICAgICAgICAgdGVzdExvZ2dpbmcoXCJjb25uZWN0aW9uczpcIitzdGF0dXNEb2NrZXIuY29ubmVjdGlvbnMpO1xuICAgICAgICAgICAgaWYoc3RhdHVzRG9ja2VyLmNvbm5lY3Rpb25zPT09MCl7XG4gICAgICAgICAgICAgICAgZG9pY2hhaW5BZGROb2RlKHN0YXJ0ZWRDb250YWluZXJJZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBydW5uaW5nID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2goZXJyb3Ipe1xuICAgICAgICAgICAgdGVzdExvZ2dpbmcoXCJzdGF0dXNEb2NrZXIgcHJvYmxlbSB0cnlpbmcgdG8gc3RhcnQgQm9icyBub2RlIGluc2lkZSBkb2NrZXIgY29udGFpbmVyOlwiLGVycm9yKTtcbiAgICAgICAgICAgIHRyeXtcbiAgICAgICAgICAgICAgICBjb25uZWN0RG9ja2VyQm9iKHN0YXJ0ZWRDb250YWluZXJJZCk7XG4gICAgICAgICAgICB9Y2F0Y2goZXJyb3IyKXtcbiAgICAgICAgICAgICAgICB0ZXN0TG9nZ2luZyhcImNvdWxkIG5vdCBzdGFydCBib2I6XCIsZXJyb3IyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKGNvdW50ZXI9PTUwKXJ1bm5pbmc9ZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgY291bnRlcisrO1xuICAgIH1cbiAgICBjYWxsYmFjayhudWxsLCBzdGFydGVkQ29udGFpbmVySWQpO1xufVxuXG5mdW5jdGlvbiBkZWxldGVfb3B0aW9uc19mcm9tX2FsaWNlX2FuZF9ib2IoY2FsbGJhY2spe1xuICAgIGNvbnN0IGNvbnRhaW5lcklkID0gZ2V0Q29udGFpbmVySWRPZk5hbWUoJ21vbmdvJyk7XG4gICAgZXhlYygnc3VkbyBkb2NrZXIgY3AgL2hvbWUvZG9pY2hhaW4vZGFwcC9jb250cmliL3NjcmlwdHMvbWV0ZW9yL2RlbGV0ZV9jb2xsZWN0aW9ucy5zaCAnK2NvbnRhaW5lcklkKyc6L3RtcC8nLCAoZSwgc3Rkb3V0LCBzdGRlcnIpPT4ge1xuICAgICAgICB0ZXN0TG9nZ2luZygnY29waWVkIGRlbGV0ZV9jb2xsZWN0aW9ucyBpbnRvIG1vbmdvIGRvY2tlciBjb250YWluZXInLHtzdGRlcnI6c3RkZXJyLHN0ZG91dDpzdGRvdXR9KTtcbiAgICAgICAgZXhlYygnc3VkbyBkb2NrZXIgZXhlYyAnK2NvbnRhaW5lcklkKycgYmFzaCAtYyBcIm1vbmdvIDwgL3RtcC9kZWxldGVfY29sbGVjdGlvbnMuc2hcIicsIChlLCBzdGRvdXQsIHN0ZGVycik9PiB7XG4gICAgICAgICAgICB0ZXN0TG9nZ2luZygnc3VkbyBkb2NrZXIgZXhlYyAnK2NvbnRhaW5lcklkKycgYmFzaCAtYyBcIm1vbmdvIDwgL3RtcC9kZWxldGVfY29sbGVjdGlvbnMuc2hcIicse3N0ZGVycjpzdGRlcnIsc3Rkb3V0OnN0ZG91dH0pO1xuICAgICAgICAgICAgY2FsbGJhY2soc3RkZXJyLCBzdGRvdXQpO1xuICAgICAgICB9KTtcblxuICAgIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNOb2RlQWxpdmUodXJsLCBhdXRoLCBsb2cpIHtcbiAgICBpZihsb2cpIHRlc3RMb2dnaW5nKCdpc05vZGVBbGl2ZSBjYWxsZWQgdG8gdXJsJyx1cmwpO1xuICAgIGNvbnN0IGRhdGFHZXROZXR3b3JrSW5mbyA9IHtcImpzb25ycGNcIjogXCIxLjBcIiwgXCJpZFwiOiBcImdldG5ldHdvcmtpbmZvXCIsIFwibWV0aG9kXCI6IFwiZ2V0bmV0d29ya2luZm9cIiwgXCJwYXJhbXNcIjogW119O1xuICAgIGNvbnN0IHJlYWxkYXRhR2V0TmV0d29ya0luZm8gPSB7YXV0aDogYXV0aCwgZGF0YTogZGF0YUdldE5ldHdvcmtJbmZvLCBoZWFkZXJzOiBoZWFkZXJzfTtcbiAgICBjb25zdCByZXN1bHRHZXROZXR3b3JrSW5mbyA9IGdldEh0dHBQT1NUKHVybCwgcmVhbGRhdGFHZXROZXR3b3JrSW5mbyk7XG4gICAgY29uc3Qgc3RhdHVzR2V0TmV0d29ya0luZm8gPSByZXN1bHRHZXROZXR3b3JrSW5mby5zdGF0dXNDb2RlO1xuICAgIGNoYWkuYXNzZXJ0LmVxdWFsKDIwMCwgc3RhdHVzR2V0TmV0d29ya0luZm8pO1xuICAgIGlmKGxvZylcbiAgICAgICAgdGVzdExvZ2dpbmcoJ3Jlc3VsdEdldE5ldHdvcmtJbmZvOicscmVzdWx0R2V0TmV0d29ya0luZm8pOyAvLyBnZXRuZXR3b3JraW5mbyB8IGpxICcubG9jYWxhZGRyZXNzZXNbMF0uYWRkcmVzcydcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzTm9kZUFsaXZlQW5kQ29ubmVjdGVkVG9Ib3N0KHVybCwgYXV0aCwgaG9zdCwgbG9nKSB7XG4gICAgaWYobG9nKSB0ZXN0TG9nZ2luZygnaXNOb2RlQWxpdmVBbmRDb25uZWN0ZWRUb0hvc3QgY2FsbGVkJyk7XG4gICAgaXNOb2RlQWxpdmUodXJsLCBhdXRoLCBsb2cpO1xuXG4gICAgY29uc3QgZGF0YUdldE5ldHdvcmtJbmZvID0ge1wianNvbnJwY1wiOiBcIjEuMFwiLCBcImlkXCI6XCJhZGRub2RlXCIsIFwibWV0aG9kXCI6IFwiYWRkbm9kZVwiLCBcInBhcmFtc1wiOiBbJ2FsaWNlJywnb25ldHJ5J10gfTtcbiAgICBjb25zdCByZWFsZGF0YUdldE5ldHdvcmtJbmZvID0geyBhdXRoOiBhdXRoLCBkYXRhOiBkYXRhR2V0TmV0d29ya0luZm8sIGhlYWRlcnM6IGhlYWRlcnMgfTtcbiAgICBjb25zdCByZXN1bHRHZXROZXR3b3JrSW5mbyA9IGdldEh0dHBQT1NUKHVybCwgcmVhbGRhdGFHZXROZXR3b3JrSW5mbyk7XG4gICAgY29uc3Qgc3RhdHVzQWRkTm9kZSA9IHJlc3VsdEdldE5ldHdvcmtJbmZvLnN0YXR1c0NvZGU7XG4gICAgaWYobG9nKSB0ZXN0TG9nZ2luZygnYWRkbm9kZTonLHN0YXR1c0FkZE5vZGUpO1xuICAgIGNoYWkuYXNzZXJ0LmVxdWFsKDIwMCwgc3RhdHVzQWRkTm9kZSk7XG5cblxuICAgIGNvbnN0IGRhdGFHZXRQZWVySW5mbyA9IHtcImpzb25ycGNcIjogXCIxLjBcIiwgXCJpZFwiOlwiZ2V0cGVlcmluZm9cIiwgXCJtZXRob2RcIjogXCJnZXRwZWVyaW5mb1wiLCBcInBhcmFtc1wiOiBbXSB9O1xuICAgIGNvbnN0IHJlYWxkYXRhR2V0UGVlckluZm8gPSB7IGF1dGg6IGF1dGgsIGRhdGE6IGRhdGFHZXRQZWVySW5mbywgaGVhZGVyczogaGVhZGVycyB9O1xuICAgIGNvbnN0IHJlc3VsdEdldFBlZXJJbmZvID0gZ2V0SHR0cFBPU1QodXJsLCByZWFsZGF0YUdldFBlZXJJbmZvKTtcbiAgICBjb25zdCBzdGF0dXNHZXRQZWVySW5mbyA9IHJlc3VsdEdldFBlZXJJbmZvLnN0YXR1c0NvZGU7XG4gICAgaWYobG9nKSB0ZXN0TG9nZ2luZygncmVzdWx0R2V0UGVlckluZm86JyxyZXN1bHRHZXRQZWVySW5mbyk7XG4gICAgY2hhaS5hc3NlcnQuZXF1YWwoMjAwLCBzdGF0dXNHZXRQZWVySW5mbyk7XG4gICAgY2hhaS5hc3NlcnQuaXNBYm92ZShyZXN1bHRHZXRQZWVySW5mby5kYXRhLnJlc3VsdC5sZW5ndGgsIDAsICdubyBjb25uZWN0aW9uIHRvIG90aGVyIG5vZGVzISAnKTtcbiAgICAvL2NoYWkuZXhwZWN0KHJlc3VsdEdldFBlZXJJbmZvLmRhdGEucmVzdWx0KS50by5oYXZlLmxlbmd0aE9mLmF0LmxlYXN0KDEpO1xuXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpbXBvcnRQcml2S2V5KHVybCwgYXV0aCwgcHJpdktleSwgcmVzY2FuLCBsb2cpIHtcbiAgICAgICAgaWYobG9nKSB0ZXN0TG9nZ2luZygnaW1wb3J0UHJpdktleSBjYWxsZWQnLCcnKTtcbiAgICAgICAgY29uc3QgZGF0YV9pbXBvcnRwcml2a2V5ID0ge1wianNvbnJwY1wiOiBcIjEuMFwiLCBcImlkXCI6XCJpbXBvcnRwcml2a2V5XCIsIFwibWV0aG9kXCI6IFwiaW1wb3J0cHJpdmtleVwiLCBcInBhcmFtc1wiOiBbcHJpdktleV0gfTtcbiAgICAgICAgY29uc3QgcmVhbGRhdGFfaW1wb3J0cHJpdmtleSA9IHsgYXV0aDogYXV0aCwgZGF0YTogZGF0YV9pbXBvcnRwcml2a2V5LCBoZWFkZXJzOiBoZWFkZXJzIH07XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGdldEh0dHBQT1NUKHVybCwgcmVhbGRhdGFfaW1wb3J0cHJpdmtleSk7XG4gICAgICAgIGlmKGxvZykgdGVzdExvZ2dpbmcoJ3Jlc3VsdDonLHJlc3VsdCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXROZXdBZGRyZXNzKHVybCwgYXV0aCwgbG9nKSB7XG5cbiAgICBpZihsb2cpIHRlc3RMb2dnaW5nKCdnZXROZXdBZGRyZXNzIGNhbGxlZCcpO1xuICAgIGNvbnN0IGRhdGFHZXROZXdBZGRyZXNzID0ge1wianNvbnJwY1wiOiBcIjEuMFwiLCBcImlkXCI6XCJnZXRuZXdhZGRyZXNzXCIsIFwibWV0aG9kXCI6IFwiZ2V0bmV3YWRkcmVzc1wiLCBcInBhcmFtc1wiOiBbXSB9O1xuICAgIGNvbnN0IHJlYWxkYXRhR2V0TmV3QWRkcmVzcyA9IHsgYXV0aDogYXV0aCwgZGF0YTogZGF0YUdldE5ld0FkZHJlc3MsIGhlYWRlcnM6IGhlYWRlcnMgfTtcbiAgICBjb25zdCByZXN1bHRHZXROZXdBZGRyZXNzID0gZ2V0SHR0cFBPU1QodXJsLCByZWFsZGF0YUdldE5ld0FkZHJlc3MpO1xuICAgIGNvbnN0IHN0YXR1c09wdEluR2V0TmV3QWRkcmVzcyA9IHJlc3VsdEdldE5ld0FkZHJlc3Muc3RhdHVzQ29kZTtcbiAgICBjb25zdCBuZXdBZGRyZXNzICA9IHJlc3VsdEdldE5ld0FkZHJlc3MuZGF0YS5yZXN1bHQ7XG4gICAgY2hhaS5hc3NlcnQuZXF1YWwoMjAwLCBzdGF0dXNPcHRJbkdldE5ld0FkZHJlc3MpO1xuICAgIGNoYWkuZXhwZWN0KHJlc3VsdEdldE5ld0FkZHJlc3MuZGF0YS5lcnJvcikudG8uYmUubnVsbDtcbiAgICBjaGFpLmV4cGVjdChuZXdBZGRyZXNzKS50by5ub3QuYmUubnVsbDtcbiAgICBpZihsb2cpIHRlc3RMb2dnaW5nKG5ld0FkZHJlc3MpO1xuICAgIHJldHVybiBuZXdBZGRyZXNzO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2VuZXJhdGV0b2FkZHJlc3ModXJsLGF1dGgsdG9hZGRyZXNzLGFtb3VudCxsb2cpe1xuICAgIGNvbnN0IGRhdGFHZW5lcmF0ZSA9IHtcImpzb25ycGNcIjogXCIxLjBcIiwgXCJpZFwiOlwiZ2VuZXJhdGV0b2FkZHJlc3NcIiwgXCJtZXRob2RcIjogXCJnZW5lcmF0ZXRvYWRkcmVzc1wiLCBcInBhcmFtc1wiOiBbYW1vdW50LHRvYWRkcmVzc10gfTtcbiAgICBjb25zdCBoZWFkZXJzR2VuZXJhdGVzID0geyAnQ29udGVudC1UeXBlJzondGV4dC9wbGFpbicgIH07XG4gICAgY29uc3QgcmVhbGRhdGFHZW5lcmF0ZSA9IHsgYXV0aDogYXV0aCwgZGF0YTogZGF0YUdlbmVyYXRlLCBoZWFkZXJzOiBoZWFkZXJzR2VuZXJhdGVzIH07XG4gICAgY29uc3QgcmVzdWx0R2VuZXJhdGUgPSBnZXRIdHRwUE9TVCh1cmwsIHJlYWxkYXRhR2VuZXJhdGUpO1xuICAgIGNvbnN0IHN0YXR1c1Jlc3VsdEdlbmVyYXRlID0gcmVzdWx0R2VuZXJhdGUuc3RhdHVzQ29kZTtcbiAgICBpZihsb2cpdGVzdExvZ2dpbmcoJ3N0YXR1c1Jlc3VsdEdlbmVyYXRlOicsc3RhdHVzUmVzdWx0R2VuZXJhdGUpO1xuICAgIGNoYWkuYXNzZXJ0LmVxdWFsKDIwMCwgc3RhdHVzUmVzdWx0R2VuZXJhdGUpO1xuICAgIGNoYWkuZXhwZWN0KHJlc3VsdEdlbmVyYXRlLmRhdGEuZXJyb3IpLnRvLmJlLm51bGw7XG4gICAgY2hhaS5leHBlY3QocmVzdWx0R2VuZXJhdGUuZGF0YS5yZXN1bHQpLnRvLm5vdC5iZS5udWxsO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0QmFsYW5jZSh1cmwsYXV0aCxsb2cpe1xuICAgIGNvbnN0IGRhdGFHZXRCYWxhbmNlID0ge1wianNvbnJwY1wiOiBcIjEuMFwiLCBcImlkXCI6XCJnZXRiYWxhbmNlXCIsIFwibWV0aG9kXCI6IFwiZ2V0YmFsYW5jZVwiLCBcInBhcmFtc1wiOiBbXSB9O1xuICAgIGNvbnN0IHJlYWxkYXRhR2V0QmFsYW5jZSA9IHsgYXV0aDogYXV0aCwgZGF0YTogZGF0YUdldEJhbGFuY2UsIGhlYWRlcnM6IGhlYWRlcnMgfTtcbiAgICBjb25zdCByZXN1bHRHZXRCYWxhbmNlID0gZ2V0SHR0cFBPU1QodXJsLCByZWFsZGF0YUdldEJhbGFuY2UpO1xuICAgIGlmKGxvZyl0ZXN0TG9nZ2luZygncmVzdWx0R2V0QmFsYW5jZTonLHJlc3VsdEdldEJhbGFuY2UuZGF0YS5yZXN1bHQpO1xuICAgIHJldHVybiByZXN1bHRHZXRCYWxhbmNlLmRhdGEucmVzdWx0O1xufVxuXG5mdW5jdGlvbiBnZXRfY29udGFpbmVyX2lkX29mX25hbWUobmFtZSxjYWxsYmFjaykge1xuICAgIGV4ZWMoc3VkbysnZG9ja2VyIHBzIC0tZmlsdGVyIFwibmFtZT0nK25hbWUrJ1wiIHwgY3V0IC1mMSAtZFwiIFwiIHwgc2VkIFxcJzFkXFwnJywgKGUsIHN0ZG91dCwgc3RkZXJyKT0+IHtcbiAgICAgICAgaWYoZSE9bnVsbCl7XG4gICAgICAgICAgICB0ZXN0TG9nZ2luZygnY2Fubm90IGZpbmQgJytuYW1lKycgbm9kZSAnK3N0ZG91dCxzdGRlcnIpO1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgYm9ic0NvbnRhaW5lcklkID0gc3Rkb3V0LnRvU3RyaW5nKCkudHJpbSgpOyAvLy5zdWJzdHJpbmcoMCxzdGRvdXQudG9TdHJpbmcoKS5sZW5ndGgtMSk7IC8vcmVtb3ZlIGxhc3QgY2hhciBzaW5jZSBpbnMgYSBsaW5lIGJyZWFrXG4gICAgICAgIGNhbGxiYWNrKHN0ZGVyciwgYm9ic0NvbnRhaW5lcklkKTtcbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gc3RvcF9kb2NrZXJfYm9iKGNhbGxiYWNrKSB7XG4gICAgY29uc3QgYm9ic0NvbnRhaW5lcklkID0gZ2V0Q29udGFpbmVySWRPZk5hbWUoJ2JvYicpO1xuICAgIHRlc3RMb2dnaW5nKCdzdG9wcGluZyBCb2Igd2l0aCBjb250YWluZXItaWQ6ICcrYm9ic0NvbnRhaW5lcklkKTtcbiAgICB0cnl7XG4gICAgICAgIGV4ZWMoc3VkbysnZG9ja2VyIHN0b3AgJytib2JzQ29udGFpbmVySWQsIChlLCBzdGRvdXQsIHN0ZGVycik9PiB7XG4gICAgICAgICAgICB0ZXN0TG9nZ2luZygnc3RvcHBpbmcgQm9iIHdpdGggY29udGFpbmVyLWlkOiAnLHtzdGRvdXQ6c3Rkb3V0LHN0ZGVycjpzdGRlcnJ9KTtcbiAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIGJvYnNDb250YWluZXJJZCk7XG4gICAgICAgIH0pO1xuICAgIH1jYXRjaCAoZSkge1xuICAgICAgICB0ZXN0TG9nZ2luZygnY291bGRudCBzdG9wIGJvYnMgbm9kZScsZSk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkb2ljaGFpbl9hZGRfbm9kZShjb250YWluZXJJZCxjYWxsYmFjaykge1xuICAgIGV4ZWMoc3VkbysnZG9ja2VyIGV4ZWMgJytjb250YWluZXJJZCsnIGRvaWNoYWluLWNsaSBhZGRub2RlIGFsaWNlIG9uZXRyeScsIChlLCBzdGRvdXQsIHN0ZGVycik9PiB7XG4gICAgICAgIHRlc3RMb2dnaW5nKCdib2IgJytjb250YWluZXJJZCsnIGNvbm5lY3RlZD8gJyx7c3Rkb3V0OnN0ZG91dCxzdGRlcnI6c3RkZXJyfSk7XG4gICAgICAgIGNhbGxiYWNrKHN0ZGVyciwgc3Rkb3V0KTtcbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gZ2V0X2RvY2tlcl9zdGF0dXMoY29udGFpbmVySWQsY2FsbGJhY2spIHtcbiAgICBsb2dCbG9ja2NoYWluKCdjb250YWluZXJJZCAnK2NvbnRhaW5lcklkKycgcnVubmluZz8gJyk7XG4gICAgZXhlYyhzdWRvKydkb2NrZXIgZXhlYyAnK2NvbnRhaW5lcklkKycgZG9pY2hhaW4tY2xpIC1nZXRpbmZvJywgKGUsIHN0ZG91dCwgc3RkZXJyKT0+IHtcbiAgICAgICAgdGVzdExvZ2dpbmcoJ2NvbnRhaW5lcklkICcrY29udGFpbmVySWQrJyBzdGF0dXM6ICcse3N0ZG91dDpzdGRvdXQsc3RkZXJyOnN0ZGVycn0pO1xuICAgICAgICBjYWxsYmFjayhzdGRlcnIsIHN0ZG91dCk7XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIHN0YXJ0X2RvY2tlcl9ib2IoYm9ic0NvbnRhaW5lcklkLGNhbGxiYWNrKSB7XG4gICAgZXhlYyhzdWRvKydkb2NrZXIgc3RhcnQgJytib2JzQ29udGFpbmVySWQsIChlLCBzdGRvdXQsIHN0ZGVycik9PiB7XG4gICAgICAgIHRlc3RMb2dnaW5nKCdzdGFydGVkIGJvYnMgbm9kZSBhZ2FpbjogJytib2JzQ29udGFpbmVySWQse3N0ZG91dDpzdGRvdXQsc3RkZXJyOnN0ZGVycn0pO1xuICAgICAgICBjYWxsYmFjayhzdGRlcnIsIHN0ZG91dC50b1N0cmluZygpLnRyaW0oKSk7IC8vcmVtb3ZlIGxpbmUgYnJlYWsgZnJvbSB0aGUgZW5kXG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIGNvbm5lY3RfZG9ja2VyX2JvYihib2JzQ29udGFpbmVySWQsIGNhbGxiYWNrKSB7XG4gICAgZXhlYyhzdWRvKydkb2NrZXIgZXhlYyAnK2JvYnNDb250YWluZXJJZCsnIGRvaWNoYWluZCAtcmVndGVzdCAtZGFlbW9uIC1yZWluZGV4IC1hZGRub2RlPWFsaWNlJywgKGUsIHN0ZG91dCwgc3RkZXJyKT0+IHtcbiAgICAgICAgdGVzdExvZ2dpbmcoJ3Jlc3RhcnRpbmcgZG9pY2hhaW5kIG9uIGJvYnMgbm9kZSBhbmQgY29ubmVjdGluZyB3aXRoIGFsaWNlOiAnLHtzdGRvdXQ6c3Rkb3V0LHN0ZGVycjpzdGRlcnJ9KTtcbiAgICAgICAgY2FsbGJhY2soc3RkZXJyLCBzdGRvdXQpO1xuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBzdGFydF8zcmRfbm9kZShjYWxsYmFjaykge1xuICAgIGV4ZWMoc3VkbysnZG9ja2VyIHN0YXJ0IDNyZF9ub2RlJywgKGUsIHN0ZG91dCwgc3RkZXJyKT0+IHtcbiAgICAgICAgdGVzdExvZ2dpbmcoJ3RyeWluZyB0byBzdGFydCAzcmRfbm9kZScse3N0ZG91dDpzdGRvdXQsc3RkZXJyOnN0ZGVycn0pO1xuICAgICAgICBpZihzdGRlcnIpe1xuICAgICAgICAgICAgZXhlYyhzdWRvKydkb2NrZXIgbmV0d29yayBscyB8Z3JlcCBkb2ljaGFpbiB8IGN1dCAtZjkgLWRcIiBcIicsIChlLCBzdGRvdXQsIHN0ZGVycik9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgbmV0d29yayA9IHN0ZG91dC50b1N0cmluZygpLnN1YnN0cmluZygwLHN0ZG91dC50b1N0cmluZygpLmxlbmd0aC0xKTtcbiAgICAgICAgICAgICAgICB0ZXN0TG9nZ2luZygnY29ubmVjdGluZyAzcmQgbm9kZSB0byBkb2NrZXIgbmV0d29yazogJytuZXR3b3JrKTtcbiAgICAgICAgICAgICAgICBleGVjKHN1ZG8rJ2RvY2tlciBydW4gLS1leHBvc2U9MTgzMzIgJyArXG4gICAgICAgICAgICAgICAgICAgICctZSBSRUdURVNUPXRydWUgJyArXG4gICAgICAgICAgICAgICAgICAgICctZSBET0lDSEFJTl9WRVI9MC4xNi4zLjIgJyArXG4gICAgICAgICAgICAgICAgICAgICctZSBSUENfQUxMT1dfSVA9OjovMCAnICtcbiAgICAgICAgICAgICAgICAgICAgJy1lIENPTk5FQ1RJT05fTk9ERT1hbGljZSAnK1xuICAgICAgICAgICAgICAgICAgICAnLWUgUlBDX1BBU1NXT1JEPWdlbmVyYXRlZC1wYXNzd29yZCAnICtcbiAgICAgICAgICAgICAgICAgICAgJy0tbmFtZT0zcmRfbm9kZSAnK1xuICAgICAgICAgICAgICAgICAgICAnLS1kbnM9MTcyLjIwLjAuNSAgJyArXG4gICAgICAgICAgICAgICAgICAgICctLWRucz04LjguOC44ICcgK1xuICAgICAgICAgICAgICAgICAgICAnLS1kbnMtc2VhcmNoPWNpLWRvaWNoYWluLm9yZyAnICtcbiAgICAgICAgICAgICAgICAgICAgJy0taXA9MTcyLjIwLjAuMTAgJyArXG4gICAgICAgICAgICAgICAgICAgICctLW5ldHdvcms9JytuZXR3b3JrKycgLWQgZG9pY2hhaW4vY29yZTowLjE2LjMuMicsIChlLCBzdGRvdXQsIHN0ZGVycik9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKHN0ZGVyciwgc3Rkb3V0KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIGNhbGxiYWNrKHN0ZGVyciwgc3Rkb3V0KTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG5cbn1cblxuZnVuY3Rpb24gcnVuX2FuZF93YWl0KHJ1bmZ1bmN0aW9uLHNlY29uZHMsIGNhbGxiYWNrKXtcbiAgICBNZXRlb3Iuc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJ1bmZ1bmN0aW9uKCk7XG4gICAgICAgIGNhbGxiYWNrKG51bGwsdHJ1ZSk7XG4gICAgfSwgc2Vjb25kcysxMDAwKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHdhaXRUb1N0YXJ0Q29udGFpbmVyKGNvbnRhaW5lcklkKSB7XG4gICAgY29uc3Qgc3luY0Z1bmMgPSBNZXRlb3Iud3JhcEFzeW5jKHdhaXRfdG9fc3RhcnRfY29udGFpbmVyKTtcbiAgICByZXR1cm4gc3luY0Z1bmMoY29udGFpbmVySWQpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVsZXRlT3B0SW5zRnJvbUFsaWNlQW5kQm9iKCkge1xuICAgIGNvbnN0IHN5bmNGdW5jID0gTWV0ZW9yLndyYXBBc3luYyhkZWxldGVfb3B0aW9uc19mcm9tX2FsaWNlX2FuZF9ib2IpO1xuICAgIHJldHVybiBzeW5jRnVuYygpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc3RhcnQzcmROb2RlKCkge1xuICAgIGNvbnN0IHN5bmNGdW5jID0gTWV0ZW9yLndyYXBBc3luYyhzdGFydF8zcmRfbm9kZSk7XG4gICAgcmV0dXJuIHN5bmNGdW5jKCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzdG9wRG9ja2VyQm9iKCkge1xuICAgIGNvbnN0IHN5bmNGdW5jID0gTWV0ZW9yLndyYXBBc3luYyhzdG9wX2RvY2tlcl9ib2IpO1xuICAgIHJldHVybiBzeW5jRnVuYygpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q29udGFpbmVySWRPZk5hbWUobmFtZSkge1xuICAgIGNvbnN0IHN5bmNGdW5jID0gTWV0ZW9yLndyYXBBc3luYyhnZXRfY29udGFpbmVyX2lkX29mX25hbWUpO1xuICAgIHJldHVybiBzeW5jRnVuYyhuYW1lKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHN0YXJ0RG9ja2VyQm9iKGNvbnRhaW5lcklkKSB7XG4gICAgY29uc3Qgc3luY0Z1bmMgPSBNZXRlb3Iud3JhcEFzeW5jKHN0YXJ0X2RvY2tlcl9ib2IpO1xuICAgIHJldHVybiBzeW5jRnVuYyhjb250YWluZXJJZCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkb2ljaGFpbkFkZE5vZGUoY29udGFpbmVySWQpIHtcbiAgICBjb25zdCBzeW5jRnVuYyA9IE1ldGVvci53cmFwQXN5bmMoZG9pY2hhaW5fYWRkX25vZGUpO1xuICAgIHJldHVybiBzeW5jRnVuYyhjb250YWluZXJJZCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXREb2NrZXJTdGF0dXMoY29udGFpbmVySWQpIHtcbiAgICBjb25zdCBzeW5jRnVuYyA9IE1ldGVvci53cmFwQXN5bmMoZ2V0X2RvY2tlcl9zdGF0dXMpO1xuICAgIHJldHVybiBzeW5jRnVuYyhjb250YWluZXJJZCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjb25uZWN0RG9ja2VyQm9iKGNvbnRhaW5lcklkKSB7XG4gICAgY29uc3Qgc3luY0Z1bmMgPSBNZXRlb3Iud3JhcEFzeW5jKGNvbm5lY3RfZG9ja2VyX2JvYik7XG4gICAgcmV0dXJuIHN5bmNGdW5jKGNvbnRhaW5lcklkKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJ1bkFuZFdhaXQocnVuZnVuY3Rpb24sIHNlY29uZHMpIHtcbiAgICBjb25zdCBzeW5jRnVuYyA9IE1ldGVvci53cmFwQXN5bmMocnVuX2FuZF93YWl0KTtcbiAgICByZXR1cm4gc3luY0Z1bmMoc2Vjb25kcyk7XG59IiwiaW1wb3J0IHtjaGFpfSBmcm9tICdtZXRlb3IvcHJhY3RpY2FsbWV0ZW9yOmNoYWknO1xuaW1wb3J0IHtcbiAgICBkZWxldGVPcHRJbnNGcm9tQWxpY2VBbmRCb2IsIGdldEJhbGFuY2UsIGluaXRCbG9ja2NoYWluXG59IGZyb20gXCIuL3Rlc3QtYXBpL3Rlc3QtYXBpLW9uLW5vZGVcIjtcblxuaW1wb3J0IHtsb2dCbG9ja2NoYWlufSBmcm9tIFwiLi4vLi4vaW1wb3J0cy9zdGFydHVwL3NlcnZlci9sb2ctY29uZmlndXJhdGlvblwiO1xuY29uc3Qgbm9kZV91cmxfYWxpY2UgPSAnaHR0cDovLzE3Mi4yMC4wLjY6MTgzMzIvJztcbmNvbnN0IG5vZGVfdXJsX2JvYiA9ICAgJ2h0dHA6Ly8xNzIuMjAuMC43OjE4MzMyLyc7XG5jb25zdCBycGNBdXRoID0gXCJhZG1pbjpnZW5lcmF0ZWQtcGFzc3dvcmRcIjtcbmNvbnN0IHByaXZLZXlCb2IgPSBcImNQM0VpZ2t6c1d1eUtFbXhrOGNDNnFYWWI0Wmp3VW81dnp2WnBBUG1EUTgzUkNnWFFydWpcIjtcbmNvbnN0IGxvZyA9IHRydWU7XG5cbmlmKE1ldGVvci5pc0FwcFRlc3QpIHtcbiAgICBkZXNjcmliZSgnYmFzaWMtZG9pLXRlc3QtMCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy50aW1lb3V0KDApO1xuXG4gICAgICAgIGJlZm9yZShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBsb2dCbG9ja2NoYWluKFwicmVtb3ZpbmcgT3B0SW5zLFJlY2lwaWVudHMsU2VuZGVyc1wiKTtcbiAgICAgICAgICAgIGRlbGV0ZU9wdEluc0Zyb21BbGljZUFuZEJvYigpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2hvdWxkIGNyZWF0ZSBhIFJlZ1Rlc3QgRG9pY2hhaW4gd2l0aCBhbGljZSBhbmQgYm9iIGFuZCBzb21lIERvaSAtIGNvaW5zJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaW5pdEJsb2NrY2hhaW4obm9kZV91cmxfYWxpY2Usbm9kZV91cmxfYm9iLHJwY0F1dGgscHJpdktleUJvYix0cnVlKTtcbiAgICAgICAgICAgIGNvbnN0IGFsaWNlQmFsYW5jZSA9IGdldEJhbGFuY2Uobm9kZV91cmxfYWxpY2UsIHJwY0F1dGgsIGxvZyk7XG4gICAgICAgICAgICBjaGFpLmFzc2VydC5pc0Fib3ZlKGFsaWNlQmFsYW5jZSwgMCwgJ25vIGZ1bmRpbmchICcpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn1cbiIsImltcG9ydCB7Y2hhaX0gZnJvbSAnbWV0ZW9yL3ByYWN0aWNhbG1ldGVvcjpjaGFpJztcbmltcG9ydCB7XG4gICAgbG9naW4sXG4gICAgY3JlYXRlVXNlcixcbiAgICBmaW5kVXNlcixcbiAgICBleHBvcnRPcHRJbnMsXG4gICAgcmVxdWVzdENvbmZpcm1WZXJpZnlCYXNpY0RvaSwgcmVzZXRVc2VycywgdXBkYXRlVXNlciwgZGVsZXRlQWxsRW1haWxzRnJvbVBvcDMsIGNvbmZpcm1MaW5rXG59IGZyb20gXCIuL3Rlc3QtYXBpL3Rlc3QtYXBpLW9uLWRhcHBcIjtcbmltcG9ydCB7bG9nQmxvY2tjaGFpbn0gZnJvbSBcIi4uLy4uL2ltcG9ydHMvc3RhcnR1cC9zZXJ2ZXIvbG9nLWNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7ZGVsZXRlT3B0SW5zRnJvbUFsaWNlQW5kQm9ifSBmcm9tIFwiLi90ZXN0LWFwaS90ZXN0LWFwaS1vbi1ub2RlXCI7XG5cbmNvbnN0IG5vZGVfdXJsX2FsaWNlID0gJ2h0dHA6Ly8xNzIuMjAuMC42OjE4MzMyLyc7XG5cbmNvbnN0IHJwY0F1dGhBbGljZSA9IFwiYWRtaW46Z2VuZXJhdGVkLXBhc3N3b3JkXCI7XG5jb25zdCBkYXBwVXJsQWxpY2UgPSBcImh0dHA6Ly9sb2NhbGhvc3Q6MzAwMFwiO1xuY29uc3QgZGFwcFVybEJvYiA9IFwiaHR0cDovLzE3Mi4yMC4wLjg6NDAwMFwiO1xuY29uc3QgZEFwcExvZ2luID0ge1widXNlcm5hbWVcIjpcImFkbWluXCIsXCJwYXNzd29yZFwiOlwicGFzc3dvcmRcIn07XG5cbmNvbnN0IHRlbXBsYXRlVXJsQT1cImh0dHA6Ly8xNzIuMjAuMC44OjQwMDAvdGVtcGxhdGVzL2VtYWlscy9kb2ljaGFpbi1hbm1lbGR1bmctZmluYWwtREUuaHRtbFwiO1xuY29uc3QgdGVtcGxhdGVVcmxCPVwiaHR0cDovLzE3Mi4yMC4wLjg6NDAwMC90ZW1wbGF0ZXMvZW1haWxzL2RvaWNoYWluLWFubWVsZHVuZy1maW5hbC1FTi5odG1sXCI7XG5jb25zdCBhbGljZUFMb2dpbiA9IHtcInVzZXJuYW1lXCI6XCJhbGljZS1hXCIsXCJwYXNzd29yZFwiOlwicGFzc3dvcmRcIn07XG5jb25zdCBhbGljZUJMb2dpbiA9IHtcInVzZXJuYW1lXCI6XCJhbGljZS1hXCIsXCJwYXNzd29yZFwiOlwicGFzc3dvcmRcIn07XG5cbmNvbnN0IHJlY2lwaWVudF9wb3AzdXNlcm5hbWUgPSBcImJvYkBjaS1kb2ljaGFpbi5vcmdcIjtcbmNvbnN0IHJlY2lwaWVudF9wb3AzcGFzc3dvcmQgPSBcImJvYlwiO1xuXG5pZihNZXRlb3IuaXNBcHBUZXN0KSB7XG4gICAgZGVzY3JpYmUoJ2Jhc2ljLWRvaS10ZXN0LTAxJywgZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLnRpbWVvdXQoMCk7XG5cbiAgICAgICAgYmVmb3JlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGxvZ0Jsb2NrY2hhaW4oXCJyZW1vdmluZyBPcHRJbnMsUmVjaXBpZW50cyxTZW5kZXJzXCIpO1xuICAgICAgICAgICAgZGVsZXRlT3B0SW5zRnJvbUFsaWNlQW5kQm9iKCk7XG4gICAgICAgICAgICBkZWxldGVBbGxFbWFpbHNGcm9tUG9wMyhcIm1haWxcIiwgMTEwLCByZWNpcGllbnRfcG9wM3VzZXJuYW1lLCByZWNpcGllbnRfcG9wM3Bhc3N3b3JkLCB0cnVlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCB0ZXN0IGlmIGJhc2ljIERvaWNoYWluIHdvcmtmbG93IGlzIHdvcmtpbmcgd2l0aCBvcHRpb25hbCBkYXRhJywgZnVuY3Rpb24gKGRvbmUpIHtcbiAgICAgICAgICAgIGNvbnN0IHJlY2lwaWVudF9tYWlsID0gXCJib2JAY2ktZG9pY2hhaW4ub3JnXCI7IC8vcGxlYXNlIHVzZSB0aGlzIGFzIHN0YW5kYXJkIHRvIG5vdCBjb25mdXNlIHBlb3BsZSFcbiAgICAgICAgICAgIGNvbnN0IHNlbmRlcl9tYWlsID0gXCJhbGljZUBjaS1kb2ljaGFpbi5vcmdcIjtcbiAgICAgICAgICAgIGNvbnN0IGRhdGFMb2dpbkFsaWNlID0gbG9naW4oZGFwcFVybEFsaWNlLCBkQXBwTG9naW4sIGZhbHNlKTsgLy9sb2cgaW50byBkQXBwXG4gICAgICAgICAgICByZXF1ZXN0Q29uZmlybVZlcmlmeUJhc2ljRG9pKG5vZGVfdXJsX2FsaWNlLCBycGNBdXRoQWxpY2UsIGRhcHBVcmxBbGljZSwgZGF0YUxvZ2luQWxpY2UsIGRhcHBVcmxCb2IsIHJlY2lwaWVudF9tYWlsLCBzZW5kZXJfbWFpbCwgeydjaXR5JzogJ0VrYXRlcmluYnVyZyd9LCBcImJvYkBjaS1kb2ljaGFpbi5vcmdcIiwgXCJib2JcIiwgdHJ1ZSk7XG4gICAgICAgICAgICBkb25lKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzaG91bGQgdGVzdCBpZiBiYXNpYyBEb2ljaGFpbiB3b3JrZmxvdyBpcyB3b3JraW5nIHdpdGhvdXQgb3B0aW9uYWwgZGF0YScsIGZ1bmN0aW9uIChkb25lKSB7XG4gICAgICAgICAgICBjb25zdCByZWNpcGllbnRfbWFpbCA9IFwiYWxpY2VAY2ktZG9pY2hhaW4ub3JnXCI7IC8vcGxlYXNlIHVzZSB0aGlzIGFzIGFuIGFsZXJuYXRpdmUgd2hlbiBhYm92ZSBzdGFuZGFyZCBpcyBub3QgcG9zc2libGVcbiAgICAgICAgICAgIGNvbnN0IHNlbmRlcl9tYWlsID0gXCJib2JAY2ktZG9pY2hhaW4ub3JnXCI7XG4gICAgICAgICAgICAvL2xvZ2luIHRvIGRBcHAgJiByZXF1ZXN0IERPSSBvbiBhbGljZSB2aWEgYm9iXG4gICAgICAgICAgICBjb25zdCBkYXRhTG9naW5BbGljZSA9IGxvZ2luKGRhcHBVcmxBbGljZSwgZEFwcExvZ2luLCBmYWxzZSk7IC8vbG9nIGludG8gZEFwcFxuICAgICAgICAgICAgcmVxdWVzdENvbmZpcm1WZXJpZnlCYXNpY0RvaShub2RlX3VybF9hbGljZSwgcnBjQXV0aEFsaWNlLCBkYXBwVXJsQWxpY2UsIGRhdGFMb2dpbkFsaWNlLCBkYXBwVXJsQm9iLCByZWNpcGllbnRfbWFpbCwgc2VuZGVyX21haWwsIG51bGwsIFwiYWxpY2VAY2ktZG9pY2hhaW4ub3JnXCIsIFwiYWxpY2VcIiwgdHJ1ZSk7XG4gICAgICAgICAgICBkb25lKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzaG91bGQgY3JlYXRlIHR3byBtb3JlIHVzZXJzJywgZnVuY3Rpb24gKGRvbmUpIHtcbiAgICAgICAgICAgIHJlc2V0VXNlcnMoKTtcbiAgICAgICAgICAgIGNvbnN0IGxvZ0FkbWluID0gbG9naW4oZGFwcFVybEFsaWNlLCBkQXBwTG9naW4sIGZhbHNlKTtcbiAgICAgICAgICAgIGxldCB1c2VyQSA9IGNyZWF0ZVVzZXIoZGFwcFVybEFsaWNlLCBsb2dBZG1pbiwgXCJhbGljZS1hXCIsIHRlbXBsYXRlVXJsQSwgdHJ1ZSk7XG4gICAgICAgICAgICBjaGFpLmV4cGVjdChmaW5kVXNlcih1c2VyQSkpLnRvLm5vdC5iZS51bmRlZmluZWQ7XG4gICAgICAgICAgICBsZXQgdXNlckIgPSBjcmVhdGVVc2VyKGRhcHBVcmxBbGljZSwgbG9nQWRtaW4sIFwiYWxpY2UtYlwiLCB0ZW1wbGF0ZVVybEIsIHRydWUpO1xuICAgICAgICAgICAgY2hhaS5leHBlY3QoZmluZFVzZXIodXNlckIpKS50by5ub3QuYmUudW5kZWZpbmVkO1xuXG4gICAgICAgICAgICBkb25lKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzaG91bGQgdGVzdCBpZiBEb2ljaGFpbiB3b3JrZmxvdyBpcyB1c2luZyBkaWZmZXJlbnQgdGVtcGxhdGVzIGZvciBkaWZmZXJlbnQgdXNlcnMnLCBmdW5jdGlvbiAoZG9uZSkge1xuXG4gICAgICAgICAgICByZXNldFVzZXJzKCk7XG4gICAgICAgICAgICBjb25zdCByZWNpcGllbnRfbWFpbCA9IFwiYm9iQGNpLWRvaWNoYWluLm9yZ1wiOyAvL1xuICAgICAgICAgICAgY29uc3Qgc2VuZGVyX21haWxfYWxpY2VfYSA9IFwiYWxpY2UtYUBjaS1kb2ljaGFpbi5vcmdcIjtcbiAgICAgICAgICAgIGNvbnN0IHNlbmRlcl9tYWlsX2FsaWNlX2IgPSBcImFsaWNlLWJAY2ktZG9pY2hhaW4ub3JnXCI7XG4gICAgICAgICAgICBjb25zdCBsb2dBZG1pbiA9IGxvZ2luKGRhcHBVcmxBbGljZSwgZEFwcExvZ2luLCBmYWxzZSk7XG5cbiAgICAgICAgICAgIGxldCB1c2VyQSA9IGNyZWF0ZVVzZXIoZGFwcFVybEFsaWNlLCBsb2dBZG1pbiwgXCJhbGljZS1hXCIsIHRlbXBsYXRlVXJsQSwgdHJ1ZSk7XG4gICAgICAgICAgICBjaGFpLmV4cGVjdChmaW5kVXNlcih1c2VyQSkpLnRvLm5vdC5iZS51bmRlZmluZWQ7XG4gICAgICAgICAgICBsZXQgdXNlckIgPSBjcmVhdGVVc2VyKGRhcHBVcmxBbGljZSwgbG9nQWRtaW4sIFwiYWxpY2UtYlwiLCB0ZW1wbGF0ZVVybEIsIHRydWUpO1xuICAgICAgICAgICAgY2hhaS5leHBlY3QoZmluZFVzZXIodXNlckIpKS50by5ub3QuYmUudW5kZWZpbmVkO1xuXG4gICAgICAgICAgICBjb25zdCBsb2dVc2VyQSA9IGxvZ2luKGRhcHBVcmxBbGljZSwgYWxpY2VBTG9naW4sIHRydWUpO1xuICAgICAgICAgICAgY29uc3QgbG9nVXNlckIgPSBsb2dpbihkYXBwVXJsQWxpY2UsIGFsaWNlQkxvZ2luLCB0cnVlKTtcblxuICAgICAgICAgICAgLy9yZXF1ZXN0Q29uZmlybVZlcmlmeUJhc2ljRG9pIGNoZWNrcyBpZiB0aGUgXCJsb2dcIiB2YWx1ZSAoaWYgaXQgaXMgYSBTdHJpbmcpIGlzIGluIHRoZSBtYWlsLXRleHRcbiAgICAgICAgICAgIHJlcXVlc3RDb25maXJtVmVyaWZ5QmFzaWNEb2kobm9kZV91cmxfYWxpY2UsIHJwY0F1dGhBbGljZSwgZGFwcFVybEFsaWNlLCBsb2dVc2VyQSwgZGFwcFVybEJvYiwgcmVjaXBpZW50X21haWwsIHNlbmRlcl9tYWlsX2FsaWNlX2EsIHsnY2l0eSc6ICdFa2F0ZXJpbmJ1cmcnfSwgXCJib2JAY2ktZG9pY2hhaW4ub3JnXCIsIFwiYm9iXCIsIFwia29zdGVubG9zZSBBbm1lbGR1bmdcIik7XG4gICAgICAgICAgICByZXF1ZXN0Q29uZmlybVZlcmlmeUJhc2ljRG9pKG5vZGVfdXJsX2FsaWNlLCBycGNBdXRoQWxpY2UsIGRhcHBVcmxBbGljZSwgbG9nVXNlckIsIGRhcHBVcmxCb2IsIHJlY2lwaWVudF9tYWlsLCBzZW5kZXJfbWFpbF9hbGljZV9iLCB7J2NpdHknOiAnU2ltYmFjaCd9LCBcImJvYkBjaS1kb2ljaGFpbi5vcmdcIiwgXCJib2JcIiwgXCJmcmVlIHJlZ2lzdHJhdGlvblwiKTtcblxuICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2hvdWxkIHRlc3QgaWYgdXNlcnMgY2FuIGV4cG9ydCBPcHRJbnMgJywgZnVuY3Rpb24gKGRvbmUpIHtcbiAgICAgICAgICAgIGNvbnN0IHJlY2lwaWVudF9tYWlsID0gXCJib2JAY2ktZG9pY2hhaW4ub3JnXCI7IC8vXG4gICAgICAgICAgICBjb25zdCBzZW5kZXJfbWFpbF9hbGljZV9hID0gXCJhbGljZS1leHBvcnRAY2ktZG9pY2hhaW4ub3JnXCI7XG4gICAgICAgICAgICBjb25zdCBsb2dBZG1pbiA9IGxvZ2luKGRhcHBVcmxBbGljZSwgZEFwcExvZ2luLCB0cnVlKTtcbiAgICAgICAgICAgIGNvbnN0IGxvZ1VzZXJBID0gbG9naW4oZGFwcFVybEFsaWNlLCBhbGljZUFMb2dpbiwgdHJ1ZSk7XG4gICAgICAgICAgICByZXF1ZXN0Q29uZmlybVZlcmlmeUJhc2ljRG9pKG5vZGVfdXJsX2FsaWNlLCBycGNBdXRoQWxpY2UsIGRhcHBVcmxBbGljZSwgbG9nVXNlckEsIGRhcHBVcmxCb2IsIHJlY2lwaWVudF9tYWlsLCBzZW5kZXJfbWFpbF9hbGljZV9hLCB7J2NpdHknOiAnTcO8bmNoZW4nfSwgXCJib2JAY2ktZG9pY2hhaW4ub3JnXCIsIFwiYm9iXCIsIHRydWUpO1xuICAgICAgICAgICAgY29uc3QgZXhwb3J0ZWRPcHRJbnMgPSBleHBvcnRPcHRJbnMoZGFwcFVybEFsaWNlLCBsb2dBZG1pbiwgdHJ1ZSk7XG4gICAgICAgICAgICBjaGFpLmV4cGVjdChleHBvcnRlZE9wdElucykudG8ubm90LmJlLnVuZGVmaW5lZDtcbiAgICAgICAgICAgIGNoYWkuZXhwZWN0KGV4cG9ydGVkT3B0SW5zWzBdKS50by5ub3QuYmUudW5kZWZpbmVkO1xuICAgICAgICAgICAgY2hhaS5leHBlY3QoZXhwb3J0ZWRPcHRJbnNbMF0uUmVjaXBpZW50RW1haWwuZW1haWwpLnRvLmJlLmVxdWFsKHJlY2lwaWVudF9tYWlsKTtcbiAgICAgICAgICAgIGNvbnN0IGV4cG9ydGVkT3B0SW5zQSA9IGV4cG9ydE9wdElucyhkYXBwVXJsQWxpY2UsIGxvZ1VzZXJBLCB0cnVlKTtcbiAgICAgICAgICAgIGV4cG9ydGVkT3B0SW5zQS5mb3JFYWNoKGVsZW1lbnQgPT4ge1xuICAgICAgICAgICAgICAgIGNoYWkuZXhwZWN0KGVsZW1lbnQub3duZXJJZCkudG8uYmUuZXF1YWwobG9nVXNlckEudXNlcklkKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgLy9jaGFpLmV4cGVjdChmaW5kT3B0SW4ocmVzdWx0RGF0YU9wdEluLl9pZCkpLnRvLm5vdC5iZS51bmRlZmluZWQ7XG4gICAgICAgICAgICBkb25lKCk7XG4gICAgICAgIH0pO1xuXG5cbiAgICAgICAgaXQoJ3Nob3VsZCB0ZXN0IGlmIGFkbWluIGNhbiB1cGRhdGUgdXNlciBwcm9maWxlcycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJlc2V0VXNlcnMoKTtcbiAgICAgICAgICAgIGxldCBsb2dBZG1pbiA9IGxvZ2luKGRhcHBVcmxBbGljZSwgZEFwcExvZ2luLCB0cnVlKTtcbiAgICAgICAgICAgIGNvbnN0IHVzZXJVcCA9IGNyZWF0ZVVzZXIoZGFwcFVybEFsaWNlLCBsb2dBZG1pbiwgXCJ1cGRhdGVVc2VyXCIsIHRlbXBsYXRlVXJsQSwgdHJ1ZSk7XG4gICAgICAgICAgICBjb25zdCBjaGFuZ2VkRGF0YSA9IHVwZGF0ZVVzZXIoZGFwcFVybEFsaWNlLCBsb2dBZG1pbiwgdXNlclVwLCB7XCJ0ZW1wbGF0ZVVSTFwiOiB0ZW1wbGF0ZVVybEJ9LCB0cnVlKTtcbiAgICAgICAgICAgIGNoYWkuZXhwZWN0KGNoYW5nZWREYXRhKS5ub3QudW5kZWZpbmVkO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2hvdWxkIHRlc3QgaWYgdXNlciBjYW4gdXBkYXRlIG93biBwcm9maWxlJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmVzZXRVc2VycygpO1xuICAgICAgICAgICAgbGV0IGxvZ0FkbWluID0gbG9naW4oZGFwcFVybEFsaWNlLCBkQXBwTG9naW4sIHRydWUpO1xuICAgICAgICAgICAgY29uc3QgdXNlclVwID0gY3JlYXRlVXNlcihkYXBwVXJsQWxpY2UsIGxvZ0FkbWluLCBcInVwZGF0ZVVzZXJcIiwgdGVtcGxhdGVVcmxBLCB0cnVlKTtcbiAgICAgICAgICAgIGNvbnN0IGxvZ1VzZXJVcCA9IGxvZ2luKGRhcHBVcmxBbGljZSwge1widXNlcm5hbWVcIjogXCJ1cGRhdGVVc2VyXCIsIFwicGFzc3dvcmRcIjogXCJwYXNzd29yZFwifSwgdHJ1ZSk7XG4gICAgICAgICAgICBjb25zdCBjaGFuZ2VkRGF0YSA9IHVwZGF0ZVVzZXIoZGFwcFVybEFsaWNlLCBsb2dVc2VyVXAsIHVzZXJVcCwge1widGVtcGxhdGVVUkxcIjogdGVtcGxhdGVVcmxCfSwgdHJ1ZSk7XG4gICAgICAgICAgICBjaGFpLmV4cGVjdChjaGFuZ2VkRGF0YSkubm90LnVuZGVmaW5lZDtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCB0ZXN0IGlmIGNvRG9pIHdvcmtzJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY29uc3QgY29Eb2lMaXN0ID0gW1wiYWxpY2UxQGRvaWNoYWluLWNpLmNvbVwiLCBcImFsaWNlMkBkb2ljaGFpbi1jaS5jb21cIiwgXCJhbGljZTNAZG9pY2hhaW4tY2kuY29tXCJdO1xuICAgICAgICAgICAgY29uc3QgcmVjaXBpZW50X21haWwgPSBcImJvYkBjaS1kb2ljaGFpbi5vcmdcIjtcbiAgICAgICAgICAgIGNvbnN0IHNlbmRlcl9tYWlsID0gY29Eb2lMaXN0O1xuICAgICAgICAgICAgbGV0IGxvZ0FkbWluID0gbG9naW4oZGFwcFVybEFsaWNlLCBkQXBwTG9naW4sIHRydWUpO1xuICAgICAgICAgICAgY29uc3QgY29Eb2lzID0gcmVxdWVzdENvbmZpcm1WZXJpZnlCYXNpY0RvaShub2RlX3VybF9hbGljZSwgcnBjQXV0aEFsaWNlLCBkYXBwVXJsQWxpY2UsIGxvZ0FkbWluLCBkYXBwVXJsQm9iLCByZWNpcGllbnRfbWFpbCwgc2VuZGVyX21haWwsIHsnY2l0eSc6ICdFa2F0ZXJpbmJ1cmcnfSwgXCJib2JAY2ktZG9pY2hhaW4ub3JnXCIsIFwiYm9iXCIsIHRydWUpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2hvdWxkIGZpbmQgdXBkYXRlZCBEYXRhIGluIGVtYWlsJywgZnVuY3Rpb24gKGRvbmUpIHtcbiAgICAgICAgICAgIGNvbnN0IHJlY2lwaWVudF9tYWlsID0gXCJib2JAY2ktZG9pY2hhaW4ub3JnXCI7IC8vcGxlYXNlIHVzZSB0aGlzIGFzIHN0YW5kYXJkIHRvIG5vdCBjb25mdXNlIHBlb3BsZSFcbiAgICAgICAgICAgIGNvbnN0IHNlbmRlcl9tYWlsID0gXCJhbGljZS11cGRhdGVAY2ktZG9pY2hhaW4ub3JnXCI7XG4gICAgICAgICAgICBjb25zdCBhZExvZyA9IGxvZ2luKGRhcHBVcmxBbGljZSwgZEFwcExvZ2luLCBmYWxzZSk7XG4gICAgICAgICAgICB1cGRhdGVVc2VyKGRhcHBVcmxBbGljZSwgYWRMb2csIGFkTG9nLnVzZXJJZCwge1wic3ViamVjdFwiOiBcInVwZGF0ZVRlc3RcIiwgXCJ0ZW1wbGF0ZVVSTFwiOiB0ZW1wbGF0ZVVybEJ9KTtcbiAgICAgICAgICAgIHJlcXVlc3RDb25maXJtVmVyaWZ5QmFzaWNEb2kobm9kZV91cmxfYWxpY2UsIHJwY0F1dGhBbGljZSwgZGFwcFVybEFsaWNlLCBhZExvZywgZGFwcFVybEJvYiwgcmVjaXBpZW50X21haWwsIHNlbmRlcl9tYWlsLCB7J2NpdHknOiAnRWthdGVyaW5idXJnJ30sIFwiYm9iQGNpLWRvaWNoYWluLm9yZ1wiLCBcImJvYlwiLCB0cnVlKTtcbiAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCByZWRpcmVjdCBpZiBjb25maXJtYXRpb24tbGluayBpcyBjbGlja2VkIGFnYWluJyxmdW5jdGlvbigpe1xuICAgICAgICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IDM7IGluZGV4KyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCByZWNpcGllbnRfbWFpbCA9IFwiYm9iQGNpLWRvaWNoYWluLm9yZ1wiOyAvL3BsZWFzZSB1c2UgdGhpcyBhcyBzdGFuZGFyZCB0byBub3QgY29uZnVzZSBwZW9wbGUhXG4gICAgICAgICAgICAgICAgY29uc3Qgc2VuZGVyX21haWwgPSBcImFsaWNlX1wiK2luZGV4K1wiQGNpLWRvaWNoYWluLm9yZ1wiO1xuICAgICAgICAgICAgICAgIGNvbnN0IGRhdGFMb2dpbkFsaWNlID0gbG9naW4oZGFwcFVybEFsaWNlLCBkQXBwTG9naW4sIGZhbHNlKTsgLy9sb2cgaW50byBkQXBwXG4gICAgICAgICAgICAgICAgbGV0IHJldHVybmVkRGF0YSA9IHJlcXVlc3RDb25maXJtVmVyaWZ5QmFzaWNEb2kobm9kZV91cmxfYWxpY2UsIHJwY0F1dGhBbGljZSwgZGFwcFVybEFsaWNlLCBkYXRhTG9naW5BbGljZSwgZGFwcFVybEJvYiwgcmVjaXBpZW50X21haWwsIHNlbmRlcl9tYWlsLCB7J2NpdHknOiAnRWthdGVyaW5idXJnJ30sIFwiYm9iQGNpLWRvaWNoYWluLm9yZ1wiLCBcImJvYlwiLCB0cnVlKTsgICAgXG4gICAgICAgICAgICAgICAgY2hhaS5hc3NlcnQuZXF1YWwodHJ1ZSxjb25maXJtTGluayhyZXR1cm5lZERhdGEuY29uZmlybUxpbmspKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KTtcbiAgICB9KTtcbn1cbiIsImltcG9ydCB7Y2hhaX0gZnJvbSAnbWV0ZW9yL3ByYWN0aWNhbG1ldGVvcjpjaGFpJztcbmltcG9ydCB7XG4gICAgY29uZmlybUxpbmssIGRlbGV0ZUFsbEVtYWlsc0Zyb21Qb3AzLFxuICAgIGZldGNoQ29uZmlybUxpbmtGcm9tUG9wM01haWwsXG4gICAgZ2V0TmFtZUlkT2ZPcHRJbkZyb21SYXdUeCxcbiAgICBsb2dpbixcbiAgICByZXF1ZXN0RE9JLCB2ZXJpZnlET0lcbn0gZnJvbSBcIi4vdGVzdC1hcGkvdGVzdC1hcGktb24tZGFwcFwiO1xuaW1wb3J0IHt0ZXN0TG9nZ2luZ30gZnJvbSBcIi4uLy4uL2ltcG9ydHMvc3RhcnR1cC9zZXJ2ZXIvbG9nLWNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7XG4gICAgZGVsZXRlT3B0SW5zRnJvbUFsaWNlQW5kQm9iLFxuICAgIGdlbmVyYXRldG9hZGRyZXNzLFxuICAgIGdldE5ld0FkZHJlc3MsXG4gICAgc3RhcnQzcmROb2RlLFxuICAgIHN0YXJ0RG9ja2VyQm9iLFxuICAgIHN0b3BEb2NrZXJCb2IsIHdhaXRUb1N0YXJ0Q29udGFpbmVyXG59IGZyb20gXCIuL3Rlc3QtYXBpL3Rlc3QtYXBpLW9uLW5vZGVcIjtcbmNvbnN0IGV4ZWMgPSByZXF1aXJlKCdjaGlsZF9wcm9jZXNzJykuZXhlYztcbmNvbnN0IG5vZGVfdXJsX2FsaWNlID0gJ2h0dHA6Ly8xNzIuMjAuMC42OjE4MzMyLyc7XG5jb25zdCByZWNpcGllbnRfcG9wM3VzZXJuYW1lID0gXCJib2JAY2ktZG9pY2hhaW4ub3JnXCI7XG5jb25zdCByZWNpcGllbnRfcG9wM3Bhc3N3b3JkID0gXCJib2JcIjtcblxuY29uc3QgcnBjQXV0aCA9IFwiYWRtaW46Z2VuZXJhdGVkLXBhc3N3b3JkXCI7XG5jb25zdCBkYXBwVXJsQWxpY2UgPSBcImh0dHA6Ly9sb2NhbGhvc3Q6MzAwMFwiO1xuY29uc3QgZGFwcFVybEJvYiA9IFwiaHR0cDovLzE3Mi4yMC4wLjg6NDAwMFwiO1xuY29uc3QgZEFwcExvZ2luID0ge1widXNlcm5hbWVcIjpcImFkbWluXCIsXCJwYXNzd29yZFwiOlwicGFzc3dvcmRcIn07XG5jb25zdCBsb2cgPSB0cnVlO1xuXG5pZihNZXRlb3IuaXNBcHBUZXN0KSB7XG4gICAgZGVzY3JpYmUoJzAyLWJhc2ljLWRvaS10ZXN0LXdpdGgtb2ZmbGluZS1ub2RlLTAyJywgZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIGJlZm9yZShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBkZWxldGVPcHRJbnNGcm9tQWxpY2VBbmRCb2IoKTtcbiAgICAgICAgICAgIGRlbGV0ZUFsbEVtYWlsc0Zyb21Qb3AzKFwibWFpbFwiLCAxMTAsIHJlY2lwaWVudF9wb3AzdXNlcm5hbWUsIHJlY2lwaWVudF9wb3AzcGFzc3dvcmQsIHRydWUpO1xuICAgICAgICAgICAgZXhlYygnc3VkbyBkb2NrZXIgcm0gM3JkX25vZGUnLCAoZSwgc3Rkb3V0Miwgc3RkZXJyMikgPT4ge1xuICAgICAgICAgICAgICAgIHRlc3RMb2dnaW5nKCdkZWxldGVkIDNyZF9ub2RlOicsIHtzdGRvdXQ6IHN0ZG91dDIsIHN0ZGVycjogc3RkZXJyMn0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgZXhlYygnc3VkbyBkb2NrZXIgc3RvcCAzcmRfbm9kZScsIChlLCBzdGRvdXQsIHN0ZGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0ZXN0TG9nZ2luZygnc3RvcHBlZCAzcmRfbm9kZTonLCB7c3Rkb3V0OiBzdGRvdXQsIHN0ZGVycjogc3RkZXJyfSk7XG4gICAgICAgICAgICAgICAgICAgIGV4ZWMoJ3N1ZG8gZG9ja2VyIHJtIDNyZF9ub2RlJywgKGUsIHN0ZG91dCwgc3RkZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXN0TG9nZ2luZygncmVtb3ZlZCAzcmRfbm9kZTonLCB7c3Rkb3V0OiBzdGRvdXQsIHN0ZGVycjogc3RkZXJyfSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXgpIHtcbiAgICAgICAgICAgICAgICB0ZXN0TG9nZ2luZygnY291bGQgbm90IHN0b3AgM3JkX25vZGUnLCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvL2ltcG9ydFByaXZLZXkobm9kZV91cmxfYm9iLCBycGNBdXRoLCBwcml2S2V5Qm9iLCB0cnVlLCBmYWxzZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGJlZm9yZShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGV4ZWMoJ3N1ZG8gZG9ja2VyIHN0b3AgM3JkX25vZGUnLCAoZSwgc3Rkb3V0LCBzdGRlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGVzdExvZ2dpbmcoJ3N0b3BwZWQgM3JkX25vZGU6Jywge3N0ZG91dDogc3Rkb3V0LCBzdGRlcnI6IHN0ZGVycn0pO1xuICAgICAgICAgICAgICAgICAgICBleGVjKCdzdWRvIGRvY2tlciBybSAzcmRfbm9kZScsIChlLCBzdGRvdXQsIHN0ZGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVzdExvZ2dpbmcoJ3JlbW92ZWQgM3JkX25vZGU6Jywge3N0ZG91dDogc3Rkb3V0LCBzdGRlcnI6IHN0ZGVycn0pO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGV4KSB7XG4gICAgICAgICAgICAgICAgdGVzdExvZ2dpbmcoJ2NvdWxkIG5vdCBzdG9wIDNyZF9ub2RlJywpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2hvdWxkIHRlc3QgaWYgYmFzaWMgRG9pY2hhaW4gd29ya2Zsb3cgaXMgd29ya2luZyB3aGVuIEJvYnMgbm9kZSBpcyB0ZW1wb3JhcmlseSBvZmZsaW5lJywgZnVuY3Rpb24gKGRvbmUpIHtcbiAgICAgICAgICAgIHRoaXMudGltZW91dCgwKTtcbiAgICAgICAgICAgIGdsb2JhbC5hbGljZUFkZHJlc3MgPSBnZXROZXdBZGRyZXNzKG5vZGVfdXJsX2FsaWNlLCBycGNBdXRoLCBmYWxzZSk7XG4gICAgICAgICAgICAvL3N0YXJ0IGFub3RoZXIgM3JkIG5vZGUgYmVmb3JlIHNodXRkb3duIEJvYlxuICAgICAgICAgICAgc3RhcnQzcmROb2RlKCk7XG4gICAgICAgICAgICB2YXIgY29udGFpbmVySWQgPSBzdG9wRG9ja2VyQm9iKCk7XG4gICAgICAgICAgICBjb25zdCByZWNpcGllbnRfbWFpbCA9IFwiYm9iQGNpLWRvaWNoYWluLm9yZ1wiO1xuICAgICAgICAgICAgY29uc3Qgc2VuZGVyX21haWwgPSBcImFsaWNlLXRvLW9mZmxpbmUtbm9kZUBjaS1kb2ljaGFpbi5vcmdcIjtcbiAgICAgICAgICAgIC8vbG9naW4gdG8gZEFwcCAmIHJlcXVlc3QgRE9JIG9uIGFsaWNlIHZpYSBib2JcbiAgICAgICAgICAgIGlmIChsb2cpIHRlc3RMb2dnaW5nKCdsb2cgaW50byBhbGljZSBhbmQgcmVxdWVzdCBET0knKTtcbiAgICAgICAgICAgIGxldCBkYXRhTG9naW5BbGljZSA9IGxvZ2luKGRhcHBVcmxBbGljZSwgZEFwcExvZ2luLCBmYWxzZSk7IC8vbG9nIGludG8gZEFwcFxuICAgICAgICAgICAgbGV0IHJlc3VsdERhdGFPcHRJbiA9IHJlcXVlc3RET0koZGFwcFVybEFsaWNlLCBkYXRhTG9naW5BbGljZSwgcmVjaXBpZW50X21haWwsIHNlbmRlcl9tYWlsLCBudWxsLCB0cnVlKTtcblxuICAgICAgICAgICAgY29uc3QgbmFtZUlkID0gZ2V0TmFtZUlkT2ZPcHRJbkZyb21SYXdUeChub2RlX3VybF9hbGljZSwgcnBjQXV0aCwgcmVzdWx0RGF0YU9wdEluLmRhdGEuaWQsIHRydWUpO1xuICAgICAgICAgICAgaWYgKGxvZykgdGVzdExvZ2dpbmcoJ2dvdCBuYW1lSWQnLCBuYW1lSWQpO1xuICAgICAgICAgICAgdmFyIHN0YXJ0ZWRDb250YWluZXJJZCA9IHN0YXJ0RG9ja2VyQm9iKGNvbnRhaW5lcklkKTtcbiAgICAgICAgICAgIHRlc3RMb2dnaW5nKFwic3RhcnRlZCBib2IncyBub2RlIHdpdGggY29udGFpbmVySWRcIiwgc3RhcnRlZENvbnRhaW5lcklkKTtcbiAgICAgICAgICAgIGNoYWkuZXhwZWN0KHN0YXJ0ZWRDb250YWluZXJJZCkudG8ubm90LmJlLm51bGw7XG4gICAgICAgICAgICB3YWl0VG9TdGFydENvbnRhaW5lcihzdGFydGVkQ29udGFpbmVySWQpO1xuXG4gICAgICAgICAgICAvL2dlbmVyYXRpbmcgYSBibG9jayBzbyB0cmFuc2FjdGlvbiBnZXRzIGNvbmZpcm1lZCBhbmQgZGVsaXZlcmVkIHRvIGJvYi5cbiAgICAgICAgICAgIGdlbmVyYXRldG9hZGRyZXNzKG5vZGVfdXJsX2FsaWNlLCBycGNBdXRoLCBnbG9iYWwuYWxpY2VBZGRyZXNzLCAxLCB0cnVlKTtcbiAgICAgICAgICAgIGxldCBydW5uaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgIGxldCBjb3VudGVyID0gMDtcbiAgICAgICAgICAgIChhc3luYyBmdW5jdGlvbiBsb29wKCkge1xuICAgICAgICAgICAgICAgIHdoaWxlIChydW5uaW5nICYmICsrY291bnRlciA8IDUwKSB7IC8vdHJ5aW5nIDUweCB0byBnZXQgZW1haWwgZnJvbSBib2JzIG1haWxib3hcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICBnZW5lcmF0ZXRvYWRkcmVzcyhub2RlX3VybF9hbGljZSwgcnBjQXV0aCwgZ2xvYmFsLmFsaWNlQWRkcmVzcywgMSwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXN0TG9nZ2luZygnc3RlcCAzOiBnZXR0aW5nIGVtYWlsIScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbGluazJDb25maXJtID0gZmV0Y2hDb25maXJtTGlua0Zyb21Qb3AzTWFpbChcIm1haWxcIiwgMTEwLCByZWNpcGllbnRfcG9wM3VzZXJuYW1lLCByZWNpcGllbnRfcG9wM3Bhc3N3b3JkLCBkYXBwVXJsQm9iLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXN0TG9nZ2luZygnc3RlcCA0OiBjb25maXJtaW5nIGxpbmsnLCBsaW5rMkNvbmZpcm0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGxpbmsyQ29uZmlybSAhPSBudWxsKSBydW5uaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25maXJtTGluayhsaW5rMkNvbmZpcm0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVzdExvZ2dpbmcoJ2NvbmZpcm1lZCcpO1xuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChleCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVzdExvZ2dpbmcoJ3RyeWluZyB0byBnZXQgZW1haWwgLSBzbyBmYXIgbm8gc3VjY2VzczonLCBjb3VudGVyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCAyMDAwKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICBnZW5lcmF0ZXRvYWRkcmVzcyhub2RlX3VybF9hbGljZSwgcnBjQXV0aCwgZ2xvYmFsLmFsaWNlQWRkcmVzcywgMSwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgdmVyaWZ5RE9JKGRhcHBVcmxBbGljZSwgZGF0YUxvZ2luQWxpY2UsIG5vZGVfdXJsX2FsaWNlLCBycGNBdXRoLCBzZW5kZXJfbWFpbCwgcmVjaXBpZW50X21haWwsIG5hbWVJZCwgbG9nKTsgLy9uZWVkIHRvIGdlbmVyYXRlIHR3byBibG9ja3MgdG8gbWFrZSBibG9jayB2aXNpYmxlIG9uIGFsaWNlXG4gICAgICAgICAgICAgICAgdGVzdExvZ2dpbmcoJ2VuZCBvZiBnZXROYW1lSWRPZlJhd1RyYW5zYWN0aW9uIHJldHVybmluZyBuYW1lSWQnLCBuYW1lSWQpO1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGV4ZWMoJ3N1ZG8gZG9ja2VyIHN0b3AgM3JkX25vZGUnLCAoZSwgc3Rkb3V0LCBzdGRlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlc3RMb2dnaW5nKCdzdG9wcGVkIDNyZF9ub2RlOicsIHtzdGRvdXQ6IHN0ZG91dCwgc3RkZXJyOiBzdGRlcnJ9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGV4ZWMoJ3N1ZG8gZG9ja2VyIHJtIDNyZF9ub2RlJywgKGUsIHN0ZG91dCwgc3RkZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVzdExvZ2dpbmcoJ3JlbW92ZWQgM3JkX25vZGU6Jywge3N0ZG91dDogc3Rkb3V0LCBzdGRlcnI6IHN0ZGVycn0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGV4KSB7XG4gICAgICAgICAgICAgICAgICAgIHRlc3RMb2dnaW5nKCdjb3VsZCBub3Qgc3RvcCAzcmRfbm9kZScsKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICAgICAgLy9kb25lKCk7XG4gICAgICAgIH0pOyAvL2l0XG4gICAgfSk7XG59XG4iLCJpbXBvcnQge2NoYWl9IGZyb20gJ21ldGVvci9wcmFjdGljYWxtZXRlb3I6Y2hhaSc7XG5pbXBvcnQge1xuICAgIGRlbGV0ZUFsbEVtYWlsc0Zyb21Qb3AzLCBmaW5kT3B0SW4sXG4gICAgbG9naW4sXG4gICAgcmVxdWVzdENvbmZpcm1WZXJpZnlCYXNpY0RvaSwgcmVxdWVzdERPSVxufSBmcm9tIFwiLi90ZXN0LWFwaS90ZXN0LWFwaS1vbi1kYXBwXCI7XG5pbXBvcnQge2xvZ0Jsb2NrY2hhaW59IGZyb20gXCIuLi8uLi9pbXBvcnRzL3N0YXJ0dXAvc2VydmVyL2xvZy1jb25maWd1cmF0aW9uXCI7XG5pbXBvcnQge2RlbGV0ZU9wdEluc0Zyb21BbGljZUFuZEJvYiwgZ2VuZXJhdGV0b2FkZHJlc3MsIGdldE5ld0FkZHJlc3N9IGZyb20gXCIuL3Rlc3QtYXBpL3Rlc3QtYXBpLW9uLW5vZGVcIjtcblxuY29uc3Qgbm9kZV91cmxfYWxpY2UgPSAnaHR0cDovLzE3Mi4yMC4wLjY6MTgzMzIvJztcbmNvbnN0IHJwY0F1dGhBbGljZSA9IFwiYWRtaW46Z2VuZXJhdGVkLXBhc3N3b3JkXCI7XG5jb25zdCBkYXBwVXJsQWxpY2UgPSBcImh0dHA6Ly9sb2NhbGhvc3Q6MzAwMFwiO1xuY29uc3QgZGFwcFVybEJvYiA9IFwiaHR0cDovLzE3Mi4yMC4wLjg6NDAwMFwiO1xuY29uc3QgZEFwcExvZ2luID0ge1widXNlcm5hbWVcIjpcImFkbWluXCIsXCJwYXNzd29yZFwiOlwicGFzc3dvcmRcIn07XG5jb25zdCByZWNpcGllbnRfcG9wM3VzZXJuYW1lID0gXCJib2JAY2ktZG9pY2hhaW4ub3JnXCI7XG5jb25zdCByZWNpcGllbnRfcG9wM3Bhc3N3b3JkID0gXCJib2JcIjtcblxuaWYoTWV0ZW9yLmlzQXBwVGVzdCkge1xuICAgIGRlc2NyaWJlKCcwMy1iYXNpYy1kb2ktdGVzdC0wMycsIGZ1bmN0aW9uICgpIHtcblxuICAgICAgICBiZWZvcmUoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgbG9nQmxvY2tjaGFpbihcInJlbW92aW5nIE9wdElucyxSZWNpcGllbnRzLFNlbmRlcnNcIik7XG4gICAgICAgICAgICBkZWxldGVPcHRJbnNGcm9tQWxpY2VBbmRCb2IoKTtcbiAgICAgICAgICAgIGRlbGV0ZUFsbEVtYWlsc0Zyb21Qb3AzKFwibWFpbFwiLCAxMTAsIHJlY2lwaWVudF9wb3AzdXNlcm5hbWUsIHJlY2lwaWVudF9wb3AzcGFzc3dvcmQsIHRydWUpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdCgnc2hvdWxkIHRlc3QgaWYgYmFzaWMgRG9pY2hhaW4gd29ya2Zsb3cgcnVubmluZyA1IHRpbWVzJywgZnVuY3Rpb24gKGRvbmUpIHtcbiAgICAgICAgICAgIHRoaXMudGltZW91dCgwKTtcblxuICAgICAgICAgICAgY29uc3QgZGF0YUxvZ2luQWxpY2UgPSBsb2dpbihkYXBwVXJsQWxpY2UsIGRBcHBMb2dpbiwgZmFsc2UpOyAvL2xvZyBpbnRvIGRBcHBcbiAgICAgICAgICAgIGdsb2JhbC5hbGljZUFkZHJlc3MgPSBnZXROZXdBZGRyZXNzKG5vZGVfdXJsX2FsaWNlLCBycGNBdXRoQWxpY2UsIGZhbHNlKTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMjA7IGkrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlY2lwaWVudF9tYWlsID0gXCJib2JAY2ktZG9pY2hhaW4ub3JnXCI7IC8vcGxlYXNlIHVzZSB0aGlzIGFzIHN0YW5kYXJkIHRvIG5vdCBjb25mdXNlIHBlb3BsZSFcbiAgICAgICAgICAgICAgICBjb25zdCBzZW5kZXJfbWFpbCA9IFwiYWxpY2VfXCIgKyBpICsgXCJAY2ktZG9pY2hhaW4ub3JnXCI7XG4gICAgICAgICAgICAgICAgcmVxdWVzdENvbmZpcm1WZXJpZnlCYXNpY0RvaShub2RlX3VybF9hbGljZSwgcnBjQXV0aEFsaWNlLCBkYXBwVXJsQWxpY2UsIGRhdGFMb2dpbkFsaWNlLCBkYXBwVXJsQm9iLCByZWNpcGllbnRfbWFpbCwgc2VuZGVyX21haWwsIHsnY2l0eSc6ICdFa2F0ZXJpbmJ1cmdfJyArIGl9LCBcImJvYkBjaS1kb2ljaGFpbi5vcmdcIiwgXCJib2JcIiwgdHJ1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkb25lKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KCdzaG91bGQgdGVzdCBpZiBiYXNpYyBEb2ljaGFpbiB3b3JrZmxvdyBydW5uaW5nIDIwIHRpbWVzIHdpdGhvdXQgY29uZmlybWF0aW9uIGFuZCB2ZXJpZmljYXRpb24nLCBmdW5jdGlvbiAoZG9uZSkge1xuICAgICAgICAgICAgdGhpcy50aW1lb3V0KDApO1xuICAgICAgICAgICAgZGVsZXRlQWxsRW1haWxzRnJvbVBvcDMoXCJtYWlsXCIsIDExMCwgcmVjaXBpZW50X3BvcDN1c2VybmFtZSwgcmVjaXBpZW50X3BvcDNwYXNzd29yZCwgdHJ1ZSk7XG4gICAgICAgICAgICBjb25zdCBkYXRhTG9naW5BbGljZSA9IGxvZ2luKGRhcHBVcmxBbGljZSwgZEFwcExvZ2luLCBmYWxzZSk7IC8vbG9nIGludG8gZEFwcFxuICAgICAgICAgICAgZ2xvYmFsLmFsaWNlQWRkcmVzcyA9IGdldE5ld0FkZHJlc3Mobm9kZV91cmxfYWxpY2UsIHJwY0F1dGhBbGljZSwgZmFsc2UpO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAyMDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVjaXBpZW50X21haWwgPSBcImJvYkBjaS1kb2ljaGFpbi5vcmdcIjsgLy9wbGVhc2UgdXNlIHRoaXMgYXMgc3RhbmRhcmQgdG8gbm90IGNvbmZ1c2UgcGVvcGxlIVxuICAgICAgICAgICAgICAgIGNvbnN0IHNlbmRlcl9tYWlsID0gXCJhbGljZV9cIiArIGkgKyBcIkBjaS1kb2ljaGFpbi5vcmdcIjtcbiAgICAgICAgICAgICAgICBjb25zdCByZXN1bHREYXRhT3B0SW4gPSByZXF1ZXN0RE9JKGRhcHBVcmxBbGljZSwgZGF0YUxvZ2luQWxpY2UsIHJlY2lwaWVudF9tYWlsLCBzZW5kZXJfbWFpbCwgbnVsbCwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgY2hhaS5leHBlY3QoZmluZE9wdEluKHJlc3VsdERhdGFPcHRJbi5kYXRhLmlkLCB0cnVlKSkudG8ubm90LmJlLnVuZGVmaW5lZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoJ3Nob3VsZCB0ZXN0IGlmIGJhc2ljIERvaWNoYWluIHdvcmtmbG93IHJ1bm5pbmcgMTAwIHRpbWVzIHdpdGggd2l0aG91dCBjb25maXJtYXRpb24gYW5kIHZlcmlmaWNhdGlvbicsIGZ1bmN0aW9uIChkb25lKSB7XG4gICAgICAgICAgICB0aGlzLnRpbWVvdXQoMCk7XG4gICAgICAgICAgICBkZWxldGVBbGxFbWFpbHNGcm9tUG9wMyhcIm1haWxcIiwgMTEwLCByZWNpcGllbnRfcG9wM3VzZXJuYW1lLCByZWNpcGllbnRfcG9wM3Bhc3N3b3JkLCB0cnVlKTtcbiAgICAgICAgICAgIGNvbnN0IGRhdGFMb2dpbkFsaWNlID0gbG9naW4oZGFwcFVybEFsaWNlLCBkQXBwTG9naW4sIGZhbHNlKTsgLy9sb2cgaW50byBkQXBwXG4gICAgICAgICAgICBnbG9iYWwuYWxpY2VBZGRyZXNzID0gZ2V0TmV3QWRkcmVzcyhub2RlX3VybF9hbGljZSwgcnBjQXV0aEFsaWNlLCBmYWxzZSk7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDEwMDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVjaXBpZW50X21haWwgPSBcImJvYkBjaS1kb2ljaGFpbi5vcmdcIjsgLy9wbGVhc2UgdXNlIHRoaXMgYXMgc3RhbmRhcmQgdG8gbm90IGNvbmZ1c2UgcGVvcGxlIVxuICAgICAgICAgICAgICAgIGNvbnN0IHNlbmRlcl9tYWlsID0gXCJhbGljZV9cIiArIGkgKyBcIkBjaS1kb2ljaGFpbi5vcmdcIjtcbiAgICAgICAgICAgICAgICBjb25zdCByZXN1bHREYXRhT3B0SW4gPSByZXF1ZXN0RE9JKGRhcHBVcmxBbGljZSwgZGF0YUxvZ2luQWxpY2UsIHJlY2lwaWVudF9tYWlsLCBzZW5kZXJfbWFpbCwgbnVsbCwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgY2hhaS5leHBlY3QoZmluZE9wdEluKHJlc3VsdERhdGFPcHRJbi5kYXRhLmlkLCB0cnVlKSkudG8ubm90LmJlLnVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICBpZiAoaSAlIDEwMCA9PT0gMCkgZ2VuZXJhdGV0b2FkZHJlc3Mobm9kZV91cmxfYWxpY2UsIHJwY0F1dGhBbGljZSwgZ2xvYmFsLmFsaWNlQWRkcmVzcywgMSwgdHJ1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkb25lKCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufSIsImlmKE1ldGVvci5pc0FwcFRlc3QgfHwgTWV0ZW9yLmlzVGVzdCkge1xuXG4gICAgZGVzY3JpYmUoJ3NpbXBsZS1zZWxlbml1bS10ZXN0JywgZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIHRoaXMudGltZW91dCgxMDAwMCk7XG4gICAgICAgIGJlZm9yZUVhY2goZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIH0pO1xuXG5cbiAgICB9KTtcbn1cbiIsImltcG9ydCB7Y2hhaX0gZnJvbSAnbWV0ZW9yL3ByYWN0aWNhbG1ldGVvcjpjaGFpJztcbmltcG9ydCB7bG9nQmxvY2tjaGFpbn0gZnJvbSBcIi4uLy4uL2ltcG9ydHMvc3RhcnR1cC9zZXJ2ZXIvbG9nLWNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7ZGVsZXRlT3B0SW5zRnJvbUFsaWNlQW5kQm9iLCBnZXRCYWxhbmNlLCBpbml0QmxvY2tjaGFpbn0gZnJvbSBcIi4vdGVzdC1hcGkvdGVzdC1hcGktb24tbm9kZVwiO1xuaW1wb3J0IHtsb2dpbiwgcmVxdWVzdENvbmZpcm1WZXJpZnlCYXNpY0RvaX0gZnJvbSBcIi4vdGVzdC1hcGkvdGVzdC1hcGktb24tZGFwcFwiO1xuY29uc3Qgbm9kZV91cmxfYWxpY2UgPSAnaHR0cDovLzE3Mi4yMC4wLjY6MTgzMzIvJztcbmNvbnN0IG5vZGVfdXJsX2JvYiA9ICAgJ2h0dHA6Ly8xNzIuMjAuMC43OjE4MzMyLyc7XG5jb25zdCBycGNBdXRoID0gXCJhZG1pbjpnZW5lcmF0ZWQtcGFzc3dvcmRcIjtcbmNvbnN0IHByaXZLZXlCb2IgPSBcImNQM0VpZ2t6c1d1eUtFbXhrOGNDNnFYWWI0Wmp3VW81dnp2WnBBUG1EUTgzUkNnWFFydWpcIjtcbmNvbnN0IGxvZyA9IHRydWU7XG5cblxuY29uc3QgcnBjQXV0aEFsaWNlID0gXCJhZG1pbjpnZW5lcmF0ZWQtcGFzc3dvcmRcIjtcbmNvbnN0IGRhcHBVcmxBbGljZSA9IFwiaHR0cDovL2xvY2FsaG9zdDozMDAwXCI7XG5jb25zdCBkYXBwVXJsQm9iID0gXCJodHRwOi8vMTcyLjIwLjAuODo0MDAwXCI7XG5jb25zdCBkQXBwTG9naW4gPSB7XCJ1c2VybmFtZVwiOlwiYWRtaW5cIixcInBhc3N3b3JkXCI6XCJwYXNzd29yZFwifTtcblxuXG5pZihNZXRlb3IuaXNUZXN0IHx8IE1ldGVvci5pc0FwcFRlc3QpIHtcblxuICAgIHhkZXNjcmliZSgnYmFzaWMtZG9pLXRlc3QtbmljbycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy50aW1lb3V0KDYwMDAwMCk7XG5cbiAgICAgICAgYmVmb3JlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGxvZ0Jsb2NrY2hhaW4oXCJyZW1vdmluZyBPcHRJbnMsUmVjaXBpZW50cyxTZW5kZXJzXCIpO1xuICAgICAgICAgICAgZGVsZXRlT3B0SW5zRnJvbUFsaWNlQW5kQm9iKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHhpdCgnc2hvdWxkIGNyZWF0ZSBhIFJlZ1Rlc3QgRG9pY2hhaW4gd2l0aCBhbGljZSBhbmQgYm9iIGFuZCBzb21lIERvaSAtIGNvaW5zJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaW5pdEJsb2NrY2hhaW4obm9kZV91cmxfYWxpY2Usbm9kZV91cmxfYm9iLHJwY0F1dGgscHJpdktleUJvYix0cnVlKTtcbiAgICAgICAgICAgIGNvbnN0IGFsaWNlQmFsYW5jZSA9IGdldEJhbGFuY2Uobm9kZV91cmxfYWxpY2UsIHJwY0F1dGgsIGxvZyk7XG4gICAgICAgICAgICBjaGFpLmFzc2VydC5pc0Fib3ZlKGFsaWNlQmFsYW5jZSwgMCwgJ25vIGZ1bmRpbmchICcpO1xuICAgICAgICB9KTtcblxuICAgICAgICB4aXQoJ3Nob3VsZCB0ZXN0IGlmIGJhc2ljIERvaWNoYWluIHdvcmtmbG93IGlzIHdvcmtpbmcgd2l0aCBvcHRpb25hbCBkYXRhJywgZnVuY3Rpb24gKGRvbmUpIHtcbiAgICAgICAgICAgIGNvbnN0IHJlY2lwaWVudF9tYWlsID0gXCJib2IrMUBjaS1kb2ljaGFpbi5vcmdcIjsgLy9wbGVhc2UgdXNlIHRoaXMgYXMgc3RhbmRhcmQgdG8gbm90IGNvbmZ1c2UgcGVvcGxlIVxuICAgICAgICAgICAgY29uc3Qgc2VuZGVyX21haWwgPSBcImFsaWNlQGNpLWRvaWNoYWluLm9yZ1wiO1xuICAgICAgICAgICAgY29uc3QgZGF0YUxvZ2luQWxpY2UgPSBsb2dpbihkYXBwVXJsQWxpY2UsIGRBcHBMb2dpbiwgZmFsc2UpOyAvL2xvZyBpbnRvIGRBcHBcbiAgICAgICAgICAgIHJlcXVlc3RDb25maXJtVmVyaWZ5QmFzaWNEb2kobm9kZV91cmxfYWxpY2UsIHJwY0F1dGhBbGljZSwgZGFwcFVybEFsaWNlLCBkYXRhTG9naW5BbGljZSwgZGFwcFVybEJvYiwgcmVjaXBpZW50X21haWwsIHNlbmRlcl9tYWlsLCB7J2NpdHknOiAnRWthdGVyaW5idXJnJ30sIFwiYm9iQGNpLWRvaWNoYWluLm9yZ1wiLCBcImJvYlwiLCB0cnVlKTtcbiAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB4ZGVzY3JpYmUoJ2Jhc2ljLWRvaS10ZXN0LW5pY28nLCBmdW5jdGlvbiAoKSB7XG5cblxuICAgICAgICAvKipcbiAgICAgICAgICogSW5mb3JtYXRpb24gcmVnYXJkaW5nIHRvIGV2ZW50IGxvb3Agbm9kZS5qc1xuICAgICAgICAgKiAtIGh0dHBzOi8vbm9kZWpzLm9yZy9lbi9kb2NzL2d1aWRlcy9ldmVudC1sb29wLXRpbWVycy1hbmQtbmV4dHRpY2svXG4gICAgICAgICAqXG4gICAgICAgICAqIFByb21pc2VzOlxuICAgICAgICAgKiAtIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL3dlYi9mdW5kYW1lbnRhbHMvcHJpbWVycy9wcm9taXNlc1xuICAgICAgICAgKlxuICAgICAgICAgKiBQcm9taXNlIGxvb3BzIGFuZCBhc3luYyB3YWl0XG4gICAgICAgICAqIC0gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNDAzMjg5MzIvamF2YXNjcmlwdC1lczYtcHJvbWlzZS1mb3ItbG9vcFxuICAgICAgICAgKlxuICAgICAgICAgKiBBc3luY2hyb25vdXMgbG9vcHMgd2l0aCBtb2NoYTpcbiAgICAgICAgICogLSBodHRwczovL3doaXRmaW4uaW8vYXN5bmNocm9ub3VzLXRlc3QtbG9vcHMtd2l0aC1tb2NoYS9cbiAgICAgICAgICovXG4gICAgICAgIC8qICBpdCgnc2hvdWxkIHRlc3QgYSB0aW1lb3V0IHdpdGggYSBwcm9taXNlJywgZnVuY3Rpb24gKGRvbmUpIHtcbiAgICAgICAgICAgICAgbG9nQmxvY2tjaGFpbihcInRydXlpbmcgYSBwcm9taXNlXCIpO1xuICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDEwOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgIGNvbnN0IHByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgY29uc3QgdGltZW91dCA9IE1hdGgucmFuZG9tKCkgKiAxMDAwO1xuICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygncHJvbWlzZTonK2kpO1xuICAgICAgICAgICAgICAgICAgICAgIH0sIHRpbWVvdXQpO1xuICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAvLyBUT0RPOiBDaGFpbiB0aGlzIHByb21pc2UgdG8gdGhlIHByZXZpb3VzIG9uZSAobWF5YmUgd2l0aG91dCBoYXZpbmcgaXQgcnVubmluZz8pXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgaXQoJ3Nob3VsZCBydW4gYSBsb29wIHdpdGggYXN5bmMgd2FpdCcsIGZ1bmN0aW9uIChkb25lKSB7XG4gICAgICAgICAgICAgIGxvZ0Jsb2NrY2hhaW4oXCJ0cnlpbmcgYXN5Y24gd2FpdFwiKTtcbiAgICAgICAgICAgICAgKGFzeW5jIGZ1bmN0aW9uIGxvb3AoKSB7XG4gICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDEwOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgTWF0aC5yYW5kb20oKSAqIDEwMDApKTtcbiAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnYXN5bmMgd2FpdCcraSk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICBkb25lKClcbiAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIHhpdCgnc2hvdWxkIHNhZmVseSBzdG9wIGFuZCBzdGFydCBib2JzIGRvaWNoYWluIG5vZGUgY29udGFpbmVyJywgZnVuY3Rpb24gKGRvbmUpIHtcbiAgICAgICAgICAgICAgdmFyIGNvbnRhaW5lcklkID0gc3RvcERvY2tlckJvYigpO1xuXG4gICAgICAgICAgICAgIGxvZ0Jsb2NrY2hhaW4oXCJzdG9wcGVkIGJvYidzIG5vZGUgd2l0aCBjb250YWluZXJJZFwiLGNvbnRhaW5lcklkKTtcbiAgICAgICAgICAgICAgY2hhaS5leHBlY3QoY29udGFpbmVySWQpLnRvLm5vdC5iZS5udWxsO1xuXG4gICAgICAgICAgICAgIHZhciBzdGFydGVkQ29udGFpbmVySWQgPSBzdGFydERvY2tlckJvYihjb250YWluZXJJZCk7XG4gICAgICAgICAgICAgIGxvZ0Jsb2NrY2hhaW4oXCJzdGFydGVkIGJvYidzIG5vZGUgd2l0aCBjb250YWluZXJJZFwiLHN0YXJ0ZWRDb250YWluZXJJZCk7XG4gICAgICAgICAgICAgIGNoYWkuZXhwZWN0KHN0YXJ0ZWRDb250YWluZXJJZCkudG8ubm90LmJlLm51bGw7XG5cbiAgICAgICAgICAgICAgbGV0IHJ1bm5pbmcgPSB0cnVlO1xuICAgICAgICAgICAgICB3aGlsZShydW5uaW5nKXtcbiAgICAgICAgICAgICAgICAgIHJ1bkFuZFdhaXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgIHRyeXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgc3RhdHVzRG9ja2VyID0gSlNPTi5wYXJzZShnZXREb2NrZXJTdGF0dXMoY29udGFpbmVySWQpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgbG9nQmxvY2tjaGFpbihcImdldGluZm9cIixzdGF0dXNEb2NrZXIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICBsb2dCbG9ja2NoYWluKFwidmVyc2lvbjpcIitzdGF0dXNEb2NrZXIudmVyc2lvbik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGxvZ0Jsb2NrY2hhaW4oXCJiYWxhbmNlOlwiK3N0YXR1c0RvY2tlci5iYWxhbmNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgbG9nQmxvY2tjaGFpbihcImJhbGFuY2U6XCIrc3RhdHVzRG9ja2VyLmNvbm5lY3Rpb25zKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoc3RhdHVzRG9ja2VyLmNvbm5lY3Rpb25zPT09MCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb2ljaGFpbkFkZE5vZGUoY29udGFpbmVySWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHJ1bm5pbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgY2F0Y2goZXJyb3Ipe1xuICAgICAgICAgICAgICAgICAgICAgICAgICBsb2dCbG9ja2NoYWluKFwic3RhdHVzRG9ja2VyIHByb2JsZW06XCIsZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIH0sMik7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBkb25lKCk7XG4gICAgICAgICAgfSk7Ki9cbiAgICB9KTtcbn0iLCJpbXBvcnQge2NoYWl9IGZyb20gJ21ldGVvci9wcmFjdGljYWxtZXRlb3I6Y2hhaSc7XG5pZihNZXRlb3IuaXNUZXN0KSB7XG5cbiAgICBkZXNjcmliZSgnYmFzaWMtZG9pLXRlc3QtZmxvJywgZnVuY3Rpb24gKCkge1xuICAgIH0pO1xufVxuXG5cbiIsImltcG9ydCAnL2ltcG9ydHMvc3RhcnR1cC9zZXJ2ZXInO1xuaW1wb3J0ICcuL2FwaS9pbmRleC5qcyc7XG4iXX0=
