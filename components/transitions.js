/**
 * NKTransitions – sanfte Seitenübergänge
 *
 * Beim Laden: body.nk-entering  → fade + slide in
 * Beim Verlassen: body.nk-leaving → fade + slide out, dann navigate
 *
 * Funktioniert automatisch für alle internen <a>-Links.
 * Externe Links, target="_blank" und Anker (#) werden übersprungen.
 */

(function () {
  'use strict';

  var DURATION_OUT = 180;   /* ms – muss mit nk-page-out übereinstimmen */

  /* ── Einblenden beim Laden ────────────────── */
  document.documentElement.style.opacity = '0';

  function enterPage() {
    document.documentElement.style.opacity = '';
    document.body.classList.remove('nk-leaving');
    document.body.classList.remove('nk-entering');
    /* Reflow erzwingen, damit der Browser die entfernte nk-leaving-Animation
       verarbeitet bevor nk-entering startet – sonst fasst er beides in einem
       Frame zusammen und die Einblend-Animation startet nicht neu. */
    void document.body.offsetHeight;
    document.body.classList.add('nk-entering');
    document.body.addEventListener('animationend', function handler(e) {
      if (e.animationName === 'nk-page-in') {
        document.body.classList.remove('nk-entering');
        document.body.removeEventListener('animationend', handler);
      }
    });
  }

  document.addEventListener('DOMContentLoaded', enterPage);

  /* bfcache: Browser-Zurück stellt Seite aus Cache wieder her –
     DOMContentLoaded feuert dabei nicht, pageshow mit persisted=true schon. */
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) enterPage();
  });

  /* ── Ausblenden beim Verlassen ────────────── */
  function isSameOrigin(url) {
    try {
      return new URL(url, window.location.href).origin === window.location.origin;
    } catch (e) {
      return false;
    }
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href]');
    if (!a) return;

    var href = a.getAttribute('href');

    /* Überspringen: extern, neues Tab, Anker, leer */
    if (!href || href.startsWith('#') || href.startsWith('mailto:') ||
        href.startsWith('tel:') || a.target === '_blank') return;
    if (!isSameOrigin(href)) return;

    /* Schon auf der selben Seite? */
    var target = new URL(href, window.location.href).pathname;
    var current = window.location.pathname;
    if (target === current) return;

    e.preventDefault();

    window.location.href = href;
  });

}());
