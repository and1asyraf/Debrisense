// DebriSense Enhanced Dashboard JavaScript
// Implements comprehensive Leaflet map with heatmap, filters, and interactive features

let map;
let riverMarkers = [];
let dashboardFilters = {
    state: '',
    river: '',
    pollutionTypes: ['Plastic Bottles', 'Plastic Bags', 'Food Wrappers', 'Straws', 'Cigarette Butts', 'Fishing Gear'],
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
        
        // Create river location markers
        console.log('📍 Creating river location markers...');
        createRiverMarkers();
        
        // Add map controls and UI elements
        addMapControls();
        addMapLegend();
        addInfoPanel();
        
        // Add zoom event listener to update marker sizes
        map.on('zoomend', function() {
            updateMarkerSizes();
        });
        
        console.log('✅ Enhanced map initialized successfully');
    } catch (error) {
        console.error('❌ Enhanced map initialization failed:', error);
        console.error('Stack trace:', error.stack);
    }
}

// Create river location markers
function createRiverMarkers() {
    console.log('📍 Creating river location markers...');
    
    // Clear existing markers
    clearRiverMarkers();
    
    // Get river coordinates from mock data
    const riverData = mockData.riverCoordinates || [];
    console.log('River data available:', riverData.length, 'rivers');
    console.log('Sample river data:', riverData[0]);
    
    // Filter rivers based on current filters
    const filteredRivers = filterRivers(riverData);
    
    console.log(`📍 Creating ${filteredRivers.length} river markers`);
    console.log('Filtered rivers:', filteredRivers.map(r => r.name));
    
    filteredRivers.forEach(river => {
        try {
            console.log(`Creating marker for ${river.name} at coordinates:`, river.coordinates);
            
            // Get river risk data
            const riverRiskData = getRiverRiskData(river.name);
            console.log(`Risk data for ${river.name}:`, riverRiskData);
            
            // Create custom marker icon based on risk level
            const markerIcon = createRiverMarkerIcon(riverRiskData.riskScore);
            console.log(`Created icon for ${river.name}:`, markerIcon);
            
            // Create marker
            const marker = L.marker(river.coordinates, {
                icon: markerIcon,
                title: river.name
            }).addTo(map);
            console.log(`Added marker to map for ${river.name}`);
            
            // Create tooltip content (for hover)
            const tooltipContent = createRiverTooltipContent(river, riverRiskData);
            
            // Add tooltip to marker (appears on hover)
            marker.bindTooltip(tooltipContent, {
                direction: 'top',
                offset: [0, -10],
                className: 'river-tooltip',
                permanent: false
            });
            
            // Add click event to show detailed insights
            marker.on('click', function() {
                showRiverInsights(river, riverRiskData);
            });
            
            // Store marker reference
            riverMarkers.push(marker);
            
        } catch (error) {
            console.error(`❌ Failed to create marker for ${river.name}:`, error);
            console.error('Error details:', error.message, error.stack);
        }
    });
    
    console.log(`✅ Created ${riverMarkers.length} river markers successfully`);
    console.log('All markers:', riverMarkers);
}

// Clear all river markers
function clearRiverMarkers() {
    riverMarkers.forEach(marker => {
        if (map.hasLayer(marker)) {
            map.removeLayer(marker);
        }
    });
    riverMarkers = [];
}

// Filter rivers based on current dashboard filters
function filterRivers(riverData) {
    let filtered = riverData;
    
    // Filter by state
    if (dashboardFilters.state) {
        filtered = filtered.filter(river => river.state === dashboardFilters.state);
    }
    
    // Filter by river name
    if (dashboardFilters.river) {
        filtered = filtered.filter(river => river.name === dashboardFilters.river);
    }
    
    return filtered;
}

// Get risk data for a specific river
function getRiverRiskData(riverName) {
    // Find zones for this river
    const riverZones = mockData.mlPredictionZones.filter(zone => zone.river_basin === riverName);
    
    if (riverZones.length === 0) {
        return {
            riskScore: 0.0,
            pollutionTypes: [],
            totalReports: 0,
            lastUpdated: new Date().toISOString()
        };
    }
    
    // Calculate average risk score
    const avgRiskScore = riverZones.reduce((sum, zone) => sum + zone.predicted_risk_score, 0) / riverZones.length;
    
    // Get unique pollution types
    const pollutionTypes = [...new Set(riverZones.flatMap(zone => zone.top_pollution_types))];
    
    // Get cleanup reports for this river
    const reports = mockData.cleanupReports.filter(report => report.river === riverName);
    
    return {
        riskScore: avgRiskScore,
        pollutionTypes: pollutionTypes,
        totalReports: reports.length,
        lastUpdated: riverZones[0].last_updated
    };
}

// Create custom marker icon based on risk level
function createRiverMarkerIcon(riskScore) {
    let color, iconClass;
    
    if (riskScore >= 0.6) {
        color = '#EF5350'; // Red for high risk
        iconClass = 'fas fa-exclamation-triangle';
    } else if (riskScore >= 0.3) {
        color = '#FFF176'; // Yellow for moderate risk
        iconClass = 'fas fa-exclamation-circle';
    } else {
        color = '#A5D6A7'; // Green for low risk
        iconClass = 'fas fa-check-circle';
    }
    
    return L.divIcon({
        html: `<i class="${iconClass}" style="color: ${color}; font-size: 24px; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);"></i>`,
        className: 'river-marker-icon',
        iconSize: [30, 30],
        iconAnchor: [15, 15]
    });
}

