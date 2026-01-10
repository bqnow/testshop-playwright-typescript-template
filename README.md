# Playwright E2E Framework Template 🎭

Professional End-to-End Test Suite für die TestShop Applikation. Dieses Repository implementiert eine skalierbare Test-Architektur basierend auf dem Page Object Model (POM) und Allure Reporting.

---

## 🛠️ System-Voraussetzungen

Stellen Sie sicher, dass folgende Komponenten installiert sind:
*   **Runtime:** [Node.js](https://nodejs.org/) (v18+ LTS empfohlen)
*   **Version Control:** [Git](https://git-scm.com/)
*   **IDE:** Google Antigravity oder Visual Studio Code
*   **Optional:** [Docker Desktop](https://www.docker.com/) (für isolierte Testläufe)

---

## 🚀 Setup & Installation

1.  **Dependencies installieren:**
    ```bash
    npm install
    ```
2.  **Playwright Browser Engines bereitstellen:**
    ```bash
    npx playwright install --with-deps
    ```

---

## 🏃 Test-Ausführung

Das Framework ist vorkonfiguriert für das Testing gegen die Production-Umgebung:  
👉 `https://testshop-dusky.vercel.app`

### Execution Modes
*   **Headless (Default/CI):** `npm run test:e2e`
*   **Headed (Visual Debugging):** `HEADLESS=false npm run test:e2e`
*   **Full Cycle:** `npm run test:full-cycle` (Execute -> Generate Allure -> Open Dashboard)

### Environment Management (BASE_URL)
Das Ziel-System kann dynamisch über Umgebungsvariablen gesteuert werden:
```bash
# Testen gegen lokale Instanz
BASE_URL=http://localhost:3000 npm run test:e2e

# Testen gegen QA-Instanz
BASE_URL=https://qa.testshop.com npm run test:e2e
```
*Vordefinierte Profile (QA/Staging/Prod) können via `TEST_ENV` Variable genutzt werden (z.B. `npm run test:qa`).*

---

## 📊 Reporting & Analyse

Nach Testabschluss stehen folgende Reporting-Tools in `/reporting` zur Verfügung:

1.  **Allure Report:** Erweitertes Dashboard mit Trend-Analysen (`npm run report:open`).
2.  **Playwright HTML Report:** Technisches Reporting mit Videos, Screenshots und Traces (in `reporting/playwright/index.html`).

---

## 🏗️ Framework Architektur

Die Suite folgt professionellen Standards für Wartbarkeit und Stabilität:
*   **Page Object Model (POM):** Kapselung von Selektoren und Page-Logik in Klassen (`pages/`).
*   **Fixtures:** Automatisierte Instanziierung von Page Objects in Tests (`fixtures/base-test.ts`).
*   **Data-Driven Testing:** Nutzung von `@faker-js/faker` für realistische, dynamische Testdaten.
*   **Docker Integration:** Vollständige CI/CD-Kongruenz durch containerisierte Ausführung (`docker compose up --build`).
