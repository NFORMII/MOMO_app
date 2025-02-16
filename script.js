document.addEventListener("DOMContentLoaded", () => {
    const totalTransactions = document.getElementById("total-transactions").querySelector("p");
    const totalAmount = document.getElementById("total-amount").querySelector("p");

    // Simulating fetching data from backend
    setTimeout(() => {
        totalTransactions.textContent = "345 Transactions";
        totalAmount.textContent = "1,500,000 RWF";
    }, 1000);

    // Chart.js for interactive graph
    const ctx = document.getElementById("transactionChart").getContext("2d");
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ["Incoming Money", "Payments", "Airtime Purchase", "Withdrawals"],
            datasets: [{
                label: "Transaction Types",
                data: [120, 90, 50, 85], // Replace with actual data
                backgroundColor: ["#4CAF50", "#FF9800", "#00BCD4", "#E91E63"]
            }]
        },
        options: {
            responsive: true,
            animation: {
                duration: 2000,
                easing: "easeInOutBounce"
            }
        }
    });
});