// Create popup content for river marker
function createRiverPopupContent(river, riskData) {
    const riskLevel = riskData.riskScore >= 0.6 ? 'High' : riskData.riskScore >= 0.3 ? 'Moderate' : 'Low';
    const riskColor = riskData.riskScore >= 0.6 ? '#EF5350' : riskData.riskScore >= 0.3 ? '#FFF176' : '#A5D6A7';
    
    return `
        <div class="river-popup-content">
            <h6 style="margin-bottom: 8px; color: #2E7D32;">
                <i class="fas fa-water me-2"></i>${river.name}
            </h6>
            <p style="margin-bottom: 8px; font-size: 12px; color: #666;">
                ${river.description}
            </p>
            <div style="margin-bottom: 8px;">
                <span style="background-color: ${riskColor}; color: white; padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: bold;">
                    ${riskLevel} Risk (${(riskData.riskScore * 100).toFixed(0)}%)
                </span>
            </div>
            <div style="font-size: 11px; color: #666;">
                <div><strong>Reports:</strong> ${riskData.totalReports}</div>
                <div><strong>State:</strong> ${river.state}</div>
            </div>
                         <button class="btn btn-sm btn-primary mt-2" onclick="window.showRiverInsights('${river.name}')">
                 <i class="fas fa-chart-line me-1"></i>View Insights
             </button>
        </div>
    `;
}

// Create tooltip content for river marker (appears on hover)
function createRiverTooltipContent(river, riskData) {
    const riskLevel = riskData.riskScore >= 0.6 ? 'High' : riskData.riskScore >= 0.3 ? 'Moderate' : 'Low';
    const riskColor = riskData.riskScore >= 0.6 ? '#EF5350' : riskData.riskScore >= 0.3 ? '#FFF176' : '#A5D6A7';
    
    return `
        <div class="river-tooltip-content">
            <h6 style="margin-bottom: 8px; color: #2E7D32;">
                <i class="fas fa-water me-2"></i>${river.name}
            </h6>
            <p style="margin-bottom: 8px; font-size: 12px; color: #666;">
                ${river.description}
            </p>
            <div style="margin-bottom: 8px;">
                <span style="background-color: ${riskColor}; color: white; padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: bold;">
                    ${riskLevel} Risk (${(riskData.riskScore * 100).toFixed(0)}%)
                </span>
            </div>
            <div style="font-size: 11px; color: #666;">
                <div><strong>Reports:</strong> ${riskData.totalReports}</div>
                <div><strong>State:</strong> ${river.state}</div>
            </div>
            <div style="margin-top: 8px; font-size: 11px; color: #007bff;">
                <i class="fas fa-mouse-pointer me-1"></i>Click for detailed insights
            </div>
        </div>
    `;
}

// Global variables for modal functionality
let currentRiverData = null;
let currentRiskData = null;
let currentChart = null;

// Show detailed river insights modal
function showRiverInsights(river, riskData) {
    console.log('📊 Showing insights for:', river.name || river);
    console.log('River Data:', river);
    console.log('Risk Data:', riskData);
    
    // Store current data globally
    currentRiverData = typeof river === 'string' ? { name: river } : river;
    currentRiskData = riskData || {
        riskScore: 0.0,
        pollutionTypes: [],
        totalReports: 0,
        lastUpdated: new Date().toISOString()
    };
    
    // Update modal title
    document.getElementById('riverModalTitle').textContent = currentRiverData.name;
    
    // Generate modal content
    const modalContent = generateRiverInsightsContent(currentRiverData, currentRiskData);
    document.getElementById('riverInsightsContent').innerHTML = modalContent;
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('riverInsightsModal'));
    modal.show();
}

