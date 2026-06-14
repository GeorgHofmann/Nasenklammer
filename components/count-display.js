/**
 * NKCountDisplay – styled numeric display chip
 *
 * Usage:
 *   const display = new NKCountDisplay(el, { value: 0 });
 *   display.set(5);   // update value with bump animation
 */
(function (root) {
  'use strict';

  function NKCountDisplay(el, opts) {
    if (!el) throw new Error('NKCountDisplay: mount element required');
    var o = opts || {};
    this._el    = el;
    this._value = o.value !== undefined ? o.value : 0;
    this._total = o.total !== undefined ? o.total : null;
    this._uid   = 'nkcd-' + Math.random().toString(36).slice(2, 7);
    this._render();
  }

  NKCountDisplay.prototype._text = function () {
    return this._total !== null
      ? this._value + '/' + this._total
      : this._value;
  };

  NKCountDisplay.prototype._render = function () {
    this._el.innerHTML =
      '<div class="nk-count-display">' +
        '<span class="nk-count-display__number" id="' + this._uid + '">' +
          this._text() +
        '</span>' +
      '</div>';
  };

  NKCountDisplay.prototype.set = function (val) {
    this._value = val;
    var num = document.getElementById(this._uid);
    if (!num) return;
    num.textContent = this._text();
    num.classList.remove('nk-count-display__number--bump');
    void num.offsetWidth;
    num.classList.add('nk-count-display__number--bump');
    setTimeout(function () {
      num.classList.remove('nk-count-display__number--bump');
    }, 250);
  };

  root.NKCountDisplay = NKCountDisplay;

}(typeof window !== 'undefined' ? window : this));
