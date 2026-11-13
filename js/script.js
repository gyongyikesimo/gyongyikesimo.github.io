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

// Create the Vega-Lite chart using the seattle-weather.csv data file
async function createCharts() {
    // Vega-Lite specification for a bar chart of average monthly precipitation
    const vlSpec = {
        $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
        description: 'Average monthly precipitation in Seattle.',
        data: { url: 'data/seattle-weather.csv' },
        mark: 'bar',
        encoding: {
            x: {
                timeUnit: 'month',
                field: 'date',
                type: 'ordinal',
                title: 'Month'
            },
            y: {
                aggregate: 'mean',
                field: 'precipitation',
                type: 'quantitative',
                title: 'Average Precipitation'
            }
        },
        title: 'Average Monthly Precipitation in Seattle'
    };

    // Embed the Vega-Lite chart into the div with id "vis"
    vegaEmbed('#vis', vlSpec, { actions: false }).catch(console.error);
}

// Start loading the data when the page loads
window.onload = loadData;