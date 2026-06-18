# Nasenklammer – Komponenten-Übersicht

Alle wiederverwendbaren UI-Komponenten des Projekts.  
Status: ✅ fertig · 🚧 in Arbeit · 📋 geplant

## Konventionen

**Theming:** Alle Komponenten steuern Farben ausschließlich über CSS Custom Properties (`--komponente-bg`, `--komponente-color` usw.). SVG-Icons verwenden `stroke="currentColor"` und erben die Farbe vom CSS-`color`-Property ihres Containers — kein hardcodierter Farbwert im HTML.

**`setTheme()` vs. Inhalt:** `setTheme()` aktualisiert immer nur CSS-Variablen, nie den DOM-Inhalt. Inhaltsänderungen (Labels, Slots) werden gezielt per `textContent` auf den betroffenen Node angewendet. Dadurch bleibt Laufzeit-Zustand (geöffnete Dropdowns, aktive Chips usw.) beim Themenwechsel erhalten.

**Themes:** Jede Komponente hat ein statisches `THEMES`-Objekt mit vordefinierten Farbsets je Fach (`mathematik`, `deutsch`, `sachkunde`, `vorschule`). Eigene Farben können direkt als Optionen übergeben werden.

### Farbregel: Auswahlseiten (Gabelseiten) vs. Fächerseiten vs. Lernmodule

Die Navigationstiefe bestimmt das Farbschema:

| Ebene | Seiten | Farbe |
|---|---|---|
| **Startseite / Klassenwahl** | `index.html`, `vorschule.html`, `grundschule-faecher.html`, `gross.html` | Home-Blau |
| **Fächerübersicht** | `grundschule.html` (Mathe-Übungen) | Fach-Farbe (orange) |
| **Lernmodule** | `uhr.html`, `zaehlen.html`, `mengenlehre.html`, … | Fach-Farbe (orange) |

**Auswahlseiten (Gabelseiten)** verwenden **immer das Home-Blau** — unabhängig davon, welche Kategorie sie öffnen:

| Variable | Wert |
|---|---|
| Strip-Hintergrund / Body-Bg | `#75aee3` |
| Header-Hintergrund | `#c8e0f4` |
| Akzent / Text | `#225a93` |
| Menü `bgColor` | `#c8e0f4` |
| Menü `accentColor` | `#225a93` |
| Menü `activeColor` | `#2d74bc` |
| FAB `--nk-fab-bg` | `#f4a056` |
| FAB `--nk-fab-color` | `#00363d` |

**Fächerübersichten und Lernmodule** verwenden das fachspezifische Farbschema — siehe Fach-Themes unten.

Neue Gabelseiten folgen automatisch der Blau-Regel. Neue Lernmodule erhalten das Theme des zugehörigen Fachs.

---

### Fach-Themes

Für jedes Fach gibt es ein vollständiges Theme-Paket, das Farben, Menü-Items und Icons bündelt. Es gilt **ab der Fächerübersicht** (z. B. `grundschule.html`) und auf allen zugehörigen Lernmodul-Seiten.

#### Mathematik ✅

| Token | Wert | Wo gesetzt |
|---|---|---|
| `--color-bg` | `#fbd4b0` | `:root` der Seite |
| `--color-accent` | `#964f12` | `:root` der Seite |
| `--nk-card-color` | `#964f12` | `:root` der Seite |
| `--nk-fab-bg` | `#f4a056` | `:root` der Seite |
| `--nk-fab-color` | `#00363d` | `:root` der Seite |
| Header `bgColor` | `#fef5ec` | `NKHeader.THEMES.mathematik` |
| Header `textColor` | `#964f12` | `NKHeader.THEMES.mathematik` |
| Menu `bgColor` | `#fef5ec` | `NKMenu.THEMES.mathematik` |
| Menu `accentColor` | `#964f12` | `NKMenu.THEMES.mathematik` |
| Menu `activeColor` | `#964f12` | `NKMenu.THEMES.mathematik` |
| Breadcrumb `bgColor` | `#fbd4b0` | `NKBreadcrumb.THEMES.mathematik` |
| Breadcrumb `textColor` | `#964f12` | `NKBreadcrumb.THEMES.mathematik` |
| Suchleiste `background` | `#fde8d0` | inline in Fächerübersicht |
| Suchleiste Icon | `#f4a056` | inline in Fächerübersicht |

**Header-Modus:** Fächerübersichten (`grundschule.html`) verwenden `mode: 'brand'`:
```js
Object.assign({}, NKHeader.THEMES.mathematik, {
  mode:     'brand',
  subtitle: 'Clever lernen',
})
```
Lernmodule (`uhr.html`, `zaehlen.html`, `mengenlehre.html`) verwenden `mode: 'compact'` (Standard).

**Menü-Hierarchie (3-Ebenen-Navigation):**  
Das Menü spiegelt immer die vollständige Seitenstruktur — von der Schulkind-Auswahl bis zum Lernmodul. Die jeweils aktive Position wird per `activeHref` hervorgehoben; Vorfahren-Ebenen sind im Theme mit `active: true` vormarkiert.

| Ebene | Inhalt | CSS-Klasse |
|---|---|---|
| 1 | Vorschulkind · Grundschulkind · Großes Kind | *(normal)* |
| 2 | Mathematik · Deutsch · Sachkunde · Englisch | `nk-menu__item--level-2` |
| 3 | Uhrzeit · Zählen · Mengenlehre | `nk-menu__item--level-3` |
| — | Home · Kontakt · Impressum | *(normal, letzte Gruppe)* |

**Verfügbare Themes:**

| Theme-Key | Verwendet auf | Zeigt Ebenen |
|---|---|---|
| `NKMenu.THEMES.home` | index, vorschule, gross, about, … | 1 + Utility |
| `NKMenu.THEMES.grundschule_faecher` | grundschule-faecher.html | 1 + 2 + Utility |
| `NKMenu.THEMES.mathematik` | grundschule, uhr, zaehlen | 1 + 2 + 3 + Utility |

