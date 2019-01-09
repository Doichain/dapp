(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var Accounts = Package['accounts-base'].Accounts;
var check = Package.check.check;
var Match = Package.check.Match;
var Random = Package.random.Random;
var Email = Package.email.Email;
var EmailInternals = Package.email.EmailInternals;
var ReactMeteorData = Package['react-meteor-data'].ReactMeteorData;
var T9n = Package['softwarerero:accounts-t9n'].T9n;
var meteorInstall = Package.modules.meteorInstall;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;

/* Package-scope variables */
var serviceName, message, labels;

var require = meteorInstall({"node_modules":{"meteor":{"std:accounts-ui":{"check-npm.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/std_accounts-ui/check-npm.js                                                                               //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
// import { checkNpmVersions } from 'meteor/tmeasday:check-npm-versions';
//
// checkNpmVersions({
//   "react": ">=0.14.7 || ^15.0.0-rc.2",
//   "react-dom": ">=0.14.7 || ^15.0.0-rc.2",
// });
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"main_server.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/std_accounts-ui/main_server.js                                                                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  default: () => LoginForm,
  Accounts: () => Accounts,
  STATES: () => STATES
});
let Accounts;
module.link("meteor/accounts-base", {
  Accounts(v) {
    Accounts = v;
  }

}, 0);
module.link("./imports/accounts_ui.js");
module.link("./imports/login_session.js");
let redirect, STATES;
module.link("./imports/helpers.js", {
  redirect(v) {
    redirect = v;
  },

  STATES(v) {
    STATES = v;
  }

}, 1);
module.link("./imports/api/server/loginWithoutPassword.js");
module.link("./imports/api/server/servicesListPublication.js");
let LoginForm;
module.link("./imports/ui/components/LoginForm.jsx", {
  default(v) {
    LoginForm = v;
  }

}, 2);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"imports":{"accounts_ui.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/std_accounts-ui/imports/accounts_ui.js                                                                     //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let Accounts;
module.link("meteor/accounts-base", {
  Accounts(v) {
    Accounts = v;
  }

}, 0);
let redirect, validatePassword, validateEmail, validateUsername;
module.link("./helpers.js", {
  redirect(v) {
    redirect = v;
  },

  validatePassword(v) {
    validatePassword = v;
  },

  validateEmail(v) {
    validateEmail = v;
  },

  validateUsername(v) {
    validateUsername = v;
  }

}, 1);

/**
 * @summary Accounts UI
 * @namespace
 * @memberOf Accounts
 */
Accounts.ui = {};
Accounts.ui._options = {
  requestPermissions: [],
  requestOfflineToken: {},
  forceApprovalPrompt: {},
  requireEmailVerification: false,
  passwordSignupFields: 'EMAIL_ONLY_NO_PASSWORD',
  minimumPasswordLength: 7,
  loginPath: '/',
  signUpPath: null,
  resetPasswordPath: null,
  profilePath: '/',
  changePasswordPath: null,
  homeRoutePath: '/',
  onSubmitHook: () => {},
  onPreSignUpHook: () => new Promise(resolve => resolve()),
  onPostSignUpHook: () => redirect(`${Accounts.ui._options.homeRoutePath}`),
  onEnrollAccountHook: () => redirect(`${Accounts.ui._options.loginPath}`),
  onResetPasswordHook: () => redirect(`${Accounts.ui._options.loginPath}`),
  onVerifyEmailHook: () => redirect(`${Accounts.ui._options.profilePath}`),
  onSignedInHook: () => redirect(`${Accounts.ui._options.homeRoutePath}`),
  onSignedOutHook: () => redirect(`${Accounts.ui._options.homeRoutePath}`),
  emailPattern: new RegExp('[^@]+@[^@\.]{2,}\.[^\.@]+'),
  browserHistory: null
};
/**
 * @summary Configure the behavior of [`<Accounts.ui.LoginForm />`](#react-accounts-ui).
 * @anywhere
 * @param {Object} options
 * @param {Object} options.requestPermissions Which [permissions](#requestpermissions) to request from the user for each external service.
 * @param {Object} options.requestOfflineToken To ask the user for permission to act on their behalf when offline, map the relevant external service to `true`. Currently only supported with Google. See [Meteor.loginWithExternalService](#meteor_loginwithexternalservice) for more details.
 * @param {Object} options.forceApprovalPrompt If true, forces the user to approve the app's permissions, even if previously approved. Currently only supported with Google.
 * @param {String} options.passwordSignupFields Which fields to display in the user creation form. One of '`USERNAME_AND_EMAIL`', '`USERNAME_AND_OPTIONAL_EMAIL`', '`USERNAME_ONLY`', '`EMAIL_ONLY`', or '`NO_PASSWORD`' (default).
 */

Accounts.ui.config = function (options) {
  // validate options keys
  const VALID_KEYS = ['passwordSignupFields', 'requestPermissions', 'requestOfflineToken', 'forbidClientAccountCreation', 'requireEmailVerification', 'minimumPasswordLength', 'loginPath', 'signUpPath', 'resetPasswordPath', 'profilePath', 'changePasswordPath', 'homeRoutePath', 'onSubmitHook', 'onPreSignUpHook', 'onPostSignUpHook', 'onEnrollAccountHook', 'onResetPasswordHook', 'onVerifyEmailHook', 'onSignedInHook', 'onSignedOutHook', 'validateField', 'emailPattern', 'browserHistory' // Should probably make the redirect method configurable instead
  ];
  Object.keys(options).forEach(function (key) {
    if (!VALID_KEYS.includes(key)) throw new Error("Accounts.ui.config: Invalid key: " + key);
  }); // Deal with `passwordSignupFields`

  if (options.passwordSignupFields) {
    if (["USERNAME_AND_EMAIL", "USERNAME_AND_OPTIONAL_EMAIL", "USERNAME_ONLY", "EMAIL_ONLY", "EMAIL_ONLY_NO_PASSWORD", "USERNAME_AND_EMAIL_NO_PASSWORD"].includes(options.passwordSignupFields)) {
      Accounts.ui._options.passwordSignupFields = options.passwordSignupFields;
    } else {
      throw new Error("Accounts.ui.config: Invalid option for `passwordSignupFields`: " + options.passwordSignupFields);
    }
  } // Deal with `requestPermissions`


  if (options.requestPermissions) {
    Object.keys(options.requestPermissions).forEach(service => {
      const scope = options.requestPermissions[service];

      if (Accounts.ui._options.requestPermissions[service]) {
        throw new Error("Accounts.ui.config: Can't set `requestPermissions` more than once for " + service);
      } else if (!(scope instanceof Array)) {
        throw new Error("Accounts.ui.config: Value for `requestPermissions` must be an array");
      } else {
        Accounts.ui._options.requestPermissions[service] = scope;
      }
    });
  } // Deal with `requestOfflineToken`


  if (options.requestOfflineToken) {
    Object.keys(options.requestOfflineToken).forEach(service => {
      const value = options.requestOfflineToken[service];
      if (service !== 'google') throw new Error("Accounts.ui.config: `requestOfflineToken` only supported for Google login at the moment.");

      if (Accounts.ui._options.requestOfflineToken[service]) {
        throw new Error("Accounts.ui.config: Can't set `requestOfflineToken` more than once for " + service);
      } else {
        Accounts.ui._options.requestOfflineToken[service] = value;
      }
    });
  } // Deal with `forceApprovalPrompt`


  if (options.forceApprovalPrompt) {
    Object.keys(options.forceApprovalPrompt).forEach(service => {
      const value = options.forceApprovalPrompt[service];
      if (service !== 'google') throw new Error("Accounts.ui.config: `forceApprovalPrompt` only supported for Google login at the moment.");

      if (Accounts.ui._options.forceApprovalPrompt[service]) {
        throw new Error("Accounts.ui.config: Can't set `forceApprovalPrompt` more than once for " + service);
      } else {
        Accounts.ui._options.forceApprovalPrompt[service] = value;
      }
    });
  } // Deal with `requireEmailVerification`


  if (options.requireEmailVerification) {
    if (typeof options.requireEmailVerification != 'boolean') {
      throw new Error(`Accounts.ui.config: "requireEmailVerification" not a boolean`);
    } else {
      Accounts.ui._options.requireEmailVerification = options.requireEmailVerification;
    }
  } // Deal with `minimumPasswordLength`


  if (options.minimumPasswordLength) {
    if (typeof options.minimumPasswordLength != 'number') {
      throw new Error(`Accounts.ui.config: "minimumPasswordLength" not a number`);
    } else {
      Accounts.ui._options.minimumPasswordLength = options.minimumPasswordLength;
    }
  } // Deal with the hooks.


  for (let hook of ['onSubmitHook', 'onPreSignUpHook', 'onPostSignUpHook']) {
    if (options[hook]) {
      if (typeof options[hook] != 'function') {
        throw new Error(`Accounts.ui.config: "${hook}" not a function`);
      } else {
        Accounts.ui._options[hook] = options[hook];
      }
    }
  } // Deal with pattern.


  for (let hook of ['emailPattern']) {
    if (options[hook]) {
      if (!(options[hook] instanceof RegExp)) {
        throw new Error(`Accounts.ui.config: "${hook}" not a Regular Expression`);
      } else {
        Accounts.ui._options[hook] = options[hook];
      }
    }
  } // deal with the paths.


  for (let path of ['loginPath', 'signUpPath', 'resetPasswordPath', 'profilePath', 'changePasswordPath', 'homeRoutePath']) {
    if (typeof options[path] !== 'undefined') {
      if (options[path] !== null && typeof options[path] !== 'string') {
        throw new Error(`Accounts.ui.config: ${path} is not a string or null`);
      } else {
        Accounts.ui._options[path] = options[path];
      }
    }
  } // deal with redirect hooks.


  for (let hook of ['onEnrollAccountHook', 'onResetPasswordHook', 'onVerifyEmailHook', 'onSignedInHook', 'onSignedOutHook']) {
    if (options[hook]) {
      if (typeof options[hook] == 'function') {
        Accounts.ui._options[hook] = options[hook];
      } else if (typeof options[hook] == 'string') {
        Accounts.ui._options[hook] = () => redirect(options[hook]);
      } else {
        throw new Error(`Accounts.ui.config: "${hook}" not a function or an absolute or relative path`);
      }
    }
  } // Deal with `browserHistory`


  if (options.browserHistory) {
    if (typeof options.browserHistory != 'object') {
      throw new Error(`Accounts.ui.config: "browserHistory" not an object`);
    } else {
      Accounts.ui._options.browserHistory = options.browserHistory;
    }
  }
};

module.exportDefault(Accounts);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"helpers.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/std_accounts-ui/imports/helpers.js                                                                         //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  loginButtonsSession: () => loginButtonsSession,
  STATES: () => STATES,
  getLoginServices: () => getLoginServices,
  hasPasswordService: () => hasPasswordService,
  loginResultCallback: () => loginResultCallback,
  passwordSignupFields: () => passwordSignupFields,
  validateEmail: () => validateEmail,
  validatePassword: () => validatePassword,
  validateUsername: () => validateUsername,
  redirect: () => redirect,
  capitalize: () => capitalize
});
let browserHistory;

try {
  browserHistory = require('react-router').browserHistory;
} catch (e) {}

const loginButtonsSession = Accounts._loginButtonsSession;
const STATES = {
  SIGN_IN: Symbol('SIGN_IN'),
  SIGN_UP: Symbol('SIGN_UP'),
  PROFILE: Symbol('PROFILE'),
  PASSWORD_CHANGE: Symbol('PASSWORD_CHANGE'),
  PASSWORD_RESET: Symbol('PASSWORD_RESET'),
  ENROLL_ACCOUNT: Symbol('ENROLL_ACCOUNT')
};

function getLoginServices() {
  // First look for OAuth services.
  const services = Package['accounts-oauth'] ? Accounts.oauth.serviceNames() : []; // Be equally kind to all login services. This also preserves
  // backwards-compatibility.

  services.sort();
  return services.map(function (name) {
    return {
      name: name
    };
  });
}

; // Export getLoginServices using old style globals for accounts-base which
// requires it.

this.getLoginServices = getLoginServices;

function hasPasswordService() {
  // First look for OAuth services.
  return !!Package['accounts-password'];
}

;

function loginResultCallback(service, err) {
  if (!err) {} else if (err instanceof Accounts.LoginCancelledError) {// do nothing
  } else if (err instanceof ServiceConfiguration.ConfigError) {} else {//loginButtonsSession.errorMessage(err.reason || "Unknown error");
  }

  if (Meteor.isClient) {
    if (typeof redirect === 'string') {
      window.location.href = '/';
    }

    if (typeof service === 'function') {
      service();
    }
  }
}

;

function passwordSignupFields() {
  return Accounts.ui._options.passwordSignupFields || "EMAIL_ONLY_NO_PASSWORD";
}

;

function validateEmail(email, showMessage, clearMessage) {
  if (passwordSignupFields() === "USERNAME_AND_OPTIONAL_EMAIL" && email === '') {
    return true;
  }

  if (Accounts.ui._options.emailPattern.test(email)) {
    return true;
  } else if (!email || email.length === 0) {
    showMessage("error.emailRequired", 'warning', false, 'email');
    return false;
  } else {
    showMessage("error.accounts.Invalid email", 'warning', false, 'email');
    return false;
  }
}

function validatePassword(password = '', showMessage, clearMessage, fieldId = 'password') {
  if (password.length >= Accounts.ui._options.minimumPasswordLength) {
    return true;
  } else {
    // const errMsg = T9n.get("error.minChar").replace(/7/, Accounts.ui._options.minimumPasswordLength);
    const errMsg = "error.minChar";
    showMessage(errMsg, 'warning', false, fieldId);
    return false;
  }
}

;

function validateUsername(username, showMessage, clearMessage, formState) {
  if (username) {
    return true;
  } else {
    const fieldName = passwordSignupFields() === 'USERNAME_ONLY' || formState === STATES.SIGN_UP ? 'username' : 'usernameOrEmail';
    showMessage("error.usernameRequired", 'warning', false, fieldName);
    return false;
  }
}

function redirect(redirect) {
  if (Meteor.isClient) {
    if (window.history) {
      // Run after all app specific redirects, i.e. to the login screen.
      Meteor.setTimeout(() => {
        if (Package['kadira:flow-router']) {
          Package['kadira:flow-router'].FlowRouter.go(redirect);
        } else if (Package['kadira:flow-router-ssr']) {
          Package['kadira:flow-router-ssr'].FlowRouter.go(redirect);
        } else if (Accounts.ui._options.browserHistory) {
          Accounts.ui._options.browserHistory.push(redirect);
        } else if (browserHistory) {
          browserHistory.push(redirect);
        } else {
          window.history.pushState({}, 'redirect', redirect);
        }
      }, 100);
    }
  }
}

function capitalize(string) {
  return string.replace(/\-/, ' ').split(' ').map(word => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(' ');
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"login_session.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/std_accounts-ui/imports/login_session.js                                                                   //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  validateKey: () => validateKey,
  KEY_PREFIX: () => KEY_PREFIX
});
let Accounts;
module.link("meteor/accounts-base", {
  Accounts(v) {
    Accounts = v;
  }

}, 0);
let STATES, loginResultCallback, getLoginServices;
module.link("./helpers.js", {
  STATES(v) {
    STATES = v;
  },

  loginResultCallback(v) {
    loginResultCallback = v;
  },

  getLoginServices(v) {
    getLoginServices = v;
  }

}, 1);
const VALID_KEYS = ['dropdownVisible', // XXX consider replacing these with one key that has an enum for values.
'inSignupFlow', 'inForgotPasswordFlow', 'inChangePasswordFlow', 'inMessageOnlyFlow', 'errorMessage', 'infoMessage', // dialogs with messages (info and error)
'resetPasswordToken', 'enrollAccountToken', 'justVerifiedEmail', 'justResetPassword', 'configureLoginServiceDialogVisible', 'configureLoginServiceDialogServiceName', 'configureLoginServiceDialogSaveDisabled', 'configureOnDesktopVisible'];

const validateKey = function (key) {
  if (!VALID_KEYS.includes(key)) throw new Error("Invalid key in loginButtonsSession: " + key);
};

const KEY_PREFIX = "Meteor.loginButtons.";
// XXX This should probably be package scope rather than exported
// (there was even a comment to that effect here from before we had
// namespacing) but accounts-ui-viewer uses it, so leave it as is for
// now
Accounts._loginButtonsSession = {
  set: function (key, value) {
    validateKey(key);
    if (['errorMessage', 'infoMessage'].includes(key)) throw new Error("Don't set errorMessage or infoMessage directly. Instead, use errorMessage() or infoMessage().");

    this._set(key, value);
  },
  _set: function (key, value) {
    Session.set(KEY_PREFIX + key, value);
  },
  get: function (key) {
    validateKey(key);
    return Session.get(KEY_PREFIX + key);
  }
};

if (Meteor.isClient) {
  // In the login redirect flow, we'll have the result of the login
  // attempt at page load time when we're redirected back to the
  // application.  Register a callback to update the UI (i.e. to close
  // the dialog on a successful login or display the error on a failed
  // login).
  //
  Accounts.onPageLoadLogin(function (attemptInfo) {
    // Ignore if we have a left over login attempt for a service that is no longer registered.
    if (getLoginServices().map(({
      name
    }) => name).includes(attemptInfo.type)) loginResultCallback(attemptInfo.type, attemptInfo.error);
  });
  let doneCallback;
  Accounts.onResetPasswordLink(function (token, done) {
    Accounts._loginButtonsSession.set('resetPasswordToken', token);

    Session.set(KEY_PREFIX + 'state', 'resetPasswordToken');
    doneCallback = done;

    Accounts.ui._options.onResetPasswordHook();
  });
  Accounts.onEnrollmentLink(function (token, done) {
    Accounts._loginButtonsSession.set('enrollAccountToken', token);

    Session.set(KEY_PREFIX + 'state', 'enrollAccountToken');
    doneCallback = done;

    Accounts.ui._options.onEnrollAccountHook();
  });
  Accounts.onEmailVerificationLink(function (token, done) {
    Accounts.verifyEmail(token, function (error) {
      if (!error) {
        Accounts._loginButtonsSession.set('justVerifiedEmail', true);

        Session.set(KEY_PREFIX + 'state', 'justVerifiedEmail');

        Accounts.ui._options.onSignedInHook();
      } else {
        Accounts.ui._options.onVerifyEmailHook();
      }

      done();
    });
  });
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"api":{"server":{"loginWithoutPassword.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/std_accounts-ui/imports/api/server/loginWithoutPassword.js                                                 //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let Accounts;
module.link("meteor/accounts-base", {
  Accounts(v) {
    Accounts = v;
  }

}, 1);
///
/// LOGIN WITHOUT PASSWORD
///
// Method called by a user to request a password reset email. This is
// the start of the reset process.
Meteor.methods({
  loginWithoutPassword: function ({
    email,
    username = null
  }) {
    if (username !== null) {
      check(username, String);
      var user = Meteor.users.findOne({
        $or: [{
          "username": username,
          "emails.address": {
            $exists: 1
          }
        }, {
          "emails.address": email
        }]
      });
      if (!user) throw new Meteor.Error(403, "User not found");
      email = user.emails[0].address;
    } else {
      check(email, String);
      var user = Meteor.users.findOne({
        "emails.address": email
      });
      if (!user) throw new Meteor.Error(403, "User not found");
    }

    if (Accounts.ui._options.requireEmailVerification) {
      if (!user.emails[0].verified) {
        throw new Meteor.Error(403, "Email not verified");
      }
    }

    Accounts.sendLoginEmail(user._id, email);
  }
});
/**
 * @summary Send an email with a link the user can use verify their email address.
 * @locus Server
 * @param {String} userId The id of the user to send email to.
 * @param {String} [email] Optional. Which address of the user's to send the email to. This address must be in the user's `emails` list. Defaults to the first unverified email in the list.
 */

Accounts.sendLoginEmail = function (userId, address) {
  // XXX Also generate a link using which someone can delete this
  // account if they own said address but weren't those who created
  // this account.
  // Make sure the user exists, and address is one of their addresses.
  var user = Meteor.users.findOne(userId);
  if (!user) throw new Error("Can't find user"); // pick the first unverified address if we weren't passed an address.

  if (!address) {
    var email = (user.emails || []).find(({
      verified
    }) => !verified);
    address = (email || {}).address;
  } // make sure we have a valid address


  if (!address || !(user.emails || []).map(({
    address
  }) => address).includes(address)) throw new Error("No such email address for user.");
  var tokenRecord = {
    token: Random.secret(),
    address: address,
    when: new Date()
  };
  Meteor.users.update({
    _id: userId
  }, {
    $push: {
      'services.email.verificationTokens': tokenRecord
    }
  }); // before passing to template, update user object with new token

  Meteor._ensure(user, 'services', 'email');

  if (!user.services.email.verificationTokens) {
    user.services.email.verificationTokens = [];
  }

  user.services.email.verificationTokens.push(tokenRecord);
  var loginUrl = Accounts.urls.verifyEmail(tokenRecord.token);
  var options = {
    to: address,
    from: Accounts.emailTemplates.loginNoPassword.from ? Accounts.emailTemplates.loginNoPassword.from(user) : Accounts.emailTemplates.from,
    subject: Accounts.emailTemplates.loginNoPassword.subject(user)
  };

  if (typeof Accounts.emailTemplates.loginNoPassword.text === 'function') {
    options.text = Accounts.emailTemplates.loginNoPassword.text(user, loginUrl);
  }

  if (typeof Accounts.emailTemplates.loginNoPassword.html === 'function') options.html = Accounts.emailTemplates.loginNoPassword.html(user, loginUrl);

  if (typeof Accounts.emailTemplates.headers === 'object') {
    options.headers = Accounts.emailTemplates.headers;
  }

  Email.send(options);
}; // Check for installed accounts-password dependency.


if (Accounts.emailTemplates) {
  Accounts.emailTemplates.loginNoPassword = {
    subject: function (user) {
      return "Login on " + Accounts.emailTemplates.siteName;
    },
    text: function (user, url) {
      var greeting = user.profile && user.profile.name ? "Hello " + user.profile.name + "," : "Hello,";
      return `${greeting}
To login, simply click the link below.
${url}
Thanks.
`;
    }
  };
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"servicesListPublication.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/std_accounts-ui/imports/api/server/servicesListPublication.js                                              //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let getLoginServices;
module.link("../../helpers.js", {
  getLoginServices(v) {
    getLoginServices = v;
  }

}, 1);
Meteor.publish('servicesList', function () {
  let services = getLoginServices();

  if (Package['accounts-password']) {
    services.push({
      name: 'password'
    });
  }

  let fields = {}; // Publish the existing services for a user, only name or nothing else.

  services.forEach(service => fields[`services.${service.name}.name`] = 1);
  return Meteor.users.find({
    _id: this.userId
  }, {
    fields: fields
  });
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},"ui":{"components":{"Button.jsx":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/std_accounts-ui/imports/ui/components/Button.jsx                                                           //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  Button: () => Button
});
let React;
module.link("react", {
  default(v) {
    React = v;
  }

}, 0);
let PropTypes;
module.link("prop-types", {
  default(v) {
    PropTypes = v;
  }

}, 1);
let Accounts;
module.link("meteor/accounts-base", {
  Accounts(v) {
    Accounts = v;
  }

}, 2);
let Link;

try {
  Link = require('react-router').Link;
} catch (e) {}

class Button extends React.Component {
  render() {
    const {
      label,
      href = null,
      type,
      disabled = false,
      className,
      onClick
    } = this.props;

    if (type == 'link') {
      // Support React Router.
      if (Link && href) {
        return React.createElement(Link, {
          to: href,
          className: className
        }, label);
      } else {
        return React.createElement("a", {
          href: href,
          className: className,
          onClick: onClick
        }, label);
      }
    }

    return React.createElement("button", {
      className: className,
      type: type,
      disabled: disabled,
      onClick: onClick
    }, label);
  }

}

Button.propTypes = {
  onClick: PropTypes.func
};
Accounts.ui.Button = Button;
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"Buttons.jsx":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/std_accounts-ui/imports/ui/components/Buttons.jsx                                                          //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

module.export({
  Buttons: () => Buttons
});
let React;
module.link("react", {
  default(v) {
    React = v;
  }

}, 0);
module.link("./Button.jsx");
let Accounts;
module.link("meteor/accounts-base", {
  Accounts(v) {
    Accounts = v;
  }

}, 1);

class Buttons extends React.Component {
  render() {
    let {
      buttons = {},
      className = "buttons"
    } = this.props;
    return React.createElement("div", {
      className: className
    }, Object.keys(buttons).map((id, i) => React.createElement(Accounts.ui.Button, (0, _extends2.default)({}, buttons[id], {
      key: i
    }))));
  }

}

;
Accounts.ui.Buttons = Buttons;
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"Field.jsx":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/std_accounts-ui/imports/ui/components/Field.jsx                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  Field: () => Field
});
let React;
module.link("react", {
  default(v) {
    React = v;
  }

}, 0);
let PropTypes;
module.link("prop-types", {
  default(v) {
    PropTypes = v;
  }

}, 1);
let Accounts;
module.link("meteor/accounts-base", {
  Accounts(v) {
    Accounts = v;
  }

}, 2);

class Field extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mount: true
    };
  }

  triggerUpdate() {
    // Trigger an onChange on inital load, to support browser prefilled values.
    const {
      onChange
    } = this.props;

    if (this.input && onChange) {
      onChange({
        target: {
          value: this.input.value || ""
        }
      });
    }
  }

  componentDidMount() {
    this.triggerUpdate();
  }

  componentDidUpdate(prevProps) {
    // Re-mount component so that we don't expose browser prefilled passwords if the component was
    // a password before and now something else.
    if (prevProps.id !== this.props.id) {
      this.setState({
        mount: false
      });
    } else if (!this.state.mount) {
      this.setState({
        mount: true
      });
      this.triggerUpdate();
    }
  }

  render() {
    const {
      id,
      hint,
      label,
      type = 'text',
      onChange,
      required = false,
      className = "field",
      defaultValue = "",
      message
    } = this.props;
    const {
      mount = true
    } = this.state;

    if (type == 'notice') {
      return React.createElement("div", {
        className: className
      }, label);
    }

    return mount ? React.createElement("div", {
      className: className
    }, React.createElement("label", {
      htmlFor: id
    }, label), React.createElement("input", {
      id: id,
      ref: ref => this.input = ref,
      type: type,
      onChange: onChange,
      placeholder: hint,
      defaultValue: defaultValue
    }), message && React.createElement("span", {
      className: ['message', message.type].join(' ').trim()
    }, message.message)) : null;
  }

}

Field.propTypes = {
  onChange: PropTypes.func
};
Accounts.ui.Field = Field;
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"Fields.jsx":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/std_accounts-ui/imports/ui/components/Fields.jsx                                                           //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

module.export({
  Fields: () => Fields
});
let React;
module.link("react", {
  default(v) {
    React = v;
  }

}, 0);
let Accounts;
module.link("meteor/accounts-base", {
  Accounts(v) {
    Accounts = v;
  }

}, 1);
module.link("./Field.jsx");

class Fields extends React.Component {
  render() {
    let {
      fields = {},
      className = "fields"
    } = this.props;
    return React.createElement("div", {
      className: className
    }, Object.keys(fields).map((id, i) => React.createElement(Accounts.ui.Field, (0, _extends2.default)({}, fields[id], {
      key: i
    }))));
  }

}

Accounts.ui.Fields = Fields;
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"Form.jsx":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/std_accounts-ui/imports/ui/components/Form.jsx                                                             //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  Form: () => Form
});
let React;
module.link("react", {
  default(v) {
    React = v;
  }

}, 0);
let PropTypes;
module.link("prop-types", {
  default(v) {
    PropTypes = v;
  }

}, 1);
let ReactDOM;
module.link("react-dom", {
  default(v) {
    ReactDOM = v;
  }

}, 2);
let Accounts;
module.link("meteor/accounts-base", {
  Accounts(v) {
    Accounts = v;
  }

}, 3);
module.link("./Fields.jsx");
module.link("./Buttons.jsx");
module.link("./FormMessage.jsx");
module.link("./PasswordOrService.jsx");
module.link("./SocialButtons.jsx");
module.link("./FormMessages.jsx");

class Form extends React.Component {
  componentDidMount() {
    let form = this.form;

    if (form) {
      form.addEventListener('submit', e => {
        e.preventDefault();
      });
    }
  }

  render() {
    const {
      hasPasswordService,
      oauthServices,
      fields,
      buttons,
      error,
      messages,
      translate,
      ready = true,
      className
    } = this.props;
    return React.createElement("form", {
      ref: ref => this.form = ref,
      className: [className, ready ? "ready" : null].join(' '),
      className: "accounts-ui",
      noValidate: true
    }, React.createElement(Accounts.ui.Fields, {
      fields: fields
    }), React.createElement(Accounts.ui.Buttons, {
      buttons: buttons
    }), React.createElement(Accounts.ui.PasswordOrService, {
      oauthServices: oauthServices,
      translate: translate
    }), React.createElement(Accounts.ui.SocialButtons, {
      oauthServices: oauthServices
    }), React.createElement(Accounts.ui.FormMessages, {
      messages: messages
    }));
  }

}

Form.propTypes = {
  oauthServices: PropTypes.object,
  fields: PropTypes.object.isRequired,
  buttons: PropTypes.object.isRequired,
  translate: PropTypes.func.isRequired,
  error: PropTypes.string,
  ready: PropTypes.bool
};
Accounts.ui.Form = Form;
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"FormMessage.jsx":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/std_accounts-ui/imports/ui/components/FormMessage.jsx                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  FormMessage: () => FormMessage
});
let React;
module.link("react", {
  default(v) {
    React = v;
  }

}, 0);
let Accounts;
module.link("meteor/accounts-base", {
  Accounts(v) {
    Accounts = v;
  }

}, 1);

