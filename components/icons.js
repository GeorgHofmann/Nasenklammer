/**
 * NKIcons – zentrale Icon-Registry
 *
 * Alle Icons sind 24×24 SVG mit stroke="currentColor".
 * Farbe wird vollständig per CSS gesteuert — kein
 * hardcodierter Farbwert hier.
 *
 * Icons tauschen:
 *   Einfach die SVG-Strings unten ersetzen.
 *   Wenn Du einen Ordner mit SVG-Dateien hast, sag mir
 *   den Pfad — ich lese die Dateien und trage sie hier ein.
 */

(function (root) {
  'use strict';

  root.NKIcons = {

    /* ── Fächer ──────────────────────────────────── */

    mathematik:
      /* Taschenrechner */
      '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
      '<rect x="4.5" y="2.5" width="15" height="19" rx="2" stroke="currentColor" stroke-width="1.75"/>' +
      '<rect x="7" y="5" width="10" height="4.5" rx="1" stroke="currentColor" stroke-width="1.5"/>' +
      '<circle cx="8.5" cy="13.5" r="1" fill="currentColor"/>' +
      '<circle cx="12" cy="13.5" r="1" fill="currentColor"/>' +
      '<circle cx="15.5" cy="13.5" r="1" fill="currentColor"/>' +
      '<circle cx="8.5" cy="17.5" r="1" fill="currentColor"/>' +
      '<circle cx="12" cy="17.5" r="1" fill="currentColor"/>' +
      '<circle cx="15.5" cy="17.5" r="1" fill="currentColor"/>' +
      '</svg>',

    deutsch:
      /* Aufgeschlagenes Buch */
      '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
      '<path d="M12 20V6C12 6 9 4.5 4 5v13c5-.5 8 2 8 2z" stroke="currentColor" stroke-width="1.75" stroke-linejoin="round"/>' +
      '<path d="M12 20V6c0 0 3-1.5 8-1v13c-5-.5-8 2-8 2z" stroke="currentColor" stroke-width="1.75" stroke-linejoin="round"/>' +
      '<line x1="12" y1="6" x2="12" y2="20" stroke="currentColor" stroke-width="1.5"/>' +
      '</svg>',

    sachkunde:
      /* Lupe */
      '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
      '<circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" stroke-width="1.75"/>' +
      '<path d="M15.5 15.5L20.5 20.5" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/>' +
      '</svg>',

    englisch:
      /* Sprechblase mit A */
      '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
      '<path d="M3 4.5h18v11.5h-7.5L10 20v-4H3V4.5z" stroke="currentColor" stroke-width="1.75" stroke-linejoin="round"/>' +
      '<text x="12" y="13.5" text-anchor="middle" font-family="serif" font-size="7.5" font-weight="700" fill="currentColor">A</text>' +
      '</svg>',

    /* ── Schulkind-Auswahl (Ebene 1) ─────────────── */

    vorschule:
      /* Stern – verspielte Vorschulwelt */
      '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
      '<path d="M12 2l2.6 5.6 6.1.6-4.5 4.3 1.3 6.2L12 15.8l-5.5 2.9 1.3-6.2L3.3 8.2l6.1-.6z"' +
      ' stroke="currentColor" stroke-width="1.75" stroke-linejoin="round"/>' +
      '</svg>',

    grundschule:
      /* Schulranzen */
      '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
      '<rect x="4.5" y="9" width="15" height="12" rx="2" stroke="currentColor" stroke-width="1.75"/>' +
      '<path d="M9 9V7a3 3 0 016 0v2" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/>' +
      '<rect x="8.5" y="13" width="7" height="4" rx="1" stroke="currentColor" stroke-width="1.5"/>' +
      '<line x1="12" y1="13" x2="12" y2="17" stroke="currentColor" stroke-width="1.5"/>' +
      '</svg>',

    gross:
      /* Doktorhut / Abschluss */
      '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
      '<path d="M2 10l10-5 10 5-10 5z" stroke="currentColor" stroke-width="1.75" stroke-linejoin="round"/>' +
      '<path d="M6 13v4c0 1.66 2.69 3 6 3s6-1.34 6-3v-4" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/>' +
      '<path d="M22 10v5" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/>' +
      '<circle cx="22" cy="16" r="1" fill="currentColor"/>' +
      '</svg>',

    /* ── Lernmodule Mathematik (Ebene 3) ──────────── */

    uhrzeit:
      /* Uhr */
      '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
      '<circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.75"/>' +
      '<path d="M12 7v5l3.5 3.5" stroke="currentColor" stroke-width="1.75"' +
      ' stroke-linecap="round" stroke-linejoin="round"/>' +
      '</svg>',

    zaehlen:
      /* Zählpunkte 1–6 (Würfeloptik) */
      '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
      '<circle cx="7"  cy="8"  r="2" fill="currentColor"/>' +
      '<circle cx="12" cy="8"  r="2" fill="currentColor"/>' +
      '<circle cx="17" cy="8"  r="2" fill="currentColor"/>' +
      '<circle cx="7"  cy="16" r="2" fill="currentColor"/>' +
      '<circle cx="12" cy="16" r="2" fill="currentColor"/>' +
      '<circle cx="17" cy="16" r="2" fill="currentColor"/>' +
      '</svg>',

    mengenlehre:
      /* Zwei überlappende Kreise (Venn) */
      '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
      '<circle cx="9"  cy="12" r="6.5" stroke="currentColor" stroke-width="1.75"/>' +
      '<circle cx="15" cy="12" r="6.5" stroke="currentColor" stroke-width="1.75"/>' +
      '</svg>',

    /* ── Navigation ──────────────────────────────── */

    home:
      /* Haus */
      '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
      '<path d="M3 12L12 4l9 8v9a1 1 0 01-1 1h-5v-5H9v5H4a1 1 0 01-1-1v-9z"' +
      ' stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>' +
      '</svg>',

    kontakt:
      /* Briefumschlag */
      '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
      '<rect x="3" y="5.5" width="18" height="13" rx="2" stroke="currentColor" stroke-width="1.75"/>' +
      '<path d="M3 9l9 6 9-6" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>' +
      '</svg>',

    impressum:
      /* Info-Kreis */
      '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
      '<circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.75"/>' +
      '<path d="M12 11v5" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/>' +
      '<circle cx="12" cy="8" r="0.75" fill="currentColor" stroke="currentColor" stroke-width="0.5"/>' +
      '</svg>',

  };

}(window));
