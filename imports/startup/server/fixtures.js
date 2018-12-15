import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import {Meta} from '../../api/meta/meta.js'
Meteor.startup(() => {

  let version=Assets.getText("version.json");

  if(Meta.find({key:"version"}).count() > 0){
    Meta.remove({key:"version"});
  }
   Meta.insert({key:"version",value:version});
  
  if(Meteor.users.find().count() === 0) {
    const id = Accounts.createUser({
      username: 'admin',
      email: 'admin@sendeffect.de',
      password: 'password'
    });
    Roles.addUsersToRoles(id, 'admin');
  }
});
