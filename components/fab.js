/**
 * NKFab – Floating Action Button (Vorlesen / Stop)
 *
 * Zwei Modi:
 *   'page'   – immer sichtbar, normaler FAB (Auswahlseiten)
 *   'module' – Lasche-Verhalten: eingezogen, fährt bei hover/playing herein
 *
 * Usage:
 *   var fab = new NKFab(document.getElementById('siteFab'), {
 *     mode:    'module',          // 'page' | 'module'  (default: 'module')
 *     onSpeak: function() { NKVoice.speak(voiceText, function() { fab.done(); }); },
 *     onStop:  function() { NKVoice.stop(); },
 *   });
 *
 *   fab.done();   // Wiedergabe beendet – zurück in Vorlesen-Zustand
 */

/* global NKFab */
(function (root) {
  'use strict';

  /* ── SVG-Icons ─────────────────────────────── */
  var SVG_PLAY =
    '<svg class="nk-fab__icon" viewBox="0 0 24 24" aria-hidden="true">' +
      '<path d="M8 5v14l11-7z"/>' +
    '</svg>';

  var SVG_STOP =
    '<svg class="nk-fab__icon" viewBox="0 0 24 24" aria-hidden="true">' +
      '<rect x="6" y="6" width="12" height="12"/>' +
    '</svg>';

  /* ── Konstruktor ────────────────────────────── */
  function NKFab(el, opts) {
    if (!el) throw new Error('NKFab: mount element required');
    var o     = opts || {};
    this.el      = el;
    this.mode    = o.mode    || 'module';
    this.onSpeak = o.onSpeak || null;
    this.onStop  = o.onStop  || null;
    this._playing = false;
    this._render();
    this._bind();
  }

  /* ── Render ─────────────────────────────────── */
  NKFab.prototype._render = function () {
    var btn = document.createElement('button');
    btn.className = 'nk-fab' +
      (this.mode === 'module' ? ' nk-fab--module' : '');
    btn.setAttribute('aria-label', 'Vorlesen');
    btn.innerHTML = SVG_PLAY + '<span class="nk-fab__label">Vorlesen</span>';
    this.el.appendChild(btn);
    this._btn = btn;
  };

  /* ── Click-Handler ──────────────────────────── */
  NKFab.prototype._bind = function () {
    var self = this;
    this._btn.addEventListener('click', function () {
      if (self._playing) {
        self._setPlaying(false);
        if (self.onStop) self.onStop();
        if (window.NKAnalytics) NKAnalytics.trackStop();
      } else {
        self._setPlaying(true);
        if (self.onSpeak) self.onSpeak();
        if (window.NKAnalytics) NKAnalytics.trackPlay();
      }
    });
  };

  /* ── Zustand wechseln ───────────────────────── */
  NKFab.prototype._setPlaying = function (playing) {
    this._playing = playing;
    if (playing) {
      this._btn.classList.add('is-playing');
      this._btn.setAttribute('aria-label', 'Stop');
      this._btn.innerHTML = SVG_STOP + '<span class="nk-fab__label">Stop</span>';
    } else {
      this._btn.classList.remove('is-playing');
      this._btn.setAttribute('aria-label', 'Vorlesen');
      this._btn.innerHTML = SVG_PLAY + '<span class="nk-fab__label">Vorlesen</span>';
    }
  };

  /**
   * Wiedergabe natürlich beendet → zurück in Vorlesen-Zustand.
   * Wird als onEnd-Callback an NKVoice.speak() übergeben.
   */
  NKFab.prototype.done = function () {
    this._setPlaying(false);
  };

  root.NKFab = NKFab;

}(typeof window !== 'undefined' ? window : this));
