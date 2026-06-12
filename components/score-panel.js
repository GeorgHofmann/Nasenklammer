/**
 * ScorePanel – reusable score sidebar component
 *
 * Usage:
 *   const panel = new ScorePanel(document.getElementById('myPanel'), {
 *     timerDuration: 4000,      // ms for auto-advance timer (default 4000)
 *     barBase:       36,        // minimum bar height in px  (default 36)
 *     barStep:       12,        // px added per answer       (default 12)
 *     barMax:        10,        // steps before bar is full  (default 10)
 *   });
 *
 *   panel.increment('correct');
 *   panel.startTimer(function() { nextQuestion(); });
 *   panel.stopTimer();
 *   panel.reset();
 *   panel.getScores(); // → { correct: 3, wrong: 1 }
 *
 * The mount element must already exist in the DOM and have the
 * class "score-panel" (or equivalent styling).
 * ScorePanel renders its own inner HTML on construction.
 */

/* global ScorePanel */
(function (root) {
  'use strict';

  /* ── SVG icon paths (Lucide) ───────────────── */
  var ICONS = {
    smile: [
      '<circle cx="12" cy="12" r="10"/>',
      '<path d="M8 13s1.5 2 4 2 4-2 4-2"/>',
      '<line x1="9" x2="9.01" y1="9" y2="9"/>',
      '<line x1="15" x2="15.01" y1="9" y2="9"/>'
    ].join(''),
    ghost: [
      '<path d="M9 10h.01M15 10h.01"/>',
      '<path d="M12 2a8 8 0 0 0-8 8v12l3-3 2.5 2.5L12 19l2.5 2.5L17 19l3 3V10a8 8 0 0 0-8-8z"/>'
    ].join('')
  };

  function svgIcon(name, color) {
    return (
      '<svg viewBox="0 0 24 24" fill="none"' +
      ' stroke="' + color + '" stroke-width="2"' +
      ' stroke-linecap="round" stroke-linejoin="round">' +
      ICONS[name] +
      '</svg>'
    );
  }

  /* ── Constructor ───────────────────────────── */
  function ScorePanel(el, opts) {
    if (!el) throw new Error('ScorePanel: mount element is required');

    var o = opts || {};
    this.el            = el;
    this.timerDuration = o.timerDuration !== undefined ? o.timerDuration : 4000;
    this.barBase       = o.barBase       !== undefined ? o.barBase       : 36;
    this.barStep       = o.barStep       !== undefined ? o.barStep       : 12;
    this.barMax        = o.barMax        !== undefined ? o.barMax        : 10;
    this._correct      = 0;
    this._wrong        = 0;
    this._timer        = null;

    this._render();
  }

  /* ── Private: render inner HTML ────────────── */
  ScorePanel.prototype._render = function () {
    var correctColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--color-correct').trim() || '#4f8e33';
    var wrongColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--color-error').trim() || '#d2283b';

    this.el.innerHTML =
      '<div class="score-panel__row">' +
        '<div class="score-panel__item">' +
          '<span class="score-panel__icon" aria-hidden="true">' +
            svgIcon('smile', correctColor) +
          '</span>' +
          '<div class="score-panel__bar score-panel__bar--correct" id="' + this._id('barCorrect') + '">' +
            '<span class="score-panel__num" id="' + this._id('numCorrect') + '">0</span>' +
          '</div>' +
        '</div>' +
        '<div class="score-panel__item">' +
          '<span class="score-panel__icon" aria-hidden="true">' +
            svgIcon('ghost', wrongColor) +
          '</span>' +
          '<div class="score-panel__bar score-panel__bar--wrong" id="' + this._id('barWrong') + '">' +
            '<span class="score-panel__num" id="' + this._id('numWrong') + '">0</span>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="score-panel__timer" id="' + this._id('timer') + '"></div>';

    this._applyBarHeight('correct', 0);
    this._applyBarHeight('wrong',   0);
  };

  /* ── Private: unique element IDs ───────────── */
  ScorePanel.prototype._id = function (name) {
    if (!this._uid) {
      this._uid = 'sp-' + Math.random().toString(36).slice(2, 7);
    }
    return this._uid + '-' + name;
  };

  /* ── Private: update a bar's height ────────── */
  ScorePanel.prototype._applyBarHeight = function (type, count) {
    var id  = type === 'correct' ? this._id('barCorrect') : this._id('barWrong');
    var bar = document.getElementById(id);
    if (!bar) return;
    var h = this.barBase + Math.min(count, this.barMax) * this.barStep;
    bar.style.height = h + 'px';
  };

  /* ── Public: increment a score ──────────────── */
  ScorePanel.prototype.increment = function (type) {
    var numId;
    if (type === 'correct') {
      this._correct++;
      numId = this._id('numCorrect');
      this._applyBarHeight('correct', this._correct);
    } else {
      this._wrong++;
      numId = this._id('numWrong');
      this._applyBarHeight('wrong', this._wrong);
    }
    var numEl = document.getElementById(numId);
    if (numEl) numEl.textContent = type === 'correct' ? this._correct : this._wrong;
  };

  /* ── Public: start auto-advance timer ───────── */
  ScorePanel.prototype.startTimer = function (onComplete) {
    this.stopTimer();
    var strip = document.getElementById(this._id('timer'));
    if (strip) {
      strip.style.setProperty('--score-panel-timer-duration', (this.timerDuration / 1000) + 's');
      strip.style.transition = 'none';
      strip.style.width      = '0%';
      strip.classList.remove('score-panel__timer--running');
      void strip.offsetWidth; /* force reflow */
      strip.classList.add('score-panel__timer--running');
    }
    var self = this;
    this._timer = setTimeout(function () {
      self.stopTimer();
      if (typeof onComplete === 'function') onComplete();
    }, this.timerDuration);
  };

  /* ── Public: cancel timer ───────────────────── */
  ScorePanel.prototype.stopTimer = function () {
    if (this._timer) { clearTimeout(this._timer); this._timer = null; }
    var strip = document.getElementById(this._id('timer'));
    if (strip) {
      strip.classList.remove('score-panel__timer--running');
      strip.style.width = '0%';
    }
  };

  /* ── Public: reset scores ───────────────────── */
  ScorePanel.prototype.reset = function () {
    this.stopTimer();
    this._correct = 0;
    this._wrong   = 0;
    var nc = document.getElementById(this._id('numCorrect'));
    var nw = document.getElementById(this._id('numWrong'));
    if (nc) nc.textContent = '0';
    if (nw) nw.textContent = '0';
    this._applyBarHeight('correct', 0);
    this._applyBarHeight('wrong',   0);
  };

  /* ── Public: read current scores ────────────── */
  ScorePanel.prototype.getScores = function () {
    return { correct: this._correct, wrong: this._wrong };
  };

  /* ── Export ─────────────────────────────────── */
  root.ScorePanel = ScorePanel;

}(typeof window !== 'undefined' ? window : this));
