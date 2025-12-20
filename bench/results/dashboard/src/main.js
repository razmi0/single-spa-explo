import "./style.css";
import Chart from "chart.js/auto";

// Import benchmark results using named exports from consolidated JSON
import { viteBuild, rspackBuild, webpackBuild, viteDev, rspackDev, webpackDev } from "@results/benchmarks.json";

// Bundler colors
const colors = {
    vite: {
        bg: "rgba(100, 108, 255, 0.8)",
        border: "#646cff",
        light: "rgba(100, 108, 255, 0.2)",
    },
    rspack: {
        bg: "rgba(255, 107, 53, 0.8)",
        border: "#ff6b35",
        light: "rgba(255, 107, 53, 0.2)",
    },
    webpack: {
        bg: "rgba(141, 214, 249, 0.8)",
        border: "#8dd6f9",
        light: "rgba(141, 214, 249, 0.2)",
    },
};

// Chart.js global config
Chart.defaults.color = "#8b949e";
Chart.defaults.borderColor = "#30363d";
Chart.defaults.font.family = "'Outfit', sans-serif";

// Load benchmark data from imported named exports
function loadBenchmarkData() {
    return {
        viteBuild,
        rspackBuild,
        webpackBuild,
        viteDev,
        rspackDev,
        webpackDev,
    };
}

// Format time in seconds
function formatTime(seconds) {
    if (seconds < 1) {
        return `${(seconds * 1000).toFixed(0)}ms`;
    }
    return `${seconds.toFixed(2)}s`;
}

// Update stat cards
function updateStatCards(data) {
    if (data.viteBuild) {
        document.getElementById("vite-build-time").textContent = formatTime(data.viteBuild.mean);
    }
    if (data.rspackBuild) {
        document.getElementById("rspack-build-time").textContent = formatTime(data.rspackBuild.mean);
    }
    if (data.webpackBuild) {
        document.getElementById("webpack-build-time").textContent = formatTime(data.webpackBuild.mean);
    }
}

// Create build time bar chart
function createBuildChart(data) {
    const ctx = document.getElementById("buildChart");
    if (!ctx) return;

    const buildData = {
        labels: ["Vite", "Rspack", "Webpack"],
        datasets: [
            {
                label: "Mean Build Time (seconds)",
                data: [data.viteBuild?.mean || 0, data.rspackBuild?.mean || 0, data.webpackBuild?.mean || 0],
                backgroundColor: [colors.vite.bg, colors.rspack.bg, colors.webpack.bg],
                borderColor: [colors.vite.border, colors.rspack.border, colors.webpack.border],
                borderWidth: 2,
                borderRadius: 8,
            },
        ],
    };

    new Chart(ctx, {
        type: "bar",
        data: buildData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: (context) => `${formatTime(context.raw)}`,
                    },
                },
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: "#21262d" },
                    ticks: {
                        callback: (value) => formatTime(value),
                    },
                },
                x: {
                    grid: { display: false },
                },
            },
        },
    });
}

// Create dev server startup chart
function createDevChart(data) {
    const ctx = document.getElementById("devChart");
    if (!ctx) return;

    const devData = {
        labels: ["Vite", "Rspack", "Webpack"],
        datasets: [
            {
                label: "Dev Server Startup (seconds)",
                data: [data.viteDev?.mean || 0, data.rspackDev?.mean || 0, data.webpackDev?.mean || 0],
                backgroundColor: [colors.vite.bg, colors.rspack.bg, colors.webpack.bg],
                borderColor: [colors.vite.border, colors.rspack.border, colors.webpack.border],
                borderWidth: 2,
                borderRadius: 8,
            },
        ],
    };

    new Chart(ctx, {
        type: "bar",
        data: devData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: (context) => `${formatTime(context.raw)}`,
                    },
                },
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: "#21262d" },
                    ticks: {
                        callback: (value) => formatTime(value),
                    },
                },
                x: {
                    grid: { display: false },
                },
            },
        },
    });
}

