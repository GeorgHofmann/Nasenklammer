/**
 * NKCardGrid – Karten-Raster-Komponente
 *
 * Rendert eine Reihe von Navigations-/Übungskarten.
 *
 * Usage:
 *   new NKCardGrid(document.getElementById('cardGrid'), {
 *     cards: [
 *       {
 *         href:     'vorschule.html',
 *         label:    '… Vorschulkind',
 *         imageSvg: '<svg>…</svg>',   // vollständiges <svg>-Element
 *       },
 *       …
 *     ]
 *   });
 *
 * Das Mount-Element wird direkt mit dem .nk-cards-Grid befüllt.
 * Styles kommen aus components/card.css.
 */

/* global NKCardGrid */
(function (root) {
  'use strict';

  /**
   * @param {HTMLElement} el   Mount-Element (wird ersetzt durch .nk-cards)
   * @param {Object}      opts
   * @param {Array}       opts.cards  Array of { href, label, imageSvg }
   */
  function NKCardGrid(el, opts) {
    if (!el) throw new Error('NKCardGrid: mount element is required');
    var o = opts || {};
    this.el    = el;
    this.cards = Array.isArray(o.cards) ? o.cards : [];
    this._render();
  }

  NKCardGrid.prototype._render = function () {
    var html = '<div class="nk-cards">';

    for (var i = 0; i < this.cards.length; i++) {
      var card = this.cards[i];
      var href     = card.href || '#';
      var disabled = card.disabled ? ' nk-card--disabled' : '';
      html +=
        '<a class="nk-card' + disabled + '" href="' + this._esc(href) + '">' +
          '<div class="nk-card__image">' +
            (card.imageSvg || '') +          /* Raw SVG – kein Escaping */
          '</div>' +
          '<hr class="nk-card__line">' +
          '<p class="nk-card__label">' + (card.label || '') + '</p>' +
        '</a>';
    }

    html += '</div>';
    this.el.innerHTML = html;
  };

  /** Minimal HTML-Escaping für Attribute und Text */
  NKCardGrid.prototype._esc = function (str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  };

  root.NKCardGrid = NKCardGrid;

}(typeof window !== 'undefined' ? window : this));
