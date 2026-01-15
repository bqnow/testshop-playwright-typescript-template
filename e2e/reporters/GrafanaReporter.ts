
import { Reporter, FullConfig, Suite, TestCase, TestResult, FullResult } from '@playwright/test/reporter';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Grafana Showcase Reporter
 * 
 * Demonstration einer Integration von Playwright Tests in Grafana.
 * Zeigt, wie Test-Metriken (Dauer, Status, Fehlschläge) gesammelt 
 * und an einen Collector (z.B. Loki oder Prometheus Pushgateway) gesendet würden.
 */
class GrafanaReporter implements Reporter {

    onBegin(config: FullConfig, suite: Suite) {
        console.log(`\n[GrafanaReporter] 🚀 Starting test run with ${suite.allTests().length} tests`);
    }

    onTestEnd(test: TestCase, result: TestResult) {
        // Hier könnten wir individuelle Test-Metriken senden (Streaming)
        // console.log(`[GrafanaReporter] Finished test ${test.title}: ${result.status}`);
    }

    async onEnd(result: FullResult) {
        console.log(`\n[GrafanaReporter] 🏁 Test run finished with status: ${result.status}`);

        // 1. Metriken sammeln
        const stats = {
            status: result.status, // 'passed', 'failed', 'timedout', 'interrupted'
            startTime: result.startTime,
            duration: result.duration,
            timestamp: new Date().toISOString(),
            metrics: {
                total: 0,
                passed: 0,
                failed: 0,
                skipped: 0,
            }
        };

        // Rekursive Funktion um Ergebnisse zu zählen (da 'result' hier nur High-Level ist, müssten wir eigentlich 'suite' traversieren)
        // Vereinfachung für Showcase: Wir nutzen die High-Level Result Summen, wenn verfügbar, oder fake logging.
        // Echte Lösung: Wir würden 'suite' aus onBegin speichern und hier traversieren.

        // Simulierter Payload für Grafana Loki (Logs)
        const lokiPayload = {
            streams: [
                {
                    stream: {
                        app: 'testshop-e2e',
                        environment: process.env.TEST_ENV || 'local',
                        kind: 'test_report'
                    },
                    values: [
                        [
                            String(Date.now() * 1000000), // Nanoseconds timestamp
                            JSON.stringify({
                                event: 'test_run_completed',
                                status: result.status,
                                duration_ms: result.duration,
                                user: process.env.USER || 'ci-runner'
                            })
                        ]
                    ]
                }
            ]
        };

        // Simulierter Payload für InfluxDB / Prometheus (Metrics)
        const metricsPayload = `test_run_duration,env=${process.env.TEST_ENV || 'local'},status=${result.status} value=${result.duration}`;

        // Showcase Output
        console.log('\n----------------------------------------');
        console.log('📊 GRAFANA INTEGRATION SHOWCASE');
        console.log('----------------------------------------');
        console.log('Wenn eine Grafana URL konfiguriert wäre, würden wir folgenden Request senden:');
        console.log('\n➡️  Target: POST https://logs-prod-eu-west-0.grafana.net/loki/api/v1/push');
        console.log('📦 Payload (Loki JSON):');
        console.log(JSON.stringify(lokiPayload, null, 2));
        console.log('\n----------------------------------------\n');
        console.log('\n🔍 DEBUG: Environment Variables Check:');
        console.log(`- GRAFANA_LOKI_URL: ${process.env.GRAFANA_LOKI_URL ? '✅ Defined' : '❌ MISSING'}`);
        console.log(`- GRAFANA_LOKI_USER: ${process.env.GRAFANA_LOKI_USER ? '✅ Defined' : '❌ MISSING'}`);
        console.log(`- GRAFANA_LOKI_KEY: ${process.env.GRAFANA_LOKI_KEY ? '✅ Defined' : '❌ MISSING'}`);

        // Echter Fetch Code (aktiviert):
        if (process.env.GRAFANA_LOKI_URL && process.env.GRAFANA_LOKI_USER && process.env.GRAFANA_LOKI_KEY) {
            try {
                console.log('📡 Sending metrics to Grafana Loki...');
                const auth = Buffer.from(process.env.GRAFANA_LOKI_USER + ':' + process.env.GRAFANA_LOKI_KEY).toString('base64');

                const response = await fetch(process.env.GRAFANA_LOKI_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Basic ' + auth
                    },
                    body: JSON.stringify(lokiPayload)
                });

                console.log(`📡 Response Status: ${response.status} ${response.statusText}`);
                console.log(`URL: ${process.env.GRAFANA_LOKI_URL}`);
                console.log(`User: ${process.env.GRAFANA_LOKI_USER}`);
                console.log(`Key: ${process.env.GRAFANA_LOKI_KEY}`);

                if (response.ok) {
                    console.log('✅ Metrics sent successfully!');
                } else {
                    const errorBody = await response.text();
                    console.error(`❌ Grafana API Error(${response.status}): `, errorBody);
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
