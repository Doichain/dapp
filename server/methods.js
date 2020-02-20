import { Meteor } from 'meteor/meteor';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import { i18n } from 'meteor/universe:i18n';
import { Roles } from 'meteor/alanning:roles';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

const usersUpdate = new ValidatedMethod({
    name: 'users.update',
    validate: null,
    run({_id,columnID,value}) {

        if(!Roles.userIsInRole(this.userId, ['admin'])) {
            const error = "api.doichain.rescan.accessDenied";
            throw new Meteor.Error(error, i18n.__(error));
        }

       // console.log('running users.update method',{_id,columnID,value})
        const updateRecord = {}
        updateRecord[columnID] = value
        Meteor.users.update({_id:_id},{$set:updateRecord})

        return true
    },
});


const OPTIONS_METHODS = _.pluck([usersUpdate], 'name');

if (Meteor.isServer) {
    DDPRateLimiter.addRule({
        name(name) {
            return _.contains(OPTIONS_METHODS, name);
        },
        // Rate limit per connection ID
        connectionId() { return true; },
    }, 1, 1000);
}
