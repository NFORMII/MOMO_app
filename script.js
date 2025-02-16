document.addEventListener("DOMContentLoaded", () => {
    // Initialize elements
    const totalTransactionsEl = document.querySelector("#total-transactions .number");
    const totalAmountEl = document.querySelector("#total-amount .number");
    const activeUsersEl = document.querySelector("#active-users .number");
    const avgTransactionEl = document.querySelector("#average-transaction .number");
    const transactionTypeChart = document.getElementById("transactionTypeChart");
    const transactionTrendChart = document.getElementById("transactionTrendChart");
    const recentTransactionsBody = document.getElementById("recent-transactions-body");
    const refreshBtn = document.getElementById("refresh-btn");
    const dateRangeSelect = document.getElementById("date-range");
    const trendPeriodSelect = document.getElementById("trend-period");
    const chartControlButtons = document.querySelectorAll(".chart-controls button");

    // Chart instances
    let typeChart;
    let trendChart;

    // Color palette for charts
    const chartColors = ["#f9ca24", "#f0932b", "#ffbe76", "#f6e58d", "#c7ecee"];

    // Simulate loading data
    function loadDashboardData() {
        // Update loading indicators
        totalTransactionsEl.textContent = "Loading...";
        totalAmountEl.textContent = "Loading...";
        activeUsersEl.textContent = "Loading...";
        avgTransactionEl.textContent = "Loading...";
        
        // Simulate API delay
        setTimeout(() => {
            // Update metrics with simulated data
            totalTransactionsEl.textContent = "1,254";
            document.querySelector("#total-transactions .trend span").textContent = "12.5%";
            
            totalAmountEl.textContent = "4,587,200 RWF";
            document.querySelector("#total-amount .trend span").textContent = "8.3%";
            
            activeUsersEl.textContent = "728";
            document.querySelector("#active-users .trend span").textContent = "5.7%";
            
            avgTransactionEl.textContent = "3,658 RWF";
            document.querySelector("#average-transaction .trend span").textContent = "-2.1%";
            
            // Update trend indicators
            document.querySelectorAll(".trend").forEach(trend => {
                const value = parseFloat(trend.querySelector("span").textContent);
                if (value < 0) {
                    trend.classList.remove("positive");
                    trend.classList.add("negative");
                    trend.querySelector("i").className = "fas fa-arrow-down";
                } else {
                    trend.classList.remove("negative");
                    trend.classList.add("positive");
                    trend.querySelector("i").className = "fas fa-arrow-up";
                }
            });
            
            // Load charts
            initCharts();
            
            // Load recent transactions
            loadRecentTransactions();
        }, 1200);
    }

    // Initialize charts
    function initCharts() {
        // Transaction Types Chart
        const typeCtx = transactionTypeChart.getContext("2d");
        const typeData = {
            labels: ["Deposits", "Withdrawals", "Payments", "Transfers", "Airtime"],
            datasets: [{
                label: "Transaction Count",
                data: [420, 325, 180, 250, 79],
                backgroundColor: chartColors,
                borderWidth: 1
            }]
        };
        
        typeChart = new Chart(typeCtx, {
            type: "bar",
            data: typeData,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: "bottom"
                    },
                    title: {
                        display: false
                    }
                }
            }
        });
        
        // Transaction Trends Chart
        const trendCtx = transactionTrendChart.getContext("2d");
        const trendData = {
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            datasets: [{
                label: "Transaction Volume",
                data: [150, 180, 210, 175, 225, 290, 205],
                borderColor: "#f0932b",
                backgroundColor: "rgba(240, 147, 43, 0.1)",
                tension: 0.4,
                fill: true
            }]
        };
        
        trendChart = new Chart(trendCtx, {
            type: "line",
            data: trendData,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: "bottom"
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Load recent transactions
    function loadRecentTransactions() {
        // Simulate API delay
        setTimeout(() => {
            const transactions = [
                {id: "TX12345", customer: "Alice Mutoni", type: "Deposit", amount: "250,000 RWF", status: "completed"},
                {id: "TX12346", customer: "Bob Ntwari", type: "Withdrawal", amount: "75,000 RWF", status: "completed"},
                {id: "TX12347", customer: "Claire Uwase", type: "Payment", amount: "32,500 RWF", status: "completed"},
                {id: "TX12348", customer: "David Mugabo", type: "Transfer", amount: "150,000 RWF", status: "pending"},
                {id: "TX12349", customer: "Eve Kayitesi", type: "Airtime", amount: "5,000 RWF", status: "failed"}
            ];
            
            let tableHTML = "";
            transactions.forEach(tx => {
                tableHTML += `
                <tr>
                    <td>${tx.id}</td>
                    <td>${tx.customer}</td>
                    <td>${tx.type}</td>
                    <td>${tx.amount}</td>
                    <td><span class="status status-${tx.status}">${tx.status}</span></td>
                </tr>
                `;
            });
            
            recentTransactionsBody.innerHTML = tableHTML;
        }, 1500);
    }

    // Handle chart type switching
    chartControlButtons.forEach(button => {
        button.addEventListener("click", () => {
            // Update active state
            chartControlButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");
            
            // Update chart type
            if (button.dataset.type === "pie" && typeChart.config.type !== "pie") {
                typeChart.destroy();
                typeChart = new Chart(transactionTypeChart.getContext("2d"), {
                    type: "pie",
                    data: typeChart.data,
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {
                                position: "bottom"
                            }
                        }
                    }
                });
            } else if (button.dataset.type === "bar" && typeChart.config.type !== "bar") {
                typeChart.destroy();
                typeChart = new Chart(transactionTypeChart.getContext("2d"), {
                    type: "bar",
                    data: typeChart.data,
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {
                                position: "bottom"
                            }
                        }
                    }
                });
            }
        });
    });

    // Handle trend period changes
    trendPeriodSelect.addEventListener("change", () => {
        const period = trendPeriodSelect.value;
        let labels, data;
        
        if (period === "weekly") {
            labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
            data = [150, 180, 210, 175, 225, 290, 205];
        } else if (period === "monthly") {
            labels = ["Week 1", "Week 2", "Week 3", "Week 4"];
            data = [950, 1050, 1150, 980];
        } else { // yearly
            labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            data = [3200, 3150, 3450, 3600, 3950, 4100, 4250, 4300, 4500, 4650, 4750, 4850];
        }
        
        trendChart.data.labels = labels;
        trendChart.data.datasets[0].data = data;
        trendChart.update();
    });

    // Handle date range changes
    dateRangeSelect.addEventListener("change", () => {
        loadDashboardData();
    });

    // Handle refresh button
    refreshBtn.addEventListener("click", () => {
        loadDashboardData();
    });

    // Initial load
    loadDashboardData();
});
