/**
 * NKLogo – zentraler Logo-Baustein
 *
 * Liefert HTML-Strings für das Nasenklammer-Logo.
 * Wird von NKHeader und NKMenu genutzt — Logo-Änderungen
 * nur noch hier.
 *
 * API:
 *   NKLogo.html()              → kompaktes Logo-Img
 *   NKLogo.html('brand')       → großes Logo-Img
 *   NKLogo.brandHtml()         → Logo + „Clever lernen"
 *   NKLogo.brandHtml('Untertitel') → Logo + eigener Text
 *
 * Logo-Datei tauschen:
 *   Nur NKLogo.SRC anpassen — alle Stellen im Projekt
 *   übernehmen das neue Logo automatisch.
 */

(function (root) {
  'use strict';

  var NKLogo = {

    /* Pfad zur Logo-Datei – hier zum Tauschen */
    SRC: 'img/nasenklammer-logo.svg',

    /* Kompaktes oder großes Logo-Bild */
    html: function (modifier) {
      var cls = 'nk-logo' + (modifier ? ' nk-logo--' + modifier : '');
      return (
        '<img class="' + cls + '"' +
        ' src="' + NKLogo.SRC + '"' +
        ' alt="Nasenklammer">'
      );
    },

    /* Logo + Untertitel als Block */
    brandHtml: function (subtitle) {
      return (
        '<div class="nk-logo-brand">' +
          NKLogo.html('brand') +
          '<span class="nk-logo-brand__sub">' +
            (subtitle || 'Clever lernen') +
          '</span>' +
        '</div>'
      );
    },

  };

  root.NKLogo = NKLogo;

}(window));
