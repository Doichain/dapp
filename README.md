Add test soi to mongo: ``db.sois.insert({recipient: "recipient@sendeffect.de", sender: "sender@sendeffect.de", customer_number: "123456789", data_json: "{name: 'name', surname: 'surname'}", soi_timestamp: new Date()})``

Logout all users: ``db.users.update({}, {$set: {"services.resume.loginTokens": []}}, {multi: true})``
