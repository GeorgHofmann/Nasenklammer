/**
 * NKButton – Design-System-Schaltflächen
 * Quelle: Super Design System / atom/saisonal/buttons
 *
 * Stellt bereit:
 *   NKButton.create(label, variant, theme)  – erstellt ein <button>-Element
 *   NKButton.VARIANTS                       – 'primary' | 'secondary'
 *
 * Verwendung:
 *   var btn = NKButton.create('Speichern', 'primary', NKButton.THEMES.mathematik);
 *   container.appendChild(btn);
 *
 *   // Mit Click-Handler:
 *   var btn = NKButton.create('Schließen', 'secondary', theme, function() { … });
 *
 * Voraussetzung: components/button.css muss eingebunden sein.
 */

(function (root) {
  'use strict';

  /* ── Lernbereich-Themes ───────────────────────
     Spiegeln NKBreadcrumb.THEMES und NKWorksheetPDF.THEMES.
     color → CSS-Hex für --nk-btn-color           */
  var THEMES = {
    mathematik: { color: '#964f12' },
    vorschule:  { color: '#7a4010' },
    deutsch:    { color: '#1a3a7a' },
    sachkunde:  { color: '#1a5c2a' },
  };

  /**
   * Erstellt ein <button>-Element im Nasenklammer-Design.
   *
   * @param {string}   label    Beschriftung
   * @param {string}   variant  'primary' | 'secondary'
   * @param {Object}   theme    { color: '#964f12' } – überschreibt die Farbe
   * @param {Function} [onClick]  Optional: Click-Handler
   * @returns {HTMLButtonElement}
   */
  function create(label, variant, theme, onClick) {
    var btn = document.createElement('button');
    btn.type      = 'button';
    btn.className = 'nk-btn nk-btn--' + (variant || 'primary');
    btn.textContent = label;

    if (theme && theme.color) {
      btn.style.setProperty('--nk-btn-color', theme.color);
    }

    if (typeof onClick === 'function') {
      btn.addEventListener('click', onClick);
    }

    return btn;
  }

  /* ── Export ───────────────────────────────────── */
  root.NKButton = {
    create:   create,
    THEMES:   THEMES,
    VARIANTS: { PRIMARY: 'primary', SECONDARY: 'secondary' },
  };

}(window));
