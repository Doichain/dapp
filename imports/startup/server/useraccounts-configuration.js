import { Accounts } from 'meteor/accounts-base';
Accounts.config({
    sendVerificationEmail: true,
    forbidClientAccountCreation: true
});



Accounts.emailTemplates.from='doichain@le-space.de';