// Create distribution chart (box plot style using line)
function createDistributionChart(data) {
    const ctx = document.getElementById("distributionChart");
    if (!ctx) return;

    const labels = ["Run 1", "Run 2", "Run 3", "Run 4", "Run 5"];

    const datasets = [];

    if (data.viteBuild?.times) {
        datasets.push({
            label: "Vite",
            data: data.viteBuild.times,
            borderColor: colors.vite.border,
            backgroundColor: colors.vite.light,
            fill: true,
            tension: 0.4,
            pointRadius: 6,
            pointHoverRadius: 8,
        });
    }

    if (data.rspackBuild?.times) {
        datasets.push({
            label: "Rspack",
            data: data.rspackBuild.times,
            borderColor: colors.rspack.border,
            backgroundColor: colors.rspack.light,
            fill: true,
            tension: 0.4,
            pointRadius: 6,
            pointHoverRadius: 8,
        });
    }

    if (data.webpackBuild?.times) {
        datasets.push({
            label: "Webpack",
            data: data.webpackBuild.times,
            borderColor: colors.webpack.border,
            backgroundColor: colors.webpack.light,
            fill: true,
            tension: 0.4,
            pointRadius: 6,
            pointHoverRadius: 8,
        });
    }

    new Chart(ctx, {
        type: "line",
        data: { labels, datasets },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: "index",
                intersect: false,
            },
            plugins: {
                legend: {
                    position: "top",
                    labels: {
                        usePointStyle: true,
                        padding: 20,
                    },
                },
                tooltip: {
                    callbacks: {
                        label: (context) => `${context.dataset.label}: ${formatTime(context.raw)}`,
                    },
                },
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: "#21262d" },
                    ticks: {
                        callback: (value) => formatTime(value),
                    },
                },
                x: {
                    grid: { display: false },
                },
            },
        },
    });
}

// Generate summary
function generateSummary(data) {
    const summaryEl = document.getElementById("summary-content");
    if (!summaryEl) return;

    const viteBuild = data.viteBuild?.mean || 0;
    const rspackBuild = data.rspackBuild?.mean || 0;
    const webpackBuild = data.webpackBuild?.mean || 0;

    // Find fastest
    const builds = [
        { name: "Vite", time: viteBuild },
        { name: "Rspack", time: rspackBuild },
        { name: "Webpack", time: webpackBuild },
    ].sort((a, b) => a.time - b.time);

    const fastest = builds[0];
    const slowest = builds[2];
    const speedup = (slowest.time / fastest.time - 1) * 100;

    summaryEl.innerHTML = `
    <p>🏆 <span class="highlight">${
        fastest.name
    }</span> is the fastest bundler with a build time of <span class="highlight">${formatTime(fastest.time)}</span></p>
    <p>📈 ${fastest.name} is <span class="highlight">${speedup.toFixed(0)}% faster</span> than ${slowest.name}</p>
    
    <div class="comparison">
      <div class="comparison-row">
        <span>Vite vs Webpack</span>
        <span>${webpackBuild > 0 ? (webpackBuild / viteBuild).toFixed(1) + "x faster" : "N/A"}</span>
      </div>
      <div class="comparison-row">
        <span>Vite vs Rspack</span>
        <span>${rspackBuild > 0 ? (rspackBuild / viteBuild).toFixed(1) + "x faster" : "N/A"}</span>
      </div>
      <div class="comparison-row">
        <span>Rspack vs Webpack</span>
        <span>${
            rspackBuild > 0 && webpackBuild > 0 ? (webpackBuild / rspackBuild).toFixed(1) + "x faster" : "N/A"
        }</span>
      </div>
    </div>
  `;
}

// Initialize dashboard
function init() {
    const data = loadBenchmarkData();

    updateStatCards(data);
    createBuildChart(data);
    createDevChart(data);
    createDistributionChart(data);
    generateSummary(data);
}

init();