// Generate comprehensive river insights content
function generateRiverInsightsContent(river, riskData) {
    const riskLevel = riskData.riskScore >= 0.6 ? 'High' : riskData.riskScore >= 0.3 ? 'Moderate' : 'Low';
    const riskClass = riskData.riskScore >= 0.6 ? 'high' : riskData.riskScore >= 0.3 ? 'moderate' : 'low';
    
    // Get recent cleanup activities
    const recentActivities = getRecentActivities(river.name);
    
    // Get pollution types data
    const pollutionData = getPollutionData(river.name);
    
    return `
        <div class="river-insights-header">
            <div class="row">
                <div class="col-md-8">
                    <h4><i class="fas fa-water me-2"></i>${river.name}</h4>
                    <p class="text-muted mb-0">${river.description || 'Major river in Malaysia'}</p>
                    <p class="text-muted mb-0"><strong>State:</strong> ${river.state || 'Multiple states'}</p>
                </div>
                <div class="col-md-4">
                    <div class="risk-score-display">
                        <h5>Risk Score</h5>
                        <div class="risk-progress">
                            <div class="risk-progress-bar ${riskClass}" style="width: ${riskData.riskScore * 100}%"></div>
                        </div>
                        <h3 class="text-${riskClass === 'high' ? 'danger' : riskClass === 'moderate' ? 'warning' : 'success'}">
                            ${(riskData.riskScore * 100).toFixed(1)}%
                        </h3>
                        <span class="badge bg-${riskClass === 'high' ? 'danger' : riskClass === 'moderate' ? 'warning' : 'success'}">
                            ${riskLevel} Risk
                        </span>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-number">${riskData.totalReports}</div>
                <div class="stat-label">Cleanup Reports</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${riskData.pollutionTypes.length}</div>
                <div class="stat-label">Pollution Types</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${getAverageRiskScore(river.name).toFixed(1)}%</div>
                <div class="stat-label">Avg Risk (30 days)</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${getLastCleanupDays(river.name)}</div>
                <div class="stat-label">Days Since Last Cleanup</div>
            </div>
        </div>
        
        <div class="row">
            <div class="col-md-6">
                <div class="recent-activities">
                    <h6><i class="fas fa-history me-2"></i>Recent Activities</h6>
                    ${recentActivities.length > 0 ? 
                        recentActivities.map(activity => `
                            <div class="activity-item">
                                <div class="activity-title">${activity.title}</div>
                                <div class="activity-details">${activity.details}</div>
                                <div class="activity-date">${activity.date}</div>
                            </div>
                        `).join('') : 
                        '<p class="text-muted">No recent activities recorded</p>'
                    }
                </div>
            </div>
            <div class="col-md-6">
                <div class="recent-activities">
                    <h6><i class="fas fa-trash me-2"></i>Pollution Types Found</h6>
                    <div class="pollution-types">
                        ${riskData.pollutionTypes.length > 0 ? 
                            riskData.pollutionTypes.map(type => `
                                <span class="pollution-tag">${type}</span>
                            `).join('') : 
                            '<p class="text-muted">No pollution data available</p>'
                        }
                    </div>
                    <div class="mt-3">
                        <h6>Historical Trends</h6>
                        <p class="text-muted">Risk levels have been ${getTrendDescription(river.name)} over the past 3 months.</p>
                        <small class="text-muted">Last updated: ${new Date(riskData.lastUpdated).toLocaleDateString()}</small>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Helper functions for modal data
function getRecentActivities(riverName) {
    const reports = mockData.cleanupReports.filter(report => report.river === riverName);
    return reports.slice(0, 3).map(report => ({
        title: `Cleanup at ${report.location}`,
        details: `${getTotalItems(report.plastic_items)} items collected by ${report.submitted_by}`,
        date: new Date(report.date).toLocaleDateString()
    }));
}

function getPollutionData(riverName) {
    const zones = mockData.mlPredictionZones.filter(zone => zone.river_basin === riverName);
    return zones.length > 0 ? zones[0].top_pollution_types : [];
}

function getAverageRiskScore(riverName) {
    const zones = mockData.mlPredictionZones.filter(zone => zone.river_basin === riverName);
    if (zones.length === 0) return 0;
    const avgScore = zones.reduce((sum, zone) => sum + zone.predicted_risk_score, 0) / zones.length;
    return avgScore * 100;
}

function getLastCleanupDays(riverName) {
    const reports = mockData.cleanupReports.filter(report => report.river === riverName);
    if (reports.length === 0) return 'N/A';
    const lastReport = reports.sort((a, b) => new Date(b.date) - new Date(a.date))[0];
    const daysDiff = Math.floor((new Date() - new Date(lastReport.date)) / (1000 * 60 * 60 * 24));
    return daysDiff;
}

function getTrendDescription(riverName) {
    const zones = mockData.mlPredictionZones.filter(zone => zone.river_basin === riverName);
    if (zones.length === 0) return 'stable';
    const avgScore = zones.reduce((sum, zone) => sum + zone.predicted_risk_score, 0) / zones.length;
    if (avgScore > 0.6) return 'increasing';
    if (avgScore < 0.3) return 'decreasing';
    return 'stable';
}

// Update marker sizes based on zoom level
function updateMarkerSizes() {
    const zoomLevel = map.getZoom();
    const baseSize = Math.max(20, 30 - (zoomLevel - 6) * 2);
    
    riverMarkers.forEach(marker => {
        const icon = marker.getIcon();
        icon.options.iconSize = [baseSize, baseSize];
        icon.options.iconAnchor = [baseSize/2, baseSize/2];
        marker.setIcon(icon);
    });
}

// Create precise river basin shapes based on actual river geography
function createRiverBasinShape(centerLat, centerLng, baseSize, riverName) {
    // Define specific river basin shapes for major Malaysian rivers
    const riverShapes = {
        'Sungai Klang': {
            // Klang River - follows the river course from KL to Port Klang
            points: [
                [centerLat - 0.1, centerLng - 0.05],
                [centerLat - 0.08, centerLng - 0.03],
                [centerLat - 0.05, centerLng - 0.02],
                [centerLat - 0.02, centerLng - 0.01],
                [centerLat, centerLng],
                [centerLat + 0.02, centerLng + 0.01],
                [centerLat + 0.05, centerLng + 0.02],
                [centerLat + 0.08, centerLng + 0.03],
                [centerLat + 0.1, centerLng + 0.05],
                [centerLat + 0.08, centerLng + 0.08],
                [centerLat + 0.05, centerLng + 0.1],
                [centerLat, centerLng + 0.12],
                [centerLat - 0.05, centerLng + 0.1],
                [centerLat - 0.08, centerLng + 0.08],
                [centerLat - 0.1, centerLng + 0.05]
            ],
            scale: 0.8
        },
        'Sungai Pinang': {
            // Penang River - follows the river in Penang
            points: [
                [centerLat - 0.05, centerLng - 0.03],
                [centerLat - 0.03, centerLng - 0.02],
                [centerLat - 0.01, centerLng - 0.01],
                [centerLat, centerLng],
                [centerLat + 0.01, centerLng + 0.01],
                [centerLat + 0.03, centerLng + 0.02],
                [centerLat + 0.05, centerLng + 0.03],
                [centerLat + 0.03, centerLng + 0.05],
                [centerLat, centerLng + 0.06],
                [centerLat - 0.03, centerLng + 0.05],
                [centerLat - 0.05, centerLng + 0.03]
            ],
            scale: 0.6
        },
        'Sungai Perak': {
            // Perak River - longer river basin
            points: [
                [centerLat - 0.15, centerLng - 0.08],
                [centerLat - 0.12, centerLng - 0.05],
                [centerLat - 0.08, centerLng - 0.03],
                [centerLat - 0.04, centerLng - 0.01],
                [centerLat, centerLng],
                [centerLat + 0.04, centerLng + 0.01],
                [centerLat + 0.08, centerLng + 0.03],
                [centerLat + 0.12, centerLng + 0.05],
                [centerLat + 0.15, centerLng + 0.08],
                [centerLat + 0.12, centerLng + 0.12],
                [centerLat + 0.08, centerLng + 0.15],
                [centerLat, centerLng + 0.18],
                [centerLat - 0.08, centerLng + 0.15],
                [centerLat - 0.12, centerLng + 0.12],
                [centerLat - 0.15, centerLng + 0.08]
            ],
            scale: 1.0
        },
        'Sungai Johor': {
            // Johor River - southern river basin
            points: [
                [centerLat - 0.08, centerLng - 0.04],
                [centerLat - 0.06, centerLng - 0.02],
                [centerLat - 0.03, centerLng - 0.01],
                [centerLat, centerLng],
                [centerLat + 0.03, centerLng + 0.01],
                [centerLat + 0.06, centerLng + 0.02],
                [centerLat + 0.08, centerLng + 0.04],
                [centerLat + 0.06, centerLng + 0.06],
                [centerLat, centerLng + 0.08],
                [centerLat - 0.06, centerLng + 0.06],
                [centerLat - 0.08, centerLng + 0.04]
            ],
            scale: 0.7
        }
    };
    
    const riverConfig = riverShapes[riverName];
    if (!riverConfig) {
        // For rivers without specific shapes, create a small, precise oval
        return createPreciseOval(centerLat, centerLng, baseSize * 0.3);
    }
    
    // Scale the river shape based on zoom and river size
    const zoomLevel = map.getZoom();
    const zoomFactor = Math.max(0.1, 1 - (zoomLevel - 6) * 0.15);
    const finalScale = riverConfig.scale * zoomFactor;
    
    return riverConfig.points.map(point => [
        centerLat + (point[0] * finalScale),
        centerLng + (point[1] * finalScale)
    ]);
}

// Create precise oval shape for smaller areas
function createPreciseOval(centerLat, centerLng, size) {
    const points = [];
    const numPoints = 12;
    const latRadius = size / 111000; // Convert to degrees
    const lngRadius = size / (111000 * Math.cos(centerLat * Math.PI / 180));
    
    for (let i = 0; i < numPoints; i++) {
        const angle = (i / numPoints) * 2 * Math.PI;
        const lat = centerLat + (latRadius * Math.cos(angle));
        const lng = centerLng + (lngRadius * Math.sin(angle));
        points.push([lat, lng]);
    }
    
    return points;
}

// Create clickable region polygons with overlap prevention
function createRegionPolygons() {
    // Clear existing polygons
    regionPolygons.forEach(polygon => {
        if (polygon) map.removeLayer(polygon);
    });
    regionPolygons = [];
    
    const filteredZones = getFilteredZones();
    
    // Group nearby zones to prevent overlap
    const groupedZones = groupNearbyZones(filteredZones);
    
    groupedZones.forEach(zone => {
        const coordinates = getZoneCoordinates(zone);
        if (!coordinates) return;
        
        // Use combined zone center if available
        const centerLat = zone.center_lat || (coordinates[0][0] + coordinates[1][0]) / 2;
        const centerLng = zone.center_lng || (coordinates[0][1] + coordinates[1][1]) / 2;
        const latDiff = Math.abs(coordinates[1][0] - coordinates[0][0]);
        const lngDiff = Math.abs(coordinates[1][1] - coordinates[0][1]);
        
        // Create much smaller, more precise boundaries
        const zoomLevel = map.getZoom();
        const zoomFactor = Math.max(0.05, 1 - (zoomLevel - 6) * 0.2); // Even more aggressive scaling
        const baseSize = Math.min(latDiff, lngDiff) * 10000; // Much smaller base size
        const adjustedSize = baseSize * zoomFactor;
        
        // Create precise river basin shapes
        const riverShape = createRiverBasinShape(centerLat, centerLng, adjustedSize, zone.river_basin);
        
        let polygon;
        if (riverShape) {
            // Use precise river basin shape
            polygon = L.polygon(riverShape, {
                color: getRiskColor(zone.predicted_risk_score),
                weight: 1.5,
                fillColor: getRiskColor(zone.predicted_risk_score),
                fillOpacity: 0.5
            });
        } else {
            // Fallback to very small circle
            const smallRadius = Math.max(2000, adjustedSize * 0.2); // Very small circles
            polygon = L.circle([centerLat, centerLng], {
                radius: smallRadius,
                color: getRiskColor(zone.predicted_risk_score),
                weight: 1.5,
                fillColor: getRiskColor(zone.predicted_risk_score),
                fillOpacity: 0.5
            });
        }
        
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
        
        // Add tooltip with combined zone info
        const tooltipContent = zone.combined_zones ? 
            `<div class="zone-tooltip">
                <strong>${zone.river_basin}</strong><br>
                <span class="risk-score ${getRiskClass(zone.predicted_risk_score)}">
                    ${(zone.predicted_risk_score * 100).toFixed(1)}% Risk
                </span><br>
                <small>Combined: ${zone.combined_zones.length} zones</small><br>
                <small>State: ${zone.state}</small><br>
                <small>Click for detailed insights</small>
            </div>` :
            `<div class="zone-tooltip">
                <strong>${zone.river_basin}</strong><br>
                <span class="risk-score ${getRiskClass(zone.predicted_risk_score)}">
                    ${(zone.predicted_risk_score * 100).toFixed(1)}% Risk
                </span><br>
                <small>State: ${zone.state}</small><br>
                <small>Click for detailed insights</small>
            </div>`;
        
        polygon.bindTooltip(tooltipContent, {
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
        // Update river markers
        createRiverMarkers();
        
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
    const riverData = mockData.riverCoordinates || [];
    const filteredRivers = filterRivers(riverData);
    
    if (filteredRivers.length === riverData.length) {
        descriptionElement.textContent = 'Interactive map showing river locations with pollution risk insights. Click on markers for detailed information.';
    } else {
        descriptionElement.textContent = `Showing ${filteredRivers.length} filtered rivers with pollution risk insights. Click on markers for detailed information.`;
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
            <small>Updated: ${new Date().toLocaleDateString()}</small><br>
            <small id="zoom-info">Zoom: <span id="zoom-level">6</span> | Shapes: <span id="shape-scale">100%</span></small>
        `;
        return div;
    };
    
    infoPanel.addTo(map);
    
    // Update zoom info when zoom changes
    map.on('zoomend', function() {
        const zoomLevel = map.getZoom();
        const zoomFactor = Math.max(0.3, 1 - (zoomLevel - 6) * 0.1);
        const scalePercent = Math.round(zoomFactor * 100);
        
        const zoomLevelElement = document.getElementById('zoom-level');
        const shapeScaleElement = document.getElementById('shape-scale');
        
        if (zoomLevelElement) zoomLevelElement.textContent = zoomLevel;
        if (shapeScaleElement) shapeScaleElement.textContent = `${scalePercent}%`;
    });
}

