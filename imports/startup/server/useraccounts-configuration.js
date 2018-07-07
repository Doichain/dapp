import { Accounts } from 'meteor/accounts-base';
Accounts.config({
    sendVerificationEmail: true,
    forbidClientAccountCreation: false
});



Accounts.emailTemplates.from='doichain@le-space.de';