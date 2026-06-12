/**
 * NKAnalytics – Google Analytics 4 Integration
 *
 * Lädt GA4 automatisch und stellt Tracking-Hilfsfunktionen bereit.
 * NKFab feuert Play/Stop-Events automatisch, wenn diese Datei
 * geladen ist — kein zusätzlicher Code pro Seite nötig.
 *
 * ── Setup ──────────────────────────────────────────────────────
 *   1. GA4-Messung-ID unten bei MEASUREMENT_ID eintragen
 *      (Format: 'G-XXXXXXXXXX', zu finden in Google Analytics →
 *       Verwaltung → Datenströme → Web-Stream-Details)
 *   2. analytics.js als erstes Script auf jeder Seite einbinden
 *
 * ── Automatisch gemessene Events ───────────────────────────────
 *   page_view      – jeder Seitenaufruf (GA4-Standard)
 *   fab_play       – Vorlesen-Button gedrückt
 *   fab_stop       – Stop-Button gedrückt (manuell)
 *   fab_done       – Vorlesen natürlich beendet
 *   page_time      – Verweildauer in Sekunden (beim Verlassen)
 *
 * ── Manuelle Events (für eigene Lernmodul-Logik) ───────────────
 *   NKAnalytics.track('event_name', { param: value })
 *
 * ── Beispiel: Übung abgeschlossen tracken ──────────────────────
 *   NKAnalytics.track('exercise_complete', {
 *     module:  'zaehlen',
 *     score:   8,
 *     total:   10,
 *   });
 */

(function (root) {
  'use strict';

  /* ── Messung-ID hier eintragen ──────────────────
     Zu finden in: Google Analytics → Verwaltung →
     Datenströme → Web-Stream-Details              */
  var MEASUREMENT_ID = 'G-XXXXXXXXXX';

  /* ── Seitenname aus Titel ableiten ─────────────
     z.B. "Nasenklammer – Zählen" → "Zählen"      */
  var _pageName = (document.title || '')
    .replace(/^Nasenklammer\s*[–-]\s*/i, '')
    .trim() || document.location.pathname;

  /* ── Zeitstempel für Verweildauer ─────────────── */
  var _pageStart = Date.now();
  var _timeSent  = false;

  /* ── GA4 laden ─────────────────────────────────── */
  function _loadGA() {
    if (MEASUREMENT_ID === 'G-XXXXXXXXXX') {
      /* Noch keine ID eingetragen — Tracking deaktiviert,
         NKAnalytics.track() läuft aber ohne Fehler weiter. */
      console.info('[NKAnalytics] Keine GA4-ID konfiguriert. Tracking deaktiviert.');
      return;
    }
    var s = document.createElement('script');
    s.async = true;
    s.src   = 'https://www.googletagmanager.com/gtag/js?id=' + MEASUREMENT_ID;
    document.head.appendChild(s);

    root.dataLayer = root.dataLayer || [];
    /* gtag als globale Funktion — muss function-Deklaration sein */
    root.gtag = function () { root.dataLayer.push(arguments); };
    root.gtag('js', new Date());
    root.gtag('config', MEASUREMENT_ID, {
      page_title:    document.title,
      page_location: location.href,
    });
  }

  /* ── Verweildauer beim Verlassen senden ─────────── */
  function _sendPageTime() {
    if (_timeSent) return;
    _timeSent = true;
    var seconds = Math.round((Date.now() - _pageStart) / 1000);
    if (seconds < 2) return;
    NKAnalytics.track('page_time', {
      page_name: _pageName,
      seconds:   seconds,
    });
  }

  /* Sichtbarkeit: Tab-Wechsel oder Schließen */
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') {
      _sendPageTime();
    } else {
      /* Tab wieder aktiv → Zeitmessung neu starten */
      _pageStart = Date.now();
      _timeSent  = false;
    }
  });

  /* Fallback für Browser ohne visibilitychange-Support */
  root.addEventListener('pagehide', _sendPageTime);

  /* ── Öffentliche API ────────────────────────────── */
  var NKAnalytics = {

    /* Roher Event-Call – für alle eigenen Tracking-Punkte */
    track: function (eventName, params) {
      if (typeof root.gtag === 'function') {
        root.gtag('event', eventName, Object.assign({ page_name: _pageName }, params || {}));
      }
    },

    /* Vorlesefunktion gestartet */
    trackPlay: function () {
      NKAnalytics.track('fab_play');
    },

    /* Vorlesefunktion manuell gestoppt */
    trackStop: function () {
      NKAnalytics.track('fab_stop');
    },

    /* Vorlesefunktion natürlich beendet */
    trackDone: function () {
      NKAnalytics.track('fab_done');
    },

  };

  root.NKAnalytics = NKAnalytics;

  /* GA laden */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', _loadGA);
  } else {
    _loadGA();
  }

}(window));
