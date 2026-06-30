/**
 * NKSearchData – Zentrale Übungsliste für die Sitesuche
 *
 * Jeder Eintrag:
 *   label   – Anzeigetext (wird für Fuzzy Search verwendet)
 *   href    – Zielseite
 *   iconSvg – (optional) SVG-String für das 40px-Icon im Suchergebnis
 *   tags    – (optional) zusätzliche Suchbegriffe, die nicht angezeigt werden
 *   klasse  – 'vorschule' | 'grundschule' | 'gymnasium' (für spätere Filterung)
 */
var NKSearchData = [

  /* ── Vorschule ─────────────────────────────────────────── */
  {
    label:  'Meine Welt',
    href:   'vorschule-mathe.html',
    klasse: 'vorschule',
    tags:   ['sachunterricht', 'vorschulkind'],
    iconSvg: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/><ellipse cx="12" cy="12" rx="4" ry="9" stroke="currentColor" stroke-width="1.5"/><path d="M3.5 9h17M3.5 15h17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
  },
  {
    label:  'Zählen bis 10',
    href:   'vorschule-zaehlen.html',
    klasse: 'vorschule',
    tags:   ['monster', 'höhle', 'zählen', 'mathe', 'zahlen'],
    iconSvg: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 4v16M20 4v16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="8"  cy="8"  r="1.8" fill="currentColor"/><circle cx="12" cy="8"  r="1.8" fill="currentColor"/><circle cx="16" cy="8"  r="1.8" fill="currentColor"/><circle cx="8"  cy="12" r="1.8" fill="currentColor"/><circle cx="12" cy="12" r="1.8" fill="currentColor"/><circle cx="16" cy="12" r="1.8" fill="currentColor"/><circle cx="8"  cy="16" r="1.8" fill="currentColor"/><circle cx="12" cy="16" r="1.8" fill="currentColor"/></svg>',
  },
  {
    label:  'Zählen bis 20',
    href:   'vorschule-zaehlen-20.html',
    klasse: 'vorschule',
    tags:   ['monster', 'höhle', 'zählen', 'mathe', 'zahlen', 'zwanzig'],
    iconSvg: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 4v16M20 4v16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="8"  cy="7"  r="1.5" fill="currentColor"/><circle cx="12" cy="7"  r="1.5" fill="currentColor"/><circle cx="16" cy="7"  r="1.5" fill="currentColor"/><circle cx="8"  cy="10.5" r="1.5" fill="currentColor"/><circle cx="12" cy="10.5" r="1.5" fill="currentColor"/><circle cx="16" cy="10.5" r="1.5" fill="currentColor"/><circle cx="8"  cy="14" r="1.5" fill="currentColor"/><circle cx="12" cy="14" r="1.5" fill="currentColor"/><circle cx="16" cy="14" r="1.5" fill="currentColor"/><circle cx="8"  cy="17.5" r="1.5" fill="currentColor"/><circle cx="12" cy="17.5" r="1.5" fill="currentColor"/><circle cx="16" cy="17.5" r="1.5" fill="currentColor"/></svg>',
  },

  /* ── Grundschule ────────────────────────────────────────── */
  {
    label:  'Uhrzeit',
    href:   'uhr.html',
    klasse: 'grundschule',
    tags:   ['uhr', 'zeit', 'mathe'],
    iconSvg: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/><path d="M12 7v5l3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  },

  {
    label:  'ABC',
    href:   'deutsch-abc.html',
    klasse: 'grundschule',
    tags:   ['buchstaben', 'anlaute', 'deutsch', 'lesen', 'alphabet', 'abc'],
    iconSvg: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 18 L9 6 L14 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><line x1="6" y1="14" x2="12" y2="14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="17" y1="6" x2="17" y2="18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M17 6 Q23 6 23 10.5 Q23 13.5 17 13.5 Q23 13.5 23 16 Q23 18 17 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/></svg>',
  },

  /* Weitere Übungen hier ergänzen … */

];
