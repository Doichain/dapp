(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var Collection2 = Package['aldeed:collection2-core'].Collection2;
var ECMAScript = Package.ecmascript.ECMAScript;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;
var meteorInstall = Package.modules.meteorInstall;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;

var require = meteorInstall({"node_modules":{"meteor":{"aldeed:schema-deny":{"deny.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                        //
// packages/aldeed_schema-deny/deny.js                                                    //
//                                                                                        //
////////////////////////////////////////////////////////////////////////////////////////////
                                                                                          //
let SimpleSchema;
module.link("simpl-schema", {
  default(v) {
    SimpleSchema = v;
  }

}, 0);
let Collection2;
module.link("meteor/aldeed:collection2-core", {
  default(v) {
    Collection2 = v;
  }

}, 1);
// Extend the schema options allowed by SimpleSchema
SimpleSchema.extendOptions(['denyInsert', 'denyUpdate']);
Collection2.on('schema.attached', function (collection, ss) {
  if (ss.version >= 2 && ss.messageBox && typeof ss.messageBox.messages === 'function') {
    ss.messageBox.messages({
      en: {
        insertNotAllowed: '{{label}} cannot be set during an insert.',
        updateNotAllowed: '{{label}} cannot be set during an update.'
      }
    });
  }

  ss.addValidator(function () {
    if (!this.isSet) return;
    const def = this.definition;
    if (def.denyInsert && this.isInsert) return 'insertNotAllowed';
    if (def.denyUpdate && (this.isUpdate || this.isUpsert)) return 'updateNotAllowed';
  });
});
////////////////////////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});

var exports = require("/node_modules/meteor/aldeed:schema-deny/deny.js");

/* Exports */
Package._define("aldeed:schema-deny", exports);

})();

//# sourceURL=meteor://💻app/packages/aldeed_schema-deny.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvYWxkZWVkOnNjaGVtYS1kZW55L2RlbnkuanMiXSwibmFtZXMiOlsiU2ltcGxlU2NoZW1hIiwibW9kdWxlIiwibGluayIsImRlZmF1bHQiLCJ2IiwiQ29sbGVjdGlvbjIiLCJleHRlbmRPcHRpb25zIiwib24iLCJjb2xsZWN0aW9uIiwic3MiLCJ2ZXJzaW9uIiwibWVzc2FnZUJveCIsIm1lc3NhZ2VzIiwiZW4iLCJpbnNlcnROb3RBbGxvd2VkIiwidXBkYXRlTm90QWxsb3dlZCIsImFkZFZhbGlkYXRvciIsImlzU2V0IiwiZGVmIiwiZGVmaW5pdGlvbiIsImRlbnlJbnNlcnQiLCJpc0luc2VydCIsImRlbnlVcGRhdGUiLCJpc1VwZGF0ZSIsImlzVXBzZXJ0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBSUEsWUFBSjtBQUFpQkMsTUFBTSxDQUFDQyxJQUFQLENBQVksY0FBWixFQUEyQjtBQUFDQyxTQUFPLENBQUNDLENBQUQsRUFBRztBQUFDSixnQkFBWSxHQUFDSSxDQUFiO0FBQWU7O0FBQTNCLENBQTNCLEVBQXdELENBQXhEO0FBQTJELElBQUlDLFdBQUo7QUFBZ0JKLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGdDQUFaLEVBQTZDO0FBQUNDLFNBQU8sQ0FBQ0MsQ0FBRCxFQUFHO0FBQUNDLGVBQVcsR0FBQ0QsQ0FBWjtBQUFjOztBQUExQixDQUE3QyxFQUF5RSxDQUF6RTtBQUk1RjtBQUNBSixZQUFZLENBQUNNLGFBQWIsQ0FBMkIsQ0FBQyxZQUFELEVBQWUsWUFBZixDQUEzQjtBQUVBRCxXQUFXLENBQUNFLEVBQVosQ0FBZSxpQkFBZixFQUFrQyxVQUFVQyxVQUFWLEVBQXNCQyxFQUF0QixFQUEwQjtBQUMxRCxNQUFJQSxFQUFFLENBQUNDLE9BQUgsSUFBYyxDQUFkLElBQW1CRCxFQUFFLENBQUNFLFVBQXRCLElBQW9DLE9BQU9GLEVBQUUsQ0FBQ0UsVUFBSCxDQUFjQyxRQUFyQixLQUFrQyxVQUExRSxFQUFzRjtBQUNwRkgsTUFBRSxDQUFDRSxVQUFILENBQWNDLFFBQWQsQ0FBdUI7QUFDckJDLFFBQUUsRUFBRTtBQUNGQyx3QkFBZ0IsRUFBRSwyQ0FEaEI7QUFFRkMsd0JBQWdCLEVBQUU7QUFGaEI7QUFEaUIsS0FBdkI7QUFNRDs7QUFFRE4sSUFBRSxDQUFDTyxZQUFILENBQWdCLFlBQVc7QUFDekIsUUFBSSxDQUFDLEtBQUtDLEtBQVYsRUFBaUI7QUFFakIsVUFBTUMsR0FBRyxHQUFHLEtBQUtDLFVBQWpCO0FBRUEsUUFBSUQsR0FBRyxDQUFDRSxVQUFKLElBQWtCLEtBQUtDLFFBQTNCLEVBQXFDLE9BQU8sa0JBQVA7QUFDckMsUUFBSUgsR0FBRyxDQUFDSSxVQUFKLEtBQW1CLEtBQUtDLFFBQUwsSUFBaUIsS0FBS0MsUUFBekMsQ0FBSixFQUF3RCxPQUFPLGtCQUFQO0FBQ3pELEdBUEQ7QUFRRCxDQWxCRCxFIiwiZmlsZSI6Ii9wYWNrYWdlcy9hbGRlZWRfc2NoZW1hLWRlbnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBjb2xsZWN0aW9uMi1jb3JlIGNoZWNrcyB0byBtYWtlIHN1cmUgdGhhdCBzaW1wbC1zY2hlbWEgcGFja2FnZSBpcyBhZGRlZFxuaW1wb3J0IFNpbXBsZVNjaGVtYSBmcm9tICdzaW1wbC1zY2hlbWEnO1xuaW1wb3J0IENvbGxlY3Rpb24yIGZyb20gJ21ldGVvci9hbGRlZWQ6Y29sbGVjdGlvbjItY29yZSc7XG5cbi8vIEV4dGVuZCB0aGUgc2NoZW1hIG9wdGlvbnMgYWxsb3dlZCBieSBTaW1wbGVTY2hlbWFcblNpbXBsZVNjaGVtYS5leHRlbmRPcHRpb25zKFsnZGVueUluc2VydCcsICdkZW55VXBkYXRlJ10pO1xuXG5Db2xsZWN0aW9uMi5vbignc2NoZW1hLmF0dGFjaGVkJywgZnVuY3Rpb24gKGNvbGxlY3Rpb24sIHNzKSB7XG4gIGlmIChzcy52ZXJzaW9uID49IDIgJiYgc3MubWVzc2FnZUJveCAmJiB0eXBlb2Ygc3MubWVzc2FnZUJveC5tZXNzYWdlcyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHNzLm1lc3NhZ2VCb3gubWVzc2FnZXMoe1xuICAgICAgZW46IHtcbiAgICAgICAgaW5zZXJ0Tm90QWxsb3dlZDogJ3t7bGFiZWx9fSBjYW5ub3QgYmUgc2V0IGR1cmluZyBhbiBpbnNlcnQuJyxcbiAgICAgICAgdXBkYXRlTm90QWxsb3dlZDogJ3t7bGFiZWx9fSBjYW5ub3QgYmUgc2V0IGR1cmluZyBhbiB1cGRhdGUuJ1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgc3MuYWRkVmFsaWRhdG9yKGZ1bmN0aW9uKCkge1xuICAgIGlmICghdGhpcy5pc1NldCkgcmV0dXJuO1xuXG4gICAgY29uc3QgZGVmID0gdGhpcy5kZWZpbml0aW9uO1xuXG4gICAgaWYgKGRlZi5kZW55SW5zZXJ0ICYmIHRoaXMuaXNJbnNlcnQpIHJldHVybiAnaW5zZXJ0Tm90QWxsb3dlZCc7XG4gICAgaWYgKGRlZi5kZW55VXBkYXRlICYmICh0aGlzLmlzVXBkYXRlIHx8IHRoaXMuaXNVcHNlcnQpKSByZXR1cm4gJ3VwZGF0ZU5vdEFsbG93ZWQnO1xuICB9KTtcbn0pO1xuIl19
