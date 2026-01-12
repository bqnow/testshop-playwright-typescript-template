import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';

/**
 * Umgebungs-Konfiguration:
 * Wir laden Variablen aus .env Dateien nach dem "Prioritäts-Prinzip".
 * Sobald eine Variable gesetzt ist (durch CLI oder eine frühere Datei), wird sie nicht überschrieben.
 * Priorität: 1. CLI/Environment, 2. .env.local, 3. .env.{stage}, 4. .env
 */
const configDir = path.resolve(__dirname, 'config');

// 1. Lokale Overrides gewinnen (z.B. für eigene Secrets)
dotenv.config({ path: path.resolve(configDir, '.env.local') });

// 2. Lade Umgebungsspezifische Datei (z.B. .env.staging)
if (process.env.TEST_ENV) {
    dotenv.config({ path: path.resolve(configDir, `.env.${process.env.TEST_ENV}`) });
}

// 3. Lade Standardwerte als Fallback
dotenv.config({ path: path.resolve(configDir, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
    testDir: './e2e',
    outputDir: './reporting/test-results',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 2 : undefined,
    reporter: [
        ['html', { outputFolder: 'reporting/playwright', title: 'TestShop E2E Test Results', open: 'never' }],
        ['allure-playwright', {
            detail: true,
            resultsDir: 'reporting/allure-results',
            suiteTitle: false
        }]
    ],
    use: {
        /* 
         * Wichtig: process.env.BASE_URL hat Vorrang vor .env Dateien. 
         * Dies erlaubt dynamische Vercel Preview URLs in der CI.
         */
        baseURL: process.env.BASE_URL || 'http://localhost:3000',
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        video: 'on-first-retry',
        headless: process.env.HEADLESS === 'false' ? false : true,
        ignoreHTTPSErrors: true, // Crucial for Docker-internal networking
    },

    // Visuelle Regressions-Tests Konfiguration
    expect: {
        toHaveScreenshot: {
            maxDiffPixels: 100,         // Erlaube minimale Abweichungen (Rendering)
            threshold: 0.2,             // 20% Toleranz für Pixel-Unterschiede
            animations: 'disabled',     // Deaktiviere Animationen für stabile Screenshots
        },
    },

    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
        {
            name: 'firefox',
            use: {
                ...devices['Desktop Firefox'],
                launchOptions: {
                    firefoxUserPrefs: {
                        // Deaktiviert den HTTPS-Zwang, um SSL_ERROR_UNKNOWN in Docker-Netzwerken zu vermeiden
                        'dom.security.https_only_mode': false,
                        // Verhindert DNS-Fehler in Docker-Containern ohne IPv6-Unterstützung
                        'network.dns.disableIPv6': true,
                    },
                },
            },
        },
        ...(process.env.SKIP_WEBKIT ? [] : [
            {
                name: 'webkit',
                use: { ...devices['Desktop Safari'] },
            },
        ]),
        /* 
         * BrowserStack Multi-Browser Grid
         */
        ...(process.env.BROWSERSTACK_USERNAME ? [
            { browser: 'chrome', os: 'Windows', os_version: '11', name: 'bs_windows_chrome' },
            { browser: 'edge', os: 'Windows', os_version: '11', name: 'bs_windows_edge' },
            { browser: 'safari', os: 'OS X', os_version: 'Sonoma', name: 'bs_mac_safari' },
        ].map(caps => ({
            name: caps.name,
            use: {
                connectOptions: {
                    wsEndpoint: `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(JSON.stringify({
                        'browser': caps.browser,
                        'browser_version': 'latest',
                        'os': caps.os,
                        'os_version': caps.os_version,
                        'browserstack.user': process.env.BROWSERSTACK_USERNAME,
                        'browserstack.key': process.env.BROWSERSTACK_ACCESS_KEY,
                        'name': `TestShop - ${caps.name}`
                    }))}`
                },
            },
        })) : []),
    ],
});
