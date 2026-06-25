/**
 * NKBreadcrumb – Mad-Libs-Flow Komponente
 *
 * Rendert den kontextuellen Satz „Ich bin ein [Klasse] und übe in [Fach] die [Thema]"
 * mit klickbaren Slots. Farben sind per Theme steuerbar.
 *
 * Usage:
 *   const bc = new NKBreadcrumb(document.getElementById('siteBreadcrumb'), {
 *     slots: {
 *       klasse:  { label: 'Grundschulkind', href: '#' },
 *       fach:    { label: 'Mathematik',     href: '#' },
 *       thema:   { label: 'Uhrzeit',        href: '#' },
 *     },
 *     onSlotClick: function(key, label) { … }
 *   });
 *
 *   bc.setSlot('fach', 'Deutsch', '#');   // Slot-Label zur Laufzeit ändern
 *   bc.setTheme('#fbd4b0', '#964f12');    // Farben wechseln
 *
 * Vordefinierte Themes:
 *   NKBreadcrumb.THEMES.mathematik
 *   NKBreadcrumb.THEMES.deutsch
 *   NKBreadcrumb.THEMES.sachkunde
 *   NKBreadcrumb.THEMES.vorschule
 */

(function (root) {
  'use strict';

  /* ── Vordefinierte Fach-Themes ─────────────── */
  var THEMES = {
    mathematik: { bgColor: '#fbd4b0', textColor: '#964f12', borderColor: 'rgba(150,79,18,0.15)' },
    deutsch:    { bgColor: '#dce8fb', textColor: '#1a3a7a', borderColor: 'rgba(26,58,122,0.15)'  },
    sachkunde:  { bgColor: '#d8f0de', textColor: '#1a5c2a', borderColor: 'rgba(26,92,42,0.15)'   },
    vorschule:  { bgColor: '#fde8cc', textColor: '#7a4010', borderColor: 'rgba(122,64,16,0.15)'  },
  };

  /* ── Icon-Helfer (erben Farbe via currentColor) ── */
  function houseIconSvg() {
    return (
      '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
      '<path d="M3 12L12 4l9 8v9a1 1 0 01-1 1h-5v-5H9v5H4a1 1 0 01-1-1v-9z"' +
      ' stroke="currentColor" stroke-width="1.8"' +
      ' stroke-linecap="round" stroke-linejoin="round"/>' +
      '</svg>'
    );
  }

  function moreIconSvg() {
    return (
      '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
      '<circle cx="12" cy="5"  r="1.5"/>' +
      '<circle cx="12" cy="12" r="1.5"/>' +
      '<circle cx="12" cy="19" r="1.5"/>' +
      '</svg>'
    );
  }

  function closeIconSvg() {
    return (
      '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
      '<path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' +
      '</svg>'
    );
  }

  function printIconSvg() {
    return (
      '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
      '<path d="M6 9V2h12v7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<rect x="6" y="14" width="12" height="8" rx="1" stroke="currentColor" stroke-width="1.8"/>' +
      '</svg>'
    );
  }

  var ICONS = { print: printIconSvg };

  /* ── Constructor ───────────────────────────── */
  function NKBreadcrumb(el, opts) {
    if (!el) throw new Error('NKBreadcrumb: mount element is required');

    var o = opts || {};
    this.el          = el;
    this.bgColor     = o.bgColor     || THEMES.mathematik.bgColor;
    this.textColor   = o.textColor   || THEMES.mathematik.textColor;
    this.borderColor = o.borderColor || THEMES.mathematik.borderColor;
    this.homeHref       = o.homeHref       || 'index.html';
    this.themaConnector = o.themaConnector || 'das';
    this.onSlotClick    = o.onSlotClick    || null;
    this.menuItems      = Array.isArray(o.menuItems) ? o.menuItems : [];

    /* Slot-Daten: { klasse, fach, thema } */
    var s = o.slots || {};
    this._slots = {
      klasse: { label: (s.klasse && s.klasse.label) || 'Grundschulkind', href: (s.klasse && s.klasse.href) || '#' },
      fach:   { label: (s.fach   && s.fach.label)   || 'Mathematik',     href: (s.fach   && s.fach.href)   || '#' },
      thema:  { label: (s.thema  && s.thema.label)  || 'Uhrzeit',        href: (s.thema  && s.thema.href)  || '#' },
    };

    this._isOpen = false;

    this.el.classList.add('nk-breadcrumb');
    this._applyColors();
    this._render();
  }

  /* ── Private: CSS custom properties setzen ── */
  NKBreadcrumb.prototype._applyColors = function () {
    this.el.style.setProperty('--breadcrumb-bg',     this.bgColor);
    this.el.style.setProperty('--breadcrumb-color',  this.textColor);
    this.el.style.setProperty('--breadcrumb-border', this.borderColor);
  };

  /* ── Private: Slot rendern ─────────────────────
     href: null  → <span> (kein Unterstreichen, nicht klickbar)
     href: '#'   → <button> (klickbar, aber keine Navigation)
     href: '…'   → <button> (klickbar + navigiert)
     ─────────────────────────────────────────────── */
  NKBreadcrumb.prototype._slotBtn = function (key) {
    var data = this._slots[key];
    if (data.href === null || data.href === undefined) {
      return (
        '<span class="nk-breadcrumb__slot nk-breadcrumb__slot--static">' +
          data.label +
        '</span>'
      );
    }
    return (
      '<button class="nk-breadcrumb__slot" data-slot="' + key + '">' +
        data.label +
      '</button>'
    );
  };

  /* ── Private: Menüpunkt-HTML ─────────────────── */
  NKBreadcrumb.prototype._itemHtml = function (item, idx) {
    var iconFn = item.icon && ICONS[item.icon] ? ICONS[item.icon] : null;
    return (
      '<button class="nk-breadcrumb__item" data-item-idx="' + idx + '">' +
        (iconFn ? iconFn() : '') +
        this._esc(item.label || '') +
      '</button>'
    );
  };

  /* ── Private: inner HTML rendern ───────────── */
  NKBreadcrumb.prototype._render = function () {
    var hasMenu = this.menuItems.length > 0;

    var panelHtml = '';
    if (hasMenu) {
      var itemsHtml = '';
      for (var k = 0; k < this.menuItems.length; k++) {
        itemsHtml += this._itemHtml(this.menuItems[k], k);
      }
      panelHtml =
        '<div class="nk-breadcrumb__panel">' + itemsHtml + '</div>';
    }

    this.el.innerHTML =
      '<a class="nk-breadcrumb__icon" href="' + this.homeHref + '" aria-label="Startseite">' +
        houseIconSvg() +
      '</a>' +
      '<p class="nk-breadcrumb__text">' +
        'Ich bin ein ' + this._slotBtn('klasse') +
        ' und übe in ' + this._slotBtn('fach') +
        ' ' + this.themaConnector + ' ' + this._slotBtn('thema') +
      '</p>' +
      (hasMenu
        ? '<button class="nk-breadcrumb__more" aria-label="Mehr Optionen" aria-expanded="false">' + moreIconSvg() + '</button>' +
          '<button class="nk-breadcrumb__close" aria-label="Menü schließen">' + closeIconSvg() + '</button>'
        : '') +
      panelHtml;

    /* Slot-Klick-Wiring */
    var self = this;
    var btns = this.el.querySelectorAll('.nk-breadcrumb__slot');
    for (var i = 0; i < btns.length; i++) {
      (function (btn) {
        btn.addEventListener('click', function () {
          var key  = btn.getAttribute('data-slot');
          var slot = self._slots[key];
          if (slot.href && slot.href !== '#') {
            window.location.href = slot.href;
          } else if (typeof self.onSlotClick === 'function') {
            self.onSlotClick(key, slot.label);
          }
        });
      })(btns[i]);
    }

    /* Menü-Wiring */
    if (hasMenu) {
      var moreBtn  = this.el.querySelector('.nk-breadcrumb__more');
      var closeBtn = this.el.querySelector('.nk-breadcrumb__close');
      var itemBtns = this.el.querySelectorAll('.nk-breadcrumb__item');

      moreBtn.addEventListener('click', function () { self._openMenu(); });
      closeBtn.addEventListener('click', function () { self._closeMenu(); });

      for (var j = 0; j < itemBtns.length; j++) {
        (function (btn) {
          btn.addEventListener('click', function () {
            var idx  = parseInt(btn.getAttribute('data-item-idx'), 10);
            var item = self.menuItems[idx];
            self._closeMenu();
            if (item && typeof item.onClick === 'function') {
              item.onClick(item);
            }
          });
        })(itemBtns[j]);
      }
    }
  };

  /* ── Private: Menü öffnen / schließen ─────── */
  NKBreadcrumb.prototype._openMenu = function () {
    this._isOpen = true;
    this.el.classList.add('nk-breadcrumb--open');
    var more = this.el.querySelector('.nk-breadcrumb__more');
    if (more) more.setAttribute('aria-expanded', 'true');
  };

  NKBreadcrumb.prototype._closeMenu = function () {
    this._isOpen = false;
    this.el.classList.remove('nk-breadcrumb--open');
    var more = this.el.querySelector('.nk-breadcrumb__more');
    if (more) more.setAttribute('aria-expanded', 'false');
  };

  /* ── Private: HTML escapen ───────────────────── */
  NKBreadcrumb.prototype._esc = function (str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  };

  /* ── Public: einen Slot zur Laufzeit ändern ── */
  NKBreadcrumb.prototype.setSlot = function (key, label, href) {
    if (!this._slots[key]) return;
    this._slots[key].label = label;
    if (href) this._slots[key].href = href;
    /* Nur den Text-Node patchen – kein Re-render */
    var btn = this.el.querySelector('[data-slot="' + key + '"]');
    if (btn) btn.textContent = label;
  };

  /* ── Public: Farben wechseln – kein Re-render ── */
  NKBreadcrumb.prototype.setTheme = function (bgColor, textColor, borderColor) {
    this.bgColor     = bgColor;
    this.textColor   = textColor;
    this.borderColor = borderColor || 'rgba(0,0,0,0.12)';
    this._applyColors();  /* nur CSS-Vars, Inhalt bleibt unberührt */
  };

  /* ── Themes als statische Property ─────────── */
  NKBreadcrumb.THEMES = THEMES;

  /* ── Export ──────────────────────────────────  */
  root.NKBreadcrumb = NKBreadcrumb;

}(typeof window !== 'undefined' ? window : this));
