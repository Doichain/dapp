import { Api } from '../rest.js';
import getPrivateKeyFromWif from '../../../../imports/modules/server/namecoin/get_private-key_from_wif.js'
import decryptMessage from '../../../../imports/modules/server/namecoin/decrypt_message.js'

Api.addRoute('debug/mail', {authRequired: false}, {
  get: {
    action: function() {
      const data = {
        from: "fancy@newsletter.com",
        subject: "Fancy Newsletter Confirmation",
        redirect: "http://fancynewsletterconfirmationpage.com",
        returnPath: "noreply@newsletter.com",
        content: "<html><body><a href=\"${confirmation_url}\">Confirmation link</a></body></html>"
      }
      return {status: 'success', data: {...data}};
    }
  }
});

Api.addRoute('debug', {authRequired: false}, {
  get: {
    action: function() {
      const val = getPrivateKeyFromWif({wif: "TeBdYPAZREVtaUkej2HfLyFaAkeGqhPx2j3gTuZzovQUe3imwRCo"})
      return {status: 'success', data: val};
    }
  }
});

Api.addRoute('debug2', {authRequired: false}, {
  get: {
    action: function() {
      const val = decryptMessage({privateKey: "183f0880f61963aedc40ddf11e74e043c35e3dbd4182216109b36093efed666f01", message: "04dae720c37458dd4e60d110cda00176322f0bf2fdb12d44bc55ff95efa428d8a06d366572edcfbe407bf6b3ec3235b3ec3e2ce2bf0c641fe167d9cc2050dc6731d2765aac23cfdc7a1a1c8e24d5981b372909e835c6c9cedaf41712f8e6f24dfa2229e4b4ebfc68213d02c63978445527454a6fdf54678f00ac9a1878ffa7a47c"})
      return {status: 'success', data: val};
    }
  }
});
