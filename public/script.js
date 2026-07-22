// ======================================
// Global Variables
// ======================================

let energyChart = null;
let comparisonChart = null;
let trendChart = null;


let history = JSON.parse(localStorage.getItem("history")) || [];

// ======================================
// Calculate
// ======================================

async function calculate() {

    const model = document.getElementById("model").value;
    const runs = parseInt(document.getElementById("runs").value);

    const country = document.getElementById("country").value;
    const source = document.getElementById("source").value;
    const task = document.getElementById("task").value;

    try {

        const response = await fetch("/api/predict", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                model: model,
                runs: runs,
                country: country,
                source: source,
                task: task

            })

        });

        if (!response.ok) {

            throw new Error("Server Error");

        }

        const data = await response.json();

        //----------------------------------
        // Update Dashboard
        //----------------------------------

        document.getElementById("energyValue").innerHTML =
            data.energy + " Wh";

        document.getElementById("carbonValue").innerHTML =
            data.carbon + " gCO₂";

        document.getElementById("costValue").innerHTML =
            "₹" + data.cost;

        document.getElementById("scoreValue").innerHTML =
            data.green_score;

        document.getElementById("recommendation").innerHTML =
            data.recommendation;
        generateInsights(data);

        //----------------------------------
        // Charts
        //----------------------------------

        createEnergyChart(data);

        createComparisonChart(data);

        //----------------------------------
        // History
        //----------------------------------

        saveHistory(data, country);

    }

    catch (error) {

        console.error(error);

        alert("Unable to connect to Flask API.");

    }

}

// ======================================
// Energy Chart
// ======================================

function createEnergyChart(data) {

    const ctx = document.getElementById("energyChart");

    if (energyChart) {

        energyChart.destroy();

    }

    energyChart = new Chart(ctx, {

        type: "bar",

        data: {

            labels: [

                "Energy",

                "Carbon"

            ],

            datasets: [

                {

                    label: "Environmental Impact",

                    data: [

                        data.energy,

                        data.carbon

                    ],

                    backgroundColor: [

                        "#22c55e",

                        "#0ea5e9"

                    ]

                }

            ]

        },

        options: {

            responsive: true,

            plugins: {

                legend: {

                    display: false

                }

            }

        }

    });

}

// ======================================
// Radar Chart
// ======================================

function createComparisonChart(data) {

    const ctx = document.getElementById("comparisonChart");

    if (comparisonChart) {

        comparisonChart.destroy();

    }

    comparisonChart = new Chart(ctx, {

        type: "radar",

        data: {

            labels: [

                "Accuracy",

                "Energy",

                "Carbon",

                "Memory",

                "Green Score"

            ],

            datasets: [

                {

                    label: data.model,

                    data: [

                        data.accuracy,

                        data.energy / 10,

                        data.carbon / 10,

                        data.memory,

                        data.green_score

                    ],

                    fill: true,

                    borderWidth: 2

                }

            ]

        },

        options: {

            responsive: true,

            scales: {

                r: {

                    beginAtZero: true

                }

            }

        }

    });

}// ======================================
// Save History
// ======================================

function saveHistory(data, country) {

    const last = history[0];

    if (
        last &&
        last.model === data.model &&
        last.country === country &&
        last.energy === data.energy
    ) {
        return;
    }

    history.unshift({

        model: data.model,
        country: country,
        energy: data.energy,
        carbon: data.carbon,
        score: data.green_score

    });

    // Keep only latest 10 calculations
    if (history.length > 10) {
        history.pop();
    }

    localStorage.setItem(
        "history",
        JSON.stringify(history)
    );

    loadHistory();
    createTrendChart();
}

// ======================================
// Load History
// ======================================

function loadHistory() {

    const tbody = document.querySelector("#historyTable tbody");

    if (!tbody) return;

    tbody.innerHTML = "";

    history.forEach(item => {

        tbody.innerHTML += `

        <tr>

            <td>${item.model}</td>

            <td>${item.country}</td>

            <td>${item.energy} Wh</td>

            <td>${item.carbon} gCO₂</td>

            <td>${item.score}</td>

        </tr>

        `;

    });

}

