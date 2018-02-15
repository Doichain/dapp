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

##### Get Double Opt-In Mail Data
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
