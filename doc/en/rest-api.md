# Doichain dApp - REST-API

## Table of Contents
- [Authentication](#authentication)
- [Calls (Send - dApp) Request a Double-Opt-In](#calls--send---dapp-)
    - [Create Opt-In](#create-opt-in)
    - [Get Double Opt-In mail data](#get-double-opt-in-mail-data)
- [Calls (Confirm - dApp) Confirm a Double-Opt-In via email/browser](#calls--confirm---dapp-)
    - [Confirm Opt-In](#confirm-opt-in)
- [Calls (Verify - dApp)](#calls--verify---dapp-)
    - [Verify Opt-In](#verify-opt-in)
    - [Verify Local](#verify-local)
- [Export (Opt-Ins)](#export)    
- [Calls (Users)](#calls--users-)
    - [Create user](#create-user)
    - [Update user](#update-user)
        
## REST API
List of REST API calls for the version 1.
All call urls in version 1 start with ``/api/v1/``

### Authentication
You need a valid token for some of the REST calls. Get the token with:

* Url: ``login``
* Parameter:
    + ``username`` - Authentification Username
    + ``password`` - Authentification Password

* Example request (cURL)
```sh
curl -H "Content-Type: application/json" -X POST -d '{"username":"admin","password":"password"}' http://localhost:3000/api/v1/login
```

* Response with valid credentials:
```json
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


### Calls (Send - dApp)
##### Create Opt-In
* Auth required: yes
* Role required: ``none``
* Url: ``opt-in``
* Method: ``POST``
* Query-Parameter:
    + ``recipient_mail`` - Email of the recipient
    + ``sender_mail`` - Email of the sender
    + ``ownerid`` - (ADMIN ONLY) Userid of Opt-In-owner
    + ``data`` - (OPTIONAL) Recipient/Opt-In data as String (not as JSON-Object)
        - ``screenshot`` - (OPTIONAL) Can store a screenshot of the subscription
        - ``templateParam`` - (OPTIONAL) Parameters to be added to template URL
        - ``redirectParam`` - (OPTIONAL) Parameters to be added to redirect URL
* Example request:
```sh
curl -X POST -H "Content-Type: application/json" -H "X-Auth-Token: TNjWzy1IaGLj9JrSWaUILMXYKEgVJFwXqp2M9AtcW7g" -H "X-User-Id: GQTKD2WiFKpx8Ndc2" http://localhost:3000/api/v1/opt-in -d '{"recipient_mail":"bob@ci-doichain.org", "sender_mail":"alice-xyz@ci-doichain.org"}'
```
* Success-Response:
```json
{
    "status" : "success",
    "data" : 
    {
        "id" : "optinId",
        "status" : "success",
        "message" : "Opt-In added"
    }
}
```
* Fail-Response:
```json
{
    "status" : "fail",
    "message" : "Errormessage"
}
```
### Calls (Confirm - dApp)
##### Confirm Opt-In
* Auth required: No
* Url: ``opt-in/confirm/:HASH``
* Method: ``GET``
* Parameter:
    + ``HASH`` - The internally generatet hash. It contains following information:
        + ``opt-in id`` - The database id of the opt-in
        + ``confirmation token`` - A random generated token for the confirmation validation
        + ``redirect url`` - Url where the customer should be redirected to

### Calls (Verify - dApp)
##### Verify Opt-In 
* Description: verify on any known dApp all four parameters mandatory
* Auth required: No
* Url: ``opt-in/verify``
* Method: ``GET``
* Parameter:
    + ``recipient_mail`` - Email of the recipient
    + ``sender_mail`` - Email of the sender
    + ``name_id`` - Blockchain entry name id
    + ``recipient_public_key`` - Public key of the recipient
    
##### Verify Local 
* verify email permission on own local dApp with sender email and recipients email only
* Auth required: Yes
* Role required: ``admin``
* Url: ``opt-in/verify``
* Method: ``GET``
* Parameter:
    + ``recipient_mail`` - Email of the recipient
    + ``sender_mail`` - Email of the sender
    
#### Export
* Auth required: yes
* Role required: ``none``
* Url: ``export``
* Method: ``GET``
* Query-Parameter:
    + ``status`` - not yet working
    + ``ownerid`` - (ADMIN ONLY,OPTIONAL) userId of specific Opt-in owner 
* Example request:
```sh
curl -X GET -H "X-Auth-Token: BbTe9w3DTZhPNriUWv1aU6a_FDawlkYjKMQ6I2t3V2k"-H "X-User-Id: 8BxFMSZAc7Ez2iiR6" http://localhost:3000/api/v1/export
```
* Success-Response:
```json
{
"data": {
    "status": "success",
    "data": [
      {
        "_id": "EFxZCfAx7JqosrQ2E",
        "ownerId": "qWgndg2gmsYZqCqin",
        "createdAt": "2019-01-04T12:50:46.946Z",
        "nameId": "60ADC586B8F03530100CA0BB524572B1664B8A43F7161B5F3D0197B3CD0ED2EB",
        "confirmedAt": "2019-01-04T12:51:12.974Z",
        "RecipientEmail": {
          "email": "bob@ci-doichain.org"
        },
        "SenderEmail": {
          "email": "alice-a@ci-doichain.org"
        }
      },
      {
        "_id": "z7HotbvPRG2tsuvd4",
        "ownerId": "qWgndg2gmsYZqCqin",
        "createdAt": "2019-01-04T12:51:19.115Z",
        "nameId": "157305C71AE0C10A2C65B9D4CA19BF3104255DD307EAC4E6B32B8BAB422EC004",
        "confirmedAt": "2019-01-04T12:51:38.012Z",
        "RecipientEmail": {
          "email": "bob@ci-doichain.org"
        },
        "SenderEmail": {
          "email": "alice-b@ci-doichain.org"
        }
      }
    ]
}
```
* Fail-Response:
```json
{
    "status" : "fail",
    "message" : "Errormessage"
}
```
### Calls (Users)
##### Create User
* Auth required: Yes
* Role required: ``admin``
* Url: ``users``
* Method: ``POST``
* Parameter:
    + ``username`` - Username of new user
    + ``email`` - Email of new user
    + ``password`` - Password of new user
    + ``mailTemplate`` - (OPTIONAL) Form information as JSON
        - ``subject`` - (OPTIONAL) Subject of the email
        - ``redirect`` - (OPTIONAL) Redirect URL
        - ``returnPath`` - (OPTIONAL) Return Path
        - ``templateURL`` - (OPTIONAL) Confirm mail template URL
            + text/plain
            + text/html
            + application/json
            ```json
            {"text":"","html":""}
            ```

* Success-Response:
```json
{
    "status" : "success",
    "data" : 
    {
        "userid" : "userid",
    }
}
```
* Fail-Response:
```json
{
    "status" : "fail",
    "message" : "Errormessage"
}
```

##### Update User
* Auth required: Yes
* Role required: none
* Url: ``users/:userId``
* Method: ``PUT``
* Parameter:
    + ``mailTemplate`` - Changed form information as JSON
        - ``subject`` - (OPTIONAL) Subject of the email
        - ``redirect`` - (OPTIONAL) Redirect URL
        - ``returnPath`` - (OPTIONAL) Return Path
        - ``templateURL`` - (OPTIONAL) Confirm mail template URLhttp://localhost:3000/api/v1/export
            + text/plain
            + text/html
            + application/json
            ```json
            {"text":"","html":""}
* Note: This uses ``PUT`` method. It will overwrite all data in ``mailTemplate`` !
* Example request:
```sh
curl -X PUT -H "Content-Type: application/json" -H "X-Auth-Token: BbTe9w3DTZhPNriUWv1aU6a_FDawlkYjKMQ6I2t3V2k"-H "X-User-Id: 8BxFMSZAc7Ez2iiR6" http://localhost:3000/api/v1/users/8BxFMSZAc7Ez2iiR6 -d '{"mailTemplate":{"subject":"changedSubject","redirect":"RedirectPage","returnPath":"ReturnAddress","templateURL":"changedTemplateURL"}}'
```
* Success-Response:
```json
{
    "status" : "success",
    "data" :
    {
        "subject" : "changedSubject",
        "templateURL" : "changedTemplateURL",
    }
}
```
* Fail-Response:
```json
{
    "status" : "fail",
    "message" : "Errormessage"
}
```
##### Get Double Opt-In mail data (internal function for offchain dapp communication)
* Auth required: false
* Url: ``doi-mail``
* Method: ``GET``
* Query-Parameter:
    + ``name_id`` - Blockchain entry name id
    + ``signature`` - Signature created with:
        + ``message`` - Blockchain entry name id
        + ``private key`` - Confirm dApp private key
