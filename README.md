## Table of Contents
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
- [Blockchain entry name id](#blockchain-entry-name-id)

## Settings
The settings are stored in the root folder with the name ``settings.json``

##### DNS
If you setup a Confirm dApp you have to set the txt key ``opt-in-key`` with your dApps public key.
For a Verfiy dApp the txt key ``opt-in-provider`` with the __trusted__ Confirm dApp domain has to be set.

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
    "namecoin": {
      "host": "192.168.99.100",
      "port": 18332,
      "username": "admin",
      "password": "****"
    },
    "doiMailFetchUrl": "localhost:3000/api/v1/debug/mail"
  },
  "confirm": {
    "smtp": {
      "username": "admin",
      "password": "****",
      "server":   "smtp.provider.com",
      "port": 587
    },
    "namecoin": {
      "host": "192.168.99.100",
      "port": 19332,
      "username": "admin",
      "password": "****",
      "address": "n2vjfuvn2P81cBhRgRQrcsosg2YZusCjFd"
    }
  },
  "verify": {
    "namecoin": {
      "host": "192.168.99.100",
      "port": 18332,
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
* Role required: ``admin``
* Url: ``opt-in``
* Method: ``POST``
* Query-Parameter:
    + ``recipient_mail`` - Email of the recipient
    + ``sender_mail`` - Email of the sender
    + ``customer_id`` - Recipient customer number (Currently unused)
    + ``data`` - (OPTIONAL) JSON string with recipient/Opt-In data (Currently unused)

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

## Blockchain entry name id
The name id is a 256-bit, ECDSA valid, number represanted as a 32 byte (64 characters) string (Same as every Bitcoin privateKey). See also: https://en.bitcoin.it/wiki/Private_key
