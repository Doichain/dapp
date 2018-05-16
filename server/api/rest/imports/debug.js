import { Api } from '../rest.js';

Api.addRoute('debug/mail', {authRequired: false}, {
  get: {
    action: function() {
      const data = {
        "from": "noreply@doichain.org",
        "subject": "Anfrage zur Anmeldung",
        "redirect": "http://www.doichain.org/anmeldung-abgeschlossen",
        "returnPath": "noreply@doichain.org",
        "content": "<html><body><a href='${confirmation_url}'>Confirmation link</a></body></html>"
      }

      return {"status": "success", "data": data};
    }
  }
});
