import "./style.css";
import singleSpaHtml from "single-spa-html";
import { cssLifecycleFactory } from "vite-plugin-single-spa/ex";
import { init } from "./main.js";

const template = `
<div class="dashboard">
    <header class="dashboard__header">
        <h1 class="dashboard__title">📊 Bundler Benchmarks</h1>
        <p class="dashboard__subtitle">
            Comparing Vite, Rspack & Webpack performance on <span class="dashboard__subtitle-highlight">Roots configs</span>
        </p>
    </header>

    <main class="dashboard__main">
        <section class="dashboard__stats-grid">
            <div class="dashboard__stat-card dashboard__stat-card--vite">
                <div class="dashboard__stat-icon">⚡</div>
                <h3 class="dashboard__stat-name">Vite</h3>
                <div class="dashboard__stat-value" id="vite-build-time">--</div>
                <div class="dashboard__stat-label">Build Time</div>
            </div>
            <div class="dashboard__stat-card dashboard__stat-card--rspack">
                <div class="dashboard__stat-icon">📦</div>
                <h3 class="dashboard__stat-name">Rspack</h3>
                <div class="dashboard__stat-value" id="rspack-build-time">--</div>
                <div class="dashboard__stat-label">Build Time</div>
            </div>
            <div class="dashboard__stat-card dashboard__stat-card--webpack">
                <div class="dashboard__stat-icon">🔧</div>
                <h3 class="dashboard__stat-name">Webpack</h3>
                <div class="dashboard__stat-value" id="webpack-build-time">--</div>
                <div class="dashboard__stat-label">Build Time</div>
            </div>
        </section>

        <section class="dashboard__charts-grid">
            <div class="dashboard__chart-card">
                <h2 class="dashboard__chart-title">Build Time Comparison</h2>
                <div class="dashboard__chart-wrapper">
                    <canvas id="buildChart"></canvas>
                </div>
            </div>

            <div class="dashboard__chart-card">
                <h2 class="dashboard__chart-title">Dev Server Startup</h2>
                <div class="dashboard__chart-wrapper">
                    <canvas id="devChart"></canvas>
                </div>
            </div>
        </section>

        <section class="dashboard__charts-grid">
            <div class="dashboard__chart-card dashboard__chart-card--full-width">
                <h2 class="dashboard__chart-title">Build Time Distribution</h2>
                <div class="dashboard__chart-wrapper">
                    <canvas id="distributionChart"></canvas>
                </div>
            </div>
        </section>

        <section class="dashboard__summary">
            <h2 class="dashboard__summary-title">Summary</h2>
            <div class="dashboard__summary-content" id="summary-content">Loading benchmark data...</div>
        </section>
    </main>

    <footer class="dashboard__footer">
        <p class="dashboard__footer-text">Generated from hyperfine benchmark results</p>
    </footer>
</div>
`;

const htmlLifecycles = singleSpaHtml({
    template,
});

const cssLifecycle = cssLifecycleFactory("Razmio-dashboard");

export const { bootstrap, mount, unmount } = {
    bootstrap: [cssLifecycle.bootstrap, htmlLifecycles.bootstrap],
    mount: [cssLifecycle.mount, htmlLifecycles.mount, init],
    unmount: [cssLifecycle.unmount, htmlLifecycles.unmount],
};
