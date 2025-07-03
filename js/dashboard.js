// DebriSense Dashboard JavaScript
// Handles map initialization, region interactions, and dashboard-specific functionality

let map;
let mapLayers = {};
let selectedRegion = null;

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Dashboard initialized');
    
    // Initialize map after components are loaded
    setTimeout(() => {
        initializeMap();
        populateRecentActivity();
        updateDashboardStats();
    }, 1000);
});

// Initialize the interactive map
function initializeMap() {
    console.log('Initializing map...');
    
    // Create map centered on Malaysia
    map = L.map('map').setView([4.2105, 108.9758], 6);
    
    // Add base tile layer with error handling
    const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18,
        subdomains: 'abc'
    }).addTo(map);
    
    // Handle tile loading errors
    tileLayer.on('tileerror', function(e) {
        console.warn('Tile loading error:', e);
        // Remove the failing tile layer
        map.removeLayer(tileLayer);
        
        // Add fallback tile provider
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '© CARTO',
            subdomains: 'abcd',
            maxZoom: 19
        }).addTo(map);
    });
    
    // Create risk zones from mock data
    createRiskZones();
    
    // Add map controls
    addMapControls();
    
    console.log('Map initialized successfully');
}

// Create risk zones on the map
function createRiskZones() {
    // Clear existing layers
    Object.values(mapLayers).forEach(layer => {
        if (layer) map.removeLayer(layer);
    });
    mapLayers = {};
    
    // Create zones for each ML prediction
    mockData.mlPredictionZones.forEach(zone => {
        const zoneLayer = createZoneLayer(zone);
        if (zoneLayer) {
            mapLayers[zone.id] = zoneLayer;
            zoneLayer.addTo(map);
        }
    });
}

// Create a single zone layer
function createZoneLayer(zone) {
    // Create a simple polygon for the zone (placeholder coordinates)
    const coordinates = getZoneCoordinates(zone);
    if (!coordinates) return null;
    
    // Determine color based on risk score
    const color = getRiskColor(zone.predicted_risk_score);
    
    // Create polygon
    const polygon = L.polygon(coordinates, {
        color: color,
        weight: 2,
        opacity: 0.8,
        fillColor: color,
        fillOpacity: 0.4
    });
    
    // Add popup on click
    polygon.on('click', function() {
        showRegionDetails(zone);
    });
    
    // Add tooltip on hover
    polygon.bindTooltip(`
        <strong>${zone.river_basin}</strong><br>
        Risk Score: ${(zone.predicted_risk_score * 100).toFixed(1)}%<br>
        State: ${zone.state}<br>
        Click for details
    `, {
        permanent: false,
        direction: 'top'
    });
    
    return polygon;
}

// Get coordinates for a zone (placeholder implementation)
function getZoneCoordinates(zone) {
    // TODO: Replace with real GeoJSON coordinates
    // For now, create simple rectangles based on state
    const stateCoordinates = {
        'Selangor': [[2.5, 101.0], [3.5, 102.0]],
        'Penang': [[5.0, 100.0], [5.5, 100.5]],
        'Sabah': [[4.0, 115.0], [7.0, 119.0]],
        'Johor': [[1.0, 103.0], [2.5, 104.5]],
        'Negeri Sembilan': [[2.5, 101.5], [3.0, 102.5]]
    };
    
    return stateCoordinates[zone.state] || null;
}

// Get color based on risk score
function getRiskColor(riskScore) {
    if (riskScore <= 0.3) return '#A5D6A7'; // Low risk - green
    if (riskScore <= 0.6) return '#FFF176'; // Moderate risk - yellow
    return '#EF5350'; // High risk - red
}

// Add map controls
function addMapControls() {
    // Add zoom control
    L.control.zoom({
        position: 'topright'
    }).addTo(map);
    
    // Add scale control
    L.control.scale({
        position: 'bottomleft'
    }).addTo(map);
}

