(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;
var Collection2 = Package['aldeed:collection2'].Collection2;
var Roles = Package['alanning:roles'].Roles;
var ValidatedMethod = Package['mdg:validated-method'].ValidatedMethod;
var _i18n = Package['universe:i18n']._i18n;
var i18n = Package['universe:i18n'].i18n;
var _ = Package.underscore._;
var Job = Package['vsivsi:job-collection'].Job;
var JobCollection = Package['vsivsi:job-collection'].JobCollection;
var Restivus = Package['nimble:restivus'].Restivus;
var HTTP = Package.http.HTTP;
var HTTPInternals = Package.http.HTTPInternals;
var meteorInstall = Package.modules.meteorInstall;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;

var require = meteorInstall({"node_modules":{"meteor":{"doichain:doichain-meteor-api":{"doichain-server-api.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/doichain_doichain-meteor-api/doichain-server-api.js                                                       //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.export({
  name: () => name,
  OptInsCollection: () => OptInsCollection,
  RecipientsCollection: () => RecipientsCollection,
  httpGET: () => httpGET,
  httpGETdata: () => httpGETdata,
  httpPOST: () => httpPOST,
  testLog: () => testLog,
  testvar1: () => testvar1
});
module.link("./server/main.js");
let OptIns;
module.link("./imports/api/opt-ins/opt-ins", {
  OptIns(v) {
    OptIns = v;
  }

}, 0);
let Recipients;
module.link("./imports/api/recipients/recipients", {
  Recipients(v) {
    Recipients = v;
  }

}, 1);
let getHttpGET, getHttpGETdata, getHttpPOST;
module.link("./server/api/http", {
  getHttpGET(v) {
    getHttpGET = v;
  },

  getHttpGETdata(v) {
    getHttpGETdata = v;
  },

  getHttpPOST(v) {
    getHttpPOST = v;
  }

}, 2);
let testLogging;
module.link("./imports/startup/server/log-configuration", {
  testLogging(v) {
    testLogging = v;
  }

}, 3);
const name = 'doichain-meteor-api';
let OptInsCollection = OptIns;
let RecipientsCollection = Recipients;
let httpGET = getHttpGET;
let httpGETdata = getHttpGETdata;
let httpPOST = getHttpPOST;
let testLog = testLogging;
let testvar1 = "i am alive";
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"imports":{"api":{"doichain":{"entries.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/doichain_doichain-meteor-api/imports/api/doichain/entries.js                                              //
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
    type: String // index: true,
    // denyUpdate: true

  },
  value: {
    type: String // denyUpdate: false

  },
  address: {
    type: String // denyUpdate: false

  },
  masterDoi: {
    type: String,
    optional: true //    index: true,
    //    denyUpdate: true //TODO doesn't work inside a backage aldeed:schema-index@3.0.0

  },
  index: {
    type: SimpleSchema.Integer,
    optional: true // denyUpdate: true

  },
  txId: {
    type: String // denyUpdate: false

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
// packages/doichain_doichain-meteor-api/imports/api/doichain/methods.js                                              //
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
// packages/doichain_doichain-meteor-api/imports/api/languages/methods.js                                             //
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
// packages/doichain_doichain-meteor-api/imports/api/meta/meta.js                                                     //
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
    type: String //  index: true, //TODO doesn't work inside a backage aldeed:schema-index@3.0.0
    // TODO see https://github.com/aldeed/meteor-collection2/issues/378
    //  denyUpdate: true //TODO aldeed:schema-deny@2.0.1

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

}},"opt-ins":{"methods.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/doichain_doichain-meteor-api/imports/api/opt-ins/methods.js                                               //
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
// packages/doichain_doichain-meteor-api/imports/api/opt-ins/opt-ins.js                                               //
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
    optional: true //   denyUpdate: true, //TODO enable this when this package works again see meta

  },
  sender: {
    type: String,
    optional: true //    denyUpdate: true,

  },
  data: {
    type: String,
    optional: true //   denyUpdate: false,

  },
  index: {
    type: SimpleSchema.Integer,
    optional: true //  denyUpdate: false,

  },
  nameId: {
    type: String,
    optional: true //  denyUpdate: false,

  },
  txId: {
    type: String,
    optional: true //   denyUpdate: false,

  },
  masterDoi: {
    type: String,
    optional: true //    denyUpdate: false,

  },
  createdAt: {
    type: Date //    denyUpdate: true,

  },
  confirmedAt: {
    type: Date,
    optional: true //   denyUpdate: false,

  },
  confirmedBy: {
    type: String,
    regEx: SimpleSchema.RegEx.IP,
    optional: true //   denyUpdate: false

  },
  confirmationToken: {
    type: String,
    optional: true //  denyUpdate: false

  },
  ownerId: {
    type: String,
    optional: true,
    regEx: SimpleSchema.RegEx.Id
  },
  error: {
    type: String,
    optional: true //   denyUpdate: false

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

},"server":{"publications.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/doichain_doichain-meteor-api/imports/api/opt-ins/server/publications.js                                   //
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

}}},"recipients":{"recipients.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/doichain_doichain-meteor-api/imports/api/recipients/recipients.js                                         //
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
    type: String //index: true,
    //denyUpdate: true,

  },
  privateKey: {
    type: String //unique: true, //TODO enable this when this package works again see meta
    //denyUpdate: true,

  },
  publicKey: {
    type: String //unique: true,
    //denyUpdate: true,

  },
  createdAt: {
    type: Date //denyUpdate: true,

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

},"server":{"publications.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/doichain_doichain-meteor-api/imports/api/recipients/server/publications.js                                //
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

}}},"senders":{"senders.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/doichain_doichain-meteor-api/imports/api/senders/senders.js                                               //
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
    type: String //index: true,   //TODO enable this when this package works again see meta
    //denyUpdate: true,

  },
  createdAt: {
    type: Date //denyUpdate: true,

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
// packages/doichain_doichain-meteor-api/imports/modules/server/dapps/export_dois.js                                  //
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
// packages/doichain_doichain-meteor-api/imports/modules/server/dapps/fetch_doi-mail-data.js                          //
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
// packages/doichain_doichain-meteor-api/imports/modules/server/dapps/get_doi-mail-data.js                            //
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
// packages/doichain_doichain-meteor-api/imports/modules/server/dns/get_opt-in-key.js                                 //
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
// packages/doichain_doichain-meteor-api/imports/modules/server/dns/get_opt-in-provider.js                            //
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
// packages/doichain_doichain-meteor-api/imports/modules/server/doichain/add_entry_and_fetch_data.js                  //
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
// packages/doichain_doichain-meteor-api/imports/modules/server/doichain/check_new_transactions.js                    //
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
// packages/doichain_doichain-meteor-api/imports/modules/server/doichain/decrypt_message.js                           //
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
// packages/doichain_doichain-meteor-api/imports/modules/server/doichain/encrypt_message.js                           //
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
// packages/doichain_doichain-meteor-api/imports/modules/server/doichain/generate_name-id.js                          //
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
// packages/doichain_doichain-meteor-api/imports/modules/server/doichain/get_address.js                               //
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
// packages/doichain_doichain-meteor-api/imports/modules/server/doichain/get_balance.js                               //
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
// packages/doichain_doichain-meteor-api/imports/modules/server/doichain/get_data-hash.js                             //
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
// packages/doichain_doichain-meteor-api/imports/modules/server/doichain/get_key-pair.js                              //
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
// packages/doichain_doichain-meteor-api/imports/modules/server/doichain/get_private-key_from_wif.js                  //
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
// packages/doichain_doichain-meteor-api/imports/modules/server/doichain/get_publickey_and_address_by_domain.js       //
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
// packages/doichain_doichain-meteor-api/imports/modules/server/doichain/get_signature.js                             //
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
// packages/doichain_doichain-meteor-api/imports/modules/server/doichain/insert.js                                    //
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
// packages/doichain_doichain-meteor-api/imports/modules/server/doichain/update.js                                    //
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
// packages/doichain_doichain-meteor-api/imports/modules/server/doichain/verify_signature.js                          //
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
// packages/doichain_doichain-meteor-api/imports/modules/server/doichain/write_to_blockchain.js                       //
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
// packages/doichain_doichain-meteor-api/imports/modules/server/emails/decode_doi-hash.js                             //
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
// packages/doichain_doichain-meteor-api/imports/modules/server/emails/generate_doi-hash.js                           //
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
// packages/doichain_doichain-meteor-api/imports/modules/server/emails/parse_template.js                              //
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
// packages/doichain_doichain-meteor-api/imports/modules/server/emails/send.js                                        //
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
// packages/doichain_doichain-meteor-api/imports/modules/server/jobs/add_check_new_transactions.js                    //
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
// packages/doichain_doichain-meteor-api/imports/modules/server/jobs/add_fetch-doi-mail-data.js                       //
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
// packages/doichain_doichain-meteor-api/imports/modules/server/jobs/add_insert_blockchain.js                         //
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
// packages/doichain_doichain-meteor-api/imports/modules/server/jobs/add_send_mail.js                                 //
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
// packages/doichain_doichain-meteor-api/imports/modules/server/jobs/add_update_blockchain.js                         //
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
// packages/doichain_doichain-meteor-api/imports/modules/server/languages/get.js                                      //
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
// packages/doichain_doichain-meteor-api/imports/modules/server/meta/addOrUpdate.js                                   //
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
// packages/doichain_doichain-meteor-api/imports/modules/server/opt-ins/add.js                                        //
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
// packages/doichain_doichain-meteor-api/imports/modules/server/opt-ins/add_and_write_to_blockchain.js                //
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
// packages/doichain_doichain-meteor-api/imports/modules/server/opt-ins/confirm.js                                    //
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
// packages/doichain_doichain-meteor-api/imports/modules/server/opt-ins/generate_doi-token.js                         //
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
// packages/doichain_doichain-meteor-api/imports/modules/server/opt-ins/update_status.js                              //
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
// packages/doichain_doichain-meteor-api/imports/modules/server/opt-ins/verify.js                                     //
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
// packages/doichain_doichain-meteor-api/imports/modules/server/recipients/add.js                                     //
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
// packages/doichain_doichain-meteor-api/imports/modules/server/senders/add.js                                        //
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
// packages/doichain_doichain-meteor-api/imports/startup/server/dapp-configuration.js                                 //
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
// packages/doichain_doichain-meteor-api/imports/startup/server/dns-configuration.js                                  //
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
// packages/doichain_doichain-meteor-api/imports/startup/server/doichain-configuration.js                             //
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
// packages/doichain_doichain-meteor-api/imports/startup/server/email-configuration.js                                //
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
// packages/doichain_doichain-meteor-api/imports/startup/server/fixtures.js                                           //
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
  let version = Assets.getText("private/version.json");

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
// packages/doichain_doichain-meteor-api/imports/startup/server/index.js                                              //
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
// packages/doichain_doichain-meteor-api/imports/startup/server/jobs.js                                               //
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
// packages/doichain_doichain-meteor-api/imports/startup/server/log-configuration.js                                  //
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
// packages/doichain_doichain-meteor-api/imports/startup/server/register-api.js                                       //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.link("../../api/languages/methods");
module.link("../../api/doichain/methods");
module.link("../../api/recipients/server/publications");
module.link("../../api/opt-ins/methods");
module.link("../../api/meta/meta");
module.link("../../api/opt-ins/server/publications");
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"security.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/doichain_doichain-meteor-api/imports/startup/server/security.js                                           //
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
// packages/doichain_doichain-meteor-api/imports/startup/server/type-configuration.js                                 //
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
// packages/doichain_doichain-meteor-api/imports/startup/server/useraccounts-configuration.js                         //
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

}}}},"server":{"main.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/doichain_doichain-meteor-api/server/main.js                                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.link("../imports/startup/server");
module.link("./api/index.js");
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"api":{"blockchain_jobs.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/doichain_doichain-meteor-api/server/api/blockchain_jobs.js                                                //
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
// packages/doichain_doichain-meteor-api/server/api/dapp_jobs.js                                                      //
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
// packages/doichain_doichain-meteor-api/server/api/dns.js                                                            //
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
// packages/doichain_doichain-meteor-api/server/api/doichain.js                                                       //
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
// packages/doichain_doichain-meteor-api/server/api/http.js                                                           //
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
// packages/doichain_doichain-meteor-api/server/api/index.js                                                          //
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
// packages/doichain_doichain-meteor-api/server/api/mail_jobs.js                                                      //
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

},"rest":{"rest.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/doichain_doichain-meteor-api/server/api/rest/rest.js                                                      //
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

},"imports":{"confirm.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/doichain_doichain-meteor-api/server/api/rest/imports/confirm.js                                           //
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
// packages/doichain_doichain-meteor-api/server/api/rest/imports/debug.js                                             //
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
// packages/doichain_doichain-meteor-api/server/api/rest/imports/send.js                                              //
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
// packages/doichain_doichain-meteor-api/server/api/rest/imports/status.js                                            //
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
// packages/doichain_doichain-meteor-api/server/api/rest/imports/user.js                                              //
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
// packages/doichain_doichain-meteor-api/server/api/rest/imports/verify.js                                            //
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

}}}}},"node_modules":{"scribe-js":{"package.json":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/doichain_doichain-meteor-api/node_modules/scribe-js/package.json                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.exports = {
  "name": "scribe-js",
  "version": "2.0.4",
  "main": "scribe.js"
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"scribe.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/doichain_doichain-meteor-api/node_modules/scribe-js/scribe.js                                  //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.useNode();
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"namecoin":{"package.json":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/doichain_doichain-meteor-api/node_modules/namecoin/package.json                                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.exports = {
  "name": "namecoin",
  "version": "0.1.4",
  "main": "lib/index.js"
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"lib":{"index.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/doichain_doichain-meteor-api/node_modules/namecoin/lib/index.js                                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.useNode();
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},"simpl-schema":{"package.json":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/doichain_doichain-meteor-api/node_modules/simpl-schema/package.json                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.exports = {
  "name": "simpl-schema",
  "version": "1.5.3",
  "main": "./dist/main.js"
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"dist":{"main.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/doichain_doichain-meteor-api/node_modules/simpl-schema/dist/main.js                            //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.useNode();
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},"secp256k1":{"package.json":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/doichain_doichain-meteor-api/node_modules/secp256k1/package.json                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.exports = {
  "name": "secp256k1",
  "version": "3.5.0",
  "main": "./index.js"
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"index.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/doichain_doichain-meteor-api/node_modules/secp256k1/index.js                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.useNode();
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"bitcore-lib":{"package.json":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/doichain_doichain-meteor-api/node_modules/bitcore-lib/package.json                             //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.exports = {
  "name": "bitcore-lib",
  "version": "0.13.19",
  "main": "index.js"
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"index.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/doichain_doichain-meteor-api/node_modules/bitcore-lib/index.js                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.useNode();
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"bitcore-message":{"package.json":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/doichain_doichain-meteor-api/node_modules/bitcore-message/package.json                         //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.exports = {
  "name": "bitcore-message",
  "version": "1.0.4",
  "main": "index.js"
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"index.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/doichain_doichain-meteor-api/node_modules/bitcore-message/index.js                             //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.useNode();
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"crypto-js":{"package.json":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/doichain_doichain-meteor-api/node_modules/crypto-js/package.json                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.exports = {
  "name": "crypto-js",
  "version": "3.1.9-1",
  "main": "index.js"
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"index.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/doichain_doichain-meteor-api/node_modules/crypto-js/index.js                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.useNode();
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"standard-ecies":{"package.json":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/doichain_doichain-meteor-api/node_modules/standard-ecies/package.json                          //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.exports = {
  "name": "standard-ecies",
  "version": "1.0.0",
  "main": "main.js"
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"main.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/doichain_doichain-meteor-api/node_modules/standard-ecies/main.js                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.useNode();
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"bs58":{"package.json":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/doichain_doichain-meteor-api/node_modules/bs58/package.json                                    //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.exports = {
  "name": "bs58",
  "version": "4.0.1",
  "main": "./index.js"
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"index.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/doichain_doichain-meteor-api/node_modules/bs58/index.js                                        //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.useNode();
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"@babel":{"runtime":{"helpers":{"interopRequireDefault.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/doichain_doichain-meteor-api/node_modules/@babel/runtime/helpers/interopRequireDefault.js      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.useNode();
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"objectSpread.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/doichain_doichain-meteor-api/node_modules/@babel/runtime/helpers/objectSpread.js               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.useNode();
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}},"hashids":{"package.json":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/doichain_doichain-meteor-api/node_modules/hashids/package.json                                 //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.exports = {
  "name": "hashids",
  "version": "1.2.2",
  "main": "dist/hashids"
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"dist":{"hashids.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// node_modules/meteor/doichain_doichain-meteor-api/node_modules/hashids/dist/hashids.js                              //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
module.useNode();
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}}}},{
  "extensions": [
    ".js",
    ".json",
    ".i18n.json"
  ]
});

var exports = require("/node_modules/meteor/doichain:doichain-meteor-api/doichain-server-api.js");

/* Exports */
Package._define("doichain:doichain-meteor-api", exports);

})();

//# sourceURL=meteor://💻app/packages/doichain_doichain-meteor-api.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvZG9pY2hhaW46ZG9pY2hhaW4tbWV0ZW9yLWFwaS9kb2ljaGFpbi1zZXJ2ZXItYXBpLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9kb2ljaGFpbjpkb2ljaGFpbi1tZXRlb3ItYXBpL2ltcG9ydHMvYXBpL2RvaWNoYWluL2VudHJpZXMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2RvaWNoYWluOmRvaWNoYWluLW1ldGVvci1hcGkvaW1wb3J0cy9hcGkvZG9pY2hhaW4vbWV0aG9kcy5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvZG9pY2hhaW46ZG9pY2hhaW4tbWV0ZW9yLWFwaS9pbXBvcnRzL2FwaS9sYW5ndWFnZXMvbWV0aG9kcy5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvZG9pY2hhaW46ZG9pY2hhaW4tbWV0ZW9yLWFwaS9pbXBvcnRzL2FwaS9tZXRhL21ldGEuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2RvaWNoYWluOmRvaWNoYWluLW1ldGVvci1hcGkvaW1wb3J0cy9hcGkvb3B0LWlucy9tZXRob2RzLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9kb2ljaGFpbjpkb2ljaGFpbi1tZXRlb3ItYXBpL2ltcG9ydHMvYXBpL29wdC1pbnMvb3B0LWlucy5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvZG9pY2hhaW46ZG9pY2hhaW4tbWV0ZW9yLWFwaS9pbXBvcnRzL2FwaS9vcHQtaW5zL3NlcnZlci9wdWJsaWNhdGlvbnMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2RvaWNoYWluOmRvaWNoYWluLW1ldGVvci1hcGkvaW1wb3J0cy9hcGkvcmVjaXBpZW50cy9yZWNpcGllbnRzLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9kb2ljaGFpbjpkb2ljaGFpbi1tZXRlb3ItYXBpL2ltcG9ydHMvYXBpL3JlY2lwaWVudHMvc2VydmVyL3B1YmxpY2F0aW9ucy5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvZG9pY2hhaW46ZG9pY2hhaW4tbWV0ZW9yLWFwaS9pbXBvcnRzL2FwaS9zZW5kZXJzL3NlbmRlcnMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2RvaWNoYWluOmRvaWNoYWluLW1ldGVvci1hcGkvaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9kYXBwcy9leHBvcnRfZG9pcy5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvZG9pY2hhaW46ZG9pY2hhaW4tbWV0ZW9yLWFwaS9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2RhcHBzL2ZldGNoX2RvaS1tYWlsLWRhdGEuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2RvaWNoYWluOmRvaWNoYWluLW1ldGVvci1hcGkvaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9kYXBwcy9nZXRfZG9pLW1haWwtZGF0YS5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvZG9pY2hhaW46ZG9pY2hhaW4tbWV0ZW9yLWFwaS9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2Rucy9nZXRfb3B0LWluLWtleS5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvZG9pY2hhaW46ZG9pY2hhaW4tbWV0ZW9yLWFwaS9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2Rucy9nZXRfb3B0LWluLXByb3ZpZGVyLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9kb2ljaGFpbjpkb2ljaGFpbi1tZXRlb3ItYXBpL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvZG9pY2hhaW4vYWRkX2VudHJ5X2FuZF9mZXRjaF9kYXRhLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9kb2ljaGFpbjpkb2ljaGFpbi1tZXRlb3ItYXBpL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvZG9pY2hhaW4vY2hlY2tfbmV3X3RyYW5zYWN0aW9ucy5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvZG9pY2hhaW46ZG9pY2hhaW4tbWV0ZW9yLWFwaS9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2RvaWNoYWluL2RlY3J5cHRfbWVzc2FnZS5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvZG9pY2hhaW46ZG9pY2hhaW4tbWV0ZW9yLWFwaS9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2RvaWNoYWluL2VuY3J5cHRfbWVzc2FnZS5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvZG9pY2hhaW46ZG9pY2hhaW4tbWV0ZW9yLWFwaS9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2RvaWNoYWluL2dlbmVyYXRlX25hbWUtaWQuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2RvaWNoYWluOmRvaWNoYWluLW1ldGVvci1hcGkvaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9kb2ljaGFpbi9nZXRfYWRkcmVzcy5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvZG9pY2hhaW46ZG9pY2hhaW4tbWV0ZW9yLWFwaS9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2RvaWNoYWluL2dldF9iYWxhbmNlLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9kb2ljaGFpbjpkb2ljaGFpbi1tZXRlb3ItYXBpL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvZG9pY2hhaW4vZ2V0X2RhdGEtaGFzaC5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvZG9pY2hhaW46ZG9pY2hhaW4tbWV0ZW9yLWFwaS9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2RvaWNoYWluL2dldF9rZXktcGFpci5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvZG9pY2hhaW46ZG9pY2hhaW4tbWV0ZW9yLWFwaS9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2RvaWNoYWluL2dldF9wcml2YXRlLWtleV9mcm9tX3dpZi5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvZG9pY2hhaW46ZG9pY2hhaW4tbWV0ZW9yLWFwaS9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2RvaWNoYWluL2dldF9wdWJsaWNrZXlfYW5kX2FkZHJlc3NfYnlfZG9tYWluLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9kb2ljaGFpbjpkb2ljaGFpbi1tZXRlb3ItYXBpL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvZG9pY2hhaW4vZ2V0X3NpZ25hdHVyZS5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvZG9pY2hhaW46ZG9pY2hhaW4tbWV0ZW9yLWFwaS9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2RvaWNoYWluL2luc2VydC5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvZG9pY2hhaW46ZG9pY2hhaW4tbWV0ZW9yLWFwaS9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2RvaWNoYWluL3VwZGF0ZS5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvZG9pY2hhaW46ZG9pY2hhaW4tbWV0ZW9yLWFwaS9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2RvaWNoYWluL3ZlcmlmeV9zaWduYXR1cmUuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2RvaWNoYWluOmRvaWNoYWluLW1ldGVvci1hcGkvaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9kb2ljaGFpbi93cml0ZV90b19ibG9ja2NoYWluLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9kb2ljaGFpbjpkb2ljaGFpbi1tZXRlb3ItYXBpL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvZW1haWxzL2RlY29kZV9kb2ktaGFzaC5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvZG9pY2hhaW46ZG9pY2hhaW4tbWV0ZW9yLWFwaS9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2VtYWlscy9nZW5lcmF0ZV9kb2ktaGFzaC5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvZG9pY2hhaW46ZG9pY2hhaW4tbWV0ZW9yLWFwaS9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2VtYWlscy9wYXJzZV90ZW1wbGF0ZS5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvZG9pY2hhaW46ZG9pY2hhaW4tbWV0ZW9yLWFwaS9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2VtYWlscy9zZW5kLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9kb2ljaGFpbjpkb2ljaGFpbi1tZXRlb3ItYXBpL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvam9icy9hZGRfY2hlY2tfbmV3X3RyYW5zYWN0aW9ucy5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvZG9pY2hhaW46ZG9pY2hhaW4tbWV0ZW9yLWFwaS9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2pvYnMvYWRkX2ZldGNoLWRvaS1tYWlsLWRhdGEuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2RvaWNoYWluOmRvaWNoYWluLW1ldGVvci1hcGkvaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9qb2JzL2FkZF9pbnNlcnRfYmxvY2tjaGFpbi5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvZG9pY2hhaW46ZG9pY2hhaW4tbWV0ZW9yLWFwaS9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2pvYnMvYWRkX3NlbmRfbWFpbC5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvZG9pY2hhaW46ZG9pY2hhaW4tbWV0ZW9yLWFwaS9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2pvYnMvYWRkX3VwZGF0ZV9ibG9ja2NoYWluLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9kb2ljaGFpbjpkb2ljaGFpbi1tZXRlb3ItYXBpL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvbGFuZ3VhZ2VzL2dldC5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvZG9pY2hhaW46ZG9pY2hhaW4tbWV0ZW9yLWFwaS9pbXBvcnRzL21vZHVsZXMvc2VydmVyL21ldGEvYWRkT3JVcGRhdGUuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2RvaWNoYWluOmRvaWNoYWluLW1ldGVvci1hcGkvaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9vcHQtaW5zL2FkZC5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvZG9pY2hhaW46ZG9pY2hhaW4tbWV0ZW9yLWFwaS9pbXBvcnRzL21vZHVsZXMvc2VydmVyL29wdC1pbnMvYWRkX2FuZF93cml0ZV90b19ibG9ja2NoYWluLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9kb2ljaGFpbjpkb2ljaGFpbi1tZXRlb3ItYXBpL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvb3B0LWlucy9jb25maXJtLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9kb2ljaGFpbjpkb2ljaGFpbi1tZXRlb3ItYXBpL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvb3B0LWlucy9nZW5lcmF0ZV9kb2ktdG9rZW4uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2RvaWNoYWluOmRvaWNoYWluLW1ldGVvci1hcGkvaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9vcHQtaW5zL3VwZGF0ZV9zdGF0dXMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2RvaWNoYWluOmRvaWNoYWluLW1ldGVvci1hcGkvaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9vcHQtaW5zL3ZlcmlmeS5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvZG9pY2hhaW46ZG9pY2hhaW4tbWV0ZW9yLWFwaS9pbXBvcnRzL21vZHVsZXMvc2VydmVyL3JlY2lwaWVudHMvYWRkLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9kb2ljaGFpbjpkb2ljaGFpbi1tZXRlb3ItYXBpL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvc2VuZGVycy9hZGQuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2RvaWNoYWluOmRvaWNoYWluLW1ldGVvci1hcGkvaW1wb3J0cy9zdGFydHVwL3NlcnZlci9kYXBwLWNvbmZpZ3VyYXRpb24uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2RvaWNoYWluOmRvaWNoYWluLW1ldGVvci1hcGkvaW1wb3J0cy9zdGFydHVwL3NlcnZlci9kbnMtY29uZmlndXJhdGlvbi5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvZG9pY2hhaW46ZG9pY2hhaW4tbWV0ZW9yLWFwaS9pbXBvcnRzL3N0YXJ0dXAvc2VydmVyL2RvaWNoYWluLWNvbmZpZ3VyYXRpb24uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2RvaWNoYWluOmRvaWNoYWluLW1ldGVvci1hcGkvaW1wb3J0cy9zdGFydHVwL3NlcnZlci9lbWFpbC1jb25maWd1cmF0aW9uLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9kb2ljaGFpbjpkb2ljaGFpbi1tZXRlb3ItYXBpL2ltcG9ydHMvc3RhcnR1cC9zZXJ2ZXIvZml4dHVyZXMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2RvaWNoYWluOmRvaWNoYWluLW1ldGVvci1hcGkvaW1wb3J0cy9zdGFydHVwL3NlcnZlci9pbmRleC5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvZG9pY2hhaW46ZG9pY2hhaW4tbWV0ZW9yLWFwaS9pbXBvcnRzL3N0YXJ0dXAvc2VydmVyL2pvYnMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2RvaWNoYWluOmRvaWNoYWluLW1ldGVvci1hcGkvaW1wb3J0cy9zdGFydHVwL3NlcnZlci9sb2ctY29uZmlndXJhdGlvbi5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvZG9pY2hhaW46ZG9pY2hhaW4tbWV0ZW9yLWFwaS9pbXBvcnRzL3N0YXJ0dXAvc2VydmVyL3JlZ2lzdGVyLWFwaS5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvZG9pY2hhaW46ZG9pY2hhaW4tbWV0ZW9yLWFwaS9pbXBvcnRzL3N0YXJ0dXAvc2VydmVyL3NlY3VyaXR5LmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9kb2ljaGFpbjpkb2ljaGFpbi1tZXRlb3ItYXBpL2ltcG9ydHMvc3RhcnR1cC9zZXJ2ZXIvdHlwZS1jb25maWd1cmF0aW9uLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9kb2ljaGFpbjpkb2ljaGFpbi1tZXRlb3ItYXBpL2ltcG9ydHMvc3RhcnR1cC9zZXJ2ZXIvdXNlcmFjY291bnRzLWNvbmZpZ3VyYXRpb24uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2RvaWNoYWluOmRvaWNoYWluLW1ldGVvci1hcGkvc2VydmVyL21haW4uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2RvaWNoYWluOmRvaWNoYWluLW1ldGVvci1hcGkvc2VydmVyL2FwaS9ibG9ja2NoYWluX2pvYnMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2RvaWNoYWluOmRvaWNoYWluLW1ldGVvci1hcGkvc2VydmVyL2FwaS9kYXBwX2pvYnMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2RvaWNoYWluOmRvaWNoYWluLW1ldGVvci1hcGkvc2VydmVyL2FwaS9kbnMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2RvaWNoYWluOmRvaWNoYWluLW1ldGVvci1hcGkvc2VydmVyL2FwaS9kb2ljaGFpbi5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvZG9pY2hhaW46ZG9pY2hhaW4tbWV0ZW9yLWFwaS9zZXJ2ZXIvYXBpL2h0dHAuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2RvaWNoYWluOmRvaWNoYWluLW1ldGVvci1hcGkvc2VydmVyL2FwaS9pbmRleC5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvZG9pY2hhaW46ZG9pY2hhaW4tbWV0ZW9yLWFwaS9zZXJ2ZXIvYXBpL21haWxfam9icy5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvZG9pY2hhaW46ZG9pY2hhaW4tbWV0ZW9yLWFwaS9zZXJ2ZXIvYXBpL3Jlc3QvcmVzdC5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvZG9pY2hhaW46ZG9pY2hhaW4tbWV0ZW9yLWFwaS9zZXJ2ZXIvYXBpL3Jlc3QvaW1wb3J0cy9jb25maXJtLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9kb2ljaGFpbjpkb2ljaGFpbi1tZXRlb3ItYXBpL3NlcnZlci9hcGkvcmVzdC9pbXBvcnRzL2RlYnVnLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9kb2ljaGFpbjpkb2ljaGFpbi1tZXRlb3ItYXBpL3NlcnZlci9hcGkvcmVzdC9pbXBvcnRzL3NlbmQuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2RvaWNoYWluOmRvaWNoYWluLW1ldGVvci1hcGkvc2VydmVyL2FwaS9yZXN0L2ltcG9ydHMvc3RhdHVzLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9kb2ljaGFpbjpkb2ljaGFpbi1tZXRlb3ItYXBpL3NlcnZlci9hcGkvcmVzdC9pbXBvcnRzL3VzZXIuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2RvaWNoYWluOmRvaWNoYWluLW1ldGVvci1hcGkvc2VydmVyL2FwaS9yZXN0L2ltcG9ydHMvdmVyaWZ5LmpzIl0sIm5hbWVzIjpbIm1vZHVsZSIsImV4cG9ydCIsIm5hbWUiLCJPcHRJbnNDb2xsZWN0aW9uIiwiUmVjaXBpZW50c0NvbGxlY3Rpb24iLCJodHRwR0VUIiwiaHR0cEdFVGRhdGEiLCJodHRwUE9TVCIsInRlc3RMb2ciLCJ0ZXN0dmFyMSIsImxpbmsiLCJPcHRJbnMiLCJ2IiwiUmVjaXBpZW50cyIsImdldEh0dHBHRVQiLCJnZXRIdHRwR0VUZGF0YSIsImdldEh0dHBQT1NUIiwidGVzdExvZ2dpbmciLCJEb2ljaGFpbkVudHJpZXMiLCJNb25nbyIsIlNpbXBsZVNjaGVtYSIsImRlZmF1bHQiLCJEb2ljaGFpbkVudHJpZXNDb2xsZWN0aW9uIiwiQ29sbGVjdGlvbiIsImluc2VydCIsImVudHJ5IiwiY2FsbGJhY2siLCJyZXN1bHQiLCJ1cGRhdGUiLCJzZWxlY3RvciIsIm1vZGlmaWVyIiwicmVtb3ZlIiwiZGVueSIsInNjaGVtYSIsIl9pZCIsInR5cGUiLCJTdHJpbmciLCJyZWdFeCIsIlJlZ0V4IiwiSWQiLCJ2YWx1ZSIsImFkZHJlc3MiLCJtYXN0ZXJEb2kiLCJvcHRpb25hbCIsImluZGV4IiwiSW50ZWdlciIsInR4SWQiLCJhdHRhY2hTY2hlbWEiLCJwdWJsaWNGaWVsZHMiLCJWYWxpZGF0ZWRNZXRob2QiLCJNZXRlb3IiLCJERFBSYXRlTGltaXRlciIsImdldEtleVBhaXJNIiwiZ2V0QmFsYW5jZU0iLCJnZXRLZXlQYWlyIiwidmFsaWRhdGUiLCJydW4iLCJnZXRCYWxhbmNlIiwibG9nVmFsIiwiT1BUSU5TX01FVEhPRFMiLCJfIiwicGx1Y2siLCJpc1NlcnZlciIsImFkZFJ1bGUiLCJjb250YWlucyIsImNvbm5lY3Rpb25JZCIsImdldExhbmd1YWdlcyIsImdldEFsbExhbmd1YWdlcyIsIk1ldGEiLCJNZXRhQ29sbGVjdGlvbiIsImRhdGEiLCJvdXJEYXRhIiwia2V5IiwiaTE4biIsIl9pMThuIiwiUm9sZXMiLCJhZGRPcHRJbiIsImFkZCIsInJlY2lwaWVudE1haWwiLCJzZW5kZXJNYWlsIiwidXNlcklkIiwidXNlcklzSW5Sb2xlIiwiZXJyb3IiLCJFcnJvciIsIl9fIiwib3B0SW4iLCJPUFRJT05TX01FVEhPRFMiLCJvdXJPcHRJbiIsInJlY2lwaWVudF9zZW5kZXIiLCJyZWNpcGllbnQiLCJzZW5kZXIiLCJjcmVhdGVkQXQiLCJEYXRlIiwibmFtZUlkIiwiY29uZmlybWVkQXQiLCJjb25maXJtZWRCeSIsIklQIiwiY29uZmlybWF0aW9uVG9rZW4iLCJvd25lcklkIiwicHVibGlzaCIsIk9wdEluc0FsbCIsInJlYWR5IiwiZmluZCIsImZpZWxkcyIsIm91clJlY2lwaWVudCIsImVtYWlsIiwicHJpdmF0ZUtleSIsInB1YmxpY0tleSIsInJlY2lwaWVudEdldCIsInBpcGVsaW5lIiwicHVzaCIsIiRyZWRhY3QiLCIkY29uZCIsImlmIiwiJGNtcCIsInRoZW4iLCJlbHNlIiwiJGxvb2t1cCIsImZyb20iLCJsb2NhbEZpZWxkIiwiZm9yZWlnbkZpZWxkIiwiYXMiLCIkdW53aW5kIiwiJHByb2plY3QiLCJhZ2dyZWdhdGUiLCJySWRzIiwiZm9yRWFjaCIsImVsZW1lbnQiLCJSZWNpcGllbnRFbWFpbCIsInJlY2lwaWVudHNBbGwiLCJTZW5kZXJzIiwiU2VuZGVyc0NvbGxlY3Rpb24iLCJvdXJTZW5kZXIiLCJET0lfTUFJTF9GRVRDSF9VUkwiLCJsb2dTZW5kIiwiRXhwb3J0RG9pc0RhdGFTY2hlbWEiLCJzdGF0dXMiLCJyb2xlIiwidXNlcmlkIiwiaWQiLCJleHBvcnREb2lzIiwiJG1hdGNoIiwiJGV4aXN0cyIsIiRuZSIsInVuZGVmaW5lZCIsImNvbmNhdCIsIm9wdElucyIsImV4cG9ydERvaURhdGEiLCJKU09OIiwic3RyaW5naWZ5IiwiZXhjZXB0aW9uIiwiZXhwb3J0RGVmYXVsdCIsIkRPSV9GRVRDSF9ST1VURSIsIkRPSV9DT05GSVJNQVRJT05fUk9VVEUiLCJBUElfUEFUSCIsIlZFUlNJT04iLCJnZXRVcmwiLCJDT05GSVJNX0NMSUVOVCIsIkNPTkZJUk1fQUREUkVTUyIsInNpZ25NZXNzYWdlIiwicGFyc2VUZW1wbGF0ZSIsImdlbmVyYXRlRG9pVG9rZW4iLCJnZW5lcmF0ZURvaUhhc2giLCJhZGRTZW5kTWFpbEpvYiIsImxvZ0NvbmZpcm0iLCJsb2dFcnJvciIsIkZldGNoRG9pTWFpbERhdGFTY2hlbWEiLCJkb21haW4iLCJmZXRjaERvaU1haWxEYXRhIiwidXJsIiwic2lnbmF0dXJlIiwicXVlcnkiLCJlbmNvZGVVUklDb21wb25lbnQiLCJyZXNwb25zZSIsInJlc3BvbnNlRGF0YSIsImluY2x1ZGVzIiwib3B0SW5JZCIsImZpbmRPbmUiLCJ0b2tlbiIsImNvbmZpcm1hdGlvbkhhc2giLCJyZWRpcmVjdCIsImNvbmZpcm1hdGlvblVybCIsInRlbXBsYXRlIiwiY29udGVudCIsImNvbmZpcm1hdGlvbl91cmwiLCJ0byIsInN1YmplY3QiLCJtZXNzYWdlIiwicmV0dXJuUGF0aCIsImdldE9wdEluUHJvdmlkZXIiLCJnZXRPcHRJbktleSIsInZlcmlmeVNpZ25hdHVyZSIsIkFjY291bnRzIiwiR2V0RG9pTWFpbERhdGFTY2hlbWEiLCJuYW1lX2lkIiwidXNlclByb2ZpbGVTY2hlbWEiLCJFbWFpbCIsInRlbXBsYXRlVVJMIiwiZ2V0RG9pTWFpbERhdGEiLCJwYXJ0cyIsInNwbGl0IiwibGVuZ3RoIiwicHJvdmlkZXIiLCJkb2lNYWlsRGF0YSIsImRlZmF1bHRSZXR1cm5EYXRhIiwicmV0dXJuRGF0YSIsIm93bmVyIiwidXNlcnMiLCJtYWlsVGVtcGxhdGUiLCJwcm9maWxlIiwicmVzb2x2ZVR4dCIsIkZBTExCQUNLX1BST1ZJREVSIiwiaXNSZWd0ZXN0IiwiaXNUZXN0bmV0IiwiT1BUX0lOX0tFWSIsIk9QVF9JTl9LRVlfVEVTVE5FVCIsIkdldE9wdEluS2V5U2NoZW1hIiwib3VyT1BUX0lOX0tFWSIsImZvdW5kS2V5IiwiZG5za2V5IiwidXNlRmFsbGJhY2siLCJQUk9WSURFUl9LRVkiLCJQUk9WSURFUl9LRVlfVEVTVE5FVCIsIkdldE9wdEluUHJvdmlkZXJTY2hlbWEiLCJvdXJQUk9WSURFUl9LRVkiLCJwcm92aWRlcktleSIsImdldFdpZiIsImFkZEZldGNoRG9pTWFpbERhdGFKb2IiLCJnZXRQcml2YXRlS2V5RnJvbVdpZiIsImRlY3J5cHRNZXNzYWdlIiwiQWRkRG9pY2hhaW5FbnRyeVNjaGVtYSIsImFkZERvaWNoYWluRW50cnkiLCJvdXJFbnRyeSIsImV0eSIsInBhcnNlIiwid2lmIiwibmFtZVBvcyIsImluZGV4T2YiLCJzdWJzdHJpbmciLCJleHBpcmVzSW4iLCJleHBpcmVkIiwibGlzdFNpbmNlQmxvY2siLCJuYW1lU2hvdyIsImdldFJhd1RyYW5zYWN0aW9uIiwiYWRkT3JVcGRhdGVNZXRhIiwiVFhfTkFNRV9TVEFSVCIsIkxBU1RfQ0hFQ0tFRF9CTE9DS19LRVkiLCJjaGVja05ld1RyYW5zYWN0aW9uIiwidHhpZCIsImpvYiIsImxhc3RDaGVja2VkQmxvY2siLCJyZXQiLCJ0cmFuc2FjdGlvbnMiLCJ0eHMiLCJsYXN0YmxvY2siLCJhZGRyZXNzVHhzIiwiZmlsdGVyIiwidHgiLCJzdGFydHNXaXRoIiwidHhOYW1lIiwiYWRkVHgiLCJkb25lIiwidm91dCIsInNjcmlwdFB1YktleSIsIm5hbWVPcCIsIm9wIiwiYWRkcmVzc2VzIiwiY3J5cHRvIiwiZWNpZXMiLCJEZWNyeXB0TWVzc2FnZVNjaGVtYSIsIkJ1ZmZlciIsImVjZGgiLCJjcmVhdGVFQ0RIIiwic2V0UHJpdmF0ZUtleSIsImRlY3J5cHQiLCJ0b1N0cmluZyIsIkVuY3J5cHRNZXNzYWdlU2NoZW1hIiwiZW5jcnlwdE1lc3NhZ2UiLCJlbmNyeXB0IiwiR2VuZXJhdGVOYW1lSWRTY2hlbWEiLCJnZW5lcmF0ZU5hbWVJZCIsIiRzZXQiLCJDcnlwdG9KUyIsIkJhc2U1OCIsIlZFUlNJT05fQllURSIsIlZFUlNJT05fQllURV9SRUdURVNUIiwiR2V0QWRkcmVzc1NjaGVtYSIsImdldEFkZHJlc3MiLCJfZ2V0QWRkcmVzcyIsInB1YktleSIsImxpYiIsIldvcmRBcnJheSIsImNyZWF0ZSIsIlNIQTI1NiIsIlJJUEVNRDE2MCIsInZlcnNpb25CeXRlIiwiY2hlY2tzdW0iLCJlbmNvZGUiLCJnZXRfQmFsYW5jZSIsImJhbCIsIkdldERhdGFIYXNoU2NoZW1hIiwiZ2V0RGF0YUhhc2giLCJoYXNoIiwicmFuZG9tQnl0ZXMiLCJzZWNwMjU2azEiLCJwcml2S2V5IiwicHJpdmF0ZUtleVZlcmlmeSIsInB1YmxpY0tleUNyZWF0ZSIsInRvVXBwZXJDYXNlIiwiR2V0UHJpdmF0ZUtleUZyb21XaWZTY2hlbWEiLCJfZ2V0UHJpdmF0ZUtleUZyb21XaWYiLCJkZWNvZGUiLCJlbmRzV2l0aCIsIkdldFB1YmxpY0tleVNjaGVtYSIsImdldFB1YmxpY0tleUFuZEFkZHJlc3MiLCJkZXN0QWRkcmVzcyIsImJpdGNvcmUiLCJNZXNzYWdlIiwiR2V0U2lnbmF0dXJlU2NoZW1hIiwiZ2V0U2lnbmF0dXJlIiwic2lnbiIsIlByaXZhdGVLZXkiLCJTRU5EX0NMSUVOVCIsImxvZ0Jsb2NrY2hhaW4iLCJmZWVEb2kiLCJuYW1lRG9pIiwiSW5zZXJ0U2NoZW1hIiwiZGF0YUhhc2giLCJzb2lEYXRlIiwicHVibGljS2V5QW5kQWRkcmVzcyIsIm5hbWVWYWx1ZSIsImZlZURvaVR4IiwibmFtZURvaVR4IiwiZ2V0VHJhbnNhY3Rpb24iLCJET0lfQ09ORklSTUFUSU9OX05PVElGWV9ST1VURSIsImdldEh0dHBQVVQiLCJVcGRhdGVTY2hlbWEiLCJob3N0IiwiZnJvbUhvc3RVcmwiLCJuYW1lX2RhdGEiLCJyZXJ1biIsIm91cl90cmFuc2FjdGlvbiIsImNvbmZpcm1hdGlvbnMiLCJvdXJmcm9tSG9zdFVybCIsInVwZGF0ZURhdGEiLCJjYW5jZWwiLCJyZXN0YXJ0IiwiZXJyIiwibG9nVmVyaWZ5IiwiTkVUV09SSyIsIk5ldHdvcmtzIiwiYWxpYXMiLCJwdWJrZXloYXNoIiwicHJpdmF0ZWtleSIsInNjcmlwdGhhc2giLCJuZXR3b3JrTWFnaWMiLCJWZXJpZnlTaWduYXR1cmVTY2hlbWEiLCJBZGRyZXNzIiwiZnJvbVB1YmxpY0tleSIsIlB1YmxpY0tleSIsInZlcmlmeSIsImFkZEluc2VydEJsb2NrY2hhaW5Kb2IiLCJXcml0ZVRvQmxvY2tjaGFpblNjaGVtYSIsIndyaXRlVG9CbG9ja2NoYWluIiwiSGFzaElkcyIsIkRlY29kZURvaUhhc2hTY2hlbWEiLCJkZWNvZGVEb2lIYXNoIiwib3VySGFzaCIsImhleCIsImRlY29kZUhleCIsIm9iaiIsIkdlbmVyYXRlRG9pSGFzaFNjaGVtYSIsImpzb24iLCJlbmNvZGVIZXgiLCJQTEFDRUhPTERFUl9SRUdFWCIsIlBhcnNlVGVtcGxhdGVTY2hlbWEiLCJPYmplY3QiLCJibGFja2JveCIsIl9tYXRjaCIsImV4ZWMiLCJfcmVwbGFjZVBsYWNlaG9sZGVyIiwicmVwbGFjZSIsInJlcCIsIkRPSV9NQUlMX0RFRkFVTFRfRU1BSUxfRlJPTSIsIlNlbmRNYWlsU2NoZW1hIiwic2VuZE1haWwiLCJtYWlsIiwib3VyTWFpbCIsInNlbmQiLCJodG1sIiwiaGVhZGVycyIsIkpvYiIsIkJsb2NrY2hhaW5Kb2JzIiwiYWRkQ2hlY2tOZXdUcmFuc2FjdGlvbnNCbG9ja2NoYWluSm9iIiwicmV0cnkiLCJyZXRyaWVzIiwid2FpdCIsInNhdmUiLCJjYW5jZWxSZXBlYXRzIiwiREFwcEpvYnMiLCJBZGRGZXRjaERvaU1haWxEYXRhSm9iU2NoZW1hIiwiQWRkSW5zZXJ0QmxvY2tjaGFpbkpvYlNjaGVtYSIsIk1haWxKb2JzIiwiQWRkU2VuZE1haWxKb2JTY2hlbWEiLCJBZGRVcGRhdGVCbG9ja2NoYWluSm9iU2NoZW1hIiwiYWRkVXBkYXRlQmxvY2tjaGFpbkpvYiIsIkFkZE9yVXBkYXRlTWV0YVNjaGVtYSIsIm1ldGEiLCJBZGRPcHRJblNjaGVtYSIsImZldGNoIiwiYWRkUmVjaXBpZW50IiwiYWRkU2VuZGVyIiwicmVjaXBpZW50X21haWwiLCJzZW5kZXJfbWFpbCIsIm1hc3Rlcl9kb2kiLCJyZWNpcGllbnRJZCIsInNlbmRlcklkIiwiQ29uZmlybU9wdEluU2NoZW1hIiwiY29uZmlybU9wdEluIiwicmVxdWVzdCIsIm91clJlcXVlc3QiLCJkZWNvZGVkIiwiJHVuc2V0IiwiZW50cmllcyIsIiRvciIsImRvaVNpZ25hdHVyZSIsImRvaVRpbWVzdGFtcCIsInRvSVNPU3RyaW5nIiwianNvblZhbHVlIiwiR2VuZXJhdGVEb2lUb2tlblNjaGVtYSIsIlVwZGF0ZU9wdEluU3RhdHVzU2NoZW1hIiwidXBkYXRlT3B0SW5TdGF0dXMiLCJWRVJJRllfQ0xJRU5UIiwiVmVyaWZ5T3B0SW5TY2hlbWEiLCJyZWNpcGllbnRfcHVibGljX2tleSIsInZlcmlmeU9wdEluIiwiZW50cnlEYXRhIiwiZmlyc3RDaGVjayIsInNlY29uZENoZWNrIiwiQWRkUmVjaXBpZW50U2NoZW1hIiwicmVjaXBpZW50cyIsImtleVBhaXIiLCJBZGRTZW5kZXJTY2hlbWEiLCJzZW5kZXJzIiwiaXNEZWJ1ZyIsInNldHRpbmdzIiwiYXBwIiwiZGVidWciLCJyZWd0ZXN0IiwidGVzdG5ldCIsInBvcnQiLCJhYnNvbHV0ZVVybCIsIm5hbWVjb2luIiwiU0VORF9BUFAiLCJDT05GSVJNX0FQUCIsIlZFUklGWV9BUFAiLCJpc0FwcFR5cGUiLCJzZW5kU2V0dGluZ3MiLCJzZW5kQ2xpZW50IiwiZG9pY2hhaW4iLCJjcmVhdGVDbGllbnQiLCJjb25maXJtU2V0dGluZ3MiLCJjb25maXJtIiwiY29uZmlybUNsaWVudCIsImNvbmZpcm1BZGRyZXNzIiwidmVyaWZ5U2V0dGluZ3MiLCJ2ZXJpZnlDbGllbnQiLCJDbGllbnQiLCJ1c2VyIiwidXNlcm5hbWUiLCJwYXNzIiwicGFzc3dvcmQiLCJIYXNoaWRzIiwiZG9pTWFpbEZldGNoVXJsIiwiZGVmYXVsdEZyb20iLCJzbXRwIiwic3RhcnR1cCIsInByb2Nlc3MiLCJlbnYiLCJNQUlMX1VSTCIsInNlcnZlciIsIk5PREVfVExTX1JFSkVDVF9VTkFVVEhPUklaRUQiLCJ2ZXJzaW9uIiwiQXNzZXRzIiwiZ2V0VGV4dCIsImNvdW50IiwiY3JlYXRlVXNlciIsImFkZFVzZXJzVG9Sb2xlcyIsInN0YXJ0Sm9iU2VydmVyIiwiY29uc29sZSIsInNlbmRNb2RlVGFnQ29sb3IiLCJjb25maXJtTW9kZVRhZ0NvbG9yIiwidmVyaWZ5TW9kZVRhZ0NvbG9yIiwiYmxvY2tjaGFpbk1vZGVUYWdDb2xvciIsInRlc3RpbmdNb2RlVGFnQ29sb3IiLCJsb2dNYWluIiwicmVxdWlyZSIsIm1zZyIsImNvbG9ycyIsInBhcmFtIiwidGltZSIsInRhZyIsImxvZyIsIkFVVEhfTUVUSE9EUyIsInR5cGVzIiwiY29uZmlnIiwic2VuZFZlcmlmaWNhdGlvbkVtYWlsIiwiZm9yYmlkQ2xpZW50QWNjb3VudENyZWF0aW9uIiwiZW1haWxUZW1wbGF0ZXMiLCJKb2JDb2xsZWN0aW9uIiwicHJvY2Vzc0pvYnMiLCJ3b3JrVGltZW91dCIsImNiIiwiZmFpbCIsInBhdXNlIiwicmVwZWF0Iiwic2NoZWR1bGUiLCJsYXRlciIsInRleHQiLCJxIiwicG9sbEludGVydmFsIiwiY3VycmVudCIsInNldE1pbnV0ZXMiLCJnZXRNaW51dGVzIiwiaWRzIiwiJGluIiwiam9iU3RhdHVzUmVtb3ZhYmxlIiwidXBkYXRlZCIsIiRsdCIsInJlbW92ZUpvYnMiLCJvYnNlcnZlIiwiYWRkZWQiLCJ0cmlnZ2VyIiwiZG5zIiwic3luY0Z1bmMiLCJ3cmFwQXN5bmMiLCJkbnNfcmVzb2x2ZVR4dCIsInJlY29yZHMiLCJyZWNvcmQiLCJ2YWwiLCJ0cmltIiwiZ2V0U2VydmVycyIsImdldEFkZHJlc3Nlc0J5QWNjb3VudCIsImdldE5ld0FkZHJlc3MiLCJnZXRJbmZvIiwiTkFNRVNQQUNFIiwiY2xpZW50IiwiZG9pY2hhaW5fZHVtcHByaXZrZXkiLCJvdXJBZGRyZXNzIiwiY21kIiwiYWNjb3V0IiwiZG9pY2hhaW5fZ2V0YWRkcmVzc2VzYnlhY2NvdW50IiwiYWNjb3VudCIsIm91ckFjY291bnQiLCJkb2ljaGFpbl9nZXRuZXdhZGRyZXNzIiwiZG9pY2hhaW5fc2lnbk1lc3NhZ2UiLCJvdXJNZXNzYWdlIiwiZG9pY2hhaW5fbmFtZVNob3ciLCJvdXJJZCIsImNoZWNrSWQiLCJkb2ljaGFpbl9mZWVEb2kiLCJkb2ljaGFpbl9uYW1lRG9pIiwib3VyTmFtZSIsIm91clZhbHVlIiwiYmxvY2siLCJkb2ljaGFpbl9saXN0U2luY2VCbG9jayIsIm91ckJsb2NrIiwiZG9pY2hhaW5fZ2V0dHJhbnNhY3Rpb24iLCJkb2ljaGFpbl9nZXRyYXd0cmFuc2FjdGlvbiIsImRvaWNoYWluX2dldGJhbGFuY2UiLCJkb2ljaGFpbl9nZXRpbmZvIiwiRE9JX1BSRUZJWCIsInJldF92YWwiLCJIVFRQIiwiX2dldCIsIl9nZXREYXRhIiwiX3Bvc3QiLCJfcHV0Iiwib3VyVXJsIiwib3VyUXVlcnkiLCJnZXQiLCJwb3N0IiwicHV0IiwiRE9JX1dBTExFVE5PVElGWV9ST1VURSIsIkRPSV9FWFBPUlRfUk9VVEUiLCJBcGkiLCJSZXN0aXZ1cyIsImFwaVBhdGgiLCJ1c2VEZWZhdWx0QXV0aCIsInByZXR0eUpzb24iLCJhZGRSb3V0ZSIsImF1dGhSZXF1aXJlZCIsImFjdGlvbiIsInVybFBhcmFtcyIsImlwIiwiY29ubmVjdGlvbiIsInJlbW90ZUFkZHJlc3MiLCJzb2NrZXQiLCJzdGF0dXNDb2RlIiwiYm9keSIsInBhcmFtcyIsInF1ZXJ5UGFyYW1zIiwicVBhcmFtcyIsImJQYXJhbXMiLCJib2R5UGFyYW1zIiwidWlkIiwiY29uc3RydWN0b3IiLCJBcnJheSIsInByZXBhcmVDb0RPSSIsInByZXBhcmVBZGQiLCJvd25lcklEIiwiY3VycmVudE9wdEluSWQiLCJyZXRSZXNwb25zZSIsInJldF9yZXNwb25zZSIsImV4IiwibWFpbFRlbXBsYXRlU2NoZW1hIiwiY3JlYXRlVXNlclNjaGVtYSIsInVwZGF0ZVVzZXJTY2hlbWEiLCJjb2xsZWN0aW9uT3B0aW9ucyIsInBhdGgiLCJyb3V0ZU9wdGlvbnMiLCJleGNsdWRlZEVuZHBvaW50cyIsImVuZHBvaW50cyIsImRlbGV0ZSIsInJvbGVSZXF1aXJlZCIsInBhcmFtSWQiLCJhZGRDb2xsZWN0aW9uIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBQSxNQUFNLENBQUNDLE1BQVAsQ0FBYztBQUFDQyxNQUFJLEVBQUMsTUFBSUEsSUFBVjtBQUFlQyxrQkFBZ0IsRUFBQyxNQUFJQSxnQkFBcEM7QUFBcURDLHNCQUFvQixFQUFDLE1BQUlBLG9CQUE5RTtBQUFtR0MsU0FBTyxFQUFDLE1BQUlBLE9BQS9HO0FBQXVIQyxhQUFXLEVBQUMsTUFBSUEsV0FBdkk7QUFBbUpDLFVBQVEsRUFBQyxNQUFJQSxRQUFoSztBQUF5S0MsU0FBTyxFQUFDLE1BQUlBLE9BQXJMO0FBQTZMQyxVQUFRLEVBQUMsTUFBSUE7QUFBMU0sQ0FBZDtBQUFtT1QsTUFBTSxDQUFDVSxJQUFQLENBQVksa0JBQVo7QUFBZ0MsSUFBSUMsTUFBSjtBQUFXWCxNQUFNLENBQUNVLElBQVAsQ0FBWSwrQkFBWixFQUE0QztBQUFDQyxRQUFNLENBQUNDLENBQUQsRUFBRztBQUFDRCxVQUFNLEdBQUNDLENB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QUFuRSxFQUErRixDQUEvRjtBQUdwRTZqQixHQUFHLENBQUNLLFFBQUosQ0FBYSxlQUFiLEVBQThCO0FBQUNDLGNBQVksRUFBRTtBQUFmLENBQTlCLEVBQW9EO0FBQ2xEWCxLQUFHLEVBQUU7QUFDSFcsZ0JBQVksRUFBRSxLQURYO0FBRUhDLFVBQU0sRUFBRSxZQUFXO0FBQ2YsWUFBTVUsT0FBTyxHQUFHLEtBQUtELFdBQXJCO0FBQ0EsWUFBTUUsT0FBTyxHQUFHLEtBQUtDLFVBQXJCO0FBQ0EsVUFBSUosTUFBTSxHQUFHLEVBQWI7QUFDQSxVQUFHRSxPQUFPLEtBQUsxYyxTQUFmLEVBQTBCd2MsTUFBTSxtQ0FBT0UsT0FBUCxDQUFOO0FBQzFCLFVBQUdDLE9BQU8sS0FBSzNjLFNBQWYsRUFBMEJ3YyxNQUFNLG1DQUFPQSxNQUFQLEVBQWtCRyxPQUFsQixDQUFOOztBQUU1QixVQUFJO0FBQ0YsY0FBTWhFLEdBQUcsR0FBR3hHLFdBQVcsQ0FBQ3FLLE1BQUQsQ0FBdkI7QUFDQSxlQUFPO0FBQUNoZCxnQkFBTSxFQUFFLFNBQVQ7QUFBb0JsRSxjQUFJLEVBQUU7QUFBQ3FkO0FBQUQ7QUFBMUIsU0FBUDtBQUNELE9BSEQsQ0FHRSxPQUFNemMsS0FBTixFQUFhO0FBQ2IsZUFBTztBQUFDb2dCLG9CQUFVLEVBQUUsR0FBYjtBQUFrQkMsY0FBSSxFQUFFO0FBQUMvYyxrQkFBTSxFQUFFLE1BQVQ7QUFBaUJtRCxtQkFBTyxFQUFFekcsS0FBSyxDQUFDeUc7QUFBaEM7QUFBeEIsU0FBUDtBQUNEO0FBQ0Y7QUFmRTtBQUQ2QyxDQUFwRCxFIiwiZmlsZSI6Ii9wYWNrYWdlcy9kb2ljaGFpbl9kb2ljaGFpbi1tZXRlb3ItYXBpLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICcuL3NlcnZlci9tYWluLmpzJztcbmV4cG9ydCBjb25zdCBuYW1lID0gJ2RvaWNoYWluLW1ldGVvci1hcGknO1xuXG5pbXBvcnQge09wdEluc30gZnJvbSBcIi4vaW1wb3J0cy9hcGkvb3B0LWlucy9vcHQtaW5zXCI7XG5pbXBvcnQge1JlY2lwaWVudHN9IGZyb20gXCIuL2ltcG9ydHMvYXBpL3JlY2lwaWVudHMvcmVjaXBpZW50c1wiO1xuaW1wb3J0IHtnZXRIdHRwR0VULCBnZXRIdHRwR0VUZGF0YSwgZ2V0SHR0cFBPU1R9IGZyb20gXCIuL3NlcnZlci9hcGkvaHR0cFwiO1xuaW1wb3J0IHt0ZXN0TG9nZ2luZ30gZnJvbSBcIi4vaW1wb3J0cy9zdGFydHVwL3NlcnZlci9sb2ctY29uZmlndXJhdGlvblwiO1xuXG5leHBvcnQgbGV0IE9wdEluc0NvbGxlY3Rpb24gPSBPcHRJbnM7XG5leHBvcnQgbGV0IFJlY2lwaWVudHNDb2xsZWN0aW9uID0gUmVjaXBpZW50cztcbmV4cG9ydCBsZXQgaHR0cEdFVCA9IGdldEh0dHBHRVQ7XG5leHBvcnQgbGV0IGh0dHBHRVRkYXRhID0gZ2V0SHR0cEdFVGRhdGE7XG5leHBvcnQgbGV0IGh0dHBQT1NUID0gZ2V0SHR0cFBPU1Q7XG5leHBvcnQgbGV0IHRlc3RMb2cgPSB0ZXN0TG9nZ2luZztcbmV4cG9ydCBsZXQgdGVzdHZhcjE9XCJpIGFtIGFsaXZlXCI7IiwiaW1wb3J0IHsgTW9uZ28gfSBmcm9tICdtZXRlb3IvbW9uZ28nO1xuaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tICdzaW1wbC1zY2hlbWEnO1xuXG5jbGFzcyBEb2ljaGFpbkVudHJpZXNDb2xsZWN0aW9uIGV4dGVuZHMgTW9uZ28uQ29sbGVjdGlvbiB7XG4gIGluc2VydChlbnRyeSwgY2FsbGJhY2spIHtcbiAgICBjb25zdCByZXN1bHQgPSBzdXBlci5pbnNlcnQoZW50cnksIGNhbGxiYWNrKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIHVwZGF0ZShzZWxlY3RvciwgbW9kaWZpZXIpIHtcbiAgICBjb25zdCByZXN1bHQgPSBzdXBlci51cGRhdGUoc2VsZWN0b3IsIG1vZGlmaWVyKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIHJlbW92ZShzZWxlY3Rvcikge1xuICAgIGNvbnN0IHJlc3VsdCA9IHN1cGVyLnJlbW92ZShzZWxlY3Rvcik7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgRG9pY2hhaW5FbnRyaWVzID0gbmV3IERvaWNoYWluRW50cmllc0NvbGxlY3Rpb24oJ2RvaWNoYWluLWVudHJpZXMnKTtcblxuLy8gRGVueSBhbGwgY2xpZW50LXNpZGUgdXBkYXRlcyBzaW5jZSB3ZSB3aWxsIGJlIHVzaW5nIG1ldGhvZHMgdG8gbWFuYWdlIHRoaXMgY29sbGVjdGlvblxuRG9pY2hhaW5FbnRyaWVzLmRlbnkoe1xuICBpbnNlcnQoKSB7IHJldHVybiB0cnVlOyB9LFxuICB1cGRhdGUoKSB7IHJldHVybiB0cnVlOyB9LFxuICByZW1vdmUoKSB7IHJldHVybiB0cnVlOyB9LFxufSk7XG5cbkRvaWNoYWluRW50cmllcy5zY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgX2lkOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIHJlZ0V4OiBTaW1wbGVTY2hlbWEuUmVnRXguSWQsXG4gIH0sXG4gIG5hbWU6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAvLyBpbmRleDogdHJ1ZSxcbiAgIC8vIGRlbnlVcGRhdGU6IHRydWVcbiAgfSxcbiAgdmFsdWU6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAvLyBkZW55VXBkYXRlOiBmYWxzZVxuICB9LFxuICBhZGRyZXNzOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgLy8gZGVueVVwZGF0ZTogZmFsc2VcbiAgfSxcbiAgbWFzdGVyRG9pOiB7XG4gICAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgICAgb3B0aW9uYWw6IHRydWUsXG4gICAgLy8gICAgaW5kZXg6IHRydWUsXG4gICAgLy8gICAgZGVueVVwZGF0ZTogdHJ1ZSAvL1RPRE8gZG9lc24ndCB3b3JrIGluc2lkZSBhIGJhY2thZ2UgYWxkZWVkOnNjaGVtYS1pbmRleEAzLjAuMFxuICB9LFxuICBpbmRleDoge1xuICAgICAgICB0eXBlOiBTaW1wbGVTY2hlbWEuSW50ZWdlcixcbiAgICAgICAgb3B0aW9uYWw6IHRydWUsXG4gICAgICAgLy8gZGVueVVwZGF0ZTogdHJ1ZVxuICB9LFxuICB0eElkOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgLy8gZGVueVVwZGF0ZTogZmFsc2VcbiAgfVxufSk7XG5cbkRvaWNoYWluRW50cmllcy5hdHRhY2hTY2hlbWEoRG9pY2hhaW5FbnRyaWVzLnNjaGVtYSk7XG5cbi8vIFRoaXMgcmVwcmVzZW50cyB0aGUga2V5cyBmcm9tIEVudHJ5IG9iamVjdHMgdGhhdCBzaG91bGQgYmUgcHVibGlzaGVkXG4vLyB0byB0aGUgY2xpZW50LiBJZiB3ZSBhZGQgc2VjcmV0IHByb3BlcnRpZXMgdG8gRW50cnkgb2JqZWN0cywgZG9uJ3QgbGlzdFxuLy8gdGhlbSBoZXJlIHRvIGtlZXAgdGhlbSBwcml2YXRlIHRvIHRoZSBzZXJ2ZXIuXG5Eb2ljaGFpbkVudHJpZXMucHVibGljRmllbGRzID0ge1xuICBfaWQ6IDEsXG4gIG5hbWU6IDEsXG4gIHZhbHVlOiAxLFxuICBhZGRyZXNzOiAxLFxuICBtYXN0ZXJEb2k6IDEsXG4gIGluZGV4OiAxLFxuICB0eElkOiAxXG59O1xuIiwiaW1wb3J0IHsgVmFsaWRhdGVkTWV0aG9kIH0gZnJvbSAnbWV0ZW9yL21kZzp2YWxpZGF0ZWQtbWV0aG9kJztcbmltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IHsgRERQUmF0ZUxpbWl0ZXIgfSBmcm9tICdtZXRlb3IvZGRwLXJhdGUtbGltaXRlcic7XG5pbXBvcnQgZ2V0S2V5UGFpck0gZnJvbSAnLi4vLi4vbW9kdWxlcy9zZXJ2ZXIvZG9pY2hhaW4vZ2V0X2tleS1wYWlyLmpzJztcbmltcG9ydCBnZXRCYWxhbmNlTSBmcm9tICcuLi8uLi9tb2R1bGVzL3NlcnZlci9kb2ljaGFpbi9nZXRfYmFsYW5jZS5qcyc7XG5cblxuY29uc3QgZ2V0S2V5UGFpciA9IG5ldyBWYWxpZGF0ZWRNZXRob2Qoe1xuICBuYW1lOiAnZG9pY2hhaW4uZ2V0S2V5UGFpcicsXG4gIHZhbGlkYXRlOiBudWxsLFxuICBydW4oKSB7XG4gICAgcmV0dXJuIGdldEtleVBhaXJNKCk7XG4gIH0sXG59KTtcblxuY29uc3QgZ2V0QmFsYW5jZSA9IG5ldyBWYWxpZGF0ZWRNZXRob2Qoe1xuICBuYW1lOiAnZG9pY2hhaW4uZ2V0QmFsYW5jZScsXG4gIHZhbGlkYXRlOiBudWxsLFxuICBydW4oKSB7XG4gICAgY29uc3QgbG9nVmFsID0gZ2V0QmFsYW5jZU0oKTtcbiAgICByZXR1cm4gbG9nVmFsO1xuICB9LFxufSk7XG5cblxuLy8gR2V0IGxpc3Qgb2YgYWxsIG1ldGhvZCBuYW1lcyBvbiBkb2ljaGFpblxuY29uc3QgT1BUSU5TX01FVEhPRFMgPSBfLnBsdWNrKFtcbiAgZ2V0S2V5UGFpclxuLGdldEJhbGFuY2VdLCAnbmFtZScpO1xuXG5pZiAoTWV0ZW9yLmlzU2VydmVyKSB7XG4gIC8vIE9ubHkgYWxsb3cgNSBvcHQtaW4gb3BlcmF0aW9ucyBwZXIgY29ubmVjdGlvbiBwZXIgc2Vjb25kXG4gIEREUFJhdGVMaW1pdGVyLmFkZFJ1bGUoe1xuICAgIG5hbWUobmFtZSkge1xuICAgICAgcmV0dXJuIF8uY29udGFpbnMoT1BUSU5TX01FVEhPRFMsIG5hbWUpO1xuICAgIH0sXG5cbiAgICAvLyBSYXRlIGxpbWl0IHBlciBjb25uZWN0aW9uIElEXG4gICAgY29ubmVjdGlvbklkKCkgeyByZXR1cm4gdHJ1ZTsgfSxcbiAgfSwgNSwgMTAwMCk7XG59XG4iLCJpbXBvcnQgeyBNZXRlb3J9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IHsgRERQUmF0ZUxpbWl0ZXIgfSBmcm9tICdtZXRlb3IvZGRwLXJhdGUtbGltaXRlcic7XG5pbXBvcnQgeyBWYWxpZGF0ZWRNZXRob2QgfSBmcm9tICdtZXRlb3IvbWRnOnZhbGlkYXRlZC1tZXRob2QnO1xuaW1wb3J0IGdldExhbmd1YWdlcyBmcm9tICcuLi8uLi9tb2R1bGVzL3NlcnZlci9sYW5ndWFnZXMvZ2V0LmpzJztcblxuY29uc3QgZ2V0QWxsTGFuZ3VhZ2VzID0gbmV3IFZhbGlkYXRlZE1ldGhvZCh7XG4gIG5hbWU6ICdsYW5ndWFnZXMuZ2V0QWxsJyxcbiAgdmFsaWRhdGU6IG51bGwsXG4gIHJ1bigpIHtcbiAgICByZXR1cm4gZ2V0TGFuZ3VhZ2VzKCk7XG4gIH0sXG59KTtcblxuLy8gR2V0IGxpc3Qgb2YgYWxsIG1ldGhvZCBuYW1lcyBvbiBsYW5ndWFnZXNcbmNvbnN0IE9QVElOU19NRVRIT0RTID0gXy5wbHVjayhbXG4gIGdldEFsbExhbmd1YWdlc1xuXSwgJ25hbWUnKTtcblxuaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAvLyBPbmx5IGFsbG93IDUgb3B0LWluIG9wZXJhdGlvbnMgcGVyIGNvbm5lY3Rpb24gcGVyIHNlY29uZFxuICBERFBSYXRlTGltaXRlci5hZGRSdWxlKHtcbiAgICBuYW1lKG5hbWUpIHtcbiAgICAgIHJldHVybiBfLmNvbnRhaW5zKE9QVElOU19NRVRIT0RTLCBuYW1lKTtcbiAgICB9LFxuXG4gICAgLy8gUmF0ZSBsaW1pdCBwZXIgY29ubmVjdGlvbiBJRFxuICAgIGNvbm5lY3Rpb25JZCgpIHsgcmV0dXJuIHRydWU7IH0sXG4gIH0sIDUsIDEwMDApO1xufVxuIiwiaW1wb3J0IHsgTW9uZ28gfSBmcm9tICdtZXRlb3IvbW9uZ28nO1xuaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tICdzaW1wbC1zY2hlbWEnO1xuXG5jbGFzcyBNZXRhQ29sbGVjdGlvbiBleHRlbmRzIE1vbmdvLkNvbGxlY3Rpb24ge1xuICBpbnNlcnQoZGF0YSwgY2FsbGJhY2spIHtcbiAgICBjb25zdCBvdXJEYXRhID0gZGF0YTtcbiAgICBjb25zdCByZXN1bHQgPSBzdXBlci5pbnNlcnQob3VyRGF0YSwgY2FsbGJhY2spO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgdXBkYXRlKHNlbGVjdG9yLCBtb2RpZmllcikge1xuICAgIGNvbnN0IHJlc3VsdCA9IHN1cGVyLnVwZGF0ZShzZWxlY3RvciwgbW9kaWZpZXIpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgcmVtb3ZlKHNlbGVjdG9yKSB7XG4gICAgY29uc3QgcmVzdWx0ID0gc3VwZXIucmVtb3ZlKHNlbGVjdG9yKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG5cbmV4cG9ydCBjb25zdCBNZXRhID0gbmV3IE1ldGFDb2xsZWN0aW9uKCdtZXRhJyk7XG5cbi8vIERlbnkgYWxsIGNsaWVudC1zaWRlIHVwZGF0ZXMgc2luY2Ugd2Ugd2lsbCBiZSB1c2luZyBtZXRob2RzIHRvIG1hbmFnZSB0aGlzIGNvbGxlY3Rpb25cbk1ldGEuZGVueSh7XG4gIGluc2VydCgpIHsgcmV0dXJuIHRydWU7IH0sXG4gIHVwZGF0ZSgpIHsgcmV0dXJuIHRydWU7IH0sXG4gIHJlbW92ZSgpIHsgcmV0dXJuIHRydWU7IH0sXG59KTtcblxuTWV0YS5zY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgX2lkOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIHJlZ0V4OiBTaW1wbGVTY2hlbWEuUmVnRXguSWQsXG4gIH0sXG4gIGtleToge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgLy8gIGluZGV4OiB0cnVlLCAvL1RPRE8gZG9lc24ndCB3b3JrIGluc2lkZSBhIGJhY2thZ2UgYWxkZWVkOnNjaGVtYS1pbmRleEAzLjAuMFxuICAgICAgLy8gVE9ETyBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2FsZGVlZC9tZXRlb3ItY29sbGVjdGlvbjIvaXNzdWVzLzM3OFxuICAvLyAgZGVueVVwZGF0ZTogdHJ1ZSAvL1RPRE8gYWxkZWVkOnNjaGVtYS1kZW55QDIuMC4xXG4gIH0sXG4gIHZhbHVlOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH1cbn0pO1xuXG5NZXRhLmF0dGFjaFNjaGVtYShNZXRhLnNjaGVtYSk7XG5cbi8vIFRoaXMgcmVwcmVzZW50cyB0aGUga2V5cyBmcm9tIE1ldGEgb2JqZWN0cyB0aGF0IHNob3VsZCBiZSBwdWJsaXNoZWRcbi8vIHRvIHRoZSBjbGllbnQuIElmIHdlIGFkZCBzZWNyZXQgcHJvcGVydGllcyB0byBNZXRhIG9iamVjdHMsIGRvbid0IGxpc3Rcbi8vIHRoZW0gaGVyZSB0byBrZWVwIHRoZW0gcHJpdmF0ZSB0byB0aGUgc2VydmVyLlxuTWV0YS5wdWJsaWNGaWVsZHMgPSB7XG59O1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgeyBERFBSYXRlTGltaXRlciB9IGZyb20gJ21ldGVvci9kZHAtcmF0ZS1saW1pdGVyJztcbmltcG9ydCB7IF9pMThuIGFzIGkxOG4gfSBmcm9tICdtZXRlb3IvdW5pdmVyc2U6aTE4bic7XG5pbXBvcnQgeyBWYWxpZGF0ZWRNZXRob2QgfSBmcm9tICdtZXRlb3IvbWRnOnZhbGlkYXRlZC1tZXRob2QnO1xuaW1wb3J0IHsgUm9sZXMgfSBmcm9tICdtZXRlb3IvYWxhbm5pbmc6cm9sZXMnO1xuaW1wb3J0IHsgXyB9IGZyb20gJ21ldGVvci91bmRlcnNjb3JlJztcbmltcG9ydCBhZGRPcHRJbiBmcm9tICcuLi8uLi9tb2R1bGVzL3NlcnZlci9vcHQtaW5zL2FkZF9hbmRfd3JpdGVfdG9fYmxvY2tjaGFpbi5qcyc7XG5cbmNvbnN0IGFkZCA9IG5ldyBWYWxpZGF0ZWRNZXRob2Qoe1xuICBuYW1lOiAnb3B0LWlucy5hZGQnLFxuICB2YWxpZGF0ZTogbnVsbCxcbiAgcnVuKHsgcmVjaXBpZW50TWFpbCwgc2VuZGVyTWFpbCwgZGF0YSB9KSB7XG4gICAgaWYoIXRoaXMudXNlcklkIHx8ICFSb2xlcy51c2VySXNJblJvbGUodGhpcy51c2VySWQsIFsnYWRtaW4nXSkpIHtcbiAgICAgIGNvbnN0IGVycm9yID0gXCJhcGkub3B0LWlucy5hZGQuYWNjZXNzRGVuaWVkXCI7XG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKGVycm9yLCBpMThuLl9fKGVycm9yKSk7XG4gICAgfVxuXG4gICAgY29uc3Qgb3B0SW4gPSB7XG4gICAgICBcInJlY2lwaWVudF9tYWlsXCI6IHJlY2lwaWVudE1haWwsXG4gICAgICBcInNlbmRlcl9tYWlsXCI6IHNlbmRlck1haWwsXG4gICAgICBkYXRhXG4gICAgfVxuXG4gICAgYWRkT3B0SW4ob3B0SW4pXG4gIH0sXG59KTtcblxuLy8gR2V0IGxpc3Qgb2YgYWxsIG1ldGhvZCBuYW1lcyBvbiBvcHQtaW5zXG5jb25zdCBPUFRJT05TX01FVEhPRFMgPSBfLnBsdWNrKFtcbiAgYWRkXG5dLCAnbmFtZScpO1xuaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAvLyBPbmx5IGFsbG93IDUgb3B0LWluIG9wZXJhdGlvbnMgcGVyIGNvbm5lY3Rpb24gcGVyIHNlY29uZFxuICBERFBSYXRlTGltaXRlci5hZGRSdWxlKHtcbiAgICBuYW1lKG5hbWUpIHtcbiAgICAgIHJldHVybiBfLmNvbnRhaW5zKE9QVElPTlNfTUVUSE9EUywgbmFtZSk7XG4gICAgfSxcblxuICAgIC8vIFJhdGUgbGltaXQgcGVyIGNvbm5lY3Rpb24gSURcbiAgICBjb25uZWN0aW9uSWQoKSB7IHJldHVybiB0cnVlOyB9LFxuICB9LCA1LCAxMDAwKTtcbn1cbiIsImltcG9ydCB7IE1vbmdvIH0gZnJvbSAnbWV0ZW9yL21vbmdvJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcblxuY2xhc3MgT3B0SW5zQ29sbGVjdGlvbiBleHRlbmRzIE1vbmdvLkNvbGxlY3Rpb24ge1xuICBpbnNlcnQob3B0SW4sIGNhbGxiYWNrKSB7XG4gICAgY29uc3Qgb3VyT3B0SW4gPSBvcHRJbjtcbiAgICBvdXJPcHRJbi5yZWNpcGllbnRfc2VuZGVyID0gb3VyT3B0SW4ucmVjaXBpZW50K291ck9wdEluLnNlbmRlcjtcbiAgICBvdXJPcHRJbi5jcmVhdGVkQXQgPSBvdXJPcHRJbi5jcmVhdGVkQXQgfHwgbmV3IERhdGUoKTtcbiAgICBjb25zdCByZXN1bHQgPSBzdXBlci5pbnNlcnQob3VyT3B0SW4sIGNhbGxiYWNrKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIHVwZGF0ZShzZWxlY3RvciwgbW9kaWZpZXIpIHtcbiAgICBjb25zdCByZXN1bHQgPSBzdXBlci51cGRhdGUoc2VsZWN0b3IsIG1vZGlmaWVyKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIHJlbW92ZShzZWxlY3Rvcikge1xuICAgIGNvbnN0IHJlc3VsdCA9IHN1cGVyLnJlbW92ZShzZWxlY3Rvcik7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgT3B0SW5zID0gbmV3IE9wdEluc0NvbGxlY3Rpb24oJ29wdC1pbnMnKTtcblxuLy8gRGVueSBhbGwgY2xpZW50LXNpZGUgdXBkYXRlcyBzaW5jZSB3ZSB3aWxsIGJlIHVzaW5nIG1ldGhvZHMgdG8gbWFuYWdlIHRoaXMgY29sbGVjdGlvblxuT3B0SW5zLmRlbnkoe1xuICBpbnNlcnQoKSB7IHJldHVybiB0cnVlOyB9LFxuICB1cGRhdGUoKSB7IHJldHVybiB0cnVlOyB9LFxuICByZW1vdmUoKSB7IHJldHVybiB0cnVlOyB9LFxufSk7XG5cbk9wdElucy5zY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgX2lkOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIHJlZ0V4OiBTaW1wbGVTY2hlbWEuUmVnRXguSWQsXG4gIH0sXG4gIHJlY2lwaWVudDoge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICBvcHRpb25hbDogdHJ1ZSxcbiAvLyAgIGRlbnlVcGRhdGU6IHRydWUsIC8vVE9ETyBlbmFibGUgdGhpcyB3aGVuIHRoaXMgcGFja2FnZSB3b3JrcyBhZ2FpbiBzZWUgbWV0YVxuICB9LFxuICBzZW5kZXI6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgb3B0aW9uYWw6IHRydWUsXG4vLyAgICBkZW55VXBkYXRlOiB0cnVlLFxuICB9LFxuICBkYXRhOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIG9wdGlvbmFsOiB0cnVlLFxuIC8vICAgZGVueVVwZGF0ZTogZmFsc2UsXG4gIH0sXG4gIGluZGV4OiB7XG4gICAgdHlwZTogU2ltcGxlU2NoZW1hLkludGVnZXIsXG4gICAgb3B0aW9uYWw6IHRydWUsXG4gIC8vICBkZW55VXBkYXRlOiBmYWxzZSxcbiAgfSxcbiAgbmFtZUlkOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIG9wdGlvbmFsOiB0cnVlLFxuICAvLyAgZGVueVVwZGF0ZTogZmFsc2UsXG4gIH0sXG4gIHR4SWQ6IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIG9wdGlvbmFsOiB0cnVlLFxuICAgLy8gICBkZW55VXBkYXRlOiBmYWxzZSxcbiAgfSxcbiAgbWFzdGVyRG9pOiB7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICBvcHRpb25hbDogdHJ1ZSxcbiAgLy8gICAgZGVueVVwZGF0ZTogZmFsc2UsXG4gIH0sXG4gIGNyZWF0ZWRBdDoge1xuICAgIHR5cGU6IERhdGUsXG4vLyAgICBkZW55VXBkYXRlOiB0cnVlLFxuICB9LFxuICBjb25maXJtZWRBdDoge1xuICAgIHR5cGU6IERhdGUsXG4gICAgb3B0aW9uYWw6IHRydWUsXG4gLy8gICBkZW55VXBkYXRlOiBmYWxzZSxcbiAgfSxcbiAgY29uZmlybWVkQnk6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgcmVnRXg6IFNpbXBsZVNjaGVtYS5SZWdFeC5JUCxcbiAgICBvcHRpb25hbDogdHJ1ZSxcbiAvLyAgIGRlbnlVcGRhdGU6IGZhbHNlXG4gIH0sXG4gIGNvbmZpcm1hdGlvblRva2VuOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIG9wdGlvbmFsOiB0cnVlLFxuICAvLyAgZGVueVVwZGF0ZTogZmFsc2VcbiAgfSxcbiAgb3duZXJJZDp7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIG9wdGlvbmFsOiB0cnVlLFxuICAgIHJlZ0V4OiBTaW1wbGVTY2hlbWEuUmVnRXguSWRcbiAgfSxcbiAgZXJyb3I6e1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgb3B0aW9uYWw6IHRydWUsXG4gICAvLyAgIGRlbnlVcGRhdGU6IGZhbHNlXG4gIH1cbn0pO1xuXG5PcHRJbnMuYXR0YWNoU2NoZW1hKE9wdElucy5zY2hlbWEpO1xuXG4vLyBUaGlzIHJlcHJlc2VudHMgdGhlIGtleXMgZnJvbSBPcHQtSW4gb2JqZWN0cyB0aGF0IHNob3VsZCBiZSBwdWJsaXNoZWRcbi8vIHRvIHRoZSBjbGllbnQuIElmIHdlIGFkZCBzZWNyZXQgcHJvcGVydGllcyB0byBPcHQtSW4gb2JqZWN0cywgZG9uJ3QgbGlzdFxuLy8gdGhlbSBoZXJlIHRvIGtlZXAgdGhlbSBwcml2YXRlIHRvIHRoZSBzZXJ2ZXIuXG5PcHRJbnMucHVibGljRmllbGRzID0ge1xuICBfaWQ6IDEsXG4gIHJlY2lwaWVudDogMSxcbiAgc2VuZGVyOiAxLFxuICBkYXRhOiAxLFxuICBpbmRleDogMSxcbiAgbmFtZUlkOiAxLFxuICB0eElkOiAxLFxuICBtYXN0ZXJEb2k6IDEsXG4gIGNyZWF0ZWRBdDogMSxcbiAgY29uZmlybWVkQXQ6IDEsXG4gIGNvbmZpcm1lZEJ5OiAxLFxuICBvd25lcklkOiAxLFxuICBlcnJvcjogMVxufTtcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IHsgUm9sZXMgfSBmcm9tICdtZXRlb3IvYWxhbm5pbmc6cm9sZXMnO1xuaW1wb3J0IHsgT3B0SW5zIH0gZnJvbSAnLi4vb3B0LWlucy5qcyc7XG5cbk1ldGVvci5wdWJsaXNoKCdvcHQtaW5zLmFsbCcsIGZ1bmN0aW9uIE9wdEluc0FsbCgpIHtcbiAgaWYoIXRoaXMudXNlcklkKSB7XG4gICAgcmV0dXJuIHRoaXMucmVhZHkoKTtcbiAgfVxuICBpZighUm9sZXMudXNlcklzSW5Sb2xlKHRoaXMudXNlcklkLCBbJ2FkbWluJ10pKXtcbiAgICByZXR1cm4gT3B0SW5zLmZpbmQoe293bmVySWQ6dGhpcy51c2VySWR9LCB7XG4gICAgICBmaWVsZHM6IE9wdElucy5wdWJsaWNGaWVsZHMsXG4gICAgfSk7XG4gIH1cbiAgXG5cbiAgcmV0dXJuIE9wdElucy5maW5kKHt9LCB7XG4gICAgZmllbGRzOiBPcHRJbnMucHVibGljRmllbGRzLFxuICB9KTtcbn0pO1xuIiwiaW1wb3J0IHsgTW9uZ28gfSBmcm9tICdtZXRlb3IvbW9uZ28nO1xuaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tICdzaW1wbC1zY2hlbWEnO1xuXG5jbGFzcyBSZWNpcGllbnRzQ29sbGVjdGlvbiBleHRlbmRzIE1vbmdvLkNvbGxlY3Rpb24ge1xuICBpbnNlcnQocmVjaXBpZW50LCBjYWxsYmFjaykge1xuICAgIGNvbnN0IG91clJlY2lwaWVudCA9IHJlY2lwaWVudDtcbiAgICBvdXJSZWNpcGllbnQuY3JlYXRlZEF0ID0gb3VyUmVjaXBpZW50LmNyZWF0ZWRBdCB8fCBuZXcgRGF0ZSgpO1xuICAgIGNvbnN0IHJlc3VsdCA9IHN1cGVyLmluc2VydChvdXJSZWNpcGllbnQsIGNhbGxiYWNrKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIHVwZGF0ZShzZWxlY3RvciwgbW9kaWZpZXIpIHtcbiAgICBjb25zdCByZXN1bHQgPSBzdXBlci51cGRhdGUoc2VsZWN0b3IsIG1vZGlmaWVyKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIHJlbW92ZShzZWxlY3Rvcikge1xuICAgIGNvbnN0IHJlc3VsdCA9IHN1cGVyLnJlbW92ZShzZWxlY3Rvcik7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgUmVjaXBpZW50cyA9IG5ldyBSZWNpcGllbnRzQ29sbGVjdGlvbigncmVjaXBpZW50cycpO1xuXG4vLyBEZW55IGFsbCBjbGllbnQtc2lkZSB1cGRhdGVzIHNpbmNlIHdlIHdpbGwgYmUgdXNpbmcgbWV0aG9kcyB0byBtYW5hZ2UgdGhpcyBjb2xsZWN0aW9uXG5SZWNpcGllbnRzLmRlbnkoe1xuICBpbnNlcnQoKSB7IHJldHVybiB0cnVlOyB9LFxuICB1cGRhdGUoKSB7IHJldHVybiB0cnVlOyB9LFxuICByZW1vdmUoKSB7IHJldHVybiB0cnVlOyB9LFxufSk7XG5cblJlY2lwaWVudHMuc2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIF9pZDoge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICByZWdFeDogU2ltcGxlU2NoZW1hLlJlZ0V4LklkLFxuICB9LFxuICBlbWFpbDoge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICAvL2luZGV4OiB0cnVlLFxuICAgIC8vZGVueVVwZGF0ZTogdHJ1ZSxcbiAgfSxcbiAgcHJpdmF0ZUtleToge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICAvL3VuaXF1ZTogdHJ1ZSwgLy9UT0RPIGVuYWJsZSB0aGlzIHdoZW4gdGhpcyBwYWNrYWdlIHdvcmtzIGFnYWluIHNlZSBtZXRhXG4gICAgLy9kZW55VXBkYXRlOiB0cnVlLFxuICB9LFxuICBwdWJsaWNLZXk6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgLy91bmlxdWU6IHRydWUsXG4gICAgLy9kZW55VXBkYXRlOiB0cnVlLFxuICB9LFxuICBjcmVhdGVkQXQ6IHtcbiAgICB0eXBlOiBEYXRlLFxuICAgIC8vZGVueVVwZGF0ZTogdHJ1ZSxcbiAgfVxufSk7XG5cblJlY2lwaWVudHMuYXR0YWNoU2NoZW1hKFJlY2lwaWVudHMuc2NoZW1hKTtcblxuLy8gVGhpcyByZXByZXNlbnRzIHRoZSBrZXlzIGZyb20gUmVjaXBpZW50IG9iamVjdHMgdGhhdCBzaG91bGQgYmUgcHVibGlzaGVkXG4vLyB0byB0aGUgY2xpZW50LiBJZiB3ZSBhZGQgc2VjcmV0IHByb3BlcnRpZXMgdG8gUmVjaXBpZW50IG9iamVjdHMsIGRvbid0IGxpc3Rcbi8vIHRoZW0gaGVyZSB0byBrZWVwIHRoZW0gcHJpdmF0ZSB0byB0aGUgc2VydmVyLlxuUmVjaXBpZW50cy5wdWJsaWNGaWVsZHMgPSB7XG4gIF9pZDogMSxcbiAgZW1haWw6IDEsXG4gIHB1YmxpY0tleTogMSxcbiAgY3JlYXRlZEF0OiAxXG59O1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgeyBSb2xlcyB9IGZyb20gJ21ldGVvci9hbGFubmluZzpyb2xlcyc7XG5cbmltcG9ydCB7IFJlY2lwaWVudHMgfSBmcm9tICcuLi9yZWNpcGllbnRzLmpzJztcbmltcG9ydCB7IE9wdEluc30gZnJvbSAnLi4vLi4vb3B0LWlucy9vcHQtaW5zLmpzJ1xuTWV0ZW9yLnB1Ymxpc2goJ3JlY2lwaWVudHMuYnlPd25lcicsZnVuY3Rpb24gcmVjaXBpZW50R2V0KCl7XG4gIGxldCBwaXBlbGluZT1bXTtcbiAgaWYoIVJvbGVzLnVzZXJJc0luUm9sZSh0aGlzLnVzZXJJZCwgWydhZG1pbiddKSl7XG4gICAgcGlwZWxpbmUucHVzaChcbiAgICAgIHskcmVkYWN0OntcbiAgICAgICRjb25kOiB7XG4gICAgICAgIGlmOiB7ICRjbXA6IFsgXCIkb3duZXJJZFwiLCB0aGlzLnVzZXJJZCBdIH0sXG4gICAgICAgIHRoZW46IFwiJCRQUlVORVwiLFxuICAgICAgICBlbHNlOiBcIiQkS0VFUFwiIH19fSk7XG4gICAgICB9XG4gICAgICBwaXBlbGluZS5wdXNoKHsgJGxvb2t1cDogeyBmcm9tOiBcInJlY2lwaWVudHNcIiwgbG9jYWxGaWVsZDogXCJyZWNpcGllbnRcIiwgZm9yZWlnbkZpZWxkOiBcIl9pZFwiLCBhczogXCJSZWNpcGllbnRFbWFpbFwiIH0gfSk7XG4gICAgICBwaXBlbGluZS5wdXNoKHsgJHVud2luZDogXCIkUmVjaXBpZW50RW1haWxcIn0pO1xuICAgICAgcGlwZWxpbmUucHVzaCh7ICRwcm9qZWN0OiB7XCJSZWNpcGllbnRFbWFpbC5faWRcIjoxfX0pO1xuXG4gICAgICBjb25zdCByZXN1bHQgPSBPcHRJbnMuYWdncmVnYXRlKHBpcGVsaW5lKTtcbiAgICAgIGxldCBySWRzPVtdO1xuICAgICAgcmVzdWx0LmZvckVhY2goZWxlbWVudCA9PiB7XG4gICAgICAgIHJJZHMucHVzaChlbGVtZW50LlJlY2lwaWVudEVtYWlsLl9pZCk7XG4gICAgICB9KTtcbiAgcmV0dXJuIFJlY2lwaWVudHMuZmluZCh7XCJfaWRcIjp7XCIkaW5cIjpySWRzfX0se2ZpZWxkczpSZWNpcGllbnRzLnB1YmxpY0ZpZWxkc30pO1xufSk7XG5NZXRlb3IucHVibGlzaCgncmVjaXBpZW50cy5hbGwnLCBmdW5jdGlvbiByZWNpcGllbnRzQWxsKCkge1xuICBpZighdGhpcy51c2VySWQgfHwgIVJvbGVzLnVzZXJJc0luUm9sZSh0aGlzLnVzZXJJZCwgWydhZG1pbiddKSkge1xuICAgIHJldHVybiB0aGlzLnJlYWR5KCk7XG4gIH1cblxuICByZXR1cm4gUmVjaXBpZW50cy5maW5kKHt9LCB7XG4gICAgZmllbGRzOiBSZWNpcGllbnRzLnB1YmxpY0ZpZWxkcyxcbiAgfSk7XG59KTtcbiIsImltcG9ydCB7IE1vbmdvIH0gZnJvbSAnbWV0ZW9yL21vbmdvJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcblxuY2xhc3MgU2VuZGVyc0NvbGxlY3Rpb24gZXh0ZW5kcyBNb25nby5Db2xsZWN0aW9uIHtcbiAgaW5zZXJ0KHNlbmRlciwgY2FsbGJhY2spIHtcbiAgICBjb25zdCBvdXJTZW5kZXIgPSBzZW5kZXI7XG4gICAgb3VyU2VuZGVyLmNyZWF0ZWRBdCA9IG91clNlbmRlci5jcmVhdGVkQXQgfHwgbmV3IERhdGUoKTtcbiAgICBjb25zdCByZXN1bHQgPSBzdXBlci5pbnNlcnQob3VyU2VuZGVyLCBjYWxsYmFjayk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICB1cGRhdGUoc2VsZWN0b3IsIG1vZGlmaWVyKSB7XG4gICAgY29uc3QgcmVzdWx0ID0gc3VwZXIudXBkYXRlKHNlbGVjdG9yLCBtb2RpZmllcik7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICByZW1vdmUoc2VsZWN0b3IpIHtcbiAgICBjb25zdCByZXN1bHQgPSBzdXBlci5yZW1vdmUoc2VsZWN0b3IpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IFNlbmRlcnMgPSBuZXcgU2VuZGVyc0NvbGxlY3Rpb24oJ3NlbmRlcnMnKTtcblxuLy8gRGVueSBhbGwgY2xpZW50LXNpZGUgdXBkYXRlcyBzaW5jZSB3ZSB3aWxsIGJlIHVzaW5nIG1ldGhvZHMgdG8gbWFuYWdlIHRoaXMgY29sbGVjdGlvblxuU2VuZGVycy5kZW55KHtcbiAgaW5zZXJ0KCkgeyByZXR1cm4gdHJ1ZTsgfSxcbiAgdXBkYXRlKCkgeyByZXR1cm4gdHJ1ZTsgfSxcbiAgcmVtb3ZlKCkgeyByZXR1cm4gdHJ1ZTsgfSxcbn0pO1xuXG5TZW5kZXJzLnNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICBfaWQ6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgcmVnRXg6IFNpbXBsZVNjaGVtYS5SZWdFeC5JZCxcbiAgfSxcbiAgZW1haWw6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgLy9pbmRleDogdHJ1ZSwgICAvL1RPRE8gZW5hYmxlIHRoaXMgd2hlbiB0aGlzIHBhY2thZ2Ugd29ya3MgYWdhaW4gc2VlIG1ldGFcbiAgICAvL2RlbnlVcGRhdGU6IHRydWUsXG4gIH0sXG4gIGNyZWF0ZWRBdDoge1xuICAgIHR5cGU6IERhdGUsXG4gICAgLy9kZW55VXBkYXRlOiB0cnVlLFxuICB9XG59KTtcblxuU2VuZGVycy5hdHRhY2hTY2hlbWEoU2VuZGVycy5zY2hlbWEpO1xuXG4vLyBUaGlzIHJlcHJlc2VudHMgdGhlIGtleXMgZnJvbSBTZW5kZXIgb2JqZWN0cyB0aGF0IHNob3VsZCBiZSBwdWJsaXNoZWRcbi8vIHRvIHRoZSBjbGllbnQuIElmIHdlIGFkZCBzZWNyZXQgcHJvcGVydGllcyB0byBTZW5kZXIgb2JqZWN0cywgZG9uJ3QgbGlzdFxuLy8gdGhlbSBoZXJlIHRvIGtlZXAgdGhlbSBwcml2YXRlIHRvIHRoZSBzZXJ2ZXIuXG5TZW5kZXJzLnB1YmxpY0ZpZWxkcyA9IHtcbiAgZW1haWw6IDEsXG4gIGNyZWF0ZWRBdDogMVxufTtcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tICdzaW1wbC1zY2hlbWEnO1xuaW1wb3J0IHsgRE9JX01BSUxfRkVUQ0hfVVJMIH0gZnJvbSAnLi4vLi4vLi4vc3RhcnR1cC9zZXJ2ZXIvZW1haWwtY29uZmlndXJhdGlvbi5qcyc7XG5pbXBvcnQge2xvZ1NlbmR9IGZyb20gXCIuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9sb2ctY29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHtPcHRJbnN9IGZyb20gXCIuLi8uLi8uLi9hcGkvb3B0LWlucy9vcHQtaW5zXCI7XG5cbmNvbnN0IEV4cG9ydERvaXNEYXRhU2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIHN0YXR1czoge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICBvcHRpb25hbDogdHJ1ZSxcbiAgfSxcbiAgcm9sZTp7XG4gICAgdHlwZTpTdHJpbmdcbiAgfSxcbiAgdXNlcmlkOntcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgcmVnRXg6IFNpbXBsZVNjaGVtYS5SZWdFeC5pZCxcbiAgICBvcHRpb25hbDp0cnVlIFxuICB9XG59KTtcblxuLy9UT0RPIGFkZCBzZW5kZXIgYW5kIHJlY2lwaWVudCBlbWFpbCBhZGRyZXNzIHRvIGV4cG9ydFxuXG5jb25zdCBleHBvcnREb2lzID0gKGRhdGEpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBvdXJEYXRhID0gZGF0YTtcbiAgICBFeHBvcnREb2lzRGF0YVNjaGVtYS52YWxpZGF0ZShvdXJEYXRhKTtcbiAgICBsZXQgcGlwZWxpbmU9W3sgJG1hdGNoOiB7XCJjb25maXJtZWRBdFwiOnsgJGV4aXN0czogdHJ1ZSwgJG5lOiBudWxsIH19IH1dO1xuICAgIFxuICAgIGlmKG91ckRhdGEucm9sZSE9J2FkbWluJ3x8b3VyRGF0YS51c2VyaWQhPXVuZGVmaW5lZCl7XG4gICAgICBwaXBlbGluZS5wdXNoKHsgJHJlZGFjdDp7XG4gICAgICAgICRjb25kOiB7XG4gICAgICAgICAgaWY6IHsgJGNtcDogWyBcIiRvd25lcklkXCIsIG91ckRhdGEudXNlcmlkIF0gfSxcbiAgICAgICAgICB0aGVuOiBcIiQkUFJVTkVcIixcbiAgICAgICAgICBlbHNlOiBcIiQkS0VFUFwiIH19fSk7XG4gICAgfVxuICAgIHBpcGVsaW5lLmNvbmNhdChbXG4gICAgICAgIHsgJGxvb2t1cDogeyBmcm9tOiBcInJlY2lwaWVudHNcIiwgbG9jYWxGaWVsZDogXCJyZWNpcGllbnRcIiwgZm9yZWlnbkZpZWxkOiBcIl9pZFwiLCBhczogXCJSZWNpcGllbnRFbWFpbFwiIH0gfSxcbiAgICAgICAgeyAkbG9va3VwOiB7IGZyb206IFwic2VuZGVyc1wiLCBsb2NhbEZpZWxkOiBcInNlbmRlclwiLCBmb3JlaWduRmllbGQ6IFwiX2lkXCIsIGFzOiBcIlNlbmRlckVtYWlsXCIgfSB9LFxuICAgICAgICB7ICR1bndpbmQ6IFwiJFNlbmRlckVtYWlsXCJ9LFxuICAgICAgICB7ICR1bndpbmQ6IFwiJFJlY2lwaWVudEVtYWlsXCJ9LFxuICAgICAgICB7ICRwcm9qZWN0OiB7XCJfaWRcIjoxLFwiY3JlYXRlZEF0XCI6MSwgXCJjb25maXJtZWRBdFwiOjEsXCJuYW1lSWRcIjoxLCBcIlNlbmRlckVtYWlsLmVtYWlsXCI6MSxcIlJlY2lwaWVudEVtYWlsLmVtYWlsXCI6MX19XG4gICAgXSk7XG4gICAgLy9pZihvdXJEYXRhLnN0YXR1cz09MSkgcXVlcnkgPSB7XCJjb25maXJtZWRBdFwiOiB7ICRleGlzdHM6IHRydWUsICRuZTogbnVsbCB9fVxuXG4gICAgbGV0IG9wdElucyA9ICBPcHRJbnMuYWdncmVnYXRlKHBpcGVsaW5lKTtcbiAgICBsZXQgZXhwb3J0RG9pRGF0YTtcbiAgICB0cnkge1xuICAgICAgICBleHBvcnREb2lEYXRhID0gb3B0SW5zO1xuICAgICAgICBsb2dTZW5kKCdleHBvcnREb2kgdXJsOicsRE9JX01BSUxfRkVUQ0hfVVJMLEpTT04uc3RyaW5naWZ5KGV4cG9ydERvaURhdGEpKTtcbiAgICAgIHJldHVybiBleHBvcnREb2lEYXRhXG5cbiAgICB9IGNhdGNoKGVycm9yKSB7XG4gICAgICB0aHJvdyBcIkVycm9yIHdoaWxlIGV4cG9ydGluZyBkb2lzOiBcIitlcnJvcjtcbiAgICB9XG5cbiAgfSBjYXRjaCAoZXhjZXB0aW9uKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZGFwcHMuZXhwb3J0RG9pLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGV4cG9ydERvaXM7XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcbmltcG9ydCB7IERPSV9GRVRDSF9ST1VURSwgRE9JX0NPTkZJUk1BVElPTl9ST1VURSwgQVBJX1BBVEgsIFZFUlNJT04gfSBmcm9tICcuLi8uLi8uLi8uLi9zZXJ2ZXIvYXBpL3Jlc3QvcmVzdC5qcyc7XG5pbXBvcnQgeyBnZXRVcmwgfSBmcm9tICcuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9kYXBwLWNvbmZpZ3VyYXRpb24uanMnO1xuaW1wb3J0IHsgQ09ORklSTV9DTElFTlQsIENPTkZJUk1fQUREUkVTUyB9IGZyb20gJy4uLy4uLy4uL3N0YXJ0dXAvc2VydmVyL2RvaWNoYWluLWNvbmZpZ3VyYXRpb24uanMnO1xuaW1wb3J0IHsgZ2V0SHR0cEdFVCB9IGZyb20gJy4uLy4uLy4uLy4uL3NlcnZlci9hcGkvaHR0cC5qcyc7XG5pbXBvcnQgeyBzaWduTWVzc2FnZSB9IGZyb20gJy4uLy4uLy4uLy4uL3NlcnZlci9hcGkvZG9pY2hhaW4uanMnO1xuaW1wb3J0IHsgT3B0SW5zIH0gZnJvbSAnLi4vLi4vLi4vLi4vaW1wb3J0cy9hcGkvb3B0LWlucy9vcHQtaW5zLmpzJztcbmltcG9ydCBwYXJzZVRlbXBsYXRlIGZyb20gJy4uL2VtYWlscy9wYXJzZV90ZW1wbGF0ZS5qcyc7XG5pbXBvcnQgZ2VuZXJhdGVEb2lUb2tlbiBmcm9tICcuLi9vcHQtaW5zL2dlbmVyYXRlX2RvaS10b2tlbi5qcyc7XG5pbXBvcnQgZ2VuZXJhdGVEb2lIYXNoIGZyb20gJy4uL2VtYWlscy9nZW5lcmF0ZV9kb2ktaGFzaC5qcyc7XG5pbXBvcnQgYWRkT3B0SW4gZnJvbSAnLi4vb3B0LWlucy9hZGQuanMnO1xuaW1wb3J0IGFkZFNlbmRNYWlsSm9iIGZyb20gJy4uL2pvYnMvYWRkX3NlbmRfbWFpbC5qcyc7XG5pbXBvcnQge2xvZ0NvbmZpcm0sIGxvZ0Vycm9yfSBmcm9tIFwiLi4vLi4vLi4vc3RhcnR1cC9zZXJ2ZXIvbG9nLWNvbmZpZ3VyYXRpb25cIjtcblxuY29uc3QgRmV0Y2hEb2lNYWlsRGF0YVNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICBuYW1lOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH0sXG4gIGRvbWFpbjoge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9XG59KTtcblxuXG5jb25zdCBmZXRjaERvaU1haWxEYXRhID0gKGRhdGEpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBvdXJEYXRhID0gZGF0YTtcbiAgICBGZXRjaERvaU1haWxEYXRhU2NoZW1hLnZhbGlkYXRlKG91ckRhdGEpO1xuICAgIGNvbnN0IHVybCA9IG91ckRhdGEuZG9tYWluK0FQSV9QQVRIK1ZFUlNJT04rXCIvXCIrRE9JX0ZFVENIX1JPVVRFO1xuICAgIGNvbnN0IHNpZ25hdHVyZSA9IHNpZ25NZXNzYWdlKENPTkZJUk1fQ0xJRU5ULCBDT05GSVJNX0FERFJFU1MsIG91ckRhdGEubmFtZSk7XG4gICAgY29uc3QgcXVlcnkgPSBcIm5hbWVfaWQ9XCIrZW5jb2RlVVJJQ29tcG9uZW50KG91ckRhdGEubmFtZSkrXCImc2lnbmF0dXJlPVwiK2VuY29kZVVSSUNvbXBvbmVudChzaWduYXR1cmUpO1xuICAgIGxvZ0NvbmZpcm0oJ2NhbGxpbmcgZm9yIGRvaS1lbWFpbC10ZW1wbGF0ZTonK3VybCsnIHF1ZXJ5OicsIHF1ZXJ5KTtcblxuICAgIC8qKlxuICAgICAgVE9ETyB3aGVuIHJ1bm5pbmcgU2VuZC1kQXBwIGluIFRlc3RuZXQgYmVoaW5kIE5BVCB0aGlzIFVSTCB3aWxsIG5vdCBiZSBhY2Nlc3NpYmxlIGZyb20gdGhlIGludGVybmV0XG4gICAgICBidXQgZXZlbiB3aGVuIHdlIHVzZSB0aGUgVVJMIGZyb20gbG9jYWxob3N0IHZlcmlmeSBhbmRuIG90aGVycyB3aWxsIGZhaWxzLlxuICAgICAqL1xuICAgIGNvbnN0IHJlc3BvbnNlID0gZ2V0SHR0cEdFVCh1cmwsIHF1ZXJ5KTtcbiAgICBpZihyZXNwb25zZSA9PT0gdW5kZWZpbmVkIHx8IHJlc3BvbnNlLmRhdGEgPT09IHVuZGVmaW5lZCkgdGhyb3cgXCJCYWQgcmVzcG9uc2VcIjtcbiAgICBjb25zdCByZXNwb25zZURhdGEgPSByZXNwb25zZS5kYXRhO1xuICAgIGxvZ0NvbmZpcm0oJ3Jlc3BvbnNlIHdoaWxlIGdldHRpbmcgZ2V0dGluZyBlbWFpbCB0ZW1wbGF0ZSBmcm9tIFVSTDonLHJlc3BvbnNlLmRhdGEuc3RhdHVzKTtcblxuICAgIGlmKHJlc3BvbnNlRGF0YS5zdGF0dXMgIT09IFwic3VjY2Vzc1wiKSB7XG4gICAgICBpZihyZXNwb25zZURhdGEuZXJyb3IgPT09IHVuZGVmaW5lZCkgdGhyb3cgXCJCYWQgcmVzcG9uc2VcIjtcbiAgICAgIGlmKHJlc3BvbnNlRGF0YS5lcnJvci5pbmNsdWRlcyhcIk9wdC1JbiBub3QgZm91bmRcIikpIHtcbiAgICAgICAgLy9EbyBub3RoaW5nIGFuZCBkb24ndCB0aHJvdyBlcnJvciBzbyBqb2IgaXMgZG9uZVxuICAgICAgICAgIGxvZ0Vycm9yKCdyZXNwb25zZSBkYXRhIGZyb20gU2VuZC1kQXBwOicscmVzcG9uc2VEYXRhLmVycm9yKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdGhyb3cgcmVzcG9uc2VEYXRhLmVycm9yO1xuICAgIH1cbiAgICBsb2dDb25maXJtKCdET0kgTWFpbCBkYXRhIGZldGNoZWQuJyk7XG5cbiAgICBjb25zdCBvcHRJbklkID0gYWRkT3B0SW4oe25hbWU6IG91ckRhdGEubmFtZX0pO1xuICAgIGNvbnN0IG9wdEluID0gT3B0SW5zLmZpbmRPbmUoe19pZDogb3B0SW5JZH0pO1xuICAgIGxvZ0NvbmZpcm0oJ29wdC1pbiBmb3VuZDonLG9wdEluKTtcbiAgICBpZihvcHRJbi5jb25maXJtYXRpb25Ub2tlbiAhPT0gdW5kZWZpbmVkKSByZXR1cm47XG5cbiAgICBjb25zdCB0b2tlbiA9IGdlbmVyYXRlRG9pVG9rZW4oe2lkOiBvcHRJbi5faWR9KTtcbiAgICBsb2dDb25maXJtKCdnZW5lcmF0ZWQgY29uZmlybWF0aW9uVG9rZW46Jyx0b2tlbik7XG4gICAgY29uc3QgY29uZmlybWF0aW9uSGFzaCA9IGdlbmVyYXRlRG9pSGFzaCh7aWQ6IG9wdEluLl9pZCwgdG9rZW46IHRva2VuLCByZWRpcmVjdDogcmVzcG9uc2VEYXRhLmRhdGEucmVkaXJlY3R9KTtcbiAgICBsb2dDb25maXJtKCdnZW5lcmF0ZWQgY29uZmlybWF0aW9uSGFzaDonLGNvbmZpcm1hdGlvbkhhc2gpO1xuICAgIGNvbnN0IGNvbmZpcm1hdGlvblVybCA9IGdldFVybCgpK0FQSV9QQVRIK1ZFUlNJT04rXCIvXCIrRE9JX0NPTkZJUk1BVElPTl9ST1VURStcIi9cIitlbmNvZGVVUklDb21wb25lbnQoY29uZmlybWF0aW9uSGFzaCk7XG4gICAgbG9nQ29uZmlybSgnY29uZmlybWF0aW9uVXJsOicrY29uZmlybWF0aW9uVXJsKTtcblxuICAgIGNvbnN0IHRlbXBsYXRlID0gcGFyc2VUZW1wbGF0ZSh7dGVtcGxhdGU6IHJlc3BvbnNlRGF0YS5kYXRhLmNvbnRlbnQsIGRhdGE6IHtcbiAgICAgIGNvbmZpcm1hdGlvbl91cmw6IGNvbmZpcm1hdGlvblVybFxuICAgIH19KTtcblxuICAgIC8vbG9nQ29uZmlybSgnd2UgYXJlIHVzaW5nIHRoaXMgdGVtcGxhdGU6Jyx0ZW1wbGF0ZSk7XG5cbiAgICBsb2dDb25maXJtKCdzZW5kaW5nIGVtYWlsIHRvIHBldGVyIGZvciBjb25maXJtYXRpb24gb3ZlciBib2JzIGRBcHAnKTtcbiAgICBhZGRTZW5kTWFpbEpvYih7XG4gICAgICB0bzogcmVzcG9uc2VEYXRhLmRhdGEucmVjaXBpZW50LFxuICAgICAgc3ViamVjdDogcmVzcG9uc2VEYXRhLmRhdGEuc3ViamVjdCxcbiAgICAgIG1lc3NhZ2U6IHRlbXBsYXRlLFxuICAgICAgcmV0dXJuUGF0aDogcmVzcG9uc2VEYXRhLmRhdGEucmV0dXJuUGF0aFxuICAgIH0pO1xuICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdkYXBwcy5mZXRjaERvaU1haWxEYXRhLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGZldGNoRG9pTWFpbERhdGE7XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcbmltcG9ydCB7IE9wdElucyB9IGZyb20gJy4uLy4uLy4uL2FwaS9vcHQtaW5zL29wdC1pbnMuanMnO1xuaW1wb3J0IHsgUmVjaXBpZW50cyB9IGZyb20gJy4uLy4uLy4uL2FwaS9yZWNpcGllbnRzL3JlY2lwaWVudHMuanMnO1xuaW1wb3J0IGdldE9wdEluUHJvdmlkZXIgZnJvbSAnLi4vZG5zL2dldF9vcHQtaW4tcHJvdmlkZXIuanMnO1xuaW1wb3J0IGdldE9wdEluS2V5IGZyb20gJy4uL2Rucy9nZXRfb3B0LWluLWtleS5qcyc7XG5pbXBvcnQgdmVyaWZ5U2lnbmF0dXJlIGZyb20gJy4uL2RvaWNoYWluL3ZlcmlmeV9zaWduYXR1cmUuanMnO1xuaW1wb3J0IHsgZ2V0SHR0cEdFVCB9IGZyb20gJy4uLy4uLy4uLy4uL3NlcnZlci9hcGkvaHR0cC5qcyc7XG5pbXBvcnQgeyBET0lfTUFJTF9GRVRDSF9VUkwgfSBmcm9tICcuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9lbWFpbC1jb25maWd1cmF0aW9uLmpzJztcbmltcG9ydCB7IGxvZ1NlbmQgfSBmcm9tIFwiLi4vLi4vLi4vc3RhcnR1cC9zZXJ2ZXIvbG9nLWNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7IEFjY291bnRzIH0gZnJvbSAnbWV0ZW9yL2FjY291bnRzLWJhc2UnXG5cbmNvbnN0IEdldERvaU1haWxEYXRhU2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIG5hbWVfaWQ6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfSxcbiAgc2lnbmF0dXJlOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH1cbn0pO1xuXG5jb25zdCB1c2VyUHJvZmlsZVNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICBzdWJqZWN0OiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIG9wdGlvbmFsOnRydWVcbiAgfSxcbiAgcmVkaXJlY3Q6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgcmVnRXg6IFwiQChodHRwcz98ZnRwKTovLygtXFxcXC4pPyhbXlxcXFxzLz9cXFxcLiMtXStcXFxcLj8pKygvW15cXFxcc10qKT8kQFwiLFxuICAgIG9wdGlvbmFsOnRydWVcbiAgfSxcbiAgcmV0dXJuUGF0aDoge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICByZWdFeDogU2ltcGxlU2NoZW1hLlJlZ0V4LkVtYWlsLFxuICAgIG9wdGlvbmFsOnRydWVcbiAgfSxcbiAgdGVtcGxhdGVVUkw6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgcmVnRXg6IFwiQChodHRwcz98ZnRwKTovLygtXFxcXC4pPyhbXlxcXFxzLz9cXFxcLiMtXStcXFxcLj8pKygvW15cXFxcc10qKT8kQFwiLFxuICAgIG9wdGlvbmFsOnRydWVcbiAgfVxufSk7XG5cbmNvbnN0IGdldERvaU1haWxEYXRhID0gKGRhdGEpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBvdXJEYXRhID0gZGF0YTtcbiAgICBHZXREb2lNYWlsRGF0YVNjaGVtYS52YWxpZGF0ZShvdXJEYXRhKTtcbiAgICBjb25zdCBvcHRJbiA9IE9wdElucy5maW5kT25lKHtuYW1lSWQ6IG91ckRhdGEubmFtZV9pZH0pO1xuICAgIGlmKG9wdEluID09PSB1bmRlZmluZWQpIHRocm93IFwiT3B0LUluIHdpdGggbmFtZV9pZDogXCIrb3VyRGF0YS5uYW1lX2lkK1wiIG5vdCBmb3VuZFwiO1xuICAgIGxvZ1NlbmQoJ09wdC1JbiBmb3VuZCcsb3B0SW4pO1xuXG4gICAgY29uc3QgcmVjaXBpZW50ID0gUmVjaXBpZW50cy5maW5kT25lKHtfaWQ6IG9wdEluLnJlY2lwaWVudH0pO1xuICAgIGlmKHJlY2lwaWVudCA9PT0gdW5kZWZpbmVkKSB0aHJvdyBcIlJlY2lwaWVudCBub3QgZm91bmRcIjtcbiAgICBsb2dTZW5kKCdSZWNpcGllbnQgZm91bmQnLCByZWNpcGllbnQpO1xuXG4gICAgY29uc3QgcGFydHMgPSByZWNpcGllbnQuZW1haWwuc3BsaXQoXCJAXCIpO1xuICAgIGNvbnN0IGRvbWFpbiA9IHBhcnRzW3BhcnRzLmxlbmd0aC0xXTtcblxuICAgIGxldCBwdWJsaWNLZXkgPSBnZXRPcHRJbktleSh7IGRvbWFpbjogZG9tYWlufSk7XG5cbiAgICBpZighcHVibGljS2V5KXtcbiAgICAgIGNvbnN0IHByb3ZpZGVyID0gZ2V0T3B0SW5Qcm92aWRlcih7ZG9tYWluOiBvdXJEYXRhLmRvbWFpbiB9KTtcbiAgICAgIGxvZ1NlbmQoXCJ1c2luZyBkb2ljaGFpbiBwcm92aWRlciBpbnN0ZWFkIG9mIGRpcmVjdGx5IGNvbmZpZ3VyZWQgcHVibGljS2V5OlwiLCB7IHByb3ZpZGVyOiBwcm92aWRlciB9KTtcbiAgICAgIHB1YmxpY0tleSA9IGdldE9wdEluS2V5KHsgZG9tYWluOiBwcm92aWRlcn0pOyAvL2dldCBwdWJsaWMga2V5IGZyb20gcHJvdmlkZXIgb3IgZmFsbGJhY2sgaWYgcHVibGlja2V5IHdhcyBub3Qgc2V0IGluIGRuc1xuICAgIH1cblxuICAgIGxvZ1NlbmQoJ3F1ZXJpZWQgZGF0YTogKHBhcnRzLCBkb21haW4sIHByb3ZpZGVyLCBwdWJsaWNLZXkpJywgJygnK3BhcnRzKycsJytkb21haW4rJywnK3B1YmxpY0tleSsnKScpO1xuXG4gICAgLy9UT0RPOiBPbmx5IGFsbG93IGFjY2VzcyBvbmUgdGltZVxuICAgIC8vIFBvc3NpYmxlIHNvbHV0aW9uOlxuICAgIC8vIDEuIFByb3ZpZGVyIChjb25maXJtIGRBcHApIHJlcXVlc3QgdGhlIGRhdGFcbiAgICAvLyAyLiBQcm92aWRlciByZWNlaXZlIHRoZSBkYXRhXG4gICAgLy8gMy4gUHJvdmlkZXIgc2VuZHMgY29uZmlybWF0aW9uIFwiSSBnb3QgdGhlIGRhdGFcIlxuICAgIC8vIDQuIFNlbmQgZEFwcCBsb2NrIHRoZSBkYXRhIGZvciB0aGlzIG9wdCBpblxuICAgIGxvZ1NlbmQoJ3ZlcmlmeWluZyBzaWduYXR1cmUuLi4nKTtcbiAgICBpZighdmVyaWZ5U2lnbmF0dXJlKHtwdWJsaWNLZXk6IHB1YmxpY0tleSwgZGF0YTogb3VyRGF0YS5uYW1lX2lkLCBzaWduYXR1cmU6IG91ckRhdGEuc2lnbmF0dXJlfSkpIHtcbiAgICAgIHRocm93IFwic2lnbmF0dXJlIGluY29ycmVjdCAtIGFjY2VzcyBkZW5pZWRcIjtcbiAgICB9XG4gICAgXG4gICAgbG9nU2VuZCgnc2lnbmF0dXJlIHZlcmlmaWVkJyk7XG5cbiAgICAvL1RPRE86IFF1ZXJ5IGZvciBsYW5ndWFnZVxuICAgIGxldCBkb2lNYWlsRGF0YTtcbiAgICB0cnkge1xuXG4gICAgICBkb2lNYWlsRGF0YSA9IGdldEh0dHBHRVQoRE9JX01BSUxfRkVUQ0hfVVJMLCBcIlwiKS5kYXRhO1xuICAgICAgbGV0IGRlZmF1bHRSZXR1cm5EYXRhID0ge1xuICAgICAgICBcInJlY2lwaWVudFwiOiByZWNpcGllbnQuZW1haWwsXG4gICAgICAgIFwiY29udGVudFwiOiBkb2lNYWlsRGF0YS5kYXRhLmNvbnRlbnQsXG4gICAgICAgIFwicmVkaXJlY3RcIjogZG9pTWFpbERhdGEuZGF0YS5yZWRpcmVjdCxcbiAgICAgICAgXCJzdWJqZWN0XCI6IGRvaU1haWxEYXRhLmRhdGEuc3ViamVjdCxcbiAgICAgICAgXCJyZXR1cm5QYXRoXCI6IGRvaU1haWxEYXRhLmRhdGEucmV0dXJuUGF0aFxuICAgICAgfVxuXG4gICAgbGV0IHJldHVybkRhdGEgPSBkZWZhdWx0UmV0dXJuRGF0YTtcblxuICAgIHRyeXtcbiAgICAgIGxldCBvd25lciA9IEFjY291bnRzLnVzZXJzLmZpbmRPbmUoe19pZDogb3B0SW4ub3duZXJJZH0pO1xuICAgICAgbGV0IG1haWxUZW1wbGF0ZSA9IG93bmVyLnByb2ZpbGUubWFpbFRlbXBsYXRlO1xuICAgICAgdXNlclByb2ZpbGVTY2hlbWEudmFsaWRhdGUobWFpbFRlbXBsYXRlKTtcblxuICAgICAgcmV0dXJuRGF0YVtcInJlZGlyZWN0XCJdID0gbWFpbFRlbXBsYXRlW1wicmVkaXJlY3RcIl0gfHwgZGVmYXVsdFJldHVybkRhdGFbXCJyZWRpcmVjdFwiXTtcbiAgICAgIHJldHVybkRhdGFbXCJzdWJqZWN0XCJdID0gbWFpbFRlbXBsYXRlW1wic3ViamVjdFwiXSB8fCBkZWZhdWx0UmV0dXJuRGF0YVtcInN1YmplY3RcIl07XG4gICAgICByZXR1cm5EYXRhW1wicmV0dXJuUGF0aFwiXSA9IG1haWxUZW1wbGF0ZVtcInJldHVyblBhdGhcIl0gfHwgZGVmYXVsdFJldHVybkRhdGFbXCJyZXR1cm5QYXRoXCJdO1xuICAgICAgcmV0dXJuRGF0YVtcImNvbnRlbnRcIl0gPSBtYWlsVGVtcGxhdGVbXCJ0ZW1wbGF0ZVVSTFwiXSA/IChnZXRIdHRwR0VUKG1haWxUZW1wbGF0ZVtcInRlbXBsYXRlVVJMXCJdLCBcIlwiKS5jb250ZW50IHx8IGRlZmF1bHRSZXR1cm5EYXRhW1wiY29udGVudFwiXSkgOiBkZWZhdWx0UmV0dXJuRGF0YVtcImNvbnRlbnRcIl07XG4gICAgICBcbiAgICB9XG4gICAgY2F0Y2goZXJyb3IpIHtcbiAgICAgIHJldHVybkRhdGE9ZGVmYXVsdFJldHVybkRhdGE7XG4gICAgfVxuXG4gICAgICBsb2dTZW5kKCdkb2lNYWlsRGF0YSBhbmQgdXJsOicsIERPSV9NQUlMX0ZFVENIX1VSTCwgcmV0dXJuRGF0YSk7XG5cbiAgICAgIHJldHVybiByZXR1cm5EYXRhXG5cbiAgICB9IGNhdGNoKGVycm9yKSB7XG4gICAgICB0aHJvdyBcIkVycm9yIHdoaWxlIGZldGNoaW5nIG1haWwgY29udGVudDogXCIrZXJyb3I7XG4gICAgfVxuXG4gIH0gY2F0Y2goZXhjZXB0aW9uKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZGFwcHMuZ2V0RG9pTWFpbERhdGEuZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgZ2V0RG9pTWFpbERhdGE7XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcbmltcG9ydCB7IHJlc29sdmVUeHQgfSBmcm9tICcuLi8uLi8uLi8uLi9zZXJ2ZXIvYXBpL2Rucy5qcyc7XG5pbXBvcnQgeyBGQUxMQkFDS19QUk9WSURFUiB9IGZyb20gJy4uLy4uLy4uL3N0YXJ0dXAvc2VydmVyL2Rucy1jb25maWd1cmF0aW9uLmpzJztcbmltcG9ydCB7aXNSZWd0ZXN0LCBpc1Rlc3RuZXR9IGZyb20gXCIuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9kYXBwLWNvbmZpZ3VyYXRpb25cIjtcbmltcG9ydCB7bG9nU2VuZH0gZnJvbSBcIi4uLy4uLy4uL3N0YXJ0dXAvc2VydmVyL2xvZy1jb25maWd1cmF0aW9uXCI7XG5cbmNvbnN0IE9QVF9JTl9LRVkgPSBcImRvaWNoYWluLW9wdC1pbi1rZXlcIjtcbmNvbnN0IE9QVF9JTl9LRVlfVEVTVE5FVCA9IFwiZG9pY2hhaW4tdGVzdG5ldC1vcHQtaW4ta2V5XCI7XG5cbmNvbnN0IEdldE9wdEluS2V5U2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIGRvbWFpbjoge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9XG59KTtcblxuXG5jb25zdCBnZXRPcHRJbktleSA9IChkYXRhKSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3Qgb3VyRGF0YSA9IGRhdGE7XG4gICAgR2V0T3B0SW5LZXlTY2hlbWEudmFsaWRhdGUob3VyRGF0YSk7XG5cbiAgICBsZXQgb3VyT1BUX0lOX0tFWT1PUFRfSU5fS0VZO1xuXG4gICAgaWYoaXNSZWd0ZXN0KCkgfHwgaXNUZXN0bmV0KCkpe1xuICAgICAgICBvdXJPUFRfSU5fS0VZID0gT1BUX0lOX0tFWV9URVNUTkVUO1xuICAgICAgICBsb2dTZW5kKCdVc2luZyBSZWdUZXN0OicraXNSZWd0ZXN0KCkrXCIgVGVzdG5ldDogXCIraXNUZXN0bmV0KCkrXCIgb3VyT1BUX0lOX0tFWVwiLG91ck9QVF9JTl9LRVkpO1xuICAgIH1cbiAgICBjb25zdCBrZXkgPSByZXNvbHZlVHh0KG91ck9QVF9JTl9LRVksIG91ckRhdGEuZG9tYWluKTtcbiAgICBsb2dTZW5kKCdETlMgVFhUIGNvbmZpZ3VyZWQgcHVibGljIGtleSBvZiByZWNpcGllbnQgZW1haWwgZG9tYWluIGFuZCBjb25maXJtYXRpb24gZGFwcCcse2ZvdW5kS2V5OmtleSwgZG9tYWluOm91ckRhdGEuZG9tYWluLCBkbnNrZXk6b3VyT1BUX0lOX0tFWX0pO1xuXG4gICAgaWYoa2V5ID09PSB1bmRlZmluZWQpIHJldHVybiB1c2VGYWxsYmFjayhvdXJEYXRhLmRvbWFpbik7XG4gICAgcmV0dXJuIGtleTtcbiAgfSBjYXRjaCAoZXhjZXB0aW9uKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZG5zLmdldE9wdEluS2V5LmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH1cbn07XG5cbmNvbnN0IHVzZUZhbGxiYWNrID0gKGRvbWFpbikgPT4ge1xuICBpZihkb21haW4gPT09IEZBTExCQUNLX1BST1ZJREVSKSB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFwiRmFsbGJhY2sgaGFzIG5vIGtleSBkZWZpbmVkIVwiKTtcbiAgICBsb2dTZW5kKFwiS2V5IG5vdCBkZWZpbmVkLiBVc2luZyBmYWxsYmFjazogXCIsRkFMTEJBQ0tfUFJPVklERVIpO1xuICByZXR1cm4gZ2V0T3B0SW5LZXkoe2RvbWFpbjogRkFMTEJBQ0tfUFJPVklERVJ9KTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGdldE9wdEluS2V5O1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XG5pbXBvcnQgeyByZXNvbHZlVHh0IH0gZnJvbSAnLi4vLi4vLi4vLi4vc2VydmVyL2FwaS9kbnMuanMnO1xuaW1wb3J0IHsgRkFMTEJBQ0tfUFJPVklERVIgfSBmcm9tICcuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9kbnMtY29uZmlndXJhdGlvbi5qcyc7XG5pbXBvcnQge2xvZ1NlbmR9IGZyb20gXCIuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9sb2ctY29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHtpc1JlZ3Rlc3QsIGlzVGVzdG5ldH0gZnJvbSBcIi4uLy4uLy4uL3N0YXJ0dXAvc2VydmVyL2RhcHAtY29uZmlndXJhdGlvblwiO1xuXG5jb25zdCBQUk9WSURFUl9LRVkgPSBcImRvaWNoYWluLW9wdC1pbi1wcm92aWRlclwiO1xuY29uc3QgUFJPVklERVJfS0VZX1RFU1RORVQgPSBcImRvaWNoYWluLXRlc3RuZXQtb3B0LWluLXByb3ZpZGVyXCI7XG5cbmNvbnN0IEdldE9wdEluUHJvdmlkZXJTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgZG9tYWluOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH1cbn0pO1xuXG5cbmNvbnN0IGdldE9wdEluUHJvdmlkZXIgPSAoZGF0YSkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IG91ckRhdGEgPSBkYXRhO1xuICAgIEdldE9wdEluUHJvdmlkZXJTY2hlbWEudmFsaWRhdGUob3VyRGF0YSk7XG5cbiAgICBsZXQgb3VyUFJPVklERVJfS0VZPVBST1ZJREVSX0tFWTtcbiAgICBpZihpc1JlZ3Rlc3QoKSB8fCBpc1Rlc3RuZXQoKSl7XG4gICAgICAgIG91clBST1ZJREVSX0tFWSA9IFBST1ZJREVSX0tFWV9URVNUTkVUO1xuICAgICAgICBsb2dTZW5kKCdVc2luZyBSZWdUZXN0OicraXNSZWd0ZXN0KCkrXCIgOiBUZXN0bmV0OlwiK2lzVGVzdG5ldCgpK1wiIFBST1ZJREVSX0tFWVwiLHtwcm92aWRlcktleTpvdXJQUk9WSURFUl9LRVksIGRvbWFpbjpvdXJEYXRhLmRvbWFpbn0pO1xuICAgIH1cblxuICAgIGNvbnN0IHByb3ZpZGVyID0gcmVzb2x2ZVR4dChvdXJQUk9WSURFUl9LRVksIG91ckRhdGEuZG9tYWluKTtcbiAgICBpZihwcm92aWRlciA9PT0gdW5kZWZpbmVkKSByZXR1cm4gdXNlRmFsbGJhY2soKTtcblxuICAgIGxvZ1NlbmQoJ29wdC1pbi1wcm92aWRlciBmcm9tIGRucyAtIHNlcnZlciBvZiBtYWlsIHJlY2lwaWVudDogKFRYVCk6Jyxwcm92aWRlcik7XG4gICAgcmV0dXJuIHByb3ZpZGVyO1xuICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdkbnMuZ2V0T3B0SW5Qcm92aWRlci5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9XG59O1xuXG5jb25zdCB1c2VGYWxsYmFjayA9ICgpID0+IHtcbiAgbG9nU2VuZCgnUHJvdmlkZXIgbm90IGRlZmluZWQuIEZhbGxiYWNrICcrRkFMTEJBQ0tfUFJPVklERVIrJyBpcyB1c2VkJyk7XG4gIHJldHVybiBGQUxMQkFDS19QUk9WSURFUjtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGdldE9wdEluUHJvdmlkZXI7XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcbmltcG9ydCB7IENPTkZJUk1fQ0xJRU5ULCBDT05GSVJNX0FERFJFU1MgfSBmcm9tICcuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9kb2ljaGFpbi1jb25maWd1cmF0aW9uLmpzJztcbmltcG9ydCB7IGdldFdpZiB9IGZyb20gJy4uLy4uLy4uLy4uL3NlcnZlci9hcGkvZG9pY2hhaW4uanMnO1xuaW1wb3J0IHsgRG9pY2hhaW5FbnRyaWVzIH0gZnJvbSAnLi4vLi4vLi4vYXBpL2RvaWNoYWluL2VudHJpZXMuanMnO1xuaW1wb3J0IGFkZEZldGNoRG9pTWFpbERhdGFKb2IgZnJvbSAnLi4vam9icy9hZGRfZmV0Y2gtZG9pLW1haWwtZGF0YS5qcyc7XG5pbXBvcnQgZ2V0UHJpdmF0ZUtleUZyb21XaWYgZnJvbSAnLi9nZXRfcHJpdmF0ZS1rZXlfZnJvbV93aWYuanMnO1xuaW1wb3J0IGRlY3J5cHRNZXNzYWdlIGZyb20gJy4vZGVjcnlwdF9tZXNzYWdlLmpzJztcbmltcG9ydCB7bG9nQ29uZmlybSwgbG9nU2VuZH0gZnJvbSBcIi4uLy4uLy4uL3N0YXJ0dXAvc2VydmVyL2xvZy1jb25maWd1cmF0aW9uXCI7XG5cbmNvbnN0IEFkZERvaWNoYWluRW50cnlTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgbmFtZToge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9LFxuICB2YWx1ZToge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9LFxuICBhZGRyZXNzOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH0sXG4gIHR4SWQ6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfVxufSk7XG5cbi8qKlxuICogSW5zZXJ0c1xuICpcbiAqIEBwYXJhbSBlbnRyeVxuICogQHJldHVybnMgeyp9XG4gKi9cbmNvbnN0IGFkZERvaWNoYWluRW50cnkgPSAoZW50cnkpID0+IHtcbiAgdHJ5IHtcblxuICAgIGNvbnN0IG91ckVudHJ5ID0gZW50cnk7XG4gICAgbG9nQ29uZmlybSgnYWRkaW5nIERvaWNoYWluRW50cnkgb24gQm9iLi4uJyxvdXJFbnRyeS5uYW1lKTtcbiAgICBBZGREb2ljaGFpbkVudHJ5U2NoZW1hLnZhbGlkYXRlKG91ckVudHJ5KTtcblxuICAgIGNvbnN0IGV0eSA9IERvaWNoYWluRW50cmllcy5maW5kT25lKHtuYW1lOiBvdXJFbnRyeS5uYW1lfSk7XG4gICAgaWYoZXR5ICE9PSB1bmRlZmluZWQpe1xuICAgICAgICBsb2dTZW5kKCdyZXR1cm5pbmcgbG9jYWxseSBzYXZlZCBlbnRyeSB3aXRoIF9pZDonK2V0eS5faWQpO1xuICAgICAgICByZXR1cm4gZXR5Ll9pZDtcbiAgICB9XG5cbiAgICBjb25zdCB2YWx1ZSA9IEpTT04ucGFyc2Uob3VyRW50cnkudmFsdWUpO1xuICAgIC8vbG9nU2VuZChcInZhbHVlOlwiLHZhbHVlKTtcbiAgICBpZih2YWx1ZS5mcm9tID09PSB1bmRlZmluZWQpIHRocm93IFwiV3JvbmcgYmxvY2tjaGFpbiBlbnRyeVwiOyAvL1RPRE8gaWYgZnJvbSBpcyBtaXNzaW5nIGJ1dCB2YWx1ZSBpcyB0aGVyZSwgaXQgaXMgcHJvYmFibHkgYWxscmVhZHkgaGFuZGVsZWQgY29ycmVjdGx5IGFueXdheXMgdGhpcyBpcyBub3Qgc28gY29vbCBhcyBpdCBzZWVtcy5cbiAgICBjb25zdCB3aWYgPSBnZXRXaWYoQ09ORklSTV9DTElFTlQsIENPTkZJUk1fQUREUkVTUyk7XG4gICAgY29uc3QgcHJpdmF0ZUtleSA9IGdldFByaXZhdGVLZXlGcm9tV2lmKHt3aWY6IHdpZn0pO1xuICAgIGxvZ1NlbmQoJ2dvdCBwcml2YXRlIGtleSAod2lsbCBub3Qgc2hvdyBpdCBoZXJlKScpO1xuXG4gICAgY29uc3QgZG9tYWluID0gZGVjcnlwdE1lc3NhZ2Uoe3ByaXZhdGVLZXk6IHByaXZhdGVLZXksIG1lc3NhZ2U6IHZhbHVlLmZyb219KTtcbiAgICBsb2dTZW5kKCdkZWNyeXB0ZWQgbWVzc2FnZSBmcm9tIGRvbWFpbjogJyxkb21haW4pO1xuXG4gICAgY29uc3QgbmFtZVBvcyA9IG91ckVudHJ5Lm5hbWUuaW5kZXhPZignLScpOyAvL2lmIHRoaXMgaXMgbm90IGEgY28tcmVnaXN0cmF0aW9uIGZldGNoIG1haWwuXG4gICAgbG9nU2VuZCgnbmFtZVBvczonLG5hbWVQb3MpO1xuICAgIGNvbnN0IG1hc3RlckRvaSA9IChuYW1lUG9zIT0tMSk/b3VyRW50cnkubmFtZS5zdWJzdHJpbmcoMCxuYW1lUG9zKTp1bmRlZmluZWQ7XG4gICAgbG9nU2VuZCgnbWFzdGVyRG9pOicsbWFzdGVyRG9pKTtcbiAgICBjb25zdCBpbmRleCA9IG1hc3RlckRvaT9vdXJFbnRyeS5uYW1lLnN1YnN0cmluZyhuYW1lUG9zKzEpOnVuZGVmaW5lZDtcbiAgICBsb2dTZW5kKCdpbmRleDonLGluZGV4KTtcblxuICAgIGNvbnN0IGlkID0gRG9pY2hhaW5FbnRyaWVzLmluc2VydCh7XG4gICAgICAgIG5hbWU6IG91ckVudHJ5Lm5hbWUsXG4gICAgICAgIHZhbHVlOiBvdXJFbnRyeS52YWx1ZSxcbiAgICAgICAgYWRkcmVzczogb3VyRW50cnkuYWRkcmVzcyxcbiAgICAgICAgbWFzdGVyRG9pOiBtYXN0ZXJEb2ksXG4gICAgICAgIGluZGV4OiBpbmRleCxcbiAgICAgICAgdHhJZDogb3VyRW50cnkudHhJZCxcbiAgICAgICAgZXhwaXJlc0luOiBvdXJFbnRyeS5leHBpcmVzSW4sXG4gICAgICAgIGV4cGlyZWQ6IG91ckVudHJ5LmV4cGlyZWRcbiAgICB9KTtcblxuICAgIGxvZ1NlbmQoJ0RvaWNoYWluRW50cnkgYWRkZWQgb24gQm9iOicsIHtpZDppZCxuYW1lOm91ckVudHJ5Lm5hbWUsbWFzdGVyRG9pOm1hc3RlckRvaSxpbmRleDppbmRleH0pO1xuXG4gICAgaWYoIW1hc3RlckRvaSl7XG4gICAgICAgIGFkZEZldGNoRG9pTWFpbERhdGFKb2Ioe1xuICAgICAgICAgICAgbmFtZTogb3VyRW50cnkubmFtZSxcbiAgICAgICAgICAgIGRvbWFpbjogZG9tYWluXG4gICAgICAgIH0pO1xuICAgICAgICBsb2dTZW5kKCdOZXcgZW50cnkgYWRkZWQ6IFxcbicrXG4gICAgICAgICAgICAnTmFtZUlkPScrb3VyRW50cnkubmFtZStcIlxcblwiK1xuICAgICAgICAgICAgJ0FkZHJlc3M9JytvdXJFbnRyeS5hZGRyZXNzK1wiXFxuXCIrXG4gICAgICAgICAgICAnVHhJZD0nK291ckVudHJ5LnR4SWQrXCJcXG5cIitcbiAgICAgICAgICAgICdWYWx1ZT0nK291ckVudHJ5LnZhbHVlKTtcblxuICAgIH1lbHNle1xuICAgICAgICBsb2dTZW5kKCdUaGlzIHRyYW5zYWN0aW9uIGJlbG9uZ3MgdG8gY28tcmVnaXN0cmF0aW9uJywgbWFzdGVyRG9pKTtcbiAgICB9XG5cbiAgICByZXR1cm4gaWQ7XG4gIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2RvaWNoYWluLmFkZEVudHJ5QW5kRmV0Y2hEYXRhLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGFkZERvaWNoYWluRW50cnk7XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCB7IGxpc3RTaW5jZUJsb2NrLCBuYW1lU2hvdywgZ2V0UmF3VHJhbnNhY3Rpb259IGZyb20gJy4uLy4uLy4uLy4uL3NlcnZlci9hcGkvZG9pY2hhaW4uanMnO1xuaW1wb3J0IHsgQ09ORklSTV9DTElFTlQsIENPTkZJUk1fQUREUkVTUyB9IGZyb20gJy4uLy4uLy4uL3N0YXJ0dXAvc2VydmVyL2RvaWNoYWluLWNvbmZpZ3VyYXRpb24uanMnO1xuaW1wb3J0IGFkZERvaWNoYWluRW50cnkgZnJvbSAnLi9hZGRfZW50cnlfYW5kX2ZldGNoX2RhdGEuanMnXG5pbXBvcnQgeyBNZXRhIH0gZnJvbSAnLi4vLi4vLi4vYXBpL21ldGEvbWV0YS5qcyc7XG5pbXBvcnQgYWRkT3JVcGRhdGVNZXRhIGZyb20gJy4uL21ldGEvYWRkT3JVcGRhdGUuanMnO1xuaW1wb3J0IHtsb2dDb25maXJtfSBmcm9tIFwiLi4vLi4vLi4vc3RhcnR1cC9zZXJ2ZXIvbG9nLWNvbmZpZ3VyYXRpb25cIjtcblxuY29uc3QgVFhfTkFNRV9TVEFSVCA9IFwiZS9cIjtcbmNvbnN0IExBU1RfQ0hFQ0tFRF9CTE9DS19LRVkgPSBcImxhc3RDaGVja2VkQmxvY2tcIjtcblxuY29uc3QgY2hlY2tOZXdUcmFuc2FjdGlvbiA9ICh0eGlkLCBqb2IpID0+IHtcbiAgdHJ5IHtcblxuICAgICAgaWYoIXR4aWQpe1xuICAgICAgICAgIGxvZ0NvbmZpcm0oXCJjaGVja05ld1RyYW5zYWN0aW9uIHRyaWdnZXJlZCB3aGVuIHN0YXJ0aW5nIG5vZGUgLSBjaGVja2luZyBhbGwgY29uZmlybWVkIGJsb2NrcyBzaW5jZSBsYXN0IGNoZWNrIGZvciBkb2ljaGFpbiBhZGRyZXNzXCIsQ09ORklSTV9BRERSRVNTKTtcblxuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIHZhciBsYXN0Q2hlY2tlZEJsb2NrID0gTWV0YS5maW5kT25lKHtrZXk6IExBU1RfQ0hFQ0tFRF9CTE9DS19LRVl9KTtcbiAgICAgICAgICAgICAgaWYobGFzdENoZWNrZWRCbG9jayAhPT0gdW5kZWZpbmVkKSBsYXN0Q2hlY2tlZEJsb2NrID0gbGFzdENoZWNrZWRCbG9jay52YWx1ZTtcbiAgICAgICAgICAgICAgbG9nQ29uZmlybShcImxhc3RDaGVja2VkQmxvY2tcIixsYXN0Q2hlY2tlZEJsb2NrKTtcbiAgICAgICAgICAgICAgY29uc3QgcmV0ID0gbGlzdFNpbmNlQmxvY2soQ09ORklSTV9DTElFTlQsIGxhc3RDaGVja2VkQmxvY2spO1xuICAgICAgICAgICAgICBpZihyZXQgPT09IHVuZGVmaW5lZCB8fCByZXQudHJhbnNhY3Rpb25zID09PSB1bmRlZmluZWQpIHJldHVybjtcblxuICAgICAgICAgICAgICBjb25zdCB0eHMgPSByZXQudHJhbnNhY3Rpb25zO1xuICAgICAgICAgICAgICBsYXN0Q2hlY2tlZEJsb2NrID0gcmV0Lmxhc3RibG9jaztcbiAgICAgICAgICAgICAgaWYoIXJldCB8fCAhdHhzIHx8ICF0eHMubGVuZ3RoPT09MCl7XG4gICAgICAgICAgICAgICAgICBsb2dDb25maXJtKFwidHJhbnNhY3Rpb25zIGRvIG5vdCBjb250YWluIG5hbWVPcCB0cmFuc2FjdGlvbiBkZXRhaWxzIG9yIHRyYW5zYWN0aW9uIG5vdCBmb3VuZC5cIiwgbGFzdENoZWNrZWRCbG9jayk7XG4gICAgICAgICAgICAgICAgICBhZGRPclVwZGF0ZU1ldGEoe2tleTogTEFTVF9DSEVDS0VEX0JMT0NLX0tFWSwgdmFsdWU6IGxhc3RDaGVja2VkQmxvY2t9KTtcbiAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIGxvZ0NvbmZpcm0oXCJsaXN0U2luY2VCbG9ja1wiLHJldCk7XG5cbiAgICAgICAgICAgICAgY29uc3QgYWRkcmVzc1R4cyA9IHR4cy5maWx0ZXIodHggPT5cbiAgICAgICAgICAgICAgICAgIHR4LmFkZHJlc3MgPT09IENPTkZJUk1fQUREUkVTU1xuICAgICAgICAgICAgICAgICAgJiYgdHgubmFtZSAhPT0gdW5kZWZpbmVkIC8vc2luY2UgbmFtZV9zaG93IGNhbm5vdCBiZSByZWFkIHdpdGhvdXQgY29uZmlybWF0aW9uc1xuICAgICAgICAgICAgICAgICAgJiYgdHgubmFtZS5zdGFydHNXaXRoKFwiZG9pOiBcIitUWF9OQU1FX1NUQVJUKSAgLy9oZXJlICdkb2k6IGUveHh4eCcgaXMgYWxyZWFkeSB3cml0dGVuIGluIHRoZSBibG9ja1xuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICBhZGRyZXNzVHhzLmZvckVhY2godHggPT4ge1xuICAgICAgICAgICAgICAgICAgbG9nQ29uZmlybShcInR4OlwiLHR4KTtcbiAgICAgICAgICAgICAgICAgIHZhciB0eE5hbWUgPSB0eC5uYW1lLnN1YnN0cmluZygoXCJkb2k6IFwiK1RYX05BTUVfU1RBUlQpLmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgICBsb2dDb25maXJtKFwiZXhjdXRpbmcgbmFtZV9zaG93IGluIG9yZGVyIHRvIGdldCB2YWx1ZSBvZiBuYW1lSWQ6XCIsIHR4TmFtZSk7XG4gICAgICAgICAgICAgICAgICBjb25zdCBldHkgPSBuYW1lU2hvdyhDT05GSVJNX0NMSUVOVCwgdHhOYW1lKTtcbiAgICAgICAgICAgICAgICAgIGxvZ0NvbmZpcm0oXCJuYW1lU2hvdzogdmFsdWVcIixldHkpO1xuICAgICAgICAgICAgICAgICAgaWYoIWV0eSl7XG4gICAgICAgICAgICAgICAgICAgICAgbG9nQ29uZmlybShcImNvdWxkbid0IGZpbmQgbmFtZSAtIG9idmlvdXNseSBub3QgKHlldD8hKSBjb25maXJtZWQgaW4gYmxvY2tjaGFpbjpcIiwgZXR5KTtcbiAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICBhZGRUeCh0eE5hbWUsIGV0eS52YWx1ZSx0eC5hZGRyZXNzLHR4LnR4aWQpOyAvL1RPRE8gZXR5LnZhbHVlLmZyb20gaXMgbWF5YmUgTk9UIGV4aXN0aW5nIGJlY2F1c2Ugb2YgdGhpcyBpdHMgIChtYXliZSkgb250IHdvcmtpbmcuLi5cbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIGFkZE9yVXBkYXRlTWV0YSh7a2V5OiBMQVNUX0NIRUNLRURfQkxPQ0tfS0VZLCB2YWx1ZTogbGFzdENoZWNrZWRCbG9ja30pO1xuICAgICAgICAgICAgICBsb2dDb25maXJtKFwiVHJhbnNhY3Rpb25zIHVwZGF0ZWQgLSBsYXN0Q2hlY2tlZEJsb2NrOlwiLGxhc3RDaGVja2VkQmxvY2spO1xuICAgICAgICAgICAgICBqb2IuZG9uZSgpO1xuICAgICAgICAgIH0gY2F0Y2goZXhjZXB0aW9uKSB7XG4gICAgICAgICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ25hbWVjb2luLmNoZWNrTmV3VHJhbnNhY3Rpb25zLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gICAgICAgICAgfVxuXG4gICAgICB9ZWxzZXtcbiAgICAgICAgICBsb2dDb25maXJtKFwidHhpZDogXCIrdHhpZCtcIiB3YXMgdHJpZ2dlcmVkIGJ5IHdhbGxldG5vdGlmeSBmb3IgYWRkcmVzczpcIixDT05GSVJNX0FERFJFU1MpO1xuXG4gICAgICAgICAgY29uc3QgcmV0ID0gZ2V0UmF3VHJhbnNhY3Rpb24oQ09ORklSTV9DTElFTlQsIHR4aWQpO1xuICAgICAgICAgIGNvbnN0IHR4cyA9IHJldC52b3V0O1xuXG4gICAgICAgICAgaWYoIXJldCB8fCAhdHhzIHx8ICF0eHMubGVuZ3RoPT09MCl7XG4gICAgICAgICAgICAgIGxvZ0NvbmZpcm0oXCJ0eGlkIFwiK3R4aWQrJyBkb2VzIG5vdCBjb250YWluIHRyYW5zYWN0aW9uIGRldGFpbHMgb3IgdHJhbnNhY3Rpb24gbm90IGZvdW5kLicpO1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgLy8gbG9nQ29uZmlybSgnbm93IGNoZWNraW5nIHJhdyB0cmFuc2FjdGlvbnMgd2l0aCBmaWx0ZXI6Jyx0eHMpO1xuXG4gICAgICAgICAgY29uc3QgYWRkcmVzc1R4cyA9IHR4cy5maWx0ZXIodHggPT5cbiAgICAgICAgICAgICAgdHguc2NyaXB0UHViS2V5ICE9PSB1bmRlZmluZWRcbiAgICAgICAgICAgICAgJiYgdHguc2NyaXB0UHViS2V5Lm5hbWVPcCAhPT0gdW5kZWZpbmVkXG4gICAgICAgICAgICAgICYmIHR4LnNjcmlwdFB1YktleS5uYW1lT3Aub3AgPT09IFwibmFtZV9kb2lcIlxuICAgICAgICAgICAgLy8gICYmIHR4LnNjcmlwdFB1YktleS5hZGRyZXNzZXNbMF0gPT09IENPTkZJUk1fQUREUkVTUyAvL29ubHkgb3duIHRyYW5zYWN0aW9uIHNob3VsZCBhcnJpdmUgaGVyZS4gLSBzbyBjaGVjayBvbiBvd24gYWRkcmVzcyB1bm5lY2Nlc2FyeVxuICAgICAgICAgICAgICAmJiB0eC5zY3JpcHRQdWJLZXkubmFtZU9wLm5hbWUgIT09IHVuZGVmaW5lZFxuICAgICAgICAgICAgICAmJiB0eC5zY3JpcHRQdWJLZXkubmFtZU9wLm5hbWUuc3RhcnRzV2l0aChUWF9OQU1FX1NUQVJUKVxuICAgICAgICAgICk7XG5cbiAgICAgICAgICAvL2xvZ0NvbmZpcm0oXCJmb3VuZCBuYW1lX29wIHRyYW5zYWN0aW9uczpcIiwgYWRkcmVzc1R4cyk7XG4gICAgICAgICAgYWRkcmVzc1R4cy5mb3JFYWNoKHR4ID0+IHtcbiAgICAgICAgICAgICAgYWRkVHgodHguc2NyaXB0UHViS2V5Lm5hbWVPcC5uYW1lLCB0eC5zY3JpcHRQdWJLZXkubmFtZU9wLnZhbHVlLHR4LnNjcmlwdFB1YktleS5hZGRyZXNzZXNbMF0sdHhpZCk7XG4gICAgICAgICAgfSk7XG4gICAgICB9XG4gIH0gY2F0Y2goZXhjZXB0aW9uKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZG9pY2hhaW4uY2hlY2tOZXdUcmFuc2FjdGlvbnMuZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn07XG5cblxuZnVuY3Rpb24gYWRkVHgobmFtZSwgdmFsdWUsIGFkZHJlc3MsIHR4aWQpIHtcbiAgICBjb25zdCB0eE5hbWUgPSBuYW1lLnN1YnN0cmluZyhUWF9OQU1FX1NUQVJULmxlbmd0aCk7XG5cbiAgICBhZGREb2ljaGFpbkVudHJ5KHtcbiAgICAgICAgbmFtZTogdHhOYW1lLFxuICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgIGFkZHJlc3M6IGFkZHJlc3MsXG4gICAgICAgIHR4SWQ6IHR4aWRcbiAgICB9KTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2hlY2tOZXdUcmFuc2FjdGlvbjtcblxuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XG5pbXBvcnQgY3J5cHRvIGZyb20gJ2NyeXB0byc7XG5pbXBvcnQgZWNpZXMgZnJvbSAnc3RhbmRhcmQtZWNpZXMnO1xuXG5jb25zdCBEZWNyeXB0TWVzc2FnZVNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICBwcml2YXRlS2V5OiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH0sXG4gIG1lc3NhZ2U6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfVxufSk7XG5cbmNvbnN0IGRlY3J5cHRNZXNzYWdlID0gKGRhdGEpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBvdXJEYXRhID0gZGF0YTtcbiAgICBEZWNyeXB0TWVzc2FnZVNjaGVtYS52YWxpZGF0ZShvdXJEYXRhKTtcbiAgICBjb25zdCBwcml2YXRlS2V5ID0gQnVmZmVyLmZyb20ob3VyRGF0YS5wcml2YXRlS2V5LCAnaGV4Jyk7XG4gICAgY29uc3QgZWNkaCA9IGNyeXB0by5jcmVhdGVFQ0RIKCdzZWNwMjU2azEnKTtcbiAgICBlY2RoLnNldFByaXZhdGVLZXkocHJpdmF0ZUtleSk7XG4gICAgY29uc3QgbWVzc2FnZSA9IEJ1ZmZlci5mcm9tKG91ckRhdGEubWVzc2FnZSwgJ2hleCcpO1xuICAgIHJldHVybiBlY2llcy5kZWNyeXB0KGVjZGgsIG1lc3NhZ2UpLnRvU3RyaW5nKCd1dGY4Jyk7XG4gIH0gY2F0Y2goZXhjZXB0aW9uKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZG9pY2hhaW4uZGVjcnlwdE1lc3NhZ2UuZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgZGVjcnlwdE1lc3NhZ2U7XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcbmltcG9ydCBlY2llcyBmcm9tICdzdGFuZGFyZC1lY2llcyc7XG5cbmNvbnN0IEVuY3J5cHRNZXNzYWdlU2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIHB1YmxpY0tleToge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9LFxuICBtZXNzYWdlOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH1cbn0pO1xuXG5jb25zdCBlbmNyeXB0TWVzc2FnZSA9IChkYXRhKSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3Qgb3VyRGF0YSA9IGRhdGE7XG4gICAgRW5jcnlwdE1lc3NhZ2VTY2hlbWEudmFsaWRhdGUob3VyRGF0YSk7XG4gICAgY29uc3QgcHVibGljS2V5ID0gQnVmZmVyLmZyb20ob3VyRGF0YS5wdWJsaWNLZXksICdoZXgnKTtcbiAgICBjb25zdCBtZXNzYWdlID0gQnVmZmVyLmZyb20ob3VyRGF0YS5tZXNzYWdlKTtcbiAgICByZXR1cm4gZWNpZXMuZW5jcnlwdChwdWJsaWNLZXksIG1lc3NhZ2UpLnRvU3RyaW5nKCdoZXgnKTtcbiAgfSBjYXRjaChleGNlcHRpb24pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdkb2ljaGFpbi5lbmNyeXB0TWVzc2FnZS5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBlbmNyeXB0TWVzc2FnZTtcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tICdzaW1wbC1zY2hlbWEnO1xuaW1wb3J0IHsgT3B0SW5zIH0gZnJvbSAnLi4vLi4vLi4vYXBpL29wdC1pbnMvb3B0LWlucy5qcyc7XG5pbXBvcnQgZ2V0S2V5UGFpciBmcm9tICcuL2dldF9rZXktcGFpci5qcyc7XG5pbXBvcnQge2xvZ1NlbmR9IGZyb20gXCIuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9sb2ctY29uZmlndXJhdGlvblwiO1xuXG5jb25zdCBHZW5lcmF0ZU5hbWVJZFNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICBpZDoge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9LFxuICBtYXN0ZXJEb2k6IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIG9wdGlvbmFsOiB0cnVlXG4gIH0sXG4gIGluZGV4OiB7XG4gICAgICB0eXBlOiBTaW1wbGVTY2hlbWEuSW50ZWdlcixcbiAgICAgIG9wdGlvbmFsOiB0cnVlXG4gIH1cbn0pO1xuXG5jb25zdCBnZW5lcmF0ZU5hbWVJZCA9IChvcHRJbikgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IG91ck9wdEluID0gb3B0SW47XG4gICAgR2VuZXJhdGVOYW1lSWRTY2hlbWEudmFsaWRhdGUob3VyT3B0SW4pO1xuICAgIGxldCBuYW1lSWQ7XG4gICAgaWYob3B0SW4ubWFzdGVyRG9pKXtcbiAgICAgICAgbmFtZUlkID0gb3VyT3B0SW4ubWFzdGVyRG9pK1wiLVwiK291ck9wdEluLmluZGV4O1xuICAgICAgICBsb2dTZW5kKFwidXNlZCBtYXN0ZXJfZG9pIGFzIG5hbWVJZCBpbmRleCBcIitvcHRJbi5pbmRleCtcInN0b3JhZ2U6XCIsbmFtZUlkKTtcbiAgICB9XG4gICAgZWxzZXtcbiAgICAgICAgbmFtZUlkID0gZ2V0S2V5UGFpcigpLnByaXZhdGVLZXk7XG4gICAgICAgIGxvZ1NlbmQoXCJnZW5lcmF0ZWQgbmFtZUlkIGZvciBkb2ljaGFpbiBzdG9yYWdlOlwiLG5hbWVJZCk7XG4gICAgfVxuXG4gICAgT3B0SW5zLnVwZGF0ZSh7X2lkIDogb3VyT3B0SW4uaWR9LCB7JHNldDp7bmFtZUlkOiBuYW1lSWR9fSk7XG5cbiAgICByZXR1cm4gbmFtZUlkO1xuICB9IGNhdGNoKGV4Y2VwdGlvbikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2RvaWNoYWluLmdlbmVyYXRlTmFtZUlkLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGdlbmVyYXRlTmFtZUlkO1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XG5pbXBvcnQgQ3J5cHRvSlMgZnJvbSAnY3J5cHRvLWpzJztcbmltcG9ydCBCYXNlNTggZnJvbSAnYnM1OCc7XG5pbXBvcnQgeyBpc1JlZ3Rlc3QgfSBmcm9tICcuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9kYXBwLWNvbmZpZ3VyYXRpb24uanMnO1xuaW1wb3J0IHtpc1Rlc3RuZXR9IGZyb20gXCIuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9kYXBwLWNvbmZpZ3VyYXRpb25cIjtcblxuY29uc3QgVkVSU0lPTl9CWVRFID0gMHgzNDtcbmNvbnN0IFZFUlNJT05fQllURV9SRUdURVNUID0gMHg2ZjtcbmNvbnN0IEdldEFkZHJlc3NTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgcHVibGljS2V5OiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH1cbn0pO1xuXG5jb25zdCBnZXRBZGRyZXNzID0gKGRhdGEpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBvdXJEYXRhID0gZGF0YTtcbiAgICBHZXRBZGRyZXNzU2NoZW1hLnZhbGlkYXRlKG91ckRhdGEpO1xuICAgIHJldHVybiBfZ2V0QWRkcmVzcyhvdXJEYXRhLnB1YmxpY0tleSk7XG4gIH0gY2F0Y2goZXhjZXB0aW9uKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZG9pY2hhaW4uZ2V0QWRkcmVzcy5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9XG59O1xuXG5mdW5jdGlvbiBfZ2V0QWRkcmVzcyhwdWJsaWNLZXkpIHtcbiAgY29uc3QgcHViS2V5ID0gQ3J5cHRvSlMubGliLldvcmRBcnJheS5jcmVhdGUoQnVmZmVyLmZyb20ocHVibGljS2V5LCAnaGV4JykpO1xuICBsZXQga2V5ID0gQ3J5cHRvSlMuU0hBMjU2KHB1YktleSk7XG4gIGtleSA9IENyeXB0b0pTLlJJUEVNRDE2MChrZXkpO1xuICBsZXQgdmVyc2lvbkJ5dGUgPSBWRVJTSU9OX0JZVEU7XG4gIGlmKGlzUmVndGVzdCgpIHx8IGlzVGVzdG5ldCgpKSB2ZXJzaW9uQnl0ZSA9IFZFUlNJT05fQllURV9SRUdURVNUO1xuICBsZXQgYWRkcmVzcyA9IEJ1ZmZlci5jb25jYXQoW0J1ZmZlci5mcm9tKFt2ZXJzaW9uQnl0ZV0pLCBCdWZmZXIuZnJvbShrZXkudG9TdHJpbmcoKSwgJ2hleCcpXSk7XG4gIGtleSA9IENyeXB0b0pTLlNIQTI1NihDcnlwdG9KUy5saWIuV29yZEFycmF5LmNyZWF0ZShhZGRyZXNzKSk7XG4gIGtleSA9IENyeXB0b0pTLlNIQTI1NihrZXkpO1xuICBsZXQgY2hlY2tzdW0gPSBrZXkudG9TdHJpbmcoKS5zdWJzdHJpbmcoMCwgOCk7XG4gIGFkZHJlc3MgPSBuZXcgQnVmZmVyKGFkZHJlc3MudG9TdHJpbmcoJ2hleCcpK2NoZWNrc3VtLCdoZXgnKTtcbiAgYWRkcmVzcyA9IEJhc2U1OC5lbmNvZGUoYWRkcmVzcyk7XG4gIHJldHVybiBhZGRyZXNzO1xufVxuXG5leHBvcnQgZGVmYXVsdCBnZXRBZGRyZXNzO1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgeyBnZXRCYWxhbmNlIH0gZnJvbSAnLi4vLi4vLi4vLi4vc2VydmVyL2FwaS9kb2ljaGFpbi5qcyc7XG5pbXBvcnQgeyBDT05GSVJNX0NMSUVOVH0gZnJvbSAnLi4vLi4vLi4vc3RhcnR1cC9zZXJ2ZXIvZG9pY2hhaW4tY29uZmlndXJhdGlvbi5qcyc7XG5cblxuY29uc3QgZ2V0X0JhbGFuY2UgPSAoKSA9PiB7XG4gICAgXG4gIHRyeSB7XG4gICAgY29uc3QgYmFsPWdldEJhbGFuY2UoQ09ORklSTV9DTElFTlQpO1xuICAgIHJldHVybiBiYWw7XG4gICAgXG4gIH0gY2F0Y2goZXhjZXB0aW9uKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZG9pY2hhaW4uZ2V0QmFsYW5jZS5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9XG4gIHJldHVybiB0cnVlO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgZ2V0X0JhbGFuY2U7XG5cbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IENyeXB0b0pTIGZyb20gJ2NyeXB0by1qcyc7XG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XG5cbmNvbnN0IEdldERhdGFIYXNoU2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIGRhdGE6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfVxufSk7XG5cbmNvbnN0IGdldERhdGFIYXNoID0gKGRhdGEpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBvdXJEYXRhID0gZGF0YTtcbiAgICAgIEdldERhdGFIYXNoU2NoZW1hLnZhbGlkYXRlKG91ckRhdGEpO1xuICAgIGNvbnN0IGhhc2ggPSBDcnlwdG9KUy5TSEEyNTYob3VyRGF0YSkudG9TdHJpbmcoKTtcbiAgICByZXR1cm4gaGFzaDtcbiAgfSBjYXRjaChleGNlcHRpb24pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdkb2ljaGFpbi5nZXREYXRhSGFzaC5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBnZXREYXRhSGFzaDtcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IHsgcmFuZG9tQnl0ZXMgfSBmcm9tICdjcnlwdG8nO1xuaW1wb3J0IHNlY3AyNTZrMSBmcm9tICdzZWNwMjU2azEnO1xuXG5jb25zdCBnZXRLZXlQYWlyID0gKCkgPT4ge1xuICB0cnkge1xuICAgIGxldCBwcml2S2V5XG4gICAgZG8ge3ByaXZLZXkgPSByYW5kb21CeXRlcygzMil9IHdoaWxlKCFzZWNwMjU2azEucHJpdmF0ZUtleVZlcmlmeShwcml2S2V5KSlcbiAgICBjb25zdCBwcml2YXRlS2V5ID0gcHJpdktleTtcbiAgICBjb25zdCBwdWJsaWNLZXkgPSBzZWNwMjU2azEucHVibGljS2V5Q3JlYXRlKHByaXZhdGVLZXkpO1xuICAgIHJldHVybiB7XG4gICAgICBwcml2YXRlS2V5OiBwcml2YXRlS2V5LnRvU3RyaW5nKCdoZXgnKS50b1VwcGVyQ2FzZSgpLFxuICAgICAgcHVibGljS2V5OiBwdWJsaWNLZXkudG9TdHJpbmcoJ2hleCcpLnRvVXBwZXJDYXNlKClcbiAgICB9XG4gIH0gY2F0Y2goZXhjZXB0aW9uKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZG9pY2hhaW4uZ2V0S2V5UGFpci5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBnZXRLZXlQYWlyO1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XG5pbXBvcnQgQmFzZTU4IGZyb20gJ2JzNTgnO1xuXG5jb25zdCBHZXRQcml2YXRlS2V5RnJvbVdpZlNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICB3aWY6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfVxufSk7XG5cbmNvbnN0IGdldFByaXZhdGVLZXlGcm9tV2lmID0gKGRhdGEpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBvdXJEYXRhID0gZGF0YTtcbiAgICBHZXRQcml2YXRlS2V5RnJvbVdpZlNjaGVtYS52YWxpZGF0ZShvdXJEYXRhKTtcbiAgICByZXR1cm4gX2dldFByaXZhdGVLZXlGcm9tV2lmKG91ckRhdGEud2lmKTtcbiAgfSBjYXRjaChleGNlcHRpb24pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdkb2ljaGFpbi5nZXRQcml2YXRlS2V5RnJvbVdpZi5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9XG59O1xuXG5mdW5jdGlvbiBfZ2V0UHJpdmF0ZUtleUZyb21XaWYod2lmKSB7XG4gIHZhciBwcml2YXRlS2V5ID0gQmFzZTU4LmRlY29kZSh3aWYpLnRvU3RyaW5nKCdoZXgnKTtcbiAgcHJpdmF0ZUtleSA9IHByaXZhdGVLZXkuc3Vic3RyaW5nKDIsIHByaXZhdGVLZXkubGVuZ3RoIC0gOCk7XG4gIGlmKHByaXZhdGVLZXkubGVuZ3RoID09PSA2NiAmJiBwcml2YXRlS2V5LmVuZHNXaXRoKFwiMDFcIikpIHtcbiAgICBwcml2YXRlS2V5ID0gcHJpdmF0ZUtleS5zdWJzdHJpbmcoMCwgcHJpdmF0ZUtleS5sZW5ndGggLSAyKTtcbiAgfVxuICByZXR1cm4gcHJpdmF0ZUtleTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZ2V0UHJpdmF0ZUtleUZyb21XaWY7XG4iLCJpbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XG5pbXBvcnQge2xvZ1NlbmR9IGZyb20gXCIuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9sb2ctY29uZmlndXJhdGlvblwiO1xuXG5pbXBvcnQgZ2V0T3B0SW5LZXkgZnJvbSBcIi4uL2Rucy9nZXRfb3B0LWluLWtleVwiO1xuaW1wb3J0IGdldE9wdEluUHJvdmlkZXIgZnJvbSBcIi4uL2Rucy9nZXRfb3B0LWluLXByb3ZpZGVyXCI7XG5pbXBvcnQgZ2V0QWRkcmVzcyBmcm9tIFwiLi9nZXRfYWRkcmVzc1wiO1xuXG5jb25zdCBHZXRQdWJsaWNLZXlTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgICBkb21haW46IHtcbiAgICAgICAgdHlwZTogU3RyaW5nXG4gICAgfVxufSk7XG5cbmNvbnN0IGdldFB1YmxpY0tleUFuZEFkZHJlc3MgPSAoZGF0YSkgPT4ge1xuXG4gICAgY29uc3Qgb3VyRGF0YSA9IGRhdGE7XG4gICAgR2V0UHVibGljS2V5U2NoZW1hLnZhbGlkYXRlKG91ckRhdGEpO1xuXG4gICAgbGV0IHB1YmxpY0tleSA9IGdldE9wdEluS2V5KHtkb21haW46IG91ckRhdGEuZG9tYWlufSk7XG4gICAgaWYoIXB1YmxpY0tleSl7XG4gICAgICAgIGNvbnN0IHByb3ZpZGVyID0gZ2V0T3B0SW5Qcm92aWRlcih7ZG9tYWluOiBvdXJEYXRhLmRvbWFpbn0pO1xuICAgICAgICBsb2dTZW5kKFwidXNpbmcgZG9pY2hhaW4gcHJvdmlkZXIgaW5zdGVhZCBvZiBkaXJlY3RseSBjb25maWd1cmVkIHB1YmxpY0tleTpcIix7cHJvdmlkZXI6cHJvdmlkZXJ9KTtcbiAgICAgICAgcHVibGljS2V5ID0gZ2V0T3B0SW5LZXkoe2RvbWFpbjogcHJvdmlkZXJ9KTsgLy9nZXQgcHVibGljIGtleSBmcm9tIHByb3ZpZGVyIG9yIGZhbGxiYWNrIGlmIHB1YmxpY2tleSB3YXMgbm90IHNldCBpbiBkbnNcbiAgICB9XG4gICAgY29uc3QgZGVzdEFkZHJlc3MgPSAgZ2V0QWRkcmVzcyh7cHVibGljS2V5OiBwdWJsaWNLZXl9KTtcbiAgICBsb2dTZW5kKCdwdWJsaWNLZXkgYW5kIGRlc3RBZGRyZXNzICcsIHtwdWJsaWNLZXk6cHVibGljS2V5LGRlc3RBZGRyZXNzOmRlc3RBZGRyZXNzfSk7XG4gICAgcmV0dXJuIHtwdWJsaWNLZXk6cHVibGljS2V5LGRlc3RBZGRyZXNzOmRlc3RBZGRyZXNzfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGdldFB1YmxpY0tleUFuZEFkZHJlc3M7IiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XG5pbXBvcnQgYml0Y29yZSBmcm9tICdiaXRjb3JlLWxpYic7XG5pbXBvcnQgTWVzc2FnZSBmcm9tICdiaXRjb3JlLW1lc3NhZ2UnO1xuXG5jb25zdCBHZXRTaWduYXR1cmVTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgbWVzc2FnZToge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9LFxuICBwcml2YXRlS2V5OiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH1cbn0pO1xuXG5jb25zdCBnZXRTaWduYXR1cmUgPSAoZGF0YSkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IG91ckRhdGEgPSBkYXRhO1xuICAgIEdldFNpZ25hdHVyZVNjaGVtYS52YWxpZGF0ZShvdXJEYXRhKTtcbiAgICBjb25zdCBzaWduYXR1cmUgPSBNZXNzYWdlKG91ckRhdGEubWVzc2FnZSkuc2lnbihuZXcgYml0Y29yZS5Qcml2YXRlS2V5KG91ckRhdGEucHJpdmF0ZUtleSkpO1xuICAgIHJldHVybiBzaWduYXR1cmU7XG4gIH0gY2F0Y2goZXhjZXB0aW9uKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZG9pY2hhaW4uZ2V0U2lnbmF0dXJlLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGdldFNpZ25hdHVyZTtcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tICdzaW1wbC1zY2hlbWEnO1xuaW1wb3J0IHsgU0VORF9DTElFTlQgfSBmcm9tICcuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9kb2ljaGFpbi1jb25maWd1cmF0aW9uLmpzJztcbmltcG9ydCBlbmNyeXB0TWVzc2FnZSBmcm9tIFwiLi9lbmNyeXB0X21lc3NhZ2VcIjtcbmltcG9ydCB7Z2V0VXJsfSBmcm9tIFwiLi4vLi4vLi4vc3RhcnR1cC9zZXJ2ZXIvZGFwcC1jb25maWd1cmF0aW9uXCI7XG5pbXBvcnQge2xvZ0Jsb2NrY2hhaW4sIGxvZ1NlbmR9IGZyb20gXCIuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9sb2ctY29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHtmZWVEb2ksbmFtZURvaX0gZnJvbSBcIi4uLy4uLy4uLy4uL3NlcnZlci9hcGkvZG9pY2hhaW5cIjtcbmltcG9ydCB7T3B0SW5zfSBmcm9tIFwiLi4vLi4vLi4vYXBpL29wdC1pbnMvb3B0LWluc1wiO1xuaW1wb3J0IGdldFB1YmxpY0tleUFuZEFkZHJlc3MgZnJvbSBcIi4vZ2V0X3B1YmxpY2tleV9hbmRfYWRkcmVzc19ieV9kb21haW5cIjtcblxuXG5jb25zdCBJbnNlcnRTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgbmFtZUlkOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH0sXG4gIHNpZ25hdHVyZToge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9LFxuICBkYXRhSGFzaDoge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9LFxuICBkb21haW46IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfSxcbiAgc29pRGF0ZToge1xuICAgIHR5cGU6IERhdGVcbiAgfVxufSk7XG5cbmNvbnN0IGluc2VydCA9IChkYXRhKSA9PiB7XG4gIGNvbnN0IG91ckRhdGEgPSBkYXRhO1xuICB0cnkge1xuICAgIEluc2VydFNjaGVtYS52YWxpZGF0ZShvdXJEYXRhKTtcbiAgICBsb2dTZW5kKFwiZG9tYWluOlwiLG91ckRhdGEuZG9tYWluKTtcblxuICAgIGNvbnN0IHB1YmxpY0tleUFuZEFkZHJlc3MgPSBnZXRQdWJsaWNLZXlBbmRBZGRyZXNzKHtkb21haW46b3VyRGF0YS5kb21haW59KTtcbiAgICBjb25zdCBmcm9tID0gZW5jcnlwdE1lc3NhZ2Uoe3B1YmxpY0tleTogcHVibGljS2V5QW5kQWRkcmVzcy5wdWJsaWNLZXksIG1lc3NhZ2U6IGdldFVybCgpfSk7XG4gICAgbG9nU2VuZCgnZW5jcnlwdGVkIHVybCBmb3IgdXNlIGFkIGZyb20gaW4gZG9pY2hhaW4gdmFsdWU6JyxnZXRVcmwoKSxmcm9tKTtcblxuICAgIGNvbnN0IG5hbWVWYWx1ZSA9IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgc2lnbmF0dXJlOiBvdXJEYXRhLnNpZ25hdHVyZSxcbiAgICAgICAgZGF0YUhhc2g6IG91ckRhdGEuZGF0YUhhc2gsXG4gICAgICAgIGZyb206IGZyb21cbiAgICB9KTtcblxuICAgIC8vVE9ETyAoISkgdGhpcyBtdXN0IGJlIHJlcGxhY2VkIGluIGZ1dHVyZSBieSBcImF0b21pYyBuYW1lIHRyYWRpbmcgZXhhbXBsZVwiIGh0dHBzOi8vd2lraS5uYW1lY29pbi5pbmZvLz90aXRsZT1BdG9taWNfTmFtZS1UcmFkaW5nXG4gICAgbG9nQmxvY2tjaGFpbignc2VuZGluZyBhIGZlZSB0byBib2Igc28gaGUgY2FuIHBheSB0aGUgZG9pIHN0b3JhZ2UgKGRlc3RBZGRyZXNzKTonLCBwdWJsaWNLZXlBbmRBZGRyZXNzLmRlc3RBZGRyZXNzKTtcbiAgICBjb25zdCBmZWVEb2lUeCA9IGZlZURvaShTRU5EX0NMSUVOVCwgcHVibGljS2V5QW5kQWRkcmVzcy5kZXN0QWRkcmVzcyk7XG4gICAgbG9nQmxvY2tjaGFpbignZmVlIHNlbmQgdHhpZCB0byBkZXN0YWRkcmVzcycsIGZlZURvaVR4LCBwdWJsaWNLZXlBbmRBZGRyZXNzLmRlc3RBZGRyZXNzKTtcblxuICAgIGxvZ0Jsb2NrY2hhaW4oJ2FkZGluZyBkYXRhIHRvIGJsb2NrY2hhaW4gdmlhIG5hbWVfZG9pIChuYW1lSWQsdmFsdWUsZGVzdEFkZHJlc3MpOicsIG91ckRhdGEubmFtZUlkLG5hbWVWYWx1ZSxwdWJsaWNLZXlBbmRBZGRyZXNzLmRlc3RBZGRyZXNzKTtcbiAgICBjb25zdCBuYW1lRG9pVHggPSBuYW1lRG9pKFNFTkRfQ0xJRU5ULCBvdXJEYXRhLm5hbWVJZCwgbmFtZVZhbHVlLCBwdWJsaWNLZXlBbmRBZGRyZXNzLmRlc3RBZGRyZXNzKTtcbiAgICBsb2dCbG9ja2NoYWluKCduYW1lX2RvaSBhZGRlZCBibG9ja2NoYWluLiB0eGlkOicsIG5hbWVEb2lUeCk7XG5cbiAgICBPcHRJbnMudXBkYXRlKHtuYW1lSWQ6IG91ckRhdGEubmFtZUlkfSwgeyRzZXQ6IHt0eElkOm5hbWVEb2lUeH19KTtcbiAgICBsb2dCbG9ja2NoYWluKCd1cGRhdGluZyBPcHRJbiBsb2NhbGx5IHdpdGg6Jywge25hbWVJZDogb3VyRGF0YS5uYW1lSWQsIHR4SWQ6IG5hbWVEb2lUeH0pO1xuXG4gIH0gY2F0Y2goZXhjZXB0aW9uKSB7XG4gICAgICBPcHRJbnMudXBkYXRlKHtuYW1lSWQ6IG91ckRhdGEubmFtZUlkfSwgeyRzZXQ6IHtlcnJvcjpKU09OLnN0cmluZ2lmeShleGNlcHRpb24ubWVzc2FnZSl9fSk7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZG9pY2hhaW4uaW5zZXJ0LmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7IC8vVE9ETyB1cGRhdGUgb3B0LWluIGluIGxvY2FsIGRiIHRvIGluZm9ybSB1c2VyIGFib3V0IHRoZSBlcnJvciEgZS5nLiBJbnN1ZmZpY2llbnQgZnVuZHMgZXRjLlxuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBpbnNlcnQ7XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcbmltcG9ydCB7IENPTkZJUk1fQ0xJRU5UIH0gZnJvbSAnLi4vLi4vLi4vc3RhcnR1cC9zZXJ2ZXIvZG9pY2hhaW4tY29uZmlndXJhdGlvbi5qcyc7XG5pbXBvcnQge2dldFdpZiwgc2lnbk1lc3NhZ2UsIGdldFRyYW5zYWN0aW9uLCBuYW1lRG9pLCBuYW1lU2hvd30gZnJvbSBcIi4uLy4uLy4uLy4uL3NlcnZlci9hcGkvZG9pY2hhaW5cIjtcbmltcG9ydCB7QVBJX1BBVEgsIERPSV9DT05GSVJNQVRJT05fTk9USUZZX1JPVVRFLCBWRVJTSU9OfSBmcm9tIFwiLi4vLi4vLi4vLi4vc2VydmVyL2FwaS9yZXN0L3Jlc3RcIjtcbmltcG9ydCB7Q09ORklSTV9BRERSRVNTfSBmcm9tIFwiLi4vLi4vLi4vc3RhcnR1cC9zZXJ2ZXIvZG9pY2hhaW4tY29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHtnZXRIdHRwUFVUfSBmcm9tIFwiLi4vLi4vLi4vLi4vc2VydmVyL2FwaS9odHRwXCI7XG5pbXBvcnQge2xvZ0NvbmZpcm19IGZyb20gXCIuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9sb2ctY29uZmlndXJhdGlvblwiO1xuaW1wb3J0IGdldFByaXZhdGVLZXlGcm9tV2lmIGZyb20gXCIuL2dldF9wcml2YXRlLWtleV9mcm9tX3dpZlwiO1xuaW1wb3J0IGRlY3J5cHRNZXNzYWdlIGZyb20gXCIuL2RlY3J5cHRfbWVzc2FnZVwiO1xuaW1wb3J0IHtPcHRJbnN9IGZyb20gXCIuLi8uLi8uLi9hcGkvb3B0LWlucy9vcHQtaW5zXCI7XG5cbmNvbnN0IFVwZGF0ZVNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICBuYW1lSWQ6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfSxcbiAgdmFsdWU6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfSxcbiAgaG9zdCA6IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIG9wdGlvbmFsOiB0cnVlLFxuICB9LFxuICBmcm9tSG9zdFVybCA6IHtcbiAgICAgIHR5cGU6IFN0cmluZ1xuICB9XG59KTtcblxuY29uc3QgdXBkYXRlID0gKGRhdGEsIGpvYikgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IG91ckRhdGEgPSBkYXRhO1xuXG4gICAgVXBkYXRlU2NoZW1hLnZhbGlkYXRlKG91ckRhdGEpO1xuXG4gICAgLy9zdG9wIHRoaXMgdXBkYXRlIHVudGlsIHRoaXMgbmFtZSBhcyBhdCBsZWFzdCAxIGNvbmZpcm1hdGlvblxuICAgIGNvbnN0IG5hbWVfZGF0YSA9IG5hbWVTaG93KENPTkZJUk1fQ0xJRU5ULG91ckRhdGEubmFtZUlkKTtcbiAgICBpZihuYW1lX2RhdGEgPT09IHVuZGVmaW5lZCl7XG4gICAgICAgIHJlcnVuKGpvYik7XG4gICAgICAgIGxvZ0NvbmZpcm0oJ25hbWUgbm90IHZpc2libGUgLSBkZWxheWluZyBuYW1lIHVwZGF0ZScsb3VyRGF0YS5uYW1lSWQpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IG91cl90cmFuc2FjdGlvbiA9IGdldFRyYW5zYWN0aW9uKENPTkZJUk1fQ0xJRU5ULG5hbWVfZGF0YS50eGlkKTtcbiAgICBpZihvdXJfdHJhbnNhY3Rpb24uY29uZmlybWF0aW9ucz09PTApe1xuICAgICAgICByZXJ1bihqb2IpO1xuICAgICAgICBsb2dDb25maXJtKCd0cmFuc2FjdGlvbiBoYXMgMCBjb25maXJtYXRpb25zIC0gZGVsYXlpbmcgbmFtZSB1cGRhdGUnLEpTT04ucGFyc2Uob3VyRGF0YS52YWx1ZSkpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGxvZ0NvbmZpcm0oJ3VwZGF0aW5nIGJsb2NrY2hhaW4gd2l0aCBkb2lTaWduYXR1cmU6JyxKU09OLnBhcnNlKG91ckRhdGEudmFsdWUpKTtcbiAgICBjb25zdCB3aWYgPSBnZXRXaWYoQ09ORklSTV9DTElFTlQsIENPTkZJUk1fQUREUkVTUyk7XG4gICAgY29uc3QgcHJpdmF0ZUtleSA9IGdldFByaXZhdGVLZXlGcm9tV2lmKHt3aWY6IHdpZn0pO1xuICAgIGxvZ0NvbmZpcm0oJ2dvdCBwcml2YXRlIGtleSAod2lsbCBub3Qgc2hvdyBpdCBoZXJlKSBpbiBvcmRlciB0byBkZWNyeXB0IFNlbmQtZEFwcCBob3N0IHVybCBmcm9tIHZhbHVlOicsb3VyRGF0YS5mcm9tSG9zdFVybCk7XG4gICAgY29uc3Qgb3VyZnJvbUhvc3RVcmwgPSBkZWNyeXB0TWVzc2FnZSh7cHJpdmF0ZUtleTogcHJpdmF0ZUtleSwgbWVzc2FnZTogb3VyRGF0YS5mcm9tSG9zdFVybH0pO1xuICAgIGxvZ0NvbmZpcm0oJ2RlY3J5cHRlZCBmcm9tSG9zdFVybCcsb3VyZnJvbUhvc3RVcmwpO1xuICAgIGNvbnN0IHVybCA9IG91cmZyb21Ib3N0VXJsK0FQSV9QQVRIK1ZFUlNJT04rXCIvXCIrRE9JX0NPTkZJUk1BVElPTl9OT1RJRllfUk9VVEU7XG5cbiAgICBsb2dDb25maXJtKCdjcmVhdGluZyBzaWduYXR1cmUgd2l0aCBBRERSRVNTJytDT05GSVJNX0FERFJFU1MrXCIgbmFtZUlkOlwiLG91ckRhdGEudmFsdWUpO1xuICAgIGNvbnN0IHNpZ25hdHVyZSA9IHNpZ25NZXNzYWdlKENPTkZJUk1fQ0xJRU5ULCBDT05GSVJNX0FERFJFU1MsIG91ckRhdGEubmFtZUlkKTsgLy9UT0RPIHdoeSBoZXJlIG92ZXIgbmFtZUlEP1xuICAgIGxvZ0NvbmZpcm0oJ3NpZ25hdHVyZSBjcmVhdGVkOicsc2lnbmF0dXJlKTtcblxuICAgIGNvbnN0IHVwZGF0ZURhdGEgPSB7XG4gICAgICAgIG5hbWVJZDogb3VyRGF0YS5uYW1lSWQsXG4gICAgICAgIHNpZ25hdHVyZTogc2lnbmF0dXJlLFxuICAgICAgICBob3N0OiBvdXJEYXRhLmhvc3RcbiAgICB9O1xuXG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgdHhpZCA9IG5hbWVEb2koQ09ORklSTV9DTElFTlQsIG91ckRhdGEubmFtZUlkLCBvdXJEYXRhLnZhbHVlLCBudWxsKTtcbiAgICAgICAgbG9nQ29uZmlybSgndXBkYXRlIHRyYW5zYWN0aW9uIHR4aWQ6Jyx0eGlkKTtcbiAgICB9Y2F0Y2goZXhjZXB0aW9uKXtcbiAgICAgICAgLy9cbiAgICAgICAgbG9nQ29uZmlybSgndGhpcyBuYW1lRE9JIGRvZXNuwrR0IGhhdmUgYSBibG9jayB5ZXQgYW5kIHdpbGwgYmUgdXBkYXRlZCB3aXRoIHRoZSBuZXh0IGJsb2NrIGFuZCB3aXRoIHRoZSBuZXh0IHF1ZXVlIHN0YXJ0Oicsb3VyRGF0YS5uYW1lSWQpO1xuICAgICAgICBpZihleGNlcHRpb24udG9TdHJpbmcoKS5pbmRleE9mKFwidGhlcmUgaXMgYWxyZWFkeSBhIHJlZ2lzdHJhdGlvbiBmb3IgdGhpcyBkb2kgbmFtZVwiKT09LTEpIHtcbiAgICAgICAgICAgIE9wdElucy51cGRhdGUoe25hbWVJZDogb3VyRGF0YS5uYW1lSWR9LCB7JHNldDoge2Vycm9yOiBKU09OLnN0cmluZ2lmeShleGNlcHRpb24ubWVzc2FnZSl9fSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZG9pY2hhaW4udXBkYXRlLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gICAgICAgIC8vfWVsc2V7XG4gICAgICAgIC8vICAgIGxvZ0NvbmZpcm0oJ3RoaXMgbmFtZURPSSBkb2VzbsK0dCBoYXZlIGEgYmxvY2sgeWV0IGFuZCB3aWxsIGJlIHVwZGF0ZWQgd2l0aCB0aGUgbmV4dCBibG9jayBhbmQgd2l0aCB0aGUgbmV4dCBxdWV1ZSBzdGFydDonLG91ckRhdGEubmFtZUlkKTtcbiAgICAgICAgLy99XG4gICAgfVxuXG4gICAgY29uc3QgcmVzcG9uc2UgPSBnZXRIdHRwUFVUKHVybCwgdXBkYXRlRGF0YSk7XG4gICAgbG9nQ29uZmlybSgnaW5mb3JtZWQgc2VuZCBkQXBwIGFib3V0IGNvbmZpcm1lZCBkb2kgb24gdXJsOicrdXJsKycgd2l0aCB1cGRhdGVEYXRhJytKU09OLnN0cmluZ2lmeSh1cGRhdGVEYXRhKStcIiByZXNwb25zZTpcIixyZXNwb25zZS5kYXRhKTtcbiAgICBqb2IuZG9uZSgpO1xuICB9IGNhdGNoKGV4Y2VwdGlvbikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2RvaWNoYWluLnVwZGF0ZS5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9XG59O1xuXG5mdW5jdGlvbiByZXJ1bihqb2Ipe1xuICAgIGxvZ0NvbmZpcm0oJ3JlcnVubmluZyB0eGlkIGluIDEwc2VjIC0gY2FuY2VsaW5nIG9sZCBqb2InLCcnKTtcbiAgICBqb2IuY2FuY2VsKCk7XG4gICAgbG9nQ29uZmlybSgncmVzdGFydCBibG9ja2NoYWluIGRvaSB1cGRhdGUnLCcnKTtcbiAgICBqb2IucmVzdGFydChcbiAgICAgICAge1xuICAgICAgICAgICAgLy9yZXBlYXRzOiA2MDAsICAgLy8gT25seSByZXBlYXQgdGhpcyBvbmNlXG4gICAgICAgICAgICAvLyBUaGlzIGlzIHRoZSBkZWZhdWx0XG4gICAgICAgICAgIC8vIHdhaXQ6IDEwMDAwICAgLy8gV2FpdCAxMCBzZWMgYmV0d2VlbiByZXBlYXRzXG4gICAgICAgICAgICAgICAgICAgICAgICAgIC8vIERlZmF1bHQgaXMgcHJldmlvdXMgc2V0dGluZ1xuICAgICAgICB9LFxuICAgICAgICBmdW5jdGlvbiAoZXJyLCByZXN1bHQpIHtcbiAgICAgICAgICAgIGlmIChyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICBsb2dDb25maXJtKCdyZXJ1bm5pbmcgdHhpZCBpbiAxMHNlYzonLHJlc3VsdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICApO1xufVxuXG5leHBvcnQgZGVmYXVsdCB1cGRhdGU7XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcbmltcG9ydCBiaXRjb3JlIGZyb20gJ2JpdGNvcmUtbGliJztcbmltcG9ydCBNZXNzYWdlIGZyb20gJ2JpdGNvcmUtbWVzc2FnZSc7XG5pbXBvcnQge2xvZ0Vycm9yLCBsb2dWZXJpZnl9IGZyb20gXCIuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9sb2ctY29uZmlndXJhdGlvblwiO1xuY29uc3QgTkVUV09SSyA9IGJpdGNvcmUuTmV0d29ya3MuYWRkKHtcbiAgbmFtZTogJ2RvaWNoYWluJyxcbiAgYWxpYXM6ICdkb2ljaGFpbicsXG4gIHB1YmtleWhhc2g6IDB4MzQsXG4gIHByaXZhdGVrZXk6IDB4QjQsXG4gIHNjcmlwdGhhc2g6IDEzLFxuICBuZXR3b3JrTWFnaWM6IDB4ZjliZWI0ZmUsXG59KTtcblxuY29uc3QgVmVyaWZ5U2lnbmF0dXJlU2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIGRhdGE6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfSxcbiAgcHVibGljS2V5OiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH0sXG4gIHNpZ25hdHVyZToge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9XG59KTtcblxuY29uc3QgdmVyaWZ5U2lnbmF0dXJlID0gKGRhdGEpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBvdXJEYXRhID0gZGF0YTtcbiAgICBsb2dWZXJpZnkoJ3ZlcmlmeVNpZ25hdHVyZTonLG91ckRhdGEpO1xuICAgIFZlcmlmeVNpZ25hdHVyZVNjaGVtYS52YWxpZGF0ZShvdXJEYXRhKTtcbiAgICBjb25zdCBhZGRyZXNzID0gYml0Y29yZS5BZGRyZXNzLmZyb21QdWJsaWNLZXkobmV3IGJpdGNvcmUuUHVibGljS2V5KG91ckRhdGEucHVibGljS2V5KSwgTkVUV09SSyk7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBNZXNzYWdlKG91ckRhdGEuZGF0YSkudmVyaWZ5KGFkZHJlc3MsIG91ckRhdGEuc2lnbmF0dXJlKTtcbiAgICB9IGNhdGNoKGVycm9yKSB7IGxvZ0Vycm9yKGVycm9yKX1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH0gY2F0Y2goZXhjZXB0aW9uKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZG9pY2hhaW4udmVyaWZ5U2lnbmF0dXJlLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IHZlcmlmeVNpZ25hdHVyZTtcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tICdzaW1wbC1zY2hlbWEnO1xuaW1wb3J0IHsgT3B0SW5zIH0gZnJvbSAnLi4vLi4vLi4vYXBpL29wdC1pbnMvb3B0LWlucy5qcyc7XG5pbXBvcnQgeyBTZW5kZXJzIH0gZnJvbSAnLi4vLi4vLi4vYXBpL3NlbmRlcnMvc2VuZGVycy5qcyc7XG5pbXBvcnQgeyBSZWNpcGllbnRzIH0gZnJvbSAnLi4vLi4vLi4vYXBpL3JlY2lwaWVudHMvcmVjaXBpZW50cy5qcyc7XG5pbXBvcnQgZ2VuZXJhdGVOYW1lSWQgZnJvbSAnLi9nZW5lcmF0ZV9uYW1lLWlkLmpzJztcbmltcG9ydCBnZXRTaWduYXR1cmUgZnJvbSAnLi9nZXRfc2lnbmF0dXJlLmpzJztcbmltcG9ydCBnZXREYXRhSGFzaCBmcm9tICcuL2dldF9kYXRhLWhhc2guanMnO1xuaW1wb3J0IGFkZEluc2VydEJsb2NrY2hhaW5Kb2IgZnJvbSAnLi4vam9icy9hZGRfaW5zZXJ0X2Jsb2NrY2hhaW4uanMnO1xuaW1wb3J0IHtsb2dTZW5kfSBmcm9tIFwiLi4vLi4vLi4vc3RhcnR1cC9zZXJ2ZXIvbG9nLWNvbmZpZ3VyYXRpb25cIjtcblxuY29uc3QgV3JpdGVUb0Jsb2NrY2hhaW5TY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgaWQ6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfVxufSk7XG5cbmNvbnN0IHdyaXRlVG9CbG9ja2NoYWluID0gKGRhdGEpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBvdXJEYXRhID0gZGF0YTtcbiAgICBXcml0ZVRvQmxvY2tjaGFpblNjaGVtYS52YWxpZGF0ZShvdXJEYXRhKTtcblxuICAgIGNvbnN0IG9wdEluID0gT3B0SW5zLmZpbmRPbmUoe19pZDogZGF0YS5pZH0pO1xuICAgIGNvbnN0IHJlY2lwaWVudCA9IFJlY2lwaWVudHMuZmluZE9uZSh7X2lkOiBvcHRJbi5yZWNpcGllbnR9KTtcbiAgICBjb25zdCBzZW5kZXIgPSBTZW5kZXJzLmZpbmRPbmUoe19pZDogb3B0SW4uc2VuZGVyfSk7XG4gICAgbG9nU2VuZChcIm9wdEluIGRhdGE6XCIse2luZGV4Om91ckRhdGEuaW5kZXgsIG9wdEluOm9wdEluLHJlY2lwaWVudDpyZWNpcGllbnQsc2VuZGVyOiBzZW5kZXJ9KTtcblxuXG4gICAgY29uc3QgbmFtZUlkID0gZ2VuZXJhdGVOYW1lSWQoe2lkOiBkYXRhLmlkLGluZGV4Om9wdEluLmluZGV4LG1hc3RlckRvaTpvcHRJbi5tYXN0ZXJEb2kgfSk7XG4gICAgY29uc3Qgc2lnbmF0dXJlID0gZ2V0U2lnbmF0dXJlKHttZXNzYWdlOiByZWNpcGllbnQuZW1haWwrc2VuZGVyLmVtYWlsLCBwcml2YXRlS2V5OiByZWNpcGllbnQucHJpdmF0ZUtleX0pO1xuICAgIGxvZ1NlbmQoXCJnZW5lcmF0ZWQgc2lnbmF0dXJlIGZyb20gZW1haWwgcmVjaXBpZW50IGFuZCBzZW5kZXI6XCIsc2lnbmF0dXJlKTtcblxuICAgIGxldCBkYXRhSGFzaCA9IFwiXCI7XG5cbiAgICBpZihvcHRJbi5kYXRhKSB7XG4gICAgICBkYXRhSGFzaCA9IGdldERhdGFIYXNoKHtkYXRhOiBvcHRJbi5kYXRhfSk7XG4gICAgICBsb2dTZW5kKFwiZ2VuZXJhdGVkIGRhdGFoYXNoIGZyb20gZ2l2ZW4gZGF0YTpcIixkYXRhSGFzaCk7XG4gICAgfVxuXG4gICAgY29uc3QgcGFydHMgPSByZWNpcGllbnQuZW1haWwuc3BsaXQoXCJAXCIpO1xuICAgIGNvbnN0IGRvbWFpbiA9IHBhcnRzW3BhcnRzLmxlbmd0aC0xXTtcbiAgICBsb2dTZW5kKFwiZW1haWwgZG9tYWluIGZvciBwdWJsaWNLZXkgcmVxdWVzdCBpczpcIixkb21haW4pO1xuICAgIGFkZEluc2VydEJsb2NrY2hhaW5Kb2Ioe1xuICAgICAgbmFtZUlkOiBuYW1lSWQsXG4gICAgICBzaWduYXR1cmU6IHNpZ25hdHVyZSxcbiAgICAgIGRhdGFIYXNoOiBkYXRhSGFzaCxcbiAgICAgIGRvbWFpbjogZG9tYWluLFxuICAgICAgc29pRGF0ZTogb3B0SW4uY3JlYXRlZEF0XG4gICAgfSlcbiAgfSBjYXRjaCAoZXhjZXB0aW9uKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignZG9pY2hhaW4ud3JpdGVUb0Jsb2NrY2hhaW4uZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgd3JpdGVUb0Jsb2NrY2hhaW5cbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tICdzaW1wbC1zY2hlbWEnO1xuaW1wb3J0IHsgSGFzaElkcyB9IGZyb20gJy4uLy4uLy4uL3N0YXJ0dXAvc2VydmVyL2VtYWlsLWNvbmZpZ3VyYXRpb24uanMnO1xuXG5jb25zdCBEZWNvZGVEb2lIYXNoU2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIGhhc2g6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfVxufSk7XG5cbmNvbnN0IGRlY29kZURvaUhhc2ggPSAoaGFzaCkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IG91ckhhc2ggPSBoYXNoO1xuICAgIERlY29kZURvaUhhc2hTY2hlbWEudmFsaWRhdGUob3VySGFzaCk7XG4gICAgY29uc3QgaGV4ID0gSGFzaElkcy5kZWNvZGVIZXgob3VySGFzaC5oYXNoKTtcbiAgICBpZighaGV4IHx8IGhleCA9PT0gJycpIHRocm93IFwiV3JvbmcgaGFzaFwiO1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBvYmogPSBKU09OLnBhcnNlKEJ1ZmZlcihoZXgsICdoZXgnKS50b1N0cmluZygnYXNjaWknKSk7XG4gICAgICByZXR1cm4gb2JqO1xuICAgIH0gY2F0Y2goZXhjZXB0aW9uKSB7dGhyb3cgXCJXcm9uZyBoYXNoXCI7fVxuICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlbWFpbHMuZGVjb2RlX2RvaS1oYXNoLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGRlY29kZURvaUhhc2g7XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcbmltcG9ydCB7IEhhc2hJZHMgfSBmcm9tICcuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9lbWFpbC1jb25maWd1cmF0aW9uLmpzJztcblxuY29uc3QgR2VuZXJhdGVEb2lIYXNoU2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIGlkOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH0sXG4gIHRva2VuOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH0sXG4gIHJlZGlyZWN0OiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH1cbn0pO1xuXG5jb25zdCBnZW5lcmF0ZURvaUhhc2ggPSAob3B0SW4pID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBvdXJPcHRJbiA9IG9wdEluO1xuICAgIEdlbmVyYXRlRG9pSGFzaFNjaGVtYS52YWxpZGF0ZShvdXJPcHRJbik7XG5cbiAgICBjb25zdCBqc29uID0gSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgaWQ6IG91ck9wdEluLmlkLFxuICAgICAgdG9rZW46IG91ck9wdEluLnRva2VuLFxuICAgICAgcmVkaXJlY3Q6IG91ck9wdEluLnJlZGlyZWN0XG4gICAgfSk7XG5cbiAgICBjb25zdCBoZXggPSBCdWZmZXIoanNvbikudG9TdHJpbmcoJ2hleCcpO1xuICAgIGNvbnN0IGhhc2ggPSBIYXNoSWRzLmVuY29kZUhleChoZXgpO1xuICAgIHJldHVybiBoYXNoO1xuICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlbWFpbHMuZ2VuZXJhdGVfZG9pLWhhc2guZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgZ2VuZXJhdGVEb2lIYXNoO1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XG5pbXBvcnQge2xvZ0NvbmZpcm19IGZyb20gXCIuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9sb2ctY29uZmlndXJhdGlvblwiO1xuXG5jb25zdCBQTEFDRUhPTERFUl9SRUdFWCA9IC9cXCR7KFtcXHddKil9L2c7XG5jb25zdCBQYXJzZVRlbXBsYXRlU2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIHRlbXBsYXRlOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICB9LFxuICBkYXRhOiB7XG4gICAgdHlwZTogT2JqZWN0LFxuICAgIGJsYWNrYm94OiB0cnVlXG4gIH1cbn0pO1xuXG5jb25zdCBwYXJzZVRlbXBsYXRlID0gKGRhdGEpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBvdXJEYXRhID0gZGF0YTtcbiAgICAvL2xvZ0NvbmZpcm0oJ3BhcnNlVGVtcGxhdGU6JyxvdXJEYXRhKTtcblxuICAgIFBhcnNlVGVtcGxhdGVTY2hlbWEudmFsaWRhdGUob3VyRGF0YSk7XG4gICAgbG9nQ29uZmlybSgnUGFyc2VUZW1wbGF0ZVNjaGVtYSB2YWxpZGF0ZWQnKTtcblxuICAgIHZhciBfbWF0Y2g7XG4gICAgdmFyIHRlbXBsYXRlID0gb3VyRGF0YS50ZW1wbGF0ZTtcbiAgIC8vbG9nQ29uZmlybSgnZG9pbmcgc29tZSByZWdleCB3aXRoIHRlbXBsYXRlOicsdGVtcGxhdGUpO1xuXG4gICAgZG8ge1xuICAgICAgX21hdGNoID0gUExBQ0VIT0xERVJfUkVHRVguZXhlYyh0ZW1wbGF0ZSk7XG4gICAgICBpZihfbWF0Y2gpIHRlbXBsYXRlID0gX3JlcGxhY2VQbGFjZWhvbGRlcih0ZW1wbGF0ZSwgX21hdGNoLCBvdXJEYXRhLmRhdGFbX21hdGNoWzFdXSk7XG4gICAgfSB3aGlsZSAoX21hdGNoKTtcbiAgICByZXR1cm4gdGVtcGxhdGU7XG4gIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2VtYWlscy5wYXJzZVRlbXBsYXRlLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIF9yZXBsYWNlUGxhY2Vob2xkZXIodGVtcGxhdGUsIF9tYXRjaCwgcmVwbGFjZSkge1xuICB2YXIgcmVwID0gcmVwbGFjZTtcbiAgaWYocmVwbGFjZSA9PT0gdW5kZWZpbmVkKSByZXAgPSBcIlwiO1xuICByZXR1cm4gdGVtcGxhdGUuc3Vic3RyaW5nKDAsIF9tYXRjaC5pbmRleCkrcmVwK3RlbXBsYXRlLnN1YnN0cmluZyhfbWF0Y2guaW5kZXgrX21hdGNoWzBdLmxlbmd0aCk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHBhcnNlVGVtcGxhdGU7XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcbmltcG9ydCB7bG9nQ29uZmlybX0gZnJvbSBcIi4uLy4uLy4uL3N0YXJ0dXAvc2VydmVyL2xvZy1jb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgeyBET0lfTUFJTF9ERUZBVUxUX0VNQUlMX0ZST00gfSBmcm9tICcuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9lbWFpbC1jb25maWd1cmF0aW9uLmpzJztcblxuY29uc3QgU2VuZE1haWxTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgZnJvbToge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICByZWdFeDogU2ltcGxlU2NoZW1hLlJlZ0V4LkVtYWlsXG4gIH0sXG4gIHRvOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIHJlZ0V4OiBTaW1wbGVTY2hlbWEuUmVnRXguRW1haWxcbiAgfSxcbiAgc3ViamVjdDoge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgfSxcbiAgbWVzc2FnZToge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgfSxcbiAgcmV0dXJuUGF0aDoge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICByZWdFeDogU2ltcGxlU2NoZW1hLlJlZ0V4LkVtYWlsXG4gIH1cbn0pO1xuXG5jb25zdCBzZW5kTWFpbCA9IChtYWlsKSA9PiB7XG4gIHRyeSB7XG5cbiAgICBtYWlsLmZyb20gPSBET0lfTUFJTF9ERUZBVUxUX0VNQUlMX0ZST007XG5cbiAgICBjb25zdCBvdXJNYWlsID0gbWFpbDtcbiAgICBsb2dDb25maXJtKCdzZW5kaW5nIGVtYWlsIHdpdGggZGF0YTonLHt0bzptYWlsLnRvLCBzdWJqZWN0Om1haWwuc3ViamVjdH0pO1xuICAgIFNlbmRNYWlsU2NoZW1hLnZhbGlkYXRlKG91ck1haWwpO1xuICAgIC8vVE9ETzogVGV4dCBmYWxsYmFja1xuICAgIEVtYWlsLnNlbmQoe1xuICAgICAgZnJvbTogbWFpbC5mcm9tLFxuICAgICAgdG86IG1haWwudG8sXG4gICAgICBzdWJqZWN0OiBtYWlsLnN1YmplY3QsXG4gICAgICBodG1sOiBtYWlsLm1lc3NhZ2UsXG4gICAgICBoZWFkZXJzOiB7XG4gICAgICAgICdSZXR1cm4tUGF0aCc6IG1haWwucmV0dXJuUGF0aCxcbiAgICAgIH1cbiAgICB9KTtcblxuICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdlbWFpbHMuc2VuZC5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBzZW5kTWFpbDtcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IHsgSm9iIH0gZnJvbSAnbWV0ZW9yL3ZzaXZzaTpqb2ItY29sbGVjdGlvbic7XG5pbXBvcnQgeyBCbG9ja2NoYWluSm9icyB9IGZyb20gJy4uLy4uLy4uLy4uL3NlcnZlci9hcGkvYmxvY2tjaGFpbl9qb2JzLmpzJztcblxuY29uc3QgYWRkQ2hlY2tOZXdUcmFuc2FjdGlvbnNCbG9ja2NoYWluSm9iID0gKCkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IGpvYiA9IG5ldyBKb2IoQmxvY2tjaGFpbkpvYnMsICdjaGVja05ld1RyYW5zYWN0aW9uJywge30pO1xuICAgIGpvYi5yZXRyeSh7cmV0cmllczogNjAsIHdhaXQ6IDE1KjEwMDAgfSkuc2F2ZSh7Y2FuY2VsUmVwZWF0czogdHJ1ZX0pO1xuICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdqb2JzLmFkZENoZWNrTmV3VHJhbnNhY3Rpb25zQmxvY2tjaGFpbi5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBhZGRDaGVja05ld1RyYW5zYWN0aW9uc0Jsb2NrY2hhaW5Kb2I7XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcbmltcG9ydCB7IEpvYiB9IGZyb20gJ21ldGVvci92c2l2c2k6am9iLWNvbGxlY3Rpb24nO1xuaW1wb3J0IHsgREFwcEpvYnMgfSBmcm9tICcuLi8uLi8uLi8uLi9zZXJ2ZXIvYXBpL2RhcHBfam9icy5qcyc7XG5cbmNvbnN0IEFkZEZldGNoRG9pTWFpbERhdGFKb2JTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgbmFtZToge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9LFxuICBkb21haW46IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfVxufSk7XG5cbmNvbnN0IGFkZEZldGNoRG9pTWFpbERhdGFKb2IgPSAoZGF0YSkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IG91ckRhdGEgPSBkYXRhO1xuICAgIEFkZEZldGNoRG9pTWFpbERhdGFKb2JTY2hlbWEudmFsaWRhdGUob3VyRGF0YSk7XG4gICAgY29uc3Qgam9iID0gbmV3IEpvYihEQXBwSm9icywgJ2ZldGNoRG9pTWFpbERhdGEnLCBvdXJEYXRhKTtcbiAgICBqb2IucmV0cnkoe3JldHJpZXM6IDUsIHdhaXQ6IDEqMTAqMTAwMCB9KS5zYXZlKCk7IC8vY2hlY2sgZXZlcnkgMTAgc2VjcyA1IHRpbWVzXG4gIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2pvYnMuYWRkRmV0Y2hEb2lNYWlsRGF0YS5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBhZGRGZXRjaERvaU1haWxEYXRhSm9iO1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgeyBKb2IgfSBmcm9tICdtZXRlb3IvdnNpdnNpOmpvYi1jb2xsZWN0aW9uJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcbmltcG9ydCB7IEJsb2NrY2hhaW5Kb2JzIH0gZnJvbSAnLi4vLi4vLi4vLi4vc2VydmVyL2FwaS9ibG9ja2NoYWluX2pvYnMuanMnO1xuXG5jb25zdCBBZGRJbnNlcnRCbG9ja2NoYWluSm9iU2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIG5hbWVJZDoge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9LFxuICBzaWduYXR1cmU6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfSxcbiAgZGF0YUhhc2g6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgb3B0aW9uYWw6dHJ1ZVxuICB9LFxuICBkb21haW46IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfSxcbiAgc29pRGF0ZToge1xuICAgIHR5cGU6IERhdGVcbiAgfVxufSk7XG5cbmNvbnN0IGFkZEluc2VydEJsb2NrY2hhaW5Kb2IgPSAoZW50cnkpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBvdXJFbnRyeSA9IGVudHJ5O1xuICAgIEFkZEluc2VydEJsb2NrY2hhaW5Kb2JTY2hlbWEudmFsaWRhdGUob3VyRW50cnkpO1xuICAgIGNvbnN0IGpvYiA9IG5ldyBKb2IoQmxvY2tjaGFpbkpvYnMsICdpbnNlcnQnLCBvdXJFbnRyeSk7XG4gICAgam9iLnJldHJ5KHtyZXRyaWVzOiAxMCwgd2FpdDogMyo2MCoxMDAwIH0pLnNhdmUoKTsgLy9jaGVjayBldmVyeSAxMHNlYyBmb3IgMWhcbiAgfSBjYXRjaCAoZXhjZXB0aW9uKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignam9icy5hZGRJbnNlcnRCbG9ja2NoYWluLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGFkZEluc2VydEJsb2NrY2hhaW5Kb2I7XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCB7IEpvYiB9IGZyb20gJ21ldGVvci92c2l2c2k6am9iLWNvbGxlY3Rpb24nO1xuaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tICdzaW1wbC1zY2hlbWEnO1xuaW1wb3J0IHsgTWFpbEpvYnMgfSBmcm9tICcuLi8uLi8uLi8uLi9zZXJ2ZXIvYXBpL21haWxfam9icy5qcyc7XG5cbmNvbnN0IEFkZFNlbmRNYWlsSm9iU2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIC8qZnJvbToge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICByZWdFeDogU2ltcGxlU2NoZW1hLlJlZ0V4LkVtYWlsXG4gIH0sKi9cbiAgdG86IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgcmVnRXg6IFNpbXBsZVNjaGVtYS5SZWdFeC5FbWFpbFxuICB9LFxuICBzdWJqZWN0OiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICB9LFxuICBtZXNzYWdlOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICB9LFxuICByZXR1cm5QYXRoOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIHJlZ0V4OiBTaW1wbGVTY2hlbWEuUmVnRXguRW1haWxcbiAgfVxufSk7XG5cbmNvbnN0IGFkZFNlbmRNYWlsSm9iID0gKG1haWwpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBvdXJNYWlsID0gbWFpbDtcbiAgICBBZGRTZW5kTWFpbEpvYlNjaGVtYS52YWxpZGF0ZShvdXJNYWlsKTtcbiAgICBjb25zdCBqb2IgPSBuZXcgSm9iKE1haWxKb2JzLCAnc2VuZCcsIG91ck1haWwpO1xuICAgIGpvYi5yZXRyeSh7cmV0cmllczogNSwgd2FpdDogNjAqMTAwMCB9KS5zYXZlKCk7XG4gIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2pvYnMuYWRkU2VuZE1haWwuZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgYWRkU2VuZE1haWxKb2I7XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcbmltcG9ydCB7IEpvYiB9IGZyb20gJ21ldGVvci92c2l2c2k6am9iLWNvbGxlY3Rpb24nO1xuaW1wb3J0IHsgQmxvY2tjaGFpbkpvYnMgfSBmcm9tICcuLi8uLi8uLi8uLi9zZXJ2ZXIvYXBpL2Jsb2NrY2hhaW5fam9icy5qcyc7XG5cbmNvbnN0IEFkZFVwZGF0ZUJsb2NrY2hhaW5Kb2JTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgbmFtZUlkOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH0sXG4gIHZhbHVlOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH0sXG4gIGZyb21Ib3N0VXJsOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH0sXG4gIGhvc3Q6IHtcbiAgICAgIHR5cGU6IFN0cmluZ1xuICB9XG59KTtcblxuY29uc3QgYWRkVXBkYXRlQmxvY2tjaGFpbkpvYiA9IChlbnRyeSkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IG91ckVudHJ5ID0gZW50cnk7XG4gICAgQWRkVXBkYXRlQmxvY2tjaGFpbkpvYlNjaGVtYS52YWxpZGF0ZShvdXJFbnRyeSk7XG4gICAgY29uc3Qgam9iID0gbmV3IEpvYihCbG9ja2NoYWluSm9icywgJ3VwZGF0ZScsIG91ckVudHJ5KTtcbiAgICBqb2IucmV0cnkoe3JldHJpZXM6IDM2MCwgd2FpdDogMSoxMCoxMDAwIH0pLnNhdmUoKTtcbiAgfSBjYXRjaCAoZXhjZXB0aW9uKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignam9icy5hZGRVcGRhdGVCbG9ja2NoYWluLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGFkZFVwZGF0ZUJsb2NrY2hhaW5Kb2I7XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCBpMThuIGZyb20gJ21ldGVvci91bml2ZXJzZTppMThuJztcblxuLy8gdW5pdmVyc2U6aTE4biBvbmx5IGJ1bmRsZXMgdGhlIGRlZmF1bHQgbGFuZ3VhZ2Ugb24gdGhlIGNsaWVudCBzaWRlLlxuLy8gVG8gZ2V0IGEgbGlzdCBvZiBhbGwgYXZpYWxibGUgbGFuZ3VhZ2VzIHdpdGggYXQgbGVhc3Qgb25lIHRyYW5zbGF0aW9uLFxuLy8gaTE4bi5nZXRMYW5ndWFnZXMoKSBtdXN0IGJlIGNhbGxlZCBzZXJ2ZXIgc2lkZS5cbmNvbnN0IGdldExhbmd1YWdlcyA9ICgpID0+IHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gaTE4bi5nZXRMYW5ndWFnZXMoKTtcbiAgfSBjYXRjaCAoZXhjZXB0aW9uKSB7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignbGFuZ3VhZ2VzLmdldC5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBnZXRMYW5ndWFnZXM7XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcbmltcG9ydCB7IE1ldGEgfSBmcm9tICcuLi8uLi8uLi9hcGkvbWV0YS9tZXRhLmpzJztcblxuY29uc3QgQWRkT3JVcGRhdGVNZXRhU2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIGtleToge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9LFxuICB2YWx1ZToge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9XG59KTtcblxuY29uc3QgYWRkT3JVcGRhdGVNZXRhID0gKGRhdGEpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBvdXJEYXRhID0gZGF0YTtcbiAgICBBZGRPclVwZGF0ZU1ldGFTY2hlbWEudmFsaWRhdGUob3VyRGF0YSk7XG4gICAgY29uc3QgbWV0YSA9IE1ldGEuZmluZE9uZSh7a2V5OiBvdXJEYXRhLmtleX0pO1xuICAgIGlmKG1ldGEgIT09IHVuZGVmaW5lZCkgTWV0YS51cGRhdGUoe19pZCA6IG1ldGEuX2lkfSwgeyRzZXQ6IHtcbiAgICAgIHZhbHVlOiBvdXJEYXRhLnZhbHVlXG4gICAgfX0pO1xuICAgIGVsc2UgcmV0dXJuIE1ldGEuaW5zZXJ0KHtcbiAgICAgIGtleTogb3VyRGF0YS5rZXksXG4gICAgICB2YWx1ZTogb3VyRGF0YS52YWx1ZVxuICAgIH0pXG4gIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ21ldGEuYWRkT3JVcGRhdGUuZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgYWRkT3JVcGRhdGVNZXRhO1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XG5pbXBvcnQgeyBPcHRJbnMgfSBmcm9tICcuLi8uLi8uLi9hcGkvb3B0LWlucy9vcHQtaW5zLmpzJztcblxuY29uc3QgQWRkT3B0SW5TY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgbmFtZToge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9XG59KTtcblxuY29uc3QgYWRkT3B0SW4gPSAob3B0SW4pID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBvdXJPcHRJbiA9IG9wdEluO1xuICAgIEFkZE9wdEluU2NoZW1hLnZhbGlkYXRlKG91ck9wdEluKTtcbiAgICBjb25zdCBvcHRJbnMgPSBPcHRJbnMuZmluZCh7bmFtZUlkOiBvdXJPcHRJbi5uYW1lfSkuZmV0Y2goKTtcbiAgICBpZihvcHRJbnMubGVuZ3RoID4gMCkgcmV0dXJuIG9wdEluc1swXS5faWQ7XG4gICAgY29uc3Qgb3B0SW5JZCA9IE9wdElucy5pbnNlcnQoe1xuICAgICAgbmFtZUlkOiBvdXJPcHRJbi5uYW1lXG4gICAgfSk7XG4gICAgcmV0dXJuIG9wdEluSWQ7XG4gIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ29wdC1pbnMuYWRkLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGFkZE9wdEluO1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XG5pbXBvcnQgYWRkUmVjaXBpZW50IGZyb20gJy4uL3JlY2lwaWVudHMvYWRkLmpzJztcbmltcG9ydCBhZGRTZW5kZXIgZnJvbSAnLi4vc2VuZGVycy9hZGQuanMnO1xuaW1wb3J0IHsgT3B0SW5zIH0gZnJvbSAnLi4vLi4vLi4vYXBpL29wdC1pbnMvb3B0LWlucy5qcyc7XG5pbXBvcnQgd3JpdGVUb0Jsb2NrY2hhaW4gZnJvbSAnLi4vZG9pY2hhaW4vd3JpdGVfdG9fYmxvY2tjaGFpbi5qcyc7XG5pbXBvcnQge2xvZ0Vycm9yLCBsb2dTZW5kfSBmcm9tIFwiLi4vLi4vLi4vc3RhcnR1cC9zZXJ2ZXIvbG9nLWNvbmZpZ3VyYXRpb25cIjtcblxuXG5jb25zdCBBZGRPcHRJblNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICByZWNpcGllbnRfbWFpbDoge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICByZWdFeDogU2ltcGxlU2NoZW1hLlJlZ0V4LkVtYWlsXG4gIH0sXG4gIHNlbmRlcl9tYWlsOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIHJlZ0V4OiBTaW1wbGVTY2hlbWEuUmVnRXguRW1haWxcbiAgfSxcbiAgZGF0YToge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICBvcHRpb25hbDogdHJ1ZVxuICB9LFxuICBtYXN0ZXJfZG9pOiB7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICBvcHRpb25hbDogdHJ1ZVxuICB9LFxuICBpbmRleDoge1xuICAgICAgdHlwZTogU2ltcGxlU2NoZW1hLkludGVnZXIsXG4gICAgICBvcHRpb25hbDogdHJ1ZVxuICB9LFxuICBvd25lcklkOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIHJlZ0V4OiBTaW1wbGVTY2hlbWEuUmVnRXguaWRcbiAgfVxufSk7XG5cbmNvbnN0IGFkZE9wdEluID0gKG9wdEluKSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3Qgb3VyT3B0SW4gPSBvcHRJbjtcbiAgICBBZGRPcHRJblNjaGVtYS52YWxpZGF0ZShvdXJPcHRJbik7XG5cbiAgICBjb25zdCByZWNpcGllbnQgPSB7XG4gICAgICBlbWFpbDogb3VyT3B0SW4ucmVjaXBpZW50X21haWxcbiAgICB9XG4gICAgY29uc3QgcmVjaXBpZW50SWQgPSBhZGRSZWNpcGllbnQocmVjaXBpZW50KTtcbiAgICBjb25zdCBzZW5kZXIgPSB7XG4gICAgICBlbWFpbDogb3VyT3B0SW4uc2VuZGVyX21haWxcbiAgICB9XG4gICAgY29uc3Qgc2VuZGVySWQgPSBhZGRTZW5kZXIoc2VuZGVyKTtcbiAgICBcbiAgICBjb25zdCBvcHRJbnMgPSBPcHRJbnMuZmluZCh7cmVjaXBpZW50OiByZWNpcGllbnRJZCwgc2VuZGVyOiBzZW5kZXJJZH0pLmZldGNoKCk7XG4gICAgaWYob3B0SW5zLmxlbmd0aCA+IDApIHJldHVybiBvcHRJbnNbMF0uX2lkOyAvL1RPRE8gd2hlbiBTT0kgYWxyZWFkeSBleGlzdHMgcmVzZW5kIGVtYWlsP1xuXG4gICAgaWYob3VyT3B0SW4uZGF0YSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0cnkge1xuICAgICAgICBKU09OLnBhcnNlKG91ck9wdEluLmRhdGEpO1xuICAgICAgfSBjYXRjaChlcnJvcikge1xuICAgICAgICBsb2dFcnJvcihcIm91ck9wdEluLmRhdGE6XCIsb3VyT3B0SW4uZGF0YSk7XG4gICAgICAgIHRocm93IFwiSW52YWxpZCBkYXRhIGpzb24gXCI7XG4gICAgICB9XG4gICAgfVxuICAgIFxuICAgIGNvbnN0IG9wdEluSWQgPSBPcHRJbnMuaW5zZXJ0KHtcbiAgICAgIHJlY2lwaWVudDogcmVjaXBpZW50SWQsXG4gICAgICBzZW5kZXI6IHNlbmRlcklkLFxuICAgICAgaW5kZXg6IG91ck9wdEluLmluZGV4LFxuICAgICAgbWFzdGVyRG9pIDogb3VyT3B0SW4ubWFzdGVyX2RvaSxcbiAgICAgIGRhdGE6IG91ck9wdEluLmRhdGEsXG4gICAgICBvd25lcklkOiBvdXJPcHRJbi5vd25lcklkXG4gICAgfSk7XG4gICAgbG9nU2VuZChcIm9wdEluIChpbmRleDpcIitvdXJPcHRJbi5pbmRleCtcIiBhZGRlZCB0byBsb2NhbCBkYiB3aXRoIG9wdEluSWRcIixvcHRJbklkKTtcblxuICAgIHdyaXRlVG9CbG9ja2NoYWluKHtpZDogb3B0SW5JZH0pO1xuICAgIHJldHVybiBvcHRJbklkO1xuICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdvcHQtaW5zLmFkZEFuZFdyaXRlVG9CbG9ja2NoYWluLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGFkZE9wdEluO1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XG5pbXBvcnQgeyBDT05GSVJNX0NMSUVOVCwgQ09ORklSTV9BRERSRVNTIH0gZnJvbSAnLi4vLi4vLi4vc3RhcnR1cC9zZXJ2ZXIvZG9pY2hhaW4tY29uZmlndXJhdGlvbi5qcyc7XG5pbXBvcnQgeyBPcHRJbnMgfSBmcm9tICcuLi8uLi8uLi9hcGkvb3B0LWlucy9vcHQtaW5zLmpzJztcbmltcG9ydCB7IERvaWNoYWluRW50cmllcyB9IGZyb20gJy4uLy4uLy4uL2FwaS9kb2ljaGFpbi9lbnRyaWVzLmpzJztcbmltcG9ydCBkZWNvZGVEb2lIYXNoIGZyb20gJy4uL2VtYWlscy9kZWNvZGVfZG9pLWhhc2guanMnO1xuaW1wb3J0IHsgc2lnbk1lc3NhZ2UgfSBmcm9tICcuLi8uLi8uLi8uLi9zZXJ2ZXIvYXBpL2RvaWNoYWluLmpzJztcbmltcG9ydCBhZGRVcGRhdGVCbG9ja2NoYWluSm9iIGZyb20gJy4uL2pvYnMvYWRkX3VwZGF0ZV9ibG9ja2NoYWluLmpzJztcbmltcG9ydCB7bG9nQ29uZmlybX0gZnJvbSBcIi4uLy4uLy4uL3N0YXJ0dXAvc2VydmVyL2xvZy1jb25maWd1cmF0aW9uXCI7XG5cbmNvbnN0IENvbmZpcm1PcHRJblNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICBob3N0OiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH0sXG4gIGhhc2g6IHtcbiAgICB0eXBlOiBTdHJpbmdcbiAgfVxufSk7XG5cbmNvbnN0IGNvbmZpcm1PcHRJbiA9IChyZXF1ZXN0KSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3Qgb3VyUmVxdWVzdCA9IHJlcXVlc3Q7XG4gICAgQ29uZmlybU9wdEluU2NoZW1hLnZhbGlkYXRlKG91clJlcXVlc3QpO1xuICAgIGNvbnN0IGRlY29kZWQgPSBkZWNvZGVEb2lIYXNoKHtoYXNoOiByZXF1ZXN0Lmhhc2h9KTtcbiAgICBjb25zdCBvcHRJbiA9IE9wdElucy5maW5kT25lKHtfaWQ6IGRlY29kZWQuaWR9KTtcbiAgICBpZihvcHRJbiA9PT0gdW5kZWZpbmVkIHx8IG9wdEluLmNvbmZpcm1hdGlvblRva2VuICE9PSBkZWNvZGVkLnRva2VuKSB0aHJvdyBcIkludmFsaWQgaGFzaFwiO1xuICAgIGNvbnN0IGNvbmZpcm1lZEF0ID0gbmV3IERhdGUoKTtcblxuICAgIE9wdElucy51cGRhdGUoe19pZCA6IG9wdEluLl9pZH0seyRzZXQ6e2NvbmZpcm1lZEF0OiBjb25maXJtZWRBdCwgY29uZmlybWVkQnk6IG91clJlcXVlc3QuaG9zdH0sICR1bnNldDoge2NvbmZpcm1hdGlvblRva2VuOiBcIlwifX0pO1xuXG4gICAgLy9UT0RPIGhlcmUgZmluZCBhbGwgRG9pY2hhaW5FbnRyaWVzIGluIHRoZSBsb2NhbCBkYXRhYmFzZSAgYW5kIGJsb2NrY2hhaW4gd2l0aCB0aGUgc2FtZSBtYXN0ZXJEb2lcbiAgICBjb25zdCBlbnRyaWVzID0gRG9pY2hhaW5FbnRyaWVzLmZpbmQoeyRvcjogW3tuYW1lOiBvcHRJbi5uYW1lSWR9LCB7bWFzdGVyRG9pOiBvcHRJbi5uYW1lSWR9XX0pO1xuICAgIGlmKGVudHJpZXMgPT09IHVuZGVmaW5lZCkgdGhyb3cgXCJEb2ljaGFpbiBlbnRyeS9lbnRyaWVzIG5vdCBmb3VuZFwiO1xuXG4gICAgZW50cmllcy5mb3JFYWNoKGVudHJ5ID0+IHtcbiAgICAgICAgbG9nQ29uZmlybSgnY29uZmlybWluZyBEb2lDaGFpbkVudHJ5OicsZW50cnkpO1xuXG4gICAgICAgIGNvbnN0IHZhbHVlID0gSlNPTi5wYXJzZShlbnRyeS52YWx1ZSk7XG4gICAgICAgIGxvZ0NvbmZpcm0oJ2dldFNpZ25hdHVyZSAob25seSBvZiB2YWx1ZSEpJywgdmFsdWUpO1xuXG4gICAgICAgIGNvbnN0IGRvaVNpZ25hdHVyZSA9IHNpZ25NZXNzYWdlKENPTkZJUk1fQ0xJRU5ULCBDT05GSVJNX0FERFJFU1MsIHZhbHVlLnNpZ25hdHVyZSk7XG4gICAgICAgIGxvZ0NvbmZpcm0oJ2dvdCBkb2lTaWduYXR1cmU6Jyxkb2lTaWduYXR1cmUpO1xuICAgICAgICBjb25zdCBmcm9tSG9zdFVybCA9IHZhbHVlLmZyb207XG5cbiAgICAgICAgZGVsZXRlIHZhbHVlLmZyb207XG4gICAgICAgIHZhbHVlLmRvaVRpbWVzdGFtcCA9IGNvbmZpcm1lZEF0LnRvSVNPU3RyaW5nKCk7XG4gICAgICAgIHZhbHVlLmRvaVNpZ25hdHVyZSA9IGRvaVNpZ25hdHVyZTtcbiAgICAgICAgY29uc3QganNvblZhbHVlID0gSlNPTi5zdHJpbmdpZnkodmFsdWUpO1xuICAgICAgICBsb2dDb25maXJtKCd1cGRhdGluZyBEb2ljaGFpbiBuYW1lSWQ6JytvcHRJbi5uYW1lSWQrJyB3aXRoIHZhbHVlOicsanNvblZhbHVlKTtcblxuICAgICAgICBhZGRVcGRhdGVCbG9ja2NoYWluSm9iKHtcbiAgICAgICAgICAgIG5hbWVJZDogZW50cnkubmFtZSxcbiAgICAgICAgICAgIHZhbHVlOiBqc29uVmFsdWUsXG4gICAgICAgICAgICBmcm9tSG9zdFVybDogZnJvbUhvc3RVcmwsXG4gICAgICAgICAgICBob3N0OiBvdXJSZXF1ZXN0Lmhvc3RcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gICAgbG9nQ29uZmlybSgncmVkaXJlY3RpbmcgdXNlciB0bzonLGRlY29kZWQucmVkaXJlY3QpO1xuICAgIHJldHVybiBkZWNvZGVkLnJlZGlyZWN0O1xuICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdvcHQtaW5zLmNvbmZpcm0uZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgY29uZmlybU9wdEluXG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcbmltcG9ydCB7IHJhbmRvbUJ5dGVzIH0gZnJvbSAnY3J5cHRvJztcbmltcG9ydCB7IE9wdElucyB9IGZyb20gJy4uLy4uLy4uL2FwaS9vcHQtaW5zL29wdC1pbnMuanMnO1xuXG5jb25zdCBHZW5lcmF0ZURvaVRva2VuU2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIGlkOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH1cbn0pO1xuXG5jb25zdCBnZW5lcmF0ZURvaVRva2VuID0gKG9wdEluKSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3Qgb3VyT3B0SW4gPSBvcHRJbjtcbiAgICBHZW5lcmF0ZURvaVRva2VuU2NoZW1hLnZhbGlkYXRlKG91ck9wdEluKTtcbiAgICBjb25zdCB0b2tlbiA9IHJhbmRvbUJ5dGVzKDMyKS50b1N0cmluZygnaGV4Jyk7XG4gICAgT3B0SW5zLnVwZGF0ZSh7X2lkIDogb3VyT3B0SW4uaWR9LHskc2V0Ontjb25maXJtYXRpb25Ub2tlbjogdG9rZW59fSk7XG4gICAgcmV0dXJuIHRva2VuO1xuICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdvcHQtaW5zLmdlbmVyYXRlX2RvaS10b2tlbi5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBnZW5lcmF0ZURvaVRva2VuXG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcbmltcG9ydCB7IE9wdElucyB9IGZyb20gJy4uLy4uLy4uL2FwaS9vcHQtaW5zL29wdC1pbnMuanMnO1xuaW1wb3J0IHsgUmVjaXBpZW50cyB9IGZyb20gJy4uLy4uLy4uL2FwaS9yZWNpcGllbnRzL3JlY2lwaWVudHMuanMnO1xuaW1wb3J0IHZlcmlmeVNpZ25hdHVyZSBmcm9tICcuLi9kb2ljaGFpbi92ZXJpZnlfc2lnbmF0dXJlLmpzJztcbmltcG9ydCB7bG9nU2VuZH0gZnJvbSBcIi4uLy4uLy4uL3N0YXJ0dXAvc2VydmVyL2xvZy1jb25maWd1cmF0aW9uXCI7XG5pbXBvcnQgZ2V0UHVibGljS2V5QW5kQWRkcmVzcyBmcm9tIFwiLi4vZG9pY2hhaW4vZ2V0X3B1YmxpY2tleV9hbmRfYWRkcmVzc19ieV9kb21haW5cIjtcblxuY29uc3QgVXBkYXRlT3B0SW5TdGF0dXNTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgbmFtZUlkOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH0sXG4gIHNpZ25hdHVyZToge1xuICAgIHR5cGU6IFN0cmluZ1xuICB9LFxuICBob3N0OiB7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICBvcHRpb25hbDogdHJ1ZVxuICB9XG59KTtcblxuXG5jb25zdCB1cGRhdGVPcHRJblN0YXR1cyA9IChkYXRhKSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3Qgb3VyRGF0YSA9IGRhdGE7XG4gICAgbG9nU2VuZCgnY29uZmlybSBkQXBwIGNvbmZpcm1zIG9wdEluOicsSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xuICAgIFVwZGF0ZU9wdEluU3RhdHVzU2NoZW1hLnZhbGlkYXRlKG91ckRhdGEpO1xuICAgIGNvbnN0IG9wdEluID0gT3B0SW5zLmZpbmRPbmUoe25hbWVJZDogb3VyRGF0YS5uYW1lSWR9KTtcbiAgICBpZihvcHRJbiA9PT0gdW5kZWZpbmVkKSB0aHJvdyBcIk9wdC1JbiBub3QgZm91bmRcIjtcbiAgICBsb2dTZW5kKCdjb25maXJtIGRBcHAgY29uZmlybXMgb3B0SW46JyxvdXJEYXRhLm5hbWVJZCk7XG5cbiAgICBjb25zdCByZWNpcGllbnQgPSBSZWNpcGllbnRzLmZpbmRPbmUoe19pZDogb3B0SW4ucmVjaXBpZW50fSk7XG4gICAgaWYocmVjaXBpZW50ID09PSB1bmRlZmluZWQpIHRocm93IFwiUmVjaXBpZW50IG5vdCBmb3VuZFwiO1xuICAgIGNvbnN0IHBhcnRzID0gcmVjaXBpZW50LmVtYWlsLnNwbGl0KFwiQFwiKTtcbiAgICBjb25zdCBkb21haW4gPSBwYXJ0c1twYXJ0cy5sZW5ndGgtMV07XG4gICAgY29uc3QgcHVibGljS2V5QW5kQWRkcmVzcyA9IGdldFB1YmxpY0tleUFuZEFkZHJlc3Moe2RvbWFpbjpkb21haW59KTtcblxuICAgIC8vVE9ETyBnZXR0aW5nIGluZm9ybWF0aW9uIGZyb20gQm9iIHRoYXQgYSBjZXJ0YWluIG5hbWVJZCAoRE9JKSBnb3QgY29uZmlybWVkLlxuICAgIGlmKCF2ZXJpZnlTaWduYXR1cmUoe3B1YmxpY0tleTogcHVibGljS2V5QW5kQWRkcmVzcy5wdWJsaWNLZXksIGRhdGE6IG91ckRhdGEubmFtZUlkLCBzaWduYXR1cmU6IG91ckRhdGEuc2lnbmF0dXJlfSkpIHtcbiAgICAgIHRocm93IFwiQWNjZXNzIGRlbmllZFwiO1xuICAgIH1cbiAgICBsb2dTZW5kKCdzaWduYXR1cmUgdmFsaWQgZm9yIHB1YmxpY0tleScsIHB1YmxpY0tleUFuZEFkZHJlc3MucHVibGljS2V5KTtcblxuICAgIE9wdElucy51cGRhdGUoe19pZCA6IG9wdEluLl9pZH0seyRzZXQ6e2NvbmZpcm1lZEF0OiBuZXcgRGF0ZSgpLCBjb25maXJtZWRCeTogb3VyRGF0YS5ob3N0fX0pO1xuICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdkYXBwcy5zZW5kLnVwZGF0ZU9wdEluU3RhdHVzLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IHVwZGF0ZU9wdEluU3RhdHVzO1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XG5pbXBvcnQgeyBWRVJJRllfQ0xJRU5UIH0gZnJvbSAnLi4vLi4vLi4vc3RhcnR1cC9zZXJ2ZXIvZG9pY2hhaW4tY29uZmlndXJhdGlvbi5qcyc7XG5pbXBvcnQgeyBuYW1lU2hvdyB9IGZyb20gJy4uLy4uLy4uLy4uL3NlcnZlci9hcGkvZG9pY2hhaW4uanMnO1xuaW1wb3J0IGdldE9wdEluUHJvdmlkZXIgZnJvbSAnLi4vZG5zL2dldF9vcHQtaW4tcHJvdmlkZXIuanMnO1xuaW1wb3J0IGdldE9wdEluS2V5IGZyb20gJy4uL2Rucy9nZXRfb3B0LWluLWtleS5qcyc7XG5pbXBvcnQgdmVyaWZ5U2lnbmF0dXJlIGZyb20gJy4uL2RvaWNoYWluL3ZlcmlmeV9zaWduYXR1cmUuanMnO1xuaW1wb3J0IHtsb2dWZXJpZnl9IGZyb20gXCIuLi8uLi8uLi9zdGFydHVwL3NlcnZlci9sb2ctY29uZmlndXJhdGlvblwiO1xuaW1wb3J0IGdldFB1YmxpY0tleUFuZEFkZHJlc3MgZnJvbSBcIi4uL2RvaWNoYWluL2dldF9wdWJsaWNrZXlfYW5kX2FkZHJlc3NfYnlfZG9tYWluXCI7XG5cbmNvbnN0IFZlcmlmeU9wdEluU2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gIHJlY2lwaWVudF9tYWlsOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIHJlZ0V4OiBTaW1wbGVTY2hlbWEuUmVnRXguRW1haWxcbiAgfSxcbiAgc2VuZGVyX21haWw6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgcmVnRXg6IFNpbXBsZVNjaGVtYS5SZWdFeC5FbWFpbFxuICB9LFxuICBuYW1lX2lkOiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH0sXG4gIHJlY2lwaWVudF9wdWJsaWNfa2V5OiB7XG4gICAgdHlwZTogU3RyaW5nXG4gIH1cbn0pO1xuXG5jb25zdCB2ZXJpZnlPcHRJbiA9IChkYXRhKSA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3Qgb3VyRGF0YSA9IGRhdGE7XG4gICAgVmVyaWZ5T3B0SW5TY2hlbWEudmFsaWRhdGUob3VyRGF0YSk7XG4gICAgY29uc3QgZW50cnkgPSBuYW1lU2hvdyhWRVJJRllfQ0xJRU5ULCBvdXJEYXRhLm5hbWVfaWQpO1xuICAgIGlmKGVudHJ5ID09PSB1bmRlZmluZWQpIHJldHVybiBmYWxzZTtcbiAgICBjb25zdCBlbnRyeURhdGEgPSBKU09OLnBhcnNlKGVudHJ5LnZhbHVlKTtcbiAgICBjb25zdCBmaXJzdENoZWNrID0gdmVyaWZ5U2lnbmF0dXJlKHtcbiAgICAgIGRhdGE6IG91ckRhdGEucmVjaXBpZW50X21haWwrb3VyRGF0YS5zZW5kZXJfbWFpbCxcbiAgICAgIHNpZ25hdHVyZTogZW50cnlEYXRhLnNpZ25hdHVyZSxcbiAgICAgIHB1YmxpY0tleTogb3VyRGF0YS5yZWNpcGllbnRfcHVibGljX2tleVxuICAgIH0pXG5cbiAgICBpZighZmlyc3RDaGVjaykgcmV0dXJuIHtmaXJzdENoZWNrOiBmYWxzZX07XG4gICAgY29uc3QgcGFydHMgPSBvdXJEYXRhLnJlY2lwaWVudF9tYWlsLnNwbGl0KFwiQFwiKTsgLy9UT0RPIHB1dCB0aGlzIGludG8gZ2V0UHVibGljS2V5QW5kQWRkcmVzc1xuICAgIGNvbnN0IGRvbWFpbiA9IHBhcnRzW3BhcnRzLmxlbmd0aC0xXTtcbiAgICBjb25zdCBwdWJsaWNLZXlBbmRBZGRyZXNzID0gZ2V0UHVibGljS2V5QW5kQWRkcmVzcyh7ZG9tYWluOiBkb21haW59KTtcblxuICAgIGNvbnN0IHNlY29uZENoZWNrID0gdmVyaWZ5U2lnbmF0dXJlKHtcbiAgICAgIGRhdGE6IGVudHJ5RGF0YS5zaWduYXR1cmUsXG4gICAgICBzaWduYXR1cmU6IGVudHJ5RGF0YS5kb2lTaWduYXR1cmUsXG4gICAgICBwdWJsaWNLZXk6IHB1YmxpY0tleUFuZEFkZHJlc3MucHVibGljS2V5XG4gICAgfSlcblxuICAgIGlmKCFzZWNvbmRDaGVjaykgcmV0dXJuIHtzZWNvbmRDaGVjazogZmFsc2V9O1xuICAgIHJldHVybiB0cnVlO1xuICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdvcHQtaW5zLnZlcmlmeS5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCB2ZXJpZnlPcHRJblxuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XG5pbXBvcnQgeyBSZWNpcGllbnRzIH0gZnJvbSAnLi4vLi4vLi4vYXBpL3JlY2lwaWVudHMvcmVjaXBpZW50cy5qcyc7XG5pbXBvcnQgZ2V0S2V5UGFpciBmcm9tICcuLi9kb2ljaGFpbi9nZXRfa2V5LXBhaXIuanMnO1xuXG5jb25zdCBBZGRSZWNpcGllbnRTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgZW1haWw6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgcmVnRXg6IFNpbXBsZVNjaGVtYS5SZWdFeC5FbWFpbFxuICB9XG59KTtcblxuY29uc3QgYWRkUmVjaXBpZW50ID0gKHJlY2lwaWVudCkgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IG91clJlY2lwaWVudCA9IHJlY2lwaWVudDtcbiAgICBBZGRSZWNpcGllbnRTY2hlbWEudmFsaWRhdGUob3VyUmVjaXBpZW50KTtcbiAgICBjb25zdCByZWNpcGllbnRzID0gUmVjaXBpZW50cy5maW5kKHtlbWFpbDogcmVjaXBpZW50LmVtYWlsfSkuZmV0Y2goKTtcbiAgICBpZihyZWNpcGllbnRzLmxlbmd0aCA+IDApIHJldHVybiByZWNpcGllbnRzWzBdLl9pZDtcbiAgICBjb25zdCBrZXlQYWlyID0gZ2V0S2V5UGFpcigpO1xuICAgIHJldHVybiBSZWNpcGllbnRzLmluc2VydCh7XG4gICAgICBlbWFpbDogb3VyUmVjaXBpZW50LmVtYWlsLFxuICAgICAgcHJpdmF0ZUtleToga2V5UGFpci5wcml2YXRlS2V5LFxuICAgICAgcHVibGljS2V5OiBrZXlQYWlyLnB1YmxpY0tleVxuICAgIH0pXG4gIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ3JlY2lwaWVudHMuYWRkLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGFkZFJlY2lwaWVudDtcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tICdzaW1wbC1zY2hlbWEnO1xuaW1wb3J0IHsgU2VuZGVycyB9IGZyb20gJy4uLy4uLy4uL2FwaS9zZW5kZXJzL3NlbmRlcnMuanMnO1xuXG5jb25zdCBBZGRTZW5kZXJTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgZW1haWw6IHtcbiAgICB0eXBlOiBTdHJpbmcsXG4gICAgcmVnRXg6IFNpbXBsZVNjaGVtYS5SZWdFeC5FbWFpbFxuICB9XG59KTtcblxuY29uc3QgYWRkU2VuZGVyID0gKHNlbmRlcikgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IG91clNlbmRlciA9IHNlbmRlcjtcbiAgICBBZGRTZW5kZXJTY2hlbWEudmFsaWRhdGUob3VyU2VuZGVyKTtcbiAgICBjb25zdCBzZW5kZXJzID0gU2VuZGVycy5maW5kKHtlbWFpbDogc2VuZGVyLmVtYWlsfSkuZmV0Y2goKTtcbiAgICBpZihzZW5kZXJzLmxlbmd0aCA+IDApIHJldHVybiBzZW5kZXJzWzBdLl9pZDtcbiAgICByZXR1cm4gU2VuZGVycy5pbnNlcnQoe1xuICAgICAgZW1haWw6IG91clNlbmRlci5lbWFpbFxuICAgIH0pXG4gIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ3NlbmRlcnMuYWRkLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGFkZFNlbmRlcjtcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuXG5leHBvcnQgZnVuY3Rpb24gaXNEZWJ1ZygpIHtcbiAgaWYoTWV0ZW9yLnNldHRpbmdzICE9PSB1bmRlZmluZWQgJiZcbiAgICAgTWV0ZW9yLnNldHRpbmdzLmFwcCAhPT0gdW5kZWZpbmVkICYmXG4gICAgIE1ldGVvci5zZXR0aW5ncy5hcHAuZGVidWcgIT09IHVuZGVmaW5lZCkgcmV0dXJuIE1ldGVvci5zZXR0aW5ncy5hcHAuZGVidWdcbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNSZWd0ZXN0KCkge1xuICBpZihNZXRlb3Iuc2V0dGluZ3MgIT09IHVuZGVmaW5lZCAmJlxuICAgICBNZXRlb3Iuc2V0dGluZ3MuYXBwICE9PSB1bmRlZmluZWQgJiZcbiAgICAgTWV0ZW9yLnNldHRpbmdzLmFwcC5yZWd0ZXN0ICE9PSB1bmRlZmluZWQpIHJldHVybiBNZXRlb3Iuc2V0dGluZ3MuYXBwLnJlZ3Rlc3RcbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNUZXN0bmV0KCkge1xuICAgIGlmKE1ldGVvci5zZXR0aW5ncyAhPT0gdW5kZWZpbmVkICYmXG4gICAgICAgIE1ldGVvci5zZXR0aW5ncy5hcHAgIT09IHVuZGVmaW5lZCAmJlxuICAgICAgICBNZXRlb3Iuc2V0dGluZ3MuYXBwLnRlc3RuZXQgIT09IHVuZGVmaW5lZCkgcmV0dXJuIE1ldGVvci5zZXR0aW5ncy5hcHAudGVzdG5ldFxuICAgIHJldHVybiBmYWxzZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFVybCgpIHtcbiAgaWYoTWV0ZW9yLnNldHRpbmdzICE9PSB1bmRlZmluZWQgJiZcbiAgICAgTWV0ZW9yLnNldHRpbmdzLmFwcCAhPT0gdW5kZWZpbmVkICYmXG4gICAgIE1ldGVvci5zZXR0aW5ncy5hcHAuaG9zdCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgbGV0IHBvcnQgPSAzMDAwO1xuICAgICAgIGlmKE1ldGVvci5zZXR0aW5ncy5hcHAucG9ydCAhPT0gdW5kZWZpbmVkKSBwb3J0ID0gTWV0ZW9yLnNldHRpbmdzLmFwcC5wb3J0XG4gICAgICAgcmV0dXJuIFwiaHR0cDovL1wiK01ldGVvci5zZXR0aW5ncy5hcHAuaG9zdCtcIjpcIitwb3J0K1wiL1wiO1xuICB9XG4gIHJldHVybiBNZXRlb3IuYWJzb2x1dGVVcmwoKTtcbn1cbiIsImV4cG9ydCBjb25zdCBGQUxMQkFDS19QUk9WSURFUiA9IFwiZG9pY2hhaW4ub3JnXCI7XG4iLCJpbXBvcnQgbmFtZWNvaW4gZnJvbSAnbmFtZWNvaW4nO1xuaW1wb3J0IHsgU0VORF9BUFAsIENPTkZJUk1fQVBQLCBWRVJJRllfQVBQLCBpc0FwcFR5cGUgfSBmcm9tICcuL3R5cGUtY29uZmlndXJhdGlvbi5qcyc7XG5cbnZhciBzZW5kU2V0dGluZ3MgPSBNZXRlb3Iuc2V0dGluZ3Muc2VuZDtcbnZhciBzZW5kQ2xpZW50ID0gdW5kZWZpbmVkO1xuaWYoaXNBcHBUeXBlKFNFTkRfQVBQKSkge1xuICBpZighc2VuZFNldHRpbmdzIHx8ICFzZW5kU2V0dGluZ3MuZG9pY2hhaW4pXG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcihcImNvbmZpZy5zZW5kLmRvaWNoYWluXCIsIFwiU2VuZCBhcHAgZG9pY2hhaW4gc2V0dGluZ3Mgbm90IGZvdW5kXCIpXG4gIHNlbmRDbGllbnQgPSBjcmVhdGVDbGllbnQoc2VuZFNldHRpbmdzLmRvaWNoYWluKTtcbn1cbmV4cG9ydCBjb25zdCBTRU5EX0NMSUVOVCA9IHNlbmRDbGllbnQ7XG5cbnZhciBjb25maXJtU2V0dGluZ3MgPSBNZXRlb3Iuc2V0dGluZ3MuY29uZmlybTtcbnZhciBjb25maXJtQ2xpZW50ID0gdW5kZWZpbmVkO1xudmFyIGNvbmZpcm1BZGRyZXNzID0gdW5kZWZpbmVkO1xuaWYoaXNBcHBUeXBlKENPTkZJUk1fQVBQKSkge1xuICBpZighY29uZmlybVNldHRpbmdzIHx8ICFjb25maXJtU2V0dGluZ3MuZG9pY2hhaW4pXG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcihcImNvbmZpZy5jb25maXJtLmRvaWNoYWluXCIsIFwiQ29uZmlybSBhcHAgZG9pY2hhaW4gc2V0dGluZ3Mgbm90IGZvdW5kXCIpXG4gIGNvbmZpcm1DbGllbnQgPSBjcmVhdGVDbGllbnQoY29uZmlybVNldHRpbmdzLmRvaWNoYWluKTtcbiAgY29uZmlybUFkZHJlc3MgPSBjb25maXJtU2V0dGluZ3MuZG9pY2hhaW4uYWRkcmVzcztcbn1cbmV4cG9ydCBjb25zdCBDT05GSVJNX0NMSUVOVCA9IGNvbmZpcm1DbGllbnQ7XG5leHBvcnQgY29uc3QgQ09ORklSTV9BRERSRVNTID0gY29uZmlybUFkZHJlc3M7XG5cbnZhciB2ZXJpZnlTZXR0aW5ncyA9IE1ldGVvci5zZXR0aW5ncy52ZXJpZnk7XG52YXIgdmVyaWZ5Q2xpZW50ID0gdW5kZWZpbmVkO1xuaWYoaXNBcHBUeXBlKFZFUklGWV9BUFApKSB7XG4gIGlmKCF2ZXJpZnlTZXR0aW5ncyB8fCAhdmVyaWZ5U2V0dGluZ3MuZG9pY2hhaW4pXG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcihcImNvbmZpZy52ZXJpZnkuZG9pY2hhaW5cIiwgXCJWZXJpZnkgYXBwIGRvaWNoYWluIHNldHRpbmdzIG5vdCBmb3VuZFwiKVxuICB2ZXJpZnlDbGllbnQgPSBjcmVhdGVDbGllbnQodmVyaWZ5U2V0dGluZ3MuZG9pY2hhaW4pO1xufVxuZXhwb3J0IGNvbnN0IFZFUklGWV9DTElFTlQgPSB2ZXJpZnlDbGllbnQ7XG5cbmZ1bmN0aW9uIGNyZWF0ZUNsaWVudChzZXR0aW5ncykge1xuICByZXR1cm4gbmV3IG5hbWVjb2luLkNsaWVudCh7XG4gICAgaG9zdDogc2V0dGluZ3MuaG9zdCxcbiAgICBwb3J0OiBzZXR0aW5ncy5wb3J0LFxuICAgIHVzZXI6IHNldHRpbmdzLnVzZXJuYW1lLFxuICAgIHBhc3M6IHNldHRpbmdzLnBhc3N3b3JkXG4gIH0pO1xufVxuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgeyBTRU5EX0FQUCwgQ09ORklSTV9BUFAsIGlzQXBwVHlwZSB9IGZyb20gJy4vdHlwZS1jb25maWd1cmF0aW9uLmpzJztcbmltcG9ydCBIYXNoaWRzIGZyb20gJ2hhc2hpZHMnO1xuLy9jb25zdCBIYXNoaWRzID0gcmVxdWlyZSgnaGFzaGlkcycpLmRlZmF1bHQ7XG5pbXBvcnQge2xvZ0NvbmZpcm19IGZyb20gXCIuL2xvZy1jb25maWd1cmF0aW9uXCI7XG5cbmV4cG9ydCBjb25zdCBIYXNoSWRzID0gbmV3IEhhc2hpZHMoJzB4dWdtTGU3TnllZTZ2azFpRjg4KDZDbXdwcW9HNGhRKi1UNzR0all3Xk8ydk9PKFhsLTkxd0E4Km5DZ19sWCQnKTtcblxudmFyIHNlbmRTZXR0aW5ncyA9IE1ldGVvci5zZXR0aW5ncy5zZW5kO1xudmFyIGRvaU1haWxGZXRjaFVybCA9IHVuZGVmaW5lZDtcblxuaWYoaXNBcHBUeXBlKFNFTkRfQVBQKSkge1xuICBpZighc2VuZFNldHRpbmdzIHx8ICFzZW5kU2V0dGluZ3MuZG9pTWFpbEZldGNoVXJsKVxuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoXCJjb25maWcuc2VuZC5lbWFpbFwiLCBcIlNldHRpbmdzIG5vdCBmb3VuZFwiKTtcbiAgZG9pTWFpbEZldGNoVXJsID0gc2VuZFNldHRpbmdzLmRvaU1haWxGZXRjaFVybDtcbn1cbmV4cG9ydCBjb25zdCBET0lfTUFJTF9GRVRDSF9VUkwgPSBkb2lNYWlsRmV0Y2hVcmw7XG5cbnZhciBkZWZhdWx0RnJvbSA9IHVuZGVmaW5lZDtcbmlmKGlzQXBwVHlwZShDT05GSVJNX0FQUCkpIHtcbiAgdmFyIGNvbmZpcm1TZXR0aW5ncyA9IE1ldGVvci5zZXR0aW5ncy5jb25maXJtO1xuXG4gIGlmKCFjb25maXJtU2V0dGluZ3MgfHwgIWNvbmZpcm1TZXR0aW5ncy5zbXRwKVxuICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFwiY29uZmlnLmNvbmZpcm0uc210cFwiLCBcIkNvbmZpcm0gYXBwIGVtYWlsIHNtdHAgc2V0dGluZ3Mgbm90IGZvdW5kXCIpXG5cbiAgaWYoIWNvbmZpcm1TZXR0aW5ncy5zbXRwLmRlZmF1bHRGcm9tKVxuICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKFwiY29uZmlnLmNvbmZpcm0uZGVmYXVsdEZyb21cIiwgXCJDb25maXJtIGFwcCBlbWFpbCBkZWZhdWx0RnJvbSBub3QgZm91bmRcIilcblxuICBkZWZhdWx0RnJvbSAgPSAgY29uZmlybVNldHRpbmdzLnNtdHAuZGVmYXVsdEZyb207XG5cbiAgbG9nQ29uZmlybSgnc2VuZGluZyB3aXRoIGRlZmF1bHRGcm9tOicsZGVmYXVsdEZyb20pO1xuXG4gIE1ldGVvci5zdGFydHVwKCgpID0+IHtcblxuICAgaWYoY29uZmlybVNldHRpbmdzLnNtdHAudXNlcm5hbWUgPT09IHVuZGVmaW5lZCl7XG4gICAgICAgcHJvY2Vzcy5lbnYuTUFJTF9VUkwgPSAnc210cDovLycgK1xuICAgICAgICAgICBlbmNvZGVVUklDb21wb25lbnQoY29uZmlybVNldHRpbmdzLnNtdHAuc2VydmVyKSArXG4gICAgICAgICAgICc6JyArXG4gICAgICAgICAgIGNvbmZpcm1TZXR0aW5ncy5zbXRwLnBvcnQ7XG4gICB9ZWxzZXtcbiAgICAgICBwcm9jZXNzLmVudi5NQUlMX1VSTCA9ICdzbXRwOi8vJyArXG4gICAgICAgICAgIGVuY29kZVVSSUNvbXBvbmVudChjb25maXJtU2V0dGluZ3Muc210cC51c2VybmFtZSkgK1xuICAgICAgICAgICAnOicgKyBlbmNvZGVVUklDb21wb25lbnQoY29uZmlybVNldHRpbmdzLnNtdHAucGFzc3dvcmQpICtcbiAgICAgICAgICAgJ0AnICsgZW5jb2RlVVJJQ29tcG9uZW50KGNvbmZpcm1TZXR0aW5ncy5zbXRwLnNlcnZlcikgK1xuICAgICAgICAgICAnOicgK1xuICAgICAgICAgICBjb25maXJtU2V0dGluZ3Muc210cC5wb3J0O1xuICAgfVxuXG4gICBsb2dDb25maXJtKCd1c2luZyBNQUlMX1VSTDonLHByb2Nlc3MuZW52Lk1BSUxfVVJMKTtcblxuICAgaWYoY29uZmlybVNldHRpbmdzLnNtdHAuTk9ERV9UTFNfUkVKRUNUX1VOQVVUSE9SSVpFRCE9PXVuZGVmaW5lZClcbiAgICAgICBwcm9jZXNzLmVudi5OT0RFX1RMU19SRUpFQ1RfVU5BVVRIT1JJWkVEID0gY29uZmlybVNldHRpbmdzLnNtdHAuTk9ERV9UTFNfUkVKRUNUX1VOQVVUSE9SSVpFRDsgLy8wXG4gIH0pO1xufVxuZXhwb3J0IGNvbnN0IERPSV9NQUlMX0RFRkFVTFRfRU1BSUxfRlJPTSA9IGRlZmF1bHRGcm9tO1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgeyBSb2xlcyB9IGZyb20gJ21ldGVvci9hbGFubmluZzpyb2xlcyc7XG5pbXBvcnQge01ldGF9IGZyb20gJy4uLy4uL2FwaS9tZXRhL21ldGEuanMnXG5NZXRlb3Iuc3RhcnR1cCgoKSA9PiB7XG5cbiAgbGV0IHZlcnNpb249QXNzZXRzLmdldFRleHQoXCJwcml2YXRlL3ZlcnNpb24uanNvblwiKTtcblxuICBpZihNZXRhLmZpbmQoe2tleTpcInZlcnNpb25cIn0pLmNvdW50KCkgPiAwKXtcbiAgICBNZXRhLnJlbW92ZSh7a2V5OlwidmVyc2lvblwifSk7XG4gIH1cbiAgIE1ldGEuaW5zZXJ0KHtrZXk6XCJ2ZXJzaW9uXCIsdmFsdWU6dmVyc2lvbn0pO1xuICBcbiAgaWYoTWV0ZW9yLnVzZXJzLmZpbmQoKS5jb3VudCgpID09PSAwKSB7XG4gICAgY29uc3QgaWQgPSBBY2NvdW50cy5jcmVhdGVVc2VyKHtcbiAgICAgIHVzZXJuYW1lOiAnYWRtaW4nLFxuICAgICAgZW1haWw6ICdhZG1pbkBzZW5kZWZmZWN0LmRlJyxcbiAgICAgIHBhc3N3b3JkOiAncGFzc3dvcmQnXG4gICAgfSk7XG4gICAgUm9sZXMuYWRkVXNlcnNUb1JvbGVzKGlkLCAnYWRtaW4nKTtcbiAgfVxufSk7XG4iLCJpbXBvcnQgJy4vbG9nLWNvbmZpZ3VyYXRpb24uanMnO1xuaW1wb3J0ICcuL2RhcHAtY29uZmlndXJhdGlvbi5qcyc7XG5pbXBvcnQgJy4vdHlwZS1jb25maWd1cmF0aW9uLmpzJztcbmltcG9ydCAnLi9kbnMtY29uZmlndXJhdGlvbi5qcyc7XG5pbXBvcnQgJy4vZG9pY2hhaW4tY29uZmlndXJhdGlvbi5qcyc7XG5pbXBvcnQgJy4vZml4dHVyZXMuanMnO1xuaW1wb3J0ICcuL3JlZ2lzdGVyLWFwaS5qcyc7XG5pbXBvcnQgJy4vdXNlcmFjY291bnRzLWNvbmZpZ3VyYXRpb24uanMnO1xuaW1wb3J0ICcuL3NlY3VyaXR5LmpzJztcbmltcG9ydCAnLi9lbWFpbC1jb25maWd1cmF0aW9uLmpzJztcbmltcG9ydCAnLi9qb2JzLmpzJztcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IHsgTWFpbEpvYnMgfSBmcm9tICcuLi8uLi8uLi9zZXJ2ZXIvYXBpL21haWxfam9icy5qcyc7XG5pbXBvcnQgeyBCbG9ja2NoYWluSm9icyB9IGZyb20gJy4uLy4uLy4uL3NlcnZlci9hcGkvYmxvY2tjaGFpbl9qb2JzLmpzJztcbmltcG9ydCB7IERBcHBKb2JzIH0gZnJvbSAnLi4vLi4vLi4vc2VydmVyL2FwaS9kYXBwX2pvYnMuanMnO1xuaW1wb3J0IHsgQ09ORklSTV9BUFAsIGlzQXBwVHlwZSB9IGZyb20gJy4vdHlwZS1jb25maWd1cmF0aW9uLmpzJztcbmltcG9ydCBhZGRDaGVja05ld1RyYW5zYWN0aW9uc0Jsb2NrY2hhaW5Kb2IgZnJvbSAnLi4vLi4vbW9kdWxlcy9zZXJ2ZXIvam9icy9hZGRfY2hlY2tfbmV3X3RyYW5zYWN0aW9ucy5qcyc7XG5cbk1ldGVvci5zdGFydHVwKCgpID0+IHtcbiAgTWFpbEpvYnMuc3RhcnRKb2JTZXJ2ZXIoKTtcbiAgQmxvY2tjaGFpbkpvYnMuc3RhcnRKb2JTZXJ2ZXIoKTtcbiAgREFwcEpvYnMuc3RhcnRKb2JTZXJ2ZXIoKTtcbiAgaWYoaXNBcHBUeXBlKENPTkZJUk1fQVBQKSkgYWRkQ2hlY2tOZXdUcmFuc2FjdGlvbnNCbG9ja2NoYWluSm9iKCk7XG59KTtcbiIsImltcG9ydCB7aXNEZWJ1Z30gZnJvbSBcIi4vZGFwcC1jb25maWd1cmF0aW9uXCI7XG5cbnJlcXVpcmUoJ3NjcmliZS1qcycpKCk7XG5cbmV4cG9ydCBjb25zdCBjb25zb2xlID0gcHJvY2Vzcy5jb25zb2xlO1xuZXhwb3J0IGNvbnN0IHNlbmRNb2RlVGFnQ29sb3IgPSB7bXNnIDogJ3NlbmQtbW9kZScsIGNvbG9ycyA6IFsneWVsbG93JywgJ2ludmVyc2UnXX07XG5leHBvcnQgY29uc3QgY29uZmlybU1vZGVUYWdDb2xvciA9IHttc2cgOiAnY29uZmlybS1tb2RlJywgY29sb3JzIDogWydibHVlJywgJ2ludmVyc2UnXX07XG5leHBvcnQgY29uc3QgdmVyaWZ5TW9kZVRhZ0NvbG9yID0ge21zZyA6ICd2ZXJpZnktbW9kZScsIGNvbG9ycyA6IFsnZ3JlZW4nLCAnaW52ZXJzZSddfTtcbmV4cG9ydCBjb25zdCBibG9ja2NoYWluTW9kZVRhZ0NvbG9yID0ge21zZyA6ICdibG9ja2NoYWluLW1vZGUnLCBjb2xvcnMgOiBbJ3doaXRlJywgJ2ludmVyc2UnXX07XG5leHBvcnQgY29uc3QgdGVzdGluZ01vZGVUYWdDb2xvciA9IHttc2cgOiAndGVzdGluZy1tb2RlJywgY29sb3JzIDogWydvcmFuZ2UnLCAnaW52ZXJzZSddfTtcblxuZXhwb3J0IGZ1bmN0aW9uIGxvZ1NlbmQobWVzc2FnZSxwYXJhbSkge1xuICAgIGlmKGlzRGVidWcoKSkge2NvbnNvbGUudGltZSgpLnRhZyhzZW5kTW9kZVRhZ0NvbG9yKS5sb2cobWVzc2FnZSxwYXJhbT9wYXJhbTonJyk7fVxufVxuXG5leHBvcnQgZnVuY3Rpb24gbG9nQ29uZmlybShtZXNzYWdlLHBhcmFtKSB7XG4gICAgaWYoaXNEZWJ1ZygpKSB7Y29uc29sZS50aW1lKCkudGFnKGNvbmZpcm1Nb2RlVGFnQ29sb3IpLmxvZyhtZXNzYWdlLCBwYXJhbT9wYXJhbTonJyk7fVxufVxuXG5leHBvcnQgZnVuY3Rpb24gbG9nVmVyaWZ5KG1lc3NhZ2UsIHBhcmFtKSB7XG4gICAgaWYoaXNEZWJ1ZygpKSB7Y29uc29sZS50aW1lKCkudGFnKHZlcmlmeU1vZGVUYWdDb2xvcikubG9nKG1lc3NhZ2UsIHBhcmFtP3BhcmFtOicnKTt9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsb2dCbG9ja2NoYWluKG1lc3NhZ2UsIHBhcmFtKSB7XG4gICAgaWYoaXNEZWJ1ZygpKXtjb25zb2xlLnRpbWUoKS50YWcoYmxvY2tjaGFpbk1vZGVUYWdDb2xvcikubG9nKG1lc3NhZ2UsIHBhcmFtP3BhcmFtOicnKTt9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsb2dNYWluKG1lc3NhZ2UsIHBhcmFtKSB7XG4gICAgaWYoaXNEZWJ1ZygpKXtjb25zb2xlLnRpbWUoKS50YWcoYmxvY2tjaGFpbk1vZGVUYWdDb2xvcikubG9nKG1lc3NhZ2UsIHBhcmFtP3BhcmFtOicnKTt9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsb2dFcnJvcihtZXNzYWdlLCBwYXJhbSkge1xuICAgIGlmKGlzRGVidWcoKSl7Y29uc29sZS50aW1lKCkudGFnKGJsb2NrY2hhaW5Nb2RlVGFnQ29sb3IpLmVycm9yKG1lc3NhZ2UsIHBhcmFtP3BhcmFtOicnKTt9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0ZXN0TG9nZ2luZyhtZXNzYWdlLCBwYXJhbSkge1xuICAgIGlmKGlzRGVidWcoKSl7Y29uc29sZS50aW1lKCkudGFnKHRlc3RpbmdNb2RlVGFnQ29sb3IpLmxvZyhtZXNzYWdlLCBwYXJhbT9wYXJhbTonJyk7fVxufSIsImltcG9ydCAnLi4vLi4vYXBpL2xhbmd1YWdlcy9tZXRob2RzJztcbmltcG9ydCAnLi4vLi4vYXBpL2RvaWNoYWluL21ldGhvZHMnO1xuaW1wb3J0ICcuLi8uLi9hcGkvcmVjaXBpZW50cy9zZXJ2ZXIvcHVibGljYXRpb25zJ1xuaW1wb3J0ICcuLi8uLi9hcGkvb3B0LWlucy9tZXRob2RzJztcbmltcG9ydCAnLi4vLi4vYXBpL21ldGEvbWV0YSc7XG5pbXBvcnQgJy4uLy4uL2FwaS9vcHQtaW5zL3NlcnZlci9wdWJsaWNhdGlvbnMnO1xuXG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCB7IEREUFJhdGVMaW1pdGVyIH0gZnJvbSAnbWV0ZW9yL2RkcC1yYXRlLWxpbWl0ZXInO1xuaW1wb3J0IHsgXyB9IGZyb20gJ21ldGVvci91bmRlcnNjb3JlJztcblxuLy8gRG9uJ3QgbGV0IHBlb3BsZSB3cml0ZSBhcmJpdHJhcnkgZGF0YSB0byB0aGVpciAncHJvZmlsZScgZmllbGQgZnJvbSB0aGUgY2xpZW50XG5NZXRlb3IudXNlcnMuZGVueSh7XG4gIHVwZGF0ZSgpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSxcbn0pO1xuXG4vLyBHZXQgYSBsaXN0IG9mIGFsbCBhY2NvdW50cyBtZXRob2RzIGJ5IHJ1bm5pbmcgYE1ldGVvci5zZXJ2ZXIubWV0aG9kX2hhbmRsZXJzYCBpbiBtZXRlb3Igc2hlbGxcbmNvbnN0IEFVVEhfTUVUSE9EUyA9IFtcbiAgJ2xvZ2luJyxcbiAgJ2xvZ291dCcsXG4gICdsb2dvdXRPdGhlckNsaWVudHMnLFxuICAnZ2V0TmV3VG9rZW4nLFxuICAncmVtb3ZlT3RoZXJUb2tlbnMnLFxuICAnY29uZmlndXJlTG9naW5TZXJ2aWNlJyxcbiAgJ2NoYW5nZVBhc3N3b3JkJyxcbiAgJ2ZvcmdvdFBhc3N3b3JkJyxcbiAgJ3Jlc2V0UGFzc3dvcmQnLFxuICAndmVyaWZ5RW1haWwnLFxuICAnY3JlYXRlVXNlcicsXG4gICdBVFJlbW92ZVNlcnZpY2UnLFxuICAnQVRDcmVhdGVVc2VyU2VydmVyJyxcbiAgJ0FUUmVzZW5kVmVyaWZpY2F0aW9uRW1haWwnLFxuXTtcblxuaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICAvLyBPbmx5IGFsbG93IDIgbG9naW4gYXR0ZW1wdHMgcGVyIGNvbm5lY3Rpb24gcGVyIDUgc2Vjb25kc1xuICBERFBSYXRlTGltaXRlci5hZGRSdWxlKHtcbiAgICBuYW1lKG5hbWUpIHtcbiAgICAgIHJldHVybiBfLmNvbnRhaW5zKEFVVEhfTUVUSE9EUywgbmFtZSk7XG4gICAgfSxcblxuICAgIC8vIFJhdGUgbGltaXQgcGVyIGNvbm5lY3Rpb24gSURcbiAgICBjb25uZWN0aW9uSWQoKSB7IHJldHVybiB0cnVlOyB9LFxuICB9LCAyLCA1MDAwKTtcbn1cbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuZXhwb3J0IGNvbnN0IFNFTkRfQVBQID0gXCJzZW5kXCI7XG5leHBvcnQgY29uc3QgQ09ORklSTV9BUFAgPSBcImNvbmZpcm1cIjtcbmV4cG9ydCBjb25zdCBWRVJJRllfQVBQID0gXCJ2ZXJpZnlcIjtcbmV4cG9ydCBmdW5jdGlvbiBpc0FwcFR5cGUodHlwZSkge1xuICBpZihNZXRlb3Iuc2V0dGluZ3MgPT09IHVuZGVmaW5lZCB8fCBNZXRlb3Iuc2V0dGluZ3MuYXBwID09PSB1bmRlZmluZWQpIHRocm93IFwiTm8gc2V0dGluZ3MgZm91bmQhXCJcbiAgY29uc3QgdHlwZXMgPSBNZXRlb3Iuc2V0dGluZ3MuYXBwLnR5cGVzO1xuICBpZih0eXBlcyAhPT0gdW5kZWZpbmVkKSByZXR1cm4gdHlwZXMuaW5jbHVkZXModHlwZSk7XG4gIHJldHVybiBmYWxzZTtcbn1cbiIsImltcG9ydCB7IEFjY291bnRzIH0gZnJvbSAnbWV0ZW9yL2FjY291bnRzLWJhc2UnO1xuQWNjb3VudHMuY29uZmlnKHtcbiAgICBzZW5kVmVyaWZpY2F0aW9uRW1haWw6IHRydWUsXG4gICAgZm9yYmlkQ2xpZW50QWNjb3VudENyZWF0aW9uOiB0cnVlXG59KTtcblxuXG5cbkFjY291bnRzLmVtYWlsVGVtcGxhdGVzLmZyb209J2RvaWNoYWluQGxlLXNwYWNlLmRlJzsiLCJpbXBvcnQgJy4uL2ltcG9ydHMvc3RhcnR1cC9zZXJ2ZXInO1xuaW1wb3J0ICcuL2FwaS9pbmRleC5qcyc7XG4iLCJcbmltcG9ydCB7IEpvYkNvbGxlY3Rpb24sSm9iIH0gZnJvbSAnbWV0ZW9yL3ZzaXZzaTpqb2ItY29sbGVjdGlvbic7XG5leHBvcnQgY29uc3QgQmxvY2tjaGFpbkpvYnMgPSBKb2JDb2xsZWN0aW9uKCdibG9ja2NoYWluJyk7XG5pbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCBpbnNlcnQgZnJvbSAnLi4vLi4vaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9kb2ljaGFpbi9pbnNlcnQuanMnO1xuaW1wb3J0IHVwZGF0ZSBmcm9tICcuLi8uLi9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2RvaWNoYWluL3VwZGF0ZS5qcyc7XG4vKiBlc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtdmFycyAqLyAvL1RPRE8gcmUtZW5hYmxlIHRoaXMhXG5pbXBvcnQgY2hlY2tOZXdUcmFuc2FjdGlvbiBmcm9tICcuLi8uLi9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2RvaWNoYWluL2NoZWNrX25ld190cmFuc2FjdGlvbnMuanMnO1xuaW1wb3J0IHsgQ09ORklSTV9BUFAsIGlzQXBwVHlwZSB9IGZyb20gJy4uLy4uL2ltcG9ydHMvc3RhcnR1cC9zZXJ2ZXIvdHlwZS1jb25maWd1cmF0aW9uLmpzJztcbmltcG9ydCB7bG9nTWFpbn0gZnJvbSBcIi4uLy4uL2ltcG9ydHMvc3RhcnR1cC9zZXJ2ZXIvbG9nLWNvbmZpZ3VyYXRpb25cIjtcblxuQmxvY2tjaGFpbkpvYnMucHJvY2Vzc0pvYnMoJ2luc2VydCcsIHt3b3JrVGltZW91dDogMzAqMTAwMH0sZnVuY3Rpb24gKGpvYiwgY2IpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCBlbnRyeSA9IGpvYi5kYXRhO1xuICAgIGluc2VydChlbnRyeSk7XG4gICAgam9iLmRvbmUoKTtcbiAgfSBjYXRjaChleGNlcHRpb24pIHtcbiAgICBqb2IuZmFpbCgpO1xuXG4gICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdqb2JzLmJsb2NrY2hhaW4uaW5zZXJ0LmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH0gZmluYWxseSB7XG4gICAgY2IoKTtcbiAgfVxufSk7XG5cbkJsb2NrY2hhaW5Kb2JzLnByb2Nlc3NKb2JzKCd1cGRhdGUnLCB7d29ya1RpbWVvdXQ6IDMwKjEwMDB9LGZ1bmN0aW9uIChqb2IsIGNiKSB7XG4gIHRyeSB7XG4gICAgY29uc3QgZW50cnkgPSBqb2IuZGF0YTtcbiAgICB1cGRhdGUoZW50cnksam9iKTtcbiAgfSBjYXRjaChleGNlcHRpb24pIHtcbiAgICBqb2IuZmFpbCgpO1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2pvYnMuYmxvY2tjaGFpbi51cGRhdGUuZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgfSBmaW5hbGx5IHtcbiAgICBjYigpO1xuICB9XG59KTtcblxuQmxvY2tjaGFpbkpvYnMucHJvY2Vzc0pvYnMoJ2NoZWNrTmV3VHJhbnNhY3Rpb24nLCB7d29ya1RpbWVvdXQ6IDMwKjEwMDB9LGZ1bmN0aW9uIChqb2IsIGNiKSB7XG4gIHRyeSB7XG4gICAgaWYoIWlzQXBwVHlwZShDT05GSVJNX0FQUCkpIHtcbiAgICAgIGpvYi5wYXVzZSgpO1xuICAgICAgam9iLmNhbmNlbCgpO1xuICAgICAgam9iLnJlbW92ZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvL2NoZWNrTmV3VHJhbnNhY3Rpb24obnVsbCxqb2IpO1xuICAgIH1cbiAgfSBjYXRjaChleGNlcHRpb24pIHtcbiAgICBqb2IuZmFpbCgpO1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2pvYnMuYmxvY2tjaGFpbi5jaGVja05ld1RyYW5zYWN0aW9ucy5leGNlcHRpb24nLCBleGNlcHRpb24pO1xuICB9IGZpbmFsbHkge1xuICAgIGNiKCk7XG4gIH1cbn0pO1xuXG5uZXcgSm9iKEJsb2NrY2hhaW5Kb2JzLCAnY2xlYW51cCcsIHt9KVxuICAgIC5yZXBlYXQoeyBzY2hlZHVsZTogQmxvY2tjaGFpbkpvYnMubGF0ZXIucGFyc2UudGV4dChcImV2ZXJ5IDUgbWludXRlc1wiKSB9KVxuICAgIC5zYXZlKHtjYW5jZWxSZXBlYXRzOiB0cnVlfSk7XG5cbmxldCBxID0gQmxvY2tjaGFpbkpvYnMucHJvY2Vzc0pvYnMoJ2NsZWFudXAnLHsgcG9sbEludGVydmFsOiBmYWxzZSwgd29ya1RpbWVvdXQ6IDYwKjEwMDAgfSAsZnVuY3Rpb24gKGpvYiwgY2IpIHtcbiAgY29uc3QgY3VycmVudCA9IG5ldyBEYXRlKClcbiAgICBjdXJyZW50LnNldE1pbnV0ZXMoY3VycmVudC5nZXRNaW51dGVzKCkgLSA1KTtcblxuICBjb25zdCBpZHMgPSBCbG9ja2NoYWluSm9icy5maW5kKHtcbiAgICAgICAgICBzdGF0dXM6IHskaW46IEpvYi5qb2JTdGF0dXNSZW1vdmFibGV9LFxuICAgICAgICAgIHVwZGF0ZWQ6IHskbHQ6IGN1cnJlbnR9fSxcbiAgICAgICAgICB7ZmllbGRzOiB7IF9pZDogMSB9fSk7XG5cbiAgICBsb2dNYWluKCdmb3VuZCAgcmVtb3ZhYmxlIGJsb2NrY2hhaW4gam9iczonLGlkcyk7XG4gICAgQmxvY2tjaGFpbkpvYnMucmVtb3ZlSm9icyhpZHMpO1xuICAgIGlmKGlkcy5sZW5ndGggPiAwKXtcbiAgICAgIGpvYi5kb25lKFwiUmVtb3ZlZCAje2lkcy5sZW5ndGh9IG9sZCBqb2JzXCIpO1xuICAgIH1cbiAgICBjYigpO1xufSk7XG5cbkJsb2NrY2hhaW5Kb2JzLmZpbmQoeyB0eXBlOiAnam9iVHlwZScsIHN0YXR1czogJ3JlYWR5JyB9KVxuICAgIC5vYnNlcnZlKHtcbiAgICAgICAgYWRkZWQ6IGZ1bmN0aW9uICgpIHsgcS50cmlnZ2VyKCk7IH1cbiAgICB9KTtcbiIsImltcG9ydCB7IEpvYkNvbGxlY3Rpb24sIEpvYiB9IGZyb20gJ21ldGVvci92c2l2c2k6am9iLWNvbGxlY3Rpb24nO1xuaW1wb3J0IGZldGNoRG9pTWFpbERhdGEgZnJvbSAnLi4vLi4vaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9kYXBwcy9mZXRjaF9kb2ktbWFpbC1kYXRhLmpzJztcbmltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IHtsb2dNYWlufSBmcm9tIFwiLi4vLi4vaW1wb3J0cy9zdGFydHVwL3NlcnZlci9sb2ctY29uZmlndXJhdGlvblwiO1xuZXhwb3J0IGNvbnN0IERBcHBKb2JzID0gSm9iQ29sbGVjdGlvbignZGFwcCcpO1xuXG5EQXBwSm9icy5wcm9jZXNzSm9icygnZmV0Y2hEb2lNYWlsRGF0YScsIGZ1bmN0aW9uIChqb2IsIGNiKSB7XG4gIHRyeSB7XG4gICAgY29uc3QgZGF0YSA9IGpvYi5kYXRhO1xuICAgIGZldGNoRG9pTWFpbERhdGEoZGF0YSk7XG4gICAgam9iLmRvbmUoKTtcbiAgfSBjYXRjaChleGNlcHRpb24pIHtcbiAgICBqb2IuZmFpbCgpO1xuICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ2pvYnMuZGFwcC5mZXRjaERvaU1haWxEYXRhLmV4Y2VwdGlvbicsIGV4Y2VwdGlvbik7XG4gIH0gZmluYWxseSB7XG4gICAgY2IoKTtcbiAgfVxufSk7XG5cblxubmV3IEpvYihEQXBwSm9icywgJ2NsZWFudXAnLCB7fSlcbiAgICAucmVwZWF0KHsgc2NoZWR1bGU6IERBcHBKb2JzLmxhdGVyLnBhcnNlLnRleHQoXCJldmVyeSA1IG1pbnV0ZXNcIikgfSlcbiAgICAuc2F2ZSh7Y2FuY2VsUmVwZWF0czogdHJ1ZX0pO1xuXG5sZXQgcSA9IERBcHBKb2JzLnByb2Nlc3NKb2JzKCdjbGVhbnVwJyx7IHBvbGxJbnRlcnZhbDogZmFsc2UsIHdvcmtUaW1lb3V0OiA2MCoxMDAwIH0gLGZ1bmN0aW9uIChqb2IsIGNiKSB7XG4gICAgY29uc3QgY3VycmVudCA9IG5ldyBEYXRlKClcbiAgICBjdXJyZW50LnNldE1pbnV0ZXMoY3VycmVudC5nZXRNaW51dGVzKCkgLSA1KTtcblxuICAgIGNvbnN0IGlkcyA9IERBcHBKb2JzLmZpbmQoe1xuICAgICAgICAgICAgc3RhdHVzOiB7JGluOiBKb2Iuam9iU3RhdHVzUmVtb3ZhYmxlfSxcbiAgICAgICAgICAgIHVwZGF0ZWQ6IHskbHQ6IGN1cnJlbnR9fSxcbiAgICAgICAge2ZpZWxkczogeyBfaWQ6IDEgfX0pO1xuXG4gICAgbG9nTWFpbignZm91bmQgIHJlbW92YWJsZSBibG9ja2NoYWluIGpvYnM6JyxpZHMpO1xuICAgIERBcHBKb2JzLnJlbW92ZUpvYnMoaWRzKTtcbiAgICBpZihpZHMubGVuZ3RoID4gMCl7XG4gICAgICAgIGpvYi5kb25lKFwiUmVtb3ZlZCAje2lkcy5sZW5ndGh9IG9sZCBqb2JzXCIpO1xuICAgIH1cbiAgICBjYigpO1xufSk7XG5cbkRBcHBKb2JzLmZpbmQoeyB0eXBlOiAnam9iVHlwZScsIHN0YXR1czogJ3JlYWR5JyB9KVxuICAgIC5vYnNlcnZlKHtcbiAgICAgICAgYWRkZWQ6IGZ1bmN0aW9uICgpIHsgcS50cmlnZ2VyKCk7IH1cbiAgICB9KTtcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IGRucyBmcm9tICdkbnMnO1xuaW1wb3J0IHtsb2dTZW5kfSBmcm9tIFwiLi4vLi4vaW1wb3J0cy9zdGFydHVwL3NlcnZlci9sb2ctY29uZmlndXJhdGlvblwiO1xuXG5leHBvcnQgZnVuY3Rpb24gcmVzb2x2ZVR4dChrZXksIGRvbWFpbikge1xuICBjb25zdCBzeW5jRnVuYyA9IE1ldGVvci53cmFwQXN5bmMoZG5zX3Jlc29sdmVUeHQpO1xuICB0cnkge1xuICAgIGNvbnN0IHJlY29yZHMgPSBzeW5jRnVuYyhrZXksIGRvbWFpbik7XG4gICAgaWYocmVjb3JkcyA9PT0gdW5kZWZpbmVkKSByZXR1cm4gdW5kZWZpbmVkO1xuICAgIGxldCB2YWx1ZSA9IHVuZGVmaW5lZDtcbiAgICByZWNvcmRzLmZvckVhY2gocmVjb3JkID0+IHtcbiAgICAgIGlmKHJlY29yZFswXS5zdGFydHNXaXRoKGtleSkpIHtcbiAgICAgICAgY29uc3QgdmFsID0gcmVjb3JkWzBdLnN1YnN0cmluZyhrZXkubGVuZ3RoKzEpO1xuICAgICAgICB2YWx1ZSA9IHZhbC50cmltKCk7XG5cbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH0gY2F0Y2goZXJyb3IpIHtcbiAgICBsb2dTZW5kKFwiZXJyb3Igd2hpbGUgYXNraW5nIGRucyBzZXJ2ZXJzIGZyb20gXCIsZG5zLmdldFNlcnZlcnMoKSk7XG4gICAgaWYoZXJyb3IubWVzc2FnZS5zdGFydHNXaXRoKFwicXVlcnlUeHQgRU5PREFUQVwiKSB8fFxuICAgICAgICBlcnJvci5tZXNzYWdlLnN0YXJ0c1dpdGgoXCJxdWVyeVR4dCBFTk9URk9VTkRcIikpIHJldHVybiB1bmRlZmluZWQ7XG4gICAgZWxzZSB0aHJvdyBlcnJvcjtcbiAgfVxufVxuXG5mdW5jdGlvbiBkbnNfcmVzb2x2ZVR4dChrZXksIGRvbWFpbiwgY2FsbGJhY2spIHtcbiAgICBsb2dTZW5kKFwicmVzb2x2aW5nIGRucyB0eHQgYXR0cmlidXRlOiBcIiwge2tleTprZXksZG9tYWluOmRvbWFpbn0pO1xuICAgIGRucy5yZXNvbHZlVHh0KGRvbWFpbiwgKGVyciwgcmVjb3JkcykgPT4ge1xuICAgIGNhbGxiYWNrKGVyciwgcmVjb3Jkcyk7XG4gIH0pO1xufVxuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQge2xvZ0Jsb2NrY2hhaW4sIGxvZ0NvbmZpcm0sIGxvZ0Vycm9yfSBmcm9tIFwiLi4vLi4vaW1wb3J0cy9zdGFydHVwL3NlcnZlci9sb2ctY29uZmlndXJhdGlvblwiO1xuXG5jb25zdCBOQU1FU1BBQ0UgPSAnZS8nO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0V2lmKGNsaWVudCwgYWRkcmVzcykge1xuICBpZighYWRkcmVzcyl7XG4gICAgICAgIGFkZHJlc3MgPSBnZXRBZGRyZXNzZXNCeUFjY291bnQoXCJcIilbMF07XG4gICAgICAgIGxvZ0Jsb2NrY2hhaW4oJ2FkZHJlc3Mgd2FzIG5vdCBkZWZpbmVkIHNvIGdldHRpbmcgdGhlIGZpcnN0IGV4aXN0aW5nIG9uZSBvZiB0aGUgd2FsbGV0OicsYWRkcmVzcyk7XG4gIH1cbiAgaWYoIWFkZHJlc3Mpe1xuICAgICAgICBhZGRyZXNzID0gZ2V0TmV3QWRkcmVzcyhcIlwiKTtcbiAgICAgICAgbG9nQmxvY2tjaGFpbignYWRkcmVzcyB3YXMgbmV2ZXIgZGVmaW5lZCAgYXQgYWxsIGdlbmVyYXRlZCBuZXcgYWRkcmVzcyBmb3IgdGhpcyB3YWxsZXQ6JyxhZGRyZXNzKTtcbiAgfVxuICBjb25zdCBzeW5jRnVuYyA9IE1ldGVvci53cmFwQXN5bmMoZG9pY2hhaW5fZHVtcHByaXZrZXkpO1xuICByZXR1cm4gc3luY0Z1bmMoY2xpZW50LCBhZGRyZXNzKTtcbn1cblxuZnVuY3Rpb24gZG9pY2hhaW5fZHVtcHByaXZrZXkoY2xpZW50LCBhZGRyZXNzLCBjYWxsYmFjaykge1xuICBjb25zdCBvdXJBZGRyZXNzID0gYWRkcmVzcztcbiAgY2xpZW50LmNtZCgnZHVtcHByaXZrZXknLCBvdXJBZGRyZXNzLCBmdW5jdGlvbihlcnIsIGRhdGEpIHtcbiAgICBpZihlcnIpICBsb2dFcnJvcignZG9pY2hhaW5fZHVtcHByaXZrZXk6JyxlcnIpO1xuICAgIGNhbGxiYWNrKGVyciwgZGF0YSk7XG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0QWRkcmVzc2VzQnlBY2NvdW50KGNsaWVudCwgYWNjb3V0KSB7XG4gICAgY29uc3Qgc3luY0Z1bmMgPSBNZXRlb3Iud3JhcEFzeW5jKGRvaWNoYWluX2dldGFkZHJlc3Nlc2J5YWNjb3VudCk7XG4gICAgcmV0dXJuIHN5bmNGdW5jKGNsaWVudCwgYWNjb3V0KTtcbn1cblxuZnVuY3Rpb24gZG9pY2hhaW5fZ2V0YWRkcmVzc2VzYnlhY2NvdW50KGNsaWVudCwgYWNjb3VudCwgY2FsbGJhY2spIHtcbiAgICBjb25zdCBvdXJBY2NvdW50ID0gYWNjb3VudDtcbiAgICBjbGllbnQuY21kKCdnZXRhZGRyZXNzZXNieWFjY291bnQnLCBvdXJBY2NvdW50LCBmdW5jdGlvbihlcnIsIGRhdGEpIHtcbiAgICAgICAgaWYoZXJyKSAgbG9nRXJyb3IoJ2dldGFkZHJlc3Nlc2J5YWNjb3VudDonLGVycik7XG4gICAgICAgIGNhbGxiYWNrKGVyciwgZGF0YSk7XG4gICAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXROZXdBZGRyZXNzKGNsaWVudCwgYWNjb3V0KSB7XG4gICAgY29uc3Qgc3luY0Z1bmMgPSBNZXRlb3Iud3JhcEFzeW5jKGRvaWNoYWluX2dldG5ld2FkZHJlc3MpO1xuICAgIHJldHVybiBzeW5jRnVuYyhjbGllbnQsIGFjY291dCk7XG59XG5mdW5jdGlvbiBkb2ljaGFpbl9nZXRuZXdhZGRyZXNzKGNsaWVudCwgYWNjb3VudCwgY2FsbGJhY2spIHtcbiAgICBjb25zdCBvdXJBY2NvdW50ID0gYWNjb3VudDtcbiAgICBjbGllbnQuY21kKCdnZXRuZXdhZGRyZXNzcycsIG91ckFjY291bnQsIGZ1bmN0aW9uKGVyciwgZGF0YSkge1xuICAgICAgICBpZihlcnIpICBsb2dFcnJvcignZ2V0bmV3YWRkcmVzc3M6JyxlcnIpO1xuICAgICAgICBjYWxsYmFjayhlcnIsIGRhdGEpO1xuICAgIH0pO1xufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBzaWduTWVzc2FnZShjbGllbnQsIGFkZHJlc3MsIG1lc3NhZ2UpIHtcbiAgICBjb25zdCBzeW5jRnVuYyA9IE1ldGVvci53cmFwQXN5bmMoZG9pY2hhaW5fc2lnbk1lc3NhZ2UpO1xuICAgIHJldHVybiBzeW5jRnVuYyhjbGllbnQsIGFkZHJlc3MsIG1lc3NhZ2UpO1xufVxuXG5mdW5jdGlvbiBkb2ljaGFpbl9zaWduTWVzc2FnZShjbGllbnQsIGFkZHJlc3MsIG1lc3NhZ2UsIGNhbGxiYWNrKSB7XG4gICAgY29uc3Qgb3VyQWRkcmVzcyA9IGFkZHJlc3M7XG4gICAgY29uc3Qgb3VyTWVzc2FnZSA9IG1lc3NhZ2U7XG4gICAgY2xpZW50LmNtZCgnc2lnbm1lc3NhZ2UnLCBvdXJBZGRyZXNzLCBvdXJNZXNzYWdlLCBmdW5jdGlvbihlcnIsIGRhdGEpIHtcbiAgICAgICAgY2FsbGJhY2soZXJyLCBkYXRhKTtcbiAgICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG5hbWVTaG93KGNsaWVudCwgaWQpIHtcbiAgY29uc3Qgc3luY0Z1bmMgPSBNZXRlb3Iud3JhcEFzeW5jKGRvaWNoYWluX25hbWVTaG93KTtcbiAgcmV0dXJuIHN5bmNGdW5jKGNsaWVudCwgaWQpO1xufVxuXG5mdW5jdGlvbiBkb2ljaGFpbl9uYW1lU2hvdyhjbGllbnQsIGlkLCBjYWxsYmFjaykge1xuICBjb25zdCBvdXJJZCA9IGNoZWNrSWQoaWQpO1xuICBsb2dDb25maXJtKCdkb2ljaGFpbi1jbGkgbmFtZV9zaG93IDonLG91cklkKTtcbiAgY2xpZW50LmNtZCgnbmFtZV9zaG93Jywgb3VySWQsIGZ1bmN0aW9uKGVyciwgZGF0YSkge1xuICAgIGlmKGVyciAhPT0gdW5kZWZpbmVkICYmIGVyciAhPT0gbnVsbCAmJiBlcnIubWVzc2FnZS5zdGFydHNXaXRoKFwibmFtZSBub3QgZm91bmRcIikpIHtcbiAgICAgIGVyciA9IHVuZGVmaW5lZCxcbiAgICAgIGRhdGEgPSB1bmRlZmluZWRcbiAgICB9XG4gICAgY2FsbGJhY2soZXJyLCBkYXRhKTtcbiAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmZWVEb2koY2xpZW50LCBhZGRyZXNzKSB7XG4gICAgY29uc3Qgc3luY0Z1bmMgPSBNZXRlb3Iud3JhcEFzeW5jKGRvaWNoYWluX2ZlZURvaSk7XG4gICAgcmV0dXJuIHN5bmNGdW5jKGNsaWVudCwgYWRkcmVzcyk7XG59XG5cbmZ1bmN0aW9uIGRvaWNoYWluX2ZlZURvaShjbGllbnQsIGFkZHJlc3MsIGNhbGxiYWNrKSB7XG4gICAgY29uc3QgZGVzdEFkZHJlc3MgPSBhZGRyZXNzO1xuICAgIGNsaWVudC5jbWQoJ3NlbmR0b2FkZHJlc3MnLCBkZXN0QWRkcmVzcywgJzAuMDInLCBmdW5jdGlvbihlcnIsIGRhdGEpIHtcbiAgICAgICAgY2FsbGJhY2soZXJyLCBkYXRhKTtcbiAgICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG5hbWVEb2koY2xpZW50LCBuYW1lLCB2YWx1ZSwgYWRkcmVzcykge1xuICAgIGNvbnN0IHN5bmNGdW5jID0gTWV0ZW9yLndyYXBBc3luYyhkb2ljaGFpbl9uYW1lRG9pKTtcbiAgICByZXR1cm4gc3luY0Z1bmMoY2xpZW50LCBuYW1lLCB2YWx1ZSwgYWRkcmVzcyk7XG59XG5cbmZ1bmN0aW9uIGRvaWNoYWluX25hbWVEb2koY2xpZW50LCBuYW1lLCB2YWx1ZSwgYWRkcmVzcywgY2FsbGJhY2spIHtcbiAgICBjb25zdCBvdXJOYW1lID0gY2hlY2tJZChuYW1lKTtcbiAgICBjb25zdCBvdXJWYWx1ZSA9IHZhbHVlO1xuICAgIGNvbnN0IGRlc3RBZGRyZXNzID0gYWRkcmVzcztcbiAgICBpZighYWRkcmVzcykge1xuICAgICAgICBjbGllbnQuY21kKCduYW1lX2RvaScsIG91ck5hbWUsIG91clZhbHVlLCBmdW5jdGlvbiAoZXJyLCBkYXRhKSB7XG4gICAgICAgICAgICBjYWxsYmFjayhlcnIsIGRhdGEpO1xuICAgICAgICB9KTtcbiAgICB9ZWxzZXtcbiAgICAgICAgY2xpZW50LmNtZCgnbmFtZV9kb2knLCBvdXJOYW1lLCBvdXJWYWx1ZSwgZGVzdEFkZHJlc3MsIGZ1bmN0aW9uKGVyciwgZGF0YSkge1xuICAgICAgICAgICAgY2FsbGJhY2soZXJyLCBkYXRhKTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gbGlzdFNpbmNlQmxvY2soY2xpZW50LCBibG9jaykge1xuICAgIGNvbnN0IHN5bmNGdW5jID0gTWV0ZW9yLndyYXBBc3luYyhkb2ljaGFpbl9saXN0U2luY2VCbG9jayk7XG4gICAgdmFyIG91ckJsb2NrID0gYmxvY2s7XG4gICAgaWYob3VyQmxvY2sgPT09IHVuZGVmaW5lZCkgb3VyQmxvY2sgPSBudWxsO1xuICAgIHJldHVybiBzeW5jRnVuYyhjbGllbnQsIG91ckJsb2NrKTtcbn1cblxuZnVuY3Rpb24gZG9pY2hhaW5fbGlzdFNpbmNlQmxvY2soY2xpZW50LCBibG9jaywgY2FsbGJhY2spIHtcbiAgICB2YXIgb3VyQmxvY2sgPSBibG9jaztcbiAgICBpZihvdXJCbG9jayA9PT0gbnVsbCkgY2xpZW50LmNtZCgnbGlzdHNpbmNlYmxvY2snLCBmdW5jdGlvbihlcnIsIGRhdGEpIHtcbiAgICAgICAgY2FsbGJhY2soZXJyLCBkYXRhKTtcbiAgICB9KTtcbiAgICBlbHNlIGNsaWVudC5jbWQoJ2xpc3RzaW5jZWJsb2NrJywgb3VyQmxvY2ssIGZ1bmN0aW9uKGVyciwgZGF0YSkge1xuICAgICAgICBjYWxsYmFjayhlcnIsIGRhdGEpO1xuICAgIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0VHJhbnNhY3Rpb24oY2xpZW50LCB0eGlkKSB7XG4gICAgY29uc3Qgc3luY0Z1bmMgPSBNZXRlb3Iud3JhcEFzeW5jKGRvaWNoYWluX2dldHRyYW5zYWN0aW9uKTtcbiAgICByZXR1cm4gc3luY0Z1bmMoY2xpZW50LCB0eGlkKTtcbn1cblxuZnVuY3Rpb24gZG9pY2hhaW5fZ2V0dHJhbnNhY3Rpb24oY2xpZW50LCB0eGlkLCBjYWxsYmFjaykge1xuICAgIGxvZ0NvbmZpcm0oJ2RvaWNoYWluX2dldHRyYW5zYWN0aW9uOicsdHhpZCk7XG4gICAgY2xpZW50LmNtZCgnZ2V0dHJhbnNhY3Rpb24nLCB0eGlkLCBmdW5jdGlvbihlcnIsIGRhdGEpIHtcbiAgICAgICAgaWYoZXJyKSAgbG9nRXJyb3IoJ2RvaWNoYWluX2dldHRyYW5zYWN0aW9uOicsZXJyKTtcbiAgICAgICAgY2FsbGJhY2soZXJyLCBkYXRhKTtcbiAgICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFJhd1RyYW5zYWN0aW9uKGNsaWVudCwgdHhpZCkge1xuICAgIGNvbnN0IHN5bmNGdW5jID0gTWV0ZW9yLndyYXBBc3luYyhkb2ljaGFpbl9nZXRyYXd0cmFuc2FjdGlvbik7XG4gICAgcmV0dXJuIHN5bmNGdW5jKGNsaWVudCwgdHhpZCk7XG59XG5cbmZ1bmN0aW9uIGRvaWNoYWluX2dldHJhd3RyYW5zYWN0aW9uKGNsaWVudCwgdHhpZCwgY2FsbGJhY2spIHtcbiAgICBsb2dCbG9ja2NoYWluKCdkb2ljaGFpbl9nZXRyYXd0cmFuc2FjdGlvbjonLHR4aWQpO1xuICAgIGNsaWVudC5jbWQoJ2dldHJhd3RyYW5zYWN0aW9uJywgdHhpZCwgMSwgZnVuY3Rpb24oZXJyLCBkYXRhKSB7XG4gICAgICAgIGlmKGVycikgIGxvZ0Vycm9yKCdkb2ljaGFpbl9nZXRyYXd0cmFuc2FjdGlvbjonLGVycik7XG4gICAgICAgIGNhbGxiYWNrKGVyciwgZGF0YSk7XG4gICAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRCYWxhbmNlKGNsaWVudCkge1xuICAgIGNvbnN0IHN5bmNGdW5jID0gTWV0ZW9yLndyYXBBc3luYyhkb2ljaGFpbl9nZXRiYWxhbmNlKTtcbiAgICByZXR1cm4gc3luY0Z1bmMoY2xpZW50KTtcbn1cblxuZnVuY3Rpb24gZG9pY2hhaW5fZ2V0YmFsYW5jZShjbGllbnQsIGNhbGxiYWNrKSB7XG4gICAgY2xpZW50LmNtZCgnZ2V0YmFsYW5jZScsIGZ1bmN0aW9uKGVyciwgZGF0YSkge1xuICAgICAgICBpZihlcnIpIHsgbG9nRXJyb3IoJ2RvaWNoYWluX2dldGJhbGFuY2U6JyxlcnIpO31cbiAgICAgICAgY2FsbGJhY2soZXJyLCBkYXRhKTtcbiAgICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEluZm8oY2xpZW50KSB7XG4gICAgY29uc3Qgc3luY0Z1bmMgPSBNZXRlb3Iud3JhcEFzeW5jKGRvaWNoYWluX2dldGluZm8pO1xuICAgIHJldHVybiBzeW5jRnVuYyhjbGllbnQpO1xufVxuXG5mdW5jdGlvbiBkb2ljaGFpbl9nZXRpbmZvKGNsaWVudCwgY2FsbGJhY2spIHtcbiAgICBjbGllbnQuY21kKCdnZXRibG9ja2NoYWluaW5mbycsIGZ1bmN0aW9uKGVyciwgZGF0YSkge1xuICAgICAgICBpZihlcnIpIHsgbG9nRXJyb3IoJ2RvaWNoYWluLWdldGluZm86JyxlcnIpO31cbiAgICAgICAgY2FsbGJhY2soZXJyLCBkYXRhKTtcbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gY2hlY2tJZChpZCkge1xuICAgIGNvbnN0IERPSV9QUkVGSVggPSBcImRvaTogXCI7XG4gICAgbGV0IHJldF92YWwgPSBpZDsgLy9kZWZhdWx0IHZhbHVlXG5cbiAgICBpZihpZC5zdGFydHNXaXRoKERPSV9QUkVGSVgpKSByZXRfdmFsID0gaWQuc3Vic3RyaW5nKERPSV9QUkVGSVgubGVuZ3RoKTsgLy9pbiBjYXNlIGl0IHN0YXJ0cyB3aXRoIGRvaTogY3V0ICB0aGlzIGF3YXlcbiAgICBpZighaWQuc3RhcnRzV2l0aChOQU1FU1BBQ0UpKSByZXRfdmFsID0gTkFNRVNQQUNFK2lkOyAvL2luIGNhc2UgaXQgZG9lc24ndCBzdGFydCB3aXRoIGUvIHB1dCBpdCBpbiBmcm9udCBub3cuXG4gIHJldHVybiByZXRfdmFsO1xufVxuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgeyBIVFRQIH0gZnJvbSAnbWV0ZW9yL2h0dHAnXG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRIdHRwR0VUKHVybCwgcXVlcnkpIHtcbiAgY29uc3Qgc3luY0Z1bmMgPSBNZXRlb3Iud3JhcEFzeW5jKF9nZXQpO1xuICByZXR1cm4gc3luY0Z1bmModXJsLCBxdWVyeSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRIdHRwR0VUZGF0YSh1cmwsIGRhdGEpIHtcbiAgICBjb25zdCBzeW5jRnVuYyA9IE1ldGVvci53cmFwQXN5bmMoX2dldERhdGEpO1xuICAgIHJldHVybiBzeW5jRnVuYyh1cmwsIGRhdGEpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0SHR0cFBPU1QodXJsLCBkYXRhKSB7XG4gICAgY29uc3Qgc3luY0Z1bmMgPSBNZXRlb3Iud3JhcEFzeW5jKF9wb3N0KTtcbiAgICByZXR1cm4gc3luY0Z1bmModXJsLCBkYXRhKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEh0dHBQVVQodXJsLCBkYXRhKSB7XG4gICAgY29uc3Qgc3luY0Z1bmMgPSBNZXRlb3Iud3JhcEFzeW5jKF9wdXQpO1xuICAgIHJldHVybiBzeW5jRnVuYyh1cmwsIGRhdGEpO1xufVxuXG5mdW5jdGlvbiBfZ2V0KHVybCwgcXVlcnksIGNhbGxiYWNrKSB7XG4gIGNvbnN0IG91clVybCA9IHVybDtcbiAgY29uc3Qgb3VyUXVlcnkgPSBxdWVyeTtcbiAgSFRUUC5nZXQob3VyVXJsLCB7cXVlcnk6IG91clF1ZXJ5fSwgZnVuY3Rpb24oZXJyLCByZXQpIHtcbiAgICBjYWxsYmFjayhlcnIsIHJldCk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBfZ2V0RGF0YSh1cmwsIGRhdGEsIGNhbGxiYWNrKSB7XG4gICAgY29uc3Qgb3VyVXJsID0gdXJsO1xuICAgIGNvbnN0IG91ckRhdGEgPSBkYXRhO1xuICAgIEhUVFAuZ2V0KG91clVybCwgb3VyRGF0YSwgZnVuY3Rpb24oZXJyLCByZXQpIHtcbiAgICAgICAgY2FsbGJhY2soZXJyLCByZXQpO1xuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBfcG9zdCh1cmwsIGRhdGEsIGNhbGxiYWNrKSB7XG4gICAgY29uc3Qgb3VyVXJsID0gdXJsO1xuICAgIGNvbnN0IG91ckRhdGEgPSAgZGF0YTtcblxuICAgIEhUVFAucG9zdChvdXJVcmwsIG91ckRhdGEsIGZ1bmN0aW9uKGVyciwgcmV0KSB7XG4gICAgICAgIGNhbGxiYWNrKGVyciwgcmV0KTtcbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gX3B1dCh1cmwsIHVwZGF0ZURhdGEsIGNhbGxiYWNrKSB7XG4gICAgY29uc3Qgb3VyVXJsID0gdXJsO1xuICAgIGNvbnN0IG91ckRhdGEgPSB7XG4gICAgICAgIGRhdGE6IHVwZGF0ZURhdGFcbiAgICB9XG5cbiAgICBIVFRQLnB1dChvdXJVcmwsIG91ckRhdGEsIGZ1bmN0aW9uKGVyciwgcmV0KSB7XG4gICAgICBjYWxsYmFjayhlcnIsIHJldCk7XG4gICAgfSk7XG59XG4iLCJpbXBvcnQgJy4vbWFpbF9qb2JzLmpzJztcbmltcG9ydCAnLi9kb2ljaGFpbi5qcyc7XG5pbXBvcnQgJy4vYmxvY2tjaGFpbl9qb2JzLmpzJztcbmltcG9ydCAnLi9kYXBwX2pvYnMuanMnO1xuaW1wb3J0ICcuL2Rucy5qcyc7XG5pbXBvcnQgJy4vcmVzdC9yZXN0LmpzJztcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IHsgSm9iQ29sbGVjdGlvbiwgSm9iIH0gZnJvbSAnbWV0ZW9yL3ZzaXZzaTpqb2ItY29sbGVjdGlvbic7XG5leHBvcnQgY29uc3QgTWFpbEpvYnMgPSBKb2JDb2xsZWN0aW9uKCdlbWFpbHMnKTtcbmltcG9ydCBzZW5kTWFpbCBmcm9tICcuLi8uLi9pbXBvcnRzL21vZHVsZXMvc2VydmVyL2VtYWlscy9zZW5kLmpzJztcbmltcG9ydCB7bG9nTWFpbn0gZnJvbSBcIi4uLy4uL2ltcG9ydHMvc3RhcnR1cC9zZXJ2ZXIvbG9nLWNvbmZpZ3VyYXRpb25cIjtcblxuXG5cbk1haWxKb2JzLnByb2Nlc3NKb2JzKCdzZW5kJywgZnVuY3Rpb24gKGpvYiwgY2IpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCBlbWFpbCA9IGpvYi5kYXRhO1xuICAgIHNlbmRNYWlsKGVtYWlsKTtcbiAgICBqb2IuZG9uZSgpO1xuICB9IGNhdGNoKGV4Y2VwdGlvbikge1xuICAgIGpvYi5mYWlsKCk7XG4gICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignam9icy5tYWlsLnNlbmQuZXhjZXB0aW9uJywgZXhjZXB0aW9uKTtcbiAgfSBmaW5hbGx5IHtcbiAgICBjYigpO1xuICB9XG59KTtcblxuXG5uZXcgSm9iKE1haWxKb2JzLCAnY2xlYW51cCcsIHt9KVxuICAgIC5yZXBlYXQoeyBzY2hlZHVsZTogTWFpbEpvYnMubGF0ZXIucGFyc2UudGV4dChcImV2ZXJ5IDUgbWludXRlc1wiKSB9KVxuICAgIC5zYXZlKHtjYW5jZWxSZXBlYXRzOiB0cnVlfSlcblxubGV0IHEgPSBNYWlsSm9icy5wcm9jZXNzSm9icygnY2xlYW51cCcseyBwb2xsSW50ZXJ2YWw6IGZhbHNlLCB3b3JrVGltZW91dDogNjAqMTAwMCB9ICxmdW5jdGlvbiAoam9iLCBjYikge1xuICAgIGNvbnN0IGN1cnJlbnQgPSBuZXcgRGF0ZSgpXG4gICAgY3VycmVudC5zZXRNaW51dGVzKGN1cnJlbnQuZ2V0TWludXRlcygpIC0gNSk7XG5cbiAgICBjb25zdCBpZHMgPSBNYWlsSm9icy5maW5kKHtcbiAgICAgICAgICAgIHN0YXR1czogeyRpbjogSm9iLmpvYlN0YXR1c1JlbW92YWJsZX0sXG4gICAgICAgICAgICB1cGRhdGVkOiB7JGx0OiBjdXJyZW50fX0sXG4gICAgICAgIHtmaWVsZHM6IHsgX2lkOiAxIH19KTtcblxuICAgIGxvZ01haW4oJ2ZvdW5kICByZW1vdmFibGUgYmxvY2tjaGFpbiBqb2JzOicsaWRzKTtcbiAgICBNYWlsSm9icy5yZW1vdmVKb2JzKGlkcyk7XG4gICAgaWYoaWRzLmxlbmd0aCA+IDApe1xuICAgICAgICBqb2IuZG9uZShcIlJlbW92ZWQgI3tpZHMubGVuZ3RofSBvbGQgam9ic1wiKTtcbiAgICB9XG4gICAgY2IoKTtcbn0pO1xuXG5NYWlsSm9icy5maW5kKHsgdHlwZTogJ2pvYlR5cGUnLCBzdGF0dXM6ICdyZWFkeScgfSlcbiAgICAub2JzZXJ2ZSh7XG4gICAgICAgIGFkZGVkOiBmdW5jdGlvbiAoKSB7IHEudHJpZ2dlcigpOyB9XG4gICAgfSk7XG5cbiIsImltcG9ydCB7IFJlc3RpdnVzIH0gZnJvbSAnbWV0ZW9yL25pbWJsZTpyZXN0aXZ1cyc7XG5pbXBvcnQgeyBpc0RlYnVnIH0gZnJvbSAnLi4vLi4vLi4vaW1wb3J0cy9zdGFydHVwL3NlcnZlci9kYXBwLWNvbmZpZ3VyYXRpb24uanMnO1xuaW1wb3J0IHsgU0VORF9BUFAsIENPTkZJUk1fQVBQLCBWRVJJRllfQVBQLCBpc0FwcFR5cGUgfSBmcm9tICcuLi8uLi8uLi9pbXBvcnRzL3N0YXJ0dXAvc2VydmVyL3R5cGUtY29uZmlndXJhdGlvbi5qcyc7XG5cbmV4cG9ydCBjb25zdCBET0lfQ09ORklSTUFUSU9OX1JPVVRFID0gXCJvcHQtaW4vY29uZmlybVwiO1xuZXhwb3J0IGNvbnN0IERPSV9DT05GSVJNQVRJT05fTk9USUZZX1JPVVRFID0gXCJvcHQtaW5cIjtcbmV4cG9ydCBjb25zdCBET0lfV0FMTEVUTk9USUZZX1JPVVRFID0gXCJ3YWxsZXRub3RpZnlcIjtcbmV4cG9ydCBjb25zdCBET0lfRkVUQ0hfUk9VVEUgPSBcImRvaS1tYWlsXCI7XG5leHBvcnQgY29uc3QgRE9JX0VYUE9SVF9ST1VURSA9IFwiZXhwb3J0XCI7XG5leHBvcnQgY29uc3QgQVBJX1BBVEggPSBcImFwaS9cIjtcbmV4cG9ydCBjb25zdCBWRVJTSU9OID0gXCJ2MVwiO1xuXG5leHBvcnQgY29uc3QgQXBpID0gbmV3IFJlc3RpdnVzKHtcbiAgYXBpUGF0aDogQVBJX1BBVEgsXG4gIHZlcnNpb246IFZFUlNJT04sXG4gIHVzZURlZmF1bHRBdXRoOiB0cnVlLFxuICBwcmV0dHlKc29uOiB0cnVlXG59KTtcblxuaWYoaXNEZWJ1ZygpKSByZXF1aXJlKCcuL2ltcG9ydHMvZGVidWcuanMnKTtcbmlmKGlzQXBwVHlwZShTRU5EX0FQUCkpIHJlcXVpcmUoJy4vaW1wb3J0cy9zZW5kLmpzJyk7XG5pZihpc0FwcFR5cGUoQ09ORklSTV9BUFApKSByZXF1aXJlKCcuL2ltcG9ydHMvY29uZmlybS5qcycpO1xuaWYoaXNBcHBUeXBlKFZFUklGWV9BUFApKSByZXF1aXJlKCcuL2ltcG9ydHMvdmVyaWZ5LmpzJyk7XG5yZXF1aXJlKCcuL2ltcG9ydHMvdXNlci5qcycpO1xucmVxdWlyZSgnLi9pbXBvcnRzL3N0YXR1cy5qcycpO1xuIiwiaW1wb3J0IHsgQXBpLCBET0lfV0FMTEVUTk9USUZZX1JPVVRFLCBET0lfQ09ORklSTUFUSU9OX1JPVVRFIH0gZnJvbSAnLi4vcmVzdC5qcyc7XG5pbXBvcnQgY29uZmlybU9wdEluIGZyb20gJy4uLy4uLy4uLy4uL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvb3B0LWlucy9jb25maXJtLmpzJ1xuaW1wb3J0IGNoZWNrTmV3VHJhbnNhY3Rpb24gZnJvbSBcIi4uLy4uLy4uLy4uL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvZG9pY2hhaW4vY2hlY2tfbmV3X3RyYW5zYWN0aW9uc1wiO1xuaW1wb3J0IHtsb2dDb25maXJtfSBmcm9tIFwiLi4vLi4vLi4vLi4vaW1wb3J0cy9zdGFydHVwL3NlcnZlci9sb2ctY29uZmlndXJhdGlvblwiO1xuLy9kb2t1IG9mIG1ldGVvci1yZXN0aXZ1cyBodHRwczovL2dpdGh1Yi5jb20va2FobWFsaS9tZXRlb3ItcmVzdGl2dXNcbkFwaS5hZGRSb3V0ZShET0lfQ09ORklSTUFUSU9OX1JPVVRFKycvOmhhc2gnLCB7YXV0aFJlcXVpcmVkOiBmYWxzZX0sIHtcbiAgZ2V0OiB7XG4gICAgYWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IGhhc2ggPSB0aGlzLnVybFBhcmFtcy5oYXNoO1xuICAgICAgdHJ5IHtcbiAgICAgICAgbGV0IGlwID0gdGhpcy5yZXF1ZXN0LmhlYWRlcnNbJ3gtZm9yd2FyZGVkLWZvciddIHx8XG4gICAgICAgICAgdGhpcy5yZXF1ZXN0LmNvbm5lY3Rpb24ucmVtb3RlQWRkcmVzcyB8fFxuICAgICAgICAgIHRoaXMucmVxdWVzdC5zb2NrZXQucmVtb3RlQWRkcmVzcyB8fFxuICAgICAgICAgICh0aGlzLnJlcXVlc3QuY29ubmVjdGlvbi5zb2NrZXQgPyB0aGlzLnJlcXVlc3QuY29ubmVjdGlvbi5zb2NrZXQucmVtb3RlQWRkcmVzczogbnVsbCk7XG5cbiAgICAgICAgICBpZihpcC5pbmRleE9mKCcsJykhPS0xKWlwPWlwLnN1YnN0cmluZygwLGlwLmluZGV4T2YoJywnKSk7XG5cbiAgICAgICAgICBsb2dDb25maXJtKCdSRVNUIG9wdC1pbi9jb25maXJtIDonLHtoYXNoOmhhc2gsIGhvc3Q6aXB9KTtcbiAgICAgICAgICBjb25zdCByZWRpcmVjdCA9IGNvbmZpcm1PcHRJbih7aG9zdDogaXAsIGhhc2g6IGhhc2h9KTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHN0YXR1c0NvZGU6IDMwMyxcbiAgICAgICAgICBoZWFkZXJzOiB7J0NvbnRlbnQtVHlwZSc6ICd0ZXh0L3BsYWluJywgJ0xvY2F0aW9uJzogcmVkaXJlY3R9LFxuICAgICAgICAgIGJvZHk6ICdMb2NhdGlvbjogJytyZWRpcmVjdFxuICAgICAgICB9O1xuICAgICAgfSBjYXRjaChlcnJvcikge1xuICAgICAgICByZXR1cm4ge3N0YXR1c0NvZGU6IDUwMCwgYm9keToge3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiBlcnJvci5tZXNzYWdlfX07XG4gICAgICB9XG4gICAgfVxuICB9XG59KTtcblxuQXBpLmFkZFJvdXRlKERPSV9XQUxMRVROT1RJRllfUk9VVEUsIHtcbiAgICBnZXQ6IHtcbiAgICAgICAgYXV0aFJlcXVpcmVkOiBmYWxzZSxcbiAgICAgICAgYWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNvbnN0IHBhcmFtcyA9IHRoaXMucXVlcnlQYXJhbXM7XG4gICAgICAgICAgICBjb25zdCB0eGlkID0gcGFyYW1zLnR4O1xuXG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGNoZWNrTmV3VHJhbnNhY3Rpb24odHhpZCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtzdGF0dXM6ICdzdWNjZXNzJywgIGRhdGE6J3R4aWQ6Jyt0eGlkKycgd2FzIHJlYWQgZnJvbSBibG9ja2NoYWluJ307XG4gICAgICAgICAgICB9IGNhdGNoKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtzdGF0dXM6ICdmYWlsJywgZXJyb3I6IGVycm9yLm1lc3NhZ2V9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufSk7XG4iLCJpbXBvcnQgeyBBcGkgfSBmcm9tICcuLi9yZXN0LmpzJztcbkFwaS5hZGRSb3V0ZSgnZGVidWcvbWFpbCcsIHthdXRoUmVxdWlyZWQ6IGZhbHNlfSwge1xuICBnZXQ6IHtcbiAgICBhY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgZGF0YSA9IHtcbiAgICAgICAgXCJmcm9tXCI6IFwibm9yZXBseUBkb2ljaGFpbi5vcmdcIixcbiAgICAgICAgXCJzdWJqZWN0XCI6IFwiRG9pY2hhaW4ub3JnIE5ld3NsZXR0ZXIgQmVzdMOkdGlndW5nXCIsXG4gICAgICAgIFwicmVkaXJlY3RcIjogXCJodHRwczovL3d3dy5kb2ljaGFpbi5vcmcvdmllbGVuLWRhbmsvXCIsXG4gICAgICAgIFwicmV0dXJuUGF0aFwiOiBcIm5vcmVwbHlAZG9pY2hhaW4ub3JnXCIsXG4gICAgICAgIFwiY29udGVudFwiOlwiPHN0eWxlIHR5cGU9J3RleHQvY3NzJyBtZWRpYT0nc2NyZWVuJz5cXG5cIiArXG4gICAgICAgICAgICBcIioge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0bGluZS1oZWlnaHQ6IGluaGVyaXQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCIuRXh0ZXJuYWxDbGFzcyAqIHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGxpbmUtaGVpZ2h0OiAxMDAlO1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwiYm9keSwgcCB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRtYXJnaW46IDA7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRwYWRkaW5nOiAwO1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0bWFyZ2luLWJvdHRvbTogMDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdC13ZWJraXQtdGV4dC1zaXplLWFkanVzdDogbm9uZTtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdC1tcy10ZXh0LXNpemUtYWRqdXN0OiBub25lO1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwiaW1nIHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGxpbmUtaGVpZ2h0OiAxMDAlO1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0b3V0bGluZTogbm9uZTtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdHRleHQtZGVjb3JhdGlvbjogbm9uZTtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdC1tcy1pbnRlcnBvbGF0aW9uLW1vZGU6IGJpY3ViaWM7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCJhIGltZyB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRib3JkZXI6IG5vbmU7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCIjYmFja2dyb3VuZFRhYmxlIHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdG1hcmdpbjogMDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdHBhZGRpbmc6IDA7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHR3aWR0aDogMTAwJSAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwiYSwgYTpsaW5rLCAubm8tZGV0ZWN0LWxvY2FsIGEsIC5hcHBsZUxpbmtzIGEge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0Y29sb3I6ICM1NTU1ZmYgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdHRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lO1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwiLkV4dGVybmFsQ2xhc3Mge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0ZGlzcGxheTogYmxvY2sgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdHdpZHRoOiAxMDAlO1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwiLkV4dGVybmFsQ2xhc3MsIC5FeHRlcm5hbENsYXNzIHAsIC5FeHRlcm5hbENsYXNzIHNwYW4sIC5FeHRlcm5hbENsYXNzIGZvbnQsIC5FeHRlcm5hbENsYXNzIHRkLCAuRXh0ZXJuYWxDbGFzcyBkaXYge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0bGluZS1oZWlnaHQ6IGluaGVyaXQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCJ0YWJsZSB0ZCB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRib3JkZXItY29sbGFwc2U6IGNvbGxhcHNlO1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0bXNvLXRhYmxlLWxzcGFjZTogMHB0O1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0bXNvLXRhYmxlLXJzcGFjZTogMHB0O1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwic3VwIHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdHBvc2l0aW9uOiByZWxhdGl2ZTtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdHRvcDogNHB4O1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0bGluZS1oZWlnaHQ6IDdweCAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0Zm9udC1zaXplOiAxMXB4ICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCIubW9iaWxlX2xpbmsgYVtocmVmXj0ndGVsJ10sIC5tb2JpbGVfbGluayBhW2hyZWZePSdzbXMnXSB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHR0ZXh0LWRlY29yYXRpb246IGRlZmF1bHQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRjb2xvcjogIzU1NTVmZiAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0cG9pbnRlci1ldmVudHM6IGF1dG87XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRjdXJzb3I6IGRlZmF1bHQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCIubm8tZGV0ZWN0IGEge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0dGV4dC1kZWNvcmF0aW9uOiBub25lO1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0Y29sb3I6ICM1NTU1ZmY7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRwb2ludGVyLWV2ZW50czogYXV0bztcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGN1cnNvcjogZGVmYXVsdDtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcIntcXG5cIiArXG4gICAgICAgICAgICBcImNvbG9yOiAjNTU1NWZmO1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwic3BhbiB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRjb2xvcjogaW5oZXJpdDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGJvcmRlci1ib3R0b206IG5vbmU7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCJzcGFuOmhvdmVyIHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwiLm5vdW5kZXJsaW5lIHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdHRleHQtZGVjb3JhdGlvbjogbm9uZSAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwiaDEsIGgyLCBoMyB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRtYXJnaW46IDA7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRwYWRkaW5nOiAwO1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwicCB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRNYXJnaW46IDBweCAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwidGFibGVbY2xhc3M9J2VtYWlsLXJvb3Qtd3JhcHBlciddIHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdHdpZHRoOiA2MDBweCAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwiYm9keSB7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCJib2R5IHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdG1pbi13aWR0aDogMjgwcHg7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHR3aWR0aDogMTAwJTtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcInRkW2NsYXNzPSdwYXR0ZXJuJ10gLmMxMTJwMjByIHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdHdpZHRoOiAyMCU7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCJ0ZFtjbGFzcz0ncGF0dGVybiddIC5jMzM2cDYwciB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHR3aWR0aDogNjAuMDAwMDAwMDAwMDAwMjU2JTtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcIjwvc3R5bGU+XFxuXCIgK1xuICAgICAgICAgICAgXCI8c3R5bGU+XFxuXCIgK1xuICAgICAgICAgICAgXCJAbWVkaWEgb25seSBzY3JlZW4gYW5kIChtYXgtd2lkdGg6IDU5OXB4KSwgb25seSBzY3JlZW4gYW5kIChtYXgtZGV2aWNlLXdpZHRoOiA1OTlweCksIG9ubHkgc2NyZWVuIGFuZCAobWF4LXdpZHRoOiA0MDBweCksIG9ubHkgc2NyZWVuIGFuZCAobWF4LWRldmljZS13aWR0aDogNDAwcHgpIHtcXG5cIiArXG4gICAgICAgICAgICBcIi5lbWFpbC1yb290LXdyYXBwZXIge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0d2lkdGg6IDEwMCUgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcIi5mdWxsLXdpZHRoIHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdHdpZHRoOiAxMDAlICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRoZWlnaHQ6IGF1dG8gIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdHRleHQtYWxpZ246IGNlbnRlcjtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcIi5mdWxsd2lkdGhoYWxmbGVmdCB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHR3aWR0aDogMTAwJSAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwiLmZ1bGx3aWR0aGhhbGZyaWdodCB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHR3aWR0aDogMTAwJSAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwiLmZ1bGx3aWR0aGhhbGZpbm5lciB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHR3aWR0aDogMTAwJSAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0bWFyZ2luOiAwIGF1dG8gIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGZsb2F0OiBub25lICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRtYXJnaW4tbGVmdDogYXV0byAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0bWFyZ2luLXJpZ2h0OiBhdXRvICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRjbGVhcjogYm90aCAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwiLmhpZGUge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0ZGlzcGxheTogbm9uZSAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0d2lkdGg6IDBweCAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0aGVpZ2h0OiAwcHggIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdG92ZXJmbG93OiBoaWRkZW47XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCIuZGVza3RvcC1oaWRlIHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGRpc3BsYXk6IGJsb2NrICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHR3aWR0aDogMTAwJSAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0aGVpZ2h0OiBhdXRvICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRvdmVyZmxvdzogaGlkZGVuO1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0bWF4LWhlaWdodDogaW5oZXJpdCAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwiLmMxMTJwMjByIHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdHdpZHRoOiAxMDAlICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRmbG9hdDogbm9uZTtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcIi5jMzM2cDYwciB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHR3aWR0aDogMTAwJSAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0ZmxvYXQ6IG5vbmU7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCI8L3N0eWxlPlxcblwiICtcbiAgICAgICAgICAgIFwiPHN0eWxlPlxcblwiICtcbiAgICAgICAgICAgIFwiQG1lZGlhIG9ubHkgc2NyZWVuIGFuZCAobWluLXdpZHRoOiA2MDBweCkge1xcblwiICtcbiAgICAgICAgICAgIFwidGRbY2xhc3M9J3BhdHRlcm4nXSAuYzExMnAyMHIge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0d2lkdGg6IDExMnB4ICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCJ0ZFtjbGFzcz0ncGF0dGVybiddIC5jMzM2cDYwciB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHR3aWR0aDogMzM2cHggIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcIlxcblwiICtcbiAgICAgICAgICAgIFwiQG1lZGlhIG9ubHkgc2NyZWVuIGFuZCAobWF4LXdpZHRoOiA1OTlweCksIG9ubHkgc2NyZWVuIGFuZCAobWF4LWRldmljZS13aWR0aDogNTk5cHgpLCBvbmx5IHNjcmVlbiBhbmQgKG1heC13aWR0aDogNDAwcHgpLCBvbmx5IHNjcmVlbiBhbmQgKG1heC1kZXZpY2Utd2lkdGg6IDQwMHB4KSB7XFxuXCIgK1xuICAgICAgICAgICAgXCJ0YWJsZVtjbGFzcz0nZW1haWwtcm9vdC13cmFwcGVyJ10ge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0d2lkdGg6IDEwMCUgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcInRkW2NsYXNzPSd3cmFwJ10gLmZ1bGwtd2lkdGgge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0d2lkdGg6IDEwMCUgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGhlaWdodDogYXV0byAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwidGRbY2xhc3M9J3dyYXAnXSAuZnVsbHdpZHRoaGFsZmxlZnQge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0d2lkdGg6IDEwMCUgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcInRkW2NsYXNzPSd3cmFwJ10gLmZ1bGx3aWR0aGhhbGZyaWdodCB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHR3aWR0aDogMTAwJSAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwidGRbY2xhc3M9J3dyYXAnXSAuZnVsbHdpZHRoaGFsZmlubmVyIHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdHdpZHRoOiAxMDAlICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRtYXJnaW46IDAgYXV0byAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0ZmxvYXQ6IG5vbmUgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdG1hcmdpbi1sZWZ0OiBhdXRvICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRtYXJnaW4tcmlnaHQ6IGF1dG8gIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGNsZWFyOiBib3RoICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCJ0ZFtjbGFzcz0nd3JhcCddIC5oaWRlIHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGRpc3BsYXk6IG5vbmUgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdHdpZHRoOiAwcHg7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRoZWlnaHQ6IDBweDtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdG92ZXJmbG93OiBoaWRkZW47XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCJ0ZFtjbGFzcz0ncGF0dGVybiddIC5jMTEycDIwciB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHR3aWR0aDogMTAwJSAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwidGRbY2xhc3M9J3BhdHRlcm4nXSAuYzMzNnA2MHIge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0d2lkdGg6IDEwMCUgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcIlxcblwiICtcbiAgICAgICAgICAgIFwiQG1lZGlhIHlhaG9vIHtcXG5cIiArXG4gICAgICAgICAgICBcInRhYmxlIHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGZsb2F0OiBub25lICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRoZWlnaHQ6IGF1dG87XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCJ0YWJsZVthbGlnbj0nbGVmdCddIHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGZsb2F0OiBsZWZ0ICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCJ0ZFthbGlnbj0nbGVmdCddIHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGZsb2F0OiBsZWZ0ICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRoZWlnaHQ6IGF1dG87XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCJ0YWJsZVthbGlnbj0nY2VudGVyJ10ge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0bWFyZ2luOiAwIGF1dG87XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCJ0ZFthbGlnbj0nY2VudGVyJ10ge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0bWFyZ2luOiAwIGF1dG87XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRoZWlnaHQ6IGF1dG87XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCJ0YWJsZVthbGlnbj0ncmlnaHQnXSB7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRmbG9hdDogcmlnaHQgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcInRkW2FsaWduPSdyaWdodCddIHtcXG5cIiArXG4gICAgICAgICAgICBcIlxcdGZsb2F0OiByaWdodCAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0aGVpZ2h0OiBhdXRvO1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwiPC9zdHlsZT5cXG5cIiArXG4gICAgICAgICAgICBcIlxcblwiICtcbiAgICAgICAgICAgIFwiPCEtLVtpZiAoZ3RlIElFIDcpICYgKHZtbCldPlxcblwiICtcbiAgICAgICAgICAgIFwiPHN0eWxlIHR5cGU9J3RleHQvY3NzJz5cXG5cIiArXG4gICAgICAgICAgICBcImh0bWwsIGJvZHkge21hcmdpbjowICFpbXBvcnRhbnQ7IHBhZGRpbmc6MHB4ICFpbXBvcnRhbnQ7fVxcblwiICtcbiAgICAgICAgICAgIFwiaW1nLmZ1bGwtd2lkdGggeyBwb3NpdGlvbjogcmVsYXRpdmUgIWltcG9ydGFudDsgfVxcblwiICtcbiAgICAgICAgICAgIFwiXFxuXCIgK1xuICAgICAgICAgICAgXCIuaW1nMjQweDMwIHsgd2lkdGg6IDI0MHB4ICFpbXBvcnRhbnQ7IGhlaWdodDogMzBweCAhaW1wb3J0YW50O31cXG5cIiArXG4gICAgICAgICAgICBcIi5pbWcyMHgyMCB7IHdpZHRoOiAyMHB4ICFpbXBvcnRhbnQ7IGhlaWdodDogMjBweCAhaW1wb3J0YW50O31cXG5cIiArXG4gICAgICAgICAgICBcIlxcblwiICtcbiAgICAgICAgICAgIFwiPC9zdHlsZT5cXG5cIiArXG4gICAgICAgICAgICBcIjwhW2VuZGlmXS0tPlxcblwiICtcbiAgICAgICAgICAgIFwiXFxuXCIgK1xuICAgICAgICAgICAgXCI8IS0tW2lmIGd0ZSBtc28gOV0+XFxuXCIgK1xuICAgICAgICAgICAgXCI8c3R5bGUgdHlwZT0ndGV4dC9jc3MnPlxcblwiICtcbiAgICAgICAgICAgIFwiLm1zby1mb250LWZpeC1hcmlhbCB7IGZvbnQtZmFtaWx5OiBBcmlhbCwgc2Fucy1zZXJpZjt9XFxuXCIgK1xuICAgICAgICAgICAgXCIubXNvLWZvbnQtZml4LWdlb3JnaWEgeyBmb250LWZhbWlseTogR2VvcmdpYSwgc2Fucy1zZXJpZjt9XFxuXCIgK1xuICAgICAgICAgICAgXCIubXNvLWZvbnQtZml4LXRhaG9tYSB7IGZvbnQtZmFtaWx5OiBUYWhvbWEsIHNhbnMtc2VyaWY7fVxcblwiICtcbiAgICAgICAgICAgIFwiLm1zby1mb250LWZpeC10aW1lc19uZXdfcm9tYW4geyBmb250LWZhbWlseTogJ1RpbWVzIE5ldyBSb21hbicsIHNhbnMtc2VyaWY7fVxcblwiICtcbiAgICAgICAgICAgIFwiLm1zby1mb250LWZpeC10cmVidWNoZXRfbXMgeyBmb250LWZhbWlseTogJ1RyZWJ1Y2hldCBNUycsIHNhbnMtc2VyaWY7fVxcblwiICtcbiAgICAgICAgICAgIFwiLm1zby1mb250LWZpeC12ZXJkYW5hIHsgZm9udC1mYW1pbHk6IFZlcmRhbmEsIHNhbnMtc2VyaWY7fVxcblwiICtcbiAgICAgICAgICAgIFwiPC9zdHlsZT5cXG5cIiArXG4gICAgICAgICAgICBcIjwhW2VuZGlmXS0tPlxcblwiICtcbiAgICAgICAgICAgIFwiXFxuXCIgK1xuICAgICAgICAgICAgXCI8IS0tW2lmIGd0ZSBtc28gOV0+XFxuXCIgK1xuICAgICAgICAgICAgXCI8c3R5bGUgdHlwZT0ndGV4dC9jc3MnPlxcblwiICtcbiAgICAgICAgICAgIFwidGFibGUsIHRkIHtcXG5cIiArXG4gICAgICAgICAgICBcImJvcmRlci1jb2xsYXBzZTogY29sbGFwc2UgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIm1zby10YWJsZS1sc3BhY2U6IDBweCAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwibXNvLXRhYmxlLXJzcGFjZTogMHB4ICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCJcXG5cIiArXG4gICAgICAgICAgICBcIi5lbWFpbC1yb290LXdyYXBwZXIgeyB3aWR0aCA2MDBweCAhaW1wb3J0YW50O31cXG5cIiArXG4gICAgICAgICAgICBcIi5pbWdsaW5rIHsgZm9udC1zaXplOiAwcHg7IH1cXG5cIiArXG4gICAgICAgICAgICBcIi5lZG1fYnV0dG9uIHsgZm9udC1zaXplOiAwcHg7IH1cXG5cIiArXG4gICAgICAgICAgICBcIjwvc3R5bGU+XFxuXCIgK1xuICAgICAgICAgICAgXCI8IVtlbmRpZl0tLT5cXG5cIiArXG4gICAgICAgICAgICBcIlxcblwiICtcbiAgICAgICAgICAgIFwiPCEtLVtpZiBndGUgbXNvIDE1XT5cXG5cIiArXG4gICAgICAgICAgICBcIjxzdHlsZSB0eXBlPSd0ZXh0L2Nzcyc+XFxuXCIgK1xuICAgICAgICAgICAgXCJ0YWJsZSB7XFxuXCIgK1xuICAgICAgICAgICAgXCJmb250LXNpemU6MHB4O1xcblwiICtcbiAgICAgICAgICAgIFwibXNvLW1hcmdpbi10b3AtYWx0OjBweDtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcIlxcblwiICtcbiAgICAgICAgICAgIFwiLmZ1bGx3aWR0aGhhbGZsZWZ0IHtcXG5cIiArXG4gICAgICAgICAgICBcIndpZHRoOiA0OSUgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcImZsb2F0OmxlZnQgIWltcG9ydGFudDtcXG5cIiArXG4gICAgICAgICAgICBcIn1cXG5cIiArXG4gICAgICAgICAgICBcIlxcblwiICtcbiAgICAgICAgICAgIFwiLmZ1bGx3aWR0aGhhbGZyaWdodCB7XFxuXCIgK1xuICAgICAgICAgICAgXCJ3aWR0aDogNTAlICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJmbG9hdDpyaWdodCAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwifVxcblwiICtcbiAgICAgICAgICAgIFwiPC9zdHlsZT5cXG5cIiArXG4gICAgICAgICAgICBcIjwhW2VuZGlmXS0tPlxcblwiICtcbiAgICAgICAgICAgIFwiPHN0eWxlIHR5cGU9J3RleHQvY3NzJyBtZWRpYT0nKHBvaW50ZXIpIGFuZCAobWluLWNvbG9yLWluZGV4OjApJz5cXG5cIiArXG4gICAgICAgICAgICBcImh0bWwsIGJvZHkge1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0YmFja2dyb3VuZC1pbWFnZTogbm9uZSAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0YmFja2dyb3VuZC1jb2xvcjogI2ViZWJlYiAhaW1wb3J0YW50O1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0bWFyZ2luOiAwICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJcXHRwYWRkaW5nOiAwICFpbXBvcnRhbnQ7XFxuXCIgK1xuICAgICAgICAgICAgXCJ9XFxuXCIgK1xuICAgICAgICAgICAgXCI8L3N0eWxlPlxcblwiICtcbiAgICAgICAgICAgIFwiPC9oZWFkPlxcblwiICtcbiAgICAgICAgICAgIFwiPGJvZHkgbGVmdG1hcmdpbj0nMCcgbWFyZ2lud2lkdGg9JzAnIHRvcG1hcmdpbj0nMCcgbWFyZ2luaGVpZ2h0PScwJyBvZmZzZXQ9JzAnIGJhY2tncm91bmQ9XFxcIlxcXCIgYmdjb2xvcj0nI2ViZWJlYicgc3R5bGU9J2ZvbnQtZmFtaWx5OkFyaWFsLCBzYW5zLXNlcmlmOyBmb250LXNpemU6MHB4O21hcmdpbjowO3BhZGRpbmc6MDsgJz5cXG5cIiArXG4gICAgICAgICAgICBcIjwhLS1baWYgdF0+PCFbZW5kaWZdLS0+PCEtLVtpZiB0XT48IVtlbmRpZl0tLT48IS0tW2lmIHRdPjwhW2VuZGlmXS0tPjwhLS1baWYgdF0+PCFbZW5kaWZdLS0+PCEtLVtpZiB0XT48IVtlbmRpZl0tLT48IS0tW2lmIHRdPjwhW2VuZGlmXS0tPlxcblwiICtcbiAgICAgICAgICAgIFwiPHRhYmxlIGFsaWduPSdjZW50ZXInIGJvcmRlcj0nMCcgY2VsbHBhZGRpbmc9JzAnIGNlbGxzcGFjaW5nPScwJyBiYWNrZ3JvdW5kPVxcXCJcXFwiICBoZWlnaHQ9JzEwMCUnIHdpZHRoPScxMDAlJyBpZD0nYmFja2dyb3VuZFRhYmxlJz5cXG5cIiArXG4gICAgICAgICAgICBcIiAgPHRyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgIDx0ZCBjbGFzcz0nd3JhcCcgYWxpZ249J2NlbnRlcicgdmFsaWduPSd0b3AnIHdpZHRoPScxMDAlJz5cXG5cIiArXG4gICAgICAgICAgICBcIlxcdFxcdDxjZW50ZXI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgIDwhLS0gY29udGVudCAtLT5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgXFx0PGRpdiBzdHlsZT0ncGFkZGluZzogMHB4Oyc+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgIFxcdCAgPHRhYmxlIGNlbGxwYWRkaW5nPScwJyBjZWxsc3BhY2luZz0nMCcgYm9yZGVyPScwJyB3aWR0aD0nMTAwJScgYmdjb2xvcj0nI2ViZWJlYic+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgIFxcdFxcdCA8dHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICBcXHRcXHQgIDx0ZCB2YWxpZ249J3RvcCcgc3R5bGU9J3BhZGRpbmc6IDBweDsnPlxcblwiICtcbiAgICAgICAgICAgIFwiXFx0XFx0XFx0XFx0XFx0XFx0ICA8dGFibGUgY2VsbHBhZGRpbmc9JzAnIGNlbGxzcGFjaW5nPScwJyB3aWR0aD0nNjAwJyBhbGlnbj0nY2VudGVyJyBzdHlsZT0nbWF4LXdpZHRoOiA2MDBweDttaW4td2lkdGg6IDI0MHB4O21hcmdpbjogMCBhdXRvOycgY2xhc3M9J2VtYWlsLXJvb3Qtd3JhcHBlcic+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgIFxcdFxcdCBcXHRcXHQ8dHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgXFx0XFx0XFx0XFx0XFx0IDx0ZCB2YWxpZ249J3RvcCcgc3R5bGU9J3BhZGRpbmc6IDBweDsnPlxcblwiICtcbiAgICAgICAgICAgIFwiXFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0IFxcdFxcdDx0YWJsZSBjZWxscGFkZGluZz0nMCcgY2VsbHNwYWNpbmc9JzAnIGJvcmRlcj0nMCcgd2lkdGg9JzEwMCUnIGJnY29sb3I9JyNGRkZGRkYnIHN0eWxlPSdib3JkZXI6IDBweCBub25lO2JhY2tncm91bmQtY29sb3I6ICNGRkZGRkY7Jz5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgXFx0XFx0XFx0XFx0XFx0XFx0IDx0cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgXFx0XFx0XFx0ICBcXHRcXHRcXHRcXHQgPHRkIHZhbGlnbj0ndG9wJyBzdHlsZT0ncGFkZGluZy10b3A6IDMwcHg7cGFkZGluZy1yaWdodDogMjBweDtwYWRkaW5nLWJvdHRvbTogMzVweDtwYWRkaW5nLWxlZnQ6IDIwcHg7Jz5cXG5cIiArXG4gICAgICAgICAgICBcIlxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdCAgIFxcdFxcdFxcdFxcdFxcblwiICtcbiAgICAgICAgICAgIFwiXFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0PHRhYmxlIGNlbGxwYWRkaW5nPScwJ1xcblwiICtcbiAgICAgICAgICAgIFwiXFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0Y2VsbHNwYWNpbmc9JzAnIGJvcmRlcj0nMCcgYWxpZ249J2NlbnRlcicgd2lkdGg9JzI0MCcgIHN0eWxlPSdib3JkZXI6IDBweCBub25lO2hlaWdodDogYXV0bzsnIGNsYXNzPSdmdWxsLXdpZHRoJz5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXFx0IFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdDx0cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0PHRkIHZhbGlnbj0ndG9wJyBzdHlsZT0ncGFkZGluZzogMHB4Oyc+PGltZyBzcmM9J2h0dHBzOi8vc2YyNi5zZW5kc2Z4LmNvbS9hZG1pbi90ZW1wL3VzZXIvMTcvZG9pY2hhaW5fMTAwaC5wbmcnIHdpZHRoPScyNDAnIGhlaWdodD0nMzAnIGFsdD1cXFwiXFxcIiBib3JkZXI9JzAnIHN0eWxlPSdkaXNwbGF5OiBibG9jazt3aWR0aDogMTAwJTtoZWlnaHQ6IGF1dG87JyBjbGFzcz0nZnVsbC13aWR0aCBpbWcyNDB4MzAnIC8+PC90ZD5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXFx0IFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdDwvdHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0PC90YWJsZT5cXG5cIiArXG4gICAgICAgICAgICBcIlxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcblwiICtcbiAgICAgICAgICAgIFwiXFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0XFx0PC90ZD5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICBcXHRcXHQgIFxcdFxcdFxcdFxcdDwvdHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgXFx0XFx0XFx0XFx0XFx0PC90YWJsZT5cXG5cIiArXG4gICAgICAgICAgICBcIlxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdCBcXG5cIiArXG4gICAgICAgICAgICBcIlxcdFxcdFxcdFxcdFxcdFxcdFxcdFxcdCBcXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICA8dGFibGUgY2VsbHBhZGRpbmc9JzAnIGNlbGxzcGFjaW5nPScwJyBib3JkZXI9JzAnIHdpZHRoPScxMDAlJyBiZ2NvbG9yPScjMDA3MWFhJyBzdHlsZT0nYm9yZGVyOiAwcHggbm9uZTtiYWNrZ3JvdW5kLWNvbG9yOiAjMDA3MWFhO2JhY2tncm91bmQtaW1hZ2U6IHVybCgnaHR0cHM6Ly9zZjI2LnNlbmRzZnguY29tL2FkbWluL3RlbXAvdXNlci8xNy9ibHVlLWJnLmpwZycpO2JhY2tncm91bmQtcmVwZWF0OiBuby1yZXBlYXQgO2JhY2tncm91bmQtcG9zaXRpb246IGNlbnRlcjsnPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgdmFsaWduPSd0b3AnIHN0eWxlPSdwYWRkaW5nLXRvcDogNDBweDtwYWRkaW5nLXJpZ2h0OiAyMHB4O3BhZGRpbmctYm90dG9tOiA0NXB4O3BhZGRpbmctbGVmdDogMjBweDsnPjx0YWJsZSBjZWxscGFkZGluZz0nMCcgY2VsbHNwYWNpbmc9JzAnIHdpZHRoPScxMDAlJz5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIHN0eWxlPSdwYWRkaW5nOiAwcHg7JyBjbGFzcz0ncGF0dGVybic+PHRhYmxlIGNlbGxwYWRkaW5nPScwJyBjZWxsc3BhY2luZz0nMCcgYm9yZGVyPScwJyB3aWR0aD0nMTAwJSc+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCB2YWxpZ249J3RvcCcgc3R5bGU9J3BhZGRpbmctYm90dG9tOiAxMHB4Oyc+PGRpdiBzdHlsZT0ndGV4dC1hbGlnbjogbGVmdDtmb250LWZhbWlseTogYXJpYWw7Zm9udC1zaXplOiAyMHB4O2NvbG9yOiAjZmZmZmZmO2xpbmUtaGVpZ2h0OiAzMHB4O21zby1saW5lLWhlaWdodDogZXhhY3RseTttc28tdGV4dC1yYWlzZTogNXB4Oyc+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cFxcblwiICtcbiAgICAgICAgICAgIFwic3R5bGU9J3BhZGRpbmc6IDA7IG1hcmdpbjogMDt0ZXh0LWFsaWduOiBjZW50ZXI7Jz5CaXR0ZSBiZXN0w6R0aWdlbiBTaWUgSWhyZSBBbm1lbGR1bmc8L3A+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+PC90ZD5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90YWJsZT5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGFibGUgY2VsbHBhZGRpbmc9JzAnIGNlbGxzcGFjaW5nPScwJyBib3JkZXI9JzAnIHdpZHRoPScxMDAlJz5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIHZhbGlnbj0ndG9wJyBzdHlsZT0ncGFkZGluZzogMDttc28tY2VsbHNwYWNpbmc6IDBpbjsnPjx0YWJsZSBjZWxscGFkZGluZz0nMCcgY2VsbHNwYWNpbmc9JzAnIGJvcmRlcj0nMCcgYWxpZ249J2xlZnQnIHdpZHRoPScxMTInICBzdHlsZT0nZmxvYXQ6IGxlZnQ7JyBjbGFzcz0nYzExMnAyMHInPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgdmFsaWduPSd0b3AnIHN0eWxlPSdwYWRkaW5nOiAwcHg7Jz48dGFibGUgY2VsbHBhZGRpbmc9JzAnIGNlbGxzcGFjaW5nPScwJyBib3JkZXI9JzAnIHdpZHRoPScxMDAlJyBzdHlsZT0nYm9yZGVyOiAwcHggbm9uZTsnIGNsYXNzPSdoaWRlJz5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIHZhbGlnbj0ndG9wJyBzdHlsZT0ncGFkZGluZzogMHB4Oyc+PHRhYmxlIGNlbGxwYWRkaW5nPScwJyBjZWxsc3BhY2luZz0nMCcgd2lkdGg9JzEwMCUnPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgc3R5bGU9J3BhZGRpbmc6IDBweDsnPjx0YWJsZSBjZWxscGFkZGluZz0nMCcgY2VsbHNwYWNpbmc9JzAnIHdpZHRoPScxMDAlJz5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIGFsaWduPSdjZW50ZXInIHN0eWxlPSdwYWRkaW5nOiAwcHg7Jz48dGFibGUgY2VsbHBhZGRpbmc9JzAnIGNlbGxzcGFjaW5nPScwJyBib3JkZXI9JzAnIGFsaWduPSdjZW50ZXInIHdpZHRoPScyMCcgIHN0eWxlPSdib3JkZXI6IDBweCBub25lO2hlaWdodDogYXV0bzsnPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgdmFsaWduPSd0b3AnIHN0eWxlPSdwYWRkaW5nOiAwcHg7Jz48aW1nXFxuXCIgK1xuICAgICAgICAgICAgXCJzcmM9J2h0dHBzOi8vc2YyNi5zZW5kc2Z4LmNvbS9hZG1pbi90ZW1wL3VzZXIvMTcvaW1nXzg5ODM3MzE4LnBuZycgd2lkdGg9JzIwJyBoZWlnaHQ9JzIwJyBhbHQ9XFxcIlxcXCIgYm9yZGVyPScwJyBzdHlsZT0nZGlzcGxheTogYmxvY2s7JyBjbGFzcz0naW1nMjB4MjAnIC8+PC90ZD5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90YWJsZT48L3RkPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RhYmxlPjwvdGQ+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGFibGU+PC90ZD5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90YWJsZT48L3RkPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RhYmxlPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwhLS1baWYgZ3RlIG1zbyA5XT48L3RkPjx0ZCB2YWxpZ249J3RvcCcgc3R5bGU9J3BhZGRpbmc6MDsnPjwhW2VuZGlmXS0tPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0YWJsZSBjZWxscGFkZGluZz0nMCcgY2VsbHNwYWNpbmc9JzAnIGJvcmRlcj0nMCcgYWxpZ249J2xlZnQnIHdpZHRoPSczMzYnICBzdHlsZT0nZmxvYXQ6IGxlZnQ7JyBjbGFzcz0nYzMzNnA2MHInPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgdmFsaWduPSd0b3AnIHN0eWxlPSdwYWRkaW5nOiAwcHg7Jz48dGFibGUgY2VsbHBhZGRpbmc9JzAnIGNlbGxzcGFjaW5nPScwJyBib3JkZXI9JzAnIHdpZHRoPScxMDAlJz5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIHZhbGlnbj0ndG9wJyBzdHlsZT0ncGFkZGluZy1ib3R0b206IDMwcHg7Jz48dGFibGUgY2VsbHBhZGRpbmc9JzAnIGNlbGxzcGFjaW5nPScwJyB3aWR0aD0nMTAwJSc+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBzdHlsZT0ncGFkZGluZzogMHB4Oyc+PHRhYmxlIGNlbGxwYWRkaW5nPScwJyBjZWxsc3BhY2luZz0nMCcgYm9yZGVyPScwJyB3aWR0aD0nMTAwJScgc3R5bGU9J2JvcmRlci10b3A6IDJweCBzb2xpZCAjZmZmZmZmOyc+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCB2YWxpZ249J3RvcCc+PHRhYmxlIGNlbGxwYWRkaW5nPScwJyBjZWxsc3BhY2luZz0nMCcgd2lkdGg9JzEwMCUnPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgc3R5bGU9J3BhZGRpbmc6IDBweDsnPjwvdGQ+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGFibGU+PC90ZD5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90YWJsZT48L3RkPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RhYmxlPjwvdGQ+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGFibGU+PC90ZD5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90YWJsZT5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8IS0tW2lmIGd0ZSBtc28gOV0+PC90ZD48dGQgdmFsaWduPSd0b3AnIHN0eWxlPSdwYWRkaW5nOjA7Jz48IVtlbmRpZl0tLT5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGFibGUgY2VsbHBhZGRpbmc9JzAnIGNlbGxzcGFjaW5nPScwJyBib3JkZXI9JzAnIGFsaWduPSdsZWZ0JyB3aWR0aD0nMTEyJyAgc3R5bGU9J2Zsb2F0OiBsZWZ0OycgY2xhc3M9J2MxMTJwMjByJz5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIHZhbGlnbj0ndG9wJyBzdHlsZT0ncGFkZGluZzogMHB4Oyc+PHRhYmxlIGNlbGxwYWRkaW5nPScwJyBjZWxsc3BhY2luZz0nMCcgYm9yZGVyPScwJyB3aWR0aD0nMTAwJScgc3R5bGU9J2JvcmRlcjogMHB4IG5vbmU7JyBjbGFzcz0naGlkZSc+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCB2YWxpZ249J3RvcCcgc3R5bGU9J3BhZGRpbmc6IDBweDsnPjx0YWJsZSBjZWxscGFkZGluZz0nMCcgY2VsbHNwYWNpbmc9JzAnIHdpZHRoPScxMDAlJz5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIHN0eWxlPSdwYWRkaW5nOiAwcHg7Jz48dGFibGUgY2VsbHBhZGRpbmc9JzAnIGNlbGxzcGFjaW5nPScwJyB3aWR0aD0nMTAwJSc+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBhbGlnbj0nY2VudGVyJyBzdHlsZT0ncGFkZGluZzogMHB4Oyc+PHRhYmxlIGNlbGxwYWRkaW5nPScwJyBjZWxsc3BhY2luZz0nMCcgYm9yZGVyPScwJyBhbGlnbj0nY2VudGVyJyB3aWR0aD0nMjAnICBzdHlsZT0nYm9yZGVyOiAwcHggbm9uZTtoZWlnaHQ6IGF1dG87Jz5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIHZhbGlnbj0ndG9wJyBzdHlsZT0ncGFkZGluZzogMHB4Oyc+PGltZyBzcmM9J2h0dHBzOi8vc2YyNi5zZW5kc2Z4LmNvbS9hZG1pbi90ZW1wL3VzZXIvMTcvaW1nXzg5ODM3MzE4LnBuZycgd2lkdGg9JzIwJyBoZWlnaHQ9JzIwJyBhbHQ9XFxcIlxcXCIgYm9yZGVyPScwJyBzdHlsZT0nZGlzcGxheTogYmxvY2s7JyBjbGFzcz0naW1nMjB4MjAnXFxuXCIgK1xuICAgICAgICAgICAgXCIvPjwvdGQ+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGFibGU+PC90ZD5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90YWJsZT48L3RkPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RhYmxlPjwvdGQ+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGFibGU+PC90ZD5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90YWJsZT48L3RkPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RhYmxlPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0YWJsZSBjZWxscGFkZGluZz0nMCcgY2VsbHNwYWNpbmc9JzAnIGJvcmRlcj0nMCcgd2lkdGg9JzEwMCUnPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgdmFsaWduPSd0b3AnIHN0eWxlPSdwYWRkaW5nLWJvdHRvbTogMjBweDsnPjxkaXYgc3R5bGU9J3RleHQtYWxpZ246IGxlZnQ7Zm9udC1mYW1pbHk6IGFyaWFsO2ZvbnQtc2l6ZTogMTZweDtjb2xvcjogI2ZmZmZmZjtsaW5lLWhlaWdodDogMjZweDttc28tbGluZS1oZWlnaHQ6IGV4YWN0bHk7bXNvLXRleHQtcmFpc2U6IDVweDsnPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHAgc3R5bGU9J3BhZGRpbmc6IDA7IG1hcmdpbjogMDt0ZXh0LWFsaWduOiBjZW50ZXI7Jz5WaWVsZW4gRGFuaywgZGFzcyBTaWUgc2ljaCBmw7xyIHVuc2VyZW4gTmV3c2xldHRlciBhbmdlbWVsZGV0IGhhYmVuLjwvcD5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwIHN0eWxlPSdwYWRkaW5nOiAwOyBtYXJnaW46IDA7dGV4dC1hbGlnbjogY2VudGVyOyc+VW0gZGllc2UgRS1NYWlsLUFkcmVzc2UgdW5kIElocmUga29zdGVubG9zZSBBbm1lbGR1bmcgenUgYmVzdMOkdGlnZW4sIGtsaWNrZW4gU2llIGJpdHRlIGpldHp0IGF1ZiBkZW4gZm9sZ2VuZGVuIEJ1dHRvbjo8L3A+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+PC90ZD5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90YWJsZT5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGFibGUgY2VsbHBhZGRpbmc9JzAnIGNlbGxzcGFjaW5nPScwJyB3aWR0aD0nMTAwJSc+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBhbGlnbj0nY2VudGVyJyBzdHlsZT0ncGFkZGluZzogMHB4Oyc+PHRhYmxlIGNlbGxwYWRkaW5nPScwJyBjZWxsc3BhY2luZz0nMCcgYm9yZGVyPScwJyBhbGlnbj0nY2VudGVyJyBzdHlsZT0ndGV4dC1hbGlnbjogY2VudGVyO2NvbG9yOiAjMDAwOycgY2xhc3M9J2Z1bGwtd2lkdGgnPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgdmFsaWduPSd0b3AnIGFsaWduPSdjZW50ZXInIHN0eWxlPSdwYWRkaW5nLXJpZ2h0OiAxMHB4O3BhZGRpbmctYm90dG9tOiAzMHB4O3BhZGRpbmctbGVmdDogMTBweDsnPjx0YWJsZSBjZWxscGFkZGluZz0nMCcgY2VsbHNwYWNpbmc9JzAnIGJvcmRlcj0nMCcgYmdjb2xvcj0nIzg1YWMxYycgc3R5bGU9J2JvcmRlcjogMHB4IG5vbmU7Ym9yZGVyLXJhZGl1czogNXB4O2JvcmRlci1jb2xsYXBzZTogc2VwYXJhdGUgIWltcG9ydGFudDtiYWNrZ3JvdW5kLWNvbG9yOiAjODVhYzFjOycgY2xhc3M9J2Z1bGwtd2lkdGgnPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgdmFsaWduPSd0b3AnIGFsaWduPSdjZW50ZXInIHN0eWxlPSdwYWRkaW5nOiAxMnB4Oyc+PGEgaHJlZj0nJHtjb25maXJtYXRpb25fdXJsfScgdGFyZ2V0PSdfYmxhbmsnIHN0eWxlPSd0ZXh0LWRlY29yYXRpb246IG5vbmU7JyBjbGFzcz0nZWRtX2J1dHRvbic+PHNwYW4gc3R5bGU9J2ZvbnQtZmFtaWx5OiBhcmlhbDtmb250LXNpemU6IDE4cHg7Y29sb3I6ICNmZmZmZmY7bGluZS1oZWlnaHQ6IDI4cHg7dGV4dC1kZWNvcmF0aW9uOiBub25lOyc+PHNwYW5cXG5cIiArXG4gICAgICAgICAgICBcInN0eWxlPSdmb250LXNpemU6IDE4cHg7Jz5KZXR6dCBBbm1lbGR1bmcgYmVzdCZhdW1sO3RpZ2VuPC9zcGFuPjwvc3Bhbj4gPC9hPjwvdGQ+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGFibGU+PC90ZD5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90YWJsZT48L3RkPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RhYmxlPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9J3RleHQtYWxpZ246IGxlZnQ7Zm9udC1mYW1pbHk6IGFyaWFsO2ZvbnQtc2l6ZTogMTJweDtjb2xvcjogI2ZmZmZmZjtsaW5lLWhlaWdodDogMjJweDttc28tbGluZS1oZWlnaHQ6IGV4YWN0bHk7bXNvLXRleHQtcmFpc2U6IDVweDsnPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHAgc3R5bGU9J3BhZGRpbmc6IDA7IG1hcmdpbjogMDt0ZXh0LWFsaWduOiBjZW50ZXI7Jz5XZW5uIFNpZSBpaHJlIEUtTWFpbC1BZHJlc3NlIG5pY2h0IGJlc3TDpHRpZ2VuLCBrw7ZubmVuIGtlaW5lIE5ld3NsZXR0ZXIgenVnZXN0ZWxsdCB3ZXJkZW4uIElociBFaW52ZXJzdMOkbmRuaXMga8O2bm5lbiBTaWUgc2VsYnN0dmVyc3TDpG5kbGljaCBqZWRlcnplaXQgd2lkZXJydWZlbi4gU29sbHRlIGVzIHNpY2ggYmVpIGRlciBBbm1lbGR1bmcgdW0gZWluIFZlcnNlaGVuIGhhbmRlbG4gb2RlciB3dXJkZSBkZXIgTmV3c2xldHRlciBuaWNodCBpbiBJaHJlbSBOYW1lbiBiZXN0ZWxsdCwga8O2bm5lbiBTaWUgZGllc2UgRS1NYWlsIGVpbmZhY2ggaWdub3JpZXJlbi4gSWhuZW4gd2VyZGVuIGtlaW5lIHdlaXRlcmVuIE5hY2hyaWNodGVuIHp1Z2VzY2hpY2t0LjwvcD5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj48L3RkPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RhYmxlPjwvdGQ+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgIDwvdGFibGU+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgPHRhYmxlIGNlbGxwYWRkaW5nPScwJyBjZWxsc3BhY2luZz0nMCcgYm9yZGVyPScwJyB3aWR0aD0nMTAwJScgYmdjb2xvcj0nI2ZmZmZmZicgc3R5bGU9J2JvcmRlcjogMHB4IG5vbmU7YmFja2dyb3VuZC1jb2xvcjogI2ZmZmZmZjsnPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgdmFsaWduPSd0b3AnIHN0eWxlPSdwYWRkaW5nLXRvcDogMzBweDtwYWRkaW5nLXJpZ2h0OiAyMHB4O3BhZGRpbmctYm90dG9tOiAzNXB4O3BhZGRpbmctbGVmdDogMjBweDsnPjx0YWJsZSBjZWxscGFkZGluZz0nMCcgY2VsbHNwYWNpbmc9JzAnIHdpZHRoPScxMDAlJz5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIHN0eWxlPSdwYWRkaW5nOiAwcHg7Jz48dGFibGUgY2VsbHBhZGRpbmc9JzAnIGNlbGxzcGFjaW5nPScwJyBib3JkZXI9JzAnIHdpZHRoPScxMDAlJz5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIHZhbGlnbj0ndG9wJyBzdHlsZT0ncGFkZGluZy1ib3R0b206IDI1cHg7Jz48ZGl2IHN0eWxlPSd0ZXh0LWFsaWduOiBsZWZ0O2ZvbnQtZmFtaWx5OiBhcmlhbDtmb250LXNpemU6IDEycHg7Y29sb3I6ICMzMzMzMzM7bGluZS1oZWlnaHQ6IDIycHg7bXNvLWxpbmUtaGVpZ2h0OiBleGFjdGx5O21zby10ZXh0LXJhaXNlOiA1cHg7Jz5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwIHN0eWxlPSdwYWRkaW5nOiAwOyBtYXJnaW46IDA7dGV4dC1hbGlnbjogY2VudGVyOyc+PHNwYW4gc3R5bGU9J2xpbmUtaGVpZ2h0OiAzOyc+PHN0cm9uZz5Lb250YWt0PC9zdHJvbmc+PC9zcGFuPjxicj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VydmljZUBzZW5kZWZmZWN0LmRlPGJyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3d3cuc2VuZGVmZmVjdC5kZTxicj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVGVsZWZvbjogKzQ5ICgwKSA4NTcxIC0gOTcgMzkgLSA2OS0wPC9wPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PjwvdGQ+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGFibGU+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT0ndGV4dC1hbGlnbjogbGVmdDtmb250LWZhbWlseTogYXJpYWw7Zm9udC1zaXplOiAxMnB4O2NvbG9yOiAjMzMzMzMzO2xpbmUtaGVpZ2h0OiAyMnB4O21zby1saW5lLWhlaWdodDogZXhhY3RseTttc28tdGV4dC1yYWlzZTogNXB4Oyc+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cCBzdHlsZT0ncGFkZGluZzogMDsgbWFyZ2luOiAwO3RleHQtYWxpZ246IGNlbnRlcjsnPjxzcGFuIHN0eWxlPSdsaW5lLWhlaWdodDogMzsnPjxzdHJvbmc+SW1wcmVzc3VtPC9zdHJvbmc+PC9zcGFuPjxicj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQW5zY2hyaWZ0OiBTY2h1bGdhc3NlIDUsIEQtODQzNTkgU2ltYmFjaCBhbSBJbm4sIGVNYWlsOiBzZXJ2aWNlQHNlbmRlZmZlY3QuZGU8YnI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEJldHJlaWJlcjogV0VCYW5pemVyIEFHLCBSZWdpc3RlcmdlcmljaHQ6IEFtdHNnZXJpY2h0IExhbmRzaHV0IEhSQiA1MTc3LCBVc3RJZC46IERFIDIwNjggNjIgMDcwPGJyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBWb3JzdGFuZDogT3R0bWFyIE5ldWJ1cmdlciwgQXVmc2ljaHRzcmF0OiBUb2JpYXMgTmV1YnVyZ2VyPC9wPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PjwvdGQ+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGFibGU+PC90ZD5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICAgICAgICAgICAgPC90YWJsZT48L3RkPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgICAgICAgICAgPC90cj5cXG5cIiArXG4gICAgICAgICAgICBcIiAgICAgICAgICAgICAgICA8L3RhYmxlPjwvdGQ+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgICAgICA8L3RyPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICAgIDwvdGFibGU+XFxuXCIgK1xuICAgICAgICAgICAgXCIgICAgICAgIDwvZGl2PlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgICA8IS0tIGNvbnRlbnQgZW5kIC0tPlxcblwiICtcbiAgICAgICAgICAgIFwiICAgICAgPC9jZW50ZXI+PC90ZD5cXG5cIiArXG4gICAgICAgICAgICBcIiAgPC90cj5cXG5cIiArXG4gICAgICAgICAgICBcIjwvdGFibGU+XCJcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHtcInN0YXR1c1wiOiBcInN1Y2Nlc3NcIiwgXCJkYXRhXCI6IGRhdGF9O1xuICAgIH1cbiAgfVxufSk7XG4iLCJpbXBvcnQgeyBBcGksIERPSV9GRVRDSF9ST1VURSwgRE9JX0NPTkZJUk1BVElPTl9OT1RJRllfUk9VVEUgfSBmcm9tICcuLi9yZXN0LmpzJztcbmltcG9ydCBhZGRPcHRJbiBmcm9tICcuLi8uLi8uLi8uLi9pbXBvcnRzL21vZHVsZXMvc2VydmVyL29wdC1pbnMvYWRkX2FuZF93cml0ZV90b19ibG9ja2NoYWluLmpzJztcbmltcG9ydCB1cGRhdGVPcHRJblN0YXR1cyBmcm9tICcuLi8uLi8uLi8uLi9pbXBvcnRzL21vZHVsZXMvc2VydmVyL29wdC1pbnMvdXBkYXRlX3N0YXR1cy5qcyc7XG5pbXBvcnQgZ2V0RG9pTWFpbERhdGEgZnJvbSAnLi4vLi4vLi4vLi4vaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9kYXBwcy9nZXRfZG9pLW1haWwtZGF0YS5qcyc7XG5pbXBvcnQge2xvZ0Vycm9yLCBsb2dTZW5kfSBmcm9tIFwiLi4vLi4vLi4vLi4vaW1wb3J0cy9zdGFydHVwL3NlcnZlci9sb2ctY29uZmlndXJhdGlvblwiO1xuaW1wb3J0IHtET0lfRVhQT1JUX1JPVVRFfSBmcm9tIFwiLi4vcmVzdFwiO1xuaW1wb3J0IGV4cG9ydERvaXMgZnJvbSBcIi4uLy4uLy4uLy4uL2ltcG9ydHMvbW9kdWxlcy9zZXJ2ZXIvZGFwcHMvZXhwb3J0X2RvaXNcIjtcbmltcG9ydCB7T3B0SW5zfSBmcm9tIFwiLi4vLi4vLi4vLi4vaW1wb3J0cy9hcGkvb3B0LWlucy9vcHQtaW5zXCI7XG5pbXBvcnQge1JvbGVzfSBmcm9tIFwibWV0ZW9yL2FsYW5uaW5nOnJvbGVzXCI7XG5cbi8vZG9rdSBvZiBtZXRlb3ItcmVzdGl2dXMgaHR0cHM6Ly9naXRodWIuY29tL2thaG1hbGkvbWV0ZW9yLXJlc3RpdnVzXG5cbkFwaS5hZGRSb3V0ZShET0lfQ09ORklSTUFUSU9OX05PVElGWV9ST1VURSwge1xuICBwb3N0OiB7XG4gICAgYXV0aFJlcXVpcmVkOiB0cnVlLFxuICAgIC8vcm9sZVJlcXVpcmVkOiBbJ2FkbWluJ10sXG4gICAgYWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IHFQYXJhbXMgPSB0aGlzLnF1ZXJ5UGFyYW1zO1xuICAgICAgY29uc3QgYlBhcmFtcyA9IHRoaXMuYm9keVBhcmFtcztcbiAgICAgIGxldCBwYXJhbXMgPSB7fVxuICAgICAgaWYocVBhcmFtcyAhPT0gdW5kZWZpbmVkKSBwYXJhbXMgPSB7Li4ucVBhcmFtc31cbiAgICAgIGlmKGJQYXJhbXMgIT09IHVuZGVmaW5lZCkgcGFyYW1zID0gey4uLnBhcmFtcywgLi4uYlBhcmFtc31cblxuICAgICAgY29uc3QgdWlkID0gdGhpcy51c2VySWQ7XG5cbiAgICAgIGlmKCFSb2xlcy51c2VySXNJblJvbGUodWlkLCAnYWRtaW4nKSB8fCAvL2lmIGl0cyBub3QgYW4gYWRtaW4gYWx3YXlzIHVzZSB1aWQgYXMgb3duZXJJZFxuICAgICAgICAgIChSb2xlcy51c2VySXNJblJvbGUodWlkLCAnYWRtaW4nKSAmJiAocGFyYW1zW1wib3duZXJJZFwiXT09bnVsbCB8fCBwYXJhbXNbXCJvd25lcklkXCJdPT11bmRlZmluZWQpKSkgeyAgLy9pZiBpdHMgYW4gYWRtaW4gb25seSB1c2UgdWlkIGluIGNhc2Ugbm8gb3duZXJJZCB3YXMgZ2l2ZW5cbiAgICAgICAgICBwYXJhbXNbXCJvd25lcklkXCJdID0gdWlkO1xuICAgICAgfVxuXG4gICAgICBsb2dTZW5kKCdwYXJhbWV0ZXIgcmVjZWl2ZWQgZnJvbSBicm93c2VyOicscGFyYW1zKTtcbiAgICAgIGlmKHBhcmFtcy5zZW5kZXJfbWFpbC5jb25zdHJ1Y3RvciA9PT0gQXJyYXkpeyAvL3RoaXMgaXMgYSBTT0kgd2l0aCBjby1zcG9uc29ycyBmaXJzdCBlbWFpbCBpcyBtYWluIHNwb25zb3JcbiAgICAgICAgICByZXR1cm4gcHJlcGFyZUNvRE9JKHBhcmFtcyk7XG4gICAgICB9ZWxzZXtcbiAgICAgICAgIHJldHVybiBwcmVwYXJlQWRkKHBhcmFtcyk7XG4gICAgICB9XG4gICAgfVxuICB9LFxuICBwdXQ6IHtcbiAgICBhdXRoUmVxdWlyZWQ6IGZhbHNlLFxuICAgIGFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBxUGFyYW1zID0gdGhpcy5xdWVyeVBhcmFtcztcbiAgICAgIGNvbnN0IGJQYXJhbXMgPSB0aGlzLmJvZHlQYXJhbXM7XG5cbiAgICAgIGxvZ1NlbmQoJ3FQYXJhbXM6JyxxUGFyYW1zKTtcbiAgICAgIGxvZ1NlbmQoJ2JQYXJhbXM6JyxiUGFyYW1zKTtcblxuICAgICAgbGV0IHBhcmFtcyA9IHt9XG4gICAgICBpZihxUGFyYW1zICE9PSB1bmRlZmluZWQpIHBhcmFtcyA9IHsuLi5xUGFyYW1zfVxuICAgICAgaWYoYlBhcmFtcyAhPT0gdW5kZWZpbmVkKSBwYXJhbXMgPSB7Li4ucGFyYW1zLCAuLi5iUGFyYW1zfVxuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgdmFsID0gdXBkYXRlT3B0SW5TdGF0dXMocGFyYW1zKTtcbiAgICAgICAgbG9nU2VuZCgnb3B0LUluIHN0YXR1cyB1cGRhdGVkJyx2YWwpO1xuICAgICAgICByZXR1cm4ge3N0YXR1czogJ3N1Y2Nlc3MnLCBkYXRhOiB7bWVzc2FnZTogJ09wdC1JbiBzdGF0dXMgdXBkYXRlZCd9fTtcbiAgICAgIH0gY2F0Y2goZXJyb3IpIHtcbiAgICAgICAgcmV0dXJuIHtzdGF0dXNDb2RlOiA1MDAsIGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogZXJyb3IubWVzc2FnZX19O1xuICAgICAgfVxuICAgIH1cbiAgfVxufSk7XG5cbkFwaS5hZGRSb3V0ZShET0lfRkVUQ0hfUk9VVEUsIHthdXRoUmVxdWlyZWQ6IGZhbHNlfSwge1xuICBnZXQ6IHtcbiAgICBhY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgcGFyYW1zID0gdGhpcy5xdWVyeVBhcmFtcztcbiAgICAgIHRyeSB7XG4gICAgICAgICAgbG9nU2VuZCgncmVzdCBhcGkgLSBET0lfRkVUQ0hfUk9VVEUgY2FsbGVkIGJ5IGJvYiB0byByZXF1ZXN0IGVtYWlsIHRlbXBsYXRlJyxKU09OLnN0cmluZ2lmeShwYXJhbXMpKTtcbiAgICAgICAgICBjb25zdCBkYXRhID0gZ2V0RG9pTWFpbERhdGEocGFyYW1zKTtcbiAgICAgICAgICBsb2dTZW5kKCdnb3QgZG9pLW1haWwtZGF0YSAoaW5jbHVkaW5nIHRlbXBsYWx0ZSkgcmV0dXJuaW5nIHRvIGJvYicse3N1YmplY3Q6ZGF0YS5zdWJqZWN0LCByZWNpcGllbnQ6ZGF0YS5yZWNpcGllbnR9KTtcbiAgICAgICAgcmV0dXJuIHtzdGF0dXM6ICdzdWNjZXNzJywgZGF0YX07XG4gICAgICB9IGNhdGNoKGVycm9yKSB7XG4gICAgICAgIGxvZ0Vycm9yKCdlcnJvciB3aGlsZSBnZXR0aW5nIERvaU1haWxEYXRhJyxlcnJvcik7XG4gICAgICAgIHJldHVybiB7c3RhdHVzOiAnZmFpbCcsIGVycm9yOiBlcnJvci5tZXNzYWdlfTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn0pO1xuXG5BcGkuYWRkUm91dGUoRE9JX0VYUE9SVF9ST1VURSwge1xuICAgIGdldDoge1xuICAgICAgICBhdXRoUmVxdWlyZWQ6IHRydWUsXG4gICAgICAgIC8vcm9sZVJlcXVpcmVkOiBbJ2FkbWluJ10sXG4gICAgICAgIGFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBsZXQgcGFyYW1zID0gdGhpcy5xdWVyeVBhcmFtcztcbiAgICAgICAgICAgIGNvbnN0IHVpZCA9IHRoaXMudXNlcklkO1xuICAgICAgICAgICAgaWYoIVJvbGVzLnVzZXJJc0luUm9sZSh1aWQsICdhZG1pbicpKXtcbiAgICAgICAgICAgICAgICBwYXJhbXMgPSB7dXNlcmlkOnVpZCxyb2xlOid1c2VyJ307XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgIHBhcmFtcyA9IHsuLi5wYXJhbXMscm9sZTonYWRtaW4nfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBsb2dTZW5kKCdyZXN0IGFwaSAtIERPSV9FWFBPUlRfUk9VVEUgY2FsbGVkJyxKU09OLnN0cmluZ2lmeShwYXJhbXMpKTtcbiAgICAgICAgICAgICAgICBjb25zdCBkYXRhID0gZXhwb3J0RG9pcyhwYXJhbXMpO1xuICAgICAgICAgICAgICAgIGxvZ1NlbmQoJ2dvdCBkb2lzIGZyb20gZGF0YWJhc2UnLEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcbiAgICAgICAgICAgICAgICByZXR1cm4ge3N0YXR1czogJ3N1Y2Nlc3MnLCBkYXRhfTtcbiAgICAgICAgICAgIH0gY2F0Y2goZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBsb2dFcnJvcignZXJyb3Igd2hpbGUgZXhwb3J0aW5nIGNvbmZpcm1lZCBkb2lzJyxlcnJvcik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtzdGF0dXM6ICdmYWlsJywgZXJyb3I6IGVycm9yLm1lc3NhZ2V9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufSk7XG5cbmZ1bmN0aW9uIHByZXBhcmVDb0RPSShwYXJhbXMpe1xuXG4gICAgbG9nU2VuZCgnaXMgYXJyYXkgJyxwYXJhbXMuc2VuZGVyX21haWwpO1xuXG4gICAgY29uc3Qgc2VuZGVycyA9IHBhcmFtcy5zZW5kZXJfbWFpbDtcbiAgICBjb25zdCByZWNpcGllbnRfbWFpbCA9IHBhcmFtcy5yZWNpcGllbnRfbWFpbDtcbiAgICBjb25zdCBkYXRhID0gcGFyYW1zLmRhdGE7XG4gICAgY29uc3Qgb3duZXJJRCA9IHBhcmFtcy5vd25lcklkO1xuXG4gICAgbGV0IGN1cnJlbnRPcHRJbklkO1xuICAgIGxldCByZXRSZXNwb25zZSA9IFtdO1xuICAgIGxldCBtYXN0ZXJfZG9pO1xuICAgIHNlbmRlcnMuZm9yRWFjaCgoc2VuZGVyLGluZGV4KSA9PiB7XG5cbiAgICAgICAgY29uc3QgcmV0X3Jlc3BvbnNlID0gcHJlcGFyZUFkZCh7c2VuZGVyX21haWw6c2VuZGVyLHJlY2lwaWVudF9tYWlsOnJlY2lwaWVudF9tYWlsLGRhdGE6ZGF0YSwgbWFzdGVyX2RvaTptYXN0ZXJfZG9pLCBpbmRleDogaW5kZXgsIG93bmVySWQ6b3duZXJJRH0pO1xuICAgICAgICBsb2dTZW5kKCdDb0RPSTonLHJldF9yZXNwb25zZSk7XG4gICAgICAgIGlmKHJldF9yZXNwb25zZS5zdGF0dXMgPT09IHVuZGVmaW5lZCB8fCByZXRfcmVzcG9uc2Uuc3RhdHVzPT09XCJmYWlsZWRcIikgdGhyb3cgXCJjb3VsZCBub3QgYWRkIGNvLW9wdC1pblwiO1xuICAgICAgICByZXRSZXNwb25zZS5wdXNoKHJldF9yZXNwb25zZSk7XG4gICAgICAgIGN1cnJlbnRPcHRJbklkID0gcmV0X3Jlc3BvbnNlLmRhdGEuaWQ7XG5cbiAgICAgICAgaWYoaW5kZXg9PT0wKVxuICAgICAgICB7XG4gICAgICAgICAgICBsb2dTZW5kKCdtYWluIHNwb25zb3Igb3B0SW5JZDonLGN1cnJlbnRPcHRJbklkKTtcbiAgICAgICAgICAgIGNvbnN0IG9wdEluID0gT3B0SW5zLmZpbmRPbmUoe19pZDogY3VycmVudE9wdEluSWR9KTtcbiAgICAgICAgICAgIG1hc3Rlcl9kb2kgPSBvcHRJbi5uYW1lSWQ7XG4gICAgICAgICAgICBsb2dTZW5kKCdtYWluIHNwb25zb3IgbmFtZUlkOicsbWFzdGVyX2RvaSk7XG4gICAgICAgIH1cblxuICAgIH0pO1xuXG4gICAgbG9nU2VuZChyZXRSZXNwb25zZSk7XG5cbiAgICByZXR1cm4gcmV0UmVzcG9uc2U7XG59XG5cbmZ1bmN0aW9uIHByZXBhcmVBZGQocGFyYW1zKXtcblxuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHZhbCA9IGFkZE9wdEluKHBhcmFtcyk7XG4gICAgICAgIGxvZ1NlbmQoJ29wdC1JbiBhZGRlZCBJRDonLHZhbCk7XG4gICAgICAgIHJldHVybiB7c3RhdHVzOiAnc3VjY2VzcycsIGRhdGE6IHtpZDogdmFsLCBzdGF0dXM6ICdzdWNjZXNzJywgbWVzc2FnZTogJ09wdC1JbiBhZGRlZC4nfX07XG4gICAgfSBjYXRjaChlcnJvcikge1xuICAgICAgICByZXR1cm4ge3N0YXR1c0NvZGU6IDUwMCwgYm9keToge3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiBlcnJvci5tZXNzYWdlfX07XG4gICAgfVxufSIsImltcG9ydCB7IEFwaSB9IGZyb20gJy4uL3Jlc3QuanMnO1xuaW1wb3J0IHtnZXRJbmZvfSBmcm9tIFwiLi4vLi4vZG9pY2hhaW5cIjtcbmltcG9ydCB7IENPTkZJUk1fQ0xJRU5ULFNFTkRfQ0xJRU5UfSBmcm9tIFwiLi4vLi4vLi4vLi4vaW1wb3J0cy9zdGFydHVwL3NlcnZlci9kb2ljaGFpbi1jb25maWd1cmF0aW9uXCI7XG5cbkFwaS5hZGRSb3V0ZSgnc3RhdHVzJywge2F1dGhSZXF1aXJlZDogZmFsc2V9LCB7XG4gIGdldDoge1xuICAgIGFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBkYXRhID0gZ2V0SW5mbyhTRU5EX0NMSUVOVD9TRU5EX0NMSUVOVDpDT05GSVJNX0NMSUVOVCk7XG4gICAgICAgIHJldHVybiB7XCJzdGF0dXNcIjogXCJzdWNjZXNzXCIsIFwiZGF0YVwiOmRhdGF9O1xuICAgICAgfWNhdGNoKGV4KXtcbiAgICAgICAgICAgIHJldHVybiB7XCJzdGF0dXNcIjogXCJmYWlsZWRcIiwgXCJkYXRhXCI6IGV4LnRvU3RyaW5nKCl9O1xuICAgICAgfVxuICAgIH1cbiAgfVxufSk7XG4iLCJpbXBvcnQgeyBBcGkgfSBmcm9tICcuLi9yZXN0LmpzJztcbmltcG9ydCB7TWV0ZW9yfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCB7QWNjb3VudHN9IGZyb20gJ21ldGVvci9hY2NvdW50cy1iYXNlJ1xuaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tICdzaW1wbC1zY2hlbWEnO1xuaW1wb3J0IHtSb2xlc30gZnJvbSBcIm1ldGVvci9hbGFubmluZzpyb2xlc1wiO1xuaW1wb3J0IHtsb2dNYWlufSBmcm9tIFwiLi4vLi4vLi4vLi4vaW1wb3J0cy9zdGFydHVwL3NlcnZlci9sb2ctY29uZmlndXJhdGlvblwiO1xuXG5jb25zdCBtYWlsVGVtcGxhdGVTY2hlbWEgPSBuZXcgU2ltcGxlU2NoZW1hKHtcbiAgICBzdWJqZWN0OiB7XG4gICAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgICAgb3B0aW9uYWw6dHJ1ZSBcbiAgICB9LFxuICAgIHJlZGlyZWN0OiB7XG4gICAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgICAgcmVnRXg6IFwiQChodHRwcz98ZnRwKTovLygtXFxcXC4pPyhbXlxcXFxzLz9cXFxcLiMtXStcXFxcLj8pKygvW15cXFxcc10qKT8kQFwiLFxuICAgICAgICBvcHRpb25hbDp0cnVlIFxuICAgIH0sXG4gICAgcmV0dXJuUGF0aDoge1xuICAgICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICAgIHJlZ0V4OiBTaW1wbGVTY2hlbWEuUmVnRXguRW1haWwsXG4gICAgICAgIG9wdGlvbmFsOnRydWUgXG4gICAgfSxcbiAgICB0ZW1wbGF0ZVVSTDp7XG4gICAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgICAgcmVnRXg6IFwiQChodHRwcz98ZnRwKTovLygtXFxcXC4pPyhbXlxcXFxzLz9cXFxcLiMtXStcXFxcLj8pKygvW15cXFxcc10qKT8kQFwiLFxuICAgICAgICBvcHRpb25hbDp0cnVlIFxuICAgIH1cbn0pO1xuXG5jb25zdCBjcmVhdGVVc2VyU2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYSh7XG4gICAgdXNlcm5hbWU6IHtcbiAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgIHJlZ0V4OiBcIl5bQS1aLGEteiwwLTksISxfLCQsI117NCwyNH0kXCIgIC8vT25seSB1c2VybmFtZXMgYmV0d2VlbiA0LTI0IGNoYXJhY3RlcnMgZnJvbSBBLVosYS16LDAtOSwhLF8sJCwjIGFsbG93ZWRcbiAgICB9LFxuICAgIGVtYWlsOiB7XG4gICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICByZWdFeDogU2ltcGxlU2NoZW1hLlJlZ0V4LkVtYWlsXG4gICAgfSxcbiAgICBwYXNzd29yZDoge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgcmVnRXg6IFwiXltBLVosYS16LDAtOSwhLF8sJCwjXXs4LDI0fSRcIiAvL09ubHkgcGFzc3dvcmRzIGJldHdlZW4gOC0yNCBjaGFyYWN0ZXJzIGZyb20gQS1aLGEteiwwLTksISxfLCQsIyBhbGxvd2VkXG4gICAgfSxcbiAgICBtYWlsVGVtcGxhdGU6e1xuICAgICAgICB0eXBlOiBtYWlsVGVtcGxhdGVTY2hlbWEsXG4gICAgICAgIG9wdGlvbmFsOnRydWUgXG4gICAgfVxuICB9KTtcbiAgY29uc3QgdXBkYXRlVXNlclNjaGVtYSA9IG5ldyBTaW1wbGVTY2hlbWEoe1xuICAgIG1haWxUZW1wbGF0ZTp7XG4gICAgICAgIHR5cGU6IG1haWxUZW1wbGF0ZVNjaGVtYVxuICAgIH1cbn0pO1xuXG4vL1RPRE86IGNvbGxlY3Rpb24gb3B0aW9ucyBzZXBhcmF0ZVxuY29uc3QgY29sbGVjdGlvbk9wdGlvbnMgPVxuICB7XG4gICAgcGF0aDpcInVzZXJzXCIsXG4gICAgcm91dGVPcHRpb25zOlxuICAgIHtcbiAgICAgICAgYXV0aFJlcXVpcmVkIDogdHJ1ZVxuICAgICAgICAvLyxyb2xlUmVxdWlyZWQgOiBcImFkbWluXCJcbiAgICB9LFxuICAgIGV4Y2x1ZGVkRW5kcG9pbnRzOiBbJ3BhdGNoJywnZGVsZXRlQWxsJ10sXG4gICAgZW5kcG9pbnRzOlxuICAgIHtcbiAgICAgICAgZGVsZXRlOntyb2xlUmVxdWlyZWQgOiBcImFkbWluXCJ9LFxuICAgICAgICBwb3N0OlxuICAgICAgICB7XG4gICAgICAgICAgICByb2xlUmVxdWlyZWQgOiBcImFkbWluXCIsXG4gICAgICAgICAgICBhY3Rpb246IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgY29uc3QgcVBhcmFtcyA9IHRoaXMucXVlcnlQYXJhbXM7XG4gICAgICAgICAgICAgICAgY29uc3QgYlBhcmFtcyA9IHRoaXMuYm9keVBhcmFtcztcbiAgICAgICAgICAgICAgICBsZXQgcGFyYW1zID0ge307XG4gICAgICAgICAgICAgICAgaWYocVBhcmFtcyAhPT0gdW5kZWZpbmVkKSBwYXJhbXMgPSB7Li4ucVBhcmFtc31cbiAgICAgICAgICAgICAgICBpZihiUGFyYW1zICE9PSB1bmRlZmluZWQpIHBhcmFtcyA9IHsuLi5wYXJhbXMsIC4uLmJQYXJhbXN9XG4gICAgICAgICAgICAgICAgdHJ5e1xuICAgICAgICAgICAgICAgICAgICBsZXQgdXNlcklkO1xuICAgICAgICAgICAgICAgICAgICBjcmVhdGVVc2VyU2NoZW1hLnZhbGlkYXRlKHBhcmFtcyk7XG4gICAgICAgICAgICAgICAgICAgIGxvZ01haW4oJ3ZhbGlkYXRlZCcscGFyYW1zKTtcbiAgICAgICAgICAgICAgICAgICAgaWYocGFyYW1zLm1haWxUZW1wbGF0ZSAhPT0gdW5kZWZpbmVkKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVzZXJJZCA9IEFjY291bnRzLmNyZWF0ZVVzZXIoe3VzZXJuYW1lOnBhcmFtcy51c2VybmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbWFpbDpwYXJhbXMuZW1haWwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFzc3dvcmQ6cGFyYW1zLnBhc3N3b3JkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb2ZpbGU6e21haWxUZW1wbGF0ZTpwYXJhbXMubWFpbFRlbXBsYXRlfX0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgICAgICAgICB1c2VySWQgPSBBY2NvdW50cy5jcmVhdGVVc2VyKHt1c2VybmFtZTpwYXJhbXMudXNlcm5hbWUsZW1haWw6cGFyYW1zLmVtYWlsLHBhc3N3b3JkOnBhcmFtcy5wYXNzd29yZCwgcHJvZmlsZTp7fX0pO1xuICAgICAgICAgICAgICAgICAgICB9ICAgIFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge3N0YXR1czogJ3N1Y2Nlc3MnLCBkYXRhOiB7dXNlcmlkOiB1c2VySWR9fTtcbiAgICAgICAgICAgICAgICB9IGNhdGNoKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4ge3N0YXR1c0NvZGU6IDQwMCwgYm9keToge3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiBlcnJvci5tZXNzYWdlfX07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBwdXQ6XG4gICAgICAgIHtcbiAgICAgICAgICAgIGFjdGlvbjogZnVuY3Rpb24oKXsgICAgICBcbiAgICAgICAgICAgICAgICBjb25zdCBxUGFyYW1zID0gdGhpcy5xdWVyeVBhcmFtcztcbiAgICAgICAgICAgICAgICBjb25zdCBiUGFyYW1zID0gdGhpcy5ib2R5UGFyYW1zO1xuICAgICAgICAgICAgICAgIGxldCBwYXJhbXMgPSB7fTtcbiAgICAgICAgICAgICAgICBsZXQgdWlkPXRoaXMudXNlcklkO1xuICAgICAgICAgICAgICAgIGNvbnN0IHBhcmFtSWQ9dGhpcy51cmxQYXJhbXMuaWQ7XG4gICAgICAgICAgICAgICAgaWYocVBhcmFtcyAhPT0gdW5kZWZpbmVkKSBwYXJhbXMgPSB7Li4ucVBhcmFtc31cbiAgICAgICAgICAgICAgICBpZihiUGFyYW1zICE9PSB1bmRlZmluZWQpIHBhcmFtcyA9IHsuLi5wYXJhbXMsIC4uLmJQYXJhbXN9XG5cbiAgICAgICAgICAgICAgICB0cnl7IC8vVE9ETyB0aGlzIGlzIG5vdCBuZWNlc3NhcnkgaGVyZSBhbmQgY2FuIHByb2JhYmx5IGdvIHJpZ2h0IGludG8gdGhlIGRlZmluaXRpb24gb2YgdGhlIFJFU1QgTUVUSE9EIG5leHQgdG8gcHV0ICghPyEpXG4gICAgICAgICAgICAgICAgICAgIGlmKCFSb2xlcy51c2VySXNJblJvbGUodWlkLCAnYWRtaW4nKSl7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZih1aWQhPT1wYXJhbUlkKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBFcnJvcihcIk5vIFBlcm1pc3Npb25cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlVXNlclNjaGVtYS52YWxpZGF0ZShwYXJhbXMpO1xuICAgICAgICAgICAgICAgICAgICBpZighTWV0ZW9yLnVzZXJzLnVwZGF0ZSh0aGlzLnVybFBhcmFtcy5pZCx7JHNldDp7XCJwcm9maWxlLm1haWxUZW1wbGF0ZVwiOnBhcmFtcy5tYWlsVGVtcGxhdGV9fSkpe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IoXCJGYWlsZWQgdG8gdXBkYXRlIHVzZXJcIik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtzdGF0dXM6ICdzdWNjZXNzJywgZGF0YToge3VzZXJpZDogdGhpcy51cmxQYXJhbXMuaWQsIG1haWxUZW1wbGF0ZTpwYXJhbXMubWFpbFRlbXBsYXRlfX07XG4gICAgICAgICAgICAgICAgfSBjYXRjaChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIHtzdGF0dXNDb2RlOiA0MDAsIGJvZHk6IHtzdGF0dXM6ICdmYWlsJywgbWVzc2FnZTogZXJyb3IubWVzc2FnZX19O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cbkFwaS5hZGRDb2xsZWN0aW9uKE1ldGVvci51c2Vycyxjb2xsZWN0aW9uT3B0aW9ucyk7IiwiaW1wb3J0IHsgQXBpIH0gZnJvbSAnLi4vcmVzdC5qcyc7XG5pbXBvcnQgdmVyaWZ5T3B0SW4gZnJvbSAnLi4vLi4vLi4vLi4vaW1wb3J0cy9tb2R1bGVzL3NlcnZlci9vcHQtaW5zL3ZlcmlmeS5qcyc7XG5cbkFwaS5hZGRSb3V0ZSgnb3B0LWluL3ZlcmlmeScsIHthdXRoUmVxdWlyZWQ6IHRydWV9LCB7XG4gIGdldDoge1xuICAgIGF1dGhSZXF1aXJlZDogZmFsc2UsXG4gICAgYWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgY29uc3QgcVBhcmFtcyA9IHRoaXMucXVlcnlQYXJhbXM7XG4gICAgICAgIGNvbnN0IGJQYXJhbXMgPSB0aGlzLmJvZHlQYXJhbXM7XG4gICAgICAgIGxldCBwYXJhbXMgPSB7fVxuICAgICAgICBpZihxUGFyYW1zICE9PSB1bmRlZmluZWQpIHBhcmFtcyA9IHsuLi5xUGFyYW1zfVxuICAgICAgICBpZihiUGFyYW1zICE9PSB1bmRlZmluZWQpIHBhcmFtcyA9IHsuLi5wYXJhbXMsIC4uLmJQYXJhbXN9XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHZhbCA9IHZlcmlmeU9wdEluKHBhcmFtcyk7XG4gICAgICAgIHJldHVybiB7c3RhdHVzOiBcInN1Y2Nlc3NcIiwgZGF0YToge3ZhbH19O1xuICAgICAgfSBjYXRjaChlcnJvcikge1xuICAgICAgICByZXR1cm4ge3N0YXR1c0NvZGU6IDUwMCwgYm9keToge3N0YXR1czogJ2ZhaWwnLCBtZXNzYWdlOiBlcnJvci5tZXNzYWdlfX07XG4gICAgICB9XG4gICAgfVxuICB9XG59KTtcbiJdfQ==
