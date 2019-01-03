import { Api } from '../rest.js';
Api.addRoute('debug/mail', {authRequired: false}, {
  get: {
    action: function() {
      const data = {
        "from": "noreply@doichain.org",
        "subject": "Doichain.org Newsletter Bestätigung",
        "redirect": "https://www.doichain.org/vielen-dank/",
        "returnPath": "noreply@doichain.org",
        "content":"<style type='text/css' media='screen'>\n" +
            "* {\n" +
            "\tline-height: inherit;\n" +
            "}\n" +
            ".ExternalClass * {\n" +
            "\tline-height: 100%;\n" +
            "}\n" +
            "body, p {\n" +
            "\tmargin: 0;\n" +
            "\tpadding: 0;\n" +
            "\tmargin-bottom: 0;\n" +
            "\t-webkit-text-size-adjust: none;\n" +
            "\t-ms-text-size-adjust: none;\n" +
            "}\n" +
            "img {\n" +
            "\tline-height: 100%;\n" +
            "\toutline: none;\n" +
            "\ttext-decoration: none;\n" +
            "\t-ms-interpolation-mode: bicubic;\n" +
            "}\n" +
            "a img {\n" +
            "\tborder: none;\n" +
            "}\n" +
            "#backgroundTable {\n" +
            "\tmargin: 0;\n" +
            "\tpadding: 0;\n" +
            "\twidth: 100% !important;\n" +
            "}\n" +
            "a, a:link, .no-detect-local a, .appleLinks a {\n" +
            "\tcolor: #5555ff !important;\n" +
            "\ttext-decoration: underline;\n" +
            "}\n" +
            ".ExternalClass {\n" +
            "\tdisplay: block !important;\n" +
            "\twidth: 100%;\n" +
            "}\n" +
            ".ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div {\n" +
            "\tline-height: inherit;\n" +
            "}\n" +
            "table td {\n" +
            "\tborder-collapse: collapse;\n" +
            "\tmso-table-lspace: 0pt;\n" +
            "\tmso-table-rspace: 0pt;\n" +
            "}\n" +
            "sup {\n" +
            "\tposition: relative;\n" +
            "\ttop: 4px;\n" +
            "\tline-height: 7px !important;\n" +
            "\tfont-size: 11px !important;\n" +
            "}\n" +
            ".mobile_link a[href^='tel'], .mobile_link a[href^='sms'] {\n" +
            "\ttext-decoration: default;\n" +
            "\tcolor: #5555ff !important;\n" +
            "\tpointer-events: auto;\n" +
            "\tcursor: default;\n" +
            "}\n" +
            ".no-detect a {\n" +
            "\ttext-decoration: none;\n" +
            "\tcolor: #5555ff;\n" +
            "\tpointer-events: auto;\n" +
            "\tcursor: default;\n" +
            "}\n" +
            "{\n" +
            "color: #5555ff;\n" +
            "}\n" +
            "span {\n" +
            "\tcolor: inherit;\n" +
            "\tborder-bottom: none;\n" +
            "}\n" +
            "span:hover {\n" +
            "\tbackground-color: transparent;\n" +
            "}\n" +
            ".nounderline {\n" +
            "\ttext-decoration: none !important;\n" +
            "}\n" +
            "h1, h2, h3 {\n" +
            "\tmargin: 0;\n" +
            "\tpadding: 0;\n" +
            "}\n" +
            "p {\n" +
            "\tMargin: 0px !important;\n" +
            "}\n" +
            "table[class='email-root-wrapper'] {\n" +
            "\twidth: 600px !important;\n" +
            "}\n" +
            "body {\n" +
            "}\n" +
            "body {\n" +
            "\tmin-width: 280px;\n" +
            "\twidth: 100%;\n" +
            "}\n" +
            "td[class='pattern'] .c112p20r {\n" +
            "\twidth: 20%;\n" +
            "}\n" +
            "td[class='pattern'] .c336p60r {\n" +
            "\twidth: 60.000000000000256%;\n" +
            "}\n" +
            "</style>\n" +
            "<style>\n" +
            "@media only screen and (max-width: 599px), only screen and (max-device-width: 599px), only screen and (max-width: 400px), only screen and (max-device-width: 400px) {\n" +
            ".email-root-wrapper {\n" +
            "\twidth: 100% !important;\n" +
            "}\n" +
            ".full-width {\n" +
            "\twidth: 100% !important;\n" +
            "\theight: auto !important;\n" +
            "\ttext-align: center;\n" +
            "}\n" +
            ".fullwidthhalfleft {\n" +
            "\twidth: 100% !important;\n" +
            "}\n" +
            ".fullwidthhalfright {\n" +
            "\twidth: 100% !important;\n" +
            "}\n" +
            ".fullwidthhalfinner {\n" +
            "\twidth: 100% !important;\n" +
            "\tmargin: 0 auto !important;\n" +
            "\tfloat: none !important;\n" +
            "\tmargin-left: auto !important;\n" +
            "\tmargin-right: auto !important;\n" +
            "\tclear: both !important;\n" +
            "}\n" +
            ".hide {\n" +
            "\tdisplay: none !important;\n" +
            "\twidth: 0px !important;\n" +
            "\theight: 0px !important;\n" +
            "\toverflow: hidden;\n" +
            "}\n" +
            ".desktop-hide {\n" +
            "\tdisplay: block !important;\n" +
            "\twidth: 100% !important;\n" +
            "\theight: auto !important;\n" +
            "\toverflow: hidden;\n" +
            "\tmax-height: inherit !important;\n" +
            "}\n" +
            ".c112p20r {\n" +
            "\twidth: 100% !important;\n" +
            "\tfloat: none;\n" +
            "}\n" +
            ".c336p60r {\n" +
            "\twidth: 100% !important;\n" +
            "\tfloat: none;\n" +
            "}\n" +
            "}\n" +
            "</style>\n" +
            "<style>\n" +
            "@media only screen and (min-width: 600px) {\n" +
            "td[class='pattern'] .c112p20r {\n" +
            "\twidth: 112px !important;\n" +
            "}\n" +
            "td[class='pattern'] .c336p60r {\n" +
            "\twidth: 336px !important;\n" +
            "}\n" +
            "}\n" +
            "\n" +
            "@media only screen and (max-width: 599px), only screen and (max-device-width: 599px), only screen and (max-width: 400px), only screen and (max-device-width: 400px) {\n" +
            "table[class='email-root-wrapper'] {\n" +
            "\twidth: 100% !important;\n" +
            "}\n" +
            "td[class='wrap'] .full-width {\n" +
            "\twidth: 100% !important;\n" +
            "\theight: auto !important;\n" +
            "}\n" +
            "td[class='wrap'] .fullwidthhalfleft {\n" +
            "\twidth: 100% !important;\n" +
            "}\n" +
            "td[class='wrap'] .fullwidthhalfright {\n" +
            "\twidth: 100% !important;\n" +
            "}\n" +
            "td[class='wrap'] .fullwidthhalfinner {\n" +
            "\twidth: 100% !important;\n" +
            "\tmargin: 0 auto !important;\n" +
            "\tfloat: none !important;\n" +
            "\tmargin-left: auto !important;\n" +
            "\tmargin-right: auto !important;\n" +
            "\tclear: both !important;\n" +
            "}\n" +
            "td[class='wrap'] .hide {\n" +
            "\tdisplay: none !important;\n" +
            "\twidth: 0px;\n" +
            "\theight: 0px;\n" +
            "\toverflow: hidden;\n" +
            "}\n" +
            "td[class='pattern'] .c112p20r {\n" +
            "\twidth: 100% !important;\n" +
            "}\n" +
            "td[class='pattern'] .c336p60r {\n" +
            "\twidth: 100% !important;\n" +
            "}\n" +
            "}\n" +
            "\n" +
            "@media yahoo {\n" +
            "table {\n" +
            "\tfloat: none !important;\n" +
            "\theight: auto;\n" +
            "}\n" +
            "table[align='left'] {\n" +
            "\tfloat: left !important;\n" +
            "}\n" +
            "td[align='left'] {\n" +
            "\tfloat: left !important;\n" +
            "\theight: auto;\n" +
            "}\n" +
            "table[align='center'] {\n" +
            "\tmargin: 0 auto;\n" +
            "}\n" +
            "td[align='center'] {\n" +
            "\tmargin: 0 auto;\n" +
            "\theight: auto;\n" +
            "}\n" +
            "table[align='right'] {\n" +
            "\tfloat: right !important;\n" +
            "}\n" +
            "td[align='right'] {\n" +
            "\tfloat: right !important;\n" +
            "\theight: auto;\n" +
            "}\n" +
            "}\n" +
            "</style>\n" +
            "\n" +
            "<!--[if (gte IE 7) & (vml)]>\n" +
            "<style type='text/css'>\n" +
            "html, body {margin:0 !important; padding:0px !important;}\n" +
            "img.full-width { position: relative !important; }\n" +
            "\n" +
            ".img240x30 { width: 240px !important; height: 30px !important;}\n" +
            ".img20x20 { width: 20px !important; height: 20px !important;}\n" +
            "\n" +
            "</style>\n" +
            "<![endif]-->\n" +
            "\n" +
            "<!--[if gte mso 9]>\n" +
            "<style type='text/css'>\n" +
            ".mso-font-fix-arial { font-family: Arial, sans-serif;}\n" +
            ".mso-font-fix-georgia { font-family: Georgia, sans-serif;}\n" +
            ".mso-font-fix-tahoma { font-family: Tahoma, sans-serif;}\n" +
            ".mso-font-fix-times_new_roman { font-family: 'Times New Roman', sans-serif;}\n" +
            ".mso-font-fix-trebuchet_ms { font-family: 'Trebuchet MS', sans-serif;}\n" +
            ".mso-font-fix-verdana { font-family: Verdana, sans-serif;}\n" +
            "</style>\n" +
            "<![endif]-->\n" +
            "\n" +
            "<!--[if gte mso 9]>\n" +
            "<style type='text/css'>\n" +
            "table, td {\n" +
            "border-collapse: collapse !important;\n" +
            "mso-table-lspace: 0px !important;\n" +
            "mso-table-rspace: 0px !important;\n" +
            "}\n" +
            "\n" +
            ".email-root-wrapper { width 600px !important;}\n" +
            ".imglink { font-size: 0px; }\n" +
            ".edm_button { font-size: 0px; }\n" +
            "</style>\n" +
            "<![endif]-->\n" +
            "\n" +
            "<!--[if gte mso 15]>\n" +
            "<style type='text/css'>\n" +
            "table {\n" +
            "font-size:0px;\n" +
            "mso-margin-top-alt:0px;\n" +
            "}\n" +
            "\n" +
            ".fullwidthhalfleft {\n" +
            "width: 49% !important;\n" +
            "float:left !important;\n" +
            "}\n" +
            "\n" +
            ".fullwidthhalfright {\n" +
            "width: 50% !important;\n" +
            "float:right !important;\n" +
            "}\n" +
            "</style>\n" +
            "<![endif]-->\n" +
            "<style type='text/css' media='(pointer) and (min-color-index:0)'>\n" +
            "html, body {\n" +
            "\tbackground-image: none !important;\n" +
            "\tbackground-color: #ebebeb !important;\n" +
            "\tmargin: 0 !important;\n" +
            "\tpadding: 0 !important;\n" +
            "}\n" +
            "</style>\n" +
            "</head>\n" +
            "<body leftmargin='0' marginwidth='0' topmargin='0' marginheight='0' offset='0' background=\"\" bgcolor='#ebebeb' style='font-family:Arial, sans-serif; font-size:0px;margin:0;padding:0; '>\n" +
            "<!--[if t]><![endif]--><!--[if t]><![endif]--><!--[if t]><![endif]--><!--[if t]><![endif]--><!--[if t]><![endif]--><!--[if t]><![endif]-->\n" +
            "<table align='center' border='0' cellpadding='0' cellspacing='0' background=\"\"  height='100%' width='100%' id='backgroundTable'>\n" +
            "  <tr>\n" +
            "    <td class='wrap' align='center' valign='top' width='100%'>\n" +
            "\t\t<center>\n" +
            "        <!-- content -->\n" +
            "        \t<div style='padding: 0px;'>\n" +
            "        \t  <table cellpadding='0' cellspacing='0' border='0' width='100%' bgcolor='#ebebeb'>\n" +
            "           \t\t <tr>\n" +
            "            \t\t  <td valign='top' style='padding: 0px;'>\n" +
            "\t\t\t\t\t\t  <table cellpadding='0' cellspacing='0' width='600' align='center' style='max-width: 600px;min-width: 240px;margin: 0 auto;' class='email-root-wrapper'>\n" +
            "                 \t\t \t\t<tr>\n" +
            "                   \t\t\t\t\t <td valign='top' style='padding: 0px;'>\n" +
            "\t\t\t\t\t\t\t\t \t\t<table cellpadding='0' cellspacing='0' border='0' width='100%' bgcolor='#FFFFFF' style='border: 0px none;background-color: #FFFFFF;'>\n" +
            "                       \t\t\t\t\t\t <tr>\n" +
            "                       \t\t\t  \t\t\t\t <td valign='top' style='padding-top: 30px;padding-right: 20px;padding-bottom: 35px;padding-left: 20px;'>\n" +
            "\t\t\t\t\t\t\t\t\t   \t\t\t\t\n" +
            "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<table cellpadding='0'\n" +
            "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tcellspacing='0' border='0' align='center' width='240'  style='border: 0px none;height: auto;' class='full-width'>\n" +
            "                                         \t \t\t\t\t\t\t\t\t\t<tr>\n" +
            "                                            \t\t\t\t\t\t\t\t\t\t<td valign='top' style='padding: 0px;'><img src='https://sf26.sendsfx.com/admin/temp/user/17/doichain_100h.png' width='240' height='30' alt=\"\" border='0' style='display: block;width: 100%;height: auto;' class='full-width img240x30' /></td>\n" +
            "                                         \t \t\t\t\t\t\t\t\t\t</tr>\n" +
            "                                        \t\t\t\t\t\t\t\t\t</table>\n" +
            "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\n" +
            "\t\t\t\t\t\t\t\t\t\t\t\t</td>\n" +
            "                      \t\t  \t\t\t\t</tr>\n" +
            "                      \t\t\t\t\t</table>\n" +
            "\t\t\t\t\t\t\t\t \n" +
            "\t\t\t\t\t\t\t\t \n" +
            "                      <table cellpadding='0' cellspacing='0' border='0' width='100%' bgcolor='#0071aa' style='border: 0px none;background-color: #0071aa;background-image: url('https://sf26.sendsfx.com/admin/temp/user/17/blue-bg.jpg');background-repeat: no-repeat ;background-position: center;'>\n" +
            "                        <tr>\n" +
            "                          <td valign='top' style='padding-top: 40px;padding-right: 20px;padding-bottom: 45px;padding-left: 20px;'><table cellpadding='0' cellspacing='0' width='100%'>\n" +
            "                              <tr>\n" +
            "                                <td style='padding: 0px;' class='pattern'><table cellpadding='0' cellspacing='0' border='0' width='100%'>\n" +
            "                                    <tr>\n" +
            "                                      <td valign='top' style='padding-bottom: 10px;'><div style='text-align: left;font-family: arial;font-size: 20px;color: #ffffff;line-height: 30px;mso-line-height: exactly;mso-text-raise: 5px;'>\n" +
            "                                          <p\n" +
            "style='padding: 0; margin: 0;text-align: center;'>Bitte bestätigen Sie Ihre Anmeldung</p>\n" +
            "                                        </div></td>\n" +
            "                                    </tr>\n" +
            "                                  </table>\n" +
            "                                  <table cellpadding='0' cellspacing='0' border='0' width='100%'>\n" +
            "                                    <tr>\n" +
            "                                      <td valign='top' style='padding: 0;mso-cellspacing: 0in;'><table cellpadding='0' cellspacing='0' border='0' align='left' width='112'  style='float: left;' class='c112p20r'>\n" +
            "                                          <tr>\n" +
            "                                            <td valign='top' style='padding: 0px;'><table cellpadding='0' cellspacing='0' border='0' width='100%' style='border: 0px none;' class='hide'>\n" +
            "                                                <tr>\n" +
            "                                                  <td valign='top' style='padding: 0px;'><table cellpadding='0' cellspacing='0' width='100%'>\n" +
            "                                                      <tr>\n" +
            "                                                        <td style='padding: 0px;'><table cellpadding='0' cellspacing='0' width='100%'>\n" +
            "                                                            <tr>\n" +
            "                                                              <td align='center' style='padding: 0px;'><table cellpadding='0' cellspacing='0' border='0' align='center' width='20'  style='border: 0px none;height: auto;'>\n" +
            "                                                                  <tr>\n" +
            "                                                                    <td valign='top' style='padding: 0px;'><img\n" +
            "src='https://sf26.sendsfx.com/admin/temp/user/17/img_89837318.png' width='20' height='20' alt=\"\" border='0' style='display: block;' class='img20x20' /></td>\n" +
            "                                                                  </tr>\n" +
            "                                                                </table></td>\n" +
            "                                                            </tr>\n" +
            "                                                          </table></td>\n" +
            "                                                      </tr>\n" +
            "                                                    </table></td>\n" +
            "                                                </tr>\n" +
            "                                              </table></td>\n" +
            "                                          </tr>\n" +
            "                                        </table>\n" +
            "                                        \n" +
            "                                        <!--[if gte mso 9]></td><td valign='top' style='padding:0;'><![endif]-->\n" +
            "                                        \n" +
            "                                        <table cellpadding='0' cellspacing='0' border='0' align='left' width='336'  style='float: left;' class='c336p60r'>\n" +
            "                                          <tr>\n" +
            "                                            <td valign='top' style='padding: 0px;'><table cellpadding='0' cellspacing='0' border='0' width='100%'>\n" +
            "                                                <tr>\n" +
            "                                                  <td valign='top' style='padding-bottom: 30px;'><table cellpadding='0' cellspacing='0' width='100%'>\n" +
            "                                                      <tr>\n" +
            "                                                        <td style='padding: 0px;'><table cellpadding='0' cellspacing='0' border='0' width='100%' style='border-top: 2px solid #ffffff;'>\n" +
            "                                                            <tr>\n" +
            "                                                              <td valign='top'><table cellpadding='0' cellspacing='0' width='100%'>\n" +
            "                                                                  <tr>\n" +
            "                                                                    <td style='padding: 0px;'></td>\n" +
            "                                                                  </tr>\n" +
            "                                                                </table></td>\n" +
            "                                                            </tr>\n" +
            "                                                          </table></td>\n" +
            "                                                      </tr>\n" +
            "                                                    </table></td>\n" +
            "                                                </tr>\n" +
            "                                              </table></td>\n" +
            "                                          </tr>\n" +
            "                                        </table>\n" +
            "                                        \n" +
            "                                        <!--[if gte mso 9]></td><td valign='top' style='padding:0;'><![endif]-->\n" +
            "                                        \n" +
            "                                        <table cellpadding='0' cellspacing='0' border='0' align='left' width='112'  style='float: left;' class='c112p20r'>\n" +
            "                                          <tr>\n" +
            "                                            <td valign='top' style='padding: 0px;'><table cellpadding='0' cellspacing='0' border='0' width='100%' style='border: 0px none;' class='hide'>\n" +
            "                                                <tr>\n" +
            "                                                  <td valign='top' style='padding: 0px;'><table cellpadding='0' cellspacing='0' width='100%'>\n" +
            "                                                      <tr>\n" +
            "                                                        <td style='padding: 0px;'><table cellpadding='0' cellspacing='0' width='100%'>\n" +
            "                                                            <tr>\n" +
            "                                                              <td align='center' style='padding: 0px;'><table cellpadding='0' cellspacing='0' border='0' align='center' width='20'  style='border: 0px none;height: auto;'>\n" +
            "                                                                  <tr>\n" +
            "                                                                    <td valign='top' style='padding: 0px;'><img src='https://sf26.sendsfx.com/admin/temp/user/17/img_89837318.png' width='20' height='20' alt=\"\" border='0' style='display: block;' class='img20x20'\n" +
            "/></td>\n" +
            "                                                                  </tr>\n" +
            "                                                                </table></td>\n" +
            "                                                            </tr>\n" +
            "                                                          </table></td>\n" +
            "                                                      </tr>\n" +
            "                                                    </table></td>\n" +
            "                                                </tr>\n" +
            "                                              </table></td>\n" +
            "                                          </tr>\n" +
            "                                        </table></td>\n" +
            "                                    </tr>\n" +
            "                                  </table>\n" +
            "                                  <table cellpadding='0' cellspacing='0' border='0' width='100%'>\n" +
            "                                    <tr>\n" +
            "                                      <td valign='top' style='padding-bottom: 20px;'><div style='text-align: left;font-family: arial;font-size: 16px;color: #ffffff;line-height: 26px;mso-line-height: exactly;mso-text-raise: 5px;'>\n" +
            "                                          <p style='padding: 0; margin: 0;text-align: center;'>Vielen Dank, dass Sie sich für unseren Newsletter angemeldet haben.</p>\n" +
            "                                          <p style='padding: 0; margin: 0;text-align: center;'>Um diese E-Mail-Adresse und Ihre kostenlose Anmeldung zu bestätigen, klicken Sie bitte jetzt auf den folgenden Button:</p>\n" +
            "                                        </div></td>\n" +
            "                                    </tr>\n" +
            "                                  </table>\n" +
            "                                  <table cellpadding='0' cellspacing='0' width='100%'>\n" +
            "                                    <tr>\n" +
            "                                      <td align='center' style='padding: 0px;'><table cellpadding='0' cellspacing='0' border='0' align='center' style='text-align: center;color: #000;' class='full-width'>\n" +
            "                                          <tr>\n" +
            "                                            <td valign='top' align='center' style='padding-right: 10px;padding-bottom: 30px;padding-left: 10px;'><table cellpadding='0' cellspacing='0' border='0' bgcolor='#85ac1c' style='border: 0px none;border-radius: 5px;border-collapse: separate !important;background-color: #85ac1c;' class='full-width'>\n" +
            "                                                <tr>\n" +
            "                                                  <td valign='top' align='center' style='padding: 12px;'><a href='${confirmation_url}' target='_blank' style='text-decoration: none;' class='edm_button'><span style='font-family: arial;font-size: 18px;color: #ffffff;line-height: 28px;text-decoration: none;'><span\n" +
            "style='font-size: 18px;'>Jetzt Anmeldung best&auml;tigen</span></span> </a></td>\n" +
            "                                                </tr>\n" +
            "                                              </table></td>\n" +
            "                                          </tr>\n" +
            "                                        </table></td>\n" +
            "                                    </tr>\n" +
            "                                  </table>\n" +
            "                                  <div style='text-align: left;font-family: arial;font-size: 12px;color: #ffffff;line-height: 22px;mso-line-height: exactly;mso-text-raise: 5px;'>\n" +
            "                                    <p style='padding: 0; margin: 0;text-align: center;'>Wenn Sie ihre E-Mail-Adresse nicht bestätigen, können keine Newsletter zugestellt werden. Ihr Einverständnis können Sie selbstverständlich jederzeit widerrufen. Sollte es sich bei der Anmeldung um ein Versehen handeln oder wurde der Newsletter nicht in Ihrem Namen bestellt, können Sie diese E-Mail einfach ignorieren. Ihnen werden keine weiteren Nachrichten zugeschickt.</p>\n" +
            "                                  </div></td>\n" +
            "                              </tr>\n" +
            "                            </table></td>\n" +
            "                        </tr>\n" +
            "                      </table>\n" +
            "                      <table cellpadding='0' cellspacing='0' border='0' width='100%' bgcolor='#ffffff' style='border: 0px none;background-color: #ffffff;'>\n" +
            "                        <tr>\n" +
            "                          <td valign='top' style='padding-top: 30px;padding-right: 20px;padding-bottom: 35px;padding-left: 20px;'><table cellpadding='0' cellspacing='0' width='100%'>\n" +
            "                              <tr>\n" +
            "                                <td style='padding: 0px;'><table cellpadding='0' cellspacing='0' border='0' width='100%'>\n" +
            "                                    <tr>\n" +
            "                                      <td valign='top' style='padding-bottom: 25px;'><div style='text-align: left;font-family: arial;font-size: 12px;color: #333333;line-height: 22px;mso-line-height: exactly;mso-text-raise: 5px;'>\n" +
            "                                          <p style='padding: 0; margin: 0;text-align: center;'><span style='line-height: 3;'><strong>Kontakt</strong></span><br>\n" +
            "                                            service@sendeffect.de<br>\n" +
            "                                            www.sendeffect.de<br>\n" +
            "                                            Telefon: +49 (0) 8571 - 97 39 - 69-0</p>\n" +
            "                                        </div></td>\n" +
            "                                    </tr>\n" +
            "                                  </table>\n" +
            "                                  <div style='text-align: left;font-family: arial;font-size: 12px;color: #333333;line-height: 22px;mso-line-height: exactly;mso-text-raise: 5px;'>\n" +
            "                                    <p style='padding: 0; margin: 0;text-align: center;'><span style='line-height: 3;'><strong>Impressum</strong></span><br>\n" +
            "                                      Anschrift: Schulgasse 5, D-84359 Simbach am Inn, eMail: service@sendeffect.de<br>\n" +
            "                                      Betreiber: WEBanizer AG, Registergericht: Amtsgericht Landshut HRB 5177, UstId.: DE 2068 62 070<br>\n" +
            "                                      Vorstand: Ottmar Neuburger, Aufsichtsrat: Tobias Neuburger</p>\n" +
            "                                  </div></td>\n" +
            "                              </tr>\n" +
            "                            </table></td>\n" +
            "                        </tr>\n" +
            "                      </table></td>\n" +
            "                  </tr>\n" +
            "                </table></td>\n" +
            "            </tr>\n" +
            "          </table>\n" +
            "        </div>\n" +
            "        <!-- content end -->\n" +
            "      </center></td>\n" +
            "  </tr>\n" +
            "</table>"
      }

      return {"status": "success", "data": data};
    }
  }
});