// Show region details in enhanced modal
function showRegionDetails(zone) {
    console.log('📊 Showing region details for:', zone.river_basin);
    
    // Handle combined zones
    const zonesToCheck = zone.combined_zones || [zone];
    const allRivers = zonesToCheck.map(z => z.river_basin);
    const allStates = zonesToCheck.map(z => z.state);
    
    // Get recent cleanup reports for this region
    const recentReports = mockData.cleanupReports.filter(report => 
        allStates.includes(report.state) || allRivers.includes(report.river)
    ).slice(0, 3);
    
    // Get pollution observations for this region
    const observations = mockData.pollutionObservations.filter(obs => 
        allStates.includes(obs.state) || allRivers.includes(obs.river)
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
                    ${zone.combined_zones ? `
                    <tr>
                        <td><strong>Combined Zones:</strong></td>
                        <td>${zone.combined_zones.length} areas</td>
                    </tr>
                    ` : ''}
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
                <p class="small text-muted">Organic shapes show pollution risk intensity across Malaysia</p>
            </div>
            <div class="col-md-6">
                <h6><i class="fas fa-map-marker-alt me-2"></i>Clickable Regions</h6>
                <p class="small text-muted">Click on organic zones for detailed insights and cleanup data</p>
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

// Update polygon sizes based on zoom level
function updatePolygonSizes() {
    if (!map || regionPolygons.length === 0) return;
    
    const zoomLevel = map.getZoom();
    const zoomFactor = Math.max(0.3, 1 - (zoomLevel - 6) * 0.1); // Scale down as zoom increases
    
    console.log(`🔄 Updating polygon sizes for zoom level ${zoomLevel} (factor: ${zoomFactor.toFixed(2)})`);
    
    // Get the original filtered zones to recalculate sizes
    const filteredZones = getFilteredZones();
    
    regionPolygons.forEach((polygon, index) => {
        if (!polygon || index >= filteredZones.length) return;
        
        const zone = filteredZones[index];
        const coordinates = getZoneCoordinates(zone);
        if (!coordinates) return;
        
        // Calculate center point and base radius
        const centerLat = (coordinates[0][0] + coordinates[1][0]) / 2;
        const centerLng = (coordinates[0][1] + coordinates[1][1]) / 2;
        const latDiff = Math.abs(coordinates[1][0] - coordinates[0][0]);
        const lngDiff = Math.abs(coordinates[1][1] - coordinates[0][1]);
        const baseRadius = Math.max(latDiff, lngDiff) * 50000;
        const adjustedRadius = baseRadius * zoomFactor;
        
        // Update polygon size based on its type
        if (polygon.getRadius) {
            // It's a circle - make it much smaller
            const smallRadius = Math.max(5000, adjustedSize * 0.3);
            polygon.setRadius(smallRadius);
        } else {
            // It's a polygon - recreate it with new river basin shape
            const riverShape = createRiverBasinShape(centerLat, centerLng, adjustedSize, zone.river_basin);
            const newPolygon = L.polygon(riverShape, {
                color: getRiskColor(zone.predicted_risk_score),
                weight: 1.5,
                fillColor: getRiskColor(zone.predicted_risk_score),
                fillOpacity: 0.4
            });
            
            // Copy event handlers from old polygon
            if (polygon._events) {
                Object.keys(polygon._events).forEach(eventType => {
                    polygon._events[eventType].forEach(handler => {
                        newPolygon.on(eventType, handler.fn);
                    });
                });
            }
            
            // Replace old polygon with new one
            map.removeLayer(polygon);
            newPolygon.addTo(map);
            regionPolygons[index] = newPolygon;
        }
    });
    
    console.log(`✅ Updated ${regionPolygons.length} polygon sizes`);
}

// Update heatmap size based on zoom level
function updateHeatmapSize() {
    if (!map || !heatmapLayer) return;
    
    const zoomLevel = map.getZoom();
    const heatmapRadius = Math.max(8, 25 - (zoomLevel - 6) * 3); // Much smaller radius
    const heatmapBlur = Math.max(4, 15 - (zoomLevel - 6) * 2); // Much smaller blur
    
    console.log(`🔥 Updating heatmap size for zoom level ${zoomLevel} (radius: ${heatmapRadius}, blur: ${heatmapBlur})`);
    
    // Remove current heatmap and recreate with new size
    map.removeLayer(heatmapLayer);
    
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
    
    // Create new heatmap layer with updated size
    heatmapLayer = L.heatLayer(heatmapData, {
        radius: heatmapRadius,
        blur: heatmapBlur,
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
    
    console.log(`✅ Updated heatmap size`);
}

// Group nearby zones to prevent overlap
function groupNearbyZones(zones) {
    const grouped = [];
    const processed = new Set();
    
    zones.forEach((zone, index) => {
        if (processed.has(index)) return;
        
        const coordinates = getZoneCoordinates(zone);
        if (!coordinates) return;
        
        const centerLat = (coordinates[0][0] + coordinates[1][0]) / 2;
        const centerLng = (coordinates[0][1] + coordinates[1][1]) / 2;
        
        // Find nearby zones (within 0.1 degrees)
        const nearbyZones = [zone];
        const nearbyIndices = [index];
        
        zones.forEach((otherZone, otherIndex) => {
            if (otherIndex === index || processed.has(otherIndex)) return;
            
            const otherCoordinates = getZoneCoordinates(otherZone);
            if (!otherCoordinates) return;
            
            const otherCenterLat = (otherCoordinates[0][0] + otherCoordinates[1][0]) / 2;
            const otherCenterLng = (otherCoordinates[0][1] + otherCoordinates[1][1]) / 2;
            
            const distance = Math.sqrt(
                Math.pow(centerLat - otherCenterLat, 2) + 
                Math.pow(centerLng - otherCenterLng, 2)
            );
            
            if (distance < 0.1) { // 0.1 degrees threshold
                nearbyZones.push(otherZone);
                nearbyIndices.push(otherIndex);
            }
        });
        
        // Mark all nearby zones as processed
        nearbyIndices.forEach(i => processed.add(i));
        
        // If multiple zones are nearby, create a combined zone
        if (nearbyZones.length > 1) {
            const combinedZone = createCombinedZone(nearbyZones);
            grouped.push(combinedZone);
        } else {
            grouped.push(zone);
        }
    });
    
    return grouped;
}

// Create a combined zone from multiple nearby zones
function createCombinedZone(zones) {
    // Calculate average center and highest risk score
    let totalLat = 0, totalLng = 0, maxRisk = 0;
    let allRivers = [];
    
    zones.forEach(zone => {
        const coordinates = getZoneCoordinates(zone);
        if (coordinates) {
            const centerLat = (coordinates[0][0] + coordinates[1][0]) / 2;
            const centerLng = (coordinates[0][1] + coordinates[1][1]) / 2;
            totalLat += centerLat;
            totalLng += centerLng;
        }
        maxRisk = Math.max(maxRisk, zone.predicted_risk_score);
        allRivers.push(zone.river_basin);
    });
    
    const avgLat = totalLat / zones.length;
    const avgLng = totalLng / zones.length;
    
    return {
        ...zones[0], // Use first zone as template
        river_basin: allRivers.join(' + '),
        predicted_risk_score: maxRisk,
        combined_zones: zones,
        center_lat: avgLat,
        center_lng: avgLng
    };
}

// Store placed marker positions to prevent overlap
let placedMarkerPositions = [];

function resetPlacedMarkerPositions() {
    placedMarkerPositions = [];
}

function getNonOverlappingPosition(lat, lng, pixelRadius = 32) {
    // Project lat/lng to pixel coordinates
    if (!map) return [lat, lng];
    const point = map.latLngToLayerPoint([lat, lng]);
    let angle = 0;
    let found = false;
    let tries = 0;
    let newPoint = point;
    while (!found && tries < 10) {
        found = true;
        for (const placed of placedMarkerPositions) {
            const dist = Math.sqrt(Math.pow(placed.x - newPoint.x, 2) + Math.pow(placed.y - newPoint.y, 2));
            if (dist < pixelRadius) {
                found = false;
                break;
            }
        }
        if (!found) {
            // Offset in a small circle
            angle += Math.PI / 4;
            newPoint = L.point(
                point.x + pixelRadius * Math.cos(angle),
                point.y + pixelRadius * Math.sin(angle)
            );
        }
        tries++;
    }
    placedMarkerPositions.push(newPoint);
    // Convert back to lat/lng
    const newLatLng = map.layerPointToLatLng(newPoint);
    return [newLatLng.lat, newLatLng.lng];
}

// Utility to get risk class for marker
function getRiskLevelClass(riskScore) {
    if (riskScore >= 0.7) return 'risk-high';
    if (riskScore >= 0.4) return 'risk-moderate';
    return 'risk-low';
}

// Create a custom glowing marker with pulse, with de-overlap
function createGlowingMarker(lat, lng, riskScore, popupHtml) {
    const riskClass = getRiskLevelClass(riskScore);
    const [adjLat, adjLng] = getNonOverlappingPosition(lat, lng, 32);
    const markerHtml = `
      <div class="glow-marker ${riskClass}">
        <div class="pulse"></div>
        <div class="dot"></div>
      </div>
    `;
    const icon = L.divIcon({
        className: 'custom-glow-marker',
        html: markerHtml,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16]
    });
    const marker = L.marker([adjLat, adjLng], { icon });
    if (popupHtml) marker.bindPopup(popupHtml);
    marker.addTo(map);
    return marker;
}

// Replace addSensorMarker to use glowing marker
function addSensorMarker(reading) {
    if (!map) return;
    const riskClass = getRiskLevelClass(reading.risk_score);
    const popupHtml = `
        <div class="sensor-popup">
            <h6><i class="fas fa-microchip"></i> ${reading.location}</h6>
            <p><strong>Risk Score:</strong> ${(reading.risk_score * 100).toFixed(1)}%</p>
            <p><strong>Plastic Concentration:</strong> ${reading.plastic_concentration.toFixed(1)} mg/L</p>
            <p><strong>Water Turbidity:</strong> ${reading.water_turbidity.toFixed(1)} NTU</p>
            <p><strong>Status:</strong> <span class="badge bg-${riskClass === 'risk-high' ? 'danger' : riskClass === 'risk-moderate' ? 'warning' : 'success'}">${reading.status.replace('_', ' ')}</span></p>
            <small class="text-muted">Updated: ${new Date(reading.timestamp).toLocaleTimeString()}</small>
        </div>
    `;
    const marker = createGlowingMarker(reading.lat, reading.lng, reading.risk_score, popupHtml);
    setTimeout(() => { if (map && marker) map.removeLayer(marker); }, 120000);
}

// Replace addSatelliteDetection to use glowing marker
function addSatelliteDetection(detection) {
    if (!map) return;
    const riskClass = getRiskLevelClass(detection.risk_score);
    const popupHtml = `
        <div class="satellite-popup">
            <h6><i class="fas fa-satellite"></i> ${detection.area_name}</h6>
            <p><strong>Detection Size:</strong> ${detection.detection_size.toFixed(0)} m²</p>
            <p><strong>Risk Score:</strong> ${(detection.risk_score * 100).toFixed(1)}%</p>
            <p><strong>Confidence:</strong> ${(detection.confidence * 100).toFixed(1)}%</p>
            <p><strong>Source:</strong> ${detection.source}</p>
            <p><strong>Method:</strong> ${detection.method}</p>
            <small class="text-muted">Detected: ${new Date(detection.timestamp).toLocaleTimeString()}</small>
        </div>
    `;
    const marker = createGlowingMarker(detection.lat, detection.lng, detection.risk_score, popupHtml);
    setTimeout(() => { if (map && marker) map.removeLayer(marker); }, 300000);
}

// Replace addCleanupReportMarker to use glowing marker (always green)
function addCleanupReportMarker(report) {
    if (!map) return;
    const popupHtml = `
        <div class="cleanup-popup">
            <h6><i class="fas fa-hands-helping"></i> ${report.location}</h6>
            <p><strong>Total Items:</strong> ${report.total_items}</p>
            <p><strong>Plastic Bottles:</strong> ${report.plastic_items.plastic_bottles}</p>
            <p><strong>Plastic Bags:</strong> ${report.plastic_items.plastic_bags}</p>
            <p><strong>Food Wrappers:</strong> ${report.plastic_items.food_wrappers}</p>
            <p><strong>Team:</strong> ${report.submitted_by}</p>
            <small class="text-muted">Reported: ${new Date(report.timestamp).toLocaleTimeString()}</small>
        </div>
    `;
    // Always use low risk color for cleanup marker
    const marker = createGlowingMarker(report.lat, report.lng, 0.2, popupHtml);
    setTimeout(() => { if (map && marker) map.removeLayer(marker); }, 600000);
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

// Chart and Modal Functions
function showChartOptions() {
    const modal = new bootstrap.Modal(document.getElementById('chartOptionsModal'));
    modal.show();
}

function showPollutionBarChart() {
    if (!currentRiverData) return;
    
    const pollutionData = getPollutionChartData(currentRiverData.name);
    
    document.getElementById('chartModalTitle').innerHTML = '<i class="fas fa-chart-bar me-2"></i>Pollution Types - ' + currentRiverData.name;
    
    const ctx = document.getElementById('chartCanvas').getContext('2d');
    
    if (currentChart) {
        currentChart.destroy();
    }
    
    currentChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: pollutionData.labels,
            datasets: [{
                label: 'Items Found',
                data: pollutionData.data,
                backgroundColor: [
                    '#A5D6A7', '#66BB6A', '#4CAF50', '#388E3C', '#2E7D32', '#1B5E20'
                ],
                borderColor: '#2E7D32',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Pollution Types Distribution'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Items'
                    }
                }
            }
        }
    });
    
    const modal = new bootstrap.Modal(document.getElementById('chartDisplayModal'));
    modal.show();
}

