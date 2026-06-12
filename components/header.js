/**
 * NKHeader – reusable site header component
 *
 * Zwei Modi:
 *   'compact' (default) – schmale Leiste, Logo-Text 32px
 *   'brand'             – großer Brand-Block: NASENKLAMMER 48px + Untertitel
 *
 * Usage:
 *   const header = new NKHeader(document.getElementById('siteHeader'), {
 *     bgColor:   '#fef5ec',
 *     textColor: '#964f12',
 *     mode:      'compact',          // 'compact' | 'brand'
 *     subtitle:  'Clever lernen',    // nur in mode:'brand'
 *     onMenuClick: function() { … }
 *   });
 *
 *   header.setTheme('#c8e0f4', '#225a93');  // nur CSS-Vars, kein Re-render
 *   header.setLogo('<svg>…</svg>');
 *
 * Themes:
 *   NKHeader.THEMES.home        (Startseite, blau)
 *   NKHeader.THEMES.mathematik
 *   NKHeader.THEMES.deutsch
 *   NKHeader.THEMES.sachkunde
 *   NKHeader.THEMES.vorschule
 */

(function (root) {
  'use strict';

  /* ── Themes ────────────────────────────────────── */
  var THEMES = {
    home:       { bgColor: '#c8e0f4', textColor: '#225a93', mode: 'brand', subtitle: 'Wissen macht Spaß' },
    mathematik: { bgColor: '#fef5ec', textColor: '#964f12' },
    deutsch:    { bgColor: '#e8f0fc', textColor: '#1a3a7a' },
    sachkunde:  { bgColor: '#e8f5ec', textColor: '#1a5c2a' },
    vorschule:  { bgColor: '#fdf3e8', textColor: '#7a4010' },
  };

  /* ── Hamburger-Icon – erbt Farbe via currentColor ── */
  function menuIconSvg() {
    return (
      '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
      '<path d="M3 6h18M3 12h18M3 18h18"' +
      ' stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' +
      '</svg>'
    );
  }

  /* ── Constructor ───────────────────────────── */
  function NKHeader(el, opts) {
    if (!el) throw new Error('NKHeader: mount element is required');

    var o = opts || {};
    this.el          = el;
    this.bgColor     = o.bgColor     || THEMES.mathematik.bgColor;
    this.textColor   = o.textColor   || THEMES.mathematik.textColor;
    this.mode        = o.mode        || 'compact';
    this.subtitle    = o.subtitle    || 'Wissen macht Spaß';
    this.logoSvg     = o.logoSvg     || null;
    this.homeHref    = o.homeHref    || 'index.html';
    this.onMenuClick = o.onMenuClick || null;

    this.el.classList.add('nk-header');
    this.el.classList.toggle('nk-header--brand', this.mode === 'brand');
    this._applyColors();
    this._render();
  }

  /* ── Private: CSS custom properties ────────── */
  NKHeader.prototype._applyColors = function () {
    this.el.style.setProperty('--header-bg',    this.bgColor);
    this.el.style.setProperty('--header-color', this.textColor);
  };

  /* ── Private: render ────────────────────────── */
  NKHeader.prototype._render = function () {
    var logoHtml;
    var tag      = this.homeHref ? 'a' : 'span';
    var hrefAttr = this.homeHref ? ' href="' + this.homeHref + '"' : '';
    if (this.mode === 'brand') {
      logoHtml =
        '<' + tag + ' class="nk-header__logo"' + hrefAttr + '>' +
          NKLogo.brandHtml(this.subtitle) +
        '</' + tag + '>';
    } else if (this.logoSvg) {
      logoHtml = '<' + tag + ' class="nk-header__logo"' + hrefAttr + '>' + this.logoSvg + '</' + tag + '>';
    } else {
      logoHtml =
        '<' + tag + ' class="nk-header__logo"' + hrefAttr + '>' +
          NKLogo.html() +
        '</' + tag + '>';
    }

    this.el.innerHTML =
      logoHtml +
      '<button class="nk-header__menu-btn" aria-label="Menü">' +
        menuIconSvg() +
      '</button>';

    var btn  = this.el.querySelector('.nk-header__menu-btn');
    var self = this;
    btn.addEventListener('click', function () {
      if (typeof self.onMenuClick === 'function') self.onMenuClick();
    });
  };

  /* ── Public: Farben wechseln – kein Re-render ── */
  NKHeader.prototype.setTheme = function (bgColor, textColor) {
    this.bgColor   = bgColor;
    this.textColor = textColor;
    this._applyColors();
  };

  /* ── Public: SVG-Logo setzen ─────────────────── */
  NKHeader.prototype.setLogo = function (svgMarkup) {
    this.logoSvg = svgMarkup;
    this._render();
  };

  NKHeader.THEMES = THEMES;
  root.NKHeader = NKHeader;

}(typeof window !== 'undefined' ? window : this));
