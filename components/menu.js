/**
 * NKMenu – Push-down / Slide-down Menü
 *
 * Das Menü bildet den vollständigen Navigationsbaum ab und
 * klappt kontextabhängig auf: Nur der Ast, auf dem sich der
 * Nutzer gerade befindet, ist geöffnet.
 *
 * ── Grundkonzept ────────────────────────────────────────────
 *   1. NKMenu.NAV_TREE  – einmaliger Navigationsbaum für das
 *      gesamte Projekt (Personas → Fächer → Lernmodule)
 *   2. activeHref        – gibt an, welche Seite gerade aktiv
 *      ist; der Baum wird automatisch bis dorthin aufgeklappt
 *   3. Themes            – steuern nur Farben, nicht Struktur
 *
 * ── Usage ───────────────────────────────────────────────────
 *   const menu = new NKMenu(document.getElementById('siteMenu'),
 *     Object.assign({}, NKMenu.THEMES.mathematik, {
 *       activeHref: 'zaehlen.html',
 *       headerEl:   document.getElementById('siteHeader'),
 *       onItemClick: function(item) {
 *         if (item.href && item.href !== '#') location.href = item.href;
 *       }
 *     })
 *   );
 *
 * ── Neues Lernmodul einbinden ───────────────────────────────
 *   In NKMenu.NAV_TREE den Eintrag bei der richtigen Persona
 *   und dem richtigen Fach ergänzen. Fertig — alle Seiten
 *   sehen das neue Modul automatisch.
 *
 * ── Neues Fach einbinden ────────────────────────────────────
 *   Ebenfalls in NAV_TREE bei der jeweiligen Persona ergänzen.
 *   Dann THEMES für das neue Fach anlegen.
 *
 * Public API:
 *   menu.open()    menu.close()    menu.toggle()    menu.isOpen()
 *   menu.setTheme(theme)
 */

