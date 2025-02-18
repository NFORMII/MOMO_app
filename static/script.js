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

    // Format currency
    function formatCurrency(amount) {
        return new Intl.NumberFormat('rw-RW', {
            style: 'currency',
            currency: 'RWF',
            maximumFractionDigits: 0
        }).format(amount);
    }

    // Load dashboard data from API
    async function loadDashboardData() {
        // Show loading state
        setLoadingState(true);

        try {
            const response = await fetch('http://localhost:5000/api/dashboard-data');

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            updateDashboard(data);
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            showError('Failed to load dashboard data');
        } finally {
            setLoadingState(false);
        }
    }

    function setLoadingState(isLoading) {
        if (isLoading) {
            totalTransactionsEl.textContent = "Loading...";
            totalAmountEl.textContent = "Loading...";
            activeUsersEl.textContent = "Loading...";
            avgTransactionEl.textContent = "Loading...";
        }
    }

    function updateDashboard(data) {
        // Update metrics
        totalTransactionsEl.textContent = new Intl.NumberFormat().format(data.totalTransactions);
        totalAmountEl.textContent = formatCurrency(data.totalAmount);
        
        // Calculate average transaction
        const avgTransaction = data.totalTransactions > 0 ? 
            data.totalAmount / data.totalTransactions : 0;
        avgTransactionEl.textContent = formatCurrency(avgTransaction);

        // Update active users (if provided by API)
        if (data.activeUsers) {
            activeUsersEl.textContent = new Intl.NumberFormat().format(data.activeUsers);
        }

        // Update charts
        updateCharts(data);
        
        // Update recent transactions
        updateTransactionTable(data.recentTransactions);

        // Update trends
        updateTrends(data);
    }

    function updateCharts(data) {
        // Update Transaction Types Chart
        const typeData = {
            labels: Object.keys(data.typeDistribution),
            datasets: [{
                label: "Transaction Count",
                data: Object.values(data.typeDistribution),
                backgroundColor: chartColors,
                borderWidth: 1
            }]
        };

        if (typeChart) {
            typeChart.destroy();
        }

        typeChart = new Chart(transactionTypeChart.getContext("2d"), {
            type: "bar",
            data: typeData,
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

    function updateTransactionTable(transactions) {
        if (!transactions || transactions.length === 0) {
            recentTransactionsBody.innerHTML = '<tr><td colspan="5">No recent transactions</td></tr>';
            return;
        }

        const tableHTML = transactions.map(tx => `
            <tr>
                <td>${tx.id || 'N/A'}</td>
                <td>${tx.recipient || 'N/A'}</td>
                <td>${tx.type}</td>
                <td>${formatCurrency(tx.amount)}</td>
                <td><span class="status status-${tx.status || 'completed'}">${tx.status || 'completed'}</span></td>
            </tr>
        `).join('');
        
        recentTransactionsBody.innerHTML = tableHTML;
    }

    function updateTrends(data) {
        // Update trend indicators
        document.querySelectorAll(".trend").forEach(trend => {
            const valueEl = trend.querySelector("span");
            const value = parseFloat(valueEl.textContent);
            
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
    }

    function showError(message) {
        // You could implement a toast notification here
        console.error(message);
    }

    // Event Listeners
    chartControlButtons.forEach(button => {
        button.addEventListener("click", () => {
            chartControlButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");
            
            if (typeChart) {
                const newType = button.dataset.type;
                const currentData = typeChart.data;
                typeChart.destroy();
                
                typeChart = new Chart(transactionTypeChart.getContext("2d"), {
                    type: newType,
                    data: currentData,
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

    dateRangeSelect.addEventListener("change", loadDashboardData);
    refreshBtn.addEventListener("click", loadDashboardData);
    trendPeriodSelect.addEventListener("change", loadDashboardData);

    // Initial load
    loadDashboardData();
});