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
let ReactDOM;
module.link("react-dom", {
  default(v) {
    ReactDOM = v;
  }

}, 2);
let uuid;
module.link("uuid", {
  default(v) {
    uuid = v;
  }

}, 3);
let injectTapEventPlugin;
module.link("react-tap-event-plugin", {
  default(v) {
    injectTapEventPlugin = v;
  }

}, 4);
let withTracker;
module.link("meteor/react-meteor-data", {
  withTracker(v) {
    withTracker = v;
  }

}, 5);
let Accounts;
module.link("meteor/accounts-base", {
  Accounts(v) {
    Accounts = v;
  }

}, 6);
let T9n;
module.link("meteor/softwarerero:accounts-t9n", {
  T9n(v) {
    T9n = v;
  }

}, 7);
let KEY_PREFIX;
module.link("../../login_session.js", {
  KEY_PREFIX(v) {
    KEY_PREFIX = v;
  }

}, 8);
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

}, 9);
injectTapEventPlugin();

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

}}}},"node_modules":{"prop-types":{"package.json":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/meteor/std_accounts-ui/node_modules/prop-types/package.json                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.exports = {
  "name": "prop-types",
  "version": "15.6.2",
  "main": "index.js"
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"index.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/meteor/std_accounts-ui/node_modules/prop-types/index.js                                                //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.useNode();
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"uuid":{"package.json":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/meteor/std_accounts-ui/node_modules/uuid/package.json                                                  //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.exports = {
  "name": "uuid",
  "version": "3.3.2"
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"index.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// node_modules/meteor/std_accounts-ui/node_modules/uuid/index.js                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
module.useNode();
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}}},{
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RkOmFjY291bnRzLXVpL2NoZWNrLW5wbS5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RkOmFjY291bnRzLXVpL21haW5fc2VydmVyLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGQ6YWNjb3VudHMtdWkvaW1wb3J0cy9hY2NvdW50c191aS5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RkOmFjY291bnRzLXVpL2ltcG9ydHMvaGVscGVycy5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RkOmFjY291bnRzLXVpL2ltcG9ydHMvbG9naW5fc2Vzc2lvbi5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RkOmFjY291bnRzLXVpL2ltcG9ydHMvYXBpL3NlcnZlci9sb2dpbldpdGhvdXRQYXNzd29yZC5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RkOmFjY291bnRzLXVpL2ltcG9ydHMvYXBpL3NlcnZlci9zZXJ2aWNlc0xpc3RQdWJsaWNhdGlvbi5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RkOmFjY291bnRzLXVpL2ltcG9ydHMvdWkvY29tcG9uZW50cy9CdXR0b24uanN4IiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGQ6YWNjb3VudHMtdWkvaW1wb3J0cy91aS9jb21wb25lbnRzL0J1dHRvbnMuanN4IiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGQ6YWNjb3VudHMtdWkvaW1wb3J0cy91aS9jb21wb25lbnRzL0ZpZWxkLmpzeCIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RkOmFjY291bnRzLXVpL2ltcG9ydHMvdWkvY29tcG9uZW50cy9GaWVsZHMuanN4IiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGQ6YWNjb3VudHMtdWkvaW1wb3J0cy91aS9jb21wb25lbnRzL0Zvcm0uanN4IiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGQ6YWNjb3VudHMtdWkvaW1wb3J0cy91aS9jb21wb25lbnRzL0Zvcm1NZXNzYWdlLmpzeCIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RkOmFjY291bnRzLXVpL2ltcG9ydHMvdWkvY29tcG9uZW50cy9Gb3JtTWVzc2FnZXMuanN4IiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGQ6YWNjb3VudHMtdWkvaW1wb3J0cy91aS9jb21wb25lbnRzL0xvZ2luRm9ybS5qc3giLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3N0ZDphY2NvdW50cy11aS9pbXBvcnRzL3VpL2NvbXBvbmVudHMvUGFzc3dvcmRPclNlcnZpY2UuanN4IiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9zdGQ6YWNjb3VudHMtdWkvaW1wb3J0cy91aS9jb21wb25lbnRzL1NvY2lhbEJ1dHRvbnMuanN4Il0sIm5hbWVzIjpbIm1vZHVsZSIsImV4cG9ydCIsImRlZmF1bHQiLCJMb2dpbkZvcm0iLCJBY2NvdW50cyIsIlNUQVRFUyIsImxpbmsiLCJ2IiwicmVkaXJlY3QiLCJ2YWxpZGF0ZVBhc3N3b3JkIiwidmFsaWRhdGVFbWFpbCIsInZhbGlkYXRlVXNlcm5hbWUiLCJ1aSIsIl9vcHRpb25zIiwicmVxdWVzdFBlcm1pc3Npb25zIiwicmVxdWVzdE9mZmxpbmVUb2tlbiIsImZvcmNlQXBwcm92YWxQcm9tcHQiLCJyZXF1aXJlRW1haWxWZXJpZmljYXRpb24iLCJwYXNzd29yZFNpZ251cEZpZWxkcyIsIm1pbmltdW1QYXNzd29yZExlbmd0aCIsImxvZ2luUGF0aCIsInNpZ25VcFBhdGgiLCJyZXNldFBhc3N3b3JkUGF0aCIsInByb2ZpbGVQYXRoIiwiY2hhbmdlUGFzc3dvcmRQYXRoIiwiaG9tZVJvdXRlUGF0aCIsIm9uU3VibWl0SG9vayIsIm9uUHJlU2lnblVwSG9vayIsIlByb21pc2UiLCJyZXNvbHZlIiwib25Qb3N0U2lnblVwSG9vayIsIm9uRW5yb2xsQWNjb3VudEhvb2siLCJvblJlc2V0UGFzc3dvcmRIb29rIiwib25WZXJpZnlFbWFpbEhvb2siLCJvblNpZ25lZEluSG9vayIsIm9uU2lnbmVkT3V0SG9vayIsImVtYWlsUGF0dGVybiIsIlJlZ0V4cCIsImJyb3dzZXJIaXN0b3J5IiwiY29uZmlnIiwib3B0aW9ucyIsIlZBTElEX0tFWVMiLCJPYmplY3QiLCJrZXlzIiwiZm9yRWFjaCIsImtleSIsImluY2x1ZGVzIiwiRXJyb3IiLCJzZXJ2aWNlIiwic2NvcGUiLCJBcnJheSIsInZhbHVlIiwiaG9vayIsInBhdGgiLCJleHBvcnREZWZhdWx0IiwibG9naW5CdXR0b25zU2Vzc2lvbiIsImdldExvZ2luU2VydmljZXMiLCJoYXNQYXNzd29yZFNlcnZpY2UiLCJsb2dpblJlc3VsdENhbGxiYWNrIiwiY2FwaXRhbGl6ZSIsInJlcXVpcmUiLCJlIiwiX2xvZ2luQnV0dG9uc1Nlc3Npb24iLCJTSUdOX0lOIiwiU3ltYm9sIiwiU0lHTl9VUCIsIlBST0ZJTEUiLCJQQVNTV09SRF9DSEFOR0UiLCJQQVNTV09SRF9SRVNFVCIsIkVOUk9MTF9BQ0NPVU5UIiwic2VydmljZXMiLCJQYWNrYWdlIiwib2F1dGgiLCJzZXJ2aWNlTmFtZXMiLCJzb3J0IiwibWFwIiwibmFtZSIsImVyciIsIkxvZ2luQ2FuY2VsbGVkRXJyb3IiLCJTZXJ2aWNlQ29uZmlndXJhdGlvbiIsIkNvbmZpZ0Vycm9yIiwiTWV0ZW9yIiwiaXNDbGllbnQiLCJ3aW5kb3ciLCJsb2NhdGlvbiIsImhyZWYiLCJlbWFpbCIsInNob3dNZXNzYWdlIiwiY2xlYXJNZXNzYWdlIiwidGVzdCIsImxlbmd0aCIsInBhc3N3b3JkIiwiZmllbGRJZCIsImVyck1zZyIsInVzZXJuYW1lIiwiZm9ybVN0YXRlIiwiZmllbGROYW1lIiwiaGlzdG9yeSIsInNldFRpbWVvdXQiLCJGbG93Um91dGVyIiwiZ28iLCJwdXNoIiwicHVzaFN0YXRlIiwic3RyaW5nIiwicmVwbGFjZSIsInNwbGl0Iiwid29yZCIsImNoYXJBdCIsInRvVXBwZXJDYXNlIiwic2xpY2UiLCJqb2luIiwidmFsaWRhdGVLZXkiLCJLRVlfUFJFRklYIiwic2V0IiwiX3NldCIsIlNlc3Npb24iLCJnZXQiLCJvblBhZ2VMb2FkTG9naW4iLCJhdHRlbXB0SW5mbyIsInR5cGUiLCJlcnJvciIsImRvbmVDYWxsYmFjayIsIm9uUmVzZXRQYXNzd29yZExpbmsiLCJ0b2tlbiIsImRvbmUiLCJvbkVucm9sbG1lbnRMaW5rIiwib25FbWFpbFZlcmlmaWNhdGlvbkxpbmsiLCJ2ZXJpZnlFbWFpbCIsIm1ldGhvZHMiLCJsb2dpbldpdGhvdXRQYXNzd29yZCIsImNoZWNrIiwiU3RyaW5nIiwidXNlciIsInVzZXJzIiwiZmluZE9uZSIsIiRvciIsIiRleGlzdHMiLCJlbWFpbHMiLCJhZGRyZXNzIiwidmVyaWZpZWQiLCJzZW5kTG9naW5FbWFpbCIsIl9pZCIsInVzZXJJZCIsImZpbmQiLCJ0b2tlblJlY29yZCIsIlJhbmRvbSIsInNlY3JldCIsIndoZW4iLCJEYXRlIiwidXBkYXRlIiwiJHB1c2giLCJfZW5zdXJlIiwidmVyaWZpY2F0aW9uVG9rZW5zIiwibG9naW5VcmwiLCJ1cmxzIiwidG8iLCJmcm9tIiwiZW1haWxUZW1wbGF0ZXMiLCJsb2dpbk5vUGFzc3dvcmQiLCJzdWJqZWN0IiwidGV4dCIsImh0bWwiLCJoZWFkZXJzIiwiRW1haWwiLCJzZW5kIiwic2l0ZU5hbWUiLCJ1cmwiLCJncmVldGluZyIsInByb2ZpbGUiLCJwdWJsaXNoIiwiZmllbGRzIiwiQnV0dG9uIiwiUmVhY3QiLCJQcm9wVHlwZXMiLCJMaW5rIiwiQ29tcG9uZW50IiwicmVuZGVyIiwibGFiZWwiLCJkaXNhYmxlZCIsImNsYXNzTmFtZSIsIm9uQ2xpY2siLCJwcm9wcyIsInByb3BUeXBlcyIsImZ1bmMiLCJCdXR0b25zIiwiYnV0dG9ucyIsImlkIiwiaSIsIkZpZWxkIiwiY29uc3RydWN0b3IiLCJzdGF0ZSIsIm1vdW50IiwidHJpZ2dlclVwZGF0ZSIsIm9uQ2hhbmdlIiwiaW5wdXQiLCJ0YXJnZXQiLCJjb21wb25lbnREaWRNb3VudCIsImNvbXBvbmVudERpZFVwZGF0ZSIsInByZXZQcm9wcyIsInNldFN0YXRlIiwiaGludCIsInJlcXVpcmVkIiwiZGVmYXVsdFZhbHVlIiwibWVzc2FnZSIsInJlZiIsInRyaW0iLCJGaWVsZHMiLCJGb3JtIiwiUmVhY3RET00iLCJmb3JtIiwiYWRkRXZlbnRMaXN0ZW5lciIsInByZXZlbnREZWZhdWx0Iiwib2F1dGhTZXJ2aWNlcyIsIm1lc3NhZ2VzIiwidHJhbnNsYXRlIiwicmVhZHkiLCJvYmplY3QiLCJpc1JlcXVpcmVkIiwiYm9vbCIsIkZvcm1NZXNzYWdlIiwiaXNPYmplY3QiLCJvYmoiLCJzdHlsZSIsImRlcHJlY2F0ZWQiLCJjb25zb2xlIiwid2FybiIsIkZvcm1NZXNzYWdlcyIsImZpbHRlciIsInV1aWQiLCJpbmplY3RUYXBFdmVudFBsdWdpbiIsIndpdGhUcmFja2VyIiwiVDluIiwiaW5kZXhCeSIsImFycmF5IiwicmVzdWx0Iiwid2FpdGluZyIsImJpbmQiLCJwcmV2U3RhdGUiLCJjaGFuZ2VTdGF0ZSIsImdldERlZmF1bHRGaWVsZFZhbHVlcyIsImdldERlcml2ZWRTdGF0ZUZyb21Qcm9wcyIsInN0YXRlRm9ybVN0YXRlIiwidmFsaWRhdGVGaWVsZCIsImZpZWxkIiwiZ2V0VXNlcm5hbWVPckVtYWlsRmllbGQiLCJoYW5kbGVDaGFuZ2UiLCJnZXRNZXNzYWdlRm9yRmllbGQiLCJnZXRVc2VybmFtZUZpZWxkIiwiZ2V0RW1haWxGaWVsZCIsImdldFBhc3N3b3JkRmllbGQiLCJnZXRTZXRQYXNzd29yZEZpZWxkIiwiZ2V0TmV3UGFzc3dvcmRGaWVsZCIsImV2dCIsInNldERlZmF1bHRGaWVsZFZhbHVlcyIsImxvZ2luRmllbGRzIiwiYXNzaWduIiwic2hvd1Bhc3N3b3JkQ2hhbmdlRm9ybSIsInNob3dFbnJvbGxBY2NvdW50Rm9ybSIsImxvZ2luQnV0dG9ucyIsInNpZ25PdXQiLCJzaG93Q3JlYXRlQWNjb3VudExpbmsiLCJzd2l0Y2hUb1NpZ25VcCIsInN3aXRjaFRvU2lnbkluIiwic2hvd0ZvcmdvdFBhc3N3b3JkTGluayIsInN3aXRjaFRvUGFzc3dvcmRSZXNldCIsInN3aXRjaFRvQ2hhbmdlUGFzc3dvcmQiLCJzaWduVXAiLCJzaG93U2lnbkluTGluayIsInNpZ25JbiIsInBhc3N3b3JkUmVzZXQiLCJwYXNzd29yZENoYW5nZSIsInN3aXRjaFRvU2lnbk91dCIsImNhbmNlbFJlc2V0UGFzc3dvcmQiLCJhIiwiYiIsInVuZGVmaW5lZCIsImZvcmJpZENsaWVudEFjY291bnRDcmVhdGlvbiIsImRlZmF1bHRzIiwibG9jYWxTdG9yYWdlIiwic2V0SXRlbSIsIkpTT04iLCJzdHJpbmdpZnkiLCJkZWZhdWx0RmllbGRWYWx1ZXMiLCJwYXJzZSIsImdldEl0ZW0iLCJjbGVhckRlZmF1bHRGaWVsZFZhbHVlcyIsInJlbW92ZUl0ZW0iLCJldmVudCIsImNsZWFyTWVzc2FnZXMiLCJsb2dvdXQiLCJ1c2VybmFtZU9yRW1haWwiLCJsb2dpblNlbGVjdG9yIiwibG9naW5XaXRoUGFzc3dvcmQiLCJyZWFzb24iLCJvYXV0aEJ1dHRvbnMiLCJvYXV0aFNpZ25JbiIsInNlcnZpY2VOYW1lIiwiY2FwaXRhbFNlcnZpY2UiLCJsb2dpbldpdGhTZXJ2aWNlIiwic2VsZiIsIlNpZ25VcCIsImNyZWF0ZVVzZXIiLCJwcm9taXNlIiwidGhlbiIsImZvcmdvdFBhc3N3b3JkIiwibmV3UGFzc3dvcmQiLCJyZXNldFBhc3N3b3JkIiwiY2hhbmdlUGFzc3dvcmQiLCJjbGVhclRpbWVvdXQiLCJoaWRlTWVzc2FnZVRpbW91dCIsImNvbXBvbmVudFdpbGxVbm1vdW50Iiwic3ltYm9sIiwiZGVmYXVsdFByb3BzIiwic3Vic2NyaWJlIiwiUGFzc3dvcmRPclNlcnZpY2UiLCJsYWJlbHMiLCJTb2NpYWxCdXR0b25zIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTTs7Ozs7Ozs7Ozs7QUNMQUEsTUFBTSxD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QUFVLEVBQVYsQ0FBYSxNQUFiLDZCQUF3QnlCLGFBQWEsQ0FBQzFCLEVBQUQsQ0FBckM7QUFBMkMsV0FBRyxFQUFFQztBQUFoRCxTQUFQO0FBQ0QsS0FGQSxDQURILENBREY7QUFPRDs7QUFWZ0Q7O0FBYW5EdkwsUUFBUSxDQUFDUSxFQUFULENBQVlnVCxhQUFaLEdBQTRCQSxhQUE1QixDIiwiZmlsZSI6Ii9wYWNrYWdlcy9zdGRfYWNjb3VudHMtdWkuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBpbXBvcnQgeyBjaGVja05wbVZlcnNpb25zIH0gZnJvbSAnbWV0ZW9yL3RtZWFzZGF5OmNoZWNrLW5wbS12ZXJzaW9ucyc7XG4vL1xuLy8gY2hlY2tOcG1WZXJzaW9ucyh7XG4vLyAgIFwicmVhY3RcIjogXCI+PTAuMTQuNyB8fCBeMTUuMC4wLXJjLjJcIixcbi8vICAgXCJyZWFjdC1kb21cIjogXCI+PTAuMTQuNyB8fCBeMTUuMC4wLXJjLjJcIixcbi8vIH0pO1xuIiwiaW1wb3J0IHsgQWNjb3VudHMgfSBmcm9tICdtZXRlb3IvYWNjb3VudHMtYmFzZSc7XG5pbXBvcnQgJy4vaW1wb3J0cy9hY2NvdW50c191aS5qcyc7XG5pbXBvcnQgJy4vaW1wb3J0cy9sb2dpbl9zZXNzaW9uLmpzJztcbmltcG9ydCB7IHJlZGlyZWN0LCBTVEFURVMgfcKgZnJvbSAnLi9pbXBvcnRzL2hlbHBlcnMuanMnO1xuaW1wb3J0ICcuL2ltcG9ydHMvYXBpL3NlcnZlci9sb2dpbldpdGhvdXRQYXNzd29yZC5qcyc7XG5pbXBvcnQgJy4vaW1wb3J0cy9hcGkvc2VydmVyL3NlcnZpY2VzTGlzdFB1YmxpY2F0aW9uLmpzJztcbmltcG9ydCBMb2dpbkZvcm0gZnJvbSAnLi9pbXBvcnRzL3VpL2NvbXBvbmVudHMvTG9naW5Gb3JtLmpzeCc7XG5cbmV4cG9ydCB7XG4gIExvZ2luRm9ybSBhcyBkZWZhdWx0LFxuICBBY2NvdW50cyxcbiAgU1RBVEVTLFxufTtcbiIsImltcG9ydCB7IEFjY291bnRzIH0gZnJvbSAnbWV0ZW9yL2FjY291bnRzLWJhc2UnO1xuaW1wb3J0IHtcbiAgcmVkaXJlY3QsXG4gIHZhbGlkYXRlUGFzc3dvcmQsXG4gIHZhbGlkYXRlRW1haWwsXG4gIHZhbGlkYXRlVXNlcm5hbWUsXG59IGZyb20gJy4vaGVscGVycy5qcyc7XG5cbi8qKlxuICogQHN1bW1hcnkgQWNjb3VudHMgVUlcbiAqIEBuYW1lc3BhY2VcbiAqIEBtZW1iZXJPZiBBY2NvdW50c1xuICovXG5BY2NvdW50cy51aSA9IHt9O1xuXG5BY2NvdW50cy51aS5fb3B0aW9ucyA9IHtcbiAgcmVxdWVzdFBlcm1pc3Npb25zOiBbXSxcbiAgcmVxdWVzdE9mZmxpbmVUb2tlbjoge30sXG4gIGZvcmNlQXBwcm92YWxQcm9tcHQ6IHt9LFxuICByZXF1aXJlRW1haWxWZXJpZmljYXRpb246IGZhbHNlLFxuICBwYXNzd29yZFNpZ251cEZpZWxkczogJ0VNQUlMX09OTFlfTk9fUEFTU1dPUkQnLFxuICBtaW5pbXVtUGFzc3dvcmRMZW5ndGg6IDcsXG4gIGxvZ2luUGF0aDogJy8nLFxuICBzaWduVXBQYXRoOiBudWxsLFxuICByZXNldFBhc3N3b3JkUGF0aDogbnVsbCxcbiAgcHJvZmlsZVBhdGg6ICcvJyxcbiAgY2hhbmdlUGFzc3dvcmRQYXRoOiBudWxsLFxuICBob21lUm91dGVQYXRoOiAnLycsXG4gIG9uU3VibWl0SG9vazogKCkgPT4ge30sXG4gIG9uUHJlU2lnblVwSG9vazogKCkgPT4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiByZXNvbHZlKCkpLFxuICBvblBvc3RTaWduVXBIb29rOiAoKSA9PiByZWRpcmVjdChgJHtBY2NvdW50cy51aS5fb3B0aW9ucy5ob21lUm91dGVQYXRofWApLFxuICBvbkVucm9sbEFjY291bnRIb29rOiAoKSA9PiByZWRpcmVjdChgJHtBY2NvdW50cy51aS5fb3B0aW9ucy5sb2dpblBhdGh9YCksXG4gIG9uUmVzZXRQYXNzd29yZEhvb2s6ICgpID0+IHJlZGlyZWN0KGAke0FjY291bnRzLnVpLl9vcHRpb25zLmxvZ2luUGF0aH1gKSxcbiAgb25WZXJpZnlFbWFpbEhvb2s6ICgpID0+IHJlZGlyZWN0KGAke0FjY291bnRzLnVpLl9vcHRpb25zLnByb2ZpbGVQYXRofWApLFxuICBvblNpZ25lZEluSG9vazogKCkgPT4gcmVkaXJlY3QoYCR7QWNjb3VudHMudWkuX29wdGlvbnMuaG9tZVJvdXRlUGF0aH1gKSxcbiAgb25TaWduZWRPdXRIb29rOiAoKSA9PiByZWRpcmVjdChgJHtBY2NvdW50cy51aS5fb3B0aW9ucy5ob21lUm91dGVQYXRofWApLFxuICBlbWFpbFBhdHRlcm46IG5ldyBSZWdFeHAoJ1teQF0rQFteQFxcLl17Mix9XFwuW15cXC5AXSsnKSxcbiAgYnJvd3Nlckhpc3Rvcnk6IG51bGwsXG59O1xuXG4vKipcbiAqIEBzdW1tYXJ5IENvbmZpZ3VyZSB0aGUgYmVoYXZpb3Igb2YgW2A8QWNjb3VudHMudWkuTG9naW5Gb3JtIC8+YF0oI3JlYWN0LWFjY291bnRzLXVpKS5cbiAqIEBhbnl3aGVyZVxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zLnJlcXVlc3RQZXJtaXNzaW9ucyBXaGljaCBbcGVybWlzc2lvbnNdKCNyZXF1ZXN0cGVybWlzc2lvbnMpIHRvIHJlcXVlc3QgZnJvbSB0aGUgdXNlciBmb3IgZWFjaCBleHRlcm5hbCBzZXJ2aWNlLlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMucmVxdWVzdE9mZmxpbmVUb2tlbiBUbyBhc2sgdGhlIHVzZXIgZm9yIHBlcm1pc3Npb24gdG8gYWN0IG9uIHRoZWlyIGJlaGFsZiB3aGVuIG9mZmxpbmUsIG1hcCB0aGUgcmVsZXZhbnQgZXh0ZXJuYWwgc2VydmljZSB0byBgdHJ1ZWAuIEN1cnJlbnRseSBvbmx5IHN1cHBvcnRlZCB3aXRoIEdvb2dsZS4gU2VlIFtNZXRlb3IubG9naW5XaXRoRXh0ZXJuYWxTZXJ2aWNlXSgjbWV0ZW9yX2xvZ2lud2l0aGV4dGVybmFsc2VydmljZSkgZm9yIG1vcmUgZGV0YWlscy5cbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zLmZvcmNlQXBwcm92YWxQcm9tcHQgSWYgdHJ1ZSwgZm9yY2VzIHRoZSB1c2VyIHRvIGFwcHJvdmUgdGhlIGFwcCdzIHBlcm1pc3Npb25zLCBldmVuIGlmIHByZXZpb3VzbHkgYXBwcm92ZWQuIEN1cnJlbnRseSBvbmx5IHN1cHBvcnRlZCB3aXRoIEdvb2dsZS5cbiAqIEBwYXJhbSB7U3RyaW5nfSBvcHRpb25zLnBhc3N3b3JkU2lnbnVwRmllbGRzIFdoaWNoIGZpZWxkcyB0byBkaXNwbGF5IGluIHRoZSB1c2VyIGNyZWF0aW9uIGZvcm0uIE9uZSBvZiAnYFVTRVJOQU1FX0FORF9FTUFJTGAnLCAnYFVTRVJOQU1FX0FORF9PUFRJT05BTF9FTUFJTGAnLCAnYFVTRVJOQU1FX09OTFlgJywgJ2BFTUFJTF9PTkxZYCcsIG9yICdgTk9fUEFTU1dPUkRgJyAoZGVmYXVsdCkuXG4gKi9cbkFjY291bnRzLnVpLmNvbmZpZyA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgLy8gdmFsaWRhdGUgb3B0aW9ucyBrZXlzXG4gIGNvbnN0IFZBTElEX0tFWVMgPSBbXG4gICAgJ3Bhc3N3b3JkU2lnbnVwRmllbGRzJyxcbiAgICAncmVxdWVzdFBlcm1pc3Npb25zJyxcbiAgICAncmVxdWVzdE9mZmxpbmVUb2tlbicsXG4gICAgJ2ZvcmJpZENsaWVudEFjY291bnRDcmVhdGlvbicsXG4gICAgJ3JlcXVpcmVFbWFpbFZlcmlmaWNhdGlvbicsXG4gICAgJ21pbmltdW1QYXNzd29yZExlbmd0aCcsXG4gICAgJ2xvZ2luUGF0aCcsXG4gICAgJ3NpZ25VcFBhdGgnLFxuICAgICdyZXNldFBhc3N3b3JkUGF0aCcsXG4gICAgJ3Byb2ZpbGVQYXRoJyxcbiAgICAnY2hhbmdlUGFzc3dvcmRQYXRoJyxcbiAgICAnaG9tZVJvdXRlUGF0aCcsXG4gICAgJ29uU3VibWl0SG9vaycsXG4gICAgJ29uUHJlU2lnblVwSG9vaycsXG4gICAgJ29uUG9zdFNpZ25VcEhvb2snLFxuICAgICdvbkVucm9sbEFjY291bnRIb29rJyxcbiAgICAnb25SZXNldFBhc3N3b3JkSG9vaycsXG4gICAgJ29uVmVyaWZ5RW1haWxIb29rJyxcbiAgICAnb25TaWduZWRJbkhvb2snLFxuICAgICdvblNpZ25lZE91dEhvb2snLFxuICAgICd2YWxpZGF0ZUZpZWxkJyxcbiAgICAnZW1haWxQYXR0ZXJuJyxcbiAgICAnYnJvd3Nlckhpc3RvcnknICAgIC8vIFNob3VsZCBwcm9iYWJseSBtYWtlIHRoZSByZWRpcmVjdCBtZXRob2QgY29uZmlndXJhYmxlIGluc3RlYWRcbiAgXTtcblxuICBPYmplY3Qua2V5cyhvcHRpb25zKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICBpZiAoIVZBTElEX0tFWVMuaW5jbHVkZXMoa2V5KSlcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkFjY291bnRzLnVpLmNvbmZpZzogSW52YWxpZCBrZXk6IFwiICsga2V5KTtcbiAgfSk7XG5cbiAgLy8gRGVhbCB3aXRoIGBwYXNzd29yZFNpZ251cEZpZWxkc2BcbiAgaWYgKG9wdGlvbnMucGFzc3dvcmRTaWdudXBGaWVsZHMpIHtcbiAgICBpZiAoW1xuICAgICAgXCJVU0VSTkFNRV9BTkRfRU1BSUxcIixcbiAgICAgIFwiVVNFUk5BTUVfQU5EX09QVElPTkFMX0VNQUlMXCIsXG4gICAgICBcIlVTRVJOQU1FX09OTFlcIixcbiAgICAgIFwiRU1BSUxfT05MWVwiLFxuICAgICAgXCJFTUFJTF9PTkxZX05PX1BBU1NXT1JEXCIsXG4gICAgICBcIlVTRVJOQU1FX0FORF9FTUFJTF9OT19QQVNTV09SRFwiXG4gICAgXS5pbmNsdWRlcyhvcHRpb25zLnBhc3N3b3JkU2lnbnVwRmllbGRzKSkge1xuICAgICAgQWNjb3VudHMudWkuX29wdGlvbnMucGFzc3dvcmRTaWdudXBGaWVsZHMgPSBvcHRpb25zLnBhc3N3b3JkU2lnbnVwRmllbGRzO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkFjY291bnRzLnVpLmNvbmZpZzogSW52YWxpZCBvcHRpb24gZm9yIGBwYXNzd29yZFNpZ251cEZpZWxkc2A6IFwiICsgb3B0aW9ucy5wYXNzd29yZFNpZ251cEZpZWxkcyk7XG4gICAgfVxuICB9XG5cbiAgLy8gRGVhbCB3aXRoIGByZXF1ZXN0UGVybWlzc2lvbnNgXG4gIGlmIChvcHRpb25zLnJlcXVlc3RQZXJtaXNzaW9ucykge1xuICAgIE9iamVjdC5rZXlzKG9wdGlvbnMucmVxdWVzdFBlcm1pc3Npb25zKS5mb3JFYWNoKHNlcnZpY2UgPT4ge1xuICAgICAgY29uc3Qgc2NvcGUgPSBvcHRpb25zLnJlcXVlc3RQZXJtaXNzaW9uc1tzZXJ2aWNlXTtcbiAgICAgIGlmIChBY2NvdW50cy51aS5fb3B0aW9ucy5yZXF1ZXN0UGVybWlzc2lvbnNbc2VydmljZV0pIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQWNjb3VudHMudWkuY29uZmlnOiBDYW4ndCBzZXQgYHJlcXVlc3RQZXJtaXNzaW9uc2AgbW9yZSB0aGFuIG9uY2UgZm9yIFwiICsgc2VydmljZSk7XG4gICAgICB9XG4gICAgICBlbHNlIGlmICghKHNjb3BlIGluc3RhbmNlb2YgQXJyYXkpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkFjY291bnRzLnVpLmNvbmZpZzogVmFsdWUgZm9yIGByZXF1ZXN0UGVybWlzc2lvbnNgIG11c3QgYmUgYW4gYXJyYXlcIik7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgQWNjb3VudHMudWkuX29wdGlvbnMucmVxdWVzdFBlcm1pc3Npb25zW3NlcnZpY2VdID0gc2NvcGU7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvLyBEZWFsIHdpdGggYHJlcXVlc3RPZmZsaW5lVG9rZW5gXG4gIGlmIChvcHRpb25zLnJlcXVlc3RPZmZsaW5lVG9rZW4pIHtcbiAgICBPYmplY3Qua2V5cyhvcHRpb25zLnJlcXVlc3RPZmZsaW5lVG9rZW4pLmZvckVhY2goc2VydmljZSA9PiB7XG4gICAgICBjb25zdCB2YWx1ZSA9IG9wdGlvbnMucmVxdWVzdE9mZmxpbmVUb2tlbltzZXJ2aWNlXTtcbiAgICAgIGlmIChzZXJ2aWNlICE9PSAnZ29vZ2xlJylcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQWNjb3VudHMudWkuY29uZmlnOiBgcmVxdWVzdE9mZmxpbmVUb2tlbmAgb25seSBzdXBwb3J0ZWQgZm9yIEdvb2dsZSBsb2dpbiBhdCB0aGUgbW9tZW50LlwiKTtcblxuICAgICAgaWYgKEFjY291bnRzLnVpLl9vcHRpb25zLnJlcXVlc3RPZmZsaW5lVG9rZW5bc2VydmljZV0pIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQWNjb3VudHMudWkuY29uZmlnOiBDYW4ndCBzZXQgYHJlcXVlc3RPZmZsaW5lVG9rZW5gIG1vcmUgdGhhbiBvbmNlIGZvciBcIiArIHNlcnZpY2UpO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIEFjY291bnRzLnVpLl9vcHRpb25zLnJlcXVlc3RPZmZsaW5lVG9rZW5bc2VydmljZV0gPSB2YWx1ZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8vIERlYWwgd2l0aCBgZm9yY2VBcHByb3ZhbFByb21wdGBcbiAgaWYgKG9wdGlvbnMuZm9yY2VBcHByb3ZhbFByb21wdCkge1xuICAgIE9iamVjdC5rZXlzKG9wdGlvbnMuZm9yY2VBcHByb3ZhbFByb21wdCkuZm9yRWFjaChzZXJ2aWNlID0+IHtcbiAgICAgIGNvbnN0IHZhbHVlID0gb3B0aW9ucy5mb3JjZUFwcHJvdmFsUHJvbXB0W3NlcnZpY2VdO1xuICAgICAgaWYgKHNlcnZpY2UgIT09ICdnb29nbGUnKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJBY2NvdW50cy51aS5jb25maWc6IGBmb3JjZUFwcHJvdmFsUHJvbXB0YCBvbmx5IHN1cHBvcnRlZCBmb3IgR29vZ2xlIGxvZ2luIGF0IHRoZSBtb21lbnQuXCIpO1xuXG4gICAgICBpZiAoQWNjb3VudHMudWkuX29wdGlvbnMuZm9yY2VBcHByb3ZhbFByb21wdFtzZXJ2aWNlXSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJBY2NvdW50cy51aS5jb25maWc6IENhbid0IHNldCBgZm9yY2VBcHByb3ZhbFByb21wdGAgbW9yZSB0aGFuIG9uY2UgZm9yIFwiICsgc2VydmljZSk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgQWNjb3VudHMudWkuX29wdGlvbnMuZm9yY2VBcHByb3ZhbFByb21wdFtzZXJ2aWNlXSA9IHZhbHVlO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLy8gRGVhbCB3aXRoIGByZXF1aXJlRW1haWxWZXJpZmljYXRpb25gXG4gIGlmIChvcHRpb25zLnJlcXVpcmVFbWFpbFZlcmlmaWNhdGlvbikge1xuICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5yZXF1aXJlRW1haWxWZXJpZmljYXRpb24gIT0gJ2Jvb2xlYW4nKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEFjY291bnRzLnVpLmNvbmZpZzogXCJyZXF1aXJlRW1haWxWZXJpZmljYXRpb25cIiBub3QgYSBib29sZWFuYCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgQWNjb3VudHMudWkuX29wdGlvbnMucmVxdWlyZUVtYWlsVmVyaWZpY2F0aW9uID0gb3B0aW9ucy5yZXF1aXJlRW1haWxWZXJpZmljYXRpb247XG4gICAgfVxuICB9XG5cbiAgLy8gRGVhbCB3aXRoIGBtaW5pbXVtUGFzc3dvcmRMZW5ndGhgXG4gIGlmIChvcHRpb25zLm1pbmltdW1QYXNzd29yZExlbmd0aCkge1xuICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5taW5pbXVtUGFzc3dvcmRMZW5ndGggIT0gJ251bWJlcicpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQWNjb3VudHMudWkuY29uZmlnOiBcIm1pbmltdW1QYXNzd29yZExlbmd0aFwiIG5vdCBhIG51bWJlcmApO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIEFjY291bnRzLnVpLl9vcHRpb25zLm1pbmltdW1QYXNzd29yZExlbmd0aCA9IG9wdGlvbnMubWluaW11bVBhc3N3b3JkTGVuZ3RoO1xuICAgIH1cbiAgfVxuXG4gIC8vIERlYWwgd2l0aCB0aGUgaG9va3MuXG4gIGZvciAobGV0IGhvb2sgb2YgW1xuICAgICdvblN1Ym1pdEhvb2snLFxuICAgICdvblByZVNpZ25VcEhvb2snLFxuICAgICdvblBvc3RTaWduVXBIb29rJyxcbiAgXSkge1xuICAgIGlmIChvcHRpb25zW2hvb2tdKSB7XG4gICAgICBpZiAodHlwZW9mIG9wdGlvbnNbaG9va10gIT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEFjY291bnRzLnVpLmNvbmZpZzogXCIke2hvb2t9XCIgbm90IGEgZnVuY3Rpb25gKTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBBY2NvdW50cy51aS5fb3B0aW9uc1tob29rXSA9IG9wdGlvbnNbaG9va107XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gRGVhbCB3aXRoIHBhdHRlcm4uXG4gIGZvciAobGV0IGhvb2sgb2YgW1xuICAgICdlbWFpbFBhdHRlcm4nLFxuICBdKSB7XG4gICAgaWYgKG9wdGlvbnNbaG9va10pIHtcbiAgICAgIGlmICghKG9wdGlvbnNbaG9va10gaW5zdGFuY2VvZiBSZWdFeHApKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgQWNjb3VudHMudWkuY29uZmlnOiBcIiR7aG9va31cIiBub3QgYSBSZWd1bGFyIEV4cHJlc3Npb25gKTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBBY2NvdW50cy51aS5fb3B0aW9uc1tob29rXSA9IG9wdGlvbnNbaG9va107XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gZGVhbCB3aXRoIHRoZSBwYXRocy5cbiAgZm9yIChsZXQgcGF0aCBvZiBbXG4gICAgJ2xvZ2luUGF0aCcsXG4gICAgJ3NpZ25VcFBhdGgnLFxuICAgICdyZXNldFBhc3N3b3JkUGF0aCcsXG4gICAgJ3Byb2ZpbGVQYXRoJyxcbiAgICAnY2hhbmdlUGFzc3dvcmRQYXRoJyxcbiAgICAnaG9tZVJvdXRlUGF0aCdcbiAgXSkge1xuICAgIGlmICh0eXBlb2Ygb3B0aW9uc1twYXRoXSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGlmIChvcHRpb25zW3BhdGhdICE9PSBudWxsICYmIHR5cGVvZiBvcHRpb25zW3BhdGhdICE9PSAnc3RyaW5nJykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEFjY291bnRzLnVpLmNvbmZpZzogJHtwYXRofSBpcyBub3QgYSBzdHJpbmcgb3IgbnVsbGApO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIEFjY291bnRzLnVpLl9vcHRpb25zW3BhdGhdID0gb3B0aW9uc1twYXRoXTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBkZWFsIHdpdGggcmVkaXJlY3QgaG9va3MuXG4gIGZvciAobGV0IGhvb2sgb2YgW1xuICAgICAgJ29uRW5yb2xsQWNjb3VudEhvb2snLFxuICAgICAgJ29uUmVzZXRQYXNzd29yZEhvb2snLFxuICAgICAgJ29uVmVyaWZ5RW1haWxIb29rJyxcbiAgICAgICdvblNpZ25lZEluSG9vaycsXG4gICAgICAnb25TaWduZWRPdXRIb29rJ10pIHtcbiAgICBpZiAob3B0aW9uc1tob29rXSkge1xuICAgICAgaWYgKHR5cGVvZiBvcHRpb25zW2hvb2tdID09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgQWNjb3VudHMudWkuX29wdGlvbnNbaG9va10gPSBvcHRpb25zW2hvb2tdO1xuICAgICAgfVxuICAgICAgZWxzZSBpZiAodHlwZW9mIG9wdGlvbnNbaG9va10gPT0gJ3N0cmluZycpIHtcbiAgICAgICAgQWNjb3VudHMudWkuX29wdGlvbnNbaG9va10gPSAoKSA9PiByZWRpcmVjdChvcHRpb25zW2hvb2tdKTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEFjY291bnRzLnVpLmNvbmZpZzogXCIke2hvb2t9XCIgbm90IGEgZnVuY3Rpb24gb3IgYW4gYWJzb2x1dGUgb3IgcmVsYXRpdmUgcGF0aGApO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIERlYWwgd2l0aCBgYnJvd3Nlckhpc3RvcnlgXG4gIGlmIChvcHRpb25zLmJyb3dzZXJIaXN0b3J5KSB7XG4gICAgaWYgKHR5cGVvZiBvcHRpb25zLmJyb3dzZXJIaXN0b3J5ICE9ICdvYmplY3QnKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEFjY291bnRzLnVpLmNvbmZpZzogXCJicm93c2VySGlzdG9yeVwiIG5vdCBhbiBvYmplY3RgKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBBY2NvdW50cy51aS5fb3B0aW9ucy5icm93c2VySGlzdG9yeSA9IG9wdGlvbnMuYnJvd3Nlckhpc3Rvcnk7XG4gICAgfVxuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBBY2NvdW50cztcbiIsImxldCBicm93c2VySGlzdG9yeVxudHJ5IHsgYnJvd3Nlckhpc3RvcnkgPSByZXF1aXJlKCdyZWFjdC1yb3V0ZXInKS5icm93c2VySGlzdG9yeSB9IGNhdGNoKGUpIHt9XG5leHBvcnQgY29uc3QgbG9naW5CdXR0b25zU2Vzc2lvbiA9IEFjY291bnRzLl9sb2dpbkJ1dHRvbnNTZXNzaW9uO1xuZXhwb3J0IGNvbnN0IFNUQVRFUyA9IHtcbiAgU0lHTl9JTjogU3ltYm9sKCdTSUdOX0lOJyksXG4gIFNJR05fVVA6IFN5bWJvbCgnU0lHTl9VUCcpLFxuICBQUk9GSUxFOiBTeW1ib2woJ1BST0ZJTEUnKSxcbiAgUEFTU1dPUkRfQ0hBTkdFOiBTeW1ib2woJ1BBU1NXT1JEX0NIQU5HRScpLFxuICBQQVNTV09SRF9SRVNFVDogU3ltYm9sKCdQQVNTV09SRF9SRVNFVCcpLFxuICBFTlJPTExfQUNDT1VOVDogU3ltYm9sKCdFTlJPTExfQUNDT1VOVCcpXG59O1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0TG9naW5TZXJ2aWNlcygpIHtcbiAgLy8gRmlyc3QgbG9vayBmb3IgT0F1dGggc2VydmljZXMuXG4gIGNvbnN0IHNlcnZpY2VzID0gUGFja2FnZVsnYWNjb3VudHMtb2F1dGgnXSA/IEFjY291bnRzLm9hdXRoLnNlcnZpY2VOYW1lcygpIDogW107XG5cbiAgLy8gQmUgZXF1YWxseSBraW5kIHRvIGFsbCBsb2dpbiBzZXJ2aWNlcy4gVGhpcyBhbHNvIHByZXNlcnZlc1xuICAvLyBiYWNrd2FyZHMtY29tcGF0aWJpbGl0eS5cbiAgc2VydmljZXMuc29ydCgpO1xuXG4gIHJldHVybiBzZXJ2aWNlcy5tYXAoZnVuY3Rpb24obmFtZSl7XG4gICAgcmV0dXJuIHtuYW1lOiBuYW1lfTtcbiAgfSk7XG59O1xuLy8gRXhwb3J0IGdldExvZ2luU2VydmljZXMgdXNpbmcgb2xkIHN0eWxlIGdsb2JhbHMgZm9yIGFjY291bnRzLWJhc2Ugd2hpY2hcbi8vIHJlcXVpcmVzIGl0LlxudGhpcy5nZXRMb2dpblNlcnZpY2VzID0gZ2V0TG9naW5TZXJ2aWNlcztcblxuZXhwb3J0IGZ1bmN0aW9uIGhhc1Bhc3N3b3JkU2VydmljZSgpIHtcbiAgLy8gRmlyc3QgbG9vayBmb3IgT0F1dGggc2VydmljZXMuXG4gIHJldHVybiAhIVBhY2thZ2VbJ2FjY291bnRzLXBhc3N3b3JkJ107XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gbG9naW5SZXN1bHRDYWxsYmFjayhzZXJ2aWNlLCBlcnIpIHtcbiAgaWYgKCFlcnIpIHtcblxuICB9IGVsc2UgaWYgKGVyciBpbnN0YW5jZW9mIEFjY291bnRzLkxvZ2luQ2FuY2VsbGVkRXJyb3IpIHtcbiAgICAvLyBkbyBub3RoaW5nXG4gIH0gZWxzZSBpZiAoZXJyIGluc3RhbmNlb2YgU2VydmljZUNvbmZpZ3VyYXRpb24uQ29uZmlnRXJyb3IpIHtcblxuICB9IGVsc2Uge1xuICAgIC8vbG9naW5CdXR0b25zU2Vzc2lvbi5lcnJvck1lc3NhZ2UoZXJyLnJlYXNvbiB8fCBcIlVua25vd24gZXJyb3JcIik7XG4gIH1cblxuICBpZiAoTWV0ZW9yLmlzQ2xpZW50KSB7XG4gICAgaWYgKHR5cGVvZiByZWRpcmVjdCA9PT0gJ3N0cmluZycpe1xuICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnLyc7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBzZXJ2aWNlID09PSAnZnVuY3Rpb24nKXtcbiAgICAgIHNlcnZpY2UoKTtcbiAgICB9XG4gIH1cbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXNzd29yZFNpZ251cEZpZWxkcygpIHtcbiAgcmV0dXJuIEFjY291bnRzLnVpLl9vcHRpb25zLnBhc3N3b3JkU2lnbnVwRmllbGRzIHx8IFwiRU1BSUxfT05MWV9OT19QQVNTV09SRFwiO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlRW1haWwoZW1haWwsIHNob3dNZXNzYWdlLCBjbGVhck1lc3NhZ2UpIHtcbiAgaWYgKHBhc3N3b3JkU2lnbnVwRmllbGRzKCkgPT09IFwiVVNFUk5BTUVfQU5EX09QVElPTkFMX0VNQUlMXCIgJiYgZW1haWwgPT09ICcnKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgaWYgKEFjY291bnRzLnVpLl9vcHRpb25zLmVtYWlsUGF0dGVybi50ZXN0KGVtYWlsKSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9IGVsc2UgaWYgKCFlbWFpbCB8fCBlbWFpbC5sZW5ndGggPT09IDApIHtcbiAgICBzaG93TWVzc2FnZShcImVycm9yLmVtYWlsUmVxdWlyZWRcIiwgJ3dhcm5pbmcnLCBmYWxzZSwgJ2VtYWlsJyk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9IGVsc2Uge1xuICAgIHNob3dNZXNzYWdlKFwiZXJyb3IuYWNjb3VudHMuSW52YWxpZCBlbWFpbFwiLCAnd2FybmluZycsIGZhbHNlLCAnZW1haWwnKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlUGFzc3dvcmQocGFzc3dvcmQgPSAnJywgc2hvd01lc3NhZ2UsIGNsZWFyTWVzc2FnZSwgZmllbGRJZCA9ICdwYXNzd29yZCcpe1xuICBpZiAocGFzc3dvcmQubGVuZ3RoID49IEFjY291bnRzLnVpLl9vcHRpb25zLm1pbmltdW1QYXNzd29yZExlbmd0aCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9IGVsc2Uge1xuICAgIC8vIGNvbnN0IGVyck1zZyA9IFQ5bi5nZXQoXCJlcnJvci5taW5DaGFyXCIpLnJlcGxhY2UoLzcvLCBBY2NvdW50cy51aS5fb3B0aW9ucy5taW5pbXVtUGFzc3dvcmRMZW5ndGgpO1xuICAgIGNvbnN0IGVyck1zZyA9IFwiZXJyb3IubWluQ2hhclwiXG4gICAgc2hvd01lc3NhZ2UoZXJyTXNnLCAnd2FybmluZycsIGZhbHNlLCBmaWVsZElkKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn07XG5cbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZVVzZXJuYW1lKHVzZXJuYW1lLCBzaG93TWVzc2FnZSwgY2xlYXJNZXNzYWdlLCBmb3JtU3RhdGUpIHtcbiAgaWYgKCB1c2VybmFtZSApIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBlbHNlIHtcbiAgICBjb25zdCBmaWVsZE5hbWUgPSAocGFzc3dvcmRTaWdudXBGaWVsZHMoKSA9PT0gJ1VTRVJOQU1FX09OTFknIHx8IGZvcm1TdGF0ZSA9PT0gU1RBVEVTLlNJR05fVVApID8gJ3VzZXJuYW1lJyA6ICd1c2VybmFtZU9yRW1haWwnO1xuICAgIHNob3dNZXNzYWdlKFwiZXJyb3IudXNlcm5hbWVSZXF1aXJlZFwiLCAnd2FybmluZycsIGZhbHNlLCBmaWVsZE5hbWUpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVkaXJlY3QocmVkaXJlY3QpIHtcbiAgaWYgKE1ldGVvci5pc0NsaWVudCkge1xuICAgIGlmICh3aW5kb3cuaGlzdG9yeSkge1xuICAgICAgLy8gUnVuIGFmdGVyIGFsbCBhcHAgc3BlY2lmaWMgcmVkaXJlY3RzLCBpLmUuIHRvIHRoZSBsb2dpbiBzY3JlZW4uXG4gICAgICBNZXRlb3Iuc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIGlmIChQYWNrYWdlWydrYWRpcmE6Zmxvdy1yb3V0ZXInXSkge1xuICAgICAgICAgIFBhY2thZ2VbJ2thZGlyYTpmbG93LXJvdXRlciddLkZsb3dSb3V0ZXIuZ28ocmVkaXJlY3QpO1xuICAgICAgICB9IGVsc2UgaWYgKFBhY2thZ2VbJ2thZGlyYTpmbG93LXJvdXRlci1zc3InXSkge1xuICAgICAgICAgIFBhY2thZ2VbJ2thZGlyYTpmbG93LXJvdXRlci1zc3InXS5GbG93Um91dGVyLmdvKHJlZGlyZWN0KTtcbiAgICAgICAgfSBlbHNlIGlmIChBY2NvdW50cy51aS5fb3B0aW9ucy5icm93c2VySGlzdG9yeSkge1xuICAgICAgICAgIEFjY291bnRzLnVpLl9vcHRpb25zLmJyb3dzZXJIaXN0b3J5LnB1c2gocmVkaXJlY3QpO1xuICAgICAgICB9IGVsc2UgaWYgKGJyb3dzZXJIaXN0b3J5KSB7XG4gICAgICAgICAgYnJvd3Nlckhpc3RvcnkucHVzaChyZWRpcmVjdCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgd2luZG93Lmhpc3RvcnkucHVzaFN0YXRlKCB7fSAsICdyZWRpcmVjdCcsIHJlZGlyZWN0ICk7XG4gICAgICAgIH1cbiAgICAgIH0sIDEwMCk7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjYXBpdGFsaXplKHN0cmluZykge1xuICByZXR1cm4gc3RyaW5nLnJlcGxhY2UoL1xcLS8sICcgJykuc3BsaXQoJyAnKS5tYXAod29yZCA9PiB7XG4gICAgcmV0dXJuIHdvcmQuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyB3b3JkLnNsaWNlKDEpO1xuICB9KS5qb2luKCcgJyk7XG59XG4iLCJpbXBvcnQge0FjY291bnRzfSBmcm9tICdtZXRlb3IvYWNjb3VudHMtYmFzZSc7XG5pbXBvcnQge1xuICBTVEFURVMsXG4gIGxvZ2luUmVzdWx0Q2FsbGJhY2ssXG4gIGdldExvZ2luU2VydmljZXNcbn0gZnJvbSAnLi9oZWxwZXJzLmpzJztcblxuY29uc3QgVkFMSURfS0VZUyA9IFtcbiAgJ2Ryb3Bkb3duVmlzaWJsZScsXG5cbiAgLy8gWFhYIGNvbnNpZGVyIHJlcGxhY2luZyB0aGVzZSB3aXRoIG9uZSBrZXkgdGhhdCBoYXMgYW4gZW51bSBmb3IgdmFsdWVzLlxuICAnaW5TaWdudXBGbG93JyxcbiAgJ2luRm9yZ290UGFzc3dvcmRGbG93JyxcbiAgJ2luQ2hhbmdlUGFzc3dvcmRGbG93JyxcbiAgJ2luTWVzc2FnZU9ubHlGbG93JyxcblxuICAnZXJyb3JNZXNzYWdlJyxcbiAgJ2luZm9NZXNzYWdlJyxcblxuICAvLyBkaWFsb2dzIHdpdGggbWVzc2FnZXMgKGluZm8gYW5kIGVycm9yKVxuICAncmVzZXRQYXNzd29yZFRva2VuJyxcbiAgJ2Vucm9sbEFjY291bnRUb2tlbicsXG4gICdqdXN0VmVyaWZpZWRFbWFpbCcsXG4gICdqdXN0UmVzZXRQYXNzd29yZCcsXG5cbiAgJ2NvbmZpZ3VyZUxvZ2luU2VydmljZURpYWxvZ1Zpc2libGUnLFxuICAnY29uZmlndXJlTG9naW5TZXJ2aWNlRGlhbG9nU2VydmljZU5hbWUnLFxuICAnY29uZmlndXJlTG9naW5TZXJ2aWNlRGlhbG9nU2F2ZURpc2FibGVkJyxcbiAgJ2NvbmZpZ3VyZU9uRGVza3RvcFZpc2libGUnXG5dO1xuXG5leHBvcnQgY29uc3QgdmFsaWRhdGVLZXkgPSBmdW5jdGlvbiAoa2V5KSB7XG4gIGlmICghVkFMSURfS0VZUy5pbmNsdWRlcyhrZXkpKVxuICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQga2V5IGluIGxvZ2luQnV0dG9uc1Nlc3Npb246IFwiICsga2V5KTtcbn07XG5cbmV4cG9ydCBjb25zdCBLRVlfUFJFRklYID0gXCJNZXRlb3IubG9naW5CdXR0b25zLlwiO1xuXG4vLyBYWFggVGhpcyBzaG91bGQgcHJvYmFibHkgYmUgcGFja2FnZSBzY29wZSByYXRoZXIgdGhhbiBleHBvcnRlZFxuLy8gKHRoZXJlIHdhcyBldmVuIGEgY29tbWVudCB0byB0aGF0IGVmZmVjdCBoZXJlIGZyb20gYmVmb3JlIHdlIGhhZFxuLy8gbmFtZXNwYWNpbmcpIGJ1dCBhY2NvdW50cy11aS12aWV3ZXIgdXNlcyBpdCwgc28gbGVhdmUgaXQgYXMgaXMgZm9yXG4vLyBub3dcbkFjY291bnRzLl9sb2dpbkJ1dHRvbnNTZXNzaW9uID0ge1xuICBzZXQ6IGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgICB2YWxpZGF0ZUtleShrZXkpO1xuICAgIGlmIChbJ2Vycm9yTWVzc2FnZScsICdpbmZvTWVzc2FnZSddLmluY2x1ZGVzKGtleSkpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJEb24ndCBzZXQgZXJyb3JNZXNzYWdlIG9yIGluZm9NZXNzYWdlIGRpcmVjdGx5LiBJbnN0ZWFkLCB1c2UgZXJyb3JNZXNzYWdlKCkgb3IgaW5mb01lc3NhZ2UoKS5cIik7XG5cbiAgICB0aGlzLl9zZXQoa2V5LCB2YWx1ZSk7XG4gIH0sXG5cbiAgX3NldDogZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgIFNlc3Npb24uc2V0KEtFWV9QUkVGSVggKyBrZXksIHZhbHVlKTtcbiAgfSxcblxuICBnZXQ6IGZ1bmN0aW9uKGtleSkge1xuICAgIHZhbGlkYXRlS2V5KGtleSk7XG4gICAgcmV0dXJuIFNlc3Npb24uZ2V0KEtFWV9QUkVGSVggKyBrZXkpO1xuICB9XG59O1xuXG5pZiAoTWV0ZW9yLmlzQ2xpZW50KXtcbiAgLy8gSW4gdGhlIGxvZ2luIHJlZGlyZWN0IGZsb3csIHdlJ2xsIGhhdmUgdGhlIHJlc3VsdCBvZiB0aGUgbG9naW5cbiAgLy8gYXR0ZW1wdCBhdCBwYWdlIGxvYWQgdGltZSB3aGVuIHdlJ3JlIHJlZGlyZWN0ZWQgYmFjayB0byB0aGVcbiAgLy8gYXBwbGljYXRpb24uICBSZWdpc3RlciBhIGNhbGxiYWNrIHRvIHVwZGF0ZSB0aGUgVUkgKGkuZS4gdG8gY2xvc2VcbiAgLy8gdGhlIGRpYWxvZyBvbiBhIHN1Y2Nlc3NmdWwgbG9naW4gb3IgZGlzcGxheSB0aGUgZXJyb3Igb24gYSBmYWlsZWRcbiAgLy8gbG9naW4pLlxuICAvL1xuICBBY2NvdW50cy5vblBhZ2VMb2FkTG9naW4oZnVuY3Rpb24gKGF0dGVtcHRJbmZvKSB7XG4gICAgLy8gSWdub3JlIGlmIHdlIGhhdmUgYSBsZWZ0IG92ZXIgbG9naW4gYXR0ZW1wdCBmb3IgYSBzZXJ2aWNlIHRoYXQgaXMgbm8gbG9uZ2VyIHJlZ2lzdGVyZWQuXG4gICAgaWYgKGdldExvZ2luU2VydmljZXMoKS5tYXAoKHsgbmFtZSB9KSA9PiBuYW1lKS5pbmNsdWRlcyhhdHRlbXB0SW5mby50eXBlKSlcbiAgICAgIGxvZ2luUmVzdWx0Q2FsbGJhY2soYXR0ZW1wdEluZm8udHlwZSwgYXR0ZW1wdEluZm8uZXJyb3IpO1xuICB9KTtcblxuICBsZXQgZG9uZUNhbGxiYWNrO1xuXG4gIEFjY291bnRzLm9uUmVzZXRQYXNzd29yZExpbmsoZnVuY3Rpb24gKHRva2VuLCBkb25lKSB7XG4gICAgQWNjb3VudHMuX2xvZ2luQnV0dG9uc1Nlc3Npb24uc2V0KCdyZXNldFBhc3N3b3JkVG9rZW4nLCB0b2tlbik7XG4gICAgU2Vzc2lvbi5zZXQoS0VZX1BSRUZJWCArICdzdGF0ZScsICdyZXNldFBhc3N3b3JkVG9rZW4nKTtcbiAgICBkb25lQ2FsbGJhY2sgPSBkb25lO1xuXG4gICAgQWNjb3VudHMudWkuX29wdGlvbnMub25SZXNldFBhc3N3b3JkSG9vaygpO1xuICB9KTtcblxuICBBY2NvdW50cy5vbkVucm9sbG1lbnRMaW5rKGZ1bmN0aW9uICh0b2tlbiwgZG9uZSkge1xuICAgIEFjY291bnRzLl9sb2dpbkJ1dHRvbnNTZXNzaW9uLnNldCgnZW5yb2xsQWNjb3VudFRva2VuJywgdG9rZW4pO1xuICAgIFNlc3Npb24uc2V0KEtFWV9QUkVGSVggKyAnc3RhdGUnLCAnZW5yb2xsQWNjb3VudFRva2VuJyk7XG4gICAgZG9uZUNhbGxiYWNrID0gZG9uZTtcblxuICAgIEFjY291bnRzLnVpLl9vcHRpb25zLm9uRW5yb2xsQWNjb3VudEhvb2soKTtcbiAgfSk7XG5cbiAgQWNjb3VudHMub25FbWFpbFZlcmlmaWNhdGlvbkxpbmsoZnVuY3Rpb24gKHRva2VuLCBkb25lKSB7XG4gICAgQWNjb3VudHMudmVyaWZ5RW1haWwodG9rZW4sIGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgaWYgKCEgZXJyb3IpIHtcbiAgICAgICAgQWNjb3VudHMuX2xvZ2luQnV0dG9uc1Nlc3Npb24uc2V0KCdqdXN0VmVyaWZpZWRFbWFpbCcsIHRydWUpO1xuICAgICAgICBTZXNzaW9uLnNldChLRVlfUFJFRklYICsgJ3N0YXRlJywgJ2p1c3RWZXJpZmllZEVtYWlsJyk7XG4gICAgICAgIEFjY291bnRzLnVpLl9vcHRpb25zLm9uU2lnbmVkSW5Ib29rKCk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgQWNjb3VudHMudWkuX29wdGlvbnMub25WZXJpZnlFbWFpbEhvb2soKTtcbiAgICAgIH1cblxuICAgICAgZG9uZSgpO1xuICAgIH0pO1xuICB9KTtcbn1cbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IHsgQWNjb3VudHMgfSBmcm9tICdtZXRlb3IvYWNjb3VudHMtYmFzZSc7XG5cbi8vL1xuLy8vIExPR0lOIFdJVEhPVVQgUEFTU1dPUkRcbi8vL1xuXG4vLyBNZXRob2QgY2FsbGVkIGJ5IGEgdXNlciB0byByZXF1ZXN0IGEgcGFzc3dvcmQgcmVzZXQgZW1haWwuIFRoaXMgaXNcbi8vIHRoZSBzdGFydCBvZiB0aGUgcmVzZXQgcHJvY2Vzcy5cbk1ldGVvci5tZXRob2RzKHtcbiAgbG9naW5XaXRob3V0UGFzc3dvcmQ6IGZ1bmN0aW9uICh7IGVtYWlsLCB1c2VybmFtZSA9IG51bGwgfSkge1xuICAgIGlmICh1c2VybmFtZSAhPT0gbnVsbCkge1xuICAgICAgY2hlY2sodXNlcm5hbWUsIFN0cmluZyk7XG5cbiAgICAgIHZhciB1c2VyID0gTWV0ZW9yLnVzZXJzLmZpbmRPbmUoeyAkb3I6IFt7XG4gICAgICAgICAgXCJ1c2VybmFtZVwiOiB1c2VybmFtZSwgXCJlbWFpbHMuYWRkcmVzc1wiOiB7ICRleGlzdHM6IDEgfVxuICAgICAgICB9LCB7XG4gICAgICAgICAgXCJlbWFpbHMuYWRkcmVzc1wiOiBlbWFpbFxuICAgICAgICB9XVxuICAgICAgfSk7XG4gICAgICBpZiAoIXVzZXIpXG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAzLCBcIlVzZXIgbm90IGZvdW5kXCIpO1xuXG4gICAgICBlbWFpbCA9IHVzZXIuZW1haWxzWzBdLmFkZHJlc3M7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgY2hlY2soZW1haWwsIFN0cmluZyk7XG5cbiAgICAgIHZhciB1c2VyID0gTWV0ZW9yLnVzZXJzLmZpbmRPbmUoeyBcImVtYWlscy5hZGRyZXNzXCI6IGVtYWlsIH0pO1xuICAgICAgaWYgKCF1c2VyKVxuICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMywgXCJVc2VyIG5vdCBmb3VuZFwiKTtcbiAgICB9XG5cbiAgICBpZiAoQWNjb3VudHMudWkuX29wdGlvbnMucmVxdWlyZUVtYWlsVmVyaWZpY2F0aW9uKSB7XG4gICAgICBpZiAoIXVzZXIuZW1haWxzWzBdLnZlcmlmaWVkKSB7XG4gICAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoNDAzLCBcIkVtYWlsIG5vdCB2ZXJpZmllZFwiKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBBY2NvdW50cy5zZW5kTG9naW5FbWFpbCh1c2VyLl9pZCwgZW1haWwpO1xuICB9LFxufSk7XG5cbi8qKlxuICogQHN1bW1hcnkgU2VuZCBhbiBlbWFpbCB3aXRoIGEgbGluayB0aGUgdXNlciBjYW4gdXNlIHZlcmlmeSB0aGVpciBlbWFpbCBhZGRyZXNzLlxuICogQGxvY3VzIFNlcnZlclxuICogQHBhcmFtIHtTdHJpbmd9IHVzZXJJZCBUaGUgaWQgb2YgdGhlIHVzZXIgdG8gc2VuZCBlbWFpbCB0by5cbiAqIEBwYXJhbSB7U3RyaW5nfSBbZW1haWxdIE9wdGlvbmFsLiBXaGljaCBhZGRyZXNzIG9mIHRoZSB1c2VyJ3MgdG8gc2VuZCB0aGUgZW1haWwgdG8uIFRoaXMgYWRkcmVzcyBtdXN0IGJlIGluIHRoZSB1c2VyJ3MgYGVtYWlsc2AgbGlzdC4gRGVmYXVsdHMgdG8gdGhlIGZpcnN0IHVudmVyaWZpZWQgZW1haWwgaW4gdGhlIGxpc3QuXG4gKi9cbkFjY291bnRzLnNlbmRMb2dpbkVtYWlsID0gZnVuY3Rpb24gKHVzZXJJZCwgYWRkcmVzcykge1xuICAvLyBYWFggQWxzbyBnZW5lcmF0ZSBhIGxpbmsgdXNpbmcgd2hpY2ggc29tZW9uZSBjYW4gZGVsZXRlIHRoaXNcbiAgLy8gYWNjb3VudCBpZiB0aGV5IG93biBzYWlkIGFkZHJlc3MgYnV0IHdlcmVuJ3QgdGhvc2Ugd2hvIGNyZWF0ZWRcbiAgLy8gdGhpcyBhY2NvdW50LlxuXG4gIC8vIE1ha2Ugc3VyZSB0aGUgdXNlciBleGlzdHMsIGFuZCBhZGRyZXNzIGlzIG9uZSBvZiB0aGVpciBhZGRyZXNzZXMuXG4gIHZhciB1c2VyID0gTWV0ZW9yLnVzZXJzLmZpbmRPbmUodXNlcklkKTtcbiAgaWYgKCF1c2VyKVxuICAgIHRocm93IG5ldyBFcnJvcihcIkNhbid0IGZpbmQgdXNlclwiKTtcbiAgLy8gcGljayB0aGUgZmlyc3QgdW52ZXJpZmllZCBhZGRyZXNzIGlmIHdlIHdlcmVuJ3QgcGFzc2VkIGFuIGFkZHJlc3MuXG4gIGlmICghYWRkcmVzcykge1xuICAgIHZhciBlbWFpbCA9ICh1c2VyLmVtYWlscyB8fCBbXSkuZmluZCgoeyB2ZXJpZmllZCB9KSA9PiAhdmVyaWZpZWQpO1xuICAgIGFkZHJlc3MgPSAoZW1haWwgfHwge30pLmFkZHJlc3M7XG4gIH1cbiAgLy8gbWFrZSBzdXJlIHdlIGhhdmUgYSB2YWxpZCBhZGRyZXNzXG4gIGlmICghYWRkcmVzcyB8fCAhKHVzZXIuZW1haWxzIHx8IFtdKS5tYXAoKHsgYWRkcmVzcyB9KSA9PiBhZGRyZXNzKS5pbmNsdWRlcyhhZGRyZXNzKSlcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJObyBzdWNoIGVtYWlsIGFkZHJlc3MgZm9yIHVzZXIuXCIpO1xuXG5cbiAgdmFyIHRva2VuUmVjb3JkID0ge1xuICAgIHRva2VuOiBSYW5kb20uc2VjcmV0KCksXG4gICAgYWRkcmVzczogYWRkcmVzcyxcbiAgICB3aGVuOiBuZXcgRGF0ZSgpfTtcbiAgTWV0ZW9yLnVzZXJzLnVwZGF0ZShcbiAgICB7X2lkOiB1c2VySWR9LFxuICAgIHskcHVzaDogeydzZXJ2aWNlcy5lbWFpbC52ZXJpZmljYXRpb25Ub2tlbnMnOiB0b2tlblJlY29yZH19KTtcblxuICAvLyBiZWZvcmUgcGFzc2luZyB0byB0ZW1wbGF0ZSwgdXBkYXRlIHVzZXIgb2JqZWN0IHdpdGggbmV3IHRva2VuXG4gIE1ldGVvci5fZW5zdXJlKHVzZXIsICdzZXJ2aWNlcycsICdlbWFpbCcpO1xuICBpZiAoIXVzZXIuc2VydmljZXMuZW1haWwudmVyaWZpY2F0aW9uVG9rZW5zKSB7XG4gICAgdXNlci5zZXJ2aWNlcy5lbWFpbC52ZXJpZmljYXRpb25Ub2tlbnMgPSBbXTtcbiAgfVxuICB1c2VyLnNlcnZpY2VzLmVtYWlsLnZlcmlmaWNhdGlvblRva2Vucy5wdXNoKHRva2VuUmVjb3JkKTtcblxuICB2YXIgbG9naW5VcmwgPSBBY2NvdW50cy51cmxzLnZlcmlmeUVtYWlsKHRva2VuUmVjb3JkLnRva2VuKTtcblxuICB2YXIgb3B0aW9ucyA9IHtcbiAgICB0bzogYWRkcmVzcyxcbiAgICBmcm9tOiBBY2NvdW50cy5lbWFpbFRlbXBsYXRlcy5sb2dpbk5vUGFzc3dvcmQuZnJvbVxuICAgICAgPyBBY2NvdW50cy5lbWFpbFRlbXBsYXRlcy5sb2dpbk5vUGFzc3dvcmQuZnJvbSh1c2VyKVxuICAgICAgOiBBY2NvdW50cy5lbWFpbFRlbXBsYXRlcy5mcm9tLFxuICAgIHN1YmplY3Q6IEFjY291bnRzLmVtYWlsVGVtcGxhdGVzLmxvZ2luTm9QYXNzd29yZC5zdWJqZWN0KHVzZXIpXG4gIH07XG5cbiAgaWYgKHR5cGVvZiBBY2NvdW50cy5lbWFpbFRlbXBsYXRlcy5sb2dpbk5vUGFzc3dvcmQudGV4dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIG9wdGlvbnMudGV4dCA9XG4gICAgICBBY2NvdW50cy5lbWFpbFRlbXBsYXRlcy5sb2dpbk5vUGFzc3dvcmQudGV4dCh1c2VyLCBsb2dpblVybCk7XG4gIH1cblxuICBpZiAodHlwZW9mIEFjY291bnRzLmVtYWlsVGVtcGxhdGVzLmxvZ2luTm9QYXNzd29yZC5odG1sID09PSAnZnVuY3Rpb24nKVxuICAgIG9wdGlvbnMuaHRtbCA9XG4gICAgICBBY2NvdW50cy5lbWFpbFRlbXBsYXRlcy5sb2dpbk5vUGFzc3dvcmQuaHRtbCh1c2VyLCBsb2dpblVybCk7XG5cbiAgaWYgKHR5cGVvZiBBY2NvdW50cy5lbWFpbFRlbXBsYXRlcy5oZWFkZXJzID09PSAnb2JqZWN0Jykge1xuICAgIG9wdGlvbnMuaGVhZGVycyA9IEFjY291bnRzLmVtYWlsVGVtcGxhdGVzLmhlYWRlcnM7XG4gIH1cblxuICBFbWFpbC5zZW5kKG9wdGlvbnMpO1xufTtcblxuLy8gQ2hlY2sgZm9yIGluc3RhbGxlZCBhY2NvdW50cy1wYXNzd29yZCBkZXBlbmRlbmN5LlxuaWYgKEFjY291bnRzLmVtYWlsVGVtcGxhdGVzKSB7XG4gIEFjY291bnRzLmVtYWlsVGVtcGxhdGVzLmxvZ2luTm9QYXNzd29yZCA9IHtcbiAgICBzdWJqZWN0OiBmdW5jdGlvbih1c2VyKSB7XG4gICAgICByZXR1cm4gXCJMb2dpbiBvbiBcIiArIEFjY291bnRzLmVtYWlsVGVtcGxhdGVzLnNpdGVOYW1lO1xuICAgIH0sXG4gICAgdGV4dDogZnVuY3Rpb24odXNlciwgdXJsKSB7XG4gICAgICB2YXIgZ3JlZXRpbmcgPSAodXNlci5wcm9maWxlICYmIHVzZXIucHJvZmlsZS5uYW1lKSA/XG4gICAgICAgICAgICAoXCJIZWxsbyBcIiArIHVzZXIucHJvZmlsZS5uYW1lICsgXCIsXCIpIDogXCJIZWxsbyxcIjtcbiAgICAgIHJldHVybiBgJHtncmVldGluZ31cblRvIGxvZ2luLCBzaW1wbHkgY2xpY2sgdGhlIGxpbmsgYmVsb3cuXG4ke3VybH1cblRoYW5rcy5cbmA7XG4gICAgfVxuICB9O1xufVxuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5pbXBvcnQgeyBnZXRMb2dpblNlcnZpY2VzIH0gZnJvbSAnLi4vLi4vaGVscGVycy5qcyc7XG5cbk1ldGVvci5wdWJsaXNoKCdzZXJ2aWNlc0xpc3QnLCBmdW5jdGlvbigpIHtcbiAgbGV0IHNlcnZpY2VzID0gZ2V0TG9naW5TZXJ2aWNlcygpO1xuICBpZiAoUGFja2FnZVsnYWNjb3VudHMtcGFzc3dvcmQnXSkge1xuICAgIHNlcnZpY2VzLnB1c2goe25hbWU6ICdwYXNzd29yZCd9KTtcbiAgfVxuICBsZXQgZmllbGRzID0ge307XG4gIC8vIFB1Ymxpc2ggdGhlIGV4aXN0aW5nIHNlcnZpY2VzIGZvciBhIHVzZXIsIG9ubHkgbmFtZSBvciBub3RoaW5nIGVsc2UuXG4gIHNlcnZpY2VzLmZvckVhY2goc2VydmljZSA9PiBmaWVsZHNbYHNlcnZpY2VzLiR7c2VydmljZS5uYW1lfS5uYW1lYF0gPSAxKTtcbiAgcmV0dXJuIE1ldGVvci51c2Vycy5maW5kKHsgX2lkOiB0aGlzLnVzZXJJZCB9LCB7IGZpZWxkczogZmllbGRzfSk7XG59KTtcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHsgQWNjb3VudHMgfSBmcm9tICdtZXRlb3IvYWNjb3VudHMtYmFzZSc7XG5cbmxldCBMaW5rO1xudHJ5IHsgTGluayA9IHJlcXVpcmUoJ3JlYWN0LXJvdXRlcicpLkxpbms7IH0gY2F0Y2goZSkge31cblxuZXhwb3J0IGNsYXNzIEJ1dHRvbiBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHJlbmRlciAoKSB7XG4gICAgY29uc3Qge1xuICAgICAgbGFiZWwsXG4gICAgICBocmVmID0gbnVsbCxcbiAgICAgIHR5cGUsXG4gICAgICBkaXNhYmxlZCA9IGZhbHNlLFxuICAgICAgY2xhc3NOYW1lLFxuICAgICAgb25DbGlja1xuICAgIH0gPSB0aGlzLnByb3BzO1xuICAgIGlmICh0eXBlID09ICdsaW5rJykge1xuICAgICAgLy8gU3VwcG9ydCBSZWFjdCBSb3V0ZXIuXG4gICAgICBpZiAoTGluayAmJiBocmVmKSB7XG4gICAgICAgIHJldHVybiA8TGluayB0bz17IGhyZWYgfcKgY2xhc3NOYW1lPXsgY2xhc3NOYW1lIH0+eyBsYWJlbCB9PC9MaW5rPjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiA8YcKgaHJlZj17IGhyZWYgfcKgY2xhc3NOYW1lPXsgY2xhc3NOYW1lIH0gb25DbGljaz17IG9uQ2xpY2sgfT57IGxhYmVsIH08L2E+O1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gPGJ1dHRvbiBjbGFzc05hbWU9eyBjbGFzc05hbWUgfVxuICAgICAgICAgICAgICAgICAgIHR5cGU9eyB0eXBlIH3CoFxuICAgICAgICAgICAgICAgICAgIGRpc2FibGVkPXsgZGlzYWJsZWQgfVxuICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eyBvbkNsaWNrIH0+eyBsYWJlbCB9PC9idXR0b24+O1xuICB9XG59XG5cbkJ1dHRvbi5wcm9wVHlwZXMgPSB7XG4gIG9uQ2xpY2s6IFByb3BUeXBlcy5mdW5jXG59O1xuXG5BY2NvdW50cy51aS5CdXR0b24gPSBCdXR0b247XG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0ICcuL0J1dHRvbi5qc3gnO1xuaW1wb3J0IHsgQWNjb3VudHMgfSBmcm9tICdtZXRlb3IvYWNjb3VudHMtYmFzZSc7XG5cbmV4cG9ydCBjbGFzcyBCdXR0b25zIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgcmVuZGVyICgpIHtcbiAgICBsZXQgeyBidXR0b25zID0ge30sIGNsYXNzTmFtZSA9IFwiYnV0dG9uc1wiIH0gPSB0aGlzLnByb3BzO1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT17IGNsYXNzTmFtZSB9PlxuICAgICAgICB7T2JqZWN0LmtleXMoYnV0dG9ucykubWFwKChpZCwgaSkgPT5cbiAgICAgICAgICA8QWNjb3VudHMudWkuQnV0dG9uIHsuLi5idXR0b25zW2lkXX0ga2V5PXtpfSAvPlxuICAgICAgICApfVxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufTtcblxuQWNjb3VudHMudWkuQnV0dG9ucyA9IEJ1dHRvbnM7XG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCB7IEFjY291bnRzIH0gZnJvbSAnbWV0ZW9yL2FjY291bnRzLWJhc2UnO1xuXG5leHBvcnQgY2xhc3MgRmllbGQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgbW91bnQ6IHRydWVcbiAgICB9O1xuICB9XG5cbiAgdHJpZ2dlclVwZGF0ZSgpIHtcbiAgICAvLyBUcmlnZ2VyIGFuIG9uQ2hhbmdlIG9uIGluaXRhbCBsb2FkLCB0byBzdXBwb3J0IGJyb3dzZXIgcHJlZmlsbGVkIHZhbHVlcy5cbiAgICBjb25zdCB7IG9uQ2hhbmdlIH0gPSB0aGlzLnByb3BzO1xuICAgIGlmICh0aGlzLmlucHV0ICYmIG9uQ2hhbmdlKSB7XG4gICAgICBvbkNoYW5nZSh7IHRhcmdldDogeyB2YWx1ZTogdGhpcy5pbnB1dC52YWx1ZSB8fCBcIlwiIH0gfSk7XG4gICAgfVxuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgdGhpcy50cmlnZ2VyVXBkYXRlKCk7XG4gIH1cblxuICBjb21wb25lbnREaWRVcGRhdGUocHJldlByb3BzKSB7XG4gICAgLy8gUmUtbW91bnQgY29tcG9uZW50IHNvIHRoYXQgd2UgZG9uJ3QgZXhwb3NlIGJyb3dzZXIgcHJlZmlsbGVkIHBhc3N3b3JkcyBpZiB0aGUgY29tcG9uZW50IHdhc1xuICAgIC8vIGEgcGFzc3dvcmQgYmVmb3JlIGFuZCBub3cgc29tZXRoaW5nIGVsc2UuXG4gICAgaWYgKHByZXZQcm9wcy5pZCAhPT0gdGhpcy5wcm9wcy5pZCkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7bW91bnQ6IGZhbHNlfSk7XG4gICAgfVxuICAgIGVsc2UgaWYgKCF0aGlzLnN0YXRlLm1vdW50KSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHttb3VudDogdHJ1ZX0pO1xuICAgICAgdGhpcy50cmlnZ2VyVXBkYXRlKCk7XG4gICAgfVxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHtcbiAgICAgIGlkLFxuICAgICAgaGludCxcbiAgICAgIGxhYmVsLFxuICAgICAgdHlwZSA9ICd0ZXh0JyxcbiAgICAgIG9uQ2hhbmdlLFxuICAgICAgcmVxdWlyZWQgPSBmYWxzZSxcbiAgICAgIGNsYXNzTmFtZSA9IFwiZmllbGRcIixcbiAgICAgIGRlZmF1bHRWYWx1ZSA9IFwiXCIsXG4gICAgICBtZXNzYWdlLFxuICAgIH0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IHsgbW91bnQgPSB0cnVlIH0gPSB0aGlzLnN0YXRlO1xuICAgIGlmICh0eXBlID09ICdub3RpY2UnKSB7XG4gICAgICByZXR1cm4gPGRpdiBjbGFzc05hbWU9eyBjbGFzc05hbWUgfT57IGxhYmVsIH08L2Rpdj47XG4gICAgfVxuICAgIHJldHVybiBtb3VudCA/IChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPXsgY2xhc3NOYW1lIH0+XG4gICAgICAgIDxsYWJlbCBodG1sRm9yPXsgaWQgfT57IGxhYmVsIH08L2xhYmVsPlxuICAgICAgICA8aW5wdXRcbiAgICAgICAgICBpZD17IGlkIH1cbiAgICAgICAgICByZWY9eyAocmVmKSA9PiB0aGlzLmlucHV0ID0gcmVmIH1cbiAgICAgICAgICB0eXBlPXsgdHlwZSB9XG4gICAgICAgICAgb25DaGFuZ2U9eyBvbkNoYW5nZSB9XG4gICAgICAgICAgcGxhY2Vob2xkZXI9eyBoaW50IH1cbiAgICAgICAgICBkZWZhdWx0VmFsdWU9eyBkZWZhdWx0VmFsdWUgfVxuICAgICAgICAvPlxuICAgICAgICB7bWVzc2FnZSAmJiAoXG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPXtbJ21lc3NhZ2UnLCBtZXNzYWdlLnR5cGVdLmpvaW4oJyAnKS50cmltKCl9PlxuICAgICAgICAgICAge21lc3NhZ2UubWVzc2FnZX08L3NwYW4+XG4gICAgICAgICl9XG4gICAgICA8L2Rpdj5cbiAgICApIDogbnVsbDtcbiAgfVxufVxuXG5GaWVsZC5wcm9wVHlwZXMgPSB7XG4gIG9uQ2hhbmdlOiBQcm9wVHlwZXMuZnVuY1xufTtcblxuQWNjb3VudHMudWkuRmllbGQgPSBGaWVsZDtcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBBY2NvdW50cyB9IGZyb20gJ21ldGVvci9hY2NvdW50cy1iYXNlJztcbmltcG9ydCAnLi9GaWVsZC5qc3gnO1xuXG5leHBvcnQgY2xhc3MgRmllbGRzIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgcmVuZGVyICgpIHtcbiAgICBsZXQgeyBmaWVsZHMgPSB7fSwgY2xhc3NOYW1lID0gXCJmaWVsZHNcIiB9ID0gdGhpcy5wcm9wcztcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9eyBjbGFzc05hbWUgfT5cbiAgICAgICAge09iamVjdC5rZXlzKGZpZWxkcykubWFwKChpZCwgaSkgPT5cbiAgICAgICAgICA8QWNjb3VudHMudWkuRmllbGQgey4uLmZpZWxkc1tpZF19IGtleT17aX0gLz5cbiAgICAgICAgKX1cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cblxuQWNjb3VudHMudWkuRmllbGRzID0gRmllbGRzO1xuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgUmVhY3RET00gZnJvbSAncmVhY3QtZG9tJztcbmltcG9ydCB7IEFjY291bnRzIH0gZnJvbSAnbWV0ZW9yL2FjY291bnRzLWJhc2UnO1xuXG5pbXBvcnQgJy4vRmllbGRzLmpzeCc7XG5pbXBvcnQgJy4vQnV0dG9ucy5qc3gnO1xuaW1wb3J0ICcuL0Zvcm1NZXNzYWdlLmpzeCc7XG5pbXBvcnQgJy4vUGFzc3dvcmRPclNlcnZpY2UuanN4JztcbmltcG9ydCAnLi9Tb2NpYWxCdXR0b25zLmpzeCc7XG5pbXBvcnQgJy4vRm9ybU1lc3NhZ2VzLmpzeCc7XG5cbmV4cG9ydCBjbGFzcyBGb3JtIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgbGV0IGZvcm0gPSB0aGlzLmZvcm07XG4gICAgaWYgKGZvcm0pIHtcbiAgICAgIGZvcm0uYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgKGUpID0+IHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHtcbiAgICAgIGhhc1Bhc3N3b3JkU2VydmljZSxcbiAgICAgIG9hdXRoU2VydmljZXMsXG4gICAgICBmaWVsZHMsXG4gICAgICBidXR0b25zLFxuICAgICAgZXJyb3IsXG4gICAgICBtZXNzYWdlcyxcbiAgICAgIHRyYW5zbGF0ZSxcbiAgICAgIHJlYWR5ID0gdHJ1ZSxcbiAgICAgIGNsYXNzTmFtZVxuICAgIH0gPSB0aGlzLnByb3BzO1xuICAgIHJldHVybiAoXG4gICAgICA8Zm9ybVxuICAgICAgICByZWY9eyhyZWYpID0+IHRoaXMuZm9ybSA9IHJlZn1cbiAgICAgICAgY2xhc3NOYW1lPXtbY2xhc3NOYW1lLCByZWFkeSA/IFwicmVhZHlcIiA6IG51bGxdLmpvaW4oJyAnKX1cbiAgICAgICAgY2xhc3NOYW1lPVwiYWNjb3VudHMtdWlcIlxuICAgICAgICBub1ZhbGlkYXRlXG4gICAgICA+XG4gICAgICAgIDxBY2NvdW50cy51aS5GaWVsZHMgZmllbGRzPXsgZmllbGRzIH0gLz5cbiAgICAgICAgPEFjY291bnRzLnVpLkJ1dHRvbnMgYnV0dG9ucz17IGJ1dHRvbnMgfSAvPlxuICAgICAgICA8QWNjb3VudHMudWkuUGFzc3dvcmRPclNlcnZpY2Ugb2F1dGhTZXJ2aWNlcz17IG9hdXRoU2VydmljZXMgfSB0cmFuc2xhdGU9eyB0cmFuc2xhdGUgfSAvPlxuICAgICAgICA8QWNjb3VudHMudWkuU29jaWFsQnV0dG9ucyBvYXV0aFNlcnZpY2VzPXsgb2F1dGhTZXJ2aWNlcyB9IC8+XG4gICAgICAgIDxBY2NvdW50cy51aS5Gb3JtTWVzc2FnZXMgbWVzc2FnZXM9e21lc3NhZ2VzfSAvPlxuICAgICAgPC9mb3JtPlxuICAgICk7XG4gIH1cbn1cblxuRm9ybS5wcm9wVHlwZXMgPSB7XG4gIG9hdXRoU2VydmljZXM6IFByb3BUeXBlcy5vYmplY3QsXG4gIGZpZWxkczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICBidXR0b25zOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gIHRyYW5zbGF0ZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgZXJyb3I6IFByb3BUeXBlcy5zdHJpbmcsXG4gIHJlYWR5OiBQcm9wVHlwZXMuYm9vbFxufTtcblxuQWNjb3VudHMudWkuRm9ybSA9IEZvcm07XG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgQWNjb3VudHMgfSBmcm9tICdtZXRlb3IvYWNjb3VudHMtYmFzZSc7XG5cbmZ1bmN0aW9uIGlzT2JqZWN0KG9iaikge1xuICByZXR1cm4gb2JqID09PSBPYmplY3Qob2JqKTtcbn1cblxuZXhwb3J0IGNsYXNzIEZvcm1NZXNzYWdlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgcmVuZGVyICgpIHtcbiAgICBsZXQgeyBtZXNzYWdlLCB0eXBlLCBjbGFzc05hbWUgPSBcIm1lc3NhZ2VcIiwgc3R5bGUgPSB7fSwgZGVwcmVjYXRlZCB9ID0gdGhpcy5wcm9wcztcbiAgICAvLyBYWFggQ2hlY2sgZm9yIGRlcHJlY2F0aW9ucy5cbiAgICBpZiAoZGVwcmVjYXRlZCkge1xuICAgICAgLy8gRm91bmQgYmFja3dvcmRzIGNvbXBhdGliaWxpdHkgaXNzdWUuXG4gICAgICBjb25zb2xlLndhcm4oJ1lvdSBhcmUgb3ZlcnJpZGluZyBBY2NvdW50cy51aS5Gb3JtIGFuZCB1c2luZyBGb3JtTWVzc2FnZSwgdGhlIHVzZSBvZiBGb3JtTWVzc2FnZSBpbiBGb3JtIGhhcyBiZWVuIGRlcHJlYWN0ZWQgaW4gdjEuMi4xMSwgdXBkYXRlIHlvdXIgaW1wbGVtZW50YXRpb24gdG8gdXNlIEZvcm1NZXNzYWdlczogaHR0cHM6Ly9naXRodWIuY29tL3N0dWRpb2ludGVyYWN0L2FjY291bnRzLXVpLyNkZXByZWNhdGlvbnMnKTtcbiAgICB9XG4gICAgbWVzc2FnZSA9IGlzT2JqZWN0KG1lc3NhZ2UpID8gbWVzc2FnZS5tZXNzYWdlIDogbWVzc2FnZTsgLy8gSWYgbWVzc2FnZSBpcyBvYmplY3QsIHRoZW4gdHJ5IHRvIGdldCBtZXNzYWdlIGZyb20gaXRcbiAgICByZXR1cm4gbWVzc2FnZSA/IChcbiAgICAgIDxkaXYgc3R5bGU9eyBzdHlsZSB9wqBcbiAgICAgICAgICAgY2xhc3NOYW1lPXtbIGNsYXNzTmFtZSwgdHlwZSBdLmpvaW4oJyAnKX0+eyBtZXNzYWdlIH08L2Rpdj5cbiAgICApIDogbnVsbDtcbiAgfVxufVxuXG5BY2NvdW50cy51aS5Gb3JtTWVzc2FnZSA9IEZvcm1NZXNzYWdlO1xuIiwiaW1wb3J0IFJlYWN0LCB7wqBDb21wb25lbnQgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBBY2NvdW50cyB9IGZyb20gJ21ldGVvci9hY2NvdW50cy1iYXNlJztcblxuZXhwb3J0IGNsYXNzIEZvcm1NZXNzYWdlcyBleHRlbmRzIENvbXBvbmVudCB7XG4gIHJlbmRlciAoKSB7XG4gICAgY29uc3QgeyBtZXNzYWdlcyA9IFtdLCBjbGFzc05hbWUgPSBcIm1lc3NhZ2VzXCIsIHN0eWxlID0ge30gfSA9IHRoaXMucHJvcHM7XG4gICAgcmV0dXJuIG1lc3NhZ2VzLmxlbmd0aCA+IDAgJiYgKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJtZXNzYWdlc1wiPlxuICAgICAgICB7bWVzc2FnZXNcbiAgICAgICAgICAuZmlsdGVyKG1lc3NhZ2UgPT4gISgnZmllbGQnIGluIG1lc3NhZ2UpKVxuICAgICAgICAgIC5tYXAoKHvCoG1lc3NhZ2UsIHR5cGUgfSwgaSkgPT5cbiAgICAgICAgICA8QWNjb3VudHMudWkuRm9ybU1lc3NhZ2VcbiAgICAgICAgICAgIG1lc3NhZ2U9e21lc3NhZ2V9XG4gICAgICAgICAgICB0eXBlPXt0eXBlfVxuICAgICAgICAgICAga2V5PXtpfVxuICAgICAgICAgIC8+XG4gICAgICAgICl9XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbkFjY291bnRzLnVpLkZvcm1NZXNzYWdlcyA9IEZvcm1NZXNzYWdlcztcbiIsImltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IFJlYWN0RE9NIGZyb20gJ3JlYWN0LWRvbSc7XG5pbXBvcnQgdXVpZCBmcm9tIFwidXVpZFwiO1xuaW1wb3J0IGluamVjdFRhcEV2ZW50UGx1Z2luIGZyb20gJ3JlYWN0LXRhcC1ldmVudC1wbHVnaW4nO1xuaW5qZWN0VGFwRXZlbnRQbHVnaW4oKTtcbmltcG9ydCB7IHdpdGhUcmFja2VyIH0gZnJvbSAnbWV0ZW9yL3JlYWN0LW1ldGVvci1kYXRhJztcbmltcG9ydCB7IEFjY291bnRzIH0gZnJvbSAnbWV0ZW9yL2FjY291bnRzLWJhc2UnO1xuaW1wb3J0IHsgVDluIH0gZnJvbSAnbWV0ZW9yL3NvZnR3YXJlcmVybzphY2NvdW50cy10OW4nO1xuaW1wb3J0IHvCoEtFWV9QUkVGSVggfSBmcm9tICcuLi8uLi9sb2dpbl9zZXNzaW9uLmpzJztcbmltcG9ydCAnLi9Gb3JtLmpzeCc7XG5cbmltcG9ydCB7XG4gIFNUQVRFUyxcbiAgcGFzc3dvcmRTaWdudXBGaWVsZHMsXG4gIHZhbGlkYXRlRW1haWwsXG4gIHZhbGlkYXRlUGFzc3dvcmQsXG4gIHZhbGlkYXRlVXNlcm5hbWUsXG4gIGxvZ2luUmVzdWx0Q2FsbGJhY2ssXG4gIGdldExvZ2luU2VydmljZXMsXG4gIGhhc1Bhc3N3b3JkU2VydmljZSxcbiAgY2FwaXRhbGl6ZVxufSBmcm9tICcuLi8uLi9oZWxwZXJzLmpzJztcblxuZnVuY3Rpb24gaW5kZXhCeShhcnJheSwga2V5KSB7XG4gIGNvbnN0IHJlc3VsdCA9IHt9O1xuICBhcnJheS5mb3JFYWNoKGZ1bmN0aW9uKG9iaikge1xuICAgIHJlc3VsdFtvYmpba2V5XV0gPSBvYmo7XG4gIH0pO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMb2dpbkZvcm0gZXh0ZW5kcyBDb21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICBsZXQge1xuICAgICAgZm9ybVN0YXRlLFxuICAgICAgbG9naW5QYXRoLFxuICAgICAgc2lnblVwUGF0aCxcbiAgICAgIHJlc2V0UGFzc3dvcmRQYXRoLFxuICAgICAgcHJvZmlsZVBhdGgsXG4gICAgICBjaGFuZ2VQYXNzd29yZFBhdGhcbiAgICB9ID0gcHJvcHM7XG5cbiAgICBpZiAoZm9ybVN0YXRlID09PSBTVEFURVMuU0lHTl9JTiAmJiBQYWNrYWdlWydhY2NvdW50cy1wYXNzd29yZCddKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ0RvIG5vdCBmb3JjZSB0aGUgc3RhdGUgdG8gU0lHTl9JTiBvbiBBY2NvdW50cy51aS5Mb2dpbkZvcm0sIGl0IHdpbGwgbWFrZSBpdCBpbXBvc3NpYmxlIHRvIHJlc2V0IHBhc3N3b3JkIGluIHlvdXIgYXBwLCB0aGlzIHN0YXRlIGlzIGFsc28gdGhlIGRlZmF1bHQgc3RhdGUgaWYgbG9nZ2VkIG91dCwgc28gbm8gbmVlZCB0byBmb3JjZSBpdC4nKTtcbiAgICB9XG5cbiAgICAvLyBTZXQgaW5pdGFsIHN0YXRlLlxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBtZXNzYWdlczogW10sXG4gICAgICB3YWl0aW5nOiB0cnVlLFxuICAgICAgZm9ybVN0YXRlOiBmb3JtU3RhdGUgPyBmb3JtU3RhdGUgOiBBY2NvdW50cy51c2VyKCkgPyBTVEFURVMuUFJPRklMRSA6IFNUQVRFUy5TSUdOX0lOLFxuICAgICAgb25TdWJtaXRIb29rOiBwcm9wcy5vblN1Ym1pdEhvb2sgfHwgQWNjb3VudHMudWkuX29wdGlvbnMub25TdWJtaXRIb29rLFxuICAgICAgb25TaWduZWRJbkhvb2s6IHByb3BzLm9uU2lnbmVkSW5Ib29rIHx8IEFjY291bnRzLnVpLl9vcHRpb25zLm9uU2lnbmVkSW5Ib29rLFxuICAgICAgb25TaWduZWRPdXRIb29rOiBwcm9wcy5vblNpZ25lZE91dEhvb2sgfHwgQWNjb3VudHMudWkuX29wdGlvbnMub25TaWduZWRPdXRIb29rLFxuICAgICAgb25QcmVTaWduVXBIb29rOiBwcm9wcy5vblByZVNpZ25VcEhvb2sgfHwgQWNjb3VudHMudWkuX29wdGlvbnMub25QcmVTaWduVXBIb29rLFxuICAgICAgb25Qb3N0U2lnblVwSG9vazogcHJvcHMub25Qb3N0U2lnblVwSG9vayB8fCBBY2NvdW50cy51aS5fb3B0aW9ucy5vblBvc3RTaWduVXBIb29rLFxuICAgIH07XG4gICAgdGhpcy50cmFuc2xhdGUgPSB0aGlzLnRyYW5zbGF0ZS5iaW5kKHRoaXMpO1xuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZShwcmV2U3RhdGUgPT4gKHsgd2FpdGluZzogZmFsc2UsIHJlYWR5OiB0cnVlIH0pKTtcbiAgICBsZXQgY2hhbmdlU3RhdGUgPSBTZXNzaW9uLmdldChLRVlfUFJFRklYICsgJ3N0YXRlJyk7XG4gICAgc3dpdGNoIChjaGFuZ2VTdGF0ZSkge1xuICAgICAgY2FzZSAnZW5yb2xsQWNjb3VudFRva2VuJzpcbiAgICAgICAgdGhpcy5zZXRTdGF0ZShwcmV2U3RhdGUgPT4gKHtcbiAgICAgICAgICBmb3JtU3RhdGU6IFNUQVRFUy5FTlJPTExfQUNDT1VOVFxuICAgICAgICB9KSk7XG4gICAgICAgIFNlc3Npb24uc2V0KEtFWV9QUkVGSVggKyAnc3RhdGUnLCBudWxsKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdyZXNldFBhc3N3b3JkVG9rZW4nOlxuICAgICAgICB0aGlzLnNldFN0YXRlKHByZXZTdGF0ZSA9PiAoe1xuICAgICAgICAgIGZvcm1TdGF0ZTogU1RBVEVTLlBBU1NXT1JEX0NIQU5HRVxuICAgICAgICB9KSk7XG4gICAgICAgIFNlc3Npb24uc2V0KEtFWV9QUkVGSVggKyAnc3RhdGUnLCBudWxsKTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ2p1c3RWZXJpZmllZEVtYWlsJzpcbiAgICAgICAgdGhpcy5zZXRTdGF0ZShwcmV2U3RhdGUgPT4gKHtcbiAgICAgICAgICBmb3JtU3RhdGU6IFNUQVRFUy5QUk9GSUxFXG4gICAgICAgIH0pKTtcbiAgICAgICAgU2Vzc2lvbi5zZXQoS0VZX1BSRUZJWCArICdzdGF0ZScsIG51bGwpO1xuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICAvLyBBZGQgZGVmYXVsdCBmaWVsZCB2YWx1ZXMgb25jZSB0aGUgZm9ybSBkaWQgbW91bnQgb24gdGhlIGNsaWVudFxuICAgIHRoaXMuc2V0U3RhdGUocHJldlN0YXRlID0+ICh7XG4gICAgICAuLi5Mb2dpbkZvcm0uZ2V0RGVmYXVsdEZpZWxkVmFsdWVzKCksXG4gICAgfSkpO1xuICB9XG5cbiAgc3RhdGljIGdldERlcml2ZWRTdGF0ZUZyb21Qcm9wcyh7IGZvcm1TdGF0ZSB9LCB7IGZvcm1TdGF0ZTogc3RhdGVGb3JtU3RhdGUgfSkge1xuICAgIHJldHVybiAoZm9ybVN0YXRlICYmIGZvcm1TdGF0ZSAhPT0gc3RhdGVGb3JtU3RhdGUpID9cbiAgICAgICAge1xuICAgICAgICAgIGZvcm1TdGF0ZTogZm9ybVN0YXRlLFxuICAgICAgICAgIC4uLkxvZ2luRm9ybS5nZXREZWZhdWx0RmllbGRWYWx1ZXMoKSxcbiAgICAgICAgfVxuICAgICAgOlxuICAgICAgICBudWxsO1xuICB9XG5cbiAgY29tcG9uZW50RGlkVXBkYXRlKHByZXZQcm9wcywgcHJldlN0YXRlKSB7XG4gICAgaWYgKCFwcmV2UHJvcHMudXNlciAhPT0gIXRoaXMucHJvcHMudXNlcikge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGZvcm1TdGF0ZTogdGhpcy5wcm9wcy51c2VyID8gU1RBVEVTLlBST0ZJTEUgOiBTVEFURVMuU0lHTl9JTlxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgdHJhbnNsYXRlKHRleHQpIHtcbiAgICAvLyBpZiAodGhpcy5wcm9wcy50KSB7XG4gICAgLy8gICByZXR1cm4gdGhpcy5wcm9wcy50KHRleHQpO1xuICAgIC8vIH1cbiAgICByZXR1cm4gVDluLmdldCh0ZXh0KTtcbiAgfVxuXG4gIHZhbGlkYXRlRmllbGQoZmllbGQsIHZhbHVlLCBmaWVsZElkKSB7XG4gICAgY29uc3QgeyBmb3JtU3RhdGUgfSA9IHRoaXMuc3RhdGU7XG4gICAgc3dpdGNoKGZpZWxkKSB7XG4gICAgICBjYXNlICdlbWFpbCc6XG4gICAgICAgIHJldHVybiB2YWxpZGF0ZUVtYWlsKHZhbHVlLFxuICAgICAgICAgIHRoaXMuc2hvd01lc3NhZ2UuYmluZCh0aGlzKSxcbiAgICAgICAgICB0aGlzLmNsZWFyTWVzc2FnZS5iaW5kKHRoaXMpLFxuICAgICAgICApO1xuICAgICAgY2FzZSAncGFzc3dvcmQnOlxuICAgICAgICByZXR1cm4gdmFsaWRhdGVQYXNzd29yZCh2YWx1ZSxcbiAgICAgICAgICB0aGlzLnNob3dNZXNzYWdlLmJpbmQodGhpcyksXG4gICAgICAgICAgdGhpcy5jbGVhck1lc3NhZ2UuYmluZCh0aGlzKSxcbiAgICAgICAgICBmaWVsZElkXG4gICAgICAgICk7XG4gICAgICBjYXNlICd1c2VybmFtZSc6XG4gICAgICAgIHJldHVybiB2YWxpZGF0ZVVzZXJuYW1lKHZhbHVlLFxuICAgICAgICAgIHRoaXMuc2hvd01lc3NhZ2UuYmluZCh0aGlzKSxcbiAgICAgICAgICB0aGlzLmNsZWFyTWVzc2FnZS5iaW5kKHRoaXMpLFxuICAgICAgICAgIGZvcm1TdGF0ZSxcbiAgICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBnZXRVc2VybmFtZU9yRW1haWxGaWVsZCgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgaWQ6ICd1c2VybmFtZU9yRW1haWwnLFxuICAgICAgaGludDogdGhpcy50cmFuc2xhdGUoJ2VudGVyVXNlcm5hbWVPckVtYWlsJyksXG4gICAgICBsYWJlbDogdGhpcy50cmFuc2xhdGUoJ3VzZXJuYW1lT3JFbWFpbCcpLFxuICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICBkZWZhdWx0VmFsdWU6IHRoaXMuc3RhdGUudXNlcm5hbWUgfHwgXCJcIixcbiAgICAgIG9uQ2hhbmdlOiB0aGlzLmhhbmRsZUNoYW5nZS5iaW5kKHRoaXMsICd1c2VybmFtZU9yRW1haWwnKSxcbiAgICAgIG1lc3NhZ2U6IHRoaXMuZ2V0TWVzc2FnZUZvckZpZWxkKCd1c2VybmFtZU9yRW1haWwnKSxcbiAgICB9O1xuICB9XG5cbiAgZ2V0VXNlcm5hbWVGaWVsZCgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgaWQ6ICd1c2VybmFtZScsXG4gICAgICBoaW50OiB0aGlzLnRyYW5zbGF0ZSgnZW50ZXJVc2VybmFtZScpLFxuICAgICAgbGFiZWw6IHRoaXMudHJhbnNsYXRlKCd1c2VybmFtZScpLFxuICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICBkZWZhdWx0VmFsdWU6IHRoaXMuc3RhdGUudXNlcm5hbWUgfHwgXCJcIixcbiAgICAgIG9uQ2hhbmdlOiB0aGlzLmhhbmRsZUNoYW5nZS5iaW5kKHRoaXMsICd1c2VybmFtZScpLFxuICAgICAgbWVzc2FnZTogdGhpcy5nZXRNZXNzYWdlRm9yRmllbGQoJ3VzZXJuYW1lJyksXG4gICAgfTtcbiAgfVxuXG4gIGdldEVtYWlsRmllbGQoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGlkOiAnZW1haWwnLFxuICAgICAgaGludDogdGhpcy50cmFuc2xhdGUoJ2VudGVyRW1haWwnKSxcbiAgICAgIGxhYmVsOiB0aGlzLnRyYW5zbGF0ZSgnZW1haWwnKSxcbiAgICAgIHR5cGU6ICdlbWFpbCcsXG4gICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgIGRlZmF1bHRWYWx1ZTogdGhpcy5zdGF0ZS5lbWFpbCB8fCBcIlwiLFxuICAgICAgb25DaGFuZ2U6IHRoaXMuaGFuZGxlQ2hhbmdlLmJpbmQodGhpcywgJ2VtYWlsJyksXG4gICAgICBtZXNzYWdlOiB0aGlzLmdldE1lc3NhZ2VGb3JGaWVsZCgnZW1haWwnKSxcbiAgICB9O1xuICB9XG5cbiAgZ2V0UGFzc3dvcmRGaWVsZCgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgaWQ6ICdwYXNzd29yZCcsXG4gICAgICBoaW50OiB0aGlzLnRyYW5zbGF0ZSgnZW50ZXJQYXNzd29yZCcpLFxuICAgICAgbGFiZWw6IHRoaXMudHJhbnNsYXRlKCdwYXNzd29yZCcpLFxuICAgICAgdHlwZTogJ3Bhc3N3b3JkJyxcbiAgICAgIHJlcXVpcmVkOiB0cnVlLFxuICAgICAgZGVmYXVsdFZhbHVlOiB0aGlzLnN0YXRlLnBhc3N3b3JkIHx8IFwiXCIsXG4gICAgICBvbkNoYW5nZTogdGhpcy5oYW5kbGVDaGFuZ2UuYmluZCh0aGlzLCAncGFzc3dvcmQnKSxcbiAgICAgIG1lc3NhZ2U6IHRoaXMuZ2V0TWVzc2FnZUZvckZpZWxkKCdwYXNzd29yZCcpLFxuICAgIH07XG4gIH1cblxuICBnZXRTZXRQYXNzd29yZEZpZWxkKCkge1xuICAgIHJldHVybiB7XG4gICAgICBpZDogJ25ld1Bhc3N3b3JkJyxcbiAgICAgIGhpbnQ6IHRoaXMudHJhbnNsYXRlKCdlbnRlclBhc3N3b3JkJyksXG4gICAgICBsYWJlbDogdGhpcy50cmFuc2xhdGUoJ2Nob29zZVBhc3N3b3JkJyksXG4gICAgICB0eXBlOiAncGFzc3dvcmQnLFxuICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICBvbkNoYW5nZTogdGhpcy5oYW5kbGVDaGFuZ2UuYmluZCh0aGlzLCAnbmV3UGFzc3dvcmQnKVxuICAgIH07XG4gIH1cblxuICBnZXROZXdQYXNzd29yZEZpZWxkKCkge1xuICAgIHJldHVybiB7XG4gICAgICBpZDogJ25ld1Bhc3N3b3JkJyxcbiAgICAgIGhpbnQ6IHRoaXMudHJhbnNsYXRlKCdlbnRlck5ld1Bhc3N3b3JkJyksXG4gICAgICBsYWJlbDogdGhpcy50cmFuc2xhdGUoJ25ld1Bhc3N3b3JkJyksXG4gICAgICB0eXBlOiAncGFzc3dvcmQnLFxuICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICBvbkNoYW5nZTogdGhpcy5oYW5kbGVDaGFuZ2UuYmluZCh0aGlzLCAnbmV3UGFzc3dvcmQnKSxcbiAgICAgIG1lc3NhZ2U6IHRoaXMuZ2V0TWVzc2FnZUZvckZpZWxkKCduZXdQYXNzd29yZCcpLFxuICAgIH07XG4gIH1cblxuICBoYW5kbGVDaGFuZ2UoZmllbGQsIGV2dCkge1xuICAgIGxldCB2YWx1ZSA9IGV2dC50YXJnZXQudmFsdWU7XG4gICAgc3dpdGNoIChmaWVsZCkge1xuICAgICAgY2FzZSAncGFzc3dvcmQnOiBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHZhbHVlID0gdmFsdWUudHJpbSgpO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gICAgdGhpcy5zZXRTdGF0ZSh7IFtmaWVsZF06IHZhbHVlIH0pO1xuICAgIExvZ2luRm9ybS5zZXREZWZhdWx0RmllbGRWYWx1ZXMoe8KgW2ZpZWxkXTogdmFsdWUgfSk7XG4gIH1cblxuICBmaWVsZHMoKSB7XG4gICAgY29uc3QgbG9naW5GaWVsZHMgPSBbXTtcbiAgICBjb25zdCB7IGZvcm1TdGF0ZSB9ID0gdGhpcy5zdGF0ZTtcblxuICAgIGlmICghaGFzUGFzc3dvcmRTZXJ2aWNlKCkgJiYgZ2V0TG9naW5TZXJ2aWNlcygpLmxlbmd0aCA9PSAwKSB7XG4gICAgICBsb2dpbkZpZWxkcy5wdXNoKHtcbiAgICAgICAgbGFiZWw6ICdObyBsb2dpbiBzZXJ2aWNlIGFkZGVkLCBpLmUuIGFjY291bnRzLXBhc3N3b3JkJyxcbiAgICAgICAgdHlwZTogJ25vdGljZSdcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmIChoYXNQYXNzd29yZFNlcnZpY2UoKSAmJiBmb3JtU3RhdGUgPT0gU1RBVEVTLlNJR05fSU4pIHtcbiAgICAgIGlmIChbXG4gICAgICAgIFwiVVNFUk5BTUVfQU5EX0VNQUlMXCIsXG4gICAgICAgIFwiVVNFUk5BTUVfQU5EX09QVElPTkFMX0VNQUlMXCIsXG4gICAgICAgIFwiVVNFUk5BTUVfQU5EX0VNQUlMX05PX1BBU1NXT1JEXCJcbiAgICAgIF0uaW5jbHVkZXMocGFzc3dvcmRTaWdudXBGaWVsZHMoKSkpIHtcbiAgICAgICAgbG9naW5GaWVsZHMucHVzaCh0aGlzLmdldFVzZXJuYW1lT3JFbWFpbEZpZWxkKCkpO1xuICAgICAgfVxuXG4gICAgICBpZiAocGFzc3dvcmRTaWdudXBGaWVsZHMoKSA9PT0gXCJVU0VSTkFNRV9PTkxZXCIpIHtcbiAgICAgICAgbG9naW5GaWVsZHMucHVzaCh0aGlzLmdldFVzZXJuYW1lRmllbGQoKSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChbXG4gICAgICAgIFwiRU1BSUxfT05MWVwiLFxuICAgICAgICBcIkVNQUlMX09OTFlfTk9fUEFTU1dPUkRcIlxuICAgICAgXS5pbmNsdWRlcyhwYXNzd29yZFNpZ251cEZpZWxkcygpKSkge1xuICAgICAgICBsb2dpbkZpZWxkcy5wdXNoKHRoaXMuZ2V0RW1haWxGaWVsZCgpKTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFbXG4gICAgICAgIFwiRU1BSUxfT05MWV9OT19QQVNTV09SRFwiLFxuICAgICAgICBcIlVTRVJOQU1FX0FORF9FTUFJTF9OT19QQVNTV09SRFwiXG4gICAgICBdLmluY2x1ZGVzKHBhc3N3b3JkU2lnbnVwRmllbGRzKCkpKSB7XG4gICAgICAgIGxvZ2luRmllbGRzLnB1c2godGhpcy5nZXRQYXNzd29yZEZpZWxkKCkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChoYXNQYXNzd29yZFNlcnZpY2UoKSAmJiBmb3JtU3RhdGUgPT0gU1RBVEVTLlNJR05fVVApIHtcbiAgICAgIGlmIChbXG4gICAgICAgIFwiVVNFUk5BTUVfQU5EX0VNQUlMXCIsXG4gICAgICAgIFwiVVNFUk5BTUVfQU5EX09QVElPTkFMX0VNQUlMXCIsXG4gICAgICAgIFwiVVNFUk5BTUVfT05MWVwiLFxuICAgICAgICBcIlVTRVJOQU1FX0FORF9FTUFJTF9OT19QQVNTV09SRFwiXG4gICAgICBdLmluY2x1ZGVzKHBhc3N3b3JkU2lnbnVwRmllbGRzKCkpKSB7XG4gICAgICAgIGxvZ2luRmllbGRzLnB1c2godGhpcy5nZXRVc2VybmFtZUZpZWxkKCkpO1xuICAgICAgfVxuXG4gICAgICBpZiAoW1xuICAgICAgICBcIlVTRVJOQU1FX0FORF9FTUFJTFwiLFxuICAgICAgICBcIkVNQUlMX09OTFlcIixcbiAgICAgICAgXCJFTUFJTF9PTkxZX05PX1BBU1NXT1JEXCIsXG4gICAgICAgIFwiVVNFUk5BTUVfQU5EX0VNQUlMX05PX1BBU1NXT1JEXCJcbiAgICAgIF0uaW5jbHVkZXMocGFzc3dvcmRTaWdudXBGaWVsZHMoKSkpIHtcbiAgICAgICAgbG9naW5GaWVsZHMucHVzaCh0aGlzLmdldEVtYWlsRmllbGQoKSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChbXCJVU0VSTkFNRV9BTkRfT1BUSU9OQUxfRU1BSUxcIl0uaW5jbHVkZXMocGFzc3dvcmRTaWdudXBGaWVsZHMoKSkpIHtcbiAgICAgICAgbG9naW5GaWVsZHMucHVzaChPYmplY3QuYXNzaWduKHRoaXMuZ2V0RW1haWxGaWVsZCgpLCB7cmVxdWlyZWQ6IGZhbHNlfSkpO1xuICAgICAgfVxuXG4gICAgICBpZiAoIVtcbiAgICAgICAgXCJFTUFJTF9PTkxZX05PX1BBU1NXT1JEXCIsXG4gICAgICAgIFwiVVNFUk5BTUVfQU5EX0VNQUlMX05PX1BBU1NXT1JEXCJcbiAgICAgIF0uaW5jbHVkZXMocGFzc3dvcmRTaWdudXBGaWVsZHMoKSkpIHtcbiAgICAgICAgbG9naW5GaWVsZHMucHVzaCh0aGlzLmdldFBhc3N3b3JkRmllbGQoKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGZvcm1TdGF0ZSA9PSBTVEFURVMuUEFTU1dPUkRfUkVTRVQpIHtcbiAgICAgIGxvZ2luRmllbGRzLnB1c2godGhpcy5nZXRFbWFpbEZpZWxkKCkpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnNob3dQYXNzd29yZENoYW5nZUZvcm0oKSkge1xuICAgICAgaWYgKE1ldGVvci5pc0NsaWVudCAmJiAhQWNjb3VudHMuX2xvZ2luQnV0dG9uc1Nlc3Npb24uZ2V0KCdyZXNldFBhc3N3b3JkVG9rZW4nKSkge1xuICAgICAgICBsb2dpbkZpZWxkcy5wdXNoKHRoaXMuZ2V0UGFzc3dvcmRGaWVsZCgpKTtcbiAgICAgIH1cbiAgICAgIGxvZ2luRmllbGRzLnB1c2godGhpcy5nZXROZXdQYXNzd29yZEZpZWxkKCkpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnNob3dFbnJvbGxBY2NvdW50Rm9ybSgpKSB7XG4gICAgICBsb2dpbkZpZWxkcy5wdXNoKHRoaXMuZ2V0U2V0UGFzc3dvcmRGaWVsZCgpKTtcbiAgICB9XG4gICAgcmV0dXJuIGluZGV4QnkobG9naW5GaWVsZHMsICdpZCcpO1xuICB9XG5cbiAgYnV0dG9ucygpIHtcbiAgICBjb25zdCB7XG4gICAgICBsb2dpblBhdGggPSBBY2NvdW50cy51aS5fb3B0aW9ucy5sb2dpblBhdGgsXG4gICAgICBzaWduVXBQYXRoID0gQWNjb3VudHMudWkuX29wdGlvbnMuc2lnblVwUGF0aCxcbiAgICAgIHJlc2V0UGFzc3dvcmRQYXRoID0gQWNjb3VudHMudWkuX29wdGlvbnMucmVzZXRQYXNzd29yZFBhdGgsXG4gICAgICBjaGFuZ2VQYXNzd29yZFBhdGggPSBBY2NvdW50cy51aS5fb3B0aW9ucy5jaGFuZ2VQYXNzd29yZFBhdGgsXG4gICAgICBwcm9maWxlUGF0aCA9IEFjY291bnRzLnVpLl9vcHRpb25zLnByb2ZpbGVQYXRoLFxuICAgIH0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IHsgdXNlciB9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCB7IGZvcm1TdGF0ZSwgd2FpdGluZyB9ID0gdGhpcy5zdGF0ZTtcbiAgICBsZXQgbG9naW5CdXR0b25zID0gW107XG5cbiAgICBpZiAodXNlciAmJiBmb3JtU3RhdGUgPT0gU1RBVEVTLlBST0ZJTEUpIHtcbiAgICAgIGxvZ2luQnV0dG9ucy5wdXNoKHtcbiAgICAgICAgaWQ6ICdzaWduT3V0JyxcbiAgICAgICAgbGFiZWw6IHRoaXMudHJhbnNsYXRlKCdzaWduT3V0JyksXG4gICAgICAgIGRpc2FibGVkOiB3YWl0aW5nLFxuICAgICAgICBvbkNsaWNrOiB0aGlzLnNpZ25PdXQuYmluZCh0aGlzKVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuc2hvd0NyZWF0ZUFjY291bnRMaW5rKCkpIHtcbiAgICAgIGxvZ2luQnV0dG9ucy5wdXNoKHtcbiAgICAgICAgaWQ6ICdzd2l0Y2hUb1NpZ25VcCcsXG4gICAgICAgIGxhYmVsOiB0aGlzLnRyYW5zbGF0ZSgnc2lnblVwJyksXG4gICAgICAgIHR5cGU6ICdsaW5rJyxcbiAgICAgICAgaHJlZjogc2lnblVwUGF0aCxcbiAgICAgICAgb25DbGljazogdGhpcy5zd2l0Y2hUb1NpZ25VcC5iaW5kKHRoaXMpXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAoZm9ybVN0YXRlID09IFNUQVRFUy5TSUdOX1VQIHx8IGZvcm1TdGF0ZSA9PSBTVEFURVMuUEFTU1dPUkRfUkVTRVQpIHtcbiAgICAgIGxvZ2luQnV0dG9ucy5wdXNoKHtcbiAgICAgICAgaWQ6ICdzd2l0Y2hUb1NpZ25JbicsXG4gICAgICAgIGxhYmVsOiB0aGlzLnRyYW5zbGF0ZSgnc2lnbkluJyksXG4gICAgICAgIHR5cGU6ICdsaW5rJyxcbiAgICAgICAgaHJlZjogbG9naW5QYXRoLFxuICAgICAgICBvbkNsaWNrOiB0aGlzLnN3aXRjaFRvU2lnbkluLmJpbmQodGhpcylcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnNob3dGb3Jnb3RQYXNzd29yZExpbmsoKSkge1xuICAgICAgbG9naW5CdXR0b25zLnB1c2goe1xuICAgICAgICBpZDogJ3N3aXRjaFRvUGFzc3dvcmRSZXNldCcsXG4gICAgICAgIGxhYmVsOiB0aGlzLnRyYW5zbGF0ZSgnZm9yZ290UGFzc3dvcmQnKSxcbiAgICAgICAgdHlwZTogJ2xpbmsnLFxuICAgICAgICBocmVmOiByZXNldFBhc3N3b3JkUGF0aCxcbiAgICAgICAgb25DbGljazogdGhpcy5zd2l0Y2hUb1Bhc3N3b3JkUmVzZXQuYmluZCh0aGlzKVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKHVzZXIgJiYgIVtcbiAgICAgICAgXCJFTUFJTF9PTkxZX05PX1BBU1NXT1JEXCIsXG4gICAgICAgIFwiVVNFUk5BTUVfQU5EX0VNQUlMX05PX1BBU1NXT1JEXCJcbiAgICAgIF0uaW5jbHVkZXMocGFzc3dvcmRTaWdudXBGaWVsZHMoKSlcbiAgICAgICYmIGZvcm1TdGF0ZSA9PSBTVEFURVMuUFJPRklMRVxuICAgICAgJiYgKHVzZXIuc2VydmljZXMgJiYgJ3Bhc3N3b3JkJyBpbiB1c2VyLnNlcnZpY2VzKSkge1xuICAgICAgbG9naW5CdXR0b25zLnB1c2goe1xuICAgICAgICBpZDogJ3N3aXRjaFRvQ2hhbmdlUGFzc3dvcmQnLFxuICAgICAgICBsYWJlbDogdGhpcy50cmFuc2xhdGUoJ2NoYW5nZVBhc3N3b3JkJyksXG4gICAgICAgIHR5cGU6ICdsaW5rJyxcbiAgICAgICAgaHJlZjogY2hhbmdlUGFzc3dvcmRQYXRoLFxuICAgICAgICBvbkNsaWNrOiB0aGlzLnN3aXRjaFRvQ2hhbmdlUGFzc3dvcmQuYmluZCh0aGlzKVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKGZvcm1TdGF0ZSA9PSBTVEFURVMuU0lHTl9VUCkge1xuICAgICAgbG9naW5CdXR0b25zLnB1c2goe1xuICAgICAgICBpZDogJ3NpZ25VcCcsXG4gICAgICAgIGxhYmVsOiB0aGlzLnRyYW5zbGF0ZSgnc2lnblVwJyksXG4gICAgICAgIHR5cGU6IGhhc1Bhc3N3b3JkU2VydmljZSgpID8gJ3N1Ym1pdCcgOiAnbGluaycsXG4gICAgICAgIGNsYXNzTmFtZTogJ2FjdGl2ZScsXG4gICAgICAgIGRpc2FibGVkOiB3YWl0aW5nLFxuICAgICAgICBvbkNsaWNrOiBoYXNQYXNzd29yZFNlcnZpY2UoKSA/IHRoaXMuc2lnblVwLmJpbmQodGhpcywge30pIDogbnVsbFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuc2hvd1NpZ25JbkxpbmsoKSkge1xuICAgICAgbG9naW5CdXR0b25zLnB1c2goe1xuICAgICAgICBpZDogJ3NpZ25JbicsXG4gICAgICAgIGxhYmVsOiB0aGlzLnRyYW5zbGF0ZSgnc2lnbkluJyksXG4gICAgICAgIHR5cGU6IGhhc1Bhc3N3b3JkU2VydmljZSgpID8gJ3N1Ym1pdCcgOiAnbGluaycsXG4gICAgICAgIGNsYXNzTmFtZTogJ2FjdGl2ZScsXG4gICAgICAgIGRpc2FibGVkOiB3YWl0aW5nLFxuICAgICAgICBvbkNsaWNrOiBoYXNQYXNzd29yZFNlcnZpY2UoKSA/IHRoaXMuc2lnbkluLmJpbmQodGhpcykgOiBudWxsXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAoZm9ybVN0YXRlID09IFNUQVRFUy5QQVNTV09SRF9SRVNFVCkge1xuICAgICAgbG9naW5CdXR0b25zLnB1c2goe1xuICAgICAgICBpZDogJ2VtYWlsUmVzZXRMaW5rJyxcbiAgICAgICAgbGFiZWw6IHRoaXMudHJhbnNsYXRlKCdyZXNldFlvdXJQYXNzd29yZCcpLFxuICAgICAgICB0eXBlOiAnc3VibWl0JyxcbiAgICAgICAgZGlzYWJsZWQ6IHdhaXRpbmcsXG4gICAgICAgIG9uQ2xpY2s6IHRoaXMucGFzc3dvcmRSZXNldC5iaW5kKHRoaXMpXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5zaG93UGFzc3dvcmRDaGFuZ2VGb3JtKCkgfHwgdGhpcy5zaG93RW5yb2xsQWNjb3VudEZvcm0oKSkge1xuICAgICAgbG9naW5CdXR0b25zLnB1c2goe1xuICAgICAgICBpZDogJ2NoYW5nZVBhc3N3b3JkJyxcbiAgICAgICAgbGFiZWw6ICh0aGlzLnNob3dQYXNzd29yZENoYW5nZUZvcm0oKSA/IHRoaXMudHJhbnNsYXRlKCdjaGFuZ2VQYXNzd29yZCcpIDogdGhpcy50cmFuc2xhdGUoJ3NldFBhc3N3b3JkJykpLFxuICAgICAgICB0eXBlOiAnc3VibWl0JyxcbiAgICAgICAgZGlzYWJsZWQ6IHdhaXRpbmcsXG4gICAgICAgIG9uQ2xpY2s6IHRoaXMucGFzc3dvcmRDaGFuZ2UuYmluZCh0aGlzKVxuICAgICAgfSk7XG5cbiAgICAgIGlmIChBY2NvdW50cy51c2VyKCkpIHtcbiAgICAgICAgbG9naW5CdXR0b25zLnB1c2goe1xuICAgICAgICAgIGlkOiAnc3dpdGNoVG9TaWduT3V0JyxcbiAgICAgICAgICBsYWJlbDogdGhpcy50cmFuc2xhdGUoJ2NhbmNlbCcpLFxuICAgICAgICAgIHR5cGU6ICdsaW5rJyxcbiAgICAgICAgICBocmVmOiBwcm9maWxlUGF0aCxcbiAgICAgICAgICBvbkNsaWNrOiB0aGlzLnN3aXRjaFRvU2lnbk91dC5iaW5kKHRoaXMpXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbG9naW5CdXR0b25zLnB1c2goe1xuICAgICAgICAgIGlkOiAnY2FuY2VsUmVzZXRQYXNzd29yZCcsXG4gICAgICAgICAgbGFiZWw6IHRoaXMudHJhbnNsYXRlKCdjYW5jZWwnKSxcbiAgICAgICAgICB0eXBlOiAnbGluaycsXG4gICAgICAgICAgb25DbGljazogdGhpcy5jYW5jZWxSZXNldFBhc3N3b3JkLmJpbmQodGhpcyksXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFNvcnQgdGhlIGJ1dHRvbiBhcnJheSBzbyB0aGF0IHRoZSBzdWJtaXQgYnV0dG9uIGFsd2F5cyBjb21lcyBmaXJzdCwgYW5kXG4gICAgLy8gYnV0dG9ucyBzaG91bGQgYWxzbyBjb21lIGJlZm9yZSBsaW5rcy5cbiAgICBsb2dpbkJ1dHRvbnMuc29ydCgoYSwgYikgPT4ge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgYi50eXBlID09ICdzdWJtaXQnICYmXG4gICAgICAgIGEudHlwZSAhPSB1bmRlZmluZWQpIC0gKFxuICAgICAgICAgIGEudHlwZSA9PSAnc3VibWl0JyAmJlxuICAgICAgICAgIGIudHlwZSAhPSB1bmRlZmluZWQpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIGluZGV4QnkobG9naW5CdXR0b25zLCAnaWQnKTtcbiAgfVxuXG4gIHNob3dTaWduSW5MaW5rKCl7XG4gICAgcmV0dXJuIHRoaXMuc3RhdGUuZm9ybVN0YXRlID09IFNUQVRFUy5TSUdOX0lOICYmIFBhY2thZ2VbJ2FjY291bnRzLXBhc3N3b3JkJ107XG4gIH1cblxuICBzaG93UGFzc3dvcmRDaGFuZ2VGb3JtKCkge1xuICAgIHJldHVybihQYWNrYWdlWydhY2NvdW50cy1wYXNzd29yZCddXG4gICAgICAmJiB0aGlzLnN0YXRlLmZvcm1TdGF0ZSA9PSBTVEFURVMuUEFTU1dPUkRfQ0hBTkdFKTtcbiAgfVxuXG4gIHNob3dFbnJvbGxBY2NvdW50Rm9ybSgpIHtcbiAgICByZXR1cm4oUGFja2FnZVsnYWNjb3VudHMtcGFzc3dvcmQnXVxuICAgICAgJiYgdGhpcy5zdGF0ZS5mb3JtU3RhdGUgPT0gU1RBVEVTLkVOUk9MTF9BQ0NPVU5UKTtcbiAgfVxuXG4gIHNob3dDcmVhdGVBY2NvdW50TGluaygpIHtcbiAgICByZXR1cm4gdGhpcy5zdGF0ZS5mb3JtU3RhdGUgPT0gU1RBVEVTLlNJR05fSU4gJiYgIUFjY291bnRzLl9vcHRpb25zLmZvcmJpZENsaWVudEFjY291bnRDcmVhdGlvbiAmJiBQYWNrYWdlWydhY2NvdW50cy1wYXNzd29yZCddO1xuICB9XG5cbiAgc2hvd0ZvcmdvdFBhc3N3b3JkTGluaygpIHtcbiAgICByZXR1cm4gIXRoaXMucHJvcHMudXNlclxuICAgICAgJiYgdGhpcy5zdGF0ZS5mb3JtU3RhdGUgPT0gU1RBVEVTLlNJR05fSU5cbiAgICAgICYmIFtcIlVTRVJOQU1FX0FORF9FTUFJTFwiLCBcIlVTRVJOQU1FX0FORF9PUFRJT05BTF9FTUFJTFwiLCBcIkVNQUlMX09OTFlcIl0uaW5jbHVkZXMocGFzc3dvcmRTaWdudXBGaWVsZHMoKSk7XG4gIH1cblxuICAvKipcbiAgICogSGVscGVyIHRvIHN0b3JlIGZpZWxkIHZhbHVlcyB3aGlsZSB1c2luZyB0aGUgZm9ybS5cbiAgICovXG4gIHN0YXRpYyBzZXREZWZhdWx0RmllbGRWYWx1ZXMoZGVmYXVsdHMpIHtcbiAgICBpZiAodHlwZW9mIGRlZmF1bHRzICE9PSAnb2JqZWN0Jykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdBcmd1bWVudCB0byBzZXREZWZhdWx0RmllbGRWYWx1ZXMgaXMgbm90IG9mIHR5cGUgb2JqZWN0Jyk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgbG9jYWxTdG9yYWdlICE9PSAndW5kZWZpbmVkJyAmJiBsb2NhbFN0b3JhZ2UpIHtcbiAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdhY2NvdW50c191aScsIEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgcGFzc3dvcmRTaWdudXBGaWVsZHM6IHBhc3N3b3JkU2lnbnVwRmllbGRzKCksXG4gICAgICAgIC4uLkxvZ2luRm9ybS5nZXREZWZhdWx0RmllbGRWYWx1ZXMoKSxcbiAgICAgICAgLi4uZGVmYXVsdHMsXG4gICAgICB9KSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEhlbHBlciB0byBnZXQgZmllbGQgdmFsdWVzIHdoZW4gc3dpdGNoaW5nIHN0YXRlcyBpbiB0aGUgZm9ybS5cbiAgICovXG4gIHN0YXRpYyBnZXREZWZhdWx0RmllbGRWYWx1ZXMoKSB7XG4gICAgaWYgKHR5cGVvZiBsb2NhbFN0b3JhZ2UgIT09ICd1bmRlZmluZWQnICYmIGxvY2FsU3RvcmFnZSkge1xuICAgICAgY29uc3QgZGVmYXVsdEZpZWxkVmFsdWVzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnYWNjb3VudHNfdWknKSB8fCBudWxsKTtcbiAgICAgIGlmIChkZWZhdWx0RmllbGRWYWx1ZXNcbiAgICAgICAgJiYgZGVmYXVsdEZpZWxkVmFsdWVzLnBhc3N3b3JkU2lnbnVwRmllbGRzID09PSBwYXNzd29yZFNpZ251cEZpZWxkcygpKSB7XG4gICAgICAgIHJldHVybiBkZWZhdWx0RmllbGRWYWx1ZXM7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEhlbHBlciB0byBjbGVhciBmaWVsZCB2YWx1ZXMgd2hlbiBzaWduaW5nIGluLCB1cCBvciBvdXQuXG4gICAqL1xuICBjbGVhckRlZmF1bHRGaWVsZFZhbHVlcygpIHtcbiAgICBpZiAodHlwZW9mIGxvY2FsU3RvcmFnZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbG9jYWxTdG9yYWdlKSB7XG4gICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSgnYWNjb3VudHNfdWknKTtcbiAgICB9XG4gIH1cblxuICBzd2l0Y2hUb1NpZ25VcChldmVudCkge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBmb3JtU3RhdGU6IFNUQVRFUy5TSUdOX1VQLFxuICAgICAgLi4uTG9naW5Gb3JtLmdldERlZmF1bHRGaWVsZFZhbHVlcygpLFxuICAgIH0pO1xuICAgIHRoaXMuY2xlYXJNZXNzYWdlcygpO1xuICB9XG5cbiAgc3dpdGNoVG9TaWduSW4oZXZlbnQpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgZm9ybVN0YXRlOiBTVEFURVMuU0lHTl9JTixcbiAgICAgIC4uLkxvZ2luRm9ybS5nZXREZWZhdWx0RmllbGRWYWx1ZXMoKSxcbiAgICB9KTtcbiAgICB0aGlzLmNsZWFyTWVzc2FnZXMoKTtcbiAgfVxuXG4gIHN3aXRjaFRvUGFzc3dvcmRSZXNldChldmVudCkge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBmb3JtU3RhdGU6IFNUQVRFUy5QQVNTV09SRF9SRVNFVCxcbiAgICAgIC4uLkxvZ2luRm9ybS5nZXREZWZhdWx0RmllbGRWYWx1ZXMoKSxcbiAgICB9KTtcbiAgICB0aGlzLmNsZWFyTWVzc2FnZXMoKTtcbiAgfVxuXG4gIHN3aXRjaFRvQ2hhbmdlUGFzc3dvcmQoZXZlbnQpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgZm9ybVN0YXRlOiBTVEFURVMuUEFTU1dPUkRfQ0hBTkdFLFxuICAgICAgLi4uTG9naW5Gb3JtLmdldERlZmF1bHRGaWVsZFZhbHVlcygpLFxuICAgIH0pO1xuICAgIHRoaXMuY2xlYXJNZXNzYWdlcygpO1xuICB9XG5cbiAgc3dpdGNoVG9TaWduT3V0KGV2ZW50KSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGZvcm1TdGF0ZTogU1RBVEVTLlBST0ZJTEUsXG4gICAgfSk7XG4gICAgdGhpcy5jbGVhck1lc3NhZ2VzKCk7XG4gIH1cblxuICBjYW5jZWxSZXNldFBhc3N3b3JkKGV2ZW50KSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICBBY2NvdW50cy5fbG9naW5CdXR0b25zU2Vzc2lvbi5zZXQoJ3Jlc2V0UGFzc3dvcmRUb2tlbicsIG51bGwpO1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgZm9ybVN0YXRlOiBTVEFURVMuU0lHTl9JTixcbiAgICAgIG1lc3NhZ2VzOiBbXSxcbiAgICB9KTtcbiAgfVxuXG4gIHNpZ25PdXQoKSB7XG4gICAgTWV0ZW9yLmxvZ291dCgoKSA9PiB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgZm9ybVN0YXRlOiBTVEFURVMuU0lHTl9JTixcbiAgICAgICAgcGFzc3dvcmQ6IG51bGwsXG4gICAgICB9KTtcbiAgICAgIHRoaXMuc3RhdGUub25TaWduZWRPdXRIb29rKCk7XG4gICAgICB0aGlzLmNsZWFyTWVzc2FnZXMoKTtcbiAgICAgIHRoaXMuY2xlYXJEZWZhdWx0RmllbGRWYWx1ZXMoKTtcbiAgICB9KTtcbiAgfVxuXG4gIHNpZ25JbigpIHtcbiAgICBjb25zdCB7XG4gICAgICB1c2VybmFtZSA9IG51bGwsXG4gICAgICBlbWFpbCA9IG51bGwsXG4gICAgICB1c2VybmFtZU9yRW1haWwgPSBudWxsLFxuICAgICAgcGFzc3dvcmQsXG4gICAgICBmb3JtU3RhdGUsXG4gICAgICBvblN1Ym1pdEhvb2tcbiAgICB9wqA9IHRoaXMuc3RhdGU7XG4gICAgbGV0IGVycm9yID0gZmFsc2U7XG4gICAgbGV0IGxvZ2luU2VsZWN0b3I7XG4gICAgdGhpcy5jbGVhck1lc3NhZ2VzKCk7XG5cbiAgICBpZiAodXNlcm5hbWVPckVtYWlsICE9PSBudWxsKSB7XG4gICAgICBpZiAoIXRoaXMudmFsaWRhdGVGaWVsZCgndXNlcm5hbWUnLCB1c2VybmFtZU9yRW1haWwpKSB7XG4gICAgICAgIGlmICh0aGlzLnN0YXRlLmZvcm1TdGF0ZSA9PSBTVEFURVMuU0lHTl9VUCkge1xuICAgICAgICAgIHRoaXMuc3RhdGUub25TdWJtaXRIb29rKFwiZXJyb3IuYWNjb3VudHMudXNlcm5hbWVSZXF1aXJlZFwiLCB0aGlzLnN0YXRlLmZvcm1TdGF0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgZXJyb3IgPSB0cnVlO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIGlmIChbXCJVU0VSTkFNRV9BTkRfRU1BSUxfTk9fUEFTU1dPUkRcIl0uaW5jbHVkZXMocGFzc3dvcmRTaWdudXBGaWVsZHMoKSkpIHtcbiAgICAgICAgICB0aGlzLmxvZ2luV2l0aG91dFBhc3N3b3JkKCk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGxvZ2luU2VsZWN0b3IgPSB1c2VybmFtZU9yRW1haWw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHVzZXJuYW1lICE9PSBudWxsKSB7XG4gICAgICBpZiAoIXRoaXMudmFsaWRhdGVGaWVsZCgndXNlcm5hbWUnLCB1c2VybmFtZSkpIHtcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUuZm9ybVN0YXRlID09IFNUQVRFUy5TSUdOX1VQKSB7XG4gICAgICAgICAgdGhpcy5zdGF0ZS5vblN1Ym1pdEhvb2soXCJlcnJvci5hY2NvdW50cy51c2VybmFtZVJlcXVpcmVkXCIsIHRoaXMuc3RhdGUuZm9ybVN0YXRlKTtcbiAgICAgICAgfVxuICAgICAgICBlcnJvciA9IHRydWU7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgbG9naW5TZWxlY3RvciA9IHsgdXNlcm5hbWU6IHVzZXJuYW1lIH07XG4gICAgICB9XG4gICAgfVxuICAgIGVsc2UgaWYgKHVzZXJuYW1lT3JFbWFpbCA9PSBudWxsKSB7XG4gICAgICBpZiAoIXRoaXMudmFsaWRhdGVGaWVsZCgnZW1haWwnLCBlbWFpbCkpIHtcbiAgICAgICAgZXJyb3IgPSB0cnVlO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIGlmIChbXCJFTUFJTF9PTkxZX05PX1BBU1NXT1JEXCJdLmluY2x1ZGVzKHBhc3N3b3JkU2lnbnVwRmllbGRzKCkpKSB7XG4gICAgICAgICAgdGhpcy5sb2dpbldpdGhvdXRQYXNzd29yZCgpO1xuICAgICAgICAgIGVycm9yID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBsb2dpblNlbGVjdG9yID0geyBlbWFpbCB9O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmICghW1wiRU1BSUxfT05MWV9OT19QQVNTV09SRFwiXS5pbmNsdWRlcyhwYXNzd29yZFNpZ251cEZpZWxkcygpKVxuICAgICAgJiYgIXRoaXMudmFsaWRhdGVGaWVsZCgncGFzc3dvcmQnLCBwYXNzd29yZCkpIHtcbiAgICAgIGVycm9yID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAoIWVycm9yKSB7XG4gICAgICBNZXRlb3IubG9naW5XaXRoUGFzc3dvcmQobG9naW5TZWxlY3RvciwgcGFzc3dvcmQsIChlcnJvciwgcmVzdWx0KSA9PiB7XG4gICAgICAgIG9uU3VibWl0SG9vayhlcnJvcixmb3JtU3RhdGUpO1xuICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICB0aGlzLnNob3dNZXNzYWdlKGBlcnJvci5hY2NvdW50cy4ke2Vycm9yLnJlYXNvbn1gIHx8IFwidW5rbm93bl9lcnJvclwiLCAnZXJyb3InKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBsb2dpblJlc3VsdENhbGxiYWNrKCgpID0+IHRoaXMuc3RhdGUub25TaWduZWRJbkhvb2soKSk7XG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICBmb3JtU3RhdGU6IFNUQVRFUy5QUk9GSUxFLFxuICAgICAgICAgICAgcGFzc3dvcmQ6IG51bGwsXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgdGhpcy5jbGVhckRlZmF1bHRGaWVsZFZhbHVlcygpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBvYXV0aEJ1dHRvbnMoKSB7XG4gICAgY29uc3QgeyBmb3JtU3RhdGUsIHdhaXRpbmcgfSA9IHRoaXMuc3RhdGU7XG4gICAgbGV0IG9hdXRoQnV0dG9ucyA9IFtdO1xuICAgIGlmIChmb3JtU3RhdGUgPT0gU1RBVEVTLlNJR05fSU4gfHwgZm9ybVN0YXRlID09IFNUQVRFUy5TSUdOX1VQICkge1xuICAgICAgaWYoQWNjb3VudHMub2F1dGgpIHtcbiAgICAgICAgQWNjb3VudHMub2F1dGguc2VydmljZU5hbWVzKCkubWFwKChzZXJ2aWNlKSA9PiB7XG4gICAgICAgICAgb2F1dGhCdXR0b25zLnB1c2goe1xuICAgICAgICAgICAgaWQ6IHNlcnZpY2UsXG4gICAgICAgICAgICBsYWJlbDogY2FwaXRhbGl6ZShzZXJ2aWNlKSxcbiAgICAgICAgICAgIGRpc2FibGVkOiB3YWl0aW5nLFxuICAgICAgICAgICAgdHlwZTogJ2J1dHRvbicsXG4gICAgICAgICAgICBjbGFzc05hbWU6IGBidG4tJHtzZXJ2aWNlfSAke3NlcnZpY2V9YCxcbiAgICAgICAgICAgIG9uQ2xpY2s6IHRoaXMub2F1dGhTaWduSW4uYmluZCh0aGlzLCBzZXJ2aWNlKVxuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGluZGV4Qnkob2F1dGhCdXR0b25zLCAnaWQnKTtcbiAgfVxuXG4gIG9hdXRoU2lnbkluKHNlcnZpY2VOYW1lKSB7XG4gICAgY29uc3QgeyB1c2VyIH0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IHsgZm9ybVN0YXRlLCB3YWl0aW5nLCBvblN1Ym1pdEhvb2sgfSA9IHRoaXMuc3RhdGU7XG4gICAgLy9UaGFua3MgSm9zaCBPd2VucyBmb3IgdGhpcyBvbmUuXG4gICAgZnVuY3Rpb24gY2FwaXRhbFNlcnZpY2UoKSB7XG4gICAgICByZXR1cm4gc2VydmljZU5hbWUuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBzZXJ2aWNlTmFtZS5zbGljZSgxKTtcbiAgICB9XG5cbiAgICBpZihzZXJ2aWNlTmFtZSA9PT0gJ21ldGVvci1kZXZlbG9wZXInKXtcbiAgICAgIHNlcnZpY2VOYW1lID0gJ21ldGVvckRldmVsb3BlckFjY291bnQnO1xuICAgIH1cblxuICAgIGNvbnN0IGxvZ2luV2l0aFNlcnZpY2UgPSBNZXRlb3JbXCJsb2dpbldpdGhcIiArIGNhcGl0YWxTZXJ2aWNlKCldO1xuXG4gICAgbGV0IG9wdGlvbnMgPSB7fTsgLy8gdXNlIGRlZmF1bHQgc2NvcGUgdW5sZXNzIHNwZWNpZmllZFxuICAgIGlmIChBY2NvdW50cy51aS5fb3B0aW9ucy5yZXF1ZXN0UGVybWlzc2lvbnNbc2VydmljZU5hbWVdKVxuICAgICAgb3B0aW9ucy5yZXF1ZXN0UGVybWlzc2lvbnMgPSBBY2NvdW50cy51aS5fb3B0aW9ucy5yZXF1ZXN0UGVybWlzc2lvbnNbc2VydmljZU5hbWVdO1xuICAgIGlmIChBY2NvdW50cy51aS5fb3B0aW9ucy5yZXF1ZXN0T2ZmbGluZVRva2VuW3NlcnZpY2VOYW1lXSlcbiAgICAgIG9wdGlvbnMucmVxdWVzdE9mZmxpbmVUb2tlbiA9IEFjY291bnRzLnVpLl9vcHRpb25zLnJlcXVlc3RPZmZsaW5lVG9rZW5bc2VydmljZU5hbWVdO1xuICAgIGlmIChBY2NvdW50cy51aS5fb3B0aW9ucy5mb3JjZUFwcHJvdmFsUHJvbXB0W3NlcnZpY2VOYW1lXSlcbiAgICAgIG9wdGlvbnMuZm9yY2VBcHByb3ZhbFByb21wdCA9IEFjY291bnRzLnVpLl9vcHRpb25zLmZvcmNlQXBwcm92YWxQcm9tcHRbc2VydmljZU5hbWVdO1xuXG4gICAgdGhpcy5jbGVhck1lc3NhZ2VzKCk7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXNcbiAgICBsb2dpbldpdGhTZXJ2aWNlKG9wdGlvbnMsIChlcnJvcikgPT4ge1xuICAgICAgb25TdWJtaXRIb29rKGVycm9yLGZvcm1TdGF0ZSk7XG4gICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgdGhpcy5zaG93TWVzc2FnZShgZXJyb3IuYWNjb3VudHMuJHtlcnJvci5yZWFzb259YCB8fCBcInVua25vd25fZXJyb3JcIik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHsgZm9ybVN0YXRlOiBTVEFURVMuUFJPRklMRSB9KTtcbiAgICAgICAgdGhpcy5jbGVhckRlZmF1bHRGaWVsZFZhbHVlcygpO1xuICAgICAgICBsb2dpblJlc3VsdENhbGxiYWNrKCgpID0+IHtcbiAgICAgICAgICBNZXRlb3Iuc2V0VGltZW91dCgoKSA9PiB0aGlzLnN0YXRlLm9uU2lnbmVkSW5Ib29rKCksIDEwMCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gIH1cblxuICBzaWduVXAob3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3Qge1xuICAgICAgdXNlcm5hbWUgPSBudWxsLFxuICAgICAgZW1haWwgPSBudWxsLFxuICAgICAgdXNlcm5hbWVPckVtYWlsID0gbnVsbCxcbiAgICAgIHBhc3N3b3JkLFxuICAgICAgZm9ybVN0YXRlLFxuICAgICAgb25TdWJtaXRIb29rXG4gICAgfcKgPSB0aGlzLnN0YXRlO1xuICAgIGxldCBlcnJvciA9IGZhbHNlO1xuICAgIHRoaXMuY2xlYXJNZXNzYWdlcygpO1xuXG4gICAgaWYgKHVzZXJuYW1lICE9PSBudWxsKSB7XG4gICAgICBpZiAoICF0aGlzLnZhbGlkYXRlRmllbGQoJ3VzZXJuYW1lJywgdXNlcm5hbWUpICkge1xuICAgICAgICBpZiAodGhpcy5zdGF0ZS5mb3JtU3RhdGUgPT0gU1RBVEVTLlNJR05fVVApIHtcbiAgICAgICAgICB0aGlzLnN0YXRlLm9uU3VibWl0SG9vayhcImVycm9yLmFjY291bnRzLnVzZXJuYW1lUmVxdWlyZWRcIiwgdGhpcy5zdGF0ZS5mb3JtU3RhdGUpO1xuICAgICAgICB9XG4gICAgICAgIGVycm9yID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG9wdGlvbnMudXNlcm5hbWUgPSB1c2VybmFtZTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKFtcbiAgICAgICAgXCJVU0VSTkFNRV9BTkRfRU1BSUxcIixcbiAgICAgICAgXCJVU0VSTkFNRV9BTkRfRU1BSUxfTk9fUEFTU1dPUkRcIlxuICAgICAgXS5pbmNsdWRlcyhwYXNzd29yZFNpZ251cEZpZWxkcygpKSAmJiAhdGhpcy52YWxpZGF0ZUZpZWxkKCd1c2VybmFtZScsIHVzZXJuYW1lKSApIHtcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUuZm9ybVN0YXRlID09IFNUQVRFUy5TSUdOX1VQKSB7XG4gICAgICAgICAgdGhpcy5zdGF0ZS5vblN1Ym1pdEhvb2soXCJlcnJvci5hY2NvdW50cy51c2VybmFtZVJlcXVpcmVkXCIsIHRoaXMuc3RhdGUuZm9ybVN0YXRlKTtcbiAgICAgICAgfVxuICAgICAgICBlcnJvciA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLnZhbGlkYXRlRmllbGQoJ2VtYWlsJywgZW1haWwpKXtcbiAgICAgIGVycm9yID0gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgb3B0aW9ucy5lbWFpbCA9IGVtYWlsO1xuICAgIH1cblxuICAgIGlmIChbXG4gICAgICBcIkVNQUlMX09OTFlfTk9fUEFTU1dPUkRcIixcbiAgICAgIFwiVVNFUk5BTUVfQU5EX0VNQUlMX05PX1BBU1NXT1JEXCJcbiAgICBdLmluY2x1ZGVzKHBhc3N3b3JkU2lnbnVwRmllbGRzKCkpKSB7XG4gICAgICAvLyBHZW5lcmF0ZSBhIHJhbmRvbSBwYXNzd29yZC5cbiAgICAgIG9wdGlvbnMucGFzc3dvcmQgPSB1dWlkKCk7IC8vTWV0ZW9yLnV1aWQoKTtcbiAgICB9IGVsc2UgaWYgKCF0aGlzLnZhbGlkYXRlRmllbGQoJ3Bhc3N3b3JkJywgcGFzc3dvcmQpKSB7XG4gICAgICBvblN1Ym1pdEhvb2soXCJJbnZhbGlkIHBhc3N3b3JkXCIsIGZvcm1TdGF0ZSk7XG4gICAgICBlcnJvciA9IHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIG9wdGlvbnMucGFzc3dvcmQgPSBwYXNzd29yZDtcbiAgICB9XG5cbiAgICBjb25zdCBTaWduVXAgPSBmdW5jdGlvbihfb3B0aW9ucykge1xuICAgICAgQWNjb3VudHMuY3JlYXRlVXNlcihfb3B0aW9ucywgKGVycm9yKSA9PiB7XG4gICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgIHRoaXMuc2hvd01lc3NhZ2UoYGVycm9yLmFjY291bnRzLiR7ZXJyb3IucmVhc29ufWAgfHwgXCJ1bmtub3duX2Vycm9yXCIsICdlcnJvcicpO1xuICAgICAgICAgIGlmICh0aGlzLnRyYW5zbGF0ZShgZXJyb3IuYWNjb3VudHMuJHtlcnJvci5yZWFzb259YCkpIHtcbiAgICAgICAgICAgIG9uU3VibWl0SG9vayhgZXJyb3IuYWNjb3VudHMuJHtlcnJvci5yZWFzb259YCwgZm9ybVN0YXRlKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBvblN1Ym1pdEhvb2soXCJ1bmtub3duX2Vycm9yXCIsIGZvcm1TdGF0ZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIG9uU3VibWl0SG9vayhudWxsLCBmb3JtU3RhdGUpO1xuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBmb3JtU3RhdGU6IFNUQVRFUy5QUk9GSUxFLCBwYXNzd29yZDogbnVsbCB9KTtcbiAgICAgICAgICBsZXQgdXNlciA9IEFjY291bnRzLnVzZXIoKTtcbiAgICAgICAgICBsb2dpblJlc3VsdENhbGxiYWNrKHRoaXMuc3RhdGUub25Qb3N0U2lnblVwSG9vay5iaW5kKHRoaXMsIF9vcHRpb25zLCB1c2VyKSk7XG4gICAgICAgICAgdGhpcy5jbGVhckRlZmF1bHRGaWVsZFZhbHVlcygpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHdhaXRpbmc6IGZhbHNlIH0pO1xuICAgICAgfSk7XG4gICAgfTtcblxuICAgIGlmICghZXJyb3IpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyB3YWl0aW5nOiB0cnVlIH0pO1xuICAgICAgLy8gQWxsb3cgZm9yIFByb21pc2VzIHRvIHJldHVybi5cbiAgICAgIGxldCBwcm9taXNlID0gdGhpcy5zdGF0ZS5vblByZVNpZ25VcEhvb2sob3B0aW9ucyk7XG4gICAgICBpZiAocHJvbWlzZSBpbnN0YW5jZW9mIFByb21pc2UpIHtcbiAgICAgICAgcHJvbWlzZS50aGVuKFNpZ25VcC5iaW5kKHRoaXMsIG9wdGlvbnMpKTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBTaWduVXAob3B0aW9ucyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbG9naW5XaXRob3V0UGFzc3dvcmQoKXtcbiAgICBjb25zdCB7XG4gICAgICBlbWFpbCA9ICcnLFxuICAgICAgdXNlcm5hbWVPckVtYWlsID0gJycsXG4gICAgICB3YWl0aW5nLFxuICAgICAgZm9ybVN0YXRlLFxuICAgICAgb25TdWJtaXRIb29rXG4gICAgfcKgPSB0aGlzLnN0YXRlO1xuXG4gICAgaWYgKHdhaXRpbmcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy52YWxpZGF0ZUZpZWxkKCdlbWFpbCcsIGVtYWlsKSkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7IHdhaXRpbmc6IHRydWUgfSk7XG5cbiAgICAgIEFjY291bnRzLmxvZ2luV2l0aG91dFBhc3N3b3JkKHsgZW1haWw6IGVtYWlsIH0sIChlcnJvcikgPT4ge1xuICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICB0aGlzLnNob3dNZXNzYWdlKGBlcnJvci5hY2NvdW50cy4ke2Vycm9yLnJlYXNvbn1gIHx8IFwidW5rbm93bl9lcnJvclwiLCAnZXJyb3InKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICB0aGlzLnNob3dNZXNzYWdlKFwiaW5mby5lbWFpbFNlbnRcIiwgJ3N1Y2Nlc3MnLCA1MDAwKTtcbiAgICAgICAgICB0aGlzLmNsZWFyRGVmYXVsdEZpZWxkVmFsdWVzKCk7XG4gICAgICAgIH1cbiAgICAgICAgb25TdWJtaXRIb29rKGVycm9yLCBmb3JtU3RhdGUpO1xuICAgICAgICB0aGlzLnNldFN0YXRlKHsgd2FpdGluZzogZmFsc2UgfSk7XG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKHRoaXMudmFsaWRhdGVGaWVsZCgndXNlcm5hbWUnLCB1c2VybmFtZU9yRW1haWwpKSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHsgd2FpdGluZzogdHJ1ZSB9KTtcblxuICAgICAgQWNjb3VudHMubG9naW5XaXRob3V0UGFzc3dvcmQoeyBlbWFpbDogdXNlcm5hbWVPckVtYWlsLCB1c2VybmFtZTogdXNlcm5hbWVPckVtYWlsIH0sIChlcnJvcikgPT4ge1xuICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICB0aGlzLnNob3dNZXNzYWdlKGBlcnJvci5hY2NvdW50cy4ke2Vycm9yLnJlYXNvbn1gIHx8IFwidW5rbm93bl9lcnJvclwiLCAnZXJyb3InKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICB0aGlzLnNob3dNZXNzYWdlKFwiaW5mby5lbWFpbFNlbnRcIiwgJ3N1Y2Nlc3MnLCA1MDAwKTtcbiAgICAgICAgICB0aGlzLmNsZWFyRGVmYXVsdEZpZWxkVmFsdWVzKCk7XG4gICAgICAgIH1cbiAgICAgICAgb25TdWJtaXRIb29rKGVycm9yLCBmb3JtU3RhdGUpO1xuICAgICAgICB0aGlzLnNldFN0YXRlKHsgd2FpdGluZzogZmFsc2UgfSk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IGVyck1zZyA9IFwiZXJyb3IuYWNjb3VudHMuaW52YWxpZF9lbWFpbFwiO1xuICAgICAgdGhpcy5zaG93TWVzc2FnZShlcnJNc2csJ3dhcm5pbmcnKTtcbiAgICAgIG9uU3VibWl0SG9vayh0aGlzLnRyYW5zbGF0ZShlcnJNc2cpLCBmb3JtU3RhdGUpO1xuICAgIH1cbiAgfVxuXG4gIHBhc3N3b3JkUmVzZXQoKSB7XG4gICAgY29uc3Qge1xuICAgICAgZW1haWwgPSAnJyxcbiAgICAgIHdhaXRpbmcsXG4gICAgICBmb3JtU3RhdGUsXG4gICAgICBvblN1Ym1pdEhvb2tcbiAgICB9wqA9IHRoaXMuc3RhdGU7XG5cbiAgICBpZiAod2FpdGluZykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuY2xlYXJNZXNzYWdlcygpO1xuICAgIGlmICh0aGlzLnZhbGlkYXRlRmllbGQoJ2VtYWlsJywgZW1haWwpKSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHsgd2FpdGluZzogdHJ1ZSB9KTtcblxuICAgICAgQWNjb3VudHMuZm9yZ290UGFzc3dvcmQoeyBlbWFpbDogZW1haWwgfSwgKGVycm9yKSA9PiB7XG4gICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgIHRoaXMuc2hvd01lc3NhZ2UoYGVycm9yLmFjY291bnRzLiR7ZXJyb3IucmVhc29ufWAgfHwgXCJ1bmtub3duX2Vycm9yXCIsICdlcnJvcicpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIHRoaXMuc2hvd01lc3NhZ2UoXCJpbmZvLmVtYWlsU2VudFwiLCAnc3VjY2VzcycsIDUwMDApO1xuICAgICAgICAgIHRoaXMuY2xlYXJEZWZhdWx0RmllbGRWYWx1ZXMoKTtcbiAgICAgICAgfVxuICAgICAgICBvblN1Ym1pdEhvb2soZXJyb3IsIGZvcm1TdGF0ZSk7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyB3YWl0aW5nOiBmYWxzZSB9KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHBhc3N3b3JkQ2hhbmdlKCkge1xuICAgIGNvbnN0IHtcbiAgICAgIHBhc3N3b3JkLFxuICAgICAgbmV3UGFzc3dvcmQsXG4gICAgICBmb3JtU3RhdGUsXG4gICAgICBvblN1Ym1pdEhvb2ssXG4gICAgICBvblNpZ25lZEluSG9vayxcbiAgICB9wqA9IHRoaXMuc3RhdGU7XG5cbiAgICBpZiAoIXRoaXMudmFsaWRhdGVGaWVsZCgncGFzc3dvcmQnLCBuZXdQYXNzd29yZCwgJ25ld1Bhc3N3b3JkJykpe1xuICAgICAgb25TdWJtaXRIb29rKCdlcnIubWluQ2hhcicsZm9ybVN0YXRlKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgdG9rZW4gPSBBY2NvdW50cy5fbG9naW5CdXR0b25zU2Vzc2lvbi5nZXQoJ3Jlc2V0UGFzc3dvcmRUb2tlbicpO1xuICAgIGlmICghdG9rZW4pIHtcbiAgICAgIHRva2VuID0gQWNjb3VudHMuX2xvZ2luQnV0dG9uc1Nlc3Npb24uZ2V0KCdlbnJvbGxBY2NvdW50VG9rZW4nKTtcbiAgICB9XG4gICAgaWYgKHRva2VuKSB7XG4gICAgICBBY2NvdW50cy5yZXNldFBhc3N3b3JkKHRva2VuLCBuZXdQYXNzd29yZCwgKGVycm9yKSA9PiB7XG4gICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgIHRoaXMuc2hvd01lc3NhZ2UoYGVycm9yLmFjY291bnRzLiR7ZXJyb3IucmVhc29ufWAgfHwgXCJ1bmtub3duX2Vycm9yXCIsICdlcnJvcicpO1xuICAgICAgICAgIG9uU3VibWl0SG9vayhlcnJvciwgZm9ybVN0YXRlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICB0aGlzLnNob3dNZXNzYWdlKCdpbmZvLnBhc3N3b3JkQ2hhbmdlZCcsICdzdWNjZXNzJywgNTAwMCk7XG4gICAgICAgICAgb25TdWJtaXRIb29rKG51bGwsIGZvcm1TdGF0ZSk7XG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGZvcm1TdGF0ZTogU1RBVEVTLlBST0ZJTEUgfSk7XG4gICAgICAgICAgQWNjb3VudHMuX2xvZ2luQnV0dG9uc1Nlc3Npb24uc2V0KCdyZXNldFBhc3N3b3JkVG9rZW4nLCBudWxsKTtcbiAgICAgICAgICBBY2NvdW50cy5fbG9naW5CdXR0b25zU2Vzc2lvbi5zZXQoJ2Vucm9sbEFjY291bnRUb2tlbicsIG51bGwpO1xuICAgICAgICAgIG9uU2lnbmVkSW5Ib29rKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIEFjY291bnRzLmNoYW5nZVBhc3N3b3JkKHBhc3N3b3JkLCBuZXdQYXNzd29yZCwgKGVycm9yKSA9PiB7XG4gICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgIHRoaXMuc2hvd01lc3NhZ2UoYGVycm9yLmFjY291bnRzLiR7ZXJyb3IucmVhc29ufWAgfHwgXCJ1bmtub3duX2Vycm9yXCIsICdlcnJvcicpO1xuICAgICAgICAgIG9uU3VibWl0SG9vayhlcnJvciwgZm9ybVN0YXRlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICB0aGlzLnNob3dNZXNzYWdlKCdpbmZvLnBhc3N3b3JkQ2hhbmdlZCcsICdzdWNjZXNzJywgNTAwMCk7XG4gICAgICAgICAgb25TdWJtaXRIb29rKG51bGwsIGZvcm1TdGF0ZSk7XG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGZvcm1TdGF0ZTogU1RBVEVTLlBST0ZJTEUgfSk7XG4gICAgICAgICAgdGhpcy5jbGVhckRlZmF1bHRGaWVsZFZhbHVlcygpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBzaG93TWVzc2FnZShtZXNzYWdlLCB0eXBlLCBjbGVhclRpbWVvdXQsIGZpZWxkKXtcbiAgICBtZXNzYWdlID0gdGhpcy50cmFuc2xhdGUobWVzc2FnZSkudHJpbSgpO1xuICAgIGlmIChtZXNzYWdlKSB7XG4gICAgICB0aGlzLnNldFN0YXRlKCh7wqBtZXNzYWdlcyA9IFtdIH0pID0+IHtcbiAgICAgICAgbWVzc2FnZXMucHVzaCh7XG4gICAgICAgICAgbWVzc2FnZSxcbiAgICAgICAgICB0eXBlLFxuICAgICAgICAgIC4uLihmaWVsZCAmJiB7wqBmaWVsZMKgfSksXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gIHvCoG1lc3NhZ2VzIH07XG4gICAgICB9KTtcbiAgICAgIGlmIChjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgdGhpcy5oaWRlTWVzc2FnZVRpbW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIC8vIEZpbHRlciBvdXQgdGhlIG1lc3NhZ2UgdGhhdCB0aW1lZCBvdXQuXG4gICAgICAgICAgdGhpcy5jbGVhck1lc3NhZ2UobWVzc2FnZSk7XG4gICAgICAgIH0sIGNsZWFyVGltZW91dCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZ2V0TWVzc2FnZUZvckZpZWxkKGZpZWxkKSB7XG4gICAgY29uc3Qge8KgbWVzc2FnZXMgPSBbXSB9ID0gdGhpcy5zdGF0ZTtcbiAgICByZXR1cm4gbWVzc2FnZXMuZmluZCgoe8KgZmllbGQ6a2V5IH0pID0+IGtleSA9PT0gZmllbGQpO1xuICB9XG5cbiAgY2xlYXJNZXNzYWdlKG1lc3NhZ2UpIHtcbiAgICBpZiAobWVzc2FnZSkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSgoe8KgbWVzc2FnZXMgPSBbXcKgfSkgPT4gKHtcbiAgICAgICAgbWVzc2FnZXM6IG1lc3NhZ2VzLmZpbHRlcigoe8KgbWVzc2FnZTphIH0pID0+IGEgIT09IG1lc3NhZ2UpLFxuICAgICAgfSkpO1xuICAgIH1cbiAgfVxuXG4gIGNsZWFyTWVzc2FnZXMoKSB7XG4gICAgaWYgKHRoaXMuaGlkZU1lc3NhZ2VUaW1vdXQpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLmhpZGVNZXNzYWdlVGltb3V0KTtcbiAgICB9XG4gICAgdGhpcy5zZXRTdGF0ZSh7IG1lc3NhZ2VzOiBbXSB9KTtcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgIGlmICh0aGlzLmhpZGVNZXNzYWdlVGltb3V0KSB7XG4gICAgICBjbGVhclRpbWVvdXQodGhpcy5oaWRlTWVzc2FnZVRpbW91dCk7XG4gICAgfVxuXG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgdGhpcy5vYXV0aEJ1dHRvbnMoKTtcbiAgICAvLyBCYWNrd29yZHMgY29tcGF0aWJpbGl0eSB3aXRoIHYxLjIueC5cbiAgICBjb25zdCB7wqBtZXNzYWdlcyA9IFtdIH3CoD0gdGhpcy5zdGF0ZTtcbiAgICBjb25zdCBtZXNzYWdlID0ge1xuICAgICAgZGVwcmVjYXRlZDogdHJ1ZSxcbiAgICAgIG1lc3NhZ2U6IG1lc3NhZ2VzLm1hcCgoe8KgbWVzc2FnZSB9KSA9PiBtZXNzYWdlKS5qb2luKCcsICcpLFxuICAgIH07XG4gICAgcmV0dXJuIChcbiAgICAgIDxBY2NvdW50cy51aS5Gb3JtXG4gICAgICAgIG9hdXRoU2VydmljZXM9e3RoaXMub2F1dGhCdXR0b25zKCl9XG4gICAgICAgIGZpZWxkcz17dGhpcy5maWVsZHMoKX3CoFxuICAgICAgICBidXR0b25zPXt0aGlzLmJ1dHRvbnMoKX1cbiAgICAgICAgey4uLnRoaXMuc3RhdGV9XG4gICAgICAgIG1lc3NhZ2U9e21lc3NhZ2V9XG4gICAgICAgIHRyYW5zbGF0ZT17dGV4dCA9PiB0aGlzLnRyYW5zbGF0ZSh0ZXh0KX1cbiAgICAgIC8+XG4gICAgKTtcbiAgfVxufVxuTG9naW5Gb3JtLnByb3BUeXBlcyA9IHtcbiAgZm9ybVN0YXRlOiBQcm9wVHlwZXMuc3ltYm9sLFxuICBsb2dpblBhdGg6IFByb3BUeXBlcy5zdHJpbmcsXG4gIHNpZ25VcFBhdGg6IFByb3BUeXBlcy5zdHJpbmcsXG4gIHJlc2V0UGFzc3dvcmRQYXRoOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBwcm9maWxlUGF0aDogUHJvcFR5cGVzLnN0cmluZyxcbiAgY2hhbmdlUGFzc3dvcmRQYXRoOiBQcm9wVHlwZXMuc3RyaW5nLFxufTtcbkxvZ2luRm9ybS5kZWZhdWx0UHJvcHMgPSB7XG4gIGZvcm1TdGF0ZTogbnVsbCxcbiAgbG9naW5QYXRoOiBudWxsLFxuICBzaWduVXBQYXRoOiBudWxsLFxuICByZXNldFBhc3N3b3JkUGF0aDogbnVsbCxcbiAgcHJvZmlsZVBhdGg6IG51bGwsXG4gIGNoYW5nZVBhc3N3b3JkUGF0aDogbnVsbCxcbn07XG5cbkFjY291bnRzLnVpLkxvZ2luRm9ybSA9IHdpdGhUcmFja2VyKCgpID0+IHtcbiAgLy8gTGlzdGVuIGZvciB0aGUgdXNlciB0byBsb2dpbi9sb2dvdXQgYW5kIHRoZSBzZXJ2aWNlcyBsaXN0IHRvIHRoZSB1c2VyLlxuICBNZXRlb3Iuc3Vic2NyaWJlKCdzZXJ2aWNlc0xpc3QnKTtcbiAgcmV0dXJuICh7XG4gICAgdXNlcjogQWNjb3VudHMudXNlcigpLFxuICB9KTtcbn0pKExvZ2luRm9ybSk7XG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCB7IEFjY291bnRzIH0gZnJvbSAnbWV0ZW9yL2FjY291bnRzLWJhc2UnO1xuaW1wb3J0IHsgVDluIH0gZnJvbSAnbWV0ZW9yL3NvZnR3YXJlcmVybzphY2NvdW50cy10OW4nO1xuaW1wb3J0IHsgaGFzUGFzc3dvcmRTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vaGVscGVycy5qcyc7XG5cbmV4cG9ydCBjbGFzcyBQYXNzd29yZE9yU2VydmljZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBoYXNQYXNzd29yZFNlcnZpY2U6IGhhc1Bhc3N3b3JkU2VydmljZSgpLFxuICAgICAgc2VydmljZXM6IE9iamVjdC5rZXlzKHByb3BzLm9hdXRoU2VydmljZXMpLm1hcChzZXJ2aWNlID0+IHtcbiAgICAgICAgcmV0dXJuIHByb3BzLm9hdXRoU2VydmljZXNbc2VydmljZV0ubGFiZWxcbiAgICAgIH0pXG4gICAgfTtcbiAgfVxuXG4gIHRyYW5zbGF0ZSh0ZXh0KSB7XG4gICAgaWYgKHRoaXMucHJvcHMudHJhbnNsYXRlKSB7XG4gICAgICByZXR1cm4gdGhpcy5wcm9wcy50cmFuc2xhdGUodGV4dCk7XG4gICAgfVxuICAgIHJldHVybiBUOW4uZ2V0KHRleHQpO1xuICB9XG5cbiAgcmVuZGVyICgpIHtcbiAgICBsZXQgeyBjbGFzc05hbWUgPSBcInBhc3N3b3JkLW9yLXNlcnZpY2VcIiwgc3R5bGUgPSB7fSB9ID0gdGhpcy5wcm9wcztcbiAgICBsZXQgeyBoYXNQYXNzd29yZFNlcnZpY2UsIHNlcnZpY2VzIH0gPSB0aGlzLnN0YXRlO1xuICAgIGxhYmVscyA9IHNlcnZpY2VzO1xuICAgIGlmIChzZXJ2aWNlcy5sZW5ndGggPiAyKSB7XG4gICAgICBsYWJlbHMgPSBbXTtcbiAgICB9XG5cbiAgICBpZiAoaGFzUGFzc3dvcmRTZXJ2aWNlICYmIHNlcnZpY2VzLmxlbmd0aCA+IDApIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgc3R5bGU9eyBzdHlsZSB9wqBjbGFzc05hbWU9eyBjbGFzc05hbWUgfT5cbiAgICAgICAgICB7IGAke3RoaXMudHJhbnNsYXRlKCdvclVzZScpfSAkeyBsYWJlbHMuam9pbignIC8gJykgfWAgfVxuICAgICAgICA8L2Rpdj5cbiAgICAgICk7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG59XG5cblBhc3N3b3JkT3JTZXJ2aWNlLnByb3BUeXBlcyA9IHtcbiAgb2F1dGhTZXJ2aWNlczogUHJvcFR5cGVzLm9iamVjdFxufTtcblxuQWNjb3VudHMudWkuUGFzc3dvcmRPclNlcnZpY2UgPSBQYXNzd29yZE9yU2VydmljZTtcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgJy4vQnV0dG9uLmpzeCc7XG5pbXBvcnQge0FjY291bnRzfSBmcm9tICdtZXRlb3IvYWNjb3VudHMtYmFzZSc7XG5cblxuZXhwb3J0IGNsYXNzIFNvY2lhbEJ1dHRvbnMgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICByZW5kZXIoKSB7XG4gICAgbGV0IHsgb2F1dGhTZXJ2aWNlcyA9IHt9LCBjbGFzc05hbWUgPSBcInNvY2lhbC1idXR0b25zXCIgfSA9IHRoaXMucHJvcHM7XG4gICAgcmV0dXJuKFxuICAgICAgPGRpdiBjbGFzc05hbWU9eyBjbGFzc05hbWUgfT5cbiAgICAgICAge09iamVjdC5rZXlzKG9hdXRoU2VydmljZXMpLm1hcCgoaWQsIGkpID0+IHtcbiAgICAgICAgICByZXR1cm4gPEFjY291bnRzLnVpLkJ1dHRvbiB7Li4ub2F1dGhTZXJ2aWNlc1tpZF19IGtleT17aX0gLz47XG4gICAgICAgIH0pfVxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuXG5BY2NvdW50cy51aS5Tb2NpYWxCdXR0b25zID0gU29jaWFsQnV0dG9ucztcbiJdfQ==
