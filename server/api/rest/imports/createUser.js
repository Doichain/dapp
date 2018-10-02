import { Api } from '../rest.js';
import {Meteor} from 'meteor/meteor';
import {Accounts} from 'meteor/accounts-base'
import SimpleSchema from 'simpl-schema';

const createUserSchema = new SimpleSchema({
    username: {
      type: String,
      regEx: "^[A-Z,a-z,0-9,!,_,$,#]{4,24}$"
    },
    email: {
      type: String,
      regEx: SimpleSchema.RegEx.Email
    },
    password: {
      type: String,
      regEx: "^[A-Z,a-z,0-9,!,_,$,#]{8,24}$"
    },
    profile: {
        type: SimpleSchema.oneOf(Array,Object,String),
        optional: true
    },
    'profile.$': {
        type: String
    }
  });

//TODO: collection options seperate
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
                    var tmp = Accounts.createUser({username:params.username,email:params.email,password:params.password,profile:params.profile});
                    return {status: 'success', data: {userid: tmp}};
                } catch(error) {
                  return {statusCode: 500, body: {status: 'fail', message: error.message}};
                }
                
            }
        }
    }

  };
  Api.addCollection(Meteor.users,collectionOptions);