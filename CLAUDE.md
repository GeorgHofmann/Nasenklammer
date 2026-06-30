# Nasenklammer – Projektdokumentation

Kostenloses Lernportal für Kinder (Vorschule, Grundschule, ältere Kinder).
Kein Framework, kein Build-Tool – reines HTML/CSS/Vanilla-JS.

---

## Verzeichnisstruktur

```
Nasenklammer/
├── index.html                  Startseite (Zielgruppen-Auswahl)
├── vorschule.html              Vorschule-Übersicht
├── grundschule.html            Grundschule-Übersicht
├── grundschule-faecher.html    Fachauswahl Grundschule
├── gross.html                  Übersicht ältere Kinder
├── deutsch.html                Deutsch-Übersicht (Fachseite)
├── kanban.html                 Internes Projektboard (kein Lernmodul)
│
├── mengenlehre.html            Modulseite: Mengenlehre
├── uhr.html                    Modulseite: Uhrzeit
├── zaehlen.html                Modulseite: Zählen
├── vorschule-zaehlen.html      Modulseite: Zählen bis 10
├── vorschule-zaehlen-20.html   Modulseite: Zählen bis 20
├── deutsch-abc.html            Modulseite: ABC (Anlaute)
│
├── components/                 Wiederverwendbare Komponenten
│   ├── breadcrumb.js/.css      Kontextleiste mit Dropdown-Menü
│   ├── header.js/.css          Seitenheader mit Logo + Hamburger
│   ├── menu.js/.css            Vollbild-Navigationsmenü
│   ├── card.js/.css            Karten-Grid (Startseite)
│   ├── fab.js/.css             Floating Action Button (Vorlesen/Stop)
│   ├── search.js/.css          Suchfunktion
│   ├── button.js/.css          Design-System-Schaltflächen (NKButton)
│   ├── worksheet-pdf.js        PDF-Übungsblatt-Dialog (siehe unten)
│   ├── score-panel.js/.css     Punkte-Anzeige in Übungsmodulen
│   ├── slider.js/.css          Schieberegler
│   ├── count-display.js/.css   Zähler-Anzeige
│   ├── voice.js                Text-to-Speech (NKVoice)
│   ├── transitions.js/.css     Seitenübergänge
│   ├── fonts.css               Web-Fonts (Alcyone, Solway, Noto Sans)
│   └── icons.js                Gemeinsame SVG-Icons
│
├── module/                     Übungsmodule (in iframes geladen)
│   ├── mengenlehre-warenkorb.html
│   ├── monster-hoehle.html
│   ├── monster-hoehle-20.html
│   ├── abc-anlaut.html         Drag-and-Drop Anlaut-Spiel (22 Buchstaben)
│   └── …
│
└── img/                        Statische Bilder und Illustrationen
    ├── home/
    │   ├── vorschulkind.svg
    │   ├── grundshule.svg
    │   └── großesKind.svg
    └── deutsch/
        └── ABC.svg             Karten-Illustration (HoratioLTStd-Bold, #963555)
```

---

## Theming-System

Alle Komponenten erkennen vier Lernbereiche. Die Farben sind als statische
THEMES-Objekte auf jeder Komponente verfügbar.

| Bereich    | Akzentfarbe     | Hex       | Hintergrund |
|------------|-----------------|-----------|-------------|
| mathematik | Braun-Orange    | `#964f12` | `#fef5ec`   |
| vorschule  | Dunkelbraun     | `#7a4010` | `#fdf3e8`   |
| deutsch    | Dunkelrosa      | `#963555` | `#FCF1F4`   |
| sachkunde  | Dunkelgrün      | `#1a5c2a` | `#e8f5ec`   |

> **Hinweis Deutsch:** `NKHeader.THEMES.deutsch` wurde auf `bgColor: '#FCF1F4'` /
> `textColor: '#963555'` aktualisiert. Die übrigen Komponenten (Breadcrumb, Menu,
> Button) haben noch den alten Deutsch-Wert (`#1a3a7a`). Auf Deutsch-Seiten daher
> immer mit `Object.assign` überschreiben:
> ```js
> var DEUTSCH_THEME = { color: '#963555' };
> Object.assign({}, NKBreadcrumb.THEMES.deutsch, DEUTSCH_THEME, { … })
> ```

Nutzung in einer Modulseite:

```js
// Breadcrumb
new NKBreadcrumb(el, Object.assign({}, NKBreadcrumb.THEMES.mathematik, { … }));

// Header (NKHeader.THEMES.deutsch ist bereits auf #963555 aktualisiert)
new NKHeader(el, Object.assign({}, NKHeader.THEMES.deutsch, {
  mode: 'brand',
  subtitle: 'Wissen macht Spaß',
  homeHref: 'index.html',
  onMenuClick: function() { menu.toggle(); }
}));

// PDF-Dialog
NKWorksheetPDF.preview(doc, 'datei.pdf', NKWorksheetPDF.THEMES.mathematik);

// Button
var btn = NKButton.create('Speichern', 'primary', NKButton.THEMES.mathematik);
```

