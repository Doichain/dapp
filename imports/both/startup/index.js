import { AccountsReact } from 'meteor/meteoreact:accounts'

AccountsReact.configure({
  confirmPassword: false,
  enablePasswordChange: true,
  passwordSignupFields: 'USERNAME_AND_OPTIONAL_EMAIL',
  oauth: {
    google: {
      forceApprovalPrompt: true
    }
  }
})