function showRiskLineChart() {
    if (!currentRiverData) return;
    
    const riskData = getRiskHistoryData(currentRiverData.name);
    
    document.getElementById('chartModalTitle').innerHTML = '<i class="fas fa-chart-line me-2"></i>Risk History - ' + currentRiverData.name;
    
    const ctx = document.getElementById('chartCanvas').getContext('2d');
    
    if (currentChart) {
        currentChart.destroy();
    }
    
    currentChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: riskData.labels,
            datasets: [{
                label: 'Risk Score (%)',
                data: riskData.data,
                borderColor: '#EF5350',
                backgroundColor: 'rgba(239, 83, 80, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Risk Score Trends (Last 6 Months)'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Risk Score (%)'
                    }
                }
            }
        }
    });
    
    const modal = new bootstrap.Modal(document.getElementById('chartDisplayModal'));
    modal.show();
}

function showDataPieChart() {
    if (!currentRiverData) return;
    
    const pieData = getPieChartData(currentRiverData.name);
    
    document.getElementById('chartModalTitle').innerHTML = '<i class="fas fa-chart-pie me-2"></i>Data Distribution - ' + currentRiverData.name;
    
    const ctx = document.getElementById('chartCanvas').getContext('2d');
    
    if (currentChart) {
        currentChart.destroy();
    }
    
    currentChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: pieData.labels,
            datasets: [{
                data: pieData.data,
                backgroundColor: [
                    '#A5D6A7', '#66BB6A', '#4CAF50', '#388E3C', '#2E7D32', '#1B5E20'
                ],
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Data Distribution Overview'
                },
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
    
    const modal = new bootstrap.Modal(document.getElementById('chartDisplayModal'));
    modal.show();
}

// Chart data helper functions
function getPollutionChartData(riverName) {
    const reports = mockData.cleanupReports.filter(report => report.river === riverName);
    const pollutionTypes = ['Plastic Bottles', 'Plastic Bags', 'Food Wrappers', 'Straws', 'Cigarette Butts', 'Fishing Gear'];
    
    const data = pollutionTypes.map(type => {
        return reports.reduce((sum, report) => {
            const key = type.toLowerCase().replace(' ', '_');
            return sum + (report.plastic_items[key] || 0);
        }, 0);
    });
    
    return {
        labels: pollutionTypes,
        data: data
    };
}

function getRiskHistoryData(riverName) {
    // Generate mock historical data for the last 6 months
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const baseRisk = getAverageRiskScore(riverName);
    
    const data = months.map((month, index) => {
        const variation = (Math.random() - 0.5) * 20; // ±10% variation
        return Math.max(0, Math.min(100, baseRisk + variation));
    });
    
    return {
        labels: months,
        data: data
    };
}

function getPieChartData(riverName) {
    const reports = mockData.cleanupReports.filter(report => report.river === riverName);
    const zones = mockData.mlPredictionZones.filter(zone => zone.river_basin === riverName);
    
    const totalReports = reports.length;
    const totalZones = zones.length;
    const avgRisk = getAverageRiskScore(riverName);
    const pollutionTypes = currentRiskData ? currentRiskData.pollutionTypes.length : 0;
    
    return {
        labels: ['Cleanup Reports', 'Risk Zones', 'Pollution Types', 'Avg Risk Level'],
        data: [totalReports, totalZones, pollutionTypes, Math.round(avgRisk)]
    };
}

// Action button functions
function exportRiverData() {
    if (!currentRiverData) return;
    
    const dataToExport = {
        river: currentRiverData.name,
        riskData: currentRiskData,
        reports: mockData.cleanupReports.filter(report => report.river === currentRiverData.name),
        zones: mockData.mlPredictionZones.filter(zone => zone.river_basin === currentRiverData.name),
        exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentRiverData.name.replace(/\s+/g, '_')}_data_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    DebriSense.showNotification('River data exported successfully', 'success');
}

function viewPastReports() {
    if (!currentRiverData) return;
    
    const reports = mockData.cleanupReports.filter(report => report.river === currentRiverData.name);
    
    let reportsHtml = '<h6>Past Cleanup Reports</h6>';
    
    if (reports.length > 0) {
        reportsHtml += reports.map(report => `
            <div class="activity-item">
                <div class="activity-title">${report.location}</div>
                <div class="activity-details">
                    ${getTotalItems(report.plastic_items)} items collected by ${report.submitted_by}
                </div>
                <div class="activity-date">${new Date(report.date).toLocaleDateString()}</div>
            </div>
        `).join('');
    } else {
        reportsHtml += '<p class="text-muted">No past reports found for this river.</p>';
    }
    
    // Show in a simple alert for now (could be enhanced to a modal)
    alert(`Past Reports for ${currentRiverData.name}:\n\n${reports.length} reports found.`);
}

function addNewReport() {
    if (!currentRiverData) return;
    
    // Set the river name in the form
    document.getElementById('reportRiver').value = currentRiverData.name;
    document.getElementById('reportDate').value = new Date().toISOString().split('T')[0];
    
    // Show the add report modal
    const modal = new bootstrap.Modal(document.getElementById('addReportModal'));
    modal.show();
}

function submitReport() {
    const form = document.getElementById('addReportForm');
    const formData = new FormData(form);
    
    // Validate required fields
    if (!formData.get('reportDate')) {
        alert('Please select a date');
        return;
    }
    
    // Create new report object
    const newReport = {
        river: document.getElementById('reportRiver').value,
        location: document.getElementById('reportLocation').value || 'Unknown Location',
        date: document.getElementById('reportDate').value,
        submitted_by: document.getElementById('reportTeam').value || 'Anonymous Team',
        plastic_items: {
            plastic_bottles: parseInt(document.getElementById('plasticBottles').value) || 0,
            plastic_bags: parseInt(document.getElementById('plasticBags').value) || 0,
            food_wrappers: parseInt(document.getElementById('foodWrappers').value) || 0,
            straws: parseInt(document.getElementById('straws').value) || 0
        },
        notes: document.getElementById('reportNotes').value || '',
        timestamp: new Date().toISOString()
    };
    
    // Add to mock data (in real app, this would be sent to server)
    mockData.cleanupReports.push(newReport);
    
    // Close modal and show success message
    const modal = bootstrap.Modal.getInstance(document.getElementById('addReportModal'));
    modal.hide();
    
    // Reset form
    form.reset();
    
    DebriSense.showNotification('Cleanup report submitted successfully!', 'success');
    
    // Refresh the current modal if it's open
    if (currentRiverData) {
        showRiverInsights(currentRiverData, currentRiskData);
    }
}

// Make functions globally available
window.applyMapFilters = applyMapFilters;
window.showRiverInsights = showRiverInsights;
window.showChartOptions = showChartOptions;
window.showPollutionBarChart = showPollutionBarChart;
window.showRiskLineChart = showRiskLineChart;
window.showDataPieChart = showDataPieChart;
window.exportRiverData = exportRiverData;
window.viewPastReports = viewPastReports;
window.addNewReport = addNewReport;
window.submitReport = submitReport; 