## REST API

List of REST API Calls

## Login

You need a valide token for the REST calls. To get the token call:
``/api/login`` with parameter ``username="username"&password="password"``

Response with valide credentials:
```
{
  "status": "success",
  "data": {
    "authToken": "BbTe9w3DTZhPNriUWv1aU6a_FDawlkYjKMQ6I2t3V2k",
    "userId": "8BxFMSZAc7Ez2iiR6"
  }
}
```
You can authorize yourself now with the request headers:
```
X-Auth-Token: BbTe9w3DTZhPNriUWv1aU6a_FDawlkYjKMQ6I2t3V2k
X-User-Id: 8BxFMSZAc7Ez2iiR6
```

## Calls

Create SOI
``/api/soi`` with parameter ``username="username"&password="password"``

## Useful meteor database calls
* Add test SOI to db: ``db.sois.insert({recipient: "recipient@sendeffect.de", sender: "sender@sendeffect.de", customer_number: "123456789", data_json: "{name: 'name', surname: 'surname'}", soi_timestamp: new Date()})``

* Logout all users: ``db.users.update({}, {$set: {"services.resume.loginTokens": []}}, {multi: true})``
