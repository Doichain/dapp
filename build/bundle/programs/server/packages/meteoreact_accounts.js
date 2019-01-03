(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var Accounts = Package['accounts-base'].Accounts;
var ValidatedMethod = Package['mdg:validated-method'].ValidatedMethod;
var HTTP = Package.http.HTTP;
var HTTPInternals = Package.http.HTTPInternals;
var meteorInstall = Package.modules.meteorInstall;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;

var require = meteorInstall({"node_modules":{"meteor":{"meteoreact:accounts":{"index.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/meteoreact_accounts/index.js                                                                           //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
module.exports = require('./lib');
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"lib":{"AccountsReact.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/meteoreact_accounts/lib/AccountsReact.js                                                               //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

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
let regExp;
module.link("./utils/regExp", {
  default(v) {
    regExp = v;
  }

}, 2);
let merge;
module.link("./utils/deepmerge", {
  default(v) {
    merge = v;
  }

}, 3);

class AccountsReact_ {
  constructor() {
    this._init = false;
    this.config = {
      /* -----------------------------
                    Behaviour
         ----------------------------- */
      confirmPassword: true,
      defaultState: 'signIn',
      disableForgotPassword: false,
      enablePasswordChange: false,
      focusFirstInput: !Meteor.isCordova,
      forbidClientAccountCreation: false,
      lowercaseUsername: false,
      loginAfterSignup: true,
      overrideLoginErrors: true,
      passwordSignupFields: 'EMAIL_ONLY',
      sendVerificationEmail: true,
      setDenyRules: true,

      /* -----------------------------
                  Appearance
         ----------------------------- */
      hideSignInLink: false,
      hideSignUpLink: false,
      showForgotPasswordLink: false,
      showLabels: true,
      showPlaceholders: true,

      /* -----------------------------
            Client Side Validation
         ----------------------------- */
      continuousValidation: false,
      negativeValidation: true,

      /* -----------------------------
                    Hooks
         ----------------------------- */
      onSubmitHook: (errors, state) => {},
      preSignupHook: (password, info) => {},

      /* -----------------------------
                   Redirects
         ----------------------------- */
      redirects: {// toSignUp: () => {}
      },

      /* -----------------------------
                    Routes
         ----------------------------- */
      mapStateToRoute: {
        signIn: '/sign-in',
        signUp: '/sign-up',
        forgotPwd: '/forgot-password',
        changePwd: '/change-password',
        resetPwd: '/reset-password'
      },

      /* -----------------------------
                Fields (States)
         ----------------------------- */
      fields: {
        /* Sign In */
        signIn: [{
          _id: 'username',
          displayName: 'Username',
          placeholder: 'Enter your username'
        }, {
          _id: 'email',
          displayName: 'Email',
          placeholder: 'Enter your email',
          re: regExp.Email
        }, {
          _id: 'password',
          displayName: 'Password',
          type: 'password',
          placeholder: 'Enter your password'
        }],

        /* Sign Up */
        signUp: [{
          _id: 'username',
          displayName: 'Username',
          placeholder: 'Enter your username',
          minLength: 4,
          maxLength: 22,
          re: regExp.Username,
          errStr: 'Username must be between 4 and 22 characters'
        }, {
          _id: 'email',
          displayName: 'Email',
          placeholder: 'Enter your email',
          re: regExp.Email,
          errStr: 'Please enter a valid email'
        }, {
          _id: 'password',
          displayName: 'Password',
          type: 'password',
          placeholder: 'Enter your password',
          minLength: 6,
          maxLength: 32,
          errStr: 'Please enter a strong password between 6 and 32 characters'
        }, {
          _id: 'confirmPassword',
          displayName: 'Confirm password',
          type: 'password',
          placeholder: 'Re-enter your password',
          errStr: 'Password doesn\'t match',
          exclude: true,
          func: (fields, fieldObj, value, model, errorsArray) => {
            if (!this.config.confirmPassword) {
              return true;
            } // check that passwords match


            const {
              password
            } = model;
            const {
              _id,
              errStr
            } = fieldObj;

            if (typeof password === 'string') {
              if (!value || value !== password) {
                errorsArray.push({
                  _id,
                  errStr
                });
                return;
              }
            }

            return true;
          }
        }],

        /* Forgot Password */
        forgotPwd: [{
          _id: 'email',
          displayName: 'Email',
          placeholder: 'Enter your email',
          re: regExp.Email,
          errStr: 'Please enter a valid email'
        }],

        /* Change Password */
        changePwd: [{
          _id: 'currentPassword',
          displayName: 'Current password',
          type: 'password',
          placeholder: 'Enter your current password'
        }, {
          _id: 'password',
          displayName: 'Password',
          type: 'password',
          placeholder: 'Enter a new password',
          minLength: 6,
          maxLength: 32,
          errStr: 'Please enter a strong password between 6 and 32 characters'
        }],

        /* Reset Password */
        resetPwd: [{
          _id: 'password',
          displayName: 'New password',
          type: 'password',
          placeholder: 'Enter a new password'
        }]
      },

      /* -----------------------------
                     Texts
         ----------------------------- */
      texts: {
        button: {
          changePwd: 'Update New Password',
          forgotPwd: 'Send Reset Link',
          resetPwd: 'Save New Password',
          signIn: 'Login',
          signUp: 'Register'
        },
        title: {
          changePwd: 'Change Password',
          forgotPwd: 'Forgot Password',
          resetPwd: 'Reset Password',
          signIn: 'Login',
          signUp: 'Create Your Account'
        },
        links: {
          toChangePwd: 'Change your password',
          toResetPwd: 'Reset your password',
          toForgotPwd: 'Forgot your password?',
          toSignIn: 'Already have an account? Sign in!',
          toSignUp: 'Don\'t have an account? Register',
          toResendVerification: 'Resend email verification'
        },
        info: {
          emailSent: 'An email has been sent to your inbox',
          emailVerified: 'Your email has been verified',
          pwdChanged: 'Your password has been changed',
          pwdReset: 'A password reset link has been sent to your email!',
          pwdSet: 'Password updated!',
          signUpVerifyEmail: 'Successful Registration! Please check your email and follow the instructions',
          verificationEmailSent: 'A new email has been sent to you. If the email doesn\'t show up in your inbox, be sure to check your spam folder.'
        },
        errors: {
          loginForbidden: 'There was a problem with your login',
          captchaVerification: 'There was a problem with the recaptcha verification, please try again'
        },
        forgotPwdSubmitSuccess: 'A password reset link has been sent to your email!',
        loginForbiddenMessage: 'There was a problem with your login'
      },
      showReCaptcha: false,
      tempReCaptchaResponse: '',
      oauth: {}
    };
    this.components = null;
  }
  /* Set custom components */


  style(components, override) {
    // Settings override to true assumes that all components types are defined.
    this.components = override ? components : (0, _objectSpread2.default)({}, this.components, components);
  }
  /* Configuration */


  configure(config) {
    this.config = merge(this.config, config);

    if (!this._init) {
      this.determineSignupFields();
      this.loadReCaptcha();
      this.setAccountCreationPolicy();
      this.overrideLoginErrors();
      this.disableForgotPassword();
      this.setDenyRules();
      this._init = true;
    }
  }
  /* Extend default fields */


  addFields(state, fields) {
    try {
      let fieldsArray = this.config.fields[state];
      this.config.fields[state] = fieldsArray.concat(fields);
    } catch (ex) {
      throw new Error(ex);
    }
  }

  determineSignupFields() {
    const {
      signUp,
      signIn
    } = this.config.fields;
    let signupFilteredFields;
    let signinFilteredFields;

    switch (this.config.passwordSignupFields) {
      case 'EMAIL_ONLY':
        signupFilteredFields = signUp.filter(field => field._id !== 'username');
        signinFilteredFields = signIn.filter(field => field._id !== 'username');
        break;

      case 'USERNAME_ONLY':
        signupFilteredFields = signUp.filter(field => field._id !== 'email');
        signinFilteredFields = signIn.filter(field => field._id !== 'email');
        break;

      case 'USERNAME_AND_OPTIONAL_EMAIL':
        signUp.forEach(field => {
          if (field._id === 'email') {
            field.required = false;
          }
        });
        signinFilteredFields = signIn.filter(field => field._id !== 'email');
        break;

      case 'USERNAME_AND_EMAIL':
        //
        break;

      default:
        throw new Error('passwordSignupFields must be set to one of ' + '[EMAIL_ONLY, USERNAME_ONLY, USERNAME_AND_OPTIONAL_EMAIL, USERNAME_AND_EMAL]');
    }

    if (signupFilteredFields) {
      this.config.fields.signUp = signupFilteredFields;
    }

    if (signinFilteredFields) {
      this.config.fields.signIn = signinFilteredFields;
    }
  }

  logout() {
    const {
      onLogoutHook
    } = this.config;

    if (onLogoutHook) {
      onLogoutHook();
    }

    Meteor.logout();
  }

  loadReCaptcha() {
    if (this.config.showReCaptcha && Meteor.isClient) {
      // load recaptcha script
      const script = document.createElement('script');
      document.body.appendChild(script);
      script.async = true;
      script.src = 'https://www.google.com/recaptcha/api.js'; // Register a recaptcha callback

      window.reCaptchaCallback = res => {
        this.config.tempReCaptchaResponse = res;
      };
    }
  }

  setAccountCreationPolicy() {
    try {
      Accounts.config({
        forbidClientAccountCreation: this.config.forbidClientAccountCreation
      });
    } catch (ex) {//
    }
  }
  /* Server only */


  overrideLoginErrors() {
    if (this.config.overrideLoginErrors && Meteor.isServer) {
      Accounts.validateLoginAttempt(attempt => {
        if (attempt.error) {
          var reason = attempt.error.reason;

          if (reason === 'User not found' || reason === 'Incorrect password') {
            throw new Meteor.Error('Login Forbidden', this.config.texts.errors.loginForbidden); // Throw generalized error for failed login attempts
          }
        }

        return attempt.allowed;
      });
    }
  }

  disableForgotPassword() {
    if (this.config.disableForgotPassword && Meteor.isServer) {
      Meteor.server.method_handlers.forgotPassword = () => {
        // Override forgotPassword method directly.
        throw new Meteor.Error('Forgot password is disabled');
      };
    }
  }

  setDenyRules() {
    if (this.config.setDenyRules && Meteor.isServer) {
      Meteor.users.deny({
        update() {
          return true;
        },

        remove() {
          return true;
        },

        insert() {
          return true;
        }

      });
    }
  }

}

const AccountsReact = new AccountsReact_();
Meteor.startup(() => {
  // Automatically use an installed package.
  // Packages must be installed before this package in .meteor/packages
  const prefix = 'meteoreact:accounts-';
  const components = Package[prefix + 'unstyled'] || Package[prefix + 'semantic']; // ...

  AccountsReact.components = components;
});
module.exportDefault(AccountsReact);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"index.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/meteoreact_accounts/lib/index.js                                                                       //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
const module1 = module;
let AccountsReact;
module1.link("./AccountsReact", {
  default(v) {
    AccountsReact = v;
  }

}, 0);
let AccountsReactComponent;
module1.link("./AccountsReactComponent", {
  default(v) {
    AccountsReactComponent = v;
  }

}, 1);
module.exports = {
  AccountsReact,
  AccountsReactComponent
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"AccountsReactComponent":{"baseForm.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/meteoreact_accounts/lib/AccountsReactComponent/baseForm.js                                             //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let React, Component;
module.link("react", {
  default(v) {
    React = v;
  },

  Component(v) {
    Component = v;
  }

}, 1);
let PropTypes;
module.link("prop-types", {
  default(v) {
    PropTypes = v;
  }

}, 2);
let AccountsReact;
module.link("../AccountsReact", {
  default(v) {
    AccountsReact = v;
  }

}, 3);
let handleInputChange;
module.link("./commonUtils", {
  handleInputChange(v) {
    handleInputChange = v;
  }

}, 4);

class BaseForm extends Component {
  constructor(props) {
    super();

    this.shouldFocusFirstInput = index => {
      return this.props.defaults.focusFirstInput && index === 0;
    };

    this.handleInputChange = handleInputChange.bind(props.context);
  }

  componentDidMount() {
    // We must explicitly rerender recaptcha on every mount
    if (this.props.showReCaptcha) {
      // will be available only for signup form.
      let reCaptchaParams = this.props.defaults.reCaptcha || Meteor.settings.public.reCaptcha;
      setTimeout(() => {
        window.grecaptcha.render('recaptcha-container', (0, _objectSpread2.default)({}, reCaptchaParams, {
          callback: window.reCaptchaCallback
        }));
      }, 1);
    }
  }

  render() {
    // State specifics
    const {
      currentState,
      values,
      defaults,
      onSubmit,
      errors
    } = this.props; // Defaults

    const {
      texts,
      showReCaptcha,
      confirmPassword
    } = defaults;
    const _fields = defaults.fields[currentState];
    const fields = confirmPassword ? _fields : _fields.filter(field => field._id !== 'confirmPassword'); // texts

    const title = texts.title[currentState];
    const button = texts.button[currentState]; // Components

    const {
      FormField,
      InputField,
      SelectField,
      RadioField,
      SubmitField,
      TitleField,
      ErrorsField
    } = AccountsReact.components; // Global errors

    const globalErrors = errors ? errors.filter(errField => errField._id === '__globals') : [];
    return React.createElement(FormField, {
      onSubmit: e => e.preventDefault(),
      className: `ar-${currentState}`
    }, title && React.createElement(TitleField, {
      text: title
    }), React.createElement("div", {
      className: "ar-fields"
    }, fields.map((f, i) => {
      let Field = InputField; // Defaults to input

      switch (f.type) {
        case 'select':
          Field = SelectField;
          break;

        case 'radio':
          Field = RadioField;
          break;
      }

      const props = (0, _objectSpread2.default)({
        key: i,
        values,
        defaults,
        onChange: this.handleInputChange,
        error: errors ? errors.find(errField => errField._id === f._id) : []
      }, f);

      if (this.shouldFocusFirstInput(i)) {
        props.focusInput = true;
      }

      return React.createElement(Field, props);
    })), showReCaptcha && React.createElement("div", {
      id: "recaptcha-container"
    }), React.createElement(SubmitField, {
      onClick: onSubmit,
      text: button
    }), React.createElement("div", {
      className: "ar-errors"
    }, errors.length > 0 && React.createElement(ErrorsField, {
      errors: globalErrors
    })));
  }

}

BaseForm.propTypes = {
  context: PropTypes.object.isRequired,
  currentState: PropTypes.string.isRequired,
  values: PropTypes.object.isRequired,
  defaults: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  errors: PropTypes.array.isRequired
};
module.exportDefault(BaseForm);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"changePwd.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/meteoreact_accounts/lib/AccountsReactComponent/changePwd.js                                            //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
let React, Component, Fragment;
module.link("react", {
  default(v) {
    React = v;
  },

  Component(v) {
    Component = v;
  },

  Fragment(v) {
    Fragment = v;
  }

}, 0);
let BaseForm;
module.link("./baseForm", {
  default(v) {
    BaseForm = v;
  }

}, 1);
let validateForm;
module.link("../utils/", {
  validateForm(v) {
    validateForm = v;
  }

}, 2);
let getModel, redirect;
module.link("./commonUtils", {
  getModel(v) {
    getModel = v;
  },

  redirect(v) {
    redirect = v;
  }

}, 3);
let changePassword;
module.link("./methods", {
  changePassword(v) {
    changePassword = v;
  }

}, 4);

class ChangePwd extends Component {
  constructor() {
    super();

    this.onSubmit = () => {
      // Validate form
      if (!validateForm(this.getModel(), this)) return;
      const {
        currentPassword,
        password
      } = this.getModel(); // Change password

      changePassword(currentPassword, password, err => {
        if (err) {
          this.setState({
            errors: [{
              _id: '__globals',
              errStr: err.reason
            }],
            passwordUpdated: false
          });
        } else {
          this.setState({
            errors: [],
            passwordUpdated: true
          });
        }

        this.props.defaults.onSubmitHook(err, this.props.currentState);
      });
    };

    this.state = {
      passwordUpdated: false,
      errors: []
    };
    this.getModel = getModel.bind(this);
    this.redirect = redirect.bind(this);
  }

  componentWillMount() {
    if (!Meteor.userId()) {
      this.redirect('signin', this.props.defaults.redirects.toSignIn);
    }
  }

  render() {
    const {
      currentState,
      defaults
    } = this.props;
    const {
      texts
    } = defaults;
    const {
      passwordUpdated,
      errors
    } = this.state;
    const model = this.getModel();
    return React.createElement(Fragment, null, React.createElement(BaseForm, {
      context: this,
      currentState: currentState,
      values: model,
      defaults: defaults,
      onSubmit: this.onSubmit,
      errors: errors
    }), passwordUpdated && React.createElement("p", null, texts.info.pwdChanged));
  }

}

module.exportDefault(ChangePwd);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"forgotPwd.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/meteoreact_accounts/lib/AccountsReactComponent/forgotPwd.js                                            //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
let React, Component, Fragment;
module.link("react", {
  default(v) {
    React = v;
  },

  Component(v) {
    Component = v;
  },

  Fragment(v) {
    Fragment = v;
  }

}, 0);
let BaseForm;
module.link("./baseForm", {
  default(v) {
    BaseForm = v;
  }

}, 1);
let validateForm;
module.link("../utils/", {
  validateForm(v) {
    validateForm = v;
  }

}, 2);
let getModel, redirect;
module.link("./commonUtils", {
  getModel(v) {
    getModel = v;
  },

  redirect(v) {
    redirect = v;
  }

}, 3);
let forgotPassword;
module.link("./methods", {
  forgotPassword(v) {
    forgotPassword = v;
  }

}, 4);

class ForgotPassword extends Component {
  constructor() {
    super();

    this.onSubmit = () => {
      // Validate form
      if (!validateForm(this.getModel(), this)) return;
      this.sentPasswordResetLink();
    };

    this.sentPasswordResetLink = () => {
      // Send a reset link to the desired email
      forgotPassword({
        email: this.state.email
      }, err => {
        if (err) {
          this.setState({
            errors: [{
              _id: '__globals',
              errStr: err.reason
            }],
            emailSent: false
          });
        } else {
          this.setState({
            errors: [],
            emailSent: true
          });
        }

        this.props.defaults.onSubmitHook(err, this.props.currentState);
      });
    };

    this.redirectToSignIn = () => {
      this.redirect('signIn', this.props.defaults.redirects.toSignIn);
    };

    this.state = {
      emailSent: false,
      errors: []
    };
    this.getModel = getModel.bind(this);
    this.redirect = redirect.bind(this);
  }

  render() {
    const {
      currentState,
      defaults
    } = this.props;
    const {
      texts,
      hideSignInLink
    } = defaults;
    const {
      errors,
      emailSent
    } = this.state;
    const model = this.getModel();
    return React.createElement(Fragment, null, React.createElement(BaseForm, {
      context: this,
      currentState: currentState,
      values: model,
      defaults: defaults,
      onSubmit: this.onSubmit,
      errors: errors
    }), emailSent && React.createElement("p", {
      className: "email-sent"
    }, texts.info.emailSent), !hideSignInLink && React.createElement("a", {
      className: "signIn-link",
      onMouseDown: this.redirectToSignIn,
      href: ""
    }, texts.links.toSignIn));
  }

}

module.exportDefault(ForgotPassword);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"index.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/meteoreact_accounts/lib/AccountsReactComponent/index.js                                                //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
let React, createElement;
module.link("react", {
  default(v) {
    React = v;
  },

  createElement(v) {
    createElement = v;
  }

}, 0);
let PropTypes;
module.link("prop-types", {
  default(v) {
    PropTypes = v;
  }

}, 1);
let SignIn;
module.link("./signIn", {
  default(v) {
    SignIn = v;
  }

}, 2);
let SignUp;
module.link("./signUp", {
  default(v) {
    SignUp = v;
  }

}, 3);
let ForgotPwd;
module.link("./forgotPwd", {
  default(v) {
    ForgotPwd = v;
  }

}, 4);
let ChangePwd;
module.link("./changePwd", {
  default(v) {
    ChangePwd = v;
  }

}, 5);
let ResetPwd;
module.link("./resetPwd", {
  default(v) {
    ResetPwd = v;
  }

}, 6);
let AccountsReact;
module.link("../AccountsReact", {
  default(v) {
    AccountsReact = v;
  }

}, 7);
let merge;
module.link("../utils/deepmerge", {
  default(v) {
    merge = v;
  }

}, 8);

class AccountsReactComponent extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {
      internalState: '' // If set - it will override state from props

    };

    this.changeInternalState = toState => {
      this.setState({
        internalState: toState
      });
    };
  }

  render() {
    ensureComponentsExist(); // State priority -> 1.internal 2. provided by route/state prop (from parent component) 3. default state from config

    let state = this.state.internalState || this.props.state;

    if (!state) {
      const {
        mapStateToRoute
      } = AccountsReact.config;
      const {
        route
      } = this.props;

      if (route) {
        state = Object.keys(mapStateToRoute).find(key => mapStateToRoute[key] === route);
      } else {
        state = AccountsReact.config.defaultState;
      }
    }

    let form;

    switch (state) {
      case 'signIn':
        form = SignIn;
        break;

      case 'signUp':
        form = SignUp;
        break;

      case 'forgotPwd':
        form = ForgotPwd;
        break;

      case 'changePwd':
        form = ChangePwd;
        break;

      case 'resetPwd':
        form = ResetPwd;
        break;

      default:
        return null;
    }

    const defaults = merge.all([AccountsReact.config, this.props.config]);

    if (!defaults.enablePasswordChange && state === 'changePwd') {
      return null;
    }

    const props = {
      currentState: state,
      changeState: this.changeInternalState,
      history: this.props.history,
      token: this.props.token,
      defaults
    };
    return createElement(form, props);
  }

}

function ensureComponentsExist() {
  if (!AccountsReact.components) {
    throw new Error('Please ensure you have provided AccountsReact a set of components to use');
  }
}

AccountsReactComponent.defaultProps = {
  config: {}
};
AccountsReactComponent.propTypes = {
  state: PropTypes.string,
  route: PropTypes.string,
  config: PropTypes.object
};
module.exportDefault(AccountsReactComponent);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"resetPwd.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/meteoreact_accounts/lib/AccountsReactComponent/resetPwd.js                                             //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
let React, Component, Fragment;
module.link("react", {
  default(v) {
    React = v;
  },

  Component(v) {
    Component = v;
  },

  Fragment(v) {
    Fragment = v;
  }

}, 0);
let BaseForm;
module.link("./baseForm", {
  default(v) {
    BaseForm = v;
  }

}, 1);
let validateForm;
module.link("../utils/", {
  validateForm(v) {
    validateForm = v;
  }

}, 2);
let getModel, redirect;
module.link("./commonUtils", {
  getModel(v) {
    getModel = v;
  },

  redirect(v) {
    redirect = v;
  }

}, 3);
let resetPassword;
module.link("./methods", {
  resetPassword(v) {
    resetPassword = v;
  }

}, 4);

class ResetPwd extends Component {
  constructor() {
    super();

    this.onSubmit = () => {
      // Validate form
      if (!validateForm(this.getModel(), this)) return;
      const {
        password
      } = this.getModel(); // Change password

      resetPassword(this.props.token, password, err => {
        if (err) {
          this.setState({
            errors: [{
              _id: '__globals',
              errStr: err.reason
            }],
            passwordUpdated: false
          });
        } else {
          this.setState({
            errors: [],
            passwordUpdated: true
          });
        }

        this.props.defaults.onSubmitHook(err, this.props.currentState);
      });
    };

    this.state = {
      passwordUpdated: false,
      errors: []
    };
    this.getModel = getModel.bind(this);
    this.redirect = redirect.bind(this);
  }

  render() {
    const {
      currentState,
      defaults
    } = this.props;
    const {
      texts
    } = defaults;
    const {
      passwordUpdated,
      errors
    } = this.state;
    const model = this.getModel();
    return React.createElement(Fragment, null, React.createElement(BaseForm, {
      context: this,
      currentState: currentState,
      values: model,
      defaults: defaults,
      onSubmit: this.onSubmit,
      errors: errors
    }), passwordUpdated && React.createElement("p", null, texts.info.pwdSet));
  }

}

module.exportDefault(ResetPwd);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"signIn.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/meteoreact_accounts/lib/AccountsReactComponent/signIn.js                                               //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
let React, Component, Fragment;
module.link("react", {
  default(v) {
    React = v;
  },

  Component(v) {
    Component = v;
  },

  Fragment(v) {
    Fragment = v;
  }

}, 0);
let BaseForm;
module.link("./baseForm", {
  default(v) {
    BaseForm = v;
  }

}, 1);
let validateForm;
module.link("../utils", {
  validateForm(v) {
    validateForm = v;
  }

}, 2);
let getModel, redirect;
module.link("./commonUtils", {
  getModel(v) {
    getModel = v;
  },

  redirect(v) {
    redirect = v;
  }

}, 3);
let login;
module.link("./methods", {
  login(v) {
    login = v;
  }

}, 4);
let SocialButtons;
module.link("./socialButtons", {
  default(v) {
    SocialButtons = v;
  }

}, 5);

class SignIn extends Component {
  constructor() {
    super();

    this.onSubmit = () => {
      /* Login */
      const model = this.getModel(); // Validate form

      if (!validateForm(model, this)) return;
      const {
        username,
        email,
        password
      } = model; // Login

      login(username, email, password, err => {
        if (err) {
          this.setState({
            errors: [{
              _id: '__globals',
              errStr: err.reason
            }]
          });
        } else {
          const {
            onLoginHook
          } = this.props.defaults;

          if (onLoginHook) {
            onLoginHook();
          }
        }
      });
    };

    this.redirectToSignUp = () => {
      this.redirect('signUp', this.props.defaults.redirects.toSignUp);
    };

    this.redirectToForgotPwd = () => {
      this.redirect('forgotPwd', this.props.defaults.redirects.toForgotPwd);
    };

    this.state = {
      errors: []
    };
    this.getModel = getModel.bind(this);
    this.redirect = redirect.bind(this);
  }

  render() {
    const {
      currentState,
      defaults
    } = this.props;
    const {
      texts,
      hideSignUpLink,
      showForgotPasswordLink
    } = defaults;
    const model = this.getModel();
    return React.createElement(Fragment, null, React.createElement(BaseForm, {
      context: this,
      currentState: currentState,
      values: model,
      defaults: defaults,
      onSubmit: this.onSubmit,
      errors: this.state.errors
    }), React.createElement(SocialButtons, {
      defaults: defaults
    }), !hideSignUpLink && React.createElement("a", {
      className: "signIn-link",
      onMouseDown: this.redirectToSignUp,
      style: linkStyle,
      href: ""
    }, texts.links.toSignUp), showForgotPasswordLink && React.createElement("a", {
      className: "forgotPwd-link",
      onMouseDown: this.redirectToForgotPwd,
      style: linkStyle,
      href: ""
    }, texts.links.toForgotPwd));
  }

}

const linkStyle = {
  display: 'block',
  cursor: 'pointer'
};
module.exportDefault(SignIn);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"signUp.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/meteoreact_accounts/lib/AccountsReactComponent/signUp.js                                               //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

let React, Component, Fragment;
module.link("react", {
  default(v) {
    React = v;
  },

  Component(v) {
    Component = v;
  },

  Fragment(v) {
    Fragment = v;
  }

}, 0);
let Accounts;
module.link("meteor/accounts-base", {
  Accounts(v) {
    Accounts = v;
  }

}, 1);
let AccountsReact;
module.link("../AccountsReact", {
  default(v) {
    AccountsReact = v;
  }

}, 2);
let BaseForm;
module.link("./baseForm", {
  default(v) {
    BaseForm = v;
  }

}, 3);
let validateForm;
module.link("../utils", {
  validateForm(v) {
    validateForm = v;
  }

}, 4);
let getModel, redirect;
module.link("./commonUtils", {
  getModel(v) {
    getModel = v;
  },

  redirect(v) {
    redirect = v;
  }

}, 5);
let createUser, login;
module.link("./methods", {
  createUser(v) {
    createUser = v;
  },

  login(v) {
    login = v;
  }

}, 6);

class SignUp extends Component {
  constructor() {
    super();

    this.onSubmit = () => {
      const model = this.getModel(); // Validate form

      if (!validateForm(model, this)) {
        return;
      }

      const _this$getModel = this.getModel(),
            {
        username,
        email,
        password,
        confirmPassword
      } = _this$getModel,
            profile = (0, _objectWithoutProperties2.default)(_this$getModel, ["username", "email", "password", "confirmPassword"]); // The user object to insert


      const newUser = (0, _objectSpread2.default)({
        username,
        email,
        password: password ? Accounts._hashPassword(password) : ''
      }, profile);
      const {
        showReCaptcha,
        preSignupHook,
        onSubmitHook,
        loginAfterSignup
      } = this.props.defaults; // Add recaptcha field

      if (showReCaptcha) {
        newUser.tempReCaptchaResponse = AccountsReact.config.tempReCaptchaResponse;
      }

      preSignupHook(password, newUser);
      createUser(newUser, err => {
        if (err) {
          // validation errors suppose to be inside an array, if string then its a different error
          if (typeof err.reason !== 'string') {
            this.setState({
              errors: err.reason
            });
          } else {
            this.setState({
              errors: [{
                _id: '__globals',
                errStr: err.reason
              }]
            });
          }
        } else if (loginAfterSignup) {
          const {
            password
          } = this.getModel();
          const {
            username,
            email
          } = newUser;
          login(username, email, password, err => {
            if (err) {
              return;
            } // ?

          });
        }

        onSubmitHook(err, this.props.currentState);
      });
    };

    this.redirectToSignIn = () => {
      this.redirect('signIn', this.props.defaults.redirects.toSignIn);
    };

    this.state = {
      errors: []
    };
    this.getModel = getModel.bind(this);
    this.redirect = redirect.bind(this);
  }

  render() {
    const {
      currentState,
      defaults
    } = this.props;
    const {
      texts,
      hideSignInLink,
      showReCaptcha
    } = defaults;
    return React.createElement(Fragment, null, React.createElement(BaseForm, {
      context: this,
      currentState: currentState,
      values: this.getModel(),
      defaults: defaults,
      onSubmit: this.onSubmit,
      errors: this.state.errors,
      showReCaptcha: showReCaptcha
    }), !hideSignInLink && React.createElement("a", {
      className: "signIn-link",
      onMouseDown: this.redirectToSignIn,
      style: linkStyle,
      href: ""
    }, texts.links.toSignIn));
  }

}

const linkStyle = {
  display: 'block'
};
module.exportDefault(SignUp);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"socialButtons.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/meteoreact_accounts/lib/AccountsReactComponent/socialButtons.js                                        //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
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
let AccountsReact;
module.link("../AccountsReact", {
  default(v) {
    AccountsReact = v;
  }

}, 2);

class SocialButtons extends React.Component {
  constructor(...args) {
    super(...args);

    this.loginWith = service => {
      let _service = service[0].toUpperCase() + service.substr(1);

      if (service === 'meteor-developer') {
        _service = 'MeteorDeveloperAccount';
      }

      const options = AccountsReact.config.oauth[service] || {};

      Meteor['loginWith' + _service](options, err => {
        if (!err) {
          const {
            onLoginHook
          } = this.props.defaults;

          if (onLoginHook) {
            onLoginHook();
          }
        }
      });
    };
  }

  render() {
    if (!Accounts.oauth) {
      return null;
    }

    const services = Accounts.oauth.serviceNames();
    const {
      SubmitField
    } = AccountsReact.components;
    return services && services.map((service, i) => {
      return React.createElement(SubmitField, {
        key: i,
        onClick: () => this.loginWith(service),
        social: service,
        text: service
      });
    });
  }

}

module.exportDefault(SocialButtons);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"commonUtils":{"getModel.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/meteoreact_accounts/lib/AccountsReactComponent/commonUtils/getModel.js                                 //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
/* Generic getModel for the state components */
function getModel() {
  /* Get only form values from state, "this" is binded to the state's class */
  const {
    currentState,
    defaults
  } = this.props;
  const stateKeys = Object.keys(this.state);
  const fields = defaults.fields[currentState];
  const model = stateKeys.filter(key => fields.find(f => f._id === key)) // Only keys in the defined fields array
  .reduce((obj, key) => {
    // Create a new object
    obj[key] = this.state[key];
    return obj;
  }, {});
  return model;
}

module.exportDefault(getModel);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"handleInputChange.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/meteoreact_accounts/lib/AccountsReactComponent/commonUtils/handleInputChange.js                        //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
let validateOnChange;
module.link("../../utils/validateField", {
  validateOnChange(v) {
    validateOnChange = v;
  }

}, 0);

/* Define a change handler for fields */
function handleInputChange(e, _id) {
  // *this* is bound to calling components
  // Check if e is already a string value or an event object
  const value = typeof e === 'string' ? e : e.target.value;
  if (fieldChangedAtLeastOnce(this.state, _id, value)) return;
  const {
    currentState,
    defaults
  } = this.props;
  const fields = defaults.fields[currentState]; // if e is a string it means that it's a default value and doesn't need to pass validation

  if (typeof e !== 'string') {
    const errors = validateOnChange(e, _id, fields, this.getModel(), [...this.state.errors]);

    if (errors) {
      this.setState({
        errors
      });
    }
  }

  this.setState({
    [_id]: value
  });
}

function fieldChangedAtLeastOnce(state, _id, value) {
  return !state.hasOwnProperty(_id) && value === '';
}

module.exportDefault(handleInputChange);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"index.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/meteoreact_accounts/lib/AccountsReactComponent/commonUtils/index.js                                    //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
module.export({
  getModel: () => getModel,
  redirect: () => redirect,
  handleInputChange: () => handleInputChange
});
let getModel;
module.link("./getModel", {
  default(v) {
    getModel = v;
  }

}, 0);
let redirect;
module.link("./redirect", {
  default(v) {
    redirect = v;
  }

}, 1);
let handleInputChange;
module.link("./handleInputChange", {
  default(v) {
    handleInputChange = v;
  }

}, 2);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"redirect.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/meteoreact_accounts/lib/AccountsReactComponent/commonUtils/redirect.js                                 //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
let AccountsReact;
module.link("../../AccountsReact", {
  default(v) {
    AccountsReact = v;
  }

}, 0);

/* Redirect to different state after link clicked */
const redirect = function (toState, hook) {
  // *this* is bound to the calling components
  //  Run hook function if set || push state via history || change state internally
  if (hook) {
    hook();
  } else if (this.props.history) {
    this.props.history.push(AccountsReact.config.mapStateToRoute[toState]);
  } else {
    this.props.changeState(toState);
  }

  return;
};

module.exportDefault(redirect);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"methods":{"ARCreateAccount.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/meteoreact_accounts/lib/AccountsReactComponent/methods/ARCreateAccount.js                              //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

let Accounts;
module.link("meteor/accounts-base", {
  Accounts(v) {
    Accounts = v;
  }

}, 0);
let ValidatedMethod;
module.link("meteor/mdg:validated-method", {
  ValidatedMethod(v) {
    ValidatedMethod = v;
  }

}, 1);
let AccountsReact;
module.link("../../AccountsReact", {
  default(v) {
    AccountsReact = v;
  }

}, 2);
let validateField;
module.link("../../utils/validateField", {
  default(v) {
    validateField = v;
  }

}, 3);
const ARCreateAccount = new ValidatedMethod({
  name: 'ARCreateAccount',
  validate: (_ref) => {
    let {
      username,
      email,
      password
    } = _ref,
        profile = (0, _objectWithoutProperties2.default)(_ref, ["username", "email", "password"]);

    /* This validation runs on both client and server */
    if (Meteor.userId()) {
      throw new Meteor.Error('Error', 'Already logged in');
    }

    let signupFields = AccountsReact.config.fields.signUp; // Remove password confirmation if not set

    if (!AccountsReact.config.confirmPassword) {
      signupFields = signupFields.filter(f => f._id !== 'confirmPassword');
    } // Check that recaptcha token is included if necessary


    if (AccountsReact.config.showReCaptcha && !profile.tempReCaptchaResponse) {
      throw new Meteor.Error('ReCaptchaError', AccountsReact.config.texts.errors.captchaVerification);
    }

    const newUser = (0, _objectSpread2.default)({
      username,
      email,
      password
    }, profile);
    let errors = [];
    signupFields.forEach(field => {
      validateField(signupFields, field, newUser[field._id], newUser, errors);
    });

    if (errors.length > 0) {
      throw new Meteor.Error('ARCreateAccount', errors);
    }
  },

  run(newUser) {
    const {
      username,
      email,
      password
    } = newUser,
          profile = (0, _objectWithoutProperties2.default)(newUser, ["username", "email", "password"]);
    const userObject = {
      username,
      email,
      password,
      profile // Unnecessary fields (used only for validation)

    };
    delete userObject.profile.passwordConfirmation;

    if (!username) {
      delete userObject.username;
    } else if (!email) {
      delete userObject.email;
    } // Create the user on the server only!


    if (Meteor.isServer) {
      if (AccountsReact.config.showReCaptcha) {
        const res = HTTP.post('https://www.google.com/recaptcha/api/siteverify', {
          params: {
            secret: AccountsReact.config.reCaptcha.secretKey || Meteor.settings.reCaptcha.secretKey,
            response: userObject.profile.tempReCaptchaResponse,
            remoteip: this.connection.clientAddress
          }
        }).data;

        if (!res.success) {
          throw new Meteor.Error('ReCaptchaError', AccountsReact.config.texts.errors.captchaVerification);
        }

        delete userObject.profile.tempReCaptchaResponse;
      }

      const userId = Accounts.createUser(userObject);

      if (!userId) {
        // safety belt. createUser is supposed to throw on error. send 500 error
        // instead of sending a verification email with empty userid.

        /* it was taken directly from useraccounts package */
        throw new Error('createUser failed to insert new user');
      }

      if (userObject.email && AccountsReact.config.sendVerificationEmail) {
        Accounts.sendVerificationEmail(userId, userObject.email);
      }
    }
  }

});
module.exportDefault(ARCreateAccount);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"index.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/meteoreact_accounts/lib/AccountsReactComponent/methods/index.js                                        //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
module.export({
  createUser: () => createUser,
  login: () => login,
  forgotPassword: () => forgotPassword,
  changePassword: () => changePassword,
  resetPassword: () => resetPassword
});
let Accounts;
module.link("meteor/accounts-base", {
  Accounts(v) {
    Accounts = v;
  }

}, 0);
let ARCreateAccount;
module.link("./ARCreateAccount", {
  default(v) {
    ARCreateAccount = v;
  }

}, 1);
let AccountsReact;
module.link("../../AccountsReact", {
  default(v) {
    AccountsReact = v;
  }

}, 2);

const createUser = (newUser, callback) => {
  ARCreateAccount.call(newUser, callback);
};

const login = (username, email, password, callback) => {
  Meteor.loginWithPassword(username || email, password, err => {
    callback(err);
  });
};

const forgotPassword = (email, callback) => {
  Accounts.forgotPassword(email, callback);
};

const changePassword = (oldPassword, newPassword, callback) => {
  Accounts.changePassword(oldPassword, newPassword, callback);
};

const resetPassword = (token, newPassword, callback) => {
  Accounts.resetPassword(token, newPassword, callback);
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},"utils":{"index.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/meteoreact_accounts/lib/utils/index.js                                                                 //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
module.export({
  regExp: () => regExp,
  validateField: () => validateField,
  validateOnChange: () => validateOnChange,
  validateForm: () => validateForm
});
let regExp;
module.link("./regExp", {
  default(v) {
    regExp = v;
  }

}, 0);
let validateField, validateOnChange;
module.link("./validateField", {
  default(v) {
    validateField = v;
  },

  validateOnChange(v) {
    validateOnChange = v;
  }

}, 1);
let validateForm;
module.link("./validateForm", {
  default(v) {
    validateForm = v;
  }

}, 2);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"regExp.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/meteoreact_accounts/lib/utils/regExp.js                                                                //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
module.exportDefault({
  // Emails with TLD
  Email: /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+(?:\.[A-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[A-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[A-z0-9]{2,}(?:[a-z0-9-]*[a-z0-9])?$/,
  Username: /^[a-zA-Z0-9]+([_ -]?[a-zA-Z0-9])*$/
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"validateField.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/meteoreact_accounts/lib/utils/validateField.js                                                         //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
module.export({
  default: () => validateField,
  validateOnChange: () => validateOnChange
});
let AccountsReact;
module.link("../AccountsReact", {
  default(v) {
    AccountsReact = v;
  }

}, 0);

/* Validate fields specified in AccountsReact.config */
const validateField = (fields, fieldObj, value, model, errorsArray = []) => {
  const {
    _id,
    required,
    func,
    re,
    minLength,
    maxLength,
    errStr
  } = fieldObj; // Validate through a function provided by the user

  if (func) {
    return func(fields, fieldObj, value, model, errorsArray);
  } // Make sure that a value exists and required is not false to continue validation


  if (!value) {
    if (required === false) {
      // Do nothing
      return true;
    } else {
      errorsArray.push({
        _id,
        errStr: errStr || `${_id} is required`
      });
      return;
    }
  } // Validate by regular exporession


  if (re && !re.test(value)) {
    errorsArray.push({
      _id,
      errStr: errStr || `${value} is not valid as ${_id}`
    });
    return;
  } // Validate min length


  if (minLength && minLength > value.length) {
    errorsArray.push({
      _id,
      errStr: errStr || `${_id} length must be at least ${minLength} characters`
    });
    return;
  } // Validate max length


  if (maxLength && maxLength < value.length) {
    errorsArray.push({
      _id,
      errStr: errStr || `${_id} length must be no more than ${maxLength} characters`
    });
    return;
  }

  return true;
};
/* Validate fields on change events when validateOnChange or validateOnFocusOut are set to true */


const validateOnChange = (e, _id, fields, model, errors) => {
  const {
    type,
    target
  } = e;
  const {
    continuousValidation,
    negativeValidation
  } = AccountsReact.config; // Check the conditions match settings

  if (type === 'blur' && negativeValidation || type === 'change' && continuousValidation) {
    const fieldObj = fields.find(f => f._id === _id);

    if (!validateField(fields, fieldObj, target.value, model, errors)) {
      return errors;
    } else {
      // Make sure error object for the field doesn't stay after it is valid
      return errors.filter(err => err._id !== _id);
    }
  }
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"validateForm.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/meteoreact_accounts/lib/utils/validateForm.js                                                          //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
let validateField;
module.link("./validateField", {
  default(v) {
    validateField = v;
  }

}, 0);

// Generic form validation for the state components
const validateForm = (model, context) => {
  let _errors = []; // Validate login credentials on client, "loginWithPassword" method will validate on server.

  const {
    currentState,
    defaults
  } = context.props;
  const fields = defaults.fields[currentState];
  fields.forEach(field => {
    validateField(fields, field, model[field._id], model, _errors);
  });

  if (_errors.length > 0) {
    context.setState({
      errors: _errors
    });
    return false;
  }

  return true;
};

module.exportDefault(validateForm);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"deepmerge":{"index.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/meteoreact_accounts/lib/utils/deepmerge/index.js                                                       //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
const module1 = module;
let defaultIsMergeableObject;
module1.link("./is-mergeable-object", {
  default(v) {
    defaultIsMergeableObject = v;
  }

}, 0);

function emptyTarget(val) {
  return Array.isArray(val) ? [] : {};
}

function cloneUnlessOtherwiseSpecified(value, options) {
  return options.clone !== false && options.isMergeableObject(value) ? deepmerge(emptyTarget(value), value, options) : value;
}

function defaultArrayMerge(target, source, options) {
  return target.concat(source).map(function (element) {
    return cloneUnlessOtherwiseSpecified(element, options);
  });
}

function mergeObject(target, source, options) {
  var destination = {};

  if (options.isMergeableObject(target)) {
    Object.keys(target).forEach(function (key) {
      destination[key] = cloneUnlessOtherwiseSpecified(target[key], options);
    });
  }

  Object.keys(source).forEach(function (key) {
    if (!options.isMergeableObject(source[key]) || !target[key]) {
      destination[key] = cloneUnlessOtherwiseSpecified(source[key], options);
    } else {
      destination[key] = deepmerge(target[key], source[key], options);
    }
  });
  return destination;
}

function deepmerge(target, source, options) {
  options = options || {};
  options.arrayMerge = options.arrayMerge || defaultArrayMerge;
  options.isMergeableObject = options.isMergeableObject || defaultIsMergeableObject;
  var sourceIsArray = Array.isArray(source);
  var targetIsArray = Array.isArray(target);
  var sourceAndTargetTypesMatch = sourceIsArray === targetIsArray;

  if (!sourceAndTargetTypesMatch) {
    return cloneUnlessOtherwiseSpecified(source, options);
  } else if (sourceIsArray) {
    return options.arrayMerge(target, source, options);
  } else {
    return mergeObject(target, source, options);
  }
}

deepmerge.all = function deepmergeAll(array, options) {
  if (!Array.isArray(array)) {
    throw new Error('first argument should be an array');
  }

  return array.reduce(function (prev, next) {
    return deepmerge(prev, next, options);
  }, {});
};

module.exports = deepmerge;
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"is-mergeable-object.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/meteoreact_accounts/lib/utils/deepmerge/is-mergeable-object.js                                         //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
/*
  Credit to Josh Duff
  https://github.com/TehShrike/is-mergeable-object
*/
module.exports = function isMergeableObject(value) {
  return isNonNullObject(value) && !isSpecial(value);
};

function isNonNullObject(value) {
  return !!value && typeof value === 'object';
}

function isSpecial(value) {
  var stringValue = Object.prototype.toString.call(value);
  return stringValue === '[object RegExp]' || stringValue === '[object Date]' || isReactElement(value);
} // see https://github.com/facebook/react/blob/b5ac963fb791d1298e7f396236383bc955f916c1/src/isomorphic/classic/element/ReactElement.js#L21-L25


var canUseSymbol = typeof Symbol === 'function' && Symbol.for;
var REACT_ELEMENT_TYPE = canUseSymbol ? Symbol.for('react.element') : 0xeac7;

function isReactElement(value) {
  return value.$$typeof === REACT_ELEMENT_TYPE;
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}},"node_modules":{"react":{"package.json":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// node_modules/meteor/meteoreact_accounts/node_modules/react/package.json                                         //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
module.exports = {
  "name": "react",
  "version": "16.3.0",
  "main": "index.js"
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"index.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// node_modules/meteor/meteoreact_accounts/node_modules/react/index.js                                             //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
module.useNode();
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"prop-types":{"package.json":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// node_modules/meteor/meteoreact_accounts/node_modules/prop-types/package.json                                    //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
module.exports = {
  "name": "prop-types",
  "version": "15.6.1",
  "main": "index.js"
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"index.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// node_modules/meteor/meteoreact_accounts/node_modules/prop-types/index.js                                        //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
module.useNode();
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});

var exports = require("/node_modules/meteor/meteoreact:accounts/index.js");

/* Exports */
Package._define("meteoreact:accounts", exports);

})();

//# sourceURL=meteor://💻app/packages/meteoreact_accounts.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvbWV0ZW9yZWFjdDphY2NvdW50cy9pbmRleC5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvbWV0ZW9yZWFjdDphY2NvdW50cy9saWIvQWNjb3VudHNSZWFjdC5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvbWV0ZW9yZWFjdDphY2NvdW50cy9saWIvaW5kZXguanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL21ldGVvcmVhY3Q6YWNjb3VudHMvbGliL0FjY291bnRzUmVhY3RDb21wb25lbnQvYmFzZUZvcm0uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL21ldGVvcmVhY3Q6YWNjb3VudHMvbGliL0FjY291bnRzUmVhY3RDb21wb25lbnQvY2hhbmdlUHdkLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9tZXRlb3JlYWN0OmFjY291bnRzL2xpYi9BY2NvdW50c1JlYWN0Q29tcG9uZW50L2ZvcmdvdFB3ZC5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvbWV0ZW9yZWFjdDphY2NvdW50cy9saWIvQWNjb3VudHNSZWFjdENvbXBvbmVudC9pbmRleC5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvbWV0ZW9yZWFjdDphY2NvdW50cy9saWIvQWNjb3VudHNSZWFjdENvbXBvbmVudC9yZXNldFB3ZC5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvbWV0ZW9yZWFjdDphY2NvdW50cy9saWIvQWNjb3VudHNSZWFjdENvbXBvbmVudC9zaWduSW4uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL21ldGVvcmVhY3Q6YWNjb3VudHMvbGliL0FjY291bnRzUmVhY3RDb21wb25lbnQvc2lnblVwLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9tZXRlb3JlYWN0OmFjY291bnRzL2xpYi9BY2NvdW50c1JlYWN0Q29tcG9uZW50L3NvY2lhbEJ1dHRvbnMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL21ldGVvcmVhY3Q6YWNjb3VudHMvbGliL0FjY291bnRzUmVhY3RDb21wb25lbnQvY29tbW9uVXRpbHMvZ2V0TW9kZWwuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL21ldGVvcmVhY3Q6YWNjb3VudHMvbGliL0FjY291bnRzUmVhY3RDb21wb25lbnQvY29tbW9uVXRpbHMvaGFuZGxlSW5wdXRDaGFuZ2UuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL21ldGVvcmVhY3Q6YWNjb3VudHMvbGliL0FjY291bnRzUmVhY3RDb21wb25lbnQvY29tbW9uVXRpbHMvaW5kZXguanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL21ldGVvcmVhY3Q6YWNjb3VudHMvbGliL0FjY291bnRzUmVhY3RDb21wb25lbnQvY29tbW9uVXRpbHMvcmVkaXJlY3QuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL21ldGVvcmVhY3Q6YWNjb3VudHMvbGliL0FjY291bnRzUmVhY3RDb21wb25lbnQvbWV0aG9kcy9BUkNyZWF0ZUFjY291bnQuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL21ldGVvcmVhY3Q6YWNjb3VudHMvbGliL0FjY291bnRzUmVhY3RDb21wb25lbnQvbWV0aG9kcy9pbmRleC5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvbWV0ZW9yZWFjdDphY2NvdW50cy9saWIvdXRpbHMvaW5kZXguanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL21ldGVvcmVhY3Q6YWNjb3VudHMvbGliL3V0aWxzL3JlZ0V4cC5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvbWV0ZW9yZWFjdDphY2NvdW50cy9saWIvdXRpbHMvdmFsaWRhdGVGaWVsZC5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvbWV0ZW9yZWFjdDphY2NvdW50cy9saWIvdXRpbHMvdmFsaWRhdGVGb3JtLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9tZXRlb3JlYWN0OmFjY291bnRzL2xpYi91dGlscy9kZWVwbWVyZ2UvaW5kZXguanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL21ldGVvcmVhY3Q6YWNjb3VudHMvbGliL3V0aWxzL2RlZXBtZXJnZS9pcy1tZXJnZWFibGUtb2JqZWN0LmpzIl0sIm5hbWVzIjpbIm1vZHVsZSIsImV4cG9ydHMiLCJyZXF1aXJlIiwiTWV0ZW9yIiwibGluayIsInYiLCJBY2NvdW50cyIsInJlZ0V4cCIsImRlZmF1bHQiLCJtZXJnZSIsIkFjY291bnRzUmVhY3RfIiwiY29uc3RydWN0b3IiLCJfaW5pdCIsImNvbmZpZyIsImNvbmZpcm1QYXNzd29yZCIsImRlZmF1bHRTdGF0ZSIsImRpc2FibGVGb3Jnb3RQYXNzd29yZCIsImVuYWJsZVBhc3N3b3JkQ2hhbmdlIiwiZm9jdXNGaXJzdElucHV0IiwiaXNDb3Jkb3ZhIiwiZm9yYmlkQ2xpZW50QWNjb3VudENyZWF0aW9uIiwibG93ZXJjYXNlVXNlcm5hbWUiLCJsb2dpbkFmdGVyU2lnbnVwIiwib3ZlcnJpZGVMb2dpbkVycm9ycyIsInBhc3N3b3JkU2lnbnVwRmllbGRzIiwic2VuZFZlcmlmaWNhdGlvbkVtYWlsIiwic2V0RGVueVJ1bGVzIiwiaGlkZVNpZ25JbkxpbmsiLCJoaWRlU2lnblVwTGluayIsInNob3dGb3Jnb3RQYXNzd29yZExpbmsiLCJzaG93TGFiZWxzIiwic2hvd1BsYWNlaG9sZGVycyIsImNvbnRpbnVvdXNWYWxpZGF0aW9uIiwibmVnYXRpdmVWYWxpZGF0aW9uIiwib25TdWJtaXRIb29rIiwiZXJyb3JzIiwic3RhdGUiLCJwcmVTaWdudXBIb29rIiwicGFzc3dvcmQiLCJpbmZvIiwicmVkaXJlY3RzIiwibWFwU3RhdGVUb1JvdXRlIiwic2lnbkluIiwic2lnblVwIiwiZm9yZ290UHdkIiwiY2hhbmdlUHdkIiwicmVzZXRQd2QiLCJmaWVsZHMiLCJfaWQiLCJkaXNwbGF5TmFtZSIsInBsYWNlaG9sZGVyIiwicmUiLCJFbWFpbCIsInR5cGUiLCJtaW5MZW5ndGgiLCJtYXhMZW5ndGgiLCJVc2VybmFtZSIsImVyclN0ciIsImV4Y2x1ZGUiLCJmdW5jIiwiZmllbGRPYmoiLCJ2YWx1ZSIsIm1vZGVsIiwiZXJyb3JzQXJyYXkiLCJwdXNoIiwidGV4dHMiLCJidXR0b24iLCJ0aXRsZSIsImxpbmtzIiwidG9DaGFuZ2VQd2QiLCJ0b1Jlc2V0UHdkIiwidG9Gb3Jnb3RQd2QiLCJ0b1NpZ25JbiIsInRvU2lnblVwIiwidG9SZXNlbmRWZXJpZmljYXRpb24iLCJlbWFpbFNlbnQiLCJlbWFpbFZlcmlmaWVkIiwicHdkQ2hhbmdlZCIsInB3ZFJlc2V0IiwicHdkU2V0Iiwic2lnblVwVmVyaWZ5RW1haWwiLCJ2ZXJpZmljYXRpb25FbWFpbFNlbnQiLCJsb2dpbkZvcmJpZGRlbiIsImNhcHRjaGFWZXJpZmljYXRpb24iLCJmb3Jnb3RQd2RTdWJtaXRTdWNjZXNzIiwibG9naW5Gb3JiaWRkZW5NZXNzYWdlIiwic2hvd1JlQ2FwdGNoYSIsInRlbXBSZUNhcHRjaGFSZXNwb25zZSIsIm9hdXRoIiwiY29tcG9uZW50cyIsInN0eWxlIiwib3ZlcnJpZGUiLCJjb25maWd1cmUiLCJkZXRlcm1pbmVTaWdudXBGaWVsZHMiLCJsb2FkUmVDYXB0Y2hhIiwic2V0QWNjb3VudENyZWF0aW9uUG9saWN5IiwiYWRkRmllbGRzIiwiZmllbGRzQXJyYXkiLCJjb25jYXQiLCJleCIsIkVycm9yIiwic2lnbnVwRmlsdGVyZWRGaWVsZHMiLCJzaWduaW5GaWx0ZXJlZEZpZWxkcyIsImZpbHRlciIsImZpZWxkIiwiZm9yRWFjaCIsInJlcXVpcmVkIiwibG9nb3V0Iiwib25Mb2dvdXRIb29rIiwiaXNDbGllbnQiLCJzY3JpcHQiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJib2R5IiwiYXBwZW5kQ2hpbGQiLCJhc3luYyIsInNyYyIsIndpbmRvdyIsInJlQ2FwdGNoYUNhbGxiYWNrIiwicmVzIiwiaXNTZXJ2ZXIiLCJ2YWxpZGF0ZUxvZ2luQXR0ZW1wdCIsImF0dGVtcHQiLCJlcnJvciIsInJlYXNvbiIsImFsbG93ZWQiLCJzZXJ2ZXIiLCJtZXRob2RfaGFuZGxlcnMiLCJmb3Jnb3RQYXNzd29yZCIsInVzZXJzIiwiZGVueSIsInVwZGF0ZSIsInJlbW92ZSIsImluc2VydCIsIkFjY291bnRzUmVhY3QiLCJzdGFydHVwIiwicHJlZml4IiwiUGFja2FnZSIsImV4cG9ydERlZmF1bHQiLCJtb2R1bGUxIiwiQWNjb3VudHNSZWFjdENvbXBvbmVudCIsIlJlYWN0IiwiQ29tcG9uZW50IiwiUHJvcFR5cGVzIiwiaGFuZGxlSW5wdXRDaGFuZ2UiLCJCYXNlRm9ybSIsInByb3BzIiwic2hvdWxkRm9jdXNGaXJzdElucHV0IiwiaW5kZXgiLCJkZWZhdWx0cyIsImJpbmQiLCJjb250ZXh0IiwiY29tcG9uZW50RGlkTW91bnQiLCJyZUNhcHRjaGFQYXJhbXMiLCJyZUNhcHRjaGEiLCJzZXR0aW5ncyIsInB1YmxpYyIsInNldFRpbWVvdXQiLCJncmVjYXB0Y2hhIiwicmVuZGVyIiwiY2FsbGJhY2siLCJjdXJyZW50U3RhdGUiLCJ2YWx1ZXMiLCJvblN1Ym1pdCIsIl9maWVsZHMiLCJGb3JtRmllbGQiLCJJbnB1dEZpZWxkIiwiU2VsZWN0RmllbGQiLCJSYWRpb0ZpZWxkIiwiU3VibWl0RmllbGQiLCJUaXRsZUZpZWxkIiwiRXJyb3JzRmllbGQiLCJnbG9iYWxFcnJvcnMiLCJlcnJGaWVsZCIsImUiLCJwcmV2ZW50RGVmYXVsdCIsIm1hcCIsImYiLCJpIiwiRmllbGQiLCJrZXkiLCJvbkNoYW5nZSIsImZpbmQiLCJmb2N1c0lucHV0IiwibGVuZ3RoIiwicHJvcFR5cGVzIiwib2JqZWN0IiwiaXNSZXF1aXJlZCIsInN0cmluZyIsImFycmF5IiwiRnJhZ21lbnQiLCJ2YWxpZGF0ZUZvcm0iLCJnZXRNb2RlbCIsInJlZGlyZWN0IiwiY2hhbmdlUGFzc3dvcmQiLCJDaGFuZ2VQd2QiLCJjdXJyZW50UGFzc3dvcmQiLCJlcnIiLCJzZXRTdGF0ZSIsInBhc3N3b3JkVXBkYXRlZCIsImNvbXBvbmVudFdpbGxNb3VudCIsInVzZXJJZCIsIkZvcmdvdFBhc3N3b3JkIiwic2VudFBhc3N3b3JkUmVzZXRMaW5rIiwiZW1haWwiLCJyZWRpcmVjdFRvU2lnbkluIiwiU2lnbkluIiwiU2lnblVwIiwiRm9yZ290UHdkIiwiUmVzZXRQd2QiLCJpbnRlcm5hbFN0YXRlIiwiY2hhbmdlSW50ZXJuYWxTdGF0ZSIsInRvU3RhdGUiLCJlbnN1cmVDb21wb25lbnRzRXhpc3QiLCJyb3V0ZSIsIk9iamVjdCIsImtleXMiLCJmb3JtIiwiYWxsIiwiY2hhbmdlU3RhdGUiLCJoaXN0b3J5IiwidG9rZW4iLCJkZWZhdWx0UHJvcHMiLCJyZXNldFBhc3N3b3JkIiwibG9naW4iLCJTb2NpYWxCdXR0b25zIiwidXNlcm5hbWUiLCJvbkxvZ2luSG9vayIsInJlZGlyZWN0VG9TaWduVXAiLCJyZWRpcmVjdFRvRm9yZ290UHdkIiwibGlua1N0eWxlIiwiZGlzcGxheSIsImN1cnNvciIsImNyZWF0ZVVzZXIiLCJwcm9maWxlIiwibmV3VXNlciIsIl9oYXNoUGFzc3dvcmQiLCJsb2dpbldpdGgiLCJzZXJ2aWNlIiwiX3NlcnZpY2UiLCJ0b1VwcGVyQ2FzZSIsInN1YnN0ciIsIm9wdGlvbnMiLCJzZXJ2aWNlcyIsInNlcnZpY2VOYW1lcyIsInN0YXRlS2V5cyIsInJlZHVjZSIsIm9iaiIsInZhbGlkYXRlT25DaGFuZ2UiLCJ0YXJnZXQiLCJmaWVsZENoYW5nZWRBdExlYXN0T25jZSIsImhhc093blByb3BlcnR5IiwiZXhwb3J0IiwiaG9vayIsIlZhbGlkYXRlZE1ldGhvZCIsInZhbGlkYXRlRmllbGQiLCJBUkNyZWF0ZUFjY291bnQiLCJuYW1lIiwidmFsaWRhdGUiLCJzaWdudXBGaWVsZHMiLCJydW4iLCJ1c2VyT2JqZWN0IiwicGFzc3dvcmRDb25maXJtYXRpb24iLCJIVFRQIiwicG9zdCIsInBhcmFtcyIsInNlY3JldCIsInNlY3JldEtleSIsInJlc3BvbnNlIiwicmVtb3RlaXAiLCJjb25uZWN0aW9uIiwiY2xpZW50QWRkcmVzcyIsImRhdGEiLCJzdWNjZXNzIiwiY2FsbCIsImxvZ2luV2l0aFBhc3N3b3JkIiwib2xkUGFzc3dvcmQiLCJuZXdQYXNzd29yZCIsInRlc3QiLCJfZXJyb3JzIiwiZGVmYXVsdElzTWVyZ2VhYmxlT2JqZWN0IiwiZW1wdHlUYXJnZXQiLCJ2YWwiLCJBcnJheSIsImlzQXJyYXkiLCJjbG9uZVVubGVzc090aGVyd2lzZVNwZWNpZmllZCIsImNsb25lIiwiaXNNZXJnZWFibGVPYmplY3QiLCJkZWVwbWVyZ2UiLCJkZWZhdWx0QXJyYXlNZXJnZSIsInNvdXJjZSIsImVsZW1lbnQiLCJtZXJnZU9iamVjdCIsImRlc3RpbmF0aW9uIiwiYXJyYXlNZXJnZSIsInNvdXJjZUlzQXJyYXkiLCJ0YXJnZXRJc0FycmF5Iiwic291cmNlQW5kVGFyZ2V0VHlwZXNNYXRjaCIsImRlZXBtZXJnZUFsbCIsInByZXYiLCJuZXh0IiwiaXNOb25OdWxsT2JqZWN0IiwiaXNTcGVjaWFsIiwic3RyaW5nVmFsdWUiLCJwcm90b3R5cGUiLCJ0b1N0cmluZyIsImlzUmVhY3RFbGVtZW50IiwiY2FuVXNlU3ltYm9sIiwiU3ltYm9sIiwiZm9yIiwiUkVBQ1RfRUxFTUVOVF9UWVBFIiwiJCR0eXBlb2YiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUFBLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQkMsT0FBTyxDQUFDLE9BQUQsQ0FBeEIsQzs7Ozs7Ozs7Ozs7Ozs7O0FDQUEsSUFBSUMsTUFBSjtBQUFXSCxNQUFNLENBQUNJLElBQVAsQ0FBWSxlQUFaLEVBQTRCO0FBQUNELFFBQU0sQ0FBQ0UsQ0FBRCxFQUFHO0FBQUNGLFVBQU0sR0FBQ0UsQ0FBUDtBQUFTOztBQUFwQixDQUE1QixFQUFrRCxDQUFsRDtBQUFxRCxJQUFJQyxRQUFKO0FBQWFOLE1BQU0sQ0FBQ0ksSUFBUCxDQUFZLHNCQUFaLEVBQW1DO0FBQUNFLFVBQVEsQ0FBQ0QsQ0FBRCxFQUFHO0FBQUNDLFlBQVEsR0FBQ0QsQ0FBVDtBQUFXOztBQUF4QixD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QUFPQSxLQUFLLENBQUMwUCxRQUFOLEtBQW1CRCxrQkFBMUI7QUFDQSxDIiwiZmlsZSI6Ii9wYWNrYWdlcy9tZXRlb3JlYWN0X2FjY291bnRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2xpYicpXG4iLCJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJ1xuaW1wb3J0IHsgQWNjb3VudHMgfSBmcm9tICdtZXRlb3IvYWNjb3VudHMtYmFzZSdcbmltcG9ydCByZWdFeHAgZnJvbSAnLi91dGlscy9yZWdFeHAnXG5pbXBvcnQgbWVyZ2UgZnJvbSAnLi91dGlscy9kZWVwbWVyZ2UnXG5cbmNsYXNzIEFjY291bnRzUmVhY3RfIHtcbiAgY29uc3RydWN0b3IgKCkge1xuICAgIHRoaXMuX2luaXQgPSBmYWxzZVxuICAgIHRoaXMuY29uZmlnID0ge1xuXG4gICAgICAvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgICAgICAgICAgICBCZWhhdmlvdXJcbiAgICAgICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5cbiAgICAgIGNvbmZpcm1QYXNzd29yZDogdHJ1ZSxcbiAgICAgIGRlZmF1bHRTdGF0ZTogJ3NpZ25JbicsXG4gICAgICBkaXNhYmxlRm9yZ290UGFzc3dvcmQ6IGZhbHNlLFxuICAgICAgZW5hYmxlUGFzc3dvcmRDaGFuZ2U6IGZhbHNlLFxuICAgICAgZm9jdXNGaXJzdElucHV0OiAhTWV0ZW9yLmlzQ29yZG92YSxcbiAgICAgIGZvcmJpZENsaWVudEFjY291bnRDcmVhdGlvbjogZmFsc2UsXG4gICAgICBsb3dlcmNhc2VVc2VybmFtZTogZmFsc2UsXG4gICAgICBsb2dpbkFmdGVyU2lnbnVwOiB0cnVlLFxuICAgICAgb3ZlcnJpZGVMb2dpbkVycm9yczogdHJ1ZSxcbiAgICAgIHBhc3N3b3JkU2lnbnVwRmllbGRzOiAnRU1BSUxfT05MWScsXG4gICAgICBzZW5kVmVyaWZpY2F0aW9uRW1haWw6IHRydWUsXG4gICAgICBzZXREZW55UnVsZXM6IHRydWUsXG5cbiAgICAgIC8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICAgICAgICAgICBBcHBlYXJhbmNlXG4gICAgICAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG4gICAgICBoaWRlU2lnbkluTGluazogZmFsc2UsXG4gICAgICBoaWRlU2lnblVwTGluazogZmFsc2UsXG4gICAgICBzaG93Rm9yZ290UGFzc3dvcmRMaW5rOiBmYWxzZSxcbiAgICAgIHNob3dMYWJlbHM6IHRydWUsXG4gICAgICBzaG93UGxhY2Vob2xkZXJzOiB0cnVlLFxuXG4gICAgICAvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgICAgQ2xpZW50IFNpZGUgVmFsaWRhdGlvblxuICAgICAgICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuICAgICAgY29udGludW91c1ZhbGlkYXRpb246IGZhbHNlLFxuICAgICAgbmVnYXRpdmVWYWxpZGF0aW9uOiB0cnVlLFxuXG4gICAgICAvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgICAgICAgICAgICBIb29rc1xuICAgICAgICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuICAgICAgb25TdWJtaXRIb29rOiAoZXJyb3JzLCBzdGF0ZSkgPT4ge30sXG4gICAgICBwcmVTaWdudXBIb29rOiAocGFzc3dvcmQsIGluZm8pID0+IHt9LFxuXG4gICAgICAvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgICAgICAgICAgIFJlZGlyZWN0c1xuICAgICAgICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuICAgICAgcmVkaXJlY3RzOiB7XG4gICAgICAgIC8vIHRvU2lnblVwOiAoKSA9PiB7fVxuICAgICAgfSxcblxuXG4gICAgICAvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgICAgICAgICAgICBSb3V0ZXNcbiAgICAgICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5cbiAgICAgIG1hcFN0YXRlVG9Sb3V0ZToge1xuICAgICAgIHNpZ25JbjogJy9zaWduLWluJyxcbiAgICAgICBzaWduVXA6ICcvc2lnbi11cCcsXG4gICAgICAgZm9yZ290UHdkOiAnL2ZvcmdvdC1wYXNzd29yZCcsXG4gICAgICAgY2hhbmdlUHdkOiAnL2NoYW5nZS1wYXNzd29yZCcsXG4gICAgICAgcmVzZXRQd2Q6ICcvcmVzZXQtcGFzc3dvcmQnXG4gICAgICB9LFxuXG5cbiAgICAgIC8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICAgICAgICAgRmllbGRzIChTdGF0ZXMpXG4gICAgICAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG4gICAgICBmaWVsZHM6IHtcblxuICAgICAgICAvKiBTaWduIEluICovXG5cbiAgICAgICAgc2lnbkluOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgX2lkOiAndXNlcm5hbWUnLFxuICAgICAgICAgICAgZGlzcGxheU5hbWU6ICdVc2VybmFtZScsXG4gICAgICAgICAgICBwbGFjZWhvbGRlcjogJ0VudGVyIHlvdXIgdXNlcm5hbWUnXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBfaWQ6ICdlbWFpbCcsXG4gICAgICAgICAgICBkaXNwbGF5TmFtZTogJ0VtYWlsJyxcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyOiAnRW50ZXIgeW91ciBlbWFpbCcsXG4gICAgICAgICAgICByZTogcmVnRXhwLkVtYWlsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBfaWQ6ICdwYXNzd29yZCcsXG4gICAgICAgICAgICBkaXNwbGF5TmFtZTogJ1Bhc3N3b3JkJyxcbiAgICAgICAgICAgIHR5cGU6ICdwYXNzd29yZCcsXG4gICAgICAgICAgICBwbGFjZWhvbGRlcjogJ0VudGVyIHlvdXIgcGFzc3dvcmQnXG4gICAgICAgICAgfVxuICAgICAgICBdLFxuXG4gICAgICAgIC8qIFNpZ24gVXAgKi9cblxuICAgICAgICBzaWduVXA6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBfaWQ6ICd1c2VybmFtZScsXG4gICAgICAgICAgICBkaXNwbGF5TmFtZTogJ1VzZXJuYW1lJyxcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyOidFbnRlciB5b3VyIHVzZXJuYW1lJyxcbiAgICAgICAgICAgIG1pbkxlbmd0aDogNCxcbiAgICAgICAgICAgIG1heExlbmd0aDogMjIsXG4gICAgICAgICAgICByZTogcmVnRXhwLlVzZXJuYW1lLFxuICAgICAgICAgICAgZXJyU3RyOiAnVXNlcm5hbWUgbXVzdCBiZSBiZXR3ZWVuIDQgYW5kIDIyIGNoYXJhY3RlcnMnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgX2lkOiAnZW1haWwnLFxuICAgICAgICAgICAgZGlzcGxheU5hbWU6ICdFbWFpbCcsXG4gICAgICAgICAgICBwbGFjZWhvbGRlcjogJ0VudGVyIHlvdXIgZW1haWwnLFxuICAgICAgICAgICAgcmU6IHJlZ0V4cC5FbWFpbCxcbiAgICAgICAgICAgIGVyclN0cjogJ1BsZWFzZSBlbnRlciBhIHZhbGlkIGVtYWlsJ1xuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgX2lkOiAncGFzc3dvcmQnLFxuICAgICAgICAgICAgZGlzcGxheU5hbWU6ICdQYXNzd29yZCcsXG4gICAgICAgICAgICB0eXBlOiAncGFzc3dvcmQnLFxuICAgICAgICAgICAgcGxhY2Vob2xkZXI6ICdFbnRlciB5b3VyIHBhc3N3b3JkJyxcbiAgICAgICAgICAgIG1pbkxlbmd0aDogNixcbiAgICAgICAgICAgIG1heExlbmd0aDogMzIsXG4gICAgICAgICAgICBlcnJTdHI6ICdQbGVhc2UgZW50ZXIgYSBzdHJvbmcgcGFzc3dvcmQgYmV0d2VlbiA2IGFuZCAzMiBjaGFyYWN0ZXJzJ1xuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgX2lkOiAnY29uZmlybVBhc3N3b3JkJyxcbiAgICAgICAgICAgIGRpc3BsYXlOYW1lOiAnQ29uZmlybSBwYXNzd29yZCcsXG4gICAgICAgICAgICB0eXBlOiAncGFzc3dvcmQnLFxuICAgICAgICAgICAgcGxhY2Vob2xkZXI6ICdSZS1lbnRlciB5b3VyIHBhc3N3b3JkJyxcbiAgICAgICAgICAgIGVyclN0cjogJ1Bhc3N3b3JkIGRvZXNuXFwndCBtYXRjaCcsXG4gICAgICAgICAgICBleGNsdWRlOiB0cnVlLFxuICAgICAgICAgICAgZnVuYzogKGZpZWxkcywgZmllbGRPYmosIHZhbHVlLCBtb2RlbCwgZXJyb3JzQXJyYXkpID0+IHtcbiAgICAgICAgICAgICAgaWYgKCF0aGlzLmNvbmZpZy5jb25maXJtUGFzc3dvcmQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgLy8gY2hlY2sgdGhhdCBwYXNzd29yZHMgbWF0Y2hcbiAgICAgICAgICAgICAgY29uc3QgeyBwYXNzd29yZCB9ID0gbW9kZWxcbiAgICAgICAgICAgICAgY29uc3QgeyBfaWQsIGVyclN0ciB9ID0gZmllbGRPYmpcblxuICAgICAgICAgICAgICBpZiAodHlwZW9mIHBhc3N3b3JkID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgIGlmICghdmFsdWUgfHwgKHZhbHVlICE9PSBwYXNzd29yZCkpIHtcbiAgICAgICAgICAgICAgICAgIGVycm9yc0FycmF5LnB1c2goeyBfaWQsIGVyclN0ciB9KVxuICAgICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIF0sXG5cbiAgICAgICAgLyogRm9yZ290IFBhc3N3b3JkICovXG5cbiAgICAgICAgZm9yZ290UHdkOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgX2lkOiAnZW1haWwnLFxuICAgICAgICAgICAgZGlzcGxheU5hbWU6ICdFbWFpbCcsXG4gICAgICAgICAgICBwbGFjZWhvbGRlcjogJ0VudGVyIHlvdXIgZW1haWwnLFxuICAgICAgICAgICAgcmU6IHJlZ0V4cC5FbWFpbCxcbiAgICAgICAgICAgIGVyclN0cjogJ1BsZWFzZSBlbnRlciBhIHZhbGlkIGVtYWlsJ1xuICAgICAgICAgIH1cbiAgICAgICAgXSxcblxuICAgICAgICAvKiBDaGFuZ2UgUGFzc3dvcmQgKi9cblxuICAgICAgICBjaGFuZ2VQd2Q6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBfaWQ6ICdjdXJyZW50UGFzc3dvcmQnLFxuICAgICAgICAgICAgZGlzcGxheU5hbWU6ICdDdXJyZW50IHBhc3N3b3JkJyxcbiAgICAgICAgICAgIHR5cGU6ICdwYXNzd29yZCcsXG4gICAgICAgICAgICBwbGFjZWhvbGRlcjogJ0VudGVyIHlvdXIgY3VycmVudCBwYXNzd29yZCdcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIF9pZDogJ3Bhc3N3b3JkJyxcbiAgICAgICAgICAgIGRpc3BsYXlOYW1lOiAnUGFzc3dvcmQnLFxuICAgICAgICAgICAgdHlwZTogJ3Bhc3N3b3JkJyxcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyOiAnRW50ZXIgYSBuZXcgcGFzc3dvcmQnLFxuICAgICAgICAgICAgbWluTGVuZ3RoOiA2LFxuICAgICAgICAgICAgbWF4TGVuZ3RoOiAzMixcbiAgICAgICAgICAgIGVyclN0cjogJ1BsZWFzZSBlbnRlciBhIHN0cm9uZyBwYXNzd29yZCBiZXR3ZWVuIDYgYW5kIDMyIGNoYXJhY3RlcnMnXG4gICAgICAgICAgfVxuICAgICAgICBdLFxuXG4gICAgICAgIC8qIFJlc2V0IFBhc3N3b3JkICovXG5cbiAgICAgICAgcmVzZXRQd2Q6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBfaWQ6ICdwYXNzd29yZCcsXG4gICAgICAgICAgICBkaXNwbGF5TmFtZTogJ05ldyBwYXNzd29yZCcsXG4gICAgICAgICAgICB0eXBlOiAncGFzc3dvcmQnLFxuICAgICAgICAgICAgcGxhY2Vob2xkZXI6ICdFbnRlciBhIG5ldyBwYXNzd29yZCdcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0sXG5cbiAgICAgIC8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICAgICAgICAgICAgICBUZXh0c1xuICAgICAgICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuICAgICAgdGV4dHM6IHtcbiAgICAgICAgYnV0dG9uOiB7XG4gICAgICAgICAgY2hhbmdlUHdkOiAnVXBkYXRlIE5ldyBQYXNzd29yZCcsXG4gICAgICAgICAgZm9yZ290UHdkOiAnU2VuZCBSZXNldCBMaW5rJyxcbiAgICAgICAgICByZXNldFB3ZDogJ1NhdmUgTmV3IFBhc3N3b3JkJyxcbiAgICAgICAgICBzaWduSW46ICdMb2dpbicsXG4gICAgICAgICAgc2lnblVwOiAnUmVnaXN0ZXInXG4gICAgICAgIH0sXG4gICAgICAgIHRpdGxlOiB7XG4gICAgICAgICAgY2hhbmdlUHdkOiAnQ2hhbmdlIFBhc3N3b3JkJyxcbiAgICAgICAgICBmb3Jnb3RQd2Q6ICdGb3Jnb3QgUGFzc3dvcmQnLFxuICAgICAgICAgIHJlc2V0UHdkOiAnUmVzZXQgUGFzc3dvcmQnLFxuICAgICAgICAgIHNpZ25JbjogJ0xvZ2luJyxcbiAgICAgICAgICBzaWduVXA6ICdDcmVhdGUgWW91ciBBY2NvdW50J1xuICAgICAgICB9LFxuICAgICAgICBsaW5rczoge1xuICAgICAgICAgIHRvQ2hhbmdlUHdkOiAnQ2hhbmdlIHlvdXIgcGFzc3dvcmQnLFxuICAgICAgICAgIHRvUmVzZXRQd2Q6ICdSZXNldCB5b3VyIHBhc3N3b3JkJyxcbiAgICAgICAgICB0b0ZvcmdvdFB3ZDogJ0ZvcmdvdCB5b3VyIHBhc3N3b3JkPycsXG4gICAgICAgICAgdG9TaWduSW46ICdBbHJlYWR5IGhhdmUgYW4gYWNjb3VudD8gU2lnbiBpbiEnLFxuICAgICAgICAgIHRvU2lnblVwOiAnRG9uXFwndCBoYXZlIGFuIGFjY291bnQ/IFJlZ2lzdGVyJyxcbiAgICAgICAgICB0b1Jlc2VuZFZlcmlmaWNhdGlvbjogJ1Jlc2VuZCBlbWFpbCB2ZXJpZmljYXRpb24nXG4gICAgICAgIH0sXG4gICAgICAgIGluZm86IHtcbiAgICAgICAgICBlbWFpbFNlbnQ6ICdBbiBlbWFpbCBoYXMgYmVlbiBzZW50IHRvIHlvdXIgaW5ib3gnLFxuICAgICAgICAgIGVtYWlsVmVyaWZpZWQ6ICdZb3VyIGVtYWlsIGhhcyBiZWVuIHZlcmlmaWVkJyxcbiAgICAgICAgICBwd2RDaGFuZ2VkOiAnWW91ciBwYXNzd29yZCBoYXMgYmVlbiBjaGFuZ2VkJyxcbiAgICAgICAgICBwd2RSZXNldDogJ0EgcGFzc3dvcmQgcmVzZXQgbGluayBoYXMgYmVlbiBzZW50IHRvIHlvdXIgZW1haWwhJyxcbiAgICAgICAgICBwd2RTZXQ6ICdQYXNzd29yZCB1cGRhdGVkIScsXG4gICAgICAgICAgc2lnblVwVmVyaWZ5RW1haWw6ICdTdWNjZXNzZnVsIFJlZ2lzdHJhdGlvbiEgUGxlYXNlIGNoZWNrIHlvdXIgZW1haWwgYW5kIGZvbGxvdyB0aGUgaW5zdHJ1Y3Rpb25zJyxcbiAgICAgICAgICB2ZXJpZmljYXRpb25FbWFpbFNlbnQ6ICdBIG5ldyBlbWFpbCBoYXMgYmVlbiBzZW50IHRvIHlvdS4gSWYgdGhlIGVtYWlsIGRvZXNuXFwndCBzaG93IHVwIGluIHlvdXIgaW5ib3gsIGJlIHN1cmUgdG8gY2hlY2sgeW91ciBzcGFtIGZvbGRlci4nXG4gICAgICAgIH0sXG4gICAgICAgIGVycm9yczoge1xuICAgICAgICAgIGxvZ2luRm9yYmlkZGVuOiAnVGhlcmUgd2FzIGEgcHJvYmxlbSB3aXRoIHlvdXIgbG9naW4nLFxuICAgICAgICAgIGNhcHRjaGFWZXJpZmljYXRpb246ICdUaGVyZSB3YXMgYSBwcm9ibGVtIHdpdGggdGhlIHJlY2FwdGNoYSB2ZXJpZmljYXRpb24sIHBsZWFzZSB0cnkgYWdhaW4nXG4gICAgICAgIH0sXG4gICAgICAgIGZvcmdvdFB3ZFN1Ym1pdFN1Y2Nlc3M6ICdBIHBhc3N3b3JkIHJlc2V0IGxpbmsgaGFzIGJlZW4gc2VudCB0byB5b3VyIGVtYWlsIScsXG4gICAgICAgIGxvZ2luRm9yYmlkZGVuTWVzc2FnZTogJ1RoZXJlIHdhcyBhIHByb2JsZW0gd2l0aCB5b3VyIGxvZ2luJ1xuICAgICAgfSxcblxuICAgICAgc2hvd1JlQ2FwdGNoYTogZmFsc2UsXG4gICAgICB0ZW1wUmVDYXB0Y2hhUmVzcG9uc2U6ICcnLFxuICAgICAgb2F1dGg6IHt9XG4gICAgfVxuXG4gICAgdGhpcy5jb21wb25lbnRzID0gbnVsbFxuICB9XG5cbiAgLyogU2V0IGN1c3RvbSBjb21wb25lbnRzICovXG5cbiAgc3R5bGUgKGNvbXBvbmVudHMsIG92ZXJyaWRlKSB7XG4gICAgLy8gU2V0dGluZ3Mgb3ZlcnJpZGUgdG8gdHJ1ZSBhc3N1bWVzIHRoYXQgYWxsIGNvbXBvbmVudHMgdHlwZXMgYXJlIGRlZmluZWQuXG4gICAgdGhpcy5jb21wb25lbnRzID0gb3ZlcnJpZGUgPyBjb21wb25lbnRzIDogeyAuLi50aGlzLmNvbXBvbmVudHMsIC4uLmNvbXBvbmVudHMgfVxuICB9XG5cbiAgLyogQ29uZmlndXJhdGlvbiAqL1xuXG4gIGNvbmZpZ3VyZSAoY29uZmlnKSB7XG4gICAgdGhpcy5jb25maWcgPSBtZXJnZSh0aGlzLmNvbmZpZywgY29uZmlnKVxuXG4gICAgaWYgKCF0aGlzLl9pbml0KSB7XG4gICAgICB0aGlzLmRldGVybWluZVNpZ251cEZpZWxkcygpXG4gICAgICB0aGlzLmxvYWRSZUNhcHRjaGEoKVxuICAgICAgdGhpcy5zZXRBY2NvdW50Q3JlYXRpb25Qb2xpY3koKVxuICAgICAgdGhpcy5vdmVycmlkZUxvZ2luRXJyb3JzKClcbiAgICAgIHRoaXMuZGlzYWJsZUZvcmdvdFBhc3N3b3JkKClcbiAgICAgIHRoaXMuc2V0RGVueVJ1bGVzKClcblxuICAgICAgdGhpcy5faW5pdCA9IHRydWVcbiAgICB9XG4gIH1cblxuICAvKiBFeHRlbmQgZGVmYXVsdCBmaWVsZHMgKi9cblxuICBhZGRGaWVsZHMgKHN0YXRlLCBmaWVsZHMpIHtcbiAgICB0cnkge1xuICAgICAgbGV0IGZpZWxkc0FycmF5ID0gdGhpcy5jb25maWcuZmllbGRzW3N0YXRlXVxuICAgICAgdGhpcy5jb25maWcuZmllbGRzW3N0YXRlXSA9IGZpZWxkc0FycmF5LmNvbmNhdChmaWVsZHMpXG4gICAgfSBjYXRjaCAoZXgpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihleClcbiAgICB9XG4gIH1cblxuICBkZXRlcm1pbmVTaWdudXBGaWVsZHMgKCkge1xuICAgIGNvbnN0IHtcbiAgICAgIHNpZ25VcCxcbiAgICAgIHNpZ25JblxuICAgIH0gPSB0aGlzLmNvbmZpZy5maWVsZHNcblxuICAgIGxldCBzaWdudXBGaWx0ZXJlZEZpZWxkcztcbiAgICBsZXQgc2lnbmluRmlsdGVyZWRGaWVsZHM7XG4gICAgc3dpdGNoICh0aGlzLmNvbmZpZy5wYXNzd29yZFNpZ251cEZpZWxkcykge1xuICAgICAgY2FzZSAnRU1BSUxfT05MWSc6XG4gICAgICAgIHNpZ251cEZpbHRlcmVkRmllbGRzID0gc2lnblVwLmZpbHRlcihmaWVsZCA9PiBmaWVsZC5faWQgIT09ICd1c2VybmFtZScpXG4gICAgICAgIHNpZ25pbkZpbHRlcmVkRmllbGRzID0gc2lnbkluLmZpbHRlcihmaWVsZCA9PiBmaWVsZC5faWQgIT09ICd1c2VybmFtZScpXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnVVNFUk5BTUVfT05MWSc6XG4gICAgICAgIHNpZ251cEZpbHRlcmVkRmllbGRzID0gc2lnblVwLmZpbHRlcihmaWVsZCA9PiBmaWVsZC5faWQgIT09ICdlbWFpbCcpXG4gICAgICAgIHNpZ25pbkZpbHRlcmVkRmllbGRzID0gc2lnbkluLmZpbHRlcihmaWVsZCA9PiBmaWVsZC5faWQgIT09ICdlbWFpbCcpXG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnVVNFUk5BTUVfQU5EX09QVElPTkFMX0VNQUlMJzpcbiAgICAgICAgc2lnblVwLmZvckVhY2goZmllbGQgPT4ge1xuICAgICAgICAgIGlmIChmaWVsZC5faWQgPT09ICdlbWFpbCcpIHtcbiAgICAgICAgICAgIGZpZWxkLnJlcXVpcmVkID0gZmFsc2VcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIHNpZ25pbkZpbHRlcmVkRmllbGRzID0gc2lnbkluLmZpbHRlcihmaWVsZCA9PiBmaWVsZC5faWQgIT09ICdlbWFpbCcpXG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlICdVU0VSTkFNRV9BTkRfRU1BSUwnOlxuICAgICAgICAvL1xuICAgICAgICBicmVha1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICdwYXNzd29yZFNpZ251cEZpZWxkcyBtdXN0IGJlIHNldCB0byBvbmUgb2YgJyArXG4gICAgICAgICAgJ1tFTUFJTF9PTkxZLCBVU0VSTkFNRV9PTkxZLCBVU0VSTkFNRV9BTkRfT1BUSU9OQUxfRU1BSUwsIFVTRVJOQU1FX0FORF9FTUFMXSdcbiAgICAgICAgKVxuICAgIH1cblxuICAgIGlmIChzaWdudXBGaWx0ZXJlZEZpZWxkcykge1xuICAgICAgdGhpcy5jb25maWcuZmllbGRzLnNpZ25VcCA9IHNpZ251cEZpbHRlcmVkRmllbGRzXG4gICAgfVxuICAgIGlmIChzaWduaW5GaWx0ZXJlZEZpZWxkcykge1xuICAgICAgdGhpcy5jb25maWcuZmllbGRzLnNpZ25JbiA9IHNpZ25pbkZpbHRlcmVkRmllbGRzXG4gICAgfVxuICB9XG5cbiAgbG9nb3V0ICgpIHtcbiAgICBjb25zdCB7IG9uTG9nb3V0SG9vayB9ID0gdGhpcy5jb25maWdcbiAgICBpZiAob25Mb2dvdXRIb29rKSB7XG4gICAgICBvbkxvZ291dEhvb2soKVxuICAgIH1cbiAgICBNZXRlb3IubG9nb3V0KClcbiAgfVxuXG4gIGxvYWRSZUNhcHRjaGEgKCkge1xuICAgIGlmICh0aGlzLmNvbmZpZy5zaG93UmVDYXB0Y2hhICYmIE1ldGVvci5pc0NsaWVudCkge1xuICAgICAgLy8gbG9hZCByZWNhcHRjaGEgc2NyaXB0XG4gICAgICBjb25zdCBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoc2NyaXB0KVxuICAgICAgc2NyaXB0LmFzeW5jID0gdHJ1ZVxuICAgICAgc2NyaXB0LnNyYyA9ICdodHRwczovL3d3dy5nb29nbGUuY29tL3JlY2FwdGNoYS9hcGkuanMnXG5cbiAgICAgIC8vIFJlZ2lzdGVyIGEgcmVjYXB0Y2hhIGNhbGxiYWNrXG4gICAgICB3aW5kb3cucmVDYXB0Y2hhQ2FsbGJhY2sgPSByZXMgPT4ge1xuICAgICAgICB0aGlzLmNvbmZpZy50ZW1wUmVDYXB0Y2hhUmVzcG9uc2UgPSByZXNcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBzZXRBY2NvdW50Q3JlYXRpb25Qb2xpY3kgKCkge1xuICAgIHRyeSB7XG4gICAgICBBY2NvdW50cy5jb25maWcoe1xuICAgICAgICBmb3JiaWRDbGllbnRBY2NvdW50Q3JlYXRpb246IHRoaXMuY29uZmlnLmZvcmJpZENsaWVudEFjY291bnRDcmVhdGlvblxuICAgICAgfSlcbiAgICB9IGNhdGNoIChleCkge1xuICAgICAgLy9cbiAgICB9XG4gIH1cblxuICAvKiBTZXJ2ZXIgb25seSAqL1xuXG4gIG92ZXJyaWRlTG9naW5FcnJvcnMgKCkge1xuICAgIGlmICh0aGlzLmNvbmZpZy5vdmVycmlkZUxvZ2luRXJyb3JzICYmIE1ldGVvci5pc1NlcnZlcikge1xuICAgICAgQWNjb3VudHMudmFsaWRhdGVMb2dpbkF0dGVtcHQoYXR0ZW1wdCA9PiB7XG4gICAgICAgIGlmIChhdHRlbXB0LmVycm9yKSB7XG4gICAgICAgICAgdmFyIHJlYXNvbiA9IGF0dGVtcHQuZXJyb3IucmVhc29uXG4gICAgICAgICAgaWYgKHJlYXNvbiA9PT0gJ1VzZXIgbm90IGZvdW5kJyB8fCByZWFzb24gPT09ICdJbmNvcnJlY3QgcGFzc3dvcmQnKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdMb2dpbiBGb3JiaWRkZW4nLCB0aGlzLmNvbmZpZy50ZXh0cy5lcnJvcnMubG9naW5Gb3JiaWRkZW4pIC8vIFRocm93IGdlbmVyYWxpemVkIGVycm9yIGZvciBmYWlsZWQgbG9naW4gYXR0ZW1wdHNcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGF0dGVtcHQuYWxsb3dlZFxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICBkaXNhYmxlRm9yZ290UGFzc3dvcmQgKCkge1xuICAgIGlmICh0aGlzLmNvbmZpZy5kaXNhYmxlRm9yZ290UGFzc3dvcmQgJiYgTWV0ZW9yLmlzU2VydmVyKSB7XG4gICAgICBNZXRlb3Iuc2VydmVyLm1ldGhvZF9oYW5kbGVycy5mb3Jnb3RQYXNzd29yZCA9ICgpID0+IHsgLy8gT3ZlcnJpZGUgZm9yZ290UGFzc3dvcmQgbWV0aG9kIGRpcmVjdGx5LlxuICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKCdGb3Jnb3QgcGFzc3dvcmQgaXMgZGlzYWJsZWQnKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHNldERlbnlSdWxlcyAoKSB7XG4gICAgaWYgKHRoaXMuY29uZmlnLnNldERlbnlSdWxlcyAmJiBNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgIE1ldGVvci51c2Vycy5kZW55KHtcbiAgICAgICAgdXBkYXRlICgpIHsgcmV0dXJuIHRydWUgfSxcbiAgICAgICAgcmVtb3ZlICgpIHsgcmV0dXJuIHRydWUgfSxcbiAgICAgICAgaW5zZXJ0ICgpIHsgcmV0dXJuIHRydWUgfVxuICAgICAgfSlcbiAgICB9XG4gIH1cbn1cblxuY29uc3QgQWNjb3VudHNSZWFjdCA9IG5ldyBBY2NvdW50c1JlYWN0XygpXG5NZXRlb3Iuc3RhcnR1cCgoKSA9PiB7XG4gIC8vIEF1dG9tYXRpY2FsbHkgdXNlIGFuIGluc3RhbGxlZCBwYWNrYWdlLlxuICAvLyBQYWNrYWdlcyBtdXN0IGJlIGluc3RhbGxlZCBiZWZvcmUgdGhpcyBwYWNrYWdlIGluIC5tZXRlb3IvcGFja2FnZXNcblxuICBjb25zdCBwcmVmaXggPSAnbWV0ZW9yZWFjdDphY2NvdW50cy0nXG4gIGNvbnN0IGNvbXBvbmVudHMgPVxuICAgIFBhY2thZ2VbcHJlZml4ICsgJ3Vuc3R5bGVkJ10gfHxcbiAgICBQYWNrYWdlW3ByZWZpeCArICdzZW1hbnRpYyddXG4gICAgLy8gLi4uXG5cbiAgQWNjb3VudHNSZWFjdC5jb21wb25lbnRzID0gY29tcG9uZW50c1xufSlcblxuZXhwb3J0IGRlZmF1bHQgQWNjb3VudHNSZWFjdFxuIiwiaW1wb3J0IEFjY291bnRzUmVhY3QgZnJvbSAnLi9BY2NvdW50c1JlYWN0J1xuaW1wb3J0IEFjY291bnRzUmVhY3RDb21wb25lbnQgZnJvbSAnLi9BY2NvdW50c1JlYWN0Q29tcG9uZW50J1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgQWNjb3VudHNSZWFjdCxcbiAgQWNjb3VudHNSZWFjdENvbXBvbmVudFxufVxuIiwiLyogZXNsaW50IGtleS1zcGFjaW5nOjAgcGFkZGVkLWJsb2NrczogMCAqL1xuaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcidcbmltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQgfSBmcm9tICdyZWFjdCdcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcydcbmltcG9ydCBBY2NvdW50c1JlYWN0IGZyb20gJy4uL0FjY291bnRzUmVhY3QnXG5pbXBvcnQgeyBoYW5kbGVJbnB1dENoYW5nZSB9IGZyb20gJy4vY29tbW9uVXRpbHMnXG5cbmNsYXNzIEJhc2VGb3JtIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IgKHByb3BzKSB7XG4gICAgc3VwZXIoKVxuICAgIHRoaXMuaGFuZGxlSW5wdXRDaGFuZ2UgPSBoYW5kbGVJbnB1dENoYW5nZS5iaW5kKHByb3BzLmNvbnRleHQpXG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCAoKSB7XG4gICAgLy8gV2UgbXVzdCBleHBsaWNpdGx5IHJlcmVuZGVyIHJlY2FwdGNoYSBvbiBldmVyeSBtb3VudFxuICAgIGlmICh0aGlzLnByb3BzLnNob3dSZUNhcHRjaGEpIHsgLy8gd2lsbCBiZSBhdmFpbGFibGUgb25seSBmb3Igc2lnbnVwIGZvcm0uXG4gICAgICBsZXQgcmVDYXB0Y2hhUGFyYW1zID0gdGhpcy5wcm9wcy5kZWZhdWx0cy5yZUNhcHRjaGEgfHwgTWV0ZW9yLnNldHRpbmdzLnB1YmxpYy5yZUNhcHRjaGFcblxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHdpbmRvdy5ncmVjYXB0Y2hhLnJlbmRlcigncmVjYXB0Y2hhLWNvbnRhaW5lcicsXG4gICAgICAgICAgeyAuLi5yZUNhcHRjaGFQYXJhbXMsXG4gICAgICAgICAgICBjYWxsYmFjazogd2luZG93LnJlQ2FwdGNoYUNhbGxiYWNrXG4gICAgICAgICAgfSxcbiAgICAgICAgKVxuICAgICAgfSwgMSlcbiAgICB9XG4gIH1cblxuICByZW5kZXIgKCkge1xuICAgIC8vIFN0YXRlIHNwZWNpZmljc1xuICAgIGNvbnN0IHtcbiAgICAgIGN1cnJlbnRTdGF0ZSxcbiAgICAgIHZhbHVlcyxcbiAgICAgIGRlZmF1bHRzLFxuICAgICAgb25TdWJtaXQsXG4gICAgICBlcnJvcnNcbiAgICB9ID0gdGhpcy5wcm9wc1xuXG4gICAgLy8gRGVmYXVsdHNcbiAgICBjb25zdCB7XG4gICAgICB0ZXh0cyxcbiAgICAgIHNob3dSZUNhcHRjaGEsXG4gICAgICBjb25maXJtUGFzc3dvcmRcbiAgICB9ID0gZGVmYXVsdHNcblxuICAgIGNvbnN0IF9maWVsZHMgPSBkZWZhdWx0cy5maWVsZHNbY3VycmVudFN0YXRlXVxuICAgIGNvbnN0IGZpZWxkcyAgPSBjb25maXJtUGFzc3dvcmQgPyBfZmllbGRzIDogX2ZpZWxkcy5maWx0ZXIoZmllbGQgPT4gZmllbGQuX2lkICE9PSAnY29uZmlybVBhc3N3b3JkJylcblxuICAgIC8vIHRleHRzXG4gICAgY29uc3QgdGl0bGUgID0gdGV4dHMudGl0bGVbY3VycmVudFN0YXRlXVxuICAgIGNvbnN0IGJ1dHRvbiA9IHRleHRzLmJ1dHRvbltjdXJyZW50U3RhdGVdXG5cbiAgICAvLyBDb21wb25lbnRzXG4gICAgY29uc3Qge1xuICAgICAgRm9ybUZpZWxkLFxuICAgICAgSW5wdXRGaWVsZCxcbiAgICAgIFNlbGVjdEZpZWxkLFxuICAgICAgUmFkaW9GaWVsZCxcbiAgICAgIFN1Ym1pdEZpZWxkLFxuICAgICAgVGl0bGVGaWVsZCxcbiAgICAgIEVycm9yc0ZpZWxkXG4gICAgfSA9IEFjY291bnRzUmVhY3QuY29tcG9uZW50c1xuXG4gICAgLy8gR2xvYmFsIGVycm9yc1xuICAgIGNvbnN0IGdsb2JhbEVycm9ycyA9IGVycm9ycyA/IGVycm9ycy5maWx0ZXIoZXJyRmllbGQgPT4gZXJyRmllbGQuX2lkID09PSAnX19nbG9iYWxzJykgOiBbXVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxGb3JtRmllbGQgb25TdWJtaXQ9eyhlKSA9PiBlLnByZXZlbnREZWZhdWx0KCl9IGNsYXNzTmFtZT17YGFyLSR7Y3VycmVudFN0YXRlfWB9PlxuXG4gICAgICAgIHsvKiBUaXRsZSAgKi99XG4gICAgICAgIHt0aXRsZSAmJiA8VGl0bGVGaWVsZCB0ZXh0PXt0aXRsZX0gLz59XG5cbiAgICAgICAgey8qIEZpZWxkcyAgKi99XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPSdhci1maWVsZHMnPlxuICAgICAgICAgIHtmaWVsZHMubWFwKChmLCBpKSA9PiB7XG5cbiAgICAgICAgICAgIGxldCBGaWVsZCA9IElucHV0RmllbGQgLy8gRGVmYXVsdHMgdG8gaW5wdXRcbiAgICAgICAgICAgIHN3aXRjaCAoZi50eXBlKSB7XG4gICAgICAgICAgICAgIGNhc2UgJ3NlbGVjdCc6IEZpZWxkID0gU2VsZWN0RmllbGQ7IGJyZWFrO1xuICAgICAgICAgICAgICBjYXNlICdyYWRpbyc6ICBGaWVsZCA9IFJhZGlvRmllbGQ7ICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgcHJvcHMgPSB7XG4gICAgICAgICAgICAgIGtleTogaSxcbiAgICAgICAgICAgICAgdmFsdWVzLFxuICAgICAgICAgICAgICBkZWZhdWx0cyxcbiAgICAgICAgICAgICAgb25DaGFuZ2U6IHRoaXMuaGFuZGxlSW5wdXRDaGFuZ2UsXG4gICAgICAgICAgICAgIGVycm9yOiBlcnJvcnMgPyBlcnJvcnMuZmluZCgoZXJyRmllbGQpID0+IGVyckZpZWxkLl9pZCA9PT0gZi5faWQpIDogW10sXG4gICAgICAgICAgICAgIC4uLmZcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuc2hvdWxkRm9jdXNGaXJzdElucHV0KGkpKSB7XG4gICAgICAgICAgICAgIHByb3BzLmZvY3VzSW5wdXQgPSB0cnVlXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KEZpZWxkLCBwcm9wcylcbiAgICAgICAgICB9KX1cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAge3Nob3dSZUNhcHRjaGEgJiYgPGRpdiBpZD0ncmVjYXB0Y2hhLWNvbnRhaW5lcicgLz59XG5cbiAgICAgICAgey8qIFN1Ym1pdCBCdXR0b24gICovfVxuICAgICAgICA8U3VibWl0RmllbGQgb25DbGljaz17b25TdWJtaXR9IHRleHQ9e2J1dHRvbn0gLz5cblxuICAgICAgICB7LyogRXJyb3JzIE1lc3NhZ2UgICovfVxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nYXItZXJyb3JzJz5cbiAgICAgICAgICB7ZXJyb3JzLmxlbmd0aCA+IDAgJiYgPEVycm9yc0ZpZWxkIGVycm9ycz17Z2xvYmFsRXJyb3JzfSAvPn1cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgIDwvRm9ybUZpZWxkPlxuICAgIClcbiAgfVxuXG4gIHNob3VsZEZvY3VzRmlyc3RJbnB1dCA9IGluZGV4ID0+IHtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy5kZWZhdWx0cy5mb2N1c0ZpcnN0SW5wdXQgJiYgaW5kZXggPT09IDBcbiAgfVxufVxuXG5CYXNlRm9ybS5wcm9wVHlwZXMgPSB7XG4gIGNvbnRleHQ6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgY3VycmVudFN0YXRlOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gIHZhbHVlczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICBkZWZhdWx0czogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICBvblN1Ym1pdDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgZXJyb3JzOiBQcm9wVHlwZXMuYXJyYXkuaXNSZXF1aXJlZFxufVxuXG5leHBvcnQgZGVmYXVsdCBCYXNlRm9ybVxuIiwiaW1wb3J0IFJlYWN0LCB7IENvbXBvbmVudCwgRnJhZ21lbnQgfSBmcm9tICdyZWFjdCdcbmltcG9ydCBCYXNlRm9ybSBmcm9tICcuL2Jhc2VGb3JtJ1xuaW1wb3J0IHsgdmFsaWRhdGVGb3JtIH0gZnJvbSAnLi4vdXRpbHMvJ1xuaW1wb3J0IHsgZ2V0TW9kZWwsIHJlZGlyZWN0IH0gZnJvbSAnLi9jb21tb25VdGlscydcbmltcG9ydCB7IGNoYW5nZVBhc3N3b3JkIH0gZnJvbSAnLi9tZXRob2RzJ1xuXG5jbGFzcyBDaGFuZ2VQd2QgZXh0ZW5kcyBDb21wb25lbnQge1xuICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgc3VwZXIoKVxuXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIHBhc3N3b3JkVXBkYXRlZDogZmFsc2UsXG4gICAgICBlcnJvcnM6IFtdXG4gICAgfVxuXG4gICAgdGhpcy5nZXRNb2RlbCA9IGdldE1vZGVsLmJpbmQodGhpcylcbiAgICB0aGlzLnJlZGlyZWN0ID0gcmVkaXJlY3QuYmluZCh0aGlzKVxuICB9XG5cbiAgY29tcG9uZW50V2lsbE1vdW50ICgpIHtcbiAgICBpZiAoIU1ldGVvci51c2VySWQoKSkge1xuICAgICAgdGhpcy5yZWRpcmVjdCgnc2lnbmluJywgdGhpcy5wcm9wcy5kZWZhdWx0cy5yZWRpcmVjdHMudG9TaWduSW4pXG4gICAgfVxuICB9XG5cbiAgcmVuZGVyICgpIHtcbiAgICBjb25zdCB7XG4gICAgICBjdXJyZW50U3RhdGUsXG4gICAgICBkZWZhdWx0c1xuICAgIH0gPSB0aGlzLnByb3BzXG5cbiAgICBjb25zdCB7XG4gICAgICB0ZXh0c1xuICAgIH0gPSBkZWZhdWx0c1xuXG4gICAgY29uc3Qge1xuICAgICAgcGFzc3dvcmRVcGRhdGVkLFxuICAgICAgZXJyb3JzXG4gICAgfSA9IHRoaXMuc3RhdGVcblxuICAgIGNvbnN0IG1vZGVsID0gdGhpcy5nZXRNb2RlbCgpXG5cbiAgICByZXR1cm4gKFxuICAgICAgPEZyYWdtZW50PlxuXG4gICAgICAgIDxCYXNlRm9ybVxuICAgICAgICAgIGNvbnRleHQ9e3RoaXN9XG4gICAgICAgICAgY3VycmVudFN0YXRlPXtjdXJyZW50U3RhdGV9XG4gICAgICAgICAgdmFsdWVzPXttb2RlbH1cbiAgICAgICAgICBkZWZhdWx0cz17ZGVmYXVsdHN9XG4gICAgICAgICAgb25TdWJtaXQ9e3RoaXMub25TdWJtaXR9XG4gICAgICAgICAgZXJyb3JzPXtlcnJvcnN9XG4gICAgICAgIC8+XG5cbiAgICAgICAge3Bhc3N3b3JkVXBkYXRlZCAmJiA8cD57dGV4dHMuaW5mby5wd2RDaGFuZ2VkfTwvcD59XG5cbiAgICAgIDwvRnJhZ21lbnQ+XG4gICAgKVxuICB9XG5cbiAgb25TdWJtaXQgPSAoKSA9PiB7XG4gICAgLy8gVmFsaWRhdGUgZm9ybVxuICAgIGlmICghdmFsaWRhdGVGb3JtKHRoaXMuZ2V0TW9kZWwoKSwgdGhpcykpIHJldHVyblxuXG4gICAgY29uc3QgeyBjdXJyZW50UGFzc3dvcmQsIHBhc3N3b3JkIH0gPSB0aGlzLmdldE1vZGVsKClcblxuICAgIC8vIENoYW5nZSBwYXNzd29yZFxuICAgIGNoYW5nZVBhc3N3b3JkKGN1cnJlbnRQYXNzd29yZCwgcGFzc3dvcmQsIGVyciA9PiB7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyBlcnJvcnM6IFt7IF9pZDogJ19fZ2xvYmFscycsIGVyclN0cjogZXJyLnJlYXNvbiB9XSwgcGFzc3dvcmRVcGRhdGVkOiBmYWxzZSB9KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGVycm9yczogW10sIHBhc3N3b3JkVXBkYXRlZDogdHJ1ZSB9KVxuICAgICAgfVxuXG4gICAgICB0aGlzLnByb3BzLmRlZmF1bHRzLm9uU3VibWl0SG9vayhlcnIsIHRoaXMucHJvcHMuY3VycmVudFN0YXRlKVxuICAgIH0pXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ2hhbmdlUHdkXG4iLCJpbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50LCBGcmFnbWVudCB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IEJhc2VGb3JtIGZyb20gJy4vYmFzZUZvcm0nXG5pbXBvcnQgeyB2YWxpZGF0ZUZvcm0gfSBmcm9tICcuLi91dGlscy8nXG5pbXBvcnQgeyBnZXRNb2RlbCwgcmVkaXJlY3QgfSBmcm9tICcuL2NvbW1vblV0aWxzJ1xuaW1wb3J0IHsgZm9yZ290UGFzc3dvcmQgfSBmcm9tICcuL21ldGhvZHMnXG5cbmNsYXNzIEZvcmdvdFBhc3N3b3JkIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IgKCkge1xuICAgIHN1cGVyKClcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgZW1haWxTZW50OiBmYWxzZSxcbiAgICAgIGVycm9yczogW11cbiAgICB9XG5cbiAgICB0aGlzLmdldE1vZGVsID0gZ2V0TW9kZWwuYmluZCh0aGlzKVxuICAgIHRoaXMucmVkaXJlY3QgPSByZWRpcmVjdC5iaW5kKHRoaXMpXG4gIH1cblxuICByZW5kZXIgKCkge1xuICAgIGNvbnN0IHtcbiAgICAgIGN1cnJlbnRTdGF0ZSxcbiAgICAgIGRlZmF1bHRzXG4gICAgfSA9IHRoaXMucHJvcHNcblxuICAgIGNvbnN0IHtcbiAgICAgIHRleHRzLFxuICAgICAgaGlkZVNpZ25JbkxpbmtcbiAgICB9ID0gZGVmYXVsdHNcblxuICAgIGNvbnN0IHtcbiAgICAgIGVycm9ycyxcbiAgICAgIGVtYWlsU2VudFxuICAgIH0gPSB0aGlzLnN0YXRlXG5cbiAgICBjb25zdCBtb2RlbCA9IHRoaXMuZ2V0TW9kZWwoKVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxGcmFnbWVudD5cblxuICAgICAgICA8QmFzZUZvcm1cbiAgICAgICAgICBjb250ZXh0PXt0aGlzfVxuICAgICAgICAgIGN1cnJlbnRTdGF0ZT17Y3VycmVudFN0YXRlfVxuICAgICAgICAgIHZhbHVlcz17bW9kZWx9XG4gICAgICAgICAgZGVmYXVsdHM9e2RlZmF1bHRzfVxuICAgICAgICAgIG9uU3VibWl0PXt0aGlzLm9uU3VibWl0fVxuICAgICAgICAgIGVycm9ycz17ZXJyb3JzfVxuICAgICAgICAvPlxuXG4gICAgICAgIHtlbWFpbFNlbnQgJiYgPHAgY2xhc3NOYW1lPSdlbWFpbC1zZW50Jz57dGV4dHMuaW5mby5lbWFpbFNlbnR9PC9wPn1cblxuICAgICAgICB7IWhpZGVTaWduSW5MaW5rICYmIChcbiAgICAgICAgICA8YSBjbGFzc05hbWU9J3NpZ25Jbi1saW5rJyBvbk1vdXNlRG93bj17dGhpcy5yZWRpcmVjdFRvU2lnbklufSBocmVmPScnPlxuICAgICAgICAgICAge3RleHRzLmxpbmtzLnRvU2lnbklufVxuICAgICAgICAgIDwvYT5cbiAgICAgICAgKX1cbiAgICAgIDwvRnJhZ21lbnQ+XG4gICAgKVxuICB9XG5cbiAgb25TdWJtaXQgPSAoKSA9PiB7XG4gICAgLy8gVmFsaWRhdGUgZm9ybVxuICAgIGlmICghdmFsaWRhdGVGb3JtKHRoaXMuZ2V0TW9kZWwoKSwgdGhpcykpIHJldHVyblxuXG4gICAgdGhpcy5zZW50UGFzc3dvcmRSZXNldExpbmsoKVxuICB9XG5cbiAgc2VudFBhc3N3b3JkUmVzZXRMaW5rID0gKCkgPT4ge1xuICAgIC8vIFNlbmQgYSByZXNldCBsaW5rIHRvIHRoZSBkZXNpcmVkIGVtYWlsXG5cbiAgICBmb3Jnb3RQYXNzd29yZCh7IGVtYWlsOiB0aGlzLnN0YXRlLmVtYWlsIH0sIGVyciA9PiB7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyBlcnJvcnM6IFt7IF9pZDogJ19fZ2xvYmFscycsIGVyclN0cjogZXJyLnJlYXNvbiB9XSwgZW1haWxTZW50OiBmYWxzZSB9KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGVycm9yczogW10sIGVtYWlsU2VudDogdHJ1ZSB9KVxuICAgICAgfVxuXG4gICAgICB0aGlzLnByb3BzLmRlZmF1bHRzLm9uU3VibWl0SG9vayhlcnIsIHRoaXMucHJvcHMuY3VycmVudFN0YXRlKVxuICAgIH0pXG4gIH1cblxuICByZWRpcmVjdFRvU2lnbkluID0gKCkgPT4ge1xuICAgIHRoaXMucmVkaXJlY3QoJ3NpZ25JbicsIHRoaXMucHJvcHMuZGVmYXVsdHMucmVkaXJlY3RzLnRvU2lnbkluKVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEZvcmdvdFBhc3N3b3JkXG4iLCJpbXBvcnQgUmVhY3QsIHsgY3JlYXRlRWxlbWVudCB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJ1xuaW1wb3J0IFNpZ25JbiBmcm9tICcuL3NpZ25JbidcbmltcG9ydCBTaWduVXAgZnJvbSAnLi9zaWduVXAnXG5pbXBvcnQgRm9yZ290UHdkIGZyb20gJy4vZm9yZ290UHdkJ1xuaW1wb3J0IENoYW5nZVB3ZCBmcm9tICcuL2NoYW5nZVB3ZCdcbmltcG9ydCBSZXNldFB3ZCBmcm9tICcuL3Jlc2V0UHdkJ1xuaW1wb3J0IEFjY291bnRzUmVhY3QgZnJvbSAnLi4vQWNjb3VudHNSZWFjdCdcbmltcG9ydCBtZXJnZSBmcm9tICcuLi91dGlscy9kZWVwbWVyZ2UnXG5cbmNsYXNzIEFjY291bnRzUmVhY3RDb21wb25lbnQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuXG4gIHN0YXRlID0ge1xuICAgIGludGVybmFsU3RhdGU6ICcnIC8vIElmIHNldCAtIGl0IHdpbGwgb3ZlcnJpZGUgc3RhdGUgZnJvbSBwcm9wc1xuICB9XG5cbiAgcmVuZGVyICgpIHtcbiAgICBlbnN1cmVDb21wb25lbnRzRXhpc3QoKVxuICAgIFxuICAgIC8vIFN0YXRlIHByaW9yaXR5IC0+IDEuaW50ZXJuYWwgMi4gcHJvdmlkZWQgYnkgcm91dGUvc3RhdGUgcHJvcCAoZnJvbSBwYXJlbnQgY29tcG9uZW50KSAzLiBkZWZhdWx0IHN0YXRlIGZyb20gY29uZmlnXG4gICAgbGV0IHN0YXRlID0gdGhpcy5zdGF0ZS5pbnRlcm5hbFN0YXRlIHx8IHRoaXMucHJvcHMuc3RhdGVcbiAgICBpZiAoIXN0YXRlKSB7XG4gICAgICBjb25zdCB7IG1hcFN0YXRlVG9Sb3V0ZSB9ID0gQWNjb3VudHNSZWFjdC5jb25maWdcbiAgICAgIGNvbnN0IHsgcm91dGUgfSA9IHRoaXMucHJvcHNcblxuICAgICAgaWYgKHJvdXRlKSB7XG4gICAgICAgIHN0YXRlID0gT2JqZWN0LmtleXMobWFwU3RhdGVUb1JvdXRlKS5maW5kKGtleSA9PiBtYXBTdGF0ZVRvUm91dGVba2V5XSA9PT0gcm91dGUpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdGF0ZSA9IEFjY291bnRzUmVhY3QuY29uZmlnLmRlZmF1bHRTdGF0ZVxuICAgICAgfVxuICAgIH1cblxuICAgIGxldCBmb3JtXG4gICAgc3dpdGNoIChzdGF0ZSkge1xuICAgICAgY2FzZSAnc2lnbkluJzogICAgZm9ybSA9IFNpZ25JbjsgICAgYnJlYWs7XG4gICAgICBjYXNlICdzaWduVXAnOiAgICBmb3JtID0gU2lnblVwOyAgICBicmVhaztcbiAgICAgIGNhc2UgJ2ZvcmdvdFB3ZCc6IGZvcm0gPSBGb3Jnb3RQd2Q7IGJyZWFrO1xuICAgICAgY2FzZSAnY2hhbmdlUHdkJzogZm9ybSA9IENoYW5nZVB3ZDsgYnJlYWs7XG4gICAgICBjYXNlICdyZXNldFB3ZCc6ICBmb3JtID0gUmVzZXRQd2Q7ICBicmVhaztcbiAgICAgIGRlZmF1bHQ6IHJldHVybiBudWxsXG4gICAgfVxuXG4gICAgY29uc3QgZGVmYXVsdHMgPSBtZXJnZS5hbGwoW1xuICAgICAgQWNjb3VudHNSZWFjdC5jb25maWcsXG4gICAgICB0aGlzLnByb3BzLmNvbmZpZ1xuICAgIF0pXG5cbiAgICBpZiAoIWRlZmF1bHRzLmVuYWJsZVBhc3N3b3JkQ2hhbmdlICYmIHN0YXRlID09PSAnY2hhbmdlUHdkJykge1xuICAgICAgcmV0dXJuIG51bGxcbiAgICB9XG5cbiAgICBjb25zdCBwcm9wcyA9IHtcbiAgICAgIGN1cnJlbnRTdGF0ZTogc3RhdGUsXG4gICAgICBjaGFuZ2VTdGF0ZTogdGhpcy5jaGFuZ2VJbnRlcm5hbFN0YXRlLFxuICAgICAgaGlzdG9yeTogdGhpcy5wcm9wcy5oaXN0b3J5LFxuICAgICAgdG9rZW46IHRoaXMucHJvcHMudG9rZW4sXG4gICAgICBkZWZhdWx0c1xuICAgIH1cblxuICAgIHJldHVybiBjcmVhdGVFbGVtZW50KGZvcm0sIHByb3BzKVxuICB9XG5cbiAgY2hhbmdlSW50ZXJuYWxTdGF0ZSA9IHRvU3RhdGUgPT4ge1xuICAgIHRoaXMuc2V0U3RhdGUoeyBpbnRlcm5hbFN0YXRlOiB0b1N0YXRlIH0pXG4gIH1cbn1cblxuZnVuY3Rpb24gZW5zdXJlQ29tcG9uZW50c0V4aXN0ICgpIHtcbiAgaWYgKCFBY2NvdW50c1JlYWN0LmNvbXBvbmVudHMpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1BsZWFzZSBlbnN1cmUgeW91IGhhdmUgcHJvdmlkZWQgQWNjb3VudHNSZWFjdCBhIHNldCBvZiBjb21wb25lbnRzIHRvIHVzZScpXG4gIH1cbn1cblxuQWNjb3VudHNSZWFjdENvbXBvbmVudC5kZWZhdWx0UHJvcHMgPSB7XG4gIGNvbmZpZzoge31cbn1cblxuQWNjb3VudHNSZWFjdENvbXBvbmVudC5wcm9wVHlwZXMgPSB7XG4gIHN0YXRlOiBQcm9wVHlwZXMuc3RyaW5nLFxuICByb3V0ZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgY29uZmlnOiBQcm9wVHlwZXMub2JqZWN0XG59XG5cbmV4cG9ydCBkZWZhdWx0IEFjY291bnRzUmVhY3RDb21wb25lbnRcbiIsImltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQsIEZyYWdtZW50IH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgQmFzZUZvcm0gZnJvbSAnLi9iYXNlRm9ybSdcbmltcG9ydCB7IHZhbGlkYXRlRm9ybSB9IGZyb20gJy4uL3V0aWxzLydcbmltcG9ydCB7IGdldE1vZGVsLCByZWRpcmVjdCB9IGZyb20gJy4vY29tbW9uVXRpbHMnXG5pbXBvcnQgeyByZXNldFBhc3N3b3JkIH0gZnJvbSAnLi9tZXRob2RzJ1xuXG5jbGFzcyBSZXNldFB3ZCBleHRlbmRzIENvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yICgpIHtcbiAgICBzdXBlcigpXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIHBhc3N3b3JkVXBkYXRlZDogZmFsc2UsXG4gICAgICBlcnJvcnM6IFtdXG4gICAgfVxuXG4gICAgdGhpcy5nZXRNb2RlbCA9IGdldE1vZGVsLmJpbmQodGhpcylcbiAgICB0aGlzLnJlZGlyZWN0ID0gcmVkaXJlY3QuYmluZCh0aGlzKVxuICB9XG5cbiAgcmVuZGVyICgpIHtcbiAgICBjb25zdCB7XG4gICAgICBjdXJyZW50U3RhdGUsXG4gICAgICBkZWZhdWx0c1xuICAgIH0gPSB0aGlzLnByb3BzXG5cbiAgICBjb25zdCB7XG4gICAgICB0ZXh0c1xuICAgIH0gPSBkZWZhdWx0c1xuXG4gICAgY29uc3Qge1xuICAgICAgcGFzc3dvcmRVcGRhdGVkLFxuICAgICAgZXJyb3JzXG4gICAgfSA9IHRoaXMuc3RhdGVcblxuICAgIGNvbnN0IG1vZGVsID0gdGhpcy5nZXRNb2RlbCgpXG5cbiAgICByZXR1cm4gKFxuICAgICAgPEZyYWdtZW50PlxuXG4gICAgICAgIDxCYXNlRm9ybVxuICAgICAgICAgIGNvbnRleHQ9e3RoaXN9XG4gICAgICAgICAgY3VycmVudFN0YXRlPXtjdXJyZW50U3RhdGV9XG4gICAgICAgICAgdmFsdWVzPXttb2RlbH1cbiAgICAgICAgICBkZWZhdWx0cz17ZGVmYXVsdHN9XG4gICAgICAgICAgb25TdWJtaXQ9e3RoaXMub25TdWJtaXR9XG4gICAgICAgICAgZXJyb3JzPXtlcnJvcnN9XG4gICAgICAgIC8+XG5cbiAgICAgICAge3Bhc3N3b3JkVXBkYXRlZCAmJiA8cD57dGV4dHMuaW5mby5wd2RTZXR9PC9wPn1cblxuICAgICAgPC9GcmFnbWVudD5cbiAgICApXG4gIH1cblxuICBvblN1Ym1pdCA9ICgpID0+IHtcbiAgICAvLyBWYWxpZGF0ZSBmb3JtXG4gICAgaWYgKCF2YWxpZGF0ZUZvcm0odGhpcy5nZXRNb2RlbCgpLCB0aGlzKSkgcmV0dXJuXG5cbiAgICBjb25zdCB7IHBhc3N3b3JkIH0gPSB0aGlzLmdldE1vZGVsKClcblxuICAgIC8vIENoYW5nZSBwYXNzd29yZFxuICAgIHJlc2V0UGFzc3dvcmQodGhpcy5wcm9wcy50b2tlbiwgcGFzc3dvcmQsIGVyciA9PiB7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyBlcnJvcnM6IFt7IF9pZDogJ19fZ2xvYmFscycsIGVyclN0cjogZXJyLnJlYXNvbiB9XSwgcGFzc3dvcmRVcGRhdGVkOiBmYWxzZSB9KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGVycm9yczogW10sIHBhc3N3b3JkVXBkYXRlZDogdHJ1ZSB9KVxuICAgICAgfVxuXG4gICAgICB0aGlzLnByb3BzLmRlZmF1bHRzLm9uU3VibWl0SG9vayhlcnIsIHRoaXMucHJvcHMuY3VycmVudFN0YXRlKVxuICAgIH0pXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUmVzZXRQd2RcbiIsImltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQsIEZyYWdtZW50IH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgQmFzZUZvcm0gZnJvbSAnLi9iYXNlRm9ybSdcbmltcG9ydCB7IHZhbGlkYXRlRm9ybSB9IGZyb20gJy4uL3V0aWxzJ1xuaW1wb3J0IHsgZ2V0TW9kZWwsIHJlZGlyZWN0IH0gZnJvbSAnLi9jb21tb25VdGlscydcbmltcG9ydCB7IGxvZ2luIH0gZnJvbSAnLi9tZXRob2RzJ1xuaW1wb3J0IFNvY2lhbEJ1dHRvbnMgZnJvbSAnLi9zb2NpYWxCdXR0b25zJ1xuXG5jbGFzcyBTaWduSW4gZXh0ZW5kcyBDb21wb25lbnQge1xuICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgc3VwZXIoKVxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBlcnJvcnM6IFtdXG4gICAgfVxuXG4gICAgdGhpcy5nZXRNb2RlbCA9IGdldE1vZGVsLmJpbmQodGhpcylcbiAgICB0aGlzLnJlZGlyZWN0ID0gcmVkaXJlY3QuYmluZCh0aGlzKVxuICB9XG5cbiAgcmVuZGVyICgpIHtcbiAgICBjb25zdCB7XG4gICAgICBjdXJyZW50U3RhdGUsXG4gICAgICBkZWZhdWx0c1xuICAgIH0gPSB0aGlzLnByb3BzXG5cbiAgICBjb25zdCB7XG4gICAgICB0ZXh0cyxcbiAgICAgIGhpZGVTaWduVXBMaW5rLFxuICAgICAgc2hvd0ZvcmdvdFBhc3N3b3JkTGlua1xuICAgIH0gPSBkZWZhdWx0c1xuXG4gICAgY29uc3QgbW9kZWwgPSB0aGlzLmdldE1vZGVsKClcblxuICAgIHJldHVybiAoXG4gICAgICA8RnJhZ21lbnQ+XG4gICAgICAgIDxCYXNlRm9ybVxuICAgICAgICAgIGNvbnRleHQ9e3RoaXN9XG4gICAgICAgICAgY3VycmVudFN0YXRlPXtjdXJyZW50U3RhdGV9XG4gICAgICAgICAgdmFsdWVzPXttb2RlbH1cbiAgICAgICAgICBkZWZhdWx0cz17ZGVmYXVsdHN9XG4gICAgICAgICAgb25TdWJtaXQ9e3RoaXMub25TdWJtaXR9XG4gICAgICAgICAgZXJyb3JzPXt0aGlzLnN0YXRlLmVycm9yc31cbiAgICAgICAgLz5cblxuICAgICAgICA8U29jaWFsQnV0dG9uc1xuICAgICAgICAgIGRlZmF1bHRzPXtkZWZhdWx0c31cbiAgICAgICAgLz5cblxuICAgICAgICB7IWhpZGVTaWduVXBMaW5rICYmIChcbiAgICAgICAgICA8YSBjbGFzc05hbWU9J3NpZ25Jbi1saW5rJyBvbk1vdXNlRG93bj17dGhpcy5yZWRpcmVjdFRvU2lnblVwfSBzdHlsZT17bGlua1N0eWxlfSBocmVmPScnPlxuICAgICAgICAgICAge3RleHRzLmxpbmtzLnRvU2lnblVwfVxuICAgICAgICAgIDwvYT5cbiAgICAgICAgKX1cbiAgICAgICAge3Nob3dGb3Jnb3RQYXNzd29yZExpbmsgJiYgKFxuICAgICAgICAgIDxhIGNsYXNzTmFtZT0nZm9yZ290UHdkLWxpbmsnIG9uTW91c2VEb3duPXt0aGlzLnJlZGlyZWN0VG9Gb3Jnb3RQd2R9IHN0eWxlPXtsaW5rU3R5bGV9IGhyZWY9Jyc+XG4gICAgICAgICAgICB7dGV4dHMubGlua3MudG9Gb3Jnb3RQd2R9XG4gICAgICAgICAgPC9hPlxuICAgICAgICApfVxuICAgICAgPC9GcmFnbWVudD5cbiAgICApXG4gIH1cblxuICBvblN1Ym1pdCA9ICgpID0+IHtcbiAgICAvKiBMb2dpbiAqL1xuICAgIGNvbnN0IG1vZGVsID0gdGhpcy5nZXRNb2RlbCgpXG5cbiAgICAvLyBWYWxpZGF0ZSBmb3JtXG4gICAgaWYgKCF2YWxpZGF0ZUZvcm0obW9kZWwsIHRoaXMpKSByZXR1cm5cblxuICAgIGNvbnN0IHsgdXNlcm5hbWUsIGVtYWlsLCBwYXNzd29yZCB9ID0gbW9kZWxcblxuICAgIC8vIExvZ2luXG4gICAgbG9naW4odXNlcm5hbWUsIGVtYWlsLCBwYXNzd29yZCwgZXJyID0+IHtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGVycm9yczogW3sgX2lkOiAnX19nbG9iYWxzJywgZXJyU3RyOiBlcnIucmVhc29uIH1dIH0pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCB7IG9uTG9naW5Ib29rIH0gPSB0aGlzLnByb3BzLmRlZmF1bHRzXG4gICAgICAgIGlmIChvbkxvZ2luSG9vaykge1xuICAgICAgICAgIG9uTG9naW5Ib29rKClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICByZWRpcmVjdFRvU2lnblVwID0gKCkgPT4ge1xuICAgIHRoaXMucmVkaXJlY3QoJ3NpZ25VcCcsIHRoaXMucHJvcHMuZGVmYXVsdHMucmVkaXJlY3RzLnRvU2lnblVwKVxuICB9XG5cbiAgcmVkaXJlY3RUb0ZvcmdvdFB3ZCA9ICgpID0+IHtcbiAgICB0aGlzLnJlZGlyZWN0KCdmb3Jnb3RQd2QnLCB0aGlzLnByb3BzLmRlZmF1bHRzLnJlZGlyZWN0cy50b0ZvcmdvdFB3ZClcbiAgfVxufVxuXG5jb25zdCBsaW5rU3R5bGUgPSB7XG4gIGRpc3BsYXk6ICdibG9jaycsXG4gIGN1cnNvciA6ICdwb2ludGVyJ1xufVxuXG5leHBvcnQgZGVmYXVsdCBTaWduSW5cbiIsImltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQsIEZyYWdtZW50IH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyBBY2NvdW50cyB9IGZyb20gJ21ldGVvci9hY2NvdW50cy1iYXNlJ1xuaW1wb3J0IEFjY291bnRzUmVhY3QgZnJvbSAnLi4vQWNjb3VudHNSZWFjdCdcbmltcG9ydCBCYXNlRm9ybSBmcm9tICcuL2Jhc2VGb3JtJ1xuaW1wb3J0IHsgdmFsaWRhdGVGb3JtIH0gZnJvbSAnLi4vdXRpbHMnXG5pbXBvcnQgeyBnZXRNb2RlbCwgcmVkaXJlY3QgfSBmcm9tICcuL2NvbW1vblV0aWxzJ1xuaW1wb3J0IHsgY3JlYXRlVXNlciwgbG9naW4gfSBmcm9tICcuL21ldGhvZHMnXG5cbmNsYXNzIFNpZ25VcCBleHRlbmRzIENvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yICgpIHtcbiAgICBzdXBlcigpXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIGVycm9yczogW11cbiAgICB9XG5cbiAgICB0aGlzLmdldE1vZGVsID0gZ2V0TW9kZWwuYmluZCh0aGlzKVxuICAgIHRoaXMucmVkaXJlY3QgPSByZWRpcmVjdC5iaW5kKHRoaXMpXG4gIH1cblxuICByZW5kZXIgKCkge1xuICAgIGNvbnN0IHtcbiAgICAgIGN1cnJlbnRTdGF0ZSxcbiAgICAgIGRlZmF1bHRzXG4gICAgfSA9IHRoaXMucHJvcHNcblxuICAgIGNvbnN0IHtcbiAgICAgIHRleHRzLFxuICAgICAgaGlkZVNpZ25JbkxpbmssXG4gICAgICBzaG93UmVDYXB0Y2hhXG4gICAgfSA9IGRlZmF1bHRzXG5cbiAgICByZXR1cm4gKFxuICAgICAgPEZyYWdtZW50PlxuICAgICAgICA8QmFzZUZvcm1cbiAgICAgICAgICBjb250ZXh0PXt0aGlzfVxuICAgICAgICAgIGN1cnJlbnRTdGF0ZT17Y3VycmVudFN0YXRlfVxuICAgICAgICAgIHZhbHVlcz17dGhpcy5nZXRNb2RlbCgpfVxuICAgICAgICAgIGRlZmF1bHRzPXtkZWZhdWx0c31cbiAgICAgICAgICBvblN1Ym1pdD17dGhpcy5vblN1Ym1pdH1cbiAgICAgICAgICBlcnJvcnM9e3RoaXMuc3RhdGUuZXJyb3JzfVxuICAgICAgICAgIHNob3dSZUNhcHRjaGE9e3Nob3dSZUNhcHRjaGF9XG4gICAgICAgIC8+XG5cbiAgICAgICAgeyFoaWRlU2lnbkluTGluayAmJiAoXG4gICAgICAgICAgPGEgY2xhc3NOYW1lPSdzaWduSW4tbGluaycgb25Nb3VzZURvd249e3RoaXMucmVkaXJlY3RUb1NpZ25Jbn0gc3R5bGU9e2xpbmtTdHlsZX0gaHJlZj0nJz5cbiAgICAgICAgICAgIHt0ZXh0cy5saW5rcy50b1NpZ25Jbn1cbiAgICAgICAgICA8L2E+XG4gICAgICAgICl9XG4gICAgICA8L0ZyYWdtZW50PlxuICAgIClcbiAgfVxuXG4gIG9uU3VibWl0ID0gKCkgPT4ge1xuICAgIGNvbnN0IG1vZGVsID0gdGhpcy5nZXRNb2RlbCgpXG4gICAgLy8gVmFsaWRhdGUgZm9ybVxuICAgIGlmICghdmFsaWRhdGVGb3JtKG1vZGVsLCB0aGlzKSkgeyByZXR1cm4gfVxuXG4gICAgY29uc3Qge1xuICAgICAgdXNlcm5hbWUsXG4gICAgICBlbWFpbCxcbiAgICAgIHBhc3N3b3JkLFxuICAgICAgY29uZmlybVBhc3N3b3JkLCAvLyBkb250IGRlbGV0ZSBzbyBpdCBkb2Vzbid0IGdldCBpbmNsdWRlZCBpbiBwcm9maWxlIG9iamVjdC5cbiAgICAgIC4uLnByb2ZpbGVcbiAgICB9ID0gdGhpcy5nZXRNb2RlbCgpXG5cbiAgICAvLyBUaGUgdXNlciBvYmplY3QgdG8gaW5zZXJ0XG4gICAgY29uc3QgbmV3VXNlciA9IHtcbiAgICAgIHVzZXJuYW1lLFxuICAgICAgZW1haWwsXG4gICAgICBwYXNzd29yZDogcGFzc3dvcmQgPyBBY2NvdW50cy5faGFzaFBhc3N3b3JkKHBhc3N3b3JkKSA6ICcnLFxuICAgICAgLi4ucHJvZmlsZVxuICAgIH1cblxuICAgIGNvbnN0IHtcbiAgICAgIHNob3dSZUNhcHRjaGEsXG4gICAgICBwcmVTaWdudXBIb29rLFxuICAgICAgb25TdWJtaXRIb29rLFxuICAgICAgbG9naW5BZnRlclNpZ251cFxuICAgIH0gPSB0aGlzLnByb3BzLmRlZmF1bHRzXG5cbiAgICAvLyBBZGQgcmVjYXB0Y2hhIGZpZWxkXG4gICAgaWYgKHNob3dSZUNhcHRjaGEpIHtcbiAgICAgIG5ld1VzZXIudGVtcFJlQ2FwdGNoYVJlc3BvbnNlID0gQWNjb3VudHNSZWFjdC5jb25maWcudGVtcFJlQ2FwdGNoYVJlc3BvbnNlXG4gICAgfVxuXG4gICAgcHJlU2lnbnVwSG9vayhwYXNzd29yZCwgbmV3VXNlcilcblxuICAgIGNyZWF0ZVVzZXIobmV3VXNlciwgZXJyID0+IHtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgLy8gdmFsaWRhdGlvbiBlcnJvcnMgc3VwcG9zZSB0byBiZSBpbnNpZGUgYW4gYXJyYXksIGlmIHN0cmluZyB0aGVuIGl0cyBhIGRpZmZlcmVudCBlcnJvclxuICAgICAgICBpZiAodHlwZW9mIGVyci5yZWFzb24gIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGVycm9yczogZXJyLnJlYXNvbiB9KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBlcnJvcnM6IFt7IF9pZDogJ19fZ2xvYmFscycsIGVyclN0cjogZXJyLnJlYXNvbiB9XSB9KVxuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKGxvZ2luQWZ0ZXJTaWdudXApIHtcbiAgICAgICAgY29uc3QgeyBwYXNzd29yZCB9ID0gdGhpcy5nZXRNb2RlbCgpXG4gICAgICAgIGNvbnN0IHsgdXNlcm5hbWUsIGVtYWlsIH0gPSBuZXdVc2VyXG5cbiAgICAgICAgbG9naW4odXNlcm5hbWUsIGVtYWlsLCBwYXNzd29yZCwgZXJyID0+IHtcbiAgICAgICAgICBpZiAoZXJyKSB7IHJldHVybiB9IC8vID9cbiAgICAgICAgfSlcbiAgICAgIH1cblxuICAgICAgb25TdWJtaXRIb29rKGVyciwgdGhpcy5wcm9wcy5jdXJyZW50U3RhdGUpXG4gICAgfSlcbiAgfVxuXG4gIHJlZGlyZWN0VG9TaWduSW4gPSAoKSA9PiB7XG4gICAgdGhpcy5yZWRpcmVjdCgnc2lnbkluJywgdGhpcy5wcm9wcy5kZWZhdWx0cy5yZWRpcmVjdHMudG9TaWduSW4pXG4gIH1cbn1cblxuY29uc3QgbGlua1N0eWxlID0ge1xuICBkaXNwbGF5OiAnYmxvY2snXG59XG5cbmV4cG9ydCBkZWZhdWx0IFNpZ25VcFxuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgQWNjb3VudHMgfSBmcm9tICdtZXRlb3IvYWNjb3VudHMtYmFzZSdcbmltcG9ydCBBY2NvdW50c1JlYWN0IGZyb20gJy4uL0FjY291bnRzUmVhY3QnXG5cbmNsYXNzIFNvY2lhbEJ1dHRvbnMgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuXG4gIHJlbmRlciAoKSB7XG4gICAgaWYgKCFBY2NvdW50cy5vYXV0aCkge1xuICAgICAgcmV0dXJuIG51bGxcbiAgICB9XG5cbiAgICBjb25zdCBzZXJ2aWNlcyA9IEFjY291bnRzLm9hdXRoLnNlcnZpY2VOYW1lcygpXG4gICAgY29uc3QgeyBTdWJtaXRGaWVsZCB9ID0gQWNjb3VudHNSZWFjdC5jb21wb25lbnRzXG4gICAgcmV0dXJuIHNlcnZpY2VzICYmIHNlcnZpY2VzLm1hcCgoc2VydmljZSwgaSkgPT4ge1xuXG4gICAgICByZXR1cm4gKFxuICAgICAgICA8U3VibWl0RmllbGRcbiAgICAgICAgICBrZXk9e2l9XG4gICAgICAgICAgb25DbGljaz17KCkgPT4gdGhpcy5sb2dpbldpdGgoc2VydmljZSl9XG4gICAgICAgICAgc29jaWFsPXtzZXJ2aWNlfVxuICAgICAgICAgIHRleHQ9e3NlcnZpY2V9XG4gICAgICAgIC8+XG4gICAgICApXG4gICAgfSlcbiAgfVxuXG4gIGxvZ2luV2l0aCA9IHNlcnZpY2UgPT4ge1xuICAgIGxldCBfc2VydmljZSA9IHNlcnZpY2VbMF0udG9VcHBlckNhc2UoKSArIHNlcnZpY2Uuc3Vic3RyKDEpXG5cbiAgICBpZiAoc2VydmljZSA9PT0gJ21ldGVvci1kZXZlbG9wZXInKSB7XG4gICAgICBfc2VydmljZSA9ICdNZXRlb3JEZXZlbG9wZXJBY2NvdW50J1xuICAgIH1cblxuICAgIGNvbnN0IG9wdGlvbnMgPSBBY2NvdW50c1JlYWN0LmNvbmZpZy5vYXV0aFtzZXJ2aWNlXSB8fCB7fVxuICAgIE1ldGVvclsnbG9naW5XaXRoJyArIF9zZXJ2aWNlXShvcHRpb25zLCBlcnIgPT4ge1xuICAgICAgaWYgKCFlcnIpIHtcbiAgICAgICAgY29uc3QgeyBvbkxvZ2luSG9vayB9ID0gdGhpcy5wcm9wcy5kZWZhdWx0c1xuICAgICAgICBpZiAob25Mb2dpbkhvb2spIHtcbiAgICAgICAgICBvbkxvZ2luSG9vaygpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFNvY2lhbEJ1dHRvbnNcbiIsIlxuLyogR2VuZXJpYyBnZXRNb2RlbCBmb3IgdGhlIHN0YXRlIGNvbXBvbmVudHMgKi9cblxuZnVuY3Rpb24gZ2V0TW9kZWwgKCkge1xuICAvKiBHZXQgb25seSBmb3JtIHZhbHVlcyBmcm9tIHN0YXRlLCBcInRoaXNcIiBpcyBiaW5kZWQgdG8gdGhlIHN0YXRlJ3MgY2xhc3MgKi9cblxuICBjb25zdCB7XG4gICAgY3VycmVudFN0YXRlLFxuICAgIGRlZmF1bHRzXG4gIH0gPSB0aGlzLnByb3BzXG5cbiAgY29uc3Qgc3RhdGVLZXlzID0gT2JqZWN0LmtleXModGhpcy5zdGF0ZSlcbiAgY29uc3QgZmllbGRzID0gZGVmYXVsdHMuZmllbGRzW2N1cnJlbnRTdGF0ZV1cbiAgY29uc3QgbW9kZWwgPSBzdGF0ZUtleXNcbiAgICAuZmlsdGVyKGtleSA9PiBmaWVsZHMuZmluZChmID0+IGYuX2lkID09PSBrZXkpKSAvLyBPbmx5IGtleXMgaW4gdGhlIGRlZmluZWQgZmllbGRzIGFycmF5XG4gICAgLnJlZHVjZSgob2JqLCBrZXkpID0+IHsgLy8gQ3JlYXRlIGEgbmV3IG9iamVjdFxuICAgICAgb2JqW2tleV0gPSB0aGlzLnN0YXRlW2tleV1cbiAgICAgIHJldHVybiBvYmpcbiAgICB9LCB7fSlcblxuICByZXR1cm4gbW9kZWxcbn1cblxuZXhwb3J0IGRlZmF1bHQgZ2V0TW9kZWxcbiIsImltcG9ydCB7IHZhbGlkYXRlT25DaGFuZ2UgfSBmcm9tICcuLi8uLi91dGlscy92YWxpZGF0ZUZpZWxkJ1xuXG4vKiBEZWZpbmUgYSBjaGFuZ2UgaGFuZGxlciBmb3IgZmllbGRzICovXG5cbmZ1bmN0aW9uIGhhbmRsZUlucHV0Q2hhbmdlIChlLCBfaWQpIHtcbiAgLy8gKnRoaXMqIGlzIGJvdW5kIHRvIGNhbGxpbmcgY29tcG9uZW50c1xuXG4gIC8vIENoZWNrIGlmIGUgaXMgYWxyZWFkeSBhIHN0cmluZyB2YWx1ZSBvciBhbiBldmVudCBvYmplY3RcbiAgY29uc3QgdmFsdWUgPSB0eXBlb2YgZSA9PT0gJ3N0cmluZycgPyBlIDogZS50YXJnZXQudmFsdWVcblxuICBpZiAoZmllbGRDaGFuZ2VkQXRMZWFzdE9uY2UodGhpcy5zdGF0ZSwgX2lkLCB2YWx1ZSkpIHJldHVyblxuXG4gIGNvbnN0IHtcbiAgICBjdXJyZW50U3RhdGUsXG4gICAgZGVmYXVsdHNcbiAgfSA9IHRoaXMucHJvcHNcblxuICBjb25zdCBmaWVsZHMgPSBkZWZhdWx0cy5maWVsZHNbY3VycmVudFN0YXRlXVxuICAvLyBpZiBlIGlzIGEgc3RyaW5nIGl0IG1lYW5zIHRoYXQgaXQncyBhIGRlZmF1bHQgdmFsdWUgYW5kIGRvZXNuJ3QgbmVlZCB0byBwYXNzIHZhbGlkYXRpb25cbiAgaWYgKHR5cGVvZiBlICE9PSAnc3RyaW5nJykge1xuICAgIGNvbnN0IGVycm9ycyA9IHZhbGlkYXRlT25DaGFuZ2UoZSwgX2lkLCBmaWVsZHMsIHRoaXMuZ2V0TW9kZWwoKSwgWy4uLnRoaXMuc3RhdGUuZXJyb3JzXSlcblxuICAgIGlmIChlcnJvcnMpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyBlcnJvcnMgfSlcbiAgICB9XG4gIH1cbiAgdGhpcy5zZXRTdGF0ZSh7IFtfaWRdOiB2YWx1ZSB9KVxufVxuXG5mdW5jdGlvbiBmaWVsZENoYW5nZWRBdExlYXN0T25jZSAoc3RhdGUsIF9pZCwgdmFsdWUpIHtcbiAgcmV0dXJuICFzdGF0ZS5oYXNPd25Qcm9wZXJ0eShfaWQpICYmIHZhbHVlID09PSAnJ1xufVxuXG5leHBvcnQgZGVmYXVsdCBoYW5kbGVJbnB1dENoYW5nZVxuIiwiaW1wb3J0IGdldE1vZGVsICAgICAgICAgIGZyb20gJy4vZ2V0TW9kZWwnXG5pbXBvcnQgcmVkaXJlY3QgICAgICAgICAgZnJvbSAnLi9yZWRpcmVjdCdcbmltcG9ydCBoYW5kbGVJbnB1dENoYW5nZSBmcm9tICcuL2hhbmRsZUlucHV0Q2hhbmdlJ1xuXG5leHBvcnQge1xuICBnZXRNb2RlbCxcbiAgcmVkaXJlY3QsXG4gIGhhbmRsZUlucHV0Q2hhbmdlXG59XG4iLCJpbXBvcnQgQWNjb3VudHNSZWFjdCBmcm9tICcuLi8uLi9BY2NvdW50c1JlYWN0J1xuXG4vKiBSZWRpcmVjdCB0byBkaWZmZXJlbnQgc3RhdGUgYWZ0ZXIgbGluayBjbGlja2VkICovXG5cbmNvbnN0IHJlZGlyZWN0ID0gZnVuY3Rpb24gKHRvU3RhdGUsIGhvb2spIHtcbiAgLy8gKnRoaXMqIGlzIGJvdW5kIHRvIHRoZSBjYWxsaW5nIGNvbXBvbmVudHNcbiAgLy8gIFJ1biBob29rIGZ1bmN0aW9uIGlmIHNldCB8fCBwdXNoIHN0YXRlIHZpYSBoaXN0b3J5IHx8IGNoYW5nZSBzdGF0ZSBpbnRlcm5hbGx5XG5cbiAgaWYgKGhvb2spIHtcbiAgICBob29rKClcbiAgfSBlbHNlIGlmICh0aGlzLnByb3BzLmhpc3RvcnkpIHtcbiAgICB0aGlzLnByb3BzLmhpc3RvcnkucHVzaChBY2NvdW50c1JlYWN0LmNvbmZpZy5tYXBTdGF0ZVRvUm91dGVbdG9TdGF0ZV0pXG4gIH0gZWxzZSB7XG4gICAgdGhpcy5wcm9wcy5jaGFuZ2VTdGF0ZSh0b1N0YXRlKVxuICB9XG5cbiAgcmV0dXJuXG59XG5cbmV4cG9ydCBkZWZhdWx0IHJlZGlyZWN0XG4iLCJpbXBvcnQgeyBBY2NvdW50cyB9IGZyb20gJ21ldGVvci9hY2NvdW50cy1iYXNlJ1xuaW1wb3J0IHsgVmFsaWRhdGVkTWV0aG9kIH0gZnJvbSAnbWV0ZW9yL21kZzp2YWxpZGF0ZWQtbWV0aG9kJ1xuaW1wb3J0IEFjY291bnRzUmVhY3QgZnJvbSAnLi4vLi4vQWNjb3VudHNSZWFjdCdcbmltcG9ydCB2YWxpZGF0ZUZpZWxkIGZyb20gJy4uLy4uL3V0aWxzL3ZhbGlkYXRlRmllbGQnXG5cblxuY29uc3QgQVJDcmVhdGVBY2NvdW50ID0gbmV3IFZhbGlkYXRlZE1ldGhvZCh7XG4gIG5hbWU6ICdBUkNyZWF0ZUFjY291bnQnLFxuICB2YWxpZGF0ZTogKHsgdXNlcm5hbWUsIGVtYWlsLCBwYXNzd29yZCwgLi4ucHJvZmlsZSB9KSA9PiB7XG4gICAgLyogVGhpcyB2YWxpZGF0aW9uIHJ1bnMgb24gYm90aCBjbGllbnQgYW5kIHNlcnZlciAqL1xuXG4gICAgaWYgKE1ldGVvci51c2VySWQoKSkge1xuICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignRXJyb3InLCAnQWxyZWFkeSBsb2dnZWQgaW4nKVxuICAgIH1cblxuICAgIGxldCBzaWdudXBGaWVsZHMgPSBBY2NvdW50c1JlYWN0LmNvbmZpZy5maWVsZHMuc2lnblVwXG5cbiAgICAvLyBSZW1vdmUgcGFzc3dvcmQgY29uZmlybWF0aW9uIGlmIG5vdCBzZXRcbiAgICBpZiAoIUFjY291bnRzUmVhY3QuY29uZmlnLmNvbmZpcm1QYXNzd29yZCkge1xuICAgICAgc2lnbnVwRmllbGRzID0gc2lnbnVwRmllbGRzLmZpbHRlcihmID0+IGYuX2lkICE9PSAnY29uZmlybVBhc3N3b3JkJylcbiAgICB9XG5cbiAgICAvLyBDaGVjayB0aGF0IHJlY2FwdGNoYSB0b2tlbiBpcyBpbmNsdWRlZCBpZiBuZWNlc3NhcnlcbiAgICBpZiAoQWNjb3VudHNSZWFjdC5jb25maWcuc2hvd1JlQ2FwdGNoYSAmJiAhcHJvZmlsZS50ZW1wUmVDYXB0Y2hhUmVzcG9uc2UpIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ1JlQ2FwdGNoYUVycm9yJywgQWNjb3VudHNSZWFjdC5jb25maWcudGV4dHMuZXJyb3JzLmNhcHRjaGFWZXJpZmljYXRpb24pXG4gICAgfVxuXG4gICAgY29uc3QgbmV3VXNlciA9IHtcbiAgICAgIHVzZXJuYW1lLFxuICAgICAgZW1haWwsXG4gICAgICBwYXNzd29yZCxcbiAgICAgIC4uLnByb2ZpbGUgLy8gRmxhdCBwcm9maWxlIG9iamVjdCBzbyBlYWNoIGtleTp2YWx1ZSBwYWlyIGdldHMgdmFsaWRhdGVkIGFzIGEgZmllbGRcbiAgICB9XG5cbiAgICBsZXQgZXJyb3JzID0gW11cbiAgICBzaWdudXBGaWVsZHMuZm9yRWFjaChmaWVsZCA9PiB7XG4gICAgICB2YWxpZGF0ZUZpZWxkKHNpZ251cEZpZWxkcywgZmllbGQsIG5ld1VzZXJbZmllbGQuX2lkXSwgbmV3VXNlciwgZXJyb3JzKVxuICAgIH0pXG5cbiAgICBpZiAoZXJyb3JzLmxlbmd0aCA+IDApIHtcbiAgICAgIHRocm93IG5ldyBNZXRlb3IuRXJyb3IoJ0FSQ3JlYXRlQWNjb3VudCcsIGVycm9ycylcbiAgICB9XG4gIH0sXG4gIHJ1biAobmV3VXNlcikge1xuICAgIGNvbnN0IHtcbiAgICAgIHVzZXJuYW1lLFxuICAgICAgZW1haWwsXG4gICAgICBwYXNzd29yZCxcbiAgICAgIC4uLnByb2ZpbGVcbiAgICB9ID0gbmV3VXNlclxuXG4gICAgY29uc3QgdXNlck9iamVjdCA9IHtcbiAgICAgIHVzZXJuYW1lLFxuICAgICAgZW1haWwsXG4gICAgICBwYXNzd29yZCxcbiAgICAgIHByb2ZpbGVcbiAgICB9XG5cbiAgICAvLyBVbm5lY2Vzc2FyeSBmaWVsZHMgKHVzZWQgb25seSBmb3IgdmFsaWRhdGlvbilcbiAgICBkZWxldGUgdXNlck9iamVjdC5wcm9maWxlLnBhc3N3b3JkQ29uZmlybWF0aW9uXG5cbiAgICBpZiAoIXVzZXJuYW1lKSB7XG4gICAgICBkZWxldGUgdXNlck9iamVjdC51c2VybmFtZVxuICAgIH0gZWxzZSBpZiAoIWVtYWlsKSB7XG4gICAgICBkZWxldGUgdXNlck9iamVjdC5lbWFpbFxuICAgIH1cbiAgICBcbiAgICAvLyBDcmVhdGUgdGhlIHVzZXIgb24gdGhlIHNlcnZlciBvbmx5IVxuICAgIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICAgIGlmIChBY2NvdW50c1JlYWN0LmNvbmZpZy5zaG93UmVDYXB0Y2hhKSB7XG4gICAgICAgIGNvbnN0IHJlcyA9IEhUVFAucG9zdCgnaHR0cHM6Ly93d3cuZ29vZ2xlLmNvbS9yZWNhcHRjaGEvYXBpL3NpdGV2ZXJpZnknLCB7XG4gICAgICAgICAgcGFyYW1zOiAge1xuICAgICAgICAgICAgc2VjcmV0OiBBY2NvdW50c1JlYWN0LmNvbmZpZy5yZUNhcHRjaGEuc2VjcmV0S2V5IHx8IE1ldGVvci5zZXR0aW5ncy5yZUNhcHRjaGEuc2VjcmV0S2V5LFxuICAgICAgICAgICAgcmVzcG9uc2U6IHVzZXJPYmplY3QucHJvZmlsZS50ZW1wUmVDYXB0Y2hhUmVzcG9uc2UsXG4gICAgICAgICAgICByZW1vdGVpcDogdGhpcy5jb25uZWN0aW9uLmNsaWVudEFkZHJlc3NcbiAgICAgICAgICB9XG4gICAgICAgIH0pLmRhdGFcblxuICAgICAgICBpZiAoIXJlcy5zdWNjZXNzKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcignUmVDYXB0Y2hhRXJyb3InLCBBY2NvdW50c1JlYWN0LmNvbmZpZy50ZXh0cy5lcnJvcnMuY2FwdGNoYVZlcmlmaWNhdGlvbilcbiAgICAgICAgfVxuXG4gICAgICAgIGRlbGV0ZSB1c2VyT2JqZWN0LnByb2ZpbGUudGVtcFJlQ2FwdGNoYVJlc3BvbnNlXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHVzZXJJZCA9IEFjY291bnRzLmNyZWF0ZVVzZXIodXNlck9iamVjdClcblxuICAgICAgaWYgKCF1c2VySWQpIHtcbiAgICAgICAgLy8gc2FmZXR5IGJlbHQuIGNyZWF0ZVVzZXIgaXMgc3VwcG9zZWQgdG8gdGhyb3cgb24gZXJyb3IuIHNlbmQgNTAwIGVycm9yXG4gICAgICAgIC8vIGluc3RlYWQgb2Ygc2VuZGluZyBhIHZlcmlmaWNhdGlvbiBlbWFpbCB3aXRoIGVtcHR5IHVzZXJpZC5cblxuICAgICAgICAvKiBpdCB3YXMgdGFrZW4gZGlyZWN0bHkgZnJvbSB1c2VyYWNjb3VudHMgcGFja2FnZSAqL1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2NyZWF0ZVVzZXIgZmFpbGVkIHRvIGluc2VydCBuZXcgdXNlcicpXG4gICAgICB9XG5cbiAgICAgIGlmICh1c2VyT2JqZWN0LmVtYWlsICYmIEFjY291bnRzUmVhY3QuY29uZmlnLnNlbmRWZXJpZmljYXRpb25FbWFpbCkge1xuICAgICAgICBBY2NvdW50cy5zZW5kVmVyaWZpY2F0aW9uRW1haWwodXNlcklkLCB1c2VyT2JqZWN0LmVtYWlsKVxuICAgICAgfVxuICAgIH1cbiAgfVxufSlcblxuZXhwb3J0IGRlZmF1bHQgQVJDcmVhdGVBY2NvdW50XG4iLCIvKiBnbG9iYWxzIE1ldGVvcjogdHJ1ZSAqL1xuaW1wb3J0IHsgQWNjb3VudHMgfSBmcm9tICdtZXRlb3IvYWNjb3VudHMtYmFzZSdcbmltcG9ydCBBUkNyZWF0ZUFjY291bnQgZnJvbSAnLi9BUkNyZWF0ZUFjY291bnQnXG5pbXBvcnQgQWNjb3VudHNSZWFjdCBmcm9tICcuLi8uLi9BY2NvdW50c1JlYWN0J1xuLy8gQ3JlYXRlIHVzZXJcbmV4cG9ydCBjb25zdCBjcmVhdGVVc2VyID0gKG5ld1VzZXIsIGNhbGxiYWNrKSA9PiB7XG4gIEFSQ3JlYXRlQWNjb3VudC5jYWxsKG5ld1VzZXIsIGNhbGxiYWNrKVxufVxuXG4vLyBMb2dpblxuZXhwb3J0IGNvbnN0IGxvZ2luID0gKHVzZXJuYW1lLCBlbWFpbCwgcGFzc3dvcmQsIGNhbGxiYWNrKSA9PiB7XG4gIE1ldGVvci5sb2dpbldpdGhQYXNzd29yZCh1c2VybmFtZSB8fCBlbWFpbCwgcGFzc3dvcmQsIGVyciA9PiB7XG4gICAgY2FsbGJhY2soZXJyKVxuICB9KVxufVxuXG4vLyBGb3Jnb3QgcGFzc3dvcmRcbmV4cG9ydCBjb25zdCBmb3Jnb3RQYXNzd29yZCA9IChlbWFpbCwgY2FsbGJhY2spID0+IHtcbiAgQWNjb3VudHMuZm9yZ290UGFzc3dvcmQoZW1haWwsIGNhbGxiYWNrKVxufVxuXG4vLyBDaGFuZ2UgcGFzc3dvcmRcbmV4cG9ydCBjb25zdCBjaGFuZ2VQYXNzd29yZCA9IChvbGRQYXNzd29yZCwgbmV3UGFzc3dvcmQsIGNhbGxiYWNrKSA9PiB7XG4gIEFjY291bnRzLmNoYW5nZVBhc3N3b3JkKG9sZFBhc3N3b3JkLCBuZXdQYXNzd29yZCwgY2FsbGJhY2spXG59XG5cbi8vIFJlc2V0IHBhc3N3b3JkXG5leHBvcnQgY29uc3QgcmVzZXRQYXNzd29yZCA9ICh0b2tlbiwgbmV3UGFzc3dvcmQsIGNhbGxiYWNrKSA9PiB7XG4gIEFjY291bnRzLnJlc2V0UGFzc3dvcmQodG9rZW4sIG5ld1Bhc3N3b3JkLCBjYWxsYmFjaylcbn1cbiIsImltcG9ydCByZWdFeHAgZnJvbSAnLi9yZWdFeHAnXG5pbXBvcnQgdmFsaWRhdGVGaWVsZCwgeyB2YWxpZGF0ZU9uQ2hhbmdlIH0gZnJvbSAnLi92YWxpZGF0ZUZpZWxkJ1xuaW1wb3J0IHZhbGlkYXRlRm9ybSBmcm9tICcuL3ZhbGlkYXRlRm9ybSdcblxuZXhwb3J0IHtcbiAgcmVnRXhwLFxuICB2YWxpZGF0ZUZpZWxkLFxuICB2YWxpZGF0ZU9uQ2hhbmdlLFxuICB2YWxpZGF0ZUZvcm1cbn1cbiIsIlxuLy8gQ3JlZGl0IHRvIGFsZGVlZC9zaW1wbGUtc2NoZW1hIHBhY2thZ2VcblxuZXhwb3J0IGRlZmF1bHQge1xuICAvLyBFbWFpbHMgd2l0aCBUTERcbiAgRW1haWw6IC9eW2EtekEtWjAtOS4hIyQlJicqK1xcLz0/Xl9ge3x9fi1dKyg/OlxcLltBLXowLTkhIyQlJicqK1xcLz0/Xl9ge3x9fi1dKykqQCg/OltBLXowLTldKD86W2EtejAtOS1dKlthLXowLTldKT9cXC4pK1tBLXowLTldezIsfSg/OlthLXowLTktXSpbYS16MC05XSk/JC8sXG4gIFVzZXJuYW1lOiAvXlthLXpBLVowLTldKyhbXyAtXT9bYS16QS1aMC05XSkqJC9cbn1cbiIsImltcG9ydCBBY2NvdW50c1JlYWN0IGZyb20gJy4uL0FjY291bnRzUmVhY3QnXG4vKiBWYWxpZGF0ZSBmaWVsZHMgc3BlY2lmaWVkIGluIEFjY291bnRzUmVhY3QuY29uZmlnICovXG5cbmNvbnN0IHZhbGlkYXRlRmllbGQgPSAoZmllbGRzLCBmaWVsZE9iaiwgdmFsdWUsIG1vZGVsLCBlcnJvcnNBcnJheSA9IFtdKSA9PiB7XG4gIGNvbnN0IHtcbiAgICBfaWQsXG4gICAgcmVxdWlyZWQsXG4gICAgZnVuYyxcbiAgICByZSxcbiAgICBtaW5MZW5ndGgsXG4gICAgbWF4TGVuZ3RoLFxuICAgIGVyclN0clxuICB9ID0gZmllbGRPYmpcblxuICAvLyBWYWxpZGF0ZSB0aHJvdWdoIGEgZnVuY3Rpb24gcHJvdmlkZWQgYnkgdGhlIHVzZXJcbiAgaWYgKGZ1bmMpIHtcbiAgICByZXR1cm4gZnVuYyhmaWVsZHMsIGZpZWxkT2JqLCB2YWx1ZSwgbW9kZWwsIGVycm9yc0FycmF5KVxuICB9XG5cbiAgLy8gTWFrZSBzdXJlIHRoYXQgYSB2YWx1ZSBleGlzdHMgYW5kIHJlcXVpcmVkIGlzIG5vdCBmYWxzZSB0byBjb250aW51ZSB2YWxpZGF0aW9uXG4gIGlmICghdmFsdWUpIHtcbiAgICBpZiAocmVxdWlyZWQgPT09IGZhbHNlKSB7XG4gICAgICAvLyBEbyBub3RoaW5nXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH0gZWxzZSB7XG4gICAgICBlcnJvcnNBcnJheS5wdXNoKHsgX2lkLCBlcnJTdHI6IGVyclN0ciB8fCBgJHtfaWR9IGlzIHJlcXVpcmVkYCB9KVxuICAgICAgcmV0dXJuXG4gICAgfVxuICB9XG5cbiAgLy8gVmFsaWRhdGUgYnkgcmVndWxhciBleHBvcmVzc2lvblxuICBpZiAocmUgJiYgIXJlLnRlc3QodmFsdWUpKSB7XG4gICAgZXJyb3JzQXJyYXkucHVzaCh7IF9pZCwgZXJyU3RyOiBlcnJTdHIgfHwgYCR7dmFsdWV9IGlzIG5vdCB2YWxpZCBhcyAke19pZH1gIH0pXG4gICAgcmV0dXJuXG4gIH1cblxuICAvLyBWYWxpZGF0ZSBtaW4gbGVuZ3RoXG4gIGlmIChtaW5MZW5ndGggJiYgbWluTGVuZ3RoID4gdmFsdWUubGVuZ3RoKSB7XG4gICAgZXJyb3JzQXJyYXkucHVzaCh7IF9pZCwgZXJyU3RyOiBlcnJTdHIgfHwgYCR7X2lkfSBsZW5ndGggbXVzdCBiZSBhdCBsZWFzdCAke21pbkxlbmd0aH0gY2hhcmFjdGVyc2AgfSlcbiAgICByZXR1cm5cbiAgfVxuXG4gIC8vIFZhbGlkYXRlIG1heCBsZW5ndGhcbiAgaWYgKG1heExlbmd0aCAmJiBtYXhMZW5ndGggPCB2YWx1ZS5sZW5ndGgpIHtcbiAgICBlcnJvcnNBcnJheS5wdXNoKHsgX2lkLCBlcnJTdHI6IGVyclN0ciB8fCBgJHtfaWR9IGxlbmd0aCBtdXN0IGJlIG5vIG1vcmUgdGhhbiAke21heExlbmd0aH0gY2hhcmFjdGVyc2AgfSlcbiAgICByZXR1cm5cbiAgfVxuXG4gIHJldHVybiB0cnVlXG59XG5cbi8qIFZhbGlkYXRlIGZpZWxkcyBvbiBjaGFuZ2UgZXZlbnRzIHdoZW4gdmFsaWRhdGVPbkNoYW5nZSBvciB2YWxpZGF0ZU9uRm9jdXNPdXQgYXJlIHNldCB0byB0cnVlICovXG5cbmNvbnN0IHZhbGlkYXRlT25DaGFuZ2UgPSAoZSwgX2lkLCBmaWVsZHMsIG1vZGVsLCBlcnJvcnMpID0+IHtcbiAgY29uc3QgeyB0eXBlLCB0YXJnZXQgfSA9IGVcbiAgY29uc3QgeyBjb250aW51b3VzVmFsaWRhdGlvbiwgbmVnYXRpdmVWYWxpZGF0aW9uIH0gPSBBY2NvdW50c1JlYWN0LmNvbmZpZ1xuXG4gIC8vIENoZWNrIHRoZSBjb25kaXRpb25zIG1hdGNoIHNldHRpbmdzXG4gIGlmICgodHlwZSA9PT0gJ2JsdXInICYmIG5lZ2F0aXZlVmFsaWRhdGlvbikgfHwgKHR5cGUgPT09ICdjaGFuZ2UnICYmIGNvbnRpbnVvdXNWYWxpZGF0aW9uKSkge1xuICAgIGNvbnN0IGZpZWxkT2JqID0gZmllbGRzLmZpbmQoZiA9PiBmLl9pZCA9PT0gX2lkKVxuXG4gICAgaWYgKCF2YWxpZGF0ZUZpZWxkKGZpZWxkcywgZmllbGRPYmosIHRhcmdldC52YWx1ZSwgbW9kZWwsIGVycm9ycykpIHtcbiAgICAgIHJldHVybiBlcnJvcnNcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gTWFrZSBzdXJlIGVycm9yIG9iamVjdCBmb3IgdGhlIGZpZWxkIGRvZXNuJ3Qgc3RheSBhZnRlciBpdCBpcyB2YWxpZFxuICAgICAgcmV0dXJuIGVycm9ycy5maWx0ZXIoZXJyID0+IGVyci5faWQgIT09IF9pZClcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IHtcbiAgdmFsaWRhdGVGaWVsZCBhcyBkZWZhdWx0LFxuICB2YWxpZGF0ZU9uQ2hhbmdlXG59XG4iLCJpbXBvcnQgdmFsaWRhdGVGaWVsZCBmcm9tICcuL3ZhbGlkYXRlRmllbGQnXG5cbi8vIEdlbmVyaWMgZm9ybSB2YWxpZGF0aW9uIGZvciB0aGUgc3RhdGUgY29tcG9uZW50c1xuXG5jb25zdCB2YWxpZGF0ZUZvcm0gPSAobW9kZWwsIGNvbnRleHQpID0+IHtcbiAgbGV0IF9lcnJvcnMgPSBbXVxuXG4gIC8vIFZhbGlkYXRlIGxvZ2luIGNyZWRlbnRpYWxzIG9uIGNsaWVudCwgXCJsb2dpbldpdGhQYXNzd29yZFwiIG1ldGhvZCB3aWxsIHZhbGlkYXRlIG9uIHNlcnZlci5cbiAgY29uc3Qge1xuICAgIGN1cnJlbnRTdGF0ZSxcbiAgICBkZWZhdWx0c1xuICB9ID0gY29udGV4dC5wcm9wc1xuXG4gIGNvbnN0IGZpZWxkcyA9IGRlZmF1bHRzLmZpZWxkc1tjdXJyZW50U3RhdGVdXG4gIGZpZWxkcy5mb3JFYWNoKGZpZWxkID0+IHtcbiAgICB2YWxpZGF0ZUZpZWxkKGZpZWxkcywgZmllbGQsIG1vZGVsW2ZpZWxkLl9pZF0sIG1vZGVsLCBfZXJyb3JzKVxuICB9KVxuXG4gIGlmIChfZXJyb3JzLmxlbmd0aCA+IDApIHtcbiAgICBjb250ZXh0LnNldFN0YXRlKHsgZXJyb3JzOiBfZXJyb3JzIH0pXG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cbiAgcmV0dXJuIHRydWVcbn1cblxuZXhwb3J0IGRlZmF1bHQgdmFsaWRhdGVGb3JtXG4iLCIvKlxuICBDcmVkaXQgdG8gS3lsZSBNYXRoZXdzXG4gIGh0dHBzOi8vZ2l0aHViLmNvbS9LeWxlQU1hdGhld3MvZGVlcG1lcmdlXG4qL1xuXG5pbXBvcnQgZGVmYXVsdElzTWVyZ2VhYmxlT2JqZWN0IGZyb20gJy4vaXMtbWVyZ2VhYmxlLW9iamVjdCdcblxuZnVuY3Rpb24gZW1wdHlUYXJnZXQodmFsKSB7XG5cdHJldHVybiBBcnJheS5pc0FycmF5KHZhbCkgPyBbXSA6IHt9XG59XG5cbmZ1bmN0aW9uIGNsb25lVW5sZXNzT3RoZXJ3aXNlU3BlY2lmaWVkKHZhbHVlLCBvcHRpb25zKSB7XG5cdHJldHVybiAob3B0aW9ucy5jbG9uZSAhPT0gZmFsc2UgJiYgb3B0aW9ucy5pc01lcmdlYWJsZU9iamVjdCh2YWx1ZSkpXG5cdFx0PyBkZWVwbWVyZ2UoZW1wdHlUYXJnZXQodmFsdWUpLCB2YWx1ZSwgb3B0aW9ucylcblx0XHQ6IHZhbHVlXG59XG5cbmZ1bmN0aW9uIGRlZmF1bHRBcnJheU1lcmdlKHRhcmdldCwgc291cmNlLCBvcHRpb25zKSB7XG5cdHJldHVybiB0YXJnZXQuY29uY2F0KHNvdXJjZSkubWFwKGZ1bmN0aW9uKGVsZW1lbnQpIHtcblx0XHRyZXR1cm4gY2xvbmVVbmxlc3NPdGhlcndpc2VTcGVjaWZpZWQoZWxlbWVudCwgb3B0aW9ucylcblx0fSlcbn1cblxuZnVuY3Rpb24gbWVyZ2VPYmplY3QodGFyZ2V0LCBzb3VyY2UsIG9wdGlvbnMpIHtcblx0dmFyIGRlc3RpbmF0aW9uID0ge31cblx0aWYgKG9wdGlvbnMuaXNNZXJnZWFibGVPYmplY3QodGFyZ2V0KSkge1xuXHRcdE9iamVjdC5rZXlzKHRhcmdldCkuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcblx0XHRcdGRlc3RpbmF0aW9uW2tleV0gPSBjbG9uZVVubGVzc090aGVyd2lzZVNwZWNpZmllZCh0YXJnZXRba2V5XSwgb3B0aW9ucylcblx0XHR9KVxuXHR9XG5cdE9iamVjdC5rZXlzKHNvdXJjZSkuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcblx0XHRpZiAoIW9wdGlvbnMuaXNNZXJnZWFibGVPYmplY3Qoc291cmNlW2tleV0pIHx8ICF0YXJnZXRba2V5XSkge1xuXHRcdFx0ZGVzdGluYXRpb25ba2V5XSA9IGNsb25lVW5sZXNzT3RoZXJ3aXNlU3BlY2lmaWVkKHNvdXJjZVtrZXldLCBvcHRpb25zKVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRkZXN0aW5hdGlvbltrZXldID0gZGVlcG1lcmdlKHRhcmdldFtrZXldLCBzb3VyY2Vba2V5XSwgb3B0aW9ucylcblx0XHR9XG5cdH0pXG5cdHJldHVybiBkZXN0aW5hdGlvblxufVxuXG5mdW5jdGlvbiBkZWVwbWVyZ2UodGFyZ2V0LCBzb3VyY2UsIG9wdGlvbnMpIHtcblx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge31cblx0b3B0aW9ucy5hcnJheU1lcmdlID0gb3B0aW9ucy5hcnJheU1lcmdlIHx8IGRlZmF1bHRBcnJheU1lcmdlXG5cdG9wdGlvbnMuaXNNZXJnZWFibGVPYmplY3QgPSBvcHRpb25zLmlzTWVyZ2VhYmxlT2JqZWN0IHx8IGRlZmF1bHRJc01lcmdlYWJsZU9iamVjdFxuXG5cdHZhciBzb3VyY2VJc0FycmF5ID0gQXJyYXkuaXNBcnJheShzb3VyY2UpXG5cdHZhciB0YXJnZXRJc0FycmF5ID0gQXJyYXkuaXNBcnJheSh0YXJnZXQpXG5cdHZhciBzb3VyY2VBbmRUYXJnZXRUeXBlc01hdGNoID0gc291cmNlSXNBcnJheSA9PT0gdGFyZ2V0SXNBcnJheVxuXG5cdGlmICghc291cmNlQW5kVGFyZ2V0VHlwZXNNYXRjaCkge1xuXHRcdHJldHVybiBjbG9uZVVubGVzc090aGVyd2lzZVNwZWNpZmllZChzb3VyY2UsIG9wdGlvbnMpXG5cdH0gZWxzZSBpZiAoc291cmNlSXNBcnJheSkge1xuXHRcdHJldHVybiBvcHRpb25zLmFycmF5TWVyZ2UodGFyZ2V0LCBzb3VyY2UsIG9wdGlvbnMpXG5cdH0gZWxzZSB7XG5cdFx0cmV0dXJuIG1lcmdlT2JqZWN0KHRhcmdldCwgc291cmNlLCBvcHRpb25zKVxuXHR9XG59XG5cbmRlZXBtZXJnZS5hbGwgPSBmdW5jdGlvbiBkZWVwbWVyZ2VBbGwoYXJyYXksIG9wdGlvbnMpIHtcblx0aWYgKCFBcnJheS5pc0FycmF5KGFycmF5KSkge1xuXHRcdHRocm93IG5ldyBFcnJvcignZmlyc3QgYXJndW1lbnQgc2hvdWxkIGJlIGFuIGFycmF5Jylcblx0fVxuXG5cdHJldHVybiBhcnJheS5yZWR1Y2UoZnVuY3Rpb24ocHJldiwgbmV4dCkge1xuXHRcdHJldHVybiBkZWVwbWVyZ2UocHJldiwgbmV4dCwgb3B0aW9ucylcblx0fSwge30pXG59XG5cbm1vZHVsZS5leHBvcnRzID0gZGVlcG1lcmdlXG4iLCIvKlxuICBDcmVkaXQgdG8gSm9zaCBEdWZmXG4gIGh0dHBzOi8vZ2l0aHViLmNvbS9UZWhTaHJpa2UvaXMtbWVyZ2VhYmxlLW9iamVjdFxuKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc01lcmdlYWJsZU9iamVjdCh2YWx1ZSkge1xuXHRyZXR1cm4gaXNOb25OdWxsT2JqZWN0KHZhbHVlKVxuXHRcdCYmICFpc1NwZWNpYWwodmFsdWUpXG59XG5cbmZ1bmN0aW9uIGlzTm9uTnVsbE9iamVjdCh2YWx1ZSkge1xuXHRyZXR1cm4gISF2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnXG59XG5cbmZ1bmN0aW9uIGlzU3BlY2lhbCh2YWx1ZSkge1xuXHR2YXIgc3RyaW5nVmFsdWUgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpXG5cblx0cmV0dXJuIHN0cmluZ1ZhbHVlID09PSAnW29iamVjdCBSZWdFeHBdJ1xuXHRcdHx8IHN0cmluZ1ZhbHVlID09PSAnW29iamVjdCBEYXRlXSdcblx0XHR8fCBpc1JlYWN0RWxlbWVudCh2YWx1ZSlcbn1cblxuLy8gc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9yZWFjdC9ibG9iL2I1YWM5NjNmYjc5MWQxMjk4ZTdmMzk2MjM2MzgzYmM5NTVmOTE2YzEvc3JjL2lzb21vcnBoaWMvY2xhc3NpYy9lbGVtZW50L1JlYWN0RWxlbWVudC5qcyNMMjEtTDI1XG52YXIgY2FuVXNlU3ltYm9sID0gdHlwZW9mIFN5bWJvbCA9PT0gJ2Z1bmN0aW9uJyAmJiBTeW1ib2wuZm9yXG52YXIgUkVBQ1RfRUxFTUVOVF9UWVBFID0gY2FuVXNlU3ltYm9sID8gU3ltYm9sLmZvcigncmVhY3QuZWxlbWVudCcpIDogMHhlYWM3XG5cbmZ1bmN0aW9uIGlzUmVhY3RFbGVtZW50KHZhbHVlKSB7XG5cdHJldHVybiB2YWx1ZS4kJHR5cGVvZiA9PT0gUkVBQ1RfRUxFTUVOVF9UWVBFXG59XG4iXX0=
