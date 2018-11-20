(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;

/* Package-scope variables */
var wrapAsync;

(function(){

////////////////////////////////////////////////////////////////////////
//                                                                    //
// packages/sakulstra_aggregate/index.js                              //
//                                                                    //
////////////////////////////////////////////////////////////////////////
                                                                      //
wrapAsync = Meteor.wrapAsync || Meteor._wrapAsync;

Mongo.Collection.prototype.aggregate = function(pipelines, options) {
  var coll;
  if (this.rawCollection) {
    // >= Meteor 1.0.4
    coll = this.rawCollection();
  } else {
    // < Meteor 1.0.4
    coll = this._getCollection();
  }
  if (MongoInternals.NpmModules.mongodb.version[0] === '3') {
    var cursor = wrapAsync(coll.aggregate, coll)(pipelines, options);
    return wrapAsync(cursor.toArray, cursor)();
  }
  return wrapAsync(coll.aggregate.bind(coll))(pipelines, options);
};

////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
Package._define("sakulstra:aggregate");

})();
