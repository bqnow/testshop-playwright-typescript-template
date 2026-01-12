# Playwright E2E Framework Template 🎭

Willkommen im offiziellen Test-Framework für die TestShop Applikation. Dieses Repository bietet eine professionelle, entkoppelte Test-Umgebung, die unabhängig von der eigentlichen Web-Applikation entwickelt und ausgeführt werden kann.

### 🚀 Highlights & Features
*   **Parallel Speed:** Maximale Geschwindigkeit durch parallele Testausführung (`fullyParallel`).
*   **Isoliert & Sicher:** Komplette Testausführung in Docker möglich (identisch zur CI).
*   **Multi-Stage Support:** Nahtloses Testen gegen Lokal, QA, Staging und Produktion.
*   **Page Object Model (POM):** Hochgradig wartbarer Code durch strikte Trennung von Logik und Selektoren.
*   **Smart Data Fixtures:** Automatischer Login-Status und realistische Zufallsdaten via `@faker-js/faker`.
*   **Visual Regression:** Screenshot-Vergleiche erkennen unbeabsichtigte UI-Änderungen automatisch.
*   **Deep Reporting:** Automatisierte Allure-Dashboards mit Historie, Trends und Screenshots/Videos.
*   **CI/CD & Cloud Ready:** Integrierte GitHub Actions und Vorbereitung für **BrowserStack** (Remote Grid).

---

## � Requirements Coverage

Dieses Template deckt 6 definierte Requirements ab. Details findest du in [REQUIREMENTS.md](REQUIREMENTS.md).

| **Anforderung (ID)** | **Test-Datei** | **Kategorie** |
| :--- | :--- | :--- |
| **REQ-001: Authentifizierung** | `e2e/smoke.spec.ts` | Funktional (Smoke) |
| **REQ-002: Happy Path** | `e2e/happy-path.spec.ts` | Funktional (E2E) |
| **REQ-003: Formular Validierung** | `e2e/checkout-validation.spec.ts` | Funktional (Negativ) |
| **REQ-004: Fehlerbehandlung** | `e2e/edge-cases.spec.ts` | Funktional (Edge) |
| **REQ-005: Visuelle Regression** | `e2e/visual.spec.ts` | Nicht-Funktional |
| **REQ-006: State Persistence** | `e2e/api-optimization-showcase.spec.ts` | Nicht-Funktional |

---

## �🛠️ Schritt-für-Schritt Einrichtung

### 1. Grundvoraussetzungen installieren
Bevor der erste Test laufen kann, müssen diese Werkzeuge auf dem Computer vorhanden sein:

