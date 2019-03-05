## Table of Contents
- [Docker Installation](#docker-installation)
- [Manual Installation](#manual-installation)
- [Settings](#settings)
    * [DNS](#dns)
    * [App types](#app-types)
    * [Namecoin](#namecoin)
    * [Mail data](#mail-data)
    * [SMTP](#smtp)
- [REST API](#rest-api)
    * [Authentification](#authentification)
    * [Calls (Send - dApp)](#calls--send---dapp-)
        - [Create Opt-In](#create-opt-in)
        - [Get Double Opt-In mail data](#get-double-opt-in-mail-data)
    * [Calls (Confirm - dApp)](#calls--confirm---dapp-)
        - [Confirm Opt-In](#confirm-opt-in)
    * [Calls (Verify - dApp)](#calls--verify---dapp-)
        - [Verify Opt-In](#verify-opt-in)
    * [Calls (Users)](#calls--users-)
        - [Create user](#create-user)
        - [Update user](#update-user)
- [UML](#uml)
    * [Activity diagram](#activity-diagram)
    * [Sequence diagram](#sequence-diagram)
- [Blockchain entry name id](#blockchain-entry-name-id)

## Docker Installation
1. Install Docker https://docs.docker.com/
2. Follow instructions on https://github.com/Doichain/docker
## Manual Installation
1. Install Doichain node by following classical instructions for
    - Unix https://github.com/Doichain/core/blob/master/doc/build-unix.md
    - Mac OS-X https://github.com/Doichain/core/blob/master/doc/build-osx.md
    - Windows https://github.com/Doichain/core/blob/master/doc/build-windows.md
2. Install Meteor from https://www.meteor.com/ with ``curl https://install.meteor.com/ | sh``on linux (see website for other operating systems)
3. Clone this repository into a doichain-dapp directory like ```git clone https://github.com/Doichain/dapp.git doichain-dapp```
4. Execute a ``cd doichain-dapp; meteor npm install``
5. Configure ``settings.json``
6. If you want to enable the confirmation node, configure your [DNS](#dns) TXT field with either:
    - an ``opt-in-provider=your-email-domain.com`` field when you want to trust a third party Doichain node with
    - or ``opt-in-key=your-doichain-public-key`` field of you doichain node


## Settings
The settings are stored in the root folder with the name ``settings.json``

##### DNS
If you setup a dApp in confirm mode you have to set the txt key ``opt-in-key`` with your dApps public key in the DNS Server of the email domain.
For a dApp with enabled verify mode, the DNS txt key ``opt-in-provider`` with the __trusted__ dApp in confirm mode  domain has to be set.

##### App types
Viable dApp types are ``send``, ``confirm`` and ``verify``

##### Namecoin
Required settings for each dApp namecoin daemon. It contains ``host``, ``port``, ``username`` and ``password``. For the Confirm dApp the wallet address is required to (``address``)

##### Doi Mail Fetch Url
The Url for fetching the doi mail data. Only required for the Send dApp. The Url will be called with a ``get`` request. The dApp expects following answer:
```
{
  "data": {
    from: "fancy@newsletter.com",
    subject: "Fancy Newsletter Confirmation",
    redirect: "http://fancynewsletterconfirmationpage.com",
    returnPath: "noreply@newsletter.com",
    content: "<html><body><a href=\"${confirmation_url}\">Confirmation link</a></body></html>"
  }
}
```

##### SMTP
The SMTP settings of the Confirm dApp for sending double Opt-In mails. Required fields are ``username``, ``password``, ``server`` and ``port``

Example configuration with all three dApps activated:
```
{
  "app": {
    "types": ["send", "confirm", "verify"]
  },
  "send": {
    "doichain": {
      "host": "localhost",
      "port": 8339,
      "username": "admin",
      "password": "****"
    },
    "doiMailFetchUrl": "localhost:3000/api/v1/debug/mail"
  },
  "confirm": {
    "smtp": {
      "username": "admin",
      "password": "****",
      "server":   "smtp.your-email.com",
      "port": 587
      "defaultFrom": "doichain@your-email.com"
    },
    "doichain": {
      "host": "localhost",
      "port": 8339,
      "username": "admin",
      "password": "****",
      "address": "n2vjfuvn2P81cBhRgRQrcsosg2YZusCjFd"
    }
  },
  "verify": {
    "doichain": {
      "host": "localhost",
      "port": 8339,
      "username": "admin",
      "password": "****"
    }
  }
}
```

## REST API
List of REST API calls for the version 1.
All call urls in version 1 start with ``/api/v1/``

### Authentification
You need a valide token for some of the REST calls. Get the token with:

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
    + ``data`` - (OPTIONAL) Recipient/Opt-In data
        - ``screenshot`` - (OPTIONAL) Can store a screenshot of the subscription
        - ``templateParam`` - (OPTIONAL) Parameters to be added to template URL
        - ``redirectParam`` - (OPTIONAL) Parameters to be added to redirect URL
* Example request:
```sh
curl -X POST -H "X-Auth-Token: Ui5rDPEf2kCugdAafUoU7Mh7--bkkL5hm3lVg6DN132" -H "X-User-Id: szkkeuSpfKueyskLz" http://localhost:3000/api/v1/opt-in -d '{"recipient_mail:recipentMail", "sender_mail":"Sendermail", "data":{"redirectParam":{"id":"hash"}}}'
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
##### Export
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
* Url: ``users/:userId``
* Method: ``PUT``
* Parameter:
    + ``mailTemplate`` - Changed form information as JSON
        - ``subject`` - (OPTIONAL) Subject of the email
        - ``redirect`` - (OPTIONAL) Redirect URL
        - ``returnPath`` - (OPTIONAL) Return Path
        - ``templateURL`` - (OPTIONAL) Confirm mail template URLhttp://localhost:3000/api/v1/export
* Note: This uses ``PUT`` method. It will overwrite all data in ``mailTemplate`` !
* Example request:
```sh
curl -X PUT -H "X-Auth-Token: BbTe9w3DTZhPNriUWv1aU6a_FDawlkYjKMQ6I2t3V2k"-H "X-User-Id: 8BxFMSZAc7Ez2iiR6" http://localhost:3000/api/v1/users/8BxFMSZAc7Ez2iiR6 -d '{"mailTemplate":{"subject":"changedSubject","redirect":"RedirectPage","returnPath":"ReturnAddress","templateURL":"changedTemplateURL"}}'
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
## Blockchain entry name id
The name id is a 256-bit, ECDSA valid, number represanted as a 32 byte (64 characters) string (Same as every Bitcoin privateKey). See also: https://en.bitcoin.it/wiki/Private_key
## UML

##### activity-diagram

![Alt activity diagram](doc/uml/activity.svg)

##### sequence-diagram

![Alt secquence diagram](doc/uml/sequence.svg)

## Developer Section
##### How to start developing
1. Install Meteor from meteor.com
2. Checkout this repository ``git clone https://github.com/Doichain/dapp.git; cd dapp;meteor npm install``
3. Start development environment with Docker Compose ``docker-compose -f -f docker-compose-test-regtest.yml up``
4. Start Bobs meteor ``MONGO_URL=mongodb://localhost:28017/bob meteor run --settings settings-bob.json --port 4000``
5. Start Alice meteor durring development ``MONGO_URL=mongodb://localhost:28017/alice meteor run --settings settings-alice.json --port 3000``
6. Or run tests on Alice ``meteor npm run test-alice``