**Aktive Seite highlighten:**
```js
Object.assign({}, NKMenu.THEMES.mathematik, {
  activeHref: 'zaehlen.html',  // hebt Zählen in Ebene 3 hervor
  headerEl: …,
  onItemClick: …
})
```

**Neue Icons einbinden:**  
Alle Icons in `components/icons.js`. Aktuelle Keys: `vorschule`, `grundschule`, `gross`, `mathematik`, `deutsch`, `sachkunde`, `englisch`, `uhrzeit`, `zaehlen`, `mengenlehre`, `home`, `kontakt`, `impressum`.

---

#### Deutsch 📋 — *Farben noch nicht festgelegt*

| Token | Wert |
|---|---|
| `--color-bg` | — |
| `--color-accent` | — |
| Header `bgColor` | `#e8f0fc` *(Platzhalter)* |
| Header `textColor` | `#1a3a7a` *(Platzhalter)* |

---

#### Sachkunde 📋 — *Farben noch nicht festgelegt*

| Token | Wert |
|---|---|
| `--color-bg` | — |
| `--color-accent` | — |
| Header `bgColor` | `#e8f5ec` *(Platzhalter)* |
| Header `textColor` | `#1a5c2a` *(Platzhalter)* |

---

#### Englisch 📋 — *Farben noch nicht festgelegt*

| Token | Wert |
|---|---|
| `--color-bg` | — |
| `--color-accent` | — |
| Header `bgColor` | — |
| Header `textColor` | — |

---

## ✅ NKLogo (Logo-Baustein)
**Dateien:** `components/logo.js` · `components/logo.css`  
**Beschreibung:** Zentraler Logo-Baustein. Liefert HTML-Strings für das Nasenklammer-Logo — als kompaktes Bild oder als Logo+Untertitel-Block. NKHeader und NKMenu nutzen beide diese Komponente; Logo-Änderungen sind damit nur an einer Stelle nötig.  
**Verwendet in:** alle Seiten (via NKHeader und NKMenu)

```js
NKLogo.html()           // kompaktes Logo (36px), für compact-Header
NKLogo.html('brand')    // großes Logo (52px), für brand-Header
NKLogo.brandHtml()                    // Logo + „Clever lernen"
NKLogo.brandHtml('Eigener Untertitel') // Logo + eigener Text
```

**Logo tauschen:**  
- Datei ersetzen: `img/nasenklammer-logo.svg` austauschen — keine Code-Änderung nötig  
- Pfad ändern: `NKLogo.SRC` in `logo.js` anpassen — gilt sofort überall

**Einbindung (Reihenfolge beachten):**
```html
<link rel="stylesheet" href="components/logo.css">   <!-- vor header.css und menu.css -->
<script src="components/logo.js"></script>            <!-- vor header.js und menu.js -->
```

**Größen (via `logo.css`):**

| Klasse | Höhe desktop | Höhe mobil | Verwendet in |
|---|---|---|---|
| `.nk-logo` | 36px | 28px | Compact-Header |
| `.nk-logo--brand` | 52px | 38px | Brand-Header, Menü |

---

## ✅ NKSlider (Stufenregler)
**Dateien:** `components/slider.js` · `components/slider.css`  
**Beschreibung:** Stufenregler mit hervorgehobenem Aktiv-Label. Der aktuell gewählte Endwert wird durch größere Schrift und volle Deckkraft betont. Farben über CSS Custom Properties steuerbar.  
**Verwendet in:** `zaehlen.html`

```js
new NKSlider(document.getElementById('mySlider'), {
  min:      10,
  max:      20,
  step:     10,
  value:    10,
  hint:     'Anzahl der Objekte',  // optional
  color:    '#964f12',             // optional – --nk-slider-color
  thumb:    '#f4a056',             // optional – --nk-slider-thumb
  onChange: function(val) { … }
});
```

**CSS Custom Properties:**

| Property | Standard | Beschreibung |
|---|---|---|
| `--nk-slider-color` | `#964f12` | Farbe von Labels und Hinweistext |
| `--nk-slider-thumb` | `#f4a056` | Farbe des Schiebereglers |
| `--nk-slider-track` | `rgba(150,79,18,0.18)` | Farbe der Track-Linie |

**Public API:**

| Methode | Beschreibung |
|---|---|
| `getValue()` | Gibt den aktuellen Wert zurück |
| `setValue(n)` | Setzt den Wert und löst `onChange` aus |

---

## ✅ NKIcons (Icon-Registry)
**Datei:** `components/icons.js`  
**Beschreibung:** Zentrale Registry aller Menü-Icons. Jedes Icon ist ein 24×24 SVG-String mit `stroke="currentColor"` — Farbe wird vollständig per CSS gesteuert. `menu.js` liest aus `window.NKIcons`; die Datei muss vor `menu.js` geladen werden.  
**Verwendet in:** alle Seiten mit NKMenu (via `components/menu.js`)

**Icons tauschen:**  
Sag einfach: *„Nimm die Icons aus dem Ordner `pfad/zum/ordner`"* — die SVG-Dateien werden daraus gelesen und hier eingetragen. Nur `icons.js` muss angefasst werden, alle Seiten übernehmen die Änderung automatisch.

**Aktuelle Icons:**

| Key | Motiv | Verwendet für |
|---|---|---|
| `mathematik` | Taschenrechner | Fach Mathematik |
| `deutsch` | Aufgeschlagenes Buch | Fach Deutsch |
| `sachkunde` | Lupe | Fach Sachkunde |
| `englisch` | Sprechblase mit „A" | Fach Englisch |
| `home` | Haus | Navigation Home |
| `kontakt` | Briefumschlag | Navigation Kontakt |
| `impressum` | Info-Kreis | Navigation Impressum |

