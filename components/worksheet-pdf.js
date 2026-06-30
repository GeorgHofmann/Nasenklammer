/**
 * NKWorksheetPDF – gemeinsamer Helfer für PDF-Übungsblätter
 *
 * Stellt bereit:
 *   NKWorksheetPDF.load(callback)              – lädt jsPDF (CDN) falls nötig
 *   NKWorksheetPDF.create(opts)                – neues jsPDF-Dokument (A4)
 *   NKWorksheetPDF.preview(doc, name, theme)   – Vorschau-Modal + Download-Button
 *   NKWorksheetPDF.THEMES                      – vordefinierte Lernbereich-Farben
 *
 * Verwendung:
 *   NKWorksheetPDF.load(function() {
 *     var doc = NKWorksheetPDF.create();
 *     // … PDF aufbauen …
 *     NKWorksheetPDF.preview(doc, 'dateiname.pdf', NKWorksheetPDF.THEMES.mathematik);
 *   });
 *
 * Ohne Theme-Angabe wird automatisch mathematik verwendet.
 */

(function (root) {
  'use strict';

  var CDN = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';

  /* ── Lernbereich-Themes ───────────────────────
     Farben passend zu NKBreadcrumb.THEMES und den
     jeweiligen Seitendesigns.
     color       → CSS-Hex für Modal-Buttons/Rahmen
     borderColor → halbtransparenter Trennstrich
     rgb         → [r, g, b] für jsPDF-Zeichenbefehle        */
  var THEMES = {
    mathematik: {
      color:       '#964f12',
      borderColor: 'rgba(150,79,18,0.15)',
      rgb:         [150, 79, 18],
    },
    vorschule: {
      color:       '#7a4010',
      borderColor: 'rgba(122,64,16,0.15)',
      rgb:         [122, 64, 16],
    },
    deutsch: {
      color:       '#1a3a7a',
      borderColor: 'rgba(26,58,122,0.15)',
      rgb:         [26, 58, 122],
    },
    sachkunde: {
      color:       '#1a5c2a',
      borderColor: 'rgba(26,92,42,0.15)',
      rgb:         [26, 92, 42],
    },
  };

  /* ── jsPDF laden (einmalig) ───────────────────── */
  function load(cb) {
    if (window.jspdf) { cb(); return; }
    var s = document.createElement('script');
    s.src     = CDN;
    s.onload  = cb;
    s.onerror = function () { console.error('NKWorksheetPDF: jsPDF nicht ladbar'); };
    document.head.appendChild(s);
  }

  /* ── Neues Dokument (A4, Hochformat, mm) ──────── */
  function create(opts) {
    var JsPDF = (window.jspdf && window.jspdf.jsPDF) || window.jsPDF;
    if (!JsPDF) throw new Error('NKWorksheetPDF: jsPDF nicht geladen – load() zuerst aufrufen');
    return new JsPDF(Object.assign({ orientation: 'p', unit: 'mm', format: 'a4' }, opts || {}));
  }

  /* ── Vorschau-Modal ───────────────────────────── */
  function preview(doc, filename, theme) {
    var t = theme || THEMES.mathematik;
    var c = t.color;
    var b = t.borderColor;

    var blob    = doc.output('blob');
    var blobUrl = URL.createObjectURL(blob);

    /* Backdrop */
    var overlay = document.createElement('div');
    overlay.style.cssText =
      'position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.62);' +
      'display:flex;align-items:center;justify-content:center;' +
      'padding:20px;box-sizing:border-box;';

    /* Container */
    var box = document.createElement('div');
    box.style.cssText =
      'background:#fff;border-radius:20px;width:100%;max-width:700px;' +
      'max-height:calc(100vh - 40px);display:flex;flex-direction:column;' +
      'overflow:hidden;box-shadow:0 24px 64px rgba(0,0,0,0.38);';

    /* Titelleiste */
    var topBar = document.createElement('div');
    topBar.style.cssText =
      'display:flex;align-items:center;justify-content:space-between;' +
      'padding:14px 20px;flex-shrink:0;border-bottom:1px solid ' + b + ';';

    var titleEl = document.createElement('span');
    titleEl.textContent = 'Vorschau – Übungsblatt';
    titleEl.style.cssText =
      'font-family:Solway,Georgia,serif;font-size:17px;font-weight:600;color:' + c + ';';

    /* Schließen-Icon – identisch mit .nk-breadcrumb__close */
    var xBtn = document.createElement('button');
    xBtn.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true" width="26" height="26">' +
      '<path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2"' +
      ' stroke-linecap="round"/></svg>';
    xBtn.style.cssText =
      'background:none;border:none;cursor:pointer;color:' + c + ';' +
      'padding:4px;line-height:0;border-radius:8px;' +
      'display:flex;align-items:center;justify-content:center;';
    xBtn.setAttribute('aria-label', 'Schließen');

    topBar.appendChild(titleEl);
    topBar.appendChild(xBtn);

    /* PDF-Vorschau */
    var frame = document.createElement('iframe');
    frame.src = blobUrl;
    frame.style.cssText = 'flex:1;border:none;width:100%;min-height:420px;';

    /* Button-Leiste */
    var btmBar = document.createElement('div');
    btmBar.style.cssText =
      'display:flex;justify-content:flex-end;gap:12px;' +
      'padding:14px 20px;flex-shrink:0;border-top:1px solid ' + b + ';';

    function closeModal() {
      URL.revokeObjectURL(blobUrl);
      document.body.removeChild(overlay);
    }

    /* Buttons via NKButton-Komponente (button.css + button.js erforderlich) */
    var btnTheme = { color: c };
    var btnClose = NKButton.create('Schließen',     'secondary', btnTheme, closeModal);
    var btnDl    = NKButton.create('Herunterladen', 'primary',   btnTheme, function () { doc.save(filename); });

    xBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeModal();
    });

    btmBar.appendChild(btnClose);
    btmBar.appendChild(btnDl);
    box.appendChild(topBar);
    box.appendChild(frame);
    box.appendChild(btmBar);
    overlay.appendChild(box);
    document.body.appendChild(overlay);
  }

  /* ── Export ───────────────────────────────────── */
  root.NKWorksheetPDF = {
    load:    load,
    create:  create,
    preview: preview,
    THEMES:  THEMES,
  };

}(window));
