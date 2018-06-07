import { Api } from '../rest.js';

Api.addRoute('debug/mail', {authRequired: false}, {
  get: {
    action: function() {
      const data = {
        "from": "noreply@doichain.org",
        "subject": "Doichain.org Newsletter Bestätigung",
        "redirect": "http://www.doichain.org/danke-fuer-ihre-anmeldung/",
        "returnPath": "noreply@doichain.org",
        "content":"<!-- content --> <div style='padding: 0px;'><table cellpadding='0' " +
        "cellspacing='0' border='0' width='100%'><tr><td valign='top' " +
        "style='padding: 0px;'><table cellpadding='0' cellspacing='0' " +
        "width='600' align='center' style='max-width: 600px;min-width: " +
        "240px;margin: 0 auto;' class='email-root-wrapper'><tr><td valign='top' " +
        "style='padding: 0px;'><table cellpadding='0' cellspacing='0' " +
        "border='0' width='100%' bgcolor='#ffffff' style='border: 0px " +
        "none;background-color: #ffffff;'><tr><td valign='top' style='padding: " +
        "0px;'><table cellpadding='0' cellspacing='0' width='100%'><tr><td " +
        "style='padding: 0px;'><table cellpadding='0' cellspacing='0' " +
        "border='0' width='100%' bgcolor='#353535' style='border-bottom: 1px" +
        " solid #D4D4D4;background-color: #353535;background-image: url('https://www" +
        ".sendsfx.com/admin/temp/user/5/img_95051737.jpeg');background-repeat: " +
        "no-repeat;background-position: center;'><tr><td valign='top' " +
        "style='padding-top: 5px;padding-right: 10px;padding-bottom: " +
        "10px;padding-left: 10px;'><table cellpadding='0' cellspacing='0' " +
        "width='100%'><tr><td style='padding: 0px;'><table cellpadding='0' " +
        "cellspacing='0' border='0' width='100%' style='border: 0px " +
        "none;'><tr><td valign='top' style='padding: 5px;'><table " +
        "cellpadding='0' cellspacing='0' width='100%'><tr><td " +
        "style='padding: 0px;'><table cellpadding='0' cellspacing='0' " +
        "width='100%'><tr><td align='center' style='padding: 0px;'><table " +
        "cellpadding='0' cellspacing='0' border='0' align='center' " +
        "class='full-width'><tr><td valign='top' align='center' " +
        "style='padding-top: 5px;'><table cellpadding='0' cellspacing='0' " +
        "border='0' width='215'  style='border: 0px none;height: auto;' " +
        "class='full-width'><tr><td valign='top' style='padding: 0px;'><img " +
        "src='https://www.sendsfx.com/admin/temp/user/5/img_57499505.png' " +
        "width='215' height='34' alt='' border='0' style='display: " +
        "block;width: 100%;height: auto;' class='full-width img215x34' /></td> " +
        "</tr> </table> </td> </tr> </table> </td> </tr> </table> <table " +
        "cellpadding='0' cellspacing='0' border='0' width='100%' " +
        "style='border: 0px none;'><tr><td valign='top' style='padding: " +
        "5px;'><table cellpadding='0' cellspacing='0' width='100%'><tr><td " +
        "style='padding: 0px;'><table cellpadding='0' cellspacing='0' " +
        "border='0' width='100%'><tr><td valign='top' style='padding-top: " +
        "43px;padding-right: 5px;padding-bottom: 5px;padding-left: 5px;'><div " +
        "style='text-align: left;font-family: arial;font-size: 17px;color: " +
        "#ffffff;line-height: 18px;mso-line-height: exactly;vertical-align: " +
        "middle;'><p style='padding: 0; margin: 0;text-align: center;'>Anmeldung " +
        "zum Newsletter</p></div></td> </tr> </table> </td> </tr> </table> </td> " +
        "</tr> </table> </td> </tr> </table> </td> </tr> </table> </td> </tr> " +
        "</table> </td> </tr> </table> <table cellpadding='0' cellspacing='0' " +
        "border='0' width='100%'><tr><td valign='top' style='padding-top: " +
        "20px;'><div style='text-align: left;font-family: arial;font-size: " +
        "14px;color: #000000;line-height: 16px;mso-line-height: " +
        "exactly;vertical-align: middle;mso-text-raise: 1px;'><p style='padding: " +
        "0; margin: 0;text-align: center;'>Ihre Anmeldung ist fast " +
        "abgeschlossen<br><a href='${confirmation_url}'>Klicken Sie bitte " +
        "<strong>hier</strong>, um die Anmeldung abzuschließen</a></p></div></t" +
        "d> </tr> </table> <table cellpadding='0' cellspacing='0' border='0' " +
        "width='100%'><tr><td valign='top' style='padding-top: 20px;'><table " +
        "cellpadding='0' cellspacing='0' border='0' width='100%' " +
        "bgcolor='#353535' style='border-top: 1px solid #D4D4D4;background-color" +
        ": #353535;background-image: url('https://www.sendsfx." +
        "com/admin/temp/user/5/img_95051737.jpeg');background-repeat: " +
        "no-repeat;background-position: center;'><tr><td valign='top' " +
        "style='padding-top: 20px;padding-right: 5px;padding-bottom: " +
        "20px;padding-left: 5px;'><table cellpadding='0' cellspacing='0' " +
        "width='100%'><tr><td style='padding: 0px;'><table cellpadding='0' " +
        "cellspacing='0' border='0' width='100%'><tr><td valign='top' " +
        "style='padding: 5px;'><div style='text-align: left;font-family: " +
        "arial;font-size: 11px;color: #ffffff;line-height: 15px;mso-line-height: " +
        "exactly;vertical-align: middle;mso-text-raise: 2px;'><p style='padding: " +
        "0; margin: 0;text-align: center;'><strong>Kontakt</strong><br>service@sende" +
        "ffect.de<br>www.sendeffect.de<br>Telefon: +49 (0) 8571 - 97 39 - " +
        "69-0<br>---<br><span style='font-size: 11px;'><strong>Impressum</strong><" +
        "br>Anschrift: Schulgasse 5, D-84359 Simbach am Inn, eMail: " +
        "service@sendeffect.de<br>Betreiber: WEBanizer AG, Registergericht: " +
        "Amtsgericht Landshut HRB 5177, UstId.: DE 2068 62 070<br>Vorstand: Ottmar " +
        "Neuburger Aufsichtsrat: Tobias Neuburger<br>---<br>Wenn Sie keine " +
        "Informationen mehr von uns erhalten möchten, können Sie " +
        "sich <strong>hier</strong> vom Versand abmelden.</span></p></div></td> " +
        "</tr> </table> </td> </tr> </table> </td> </tr> </table> </td> </tr> " +
        "</table> </td> </tr> </table> </td> </tr> </table> </td> </tr> </table> " +
        "</td> </tr> </table> </div> <!-- content end -->"
      }

      return {"status": "success", "data": data};
    }
  }
});