---

## NKButton

Design-System-Schaltflächen aus `atom/saisonal/buttons` (Figma).
Einzubinden über `<link rel="stylesheet" href="components/button.css">` und
`<script src="components/button.js">` (vor `worksheet-pdf.js`).

```js
// Einfacher Button
var btn = NKButton.create('Speichern', 'primary', NKButton.THEMES.mathematik);
container.appendChild(btn);

// Mit Click-Handler
var btn = NKButton.create('Schließen', 'secondary', theme, function() { closeModal(); });
```

### API

`NKButton.create(label, variant, theme, onClick)`

| Parameter | Typ      | Beschreibung                                    |
|-----------|----------|-------------------------------------------------|
| `label`   | string   | Beschriftung des Buttons                        |
| `variant` | string   | `'primary'` (gefüllt) \| `'secondary'` (Rahmen) |
| `theme`   | object   | `{ color: '#964f12' }` – setzt `--nk-btn-color` |
| `onClick` | function | Optional: Click-Handler                         |

### CSS Custom Properties

| Property          | Zweck                                  |
|-------------------|----------------------------------------|
| `--nk-btn-color`  | Hauptfarbe (Hintergrund / Rahmen)      |
| `--nk-btn-text`   | Textfarbe Primary (Standard: #f8fdff)  |

### THEMES

```js
NKButton.THEMES = {
  mathematik: { color: '#964f12' },
  vorschule:  { color: '#7a4010' },
  deutsch:    { color: '#1a3a7a' }, // intern noch alt – auf Deutsch-Seiten mit { color: '#963555' } überschreiben
  sachkunde:  { color: '#1a5c2a' },
};
```

> **Hinweis zur Architektur:** `NKWorksheetPDF.preview()` verwendet intern
> `NKButton.create()` für die Dialog-Buttons. Deshalb müssen `button.css` und
> `button.js` auf jeder Seite **vor** `worksheet-pdf.js` eingebunden werden.

---

## NKBreadcrumb

Kontextleiste unter dem Header. Zeigt den aktuellen Lernpfad als klickbare
Slots und ein optionales Dropdown-Menü.

```js
new NKBreadcrumb(document.getElementById('siteBreadcrumb'), {
  // Theme (Farben)
  ...NKBreadcrumb.THEMES.mathematik,

  // Grammatik-Artikel vor dem Thema-Slot
  themaConnector: 'die',   // 'die' | 'das' | 'den' …

  // Klickbare Pfad-Slots
  slots: {
    klasse: { label: 'Grundschulkind', href: 'index.html' },
    fach:   { label: 'Mathematik',     href: 'grundschule-faecher.html' },
    thema:  { label: 'Mengenlehre',    href: 'grundschule.html' },
  },
  onSlotClick: function(key, slot) {
    if (slot.href) window.location.href = slot.href;
  },

  // Dropdown-Menü (optional)
  // Wird nicht übergeben → Standard: "Übungsblatt ausdrucken" (window.print)
  // Leeres Array []      → kein Menü
  // Eigene Items         → eigene Funktion
  menuItems: [
    { label: 'Übungsblatt ausdrucken', icon: 'print', onClick: function() { generateWorksheetPDF(); } }
  ],
});
```

---

## NKWorksheetPDF

Gemeinsamer Helfer für dynamisch generierte PDF-Übungsblätter.
Einzubinden über `<script src="components/worksheet-pdf.js">`.

> **Hinweis zur Architektur:** Anders als die übrigen Komponenten besitzt
> `worksheet-pdf.js` keine eigene `.css`-Datei. Das Modal-Styling ist als
> Inline-Strings im JS hinterlegt, damit die Komponente vollständig
> selbst-enthalten ist und nur eine einzelne `<script>`-Zeile braucht.

### Button-Stil (aus Figma Design System `atom/saisonal/buttons`)

Die Buttons im Vorschau-Modal folgen dem Figma-Designsystem:

| Eigenschaft       | Primary (Herunterladen) | Secondary (Schließen)         |
|-------------------|-------------------------|-------------------------------|
| Höhe              | 76 px                   | 76 px                         |
| Padding           | 26 px / 32 px           | 26 px / 32 px                 |
| Hintergrund       | `theme.color`           | transparent                   |
| Textfarbe         | `#f8fdff`               | `theme.color`                 |
| Rahmen            | keiner                  | `1px solid theme.color`       |
| Font              | Noto Sans Medium, 20 px | Noto Sans Medium, 20 px       |
| Letter-spacing    | 2 px                    | 2 px                          |
| Text-transform    | uppercase               | uppercase                     |
| Border-radius     | 0 (eckig)               | 0 (eckig)                     |

### API

```js
// 1. jsPDF laden (CDN, einmalig pro Seitenaufruf)
NKWorksheetPDF.load(callback);

// 2. Neues A4-Dokument erstellen
var doc = NKWorksheetPDF.create();       // Standard: Hochformat, mm
var doc = NKWorksheetPDF.create({ orientation: 'l' }); // Querformat

// 3. PDF aufbauen (jsPDF-API)
doc.setFont('helvetica', 'bold');
doc.text('Hallo!', 14, 20);
// …

// 4. Vorschau-Modal öffnen
NKWorksheetPDF.preview(doc, 'dateiname.pdf');
NKWorksheetPDF.preview(doc, 'dateiname.pdf', NKWorksheetPDF.THEMES.vorschule);
```

### THEMES

```js
NKWorksheetPDF.THEMES = {
  mathematik: { color: '#964f12', borderColor: 'rgba(150,79,18,0.15)', rgb: [150,79,18] },
  vorschule:  { color: '#7a4010', borderColor: 'rgba(122,64,16,0.15)', rgb: [122,64,16] },
  deutsch:    { color: '#1a3a7a', borderColor: 'rgba(26,58,122,0.15)', rgb: [26,58,122] },
  sachkunde:  { color: '#1a5c2a', borderColor: 'rgba(26,92,42,0.15)',  rgb: [26,92,42]  },
};
```

Das `rgb`-Array kann direkt in jsPDF-Zeichenbefehlen verwendet werden:

```js
var t = NKWorksheetPDF.THEMES.mathematik;
doc.setTextColor(t.rgb[0], t.rgb[1], t.rgb[2]);
doc.setFillColor(t.rgb[0], t.rgb[1], t.rgb[2]);
doc.setDrawColor(t.rgb[0], t.rgb[1], t.rgb[2]);
```

### Typisches Layout eines Übungsblatts

```
A4 (210 × 297 mm), Ränder: 14 mm links/rechts
──────────────────────────────────────────
0–22 mm   Kopfzeile (Hintergrund, Titel, Untertitel)
22–34 mm  Name / Datum + Trennlinie
34–286 mm Aufgaben-Bereich
286–297   Fußzeile (Impressum, grau)
```

---

## Neue Modulseite anlegen

1. HTML-Datei kopieren (z. B. `mengenlehre.html` als Vorlage).
2. Breadcrumb-Slots, `themaConnector` und `menuItems` anpassen.
3. Theme-Konstante wählen (`NKBreadcrumb.THEMES.mathematik` etc.).
4. `generateWorksheetPDF()` implementieren:
   - `NKWorksheetPDF.load(build)` aufrufen.
   - Innerhalb von `build()` mit `NKWorksheetPDF.create()` ein Dokument erstellen.
   - Am Ende `NKWorksheetPDF.preview(doc, 'dateiname.pdf', NKWorksheetPDF.THEMES.xyz)` aufrufen.
5. `button.css` und `button.js` sowie `worksheet-pdf.js` vor `analytics.js` einbinden
   (Reihenfolge: `button.css` → `button.js` → `worksheet-pdf.js`).
6. `voiceText` für den FAB-Button schreiben.
7. Seite in `components/search-data.js` ergänzen (Suchindex).

---

## Deutsch-Bereich

Farbschema: Hintergrund `#FCF1F4` (hellrosa), Akzent `#963555` (dunkelrosa).

CSS-Variablen auf Deutsch-Seiten:

```css
:root {
  --color-bg:      #F5C8D4;
  --color-accent:  #963555;
  --nk-card-color: #963555;
  --nk-fab-bg:     #963555;
  --nk-fab-color:  #F5C8D4;
}
```

Header-Untertitel auf Deutsch-Übersichtsseiten: **„Wissen macht Spaß"** (mode: 'brand').
Kartenillustrationen liegen unter `img/deutsch/`. Da sie eigene Farben mitbringen,
werden sie als `<img>`-Tag in `imageSvg` eingebunden (nicht inline).

---

## Kanban-Board (`kanban.html`)

Internes Projektboard – kein Lerninhalt, nur für die Entwicklung.
Öffnen direkt im Browser via `file://`.

- 4 Spalten: Geplant / In Arbeit / Erledigt / Geparkt
- Karten: pastelfarbener Kopf (Monopoly-Stil, Helvetica Bold) + Stichpunkte (Helvetica Regular)
- Drag & Drop zwischen Spalten und innerhalb einer Spalte (Pointer Events)
- Persistenz: `localStorage` unter Key `nk-kanban-v2`
- Standalone – keine Abhängigkeiten zu Nasenklammer-Komponenten

---

## Konventionen

- **Kein Build-Tool.** Alles wird direkt im Browser geladen.
- **Vanilla JS (ES5-kompatibel).** Kein `let`/`const`, keine Arrow-Functions,
  kein `class`-Syntax in Komponenten – für maximale Browser-Kompatibilität.
- **currentColor** für alle SVG-Icons in Komponenten, damit Themes greifen.
- **@media print** in `breadcrumb.css` blendet Navigation beim Drucken aus.
- Git-Commits direkt vom Terminal, da die Sandbox keine GitHub-Credentials hat.
