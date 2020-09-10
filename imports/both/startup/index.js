import { AccountsReact } from 'meteor/meteoreact:accounts'

AccountsReact.configure({
  confirmPassword: false,
  enablePasswordChange: true,
  passwordSignupFields: 'USERNAME_AND_OPTIONAL_EMAIL',
  disableForgotPassword: true,
  forbidClientAccountCreation: true,
  sendVerificationEmail: false,
  hideSignUpLink:true,
  oauth: {
    google: {
      forceApprovalPrompt: true
    }
  }
})