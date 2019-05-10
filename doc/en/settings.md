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
If you setup a dApp in confirm mode (and only then) you have to additionally set the txt key ``doichain-opt-in-key`` with your dApps public key in the DNS Server of the email domain.
For a dApp with enabled verify mode, the DNS txt key ``doichain-opt-in-provider`` with the __trusted__ dApp in confirm mode  domain has to be set.
Valid example entries are: 
```
dig -t TXT doichain.org

doichain.org.		3600	IN	TXT	"doichain-testnet-opt-in-key=03d824a6fb5b4cc5f693dac63b5ebe9fad975f742489a1863f06fec36e42ebfcc9"
doichain.org.		3600	IN	TXT	"doichain-opt-in-key=0287fba776149f703941b177aa60849935e0786c5e6c67e20b05d6fa37377d053c"
doichain.org.		3600	IN	TXT	"doichain-opt-in-provider=doichain.org"

dig -t TXT le-space.de
le-space.de.		3600	IN	TXT	"doichain-opt-in-key=03036b8c6fae78733cc8a897c8ea0a2e306d93a0a3441da4601f3c17acbae66143"
le-space.de.		3600	IN	TXT	"doichain-opt-in-provider=le-space.de"
le-space.de.		3600	IN	TXT	"doichain-testnet-opt-in-provider=le-space.de"
le-space.de.		3600	IN	TXT	"doichain-testnet-opt-in-key=03d3a2f962ca68ff7b7b937f01416e7f2779441cb6e15ed151efc1a11e1ae9571f

dig -t TXT doi.works
doi.works.		3600	IN	TXT	"doichain-opt-in-provider=le-space.de"
doi.works.		3600	IN	TXT	"doichain-opt-in-key=03036b8c6fae78733cc8a897c8ea0a2e306d93a0a3441da4601f3c17acbae66143"
```
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
      "smtps": true,
      "NODE_TLS_REJECT_UNAUTHORIZED":1,
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