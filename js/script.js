// This script loads business data from an external JSON file
// and uses it to populate the KPI cards and draw three Chart.js charts.

// Variables to hold the data once it is loaded from the JSON file
let businessData = {};

// Load the data from business-data.json using fetch()
async function loadData() {
    try {
        // Fetch the JSON file from the data folder
        const response = await fetch('data/business-data.json');

        // Check if the request was successful
        if (!response.ok) {
            throw new Error('Failed to load business data: ' + response.statusText);
        }

        // Parse the JSON response into a JavaScript object
        businessData = await response.json();

        // Once data is loaded, update the dashboard
        updateKPICards();
        createCharts();
    } catch (error) {
        // Show an error message if something goes wrong
        console.error('Error loading data:', error);
        alert('Could not load business data. Please make sure you are running this through a local server.');
    }
}

// Calculate and display the KPI summary card values
function updateKPICards() {
    // Total revenue = sum of all monthly revenue values
    const totalRevenue = businessData.monthlyRevenue.data.reduce((sum, value) => sum + value, 0);

    // Total orders = sum of all monthly orders values
    const totalOrders = businessData.monthlyOrders.reduce((sum, value) => sum + value, 0);

    // Average order value = total revenue divided by total orders
    const avgOrderValue = (totalRevenue / totalOrders).toFixed(2);

    // New customers = sum of all new customers values
    const newCustomers = businessData.newCustomers.reduce((sum, value) => sum + value, 0);

    // Update the text content of each KPI card in the HTML
    document.getElementById('total-revenue').textContent = '$' + totalRevenue.toLocaleString();
    document.getElementById('total-orders').textContent = totalOrders.toLocaleString();
    document.getElementById('avg-order').textContent = '$' + avgOrderValue;
    document.getElementById('new-customers').textContent = newCustomers.toLocaleString();
}

// Create the Monthly Revenue line chart using the loaded data
function createCharts() {
    // --- Line Chart: Monthly Revenue ---
    const lineCtx = document.getElementById('lineChart').getContext('2d');
    new Chart(lineCtx, {
        type: 'line',
        data: {
            labels: businessData.monthlyRevenue.labels,
            datasets: [{
                label: 'Revenue ($)',
                data: businessData.monthlyRevenue.data,
                borderColor: '#2ecc71',
                backgroundColor: 'rgba(46, 204, 113, 0.2)',
                borderWidth: 2,
                fill: true,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false },
                title: {
                    display: true,
                    text: 'Monthly Revenue Trend'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Revenue ($)'
                    }
                }
            }
        }
    });
}

// Start loading the data when the page loads
window.onload = loadData;