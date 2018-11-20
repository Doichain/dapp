(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var meteorInstall = Package.modules.meteorInstall;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;
var Accounts = Package['accounts-base'].Accounts;
var T9n = Package['softwarerero:accounts-t9n'].T9n;

var require = meteorInstall({"node_modules":{"meteor":{"zetoff:accounts-material-ui":{"check_npm.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                      //
// packages/zetoff_accounts-material-ui/check_npm.js                                                    //
//                                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                        //
let checkNpmVersions;
module.link("meteor/tmeasday:check-npm-versions", {
  checkNpmVersions(v) {
    checkNpmVersions = v;
  }

}, 0);
checkNpmVersions({
  'material-ui': '>=0.16.x'
}, 'zetoff:accounts-material-ui');

const MaterialUI = require('material-ui');
//////////////////////////////////////////////////////////////////////////////////////////////////////////

},"main.jsx":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                      //
// packages/zetoff_accounts-material-ui/main.jsx                                                        //
//                                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                        //
module.export({
  Accounts: () => Accounts,
  STATES: () => STATES
});
let React;
module.link("react", {
  default(v) {
    React = v;
  }

}, 0);
let Accounts, STATES;
module.link("./fix.js", {
  Accounts(v) {
    Accounts = v;
  },

  STATES(v) {
    STATES = v;
  }

}, 1);
let RaisedButton, FlatButton, FontIcon, TextField, Divider, Snackbar;
module.link("material-ui", {
  RaisedButton(v) {
    RaisedButton = v;
  },

  FlatButton(v) {
    FlatButton = v;
  },

  FontIcon(v) {
    FontIcon = v;
  },

  TextField(v) {
    TextField = v;
  },

  Divider(v) {
    Divider = v;
  },

  Snackbar(v) {
    Snackbar = v;
  }

}, 2);
let socialButtonsColors, socialButtonIcons;
module.link("./social_buttons_config", {
  socialButtonsColors(v) {
    socialButtonsColors = v;
  },

  socialButtonIcons(v) {
    socialButtonIcons = v;
  }

}, 3);
let green500, red500, yellow600, lightBlue600;
module.link("material-ui/styles/colors", {
  green500(v) {
    green500 = v;
  },

  red500(v) {
    red500 = v;
  },

  yellow600(v) {
    yellow600 = v;
  },

  lightBlue600(v) {
    lightBlue600 = v;
  }

}, 4);

/**
 * Form.propTypes = {
 *   fields: React.PropTypes.object.isRequired,
 *   buttons: React.PropTypes.object.isRequired,
 *   error: React.PropTypes.string,
 *   ready: React.PropTypes.bool
 * };
 */
class LoginForm extends Accounts.ui.LoginForm {
  componentWillMount() {// FIXME hack to solve issue #18
  }

}

class Form extends Accounts.ui.Form {
  render() {
    const {
      hasPasswordService,
      oauthServices,
      fields,
      buttons,
      error,
      message,
      ready = true,
      className,
      formState
    } = this.props;
    return React.createElement("form", {
      ref: ref => this.form = ref,
      className: ["accounts", className].join(' ')
    }, Object.keys(fields).length > 0 ? React.createElement(Accounts.ui.Fields, {
      fields: fields
    }) : null, React.createElement(Accounts.ui.Buttons, {
      buttons: buttons
    }), React.createElement("br", null), formState == STATES.SIGN_IN || formState == STATES.SIGN_UP ? React.createElement("div", {
      className: "or-sep"
    }, React.createElement(Accounts.ui.PasswordOrService, {
      oauthServices: oauthServices
    })) : null, formState == STATES.SIGN_IN || formState == STATES.SIGN_UP ? React.createElement(Accounts.ui.SocialButtons, {
      oauthServices: oauthServices
    }) : null, React.createElement("br", null), React.createElement(Accounts.ui.FormMessage, message));
  }

}

class Buttons extends Accounts.ui.Buttons {}

class Button extends Accounts.ui.Button {
  render() {
    const {
      label,
      href = null,
      type,
      disabled = false,
      onClick,
      className,
      icon
    } = this.props;
    return type == 'link' ? React.createElement(FlatButton, {
      href: href,
      label: label,
      icon: icon ? React.createElement(FontIcon, {
        className: `fa ${icon}`
      }) : null,
      className: className,
      onTouchTap: onClick,
      disabled: disabled,
      style: {
        marginRight: '5px'
      }
    }) : React.createElement(RaisedButton, {
      label: label,
      icon: icon ? React.createElement(FontIcon, {
        className: `fa ${icon}`
      }) : null,
      primary: true,
      type: type,
      className: className,
      onTouchTap: onClick,
      disabled: disabled,
      style: {
        marginRight: '5px'
      }
    });
  }

}

class Fields extends Accounts.ui.Fields {
  render() {
    let {
      fields = {},
      className = ""
    } = this.props;
    return React.createElement("div", {
      className: [className].join(' ')
    }, Object.keys(fields).map((id, i) => React.createElement("div", {
      key: i
    }, React.createElement(Accounts.ui.Field, fields[id]), React.createElement("br", null))));
  }

}

class Field extends Accounts.ui.Field {
  render() {
    const {
      id,
      hint,
      label,
      type = 'text',
      onChange,
      required = false,
      className,
      defaultValue = ""
    } = this.props;
    const {
      mount = true
    } = this.state;
    return mount ? React.createElement(TextField, {
      floatingLabelText: label,
      hintText: hint,
      onChange: onChange,
      fullWidth: true,
      defaultValue: defaultValue,
      name: id,
      type: type,
      ref: ref => this.input = ref,
      required: required ? "required" : "",
      autoCapitalize: type == 'email' ? 'none' : false,
      autoCorrect: "off"
    }) : null;
  }

}

class SocialButtons extends Accounts.ui.SocialButtons {
  render() {
    let {
      oauthServices = {},
      className = "social-buttons"
    } = this.props;

    if (Object.keys(oauthServices).length > 0) {
      return React.createElement("div", {
        className: [className].join(' ')
      }, Object.keys(oauthServices).map((id, i) => {
        let serviceClass = id.replace(/google|meteor\-developer/gi, matched => {
          return socialButtonIcons[matched];
        });
        const {
          label,
          type,
          onClick,
          disabled
        } = oauthServices[id];
        return React.createElement(RaisedButton, {
          key: i,
          label: label,
          type: type,
          onTouchTap: onClick,
          disabled: disabled,
          className: serviceClass.length > 0 ? `${serviceClass}` : '',
          icon: serviceClass.length > 0 ? React.createElement(FontIcon, {
            className: `fa fa-${serviceClass}`
          }) : '',
          backgroundColor: socialButtonsColors[id].background,
          labelColor: socialButtonsColors[id].label,
          style: {
            marginRight: '5px'
          }
        });
      }));
    } else {
      return null;
    }
  }

}

class FormMessage extends Accounts.ui.FormMessage {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.message) {
      this.setState({
        open: true
      });
    }
  }

  handleRequestClose() {
    this.setState({
      open: false
    });
  }

  render() {
    const {
      message,
      type
    } = this.props;
    let bodyStyle;

    switch (type) {
      case 'warning':
        bodyStyle = {
          backgroundColor: yellow600
        };
        break;

      case 'success':
        bodyStyle = {
          backgroundColor: green500
        };
        break;

      case 'error':
        bodyStyle = {
          backgroundColor: red500
        };
        break;

      case 'info':
        bodyStyle = {
          backgroundColor: lightBlue600
        };
        break;
    }

    return message ? React.createElement(Snackbar, {
      open: this.state.open,
      message: message,
      bodyStyle: bodyStyle,
      action: "OK",
      autoHideDuration: 4000,
      onActionTouchTap: this.handleRequestClose.bind(this),
      onRequestClose: this.handleRequestClose.bind(this)
    }) : null;
  }

} // Notice! Accounts.ui.LoginForm manages all state logic at the moment, so avoid overwriting this
// one, but have a look at it and learn how it works. And pull requests altering how that works are
// welcome. Alter provided default unstyled UI.


Accounts.ui.LoginForm = LoginForm;
Accounts.ui.Form = Form;
Accounts.ui.Buttons = Buttons;
Accounts.ui.Button = Button;
Accounts.ui.Fields = Fields;
Accounts.ui.Field = Field;
Accounts.ui.FormMessage = FormMessage;
Accounts.ui.SocialButtons = SocialButtons; // Export the themed version.

module.exportDefault(Accounts);
//////////////////////////////////////////////////////////////////////////////////////////////////////////

},"fix.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                      //
// packages/zetoff_accounts-material-ui/fix.js                                                          //
//                                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                        //
module.export({
  Accounts: () => Accounts,
  STATES: () => STATES
});
let Accounts, STATES;
module.link("meteor/std:accounts-ui", {
  Accounts(v) {
    Accounts = v;
  },

  STATES(v) {
    STATES = v;
  }

}, 0);

class Field extends Accounts.ui.Field {
  triggerUpdate() {
    const {
      onChange
    } = this.props;
    let value;

    if (this.input) {
      value = this.input.value;
    }

    if (value === undefined) {
      value = '';
    } else {// do nothing
    }

    if (this.input) {
      onChange({
        target: {
          value
        }
      });
    }
  }

}

Accounts.ui.Field = Field;
module.exportDefault(Accounts);
//////////////////////////////////////////////////////////////////////////////////////////////////////////

},"social_buttons_config.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                      //
// packages/zetoff_accounts-material-ui/social_buttons_config.js                                        //
//                                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                        //
module.export({
  socialButtonsColors: () => socialButtonsColors,
  socialButtonIcons: () => socialButtonIcons
});
const socialButtonsColors = {
  facebook: {
    background: '#3b5998',
    label: '#fff'
  },
  twitter: {
    background: '#55acee',
    label: '#fff'
  },
  github: {
    background: '#000',
    label: '#fff'
  },
  google: {
    background: '#dd4b39',
    label: '#fff'
  },
  'meteor-developer': {
    backgroundColor: '#bb0000',
    label: '#fff'
  },
  'meetup': {
    background: '#ED1C40',
    label: '#fff'
  },
  weibo: {
    background: '#faf6f1',
    label: '#000'
  },
  pinterest: {
    background: '#bd081c',
    label: '#fff'
  }
};
const socialButtonIcons = {
  google: "google-plus",
  "meteor-developer": "rocket"
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json",
    ".jsx"
  ]
});