// Show region details in modal
function showRegionDetails(zone) {
    selectedRegion = zone;
    
    const modalContent = `
        <div class="row">
            <div class="col-md-6">
                <h6>Region Information</h6>
                <table class="table table-sm">
                    <tr>
                        <td><strong>River Basin:</strong></td>
                        <td>${zone.river_basin}</td>
                    </tr>
                    <tr>
                        <td><strong>State:</strong></td>
                        <td>${zone.state}</td>
                    </tr>
                    <tr>
                        <td><strong>Season:</strong></td>
                        <td>${zone.season}</td>
                    </tr>
                    <tr>
                        <td><strong>Risk Score:</strong></td>
                        <td>
                            <span class="risk-score ${getRiskClass(zone.predicted_risk_score)}">
                                ${(zone.predicted_risk_score * 100).toFixed(1)}%
                            </span>
                        </td>
                    </tr>
                    <tr>
                        <td><strong>Last Updated:</strong></td>
                        <td>${new Date(zone.last_updated).toLocaleString()}</td>
                    </tr>
                </table>
            </div>
            <div class="col-md-6">
                <h6>Top Pollution Types</h6>
                <ul class="list-group">
                    ${zone.top_pollution_types.map(type => 
                        `<li class="list-group-item">
                            <i class="fas fa-trash me-2"></i>${type}
                        </li>`
                    ).join('')}
                </ul>
                
                <h6 class="mt-3">Recent Cleanup Activity</h6>
                <div class="small">
                    ${getRecentCleanupsForRegion(zone.state, zone.river_basin)}
                </div>
            </div>
        </div>
        
        <div class="row mt-3">
            <div class="col-12">
                <h6>Risk Assessment</h6>
                <div class="progress mb-2">
                    <div class="progress-bar ${getProgressBarClass(zone.predicted_risk_score)}" 
                         style="width: ${zone.predicted_risk_score * 100}%">
                        ${(zone.predicted_risk_score * 100).toFixed(1)}%
                    </div>
                </div>
                <small class="text-muted">
                    Based on ML model predictions using historical data, seasonal patterns, and environmental factors.
                </small>
            </div>
        </div>
    `;
    
    document.getElementById('regionDetailsContent').innerHTML = modalContent;
    
    const modal = new bootstrap.Modal(document.getElementById('regionDetailsModal'));
    modal.show();
}

// Get risk class for styling
function getRiskClass(riskScore) {
    if (riskScore <= 0.3) return 'risk-low';
    if (riskScore <= 0.6) return 'risk-moderate';
    return 'risk-high';
}

// Get progress bar class
function getProgressBarClass(riskScore) {
    if (riskScore <= 0.3) return 'bg-success';
    if (riskScore <= 0.6) return 'bg-warning';
    return 'bg-danger';
}

// Get recent cleanups for a region
function getRecentCleanupsForRegion(state, river) {
    const recentCleanups = mockData.cleanupReports.filter(report => 
        report.state === state || report.river === river
    ).slice(0, 3);
    
    if (recentCleanups.length === 0) {
        return '<p class="text-muted">No recent cleanup activity in this region.</p>';
    }
    
    return recentCleanups.map(report => 
        `<div class="mb-2">
            <strong>${report.location}</strong><br>
            <small class="text-muted">
                ${new Date(report.date).toLocaleDateString()} - 
                ${report.submitted_by}
            </small>
        </div>`
    ).join('');
}

// View region insights (redirect to insights page)
function viewRegionInsights() {
    if (selectedRegion) {
        const params = new URLSearchParams({
            region: selectedRegion.river_basin,
            state: selectedRegion.state
        });
        window.location.href = `insights.html?${params.toString()}`;
    }
}