*   **Node.js (Laufzeitumgebung):** [Hier herunterladen](https://nodejs.org/). Wähle die Version **"LTS"**.
*   **Git (Versionsverwaltung):** [Hier herunterladen](https://git-scm.com/).
*   **Docker Desktop:** [Hier herunterladen](https://www.docker.com/products/docker-desktop/). Notwendig für lokale App-Container und isolierte Tests.
*   **Java (JRE):** Wird für die Erzeugung der Allure-Berichte benötigt. Prüfe mit `java -version`.
*   **IDE (Editor):** Empfohlen ist **Google Antigravity** oder **Visual Studio Code**.

**Prüfe, ob alles korrekt installiert ist:**
```bash
node --version   # Sollte v18+ oder v20+ zeigen
git --version    # Sollte git version 2.x zeigen
docker --version # Sollte Docker version 20+ zeigen
java -version    # Sollte java version zeigen
```

### 2. Projekt kopieren & Repository klonen
Öffne ein Terminal (oder die Eingabeaufforderung) und führe folgenden Befehl aus:
```bash
git clone https://github.com/bqnow/testshop-playwright-template.git
cd testshop-playwright-template
```

### 3. Installation der Programm-Module
Innerhalb des Projektordners müssen die notwendigen Pakete installiert werden:
```bash
# Installiert alle benötigten Bibliotheken aus der package.json
npm install

# Installiert die Browser-Engines (Chromium, Firefox, Safari), die zum Testen genutzt werden
npx playwright install --with-deps
```

---

## 🚀 Quick Start - Dein erster Test

Jetzt ist alles bereit! So führst du deinen ersten erfolgreichen Test aus:

```bash
# 1. Starte den Webshop im Hintergrund (Docker-Container)
npm run app:up

# 2. Warte 10 Sekunden, bis der Container hochgefahren ist
# (Beim ersten Mal kann es etwas länger dauern)

# 3. Führe die Tests aus
npm run test:e2e

# 4. Generiere und öffne den Report
npm run report:show
```

**✅ Erfolg?** Wenn du ein Browser-Fenster mit dem Allure-Dashboard siehst, ist alles perfekt eingerichtet!

**Tipp:** Mit `npm run check:e2e` kannst du Schritte 3 und 4 in einem Befehl zusammenfassen.

**Beenden:** Mit `npm run app:down` kannst du den Docker-Container später wieder stoppen.

---

## 🏗️ Framework Architektur

**Page Object Model (POM):**
Jeder Bereich der Webseite hat eine eigene Klasse im Ordner `pages/` (z.B. `LoginPage.ts`, `CartPage.ts`). Selektoren und Interaktions-Logik sind dort zentral definiert, sodass Änderungen an der UI nur an einer Stelle gepflegt werden müssen.

**Smart Fixtures:**
Wiederverwendbare Abläufe (wie "automatischer Login vor dem Test") sind in `fixtures/base-test.ts` als Playwright-Fixtures definiert. Tests können einfach das `loggedInPage`-Fixture nutzen, ohne Login-Code zu wiederholen.

**Dynamic Test Data:**
Mit `@faker-js/faker` werden bei jedem Testlauf realistische Zufallsdaten (Namen, Adressen, E-Mails) generiert. So vermeidest du statische Testdaten und erhöhst die Robustheit.

---

## ⚙️ Environment & Konfiguration

**Zentrales Management pro Stage:**
Alle Zugangsdaten werden zentral aus den `.env`-Dateien geladen, wobei lokale Dateien (`.env.local`) oder GitHub-Secrets automatisch die Standardwerte überschreiben. So bleiben deine Tests für jede Umgebung flexibel, ohne dass du Passwörter jemals direkt im Programmcode anfassen musst.

*   **Dateien:** `config/.env` (Lokal), `.env.qa`, `.env.prod`, `.env.staging`
*   **Variablen:** `BASE_URL`, `TEST_USER_NAME`, `TEST_USER_PASSWORD`

**Priorität:** System/GitHub-Secrets > `.env.local` > `.env.{STAGE}` > `.env` (Baseline).

---

### 🌐 Testen in Vercel-Umgebungen

Dieses Framework ist darauf vorbereitet, gegen verschiedene Vercel-Stages zu testen. Die Steuerung erfolgt über die Umgebungsvariable `TEST_ENV`.

| Befehl | Ziel-Umgebung | Beschreibung |
| :--- | :--- | :--- |
| `TEST_ENV=qa npx playwright test` | **QA (Preview)** | Testet gegen dynamische Vercel Preview URLs. |
| `TEST_ENV=staging npx playwright test` | **Staging** | Testet gegen das Deployment des `main` Branches. |

**Pro-Tipp (QA/Vercel Preview):**
Um gegen eine ganz bestimmte Vercel Preview URL zu testen (z.B. aus einem PR), kannst du die URL direkt überschreiben:
```bash
TEST_ENV=qa BASE_URL=https://testshop-git-feature-xyz.vercel.app npx playwright test
```

---

## 🐳 Warum Docker?

Docker ist der Schlüssel zur **Konsistenz und Isolation** in diesem Framework:

*   **Identische Umgebung:** Dein lokaler Test läuft in exakt derselben Umgebung wie in der CI-Pipeline. "Works on my machine" gehört der Vergangenheit an.
*   **Saubere Isolation:** Die Test-App läuft in einem eigenen Container, unabhängig von deiner lokalen Konfiguration (Port-Konflikte, Node-Versionen).
*   **Pre-Push Confidence:** Mit `test:docker` kannst du lokal prüfen, ob dein Code auch in der Pipeline bestehen wird – bevor du pushst.

Docker ist für dieses Framework **optional** (du kannst lokal gegen jede URL testen), aber es ist der **empfohlene** Weg für professionelle Workflows.

---

## 🏃 Test-Workflows

Das Framework bietet drei klare Wege, um Tests auszuführen. Wähle den Weg, der zu deiner aktuellen Aufgabe passt:

### 1. Standard E2E (Entwickler-Workflow) 💻 + 🐳
Du schreibst neue Tests oder validierst deine lokale Arbeit.
*   **Szenario:** Dein Rechner steuert den Webshop, der in Docker läuft.
*   **Vorbereitung:** `npm run app:up` (App im Hintergrund starten)
*   **Befehl:** `npm run test:e2e` (nur Konsole) oder `npm run check:e2e` (mit Report)
*   **Vorteil:** Schnellster Workflow; der Browser ist auf deinem Desktop sichtbar.

### 2. Full Docker (Integrations-Check) 🐳 + 🐳
Du prüfst alles in einer komplett isolierten Umgebung – identisch zur Pipeline.
*   **Szenario:** Sowohl App als auch Tests laufen in Containern.
*   **Befehl:** `npm run test:docker` (nur Konsole) oder `npm run check:docker` (mit Report)
*   **Vorteil:** Eliminiert lokale Unterschiede; perfekt als letzter Check vor dem Git-Push.

### 3. Release Validierung (Cloud-Check) ☁️
Du prüfst die Erreichbarkeit und Kernfunktionen der Live-Umgebung.
*   **Szenario:** Dein Rechner testet gegen die Webseite im Internet.
*   **Befehl:** `npm run test:release` (nur Konsole) oder `npm run check:release` (mit Report)
*   **Ziel:** `https://testshop-dusky.vercel.app`

---

## 📊 Ergebnisse analysieren & Berichte erstellen

Nach jedem Testlauf werden detaillierte Berichte erstellt. Hierfür stehen zwei Systeme zur Verfügung:

### 1. Allure Report (Grafisches Dashboard)
Allure bietet eine visuelle Aufbereitung der Testergebnisse mit Trends und Fehleranalysen.

**Der vollständige Zyklus (manuell):**
Um einen Bericht mit Historie zu erstellen, folgen diese Befehle aufeinander:
1.  **Historie sichern:** `npm run report:history`
2.  **Bericht generieren:** `npm run report:generate`
3.  **Bericht öffnen:** `npm run report:open`

**Komfort-Befehl (Test + Report):**
Statt die Befehle einzeln zu tippen, nutzt du am besten die `check:`-Befehle:
```bash
# Alles in einem Schritt (Lokal / Hybrid)
npm run check:e2e (benötigt npm run app:up)

# Alles in einem Schritt (Voll-Isoliert in Docker)
npm run check:docker

# Alles in einem Schritt (Release Check gegen Cloud)
npm run check:release
```
*Diese Befehle sichern die Historie, führen die Tests aus, generieren den Bericht und öffnen ihn automatisch.*

### 2. Playwright HTML Report (Technische Details)
Für eine schnelle Analyse einzelner Fehler inklusive Videos, Screenshots und Netzwerk-Logs direkt im Browser:
```bash
npx playwright show-report reporting/playwright
```
Alternativ kann die Datei `reporting/playwright/index.html` direkt im Browser geöffnet werden.

### 3. Reporting-Kommandos (Quick Reference)

| Befehl | Wirkung |
| :--- | :--- |
| `npm run report:show` | Generiert das Dashboard aus den letzten Ergebnissen und öffnet es. |
| `npm run report:clean` | Löscht alle alten Ergebnisse (für einen frischen Start). |
| `npx playwright test --ui` | Öffnet die interaktive Playwright-Oberfläche (ideal zum Test-Schreiben). |

---

## 🧹 Aufräumen & Archivierung

Um die Testumgebung sauber zu halten, können folgende Befehle genutzt werden:
*   **Daten löschen:** `npm run report:clean` (löscht alle bisherigen Testergebnisse und Berichte).
*   **Archivieren:** `npm run report:archive` (speichert den aktuellen Bericht mit Zeitstempel im Ordner `reporting/archive/`).

---

## 🔒 Sicherheit & Secrets (Best Practice)

Im echten Projekt-Alltag dürfen Passwörter niemals im Git-Code landen. Für dieses Übungs-Repo nutzen wir einen hybriden Ansatz:

1.  **Öffentliche Test-Daten:** Die Zugangsdaten `consultant / pwd` sind für diese App öffentlich bekannt und in den `.env`-Dateien hinterlegt, damit du sofort starten kannst.
2.  **Private Secrets (`.env.local`):** Erstelle diese Datei für deine eigenen Passwörter. Sie wird von Git ignoriert und überschreibt die Standardwerte auf deinem Rechner.
3.  **Zentrale Pipeline-Secrets (Best Practice):** 
    Für die CI (GitHub Actions) werden Passwörter über **GitHub Secrets** verwaltet. 
    *   **Organization Secrets (Global):** Wir empfehlen, `TEST_USER_NAME` und `TEST_USER_PASSWORD` auf Organisationsebene (bqnow) zu hinterlegen. So haben alle Repositories automatisch die richtigen Logins, ohne dass du sie überall einzeln pflegen musst.

---

## 📸 Visual Regression Testing

Neben den funktionalen Tests bietet das Framework auch **Screenshot-Vergleiche**, um unbeabsichtigte UI-Änderungen zu erkennen.

### Was wird getestet?
*   **Layout-Stabilität:** Sind Buttons, Formulare und Navigation an der richtigen Stelle?
*   **Cross-Browser Konsistenz:** Sieht die App in Chrome, Firefox und Safari identisch aus?
*   **Responsive Design:** Funktioniert das Layout auf verschiedenen Bildschirmgrößen?

### Workflow

**1. Baselines erstellen (beim ersten Mal):**
```bash
npm run app:up
npm run test:visual:update
```
Dies erstellt die "Golden Master" Screenshots im Ordner `e2e/visual.spec.ts-snapshots/`.

**2. Visual Tests ausführen:**
```bash
npm run test:visual
```
Playwright vergleicht die aktuelle UI mit den Baselines. Bei Abweichungen schlägt der Test fehl.

**3. Änderungen akzeptieren (nach bewussten UI-Updates):**
```bash
npm run test:visual:update
```
Dies aktualisiert die Baselines mit den neuen Screenshots.

### Intelligente Features
*   **Dynamische Elemente maskieren:** Preise, Zeitstempel und andere variable Inhalte werden ausgeblendet.
*   **Toleranz-Schwelle:** Kleine Rendering-Unterschiede (z.B. Schriftglättung) werden ignoriert (`threshold: 0.2`, `maxDiffPixels: 100`).
*   **Responsive Tests:** Separate Baselines für Desktop, Tablet und Mobile.

### Best Practice
*   Führe Visual Tests vor jedem Release aus (`npm run test:visual`).
*   Bei fehlgeschlagenen Tests: Prüfe die Diff-Bilder in `test-results/` und entscheide, ob die Änderung gewollt war.
*   Committe die Baseline-Screenshots (`*.png` in `e2e/visual.spec.ts-snapshots/`) ins Git, damit das Team dieselben Vergleichsbilder hat.

---

## 🤖 CI/CD Integration

Dieses Framework ist für die automatisierte Ausführung vorbereitet:
*   **GitHub Actions:** Bei jedem `push` auf den `main` Branch wird automatisch der `test:docker` Workflow auf GitHub ausgeführt.
*   **Artifacts:** Nach dem Lauf werden die Berichte (Screenshots & Allure-Results) als GitHub-Artifacts hochgeladen und können dort heruntergeladen werden.

📘 **Die detaillierte Architektur-Beschreibung findest du hier: [WORKFLOW_STRATEGY.md](./WORKFLOW_STRATEGY.md)**

---

## 🎯 Takeaways

Dieses Template ist nicht nur ein Setup, sondern ein **Lern-Werkzeug**. Es demonstriert:

1.  **Smoke Testing** (REQ-001)
    *   Schnellster Check der Basis-Funktionalität.
    *   Ideal für tägliche Runs (Daily Smoke).

2.  **E2E Testing** (REQ-002)
    *   Kompletter User Journey in EINEM Test.
    *   Realistische Szenarien statt isolierte Mikro-Tests.

3.  **Data-Driven Testing** (REQ-003)
    *   Mehrere Varianten (Validierung) mit einem Test-Template.
    *   Effizient durch Schleifen (`forEach`).

4.  **Edge Case Testing** (REQ-004)
    *   Negative Scenarios & Resilience.
    *   Wie geht die App mit Fehlern um?

5.  **Visual Regression** (REQ-005)
    *   Screenshot-basierte UI-Tests.
    *   Automatische Erkennung von Design-Brüchen.

6.  **State Injection & Performance** (REQ-006)
    *   **Pro-Tipp:** `api-optimization-showcase.spec.ts`
    *   Zeigt, wie man Tests massiv beschleunigt (60% schneller), indem man die UI umgeht und Daten direkt setzt.

---

## ❓ Troubleshooting (Was tun, wenn...?)

*   **"Connection Refused" bei `npm run test:e2e`**: Prüfe, ob der Webshop läuft. Wenn du lokal testest, musst du vorher `npm run app:up` ausgeführt haben.
*   **Fehler in Docker**: Manchmal hilft ein sauberer Neustart: `docker compose down` und dann den Befehl erneut ausführen.
*   **Report öffnet sich nicht**: Stelle sicher, dass Java installiert ist, da Allure dieses zur Generierung der statischen Seiten benötigt.
*   **WebKit schlägt lokal fehl**: WebKit (Safari) ist im Docker-Modus standardmäßig deaktiviert (`SKIP_WEBKIT=true`), um Grafik-Fehler unter Linux zu vermeiden. Nutze für Safari-Tests den `check:release` (Cloud-Modus).
