import { Api } from '../rest.js';

Api.addRoute('debug/mail', {authRequired: false}, {
  get: {
    action: function() {
      const data = {
        "from": "fancy@newsletter.com",
        "subject": "Fancy Newsletter Confirmation",
        "redirect": "http://fancynewsletterconfirmationpage.com",
        "returnPath": "noreply@newsletter.com",
        "content": "<html><body><a href='${confirmation_url}'>Confirmation link</a></body></html>"
      }

        try{
            JSON.parse(data);
            console.log('json of debug/mail valid');
        }
        catch (error){
            throw "JSON of debug/mail invalid "+error;
        }

      return {"status": "success", "data": data};
    }
  }
});
