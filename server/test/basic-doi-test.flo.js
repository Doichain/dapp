import {chai} from 'meteor/practicalmeteor:chai';
import {
    login,
    requestDOI,
    createUser,
    findUser,
    findOptIn,
    exportOptIns,
    updateUser,
    resetUsers,
    requestConfirmVerifyBasicDoi,
    deleteAllEmailsFromPop3,
    
} from "./test-api/test-api-on-dapp";
import { logBlockchain } from '../../imports/startup/server/log-configuration';
import { deleteOptInsFromAliceAndBob } from './test-api/test-api-on-node';
if(Meteor.isTest) {

    describe('basic-doi-test-flo', function () {
    });
}


