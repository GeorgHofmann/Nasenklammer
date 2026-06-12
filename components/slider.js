/**
 * NKSlider – Stufenregler mit Label-Hervorhebung
 *
 * Rendert einen Range-Input mit beschrifteten Endwerten.
 * Der aktive Wert wird durch größere Schrift und volle
 * Deckkraft hervorgehoben.
 *
 * Usage:
 *   var slider = new NKSlider(document.getElementById('mySlider'), {
 *     min:      10,
 *     max:      20,
 *     step:     10,
 *     value:    10,
 *     hint:     'Anzahl der Objekte',  // optional
 *     color:    '#964f12',             // optional – überschreibt --nk-slider-color
 *     thumb:    '#f4a056',             // optional – überschreibt --nk-slider-thumb
 *     onChange: function(val) { … }
 *   });
 *
 *   slider.setValue(20);   // Wert programmatisch setzen (löst onChange aus)
 *   slider.getValue();     // aktuellen Wert abfragen
 */

(function (root) {
  'use strict';

  /* ── Constructor ───────────────────────────── */
  function NKSlider(el, opts) {
    if (!el) throw new Error('NKSlider: mount element is required');

    var o = opts || {};
    this.el       = el;
    this.min      = o.min  !== undefined ? o.min  : 0;
    this.max      = o.max  !== undefined ? o.max  : 100;
    this.step     = o.step !== undefined ? o.step : 1;
    this._value   = o.value !== undefined ? o.value : this.min;
    this.hint     = o.hint     || null;
    this.onChange = o.onChange || null;

    if (o.color) el.style.setProperty('--nk-slider-color', o.color);
    if (o.thumb) el.style.setProperty('--nk-slider-thumb', o.thumb);

    this.el.classList.add('nk-slider');
    this._render();
  }

  /* ── Private: Render ───────────────────────── */
  NKSlider.prototype._render = function () {
    var self = this;

    /* Alle Stufen-Labels berechnen */
    var steps = [];
    for (var v = this.min; v <= this.max; v += this.step) {
      steps.push(v);
    }

    /* Linkes Label (min), rechtes Label (max) — nur Endwerte */
    var labelMin = this.min;
    var labelMax = this.max;

    this.el.innerHTML =
      '<div class="nk-slider__row">' +
        '<span class="nk-slider__label" data-val="' + labelMin + '">' + labelMin + '</span>' +
        '<input class="nk-slider__input" type="range"' +
          ' min="' + this.min + '"' +
          ' max="' + this.max + '"' +
          ' step="' + this.step + '"' +
          ' value="' + this._value + '">' +
        '<span class="nk-slider__label" data-val="' + labelMax + '">' + labelMax + '</span>' +
      '</div>' +
      (this.hint ? '<p class="nk-slider__hint">' + this.hint + '</p>' : '');

    this._input = this.el.querySelector('.nk-slider__input');
    this._labels = this.el.querySelectorAll('.nk-slider__label');

    this._updateLabels();

    this._input.addEventListener('input', function () {
      self._value = parseInt(self._input.value, 10);
      self._updateLabels();
      if (typeof self.onChange === 'function') {
        self.onChange(self._value);
      }
    });
  };

  /* ── Private: Label-Zustand aktualisieren ──── */
  NKSlider.prototype._updateLabels = function () {
    var val = this._value;
    for (var i = 0; i < this._labels.length; i++) {
      var lv = parseInt(this._labels[i].getAttribute('data-val'), 10);
      this._labels[i].classList.toggle('is-active', lv === val);
    }
  };

  /* ── Public API ────────────────────────────── */
  NKSlider.prototype.getValue = function () {
    return this._value;
  };

  NKSlider.prototype.setValue = function (val) {
    this._value = val;
    if (this._input) {
      this._input.value = val;
      this._updateLabels();
    }
    if (typeof this.onChange === 'function') {
      this.onChange(val);
    }
  };

  /* ── Export ─────────────────────────────────  */
  root.NKSlider = NKSlider;

}(typeof window !== 'undefined' ? window : this));
