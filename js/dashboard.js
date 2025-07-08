// DebriSense Enhanced Dashboard JavaScript
// Implements comprehensive Leaflet map with heatmap, filters, and interactive features

let map;
let heatmapLayer = null;
let regionPolygons = [];
let dashboardFilters = {
    state: '',
    river: '',
    pollutionTypes: ['Plastic Bottles', 'Plastic Bags', 'Food Wrappers', 'Straws', 'Fishing Gear', 'Others'],
    startDate: '2024-07-01',
    endDate: '2024-10-15'
};

let dashboardInitialized = false;

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (dashboardInitialized) {
        console.log('⚠️ Dashboard already initialized, skipping...');
        return;
    }
    
    dashboardInitialized = true;
    console.log('🚀 Enhanced Dashboard initialized');
    
    // Check for required dependencies
    console.log('📦 Checking dependencies...');
    console.log('Leaflet available:', typeof L !== 'undefined');
    console.log('Heatmap plugin available:', typeof L.heatLayer !== 'undefined');
    console.log('Mock data available:', typeof mockData !== 'undefined');
    
    if (typeof L === 'undefined') {
        console.error('❌ Leaflet library not loaded!');
        return;
    }
    
    if (typeof L.heatLayer === 'undefined') {
        console.warn('⚠️ Heatmap plugin not loaded. Heatmap overlay will not be available.');
    }
    
    // Initialize map after components are loaded
    setTimeout(() => {
        try {
            initializeEnhancedMap();
            setupFilterListeners();
            updateDashboardStats();
            console.log('✅ Enhanced Dashboard setup complete');
        } catch (error) {
            console.error('❌ Enhanced Dashboard initialization failed:', error);
        }
    }, 1000);
});

// Initialize the enhanced interactive map
function initializeEnhancedMap() {
    console.log('🗺️ Initializing enhanced map...');
    
    // Check if map is already initialized and destroy if needed
    if (map) {
        console.log('⚠️ Map already initialized, destroying and recreating...');
        destroyMap();
    }
    
    // Check if map container exists
    const mapContainer = document.getElementById('map');
    if (!mapContainer) {
        console.error('❌ Map container not found!');
        return;
    }
    
    try {
        // Create map centered on Malaysia
        map = L.map('map').setView([4.2105, 108.9758], 6);
        console.log('✅ Map created successfully');
        
        // Add base tile layer with error handling
        const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 18,
            subdomains: 'abc'
        }).addTo(map);
        console.log('✅ Base tile layer added');
        
        // Handle tile loading errors
        tileLayer.on('tileerror', function(e) {
            console.warn('⚠️ Tile loading error:', e);
            map.removeLayer(tileLayer);
            
            // Add fallback tile provider
            L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
                attribution: '© CARTO',
                subdomains: 'abcd',
                maxZoom: 19
            }).addTo(map);
            console.log('✅ Fallback tile layer added');
        });
        
        // Create heatmap overlay
        console.log('🔥 Creating heatmap overlay...');
        createHeatmapOverlay();
        
        // Create clickable region polygons
        console.log('📊 Creating region polygons...');
        createRegionPolygons();
        
        // Add map controls and UI elements
        addMapControls();
        addMapLegend();
        addInfoPanel();
        
        console.log('✅ Enhanced map initialized successfully');
    } catch (error) {
        console.error('❌ Enhanced map initialization failed:', error);
        console.error('Stack trace:', error.stack);
    }
}

// Create heatmap overlay from filtered data
function createHeatmapOverlay() {
    if (typeof L.heatLayer === 'undefined') {
        console.error('❌ Heatmap plugin not available. Falling back to zone polygons only.');
        return;
    }
    
    console.log('🔥 Creating heatmap data points...');
    
    // Get filtered data
    const filteredZones = getFilteredZones();
    
    // Convert zones to heatmap data points
    const heatmapData = filteredZones.map(zone => {
        const coordinates = getZoneCoordinates(zone);
        if (!coordinates) return null;
        
        // Calculate center point
        const centerLat = (coordinates[0][0] + coordinates[1][0]) / 2;
        const centerLng = (coordinates[0][1] + coordinates[1][1]) / 2;
        
        return {
            lat: centerLat,
            lng: centerLng,
            intensity: zone.predicted_risk_score
        };
    }).filter(point => point !== null);
    
    console.log(`✅ Created ${heatmapData.length} heatmap data points`);
    
    try {
        // Remove existing heatmap layer
        if (heatmapLayer) {
            map.removeLayer(heatmapLayer);
        }
        
        // Create new heatmap layer
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
        
        console.log('✅ Heatmap layer created and added to map');
    } catch (error) {
        console.error('❌ Failed to create heatmap layer:', error);
    }
}

