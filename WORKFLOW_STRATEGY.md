# 🏗️ Architektur & CI/CD Workflow Strategie

## 1. Architektur-Konzept: "Separate Test Repository"
Dieses Projekt folgt streng dem **"Decoupled Architecture"** Ansatz (Entkoppelte Architektur). Der Applikationscode und der Test-Automatisierungscode liegen in zwei vollständig getrennten Repositories. Dies spiegelt ein professionelles Umfeld wider, in dem QA/SDET-Teams oft unabhängig von Feature-Entwicklern arbeiten.

*   **Zielsystem (Die App):** `bqnow-testapp`
*   **Testsystem (Die Tests):** `testshop-playwright-template`

### Die Kopplung: Docker
Das verbindende Glied zwischen diesen beiden Welten ist **Docker**.
*   Der einzige Output des App-Repos ist ein **Docker Image** (`ghcr.io/bqnow/testshop`).
*   Das Test-Repo sieht *niemals* den Quellcode der App. Es konsumiert lediglich dieses kompilierte Docker Image.

---

## 2. CI/CD Pipeline Ablauf (Der "Twin-Repo" Link)

Wir haben eine automatisierte Verbindung zwischen den beiden Repositories eingerichtet, um kontinuierliche Qualitätssicherung zu gewährleisten.

### Phase 1: Artefakt & Trigger (Shop Repo)
**Auslöser:** Push auf `main` in `bqnow-testapp`.

1.  **Build:** GitHub Actions baut die Next.js App und verpackt sie in einen leichtgewichtigen Docker Container.
2.  **Publish:** Das Image wird in die GitHub Container Registry (GHCR) geladen (Tag: `:latest`).
3.  **Dispatch:** Ein `repository_dispatch` Event (`app-update`) wird an das Test-Repo gesendet, mit der Info `{"image_tag": "latest"}`.

### Phase 2: Verifizierung (Test Repo)
**Auslöser:** Empfang von `repository_dispatch` ODER lokaler Push auf `main`.

1.  **Setup:** Der Workflow startet eine Docker Compose Umgebung.
2.  **Pull:** Er zieht exakt die Image-Version, die im Event gemeldet wurde (oder `latest`).
3.  **Test:** Playwright Tests laufen gegen diese kurzlebige Container-Instanz.
4.  **Report:** Ergebnisse werden generiert (Allure/HTML) und als Artefakt gespeichert.

---

## 3. Daten- & Effizienz-Strategie

Diese Architektur ermöglicht unterschiedliche Test-Geschwindigkeiten je nach Kontext:

| Kontext | Wann / Wo? | Genutzte Architektur | Geschwindigkeit |
| :--- | :--- | :--- | :--- |
| **Hot Development** | Localhost | App (Node.js) + Tests (Node.js) laufen parallel in Terminals. | ⚡️ **Am schnellsten** (Kein Docker Build) |
| **Pre-Push Check** | Localhost | App läuft im lokalen Docker Container (isoliert). | 🐢 **Pro** (Verifiziert den Container) |
| **CI / Regression** | GitHub Actions | Vollautomatische Pipeline via GHCR. | 🛡️ **Stabil** (Saubere Umgebung) |

---

## 4. Visuelles Architektur-Diagramm

```mermaid
graph TD
    subgraph "Entwickler Umgebung"
        Dev[Entwickler]
        LocalApp[Lokale App (localhost:3000)]
        LocalTest[Lokales Playwright]
        Dev -->|Code Änderung| LocalApp
        Dev -->|Tests starten| LocalTest
        LocalTest -.->|Testet via HTTP| LocalApp
    end

    subgraph "CI/CD Pipeline: Shop Repo"
        Push[Push auf Main]
        Build[Docker Image Bauen]
        PushGHCR[Push zu GHCR]
        Trigger[Trigger 'app-update']
        
        Dev -->|git push| Push
        Push --> Build
        Build --> PushGHCR
        PushGHCR --> Trigger
    end

    subgraph "Artefakt Speicher"
        GHCR[(GitHub Container Registry)]
        PushGHCR -.->|Speichert Image| GHCR
    end

    subgraph "CI/CD Pipeline: Test Repo"
        Listen[Empfange Dispatch]
        Pull[Docker Compose Up]
        RunTest[Playwright Tests]
        
        Trigger -.->|Event Senden| Listen
        Listen --> Pull
        GHCR -.->|Pull :latest| Pull
        Pull --> RunTest
    end
    
    style Dev fill:#f9f,stroke:#333
    style GHCR fill:#58a6ff,stroke:#333,color:#fff
```
