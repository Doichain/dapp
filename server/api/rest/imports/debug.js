import { Api } from '../rest.js';

Api.addRoute('debug/mail', {authRequired: false}, {
  get: {
    action: function() {
      const data = {
        "from": "doichain@le-space.de",
        "subject": "Fancy Newsletter Confirmation",
        "redirect": "http://doichain.org",
        "returnPath": "noreply@doichain.org",
        "content": "<html><body><a href='${confirmation_url}'>Confirmation link</a></body></html>"
      }

      return {"status": "success", "data": data};
    }
  }
});