// Create clickable region polygons
function createRegionPolygons() {
    // Clear existing polygons
    regionPolygons.forEach(polygon => {
        if (polygon) map.removeLayer(polygon);
    });
    regionPolygons = [];
    
    const filteredZones = getFilteredZones();
    
    filteredZones.forEach(zone => {
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
        
        // Add hover effects
        polygon.on('mouseover', function() {
            this.setStyle({
                weight: 3,
                fillOpacity: 0.5
            });
        });
        
        polygon.on('mouseout', function() {
            this.setStyle({
                weight: 2,
                fillOpacity: 0.3
            });
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
        
        regionPolygons.push(polygon);
        polygon.addTo(map);
    });
    
    console.log(`✅ Created ${regionPolygons.length} region polygons`);
}

// Get filtered zones based on current filters
function getFilteredZones() {
    return mockData.mlPredictionZones.filter(zone => {
        // State filter
        if (dashboardFilters.state && zone.state !== dashboardFilters.state) return false;
        
        // River filter
        if (dashboardFilters.river && zone.river_basin !== dashboardFilters.river) return false;
        
        // Date filter (if implemented)
        // TODO: Implement date filtering based on last_updated
        
        return true;
    });
}

// Setup filter event listeners
function setupFilterListeners() {
    // State filter
    document.getElementById('stateFilter').addEventListener('change', function() {
        dashboardFilters.state = this.value;
        updateFilterStatus();
    });
    
    // River filter
    document.getElementById('riverFilter').addEventListener('change', function() {
        dashboardFilters.river = this.value;
        updateFilterStatus();
    });
    
    // Pollution type filters
    const pollutionCheckboxes = ['plasticBottles', 'plasticBags', 'foodWrappers', 'straws', 'fishingGear', 'others'];
    pollutionCheckboxes.forEach(id => {
        document.getElementById(id).addEventListener('change', function() {
            updatePollutionTypeFilters();
        });
    });
    
    // Date filters
    document.getElementById('startDate').addEventListener('change', function() {
        dashboardFilters.startDate = this.value;
        updateFilterStatus();
    });
    
    document.getElementById('endDate').addEventListener('change', function() {
        dashboardFilters.endDate = this.value;
        updateFilterStatus();
    });
}

// Update pollution type filters
function updatePollutionTypeFilters() {
    dashboardFilters.pollutionTypes = [];
    
    const pollutionTypes = {
        'plasticBottles': 'Plastic Bottles',
        'plasticBags': 'Plastic Bags',
        'foodWrappers': 'Food Wrappers',
        'straws': 'Straws',
        'fishingGear': 'Fishing Gear',
        'others': 'Others'
    };
    
    Object.keys(pollutionTypes).forEach(id => {
        if (document.getElementById(id).checked) {
            dashboardFilters.pollutionTypes.push(pollutionTypes[id]);
        }
    });
    
    updateFilterStatus();
}

// Update filter status display
function updateFilterStatus() {
    const statusElement = document.getElementById('filterStatus');
    const filters = [];
    
    if (dashboardFilters.state) filters.push(dashboardFilters.state);
    if (dashboardFilters.river) filters.push(dashboardFilters.river);
    if (dashboardFilters.pollutionTypes.length < 6) {
        filters.push(`${dashboardFilters.pollutionTypes.length} pollution types`);
    }
    
    if (filters.length > 0) {
        statusElement.textContent = `Filtered: ${filters.join(' | ')}`;
        statusElement.className = 'text-primary';
    } else {
        statusElement.textContent = 'Showing all data';
        statusElement.className = 'text-muted';
    }
}

// Apply map filters
function applyMapFilters() {
    console.log('🔄 Applying map filters...');
    
    try {
        // Update heatmap
        createHeatmapOverlay();
        
        // Update region polygons
        createRegionPolygons();
        
        // Update stats
        updateDashboardStats();
        
        // Update map description
        updateMapDescription();
        
        console.log('✅ Map filters applied successfully');
        
        // Show notification
        DebriSense.showNotification('Map updated with new filters', 'success');
    } catch (error) {
        console.error('❌ Failed to apply map filters:', error);
        DebriSense.showNotification('Failed to apply filters', 'error');
    }
}

// Update map description
function updateMapDescription() {
    const descriptionElement = document.getElementById('mapDescription');
    const filteredZones = getFilteredZones();
    
    if (filteredZones.length === mockData.mlPredictionZones.length) {
        descriptionElement.textContent = 'Interactive heatmap showing pollution risk zones across Malaysia';
    } else {
        descriptionElement.textContent = `Showing ${filteredZones.length} filtered zones across Malaysia`;
    }
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

// Add map legend
function addMapLegend() {
    const legend = L.control({ position: 'bottomright' });
    
    legend.onAdd = function() {
        const div = L.DomUtil.create('div', 'heatmap-legend');
        div.innerHTML = `
            <h6><i class="fas fa-fire me-2"></i>Risk Legend</h6>
            <div class="legend-gradient"></div>
            <div class="legend-labels">
                <span>Low</span>
                <span>Medium</span>
                <span>High</span>
            </div>
        `;
        return div;
    };
    
    legend.addTo(map);
}

// Add info panel
function addInfoPanel() {
    const infoPanel = L.control({ position: 'topleft' });
    
    infoPanel.onAdd = function() {
        const div = L.DomUtil.create('div', 'map-info-panel');
        div.innerHTML = `
            <strong>DebriSense</strong><br>
            <small>Data: ${mockData.mlPredictionZones.length} zones</small><br>
            <small>Updated: ${new Date().toLocaleDateString()}</small>
        `;
        return div;
    };
    
    infoPanel.addTo(map);
}

// Show region details in enhanced modal
function showRegionDetails(zone) {
    console.log('📊 Showing region details for:', zone.river_basin);
    
    // Get recent cleanup reports for this region
    const recentReports = mockData.cleanupReports.filter(report => 
        report.state === zone.state || report.river === zone.river_basin
    ).slice(0, 3);
    
    // Get pollution observations for this region
    const observations = mockData.pollutionObservations.filter(obs => 
        obs.state === zone.state || obs.river === zone.river_basin
    ).slice(0, 2);
    
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
        
        ${recentReports.length > 0 ? `
        <div class="row mt-3">
            <div class="col-12">
                <h6>Recent Cleanup Activity</h6>
                ${recentReports.map(report => `
                    <div class="mb-2 p-2 bg-light rounded">
                        <strong>${report.location}</strong><br>
                        <small class="text-muted">
                            ${new Date(report.date).toLocaleDateString()} - 
                            ${report.submitted_by} (${getTotalItems(report.plastic_items)} items)
                        </small>
                    </div>
                `).join('')}
            </div>
        </div>
        ` : ''}
        
        ${observations.length > 0 ? `
        <div class="row mt-3">
            <div class="col-12">
                <h6>Recent Observations</h6>
                ${observations.map(obs => `
                    <div class="mb-2 p-2 bg-light rounded">
                        <strong>${obs.pollution_type}</strong><br>
                        <small class="text-muted">
                            ${new Date(obs.date).toLocaleDateString()} - 
                            ${obs.observer_name}
                        </small><br>
                        <small>${obs.notes}</small>
                    </div>
                `).join('')}
            </div>
        </div>
        ` : ''}
    `;
    
    document.getElementById('regionDetailsContent').innerHTML = modalContent;
    
    const modal = new bootstrap.Modal(document.getElementById('regionDetailsModal'));
    modal.show();
}

// Get coordinates for a zone (placeholder implementation)
function getZoneCoordinates(zone) {
    // TODO: Replace with real GeoJSON coordinates
    // For now, create simple rectangles based on state
    const stateCoordinates = {
        // West Coast States
        'Selangor': [[2.5, 101.0], [3.5, 102.0]],
        'Penang': [[5.0, 100.0], [5.5, 100.5]],
        'Perak': [[3.5, 100.5], [5.0, 101.5]],
        'Kedah': [[5.5, 100.0], [6.5, 101.0]],
        'Perlis': [[6.5, 100.0], [6.8, 100.3]],
        'Negeri Sembilan': [[2.5, 101.5], [3.0, 102.5]],
        'Melaka': [[2.0, 102.0], [2.5, 102.5]],
        'Kuala Lumpur': [[3.0, 101.5], [3.2, 101.8]],
        'Putrajaya': [[2.8, 101.6], [3.0, 101.8]],
        
        // East Coast States
        'Johor': [[1.0, 103.0], [2.5, 104.5]],
        'Pahang': [[2.5, 102.5], [4.5, 104.0]],
        'Terengganu': [[4.0, 102.5], [5.5, 103.5]],
        'Kelantan': [[5.5, 101.5], [6.5, 102.5]],
        
        // East Malaysia
        'Sabah': [[4.0, 115.0], [7.0, 119.0]],
        'Sarawak': [[1.0, 109.0], [5.0, 115.0]],
        'Labuan': [[5.2, 115.0], [5.4, 115.3]]
    };
    
    return stateCoordinates[zone.state] || null;
}

// Get color based on risk score
function getRiskColor(riskScore) {
    if (riskScore <= 0.3) return '#A5D6A7'; // Low risk - green
    if (riskScore <= 0.6) return '#FFF176'; // Moderate risk - yellow
    return '#EF5350'; // High risk - red
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

// Get total items from plastic items object
function getTotalItems(plasticItems) {
    return Object.values(plasticItems).reduce((sum, count) => sum + count, 0);
}

// Update dashboard stats
function updateDashboardStats() {
    const filteredZones = getFilteredZones();
    const filteredReports = mockData.cleanupReports.filter(report => {
        if (dashboardFilters.state && report.state !== dashboardFilters.state) return false;
        if (dashboardFilters.river && report.river !== dashboardFilters.river) return false;
        return true;
    });
    
    // Update stats
    document.getElementById('totalZones').textContent = filteredZones.length;
    document.getElementById('totalReports').textContent = filteredReports.length;
    document.getElementById('dataPoints').textContent = `${filteredZones.length} zones`;
    document.getElementById('lastUpdated').textContent = new Date().toLocaleString();
    document.getElementById('currentSeason').textContent = 'Northeast Monsoon';
    
    // Update console with data summary
    console.log(`📊 Dashboard Stats: ${filteredZones.length} zones, ${filteredReports.length} cleanup reports, ${mockData.pollutionObservations.length} observations`);
    console.log(`🗺️ Map Coverage: ${mockData.states.length} states, ${mockData.rivers.length} major rivers`);
}

// Export map data
function exportMapData() {
    const dataToExport = {
        timestamp: new Date().toISOString(),
        filters: dashboardFilters,
        zones: getFilteredZones(),
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
                <h6><i class="fas fa-map-marker-alt me-2"></i>Clickable Regions</h6>
                <p class="small text-muted">Click on zones for detailed insights and cleanup data</p>
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
        <h6><i class="fas fa-fire me-2"></i>Enhanced Map Legend</h6>
        ${legendContent}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.parentNode.removeChild(alertDiv);
        }
    }, 12000);
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

// Cleanup function to destroy map
function destroyMap() {
    if (map) {
        console.log('🗑️ Destroying existing map...');
        map.remove();
        map = null;
        heatmapLayer = null;
        regionPolygons = [];
    }
}

// Export functions for global use
window.dashboardFunctions = {
    showRegionDetails,
    viewRegionInsights,
    exportMapData,
    showMapLegend,
    applyMapFilters,
    destroyMap
};

// Make applyMapFilters globally available
window.applyMapFilters = applyMapFilters; 