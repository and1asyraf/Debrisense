// DebriSense Dashboard JavaScript
// Handles map initialization, region interactions, and dashboard-specific functionality

let map;
let mapLayers = {};
let heatmapLayer = null;
let selectedRegion = null;

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Dashboard initialized');
    
    // Check for required dependencies
    console.log('📦 Checking dependencies...');
    console.log('Leaflet available:', typeof L !== 'undefined');
    console.log('Heatmap plugin available:', typeof L.heatLayer !== 'undefined');
    console.log('Mock data available:', typeof mockData !== 'undefined');
    
    // Initialize map after components are loaded
    setTimeout(() => {
        try {
            initializeMap();
            populateRecentActivity();
            updateDashboardStats();
            console.log('✅ Dashboard setup complete');
        } catch (error) {
            console.error('❌ Dashboard initialization failed:', error);
        }
    }, 1000);
});

// Initialize the interactive map with heatmap
function initializeMap() {
    console.log('Initializing map with heatmap...');
    
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
    
    // Create heatmap overlay
    createHeatmapOverlay();
    
    // Create risk zone polygons
    createRiskZonePolygons();
    
    // Create clickable pins
    createRiskPins();
    
    // Add map controls
    addMapControls();
    
    console.log('Map with heatmap initialized successfully');
}

// Create heatmap overlay from ML prediction data
function createHeatmapOverlay() {
    // Convert ML prediction zones to heatmap data points
    const heatmapData = mockData.mlPredictionZones.map(zone => {
        const coordinates = getZoneCoordinates(zone);
        if (!coordinates) return null;
        
        // Calculate center point
        const centerLat = (coordinates[0][0] + coordinates[1][0]) / 2;
        const centerLng = (coordinates[0][1] + coordinates[1][1]) / 2;
        
        return {
            lat: centerLat,
            lng: centerLng,
            intensity: zone.predicted_risk_score // Use risk score as intensity
        };
    }).filter(point => point !== null);
    
    // Create heatmap layer
    heatmapLayer = L.heatLayer(heatmapData, {
        radius: 50,
        blur: 30,
        maxZoom: 10,
        gradient: {
            0.0: '#A5D6A7', // Green for low risk
            0.3: '#A5D6A7',
            0.31: '#FFF176', // Yellow for moderate risk
            0.6: '#FFF176',
            0.61: '#EF5350', // Red for high risk
            1.0: '#EF5350'
        }
    }).addTo(map);
    
    mapLayers.heatmap = heatmapLayer;
}

// Create risk zone polygons
function createRiskZonePolygons() {
    mockData.mlPredictionZones.forEach(zone => {
        const coordinates = getZoneCoordinates(zone);
        if (!coordinates) return;
        
        // Create polygon bounds
        const bounds = [
            [coordinates[0][0], coordinates[0][1]],
            [coordinates[1][0], coordinates[1][1]]
        ];
        
        // Create rectangle polygon
        const polygon = L.rectangle(bounds, {
            color: getRiskColor(zone.predicted_risk_score),
            weight: 2,
            fillColor: getRiskColor(zone.predicted_risk_score),
            fillOpacity: 0.3
        });
        
        // Add click handler
        polygon.on('click', function() {
            showRegionDetails(zone);
        });
        
        // Add tooltip
        polygon.bindTooltip(`
            <div class="zone-tooltip">
                <strong>${zone.river_basin}</strong><br>
                <span class="risk-score ${getRiskClass(zone.predicted_risk_score)}">
                    ${(zone.predicted_risk_score * 100).toFixed(1)}% Risk
                </span><br>
                <small>State: ${zone.state}</small><br>
                <small>Click for detailed insights</small>
            </div>
        `, {
            permanent: false,
            direction: 'top',
            className: 'zone-tooltip'
        });
        
        mapLayers[`zone_${zone.id}`] = polygon;
        polygon.addTo(map);
    });
}

// Create clickable risk pins
function createRiskPins() {
    mockData.mlPredictionZones.forEach(zone => {
        const coordinates = getZoneCoordinates(zone);
        if (!coordinates) return;
        
        // Calculate center point for marker
        const centerLat = (coordinates[0][0] + coordinates[1][0]) / 2;
        const centerLng = (coordinates[0][1] + coordinates[1][1]) / 2;
        
        // Determine color and icon based on risk score
        const riskColor = getRiskColor(zone.predicted_risk_score);
        const riskClass = getRiskClass(zone.predicted_risk_score);
        
        // Create custom icon
        const icon = L.divIcon({
            className: 'custom-marker',
            html: `<div class="marker-pin ${riskClass}" style="background-color: ${riskColor};">
                    <i class="fas fa-map-marker-alt"></i>
                   </div>`,
            iconSize: [30, 30],
            iconAnchor: [15, 30],
            popupAnchor: [0, -30]
        });
        
        // Create marker
        const marker = L.marker([centerLat, centerLng], { icon: icon });
        
        // Add popup on click
        marker.on('click', function() {
            showRegionDetails(zone);
        });
        
        // Add tooltip on hover
        marker.bindTooltip(`
            <div class="marker-tooltip">
                <strong>${zone.river_basin}</strong><br>
                <span class="risk-score ${riskClass}">${(zone.predicted_risk_score * 100).toFixed(1)}% Risk</span><br>
                <small>State: ${zone.state}</small><br>
                <small>Click for detailed insights</small>
            </div>
        `, {
            permanent: false,
            direction: 'top',
            className: 'custom-tooltip'
        });
        
        mapLayers[`pin_${zone.id}`] = marker;
        marker.addTo(map);
    });
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
                <div class="d-flex align-items-center justify-content-center mb-2">
                    <div class="risk-zone risk-low me-2"></div>
                    <span>Low Risk</span>
                </div>
                <small>0.0 - 0.3</small>
            </div>
            <div class="col-md-4 text-center">
                <div class="d-flex align-items-center justify-content-center mb-2">
                    <div class="risk-zone risk-moderate me-2"></div>
                    <span>Moderate Risk</span>
                </div>
                <small>0.31 - 0.6</small>
            </div>
            <div class="col-md-4 text-center">
                <div class="d-flex align-items-center justify-content-center mb-2">
                    <div class="risk-zone risk-high me-2"></div>
                    <span>High Risk</span>
                </div>
                <small>0.61 - 1.0</small>
            </div>
        </div>
        <hr>
        <div class="row">
            <div class="col-md-6">
                <h6><i class="fas fa-fire me-2"></i>Heatmap Overlay</h6>
                <p class="small text-muted">Colored zones show pollution risk intensity across Malaysia</p>
            </div>
            <div class="col-md-6">
                <h6><i class="fas fa-map-marker-alt me-2"></i>Location Pins</h6>
                <p class="small text-muted">Clickable pins for detailed region insights</p>
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
    alertDiv.style.cssText = 'top: 20px; left: 20px; z-index: 9999; max-width: 500px;';
    alertDiv.innerHTML = `
        <h6><i class="fas fa-fire me-2"></i>Heatmap Legend</h6>
        ${legendContent}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.parentNode.removeChild(alertDiv);
        }
    }, 10000);
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