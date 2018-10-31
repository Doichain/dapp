import { Api } from '../rest.js';
import {Meteor} from 'meteor/meteor';
import {Accounts} from 'meteor/accounts-base'
import SimpleSchema from 'simpl-schema';
import {Roles} from "meteor/alanning:roles";
import {logMain} from "../../../../imports/startup/server/log-configuration";

const mailTemplateSchema = new SimpleSchema({
    subject: {
        type: String,
        optional:true 
    },
    redirect: {
        type: String,
        regEx: SimpleSchema.RegEx.Url,
        optional:true 
    },
    returnPath: {
        type: String,
        regEx: SimpleSchema.RegEx.Email,
        optional:true 
    },
    templateURL:{
        type: String,
        regEx: SimpleSchema.RegEx.Url,
        optional:true 
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
    mailTemplate:{
        type: mailTemplateSchema,
        optional:true 
    }
  });
  const updateUserSchema = new SimpleSchema({
    mailTemplate:{
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
    excludedEndpoints: ['patch','deleteAll'],
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
                try{
                    let userId;
                    createUserSchema.validate(params);
                    logMain('validated',params);
                    if(params.mailTemplate !== undefined){
                        userId = Accounts.createUser({username:params.username,
                            email:params.email,
                            password:params.password,
                            profile:{mailTemplate:params.mailTemplate}});
                    }
                    else{
                        userId = Accounts.createUser({username:params.username,email:params.email,password:params.password, profile:{}});
                    }    
                    return {status: 'success', data: {userid: userId}};
                } catch(error) {
                  return {statusCode: 400, body: {status: 'fail', message: error.message}};
                }
                
            }
        },
        put:
        {
            action: function(){
                const qParams = this.queryParams;
                const bParams = this.bodyParams;
                let params = {};
                let uid=this.userId;
                const paramId=this.urlParams.id;
                if(qParams !== undefined) params = {...qParams}
                if(bParams !== undefined) params = {...params, ...bParams}

                try{ //TODO this is not necessary here and can probably go right into the definition of the REST METHOD next to put (!?!)
                    if(!Roles.userIsInRole(uid, 'admin')){
                        if(uid!==paramId){
                            throw Error("No Permission");
                        }
                    }
                    updateUserSchema.validate(params);
                    const tmpObj=JSON.parse(params.mailTemplate);
                    mailTemplateSchema.validate(tmpObj);
                    if(!Meteor.users.update(this.urlParams.id,{$set:{"profile.mailTemplate":tmpObj}})){
                        throw Error("Failed to update user");
                    }
                    return {status: 'success', data: {userid: this.urlParams.id, mailTemplate:tmpObj}};
                } catch(error) {
                  return {statusCode: 400, body: {status: 'fail', message: error.message}};
                }
            }
        }
    }
}
Api.addCollection(Meteor.users,collectionOptions);