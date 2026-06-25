/**
 * NKWorksheetPDF – gemeinsamer Helfer für PDF-Übungsblätter
 *
 * Stellt bereit:
 *   NKWorksheetPDF.load(callback)     – lädt jsPDF (CDN) falls nötig
 *   NKWorksheetPDF.create(opts)       – neues jsPDF-Dokument
 *   NKWorksheetPDF.preview(doc, name) – Vorschau-Modal + Download-Button
 *
 * Modal-Design passt zum Nasenklammer-Mathematik-Theme (#964f12).
 */

(function (root) {
  'use strict';

  var CDN = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';

  /* ── jsPDF laden (einmalig) ───────────────── */
  function load(cb) {
    if (window.jspdf) { cb(); return; }
    var s = document.createElement('script');
    s.src     = CDN;
    s.onload  = cb;
    s.onerror = function () { console.error('NKWorksheetPDF: jsPDF nicht ladbar'); };
    document.head.appendChild(s);
  }

  /* ── Neues Dokument ───────────────────────── */
  function create(opts) {
    var JsPDF = (window.jspdf && window.jspdf.jsPDF) || window.jsPDF;
    if (!JsPDF) throw new Error('jsPDF nicht geladen');
    return new JsPDF(Object.assign({ orientation: 'p', unit: 'mm', format: 'a4' }, opts || {}));
  }

  /* ── Vorschau-Modal ───────────────────────── */
  function preview(doc, filename) {
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
      'padding:14px 20px;flex-shrink:0;' +
      'border-bottom:1px solid rgba(150,79,18,0.15);';

    var titleEl = document.createElement('span');
    titleEl.textContent = 'Vorschau – Übungsblatt';
    titleEl.style.cssText =
      'font-family:Solway,Georgia,serif;font-size:17px;font-weight:600;color:#964f12;';

    /* Close-Icon – identisch mit .nk-breadcrumb__close */
    var xBtn = document.createElement('button');
    xBtn.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true" width="26" height="26">' +
      '<path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2"' +
      ' stroke-linecap="round"/></svg>';
    xBtn.style.cssText =
      'background:none;border:none;cursor:pointer;color:#964f12;' +
      'padding:4px;line-height:0;border-radius:8px;' +
      'display:flex;align-items:center;justify-content:center;';
    xBtn.setAttribute('aria-label', 'Schließen');

    topBar.appendChild(titleEl);
    topBar.appendChild(xBtn);

    /* PDF-Vorschau */
    var frame = document.createElement('iframe');
    frame.src = blobUrl;
    frame.style.cssText = 'flex:1;border:none;width:100%;min-height:420px;';

    /* Buttons – gleicher Stil wie End-Screen ("Nochmal") */
    var btmBar = document.createElement('div');
    btmBar.style.cssText =
      'display:flex;justify-content:flex-end;gap:12px;' +
      'padding:14px 20px;flex-shrink:0;' +
      'border-top:1px solid rgba(150,79,18,0.15);';

    var btnClose = document.createElement('button');
    btnClose.textContent = 'Schließen';
    btnClose.style.cssText =
      'height:52px;padding:0 32px;border:2px solid #964f12;border-radius:14px;' +
      'background:transparent;color:#964f12;' +
      'font-family:\'Noto Sans\',Arial,sans-serif;font-size:18px;cursor:pointer;';

    var btnDl = document.createElement('button');
    btnDl.textContent = 'Herunterladen';
    btnDl.style.cssText =
      'height:52px;padding:0 32px;border:none;border-radius:14px;' +
      'background:#964f12;color:#fff;' +
      'font-family:\'Noto Sans\',Arial,sans-serif;font-size:18px;cursor:pointer;';

    function closeModal() {
      URL.revokeObjectURL(blobUrl);
      document.body.removeChild(overlay);
    }

    xBtn.addEventListener('click', closeModal);
    btnClose.addEventListener('click', closeModal);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeModal();
    });
    btnDl.addEventListener('click', function () { doc.save(filename); });

    btmBar.appendChild(btnClose);
    btmBar.appendChild(btnDl);
    box.appendChild(topBar);
    box.appendChild(frame);
    box.appendChild(btmBar);
    overlay.appendChild(box);
    document.body.appendChild(overlay);
  }

  root.NKWorksheetPDF = { load: load, create: create, preview: preview };

}(window));
