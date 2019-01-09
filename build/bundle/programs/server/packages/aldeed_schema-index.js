(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var Collection2 = Package['aldeed:collection2'].Collection2;
var ECMAScript = Package.ecmascript.ECMAScript;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;
var meteorInstall = Package.modules.meteorInstall;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;

var require = meteorInstall({"node_modules":{"meteor":{"aldeed:schema-index":{"server.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/aldeed_schema-index/server.js                                                                           //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
let Collection2;
module.link("meteor/aldeed:collection2", {
  default(v) {
    Collection2 = v;
  }

}, 0);
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 1);
module.link("./common");
Collection2.on('schema.attached', (collection, ss) => {
  function ensureIndex(index, name, unique, sparse) {
    Meteor.startup(() => {
      collection._collection._ensureIndex(index, {
        background: true,
        name,
        unique,
        sparse
      });
    });
  }

  function dropIndex(indexName) {
    Meteor.startup(() => {
      try {
        collection._collection._dropIndex(indexName);
      } catch (err) {// no index with that name, which is what we want
      }
    });
  }

  const propName = ss.version === 2 ? 'mergedSchema' : 'schema'; // Loop over fields definitions and ensure collection indexes (server side only)

  const schema = ss[propName]();
  Object.keys(schema).forEach(fieldName => {
    const definition = schema[fieldName];

    if ('index' in definition || definition.unique === true) {
      const index = {}; // If they specified `unique: true` but not `index`,
      // we assume `index: 1` to set up the unique index in mongo

      let indexValue;

      if ('index' in definition) {
        indexValue = definition.index;
        if (indexValue === true) indexValue = 1;
      } else {
        indexValue = 1;
      }

      const indexName = `c2_${fieldName}`; // In the index object, we want object array keys without the ".$" piece

      const idxFieldName = fieldName.replace(/\.\$\./g, '.');
      index[idxFieldName] = indexValue;
      const unique = !!definition.unique && (indexValue === 1 || indexValue === -1);
      let sparse = definition.sparse || false; // If unique and optional, force sparse to prevent errors

      if (!sparse && unique && definition.optional) sparse = true;

      if (indexValue === false) {
        dropIndex(indexName);
      } else {
        ensureIndex(index, indexName, unique, sparse);
      }
    }
  });
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"common.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/aldeed_schema-index/common.js                                                                           //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
let SimpleSchema;
module.link("simpl-schema", {
  default(v) {
    SimpleSchema = v;
  }

}, 0);
let Collection2;
module.link("meteor/aldeed:collection2", {
  default(v) {
    Collection2 = v;
  }

}, 1);
// Extend the schema options allowed by SimpleSchema
SimpleSchema.extendOptions(['index', // one of Number, String, Boolean
'unique', // Boolean
'sparse']);
Collection2.on('schema.attached', (collection, ss) => {
  // Define validation error messages
  if (ss.version >= 2 && ss.messageBox && typeof ss.messageBox.messages === 'function') {
    ss.messageBox.messages({
      en: {
        notUnique: '{{label}} must be unique'
      }
    });
  }
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});

var exports = require("/node_modules/meteor/aldeed:schema-index/server.js");

/* Exports */
Package._define("aldeed:schema-index", exports);

})();

//# sourceURL=meteor://💻app/packages/aldeed_schema-index.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvYWxkZWVkOnNjaGVtYS1pbmRleC9zZXJ2ZXIuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2FsZGVlZDpzY2hlbWEtaW5kZXgvY29tbW9uLmpzIl0sIm5hbWVzIjpbIkNvbGxlY3Rpb24yIiwibW9kdWxlIiwibGluayIsImRlZmF1bHQiLCJ2IiwiTWV0ZW9yIiwib24iLCJjb2xsZWN0aW9uIiwic3MiLCJlbnN1cmVJbmRleCIsImluZGV4IiwibmFtZSIsInVuaXF1ZSIsInNwYXJzZSIsInN0YXJ0dXAiLCJfY29sbGVjdGlvbiIsIl9lbnN1cmVJbmRleCIsImJhY2tncm91bmQiLCJkcm9wSW5kZXgiLCJpbmRleE5hbWUiLCJfZHJvcEluZGV4IiwiZXJyIiwicHJvcE5hbWUiLCJ2ZXJzaW9uIiwic2NoZW1hIiwiT2JqZWN0Iiwia2V5cyIsImZvckVhY2giLCJmaWVsZE5hbWUiLCJkZWZpbml0aW9uIiwiaW5kZXhWYWx1ZSIsImlkeEZpZWxkTmFtZSIsInJlcGxhY2UiLCJvcHRpb25hbCIsIlNpbXBsZVNjaGVtYSIsImV4dGVuZE9wdGlvbnMiLCJtZXNzYWdlQm94IiwibWVzc2FnZXMiLCJlbiIsIm5vdFVuaXF1ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLElBQUlBLFdBQUo7QUFBZ0JDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLDJCQUFaLEVBQXdDO0FBQUNDLFNBQU8sQ0FBQ0MsQ0FBRCxFQUFHO0FBQUNKLGVBQVcsR0FBQ0ksQ0FBWjtBQUFjOztBQUExQixDQUF4QyxFQUFvRSxDQUFwRTtBQUF1RSxJQUFJQyxNQUFKO0FBQVdKLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGVBQVosRUFBNEI7QUFBQ0csUUFBTSxDQUFDRCxDQUFELEVBQUc7QUFBQ0MsVUFBTSxHQUFDRCxDQUFQO0FBQVM7O0FBQXBCLENBQTVCLEVBQWtELENBQWxEO0FBQXFESCxNQUFNLENBQUNDLElBQVAsQ0FB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QUFBZ0JDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLDJCQUFaLEVBQXdDO0FBQUNDLFNBQU8sQ0FBQ0MsQ0FBRCxFQUFHO0FBQUNKLGVBQVcsR0FBQ0ksQ0FBWjtBQUFjOztBQUExQixDQUF4QyxFQUFvRSxDQUFwRTtBQUk1RjtBQUNBOEIsWUFBWSxDQUFDQyxhQUFiLENBQTJCLENBQ3pCLE9BRHlCLEVBQ2hCO0FBQ1QsUUFGeUIsRUFFZjtBQUNWLFFBSHlCLENBQTNCO0FBTUFuQyxXQUFXLENBQUNNLEVBQVosQ0FBZSxpQkFBZixFQUFrQyxDQUFDQyxVQUFELEVBQWFDLEVBQWIsS0FBb0I7QUFDcEQ7QUFDQSxNQUFJQSxFQUFFLENBQUNlLE9BQUgsSUFBYyxDQUFkLElBQW1CZixFQUFFLENBQUM0QixVQUF0QixJQUFvQyxPQUFPNUIsRUFBRSxDQUFDNEIsVUFBSCxDQUFjQyxRQUFyQixLQUFrQyxVQUExRSxFQUFzRjtBQUNwRjdCLE1BQUUsQ0FBQzRCLFVBQUgsQ0FBY0MsUUFBZCxDQUF1QjtBQUNyQkMsUUFBRSxFQUFFO0FBQ0ZDLGlCQUFTLEVBQUU7QUFEVDtBQURpQixLQUF2QjtBQUtEO0FBQ0YsQ0FURCxFIiwiZmlsZSI6Ii9wYWNrYWdlcy9hbGRlZWRfc2NoZW1hLWluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IENvbGxlY3Rpb24yIGZyb20gJ21ldGVvci9hbGRlZWQ6Y29sbGVjdGlvbjInO1xuaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5cbmltcG9ydCAnLi9jb21tb24nO1xuXG5Db2xsZWN0aW9uMi5vbignc2NoZW1hLmF0dGFjaGVkJywgKGNvbGxlY3Rpb24sIHNzKSA9PiB7XG4gIGZ1bmN0aW9uIGVuc3VyZUluZGV4KGluZGV4LCBuYW1lLCB1bmlxdWUsIHNwYXJzZSkge1xuICAgIE1ldGVvci5zdGFydHVwKCgpID0+IHtcbiAgICAgIGNvbGxlY3Rpb24uX2NvbGxlY3Rpb24uX2Vuc3VyZUluZGV4KGluZGV4LCB7XG4gICAgICAgIGJhY2tncm91bmQ6IHRydWUsXG4gICAgICAgIG5hbWUsXG4gICAgICAgIHVuaXF1ZSxcbiAgICAgICAgc3BhcnNlLFxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBkcm9wSW5kZXgoaW5kZXhOYW1lKSB7XG4gICAgTWV0ZW9yLnN0YXJ0dXAoKCkgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29sbGVjdGlvbi5fY29sbGVjdGlvbi5fZHJvcEluZGV4KGluZGV4TmFtZSk7XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgLy8gbm8gaW5kZXggd2l0aCB0aGF0IG5hbWUsIHdoaWNoIGlzIHdoYXQgd2Ugd2FudFxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgY29uc3QgcHJvcE5hbWUgPSBzcy52ZXJzaW9uID09PSAyID8gJ21lcmdlZFNjaGVtYScgOiAnc2NoZW1hJztcblxuICAvLyBMb29wIG92ZXIgZmllbGRzIGRlZmluaXRpb25zIGFuZCBlbnN1cmUgY29sbGVjdGlvbiBpbmRleGVzIChzZXJ2ZXIgc2lkZSBvbmx5KVxuICBjb25zdCBzY2hlbWEgPSBzc1twcm9wTmFtZV0oKTtcbiAgT2JqZWN0LmtleXMoc2NoZW1hKS5mb3JFYWNoKChmaWVsZE5hbWUpID0+IHtcbiAgICBjb25zdCBkZWZpbml0aW9uID0gc2NoZW1hW2ZpZWxkTmFtZV07XG4gICAgaWYgKCdpbmRleCcgaW4gZGVmaW5pdGlvbiB8fCBkZWZpbml0aW9uLnVuaXF1ZSA9PT0gdHJ1ZSkge1xuICAgICAgY29uc3QgaW5kZXggPSB7fTtcbiAgICAgIC8vIElmIHRoZXkgc3BlY2lmaWVkIGB1bmlxdWU6IHRydWVgIGJ1dCBub3QgYGluZGV4YCxcbiAgICAgIC8vIHdlIGFzc3VtZSBgaW5kZXg6IDFgIHRvIHNldCB1cCB0aGUgdW5pcXVlIGluZGV4IGluIG1vbmdvXG4gICAgICBsZXQgaW5kZXhWYWx1ZTtcbiAgICAgIGlmICgnaW5kZXgnIGluIGRlZmluaXRpb24pIHtcbiAgICAgICAgaW5kZXhWYWx1ZSA9IGRlZmluaXRpb24uaW5kZXg7XG4gICAgICAgIGlmIChpbmRleFZhbHVlID09PSB0cnVlKSBpbmRleFZhbHVlID0gMTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGluZGV4VmFsdWUgPSAxO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBpbmRleE5hbWUgPSBgYzJfJHtmaWVsZE5hbWV9YDtcbiAgICAgIC8vIEluIHRoZSBpbmRleCBvYmplY3QsIHdlIHdhbnQgb2JqZWN0IGFycmF5IGtleXMgd2l0aG91dCB0aGUgXCIuJFwiIHBpZWNlXG4gICAgICBjb25zdCBpZHhGaWVsZE5hbWUgPSBmaWVsZE5hbWUucmVwbGFjZSgvXFwuXFwkXFwuL2csICcuJyk7XG4gICAgICBpbmRleFtpZHhGaWVsZE5hbWVdID0gaW5kZXhWYWx1ZTtcbiAgICAgIGNvbnN0IHVuaXF1ZSA9ICEhZGVmaW5pdGlvbi51bmlxdWUgJiYgKGluZGV4VmFsdWUgPT09IDEgfHwgaW5kZXhWYWx1ZSA9PT0gLTEpO1xuICAgICAgbGV0IHNwYXJzZSA9IGRlZmluaXRpb24uc3BhcnNlIHx8IGZhbHNlO1xuXG4gICAgICAvLyBJZiB1bmlxdWUgYW5kIG9wdGlvbmFsLCBmb3JjZSBzcGFyc2UgdG8gcHJldmVudCBlcnJvcnNcbiAgICAgIGlmICghc3BhcnNlICYmIHVuaXF1ZSAmJiBkZWZpbml0aW9uLm9wdGlvbmFsKSBzcGFyc2UgPSB0cnVlO1xuXG4gICAgICBpZiAoaW5kZXhWYWx1ZSA9PT0gZmFsc2UpIHtcbiAgICAgICAgZHJvcEluZGV4KGluZGV4TmFtZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlbnN1cmVJbmRleChpbmRleCwgaW5kZXhOYW1lLCB1bmlxdWUsIHNwYXJzZSk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbn0pO1xuIiwiLy8gY29sbGVjdGlvbjIgY2hlY2tzIHRvIG1ha2Ugc3VyZSB0aGF0IHNpbXBsLXNjaGVtYSBwYWNrYWdlIGlzIGFkZGVkXG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XG5pbXBvcnQgQ29sbGVjdGlvbjIgZnJvbSAnbWV0ZW9yL2FsZGVlZDpjb2xsZWN0aW9uMic7XG5cbi8vIEV4dGVuZCB0aGUgc2NoZW1hIG9wdGlvbnMgYWxsb3dlZCBieSBTaW1wbGVTY2hlbWFcblNpbXBsZVNjaGVtYS5leHRlbmRPcHRpb25zKFtcbiAgJ2luZGV4JywgLy8gb25lIG9mIE51bWJlciwgU3RyaW5nLCBCb29sZWFuXG4gICd1bmlxdWUnLCAvLyBCb29sZWFuXG4gICdzcGFyc2UnLCAvLyBCb29sZWFuXG5dKTtcblxuQ29sbGVjdGlvbjIub24oJ3NjaGVtYS5hdHRhY2hlZCcsIChjb2xsZWN0aW9uLCBzcykgPT4ge1xuICAvLyBEZWZpbmUgdmFsaWRhdGlvbiBlcnJvciBtZXNzYWdlc1xuICBpZiAoc3MudmVyc2lvbiA+PSAyICYmIHNzLm1lc3NhZ2VCb3ggJiYgdHlwZW9mIHNzLm1lc3NhZ2VCb3gubWVzc2FnZXMgPT09ICdmdW5jdGlvbicpIHtcbiAgICBzcy5tZXNzYWdlQm94Lm1lc3NhZ2VzKHtcbiAgICAgIGVuOiB7XG4gICAgICAgIG5vdFVuaXF1ZTogJ3t7bGFiZWx9fSBtdXN0IGJlIHVuaXF1ZScsXG4gICAgICB9LFxuICAgIH0pO1xuICB9XG59KTtcbiJdfQ==