require("/node_modules/meteor/zetoff:accounts-material-ui/check_npm.js");
var exports = require("/node_modules/meteor/zetoff:accounts-material-ui/main.jsx");

/* Exports */
Package._define("zetoff:accounts-material-ui", exports);

})();

//# sourceURL=meteor://💻app/packages/zetoff_accounts-material-ui.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvemV0b2ZmOmFjY291bnRzLW1hdGVyaWFsLXVpL2NoZWNrX25wbS5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvemV0b2ZmOmFjY291bnRzLW1hdGVyaWFsLXVpL21haW4uanN4IiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy96ZXRvZmY6YWNjb3VudHMtbWF0ZXJpYWwtdWkvZml4LmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy96ZXRvZmY6YWNjb3VudHMtbWF0ZXJpYWwtdWkvc29jaWFsX2J1dHRvbnNfY29uZmlnLmpzIl0sIm5hbWVzIjpbImNoZWNrTnBtVmVyc2lvbnMiLCJtb2R1bGUiLCJsaW5rIiwidiIsIk1hdGVyaWFsVUkiLCJyZXF1aXJlIiwiZXhwb3J0IiwiQWNjb3VudHMiLCJTVEFURVMiLCJSZWFjdCIsImRlZmF1bHQiLCJSYWlzZWRCdXR0b24iLCJGbGF0QnV0dG9uIiwiRm9udEljb24iLCJUZXh0RmllbGQiLCJEaXZpZGVyIiwiU25hY2tiYXIiLCJzb2NpYWxCdXR0b25zQ29sb3JzIiwic29jaWFsQnV0dG9uSWNvbnMiLCJncmVlbjUwMCIsInJlZDUwMCIsInllbGxvdzYwMCIsImxpZ2h0Qmx1ZTYwMCIsIkxvZ2luRm9ybSIsInVpIiwiY29tcG9uZW50V2lsbE1vdW50IiwiRm9ybSIsInJlbmRlciIsImhhc1Bhc3N3b3JkU2VydmljZSIsIm9hdXRoU2VydmljZXMiLCJmaWVsZHMiLCJidXR0b25zIiwiZXJyb3IiLCJtZXNzYWdlIiwicmVhZHkiLCJjbGFzc05hbWUiLCJmb3JtU3RhdGUiLCJwcm9wcyIsInJlZiIsImZvcm0iLCJqb2luIiwiT2JqZWN0Iiwia2V5cyIsImxlbmd0aCIsIlNJR05fSU4iLCJTSUdOX1VQIiwiQnV0dG9ucyIsIkJ1dHRvbiIsImxhYmVsIiwiaHJlZiIsInR5cGUiLCJkaXNhYmxlZCIsIm9uQ2xpY2siLCJpY29uIiwibWFyZ2luUmlnaHQiLCJGaWVsZHMiLCJtYXAiLCJpZCIsImkiLCJGaWVsZCIsImhpbnQiLCJvbkNoYW5nZSIsInJlcXVpcmVkIiwiZGVmYXVsdFZhbHVlIiwibW91bnQiLCJzdGF0ZSIsImlucHV0IiwiU29jaWFsQnV0dG9ucyIsInNlcnZpY2VDbGFzcyIsInJlcGxhY2UiLCJtYXRjaGVkIiwiYmFja2dyb3VuZCIsIkZvcm1NZXNzYWdlIiwiY29uc3RydWN0b3IiLCJvcGVuIiwiY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyIsIm5leHRQcm9wcyIsInNldFN0YXRlIiwiaGFuZGxlUmVxdWVzdENsb3NlIiwiYm9keVN0eWxlIiwiYmFja2dyb3VuZENvbG9yIiwiYmluZCIsImV4cG9ydERlZmF1bHQiLCJ0cmlnZ2VyVXBkYXRlIiwidmFsdWUiLCJ1bmRlZmluZWQiLCJ0YXJnZXQiLCJmYWNlYm9vayIsInR3aXR0ZXIiLCJnaXRodWIiLCJnb29nbGUiLCJ3ZWlibyIsInBpbnRlcmVzdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBSUEsZ0JBQUo7QUFBcUJDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLG9DQUFaLEVBQWlEO0FBQUNGLGtCQUFnQixDQUFDRyxDQUFELEVBQUc7QUFBQ0gsb0JBQWdCLEdBQUNHLENBQWpCO0FBQW1COztBQUF4QyxDQUFqRCxFQUEyRixDQUEzRjtBQUNyQkgsZ0JBQWdCLENBQUM7QUFDZixpQkFBZTtBQURBLENBQUQsRUFFYiw2QkFGYSxDQUFoQjs7QUFJQSxNQUFNSSxVQUFVLEdBQUdDLE9BQU8sQ0FBQyxhQUFELENBQTFCLEM7Ozs7Ozs7Ozs7O0FDTEFKLE1BQU0sQ0FBQ0ssTUFBUCxDQUFjO0FBQUNDLFVBQVEsRUFBQyxNQUFJQSxRQUFkO0FBQXVCQyxRQUFNLEVBQUMsTUFBSUE7QUFBbEMsQ0FBZDtBQUF5RCxJQUFJQyxLQUFKO0FBQVVSLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLE9BQVosRUFBb0I7QUFBQ1EsU0FBTyxDQUFDUCxDQUFELEVBQUc7QUFBQ00sU0FBSyxHQUFD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QUFFLE1BREw7QUFFUHZCLFNBQUssRUFBRTtBQUZBLEdBVDBCO0FBYWxDMEMsUUFBTSxFQUFFO0FBQ1BuQixjQUFVLEVBQUUsU0FETDtBQUVQdkIsU0FBSyxFQUFFO0FBRkEsR0FiMEI7QUFpQmxDLHNCQUFvQjtBQUNuQmdDLG1CQUFlLEVBQUUsU0FERTtBQUVuQmhDLFNBQUssRUFBRTtBQUZZLEdBakJjO0FBcUJsQyxZQUFVO0FBQ1R1QixjQUFVLEVBQUUsU0FESDtBQUVUdkIsU0FBSyxFQUFFO0FBRkUsR0FyQndCO0FBeUJsQzJDLE9BQUssRUFBRTtBQUNOcEIsY0FBVSxFQUFFLFNBRE47QUFFTnZCLFNBQUssRUFBRTtBQUZELEdBekIyQjtBQTZCbEM0QyxXQUFTLEVBQUU7QUFDVnJCLGNBQVUsRUFBRSxTQURGO0FBRVZ2QixTQUFLLEVBQUU7QUFGRztBQTdCdUIsQ0FBNUI7QUFtQ0EsTUFBTTlCLGlCQUFpQixHQUFHO0FBQ2hDd0UsUUFBTSxFQUFFLGFBRHdCO0FBRWhDLHNCQUFvQjtBQUZZLENBQTFCLEMiLCJmaWxlIjoiL3BhY2thZ2VzL3pldG9mZl9hY2NvdW50cy1tYXRlcmlhbC11aS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNoZWNrTnBtVmVyc2lvbnMgfSBmcm9tICdtZXRlb3IvdG1lYXNkYXk6Y2hlY2stbnBtLXZlcnNpb25zJztcbmNoZWNrTnBtVmVyc2lvbnMoe1xuICAnbWF0ZXJpYWwtdWknOiAnPj0wLjE2LngnXG59LCAnemV0b2ZmOmFjY291bnRzLW1hdGVyaWFsLXVpJyk7XG5cbmNvbnN0IE1hdGVyaWFsVUkgPSByZXF1aXJlKCdtYXRlcmlhbC11aScpO1xuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7QWNjb3VudHMsIFNUQVRFU30gZnJvbSAnLi9maXguanMnOyAvLyBUT0RPOiBiYWNrIHRvIG5vcm1hbCBvbmNlIHN0ZDphY2NvdW50cy11aSBpcyBmaXhlZFxuaW1wb3J0IHtSYWlzZWRCdXR0b24sIEZsYXRCdXR0b24sIEZvbnRJY29uLCBUZXh0RmllbGQsIERpdmlkZXIsIFNuYWNrYmFyfSBmcm9tICdtYXRlcmlhbC11aSc7XG5pbXBvcnQge3NvY2lhbEJ1dHRvbnNDb2xvcnMsIHNvY2lhbEJ1dHRvbkljb25zfSBmcm9tICcuL3NvY2lhbF9idXR0b25zX2NvbmZpZyc7XG5pbXBvcnQge2dyZWVuNTAwLCByZWQ1MDAsIHllbGxvdzYwMCwgbGlnaHRCbHVlNjAwfSBmcm9tICdtYXRlcmlhbC11aS9zdHlsZXMvY29sb3JzJztcblxuLyoqXG4gKiBGb3JtLnByb3BUeXBlcyA9IHtcbiAqICAgZmllbGRzOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gKiAgIGJ1dHRvbnM6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAqICAgZXJyb3I6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG4gKiAgIHJlYWR5OiBSZWFjdC5Qcm9wVHlwZXMuYm9vbFxuICogfTtcbiAqL1xuXG5jbGFzcyBMb2dpbkZvcm0gZXh0ZW5kcyBBY2NvdW50cy51aS5Mb2dpbkZvcm0ge1xuICBjb21wb25lbnRXaWxsTW91bnQoKSB7XG4gICAgLy8gRklYTUUgaGFjayB0byBzb2x2ZSBpc3N1ZSAjMThcbiAgfVxufVxuXG5jbGFzcyBGb3JtIGV4dGVuZHMgQWNjb3VudHMudWkuRm9ybSB7XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHtcbiAgICAgIGhhc1Bhc3N3b3JkU2VydmljZSxcbiAgICAgIG9hdXRoU2VydmljZXMsXG4gICAgICBmaWVsZHMsXG4gICAgICBidXR0b25zLFxuICAgICAgZXJyb3IsXG4gICAgICBtZXNzYWdlLFxuICAgICAgcmVhZHkgPSB0cnVlLFxuICAgICAgY2xhc3NOYW1lLFxuICAgICAgZm9ybVN0YXRlXG4gICAgfSA9IHRoaXMucHJvcHM7XG4gICAgcmV0dXJuIChcbiAgICAgIDxmb3JtXG4gICAgICAgIHJlZj17KHJlZikgPT4gdGhpcy5mb3JtID0gcmVmfVxuICAgICAgICBjbGFzc05hbWU9e1tcImFjY291bnRzXCIsIGNsYXNzTmFtZV0uam9pbignICcpfT5cbiAgICAgICAge09iamVjdC5rZXlzKGZpZWxkcykubGVuZ3RoID4gMFxuICAgICAgICAgID8gKDxBY2NvdW50cy51aS5GaWVsZHMgZmllbGRzPXtmaWVsZHN9Lz4pXG4gICAgICAgICAgOiBudWxsfVxuICAgICAgICA8QWNjb3VudHMudWkuQnV0dG9ucyBidXR0b25zPXtidXR0b25zfS8+XG4gICAgICAgIDxici8+XG4gICAgICAgIHtmb3JtU3RhdGUgPT0gU1RBVEVTLlNJR05fSU4gfHwgZm9ybVN0YXRlID09IFNUQVRFUy5TSUdOX1VQXG4gICAgICAgICAgPyAoXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm9yLXNlcFwiPlxuICAgICAgICAgICAgICA8QWNjb3VudHMudWkuUGFzc3dvcmRPclNlcnZpY2Ugb2F1dGhTZXJ2aWNlcz17b2F1dGhTZXJ2aWNlc30vPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKVxuICAgICAgICAgIDogbnVsbH1cbiAgICAgICAge2Zvcm1TdGF0ZSA9PSBTVEFURVMuU0lHTl9JTiB8fCBmb3JtU3RhdGUgPT0gU1RBVEVTLlNJR05fVVBcbiAgICAgICAgICA/ICg8QWNjb3VudHMudWkuU29jaWFsQnV0dG9ucyBvYXV0aFNlcnZpY2VzPXtvYXV0aFNlcnZpY2VzfS8+KVxuICAgICAgICAgIDogbnVsbH1cbiAgICAgICAgPGJyLz5cbiAgICAgICAgPEFjY291bnRzLnVpLkZvcm1NZXNzYWdlIHsuLi5tZXNzYWdlfS8+XG4gICAgICA8L2Zvcm0+XG4gICAgKTtcbiAgfVxufVxuXG5jbGFzcyBCdXR0b25zIGV4dGVuZHMgQWNjb3VudHMudWkuQnV0dG9ucyB7fVxuY2xhc3MgQnV0dG9uIGV4dGVuZHMgQWNjb3VudHMudWkuQnV0dG9uIHtcblx0cmVuZGVyKCkge1xuXHRcdGNvbnN0IHtcblx0XHRcdGxhYmVsLFxuXHRcdFx0aHJlZiA9IG51bGwsXG5cdFx0XHR0eXBlLFxuXHRcdFx0ZGlzYWJsZWQgPSBmYWxzZSxcblx0XHRcdG9uQ2xpY2ssXG5cdFx0XHRjbGFzc05hbWUsXG5cdFx0XHRpY29uXG5cdFx0fSA9IHRoaXMucHJvcHM7XG5cdFx0cmV0dXJuIHR5cGUgPT0gJ2xpbmsnXG5cdFx0XHQ/IChcblx0XHRcdFx0PEZsYXRCdXR0b25cblx0XHRcdFx0XHRocmVmPXtocmVmfVxuXHRcdFx0XHRcdGxhYmVsPXtsYWJlbH1cblx0XHRcdFx0XHRpY29uPXtpY29uXG5cdFx0XHRcdFx0PyA8Rm9udEljb24gY2xhc3NOYW1lPXtgZmEgJHtpY29ufWB9Lz5cblx0XHRcdFx0XHQ6IG51bGx9XG5cdFx0XHRcdFx0Y2xhc3NOYW1lPXtjbGFzc05hbWV9XG5cdFx0XHRcdFx0b25Ub3VjaFRhcD17b25DbGlja31cblx0XHRcdFx0XHRkaXNhYmxlZD17ZGlzYWJsZWR9XG5cdFx0XHRcdFx0c3R5bGU9e3ttYXJnaW5SaWdodDogJzVweCd9fVxuXHRcdFx0XHRcdC8+XG5cdFx0XHQpXG5cdFx0XHQ6IChcblx0XHRcdFx0PFJhaXNlZEJ1dHRvblxuXHRcdFx0XHRcdGxhYmVsPXtsYWJlbH1cblx0XHRcdFx0XHRpY29uPXtpY29uXG5cdFx0XHRcdFx0PyA8Rm9udEljb24gY2xhc3NOYW1lPXtgZmEgJHtpY29ufWB9Lz5cblx0XHRcdFx0XHQ6IG51bGx9XG5cdFx0XHRcdFx0cHJpbWFyeT17dHJ1ZX1cblx0XHRcdFx0XHR0eXBlPXt0eXBlfVxuXHRcdFx0XHRcdGNsYXNzTmFtZT17Y2xhc3NOYW1lfVxuXHRcdFx0XHRcdG9uVG91Y2hUYXA9e29uQ2xpY2t9XG5cdFx0XHRcdFx0ZGlzYWJsZWQ9e2Rpc2FibGVkfVxuXHRcdFx0XHRcdHN0eWxlPXt7bWFyZ2luUmlnaHQ6ICc1cHgnfX1cblx0XHRcdFx0XHQvPlxuXHRcdFx0KVxuXHR9XG59XG5jbGFzcyBGaWVsZHMgZXh0ZW5kcyBBY2NvdW50cy51aS5GaWVsZHMge1xuXHRyZW5kZXIoKSB7XG5cdFx0bGV0IHtcblx0XHRcdGZpZWxkcyA9IHt9LFxuXHRcdFx0Y2xhc3NOYW1lID0gXCJcIlxuXHRcdH0gPSB0aGlzLnByb3BzO1xuXHRcdHJldHVybiAoXG5cdFx0XHQ8ZGl2IGNsYXNzTmFtZT17W2NsYXNzTmFtZV0uam9pbignICcpfT5cblx0XHRcdFx0e09iamVjdC5rZXlzKGZpZWxkcykubWFwKChpZCwgaSkgPT4gPGRpdiBrZXk9e2l9PlxuXHRcdFx0XHRcdDxBY2NvdW50cy51aS5GaWVsZCB7Li4uZmllbGRzW2lkXX0vPlxuXHRcdFx0XHRcdDxici8+XG5cdFx0XHRcdDwvZGl2Pil9XG5cdFx0XHQ8L2Rpdj5cblx0XHQpO1xuXHR9XG59XG5jbGFzcyBGaWVsZCBleHRlbmRzIEFjY291bnRzLnVpLkZpZWxkIHtcblx0cmVuZGVyKCkge1xuXHRcdGNvbnN0IHtcblx0XHRcdGlkLFxuXHRcdFx0aGludCxcblx0XHRcdGxhYmVsLFxuXHRcdFx0dHlwZSA9ICd0ZXh0Jyxcblx0XHRcdG9uQ2hhbmdlLFxuXHRcdFx0cmVxdWlyZWQgPSBmYWxzZSxcblx0XHRcdGNsYXNzTmFtZSxcblx0XHRcdGRlZmF1bHRWYWx1ZSA9IFwiXCJcblx0XHR9ID0gdGhpcy5wcm9wcztcblx0XHRjb25zdCB7XG5cdFx0XHRtb3VudCA9IHRydWVcblx0XHR9ID0gdGhpcy5zdGF0ZTtcblx0XHRyZXR1cm4gbW91bnRcblx0XHRcdD8gKDxUZXh0RmllbGRcblx0XHRcdFx0ZmxvYXRpbmdMYWJlbFRleHQ9e2xhYmVsfVxuXHRcdFx0XHRoaW50VGV4dD17aGludH1cblx0XHRcdFx0b25DaGFuZ2U9e29uQ2hhbmdlfVxuXHRcdFx0XHRmdWxsV2lkdGg9e3RydWV9XG5cdFx0XHRcdGRlZmF1bHRWYWx1ZT17ZGVmYXVsdFZhbHVlfVxuXHRcdFx0XHRuYW1lPXtpZH1cblx0XHRcdFx0dHlwZT17dHlwZX1cblx0XHRcdFx0cmVmPXsocmVmKSA9PiB0aGlzLmlucHV0ID0gcmVmfVxuXHRcdFx0XHRyZXF1aXJlZD17cmVxdWlyZWRcblx0XHRcdFx0PyBcInJlcXVpcmVkXCJcblx0XHRcdFx0OiBcIlwifVxuXHRcdFx0XHRhdXRvQ2FwaXRhbGl6ZT17dHlwZSA9PSAnZW1haWwnXG5cdFx0XHRcdD8gJ25vbmUnXG5cdFx0XHRcdDogZmFsc2V9XG5cdFx0XHRcdGF1dG9Db3JyZWN0PVwib2ZmXCIvPilcblx0XHRcdDogbnVsbDtcblx0fVxufVxuY2xhc3MgU29jaWFsQnV0dG9ucyBleHRlbmRzIEFjY291bnRzLnVpLlNvY2lhbEJ1dHRvbnMge1xuXHRyZW5kZXIoKSB7XG5cdFx0bGV0IHtcblx0XHRcdG9hdXRoU2VydmljZXMgPSB7fSxcblx0XHRcdGNsYXNzTmFtZSA9IFwic29jaWFsLWJ1dHRvbnNcIlxuXHRcdH0gPSB0aGlzLnByb3BzO1xuXHRcdGlmIChPYmplY3Qua2V5cyhvYXV0aFNlcnZpY2VzKS5sZW5ndGggPiAwKSB7XG5cdFx0XHRyZXR1cm4gKFxuXHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT17W2NsYXNzTmFtZV0uam9pbignICcpfT5cblx0XHRcdFx0XHR7T2JqZWN0LmtleXMob2F1dGhTZXJ2aWNlcykubWFwKChpZCwgaSkgPT4ge1xuXHRcdFx0XHRcdFx0bGV0IHNlcnZpY2VDbGFzcyA9IGlkLnJlcGxhY2UoL2dvb2dsZXxtZXRlb3JcXC1kZXZlbG9wZXIvZ2ksIChtYXRjaGVkKSA9PiB7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBzb2NpYWxCdXR0b25JY29uc1ttYXRjaGVkXTtcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0Y29uc3Qge2xhYmVsLCB0eXBlLCBvbkNsaWNrLCBkaXNhYmxlZH0gPSBvYXV0aFNlcnZpY2VzW2lkXTtcblx0XHRcdFx0XHRcdHJldHVybiAoXG5cdFx0XHRcdFx0XHRcdDxSYWlzZWRCdXR0b25cblx0XHRcdFx0XHRcdFx0XHRrZXk9e2l9XG5cdFx0XHRcdFx0XHRcdFx0bGFiZWw9e2xhYmVsfVxuXHRcdFx0XHRcdFx0XHRcdHR5cGU9e3R5cGV9XG5cdFx0XHRcdFx0XHRcdFx0b25Ub3VjaFRhcD17b25DbGlja31cblx0XHRcdFx0XHRcdFx0XHRkaXNhYmxlZD17ZGlzYWJsZWR9XG5cdFx0XHRcdFx0XHRcdFx0Y2xhc3NOYW1lPXtzZXJ2aWNlQ2xhc3MubGVuZ3RoID4gMFxuXHRcdFx0XHRcdFx0XHRcdD8gYCR7c2VydmljZUNsYXNzfWBcblx0XHRcdFx0XHRcdFx0XHQ6ICcnfVxuXHRcdFx0XHRcdFx0XHRcdGljb249e3NlcnZpY2VDbGFzcy5sZW5ndGggPiAwXG5cdFx0XHRcdFx0XHRcdFx0PyA8Rm9udEljb24gY2xhc3NOYW1lPXtgZmEgZmEtJHtzZXJ2aWNlQ2xhc3N9YH0vPlxuXHRcdFx0XHRcdFx0XHRcdDogJyd9XG5cdFx0XHRcdFx0XHRcdFx0YmFja2dyb3VuZENvbG9yPXtzb2NpYWxCdXR0b25zQ29sb3JzW2lkXS5iYWNrZ3JvdW5kfVxuXHRcdFx0XHRcdFx0XHRcdGxhYmVsQ29sb3I9e3NvY2lhbEJ1dHRvbnNDb2xvcnNbaWRdLmxhYmVsfVxuXHRcdFx0XHRcdFx0XHRcdHN0eWxlPXt7bWFyZ2luUmlnaHQ6ICc1cHgnfX1cblx0XHRcdFx0XHRcdFx0XHQvPlxuXHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHR9KX1cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHQpXG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH1cblxuXHR9XG59XG5cblxuXG5jbGFzcyBGb3JtTWVzc2FnZSBleHRlbmRzIEFjY291bnRzLnVpLkZvcm1NZXNzYWdlIHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIG9wZW46IGZhbHNlXG4gICAgfTtcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzKSB7XG4gICAgaWYgKG5leHRQcm9wcy5tZXNzYWdlKSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtvcGVuOiB0cnVlfSk7XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlUmVxdWVzdENsb3NlKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe29wZW46IGZhbHNlfSk7XG4gIH07XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHttZXNzYWdlLCB0eXBlfSA9IHRoaXMucHJvcHM7XG4gICAgbGV0IGJvZHlTdHlsZTtcbiAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgIGNhc2UgJ3dhcm5pbmcnOlxuICAgICAgICBib2R5U3R5bGUgPSB7XG4gICAgICAgICAgYmFja2dyb3VuZENvbG9yOiB5ZWxsb3c2MDBcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3N1Y2Nlc3MnOlxuICAgICAgICBib2R5U3R5bGUgPSB7XG4gICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBncmVlbjUwMFxuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnZXJyb3InOlxuICAgICAgICBib2R5U3R5bGUgPSB7XG4gICAgICAgICAgYmFja2dyb3VuZENvbG9yOiByZWQ1MDBcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2luZm8nOlxuICAgICAgICBib2R5U3R5bGUgPSB7XG4gICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBsaWdodEJsdWU2MDBcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICByZXR1cm4gbWVzc2FnZVxuICAgICAgPyAoPFNuYWNrYmFyXG4gICAgICAgIG9wZW49e3RoaXMuc3RhdGUub3Blbn1cbiAgICAgICAgbWVzc2FnZT17bWVzc2FnZX1cbiAgICAgICAgYm9keVN0eWxlPXtib2R5U3R5bGV9XG4gICAgICAgIGFjdGlvbj1cIk9LXCJcbiAgICAgICAgYXV0b0hpZGVEdXJhdGlvbj17NDAwMH1cbiAgICAgICAgb25BY3Rpb25Ub3VjaFRhcD17dGhpcy5oYW5kbGVSZXF1ZXN0Q2xvc2UuYmluZCh0aGlzKX1cbiAgICAgICAgb25SZXF1ZXN0Q2xvc2U9e3RoaXMuaGFuZGxlUmVxdWVzdENsb3NlLmJpbmQodGhpcyl9Lz4pXG4gICAgICA6IG51bGw7XG4gIH1cbn1cblxuLy8gTm90aWNlISBBY2NvdW50cy51aS5Mb2dpbkZvcm0gbWFuYWdlcyBhbGwgc3RhdGUgbG9naWMgYXQgdGhlIG1vbWVudCwgc28gYXZvaWQgb3ZlcndyaXRpbmcgdGhpc1xuLy8gb25lLCBidXQgaGF2ZSBhIGxvb2sgYXQgaXQgYW5kIGxlYXJuIGhvdyBpdCB3b3Jrcy4gQW5kIHB1bGwgcmVxdWVzdHMgYWx0ZXJpbmcgaG93IHRoYXQgd29ya3MgYXJlXG4vLyB3ZWxjb21lLiBBbHRlciBwcm92aWRlZCBkZWZhdWx0IHVuc3R5bGVkIFVJLlxuQWNjb3VudHMudWkuTG9naW5Gb3JtID0gTG9naW5Gb3JtO1xuQWNjb3VudHMudWkuRm9ybSA9IEZvcm07XG5BY2NvdW50cy51aS5CdXR0b25zID0gQnV0dG9ucztcbkFjY291bnRzLnVpLkJ1dHRvbiA9IEJ1dHRvbjtcbkFjY291bnRzLnVpLkZpZWxkcyA9IEZpZWxkcztcbkFjY291bnRzLnVpLkZpZWxkID0gRmllbGQ7XG5BY2NvdW50cy51aS5Gb3JtTWVzc2FnZSA9IEZvcm1NZXNzYWdlO1xuQWNjb3VudHMudWkuU29jaWFsQnV0dG9ucyA9IFNvY2lhbEJ1dHRvbnM7XG5cbi8vIEV4cG9ydCB0aGUgdGhlbWVkIHZlcnNpb24uXG5leHBvcnQge0FjY291bnRzLCBTVEFURVN9O1xuZXhwb3J0IGRlZmF1bHQgQWNjb3VudHM7XG4iLCIvLyBLZWVwIHRoaXMgdW50aWwgaXNzdWUgd2l0aCBzdGQ6YWNjb3VudC11aSBpcyBmaXhlZFxuLy8gaHR0cHM6Ly9naXRodWIuY29tL3N0dWRpb2ludGVyYWN0L2FjY291bnRzLXVpL2lzc3Vlcy82MFxuXG5pbXBvcnQge0FjY291bnRzLCBTVEFURVN9IGZyb20gJ21ldGVvci9zdGQ6YWNjb3VudHMtdWknO1xuXG5jbGFzcyBGaWVsZCBleHRlbmRzIEFjY291bnRzLnVpLkZpZWxkIHtcbiAgdHJpZ2dlclVwZGF0ZSgpIHtcbiAgXHRcdGNvbnN0IHtvbkNoYW5nZX0gPSB0aGlzLnByb3BzO1xuICAgICAgbGV0IHZhbHVlO1xuICBcdFx0aWYodGhpcy5pbnB1dCkge1xuICAgICAgICB2YWx1ZSA9IHRoaXMuaW5wdXQudmFsdWU7XG4gICAgICB9XG4gIFx0XHRpZiAodmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICBcdFx0XHR2YWx1ZSA9ICcnO1xuICBcdFx0fSBlbHNlIHtcbiAgXHRcdFx0Ly8gZG8gbm90aGluZ1xuICBcdFx0fVxuXG4gIFx0XHRpZiAodGhpcy5pbnB1dCkge1xuICBcdFx0XHRvbkNoYW5nZSh7dGFyZ2V0OiB7XG4gIFx0XHRcdFx0XHR2YWx1ZVxuICBcdFx0XHRcdH19KVxuICBcdFx0fVxuICBcdH1cbn1cblxuQWNjb3VudHMudWkuRmllbGQgPSBGaWVsZDtcblxuZXhwb3J0IHsgQWNjb3VudHMsIFNUQVRFUyB9XG5leHBvcnQgZGVmYXVsdCBBY2NvdW50c1xuIiwiZXhwb3J0IGNvbnN0IHNvY2lhbEJ1dHRvbnNDb2xvcnMgPSB7XG5cdGZhY2Vib29rOiB7XG5cdFx0YmFja2dyb3VuZDogJyMzYjU5OTgnLFxuXHRcdGxhYmVsOiAnI2ZmZidcblx0fSxcblx0dHdpdHRlcjoge1xuXHRcdGJhY2tncm91bmQ6ICcjNTVhY2VlJyxcblx0XHRsYWJlbDogJyNmZmYnXG5cdH0sXG5cdGdpdGh1Yjoge1xuXHRcdGJhY2tncm91bmQ6ICcjMDAwJyxcblx0XHRsYWJlbDogJyNmZmYnXG5cdH0sXG5cdGdvb2dsZToge1xuXHRcdGJhY2tncm91bmQ6ICcjZGQ0YjM5Jyxcblx0XHRsYWJlbDogJyNmZmYnXG5cdH0sXG5cdCdtZXRlb3ItZGV2ZWxvcGVyJzoge1xuXHRcdGJhY2tncm91bmRDb2xvcjogJyNiYjAwMDAnLFxuXHRcdGxhYmVsOiAnI2ZmZidcblx0fSxcblx0J21lZXR1cCc6IHtcblx0XHRiYWNrZ3JvdW5kOiAnI0VEMUM0MCcsXG5cdFx0bGFiZWw6ICcjZmZmJ1xuXHR9LFxuXHR3ZWlibzoge1xuXHRcdGJhY2tncm91bmQ6ICcjZmFmNmYxJyxcblx0XHRsYWJlbDogJyMwMDAnXG5cdH0sXG5cdHBpbnRlcmVzdDoge1xuXHRcdGJhY2tncm91bmQ6ICcjYmQwODFjJyxcblx0XHRsYWJlbDogJyNmZmYnXG5cdH1cbn1cblxuZXhwb3J0IGNvbnN0IHNvY2lhbEJ1dHRvbkljb25zID0ge1xuXHRnb29nbGU6IFwiZ29vZ2xlLXBsdXNcIixcblx0XCJtZXRlb3ItZGV2ZWxvcGVyXCI6IFwicm9ja2V0XCJcbn07XG4iXX0=
