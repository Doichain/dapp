import { Api } from '../rest.js';
import {Meteor} from 'meteor/meteor';
import {Accounts} from 'meteor/accounts-base'
import SimpleSchema from 'simpl-schema';

//TODO Schema separate

const userProfileSchema = new SimpleSchema({
    from: {
        type: String,
        regEx: SimpleSchema.RegEx.Email
    },
    subject: {
        type: String
    },
    redirect: {
        type: String,
        regEx: SimpleSchema.RegEx.Url
    },
    returnPath: {
        type: String,
        regEx: SimpleSchema.RegEx.Email
    }


});
const createUserSchema = new SimpleSchema({
    username: {
      type: String,
      regEx: "^[A-Z,a-z,0-9,!,_,$,#]{4,24}$"  //Only usernames between 4-24 characters from A-Z,a-z,0-9,!,_,$,# allowed
    },
    email: {
      type: String,
      regEx: SimpleSchema.RegEx.Email
    },
    password: {
      type: String,
      regEx: "^[A-Z,a-z,0-9,!,_,$,#]{8,24}$" //Only passwords between 8-24 characters from A-Z,a-z,0-9,!,_,$,# allowed
    },
    profile:{
        type: JSON
    }
    //profile: {
    //    type: String,
    //    optional: true
    //},
    //'profile.$': {
    //    type: String
    //}
  });
  const updateUserSchema = new SimpleSchema({
    username: {
      type: String,
      regEx: "^[A-Z,a-z,0-9,!,_,$,#]{4,24}$"
    },
    profile:{
        type: JSON
    }
});

//TODO: collection options separate
const collectionOptions =
  {
    path:"users",
    routeOptions:
    {
        authRequired : true,
        roleRequired : "admin"
    },
    excludedEndpoints: ['patch'],
    endpoints:
    {
        post:
        {
            action: function(){
                const qParams = this.queryParams;
                const bParams = this.bodyParams;
                let params = {};
                if(qParams !== undefined) params = {...qParams}
                if(bParams !== undefined) params = {...params, ...bParams}
                //checkPost(params);
                try{
                    createUserSchema.validate(params);
                    const tmpObj=JSON.parse(params.profile);
                    
                    userProfileSchema.validate(tmpObj);
                    
                    var tmp = Accounts.createUser({username:params.username,email:params.email,password:params.password, profile:tmpObj});

                    return {status: 'success', data: {userid: tmp}};
                } catch(error) {
                  return {statusCode: 400, body: {status: 'fail', message: error.message}};
                }
                
            }
        }
    }
}
    Api.addRoute("users/update", {
        put:
        {
            roleRequired: ['admin'],
            action: function(){
                const qParams = this.queryParams;
                const bParams = this.bodyParams;
                let params = {};
                if(qParams !== undefined) params = {...qParams}
                if(bParams !== undefined) params = {...params, ...bParams}
                try{
                    updateUserSchema.validate(params);
                    const tmpObj=JSON.parse(params.profile);
                    userProfileSchema.validate(tmpObj);
                    var userUpdate = Accounts.findUserByUsername(params.username);
                    Meteor.users.update({_id: userUpdate._id},{$set:{profile:tmpObj}});
                    return {status: 'success', data: {userid: userUpdate._id, profile:tmpObj}};
                } catch(error) {
                  return {statusCode: 400, body: {status: 'fail', message: error.message}};
                }
            }
        }
    });
  Api.addCollection(Meteor.users,collectionOptions);