function isObject(obj) {
  return obj === Object(obj);
}

class FormMessage extends React.Component {
  render() {
    let {
      message,
      type,
      className = "message",
      style = {},
      deprecated
    } = this.props; // XXX Check for deprecations.

    if (deprecated) {
      // Found backwords compatibility issue.
      console.warn('You are overriding Accounts.ui.Form and using FormMessage, the use of FormMessage in Form has been depreacted in v1.2.11, update your implementation to use FormMessages: https://github.com/studiointeract/accounts-ui/#deprecations');
    }

    message = isObject(message) ? message.message : message; // If message is object, then try to get message from it

    return message ? React.createElement("div", {
      style: style,
      className: [className, type].join(' ')
    }, message) : null;
  }

}

Accounts.ui.FormMessage = FormMessage;
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"FormMessages.jsx":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/std_accounts-ui/imports/ui/components/FormMessages.jsx                                                     //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  FormMessages: () => FormMessages
});
let React, Component;
module.link("react", {
  default(v) {
    React = v;
  },

  Component(v) {
    Component = v;
  }

}, 0);
let Accounts;
module.link("meteor/accounts-base", {
  Accounts(v) {
    Accounts = v;
  }

}, 1);

class FormMessages extends Component {
  render() {
    const {
      messages = [],
      className = "messages",
      style = {}
    } = this.props;
    return messages.length > 0 && React.createElement("div", {
      className: "messages"
    }, messages.filter(message => !('field' in message)).map(({
      message,
      type
    }, i) => React.createElement(Accounts.ui.FormMessage, {
      message: message,
      type: type,
      key: i
    })));
  }

}

Accounts.ui.FormMessages = FormMessages;
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"LoginForm.jsx":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/std_accounts-ui/imports/ui/components/LoginForm.jsx                                                        //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

module.export({
  default: () => LoginForm
});
let React, Component;
module.link("react", {
  default(v) {
    React = v;
  },

  Component(v) {
    Component = v;
  }

}, 0);
let PropTypes;
module.link("prop-types", {
  default(v) {
    PropTypes = v;
  }

}, 1);
let uuid;
module.link("uuid", {
  default(v) {
    uuid = v;
  }

}, 2);
let withTracker;
module.link("meteor/react-meteor-data", {
  withTracker(v) {
    withTracker = v;
  }

}, 3);
let Accounts;
module.link("meteor/accounts-base", {
  Accounts(v) {
    Accounts = v;
  }

}, 4);
let T9n;
module.link("meteor/softwarerero:accounts-t9n", {
  T9n(v) {
    T9n = v;
  }

}, 5);
let KEY_PREFIX;
module.link("../../login_session.js", {
  KEY_PREFIX(v) {
    KEY_PREFIX = v;
  }

}, 6);
module.link("./Form.jsx");
let STATES, passwordSignupFields, validateEmail, validatePassword, validateUsername, loginResultCallback, getLoginServices, hasPasswordService, capitalize;
module.link("../../helpers.js", {
  STATES(v) {
    STATES = v;
  },

  passwordSignupFields(v) {
    passwordSignupFields = v;
  },

  validateEmail(v) {
    validateEmail = v;
  },

  validatePassword(v) {
    validatePassword = v;
  },

  validateUsername(v) {
    validateUsername = v;
  },

  loginResultCallback(v) {
    loginResultCallback = v;
  },

  getLoginServices(v) {
    getLoginServices = v;
  },

  hasPasswordService(v) {
    hasPasswordService = v;
  },

  capitalize(v) {
    capitalize = v;
  }

}, 7);

function indexBy(array, key) {
  const result = {};
  array.forEach(function (obj) {
    result[obj[key]] = obj;
  });
  return result;
}

class LoginForm extends Component {
  constructor(props) {
    super(props);
    let {
      formState,
      loginPath,
      signUpPath,
      resetPasswordPath,
      profilePath,
      changePasswordPath
    } = props;

    if (formState === STATES.SIGN_IN && Package['accounts-password']) {
      console.warn('Do not force the state to SIGN_IN on Accounts.ui.LoginForm, it will make it impossible to reset password in your app, this state is also the default state if logged out, so no need to force it.');
    } // Set inital state.


    this.state = {
      messages: [],
      waiting: true,
      formState: formState ? formState : Accounts.user() ? STATES.PROFILE : STATES.SIGN_IN,
      onSubmitHook: props.onSubmitHook || Accounts.ui._options.onSubmitHook,
      onSignedInHook: props.onSignedInHook || Accounts.ui._options.onSignedInHook,
      onSignedOutHook: props.onSignedOutHook || Accounts.ui._options.onSignedOutHook,
      onPreSignUpHook: props.onPreSignUpHook || Accounts.ui._options.onPreSignUpHook,
      onPostSignUpHook: props.onPostSignUpHook || Accounts.ui._options.onPostSignUpHook
    };
    this.translate = this.translate.bind(this);
  }

  componentDidMount() {
    this.setState(prevState => ({
      waiting: false,
      ready: true
    }));
    let changeState = Session.get(KEY_PREFIX + 'state');

    switch (changeState) {
      case 'enrollAccountToken':
        this.setState(prevState => ({
          formState: STATES.ENROLL_ACCOUNT
        }));
        Session.set(KEY_PREFIX + 'state', null);
        break;

      case 'resetPasswordToken':
        this.setState(prevState => ({
          formState: STATES.PASSWORD_CHANGE
        }));
        Session.set(KEY_PREFIX + 'state', null);
        break;

      case 'justVerifiedEmail':
        this.setState(prevState => ({
          formState: STATES.PROFILE
        }));
        Session.set(KEY_PREFIX + 'state', null);
        break;
    } // Add default field values once the form did mount on the client


    this.setState(prevState => (0, _objectSpread2.default)({}, LoginForm.getDefaultFieldValues()));
  }

  static getDerivedStateFromProps({
    formState
  }, {
    formState: stateFormState
  }) {
    return formState && formState !== stateFormState ? (0, _objectSpread2.default)({
      formState: formState
    }, LoginForm.getDefaultFieldValues()) : null;
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevProps.user !== !this.props.user) {
      this.setState({
        formState: this.props.user ? STATES.PROFILE : STATES.SIGN_IN
      });
    }
  }

  translate(text) {
    // if (this.props.t) {
    //   return this.props.t(text);
    // }
    return T9n.get(text);
  }

  validateField(field, value, fieldId) {
    const {
      formState
    } = this.state;

    switch (field) {
      case 'email':
        return validateEmail(value, this.showMessage.bind(this), this.clearMessage.bind(this));

      case 'password':
        return validatePassword(value, this.showMessage.bind(this), this.clearMessage.bind(this), fieldId);

      case 'username':
        return validateUsername(value, this.showMessage.bind(this), this.clearMessage.bind(this), formState);
    }
  }

  getUsernameOrEmailField() {
    return {
      id: 'usernameOrEmail',
      hint: this.translate('enterUsernameOrEmail'),
      label: this.translate('usernameOrEmail'),
      required: true,
      defaultValue: this.state.username || "",
      onChange: this.handleChange.bind(this, 'usernameOrEmail'),
      message: this.getMessageForField('usernameOrEmail')
    };
  }

  getUsernameField() {
    return {
      id: 'username',
      hint: this.translate('enterUsername'),
      label: this.translate('username'),
      required: true,
      defaultValue: this.state.username || "",
      onChange: this.handleChange.bind(this, 'username'),
      message: this.getMessageForField('username')
    };
  }

  getEmailField() {
    return {
      id: 'email',
      hint: this.translate('enterEmail'),
      label: this.translate('email'),
      type: 'email',
      required: true,
      defaultValue: this.state.email || "",
      onChange: this.handleChange.bind(this, 'email'),
      message: this.getMessageForField('email')
    };
  }

  getPasswordField() {
    return {
      id: 'password',
      hint: this.translate('enterPassword'),
      label: this.translate('password'),
      type: 'password',
      required: true,
      defaultValue: this.state.password || "",
      onChange: this.handleChange.bind(this, 'password'),
      message: this.getMessageForField('password')
    };
  }

  getSetPasswordField() {
    return {
      id: 'newPassword',
      hint: this.translate('enterPassword'),
      label: this.translate('choosePassword'),
      type: 'password',
      required: true,
      onChange: this.handleChange.bind(this, 'newPassword')
    };
  }

  getNewPasswordField() {
    return {
      id: 'newPassword',
      hint: this.translate('enterNewPassword'),
      label: this.translate('newPassword'),
      type: 'password',
      required: true,
      onChange: this.handleChange.bind(this, 'newPassword'),
      message: this.getMessageForField('newPassword')
    };
  }

  handleChange(field, evt) {
    let value = evt.target.value;

    switch (field) {
      case 'password':
        break;

      default:
        value = value.trim();
        break;
    }

    this.setState({
      [field]: value
    });
    LoginForm.setDefaultFieldValues({
      [field]: value
    });
  }

  fields() {
    const loginFields = [];
    const {
      formState
    } = this.state;

    if (!hasPasswordService() && getLoginServices().length == 0) {
      loginFields.push({
        label: 'No login service added, i.e. accounts-password',
        type: 'notice'
      });
    }

    if (hasPasswordService() && formState == STATES.SIGN_IN) {
      if (["USERNAME_AND_EMAIL", "USERNAME_AND_OPTIONAL_EMAIL", "USERNAME_AND_EMAIL_NO_PASSWORD"].includes(passwordSignupFields())) {
        loginFields.push(this.getUsernameOrEmailField());
      }

      if (passwordSignupFields() === "USERNAME_ONLY") {
        loginFields.push(this.getUsernameField());
      }

      if (["EMAIL_ONLY", "EMAIL_ONLY_NO_PASSWORD"].includes(passwordSignupFields())) {
        loginFields.push(this.getEmailField());
      }

      if (!["EMAIL_ONLY_NO_PASSWORD", "USERNAME_AND_EMAIL_NO_PASSWORD"].includes(passwordSignupFields())) {
        loginFields.push(this.getPasswordField());
      }
    }

    if (hasPasswordService() && formState == STATES.SIGN_UP) {
      if (["USERNAME_AND_EMAIL", "USERNAME_AND_OPTIONAL_EMAIL", "USERNAME_ONLY", "USERNAME_AND_EMAIL_NO_PASSWORD"].includes(passwordSignupFields())) {
        loginFields.push(this.getUsernameField());
      }

      if (["USERNAME_AND_EMAIL", "EMAIL_ONLY", "EMAIL_ONLY_NO_PASSWORD", "USERNAME_AND_EMAIL_NO_PASSWORD"].includes(passwordSignupFields())) {
        loginFields.push(this.getEmailField());
      }

      if (["USERNAME_AND_OPTIONAL_EMAIL"].includes(passwordSignupFields())) {
        loginFields.push(Object.assign(this.getEmailField(), {
          required: false
        }));
      }

      if (!["EMAIL_ONLY_NO_PASSWORD", "USERNAME_AND_EMAIL_NO_PASSWORD"].includes(passwordSignupFields())) {
        loginFields.push(this.getPasswordField());
      }
    }

    if (formState == STATES.PASSWORD_RESET) {
      loginFields.push(this.getEmailField());
    }

    if (this.showPasswordChangeForm()) {
      if (Meteor.isClient && !Accounts._loginButtonsSession.get('resetPasswordToken')) {
        loginFields.push(this.getPasswordField());
      }

      loginFields.push(this.getNewPasswordField());
    }

    if (this.showEnrollAccountForm()) {
      loginFields.push(this.getSetPasswordField());
    }

    return indexBy(loginFields, 'id');
  }

  buttons() {
    const {
      loginPath = Accounts.ui._options.loginPath,
      signUpPath = Accounts.ui._options.signUpPath,
      resetPasswordPath = Accounts.ui._options.resetPasswordPath,
      changePasswordPath = Accounts.ui._options.changePasswordPath,
      profilePath = Accounts.ui._options.profilePath
    } = this.props;
    const {
      user
    } = this.props;
    const {
      formState,
      waiting
    } = this.state;
    let loginButtons = [];

    if (user && formState == STATES.PROFILE) {
      loginButtons.push({
        id: 'signOut',
        label: this.translate('signOut'),
        disabled: waiting,
        onClick: this.signOut.bind(this)
      });
    }

    if (this.showCreateAccountLink()) {
      loginButtons.push({
        id: 'switchToSignUp',
        label: this.translate('signUp'),
        type: 'link',
        href: signUpPath,
        onClick: this.switchToSignUp.bind(this)
      });
    }

    if (formState == STATES.SIGN_UP || formState == STATES.PASSWORD_RESET) {
      loginButtons.push({
        id: 'switchToSignIn',
        label: this.translate('signIn'),
        type: 'link',
        href: loginPath,
        onClick: this.switchToSignIn.bind(this)
      });
    }

    if (this.showForgotPasswordLink()) {
      loginButtons.push({
        id: 'switchToPasswordReset',
        label: this.translate('forgotPassword'),
        type: 'link',
        href: resetPasswordPath,
        onClick: this.switchToPasswordReset.bind(this)
      });
    }

    if (user && !["EMAIL_ONLY_NO_PASSWORD", "USERNAME_AND_EMAIL_NO_PASSWORD"].includes(passwordSignupFields()) && formState == STATES.PROFILE && user.services && 'password' in user.services) {
      loginButtons.push({
        id: 'switchToChangePassword',
        label: this.translate('changePassword'),
        type: 'link',
        href: changePasswordPath,
        onClick: this.switchToChangePassword.bind(this)
      });
    }

    if (formState == STATES.SIGN_UP) {
      loginButtons.push({
        id: 'signUp',
        label: this.translate('signUp'),
        type: hasPasswordService() ? 'submit' : 'link',
        className: 'active',
        disabled: waiting,
        onClick: hasPasswordService() ? this.signUp.bind(this, {}) : null
      });
    }

    if (this.showSignInLink()) {
      loginButtons.push({
        id: 'signIn',
        label: this.translate('signIn'),
        type: hasPasswordService() ? 'submit' : 'link',
        className: 'active',
        disabled: waiting,
        onClick: hasPasswordService() ? this.signIn.bind(this) : null
      });
    }

    if (formState == STATES.PASSWORD_RESET) {
      loginButtons.push({
        id: 'emailResetLink',
        label: this.translate('resetYourPassword'),
        type: 'submit',
        disabled: waiting,
        onClick: this.passwordReset.bind(this)
      });
    }

    if (this.showPasswordChangeForm() || this.showEnrollAccountForm()) {
      loginButtons.push({
        id: 'changePassword',
        label: this.showPasswordChangeForm() ? this.translate('changePassword') : this.translate('setPassword'),
        type: 'submit',
        disabled: waiting,
        onClick: this.passwordChange.bind(this)
      });

      if (Accounts.user()) {
        loginButtons.push({
          id: 'switchToSignOut',
          label: this.translate('cancel'),
          type: 'link',
          href: profilePath,
          onClick: this.switchToSignOut.bind(this)
        });
      } else {
        loginButtons.push({
          id: 'cancelResetPassword',
          label: this.translate('cancel'),
          type: 'link',
          onClick: this.cancelResetPassword.bind(this)
        });
      }
    } // Sort the button array so that the submit button always comes first, and
    // buttons should also come before links.


    loginButtons.sort((a, b) => {
      return (b.type == 'submit' && a.type != undefined) - (a.type == 'submit' && b.type != undefined);
    });
    return indexBy(loginButtons, 'id');
  }

  showSignInLink() {
    return this.state.formState == STATES.SIGN_IN && Package['accounts-password'];
  }

  showPasswordChangeForm() {
    return Package['accounts-password'] && this.state.formState == STATES.PASSWORD_CHANGE;
  }

  showEnrollAccountForm() {
    return Package['accounts-password'] && this.state.formState == STATES.ENROLL_ACCOUNT;
  }

  showCreateAccountLink() {
    return this.state.formState == STATES.SIGN_IN && !Accounts._options.forbidClientAccountCreation && Package['accounts-password'];
  }

  showForgotPasswordLink() {
    return !this.props.user && this.state.formState == STATES.SIGN_IN && ["USERNAME_AND_EMAIL", "USERNAME_AND_OPTIONAL_EMAIL", "EMAIL_ONLY"].includes(passwordSignupFields());
  }
  /**
   * Helper to store field values while using the form.
   */


  static setDefaultFieldValues(defaults) {
    if (typeof defaults !== 'object') {
      throw new Error('Argument to setDefaultFieldValues is not of type object');
    } else if (typeof localStorage !== 'undefined' && localStorage) {
      localStorage.setItem('accounts_ui', JSON.stringify((0, _objectSpread2.default)({
        passwordSignupFields: passwordSignupFields()
      }, LoginForm.getDefaultFieldValues(), defaults)));
    }
  }
  /**
   * Helper to get field values when switching states in the form.
   */


  static getDefaultFieldValues() {
    if (typeof localStorage !== 'undefined' && localStorage) {
      const defaultFieldValues = JSON.parse(localStorage.getItem('accounts_ui') || null);

      if (defaultFieldValues && defaultFieldValues.passwordSignupFields === passwordSignupFields()) {
        return defaultFieldValues;
      }
    }
  }
  /**
   * Helper to clear field values when signing in, up or out.
   */


  clearDefaultFieldValues() {
    if (typeof localStorage !== 'undefined' && localStorage) {
      localStorage.removeItem('accounts_ui');
    }
  }

  switchToSignUp(event) {
    event.preventDefault();
    this.setState((0, _objectSpread2.default)({
      formState: STATES.SIGN_UP
    }, LoginForm.getDefaultFieldValues()));
    this.clearMessages();
  }

  switchToSignIn(event) {
    event.preventDefault();
    this.setState((0, _objectSpread2.default)({
      formState: STATES.SIGN_IN
    }, LoginForm.getDefaultFieldValues()));
    this.clearMessages();
  }

  switchToPasswordReset(event) {
    event.preventDefault();
    this.setState((0, _objectSpread2.default)({
      formState: STATES.PASSWORD_RESET
    }, LoginForm.getDefaultFieldValues()));
    this.clearMessages();
  }

  switchToChangePassword(event) {
    event.preventDefault();
    this.setState((0, _objectSpread2.default)({
      formState: STATES.PASSWORD_CHANGE
    }, LoginForm.getDefaultFieldValues()));
    this.clearMessages();
  }

  switchToSignOut(event) {
    event.preventDefault();
    this.setState({
      formState: STATES.PROFILE
    });
    this.clearMessages();
  }

  cancelResetPassword(event) {
    event.preventDefault();

    Accounts._loginButtonsSession.set('resetPasswordToken', null);

    this.setState({
      formState: STATES.SIGN_IN,
      messages: []
    });
  }

  signOut() {
    Meteor.logout(() => {
      this.setState({
        formState: STATES.SIGN_IN,
        password: null
      });
      this.state.onSignedOutHook();
      this.clearMessages();
      this.clearDefaultFieldValues();
    });
  }

  signIn() {
    const {
      username = null,
      email = null,
      usernameOrEmail = null,
      password,
      formState,
      onSubmitHook
    } = this.state;
    let error = false;
    let loginSelector;
    this.clearMessages();

    if (usernameOrEmail !== null) {
      if (!this.validateField('username', usernameOrEmail)) {
        if (this.state.formState == STATES.SIGN_UP) {
          this.state.onSubmitHook("error.accounts.usernameRequired", this.state.formState);
        }

        error = true;
      } else {
        if (["USERNAME_AND_EMAIL_NO_PASSWORD"].includes(passwordSignupFields())) {
          this.loginWithoutPassword();
          return;
        } else {
          loginSelector = usernameOrEmail;
        }
      }
    } else if (username !== null) {
      if (!this.validateField('username', username)) {
        if (this.state.formState == STATES.SIGN_UP) {
          this.state.onSubmitHook("error.accounts.usernameRequired", this.state.formState);
        }

        error = true;
      } else {
        loginSelector = {
          username: username
        };
      }
    } else if (usernameOrEmail == null) {
      if (!this.validateField('email', email)) {
        error = true;
      } else {
        if (["EMAIL_ONLY_NO_PASSWORD"].includes(passwordSignupFields())) {
          this.loginWithoutPassword();
          error = true;
        } else {
          loginSelector = {
            email
          };
        }
      }
    }

    if (!["EMAIL_ONLY_NO_PASSWORD"].includes(passwordSignupFields()) && !this.validateField('password', password)) {
      error = true;
    }

    if (!error) {
      Meteor.loginWithPassword(loginSelector, password, (error, result) => {
        onSubmitHook(error, formState);

        if (error) {
          this.showMessage(`error.accounts.${error.reason}` || "unknown_error", 'error');
        } else {
          loginResultCallback(() => this.state.onSignedInHook());
          this.setState({
            formState: STATES.PROFILE,
            password: null
          });
          this.clearDefaultFieldValues();
        }
      });
    }
  }

  oauthButtons() {
    const {
      formState,
      waiting
    } = this.state;
    let oauthButtons = [];

    if (formState == STATES.SIGN_IN || formState == STATES.SIGN_UP) {
      if (Accounts.oauth) {
        Accounts.oauth.serviceNames().map(service => {
          oauthButtons.push({
            id: service,
            label: capitalize(service),
            disabled: waiting,
            type: 'button',
            className: `btn-${service} ${service}`,
            onClick: this.oauthSignIn.bind(this, service)
          });
        });
      }
    }

    return indexBy(oauthButtons, 'id');
  }

  oauthSignIn(serviceName) {
    const {
      user
    } = this.props;
    const {
      formState,
      waiting,
      onSubmitHook
    } = this.state; //Thanks Josh Owens for this one.

    function capitalService() {
      return serviceName.charAt(0).toUpperCase() + serviceName.slice(1);
    }

    if (serviceName === 'meteor-developer') {
      serviceName = 'meteorDeveloperAccount';
    }

    const loginWithService = Meteor["loginWith" + capitalService()];
    let options = {}; // use default scope unless specified

    if (Accounts.ui._options.requestPermissions[serviceName]) options.requestPermissions = Accounts.ui._options.requestPermissions[serviceName];
    if (Accounts.ui._options.requestOfflineToken[serviceName]) options.requestOfflineToken = Accounts.ui._options.requestOfflineToken[serviceName];
    if (Accounts.ui._options.forceApprovalPrompt[serviceName]) options.forceApprovalPrompt = Accounts.ui._options.forceApprovalPrompt[serviceName];
    this.clearMessages();
    const self = this;
    loginWithService(options, error => {
      onSubmitHook(error, formState);

      if (error) {
        this.showMessage(`error.accounts.${error.reason}` || "unknown_error");
      } else {
        this.setState({
          formState: STATES.PROFILE
        });
        this.clearDefaultFieldValues();
        loginResultCallback(() => {
          Meteor.setTimeout(() => this.state.onSignedInHook(), 100);
        });
      }
    });
  }

  signUp(options = {}) {
    const {
      username = null,
      email = null,
      usernameOrEmail = null,
      password,
      formState,
      onSubmitHook
    } = this.state;
    let error = false;
    this.clearMessages();

    if (username !== null) {
      if (!this.validateField('username', username)) {
        if (this.state.formState == STATES.SIGN_UP) {
          this.state.onSubmitHook("error.accounts.usernameRequired", this.state.formState);
        }

        error = true;
      } else {
        options.username = username;
      }
    } else {
      if (["USERNAME_AND_EMAIL", "USERNAME_AND_EMAIL_NO_PASSWORD"].includes(passwordSignupFields()) && !this.validateField('username', username)) {
        if (this.state.formState == STATES.SIGN_UP) {
          this.state.onSubmitHook("error.accounts.usernameRequired", this.state.formState);
        }

        error = true;
      }
    }

    if (!this.validateField('email', email)) {
      error = true;
    } else {
      options.email = email;
    }

    if (["EMAIL_ONLY_NO_PASSWORD", "USERNAME_AND_EMAIL_NO_PASSWORD"].includes(passwordSignupFields())) {
      // Generate a random password.
      options.password = uuid(); //Meteor.uuid();
    } else if (!this.validateField('password', password)) {
      onSubmitHook("Invalid password", formState);
      error = true;
    } else {
      options.password = password;
    }

    const SignUp = function (_options) {
      Accounts.createUser(_options, error => {
        if (error) {
          this.showMessage(`error.accounts.${error.reason}` || "unknown_error", 'error');

          if (this.translate(`error.accounts.${error.reason}`)) {
            onSubmitHook(`error.accounts.${error.reason}`, formState);
          } else {
            onSubmitHook("unknown_error", formState);
          }
        } else {
          onSubmitHook(null, formState);
          this.setState({
            formState: STATES.PROFILE,
            password: null
          });
          let user = Accounts.user();
          loginResultCallback(this.state.onPostSignUpHook.bind(this, _options, user));
          this.clearDefaultFieldValues();
        }

        this.setState({
          waiting: false
        });
      });
    };

    if (!error) {
      this.setState({
        waiting: true
      }); // Allow for Promises to return.

      let promise = this.state.onPreSignUpHook(options);

      if (promise instanceof Promise) {
        promise.then(SignUp.bind(this, options));
      } else {
        SignUp(options);
      }
    }
  }

  loginWithoutPassword() {
    const {
      email = '',
      usernameOrEmail = '',
      waiting,
      formState,
      onSubmitHook
    } = this.state;

    if (waiting) {
      return;
    }

    if (this.validateField('email', email)) {
      this.setState({
        waiting: true
      });
      Accounts.loginWithoutPassword({
        email: email
      }, error => {
        if (error) {
          this.showMessage(`error.accounts.${error.reason}` || "unknown_error", 'error');
        } else {
          this.showMessage("info.emailSent", 'success', 5000);
          this.clearDefaultFieldValues();
        }

        onSubmitHook(error, formState);
        this.setState({
          waiting: false
        });
      });
    } else if (this.validateField('username', usernameOrEmail)) {
      this.setState({
        waiting: true
      });
      Accounts.loginWithoutPassword({
        email: usernameOrEmail,
        username: usernameOrEmail
      }, error => {
        if (error) {
          this.showMessage(`error.accounts.${error.reason}` || "unknown_error", 'error');
        } else {
          this.showMessage("info.emailSent", 'success', 5000);
          this.clearDefaultFieldValues();
        }

        onSubmitHook(error, formState);
        this.setState({
          waiting: false
        });
      });
    } else {
      let errMsg = "error.accounts.invalid_email";
      this.showMessage(errMsg, 'warning');
      onSubmitHook(this.translate(errMsg), formState);
    }
  }

  passwordReset() {
    const {
      email = '',
      waiting,
      formState,
      onSubmitHook
    } = this.state;

    if (waiting) {
      return;
    }

    this.clearMessages();

    if (this.validateField('email', email)) {
      this.setState({
        waiting: true
      });
      Accounts.forgotPassword({
        email: email
      }, error => {
        if (error) {
          this.showMessage(`error.accounts.${error.reason}` || "unknown_error", 'error');
        } else {
          this.showMessage("info.emailSent", 'success', 5000);
          this.clearDefaultFieldValues();
        }

        onSubmitHook(error, formState);
        this.setState({
          waiting: false
        });
      });
    }
  }

  passwordChange() {
    const {
      password,
      newPassword,
      formState,
      onSubmitHook,
      onSignedInHook
    } = this.state;

    if (!this.validateField('password', newPassword, 'newPassword')) {
      onSubmitHook('err.minChar', formState);
      return;
    }

    let token = Accounts._loginButtonsSession.get('resetPasswordToken');

    if (!token) {
      token = Accounts._loginButtonsSession.get('enrollAccountToken');
    }

    if (token) {
      Accounts.resetPassword(token, newPassword, error => {
        if (error) {
          this.showMessage(`error.accounts.${error.reason}` || "unknown_error", 'error');
          onSubmitHook(error, formState);
        } else {
          this.showMessage('info.passwordChanged', 'success', 5000);
          onSubmitHook(null, formState);
          this.setState({
            formState: STATES.PROFILE
          });

          Accounts._loginButtonsSession.set('resetPasswordToken', null);

          Accounts._loginButtonsSession.set('enrollAccountToken', null);

          onSignedInHook();
        }
      });
    } else {
      Accounts.changePassword(password, newPassword, error => {
        if (error) {
          this.showMessage(`error.accounts.${error.reason}` || "unknown_error", 'error');
          onSubmitHook(error, formState);
        } else {
          this.showMessage('info.passwordChanged', 'success', 5000);
          onSubmitHook(null, formState);
          this.setState({
            formState: STATES.PROFILE
          });
          this.clearDefaultFieldValues();
        }
      });
    }
  }

  showMessage(message, type, clearTimeout, field) {
    message = this.translate(message).trim();

    if (message) {
      this.setState(({
        messages = []
      }) => {
        messages.push((0, _objectSpread2.default)({
          message,
          type
        }, field && {
          field
        }));
        return {
          messages
        };
      });

      if (clearTimeout) {
        this.hideMessageTimout = setTimeout(() => {
          // Filter out the message that timed out.
          this.clearMessage(message);
        }, clearTimeout);
      }
    }
  }

  getMessageForField(field) {
    const {
      messages = []
    } = this.state;
    return messages.find(({
      field: key
    }) => key === field);
  }

  clearMessage(message) {
    if (message) {
      this.setState(({
        messages = []
      }) => ({
        messages: messages.filter(({
          message: a
        }) => a !== message)
      }));
    }
  }

  clearMessages() {
    if (this.hideMessageTimout) {
      clearTimeout(this.hideMessageTimout);
    }

    this.setState({
      messages: []
    });
  }

  componentWillUnmount() {
    if (this.hideMessageTimout) {
      clearTimeout(this.hideMessageTimout);
    }
  }

  render() {
    this.oauthButtons(); // Backwords compatibility with v1.2.x.

    const {
      messages = []
    } = this.state;
    const message = {
      deprecated: true,
      message: messages.map(({
        message
      }) => message).join(', ')
    };
    return React.createElement(Accounts.ui.Form, (0, _extends2.default)({
      oauthServices: this.oauthButtons(),
      fields: this.fields(),
      buttons: this.buttons()
    }, this.state, {
      message: message,
      translate: text => this.translate(text)
    }));
  }

}

