// DebriSense Insights JavaScript
// Handles charts, ML predictions visualization, and insights functionality

let charts = {};
let currentPeriod = '6m';

// Initialize insights when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Insights page initialized');
    
    // Initialize charts after components are loaded
    setTimeout(() => {
        initializeCharts();
        populateInsightsCards();
        populateRegionalComparison();
        setupSeasonToggle();
    }, 1000);
});

// Initialize all charts
function initializeCharts() {
    console.log('Initializing charts...');
    
    initializeRiskTrendChart();
    initializeTopRiskZonesChart();
    initializePollutionTypesChart();
    
    console.log('Charts initialized successfully');
}

// Initialize risk trend chart
function initializeRiskTrendChart() {
    const ctx = document.getElementById('riskTrendChart');
    if (!ctx) return;
    
    const data = generateTrendData();
    
    charts.riskTrend = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Average Risk Score',
                data: data.values,
                borderColor: '#2E7D32',
                backgroundColor: 'rgba(46, 125, 50, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            return `Risk Score: ${(context.parsed.y * 100).toFixed(1)}%`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 1,
                    ticks: {
                        callback: function(value) {
                            return (value * 100).toFixed(0) + '%';
                        }
                    }
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            }
        }
    });
}

// Initialize top risk zones chart
function initializeTopRiskZonesChart() {
    const ctx = document.getElementById('topRiskZonesChart');
    if (!ctx) return;
    
    const topZones = mockData.mlPredictionZones
        .sort((a, b) => b.predicted_risk_score - a.predicted_risk_score)
        .slice(0, 5);
    
    charts.topRiskZones = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: topZones.map(zone => zone.river_basin),
            datasets: [{
                label: 'Risk Score',
                data: topZones.map(zone => zone.predicted_risk_score),
                backgroundColor: topZones.map(zone => getRiskColor(zone.predicted_risk_score)),
                borderColor: topZones.map(zone => getRiskColor(zone.predicted_risk_score)),
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Risk Score: ${(context.parsed.y * 100).toFixed(1)}%`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 1,
                    ticks: {
                        callback: function(value) {
                            return (value * 100).toFixed(0) + '%';
                        }
                    }
                }
            }
        }
    });
}

// Initialize pollution types chart
function initializePollutionTypesChart() {
    const ctx = document.getElementById('pollutionTypesChart');
    if (!ctx) return;
    
    const pollutionData = aggregatePollutionTypes();
    
    charts.pollutionTypes = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: pollutionData.labels,
            datasets: [{
                data: pollutionData.values,
                backgroundColor: [
                    '#2E7D32',
                    '#81C784',
                    '#FFC107',
                    '#FF9800',
                    '#F44336',
                    '#9C27B0',
                    '#2196F3'
                ],
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((context.parsed / total) * 100).toFixed(1);
                            return `${context.label}: ${context.parsed} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// Generate trend data for risk trend chart
function generateTrendData() {
    // TODO: Replace with real time series data
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const values = [0.45, 0.52, 0.48, 0.61, 0.67, 0.74];
    
    return {
        labels: months,
        values: values
    };
}

// Aggregate pollution types from cleanup reports
function aggregatePollutionTypes(filteredZones = null) {
    const pollutionCounts = {};
    
    if (filteredZones) {
        // Use filtered zones to get pollution types
        filteredZones.forEach(zone => {
            zone.top_pollution_types.forEach(type => {
                pollutionCounts[type] = (pollutionCounts[type] || 0) + 1;
            });
        });
    } else {
        // Count pollution types from cleanup reports (fallback)
        mockData.cleanupReports.forEach(report => {
            Object.entries(report.plastic_items).forEach(([type, count]) => {
                const displayName = getDisplayName(type);
                pollutionCounts[displayName] = (pollutionCounts[displayName] || 0) + count;
            });
        });
    }
    
    // Convert to chart format
    const sortedTypes = Object.entries(pollutionCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 7);
    
    return {
        labels: sortedTypes.map(([type]) => type),
        values: sortedTypes.map(([,count]) => count)
    };
}

// Get display name for pollution type
function getDisplayName(type) {
    const mapping = {
        'plastic_bottles': 'Plastic Bottles',
        'plastic_bags': 'Plastic Bags',
        'food_wrappers': 'Food Wrappers',
        'straws': 'Straws',
        'cigarette_butts': 'Cigarette Butts',
        'fishing_gear': 'Fishing Gear',
        'others': 'Others'
    };
    return mapping[type] || type;
}

// Get risk color
function getRiskColor(riskScore) {
    if (riskScore <= 0.3) return '#A5D6A7';
    if (riskScore <= 0.6) return '#FFF176';
    return '#EF5350';
}

// Populate insights cards
function populateInsightsCards() {
    const container = document.getElementById('insightsCards');
    if (!container) return;
    
    const insights = mockData.riskInsightSummaries;
    
    container.innerHTML = insights.map(insight => `
        <div class="col-md-6 mb-3">
            <div class="card h-100">
                <div class="card-header">
                    <h6 class="mb-0">
                        <i class="fas fa-map-marker-alt me-2"></i>
                        ${insight.region}
                    </h6>
                </div>
                <div class="card-body">
                    <div class="row mb-3">
                        <div class="col-6">
                            <div class="stats-card">
                                <div class="stats-number">${(insight.average_risk_score * 100).toFixed(1)}%</div>
                                <div class="stats-label">Avg Risk Score</div>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="stats-card">
                                <div class="stats-number">${insight.high_risk_rivers.length}</div>
                                <div class="stats-label">High Risk Rivers</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="mb-3">
                        <strong>Trend:</strong> 
                        <span class="badge ${insight.trend === 'Increasing' ? 'bg-danger' : insight.trend === 'Decreasing' ? 'bg-success' : 'bg-warning'}">
                            ${insight.trend}
                        </span>
                    </div>
                    
                    <div class="mb-3">
                        <strong>High Risk Rivers:</strong>
                        <ul class="list-unstyled mt-1">
                            ${insight.high_risk_rivers.map(river => 
                                `<li><i class="fas fa-water me-2"></i>${river}</li>`
                            ).join('')}
                        </ul>
                    </div>
                    
                    <div>
                        <strong>Recommendations:</strong>
                        <ul class="list-unstyled mt-1">
                            ${insight.recommendations.map(rec => 
                                `<li><i class="fas fa-lightbulb me-2 text-warning"></i>${rec}</li>`
                            ).join('')}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Populate regional comparison table
function populateRegionalComparison() {
    const tableBody = document.getElementById('regionalComparisonTable');
    if (!tableBody) return;
    
    // Use filtered data if available, otherwise use all data
    const zones = filterManager && filterManager.getFilteredData 
        ? filterManager.getFilteredData().mlPredictions.sort((a, b) => b.predicted_risk_score - a.predicted_risk_score)
        : mockData.mlPredictionZones.sort((a, b) => b.predicted_risk_score - a.predicted_risk_score);
    
    tableBody.innerHTML = zones.map(zone => `
        <tr>
            <td><strong>${zone.river_basin}</strong></td>
            <td>${zone.state}</td>
            <td>${zone.river_basin}</td>
            <td>
                <span class="risk-score ${getRiskClass(zone.predicted_risk_score)}">
                    ${(zone.predicted_risk_score * 100).toFixed(1)}%
                </span>
            </td>
            <td>
                <i class="fas fa-arrow-up text-danger"></i>
                <small class="text-muted">Increasing</small>
            </td>
            <td>${zone.top_pollution_types[0]}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary" onclick="viewZoneDetails('${zone.id}')">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-outline-secondary" onclick="exportZoneData('${zone.id}')">
                    <i class="fas fa-download"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Get risk class
function getRiskClass(riskScore) {
    if (riskScore <= 0.3) return 'risk-low';
    if (riskScore <= 0.6) return 'risk-moderate';
    return 'risk-high';
}

// Setup season toggle
function setupSeasonToggle() {
    const seasonInputs = document.querySelectorAll('input[name="seasonToggle"]');
    seasonInputs.forEach(input => {
        input.addEventListener('change', function() {
            updateChartsWithSeason(this.value);
        });
    });
}

// Update charts with season
function updateChartsWithSeason(season) {
    console.log(`Updating charts for season: ${season}`);
    
    // TODO: Update charts with season-specific data
    // For now, just show notification
    DebriSense.showNotification(`Charts updated for ${season}`, 'info');
}

// Update chart period
function updateChartPeriod(period) {
    currentPeriod = period;
    
    // Update active button
    document.querySelectorAll('.btn-group-sm .btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Update trend chart
    if (charts.riskTrend) {
        const data = generateTrendDataForPeriod(period);
        charts.riskTrend.data.labels = data.labels;
        charts.riskTrend.data.datasets[0].data = data.values;
        charts.riskTrend.update();
    }
    
    DebriSense.showNotification(`Chart period updated to ${period}`, 'info');
}

// Generate trend data for specific period
function generateTrendDataForPeriod(period) {
    // TODO: Replace with real period-specific data
    const periods = {
        '3m': { labels: ['Jul', 'Aug', 'Sep'], values: [0.61, 0.67, 0.74] },
        '6m': { labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'], values: [0.45, 0.52, 0.48, 0.61, 0.67, 0.74] },
        '1y': { labels: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'], 
                values: [0.38, 0.42, 0.45, 0.52, 0.48, 0.61, 0.67, 0.74, 0.71, 0.68, 0.72, 0.74] }
    };
    
    return periods[period] || periods['6m'];
}

// Export insights
function exportInsights() {
    const dataToExport = {
        timestamp: new Date().toISOString(),
        filters: filterManager.getFilters(),
        insights: mockData.riskInsightSummaries,
        predictions: mockData.mlPredictionZones,
        charts: {
            riskTrend: generateTrendData(),
            pollutionTypes: aggregatePollutionTypes()
        }
    };
    
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `debrisense_insights_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    DebriSense.showNotification('Insights exported successfully', 'success');
}

// Refresh predictions
function refreshPredictions() {
    // TODO: Implement real data refresh
    DebriSense.showNotification('Refreshing predictions...', 'info');
    
    setTimeout(() => {
        // Simulate refresh
        initializeCharts();
        populateInsightsCards();
        populateRegionalComparison();
        DebriSense.showNotification('Predictions refreshed successfully', 'success');
    }, 2000);
}

// View zone details
function viewZoneDetails(zoneId) {
    const zone = mockData.mlPredictionZones.find(z => z.id === zoneId);
    if (!zone) return;
    
    // TODO: Show zone details modal
    DebriSense.showNotification(`Viewing details for ${zone.river_basin}`, 'info');
}

// Export zone data
function exportZoneData(zoneId) {
    const zone = mockData.mlPredictionZones.find(z => z.id === zoneId);
    if (!zone) return;
    
    const dataToExport = {
        zone: zone,
        timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `zone_${zoneId}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    DebriSense.showNotification(`Zone data exported successfully`, 'success');
}

// Update charts with filters
function updateChartsWithFilters() {
    console.log('Updating charts with filters...');
    
    // Filter data based on current filters
    const filters = filterManager.getFilters();
    const filteredZones = mockData.mlPredictionZones.filter(zone => {
        if (filters.season && zone.season !== filters.season) return false;
        if (filters.state && zone.state !== filters.state) return false;
        if (filters.river && zone.river_basin !== filters.river) return false;
        return true;
    });
    
    console.log(`Filtered zones: ${filteredZones.length} out of ${mockData.mlPredictionZones.length} total`);
    
    // Update top risk zones chart
    if (charts.topRiskZones) {
        const topZones = filteredZones
            .sort((a, b) => b.predicted_risk_score - a.predicted_risk_score)
            .slice(0, 5);
        
        console.log('Updating top risk zones chart with:', topZones.map(z => z.river_basin));
        
        charts.topRiskZones.data.labels = topZones.map(zone => zone.river_basin);
        charts.topRiskZones.data.datasets[0].data = topZones.map(zone => zone.predicted_risk_score);
        charts.topRiskZones.data.datasets[0].backgroundColor = topZones.map(zone => getRiskColor(zone.predicted_risk_score));
        charts.topRiskZones.data.datasets[0].borderColor = topZones.map(zone => getRiskColor(zone.predicted_risk_score));
        charts.topRiskZones.update();
        
        console.log('Top risk zones chart updated successfully');
    } else {
        console.warn('Top risk zones chart not found');
    }
    
    // Update pollution types chart with filtered data
    if (charts.pollutionTypes) {
        console.log('Updating pollution types chart...');
        const pollutionData = aggregatePollutionTypes(filteredZones);
        
        charts.pollutionTypes.data.labels = pollutionData.labels;
        charts.pollutionTypes.data.datasets[0].data = pollutionData.values;
        charts.pollutionTypes.update();
        
        console.log('Pollution types chart updated successfully');
    } else {
        console.warn('Pollution types chart not found');
    }
    
    // Update regional comparison table
    populateRegionalComparison();
    
    console.log(`Charts updated: ${filteredZones.length} zones displayed`);
}

// Export functions for global use
window.insightsFunctions = {
    exportInsights,
    refreshPredictions,
    viewZoneDetails,
    exportZoneData,
    updateChartsWithFilters
}; 