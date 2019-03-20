# Doichain dApp - dApp settings.json

## Table of Contents
* [DNS](#dns)
* [App types](#app-types)
* [Doichain](#doichain)
* [Doi Mail Fetch Url](#doi-mail-fetch-url)
* [SMTP](#smtp)

## Settings
The settings are stored in the root folder with the name ``settings.json``

##### DNS
If you setup a dApp in confirm mode you have to set the txt key ``opt-in-key`` with your dApps public key in the DNS Server of the email domain.
For a dApp with enabled verify mode, the DNS txt key ``opt-in-provider`` with the __trusted__ dApp in confirm mode  domain has to be set.

##### App types
Viable dApp types are ``send``, ``confirm`` and ``verify``

##### Doichain
Required settings for each dApp doichain daemon. It contains ``host``, ``port``, ``username`` and ``password``. For the Confirm dApp the wallet address is required to (``address``)

##### Doi Mail Fetch Url
The Url for fetching the doi mail data. Only required for the Send dApp. The Url will be called with a ``get`` request. The dApp expects following answer:
```json
{
  "data": {
    "from": "fancy@newsletter.com",
    "subject": "Fancy Newsletter Confirmation",
    "redirect": "http://fancynewsletterconfirmationpage.com",
    "returnPath": "noreply@newsletter.com",
    "content": "<html><body><a href=\"${confirmation_url}\">Confirmation link</a></body></html>"
  }
}
```

##### SMTP
The SMTP settings of the Confirm dApp for sending double Opt-In mails. Required fields are ``username``, ``password``, ``server`` and ``port``

Example configuration with all three dApps activated:
```json
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
      "port": 587,
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