LoginForm.propTypes = {
  formState: PropTypes.symbol,
  loginPath: PropTypes.string,
  signUpPath: PropTypes.string,
  resetPasswordPath: PropTypes.string,
  profilePath: PropTypes.string,
  changePasswordPath: PropTypes.string
};
LoginForm.defaultProps = {
  formState: null,
  loginPath: null,
  signUpPath: null,
  resetPasswordPath: null,
  profilePath: null,
  changePasswordPath: null
};
Accounts.ui.LoginForm = withTracker(() => {
  // Listen for the user to login/logout and the services list to the user.
  Meteor.subscribe('servicesList');
  return {
    user: Accounts.user()
  };
})(LoginForm);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"PasswordOrService.jsx":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/std_accounts-ui/imports/ui/components/PasswordOrService.jsx                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.export({
  PasswordOrService: () => PasswordOrService
});
let React;
module.link("react", {
  default(v) {
    React = v;
  }

}, 0);
let PropTypes;
module.link("prop-types", {
  default(v) {
    PropTypes = v;
  }

}, 1);
let Accounts;
module.link("meteor/accounts-base", {
  Accounts(v) {
    Accounts = v;
  }

}, 2);
let T9n;
module.link("meteor/softwarerero:accounts-t9n", {
  T9n(v) {
    T9n = v;
  }

}, 3);
let hasPasswordService;
module.link("../../helpers.js", {
  hasPasswordService(v) {
    hasPasswordService = v;
  }

}, 4);

class PasswordOrService extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasPasswordService: hasPasswordService(),
      services: Object.keys(props.oauthServices).map(service => {
        return props.oauthServices[service].label;
      })
    };
  }

  translate(text) {
    if (this.props.translate) {
      return this.props.translate(text);
    }

    return T9n.get(text);
  }

  render() {
    let {
      className = "password-or-service",
      style = {}
    } = this.props;
    let {
      hasPasswordService,
      services
    } = this.state;
    labels = services;

    if (services.length > 2) {
      labels = [];
    }

    if (hasPasswordService && services.length > 0) {
      return React.createElement("div", {
        style: style,
        className: className
      }, `${this.translate('orUse')} ${labels.join(' / ')}`);
    }

    return null;
  }

}

PasswordOrService.propTypes = {
  oauthServices: PropTypes.object
};
Accounts.ui.PasswordOrService = PasswordOrService;
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"SocialButtons.jsx":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/std_accounts-ui/imports/ui/components/SocialButtons.jsx                                                    //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

module.export({
  SocialButtons: () => SocialButtons
});
let React;
module.link("react", {
  default(v) {
    React = v;
  }

}, 0);
module.link("./Button.jsx");
let Accounts;
module.link("meteor/accounts-base", {
  Accounts(v) {
    Accounts = v;
  }

}, 1);

class SocialButtons extends React.Component {
  render() {
    let {
      oauthServices = {},
      className = "social-buttons"
    } = this.props;
    return React.createElement("div", {
      className: className
    }, Object.keys(oauthServices).map((id, i) => {
      return React.createElement(Accounts.ui.Button, (0, _extends2.default)({}, oauthServices[id], {
        key: i
      }));
    }));
  }

}

Accounts.ui.SocialButtons = SocialButtons;
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}}}},{
  "extensions": [
    ".js",
    ".json",
    ".jsx"
  ]
});

require("/node_modules/meteor/std:accounts-ui/check-npm.js");
var exports = require("/node_modules/meteor/std:accounts-ui/main_server.js");

/* Exports */
Package._define("std:accounts-ui", exports);

})();