**Einbindung (Reihenfolge beachten):**
```html
<script src="components/icons.js"></script>   <!-- vor menu.js! -->
<script src="components/menu.js"></script>
```

**Neues Icon hinzufügen:**
```js
// In components/icons.js ergänzen:
root.NKIcons.meinIcon =
  '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">…</svg>';

// In components/menu.js THEMES verwenden:
{ label: 'Mein Punkt', href: '…', iconSvg: ICONS.meinIcon }
```

---

## ✅ NKAnalytics (Google Analytics 4)
**Datei:** `components/analytics.js`  
**Beschreibung:** Lädt GA4 automatisch und stellt projekt-weite Tracking-Funktionen bereit. Muss als **erstes Script** auf jeder Seite eingebunden sein. NKFab feuert Play/Stop-Events automatisch, wenn diese Datei geladen ist — kein zusätzlicher Code pro Seite nötig.

**Setup (einmalig):**
1. In `analytics.js` die GA4-Messung-ID bei `MEASUREMENT_ID` eintragen  
   (Format `'G-XXXXXXXXXX'` — zu finden in Google Analytics → Verwaltung → Datenströme → Web-Stream-Details)
2. Solange `'G-XXXXXXXXXX'` drin steht, läuft alles ohne Fehler, aber es wird nichts an Google gesendet

**Einbindung:**
```html
<!-- Muss das erste <script auf der Seite sein: -->
<script src="components/analytics.js"></script>
<!-- danach alle weiteren Komponenten-Scripts -->
```
Alle bestehenden Seiten sind bereits automatisch eingebunden.  
Neue Seiten: einfach analytics.js als erstes Script einfügen — fertig.

**Automatisch gemessene Events:**

| Event | Auslöser |
|---|---|
| `page_view` | Jeder Seitenaufruf (GA4-Standard) |
| `fab_play` | Vorlesen-Button gedrückt (via NKFab) |
| `fab_stop` | Stop-Button manuell gedrückt (via NKFab) |
| `page_time` | Verweildauer in Sekunden (beim Verlassen / Tab-Wechsel) |

**Manuelle Events (für eigene Lernmodul-Logik):**
```js
NKAnalytics.track('exercise_complete', {
  module: 'zaehlen',
  score:  8,
  total:  10,
});
```

**Public API:**

| Methode | Beschreibung |
|---|---|
| `NKAnalytics.track(name, params)` | Beliebiger GA4-Event mit optionalen Parametern |
| `NKAnalytics.trackPlay()` | Shortcut für `fab_play` |
| `NKAnalytics.trackStop()` | Shortcut für `fab_stop` |
| `NKAnalytics.trackDone()` | Vorlesen natürlich beendet (`fab_done`) |

**NKFab-Integration:**  
`fab.js` ruft automatisch `NKAnalytics.trackPlay()` / `trackStop()` auf, wenn `window.NKAnalytics` existiert — keine Änderung an einzelnen Seiten nötig.

---

## ✅ NKButton (Design-System-Schaltflächen)
**Datei:** `components/button.css`  
**Quelle:** Super Design System · `atom/saisonal/buttons`  
**Beschreibung:** Wiederverwendbare Schaltflächen aus dem Design-System. Rein CSS-basiert — kein JS. Visuals vollständig in `button.css`; Form-States (is-locked, is-sending usw.) werden durch die verwendende Seite als zusätzliche Klassen gesteuert.  
**Verwendet in:** `kontakt.html` (Submit-Button)

```html
<!-- Primary mit Icon -->
<button class="nk-btn nk-btn--primary">
  <span class="nk-btn__label">Abschicken</span>
  <svg>…</svg>
</button>

<!-- Secondary (Outline) -->
<button class="nk-btn nk-btn--secondary">
  <span class="nk-btn__label">Akzeptieren</span>
</button>
```

**Varianten:**

| Klasse | Beschreibung |
|---|---|
| `nk-btn--primary` | Pink (`#ed4790`), Hover `#8c0044` |
| `nk-btn--secondary` | Outline pink, transparent Hintergrund |
| `is-locked` | Opacity 20%, nicht klickbar (Submit-Gate) |
| `is-sending` | Opacity 60%, Cursor wait; `nk-btn__label::after` zeigt `…` |

