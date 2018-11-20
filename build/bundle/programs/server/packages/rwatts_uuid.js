(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;

/* Package-scope variables */
var uuid;

(function(){

/////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                         //
// packages/rwatts_uuid/packages/rwatts_uuid.js                                            //
//                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////
                                                                                           //
(function () {

///////////////////////////////////////////////////////////////////////////////////////
//                                                                                   //
// packages/rwatts:uuid/lib/uuid.js                                                  //
//                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////
                                                                                     //
uuid = uuid || {}; // exported                                                       // 1
                                                                                     // 2
/**                                                                                  // 3
* @method uuid.new                                                                   // 4
* @public                                                                            // 5
* @returns {String}                                                                  // 6
*/                                                                                   // 7
uuid.new = function() {                                                              // 8
    var d = new Date().getTime()                                                     // 9
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) { // 10
        var r = (d + Math.random() * 16) % 16 | 0;                                   // 11
        d = Math.floor(d / 16);                                                      // 12
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);                        // 13
    })                                                                               // 14
    return uuid;                                                                     // 15
};                                                                                   // 16
                                                                                     // 17
/**                                                                                  // 18
* @method uuid.tiny                                                                  // 19
* @public                                                                            // 20
* @returns {String}                                                                  // 21
*/                                                                                   // 22
uuid.tiny = function() {                                                             // 23
    var shortuuid = function () {                                                    // 24
    	return ("0000" + (Math.random()*Math.pow(36,4) << 0).toString(36)).slice(-4);   // 25
    }                                                                                // 26
    return shortuuid();                                                              // 27
};                                                                                   // 28
///////////////////////////////////////////////////////////////////////////////////////

}).call(this);

/////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
Package._define("rwatts:uuid", {
  uuid: uuid
});

})();
