// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by doichain-api.js.
import { name as packageName } from "meteor/doichain-api";

// Write your tests here!
// Here is an example.
Tinytest.add('doichain-api - example', function (test) {
  test.equal(packageName, "doichain-api");
});
