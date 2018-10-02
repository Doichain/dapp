import { Api } from '../rest.js';
import {Meteor} from 'meteor/meteor';



//TODO: collection options seperate
const collectionOptions =
  {
    path:"users",
    routeOptions:
    {
        authRequired : true,
        roleRequired : "admin"
    },
    excludedEndpoints: ['patch']

  };
  Api.addCollection(Meteor.users,collectionOptions);