// ======================================
// Clear History
// ======================================

function clearHistory() {

    history = [];

    localStorage.removeItem("history");

    loadHistory();
    createTrendChart();

}

// ======================================
// Export History CSV
// ======================================

function exportHistory() {

    if (history.length === 0) {

        alert("No history available.");

        return;

    }

    let csv =
        "Model,Country,Energy,Carbon,Green Score\n";

    history.forEach(item => {

        csv += `${item.model},${item.country},${item.energy},${item.carbon},${item.score}\n`;

    });

    const blob = new Blob([csv], {

        type: "text/csv"

    });

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download = "greenai-history.csv";

    a.click();

    window.URL.revokeObjectURL(url);

}
async function loadModels() {

    try {

        const response = await fetch("/api/models");

        const models = await response.json();

        const tbody =
            document.querySelector("#modelTable tbody");

        tbody.innerHTML = "";

        models.forEach(model => {

            tbody.innerHTML += `

            <tr>

                <td>${model.model}</td>

                <td>${model.energy} Wh</td>

                <td>${model.carbon} gCO₂</td>

                <td>${model.accuracy}%</td>

                <td>${model.memory} GB</td>

                <td>${model.green_score}</td>

            </tr>

            `;

        });

    }

    catch (error) {

        console.log(error);

    }

}
function generateInsights(data) {

    let message = "";

    if (data.green_score >= 90) {

        message =
            "🌱 Excellent! This AI model is highly energy efficient and environmentally friendly.";

    }
    else if (data.green_score >= 70) {

        message =
            "✅ Good choice. Your selected model has a moderate environmental impact.";

    }
    else if (data.green_score >= 50) {

        message =
            "⚠ Consider switching to a smaller model to reduce energy consumption and carbon emissions.";

    }
    else {

        message =
            "🚨 High carbon footprint detected. Switching to " +
            data.recommendation +
            " could significantly reduce emissions.";

    }

    document.getElementById("insights").innerHTML = message;

}
function createTrendChart() {

    const ctx = document.getElementById("trendChart");

    if (!ctx) return;

    if (trendChart) {
        trendChart.destroy();
    }

    const labels = history.map((item, index) => "Run " + (index + 1)).reverse();

    const carbon = history.map(item => item.carbon).reverse();

    trendChart = new Chart(ctx, {

        type: "line",

        data: {

            labels: labels,

            datasets: [{

                label: "Carbon Emissions (gCO₂)",

                data: carbon,

                borderWidth: 3,

                tension: 0.3,

                fill: false

            }]

        },

        options: {

            responsive: true,

            plugins: {

                legend: {

                    display: true

                }

            }

        }

    });

}
async function loadLeaderboard() {

    try {

        const response = await fetch("/api/models");

        const models = await response.json();

        models.sort((a, b) => b.green_score - a.green_score);

        const tbody = document.querySelector("#leaderboardTable tbody");

        tbody.innerHTML = "";

        models.forEach((model, index) => {

            let medal = index + 1;

            if (index === 0) medal = "🥇";
            else if (index === 1) medal = "🥈";
            else if (index === 2) medal = "🥉";

            let badge = "⭐";

            if (model.green_score >= 95)
                badge = "⭐⭐⭐⭐⭐";
            else if (model.green_score >= 90)
                badge = "⭐⭐⭐⭐";
            else if (model.green_score >= 80)
                badge = "⭐⭐⭐";
            else if (model.green_score >= 70)
                badge = "⭐⭐";
            else
                badge = "⭐";

            tbody.innerHTML += `

            <tr>

            <td>${medal}</td>

            <td>${model.model}</td>

            <td>${model.green_score}</td>

            <td>${badge}</td>

            </tr>

            `;

        });

    }

    catch (error) {

        console.log(error);

    }

}


// ======================================
// Initialize Page
// ======================================
window.onload = function () {

    loadHistory();

    loadModels();

    loadLeaderboard();

    createTrendChart();

}