(function (root) {
  'use strict';

  /* ── Icon-Registry ──────────────────────────────
     Icons kommen aus components/icons.js (window.NKIcons).
     ─────────────────────────────────────────────── */
  var ICONS = window.NKIcons || {};

  /* ── Navigationsbaum ───────────────────────────
     Einzige Quelle der Wahrheit für die Seitenstruktur.
     activeHref bestimmt zur Laufzeit welche Äste offen sind.

     Struktur:
       tree[]          – Ebene 1: Personas
         .children[]  – Ebene 2: Fächer
           .children[]– Ebene 3: Lernmodule
       utility[]      – Home / Kontakt / Impressum (immer am Ende)
     ─────────────────────────────────────────────── */
  var NAV_TREE = {
    tree: [
      {
        label: 'Vorschulkind',
        href:  'vorschule.html',
        iconSvg: ICONS.vorschule,
        children: [
          { label: 'Mathematik', href: '#', iconSvg: ICONS.mathematik, children: [
            { label: 'Uhrzeit',     href: '#',                iconSvg: ICONS.uhrzeit     },
            { label: 'Zählen',      href: '#',                iconSvg: ICONS.zaehlen     },
            { label: 'Mengenlehre', href: 'mengenlehre.html', iconSvg: ICONS.mengenlehre },
          ]},
          { label: 'Deutsch',   href: '#', iconSvg: ICONS.deutsch   },
          { label: 'Sachkunde', href: '#', iconSvg: ICONS.sachkunde },
          { label: 'Englisch',  href: '#', iconSvg: ICONS.englisch  },
        ],
      },
      {
        label: 'Grundschulkind',
        href:  'grundschule-faecher.html',
        iconSvg: ICONS.grundschule,
        children: [
          { label: 'Mathematik', href: 'grundschule.html', iconSvg: ICONS.mathematik, children: [
            { label: 'Uhrzeit',     href: 'uhr.html',          iconSvg: ICONS.uhrzeit     },
            { label: 'Zählen',      href: 'zaehlen.html',      iconSvg: ICONS.zaehlen     },
            { label: 'Mengenlehre', href: 'mengenlehre.html',  iconSvg: ICONS.mengenlehre },
          ]},
          { label: 'Deutsch',   href: '#', iconSvg: ICONS.deutsch   },
          { label: 'Sachkunde', href: '#', iconSvg: ICONS.sachkunde },
          { label: 'Englisch',  href: '#', iconSvg: ICONS.englisch  },
        ],
      },
      {
        label: 'Großes Kind',
        href:  'gross.html',
        iconSvg: ICONS.gross,
        children: [
          { label: 'Mathematik', href: '#', iconSvg: ICONS.mathematik, children: [] },
          { label: 'Deutsch',   href: '#', iconSvg: ICONS.deutsch   },
          { label: 'Sachkunde', href: '#', iconSvg: ICONS.sachkunde },
          { label: 'Englisch',  href: '#', iconSvg: ICONS.englisch  },
        ],
      },
    ],
    utility: [
      { label: 'Home',      href: 'index.html',    iconSvg: ICONS.home      },
      { label: 'Kontakt',   href: 'kontakt.html',  iconSvg: ICONS.kontakt   },
      { label: 'Impressum', href: 'impressum.html', iconSvg: ICONS.impressum },
    ],
  };

  /* ── Pfad zur aktiven Seite ermitteln ──────────
     Sucht rekursiv im Baum nach href und gibt
     ein Array der Vorfahren zurück:
       findActivePath(tree, 'zaehlen.html')
       → [Grundschulkind-Node, Mathematik-Node, Zählen-Node]
     ─────────────────────────────────────────────── */
  function findActivePath(tree, href) {
    if (!href) return [];
    for (var i = 0; i < tree.length; i++) {
      var node = tree[i];
      if (node.href === href) return [node];
      if (node.children && node.children.length) {
        for (var j = 0; j < node.children.length; j++) {
          var child = node.children[j];
          if (child.href === href) return [node, child];
          if (child.children && child.children.length) {
            for (var k = 0; k < child.children.length; k++) {
              if (child.children[k].href === href) return [node, child, child.children[k]];
            }
          }
        }
      }
    }
    return [];
  }

  /* ── Themes ─────────────────────────────────────
     Themes steuern ausschließlich Farben.
     Die Navigationsstruktur kommt immer aus NAV_TREE.
     ─────────────────────────────────────────────── */
  var THEMES = {
    home: {
      bgColor:     '#c8e0f4',
      accentColor: '#225a93',
      textColor:   '#202427',
      activeColor: '#2d74bc',
      borderColor: 'rgba(34,90,147,0.12)',
    },
    mathematik: {
      bgColor:     '#fef5ec',
      accentColor: '#964f12',
      textColor:   '#202427',
      activeColor: '#964f12',
      borderColor: 'rgba(150,79,18,0.10)',
    },
    deutsch:   { bgColor: '#eef3fc', accentColor: '#1a3a7a', textColor: '#202427', activeColor: '#1a3a7a', borderColor: 'rgba(26,58,122,0.10)'  },
    sachkunde: { bgColor: '#eef6ef', accentColor: '#1a5c2a', textColor: '#202427', activeColor: '#1a5c2a', borderColor: 'rgba(26,92,42,0.10)'   },
    vorschule: { bgColor: '#fef3e8', accentColor: '#7a4010', textColor: '#202427', activeColor: '#7a4010', borderColor: 'rgba(122,64,16,0.10)'  },
    gross:     { bgColor: '#e8eef8', accentColor: '#2c4a7a', textColor: '#202427', activeColor: '#2c4a7a', borderColor: 'rgba(44,74,122,0.10)'  },
  };

  /* ── Schließen-Icon ─────────────────────────── */
  function closeIconSvg() {
    return (
      '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
      '<path d="M18 6L6 18M6 6l12 12"' +
      ' stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>' +
      '</svg>'
    );
  }

  /* ── Constructor ───────────────────────────── */
  function NKMenu(el, opts) {
    if (!el) throw new Error('NKMenu: mount element is required');

    var o = opts || {};
    this.el          = el;
    this.bgColor     = o.bgColor     || THEMES.home.bgColor;
    this.accentColor = o.accentColor || THEMES.home.accentColor;
    this.textColor   = o.textColor   || THEMES.home.textColor;
    this.activeColor = o.activeColor || THEMES.home.activeColor;
    this.borderColor = o.borderColor || THEMES.home.borderColor;
    this._activeHref = o.activeHref  || null;
    this._navTree    = (o.navTree !== undefined) ? o.navTree : NAV_TREE;
    this._items      = o.items       || NKMenu.DEFAULT_ITEMS;
    this.onItemClick = o.onItemClick || null;
    this._headerEl   = o.headerEl    || null;
    this._open       = false;

    this.el.classList.add('nk-menu');
    this._applyColors();
    this._render();
    this._bindKeyboard();
  }

  /* ── Private: CSS-Variablen ─────────────────── */
  NKMenu.prototype._applyColors = function () {
    this.el.style.setProperty('--menu-bg',     this.bgColor);
    this.el.style.setProperty('--menu-accent', this.accentColor);
    this.el.style.setProperty('--menu-text',   this.textColor);
    this.el.style.setProperty('--menu-active', this.activeColor);
    this.el.style.setProperty('--menu-border', this.borderColor);
  };

  /* ── Private: Flache Item-Liste aus NAV_TREE ───
     Baut anhand des aktiven Pfads die sichtbare
     Item-Liste auf. Nur der aktive Ast wird aufgeklappt.
     ─────────────────────────────────────────────── */
  NKMenu.prototype._buildItems = function () {
    var href = this._activeHref;

    /* Fallback: kein Baum → statische Items */
    if (!this._navTree) return this._items;

    var tree       = this._navTree.tree   || [];
    var utility    = this._navTree.utility || [];
    var activePath = findActivePath(tree, href);
    var items      = [];

    /* Ebene 1–3 aus dem Baum */
    for (var i = 0; i < tree.length; i++) {
      var node   = tree[i];
      var nodeOn = activePath.indexOf(node) !== -1;
      items.push({
        group: 1, level: 1,
        label: node.label, href: node.href, iconSvg: node.iconSvg,
        active: nodeOn,
      });

      /* Ebene 2: Fächer – nur unter aktivem Persona-Knoten */
      if (nodeOn && node.children && node.children.length) {
        for (var j = 0; j < node.children.length; j++) {
          var child   = node.children[j];
          var childOn = activePath.indexOf(child) !== -1;
          items.push({
            group: 1, level: 2,
            label: child.label, href: child.href, iconSvg: child.iconSvg,
            active: childOn,
          });

          /* Ebene 3: Lernmodule – nur unter aktivem Fach-Knoten */
          if (childOn && child.children && child.children.length) {
            for (var k = 0; k < child.children.length; k++) {
              var gc   = child.children[k];
              var gcOn = activePath.indexOf(gc) !== -1;
              items.push({
                group: 1, level: 3,
                label: gc.label, href: gc.href, iconSvg: gc.iconSvg,
                active: gcOn,
              });
            }
          }
        }
      }
    }

    /* Utility-Gruppe (Home / Kontakt / Impressum) */
    for (var u = 0; u < utility.length; u++) {
      var ut = utility[u];
      items.push({
        group: 2, level: 1,
        label: ut.label, href: ut.href, iconSvg: ut.iconSvg,
        active: href === ut.href,
      });
    }

    return items;
  };

  /* ── Private: rendern ───────────────────────── */
  NKMenu.prototype._render = function () {
    var self         = this;
    var renderedItems = this._buildItems();

    /* Nach Gruppen sortieren */
    var groups    = {};
    var idx       = 0;
    var groupsHtml = '';

    for (var k = 0; k < renderedItems.length; k++) {
      var g = renderedItems[k].group || 1;
      if (!groups[g]) groups[g] = [];
      groups[g].push(renderedItems[k]);
    }

    var groupKeys = Object.keys(groups).sort();
    for (var gi = 0; gi < groupKeys.length; gi++) {
      groupsHtml += '<div class="nk-menu__group">';
      var groupItems = groups[groupKeys[gi]];
      for (var ii = 0; ii < groupItems.length; ii++) {
        var it      = groupItems[ii];
        var hasIcon = !!it.iconSvg;
        var iconHtml = hasIcon
          ? '<span class="nk-menu__item-icon">' + it.iconSvg + '</span>'
          : '';
        var isActive = !!it.active;
        var levelCls = it.level && it.level > 1 ? ' nk-menu__item--level-' + it.level : '';
        groupsHtml +=
          '<a class="nk-menu__item' +
          (hasIcon  ? ' nk-menu__item--has-icon' : '') +
          levelCls +
          (isActive ? ' is-active' : '') + '"' +
          ' href="' + (it.href || '#') + '"' +
          ' style="--i:' + idx + '"' +
          ' data-item-idx="' + idx + '">' +
          iconHtml +
          '<span class="nk-menu__item-label">' + it.label + '</span>' +
          '</a>';
        idx++;
      }
      groupsHtml += '</div>';
    }

    this.el.innerHTML =
      '<div class="nk-menu__inner">' +
        '<div class="nk-menu__body">' +
          '<div class="nk-menu__brand">' +
            '<a class="nk-menu__brand-link" href="index.html">' +
              NKLogo.brandHtml('Clever lernen') +
            '</a>' +
            '<button class="nk-menu__close" aria-label="Menü schließen">' +
              closeIconSvg() +
            '</button>' +
          '</div>' +
          '<nav class="nk-menu__nav">' + groupsHtml + '</nav>' +
          '<p class="nk-menu__footer">© 2026 · All rights reserved by nasenklammer.de</p>' +
        '</div>' +
      '</div>';

    /* Schließen-Button */
    this.el.querySelector('.nk-menu__close')
      .addEventListener('click', function () { self.close(); });

    /* Item-Klicks */
    var links = this.el.querySelectorAll('.nk-menu__item');
    for (var li = 0; li < links.length; li++) {
      (function (link, itemIdx) {
        link.addEventListener('click', function (e) {
          if (link.getAttribute('href') === '#') e.preventDefault();
          for (var j = 0; j < links.length; j++) links[j].classList.remove('is-active');
          link.classList.add('is-active');
          if (typeof self.onItemClick === 'function') {
            self.onItemClick(renderedItems[itemIdx], itemIdx);
          }
          setTimeout(function () { self.close(); }, 200);
        });
      })(links[li], li);
    }
  };

  /* ── Private: Escape-Taste ──────────────────── */
  NKMenu.prototype._bindKeyboard = function () {
    var self = this;
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && self._open) self.close();
    });
  };

  /* ── Public: öffnen ──────────────────────────  */
  NKMenu.prototype.open = function () {
    this._open = true;
    this.el.classList.add('is-open');
    if (this._headerEl) this._headerEl.classList.add('nk-header--hidden');
  };

  /* ── Public: schließen ───────────────────────  */
  NKMenu.prototype.close = function () {
    this._open = false;
    this.el.classList.remove('is-open');
    if (this._headerEl) this._headerEl.classList.remove('nk-header--hidden');
  };

  /* ── Public: umschalten ──────────────────────  */
  NKMenu.prototype.toggle = function () {
    if (this._open) this.close(); else this.open();
  };

  /* ── Public: Status ──────────────────────────  */
  NKMenu.prototype.isOpen = function () { return this._open; };

  /* ── Public: Theme zur Laufzeit wechseln ─────  */
  NKMenu.prototype.setTheme = function (theme) {
    this.bgColor     = theme.bgColor     || this.bgColor;
    this.accentColor = theme.accentColor || this.accentColor;
    this.textColor   = theme.textColor   || this.textColor;
    this.activeColor = theme.activeColor || this.activeColor;
    this.borderColor = theme.borderColor || this.borderColor;
    this._applyColors();
  };

  /* ── Fallback-Items wenn navTree: null ───────── */
  NKMenu.DEFAULT_ITEMS = [
    { group: 1, label: 'Home',      href: 'index.html',    iconSvg: ICONS.home      },
    { group: 1, label: 'Kontakt',   href: 'kontakt.html',  iconSvg: ICONS.kontakt   },
    { group: 1, label: 'Impressum', href: 'impressum.html', iconSvg: ICONS.impressum },
  ];

  NKMenu.NAV_TREE = NAV_TREE;
  NKMenu.THEMES   = THEMES;
  root.NKMenu     = NKMenu;

}(typeof window !== 'undefined' ? window : this));