//# sourceURL=meteor://💻app/packages/std_accounts-ui.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RkOmFjY291bnRzLXVpL2NoZWNrLW5wbS5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RkOmFjY291bnRzLXVpL21haW5fc2VydmVyLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGQ6YWNjb3VudHMtdWkvaW1wb3J0cy9hY2NvdW50c191aS5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RkOmFjY291bnRzLXVpL2ltcG9ydHMvaGVscGVycy5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RkOmFjY291bnRzLXVpL2ltcG9ydHMvbG9naW5fc2Vzc2lvbi5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RkOmFjY291bnRzLXVpL2ltcG9ydHMvYXBpL3NlcnZlci9sb2dpbldpdGhvdXRQYXNzd29yZC5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RkOmFjY291bnRzLXVpL2ltcG9ydHMvYXBpL3NlcnZlci9zZXJ2aWNlc0xpc3RQdWJsaWNhdGlvbi5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RkOmFjY291bnRzLXVpL2ltcG9ydHMvdWkvY29tcG9uZW50cy9CdXR0b24uanN4IiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGQ6YWNjb3VudHMtdWkvaW1wb3J0cy91aS9jb21wb25lbnRzL0J1dHRvbnMuanN4IiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGQ6YWNjb3VudHMtdWkvaW1wb3J0cy91aS9jb21wb25lbnRzL0ZpZWxkLmpzeCIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RkOmFjY291bnRzLXVpL2ltcG9ydHMvdWkvY29tcG9uZW50cy9GaWVsZHMuanN4IiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGQ6YWNjb3VudHMtdWkvaW1wb3J0cy91aS9jb21wb25lbnRzL0Zvcm0uanN4IiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGQ6YWNjb3VudHMtdWkvaW1wb3J0cy91aS9jb21wb25lbnRzL0Zvcm1NZXNzYWdlLmpzeCIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RkOmFjY291bnRzLXVpL2ltcG9ydHMvdWkvY29tcG9uZW50cy9Gb3JtTWVzc2FnZXMuanN4IiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGQ6YWNjb3VudHMtdWkvaW1wb3J0cy91aS9jb21wb25lbnRzL0xvZ2luRm9ybS5qc3giLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZDphY2NvdW50cy11aS9pbXBvcnRzL3VpL2NvbXBvbmVudHMvUGFzc3dvcmRPclNlcnZpY2UuanN4IiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGQ6YWNjb3VudHMtdWkvaW1wb3J0cy91aS9jb21wb25lbnRzL1NvY2lhbEJ1dHRvbnMuanN4Il0sIm5hbWVzIjpbIm1vZHVsZSIsImV4cG9ydCIsImRlZmF1bHQiLCJMb2dpbkZvcm0iLCJBY2NvdW50cyIsIlNUQVRFUyIsImxpbmsiLCJ2IiwicmVkaXJlY3QiLCJ2YWxpZGF0ZVBhc3N3b3JkIiwidmFsaWRhdGVFbWFpbCIsInZhbGlkYXRlVXNlcm5hbWUiLCJ1aSIsIl9vcHRpb25zIiwicmVxdWVzdFBlcm1pc3Npb25zIiwicmVxdWVzdE9mZmxpbmVUb2tlbiIsImZvcmNlQXBwcm92YWxQcm9tcHQiLCJyZXF1aXJlRW1haWxWZXJpZmljYXRpb24iLCJwYXNzd29yZFNpZ251cEZpZWxkcyIsIm1pbmltdW1QYXNzd29yZExlbmd0aCIsImxvZ2luUGF0aCIsInNpZ25VcFBhdGgiLCJyZXNldFBhc3N3b3JkUGF0aCIsInByb2ZpbGVQYXRoIiwiY2hhbmdlUGFzc3dvcmRQYXRoIiwiaG9tZVJvdXRlUGF0aCIsIm9uU3VibWl0SG9vayIsIm9uUHJlU2lnblVwSG9vayIsIlByb21pc2UiLCJyZXNvbHZlIiwib25Qb3N0U2lnblVwSG9vayIsIm9uRW5yb2xsQWNjb3VudEhvb2siLCJvblJlc2V0UGFzc3dvcmRIb29rIiwib25WZXJpZnlFbWFpbEhvb2siLCJvblNpZ25lZEluSG9vayIsIm9uU2lnbmVkT3V0SG9vayIsImVtYWlsUGF0dGVybiIsIlJlZ0V4cCIsImJyb3dzZXJIaXN0b3J5IiwiY29uZmlnIiwib3B0aW9ucyIsIlZBTElEX0tFWVMiLCJPYmplY3QiLCJrZXlzIiwiZm9yRWFjaCIsImtleSIsImluY2x1ZGVzIiwiRXJyb3IiLCJzZXJ2aWNlIiwic2NvcGUiLCJBcnJheSIsInZhbHVlIiwiaG9vayIsInBhdGgiLCJleHBvcnREZWZhdWx0IiwibG9naW5CdXR0b25zU2Vzc2lvbiIsImdldExvZ2luU2VydmljZXMiLCJoYXNQYXNzd29yZFNlcnZpY2UiLCJsb2dpblJlc3VsdENhbGxiYWNrIiwiY2FwaXRhbGl6ZSIsInJlcXVpcmUiLCJlIiwiX2xvZ2luQnV0dG9uc1Nlc3Npb24iLCJTSUdOX0lOIiwiU3ltYm9sIiwiU0lHTl9VUCIsIlBST0ZJTEUiLCJQQVNTV09SRF9DSEFOR0UiLCJQQVNTV09SRF9SRVNFVCIsIkVOUk9MTF9BQ0NPVU5UIiwic2VydmljZXMiLCJQYWNrYWdlIiwib2F1dGgiLCJzZXJ2aWNlTmFtZXMiLCJzb3J0IiwibWFwIiwibmFtZSIsImVyciIsIkxvZ2luQ2FuY2VsbGVkRXJyb3IiLCJTZXJ2aWNlQ29uZmlndXJhdGlvbiIsIkNvbmZpZ0Vycm9yIiwiTWV0ZW9yIiwiaXNDbGllbnQiLCJ3aW5kb3ciLCJsb2NhdGlvbiIsImhyZWYiLCJlbWFpbCIsInNob3dNZXNzYWdlIiwiY2xlYXJNZXNzYWdlIiwidGVzdCIsImxlbmd0aCIsInBhc3N3b3JkIiwiZmllbGRJZCIsImVyck1zZyIsInVzZXJuYW1lIiwiZm9ybVN0YXRlIiwiZmllbGROYW1lIiwiaGlzdG9yeSIsInNldFRpbWVvdXQiLCJGbG93Um91dGVyIiwiZ28iLCJwdXNoIiwicHVzaFN0YXRlIiwic3RyaW5nIiwicmVwbGFjZSIsInNwbGl0Iiwid29yZCIsImNoYXJBdCIsInRvVXBwZXJDYXNlIiwic2xpY2UiLCJqb2luIiwidmFsaWRhdGVLZXkiLCJLRVlfUFJFRklYIiwic2V0IiwiX3NldCIsIlNlc3Npb24iLCJnZXQiLCJvblBhZ2VMb2FkTG9naW4iLCJhdHRlbXB0SW5mbyIsInR5cGUiLCJlcnJvciIsImRvbmVDYWxsYmFjayIsIm9uUmVzZXRQYXNzd29yZExpbmsiLCJ0b2tlbiIsImRvbmUiLCJvbkVucm9sbG1lbnRMaW5rIiwib25FbWFpbFZlcmlmaWNhdGlvbkxpbmsiLCJ2ZXJpZnlFbWFpbCIsIm1ldGhvZHMiLCJsb2dpbldpdGhvdXRQYXNzd29yZCIsImNoZWNrIiwiU3RyaW5nIiwidXNlciIsInVzZXJzIiwiZmluZE9uZSIsIiRvciIsIiRleGlzdHMiLCJlbWFpbHMiLCJhZGRyZXNzIiwidmVyaWZpZWQiLCJzZW5kTG9naW5FbWFpbCIsIl9pZCIsInVzZXJJZCIsImZpbmQiLCJ0b2tlblJlY29yZCIsIlJhbmRvbSIsInNlY3JldCIsIndoZW4iLCJEYXRlIiwidXBkYXRlIiwiJHB1c2giLCJfZW5zdXJlIiwidmVyaWZpY2F0aW9uVG9rZW5zIiwibG9naW5VcmwiLCJ1cmxzIiwidG8iLCJmcm9tIiwiZW1haWxUZW1wbGF0ZXMiLCJsb2dpbk5vUGFzc3dvcmQiLCJzdWJqZWN0IiwidGV4dCIsImh0bWwiLCJoZWFkZXJzIiwiRW1haWwiLCJzZW5kIiwic2l0ZU5hbWUiLCJ1cmwiLCJncmVldGluZyIsInByb2ZpbGUiLCJwdWJsaXNoIiwiZmllbGRzIiwiQnV0dG9uIiwiUmVhY3QiLCJQcm9wVHlwZXMiLCJMaW5rIiwiQ29tcG9uZW50IiwicmVuZGVyIiwibGFiZWwiLCJkaXNhYmxlZCIsImNsYXNzTmFtZSIsIm9uQ2xpY2siLCJwcm9wcyIsInByb3BUeXBlcyIsImZ1bmMiLCJCdXR0b25zIiwiYnV0dG9ucyIsImlkIiwiaSIsIkZpZWxkIiwiY29uc3RydWN0b3IiLCJzdGF0ZSIsIm1vdW50IiwidHJpZ2dlclVwZGF0ZSIsIm9uQ2hhbmdlIiwiaW5wdXQiLCJ0YXJnZXQiLCJjb21wb25lbnREaWRNb3VudCIsImNvbXBvbmVudERpZFVwZGF0ZSIsInByZXZQcm9wcyIsInNldFN0YXRlIiwiaGludCIsInJlcXVpcmVkIiwiZGVmYXVsdFZhbHVlIiwibWVzc2FnZSIsInJlZiIsInRyaW0iLCJGaWVsZHMiLCJGb3JtIiwiUmVhY3RET00iLCJmb3JtIiwiYWRkRXZlbnRMaXN0ZW5lciIsInByZXZlbnREZWZhdWx0Iiwib2F1dGhTZXJ2aWNlcyIsIm1lc3NhZ2VzIiwidHJhbnNsYXRlIiwicmVhZHkiLCJvYmplY3QiLCJpc1JlcXVpcmVkIiwiYm9vbCIsIkZvcm1NZXNzYWdlIiwiaXNPYmplY3QiLCJvYmoiLCJzdHlsZSIsImRlcHJlY2F0ZWQiLCJjb25zb2xlIiwid2FybiIsIkZvcm1NZXNzYWdlcyIsImZpbHRlciIsInV1aWQiLCJ3aXRoVHJhY2tlciIsIlQ5biIsImluZGV4QnkiLCJhcnJheSIsInJlc3VsdCIsIndhaXRpbmciLCJiaW5kIiwicHJldlN0YXRlIiwiY2hhbmdlU3RhdGUiLCJnZXREZWZhdWx0RmllbGRWYWx1ZXMiLCJnZXREZXJpdmVkU3RhdGVGcm9tUHJvcHMiLCJzdGF0ZUZvcm1TdGF0ZSIsInZhbGlkYXRlRmllbGQiLCJmaWVsZCIsImdldFVzZXJuYW1lT3JFbWFpbEZpZWxkIiwiaGFuZGxlQ2hhbmdlIiwiZ2V0TWVzc2FnZUZvckZpZWxkIiwiZ2V0VXNlcm5hbWVGaWVsZCIsImdldEVtYWlsRmllbGQiLCJnZXRQYXNzd29yZEZpZWxkIiwiZ2V0U2V0UGFzc3dvcmRGaWVsZCIsImdldE5ld1Bhc3N3b3JkRmllbGQiLCJldnQiLCJzZXREZWZhdWx0RmllbGRWYWx1ZXMiLCJsb2dpbkZpZWxkcyIsImFzc2lnbiIsInNob3dQYXNzd29yZENoYW5nZUZvcm0iLCJzaG93RW5yb2xsQWNjb3VudEZvcm0iLCJsb2dpbkJ1dHRvbnMiLCJzaWduT3V0Iiwic2hvd0NyZWF0ZUFjY291bnRMaW5rIiwic3dpdGNoVG9TaWduVXAiLCJzd2l0Y2hUb1NpZ25JbiIsInNob3dGb3Jnb3RQYXNzd29yZExpbmsiLCJzd2l0Y2hUb1Bhc3N3b3JkUmVzZXQiLCJzd2l0Y2hUb0NoYW5nZVBhc3N3b3JkIiwic2lnblVwIiwic2hvd1NpZ25JbkxpbmsiLCJzaWduSW4iLCJwYXNzd29yZFJlc2V0IiwicGFzc3dvcmRDaGFuZ2UiLCJzd2l0Y2hUb1NpZ25PdXQiLCJjYW5jZWxSZXNldFBhc3N3b3JkIiwiYSIsImIiLCJ1bmRlZmluZWQiLCJmb3JiaWRDbGllbnRBY2NvdW50Q3JlYXRpb24iLCJkZWZhdWx0cyIsImxvY2FsU3RvcmFnZSIsInNldEl0ZW0iLCJKU09OIiwic3RyaW5naWZ5IiwiZGVmYXVsdEZpZWxkVmFsdWVzIiwicGFyc2UiLCJnZXRJdGVtIiwiY2xlYXJEZWZhdWx0RmllbGRWYWx1ZXMiLCJyZW1vdmVJdGVtIiwiZXZlbnQiLCJjbGVhck1lc3NhZ2VzIiwibG9nb3V0IiwidXNlcm5hbWVPckVtYWlsIiwibG9naW5TZWxlY3RvciIsImxvZ2luV2l0aFBhc3N3b3JkIiwicmVhc29uIiwib2F1dGhCdXR0b25zIiwib2F1dGhTaWduSW4iLCJzZXJ2aWNlTmFtZSIsImNhcGl0YWxTZXJ2aWNlIiwibG9naW5XaXRoU2VydmljZSIsInNlbGYiLCJTaWduVXAiLCJjcmVhdGVVc2VyIiwicHJvbWlzZSIsInRoZW4iLCJmb3Jnb3RQYXNzd29yZCIsIm5ld1Bhc3N3b3JkIiwicmVzZXRQYXNzd29yZCIsImNoYW5nZVBhc3N3b3JkIiwiY2xlYXJUaW1lb3V0IiwiaGlkZU1lc3NhZ2VUaW1vdXQiLCJjb21wb25lbnRXaWxsVW5tb3VudCIsInN5bWJvbCIsImRlZmF1bHRQcm9wcyIsInN1YnNjcmliZSIsIlBhc3N3b3JkT3JTZXJ2aWNlIiwibGFiZWxzIiwiU29jaWFsQnV0dG9ucyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE07Ozs7Ozs7Ozs7O0FDTEFBLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjO0FBQUNDLFNB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QUFJL0ksS0FBSjtBQUFVNUssTUFBTSxDQUFDTSxJQUFQLENBQVksT0FBWixFQUFvQjtBQUFDSixTQUFPLENBQUNLLENBQUQsRUFBRztBQUFDcUssU0FBSyxHQUFDckssQ0FBTjtBQUFROztBQUFwQixDQUFwQixFQUEwQyxDQUExQztBQUE2Q1AsTUFBTSxDQUFDTSxJQUFQLENBQVksY0FBWjtBQUE0QixJQUFJRixRQUFKO0FBQWFKLE1BQU0sQ0FBQ00sSUFBUCxDQUFZLHNCQUFaLEVBQW1DO0FBQUNGLFVBQVEsQ0FBQ0csQ0FBRCxFQUFHO0FBQUNILFlBQVEsR0FBQ0csQ0FBVDtBQUFXOztBQUF4QixDQUFuQyxFQUE2RCxDQUE3RDs7QUFLMUksTUFBTW9ULGFBQU4sU0FBNEIvSSxLQUFLLENBQUNHLFNBQWxDLENBQTRDO0FBQ2pEQyxRQUFNLEdBQUc7QUFDUCxRQUFJO0FBQUVvQyxtQkFBYSxHQUFHLEVBQWxCO0FBQXNCakMsZUFBUyxHQUFHO0FBQWxDLFFBQXVELEtBQUtFLEtBQWhFO0FBQ0EsV0FDRTtBQUFLLGVBQVMsRUFBR0Y7QUFBakIsT0FDR3pJLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZeUssYUFBWixFQUEyQnpJLEdBQTNCLENBQStCLENBQUMrRyxFQUFELEVBQUtDLENBQUwsS0FBVztBQUN6QyxhQUFPLG9CQUFDLFFBQUQsQ0FBVSxFQUFWLENBQWEsTUFBYiw2QkFBd0J5QixhQUFhLENBQUMxQixFQUFELENBQXJDO0FBQTJDLFdBQUcsRUFBRUM7QUFBaEQsU0FBUDtBQUNELEtBRkEsQ0FESCxDQURGO0FBT0Q7O0FBVmdEOztBQWFuRHZMLFFBQVEsQ0FBQ1EsRUFBVCxDQUFZK1MsYUFBWixHQUE0QkEsYUFBNUIsQyIsImZpbGUiOiIvcGFja2FnZXMvc3RkX2FjY291bnRzLXVpLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gaW1wb3J0IHsgY2hlY2tOcG1WZXJzaW9ucyB9IGZyb20gJ21ldGVvci90bWVhc2RheTpjaGVjay1ucG0tdmVyc2lvbnMnO1xuLy9cbi8vIGNoZWNrTnBtVmVyc2lvbnMoe1xuLy8gICBcInJlYWN0XCI6IFwiPj0wLjE0LjcgfHwgXjE1LjAuMC1yYy4yXCIsXG4vLyAgIFwicmVhY3QtZG9tXCI6IFwiPj0wLjE0LjcgfHwgXjE1LjAuMC1yYy4yXCIsXG4vLyB9KTtcbiIsImltcG9ydCB7IEFjY291bnRzIH0gZnJvbSAnbWV0ZW9yL2FjY291bnRzLWJhc2UnO1xuaW1wb3J0ICcuL2ltcG9ydHMvYWNjb3VudHNfdWkuanMnO1xuaW1wb3J0ICcuL2ltcG9ydHMvbG9naW5fc2Vzc2lvbi5qcyc7XG5pbXBvcnQgeyByZWRpcmVjdCwgU1RBVEVTIH3CoGZyb20gJy4vaW1wb3J0cy9oZWxwZXJzLmpzJztcbmltcG9ydCAnLi9pbXBvcnRzL2FwaS9zZXJ2ZXIvbG9naW5XaXRob3V0UGFzc3dvcmQuanMnO1xuaW1wb3J0ICcuL2ltcG9ydHMvYXBpL3NlcnZlci9zZXJ2aWNlc0xpc3RQdWJsaWNhdGlvbi5qcyc7XG5pbXBvcnQgTG9naW5Gb3JtIGZyb20gJy4vaW1wb3J0cy91aS9jb21wb25lbnRzL0xvZ2luRm9ybS5qc3gnO1xuXG5leHBvcnQge1xuICBMb2dpbkZvcm0gYXMgZGVmYXVsdCxcbiAgQWNjb3VudHMsXG4gIFNUQVRFUyxcbn07XG4iLCJpbXBvcnQgeyBBY2NvdW50cyB9IGZyb20gJ21ldGVvci9hY2NvdW50cy1iYXNlJztcbmltcG9ydCB7XG4gIHJlZGlyZWN0LFxuICB2YWxpZGF0ZVBhc3N3b3JkLFxuICB2YWxpZGF0ZUVtYWlsLFxuICB2YWxpZGF0ZVVzZXJuYW1lLFxufSBmcm9tICcuL2hlbHBlcnMuanMnO1xuXG4vKipcbiAqIEBzdW1tYXJ5IEFjY291bnRzIFVJXG4gKiBAbmFtZXNwYWNlXG4gKiBAbWVtYmVyT2YgQWNjb3VudHNcbiAqL1xuQWNjb3VudHMudWkgPSB7fTtcblxuQWNjb3VudHMudWkuX29wdGlvbnMgPSB7XG4gIHJlcXVlc3RQZXJtaXNzaW9uczogW10sXG4gIHJlcXVlc3RPZmZsaW5lVG9rZW46IHt9LFxuICBmb3JjZUFwcHJvdmFsUHJvbXB0OiB7fSxcbiAgcmVxdWlyZUVtYWlsVmVyaWZpY2F0aW9uOiBmYWxzZSxcbiAgcGFzc3dvcmRTaWdudXBGaWVsZHM6ICdFTUFJTF9PTkxZX05PX1BBU1NXT1JEJyxcbiAgbWluaW11bVBhc3N3b3JkTGVuZ3RoOiA3LFxuICBsb2dpblBhdGg6ICcvJyxcbiAgc2lnblVwUGF0aDogbnVsbCxcbiAgcmVzZXRQYXNzd29yZFBhdGg6IG51bGwsXG4gIHByb2ZpbGVQYXRoOiAnLycsXG4gIGNoYW5nZVBhc3N3b3JkUGF0aDogbnVsbCxcbiAgaG9tZVJvdXRlUGF0aDogJy8nLFxuICBvblN1Ym1pdEhvb2s6ICgpID0+IHt9LFxuICBvblByZVNpZ25VcEhvb2s6ICgpID0+IG5ldyBQcm9taXNlKHJlc29sdmUgPT4gcmVzb2x2ZSgpKSxcbiAgb25Qb3N0U2lnblVwSG9vazogKCkgPT4gcmVkaXJlY3QoYCR7QWNjb3VudHMudWkuX29wdGlvbnMuaG9tZVJvdXRlUGF0aH1gKSxcbiAgb25FbnJvbGxBY2NvdW50SG9vazogKCkgPT4gcmVkaXJlY3QoYCR7QWNjb3VudHMudWkuX29wdGlvbnMubG9naW5QYXRofWApLFxuICBvblJlc2V0UGFzc3dvcmRIb29rOiAoKSA9PiByZWRpcmVjdChgJHtBY2NvdW50cy51aS5fb3B0aW9ucy5sb2dpblBhdGh9YCksXG4gIG9uVmVyaWZ5RW1haWxIb29rOiAoKSA9PiByZWRpcmVjdChgJHtBY2NvdW50cy51aS5fb3B0aW9ucy5wcm9maWxlUGF0aH1gKSxcbiAgb25TaWduZWRJbkhvb2s6ICgpID0+IHJlZGlyZWN0KGAke0FjY291bnRzLnVpLl9vcHRpb25zLmhvbWVSb3V0ZVBhdGh9YCksXG4gIG9uU2lnbmVkT3V0SG9vazogKCkgPT4gcmVkaXJlY3QoYCR7QWNjb3VudHMudWkuX29wdGlvbnMuaG9tZVJvdXRlUGF0aH1gKSxcbiAgZW1haWxQYXR0ZXJuOiBuZXcgUmVnRXhwKCdbXkBdK0BbXkBcXC5dezIsfVxcLlteXFwuQF0rJyksXG4gIGJyb3dzZXJIaXN0b3J5OiBudWxsLFxufTtcblxuLyoqXG4gKiBAc3VtbWFyeSBDb25maWd1cmUgdGhlIGJlaGF2aW9yIG9mIFtgPEFjY291bnRzLnVpLkxvZ2luRm9ybSAvPmBdKCNyZWFjdC1hY2NvdW50cy11aSkuXG4gKiBAYW55d2hlcmVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucy5yZXF1ZXN0UGVybWlzc2lvbnMgV2hpY2ggW3Blcm1pc3Npb25zXSgjcmVxdWVzdHBlcm1pc3Npb25zKSB0byByZXF1ZXN0IGZyb20gdGhlIHVzZXIgZm9yIGVhY2ggZXh0ZXJuYWwgc2VydmljZS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zLnJlcXVlc3RPZmZsaW5lVG9rZW4gVG8gYXNrIHRoZSB1c2VyIGZvciBwZXJtaXNzaW9uIHRvIGFjdCBvbiB0aGVpciBiZWhhbGYgd2hlbiBvZmZsaW5lLCBtYXAgdGhlIHJlbGV2YW50IGV4dGVybmFsIHNlcnZpY2UgdG8gYHRydWVgLiBDdXJyZW50bHkgb25seSBzdXBwb3J0ZWQgd2l0aCBHb29nbGUuIFNlZSBbTWV0ZW9yLmxvZ2luV2l0aEV4dGVybmFsU2VydmljZV0oI21ldGVvcl9sb2dpbndpdGhleHRlcm5hbHNlcnZpY2UpIGZvciBtb3JlIGRldGFpbHMuXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucy5mb3JjZUFwcHJvdmFsUHJvbXB0IElmIHRydWUsIGZvcmNlcyB0aGUgdXNlciB0byBhcHByb3ZlIHRoZSBhcHAncyBwZXJtaXNzaW9ucywgZXZlbiBpZiBwcmV2aW91c2x5IGFwcHJvdmVkLiBDdXJyZW50bHkgb25seSBzdXBwb3J0ZWQgd2l0aCBHb29nbGUuXG4gKiBAcGFyYW0ge1N0cmluZ30gb3B0aW9ucy5wYXNzd29yZFNpZ251cEZpZWxkcyBXaGljaCBmaWVsZHMgdG8gZGlzcGxheSBpbiB0aGUgdXNlciBjcmVhdGlvbiBmb3JtLiBPbmUgb2YgJ2BVU0VSTkFNRV9BTkRfRU1BSUxgJywgJ2BVU0VSTkFNRV9BTkRfT1BUSU9OQUxfRU1BSUxgJywgJ2BVU0VSTkFNRV9PTkxZYCcsICdgRU1BSUxfT05MWWAnLCBvciAnYE5PX1BBU1NXT1JEYCcgKGRlZmF1bHQpLlxuICovXG5BY2NvdW50cy51aS5jb25maWcgPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gIC8vIHZhbGlkYXRlIG9wdGlvbnMga2V5c1xuICBjb25zdCBWQUxJRF9LRVlTID0gW1xuICAgICdwYXNzd29yZFNpZ251cEZpZWxkcycsXG4gICAgJ3JlcXVlc3RQZXJtaXNzaW9ucycsXG4gICAgJ3JlcXVlc3RPZmZsaW5lVG9rZW4nLFxuICAgICdmb3JiaWRDbGllbnRBY2NvdW50Q3JlYXRpb24nLFxuICAgICdyZXF1aXJlRW1haWxWZXJpZmljYXRpb24nLFxuICAgICdtaW5pbXVtUGFzc3dvcmRMZW5ndGgnLFxuICAgICdsb2dpblBhdGgnLFxuICAgICdzaWduVXBQYXRoJyxcbiAgICAncmVzZXRQYXNzd29yZFBhdGgnLFxuICAgICdwcm9maWxlUGF0aCcsXG4gICAgJ2NoYW5nZVBhc3N3b3JkUGF0aCcsXG4gICAgJ2hvbWVSb3V0ZVBhdGgnLFxuICAgICdvblN1Ym1pdEhvb2snLFxuICAgICdvblByZVNpZ25VcEhvb2snLFxuICAgICdvblBvc3RTaWduVXBIb29rJyxcbiAgICAnb25FbnJvbGxBY2NvdW50SG9vaycsXG4gICAgJ29uUmVzZXRQYXNzd29yZEhvb2snLFxuICAgICdvblZlcmlmeUVtYWlsSG9vaycsXG4gICAgJ29uU2lnbmVkSW5Ib29rJyxcbiAgICAnb25TaWduZWRPdXRIb29rJyxcbiAgICAndmFsaWRhdGVGaWVsZCcsXG4gICAgJ2VtYWlsUGF0dGVybicsXG4gICAgJ2Jyb3dzZXJIaXN0b3J5JyAgICAvLyBTaG91bGQgcHJvYmFibHkgbWFrZSB0aGUgcmVkaXJlY3QgbWV0aG9kIGNvbmZpZ3VyYWJsZSBpbnN0ZWFkXG4gIF07XG5cbiAgT2JqZWN0LmtleXMob3B0aW9ucykuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgaWYgKCFWQUxJRF9LRVlTLmluY2x1ZGVzKGtleSkpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJBY2NvdW50cy51aS5jb25maWc6IEludmFsaWQga2V5OiBcIiArIGtleSk7XG4gIH0pO1xuXG4gIC8vIERlYWwgd2l0aCBgcGFzc3dvcmRTaWdudXBGaWVsZHNgXG4gIGlmIChvcHRpb25zLnBhc3N3b3JkU2lnbnVwRmllbGRzKSB7XG4gICAgaWYgKFtcbiAgICAgIFwiVVNFUk5BTUVfQU5EX0VNQUlMXCIsXG4gICAgICBcIlVTRVJOQU1FX0FORF9PUFRJT05BTF9FTUFJTFwiLFxuICAgICAgXCJVU0VSTkFNRV9PTkxZXCIsXG4gICAgICBcIkVNQUlMX09OTFlcIixcbiAgICAgIFwiRU1BSUxfT05MWV9OT19QQVNTV09SRFwiLFxuICAgICAgXCJVU0VSTkFNRV9BTkRfRU1BSUxfTk9fUEFTU1dPUkRcIlxuICAgIF0uaW5jbHVkZXMob3B0aW9ucy5wYXNzd29yZFNpZ251cEZpZWxkcykpIHtcbiAgICAgIEFjY291bnRzLnVpLl9vcHRpb25zLnBhc3N3b3JkU2lnbnVwRmllbGRzID0gb3B0aW9ucy5wYXNzd29yZFNpZ251cEZpZWxkcztcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJBY2NvdW50cy51aS5jb25maWc6IEludmFsaWQgb3B0aW9uIGZvciBgcGFzc3dvcmRTaWdudXBGaWVsZHNgOiBcIiArIG9wdGlvbnMucGFzc3dvcmRTaWdudXBGaWVsZHMpO1xuICAgIH1cbiAgfVxuXG4gIC8vIERlYWwgd2l0aCBgcmVxdWVzdFBlcm1pc3Npb25zYFxuICBpZiAob3B0aW9ucy5yZXF1ZXN0UGVybWlzc2lvbnMpIHtcbiAgICBPYmplY3Qua2V5cyhvcHRpb25zLnJlcXVlc3RQZXJtaXNzaW9ucykuZm9yRWFjaChzZXJ2aWNlID0+IHtcbiAgICAgIGNvbnN0IHNjb3BlID0gb3B0aW9ucy5yZXF1ZXN0UGVybWlzc2lvbnNbc2VydmljZV07XG4gICAgICBpZiAoQWNjb3VudHMudWkuX29wdGlvbnMucmVxdWVzdFBlcm1pc3Npb25zW3NlcnZpY2VdKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkFjY291bnRzLnVpLmNvbmZpZzogQ2FuJ3Qgc2V0IGByZXF1ZXN0UGVybWlzc2lvbnNgIG1vcmUgdGhhbiBvbmNlIGZvciBcIiArIHNlcnZpY2UpO1xuICAgICAgfVxuICAgICAgZWxzZSBpZiAoIShzY29wZSBpbnN0YW5jZW9mIEFycmF5KSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJBY2NvdW50cy51aS5jb25maWc6IFZhbHVlIGZvciBgcmVxdWVzdFBlcm1pc3Npb25zYCBtdXN0IGJlIGFuIGFycmF5XCIpO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIEFjY291bnRzLnVpLl9vcHRpb25zLnJlcXVlc3RQZXJtaXNzaW9uc1tzZXJ2aWNlXSA9IHNjb3BlO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLy8gRGVhbCB3aXRoIGByZXF1ZXN0T2ZmbGluZVRva2VuYFxuICBpZiAob3B0aW9ucy5yZXF1ZXN0T2ZmbGluZVRva2VuKSB7XG4gICAgT2JqZWN0LmtleXMob3B0aW9ucy5yZXF1ZXN0T2ZmbGluZVRva2VuKS5mb3JFYWNoKHNlcnZpY2UgPT4ge1xuICAgICAgY29uc3QgdmFsdWUgPSBvcHRpb25zLnJlcXVlc3RPZmZsaW5lVG9rZW5bc2VydmljZV07XG4gICAgICBpZiAoc2VydmljZSAhPT0gJ2dvb2dsZScpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkFjY291bnRzLnVpLmNvbmZpZzogYHJlcXVlc3RPZmZsaW5lVG9rZW5gIG9ubHkgc3VwcG9ydGVkIGZvciBHb29nbGUgbG9naW4gYXQgdGhlIG1vbWVudC5cIik7XG5cbiAgICAgIGlmIChBY2NvdW50cy51aS5fb3B0aW9ucy5yZXF1ZXN0T2ZmbGluZVRva2VuW3NlcnZpY2VdKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkFjY291bnRzLnVpLmNvbmZpZzogQ2FuJ3Qgc2V0IGByZXF1ZXN0T2ZmbGluZVRva2VuYCBtb3JlIHRoYW4gb25jZSBmb3IgXCIgKyBzZXJ2aWNlKTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBBY2NvdW50cy51aS5fb3B0aW9ucy5yZXF1ZXN0T2ZmbGluZVRva2VuW3NlcnZpY2VdID0gdmFsdWU7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvLyBEZWFsIHdpdGggYGZvcmNlQXBwcm92YWxQcm9tcHRgXG4gIGlmIChvcHRpb25zLmZvcmNlQXBwcm92YWxQcm9tcHQpIHtcbiAgICBPYmplY3Qua2V5cyhvcHRpb25zLmZvcmNlQXBwcm92YWxQcm9tcHQpLmZvckVhY2goc2VydmljZSA9PiB7XG4gICAgICBjb25zdCB2YWx1ZSA9IG9wdGlvbnMuZm9yY2VBcHByb3ZhbFByb21wdFtzZXJ2aWNlXTtcbiAgICAgIGlmIChzZXJ2aWNlICE9PSAnZ29vZ2xlJylcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQWNjb3VudHMudWkuY29uZmlnOiBgZm9yY2VBcHByb3ZhbFByb21wdGAgb25seSBzdXBwb3J0ZWQgZm9yIEdvb2dsZSBsb2dpbiBhdCB0aGUgbW9tZW50LlwiKTtcblxuICAgICAgaWYgKEFjY291bnRzLnVpLl9vcHRpb25zLmZvcmNlQXBwcm92YWxQcm9tcHRbc2VydmljZV0pIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQWNjb3VudHMudWkuY29uZmlnOiBDYW4ndCBzZXQgYGZvcmNlQXBwcm92YWxQcm9tcHRgIG1vcmUgdGhhbiBvbmNlIGZvciBcIiArIHNlcnZpY2UpO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIEFjY291bnRzLnVpLl9vcHRpb25zLmZvcmNlQXBwcm92YWxQcm9tcHRbc2VydmljZV0gPSB2YWx1ZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8vIERlYWwgd2l0aCBgcmVxdWlyZUVtYWlsVmVyaWZpY2F0aW9uYFxuICBpZiAob3B0aW9ucy5yZXF1aXJlRW1haWxWZXJpZmljYXRpb24pIHtcbiAgICBpZiAodHlwZW9mIG9wdGlvbnMucmVxdWlyZUVtYWlsVmVyaWZpY2F0aW9uICE9ICdib29sZWFuJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBBY2NvdW50cy51aS5jb25maWc6IFwicmVxdWlyZUVtYWlsVmVyaWZpY2F0aW9uXCIgbm90IGEgYm9vbGVhbmApO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIEFjY291bnRzLnVpLl9vcHRpb25zLnJlcXVpcmVFbWFpbFZlcmlmaWNhdGlvbiA9IG9wdGlvbnMucmVxdWlyZUVtYWlsVmVyaWZpY2F0aW9uO1xuICAgIH1cbiAgfVxuXG4gIC8vIERlYWwgd2l0aCBgbWluaW11bVBhc3N3b3JkTGVuZ3RoYFxuICBpZiAob3B0aW9ucy5taW5pbXVtUGFzc3dvcmRMZW5ndGgpIHtcbiAgICBpZiAodHlwZW9mIG9wdGlvbnMubWluaW11bVBhc3N3b3JkTGVuZ3RoICE9ICdudW1iZXInKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEFjY291bnRzLnVpLmNvbmZpZzogXCJtaW5pbXVtUGFzc3dvcmRMZW5ndGhcIiBub3QgYSBudW1iZXJgKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBBY2NvdW50cy51aS5fb3B0aW9ucy5taW5pbXVtUGFzc3dvcmRMZW5ndGggPSBvcHRpb25zLm1pbmltdW1QYXNzd29yZExlbmd0aDtcbiAgICB9XG4gIH1cblxuICAvLyBEZWFsIHdpdGggdGhlIGhvb2tzLlxuICBmb3IgKGxldCBob29rIG9mIFtcbiAgICAnb25TdWJtaXRIb29rJyxcbiAgICAnb25QcmVTaWduVXBIb29rJyxcbiAgICAnb25Qb3N0U2lnblVwSG9vaycsXG4gIF0pIHtcbiAgICBpZiAob3B0aW9uc1tob29rXSkge1xuICAgICAgaWYgKHR5cGVvZiBvcHRpb25zW2hvb2tdICE9ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBBY2NvdW50cy51aS5jb25maWc6IFwiJHtob29rfVwiIG5vdCBhIGZ1bmN0aW9uYCk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgQWNjb3VudHMudWkuX29wdGlvbnNbaG9va10gPSBvcHRpb25zW2hvb2tdO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIERlYWwgd2l0aCBwYXR0ZXJuLlxuICBmb3IgKGxldCBob29rIG9mIFtcbiAgICAnZW1haWxQYXR0ZXJuJyxcbiAgXSkge1xuICAgIGlmIChvcHRpb25zW2hvb2tdKSB7XG4gICAgICBpZiAoIShvcHRpb25zW2hvb2tdIGluc3RhbmNlb2YgUmVnRXhwKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEFjY291bnRzLnVpLmNvbmZpZzogXCIke2hvb2t9XCIgbm90IGEgUmVndWxhciBFeHByZXNzaW9uYCk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgQWNjb3VudHMudWkuX29wdGlvbnNbaG9va10gPSBvcHRpb25zW2hvb2tdO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIGRlYWwgd2l0aCB0aGUgcGF0aHMuXG4gIGZvciAobGV0IHBhdGggb2YgW1xuICAgICdsb2dpblBhdGgnLFxuICAgICdzaWduVXBQYXRoJyxcbiAgICAncmVzZXRQYXNzd29yZFBhdGgnLFxuICAgICdwcm9maWxlUGF0aCcsXG4gICAgJ2NoYW5nZVBhc3N3b3JkUGF0aCcsXG4gICAgJ2hvbWVSb3V0ZVBhdGgnXG4gIF0pIHtcbiAgICBpZiAodHlwZW9mIG9wdGlvbnNbcGF0aF0gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBpZiAob3B0aW9uc1twYXRoXSAhPT0gbnVsbCAmJiB0eXBlb2Ygb3B0aW9uc1twYXRoXSAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBBY2NvdW50cy51aS5jb25maWc6ICR7cGF0aH0gaXMgbm90IGEgc3RyaW5nIG9yIG51bGxgKTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBBY2NvdW50cy51aS5fb3B0aW9uc1twYXRoXSA9IG9wdGlvbnNbcGF0aF07XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gZGVhbCB3aXRoIHJlZGlyZWN0IGhvb2tzLlxuICBmb3IgKGxldCBob29rIG9mIFtcbiAgICAgICdvbkVucm9sbEFjY291bnRIb29rJyxcbiAgICAgICdvblJlc2V0UGFzc3dvcmRIb29rJyxcbiAgICAgICdvblZlcmlmeUVtYWlsSG9vaycsXG4gICAgICAnb25TaWduZWRJbkhvb2snLFxuICAgICAgJ29uU2lnbmVkT3V0SG9vayddKSB7XG4gICAgaWYgKG9wdGlvbnNbaG9va10pIHtcbiAgICAgIGlmICh0eXBlb2Ygb3B0aW9uc1tob29rXSA9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIEFjY291bnRzLnVpLl9vcHRpb25zW2hvb2tdID0gb3B0aW9uc1tob29rXTtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKHR5cGVvZiBvcHRpb25zW2hvb2tdID09ICdzdHJpbmcnKSB7XG4gICAgICAgIEFjY291bnRzLnVpLl9vcHRpb25zW2hvb2tdID0gKCkgPT4gcmVkaXJlY3Qob3B0aW9uc1tob29rXSk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBBY2NvdW50cy51aS5jb25maWc6IFwiJHtob29rfVwiIG5vdCBhIGZ1bmN0aW9uIG9yIGFuIGFic29sdXRlIG9yIHJlbGF0aXZlIHBhdGhgKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBEZWFsIHdpdGggYGJyb3dzZXJIaXN0b3J5YFxuICBpZiAob3B0aW9ucy5icm93c2VySGlzdG9yeSkge1xuICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5icm93c2VySGlzdG9yeSAhPSAnb2JqZWN0Jykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBBY2NvdW50cy51aS5jb25maWc6IFwiYnJvd3Nlckhpc3RvcnlcIiBub3QgYW4gb2JqZWN0YCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgQWNjb3VudHMudWkuX29wdGlvbnMuYnJvd3Nlckhpc3RvcnkgPSBvcHRpb25zLmJyb3dzZXJIaXN0b3J5O1xuICAgIH1cbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgQWNjb3VudHM7XG4iLCJsZXQgYnJvd3Nlckhpc3RvcnlcbnRyeSB7IGJyb3dzZXJIaXN0b3J5ID0gcmVxdWlyZSgncmVhY3Qtcm91dGVyJykuYnJvd3Nlckhpc3RvcnkgfSBjYXRjaChlKSB7fVxuZXhwb3J0IGNvbnN0IGxvZ2luQnV0dG9uc1Nlc3Npb24gPSBBY2NvdW50cy5fbG9naW5CdXR0b25zU2Vzc2lvbjtcbmV4cG9ydCBjb25zdCBTVEFURVMgPSB7XG4gIFNJR05fSU46IFN5bWJvbCgnU0lHTl9JTicpLFxuICBTSUdOX1VQOiBTeW1ib2woJ1NJR05fVVAnKSxcbiAgUFJPRklMRTogU3ltYm9sKCdQUk9GSUxFJyksXG4gIFBBU1NXT1JEX0NIQU5HRTogU3ltYm9sKCdQQVNTV09SRF9DSEFOR0UnKSxcbiAgUEFTU1dPUkRfUkVTRVQ6IFN5bWJvbCgnUEFTU1dPUkRfUkVTRVQnKSxcbiAgRU5ST0xMX0FDQ09VTlQ6IFN5bWJvbCgnRU5ST0xMX0FDQ09VTlQnKVxufTtcblxuZXhwb3J0IGZ1bmN0aW9uIGdldExvZ2luU2VydmljZXMoKSB7XG4gIC8vIEZpcnN0IGxvb2sgZm9yIE9BdXRoIHNlcnZpY2VzLlxuICBjb25zdCBzZXJ2aWNlcyA9IFBhY2thZ2VbJ2FjY291bnRzLW9hdXRoJ10gPyBBY2NvdW50cy5vYXV0aC5zZXJ2aWNlTmFtZXMoKSA6IFtdO1xuXG4gIC8vIEJlIGVxdWFsbHkga2luZCB0byBhbGwgbG9naW4gc2VydmljZXMuIFRoaXMgYWxzbyBwcmVzZXJ2ZXNcbiAgLy8gYmFja3dhcmRzLWNvbXBhdGliaWxpdHkuXG4gIHNlcnZpY2VzLnNvcnQoKTtcblxuICByZXR1cm4gc2VydmljZXMubWFwKGZ1bmN0aW9uKG5hbWUpe1xuICAgIHJldHVybiB7bmFtZTogbmFtZX07XG4gIH0pO1xufTtcbi8vIEV4cG9ydCBnZXRMb2dpblNlcnZpY2VzIHVzaW5nIG9sZCBzdHlsZSBnbG9iYWxzIGZvciBhY2NvdW50cy1iYXNlIHdoaWNoXG4vLyByZXF1aXJlcyBpdC5cbnRoaXMuZ2V0TG9naW5TZXJ2aWNlcyA9IGdldExvZ2luU2VydmljZXM7XG5cbmV4cG9ydCBmdW5jdGlvbiBoYXNQYXNzd29yZFNlcnZpY2UoKSB7XG4gIC8vIEZpcnN0IGxvb2sgZm9yIE9BdXRoIHNlcnZpY2VzLlxuICByZXR1cm4gISFQYWNrYWdlWydhY2NvdW50cy1wYXNzd29yZCddO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIGxvZ2luUmVzdWx0Q2FsbGJhY2soc2VydmljZSwgZXJyKSB7XG4gIGlmICghZXJyKSB7XG5cbiAgfSBlbHNlIGlmIChlcnIgaW5zdGFuY2VvZiBBY2NvdW50cy5Mb2dpbkNhbmNlbGxlZEVycm9yKSB7XG4gICAgLy8gZG8gbm90aGluZ1xuICB9IGVsc2UgaWYgKGVyciBpbnN0YW5jZW9mIFNlcnZpY2VDb25maWd1cmF0aW9uLkNvbmZpZ0Vycm9yKSB7XG5cbiAgfSBlbHNlIHtcbiAgICAvL2xvZ2luQnV0dG9uc1Nlc3Npb24uZXJyb3JNZXNzYWdlKGVyci5yZWFzb24gfHwgXCJVbmtub3duIGVycm9yXCIpO1xuICB9XG5cbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIGlmICh0eXBlb2YgcmVkaXJlY3QgPT09ICdzdHJpbmcnKXtcbiAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy8nO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2Ygc2VydmljZSA9PT0gJ2Z1bmN0aW9uJyl7XG4gICAgICBzZXJ2aWNlKCk7XG4gICAgfVxuICB9XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gcGFzc3dvcmRTaWdudXBGaWVsZHMoKSB7XG4gIHJldHVybiBBY2NvdW50cy51aS5fb3B0aW9ucy5wYXNzd29yZFNpZ251cEZpZWxkcyB8fCBcIkVNQUlMX09OTFlfTk9fUEFTU1dPUkRcIjtcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZUVtYWlsKGVtYWlsLCBzaG93TWVzc2FnZSwgY2xlYXJNZXNzYWdlKSB7XG4gIGlmIChwYXNzd29yZFNpZ251cEZpZWxkcygpID09PSBcIlVTRVJOQU1FX0FORF9PUFRJT05BTF9FTUFJTFwiICYmIGVtYWlsID09PSAnJykge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIGlmIChBY2NvdW50cy51aS5fb3B0aW9ucy5lbWFpbFBhdHRlcm4udGVzdChlbWFpbCkpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBlbHNlIGlmICghZW1haWwgfHwgZW1haWwubGVuZ3RoID09PSAwKSB7XG4gICAgc2hvd01lc3NhZ2UoXCJlcnJvci5lbWFpbFJlcXVpcmVkXCIsICd3YXJuaW5nJywgZmFsc2UsICdlbWFpbCcpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfSBlbHNlIHtcbiAgICBzaG93TWVzc2FnZShcImVycm9yLmFjY291bnRzLkludmFsaWQgZW1haWxcIiwgJ3dhcm5pbmcnLCBmYWxzZSwgJ2VtYWlsJyk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZVBhc3N3b3JkKHBhc3N3b3JkID0gJycsIHNob3dNZXNzYWdlLCBjbGVhck1lc3NhZ2UsIGZpZWxkSWQgPSAncGFzc3dvcmQnKXtcbiAgaWYgKHBhc3N3b3JkLmxlbmd0aCA+PSBBY2NvdW50cy51aS5fb3B0aW9ucy5taW5pbXVtUGFzc3dvcmRMZW5ndGgpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBlbHNlIHtcbiAgICAvLyBjb25zdCBlcnJNc2cgPSBUOW4uZ2V0KFwiZXJyb3IubWluQ2hhclwiKS5yZXBsYWNlKC83LywgQWNjb3VudHMudWkuX29wdGlvbnMubWluaW11bVBhc3N3b3JkTGVuZ3RoKTtcbiAgICBjb25zdCBlcnJNc2cgPSBcImVycm9yLm1pbkNoYXJcIlxuICAgIHNob3dNZXNzYWdlKGVyck1zZywgJ3dhcm5pbmcnLCBmYWxzZSwgZmllbGRJZCk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVVc2VybmFtZSh1c2VybmFtZSwgc2hvd01lc3NhZ2UsIGNsZWFyTWVzc2FnZSwgZm9ybVN0YXRlKSB7XG4gIGlmICggdXNlcm5hbWUgKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0gZWxzZSB7XG4gICAgY29uc3QgZmllbGROYW1lID0gKHBhc3N3b3JkU2lnbnVwRmllbGRzKCkgPT09ICdVU0VSTkFNRV9PTkxZJyB8fCBmb3JtU3RhdGUgPT09IFNUQVRFUy5TSUdOX1VQKSA/ICd1c2VybmFtZScgOiAndXNlcm5hbWVPckVtYWlsJztcbiAgICBzaG93TWVzc2FnZShcImVycm9yLnVzZXJuYW1lUmVxdWlyZWRcIiwgJ3dhcm5pbmcnLCBmYWxzZSwgZmllbGROYW1lKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlZGlyZWN0KHJlZGlyZWN0KSB7XG4gIGlmIChNZXRlb3IuaXNDbGllbnQpIHtcbiAgICBpZiAod2luZG93Lmhpc3RvcnkpIHtcbiAgICAgIC8vIFJ1biBhZnRlciBhbGwgYXBwIHNwZWNpZmljIHJlZGlyZWN0cywgaS5lLiB0byB0aGUgbG9naW4gc2NyZWVuLlxuICAgICAgTWV0ZW9yLnNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBpZiAoUGFja2FnZVsna2FkaXJhOmZsb3ctcm91dGVyJ10pIHtcbiAgICAgICAgICBQYWNrYWdlWydrYWRpcmE6Zmxvdy1yb3V0ZXInXS5GbG93Um91dGVyLmdvKHJlZGlyZWN0KTtcbiAgICAgICAgfSBlbHNlIGlmIChQYWNrYWdlWydrYWRpcmE6Zmxvdy1yb3V0ZXItc3NyJ10pIHtcbiAgICAgICAgICBQYWNrYWdlWydrYWRpcmE6Zmxvdy1yb3V0ZXItc3NyJ10uRmxvd1JvdXRlci5nbyhyZWRpcmVjdCk7XG4gICAgICAgIH0gZWxzZSBpZiAoQWNjb3VudHMudWkuX29wdGlvbnMuYnJvd3Nlckhpc3RvcnkpIHtcbiAgICAgICAgICBBY2NvdW50cy51aS5fb3B0aW9ucy5icm93c2VySGlzdG9yeS5wdXNoKHJlZGlyZWN0KTtcbiAgICAgICAgfSBlbHNlIGlmIChicm93c2VySGlzdG9yeSkge1xuICAgICAgICAgIGJyb3dzZXJIaXN0b3J5LnB1c2gocmVkaXJlY3QpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZSgge30gLCAncmVkaXJlY3QnLCByZWRpcmVjdCApO1xuICAgICAgICB9XG4gICAgICB9LCAxMDApO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gY2FwaXRhbGl6ZShzdHJpbmcpIHtcbiAgcmV0dXJuIHN0cmluZy5yZXBsYWNlKC9cXC0vLCAnICcpLnNwbGl0KCcgJykubWFwKHdvcmQgPT4ge1xuICAgIHJldHVybiB3b3JkLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgd29yZC5zbGljZSgxKTtcbiAgfSkuam9pbignICcpO1xufVxuIiwiaW1wb3J0IHtBY2NvdW50c30gZnJvbSAnbWV0ZW9yL2FjY291bnRzLWJhc2UnO1xuaW1wb3J0IHtcbiAgU1RBVEVTLFxuICBsb2dpblJlc3VsdENhbGxiYWNrLFxuICBnZXRMb2dpblNlcnZpY2VzXG59IGZyb20gJy4vaGVscGVycy5qcyc7XG5cbmNvbnN0IFZBTElEX0tFWVMgPSBbXG4gICdkcm9wZG93blZpc2libGUnLFxuXG4gIC8vIFhYWCBjb25zaWRlciByZXBsYWNpbmcgdGhlc2Ugd2l0aCBvbmUga2V5IHRoYXQgaGFzIGFuIGVudW0gZm9yIHZhbHVlcy5cbiAgJ2luU2lnbnVwRmxvdycsXG4gICdpbkZvcmdvdFBhc3N3b3JkRmxvdycsXG4gICdpbkNoYW5nZVBhc3N3b3JkRmxvdycsXG4gICdpbk1lc3NhZ2VPbmx5RmxvdycsXG5cbiAgJ2Vycm9yTWVzc2FnZScsXG4gICdpbmZvTWVzc2FnZScsXG5cbiAgLy8gZGlhbG9ncyB3aXRoIG1lc3NhZ2VzIChpbmZvIGFuZCBlcnJvcilcbiAgJ3Jlc2V0UGFzc3dvcmRUb2tlbicsXG4gICdlbnJvbGxBY2NvdW50VG9rZW4nLFxuICAnanVzdFZlcmlmaWVkRW1haWwnLFxuICAnanVzdFJlc2V0UGFzc3dvcmQnLFxuXG4gICdjb25maWd1cmVMb2dpblNlcnZpY2VEaWFsb2dWaXNpYmxlJyxcbiAgJ2NvbmZpZ3VyZUxvZ2luU2VydmljZURpYWxvZ1NlcnZpY2VOYW1lJyxcbiAgJ2NvbmZpZ3VyZUxvZ2luU2VydmljZURpYWxvZ1NhdmVEaXNhYmxlZCcsXG4gICdjb25maWd1cmVPbkRlc2t0b3BWaXNpYmxlJ1xuXTtcblxuZXhwb3J0IGNvbnN0IHZhbGlkYXRlS2V5ID0gZnVuY3Rpb24gKGtleSkge1xuICBpZiAoIVZBTElEX0tFWVMuaW5jbHVkZXMoa2V5KSlcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGtleSBpbiBsb2dpbkJ1dHRvbnNTZXNzaW9uOiBcIiArIGtleSk7XG59O1xuXG5leHBvcnQgY29uc3QgS0VZX1BSRUZJWCA9IFwiTWV0ZW9yLmxvZ2luQnV0dG9ucy5cIjtcblxuLy8gWFhYIFRoaXMgc2hvdWxkIHByb2JhYmx5IGJlIHBhY2thZ2Ugc2NvcGUgcmF0aGVyIHRoYW4gZXhwb3J0ZWRcbi8vICh0aGVyZSB3YXMgZXZlbiBhIGNvbW1lbnQgdG8gdGhhdCBlZmZlY3QgaGVyZSBmcm9tIGJlZm9yZSB3ZSBoYWRcbi8vIG5hbWVzcGFjaW5nKSBidXQgYWNjb3VudHMtdWktdmlld2VyIHVzZXMgaXQsIHNvIGxlYXZlIGl0IGFzIGlzIGZvclxuLy8gbm93XG5BY2NvdW50cy5fbG9naW5CdXR0b25zU2Vzc2lvbiA9IHtcbiAgc2V0OiBmdW5jdGlvbihrZXksIHZhbHVlKSB7XG4gICAgdmFsaWRhdGVLZXkoa2V5KTtcbiAgICBpZiAoWydlcnJvck1lc3NhZ2UnLCAnaW5mb01lc3NhZ2UnXS5pbmNsdWRlcyhrZXkpKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRG9uJ3Qgc2V0IGVycm9yTWVzc2FnZSBvciBpbmZvTWVzc2FnZSBkaXJlY3RseS4gSW5zdGVhZCwgdXNlIGVycm9yTWVzc2FnZSgpIG9yIGluZm9NZXNzYWdlKCkuXCIpO1xuXG4gICAgdGhpcy5fc2V0KGtleSwgdmFsdWUpO1xuICB9LFxuXG4gIF9zZXQ6IGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgICBTZXNzaW9uLnNldChLRVlfUFJFRklYICsga2V5LCB2YWx1ZSk7XG4gIH0sXG5cbiAgZ2V0OiBmdW5jdGlvbihrZXkpIHtcbiAgICB2YWxpZGF0ZUtleShrZXkpO1xuICAgIHJldHVybiBTZXNzaW9uLmdldChLRVlfUFJFRklYICsga2V5KTtcbiAgfVxufTtcblxuaWYgKE1ldGVvci5pc0NsaWVudCl7XG4gIC8vIEluIHRoZSBsb2dpbiByZWRpcmVjdCBmbG93LCB3ZSdsbCBoYXZlIHRoZSByZXN1bHQgb2YgdGhlIGxvZ2luXG4gIC8vIGF0dGVtcHQgYXQgcGFnZSBsb2FkIHRpbWUgd2hlbiB3ZSdyZSByZWRpcmVjdGVkIGJhY2sgdG8gdGhlXG4gIC8vIGFwcGxpY2F0aW9uLiAgUmVnaXN0ZXIgYSBjYWxsYmFjayB0byB1cGRhdGUgdGhlIFVJIChpLmUuIHRvIGNsb3NlXG4gIC8vIHRoZSBkaWFsb2cgb24gYSBzdWNjZXNzZnVsIGxvZ2luIG9yIGRpc3BsYXkgdGhlIGVycm9yIG9uIGEgZmFpbGVkXG4gIC8vIGxvZ2luKS5cbiAgLy9cbiAgQWNjb3VudHMub25QYWdlTG9hZExvZ2luKGZ1bmN0aW9uIChhdHRlbXB0SW5mbykge1xuICAgIC8vIElnbm9yZSBpZiB3ZSBoYXZlIGEgbGVmdCBvdmVyIGxvZ2luIGF0dGVtcHQgZm9yIGEgc2VydmljZSB0aGF0IGlzIG5vIGxvbmdlciByZWdpc3RlcmVkLlxuICAgIGlmIChnZXRMb2dpblNlcnZpY2VzKCkubWFwKCh7IG5hbWUgfSkgPT4gbmFtZSkuaW5jbHVkZXMoYXR0ZW1wdEluZm8udHlwZSkpXG4gICAgICBsb2dpblJlc3VsdENhbGxiYWNrKGF0dGVtcHRJbmZvLnR5cGUsIGF0dGVtcHRJbmZvLmVycm9yKTtcbiAgfSk7XG5cbiAgbGV0IGRvbmVDYWxsYmFjaztcblxuICBBY2NvdW50cy5vblJlc2V0UGFzc3dvcmRMaW5rKGZ1bmN0aW9uICh0b2tlbiwgZG9uZSkge1xuICAgIEFjY291bnRzLl9sb2dpbkJ1dHRvbnNTZXNzaW9uLnNldCgncmVzZXRQYXNzd29yZFRva2VuJywgdG9rZW4pO1xuICAgIFNlc3Npb24uc2V0KEtFWV9QUkVGSVggKyAnc3RhdGUnLCAncmVzZXRQYXNzd29yZFRva2VuJyk7XG4gICAgZG9uZUNhbGxiYWNrID0gZG9uZTtcblxuICAgIEFjY291bnRzLnVpLl9vcHRpb25zLm9uUmVzZXRQYXNzd29yZEhvb2soKTtcbiAgfSk7XG5cbiAgQWNjb3VudHMub25FbnJvbGxtZW50TGluayhmdW5jdGlvbiAodG9rZW4sIGRvbmUpIHtcbiAgICBBY2NvdW50cy5fbG9naW5CdXR0b25zU2Vzc2lvbi5zZXQoJ2Vucm9sbEFjY291bnRUb2tlbicsIHRva2VuKTtcbiAgICBTZXNzaW9uLnNldChLRVlfUFJFRklYICsgJ3N0YXRlJywgJ2Vucm9sbEFjY291bnRUb2tlbicpO1xuICAgIGRvbmVDYWxsYmFjayA9IGRvbmU7XG5cbiAgICBBY2NvdW50cy51aS5fb3B0aW9ucy5vbkVucm9sbEFjY291bnRIb29rKCk7XG4gIH0pO1xuXG4gIEFjY291bnRzLm9uRW1haWxWZXJpZmljYXRpb25MaW5rKGZ1bmN0aW9uICh0b2tlbiwgZG9uZSkge1xuICAgIEFjY291bnRzLnZlcmlmeUVtYWlsKHRva2VuLCBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgIGlmICghIGVycm9yKSB7XG4gICAgICAgIEFjY291bnRzLl9sb2dpbkJ1dHRvbnNTZXNzaW9uLnNldCgnanVzdFZlcmlmaWVkRW1haWwnLCB0cnVlKTtcbiAgICAgICAgU2Vzc2lvbi5zZXQoS0VZX1BSRUZJWCArICdzdGF0ZScsICdqdXN0VmVyaWZpZWRFbWFpbCcpO1xuICAgICAgICBBY2NvdW50cy51aS5fb3B0aW9ucy5vblNpZ25lZEluSG9vaygpO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIEFjY291bnRzLnVpLl9vcHRpb25zLm9uVmVyaWZ5RW1haWxIb29rKCk7XG4gICAgICB9XG5cbiAgICAgIGRvbmUoKTtcbiAgICB9KTtcbiAgfSk7XG59XG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCB7IEFjY291bnRzIH0gZnJvbSAnbWV0ZW9yL2FjY291bnRzLWJhc2UnO1xuXG4vLy9cbi8vLyBMT0dJTiBXSVRIT1VUIFBBU1NXT1JEXG4vLy9cblxuLy8gTWV0aG9kIGNhbGxlZCBieSBhIHVzZXIgdG8gcmVxdWVzdCBhIHBhc3N3b3JkIHJlc2V0IGVtYWlsLiBUaGlzIGlzXG4vLyB0aGUgc3RhcnQgb2YgdGhlIHJlc2V0IHByb2Nlc3MuXG5NZXRlb3IubWV0aG9kcyh7XG4gIGxvZ2luV2l0aG91dFBhc3N3b3JkOiBmdW5jdGlvbiAoeyBlbWFpbCwgdXNlcm5hbWUgPSBudWxsIH0pIHtcbiAgICBpZiAodXNlcm5hbWUgIT09IG51bGwpIHtcbiAgICAgIGNoZWNrKHVzZXJuYW1lLCBTdHJpbmcpO1xuXG4gICAgICB2YXIgdXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lKHsgJG9yOiBbe1xuICAgICAgICAgIFwidXNlcm5hbWVcIjogdXNlcm5hbWUsIFwiZW1haWxzLmFkZHJlc3NcIjogeyAkZXhpc3RzOiAxIH1cbiAgICAgICAgfSwge1xuICAgICAgICAgIFwiZW1haWxzLmFkZHJlc3NcIjogZW1haWxcbiAgICAgICAgfV1cbiAgICAgIH0pO1xuICAgICAgaWYgKCF1c2VyKVxuICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMywgXCJVc2VyIG5vdCBmb3VuZFwiKTtcblxuICAgICAgZW1haWwgPSB1c2VyLmVtYWlsc1swXS5hZGRyZXNzO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGNoZWNrKGVtYWlsLCBTdHJpbmcpO1xuXG4gICAgICB2YXIgdXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lKHsgXCJlbWFpbHMuYWRkcmVzc1wiOiBlbWFpbCB9KTtcbiAgICAgIGlmICghdXNlcilcbiAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDMsIFwiVXNlciBub3QgZm91bmRcIik7XG4gICAgfVxuXG4gICAgaWYgKEFjY291bnRzLnVpLl9vcHRpb25zLnJlcXVpcmVFbWFpbFZlcmlmaWNhdGlvbikge1xuICAgICAgaWYgKCF1c2VyLmVtYWlsc1swXS52ZXJpZmllZCkge1xuICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMywgXCJFbWFpbCBub3QgdmVyaWZpZWRcIik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgQWNjb3VudHMuc2VuZExvZ2luRW1haWwodXNlci5faWQsIGVtYWlsKTtcbiAgfSxcbn0pO1xuXG4vKipcbiAqIEBzdW1tYXJ5IFNlbmQgYW4gZW1haWwgd2l0aCBhIGxpbmsgdGhlIHVzZXIgY2FuIHVzZSB2ZXJpZnkgdGhlaXIgZW1haWwgYWRkcmVzcy5cbiAqIEBsb2N1cyBTZXJ2ZXJcbiAqIEBwYXJhbSB7U3RyaW5nfSB1c2VySWQgVGhlIGlkIG9mIHRoZSB1c2VyIHRvIHNlbmQgZW1haWwgdG8uXG4gKiBAcGFyYW0ge1N0cmluZ30gW2VtYWlsXSBPcHRpb25hbC4gV2hpY2ggYWRkcmVzcyBvZiB0aGUgdXNlcidzIHRvIHNlbmQgdGhlIGVtYWlsIHRvLiBUaGlzIGFkZHJlc3MgbXVzdCBiZSBpbiB0aGUgdXNlcidzIGBlbWFpbHNgIGxpc3QuIERlZmF1bHRzIHRvIHRoZSBmaXJzdCB1bnZlcmlmaWVkIGVtYWlsIGluIHRoZSBsaXN0LlxuICovXG5BY2NvdW50cy5zZW5kTG9naW5FbWFpbCA9IGZ1bmN0aW9uICh1c2VySWQsIGFkZHJlc3MpIHtcbiAgLy8gWFhYIEFsc28gZ2VuZXJhdGUgYSBsaW5rIHVzaW5nIHdoaWNoIHNvbWVvbmUgY2FuIGRlbGV0ZSB0aGlzXG4gIC8vIGFjY291bnQgaWYgdGhleSBvd24gc2FpZCBhZGRyZXNzIGJ1dCB3ZXJlbid0IHRob3NlIHdobyBjcmVhdGVkXG4gIC8vIHRoaXMgYWNjb3VudC5cblxuICAvLyBNYWtlIHN1cmUgdGhlIHVzZXIgZXhpc3RzLCBhbmQgYWRkcmVzcyBpcyBvbmUgb2YgdGhlaXIgYWRkcmVzc2VzLlxuICB2YXIgdXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lKHVzZXJJZCk7XG4gIGlmICghdXNlcilcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW4ndCBmaW5kIHVzZXJcIik7XG4gIC8vIHBpY2sgdGhlIGZpcnN0IHVudmVyaWZpZWQgYWRkcmVzcyBpZiB3ZSB3ZXJlbid0IHBhc3NlZCBhbiBhZGRyZXNzLlxuICBpZiAoIWFkZHJlc3MpIHtcbiAgICB2YXIgZW1haWwgPSAodXNlci5lbWFpbHMgfHwgW10pLmZpbmQoKHsgdmVyaWZpZWQgfSkgPT4gIXZlcmlmaWVkKTtcbiAgICBhZGRyZXNzID0gKGVtYWlsIHx8IHt9KS5hZGRyZXNzO1xuICB9XG4gIC8vIG1ha2Ugc3VyZSB3ZSBoYXZlIGEgdmFsaWQgYWRkcmVzc1xuICBpZiAoIWFkZHJlc3MgfHwgISh1c2VyLmVtYWlscyB8fCBbXSkubWFwKCh7IGFkZHJlc3MgfSkgPT4gYWRkcmVzcykuaW5jbHVkZXMoYWRkcmVzcykpXG4gICAgdGhyb3cgbmV3IEVycm9yKFwiTm8gc3VjaCBlbWFpbCBhZGRyZXNzIGZvciB1c2VyLlwiKTtcblxuXG4gIHZhciB0b2tlblJlY29yZCA9IHtcbiAgICB0b2tlbjogUmFuZG9tLnNlY3JldCgpLFxuICAgIGFkZHJlc3M6IGFkZHJlc3MsXG4gICAgd2hlbjogbmV3IERhdGUoKX07XG4gIE1ldGVvci51c2Vycy51cGRhdGUoXG4gICAge19pZDogdXNlcklkfSxcbiAgICB7JHB1c2g6IHsnc2VydmljZXMuZW1haWwudmVyaWZpY2F0aW9uVG9rZW5zJzogdG9rZW5SZWNvcmR9fSk7XG5cbiAgLy8gYmVmb3JlIHBhc3NpbmcgdG8gdGVtcGxhdGUsIHVwZGF0ZSB1c2VyIG9iamVjdCB3aXRoIG5ldyB0b2tlblxuICBNZXRlb3IuX2Vuc3VyZSh1c2VyLCAnc2VydmljZXMnLCAnZW1haWwnKTtcbiAgaWYgKCF1c2VyLnNlcnZpY2VzLmVtYWlsLnZlcmlmaWNhdGlvblRva2Vucykge1xuICAgIHVzZXIuc2VydmljZXMuZW1haWwudmVyaWZpY2F0aW9uVG9rZW5zID0gW107XG4gIH1cbiAgdXNlci5zZXJ2aWNlcy5lbWFpbC52ZXJpZmljYXRpb25Ub2tlbnMucHVzaCh0b2tlblJlY29yZCk7XG5cbiAgdmFyIGxvZ2luVXJsID0gQWNjb3VudHMudXJscy52ZXJpZnlFbWFpbCh0b2tlblJlY29yZC50b2tlbik7XG5cbiAgdmFyIG9wdGlvbnMgPSB7XG4gICAgdG86IGFkZHJlc3MsXG4gICAgZnJvbTogQWNjb3VudHMuZW1haWxUZW1wbGF0ZXMubG9naW5Ob1Bhc3N3b3JkLmZyb21cbiAgICAgID8gQWNjb3VudHMuZW1haWxUZW1wbGF0ZXMubG9naW5Ob1Bhc3N3b3JkLmZyb20odXNlcilcbiAgICAgIDogQWNjb3VudHMuZW1haWxUZW1wbGF0ZXMuZnJvbSxcbiAgICBzdWJqZWN0OiBBY2NvdW50cy5lbWFpbFRlbXBsYXRlcy5sb2dpbk5vUGFzc3dvcmQuc3ViamVjdCh1c2VyKVxuICB9O1xuXG4gIGlmICh0eXBlb2YgQWNjb3VudHMuZW1haWxUZW1wbGF0ZXMubG9naW5Ob1Bhc3N3b3JkLnRleHQgPT09ICdmdW5jdGlvbicpIHtcbiAgICBvcHRpb25zLnRleHQgPVxuICAgICAgQWNjb3VudHMuZW1haWxUZW1wbGF0ZXMubG9naW5Ob1Bhc3N3b3JkLnRleHQodXNlciwgbG9naW5VcmwpO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBBY2NvdW50cy5lbWFpbFRlbXBsYXRlcy5sb2dpbk5vUGFzc3dvcmQuaHRtbCA9PT0gJ2Z1bmN0aW9uJylcbiAgICBvcHRpb25zLmh0bWwgPVxuICAgICAgQWNjb3VudHMuZW1haWxUZW1wbGF0ZXMubG9naW5Ob1Bhc3N3b3JkLmh0bWwodXNlciwgbG9naW5VcmwpO1xuXG4gIGlmICh0eXBlb2YgQWNjb3VudHMuZW1haWxUZW1wbGF0ZXMuaGVhZGVycyA9PT0gJ29iamVjdCcpIHtcbiAgICBvcHRpb25zLmhlYWRlcnMgPSBBY2NvdW50cy5lbWFpbFRlbXBsYXRlcy5oZWFkZXJzO1xuICB9XG5cbiAgRW1haWwuc2VuZChvcHRpb25zKTtcbn07XG5cbi8vIENoZWNrIGZvciBpbnN0YWxsZWQgYWNjb3VudHMtcGFzc3dvcmQgZGVwZW5kZW5jeS5cbmlmIChBY2NvdW50cy5lbWFpbFRlbXBsYXRlcykge1xuICBBY2NvdW50cy5lbWFpbFRlbXBsYXRlcy5sb2dpbk5vUGFzc3dvcmQgPSB7XG4gICAgc3ViamVjdDogZnVuY3Rpb24odXNlcikge1xuICAgICAgcmV0dXJuIFwiTG9naW4gb24gXCIgKyBBY2NvdW50cy5lbWFpbFRlbXBsYXRlcy5zaXRlTmFtZTtcbiAgICB9LFxuICAgIHRleHQ6IGZ1bmN0aW9uKHVzZXIsIHVybCkge1xuICAgICAgdmFyIGdyZWV0aW5nID0gKHVzZXIucHJvZmlsZSAmJiB1c2VyLnByb2ZpbGUubmFtZSkgP1xuICAgICAgICAgICAgKFwiSGVsbG8gXCIgKyB1c2VyLnByb2ZpbGUubmFtZSArIFwiLFwiKSA6IFwiSGVsbG8sXCI7XG4gICAgICByZXR1cm4gYCR7Z3JlZXRpbmd9XG5UbyBsb2dpbiwgc2ltcGx5IGNsaWNrIHRoZSBsaW5rIGJlbG93LlxuJHt1cmx9XG5UaGFua3MuXG5gO1xuICAgIH1cbiAgfTtcbn1cbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IHsgZ2V0TG9naW5TZXJ2aWNlcyB9IGZyb20gJy4uLy4uL2hlbHBlcnMuanMnO1xuXG5NZXRlb3IucHVibGlzaCgnc2VydmljZXNMaXN0JywgZnVuY3Rpb24oKSB7XG4gIGxldCBzZXJ2aWNlcyA9IGdldExvZ2luU2VydmljZXMoKTtcbiAgaWYgKFBhY2thZ2VbJ2FjY291bnRzLXBhc3N3b3JkJ10pIHtcbiAgICBzZXJ2aWNlcy5wdXNoKHtuYW1lOiAncGFzc3dvcmQnfSk7XG4gIH1cbiAgbGV0IGZpZWxkcyA9IHt9O1xuICAvLyBQdWJsaXNoIHRoZSBleGlzdGluZyBzZXJ2aWNlcyBmb3IgYSB1c2VyLCBvbmx5IG5hbWUgb3Igbm90aGluZyBlbHNlLlxuICBzZXJ2aWNlcy5mb3JFYWNoKHNlcnZpY2UgPT4gZmllbGRzW2BzZXJ2aWNlcy4ke3NlcnZpY2UubmFtZX0ubmFtZWBdID0gMSk7XG4gIHJldHVybiBNZXRlb3IudXNlcnMuZmluZCh7IF9pZDogdGhpcy51c2VySWQgfSwgeyBmaWVsZHM6IGZpZWxkc30pO1xufSk7XG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCB7IEFjY291bnRzIH0gZnJvbSAnbWV0ZW9yL2FjY291bnRzLWJhc2UnO1xuXG5sZXQgTGluaztcbnRyeSB7IExpbmsgPSByZXF1aXJlKCdyZWFjdC1yb3V0ZXInKS5MaW5rOyB9IGNhdGNoKGUpIHt9XG5cbmV4cG9ydCBjbGFzcyBCdXR0b24gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICByZW5kZXIgKCkge1xuICAgIGNvbnN0IHtcbiAgICAgIGxhYmVsLFxuICAgICAgaHJlZiA9IG51bGwsXG4gICAgICB0eXBlLFxuICAgICAgZGlzYWJsZWQgPSBmYWxzZSxcbiAgICAgIGNsYXNzTmFtZSxcbiAgICAgIG9uQ2xpY2tcbiAgICB9ID0gdGhpcy5wcm9wcztcbiAgICBpZiAodHlwZSA9PSAnbGluaycpIHtcbiAgICAgIC8vIFN1cHBvcnQgUmVhY3QgUm91dGVyLlxuICAgICAgaWYgKExpbmsgJiYgaHJlZikge1xuICAgICAgICByZXR1cm4gPExpbmsgdG89eyBocmVmIH3CoGNsYXNzTmFtZT17IGNsYXNzTmFtZSB9PnsgbGFiZWwgfTwvTGluaz47XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gPGHCoGhyZWY9eyBocmVmIH3CoGNsYXNzTmFtZT17IGNsYXNzTmFtZSB9IG9uQ2xpY2s9eyBvbkNsaWNrIH0+eyBsYWJlbCB9PC9hPjtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIDxidXR0b24gY2xhc3NOYW1lPXsgY2xhc3NOYW1lIH1cbiAgICAgICAgICAgICAgICAgICB0eXBlPXsgdHlwZSB9wqBcbiAgICAgICAgICAgICAgICAgICBkaXNhYmxlZD17IGRpc2FibGVkIH1cbiAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsgb25DbGljayB9PnsgbGFiZWwgfTwvYnV0dG9uPjtcbiAgfVxufVxuXG5CdXR0b24ucHJvcFR5cGVzID0ge1xuICBvbkNsaWNrOiBQcm9wVHlwZXMuZnVuY1xufTtcblxuQWNjb3VudHMudWkuQnV0dG9uID0gQnV0dG9uO1xuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCAnLi9CdXR0b24uanN4JztcbmltcG9ydCB7IEFjY291bnRzIH0gZnJvbSAnbWV0ZW9yL2FjY291bnRzLWJhc2UnO1xuXG5leHBvcnQgY2xhc3MgQnV0dG9ucyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHJlbmRlciAoKSB7XG4gICAgbGV0IHsgYnV0dG9ucyA9IHt9LCBjbGFzc05hbWUgPSBcImJ1dHRvbnNcIiB9ID0gdGhpcy5wcm9wcztcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9eyBjbGFzc05hbWUgfT5cbiAgICAgICAge09iamVjdC5rZXlzKGJ1dHRvbnMpLm1hcCgoaWQsIGkpID0+XG4gICAgICAgICAgPEFjY291bnRzLnVpLkJ1dHRvbiB7Li4uYnV0dG9uc1tpZF19IGtleT17aX0gLz5cbiAgICAgICAgKX1cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn07XG5cbkFjY291bnRzLnVpLkJ1dHRvbnMgPSBCdXR0b25zO1xuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgeyBBY2NvdW50cyB9IGZyb20gJ21ldGVvci9hY2NvdW50cy1iYXNlJztcblxuZXhwb3J0IGNsYXNzIEZpZWxkIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIG1vdW50OiB0cnVlXG4gICAgfTtcbiAgfVxuXG4gIHRyaWdnZXJVcGRhdGUoKSB7XG4gICAgLy8gVHJpZ2dlciBhbiBvbkNoYW5nZSBvbiBpbml0YWwgbG9hZCwgdG8gc3VwcG9ydCBicm93c2VyIHByZWZpbGxlZCB2YWx1ZXMuXG4gICAgY29uc3QgeyBvbkNoYW5nZSB9ID0gdGhpcy5wcm9wcztcbiAgICBpZiAodGhpcy5pbnB1dCAmJiBvbkNoYW5nZSkge1xuICAgICAgb25DaGFuZ2UoeyB0YXJnZXQ6IHsgdmFsdWU6IHRoaXMuaW5wdXQudmFsdWUgfHwgXCJcIiB9IH0pO1xuICAgIH1cbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIHRoaXMudHJpZ2dlclVwZGF0ZSgpO1xuICB9XG5cbiAgY29tcG9uZW50RGlkVXBkYXRlKHByZXZQcm9wcykge1xuICAgIC8vIFJlLW1vdW50IGNvbXBvbmVudCBzbyB0aGF0IHdlIGRvbid0IGV4cG9zZSBicm93c2VyIHByZWZpbGxlZCBwYXNzd29yZHMgaWYgdGhlIGNvbXBvbmVudCB3YXNcbiAgICAvLyBhIHBhc3N3b3JkIGJlZm9yZSBhbmQgbm93IHNvbWV0aGluZyBlbHNlLlxuICAgIGlmIChwcmV2UHJvcHMuaWQgIT09IHRoaXMucHJvcHMuaWQpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe21vdW50OiBmYWxzZX0pO1xuICAgIH1cbiAgICBlbHNlIGlmICghdGhpcy5zdGF0ZS5tb3VudCkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7bW91bnQ6IHRydWV9KTtcbiAgICAgIHRoaXMudHJpZ2dlclVwZGF0ZSgpO1xuICAgIH1cbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7XG4gICAgICBpZCxcbiAgICAgIGhpbnQsXG4gICAgICBsYWJlbCxcbiAgICAgIHR5cGUgPSAndGV4dCcsXG4gICAgICBvbkNoYW5nZSxcbiAgICAgIHJlcXVpcmVkID0gZmFsc2UsXG4gICAgICBjbGFzc05hbWUgPSBcImZpZWxkXCIsXG4gICAgICBkZWZhdWx0VmFsdWUgPSBcIlwiLFxuICAgICAgbWVzc2FnZSxcbiAgICB9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCB7IG1vdW50ID0gdHJ1ZSB9ID0gdGhpcy5zdGF0ZTtcbiAgICBpZiAodHlwZSA9PSAnbm90aWNlJykge1xuICAgICAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPXsgY2xhc3NOYW1lIH0+eyBsYWJlbCB9PC9kaXY+O1xuICAgIH1cbiAgICByZXR1cm4gbW91bnQgPyAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT17IGNsYXNzTmFtZSB9PlxuICAgICAgICA8bGFiZWwgaHRtbEZvcj17IGlkIH0+eyBsYWJlbCB9PC9sYWJlbD5cbiAgICAgICAgPGlucHV0XG4gICAgICAgICAgaWQ9eyBpZCB9XG4gICAgICAgICAgcmVmPXsgKHJlZikgPT4gdGhpcy5pbnB1dCA9IHJlZiB9XG4gICAgICAgICAgdHlwZT17IHR5cGUgfVxuICAgICAgICAgIG9uQ2hhbmdlPXsgb25DaGFuZ2UgfVxuICAgICAgICAgIHBsYWNlaG9sZGVyPXsgaGludCB9XG4gICAgICAgICAgZGVmYXVsdFZhbHVlPXsgZGVmYXVsdFZhbHVlIH1cbiAgICAgICAgLz5cbiAgICAgICAge21lc3NhZ2UgJiYgKFxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT17WydtZXNzYWdlJywgbWVzc2FnZS50eXBlXS5qb2luKCcgJykudHJpbSgpfT5cbiAgICAgICAgICAgIHttZXNzYWdlLm1lc3NhZ2V9PC9zcGFuPlxuICAgICAgICApfVxuICAgICAgPC9kaXY+XG4gICAgKSA6IG51bGw7XG4gIH1cbn1cblxuRmllbGQucHJvcFR5cGVzID0ge1xuICBvbkNoYW5nZTogUHJvcFR5cGVzLmZ1bmNcbn07XG5cbkFjY291bnRzLnVpLkZpZWxkID0gRmllbGQ7XG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgQWNjb3VudHMgfSBmcm9tICdtZXRlb3IvYWNjb3VudHMtYmFzZSc7XG5pbXBvcnQgJy4vRmllbGQuanN4JztcblxuZXhwb3J0IGNsYXNzIEZpZWxkcyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHJlbmRlciAoKSB7XG4gICAgbGV0IHsgZmllbGRzID0ge30sIGNsYXNzTmFtZSA9IFwiZmllbGRzXCIgfSA9IHRoaXMucHJvcHM7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPXsgY2xhc3NOYW1lIH0+XG4gICAgICAgIHtPYmplY3Qua2V5cyhmaWVsZHMpLm1hcCgoaWQsIGkpID0+XG4gICAgICAgICAgPEFjY291bnRzLnVpLkZpZWxkIHsuLi5maWVsZHNbaWRdfSBrZXk9e2l9IC8+XG4gICAgICAgICl9XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbkFjY291bnRzLnVpLkZpZWxkcyA9IEZpZWxkcztcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IFJlYWN0RE9NIGZyb20gJ3JlYWN0LWRvbSc7XG5pbXBvcnQgeyBBY2NvdW50cyB9IGZyb20gJ21ldGVvci9hY2NvdW50cy1iYXNlJztcblxuaW1wb3J0ICcuL0ZpZWxkcy5qc3gnO1xuaW1wb3J0ICcuL0J1dHRvbnMuanN4JztcbmltcG9ydCAnLi9Gb3JtTWVzc2FnZS5qc3gnO1xuaW1wb3J0ICcuL1Bhc3N3b3JkT3JTZXJ2aWNlLmpzeCc7XG5pbXBvcnQgJy4vU29jaWFsQnV0dG9ucy5qc3gnO1xuaW1wb3J0ICcuL0Zvcm1NZXNzYWdlcy5qc3gnO1xuXG5leHBvcnQgY2xhc3MgRm9ybSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIGxldCBmb3JtID0gdGhpcy5mb3JtO1xuICAgIGlmIChmb3JtKSB7XG4gICAgICBmb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsIChlKSA9PiB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7XG4gICAgICBoYXNQYXNzd29yZFNlcnZpY2UsXG4gICAgICBvYXV0aFNlcnZpY2VzLFxuICAgICAgZmllbGRzLFxuICAgICAgYnV0dG9ucyxcbiAgICAgIGVycm9yLFxuICAgICAgbWVzc2FnZXMsXG4gICAgICB0cmFuc2xhdGUsXG4gICAgICByZWFkeSA9IHRydWUsXG4gICAgICBjbGFzc05hbWVcbiAgICB9ID0gdGhpcy5wcm9wcztcbiAgICByZXR1cm4gKFxuICAgICAgPGZvcm1cbiAgICAgICAgcmVmPXsocmVmKSA9PiB0aGlzLmZvcm0gPSByZWZ9XG4gICAgICAgIGNsYXNzTmFtZT17W2NsYXNzTmFtZSwgcmVhZHkgPyBcInJlYWR5XCIgOiBudWxsXS5qb2luKCcgJyl9XG4gICAgICAgIGNsYXNzTmFtZT1cImFjY291bnRzLXVpXCJcbiAgICAgICAgbm9WYWxpZGF0ZVxuICAgICAgPlxuICAgICAgICA8QWNjb3VudHMudWkuRmllbGRzIGZpZWxkcz17IGZpZWxkcyB9IC8+XG4gICAgICAgIDxBY2NvdW50cy51aS5CdXR0b25zIGJ1dHRvbnM9eyBidXR0b25zIH0gLz5cbiAgICAgICAgPEFjY291bnRzLnVpLlBhc3N3b3JkT3JTZXJ2aWNlIG9hdXRoU2VydmljZXM9eyBvYXV0aFNlcnZpY2VzIH0gdHJhbnNsYXRlPXsgdHJhbnNsYXRlIH0gLz5cbiAgICAgICAgPEFjY291bnRzLnVpLlNvY2lhbEJ1dHRvbnMgb2F1dGhTZXJ2aWNlcz17IG9hdXRoU2VydmljZXMgfSAvPlxuICAgICAgICA8QWNjb3VudHMudWkuRm9ybU1lc3NhZ2VzIG1lc3NhZ2VzPXttZXNzYWdlc30gLz5cbiAgICAgIDwvZm9ybT5cbiAgICApO1xuICB9XG59XG5cbkZvcm0ucHJvcFR5cGVzID0ge1xuICBvYXV0aFNlcnZpY2VzOiBQcm9wVHlwZXMub2JqZWN0LFxuICBmaWVsZHM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgYnV0dG9uczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICB0cmFuc2xhdGU6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIGVycm9yOiBQcm9wVHlwZXMuc3RyaW5nLFxuICByZWFkeTogUHJvcFR5cGVzLmJvb2xcbn07XG5cbkFjY291bnRzLnVpLkZvcm0gPSBGb3JtO1xuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IEFjY291bnRzIH0gZnJvbSAnbWV0ZW9yL2FjY291bnRzLWJhc2UnO1xuXG5mdW5jdGlvbiBpc09iamVjdChvYmopIHtcbiAgcmV0dXJuIG9iaiA9PT0gT2JqZWN0KG9iaik7XG59XG5cbmV4cG9ydCBjbGFzcyBGb3JtTWVzc2FnZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHJlbmRlciAoKSB7XG4gICAgbGV0IHsgbWVzc2FnZSwgdHlwZSwgY2xhc3NOYW1lID0gXCJtZXNzYWdlXCIsIHN0eWxlID0ge30sIGRlcHJlY2F0ZWQgfSA9IHRoaXMucHJvcHM7XG4gICAgLy8gWFhYIENoZWNrIGZvciBkZXByZWNhdGlvbnMuXG4gICAgaWYgKGRlcHJlY2F0ZWQpIHtcbiAgICAgIC8vIEZvdW5kIGJhY2t3b3JkcyBjb21wYXRpYmlsaXR5IGlzc3VlLlxuICAgICAgY29uc29sZS53YXJuKCdZb3UgYXJlIG92ZXJyaWRpbmcgQWNjb3VudHMudWkuRm9ybSBhbmQgdXNpbmcgRm9ybU1lc3NhZ2UsIHRoZSB1c2Ugb2YgRm9ybU1lc3NhZ2UgaW4gRm9ybSBoYXMgYmVlbiBkZXByZWFjdGVkIGluIHYxLjIuMTEsIHVwZGF0ZSB5b3VyIGltcGxlbWVudGF0aW9uIHRvIHVzZSBGb3JtTWVzc2FnZXM6IGh0dHBzOi8vZ2l0aHViLmNvbS9zdHVkaW9pbnRlcmFjdC9hY2NvdW50cy11aS8jZGVwcmVjYXRpb25zJyk7XG4gICAgfVxuICAgIG1lc3NhZ2UgPSBpc09iamVjdChtZXNzYWdlKSA/IG1lc3NhZ2UubWVzc2FnZSA6IG1lc3NhZ2U7IC8vIElmIG1lc3NhZ2UgaXMgb2JqZWN0LCB0aGVuIHRyeSB0byBnZXQgbWVzc2FnZSBmcm9tIGl0XG4gICAgcmV0dXJuIG1lc3NhZ2UgPyAoXG4gICAgICA8ZGl2IHN0eWxlPXsgc3R5bGUgfcKgXG4gICAgICAgICAgIGNsYXNzTmFtZT17WyBjbGFzc05hbWUsIHR5cGUgXS5qb2luKCcgJyl9PnsgbWVzc2FnZSB9PC9kaXY+XG4gICAgKSA6IG51bGw7XG4gIH1cbn1cblxuQWNjb3VudHMudWkuRm9ybU1lc3NhZ2UgPSBGb3JtTWVzc2FnZTtcbiIsImltcG9ydCBSZWFjdCwge8KgQ29tcG9uZW50IH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgQWNjb3VudHMgfSBmcm9tICdtZXRlb3IvYWNjb3VudHMtYmFzZSc7XG5cbmV4cG9ydCBjbGFzcyBGb3JtTWVzc2FnZXMgZXh0ZW5kcyBDb21wb25lbnQge1xuICByZW5kZXIgKCkge1xuICAgIGNvbnN0IHsgbWVzc2FnZXMgPSBbXSwgY2xhc3NOYW1lID0gXCJtZXNzYWdlc1wiLCBzdHlsZSA9IHt9IH0gPSB0aGlzLnByb3BzO1xuICAgIHJldHVybiBtZXNzYWdlcy5sZW5ndGggPiAwICYmIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWVzc2FnZXNcIj5cbiAgICAgICAge21lc3NhZ2VzXG4gICAgICAgICAgLmZpbHRlcihtZXNzYWdlID0+ICEoJ2ZpZWxkJyBpbiBtZXNzYWdlKSlcbiAgICAgICAgICAubWFwKCh7wqBtZXNzYWdlLCB0eXBlIH0sIGkpID0+XG4gICAgICAgICAgPEFjY291bnRzLnVpLkZvcm1NZXNzYWdlXG4gICAgICAgICAgICBtZXNzYWdlPXttZXNzYWdlfVxuICAgICAgICAgICAgdHlwZT17dHlwZX1cbiAgICAgICAgICAgIGtleT17aX1cbiAgICAgICAgICAvPlxuICAgICAgICApfVxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5BY2NvdW50cy51aS5Gb3JtTWVzc2FnZXMgPSBGb3JtTWVzc2FnZXM7XG4iLCJpbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50IH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCB1dWlkIGZyb20gXCJ1dWlkXCI7XG5pbXBvcnQgeyB3aXRoVHJhY2tlciB9IGZyb20gJ21ldGVvci9yZWFjdC1tZXRlb3ItZGF0YSc7XG5pbXBvcnQgeyBBY2NvdW50cyB9IGZyb20gJ21ldGVvci9hY2NvdW50cy1iYXNlJztcbmltcG9ydCB7IFQ5biB9IGZyb20gJ21ldGVvci9zb2Z0d2FyZXJlcm86YWNjb3VudHMtdDluJztcbmltcG9ydCB7wqBLRVlfUFJFRklYIH0gZnJvbSAnLi4vLi4vbG9naW5fc2Vzc2lvbi5qcyc7XG5pbXBvcnQgJy4vRm9ybS5qc3gnO1xuXG5pbXBvcnQge1xuICBTVEFURVMsXG4gIHBhc3N3b3JkU2lnbnVwRmllbGRzLFxuICB2YWxpZGF0ZUVtYWlsLFxuICB2YWxpZGF0ZVBhc3N3b3JkLFxuICB2YWxpZGF0ZVVzZXJuYW1lLFxuICBsb2dpblJlc3VsdENhbGxiYWNrLFxuICBnZXRMb2dpblNlcnZpY2VzLFxuICBoYXNQYXNzd29yZFNlcnZpY2UsXG4gIGNhcGl0YWxpemVcbn0gZnJvbSAnLi4vLi4vaGVscGVycy5qcyc7XG5cbmZ1bmN0aW9uIGluZGV4QnkoYXJyYXksIGtleSkge1xuICBjb25zdCByZXN1bHQgPSB7fTtcbiAgYXJyYXkuZm9yRWFjaChmdW5jdGlvbihvYmopIHtcbiAgICByZXN1bHRbb2JqW2tleV1dID0gb2JqO1xuICB9KTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTG9naW5Gb3JtIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgbGV0IHtcbiAgICAgIGZvcm1TdGF0ZSxcbiAgICAgIGxvZ2luUGF0aCxcbiAgICAgIHNpZ25VcFBhdGgsXG4gICAgICByZXNldFBhc3N3b3JkUGF0aCxcbiAgICAgIHByb2ZpbGVQYXRoLFxuICAgICAgY2hhbmdlUGFzc3dvcmRQYXRoXG4gICAgfSA9IHByb3BzO1xuXG4gICAgaWYgKGZvcm1TdGF0ZSA9PT0gU1RBVEVTLlNJR05fSU4gJiYgUGFja2FnZVsnYWNjb3VudHMtcGFzc3dvcmQnXSkge1xuICAgICAgY29uc29sZS53YXJuKCdEbyBub3QgZm9yY2UgdGhlIHN0YXRlIHRvIFNJR05fSU4gb24gQWNjb3VudHMudWkuTG9naW5Gb3JtLCBpdCB3aWxsIG1ha2UgaXQgaW1wb3NzaWJsZSB0byByZXNldCBwYXNzd29yZCBpbiB5b3VyIGFwcCwgdGhpcyBzdGF0ZSBpcyBhbHNvIHRoZSBkZWZhdWx0IHN0YXRlIGlmIGxvZ2dlZCBvdXQsIHNvIG5vIG5lZWQgdG8gZm9yY2UgaXQuJyk7XG4gICAgfVxuXG4gICAgLy8gU2V0IGluaXRhbCBzdGF0ZS5cbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgbWVzc2FnZXM6IFtdLFxuICAgICAgd2FpdGluZzogdHJ1ZSxcbiAgICAgIGZvcm1TdGF0ZTogZm9ybVN0YXRlID8gZm9ybVN0YXRlIDogQWNjb3VudHMudXNlcigpID8gU1RBVEVTLlBST0ZJTEUgOiBTVEFURVMuU0lHTl9JTixcbiAgICAgIG9uU3VibWl0SG9vazogcHJvcHMub25TdWJtaXRIb29rIHx8IEFjY291bnRzLnVpLl9vcHRpb25zLm9uU3VibWl0SG9vayxcbiAgICAgIG9uU2lnbmVkSW5Ib29rOiBwcm9wcy5vblNpZ25lZEluSG9vayB8fCBBY2NvdW50cy51aS5fb3B0aW9ucy5vblNpZ25lZEluSG9vayxcbiAgICAgIG9uU2lnbmVkT3V0SG9vazogcHJvcHMub25TaWduZWRPdXRIb29rIHx8IEFjY291bnRzLnVpLl9vcHRpb25zLm9uU2lnbmVkT3V0SG9vayxcbiAgICAgIG9uUHJlU2lnblVwSG9vazogcHJvcHMub25QcmVTaWduVXBIb29rIHx8IEFjY291bnRzLnVpLl9vcHRpb25zLm9uUHJlU2lnblVwSG9vayxcbiAgICAgIG9uUG9zdFNpZ25VcEhvb2s6IHByb3BzLm9uUG9zdFNpZ25VcEhvb2sgfHwgQWNjb3VudHMudWkuX29wdGlvbnMub25Qb3N0U2lnblVwSG9vayxcbiAgICB9O1xuICAgIHRoaXMudHJhbnNsYXRlID0gdGhpcy50cmFuc2xhdGUuYmluZCh0aGlzKTtcbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIHRoaXMuc2V0U3RhdGUocHJldlN0YXRlID0+ICh7IHdhaXRpbmc6IGZhbHNlLCByZWFkeTogdHJ1ZSB9KSk7XG4gICAgbGV0IGNoYW5nZVN0YXRlID0gU2Vzc2lvbi5nZXQoS0VZX1BSRUZJWCArICdzdGF0ZScpO1xuICAgIHN3aXRjaCAoY2hhbmdlU3RhdGUpIHtcbiAgICAgIGNhc2UgJ2Vucm9sbEFjY291bnRUb2tlbic6XG4gICAgICAgIHRoaXMuc2V0U3RhdGUocHJldlN0YXRlID0+ICh7XG4gICAgICAgICAgZm9ybVN0YXRlOiBTVEFURVMuRU5ST0xMX0FDQ09VTlRcbiAgICAgICAgfSkpO1xuICAgICAgICBTZXNzaW9uLnNldChLRVlfUFJFRklYICsgJ3N0YXRlJywgbnVsbCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAncmVzZXRQYXNzd29yZFRva2VuJzpcbiAgICAgICAgdGhpcy5zZXRTdGF0ZShwcmV2U3RhdGUgPT4gKHtcbiAgICAgICAgICBmb3JtU3RhdGU6IFNUQVRFUy5QQVNTV09SRF9DSEFOR0VcbiAgICAgICAgfSkpO1xuICAgICAgICBTZXNzaW9uLnNldChLRVlfUFJFRklYICsgJ3N0YXRlJywgbnVsbCk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdqdXN0VmVyaWZpZWRFbWFpbCc6XG4gICAgICAgIHRoaXMuc2V0U3RhdGUocHJldlN0YXRlID0+ICh7XG4gICAgICAgICAgZm9ybVN0YXRlOiBTVEFURVMuUFJPRklMRVxuICAgICAgICB9KSk7XG4gICAgICAgIFNlc3Npb24uc2V0KEtFWV9QUkVGSVggKyAnc3RhdGUnLCBudWxsKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgLy8gQWRkIGRlZmF1bHQgZmllbGQgdmFsdWVzIG9uY2UgdGhlIGZvcm0gZGlkIG1vdW50IG9uIHRoZSBjbGllbnRcbiAgICB0aGlzLnNldFN0YXRlKHByZXZTdGF0ZSA9PiAoe1xuICAgICAgLi4uTG9naW5Gb3JtLmdldERlZmF1bHRGaWVsZFZhbHVlcygpLFxuICAgIH0pKTtcbiAgfVxuXG4gIHN0YXRpYyBnZXREZXJpdmVkU3RhdGVGcm9tUHJvcHMoeyBmb3JtU3RhdGUgfSwgeyBmb3JtU3RhdGU6IHN0YXRlRm9ybVN0YXRlIH0pIHtcbiAgICByZXR1cm4gKGZvcm1TdGF0ZSAmJiBmb3JtU3RhdGUgIT09IHN0YXRlRm9ybVN0YXRlKSA/XG4gICAgICAgIHtcbiAgICAgICAgICBmb3JtU3RhdGU6IGZvcm1TdGF0ZSxcbiAgICAgICAgICAuLi5Mb2dpbkZvcm0uZ2V0RGVmYXVsdEZpZWxkVmFsdWVzKCksXG4gICAgICAgIH1cbiAgICAgIDpcbiAgICAgICAgbnVsbDtcbiAgfVxuXG4gIGNvbXBvbmVudERpZFVwZGF0ZShwcmV2UHJvcHMsIHByZXZTdGF0ZSkge1xuICAgIGlmICghcHJldlByb3BzLnVzZXIgIT09ICF0aGlzLnByb3BzLnVzZXIpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBmb3JtU3RhdGU6IHRoaXMucHJvcHMudXNlciA/IFNUQVRFUy5QUk9GSUxFIDogU1RBVEVTLlNJR05fSU5cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHRyYW5zbGF0ZSh0ZXh0KSB7XG4gICAgLy8gaWYgKHRoaXMucHJvcHMudCkge1xuICAgIC8vICAgcmV0dXJuIHRoaXMucHJvcHMudCh0ZXh0KTtcbiAgICAvLyB9XG4gICAgcmV0dXJuIFQ5bi5nZXQodGV4dCk7XG4gIH1cblxuICB2YWxpZGF0ZUZpZWxkKGZpZWxkLCB2YWx1ZSwgZmllbGRJZCkge1xuICAgIGNvbnN0IHsgZm9ybVN0YXRlIH0gPSB0aGlzLnN0YXRlO1xuICAgIHN3aXRjaChmaWVsZCkge1xuICAgICAgY2FzZSAnZW1haWwnOlxuICAgICAgICByZXR1cm4gdmFsaWRhdGVFbWFpbCh2YWx1ZSxcbiAgICAgICAgICB0aGlzLnNob3dNZXNzYWdlLmJpbmQodGhpcyksXG4gICAgICAgICAgdGhpcy5jbGVhck1lc3NhZ2UuYmluZCh0aGlzKSxcbiAgICAgICAgKTtcbiAgICAgIGNhc2UgJ3Bhc3N3b3JkJzpcbiAgICAgICAgcmV0dXJuIHZhbGlkYXRlUGFzc3dvcmQodmFsdWUsXG4gICAgICAgICAgdGhpcy5zaG93TWVzc2FnZS5iaW5kKHRoaXMpLFxuICAgICAgICAgIHRoaXMuY2xlYXJNZXNzYWdlLmJpbmQodGhpcyksXG4gICAgICAgICAgZmllbGRJZFxuICAgICAgICApO1xuICAgICAgY2FzZSAndXNlcm5hbWUnOlxuICAgICAgICByZXR1cm4gdmFsaWRhdGVVc2VybmFtZSh2YWx1ZSxcbiAgICAgICAgICB0aGlzLnNob3dNZXNzYWdlLmJpbmQodGhpcyksXG4gICAgICAgICAgdGhpcy5jbGVhck1lc3NhZ2UuYmluZCh0aGlzKSxcbiAgICAgICAgICBmb3JtU3RhdGUsXG4gICAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgZ2V0VXNlcm5hbWVPckVtYWlsRmllbGQoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGlkOiAndXNlcm5hbWVPckVtYWlsJyxcbiAgICAgIGhpbnQ6IHRoaXMudHJhbnNsYXRlKCdlbnRlclVzZXJuYW1lT3JFbWFpbCcpLFxuICAgICAgbGFiZWw6IHRoaXMudHJhbnNsYXRlKCd1c2VybmFtZU9yRW1haWwnKSxcbiAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgZGVmYXVsdFZhbHVlOiB0aGlzLnN0YXRlLnVzZXJuYW1lIHx8IFwiXCIsXG4gICAgICBvbkNoYW5nZTogdGhpcy5oYW5kbGVDaGFuZ2UuYmluZCh0aGlzLCAndXNlcm5hbWVPckVtYWlsJyksXG4gICAgICBtZXNzYWdlOiB0aGlzLmdldE1lc3NhZ2VGb3JGaWVsZCgndXNlcm5hbWVPckVtYWlsJyksXG4gICAgfTtcbiAgfVxuXG4gIGdldFVzZXJuYW1lRmllbGQoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGlkOiAndXNlcm5hbWUnLFxuICAgICAgaGludDogdGhpcy50cmFuc2xhdGUoJ2VudGVyVXNlcm5hbWUnKSxcbiAgICAgIGxhYmVsOiB0aGlzLnRyYW5zbGF0ZSgndXNlcm5hbWUnKSxcbiAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgZGVmYXVsdFZhbHVlOiB0aGlzLnN0YXRlLnVzZXJuYW1lIHx8IFwiXCIsXG4gICAgICBvbkNoYW5nZTogdGhpcy5oYW5kbGVDaGFuZ2UuYmluZCh0aGlzLCAndXNlcm5hbWUnKSxcbiAgICAgIG1lc3NhZ2U6IHRoaXMuZ2V0TWVzc2FnZUZvckZpZWxkKCd1c2VybmFtZScpLFxuICAgIH07XG4gIH1cblxuICBnZXRFbWFpbEZpZWxkKCkge1xuICAgIHJldHVybiB7XG4gICAgICBpZDogJ2VtYWlsJyxcbiAgICAgIGhpbnQ6IHRoaXMudHJhbnNsYXRlKCdlbnRlckVtYWlsJyksXG4gICAgICBsYWJlbDogdGhpcy50cmFuc2xhdGUoJ2VtYWlsJyksXG4gICAgICB0eXBlOiAnZW1haWwnLFxuICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICBkZWZhdWx0VmFsdWU6IHRoaXMuc3RhdGUuZW1haWwgfHwgXCJcIixcbiAgICAgIG9uQ2hhbmdlOiB0aGlzLmhhbmRsZUNoYW5nZS5iaW5kKHRoaXMsICdlbWFpbCcpLFxuICAgICAgbWVzc2FnZTogdGhpcy5nZXRNZXNzYWdlRm9yRmllbGQoJ2VtYWlsJyksXG4gICAgfTtcbiAgfVxuXG4gIGdldFBhc3N3b3JkRmllbGQoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGlkOiAncGFzc3dvcmQnLFxuICAgICAgaGludDogdGhpcy50cmFuc2xhdGUoJ2VudGVyUGFzc3dvcmQnKSxcbiAgICAgIGxhYmVsOiB0aGlzLnRyYW5zbGF0ZSgncGFzc3dvcmQnKSxcbiAgICAgIHR5cGU6ICdwYXNzd29yZCcsXG4gICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgIGRlZmF1bHRWYWx1ZTogdGhpcy5zdGF0ZS5wYXNzd29yZCB8fCBcIlwiLFxuICAgICAgb25DaGFuZ2U6IHRoaXMuaGFuZGxlQ2hhbmdlLmJpbmQodGhpcywgJ3Bhc3N3b3JkJyksXG4gICAgICBtZXNzYWdlOiB0aGlzLmdldE1lc3NhZ2VGb3JGaWVsZCgncGFzc3dvcmQnKSxcbiAgICB9O1xuICB9XG5cbiAgZ2V0U2V0UGFzc3dvcmRGaWVsZCgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgaWQ6ICduZXdQYXNzd29yZCcsXG4gICAgICBoaW50OiB0aGlzLnRyYW5zbGF0ZSgnZW50ZXJQYXNzd29yZCcpLFxuICAgICAgbGFiZWw6IHRoaXMudHJhbnNsYXRlKCdjaG9vc2VQYXNzd29yZCcpLFxuICAgICAgdHlwZTogJ3Bhc3N3b3JkJyxcbiAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgb25DaGFuZ2U6IHRoaXMuaGFuZGxlQ2hhbmdlLmJpbmQodGhpcywgJ25ld1Bhc3N3b3JkJylcbiAgICB9O1xuICB9XG5cbiAgZ2V0TmV3UGFzc3dvcmRGaWVsZCgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgaWQ6ICduZXdQYXNzd29yZCcsXG4gICAgICBoaW50OiB0aGlzLnRyYW5zbGF0ZSgnZW50ZXJOZXdQYXNzd29yZCcpLFxuICAgICAgbGFiZWw6IHRoaXMudHJhbnNsYXRlKCduZXdQYXNzd29yZCcpLFxuICAgICAgdHlwZTogJ3Bhc3N3b3JkJyxcbiAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgb25DaGFuZ2U6IHRoaXMuaGFuZGxlQ2hhbmdlLmJpbmQodGhpcywgJ25ld1Bhc3N3b3JkJyksXG4gICAgICBtZXNzYWdlOiB0aGlzLmdldE1lc3NhZ2VGb3JGaWVsZCgnbmV3UGFzc3dvcmQnKSxcbiAgICB9O1xuICB9XG5cbiAgaGFuZGxlQ2hhbmdlKGZpZWxkLCBldnQpIHtcbiAgICBsZXQgdmFsdWUgPSBldnQudGFyZ2V0LnZhbHVlO1xuICAgIHN3aXRjaCAoZmllbGQpIHtcbiAgICAgIGNhc2UgJ3Bhc3N3b3JkJzogYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB2YWx1ZSA9IHZhbHVlLnRyaW0oKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIHRoaXMuc2V0U3RhdGUoeyBbZmllbGRdOiB2YWx1ZSB9KTtcbiAgICBMb2dpbkZvcm0uc2V0RGVmYXVsdEZpZWxkVmFsdWVzKHvCoFtmaWVsZF06IHZhbHVlIH0pO1xuICB9XG5cbiAgZmllbGRzKCkge1xuICAgIGNvbnN0IGxvZ2luRmllbGRzID0gW107XG4gICAgY29uc3QgeyBmb3JtU3RhdGUgfSA9IHRoaXMuc3RhdGU7XG5cbiAgICBpZiAoIWhhc1Bhc3N3b3JkU2VydmljZSgpICYmIGdldExvZ2luU2VydmljZXMoKS5sZW5ndGggPT0gMCkge1xuICAgICAgbG9naW5GaWVsZHMucHVzaCh7XG4gICAgICAgIGxhYmVsOiAnTm8gbG9naW4gc2VydmljZSBhZGRlZCwgaS5lLiBhY2NvdW50cy1wYXNzd29yZCcsXG4gICAgICAgIHR5cGU6ICdub3RpY2UnXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAoaGFzUGFzc3dvcmRTZXJ2aWNlKCkgJiYgZm9ybVN0YXRlID09IFNUQVRFUy5TSUdOX0lOKSB7XG4gICAgICBpZiAoW1xuICAgICAgICBcIlVTRVJOQU1FX0FORF9FTUFJTFwiLFxuICAgICAgICBcIlVTRVJOQU1FX0FORF9PUFRJT05BTF9FTUFJTFwiLFxuICAgICAgICBcIlVTRVJOQU1FX0FORF9FTUFJTF9OT19QQVNTV09SRFwiXG4gICAgICBdLmluY2x1ZGVzKHBhc3N3b3JkU2lnbnVwRmllbGRzKCkpKSB7XG4gICAgICAgIGxvZ2luRmllbGRzLnB1c2godGhpcy5nZXRVc2VybmFtZU9yRW1haWxGaWVsZCgpKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHBhc3N3b3JkU2lnbnVwRmllbGRzKCkgPT09IFwiVVNFUk5BTUVfT05MWVwiKSB7XG4gICAgICAgIGxvZ2luRmllbGRzLnB1c2godGhpcy5nZXRVc2VybmFtZUZpZWxkKCkpO1xuICAgICAgfVxuXG4gICAgICBpZiAoW1xuICAgICAgICBcIkVNQUlMX09OTFlcIixcbiAgICAgICAgXCJFTUFJTF9PTkxZX05PX1BBU1NXT1JEXCJcbiAgICAgIF0uaW5jbHVkZXMocGFzc3dvcmRTaWdudXBGaWVsZHMoKSkpIHtcbiAgICAgICAgbG9naW5GaWVsZHMucHVzaCh0aGlzLmdldEVtYWlsRmllbGQoKSk7XG4gICAgICB9XG5cbiAgICAgIGlmICghW1xuICAgICAgICBcIkVNQUlMX09OTFlfTk9fUEFTU1dPUkRcIixcbiAgICAgICAgXCJVU0VSTkFNRV9BTkRfRU1BSUxfTk9fUEFTU1dPUkRcIlxuICAgICAgXS5pbmNsdWRlcyhwYXNzd29yZFNpZ251cEZpZWxkcygpKSkge1xuICAgICAgICBsb2dpbkZpZWxkcy5wdXNoKHRoaXMuZ2V0UGFzc3dvcmRGaWVsZCgpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoaGFzUGFzc3dvcmRTZXJ2aWNlKCkgJiYgZm9ybVN0YXRlID09IFNUQVRFUy5TSUdOX1VQKSB7XG4gICAgICBpZiAoW1xuICAgICAgICBcIlVTRVJOQU1FX0FORF9FTUFJTFwiLFxuICAgICAgICBcIlVTRVJOQU1FX0FORF9PUFRJT05BTF9FTUFJTFwiLFxuICAgICAgICBcIlVTRVJOQU1FX09OTFlcIixcbiAgICAgICAgXCJVU0VSTkFNRV9BTkRfRU1BSUxfTk9fUEFTU1dPUkRcIlxuICAgICAgXS5pbmNsdWRlcyhwYXNzd29yZFNpZ251cEZpZWxkcygpKSkge1xuICAgICAgICBsb2dpbkZpZWxkcy5wdXNoKHRoaXMuZ2V0VXNlcm5hbWVGaWVsZCgpKTtcbiAgICAgIH1cblxuICAgICAgaWYgKFtcbiAgICAgICAgXCJVU0VSTkFNRV9BTkRfRU1BSUxcIixcbiAgICAgICAgXCJFTUFJTF9PTkxZXCIsXG4gICAgICAgIFwiRU1BSUxfT05MWV9OT19QQVNTV09SRFwiLFxuICAgICAgICBcIlVTRVJOQU1FX0FORF9FTUFJTF9OT19QQVNTV09SRFwiXG4gICAgICBdLmluY2x1ZGVzKHBhc3N3b3JkU2lnbnVwRmllbGRzKCkpKSB7XG4gICAgICAgIGxvZ2luRmllbGRzLnB1c2godGhpcy5nZXRFbWFpbEZpZWxkKCkpO1xuICAgICAgfVxuXG4gICAgICBpZiAoW1wiVVNFUk5BTUVfQU5EX09QVElPTkFMX0VNQUlMXCJdLmluY2x1ZGVzKHBhc3N3b3JkU2lnbnVwRmllbGRzKCkpKSB7XG4gICAgICAgIGxvZ2luRmllbGRzLnB1c2goT2JqZWN0LmFzc2lnbih0aGlzLmdldEVtYWlsRmllbGQoKSwge3JlcXVpcmVkOiBmYWxzZX0pKTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFbXG4gICAgICAgIFwiRU1BSUxfT05MWV9OT19QQVNTV09SRFwiLFxuICAgICAgICBcIlVTRVJOQU1FX0FORF9FTUFJTF9OT19QQVNTV09SRFwiXG4gICAgICBdLmluY2x1ZGVzKHBhc3N3b3JkU2lnbnVwRmllbGRzKCkpKSB7XG4gICAgICAgIGxvZ2luRmllbGRzLnB1c2godGhpcy5nZXRQYXNzd29yZEZpZWxkKCkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChmb3JtU3RhdGUgPT0gU1RBVEVTLlBBU1NXT1JEX1JFU0VUKSB7XG4gICAgICBsb2dpbkZpZWxkcy5wdXNoKHRoaXMuZ2V0RW1haWxGaWVsZCgpKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5zaG93UGFzc3dvcmRDaGFuZ2VGb3JtKCkpIHtcbiAgICAgIGlmIChNZXRlb3IuaXNDbGllbnQgJiYgIUFjY291bnRzLl9sb2dpbkJ1dHRvbnNTZXNzaW9uLmdldCgncmVzZXRQYXNzd29yZFRva2VuJykpIHtcbiAgICAgICAgbG9naW5GaWVsZHMucHVzaCh0aGlzLmdldFBhc3N3b3JkRmllbGQoKSk7XG4gICAgICB9XG4gICAgICBsb2dpbkZpZWxkcy5wdXNoKHRoaXMuZ2V0TmV3UGFzc3dvcmRGaWVsZCgpKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5zaG93RW5yb2xsQWNjb3VudEZvcm0oKSkge1xuICAgICAgbG9naW5GaWVsZHMucHVzaCh0aGlzLmdldFNldFBhc3N3b3JkRmllbGQoKSk7XG4gICAgfVxuICAgIHJldHVybiBpbmRleEJ5KGxvZ2luRmllbGRzLCAnaWQnKTtcbiAgfVxuXG4gIGJ1dHRvbnMoKSB7XG4gICAgY29uc3Qge1xuICAgICAgbG9naW5QYXRoID0gQWNjb3VudHMudWkuX29wdGlvbnMubG9naW5QYXRoLFxuICAgICAgc2lnblVwUGF0aCA9IEFjY291bnRzLnVpLl9vcHRpb25zLnNpZ25VcFBhdGgsXG4gICAgICByZXNldFBhc3N3b3JkUGF0aCA9IEFjY291bnRzLnVpLl9vcHRpb25zLnJlc2V0UGFzc3dvcmRQYXRoLFxuICAgICAgY2hhbmdlUGFzc3dvcmRQYXRoID0gQWNjb3VudHMudWkuX29wdGlvbnMuY2hhbmdlUGFzc3dvcmRQYXRoLFxuICAgICAgcHJvZmlsZVBhdGggPSBBY2NvdW50cy51aS5fb3B0aW9ucy5wcm9maWxlUGF0aCxcbiAgICB9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCB7IHVzZXIgfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3QgeyBmb3JtU3RhdGUsIHdhaXRpbmcgfSA9IHRoaXMuc3RhdGU7XG4gICAgbGV0IGxvZ2luQnV0dG9ucyA9IFtdO1xuXG4gICAgaWYgKHVzZXIgJiYgZm9ybVN0YXRlID09IFNUQVRFUy5QUk9GSUxFKSB7XG4gICAgICBsb2dpbkJ1dHRvbnMucHVzaCh7XG4gICAgICAgIGlkOiAnc2lnbk91dCcsXG4gICAgICAgIGxhYmVsOiB0aGlzLnRyYW5zbGF0ZSgnc2lnbk91dCcpLFxuICAgICAgICBkaXNhYmxlZDogd2FpdGluZyxcbiAgICAgICAgb25DbGljazogdGhpcy5zaWduT3V0LmJpbmQodGhpcylcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnNob3dDcmVhdGVBY2NvdW50TGluaygpKSB7XG4gICAgICBsb2dpbkJ1dHRvbnMucHVzaCh7XG4gICAgICAgIGlkOiAnc3dpdGNoVG9TaWduVXAnLFxuICAgICAgICBsYWJlbDogdGhpcy50cmFuc2xhdGUoJ3NpZ25VcCcpLFxuICAgICAgICB0eXBlOiAnbGluaycsXG4gICAgICAgIGhyZWY6IHNpZ25VcFBhdGgsXG4gICAgICAgIG9uQ2xpY2s6IHRoaXMuc3dpdGNoVG9TaWduVXAuYmluZCh0aGlzKVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKGZvcm1TdGF0ZSA9PSBTVEFURVMuU0lHTl9VUCB8fCBmb3JtU3RhdGUgPT0gU1RBVEVTLlBBU1NXT1JEX1JFU0VUKSB7XG4gICAgICBsb2dpbkJ1dHRvbnMucHVzaCh7XG4gICAgICAgIGlkOiAnc3dpdGNoVG9TaWduSW4nLFxuICAgICAgICBsYWJlbDogdGhpcy50cmFuc2xhdGUoJ3NpZ25JbicpLFxuICAgICAgICB0eXBlOiAnbGluaycsXG4gICAgICAgIGhyZWY6IGxvZ2luUGF0aCxcbiAgICAgICAgb25DbGljazogdGhpcy5zd2l0Y2hUb1NpZ25Jbi5iaW5kKHRoaXMpXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5zaG93Rm9yZ290UGFzc3dvcmRMaW5rKCkpIHtcbiAgICAgIGxvZ2luQnV0dG9ucy5wdXNoKHtcbiAgICAgICAgaWQ6ICdzd2l0Y2hUb1Bhc3N3b3JkUmVzZXQnLFxuICAgICAgICBsYWJlbDogdGhpcy50cmFuc2xhdGUoJ2ZvcmdvdFBhc3N3b3JkJyksXG4gICAgICAgIHR5cGU6ICdsaW5rJyxcbiAgICAgICAgaHJlZjogcmVzZXRQYXNzd29yZFBhdGgsXG4gICAgICAgIG9uQ2xpY2s6IHRoaXMuc3dpdGNoVG9QYXNzd29yZFJlc2V0LmJpbmQodGhpcylcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmICh1c2VyICYmICFbXG4gICAgICAgIFwiRU1BSUxfT05MWV9OT19QQVNTV09SRFwiLFxuICAgICAgICBcIlVTRVJOQU1FX0FORF9FTUFJTF9OT19QQVNTV09SRFwiXG4gICAgICBdLmluY2x1ZGVzKHBhc3N3b3JkU2lnbnVwRmllbGRzKCkpXG4gICAgICAmJiBmb3JtU3RhdGUgPT0gU1RBVEVTLlBST0ZJTEVcbiAgICAgICYmICh1c2VyLnNlcnZpY2VzICYmICdwYXNzd29yZCcgaW4gdXNlci5zZXJ2aWNlcykpIHtcbiAgICAgIGxvZ2luQnV0dG9ucy5wdXNoKHtcbiAgICAgICAgaWQ6ICdzd2l0Y2hUb0NoYW5nZVBhc3N3b3JkJyxcbiAgICAgICAgbGFiZWw6IHRoaXMudHJhbnNsYXRlKCdjaGFuZ2VQYXNzd29yZCcpLFxuICAgICAgICB0eXBlOiAnbGluaycsXG4gICAgICAgIGhyZWY6IGNoYW5nZVBhc3N3b3JkUGF0aCxcbiAgICAgICAgb25DbGljazogdGhpcy5zd2l0Y2hUb0NoYW5nZVBhc3N3b3JkLmJpbmQodGhpcylcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmIChmb3JtU3RhdGUgPT0gU1RBVEVTLlNJR05fVVApIHtcbiAgICAgIGxvZ2luQnV0dG9ucy5wdXNoKHtcbiAgICAgICAgaWQ6ICdzaWduVXAnLFxuICAgICAgICBsYWJlbDogdGhpcy50cmFuc2xhdGUoJ3NpZ25VcCcpLFxuICAgICAgICB0eXBlOiBoYXNQYXNzd29yZFNlcnZpY2UoKSA/ICdzdWJtaXQnIDogJ2xpbmsnLFxuICAgICAgICBjbGFzc05hbWU6ICdhY3RpdmUnLFxuICAgICAgICBkaXNhYmxlZDogd2FpdGluZyxcbiAgICAgICAgb25DbGljazogaGFzUGFzc3dvcmRTZXJ2aWNlKCkgPyB0aGlzLnNpZ25VcC5iaW5kKHRoaXMsIHt9KSA6IG51bGxcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnNob3dTaWduSW5MaW5rKCkpIHtcbiAgICAgIGxvZ2luQnV0dG9ucy5wdXNoKHtcbiAgICAgICAgaWQ6ICdzaWduSW4nLFxuICAgICAgICBsYWJlbDogdGhpcy50cmFuc2xhdGUoJ3NpZ25JbicpLFxuICAgICAgICB0eXBlOiBoYXNQYXNzd29yZFNlcnZpY2UoKSA/ICdzdWJtaXQnIDogJ2xpbmsnLFxuICAgICAgICBjbGFzc05hbWU6ICdhY3RpdmUnLFxuICAgICAgICBkaXNhYmxlZDogd2FpdGluZyxcbiAgICAgICAgb25DbGljazogaGFzUGFzc3dvcmRTZXJ2aWNlKCkgPyB0aGlzLnNpZ25Jbi5iaW5kKHRoaXMpIDogbnVsbFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKGZvcm1TdGF0ZSA9PSBTVEFURVMuUEFTU1dPUkRfUkVTRVQpIHtcbiAgICAgIGxvZ2luQnV0dG9ucy5wdXNoKHtcbiAgICAgICAgaWQ6ICdlbWFpbFJlc2V0TGluaycsXG4gICAgICAgIGxhYmVsOiB0aGlzLnRyYW5zbGF0ZSgncmVzZXRZb3VyUGFzc3dvcmQnKSxcbiAgICAgICAgdHlwZTogJ3N1Ym1pdCcsXG4gICAgICAgIGRpc2FibGVkOiB3YWl0aW5nLFxuICAgICAgICBvbkNsaWNrOiB0aGlzLnBhc3N3b3JkUmVzZXQuYmluZCh0aGlzKVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuc2hvd1Bhc3N3b3JkQ2hhbmdlRm9ybSgpIHx8IHRoaXMuc2hvd0Vucm9sbEFjY291bnRGb3JtKCkpIHtcbiAgICAgIGxvZ2luQnV0dG9ucy5wdXNoKHtcbiAgICAgICAgaWQ6ICdjaGFuZ2VQYXNzd29yZCcsXG4gICAgICAgIGxhYmVsOiAodGhpcy5zaG93UGFzc3dvcmRDaGFuZ2VGb3JtKCkgPyB0aGlzLnRyYW5zbGF0ZSgnY2hhbmdlUGFzc3dvcmQnKSA6IHRoaXMudHJhbnNsYXRlKCdzZXRQYXNzd29yZCcpKSxcbiAgICAgICAgdHlwZTogJ3N1Ym1pdCcsXG4gICAgICAgIGRpc2FibGVkOiB3YWl0aW5nLFxuICAgICAgICBvbkNsaWNrOiB0aGlzLnBhc3N3b3JkQ2hhbmdlLmJpbmQodGhpcylcbiAgICAgIH0pO1xuXG4gICAgICBpZiAoQWNjb3VudHMudXNlcigpKSB7XG4gICAgICAgIGxvZ2luQnV0dG9ucy5wdXNoKHtcbiAgICAgICAgICBpZDogJ3N3aXRjaFRvU2lnbk91dCcsXG4gICAgICAgICAgbGFiZWw6IHRoaXMudHJhbnNsYXRlKCdjYW5jZWwnKSxcbiAgICAgICAgICB0eXBlOiAnbGluaycsXG4gICAgICAgICAgaHJlZjogcHJvZmlsZVBhdGgsXG4gICAgICAgICAgb25DbGljazogdGhpcy5zd2l0Y2hUb1NpZ25PdXQuYmluZCh0aGlzKVxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxvZ2luQnV0dG9ucy5wdXNoKHtcbiAgICAgICAgICBpZDogJ2NhbmNlbFJlc2V0UGFzc3dvcmQnLFxuICAgICAgICAgIGxhYmVsOiB0aGlzLnRyYW5zbGF0ZSgnY2FuY2VsJyksXG4gICAgICAgICAgdHlwZTogJ2xpbmsnLFxuICAgICAgICAgIG9uQ2xpY2s6IHRoaXMuY2FuY2VsUmVzZXRQYXNzd29yZC5iaW5kKHRoaXMpLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBTb3J0IHRoZSBidXR0b24gYXJyYXkgc28gdGhhdCB0aGUgc3VibWl0IGJ1dHRvbiBhbHdheXMgY29tZXMgZmlyc3QsIGFuZFxuICAgIC8vIGJ1dHRvbnMgc2hvdWxkIGFsc28gY29tZSBiZWZvcmUgbGlua3MuXG4gICAgbG9naW5CdXR0b25zLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIGIudHlwZSA9PSAnc3VibWl0JyAmJlxuICAgICAgICBhLnR5cGUgIT0gdW5kZWZpbmVkKSAtIChcbiAgICAgICAgICBhLnR5cGUgPT0gJ3N1Ym1pdCcgJiZcbiAgICAgICAgICBiLnR5cGUgIT0gdW5kZWZpbmVkKTtcbiAgICB9KTtcblxuICAgIHJldHVybiBpbmRleEJ5KGxvZ2luQnV0dG9ucywgJ2lkJyk7XG4gIH1cblxuICBzaG93U2lnbkluTGluaygpe1xuICAgIHJldHVybiB0aGlzLnN0YXRlLmZvcm1TdGF0ZSA9PSBTVEFURVMuU0lHTl9JTiAmJiBQYWNrYWdlWydhY2NvdW50cy1wYXNzd29yZCddO1xuICB9XG5cbiAgc2hvd1Bhc3N3b3JkQ2hhbmdlRm9ybSgpIHtcbiAgICByZXR1cm4oUGFja2FnZVsnYWNjb3VudHMtcGFzc3dvcmQnXVxuICAgICAgJiYgdGhpcy5zdGF0ZS5mb3JtU3RhdGUgPT0gU1RBVEVTLlBBU1NXT1JEX0NIQU5HRSk7XG4gIH1cblxuICBzaG93RW5yb2xsQWNjb3VudEZvcm0oKSB7XG4gICAgcmV0dXJuKFBhY2thZ2VbJ2FjY291bnRzLXBhc3N3b3JkJ11cbiAgICAgICYmIHRoaXMuc3RhdGUuZm9ybVN0YXRlID09IFNUQVRFUy5FTlJPTExfQUNDT1VOVCk7XG4gIH1cblxuICBzaG93Q3JlYXRlQWNjb3VudExpbmsoKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhdGUuZm9ybVN0YXRlID09IFNUQVRFUy5TSUdOX0lOICYmICFBY2NvdW50cy5fb3B0aW9ucy5mb3JiaWRDbGllbnRBY2NvdW50Q3JlYXRpb24gJiYgUGFja2FnZVsnYWNjb3VudHMtcGFzc3dvcmQnXTtcbiAgfVxuXG4gIHNob3dGb3Jnb3RQYXNzd29yZExpbmsoKSB7XG4gICAgcmV0dXJuICF0aGlzLnByb3BzLnVzZXJcbiAgICAgICYmIHRoaXMuc3RhdGUuZm9ybVN0YXRlID09IFNUQVRFUy5TSUdOX0lOXG4gICAgICAmJiBbXCJVU0VSTkFNRV9BTkRfRU1BSUxcIiwgXCJVU0VSTkFNRV9BTkRfT1BUSU9OQUxfRU1BSUxcIiwgXCJFTUFJTF9PTkxZXCJdLmluY2x1ZGVzKHBhc3N3b3JkU2lnbnVwRmllbGRzKCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIEhlbHBlciB0byBzdG9yZSBmaWVsZCB2YWx1ZXMgd2hpbGUgdXNpbmcgdGhlIGZvcm0uXG4gICAqL1xuICBzdGF0aWMgc2V0RGVmYXVsdEZpZWxkVmFsdWVzKGRlZmF1bHRzKSB7XG4gICAgaWYgKHR5cGVvZiBkZWZhdWx0cyAhPT0gJ29iamVjdCcpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQXJndW1lbnQgdG8gc2V0RGVmYXVsdEZpZWxkVmFsdWVzIGlzIG5vdCBvZiB0eXBlIG9iamVjdCcpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGxvY2FsU3RvcmFnZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbG9jYWxTdG9yYWdlKSB7XG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnYWNjb3VudHNfdWknLCBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgIHBhc3N3b3JkU2lnbnVwRmllbGRzOiBwYXNzd29yZFNpZ251cEZpZWxkcygpLFxuICAgICAgICAuLi5Mb2dpbkZvcm0uZ2V0RGVmYXVsdEZpZWxkVmFsdWVzKCksXG4gICAgICAgIC4uLmRlZmF1bHRzLFxuICAgICAgfSkpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBIZWxwZXIgdG8gZ2V0IGZpZWxkIHZhbHVlcyB3aGVuIHN3aXRjaGluZyBzdGF0ZXMgaW4gdGhlIGZvcm0uXG4gICAqL1xuICBzdGF0aWMgZ2V0RGVmYXVsdEZpZWxkVmFsdWVzKCkge1xuICAgIGlmICh0eXBlb2YgbG9jYWxTdG9yYWdlICE9PSAndW5kZWZpbmVkJyAmJiBsb2NhbFN0b3JhZ2UpIHtcbiAgICAgIGNvbnN0IGRlZmF1bHRGaWVsZFZhbHVlcyA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2FjY291bnRzX3VpJykgfHwgbnVsbCk7XG4gICAgICBpZiAoZGVmYXVsdEZpZWxkVmFsdWVzXG4gICAgICAgICYmIGRlZmF1bHRGaWVsZFZhbHVlcy5wYXNzd29yZFNpZ251cEZpZWxkcyA9PT0gcGFzc3dvcmRTaWdudXBGaWVsZHMoKSkge1xuICAgICAgICByZXR1cm4gZGVmYXVsdEZpZWxkVmFsdWVzO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBIZWxwZXIgdG8gY2xlYXIgZmllbGQgdmFsdWVzIHdoZW4gc2lnbmluZyBpbiwgdXAgb3Igb3V0LlxuICAgKi9cbiAgY2xlYXJEZWZhdWx0RmllbGRWYWx1ZXMoKSB7XG4gICAgaWYgKHR5cGVvZiBsb2NhbFN0b3JhZ2UgIT09ICd1bmRlZmluZWQnICYmIGxvY2FsU3RvcmFnZSkge1xuICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ2FjY291bnRzX3VpJyk7XG4gICAgfVxuICB9XG5cbiAgc3dpdGNoVG9TaWduVXAoZXZlbnQpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgZm9ybVN0YXRlOiBTVEFURVMuU0lHTl9VUCxcbiAgICAgIC4uLkxvZ2luRm9ybS5nZXREZWZhdWx0RmllbGRWYWx1ZXMoKSxcbiAgICB9KTtcbiAgICB0aGlzLmNsZWFyTWVzc2FnZXMoKTtcbiAgfVxuXG4gIHN3aXRjaFRvU2lnbkluKGV2ZW50KSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGZvcm1TdGF0ZTogU1RBVEVTLlNJR05fSU4sXG4gICAgICAuLi5Mb2dpbkZvcm0uZ2V0RGVmYXVsdEZpZWxkVmFsdWVzKCksXG4gICAgfSk7XG4gICAgdGhpcy5jbGVhck1lc3NhZ2VzKCk7XG4gIH1cblxuICBzd2l0Y2hUb1Bhc3N3b3JkUmVzZXQoZXZlbnQpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgZm9ybVN0YXRlOiBTVEFURVMuUEFTU1dPUkRfUkVTRVQsXG4gICAgICAuLi5Mb2dpbkZvcm0uZ2V0RGVmYXVsdEZpZWxkVmFsdWVzKCksXG4gICAgfSk7XG4gICAgdGhpcy5jbGVhck1lc3NhZ2VzKCk7XG4gIH1cblxuICBzd2l0Y2hUb0NoYW5nZVBhc3N3b3JkKGV2ZW50KSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGZvcm1TdGF0ZTogU1RBVEVTLlBBU1NXT1JEX0NIQU5HRSxcbiAgICAgIC4uLkxvZ2luRm9ybS5nZXREZWZhdWx0RmllbGRWYWx1ZXMoKSxcbiAgICB9KTtcbiAgICB0aGlzLmNsZWFyTWVzc2FnZXMoKTtcbiAgfVxuXG4gIHN3aXRjaFRvU2lnbk91dChldmVudCkge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBmb3JtU3RhdGU6IFNUQVRFUy5QUk9GSUxFLFxuICAgIH0pO1xuICAgIHRoaXMuY2xlYXJNZXNzYWdlcygpO1xuICB9XG5cbiAgY2FuY2VsUmVzZXRQYXNzd29yZChldmVudCkge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgQWNjb3VudHMuX2xvZ2luQnV0dG9uc1Nlc3Npb24uc2V0KCdyZXNldFBhc3N3b3JkVG9rZW4nLCBudWxsKTtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGZvcm1TdGF0ZTogU1RBVEVTLlNJR05fSU4sXG4gICAgICBtZXNzYWdlczogW10sXG4gICAgfSk7XG4gIH1cblxuICBzaWduT3V0KCkge1xuICAgIE1ldGVvci5sb2dvdXQoKCkgPT4ge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGZvcm1TdGF0ZTogU1RBVEVTLlNJR05fSU4sXG4gICAgICAgIHBhc3N3b3JkOiBudWxsLFxuICAgICAgfSk7XG4gICAgICB0aGlzLnN0YXRlLm9uU2lnbmVkT3V0SG9vaygpO1xuICAgICAgdGhpcy5jbGVhck1lc3NhZ2VzKCk7XG4gICAgICB0aGlzLmNsZWFyRGVmYXVsdEZpZWxkVmFsdWVzKCk7XG4gICAgfSk7XG4gIH1cblxuICBzaWduSW4oKSB7XG4gICAgY29uc3Qge1xuICAgICAgdXNlcm5hbWUgPSBudWxsLFxuICAgICAgZW1haWwgPSBudWxsLFxuICAgICAgdXNlcm5hbWVPckVtYWlsID0gbnVsbCxcbiAgICAgIHBhc3N3b3JkLFxuICAgICAgZm9ybVN0YXRlLFxuICAgICAgb25TdWJtaXRIb29rXG4gICAgfcKgPSB0aGlzLnN0YXRlO1xuICAgIGxldCBlcnJvciA9IGZhbHNlO1xuICAgIGxldCBsb2dpblNlbGVjdG9yO1xuICAgIHRoaXMuY2xlYXJNZXNzYWdlcygpO1xuXG4gICAgaWYgKHVzZXJuYW1lT3JFbWFpbCAhPT0gbnVsbCkge1xuICAgICAgaWYgKCF0aGlzLnZhbGlkYXRlRmllbGQoJ3VzZXJuYW1lJywgdXNlcm5hbWVPckVtYWlsKSkge1xuICAgICAgICBpZiAodGhpcy5zdGF0ZS5mb3JtU3RhdGUgPT0gU1RBVEVTLlNJR05fVVApIHtcbiAgICAgICAgICB0aGlzLnN0YXRlLm9uU3VibWl0SG9vayhcImVycm9yLmFjY291bnRzLnVzZXJuYW1lUmVxdWlyZWRcIiwgdGhpcy5zdGF0ZS5mb3JtU3RhdGUpO1xuICAgICAgICB9XG4gICAgICAgIGVycm9yID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBpZiAoW1wiVVNFUk5BTUVfQU5EX0VNQUlMX05PX1BBU1NXT1JEXCJdLmluY2x1ZGVzKHBhc3N3b3JkU2lnbnVwRmllbGRzKCkpKSB7XG4gICAgICAgICAgdGhpcy5sb2dpbldpdGhvdXRQYXNzd29yZCgpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBsb2dpblNlbGVjdG9yID0gdXNlcm5hbWVPckVtYWlsO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh1c2VybmFtZSAhPT0gbnVsbCkge1xuICAgICAgaWYgKCF0aGlzLnZhbGlkYXRlRmllbGQoJ3VzZXJuYW1lJywgdXNlcm5hbWUpKSB7XG4gICAgICAgIGlmICh0aGlzLnN0YXRlLmZvcm1TdGF0ZSA9PSBTVEFURVMuU0lHTl9VUCkge1xuICAgICAgICAgIHRoaXMuc3RhdGUub25TdWJtaXRIb29rKFwiZXJyb3IuYWNjb3VudHMudXNlcm5hbWVSZXF1aXJlZFwiLCB0aGlzLnN0YXRlLmZvcm1TdGF0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgZXJyb3IgPSB0cnVlO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIGxvZ2luU2VsZWN0b3IgPSB7IHVzZXJuYW1lOiB1c2VybmFtZSB9O1xuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIGlmICh1c2VybmFtZU9yRW1haWwgPT0gbnVsbCkge1xuICAgICAgaWYgKCF0aGlzLnZhbGlkYXRlRmllbGQoJ2VtYWlsJywgZW1haWwpKSB7XG4gICAgICAgIGVycm9yID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBpZiAoW1wiRU1BSUxfT05MWV9OT19QQVNTV09SRFwiXS5pbmNsdWRlcyhwYXNzd29yZFNpZ251cEZpZWxkcygpKSkge1xuICAgICAgICAgIHRoaXMubG9naW5XaXRob3V0UGFzc3dvcmQoKTtcbiAgICAgICAgICBlcnJvciA9IHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbG9naW5TZWxlY3RvciA9IHsgZW1haWwgfTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoIVtcIkVNQUlMX09OTFlfTk9fUEFTU1dPUkRcIl0uaW5jbHVkZXMocGFzc3dvcmRTaWdudXBGaWVsZHMoKSlcbiAgICAgICYmICF0aGlzLnZhbGlkYXRlRmllbGQoJ3Bhc3N3b3JkJywgcGFzc3dvcmQpKSB7XG4gICAgICBlcnJvciA9IHRydWU7XG4gICAgfVxuXG4gICAgaWYgKCFlcnJvcikge1xuICAgICAgTWV0ZW9yLmxvZ2luV2l0aFBhc3N3b3JkKGxvZ2luU2VsZWN0b3IsIHBhc3N3b3JkLCAoZXJyb3IsIHJlc3VsdCkgPT4ge1xuICAgICAgICBvblN1Ym1pdEhvb2soZXJyb3IsZm9ybVN0YXRlKTtcbiAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgdGhpcy5zaG93TWVzc2FnZShgZXJyb3IuYWNjb3VudHMuJHtlcnJvci5yZWFzb259YCB8fCBcInVua25vd25fZXJyb3JcIiwgJ2Vycm9yJyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgbG9naW5SZXN1bHRDYWxsYmFjaygoKSA9PiB0aGlzLnN0YXRlLm9uU2lnbmVkSW5Ib29rKCkpO1xuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgZm9ybVN0YXRlOiBTVEFURVMuUFJPRklMRSxcbiAgICAgICAgICAgIHBhc3N3b3JkOiBudWxsLFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHRoaXMuY2xlYXJEZWZhdWx0RmllbGRWYWx1ZXMoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgb2F1dGhCdXR0b25zKCkge1xuICAgIGNvbnN0IHsgZm9ybVN0YXRlLCB3YWl0aW5nIH0gPSB0aGlzLnN0YXRlO1xuICAgIGxldCBvYXV0aEJ1dHRvbnMgPSBbXTtcbiAgICBpZiAoZm9ybVN0YXRlID09IFNUQVRFUy5TSUdOX0lOIHx8IGZvcm1TdGF0ZSA9PSBTVEFURVMuU0lHTl9VUCApIHtcbiAgICAgIGlmKEFjY291bnRzLm9hdXRoKSB7XG4gICAgICAgIEFjY291bnRzLm9hdXRoLnNlcnZpY2VOYW1lcygpLm1hcCgoc2VydmljZSkgPT4ge1xuICAgICAgICAgIG9hdXRoQnV0dG9ucy5wdXNoKHtcbiAgICAgICAgICAgIGlkOiBzZXJ2aWNlLFxuICAgICAgICAgICAgbGFiZWw6IGNhcGl0YWxpemUoc2VydmljZSksXG4gICAgICAgICAgICBkaXNhYmxlZDogd2FpdGluZyxcbiAgICAgICAgICAgIHR5cGU6ICdidXR0b24nLFxuICAgICAgICAgICAgY2xhc3NOYW1lOiBgYnRuLSR7c2VydmljZX0gJHtzZXJ2aWNlfWAsXG4gICAgICAgICAgICBvbkNsaWNrOiB0aGlzLm9hdXRoU2lnbkluLmJpbmQodGhpcywgc2VydmljZSlcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBpbmRleEJ5KG9hdXRoQnV0dG9ucywgJ2lkJyk7XG4gIH1cblxuICBvYXV0aFNpZ25JbihzZXJ2aWNlTmFtZSkge1xuICAgIGNvbnN0IHsgdXNlciB9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCB7IGZvcm1TdGF0ZSwgd2FpdGluZywgb25TdWJtaXRIb29rIH0gPSB0aGlzLnN0YXRlO1xuICAgIC8vVGhhbmtzIEpvc2ggT3dlbnMgZm9yIHRoaXMgb25lLlxuICAgIGZ1bmN0aW9uIGNhcGl0YWxTZXJ2aWNlKCkge1xuICAgICAgcmV0dXJuIHNlcnZpY2VOYW1lLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgc2VydmljZU5hbWUuc2xpY2UoMSk7XG4gICAgfVxuXG4gICAgaWYoc2VydmljZU5hbWUgPT09ICdtZXRlb3ItZGV2ZWxvcGVyJyl7XG4gICAgICBzZXJ2aWNlTmFtZSA9ICdtZXRlb3JEZXZlbG9wZXJBY2NvdW50JztcbiAgICB9XG5cbiAgICBjb25zdCBsb2dpbldpdGhTZXJ2aWNlID0gTWV0ZW9yW1wibG9naW5XaXRoXCIgKyBjYXBpdGFsU2VydmljZSgpXTtcblxuICAgIGxldCBvcHRpb25zID0ge307IC8vIHVzZSBkZWZhdWx0IHNjb3BlIHVubGVzcyBzcGVjaWZpZWRcbiAgICBpZiAoQWNjb3VudHMudWkuX29wdGlvbnMucmVxdWVzdFBlcm1pc3Npb25zW3NlcnZpY2VOYW1lXSlcbiAgICAgIG9wdGlvbnMucmVxdWVzdFBlcm1pc3Npb25zID0gQWNjb3VudHMudWkuX29wdGlvbnMucmVxdWVzdFBlcm1pc3Npb25zW3NlcnZpY2VOYW1lXTtcbiAgICBpZiAoQWNjb3VudHMudWkuX29wdGlvbnMucmVxdWVzdE9mZmxpbmVUb2tlbltzZXJ2aWNlTmFtZV0pXG4gICAgICBvcHRpb25zLnJlcXVlc3RPZmZsaW5lVG9rZW4gPSBBY2NvdW50cy51aS5fb3B0aW9ucy5yZXF1ZXN0T2ZmbGluZVRva2VuW3NlcnZpY2VOYW1lXTtcbiAgICBpZiAoQWNjb3VudHMudWkuX29wdGlvbnMuZm9yY2VBcHByb3ZhbFByb21wdFtzZXJ2aWNlTmFtZV0pXG4gICAgICBvcHRpb25zLmZvcmNlQXBwcm92YWxQcm9tcHQgPSBBY2NvdW50cy51aS5fb3B0aW9ucy5mb3JjZUFwcHJvdmFsUHJvbXB0W3NlcnZpY2VOYW1lXTtcblxuICAgIHRoaXMuY2xlYXJNZXNzYWdlcygpO1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzXG4gICAgbG9naW5XaXRoU2VydmljZShvcHRpb25zLCAoZXJyb3IpID0+IHtcbiAgICAgIG9uU3VibWl0SG9vayhlcnJvcixmb3JtU3RhdGUpO1xuICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgIHRoaXMuc2hvd01lc3NhZ2UoYGVycm9yLmFjY291bnRzLiR7ZXJyb3IucmVhc29ufWAgfHwgXCJ1bmtub3duX2Vycm9yXCIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGZvcm1TdGF0ZTogU1RBVEVTLlBST0ZJTEUgfSk7XG4gICAgICAgIHRoaXMuY2xlYXJEZWZhdWx0RmllbGRWYWx1ZXMoKTtcbiAgICAgICAgbG9naW5SZXN1bHRDYWxsYmFjaygoKSA9PiB7XG4gICAgICAgICAgTWV0ZW9yLnNldFRpbWVvdXQoKCkgPT4gdGhpcy5zdGF0ZS5vblNpZ25lZEluSG9vaygpLCAxMDApO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICB9XG5cbiAgc2lnblVwKG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IHtcbiAgICAgIHVzZXJuYW1lID0gbnVsbCxcbiAgICAgIGVtYWlsID0gbnVsbCxcbiAgICAgIHVzZXJuYW1lT3JFbWFpbCA9IG51bGwsXG4gICAgICBwYXNzd29yZCxcbiAgICAgIGZvcm1TdGF0ZSxcbiAgICAgIG9uU3VibWl0SG9va1xuICAgIH3CoD0gdGhpcy5zdGF0ZTtcbiAgICBsZXQgZXJyb3IgPSBmYWxzZTtcbiAgICB0aGlzLmNsZWFyTWVzc2FnZXMoKTtcblxuICAgIGlmICh1c2VybmFtZSAhPT0gbnVsbCkge1xuICAgICAgaWYgKCAhdGhpcy52YWxpZGF0ZUZpZWxkKCd1c2VybmFtZScsIHVzZXJuYW1lKSApIHtcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUuZm9ybVN0YXRlID09IFNUQVRFUy5TSUdOX1VQKSB7XG4gICAgICAgICAgdGhpcy5zdGF0ZS5vblN1Ym1pdEhvb2soXCJlcnJvci5hY2NvdW50cy51c2VybmFtZVJlcXVpcmVkXCIsIHRoaXMuc3RhdGUuZm9ybVN0YXRlKTtcbiAgICAgICAgfVxuICAgICAgICBlcnJvciA9IHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvcHRpb25zLnVzZXJuYW1lID0gdXNlcm5hbWU7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChbXG4gICAgICAgIFwiVVNFUk5BTUVfQU5EX0VNQUlMXCIsXG4gICAgICAgIFwiVVNFUk5BTUVfQU5EX0VNQUlMX05PX1BBU1NXT1JEXCJcbiAgICAgIF0uaW5jbHVkZXMocGFzc3dvcmRTaWdudXBGaWVsZHMoKSkgJiYgIXRoaXMudmFsaWRhdGVGaWVsZCgndXNlcm5hbWUnLCB1c2VybmFtZSkgKSB7XG4gICAgICAgIGlmICh0aGlzLnN0YXRlLmZvcm1TdGF0ZSA9PSBTVEFURVMuU0lHTl9VUCkge1xuICAgICAgICAgIHRoaXMuc3RhdGUub25TdWJtaXRIb29rKFwiZXJyb3IuYWNjb3VudHMudXNlcm5hbWVSZXF1aXJlZFwiLCB0aGlzLnN0YXRlLmZvcm1TdGF0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgZXJyb3IgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICghdGhpcy52YWxpZGF0ZUZpZWxkKCdlbWFpbCcsIGVtYWlsKSl7XG4gICAgICBlcnJvciA9IHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIG9wdGlvbnMuZW1haWwgPSBlbWFpbDtcbiAgICB9XG5cbiAgICBpZiAoW1xuICAgICAgXCJFTUFJTF9PTkxZX05PX1BBU1NXT1JEXCIsXG4gICAgICBcIlVTRVJOQU1FX0FORF9FTUFJTF9OT19QQVNTV09SRFwiXG4gICAgXS5pbmNsdWRlcyhwYXNzd29yZFNpZ251cEZpZWxkcygpKSkge1xuICAgICAgLy8gR2VuZXJhdGUgYSByYW5kb20gcGFzc3dvcmQuXG4gICAgICBvcHRpb25zLnBhc3N3b3JkID0gdXVpZCgpOyAvL01ldGVvci51dWlkKCk7XG4gICAgfSBlbHNlIGlmICghdGhpcy52YWxpZGF0ZUZpZWxkKCdwYXNzd29yZCcsIHBhc3N3b3JkKSkge1xuICAgICAgb25TdWJtaXRIb29rKFwiSW52YWxpZCBwYXNzd29yZFwiLCBmb3JtU3RhdGUpO1xuICAgICAgZXJyb3IgPSB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICBvcHRpb25zLnBhc3N3b3JkID0gcGFzc3dvcmQ7XG4gICAgfVxuXG4gICAgY29uc3QgU2lnblVwID0gZnVuY3Rpb24oX29wdGlvbnMpIHtcbiAgICAgIEFjY291bnRzLmNyZWF0ZVVzZXIoX29wdGlvbnMsIChlcnJvcikgPT4ge1xuICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICB0aGlzLnNob3dNZXNzYWdlKGBlcnJvci5hY2NvdW50cy4ke2Vycm9yLnJlYXNvbn1gIHx8IFwidW5rbm93bl9lcnJvclwiLCAnZXJyb3InKTtcbiAgICAgICAgICBpZiAodGhpcy50cmFuc2xhdGUoYGVycm9yLmFjY291bnRzLiR7ZXJyb3IucmVhc29ufWApKSB7XG4gICAgICAgICAgICBvblN1Ym1pdEhvb2soYGVycm9yLmFjY291bnRzLiR7ZXJyb3IucmVhc29ufWAsIGZvcm1TdGF0ZSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgb25TdWJtaXRIb29rKFwidW5rbm93bl9lcnJvclwiLCBmb3JtU3RhdGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBvblN1Ym1pdEhvb2sobnVsbCwgZm9ybVN0YXRlKTtcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgZm9ybVN0YXRlOiBTVEFURVMuUFJPRklMRSwgcGFzc3dvcmQ6IG51bGwgfSk7XG4gICAgICAgICAgbGV0IHVzZXIgPSBBY2NvdW50cy51c2VyKCk7XG4gICAgICAgICAgbG9naW5SZXN1bHRDYWxsYmFjayh0aGlzLnN0YXRlLm9uUG9zdFNpZ25VcEhvb2suYmluZCh0aGlzLCBfb3B0aW9ucywgdXNlcikpO1xuICAgICAgICAgIHRoaXMuY2xlYXJEZWZhdWx0RmllbGRWYWx1ZXMoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyB3YWl0aW5nOiBmYWxzZSB9KTtcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICBpZiAoIWVycm9yKSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHsgd2FpdGluZzogdHJ1ZSB9KTtcbiAgICAgIC8vIEFsbG93IGZvciBQcm9taXNlcyB0byByZXR1cm4uXG4gICAgICBsZXQgcHJvbWlzZSA9IHRoaXMuc3RhdGUub25QcmVTaWduVXBIb29rKG9wdGlvbnMpO1xuICAgICAgaWYgKHByb21pc2UgaW5zdGFuY2VvZiBQcm9taXNlKSB7XG4gICAgICAgIHByb21pc2UudGhlbihTaWduVXAuYmluZCh0aGlzLCBvcHRpb25zKSk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgU2lnblVwKG9wdGlvbnMpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGxvZ2luV2l0aG91dFBhc3N3b3JkKCl7XG4gICAgY29uc3Qge1xuICAgICAgZW1haWwgPSAnJyxcbiAgICAgIHVzZXJuYW1lT3JFbWFpbCA9ICcnLFxuICAgICAgd2FpdGluZyxcbiAgICAgIGZvcm1TdGF0ZSxcbiAgICAgIG9uU3VibWl0SG9va1xuICAgIH3CoD0gdGhpcy5zdGF0ZTtcblxuICAgIGlmICh3YWl0aW5nKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMudmFsaWRhdGVGaWVsZCgnZW1haWwnLCBlbWFpbCkpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyB3YWl0aW5nOiB0cnVlIH0pO1xuXG4gICAgICBBY2NvdW50cy5sb2dpbldpdGhvdXRQYXNzd29yZCh7IGVtYWlsOiBlbWFpbCB9LCAoZXJyb3IpID0+IHtcbiAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgdGhpcy5zaG93TWVzc2FnZShgZXJyb3IuYWNjb3VudHMuJHtlcnJvci5yZWFzb259YCB8fCBcInVua25vd25fZXJyb3JcIiwgJ2Vycm9yJyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgdGhpcy5zaG93TWVzc2FnZShcImluZm8uZW1haWxTZW50XCIsICdzdWNjZXNzJywgNTAwMCk7XG4gICAgICAgICAgdGhpcy5jbGVhckRlZmF1bHRGaWVsZFZhbHVlcygpO1xuICAgICAgICB9XG4gICAgICAgIG9uU3VibWl0SG9vayhlcnJvciwgZm9ybVN0YXRlKTtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHdhaXRpbmc6IGZhbHNlIH0pO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmICh0aGlzLnZhbGlkYXRlRmllbGQoJ3VzZXJuYW1lJywgdXNlcm5hbWVPckVtYWlsKSkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7IHdhaXRpbmc6IHRydWUgfSk7XG5cbiAgICAgIEFjY291bnRzLmxvZ2luV2l0aG91dFBhc3N3b3JkKHsgZW1haWw6IHVzZXJuYW1lT3JFbWFpbCwgdXNlcm5hbWU6IHVzZXJuYW1lT3JFbWFpbCB9LCAoZXJyb3IpID0+IHtcbiAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgdGhpcy5zaG93TWVzc2FnZShgZXJyb3IuYWNjb3VudHMuJHtlcnJvci5yZWFzb259YCB8fCBcInVua25vd25fZXJyb3JcIiwgJ2Vycm9yJyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgdGhpcy5zaG93TWVzc2FnZShcImluZm8uZW1haWxTZW50XCIsICdzdWNjZXNzJywgNTAwMCk7XG4gICAgICAgICAgdGhpcy5jbGVhckRlZmF1bHRGaWVsZFZhbHVlcygpO1xuICAgICAgICB9XG4gICAgICAgIG9uU3VibWl0SG9vayhlcnJvciwgZm9ybVN0YXRlKTtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHdhaXRpbmc6IGZhbHNlIH0pO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCBlcnJNc2cgPSBcImVycm9yLmFjY291bnRzLmludmFsaWRfZW1haWxcIjtcbiAgICAgIHRoaXMuc2hvd01lc3NhZ2UoZXJyTXNnLCd3YXJuaW5nJyk7XG4gICAgICBvblN1Ym1pdEhvb2sodGhpcy50cmFuc2xhdGUoZXJyTXNnKSwgZm9ybVN0YXRlKTtcbiAgICB9XG4gIH1cblxuICBwYXNzd29yZFJlc2V0KCkge1xuICAgIGNvbnN0IHtcbiAgICAgIGVtYWlsID0gJycsXG4gICAgICB3YWl0aW5nLFxuICAgICAgZm9ybVN0YXRlLFxuICAgICAgb25TdWJtaXRIb29rXG4gICAgfcKgPSB0aGlzLnN0YXRlO1xuXG4gICAgaWYgKHdhaXRpbmcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmNsZWFyTWVzc2FnZXMoKTtcbiAgICBpZiAodGhpcy52YWxpZGF0ZUZpZWxkKCdlbWFpbCcsIGVtYWlsKSkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7IHdhaXRpbmc6IHRydWUgfSk7XG5cbiAgICAgIEFjY291bnRzLmZvcmdvdFBhc3N3b3JkKHsgZW1haWw6IGVtYWlsIH0sIChlcnJvcikgPT4ge1xuICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICB0aGlzLnNob3dNZXNzYWdlKGBlcnJvci5hY2NvdW50cy4ke2Vycm9yLnJlYXNvbn1gIHx8IFwidW5rbm93bl9lcnJvclwiLCAnZXJyb3InKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICB0aGlzLnNob3dNZXNzYWdlKFwiaW5mby5lbWFpbFNlbnRcIiwgJ3N1Y2Nlc3MnLCA1MDAwKTtcbiAgICAgICAgICB0aGlzLmNsZWFyRGVmYXVsdEZpZWxkVmFsdWVzKCk7XG4gICAgICAgIH1cbiAgICAgICAgb25TdWJtaXRIb29rKGVycm9yLCBmb3JtU3RhdGUpO1xuICAgICAgICB0aGlzLnNldFN0YXRlKHsgd2FpdGluZzogZmFsc2UgfSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBwYXNzd29yZENoYW5nZSgpIHtcbiAgICBjb25zdCB7XG4gICAgICBwYXNzd29yZCxcbiAgICAgIG5ld1Bhc3N3b3JkLFxuICAgICAgZm9ybVN0YXRlLFxuICAgICAgb25TdWJtaXRIb29rLFxuICAgICAgb25TaWduZWRJbkhvb2ssXG4gICAgfcKgPSB0aGlzLnN0YXRlO1xuXG4gICAgaWYgKCF0aGlzLnZhbGlkYXRlRmllbGQoJ3Bhc3N3b3JkJywgbmV3UGFzc3dvcmQsICduZXdQYXNzd29yZCcpKXtcbiAgICAgIG9uU3VibWl0SG9vaygnZXJyLm1pbkNoYXInLGZvcm1TdGF0ZSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IHRva2VuID0gQWNjb3VudHMuX2xvZ2luQnV0dG9uc1Nlc3Npb24uZ2V0KCdyZXNldFBhc3N3b3JkVG9rZW4nKTtcbiAgICBpZiAoIXRva2VuKSB7XG4gICAgICB0b2tlbiA9IEFjY291bnRzLl9sb2dpbkJ1dHRvbnNTZXNzaW9uLmdldCgnZW5yb2xsQWNjb3VudFRva2VuJyk7XG4gICAgfVxuICAgIGlmICh0b2tlbikge1xuICAgICAgQWNjb3VudHMucmVzZXRQYXNzd29yZCh0b2tlbiwgbmV3UGFzc3dvcmQsIChlcnJvcikgPT4ge1xuICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICB0aGlzLnNob3dNZXNzYWdlKGBlcnJvci5hY2NvdW50cy4ke2Vycm9yLnJlYXNvbn1gIHx8IFwidW5rbm93bl9lcnJvclwiLCAnZXJyb3InKTtcbiAgICAgICAgICBvblN1Ym1pdEhvb2soZXJyb3IsIGZvcm1TdGF0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgdGhpcy5zaG93TWVzc2FnZSgnaW5mby5wYXNzd29yZENoYW5nZWQnLCAnc3VjY2VzcycsIDUwMDApO1xuICAgICAgICAgIG9uU3VibWl0SG9vayhudWxsLCBmb3JtU3RhdGUpO1xuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBmb3JtU3RhdGU6IFNUQVRFUy5QUk9GSUxFIH0pO1xuICAgICAgICAgIEFjY291bnRzLl9sb2dpbkJ1dHRvbnNTZXNzaW9uLnNldCgncmVzZXRQYXNzd29yZFRva2VuJywgbnVsbCk7XG4gICAgICAgICAgQWNjb3VudHMuX2xvZ2luQnV0dG9uc1Nlc3Npb24uc2V0KCdlbnJvbGxBY2NvdW50VG9rZW4nLCBudWxsKTtcbiAgICAgICAgICBvblNpZ25lZEluSG9vaygpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBBY2NvdW50cy5jaGFuZ2VQYXNzd29yZChwYXNzd29yZCwgbmV3UGFzc3dvcmQsIChlcnJvcikgPT4ge1xuICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICB0aGlzLnNob3dNZXNzYWdlKGBlcnJvci5hY2NvdW50cy4ke2Vycm9yLnJlYXNvbn1gIHx8IFwidW5rbm93bl9lcnJvclwiLCAnZXJyb3InKTtcbiAgICAgICAgICBvblN1Ym1pdEhvb2soZXJyb3IsIGZvcm1TdGF0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgdGhpcy5zaG93TWVzc2FnZSgnaW5mby5wYXNzd29yZENoYW5nZWQnLCAnc3VjY2VzcycsIDUwMDApO1xuICAgICAgICAgIG9uU3VibWl0SG9vayhudWxsLCBmb3JtU3RhdGUpO1xuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBmb3JtU3RhdGU6IFNUQVRFUy5QUk9GSUxFIH0pO1xuICAgICAgICAgIHRoaXMuY2xlYXJEZWZhdWx0RmllbGRWYWx1ZXMoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgc2hvd01lc3NhZ2UobWVzc2FnZSwgdHlwZSwgY2xlYXJUaW1lb3V0LCBmaWVsZCl7XG4gICAgbWVzc2FnZSA9IHRoaXMudHJhbnNsYXRlKG1lc3NhZ2UpLnRyaW0oKTtcbiAgICBpZiAobWVzc2FnZSkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSgoe8KgbWVzc2FnZXMgPSBbXSB9KSA9PiB7XG4gICAgICAgIG1lc3NhZ2VzLnB1c2goe1xuICAgICAgICAgIG1lc3NhZ2UsXG4gICAgICAgICAgdHlwZSxcbiAgICAgICAgICAuLi4oZmllbGQgJiYge8KgZmllbGTCoH0pLFxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuICB7wqBtZXNzYWdlcyB9O1xuICAgICAgfSk7XG4gICAgICBpZiAoY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIHRoaXMuaGlkZU1lc3NhZ2VUaW1vdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAvLyBGaWx0ZXIgb3V0IHRoZSBtZXNzYWdlIHRoYXQgdGltZWQgb3V0LlxuICAgICAgICAgIHRoaXMuY2xlYXJNZXNzYWdlKG1lc3NhZ2UpO1xuICAgICAgICB9LCBjbGVhclRpbWVvdXQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGdldE1lc3NhZ2VGb3JGaWVsZChmaWVsZCkge1xuICAgIGNvbnN0IHvCoG1lc3NhZ2VzID0gW10gfSA9IHRoaXMuc3RhdGU7XG4gICAgcmV0dXJuIG1lc3NhZ2VzLmZpbmQoKHvCoGZpZWxkOmtleSB9KSA9PiBrZXkgPT09IGZpZWxkKTtcbiAgfVxuXG4gIGNsZWFyTWVzc2FnZShtZXNzYWdlKSB7XG4gICAgaWYgKG1lc3NhZ2UpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoKHvCoG1lc3NhZ2VzID0gW13CoH0pID0+ICh7XG4gICAgICAgIG1lc3NhZ2VzOiBtZXNzYWdlcy5maWx0ZXIoKHvCoG1lc3NhZ2U6YSB9KSA9PiBhICE9PSBtZXNzYWdlKSxcbiAgICAgIH0pKTtcbiAgICB9XG4gIH1cblxuICBjbGVhck1lc3NhZ2VzKCkge1xuICAgIGlmICh0aGlzLmhpZGVNZXNzYWdlVGltb3V0KSB7XG4gICAgICBjbGVhclRpbWVvdXQodGhpcy5oaWRlTWVzc2FnZVRpbW91dCk7XG4gICAgfVxuICAgIHRoaXMuc2V0U3RhdGUoeyBtZXNzYWdlczogW10gfSk7XG4gIH1cblxuICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICBpZiAodGhpcy5oaWRlTWVzc2FnZVRpbW91dCkge1xuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuaGlkZU1lc3NhZ2VUaW1vdXQpO1xuICAgIH1cblxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHRoaXMub2F1dGhCdXR0b25zKCk7XG4gICAgLy8gQmFja3dvcmRzIGNvbXBhdGliaWxpdHkgd2l0aCB2MS4yLnguXG4gICAgY29uc3Qge8KgbWVzc2FnZXMgPSBbXSB9wqA9IHRoaXMuc3RhdGU7XG4gICAgY29uc3QgbWVzc2FnZSA9IHtcbiAgICAgIGRlcHJlY2F0ZWQ6IHRydWUsXG4gICAgICBtZXNzYWdlOiBtZXNzYWdlcy5tYXAoKHvCoG1lc3NhZ2UgfSkgPT4gbWVzc2FnZSkuam9pbignLCAnKSxcbiAgICB9O1xuICAgIHJldHVybiAoXG4gICAgICA8QWNjb3VudHMudWkuRm9ybVxuICAgICAgICBvYXV0aFNlcnZpY2VzPXt0aGlzLm9hdXRoQnV0dG9ucygpfVxuICAgICAgICBmaWVsZHM9e3RoaXMuZmllbGRzKCl9wqBcbiAgICAgICAgYnV0dG9ucz17dGhpcy5idXR0b25zKCl9XG4gICAgICAgIHsuLi50aGlzLnN0YXRlfVxuICAgICAgICBtZXNzYWdlPXttZXNzYWdlfVxuICAgICAgICB0cmFuc2xhdGU9e3RleHQgPT4gdGhpcy50cmFuc2xhdGUodGV4dCl9XG4gICAgICAvPlxuICAgICk7XG4gIH1cbn1cbkxvZ2luRm9ybS5wcm9wVHlwZXMgPSB7XG4gIGZvcm1TdGF0ZTogUHJvcFR5cGVzLnN5bWJvbCxcbiAgbG9naW5QYXRoOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBzaWduVXBQYXRoOiBQcm9wVHlwZXMuc3RyaW5nLFxuICByZXNldFBhc3N3b3JkUGF0aDogUHJvcFR5cGVzLnN0cmluZyxcbiAgcHJvZmlsZVBhdGg6IFByb3BUeXBlcy5zdHJpbmcsXG4gIGNoYW5nZVBhc3N3b3JkUGF0aDogUHJvcFR5cGVzLnN0cmluZyxcbn07XG5Mb2dpbkZvcm0uZGVmYXVsdFByb3BzID0ge1xuICBmb3JtU3RhdGU6IG51bGwsXG4gIGxvZ2luUGF0aDogbnVsbCxcbiAgc2lnblVwUGF0aDogbnVsbCxcbiAgcmVzZXRQYXNzd29yZFBhdGg6IG51bGwsXG4gIHByb2ZpbGVQYXRoOiBudWxsLFxuICBjaGFuZ2VQYXNzd29yZFBhdGg6IG51bGwsXG59O1xuXG5BY2NvdW50cy51aS5Mb2dpbkZvcm0gPSB3aXRoVHJhY2tlcigoKSA9PiB7XG4gIC8vIExpc3RlbiBmb3IgdGhlIHVzZXIgdG8gbG9naW4vbG9nb3V0IGFuZCB0aGUgc2VydmljZXMgbGlzdCB0byB0aGUgdXNlci5cbiAgTWV0ZW9yLnN1YnNjcmliZSgnc2VydmljZXNMaXN0Jyk7XG4gIHJldHVybiAoe1xuICAgIHVzZXI6IEFjY291bnRzLnVzZXIoKSxcbiAgfSk7XG59KShMb2dpbkZvcm0pO1xuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgeyBBY2NvdW50cyB9IGZyb20gJ21ldGVvci9hY2NvdW50cy1iYXNlJztcbmltcG9ydCB7IFQ5biB9IGZyb20gJ21ldGVvci9zb2Z0d2FyZXJlcm86YWNjb3VudHMtdDluJztcbmltcG9ydCB7IGhhc1Bhc3N3b3JkU2VydmljZSB9IGZyb20gJy4uLy4uL2hlbHBlcnMuanMnO1xuXG5leHBvcnQgY2xhc3MgUGFzc3dvcmRPclNlcnZpY2UgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgaGFzUGFzc3dvcmRTZXJ2aWNlOiBoYXNQYXNzd29yZFNlcnZpY2UoKSxcbiAgICAgIHNlcnZpY2VzOiBPYmplY3Qua2V5cyhwcm9wcy5vYXV0aFNlcnZpY2VzKS5tYXAoc2VydmljZSA9PiB7XG4gICAgICAgIHJldHVybiBwcm9wcy5vYXV0aFNlcnZpY2VzW3NlcnZpY2VdLmxhYmVsXG4gICAgICB9KVxuICAgIH07XG4gIH1cblxuICB0cmFuc2xhdGUodGV4dCkge1xuICAgIGlmICh0aGlzLnByb3BzLnRyYW5zbGF0ZSkge1xuICAgICAgcmV0dXJuIHRoaXMucHJvcHMudHJhbnNsYXRlKHRleHQpO1xuICAgIH1cbiAgICByZXR1cm4gVDluLmdldCh0ZXh0KTtcbiAgfVxuXG4gIHJlbmRlciAoKSB7XG4gICAgbGV0IHsgY2xhc3NOYW1lID0gXCJwYXNzd29yZC1vci1zZXJ2aWNlXCIsIHN0eWxlID0ge30gfSA9IHRoaXMucHJvcHM7XG4gICAgbGV0IHsgaGFzUGFzc3dvcmRTZXJ2aWNlLCBzZXJ2aWNlcyB9ID0gdGhpcy5zdGF0ZTtcbiAgICBsYWJlbHMgPSBzZXJ2aWNlcztcbiAgICBpZiAoc2VydmljZXMubGVuZ3RoID4gMikge1xuICAgICAgbGFiZWxzID0gW107XG4gICAgfVxuXG4gICAgaWYgKGhhc1Bhc3N3b3JkU2VydmljZSAmJiBzZXJ2aWNlcy5sZW5ndGggPiAwKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IHN0eWxlPXsgc3R5bGUgfcKgY2xhc3NOYW1lPXsgY2xhc3NOYW1lIH0+XG4gICAgICAgICAgeyBgJHt0aGlzLnRyYW5zbGF0ZSgnb3JVc2UnKX0gJHsgbGFiZWxzLmpvaW4oJyAvICcpIH1gIH1cbiAgICAgICAgPC9kaXY+XG4gICAgICApO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuXG5QYXNzd29yZE9yU2VydmljZS5wcm9wVHlwZXMgPSB7XG4gIG9hdXRoU2VydmljZXM6IFByb3BUeXBlcy5vYmplY3Rcbn07XG5cbkFjY291bnRzLnVpLlBhc3N3b3JkT3JTZXJ2aWNlID0gUGFzc3dvcmRPclNlcnZpY2U7XG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0ICcuL0J1dHRvbi5qc3gnO1xuaW1wb3J0IHtBY2NvdW50c30gZnJvbSAnbWV0ZW9yL2FjY291bnRzLWJhc2UnO1xuXG5cbmV4cG9ydCBjbGFzcyBTb2NpYWxCdXR0b25zIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgcmVuZGVyKCkge1xuICAgIGxldCB7IG9hdXRoU2VydmljZXMgPSB7fSwgY2xhc3NOYW1lID0gXCJzb2NpYWwtYnV0dG9uc1wiIH0gPSB0aGlzLnByb3BzO1xuICAgIHJldHVybihcbiAgICAgIDxkaXYgY2xhc3NOYW1lPXsgY2xhc3NOYW1lIH0+XG4gICAgICAgIHtPYmplY3Qua2V5cyhvYXV0aFNlcnZpY2VzKS5tYXAoKGlkLCBpKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIDxBY2NvdW50cy51aS5CdXR0b24gey4uLm9hdXRoU2VydmljZXNbaWRdfSBrZXk9e2l9IC8+O1xuICAgICAgICB9KX1cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuQWNjb3VudHMudWkuU29jaWFsQnV0dG9ucyA9IFNvY2lhbEJ1dHRvbnM7XG4iXX0=