// Export map data
function exportMapData() {
    const dataToExport = {
        timestamp: new Date().toISOString(),
        filters: filterManager.getFilters(),
        zones: mockData.mlPredictionZones,
        format: 'geojson'
    };
    
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `debrisense_map_data_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    DebriSense.showNotification('Map data exported successfully', 'success');
}

// Show map legend
function showMapLegend() {
    const legendContent = `
        <div class="row">
            <div class="col-md-4 text-center">
                <div class="risk-score risk-low mb-2">Low Risk</div>
                <small>0.0 - 0.3</small>
            </div>
            <div class="col-md-4 text-center">
                <div class="risk-score risk-moderate mb-2">Moderate Risk</div>
                <small>0.31 - 0.6</small>
            </div>
            <div class="col-md-4 text-center">
                <div class="risk-score risk-high mb-2">High Risk</div>
                <small>0.61 - 1.0</small>
            </div>
        </div>
        <hr>
        <p class="small text-muted">
            Risk scores are calculated using machine learning models based on historical cleanup data, 
            seasonal patterns, river flow data, and population density.
        </p>
    `;
    
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-info alert-dismissible fade show position-fixed';
    alertDiv.style.cssText = 'top: 20px; left: 20px; z-index: 9999; max-width: 400px;';
    alertDiv.innerHTML = `
        <h6><i class="fas fa-info-circle me-2"></i>Map Legend</h6>
        ${legendContent}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.parentNode.removeChild(alertDiv);
        }
    }, 8000);
}

// Populate recent activity table
function populateRecentActivity() {
    const tableBody = document.getElementById('recentActivityTable');
    if (!tableBody) return;
    
    // Use filtered data if available, otherwise use all data
    const reportsToShow = filterManager && filterManager.getFilteredData 
        ? filterManager.getFilteredData().cleanupReports.slice(0, 5)
        : mockData.cleanupReports.slice(0, 5);
    
    tableBody.innerHTML = reportsToShow.map(report => `
        <tr>
            <td>${new Date(report.date).toLocaleDateString()}</td>
            <td>${report.location}</td>
            <td>${report.state}</td>
            <td>${report.river}</td>
            <td>${getTotalItems(report.plastic_items)}</td>
            <td>${report.submitted_by}</td>
        </tr>
    `).join('');
}

// Get total items from plastic items object
function getTotalItems(plasticItems) {
    return Object.values(plasticItems).reduce((sum, count) => sum + count, 0);
}

// Update dashboard stats
function updateDashboardStats() {
    const lastUpdated = document.getElementById('lastUpdated');
    const currentSeason = document.getElementById('currentSeason');
    const dataPoints = document.getElementById('dataPoints');
    
    if (lastUpdated) {
        lastUpdated.textContent = new Date().toLocaleString();
    }
    
    if (currentSeason) {
        currentSeason.textContent = filterManager.getFilters().season;
    }
    
    if (dataPoints) {
        // Use filtered data if available, otherwise use all data
        const zonesToShow = filterManager && filterManager.getFilteredData 
            ? filterManager.getFilteredData().mlPredictions.length
            : mockData.mlPredictionZones.length;
        dataPoints.textContent = `${zonesToShow} zones`;
    }
}

// Update map with filters
function updateMapWithFilters() {
    console.log('Updating map with filters...');
    
    // Filter zones based on current filters
    const filteredZones = mockData.mlPredictionZones.filter(zone => {
        const filters = filterManager.getFilters();
        
        // Season filter
        if (filters.season && zone.season !== filters.season) return false;
        
        // State filter
        if (filters.state && zone.state !== filters.state) return false;
        
        // River filter
        if (filters.river && zone.river_basin !== filters.river) return false;
        
        return true;
    });
    
    // Update map layers
    Object.values(mapLayers).forEach(layer => {
        if (layer) map.removeLayer(layer);
    });
    mapLayers = {};
    
    filteredZones.forEach(zone => {
        const zoneLayer = createZoneLayer(zone);
        if (zoneLayer) {
            mapLayers[zone.id] = zoneLayer;
            zoneLayer.addTo(map);
        }
    });
    
    // Update stats
    updateDashboardStats();
    
    console.log(`Map updated: ${filteredZones.length} zones displayed`);
}

// Export functions for global use
window.dashboardFunctions = {
    showRegionDetails,
    viewRegionInsights,
    exportMapData,
    showMapLegend,
    updateMapWithFilters
}; 