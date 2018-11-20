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

var cov_6o3rchwbj = function () {
  var path = "/home/doichain/dapp/imports/api/opt-ins/server/publications.js",
      hash = "7954cd5bf97b2d27bf553d4764509d2e4006478d",
      Function = function () {}.constructor,
      global = new Function('return this')(),
      gcv = "__coverage__",
      coverageData = {
    path: "/home/doichain/dapp/imports/api/opt-ins/server/publications.js",
    statementMap: {
      "0": {
        start: {
          line: 6,
          column: 0
        },
        end: {
          line: 20,
          column: 3
        }
      },
      "1": {
        start: {
          line: 7,
          column: 2
        },
        end: {
          line: 9,
          column: 3
        }
      },
      "2": {
        start: {
          line: 8,
          column: 4
        },
        end: {
          line: 8,
          column: 24
        }
      },
      "3": {
        start: {
          line: 10,
          column: 2
        },
        end: {
          line: 14,
          column: 3
        }
      },
      "4": {
        start: {
          line: 11,
          column: 4
        },
        end: {
          line: 13,
          column: 7
        }
      },
      "5": {
        start: {
          line: 17,
          column: 2
        },
        end: {
          line: 19,
          column: 5
        }
      }
    },
    fnMap: {
      "0": {
        name: "OptInsAll",
        decl: {
          start: {
            line: 6,
            column: 39
          },
          end: {
            line: 6,
            column: 48
          }
        },
        loc: {
          start: {
            line: 6,
            column: 51
          },
          end: {
            line: 20,
            column: 1
          }
        },
        line: 6
      }
    },
    branchMap: {
      "0": {
        loc: {
          start: {
            line: 7,
            column: 2
          },
          end: {
            line: 9,
            column: 3
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 7,
            column: 2
          },
          end: {
            line: 9,
            column: 3
          }
        }, {
          start: {
            line: 7,
            column: 2
          },
          end: {
            line: 9,
            column: 3
          }
        }],
        line: 7
      },
      "1": {
        loc: {
          start: {
            line: 10,
            column: 2
          },
          end: {
            line: 14,
            column: 3
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 10,
            column: 2
          },
          end: {
            line: 14,
            column: 3
          }
        }, {
          start: {
            line: 10,
            column: 2
          },
          end: {
            line: 14,
            column: 3
          }
        }],
        line: 10
      }
    },
    s: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0
    },
    f: {
      "0": 0
    },
    b: {
      "0": [0, 0],
      "1": [0, 0]
    },
    _coverageSchema: "43e27e138ebf9cfc5966b082cf9a028302ed4184"
  },
      coverage = global[gcv] || (global[gcv] = {});

  if (coverage[path] && coverage[path].hash === hash) {
    return coverage[path];
  }

  coverageData.hash = hash;
  return coverage[path] = coverageData;
}();

cov_6o3rchwbj.s[0]++;
Meteor.publish('opt-ins.all', function OptInsAll() {
  cov_6o3rchwbj.f[0]++;
  cov_6o3rchwbj.s[1]++;

  if (!this.userId) {
    cov_6o3rchwbj.b[0][0]++;
    cov_6o3rchwbj.s[2]++;
    return this.ready();
  } else {
    cov_6o3rchwbj.b[0][1]++;
  }

  cov_6o3rchwbj.s[3]++;

  if (!Roles.userIsInRole(this.userId, ['admin'])) {
    cov_6o3rchwbj.b[1][0]++;
    cov_6o3rchwbj.s[4]++;
    return OptIns.find({
      ownerId: this.userId
    }, {
      fields: OptIns.publicFields
    });
  } else {
    cov_6o3rchwbj.b[1][1]++;
  }

  cov_6o3rchwbj.s[5]++;
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

var cov_dx1hul4b7 = function () {
  var path = "/home/doichain/dapp/imports/api/opt-ins/methods.js",
      hash = "3dfab128726063394f8dcfefc84767ec79466cec",
      Function = function () {}.constructor,
      global = new Function('return this')(),
      gcv = "__coverage__",
      coverageData = {
    path: "/home/doichain/dapp/imports/api/opt-ins/methods.js",
    statementMap: {
      "0": {
        start: {
          line: 9,
          column: 12
        },
        end: {
          line: 26,
          column: 2
        }
      },
      "1": {
        start: {
          line: 13,
          column: 4
        },
        end: {
          line: 16,
          column: 5
        }
      },
      "2": {
        start: {
          line: 14,
          column: 20
        },
        end: {
          line: 14,
          column: 50
        }
      },
      "3": {
        start: {
          line: 15,
          column: 6
        },
        end: {
          line: 15,
          column: 52
        }
      },
      "4": {
        start: {
          line: 18,
          column: 18
        },
        end: {
          line: 22,
          column: 5
        }
      },
      "5": {
        start: {
          line: 24,
          column: 4
        },
        end: {
          line: 24,
          column: 19
        }
      },
      "6": {
        start: {
          line: 29,
          column: 24
        },
        end: {
          line: 31,
          column: 10
        }
      },
      "7": {
        start: {
          line: 33,
          column: 0
        },
        end: {
          line: 43,
          column: 1
        }
      },
      "8": {
        start: {
          line: 35,
          column: 2
        },
        end: {
          line: 42,
          column: 14
        }
      },
      "9": {
        start: {
          line: 37,
          column: 6
        },
        end: {
          line: 37,
          column: 47
        }
      },
      "10": {
        start: {
          line: 41,
          column: 21
        },
        end: {
          line: 41,
          column: 33
        }
      }
    },
    fnMap: {
      "0": {
        name: "(anonymous_0)",
        decl: {
          start: {
            line: 12,
            column: 2
          },
          end: {
            line: 12,
            column: 3
          }
        },
        loc: {
          start: {
            line: 12,
            column: 43
          },
          end: {
            line: 25,
            column: 3
          }
        },
        line: 12
      },
      "1": {
        name: "(anonymous_1)",
        decl: {
          start: {
            line: 36,
            column: 4
          },
          end: {
            line: 36,
            column: 5
          }
        },
        loc: {
          start: {
            line: 36,
            column: 15
          },
          end: {
            line: 38,
            column: 5
          }
        },
        line: 36
      },
      "2": {
        name: "(anonymous_2)",
        decl: {
          start: {
            line: 41,
            column: 4
          },
          end: {
            line: 41,
            column: 5
          }
        },
        loc: {
          start: {
            line: 41,
            column: 19
          },
          end: {
            line: 41,
            column: 35
          }
        },
        line: 41
      }
    },
    branchMap: {
      "0": {
        loc: {
          start: {
            line: 13,
            column: 4
          },
          end: {
            line: 16,
            column: 5
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 13,
            column: 4
          },
          end: {
            line: 16,
            column: 5
          }
        }, {
          start: {
            line: 13,
            column: 4
          },
          end: {
            line: 16,
            column: 5
          }
        }],
        line: 13
      },
      "1": {
        loc: {
          start: {
            line: 13,
            column: 7
          },
          end: {
            line: 13,
            column: 66
          }
        },
        type: "binary-expr",
        locations: [{
          start: {
            line: 13,
            column: 7
          },
          end: {
            line: 13,
            column: 19
          }
        }, {
          start: {
            line: 13,
            column: 23
          },
          end: {
            line: 13,
            column: 66
          }
        }],
        line: 13
      },
      "2": {
        loc: {
          start: {
            line: 33,
            column: 0
          },
          end: {
            line: 43,
            column: 1
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 33,
            column: 0
          },
          end: {
            line: 43,
            column: 1
          }
        }, {
          start: {
            line: 33,
            column: 0
          },
          end: {
            line: 43,
            column: 1
          }
        }],
        line: 33
      }
    },
    s: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0,
      "7": 0,
      "8": 0,
      "9": 0,
      "10": 0
    },
    f: {
      "0": 0,
      "1": 0,
      "2": 0
    },
    b: {
      "0": [0, 0],
      "1": [0, 0],
      "2": [0, 0]
    },
    _coverageSchema: "43e27e138ebf9cfc5966b082cf9a028302ed4184"
  },
      coverage = global[gcv] || (global[gcv] = {});

  if (coverage[path] && coverage[path].hash === hash) {
    return coverage[path];
  }

  coverageData.hash = hash;
  return coverage[path] = coverageData;
}();

const add = (cov_dx1hul4b7.s[0]++, new ValidatedMethod({
  name: 'opt-ins.add',
  validate: null,

  run({
    recipientMail,
    senderMail,
    data
  }) {
    cov_dx1hul4b7.f[0]++;
    cov_dx1hul4b7.s[1]++;

    if ((cov_dx1hul4b7.b[1][0]++, !this.userId) || (cov_dx1hul4b7.b[1][1]++, !Roles.userIsInRole(this.userId, ['admin']))) {
      cov_dx1hul4b7.b[0][0]++;
      const error = (cov_dx1hul4b7.s[2]++, "api.opt-ins.add.accessDenied");
      cov_dx1hul4b7.s[3]++;
      throw new Meteor.Error(error, i18n.__(error));
    } else {
      cov_dx1hul4b7.b[0][1]++;
    }

    const optIn = (cov_dx1hul4b7.s[4]++, {
      "recipient_mail": recipientMail,
      "sender_mail": senderMail,
      data
    });
    cov_dx1hul4b7.s[5]++;
    addOptIn(optIn);
  }

})); // Get list of all method names on opt-ins

const OPTIONS_METHODS = (cov_dx1hul4b7.s[6]++, _.pluck([add], 'name'));
cov_dx1hul4b7.s[7]++;

if (Meteor.isServer) {
  cov_dx1hul4b7.b[2][0]++;
  cov_dx1hul4b7.s[8]++; // Only allow 5 opt-in operations per connection per second

  DDPRateLimiter.addRule({
    name(name) {
      cov_dx1hul4b7.f[1]++;
      cov_dx1hul4b7.s[9]++;
      return _.contains(OPTIONS_METHODS, name);
    },

    // Rate limit per connection ID
    connectionId() {
      cov_dx1hul4b7.f[2]++;
      cov_dx1hul4b7.s[10]++;
      return true;
    }

  }, 5, 1000);
} else {
  cov_dx1hul4b7.b[2][1]++;
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

var cov_1vze50nzq3 = function () {
  var path = "/home/doichain/dapp/imports/api/opt-ins/opt-ins.js",
      hash = "dbf9d6268a40bd300cd8cce6a2eb6852e27e4485",
      Function = function () {}.constructor,
      global = new Function('return this')(),
      gcv = "__coverage__",
      coverageData = {
    path: "/home/doichain/dapp/imports/api/opt-ins/opt-ins.js",
    statementMap: {
      "0": {
        start: {
          line: 6,
          column: 21
        },
        end: {
          line: 6,
          column: 26
        }
      },
      "1": {
        start: {
          line: 7,
          column: 4
        },
        end: {
          line: 7,
          column: 67
        }
      },
      "2": {
        start: {
          line: 8,
          column: 4
        },
        end: {
          line: 8,
          column: 58
        }
      },
      "3": {
        start: {
          line: 9,
          column: 19
        },
        end: {
          line: 9,
          column: 51
        }
      },
      "4": {
        start: {
          line: 10,
          column: 4
        },
        end: {
          line: 10,
          column: 18
        }
      },
      "5": {
        start: {
          line: 13,
          column: 19
        },
        end: {
          line: 13,
          column: 51
        }
      },
      "6": {
        start: {
          line: 14,
          column: 4
        },
        end: {
          line: 14,
          column: 18
        }
      },
      "7": {
        start: {
          line: 17,
          column: 19
        },
        end: {
          line: 17,
          column: 41
        }
      },
      "8": {
        start: {
          line: 18,
          column: 4
        },
        end: {
          line: 18,
          column: 18
        }
      },
      "9": {
        start: {
          line: 22,
          column: 22
        },
        end: {
          line: 22,
          column: 53
        }
      },
      "10": {
        start: {
          line: 25,
          column: 0
        },
        end: {
          line: 29,
          column: 3
        }
      },
      "11": {
        start: {
          line: 26,
          column: 13
        },
        end: {
          line: 26,
          column: 25
        }
      },
      "12": {
        start: {
          line: 27,
          column: 13
        },
        end: {
          line: 27,
          column: 25
        }
      },
      "13": {
        start: {
          line: 28,
          column: 13
        },
        end: {
          line: 28,
          column: 25
        }
      },
      "14": {
        start: {
          line: 31,
          column: 0
        },
        end: {
          line: 101,
          column: 3
        }
      },
      "15": {
        start: {
          line: 103,
          column: 0
        },
        end: {
          line: 103,
          column: 35
        }
      },
      "16": {
        start: {
          line: 108,
          column: 0
        },
        end: {
          line: 122,
          column: 2
        }
      }
    },
    fnMap: {
      "0": {
        name: "(anonymous_0)",
        decl: {
          start: {
            line: 5,
            column: 2
          },
          end: {
            line: 5,
            column: 3
          }
        },
        loc: {
          start: {
            line: 5,
            column: 26
          },
          end: {
            line: 11,
            column: 3
          }
        },
        line: 5
      },
      "1": {
        name: "(anonymous_1)",
        decl: {
          start: {
            line: 12,
            column: 2
          },
          end: {
            line: 12,
            column: 3
          }
        },
        loc: {
          start: {
            line: 12,
            column: 29
          },
          end: {
            line: 15,
            column: 3
          }
        },
        line: 12
      },
      "2": {
        name: "(anonymous_2)",
        decl: {
          start: {
            line: 16,
            column: 2
          },
          end: {
            line: 16,
            column: 3
          }
        },
        loc: {
          start: {
            line: 16,
            column: 19
          },
          end: {
            line: 19,
            column: 3
          }
        },
        line: 16
      },
      "3": {
        name: "(anonymous_3)",
        decl: {
          start: {
            line: 26,
            column: 2
          },
          end: {
            line: 26,
            column: 3
          }
        },
        loc: {
          start: {
            line: 26,
            column: 11
          },
          end: {
            line: 26,
            column: 27
          }
        },
        line: 26
      },
      "4": {
        name: "(anonymous_4)",
        decl: {
          start: {
            line: 27,
            column: 2
          },
          end: {
            line: 27,
            column: 3
          }
        },
        loc: {
          start: {
            line: 27,
            column: 11
          },
          end: {
            line: 27,
            column: 27
          }
        },
        line: 27
      },
      "5": {
        name: "(anonymous_5)",
        decl: {
          start: {
            line: 28,
            column: 2
          },
          end: {
            line: 28,
            column: 3
          }
        },
        loc: {
          start: {
            line: 28,
            column: 11
          },
          end: {
            line: 28,
            column: 27
          }
        },
        line: 28
      }
    },
    branchMap: {
      "0": {
        loc: {
          start: {
            line: 8,
            column: 25
          },
          end: {
            line: 8,
            column: 57
          }
        },
        type: "binary-expr",
        locations: [{
          start: {
            line: 8,
            column: 25
          },
          end: {
            line: 8,
            column: 43
          }
        }, {
          start: {
            line: 8,
            column: 47
          },
          end: {
            line: 8,
            column: 57
          }
        }],
        line: 8
      }
    },
    s: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0,
      "7": 0,
      "8": 0,
      "9": 0,
      "10": 0,
      "11": 0,
      "12": 0,
      "13": 0,
      "14": 0,
      "15": 0,
      "16": 0
    },
    f: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0
    },
    b: {
      "0": [0, 0]
    },
    _coverageSchema: "43e27e138ebf9cfc5966b082cf9a028302ed4184"
  },
      coverage = global[gcv] || (global[gcv] = {});

  if (coverage[path] && coverage[path].hash === hash) {
    return coverage[path];
  }

  coverageData.hash = hash;
  return coverage[path] = coverageData;
}();

class OptInsCollection extends Mongo.Collection {
  insert(optIn, callback) {
    cov_1vze50nzq3.f[0]++;
    const ourOptIn = (cov_1vze50nzq3.s[0]++, optIn);
    cov_1vze50nzq3.s[1]++;
    ourOptIn.recipient_sender = ourOptIn.recipient + ourOptIn.sender;
    cov_1vze50nzq3.s[2]++;
    ourOptIn.createdAt = (cov_1vze50nzq3.b[0][0]++, ourOptIn.createdAt) || (cov_1vze50nzq3.b[0][1]++, new Date());
    const result = (cov_1vze50nzq3.s[3]++, super.insert(ourOptIn, callback));
    cov_1vze50nzq3.s[4]++;
    return result;
  }

  update(selector, modifier) {
    cov_1vze50nzq3.f[1]++;
    const result = (cov_1vze50nzq3.s[5]++, super.update(selector, modifier));
    cov_1vze50nzq3.s[6]++;
    return result;
  }

  remove(selector) {
    cov_1vze50nzq3.f[2]++;
    const result = (cov_1vze50nzq3.s[7]++, super.remove(selector));
    cov_1vze50nzq3.s[8]++;
    return result;
  }

}

const OptIns = (cov_1vze50nzq3.s[9]++, new OptInsCollection('opt-ins'));
// Deny all client-side updates since we will be using methods to manage this collection
cov_1vze50nzq3.s[10]++;
OptIns.deny({
  insert() {
    cov_1vze50nzq3.f[3]++;
    cov_1vze50nzq3.s[11]++;
    return true;
  },

  update() {
    cov_1vze50nzq3.f[4]++;
    cov_1vze50nzq3.s[12]++;
    return true;
  },

  remove() {
    cov_1vze50nzq3.f[5]++;
    cov_1vze50nzq3.s[13]++;
    return true;
  }

});
cov_1vze50nzq3.s[14]++;
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
cov_1vze50nzq3.s[15]++;
OptIns.attachSchema(OptIns.schema); // This represents the keys from Opt-In objects that should be published
// to the client. If we add secret properties to Opt-In objects, don't list
// them here to keep them private to the server.

cov_1vze50nzq3.s[16]++;
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

var cov_2hgdkr1zh1 = function () {
  var path = "/home/doichain/dapp/imports/api/recipients/server/publications.js",
      hash = "db22d7afa1458f7914202816a0619c6e8259a871",
      Function = function () {}.constructor,
      global = new Function('return this')(),
      gcv = "__coverage__",
      coverageData = {
    path: "/home/doichain/dapp/imports/api/recipients/server/publications.js",
    statementMap: {
      "0": {
        start: {
          line: 6,
          column: 0
        },
        end: {
          line: 14,
          column: 3
        }
      },
      "1": {
        start: {
          line: 7,
          column: 2
        },
        end: {
          line: 9,
          column: 3
        }
      },
      "2": {
        start: {
          line: 8,
          column: 4
        },
        end: {
          line: 8,
          column: 24
        }
      },
      "3": {
        start: {
          line: 11,
          column: 2
        },
        end: {
          line: 13,
          column: 5
        }
      }
    },
    fnMap: {
      "0": {
        name: "recipientsAll",
        decl: {
          start: {
            line: 6,
            column: 42
          },
          end: {
            line: 6,
            column: 55
          }
        },
        loc: {
          start: {
            line: 6,
            column: 58
          },
          end: {
            line: 14,
            column: 1
          }
        },
        line: 6
      }
    },
    branchMap: {
      "0": {
        loc: {
          start: {
            line: 7,
            column: 2
          },
          end: {
            line: 9,
            column: 3
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 7,
            column: 2
          },
          end: {
            line: 9,
            column: 3
          }
        }, {
          start: {
            line: 7,
            column: 2
          },
          end: {
            line: 9,
            column: 3
          }
        }],
        line: 7
      },
      "1": {
        loc: {
          start: {
            line: 7,
            column: 5
          },
          end: {
            line: 7,
            column: 64
          }
        },
        type: "binary-expr",
        locations: [{
          start: {
            line: 7,
            column: 5
          },
          end: {
            line: 7,
            column: 17
          }
        }, {
          start: {
            line: 7,
            column: 21
          },
          end: {
            line: 7,
            column: 64
          }
        }],
        line: 7
      }
    },
    s: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0
    },
    f: {
      "0": 0
    },
    b: {
      "0": [0, 0],
      "1": [0, 0]
    },
    _coverageSchema: "43e27e138ebf9cfc5966b082cf9a028302ed4184"
  },
      coverage = global[gcv] || (global[gcv] = {});

  if (coverage[path] && coverage[path].hash === hash) {
    return coverage[path];
  }

  coverageData.hash = hash;
  return coverage[path] = coverageData;
}();

cov_2hgdkr1zh1.s[0]++;
Meteor.publish('recipients.all', function recipientsAll() {
  cov_2hgdkr1zh1.f[0]++;
  cov_2hgdkr1zh1.s[1]++;

  if ((cov_2hgdkr1zh1.b[1][0]++, !this.userId) || (cov_2hgdkr1zh1.b[1][1]++, !Roles.userIsInRole(this.userId, ['admin']))) {
    cov_2hgdkr1zh1.b[0][0]++;
    cov_2hgdkr1zh1.s[2]++;
    return this.ready();
  } else {
    cov_2hgdkr1zh1.b[0][1]++;
  }

  cov_2hgdkr1zh1.s[3]++;
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

var cov_pihb3jh1 = function () {
  var path = "/home/doichain/dapp/imports/api/recipients/recipients.js",
      hash = "83b33fe077ffa65fdfc37b2e42899491e78675d9",
      Function = function () {}.constructor,
      global = new Function('return this')(),
      gcv = "__coverage__",
      coverageData = {
    path: "/home/doichain/dapp/imports/api/recipients/recipients.js",
    statementMap: {
      "0": {
        start: {
          line: 6,
          column: 25
        },
        end: {
          line: 6,
          column: 34
        }
      },
      "1": {
        start: {
          line: 7,
          column: 4
        },
        end: {
          line: 7,
          column: 66
        }
      },
      "2": {
        start: {
          line: 8,
          column: 19
        },
        end: {
          line: 8,
          column: 55
        }
      },
      "3": {
        start: {
          line: 9,
          column: 4
        },
        end: {
          line: 9,
          column: 18
        }
      },
      "4": {
        start: {
          line: 12,
          column: 19
        },
        end: {
          line: 12,
          column: 51
        }
      },
      "5": {
        start: {
          line: 13,
          column: 4
        },
        end: {
          line: 13,
          column: 18
        }
      },
      "6": {
        start: {
          line: 16,
          column: 19
        },
        end: {
          line: 16,
          column: 41
        }
      },
      "7": {
        start: {
          line: 17,
          column: 4
        },
        end: {
          line: 17,
          column: 18
        }
      },
      "8": {
        start: {
          line: 21,
          column: 26
        },
        end: {
          line: 21,
          column: 64
        }
      },
      "9": {
        start: {
          line: 24,
          column: 0
        },
        end: {
          line: 28,
          column: 3
        }
      },
      "10": {
        start: {
          line: 25,
          column: 13
        },
        end: {
          line: 25,
          column: 25
        }
      },
      "11": {
        start: {
          line: 26,
          column: 13
        },
        end: {
          line: 26,
          column: 25
        }
      },
      "12": {
        start: {
          line: 27,
          column: 13
        },
        end: {
          line: 27,
          column: 25
        }
      },
      "13": {
        start: {
          line: 30,
          column: 0
        },
        end: {
          line: 54,
          column: 3
        }
      },
      "14": {
        start: {
          line: 56,
          column: 0
        },
        end: {
          line: 56,
          column: 43
        }
      },
      "15": {
        start: {
          line: 61,
          column: 0
        },
        end: {
          line: 66,
          column: 2
        }
      }
    },
    fnMap: {
      "0": {
        name: "(anonymous_0)",
        decl: {
          start: {
            line: 5,
            column: 2
          },
          end: {
            line: 5,
            column: 3
          }
        },
        loc: {
          start: {
            line: 5,
            column: 30
          },
          end: {
            line: 10,
            column: 3
          }
        },
        line: 5
      },
      "1": {
        name: "(anonymous_1)",
        decl: {
          start: {
            line: 11,
            column: 2
          },
          end: {
            line: 11,
            column: 3
          }
        },
        loc: {
          start: {
            line: 11,
            column: 29
          },
          end: {
            line: 14,
            column: 3
          }
        },
        line: 11
      },
      "2": {
        name: "(anonymous_2)",
        decl: {
          start: {
            line: 15,
            column: 2
          },
          end: {
            line: 15,
            column: 3
          }
        },
        loc: {
          start: {
            line: 15,
            column: 19
          },
          end: {
            line: 18,
            column: 3
          }
        },
        line: 15
      },
      "3": {
        name: "(anonymous_3)",
        decl: {
          start: {
            line: 25,
            column: 2
          },
          end: {
            line: 25,
            column: 3
          }
        },
        loc: {
          start: {
            line: 25,
            column: 11
          },
          end: {
            line: 25,
            column: 27
          }
        },
        line: 25
      },
      "4": {
        name: "(anonymous_4)",
        decl: {
          start: {
            line: 26,
            column: 2
          },
          end: {
            line: 26,
            column: 3
          }
        },
        loc: {
          start: {
            line: 26,
            column: 11
          },
          end: {
            line: 26,
            column: 27
          }
        },
        line: 26
      },
      "5": {
        name: "(anonymous_5)",
        decl: {
          start: {
            line: 27,
            column: 2
          },
          end: {
            line: 27,
            column: 3
          }
        },
        loc: {
          start: {
            line: 27,
            column: 11
          },
          end: {
            line: 27,
            column: 27
          }
        },
        line: 27
      }
    },
    branchMap: {
      "0": {
        loc: {
          start: {
            line: 7,
            column: 29
          },
          end: {
            line: 7,
            column: 65
          }
        },
        type: "binary-expr",
        locations: [{
          start: {
            line: 7,
            column: 29
          },
          end: {
            line: 7,
            column: 51
          }
        }, {
          start: {
            line: 7,
            column: 55
          },
          end: {
            line: 7,
            column: 65
          }
        }],
        line: 7
      }
    },
    s: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0,
      "7": 0,
      "8": 0,
      "9": 0,
      "10": 0,
      "11": 0,
      "12": 0,
      "13": 0,
      "14": 0,
      "15": 0
    },
    f: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0
    },
    b: {
      "0": [0, 0]
    },
    _coverageSchema: "43e27e138ebf9cfc5966b082cf9a028302ed4184"
  },
      coverage = global[gcv] || (global[gcv] = {});

  if (coverage[path] && coverage[path].hash === hash) {
    return coverage[path];
  }

  coverageData.hash = hash;
  return coverage[path] = coverageData;
}();

class RecipientsCollection extends Mongo.Collection {
  insert(recipient, callback) {
    cov_pihb3jh1.f[0]++;
    const ourRecipient = (cov_pihb3jh1.s[0]++, recipient);
    cov_pihb3jh1.s[1]++;
    ourRecipient.createdAt = (cov_pihb3jh1.b[0][0]++, ourRecipient.createdAt) || (cov_pihb3jh1.b[0][1]++, new Date());
    const result = (cov_pihb3jh1.s[2]++, super.insert(ourRecipient, callback));
    cov_pihb3jh1.s[3]++;
    return result;
  }

  update(selector, modifier) {
    cov_pihb3jh1.f[1]++;
    const result = (cov_pihb3jh1.s[4]++, super.update(selector, modifier));
    cov_pihb3jh1.s[5]++;
    return result;
  }

  remove(selector) {
    cov_pihb3jh1.f[2]++;
    const result = (cov_pihb3jh1.s[6]++, super.remove(selector));
    cov_pihb3jh1.s[7]++;
    return result;
  }

}

const Recipients = (cov_pihb3jh1.s[8]++, new RecipientsCollection('recipients'));
// Deny all client-side updates since we will be using methods to manage this collection
cov_pihb3jh1.s[9]++;
Recipients.deny({
  insert() {
    cov_pihb3jh1.f[3]++;
    cov_pihb3jh1.s[10]++;
    return true;
  },

  update() {
    cov_pihb3jh1.f[4]++;
    cov_pihb3jh1.s[11]++;
    return true;
  },

  remove() {
    cov_pihb3jh1.f[5]++;
    cov_pihb3jh1.s[12]++;
    return true;
  }

});
cov_pihb3jh1.s[13]++;
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
cov_pihb3jh1.s[14]++;
Recipients.attachSchema(Recipients.schema); // This represents the keys from Recipient objects that should be published
// to the client. If we add secret properties to Recipient objects, don't list
// them here to keep them private to the server.

cov_pihb3jh1.s[15]++;
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

var cov_1q7vltzopf = function () {
  var path = "/home/doichain/dapp/imports/api/doichain/entries.js",
      hash = "e2e525ebbf95f9379833bb22858c0cac42226481",
      Function = function () {}.constructor,
      global = new Function('return this')(),
      gcv = "__coverage__",
      coverageData = {
    path: "/home/doichain/dapp/imports/api/doichain/entries.js",
    statementMap: {
      "0": {
        start: {
          line: 6,
          column: 19
        },
        end: {
          line: 6,
          column: 48
        }
      },
      "1": {
        start: {
          line: 7,
          column: 4
        },
        end: {
          line: 7,
          column: 18
        }
      },
      "2": {
        start: {
          line: 10,
          column: 19
        },
        end: {
          line: 10,
          column: 51
        }
      },
      "3": {
        start: {
          line: 11,
          column: 4
        },
        end: {
          line: 11,
          column: 18
        }
      },
      "4": {
        start: {
          line: 14,
          column: 19
        },
        end: {
          line: 14,
          column: 41
        }
      },
      "5": {
        start: {
          line: 15,
          column: 4
        },
        end: {
          line: 15,
          column: 18
        }
      },
      "6": {
        start: {
          line: 19,
          column: 31
        },
        end: {
          line: 19,
          column: 80
        }
      },
      "7": {
        start: {
          line: 22,
          column: 0
        },
        end: {
          line: 26,
          column: 3
        }
      },
      "8": {
        start: {
          line: 23,
          column: 13
        },
        end: {
          line: 23,
          column: 25
        }
      },
      "9": {
        start: {
          line: 24,
          column: 13
        },
        end: {
          line: 24,
          column: 25
        }
      },
      "10": {
        start: {
          line: 25,
          column: 13
        },
        end: {
          line: 25,
          column: 25
        }
      },
      "11": {
        start: {
          line: 28,
          column: 0
        },
        end: {
          line: 61,
          column: 3
        }
      },
      "12": {
        start: {
          line: 63,
          column: 0
        },
        end: {
          line: 63,
          column: 53
        }
      },
      "13": {
        start: {
          line: 68,
          column: 0
        },
        end: {
          line: 76,
          column: 2
        }
      }
    },
    fnMap: {
      "0": {
        name: "(anonymous_0)",
        decl: {
          start: {
            line: 5,
            column: 2
          },
          end: {
            line: 5,
            column: 3
          }
        },
        loc: {
          start: {
            line: 5,
            column: 26
          },
          end: {
            line: 8,
            column: 3
          }
        },
        line: 5
      },
      "1": {
        name: "(anonymous_1)",
        decl: {
          start: {
            line: 9,
            column: 2
          },
          end: {
            line: 9,
            column: 3
          }
        },
        loc: {
          start: {
            line: 9,
            column: 29
          },
          end: {
            line: 12,
            column: 3
          }
        },
        line: 9
      },
      "2": {
        name: "(anonymous_2)",
        decl: {
          start: {
            line: 13,
            column: 2
          },
          end: {
            line: 13,
            column: 3
          }
        },
        loc: {
          start: {
            line: 13,
            column: 19
          },
          end: {
            line: 16,
            column: 3
          }
        },
        line: 13
      },
      "3": {
        name: "(anonymous_3)",
        decl: {
          start: {
            line: 23,
            column: 2
          },
          end: {
            line: 23,
            column: 3
          }
        },
        loc: {
          start: {
            line: 23,
            column: 11
          },
          end: {
            line: 23,
            column: 27
          }
        },
        line: 23
      },
      "4": {
        name: "(anonymous_4)",
        decl: {
          start: {
            line: 24,
            column: 2
          },
          end: {
            line: 24,
            column: 3
          }
        },
        loc: {
          start: {
            line: 24,
            column: 11
          },
          end: {
            line: 24,
            column: 27
          }
        },
        line: 24
      },
      "5": {
        name: "(anonymous_5)",
        decl: {
          start: {
            line: 25,
            column: 2
          },
          end: {
            line: 25,
            column: 3
          }
        },
        loc: {
          start: {
            line: 25,
            column: 11
          },
          end: {
            line: 25,
            column: 27
          }
        },
        line: 25
      }
    },
    branchMap: {},
    s: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0,
      "7": 0,
      "8": 0,
      "9": 0,
      "10": 0,
      "11": 0,
      "12": 0,
      "13": 0
    },
    f: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0
    },
    b: {},
    _coverageSchema: "43e27e138ebf9cfc5966b082cf9a028302ed4184"
  },
      coverage = global[gcv] || (global[gcv] = {});

  if (coverage[path] && coverage[path].hash === hash) {
    return coverage[path];
  }

  coverageData.hash = hash;
  return coverage[path] = coverageData;
}();

class DoichainEntriesCollection extends Mongo.Collection {
  insert(entry, callback) {
    cov_1q7vltzopf.f[0]++;
    const result = (cov_1q7vltzopf.s[0]++, super.insert(entry, callback));
    cov_1q7vltzopf.s[1]++;
    return result;
  }

  update(selector, modifier) {
    cov_1q7vltzopf.f[1]++;
    const result = (cov_1q7vltzopf.s[2]++, super.update(selector, modifier));
    cov_1q7vltzopf.s[3]++;
    return result;
  }

  remove(selector) {
    cov_1q7vltzopf.f[2]++;
    const result = (cov_1q7vltzopf.s[4]++, super.remove(selector));
    cov_1q7vltzopf.s[5]++;
    return result;
  }

}

const DoichainEntries = (cov_1q7vltzopf.s[6]++, new DoichainEntriesCollection('doichain-entries'));
// Deny all client-side updates since we will be using methods to manage this collection
cov_1q7vltzopf.s[7]++;
DoichainEntries.deny({
  insert() {
    cov_1q7vltzopf.f[3]++;
    cov_1q7vltzopf.s[8]++;
    return true;
  },

  update() {
    cov_1q7vltzopf.f[4]++;
    cov_1q7vltzopf.s[9]++;
    return true;
  },

  remove() {
    cov_1q7vltzopf.f[5]++;
    cov_1q7vltzopf.s[10]++;
    return true;
  }

});
cov_1q7vltzopf.s[11]++;
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
cov_1q7vltzopf.s[12]++;
DoichainEntries.attachSchema(DoichainEntries.schema); // This represents the keys from Entry objects that should be published
// to the client. If we add secret properties to Entry objects, don't list
// them here to keep them private to the server.

cov_1q7vltzopf.s[13]++;
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

var cov_2d3e28bwmq = function () {
  var path = "/home/doichain/dapp/imports/api/doichain/methods.js",
      hash = "c0a42d54e421c4b13e197a18c0fdb6baf3de8810",
      Function = function () {}.constructor,
      global = new Function('return this')(),
      gcv = "__coverage__",
      coverageData = {
    path: "/home/doichain/dapp/imports/api/doichain/methods.js",
    statementMap: {
      "0": {
        start: {
          line: 8,
          column: 19
        },
        end: {
          line: 14,
          column: 2
        }
      },
      "1": {
        start: {
          line: 12,
          column: 4
        },
        end: {
          line: 12,
          column: 25
        }
      },
      "2": {
        start: {
          line: 16,
          column: 19
        },
        end: {
          line: 23,
          column: 2
        }
      },
      "3": {
        start: {
          line: 20,
          column: 19
        },
        end: {
          line: 20,
          column: 32
        }
      },
      "4": {
        start: {
          line: 21,
          column: 4
        },
        end: {
          line: 21,
          column: 18
        }
      },
      "5": {
        start: {
          line: 27,
          column: 23
        },
        end: {
          line: 29,
          column: 21
        }
      },
      "6": {
        start: {
          line: 31,
          column: 0
        },
        end: {
          line: 41,
          column: 1
        }
      },
      "7": {
        start: {
          line: 33,
          column: 2
        },
        end: {
          line: 40,
          column: 14
        }
      },
      "8": {
        start: {
          line: 35,
          column: 6
        },
        end: {
          line: 35,
          column: 46
        }
      },
      "9": {
        start: {
          line: 39,
          column: 21
        },
        end: {
          line: 39,
          column: 33
        }
      }
    },
    fnMap: {
      "0": {
        name: "(anonymous_0)",
        decl: {
          start: {
            line: 11,
            column: 2
          },
          end: {
            line: 11,
            column: 3
          }
        },
        loc: {
          start: {
            line: 11,
            column: 8
          },
          end: {
            line: 13,
            column: 3
          }
        },
        line: 11
      },
      "1": {
        name: "(anonymous_1)",
        decl: {
          start: {
            line: 19,
            column: 2
          },
          end: {
            line: 19,
            column: 3
          }
        },
        loc: {
          start: {
            line: 19,
            column: 8
          },
          end: {
            line: 22,
            column: 3
          }
        },
        line: 19
      },
      "2": {
        name: "(anonymous_2)",
        decl: {
          start: {
            line: 34,
            column: 4
          },
          end: {
            line: 34,
            column: 5
          }
        },
        loc: {
          start: {
            line: 34,
            column: 15
          },
          end: {
            line: 36,
            column: 5
          }
        },
        line: 34
      },
      "3": {
        name: "(anonymous_3)",
        decl: {
          start: {
            line: 39,
            column: 4
          },
          end: {
            line: 39,
            column: 5
          }
        },
        loc: {
          start: {
            line: 39,
            column: 19
          },
          end: {
            line: 39,
            column: 35
          }
        },
        line: 39
      }
    },
    branchMap: {
      "0": {
        loc: {
          start: {
            line: 31,
            column: 0
          },
          end: {
            line: 41,
            column: 1
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 31,
            column: 0
          },
          end: {
            line: 41,
            column: 1
          }
        }, {
          start: {
            line: 31,
            column: 0
          },
          end: {
            line: 41,
            column: 1
          }
        }],
        line: 31
      }
    },
    s: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0,
      "7": 0,
      "8": 0,
      "9": 0
    },
    f: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0
    },
    b: {
      "0": [0, 0]
    },
    _coverageSchema: "43e27e138ebf9cfc5966b082cf9a028302ed4184"
  },
      coverage = global[gcv] || (global[gcv] = {});

  if (coverage[path] && coverage[path].hash === hash) {
    return coverage[path];
  }

  coverageData.hash = hash;
  return coverage[path] = coverageData;
}();

const getKeyPair = (cov_2d3e28bwmq.s[0]++, new ValidatedMethod({
  name: 'doichain.getKeyPair',
  validate: null,

  run() {
    cov_2d3e28bwmq.f[0]++;
    cov_2d3e28bwmq.s[1]++;
    return getKeyPairM();
  }

}));
const getBalance = (cov_2d3e28bwmq.s[2]++, new ValidatedMethod({
  name: 'doichain.getBalance',
  validate: null,

  run() {
    cov_2d3e28bwmq.f[1]++;
    const logVal = (cov_2d3e28bwmq.s[3]++, getBalanceM());
    cov_2d3e28bwmq.s[4]++;
    return logVal;
  }

})); // Get list of all method names on doichain

const OPTINS_METHODS = (cov_2d3e28bwmq.s[5]++, _.pluck([getKeyPair, getBalance], 'name'));
cov_2d3e28bwmq.s[6]++;

if (Meteor.isServer) {
  cov_2d3e28bwmq.b[0][0]++;
  cov_2d3e28bwmq.s[7]++; // Only allow 5 opt-in operations per connection per second

  DDPRateLimiter.addRule({
    name(name) {
      cov_2d3e28bwmq.f[2]++;
      cov_2d3e28bwmq.s[8]++;
      return _.contains(OPTINS_METHODS, name);
    },

    // Rate limit per connection ID
    connectionId() {
      cov_2d3e28bwmq.f[3]++;
      cov_2d3e28bwmq.s[9]++;
      return true;
    }

  }, 5, 1000);
} else {
  cov_2d3e28bwmq.b[0][1]++;
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

var cov_2mj5bbay68 = function () {
  var path = "/home/doichain/dapp/imports/api/languages/methods.js",
      hash = "8c4b93a8a016d87b8cb5afbb4213b1dc13346059",
      Function = function () {}.constructor,
      global = new Function('return this')(),
      gcv = "__coverage__",
      coverageData = {
    path: "/home/doichain/dapp/imports/api/languages/methods.js",
    statementMap: {
      "0": {
        start: {
          line: 6,
          column: 24
        },
        end: {
          line: 12,
          column: 2
        }
      },
      "1": {
        start: {
          line: 10,
          column: 4
        },
        end: {
          line: 10,
          column: 26
        }
      },
      "2": {
        start: {
          line: 15,
          column: 23
        },
        end: {
          line: 17,
          column: 10
        }
      },
      "3": {
        start: {
          line: 19,
          column: 0
        },
        end: {
          line: 29,
          column: 1
        }
      },
      "4": {
        start: {
          line: 21,
          column: 2
        },
        end: {
          line: 28,
          column: 14
        }
      },
      "5": {
        start: {
          line: 23,
          column: 6
        },
        end: {
          line: 23,
          column: 46
        }
      },
      "6": {
        start: {
          line: 27,
          column: 21
        },
        end: {
          line: 27,
          column: 33
        }
      }
    },
    fnMap: {
      "0": {
        name: "(anonymous_0)",
        decl: {
          start: {
            line: 9,
            column: 2
          },
          end: {
            line: 9,
            column: 3
          }
        },
        loc: {
          start: {
            line: 9,
            column: 8
          },
          end: {
            line: 11,
            column: 3
          }
        },
        line: 9
      },
      "1": {
        name: "(anonymous_1)",
        decl: {
          start: {
            line: 22,
            column: 4
          },
          end: {
            line: 22,
            column: 5
          }
        },
        loc: {
          start: {
            line: 22,
            column: 15
          },
          end: {
            line: 24,
            column: 5
          }
        },
        line: 22
      },
      "2": {
        name: "(anonymous_2)",
        decl: {
          start: {
            line: 27,
            column: 4
          },
          end: {
            line: 27,
            column: 5
          }
        },
        loc: {
          start: {
            line: 27,
            column: 19
          },
          end: {
            line: 27,
            column: 35
          }
        },
        line: 27
      }
    },
    branchMap: {
      "0": {
        loc: {
          start: {
            line: 19,
            column: 0
          },
          end: {
            line: 29,
            column: 1
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 19,
            column: 0
          },
          end: {
            line: 29,
            column: 1
          }
        }, {
          start: {
            line: 19,
            column: 0
          },
          end: {
            line: 29,
            column: 1
          }
        }],
        line: 19
      }
    },
    s: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0
    },
    f: {
      "0": 0,
      "1": 0,
      "2": 0
    },
    b: {
      "0": [0, 0]
    },
    _coverageSchema: "43e27e138ebf9cfc5966b082cf9a028302ed4184"
  },
      coverage = global[gcv] || (global[gcv] = {});

  if (coverage[path] && coverage[path].hash === hash) {
    return coverage[path];
  }

  coverageData.hash = hash;
  return coverage[path] = coverageData;
}();

const getAllLanguages = (cov_2mj5bbay68.s[0]++, new ValidatedMethod({
  name: 'languages.getAll',
  validate: null,

  run() {
    cov_2mj5bbay68.f[0]++;
    cov_2mj5bbay68.s[1]++;
    return getLanguages();
  }

})); // Get list of all method names on languages

const OPTINS_METHODS = (cov_2mj5bbay68.s[2]++, _.pluck([getAllLanguages], 'name'));
cov_2mj5bbay68.s[3]++;

if (Meteor.isServer) {
  cov_2mj5bbay68.b[0][0]++;
  cov_2mj5bbay68.s[4]++; // Only allow 5 opt-in operations per connection per second

  DDPRateLimiter.addRule({
    name(name) {
      cov_2mj5bbay68.f[1]++;
      cov_2mj5bbay68.s[5]++;
      return _.contains(OPTINS_METHODS, name);
    },

    // Rate limit per connection ID
    connectionId() {
      cov_2mj5bbay68.f[2]++;
      cov_2mj5bbay68.s[6]++;
      return true;
    }

  }, 5, 1000);
} else {
  cov_2mj5bbay68.b[0][1]++;
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

var cov_gs3e2x15t = function () {
  var path = "/home/doichain/dapp/imports/api/meta/meta.js",
      hash = "de0cb53fa66fabcb79d37405b5888c5412220074",
      Function = function () {}.constructor,
      global = new Function('return this')(),
      gcv = "__coverage__",
      coverageData = {
    path: "/home/doichain/dapp/imports/api/meta/meta.js",
    statementMap: {
      "0": {
        start: {
          line: 6,
          column: 20
        },
        end: {
          line: 6,
          column: 24
        }
      },
      "1": {
        start: {
          line: 7,
          column: 19
        },
        end: {
          line: 7,
          column: 50
        }
      },
      "2": {
        start: {
          line: 8,
          column: 4
        },
        end: {
          line: 8,
          column: 18
        }
      },
      "3": {
        start: {
          line: 11,
          column: 19
        },
        end: {
          line: 11,
          column: 51
        }
      },
      "4": {
        start: {
          line: 12,
          column: 4
        },
        end: {
          line: 12,
          column: 18
        }
      },
      "5": {
        start: {
          line: 15,
          column: 19
        },
        end: {
          line: 15,
          column: 41
        }
      },
      "6": {
        start: {
          line: 16,
          column: 4
        },
        end: {
          line: 16,
          column: 18
        }
      },
      "7": {
        start: {
          line: 20,
          column: 20
        },
        end: {
          line: 20,
          column: 46
        }
      },
      "8": {
        start: {
          line: 23,
          column: 0
        },
        end: {
          line: 27,
          column: 3
        }
      },
      "9": {
        start: {
          line: 24,
          column: 13
        },
        end: {
          line: 24,
          column: 25
        }
      },
      "10": {
        start: {
          line: 25,
          column: 13
        },
        end: {
          line: 25,
          column: 25
        }
      },
      "11": {
        start: {
          line: 26,
          column: 13
        },
        end: {
          line: 26,
          column: 25
        }
      },
      "12": {
        start: {
          line: 29,
          column: 0
        },
        end: {
          line: 42,
          column: 3
        }
      },
      "13": {
        start: {
          line: 44,
          column: 0
        },
        end: {
          line: 44,
          column: 31
        }
      },
      "14": {
        start: {
          line: 49,
          column: 0
        },
        end: {
          line: 50,
          column: 2
        }
      }
    },
    fnMap: {
      "0": {
        name: "(anonymous_0)",
        decl: {
          start: {
            line: 5,
            column: 2
          },
          end: {
            line: 5,
            column: 3
          }
        },
        loc: {
          start: {
            line: 5,
            column: 25
          },
          end: {
            line: 9,
            column: 3
          }
        },
        line: 5
      },
      "1": {
        name: "(anonymous_1)",
        decl: {
          start: {
            line: 10,
            column: 2
          },
          end: {
            line: 10,
            column: 3
          }
        },
        loc: {
          start: {
            line: 10,
            column: 29
          },
          end: {
            line: 13,
            column: 3
          }
        },
        line: 10
      },
      "2": {
        name: "(anonymous_2)",
        decl: {
          start: {
            line: 14,
            column: 2
          },
          end: {
            line: 14,
            column: 3
          }
        },
        loc: {
          start: {
            line: 14,
            column: 19
          },
          end: {
            line: 17,
            column: 3
          }
        },
        line: 14
      },
      "3": {
        name: "(anonymous_3)",
        decl: {
          start: {
            line: 24,
            column: 2
          },
          end: {
            line: 24,
            column: 3
          }
        },
        loc: {
          start: {
            line: 24,
            column: 11
          },
          end: {
            line: 24,
            column: 27
          }
        },
        line: 24
      },
      "4": {
        name: "(anonymous_4)",
        decl: {
          start: {
            line: 25,
            column: 2
          },
          end: {
            line: 25,
            column: 3
          }
        },
        loc: {
          start: {
            line: 25,
            column: 11
          },
          end: {
            line: 25,
            column: 27
          }
        },
        line: 25
      },
      "5": {
        name: "(anonymous_5)",
        decl: {
          start: {
            line: 26,
            column: 2
          },
          end: {
            line: 26,
            column: 3
          }
        },
        loc: {
          start: {
            line: 26,
            column: 11
          },
          end: {
            line: 26,
            column: 27
          }
        },
        line: 26
      }
    },
    branchMap: {},
    s: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0,
      "7": 0,
      "8": 0,
      "9": 0,
      "10": 0,
      "11": 0,
      "12": 0,
      "13": 0,
      "14": 0
    },
    f: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0
    },
    b: {},
    _coverageSchema: "43e27e138ebf9cfc5966b082cf9a028302ed4184"
  },
      coverage = global[gcv] || (global[gcv] = {});

  if (coverage[path] && coverage[path].hash === hash) {
    return coverage[path];
  }

  coverageData.hash = hash;
  return coverage[path] = coverageData;
}();

class MetaCollection extends Mongo.Collection {
  insert(data, callback) {
    cov_gs3e2x15t.f[0]++;
    const ourData = (cov_gs3e2x15t.s[0]++, data);
    const result = (cov_gs3e2x15t.s[1]++, super.insert(ourData, callback));
    cov_gs3e2x15t.s[2]++;
    return result;
  }

  update(selector, modifier) {
    cov_gs3e2x15t.f[1]++;
    const result = (cov_gs3e2x15t.s[3]++, super.update(selector, modifier));
    cov_gs3e2x15t.s[4]++;
    return result;
  }

  remove(selector) {
    cov_gs3e2x15t.f[2]++;
    const result = (cov_gs3e2x15t.s[5]++, super.remove(selector));
    cov_gs3e2x15t.s[6]++;
    return result;
  }

}

const Meta = (cov_gs3e2x15t.s[7]++, new MetaCollection('meta'));
// Deny all client-side updates since we will be using methods to manage this collection
cov_gs3e2x15t.s[8]++;
Meta.deny({
  insert() {
    cov_gs3e2x15t.f[3]++;
    cov_gs3e2x15t.s[9]++;
    return true;
  },

  update() {
    cov_gs3e2x15t.f[4]++;
    cov_gs3e2x15t.s[10]++;
    return true;
  },

  remove() {
    cov_gs3e2x15t.f[5]++;
    cov_gs3e2x15t.s[11]++;
    return true;
  }

});
cov_gs3e2x15t.s[12]++;
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
cov_gs3e2x15t.s[13]++;
Meta.attachSchema(Meta.schema); // This represents the keys from Meta objects that should be published
// to the client. If we add secret properties to Meta objects, don't list
// them here to keep them private to the server.

cov_gs3e2x15t.s[14]++;
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

var cov_19p3di6d3l = function () {
  var path = "/home/doichain/dapp/imports/api/senders/senders.js",
      hash = "f2d40e16ffc0cde502be096fdcdd5669459140c2",
      Function = function () {}.constructor,
      global = new Function('return this')(),
      gcv = "__coverage__",
      coverageData = {
    path: "/home/doichain/dapp/imports/api/senders/senders.js",
    statementMap: {
      "0": {
        start: {
          line: 6,
          column: 22
        },
        end: {
          line: 6,
          column: 28
        }
      },
      "1": {
        start: {
          line: 7,
          column: 4
        },
        end: {
          line: 7,
          column: 60
        }
      },
      "2": {
        start: {
          line: 8,
          column: 19
        },
        end: {
          line: 8,
          column: 52
        }
      },
      "3": {
        start: {
          line: 9,
          column: 4
        },
        end: {
          line: 9,
          column: 18
        }
      },
      "4": {
        start: {
          line: 12,
          column: 19
        },
        end: {
          line: 12,
          column: 51
        }
      },
      "5": {
        start: {
          line: 13,
          column: 4
        },
        end: {
          line: 13,
          column: 18
        }
      },
      "6": {
        start: {
          line: 16,
          column: 19
        },
        end: {
          line: 16,
          column: 41
        }
      },
      "7": {
        start: {
          line: 17,
          column: 4
        },
        end: {
          line: 17,
          column: 18
        }
      },
      "8": {
        start: {
          line: 21,
          column: 23
        },
        end: {
          line: 21,
          column: 55
        }
      },
      "9": {
        start: {
          line: 24,
          column: 0
        },
        end: {
          line: 28,
          column: 3
        }
      },
      "10": {
        start: {
          line: 25,
          column: 13
        },
        end: {
          line: 25,
          column: 25
        }
      },
      "11": {
        start: {
          line: 26,
          column: 13
        },
        end: {
          line: 26,
          column: 25
        }
      },
      "12": {
        start: {
          line: 27,
          column: 13
        },
        end: {
          line: 27,
          column: 25
        }
      },
      "13": {
        start: {
          line: 30,
          column: 0
        },
        end: {
          line: 44,
          column: 3
        }
      },
      "14": {
        start: {
          line: 46,
          column: 0
        },
        end: {
          line: 46,
          column: 37
        }
      },
      "15": {
        start: {
          line: 51,
          column: 0
        },
        end: {
          line: 54,
          column: 2
        }
      }
    },
    fnMap: {
      "0": {
        name: "(anonymous_0)",
        decl: {
          start: {
            line: 5,
            column: 2
          },
          end: {
            line: 5,
            column: 3
          }
        },
        loc: {
          start: {
            line: 5,
            column: 27
          },
          end: {
            line: 10,
            column: 3
          }
        },
        line: 5
      },
      "1": {
        name: "(anonymous_1)",
        decl: {
          start: {
            line: 11,
            column: 2
          },
          end: {
            line: 11,
            column: 3
          }
        },
        loc: {
          start: {
            line: 11,
            column: 29
          },
          end: {
            line: 14,
            column: 3
          }
        },
        line: 11
      },
      "2": {
        name: "(anonymous_2)",
        decl: {
          start: {
            line: 15,
            column: 2
          },
          end: {
            line: 15,
            column: 3
          }
        },
        loc: {
          start: {
            line: 15,
            column: 19
          },
          end: {
            line: 18,
            column: 3
          }
        },
        line: 15
      },
      "3": {
        name: "(anonymous_3)",
        decl: {
          start: {
            line: 25,
            column: 2
          },
          end: {
            line: 25,
            column: 3
          }
        },
        loc: {
          start: {
            line: 25,
            column: 11
          },
          end: {
            line: 25,
            column: 27
          }
        },
        line: 25
      },
      "4": {
        name: "(anonymous_4)",
        decl: {
          start: {
            line: 26,
            column: 2
          },
          end: {
            line: 26,
            column: 3
          }
        },
        loc: {
          start: {
            line: 26,
            column: 11
          },
          end: {
            line: 26,
            column: 27
          }
        },
        line: 26
      },
      "5": {
        name: "(anonymous_5)",
        decl: {
          start: {
            line: 27,
            column: 2
          },
          end: {
            line: 27,
            column: 3
          }
        },
        loc: {
          start: {
            line: 27,
            column: 11
          },
          end: {
            line: 27,
            column: 27
          }
        },
        line: 27
      }
    },
    branchMap: {
      "0": {
        loc: {
          start: {
            line: 7,
            column: 26
          },
          end: {
            line: 7,
            column: 59
          }
        },
        type: "binary-expr",
        locations: [{
          start: {
            line: 7,
            column: 26
          },
          end: {
            line: 7,
            column: 45
          }
        }, {
          start: {
            line: 7,
            column: 49
          },
          end: {
            line: 7,
            column: 59
          }
        }],
        line: 7
      }
    },
    s: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0,
      "7": 0,
      "8": 0,
      "9": 0,
      "10": 0,
      "11": 0,
      "12": 0,
      "13": 0,
      "14": 0,
      "15": 0
    },
    f: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0
    },
    b: {
      "0": [0, 0]
    },
    _coverageSchema: "43e27e138ebf9cfc5966b082cf9a028302ed4184"
  },
      coverage = global[gcv] || (global[gcv] = {});

  if (coverage[path] && coverage[path].hash === hash) {
    return coverage[path];
  }

  coverageData.hash = hash;
  return coverage[path] = coverageData;
}();

class SendersCollection extends Mongo.Collection {
  insert(sender, callback) {
    cov_19p3di6d3l.f[0]++;
    const ourSender = (cov_19p3di6d3l.s[0]++, sender);
    cov_19p3di6d3l.s[1]++;
    ourSender.createdAt = (cov_19p3di6d3l.b[0][0]++, ourSender.createdAt) || (cov_19p3di6d3l.b[0][1]++, new Date());
    const result = (cov_19p3di6d3l.s[2]++, super.insert(ourSender, callback));
    cov_19p3di6d3l.s[3]++;
    return result;
  }

  update(selector, modifier) {
    cov_19p3di6d3l.f[1]++;
    const result = (cov_19p3di6d3l.s[4]++, super.update(selector, modifier));
    cov_19p3di6d3l.s[5]++;
    return result;
  }

  remove(selector) {
    cov_19p3di6d3l.f[2]++;
    const result = (cov_19p3di6d3l.s[6]++, super.remove(selector));
    cov_19p3di6d3l.s[7]++;
    return result;
  }

}

const Senders = (cov_19p3di6d3l.s[8]++, new SendersCollection('senders'));
// Deny all client-side updates since we will be using methods to manage this collection
cov_19p3di6d3l.s[9]++;
Senders.deny({
  insert() {
    cov_19p3di6d3l.f[3]++;
    cov_19p3di6d3l.s[10]++;
    return true;
  },

  update() {
    cov_19p3di6d3l.f[4]++;
    cov_19p3di6d3l.s[11]++;
    return true;
  },

  remove() {
    cov_19p3di6d3l.f[5]++;
    cov_19p3di6d3l.s[12]++;
    return true;
  }

});
cov_19p3di6d3l.s[13]++;
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
cov_19p3di6d3l.s[14]++;
Senders.attachSchema(Senders.schema); // This represents the keys from Sender objects that should be published
// to the client. If we add secret properties to Sender objects, don't list
// them here to keep them private to the server.

cov_19p3di6d3l.s[15]++;
Senders.publicFields = {
  email: 1,
  createdAt: 1
};
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

var cov_1rwk079xbn = function () {
  var path = "/home/doichain/dapp/imports/modules/server/dapps/export_dois.js",
      hash = "8df00cbe7f8454145e541dd9da1629b8eb00c184",
      Function = function () {}.constructor,
      global = new Function('return this')(),
      gcv = "__coverage__",
      coverageData = {
    path: "/home/doichain/dapp/imports/modules/server/dapps/export_dois.js",
    statementMap: {
      "0": {
        start: {
          line: 7,
          column: 29
        },
        end: {
          line: 20,
          column: 2
        }
      },
      "1": {
        start: {
          line: 24,
          column: 19
        },
        end: {
          line: 60,
          column: 1
        }
      },
      "2": {
        start: {
          line: 25,
          column: 2
        },
        end: {
          line: 59,
          column: 3
        }
      },
      "3": {
        start: {
          line: 26,
          column: 20
        },
        end: {
          line: 26,
          column: 24
        }
      },
      "4": {
        start: {
          line: 27,
          column: 4
        },
        end: {
          line: 27,
          column: 43
        }
      },
      "5": {
        start: {
          line: 28,
          column: 17
        },
        end: {
          line: 28,
          column: 75
        }
      },
      "6": {
        start: {
          line: 30,
          column: 4
        },
        end: {
          line: 36,
          column: 5
        }
      },
      "7": {
        start: {
          line: 31,
          column: 6
        },
        end: {
          line: 35,
          column: 30
        }
      },
      "8": {
        start: {
          line: 37,
          column: 4
        },
        end: {
          line: 43,
          column: 7
        }
      },
      "9": {
        start: {
          line: 46,
          column: 18
        },
        end: {
          line: 46,
          column: 44
        }
      },
      "10": {
        start: {
          line: 48,
          column: 4
        },
        end: {
          line: 55,
          column: 5
        }
      },
      "11": {
        start: {
          line: 49,
          column: 8
        },
        end: {
          line: 49,
          column: 31
        }
      },
      "12": {
        start: {
          line: 50,
          column: 8
        },
        end: {
          line: 50,
          column: 83
        }
      },
      "13": {
        start: {
          line: 51,
          column: 6
        },
        end: {
          line: 51,
          column: 26
        }
      },
      "14": {
        start: {
          line: 54,
          column: 6
        },
        end: {
          line: 54,
          column: 49
        }
      },
      "15": {
        start: {
          line: 58,
          column: 4
        },
        end: {
          line: 58,
          column: 67
        }
      }
    },
    fnMap: {
      "0": {
        name: "(anonymous_0)",
        decl: {
          start: {
            line: 24,
            column: 19
          },
          end: {
            line: 24,
            column: 20
          }
        },
        loc: {
          start: {
            line: 24,
            column: 29
          },
          end: {
            line: 60,
            column: 1
          }
        },
        line: 24
      }
    },
    branchMap: {
      "0": {
        loc: {
          start: {
            line: 30,
            column: 4
          },
          end: {
            line: 36,
            column: 5
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 30,
            column: 4
          },
          end: {
            line: 36,
            column: 5
          }
        }, {
          start: {
            line: 30,
            column: 4
          },
          end: {
            line: 36,
            column: 5
          }
        }],
        line: 30
      },
      "1": {
        loc: {
          start: {
            line: 30,
            column: 7
          },
          end: {
            line: 30,
            column: 55
          }
        },
        type: "binary-expr",
        locations: [{
          start: {
            line: 30,
            column: 7
          },
          end: {
            line: 30,
            column: 28
          }
        }, {
          start: {
            line: 30,
            column: 30
          },
          end: {
            line: 30,
            column: 55
          }
        }],
        line: 30
      }
    },
    s: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0,
      "7": 0,
      "8": 0,
      "9": 0,
      "10": 0,
      "11": 0,
      "12": 0,
      "13": 0,
      "14": 0,
      "15": 0
    },
    f: {
      "0": 0
    },
    b: {
      "0": [0, 0],
      "1": [0, 0]
    },
    _coverageSchema: "43e27e138ebf9cfc5966b082cf9a028302ed4184"
  },
      coverage = global[gcv] || (global[gcv] = {});

  if (coverage[path] && coverage[path].hash === hash) {
    return coverage[path];
  }

  coverageData.hash = hash;
  return coverage[path] = coverageData;
}();

const ExportDoisDataSchema = (cov_1rwk079xbn.s[0]++, new SimpleSchema({
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
})); //TODO add sender and recipient email address to export

cov_1rwk079xbn.s[1]++;

const exportDois = data => {
  cov_1rwk079xbn.f[0]++;
  cov_1rwk079xbn.s[2]++;

  try {
    const ourData = (cov_1rwk079xbn.s[3]++, data);
    cov_1rwk079xbn.s[4]++;
    ExportDoisDataSchema.validate(ourData);
    let pipeline = (cov_1rwk079xbn.s[5]++, [{
      $match: {
        "confirmedAt": {
          $exists: true,
          $ne: null
        }
      }
    }]);
    cov_1rwk079xbn.s[6]++;

    if ((cov_1rwk079xbn.b[1][0]++, ourData.role != 'admin') || (cov_1rwk079xbn.b[1][1]++, ourData.userid != undefined)) {
      cov_1rwk079xbn.b[0][0]++;
      cov_1rwk079xbn.s[7]++;
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
    } else {
      cov_1rwk079xbn.b[0][1]++;
    }

    cov_1rwk079xbn.s[8]++;
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

    let optIns = (cov_1rwk079xbn.s[9]++, OptIns.aggregate(pipeline));
    let exportDoiData;
    cov_1rwk079xbn.s[10]++;

    try {
      cov_1rwk079xbn.s[11]++;
      exportDoiData = optIns;
      cov_1rwk079xbn.s[12]++;
      logSend('exportDoi url:', DOI_MAIL_FETCH_URL, JSON.stringify(exportDoiData));
      cov_1rwk079xbn.s[13]++;
      return exportDoiData;
    } catch (error) {
      cov_1rwk079xbn.s[14]++;
      throw "Error while exporting dois: " + error;
    }
  } catch (exception) {
    cov_1rwk079xbn.s[15]++;
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

var cov_15x314ahuk = function () {
  var path = "/home/doichain/dapp/imports/modules/server/dapps/fetch_doi-mail-data.js",
      hash = "370d4bf81e1fbf0d434f2cf69a24099034b4373f",
      Function = function () {}.constructor,
      global = new Function('return this')(),
      gcv = "__coverage__",
      coverageData = {
    path: "/home/doichain/dapp/imports/modules/server/dapps/fetch_doi-mail-data.js",
    statementMap: {
      "0": {
        start: {
          line: 16,
          column: 31
        },
        end: {
          line: 23,
          column: 2
        }
      },
      "1": {
        start: {
          line: 26,
          column: 25
        },
        end: {
          line: 83,
          column: 1
        }
      },
      "2": {
        start: {
          line: 27,
          column: 2
        },
        end: {
          line: 82,
          column: 3
        }
      },
      "3": {
        start: {
          line: 28,
          column: 20
        },
        end: {
          line: 28,
          column: 24
        }
      },
      "4": {
        start: {
          line: 29,
          column: 4
        },
        end: {
          line: 29,
          column: 45
        }
      },
      "5": {
        start: {
          line: 30,
          column: 16
        },
        end: {
          line: 30,
          column: 67
        }
      },
      "6": {
        start: {
          line: 31,
          column: 22
        },
        end: {
          line: 31,
          column: 80
        }
      },
      "7": {
        start: {
          line: 32,
          column: 18
        },
        end: {
          line: 32,
          column: 105
        }
      },
      "8": {
        start: {
          line: 33,
          column: 4
        },
        end: {
          line: 33,
          column: 71
        }
      },
      "9": {
        start: {
          line: 39,
          column: 21
        },
        end: {
          line: 39,
          column: 43
        }
      },
      "10": {
        start: {
          line: 40,
          column: 4
        },
        end: {
          line: 40,
          column: 83
        }
      },
      "11": {
        start: {
          line: 40,
          column: 62
        },
        end: {
          line: 40,
          column: 83
        }
      },
      "12": {
        start: {
          line: 41,
          column: 25
        },
        end: {
          line: 41,
          column: 38
        }
      },
      "13": {
        start: {
          line: 42,
          column: 4
        },
        end: {
          line: 42,
          column: 95
        }
      },
      "14": {
        start: {
          line: 44,
          column: 4
        },
        end: {
          line: 52,
          column: 5
        }
      },
      "15": {
        start: {
          line: 45,
          column: 6
        },
        end: {
          line: 45,
          column: 64
        }
      },
      "16": {
        start: {
          line: 45,
          column: 43
        },
        end: {
          line: 45,
          column: 64
        }
      },
      "17": {
        start: {
          line: 46,
          column: 6
        },
        end: {
          line: 50,
          column: 7
        }
      },
      "18": {
        start: {
          line: 48,
          column: 10
        },
        end: {
          line: 48,
          column: 71
        }
      },
      "19": {
        start: {
          line: 49,
          column: 8
        },
        end: {
          line: 49,
          column: 15
        }
      },
      "20": {
        start: {
          line: 51,
          column: 6
        },
        end: {
          line: 51,
          column: 31
        }
      },
      "21": {
        start: {
          line: 53,
          column: 4
        },
        end: {
          line: 53,
          column: 41
        }
      },
      "22": {
        start: {
          line: 55,
          column: 20
        },
        end: {
          line: 55,
          column: 50
        }
      },
      "23": {
        start: {
          line: 56,
          column: 18
        },
        end: {
          line: 56,
          column: 48
        }
      },
      "24": {
        start: {
          line: 57,
          column: 4
        },
        end: {
          line: 57,
          column: 38
        }
      },
      "25": {
        start: {
          line: 58,
          column: 4
        },
        end: {
          line: 58,
          column: 53
        }
      },
      "26": {
        start: {
          line: 58,
          column: 46
        },
        end: {
          line: 58,
          column: 53
        }
      },
      "27": {
        start: {
          line: 60,
          column: 18
        },
        end: {
          line: 60,
          column: 51
        }
      },
      "28": {
        start: {
          line: 61,
          column: 4
        },
        end: {
          line: 61,
          column: 53
        }
      },
      "29": {
        start: {
          line: 62,
          column: 29
        },
        end: {
          line: 62,
          column: 113
        }
      },
      "30": {
        start: {
          line: 63,
          column: 4
        },
        end: {
          line: 63,
          column: 63
        }
      },
      "31": {
        start: {
          line: 64,
          column: 28
        },
        end: {
          line: 64,
          column: 121
        }
      },
      "32": {
        start: {
          line: 65,
          column: 4
        },
        end: {
          line: 65,
          column: 51
        }
      },
      "33": {
        start: {
          line: 67,
          column: 21
        },
        end: {
          line: 69,
          column: 7
        }
      },
      "34": {
        start: {
          line: 73,
          column: 4
        },
        end: {
          line: 73,
          column: 73
        }
      },
      "35": {
        start: {
          line: 74,
          column: 4
        },
        end: {
          line: 79,
          column: 7
        }
      },
      "36": {
        start: {
          line: 81,
          column: 4
        },
        end: {
          line: 81,
          column: 74
        }
      }
    },
    fnMap: {
      "0": {
        name: "(anonymous_0)",
        decl: {
          start: {
            line: 26,
            column: 25
          },
          end: {
            line: 26,
            column: 26
          }
        },
        loc: {
          start: {
            line: 26,
            column: 35
          },
          end: {
            line: 83,
            column: 1
          }
        },
        line: 26
      }
    },
    branchMap: {
      "0": {
        loc: {
          start: {
            line: 40,
            column: 4
          },
          end: {
            line: 40,
            column: 83
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 40,
            column: 4
          },
          end: {
            line: 40,
            column: 83
          }
        }, {
          start: {
            line: 40,
            column: 4
          },
          end: {
            line: 40,
            column: 83
          }
        }],
        line: 40
      },
      "1": {
        loc: {
          start: {
            line: 40,
            column: 7
          },
          end: {
            line: 40,
            column: 60
          }
        },
        type: "binary-expr",
        locations: [{
          start: {
            line: 40,
            column: 7
          },
          end: {
            line: 40,
            column: 29
          }
        }, {
          start: {
            line: 40,
            column: 33
          },
          end: {
            line: 40,
            column: 60
          }
        }],
        line: 40
      },
      "2": {
        loc: {
          start: {
            line: 44,
            column: 4
          },
          end: {
            line: 52,
            column: 5
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 44,
            column: 4
          },
          end: {
            line: 52,
            column: 5
          }
        }, {
          start: {
            line: 44,
            column: 4
          },
          end: {
            line: 52,
            column: 5
          }
        }],
        line: 44
      },
      "3": {
        loc: {
          start: {
            line: 45,
            column: 6
          },
          end: {
            line: 45,
            column: 64
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 45,
            column: 6
          },
          end: {
            line: 45,
            column: 64
          }
        }, {
          start: {
            line: 45,
            column: 6
          },
          end: {
            line: 45,
            column: 64
          }
        }],
        line: 45
      },
      "4": {
        loc: {
          start: {
            line: 46,
            column: 6
          },
          end: {
            line: 50,
            column: 7
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 46,
            column: 6
          },
          end: {
            line: 50,
            column: 7
          }
        }, {
          start: {
            line: 46,
            column: 6
          },
          end: {
            line: 50,
            column: 7
          }
        }],
        line: 46
      },
      "5": {
        loc: {
          start: {
            line: 58,
            column: 4
          },
          end: {
            line: 58,
            column: 53
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 58,
            column: 4
          },
          end: {
            line: 58,
            column: 53
          }
        }, {
          start: {
            line: 58,
            column: 4
          },
          end: {
            line: 58,
            column: 53
          }
        }],
        line: 58
      }
    },
    s: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0,
      "7": 0,
      "8": 0,
      "9": 0,
      "10": 0,
      "11": 0,
      "12": 0,
      "13": 0,
      "14": 0,
      "15": 0,
      "16": 0,
      "17": 0,
      "18": 0,
      "19": 0,
      "20": 0,
      "21": 0,
      "22": 0,
      "23": 0,
      "24": 0,
      "25": 0,
      "26": 0,
      "27": 0,
      "28": 0,
      "29": 0,
      "30": 0,
      "31": 0,
      "32": 0,
      "33": 0,
      "34": 0,
      "35": 0,
      "36": 0
    },
    f: {
      "0": 0
    },
    b: {
      "0": [0, 0],
      "1": [0, 0],
      "2": [0, 0],
      "3": [0, 0],
      "4": [0, 0],
      "5": [0, 0]
    },
    _coverageSchema: "43e27e138ebf9cfc5966b082cf9a028302ed4184"
  },
      coverage = global[gcv] || (global[gcv] = {});

  if (coverage[path] && coverage[path].hash === hash) {
    return coverage[path];
  }

  coverageData.hash = hash;
  return coverage[path] = coverageData;
}();

const FetchDoiMailDataSchema = (cov_15x314ahuk.s[0]++, new SimpleSchema({
  name: {
    type: String
  },
  domain: {
    type: String
  }
}));
cov_15x314ahuk.s[1]++;

const fetchDoiMailData = data => {
  cov_15x314ahuk.f[0]++;
  cov_15x314ahuk.s[2]++;

  try {
    const ourData = (cov_15x314ahuk.s[3]++, data);
    cov_15x314ahuk.s[4]++;
    FetchDoiMailDataSchema.validate(ourData);
    const url = (cov_15x314ahuk.s[5]++, ourData.domain + API_PATH + VERSION + "/" + DOI_FETCH_ROUTE);
    const signature = (cov_15x314ahuk.s[6]++, signMessage(CONFIRM_CLIENT, CONFIRM_ADDRESS, ourData.name));
    const query = (cov_15x314ahuk.s[7]++, "name_id=" + encodeURIComponent(ourData.name) + "&signature=" + encodeURIComponent(signature));
    cov_15x314ahuk.s[8]++;
    logConfirm('calling for doi-email-template:' + url + ' query:', query);
    /**
      TODO when running Send-dApp in Testnet behind NAT this URL will not be accessible from the internet
      but even when we use the URL from localhost verify andn others will fails.
     */

    const response = (cov_15x314ahuk.s[9]++, getHttpGET(url, query));
    cov_15x314ahuk.s[10]++;

    if ((cov_15x314ahuk.b[1][0]++, response === undefined) || (cov_15x314ahuk.b[1][1]++, response.data === undefined)) {
      cov_15x314ahuk.b[0][0]++;
      cov_15x314ahuk.s[11]++;
      throw "Bad response";
    } else {
      cov_15x314ahuk.b[0][1]++;
    }

    const responseData = (cov_15x314ahuk.s[12]++, response.data);
    cov_15x314ahuk.s[13]++;
    logConfirm('response while getting getting email template from URL:', response.data.status);
    cov_15x314ahuk.s[14]++;

    if (responseData.status !== "success") {
      cov_15x314ahuk.b[2][0]++;
      cov_15x314ahuk.s[15]++;

      if (responseData.error === undefined) {
        cov_15x314ahuk.b[3][0]++;
        cov_15x314ahuk.s[16]++;
        throw "Bad response";
      } else {
        cov_15x314ahuk.b[3][1]++;
      }

      cov_15x314ahuk.s[17]++;

      if (responseData.error.includes("Opt-In not found")) {
        cov_15x314ahuk.b[4][0]++;
        cov_15x314ahuk.s[18]++; //Do nothing and don't throw error so job is done

        logError('response data from Send-dApp:', responseData.error);
        cov_15x314ahuk.s[19]++;
        return;
      } else {
        cov_15x314ahuk.b[4][1]++;
      }

      cov_15x314ahuk.s[20]++;
      throw responseData.error;
    } else {
      cov_15x314ahuk.b[2][1]++;
    }

    cov_15x314ahuk.s[21]++;
    logConfirm('DOI Mail data fetched.');
    const optInId = (cov_15x314ahuk.s[22]++, addOptIn({
      name: ourData.name
    }));
    const optIn = (cov_15x314ahuk.s[23]++, OptIns.findOne({
      _id: optInId
    }));
    cov_15x314ahuk.s[24]++;
    logConfirm('opt-in found:', optIn);
    cov_15x314ahuk.s[25]++;

    if (optIn.confirmationToken !== undefined) {
      cov_15x314ahuk.b[5][0]++;
      cov_15x314ahuk.s[26]++;
      return;
    } else {
      cov_15x314ahuk.b[5][1]++;
    }

    const token = (cov_15x314ahuk.s[27]++, generateDoiToken({
      id: optIn._id
    }));
    cov_15x314ahuk.s[28]++;
    logConfirm('generated confirmationToken:', token);
    const confirmationHash = (cov_15x314ahuk.s[29]++, generateDoiHash({
      id: optIn._id,
      token: token,
      redirect: responseData.data.redirect
    }));
    cov_15x314ahuk.s[30]++;
    logConfirm('generated confirmationHash:', confirmationHash);
    const confirmationUrl = (cov_15x314ahuk.s[31]++, getUrl() + API_PATH + VERSION + "/" + DOI_CONFIRMATION_ROUTE + "/" + encodeURIComponent(confirmationHash));
    cov_15x314ahuk.s[32]++;
    logConfirm('confirmationUrl:' + confirmationUrl);
    const template = (cov_15x314ahuk.s[33]++, parseTemplate({
      template: responseData.data.content,
      data: {
        confirmation_url: confirmationUrl
      }
    })); //logConfirm('we are using this template:',template);

    cov_15x314ahuk.s[34]++;
    logConfirm('sending email to peter for confirmation over bobs dApp');
    cov_15x314ahuk.s[35]++;
    addSendMailJob({
      to: responseData.data.recipient,
      subject: responseData.data.subject,
      message: template,
      returnPath: responseData.data.returnPath
    });
  } catch (exception) {
    cov_15x314ahuk.s[36]++;
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

var cov_276h8hm3w5 = function () {
  var path = "/home/doichain/dapp/imports/modules/server/dapps/get_doi-mail-data.js",
      hash = "e471b1d892b190a3a455f9b1e8af0f4238bb6dbf",
      Function = function () {}.constructor,
      global = new Function('return this')(),
      gcv = "__coverage__",
      coverageData = {
    path: "/home/doichain/dapp/imports/modules/server/dapps/get_doi-mail-data.js",
    statementMap: {
      "0": {
        start: {
          line: 13,
          column: 29
        },
        end: {
          line: 20,
          column: 2
        }
      },
      "1": {
        start: {
          line: 22,
          column: 26
        },
        end: {
          line: 42,
          column: 2
        }
      },
      "2": {
        start: {
          line: 44,
          column: 23
        },
        end: {
          line: 123,
          column: 1
        }
      },
      "3": {
        start: {
          line: 45,
          column: 2
        },
        end: {
          line: 122,
          column: 3
        }
      },
      "4": {
        start: {
          line: 46,
          column: 20
        },
        end: {
          line: 46,
          column: 24
        }
      },
      "5": {
        start: {
          line: 47,
          column: 4
        },
        end: {
          line: 47,
          column: 43
        }
      },
      "6": {
        start: {
          line: 48,
          column: 18
        },
        end: {
          line: 48,
          column: 59
        }
      },
      "7": {
        start: {
          line: 49,
          column: 4
        },
        end: {
          line: 49,
          column: 87
        }
      },
      "8": {
        start: {
          line: 49,
          column: 28
        },
        end: {
          line: 49,
          column: 87
        }
      },
      "9": {
        start: {
          line: 50,
          column: 4
        },
        end: {
          line: 50,
          column: 34
        }
      },
      "10": {
        start: {
          line: 52,
          column: 22
        },
        end: {
          line: 52,
          column: 64
        }
      },
      "11": {
        start: {
          line: 53,
          column: 4
        },
        end: {
          line: 53,
          column: 60
        }
      },
      "12": {
        start: {
          line: 53,
          column: 32
        },
        end: {
          line: 53,
          column: 60
        }
      },
      "13": {
        start: {
          line: 54,
          column: 4
        },
        end: {
          line: 54,
          column: 42
        }
      },
      "14": {
        start: {
          line: 56,
          column: 18
        },
        end: {
          line: 56,
          column: 44
        }
      },
      "15": {
        start: {
          line: 57,
          column: 19
        },
        end: {
          line: 57,
          column: 40
        }
      },
      "16": {
        start: {
          line: 59,
          column: 20
        },
        end: {
          line: 59,
          column: 50
        }
      },
      "17": {
        start: {
          line: 61,
          column: 4
        },
        end: {
          line: 65,
          column: 5
        }
      },
      "18": {
        start: {
          line: 62,
          column: 23
        },
        end: {
          line: 62,
          column: 66
        }
      },
      "19": {
        start: {
          line: 63,
          column: 6
        },
        end: {
          line: 63,
          column: 107
        }
      },
      "20": {
        start: {
          line: 64,
          column: 6
        },
        end: {
          line: 64,
          column: 51
        }
      },
      "21": {
        start: {
          line: 67,
          column: 4
        },
        end: {
          line: 67,
          column: 106
        }
      },
      "22": {
        start: {
          line: 75,
          column: 4
        },
        end: {
          line: 75,
          column: 38
        }
      },
      "23": {
        start: {
          line: 76,
          column: 4
        },
        end: {
          line: 78,
          column: 5
        }
      },
      "24": {
        start: {
          line: 77,
          column: 6
        },
        end: {
          line: 77,
          column: 50
        }
      },
      "25": {
        start: {
          line: 80,
          column: 4
        },
        end: {
          line: 80,
          column: 34
        }
      },
      "26": {
        start: {
          line: 84,
          column: 4
        },
        end: {
          line: 118,
          column: 5
        }
      },
      "27": {
        start: {
          line: 86,
          column: 6
        },
        end: {
          line: 86,
          column: 60
        }
      },
      "28": {
        start: {
          line: 87,
          column: 30
        },
        end: {
          line: 93,
          column: 7
        }
      },
      "29": {
        start: {
          line: 95,
          column: 21
        },
        end: {
          line: 95,
          column: 38
        }
      },
      "30": {
        start: {
          line: 97,
          column: 4
        },
        end: {
          line: 110,
          column: 5
        }
      },
      "31": {
        start: {
          line: 98,
          column: 18
        },
        end: {
          line: 98,
          column: 62
        }
      },
      "32": {
        start: {
          line: 99,
          column: 25
        },
        end: {
          line: 99,
          column: 51
        }
      },
      "33": {
        start: {
          line: 100,
          column: 6
        },
        end: {
          line: 100,
          column: 47
        }
      },
      "34": {
        start: {
          line: 102,
          column: 6
        },
        end: {
          line: 102,
          column: 89
        }
      },
      "35": {
        start: {
          line: 103,
          column: 6
        },
        end: {
          line: 103,
          column: 86
        }
      },
      "36": {
        start: {
          line: 104,
          column: 6
        },
        end: {
          line: 104,
          column: 95
        }
      },
      "37": {
        start: {
          line: 105,
          column: 6
        },
        end: {
          line: 105,
          column: 177
        }
      },
      "38": {
        start: {
          line: 109,
          column: 6
        },
        end: {
          line: 109,
          column: 35
        }
      },
      "39": {
        start: {
          line: 112,
          column: 6
        },
        end: {
          line: 112,
          column: 70
        }
      },
      "40": {
        start: {
          line: 114,
          column: 6
        },
        end: {
          line: 114,
          column: 23
        }
      },
      "41": {
        start: {
          line: 117,
          column: 6
        },
        end: {
          line: 117,
          column: 56
        }
      },
      "42": {
        start: {
          line: 121,
          column: 4
        },
        end: {
          line: 121,
          column: 72
        }
      }
    },
    fnMap: {
      "0": {
        name: "(anonymous_0)",
        decl: {
          start: {
            line: 44,
            column: 23
          },
          end: {
            line: 44,
            column: 24
          }
        },
        loc: {
          start: {
            line: 44,
            column: 33
          },
          end: {
            line: 123,
            column: 1
          }
        },
        line: 44
      }
    },
    branchMap: {
      "0": {
        loc: {
          start: {
            line: 49,
            column: 4
          },
          end: {
            line: 49,
            column: 87
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 49,
            column: 4
          },
          end: {
            line: 49,
            column: 87
          }
        }, {
          start: {
            line: 49,
            column: 4
          },
          end: {
            line: 49,
            column: 87
          }
        }],
        line: 49
      },
      "1": {
        loc: {
          start: {
            line: 53,
            column: 4
          },
          end: {
            line: 53,
            column: 60
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 53,
            column: 4
          },
          end: {
            line: 53,
            column: 60
          }
        }, {
          start: {
            line: 53,
            column: 4
          },
          end: {
            line: 53,
            column: 60
          }
        }],
        line: 53
      },
      "2": {
        loc: {
          start: {
            line: 61,
            column: 4
          },
          end: {
            line: 65,
            column: 5
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 61,
            column: 4
          },
          end: {
            line: 65,
            column: 5
          }
        }, {
          start: {
            line: 61,
            column: 4
          },
          end: {
            line: 65,
            column: 5
          }
        }],
        line: 61
      },
      "3": {
        loc: {
          start: {
            line: 76,
            column: 4
          },
          end: {
            line: 78,
            column: 5
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 76,
            column: 4
          },
          end: {
            line: 78,
            column: 5
          }
        }, {
          start: {
            line: 76,
            column: 4
          },
          end: {
            line: 78,
            column: 5
          }
        }],
        line: 76
      },
      "4": {
        loc: {
          start: {
            line: 102,
            column: 31
          },
          end: {
            line: 102,
            column: 88
          }
        },
        type: "binary-expr",
        locations: [{
          start: {
            line: 102,
            column: 31
          },
          end: {
            line: 102,
            column: 55
          }
        }, {
          start: {
            line: 102,
            column: 59
          },
          end: {
            line: 102,
            column: 88
          }
        }],
        line: 102
      },
      "5": {
        loc: {
          start: {
            line: 103,
            column: 30
          },
          end: {
            line: 103,
            column: 85
          }
        },
        type: "binary-expr",
        locations: [{
          start: {
            line: 103,
            column: 30
          },
          end: {
            line: 103,
            column: 53
          }
        }, {
          start: {
            line: 103,
            column: 57
          },
          end: {
            line: 103,
            column: 85
          }
        }],
        line: 103
      },
      "6": {
        loc: {
          start: {
            line: 104,
            column: 33
          },
          end: {
            line: 104,
            column: 94
          }
        },
        type: "binary-expr",
        locations: [{
          start: {
            line: 104,
            column: 33
          },
          end: {
            line: 104,
            column: 59
          }
        }, {
          start: {
            line: 104,
            column: 63
          },
          end: {
            line: 104,
            column: 94
          }
        }],
        line: 104
      },
      "7": {
        loc: {
          start: {
            line: 105,
            column: 30
          },
          end: {
            line: 105,
            column: 176
          }
        },
        type: "cond-expr",
        locations: [{
          start: {
            line: 105,
            column: 61
          },
          end: {
            line: 105,
            column: 144
          }
        }, {
          start: {
            line: 105,
            column: 148
          },
          end: {
            line: 105,
            column: 176
          }
        }],
        line: 105
      },
      "8": {
        loc: {
          start: {
            line: 105,
            column: 61
          },
          end: {
            line: 105,
            column: 144
          }
        },
        type: "binary-expr",
        locations: [{
          start: {
            line: 105,
            column: 61
          },
          end: {
            line: 105,
            column: 112
          }
        }, {
          start: {
            line: 105,
            column: 116
          },
          end: {
            line: 105,
            column: 144
          }
        }],
        line: 105
      }
    },
    s: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0,
      "7": 0,
      "8": 0,
      "9": 0,
      "10": 0,
      "11": 0,
      "12": 0,
      "13": 0,
      "14": 0,
      "15": 0,
      "16": 0,
      "17": 0,
      "18": 0,
      "19": 0,
      "20": 0,
      "21": 0,
      "22": 0,
      "23": 0,
      "24": 0,
      "25": 0,
      "26": 0,
      "27": 0,
      "28": 0,
      "29": 0,
      "30": 0,
      "31": 0,
      "32": 0,
      "33": 0,
      "34": 0,
      "35": 0,
      "36": 0,
      "37": 0,
      "38": 0,
      "39": 0,
      "40": 0,
      "41": 0,
      "42": 0
    },
    f: {
      "0": 0
    },
    b: {
      "0": [0, 0],
      "1": [0, 0],
      "2": [0, 0],
      "3": [0, 0],
      "4": [0, 0],
      "5": [0, 0],
      "6": [0, 0],
      "7": [0, 0],
      "8": [0, 0]
    },
    _coverageSchema: "43e27e138ebf9cfc5966b082cf9a028302ed4184"
  },
      coverage = global[gcv] || (global[gcv] = {});

  if (coverage[path] && coverage[path].hash === hash) {
    return coverage[path];
  }

  coverageData.hash = hash;
  return coverage[path] = coverageData;
}();

const GetDoiMailDataSchema = (cov_276h8hm3w5.s[0]++, new SimpleSchema({
  name_id: {
    type: String
  },
  signature: {
    type: String
  }
}));
const userProfileSchema = (cov_276h8hm3w5.s[1]++, new SimpleSchema({
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
}));
cov_276h8hm3w5.s[2]++;

const getDoiMailData = data => {
  cov_276h8hm3w5.f[0]++;
  cov_276h8hm3w5.s[3]++;

  try {
    const ourData = (cov_276h8hm3w5.s[4]++, data);
    cov_276h8hm3w5.s[5]++;
    GetDoiMailDataSchema.validate(ourData);
    const optIn = (cov_276h8hm3w5.s[6]++, OptIns.findOne({
      nameId: ourData.name_id
    }));
    cov_276h8hm3w5.s[7]++;

    if (optIn === undefined) {
      cov_276h8hm3w5.b[0][0]++;
      cov_276h8hm3w5.s[8]++;
      throw "Opt-In with name_id: " + ourData.name_id + " not found";
    } else {
      cov_276h8hm3w5.b[0][1]++;
    }

    cov_276h8hm3w5.s[9]++;
    logSend('Opt-In found', optIn);
    const recipient = (cov_276h8hm3w5.s[10]++, Recipients.findOne({
      _id: optIn.recipient
    }));
    cov_276h8hm3w5.s[11]++;

    if (recipient === undefined) {
      cov_276h8hm3w5.b[1][0]++;
      cov_276h8hm3w5.s[12]++;
      throw "Recipient not found";
    } else {
      cov_276h8hm3w5.b[1][1]++;
    }

    cov_276h8hm3w5.s[13]++;
    logSend('Recipient found', recipient);
    const parts = (cov_276h8hm3w5.s[14]++, recipient.email.split("@"));
    const domain = (cov_276h8hm3w5.s[15]++, parts[parts.length - 1]);
    let publicKey = (cov_276h8hm3w5.s[16]++, getOptInKey({
      domain: domain
    }));
    cov_276h8hm3w5.s[17]++;

    if (!publicKey) {
      cov_276h8hm3w5.b[2][0]++;
      const provider = (cov_276h8hm3w5.s[18]++, getOptInProvider({
        domain: ourData.domain
      }));
      cov_276h8hm3w5.s[19]++;
      logSend("using doichain provider instead of directly configured publicKey:", {
        provider: provider
      });
      cov_276h8hm3w5.s[20]++;
      publicKey = getOptInKey({
        domain: provider
      }); //get public key from provider or fallback if publickey was not set in dns
    } else {
      cov_276h8hm3w5.b[2][1]++;
    }

    cov_276h8hm3w5.s[21]++;
    logSend('queried data: (parts, domain, provider, publicKey)', '(' + parts + ',' + domain + ',' + publicKey + ')'); //TODO: Only allow access one time
    // Possible solution:
    // 1. Provider (confirm dApp) request the data
    // 2. Provider receive the data
    // 3. Provider sends confirmation "I got the data"
    // 4. Send dApp lock the data for this opt in

    cov_276h8hm3w5.s[22]++;
    logSend('verifying signature...');
    cov_276h8hm3w5.s[23]++;

    if (!verifySignature({
      publicKey: publicKey,
      data: ourData.name_id,
      signature: ourData.signature
    })) {
      cov_276h8hm3w5.b[3][0]++;
      cov_276h8hm3w5.s[24]++;
      throw "signature incorrect - access denied";
    } else {
      cov_276h8hm3w5.b[3][1]++;
    }

    cov_276h8hm3w5.s[25]++;
    logSend('signature verified'); //TODO: Query for language

    let doiMailData;
    cov_276h8hm3w5.s[26]++;

    try {
      cov_276h8hm3w5.s[27]++;
      doiMailData = getHttpGET(DOI_MAIL_FETCH_URL, "").data;
      let defaultReturnData = (cov_276h8hm3w5.s[28]++, {
        "recipient": recipient.email,
        "content": doiMailData.data.content,
        "redirect": doiMailData.data.redirect,
        "subject": doiMailData.data.subject,
        "returnPath": doiMailData.data.returnPath
      });
      let returnData = (cov_276h8hm3w5.s[29]++, defaultReturnData);
      cov_276h8hm3w5.s[30]++;

      try {
        let owner = (cov_276h8hm3w5.s[31]++, Accounts.users.findOne({
          _id: optIn.ownerId
        }));
        let mailTemplate = (cov_276h8hm3w5.s[32]++, owner.profile.mailTemplate);
        cov_276h8hm3w5.s[33]++;
        userProfileSchema.validate(mailTemplate);
        cov_276h8hm3w5.s[34]++;
        returnData["redirect"] = (cov_276h8hm3w5.b[4][0]++, mailTemplate["redirect"]) || (cov_276h8hm3w5.b[4][1]++, defaultReturnData["redirect"]);
        cov_276h8hm3w5.s[35]++;
        returnData["subject"] = (cov_276h8hm3w5.b[5][0]++, mailTemplate["subject"]) || (cov_276h8hm3w5.b[5][1]++, defaultReturnData["subject"]);
        cov_276h8hm3w5.s[36]++;
        returnData["returnPath"] = (cov_276h8hm3w5.b[6][0]++, mailTemplate["returnPath"]) || (cov_276h8hm3w5.b[6][1]++, defaultReturnData["returnPath"]);
        cov_276h8hm3w5.s[37]++;
        returnData["content"] = mailTemplate["templateURL"] ? (cov_276h8hm3w5.b[7][0]++, (cov_276h8hm3w5.b[8][0]++, getHttpGET(mailTemplate["templateURL"], "").content) || (cov_276h8hm3w5.b[8][1]++, defaultReturnData["content"])) : (cov_276h8hm3w5.b[7][1]++, defaultReturnData["content"]);
      } catch (error) {
        cov_276h8hm3w5.s[38]++;
        returnData = defaultReturnData;
      }

      cov_276h8hm3w5.s[39]++;
      logSend('doiMailData and url:', DOI_MAIL_FETCH_URL, returnData);
      cov_276h8hm3w5.s[40]++;
      return returnData;
    } catch (error) {
      cov_276h8hm3w5.s[41]++;
      throw "Error while fetching mail content: " + error;
    }
  } catch (exception) {
    cov_276h8hm3w5.s[42]++;
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

var cov_1zp79i8o8c = function () {
  var path = "/home/doichain/dapp/imports/modules/server/dns/get_opt-in-key.js",
      hash = "552e89d90f54ebf737e3172ff4a4393f95e9d6ab",
      Function = function () {}.constructor,
      global = new Function('return this')(),
      gcv = "__coverage__",
      coverageData = {
    path: "/home/doichain/dapp/imports/modules/server/dns/get_opt-in-key.js",
    statementMap: {
      "0": {
        start: {
          line: 8,
          column: 19
        },
        end: {
          line: 8,
          column: 40
        }
      },
      "1": {
        start: {
          line: 9,
          column: 27
        },
        end: {
          line: 9,
          column: 56
        }
      },
      "2": {
        start: {
          line: 11,
          column: 26
        },
        end: {
          line: 15,
          column: 2
        }
      },
      "3": {
        start: {
          line: 18,
          column: 20
        },
        end: {
          line: 37,
          column: 1
        }
      },
      "4": {
        start: {
          line: 19,
          column: 2
        },
        end: {
          line: 36,
          column: 3
        }
      },
      "5": {
        start: {
          line: 20,
          column: 20
        },
        end: {
          line: 20,
          column: 24
        }
      },
      "6": {
        start: {
          line: 21,
          column: 4
        },
        end: {
          line: 21,
          column: 40
        }
      },
      "7": {
        start: {
          line: 23,
          column: 22
        },
        end: {
          line: 23,
          column: 32
        }
      },
      "8": {
        start: {
          line: 25,
          column: 4
        },
        end: {
          line: 28,
          column: 5
        }
      },
      "9": {
        start: {
          line: 26,
          column: 8
        },
        end: {
          line: 26,
          column: 43
        }
      },
      "10": {
        start: {
          line: 27,
          column: 8
        },
        end: {
          line: 27,
          column: 102
        }
      },
      "11": {
        start: {
          line: 29,
          column: 16
        },
        end: {
          line: 29,
          column: 57
        }
      },
      "12": {
        start: {
          line: 30,
          column: 4
        },
        end: {
          line: 30,
          column: 153
        }
      },
      "13": {
        start: {
          line: 32,
          column: 4
        },
        end: {
          line: 32,
          column: 61
        }
      },
      "14": {
        start: {
          line: 32,
          column: 26
        },
        end: {
          line: 32,
          column: 61
        }
      },
      "15": {
        start: {
          line: 33,
          column: 4
        },
        end: {
          line: 33,
          column: 15
        }
      },
      "16": {
        start: {
          line: 35,
          column: 4
        },
        end: {
          line: 35,
          column: 67
        }
      },
      "17": {
        start: {
          line: 39,
          column: 20
        },
        end: {
          line: 43,
          column: 1
        }
      },
      "18": {
        start: {
          line: 40,
          column: 2
        },
        end: {
          line: 40,
          column: 90
        }
      },
      "19": {
        start: {
          line: 40,
          column: 35
        },
        end: {
          line: 40,
          column: 90
        }
      },
      "20": {
        start: {
          line: 41,
          column: 4
        },
        end: {
          line: 41,
          column: 67
        }
      },
      "21": {
        start: {
          line: 42,
          column: 2
        },
        end: {
          line: 42,
          column: 50
        }
      }
    },
    fnMap: {
      "0": {
        name: "(anonymous_0)",
        decl: {
          start: {
            line: 18,
            column: 20
          },
          end: {
            line: 18,
            column: 21
          }
        },
        loc: {
          start: {
            line: 18,
            column: 30
          },
          end: {
            line: 37,
            column: 1
          }
        },
        line: 18
      },
      "1": {
        name: "(anonymous_1)",
        decl: {
          start: {
            line: 39,
            column: 20
          },
          end: {
            line: 39,
            column: 21
          }
        },
        loc: {
          start: {
            line: 39,
            column: 32
          },
          end: {
            line: 43,
            column: 1
          }
        },
        line: 39
      }
    },
    branchMap: {
      "0": {
        loc: {
          start: {
            line: 25,
            column: 4
          },
          end: {
            line: 28,
            column: 5
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 25,
            column: 4
          },
          end: {
            line: 28,
            column: 5
          }
        }, {
          start: {
            line: 25,
            column: 4
          },
          end: {
            line: 28,
            column: 5
          }
        }],
        line: 25
      },
      "1": {
        loc: {
          start: {
            line: 25,
            column: 7
          },
          end: {
            line: 25,
            column: 33
          }
        },
        type: "binary-expr",
        locations: [{
          start: {
            line: 25,
            column: 7
          },
          end: {
            line: 25,
            column: 18
          }
        }, {
          start: {
            line: 25,
            column: 22
          },
          end: {
            line: 25,
            column: 33
          }
        }],
        line: 25
      },
      "2": {
        loc: {
          start: {
            line: 32,
            column: 4
          },
          end: {
            line: 32,
            column: 61
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 32,
            column: 4
          },
          end: {
            line: 32,
            column: 61
          }
        }, {
          start: {
            line: 32,
            column: 4
          },
          end: {
            line: 32,
            column: 61
          }
        }],
        line: 32
      },
      "3": {
        loc: {
          start: {
            line: 40,
            column: 2
          },
          end: {
            line: 40,
            column: 90
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 40,
            column: 2
          },
          end: {
            line: 40,
            column: 90
          }
        }, {
          start: {
            line: 40,
            column: 2
          },
          end: {
            line: 40,
            column: 90
          }
        }],
        line: 40
      }
    },
    s: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0,
      "7": 0,
      "8": 0,
      "9": 0,
      "10": 0,
      "11": 0,
      "12": 0,
      "13": 0,
      "14": 0,
      "15": 0,
      "16": 0,
      "17": 0,
      "18": 0,
      "19": 0,
      "20": 0,
      "21": 0
    },
    f: {
      "0": 0,
      "1": 0
    },
    b: {
      "0": [0, 0],
      "1": [0, 0],
      "2": [0, 0],
      "3": [0, 0]
    },
    _coverageSchema: "43e27e138ebf9cfc5966b082cf9a028302ed4184"
  },
      coverage = global[gcv] || (global[gcv] = {});

  if (coverage[path] && coverage[path].hash === hash) {
    return coverage[path];
  }

  coverageData.hash = hash;
  return coverage[path] = coverageData;
}();

const OPT_IN_KEY = (cov_1zp79i8o8c.s[0]++, "doichain-opt-in-key");
const OPT_IN_KEY_TESTNET = (cov_1zp79i8o8c.s[1]++, "doichain-testnet-opt-in-key");
const GetOptInKeySchema = (cov_1zp79i8o8c.s[2]++, new SimpleSchema({
  domain: {
    type: String
  }
}));
cov_1zp79i8o8c.s[3]++;

const getOptInKey = data => {
  cov_1zp79i8o8c.f[0]++;
  cov_1zp79i8o8c.s[4]++;

  try {
    const ourData = (cov_1zp79i8o8c.s[5]++, data);
    cov_1zp79i8o8c.s[6]++;
    GetOptInKeySchema.validate(ourData);
    let ourOPT_IN_KEY = (cov_1zp79i8o8c.s[7]++, OPT_IN_KEY);
    cov_1zp79i8o8c.s[8]++;

    if ((cov_1zp79i8o8c.b[1][0]++, isRegtest()) || (cov_1zp79i8o8c.b[1][1]++, isTestnet())) {
      cov_1zp79i8o8c.b[0][0]++;
      cov_1zp79i8o8c.s[9]++;
      ourOPT_IN_KEY = OPT_IN_KEY_TESTNET;
      cov_1zp79i8o8c.s[10]++;
      logSend('Using RegTest:' + isRegtest() + " Testnet: " + isTestnet() + " ourOPT_IN_KEY", ourOPT_IN_KEY);
    } else {
      cov_1zp79i8o8c.b[0][1]++;
    }

    const key = (cov_1zp79i8o8c.s[11]++, resolveTxt(ourOPT_IN_KEY, ourData.domain));
    cov_1zp79i8o8c.s[12]++;
    logSend('DNS TXT configured public key of recipient email domain and confirmation dapp', {
      foundKey: key,
      domain: ourData.domain,
      dnskey: ourOPT_IN_KEY
    });
    cov_1zp79i8o8c.s[13]++;

    if (key === undefined) {
      cov_1zp79i8o8c.b[2][0]++;
      cov_1zp79i8o8c.s[14]++;
      return useFallback(ourData.domain);
    } else {
      cov_1zp79i8o8c.b[2][1]++;
    }

    cov_1zp79i8o8c.s[15]++;
    return key;
  } catch (exception) {
    cov_1zp79i8o8c.s[16]++;
    throw new Meteor.Error('dns.getOptInKey.exception', exception);
  }
};

cov_1zp79i8o8c.s[17]++;

const useFallback = domain => {
  cov_1zp79i8o8c.f[1]++;
  cov_1zp79i8o8c.s[18]++;

  if (domain === FALLBACK_PROVIDER) {
    cov_1zp79i8o8c.b[3][0]++;
    cov_1zp79i8o8c.s[19]++;
    throw new Meteor.Error("Fallback has no key defined!");
  } else {
    cov_1zp79i8o8c.b[3][1]++;
  }

  cov_1zp79i8o8c.s[20]++;
  logSend("Key not defined. Using fallback: ", FALLBACK_PROVIDER);
  cov_1zp79i8o8c.s[21]++;
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

var cov_1fqlpljz7x = function () {
  var path = "/home/doichain/dapp/imports/modules/server/dns/get_opt-in-provider.js",
      hash = "abde9650221153b7ea17067339f245ddfc6f2902",
      Function = function () {}.constructor,
      global = new Function('return this')(),
      gcv = "__coverage__",
      coverageData = {
    path: "/home/doichain/dapp/imports/modules/server/dns/get_opt-in-provider.js",
    statementMap: {
      "0": {
        start: {
          line: 8,
          column: 21
        },
        end: {
          line: 8,
          column: 47
        }
      },
      "1": {
        start: {
          line: 9,
          column: 29
        },
        end: {
          line: 9,
          column: 63
        }
      },
      "2": {
        start: {
          line: 11,
          column: 31
        },
        end: {
          line: 15,
          column: 2
        }
      },
      "3": {
        start: {
          line: 18,
          column: 25
        },
        end: {
          line: 37,
          column: 1
        }
      },
      "4": {
        start: {
          line: 19,
          column: 2
        },
        end: {
          line: 36,
          column: 3
        }
      },
      "5": {
        start: {
          line: 20,
          column: 20
        },
        end: {
          line: 20,
          column: 24
        }
      },
      "6": {
        start: {
          line: 21,
          column: 4
        },
        end: {
          line: 21,
          column: 45
        }
      },
      "7": {
        start: {
          line: 23,
          column: 24
        },
        end: {
          line: 23,
          column: 36
        }
      },
      "8": {
        start: {
          line: 24,
          column: 4
        },
        end: {
          line: 27,
          column: 5
        }
      },
      "9": {
        start: {
          line: 25,
          column: 8
        },
        end: {
          line: 25,
          column: 47
        }
      },
      "10": {
        start: {
          line: 26,
          column: 8
        },
        end: {
          line: 26,
          column: 141
        }
      },
      "11": {
        start: {
          line: 29,
          column: 21
        },
        end: {
          line: 29,
          column: 64
        }
      },
      "12": {
        start: {
          line: 30,
          column: 4
        },
        end: {
          line: 30,
          column: 52
        }
      },
      "13": {
        start: {
          line: 30,
          column: 31
        },
        end: {
          line: 30,
          column: 52
        }
      },
      "14": {
        start: {
          line: 32,
          column: 4
        },
        end: {
          line: 32,
          column: 84
        }
      },
      "15": {
        start: {
          line: 33,
          column: 4
        },
        end: {
          line: 33,
          column: 20
        }
      },
      "16": {
        start: {
          line: 35,
          column: 4
        },
        end: {
          line: 35,
          column: 72
        }
      },
      "17": {
        start: {
          line: 39,
          column: 20
        },
        end: {
          line: 42,
          column: 1
        }
      },
      "18": {
        start: {
          line: 40,
          column: 2
        },
        end: {
          line: 40,
          column: 74
        }
      },
      "19": {
        start: {
          line: 41,
          column: 2
        },
        end: {
          line: 41,
          column: 27
        }
      }
    },
    fnMap: {
      "0": {
        name: "(anonymous_0)",
        decl: {
          start: {
            line: 18,
            column: 25
          },
          end: {
            line: 18,
            column: 26
          }
        },
        loc: {
          start: {
            line: 18,
            column: 35
          },
          end: {
            line: 37,
            column: 1
          }
        },
        line: 18
      },
      "1": {
        name: "(anonymous_1)",
        decl: {
          start: {
            line: 39,
            column: 20
          },
          end: {
            line: 39,
            column: 21
          }
        },
        loc: {
          start: {
            line: 39,
            column: 26
          },
          end: {
            line: 42,
            column: 1
          }
        },
        line: 39
      }
    },
    branchMap: {
      "0": {
        loc: {
          start: {
            line: 24,
            column: 4
          },
          end: {
            line: 27,
            column: 5
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 24,
            column: 4
          },
          end: {
            line: 27,
            column: 5
          }
        }, {
          start: {
            line: 24,
            column: 4
          },
          end: {
            line: 27,
            column: 5
          }
        }],
        line: 24
      },
      "1": {
        loc: {
          start: {
            line: 24,
            column: 7
          },
          end: {
            line: 24,
            column: 33
          }
        },
        type: "binary-expr",
        locations: [{
          start: {
            line: 24,
            column: 7
          },
          end: {
            line: 24,
            column: 18
          }
        }, {
          start: {
            line: 24,
            column: 22
          },
          end: {
            line: 24,
            column: 33
          }
        }],
        line: 24
      },
      "2": {
        loc: {
          start: {
            line: 30,
            column: 4
          },
          end: {
            line: 30,
            column: 52
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 30,
            column: 4
          },
          end: {
            line: 30,
            column: 52
          }
        }, {
          start: {
            line: 30,
            column: 4
          },
          end: {
            line: 30,
            column: 52
          }
        }],
        line: 30
      }
    },
    s: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0,
      "7": 0,
      "8": 0,
      "9": 0,
      "10": 0,
      "11": 0,
      "12": 0,
      "13": 0,
      "14": 0,
      "15": 0,
      "16": 0,
      "17": 0,
      "18": 0,
      "19": 0
    },
    f: {
      "0": 0,
      "1": 0
    },
    b: {
      "0": [0, 0],
      "1": [0, 0],
      "2": [0, 0]
    },
    _coverageSchema: "43e27e138ebf9cfc5966b082cf9a028302ed4184"
  },
      coverage = global[gcv] || (global[gcv] = {});

  if (coverage[path] && coverage[path].hash === hash) {
    return coverage[path];
  }

  coverageData.hash = hash;
  return coverage[path] = coverageData;
}();

const PROVIDER_KEY = (cov_1fqlpljz7x.s[0]++, "doichain-opt-in-provider");
const PROVIDER_KEY_TESTNET = (cov_1fqlpljz7x.s[1]++, "doichain-testnet-opt-in-provider");
const GetOptInProviderSchema = (cov_1fqlpljz7x.s[2]++, new SimpleSchema({
  domain: {
    type: String
  }
}));
cov_1fqlpljz7x.s[3]++;

const getOptInProvider = data => {
  cov_1fqlpljz7x.f[0]++;
  cov_1fqlpljz7x.s[4]++;

  try {
    const ourData = (cov_1fqlpljz7x.s[5]++, data);
    cov_1fqlpljz7x.s[6]++;
    GetOptInProviderSchema.validate(ourData);
    let ourPROVIDER_KEY = (cov_1fqlpljz7x.s[7]++, PROVIDER_KEY);
    cov_1fqlpljz7x.s[8]++;

    if ((cov_1fqlpljz7x.b[1][0]++, isRegtest()) || (cov_1fqlpljz7x.b[1][1]++, isTestnet())) {
      cov_1fqlpljz7x.b[0][0]++;
      cov_1fqlpljz7x.s[9]++;
      ourPROVIDER_KEY = PROVIDER_KEY_TESTNET;
      cov_1fqlpljz7x.s[10]++;
      logSend('Using RegTest:' + isRegtest() + " : Testnet:" + isTestnet() + " PROVIDER_KEY", {
        providerKey: ourPROVIDER_KEY,
        domain: ourData.domain
      });
    } else {
      cov_1fqlpljz7x.b[0][1]++;
    }

    const provider = (cov_1fqlpljz7x.s[11]++, resolveTxt(ourPROVIDER_KEY, ourData.domain));
    cov_1fqlpljz7x.s[12]++;

    if (provider === undefined) {
      cov_1fqlpljz7x.b[2][0]++;
      cov_1fqlpljz7x.s[13]++;
      return useFallback();
    } else {
      cov_1fqlpljz7x.b[2][1]++;
    }

    cov_1fqlpljz7x.s[14]++;
    logSend('opt-in-provider from dns - server of mail recipient: (TXT):', provider);
    cov_1fqlpljz7x.s[15]++;
    return provider;
  } catch (exception) {
    cov_1fqlpljz7x.s[16]++;
    throw new Meteor.Error('dns.getOptInProvider.exception', exception);
  }
};

cov_1fqlpljz7x.s[17]++;

const useFallback = () => {
  cov_1fqlpljz7x.f[1]++;
  cov_1fqlpljz7x.s[18]++;
  logSend('Provider not defined. Fallback ' + FALLBACK_PROVIDER + ' is used');
  cov_1fqlpljz7x.s[19]++;
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

var cov_1yrk4x5dyk = function () {
  var path = "/home/doichain/dapp/imports/modules/server/doichain/add_entry_and_fetch_data.js",
      hash = "327adc221f3ecb6444477fc017f738ab0299048a",
      Function = function () {}.constructor,
      global = new Function('return this')(),
      gcv = "__coverage__",
      coverageData = {
    path: "/home/doichain/dapp/imports/modules/server/doichain/add_entry_and_fetch_data.js",
    statementMap: {
      "0": {
        start: {
          line: 11,
          column: 31
        },
        end: {
          line: 24,
          column: 2
        }
      },
      "1": {
        start: {
          line: 32,
          column: 25
        },
        end: {
          line: 94,
          column: 1
        }
      },
      "2": {
        start: {
          line: 33,
          column: 2
        },
        end: {
          line: 93,
          column: 3
        }
      },
      "3": {
        start: {
          line: 35,
          column: 21
        },
        end: {
          line: 35,
          column: 26
        }
      },
      "4": {
        start: {
          line: 36,
          column: 4
        },
        end: {
          line: 36,
          column: 63
        }
      },
      "5": {
        start: {
          line: 37,
          column: 4
        },
        end: {
          line: 37,
          column: 46
        }
      },
      "6": {
        start: {
          line: 39,
          column: 16
        },
        end: {
          line: 39,
          column: 62
        }
      },
      "7": {
        start: {
          line: 40,
          column: 4
        },
        end: {
          line: 43,
          column: 5
        }
      },
      "8": {
        start: {
          line: 41,
          column: 8
        },
        end: {
          line: 41,
          column: 67
        }
      },
      "9": {
        start: {
          line: 42,
          column: 8
        },
        end: {
          line: 42,
          column: 23
        }
      },
      "10": {
        start: {
          line: 45,
          column: 18
        },
        end: {
          line: 45,
          column: 44
        }
      },
      "11": {
        start: {
          line: 47,
          column: 4
        },
        end: {
          line: 47,
          column: 64
        }
      },
      "12": {
        start: {
          line: 47,
          column: 33
        },
        end: {
          line: 47,
          column: 64
        }
      },
      "13": {
        start: {
          line: 48,
          column: 16
        },
        end: {
          line: 48,
          column: 55
        }
      },
      "14": {
        start: {
          line: 49,
          column: 23
        },
        end: {
          line: 49,
          column: 55
        }
      },
      "15": {
        start: {
          line: 50,
          column: 4
        },
        end: {
          line: 50,
          column: 55
        }
      },
      "16": {
        start: {
          line: 52,
          column: 19
        },
        end: {
          line: 52,
          column: 80
        }
      },
      "17": {
        start: {
          line: 53,
          column: 4
        },
        end: {
          line: 53,
          column: 54
        }
      },
      "18": {
        start: {
          line: 55,
          column: 20
        },
        end: {
          line: 55,
          column: 46
        }
      },
      "19": {
        start: {
          line: 56,
          column: 4
        },
        end: {
          line: 56,
          column: 32
        }
      },
      "20": {
        start: {
          line: 57,
          column: 22
        },
        end: {
          line: 57,
          column: 80
        }
      },
      "21": {
        start: {
          line: 58,
          column: 4
        },
        end: {
          line: 58,
          column: 36
        }
      },
      "22": {
        start: {
          line: 59,
          column: 18
        },
        end: {
          line: 59,
          column: 72
        }
      },
      "23": {
        start: {
          line: 60,
          column: 4
        },
        end: {
          line: 60,
          column: 28
        }
      },
      "24": {
        start: {
          line: 62,
          column: 15
        },
        end: {
          line: 71,
          column: 6
        }
      },
      "25": {
        start: {
          line: 73,
          column: 4
        },
        end: {
          line: 73,
          column: 103
        }
      },
      "26": {
        start: {
          line: 75,
          column: 4
        },
        end: {
          line: 88,
          column: 5
        }
      },
      "27": {
        start: {
          line: 76,
          column: 8
        },
        end: {
          line: 79,
          column: 11
        }
      },
      "28": {
        start: {
          line: 80,
          column: 8
        },
        end: {
          line: 84,
          column: 37
        }
      },
      "29": {
        start: {
          line: 87,
          column: 8
        },
        end: {
          line: 87,
          column: 74
        }
      },
      "30": {
        start: {
          line: 90,
          column: 4
        },
        end: {
          line: 90,
          column: 14
        }
      },
      "31": {
        start: {
          line: 92,
          column: 4
        },
        end: {
          line: 92,
          column: 81
        }
      }
    },
    fnMap: {
      "0": {
        name: "(anonymous_0)",
        decl: {
          start: {
            line: 32,
            column: 25
          },
          end: {
            line: 32,
            column: 26
          }
        },
        loc: {
          start: {
            line: 32,
            column: 36
          },
          end: {
            line: 94,
            column: 1
          }
        },
        line: 32
      }
    },
    branchMap: {
      "0": {
        loc: {
          start: {
            line: 40,
            column: 4
          },
          end: {
            line: 43,
            column: 5
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 40,
            column: 4
          },
          end: {
            line: 43,
            column: 5
          }
        }, {
          start: {
            line: 40,
            column: 4
          },
          end: {
            line: 43,
            column: 5
          }
        }],
        line: 40
      },
      "1": {
        loc: {
          start: {
            line: 47,
            column: 4
          },
          end: {
            line: 47,
            column: 64
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 47,
            column: 4
          },
          end: {
            line: 47,
            column: 64
          }
        }, {
          start: {
            line: 47,
            column: 4
          },
          end: {
            line: 47,
            column: 64
          }
        }],
        line: 47
      },
      "2": {
        loc: {
          start: {
            line: 57,
            column: 22
          },
          end: {
            line: 57,
            column: 80
          }
        },
        type: "cond-expr",
        locations: [{
          start: {
            line: 57,
            column: 36
          },
          end: {
            line: 57,
            column: 70
          }
        }, {
          start: {
            line: 57,
            column: 71
          },
          end: {
            line: 57,
            column: 80
          }
        }],
        line: 57
      },
      "3": {
        loc: {
          start: {
            line: 59,
            column: 18
          },
          end: {
            line: 59,
            column: 72
          }
        },
        type: "cond-expr",
        locations: [{
          start: {
            line: 59,
            column: 28
          },
          end: {
            line: 59,
            column: 62
          }
        }, {
          start: {
            line: 59,
            column: 63
          },
          end: {
            line: 59,
            column: 72
          }
        }],
        line: 59
      },
      "4": {
        loc: {
          start: {
            line: 75,
            column: 4
          },
          end: {
            line: 88,
            column: 5
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 75,
            column: 4
          },
          end: {
            line: 88,
            column: 5
          }
        }, {
          start: {
            line: 75,
            column: 4
          },
          end: {
            line: 88,
            column: 5
          }
        }],
        line: 75
      }
    },
    s: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0,
      "7": 0,
      "8": 0,
      "9": 0,
      "10": 0,
      "11": 0,
      "12": 0,
      "13": 0,
      "14": 0,
      "15": 0,
      "16": 0,
      "17": 0,
      "18": 0,
      "19": 0,
      "20": 0,
      "21": 0,
      "22": 0,
      "23": 0,
      "24": 0,
      "25": 0,
      "26": 0,
      "27": 0,
      "28": 0,
      "29": 0,
      "30": 0,
      "31": 0
    },
    f: {
      "0": 0
    },
    b: {
      "0": [0, 0],
      "1": [0, 0],
      "2": [0, 0],
      "3": [0, 0],
      "4": [0, 0]
    },
    _coverageSchema: "43e27e138ebf9cfc5966b082cf9a028302ed4184"
  },
      coverage = global[gcv] || (global[gcv] = {});

  if (coverage[path] && coverage[path].hash === hash) {
    return coverage[path];
  }

  coverageData.hash = hash;
  return coverage[path] = coverageData;
}();

const AddDoichainEntrySchema = (cov_1yrk4x5dyk.s[0]++, new SimpleSchema({
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
}));
/**
 * Inserts
 *
 * @param entry
 * @returns {*}
 */

cov_1yrk4x5dyk.s[1]++;

const addDoichainEntry = entry => {
  cov_1yrk4x5dyk.f[0]++;
  cov_1yrk4x5dyk.s[2]++;

  try {
    const ourEntry = (cov_1yrk4x5dyk.s[3]++, entry);
    cov_1yrk4x5dyk.s[4]++;
    logConfirm('adding DoichainEntry on Bob...', ourEntry.name);
    cov_1yrk4x5dyk.s[5]++;
    AddDoichainEntrySchema.validate(ourEntry);
    const ety = (cov_1yrk4x5dyk.s[6]++, DoichainEntries.findOne({
      name: ourEntry.name
    }));
    cov_1yrk4x5dyk.s[7]++;

    if (ety !== undefined) {
      cov_1yrk4x5dyk.b[0][0]++;
      cov_1yrk4x5dyk.s[8]++;
      logSend('returning locally saved entry with _id:' + ety._id);
      cov_1yrk4x5dyk.s[9]++;
      return ety._id;
    } else {
      cov_1yrk4x5dyk.b[0][1]++;
    }

    const value = (cov_1yrk4x5dyk.s[10]++, JSON.parse(ourEntry.value)); //logSend("value:",value);

    cov_1yrk4x5dyk.s[11]++;

    if (value.from === undefined) {
      cov_1yrk4x5dyk.b[1][0]++;
      cov_1yrk4x5dyk.s[12]++;
      throw "Wrong blockchain entry";
    } else {
      cov_1yrk4x5dyk.b[1][1]++;
    } //TODO if from is missing but value is there, it is probably allready handeled correctly anyways this is not so cool as it seems.


    const wif = (cov_1yrk4x5dyk.s[13]++, getWif(CONFIRM_CLIENT, CONFIRM_ADDRESS));
    const privateKey = (cov_1yrk4x5dyk.s[14]++, getPrivateKeyFromWif({
      wif: wif
    }));
    cov_1yrk4x5dyk.s[15]++;
    logSend('got private key (will not show it here)');
    const domain = (cov_1yrk4x5dyk.s[16]++, decryptMessage({
      privateKey: privateKey,
      message: value.from
    }));
    cov_1yrk4x5dyk.s[17]++;
    logSend('decrypted message from domain: ', domain);
    const namePos = (cov_1yrk4x5dyk.s[18]++, ourEntry.name.indexOf('-')); //if this is not a co-registration fetch mail.

    cov_1yrk4x5dyk.s[19]++;
    logSend('namePos:', namePos);
    const masterDoi = (cov_1yrk4x5dyk.s[20]++, namePos != -1 ? (cov_1yrk4x5dyk.b[2][0]++, ourEntry.name.substring(0, namePos)) : (cov_1yrk4x5dyk.b[2][1]++, undefined));
    cov_1yrk4x5dyk.s[21]++;
    logSend('masterDoi:', masterDoi);
    const index = (cov_1yrk4x5dyk.s[22]++, masterDoi ? (cov_1yrk4x5dyk.b[3][0]++, ourEntry.name.substring(namePos + 1)) : (cov_1yrk4x5dyk.b[3][1]++, undefined));
    cov_1yrk4x5dyk.s[23]++;
    logSend('index:', index);
    const id = (cov_1yrk4x5dyk.s[24]++, DoichainEntries.insert({
      name: ourEntry.name,
      value: ourEntry.value,
      address: ourEntry.address,
      masterDoi: masterDoi,
      index: index,
      txId: ourEntry.txId,
      expiresIn: ourEntry.expiresIn,
      expired: ourEntry.expired
    }));
    cov_1yrk4x5dyk.s[25]++;
    logSend('DoichainEntry added on Bob:', {
      id: id,
      name: ourEntry.name,
      masterDoi: masterDoi,
      index: index
    });
    cov_1yrk4x5dyk.s[26]++;

    if (!masterDoi) {
      cov_1yrk4x5dyk.b[4][0]++;
      cov_1yrk4x5dyk.s[27]++;
      addFetchDoiMailDataJob({
        name: ourEntry.name,
        domain: domain
      });
      cov_1yrk4x5dyk.s[28]++;
      logSend('New entry added: \n' + 'NameId=' + ourEntry.name + "\n" + 'Address=' + ourEntry.address + "\n" + 'TxId=' + ourEntry.txId + "\n" + 'Value=' + ourEntry.value);
    } else {
      cov_1yrk4x5dyk.b[4][1]++;
      cov_1yrk4x5dyk.s[29]++;
      logSend('This transaction belongs to co-registration', masterDoi);
    }

    cov_1yrk4x5dyk.s[30]++;
    return id;
  } catch (exception) {
    cov_1yrk4x5dyk.s[31]++;
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

var cov_7069zz8r1 = function () {
  var path = "/home/doichain/dapp/imports/modules/server/doichain/check_new_transactions.js",
      hash = "b176defee76d8bc7707edf6f0c06470565c2737b",
      Function = function () {}.constructor,
      global = new Function('return this')(),
      gcv = "__coverage__",
      coverageData = {
    path: "/home/doichain/dapp/imports/modules/server/doichain/check_new_transactions.js",
    statementMap: {
      "0": {
        start: {
          line: 9,
          column: 22
        },
        end: {
          line: 9,
          column: 26
        }
      },
      "1": {
        start: {
          line: 10,
          column: 31
        },
        end: {
          line: 10,
          column: 49
        }
      },
      "2": {
        start: {
          line: 12,
          column: 28
        },
        end: {
          line: 94,
          column: 1
        }
      },
      "3": {
        start: {
          line: 13,
          column: 2
        },
        end: {
          line: 92,
          column: 3
        }
      },
      "4": {
        start: {
          line: 15,
          column: 6
        },
        end: {
          line: 86,
          column: 7
        }
      },
      "5": {
        start: {
          line: 16,
          column: 10
        },
        end: {
          line: 16,
          column: 159
        }
      },
      "6": {
        start: {
          line: 18,
          column: 10
        },
        end: {
          line: 57,
          column: 11
        }
      },
      "7": {
        start: {
          line: 19,
          column: 37
        },
        end: {
          line: 19,
          column: 80
        }
      },
      "8": {
        start: {
          line: 20,
          column: 14
        },
        end: {
          line: 20,
          column: 91
        }
      },
      "9": {
        start: {
          line: 20,
          column: 49
        },
        end: {
          line: 20,
          column: 91
        }
      },
      "10": {
        start: {
          line: 21,
          column: 14
        },
        end: {
          line: 21,
          column: 62
        }
      },
      "11": {
        start: {
          line: 22,
          column: 26
        },
        end: {
          line: 22,
          column: 74
        }
      },
      "12": {
        start: {
          line: 23,
          column: 14
        },
        end: {
          line: 23,
          column: 77
        }
      },
      "13": {
        start: {
          line: 23,
          column: 70
        },
        end: {
          line: 23,
          column: 77
        }
      },
      "14": {
        start: {
          line: 25,
          column: 26
        },
        end: {
          line: 25,
          column: 42
        }
      },
      "15": {
        start: {
          line: 26,
          column: 14
        },
        end: {
          line: 26,
          column: 47
        }
      },
      "16": {
        start: {
          line: 27,
          column: 14
        },
        end: {
          line: 31,
          column: 15
        }
      },
      "17": {
        start: {
          line: 28,
          column: 18
        },
        end: {
          line: 28,
          column: 131
        }
      },
      "18": {
        start: {
          line: 29,
          column: 18
        },
        end: {
          line: 29,
          column: 90
        }
      },
      "19": {
        start: {
          line: 30,
          column: 18
        },
        end: {
          line: 30,
          column: 25
        }
      },
      "20": {
        start: {
          line: 33,
          column: 14
        },
        end: {
          line: 33,
          column: 47
        }
      },
      "21": {
        start: {
          line: 35,
          column: 33
        },
        end: {
          line: 39,
          column: 15
        }
      },
      "22": {
        start: {
          line: 36,
          column: 18
        },
        end: {
          line: 38,
          column: 62
        }
      },
      "23": {
        start: {
          line: 40,
          column: 14
        },
        end: {
          line: 51,
          column: 17
        }
      },
      "24": {
        start: {
          line: 41,
          column: 18
        },
        end: {
          line: 41,
          column: 39
        }
      },
      "25": {
        start: {
          line: 42,
          column: 31
        },
        end: {
          line: 42,
          column: 80
        }
      },
      "26": {
        start: {
          line: 43,
          column: 18
        },
        end: {
          line: 43,
          column: 92
        }
      },
      "27": {
        start: {
          line: 44,
          column: 30
        },
        end: {
          line: 44,
          column: 62
        }
      },
      "28": {
        start: {
          line: 45,
          column: 18
        },
        end: {
          line: 45,
          column: 52
        }
      },
      "29": {
        start: {
          line: 46,
          column: 18
        },
        end: {
          line: 49,
          column: 19
        }
      },
      "30": {
        start: {
          line: 47,
          column: 22
        },
        end: {
          line: 47,
          column: 109
        }
      },
      "31": {
        start: {
          line: 48,
          column: 22
        },
        end: {
          line: 48,
          column: 29
        }
      },
      "32": {
        start: {
          line: 50,
          column: 18
        },
        end: {
          line: 50,
          column: 62
        }
      },
      "33": {
        start: {
          line: 52,
          column: 14
        },
        end: {
          line: 52,
          column: 86
        }
      },
      "34": {
        start: {
          line: 53,
          column: 14
        },
        end: {
          line: 53,
          column: 86
        }
      },
      "35": {
        start: {
          line: 54,
          column: 14
        },
        end: {
          line: 54,
          column: 25
        }
      },
      "36": {
        start: {
          line: 56,
          column: 14
        },
        end: {
          line: 56,
          column: 91
        }
      },
      "37": {
        start: {
          line: 60,
          column: 10
        },
        end: {
          line: 60,
          column: 98
        }
      },
      "38": {
        start: {
          line: 62,
          column: 22
        },
        end: {
          line: 62,
          column: 61
        }
      },
      "39": {
        start: {
          line: 63,
          column: 22
        },
        end: {
          line: 63,
          column: 30
        }
      },
      "40": {
        start: {
          line: 65,
          column: 10
        },
        end: {
          line: 68,
          column: 11
        }
      },
      "41": {
        start: {
          line: 66,
          column: 14
        },
        end: {
          line: 66,
          column: 105
        }
      },
      "42": {
        start: {
          line: 67,
          column: 14
        },
        end: {
          line: 67,
          column: 21
        }
      },
      "43": {
        start: {
          line: 72,
          column: 29
        },
        end: {
          line: 79,
          column: 11
        }
      },
      "44": {
        start: {
          line: 73,
          column: 14
        },
        end: {
          line: 78,
          column: 70
        }
      },
      "45": {
        start: {
          line: 83,
          column: 10
        },
        end: {
          line: 85,
          column: 13
        }
      },
      "46": {
        start: {
          line: 84,
          column: 14
        },
        end: {
          line: 84,
          column: 113
        }
      },
      "47": {
        start: {
          line: 91,
          column: 4
        },
        end: {
          line: 91,
          column: 81
        }
      },
      "48": {
        start: {
          line: 93,
          column: 2
        },
        end: {
          line: 93,
          column: 14
        }
      },
      "49": {
        start: {
          line: 98,
          column: 19
        },
        end: {
          line: 98,
          column: 55
        }
      },
      "50": {
        start: {
          line: 100,
          column: 4
        },
        end: {
          line: 105,
          column: 7
        }
      }
    },
    fnMap: {
      "0": {
        name: "(anonymous_0)",
        decl: {
          start: {
            line: 12,
            column: 28
          },
          end: {
            line: 12,
            column: 29
          }
        },
        loc: {
          start: {
            line: 12,
            column: 43
          },
          end: {
            line: 94,
            column: 1
          }
        },
        line: 12
      },
      "1": {
        name: "(anonymous_1)",
        decl: {
          start: {
            line: 35,
            column: 44
          },
          end: {
            line: 35,
            column: 45
          }
        },
        loc: {
          start: {
            line: 36,
            column: 18
          },
          end: {
            line: 38,
            column: 62
          }
        },
        line: 36
      },
      "2": {
        name: "(anonymous_2)",
        decl: {
          start: {
            line: 40,
            column: 33
          },
          end: {
            line: 40,
            column: 34
          }
        },
        loc: {
          start: {
            line: 40,
            column: 39
          },
          end: {
            line: 51,
            column: 15
          }
        },
        line: 40
      },
      "3": {
        name: "(anonymous_3)",
        decl: {
          start: {
            line: 72,
            column: 40
          },
          end: {
            line: 72,
            column: 41
          }
        },
        loc: {
          start: {
            line: 73,
            column: 14
          },
          end: {
            line: 78,
            column: 70
          }
        },
        line: 73
      },
      "4": {
        name: "(anonymous_4)",
        decl: {
          start: {
            line: 83,
            column: 29
          },
          end: {
            line: 83,
            column: 30
          }
        },
        loc: {
          start: {
            line: 83,
            column: 35
          },
          end: {
            line: 85,
            column: 11
          }
        },
        line: 83
      },
      "5": {
        name: "addTx",
        decl: {
          start: {
            line: 97,
            column: 9
          },
          end: {
            line: 97,
            column: 14
          }
        },
        loc: {
          start: {
            line: 97,
            column: 43
          },
          end: {
            line: 106,
            column: 1
          }
        },
        line: 97
      }
    },
    branchMap: {
      "0": {
        loc: {
          start: {
            line: 15,
            column: 6
          },
          end: {
            line: 86,
            column: 7
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 15,
            column: 6
          },
          end: {
            line: 86,
            column: 7
          }
        }, {
          start: {
            line: 15,
            column: 6
          },
          end: {
            line: 86,
            column: 7
          }
        }],
        line: 15
      },
      "1": {
        loc: {
          start: {
            line: 20,
            column: 14
          },
          end: {
            line: 20,
            column: 91
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 20,
            column: 14
          },
          end: {
            line: 20,
            column: 91
          }
        }, {
          start: {
            line: 20,
            column: 14
          },
          end: {
            line: 20,
            column: 91
          }
        }],
        line: 20
      },
      "2": {
        loc: {
          start: {
            line: 23,
            column: 14
          },
          end: {
            line: 23,
            column: 77
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 23,
            column: 14
          },
          end: {
            line: 23,
            column: 77
          }
        }, {
          start: {
            line: 23,
            column: 14
          },
          end: {
            line: 23,
            column: 77
          }
        }],
        line: 23
      },
      "3": {
        loc: {
          start: {
            line: 23,
            column: 17
          },
          end: {
            line: 23,
            column: 68
          }
        },
        type: "binary-expr",
        locations: [{
          start: {
            line: 23,
            column: 17
          },
          end: {
            line: 23,
            column: 34
          }
        }, {
          start: {
            line: 23,
            column: 38
          },
          end: {
            line: 23,
            column: 68
          }
        }],
        line: 23
      },
      "4": {
        loc: {
          start: {
            line: 27,
            column: 14
          },
          end: {
            line: 31,
            column: 15
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 27,
            column: 14
          },
          end: {
            line: 31,
            column: 15
          }
        }, {
          start: {
            line: 27,
            column: 14
          },
          end: {
            line: 31,
            column: 15
          }
        }],
        line: 27
      },
      "5": {
        loc: {
          start: {
            line: 27,
            column: 17
          },
          end: {
            line: 27,
            column: 48
          }
        },
        type: "binary-expr",
        locations: [{
          start: {
            line: 27,
            column: 17
          },
          end: {
            line: 27,
            column: 21
          }
        }, {
          start: {
            line: 27,
            column: 25
          },
          end: {
            line: 27,
            column: 29
          }
        }, {
          start: {
            line: 27,
            column: 33
          },
          end: {
            line: 27,
            column: 48
          }
        }],
        line: 27
      },
      "6": {
        loc: {
          start: {
            line: 36,
            column: 18
          },
          end: {
            line: 38,
            column: 62
          }
        },
        type: "binary-expr",
        locations: [{
          start: {
            line: 36,
            column: 18
          },
          end: {
            line: 36,
            column: 48
          }
        }, {
          start: {
            line: 37,
            column: 21
          },
          end: {
            line: 37,
            column: 42
          }
        }, {
          start: {
            line: 38,
            column: 21
          },
          end: {
            line: 38,
            column: 62
          }
        }],
        line: 36
      },
      "7": {
        loc: {
          start: {
            line: 46,
            column: 18
          },
          end: {
            line: 49,
            column: 19
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 46,
            column: 18
          },
          end: {
            line: 49,
            column: 19
          }
        }, {
          start: {
            line: 46,
            column: 18
          },
          end: {
            line: 49,
            column: 19
          }
        }],
        line: 46
      },
      "8": {
        loc: {
          start: {
            line: 65,
            column: 10
          },
          end: {
            line: 68,
            column: 11
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 65,
            column: 10
          },
          end: {
            line: 68,
            column: 11
          }
        }, {
          start: {
            line: 65,
            column: 10
          },
          end: {
            line: 68,
            column: 11
          }
        }],
        line: 65
      },
      "9": {
        loc: {
          start: {
            line: 65,
            column: 13
          },
          end: {
            line: 65,
            column: 44
          }
        },
        type: "binary-expr",
        locations: [{
          start: {
            line: 65,
            column: 13
          },
          end: {
            line: 65,
            column: 17
          }
        }, {
          start: {
            line: 65,
            column: 21
          },
          end: {
            line: 65,
            column: 25
          }
        }, {
          start: {
            line: 65,
            column: 29
          },
          end: {
            line: 65,
            column: 44
          }
        }],
        line: 65
      },
      "10": {
        loc: {
          start: {
            line: 73,
            column: 14
          },
          end: {
            line: 78,
            column: 70
          }
        },
        type: "binary-expr",
        locations: [{
          start: {
            line: 73,
            column: 14
          },
          end: {
            line: 73,
            column: 43
          }
        }, {
          start: {
            line: 74,
            column: 17
          },
          end: {
            line: 74,
            column: 53
          }
        }, {
          start: {
            line: 75,
            column: 17
          },
          end: {
            line: 75,
            column: 57
          }
        }, {
          start: {
            line: 77,
            column: 17
          },
          end: {
            line: 77,
            column: 58
          }
        }, {
          start: {
            line: 78,
            column: 17
          },
          end: {
            line: 78,
            column: 70
          }
        }],
        line: 73
      }
    },
    s: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0,
      "7": 0,
      "8": 0,
      "9": 0,
      "10": 0,
      "11": 0,
      "12": 0,
      "13": 0,
      "14": 0,
      "15": 0,
      "16": 0,
      "17": 0,
      "18": 0,
      "19": 0,
      "20": 0,
      "21": 0,
      "22": 0,
      "23": 0,
      "24": 0,
      "25": 0,
      "26": 0,
      "27": 0,
      "28": 0,
      "29": 0,
      "30": 0,
      "31": 0,
      "32": 0,
      "33": 0,
      "34": 0,
      "35": 0,
      "36": 0,
      "37": 0,
      "38": 0,
      "39": 0,
      "40": 0,
      "41": 0,
      "42": 0,
      "43": 0,
      "44": 0,
      "45": 0,
      "46": 0,
      "47": 0,
      "48": 0,
      "49": 0,
      "50": 0
    },
    f: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0
    },
    b: {
      "0": [0, 0],
      "1": [0, 0],
      "2": [0, 0],
      "3": [0, 0],
      "4": [0, 0],
      "5": [0, 0, 0],
      "6": [0, 0, 0],
      "7": [0, 0],
      "8": [0, 0],
      "9": [0, 0, 0],
      "10": [0, 0, 0, 0, 0]
    },
    _coverageSchema: "43e27e138ebf9cfc5966b082cf9a028302ed4184"
  },
      coverage = global[gcv] || (global[gcv] = {});

  if (coverage[path] && coverage[path].hash === hash) {
    return coverage[path];
  }

  coverageData.hash = hash;
  return coverage[path] = coverageData;
}();

const TX_NAME_START = (cov_7069zz8r1.s[0]++, "e/");
const LAST_CHECKED_BLOCK_KEY = (cov_7069zz8r1.s[1]++, "lastCheckedBlock");
cov_7069zz8r1.s[2]++;

const checkNewTransaction = (txid, job) => {
  cov_7069zz8r1.f[0]++;
  cov_7069zz8r1.s[3]++;

  try {
    cov_7069zz8r1.s[4]++;

    if (!txid) {
      cov_7069zz8r1.b[0][0]++;
      cov_7069zz8r1.s[5]++;
      logConfirm("checkNewTransaction triggered when starting node - checking all confirmed blocks since last check for doichain address", CONFIRM_ADDRESS);
      cov_7069zz8r1.s[6]++;

      try {
        var lastCheckedBlock = (cov_7069zz8r1.s[7]++, Meta.findOne({
          key: LAST_CHECKED_BLOCK_KEY
        }));
        cov_7069zz8r1.s[8]++;

        if (lastCheckedBlock !== undefined) {
          cov_7069zz8r1.b[1][0]++;
          cov_7069zz8r1.s[9]++;
          lastCheckedBlock = lastCheckedBlock.value;
        } else {
          cov_7069zz8r1.b[1][1]++;
        }

        cov_7069zz8r1.s[10]++;
        logConfirm("lastCheckedBlock", lastCheckedBlock);
        const ret = (cov_7069zz8r1.s[11]++, listSinceBlock(CONFIRM_CLIENT, lastCheckedBlock));
        cov_7069zz8r1.s[12]++;

        if ((cov_7069zz8r1.b[3][0]++, ret === undefined) || (cov_7069zz8r1.b[3][1]++, ret.transactions === undefined)) {
          cov_7069zz8r1.b[2][0]++;
          cov_7069zz8r1.s[13]++;
          return;
        } else {
          cov_7069zz8r1.b[2][1]++;
        }

        const txs = (cov_7069zz8r1.s[14]++, ret.transactions);
        cov_7069zz8r1.s[15]++;
        lastCheckedBlock = ret.lastblock;
        cov_7069zz8r1.s[16]++;

        if ((cov_7069zz8r1.b[5][0]++, !ret) || (cov_7069zz8r1.b[5][1]++, !txs) || (cov_7069zz8r1.b[5][2]++, !txs.length === 0)) {
          cov_7069zz8r1.b[4][0]++;
          cov_7069zz8r1.s[17]++;
          logConfirm("transactions do not contain nameOp transaction details or transaction not found.", lastCheckedBlock);
          cov_7069zz8r1.s[18]++;
          addOrUpdateMeta({
            key: LAST_CHECKED_BLOCK_KEY,
            value: lastCheckedBlock
          });
          cov_7069zz8r1.s[19]++;
          return;
        } else {
          cov_7069zz8r1.b[4][1]++;
        }

        cov_7069zz8r1.s[20]++;
        logConfirm("listSinceBlock", ret);
        const addressTxs = (cov_7069zz8r1.s[21]++, txs.filter(tx => {
          cov_7069zz8r1.f[1]++;
          cov_7069zz8r1.s[22]++;
          return (cov_7069zz8r1.b[6][0]++, tx.address === CONFIRM_ADDRESS) && (cov_7069zz8r1.b[6][1]++, tx.name !== undefined) //since name_show cannot be read without confirmations
          && (cov_7069zz8r1.b[6][2]++, tx.name.startsWith("doi: " + TX_NAME_START));
        } //here 'doi: e/xxxx' is already written in the block
        ));
        cov_7069zz8r1.s[23]++;
        addressTxs.forEach(tx => {
          cov_7069zz8r1.f[2]++;
          cov_7069zz8r1.s[24]++;
          logConfirm("tx:", tx);
          var txName = (cov_7069zz8r1.s[25]++, tx.name.substring(("doi: " + TX_NAME_START).length));
          cov_7069zz8r1.s[26]++;
          logConfirm("excuting name_show in order to get value of nameId:", txName);
          const ety = (cov_7069zz8r1.s[27]++, nameShow(CONFIRM_CLIENT, txName));
          cov_7069zz8r1.s[28]++;
          logConfirm("nameShow: value", ety);
          cov_7069zz8r1.s[29]++;

          if (!ety) {
            cov_7069zz8r1.b[7][0]++;
            cov_7069zz8r1.s[30]++;
            logConfirm("couldn't find name - obviously not (yet?!) confirmed in blockchain:", ety);
            cov_7069zz8r1.s[31]++;
            return;
          } else {
            cov_7069zz8r1.b[7][1]++;
          }

          cov_7069zz8r1.s[32]++;
          addTx(txName, ety.value, tx.address, tx.txid); //TODO ety.value.from is maybe NOT existing because of this its  (maybe) ont working...
        });
        cov_7069zz8r1.s[33]++;
        addOrUpdateMeta({
          key: LAST_CHECKED_BLOCK_KEY,
          value: lastCheckedBlock
        });
        cov_7069zz8r1.s[34]++;
        logConfirm("Transactions updated - lastCheckedBlock:", lastCheckedBlock);
        cov_7069zz8r1.s[35]++;
        job.done();
      } catch (exception) {
        cov_7069zz8r1.s[36]++;
        throw new Meteor.Error('namecoin.checkNewTransactions.exception', exception);
      }
    } else {
      cov_7069zz8r1.b[0][1]++;
      cov_7069zz8r1.s[37]++;
      logConfirm("txid: " + txid + " was triggered by walletnotify for address:", CONFIRM_ADDRESS);
      const ret = (cov_7069zz8r1.s[38]++, getRawTransaction(CONFIRM_CLIENT, txid));
      const txs = (cov_7069zz8r1.s[39]++, ret.vout);
      cov_7069zz8r1.s[40]++;

      if ((cov_7069zz8r1.b[9][0]++, !ret) || (cov_7069zz8r1.b[9][1]++, !txs) || (cov_7069zz8r1.b[9][2]++, !txs.length === 0)) {
        cov_7069zz8r1.b[8][0]++;
        cov_7069zz8r1.s[41]++;
        logConfirm("txid " + txid + ' does not contain transaction details or transaction not found.');
        cov_7069zz8r1.s[42]++;
        return;
      } else {
        cov_7069zz8r1.b[8][1]++;
      } // logConfirm('now checking raw transactions with filter:',txs);


      const addressTxs = (cov_7069zz8r1.s[43]++, txs.filter(tx => {
        cov_7069zz8r1.f[3]++;
        cov_7069zz8r1.s[44]++;
        return (cov_7069zz8r1.b[10][0]++, tx.scriptPubKey !== undefined) && (cov_7069zz8r1.b[10][1]++, tx.scriptPubKey.nameOp !== undefined) && (cov_7069zz8r1.b[10][2]++, tx.scriptPubKey.nameOp.op === "name_doi") //  && tx.scriptPubKey.addresses[0] === CONFIRM_ADDRESS //only own transaction should arrive here. - so check on own address unneccesary
        && (cov_7069zz8r1.b[10][3]++, tx.scriptPubKey.nameOp.name !== undefined) && (cov_7069zz8r1.b[10][4]++, tx.scriptPubKey.nameOp.name.startsWith(TX_NAME_START));
      })); //logConfirm("found name_op transactions:", addressTxs);

      cov_7069zz8r1.s[45]++;
      addressTxs.forEach(tx => {
        cov_7069zz8r1.f[4]++;
        cov_7069zz8r1.s[46]++;
        addTx(tx.scriptPubKey.nameOp.name, tx.scriptPubKey.nameOp.value, tx.scriptPubKey.addresses[0], txid);
      });
    }
  } catch (exception) {
    cov_7069zz8r1.s[47]++;
    throw new Meteor.Error('doichain.checkNewTransactions.exception', exception);
  }

  cov_7069zz8r1.s[48]++;
  return true;
};

function addTx(name, value, address, txid) {
  cov_7069zz8r1.f[5]++;
  const txName = (cov_7069zz8r1.s[49]++, name.substring(TX_NAME_START.length));
  cov_7069zz8r1.s[50]++;
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

var cov_1q42bvavrp = function () {
  var path = "/home/doichain/dapp/imports/modules/server/doichain/decrypt_message.js",
      hash = "d2223c84d5c560606efb7b3094a19f262701f092",
      Function = function () {}.constructor,
      global = new Function('return this')(),
      gcv = "__coverage__",
      coverageData = {
    path: "/home/doichain/dapp/imports/modules/server/doichain/decrypt_message.js",
    statementMap: {
      "0": {
        start: {
          line: 6,
          column: 29
        },
        end: {
          line: 13,
          column: 2
        }
      },
      "1": {
        start: {
          line: 15,
          column: 23
        },
        end: {
          line: 27,
          column: 1
        }
      },
      "2": {
        start: {
          line: 16,
          column: 2
        },
        end: {
          line: 26,
          column: 3
        }
      },
      "3": {
        start: {
          line: 17,
          column: 20
        },
        end: {
          line: 17,
          column: 24
        }
      },
      "4": {
        start: {
          line: 18,
          column: 4
        },
        end: {
          line: 18,
          column: 43
        }
      },
      "5": {
        start: {
          line: 19,
          column: 23
        },
        end: {
          line: 19,
          column: 61
        }
      },
      "6": {
        start: {
          line: 20,
          column: 17
        },
        end: {
          line: 20,
          column: 47
        }
      },
      "7": {
        start: {
          line: 21,
          column: 4
        },
        end: {
          line: 21,
          column: 35
        }
      },
      "8": {
        start: {
          line: 22,
          column: 20
        },
        end: {
          line: 22,
          column: 55
        }
      },
      "9": {
        start: {
          line: 23,
          column: 4
        },
        end: {
          line: 23,
          column: 57
        }
      },
      "10": {
        start: {
          line: 25,
          column: 4
        },
        end: {
          line: 25,
          column: 75
        }
      }
    },
    fnMap: {
      "0": {
        name: "(anonymous_0)",
        decl: {
          start: {
            line: 15,
            column: 23
          },
          end: {
            line: 15,
            column: 24
          }
        },
        loc: {
          start: {
            line: 15,
            column: 33
          },
          end: {
            line: 27,
            column: 1
          }
        },
        line: 15
      }
    },
    branchMap: {},
    s: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0,
      "7": 0,
      "8": 0,
      "9": 0,
      "10": 0
    },
    f: {
      "0": 0
    },
    b: {},
    _coverageSchema: "43e27e138ebf9cfc5966b082cf9a028302ed4184"
  },
      coverage = global[gcv] || (global[gcv] = {});

  if (coverage[path] && coverage[path].hash === hash) {
    return coverage[path];
  }

  coverageData.hash = hash;
  return coverage[path] = coverageData;
}();

const DecryptMessageSchema = (cov_1q42bvavrp.s[0]++, new SimpleSchema({
  privateKey: {
    type: String
  },
  message: {
    type: String
  }
}));
cov_1q42bvavrp.s[1]++;

const decryptMessage = data => {
  cov_1q42bvavrp.f[0]++;
  cov_1q42bvavrp.s[2]++;

  try {
    const ourData = (cov_1q42bvavrp.s[3]++, data);
    cov_1q42bvavrp.s[4]++;
    DecryptMessageSchema.validate(ourData);
    const privateKey = (cov_1q42bvavrp.s[5]++, Buffer.from(ourData.privateKey, 'hex'));
    const ecdh = (cov_1q42bvavrp.s[6]++, crypto.createECDH('secp256k1'));
    cov_1q42bvavrp.s[7]++;
    ecdh.setPrivateKey(privateKey);
    const message = (cov_1q42bvavrp.s[8]++, Buffer.from(ourData.message, 'hex'));
    cov_1q42bvavrp.s[9]++;
    return ecies.decrypt(ecdh, message).toString('utf8');
  } catch (exception) {
    cov_1q42bvavrp.s[10]++;
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

var cov_1x1b90xfne = function () {
  var path = "/home/doichain/dapp/imports/modules/server/doichain/encrypt_message.js",
      hash = "89396c5e1c2bd47ca07e976dd7e2efe8926055f1",
      Function = function () {}.constructor,
      global = new Function('return this')(),
      gcv = "__coverage__",
      coverageData = {
    path: "/home/doichain/dapp/imports/modules/server/doichain/encrypt_message.js",
    statementMap: {
      "0": {
        start: {
          line: 5,
          column: 29
        },
        end: {
          line: 12,
          column: 2
        }
      },
      "1": {
        start: {
          line: 14,
          column: 23
        },
        end: {
          line: 24,
          column: 1
        }
      },
      "2": {
        start: {
          line: 15,
          column: 2
        },
        end: {
          line: 23,
          column: 3
        }
      },
      "3": {
        start: {
          line: 16,
          column: 20
        },
        end: {
          line: 16,
          column: 24
        }
      },
      "4": {
        start: {
          line: 17,
          column: 4
        },
        end: {
          line: 17,
          column: 43
        }
      },
      "5": {
        start: {
          line: 18,
          column: 22
        },
        end: {
          line: 18,
          column: 59
        }
      },
      "6": {
        start: {
          line: 19,
          column: 20
        },
        end: {
          line: 19,
          column: 48
        }
      },
      "7": {
        start: {
          line: 20,
          column: 4
        },
        end: {
          line: 20,
          column: 61
        }
      },
      "8": {
        start: {
          line: 22,
          column: 4
        },
        end: {
          line: 22,
          column: 75
        }
      }
    },
    fnMap: {
      "0": {
        name: "(anonymous_0)",
        decl: {
          start: {
            line: 14,
            column: 23
          },
          end: {
            line: 14,
            column: 24
          }
        },
        loc: {
          start: {
            line: 14,
            column: 33
          },
          end: {
            line: 24,
            column: 1
          }
        },
        line: 14
      }
    },
    branchMap: {},
    s: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0,
      "7": 0,
      "8": 0
    },
    f: {
      "0": 0
    },
    b: {},
    _coverageSchema: "43e27e138ebf9cfc5966b082cf9a028302ed4184"
  },
      coverage = global[gcv] || (global[gcv] = {});

  if (coverage[path] && coverage[path].hash === hash) {
    return coverage[path];
  }

  coverageData.hash = hash;
  return coverage[path] = coverageData;
}();

const EncryptMessageSchema = (cov_1x1b90xfne.s[0]++, new SimpleSchema({
  publicKey: {
    type: String
  },
  message: {
    type: String
  }
}));
cov_1x1b90xfne.s[1]++;

const encryptMessage = data => {
  cov_1x1b90xfne.f[0]++;
  cov_1x1b90xfne.s[2]++;

  try {
    const ourData = (cov_1x1b90xfne.s[3]++, data);
    cov_1x1b90xfne.s[4]++;
    EncryptMessageSchema.validate(ourData);
    const publicKey = (cov_1x1b90xfne.s[5]++, Buffer.from(ourData.publicKey, 'hex'));
    const message = (cov_1x1b90xfne.s[6]++, Buffer.from(ourData.message));
    cov_1x1b90xfne.s[7]++;
    return ecies.encrypt(publicKey, message).toString('hex');
  } catch (exception) {
    cov_1x1b90xfne.s[8]++;
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

var cov_c9hyz69c9 = function () {
  var path = "/home/doichain/dapp/imports/modules/server/doichain/generate_name-id.js",
      hash = "d8b0d9b28033d4d3d1dd8d2cf33b118b69c17dca",
      Function = function () {}.constructor,
      global = new Function('return this')(),
      gcv = "__coverage__",
      coverageData = {
    path: "/home/doichain/dapp/imports/modules/server/doichain/generate_name-id.js",
    statementMap: {
      "0": {
        start: {
          line: 7,
          column: 29
        },
        end: {
          line: 19,
          column: 2
        }
      },
      "1": {
        start: {
          line: 21,
          column: 23
        },
        end: {
          line: 41,
          column: 1
        }
      },
      "2": {
        start: {
          line: 22,
          column: 2
        },
        end: {
          line: 40,
          column: 3
        }
      },
      "3": {
        start: {
          line: 23,
          column: 21
        },
        end: {
          line: 23,
          column: 26
        }
      },
      "4": {
        start: {
          line: 24,
          column: 4
        },
        end: {
          line: 24,
          column: 44
        }
      },
      "5": {
        start: {
          line: 26,
          column: 4
        },
        end: {
          line: 33,
          column: 5
        }
      },
      "6": {
        start: {
          line: 27,
          column: 8
        },
        end: {
          line: 27,
          column: 55
        }
      },
      "7": {
        start: {
          line: 28,
          column: 8
        },
        end: {
          line: 28,
          column: 82
        }
      },
      "8": {
        start: {
          line: 31,
          column: 8
        },
        end: {
          line: 31,
          column: 41
        }
      },
      "9": {
        start: {
          line: 32,
          column: 8
        },
        end: {
          line: 32,
          column: 65
        }
      },
      "10": {
        start: {
          line: 35,
          column: 4
        },
        end: {
          line: 35,
          column: 64
        }
      },
      "11": {
        start: {
          line: 37,
          column: 4
        },
        end: {
          line: 37,
          column: 18
        }
      },
      "12": {
        start: {
          line: 39,
          column: 4
        },
        end: {
          line: 39,
          column: 75
        }
      }
    },
    fnMap: {
      "0": {
        name: "(anonymous_0)",
        decl: {
          start: {
            line: 21,
            column: 23
          },
          end: {
            line: 21,
            column: 24
          }
        },
        loc: {
          start: {
            line: 21,
            column: 34
          },
          end: {
            line: 41,
            column: 1
          }
        },
        line: 21
      }
    },
    branchMap: {
      "0": {
        loc: {
          start: {
            line: 26,
            column: 4
          },
          end: {
            line: 33,
            column: 5
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 26,
            column: 4
          },
          end: {
            line: 33,
            column: 5
          }
        }, {
          start: {
            line: 26,
            column: 4
          },
          end: {
            line: 33,
            column: 5
          }
        }],
        line: 26
      }
    },
    s: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0,
      "7": 0,
      "8": 0,
      "9": 0,
      "10": 0,
      "11": 0,
      "12": 0
    },
    f: {
      "0": 0
    },
    b: {
      "0": [0, 0]
    },
    _coverageSchema: "43e27e138ebf9cfc5966b082cf9a028302ed4184"
  },
      coverage = global[gcv] || (global[gcv] = {});

  if (coverage[path] && coverage[path].hash === hash) {
    return coverage[path];
  }

  coverageData.hash = hash;
  return coverage[path] = coverageData;
}();

const GenerateNameIdSchema = (cov_c9hyz69c9.s[0]++, new SimpleSchema({
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
}));
cov_c9hyz69c9.s[1]++;

const generateNameId = optIn => {
  cov_c9hyz69c9.f[0]++;
  cov_c9hyz69c9.s[2]++;

  try {
    const ourOptIn = (cov_c9hyz69c9.s[3]++, optIn);
    cov_c9hyz69c9.s[4]++;
    GenerateNameIdSchema.validate(ourOptIn);
    let nameId;
    cov_c9hyz69c9.s[5]++;

    if (optIn.masterDoi) {
      cov_c9hyz69c9.b[0][0]++;
      cov_c9hyz69c9.s[6]++;
      nameId = ourOptIn.masterDoi + "-" + ourOptIn.index;
      cov_c9hyz69c9.s[7]++;
      logSend("used master_doi as nameId index " + optIn.index + "storage:", nameId);
    } else {
      cov_c9hyz69c9.b[0][1]++;
      cov_c9hyz69c9.s[8]++;
      nameId = getKeyPair().privateKey;
      cov_c9hyz69c9.s[9]++;
      logSend("generated nameId for doichain storage:", nameId);
    }

    cov_c9hyz69c9.s[10]++;
    OptIns.update({
      _id: ourOptIn.id
    }, {
      $set: {
        nameId: nameId
      }
    });
    cov_c9hyz69c9.s[11]++;
    return nameId;
  } catch (exception) {
    cov_c9hyz69c9.s[12]++;
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

var cov_1zfw5cuwnx = function () {
  var path = "/home/doichain/dapp/imports/modules/server/doichain/get_address.js",
      hash = "85c1d936247aeee65a51b746c8dc9235d8a630c6",
      Function = function () {}.constructor,
      global = new Function('return this')(),
      gcv = "__coverage__",
      coverageData = {
    path: "/home/doichain/dapp/imports/modules/server/doichain/get_address.js",
    statementMap: {
      "0": {
        start: {
          line: 8,
          column: 21
        },
        end: {
          line: 8,
          column: 25
        }
      },
      "1": {
        start: {
          line: 9,
          column: 29
        },
        end: {
          line: 9,
          column: 33
        }
      },
      "2": {
        start: {
          line: 10,
          column: 25
        },
        end: {
          line: 14,
          column: 2
        }
      },
      "3": {
        start: {
          line: 16,
          column: 19
        },
        end: {
          line: 24,
          column: 1
        }
      },
      "4": {
        start: {
          line: 17,
          column: 2
        },
        end: {
          line: 23,
          column: 3
        }
      },
      "5": {
        start: {
          line: 18,
          column: 20
        },
        end: {
          line: 18,
          column: 24
        }
      },
      "6": {
        start: {
          line: 19,
          column: 4
        },
        end: {
          line: 19,
          column: 39
        }
      },
      "7": {
        start: {
          line: 20,
          column: 4
        },
        end: {
          line: 20,
          column: 42
        }
      },
      "8": {
        start: {
          line: 22,
          column: 4
        },
        end: {
          line: 22,
          column: 71
        }
      },
      "9": {
        start: {
          line: 27,
          column: 17
        },
        end: {
          line: 27,
          column: 77
        }
      },
      "10": {
        start: {
          line: 28,
          column: 12
        },
        end: {
          line: 28,
          column: 35
        }
      },
      "11": {
        start: {
          line: 29,
          column: 2
        },
        end: {
          line: 29,
          column: 32
        }
      },
      "12": {
        start: {
          line: 30,
          column: 20
        },
        end: {
          line: 30,
          column: 32
        }
      },
      "13": {
        start: {
          line: 31,
          column: 2
        },
        end: {
          line: 31,
          column: 68
        }
      },
      "14": {
        start: {
          line: 31,
          column: 33
        },
        end: {
          line: 31,
          column: 68
        }
      },
      "15": {
        start: {
          line: 32,
          column: 16
        },
        end: {
          line: 32,
          column: 95
        }
      },
      "16": {
        start: {
          line: 33,
          column: 2
        },
        end: {
          line: 33,
          column: 64
        }
      },
      "17": {
        start: {
          line: 34,
          column: 2
        },
        end: {
          line: 34,
          column: 29
        }
      },
      "18": {
        start: {
          line: 35,
          column: 17
        },
        end: {
          line: 35,
          column: 47
        }
      },
      "19": {
        start: {
          line: 36,
          column: 2
        },
        end: {
          line: 36,
          column: 63
        }
      },
      "20": {
        start: {
          line: 37,
          column: 2
        },
        end: {
          line: 37,
          column: 35
        }
      },
      "21": {
        start: {
          line: 38,
          column: 2
        },
        end: {
          line: 38,
          column: 17
        }
      }
    },
    fnMap: {
      "0": {
        name: "(anonymous_0)",
        decl: {
          start: {
            line: 16,
            column: 19
          },
          end: {
            line: 16,
            column: 20
          }
        },
        loc: {
          start: {
            line: 16,
            column: 29
          },
          end: {
            line: 24,
            column: 1
          }
        },
        line: 16
      },
      "1": {
        name: "_getAddress",
        decl: {
          start: {
            line: 26,
            column: 9
          },
          end: {
            line: 26,
            column: 20
          }
        },
        loc: {
          start: {
            line: 26,
            column: 32
          },
          end: {
            line: 39,
            column: 1
          }
        },
        line: 26
      }
    },
    branchMap: {
      "0": {
        loc: {
          start: {
            line: 31,
            column: 2
          },
          end: {
            line: 31,
            column: 68
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 31,
            column: 2
          },
          end: {
            line: 31,
            column: 68
          }
        }, {
          start: {
            line: 31,
            column: 2
          },
          end: {
            line: 31,
            column: 68
          }
        }],
        line: 31
      },
      "1": {
        loc: {
          start: {
            line: 31,
            column: 5
          },
          end: {
            line: 31,
            column: 31
          }
        },
        type: "binary-expr",
        locations: [{
          start: {
            line: 31,
            column: 5
          },
          end: {
            line: 31,
            column: 16
          }
        }, {
          start: {
            line: 31,
            column: 20
          },
          end: {
            line: 31,
            column: 31
          }
        }],
        line: 31
      }
    },
    s: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0,
      "7": 0,
      "8": 0,
      "9": 0,
      "10": 0,
      "11": 0,
      "12": 0,
      "13": 0,
      "14": 0,
      "15": 0,
      "16": 0,
      "17": 0,
      "18": 0,
      "19": 0,
      "20": 0,
      "21": 0
    },
    f: {
      "0": 0,
      "1": 0
    },
    b: {
      "0": [0, 0],
      "1": [0, 0]
    },
    _coverageSchema: "43e27e138ebf9cfc5966b082cf9a028302ed4184"
  },
      coverage = global[gcv] || (global[gcv] = {});

  if (coverage[path] && coverage[path].hash === hash) {
    return coverage[path];
  }

  coverageData.hash = hash;
  return coverage[path] = coverageData;
}();

const VERSION_BYTE = (cov_1zfw5cuwnx.s[0]++, 0x34);
const VERSION_BYTE_REGTEST = (cov_1zfw5cuwnx.s[1]++, 0x6f);
const GetAddressSchema = (cov_1zfw5cuwnx.s[2]++, new SimpleSchema({
  publicKey: {
    type: String
  }
}));
cov_1zfw5cuwnx.s[3]++;

const getAddress = data => {
  cov_1zfw5cuwnx.f[0]++;
  cov_1zfw5cuwnx.s[4]++;

  try {
    const ourData = (cov_1zfw5cuwnx.s[5]++, data);
    cov_1zfw5cuwnx.s[6]++;
    GetAddressSchema.validate(ourData);
    cov_1zfw5cuwnx.s[7]++;
    return _getAddress(ourData.publicKey);
  } catch (exception) {
    cov_1zfw5cuwnx.s[8]++;
    throw new Meteor.Error('doichain.getAddress.exception', exception);
  }
};

function _getAddress(publicKey) {
  cov_1zfw5cuwnx.f[1]++;
  const pubKey = (cov_1zfw5cuwnx.s[9]++, CryptoJS.lib.WordArray.create(Buffer.from(publicKey, 'hex')));
  let key = (cov_1zfw5cuwnx.s[10]++, CryptoJS.SHA256(pubKey));
  cov_1zfw5cuwnx.s[11]++;
  key = CryptoJS.RIPEMD160(key);
  let versionByte = (cov_1zfw5cuwnx.s[12]++, VERSION_BYTE);
  cov_1zfw5cuwnx.s[13]++;

  if ((cov_1zfw5cuwnx.b[1][0]++, isRegtest()) || (cov_1zfw5cuwnx.b[1][1]++, isTestnet())) {
    cov_1zfw5cuwnx.b[0][0]++;
    cov_1zfw5cuwnx.s[14]++;
    versionByte = VERSION_BYTE_REGTEST;
  } else {
    cov_1zfw5cuwnx.b[0][1]++;
  }

  let address = (cov_1zfw5cuwnx.s[15]++, Buffer.concat([Buffer.from([versionByte]), Buffer.from(key.toString(), 'hex')]));
  cov_1zfw5cuwnx.s[16]++;
  key = CryptoJS.SHA256(CryptoJS.lib.WordArray.create(address));
  cov_1zfw5cuwnx.s[17]++;
  key = CryptoJS.SHA256(key);
  let checksum = (cov_1zfw5cuwnx.s[18]++, key.toString().substring(0, 8));
  cov_1zfw5cuwnx.s[19]++;
  address = new Buffer(address.toString('hex') + checksum, 'hex');
  cov_1zfw5cuwnx.s[20]++;
  address = Base58.encode(address);
  cov_1zfw5cuwnx.s[21]++;
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

var cov_118fqjccz3 = function () {
  var path = "/home/doichain/dapp/imports/modules/server/doichain/get_balance.js",
      hash = "17d00ad867d9dc665218454b54869ce859b6fb77",
      Function = function () {}.constructor,
      global = new Function('return this')(),
      gcv = "__coverage__",
      coverageData = {
    path: "/home/doichain/dapp/imports/modules/server/doichain/get_balance.js",
    statementMap: {
      "0": {
        start: {
          line: 6,
          column: 20
        },
        end: {
          line: 16,
          column: 1
        }
      },
      "1": {
        start: {
          line: 8,
          column: 2
        },
        end: {
          line: 14,
          column: 3
        }
      },
      "2": {
        start: {
          line: 9,
          column: 14
        },
        end: {
          line: 9,
          column: 40
        }
      },
      "3": {
        start: {
          line: 10,
          column: 4
        },
        end: {
          line: 10,
          column: 15
        }
      },
      "4": {
        start: {
          line: 13,
          column: 4
        },
        end: {
          line: 13,
          column: 71
        }
      },
      "5": {
        start: {
          line: 15,
          column: 2
        },
        end: {
          line: 15,
          column: 14
        }
      }
    },
    fnMap: {
      "0": {
        name: "(anonymous_0)",
        decl: {
          start: {
            line: 6,
            column: 20
          },
          end: {
            line: 6,
            column: 21
          }
        },
        loc: {
          start: {
            line: 6,
            column: 26
          },
          end: {
            line: 16,
            column: 1
          }
        },
        line: 6
      }
    },
    branchMap: {},
    s: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0
    },
    f: {
      "0": 0
    },
    b: {},
    _coverageSchema: "43e27e138ebf9cfc5966b082cf9a028302ed4184"
  },
      coverage = global[gcv] || (global[gcv] = {});

  if (coverage[path] && coverage[path].hash === hash) {
    return coverage[path];
  }

  coverageData.hash = hash;
  return coverage[path] = coverageData;
}();

cov_118fqjccz3.s[0]++;

const get_Balance = () => {
  cov_118fqjccz3.f[0]++;
  cov_118fqjccz3.s[1]++;

  try {
    const bal = (cov_118fqjccz3.s[2]++, getBalance(CONFIRM_CLIENT));
    cov_118fqjccz3.s[3]++;
    return bal;
  } catch (exception) {
    cov_118fqjccz3.s[4]++;
    throw new Meteor.Error('doichain.getBalance.exception', exception);
  }

  cov_118fqjccz3.s[5]++;
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

var cov_gg6j4uljg = function () {
  var path = "/home/doichain/dapp/imports/modules/server/doichain/get_data-hash.js",
      hash = "682ca416c57c61939ff175cc5a68b7470eadf6e7",
      Function = function () {}.constructor,
      global = new Function('return this')(),
      gcv = "__coverage__",
      coverageData = {
    path: "/home/doichain/dapp/imports/modules/server/doichain/get_data-hash.js",
    statementMap: {
      "0": {
        start: {
          line: 5,
          column: 26
        },
        end: {
          line: 9,
          column: 2
        }
      },
      "1": {
        start: {
          line: 11,
          column: 20
        },
        end: {
          line: 20,
          column: 1
        }
      },
      "2": {
        start: {
          line: 12,
          column: 2
        },
        end: {
          line: 19,
          column: 3
        }
      },
      "3": {
        start: {
          line: 13,
          column: 20
        },
        end: {
          line: 13,
          column: 24
        }
      },
      "4": {
        start: {
          line: 14,
          column: 6
        },
        end: {
          line: 14,
          column: 42
        }
      },
      "5": {
        start: {
          line: 15,
          column: 17
        },
        end: {
          line: 15,
          column: 52
        }
      },
      "6": {
        start: {
          line: 16,
          column: 4
        },
        end: {
          line: 16,
          column: 16
        }
      },
      "7": {
        start: {
          line: 18,
          column: 4
        },
        end: {
          line: 18,
          column: 72
        }
      }
    },
    fnMap: {
      "0": {
        name: "(anonymous_0)",
        decl: {
          start: {
            line: 11,
            column: 20
          },
          end: {
            line: 11,
            column: 21
          }
        },
        loc: {
          start: {
            line: 11,
            column: 30
          },
          end: {
            line: 20,
            column: 1
          }
        },
        line: 11
      }
    },
    branchMap: {},
    s: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0,
      "7": 0
    },
    f: {
      "0": 0
    },
    b: {},
    _coverageSchema: "43e27e138ebf9cfc5966b082cf9a028302ed4184"
  },
      coverage = global[gcv] || (global[gcv] = {});

  if (coverage[path] && coverage[path].hash === hash) {
    return coverage[path];
  }

  coverageData.hash = hash;
  return coverage[path] = coverageData;
}();

const GetDataHashSchema = (cov_gg6j4uljg.s[0]++, new SimpleSchema({
  data: {
    type: String
  }
}));
cov_gg6j4uljg.s[1]++;

const getDataHash = data => {
  cov_gg6j4uljg.f[0]++;
  cov_gg6j4uljg.s[2]++;

  try {
    const ourData = (cov_gg6j4uljg.s[3]++, data);
    cov_gg6j4uljg.s[4]++;
    GetDataHashSchema.validate(ourData);
    const hash = (cov_gg6j4uljg.s[5]++, CryptoJS.SHA256(ourData).toString());
    cov_gg6j4uljg.s[6]++;
    return hash;
  } catch (exception) {
    cov_gg6j4uljg.s[7]++;
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

var cov_2rdh22l5lr = function () {
  var path = "/home/doichain/dapp/imports/modules/server/doichain/get_key-pair.js",
      hash = "57804a7a68cb65bb298e89e861146488758d3d0f",
      Function = function () {}.constructor,
      global = new Function('return this')(),
      gcv = "__coverage__",
      coverageData = {
    path: "/home/doichain/dapp/imports/modules/server/doichain/get_key-pair.js",
    statementMap: {
      "0": {
        start: {
          line: 5,
          column: 19
        },
        end: {
          line: 18,
          column: 1
        }
      },
      "1": {
        start: {
          line: 6,
          column: 2
        },
        end: {
          line: 17,
          column: 3
        }
      },
      "2": {
        start: {
          line: 8,
          column: 4
        },
        end: {
          line: 8,
          column: 78
        }
      },
      "3": {
        start: {
          line: 8,
          column: 8
        },
        end: {
          line: 8,
          column: 33
        }
      },
      "4": {
        start: {
          line: 9,
          column: 23
        },
        end: {
          line: 9,
          column: 30
        }
      },
      "5": {
        start: {
          line: 10,
          column: 22
        },
        end: {
          line: 10,
          column: 59
        }
      },
      "6": {
        start: {
          line: 11,
          column: 4
        },
        end: {
          line: 14,
          column: 5
        }
      },
      "7": {
        start: {
          line: 16,
          column: 4
        },
        end: {
          line: 16,
          column: 71
        }
      }
    },
    fnMap: {
      "0": {
        name: "(anonymous_0)",
        decl: {
          start: {
            line: 5,
            column: 19
          },
          end: {
            line: 5,
            column: 20
          }
        },
        loc: {
          start: {
            line: 5,
            column: 25
          },
          end: {
            line: 18,
            column: 1
          }
        },
        line: 5
      }
    },
    branchMap: {},
    s: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0,
      "7": 0
    },
    f: {
      "0": 0
    },
    b: {},
    _coverageSchema: "43e27e138ebf9cfc5966b082cf9a028302ed4184"
  },
      coverage = global[gcv] || (global[gcv] = {});

  if (coverage[path] && coverage[path].hash === hash) {
    return coverage[path];
  }

  coverageData.hash = hash;
  return coverage[path] = coverageData;
}();

cov_2rdh22l5lr.s[0]++;

const getKeyPair = () => {
  cov_2rdh22l5lr.f[0]++;
  cov_2rdh22l5lr.s[1]++;

  try {
    let privKey;
    cov_2rdh22l5lr.s[2]++;

    do {
      cov_2rdh22l5lr.s[3]++;
      privKey = randomBytes(32);
    } while (!secp256k1.privateKeyVerify(privKey));

    const privateKey = (cov_2rdh22l5lr.s[4]++, privKey);
    const publicKey = (cov_2rdh22l5lr.s[5]++, secp256k1.publicKeyCreate(privateKey));
    cov_2rdh22l5lr.s[6]++;
    return {
      privateKey: privateKey.toString('hex').toUpperCase(),
      publicKey: publicKey.toString('hex').toUpperCase()
    };
  } catch (exception) {
    cov_2rdh22l5lr.s[7]++;
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

var cov_osq6171bx = function () {
  var path = "/home/doichain/dapp/imports/modules/server/doichain/get_private-key_from_wif.js",
      hash = "f5ddf973d03d0f6ad6ec7c940e1eb709d74ac82d",
      Function = function () {}.constructor,
      global = new Function('return this')(),
      gcv = "__coverage__",
      coverageData = {
    path: "/home/doichain/dapp/imports/modules/server/doichain/get_private-key_from_wif.js",
    statementMap: {
      "0": {
        start: {
          line: 5,
          column: 35
        },
        end: {
          line: 9,
          column: 2
        }
      },
      "1": {
        start: {
          line: 11,
          column: 29
        },
        end: {
          line: 19,
          column: 1
        }
      },
      "2": {
        start: {
          line: 12,
          column: 2
        },
        end: {
          line: 18,
          column: 3
        }
      },
      "3": {
        start: {
          line: 13,
          column: 20
        },
        end: {
          line: 13,
          column: 24
        }
      },
      "4": {
        start: {
          line: 14,
          column: 4
        },
        end: {
          line: 14,
          column: 49
        }
      },
      "5": {
        start: {
          line: 15,
          column: 4
        },
        end: {
          line: 15,
          column: 46
        }
      },
      "6": {
        start: {
          line: 17,
          column: 4
        },
        end: {
          line: 17,
          column: 81
        }
      },
      "7": {
        start: {
          line: 22,
          column: 19
        },
        end: {
          line: 22,
          column: 53
        }
      },
      "8": {
        start: {
          line: 23,
          column: 2
        },
        end: {
          line: 23,
          column: 62
        }
      },
      "9": {
        start: {
          line: 24,
          column: 2
        },
        end: {
          line: 26,
          column: 3
        }
      },
      "10": {
        start: {
          line: 25,
          column: 4
        },
        end: {
          line: 25,
          column: 64
        }
      },
      "11": {
        start: {
          line: 27,
          column: 2
        },
        end: {
          line: 27,
          column: 20
        }
      }
    },
    fnMap: {
      "0": {
        name: "(anonymous_0)",
        decl: {
          start: {
            line: 11,
            column: 29
          },
          end: {
            line: 11,
            column: 30
          }
        },
        loc: {
          start: {
            line: 11,
            column: 39
          },
          end: {
            line: 19,
            column: 1
          }
        },
        line: 11
      },
      "1": {
        name: "_getPrivateKeyFromWif",
        decl: {
          start: {
            line: 21,
            column: 9
          },
          end: {
            line: 21,
            column: 30
          }
        },
        loc: {
          start: {
            line: 21,
            column: 36
          },
          end: {
            line: 28,
            column: 1
          }
        },
        line: 21
      }
    },
    branchMap: {
      "0": {
        loc: {
          start: {
            line: 24,
            column: 2
          },
          end: {
            line: 26,
            column: 3
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 24,
            column: 2
          },
          end: {
            line: 26,
            column: 3
          }
        }, {
          start: {
            line: 24,
            column: 2
          },
          end: {
            line: 26,
            column: 3
          }
        }],
        line: 24
      },
      "1": {
        loc: {
          start: {
            line: 24,
            column: 5
          },
          end: {
            line: 24,
            column: 58
          }
        },
        type: "binary-expr",
        locations: [{
          start: {
            line: 24,
            column: 5
          },
          end: {
            line: 24,
            column: 29
          }
        }, {
          start: {
            line: 24,
            column: 33
          },
          end: {
            line: 24,
            column: 58
          }
        }],
        line: 24
      }
    },
    s: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0,
      "7": 0,
      "8": 0,
      "9": 0,
      "10": 0,
      "11": 0
    },
    f: {
      "0": 0,
      "1": 0
    },
    b: {
      "0": [0, 0],
      "1": [0, 0]
    },
    _coverageSchema: "43e27e138ebf9cfc5966b082cf9a028302ed4184"
  },
      coverage = global[gcv] || (global[gcv] = {});

  if (coverage[path] && coverage[path].hash === hash) {
    return coverage[path];
  }

  coverageData.hash = hash;
  return coverage[path] = coverageData;
}();

const GetPrivateKeyFromWifSchema = (cov_osq6171bx.s[0]++, new SimpleSchema({
  wif: {
    type: String
  }
}));
cov_osq6171bx.s[1]++;

const getPrivateKeyFromWif = data => {
  cov_osq6171bx.f[0]++;
  cov_osq6171bx.s[2]++;

  try {
    const ourData = (cov_osq6171bx.s[3]++, data);
    cov_osq6171bx.s[4]++;
    GetPrivateKeyFromWifSchema.validate(ourData);
    cov_osq6171bx.s[5]++;
    return _getPrivateKeyFromWif(ourData.wif);
  } catch (exception) {
    cov_osq6171bx.s[6]++;
    throw new Meteor.Error('doichain.getPrivateKeyFromWif.exception', exception);
  }
};

function _getPrivateKeyFromWif(wif) {
  cov_osq6171bx.f[1]++;
  var privateKey = (cov_osq6171bx.s[7]++, Base58.decode(wif).toString('hex'));
  cov_osq6171bx.s[8]++;
  privateKey = privateKey.substring(2, privateKey.length - 8);
  cov_osq6171bx.s[9]++;

  if ((cov_osq6171bx.b[1][0]++, privateKey.length === 66) && (cov_osq6171bx.b[1][1]++, privateKey.endsWith("01"))) {
    cov_osq6171bx.b[0][0]++;
    cov_osq6171bx.s[10]++;
    privateKey = privateKey.substring(0, privateKey.length - 2);
  } else {
    cov_osq6171bx.b[0][1]++;
  }

  cov_osq6171bx.s[11]++;
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

var cov_292dcdxrxz = function () {
  var path = "/home/doichain/dapp/imports/modules/server/doichain/get_publickey_and_address_by_domain.js",
      hash = "9a316517bc179cd99aa982dbe97fd0e643139c15",
      Function = function () {}.constructor,
      global = new Function('return this')(),
      gcv = "__coverage__",
      coverageData = {
    path: "/home/doichain/dapp/imports/modules/server/doichain/get_publickey_and_address_by_domain.js",
    statementMap: {
      "0": {
        start: {
          line: 8,
          column: 27
        },
        end: {
          line: 12,
          column: 2
        }
      },
      "1": {
        start: {
          line: 14,
          column: 31
        },
        end: {
          line: 28,
          column: 1
        }
      },
      "2": {
        start: {
          line: 16,
          column: 20
        },
        end: {
          line: 16,
          column: 24
        }
      },
      "3": {
        start: {
          line: 17,
          column: 4
        },
        end: {
          line: 17,
          column: 41
        }
      },
      "4": {
        start: {
          line: 19,
          column: 20
        },
        end: {
          line: 19,
          column: 57
        }
      },
      "5": {
        start: {
          line: 20,
          column: 4
        },
        end: {
          line: 24,
          column: 5
        }
      },
      "6": {
        start: {
          line: 21,
          column: 25
        },
        end: {
          line: 21,
          column: 67
        }
      },
      "7": {
        start: {
          line: 22,
          column: 8
        },
        end: {
          line: 22,
          column: 105
        }
      },
      "8": {
        start: {
          line: 23,
          column: 8
        },
        end: {
          line: 23,
          column: 52
        }
      },
      "9": {
        start: {
          line: 25,
          column: 25
        },
        end: {
          line: 25,
          column: 59
        }
      },
      "10": {
        start: {
          line: 26,
          column: 4
        },
        end: {
          line: 26,
          column: 89
        }
      },
      "11": {
        start: {
          line: 27,
          column: 4
        },
        end: {
          line: 27,
          column: 57
        }
      }
    },
    fnMap: {
      "0": {
        name: "(anonymous_0)",
        decl: {
          start: {
            line: 14,
            column: 31
          },
          end: {
            line: 14,
            column: 32
          }
        },
        loc: {
          start: {
            line: 14,
            column: 41
          },
          end: {
            line: 28,
            column: 1
          }
        },
        line: 14
      }
    },
    branchMap: {
      "0": {
        loc: {
          start: {
            line: 20,
            column: 4
          },
          end: {
            line: 24,
            column: 5
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 20,
            column: 4
          },
          end: {
            line: 24,
            column: 5
          }
        }, {
          start: {
            line: 20,
            column: 4
          },
          end: {
            line: 24,
            column: 5
          }
        }],
        line: 20
      }
    },
    s: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0,
      "7": 0,
      "8": 0,
      "9": 0,
      "10": 0,
      "11": 0
    },
    f: {
      "0": 0
    },
    b: {
      "0": [0, 0]
    },
    _coverageSchema: "43e27e138ebf9cfc5966b082cf9a028302ed4184"
  },
      coverage = global[gcv] || (global[gcv] = {});

  if (coverage[path] && coverage[path].hash === hash) {
    return coverage[path];
  }

  coverageData.hash = hash;
  return coverage[path] = coverageData;
}();

const GetPublicKeySchema = (cov_292dcdxrxz.s[0]++, new SimpleSchema({
  domain: {
    type: String
  }
}));
cov_292dcdxrxz.s[1]++;

const getPublicKeyAndAddress = data => {
  cov_292dcdxrxz.f[0]++;
  const ourData = (cov_292dcdxrxz.s[2]++, data);
  cov_292dcdxrxz.s[3]++;
  GetPublicKeySchema.validate(ourData);
  let publicKey = (cov_292dcdxrxz.s[4]++, getOptInKey({
    domain: ourData.domain
  }));
  cov_292dcdxrxz.s[5]++;

  if (!publicKey) {
    cov_292dcdxrxz.b[0][0]++;
    const provider = (cov_292dcdxrxz.s[6]++, getOptInProvider({
      domain: ourData.domain
    }));
    cov_292dcdxrxz.s[7]++;
    logSend("using doichain provider instead of directly configured publicKey:", {
      provider: provider
    });
    cov_292dcdxrxz.s[8]++;
    publicKey = getOptInKey({
      domain: provider
    }); //get public key from provider or fallback if publickey was not set in dns
  } else {
    cov_292dcdxrxz.b[0][1]++;
  }

  const destAddress = (cov_292dcdxrxz.s[9]++, getAddress({
    publicKey: publicKey
  }));
  cov_292dcdxrxz.s[10]++;
  logSend('publicKey and destAddress ', {
    publicKey: publicKey,
    destAddress: destAddress
  });
  cov_292dcdxrxz.s[11]++;
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

var cov_kd165fpoq = function () {
  var path = "/home/doichain/dapp/imports/modules/server/doichain/get_signature.js",
      hash = "ad3a0a27a89953b6807289eb1e3ba70b69b3dad0",
      Function = function () {}.constructor,
      global = new Function('return this')(),
      gcv = "__coverage__",
      coverageData = {
    path: "/home/doichain/dapp/imports/modules/server/doichain/get_signature.js",
    statementMap: {
      "0": {
        start: {
          line: 6,
          column: 27
        },
        end: {
          line: 13,
          column: 2
        }
      },
      "1": {
        start: {
          line: 15,
          column: 21
        },
        end: {
          line: 24,
          column: 1
        }
      },
      "2": {
        start: {
          line: 16,
          column: 2
        },
        end: {
          line: 23,
          column: 3
        }
      },
      "3": {
        start: {
          line: 17,
          column: 20
        },
        end: {
          line: 17,
          column: 24
        }
      },
      "4": {
        start: {
          line: 18,
          column: 4
        },
        end: {
          line: 18,
          column: 41
        }
      },
      "5": {
        start: {
          line: 19,
          column: 22
        },
        end: {
          line: 19,
          column: 95
        }
      },
      "6": {
        start: {
          line: 20,
          column: 4
        },
        end: {
          line: 20,
          column: 21
        }
      },
      "7": {
        start: {
          line: 22,
          column: 4
        },
        end: {
          line: 22,
          column: 73
        }
      }
    },
    fnMap: {
      "0": {
        name: "(anonymous_0)",
        decl: {
          start: {
            line: 15,
            column: 21
          },
          end: {
            line: 15,
            column: 22
          }
        },
        loc: {
          start: {
            line: 15,
            column: 31
          },
          end: {
            line: 24,
            column: 1
          }
        },
        line: 15
      }
    },
    branchMap: {},
    s: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0,
      "7": 0
    },
    f: {
      "0": 0
    },
    b: {},
    _coverageSchema: "43e27e138ebf9cfc5966b082cf9a028302ed4184"
  },
      coverage = global[gcv] || (global[gcv] = {});

  if (coverage[path] && coverage[path].hash === hash) {
    return coverage[path];
  }

  coverageData.hash = hash;
  return coverage[path] = coverageData;
}();

const GetSignatureSchema = (cov_kd165fpoq.s[0]++, new SimpleSchema({
  message: {
    type: String
  },
  privateKey: {
    type: String
  }
}));
cov_kd165fpoq.s[1]++;

const getSignature = data => {
  cov_kd165fpoq.f[0]++;
  cov_kd165fpoq.s[2]++;

  try {
    const ourData = (cov_kd165fpoq.s[3]++, data);
    cov_kd165fpoq.s[4]++;
    GetSignatureSchema.validate(ourData);
    const signature = (cov_kd165fpoq.s[5]++, Message(ourData.message).sign(new bitcore.PrivateKey(ourData.privateKey)));
    cov_kd165fpoq.s[6]++;
    return signature;
  } catch (exception) {
    cov_kd165fpoq.s[7]++;
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

var cov_1zahg4xabo = function () {
  var path = "/home/doichain/dapp/imports/modules/server/doichain/insert.js",
      hash = "7448e4320fdd2944cc831bbc9ab18c2373d8bd37",
      Function = function () {}.constructor,
      global = new Function('return this')(),
      gcv = "__coverage__",
      coverageData = {
    path: "/home/doichain/dapp/imports/modules/server/doichain/insert.js",
    statementMap: {
      "0": {
        start: {
          line: 12,
          column: 21
        },
        end: {
          line: 28,
          column: 2
        }
      },
      "1": {
        start: {
          line: 30,
          column: 15
        },
        end: {
          line: 62,
          column: 1
        }
      },
      "2": {
        start: {
          line: 31,
          column: 18
        },
        end: {
          line: 31,
          column: 22
        }
      },
      "3": {
        start: {
          line: 32,
          column: 2
        },
        end: {
          line: 61,
          column: 3
        }
      },
      "4": {
        start: {
          line: 33,
          column: 4
        },
        end: {
          line: 33,
          column: 35
        }
      },
      "5": {
        start: {
          line: 34,
          column: 4
        },
        end: {
          line: 34,
          column: 38
        }
      },
      "6": {
        start: {
          line: 36,
          column: 32
        },
        end: {
          line: 36,
          column: 79
        }
      },
      "7": {
        start: {
          line: 37,
          column: 17
        },
        end: {
          line: 37,
          column: 94
        }
      },
      "8": {
        start: {
          line: 38,
          column: 4
        },
        end: {
          line: 38,
          column: 78
        }
      },
      "9": {
        start: {
          line: 40,
          column: 22
        },
        end: {
          line: 44,
          column: 6
        }
      },
      "10": {
        start: {
          line: 47,
          column: 4
        },
        end: {
          line: 47,
          column: 120
        }
      },
      "11": {
        start: {
          line: 48,
          column: 21
        },
        end: {
          line: 48,
          column: 73
        }
      },
      "12": {
        start: {
          line: 49,
          column: 4
        },
        end: {
          line: 49,
          column: 93
        }
      },
      "13": {
        start: {
          line: 51,
          column: 4
        },
        end: {
          line: 51,
          column: 146
        }
      },
      "14": {
        start: {
          line: 52,
          column: 22
        },
        end: {
          line: 52,
          column: 102
        }
      },
      "15": {
        start: {
          line: 53,
          column: 4
        },
        end: {
          line: 53,
          column: 65
        }
      },
      "16": {
        start: {
          line: 55,
          column: 4
        },
        end: {
          line: 55,
          column: 70
        }
      },
      "17": {
        start: {
          line: 56,
          column: 4
        },
        end: {
          line: 56,
          column: 93
        }
      },
      "18": {
        start: {
          line: 59,
          column: 6
        },
        end: {
          line: 59,
          column: 97
        }
      },
      "19": {
        start: {
          line: 60,
          column: 4
        },
        end: {
          line: 60,
          column: 67
        }
      }
    },
    fnMap: {
      "0": {
        name: "(anonymous_0)",
        decl: {
          start: {
            line: 30,
            column: 15
          },
          end: {
            line: 30,
            column: 16
          }
        },
        loc: {
          start: {
            line: 30,
            column: 25
          },
          end: {
            line: 62,
            column: 1
          }
        },
        line: 30
      }
    },
    branchMap: {},
    s: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0,
      "7": 0,
      "8": 0,
      "9": 0,
      "10": 0,
      "11": 0,
      "12": 0,
      "13": 0,
      "14": 0,
      "15": 0,
      "16": 0,
      "17": 0,
      "18": 0,
      "19": 0
    },
    f: {
      "0": 0
    },
    b: {},
    _coverageSchema: "43e27e138ebf9cfc5966b082cf9a028302ed4184"
  },
      coverage = global[gcv] || (global[gcv] = {});

  if (coverage[path] && coverage[path].hash === hash) {
    return coverage[path];
  }

  coverageData.hash = hash;
  return coverage[path] = coverageData;
}();

const InsertSchema = (cov_1zahg4xabo.s[0]++, new SimpleSchema({
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
}));
cov_1zahg4xabo.s[1]++;

const insert = data => {
  cov_1zahg4xabo.f[0]++;
  const ourData = (cov_1zahg4xabo.s[2]++, data);
  cov_1zahg4xabo.s[3]++;

  try {
    cov_1zahg4xabo.s[4]++;
    InsertSchema.validate(ourData);
    cov_1zahg4xabo.s[5]++;
    logSend("domain:", ourData.domain);
    const publicKeyAndAddress = (cov_1zahg4xabo.s[6]++, getPublicKeyAndAddress({
      domain: ourData.domain
    }));
    const from = (cov_1zahg4xabo.s[7]++, encryptMessage({
      publicKey: publicKeyAndAddress.publicKey,
      message: getUrl()
    }));
    cov_1zahg4xabo.s[8]++;
    logSend('encrypted url for use ad from in doichain value:', getUrl(), from);
    const nameValue = (cov_1zahg4xabo.s[9]++, JSON.stringify({
      signature: ourData.signature,
      dataHash: ourData.dataHash,
      from: from
    })); //TODO (!) this must be replaced in future by "atomic name trading example" https://wiki.namecoin.info/?title=Atomic_Name-Trading

    cov_1zahg4xabo.s[10]++;
    logBlockchain('sending a fee to bob so he can pay the doi storage (destAddress):', publicKeyAndAddress.destAddress);
    const feeDoiTx = (cov_1zahg4xabo.s[11]++, feeDoi(SEND_CLIENT, publicKeyAndAddress.destAddress));
    cov_1zahg4xabo.s[12]++;
    logBlockchain('fee send txid to destaddress', feeDoiTx, publicKeyAndAddress.destAddress);
    cov_1zahg4xabo.s[13]++;
    logBlockchain('adding data to blockchain via name_doi (nameId,value,destAddress):', ourData.nameId, nameValue, publicKeyAndAddress.destAddress);
    const nameDoiTx = (cov_1zahg4xabo.s[14]++, nameDoi(SEND_CLIENT, ourData.nameId, nameValue, publicKeyAndAddress.destAddress));
    cov_1zahg4xabo.s[15]++;
    logBlockchain('name_doi added blockchain. txid:', nameDoiTx);
    cov_1zahg4xabo.s[16]++;
    OptIns.update({
      nameId: ourData.nameId
    }, {
      $set: {
        txId: nameDoiTx
      }
    });
    cov_1zahg4xabo.s[17]++;
    logBlockchain('updating OptIn locally with:', {
      nameId: ourData.nameId,
      txId: nameDoiTx
    });
  } catch (exception) {
    cov_1zahg4xabo.s[18]++;
    OptIns.update({
      nameId: ourData.nameId
    }, {
      $set: {
        error: JSON.stringify(exception.message)
      }
    });
    cov_1zahg4xabo.s[19]++;
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

var cov_192vj56p1w = function () {
  var path = "/home/doichain/dapp/imports/modules/server/doichain/update.js",
      hash = "14e3d0c3f2a29ba5e360fcdd2dce1a9ed26144ad",
      Function = function () {}.constructor,
      global = new Function('return this')(),
      gcv = "__coverage__",
      coverageData = {
    path: "/home/doichain/dapp/imports/modules/server/doichain/update.js",
    statementMap: {
      "0": {
        start: {
          line: 13,
          column: 21
        },
        end: {
          line: 27,
          column: 2
        }
      },
      "1": {
        start: {
          line: 29,
          column: 15
        },
        end: {
          line: 87,
          column: 1
        }
      },
      "2": {
        start: {
          line: 30,
          column: 2
        },
        end: {
          line: 86,
          column: 3
        }
      },
      "3": {
        start: {
          line: 31,
          column: 20
        },
        end: {
          line: 31,
          column: 24
        }
      },
      "4": {
        start: {
          line: 33,
          column: 4
        },
        end: {
          line: 33,
          column: 35
        }
      },
      "5": {
        start: {
          line: 36,
          column: 22
        },
        end: {
          line: 36,
          column: 61
        }
      },
      "6": {
        start: {
          line: 37,
          column: 4
        },
        end: {
          line: 41,
          column: 5
        }
      },
      "7": {
        start: {
          line: 38,
          column: 8
        },
        end: {
          line: 38,
          column: 19
        }
      },
      "8": {
        start: {
          line: 39,
          column: 8
        },
        end: {
          line: 39,
          column: 77
        }
      },
      "9": {
        start: {
          line: 40,
          column: 8
        },
        end: {
          line: 40,
          column: 15
        }
      },
      "10": {
        start: {
          line: 42,
          column: 28
        },
        end: {
          line: 42,
          column: 73
        }
      },
      "11": {
        start: {
          line: 43,
          column: 4
        },
        end: {
          line: 47,
          column: 5
        }
      },
      "12": {
        start: {
          line: 44,
          column: 8
        },
        end: {
          line: 44,
          column: 19
        }
      },
      "13": {
        start: {
          line: 45,
          column: 8
        },
        end: {
          line: 45,
          column: 103
        }
      },
      "14": {
        start: {
          line: 46,
          column: 8
        },
        end: {
          line: 46,
          column: 15
        }
      },
      "15": {
        start: {
          line: 48,
          column: 4
        },
        end: {
          line: 48,
          column: 83
        }
      },
      "16": {
        start: {
          line: 49,
          column: 16
        },
        end: {
          line: 49,
          column: 55
        }
      },
      "17": {
        start: {
          line: 50,
          column: 23
        },
        end: {
          line: 50,
          column: 55
        }
      },
      "18": {
        start: {
          line: 51,
          column: 4
        },
        end: {
          line: 51,
          column: 129
        }
      },
      "19": {
        start: {
          line: 52,
          column: 27
        },
        end: {
          line: 52,
          column: 97
        }
      },
      "20": {
        start: {
          line: 53,
          column: 4
        },
        end: {
          line: 53,
          column: 55
        }
      },
      "21": {
        start: {
          line: 54,
          column: 16
        },
        end: {
          line: 54,
          column: 81
        }
      },
      "22": {
        start: {
          line: 56,
          column: 4
        },
        end: {
          line: 56,
          column: 91
        }
      },
      "23": {
        start: {
          line: 57,
          column: 22
        },
        end: {
          line: 57,
          column: 82
        }
      },
      "24": {
        start: {
          line: 58,
          column: 4
        },
        end: {
          line: 58,
          column: 47
        }
      },
      "25": {
        start: {
          line: 60,
          column: 23
        },
        end: {
          line: 64,
          column: 5
        }
      },
      "26": {
        start: {
          line: 66,
          column: 4
        },
        end: {
          line: 79,
          column: 5
        }
      },
      "27": {
        start: {
          line: 67,
          column: 21
        },
        end: {
          line: 67,
          column: 81
        }
      },
      "28": {
        start: {
          line: 68,
          column: 8
        },
        end: {
          line: 68,
          column: 52
        }
      },
      "29": {
        start: {
          line: 71,
          column: 8
        },
        end: {
          line: 71,
          column: 146
        }
      },
      "30": {
        start: {
          line: 72,
          column: 8
        },
        end: {
          line: 74,
          column: 9
        }
      },
      "31": {
        start: {
          line: 73,
          column: 12
        },
        end: {
          line: 73,
          column: 104
        }
      },
      "32": {
        start: {
          line: 75,
          column: 8
        },
        end: {
          line: 75,
          column: 71
        }
      },
      "33": {
        start: {
          line: 81,
          column: 21
        },
        end: {
          line: 81,
          column: 48
        }
      },
      "34": {
        start: {
          line: 82,
          column: 4
        },
        end: {
          line: 82,
          column: 142
        }
      },
      "35": {
        start: {
          line: 83,
          column: 4
        },
        end: {
          line: 83,
          column: 15
        }
      },
      "36": {
        start: {
          line: 85,
          column: 4
        },
        end: {
          line: 85,
          column: 67
        }
      },
      "37": {
        start: {
          line: 90,
          column: 4
        },
        end: {
          line: 90,
          column: 65
        }
      },
      "38": {
        start: {
          line: 91,
          column: 4
        },
        end: {
          line: 91,
          column: 17
        }
      },
      "39": {
        start: {
          line: 92,
          column: 4
        },
        end: {
          line: 92,
          column: 51
        }
      },
      "40": {
        start: {
          line: 93,
          column: 4
        },
        end: {
          line: 105,
          column: 6
        }
      },
      "41": {
        start: {
          line: 101,
          column: 12
        },
        end: {
          line: 103,
          column: 13
        }
      },
      "42": {
        start: {
          line: 102,
          column: 16
        },
        end: {
          line: 102,
          column: 62
        }
      }
    },
    fnMap: {
      "0": {
        name: "(anonymous_0)",
        decl: {
          start: {
            line: 29,
            column: 15
          },
          end: {
            line: 29,
            column: 16
          }
        },
        loc: {
          start: {
            line: 29,
            column: 30
          },
          end: {
            line: 87,
            column: 1
          }
        },
        line: 29
      },
      "1": {
        name: "rerun",
        decl: {
          start: {
            line: 89,
            column: 9
          },
          end: {
            line: 89,
            column: 14
          }
        },
        loc: {
          start: {
            line: 89,
            column: 19
          },
          end: {
            line: 106,
            column: 1
          }
        },
        line: 89
      },
      "2": {
        name: "(anonymous_2)",
        decl: {
          start: {
            line: 100,
            column: 8
          },
          end: {
            line: 100,
            column: 9
          }
        },
        loc: {
          start: {
            line: 100,
            column: 31
          },
          end: {
            line: 104,
            column: 9
          }
        },
        line: 100
      }
    },
    branchMap: {
      "0": {
        loc: {
          start: {
            line: 37,
            column: 4
          },
          end: {
            line: 41,
            column: 5
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 37,
            column: 4
          },
          end: {
            line: 41,
            column: 5
          }
        }, {
          start: {
            line: 37,
            column: 4
          },
          end: {
            line: 41,
            column: 5
          }
        }],
        line: 37
      },
      "1": {
        loc: {
          start: {
            line: 43,
            column: 4
          },
          end: {
            line: 47,
            column: 5
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 43,
            column: 4
          },
          end: {
            line: 47,
            column: 5
          }
        }, {
          start: {
            line: 43,
            column: 4
          },
          end: {
            line: 47,
            column: 5
          }
        }],
        line: 43
      },
      "2": {
        loc: {
          start: {
            line: 72,
            column: 8
          },
          end: {
            line: 74,
            column: 9
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 72,
            column: 8
          },
          end: {
            line: 74,
            column: 9
          }
        }, {
          start: {
            line: 72,
            column: 8
          },
          end: {
            line: 74,
            column: 9
          }
        }],
        line: 72
      },
      "3": {
        loc: {
          start: {
            line: 101,
            column: 12
          },
          end: {
            line: 103,
            column: 13
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 101,
            column: 12
          },
          end: {
            line: 103,
            column: 13
          }
        }, {
          start: {
            line: 101,
            column: 12
          },
          end: {
            line: 103,
            column: 13
          }
        }],
        line: 101
      }
    },
    s: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0,
      "7": 0,
      "8": 0,
      "9": 0,
      "10": 0,
      "11": 0,
      "12": 0,
      "13": 0,
      "14": 0,
      "15": 0,
      "16": 0,
      "17": 0,
      "18": 0,
      "19": 0,
      "20": 0,
      "21": 0,
      "22": 0,
      "23": 0,
      "24": 0,
      "25": 0,
      "26": 0,
      "27": 0,
      "28": 0,
      "29": 0,
      "30": 0,
      "31": 0,
      "32": 0,
      "33": 0,
      "34": 0,
      "35": 0,
      "36": 0,
      "37": 0,
      "38": 0,
      "39": 0,
      "40": 0,
      "41": 0,
      "42": 0
    },
    f: {
      "0": 0,
      "1": 0,
      "2": 0
    },
    b: {
      "0": [0, 0],
      "1": [0, 0],
      "2": [0, 0],
      "3": [0, 0]
    },
    _coverageSchema: "43e27e138ebf9cfc5966b082cf9a028302ed4184"
  },
      coverage = global[gcv] || (global[gcv] = {});

  if (coverage[path] && coverage[path].hash === hash) {
    return coverage[path];
  }

  coverageData.hash = hash;
  return coverage[path] = coverageData;
}();

const UpdateSchema = (cov_192vj56p1w.s[0]++, new SimpleSchema({
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
}));
cov_192vj56p1w.s[1]++;

const update = (data, job) => {
  cov_192vj56p1w.f[0]++;
  cov_192vj56p1w.s[2]++;

  try {
    const ourData = (cov_192vj56p1w.s[3]++, data);
    cov_192vj56p1w.s[4]++;
    UpdateSchema.validate(ourData); //stop this update until this name as at least 1 confirmation

    const name_data = (cov_192vj56p1w.s[5]++, nameShow(CONFIRM_CLIENT, ourData.nameId));
    cov_192vj56p1w.s[6]++;

    if (name_data === undefined) {
      cov_192vj56p1w.b[0][0]++;
      cov_192vj56p1w.s[7]++;
      rerun(job);
      cov_192vj56p1w.s[8]++;
      logConfirm('name not visible - delaying name update', ourData.nameId);
      cov_192vj56p1w.s[9]++;
      return;
    } else {
      cov_192vj56p1w.b[0][1]++;
    }

    const our_transaction = (cov_192vj56p1w.s[10]++, getTransaction(CONFIRM_CLIENT, name_data.txid));
    cov_192vj56p1w.s[11]++;

    if (our_transaction.confirmations === 0) {
      cov_192vj56p1w.b[1][0]++;
      cov_192vj56p1w.s[12]++;
      rerun(job);
      cov_192vj56p1w.s[13]++;
      logConfirm('transaction has 0 confirmations - delaying name update', JSON.parse(ourData.value));
      cov_192vj56p1w.s[14]++;
      return;
    } else {
      cov_192vj56p1w.b[1][1]++;
    }

    cov_192vj56p1w.s[15]++;
    logConfirm('updating blockchain with doiSignature:', JSON.parse(ourData.value));
    const wif = (cov_192vj56p1w.s[16]++, getWif(CONFIRM_CLIENT, CONFIRM_ADDRESS));
    const privateKey = (cov_192vj56p1w.s[17]++, getPrivateKeyFromWif({
      wif: wif
    }));
    cov_192vj56p1w.s[18]++;
    logConfirm('got private key (will not show it here) in order to decrypt Send-dApp host url from value:', ourData.fromHostUrl);
    const ourfromHostUrl = (cov_192vj56p1w.s[19]++, decryptMessage({
      privateKey: privateKey,
      message: ourData.fromHostUrl
    }));
    cov_192vj56p1w.s[20]++;
    logConfirm('decrypted fromHostUrl', ourfromHostUrl);
    const url = (cov_192vj56p1w.s[21]++, ourfromHostUrl + API_PATH + VERSION + "/" + DOI_CONFIRMATION_NOTIFY_ROUTE);
    cov_192vj56p1w.s[22]++;
    logConfirm('creating signature with ADDRESS' + CONFIRM_ADDRESS + " nameId:", ourData.value);
    const signature = (cov_192vj56p1w.s[23]++, signMessage(CONFIRM_CLIENT, CONFIRM_ADDRESS, ourData.nameId)); //TODO why here over nameID?

    cov_192vj56p1w.s[24]++;
    logConfirm('signature created:', signature);
    const updateData = (cov_192vj56p1w.s[25]++, {
      nameId: ourData.nameId,
      signature: signature,
      host: ourData.host
    });
    cov_192vj56p1w.s[26]++;

    try {
      const txid = (cov_192vj56p1w.s[27]++, nameDoi(CONFIRM_CLIENT, ourData.nameId, ourData.value, null));
      cov_192vj56p1w.s[28]++;
      logConfirm('update transaction txid:', txid);
    } catch (exception) {
      cov_192vj56p1w.s[29]++; //

      logConfirm('this nameDOI doesn´t have a block yet and will be updated with the next block and with the next queue start:', ourData.nameId);
      cov_192vj56p1w.s[30]++;

      if (exception.toString().indexOf("there is already a registration for this doi name") == -1) {
        cov_192vj56p1w.b[2][0]++;
        cov_192vj56p1w.s[31]++;
        OptIns.update({
          nameId: ourData.nameId
        }, {
          $set: {
            error: JSON.stringify(exception.message)
          }
        });
      } else {
        cov_192vj56p1w.b[2][1]++;
      }

      cov_192vj56p1w.s[32]++;
      throw new Meteor.Error('doichain.update.exception', exception); //}else{
      //    logConfirm('this nameDOI doesn´t have a block yet and will be updated with the next block and with the next queue start:',ourData.nameId);
      //}
    }

    const response = (cov_192vj56p1w.s[33]++, getHttpPUT(url, updateData));
    cov_192vj56p1w.s[34]++;
    logConfirm('informed send dApp about confirmed doi on url:' + url + ' with updateData' + JSON.stringify(updateData) + " response:", response.data);
    cov_192vj56p1w.s[35]++;
    job.done();
  } catch (exception) {
    cov_192vj56p1w.s[36]++;
    throw new Meteor.Error('doichain.update.exception', exception);
  }
};

function rerun(job) {
  cov_192vj56p1w.f[1]++;
  cov_192vj56p1w.s[37]++;
  logConfirm('rerunning txid in 10sec - canceling old job', '');
  cov_192vj56p1w.s[38]++;
  job.cancel();
  cov_192vj56p1w.s[39]++;
  logConfirm('restart blockchain doi update', '');
  cov_192vj56p1w.s[40]++;
  job.restart({//repeats: 600,   // Only repeat this once
    // This is the default
    // wait: 10000   // Wait 10 sec between repeats
    // Default is previous setting
  }, function (err, result) {
    cov_192vj56p1w.f[2]++;
    cov_192vj56p1w.s[41]++;

    if (result) {
      cov_192vj56p1w.b[3][0]++;
      cov_192vj56p1w.s[42]++;
      logConfirm('rerunning txid in 10sec:', result);
    } else {
      cov_192vj56p1w.b[3][1]++;
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

var cov_1lm7xtr7vy = function () {
  var path = "/home/doichain/dapp/imports/modules/server/doichain/verify_signature.js",
      hash = "3242127f74ff5f021bb1cd08c71f86a408f292cf",
      Function = function () {}.constructor,
      global = new Function('return this')(),
      gcv = "__coverage__",
      coverageData = {
    path: "/home/doichain/dapp/imports/modules/server/doichain/verify_signature.js",
    statementMap: {
      "0": {
        start: {
          line: 6,
          column: 16
        },
        end: {
          line: 13,
          column: 2
        }
      },
      "1": {
        start: {
          line: 15,
          column: 30
        },
        end: {
          line: 25,
          column: 2
        }
      },
      "2": {
        start: {
          line: 27,
          column: 24
        },
        end: {
          line: 40,
          column: 1
        }
      },
      "3": {
        start: {
          line: 28,
          column: 2
        },
        end: {
          line: 39,
          column: 3
        }
      },
      "4": {
        start: {
          line: 29,
          column: 20
        },
        end: {
          line: 29,
          column: 24
        }
      },
      "5": {
        start: {
          line: 30,
          column: 4
        },
        end: {
          line: 30,
          column: 42
        }
      },
      "6": {
        start: {
          line: 31,
          column: 4
        },
        end: {
          line: 31,
          column: 44
        }
      },
      "7": {
        start: {
          line: 32,
          column: 20
        },
        end: {
          line: 32,
          column: 100
        }
      },
      "8": {
        start: {
          line: 33,
          column: 4
        },
        end: {
          line: 35,
          column: 37
        }
      },
      "9": {
        start: {
          line: 34,
          column: 6
        },
        end: {
          line: 34,
          column: 70
        }
      },
      "10": {
        start: {
          line: 35,
          column: 21
        },
        end: {
          line: 35,
          column: 36
        }
      },
      "11": {
        start: {
          line: 36,
          column: 4
        },
        end: {
          line: 36,
          column: 17
        }
      },
      "12": {
        start: {
          line: 38,
          column: 4
        },
        end: {
          line: 38,
          column: 76
        }
      }
    },
    fnMap: {
      "0": {
        name: "(anonymous_0)",
        decl: {
          start: {
            line: 27,
            column: 24
          },
          end: {
            line: 27,
            column: 25
          }
        },
        loc: {
          start: {
            line: 27,
            column: 34
          },
          end: {
            line: 40,
            column: 1
          }
        },
        line: 27
      }
    },
    branchMap: {},
    s: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0,
      "7": 0,
      "8": 0,
      "9": 0,
      "10": 0,
      "11": 0,
      "12": 0
    },
    f: {
      "0": 0
    },
    b: {},
    _coverageSchema: "43e27e138ebf9cfc5966b082cf9a028302ed4184"
  },
      coverage = global[gcv] || (global[gcv] = {});

  if (coverage[path] && coverage[path].hash === hash) {
    return coverage[path];
  }

  coverageData.hash = hash;
  return coverage[path] = coverageData;
}();

const NETWORK = (cov_1lm7xtr7vy.s[0]++, bitcore.Networks.add({
  name: 'doichain',
  alias: 'doichain',
  pubkeyhash: 0x34,
  privatekey: 0xB4,
  scripthash: 13,
  networkMagic: 0xf9beb4fe
}));
const VerifySignatureSchema = (cov_1lm7xtr7vy.s[1]++, new SimpleSchema({
  data: {
    type: String
  },
  publicKey: {
    type: String
  },
  signature: {
    type: String
  }
}));
cov_1lm7xtr7vy.s[2]++;

const verifySignature = data => {
  cov_1lm7xtr7vy.f[0]++;
  cov_1lm7xtr7vy.s[3]++;

  try {
    const ourData = (cov_1lm7xtr7vy.s[4]++, data);
    cov_1lm7xtr7vy.s[5]++;
    logVerify('verifySignature:', ourData);
    cov_1lm7xtr7vy.s[6]++;
    VerifySignatureSchema.validate(ourData);
    const address = (cov_1lm7xtr7vy.s[7]++, bitcore.Address.fromPublicKey(new bitcore.PublicKey(ourData.publicKey), NETWORK));
    cov_1lm7xtr7vy.s[8]++;

    try {
      cov_1lm7xtr7vy.s[9]++;
      return Message(ourData.data).verify(address, ourData.signature);
    } catch (error) {
      cov_1lm7xtr7vy.s[10]++;
      logError(error);
    }

    cov_1lm7xtr7vy.s[11]++;
    return false;
  } catch (exception) {
    cov_1lm7xtr7vy.s[12]++;
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

var cov_tbn27m5lc = function () {
  var path = "/home/doichain/dapp/imports/modules/server/doichain/write_to_blockchain.js",
      hash = "3d963b90832ee2275eaacdfe55da60466d4c545c",
      Function = function () {}.constructor,
      global = new Function('return this')(),
      gcv = "__coverage__",
      coverageData = {
    path: "/home/doichain/dapp/imports/modules/server/doichain/write_to_blockchain.js",
    statementMap: {
      "0": {
        start: {
          line: 12,
          column: 32
        },
        end: {
          line: 16,
          column: 2
        }
      },
      "1": {
        start: {
          line: 18,
          column: 26
        },
        end: {
          line: 53,
          column: 1
        }
      },
      "2": {
        start: {
          line: 19,
          column: 2
        },
        end: {
          line: 52,
          column: 3
        }
      },
      "3": {
        start: {
          line: 20,
          column: 20
        },
        end: {
          line: 20,
          column: 24
        }
      },
      "4": {
        start: {
          line: 21,
          column: 4
        },
        end: {
          line: 21,
          column: 46
        }
      },
      "5": {
        start: {
          line: 23,
          column: 18
        },
        end: {
          line: 23,
          column: 48
        }
      },
      "6": {
        start: {
          line: 24,
          column: 22
        },
        end: {
          line: 24,
          column: 64
        }
      },
      "7": {
        start: {
          line: 25,
          column: 19
        },
        end: {
          line: 25,
          column: 55
        }
      },
      "8": {
        start: {
          line: 26,
          column: 4
        },
        end: {
          line: 26,
          column: 97
        }
      },
      "9": {
        start: {
          line: 29,
          column: 19
        },
        end: {
          line: 29,
          column: 93
        }
      },
      "10": {
        start: {
          line: 30,
          column: 22
        },
        end: {
          line: 30,
          column: 109
        }
      },
      "11": {
        start: {
          line: 31,
          column: 4
        },
        end: {
          line: 31,
          column: 78
        }
      },
      "12": {
        start: {
          line: 33,
          column: 19
        },
        end: {
          line: 33,
          column: 21
        }
      },
      "13": {
        start: {
          line: 35,
          column: 4
        },
        end: {
          line: 38,
          column: 5
        }
      },
      "14": {
        start: {
          line: 36,
          column: 6
        },
        end: {
          line: 36,
          column: 49
        }
      },
      "15": {
        start: {
          line: 37,
          column: 6
        },
        end: {
          line: 37,
          column: 62
        }
      },
      "16": {
        start: {
          line: 40,
          column: 18
        },
        end: {
          line: 40,
          column: 44
        }
      },
      "17": {
        start: {
          line: 41,
          column: 19
        },
        end: {
          line: 41,
          column: 40
        }
      },
      "18": {
        start: {
          line: 42,
          column: 4
        },
        end: {
          line: 42,
          column: 61
        }
      },
      "19": {
        start: {
          line: 43,
          column: 4
        },
        end: {
          line: 49,
          column: 6
        }
      },
      "20": {
        start: {
          line: 51,
          column: 4
        },
        end: {
          line: 51,
          column: 78
        }
      }
    },
    fnMap: {
      "0": {
        name: "(anonymous_0)",
        decl: {
          start: {
            line: 18,
            column: 26
          },
          end: {
            line: 18,
            column: 27
          }
        },
        loc: {
          start: {
            line: 18,
            column: 36
          },
          end: {
            line: 53,
            column: 1
          }
        },
        line: 18
      }
    },
    branchMap: {
      "0": {
        loc: {
          start: {
            line: 35,
            column: 4
          },
          end: {
            line: 38,
            column: 5
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 35,
            column: 4
          },
          end: {
            line: 38,
            column: 5
          }
        }, {
          start: {
            line: 35,
            column: 4
          },
          end: {
            line: 38,
            column: 5
          }
        }],
        line: 35
      }
    },
    s: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0,
      "7": 0,
      "8": 0,
      "9": 0,
      "10": 0,
      "11": 0,
      "12": 0,
      "13": 0,
      "14": 0,
      "15": 0,
      "16": 0,
      "17": 0,
      "18": 0,
      "19": 0,
      "20": 0
    },
    f: {
      "0": 0
    },
    b: {
      "0": [0, 0]
    },
    _coverageSchema: "43e27e138ebf9cfc5966b082cf9a028302ed4184"
  },
      coverage = global[gcv] || (global[gcv] = {});

  if (coverage[path] && coverage[path].hash === hash) {
    return coverage[path];
  }

  coverageData.hash = hash;
  return coverage[path] = coverageData;
}();

const WriteToBlockchainSchema = (cov_tbn27m5lc.s[0]++, new SimpleSchema({
  id: {
    type: String
  }
}));
cov_tbn27m5lc.s[1]++;

const writeToBlockchain = data => {
  cov_tbn27m5lc.f[0]++;
  cov_tbn27m5lc.s[2]++;

  try {
    const ourData = (cov_tbn27m5lc.s[3]++, data);
    cov_tbn27m5lc.s[4]++;
    WriteToBlockchainSchema.validate(ourData);
    const optIn = (cov_tbn27m5lc.s[5]++, OptIns.findOne({
      _id: data.id
    }));
    const recipient = (cov_tbn27m5lc.s[6]++, Recipients.findOne({
      _id: optIn.recipient
    }));
    const sender = (cov_tbn27m5lc.s[7]++, Senders.findOne({
      _id: optIn.sender
    }));
    cov_tbn27m5lc.s[8]++;
    logSend("optIn data:", {
      index: ourData.index,
      optIn: optIn,
      recipient: recipient,
      sender: sender
    });
    const nameId = (cov_tbn27m5lc.s[9]++, generateNameId({
      id: data.id,
      index: optIn.index,
      masterDoi: optIn.masterDoi
    }));
    const signature = (cov_tbn27m5lc.s[10]++, getSignature({
      message: recipient.email + sender.email,
      privateKey: recipient.privateKey
    }));
    cov_tbn27m5lc.s[11]++;
    logSend("generated signature from email recipient and sender:", signature);
    let dataHash = (cov_tbn27m5lc.s[12]++, "");
    cov_tbn27m5lc.s[13]++;

    if (optIn.data) {
      cov_tbn27m5lc.b[0][0]++;
      cov_tbn27m5lc.s[14]++;
      dataHash = getDataHash({
        data: optIn.data
      });
      cov_tbn27m5lc.s[15]++;
      logSend("generated datahash from given data:", dataHash);
    } else {
      cov_tbn27m5lc.b[0][1]++;
    }

    const parts = (cov_tbn27m5lc.s[16]++, recipient.email.split("@"));
    const domain = (cov_tbn27m5lc.s[17]++, parts[parts.length - 1]);
    cov_tbn27m5lc.s[18]++;
    logSend("email domain for publicKey request is:", domain);
    cov_tbn27m5lc.s[19]++;
    addInsertBlockchainJob({
      nameId: nameId,
      signature: signature,
      dataHash: dataHash,
      domain: domain,
      soiDate: optIn.createdAt
    });
  } catch (exception) {
    cov_tbn27m5lc.s[20]++;
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

var cov_tiz4r3r4p = function () {
  var path = "/home/doichain/dapp/imports/modules/server/emails/decode_doi-hash.js",
      hash = "1b28c54cf9aa56865f72e1cfdb8e4c482df4c1de",
      Function = function () {}.constructor,
      global = new Function('return this')(),
      gcv = "__coverage__",
      coverageData = {
    path: "/home/doichain/dapp/imports/modules/server/emails/decode_doi-hash.js",
    statementMap: {
      "0": {
        start: {
          line: 5,
          column: 28
        },
        end: {
          line: 9,
          column: 2
        }
      },
      "1": {
        start: {
          line: 11,
          column: 22
        },
        end: {
          line: 24,
          column: 1
        }
      },
      "2": {
        start: {
          line: 12,
          column: 2
        },
        end: {
          line: 23,
          column: 3
        }
      },
      "3": {
        start: {
          line: 13,
          column: 20
        },
        end: {
          line: 13,
          column: 24
        }
      },
      "4": {
        start: {
          line: 14,
          column: 4
        },
        end: {
          line: 14,
          column: 42
        }
      },
      "5": {
        start: {
          line: 15,
          column: 16
        },
        end: {
          line: 15,
          column: 47
        }
      },
      "6": {
        start: {
          line: 16,
          column: 4
        },
        end: {
          line: 16,
          column: 46
        }
      },
      "7": {
        start: {
          line: 16,
          column: 27
        },
        end: {
          line: 16,
          column: 46
        }
      },
      "8": {
        start: {
          line: 17,
          column: 4
        },
        end: {
          line: 20,
          column: 44
        }
      },
      "9": {
        start: {
          line: 18,
          column: 18
        },
        end: {
          line: 18,
          column: 66
        }
      },
      "10": {
        start: {
          line: 19,
          column: 6
        },
        end: {
          line: 19,
          column: 17
        }
      },
      "11": {
        start: {
          line: 20,
          column: 24
        },
        end: {
          line: 20,
          column: 43
        }
      },
      "12": {
        start: {
          line: 22,
          column: 4
        },
        end: {
          line: 22,
          column: 74
        }
      }
    },
    fnMap: {
      "0": {
        name: "(anonymous_0)",
        decl: {
          start: {
            line: 11,
            column: 22
          },
          end: {
            line: 11,
            column: 23
          }
        },
        loc: {
          start: {
            line: 11,
            column: 32
          },
          end: {
            line: 24,
            column: 1
          }
        },
        line: 11
      }
    },
    branchMap: {
      "0": {
        loc: {
          start: {
            line: 16,
            column: 4
          },
          end: {
            line: 16,
            column: 46
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 16,
            column: 4
          },
          end: {
            line: 16,
            column: 46
          }
        }, {
          start: {
            line: 16,
            column: 4
          },
          end: {
            line: 16,
            column: 46
          }
        }],
        line: 16
      },
      "1": {
        loc: {
          start: {
            line: 16,
            column: 7
          },
          end: {
            line: 16,
            column: 25
          }
        },
        type: "binary-expr",
        locations: [{
          start: {
            line: 16,
            column: 7
          },
          end: {
            line: 16,
            column: 11
          }
        }, {
          start: {
            line: 16,
            column: 15
          },
          end: {
            line: 16,
            column: 25
          }
        }],
        line: 16
      }
    },
    s: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0,
      "7": 0,
      "8": 0,
      "9": 0,
      "10": 0,
      "11": 0,
      "12": 0
    },
    f: {
      "0": 0
    },
    b: {
      "0": [0, 0],
      "1": [0, 0]
    },
    _coverageSchema: "43e27e138ebf9cfc5966b082cf9a028302ed4184"
  },
      coverage = global[gcv] || (global[gcv] = {});

  if (coverage[path] && coverage[path].hash === hash) {
    return coverage[path];
  }

  coverageData.hash = hash;
  return coverage[path] = coverageData;
}();

const DecodeDoiHashSchema = (cov_tiz4r3r4p.s[0]++, new SimpleSchema({
  hash: {
    type: String
  }
}));
cov_tiz4r3r4p.s[1]++;

const decodeDoiHash = hash => {
  cov_tiz4r3r4p.f[0]++;
  cov_tiz4r3r4p.s[2]++;

  try {
    const ourHash = (cov_tiz4r3r4p.s[3]++, hash);
    cov_tiz4r3r4p.s[4]++;
    DecodeDoiHashSchema.validate(ourHash);
    const hex = (cov_tiz4r3r4p.s[5]++, HashIds.decodeHex(ourHash.hash));
    cov_tiz4r3r4p.s[6]++;

    if ((cov_tiz4r3r4p.b[1][0]++, !hex) || (cov_tiz4r3r4p.b[1][1]++, hex === '')) {
      cov_tiz4r3r4p.b[0][0]++;
      cov_tiz4r3r4p.s[7]++;
      throw "Wrong hash";
    } else {
      cov_tiz4r3r4p.b[0][1]++;
    }

    cov_tiz4r3r4p.s[8]++;

    try {
      const obj = (cov_tiz4r3r4p.s[9]++, JSON.parse(Buffer(hex, 'hex').toString('ascii')));
      cov_tiz4r3r4p.s[10]++;
      return obj;
    } catch (exception) {
      cov_tiz4r3r4p.s[11]++;
      throw "Wrong hash";
    }
  } catch (exception) {
    cov_tiz4r3r4p.s[12]++;
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

var cov_19nudypehj = function () {
  var path = "/home/doichain/dapp/imports/modules/server/emails/generate_doi-hash.js",
      hash = "151014cfa6a1e0031ba9123a33017bc6b3b9b9ac",
      Function = function () {}.constructor,
      global = new Function('return this')(),
      gcv = "__coverage__",
      coverageData = {
    path: "/home/doichain/dapp/imports/modules/server/emails/generate_doi-hash.js",
    statementMap: {
      "0": {
        start: {
          line: 5,
          column: 30
        },
        end: {
          line: 15,
          column: 2
        }
      },
      "1": {
        start: {
          line: 17,
          column: 24
        },
        end: {
          line: 34,
          column: 1
        }
      },
      "2": {
        start: {
          line: 18,
          column: 2
        },
        end: {
          line: 33,
          column: 3
        }
      },
      "3": {
        start: {
          line: 19,
          column: 21
        },
        end: {
          line: 19,
          column: 26
        }
      },
      "4": {
        start: {
          line: 20,
          column: 4
        },
        end: {
          line: 20,
          column: 45
        }
      },
      "5": {
        start: {
          line: 22,
          column: 17
        },
        end: {
          line: 26,
          column: 6
        }
      },
      "6": {
        start: {
          line: 28,
          column: 16
        },
        end: {
          line: 28,
          column: 44
        }
      },
      "7": {
        start: {
          line: 29,
          column: 17
        },
        end: {
          line: 29,
          column: 39
        }
      },
      "8": {
        start: {
          line: 30,
          column: 4
        },
        end: {
          line: 30,
          column: 16
        }
      },
      "9": {
        start: {
          line: 32,
          column: 4
        },
        end: {
          line: 32,
          column: 76
        }
      }
    },
    fnMap: {
      "0": {
        name: "(anonymous_0)",
        decl: {
          start: {
            line: 17,
            column: 24
          },
          end: {
            line: 17,
            column: 25
          }
        },
        loc: {
          start: {
            line: 17,
            column: 35
          },
          end: {
            line: 34,
            column: 1
          }
        },
        line: 17
      }
    },
    branchMap: {},
    s: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0,
      "7": 0,
      "8": 0,
      "9": 0
    },
    f: {
      "0": 0
    },
    b: {},
    _coverageSchema: "43e27e138ebf9cfc5966b082cf9a028302ed4184"
  },
      coverage = global[gcv] || (global[gcv] = {});

  if (coverage[path] && coverage[path].hash === hash) {
    return coverage[path];
  }

  coverageData.hash = hash;
  return coverage[path] = coverageData;
}();

const GenerateDoiHashSchema = (cov_19nudypehj.s[0]++, new SimpleSchema({
  id: {
    type: String
  },
  token: {
    type: String
  },
  redirect: {
    type: String
  }
}));
cov_19nudypehj.s[1]++;

const generateDoiHash = optIn => {
  cov_19nudypehj.f[0]++;
  cov_19nudypehj.s[2]++;

  try {
    const ourOptIn = (cov_19nudypehj.s[3]++, optIn);
    cov_19nudypehj.s[4]++;
    GenerateDoiHashSchema.validate(ourOptIn);
    const json = (cov_19nudypehj.s[5]++, JSON.stringify({
      id: ourOptIn.id,
      token: ourOptIn.token,
      redirect: ourOptIn.redirect
    }));
    const hex = (cov_19nudypehj.s[6]++, Buffer(json).toString('hex'));
    const hash = (cov_19nudypehj.s[7]++, HashIds.encodeHex(hex));
    cov_19nudypehj.s[8]++;
    return hash;
  } catch (exception) {
    cov_19nudypehj.s[9]++;
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

var cov_1t7s26le7y = function () {
  var path = "/home/doichain/dapp/imports/modules/server/emails/parse_template.js",
      hash = "c18972d1eb5dd0eef19489d03d66b859295f76bb",
      Function = function () {}.constructor,
      global = new Function('return this')(),
      gcv = "__coverage__",
      coverageData = {
    path: "/home/doichain/dapp/imports/modules/server/emails/parse_template.js",
    statementMap: {
      "0": {
        start: {
          line: 5,
          column: 26
        },
        end: {
          line: 5,
          column: 40
        }
      },
      "1": {
        start: {
          line: 6,
          column: 28
        },
        end: {
          line: 14,
          column: 2
        }
      },
      "2": {
        start: {
          line: 16,
          column: 22
        },
        end: {
          line: 36,
          column: 1
        }
      },
      "3": {
        start: {
          line: 17,
          column: 2
        },
        end: {
          line: 35,
          column: 3
        }
      },
      "4": {
        start: {
          line: 18,
          column: 20
        },
        end: {
          line: 18,
          column: 24
        }
      },
      "5": {
        start: {
          line: 21,
          column: 4
        },
        end: {
          line: 21,
          column: 42
        }
      },
      "6": {
        start: {
          line: 22,
          column: 4
        },
        end: {
          line: 22,
          column: 48
        }
      },
      "7": {
        start: {
          line: 25,
          column: 19
        },
        end: {
          line: 25,
          column: 35
        }
      },
      "8": {
        start: {
          line: 28,
          column: 4
        },
        end: {
          line: 31,
          column: 21
        }
      },
      "9": {
        start: {
          line: 29,
          column: 6
        },
        end: {
          line: 29,
          column: 48
        }
      },
      "10": {
        start: {
          line: 30,
          column: 6
        },
        end: {
          line: 30,
          column: 91
        }
      },
      "11": {
        start: {
          line: 30,
          column: 17
        },
        end: {
          line: 30,
          column: 91
        }
      },
      "12": {
        start: {
          line: 32,
          column: 4
        },
        end: {
          line: 32,
          column: 20
        }
      },
      "13": {
        start: {
          line: 34,
          column: 4
        },
        end: {
          line: 34,
          column: 72
        }
      },
      "14": {
        start: {
          line: 39,
          column: 12
        },
        end: {
          line: 39,
          column: 19
        }
      },
      "15": {
        start: {
          line: 40,
          column: 2
        },
        end: {
          line: 40,
          column: 37
        }
      },
      "16": {
        start: {
          line: 40,
          column: 28
        },
        end: {
          line: 40,
          column: 37
        }
      },
      "17": {
        start: {
          line: 41,
          column: 2
        },
        end: {
          line: 41,
          column: 99
        }
      }
    },
    fnMap: {
      "0": {
        name: "(anonymous_0)",
        decl: {
          start: {
            line: 16,
            column: 22
          },
          end: {
            line: 16,
            column: 23
          }
        },
        loc: {
          start: {
            line: 16,
            column: 32
          },
          end: {
            line: 36,
            column: 1
          }
        },
        line: 16
      },
      "1": {
        name: "_replacePlaceholder",
        decl: {
          start: {
            line: 38,
            column: 9
          },
          end: {
            line: 38,
            column: 28
          }
        },
        loc: {
          start: {
            line: 38,
            column: 56
          },
          end: {
            line: 42,
            column: 1
          }
        },
        line: 38
      }
    },
    branchMap: {
      "0": {
        loc: {
          start: {
            line: 30,
            column: 6
          },
          end: {
            line: 30,
            column: 91
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 30,
            column: 6
          },
          end: {
            line: 30,
            column: 91
          }
        }, {
          start: {
            line: 30,
            column: 6
          },
          end: {
            line: 30,
            column: 91
          }
        }],
        line: 30
      },
      "1": {
        loc: {
          start: {
            line: 40,
            column: 2
          },
          end: {
            line: 40,
            column: 37
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 40,
            column: 2
          },
          end: {
            line: 40,
            column: 37
          }
        }, {
          start: {
            line: 40,
            column: 2
          },
          end: {
            line: 40,
            column: 37
          }
        }],
        line: 40
      }
    },
    s: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0,
      "7": 0,
      "8": 0,
      "9": 0,
      "10": 0,
      "11": 0,
      "12": 0,
      "13": 0,
      "14": 0,
      "15": 0,
      "16": 0,
      "17": 0
    },
    f: {
      "0": 0,
      "1": 0
    },
    b: {
      "0": [0, 0],
      "1": [0, 0]
    },
    _coverageSchema: "43e27e138ebf9cfc5966b082cf9a028302ed4184"
  },
      coverage = global[gcv] || (global[gcv] = {});

  if (coverage[path] && coverage[path].hash === hash) {
    return coverage[path];
  }

  coverageData.hash = hash;
  return coverage[path] = coverageData;
}();

const PLACEHOLDER_REGEX = (cov_1t7s26le7y.s[0]++, /\${([\w]*)}/g);
const ParseTemplateSchema = (cov_1t7s26le7y.s[1]++, new SimpleSchema({
  template: {
    type: String
  },
  data: {
    type: Object,
    blackbox: true
  }
}));
cov_1t7s26le7y.s[2]++;

const parseTemplate = data => {
  cov_1t7s26le7y.f[0]++;
  cov_1t7s26le7y.s[3]++;

  try {
    const ourData = (cov_1t7s26le7y.s[4]++, data); //logConfirm('parseTemplate:',ourData);

    cov_1t7s26le7y.s[5]++;
    ParseTemplateSchema.validate(ourData);
    cov_1t7s26le7y.s[6]++;
    logConfirm('ParseTemplateSchema validated');

    var _match;

    var template = (cov_1t7s26le7y.s[7]++, ourData.template); //logConfirm('doing some regex with template:',template);

    cov_1t7s26le7y.s[8]++;

    do {
      cov_1t7s26le7y.s[9]++;
      _match = PLACEHOLDER_REGEX.exec(template);
      cov_1t7s26le7y.s[10]++;

      if (_match) {
        cov_1t7s26le7y.b[0][0]++;
        cov_1t7s26le7y.s[11]++;
        template = _replacePlaceholder(template, _match, ourData.data[_match[1]]);
      } else {
        cov_1t7s26le7y.b[0][1]++;
      }
    } while (_match);

    cov_1t7s26le7y.s[12]++;
    return template;
  } catch (exception) {
    cov_1t7s26le7y.s[13]++;
    throw new Meteor.Error('emails.parseTemplate.exception', exception);
  }
};

function _replacePlaceholder(template, _match, replace) {
  cov_1t7s26le7y.f[1]++;
  var rep = (cov_1t7s26le7y.s[14]++, replace);
  cov_1t7s26le7y.s[15]++;

  if (replace === undefined) {
    cov_1t7s26le7y.b[1][0]++;
    cov_1t7s26le7y.s[16]++;
    rep = "";
  } else {
    cov_1t7s26le7y.b[1][1]++;
  }

  cov_1t7s26le7y.s[17]++;
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

var cov_2doaemk07i = function () {
  var path = "/home/doichain/dapp/imports/modules/server/emails/send.js",
      hash = "a0098ab2d6e2ce2a6b69f1faa5b9ac7413ac4177",
      Function = function () {}.constructor,
      global = new Function('return this')(),
      gcv = "__coverage__",
      coverageData = {
    path: "/home/doichain/dapp/imports/modules/server/emails/send.js",
    statementMap: {
      "0": {
        start: {
          line: 6,
          column: 23
        },
        end: {
          line: 25,
          column: 2
        }
      },
      "1": {
        start: {
          line: 27,
          column: 17
        },
        end: {
          line: 49,
          column: 1
        }
      },
      "2": {
        start: {
          line: 28,
          column: 2
        },
        end: {
          line: 48,
          column: 3
        }
      },
      "3": {
        start: {
          line: 30,
          column: 4
        },
        end: {
          line: 30,
          column: 44
        }
      },
      "4": {
        start: {
          line: 32,
          column: 20
        },
        end: {
          line: 32,
          column: 24
        }
      },
      "5": {
        start: {
          line: 33,
          column: 4
        },
        end: {
          line: 33,
          column: 78
        }
      },
      "6": {
        start: {
          line: 34,
          column: 4
        },
        end: {
          line: 34,
          column: 37
        }
      },
      "7": {
        start: {
          line: 36,
          column: 4
        },
        end: {
          line: 44,
          column: 7
        }
      },
      "8": {
        start: {
          line: 47,
          column: 4
        },
        end: {
          line: 47,
          column: 63
        }
      }
    },
    fnMap: {
      "0": {
        name: "(anonymous_0)",
        decl: {
          start: {
            line: 27,
            column: 17
          },
          end: {
            line: 27,
            column: 18
          }
        },
        loc: {
          start: {
            line: 27,
            column: 27
          },
          end: {
            line: 49,
            column: 1
          }
        },
        line: 27
      }
    },
    branchMap: {},
    s: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0,
      "7": 0,
      "8": 0
    },
    f: {
      "0": 0
    },
    b: {},
    _coverageSchema: "43e27e138ebf9cfc5966b082cf9a028302ed4184"
  },
      coverage = global[gcv] || (global[gcv] = {});

  if (coverage[path] && coverage[path].hash === hash) {
    return coverage[path];
  }

  coverageData.hash = hash;
  return coverage[path] = coverageData;
}();

const SendMailSchema = (cov_2doaemk07i.s[0]++, new SimpleSchema({
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
}));
cov_2doaemk07i.s[1]++;

const sendMail = mail => {
  cov_2doaemk07i.f[0]++;
  cov_2doaemk07i.s[2]++;

  try {
    cov_2doaemk07i.s[3]++;
    mail.from = DOI_MAIL_DEFAULT_EMAIL_FROM;
    const ourMail = (cov_2doaemk07i.s[4]++, mail);
    cov_2doaemk07i.s[5]++;
    logConfirm('sending email with data:', {
      to: mail.to,
      subject: mail.subject
    });
    cov_2doaemk07i.s[6]++;
    SendMailSchema.validate(ourMail); //TODO: Text fallback

    cov_2doaemk07i.s[7]++;
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
    cov_2doaemk07i.s[8]++;
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

var cov_25vpeafmo9 = function () {
  var path = "/home/doichain/dapp/imports/modules/server/jobs/add_check_new_transactions.js",
      hash = "b6890adb9e412cad6652ab7e61e6f3d64d8b3f91",
      Function = function () {}.constructor,
      global = new Function('return this')(),
      gcv = "__coverage__",
      coverageData = {
    path: "/home/doichain/dapp/imports/modules/server/jobs/add_check_new_transactions.js",
    statementMap: {
      "0": {
        start: {
          line: 5,
          column: 45
        },
        end: {
          line: 12,
          column: 1
        }
      },
      "1": {
        start: {
          line: 6,
          column: 2
        },
        end: {
          line: 11,
          column: 3
        }
      },
      "2": {
        start: {
          line: 7,
          column: 16
        },
        end: {
          line: 7,
          column: 66
        }
      },
      "3": {
        start: {
          line: 8,
          column: 4
        },
        end: {
          line: 8,
          column: 73
        }
      },
      "4": {
        start: {
          line: 10,
          column: 4
        },
        end: {
          line: 10,
          column: 90
        }
      }
    },
    fnMap: {
      "0": {
        name: "(anonymous_0)",
        decl: {
          start: {
            line: 5,
            column: 45
          },
          end: {
            line: 5,
            column: 46
          }
        },
        loc: {
          start: {
            line: 5,
            column: 51
          },
          end: {
            line: 12,
            column: 1
          }
        },
        line: 5
      }
    },
    branchMap: {},
    s: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0
    },
    f: {
      "0": 0
    },
    b: {},
    _coverageSchema: "43e27e138ebf9cfc5966b082cf9a028302ed4184"
  },
      coverage = global[gcv] || (global[gcv] = {});

  if (coverage[path] && coverage[path].hash === hash) {
    return coverage[path];
  }

  coverageData.hash = hash;
  return coverage[path] = coverageData;
}();

cov_25vpeafmo9.s[0]++;

const addCheckNewTransactionsBlockchainJob = () => {
  cov_25vpeafmo9.f[0]++;
  cov_25vpeafmo9.s[1]++;

  try {
    const job = (cov_25vpeafmo9.s[2]++, new Job(BlockchainJobs, 'checkNewTransaction', {}));
    cov_25vpeafmo9.s[3]++;
    job.retry({
      retries: 60,
      wait: 15 * 1000
    }).save({
      cancelRepeats: true
    });
  } catch (exception) {
    cov_25vpeafmo9.s[4]++;
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

var cov_4awzl1wxe = function () {
  var path = "/home/doichain/dapp/imports/modules/server/jobs/add_fetch-doi-mail-data.js",
      hash = "2476206fe5f2b351fbbdcfa6204a70901fe53a26",
      Function = function () {}.constructor,
      global = new Function('return this')(),
      gcv = "__coverage__",
      coverageData = {
    path: "/home/doichain/dapp/imports/modules/server/jobs/add_fetch-doi-mail-data.js",
    statementMap: {
      "0": {
        start: {
          line: 6,
          column: 37
        },
        end: {
          line: 13,
          column: 2
        }
      },
      "1": {
        start: {
          line: 15,
          column: 31
        },
        end: {
          line: 24,
          column: 1
        }
      },
      "2": {
        start: {
          line: 16,
          column: 2
        },
        end: {
          line: 23,
          column: 3
        }
      },
      "3": {
        start: {
          line: 17,
          column: 20
        },
        end: {
          line: 17,
          column: 24
        }
      },
      "4": {
        start: {
          line: 18,
          column: 4
        },
        end: {
          line: 18,
          column: 51
        }
      },
      "5": {
        start: {
          line: 19,
          column: 16
        },
        end: {
          line: 19,
          column: 62
        }
      },
      "6": {
        start: {
          line: 20,
          column: 4
        },
        end: {
          line: 20,
          column: 53
        }
      },
      "7": {
        start: {
          line: 22,
          column: 4
        },
        end: {
          line: 22,
          column: 76
        }
      }
    },
    fnMap: {
      "0": {
        name: "(anonymous_0)",
        decl: {
          start: {
            line: 15,
            column: 31
          },
          end: {
            line: 15,
            column: 32
          }
        },
        loc: {
          start: {
            line: 15,
            column: 41
          },
          end: {
            line: 24,
            column: 1
          }
        },
        line: 15
      }
    },
    branchMap: {},
    s: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0,
      "7": 0
    },
    f: {
      "0": 0
    },
    b: {},
    _coverageSchema: "43e27e138ebf9cfc5966b082cf9a028302ed4184"
  },
      coverage = global[gcv] || (global[gcv] = {});

  if (coverage[path] && coverage[path].hash === hash) {
    return coverage[path];
  }

  coverageData.hash = hash;
  return coverage[path] = coverageData;
}();

const AddFetchDoiMailDataJobSchema = (cov_4awzl1wxe.s[0]++, new SimpleSchema({
  name: {
    type: String
  },
  domain: {
    type: String
  }
}));
cov_4awzl1wxe.s[1]++;

const addFetchDoiMailDataJob = data => {
  cov_4awzl1wxe.f[0]++;
  cov_4awzl1wxe.s[2]++;

  try {
    const ourData = (cov_4awzl1wxe.s[3]++, data);
    cov_4awzl1wxe.s[4]++;
    AddFetchDoiMailDataJobSchema.validate(ourData);
    const job = (cov_4awzl1wxe.s[5]++, new Job(DAppJobs, 'fetchDoiMailData', ourData));
    cov_4awzl1wxe.s[6]++;
    job.retry({
      retries: 5,
      wait: 1 * 10 * 1000
    }).save(); //check every 10 secs 5 times
  } catch (exception) {
    cov_4awzl1wxe.s[7]++;
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

var cov_24rsyebnjh = function () {
  var path = "/home/doichain/dapp/imports/modules/server/jobs/add_insert_blockchain.js",
      hash = "9cdc66b2d360db22d77248e8e1cd95e4f4865caa",
      Function = function () {}.constructor,
      global = new Function('return this')(),
      gcv = "__coverage__",
      coverageData = {
    path: "/home/doichain/dapp/imports/modules/server/jobs/add_insert_blockchain.js",
    statementMap: {
      "0": {
        start: {
          line: 6,
          column: 37
        },
        end: {
          line: 23,
          column: 2
        }
      },
      "1": {
        start: {
          line: 25,
          column: 31
        },
        end: {
          line: 34,
          column: 1
        }
      },
      "2": {
        start: {
          line: 26,
          column: 2
        },
        end: {
          line: 33,
          column: 3
        }
      },
      "3": {
        start: {
          line: 27,
          column: 21
        },
        end: {
          line: 27,
          column: 26
        }
      },
      "4": {
        start: {
          line: 28,
          column: 4
        },
        end: {
          line: 28,
          column: 52
        }
      },
      "5": {
        start: {
          line: 29,
          column: 16
        },
        end: {
          line: 29,
          column: 59
        }
      },
      "6": {
        start: {
          line: 30,
          column: 4
        },
        end: {
          line: 30,
          column: 54
        }
      },
      "7": {
        start: {
          line: 32,
          column: 4
        },
        end: {
          line: 32,
          column: 76
        }
      }
    },
    fnMap: {
      "0": {
        name: "(anonymous_0)",
        decl: {
          start: {
            line: 25,
            column: 31
          },
          end: {
            line: 25,
            column: 32
          }
        },
        loc: {
          start: {
            line: 25,
            column: 42
          },
          end: {
            line: 34,
            column: 1
          }
        },
        line: 25
      }
    },
    branchMap: {},
    s: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0,
      "7": 0
    },
    f: {
      "0": 0
    },
    b: {},
    _coverageSchema: "43e27e138ebf9cfc5966b082cf9a028302ed4184"
  },
      coverage = global[gcv] || (global[gcv] = {});

  if (coverage[path] && coverage[path].hash === hash) {
    return coverage[path];
  }

  coverageData.hash = hash;
  return coverage[path] = coverageData;
}();

const AddInsertBlockchainJobSchema = (cov_24rsyebnjh.s[0]++, new SimpleSchema({
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
}));
cov_24rsyebnjh.s[1]++;

const addInsertBlockchainJob = entry => {
  cov_24rsyebnjh.f[0]++;
  cov_24rsyebnjh.s[2]++;

  try {
    const ourEntry = (cov_24rsyebnjh.s[3]++, entry);
    cov_24rsyebnjh.s[4]++;
    AddInsertBlockchainJobSchema.validate(ourEntry);
    const job = (cov_24rsyebnjh.s[5]++, new Job(BlockchainJobs, 'insert', ourEntry));
    cov_24rsyebnjh.s[6]++;
    job.retry({
      retries: 10,
      wait: 3 * 60 * 1000
    }).save(); //check every 10sec for 1h
  } catch (exception) {
    cov_24rsyebnjh.s[7]++;
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

var cov_2nmvsol1lu = function () {
  var path = "/home/doichain/dapp/imports/modules/server/jobs/add_send_mail.js",
      hash = "4819fc0921215b1ec237a936be0b35a87b428d95",
      Function = function () {}.constructor,
      global = new Function('return this')(),
      gcv = "__coverage__",
      coverageData = {
    path: "/home/doichain/dapp/imports/modules/server/jobs/add_send_mail.js",
    statementMap: {
      "0": {
        start: {
          line: 6,
          column: 29
        },
        end: {
          line: 25,
          column: 2
        }
      },
      "1": {
        start: {
          line: 27,
          column: 23
        },
        end: {
          line: 36,
          column: 1
        }
      },
      "2": {
        start: {
          line: 28,
          column: 2
        },
        end: {
          line: 35,
          column: 3
        }
      },
      "3": {
        start: {
          line: 29,
          column: 20
        },
        end: {
          line: 29,
          column: 24
        }
      },
      "4": {
        start: {
          line: 30,
          column: 4
        },
        end: {
          line: 30,
          column: 43
        }
      },
      "5": {
        start: {
          line: 31,
          column: 16
        },
        end: {
          line: 31,
          column: 50
        }
      },
      "6": {
        start: {
          line: 32,
          column: 4
        },
        end: {
          line: 32,
          column: 51
        }
      },
      "7": {
        start: {
          line: 34,
          column: 4
        },
        end: {
          line: 34,
          column: 68
        }
      }
    },
    fnMap: {
      "0": {
        name: "(anonymous_0)",
        decl: {
          start: {
            line: 27,
            column: 23
          },
          end: {
            line: 27,
            column: 24
          }
        },
        loc: {
          start: {
            line: 27,
            column: 33
          },
          end: {
            line: 36,
            column: 1
          }
        },
        line: 27
      }
    },
    branchMap: {},
    s: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0,
      "7": 0
    },
    f: {
      "0": 0
    },
    b: {},
    _coverageSchema: "43e27e138ebf9cfc5966b082cf9a028302ed4184"
  },
      coverage = global[gcv] || (global[gcv] = {});

  if (coverage[path] && coverage[path].hash === hash) {
    return coverage[path];
  }

  coverageData.hash = hash;
  return coverage[path] = coverageData;
}();

const AddSendMailJobSchema = (cov_2nmvsol1lu.s[0]++, new SimpleSchema({
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
}));
cov_2nmvsol1lu.s[1]++;

const addSendMailJob = mail => {
  cov_2nmvsol1lu.f[0]++;
  cov_2nmvsol1lu.s[2]++;

  try {
    const ourMail = (cov_2nmvsol1lu.s[3]++, mail);
    cov_2nmvsol1lu.s[4]++;
    AddSendMailJobSchema.validate(ourMail);
    const job = (cov_2nmvsol1lu.s[5]++, new Job(MailJobs, 'send', ourMail));
    cov_2nmvsol1lu.s[6]++;
    job.retry({
      retries: 5,
      wait: 60 * 1000
    }).save();
  } catch (exception) {
    cov_2nmvsol1lu.s[7]++;
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

var cov_161wrrpzx0 = function () {
  var path = "/home/doichain/dapp/imports/modules/server/jobs/add_update_blockchain.js",
      hash = "34004df4538f1966ad401bdeaebee9813a869e2d",
      Function = function () {}.constructor,
      global = new Function('return this')(),
      gcv = "__coverage__",
      coverageData = {
    path: "/home/doichain/dapp/imports/modules/server/jobs/add_update_blockchain.js",
    statementMap: {
      "0": {
        start: {
          line: 6,
          column: 37
        },
        end: {
          line: 19,
          column: 2
        }
      },
      "1": {
        start: {
          line: 21,
          column: 31
        },
        end: {
          line: 30,
          column: 1
        }
      },
      "2": {
        start: {
          line: 22,
          column: 2
        },
        end: {
          line: 29,
          column: 3
        }
      },
      "3": {
        start: {
          line: 23,
          column: 21
        },
        end: {
          line: 23,
          column: 26
        }
      },
      "4": {
        start: {
          line: 24,
          column: 4
        },
        end: {
          line: 24,
          column: 52
        }
      },
      "5": {
        start: {
          line: 25,
          column: 16
        },
        end: {
          line: 25,
          column: 59
        }
      },
      "6": {
        start: {
          line: 26,
          column: 4
        },
        end: {
          line: 26,
          column: 55
        }
      },
      "7": {
        start: {
          line: 28,
          column: 4
        },
        end: {
          line: 28,
          column: 76
        }
      }
    },
    fnMap: {
      "0": {
        name: "(anonymous_0)",
        decl: {
          start: {
            line: 21,
            column: 31
          },
          end: {
            line: 21,
            column: 32
          }
        },
        loc: {
          start: {
            line: 21,
            column: 42
          },
          end: {
            line: 30,
            column: 1
          }
        },
        line: 21
      }
    },
    branchMap: {},
    s: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0,
      "7": 0
    },
    f: {
      "0": 0
    },
    b: {},
    _coverageSchema: "43e27e138ebf9cfc5966b082cf9a028302ed4184"
  },
      coverage = global[gcv] || (global[gcv] = {});

  if (coverage[path] && coverage[path].hash === hash) {
    return coverage[path];
  }

  coverageData.hash = hash;
  return coverage[path] = coverageData;
}();

const AddUpdateBlockchainJobSchema = (cov_161wrrpzx0.s[0]++, new SimpleSchema({
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
}));
cov_161wrrpzx0.s[1]++;

const addUpdateBlockchainJob = entry => {
  cov_161wrrpzx0.f[0]++;
  cov_161wrrpzx0.s[2]++;

  try {
    const ourEntry = (cov_161wrrpzx0.s[3]++, entry);
    cov_161wrrpzx0.s[4]++;
    AddUpdateBlockchainJobSchema.validate(ourEntry);
    const job = (cov_161wrrpzx0.s[5]++, new Job(BlockchainJobs, 'update', ourEntry));
    cov_161wrrpzx0.s[6]++;
    job.retry({
      retries: 360,
      wait: 1 * 10 * 1000
    }).save();
  } catch (exception) {
    cov_161wrrpzx0.s[7]++;
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

var cov_2mbmc6gcqy = function () {
  var path = "/home/doichain/dapp/imports/modules/server/languages/get.js",
      hash = "59dbaa22ecd8b07748c381ecb0e66a692949b076",
      Function = function () {}.constructor,
      global = new Function('return this')(),
      gcv = "__coverage__",
      coverageData = {
    path: "/home/doichain/dapp/imports/modules/server/languages/get.js",
    statementMap: {
      "0": {
        start: {
          line: 7,
          column: 21
        },
        end: {
          line: 13,
          column: 1
        }
      },
      "1": {
        start: {
          line: 8,
          column: 2
        },
        end: {
          line: 12,
          column: 3
        }
      },
      "2": {
        start: {
          line: 9,
          column: 4
        },
        end: {
          line: 9,
          column: 31
        }
      },
      "3": {
        start: {
          line: 11,
          column: 4
        },
        end: {
          line: 11,
          column: 65
        }
      }
    },
    fnMap: {
      "0": {
        name: "(anonymous_0)",
        decl: {
          start: {
            line: 7,
            column: 21
          },
          end: {
            line: 7,
            column: 22
          }
        },
        loc: {
          start: {
            line: 7,
            column: 27
          },
          end: {
            line: 13,
            column: 1
          }
        },
        line: 7
      }
    },
    branchMap: {},
    s: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0
    },
    f: {
      "0": 0
    },
    b: {},
    _coverageSchema: "43e27e138ebf9cfc5966b082cf9a028302ed4184"
  },
      coverage = global[gcv] || (global[gcv] = {});

  if (coverage[path] && coverage[path].hash === hash) {
    return coverage[path];
  }

  coverageData.hash = hash;
  return coverage[path] = coverageData;
}();

// universe:i18n only bundles the default language on the client side.
// To get a list of all avialble languages with at least one translation,
// i18n.getLanguages() must be called server side.
cov_2mbmc6gcqy.s[0]++;

const getLanguages = () => {
  cov_2mbmc6gcqy.f[0]++;
  cov_2mbmc6gcqy.s[1]++;

  try {
    cov_2mbmc6gcqy.s[2]++;
    return i18n.getLanguages();
  } catch (exception) {
    cov_2mbmc6gcqy.s[3]++;
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

var cov_2a1rblabi = function () {
  var path = "/home/doichain/dapp/imports/modules/server/meta/addOrUpdate.js",
      hash = "77bde4672be1c5842d641a1ce9630e6bfcd999c3",
      Function = function () {}.constructor,
      global = new Function('return this')(),
      gcv = "__coverage__",
      coverageData = {
    path: "/home/doichain/dapp/imports/modules/server/meta/addOrUpdate.js",
    statementMap: {
      "0": {
        start: {
          line: 5,
          column: 30
        },
        end: {
          line: 12,
          column: 2
        }
      },
      "1": {
        start: {
          line: 14,
          column: 24
        },
        end: {
          line: 29,
          column: 1
        }
      },
      "2": {
        start: {
          line: 15,
          column: 2
        },
        end: {
          line: 28,
          column: 3
        }
      },
      "3": {
        start: {
          line: 16,
          column: 20
        },
        end: {
          line: 16,
          column: 24
        }
      },
      "4": {
        start: {
          line: 17,
          column: 4
        },
        end: {
          line: 17,
          column: 44
        }
      },
      "5": {
        start: {
          line: 18,
          column: 17
        },
        end: {
          line: 18,
          column: 49
        }
      },
      "6": {
        start: {
          line: 19,
          column: 4
        },
        end: {
          line: 25,
          column: 6
        }
      },
      "7": {
        start: {
          line: 19,
          column: 27
        },
        end: {
          line: 21,
          column: 8
        }
      },
      "8": {
        start: {
          line: 22,
          column: 9
        },
        end: {
          line: 25,
          column: 6
        }
      },
      "9": {
        start: {
          line: 27,
          column: 4
        },
        end: {
          line: 27,
          column: 68
        }
      }
    },
    fnMap: {
      "0": {
        name: "(anonymous_0)",
        decl: {
          start: {
            line: 14,
            column: 24
          },
          end: {
            line: 14,
            column: 25
          }
        },
        loc: {
          start: {
            line: 14,
            column: 34
          },
          end: {
            line: 29,
            column: 1
          }
        },
        line: 14
      }
    },
    branchMap: {
      "0": {
        loc: {
          start: {
            line: 19,
            column: 4
          },
          end: {
            line: 25,
            column: 6
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 19,
            column: 4
          },
          end: {
            line: 25,
            column: 6
          }
        }, {
          start: {
            line: 19,
            column: 4
          },
          end: {
            line: 25,
            column: 6
          }
        }],
        line: 19
      }
    },
    s: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0,
      "7": 0,
      "8": 0,
      "9": 0
    },
    f: {
      "0": 0
    },
    b: {
      "0": [0, 0]
    },
    _coverageSchema: "43e27e138ebf9cfc5966b082cf9a028302ed4184"
  },
      coverage = global[gcv] || (global[gcv] = {});

  if (coverage[path] && coverage[path].hash === hash) {
    return coverage[path];
  }

  coverageData.hash = hash;
  return coverage[path] = coverageData;
}();

const AddOrUpdateMetaSchema = (cov_2a1rblabi.s[0]++, new SimpleSchema({
  key: {
    type: String
  },
  value: {
    type: String
  }
}));
cov_2a1rblabi.s[1]++;

const addOrUpdateMeta = data => {
  cov_2a1rblabi.f[0]++;
  cov_2a1rblabi.s[2]++;

  try {
    const ourData = (cov_2a1rblabi.s[3]++, data);
    cov_2a1rblabi.s[4]++;
    AddOrUpdateMetaSchema.validate(ourData);
    const meta = (cov_2a1rblabi.s[5]++, Meta.findOne({
      key: ourData.key
    }));
    cov_2a1rblabi.s[6]++;

    if (meta !== undefined) {
      cov_2a1rblabi.b[0][0]++;
      cov_2a1rblabi.s[7]++;
      Meta.update({
        _id: meta._id
      }, {
        $set: {
          value: ourData.value
        }
      });
    } else {
      cov_2a1rblabi.b[0][1]++;
      cov_2a1rblabi.s[8]++;
      return Meta.insert({
        key: ourData.key,
        value: ourData.value
      });
    }
  } catch (exception) {
    cov_2a1rblabi.s[9]++;
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

var cov_fwp1lhfgb = function () {
  var path = "/home/doichain/dapp/imports/modules/server/opt-ins/add.js",
      hash = "b9d3ff304c87c782e23870ededc05a387cdee50d",
      Function = function () {}.constructor,
      global = new Function('return this')(),
      gcv = "__coverage__",
      coverageData = {
    path: "/home/doichain/dapp/imports/modules/server/opt-ins/add.js",
    statementMap: {
      "0": {
        start: {
          line: 5,
          column: 23
        },
        end: {
          line: 9,
          column: 2
        }
      },
      "1": {
        start: {
          line: 11,
          column: 17
        },
        end: {
          line: 24,
          column: 1
        }
      },
      "2": {
        start: {
          line: 12,
          column: 2
        },
        end: {
          line: 23,
          column: 3
        }
      },
      "3": {
        start: {
          line: 13,
          column: 21
        },
        end: {
          line: 13,
          column: 26
        }
      },
      "4": {
        start: {
          line: 14,
          column: 4
        },
        end: {
          line: 14,
          column: 38
        }
      },
      "5": {
        start: {
          line: 15,
          column: 19
        },
        end: {
          line: 15,
          column: 63
        }
      },
      "6": {
        start: {
          line: 16,
          column: 4
        },
        end: {
          line: 16,
          column: 47
        }
      },
      "7": {
        start: {
          line: 16,
          column: 26
        },
        end: {
          line: 16,
          column: 47
        }
      },
      "8": {
        start: {
          line: 17,
          column: 20
        },
        end: {
          line: 19,
          column: 6
        }
      },
      "9": {
        start: {
          line: 20,
          column: 4
        },
        end: {
          line: 20,
          column: 19
        }
      },
      "10": {
        start: {
          line: 22,
          column: 4
        },
        end: {
          line: 22,
          column: 63
        }
      }
    },
    fnMap: {
      "0": {
        name: "(anonymous_0)",
        decl: {
          start: {
            line: 11,
            column: 17
          },
          end: {
            line: 11,
            column: 18
          }
        },
        loc: {
          start: {
            line: 11,
            column: 28
          },
          end: {
            line: 24,
            column: 1
          }
        },
        line: 11
      }
    },
    branchMap: {
      "0": {
        loc: {
          start: {
            line: 16,
            column: 4
          },
          end: {
            line: 16,
            column: 47
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 16,
            column: 4
          },
          end: {
            line: 16,
            column: 47
          }
        }, {
          start: {
            line: 16,
            column: 4
          },
          end: {
            line: 16,
            column: 47
          }
        }],
        line: 16
      }
    },
    s: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0,
      "7": 0,
      "8": 0,
      "9": 0,
      "10": 0
    },
    f: {
      "0": 0
    },
    b: {
      "0": [0, 0]
    },
    _coverageSchema: "43e27e138ebf9cfc5966b082cf9a028302ed4184"
  },
      coverage = global[gcv] || (global[gcv] = {});

  if (coverage[path] && coverage[path].hash === hash) {
    return coverage[path];
  }

  coverageData.hash = hash;
  return coverage[path] = coverageData;
}();

const AddOptInSchema = (cov_fwp1lhfgb.s[0]++, new SimpleSchema({
  name: {
    type: String
  }
}));
cov_fwp1lhfgb.s[1]++;

const addOptIn = optIn => {
  cov_fwp1lhfgb.f[0]++;
  cov_fwp1lhfgb.s[2]++;

  try {
    const ourOptIn = (cov_fwp1lhfgb.s[3]++, optIn);
    cov_fwp1lhfgb.s[4]++;
    AddOptInSchema.validate(ourOptIn);
    const optIns = (cov_fwp1lhfgb.s[5]++, OptIns.find({
      nameId: ourOptIn.name
    }).fetch());
    cov_fwp1lhfgb.s[6]++;

    if (optIns.length > 0) {
      cov_fwp1lhfgb.b[0][0]++;
      cov_fwp1lhfgb.s[7]++;
      return optIns[0]._id;
    } else {
      cov_fwp1lhfgb.b[0][1]++;
    }

    const optInId = (cov_fwp1lhfgb.s[8]++, OptIns.insert({
      nameId: ourOptIn.name
    }));
    cov_fwp1lhfgb.s[9]++;
    return optInId;
  } catch (exception) {
    cov_fwp1lhfgb.s[10]++;
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

var cov_ecahrzcem = function () {
  var path = "/home/doichain/dapp/imports/modules/server/opt-ins/add_and_write_to_blockchain.js",
      hash = "5983482bb10da7ab50271e703cb49c86acada997",
      Function = function () {}.constructor,
      global = new Function('return this')(),
      gcv = "__coverage__",
      coverageData = {
    path: "/home/doichain/dapp/imports/modules/server/opt-ins/add_and_write_to_blockchain.js",
    statementMap: {
      "0": {
        start: {
          line: 10,
          column: 23
        },
        end: {
          line: 35,
          column: 2
        }
      },
      "1": {
        start: {
          line: 37,
          column: 17
        },
        end: {
          line: 78,
          column: 1
        }
      },
      "2": {
        start: {
          line: 38,
          column: 2
        },
        end: {
          line: 77,
          column: 3
        }
      },
      "3": {
        start: {
          line: 39,
          column: 21
        },
        end: {
          line: 39,
          column: 26
        }
      },
      "4": {
        start: {
          line: 40,
          column: 4
        },
        end: {
          line: 40,
          column: 38
        }
      },
      "5": {
        start: {
          line: 42,
          column: 22
        },
        end: {
          line: 44,
          column: 5
        }
      },
      "6": {
        start: {
          line: 45,
          column: 24
        },
        end: {
          line: 45,
          column: 47
        }
      },
      "7": {
        start: {
          line: 46,
          column: 19
        },
        end: {
          line: 48,
          column: 5
        }
      },
      "8": {
        start: {
          line: 49,
          column: 21
        },
        end: {
          line: 49,
          column: 38
        }
      },
      "9": {
        start: {
          line: 51,
          column: 19
        },
        end: {
          line: 51,
          column: 82
        }
      },
      "10": {
        start: {
          line: 52,
          column: 4
        },
        end: {
          line: 52,
          column: 47
        }
      },
      "11": {
        start: {
          line: 52,
          column: 26
        },
        end: {
          line: 52,
          column: 47
        }
      },
      "12": {
        start: {
          line: 54,
          column: 4
        },
        end: {
          line: 61,
          column: 5
        }
      },
      "13": {
        start: {
          line: 55,
          column: 6
        },
        end: {
          line: 60,
          column: 7
        }
      },
      "14": {
        start: {
          line: 56,
          column: 8
        },
        end: {
          line: 56,
          column: 34
        }
      },
      "15": {
        start: {
          line: 58,
          column: 8
        },
        end: {
          line: 58,
          column: 49
        }
      },
      "16": {
        start: {
          line: 59,
          column: 8
        },
        end: {
          line: 59,
          column: 35
        }
      },
      "17": {
        start: {
          line: 63,
          column: 20
        },
        end: {
          line: 70,
          column: 6
        }
      },
      "18": {
        start: {
          line: 71,
          column: 4
        },
        end: {
          line: 71,
          column: 86
        }
      },
      "19": {
        start: {
          line: 73,
          column: 4
        },
        end: {
          line: 73,
          column: 37
        }
      },
      "20": {
        start: {
          line: 74,
          column: 4
        },
        end: {
          line: 74,
          column: 19
        }
      },
      "21": {
        start: {
          line: 76,
          column: 4
        },
        end: {
          line: 76,
          column: 83
        }
      }
    },
    fnMap: {
      "0": {
        name: "(anonymous_0)",
        decl: {
          start: {
            line: 37,
            column: 17
          },
          end: {
            line: 37,
            column: 18
          }
        },
        loc: {
          start: {
            line: 37,
            column: 28
          },
          end: {
            line: 78,
            column: 1
          }
        },
        line: 37
      }
    },
    branchMap: {
      "0": {
        loc: {
          start: {
            line: 52,
            column: 4
          },
          end: {
            line: 52,
            column: 47
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 52,
            column: 4
          },
          end: {
            line: 52,
            column: 47
          }
        }, {
          start: {
            line: 52,
            column: 4
          },
          end: {
            line: 52,
            column: 47
          }
        }],
        line: 52
      },
      "1": {
        loc: {
          start: {
            line: 54,
            column: 4
          },
          end: {
            line: 61,
            column: 5
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 54,
            column: 4
          },
          end: {
            line: 61,
            column: 5
          }
        }, {
          start: {
            line: 54,
            column: 4
          },
          end: {
            line: 61,
            column: 5
          }
        }],
        line: 54
      }
    },
    s: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0,
      "7": 0,
      "8": 0,
      "9": 0,
      "10": 0,
      "11": 0,
      "12": 0,
      "13": 0,
      "14": 0,
      "15": 0,
      "16": 0,
      "17": 0,
      "18": 0,
      "19": 0,
      "20": 0,
      "21": 0
    },
    f: {
      "0": 0
    },
    b: {
      "0": [0, 0],
      "1": [0, 0]
    },
    _coverageSchema: "43e27e138ebf9cfc5966b082cf9a028302ed4184"
  },
      coverage = global[gcv] || (global[gcv] = {});

  if (coverage[path] && coverage[path].hash === hash) {
    return coverage[path];
  }

  coverageData.hash = hash;
  return coverage[path] = coverageData;
}();

const AddOptInSchema = (cov_ecahrzcem.s[0]++, new SimpleSchema({
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
}));
cov_ecahrzcem.s[1]++;

const addOptIn = optIn => {
  cov_ecahrzcem.f[0]++;
  cov_ecahrzcem.s[2]++;

  try {
    const ourOptIn = (cov_ecahrzcem.s[3]++, optIn);
    cov_ecahrzcem.s[4]++;
    AddOptInSchema.validate(ourOptIn);
    const recipient = (cov_ecahrzcem.s[5]++, {
      email: ourOptIn.recipient_mail
    });
    const recipientId = (cov_ecahrzcem.s[6]++, addRecipient(recipient));
    const sender = (cov_ecahrzcem.s[7]++, {
      email: ourOptIn.sender_mail
    });
    const senderId = (cov_ecahrzcem.s[8]++, addSender(sender));
    const optIns = (cov_ecahrzcem.s[9]++, OptIns.find({
      recipient: recipientId,
      sender: senderId
    }).fetch());
    cov_ecahrzcem.s[10]++;

    if (optIns.length > 0) {
      cov_ecahrzcem.b[0][0]++;
      cov_ecahrzcem.s[11]++;
      return optIns[0]._id;
    } else {
      cov_ecahrzcem.b[0][1]++;
    } //TODO when SOI already exists resend email?


    cov_ecahrzcem.s[12]++;

    if (ourOptIn.data !== undefined) {
      cov_ecahrzcem.b[1][0]++;
      cov_ecahrzcem.s[13]++;

      try {
        cov_ecahrzcem.s[14]++;
        JSON.parse(ourOptIn.data);
      } catch (error) {
        cov_ecahrzcem.s[15]++;
        logError("ourOptIn.data:", ourOptIn.data);
        cov_ecahrzcem.s[16]++;
        throw "Invalid data json ";
      }
    } else {
      cov_ecahrzcem.b[1][1]++;
    }

    const optInId = (cov_ecahrzcem.s[17]++, OptIns.insert({
      recipient: recipientId,
      sender: senderId,
      index: ourOptIn.index,
      masterDoi: ourOptIn.master_doi,
      data: ourOptIn.data,
      ownerId: ourOptIn.ownerId
    }));
    cov_ecahrzcem.s[18]++;
    logSend("optIn (index:" + ourOptIn.index + " added to local db with optInId", optInId);
    cov_ecahrzcem.s[19]++;
    writeToBlockchain({
      id: optInId
    });
    cov_ecahrzcem.s[20]++;
    return optInId;
  } catch (exception) {
    cov_ecahrzcem.s[21]++;
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

var cov_1dc8b3nhi7 = function () {
  var path = "/home/doichain/dapp/imports/modules/server/opt-ins/confirm.js",
      hash = "90ccf44264be73b3660d8da6ff2202f78eff3034",
      Function = function () {}.constructor,
      global = new Function('return this')(),
      gcv = "__coverage__",
      coverageData = {
    path: "/home/doichain/dapp/imports/modules/server/opt-ins/confirm.js",
    statementMap: {
      "0": {
        start: {
          line: 11,
          column: 27
        },
        end: {
          line: 18,
          column: 2
        }
      },
      "1": {
        start: {
          line: 20,
          column: 21
        },
        end: {
          line: 63,
          column: 1
        }
      },
      "2": {
        start: {
          line: 21,
          column: 2
        },
        end: {
          line: 62,
          column: 3
        }
      },
      "3": {
        start: {
          line: 22,
          column: 23
        },
        end: {
          line: 22,
          column: 30
        }
      },
      "4": {
        start: {
          line: 23,
          column: 4
        },
        end: {
          line: 23,
          column: 44
        }
      },
      "5": {
        start: {
          line: 24,
          column: 20
        },
        end: {
          line: 24,
          column: 55
        }
      },
      "6": {
        start: {
          line: 25,
          column: 18
        },
        end: {
          line: 25,
          column: 51
        }
      },
      "7": {
        start: {
          line: 26,
          column: 4
        },
        end: {
          line: 26,
          column: 94
        }
      },
      "8": {
        start: {
          line: 26,
          column: 73
        },
        end: {
          line: 26,
          column: 94
        }
      },
      "9": {
        start: {
          line: 27,
          column: 24
        },
        end: {
          line: 27,
          column: 34
        }
      },
      "10": {
        start: {
          line: 29,
          column: 4
        },
        end: {
          line: 29,
          column: 134
        }
      },
      "11": {
        start: {
          line: 32,
          column: 20
        },
        end: {
          line: 32,
          column: 98
        }
      },
      "12": {
        start: {
          line: 33,
          column: 4
        },
        end: {
          line: 33,
          column: 71
        }
      },
      "13": {
        start: {
          line: 33,
          column: 30
        },
        end: {
          line: 33,
          column: 71
        }
      },
      "14": {
        start: {
          line: 35,
          column: 4
        },
        end: {
          line: 57,
          column: 7
        }
      },
      "15": {
        start: {
          line: 36,
          column: 8
        },
        end: {
          line: 36,
          column: 54
        }
      },
      "16": {
        start: {
          line: 38,
          column: 22
        },
        end: {
          line: 38,
          column: 45
        }
      },
      "17": {
        start: {
          line: 39,
          column: 8
        },
        end: {
          line: 39,
          column: 59
        }
      },
      "18": {
        start: {
          line: 41,
          column: 29
        },
        end: {
          line: 41,
          column: 90
        }
      },
      "19": {
        start: {
          line: 42,
          column: 8
        },
        end: {
          line: 42,
          column: 53
        }
      },
      "20": {
        start: {
          line: 43,
          column: 28
        },
        end: {
          line: 43,
          column: 38
        }
      },
      "21": {
        start: {
          line: 45,
          column: 8
        },
        end: {
          line: 45,
          column: 26
        }
      },
      "22": {
        start: {
          line: 46,
          column: 8
        },
        end: {
          line: 46,
          column: 55
        }
      },
      "23": {
        start: {
          line: 47,
          column: 8
        },
        end: {
          line: 47,
          column: 42
        }
      },
      "24": {
        start: {
          line: 48,
          column: 26
        },
        end: {
          line: 48,
          column: 47
        }
      },
      "25": {
        start: {
          line: 49,
          column: 8
        },
        end: {
          line: 49,
          column: 86
        }
      },
      "26": {
        start: {
          line: 51,
          column: 8
        },
        end: {
          line: 56,
          column: 11
        }
      },
      "27": {
        start: {
          line: 58,
          column: 4
        },
        end: {
          line: 58,
          column: 56
        }
      },
      "28": {
        start: {
          line: 59,
          column: 4
        },
        end: {
          line: 59,
          column: 28
        }
      },
      "29": {
        start: {
          line: 61,
          column: 4
        },
        end: {
          line: 61,
          column: 67
        }
      }
    },
    fnMap: {
      "0": {
        name: "(anonymous_0)",
        decl: {
          start: {
            line: 20,
            column: 21
          },
          end: {
            line: 20,
            column: 22
          }
        },
        loc: {
          start: {
            line: 20,
            column: 34
          },
          end: {
            line: 63,
            column: 1
          }
        },
        line: 20
      },
      "1": {
        name: "(anonymous_1)",
        decl: {
          start: {
            line: 35,
            column: 20
          },
          end: {
            line: 35,
            column: 21
          }
        },
        loc: {
          start: {
            line: 35,
            column: 29
          },
          end: {
            line: 57,
            column: 5
          }
        },
        line: 35
      }
    },
    branchMap: {
      "0": {
        loc: {
          start: {
            line: 26,
            column: 4
          },
          end: {
            line: 26,
            column: 94
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 26,
            column: 4
          },
          end: {
            line: 26,
            column: 94
          }
        }, {
          start: {
            line: 26,
            column: 4
          },
          end: {
            line: 26,
            column: 94
          }
        }],
        line: 26
      },
      "1": {
        loc: {
          start: {
            line: 26,
            column: 7
          },
          end: {
            line: 26,
            column: 71
          }
        },
        type: "binary-expr",
        locations: [{
          start: {
            line: 26,
            column: 7
          },
          end: {
            line: 26,
            column: 26
          }
        }, {
          start: {
            line: 26,
            column: 30
          },
          end: {
            line: 26,
            column: 71
          }
        }],
        line: 26
      },
      "2": {
        loc: {
          start: {
            line: 33,
            column: 4
          },
          end: {
            line: 33,
            column: 71
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 33,
            column: 4
          },
          end: {
            line: 33,
            column: 71
          }
        }, {
          start: {
            line: 33,
            column: 4
          },
          end: {
            line: 33,
            column: 71
          }
        }],
        line: 33
      }
    },
    s: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0,
      "7": 0,
      "8": 0,
      "9": 0,
      "10": 0,
      "11": 0,
      "12": 0,
      "13": 0,
      "14": 0,
      "15": 0,
      "16": 0,
      "17": 0,
      "18": 0,
      "19": 0,
      "20": 0,
      "21": 0,
      "22": 0,
      "23": 0,
      "24": 0,
      "25": 0,
      "26": 0,
      "27": 0,
      "28": 0,
      "29": 0
    },
    f: {
      "0": 0,
      "1": 0
    },
    b: {
      "0": [0, 0],
      "1": [0, 0],
      "2": [0, 0]
    },
    _coverageSchema: "43e27e138ebf9cfc5966b082cf9a028302ed4184"
  },
      coverage = global[gcv] || (global[gcv] = {});

  if (coverage[path] && coverage[path].hash === hash) {
    return coverage[path];
  }

  coverageData.hash = hash;
  return coverage[path] = coverageData;
}();

const ConfirmOptInSchema = (cov_1dc8b3nhi7.s[0]++, new SimpleSchema({
  host: {
    type: String
  },
  hash: {
    type: String
  }
}));
cov_1dc8b3nhi7.s[1]++;

const confirmOptIn = request => {
  cov_1dc8b3nhi7.f[0]++;
  cov_1dc8b3nhi7.s[2]++;

  try {
    const ourRequest = (cov_1dc8b3nhi7.s[3]++, request);
    cov_1dc8b3nhi7.s[4]++;
    ConfirmOptInSchema.validate(ourRequest);
    const decoded = (cov_1dc8b3nhi7.s[5]++, decodeDoiHash({
      hash: request.hash
    }));
    const optIn = (cov_1dc8b3nhi7.s[6]++, OptIns.findOne({
      _id: decoded.id
    }));
    cov_1dc8b3nhi7.s[7]++;

    if ((cov_1dc8b3nhi7.b[1][0]++, optIn === undefined) || (cov_1dc8b3nhi7.b[1][1]++, optIn.confirmationToken !== decoded.token)) {
      cov_1dc8b3nhi7.b[0][0]++;
      cov_1dc8b3nhi7.s[8]++;
      throw "Invalid hash";
    } else {
      cov_1dc8b3nhi7.b[0][1]++;
    }

    const confirmedAt = (cov_1dc8b3nhi7.s[9]++, new Date());
    cov_1dc8b3nhi7.s[10]++;
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

    const entries = (cov_1dc8b3nhi7.s[11]++, DoichainEntries.find({
      $or: [{
        name: optIn.nameId
      }, {
        masterDoi: optIn.nameId
      }]
    }));
    cov_1dc8b3nhi7.s[12]++;

    if (entries === undefined) {
      cov_1dc8b3nhi7.b[2][0]++;
      cov_1dc8b3nhi7.s[13]++;
      throw "Doichain entry/entries not found";
    } else {
      cov_1dc8b3nhi7.b[2][1]++;
    }

    cov_1dc8b3nhi7.s[14]++;
    entries.forEach(entry => {
      cov_1dc8b3nhi7.f[1]++;
      cov_1dc8b3nhi7.s[15]++;
      logConfirm('confirming DoiChainEntry:', entry);
      const value = (cov_1dc8b3nhi7.s[16]++, JSON.parse(entry.value));
      cov_1dc8b3nhi7.s[17]++;
      logConfirm('getSignature (only of value!)', value);
      const doiSignature = (cov_1dc8b3nhi7.s[18]++, signMessage(CONFIRM_CLIENT, CONFIRM_ADDRESS, value.signature));
      cov_1dc8b3nhi7.s[19]++;
      logConfirm('got doiSignature:', doiSignature);
      const fromHostUrl = (cov_1dc8b3nhi7.s[20]++, value.from);
      cov_1dc8b3nhi7.s[21]++;
      delete value.from;
      cov_1dc8b3nhi7.s[22]++;
      value.doiTimestamp = confirmedAt.toISOString();
      cov_1dc8b3nhi7.s[23]++;
      value.doiSignature = doiSignature;
      const jsonValue = (cov_1dc8b3nhi7.s[24]++, JSON.stringify(value));
      cov_1dc8b3nhi7.s[25]++;
      logConfirm('updating Doichain nameId:' + optIn.nameId + ' with value:', jsonValue);
      cov_1dc8b3nhi7.s[26]++;
      addUpdateBlockchainJob({
        nameId: entry.name,
        value: jsonValue,
        fromHostUrl: fromHostUrl,
        host: ourRequest.host
      });
    });
    cov_1dc8b3nhi7.s[27]++;
    logConfirm('redirecting user to:', decoded.redirect);
    cov_1dc8b3nhi7.s[28]++;
    return decoded.redirect;
  } catch (exception) {
    cov_1dc8b3nhi7.s[29]++;
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

var cov_1npgza655j = function () {
  var path = "/home/doichain/dapp/imports/modules/server/opt-ins/generate_doi-token.js",
      hash = "72893a2d9b2cef487ec308f4ff0c641d4252fa55",
      Function = function () {}.constructor,
      global = new Function('return this')(),
      gcv = "__coverage__",
      coverageData = {
    path: "/home/doichain/dapp/imports/modules/server/opt-ins/generate_doi-token.js",
    statementMap: {
      "0": {
        start: {
          line: 6,
          column: 31
        },
        end: {
          line: 10,
          column: 2
        }
      },
      "1": {
        start: {
          line: 12,
          column: 25
        },
        end: {
          line: 22,
          column: 1
        }
      },
      "2": {
        start: {
          line: 13,
          column: 2
        },
        end: {
          line: 21,
          column: 3
        }
      },
      "3": {
        start: {
          line: 14,
          column: 21
        },
        end: {
          line: 14,
          column: 26
        }
      },
      "4": {
        start: {
          line: 15,
          column: 4
        },
        end: {
          line: 15,
          column: 46
        }
      },
      "5": {
        start: {
          line: 16,
          column: 18
        },
        end: {
          line: 16,
          column: 49
        }
      },
      "6": {
        start: {
          line: 17,
          column: 4
        },
        end: {
          line: 17,
          column: 73
        }
      },
      "7": {
        start: {
          line: 18,
          column: 4
        },
        end: {
          line: 18,
          column: 17
        }
      },
      "8": {
        start: {
          line: 20,
          column: 4
        },
        end: {
          line: 20,
          column: 78
        }
      }
    },
    fnMap: {
      "0": {
        name: "(anonymous_0)",
        decl: {
          start: {
            line: 12,
            column: 25
          },
          end: {
            line: 12,
            column: 26
          }
        },
        loc: {
          start: {
            line: 12,
            column: 36
          },
          end: {
            line: 22,
            column: 1
          }
        },
        line: 12
      }
    },
    branchMap: {},
    s: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0,
      "7": 0,
      "8": 0
    },
    f: {
      "0": 0
    },
    b: {},
    _coverageSchema: "43e27e138ebf9cfc5966b082cf9a028302ed4184"
  },
      coverage = global[gcv] || (global[gcv] = {});

  if (coverage[path] && coverage[path].hash === hash) {
    return coverage[path];
  }

  coverageData.hash = hash;
  return coverage[path] = coverageData;
}();

const GenerateDoiTokenSchema = (cov_1npgza655j.s[0]++, new SimpleSchema({
  id: {
    type: String
  }
}));
cov_1npgza655j.s[1]++;

const generateDoiToken = optIn => {
  cov_1npgza655j.f[0]++;
  cov_1npgza655j.s[2]++;

  try {
    const ourOptIn = (cov_1npgza655j.s[3]++, optIn);
    cov_1npgza655j.s[4]++;
    GenerateDoiTokenSchema.validate(ourOptIn);
    const token = (cov_1npgza655j.s[5]++, randomBytes(32).toString('hex'));
    cov_1npgza655j.s[6]++;
    OptIns.update({
      _id: ourOptIn.id
    }, {
      $set: {
        confirmationToken: token
      }
    });
    cov_1npgza655j.s[7]++;
    return token;
  } catch (exception) {
    cov_1npgza655j.s[8]++;
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

var cov_na3j81a1l = function () {
  var path = "/home/doichain/dapp/imports/modules/server/opt-ins/update_status.js",
      hash = "f2a0b9324a4a4a30969e0ab9a36ee4870af31b39",
      Function = function () {}.constructor,
      global = new Function('return this')(),
      gcv = "__coverage__",
      coverageData = {
    path: "/home/doichain/dapp/imports/modules/server/opt-ins/update_status.js",
    statementMap: {
      "0": {
        start: {
          line: 9,
          column: 32
        },
        end: {
          line: 20,
          column: 2
        }
      },
      "1": {
        start: {
          line: 23,
          column: 26
        },
        end: {
          line: 48,
          column: 1
        }
      },
      "2": {
        start: {
          line: 24,
          column: 2
        },
        end: {
          line: 47,
          column: 3
        }
      },
      "3": {
        start: {
          line: 25,
          column: 20
        },
        end: {
          line: 25,
          column: 24
        }
      },
      "4": {
        start: {
          line: 26,
          column: 4
        },
        end: {
          line: 26,
          column: 65
        }
      },
      "5": {
        start: {
          line: 27,
          column: 4
        },
        end: {
          line: 27,
          column: 46
        }
      },
      "6": {
        start: {
          line: 28,
          column: 18
        },
        end: {
          line: 28,
          column: 58
        }
      },
      "7": {
        start: {
          line: 29,
          column: 4
        },
        end: {
          line: 29,
          column: 53
        }
      },
      "8": {
        start: {
          line: 29,
          column: 28
        },
        end: {
          line: 29,
          column: 53
        }
      },
      "9": {
        start: {
          line: 30,
          column: 4
        },
        end: {
          line: 30,
          column: 59
        }
      },
      "10": {
        start: {
          line: 32,
          column: 22
        },
        end: {
          line: 32,
          column: 64
        }
      },
      "11": {
        start: {
          line: 33,
          column: 4
        },
        end: {
          line: 33,
          column: 60
        }
      },
      "12": {
        start: {
          line: 33,
          column: 32
        },
        end: {
          line: 33,
          column: 60
        }
      },
      "13": {
        start: {
          line: 34,
          column: 18
        },
        end: {
          line: 34,
          column: 44
        }
      },
      "14": {
        start: {
          line: 35,
          column: 19
        },
        end: {
          line: 35,
          column: 40
        }
      },
      "15": {
        start: {
          line: 36,
          column: 32
        },
        end: {
          line: 36,
          column: 71
        }
      },
      "16": {
        start: {
          line: 39,
          column: 4
        },
        end: {
          line: 41,
          column: 5
        }
      },
      "17": {
        start: {
          line: 40,
          column: 6
        },
        end: {
          line: 40,
          column: 28
        }
      },
      "18": {
        start: {
          line: 42,
          column: 4
        },
        end: {
          line: 42,
          column: 76
        }
      },
      "19": {
        start: {
          line: 44,
          column: 4
        },
        end: {
          line: 44,
          column: 97
        }
      },
      "20": {
        start: {
          line: 46,
          column: 4
        },
        end: {
          line: 46,
          column: 80
        }
      }
    },
    fnMap: {
      "0": {
        name: "(anonymous_0)",
        decl: {
          start: {
            line: 23,
            column: 26
          },
          end: {
            line: 23,
            column: 27
          }
        },
        loc: {
          start: {
            line: 23,
            column: 36
          },
          end: {
            line: 48,
            column: 1
          }
        },
        line: 23
      }
    },
    branchMap: {
      "0": {
        loc: {
          start: {
            line: 29,
            column: 4
          },
          end: {
            line: 29,
            column: 53
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 29,
            column: 4
          },
          end: {
            line: 29,
            column: 53
          }
        }, {
          start: {
            line: 29,
            column: 4
          },
          end: {
            line: 29,
            column: 53
          }
        }],
        line: 29
      },
      "1": {
        loc: {
          start: {
            line: 33,
            column: 4
          },
          end: {
            line: 33,
            column: 60
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 33,
            column: 4
          },
          end: {
            line: 33,
            column: 60
          }
        }, {
          start: {
            line: 33,
            column: 4
          },
          end: {
            line: 33,
            column: 60
          }
        }],
        line: 33
      },
      "2": {
        loc: {
          start: {
            line: 39,
            column: 4
          },
          end: {
            line: 41,
            column: 5
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 39,
            column: 4
          },
          end: {
            line: 41,
            column: 5
          }
        }, {
          start: {
            line: 39,
            column: 4
          },
          end: {
            line: 41,
            column: 5
          }
        }],
        line: 39
      }
    },
    s: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0,
      "7": 0,
      "8": 0,
      "9": 0,
      "10": 0,
      "11": 0,
      "12": 0,
      "13": 0,
      "14": 0,
      "15": 0,
      "16": 0,
      "17": 0,
      "18": 0,
      "19": 0,
      "20": 0
    },
    f: {
      "0": 0
    },
    b: {
      "0": [0, 0],
      "1": [0, 0],
      "2": [0, 0]
    },
    _coverageSchema: "43e27e138ebf9cfc5966b082cf9a028302ed4184"
  },
      coverage = global[gcv] || (global[gcv] = {});

  if (coverage[path] && coverage[path].hash === hash) {
    return coverage[path];
  }

  coverageData.hash = hash;
  return coverage[path] = coverageData;
}();

const UpdateOptInStatusSchema = (cov_na3j81a1l.s[0]++, new SimpleSchema({
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
}));
cov_na3j81a1l.s[1]++;

const updateOptInStatus = data => {
  cov_na3j81a1l.f[0]++;
  cov_na3j81a1l.s[2]++;

  try {
    const ourData = (cov_na3j81a1l.s[3]++, data);
    cov_na3j81a1l.s[4]++;
    logSend('confirm dApp confirms optIn:', JSON.stringify(data));
    cov_na3j81a1l.s[5]++;
    UpdateOptInStatusSchema.validate(ourData);
    const optIn = (cov_na3j81a1l.s[6]++, OptIns.findOne({
      nameId: ourData.nameId
    }));
    cov_na3j81a1l.s[7]++;

    if (optIn === undefined) {
      cov_na3j81a1l.b[0][0]++;
      cov_na3j81a1l.s[8]++;
      throw "Opt-In not found";
    } else {
      cov_na3j81a1l.b[0][1]++;
    }

    cov_na3j81a1l.s[9]++;
    logSend('confirm dApp confirms optIn:', ourData.nameId);
    const recipient = (cov_na3j81a1l.s[10]++, Recipients.findOne({
      _id: optIn.recipient
    }));
    cov_na3j81a1l.s[11]++;

    if (recipient === undefined) {
      cov_na3j81a1l.b[1][0]++;
      cov_na3j81a1l.s[12]++;
      throw "Recipient not found";
    } else {
      cov_na3j81a1l.b[1][1]++;
    }

    const parts = (cov_na3j81a1l.s[13]++, recipient.email.split("@"));
    const domain = (cov_na3j81a1l.s[14]++, parts[parts.length - 1]);
    const publicKeyAndAddress = (cov_na3j81a1l.s[15]++, getPublicKeyAndAddress({
      domain: domain
    })); //TODO getting information from Bob that a certain nameId (DOI) got confirmed.

    cov_na3j81a1l.s[16]++;

    if (!verifySignature({
      publicKey: publicKeyAndAddress.publicKey,
      data: ourData.nameId,
      signature: ourData.signature
    })) {
      cov_na3j81a1l.b[2][0]++;
      cov_na3j81a1l.s[17]++;
      throw "Access denied";
    } else {
      cov_na3j81a1l.b[2][1]++;
    }

    cov_na3j81a1l.s[18]++;
    logSend('signature valid for publicKey', publicKeyAndAddress.publicKey);
    cov_na3j81a1l.s[19]++;
    OptIns.update({
      _id: optIn._id
    }, {
      $set: {
        confirmedAt: new Date(),
        confirmedBy: ourData.host
      }
    });
  } catch (exception) {
    cov_na3j81a1l.s[20]++;
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

var cov_wjjp3d1b7 = function () {
  var path = "/home/doichain/dapp/imports/modules/server/opt-ins/verify.js",
      hash = "06aea4ba8b0f63efd51c84bceaf9f820a78d7d61",
      Function = function () {}.constructor,
      global = new Function('return this')(),
      gcv = "__coverage__",
      coverageData = {
    path: "/home/doichain/dapp/imports/modules/server/opt-ins/verify.js",
    statementMap: {
      "0": {
        start: {
          line: 11,
          column: 26
        },
        end: {
          line: 26,
          column: 2
        }
      },
      "1": {
        start: {
          line: 28,
          column: 20
        },
        end: {
          line: 57,
          column: 1
        }
      },
      "2": {
        start: {
          line: 29,
          column: 2
        },
        end: {
          line: 56,
          column: 3
        }
      },
      "3": {
        start: {
          line: 30,
          column: 20
        },
        end: {
          line: 30,
          column: 24
        }
      },
      "4": {
        start: {
          line: 31,
          column: 4
        },
        end: {
          line: 31,
          column: 40
        }
      },
      "5": {
        start: {
          line: 32,
          column: 18
        },
        end: {
          line: 32,
          column: 58
        }
      },
      "6": {
        start: {
          line: 33,
          column: 4
        },
        end: {
          line: 33,
          column: 41
        }
      },
      "7": {
        start: {
          line: 33,
          column: 28
        },
        end: {
          line: 33,
          column: 41
        }
      },
      "8": {
        start: {
          line: 34,
          column: 22
        },
        end: {
          line: 34,
          column: 45
        }
      },
      "9": {
        start: {
          line: 35,
          column: 23
        },
        end: {
          line: 39,
          column: 6
        }
      },
      "10": {
        start: {
          line: 41,
          column: 4
        },
        end: {
          line: 41,
          column: 47
        }
      },
      "11": {
        start: {
          line: 41,
          column: 20
        },
        end: {
          line: 41,
          column: 47
        }
      },
      "12": {
        start: {
          line: 42,
          column: 18
        },
        end: {
          line: 42,
          column: 51
        }
      },
      "13": {
        start: {
          line: 43,
          column: 19
        },
        end: {
          line: 43,
          column: 40
        }
      },
      "14": {
        start: {
          line: 44,
          column: 32
        },
        end: {
          line: 44,
          column: 72
        }
      },
      "15": {
        start: {
          line: 46,
          column: 24
        },
        end: {
          line: 50,
          column: 6
        }
      },
      "16": {
        start: {
          line: 52,
          column: 4
        },
        end: {
          line: 52,
          column: 49
        }
      },
      "17": {
        start: {
          line: 52,
          column: 21
        },
        end: {
          line: 52,
          column: 49
        }
      },
      "18": {
        start: {
          line: 53,
          column: 4
        },
        end: {
          line: 53,
          column: 16
        }
      },
      "19": {
        start: {
          line: 55,
          column: 4
        },
        end: {
          line: 55,
          column: 66
        }
      }
    },
    fnMap: {
      "0": {
        name: "(anonymous_0)",
        decl: {
          start: {
            line: 28,
            column: 20
          },
          end: {
            line: 28,
            column: 21
          }
        },
        loc: {
          start: {
            line: 28,
            column: 30
          },
          end: {
            line: 57,
            column: 1
          }
        },
        line: 28
      }
    },
    branchMap: {
      "0": {
        loc: {
          start: {
            line: 33,
            column: 4
          },
          end: {
            line: 33,
            column: 41
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 33,
            column: 4
          },
          end: {
            line: 33,
            column: 41
          }
        }, {
          start: {
            line: 33,
            column: 4
          },
          end: {
            line: 33,
            column: 41
          }
        }],
        line: 33
      },
      "1": {
        loc: {
          start: {
            line: 41,
            column: 4
          },
          end: {
            line: 41,
            column: 47
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 41,
            column: 4
          },
          end: {
            line: 41,
            column: 47
          }
        }, {
          start: {
            line: 41,
            column: 4
          },
          end: {
            line: 41,
            column: 47
          }
        }],
        line: 41
      },
      "2": {
        loc: {
          start: {
            line: 52,
            column: 4
          },
          end: {
            line: 52,
            column: 49
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 52,
            column: 4
          },
          end: {
            line: 52,
            column: 49
          }
        }, {
          start: {
            line: 52,
            column: 4
          },
          end: {
            line: 52,
            column: 49
          }
        }],
        line: 52
      }
    },
    s: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0,
      "7": 0,
      "8": 0,
      "9": 0,
      "10": 0,
      "11": 0,
      "12": 0,
      "13": 0,
      "14": 0,
      "15": 0,
      "16": 0,
      "17": 0,
      "18": 0,
      "19": 0
    },
    f: {
      "0": 0
    },
    b: {
      "0": [0, 0],
      "1": [0, 0],
      "2": [0, 0]
    },
    _coverageSchema: "43e27e138ebf9cfc5966b082cf9a028302ed4184"
  },
      coverage = global[gcv] || (global[gcv] = {});

  if (coverage[path] && coverage[path].hash === hash) {
    return coverage[path];
  }

  coverageData.hash = hash;
  return coverage[path] = coverageData;
}();

const VerifyOptInSchema = (cov_wjjp3d1b7.s[0]++, new SimpleSchema({
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
}));
cov_wjjp3d1b7.s[1]++;

const verifyOptIn = data => {
  cov_wjjp3d1b7.f[0]++;
  cov_wjjp3d1b7.s[2]++;

  try {
    const ourData = (cov_wjjp3d1b7.s[3]++, data);
    cov_wjjp3d1b7.s[4]++;
    VerifyOptInSchema.validate(ourData);
    const entry = (cov_wjjp3d1b7.s[5]++, nameShow(VERIFY_CLIENT, ourData.name_id));
    cov_wjjp3d1b7.s[6]++;

    if (entry === undefined) {
      cov_wjjp3d1b7.b[0][0]++;
      cov_wjjp3d1b7.s[7]++;
      return false;
    } else {
      cov_wjjp3d1b7.b[0][1]++;
    }

    const entryData = (cov_wjjp3d1b7.s[8]++, JSON.parse(entry.value));
    const firstCheck = (cov_wjjp3d1b7.s[9]++, verifySignature({
      data: ourData.recipient_mail + ourData.sender_mail,
      signature: entryData.signature,
      publicKey: ourData.recipient_public_key
    }));
    cov_wjjp3d1b7.s[10]++;

    if (!firstCheck) {
      cov_wjjp3d1b7.b[1][0]++;
      cov_wjjp3d1b7.s[11]++;
      return {
        firstCheck: false
      };
    } else {
      cov_wjjp3d1b7.b[1][1]++;
    }

    const parts = (cov_wjjp3d1b7.s[12]++, ourData.recipient_mail.split("@")); //TODO put this into getPublicKeyAndAddress

    const domain = (cov_wjjp3d1b7.s[13]++, parts[parts.length - 1]);
    const publicKeyAndAddress = (cov_wjjp3d1b7.s[14]++, getPublicKeyAndAddress({
      domain: domain
    }));
    const secondCheck = (cov_wjjp3d1b7.s[15]++, verifySignature({
      data: entryData.signature,
      signature: entryData.doiSignature,
      publicKey: publicKeyAndAddress.publicKey
    }));
    cov_wjjp3d1b7.s[16]++;

    if (!secondCheck) {
      cov_wjjp3d1b7.b[2][0]++;
      cov_wjjp3d1b7.s[17]++;
      return {
        secondCheck: false
      };
    } else {
      cov_wjjp3d1b7.b[2][1]++;
    }

    cov_wjjp3d1b7.s[18]++;
    return true;
  } catch (exception) {
    cov_wjjp3d1b7.s[19]++;
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

var cov_270myq8vnc = function () {
  var path = "/home/doichain/dapp/imports/modules/server/recipients/add.js",
      hash = "7e7a9d80b46621ada9ef1c89e6684109969403b1",
      Function = function () {}.constructor,
      global = new Function('return this')(),
      gcv = "__coverage__",
      coverageData = {
    path: "/home/doichain/dapp/imports/modules/server/recipients/add.js",
    statementMap: {
      "0": {
        start: {
          line: 6,
          column: 27
        },
        end: {
          line: 11,
          column: 2
        }
      },
      "1": {
        start: {
          line: 13,
          column: 21
        },
        end: {
          line: 28,
          column: 1
        }
      },
      "2": {
        start: {
          line: 14,
          column: 2
        },
        end: {
          line: 27,
          column: 3
        }
      },
      "3": {
        start: {
          line: 15,
          column: 25
        },
        end: {
          line: 15,
          column: 34
        }
      },
      "4": {
        start: {
          line: 16,
          column: 4
        },
        end: {
          line: 16,
          column: 46
        }
      },
      "5": {
        start: {
          line: 17,
          column: 23
        },
        end: {
          line: 17,
          column: 72
        }
      },
      "6": {
        start: {
          line: 18,
          column: 4
        },
        end: {
          line: 18,
          column: 55
        }
      },
      "7": {
        start: {
          line: 18,
          column: 30
        },
        end: {
          line: 18,
          column: 55
        }
      },
      "8": {
        start: {
          line: 19,
          column: 20
        },
        end: {
          line: 19,
          column: 32
        }
      },
      "9": {
        start: {
          line: 20,
          column: 4
        },
        end: {
          line: 24,
          column: 6
        }
      },
      "10": {
        start: {
          line: 26,
          column: 4
        },
        end: {
          line: 26,
          column: 66
        }
      }
    },
    fnMap: {
      "0": {
        name: "(anonymous_0)",
        decl: {
          start: {
            line: 13,
            column: 21
          },
          end: {
            line: 13,
            column: 22
          }
        },
        loc: {
          start: {
            line: 13,
            column: 36
          },
          end: {
            line: 28,
            column: 1
          }
        },
        line: 13
      }
    },
    branchMap: {
      "0": {
        loc: {
          start: {
            line: 18,
            column: 4
          },
          end: {
            line: 18,
            column: 55
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 18,
            column: 4
          },
          end: {
            line: 18,
            column: 55
          }
        }, {
          start: {
            line: 18,
            column: 4
          },
          end: {
            line: 18,
            column: 55
          }
        }],
        line: 18
      }
    },
    s: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0,
      "7": 0,
      "8": 0,
      "9": 0,
      "10": 0
    },
    f: {
      "0": 0
    },
    b: {
      "0": [0, 0]
    },
    _coverageSchema: "43e27e138ebf9cfc5966b082cf9a028302ed4184"
  },
      coverage = global[gcv] || (global[gcv] = {});

  if (coverage[path] && coverage[path].hash === hash) {
    return coverage[path];
  }

  coverageData.hash = hash;
  return coverage[path] = coverageData;
}();

const AddRecipientSchema = (cov_270myq8vnc.s[0]++, new SimpleSchema({
  email: {
    type: String,
    regEx: SimpleSchema.RegEx.Email
  }
}));
cov_270myq8vnc.s[1]++;

const addRecipient = recipient => {
  cov_270myq8vnc.f[0]++;
  cov_270myq8vnc.s[2]++;

  try {
    const ourRecipient = (cov_270myq8vnc.s[3]++, recipient);
    cov_270myq8vnc.s[4]++;
    AddRecipientSchema.validate(ourRecipient);
    const recipients = (cov_270myq8vnc.s[5]++, Recipients.find({
      email: recipient.email
    }).fetch());
    cov_270myq8vnc.s[6]++;

    if (recipients.length > 0) {
      cov_270myq8vnc.b[0][0]++;
      cov_270myq8vnc.s[7]++;
      return recipients[0]._id;
    } else {
      cov_270myq8vnc.b[0][1]++;
    }

    const keyPair = (cov_270myq8vnc.s[8]++, getKeyPair());
    cov_270myq8vnc.s[9]++;
    return Recipients.insert({
      email: ourRecipient.email,
      privateKey: keyPair.privateKey,
      publicKey: keyPair.publicKey
    });
  } catch (exception) {
    cov_270myq8vnc.s[10]++;
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

var cov_28j4v9jt09 = function () {
  var path = "/home/doichain/dapp/imports/modules/server/senders/add.js",
      hash = "0fee94a5f01138c39387f23eebe161eca4ff7d1b",
      Function = function () {}.constructor,
      global = new Function('return this')(),
      gcv = "__coverage__",
      coverageData = {
    path: "/home/doichain/dapp/imports/modules/server/senders/add.js",
    statementMap: {
      "0": {
        start: {
          line: 5,
          column: 24
        },
        end: {
          line: 10,
          column: 2
        }
      },
      "1": {
        start: {
          line: 12,
          column: 18
        },
        end: {
          line: 24,
          column: 1
        }
      },
      "2": {
        start: {
          line: 13,
          column: 2
        },
        end: {
          line: 23,
          column: 3
        }
      },
      "3": {
        start: {
          line: 14,
          column: 22
        },
        end: {
          line: 14,
          column: 28
        }
      },
      "4": {
        start: {
          line: 15,
          column: 4
        },
        end: {
          line: 15,
          column: 40
        }
      },
      "5": {
        start: {
          line: 16,
          column: 20
        },
        end: {
          line: 16,
          column: 63
        }
      },
      "6": {
        start: {
          line: 17,
          column: 4
        },
        end: {
          line: 17,
          column: 49
        }
      },
      "7": {
        start: {
          line: 17,
          column: 27
        },
        end: {
          line: 17,
          column: 49
        }
      },
      "8": {
        start: {
          line: 18,
          column: 4
        },
        end: {
          line: 20,
          column: 6
        }
      },
      "9": {
        start: {
          line: 22,
          column: 4
        },
        end: {
          line: 22,
          column: 63
        }
      }
    },
    fnMap: {
      "0": {
        name: "(anonymous_0)",
        decl: {
          start: {
            line: 12,
            column: 18
          },
          end: {
            line: 12,
            column: 19
          }
        },
        loc: {
          start: {
            line: 12,
            column: 30
          },
          end: {
            line: 24,
            column: 1
          }
        },
        line: 12
      }
    },
    branchMap: {
      "0": {
        loc: {
          start: {
            line: 17,
            column: 4
          },
          end: {
            line: 17,
            column: 49
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 17,
            column: 4
          },
          end: {
            line: 17,
            column: 49
          }
        }, {
          start: {
            line: 17,
            column: 4
          },
          end: {
            line: 17,
            column: 49
          }
        }],
        line: 17
      }
    },
    s: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0,
      "7": 0,
      "8": 0,
      "9": 0
    },
    f: {
      "0": 0
    },
    b: {
      "0": [0, 0]
    },
    _coverageSchema: "43e27e138ebf9cfc5966b082cf9a028302ed4184"
  },
      coverage = global[gcv] || (global[gcv] = {});

  if (coverage[path] && coverage[path].hash === hash) {
    return coverage[path];
  }

  coverageData.hash = hash;
  return coverage[path] = coverageData;
}();

const AddSenderSchema = (cov_28j4v9jt09.s[0]++, new SimpleSchema({
  email: {
    type: String,
    regEx: SimpleSchema.RegEx.Email
  }
}));
cov_28j4v9jt09.s[1]++;

const addSender = sender => {
  cov_28j4v9jt09.f[0]++;
  cov_28j4v9jt09.s[2]++;

  try {
    const ourSender = (cov_28j4v9jt09.s[3]++, sender);
    cov_28j4v9jt09.s[4]++;
    AddSenderSchema.validate(ourSender);
    const senders = (cov_28j4v9jt09.s[5]++, Senders.find({
      email: sender.email
    }).fetch());
    cov_28j4v9jt09.s[6]++;

    if (senders.length > 0) {
      cov_28j4v9jt09.b[0][0]++;
      cov_28j4v9jt09.s[7]++;
      return senders[0]._id;
    } else {
      cov_28j4v9jt09.b[0][1]++;
    }

    cov_28j4v9jt09.s[8]++;
    return Senders.insert({
      email: ourSender.email
    });
  } catch (exception) {
    cov_28j4v9jt09.s[9]++;
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

var cov_1hvm1knexm = function () {
  var path = "/home/doichain/dapp/imports/startup/server/dapp-configuration.js",
      hash = "cefcf57c65983a308e1ce34f933bcd84cb0cf767",
      Function = function () {}.constructor,
      global = new Function('return this')(),
      gcv = "__coverage__",
      coverageData = {
    path: "/home/doichain/dapp/imports/startup/server/dapp-configuration.js",
    statementMap: {
      "0": {
        start: {
          line: 4,
          column: 2
        },
        end: {
          line: 6,
          column: 78
        }
      },
      "1": {
        start: {
          line: 6,
          column: 46
        },
        end: {
          line: 6,
          column: 78
        }
      },
      "2": {
        start: {
          line: 7,
          column: 2
        },
        end: {
          line: 7,
          column: 15
        }
      },
      "3": {
        start: {
          line: 11,
          column: 2
        },
        end: {
          line: 13,
          column: 82
        }
      },
      "4": {
        start: {
          line: 13,
          column: 48
        },
        end: {
          line: 13,
          column: 82
        }
      },
      "5": {
        start: {
          line: 14,
          column: 2
        },
        end: {
          line: 14,
          column: 15
        }
      },
      "6": {
        start: {
          line: 18,
          column: 4
        },
        end: {
          line: 20,
          column: 85
        }
      },
      "7": {
        start: {
          line: 20,
          column: 51
        },
        end: {
          line: 20,
          column: 85
        }
      },
      "8": {
        start: {
          line: 21,
          column: 4
        },
        end: {
          line: 21,
          column: 17
        }
      },
      "9": {
        start: {
          line: 25,
          column: 2
        },
        end: {
          line: 31,
          column: 3
        }
      },
      "10": {
        start: {
          line: 28,
          column: 18
        },
        end: {
          line: 28,
          column: 22
        }
      },
      "11": {
        start: {
          line: 29,
          column: 7
        },
        end: {
          line: 29,
          column: 81
        }
      },
      "12": {
        start: {
          line: 29,
          column: 50
        },
        end: {
          line: 29,
          column: 81
        }
      },
      "13": {
        start: {
          line: 30,
          column: 7
        },
        end: {
          line: 30,
          column: 62
        }
      },
      "14": {
        start: {
          line: 32,
          column: 2
        },
        end: {
          line: 32,
          column: 30
        }
      }
    },
    fnMap: {
      "0": {
        name: "isDebug",
        decl: {
          start: {
            line: 3,
            column: 16
          },
          end: {
            line: 3,
            column: 23
          }
        },
        loc: {
          start: {
            line: 3,
            column: 26
          },
          end: {
            line: 8,
            column: 1
          }
        },
        line: 3
      },
      "1": {
        name: "isRegtest",
        decl: {
          start: {
            line: 10,
            column: 16
          },
          end: {
            line: 10,
            column: 25
          }
        },
        loc: {
          start: {
            line: 10,
            column: 28
          },
          end: {
            line: 15,
            column: 1
          }
        },
        line: 10
      },
      "2": {
        name: "isTestnet",
        decl: {
          start: {
            line: 17,
            column: 16
          },
          end: {
            line: 17,
            column: 25
          }
        },
        loc: {
          start: {
            line: 17,
            column: 28
          },
          end: {
            line: 22,
            column: 1
          }
        },
        line: 17
      },
      "3": {
        name: "getUrl",
        decl: {
          start: {
            line: 24,
            column: 16
          },
          end: {
            line: 24,
            column: 22
          }
        },
        loc: {
          start: {
            line: 24,
            column: 25
          },
          end: {
            line: 33,
            column: 1
          }
        },
        line: 24
      }
    },
    branchMap: {
      "0": {
        loc: {
          start: {
            line: 4,
            column: 2
          },
          end: {
            line: 6,
            column: 78
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 4,
            column: 2
          },
          end: {
            line: 6,
            column: 78
          }
        }, {
          start: {
            line: 4,
            column: 2
          },
          end: {
            line: 6,
            column: 78
          }
        }],
        line: 4
      },
      "1": {
        loc: {
          start: {
            line: 4,
            column: 5
          },
          end: {
            line: 6,
            column: 44
          }
        },
        type: "binary-expr",
        locations: [{
          start: {
            line: 4,
            column: 5
          },
          end: {
            line: 4,
            column: 34
          }
        }, {
          start: {
            line: 5,
            column: 5
          },
          end: {
            line: 5,
            column: 38
          }
        }, {
          start: {
            line: 6,
            column: 5
          },
          end: {
            line: 6,
            column: 44
          }
        }],
        line: 4
      },
      "2": {
        loc: {
          start: {
            line: 11,
            column: 2
          },
          end: {
            line: 13,
            column: 82
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 11,
            column: 2
          },
          end: {
            line: 13,
            column: 82
          }
        }, {
          start: {
            line: 11,
            column: 2
          },
          end: {
            line: 13,
            column: 82
          }
        }],
        line: 11
      },
      "3": {
        loc: {
          start: {
            line: 11,
            column: 5
          },
          end: {
            line: 13,
            column: 46
          }
        },
        type: "binary-expr",
        locations: [{
          start: {
            line: 11,
            column: 5
          },
          end: {
            line: 11,
            column: 34
          }
        }, {
          start: {
            line: 12,
            column: 5
          },
          end: {
            line: 12,
            column: 38
          }
        }, {
          start: {
            line: 13,
            column: 5
          },
          end: {
            line: 13,
            column: 46
          }
        }],
        line: 11
      },
      "4": {
        loc: {
          start: {
            line: 18,
            column: 4
          },
          end: {
            line: 20,
            column: 85
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 18,
            column: 4
          },
          end: {
            line: 20,
            column: 85
          }
        }, {
          start: {
            line: 18,
            column: 4
          },
          end: {
            line: 20,
            column: 85
          }
        }],
        line: 18
      },
      "5": {
        loc: {
          start: {
            line: 18,
            column: 7
          },
          end: {
            line: 20,
            column: 49
          }
        },
        type: "binary-expr",
        locations: [{
          start: {
            line: 18,
            column: 7
          },
          end: {
            line: 18,
            column: 36
          }
        }, {
          start: {
            line: 19,
            column: 8
          },
          end: {
            line: 19,
            column: 41
          }
        }, {
          start: {
            line: 20,
            column: 8
          },
          end: {
            line: 20,
            column: 49
          }
        }],
        line: 18
      },
      "6": {
        loc: {
          start: {
            line: 25,
            column: 2
          },
          end: {
            line: 31,
            column: 3
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 25,
            column: 2
          },
          end: {
            line: 31,
            column: 3
          }
        }, {
          start: {
            line: 25,
            column: 2
          },
          end: {
            line: 31,
            column: 3
          }
        }],
        line: 25
      },
      "7": {
        loc: {
          start: {
            line: 25,
            column: 5
          },
          end: {
            line: 27,
            column: 43
          }
        },
        type: "binary-expr",
        locations: [{
          start: {
            line: 25,
            column: 5
          },
          end: {
            line: 25,
            column: 34
          }
        }, {
          start: {
            line: 26,
            column: 5
          },
          end: {
            line: 26,
            column: 38
          }
        }, {
          start: {
            line: 27,
            column: 5
          },
          end: {
            line: 27,
            column: 43
          }
        }],
        line: 25
      },
      "8": {
        loc: {
          start: {
            line: 29,
            column: 7
          },
          end: {
            line: 29,
            column: 81
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 29,
            column: 7
          },
          end: {
            line: 29,
            column: 81
          }
        }, {
          start: {
            line: 29,
            column: 7
          },
          end: {
            line: 29,
            column: 81
          }
        }],
        line: 29
      }
    },
    s: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0,
      "7": 0,
      "8": 0,
      "9": 0,
      "10": 0,
      "11": 0,
      "12": 0,
      "13": 0,
      "14": 0
    },
    f: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0
    },
    b: {
      "0": [0, 0],
      "1": [0, 0, 0],
      "2": [0, 0],
      "3": [0, 0, 0],
      "4": [0, 0],
      "5": [0, 0, 0],
      "6": [0, 0],
      "7": [0, 0, 0],
      "8": [0, 0]
    },
    _coverageSchema: "43e27e138ebf9cfc5966b082cf9a028302ed4184"
  },
      coverage = global[gcv] || (global[gcv] = {});

  if (coverage[path] && coverage[path].hash === hash) {
    return coverage[path];
  }

  coverageData.hash = hash;
  return coverage[path] = coverageData;
}();

function isDebug() {
  cov_1hvm1knexm.f[0]++;
  cov_1hvm1knexm.s[0]++;

  if ((cov_1hvm1knexm.b[1][0]++, Meteor.settings !== undefined) && (cov_1hvm1knexm.b[1][1]++, Meteor.settings.app !== undefined) && (cov_1hvm1knexm.b[1][2]++, Meteor.settings.app.debug !== undefined)) {
    cov_1hvm1knexm.b[0][0]++;
    cov_1hvm1knexm.s[1]++;
    return Meteor.settings.app.debug;
  } else {
    cov_1hvm1knexm.b[0][1]++;
  }

  cov_1hvm1knexm.s[2]++;
  return false;
}

function isRegtest() {
  cov_1hvm1knexm.f[1]++;
  cov_1hvm1knexm.s[3]++;

  if ((cov_1hvm1knexm.b[3][0]++, Meteor.settings !== undefined) && (cov_1hvm1knexm.b[3][1]++, Meteor.settings.app !== undefined) && (cov_1hvm1knexm.b[3][2]++, Meteor.settings.app.regtest !== undefined)) {
    cov_1hvm1knexm.b[2][0]++;
    cov_1hvm1knexm.s[4]++;
    return Meteor.settings.app.regtest;
  } else {
    cov_1hvm1knexm.b[2][1]++;
  }

  cov_1hvm1knexm.s[5]++;
  return false;
}

function isTestnet() {
  cov_1hvm1knexm.f[2]++;
  cov_1hvm1knexm.s[6]++;

  if ((cov_1hvm1knexm.b[5][0]++, Meteor.settings !== undefined) && (cov_1hvm1knexm.b[5][1]++, Meteor.settings.app !== undefined) && (cov_1hvm1knexm.b[5][2]++, Meteor.settings.app.testnet !== undefined)) {
    cov_1hvm1knexm.b[4][0]++;
    cov_1hvm1knexm.s[7]++;
    return Meteor.settings.app.testnet;
  } else {
    cov_1hvm1knexm.b[4][1]++;
  }

  cov_1hvm1knexm.s[8]++;
  return false;
}

function getUrl() {
  cov_1hvm1knexm.f[3]++;
  cov_1hvm1knexm.s[9]++;

  if ((cov_1hvm1knexm.b[7][0]++, Meteor.settings !== undefined) && (cov_1hvm1knexm.b[7][1]++, Meteor.settings.app !== undefined) && (cov_1hvm1knexm.b[7][2]++, Meteor.settings.app.host !== undefined)) {
    cov_1hvm1knexm.b[6][0]++;
    let port = (cov_1hvm1knexm.s[10]++, 3000);
    cov_1hvm1knexm.s[11]++;

    if (Meteor.settings.app.port !== undefined) {
      cov_1hvm1knexm.b[8][0]++;
      cov_1hvm1knexm.s[12]++;
      port = Meteor.settings.app.port;
    } else {
      cov_1hvm1knexm.b[8][1]++;
    }

    cov_1hvm1knexm.s[13]++;
    return "http://" + Meteor.settings.app.host + ":" + port + "/";
  } else {
    cov_1hvm1knexm.b[6][1]++;
  }

  cov_1hvm1knexm.s[14]++;
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

var cov_yqfyehbz1 = function () {
  var path = "/home/doichain/dapp/imports/startup/server/dns-configuration.js",
      hash = "9ac0c3863f689d80990da01d76bc3dbcef5dd019",
      Function = function () {}.constructor,
      global = new Function('return this')(),
      gcv = "__coverage__",
      coverageData = {
    path: "/home/doichain/dapp/imports/startup/server/dns-configuration.js",
    statementMap: {
      "0": {
        start: {
          line: 1,
          column: 33
        },
        end: {
          line: 1,
          column: 47
        }
      }
    },
    fnMap: {},
    branchMap: {},
    s: {
      "0": 0
    },
    f: {},
    b: {},
    _coverageSchema: "43e27e138ebf9cfc5966b082cf9a028302ed4184"
  },
      coverage = global[gcv] || (global[gcv] = {});

  if (coverage[path] && coverage[path].hash === hash) {
    return coverage[path];
  }

  coverageData.hash = hash;
  return coverage[path] = coverageData;
}();

const FALLBACK_PROVIDER = (cov_yqfyehbz1.s[0]++, "doichain.org");
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

var cov_suly1lpcj = function () {
  var path = "/home/doichain/dapp/imports/startup/server/doichain-configuration.js",
      hash = "eac3ad2af78a590f1db14c87d9950168c6dfc696",
      Function = function () {}.constructor,
      global = new Function('return this')(),
      gcv = "__coverage__",
      coverageData = {
    path: "/home/doichain/dapp/imports/startup/server/doichain-configuration.js",
    statementMap: {
      "0": {
        start: {
          line: 4,
          column: 19
        },
        end: {
          line: 4,
          column: 39
        }
      },
      "1": {
        start: {
          line: 5,
          column: 17
        },
        end: {
          line: 5,
          column: 26
        }
      },
      "2": {
        start: {
          line: 6,
          column: 0
        },
        end: {
          line: 10,
          column: 1
        }
      },
      "3": {
        start: {
          line: 7,
          column: 2
        },
        end: {
          line: 8,
          column: 90
        }
      },
      "4": {
        start: {
          line: 8,
          column: 4
        },
        end: {
          line: 8,
          column: 90
        }
      },
      "5": {
        start: {
          line: 9,
          column: 2
        },
        end: {
          line: 9,
          column: 51
        }
      },
      "6": {
        start: {
          line: 11,
          column: 27
        },
        end: {
          line: 11,
          column: 37
        }
      },
      "7": {
        start: {
          line: 13,
          column: 22
        },
        end: {
          line: 13,
          column: 45
        }
      },
      "8": {
        start: {
          line: 14,
          column: 20
        },
        end: {
          line: 14,
          column: 29
        }
      },
      "9": {
        start: {
          line: 15,
          column: 21
        },
        end: {
          line: 15,
          column: 30
        }
      },
      "10": {
        start: {
          line: 16,
          column: 0
        },
        end: {
          line: 21,
          column: 1
        }
      },
      "11": {
        start: {
          line: 17,
          column: 2
        },
        end: {
          line: 18,
          column: 96
        }
      },
      "12": {
        start: {
          line: 18,
          column: 4
        },
        end: {
          line: 18,
          column: 96
        }
      },
      "13": {
        start: {
          line: 19,
          column: 2
        },
        end: {
          line: 19,
          column: 57
        }
      },
      "14": {
        start: {
          line: 20,
          column: 2
        },
        end: {
          line: 20,
          column: 52
        }
      },
      "15": {
        start: {
          line: 22,
          column: 30
        },
        end: {
          line: 22,
          column: 43
        }
      },
      "16": {
        start: {
          line: 23,
          column: 31
        },
        end: {
          line: 23,
          column: 45
        }
      },
      "17": {
        start: {
          line: 25,
          column: 21
        },
        end: {
          line: 25,
          column: 43
        }
      },
      "18": {
        start: {
          line: 26,
          column: 19
        },
        end: {
          line: 26,
          column: 28
        }
      },
      "19": {
        start: {
          line: 27,
          column: 0
        },
        end: {
          line: 31,
          column: 1
        }
      },
      "20": {
        start: {
          line: 28,
          column: 2
        },
        end: {
          line: 29,
          column: 94
        }
      },
      "21": {
        start: {
          line: 29,
          column: 4
        },
        end: {
          line: 29,
          column: 94
        }
      },
      "22": {
        start: {
          line: 30,
          column: 2
        },
        end: {
          line: 30,
          column: 55
        }
      },
      "23": {
        start: {
          line: 32,
          column: 29
        },
        end: {
          line: 32,
          column: 41
        }
      },
      "24": {
        start: {
          line: 35,
          column: 2
        },
        end: {
          line: 40,
          column: 5
        }
      }
    },
    fnMap: {
      "0": {
        name: "createClient",
        decl: {
          start: {
            line: 34,
            column: 9
          },
          end: {
            line: 34,
            column: 21
          }
        },
        loc: {
          start: {
            line: 34,
            column: 32
          },
          end: {
            line: 41,
            column: 1
          }
        },
        line: 34
      }
    },
    branchMap: {
      "0": {
        loc: {
          start: {
            line: 6,
            column: 0
          },
          end: {
            line: 10,
            column: 1
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 6,
            column: 0
          },
          end: {
            line: 10,
            column: 1
          }
        }, {
          start: {
            line: 6,
            column: 0
          },
          end: {
            line: 10,
            column: 1
          }
        }],
        line: 6
      },
      "1": {
        loc: {
          start: {
            line: 7,
            column: 2
          },
          end: {
            line: 8,
            column: 90
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 7,
            column: 2
          },
          end: {
            line: 8,
            column: 90
          }
        }, {
          start: {
            line: 7,
            column: 2
          },
          end: {
            line: 8,
            column: 90
          }
        }],
        line: 7
      },
      "2": {
        loc: {
          start: {
            line: 7,
            column: 5
          },
          end: {
            line: 7,
            column: 44
          }
        },
        type: "binary-expr",
        locations: [{
          start: {
            line: 7,
            column: 5
          },
          end: {
            line: 7,
            column: 18
          }
        }, {
          start: {
            line: 7,
            column: 22
          },
          end: {
            line: 7,
            column: 44
          }
        }],
        line: 7
      },
      "3": {
        loc: {
          start: {
            line: 16,
            column: 0
          },
          end: {
            line: 21,
            column: 1
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 16,
            column: 0
          },
          end: {
            line: 21,
            column: 1
          }
        }, {
          start: {
            line: 16,
            column: 0
          },
          end: {
            line: 21,
            column: 1
          }
        }],
        line: 16
      },
      "4": {
        loc: {
          start: {
            line: 17,
            column: 2
          },
          end: {
            line: 18,
            column: 96
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 17,
            column: 2
          },
          end: {
            line: 18,
            column: 96
          }
        }, {
          start: {
            line: 17,
            column: 2
          },
          end: {
            line: 18,
            column: 96
          }
        }],
        line: 17
      },
      "5": {
        loc: {
          start: {
            line: 17,
            column: 5
          },
          end: {
            line: 17,
            column: 50
          }
        },
        type: "binary-expr",
        locations: [{
          start: {
            line: 17,
            column: 5
          },
          end: {
            line: 17,
            column: 21
          }
        }, {
          start: {
            line: 17,
            column: 25
          },
          end: {
            line: 17,
            column: 50
          }
        }],
        line: 17
      },
      "6": {
        loc: {
          start: {
            line: 27,
            column: 0
          },
          end: {
            line: 31,
            column: 1
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 27,
            column: 0
          },
          end: {
            line: 31,
            column: 1
          }
        }, {
          start: {
            line: 27,
            column: 0
          },
          end: {
            line: 31,
            column: 1
          }
        }],
        line: 27
      },
      "7": {
        loc: {
          start: {
            line: 28,
            column: 2
          },
          end: {
            line: 29,
            column: 94
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 28,
            column: 2
          },
          end: {
            line: 29,
            column: 94
          }
        }, {
          start: {
            line: 28,
            column: 2
          },
          end: {
            line: 29,
            column: 94
          }
        }],
        line: 28
      },
      "8": {
        loc: {
          start: {
            line: 28,
            column: 5
          },
          end: {
            line: 28,
            column: 48
          }
        },
        type: "binary-expr",
        locations: [{
          start: {
            line: 28,
            column: 5
          },
          end: {
            line: 28,
            column: 20
          }
        }, {
          start: {
            line: 28,
            column: 24
          },
          end: {
            line: 28,
            column: 48
          }
        }],
        line: 28
      }
    },
    s: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0,
      "7": 0,
      "8": 0,
      "9": 0,
      "10": 0,
      "11": 0,
      "12": 0,
      "13": 0,
      "14": 0,
      "15": 0,
      "16": 0,
      "17": 0,
      "18": 0,
      "19": 0,
      "20": 0,
      "21": 0,
      "22": 0,
      "23": 0,
      "24": 0
    },
    f: {
      "0": 0
    },
    b: {
      "0": [0, 0],
      "1": [0, 0],
      "2": [0, 0],
      "3": [0, 0],
      "4": [0, 0],
      "5": [0, 0],
      "6": [0, 0],
      "7": [0, 0],
      "8": [0, 0]
    },
    _coverageSchema: "43e27e138ebf9cfc5966b082cf9a028302ed4184"
  },
      coverage = global[gcv] || (global[gcv] = {});

  if (coverage[path] && coverage[path].hash === hash) {
    return coverage[path];
  }

  coverageData.hash = hash;
  return coverage[path] = coverageData;
}();

var sendSettings = (cov_suly1lpcj.s[0]++, Meteor.settings.send);
var sendClient = (cov_suly1lpcj.s[1]++, undefined);
cov_suly1lpcj.s[2]++;

if (isAppType(SEND_APP)) {
  cov_suly1lpcj.b[0][0]++;
  cov_suly1lpcj.s[3]++;

  if ((cov_suly1lpcj.b[2][0]++, !sendSettings) || (cov_suly1lpcj.b[2][1]++, !sendSettings.doichain)) {
    cov_suly1lpcj.b[1][0]++;
    cov_suly1lpcj.s[4]++;
    throw new Meteor.Error("config.send.doichain", "Send app doichain settings not found");
  } else {
    cov_suly1lpcj.b[1][1]++;
  }

  cov_suly1lpcj.s[5]++;
  sendClient = createClient(sendSettings.doichain);
} else {
  cov_suly1lpcj.b[0][1]++;
}

const SEND_CLIENT = (cov_suly1lpcj.s[6]++, sendClient);
var confirmSettings = (cov_suly1lpcj.s[7]++, Meteor.settings.confirm);
var confirmClient = (cov_suly1lpcj.s[8]++, undefined);
var confirmAddress = (cov_suly1lpcj.s[9]++, undefined);
cov_suly1lpcj.s[10]++;

if (isAppType(CONFIRM_APP)) {
  cov_suly1lpcj.b[3][0]++;
  cov_suly1lpcj.s[11]++;

  if ((cov_suly1lpcj.b[5][0]++, !confirmSettings) || (cov_suly1lpcj.b[5][1]++, !confirmSettings.doichain)) {
    cov_suly1lpcj.b[4][0]++;
    cov_suly1lpcj.s[12]++;
    throw new Meteor.Error("config.confirm.doichain", "Confirm app doichain settings not found");
  } else {
    cov_suly1lpcj.b[4][1]++;
  }

  cov_suly1lpcj.s[13]++;
  confirmClient = createClient(confirmSettings.doichain);
  cov_suly1lpcj.s[14]++;
  confirmAddress = confirmSettings.doichain.address;
} else {
  cov_suly1lpcj.b[3][1]++;
}

const CONFIRM_CLIENT = (cov_suly1lpcj.s[15]++, confirmClient);
const CONFIRM_ADDRESS = (cov_suly1lpcj.s[16]++, confirmAddress);
var verifySettings = (cov_suly1lpcj.s[17]++, Meteor.settings.verify);
var verifyClient = (cov_suly1lpcj.s[18]++, undefined);
cov_suly1lpcj.s[19]++;

if (isAppType(VERIFY_APP)) {
  cov_suly1lpcj.b[6][0]++;
  cov_suly1lpcj.s[20]++;

  if ((cov_suly1lpcj.b[8][0]++, !verifySettings) || (cov_suly1lpcj.b[8][1]++, !verifySettings.doichain)) {
    cov_suly1lpcj.b[7][0]++;
    cov_suly1lpcj.s[21]++;
    throw new Meteor.Error("config.verify.doichain", "Verify app doichain settings not found");
  } else {
    cov_suly1lpcj.b[7][1]++;
  }

  cov_suly1lpcj.s[22]++;
  verifyClient = createClient(verifySettings.doichain);
} else {
  cov_suly1lpcj.b[6][1]++;
}

const VERIFY_CLIENT = (cov_suly1lpcj.s[23]++, verifyClient);

function createClient(settings) {
  cov_suly1lpcj.f[0]++;
  cov_suly1lpcj.s[24]++;
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

var cov_dlhgit1rs = function () {
  var path = "/home/doichain/dapp/imports/startup/server/email-configuration.js",
      hash = "82d7c854f6a8e52ef1011712cc87289d62113165",
      Function = function () {}.constructor,
      global = new Function('return this')(),
      gcv = "__coverage__",
      coverageData = {
    path: "/home/doichain/dapp/imports/startup/server/email-configuration.js",
    statementMap: {
      "0": {
        start: {
          line: 7,
          column: 23
        },
        end: {
          line: 7,
          column: 102
        }
      },
      "1": {
        start: {
          line: 9,
          column: 19
        },
        end: {
          line: 9,
          column: 39
        }
      },
      "2": {
        start: {
          line: 10,
          column: 22
        },
        end: {
          line: 10,
          column: 31
        }
      },
      "3": {
        start: {
          line: 12,
          column: 0
        },
        end: {
          line: 16,
          column: 1
        }
      },
      "4": {
        start: {
          line: 13,
          column: 2
        },
        end: {
          line: 14,
          column: 70
        }
      },
      "5": {
        start: {
          line: 14,
          column: 4
        },
        end: {
          line: 14,
          column: 70
        }
      },
      "6": {
        start: {
          line: 15,
          column: 2
        },
        end: {
          line: 15,
          column: 49
        }
      },
      "7": {
        start: {
          line: 17,
          column: 34
        },
        end: {
          line: 17,
          column: 49
        }
      },
      "8": {
        start: {
          line: 19,
          column: 18
        },
        end: {
          line: 19,
          column: 27
        }
      },
      "9": {
        start: {
          line: 20,
          column: 0
        },
        end: {
          line: 54,
          column: 1
        }
      },
      "10": {
        start: {
          line: 21,
          column: 24
        },
        end: {
          line: 21,
          column: 47
        }
      },
      "11": {
        start: {
          line: 23,
          column: 2
        },
        end: {
          line: 24,
          column: 98
        }
      },
      "12": {
        start: {
          line: 24,
          column: 8
        },
        end: {
          line: 24,
          column: 98
        }
      },
      "13": {
        start: {
          line: 26,
          column: 2
        },
        end: {
          line: 27,
          column: 103
        }
      },
      "14": {
        start: {
          line: 27,
          column: 8
        },
        end: {
          line: 27,
          column: 103
        }
      },
      "15": {
        start: {
          line: 29,
          column: 2
        },
        end: {
          line: 29,
          column: 51
        }
      },
      "16": {
        start: {
          line: 31,
          column: 2
        },
        end: {
          line: 31,
          column: 54
        }
      },
      "17": {
        start: {
          line: 33,
          column: 2
        },
        end: {
          line: 53,
          column: 5
        }
      },
      "18": {
        start: {
          line: 35,
          column: 3
        },
        end: {
          line: 47,
          column: 4
        }
      },
      "19": {
        start: {
          line: 36,
          column: 7
        },
        end: {
          line: 39,
          column: 37
        }
      },
      "20": {
        start: {
          line: 41,
          column: 7
        },
        end: {
          line: 46,
          column: 37
        }
      },
      "21": {
        start: {
          line: 49,
          column: 3
        },
        end: {
          line: 49,
          column: 54
        }
      },
      "22": {
        start: {
          line: 51,
          column: 3
        },
        end: {
          line: 52,
          column: 100
        }
      },
      "23": {
        start: {
          line: 52,
          column: 7
        },
        end: {
          line: 52,
          column: 100
        }
      },
      "24": {
        start: {
          line: 55,
          column: 43
        },
        end: {
          line: 55,
          column: 54
        }
      }
    },
    fnMap: {
      "0": {
        name: "(anonymous_0)",
        decl: {
          start: {
            line: 33,
            column: 17
          },
          end: {
            line: 33,
            column: 18
          }
        },
        loc: {
          start: {
            line: 33,
            column: 23
          },
          end: {
            line: 53,
            column: 3
          }
        },
        line: 33
      }
    },
    branchMap: {
      "0": {
        loc: {
          start: {
            line: 12,
            column: 0
          },
          end: {
            line: 16,
            column: 1
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 12,
            column: 0
          },
          end: {
            line: 16,
            column: 1
          }
        }, {
          start: {
            line: 12,
            column: 0
          },
          end: {
            line: 16,
            column: 1
          }
        }],
        line: 12
      },
      "1": {
        loc: {
          start: {
            line: 13,
            column: 2
          },
          end: {
            line: 14,
            column: 70
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 13,
            column: 2
          },
          end: {
            line: 14,
            column: 70
          }
        }, {
          start: {
            line: 13,
            column: 2
          },
          end: {
            line: 14,
            column: 70
          }
        }],
        line: 13
      },
      "2": {
        loc: {
          start: {
            line: 13,
            column: 5
          },
          end: {
            line: 13,
            column: 51
          }
        },
        type: "binary-expr",
        locations: [{
          start: {
            line: 13,
            column: 5
          },
          end: {
            line: 13,
            column: 18
          }
        }, {
          start: {
            line: 13,
            column: 22
          },
          end: {
            line: 13,
            column: 51
          }
        }],
        line: 13
      },
      "3": {
        loc: {
          start: {
            line: 20,
            column: 0
          },
          end: {
            line: 54,
            column: 1
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 20,
            column: 0
          },
          end: {
            line: 54,
            column: 1
          }
        }, {
          start: {
            line: 20,
            column: 0
          },
          end: {
            line: 54,
            column: 1
          }
        }],
        line: 20
      },
      "4": {
        loc: {
          start: {
            line: 23,
            column: 2
          },
          end: {
            line: 24,
            column: 98
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 23,
            column: 2
          },
          end: {
            line: 24,
            column: 98
          }
        }, {
          start: {
            line: 23,
            column: 2
          },
          end: {
            line: 24,
            column: 98
          }
        }],
        line: 23
      },
      "5": {
        loc: {
          start: {
            line: 23,
            column: 5
          },
          end: {
            line: 23,
            column: 46
          }
        },
        type: "binary-expr",
        locations: [{
          start: {
            line: 23,
            column: 5
          },
          end: {
            line: 23,
            column: 21
          }
        }, {
          start: {
            line: 23,
            column: 25
          },
          end: {
            line: 23,
            column: 46
          }
        }],
        line: 23
      },
      "6": {
        loc: {
          start: {
            line: 26,
            column: 2
          },
          end: {
            line: 27,
            column: 103
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 26,
            column: 2
          },
          end: {
            line: 27,
            column: 103
          }
        }, {
          start: {
            line: 26,
            column: 2
          },
          end: {
            line: 27,
            column: 103
          }
        }],
        line: 26
      },
      "7": {
        loc: {
          start: {
            line: 35,
            column: 3
          },
          end: {
            line: 47,
            column: 4
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 35,
            column: 3
          },
          end: {
            line: 47,
            column: 4
          }
        }, {
          start: {
            line: 35,
            column: 3
          },
          end: {
            line: 47,
            column: 4
          }
        }],
        line: 35
      },
      "8": {
        loc: {
          start: {
            line: 51,
            column: 3
          },
          end: {
            line: 52,
            column: 100
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 51,
            column: 3
          },
          end: {
            line: 52,
            column: 100
          }
        }, {
          start: {
            line: 51,
            column: 3
          },
          end: {
            line: 52,
            column: 100
          }
        }],
        line: 51
      }
    },
    s: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0,
      "7": 0,
      "8": 0,
      "9": 0,
      "10": 0,
      "11": 0,
      "12": 0,
      "13": 0,
      "14": 0,
      "15": 0,
      "16": 0,
      "17": 0,
      "18": 0,
      "19": 0,
      "20": 0,
      "21": 0,
      "22": 0,
      "23": 0,
      "24": 0
    },
    f: {
      "0": 0
    },
    b: {
      "0": [0, 0],
      "1": [0, 0],
      "2": [0, 0],
      "3": [0, 0],
      "4": [0, 0],
      "5": [0, 0],
      "6": [0, 0],
      "7": [0, 0],
      "8": [0, 0]
    },
    _coverageSchema: "43e27e138ebf9cfc5966b082cf9a028302ed4184"
  },
      coverage = global[gcv] || (global[gcv] = {});

  if (coverage[path] && coverage[path].hash === hash) {
    return coverage[path];
  }

  coverageData.hash = hash;
  return coverage[path] = coverageData;
}();

const HashIds = (cov_dlhgit1rs.s[0]++, new Hashids('0xugmLe7Nyee6vk1iF88(6CmwpqoG4hQ*-T74tjYw^O2vOO(Xl-91wA8*nCg_lX$'));
var sendSettings = (cov_dlhgit1rs.s[1]++, Meteor.settings.send);
var doiMailFetchUrl = (cov_dlhgit1rs.s[2]++, undefined);
cov_dlhgit1rs.s[3]++;

if (isAppType(SEND_APP)) {
  cov_dlhgit1rs.b[0][0]++;
  cov_dlhgit1rs.s[4]++;

  if ((cov_dlhgit1rs.b[2][0]++, !sendSettings) || (cov_dlhgit1rs.b[2][1]++, !sendSettings.doiMailFetchUrl)) {
    cov_dlhgit1rs.b[1][0]++;
    cov_dlhgit1rs.s[5]++;
    throw new Meteor.Error("config.send.email", "Settings not found");
  } else {
    cov_dlhgit1rs.b[1][1]++;
  }

  cov_dlhgit1rs.s[6]++;
  doiMailFetchUrl = sendSettings.doiMailFetchUrl;
} else {
  cov_dlhgit1rs.b[0][1]++;
}

const DOI_MAIL_FETCH_URL = (cov_dlhgit1rs.s[7]++, doiMailFetchUrl);
var defaultFrom = (cov_dlhgit1rs.s[8]++, undefined);
cov_dlhgit1rs.s[9]++;

if (isAppType(CONFIRM_APP)) {
  cov_dlhgit1rs.b[3][0]++;
  var confirmSettings = (cov_dlhgit1rs.s[10]++, Meteor.settings.confirm);
  cov_dlhgit1rs.s[11]++;

  if ((cov_dlhgit1rs.b[5][0]++, !confirmSettings) || (cov_dlhgit1rs.b[5][1]++, !confirmSettings.smtp)) {
    cov_dlhgit1rs.b[4][0]++;
    cov_dlhgit1rs.s[12]++;
    throw new Meteor.Error("config.confirm.smtp", "Confirm app email smtp settings not found");
  } else {
    cov_dlhgit1rs.b[4][1]++;
  }

  cov_dlhgit1rs.s[13]++;

  if (!confirmSettings.smtp.defaultFrom) {
    cov_dlhgit1rs.b[6][0]++;
    cov_dlhgit1rs.s[14]++;
    throw new Meteor.Error("config.confirm.defaultFrom", "Confirm app email defaultFrom not found");
  } else {
    cov_dlhgit1rs.b[6][1]++;
  }

  cov_dlhgit1rs.s[15]++;
  defaultFrom = confirmSettings.smtp.defaultFrom;
  cov_dlhgit1rs.s[16]++;
  logConfirm('sending with defaultFrom:', defaultFrom);
  cov_dlhgit1rs.s[17]++;
  Meteor.startup(() => {
    cov_dlhgit1rs.f[0]++;
    cov_dlhgit1rs.s[18]++;

    if (confirmSettings.smtp.username === undefined) {
      cov_dlhgit1rs.b[7][0]++;
      cov_dlhgit1rs.s[19]++;
      process.env.MAIL_URL = 'smtp://' + encodeURIComponent(confirmSettings.smtp.server) + ':' + confirmSettings.smtp.port;
    } else {
      cov_dlhgit1rs.b[7][1]++;
      cov_dlhgit1rs.s[20]++;
      process.env.MAIL_URL = 'smtp://' + encodeURIComponent(confirmSettings.smtp.username) + ':' + encodeURIComponent(confirmSettings.smtp.password) + '@' + encodeURIComponent(confirmSettings.smtp.server) + ':' + confirmSettings.smtp.port;
    }

    cov_dlhgit1rs.s[21]++;
    logConfirm('using MAIL_URL:', process.env.MAIL_URL);
    cov_dlhgit1rs.s[22]++;

    if (confirmSettings.smtp.NODE_TLS_REJECT_UNAUTHORIZED !== undefined) {
      cov_dlhgit1rs.b[8][0]++;
      cov_dlhgit1rs.s[23]++;
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = confirmSettings.smtp.NODE_TLS_REJECT_UNAUTHORIZED;
    } else {
      cov_dlhgit1rs.b[8][1]++;
    } //0

  });
} else {
  cov_dlhgit1rs.b[3][1]++;
}

const DOI_MAIL_DEFAULT_EMAIL_FROM = (cov_dlhgit1rs.s[24]++, defaultFrom);
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

var cov_461pj3f4o = function () {
  var path = "/home/doichain/dapp/imports/startup/server/fixtures.js",
      hash = "4e4be0fa02e6060c62fbc038c649511711144029",
      Function = function () {}.constructor,
      global = new Function('return this')(),
      gcv = "__coverage__",
      coverageData = {
    path: "/home/doichain/dapp/imports/startup/server/fixtures.js",
    statementMap: {
      "0": {
        start: {
          line: 4,
          column: 0
        },
        end: {
          line: 13,
          column: 3
        }
      },
      "1": {
        start: {
          line: 5,
          column: 2
        },
        end: {
          line: 12,
          column: 3
        }
      },
      "2": {
        start: {
          line: 6,
          column: 15
        },
        end: {
          line: 10,
          column: 6
        }
      },
      "3": {
        start: {
          line: 11,
          column: 4
        },
        end: {
          line: 11,
          column: 39
        }
      }
    },
    fnMap: {
      "0": {
        name: "(anonymous_0)",
        decl: {
          start: {
            line: 4,
            column: 15
          },
          end: {
            line: 4,
            column: 16
          }
        },
        loc: {
          start: {
            line: 4,
            column: 21
          },
          end: {
            line: 13,
            column: 1
          }
        },
        line: 4
      }
    },
    branchMap: {
      "0": {
        loc: {
          start: {
            line: 5,
            column: 2
          },
          end: {
            line: 12,
            column: 3
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 5,
            column: 2
          },
          end: {
            line: 12,
            column: 3
          }
        }, {
          start: {
            line: 5,
            column: 2
          },
          end: {
            line: 12,
            column: 3
          }
        }],
        line: 5
      }
    },
    s: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0
    },
    f: {
      "0": 0
    },
    b: {
      "0": [0, 0]
    },
    _coverageSchema: "43e27e138ebf9cfc5966b082cf9a028302ed4184"
  },
      coverage = global[gcv] || (global[gcv] = {});

  if (coverage[path] && coverage[path].hash === hash) {
    return coverage[path];
  }

  coverageData.hash = hash;
  return coverage[path] = coverageData;
}();

cov_461pj3f4o.s[0]++;
Meteor.startup(() => {
  cov_461pj3f4o.f[0]++;
  cov_461pj3f4o.s[1]++;

  if (Meteor.users.find().count() === 0) {
    cov_461pj3f4o.b[0][0]++;
    const id = (cov_461pj3f4o.s[2]++, Accounts.createUser({
      username: 'admin',
      email: 'admin@sendeffect.de',
      password: 'password'
    }));
    cov_461pj3f4o.s[3]++;
    Roles.addUsersToRoles(id, 'admin');
  } else {
    cov_461pj3f4o.b[0][1]++;
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

var cov_2p911nr54w = function () {
  var path = "/home/doichain/dapp/imports/startup/server/index.js",
      hash = "fc102a9fad0bf0a5fb3a8f5a9209520fa548366f",
      Function = function () {}.constructor,
      global = new Function('return this')(),
      gcv = "__coverage__",
      coverageData = {
    path: "/home/doichain/dapp/imports/startup/server/index.js",
    statementMap: {},
    fnMap: {},
    branchMap: {},
    s: {},
    f: {},
    b: {},
    _coverageSchema: "43e27e138ebf9cfc5966b082cf9a028302ed4184"
  },
      coverage = global[gcv] || (global[gcv] = {});

  if (coverage[path] && coverage[path].hash === hash) {
    return coverage[path];
  }

  coverageData.hash = hash;
  return coverage[path] = coverageData;
}();
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

var cov_k9ajmscq3 = function () {
  var path = "/home/doichain/dapp/imports/startup/server/jobs.js",
      hash = "b957889fd7c71f9e5ab595f7de7b3ca56776d14c",
      Function = function () {}.constructor,
      global = new Function('return this')(),
      gcv = "__coverage__",
      coverageData = {
    path: "/home/doichain/dapp/imports/startup/server/jobs.js",
    statementMap: {
      "0": {
        start: {
          line: 8,
          column: 0
        },
        end: {
          line: 13,
          column: 3
        }
      },
      "1": {
        start: {
          line: 9,
          column: 2
        },
        end: {
          line: 9,
          column: 28
        }
      },
      "2": {
        start: {
          line: 10,
          column: 2
        },
        end: {
          line: 10,
          column: 34
        }
      },
      "3": {
        start: {
          line: 11,
          column: 2
        },
        end: {
          line: 11,
          column: 28
        }
      },
      "4": {
        start: {
          line: 12,
          column: 2
        },
        end: {
          line: 12,
          column: 68
        }
      },
      "5": {
        start: {
          line: 12,
          column: 29
        },
        end: {
          line: 12,
          column: 68
        }
      }
    },
    fnMap: {
      "0": {
        name: "(anonymous_0)",
        decl: {
          start: {
            line: 8,
            column: 15
          },
          end: {
            line: 8,
            column: 16
          }
        },
        loc: {
          start: {
            line: 8,
            column: 21
          },
          end: {
            line: 13,
            column: 1
          }
        },
        line: 8
      }
    },
    branchMap: {
      "0": {
        loc: {
          start: {
            line: 12,
            column: 2
          },
          end: {
            line: 12,
            column: 68
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 12,
            column: 2
          },
          end: {
            line: 12,
            column: 68
          }
        }, {
          start: {
            line: 12,
            column: 2
          },
          end: {
            line: 12,
            column: 68
          }
        }],
        line: 12
      }
    },
    s: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0
    },
    f: {
      "0": 0
    },
    b: {
      "0": [0, 0]
    },
    _coverageSchema: "43e27e138ebf9cfc5966b082cf9a028302ed4184"
  },
      coverage = global[gcv] || (global[gcv] = {});

  if (coverage[path] && coverage[path].hash === hash) {
    return coverage[path];
  }

  coverageData.hash = hash;
  return coverage[path] = coverageData;
}();

cov_k9ajmscq3.s[0]++;
Meteor.startup(() => {
  cov_k9ajmscq3.f[0]++;
  cov_k9ajmscq3.s[1]++;
  MailJobs.startJobServer();
  cov_k9ajmscq3.s[2]++;
  BlockchainJobs.startJobServer();
  cov_k9ajmscq3.s[3]++;
  DAppJobs.startJobServer();
  cov_k9ajmscq3.s[4]++;

  if (isAppType(CONFIRM_APP)) {
    cov_k9ajmscq3.b[0][0]++;
    cov_k9ajmscq3.s[5]++;
    addCheckNewTransactionsBlockchainJob();
  } else {
    cov_k9ajmscq3.b[0][1]++;
  }
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

var cov_226osv231b = function () {
  var path = "/home/doichain/dapp/imports/startup/server/log-configuration.js",
      hash = "8e9b18b123658ff387ce153499dd206fbc2f13b0",
      Function = function () {}.constructor,
      global = new Function('return this')(),
      gcv = "__coverage__",
      coverageData = {
    path: "/home/doichain/dapp/imports/startup/server/log-configuration.js",
    statementMap: {
      "0": {
        start: {
          line: 3,
          column: 0
        },
        end: {
          line: 3,
          column: 23
        }
      },
      "1": {
        start: {
          line: 5,
          column: 23
        },
        end: {
          line: 5,
          column: 38
        }
      },
      "2": {
        start: {
          line: 6,
          column: 32
        },
        end: {
          line: 6,
          column: 83
        }
      },
      "3": {
        start: {
          line: 7,
          column: 35
        },
        end: {
          line: 7,
          column: 87
        }
      },
      "4": {
        start: {
          line: 8,
          column: 34
        },
        end: {
          line: 8,
          column: 86
        }
      },
      "5": {
        start: {
          line: 9,
          column: 38
        },
        end: {
          line: 9,
          column: 94
        }
      },
      "6": {
        start: {
          line: 10,
          column: 35
        },
        end: {
          line: 10,
          column: 89
        }
      },
      "7": {
        start: {
          line: 13,
          column: 4
        },
        end: {
          line: 13,
          column: 85
        }
      },
      "8": {
        start: {
          line: 13,
          column: 19
        },
        end: {
          line: 13,
          column: 84
        }
      },
      "9": {
        start: {
          line: 17,
          column: 4
        },
        end: {
          line: 17,
          column: 89
        }
      },
      "10": {
        start: {
          line: 17,
          column: 19
        },
        end: {
          line: 17,
          column: 88
        }
      },
      "11": {
        start: {
          line: 21,
          column: 4
        },
        end: {
          line: 21,
          column: 88
        }
      },
      "12": {
        start: {
          line: 21,
          column: 19
        },
        end: {
          line: 21,
          column: 87
        }
      },
      "13": {
        start: {
          line: 25,
          column: 4
        },
        end: {
          line: 25,
          column: 91
        }
      },
      "14": {
        start: {
          line: 25,
          column: 18
        },
        end: {
          line: 25,
          column: 90
        }
      },
      "15": {
        start: {
          line: 29,
          column: 4
        },
        end: {
          line: 29,
          column: 91
        }
      },
      "16": {
        start: {
          line: 29,
          column: 18
        },
        end: {
          line: 29,
          column: 90
        }
      },
      "17": {
        start: {
          line: 33,
          column: 4
        },
        end: {
          line: 33,
          column: 93
        }
      },
      "18": {
        start: {
          line: 33,
          column: 18
        },
        end: {
          line: 33,
          column: 92
        }
      },
      "19": {
        start: {
          line: 37,
          column: 4
        },
        end: {
          line: 37,
          column: 88
        }
      },
      "20": {
        start: {
          line: 37,
          column: 18
        },
        end: {
          line: 37,
          column: 87
        }
      }
    },
    fnMap: {
      "0": {
        name: "logSend",
        decl: {
          start: {
            line: 12,
            column: 16
          },
          end: {
            line: 12,
            column: 23
          }
        },
        loc: {
          start: {
            line: 12,
            column: 39
          },
          end: {
            line: 14,
            column: 1
          }
        },
        line: 12
      },
      "1": {
        name: "logConfirm",
        decl: {
          start: {
            line: 16,
            column: 16
          },
          end: {
            line: 16,
            column: 26
          }
        },
        loc: {
          start: {
            line: 16,
            column: 42
          },
          end: {
            line: 18,
            column: 1
          }
        },
        line: 16
      },
      "2": {
        name: "logVerify",
        decl: {
          start: {
            line: 20,
            column: 16
          },
          end: {
            line: 20,
            column: 25
          }
        },
        loc: {
          start: {
            line: 20,
            column: 42
          },
          end: {
            line: 22,
            column: 1
          }
        },
        line: 20
      },
      "3": {
        name: "logBlockchain",
        decl: {
          start: {
            line: 24,
            column: 16
          },
          end: {
            line: 24,
            column: 29
          }
        },
        loc: {
          start: {
            line: 24,
            column: 46
          },
          end: {
            line: 26,
            column: 1
          }
        },
        line: 24
      },
      "4": {
        name: "logMain",
        decl: {
          start: {
            line: 28,
            column: 16
          },
          end: {
            line: 28,
            column: 23
          }
        },
        loc: {
          start: {
            line: 28,
            column: 40
          },
          end: {
            line: 30,
            column: 1
          }
        },
        line: 28
      },
      "5": {
        name: "logError",
        decl: {
          start: {
            line: 32,
            column: 16
          },
          end: {
            line: 32,
            column: 24
          }
        },
        loc: {
          start: {
            line: 32,
            column: 41
          },
          end: {
            line: 34,
            column: 1
          }
        },
        line: 32
      },
      "6": {
        name: "testLogging",
        decl: {
          start: {
            line: 36,
            column: 16
          },
          end: {
            line: 36,
            column: 27
          }
        },
        loc: {
          start: {
            line: 36,
            column: 44
          },
          end: {
            line: 38,
            column: 1
          }
        },
        line: 36
      }
    },
    branchMap: {
      "0": {
        loc: {
          start: {
            line: 13,
            column: 4
          },
          end: {
            line: 13,
            column: 85
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 13,
            column: 4
          },
          end: {
            line: 13,
            column: 85
          }
        }, {
          start: {
            line: 13,
            column: 4
          },
          end: {
            line: 13,
            column: 85
          }
        }],
        line: 13
      },
      "1": {
        loc: {
          start: {
            line: 13,
            column: 68
          },
          end: {
            line: 13,
            column: 82
          }
        },
        type: "cond-expr",
        locations: [{
          start: {
            line: 13,
            column: 74
          },
          end: {
            line: 13,
            column: 79
          }
        }, {
          start: {
            line: 13,
            column: 80
          },
          end: {
            line: 13,
            column: 82
          }
        }],
        line: 13
      },
      "2": {
        loc: {
          start: {
            line: 17,
            column: 4
          },
          end: {
            line: 17,
            column: 89
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 17,
            column: 4
          },
          end: {
            line: 17,
            column: 89
          }
        }, {
          start: {
            line: 17,
            column: 4
          },
          end: {
            line: 17,
            column: 89
          }
        }],
        line: 17
      },
      "3": {
        loc: {
          start: {
            line: 17,
            column: 72
          },
          end: {
            line: 17,
            column: 86
          }
        },
        type: "cond-expr",
        locations: [{
          start: {
            line: 17,
            column: 78
          },
          end: {
            line: 17,
            column: 83
          }
        }, {
          start: {
            line: 17,
            column: 84
          },
          end: {
            line: 17,
            column: 86
          }
        }],
        line: 17
      },
      "4": {
        loc: {
          start: {
            line: 21,
            column: 4
          },
          end: {
            line: 21,
            column: 88
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 21,
            column: 4
          },
          end: {
            line: 21,
            column: 88
          }
        }, {
          start: {
            line: 21,
            column: 4
          },
          end: {
            line: 21,
            column: 88
          }
        }],
        line: 21
      },
      "5": {
        loc: {
          start: {
            line: 21,
            column: 71
          },
          end: {
            line: 21,
            column: 85
          }
        },
        type: "cond-expr",
        locations: [{
          start: {
            line: 21,
            column: 77
          },
          end: {
            line: 21,
            column: 82
          }
        }, {
          start: {
            line: 21,
            column: 83
          },
          end: {
            line: 21,
            column: 85
          }
        }],
        line: 21
      },
      "6": {
        loc: {
          start: {
            line: 25,
            column: 4
          },
          end: {
            line: 25,
            column: 91
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 25,
            column: 4
          },
          end: {
            line: 25,
            column: 91
          }
        }, {
          start: {
            line: 25,
            column: 4
          },
          end: {
            line: 25,
            column: 91
          }
        }],
        line: 25
      },
      "7": {
        loc: {
          start: {
            line: 25,
            column: 74
          },
          end: {
            line: 25,
            column: 88
          }
        },
        type: "cond-expr",
        locations: [{
          start: {
            line: 25,
            column: 80
          },
          end: {
            line: 25,
            column: 85
          }
        }, {
          start: {
            line: 25,
            column: 86
          },
          end: {
            line: 25,
            column: 88
          }
        }],
        line: 25
      },
      "8": {
        loc: {
          start: {
            line: 29,
            column: 4
          },
          end: {
            line: 29,
            column: 91
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 29,
            column: 4
          },
          end: {
            line: 29,
            column: 91
          }
        }, {
          start: {
            line: 29,
            column: 4
          },
          end: {
            line: 29,
            column: 91
          }
        }],
        line: 29
      },
      "9": {
        loc: {
          start: {
            line: 29,
            column: 74
          },
          end: {
            line: 29,
            column: 88
          }
        },
        type: "cond-expr",
        locations: [{
          start: {
            line: 29,
            column: 80
          },
          end: {
            line: 29,
            column: 85
          }
        }, {
          start: {
            line: 29,
            column: 86
          },
          end: {
            line: 29,
            column: 88
          }
        }],
        line: 29
      },
      "10": {
        loc: {
          start: {
            line: 33,
            column: 4
          },
          end: {
            line: 33,
            column: 93
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 33,
            column: 4
          },
          end: {
            line: 33,
            column: 93
          }
        }, {
          start: {
            line: 33,
            column: 4
          },
          end: {
            line: 33,
            column: 93
          }
        }],
        line: 33
      },
      "11": {
        loc: {
          start: {
            line: 33,
            column: 76
          },
          end: {
            line: 33,
            column: 90
          }
        },
        type: "cond-expr",
        locations: [{
          start: {
            line: 33,
            column: 82
          },
          end: {
            line: 33,
            column: 87
          }
        }, {
          start: {
            line: 33,
            column: 88
          },
          end: {
            line: 33,
            column: 90
          }
        }],
        line: 33
      },
      "12": {
        loc: {
          start: {
            line: 37,
            column: 4
          },
          end: {
            line: 37,
            column: 88
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 37,
            column: 4
          },
          end: {
            line: 37,
            column: 88
          }
        }, {
          start: {
            line: 37,
            column: 4
          },
          end: {
            line: 37,
            column: 88
          }
        }],
        line: 37
      },
      "13": {
        loc: {
          start: {
            line: 37,
            column: 71
          },
          end: {
            line: 37,
            column: 85
          }
        },
        type: "cond-expr",
        locations: [{
          start: {
            line: 37,
            column: 77
          },
          end: {
            line: 37,
            column: 82
          }
        }, {
          start: {
            line: 37,
            column: 83
          },
          end: {
            line: 37,
            column: 85
          }
        }],
        line: 37
      }
    },
    s: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0,
      "7": 0,
      "8": 0,
      "9": 0,
      "10": 0,
      "11": 0,
      "12": 0,
      "13": 0,
      "14": 0,
      "15": 0,
      "16": 0,
      "17": 0,
      "18": 0,
      "19": 0,
      "20": 0
    },
    f: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0
    },
    b: {
      "0": [0, 0],
      "1": [0, 0],
      "2": [0, 0],
      "3": [0, 0],
      "4": [0, 0],
      "5": [0, 0],
      "6": [0, 0],
      "7": [0, 0],
      "8": [0, 0],
      "9": [0, 0],
      "10": [0, 0],
      "11": [0, 0],
      "12": [0, 0],
      "13": [0, 0]
    },
    _coverageSchema: "43e27e138ebf9cfc5966b082cf9a028302ed4184"
  },
      coverage = global[gcv] || (global[gcv] = {});

  if (coverage[path] && coverage[path].hash === hash) {
    return coverage[path];
  }

  coverageData.hash = hash;
  return coverage[path] = coverageData;
}();

cov_226osv231b.s[0]++;

require('scribe-js')();

const console = (cov_226osv231b.s[1]++, process.console);
const sendModeTagColor = (cov_226osv231b.s[2]++, {
  msg: 'send-mode',
  colors: ['yellow', 'inverse']
});
const confirmModeTagColor = (cov_226osv231b.s[3]++, {
  msg: 'confirm-mode',
  colors: ['blue', 'inverse']
});
const verifyModeTagColor = (cov_226osv231b.s[4]++, {
  msg: 'verify-mode',
  colors: ['green', 'inverse']
});
const blockchainModeTagColor = (cov_226osv231b.s[5]++, {
  msg: 'blockchain-mode',
  colors: ['white', 'inverse']
});
const testingModeTagColor = (cov_226osv231b.s[6]++, {
  msg: 'testing-mode',
  colors: ['orange', 'inverse']
});

function logSend(message, param) {
  cov_226osv231b.f[0]++;
  cov_226osv231b.s[7]++;

  if (isDebug()) {
    cov_226osv231b.b[0][0]++;
    cov_226osv231b.s[8]++;
    console.time().tag(sendModeTagColor).log(message, param ? (cov_226osv231b.b[1][0]++, param) : (cov_226osv231b.b[1][1]++, ''));
  } else {
    cov_226osv231b.b[0][1]++;
  }
}

function logConfirm(message, param) {
  cov_226osv231b.f[1]++;
  cov_226osv231b.s[9]++;

  if (isDebug()) {
    cov_226osv231b.b[2][0]++;
    cov_226osv231b.s[10]++;
    console.time().tag(confirmModeTagColor).log(message, param ? (cov_226osv231b.b[3][0]++, param) : (cov_226osv231b.b[3][1]++, ''));
  } else {
    cov_226osv231b.b[2][1]++;
  }
}

function logVerify(message, param) {
  cov_226osv231b.f[2]++;
  cov_226osv231b.s[11]++;

  if (isDebug()) {
    cov_226osv231b.b[4][0]++;
    cov_226osv231b.s[12]++;
    console.time().tag(verifyModeTagColor).log(message, param ? (cov_226osv231b.b[5][0]++, param) : (cov_226osv231b.b[5][1]++, ''));
  } else {
    cov_226osv231b.b[4][1]++;
  }
}

function logBlockchain(message, param) {
  cov_226osv231b.f[3]++;
  cov_226osv231b.s[13]++;

  if (isDebug()) {
    cov_226osv231b.b[6][0]++;
    cov_226osv231b.s[14]++;
    console.time().tag(blockchainModeTagColor).log(message, param ? (cov_226osv231b.b[7][0]++, param) : (cov_226osv231b.b[7][1]++, ''));
  } else {
    cov_226osv231b.b[6][1]++;
  }
}

function logMain(message, param) {
  cov_226osv231b.f[4]++;
  cov_226osv231b.s[15]++;

  if (isDebug()) {
    cov_226osv231b.b[8][0]++;
    cov_226osv231b.s[16]++;
    console.time().tag(blockchainModeTagColor).log(message, param ? (cov_226osv231b.b[9][0]++, param) : (cov_226osv231b.b[9][1]++, ''));
  } else {
    cov_226osv231b.b[8][1]++;
  }
}

function logError(message, param) {
  cov_226osv231b.f[5]++;
  cov_226osv231b.s[17]++;

  if (isDebug()) {
    cov_226osv231b.b[10][0]++;
    cov_226osv231b.s[18]++;
    console.time().tag(blockchainModeTagColor).error(message, param ? (cov_226osv231b.b[11][0]++, param) : (cov_226osv231b.b[11][1]++, ''));
  } else {
    cov_226osv231b.b[10][1]++;
  }
}

function testLogging(message, param) {
  cov_226osv231b.f[6]++;
  cov_226osv231b.s[19]++;

  if (isDebug()) {
    cov_226osv231b.b[12][0]++;
    cov_226osv231b.s[20]++;
    console.time().tag(testingModeTagColor).log(message, param ? (cov_226osv231b.b[13][0]++, param) : (cov_226osv231b.b[13][1]++, ''));
  } else {
    cov_226osv231b.b[12][1]++;
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
module.link("../../api/opt-ins/server/publications.js");

var cov_1nk30d303o = function () {
  var path = "/home/doichain/dapp/imports/startup/server/register-api.js",
      hash = "62accf89859a49fc502d11e56b277d5eea022a39",
      Function = function () {}.constructor,
      global = new Function('return this')(),
      gcv = "__coverage__",
      coverageData = {
    path: "/home/doichain/dapp/imports/startup/server/register-api.js",
    statementMap: {},
    fnMap: {},
    branchMap: {},
    s: {},
    f: {},
    b: {},
    _coverageSchema: "43e27e138ebf9cfc5966b082cf9a028302ed4184"
  },
      coverage = global[gcv] || (global[gcv] = {});

  if (coverage[path] && coverage[path].hash === hash) {
    return coverage[path];
  }

  coverageData.hash = hash;
  return coverage[path] = coverageData;
}();
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

var cov_1wmm3vizf8 = function () {
  var path = "/home/doichain/dapp/imports/startup/server/security.js",
      hash = "4ef60e5fbaf7b09efeb29ef41e80f807a37a9d78",
      Function = function () {}.constructor,
      global = new Function('return this')(),
      gcv = "__coverage__",
      coverageData = {
    path: "/home/doichain/dapp/imports/startup/server/security.js",
    statementMap: {
      "0": {
        start: {
          line: 6,
          column: 0
        },
        end: {
          line: 10,
          column: 3
        }
      },
      "1": {
        start: {
          line: 8,
          column: 4
        },
        end: {
          line: 8,
          column: 16
        }
      },
      "2": {
        start: {
          line: 13,
          column: 21
        },
        end: {
          line: 28,
          column: 1
        }
      },
      "3": {
        start: {
          line: 30,
          column: 0
        },
        end: {
          line: 40,
          column: 1
        }
      },
      "4": {
        start: {
          line: 32,
          column: 2
        },
        end: {
          line: 39,
          column: 14
        }
      },
      "5": {
        start: {
          line: 34,
          column: 6
        },
        end: {
          line: 34,
          column: 44
        }
      },
      "6": {
        start: {
          line: 38,
          column: 21
        },
        end: {
          line: 38,
          column: 33
        }
      }
    },
    fnMap: {
      "0": {
        name: "(anonymous_0)",
        decl: {
          start: {
            line: 7,
            column: 2
          },
          end: {
            line: 7,
            column: 3
          }
        },
        loc: {
          start: {
            line: 7,
            column: 11
          },
          end: {
            line: 9,
            column: 3
          }
        },
        line: 7
      },
      "1": {
        name: "(anonymous_1)",
        decl: {
          start: {
            line: 33,
            column: 4
          },
          end: {
            line: 33,
            column: 5
          }
        },
        loc: {
          start: {
            line: 33,
            column: 15
          },
          end: {
            line: 35,
            column: 5
          }
        },
        line: 33
      },
      "2": {
        name: "(anonymous_2)",
        decl: {
          start: {
            line: 38,
            column: 4
          },
          end: {
            line: 38,
            column: 5
          }
        },
        loc: {
          start: {
            line: 38,
            column: 19
          },
          end: {
            line: 38,
            column: 35
          }
        },
        line: 38
      }
    },
    branchMap: {
      "0": {
        loc: {
          start: {
            line: 30,
            column: 0
          },
          end: {
            line: 40,
            column: 1
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 30,
            column: 0
          },
          end: {
            line: 40,
            column: 1
          }
        }, {
          start: {
            line: 30,
            column: 0
          },
          end: {
            line: 40,
            column: 1
          }
        }],
        line: 30
      }
    },
    s: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0
    },
    f: {
      "0": 0,
      "1": 0,
      "2": 0
    },
    b: {
      "0": [0, 0]
    },
    _coverageSchema: "43e27e138ebf9cfc5966b082cf9a028302ed4184"
  },
      coverage = global[gcv] || (global[gcv] = {});

  if (coverage[path] && coverage[path].hash === hash) {
    return coverage[path];
  }

  coverageData.hash = hash;
  return coverage[path] = coverageData;
}();

// Don't let people write arbitrary data to their 'profile' field from the client
cov_1wmm3vizf8.s[0]++;
Meteor.users.deny({
  update() {
    cov_1wmm3vizf8.f[0]++;
    cov_1wmm3vizf8.s[1]++;
    return true;
  }

}); // Get a list of all accounts methods by running `Meteor.server.method_handlers` in meteor shell

const AUTH_METHODS = (cov_1wmm3vizf8.s[2]++, ['login', 'logout', 'logoutOtherClients', 'getNewToken', 'removeOtherTokens', 'configureLoginService', 'changePassword', 'forgotPassword', 'resetPassword', 'verifyEmail', 'createUser', 'ATRemoveService', 'ATCreateUserServer', 'ATResendVerificationEmail']);
cov_1wmm3vizf8.s[3]++;

if (Meteor.isServer) {
  cov_1wmm3vizf8.b[0][0]++;
  cov_1wmm3vizf8.s[4]++; // Only allow 2 login attempts per connection per 5 seconds

  DDPRateLimiter.addRule({
    name(name) {
      cov_1wmm3vizf8.f[1]++;
      cov_1wmm3vizf8.s[5]++;
      return _.contains(AUTH_METHODS, name);
    },

    // Rate limit per connection ID
    connectionId() {
      cov_1wmm3vizf8.f[2]++;
      cov_1wmm3vizf8.s[6]++;
      return true;
    }

  }, 2, 5000);
} else {
  cov_1wmm3vizf8.b[0][1]++;
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

var cov_19xm01gede = function () {
  var path = "/home/doichain/dapp/imports/startup/server/type-configuration.js",
      hash = "b772f2bf02ffe72e690b74a48c8e94591d3eaf99",
      Function = function () {}.constructor,
      global = new Function('return this')(),
      gcv = "__coverage__",
      coverageData = {
    path: "/home/doichain/dapp/imports/startup/server/type-configuration.js",
    statementMap: {
      "0": {
        start: {
          line: 2,
          column: 24
        },
        end: {
          line: 2,
          column: 30
        }
      },
      "1": {
        start: {
          line: 3,
          column: 27
        },
        end: {
          line: 3,
          column: 36
        }
      },
      "2": {
        start: {
          line: 4,
          column: 26
        },
        end: {
          line: 4,
          column: 34
        }
      },
      "3": {
        start: {
          line: 6,
          column: 2
        },
        end: {
          line: 6,
          column: 99
        }
      },
      "4": {
        start: {
          line: 6,
          column: 73
        },
        end: {
          line: 6,
          column: 99
        }
      },
      "5": {
        start: {
          line: 7,
          column: 16
        },
        end: {
          line: 7,
          column: 41
        }
      },
      "6": {
        start: {
          line: 8,
          column: 2
        },
        end: {
          line: 8,
          column: 54
        }
      },
      "7": {
        start: {
          line: 8,
          column: 26
        },
        end: {
          line: 8,
          column: 54
        }
      },
      "8": {
        start: {
          line: 9,
          column: 2
        },
        end: {
          line: 9,
          column: 15
        }
      }
    },
    fnMap: {
      "0": {
        name: "isAppType",
        decl: {
          start: {
            line: 5,
            column: 16
          },
          end: {
            line: 5,
            column: 25
          }
        },
        loc: {
          start: {
            line: 5,
            column: 32
          },
          end: {
            line: 10,
            column: 1
          }
        },
        line: 5
      }
    },
    branchMap: {
      "0": {
        loc: {
          start: {
            line: 6,
            column: 2
          },
          end: {
            line: 6,
            column: 99
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 6,
            column: 2
          },
          end: {
            line: 6,
            column: 99
          }
        }, {
          start: {
            line: 6,
            column: 2
          },
          end: {
            line: 6,
            column: 99
          }
        }],
        line: 6
      },
      "1": {
        loc: {
          start: {
            line: 6,
            column: 5
          },
          end: {
            line: 6,
            column: 71
          }
        },
        type: "binary-expr",
        locations: [{
          start: {
            line: 6,
            column: 5
          },
          end: {
            line: 6,
            column: 34
          }
        }, {
          start: {
            line: 6,
            column: 38
          },
          end: {
            line: 6,
            column: 71
          }
        }],
        line: 6
      },
      "2": {
        loc: {
          start: {
            line: 8,
            column: 2
          },
          end: {
            line: 8,
            column: 54
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 8,
            column: 2
          },
          end: {
            line: 8,
            column: 54
          }
        }, {
          start: {
            line: 8,
            column: 2
          },
          end: {
            line: 8,
            column: 54
          }
        }],
        line: 8
      }
    },
    s: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0,
      "7": 0,
      "8": 0
    },
    f: {
      "0": 0
    },
    b: {
      "0": [0, 0],
      "1": [0, 0],
      "2": [0, 0]
    },
    _coverageSchema: "43e27e138ebf9cfc5966b082cf9a028302ed4184"
  },
      coverage = global[gcv] || (global[gcv] = {});

  if (coverage[path] && coverage[path].hash === hash) {
    return coverage[path];
  }

  coverageData.hash = hash;
  return coverage[path] = coverageData;
}();

const SEND_APP = (cov_19xm01gede.s[0]++, "send");
const CONFIRM_APP = (cov_19xm01gede.s[1]++, "confirm");
const VERIFY_APP = (cov_19xm01gede.s[2]++, "verify");

function isAppType(type) {
  cov_19xm01gede.f[0]++;
  cov_19xm01gede.s[3]++;

  if ((cov_19xm01gede.b[1][0]++, Meteor.settings === undefined) || (cov_19xm01gede.b[1][1]++, Meteor.settings.app === undefined)) {
    cov_19xm01gede.b[0][0]++;
    cov_19xm01gede.s[4]++;
    throw "No settings found!";
  } else {
    cov_19xm01gede.b[0][1]++;
  }

  const types = (cov_19xm01gede.s[5]++, Meteor.settings.app.types);
  cov_19xm01gede.s[6]++;

  if (types !== undefined) {
    cov_19xm01gede.b[2][0]++;
    cov_19xm01gede.s[7]++;
    return types.includes(type);
  } else {
    cov_19xm01gede.b[2][1]++;
  }

  cov_19xm01gede.s[8]++;
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

var cov_3bvc9krhk = function () {
  var path = "/home/doichain/dapp/imports/startup/server/useraccounts-configuration.js",
      hash = "0dc7f2a3d702466d90f004e6a8a9f096090be73b",
      Function = function () {}.constructor,
      global = new Function('return this')(),
      gcv = "__coverage__",
      coverageData = {
    path: "/home/doichain/dapp/imports/startup/server/useraccounts-configuration.js",
    statementMap: {
      "0": {
        start: {
          line: 2,
          column: 0
        },
        end: {
          line: 5,
          column: 3
        }
      },
      "1": {
        start: {
          line: 9,
          column: 0
        },
        end: {
          line: 9,
          column: 52
        }
      }
    },
    fnMap: {},
    branchMap: {},
    s: {
      "0": 0,
      "1": 0
    },
    f: {},
    b: {},
    _coverageSchema: "43e27e138ebf9cfc5966b082cf9a028302ed4184"
  },
      coverage = global[gcv] || (global[gcv] = {});

  if (coverage[path] && coverage[path].hash === hash) {
    return coverage[path];
  }

  coverageData.hash = hash;
  return coverage[path] = coverageData;
}();

cov_3bvc9krhk.s[0]++;
Accounts.config({
  sendVerificationEmail: true,
  forbidClientAccountCreation: false
});
cov_3bvc9krhk.s[1]++;
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

var cov_11rw443za3 = function () {
  var path = "/home/doichain/dapp/server/api/rest/imports/confirm.js",
      hash = "a9fca2c64c7f3116c3e4c1e76fc343dd9189c8be",
      Function = function () {}.constructor,
      global = new Function('return this')(),
      gcv = "__coverage__",
      coverageData = {
    path: "/home/doichain/dapp/server/api/rest/imports/confirm.js",
    statementMap: {
      "0": {
        start: {
          line: 6,
          column: 0
        },
        end: {
          line: 31,
          column: 3
        }
      },
      "1": {
        start: {
          line: 9,
          column: 19
        },
        end: {
          line: 9,
          column: 38
        }
      },
      "2": {
        start: {
          line: 10,
          column: 6
        },
        end: {
          line: 28,
          column: 7
        }
      },
      "3": {
        start: {
          line: 11,
          column: 17
        },
        end: {
          line: 14,
          column: 95
        }
      },
      "4": {
        start: {
          line: 16,
          column: 10
        },
        end: {
          line: 16,
          column: 68
        }
      },
      "5": {
        start: {
          line: 16,
          column: 33
        },
        end: {
          line: 16,
          column: 68
        }
      },
      "6": {
        start: {
          line: 18,
          column: 10
        },
        end: {
          line: 18,
          column: 67
        }
      },
      "7": {
        start: {
          line: 19,
          column: 27
        },
        end: {
          line: 19,
          column: 63
        }
      },
      "8": {
        start: {
          line: 21,
          column: 8
        },
        end: {
          line: 25,
          column: 10
        }
      },
      "9": {
        start: {
          line: 27,
          column: 8
        },
        end: {
          line: 27,
          column: 81
        }
      },
      "10": {
        start: {
          line: 33,
          column: 0
        },
        end: {
          line: 48,
          column: 3
        }
      },
      "11": {
        start: {
          line: 37,
          column: 27
        },
        end: {
          line: 37,
          column: 43
        }
      },
      "12": {
        start: {
          line: 38,
          column: 25
        },
        end: {
          line: 38,
          column: 34
        }
      },
      "13": {
        start: {
          line: 40,
          column: 12
        },
        end: {
          line: 45,
          column: 13
        }
      },
      "14": {
        start: {
          line: 41,
          column: 16
        },
        end: {
          line: 41,
          column: 42
        }
      },
      "15": {
        start: {
          line: 42,
          column: 16
        },
        end: {
          line: 42,
          column: 91
        }
      },
      "16": {
        start: {
          line: 44,
          column: 16
        },
        end: {
          line: 44,
          column: 62
        }
      }
    },
    fnMap: {
      "0": {
        name: "(anonymous_0)",
        decl: {
          start: {
            line: 8,
            column: 12
          },
          end: {
            line: 8,
            column: 13
          }
        },
        loc: {
          start: {
            line: 8,
            column: 23
          },
          end: {
            line: 29,
            column: 5
          }
        },
        line: 8
      },
      "1": {
        name: "(anonymous_1)",
        decl: {
          start: {
            line: 36,
            column: 16
          },
          end: {
            line: 36,
            column: 17
          }
        },
        loc: {
          start: {
            line: 36,
            column: 27
          },
          end: {
            line: 46,
            column: 9
          }
        },
        line: 36
      }
    },
    branchMap: {
      "0": {
        loc: {
          start: {
            line: 11,
            column: 17
          },
          end: {
            line: 14,
            column: 95
          }
        },
        type: "binary-expr",
        locations: [{
          start: {
            line: 11,
            column: 17
          },
          end: {
            line: 11,
            column: 56
          }
        }, {
          start: {
            line: 12,
            column: 10
          },
          end: {
            line: 12,
            column: 47
          }
        }, {
          start: {
            line: 13,
            column: 10
          },
          end: {
            line: 13,
            column: 43
          }
        }, {
          start: {
            line: 14,
            column: 11
          },
          end: {
            line: 14,
            column: 94
          }
        }],
        line: 11
      },
      "1": {
        loc: {
          start: {
            line: 14,
            column: 11
          },
          end: {
            line: 14,
            column: 94
          }
        },
        type: "cond-expr",
        locations: [{
          start: {
            line: 14,
            column: 44
          },
          end: {
            line: 14,
            column: 88
          }
        }, {
          start: {
            line: 14,
            column: 90
          },
          end: {
            line: 14,
            column: 94
          }
        }],
        line: 14
      },
      "2": {
        loc: {
          start: {
            line: 16,
            column: 10
          },
          end: {
            line: 16,
            column: 68
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 16,
            column: 10
          },
          end: {
            line: 16,
            column: 68
          }
        }, {
          start: {
            line: 16,
            column: 10
          },
          end: {
            line: 16,
            column: 68
          }
        }],
        line: 16
      }
    },
    s: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0,
      "7": 0,
      "8": 0,
      "9": 0,
      "10": 0,
      "11": 0,
      "12": 0,
      "13": 0,
      "14": 0,
      "15": 0,
      "16": 0
    },
    f: {
      "0": 0,
      "1": 0
    },
    b: {
      "0": [0, 0, 0, 0],
      "1": [0, 0],
      "2": [0, 0]
    },
    _coverageSchema: "43e27e138ebf9cfc5966b082cf9a028302ed4184"
  },
      coverage = global[gcv] || (global[gcv] = {});

  if (coverage[path] && coverage[path].hash === hash) {
    return coverage[path];
  }

  coverageData.hash = hash;
  return coverage[path] = coverageData;
}();

//doku of meteor-restivus https://github.com/kahmali/meteor-restivus
cov_11rw443za3.s[0]++;
Api.addRoute(DOI_CONFIRMATION_ROUTE + '/:hash', {
  authRequired: false
}, {
  get: {
    action: function () {
      cov_11rw443za3.f[0]++;
      const hash = (cov_11rw443za3.s[1]++, this.urlParams.hash);
      cov_11rw443za3.s[2]++;

      try {
        let ip = (cov_11rw443za3.s[3]++, (cov_11rw443za3.b[0][0]++, this.request.headers['x-forwarded-for']) || (cov_11rw443za3.b[0][1]++, this.request.connection.remoteAddress) || (cov_11rw443za3.b[0][2]++, this.request.socket.remoteAddress) || (cov_11rw443za3.b[0][3]++, this.request.connection.socket ? (cov_11rw443za3.b[1][0]++, this.request.connection.socket.remoteAddress) : (cov_11rw443za3.b[1][1]++, null)));
        cov_11rw443za3.s[4]++;

        if (ip.indexOf(',') != -1) {
          cov_11rw443za3.b[2][0]++;
          cov_11rw443za3.s[5]++;
          ip = ip.substring(0, ip.indexOf(','));
        } else {
          cov_11rw443za3.b[2][1]++;
        }

        cov_11rw443za3.s[6]++;
        logConfirm('REST opt-in/confirm :', {
          hash: hash,
          host: ip
        });
        const redirect = (cov_11rw443za3.s[7]++, confirmOptIn({
          host: ip,
          hash: hash
        }));
        cov_11rw443za3.s[8]++;
        return {
          statusCode: 303,
          headers: {
            'Content-Type': 'text/plain',
            'Location': redirect
          },
          body: 'Location: ' + redirect
        };
      } catch (error) {
        cov_11rw443za3.s[9]++;
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
cov_11rw443za3.s[10]++;
Api.addRoute(DOI_WALLETNOTIFY_ROUTE, {
  get: {
    authRequired: false,
    action: function () {
      cov_11rw443za3.f[1]++;
      const params = (cov_11rw443za3.s[11]++, this.queryParams);
      const txid = (cov_11rw443za3.s[12]++, params.tx);
      cov_11rw443za3.s[13]++;

      try {
        cov_11rw443za3.s[14]++;
        checkNewTransaction(txid);
        cov_11rw443za3.s[15]++;
        return {
          status: 'success',
          data: 'txid:' + txid + ' was read from blockchain'
        };
      } catch (error) {
        cov_11rw443za3.s[16]++;
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

var cov_2n7mu9xme = function () {
  var path = "/home/doichain/dapp/server/api/rest/imports/debug.js",
      hash = "ac8cbe60eee39b19758f827efc0eb06ad0f29083",
      Function = function () {}.constructor,
      global = new Function('return this')(),
      gcv = "__coverage__",
      coverageData = {
    path: "/home/doichain/dapp/server/api/rest/imports/debug.js",
    statementMap: {
      "0": {
        start: {
          line: 2,
          column: 0
        },
        end: {
          line: 477,
          column: 3
        }
      },
      "1": {
        start: {
          line: 5,
          column: 19
        },
        end: {
          line: 472,
          column: 7
        }
      },
      "2": {
        start: {
          line: 474,
          column: 6
        },
        end: {
          line: 474,
          column: 49
        }
      }
    },
    fnMap: {
      "0": {
        name: "(anonymous_0)",
        decl: {
          start: {
            line: 4,
            column: 12
          },
          end: {
            line: 4,
            column: 13
          }
        },
        loc: {
          start: {
            line: 4,
            column: 23
          },
          end: {
            line: 475,
            column: 5
          }
        },
        line: 4
      }
    },
    branchMap: {},
    s: {
      "0": 0,
      "1": 0,
      "2": 0
    },
    f: {
      "0": 0
    },
    b: {},
    _coverageSchema: "43e27e138ebf9cfc5966b082cf9a028302ed4184"
  },
      coverage = global[gcv] || (global[gcv] = {});

  if (coverage[path] && coverage[path].hash === hash) {
    return coverage[path];
  }

  coverageData.hash = hash;
  return coverage[path] = coverageData;
}();

cov_2n7mu9xme.s[0]++;
Api.addRoute('debug/mail', {
  authRequired: false
}, {
  get: {
    action: function () {
      cov_2n7mu9xme.f[0]++;
      const data = (cov_2n7mu9xme.s[1]++, {
        "from": "noreply@doichain.org",
        "subject": "Doichain.org Newsletter Bestätigung",
        "redirect": "https://www.doichain.org/vielen-dank/",
        "returnPath": "noreply@doichain.org",
        "content": "<style type='text/css' media='screen'>\n" + "* {\n" + "\tline-height: inherit;\n" + "}\n" + ".ExternalClass * {\n" + "\tline-height: 100%;\n" + "}\n" + "body, p {\n" + "\tmargin: 0;\n" + "\tpadding: 0;\n" + "\tmargin-bottom: 0;\n" + "\t-webkit-text-size-adjust: none;\n" + "\t-ms-text-size-adjust: none;\n" + "}\n" + "img {\n" + "\tline-height: 100%;\n" + "\toutline: none;\n" + "\ttext-decoration: none;\n" + "\t-ms-interpolation-mode: bicubic;\n" + "}\n" + "a img {\n" + "\tborder: none;\n" + "}\n" + "#backgroundTable {\n" + "\tmargin: 0;\n" + "\tpadding: 0;\n" + "\twidth: 100% !important;\n" + "}\n" + "a, a:link, .no-detect-local a, .appleLinks a {\n" + "\tcolor: #5555ff !important;\n" + "\ttext-decoration: underline;\n" + "}\n" + ".ExternalClass {\n" + "\tdisplay: block !important;\n" + "\twidth: 100%;\n" + "}\n" + ".ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div {\n" + "\tline-height: inherit;\n" + "}\n" + "table td {\n" + "\tborder-collapse: collapse;\n" + "\tmso-table-lspace: 0pt;\n" + "\tmso-table-rspace: 0pt;\n" + "}\n" + "sup {\n" + "\tposition: relative;\n" + "\ttop: 4px;\n" + "\tline-height: 7px !important;\n" + "\tfont-size: 11px !important;\n" + "}\n" + ".mobile_link a[href^='tel'], .mobile_link a[href^='sms'] {\n" + "\ttext-decoration: default;\n" + "\tcolor: #5555ff !important;\n" + "\tpointer-events: auto;\n" + "\tcursor: default;\n" + "}\n" + ".no-detect a {\n" + "\ttext-decoration: none;\n" + "\tcolor: #5555ff;\n" + "\tpointer-events: auto;\n" + "\tcursor: default;\n" + "}\n" + "{\n" + "color: #5555ff;\n" + "}\n" + "span {\n" + "\tcolor: inherit;\n" + "\tborder-bottom: none;\n" + "}\n" + "span:hover {\n" + "\tbackground-color: transparent;\n" + "}\n" + ".nounderline {\n" + "\ttext-decoration: none !important;\n" + "}\n" + "h1, h2, h3 {\n" + "\tmargin: 0;\n" + "\tpadding: 0;\n" + "}\n" + "p {\n" + "\tMargin: 0px !important;\n" + "}\n" + "table[class='email-root-wrapper'] {\n" + "\twidth: 600px !important;\n" + "}\n" + "body {\n" + "}\n" + "body {\n" + "\tmin-width: 280px;\n" + "\twidth: 100%;\n" + "}\n" + "td[class='pattern'] .c112p20r {\n" + "\twidth: 20%;\n" + "}\n" + "td[class='pattern'] .c336p60r {\n" + "\twidth: 60.000000000000256%;\n" + "}\n" + "</style>\n" + "<style>\n" + "@media only screen and (max-width: 599px), only screen and (max-device-width: 599px), only screen and (max-width: 400px), only screen and (max-device-width: 400px) {\n" + ".email-root-wrapper {\n" + "\twidth: 100% !important;\n" + "}\n" + ".full-width {\n" + "\twidth: 100% !important;\n" + "\theight: auto !important;\n" + "\ttext-align: center;\n" + "}\n" + ".fullwidthhalfleft {\n" + "\twidth: 100% !important;\n" + "}\n" + ".fullwidthhalfright {\n" + "\twidth: 100% !important;\n" + "}\n" + ".fullwidthhalfinner {\n" + "\twidth: 100% !important;\n" + "\tmargin: 0 auto !important;\n" + "\tfloat: none !important;\n" + "\tmargin-left: auto !important;\n" + "\tmargin-right: auto !important;\n" + "\tclear: both !important;\n" + "}\n" + ".hide {\n" + "\tdisplay: none !important;\n" + "\twidth: 0px !important;\n" + "\theight: 0px !important;\n" + "\toverflow: hidden;\n" + "}\n" + ".desktop-hide {\n" + "\tdisplay: block !important;\n" + "\twidth: 100% !important;\n" + "\theight: auto !important;\n" + "\toverflow: hidden;\n" + "\tmax-height: inherit !important;\n" + "}\n" + ".c112p20r {\n" + "\twidth: 100% !important;\n" + "\tfloat: none;\n" + "}\n" + ".c336p60r {\n" + "\twidth: 100% !important;\n" + "\tfloat: none;\n" + "}\n" + "}\n" + "</style>\n" + "<style>\n" + "@media only screen and (min-width: 600px) {\n" + "td[class='pattern'] .c112p20r {\n" + "\twidth: 112px !important;\n" + "}\n" + "td[class='pattern'] .c336p60r {\n" + "\twidth: 336px !important;\n" + "}\n" + "}\n" + "\n" + "@media only screen and (max-width: 599px), only screen and (max-device-width: 599px), only screen and (max-width: 400px), only screen and (max-device-width: 400px) {\n" + "table[class='email-root-wrapper'] {\n" + "\twidth: 100% !important;\n" + "}\n" + "td[class='wrap'] .full-width {\n" + "\twidth: 100% !important;\n" + "\theight: auto !important;\n" + "}\n" + "td[class='wrap'] .fullwidthhalfleft {\n" + "\twidth: 100% !important;\n" + "}\n" + "td[class='wrap'] .fullwidthhalfright {\n" + "\twidth: 100% !important;\n" + "}\n" + "td[class='wrap'] .fullwidthhalfinner {\n" + "\twidth: 100% !important;\n" + "\tmargin: 0 auto !important;\n" + "\tfloat: none !important;\n" + "\tmargin-left: auto !important;\n" + "\tmargin-right: auto !important;\n" + "\tclear: both !important;\n" + "}\n" + "td[class='wrap'] .hide {\n" + "\tdisplay: none !important;\n" + "\twidth: 0px;\n" + "\theight: 0px;\n" + "\toverflow: hidden;\n" + "}\n" + "td[class='pattern'] .c112p20r {\n" + "\twidth: 100% !important;\n" + "}\n" + "td[class='pattern'] .c336p60r {\n" + "\twidth: 100% !important;\n" + "}\n" + "}\n" + "\n" + "@media yahoo {\n" + "table {\n" + "\tfloat: none !important;\n" + "\theight: auto;\n" + "}\n" + "table[align='left'] {\n" + "\tfloat: left !important;\n" + "}\n" + "td[align='left'] {\n" + "\tfloat: left !important;\n" + "\theight: auto;\n" + "}\n" + "table[align='center'] {\n" + "\tmargin: 0 auto;\n" + "}\n" + "td[align='center'] {\n" + "\tmargin: 0 auto;\n" + "\theight: auto;\n" + "}\n" + "table[align='right'] {\n" + "\tfloat: right !important;\n" + "}\n" + "td[align='right'] {\n" + "\tfloat: right !important;\n" + "\theight: auto;\n" + "}\n" + "}\n" + "</style>\n" + "\n" + "<!--[if (gte IE 7) & (vml)]>\n" + "<style type='text/css'>\n" + "html, body {margin:0 !important; padding:0px !important;}\n" + "img.full-width { position: relative !important; }\n" + "\n" + ".img240x30 { width: 240px !important; height: 30px !important;}\n" + ".img20x20 { width: 20px !important; height: 20px !important;}\n" + "\n" + "</style>\n" + "<![endif]-->\n" + "\n" + "<!--[if gte mso 9]>\n" + "<style type='text/css'>\n" + ".mso-font-fix-arial { font-family: Arial, sans-serif;}\n" + ".mso-font-fix-georgia { font-family: Georgia, sans-serif;}\n" + ".mso-font-fix-tahoma { font-family: Tahoma, sans-serif;}\n" + ".mso-font-fix-times_new_roman { font-family: 'Times New Roman', sans-serif;}\n" + ".mso-font-fix-trebuchet_ms { font-family: 'Trebuchet MS', sans-serif;}\n" + ".mso-font-fix-verdana { font-family: Verdana, sans-serif;}\n" + "</style>\n" + "<![endif]-->\n" + "\n" + "<!--[if gte mso 9]>\n" + "<style type='text/css'>\n" + "table, td {\n" + "border-collapse: collapse !important;\n" + "mso-table-lspace: 0px !important;\n" + "mso-table-rspace: 0px !important;\n" + "}\n" + "\n" + ".email-root-wrapper { width 600px !important;}\n" + ".imglink { font-size: 0px; }\n" + ".edm_button { font-size: 0px; }\n" + "</style>\n" + "<![endif]-->\n" + "\n" + "<!--[if gte mso 15]>\n" + "<style type='text/css'>\n" + "table {\n" + "font-size:0px;\n" + "mso-margin-top-alt:0px;\n" + "}\n" + "\n" + ".fullwidthhalfleft {\n" + "width: 49% !important;\n" + "float:left !important;\n" + "}\n" + "\n" + ".fullwidthhalfright {\n" + "width: 50% !important;\n" + "float:right !important;\n" + "}\n" + "</style>\n" + "<![endif]-->\n" + "<style type='text/css' media='(pointer) and (min-color-index:0)'>\n" + "html, body {\n" + "\tbackground-image: none !important;\n" + "\tbackground-color: #ebebeb !important;\n" + "\tmargin: 0 !important;\n" + "\tpadding: 0 !important;\n" + "}\n" + "</style>\n" + "</head>\n" + "<body leftmargin='0' marginwidth='0' topmargin='0' marginheight='0' offset='0' background=\"\" bgcolor='#ebebeb' style='font-family:Arial, sans-serif; font-size:0px;margin:0;padding:0; '>\n" + "<!--[if t]><![endif]--><!--[if t]><![endif]--><!--[if t]><![endif]--><!--[if t]><![endif]--><!--[if t]><![endif]--><!--[if t]><![endif]-->\n" + "<table align='center' border='0' cellpadding='0' cellspacing='0' background=\"\"  height='100%' width='100%' id='backgroundTable'>\n" + "  <tr>\n" + "    <td class='wrap' align='center' valign='top' width='100%'>\n" + "\t\t<center>\n" + "        <!-- content -->\n" + "        \t<div style='padding: 0px;'>\n" + "        \t  <table cellpadding='0' cellspacing='0' border='0' width='100%' bgcolor='#ebebeb'>\n" + "           \t\t <tr>\n" + "            \t\t  <td valign='top' style='padding: 0px;'>\n" + "\t\t\t\t\t\t  <table cellpadding='0' cellspacing='0' width='600' align='center' style='max-width: 600px;min-width: 240px;margin: 0 auto;' class='email-root-wrapper'>\n" + "                 \t\t \t\t<tr>\n" + "                   \t\t\t\t\t <td valign='top' style='padding: 0px;'>\n" + "\t\t\t\t\t\t\t\t \t\t<table cellpadding='0' cellspacing='0' border='0' width='100%' bgcolor='#FFFFFF' style='border: 0px none;background-color: #FFFFFF;'>\n" + "                       \t\t\t\t\t\t <tr>\n" + "                       \t\t\t  \t\t\t\t <td valign='top' style='padding-top: 30px;padding-right: 20px;padding-bottom: 35px;padding-left: 20px;'>\n" + "\t\t\t\t\t\t\t\t\t   \t\t\t\t\n" + "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<table cellpadding='0'\n" + "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tcellspacing='0' border='0' align='center' width='240'  style='border: 0px none;height: auto;' class='full-width'>\n" + "                                         \t \t\t\t\t\t\t\t\t\t<tr>\n" + "                                            \t\t\t\t\t\t\t\t\t\t<td valign='top' style='padding: 0px;'><img src='https://sf26.sendsfx.com/admin/temp/user/17/doichain_100h.png' width='240' height='30' alt=\"\" border='0' style='display: block;width: 100%;height: auto;' class='full-width img240x30' /></td>\n" + "                                         \t \t\t\t\t\t\t\t\t\t</tr>\n" + "                                        \t\t\t\t\t\t\t\t\t</table>\n" + "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\n" + "\t\t\t\t\t\t\t\t\t\t\t\t</td>\n" + "                      \t\t  \t\t\t\t</tr>\n" + "                      \t\t\t\t\t</table>\n" + "\t\t\t\t\t\t\t\t \n" + "\t\t\t\t\t\t\t\t \n" + "                      <table cellpadding='0' cellspacing='0' border='0' width='100%' bgcolor='#0071aa' style='border: 0px none;background-color: #0071aa;background-image: url('https://sf26.sendsfx.com/admin/temp/user/17/blue-bg.jpg');background-repeat: no-repeat ;background-position: center;'>\n" + "                        <tr>\n" + "                          <td valign='top' style='padding-top: 40px;padding-right: 20px;padding-bottom: 45px;padding-left: 20px;'><table cellpadding='0' cellspacing='0' width='100%'>\n" + "                              <tr>\n" + "                                <td style='padding: 0px;' class='pattern'><table cellpadding='0' cellspacing='0' border='0' width='100%'>\n" + "                                    <tr>\n" + "                                      <td valign='top' style='padding-bottom: 10px;'><div style='text-align: left;font-family: arial;font-size: 20px;color: #ffffff;line-height: 30px;mso-line-height: exactly;mso-text-raise: 5px;'>\n" + "                                          <p\n" + "style='padding: 0; margin: 0;text-align: center;'>Bitte bestätigen Sie Ihre Anmeldung</p>\n" + "                                        </div></td>\n" + "                                    </tr>\n" + "                                  </table>\n" + "                                  <table cellpadding='0' cellspacing='0' border='0' width='100%'>\n" + "                                    <tr>\n" + "                                      <td valign='top' style='padding: 0;mso-cellspacing: 0in;'><table cellpadding='0' cellspacing='0' border='0' align='left' width='112'  style='float: left;' class='c112p20r'>\n" + "                                          <tr>\n" + "                                            <td valign='top' style='padding: 0px;'><table cellpadding='0' cellspacing='0' border='0' width='100%' style='border: 0px none;' class='hide'>\n" + "                                                <tr>\n" + "                                                  <td valign='top' style='padding: 0px;'><table cellpadding='0' cellspacing='0' width='100%'>\n" + "                                                      <tr>\n" + "                                                        <td style='padding: 0px;'><table cellpadding='0' cellspacing='0' width='100%'>\n" + "                                                            <tr>\n" + "                                                              <td align='center' style='padding: 0px;'><table cellpadding='0' cellspacing='0' border='0' align='center' width='20'  style='border: 0px none;height: auto;'>\n" + "                                                                  <tr>\n" + "                                                                    <td valign='top' style='padding: 0px;'><img\n" + "src='https://sf26.sendsfx.com/admin/temp/user/17/img_89837318.png' width='20' height='20' alt=\"\" border='0' style='display: block;' class='img20x20' /></td>\n" + "                                                                  </tr>\n" + "                                                                </table></td>\n" + "                                                            </tr>\n" + "                                                          </table></td>\n" + "                                                      </tr>\n" + "                                                    </table></td>\n" + "                                                </tr>\n" + "                                              </table></td>\n" + "                                          </tr>\n" + "                                        </table>\n" + "                                        \n" + "                                        <!--[if gte mso 9]></td><td valign='top' style='padding:0;'><![endif]-->\n" + "                                        \n" + "                                        <table cellpadding='0' cellspacing='0' border='0' align='left' width='336'  style='float: left;' class='c336p60r'>\n" + "                                          <tr>\n" + "                                            <td valign='top' style='padding: 0px;'><table cellpadding='0' cellspacing='0' border='0' width='100%'>\n" + "                                                <tr>\n" + "                                                  <td valign='top' style='padding-bottom: 30px;'><table cellpadding='0' cellspacing='0' width='100%'>\n" + "                                                      <tr>\n" + "                                                        <td style='padding: 0px;'><table cellpadding='0' cellspacing='0' border='0' width='100%' style='border-top: 2px solid #ffffff;'>\n" + "                                                            <tr>\n" + "                                                              <td valign='top'><table cellpadding='0' cellspacing='0' width='100%'>\n" + "                                                                  <tr>\n" + "                                                                    <td style='padding: 0px;'></td>\n" + "                                                                  </tr>\n" + "                                                                </table></td>\n" + "                                                            </tr>\n" + "                                                          </table></td>\n" + "                                                      </tr>\n" + "                                                    </table></td>\n" + "                                                </tr>\n" + "                                              </table></td>\n" + "                                          </tr>\n" + "                                        </table>\n" + "                                        \n" + "                                        <!--[if gte mso 9]></td><td valign='top' style='padding:0;'><![endif]-->\n" + "                                        \n" + "                                        <table cellpadding='0' cellspacing='0' border='0' align='left' width='112'  style='float: left;' class='c112p20r'>\n" + "                                          <tr>\n" + "                                            <td valign='top' style='padding: 0px;'><table cellpadding='0' cellspacing='0' border='0' width='100%' style='border: 0px none;' class='hide'>\n" + "                                                <tr>\n" + "                                                  <td valign='top' style='padding: 0px;'><table cellpadding='0' cellspacing='0' width='100%'>\n" + "                                                      <tr>\n" + "                                                        <td style='padding: 0px;'><table cellpadding='0' cellspacing='0' width='100%'>\n" + "                                                            <tr>\n" + "                                                              <td align='center' style='padding: 0px;'><table cellpadding='0' cellspacing='0' border='0' align='center' width='20'  style='border: 0px none;height: auto;'>\n" + "                                                                  <tr>\n" + "                                                                    <td valign='top' style='padding: 0px;'><img src='https://sf26.sendsfx.com/admin/temp/user/17/img_89837318.png' width='20' height='20' alt=\"\" border='0' style='display: block;' class='img20x20'\n" + "/></td>\n" + "                                                                  </tr>\n" + "                                                                </table></td>\n" + "                                                            </tr>\n" + "                                                          </table></td>\n" + "                                                      </tr>\n" + "                                                    </table></td>\n" + "                                                </tr>\n" + "                                              </table></td>\n" + "                                          </tr>\n" + "                                        </table></td>\n" + "                                    </tr>\n" + "                                  </table>\n" + "                                  <table cellpadding='0' cellspacing='0' border='0' width='100%'>\n" + "                                    <tr>\n" + "                                      <td valign='top' style='padding-bottom: 20px;'><div style='text-align: left;font-family: arial;font-size: 16px;color: #ffffff;line-height: 26px;mso-line-height: exactly;mso-text-raise: 5px;'>\n" + "                                          <p style='padding: 0; margin: 0;text-align: center;'>Vielen Dank, dass Sie sich für unseren Newsletter angemeldet haben.</p>\n" + "                                          <p style='padding: 0; margin: 0;text-align: center;'>Um diese E-Mail-Adresse und Ihre kostenlose Anmeldung zu bestätigen, klicken Sie bitte jetzt auf den folgenden Button:</p>\n" + "                                        </div></td>\n" + "                                    </tr>\n" + "                                  </table>\n" + "                                  <table cellpadding='0' cellspacing='0' width='100%'>\n" + "                                    <tr>\n" + "                                      <td align='center' style='padding: 0px;'><table cellpadding='0' cellspacing='0' border='0' align='center' style='text-align: center;color: #000;' class='full-width'>\n" + "                                          <tr>\n" + "                                            <td valign='top' align='center' style='padding-right: 10px;padding-bottom: 30px;padding-left: 10px;'><table cellpadding='0' cellspacing='0' border='0' bgcolor='#85ac1c' style='border: 0px none;border-radius: 5px;border-collapse: separate !important;background-color: #85ac1c;' class='full-width'>\n" + "                                                <tr>\n" + "                                                  <td valign='top' align='center' style='padding: 12px;'><a href='${confirmation_url}' target='_blank' style='text-decoration: none;' class='edm_button'><span style='font-family: arial;font-size: 18px;color: #ffffff;line-height: 28px;text-decoration: none;'><span\n" + "style='font-size: 18px;'>Jetzt Anmeldung best&auml;tigen</span></span> </a></td>\n" + "                                                </tr>\n" + "                                              </table></td>\n" + "                                          </tr>\n" + "                                        </table></td>\n" + "                                    </tr>\n" + "                                  </table>\n" + "                                  <div style='text-align: left;font-family: arial;font-size: 12px;color: #ffffff;line-height: 22px;mso-line-height: exactly;mso-text-raise: 5px;'>\n" + "                                    <p style='padding: 0; margin: 0;text-align: center;'>Wenn Sie ihre E-Mail-Adresse nicht bestätigen, können keine Newsletter zugestellt werden. Ihr Einverständnis können Sie selbstverständlich jederzeit widerrufen. Sollte es sich bei der Anmeldung um ein Versehen handeln oder wurde der Newsletter nicht in Ihrem Namen bestellt, können Sie diese E-Mail einfach ignorieren. Ihnen werden keine weiteren Nachrichten zugeschickt.</p>\n" + "                                  </div></td>\n" + "                              </tr>\n" + "                            </table></td>\n" + "                        </tr>\n" + "                      </table>\n" + "                      <table cellpadding='0' cellspacing='0' border='0' width='100%' bgcolor='#ffffff' style='border: 0px none;background-color: #ffffff;'>\n" + "                        <tr>\n" + "                          <td valign='top' style='padding-top: 30px;padding-right: 20px;padding-bottom: 35px;padding-left: 20px;'><table cellpadding='0' cellspacing='0' width='100%'>\n" + "                              <tr>\n" + "                                <td style='padding: 0px;'><table cellpadding='0' cellspacing='0' border='0' width='100%'>\n" + "                                    <tr>\n" + "                                      <td valign='top' style='padding-bottom: 25px;'><div style='text-align: left;font-family: arial;font-size: 12px;color: #333333;line-height: 22px;mso-line-height: exactly;mso-text-raise: 5px;'>\n" + "                                          <p style='padding: 0; margin: 0;text-align: center;'><span style='line-height: 3;'><strong>Kontakt</strong></span><br>\n" + "                                            service@sendeffect.de<br>\n" + "                                            www.sendeffect.de<br>\n" + "                                            Telefon: +49 (0) 8571 - 97 39 - 69-0</p>\n" + "                                        </div></td>\n" + "                                    </tr>\n" + "                                  </table>\n" + "                                  <div style='text-align: left;font-family: arial;font-size: 12px;color: #333333;line-height: 22px;mso-line-height: exactly;mso-text-raise: 5px;'>\n" + "                                    <p style='padding: 0; margin: 0;text-align: center;'><span style='line-height: 3;'><strong>Impressum</strong></span><br>\n" + "                                      Anschrift: Schulgasse 5, D-84359 Simbach am Inn, eMail: service@sendeffect.de<br>\n" + "                                      Betreiber: WEBanizer AG, Registergericht: Amtsgericht Landshut HRB 5177, UstId.: DE 2068 62 070<br>\n" + "                                      Vorstand: Ottmar Neuburger, Aufsichtsrat: Tobias Neuburger</p>\n" + "                                  </div></td>\n" + "                              </tr>\n" + "                            </table></td>\n" + "                        </tr>\n" + "                      </table></td>\n" + "                  </tr>\n" + "                </table></td>\n" + "            </tr>\n" + "          </table>\n" + "        </div>\n" + "        <!-- content end -->\n" + "      </center></td>\n" + "  </tr>\n" + "</table>"
      });
      cov_2n7mu9xme.s[2]++;
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

var cov_1wlomo8pac = function () {
  var path = "/home/doichain/dapp/server/api/rest/imports/send.js",
      hash = "8d8d8a0d5f8be492ef3f2da4f02107cfe236de86",
      Function = function () {}.constructor,
      global = new Function('return this')(),
      gcv = "__coverage__",
      coverageData = {
    path: "/home/doichain/dapp/server/api/rest/imports/send.js",
    statementMap: {
      "0": {
        start: {
          line: 13,
          column: 0
        },
        end: {
          line: 60,
          column: 3
        }
      },
      "1": {
        start: {
          line: 18,
          column: 22
        },
        end: {
          line: 18,
          column: 38
        }
      },
      "2": {
        start: {
          line: 19,
          column: 22
        },
        end: {
          line: 19,
          column: 37
        }
      },
      "3": {
        start: {
          line: 20,
          column: 19
        },
        end: {
          line: 20,
          column: 21
        }
      },
      "4": {
        start: {
          line: 21,
          column: 6
        },
        end: {
          line: 21,
          column: 53
        }
      },
      "5": {
        start: {
          line: 21,
          column: 32
        },
        end: {
          line: 21,
          column: 53
        }
      },
      "6": {
        start: {
          line: 22,
          column: 6
        },
        end: {
          line: 22,
          column: 64
        }
      },
      "7": {
        start: {
          line: 22,
          column: 32
        },
        end: {
          line: 22,
          column: 64
        }
      },
      "8": {
        start: {
          line: 24,
          column: 18
        },
        end: {
          line: 24,
          column: 29
        }
      },
      "9": {
        start: {
          line: 26,
          column: 6
        },
        end: {
          line: 29,
          column: 7
        }
      },
      "10": {
        start: {
          line: 28,
          column: 10
        },
        end: {
          line: 28,
          column: 34
        }
      },
      "11": {
        start: {
          line: 31,
          column: 6
        },
        end: {
          line: 31,
          column: 57
        }
      },
      "12": {
        start: {
          line: 32,
          column: 6
        },
        end: {
          line: 36,
          column: 7
        }
      },
      "13": {
        start: {
          line: 33,
          column: 10
        },
        end: {
          line: 33,
          column: 38
        }
      },
      "14": {
        start: {
          line: 35,
          column: 9
        },
        end: {
          line: 35,
          column: 35
        }
      },
      "15": {
        start: {
          line: 42,
          column: 22
        },
        end: {
          line: 42,
          column: 38
        }
      },
      "16": {
        start: {
          line: 43,
          column: 22
        },
        end: {
          line: 43,
          column: 37
        }
      },
      "17": {
        start: {
          line: 45,
          column: 6
        },
        end: {
          line: 45,
          column: 34
        }
      },
      "18": {
        start: {
          line: 46,
          column: 6
        },
        end: {
          line: 46,
          column: 34
        }
      },
      "19": {
        start: {
          line: 48,
          column: 19
        },
        end: {
          line: 48,
          column: 21
        }
      },
      "20": {
        start: {
          line: 49,
          column: 6
        },
        end: {
          line: 49,
          column: 53
        }
      },
      "21": {
        start: {
          line: 49,
          column: 32
        },
        end: {
          line: 49,
          column: 53
        }
      },
      "22": {
        start: {
          line: 50,
          column: 6
        },
        end: {
          line: 50,
          column: 64
        }
      },
      "23": {
        start: {
          line: 50,
          column: 32
        },
        end: {
          line: 50,
          column: 64
        }
      },
      "24": {
        start: {
          line: 51,
          column: 6
        },
        end: {
          line: 57,
          column: 7
        }
      },
      "25": {
        start: {
          line: 52,
          column: 20
        },
        end: {
          line: 52,
          column: 45
        }
      },
      "26": {
        start: {
          line: 53,
          column: 8
        },
        end: {
          line: 53,
          column: 45
        }
      },
      "27": {
        start: {
          line: 54,
          column: 8
        },
        end: {
          line: 54,
          column: 77
        }
      },
      "28": {
        start: {
          line: 56,
          column: 8
        },
        end: {
          line: 56,
          column: 81
        }
      },
      "29": {
        start: {
          line: 62,
          column: 0
        },
        end: {
          line: 77,
          column: 3
        }
      },
      "30": {
        start: {
          line: 65,
          column: 21
        },
        end: {
          line: 65,
          column: 37
        }
      },
      "31": {
        start: {
          line: 66,
          column: 6
        },
        end: {
          line: 74,
          column: 7
        }
      },
      "32": {
        start: {
          line: 67,
          column: 10
        },
        end: {
          line: 67,
          column: 111
        }
      },
      "33": {
        start: {
          line: 68,
          column: 23
        },
        end: {
          line: 68,
          column: 45
        }
      },
      "34": {
        start: {
          line: 69,
          column: 10
        },
        end: {
          line: 69,
          column: 127
        }
      },
      "35": {
        start: {
          line: 70,
          column: 8
        },
        end: {
          line: 70,
          column: 41
        }
      },
      "36": {
        start: {
          line: 72,
          column: 8
        },
        end: {
          line: 72,
          column: 58
        }
      },
      "37": {
        start: {
          line: 73,
          column: 8
        },
        end: {
          line: 73,
          column: 54
        }
      },
      "38": {
        start: {
          line: 79,
          column: 0
        },
        end: {
          line: 103,
          column: 3
        }
      },
      "39": {
        start: {
          line: 84,
          column: 25
        },
        end: {
          line: 84,
          column: 41
        }
      },
      "40": {
        start: {
          line: 85,
          column: 24
        },
        end: {
          line: 85,
          column: 35
        }
      },
      "41": {
        start: {
          line: 86,
          column: 12
        },
        end: {
          line: 91,
          column: 13
        }
      },
      "42": {
        start: {
          line: 87,
          column: 16
        },
        end: {
          line: 87,
          column: 50
        }
      },
      "43": {
        start: {
          line: 90,
          column: 16
        },
        end: {
          line: 90,
          column: 49
        }
      },
      "44": {
        start: {
          line: 92,
          column: 12
        },
        end: {
          line: 100,
          column: 13
        }
      },
      "45": {
        start: {
          line: 93,
          column: 16
        },
        end: {
          line: 93,
          column: 85
        }
      },
      "46": {
        start: {
          line: 94,
          column: 29
        },
        end: {
          line: 94,
          column: 47
        }
      },
      "47": {
        start: {
          line: 95,
          column: 16
        },
        end: {
          line: 95,
          column: 71
        }
      },
      "48": {
        start: {
          line: 96,
          column: 16
        },
        end: {
          line: 96,
          column: 49
        }
      },
      "49": {
        start: {
          line: 98,
          column: 16
        },
        end: {
          line: 98,
          column: 71
        }
      },
      "50": {
        start: {
          line: 99,
          column: 16
        },
        end: {
          line: 99,
          column: 62
        }
      },
      "51": {
        start: {
          line: 107,
          column: 4
        },
        end: {
          line: 107,
          column: 44
        }
      },
      "52": {
        start: {
          line: 109,
          column: 20
        },
        end: {
          line: 109,
          column: 38
        }
      },
      "53": {
        start: {
          line: 110,
          column: 27
        },
        end: {
          line: 110,
          column: 48
        }
      },
      "54": {
        start: {
          line: 111,
          column: 17
        },
        end: {
          line: 111,
          column: 28
        }
      },
      "55": {
        start: {
          line: 112,
          column: 20
        },
        end: {
          line: 112,
          column: 34
        }
      },
      "56": {
        start: {
          line: 115,
          column: 22
        },
        end: {
          line: 115,
          column: 24
        }
      },
      "57": {
        start: {
          line: 117,
          column: 4
        },
        end: {
          line: 133,
          column: 7
        }
      },
      "58": {
        start: {
          line: 119,
          column: 29
        },
        end: {
          line: 119,
          column: 155
        }
      },
      "59": {
        start: {
          line: 120,
          column: 8
        },
        end: {
          line: 120,
          column: 39
        }
      },
      "60": {
        start: {
          line: 121,
          column: 8
        },
        end: {
          line: 121,
          column: 112
        }
      },
      "61": {
        start: {
          line: 121,
          column: 80
        },
        end: {
          line: 121,
          column: 112
        }
      },
      "62": {
        start: {
          line: 122,
          column: 8
        },
        end: {
          line: 122,
          column: 39
        }
      },
      "63": {
        start: {
          line: 123,
          column: 8
        },
        end: {
          line: 123,
          column: 46
        }
      },
      "64": {
        start: {
          line: 125,
          column: 8
        },
        end: {
          line: 131,
          column: 9
        }
      },
      "65": {
        start: {
          line: 127,
          column: 12
        },
        end: {
          line: 127,
          column: 60
        }
      },
      "66": {
        start: {
          line: 128,
          column: 26
        },
        end: {
          line: 128,
          column: 63
        }
      },
      "67": {
        start: {
          line: 129,
          column: 12
        },
        end: {
          line: 129,
          column: 38
        }
      },
      "68": {
        start: {
          line: 130,
          column: 12
        },
        end: {
          line: 130,
          column: 55
        }
      },
      "69": {
        start: {
          line: 135,
          column: 4
        },
        end: {
          line: 135,
          column: 25
        }
      },
      "70": {
        start: {
          line: 137,
          column: 4
        },
        end: {
          line: 137,
          column: 23
        }
      },
      "71": {
        start: {
          line: 142,
          column: 4
        },
        end: {
          line: 148,
          column: 5
        }
      },
      "72": {
        start: {
          line: 143,
          column: 20
        },
        end: {
          line: 143,
          column: 36
        }
      },
      "73": {
        start: {
          line: 144,
          column: 8
        },
        end: {
          line: 144,
          column: 40
        }
      },
      "74": {
        start: {
          line: 145,
          column: 8
        },
        end: {
          line: 145,
          column: 97
        }
      },
      "75": {
        start: {
          line: 147,
          column: 8
        },
        end: {
          line: 147,
          column: 81
        }
      }
    },
    fnMap: {
      "0": {
        name: "(anonymous_0)",
        decl: {
          start: {
            line: 17,
            column: 12
          },
          end: {
            line: 17,
            column: 13
          }
        },
        loc: {
          start: {
            line: 17,
            column: 23
          },
          end: {
            line: 37,
            column: 5
          }
        },
        line: 17
      },
      "1": {
        name: "(anonymous_1)",
        decl: {
          start: {
            line: 41,
            column: 12
          },
          end: {
            line: 41,
            column: 13
          }
        },
        loc: {
          start: {
            line: 41,
            column: 23
          },
          end: {
            line: 58,
            column: 5
          }
        },
        line: 41
      },
      "2": {
        name: "(anonymous_2)",
        decl: {
          start: {
            line: 64,
            column: 12
          },
          end: {
            line: 64,
            column: 13
          }
        },
        loc: {
          start: {
            line: 64,
            column: 23
          },
          end: {
            line: 75,
            column: 5
          }
        },
        line: 64
      },
      "3": {
        name: "(anonymous_3)",
        decl: {
          start: {
            line: 83,
            column: 16
          },
          end: {
            line: 83,
            column: 17
          }
        },
        loc: {
          start: {
            line: 83,
            column: 27
          },
          end: {
            line: 101,
            column: 9
          }
        },
        line: 83
      },
      "4": {
        name: "prepareCoDOI",
        decl: {
          start: {
            line: 105,
            column: 9
          },
          end: {
            line: 105,
            column: 21
          }
        },
        loc: {
          start: {
            line: 105,
            column: 29
          },
          end: {
            line: 138,
            column: 1
          }
        },
        line: 105
      },
      "5": {
        name: "(anonymous_5)",
        decl: {
          start: {
            line: 117,
            column: 20
          },
          end: {
            line: 117,
            column: 21
          }
        },
        loc: {
          start: {
            line: 117,
            column: 38
          },
          end: {
            line: 133,
            column: 5
          }
        },
        line: 117
      },
      "6": {
        name: "prepareAdd",
        decl: {
          start: {
            line: 140,
            column: 9
          },
          end: {
            line: 140,
            column: 19
          }
        },
        loc: {
          start: {
            line: 140,
            column: 27
          },
          end: {
            line: 149,
            column: 1
          }
        },
        line: 140
      }
    },
    branchMap: {
      "0": {
        loc: {
          start: {
            line: 21,
            column: 6
          },
          end: {
            line: 21,
            column: 53
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 21,
            column: 6
          },
          end: {
            line: 21,
            column: 53
          }
        }, {
          start: {
            line: 21,
            column: 6
          },
          end: {
            line: 21,
            column: 53
          }
        }],
        line: 21
      },
      "1": {
        loc: {
          start: {
            line: 22,
            column: 6
          },
          end: {
            line: 22,
            column: 64
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 22,
            column: 6
          },
          end: {
            line: 22,
            column: 64
          }
        }, {
          start: {
            line: 22,
            column: 6
          },
          end: {
            line: 22,
            column: 64
          }
        }],
        line: 22
      },
      "2": {
        loc: {
          start: {
            line: 26,
            column: 6
          },
          end: {
            line: 29,
            column: 7
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 26,
            column: 6
          },
          end: {
            line: 29,
            column: 7
          }
        }, {
          start: {
            line: 26,
            column: 6
          },
          end: {
            line: 29,
            column: 7
          }
        }],
        line: 26
      },
      "3": {
        loc: {
          start: {
            line: 26,
            column: 9
          },
          end: {
            line: 27,
            column: 105
          }
        },
        type: "binary-expr",
        locations: [{
          start: {
            line: 26,
            column: 9
          },
          end: {
            line: 26,
            column: 42
          }
        }, {
          start: {
            line: 27,
            column: 11
          },
          end: {
            line: 27,
            column: 43
          }
        }, {
          start: {
            line: 27,
            column: 48
          },
          end: {
            line: 27,
            column: 71
          }
        }, {
          start: {
            line: 27,
            column: 75
          },
          end: {
            line: 27,
            column: 103
          }
        }],
        line: 26
      },
      "4": {
        loc: {
          start: {
            line: 32,
            column: 6
          },
          end: {
            line: 36,
            column: 7
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 32,
            column: 6
          },
          end: {
            line: 36,
            column: 7
          }
        }, {
          start: {
            line: 32,
            column: 6
          },
          end: {
            line: 36,
            column: 7
          }
        }],
        line: 32
      },
      "5": {
        loc: {
          start: {
            line: 49,
            column: 6
          },
          end: {
            line: 49,
            column: 53
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 49,
            column: 6
          },
          end: {
            line: 49,
            column: 53
          }
        }, {
          start: {
            line: 49,
            column: 6
          },
          end: {
            line: 49,
            column: 53
          }
        }],
        line: 49
      },
      "6": {
        loc: {
          start: {
            line: 50,
            column: 6
          },
          end: {
            line: 50,
            column: 64
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 50,
            column: 6
          },
          end: {
            line: 50,
            column: 64
          }
        }, {
          start: {
            line: 50,
            column: 6
          },
          end: {
            line: 50,
            column: 64
          }
        }],
        line: 50
      },
      "7": {
        loc: {
          start: {
            line: 86,
            column: 12
          },
          end: {
            line: 91,
            column: 13
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 86,
            column: 12
          },
          end: {
            line: 91,
            column: 13
          }
        }, {
          start: {
            line: 86,
            column: 12
          },
          end: {
            line: 91,
            column: 13
          }
        }],
        line: 86
      },
      "8": {
        loc: {
          start: {
            line: 121,
            column: 8
          },
          end: {
            line: 121,
            column: 112
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 121,
            column: 8
          },
          end: {
            line: 121,
            column: 112
          }
        }, {
          start: {
            line: 121,
            column: 8
          },
          end: {
            line: 121,
            column: 112
          }
        }],
        line: 121
      },
      "9": {
        loc: {
          start: {
            line: 121,
            column: 11
          },
          end: {
            line: 121,
            column: 78
          }
        },
        type: "binary-expr",
        locations: [{
          start: {
            line: 121,
            column: 11
          },
          end: {
            line: 121,
            column: 44
          }
        }, {
          start: {
            line: 121,
            column: 48
          },
          end: {
            line: 121,
            column: 78
          }
        }],
        line: 121
      },
      "10": {
        loc: {
          start: {
            line: 125,
            column: 8
          },
          end: {
            line: 131,
            column: 9
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 125,
            column: 8
          },
          end: {
            line: 131,
            column: 9
          }
        }, {
          start: {
            line: 125,
            column: 8
          },
          end: {
            line: 131,
            column: 9
          }
        }],
        line: 125
      }
    },
    s: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0,
      "7": 0,
      "8": 0,
      "9": 0,
      "10": 0,
      "11": 0,
      "12": 0,
      "13": 0,
      "14": 0,
      "15": 0,
      "16": 0,
      "17": 0,
      "18": 0,
      "19": 0,
      "20": 0,
      "21": 0,
      "22": 0,
      "23": 0,
      "24": 0,
      "25": 0,
      "26": 0,
      "27": 0,
      "28": 0,
      "29": 0,
      "30": 0,
      "31": 0,
      "32": 0,
      "33": 0,
      "34": 0,
      "35": 0,
      "36": 0,
      "37": 0,
      "38": 0,
      "39": 0,
      "40": 0,
      "41": 0,
      "42": 0,
      "43": 0,
      "44": 0,
      "45": 0,
      "46": 0,
      "47": 0,
      "48": 0,
      "49": 0,
      "50": 0,
      "51": 0,
      "52": 0,
      "53": 0,
      "54": 0,
      "55": 0,
      "56": 0,
      "57": 0,
      "58": 0,
      "59": 0,
      "60": 0,
      "61": 0,
      "62": 0,
      "63": 0,
      "64": 0,
      "65": 0,
      "66": 0,
      "67": 0,
      "68": 0,
      "69": 0,
      "70": 0,
      "71": 0,
      "72": 0,
      "73": 0,
      "74": 0,
      "75": 0
    },
    f: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0
    },
    b: {
      "0": [0, 0],
      "1": [0, 0],
      "2": [0, 0],
      "3": [0, 0, 0, 0],
      "4": [0, 0],
      "5": [0, 0],
      "6": [0, 0],
      "7": [0, 0],
      "8": [0, 0],
      "9": [0, 0],
      "10": [0, 0]
    },
    _coverageSchema: "43e27e138ebf9cfc5966b082cf9a028302ed4184"
  },
      coverage = global[gcv] || (global[gcv] = {});

  if (coverage[path] && coverage[path].hash === hash) {
    return coverage[path];
  }

  coverageData.hash = hash;
  return coverage[path] = coverageData;
}();

//doku of meteor-restivus https://github.com/kahmali/meteor-restivus
cov_1wlomo8pac.s[0]++;
Api.addRoute(DOI_CONFIRMATION_NOTIFY_ROUTE, {
  post: {
    authRequired: true,
    //roleRequired: ['admin'],
    action: function () {
      cov_1wlomo8pac.f[0]++;
      const qParams = (cov_1wlomo8pac.s[1]++, this.queryParams);
      const bParams = (cov_1wlomo8pac.s[2]++, this.bodyParams);
      let params = (cov_1wlomo8pac.s[3]++, {});
      cov_1wlomo8pac.s[4]++;

      if (qParams !== undefined) {
        cov_1wlomo8pac.b[0][0]++;
        cov_1wlomo8pac.s[5]++;
        params = (0, _objectSpread2.default)({}, qParams);
      } else {
        cov_1wlomo8pac.b[0][1]++;
      }

      cov_1wlomo8pac.s[6]++;

      if (bParams !== undefined) {
        cov_1wlomo8pac.b[1][0]++;
        cov_1wlomo8pac.s[7]++;
        params = (0, _objectSpread2.default)({}, params, bParams);
      } else {
        cov_1wlomo8pac.b[1][1]++;
      }

      const uid = (cov_1wlomo8pac.s[8]++, this.userId);
      cov_1wlomo8pac.s[9]++;

      if ((cov_1wlomo8pac.b[3][0]++, !Roles.userIsInRole(uid, 'admin')) || //if its not an admin always use uid as ownerId
      (cov_1wlomo8pac.b[3][1]++, Roles.userIsInRole(uid, 'admin')) && ((cov_1wlomo8pac.b[3][2]++, params["ownerId"] == null) || (cov_1wlomo8pac.b[3][3]++, params["ownerId"] == undefined))) {
        cov_1wlomo8pac.b[2][0]++;
        cov_1wlomo8pac.s[10]++; //if its an admin only use uid in case no ownerId was given

        params["ownerId"] = uid;
      } else {
        cov_1wlomo8pac.b[2][1]++;
      }

      cov_1wlomo8pac.s[11]++;
      logSend('parameter received from browser:', params);
      cov_1wlomo8pac.s[12]++;

      if (params.sender_mail.constructor === Array) {
        cov_1wlomo8pac.b[4][0]++;
        cov_1wlomo8pac.s[13]++; //this is a SOI with co-sponsors first email is main sponsor

        return prepareCoDOI(params);
      } else {
        cov_1wlomo8pac.b[4][1]++;
        cov_1wlomo8pac.s[14]++;
        return prepareAdd(params);
      }
    }
  },
  put: {
    authRequired: false,
    action: function () {
      cov_1wlomo8pac.f[1]++;
      const qParams = (cov_1wlomo8pac.s[15]++, this.queryParams);
      const bParams = (cov_1wlomo8pac.s[16]++, this.bodyParams);
      cov_1wlomo8pac.s[17]++;
      logSend('qParams:', qParams);
      cov_1wlomo8pac.s[18]++;
      logSend('bParams:', bParams);
      let params = (cov_1wlomo8pac.s[19]++, {});
      cov_1wlomo8pac.s[20]++;

      if (qParams !== undefined) {
        cov_1wlomo8pac.b[5][0]++;
        cov_1wlomo8pac.s[21]++;
        params = (0, _objectSpread2.default)({}, qParams);
      } else {
        cov_1wlomo8pac.b[5][1]++;
      }

      cov_1wlomo8pac.s[22]++;

      if (bParams !== undefined) {
        cov_1wlomo8pac.b[6][0]++;
        cov_1wlomo8pac.s[23]++;
        params = (0, _objectSpread2.default)({}, params, bParams);
      } else {
        cov_1wlomo8pac.b[6][1]++;
      }

      cov_1wlomo8pac.s[24]++;

      try {
        const val = (cov_1wlomo8pac.s[25]++, updateOptInStatus(params));
        cov_1wlomo8pac.s[26]++;
        logSend('opt-In status updated', val);
        cov_1wlomo8pac.s[27]++;
        return {
          status: 'success',
          data: {
            message: 'Opt-In status updated'
          }
        };
      } catch (error) {
        cov_1wlomo8pac.s[28]++;
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
cov_1wlomo8pac.s[29]++;
Api.addRoute(DOI_FETCH_ROUTE, {
  authRequired: false
}, {
  get: {
    action: function () {
      cov_1wlomo8pac.f[2]++;
      const params = (cov_1wlomo8pac.s[30]++, this.queryParams);
      cov_1wlomo8pac.s[31]++;

      try {
        cov_1wlomo8pac.s[32]++;
        logSend('rest api - DOI_FETCH_ROUTE called by bob to request email template', JSON.stringify(params));
        const data = (cov_1wlomo8pac.s[33]++, getDoiMailData(params));
        cov_1wlomo8pac.s[34]++;
        logSend('got doi-mail-data (including templalte) returning to bob', {
          subject: data.subject,
          recipient: data.recipient
        });
        cov_1wlomo8pac.s[35]++;
        return {
          status: 'success',
          data
        };
      } catch (error) {
        cov_1wlomo8pac.s[36]++;
        logError('error while getting DoiMailData', error);
        cov_1wlomo8pac.s[37]++;
        return {
          status: 'fail',
          error: error.message
        };
      }
    }
  }
});
cov_1wlomo8pac.s[38]++;
Api.addRoute(DOI_EXPORT_ROUTE, {
  get: {
    authRequired: true,
    //roleRequired: ['admin'],
    action: function () {
      cov_1wlomo8pac.f[3]++;
      let params = (cov_1wlomo8pac.s[39]++, this.queryParams);
      const uid = (cov_1wlomo8pac.s[40]++, this.userId);
      cov_1wlomo8pac.s[41]++;

      if (!Roles.userIsInRole(uid, 'admin')) {
        cov_1wlomo8pac.b[7][0]++;
        cov_1wlomo8pac.s[42]++;
        params = {
          userid: uid,
          role: 'user'
        };
      } else {
        cov_1wlomo8pac.b[7][1]++;
        cov_1wlomo8pac.s[43]++;
        params = (0, _objectSpread2.default)({}, params, {
          role: 'admin'
        });
      }

      cov_1wlomo8pac.s[44]++;

      try {
        cov_1wlomo8pac.s[45]++;
        logSend('rest api - DOI_EXPORT_ROUTE called', JSON.stringify(params));
        const data = (cov_1wlomo8pac.s[46]++, exportDois(params));
        cov_1wlomo8pac.s[47]++;
        logSend('got dois from database', JSON.stringify(data));
        cov_1wlomo8pac.s[48]++;
        return {
          status: 'success',
          data
        };
      } catch (error) {
        cov_1wlomo8pac.s[49]++;
        logError('error while exporting confirmed dois', error);
        cov_1wlomo8pac.s[50]++;
        return {
          status: 'fail',
          error: error.message
        };
      }
    }
  }
});

function prepareCoDOI(params) {
  cov_1wlomo8pac.f[4]++;
  cov_1wlomo8pac.s[51]++;
  logSend('is array ', params.sender_mail);
  const senders = (cov_1wlomo8pac.s[52]++, params.sender_mail);
  const recipient_mail = (cov_1wlomo8pac.s[53]++, params.recipient_mail);
  const data = (cov_1wlomo8pac.s[54]++, params.data);
  const ownerID = (cov_1wlomo8pac.s[55]++, params.ownerId);
  let currentOptInId;
  let retResponse = (cov_1wlomo8pac.s[56]++, []);
  let master_doi;
  cov_1wlomo8pac.s[57]++;
  senders.forEach((sender, index) => {
    cov_1wlomo8pac.f[5]++;
    const ret_response = (cov_1wlomo8pac.s[58]++, prepareAdd({
      sender_mail: sender,
      recipient_mail: recipient_mail,
      data: data,
      master_doi: master_doi,
      index: index,
      ownerId: ownerID
    }));
    cov_1wlomo8pac.s[59]++;
    logSend('CoDOI:', ret_response);
    cov_1wlomo8pac.s[60]++;

    if ((cov_1wlomo8pac.b[9][0]++, ret_response.status === undefined) || (cov_1wlomo8pac.b[9][1]++, ret_response.status === "failed")) {
      cov_1wlomo8pac.b[8][0]++;
      cov_1wlomo8pac.s[61]++;
      throw "could not add co-opt-in";
    } else {
      cov_1wlomo8pac.b[8][1]++;
    }

    cov_1wlomo8pac.s[62]++;
    retResponse.push(ret_response);
    cov_1wlomo8pac.s[63]++;
    currentOptInId = ret_response.data.id;
    cov_1wlomo8pac.s[64]++;

    if (index === 0) {
      cov_1wlomo8pac.b[10][0]++;
      cov_1wlomo8pac.s[65]++;
      logSend('main sponsor optInId:', currentOptInId);
      const optIn = (cov_1wlomo8pac.s[66]++, OptIns.findOne({
        _id: currentOptInId
      }));
      cov_1wlomo8pac.s[67]++;
      master_doi = optIn.nameId;
      cov_1wlomo8pac.s[68]++;
      logSend('main sponsor nameId:', master_doi);
    } else {
      cov_1wlomo8pac.b[10][1]++;
    }
  });
  cov_1wlomo8pac.s[69]++;
  logSend(retResponse);
  cov_1wlomo8pac.s[70]++;
  return retResponse;
}

function prepareAdd(params) {
  cov_1wlomo8pac.f[6]++;
  cov_1wlomo8pac.s[71]++;

  try {
    const val = (cov_1wlomo8pac.s[72]++, addOptIn(params));
    cov_1wlomo8pac.s[73]++;
    logSend('opt-In added ID:', val);
    cov_1wlomo8pac.s[74]++;
    return {
      status: 'success',
      data: {
        id: val,
        status: 'success',
        message: 'Opt-In added.'
      }
    };
  } catch (error) {
    cov_1wlomo8pac.s[75]++;
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

var cov_1j5lk9oyuj = function () {
  var path = "/home/doichain/dapp/server/api/rest/imports/user.js",
      hash = "39510a19f6fdb40bce340aee500bd6d0ff074d29",
      Function = function () {}.constructor,
      global = new Function('return this')(),
      gcv = "__coverage__",
      coverageData = {
    path: "/home/doichain/dapp/server/api/rest/imports/user.js",
    statementMap: {
      "0": {
        start: {
          line: 8,
          column: 27
        },
        end: {
          line: 28,
          column: 2
        }
      },
      "1": {
        start: {
          line: 30,
          column: 25
        },
        end: {
          line: 47,
          column: 4
        }
      },
      "2": {
        start: {
          line: 48,
          column: 27
        },
        end: {
          line: 52,
          column: 2
        }
      },
      "3": {
        start: {
          line: 56,
          column: 2
        },
        end: {
          line: 124,
          column: 1
        }
      },
      "4": {
        start: {
          line: 71,
          column: 32
        },
        end: {
          line: 71,
          column: 48
        }
      },
      "5": {
        start: {
          line: 72,
          column: 32
        },
        end: {
          line: 72,
          column: 47
        }
      },
      "6": {
        start: {
          line: 73,
          column: 29
        },
        end: {
          line: 73,
          column: 31
        }
      },
      "7": {
        start: {
          line: 74,
          column: 16
        },
        end: {
          line: 74,
          column: 63
        }
      },
      "8": {
        start: {
          line: 74,
          column: 42
        },
        end: {
          line: 74,
          column: 63
        }
      },
      "9": {
        start: {
          line: 75,
          column: 16
        },
        end: {
          line: 75,
          column: 74
        }
      },
      "10": {
        start: {
          line: 75,
          column: 42
        },
        end: {
          line: 75,
          column: 74
        }
      },
      "11": {
        start: {
          line: 76,
          column: 16
        },
        end: {
          line: 92,
          column: 17
        }
      },
      "12": {
        start: {
          line: 78,
          column: 20
        },
        end: {
          line: 78,
          column: 54
        }
      },
      "13": {
        start: {
          line: 79,
          column: 20
        },
        end: {
          line: 79,
          column: 48
        }
      },
      "14": {
        start: {
          line: 80,
          column: 20
        },
        end: {
          line: 88,
          column: 21
        }
      },
      "15": {
        start: {
          line: 81,
          column: 24
        },
        end: {
          line: 84,
          column: 73
        }
      },
      "16": {
        start: {
          line: 87,
          column: 24
        },
        end: {
          line: 87,
          column: 137
        }
      },
      "17": {
        start: {
          line: 89,
          column: 20
        },
        end: {
          line: 89,
          column: 71
        }
      },
      "18": {
        start: {
          line: 91,
          column: 18
        },
        end: {
          line: 91,
          column: 91
        }
      },
      "19": {
        start: {
          line: 99,
          column: 32
        },
        end: {
          line: 99,
          column: 48
        }
      },
      "20": {
        start: {
          line: 100,
          column: 32
        },
        end: {
          line: 100,
          column: 47
        }
      },
      "21": {
        start: {
          line: 101,
          column: 29
        },
        end: {
          line: 101,
          column: 31
        }
      },
      "22": {
        start: {
          line: 102,
          column: 24
        },
        end: {
          line: 102,
          column: 35
        }
      },
      "23": {
        start: {
          line: 103,
          column: 30
        },
        end: {
          line: 103,
          column: 47
        }
      },
      "24": {
        start: {
          line: 104,
          column: 16
        },
        end: {
          line: 104,
          column: 63
        }
      },
      "25": {
        start: {
          line: 104,
          column: 42
        },
        end: {
          line: 104,
          column: 63
        }
      },
      "26": {
        start: {
          line: 105,
          column: 16
        },
        end: {
          line: 105,
          column: 74
        }
      },
      "27": {
        start: {
          line: 105,
          column: 42
        },
        end: {
          line: 105,
          column: 74
        }
      },
      "28": {
        start: {
          line: 107,
          column: 16
        },
        end: {
          line: 120,
          column: 17
        }
      },
      "29": {
        start: {
          line: 108,
          column: 20
        },
        end: {
          line: 112,
          column: 21
        }
      },
      "30": {
        start: {
          line: 109,
          column: 24
        },
        end: {
          line: 111,
          column: 25
        }
      },
      "31": {
        start: {
          line: 110,
          column: 28
        },
        end: {
          line: 110,
          column: 57
        }
      },
      "32": {
        start: {
          line: 113,
          column: 20
        },
        end: {
          line: 113,
          column: 54
        }
      },
      "33": {
        start: {
          line: 114,
          column: 20
        },
        end: {
          line: 116,
          column: 21
        }
      },
      "34": {
        start: {
          line: 115,
          column: 24
        },
        end: {
          line: 115,
          column: 61
        }
      },
      "35": {
        start: {
          line: 117,
          column: 20
        },
        end: {
          line: 117,
          column: 116
        }
      },
      "36": {
        start: {
          line: 119,
          column: 18
        },
        end: {
          line: 119,
          column: 91
        }
      },
      "37": {
        start: {
          line: 125,
          column: 0
        },
        end: {
          line: 125,
          column: 50
        }
      }
    },
    fnMap: {
      "0": {
        name: "(anonymous_0)",
        decl: {
          start: {
            line: 70,
            column: 20
          },
          end: {
            line: 70,
            column: 21
          }
        },
        loc: {
          start: {
            line: 70,
            column: 30
          },
          end: {
            line: 94,
            column: 13
          }
        },
        line: 70
      },
      "1": {
        name: "(anonymous_1)",
        decl: {
          start: {
            line: 98,
            column: 20
          },
          end: {
            line: 98,
            column: 21
          }
        },
        loc: {
          start: {
            line: 98,
            column: 30
          },
          end: {
            line: 121,
            column: 13
          }
        },
        line: 98
      }
    },
    branchMap: {
      "0": {
        loc: {
          start: {
            line: 74,
            column: 16
          },
          end: {
            line: 74,
            column: 63
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 74,
            column: 16
          },
          end: {
            line: 74,
            column: 63
          }
        }, {
          start: {
            line: 74,
            column: 16
          },
          end: {
            line: 74,
            column: 63
          }
        }],
        line: 74
      },
      "1": {
        loc: {
          start: {
            line: 75,
            column: 16
          },
          end: {
            line: 75,
            column: 74
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 75,
            column: 16
          },
          end: {
            line: 75,
            column: 74
          }
        }, {
          start: {
            line: 75,
            column: 16
          },
          end: {
            line: 75,
            column: 74
          }
        }],
        line: 75
      },
      "2": {
        loc: {
          start: {
            line: 80,
            column: 20
          },
          end: {
            line: 88,
            column: 21
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 80,
            column: 20
          },
          end: {
            line: 88,
            column: 21
          }
        }, {
          start: {
            line: 80,
            column: 20
          },
          end: {
            line: 88,
            column: 21
          }
        }],
        line: 80
      },
      "3": {
        loc: {
          start: {
            line: 104,
            column: 16
          },
          end: {
            line: 104,
            column: 63
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 104,
            column: 16
          },
          end: {
            line: 104,
            column: 63
          }
        }, {
          start: {
            line: 104,
            column: 16
          },
          end: {
            line: 104,
            column: 63
          }
        }],
        line: 104
      },
      "4": {
        loc: {
          start: {
            line: 105,
            column: 16
          },
          end: {
            line: 105,
            column: 74
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 105,
            column: 16
          },
          end: {
            line: 105,
            column: 74
          }
        }, {
          start: {
            line: 105,
            column: 16
          },
          end: {
            line: 105,
            column: 74
          }
        }],
        line: 105
      },
      "5": {
        loc: {
          start: {
            line: 108,
            column: 20
          },
          end: {
            line: 112,
            column: 21
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 108,
            column: 20
          },
          end: {
            line: 112,
            column: 21
          }
        }, {
          start: {
            line: 108,
            column: 20
          },
          end: {
            line: 112,
            column: 21
          }
        }],
        line: 108
      },
      "6": {
        loc: {
          start: {
            line: 109,
            column: 24
          },
          end: {
            line: 111,
            column: 25
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 109,
            column: 24
          },
          end: {
            line: 111,
            column: 25
          }
        }, {
          start: {
            line: 109,
            column: 24
          },
          end: {
            line: 111,
            column: 25
          }
        }],
        line: 109
      },
      "7": {
        loc: {
          start: {
            line: 114,
            column: 20
          },
          end: {
            line: 116,
            column: 21
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 114,
            column: 20
          },
          end: {
            line: 116,
            column: 21
          }
        }, {
          start: {
            line: 114,
            column: 20
          },
          end: {
            line: 116,
            column: 21
          }
        }],
        line: 114
      }
    },
    s: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0,
      "7": 0,
      "8": 0,
      "9": 0,
      "10": 0,
      "11": 0,
      "12": 0,
      "13": 0,
      "14": 0,
      "15": 0,
      "16": 0,
      "17": 0,
      "18": 0,
      "19": 0,
      "20": 0,
      "21": 0,
      "22": 0,
      "23": 0,
      "24": 0,
      "25": 0,
      "26": 0,
      "27": 0,
      "28": 0,
      "29": 0,
      "30": 0,
      "31": 0,
      "32": 0,
      "33": 0,
      "34": 0,
      "35": 0,
      "36": 0,
      "37": 0
    },
    f: {
      "0": 0,
      "1": 0
    },
    b: {
      "0": [0, 0],
      "1": [0, 0],
      "2": [0, 0],
      "3": [0, 0],
      "4": [0, 0],
      "5": [0, 0],
      "6": [0, 0],
      "7": [0, 0]
    },
    _coverageSchema: "43e27e138ebf9cfc5966b082cf9a028302ed4184"
  },
      coverage = global[gcv] || (global[gcv] = {});

  if (coverage[path] && coverage[path].hash === hash) {
    return coverage[path];
  }

  coverageData.hash = hash;
  return coverage[path] = coverageData;
}();

const mailTemplateSchema = (cov_1j5lk9oyuj.s[0]++, new SimpleSchema({
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
}));
const createUserSchema = (cov_1j5lk9oyuj.s[1]++, new SimpleSchema({
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
}));
const updateUserSchema = (cov_1j5lk9oyuj.s[2]++, new SimpleSchema({
  mailTemplate: {
    type: mailTemplateSchema
  }
})); //TODO: collection options separate

const collectionOptions = (cov_1j5lk9oyuj.s[3]++, {
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
        cov_1j5lk9oyuj.f[0]++;
        const qParams = (cov_1j5lk9oyuj.s[4]++, this.queryParams);
        const bParams = (cov_1j5lk9oyuj.s[5]++, this.bodyParams);
        let params = (cov_1j5lk9oyuj.s[6]++, {});
        cov_1j5lk9oyuj.s[7]++;

        if (qParams !== undefined) {
          cov_1j5lk9oyuj.b[0][0]++;
          cov_1j5lk9oyuj.s[8]++;
          params = (0, _objectSpread2.default)({}, qParams);
        } else {
          cov_1j5lk9oyuj.b[0][1]++;
        }

        cov_1j5lk9oyuj.s[9]++;

        if (bParams !== undefined) {
          cov_1j5lk9oyuj.b[1][0]++;
          cov_1j5lk9oyuj.s[10]++;
          params = (0, _objectSpread2.default)({}, params, bParams);
        } else {
          cov_1j5lk9oyuj.b[1][1]++;
        }

        cov_1j5lk9oyuj.s[11]++;

        try {
          let userId;
          cov_1j5lk9oyuj.s[12]++;
          createUserSchema.validate(params);
          cov_1j5lk9oyuj.s[13]++;
          logMain('validated', params);
          cov_1j5lk9oyuj.s[14]++;

          if (params.mailTemplate !== undefined) {
            cov_1j5lk9oyuj.b[2][0]++;
            cov_1j5lk9oyuj.s[15]++;
            userId = Accounts.createUser({
              username: params.username,
              email: params.email,
              password: params.password,
              profile: {
                mailTemplate: params.mailTemplate
              }
            });
          } else {
            cov_1j5lk9oyuj.b[2][1]++;
            cov_1j5lk9oyuj.s[16]++;
            userId = Accounts.createUser({
              username: params.username,
              email: params.email,
              password: params.password,
              profile: {}
            });
          }

          cov_1j5lk9oyuj.s[17]++;
          return {
            status: 'success',
            data: {
              userid: userId
            }
          };
        } catch (error) {
          cov_1j5lk9oyuj.s[18]++;
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
        cov_1j5lk9oyuj.f[1]++;
        const qParams = (cov_1j5lk9oyuj.s[19]++, this.queryParams);
        const bParams = (cov_1j5lk9oyuj.s[20]++, this.bodyParams);
        let params = (cov_1j5lk9oyuj.s[21]++, {});
        let uid = (cov_1j5lk9oyuj.s[22]++, this.userId);
        const paramId = (cov_1j5lk9oyuj.s[23]++, this.urlParams.id);
        cov_1j5lk9oyuj.s[24]++;

        if (qParams !== undefined) {
          cov_1j5lk9oyuj.b[3][0]++;
          cov_1j5lk9oyuj.s[25]++;
          params = (0, _objectSpread2.default)({}, qParams);
        } else {
          cov_1j5lk9oyuj.b[3][1]++;
        }

        cov_1j5lk9oyuj.s[26]++;

        if (bParams !== undefined) {
          cov_1j5lk9oyuj.b[4][0]++;
          cov_1j5lk9oyuj.s[27]++;
          params = (0, _objectSpread2.default)({}, params, bParams);
        } else {
          cov_1j5lk9oyuj.b[4][1]++;
        }

        cov_1j5lk9oyuj.s[28]++;

        try {
          cov_1j5lk9oyuj.s[29]++; //TODO this is not necessary here and can probably go right into the definition of the REST METHOD next to put (!?!)

          if (!Roles.userIsInRole(uid, 'admin')) {
            cov_1j5lk9oyuj.b[5][0]++;
            cov_1j5lk9oyuj.s[30]++;

            if (uid !== paramId) {
              cov_1j5lk9oyuj.b[6][0]++;
              cov_1j5lk9oyuj.s[31]++;
              throw Error("No Permission");
            } else {
              cov_1j5lk9oyuj.b[6][1]++;
            }
          } else {
            cov_1j5lk9oyuj.b[5][1]++;
          }

          cov_1j5lk9oyuj.s[32]++;
          updateUserSchema.validate(params);
          cov_1j5lk9oyuj.s[33]++;

          if (!Meteor.users.update(this.urlParams.id, {
            $set: {
              "profile.mailTemplate": params.mailTemplate
            }
          })) {
            cov_1j5lk9oyuj.b[7][0]++;
            cov_1j5lk9oyuj.s[34]++;
            throw Error("Failed to update user");
          } else {
            cov_1j5lk9oyuj.b[7][1]++;
          }

          cov_1j5lk9oyuj.s[35]++;
          return {
            status: 'success',
            data: {
              userid: this.urlParams.id,
              mailTemplate: params.mailTemplate
            }
          };
        } catch (error) {
          cov_1j5lk9oyuj.s[36]++;
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
});
cov_1j5lk9oyuj.s[37]++;
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

var cov_2lgv33zhj8 = function () {
  var path = "/home/doichain/dapp/server/api/rest/imports/verify.js",
      hash = "24c5c480314bd32485863cc3a0dbaaa3bc263f5d",
      Function = function () {}.constructor,
      global = new Function('return this')(),
      gcv = "__coverage__",
      coverageData = {
    path: "/home/doichain/dapp/server/api/rest/imports/verify.js",
    statementMap: {
      "0": {
        start: {
          line: 4,
          column: 0
        },
        end: {
          line: 22,
          column: 3
        }
      },
      "1": {
        start: {
          line: 8,
          column: 24
        },
        end: {
          line: 8,
          column: 40
        }
      },
      "2": {
        start: {
          line: 9,
          column: 24
        },
        end: {
          line: 9,
          column: 39
        }
      },
      "3": {
        start: {
          line: 10,
          column: 21
        },
        end: {
          line: 10,
          column: 23
        }
      },
      "4": {
        start: {
          line: 11,
          column: 8
        },
        end: {
          line: 11,
          column: 55
        }
      },
      "5": {
        start: {
          line: 11,
          column: 34
        },
        end: {
          line: 11,
          column: 55
        }
      },
      "6": {
        start: {
          line: 12,
          column: 8
        },
        end: {
          line: 12,
          column: 66
        }
      },
      "7": {
        start: {
          line: 12,
          column: 34
        },
        end: {
          line: 12,
          column: 66
        }
      },
      "8": {
        start: {
          line: 14,
          column: 6
        },
        end: {
          line: 19,
          column: 7
        }
      },
      "9": {
        start: {
          line: 15,
          column: 20
        },
        end: {
          line: 15,
          column: 39
        }
      },
      "10": {
        start: {
          line: 16,
          column: 8
        },
        end: {
          line: 16,
          column: 48
        }
      },
      "11": {
        start: {
          line: 18,
          column: 8
        },
        end: {
          line: 18,
          column: 81
        }
      }
    },
    fnMap: {
      "0": {
        name: "(anonymous_0)",
        decl: {
          start: {
            line: 7,
            column: 12
          },
          end: {
            line: 7,
            column: 13
          }
        },
        loc: {
          start: {
            line: 7,
            column: 23
          },
          end: {
            line: 20,
            column: 5
          }
        },
        line: 7
      }
    },
    branchMap: {
      "0": {
        loc: {
          start: {
            line: 11,
            column: 8
          },
          end: {
            line: 11,
            column: 55
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 11,
            column: 8
          },
          end: {
            line: 11,
            column: 55
          }
        }, {
          start: {
            line: 11,
            column: 8
          },
          end: {
            line: 11,
            column: 55
          }
        }],
        line: 11
      },
      "1": {
        loc: {
          start: {
            line: 12,
            column: 8
          },
          end: {
            line: 12,
            column: 66
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 12,
            column: 8
          },
          end: {
            line: 12,
            column: 66
          }
        }, {
          start: {
            line: 12,
            column: 8
          },
          end: {
            line: 12,
            column: 66
          }
        }],
        line: 12
      }
    },
    s: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0,
      "7": 0,
      "8": 0,
      "9": 0,
      "10": 0,
      "11": 0
    },
    f: {
      "0": 0
    },
    b: {
      "0": [0, 0],
      "1": [0, 0]
    },
    _coverageSchema: "43e27e138ebf9cfc5966b082cf9a028302ed4184"
  },
      coverage = global[gcv] || (global[gcv] = {});

  if (coverage[path] && coverage[path].hash === hash) {
    return coverage[path];
  }

  coverageData.hash = hash;
  return coverage[path] = coverageData;
}();

cov_2lgv33zhj8.s[0]++;
Api.addRoute('opt-in/verify', {
  authRequired: true
}, {
  get: {
    authRequired: false,
    action: function () {
      cov_2lgv33zhj8.f[0]++;
      const qParams = (cov_2lgv33zhj8.s[1]++, this.queryParams);
      const bParams = (cov_2lgv33zhj8.s[2]++, this.bodyParams);
      let params = (cov_2lgv33zhj8.s[3]++, {});
      cov_2lgv33zhj8.s[4]++;

      if (qParams !== undefined) {
        cov_2lgv33zhj8.b[0][0]++;
        cov_2lgv33zhj8.s[5]++;
        params = (0, _objectSpread2.default)({}, qParams);
      } else {
        cov_2lgv33zhj8.b[0][1]++;
      }

      cov_2lgv33zhj8.s[6]++;

      if (bParams !== undefined) {
        cov_2lgv33zhj8.b[1][0]++;
        cov_2lgv33zhj8.s[7]++;
        params = (0, _objectSpread2.default)({}, params, bParams);
      } else {
        cov_2lgv33zhj8.b[1][1]++;
      }

      cov_2lgv33zhj8.s[8]++;

      try {
        const val = (cov_2lgv33zhj8.s[9]++, verifyOptIn(params));
        cov_2lgv33zhj8.s[10]++;
        return {
          status: "success",
          data: {
            val
          }
        };
      } catch (error) {
        cov_2lgv33zhj8.s[11]++;
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

var cov_1s6g8pm5jh = function () {
  var path = "/home/doichain/dapp/server/api/rest/rest.js",
      hash = "0402e534ce66e63bed96de207e79c295ab4b50c2",
      Function = function () {}.constructor,
      global = new Function('return this')(),
      gcv = "__coverage__",
      coverageData = {
    path: "/home/doichain/dapp/server/api/rest/rest.js",
    statementMap: {
      "0": {
        start: {
          line: 5,
          column: 38
        },
        end: {
          line: 5,
          column: 54
        }
      },
      "1": {
        start: {
          line: 6,
          column: 45
        },
        end: {
          line: 6,
          column: 53
        }
      },
      "2": {
        start: {
          line: 7,
          column: 38
        },
        end: {
          line: 7,
          column: 52
        }
      },
      "3": {
        start: {
          line: 8,
          column: 31
        },
        end: {
          line: 8,
          column: 41
        }
      },
      "4": {
        start: {
          line: 9,
          column: 32
        },
        end: {
          line: 9,
          column: 40
        }
      },
      "5": {
        start: {
          line: 10,
          column: 38
        },
        end: {
          line: 10,
          column: 45
        }
      },
      "6": {
        start: {
          line: 11,
          column: 24
        },
        end: {
          line: 11,
          column: 30
        }
      },
      "7": {
        start: {
          line: 12,
          column: 23
        },
        end: {
          line: 12,
          column: 27
        }
      },
      "8": {
        start: {
          line: 14,
          column: 19
        },
        end: {
          line: 19,
          column: 2
        }
      },
      "9": {
        start: {
          line: 21,
          column: 0
        },
        end: {
          line: 21,
          column: 44
        }
      },
      "10": {
        start: {
          line: 21,
          column: 14
        },
        end: {
          line: 21,
          column: 44
        }
      },
      "11": {
        start: {
          line: 22,
          column: 0
        },
        end: {
          line: 22,
          column: 53
        }
      },
      "12": {
        start: {
          line: 22,
          column: 24
        },
        end: {
          line: 22,
          column: 53
        }
      },
      "13": {
        start: {
          line: 23,
          column: 0
        },
        end: {
          line: 23,
          column: 59
        }
      },
      "14": {
        start: {
          line: 23,
          column: 27
        },
        end: {
          line: 23,
          column: 59
        }
      },
      "15": {
        start: {
          line: 24,
          column: 0
        },
        end: {
          line: 24,
          column: 57
        }
      },
      "16": {
        start: {
          line: 24,
          column: 26
        },
        end: {
          line: 24,
          column: 57
        }
      },
      "17": {
        start: {
          line: 25,
          column: 0
        },
        end: {
          line: 25,
          column: 29
        }
      }
    },
    fnMap: {},
    branchMap: {
      "0": {
        loc: {
          start: {
            line: 21,
            column: 0
          },
          end: {
            line: 21,
            column: 44
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 21,
            column: 0
          },
          end: {
            line: 21,
            column: 44
          }
        }, {
          start: {
            line: 21,
            column: 0
          },
          end: {
            line: 21,
            column: 44
          }
        }],
        line: 21
      },
      "1": {
        loc: {
          start: {
            line: 22,
            column: 0
          },
          end: {
            line: 22,
            column: 53
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 22,
            column: 0
          },
          end: {
            line: 22,
            column: 53
          }
        }, {
          start: {
            line: 22,
            column: 0
          },
          end: {
            line: 22,
            column: 53
          }
        }],
        line: 22
      },
      "2": {
        loc: {
          start: {
            line: 23,
            column: 0
          },
          end: {
            line: 23,
            column: 59
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 23,
            column: 0
          },
          end: {
            line: 23,
            column: 59
          }
        }, {
          start: {
            line: 23,
            column: 0
          },
          end: {
            line: 23,
            column: 59
          }
        }],
        line: 23
      },
      "3": {
        loc: {
          start: {
            line: 24,
            column: 0
          },
          end: {
            line: 24,
            column: 57
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 24,
            column: 0
          },
          end: {
            line: 24,
            column: 57
          }
        }, {
          start: {
            line: 24,
            column: 0
          },
          end: {
            line: 24,
            column: 57
          }
        }],
        line: 24
      }
    },
    s: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0,
      "7": 0,
      "8": 0,
      "9": 0,
      "10": 0,
      "11": 0,
      "12": 0,
      "13": 0,
      "14": 0,
      "15": 0,
      "16": 0,
      "17": 0
    },
    f: {},
    b: {
      "0": [0, 0],
      "1": [0, 0],
      "2": [0, 0],
      "3": [0, 0]
    },
    _coverageSchema: "43e27e138ebf9cfc5966b082cf9a028302ed4184"
  },
      coverage = global[gcv] || (global[gcv] = {});

  if (coverage[path] && coverage[path].hash === hash) {
    return coverage[path];
  }

  coverageData.hash = hash;
  return coverage[path] = coverageData;
}();

const DOI_CONFIRMATION_ROUTE = (cov_1s6g8pm5jh.s[0]++, "opt-in/confirm");
const DOI_CONFIRMATION_NOTIFY_ROUTE = (cov_1s6g8pm5jh.s[1]++, "opt-in");
const DOI_WALLETNOTIFY_ROUTE = (cov_1s6g8pm5jh.s[2]++, "walletnotify");
const DOI_FETCH_ROUTE = (cov_1s6g8pm5jh.s[3]++, "doi-mail");
const DOI_EXPORT_ROUTE = (cov_1s6g8pm5jh.s[4]++, "export");
const USERS_COLLECTION_ROUTE = (cov_1s6g8pm5jh.s[5]++, "users");
const API_PATH = (cov_1s6g8pm5jh.s[6]++, "api/");
const VERSION = (cov_1s6g8pm5jh.s[7]++, "v1");
const Api = (cov_1s6g8pm5jh.s[8]++, new Restivus({
  apiPath: API_PATH,
  version: VERSION,
  useDefaultAuth: true,
  prettyJson: true
}));
cov_1s6g8pm5jh.s[9]++;

if (isDebug()) {
  cov_1s6g8pm5jh.b[0][0]++;
  cov_1s6g8pm5jh.s[10]++;

  require('./imports/debug.js');
} else {
  cov_1s6g8pm5jh.b[0][1]++;
}

cov_1s6g8pm5jh.s[11]++;

if (isAppType(SEND_APP)) {
  cov_1s6g8pm5jh.b[1][0]++;
  cov_1s6g8pm5jh.s[12]++;

  require('./imports/send.js');
} else {
  cov_1s6g8pm5jh.b[1][1]++;
}

cov_1s6g8pm5jh.s[13]++;

if (isAppType(CONFIRM_APP)) {
  cov_1s6g8pm5jh.b[2][0]++;
  cov_1s6g8pm5jh.s[14]++;

  require('./imports/confirm.js');
} else {
  cov_1s6g8pm5jh.b[2][1]++;
}

cov_1s6g8pm5jh.s[15]++;

if (isAppType(VERIFY_APP)) {
  cov_1s6g8pm5jh.b[3][0]++;
  cov_1s6g8pm5jh.s[16]++;

  require('./imports/verify.js');
} else {
  cov_1s6g8pm5jh.b[3][1]++;
}

cov_1s6g8pm5jh.s[17]++;

require('./imports/user.js');
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

var cov_1wsbtn4rkx = function () {
  var path = "/home/doichain/dapp/server/api/blockchain_jobs.js",
      hash = "32ae04581b4795b282361bb0557aca1a0e65102b",
      Function = function () {}.constructor,
      global = new Function('return this')(),
      gcv = "__coverage__",
      coverageData = {
    path: "/home/doichain/dapp/server/api/blockchain_jobs.js",
    statementMap: {
      "0": {
        start: {
          line: 3,
          column: 30
        },
        end: {
          line: 3,
          column: 57
        }
      },
      "1": {
        start: {
          line: 12,
          column: 0
        },
        end: {
          line: 24,
          column: 3
        }
      },
      "2": {
        start: {
          line: 13,
          column: 2
        },
        end: {
          line: 23,
          column: 3
        }
      },
      "3": {
        start: {
          line: 14,
          column: 18
        },
        end: {
          line: 14,
          column: 26
        }
      },
      "4": {
        start: {
          line: 15,
          column: 4
        },
        end: {
          line: 15,
          column: 18
        }
      },
      "5": {
        start: {
          line: 16,
          column: 4
        },
        end: {
          line: 16,
          column: 15
        }
      },
      "6": {
        start: {
          line: 18,
          column: 4
        },
        end: {
          line: 18,
          column: 15
        }
      },
      "7": {
        start: {
          line: 20,
          column: 6
        },
        end: {
          line: 20,
          column: 76
        }
      },
      "8": {
        start: {
          line: 22,
          column: 4
        },
        end: {
          line: 22,
          column: 9
        }
      },
      "9": {
        start: {
          line: 26,
          column: 0
        },
        end: {
          line: 36,
          column: 3
        }
      },
      "10": {
        start: {
          line: 27,
          column: 2
        },
        end: {
          line: 35,
          column: 3
        }
      },
      "11": {
        start: {
          line: 28,
          column: 18
        },
        end: {
          line: 28,
          column: 26
        }
      },
      "12": {
        start: {
          line: 29,
          column: 4
        },
        end: {
          line: 29,
          column: 22
        }
      },
      "13": {
        start: {
          line: 31,
          column: 4
        },
        end: {
          line: 31,
          column: 15
        }
      },
      "14": {
        start: {
          line: 32,
          column: 4
        },
        end: {
          line: 32,
          column: 74
        }
      },
      "15": {
        start: {
          line: 34,
          column: 4
        },
        end: {
          line: 34,
          column: 9
        }
      },
      "16": {
        start: {
          line: 38,
          column: 0
        },
        end: {
          line: 53,
          column: 3
        }
      },
      "17": {
        start: {
          line: 39,
          column: 2
        },
        end: {
          line: 52,
          column: 3
        }
      },
      "18": {
        start: {
          line: 40,
          column: 4
        },
        end: {
          line: 46,
          column: 5
        }
      },
      "19": {
        start: {
          line: 41,
          column: 6
        },
        end: {
          line: 41,
          column: 18
        }
      },
      "20": {
        start: {
          line: 42,
          column: 6
        },
        end: {
          line: 42,
          column: 19
        }
      },
      "21": {
        start: {
          line: 43,
          column: 6
        },
        end: {
          line: 43,
          column: 19
        }
      },
      "22": {
        start: {
          line: 48,
          column: 4
        },
        end: {
          line: 48,
          column: 15
        }
      },
      "23": {
        start: {
          line: 49,
          column: 4
        },
        end: {
          line: 49,
          column: 88
        }
      },
      "24": {
        start: {
          line: 51,
          column: 4
        },
        end: {
          line: 51,
          column: 9
        }
      },
      "25": {
        start: {
          line: 55,
          column: 0
        },
        end: {
          line: 57,
          column: 33
        }
      },
      "26": {
        start: {
          line: 59,
          column: 8
        },
        end: {
          line: 74,
          column: 2
        }
      },
      "27": {
        start: {
          line: 60,
          column: 18
        },
        end: {
          line: 60,
          column: 28
        }
      },
      "28": {
        start: {
          line: 61,
          column: 4
        },
        end: {
          line: 61,
          column: 49
        }
      },
      "29": {
        start: {
          line: 63,
          column: 14
        },
        end: {
          line: 66,
          column: 31
        }
      },
      "30": {
        start: {
          line: 68,
          column: 4
        },
        end: {
          line: 68,
          column: 53
        }
      },
      "31": {
        start: {
          line: 69,
          column: 4
        },
        end: {
          line: 69,
          column: 35
        }
      },
      "32": {
        start: {
          line: 70,
          column: 4
        },
        end: {
          line: 72,
          column: 5
        }
      },
      "33": {
        start: {
          line: 71,
          column: 6
        },
        end: {
          line: 71,
          column: 49
        }
      },
      "34": {
        start: {
          line: 73,
          column: 4
        },
        end: {
          line: 73,
          column: 9
        }
      },
      "35": {
        start: {
          line: 76,
          column: 0
        },
        end: {
          line: 79,
          column: 7
        }
      },
      "36": {
        start: {
          line: 78,
          column: 29
        },
        end: {
          line: 78,
          column: 41
        }
      }
    },
    fnMap: {
      "0": {
        name: "(anonymous_0)",
        decl: {
          start: {
            line: 12,
            column: 60
          },
          end: {
            line: 12,
            column: 61
          }
        },
        loc: {
          start: {
            line: 12,
            column: 79
          },
          end: {
            line: 24,
            column: 1
          }
        },
        line: 12
      },
      "1": {
        name: "(anonymous_1)",
        decl: {
          start: {
            line: 26,
            column: 60
          },
          end: {
            line: 26,
            column: 61
          }
        },
        loc: {
          start: {
            line: 26,
            column: 79
          },
          end: {
            line: 36,
            column: 1
          }
        },
        line: 26
      },
      "2": {
        name: "(anonymous_2)",
        decl: {
          start: {
            line: 38,
            column: 73
          },
          end: {
            line: 38,
            column: 74
          }
        },
        loc: {
          start: {
            line: 38,
            column: 92
          },
          end: {
            line: 53,
            column: 1
          }
        },
        line: 38
      },
      "3": {
        name: "(anonymous_3)",
        decl: {
          start: {
            line: 59,
            column: 92
          },
          end: {
            line: 59,
            column: 93
          }
        },
        loc: {
          start: {
            line: 59,
            column: 111
          },
          end: {
            line: 74,
            column: 1
          }
        },
        line: 59
      },
      "4": {
        name: "(anonymous_4)",
        decl: {
          start: {
            line: 78,
            column: 15
          },
          end: {
            line: 78,
            column: 16
          }
        },
        loc: {
          start: {
            line: 78,
            column: 27
          },
          end: {
            line: 78,
            column: 43
          }
        },
        line: 78
      }
    },
    branchMap: {
      "0": {
        loc: {
          start: {
            line: 40,
            column: 4
          },
          end: {
            line: 46,
            column: 5
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 40,
            column: 4
          },
          end: {
            line: 46,
            column: 5
          }
        }, {
          start: {
            line: 40,
            column: 4
          },
          end: {
            line: 46,
            column: 5
          }
        }],
        line: 40
      },
      "1": {
        loc: {
          start: {
            line: 70,
            column: 4
          },
          end: {
            line: 72,
            column: 5
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 70,
            column: 4
          },
          end: {
            line: 72,
            column: 5
          }
        }, {
          start: {
            line: 70,
            column: 4
          },
          end: {
            line: 72,
            column: 5
          }
        }],
        line: 70
      }
    },
    s: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0,
      "7": 0,
      "8": 0,
      "9": 0,
      "10": 0,
      "11": 0,
      "12": 0,
      "13": 0,
      "14": 0,
      "15": 0,
      "16": 0,
      "17": 0,
      "18": 0,
      "19": 0,
      "20": 0,
      "21": 0,
      "22": 0,
      "23": 0,
      "24": 0,
      "25": 0,
      "26": 0,
      "27": 0,
      "28": 0,
      "29": 0,
      "30": 0,
      "31": 0,
      "32": 0,
      "33": 0,
      "34": 0,
      "35": 0,
      "36": 0
    },
    f: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0
    },
    b: {
      "0": [0, 0],
      "1": [0, 0]
    },
    _coverageSchema: "43e27e138ebf9cfc5966b082cf9a028302ed4184"
  },
      coverage = global[gcv] || (global[gcv] = {});

  if (coverage[path] && coverage[path].hash === hash) {
    return coverage[path];
  }

  coverageData.hash = hash;
  return coverage[path] = coverageData;
}();

const BlockchainJobs = (cov_1wsbtn4rkx.s[0]++, JobCollection('blockchain'));
cov_1wsbtn4rkx.s[1]++;
BlockchainJobs.processJobs('insert', {
  workTimeout: 30 * 1000
}, function (job, cb) {
  cov_1wsbtn4rkx.f[0]++;
  cov_1wsbtn4rkx.s[2]++;

  try {
    const entry = (cov_1wsbtn4rkx.s[3]++, job.data);
    cov_1wsbtn4rkx.s[4]++;
    insert(entry);
    cov_1wsbtn4rkx.s[5]++;
    job.done();
  } catch (exception) {
    cov_1wsbtn4rkx.s[6]++;
    job.fail();
    cov_1wsbtn4rkx.s[7]++;
    throw new Meteor.Error('jobs.blockchain.insert.exception', exception);
  } finally {
    cov_1wsbtn4rkx.s[8]++;
    cb();
  }
});
cov_1wsbtn4rkx.s[9]++;
BlockchainJobs.processJobs('update', {
  workTimeout: 30 * 1000
}, function (job, cb) {
  cov_1wsbtn4rkx.f[1]++;
  cov_1wsbtn4rkx.s[10]++;

  try {
    const entry = (cov_1wsbtn4rkx.s[11]++, job.data);
    cov_1wsbtn4rkx.s[12]++;
    update(entry, job);
  } catch (exception) {
    cov_1wsbtn4rkx.s[13]++;
    job.fail();
    cov_1wsbtn4rkx.s[14]++;
    throw new Meteor.Error('jobs.blockchain.update.exception', exception);
  } finally {
    cov_1wsbtn4rkx.s[15]++;
    cb();
  }
});
cov_1wsbtn4rkx.s[16]++;
BlockchainJobs.processJobs('checkNewTransaction', {
  workTimeout: 30 * 1000
}, function (job, cb) {
  cov_1wsbtn4rkx.f[2]++;
  cov_1wsbtn4rkx.s[17]++;

  try {
    cov_1wsbtn4rkx.s[18]++;

    if (!isAppType(CONFIRM_APP)) {
      cov_1wsbtn4rkx.b[0][0]++;
      cov_1wsbtn4rkx.s[19]++;
      job.pause();
      cov_1wsbtn4rkx.s[20]++;
      job.cancel();
      cov_1wsbtn4rkx.s[21]++;
      job.remove();
    } else {
      //checkNewTransaction(null,job);
      cov_1wsbtn4rkx.b[0][1]++;
    }
  } catch (exception) {
    cov_1wsbtn4rkx.s[22]++;
    job.fail();
    cov_1wsbtn4rkx.s[23]++;
    throw new Meteor.Error('jobs.blockchain.checkNewTransactions.exception', exception);
  } finally {
    cov_1wsbtn4rkx.s[24]++;
    cb();
  }
});
cov_1wsbtn4rkx.s[25]++;
new Job(BlockchainJobs, 'cleanup', {}).repeat({
  schedule: BlockchainJobs.later.parse.text("every 5 minutes")
}).save({
  cancelRepeats: true
});
let q = (cov_1wsbtn4rkx.s[26]++, BlockchainJobs.processJobs('cleanup', {
  pollInterval: false,
  workTimeout: 60 * 1000
}, function (job, cb) {
  cov_1wsbtn4rkx.f[3]++;
  const current = (cov_1wsbtn4rkx.s[27]++, new Date());
  cov_1wsbtn4rkx.s[28]++;
  current.setMinutes(current.getMinutes() - 5);
  const ids = (cov_1wsbtn4rkx.s[29]++, BlockchainJobs.find({
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
  }));
  cov_1wsbtn4rkx.s[30]++;
  logMain('found  removable blockchain jobs:', ids);
  cov_1wsbtn4rkx.s[31]++;
  BlockchainJobs.removeJobs(ids);
  cov_1wsbtn4rkx.s[32]++;

  if (ids.length > 0) {
    cov_1wsbtn4rkx.b[1][0]++;
    cov_1wsbtn4rkx.s[33]++;
    job.done("Removed #{ids.length} old jobs");
  } else {
    cov_1wsbtn4rkx.b[1][1]++;
  }

  cov_1wsbtn4rkx.s[34]++;
  cb();
}));
cov_1wsbtn4rkx.s[35]++;
BlockchainJobs.find({
  type: 'jobType',
  status: 'ready'
}).observe({
  added: function () {
    cov_1wsbtn4rkx.f[4]++;
    cov_1wsbtn4rkx.s[36]++;
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

var cov_17pmcarj9j = function () {
  var path = "/home/doichain/dapp/server/api/dapp_jobs.js",
      hash = "7091c123bc738522d6030bbfce7780b494aa75af",
      Function = function () {}.constructor,
      global = new Function('return this')(),
      gcv = "__coverage__",
      coverageData = {
    path: "/home/doichain/dapp/server/api/dapp_jobs.js",
    statementMap: {
      "0": {
        start: {
          line: 7,
          column: 24
        },
        end: {
          line: 7,
          column: 45
        }
      },
      "1": {
        start: {
          line: 9,
          column: 0
        },
        end: {
          line: 20,
          column: 3
        }
      },
      "2": {
        start: {
          line: 10,
          column: 2
        },
        end: {
          line: 19,
          column: 3
        }
      },
      "3": {
        start: {
          line: 11,
          column: 17
        },
        end: {
          line: 11,
          column: 25
        }
      },
      "4": {
        start: {
          line: 12,
          column: 4
        },
        end: {
          line: 12,
          column: 27
        }
      },
      "5": {
        start: {
          line: 13,
          column: 4
        },
        end: {
          line: 13,
          column: 15
        }
      },
      "6": {
        start: {
          line: 15,
          column: 4
        },
        end: {
          line: 15,
          column: 15
        }
      },
      "7": {
        start: {
          line: 16,
          column: 4
        },
        end: {
          line: 16,
          column: 78
        }
      },
      "8": {
        start: {
          line: 18,
          column: 4
        },
        end: {
          line: 18,
          column: 9
        }
      },
      "9": {
        start: {
          line: 23,
          column: 0
        },
        end: {
          line: 25,
          column: 33
        }
      },
      "10": {
        start: {
          line: 27,
          column: 8
        },
        end: {
          line: 42,
          column: 2
        }
      },
      "11": {
        start: {
          line: 28,
          column: 20
        },
        end: {
          line: 28,
          column: 30
        }
      },
      "12": {
        start: {
          line: 29,
          column: 4
        },
        end: {
          line: 29,
          column: 49
        }
      },
      "13": {
        start: {
          line: 31,
          column: 16
        },
        end: {
          line: 34,
          column: 29
        }
      },
      "14": {
        start: {
          line: 36,
          column: 4
        },
        end: {
          line: 36,
          column: 53
        }
      },
      "15": {
        start: {
          line: 37,
          column: 4
        },
        end: {
          line: 37,
          column: 29
        }
      },
      "16": {
        start: {
          line: 38,
          column: 4
        },
        end: {
          line: 40,
          column: 5
        }
      },
      "17": {
        start: {
          line: 39,
          column: 8
        },
        end: {
          line: 39,
          column: 51
        }
      },
      "18": {
        start: {
          line: 41,
          column: 4
        },
        end: {
          line: 41,
          column: 9
        }
      },
      "19": {
        start: {
          line: 44,
          column: 0
        },
        end: {
          line: 47,
          column: 7
        }
      },
      "20": {
        start: {
          line: 46,
          column: 29
        },
        end: {
          line: 46,
          column: 41
        }
      }
    },
    fnMap: {
      "0": {
        name: "(anonymous_0)",
        decl: {
          start: {
            line: 9,
            column: 41
          },
          end: {
            line: 9,
            column: 42
          }
        },
        loc: {
          start: {
            line: 9,
            column: 60
          },
          end: {
            line: 20,
            column: 1
          }
        },
        line: 9
      },
      "1": {
        name: "(anonymous_1)",
        decl: {
          start: {
            line: 27,
            column: 86
          },
          end: {
            line: 27,
            column: 87
          }
        },
        loc: {
          start: {
            line: 27,
            column: 105
          },
          end: {
            line: 42,
            column: 1
          }
        },
        line: 27
      },
      "2": {
        name: "(anonymous_2)",
        decl: {
          start: {
            line: 46,
            column: 15
          },
          end: {
            line: 46,
            column: 16
          }
        },
        loc: {
          start: {
            line: 46,
            column: 27
          },
          end: {
            line: 46,
            column: 43
          }
        },
        line: 46
      }
    },
    branchMap: {
      "0": {
        loc: {
          start: {
            line: 38,
            column: 4
          },
          end: {
            line: 40,
            column: 5
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 38,
            column: 4
          },
          end: {
            line: 40,
            column: 5
          }
        }, {
          start: {
            line: 38,
            column: 4
          },
          end: {
            line: 40,
            column: 5
          }
        }],
        line: 38
      }
    },
    s: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0,
      "7": 0,
      "8": 0,
      "9": 0,
      "10": 0,
      "11": 0,
      "12": 0,
      "13": 0,
      "14": 0,
      "15": 0,
      "16": 0,
      "17": 0,
      "18": 0,
      "19": 0,
      "20": 0
    },
    f: {
      "0": 0,
      "1": 0,
      "2": 0
    },
    b: {
      "0": [0, 0]
    },
    _coverageSchema: "43e27e138ebf9cfc5966b082cf9a028302ed4184"
  },
      coverage = global[gcv] || (global[gcv] = {});

  if (coverage[path] && coverage[path].hash === hash) {
    return coverage[path];
  }

  coverageData.hash = hash;
  return coverage[path] = coverageData;
}();

const DAppJobs = (cov_17pmcarj9j.s[0]++, JobCollection('dapp'));
cov_17pmcarj9j.s[1]++;
DAppJobs.processJobs('fetchDoiMailData', function (job, cb) {
  cov_17pmcarj9j.f[0]++;
  cov_17pmcarj9j.s[2]++;

  try {
    const data = (cov_17pmcarj9j.s[3]++, job.data);
    cov_17pmcarj9j.s[4]++;
    fetchDoiMailData(data);
    cov_17pmcarj9j.s[5]++;
    job.done();
  } catch (exception) {
    cov_17pmcarj9j.s[6]++;
    job.fail();
    cov_17pmcarj9j.s[7]++;
    throw new Meteor.Error('jobs.dapp.fetchDoiMailData.exception', exception);
  } finally {
    cov_17pmcarj9j.s[8]++;
    cb();
  }
});
cov_17pmcarj9j.s[9]++;
new Job(DAppJobs, 'cleanup', {}).repeat({
  schedule: DAppJobs.later.parse.text("every 5 minutes")
}).save({
  cancelRepeats: true
});
let q = (cov_17pmcarj9j.s[10]++, DAppJobs.processJobs('cleanup', {
  pollInterval: false,
  workTimeout: 60 * 1000
}, function (job, cb) {
  cov_17pmcarj9j.f[1]++;
  const current = (cov_17pmcarj9j.s[11]++, new Date());
  cov_17pmcarj9j.s[12]++;
  current.setMinutes(current.getMinutes() - 5);
  const ids = (cov_17pmcarj9j.s[13]++, DAppJobs.find({
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
  }));
  cov_17pmcarj9j.s[14]++;
  logMain('found  removable blockchain jobs:', ids);
  cov_17pmcarj9j.s[15]++;
  DAppJobs.removeJobs(ids);
  cov_17pmcarj9j.s[16]++;

  if (ids.length > 0) {
    cov_17pmcarj9j.b[0][0]++;
    cov_17pmcarj9j.s[17]++;
    job.done("Removed #{ids.length} old jobs");
  } else {
    cov_17pmcarj9j.b[0][1]++;
  }

  cov_17pmcarj9j.s[18]++;
  cb();
}));
cov_17pmcarj9j.s[19]++;
DAppJobs.find({
  type: 'jobType',
  status: 'ready'
}).observe({
  added: function () {
    cov_17pmcarj9j.f[2]++;
    cov_17pmcarj9j.s[20]++;
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

var cov_12y2t4q8q3 = function () {
  var path = "/home/doichain/dapp/server/api/dns.js",
      hash = "52b6e644f0480a54634ca8a415ad4f72410253b7",
      Function = function () {}.constructor,
      global = new Function('return this')(),
      gcv = "__coverage__",
      coverageData = {
    path: "/home/doichain/dapp/server/api/dns.js",
    statementMap: {
      "0": {
        start: {
          line: 6,
          column: 19
        },
        end: {
          line: 6,
          column: 51
        }
      },
      "1": {
        start: {
          line: 7,
          column: 2
        },
        end: {
          line: 23,
          column: 3
        }
      },
      "2": {
        start: {
          line: 8,
          column: 20
        },
        end: {
          line: 8,
          column: 41
        }
      },
      "3": {
        start: {
          line: 9,
          column: 4
        },
        end: {
          line: 9,
          column: 47
        }
      },
      "4": {
        start: {
          line: 9,
          column: 30
        },
        end: {
          line: 9,
          column: 47
        }
      },
      "5": {
        start: {
          line: 10,
          column: 16
        },
        end: {
          line: 10,
          column: 25
        }
      },
      "6": {
        start: {
          line: 11,
          column: 4
        },
        end: {
          line: 17,
          column: 7
        }
      },
      "7": {
        start: {
          line: 12,
          column: 6
        },
        end: {
          line: 16,
          column: 7
        }
      },
      "8": {
        start: {
          line: 13,
          column: 20
        },
        end: {
          line: 13,
          column: 53
        }
      },
      "9": {
        start: {
          line: 14,
          column: 8
        },
        end: {
          line: 14,
          column: 27
        }
      },
      "10": {
        start: {
          line: 18,
          column: 4
        },
        end: {
          line: 18,
          column: 17
        }
      },
      "11": {
        start: {
          line: 20,
          column: 4
        },
        end: {
          line: 22,
          column: 21
        }
      },
      "12": {
        start: {
          line: 21,
          column: 56
        },
        end: {
          line: 21,
          column: 73
        }
      },
      "13": {
        start: {
          line: 22,
          column: 9
        },
        end: {
          line: 22,
          column: 21
        }
      },
      "14": {
        start: {
          line: 27,
          column: 4
        },
        end: {
          line: 27,
          column: 70
        }
      },
      "15": {
        start: {
          line: 28,
          column: 4
        },
        end: {
          line: 30,
          column: 5
        }
      },
      "16": {
        start: {
          line: 29,
          column: 4
        },
        end: {
          line: 29,
          column: 27
        }
      }
    },
    fnMap: {
      "0": {
        name: "resolveTxt",
        decl: {
          start: {
            line: 5,
            column: 16
          },
          end: {
            line: 5,
            column: 26
          }
        },
        loc: {
          start: {
            line: 5,
            column: 40
          },
          end: {
            line: 24,
            column: 1
          }
        },
        line: 5
      },
      "1": {
        name: "(anonymous_1)",
        decl: {
          start: {
            line: 11,
            column: 20
          },
          end: {
            line: 11,
            column: 21
          }
        },
        loc: {
          start: {
            line: 11,
            column: 30
          },
          end: {
            line: 17,
            column: 5
          }
        },
        line: 11
      },
      "2": {
        name: "dns_resolveTxt",
        decl: {
          start: {
            line: 26,
            column: 9
          },
          end: {
            line: 26,
            column: 23
          }
        },
        loc: {
          start: {
            line: 26,
            column: 47
          },
          end: {
            line: 31,
            column: 1
          }
        },
        line: 26
      },
      "3": {
        name: "(anonymous_3)",
        decl: {
          start: {
            line: 28,
            column: 27
          },
          end: {
            line: 28,
            column: 28
          }
        },
        loc: {
          start: {
            line: 28,
            column: 45
          },
          end: {
            line: 30,
            column: 3
          }
        },
        line: 28
      }
    },
    branchMap: {
      "0": {
        loc: {
          start: {
            line: 9,
            column: 4
          },
          end: {
            line: 9,
            column: 47
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 9,
            column: 4
          },
          end: {
            line: 9,
            column: 47
          }
        }, {
          start: {
            line: 9,
            column: 4
          },
          end: {
            line: 9,
            column: 47
          }
        }],
        line: 9
      },
      "1": {
        loc: {
          start: {
            line: 12,
            column: 6
          },
          end: {
            line: 16,
            column: 7
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 12,
            column: 6
          },
          end: {
            line: 16,
            column: 7
          }
        }, {
          start: {
            line: 12,
            column: 6
          },
          end: {
            line: 16,
            column: 7
          }
        }],
        line: 12
      },
      "2": {
        loc: {
          start: {
            line: 20,
            column: 4
          },
          end: {
            line: 22,
            column: 21
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 20,
            column: 4
          },
          end: {
            line: 22,
            column: 21
          }
        }, {
          start: {
            line: 20,
            column: 4
          },
          end: {
            line: 22,
            column: 21
          }
        }],
        line: 20
      },
      "3": {
        loc: {
          start: {
            line: 20,
            column: 7
          },
          end: {
            line: 21,
            column: 54
          }
        },
        type: "binary-expr",
        locations: [{
          start: {
            line: 20,
            column: 7
          },
          end: {
            line: 20,
            column: 51
          }
        }, {
          start: {
            line: 21,
            column: 8
          },
          end: {
            line: 21,
            column: 54
          }
        }],
        line: 20
      }
    },
    s: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0,
      "7": 0,
      "8": 0,
      "9": 0,
      "10": 0,
      "11": 0,
      "12": 0,
      "13": 0,
      "14": 0,
      "15": 0,
      "16": 0
    },
    f: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0
    },
    b: {
      "0": [0, 0],
      "1": [0, 0],
      "2": [0, 0],
      "3": [0, 0]
    },
    _coverageSchema: "43e27e138ebf9cfc5966b082cf9a028302ed4184"
  },
      coverage = global[gcv] || (global[gcv] = {});

  if (coverage[path] && coverage[path].hash === hash) {
    return coverage[path];
  }

  coverageData.hash = hash;
  return coverage[path] = coverageData;
}();

function resolveTxt(key, domain) {
  cov_12y2t4q8q3.f[0]++;
  const syncFunc = (cov_12y2t4q8q3.s[0]++, Meteor.wrapAsync(dns_resolveTxt));
  cov_12y2t4q8q3.s[1]++;

  try {
    const records = (cov_12y2t4q8q3.s[2]++, syncFunc(key, domain));
    cov_12y2t4q8q3.s[3]++;

    if (records === undefined) {
      cov_12y2t4q8q3.b[0][0]++;
      cov_12y2t4q8q3.s[4]++;
      return undefined;
    } else {
      cov_12y2t4q8q3.b[0][1]++;
    }

    let value = (cov_12y2t4q8q3.s[5]++, undefined);
    cov_12y2t4q8q3.s[6]++;
    records.forEach(record => {
      cov_12y2t4q8q3.f[1]++;
      cov_12y2t4q8q3.s[7]++;

      if (record[0].startsWith(key)) {
        cov_12y2t4q8q3.b[1][0]++;
        const val = (cov_12y2t4q8q3.s[8]++, record[0].substring(key.length + 1));
        cov_12y2t4q8q3.s[9]++;
        value = val.trim();
      } else {
        cov_12y2t4q8q3.b[1][1]++;
      }
    });
    cov_12y2t4q8q3.s[10]++;
    return value;
  } catch (error) {
    cov_12y2t4q8q3.s[11]++;

    if ((cov_12y2t4q8q3.b[3][0]++, error.message.startsWith("queryTxt ENODATA")) || (cov_12y2t4q8q3.b[3][1]++, error.message.startsWith("queryTxt ENOTFOUND"))) {
      cov_12y2t4q8q3.b[2][0]++;
      cov_12y2t4q8q3.s[12]++;
      return undefined;
    } else {
      cov_12y2t4q8q3.b[2][1]++;
      cov_12y2t4q8q3.s[13]++;
      throw error;
    }
  }
}

function dns_resolveTxt(key, domain, callback) {
  cov_12y2t4q8q3.f[2]++;
  cov_12y2t4q8q3.s[14]++;
  logSend("resolving dns txt attribute: ", {
    key: key,
    domain: domain
  });
  cov_12y2t4q8q3.s[15]++;
  dns.resolveTxt(domain, (err, records) => {
    cov_12y2t4q8q3.f[3]++;
    cov_12y2t4q8q3.s[16]++;
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

var cov_2jdew3tnda = function () {
  var path = "/home/doichain/dapp/server/api/doichain.js",
      hash = "e5c5088648f2fdde7fe1909c39c1f85dde185d18",
      Function = function () {}.constructor,
      global = new Function('return this')(),
      gcv = "__coverage__",
      coverageData = {
    path: "/home/doichain/dapp/server/api/doichain.js",
    statementMap: {
      "0": {
        start: {
          line: 5,
          column: 18
        },
        end: {
          line: 5,
          column: 22
        }
      },
      "1": {
        start: {
          line: 9,
          column: 2
        },
        end: {
          line: 12,
          column: 3
        }
      },
      "2": {
        start: {
          line: 10,
          column: 8
        },
        end: {
          line: 10,
          column: 47
        }
      },
      "3": {
        start: {
          line: 11,
          column: 8
        },
        end: {
          line: 11,
          column: 106
        }
      },
      "4": {
        start: {
          line: 13,
          column: 2
        },
        end: {
          line: 16,
          column: 3
        }
      },
      "5": {
        start: {
          line: 14,
          column: 8
        },
        end: {
          line: 14,
          column: 36
        }
      },
      "6": {
        start: {
          line: 15,
          column: 8
        },
        end: {
          line: 15,
          column: 106
        }
      },
      "7": {
        start: {
          line: 17,
          column: 19
        },
        end: {
          line: 17,
          column: 57
        }
      },
      "8": {
        start: {
          line: 18,
          column: 2
        },
        end: {
          line: 18,
          column: 35
        }
      },
      "9": {
        start: {
          line: 22,
          column: 21
        },
        end: {
          line: 22,
          column: 28
        }
      },
      "10": {
        start: {
          line: 23,
          column: 2
        },
        end: {
          line: 26,
          column: 5
        }
      },
      "11": {
        start: {
          line: 24,
          column: 4
        },
        end: {
          line: 24,
          column: 51
        }
      },
      "12": {
        start: {
          line: 24,
          column: 13
        },
        end: {
          line: 24,
          column: 51
        }
      },
      "13": {
        start: {
          line: 25,
          column: 4
        },
        end: {
          line: 25,
          column: 24
        }
      },
      "14": {
        start: {
          line: 30,
          column: 21
        },
        end: {
          line: 30,
          column: 69
        }
      },
      "15": {
        start: {
          line: 31,
          column: 4
        },
        end: {
          line: 31,
          column: 36
        }
      },
      "16": {
        start: {
          line: 35,
          column: 23
        },
        end: {
          line: 35,
          column: 30
        }
      },
      "17": {
        start: {
          line: 36,
          column: 4
        },
        end: {
          line: 39,
          column: 7
        }
      },
      "18": {
        start: {
          line: 37,
          column: 8
        },
        end: {
          line: 37,
          column: 56
        }
      },
      "19": {
        start: {
          line: 37,
          column: 17
        },
        end: {
          line: 37,
          column: 56
        }
      },
      "20": {
        start: {
          line: 38,
          column: 8
        },
        end: {
          line: 38,
          column: 28
        }
      },
      "21": {
        start: {
          line: 43,
          column: 21
        },
        end: {
          line: 43,
          column: 61
        }
      },
      "22": {
        start: {
          line: 44,
          column: 4
        },
        end: {
          line: 44,
          column: 36
        }
      },
      "23": {
        start: {
          line: 47,
          column: 23
        },
        end: {
          line: 47,
          column: 30
        }
      },
      "24": {
        start: {
          line: 48,
          column: 4
        },
        end: {
          line: 51,
          column: 7
        }
      },
      "25": {
        start: {
          line: 49,
          column: 8
        },
        end: {
          line: 49,
          column: 49
        }
      },
      "26": {
        start: {
          line: 49,
          column: 17
        },
        end: {
          line: 49,
          column: 49
        }
      },
      "27": {
        start: {
          line: 50,
          column: 8
        },
        end: {
          line: 50,
          column: 28
        }
      },
      "28": {
        start: {
          line: 56,
          column: 21
        },
        end: {
          line: 56,
          column: 59
        }
      },
      "29": {
        start: {
          line: 57,
          column: 4
        },
        end: {
          line: 57,
          column: 46
        }
      },
      "30": {
        start: {
          line: 61,
          column: 23
        },
        end: {
          line: 61,
          column: 30
        }
      },
      "31": {
        start: {
          line: 62,
          column: 23
        },
        end: {
          line: 62,
          column: 30
        }
      },
      "32": {
        start: {
          line: 63,
          column: 4
        },
        end: {
          line: 65,
          column: 7
        }
      },
      "33": {
        start: {
          line: 64,
          column: 8
        },
        end: {
          line: 64,
          column: 28
        }
      },
      "34": {
        start: {
          line: 69,
          column: 19
        },
        end: {
          line: 69,
          column: 54
        }
      },
      "35": {
        start: {
          line: 70,
          column: 2
        },
        end: {
          line: 70,
          column: 30
        }
      },
      "36": {
        start: {
          line: 74,
          column: 16
        },
        end: {
          line: 74,
          column: 27
        }
      },
      "37": {
        start: {
          line: 75,
          column: 2
        },
        end: {
          line: 75,
          column: 47
        }
      },
      "38": {
        start: {
          line: 76,
          column: 2
        },
        end: {
          line: 82,
          column: 5
        }
      },
      "39": {
        start: {
          line: 77,
          column: 4
        },
        end: {
          line: 80,
          column: 5
        }
      },
      "40": {
        start: {
          line: 78,
          column: 6
        },
        end: {
          line: 79,
          column: 22
        }
      },
      "41": {
        start: {
          line: 81,
          column: 4
        },
        end: {
          line: 81,
          column: 24
        }
      },
      "42": {
        start: {
          line: 86,
          column: 21
        },
        end: {
          line: 86,
          column: 54
        }
      },
      "43": {
        start: {
          line: 87,
          column: 4
        },
        end: {
          line: 87,
          column: 37
        }
      },
      "44": {
        start: {
          line: 91,
          column: 24
        },
        end: {
          line: 91,
          column: 31
        }
      },
      "45": {
        start: {
          line: 92,
          column: 4
        },
        end: {
          line: 94,
          column: 7
        }
      },
      "46": {
        start: {
          line: 93,
          column: 8
        },
        end: {
          line: 93,
          column: 28
        }
      },
      "47": {
        start: {
          line: 98,
          column: 21
        },
        end: {
          line: 98,
          column: 55
        }
      },
      "48": {
        start: {
          line: 99,
          column: 4
        },
        end: {
          line: 99,
          column: 50
        }
      },
      "49": {
        start: {
          line: 103,
          column: 20
        },
        end: {
          line: 103,
          column: 33
        }
      },
      "50": {
        start: {
          line: 104,
          column: 21
        },
        end: {
          line: 104,
          column: 26
        }
      },
      "51": {
        start: {
          line: 105,
          column: 24
        },
        end: {
          line: 105,
          column: 31
        }
      },
      "52": {
        start: {
          line: 106,
          column: 4
        },
        end: {
          line: 114,
          column: 5
        }
      },
      "53": {
        start: {
          line: 107,
          column: 8
        },
        end: {
          line: 109,
          column: 11
        }
      },
      "54": {
        start: {
          line: 108,
          column: 12
        },
        end: {
          line: 108,
          column: 32
        }
      },
      "55": {
        start: {
          line: 111,
          column: 8
        },
        end: {
          line: 113,
          column: 11
        }
      },
      "56": {
        start: {
          line: 112,
          column: 12
        },
        end: {
          line: 112,
          column: 32
        }
      },
      "57": {
        start: {
          line: 118,
          column: 21
        },
        end: {
          line: 118,
          column: 62
        }
      },
      "58": {
        start: {
          line: 119,
          column: 19
        },
        end: {
          line: 119,
          column: 24
        }
      },
      "59": {
        start: {
          line: 120,
          column: 4
        },
        end: {
          line: 120,
          column: 47
        }
      },
      "60": {
        start: {
          line: 120,
          column: 31
        },
        end: {
          line: 120,
          column: 47
        }
      },
      "61": {
        start: {
          line: 121,
          column: 4
        },
        end: {
          line: 121,
          column: 38
        }
      },
      "62": {
        start: {
          line: 125,
          column: 19
        },
        end: {
          line: 125,
          column: 24
        }
      },
      "63": {
        start: {
          line: 126,
          column: 4
        },
        end: {
          line: 131,
          column: 7
        }
      },
      "64": {
        start: {
          line: 126,
          column: 26
        },
        end: {
          line: 128,
          column: 7
        }
      },
      "65": {
        start: {
          line: 127,
          column: 8
        },
        end: {
          line: 127,
          column: 28
        }
      },
      "66": {
        start: {
          line: 129,
          column: 9
        },
        end: {
          line: 131,
          column: 7
        }
      },
      "67": {
        start: {
          line: 130,
          column: 8
        },
        end: {
          line: 130,
          column: 28
        }
      },
      "68": {
        start: {
          line: 135,
          column: 21
        },
        end: {
          line: 135,
          column: 62
        }
      },
      "69": {
        start: {
          line: 136,
          column: 4
        },
        end: {
          line: 136,
          column: 34
        }
      },
      "70": {
        start: {
          line: 140,
          column: 4
        },
        end: {
          line: 140,
          column: 48
        }
      },
      "71": {
        start: {
          line: 141,
          column: 4
        },
        end: {
          line: 144,
          column: 7
        }
      },
      "72": {
        start: {
          line: 142,
          column: 8
        },
        end: {
          line: 142,
          column: 58
        }
      },
      "73": {
        start: {
          line: 142,
          column: 17
        },
        end: {
          line: 142,
          column: 58
        }
      },
      "74": {
        start: {
          line: 143,
          column: 8
        },
        end: {
          line: 143,
          column: 28
        }
      },
      "75": {
        start: {
          line: 148,
          column: 21
        },
        end: {
          line: 148,
          column: 65
        }
      },
      "76": {
        start: {
          line: 149,
          column: 4
        },
        end: {
          line: 149,
          column: 34
        }
      },
      "77": {
        start: {
          line: 153,
          column: 4
        },
        end: {
          line: 153,
          column: 54
        }
      },
      "78": {
        start: {
          line: 154,
          column: 4
        },
        end: {
          line: 157,
          column: 7
        }
      },
      "79": {
        start: {
          line: 155,
          column: 8
        },
        end: {
          line: 155,
          column: 61
        }
      },
      "80": {
        start: {
          line: 155,
          column: 17
        },
        end: {
          line: 155,
          column: 61
        }
      },
      "81": {
        start: {
          line: 156,
          column: 8
        },
        end: {
          line: 156,
          column: 28
        }
      },
      "82": {
        start: {
          line: 160,
          column: 21
        },
        end: {
          line: 160,
          column: 58
        }
      },
      "83": {
        start: {
          line: 161,
          column: 4
        },
        end: {
          line: 161,
          column: 28
        }
      },
      "84": {
        start: {
          line: 165,
          column: 4
        },
        end: {
          line: 168,
          column: 7
        }
      },
      "85": {
        start: {
          line: 166,
          column: 8
        },
        end: {
          line: 166,
          column: 56
        }
      },
      "86": {
        start: {
          line: 166,
          column: 18
        },
        end: {
          line: 166,
          column: 55
        }
      },
      "87": {
        start: {
          line: 167,
          column: 8
        },
        end: {
          line: 167,
          column: 28
        }
      },
      "88": {
        start: {
          line: 172,
          column: 23
        },
        end: {
          line: 172,
          column: 30
        }
      },
      "89": {
        start: {
          line: 173,
          column: 18
        },
        end: {
          line: 173,
          column: 20
        }
      },
      "90": {
        start: {
          line: 175,
          column: 4
        },
        end: {
          line: 175,
          column: 76
        }
      },
      "91": {
        start: {
          line: 175,
          column: 34
        },
        end: {
          line: 175,
          column: 76
        }
      },
      "92": {
        start: {
          line: 176,
          column: 4
        },
        end: {
          line: 176,
          column: 57
        }
      },
      "93": {
        start: {
          line: 176,
          column: 34
        },
        end: {
          line: 176,
          column: 57
        }
      },
      "94": {
        start: {
          line: 177,
          column: 2
        },
        end: {
          line: 177,
          column: 17
        }
      }
    },
    fnMap: {
      "0": {
        name: "getWif",
        decl: {
          start: {
            line: 8,
            column: 16
          },
          end: {
            line: 8,
            column: 22
          }
        },
        loc: {
          start: {
            line: 8,
            column: 40
          },
          end: {
            line: 19,
            column: 1
          }
        },
        line: 8
      },
      "1": {
        name: "doichain_dumpprivkey",
        decl: {
          start: {
            line: 21,
            column: 9
          },
          end: {
            line: 21,
            column: 29
          }
        },
        loc: {
          start: {
            line: 21,
            column: 57
          },
          end: {
            line: 27,
            column: 1
          }
        },
        line: 21
      },
      "2": {
        name: "(anonymous_2)",
        decl: {
          start: {
            line: 23,
            column: 40
          },
          end: {
            line: 23,
            column: 41
          }
        },
        loc: {
          start: {
            line: 23,
            column: 60
          },
          end: {
            line: 26,
            column: 3
          }
        },
        line: 23
      },
      "3": {
        name: "getAddressesByAccount",
        decl: {
          start: {
            line: 29,
            column: 16
          },
          end: {
            line: 29,
            column: 37
          }
        },
        loc: {
          start: {
            line: 29,
            column: 54
          },
          end: {
            line: 32,
            column: 1
          }
        },
        line: 29
      },
      "4": {
        name: "doichain_getaddressesbyaccount",
        decl: {
          start: {
            line: 34,
            column: 9
          },
          end: {
            line: 34,
            column: 39
          }
        },
        loc: {
          start: {
            line: 34,
            column: 67
          },
          end: {
            line: 40,
            column: 1
          }
        },
        line: 34
      },
      "5": {
        name: "(anonymous_5)",
        decl: {
          start: {
            line: 36,
            column: 52
          },
          end: {
            line: 36,
            column: 53
          }
        },
        loc: {
          start: {
            line: 36,
            column: 72
          },
          end: {
            line: 39,
            column: 5
          }
        },
        line: 36
      },
      "6": {
        name: "getNewAddress",
        decl: {
          start: {
            line: 42,
            column: 16
          },
          end: {
            line: 42,
            column: 29
          }
        },
        loc: {
          start: {
            line: 42,
            column: 46
          },
          end: {
            line: 45,
            column: 1
          }
        },
        line: 42
      },
      "7": {
        name: "doichain_getnewaddress",
        decl: {
          start: {
            line: 46,
            column: 9
          },
          end: {
            line: 46,
            column: 31
          }
        },
        loc: {
          start: {
            line: 46,
            column: 59
          },
          end: {
            line: 52,
            column: 1
          }
        },
        line: 46
      },
      "8": {
        name: "(anonymous_8)",
        decl: {
          start: {
            line: 48,
            column: 45
          },
          end: {
            line: 48,
            column: 46
          }
        },
        loc: {
          start: {
            line: 48,
            column: 65
          },
          end: {
            line: 51,
            column: 5
          }
        },
        line: 48
      },
      "9": {
        name: "signMessage",
        decl: {
          start: {
            line: 55,
            column: 16
          },
          end: {
            line: 55,
            column: 27
          }
        },
        loc: {
          start: {
            line: 55,
            column: 54
          },
          end: {
            line: 58,
            column: 1
          }
        },
        line: 55
      },
      "10": {
        name: "doichain_signMessage",
        decl: {
          start: {
            line: 60,
            column: 9
          },
          end: {
            line: 60,
            column: 29
          }
        },
        loc: {
          start: {
            line: 60,
            column: 66
          },
          end: {
            line: 66,
            column: 1
          }
        },
        line: 60
      },
      "11": {
        name: "(anonymous_11)",
        decl: {
          start: {
            line: 63,
            column: 54
          },
          end: {
            line: 63,
            column: 55
          }
        },
        loc: {
          start: {
            line: 63,
            column: 74
          },
          end: {
            line: 65,
            column: 5
          }
        },
        line: 63
      },
      "12": {
        name: "nameShow",
        decl: {
          start: {
            line: 68,
            column: 16
          },
          end: {
            line: 68,
            column: 24
          }
        },
        loc: {
          start: {
            line: 68,
            column: 37
          },
          end: {
            line: 71,
            column: 1
          }
        },
        line: 68
      },
      "13": {
        name: "doichain_nameShow",
        decl: {
          start: {
            line: 73,
            column: 9
          },
          end: {
            line: 73,
            column: 26
          }
        },
        loc: {
          start: {
            line: 73,
            column: 49
          },
          end: {
            line: 83,
            column: 1
          }
        },
        line: 73
      },
      "14": {
        name: "(anonymous_14)",
        decl: {
          start: {
            line: 76,
            column: 33
          },
          end: {
            line: 76,
            column: 34
          }
        },
        loc: {
          start: {
            line: 76,
            column: 53
          },
          end: {
            line: 82,
            column: 3
          }
        },
        line: 76
      },
      "15": {
        name: "feeDoi",
        decl: {
          start: {
            line: 85,
            column: 16
          },
          end: {
            line: 85,
            column: 22
          }
        },
        loc: {
          start: {
            line: 85,
            column: 40
          },
          end: {
            line: 88,
            column: 1
          }
        },
        line: 85
      },
      "16": {
        name: "doichain_feeDoi",
        decl: {
          start: {
            line: 90,
            column: 9
          },
          end: {
            line: 90,
            column: 24
          }
        },
        loc: {
          start: {
            line: 90,
            column: 52
          },
          end: {
            line: 95,
            column: 1
          }
        },
        line: 90
      },
      "17": {
        name: "(anonymous_17)",
        decl: {
          start: {
            line: 92,
            column: 53
          },
          end: {
            line: 92,
            column: 54
          }
        },
        loc: {
          start: {
            line: 92,
            column: 73
          },
          end: {
            line: 94,
            column: 5
          }
        },
        line: 92
      },
      "18": {
        name: "nameDoi",
        decl: {
          start: {
            line: 97,
            column: 16
          },
          end: {
            line: 97,
            column: 23
          }
        },
        loc: {
          start: {
            line: 97,
            column: 54
          },
          end: {
            line: 100,
            column: 1
          }
        },
        line: 97
      },
      "19": {
        name: "doichain_nameDoi",
        decl: {
          start: {
            line: 102,
            column: 9
          },
          end: {
            line: 102,
            column: 25
          }
        },
        loc: {
          start: {
            line: 102,
            column: 66
          },
          end: {
            line: 115,
            column: 1
          }
        },
        line: 102
      },
      "20": {
        name: "(anonymous_20)",
        decl: {
          start: {
            line: 107,
            column: 50
          },
          end: {
            line: 107,
            column: 51
          }
        },
        loc: {
          start: {
            line: 107,
            column: 71
          },
          end: {
            line: 109,
            column: 9
          }
        },
        line: 107
      },
      "21": {
        name: "(anonymous_21)",
        decl: {
          start: {
            line: 111,
            column: 63
          },
          end: {
            line: 111,
            column: 64
          }
        },
        loc: {
          start: {
            line: 111,
            column: 83
          },
          end: {
            line: 113,
            column: 9
          }
        },
        line: 111
      },
      "22": {
        name: "listSinceBlock",
        decl: {
          start: {
            line: 117,
            column: 16
          },
          end: {
            line: 117,
            column: 30
          }
        },
        loc: {
          start: {
            line: 117,
            column: 46
          },
          end: {
            line: 122,
            column: 1
          }
        },
        line: 117
      },
      "23": {
        name: "doichain_listSinceBlock",
        decl: {
          start: {
            line: 124,
            column: 9
          },
          end: {
            line: 124,
            column: 32
          }
        },
        loc: {
          start: {
            line: 124,
            column: 58
          },
          end: {
            line: 132,
            column: 1
          }
        },
        line: 124
      },
      "24": {
        name: "(anonymous_24)",
        decl: {
          start: {
            line: 126,
            column: 55
          },
          end: {
            line: 126,
            column: 56
          }
        },
        loc: {
          start: {
            line: 126,
            column: 75
          },
          end: {
            line: 128,
            column: 5
          }
        },
        line: 126
      },
      "25": {
        name: "(anonymous_25)",
        decl: {
          start: {
            line: 129,
            column: 48
          },
          end: {
            line: 129,
            column: 49
          }
        },
        loc: {
          start: {
            line: 129,
            column: 68
          },
          end: {
            line: 131,
            column: 5
          }
        },
        line: 129
      },
      "26": {
        name: "getTransaction",
        decl: {
          start: {
            line: 134,
            column: 16
          },
          end: {
            line: 134,
            column: 30
          }
        },
        loc: {
          start: {
            line: 134,
            column: 45
          },
          end: {
            line: 137,
            column: 1
          }
        },
        line: 134
      },
      "27": {
        name: "doichain_gettransaction",
        decl: {
          start: {
            line: 139,
            column: 9
          },
          end: {
            line: 139,
            column: 32
          }
        },
        loc: {
          start: {
            line: 139,
            column: 57
          },
          end: {
            line: 145,
            column: 1
          }
        },
        line: 139
      },
      "28": {
        name: "(anonymous_28)",
        decl: {
          start: {
            line: 141,
            column: 39
          },
          end: {
            line: 141,
            column: 40
          }
        },
        loc: {
          start: {
            line: 141,
            column: 59
          },
          end: {
            line: 144,
            column: 5
          }
        },
        line: 141
      },
      "29": {
        name: "getRawTransaction",
        decl: {
          start: {
            line: 147,
            column: 16
          },
          end: {
            line: 147,
            column: 33
          }
        },
        loc: {
          start: {
            line: 147,
            column: 48
          },
          end: {
            line: 150,
            column: 1
          }
        },
        line: 147
      },
      "30": {
        name: "doichain_getrawtransaction",
        decl: {
          start: {
            line: 152,
            column: 9
          },
          end: {
            line: 152,
            column: 35
          }
        },
        loc: {
          start: {
            line: 152,
            column: 60
          },
          end: {
            line: 158,
            column: 1
          }
        },
        line: 152
      },
      "31": {
        name: "(anonymous_31)",
        decl: {
          start: {
            line: 154,
            column: 45
          },
          end: {
            line: 154,
            column: 46
          }
        },
        loc: {
          start: {
            line: 154,
            column: 65
          },
          end: {
            line: 157,
            column: 5
          }
        },
        line: 154
      },
      "32": {
        name: "getBalance",
        decl: {
          start: {
            line: 159,
            column: 16
          },
          end: {
            line: 159,
            column: 26
          }
        },
        loc: {
          start: {
            line: 159,
            column: 35
          },
          end: {
            line: 162,
            column: 1
          }
        },
        line: 159
      },
      "33": {
        name: "doichain_getbalance",
        decl: {
          start: {
            line: 164,
            column: 9
          },
          end: {
            line: 164,
            column: 28
          }
        },
        loc: {
          start: {
            line: 164,
            column: 47
          },
          end: {
            line: 169,
            column: 1
          }
        },
        line: 164
      },
      "34": {
        name: "(anonymous_34)",
        decl: {
          start: {
            line: 165,
            column: 29
          },
          end: {
            line: 165,
            column: 30
          }
        },
        loc: {
          start: {
            line: 165,
            column: 49
          },
          end: {
            line: 168,
            column: 5
          }
        },
        line: 165
      },
      "35": {
        name: "checkId",
        decl: {
          start: {
            line: 171,
            column: 9
          },
          end: {
            line: 171,
            column: 16
          }
        },
        loc: {
          start: {
            line: 171,
            column: 21
          },
          end: {
            line: 178,
            column: 1
          }
        },
        line: 171
      }
    },
    branchMap: {
      "0": {
        loc: {
          start: {
            line: 9,
            column: 2
          },
          end: {
            line: 12,
            column: 3
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 9,
            column: 2
          },
          end: {
            line: 12,
            column: 3
          }
        }, {
          start: {
            line: 9,
            column: 2
          },
          end: {
            line: 12,
            column: 3
          }
        }],
        line: 9
      },
      "1": {
        loc: {
          start: {
            line: 13,
            column: 2
          },
          end: {
            line: 16,
            column: 3
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 13,
            column: 2
          },
          end: {
            line: 16,
            column: 3
          }
        }, {
          start: {
            line: 13,
            column: 2
          },
          end: {
            line: 16,
            column: 3
          }
        }],
        line: 13
      },
      "2": {
        loc: {
          start: {
            line: 24,
            column: 4
          },
          end: {
            line: 24,
            column: 51
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 24,
            column: 4
          },
          end: {
            line: 24,
            column: 51
          }
        }, {
          start: {
            line: 24,
            column: 4
          },
          end: {
            line: 24,
            column: 51
          }
        }],
        line: 24
      },
      "3": {
        loc: {
          start: {
            line: 37,
            column: 8
          },
          end: {
            line: 37,
            column: 56
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 37,
            column: 8
          },
          end: {
            line: 37,
            column: 56
          }
        }, {
          start: {
            line: 37,
            column: 8
          },
          end: {
            line: 37,
            column: 56
          }
        }],
        line: 37
      },
      "4": {
        loc: {
          start: {
            line: 49,
            column: 8
          },
          end: {
            line: 49,
            column: 49
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 49,
            column: 8
          },
          end: {
            line: 49,
            column: 49
          }
        }, {
          start: {
            line: 49,
            column: 8
          },
          end: {
            line: 49,
            column: 49
          }
        }],
        line: 49
      },
      "5": {
        loc: {
          start: {
            line: 77,
            column: 4
          },
          end: {
            line: 80,
            column: 5
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 77,
            column: 4
          },
          end: {
            line: 80,
            column: 5
          }
        }, {
          start: {
            line: 77,
            column: 4
          },
          end: {
            line: 80,
            column: 5
          }
        }],
        line: 77
      },
      "6": {
        loc: {
          start: {
            line: 77,
            column: 7
          },
          end: {
            line: 77,
            column: 84
          }
        },
        type: "binary-expr",
        locations: [{
          start: {
            line: 77,
            column: 7
          },
          end: {
            line: 77,
            column: 24
          }
        }, {
          start: {
            line: 77,
            column: 28
          },
          end: {
            line: 77,
            column: 40
          }
        }, {
          start: {
            line: 77,
            column: 44
          },
          end: {
            line: 77,
            column: 84
          }
        }],
        line: 77
      },
      "7": {
        loc: {
          start: {
            line: 106,
            column: 4
          },
          end: {
            line: 114,
            column: 5
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 106,
            column: 4
          },
          end: {
            line: 114,
            column: 5
          }
        }, {
          start: {
            line: 106,
            column: 4
          },
          end: {
            line: 114,
            column: 5
          }
        }],
        line: 106
      },
      "8": {
        loc: {
          start: {
            line: 120,
            column: 4
          },
          end: {
            line: 120,
            column: 47
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 120,
            column: 4
          },
          end: {
            line: 120,
            column: 47
          }
        }, {
          start: {
            line: 120,
            column: 4
          },
          end: {
            line: 120,
            column: 47
          }
        }],
        line: 120
      },
      "9": {
        loc: {
          start: {
            line: 126,
            column: 4
          },
          end: {
            line: 131,
            column: 7
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 126,
            column: 4
          },
          end: {
            line: 131,
            column: 7
          }
        }, {
          start: {
            line: 126,
            column: 4
          },
          end: {
            line: 131,
            column: 7
          }
        }],
        line: 126
      },
      "10": {
        loc: {
          start: {
            line: 142,
            column: 8
          },
          end: {
            line: 142,
            column: 58
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 142,
            column: 8
          },
          end: {
            line: 142,
            column: 58
          }
        }, {
          start: {
            line: 142,
            column: 8
          },
          end: {
            line: 142,
            column: 58
          }
        }],
        line: 142
      },
      "11": {
        loc: {
          start: {
            line: 155,
            column: 8
          },
          end: {
            line: 155,
            column: 61
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 155,
            column: 8
          },
          end: {
            line: 155,
            column: 61
          }
        }, {
          start: {
            line: 155,
            column: 8
          },
          end: {
            line: 155,
            column: 61
          }
        }],
        line: 155
      },
      "12": {
        loc: {
          start: {
            line: 166,
            column: 8
          },
          end: {
            line: 166,
            column: 56
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 166,
            column: 8
          },
          end: {
            line: 166,
            column: 56
          }
        }, {
          start: {
            line: 166,
            column: 8
          },
          end: {
            line: 166,
            column: 56
          }
        }],
        line: 166
      },
      "13": {
        loc: {
          start: {
            line: 175,
            column: 4
          },
          end: {
            line: 175,
            column: 76
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 175,
            column: 4
          },
          end: {
            line: 175,
            column: 76
          }
        }, {
          start: {
            line: 175,
            column: 4
          },
          end: {
            line: 175,
            column: 76
          }
        }],
        line: 175
      },
      "14": {
        loc: {
          start: {
            line: 176,
            column: 4
          },
          end: {
            line: 176,
            column: 57
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 176,
            column: 4
          },
          end: {
            line: 176,
            column: 57
          }
        }, {
          start: {
            line: 176,
            column: 4
          },
          end: {
            line: 176,
            column: 57
          }
        }],
        line: 176
      }
    },
    s: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0,
      "7": 0,
      "8": 0,
      "9": 0,
      "10": 0,
      "11": 0,
      "12": 0,
      "13": 0,
      "14": 0,
      "15": 0,
      "16": 0,
      "17": 0,
      "18": 0,
      "19": 0,
      "20": 0,
      "21": 0,
      "22": 0,
      "23": 0,
      "24": 0,
      "25": 0,
      "26": 0,
      "27": 0,
      "28": 0,
      "29": 0,
      "30": 0,
      "31": 0,
      "32": 0,
      "33": 0,
      "34": 0,
      "35": 0,
      "36": 0,
      "37": 0,
      "38": 0,
      "39": 0,
      "40": 0,
      "41": 0,
      "42": 0,
      "43": 0,
      "44": 0,
      "45": 0,
      "46": 0,
      "47": 0,
      "48": 0,
      "49": 0,
      "50": 0,
      "51": 0,
      "52": 0,
      "53": 0,
      "54": 0,
      "55": 0,
      "56": 0,
      "57": 0,
      "58": 0,
      "59": 0,
      "60": 0,
      "61": 0,
      "62": 0,
      "63": 0,
      "64": 0,
      "65": 0,
      "66": 0,
      "67": 0,
      "68": 0,
      "69": 0,
      "70": 0,
      "71": 0,
      "72": 0,
      "73": 0,
      "74": 0,
      "75": 0,
      "76": 0,
      "77": 0,
      "78": 0,
      "79": 0,
      "80": 0,
      "81": 0,
      "82": 0,
      "83": 0,
      "84": 0,
      "85": 0,
      "86": 0,
      "87": 0,
      "88": 0,
      "89": 0,
      "90": 0,
      "91": 0,
      "92": 0,
      "93": 0,
      "94": 0
    },
    f: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0,
      "7": 0,
      "8": 0,
      "9": 0,
      "10": 0,
      "11": 0,
      "12": 0,
      "13": 0,
      "14": 0,
      "15": 0,
      "16": 0,
      "17": 0,
      "18": 0,
      "19": 0,
      "20": 0,
      "21": 0,
      "22": 0,
      "23": 0,
      "24": 0,
      "25": 0,
      "26": 0,
      "27": 0,
      "28": 0,
      "29": 0,
      "30": 0,
      "31": 0,
      "32": 0,
      "33": 0,
      "34": 0,
      "35": 0
    },
    b: {
      "0": [0, 0],
      "1": [0, 0],
      "2": [0, 0],
      "3": [0, 0],
      "4": [0, 0],
      "5": [0, 0],
      "6": [0, 0, 0],
      "7": [0, 0],
      "8": [0, 0],
      "9": [0, 0],
      "10": [0, 0],
      "11": [0, 0],
      "12": [0, 0],
      "13": [0, 0],
      "14": [0, 0]
    },
    _coverageSchema: "43e27e138ebf9cfc5966b082cf9a028302ed4184"
  },
      coverage = global[gcv] || (global[gcv] = {});

  if (coverage[path] && coverage[path].hash === hash) {
    return coverage[path];
  }

  coverageData.hash = hash;
  return coverage[path] = coverageData;
}();

const NAMESPACE = (cov_2jdew3tnda.s[0]++, 'e/');

function getWif(client, address) {
  cov_2jdew3tnda.f[0]++;
  cov_2jdew3tnda.s[1]++;

  if (!address) {
    cov_2jdew3tnda.b[0][0]++;
    cov_2jdew3tnda.s[2]++;
    address = getAddressesByAccount("")[0];
    cov_2jdew3tnda.s[3]++;
    logBlockchain('address was not defined so getting the first existing one of the wallet:', address);
  } else {
    cov_2jdew3tnda.b[0][1]++;
  }

  cov_2jdew3tnda.s[4]++;

  if (!address) {
    cov_2jdew3tnda.b[1][0]++;
    cov_2jdew3tnda.s[5]++;
    address = getNewAddress("");
    cov_2jdew3tnda.s[6]++;
    logBlockchain('address was never defined  at all generated new address for this wallet:', address);
  } else {
    cov_2jdew3tnda.b[1][1]++;
  }

  const syncFunc = (cov_2jdew3tnda.s[7]++, Meteor.wrapAsync(doichain_dumpprivkey));
  cov_2jdew3tnda.s[8]++;
  return syncFunc(client, address);
}

function doichain_dumpprivkey(client, address, callback) {
  cov_2jdew3tnda.f[1]++;
  const ourAddress = (cov_2jdew3tnda.s[9]++, address);
  cov_2jdew3tnda.s[10]++;
  client.cmd('dumpprivkey', ourAddress, function (err, data) {
    cov_2jdew3tnda.f[2]++;
    cov_2jdew3tnda.s[11]++;

    if (err) {
      cov_2jdew3tnda.b[2][0]++;
      cov_2jdew3tnda.s[12]++;
      logError('doichain_dumpprivkey:', err);
    } else {
      cov_2jdew3tnda.b[2][1]++;
    }

    cov_2jdew3tnda.s[13]++;
    callback(err, data);
  });
}

function getAddressesByAccount(client, accout) {
  cov_2jdew3tnda.f[3]++;
  const syncFunc = (cov_2jdew3tnda.s[14]++, Meteor.wrapAsync(doichain_getaddressesbyaccount));
  cov_2jdew3tnda.s[15]++;
  return syncFunc(client, accout);
}

function doichain_getaddressesbyaccount(client, account, callback) {
  cov_2jdew3tnda.f[4]++;
  const ourAccount = (cov_2jdew3tnda.s[16]++, account);
  cov_2jdew3tnda.s[17]++;
  client.cmd('getaddressesbyaccount', ourAccount, function (err, data) {
    cov_2jdew3tnda.f[5]++;
    cov_2jdew3tnda.s[18]++;

    if (err) {
      cov_2jdew3tnda.b[3][0]++;
      cov_2jdew3tnda.s[19]++;
      logError('getaddressesbyaccount:', err);
    } else {
      cov_2jdew3tnda.b[3][1]++;
    }

    cov_2jdew3tnda.s[20]++;
    callback(err, data);
  });
}

function getNewAddress(client, accout) {
  cov_2jdew3tnda.f[6]++;
  const syncFunc = (cov_2jdew3tnda.s[21]++, Meteor.wrapAsync(doichain_getnewaddress));
  cov_2jdew3tnda.s[22]++;
  return syncFunc(client, accout);
}

function doichain_getnewaddress(client, account, callback) {
  cov_2jdew3tnda.f[7]++;
  const ourAccount = (cov_2jdew3tnda.s[23]++, account);
  cov_2jdew3tnda.s[24]++;
  client.cmd('getnewaddresss', ourAccount, function (err, data) {
    cov_2jdew3tnda.f[8]++;
    cov_2jdew3tnda.s[25]++;

    if (err) {
      cov_2jdew3tnda.b[4][0]++;
      cov_2jdew3tnda.s[26]++;
      logError('getnewaddresss:', err);
    } else {
      cov_2jdew3tnda.b[4][1]++;
    }

    cov_2jdew3tnda.s[27]++;
    callback(err, data);
  });
}

function signMessage(client, address, message) {
  cov_2jdew3tnda.f[9]++;
  const syncFunc = (cov_2jdew3tnda.s[28]++, Meteor.wrapAsync(doichain_signMessage));
  cov_2jdew3tnda.s[29]++;
  return syncFunc(client, address, message);
}

function doichain_signMessage(client, address, message, callback) {
  cov_2jdew3tnda.f[10]++;
  const ourAddress = (cov_2jdew3tnda.s[30]++, address);
  const ourMessage = (cov_2jdew3tnda.s[31]++, message);
  cov_2jdew3tnda.s[32]++;
  client.cmd('signmessage', ourAddress, ourMessage, function (err, data) {
    cov_2jdew3tnda.f[11]++;
    cov_2jdew3tnda.s[33]++;
    callback(err, data);
  });
}

function nameShow(client, id) {
  cov_2jdew3tnda.f[12]++;
  const syncFunc = (cov_2jdew3tnda.s[34]++, Meteor.wrapAsync(doichain_nameShow));
  cov_2jdew3tnda.s[35]++;
  return syncFunc(client, id);
}

function doichain_nameShow(client, id, callback) {
  cov_2jdew3tnda.f[13]++;
  const ourId = (cov_2jdew3tnda.s[36]++, checkId(id));
  cov_2jdew3tnda.s[37]++;
  logConfirm('doichain-cli name_show :', ourId);
  cov_2jdew3tnda.s[38]++;
  client.cmd('name_show', ourId, function (err, data) {
    cov_2jdew3tnda.f[14]++;
    cov_2jdew3tnda.s[39]++;

    if ((cov_2jdew3tnda.b[6][0]++, err !== undefined) && (cov_2jdew3tnda.b[6][1]++, err !== null) && (cov_2jdew3tnda.b[6][2]++, err.message.startsWith("name not found"))) {
      cov_2jdew3tnda.b[5][0]++;
      cov_2jdew3tnda.s[40]++;
      err = undefined, data = undefined;
    } else {
      cov_2jdew3tnda.b[5][1]++;
    }

    cov_2jdew3tnda.s[41]++;
    callback(err, data);
  });
}

function feeDoi(client, address) {
  cov_2jdew3tnda.f[15]++;
  const syncFunc = (cov_2jdew3tnda.s[42]++, Meteor.wrapAsync(doichain_feeDoi));
  cov_2jdew3tnda.s[43]++;
  return syncFunc(client, address);
}

function doichain_feeDoi(client, address, callback) {
  cov_2jdew3tnda.f[16]++;
  const destAddress = (cov_2jdew3tnda.s[44]++, address);
  cov_2jdew3tnda.s[45]++;
  client.cmd('sendtoaddress', destAddress, '0.02', function (err, data) {
    cov_2jdew3tnda.f[17]++;
    cov_2jdew3tnda.s[46]++;
    callback(err, data);
  });
}

function nameDoi(client, name, value, address) {
  cov_2jdew3tnda.f[18]++;
  const syncFunc = (cov_2jdew3tnda.s[47]++, Meteor.wrapAsync(doichain_nameDoi));
  cov_2jdew3tnda.s[48]++;
  return syncFunc(client, name, value, address);
}

function doichain_nameDoi(client, name, value, address, callback) {
  cov_2jdew3tnda.f[19]++;
  const ourName = (cov_2jdew3tnda.s[49]++, checkId(name));
  const ourValue = (cov_2jdew3tnda.s[50]++, value);
  const destAddress = (cov_2jdew3tnda.s[51]++, address);
  cov_2jdew3tnda.s[52]++;

  if (!address) {
    cov_2jdew3tnda.b[7][0]++;
    cov_2jdew3tnda.s[53]++;
    client.cmd('name_doi', ourName, ourValue, function (err, data) {
      cov_2jdew3tnda.f[20]++;
      cov_2jdew3tnda.s[54]++;
      callback(err, data);
    });
  } else {
    cov_2jdew3tnda.b[7][1]++;
    cov_2jdew3tnda.s[55]++;
    client.cmd('name_doi', ourName, ourValue, destAddress, function (err, data) {
      cov_2jdew3tnda.f[21]++;
      cov_2jdew3tnda.s[56]++;
      callback(err, data);
    });
  }
}

function listSinceBlock(client, block) {
  cov_2jdew3tnda.f[22]++;
  const syncFunc = (cov_2jdew3tnda.s[57]++, Meteor.wrapAsync(doichain_listSinceBlock));
  var ourBlock = (cov_2jdew3tnda.s[58]++, block);
  cov_2jdew3tnda.s[59]++;

  if (ourBlock === undefined) {
    cov_2jdew3tnda.b[8][0]++;
    cov_2jdew3tnda.s[60]++;
    ourBlock = null;
  } else {
    cov_2jdew3tnda.b[8][1]++;
  }

  cov_2jdew3tnda.s[61]++;
  return syncFunc(client, ourBlock);
}

function doichain_listSinceBlock(client, block, callback) {
  cov_2jdew3tnda.f[23]++;
  var ourBlock = (cov_2jdew3tnda.s[62]++, block);
  cov_2jdew3tnda.s[63]++;

  if (ourBlock === null) {
    cov_2jdew3tnda.b[9][0]++;
    cov_2jdew3tnda.s[64]++;
    client.cmd('listsinceblock', function (err, data) {
      cov_2jdew3tnda.f[24]++;
      cov_2jdew3tnda.s[65]++;
      callback(err, data);
    });
  } else {
    cov_2jdew3tnda.b[9][1]++;
    cov_2jdew3tnda.s[66]++;
    client.cmd('listsinceblock', ourBlock, function (err, data) {
      cov_2jdew3tnda.f[25]++;
      cov_2jdew3tnda.s[67]++;
      callback(err, data);
    });
  }
}

function getTransaction(client, txid) {
  cov_2jdew3tnda.f[26]++;
  const syncFunc = (cov_2jdew3tnda.s[68]++, Meteor.wrapAsync(doichain_gettransaction));
  cov_2jdew3tnda.s[69]++;
  return syncFunc(client, txid);
}

function doichain_gettransaction(client, txid, callback) {
  cov_2jdew3tnda.f[27]++;
  cov_2jdew3tnda.s[70]++;
  logConfirm('doichain_gettransaction:', txid);
  cov_2jdew3tnda.s[71]++;
  client.cmd('gettransaction', txid, function (err, data) {
    cov_2jdew3tnda.f[28]++;
    cov_2jdew3tnda.s[72]++;

    if (err) {
      cov_2jdew3tnda.b[10][0]++;
      cov_2jdew3tnda.s[73]++;
      logError('doichain_gettransaction:', err);
    } else {
      cov_2jdew3tnda.b[10][1]++;
    }

    cov_2jdew3tnda.s[74]++;
    callback(err, data);
  });
}

function getRawTransaction(client, txid) {
  cov_2jdew3tnda.f[29]++;
  const syncFunc = (cov_2jdew3tnda.s[75]++, Meteor.wrapAsync(doichain_getrawtransaction));
  cov_2jdew3tnda.s[76]++;
  return syncFunc(client, txid);
}

function doichain_getrawtransaction(client, txid, callback) {
  cov_2jdew3tnda.f[30]++;
  cov_2jdew3tnda.s[77]++;
  logBlockchain('doichain_getrawtransaction:', txid);
  cov_2jdew3tnda.s[78]++;
  client.cmd('getrawtransaction', txid, 1, function (err, data) {
    cov_2jdew3tnda.f[31]++;
    cov_2jdew3tnda.s[79]++;

    if (err) {
      cov_2jdew3tnda.b[11][0]++;
      cov_2jdew3tnda.s[80]++;
      logError('doichain_getrawtransaction:', err);
    } else {
      cov_2jdew3tnda.b[11][1]++;
    }

    cov_2jdew3tnda.s[81]++;
    callback(err, data);
  });
}

function getBalance(client) {
  cov_2jdew3tnda.f[32]++;
  const syncFunc = (cov_2jdew3tnda.s[82]++, Meteor.wrapAsync(doichain_getbalance));
  cov_2jdew3tnda.s[83]++;
  return syncFunc(client);
}

function doichain_getbalance(client, callback) {
  cov_2jdew3tnda.f[33]++;
  cov_2jdew3tnda.s[84]++;
  client.cmd('getbalance', function (err, data) {
    cov_2jdew3tnda.f[34]++;
    cov_2jdew3tnda.s[85]++;

    if (err) {
      cov_2jdew3tnda.b[12][0]++;
      cov_2jdew3tnda.s[86]++;
      logError('doichain_getbalance:', err);
    } else {
      cov_2jdew3tnda.b[12][1]++;
    }

    cov_2jdew3tnda.s[87]++;
    callback(err, data);
  });
}

function checkId(id) {
  cov_2jdew3tnda.f[35]++;
  const DOI_PREFIX = (cov_2jdew3tnda.s[88]++, "doi: ");
  let ret_val = (cov_2jdew3tnda.s[89]++, id); //default value

  cov_2jdew3tnda.s[90]++;

  if (id.startsWith(DOI_PREFIX)) {
    cov_2jdew3tnda.b[13][0]++;
    cov_2jdew3tnda.s[91]++;
    ret_val = id.substring(DOI_PREFIX.length);
  } else {
    cov_2jdew3tnda.b[13][1]++;
  } //in case it starts with doi: cut  this away


  cov_2jdew3tnda.s[92]++;

  if (!id.startsWith(NAMESPACE)) {
    cov_2jdew3tnda.b[14][0]++;
    cov_2jdew3tnda.s[93]++;
    ret_val = NAMESPACE + id;
  } else {
    cov_2jdew3tnda.b[14][1]++;
  } //in case it doesn't start with e/ put it in front now.


  cov_2jdew3tnda.s[94]++;
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

var cov_16kos3w7wy = function () {
  var path = "/home/doichain/dapp/server/api/http.js",
      hash = "042646a71cb68e5588a58199536c4ee868abc133",
      Function = function () {}.constructor,
      global = new Function('return this')(),
      gcv = "__coverage__",
      coverageData = {
    path: "/home/doichain/dapp/server/api/http.js",
    statementMap: {
      "0": {
        start: {
          line: 5,
          column: 19
        },
        end: {
          line: 5,
          column: 41
        }
      },
      "1": {
        start: {
          line: 6,
          column: 2
        },
        end: {
          line: 6,
          column: 30
        }
      },
      "2": {
        start: {
          line: 10,
          column: 21
        },
        end: {
          line: 10,
          column: 47
        }
      },
      "3": {
        start: {
          line: 11,
          column: 4
        },
        end: {
          line: 11,
          column: 31
        }
      },
      "4": {
        start: {
          line: 15,
          column: 21
        },
        end: {
          line: 15,
          column: 44
        }
      },
      "5": {
        start: {
          line: 16,
          column: 4
        },
        end: {
          line: 16,
          column: 31
        }
      },
      "6": {
        start: {
          line: 20,
          column: 21
        },
        end: {
          line: 20,
          column: 43
        }
      },
      "7": {
        start: {
          line: 21,
          column: 4
        },
        end: {
          line: 21,
          column: 31
        }
      },
      "8": {
        start: {
          line: 25,
          column: 17
        },
        end: {
          line: 25,
          column: 20
        }
      },
      "9": {
        start: {
          line: 26,
          column: 19
        },
        end: {
          line: 26,
          column: 24
        }
      },
      "10": {
        start: {
          line: 27,
          column: 2
        },
        end: {
          line: 29,
          column: 5
        }
      },
      "11": {
        start: {
          line: 28,
          column: 4
        },
        end: {
          line: 28,
          column: 23
        }
      },
      "12": {
        start: {
          line: 33,
          column: 19
        },
        end: {
          line: 33,
          column: 22
        }
      },
      "13": {
        start: {
          line: 34,
          column: 20
        },
        end: {
          line: 34,
          column: 24
        }
      },
      "14": {
        start: {
          line: 35,
          column: 4
        },
        end: {
          line: 37,
          column: 7
        }
      },
      "15": {
        start: {
          line: 36,
          column: 8
        },
        end: {
          line: 36,
          column: 27
        }
      },
      "16": {
        start: {
          line: 41,
          column: 19
        },
        end: {
          line: 41,
          column: 22
        }
      },
      "17": {
        start: {
          line: 42,
          column: 21
        },
        end: {
          line: 42,
          column: 25
        }
      },
      "18": {
        start: {
          line: 44,
          column: 4
        },
        end: {
          line: 46,
          column: 7
        }
      },
      "19": {
        start: {
          line: 45,
          column: 8
        },
        end: {
          line: 45,
          column: 27
        }
      },
      "20": {
        start: {
          line: 50,
          column: 19
        },
        end: {
          line: 50,
          column: 22
        }
      },
      "21": {
        start: {
          line: 51,
          column: 20
        },
        end: {
          line: 53,
          column: 5
        }
      },
      "22": {
        start: {
          line: 55,
          column: 4
        },
        end: {
          line: 57,
          column: 7
        }
      },
      "23": {
        start: {
          line: 56,
          column: 6
        },
        end: {
          line: 56,
          column: 25
        }
      }
    },
    fnMap: {
      "0": {
        name: "getHttpGET",
        decl: {
          start: {
            line: 4,
            column: 16
          },
          end: {
            line: 4,
            column: 26
          }
        },
        loc: {
          start: {
            line: 4,
            column: 39
          },
          end: {
            line: 7,
            column: 1
          }
        },
        line: 4
      },
      "1": {
        name: "getHttpGETdata",
        decl: {
          start: {
            line: 9,
            column: 16
          },
          end: {
            line: 9,
            column: 30
          }
        },
        loc: {
          start: {
            line: 9,
            column: 42
          },
          end: {
            line: 12,
            column: 1
          }
        },
        line: 9
      },
      "2": {
        name: "getHttpPOST",
        decl: {
          start: {
            line: 14,
            column: 16
          },
          end: {
            line: 14,
            column: 27
          }
        },
        loc: {
          start: {
            line: 14,
            column: 39
          },
          end: {
            line: 17,
            column: 1
          }
        },
        line: 14
      },
      "3": {
        name: "getHttpPUT",
        decl: {
          start: {
            line: 19,
            column: 16
          },
          end: {
            line: 19,
            column: 26
          }
        },
        loc: {
          start: {
            line: 19,
            column: 38
          },
          end: {
            line: 22,
            column: 1
          }
        },
        line: 19
      },
      "4": {
        name: "_get",
        decl: {
          start: {
            line: 24,
            column: 9
          },
          end: {
            line: 24,
            column: 13
          }
        },
        loc: {
          start: {
            line: 24,
            column: 36
          },
          end: {
            line: 30,
            column: 1
          }
        },
        line: 24
      },
      "5": {
        name: "(anonymous_5)",
        decl: {
          start: {
            line: 27,
            column: 38
          },
          end: {
            line: 27,
            column: 39
          }
        },
        loc: {
          start: {
            line: 27,
            column: 57
          },
          end: {
            line: 29,
            column: 3
          }
        },
        line: 27
      },
      "6": {
        name: "_getData",
        decl: {
          start: {
            line: 32,
            column: 9
          },
          end: {
            line: 32,
            column: 17
          }
        },
        loc: {
          start: {
            line: 32,
            column: 39
          },
          end: {
            line: 38,
            column: 1
          }
        },
        line: 32
      },
      "7": {
        name: "(anonymous_7)",
        decl: {
          start: {
            line: 35,
            column: 30
          },
          end: {
            line: 35,
            column: 31
          }
        },
        loc: {
          start: {
            line: 35,
            column: 49
          },
          end: {
            line: 37,
            column: 5
          }
        },
        line: 35
      },
      "8": {
        name: "_post",
        decl: {
          start: {
            line: 40,
            column: 9
          },
          end: {
            line: 40,
            column: 14
          }
        },
        loc: {
          start: {
            line: 40,
            column: 36
          },
          end: {
            line: 47,
            column: 1
          }
        },
        line: 40
      },
      "9": {
        name: "(anonymous_9)",
        decl: {
          start: {
            line: 44,
            column: 31
          },
          end: {
            line: 44,
            column: 32
          }
        },
        loc: {
          start: {
            line: 44,
            column: 50
          },
          end: {
            line: 46,
            column: 5
          }
        },
        line: 44
      },
      "10": {
        name: "_put",
        decl: {
          start: {
            line: 49,
            column: 9
          },
          end: {
            line: 49,
            column: 13
          }
        },
        loc: {
          start: {
            line: 49,
            column: 41
          },
          end: {
            line: 58,
            column: 1
          }
        },
        line: 49
      },
      "11": {
        name: "(anonymous_11)",
        decl: {
          start: {
            line: 55,
            column: 30
          },
          end: {
            line: 55,
            column: 31
          }
        },
        loc: {
          start: {
            line: 55,
            column: 49
          },
          end: {
            line: 57,
            column: 5
          }
        },
        line: 55
      }
    },
    branchMap: {},
    s: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0,
      "7": 0,
      "8": 0,
      "9": 0,
      "10": 0,
      "11": 0,
      "12": 0,
      "13": 0,
      "14": 0,
      "15": 0,
      "16": 0,
      "17": 0,
      "18": 0,
      "19": 0,
      "20": 0,
      "21": 0,
      "22": 0,
      "23": 0
    },
    f: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0,
      "7": 0,
      "8": 0,
      "9": 0,
      "10": 0,
      "11": 0
    },
    b: {},
    _coverageSchema: "43e27e138ebf9cfc5966b082cf9a028302ed4184"
  },
      coverage = global[gcv] || (global[gcv] = {});

  if (coverage[path] && coverage[path].hash === hash) {
    return coverage[path];
  }

  coverageData.hash = hash;
  return coverage[path] = coverageData;
}();

function getHttpGET(url, query) {
  cov_16kos3w7wy.f[0]++;
  const syncFunc = (cov_16kos3w7wy.s[0]++, Meteor.wrapAsync(_get));
  cov_16kos3w7wy.s[1]++;
  return syncFunc(url, query);
}

function getHttpGETdata(url, data) {
  cov_16kos3w7wy.f[1]++;
  const syncFunc = (cov_16kos3w7wy.s[2]++, Meteor.wrapAsync(_getData));
  cov_16kos3w7wy.s[3]++;
  return syncFunc(url, data);
}

function getHttpPOST(url, data) {
  cov_16kos3w7wy.f[2]++;
  const syncFunc = (cov_16kos3w7wy.s[4]++, Meteor.wrapAsync(_post));
  cov_16kos3w7wy.s[5]++;
  return syncFunc(url, data);
}

function getHttpPUT(url, data) {
  cov_16kos3w7wy.f[3]++;
  const syncFunc = (cov_16kos3w7wy.s[6]++, Meteor.wrapAsync(_put));
  cov_16kos3w7wy.s[7]++;
  return syncFunc(url, data);
}

function _get(url, query, callback) {
  cov_16kos3w7wy.f[4]++;
  const ourUrl = (cov_16kos3w7wy.s[8]++, url);
  const ourQuery = (cov_16kos3w7wy.s[9]++, query);
  cov_16kos3w7wy.s[10]++;
  HTTP.get(ourUrl, {
    query: ourQuery
  }, function (err, ret) {
    cov_16kos3w7wy.f[5]++;
    cov_16kos3w7wy.s[11]++;
    callback(err, ret);
  });
}

function _getData(url, data, callback) {
  cov_16kos3w7wy.f[6]++;
  const ourUrl = (cov_16kos3w7wy.s[12]++, url);
  const ourData = (cov_16kos3w7wy.s[13]++, data);
  cov_16kos3w7wy.s[14]++;
  HTTP.get(ourUrl, ourData, function (err, ret) {
    cov_16kos3w7wy.f[7]++;
    cov_16kos3w7wy.s[15]++;
    callback(err, ret);
  });
}

function _post(url, data, callback) {
  cov_16kos3w7wy.f[8]++;
  const ourUrl = (cov_16kos3w7wy.s[16]++, url);
  const ourData = (cov_16kos3w7wy.s[17]++, data);
  cov_16kos3w7wy.s[18]++;
  HTTP.post(ourUrl, ourData, function (err, ret) {
    cov_16kos3w7wy.f[9]++;
    cov_16kos3w7wy.s[19]++;
    callback(err, ret);
  });
}

function _put(url, updateData, callback) {
  cov_16kos3w7wy.f[10]++;
  const ourUrl = (cov_16kos3w7wy.s[20]++, url);
  const ourData = (cov_16kos3w7wy.s[21]++, {
    data: updateData
  });
  cov_16kos3w7wy.s[22]++;
  HTTP.put(ourUrl, ourData, function (err, ret) {
    cov_16kos3w7wy.f[11]++;
    cov_16kos3w7wy.s[23]++;
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

var cov_2g79wxhkfw = function () {
  var path = "/home/doichain/dapp/server/api/index.js",
      hash = "a912f2c97b51c40260da7fec10b9ad76feb537d0",
      Function = function () {}.constructor,
      global = new Function('return this')(),
      gcv = "__coverage__",
      coverageData = {
    path: "/home/doichain/dapp/server/api/index.js",
    statementMap: {},
    fnMap: {},
    branchMap: {},
    s: {},
    f: {},
    b: {},
    _coverageSchema: "43e27e138ebf9cfc5966b082cf9a028302ed4184"
  },
      coverage = global[gcv] || (global[gcv] = {});

  if (coverage[path] && coverage[path].hash === hash) {
    return coverage[path];
  }

  coverageData.hash = hash;
  return coverage[path] = coverageData;
}();
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

var cov_3bf8sqype = function () {
  var path = "/home/doichain/dapp/server/api/mail_jobs.js",
      hash = "1003344fb0f6e6eb3ab5c087871fea578ce01ff1",
      Function = function () {}.constructor,
      global = new Function('return this')(),
      gcv = "__coverage__",
      coverageData = {
    path: "/home/doichain/dapp/server/api/mail_jobs.js",
    statementMap: {
      "0": {
        start: {
          line: 3,
          column: 24
        },
        end: {
          line: 3,
          column: 47
        }
      },
      "1": {
        start: {
          line: 10,
          column: 0
        },
        end: {
          line: 21,
          column: 3
        }
      },
      "2": {
        start: {
          line: 11,
          column: 2
        },
        end: {
          line: 20,
          column: 3
        }
      },
      "3": {
        start: {
          line: 12,
          column: 18
        },
        end: {
          line: 12,
          column: 26
        }
      },
      "4": {
        start: {
          line: 13,
          column: 4
        },
        end: {
          line: 13,
          column: 20
        }
      },
      "5": {
        start: {
          line: 14,
          column: 4
        },
        end: {
          line: 14,
          column: 15
        }
      },
      "6": {
        start: {
          line: 16,
          column: 4
        },
        end: {
          line: 16,
          column: 15
        }
      },
      "7": {
        start: {
          line: 17,
          column: 4
        },
        end: {
          line: 17,
          column: 66
        }
      },
      "8": {
        start: {
          line: 19,
          column: 4
        },
        end: {
          line: 19,
          column: 9
        }
      },
      "9": {
        start: {
          line: 24,
          column: 0
        },
        end: {
          line: 26,
          column: 32
        }
      },
      "10": {
        start: {
          line: 28,
          column: 8
        },
        end: {
          line: 43,
          column: 2
        }
      },
      "11": {
        start: {
          line: 29,
          column: 20
        },
        end: {
          line: 29,
          column: 30
        }
      },
      "12": {
        start: {
          line: 30,
          column: 4
        },
        end: {
          line: 30,
          column: 49
        }
      },
      "13": {
        start: {
          line: 32,
          column: 16
        },
        end: {
          line: 35,
          column: 29
        }
      },
      "14": {
        start: {
          line: 37,
          column: 4
        },
        end: {
          line: 37,
          column: 53
        }
      },
      "15": {
        start: {
          line: 38,
          column: 4
        },
        end: {
          line: 38,
          column: 29
        }
      },
      "16": {
        start: {
          line: 39,
          column: 4
        },
        end: {
          line: 41,
          column: 5
        }
      },
      "17": {
        start: {
          line: 40,
          column: 8
        },
        end: {
          line: 40,
          column: 51
        }
      },
      "18": {
        start: {
          line: 42,
          column: 4
        },
        end: {
          line: 42,
          column: 9
        }
      },
      "19": {
        start: {
          line: 45,
          column: 0
        },
        end: {
          line: 48,
          column: 7
        }
      },
      "20": {
        start: {
          line: 47,
          column: 29
        },
        end: {
          line: 47,
          column: 41
        }
      }
    },
    fnMap: {
      "0": {
        name: "(anonymous_0)",
        decl: {
          start: {
            line: 10,
            column: 29
          },
          end: {
            line: 10,
            column: 30
          }
        },
        loc: {
          start: {
            line: 10,
            column: 48
          },
          end: {
            line: 21,
            column: 1
          }
        },
        line: 10
      },
      "1": {
        name: "(anonymous_1)",
        decl: {
          start: {
            line: 28,
            column: 86
          },
          end: {
            line: 28,
            column: 87
          }
        },
        loc: {
          start: {
            line: 28,
            column: 105
          },
          end: {
            line: 43,
            column: 1
          }
        },
        line: 28
      },
      "2": {
        name: "(anonymous_2)",
        decl: {
          start: {
            line: 47,
            column: 15
          },
          end: {
            line: 47,
            column: 16
          }
        },
        loc: {
          start: {
            line: 47,
            column: 27
          },
          end: {
            line: 47,
            column: 43
          }
        },
        line: 47
      }
    },
    branchMap: {
      "0": {
        loc: {
          start: {
            line: 39,
            column: 4
          },
          end: {
            line: 41,
            column: 5
          }
        },
        type: "if",
        locations: [{
          start: {
            line: 39,
            column: 4
          },
          end: {
            line: 41,
            column: 5
          }
        }, {
          start: {
            line: 39,
            column: 4
          },
          end: {
            line: 41,
            column: 5
          }
        }],
        line: 39
      }
    },
    s: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0,
      "7": 0,
      "8": 0,
      "9": 0,
      "10": 0,
      "11": 0,
      "12": 0,
      "13": 0,
      "14": 0,
      "15": 0,
      "16": 0,
      "17": 0,
      "18": 0,
      "19": 0,
      "20": 0
    },
    f: {
      "0": 0,
      "1": 0,
      "2": 0
    },
    b: {
      "0": [0, 0]
    },
    _coverageSchema: "43e27e138ebf9cfc5966b082cf9a028302ed4184"
  },
      coverage = global[gcv] || (global[gcv] = {});

  if (coverage[path] && coverage[path].hash === hash) {
    return coverage[path];
  }

  coverageData.hash = hash;
  return coverage[path] = coverageData;
}();

const MailJobs = (cov_3bf8sqype.s[0]++, JobCollection('emails'));
cov_3bf8sqype.s[1]++;
MailJobs.processJobs('send', function (job, cb) {
  cov_3bf8sqype.f[0]++;
  cov_3bf8sqype.s[2]++;

  try {
    const email = (cov_3bf8sqype.s[3]++, job.data);
    cov_3bf8sqype.s[4]++;
    sendMail(email);
    cov_3bf8sqype.s[5]++;
    job.done();
  } catch (exception) {
    cov_3bf8sqype.s[6]++;
    job.fail();
    cov_3bf8sqype.s[7]++;
    throw new Meteor.Error('jobs.mail.send.exception', exception);
  } finally {
    cov_3bf8sqype.s[8]++;
    cb();
  }
});
cov_3bf8sqype.s[9]++;
new Job(MailJobs, 'cleanup', {}).repeat({
  schedule: MailJobs.later.parse.text("every 5 minutes")
}).save({
  cancelRepeats: true
});
let q = (cov_3bf8sqype.s[10]++, MailJobs.processJobs('cleanup', {
  pollInterval: false,
  workTimeout: 60 * 1000
}, function (job, cb) {
  cov_3bf8sqype.f[1]++;
  const current = (cov_3bf8sqype.s[11]++, new Date());
  cov_3bf8sqype.s[12]++;
  current.setMinutes(current.getMinutes() - 5);
  const ids = (cov_3bf8sqype.s[13]++, MailJobs.find({
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
  }));
  cov_3bf8sqype.s[14]++;
  logMain('found  removable blockchain jobs:', ids);
  cov_3bf8sqype.s[15]++;
  MailJobs.removeJobs(ids);
  cov_3bf8sqype.s[16]++;

  if (ids.length > 0) {
    cov_3bf8sqype.b[0][0]++;
    cov_3bf8sqype.s[17]++;
    job.done("Removed #{ids.length} old jobs");
  } else {
    cov_3bf8sqype.b[0][1]++;
  }

  cov_3bf8sqype.s[18]++;
  cb();
}));
cov_3bf8sqype.s[19]++;
MailJobs.find({
  type: 'jobType',
  status: 'ready'
}).observe({
  added: function () {
    cov_3bf8sqype.f[2]++;
    cov_3bf8sqype.s[20]++;
    q.trigger();
  }
});
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

var cov_1toxistd2w = function () {
  var path = "/home/doichain/dapp/server/main.js",
      hash = "8df542b1279548cda4ce5cf358e95ac4b7215138",
      Function = function () {}.constructor,
      global = new Function('return this')(),
      gcv = "__coverage__",
      coverageData = {
    path: "/home/doichain/dapp/server/main.js",
    statementMap: {},
    fnMap: {},
    branchMap: {},
    s: {},
    f: {},
    b: {},
    _coverageSchema: "43e27e138ebf9cfc5966b082cf9a028302ed4184"
  },
      coverage = global[gcv] || (global[gcv] = {});

  if (coverage[path] && coverage[path].hash === hash) {
    return coverage[path];
  }

  coverageData.hash = hash;
  return coverage[path] = coverageData;
}();
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"i18n":{"de.i18n.json.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// i18n/de.i18n.json.js                                                                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Package['universe:i18n'].i18n.addTranslations('de','',{"components":{"userMenu":{"logout":"Ausloggen","login":"Einloggen","join":"Beitreten","change":"Passwort ändern","entries":{"home":{"name":"Startseite"},"key-generator":{"name":"Key Generator"},"balance":{"name":"Guthaben"},"recipients":{"name":"Empfänger"},"opt-ins":{"name":"Opt-Ins"}}},"keyGenerator":{"privateKey":"Privater Schlüssel","publicKey":"Öffentlicher Schlüssel","generateButton":"Generieren"},"balance":{},"connectionNotification":{"tryingToConnect":"Versuche zu verbinden","connectionIssue":"Es scheint ein Verbindungsproblem zu geben"},"mobileMenu":{"showMenu":"Zeige Menü"}},"pages":{"startPage":{"title":"doichain","infoText":"Doichain - die Blockchain basierte Anti-Email-Spam Lösung","joinNow":"Jetzt anmelden!"},"keyGeneratorPage":{"title":"Key Generator"},"balancePage":{"title":"Guthaben"},"recipientsPage":{"title":"Empfänger","noRecipients":"Keine Empfänger hier","loading":"Lade Empfänger...","id":"ID","email":"Email","publicKey":"Public Key","createdAt":"Erstellt am"},"optInsPage":{"title":"Opt-Ins","noOptIns":"Keine Opt-Ins hier","loading":"Lade Opt-Ins...","id":"ID","recipient":"Empfänger","sender":"Versender","data":"Daten","nameId":"NameId","createdAt":"Erstellt am","confirmedAt":"Bestätigt am","confirmedBy":"Bestätigt von","error":"Fehler"},"authPageSignIn":{"emailRequired":"Email benötigt","passwordRequired":"Passwort benötigt","signIn":"Einloggen.","signInReason":"Einloggen erlaubt dir opt-ins hinzuzufügen","yourEmail":"Deine Email","password":"Passwort","signInButton":"Einloggen","needAccount":"Keinen Account? Jetzt beitreten."},"notFoundPage":{"pageNotFound":"Seite nicht gefunden"}},"api":{"opt-ins":{"add":{"accessDenied":"Keine Berechtigung um Opt-Ins hinzuzufügen"}}}});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"en.i18n.json.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// i18n/en.i18n.json.js                                                                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Package['universe:i18n'].i18n.addTranslations('en','',{"components":{"userMenu":{"logout":"Logout","login":"Login","join":"Sign-up","change":"Change password","entries":{"home":{"name":"Home"},"key-generator":{"name":"Key Generator"},"balance":{"name":"Balance"},"recipients":{"name":"Recipients"},"opt-ins":{"name":"Opt-Ins"}}},"keyGenerator":{"privateKey":"Private key","publicKey":"Public key","generateButton":"Generate"},"balance":{},"connectionNotification":{"tryingToConnect":"Trying to connect","connectionIssue":"There seems to be a connection issue"},"mobileMenu":{"showMenu":"Show Menu"}},"pages":{"startPage":{"title":"doichain","infoText":"This is Doichain - A blockchain based email anti-spam","joinNow":"Join now!"},"keyGeneratorPage":{"title":"Key Generator"},"balancePage":{"title":"Balance"},"recipientsPage":{"title":"Recipients","noRecipients":"No recipients here","loading":"Loading recipients...","id":"ID","email":"Email","publicKey":"Public Key","createdAt":"Created At"},"optInsPage":{"title":"Opt-Ins","noOptIns":"No opt-ins here","loading":"Loading opt-ins...","id":"ID","recipient":"Recipient","sender":"Sender","data":"Data","nameId":"NameId","createdAt":"Created At","confirmedAt":"Confirmed At","confirmedBy":"Confirmed By","error":"Error"},"authPageSignIn":{"emailRequired":"Email required","passwordRequired":"Password required","signIn":"Sign In.","signInReason":"Signing in allows you to add opt-ins","yourEmail":"Your Email","password":"Password","signInButton":"Sign in","needAccount":"Need an account? Join Now."},"notFoundPage":{"pageNotFound":"Page not found"}},"api":{"opt-ins":{"add":{"accessDenied":"Cannot add opt-ins without permissions"}}}});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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