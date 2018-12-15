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
      disabled: disabled,
      onClick: onClick,
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
      disabled: disabled,
      onClick: onClick,
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
      autoCapitalize: type == 'email' ? "false" : "true",
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvemV0b2ZmOmFjY291bnRzLW1hdGVyaWFsLXVpL2NoZWNrX25wbS5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvemV0b2ZmOmFjY291bnRzLW1hdGVyaWFsLXVpL21haW4uanN4IiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy96ZXRvZmY6YWNjb3VudHMtbWF0ZXJpYWwtdWkvZml4LmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy96ZXRvZmY6YWNjb3VudHMtbWF0ZXJpYWwtdWkvc29jaWFsX2J1dHRvbnNfY29uZmlnLmpzIl0sIm5hbWVzIjpbImNoZWNrTnBtVmVyc2lvbnMiLCJtb2R1bGUiLCJsaW5rIiwidiIsIk1hdGVyaWFsVUkiLCJyZXF1aXJlIiwiZXhwb3J0IiwiQWNjb3VudHMiLCJTVEFURVMiLCJSZWFjdCIsImRlZmF1bHQiLCJSYWlzZWRCdXR0b24iLCJGbGF0QnV0dG9uIiwiRm9udEljb24iLCJUZXh0RmllbGQiLCJEaXZpZGVyIiwiU25hY2tiYXIiLCJzb2NpYWxCdXR0b25zQ29sb3JzIiwic29jaWFsQnV0dG9uSWNvbnMiLCJncmVlbjUwMCIsInJlZDUwMCIsInllbGxvdzYwMCIsImxpZ2h0Qmx1ZTYwMCIsIkxvZ2luRm9ybSIsInVpIiwiY29tcG9uZW50V2lsbE1vdW50IiwiRm9ybSIsInJlbmRlciIsImhhc1Bhc3N3b3JkU2VydmljZSIsIm9hdXRoU2VydmljZXMiLCJmaWVsZHMiLCJidXR0b25zIiwiZXJyb3IiLCJtZXNzYWdlIiwicmVhZHkiLCJjbGFzc05hbWUiLCJmb3JtU3RhdGUiLCJwcm9wcyIsInJlZiIsImZvcm0iLCJqb2luIiwiT2JqZWN0Iiwia2V5cyIsImxlbmd0aCIsIlNJR05fSU4iLCJTSUdOX1VQIiwiQnV0dG9ucyIsIkJ1dHRvbiIsImxhYmVsIiwiaHJlZiIsInR5cGUiLCJkaXNhYmxlZCIsIm9uQ2xpY2siLCJpY29uIiwibWFyZ2luUmlnaHQiLCJGaWVsZHMiLCJtYXAiLCJpZCIsImkiLCJGaWVsZCIsImhpbnQiLCJvbkNoYW5nZSIsInJlcXVpcmVkIiwiZGVmYXVsdFZhbHVlIiwibW91bnQiLCJzdGF0ZSIsImlucHV0IiwiU29jaWFsQnV0dG9ucyIsInNlcnZpY2VDbGFzcyIsInJlcGxhY2UiLCJtYXRjaGVkIiwiYmFja2dyb3VuZCIsIkZvcm1NZXNzYWdlIiwiY29uc3RydWN0b3IiLCJvcGVuIiwiY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyIsIm5leHRQcm9wcyIsInNldFN0YXRlIiwiaGFuZGxlUmVxdWVzdENsb3NlIiwiYm9keVN0eWxlIiwiYmFja2dyb3VuZENvbG9yIiwiYmluZCIsImV4cG9ydERlZmF1bHQiLCJ0cmlnZ2VyVXBkYXRlIiwidmFsdWUiLCJ1bmRlZmluZWQiLCJ0YXJnZXQiLCJmYWNlYm9vayIsInR3aXR0ZXIiLCJnaXRodWIiLCJnb29nbGUiLCJ3ZWlibyIsInBpbnRlcmVzdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBSUEsZ0JBQUo7QUFBcUJDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLG9DQUFaLEVBQWlEO0FBQUNGLGtCQUFnQixDQUFDRyxDQUFELEVBQUc7QUFBQ0gsb0JBQWdCLEdBQUNHLENBQWpCO0FBQW1COztBQUF4QyxDQUFqRCxFQUEyRixDQUEzRjtBQUNyQkgsZ0JBQWdCLENBQUM7QUFDZixpQkFBZTtBQURBLENBQUQsRUFFYiw2QkFGYSxDQUFoQjs7QUFJQSxNQUFNSSxVQUFVLEdBQUdDLE9BQU8sQ0FBQyxhQUFELENBQTFCLEM7Ozs7Ozs7Ozs7O0FDTEFKLE1BQU0sQ0FBQ0ssTUFBUCxDQUFjO0FBQUNDLFVBQVEsRUFBQyxNQUFJQSxRQUFkO0FBQXVCQyxRQUFNLEVBQUMsTUFBSUE7QUFBbEMsQ0FBZDtBQUF5RCxJQUFJQyxLQUFKO0FBQVVSLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLE9BQVosRUFBb0I7QUFBQ1EsU0FBTyxDQUFDUCxDQUFELEVBQUc7QUFBQ00sU0FBSyxHQUFD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QUVQdkIsU0FBSyxFQUFFO0FBRkEsR0FiMEI7QUFpQmxDLHNCQUFvQjtBQUNuQmdDLG1CQUFlLEVBQUUsU0FERTtBQUVuQmhDLFNBQUssRUFBRTtBQUZZLEdBakJjO0FBcUJsQyxZQUFVO0FBQ1R1QixjQUFVLEVBQUUsU0FESDtBQUVUdkIsU0FBSyxFQUFFO0FBRkUsR0FyQndCO0FBeUJsQzJDLE9BQUssRUFBRTtBQUNOcEIsY0FBVSxFQUFFLFNBRE47QUFFTnZCLFNBQUssRUFBRTtBQUZELEdBekIyQjtBQTZCbEM0QyxXQUFTLEVBQUU7QUFDVnJCLGNBQVUsRUFBRSxTQURGO0FBRVZ2QixTQUFLLEVBQUU7QUFGRztBQTdCdUIsQ0FBNUI7QUFtQ0EsTUFBTTlCLGlCQUFpQixHQUFHO0FBQ2hDd0UsUUFBTSxFQUFFLGFBRHdCO0FBRWhDLHNCQUFvQjtBQUZZLENBQTFCLEMiLCJmaWxlIjoiL3BhY2thZ2VzL3pldG9mZl9hY2NvdW50cy1tYXRlcmlhbC11aS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNoZWNrTnBtVmVyc2lvbnMgfSBmcm9tICdtZXRlb3IvdG1lYXNkYXk6Y2hlY2stbnBtLXZlcnNpb25zJztcbmNoZWNrTnBtVmVyc2lvbnMoe1xuICAnbWF0ZXJpYWwtdWknOiAnPj0wLjE2LngnXG59LCAnemV0b2ZmOmFjY291bnRzLW1hdGVyaWFsLXVpJyk7XG5cbmNvbnN0IE1hdGVyaWFsVUkgPSByZXF1aXJlKCdtYXRlcmlhbC11aScpO1xuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7QWNjb3VudHMsIFNUQVRFU30gZnJvbSAnLi9maXguanMnOyAvLyBUT0RPOiBiYWNrIHRvIG5vcm1hbCBvbmNlIHN0ZDphY2NvdW50cy11aSBpcyBmaXhlZFxuaW1wb3J0IHtSYWlzZWRCdXR0b24sIEZsYXRCdXR0b24sIEZvbnRJY29uLCBUZXh0RmllbGQsIERpdmlkZXIsIFNuYWNrYmFyfSBmcm9tICdtYXRlcmlhbC11aSc7XG5pbXBvcnQge3NvY2lhbEJ1dHRvbnNDb2xvcnMsIHNvY2lhbEJ1dHRvbkljb25zfSBmcm9tICcuL3NvY2lhbF9idXR0b25zX2NvbmZpZyc7XG5pbXBvcnQge2dyZWVuNTAwLCByZWQ1MDAsIHllbGxvdzYwMCwgbGlnaHRCbHVlNjAwfSBmcm9tICdtYXRlcmlhbC11aS9zdHlsZXMvY29sb3JzJztcblxuLyoqXG4gKiBGb3JtLnByb3BUeXBlcyA9IHtcbiAqICAgZmllbGRzOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gKiAgIGJ1dHRvbnM6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAqICAgZXJyb3I6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG4gKiAgIHJlYWR5OiBSZWFjdC5Qcm9wVHlwZXMuYm9vbFxuICogfTtcbiAqL1xuXG5jbGFzcyBMb2dpbkZvcm0gZXh0ZW5kcyBBY2NvdW50cy51aS5Mb2dpbkZvcm0ge1xuICBjb21wb25lbnRXaWxsTW91bnQoKSB7XG4gICAgLy8gRklYTUUgaGFjayB0byBzb2x2ZSBpc3N1ZSAjMThcbiAgfVxufVxuXG5jbGFzcyBGb3JtIGV4dGVuZHMgQWNjb3VudHMudWkuRm9ybSB7XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHtcbiAgICAgIGhhc1Bhc3N3b3JkU2VydmljZSxcbiAgICAgIG9hdXRoU2VydmljZXMsXG4gICAgICBmaWVsZHMsXG4gICAgICBidXR0b25zLFxuICAgICAgZXJyb3IsXG4gICAgICBtZXNzYWdlLFxuICAgICAgcmVhZHkgPSB0cnVlLFxuICAgICAgY2xhc3NOYW1lLFxuICAgICAgZm9ybVN0YXRlXG4gICAgfSA9IHRoaXMucHJvcHM7XG4gICAgcmV0dXJuIChcbiAgICAgIDxmb3JtXG4gICAgICAgIHJlZj17KHJlZikgPT4gdGhpcy5mb3JtID0gcmVmfVxuICAgICAgICBjbGFzc05hbWU9e1tcImFjY291bnRzXCIsIGNsYXNzTmFtZV0uam9pbignICcpfT5cbiAgICAgICAge09iamVjdC5rZXlzKGZpZWxkcykubGVuZ3RoID4gMFxuICAgICAgICAgID8gKDxBY2NvdW50cy51aS5GaWVsZHMgZmllbGRzPXtmaWVsZHN9Lz4pXG4gICAgICAgICAgOiBudWxsfVxuICAgICAgICA8QWNjb3VudHMudWkuQnV0dG9ucyBidXR0b25zPXtidXR0b25zfS8+XG4gICAgICAgIDxici8+XG4gICAgICAgIHtmb3JtU3RhdGUgPT0gU1RBVEVTLlNJR05fSU4gfHwgZm9ybVN0YXRlID09IFNUQVRFUy5TSUdOX1VQXG4gICAgICAgICAgPyAoXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm9yLXNlcFwiPlxuICAgICAgICAgICAgICA8QWNjb3VudHMudWkuUGFzc3dvcmRPclNlcnZpY2Ugb2F1dGhTZXJ2aWNlcz17b2F1dGhTZXJ2aWNlc30vPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKVxuICAgICAgICAgIDogbnVsbH1cbiAgICAgICAge2Zvcm1TdGF0ZSA9PSBTVEFURVMuU0lHTl9JTiB8fCBmb3JtU3RhdGUgPT0gU1RBVEVTLlNJR05fVVBcbiAgICAgICAgICA/ICg8QWNjb3VudHMudWkuU29jaWFsQnV0dG9ucyBvYXV0aFNlcnZpY2VzPXtvYXV0aFNlcnZpY2VzfS8+KVxuICAgICAgICAgIDogbnVsbH1cbiAgICAgICAgPGJyLz5cbiAgICAgICAgPEFjY291bnRzLnVpLkZvcm1NZXNzYWdlIHsuLi5tZXNzYWdlfS8+XG4gICAgICA8L2Zvcm0+XG4gICAgKTtcbiAgfVxufVxuXG5jbGFzcyBCdXR0b25zIGV4dGVuZHMgQWNjb3VudHMudWkuQnV0dG9ucyB7fVxuY2xhc3MgQnV0dG9uIGV4dGVuZHMgQWNjb3VudHMudWkuQnV0dG9uIHtcblx0cmVuZGVyKCkge1xuXHRcdGNvbnN0IHtcblx0XHRcdGxhYmVsLFxuXHRcdFx0aHJlZiA9IG51bGwsXG5cdFx0XHR0eXBlLFxuXHRcdFx0ZGlzYWJsZWQgPSBmYWxzZSxcblx0XHRcdG9uQ2xpY2ssXG5cdFx0XHRjbGFzc05hbWUsXG5cdFx0XHRpY29uXG5cdFx0fSA9IHRoaXMucHJvcHM7XG5cdFx0cmV0dXJuIHR5cGUgPT0gJ2xpbmsnXG5cdFx0XHQ/IChcblx0XHRcdFx0PEZsYXRCdXR0b25cblx0XHRcdFx0XHRocmVmPXtocmVmfVxuXHRcdFx0XHRcdGxhYmVsPXtsYWJlbH1cblx0XHRcdFx0XHRpY29uPXtpY29uXG5cdFx0XHRcdFx0PyA8Rm9udEljb24gY2xhc3NOYW1lPXtgZmEgJHtpY29ufWB9Lz5cblx0XHRcdFx0XHQ6IG51bGx9XG5cdFx0XHRcdFx0Y2xhc3NOYW1lPXtjbGFzc05hbWV9XG5cdFx0XHRcdFx0ZGlzYWJsZWQ9e2Rpc2FibGVkfVxuICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsgb25DbGljayB9XG5cdFx0XHRcdFx0c3R5bGU9e3ttYXJnaW5SaWdodDogJzVweCd9fVxuXHRcdFx0XHRcdC8+XG5cdFx0XHQpXG5cdFx0XHQ6IChcblx0XHRcdFx0PFJhaXNlZEJ1dHRvblxuXHRcdFx0XHRcdGxhYmVsPXtsYWJlbH1cblx0XHRcdFx0XHRpY29uPXtpY29uXG5cdFx0XHRcdFx0PyA8Rm9udEljb24gY2xhc3NOYW1lPXtgZmEgJHtpY29ufWB9Lz5cblx0XHRcdFx0XHQ6IG51bGx9XG5cdFx0XHRcdFx0cHJpbWFyeT17dHJ1ZX1cblx0XHRcdFx0XHR0eXBlPXt0eXBlfVxuXHRcdFx0XHRcdGNsYXNzTmFtZT17Y2xhc3NOYW1lfVxuXHRcdFx0XHRcdGRpc2FibGVkPXtkaXNhYmxlZH1cbiAgICAgICAgICAgICAgICAgICAgb25DbGljaz17IG9uQ2xpY2sgfVxuXHRcdFx0XHRcdHN0eWxlPXt7bWFyZ2luUmlnaHQ6ICc1cHgnfX1cblx0XHRcdFx0XHQvPlxuXHRcdFx0KVxuXHR9XG59XG5jbGFzcyBGaWVsZHMgZXh0ZW5kcyBBY2NvdW50cy51aS5GaWVsZHMge1xuXHRyZW5kZXIoKSB7XG5cdFx0bGV0IHtcblx0XHRcdGZpZWxkcyA9IHt9LFxuXHRcdFx0Y2xhc3NOYW1lID0gXCJcIlxuXHRcdH0gPSB0aGlzLnByb3BzO1xuXHRcdHJldHVybiAoXG5cdFx0XHQ8ZGl2IGNsYXNzTmFtZT17W2NsYXNzTmFtZV0uam9pbignICcpfT5cblx0XHRcdFx0e09iamVjdC5rZXlzKGZpZWxkcykubWFwKChpZCwgaSkgPT4gPGRpdiBrZXk9e2l9PlxuXHRcdFx0XHRcdDxBY2NvdW50cy51aS5GaWVsZCB7Li4uZmllbGRzW2lkXX0vPlxuXHRcdFx0XHRcdDxici8+XG5cdFx0XHRcdDwvZGl2Pil9XG5cdFx0XHQ8L2Rpdj5cblx0XHQpO1xuXHR9XG59XG5jbGFzcyBGaWVsZCBleHRlbmRzIEFjY291bnRzLnVpLkZpZWxkIHtcblx0cmVuZGVyKCkge1xuXHRcdGNvbnN0IHtcblx0XHRcdGlkLFxuXHRcdFx0aGludCxcblx0XHRcdGxhYmVsLFxuXHRcdFx0dHlwZSA9ICd0ZXh0Jyxcblx0XHRcdG9uQ2hhbmdlLFxuXHRcdFx0cmVxdWlyZWQgPSBmYWxzZSxcblx0XHRcdGNsYXNzTmFtZSxcblx0XHRcdGRlZmF1bHRWYWx1ZSA9IFwiXCJcblx0XHR9ID0gdGhpcy5wcm9wcztcblx0XHRjb25zdCB7XG5cdFx0XHRtb3VudCA9IHRydWVcblx0XHR9ID0gdGhpcy5zdGF0ZTtcblx0XHRyZXR1cm4gbW91bnRcblx0XHRcdD8gKDxUZXh0RmllbGRcblx0XHRcdFx0ZmxvYXRpbmdMYWJlbFRleHQ9e2xhYmVsfVxuXHRcdFx0XHRoaW50VGV4dD17aGludH1cblx0XHRcdFx0b25DaGFuZ2U9e29uQ2hhbmdlfVxuXHRcdFx0XHRmdWxsV2lkdGg9e3RydWV9XG5cdFx0XHRcdGRlZmF1bHRWYWx1ZT17ZGVmYXVsdFZhbHVlfVxuXHRcdFx0XHRuYW1lPXtpZH1cblx0XHRcdFx0dHlwZT17dHlwZX1cblx0XHRcdFx0cmVmPXsocmVmKSA9PiB0aGlzLmlucHV0ID0gcmVmfVxuXHRcdFx0XHRyZXF1aXJlZD17cmVxdWlyZWRcblx0XHRcdFx0PyBcInJlcXVpcmVkXCJcblx0XHRcdFx0OiBcIlwifVxuXHRcdFx0XHRhdXRvQ2FwaXRhbGl6ZT17dHlwZSA9PSAnZW1haWwnPyBcImZhbHNlXCI6IFwidHJ1ZVwifVxuXHRcdFx0XHRhdXRvQ29ycmVjdD1cIm9mZlwiLz4pXG5cdFx0XHQ6IG51bGw7XG5cdH1cbn1cbmNsYXNzIFNvY2lhbEJ1dHRvbnMgZXh0ZW5kcyBBY2NvdW50cy51aS5Tb2NpYWxCdXR0b25zIHtcblx0cmVuZGVyKCkge1xuXHRcdGxldCB7XG5cdFx0XHRvYXV0aFNlcnZpY2VzID0ge30sXG5cdFx0XHRjbGFzc05hbWUgPSBcInNvY2lhbC1idXR0b25zXCJcblx0XHR9ID0gdGhpcy5wcm9wcztcblx0XHRpZiAoT2JqZWN0LmtleXMob2F1dGhTZXJ2aWNlcykubGVuZ3RoID4gMCkge1xuXHRcdFx0cmV0dXJuIChcblx0XHRcdFx0PGRpdiBjbGFzc05hbWU9e1tjbGFzc05hbWVdLmpvaW4oJyAnKX0+XG5cdFx0XHRcdFx0e09iamVjdC5rZXlzKG9hdXRoU2VydmljZXMpLm1hcCgoaWQsIGkpID0+IHtcblx0XHRcdFx0XHRcdGxldCBzZXJ2aWNlQ2xhc3MgPSBpZC5yZXBsYWNlKC9nb29nbGV8bWV0ZW9yXFwtZGV2ZWxvcGVyL2dpLCAobWF0Y2hlZCkgPT4ge1xuXHRcdFx0XHRcdFx0XHRyZXR1cm4gc29jaWFsQnV0dG9uSWNvbnNbbWF0Y2hlZF07XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdGNvbnN0IHtsYWJlbCwgdHlwZSwgb25DbGljaywgZGlzYWJsZWR9ID0gb2F1dGhTZXJ2aWNlc1tpZF07XG5cdFx0XHRcdFx0XHRyZXR1cm4gKFxuXHRcdFx0XHRcdFx0XHQ8UmFpc2VkQnV0dG9uXG5cdFx0XHRcdFx0XHRcdFx0a2V5PXtpfVxuXHRcdFx0XHRcdFx0XHRcdGxhYmVsPXtsYWJlbH1cblx0XHRcdFx0XHRcdFx0XHR0eXBlPXt0eXBlfVxuXHRcdFx0XHRcdFx0XHRcdGRpc2FibGVkPXtkaXNhYmxlZH1cblx0XHRcdFx0XHRcdFx0XHRjbGFzc05hbWU9e3NlcnZpY2VDbGFzcy5sZW5ndGggPiAwXG5cdFx0XHRcdFx0XHRcdFx0PyBgJHtzZXJ2aWNlQ2xhc3N9YFxuXHRcdFx0XHRcdFx0XHRcdDogJyd9XG5cdFx0XHRcdFx0XHRcdFx0aWNvbj17c2VydmljZUNsYXNzLmxlbmd0aCA+IDBcblx0XHRcdFx0XHRcdFx0XHQ/IDxGb250SWNvbiBjbGFzc05hbWU9e2BmYSBmYS0ke3NlcnZpY2VDbGFzc31gfS8+XG5cdFx0XHRcdFx0XHRcdFx0OiAnJ31cblx0XHRcdFx0XHRcdFx0XHRiYWNrZ3JvdW5kQ29sb3I9e3NvY2lhbEJ1dHRvbnNDb2xvcnNbaWRdLmJhY2tncm91bmR9XG5cdFx0XHRcdFx0XHRcdFx0bGFiZWxDb2xvcj17c29jaWFsQnV0dG9uc0NvbG9yc1tpZF0ubGFiZWx9XG5cdFx0XHRcdFx0XHRcdFx0c3R5bGU9e3ttYXJnaW5SaWdodDogJzVweCd9fVxuXHRcdFx0XHRcdFx0XHRcdC8+XG5cdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdH0pfVxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdClcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fVxuXG5cdH1cbn1cblxuXG5cbmNsYXNzIEZvcm1NZXNzYWdlIGV4dGVuZHMgQWNjb3VudHMudWkuRm9ybU1lc3NhZ2Uge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgb3BlbjogZmFsc2VcbiAgICB9O1xuICB9XG5cbiAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHMpIHtcbiAgICBpZiAobmV4dFByb3BzLm1lc3NhZ2UpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe29wZW46IHRydWV9KTtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVSZXF1ZXN0Q2xvc2UoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7b3BlbjogZmFsc2V9KTtcbiAgfTtcblxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qge21lc3NhZ2UsIHR5cGV9ID0gdGhpcy5wcm9wcztcbiAgICBsZXQgYm9keVN0eWxlO1xuICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgY2FzZSAnd2FybmluZyc6XG4gICAgICAgIGJvZHlTdHlsZSA9IHtcbiAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IHllbGxvdzYwMFxuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnc3VjY2Vzcyc6XG4gICAgICAgIGJvZHlTdHlsZSA9IHtcbiAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IGdyZWVuNTAwXG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdlcnJvcic6XG4gICAgICAgIGJvZHlTdHlsZSA9IHtcbiAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IHJlZDUwMFxuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnaW5mbyc6XG4gICAgICAgIGJvZHlTdHlsZSA9IHtcbiAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IGxpZ2h0Qmx1ZTYwMFxuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIHJldHVybiBtZXNzYWdlXG4gICAgICA/ICg8U25hY2tiYXJcbiAgICAgICAgb3Blbj17dGhpcy5zdGF0ZS5vcGVufVxuICAgICAgICBtZXNzYWdlPXttZXNzYWdlfVxuICAgICAgICBib2R5U3R5bGU9e2JvZHlTdHlsZX1cbiAgICAgICAgYWN0aW9uPVwiT0tcIlxuICAgICAgICBhdXRvSGlkZUR1cmF0aW9uPXs0MDAwfVxuICAgICAgICBvblJlcXVlc3RDbG9zZT17dGhpcy5oYW5kbGVSZXF1ZXN0Q2xvc2UuYmluZCh0aGlzKX0vPilcbiAgICAgIDogbnVsbDtcbiAgfVxufVxuXG4vLyBOb3RpY2UhIEFjY291bnRzLnVpLkxvZ2luRm9ybSBtYW5hZ2VzIGFsbCBzdGF0ZSBsb2dpYyBhdCB0aGUgbW9tZW50LCBzbyBhdm9pZCBvdmVyd3JpdGluZyB0aGlzXG4vLyBvbmUsIGJ1dCBoYXZlIGEgbG9vayBhdCBpdCBhbmQgbGVhcm4gaG93IGl0IHdvcmtzLiBBbmQgcHVsbCByZXF1ZXN0cyBhbHRlcmluZyBob3cgdGhhdCB3b3JrcyBhcmVcbi8vIHdlbGNvbWUuIEFsdGVyIHByb3ZpZGVkIGRlZmF1bHQgdW5zdHlsZWQgVUkuXG5BY2NvdW50cy51aS5Mb2dpbkZvcm0gPSBMb2dpbkZvcm07XG5BY2NvdW50cy51aS5Gb3JtID0gRm9ybTtcbkFjY291bnRzLnVpLkJ1dHRvbnMgPSBCdXR0b25zO1xuQWNjb3VudHMudWkuQnV0dG9uID0gQnV0dG9uO1xuQWNjb3VudHMudWkuRmllbGRzID0gRmllbGRzO1xuQWNjb3VudHMudWkuRmllbGQgPSBGaWVsZDtcbkFjY291bnRzLnVpLkZvcm1NZXNzYWdlID0gRm9ybU1lc3NhZ2U7XG5BY2NvdW50cy51aS5Tb2NpYWxCdXR0b25zID0gU29jaWFsQnV0dG9ucztcblxuLy8gRXhwb3J0IHRoZSB0aGVtZWQgdmVyc2lvbi5cbmV4cG9ydCB7QWNjb3VudHMsIFNUQVRFU307XG5leHBvcnQgZGVmYXVsdCBBY2NvdW50cztcbiIsIi8vIEtlZXAgdGhpcyB1bnRpbCBpc3N1ZSB3aXRoIHN0ZDphY2NvdW50LXVpIGlzIGZpeGVkXG4vLyBodHRwczovL2dpdGh1Yi5jb20vc3R1ZGlvaW50ZXJhY3QvYWNjb3VudHMtdWkvaXNzdWVzLzYwXG5cbmltcG9ydCB7QWNjb3VudHMsIFNUQVRFU30gZnJvbSAnbWV0ZW9yL3N0ZDphY2NvdW50cy11aSc7XG5cbmNsYXNzIEZpZWxkIGV4dGVuZHMgQWNjb3VudHMudWkuRmllbGQge1xuICB0cmlnZ2VyVXBkYXRlKCkge1xuICBcdFx0Y29uc3Qge29uQ2hhbmdlfSA9IHRoaXMucHJvcHM7XG4gICAgICBsZXQgdmFsdWU7XG4gIFx0XHRpZih0aGlzLmlucHV0KSB7XG4gICAgICAgIHZhbHVlID0gdGhpcy5pbnB1dC52YWx1ZTtcbiAgICAgIH1cbiAgXHRcdGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gIFx0XHRcdHZhbHVlID0gJyc7XG4gIFx0XHR9IGVsc2Uge1xuICBcdFx0XHQvLyBkbyBub3RoaW5nXG4gIFx0XHR9XG5cbiAgXHRcdGlmICh0aGlzLmlucHV0KSB7XG4gIFx0XHRcdG9uQ2hhbmdlKHt0YXJnZXQ6IHtcbiAgXHRcdFx0XHRcdHZhbHVlXG4gIFx0XHRcdFx0fX0pXG4gIFx0XHR9XG4gIFx0fVxufVxuXG5BY2NvdW50cy51aS5GaWVsZCA9IEZpZWxkO1xuXG5leHBvcnQgeyBBY2NvdW50cywgU1RBVEVTIH1cbmV4cG9ydCBkZWZhdWx0IEFjY291bnRzXG4iLCJleHBvcnQgY29uc3Qgc29jaWFsQnV0dG9uc0NvbG9ycyA9IHtcblx0ZmFjZWJvb2s6IHtcblx0XHRiYWNrZ3JvdW5kOiAnIzNiNTk5OCcsXG5cdFx0bGFiZWw6ICcjZmZmJ1xuXHR9LFxuXHR0d2l0dGVyOiB7XG5cdFx0YmFja2dyb3VuZDogJyM1NWFjZWUnLFxuXHRcdGxhYmVsOiAnI2ZmZidcblx0fSxcblx0Z2l0aHViOiB7XG5cdFx0YmFja2dyb3VuZDogJyMwMDAnLFxuXHRcdGxhYmVsOiAnI2ZmZidcblx0fSxcblx0Z29vZ2xlOiB7XG5cdFx0YmFja2dyb3VuZDogJyNkZDRiMzknLFxuXHRcdGxhYmVsOiAnI2ZmZidcblx0fSxcblx0J21ldGVvci1kZXZlbG9wZXInOiB7XG5cdFx0YmFja2dyb3VuZENvbG9yOiAnI2JiMDAwMCcsXG5cdFx0bGFiZWw6ICcjZmZmJ1xuXHR9LFxuXHQnbWVldHVwJzoge1xuXHRcdGJhY2tncm91bmQ6ICcjRUQxQzQwJyxcblx0XHRsYWJlbDogJyNmZmYnXG5cdH0sXG5cdHdlaWJvOiB7XG5cdFx0YmFja2dyb3VuZDogJyNmYWY2ZjEnLFxuXHRcdGxhYmVsOiAnIzAwMCdcblx0fSxcblx0cGludGVyZXN0OiB7XG5cdFx0YmFja2dyb3VuZDogJyNiZDA4MWMnLFxuXHRcdGxhYmVsOiAnI2ZmZidcblx0fVxufVxuXG5leHBvcnQgY29uc3Qgc29jaWFsQnV0dG9uSWNvbnMgPSB7XG5cdGdvb2dsZTogXCJnb29nbGUtcGx1c1wiLFxuXHRcIm1ldGVvci1kZXZlbG9wZXJcIjogXCJyb2NrZXRcIlxufTtcbiJdfQ==