**Hinweis:** `NKFab` (der orangefarbene „Vorlesen"-Button) ist eine eigene Komponente und gehört nicht zum NKButton-System — er dient als Floating Action Button, nicht als Inline-CTA.

---

## ✅ NKSearch (Slide-Up Suchmaske)
**Dateien:** `components/search.css` · `components/search.js` · `components/search-data.js`  
**Beschreibung:** Zentrale Sitesuche mit Fuzzy-Matching. Erscheint am Seitenende als Trigger-Pill; beim Tippen oder Klicken fährt ein Panel von unten hoch und zeigt gefilterte Übungsvorschläge. Auf Tablets füllt das Panel den gesamten Bereich unter dem Header.  
**Verwendet in:** `vorschule.html`, `vorschule-mathe.html`, `grundschule.html`, `grundschule-faecher.html`, `gross.html`

### Einbindung

```html
<!-- im <head>, vor fab.css -->
<link rel="stylesheet" href="components/search.css">

<!-- Mount-Point im Body -->
<div id="siteSearch"></div>

<!-- Scripts: search-data.js MUSS vor search.js stehen -->
<script src="components/search-data.js"></script>
<script src="components/search.js"></script>
```

```js
new NKSearch(document.getElementById('siteSearch'), {
  items: NKSearchData,            // zentrale Übungsliste aus search-data.js
  placeholder: 'Ich suche …',    // optional – Default: 'Ich suche eine Übung …'
  onSelect: function(item) {      // optional – Default: window.location.href = item.href
    window.location.href = item.href;
  },
});
```

### Public API

| Methode | Beschreibung |
|---|---|
| `open()` | Panel öffnen, Input fokussieren |
| `close()` | Panel schließen |
| `setItems(items)` | Übungsliste zur Laufzeit ersetzen (z. B. nach Login) |

### Fuzzy Search

Die interne `fuzzyScore(query, text)`-Funktion priorisiert Treffer in dieser Reihenfolge:

1. **Exakter Teilstring** → Score 100+ (+ Bonus wenn am Wortanfang, + Bonus je Längenanteil)
2. **Zeichenweise fuzzy** → niedrigerer Score mit Bonus für aufeinanderfolgende Treffer
3. **Kein Match** → Score 0 (wird nicht angezeigt)

Gefundene Substrings werden mit `<mark>` hervorgehoben; die `--nk-search-accent`-Farbe steuert das visuelle Highlight.

### Suchdaten – `search-data.js`

Die zentrale Datei `components/search-data.js` definiert `window.NKSearchData`. Alle Seiten teilen dieselbe Liste — so ist jede Übung von jeder Seite aus auffindbar.

```js
// components/search-data.js
var NKSearchData = [

  /* ── Vorschule ────────────────────────────────── */
  {
    label:  'Zählen bis 10',
    href:   'vorschule-zaehlen.html',
    klasse: 'vorschule',            // 'vorschule' | 'grundschule' | 'gymnasium'
    tags:   ['monster', 'höhle', 'zählen', 'mathe'],  // zusätzliche Suchbegriffe
  },

  /* ── Grundschule ──────────────────────────────── */
  {
    label:  'Uhrzeit',
    href:   'uhr.html',
    klasse: 'grundschule',
    tags:   ['uhr', 'zeit', 'mathe'],
  },

  /* Weitere Übungen hier ergänzen … */
];
```

**Neue Übung hinzufügen:** Einen Eintrag in `search-data.js` ergänzen. `label` ist der angezeigte Name; `tags` sind versteckte Suchbegriffe (z. B. Themen, Synonyme). Kein Rebuild nötig — alle Seiten laden die Datei live.

### Theming

Pro Seite werden CSS-Variablen in `:root` gesetzt, um die Farben ans jeweilige Seiten-Theme anzupassen:

```css
/* Blaue Seiten (Grundschule) */
:root {
  --nk-search-panel-bg:    rgba(165,200,230,0.97);
  --nk-search-trigger-bg:  rgba(200,224,244,0.62);
  --nk-search-icon-bg:     #963555;
  --nk-search-text:        #1a3a6c;
  --nk-search-placeholder: #5a7ea8;
  --nk-search-accent:      #225a93;
}

/* Orange Seiten (Vorschule) */
:root {
  --nk-search-panel-bg:    rgba(248,212,178,0.97);
  --nk-search-trigger-bg:  rgba(252,232,200,0.62);
  --nk-search-icon-bg:     #f4a056;
  --nk-search-text:        #6a3010;
  --nk-search-placeholder: #a06040;
  --nk-search-accent:      #c05010;
}
```

**Alle CSS Custom Properties:**

| Property | Default (search.css) | Beschreibung |
|---|---|---|
| `--nk-search-panel-bg` | `rgba(195,218,238,0.97)` | Hintergrund des offenen Panels |
| `--nk-search-trigger-bg` | `rgba(255,255,255,0.52)` | Hintergrund der Trigger-Pill |
| `--nk-search-bar-bg` | `rgba(255,255,255,0.90)` | Hintergrund der Suchleiste im Panel |
| `--nk-search-icon-bg` | `#963555` | Farbe des Lupe-Kreises in der Trigger-Pill |
| `--nk-search-text` | `#1a3a5c` | Eingabe- und Ergebnis-Textfarbe |
| `--nk-search-placeholder` | `#7a9ab8` | Platzhalterfarbe |
| `--nk-search-accent` | `var(--color-accent)` | Farbe der `<mark>`-Treffer-Highlights |
| `--nk-search-panel-height` | `220px` | Panel-Höhe auf Desktop (≥ 901px) |

### FAB-Integration

Wenn das Suchpanel offen ist, wird dem `<body>` die Klasse `nk-search-open` hinzugefügt. `search.css` nutzt das, um den FAB automatisch nach oben zu schieben:

```css
body.nk-search-open .nk-fab {
  bottom: calc(var(--nk-search-panel-height) + 20px) !important;
}
/* Auf Tablet: FAB verstecken, Panel füllt alles */
@media (max-width: 900px) {
  body.nk-search-open .nk-fab { display: none; }
}
```

Kein JS-Eingriff nötig — FAB und Search funktionieren automatisch zusammen, solange beide auf derselben Seite eingebunden sind.

### Tablet-Verhalten (≤ 900px)

Das Panel wechselt zu `top: 0; height: auto; border-radius: 0` und füllt den gesamten Viewport unter dem fixierten Header (`padding-top: 76px`). Die native Bildschirmtastatur blendet von unten ein; die Suchleiste bleibt oben im Panel sichtbar. Kein JS für Viewport-Handling nötig.

---

## ✅ NKBackNav (Zurück-Navigation)
**Dateien:** `components/back-nav.js` · `components/back-nav.css`  
**Beschreibung:** Schmale Navigationsleiste direkt unterhalb des Headers mit einem „← Zurück"-Button. Nutzt `history.back()`; fällt auf einen konfigurierbaren Fallback-Link zurück, wenn kein Browser-Verlauf vorhanden ist (z. B. Direktaufruf per Link).  
**Verwendet in:** `impressum.html`

```js
new NKBackNav(document.getElementById('siteBackNav'), {
  label:        'Zurück',     // optional – Standard: 'Zurück'
  fallbackHref: 'index.html', // optional – Standard: 'index.html'
  color:        '#225a93',    // optional – überschreibt --nk-back-nav-color
});
```

**CSS Custom Property:**

| Property | Standard | Beschreibung |
|---|---|---|
| `--nk-back-nav-color` | `#225a93` | Farbe von Icon und Text |

**Hinweis:** Die Komponente eignet sich für alle Unterseiten, die keinen eigenen Breadcrumb-Strip haben (Impressum, About, Kontakt usw.). Auf Auswahlseiten und Lernmodulen mit Strip ist sie nicht nötig.

---

## ✅ NKFab (Floating Action Button)
**Dateien:** `components/fab.js` · `components/fab.css`  
**Beschreibung:** Einheitlicher „Vorlesen / Stop"-Button auf allen Seiten. Zwei Modi steuern Positionierung und Verhalten. Zustand (Vorlesen ↔ Stop) wird intern verwaltet; `done()` signalisiert natürliches Sprachende.  
**Verwendet in:** `index.html`, `grundschule.html`, `uhr.html`

**API:**
```js
var fab = new NKFab(mountEl, {
  mode:    'page',             // 'page' | 'module'
  onSpeak: function() { NKVoice.speak(voiceText, function() { fab.done(); }); },
  onStop:  function() { NKVoice.stop(); },
});

fab.done();   // Wiedergabe natürlich beendet → zurück zu Vorlesen-Zustand
```

**Modi:**
| Modus | Verhalten | Verwendet auf |
|---|---|---|
| `page` | Immer sichtbar, `right: 32px`, volle Pill-Form | Auswahlseiten (index.html, grundschule.html, …) |
| `module` | **Lasche**: eingezogen rechts am Rand, fährt bei Hover oder während Wiedergabe herein, nach Stop wieder heraus | Lernmodule (uhr.html, …) |

**Lasche-Verhalten (`mode: 'module'`):**
- Standard: `translateX(calc(100% - 52px))` — nur das Icon ragt aus dem Bildschirmrand
- Hover: fährt vollständig herein (`translateX(0)`)
- Klick → Wiedergabe läuft (`is-playing`): bleibt vollständig sichtbar, zeigt „Stop"
- Klick auf Stop: `is-playing` entfernt → fährt wieder ein

**Theming** (in `:root` der jeweiligen Seite setzen):
```css
--nk-fab-bg:    #f4a056;   /* Hintergrundfarbe */
--nk-fab-color: #00363d;   /* Text- und Icon-Farbe */
```

---

## ✅ NKVoice (Vorlese-Service)
**Datei:** `components/voice.js`  
**Beschreibung:** Kapselt die gesamte Text-to-Speech-Logik. Alle Module rufen nur `NKVoice.speak()` auf — der verwendete Provider (Browser-TTS, ElevenLabs, OpenAI) ist in einer einzigen Datei konfigurierbar und kann jederzeit gewechselt werden, ohne die Übungsseiten anzufassen.

**API:**
```js
NKVoice.speak(voiceText);   // spricht den Text
NKVoice.stop();              // bricht ab
NKVoice.isSpeaking();        // → true/false
```

**Provider wechseln:**
```js
// ElevenLabs (empfohlen – natürlichste Kinderstimmen):
NKVoice.configure('elevenlabs', {
  apiKey:  'sk-…',
  voiceId: '…',              // aus dem ElevenLabs-Dashboard
  model:   'eleven_multilingual_v2',
});

// OpenAI TTS:
NKVoice.configure('openai', {
  apiKey: 'sk-…',
  voice:  'nova',            // 'nova' klingt am natürlichsten
  model:  'tts-1-hd',        // höhere Qualität als 'tts-1'
});

// Zurück zum Browser (default):
NKVoice.configure('browser');
```

**Provider-Vergleich:**
| Provider | Qualität | Kosten | Empfehlung |
|---|---|---|---|
| `browser` | Blechern | Kostenlos | Entwicklung |
| `elevenlabs` | Sehr natürlich, Kinderstimmen | ~$5/Monat | **Produktion** |
| `openai` | Gut, „nova" oder „shimmer" | ~$0.015/1.000 Zeichen | Alternative |

**Hinweis API-Key-Sicherheit:** API-Keys im Frontend sind sichtbar. Für den Produktiv-Einsatz einen kleinen Proxy-Endpunkt (z. B. Netlify Function) vorschalten. Die `configure()`-Schnittstelle bleibt dabei identisch.

**voiceText-Konvention:**  
Jede Seite/jedes Modul definiert oben im `<script>`-Block eine Konstante:

```js
/* ─── Vorlese-Text ───────────────────────
   Beschreibt die Übung für den Nutzer.
   Bei Änderungen am UI diesen Text anpassen.
   ───────────────────────────────────────── */
var voiceText =
  'Schau dir die Uhr an! …';
```

Der Text soll kindgerecht erklären: was der Nutzer sieht, und was er tun kann. Claude schreibt diesen Text auf Anfrage passend zum jeweiligen Modul-UI.

---

## ✅ NKCardGrid (Karten-Raster)
**Dateien:** `components/card.js` · `components/card.css`  
**Beschreibung:** Rendert ein horizontales Raster aus Navigations- oder Übungskarten (Bild + Trennlinie + Label). Wird auf der Startseite für die Kategorieauswahl und auf Unterseiten (z. B. Grundschule) für Übungsauswahl verwendet.  
**Verwendet in:** `index.html`, `grundschule.html`

**API:**
```js
new NKCardGrid(mountEl, {
  cards: [
    {
      href:     'vorschule.html',
      label:    '… Vorschulkind',
      imageSvg: '<svg>…</svg>',   // vollständiges <svg>-Element
    },
    …
  ]
});
```

**Theming:**
| CSS Custom Property | Default | Beschreibung |
|---|---|---|
| `--nk-card-color` | `var(--color-home-accent, #225a93)` | Farbe für Linie, Label und SVG-Icon |

Die Karte erbt `--nk-card-color` aus dem jeweiligen Seiten-Kontext. Kein eigenes `setTheme()` nötig — reicht, die Variable auf `:root` oder `.gs-main` zu überschreiben.

---

## ✅ ScorePanel
**Dateien:** `components/score-panel.js` · `components/score-panel.css`  
**Beschreibung:** Rechte Sidebar mit Fortschrittsbalken (richtig/falsch), Icons und Auto-Advance-Timer.  
**Verwendet in:** `index.html` (Uhr lesen)

**API:**
```js
const panel = new ScorePanel(mountEl, options);

panel.increment('correct');       // grüner Balken wächst
panel.increment('wrong');         // roter Balken wächst
panel.startTimer(callback);       // 4s-Timer → ruft callback auf
panel.stopTimer();                // Timer abbrechen
panel.reset();                    // Scores auf 0
panel.getScores();                // → { correct: 3, wrong: 1 }
```

**Optionen:**
| Option | Default | Beschreibung |
|---|---|---|
| `timerDuration` | `4000` | Auto-Advance in ms |
| `barBase` | `36` | Mindesthöhe der Balken (px) |
| `barStep` | `12` | Wachstum pro Antwort (px) |
| `barMax` | `10` | Maximale Schritte bis voll |

---

## ✅ ExerciseHeader (Titel + LevelChips)
**Dateien:** `components/exercise-header.js` · `components/exercise-header.css`  
**Beschreibung:** Übungstitel (h1) + variable Anzahl Level-Chips (3, 4, 6 …) als zusammengehöriger Block. Auf allen Übungsseiten identisch.  
**Verwendet in:** `index.html`

**API:**
```js
const exHeader = new NKExerciseHeader(mountEl, {
  title: 'Ich weiß, wie spät es ist',
  chips: [
    { label: 'Ganze Stunden',  value: 1 },
    { label: 'Halbe Stunden',  value: 2 },
    { label: 'Viertelstunden', value: 3 },
    { label: 'Gemischt',       value: 4 },
  ],
  activeValue:  1,
  onChipChange: function(value, index) { … }
});

exHeader.setActive(2);          // Chip per Value aktivieren
exHeader.setTitle('Neuer Titel');
exHeader.getActive();           // → { value: 2, index: 1 }
```

**Optionen:**
| Option | Default | Beschreibung |
|---|---|---|
| `title` | `''` | Übungstitel (h1-Text) |
| `chips` | `[]` | Array von `{ label, value }` – beliebige Anzahl |
| `activeValue` | erster Chip | Vorausgewählter Chip |
| `chipColor` | `var(--color-chip-active)` | Chip-Farbe (Rand + Füllung) |
| `chipOn` | `var(--color-chip-on)` | Textfarbe aktiver Chip |
| `onChipChange` | `null` | `function(value, index)` – Klick-Callback |

---

## 📋 ChoiceChip
**Dateien:** –  
**Beschreibung:** Antwort-Auswahlbutton mit Radio-Kreis, Hover- und Zustandsfarben (neutral / richtig / falsch).  
**Geplant für:** alle Multiple-Choice-Übungen

---

## 📋 ClockSVG
**Dateien:** –  
**Beschreibung:** Interaktive analoge Uhr als SVG. Zeiger drehbar via `setHand(id, degrees)`.  
**Geplant für:** Uhrzeit-Übungen

---

## 📋 FAB (Floating Action Button)
**Dateien:** –  
**Beschreibung:** Oranger FAB unten rechts. Wechselt zwischen „Vorlesen" (TTS) und „Weiter" (nächste Aufgabe).  
**Geplant für:** alle Übungsseiten

---

## ✅ Breadcrumb (Mad-Libs-Flow)
**Dateien:** `components/breadcrumb.js` · `components/breadcrumb.css`  
**Beschreibung:** Kontextzeile „Ich bin ein [Klasse] und übe in [Fach] die [Thema]" mit klickbaren Slots. Farbe je nach Fach-Theme.  
**Verwendet in:** `index.html`

**API:**
```js
const bc = new NKBreadcrumb(mountEl, options);

bc.setSlot('fach', 'Deutsch', '#');       // patcht nur den Text-Node, kein Re-render
bc.setTheme('#dce8fb', '#1a3a7a', '…');  // nur CSS-Vars, Inhalt bleibt erhalten
```

**Optionen:**
| Option | Default | Beschreibung |
|---|---|---|
| `slots.klasse.label` | `'Grundschulkind'` | Text des Klassen-Slots |
| `slots.fach.label` | `'Mathematik'` | Text des Fach-Slots |
| `slots.thema.label` | `'Uhrzeit'` | Text des Themen-Slots |
| `bgColor` | `#fbd4b0` | Hintergrundfarbe |
| `textColor` | `#964f12` | Text- und Icon-Farbe |
| `borderColor` | `rgba(150,79,18,0.15)` | Trennlinie unten |
| `onSlotClick` | `null` | `function(key, label)` – Klick-Callback |

**Vordefinierte Themes:**
```js
NKBreadcrumb.THEMES.mathematik
NKBreadcrumb.THEMES.deutsch
NKBreadcrumb.THEMES.sachkunde
NKBreadcrumb.THEMES.vorschule
```

### Navigationsregel – Pflicht für alle Übungsseiten

Jeder Slot muss auf genau die richtige Ebene der Seitenhierarchie zeigen:

| Slot | Ziel | Beschreibung |
|---|---|---|
| `klasse` | `index.html` | Startseite – Nutzer wählt erneut Vorschulkind / Grundschulkind / … |
| `fach` | Fächerübersicht der Klasse | Seite, auf der die Fächer aufgelistet sind |
| `thema` | Übungsauswahl des Fachs | Seite, auf der die Übungen des Fachs aufgelistet sind |

**Konkrete Zuordnung:**

| Klasse | `fach` zeigt auf | `thema` zeigt auf |
|---|---|---|
| Vorschulkind | `vorschule.html` | `vorschule-mathe.html` (o. a. Fach-Auswahl) |
| Grundschulkind | `grundschule-faecher.html` | `grundschule.html` (o. a. Fach-Auswahl) |

**`onSlotClick` muss immer gesetzt sein** – ohne Handler passiert beim Klick nichts:
```js
onSlotClick: function(key, slot) {
  if (slot.href) window.location.href = slot.href;
}
```

**Unterstrichen = navigierbar.** Ein Slot mit `href: null` sieht aus wie ein Link, tut aber nichts — das ist ein Fehler. Jeder sichtbare Slot bekommt einen echten `href`.

---

## ✅ Menu (Push-down)
**Dateien:** `components/menu.js` · `components/menu.css`  
**Beschreibung:** Push-down-Navigation direkt unter dem Header — klappt auf und schiebt den Seiteninhalt nach unten. Animation: Expo-Ease-Out (`cubic-bezier(0.16, 1, 0.3, 1)`), Items gestaffelt. Schließt per Escape oder Item-Klick. Wird vom Hamburger-Button im Header per `menu.toggle()` gesteuert.  
**Verwendet in:** `index.html`

**API:**
```js
const menu = new NKMenu(mountEl, options);

menu.open();
menu.close();
menu.toggle();                        // ← vom Header aufrufen
menu.isOpen();                        // → true/false
menu.setTheme(NKMenu.THEMES.deutsch); // Theme zur Laufzeit wechseln
```

**Optionen:**
| Option | Default | Beschreibung |
|---|---|---|
| `items` | `NKMenu.DEFAULT_ITEMS` | Array von `{ group, label, href, active?, iconSvg? }` |
| `bgColor` | `#fef5ec` | Hintergrundfarbe |
| `accentColor` | `#964f12` | Brand-Titel + Schließen-Icon + Icon-Farbe |
| `textColor` | `#202427` | Textfarbe der Menüpunkte |
| `activeColor` | `#964f12` | Farbe des aktiven Menüpunkts |
| `borderColor` | `rgba(150,79,18,0.10)` | Trennlinie unter dem Menü |
| `onItemClick` | `null` | `function(item, index)` |

**Icon-Support:** Items können optional ein `iconSvg`-Feld haben. Das Icon wird links neben dem Label gerendert und erbt die `accentColor`.
```js
{ group: 1, label: 'Mathematik', href: 'grundschule.html', iconSvg: '<svg>…</svg>' }
```

**Navigationspunkte (Default, ohne Theme):**
- Gruppe 1: Home · Vorschulkind · Grundschulkind · Großes Kind
- Gruppe 2: About · Kontakt · Impressum

**Vordefinierte Themes:**
```js
// Mathematik: enthält Items (Gruppe 1 mit Icons, Gruppe 2 ohne)
NKMenu.THEMES.mathematik
// { bgColor: '#fef5ec', accentColor: '#964f12', activeColor: '#964f12',
//   items: [ Mathematik⊕, Deutsch📖, Sachkunde🌍, Englisch💬, Home, Kontakt, Impressum ] }

NKMenu.THEMES.deutsch     // Farben, noch keine Items
NKMenu.THEMES.sachkunde   // Farben, noch keine Items
NKMenu.THEMES.vorschule   // Farben, noch keine Items
```

---

## ✅ Header
**Dateien:** `components/header.js` · `components/header.css`  
**Beschreibung:** Seitenkopf mit Logo „NASENKLAMMER" (Alcyone) und Hamburger-Menü. Farbe via `NKHeader.THEMES` je Fach wechselbar.  
**Verwendet in:** `index.html`

**API:**
```js
const header = new NKHeader(mountEl, options);

header.setTheme('#fce4f0', '#7a1260');  // nur CSS-Vars, kein Re-render
header.setLogo('<svg>…</svg>');         // tauscht nur das Logo-Element aus
```

**Optionen:**
| Option | Default | Beschreibung |
|---|---|---|
| `bgColor` | `#fcf1f4` | Hintergrundfarbe |
| `textColor` | `#964f12` | Logo- und Icon-Farbe |
| `logoSvg` | `null` | SVG-Markup (ersetzt Text-Fallback) |
| `onMenuClick` | `null` | Callback für Hamburger-Klick |

**Vordefinierte Themes:**
```js
NKHeader.THEMES.mathematik   // { bgColor: '#fcf1f4', textColor: '#964f12' }
NKHeader.THEMES.deutsch      // { bgColor: '#e8f0fc', textColor: '#1a3a7a' }
NKHeader.THEMES.sachkunde    // { bgColor: '#e8f5ec', textColor: '#1a5c2a' }
NKHeader.THEMES.vorschule    // { bgColor: '#fdf3e8', textColor: '#7a4010' }
```

---

## 📋 FeedbackText
**Dateien:** –  
**Beschreibung:** Lob-/Fehler-Zeile nach Antwort. Farbe und Text je nach Ergebnis.  
**Geplant für:** alle Übungsseiten

---

## 📋 TenFrame (Zehnerfeld)
**Dateien:** –  
**Beschreibung:** 2×5-Raster mit Wendeplättchen für Vorschul-Mathe.  
**Geplant für:** Vorschul-Mathematik

---

## 📋 NumberLine (Zahlenstrahl)
**Dateien:** –  
**Beschreibung:** Interaktiver Zahlenstrahl mit Markierungen und Drag-Punkt.  
**Geplant für:** Grundschul-Mathematik

---

---

## ✅ SEO & Auffindbarkeit

### Dateien & Links

| Datei | Zweck |
|---|---|
| `sitemap.xml` | Alle Seiten für Google-Crawler aufgelistet |
| `robots.txt` | Crawling erlaubt, verweist auf Sitemap |
| `og-image.png` | Vorschaubild für Social-Media-Links (1200×630px) |

**Wichtige Links:**
- [Google Search Console](https://search.google.com/search-console) — Indexierung überwachen, Sitemap einreichen
- [Google Analytics](https://analytics.google.com) — Besucher-Statistiken
- [Rich Results Test](https://search.google.com/test/rich-results) — prüft ob strukturierte Daten korrekt ausgelesen werden

### Meta-Tags (auf allen 10 Seiten)

Jede Seite enthält einen `<!-- SEO -->...<!-- /SEO -->`-Block direkt nach dem Viewport-Meta-Tag:

```html
<meta name="description" content="Individuelle Beschreibung der Seite (max. 160 Zeichen)">
<meta name="robots" content="index, follow">
<link rel="canonical" href="https://nasenklammer.de/seitenname.html">
<meta property="og:type" content="website">
<meta property="og:locale" content="de_DE">
<meta property="og:site_name" content="Nasenklammer">
<meta property="og:title" content="Seitentitel – Nasenklammer">
<meta property="og:description" content="…">
<meta property="og:url" content="https://nasenklammer.de/seitenname.html">
<meta property="og:image" content="https://nasenklammer.de/og-image.png">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="…">
<meta name="twitter:description" content="…">
<meta name="twitter:image" content="https://nasenklammer.de/og-image.png">
```

**Neue Seiten:** Block manuell einfügen oder das Script `/tmp/add_seo.py` um die neue Seite erweitern und erneut ausführen.

### Sitemap einreichen (einmalig nach Go-live)

1. [search.google.com/search-console](https://search.google.com/search-console) öffnen
2. Property `nasenklammer.de` auswählen (Domain-Typ, via 1&1 verifiziert)
3. Links im Menü → **Sitemaps**
4. `sitemap.xml` eingeben und auf **Senden** klicken

Die Sitemap muss nach dem Hinzufügen neuer Seiten aktualisiert und erneut eingereicht werden.

### Prioritäten in der Sitemap

| Priorität | Seiten |
|---|---|
| `1.0` | `index.html` |
| `0.9` | Lernmodule (`uhr.html`, `zaehlen.html`) |
| `0.8` | Persona-Einstieg (`vorschule.html`, `grundschule-faecher.html`, `gross.html`) |
| `0.7` | Fach-Übersichten (`grundschule.html`) |
| `0.2–0.4` | `about.html`, `kontakt.html`, `impressum.html` |

---

## Vorschule – Lernbereiche & Themen

Die Nasenklammer-Vorschule ist in fünf Hauptbereiche gegliedert. Vier davon erscheinen als Kacheln auf `vorschule.html`; Sprache & Kommunikation ist in die anderen Bereiche integriert.

### 1. Meine Welt *(Sachunterricht / Mein Alltag & Die Welt)*

Orientierung und tägliches Leben — alles, was ein Vorschulkind unmittelbar erleben und erkunden kann.

| Unterthema | Inhalt |
|---|---|
| Zeit verstehen | Tagesabläufe, die Uhr, Jahreszeiten, Wochentage |
| Mein Umfeld | Familie, Freunde, Regeln im Zusammenleben |
| Natur & Umwelt | Pflanzen, Tiere, Wetter |

**Kachel:** aktiv → `vorschule-mathe.html` (Platzhalter; eigene Seite noch geplant)

---

### 2. Logik & Reihenfolgen *(Mathematik / Die Welt der Zahlen & Formen)*

Ordnen, zählen und messen — mathematische Grundkonzepte spielerisch entdecken.

| Unterthema | Inhalt |
|---|---|
| Logik & Reihenfolgen | Sequenzen, „Was kommt zuerst, was kommt dann?", zeitliche Abfolgen |
| Zahlen & Mengen | Zählen bis 10, einfache Rechnungen, Mengenvergleiche |
| Geometrie | Formen entdecken, räumliches Vorstellungsvermögen |

**Aktuell verfügbar:** Zählen bis 10 → `vorschule-zaehlen.html` (Modul: `monster-hoehle.html`)  
**Kachel:** disabled (geplant: `vorschule-logik.html`)

---

### 3. Ich und mein Körper *(Gesundheit & Soziales)*

Identität, Körper und soziale Kompetenzen.

| Unterthema | Inhalt |
|---|---|
| Gesundheit | Was braucht mein Körper? (Essen, Bewegung, Schlaf) |
| Gefühle | Umgang mit Emotionen |
| Körperwahrnehmung | Motorik und Koordination |

**Kachel:** disabled (geplant: `vorschule-koerper.html`)

---

### 4. Kreativwerkstatt *(Kunst & Werken)*

Gelerntes durch eigenes Handeln vertiefen.

| Unterthema | Inhalt |
|---|---|
| Basteln & Bauen | Zeitstrahlen basteln, Kalender gestalten |
| Malen & Gestalten | Ausdruck der eigenen Wahrnehmung |

**Kachel:** disabled (geplant: `vorschule-kreativ.html`)

---

### 5. Sprache & Kommunikation *(Sprache)*

Kein eigener Kachel-Eintrag — Sprache ist als Querschnittskompetenz in alle anderen Bereiche integriert.

| Unterthema | Inhalt |
|---|---|
| Geschichtenerzählen | Erlebnisse strukturieren (Gestern, Heute, Morgen) |
| Wortschatz | Begriffe rund um die Zeit lernen |

---

### Seitenstruktur Vorschule

```
vorschule.html                    ← Kategorieauswahl (4 Kacheln)
├── vorschule-mathe.html          ← Meine Welt / Mathematik (aktiv)
│   └── vorschule-zaehlen.html   ← Zählen bis 10 (Modul: monster-hoehle.html)
├── [vorschule-logik.html]        ← Logik & Reihenfolgen (geplant)
├── [vorschule-koerper.html]      ← Ich und mein Körper (geplant)
└── [vorschule-kreativ.html]      ← Kreativwerkstatt (geplant)
```

**Farbregel:** Alle Vorschul-Auswahlseiten (`vorschule.html`) → Home-Blau. Fach- und Modulseiten → Mathematik-Orange (aktuell als Platzhalter; eigene Vorschul-Farbpalette noch festzulegen).

---

*Zuletzt aktualisiert: 2026-06-13 (Vorschule Lernbereiche & Curriculum-Struktur hinzugefügt)*
