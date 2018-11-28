## REST API
List of REST API calls for the version 1.
All call urls in version 1 start with ``/api/v1/``

### Authentification
You need a valide token for some of the REST calls. Get the token with:

* Url: ``login``
* Parameter:
    + ``username`` - Authentification Username
    + ``password`` - Authentification Password

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
    + ``data`` - (OPTIONAL) JSON string with recipient/Opt-In data
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
##### Export
* Auth required: yes
* Role required: ``none``
* Url: ``export``
* Method: ``GET``
* Query-Parameter:
    + ``status`` - not yet working
    + ``ownerid`` - (ADMIN ONLY,OPTIONAL) userId of specific Opt-in owner 
* Success-Response:
```json
{
    "status" : "success",
    "data" : 
    [
        {
            "id":"OptInId",
            "createdAt":"2018-11-28T12:48:41.860Z",
            "confirmedAt":"2018-11-28T12:48:41.860Z",
            "nameId":1,
            "sender":1,
            "recipient":1
        },
                {
            "id":"OptInId",
            "createdAt":"2018-11-28T12:48:41.860Z",
            "confirmedAt":"2018-11-28T12:48:41.860Z",
            "nameId":1,
            "sender":1,
            "recipient":1
        },
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
##### Get Double Opt-In mail data
* Auth required: false
* Url: ``doi-mail``
* Method: ``GET``
* Query-Parameter:
    + ``name_id`` - Blockchain entry name id
    + ``signature`` - Signature created with:
        + ``message`` - Blockchain entry name id
        + ``private key`` - Confirm dApp private key

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
* Auth required: Yes
* Role required: ``admin``
* Url: ``opt-in/verify``
* Method: ``GET``
* Parameter:
    + ``recipient_mail`` - Email of the recipient
    + ``sender_mail`` - Email of the sender
    + ``name_id`` - Blockchain entry name id
    + ``recipient_public_key`` - Public key of the recipient

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
* Url: ``users/:id``
* Method: ``PUT``
* Parameter:
    + ``mailTemplate`` - Changed form information as JSON
        - ``subject`` - (OPTIONAL) Subject of the email
        - ``redirect`` - (OPTIONAL) Redirect URL
        - ``returnPath`` - (OPTIONAL) Return Path
        - ``templateURL`` - (OPTIONAL) Confirm mail template URL
* Note: This uses ``PUT`` method. It will overwrite all data in ``mailTemplate`` !
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
