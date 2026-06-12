/**
 * NKExerciseHeader – Übungstitel + Level-Chips
 *
 * Rendert den Seitentitel und eine variable Anzahl Chips (3, 4, 6, …).
 * Der erste Chip ist beim Laden automatisch aktiv.
 *
 * Usage:
 *   const exHeader = new NKExerciseHeader(
 *     document.getElementById('exerciseHeader'),
 *     {
 *       title: 'Ich weiß, wie spät es ist',
 *       chips: [
 *         { label: 'Ganze Stunden',  value: 1 },
 *         { label: 'Halbe Stunden',  value: 2 },
 *         { label: 'Viertelstunden', value: 3 },
 *         { label: 'Gemischt',       value: 4 },
 *       ],
 *       activeValue: 1,              // optional, default: erster Chip
 *       chipColor:   '#ed4790',      // optional, default: CTA-Pink
 *       chipOn:      '#f8fdff',      // optional, Textfarbe aktiver Chip
 *       onChipChange: function(value, index) { … }
 *     }
 *   );
 *
 *   exHeader.setActive(2);           // Chip per Value aktivieren
 *   exHeader.setTitle('Neue Aufgabe');
 *   exHeader.getActive();            // → { value: 2, index: 1 }
 */

(function (root) {
  'use strict';

  var CHECK_SVG =
    '<svg class="nk-chip__check" viewBox="0 0 16 16" fill="none" aria-hidden="true">' +
      '<path d="M3 8l4 4 6-7" stroke="#f8fdff" stroke-width="2.2"' +
      ' stroke-linecap="round" stroke-linejoin="round"/>' +
    '</svg>';

  /* ── Constructor ───────────────────────────── */
  function NKExerciseHeader(el, opts) {
    if (!el) throw new Error('NKExerciseHeader: mount element is required');

    var o = opts || {};
    this.el           = el;
    this._title       = o.title        || '';
    this._chips       = o.chips        || [];
    this._chipColor   = o.chipColor    || 'var(--color-chip-active, #ed4790)';
    this._chipOn      = o.chipOn       || 'var(--color-chip-on, #f8fdff)';
    this._activeValue = o.activeValue  !== undefined
                          ? o.activeValue
                          : (this._chips[0] && this._chips[0].value);
    this.onChipChange = o.onChipChange || null;

    this._render();
  }

  /* ── Private: rendern ───────────────────────── */
  NKExerciseHeader.prototype._render = function () {
    var self = this;

    /* CSS-Variablen für Chip-Farben */
    this.el.style.setProperty('--chip-color', this._chipColor);
    this.el.style.setProperty('--chip-on',    this._chipOn);

    /* Chips-HTML aufbauen */
    var chipsHtml = '';
    for (var i = 0; i < this._chips.length; i++) {
      var chip    = this._chips[i];
      var isActive = chip.value === this._activeValue;
      chipsHtml +=
        '<button class="nk-chip' + (isActive ? ' is-active' : '') + '"' +
        ' data-value="' + chip.value + '">' +
          CHECK_SVG +
          chip.label +
        '</button>';
    }

    this.el.innerHTML =
      '<h1 class="nk-exercise-header__title">' + this._title + '</h1>' +
      '<div class="nk-exercise-header__chips">' + chipsHtml + '</div>';

    /* Click-Wiring */
    var btns = this.el.querySelectorAll('.nk-chip');
    for (var j = 0; j < btns.length; j++) {
      (function (btn, idx) {
        btn.addEventListener('click', function () {
          var val = btn.getAttribute('data-value');
          /* Zahlen-Values wieder in Zahl umwandeln wenn möglich */
          var parsed = isNaN(val) ? val : Number(val);
          self._setActiveDOM(parsed);
          self._activeValue = parsed;
          if (typeof self.onChipChange === 'function') {
            self.onChipChange(parsed, idx);
          }
        });
      })(btns[j], j);
    }
  };

  /* ── Private: nur DOM-Klassen umschalten ────── */
  NKExerciseHeader.prototype._setActiveDOM = function (value) {
    var btns = this.el.querySelectorAll('.nk-chip');
    for (var i = 0; i < btns.length; i++) {
      var v = btns[i].getAttribute('data-value');
      var parsed = isNaN(v) ? v : Number(v);
      btns[i].classList.toggle('is-active', parsed === value);
    }
  };

  /* ── Public: aktiven Chip setzen ───────────── */
  NKExerciseHeader.prototype.setActive = function (value) {
    this._activeValue = value;
    this._setActiveDOM(value);
  };

  /* ── Public: Titel ändern ───────────────────── */
  NKExerciseHeader.prototype.setTitle = function (text) {
    this._title = text;
    var h1 = this.el.querySelector('.nk-exercise-header__title');
    if (h1) h1.textContent = text;
  };

  /* ── Public: aktuellen Chip abfragen ────────── */
  NKExerciseHeader.prototype.getActive = function () {
    for (var i = 0; i < this._chips.length; i++) {
      if (this._chips[i].value === this._activeValue) {
        return { value: this._activeValue, index: i };
      }
    }
    return null;
  };

  /* ── Export ──────────────────────────────────  */
  root.NKExerciseHeader = NKExerciseHeader;

}(typeof window !== 'undefined' ? window : this));
