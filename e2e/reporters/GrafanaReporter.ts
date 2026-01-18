
import { Reporter, FullConfig, Suite, TestCase, TestResult, FullResult } from '@playwright/test/reporter';

interface TestDetails {
    title: string;
    browser: string;
    status: string;
    duration: number;
    error?: string;
    timestamp: number;
}

/**
 * Grafana Per-Test Reporter
 * 
 * Sends detailed metrics for each individual test to Grafana Loki.
 * Enables granular dashboards showing:
 * - Per-test pass/fail rates
 * - Slowest tests
 * - Flaky tests
 * - Browser-specific failures
 */
class GrafanaReporter implements Reporter {
    private tests: TestDetails[] = [];

    onBegin(config: FullConfig, suite: Suite) {
        console.log(`\n[GrafanaReporter] 🚀 Starting test run with ${suite.allTests().length} tests`);
    }

    onTestEnd(test: TestCase, result: TestResult) {
        // Browser aus Projektnamen extrahieren (z.B. "chromium", "firefox", "webkit")
        const browser = test.parent.project()?.name || 'unknown';

        // Ganzen Namen erstellen (Describe Block > Test Name) für bessere Sichtbarkeit in Grafana
        const titlePath = test.titlePath();
        // Root [0], Projekt [1] und Dateipfad [2] überspringen -> "Describe Block › Test Name"
        const fullTitle = titlePath.slice(3).join(' › ') || test.title;

        // Fehlermeldung erfassen (falls vorhanden)
        const errorMessage = result.error
            ? (result.error.message || result.error.stack || 'Unknown error')
            : undefined;

        // Testdetails sammeln
        const testDetail: TestDetails = {
            title: fullTitle,
            browser: browser,
            status: result.status, // 'passed', 'failed', 'skipped', 'timedout'
            duration: result.duration,
            error: errorMessage,
            timestamp: Date.now()
        };

        this.tests.push(testDetail);
    }

    async onEnd(result: FullResult) {
        console.log(`\n[GrafanaReporter] 🏁 Testlauf beendet mit Status: ${result.status}`);
        console.log(`[GrafanaReporter] 📊 ${this.tests.length} Testergebnisse gesammelt`);

        // App-Namen bestimmen (Priorität: Env Variable > NPM Package Name > Standardwert)
        const appName = process.env.GRAFANA_APP_NAME || 'testshop-ts';
        const environment = process.env.TEST_ENV || 'local';

        // WICHTIG: Einen einzigen Zeitstempel für den ganzen Batch nutzen!
        // Das verhindert "Entry out of order" Fehler bei Loki zuverlässig.
        const timestampNs = Date.now().toString() + '000000';

        // Zusammenfassende Statistiken
        const summary = {
            total: this.tests.length,
            passed: this.tests.filter(t => t.status === 'passed').length,
            failed: this.tests.filter(t => t.status === 'failed' || t.status === 'timedout').length,
            skipped: this.tests.filter(t => t.status === 'skipped').length,
            duration: result.duration
        };

        const lokiPayload = {
            streams: [
                // 1. Individuelle Testergebnisse
                ...this.tests.map(test => ({
                    stream: {
                        app: appName,
                        environment: environment,
                        kind: 'test_result',
                        test_name: test.title,
                        browser: test.browser,
                        status: test.status
                    },
                    values: [
                        [
                            timestampNs, // Batch Timestamp
                            JSON.stringify({
                                event: 'test_completed',
                                test_name: test.title,
                                browser: test.browser,
                                status: test.status,
                                duration_ms: test.duration,
                                error: test.error || null,
                                user: process.env.USER || 'ci-runner'
                            })
                        ]
                    ]
                })),
                // 2. Lauf-Zusammenfassung
                {
                    stream: {
                        app: appName,
                        environment: environment,
                        kind: 'test_summary'
                    },
                    values: [
                        [
                            timestampNs, // Batch Timestamp
                            JSON.stringify({
                                event: 'run_completed',
                                ...summary
                            })
                        ]
                    ]
                }
            ]
        };

        // Showcase Output (only show first 3 tests to avoid spam)
        console.log('\n----------------------------------------');
        console.log('📊 GRAFANA PER-TEST METRICS');
        console.log('----------------------------------------');
        console.log(`Sending ${this.tests.length} individual test results to Grafana Loki`);
        console.log('\nSample (first 3 tests):');
        this.tests.slice(0, 3).forEach((test, i) => {
            console.log(`  ${i + 1}. ${test.title} [${test.browser}]: ${test.status} (${test.duration}ms)`);
        });
        console.log('----------------------------------------\n');

        // Send to Grafana
        if (process.env.GRAFANA_LOKI_URL && process.env.GRAFANA_LOKI_USER && process.env.GRAFANA_LOKI_KEY) {
            try {
                console.log(`📡 Sending ${this.tests.length} test metrics to Grafana Loki...`);
                const auth = Buffer.from(process.env.GRAFANA_LOKI_USER + ':' + process.env.GRAFANA_LOKI_KEY).toString('base64');

                const response = await fetch(process.env.GRAFANA_LOKI_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Basic ' + auth
                    },
                    body: JSON.stringify(lokiPayload)
                });

                if (response.ok) {
                    console.log(`✅ Successfully sent ${this.tests.length} test results to Grafana!`);
                } else {
                    const errorBody = await response.text();
                    console.error(`❌ Grafana API Error (${response.status}):`, errorBody);
                }
            } catch (error) {
                console.error('❌ Failed to send metrics to Grafana:', error);
            }
        } else {
            console.warn('⚠️ Grafana env vars missing. Skipping upload.');
        }
    }
}

export default GrafanaReporter;
