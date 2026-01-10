# Playwright E2E Framework Template 🎭

Willkommen im offiziellen Test-Framework für die TestShop Applikation. Dieses Repository bietet eine professionelle, entkoppelte Test-Umgebung, die unabhängig von der eigentlichen Web-Applikation entwickelt und ausgeführt werden kann.

---

## 🛠️ Schritt-für-Schritt Einrichtung

### 1. Grundvoraussetzungen installieren
Bevor der erste Test laufen kann, müssen drei Werkzeuge auf dem Computer vorhanden sein:

*   **Node.js (Laufzeitumgebung):** [Hier herunterladen](https://nodejs.org/). Wähle die Version **"LTS"** (Long Term Support). Dies erlaubt es, JavaScript-Code auf dem Rechner auszuführen.
*   **Git (Versionsverwaltung):** [Hier herunterladen](https://git-scm.com/). Git wird benötigt, um den Programmcode vom Server zu laden und Änderungen zu speichern.
*   **IDE (Editor):** Empfohlen ist **Google Antigravity** oder **Visual Studio Code**. Dies ist das Schreibprogramm für den Testcode.

### 2. Projekt kopieren & Repository klonen
Öffne ein Terminal (oder die Eingabeaufforderung) und führe folgenden Befehl aus, um die Dateien auf den Rechner zu kopieren:
```bash
git clone <repository-url>
cd testshop-playwright-template
```

### 3. Installation der Programm-Module
Innerhalb des Projektordners müssen die notwendigen Pakete (wie Playwright) installiert werden:
```bash
# Installiert alle benötigten Bibliotheken aus der package.json
npm install

# Installiert die Browser-Engines (Chromium, Firefox, Safari), die zum Testen genutzt werden
npx playwright install --with-deps
```

---

## 🏃 Test-Ausführung: Strategien im Überblick

Das Framework bietet maximale Flexibilität, je nachdem ob man schnell etwas validieren oder tief in die Entwicklung einsteigen möchte.

### Übersichtstabelle der Test-Strategien

| Strategie | Ziel-Umgebung | Befehl | Modus | Geeignet für... |
| :--- | :--- | :--- | :--- | :--- |
| **Cloud Check** | Vercel (Live) | `npm run test:prod` | Rechner → Cloud | Schnelle Validierung der Live-Seite |
| **Voll-Isoliert** | Docker (Lokal) | `npm run test:local` | Container → Container | Professionelle Entwicklung, Identisch zur Pipeline |
| **Hybrid (Dev)** | Docker (Lokal) | `npm run test:e2e` | Rechner → Container | Aktive Test-Entwicklung (mit Browser UI) |
| **Debugging** | Variabel | `npm run test:debug` | Sichtbare UI | Fehlersuche im Browser |

---

### Die Strategien im Detail

#### 1. Testen gegen die Cloud (Vercel) ☁️
**Einsatz:** Ideal für den schnellen Start oder zur Prüfung nach einem Deployment.
*   **Vorteil:** Keine lokale Webshop-Installation nötig.
*   **Befehl:** `npm run test:prod`
*   **Funktionsweise:** Die Tests laufen auf deinem Rechner, steuern aber die Webseite im Internet (`https://testshop-dusky.vercel.app`) an.

#### 2. Lokales Voll-Setup (Full Docker) 🐳
**Einsatz:** Der Goldstandard für lokale Entwicklung.
*   **Voraussetzung:** [Docker Desktop](https://www.docker.com/) muss laufen.
*   **Befehl:** `npm run test:local`
*   **Funktionsweise:** Docker startet automatisch den Webshop und einen zweiten Container für die Tests. Alles ist zu 100% isoliert und identisch zur späteren Pipeline.

#### 3. Hybrid-Modus (Für Entwickler) 💻 + 🐳
**Einsatz:** Wenn man neue Tests schreibt und den Browser dabei sehen möchte (Headed Mode).
*   **Schritt 1:** Starte nur den Webshop in Docker: `docker compose up app`
*   **Schritt 2:** Starte die Tests von deinem Rechner aus: `npm run test:e2e`
*   **Vorteil:** Du kannst die Playwright-Entwicklerwerkzeuge (UI Mode, Debugger) auf deinem Desktop nutzen, während die App stabil im Container läuft.

#### 4. Gezieltes Debugging & UI-Mode 🔍
Standardmäßig laufen Tests im Hintergrund ("headless"). Um "zuzuschauen" oder Fehler zu suchen:
*   **Playwright Inspector:** `npm run test:debug` (Öffnet das Tool für Schritt-für-Schritt Analyse).
*   **Headed Mode:** `HEADLESS=false npm run test:prod`
*   **UI Mode:** `npx playwright test --ui` (Bietet eine grafische Oberfläche für die Test-Ausführung).


---

## 📊 Ergebnisse analysieren & Berichte erstellen

Nach jedem Testlauf werden detaillierte Berichte erstellt. Hierfür stehen zwei Systeme zur Verfügung:

### 1. Allure Report (Grafisches Dashboard)
Allure bietet eine visuelle Aufbereitung der Testergebnisse mit Trends und Fehleranalysen.

**Der vollständige Zyklus (manuell):**
Um einen Bericht mit Historie zu erstellen, folgen diese Befehle aufeinander:
1.  **Historie sichern:** `npm run report:history` (kopiert vergangene Ergebnisse für Trend-Analysen).
2.  **Bericht generieren:** `npm run report:generate` (erzeugt das Dashboard aus den aktuellen Rohdaten).
3.  **Bericht öffnen:** `npm run report:open` (startet einen lokalen Server zur Ansicht).

**Abkürzung (Full Cycle):**
```bash
npm run test:full-cycle
```
*Dieser Befehl führt Tests aus, sichert die Historie, generiert den Bericht und öffnet ihn automatisch.*

### 2. Playwright HTML Report (Technische Details)
Für eine schnelle Analyse einzelner Fehler inklusive Videos, Screenshots und Netzwerk-Logs direkt im Browser:
```bash
npx playwright show-report reporting/playwright
```
Alternativ kann die Datei `reporting/playwright/index.html` direkt im Browser geöffnet werden.

---

## 🧹 Aufräumen & Archivierung

Um die Testumgebung sauber zu halten, können folgende Befehle genutzt werden:
*   **Daten löschen:** `npm run report:clean` (löscht alle bisherigen Testergebnisse und Berichte).
*   **Archivieren:** `npm run report:archive` (speichert den aktuellen Bericht mit Zeitstempel im Ordner `reporting/archive/`).


## 🏗️ Framework Architektur

*   **Page Object Model (POM):** Jeder Bereich der Website (Warenkorb, Login, Shop) hat eine eigene Datei im Ordner `pages/`. Das macht den Code übersichtlich.
*   **Fixtures:** Automatisierte Abläufe (wie "immer einloggen vor dem Test") sind in `fixtures/base-test.ts` definiert.
*   **Dynamic Data:** Wir nutzen `@faker-js/faker`, um bei jedem Testlauf realistische Zufallsdaten (Namen, Adressen) zu erzeugen.
*   **Config-Management:** URLs und Zugangsdaten liegen sicher in `.env`-Dateien im Ordner `config/`.
