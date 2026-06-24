/**
 * NKCardGrid – horizontales Karussell mit Pagination-Pills
 *
 * Usage:
 *   new NKCardGrid(document.getElementById('cardGrid'), {
 *     cards: [
 *       { href: 'vorschule.html', label: '… Vorschulkind', imageSvg: '<svg>…</svg>' },
 *       …
 *     ]
 *   });
 *
 * Das Mount-Element wird mit .nk-carousel befüllt.
 * Styles: components/card.css
 *
 * Verhalten:
 *   - Touch:  natives horizontales Scroll + CSS scroll-snap
 *   - Maus:   Drag via Pointer Events (scrollLeft manuell)
 *   - Pills:  IntersectionObserver — sichtbare Karten → aktive Pille
 *   - Pills werden ausgeblendet wenn keine Überlauf vorhanden ist
 */

/* global NKCardGrid */
(function (root) {
  'use strict';

  /**
   * @param {HTMLElement} el   Mount-Element
   * @param {Object}      opts
   * @param {Array}       opts.cards  [{ href, label, imageSvg, disabled? }]
   */
  function NKCardGrid(el, opts) {
    if (!el) throw new Error('NKCardGrid: mount element is required');
    var o = opts || {};
    this.el    = el;
    this.cards = Array.isArray(o.cards) ? o.cards : [];
    this._render();
  }

  /* ── Render ──────────────────────────────── */
  NKCardGrid.prototype._render = function () {
    var self = this;
    var n    = this.cards.length;

    /* Carousel-Wrapper */
    var carousel = document.createElement('div');
    carousel.className = 'nk-carousel';

    /* Scroll-Track */
    var track = document.createElement('div');
    track.className = 'nk-carousel__track';
    carousel.appendChild(track);

    /* Karten-Reihe */
    var row = document.createElement('div');
    row.className = 'nk-cards';
    track.appendChild(row);

    /* Einzelne Karten */
    for (var i = 0; i < n; i++) {
      var card = this.cards[i];
      var a    = document.createElement('a');
      a.className          = 'nk-card' + (card.disabled ? ' nk-card--disabled' : '');
      a.href               = card.href || '#';
      a.dataset.nkIdx      = i;
      a.innerHTML =
        '<div class="nk-card__image">' + (card.imageSvg || '') + '</div>' +
        '<hr class="nk-card__line">' +
        '<p class="nk-card__label">' + self._esc(card.label || '') + '</p>';
      row.appendChild(a);
    }

    /* Pagination-Pills */
    var pillsEl = document.createElement('div');
    pillsEl.className = 'nk-carousel__pills';
    pillsEl.style.display = 'none'; /* zunächst versteckt */
    for (var j = 0; j < n; j++) {
      var pill = document.createElement('span');
      pill.className = 'nk-carousel__pill';
      pillsEl.appendChild(pill);
    }
    carousel.appendChild(pillsEl);

    /* Ins DOM einbauen */
    this.el.innerHTML = '';
    this.el.appendChild(carousel);

    /* Refs sichern */
    this._carousel = carousel;
    this._track    = track;
    this._row      = row;
    this._pillsEl  = pillsEl;
    this._cardEls  = row.querySelectorAll('.nk-card');
    this._pillEls  = pillsEl.querySelectorAll('.nk-carousel__pill');

    /* Setup nach erstem Layout-Pass */
    requestAnimationFrame(function () {
      self._setup();
    });
  };

  /* ── Setup (nach Paint) ──────────────────── */
  NKCardGrid.prototype._setup = function () {
    var self    = this;
    var track   = this._track;
    var cardEls = this._cardEls;
    var pillEls = this._pillEls;

    /* ── Overflow prüfen & Pills ein-/ausblenden */
    function checkOverflow() {
      var hasScroll = track.scrollWidth > track.clientWidth + 4;
      self._pillsEl.style.display = hasScroll ? 'flex' : 'none';
    }
    checkOverflow();

    /* Bei Resize erneut prüfen (Orientation-Change, Fenster-Resize) */
    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(checkOverflow, 120);
    });

    /* ── IntersectionObserver für Pills ─────── */
    if (typeof IntersectionObserver !== 'undefined') {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          var idx = parseInt(e.target.dataset.nkIdx, 10);
          if (isNaN(idx) || !pillEls[idx]) return;
          pillEls[idx].classList.toggle('nk-carousel__pill--active', e.isIntersecting);
        });
      }, {
        root:      track,
        threshold: 0.55   /* Karte gilt als sichtbar ab 55 % */
      });

      for (var i = 0; i < cardEls.length; i++) {
        io.observe(cardEls[i]);
      }
    } else {
      /* Fallback: alle aktiv */
      for (var j = 0; j < pillEls.length; j++) {
        pillEls[j].classList.add('nk-carousel__pill--active');
      }
    }

    /* ── Maus-Drag ───────────────────────────
       Touch nutzt natives scroll via touch-action: pan-x.
       Hier nur Maus (pointerType === 'mouse').            */
    var startX     = 0;
    var startLeft  = 0;
    var dragging   = false;
    var didMove    = false;

    track.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse') return; /* Touch: nativ */
      if (e.button !== 0) return;            /* Nur Linksklick */
      dragging  = true;
      didMove   = false;
      startX    = e.clientX;
      startLeft = track.scrollLeft;
      /* KEIN setPointerCapture – das würde den click-Event
         auf den Track umleiten und Links kapern.           */
    });

    /* pointermove / pointerup auf document:
       So funktioniert Drag auch wenn die Maus
       das Track-Element verlässt.                          */
    function onDocMove(e) {
      if (!dragging || e.pointerType !== 'mouse') return;
      var dx = e.clientX - startX;
      if (!didMove && Math.abs(dx) > 6) {
        didMove = true;
        track.classList.add('nk-is-dragging');
      }
      if (didMove) {
        track.scrollLeft = startLeft - dx;
        e.preventDefault(); /* Textauswahl verhindern */
      }
    }

    function onDocUp() {
      if (!dragging) return;
      dragging = false;
      track.classList.remove('nk-is-dragging');
      /* didMove bleibt kurz stehen; click-Listener räumt auf. */
    }

    document.addEventListener('pointermove', onDocMove);
    document.addEventListener('pointerup',   onDocUp);
    document.addEventListener('pointercancel', onDocUp);

    /* ── Link-Klick nach Drag unterdrücken ─── */
    track.addEventListener('click', function (e) {
      if (didMove) {
        e.preventDefault();
        e.stopPropagation();
        didMove = false;
      }
    }, true /* capture phase */);
  };

  /* ── Hilfsmethoden ───────────────────────── */
  NKCardGrid.prototype._esc = function (str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  };

  root.NKCardGrid = NKCardGrid;

}(typeof window !== 'undefined' ? window : this));
