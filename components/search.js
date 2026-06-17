/**
 * NKSearch – Slide-Up Suchmaske mit Fuzzy Search
 *
 * Usage:
 *   new NKSearch(document.getElementById('siteSearch'), {
 *     placeholder: 'Ich suche eine Übung …',
 *     items: [
 *       { label: 'Zählen bis 10', href: 'vorschule-zaehlen.html' },
 *     ],
 *     onSelect: function(item) { window.location.href = item.href; },
 *   });
 *
 *   Theming per CSS-Variable (im :root der jeweiligen Seite):
 *     --nk-search-panel-bg   Panel-Hintergrund
 *     --nk-search-trigger-bg Trigger-Pill-Hintergrund
 *     --nk-search-icon-bg    Icon-Kreis-Farbe
 *     --nk-search-text       Eingabe-/Ergebnis-Textfarbe
 *     --nk-search-placeholder Platzhalterfarbe
 *     --nk-search-accent     Highlight-Farbe für Treffer
 */

(function (root) {
  'use strict';

  /* ── Hilfsfunktionen ──────────────────────────────────────── */

  function escHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /**
   * Fuzzy-Score: Je höher, desto besser trifft die Eingabe den Text.
   * Gibt 0 zurück, wenn keine Übereinstimmung.
   */
  function fuzzyScore(query, text) {
    if (!query) return 0;
    var q = query.toLowerCase();
    var t = text.toLowerCase();

    // Exaktes Teilstring-Match → hohe Priorität
    var idx = t.indexOf(q);
    if (idx >= 0) {
      // Bonus für Wortanfang
      var wordBonus = (idx === 0 || t[idx - 1] === ' ') ? 50 : 0;
      return 100 + wordBonus + Math.round((q.length / t.length) * 40);
    }

    // Zeichenweise Fuzzy-Übereinstimmung
    var qi = 0, score = 0, consecutive = 0;
    for (var i = 0; i < t.length && qi < q.length; i++) {
      if (t[i] === q[qi]) {
        consecutive++;
        score += consecutive > 1 ? consecutive * 2 : 1;
        qi++;
      } else {
        consecutive = 0;
      }
    }
    return qi === q.length ? score : 0;
  }

  /**
   * Hebt den gefundenen Substring mit <mark> hervor.
   * Bei Fuzzy-Match (kein Substring) wird der Text unverändert zurückgegeben.
   */
  function highlight(query, text) {
    if (!query) return escHtml(text);
    var q = query.toLowerCase();
    var t = text.toLowerCase();
    var idx = t.indexOf(q);
    if (idx >= 0) {
      return escHtml(text.slice(0, idx)) +
        '<mark>' + escHtml(text.slice(idx, idx + query.length)) + '</mark>' +
        escHtml(text.slice(idx + query.length));
    }
    return escHtml(text);
  }

  /* ── SVG-Icons ────────────────────────────────────────────── */
  function iconSearch() {
    return '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
      '<circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2"/>' +
      '<path d="M16.5 16.5L21 21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' +
      '</svg>';
  }

  function iconClose() {
    return '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
      '<path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' +
      '</svg>';
  }

  function iconArrow() {
    return '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true" style="opacity:0.45">' +
      '<path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>' +
      '</svg>';
  }

  /* ── Constructor ──────────────────────────────────────────── */
  function NKSearch(el, opts) {
    if (!el) throw new Error('NKSearch: mount element is required');

    var o = opts || {};
    this.el          = el;
    this.placeholder = o.placeholder || 'Ich suche eine Übung …';
    this.items       = o.items       || [];
    this.onSelect    = o.onSelect    || null;

    this._isOpen    = false;
    this._query     = '';
    this._activeIdx = -1;
    this._matches   = [];

    this.el.classList.add('nk-search');
    this._build();
    this._wire();
  }

  /* ── DOM aufbauen ─────────────────────────────────────────── */
  NKSearch.prototype._build = function () {
    var p = escHtml(this.placeholder);
    this.el.innerHTML =
      /* Trigger-Pill (immer sichtbar, geschlossener Zustand) */
      '<button class="nk-search__trigger" aria-label="Suche öffnen" aria-haspopup="true">' +
        '<span class="nk-search__trigger-icon">' + iconSearch() + '</span>' +
        '<span class="nk-search__trigger-placeholder">' + p + '</span>' +
      '</button>' +
      /* Backdrop */
      '<div class="nk-search__backdrop" aria-hidden="true"></div>' +
      /* Panel */
      '<div class="nk-search__panel" role="search" aria-label="Übungssuche">' +
        '<button class="nk-search__panel-close" aria-label="Suche schließen">' +
          iconClose() +
        '</button>' +
        '<ul class="nk-search__results" role="listbox" aria-label="Suchergebnisse"></ul>' +
        '<div class="nk-search__bar">' +
          '<span class="nk-search__search-icon">' + iconSearch() + '</span>' +
          '<input class="nk-search__input" type="search" autocomplete="off"' +
            ' autocorrect="off" autocapitalize="off" spellcheck="false"' +
            ' placeholder="' + p + '" aria-label="Übung suchen" aria-autocomplete="list">' +
          '<button class="nk-search__clear" aria-label="Eingabe löschen" tabindex="-1">' +
            iconClose() +
          '</button>' +
        '</div>' +
      '</div>';

    this._triggerEl  = this.el.querySelector('.nk-search__trigger');
    this._backdropEl = this.el.querySelector('.nk-search__backdrop');
    this._panelEl    = this.el.querySelector('.nk-search__panel');
    this._closeEl    = this.el.querySelector('.nk-search__panel-close');
    this._inputEl    = this.el.querySelector('.nk-search__input');
    this._clearEl    = this.el.querySelector('.nk-search__clear');
    this._resultsEl  = this.el.querySelector('.nk-search__results');
  };

  /* ── Events verdrahten ────────────────────────────────────── */
  NKSearch.prototype._wire = function () {
    var self = this;

    this._triggerEl.addEventListener('click', function () { self.open(); });
    this._backdropEl.addEventListener('click', function () { self.close(); });
    this._closeEl.addEventListener('click', function () { self.close(); });
    this._clearEl.addEventListener('mousedown', function (e) {
      e.preventDefault();      // Verhindert Blur am Input
      self._clearInput();
    });

    this._inputEl.addEventListener('input', function () {
      self._query = self._inputEl.value;
      self._updateClear();
      self._renderResults();
    });

    this._inputEl.addEventListener('keydown', function (e) {
      switch (e.key) {
        case 'Escape':     self.close();           break;
        case 'ArrowDown':  e.preventDefault(); self._moveActive(1);  break;
        case 'ArrowUp':    e.preventDefault(); self._moveActive(-1); break;
        case 'Enter':      self._selectActive(); break;
      }
    });

    // Schließen wenn außerhalb getippt
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && self._isOpen) self.close();
    });
  };

  /* ── Öffnen / Schließen ───────────────────────────────────── */
  NKSearch.prototype.open = function () {
    if (this._isOpen) return;
    this._isOpen = true;
    this.el.classList.add('is-open');
    document.body.classList.add('nk-search-open');
    var self = this;
    // Kurze Verzögerung damit das Panel-Slide abgeschlossen ist
    setTimeout(function () { self._inputEl.focus(); }, 80);
  };

  NKSearch.prototype.close = function () {
    if (!this._isOpen) return;
    this._isOpen = false;
    this.el.classList.remove('is-open');
    document.body.classList.remove('nk-search-open');
    this._inputEl.blur();
  };

  /* ── Eingabe löschen ──────────────────────────────────────── */
  NKSearch.prototype._clearInput = function () {
    this._inputEl.value = '';
    this._query = '';
    this._updateClear();
    this._renderResults();
    this._inputEl.focus();
  };

  /* ── Clear-Button ein-/ausblenden ─────────────────────────── */
  NKSearch.prototype._updateClear = function () {
    this._clearEl.classList.toggle('is-visible', this._query.length > 0);
  };

  /* ── Ergebnisse rendern ───────────────────────────────────── */
  NKSearch.prototype._renderResults = function () {
    var q = this._query.trim();
    this._activeIdx = -1;

    if (!q) {
      this._resultsEl.innerHTML = '';
      this._resultsEl.classList.remove('has-content');
      return;
    }

    // Fuzzy-Scoring + Sortierung
    this._matches = this.items
      .map(function (item) {
        return { item: item, score: fuzzyScore(q, item.label) };
      })
      .filter(function (r) { return r.score > 0; })
      .sort(function (a, b) { return b.score - a.score; })
      .slice(0, 8);

    this._resultsEl.classList.add('has-content');

    if (!this._matches.length) {
      this._resultsEl.innerHTML =
        '<li class="nk-search__no-result">Keine Übung gefunden für „' + escHtml(q) + '"</li>';
      return;
    }

    var KLASSE_LABEL = {
      vorschule:   'Vorschule',
      grundschule: 'Grundschule',
      gymnasium:   'Gymnasium',
    };

    var self = this;
    this._resultsEl.innerHTML = this._matches.map(function (r, idx) {
      var icon = r.item.iconSvg
        ? '<span class="nk-search__result-icon">' + r.item.iconSvg + '</span>'
        : '';
      var klasse = r.item.klasse || '';
      var chip = klasse
        ? '<span class="nk-search__chip nk-search__chip--' + escHtml(klasse) + '">' +
            escHtml(KLASSE_LABEL[klasse] || klasse) +
          '</span>'
        : '';
      return '<li class="nk-search__result-item" role="option" data-idx="' + idx + '">' +
        icon +
        '<span class="nk-search__result-label">' + highlight(q, r.item.label) + '</span>' +
        chip +
      '</li>';
    }).join('');

    // Klick-Events für Ergebnisse
    var lis = this._resultsEl.querySelectorAll('.nk-search__result-item');
    for (var i = 0; i < lis.length; i++) {
      (function (li, match) {
        li.addEventListener('click', function () { self._navigate(match.item); });
      })(lis[i], this._matches[i]);
    }
  };

  /* ── Tastatur-Navigation ──────────────────────────────────── */
  NKSearch.prototype._moveActive = function (dir) {
    var lis = this._resultsEl.querySelectorAll('.nk-search__result-item');
    if (!lis.length) return;
    if (this._activeIdx >= 0) lis[this._activeIdx].classList.remove('is-active');
    this._activeIdx = Math.max(0, Math.min(lis.length - 1, this._activeIdx + dir));
    lis[this._activeIdx].classList.add('is-active');
    lis[this._activeIdx].scrollIntoView({ block: 'nearest' });
  };

  NKSearch.prototype._selectActive = function () {
    if (this._activeIdx >= 0 && this._matches[this._activeIdx]) {
      this._navigate(this._matches[this._activeIdx].item);
    }
  };

  /* ── Navigation ausführen ─────────────────────────────────── */
  NKSearch.prototype._navigate = function (item) {
    if (typeof this.onSelect === 'function') {
      this.onSelect(item);
    } else if (item.href) {
      window.location.href = item.href;
    }
  };

  /* ── Public: Items zur Laufzeit ersetzen ─────────────────── */
  NKSearch.prototype.setItems = function (items) {
    this.items = items || [];
    if (this._query) this._renderResults();
  };

  /* ── Export ───────────────────────────────────────────────── */
  root.NKSearch = NKSearch;

}(typeof window !== 'undefined' ? window : this));
