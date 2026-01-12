# 🚀 Push & Test Strategie: Separate Test Repository Strategy (Target & Template)

Dieses Dokument beschreibt die Prozesse für dieses **entkoppelte Setup** ("Separate Test Repository"), unterteilt in zwei Zielgruppen:

1.  **Maintainer (Wir):** Die dieses Template und die Shop-App pflegen.
2.  **Consultants (Teilnehmer):** Die eigene Test-Repos aufbauen sollen.

---

## A. Maintainer Workflow (Interne Qualitätssicherung)
Wie stellen wir sicher, dass App und Template harmonieren?

### 1. Lokale Entwicklung (Der "Hot Loop")
*Ziel: Schnelles Feedback für uns als Entwickler der Plattform.*

*   **Terminal 1 (Applikation):** `cd ../bqnow-testapp && npm run dev`
*   **Terminal 2 (Tests):** `npm run play` (gegen localhost)

### 2. Pre-Push Check (Validierung)
*   **Änderung am Shop?** -> Muss `npm run play` im Template bestehen. Pushed nach `latest`.
*   **Änderung am Template?** -> Muss gegen `ghcr.io/bqnow/testshop:latest` bestehen.

### 3. CI/CD Pipeline & Versionierung
Damit Consultants eine stabile Basis haben, nutzen wir **Semantic Versioning** im Shop-Repo.
*   `main` Branch updates -> `ghcr.io/bqnow/testshop:latest` (Unstable/Bleeding Edge)
*   Git Tag `v1.0.1` -> `ghcr.io/bqnow/testshop:1.0.1` (Stabil für Schulungen)

**WICHTIG:** Schulungsunterlagen sollten immer auf eine feste Version (z.B. `v1.x`) referenzieren, nicht auf `latest`, damit Workshops nicht durch Updates kaputt gehen.

---

## B. Consultant Workflow (Das Schulungs-Ziel)
Wie arbeiten die Teilnehmer?

Das Ziel ist, dass Consultants verstehen, wie man eine **eigene** Test-Pipeline baut. Dieses Repository dient dabei als "Golden Master" oder Lösungsvorschlag.

### Das Szenario für Consultants:
1.  **Setup:** Sie erstellen ein *leeres* Repo (oder nutzen `npm init playwright`).
2.  **Target:** Sie binden den Shop als Docker Container ein (`docker-compose.yml` referenziert `ghcr.io/bqnow/testshop:stable`).
3.  **Lernen:**
    *   Sie schreiben Tests gegen den Container.
    *   Sie bauen ihre eigene GitHub Actions Pipeline.
    *   Sie lernen, wie man Testdaten-Management betreibt.

### Unsere Aufgabe dabei:
Wir nutzen dieses Template-Repo, um zu beweisen, dass der Shop ("System under Test") testbar ist. Wenn unsere Tests hier grün sind, wissen wir: **"Das Problem liegt beim Schüler, nicht an der App."** 😉
